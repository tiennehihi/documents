{"version":3,"file":"workbox-background-sync.prod.js","sources":["../node_modules/idb/build/wrap-idb-value.js","../node_modules/idb/build/index.js","../_version.js","../lib/QueueDb.js","../lib/QueueStore.js","../lib/StorableRequest.js","../Queue.js","../BackgroundSyncPlugin.js"],"sourcesContent":["const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);\n\nlet idbProxyableTypes;\nlet cursorAdvanceMethods;\n// This is a function to prevent it throwing up in node environments.\nfunction getIdbProxyableTypes() {\n    return (idbProxyableTypes ||\n        (idbProxyableTypes = [\n            IDBDatabase,\n            IDBObjectStore,\n            IDBIndex,\n            IDBCursor,\n            IDBTransaction,\n        ]));\n}\n// This is a function to prevent it throwing up in node environments.\nfunction getCursorAdvanceMethods() {\n    return (cursorAdvanceMethods ||\n        (cursorAdvanceMethods = [\n            IDBCursor.prototype.advance,\n            IDBCursor.prototype.continue,\n            IDBCursor.prototype.continuePrimaryKey,\n        ]));\n}\nconst cursorRequestMap = new WeakMap();\nconst transactionDoneMap = new WeakMap();\nconst transactionStoreNamesMap = new WeakMap();\nconst transformCache = new WeakMap();\nconst reverseTransformCache = new WeakMap();\nfunction promisifyRequest(request) {\n    const promise = new Promise((resolve, reject) => {\n        const unlisten = () => {\n            request.removeEventListener('success', success);\n            request.removeEventListener('error', error);\n        };\n        const success = () => {\n            resolve(wrap(request.result));\n            unlisten();\n        };\n        const error = () => {\n            reject(request.error);\n            unlisten();\n        };\n        request.addEventListener('success', success);\n        request.addEventListener('error', error);\n    });\n    promise\n        .then((value) => {\n        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval\n        // (see wrapFunction).\n        if (value instanceof IDBCursor) {\n            cursorRequestMap.set(value, request);\n        }\n        // Catching to avoid \"Uncaught Promise exceptions\"\n    })\n        .catch(() => { });\n    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This\n    // is because we create many promises from a single IDBRequest.\n    reverseTransformCache.set(promise, request);\n    return promise;\n}\nfunction cacheDonePromiseForTransaction(tx) {\n    // Early bail if we've already created a done promise for this transaction.\n    if (transactionDoneMap.has(tx))\n        return;\n    const done = new Promise((resolve, reject) => {\n        const unlisten = () => {\n            tx.removeEventListener('complete', complete);\n            tx.removeEventListener('error', error);\n            tx.removeEventListener('abort', error);\n        };\n        const complete = () => {\n            resolve();\n            unlisten();\n        };\n        const error = () => {\n            reject(tx.error || new DOMException('AbortError', 'AbortError'));\n            unlisten();\n        };\n        tx.addEventListener('complete', complete);\n        tx.addEventListener('error', error);\n        tx.addEventListener('abort', error);\n    });\n    // Cache it for later retrieval.\n    transactionDoneMap.set(tx, done);\n}\nlet idbProxyTraps = {\n    get(target, prop, receiver) {\n        if (target instanceof IDBTransaction) {\n            // Special handling for transaction.done.\n            if (prop === 'done')\n                return transactionDoneMap.get(target);\n            // Polyfill for objectStoreNames because of Edge.\n            if (prop === 'objectStoreNames') {\n                return target.objectStoreNames || transactionStoreNamesMap.get(target);\n            }\n            // Make tx.store return the only store in the transaction, or undefined if there are many.\n            if (prop === 'store') {\n                return receiver.objectStoreNames[1]\n                    ? undefined\n                    : receiver.objectStore(receiver.objectStoreNames[0]);\n            }\n        }\n        // Else transform whatever we get back.\n        return wrap(target[prop]);\n    },\n    set(target, prop, value) {\n        target[prop] = value;\n        return true;\n    },\n    has(target, prop) {\n        if (target instanceof IDBTransaction &&\n            (prop === 'done' || prop === 'store')) {\n            return true;\n        }\n        return prop in target;\n    },\n};\nfunction replaceTraps(callback) {\n    idbProxyTraps = callback(idbProxyTraps);\n}\nfunction wrapFunction(func) {\n    // Due to expected object equality (which is enforced by the caching in `wrap`), we\n    // only create one new func per func.\n    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.\n    if (func === IDBDatabase.prototype.transaction &&\n        !('objectStoreNames' in IDBTransaction.prototype)) {\n        return function (storeNames, ...args) {\n            const tx = func.call(unwrap(this), storeNames, ...args);\n            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);\n            return wrap(tx);\n        };\n    }\n    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In\n    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the\n    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense\n    // with real promises, so each advance methods returns a new promise for the cursor object, or\n    // undefined if the end of the cursor has been reached.\n    if (getCursorAdvanceMethods().includes(func)) {\n        return function (...args) {\n            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\n            // the original object.\n            func.apply(unwrap(this), args);\n            return wrap(cursorRequestMap.get(this));\n        };\n    }\n    return function (...args) {\n        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\n        // the original object.\n        return wrap(func.apply(unwrap(this), args));\n    };\n}\nfunction transformCachableValue(value) {\n    if (typeof value === 'function')\n        return wrapFunction(value);\n    // This doesn't return, it just creates a 'done' promise for the transaction,\n    // which is later returned for transaction.done (see idbObjectHandler).\n    if (value instanceof IDBTransaction)\n        cacheDonePromiseForTransaction(value);\n    if (instanceOfAny(value, getIdbProxyableTypes()))\n        return new Proxy(value, idbProxyTraps);\n    // Return the same value back if we're not going to transform it.\n    return value;\n}\nfunction wrap(value) {\n    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because\n    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.\n    if (value instanceof IDBRequest)\n        return promisifyRequest(value);\n    // If we've already transformed this value before, reuse the transformed value.\n    // This is faster, but it also provides object equality.\n    if (transformCache.has(value))\n        return transformCache.get(value);\n    const newValue = transformCachableValue(value);\n    // Not all types are transformed.\n    // These may be primitive types, so they can't be WeakMap keys.\n    if (newValue !== value) {\n        transformCache.set(value, newValue);\n        reverseTransformCache.set(newValue, value);\n    }\n    return newValue;\n}\nconst unwrap = (value) => reverseTransformCache.get(value);\n\nexport { reverseTransformCache as a, instanceOfAny as i, replaceTraps as r, unwrap as u, wrap as w };\n","import { w as wrap, r as replaceTraps } from './wrap-idb-value.js';\nexport { u as unwrap, w as wrap } from './wrap-idb-value.js';\n\n/**\n * Open a database.\n *\n * @param name Name of the database.\n * @param version Schema version.\n * @param callbacks Additional callbacks.\n */\nfunction openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {\n    const request = indexedDB.open(name, version);\n    const openPromise = wrap(request);\n    if (upgrade) {\n        request.addEventListener('upgradeneeded', (event) => {\n            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction));\n        });\n    }\n    if (blocked)\n        request.addEventListener('blocked', () => blocked());\n    openPromise\n        .then((db) => {\n        if (terminated)\n            db.addEventListener('close', () => terminated());\n        if (blocking)\n            db.addEventListener('versionchange', () => blocking());\n    })\n        .catch(() => { });\n    return openPromise;\n}\n/**\n * Delete a database.\n *\n * @param name Name of the database.\n */\nfunction deleteDB(name, { blocked } = {}) {\n    const request = indexedDB.deleteDatabase(name);\n    if (blocked)\n        request.addEventListener('blocked', () => blocked());\n    return wrap(request).then(() => undefined);\n}\n\nconst readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];\nconst writeMethods = ['put', 'add', 'delete', 'clear'];\nconst cachedMethods = new Map();\nfunction getMethod(target, prop) {\n    if (!(target instanceof IDBDatabase &&\n        !(prop in target) &&\n        typeof prop === 'string')) {\n        return;\n    }\n    if (cachedMethods.get(prop))\n        return cachedMethods.get(prop);\n    const targetFuncName = prop.replace(/FromIndex$/, '');\n    const useIndex = prop !== targetFuncName;\n    const isWrite = writeMethods.includes(targetFuncName);\n    if (\n    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.\n    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||\n        !(isWrite || readMethods.includes(targetFuncName))) {\n        return;\n    }\n    const method = async function (storeName, ...args) {\n        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(\n        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');\n        let target = tx.store;\n        if (useIndex)\n            target = target.index(args.shift());\n        // Must reject if op rejects.\n        // If it's a write operation, must reject if tx.done rejects.\n        // Must reject with op rejection first.\n        // Must resolve with op value.\n        // Must handle both promises (no unhandled rejections)\n        return (await Promise.all([\n            target[targetFuncName](...args),\n            isWrite && tx.done,\n        ]))[0];\n    };\n    cachedMethods.set(prop, method);\n    return method;\n}\nreplaceTraps((oldTraps) => ({\n    ...oldTraps,\n    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),\n    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),\n}));\n\nexport { deleteDB, openDB };\n","\"use strict\";\n// @ts-ignore\ntry {\n    self['workbox:background-sync:6.5.4'] && _();\n}\ncatch (e) { }\n","/*\n  Copyright 2021 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { openDB } from 'idb';\nimport '../_version.js';\nconst DB_VERSION = 3;\nconst DB_NAME = 'workbox-background-sync';\nconst REQUEST_OBJECT_STORE_NAME = 'requests';\nconst QUEUE_NAME_INDEX = 'queueName';\n/**\n * A class to interact directly an IndexedDB created specifically to save and\n * retrieve QueueStoreEntries. This class encapsulates all the schema details\n * to store the representation of a Queue.\n *\n * @private\n */\nexport class QueueDb {\n    constructor() {\n        this._db = null;\n    }\n    /**\n     * Add QueueStoreEntry to underlying db.\n     *\n     * @param {UnidentifiedQueueStoreEntry} entry\n     */\n    async addEntry(entry) {\n        const db = await this.getDb();\n        const tx = db.transaction(REQUEST_OBJECT_STORE_NAME, 'readwrite', {\n            durability: 'relaxed',\n        });\n        await tx.store.add(entry);\n        await tx.done;\n    }\n    /**\n     * Returns the first entry id in the ObjectStore.\n     *\n     * @return {number | undefined}\n     */\n    async getFirstEntryId() {\n        const db = await this.getDb();\n        const cursor = await db\n            .transaction(REQUEST_OBJECT_STORE_NAME)\n            .store.openCursor();\n        return cursor === null || cursor === void 0 ? void 0 : cursor.value.id;\n    }\n    /**\n     * Get all the entries filtered by index\n     *\n     * @param queueName\n     * @return {Promise<QueueStoreEntry[]>}\n     */\n    async getAllEntriesByQueueName(queueName) {\n        const db = await this.getDb();\n        const results = await db.getAllFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));\n        return results ? results : new Array();\n    }\n    /**\n     * Returns the number of entries filtered by index\n     *\n     * @param queueName\n     * @return {Promise<number>}\n     */\n    async getEntryCountByQueueName(queueName) {\n        const db = await this.getDb();\n        return db.countFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));\n    }\n    /**\n     * Deletes a single entry by id.\n     *\n     * @param {number} id the id of the entry to be deleted\n     */\n    async deleteEntry(id) {\n        const db = await this.getDb();\n        await db.delete(REQUEST_OBJECT_STORE_NAME, id);\n    }\n    /**\n     *\n     * @param queueName\n     * @returns {Promise<QueueStoreEntry | undefined>}\n     */\n    async getFirstEntryByQueueName(queueName) {\n        return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), 'next');\n    }\n    /**\n     *\n     * @param queueName\n     * @returns {Promise<QueueStoreEntry | undefined>}\n     */\n    async getLastEntryByQueueName(queueName) {\n        return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), 'prev');\n    }\n    /**\n     * Returns either the first or the last entries, depending on direction.\n     * Filtered by index.\n     *\n     * @param {IDBCursorDirection} direction\n     * @param {IDBKeyRange} query\n     * @return {Promise<QueueStoreEntry | undefined>}\n     * @private\n     */\n    async getEndEntryFromIndex(query, direction) {\n        const db = await this.getDb();\n        const cursor = await db\n            .transaction(REQUEST_OBJECT_STORE_NAME)\n            .store.index(QUEUE_NAME_INDEX)\n            .openCursor(query, direction);\n        return cursor === null || cursor === void 0 ? void 0 : cursor.value;\n    }\n    /**\n     * Returns an open connection to the database.\n     *\n     * @private\n     */\n    async getDb() {\n        if (!this._db) {\n            this._db = await openDB(DB_NAME, DB_VERSION, {\n                upgrade: this._upgradeDb,\n            });\n        }\n        return this._db;\n    }\n    /**\n     * Upgrades QueueDB\n     *\n     * @param {IDBPDatabase<QueueDBSchema>} db\n     * @param {number} oldVersion\n     * @private\n     */\n    _upgradeDb(db, oldVersion) {\n        if (oldVersion > 0 && oldVersion < DB_VERSION) {\n            if (db.objectStoreNames.contains(REQUEST_OBJECT_STORE_NAME)) {\n                db.deleteObjectStore(REQUEST_OBJECT_STORE_NAME);\n            }\n        }\n        const objStore = db.createObjectStore(REQUEST_OBJECT_STORE_NAME, {\n            autoIncrement: true,\n            keyPath: 'id',\n        });\n        objStore.createIndex(QUEUE_NAME_INDEX, QUEUE_NAME_INDEX, { unique: false });\n    }\n}\n","/*\n  Copyright 2018 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { assert } from 'workbox-core/_private/assert.js';\nimport { QueueDb, } from './QueueDb.js';\nimport '../_version.js';\n/**\n * A class to manage storing requests from a Queue in IndexedDB,\n * indexed by their queue name for easier acc// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('./common');
var assert = require('assert');
var EventEmitter = require('../');

var e = new EventEmitter();

e.once('hello', common.mustCall());

e.emit('hello', 'a', 'b');
e.emit('hello', 'a', 'b');
e.emit('hello', 'a', 'b');
e.emit('hello', 'a', 'b');

function remove() {
  assert.fail('once->foo should not be emitted');
}

e.once('foo', remove);
e.removeListener('foo', remove);
e.emit('foo');

e.once('e', common.mustCall(function() {
  e.emit('e');
}));

e.once('e', common.mustCall());

e.emit('e');

// Verify that the listener must be a function
assert.throws(function() {
  var ee = new EventEmitter();

  ee.once('foo', null);
}, /^TypeError: The "listener" argument must be of type Function. Received type object$/);

{
  // once() has different code paths based on the number of arguments being
  // emitted. Verify that all of the cases are covered.
  var maxArgs = 4;

  for (var i = 0; i <= maxArgs; ++i) {
    var ee = new EventEmitter();
    var args = ['foo'];

    for (var j = 0; j < i; ++j)
      args.push(j);

    ee.once('foo', common.mustCall(function() {
      var params = Array.prototype.slice.call(arguments);
      var restArgs = args.slice(1);
      assert.ok(Array.isArray(params));
      assert.strictEqual(params.length, restArgs.length);
      for (var index = 0; index < params.length; index++) {
        var param = params[index];
        assert.strictEqual(param, restArgs[index]);
      }
  	}));

    EventEmitter.prototype.emit.apply(ee, args);
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                      ıŞ€ããcS†DQHôz=”R„axà˜¦ÌÏÏ³µµÅÙÙ‰!“W§a×5§†Î\?ğ‚ˆÉdb8‚B}©€,ñÜ×Ÿåİïx3¿ô‹?Ï—·ø;çïøÿğø‡¼ç=àGìÇø•ÿ.kë—˜[XãáGß¶Å×{†¹Å&n`™Nb­fà¡Zpw{‡7n05ÊâÒ2››çì:ğ¨×ëDQÈææ&Y–ÍÂ™ç™,F5¶i³,£Ùl2gÁÏ2ÏI“˜õÕUî^{‰w>õï}ë“öh†>¿øó¿À¯\ã‡şù¿æf’òã?ÿËNÄ\g‹¨}oa‹wğ[™ëÔ¹ûÆË¼ó­ïàp{›7^½ÎpãùuON˜››çøø[·nñä›¨–gFDQ€ë¹Já8fËj8Q~ ”¦,æçĞIfFC£1YV’Ä1§g=²,e2‰)Ó”f«eNòÂˆ­‡£Ò¶XY\¢øœŞÅšôø¿~ìee>dwïºHØXX`pû×_z•~¯Çæ•«<òÎ·pñƒ ]ôNyï»ŞÁ÷|çÁÎö6Ï½ø"Ò?4ºD‰
~ª‘J£Š[
|×åôè€á`@P½ïJW×‰µäÎásk›\xøa
é`ÃIBX–E¤f“Ë2Ú­ifX–fD«•BLåóUgoºõU–%I’İŸm›ŒFÅós]—²¬F¬)PÎ„–e/eU NÇÆã",9Ûb”ÕÒÈ]`ÙÂ1W©µ¹ñ». ©7š\¸|™ãî)¯Üx(ñj– KØXØXÚÂsšµ¾ãRæ9È§6ß¡@hA§´©i9ÈZOŞyÿü;Ÿà¥ã›È°A©ÁŠ3Ë!vE2fŸ?û®0Šıñ§RâğŞ°#şú»>Ì›ÜŠIÌï^ç×_ş2EÍ×!Ï2òÂ,:M?GH,$Bcò]l-0å Ù,hK µÄv½jsÎ@z­¨[lnñîGäWæÛzo¹r•7]ºÄ•­s\:·ÆR£ciK0øöw>Å¿ùÈÿDÚ;¥œôù³ßñ­eÆéáë+K3b!40ÎR¤å¡qøê×^BiA„,ëxH%şoºş<Ì®ì¬ïÅ?{­=ùœšKUš‡Vênw·»Ûí¡=a3ÙÌdÀCBˆà&Á¹¹$„$77~I€8!‡ÙÆÆOm÷à¥–ZRK*I5OgÜó^ëş±ö9R~õ<çiUIjÕÙµ÷Zïzßï÷ó¥Ğæ>k5&Ç¶©HÁGĞ®™ïUe¦`”Ò&Í
³³¬ïí±±·‹ÄÇv$–2ğâXeìíï1ÕlsÏ]wrñò« v¦Qİó3s¨À&²-T\ÇæP2;3C'C<×Å.¡Ñ†T©' óÒlRioÃt@§„ÚfHË¢Z©2;3Gàù¦€Ê2„ÇvL~«Ö¤yF^Õ
8’k×¯³¶¹°%–”¤E>Iw°²‚¥¹¦[mÒ(F`LµØÚÙa»»GQ>?…V·pš¤8Ò&°]î¿ëw¸ƒ"I!W·bíÊˆAë¶æ‰(_XH[’¥•J…B+¾ğå/rò»¸ûÁûñ‡Í›_áM¯{€w½íqÎ¾ø,ƒ^—cG°|èk7o…CÃ/l7XİÚäÎûÎ`9fÒ°sm…Ík×˜›f˜Æ¬íï!<ß`¡
£ïj5M$Ùhd Ğ®ç‘9Ò1üÔ$IXZ<ÀtgŠ,Ë†¦!caŒ‘¢,ÍXÛ£İî „À³}’¨\§„9äzU{¶14xåg—ÿGÚ·LnªÀq=lÏ7X*mîÁ$™››FÆ«mI¥Şâÿşå_&QÚèx…Ä*×±Ëq¦FZ6K’f®ï“A˜˜d%×õ°¥‰lsl›(ŠÌLÏ˜¦’%è÷{„Q„#¤Á>ÊLX„I«²Ê`œ&“ë’æ™)öò[Í­$‰±ÇÑc>Ÿ¶¨Öê¤YN1ŠÑ…¢9&)i’0™Ÿ™¥Ùìø>a8"ÏR\WN$W£0$¨TQÊdg¹2&#a¸N‰»©|;#Ğ<kë–yÃšŠ3g–€·ã3ìvqı*wİu†İı>X._e%¨d„ïÚ¸¾ilììî0?3IÈúÊäÌò‰ÎÎÎÒjµˆKòv½^g4E‘¹ñ––Jñ©AÃ´Ûm?N»İ&/RÂh„ãšMPÚ‚V«I»İbuõ&QšlnìÚ£p–`zz†Z½–	IÚ`_êGo‡¯<ñ9>úó?Ë/ÿÊ/‘çO=ùUŞğècüÈG~”—Î^àïüÈ±½×cfñÇOŞÍ½¯{€/ğêµË,œÃq5i™MÕ’Ëfmuƒk×®á8{{{\_Y1$qaÑn·©ÕªìííQ¯×&sùIäKÙõK³tÂxC#wvvèLÍ¦c›„4½ı=Î>õ%~úÇ>‚‡èdÄ¹³/ñÏşÅ¯ò]ú[şåoÿ)ó'ïbĞç¥ç¿Ê…+—ºÏŸ{…¯{ü]l­]àŞ;ï¡»¾ÉÕKWÀ²Ir……`gk‡n¿Ë›ŞòFjµ*«XZ$Éıçâ:–4cHÏ7&›<Í(òœ\å4J””.ıı>®ë³¼¼LV˜“R£Ñ`4±¿ß%ÍR
4ïS­T!+ptÆúË|ï{ŞÅ£w ßİ¦Ò1×ÏÇáú¹‹ìnï¢‘<ôøãL?J*4a£²œ@ÀÖú*óÓÓ|Çw¾Ÿ·¾áa¾ğ…Ï³±¹MÍ·AÛP(Ò$Ãõ|,K)®#Á*èõ÷ÙÙ\Ç¶Àóºƒ!íÙy?Æõõu¾üÄW˜™åàÑ£F§¤¡ThÕêŒC\ÏäğN[J£”ANLÀÌyNµZ5ñg¥.glIÓ¥Ë(¦r1ÉÊñ²í˜6È22Î–†ù§”áš•ã4YJÆããLØåbí8Ë*Œ–E½•ã¸¸¹"‰#â<åÀáC¸AÀó/Ÿeuo—NP¥âÕ¨95DvnQ÷+Ôİ ÛøX(KT*&bMÚX­[®æc_ü¿ÿ¥Ï0Ê¤]ahi
¥ğ$EJá(d¦øæGßÎÌÌ,ûÓÿ…­M.µ,lËæİw>ÄZaÄ“á¿í«t³+×$EÎ‹q„[9Â²J½éö˜Ùd6ÅºeœšäŒíàh…Hc¼$¢QÔu—&„×¯R³mÏf®^áÑîå¡ûÎğè÷ñ¶7<Ìûß÷M¼ùÑiû’Ÿùû?«RT< U÷©ú»{»,//%	Ú²ğëu2Ë"¨ÕQZĞlN³»3àSŸş,R:‡}*¾G-¨¢ŠEAÆØBRq=$†œ¹ëNÂp€§,æ¦gÉÂx~…j­Åêæ;»ûX–K–'Ø–ÀÑšL¥ˆÀg”E¤ıˆNµÉ½÷İÇõW¯áK­FıÕ©6Ã4fÆ4[-ææçÙÙİaoŸzÕèëò,C‹qáWc`™bò`Ë¢IZ™ë8Ô«UŠÒÜdMÄ€LğG©Ê)´¦Ñj’ê‚ëk¬n®›ÂÆ5İÁq,ò8ğÈ%\Ë¸>mÇa?qíú
½p€]&“8¶À2#bá2?=Ãc<ÊL»CØbi"ÄJİìXÆ¡&ÃÁ[…aµ°··K{f†$MøÜ—¾È‰;NòºG"Í3šËp};æøà·+Ï<õ™Ê¹ûôißc813=ÅáÃ‡xşÜ\^½Î›¾îí‹„Í½mfê-¾øçŸfyjŠóˆªÏ•5¤_¥P&~à—ë‡E­^'ŒBáÏóÈK°0…féÀÓír®_¿Nš˜şí£D­Lëº4é†!•˜¬…ë9¦Pwä$yÃq¤5f Ş—[ZÔj†g«®ï"¤ ‡lílsÿİw¢…¤33Çÿóë¿Áù«7È´F	“¿«•Â–N©ÁÓX¢ÀBG1§Ÿb4Œ)4¸õ*©2kŸ-$®”È²hã˜4I¨V*EnŠUÛœÃáˆ(Œ†Daht·IŒ!“²kZà9.y‘O´ÛIq9b5ñ³>ÍV×v PdIÊîŞaâH¡!ı>Y®|—^w¯tjGh`Ğš<Ut:F³Ÿ–Æßs+ø6Wğí5‡(Äy^ re ·¥O9¶CœÄ`™ÈĞ^·Ë ?àÔ©;I‹œn¿O–çÌN×ÙŞŞ ‘¶MµZ'CZµ€Kç_D.9ıÑééiÓ–CÂ0¤ÛíN"ßZÍƒşno,KI³„ù…9ƒ>^9O†&²Äu)Š‚f³YMÁ8Öú@Ç4š-:SSøF‘¸4íèhÔçÆÊeşÙ/şşÎÿ ¯¼r‰ë×WÒ¡Ölóïşı¯ñ¯şÍ¿£ŞœæÀ¡£ÜÿĞ£ÌÌÍòò…—Ùím3·0M–NRµRCJ3+C®¼zİİ=:ív›V³Nœde¡Q­Uğ}ÏsÙÙÙ¡ÕjZx	ÉBàzŞk²ûâ(Å±]l×!A©rTÙàóù~üÃâ‘×!îíòòÏ3ŒBV·»|ÿı}~î…;|+Ce1ôyæŸamõs÷œ&—‚©Z[Ø[ßB&ç_:G½ÑD•i#i!‹ïúÎïâ3Ÿı4íNƒ 0 Ìé™i”²Ì)¦lo‡aHĞ§R˜™™Â¶*ÏÑ%{¬ÕîkÍµë+ìúh­Ãˆ4I˜Âv2U”xƒÅîÖ5î9y„o~ó˜oøT‰´p¼
¶¹òÂYÒ(£@pì»I=‡B
$Š†`Ù¾ï²·½EÜë1Õlòáïı>dñÌSÏâZÏ6'Ò4×„y¶$ÓĞ¨·p\‡­-²,¥Vo’)sïu:Mf¸øÊ%VV®Ñjµ˜›eÔï3ê>Ä‘HçVG×äb ¯çº¦+UŠŞ]×ÜÃI’`—Ú”[ñ¦;â–RQFè’ídŠ¼¢(óX•Ñs×¹-)ÄtĞse.[7Û–Päè"GZ&®Â63ÚŞ¤@‹…åEæ.óê\¿yƒI£Ö¢Uopr‘‘ª‚BjœÀfiñ W.]æÚî:Í3'øÜÖUşßOı_ºq]ˆ
MáØDÚ@kª‰<óSÅ»~‹|ü³ŸDŠ§Z%#îæø†Ó“sÓMøİç>Ïê`Štq`™b‘1zD«Û6gƒêÚ¸à
¹P(İ· ĞÖXyÌŒ<vêï¼ÿo>so¹ï.Şxæ4Üu’;O¢S¨V$õª‹-PE³|`w¾íMöwÑyD½êãHÈUÊT»RšŞ OP¯ ‰ƒ[rœ*›Û{üáı~ÅçÌ=§Y½yƒp2;5Gœ&x¶ƒ,ŒîÊ–’v»ÍûŞÿ^SŒŸÿÊ—™'Î3æ–òÙ'àùó˜>@˜&¤*Á³$Rk
2ßFh›,
¹r}• Ùfay™p0¤Z©‘Ûpqm·Ygjn¿ReåÚŠéXû†-gÓaÑvÙ›ÀŸËÙÕ­Ë®DY@ÍM¶´ñ=ßH%ÊX¶qGM£)ÊûQ8á:¬nnpcm•L+“¬•Ñ„•#È,ËhUX"SÛh‚»Ã>;;;“ï£ÈÍh×Ö8gî¼›Ç£’Œa·‡k»¨2~Ñ÷}rZS‘¥o~ãg}og‡å#‡¸¾¶Æ3Ï=ËİgîáÈ±#ìvw©œ$ÁÏr>òÁòô—?O¡Rîİ}i†'ÎŸ?G«ÕàÌëB¸6‘Tœyìõ8
o~ç;7¶™¯7xÿ7|#ÇFÖ*|î™§‰”¢R¯!$KŒ¶Ë3]·4Ëˆã„¢Äº 5µJ•é©)¤„QÈµë×MµÔlêÒ¡5Ú@±ë:pÍôMÈÒ4ãàJ‰eilÇ`W&R)Jˆ5¹FµzA¢… ¨7ˆ³[‚ë:¬¬\åü¹sÜûàëùÓO–?şôg®OTh,Q²•aúåY†Ö®gÇyQ°8€"Ñìv»Í¶`	Ç ‘2“Üë÷M=b;T)M|šçùÄIü}\^d©‘ËÈÒ 'l3ÚÎ‹Üà´Ñ¬Z¥Ñ%NMq)(ï­òZùA[Ç¸WÈÊæ@˜Äh`fzÚ¦yÂ ßcccÏµñ<Ç@$	Òqq]Ÿv§ÃÒò2i’’š4ÍŒ6¨ÜÓmÁ·€²t&Ë¢V­šÎc9i´,LÔ¬*˜î¥	ƒÁ€Bå45|ß&FÍ*{»;$¾WEºaQ­8ÄQé6f?Úív©T*„aˆçy,..bY»»»T*¦+¶x`Ámµ¦ÙlNÆ_ãQØÌÌN‡<Ïğ·a3„›:išR©T˜™£^o˜Å_ÙT«5Ò8¦(RÎ¾ôÿé7şßòŞwóâóÏrsuƒz½IV(şğùÂ—¾BgvÙ…ƒ|Ó{ŞË^·Ï“O?² Õ®Š$Š	G	¯N’¥\»¶Âõë7K¨G¯×Å÷}ß£Ñl333ÍÊÊ
a8b~~Ş @<oRøEAµZ5BİÛÒ ’$Áq||? 7P+»(µJÀ«¯œ§U«ğ³ÿï±ví2UÛâ•çøóO†7¾ãİ\º¹ÅV?â§~ú§ù£O~ŠÅÙ%Z®‡rówŸ¤5×¡»,ÏtØ[]çÈì,gŸF«eKƒ®-8~Ç	Ò,â;NR¯WJ€`0|‰àØ.….L®g½Fš¤ú]Û&ÍrÃ!7o®ñâ¹³\¼t™Ş`„–`».®cÆq’0ˆ#“Z¸Ò&´ğ=ßşm48}x™0¡VÁõ*„½˜+_}á`H?yË{ŞÃ°HHt†PŠ")¤Ñ58ÒÂw\ú;{L×L×¸YFĞesg­nµN˜kmQ Ğ¶ Ë ËsãP#Ö77ŒÓ<p)òßö™šš"ËS¾úÌWéœ8~ßu	‡!iarŸoO±±0)ãHÃ4+&é7E9æM³pÛ¶ë9DQ4é0ŒSE\ß› 'Æ…æ˜¨µÆ*åRšÑG¡e\læ%|T—™˜†v¯‹ÜtMlÛèzÊ±BaL†ë:œ<}Š¾•³º¹Å«W¯%v‹J«‰Ûªâ·ëĞxêK_ÆÓ‚ûßğüÜ—øÍOÿ!{Ñ
.#	i–ãj'p	Ã­TñÃg8sßëøÃOü)WúÛcc»ì«Œfáğá“oàØÔ¯6şÓWÿ‚½í-ğ)”bDÔÂ©-ËŒo¬Ò™XjyrUàX‚Bh

mil4‚ ÁV›ÃSN-Ìsß‘CÜ{h‰&9J8¶0ÍÌü­FÙù)YÂõ*¿âxSÓMúı=T‘âØFZàÚ6™2	df±öª>¹e˜th¨zY’Ô§xò+ÏpéÒ%şõ¿şW|ı»ßÅÜÌ^¾H&HÇ&OrÏGZÇuØØÙÄqm¤çğ¿ı_‰ŠœÇŞş8N£Á}æ/8wíşôı4APf¡ZR›ìã´H°l?—ô‹s+—ÆÂ6ÙÃ#²Ya3ê±±¾ÅÍ›«ØCàù¦Û/Lá`Û6JŒ“?Lá¦tÙ	ÔFóWäÆ¥ ,ĞÍı9Öå…è\rm,Æ)p|ë7n°¶µaÆö¦R4Ï‘*°t™ˆ“f,ÎÎqp~‘8ŒÌ÷dKn¬Ş¤Û7€.–†¹©N8Á½wİ-m²8Á—¦pP…8û…\nöã[–£NË²˜™âÉgfms“zp²¹êò=­_~•üS?Í—>ı)ª®à‘7¾½î>Õ ÂÚµX¶ÅáCéîï1³´H7‹yİ›åş7<Â¥+—ù­_ı÷¼áŞ×±qõÍFƒÔ¶øâóÏ)%m’TáÁ›¨‚ 0È¤ÁpˆíØ&%D¦ÚZÍ&ÕJ•k+×èfl~[
H‘ß*¢4"ğê•:ÕjÕhÖ±¨>B`Š?!©Tªæg^ÜìRw8ÎŞ•Bãrc7Eª€8±|`ápÄ“_}O|æ³XNÀ Ë@¸ÚB[f–g¹)V…‰ µĞl\Ûå®;Îpéê
Ã,'Ìr,-ğ=¡1%Wûûûx®‹çš9.e]JC‘¦4šMÚí6¾gPlEù^LÓ ŸHµ\Ç)GÂÅ„åj	Ë„,”k½”çz¸®gíLÍLg)ı^éÙšÍ&XAàÓj5ÍÓ£M-T©TÉMP	¸óî{˜îL1¸zå*ÓÓS8mÌ%ªÀø©nÇæ¿[/]f™#ÒSf Ø·ê‘–cuÇ¬Ş¸ÎêæÍv“™¹)1púU,Ëe¿QkÔØŞZ%õKÇïş¨ëºìííİÊ¯UŠ89~ü8IS­U8~ü8ƒÁ€£GráÂ„0˜'Nà8½~Ÿùùy‚jÍ0êò´…Ğ6q˜’¦™‰è‘6Âq±ƒ*qa †BçÄû{ä½.¿ø…é)~èÃ?ÄÍ›k|Ã×¿/}áI~îç‰Ş~N½9Çé»ïçM?ÎÇÿèxå•ç™mSñ=lKPdÂ’T*¶¶·¸~ı*»;{¸GµZ£Ùlâº>;;;hE¡è÷û=zŒíí]Vo®2Õ™Áó´²°„i«£Í¢¡
M§ø¾G®–í!)H}öz.¯Ü¤×ÛçÙÏŠŸüğwsli‘4Îèu#~÷c¿Çş^oûÎïáşò‹¾ï!~à»ŞÄµk+<ùÔsÜıºw2{âAº‰fgsƒV­Î÷½¤¿‡vY¿z…J¥IwÓjµH£>'áşûï£ E8ÆUZm4Èò+âH¢($O3lm•#³ˆÇáÕ•>÷¥§¹tmì ;pq+R
’Ø@3¥#†h­hÖjHË¢?èÑ‡¼şôª6n¬“á·;ønßñÑyFïÊv6vğšî}ç;ØGÔ„C«ReÑEN%¨rù™—Q£”úÒÃİu^ùÔŸSìñ¾{Oã¥WÎ³3`IÏv°¥…F‘*›Àó±T¥3l×b¯·ÃîŞ>® ”éJtZæxõÒ«loíTªÌÎÎ0ö©V«$*#Ó)Ø¥1Â.OÃÊŒk=GàX ….VAœÄÔëò0"Û1]¥‘«| -“2‘©‚\Y ll¯RNËx¼Ñ[†(-«¤K™¶ŒqÓiÒ,GÚ¶ëPhQn¬Û–H¥)’”Xh×áhç ³sØ8·q…WV¯3Šll¬ñå§ŸäÔé;¸ûî3üÎœÿñòWt\²ÀÃ‹R´R$"°$Õ¼`$t‘óøéûyÛëå7>õqnt7P®Oî¹ôãË¶9´ø¦£÷‘T%Ï]|™¯^z™ÂÈ-oµ„ÍÀR(i™,aËE*c7Pª0àìB‘ù•Æ4ÉYò\:x„ÇNœàİ¯»·İ{š7ß{8Â©Å9Ú®,bZ
‹‹sÔ†‰Âr]¤ Q©`U*ÈŠğ=´4±’c¼(»¨Òñ°,áúHÇE
“’ Ò”Á¦¸M%¨ğ;û-~âï}„Ù…7Ö®ğàÃ¯ãüåW8{á5{†jP#×Z˜ùzµÎ+_å¹çÎ2·0G!-6ûzé<_½x™öÜ2q–á¹Zj”ÎI‹ˆ”ÂløJcç…Á	Y’Dhv’µİ-.ïnòJo“K[›¨ş€,)ª>®+¶…#-¢á€ªã£ÓeÉ1ÇÅ `Ä˜â¢”æŞ–@jÓaK#„”äVŠT¥ÆÁ©+Ş•’ÍV7ÖÈ•Æv]#©Ğyœà;.ĞqJU8Üqôx	‰*WW®ryc×ñh5›Ì¶¦¸çÔš_¦áWõ†çzXR"=¯V!×Š$KQEA¯ß§·»‡ïø¨$§V­e1A£N7êóÂÙÀ¶Y:v‚X)¤ç¡ÒŒºç0X_ãÇğ;¹|áEZ*>ôÖ×vğœ ÇÜ\»Êé£§(²…ÃHØ<sùU¾î[¿Ï½Ä¿ú…ÿ›£µ*÷Şsq‘su}ûz„¿øÌéc
%0«\QqÒ8Ã÷+#¢(Á“Éù<Ût¯_¿íØe‡ĞÀÍˆ»À±%™Ê([etæ¦ğ«.y—ÓpE»Ù&b¿Fg“ñ±S¾¥mÆÌÒ±)ĞåXU!ÑØ€-<l§B”ZøÓóôÍ(-ØîÉPÖl[yŒÒuMêŠ–8¶G–y‘´rî¹ãn¶wvHSEšì÷÷I³ˆv³…E	G#F£!sóóåáâ$%ËrÚi4éØ¸olÛ¤ˆim$2ã4Bá9n©«.Ò¦VkÒëö‰S3bã˜Lk*Õ-,†£!íiCÙğkU=N­ÙFY‚4KqüŠÕ÷‡ø®ƒm;ŒÂ”ƒÇNS›Y$Õ’õ­}Ò8!‹GT<‡F«Í0Îğl…gÛPdè,3#fK)…–.(òŒÑhhô—[âoL×>ÉÌÔÄó<!PyJ2Ü§¿·E6èR«vğı*q’SXQ­84[M,ÛEŞÿè[?Z­VéõzLMM†!JH­ïûôz=æææ¸xñ"QdØqišªeqìğªõ7nÜ`najµF¥Z¡35Åìì,»»{øÏÄ/û$iÎìÂ­v‡,W­)²”hØçáïçùgŸå'ÿşOrß}÷ó/~å_ñ±ÿşqşñ/üS¤ôX\:È¯=sóü¯ßÿ=^½r™»ï:=å;‰õªÕj‡C.]ºD·»O»Õ¡R©šRÈ<±m›íIP³ëº„áˆY—¤)[››lllL‚¤mÛ&Ï
FáˆÕÍm6nŞà•óçé&¼{åUæë>?öƒ?€PšõµuşàÿÃ^—ÙÙáw>ş‡¼ó=ßÂ¥½m8w«7·ÉbCzÑÏ•,NOÑ™krşù§pÓ×	Ê“çH¦:Üuïİ|á‹_àÈ±CØ=á1ÚÒà.¢(¢^¯ca‘D±ÉıÌV®­ğÉO~‚¯>õ<BÛt:Ó(U…!ªtªÚ¶IÅËNh£Õ¤(
²,›˜¶o¼ÊóO?Í¨·ÉÃİÏ©»N2ˆ"”VÌÎÌ²u…µµu:K‹œxğ>†ER9*M–ı×*U^üâ“Xª`ùØz[Û\{ö,»ëÛœ¸ã.ší6óssXYF¸»ƒ]dY‚%NN ¾ã‚Qš"mU(ÖVoRä^P—jU>„*çÏ½L4Š8xğ Zé2ËØt ¤%p]ÏèQ)4Y–_£MB”*™LJ¡Ê‘Ö-MŸY)òÛôX²D0ˆÒíË_ûwµ6zËñiÕ.õˆBˆ	* ×jÌŒÅ±,$ÂÄ|Y„	u–Å©S'pëƒ<båú’-ı‚~Ã·á˜åüÆ¿âÜ`»Z%N3%Lùu"•¡|	QDÇ6ôø;Nä›ögÆåŞ ÉŠ…@ ³Œ¯¿çN¶æØLüåóO±­b”ft']†y„íyØX…ÎÉP¸•€ÜÒ$iŒãH(2]ğÀ±C¼çñ7óØ™{XêĞ©zT];‰‡}„Ê™›™byy™f»…e;ä@kfŠJ½Š_«àú.¶ç 9)øÜ²«pûk2~¹-ıåö1mÛÈ‹/ãÈ¡C<ğàô=lÛ$kdqÎ—¿ü$JÇsP:eTŒ®çbKçûTÛvcu•ıŞ€Vg½şĞÈ-J½S8æ1WAc´•¶pIU†§ÒR?g+ÃI´AÕõXìÌqhz?É©¥9ioÄLÏÎ2c,Û£ĞåèeîYÀ;E¥@•8îqg[[LºØB¦-ÄDöcË[Òˆıî>Û»»fmõ|2eÁ¶m2‘o¿ß[­³sÆL¢ûİ.»İ}>ÂÌÌsósLMOS¯×	Ó„¬(°=í»$(ö‡}Öv¶¸±¾Æ«×¯qùÊ®Ş¸Î•Õ«(,––àúI–a	ÉÖÎ—.]¦Õi3·pÀt¬”"b¾Í+/>Ï‡¾û;Øİ¼ÁâÔ,Ü{?İ}‚J…F³ÉÅ‹˜jSjäyA­Ù&Öš»[H)øèÏüxßû9¾¸À•+WxÇÛŞÆÙs/Ó…„¹âòÊuSÓdZáØ6*/Ê6ÓOÒ„8MÊ¼Ù€Åùy×e{g‹íİ]s@*Ç•J)´R¦se¾.åV¶´i6äi
|Ï3ã{ß'M3„´^“R1O~6ê¶õh((&Zå¼Èh·ZÌÍÍã¹ƒî€0)ò×ñĞB—¶ŒQ®ÔvbiÂ0äø‘S$Œ2Å0N©ÔkŒFÃRÂU%ÍS”R‡CæææHÓ´œâõ&¡Æ|i1ĞZQ¯×‘R¼f"3~oï²G­y–‘e)ViÈÒL%uåV­VñË”4?¨bY’(Ni4št:S(Ãáˆ(qpiŠ‚4/†!Gagk›W.œ#plK³0?ËácÇ¸vc•QŸÎÔá($ËÊ÷"A¥Bš$X“½Ø¬ùã5j¼G+­(ÒŒ¢0XÛ62‚ı½]úqÊ¡åe£…Ô­E«Y£È3ä‘Ó÷tww·ÄvÜp8œ€WWW'!Ô[[[Í_š¦,,,°¾¶ÆÍµU:ÍV„g:®KV´š-‚Š_
~-­&©lÛÅ‘6®°Ùßİ!‡\{õ/\à½ï}/ÿò_ü~ò§ÿO~õßüGßÁé;ïá¾bcsƒ³çÏa»Ïsñ}wÒ¹”R²Yk½^¯Ô&:#„°µÜßß#ŠFØ¶dyù RJºİ®!’ÛæáH’„4M¹zíq1HÓŒ½½]ö»]ÖÖÖX]_g¯Û'	#3.¶ Ó¬qåü9Ş÷·ñMo+;[;ìw{|áó_dow›C‡qñÚ
ë½!>ş68²Lâøx•£AJ­Ù„Š`zºÁ‰#ËH;ãÒóÏ@4Ä&ÃÑqêï;Ã^bqiƒ‡–‰ÓÇ±	‚ ÇvHâ˜J¥b ÖÃ!¶%°-AÅxÏ'ïàà#Lµ¦‰Â˜hR¯W©Vkä™šÄCYÂ˜ ²ÂDŞÅI2ÉÔtUBÃÓüÈ‡¿—cÇ–‰Ó˜ Ñ@H/ğI÷v¹rå*‹Ç2sò(¡PH¥QI‚+m²,Å—6O}ú³,ÍÌràğO|æ¯¸úÜ+¸ÂaFl^¿Î”+¹ïàbÔÇ*26F=ü ‚¬xEÊ(%	JÜV9j@wÔewg)%µj•ÑpÈÜô,ÍJƒk—¯²rõ:j…¹ylÛ!‰bléà»&#ÍR
­È‹”J%(æÌ¸³ßhuÊR!íÉ¦8öjGšñ¯´'§WQjó¼0	·eDşµ_—ˆuğö¼Om[ lmá`NXXŠ%!Ø’~2âî×!Éwz¼şĞ|ï7}/_¾Ä¿øƒß¢×öéæ1E’QÅÆÒª#šQ,Mt2ä¾;îæ½ïú>ıéOsîæUöUl²g³)l´ËV•ïzäíTªUxõ,O®½Lîºeşª#$‰ÊI‚ <7 QŠ(D#-Ÿg|ëãoæë¼ŸÉÆv‘"ŠTqŸ™V‹Å‹Ôu
Ë"·$nµA­=…ßğ±ËÂÏrM„mKÇÆ¶¤-oa"n‹lºıóÛucãÅw|ı§¦§èLuˆ“˜á°‹ï»G#9ÎÙ³çÉF9¾g`ÆªÈPÊ¬1Â"ŠR‚J€íx$YÁ0ÊpƒÀ ~TNÅ°¥$Ir
qO‚Ü—XçXHS 
‹Qé¬®V¨~D+ÏiGCN4<üÈëõ*ë½>©6‚vC%*À°«)Cï­IŠğ$‹×Šª<Ö¯Ş*¤a8šÜ`àÙ>védTÚÀ¢‹Âštéf?¸dR¨té.Ğ&T`fš RAÚ6…6ñoa’ĞÙîíóòk¬l¬rùÆ
«klïïÒ‡ÄEJaÁìÂ,>ôYnÒw
­¸¹ºÊÖösó³ˆ ¥ËÖ·m®Íîk|è;¿•´¿ÏÁÅyî<q•çdIJ£ÙâÆÍÜ¸yƒGy˜4Œ‘Òf0
ñu>û…ÏñoõWù¦·½“×ß{/É Zõ‹KKÜ\ßä¹³géÇ	Ã8ÂrÌD¥M”k)öd*gºÕann–¢(X¹~$Mq\gR”)¥´^¤eôu–6#ø~@§İfºİ¡(ŒYÇB”r®’<U¢Gn/,Æ÷ÿ8FM”qÂ²ËgÄü¹$Œq„MÅ¯ĞnµY:°Äâì<ZßuÈ’Œ4A+\á-ÈU.#«•&K‡0Js““g¸Ò°aûış¤CÙl6¤iJ½nÖz“ Ræ•Ô…,K'•±GaŒúº=jÍs\<Ï%¢Ò½+°…mö!ÉÊk–Í vg
!]FQLœäXRÒh¶éõdI‚Ğ9yš‘f©[+A+Fİ}Ç"C8EgzšQ²¾ºNP­â:.Iãy6q8BXŠ$I'ÅøØ¨86!E
3!Ry"´Æql@/„ë±¾¶J­0İi›I9Y±rõUä0·?:vú§q1èº.ÓÓÓlnn255Å¡C‡X]]Å²,9ÂÍ›7M{6¹ûî»qßpš´*M&Vfzz
?¨T«ÌÍ.à”`çËÆÍ,­èíïğ|€üÁ¿Í?øC|ñ‰g8yç}œ<u'GOä+O=I˜„,,Îc»6ÕF[XLMMQ/¼ğW¯^%ã	¨9|úıÉPÌR´VÌÌLOÜ­Z«RóçN@¿RJvwwŞ¦Z5N&Ûfff°X][g8Qk4¶c(×ˆk·×nvù™ŸøQæšl)ÙßïóÔÓO³³³É™{Ï0J^ºx™‡rÇC1Jjiê­6VÃ£µØâğÑEÎœ:ÆşõW°ãÑÖ;ëH)…î:}‚7¾ñQÖ6×yÛÛßÆ('NÉ"3]¾J¦)O<ñ3ÓÓ4j5¢0Äµ=.^¸Ìå‹—É"Å ?ÂÒ’Z­‚ï{ôû=v÷öËqœéXŒÑãN©,³Ãı5¾ó[¿™¸»E£æ±p`~™x%ËÂU/\¢1=ÃÂ'	1”ÒØZ#-‰­4/ıÕ9uğ iñ™?ûª±¼pĞ8²lÉhu…JròĞAÚ³ÓÔ§gÙìõ¹¹³A³ÙÄó+„in2%¥@y’i£íÛÙÛaĞà»°±-É‰£'h4š<ıä3lonsôğQêµ:½^$3?ËµL'J[e±`hûiG)Ò5QNî”eÆdZ˜âÍu=““lYàŒ‰%àWë¯Áio/2¤-'áàã¯ÿŒeY(©Ø……­MŠÈ8ĞŞ¶Z•ÊRx®ÍÕg':w…÷=ü&NİqŠş/ø¯g?G„$ÏË¡æú„Y‚r$©UĞp]Dãg9¼—}ÇwóùÏü%Ÿ{é)º¶‚²ÛSQ%Š"Ïøúã÷qÏì!vˆø£§>Ïn"«²Ât*T‘#-S(¸ÊğÈR­Ğğ]´ÎQIÂÒÌúÆoÆ‡èİ-fmIEZÕ*–m18xğ0Í©)üZÍ@“m§à×ë¸<‹’…cDîqIÛÆ–æzYDÚš €Æ/)ìÉï[–(» •á5JYş,ĞTk„A»5ÅS_~š½=Ü2?t,@Â"Ëò2šÊCH£y¬5ÛÃ˜$Íğ|‹‚(áú–mÓLÑlÙÄEFG'¥ƒ²aSC®5»Ã¾°YªVxüÄ	î>z »áòÂÊUD½Ec8cöb©Å4Å­‰&–‰S·±ó,˜d›é±)@lÇ¦(ÃÑˆ0ŠJdˆ‡Uv$”Ö&DkŠR›¥µáÛ-X"ŠclÏ%ÉR*Õ*Íf“İî>yÓ¸qó&_½ÌÅ•«ÜÜÚ`gÑpHEeF·$ğZ&sS3ÌÎÌpßwš<U×§ßpéòeêA£†ãùìvûœf¸EAÖïrç‘%Í´9º0ÇéãwäQ‚Tj5~ÿœ÷Û·²¿·‹•&Ã¨ušü‡_ÿu¼÷^¾ïıïg´³G–†FÀ§tÚ’Ï?ñFI†ôŒæ×‘eQ¥™„ŒÓ&Š<ga~Z­Jo8`m}Û5ôB+òl¬/µH³·Œê“¶Ä’Â O,ÁÒÒ–¶L†½˜‰íšĞØü&ÿ¦Ã˜{ãâoœ "„ Y«£•&…¤IjÂZf¦g˜›šaéÀw¼«°ØÚß&Wå¸¢ÌToT,,dÌX"ÉSFƒ!yf:‹Y3˜.ÃªôûıÉJJIš¦X¥6Ú² Š¢	µA”ïiŒnËËûn¬›”Âì÷ı^×HO‡¢Px~@µZ+ù”ya4”çU¼Jİİ.™Òd…¢V¯373Mow‡"qÊÃL­V%<µ:k7Í¡/ËÂe‚Zí½®aû”*H¢ÇdiŒ´½Iá:.ú&8£òk¶H¡AXZeô“BX»{DÃ^éèVT|Šœ$1ìï#ÛG>jYçÑjµ˜šš¢ÙlÒ+£Û<ÏDÈôû}²,c×uév»&á‹KKæ"—Öæ‰p>Ï‰£Ø@’…Àu?Ró}Š4áÚåKYB–„ü£ô³=z‚Ÿú?Ã~oÄüC<şwÑšâ‰/?p³ó³X’<¥V«’„•J…$IX]]¥ÑhL:xİn×h-EgØ¶äè±#œ<y‚Z½ŠãÚ\»¶BµZ oŒ5<™Dëx¾G11sâ€z½_	£„h4"p=g¦Ø¹y•{Oåï|è{ÙİXÇñ¢,çÙç_`gw‡G~Û÷è"}ñ,Ó•iNŸº¿ZAù6í¦.Jùó_ûuîY:È«/¾DÅñp\›v»I»Ó¢Rõ8}÷iºı.B
ß%N"“§ìº,â8åä‰ãÆ†¯¶pöCµZƒ…¹%šÍ­V¦×ï‘f)®P	ê`QnT6^IJ¯Öj¸®ËÆÆßşw1Sxè;8vd‰Q’€ã‘YVß–¼úÊúÃw?ö¡.°
…D
Ûµ‰ö{œûÜÔ…ÍùË—X»~“í¹R“â¡h:G(V6V¹ë±7ò½ùqşä³…ò,vwvI“œJµNšeDqHàIjÃ¨T…b40ÈSÃ¥Jºş©ãÇ‡¼ø¼Éë\Z^2nÜ\&!• ‚í¸DaŒÆl’¶ë“9ÕZ½|µ¿kÓ5±0nâB¨ÂŒKÆWc$’¥£òÖ¸÷vşÓø·û5"áÛİÊZk”Ğ8l-AY´ [<)=¿?D]¾Áì~ÂÃ2ÕnóäÊEşäå§‰U<ÇCÇ	Ûg¶Cá€®ºˆşngErrors) {\n      if (refDestructuringErrors.shorthandAssign < 0)\n        refDestructuringErrors.shorthandAssign = this.start\n      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key))\n    } else {\n      prop.value = this.copyNode(prop.key)\n    }\n    prop.shorthand = true\n  } else this.unexpected()\n}\n\npp.parsePropertyName = function(prop) {\n  if (this.options.ecmaVersion >= 6) {\n    if (this.eat(tt.bracketL)) {\n      prop.computed = true\n      prop.key = this.parseMaybeAssign()\n      this.expect(tt.bracketR)\n      return prop.key\n    } else {\n      prop.computed = false\n    }\n  }\n  return prop.key = this.type === tt.num || this.type === tt.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== \"never\")\n}\n\n// Initialize empty function node.\n\npp.initFunction = function(node) {\n  node.id = null\n  if (this.options.ecmaVersion >= 6) node.generator = node.expression = false\n  if (this.options.ecmaVersion >= 8) node.async = false\n}\n\n// Parse object or class method.\n\npp.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {\n  let node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos\n\n  this.initFunction(node)\n  if (this.options.ecmaVersion >= 6)\n    node.generator = isGenerator\n  if (this.options.ecmaVersion >= 8)\n    node.async = !!isAsync\n\n  this.yieldPos = 0\n  this.awaitPos = 0\n  this.awaitIdentPos = 0\n  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0))\n\n  this.expect(tt.parenL)\n  node.params = this.parseBindingList(tt.parenR, false, this.options.ecmaVersion >= 8)\n  this.checkYieldAwaitInDefaultParams()\n  this.parseFunctionBody(node, false, true)\n\n  this.yieldPos = oldYieldPos\n  this.awaitPos = oldAwaitPos\n  this.awaitIdentPos = oldAwaitIdentPos\n  return this.finishNode(node, \"FunctionExpression\")\n}\n\n// Parse arrow function expression with given parameters.\n\npp.parseArrowExpression = function(node, params, isAsync) {\n  let oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos\n\n  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW)\n  this.initFunction(node)\n  if (this.options.ecmaVersion >= 8) node.async = !!isAsync\n\n  this.yieldPos = 0\n  this.awaitPos = 0\n  this.awaitIdentPos = 0\n\n  node.params = this.toAssignableList(params, true)\n  this.parseFunctionBody(node, true, false)\n\n  this.yieldPos = oldYieldPos\n  this.awaitPos = oldAwaitPos\n  this.awaitIdentPos = oldAwaitIdentPos\n  return this.finishNode(node, \"ArrowFunctionExpression\")\n}\n\n// Parse function body and check parameters.\n\npp.parseFunctionBody = function(node, isArrowFunction, isMethod) {\n  let isExpression = isArrowFunction && this.type !== tt.braceL\n  let oldStrict = this.strict, useStrict = false\n\n  if (isExpression) {\n    node.body = this.parseMaybeAssign()\n    node.expression = true\n    this.checkParams(node, false)\n  } else {\n    let nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params)\n    if (!oldStrict || nonSimple) {\n      useStrict = this.strictDirective(this.end)\n      // If this is a strict mode function, verify that argument names\n      // are not repeated, and it does not try to bind the words `eval`\n      // or `arguments`.\n      if (useStrict && nonSimple)\n        this.raiseRecoverable(node.start, \"Illegal 'use strict' directive in function with non-simple parameter list\")\n    }\n    // Start a new scope with regard to labels and the `inFunction`\n    // flag (restore them to their old value afterwards).\n    let oldLabels = this.labels\n    this.labels = []\n    if (useStrict) this.strict = true\n\n    // Add the params to varDeclaredNames to ensure that an error is thrown\n    // if a let/const declaration in the function clashes with one of the params.\n    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params))\n    // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'\n    if (this.strict && node.id) this.checkLValSimple(node.id, BIND_OUTSIDE)\n    node.body = this.parseBlock(false, undefined, useStrict && !oldStrict)\n    node.expression = false\n    this.adaptDirectivePrologue(node.body.body)\n    this.labels = oldLabels\n  }\n  this.exitScope()\n}\n\npp.isSimpleParamList = function(params) {\n  for (let param of params)\n    if (param.type !== \"Identifier\") return false\n  return true\n}\n\n// Checks function params for various disallowed patterns such as using \"eval\"\n// or \"arguments\" and duplicate parameters.\n\npp.checkParams = function(node, allowDuplicates) {\n  let nameHash = {}\n  for (let param of node.params)\n    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash)\n}\n\n// Parses a comma-separated list of expressions, and returns them as\n// an array. `close` is the token type that ends the list, and\n// `allowEmpty` can be turned on to allow subsequent commas with\n// nothing in between them to be parsed as `null` (which is needed\n// for array literals).\n\npp.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {\n  let elts = [], first = true\n  while (!this.eat(close)) {\n    if (!first) {\n      this.expect(tt.comma)\n      if (allowTrailingComma && this.afterTrailingComma(close)) break\n    } else first = false\n\n    let elt\n    if (allowEmpty && this.type === tt.comma)\n      elt = null\n    else if (this.type === tt.ellipsis) {\n      elt = this.parseSpread(refDestructuringErrors)\n      if (refDestructuringErrors && this.type === tt.comma && refDestructuringErrors.trailingComma < 0)\n        refDestructuringErrors.trailingComma = this.start\n    } else {\n      elt = this.parseMaybeAssign(false, refDestructuringErrors)\n    }\n    elts.push(elt)\n  }\n  return elts\n}\n\npp.checkUnreserved = function({start, end, name}) {\n  if (this.inGenerator && name === \"yield\")\n    this.raiseRecoverable(start, \"Cannot use 'yield' as identifier inside a generator\")\n  if (this.inAsync && name === \"await\")\n    this.raiseRecoverable(start, \"Cannot use 'await' as identifier inside an async function\")\n  if (this.keywords.test(name))\n    this.raise(start, `Unexpected keyword '${name}'`)\n  if (this.options.ecmaVersion < 6 &&\n    this.input.slice(start, end).indexOf(\"\\\\\") !== -1) return\n  const re = this.strict ? this.reservedWordsStrict : this.reservedWords\n  if (re.test(name)) {\n    if (!this.inAsync && name === \"await\")\n      this.raiseRecoverable(start, \"Cannot use keyword 'await' outside an async function\")\n    this.raiseRecoverable(start, `The keyword '${name}' is reserved`)\n  }\n}\n\n// Parse the next token as an identifier. If `liberal` is true (used\n// when parsing properties), it will also convert keywords into\n// identifiers.\n\npp.parseIdent = function(liberal, isBinding) {\n  let node = this.startNode()\n  if (this.type === tt.name) {\n    node.name = this.value\n  } else if (this.type.keyword) {\n    node.name = this.type.keyword\n\n    // To fix https://github.com/acornjs/acorn/issues/575\n    // `class` and `function` keywords push new context into this.context.\n    // But there is no chance to pop the context if the keyword is consumed as an identifier such as a property name.\n    // If the previous token is a dot, this does not apply because the context-managing code already ignored the keyword\n    if ((node.name === \"class\" || node.name === \"function\") &&\n        (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {\n      this.context.pop()\n    }\n  } else {\n    this.unexpected()\n  }\n  this.next(!!liberal)\n  this.finishNode(node, \"Identifier\")\n  if (!liberal) {\n    this.checkUnreserved(node)\n    if (node.name === \"await\" && !this.awaitIdentPos)\n      this.awaitIdentPos = node.start\n  }\n  return node\n}\n\n// Parses yield expression inside generator.\n\npp.parseYield = function(noIn) {\n  if (!this.yieldPos) this.yieldPos = this.start\n\n  let node = this.startNode()\n  this.next()\n  if (this.type === tt.semi || this.canInsertSemicolon() || (this.type !== tt.star && !this.type.startsExpr)) {\n    node.delegate = false\n    node.argument = null\n  } else {\n    node.delegate = this.eat(tt.star)\n    node.argument = this.parseMaybeAssign(noIn)\n  }\n  return this.finishNode(node, \"YieldExpression\")\n}\n\npp.parseAwait = function() {\n  if (!this.awaitPos) this.awaitPos = this.start\n\n  let node = this.startNode()\n  this.next()\n  node.argument = this.parseMaybeUnary(null, true)\n  return this.finishNode(node, \"AwaitExpression\")\n}\n","import {Parser} from \"./state.js\"\nimport {Position, getLineInfo} from \"./locutil.js\"\n\nconst pp = Parser.prototype\n\n// This function is used to raise exceptions on parse errors. It\n// takes an offset integer (into the current `input`) to indicate\n// the location of the error, attaches the position to the end\n// of the error message, and then raises a `SyntaxError` with that\n// message.\n\npp.raise = function(pos, message) {\n  let loc = getLineInfo(this.input, pos)\n  message += \" (\" + loc.line + \":\" + loc.column + \")\"\n  let err = new SyntaxError(message)\n  err.pos = pos; err.loc = loc; err.raisedAt = this.pos\n  throw err\n}\n\npp.raiseRecoverable = pp.raise\n\npp.curPosition = function() {\n  if (this.options.locations) {\n    return new Position(this.curLine, this.pos - this.lineStart)\n  }\n}\n","import {Parser} from \"./state.js\"\nimport {SCOPE_VAR, SCOPE_FUNCTION, SCOPE_TOP, SCOPE_ARROW, SCOPE_SIMPLE_CATCH, BIND_LEXICAL, BIND_SIMPLE_CATCH, BIND_FUNCTION} from \"./scopeflags.js\"\n\nconst pp = Parser.prototype\n\nclass Scope {\n  constructor(flags) {\n    this.flags = flags\n    // A list of var-declared names in the current lexical scope\n    this.var = []\n    // A list of lexically-declared names in the current lexical scope\n    this.lexical = []\n    // A list of lexically-declared FunctionDeclaration names in the current lexical scope\n    this.functions = []\n  }\n}\n\n// The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.\n\npp.enterScope = function(flags) {\n  this.scopeStack.push(new Scope(flags))\n}\n\npp.exitScope = function() {\n  this.scopeStack.pop()\n}\n\n// The spec says:\n// > At the top level of a function, or script, function declarations are\n// > treated like var declarations rather than like lexical declarations.\npp.treatFunctionsAsVarInScope = function(scope) {\n  return (scope.flags & SCOPE_FUNCTION) || !this.inModule && (scope.flags & SCOPE_TOP)\n}\n\npp.declareName = function(name, bindingType, pos) {\n  let redeclared = false\n  if (bindingType === BIND_LEXICAL) {\n    const scope = this.currentScope()\n    redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1\n    scope.lexical.push(name)\n    if (this.inModule && (scope.flags & SCOPE_TOP))\n      delete this.undefinedExports[name]\n  } else if (bindingType === BIND_SIMPLE_CATCH) {\n    const scope = this.currentScope()\n    scope.lexical.push(name)\n  } else if (bindingType === BIND_FUNCTION) {\n    const scope = this.currentScope()\n    if (this.treatFunctionsAsVar)\n      redeclared = scope.lexical.indexOf(name) > -1\n    else\n      redeclared = scope.lexical.indexOf(name) > -1 || scope.var.indexOf(name) > -1\n    scope.functions.push(name)\n  } else {\n    for (let i = this.scopeStack.length - 1; i >= 0; --i) {\n      const scope = this.scopeStack[i]\n      if (scope.lexical.indexOf(name) > -1 && !((scope.flags & SCOPE_SIMPLE_CATCH) && scope.lexical[0] === name) ||\n          !this.treatFunctionsAsVarInScope(scope) && scope.functions.indexOf(name) > -1) {\n        redeclared = true\n        break\n      }\n      scope.var.push(name)\n      if (this.inModule && (scope.flags & SCOPE_TOP))\n        delete this.undefinedExports[name]\n      if (scope.flags & SCOPE_VAR) break\n    }\n  }\n  if (redeclared) this.raiseRecoverable(pos, `Identifier '${name}' has already been declared`)\n}\n\npp.checkLocalExport = function(id) {\n  // scope.functions must be empty as Module code is always strict.\n  if (this.scopeStack[0].lexical.indexOf(id.name) === -1 &&\n      this.scopeStack[0].var.indexOf(id.name) === -1) {\n    this.undefinedExports[id.name] = id\n  }\n}\n\npp.currentScope = function() {\n  return this.scopeStack[this.scopeStack.length - 1]\n}\n\npp.currentVarScope = function() {\n  for (let i = this.scopeStack.length - 1;; i--) {\n    let scope = this.scopeStack[i]\n    if (scope.flags & SCOPE_VAR) return scope\n  }\n}\n\n// Could be useful for `this`, `new.target`, `super()`, `super.property`, and `super[property]`.\npp.currentThisScope = function() {\n  for (let i = this.scopeStack.length - 1;; i--) {\n    let scope = this.scopeStack[i]\n    if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) return scope\n  }\n}\n","import {Parser} from \"./state.js\"\nimport {SourceLocation} from \"./locutil.js\"\n\nexport class Node {\n  constructor(parser, pos, loc) {\n    this.type = \"\"\n    this.start = pos\n    this.end = 0\n    if (parser.options.locations)\n      this.loc = new SourceLocation(parser, loc)\n    if (parser.options.directSourceFile)\n      this.sourceFile = parser.options.directSourceFile\n    if (parser.options.ranges)\n      this.range = [pos, 0]\n  }\n}\n\n// Start an AST node, attaching a start offset.\n\nconst pp = Parser.prototype\n\npp.startNode = function() {\n  return new Node(this, this.start, this.startLoc)\n}\n\npp.startNodeAt = function(pos, loc) {\n  return new Node(this, pos, loc)\n}\n\n// Finish an AST node, adding `type` and `end` properties.\n\nfunction finishNodeAt(node, type, pos, loc) {\n  node.type = type\n  node.end = pos\n  if (this.options.locations)\n    node.loc.end = loc\n  if (this.options.ranges)\n    node.range[1] = pos\n  return node\n}\n\npp.finishNode = function(node, type) {\n  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)\n}\n\n// Finish node at given position\n\npp.finishNodeAt = function(node, type, pos, loc) {\n  return finishNodeAt.call(this, node, type, pos, loc)\n}\n\npp.copyNode = function(node) {\n  let newNode = new Node(this, node.start, this.startLoc)\n  for (let prop in node) newNode[prop] = node[prop]\n  return newNode\n}\n","// The algorithm used to determine whether a regexp can appear at a\n// given point in the program is loosely based on sweet.js' approach.\n// See https://github.com/mozilla/sweet.js/wiki/design\n\nimport {Parser} from \"./state.js\"\nimport {types as tt} from \"./tokentype.js\"\nimport {lineBreak} from \"./whitespace.js\"\n\nexport class TokContext {\n  constructor(token, isExpr, preserveSpace, override, generator) {\n    this.token = token\n    this.isExpr = !!isExpr\n    this.preserveSpace = !!preserveSpace\n    this.override = override\n    this.generator = !!generator\n  }\n}\n\nexport const types = {\n  b_stat: new TokContext(\"{\", false),\n  b_expr: new TokContext(\"{\", true),\n  b_tmpl: new TokContext(\"${\", false),\n  p_stat: new TokContext(\"(\", false),\n  p_expr: new TokContext(\"(\", true),\n  q_tmpl: new TokContext(\"`\", true, true, p => p.tryReadTemplateToken()),\n  f_stat: new TokContext(\"function\", false),\n  f_expr: new TokContext(\"function\", true),\n  f_expr_gen: new TokContext(\"function\", true, false, null, true),\n  f_gen: new TokContext(\"function\", false, false, null, true)\n}\n\nconst pp = Parser.prototype\n\npp.initialContext = function() {\n  return [types.b_stat]\n}\n\npp.braceIsBlock = function(prevType) {\n  let parent = this.curContext()\n  if (parent === types.f_expr || parent === types.f_stat)\n    return true\n  if (prevType === tt.colon && (parent === types.b_stat || parent === types.b_expr))\n    return !parent.isExpr\n\n  // The check for `tt.name && exprAllowed` detects whether we are\n  // after a `yield` or `of` construct. See the `updateContext` for\n  // `tt.name`.\n  if (prevType === tt._return || prevType === tt.name && this.exprAllowed)\n    return lineBreak.test(this.input.slice(this.la'use strict';
require('../register')('bluebird', {Promise: require('bluebird')})
                                                                                                                                                                                                                                                                                                                                                                                                                                               æñÕ½¿¾9%`·@ùf ô7g¥î~>¬¬‰¶°ç^{•ïı¡ïç½?öQtà ıŒÍş:Í©Ë›«?}Šã<ÀVo€¶>ÊW¾òUşëÿø-şÆ/şUßañúE|•’l­éœƒ“mÆ"Œao×ËÑ¡öR:½şÖØ8®±İ0&xBâPĞˆ|’A¡•("M2\/¼çµœ{"§ÌáBí%:XeÇÀ-³­İH°]SŒÒF¿º×eVù¾ï~½…‰ÕRØ>J).\ºH§ß£İnS$)°ñí¥úLNE\¿x©Ğáû?ğ!v–V¹pî¢U¥KNbi„ï3ŒSÏcr|‚Ao@¥RáğáÃ%=Báû>¶ã²µ³Ãêæ:İ$ã;¿ÿ/òƒûq¦îçøé3ØQ•÷|øÛØò•vÂ2‡Íz³ÔÊ¤QØ–Ò$ı˜FT§â<óÔ×\—l#Ó„ÑĞG»	U^ÛsY__5‡‡"5ò‚RZ ¾©À²å3¦`*›4÷òìŠ¢@å¶{k…ÒšBßÇF#´T<òĞÃ,ì›§(2o=ÿÒÒ¯½~ß÷Qâ®Ñò^vŞ½»¦´İ1ãnCe·Ó·[(îş¬{k•PåËŒLf{>Ïóp,Hâ!2ËQyQê¥-j1’4§QoÑh4 ú$%ìÙÂ¼nË²HSƒ‹‹¢È<ë¥|Ãq„mŠSËuöÜËy^¥¹1>aa[Ni†qP%Q–ÅB}·º›ü”d)…’Tjul×¡ŞlP­5ØÜÚ"¹'R6Ë²7e\×åÕW_eccƒJ¥Bìß¿ÛuØÚÙ¦Ñ£P0»oÏÍuuK­cÉUÂü|»cŞ]“ŠT9õÉĞ½¢»£”{îøƒ÷=(¹}ëv%VC£ñK*Ò,#Ë2†£Õj°XßØ¦ÕptAÅ³¹øÊ‹¼í­Oò/şí¿æ»üoğ¥—ïğÀÛ?ÀÕÅ5~ä£?À>÷{üÏÿöëœ9sß)r‹4ëøÃAŠÀ§5ôãrÁAÀÆÆ&ÛÛÛ2'Ï3Úí6F“F£‰%([¬Je§1di‚e™‹çÖm´†0YZZÂ²]êûì'Œü[Q€%(
MUp±Yº½ÈÚÒ
B’4Åsl"Ç¡îº„–¢ZqqlIâíT›…Ö8‡gçhÖ«´u´,(²DM˜Û7Ë­Åm.]ºÉüÈORmN²´ºÁÓOs4«VVWQ»] YÚ.:O	]Çàâ•f¨\"SÉìô,?ò&î?vÕ ŠJÁ³=„p°m¯t€ZäEÊp80áô¶Â÷m²<ÆqQä—.!‰£5…¶ˆ¥EšK"Ï&ë­3Yõxû›¡¿½Éüd¿ï[èïlP­G”ë“#Aˆ(õÆU(°°PY£4€¥óWèwˆ(b£ß§R¯¡óŒTøv¯¼~Ôµ‰p¸úê=ö0²æ¡†)UŒF+E#lßöÑ™AàÚ QXÁu=ŠÌ i]Ï+s†^Ôäô™‡¨µÚÜ¾½L¯70aßÏh3ì%4j5ªõ
±0ÌGà™Sá;·èvw¨Õ+Tı
íF“ûæØŞÜâ¥çŸgjb‚©™sàĞ9øÚ5†A``øˆráµmçF{y—–e(÷»İÁ<ÏxšÀ†që¯¿Î;Şô&¾òì×øêë¯røÉ'xø-ïçÁÓ2ÖBD½"§×"‰ë†\¿pş‘W#ÉS×èÀ7¦øî'ßÃÖÚ&Ò†ßåÖTBMd–&Nb¬íãÿ÷À(%]´eQšÏ½ğuEAT©òp4Ç[x”Å<æ™k—¹`àääEÌ©J‹Ÿ|×{èmíà¸>¸.‡&‘¢â#jÍ¨J.

côpŒQÁql|Û&ÕÇópıp/ªÍr3^·4¶ğL³JaœçÂÀ™µe¡Ê1¼éú•ìºrÔ»«”åh\	B¡Ä=£ND¡ĞJR©Fô»$’w½ï]¨A‡?şì1JúÈ à_ÿ?¿Îë·.2pœ'¾å1¶6¶™š:Ä'?õUş·Ÿıy~ì#ßÁÏıÄ÷SôºTüá0Ç¯7@JÀ¡ÃVjñÊÍ5®-­‘e¦÷æeûöÓAÇöĞ£œÜ±‘¶‡ã‡Ød†ª5® Yâ×GiÈ¥.ÇÜ»P¶@)…°3lË&ËL¼˜°}òB	ïšBĞdBa{¥î2+p„ƒ%l´($ÚÚ—ìE­M¡§‘eqX)ıÎ -l¢FƒÜ±ğ]'I‰o\ç‰Ãã|àí§Øè.ò•^%÷ÚtU…À­£
PiBà[ä¹YÛêÍgï»a3ÌS,'áÑ&¬÷ûÄÍ«¯£;ràÄQN?z–ãœ`mkû:Ë{¿ã;±7®sóúÆuÆ›Md–P¨œ‰ç:Äé…°¡ÓÙfaß¶–T‡›+kÔ[M|ßáÎÛäRrùêMz£Œ¨Ö"Ñe—ß±ÈŠËR™èTŒ¼a4P©ÖÂ€Û‹·±“`S¨•+l,Ç§QoxA™"bŠ{[8Ôªu1† ªT¨5ëdR²ºµA¡$‡¡;è³¸¼ÌÄø¸é¾æ’ZX%°=’<#)ß_[CÄÊdQã:h®å 
ïøäiÖ%5•ŠGRêğ„cc¹.…ÔËÆB2iRµ,iáX.Ãá mÂŠO!F™"Š*¸aÀ(—•¹Rlolù•zË$yjOLÂT×sM~»61ukp<Ãxˆí:4MPÚ¶ˆË†PIzƒõvËqƒïØ
„Ô–‹£M²‰%Úfjb™)S–›f¯×7{–ÆÇdÅc!,­ªŒdF!ó™˜œfsc‡8IY\Ze0ŒÙZ»iŠĞ¢äÂjİ¶J©€Â€¤6¡*$yVìù%¼0@Kƒ=S*/GÆÖ]ìØÜÑïloãùFË0öœ‰A²¾±‰ï&HX+&'']Îö&•À7‘4Z³¾²†çúüßúm~ñoş=W¶xø‰'8|äo~üaşÛş¾ğÙ?æÀÂ<­V›,-Ê@ç”<ÏIÓœJ¥‚&êÅDºä¬­¯Òívév»&‡·Ra~~Ş EË9ÿn¬îÉRÜÕõÙ¶E<JôûØ¶Å`Ğg~~a	V×VcßÜi¢‘d£5aSĞ_^áü•ó\»z‘ş`7p˜_˜APŒúøÍhu(ú]ÏLòÎÇã—~îgxòÑ‡˜æòµK&Â‡‚öxa>‘R×óğ*M~ÿ÷ÿ€zˆç{şè2øò—¾ÌX{œ©™iÇCk3Fd¹dk»ÃÒò*ë£,/¯páüë¼úÊk<ÿü‹\|ı2iš1èIs¹×‰3¹µrÏ…´ŸcÚõ1½^$‰÷NH2“88ø¾GÜß!<ÌD-âú;¼ûï`¼UGI"%A£Î +Í½|bÚ³¥£5B™CİØZ\eùÎæÚLµÚ¸–ÿo÷s^_Yf+N™­¶˜nU¹vı‡C
‡BXDÕ£ÑJb	ÌƒVFúx¾Ò<'/
¬2ûR	ÈŠÜ òŒƒ‡pøÈav:VnßÁ¶m(A¯ß'—9Q¥‚í8È¢ä¢iM‘g,--A©¹©Vk:x×õxş¹ç&1ûææÊ¬ØßñèözT£
ia{.ƒÑĞ¯m‡´<5zgt&Yö†±Š‚´t×ëußÆ“
Õ°¯Ö&yñÂŞúáR?0Ò¥PŠa’–çš<^@åW/¾F–f¤ÅGØHG óŒ·>øgç°z{‘~óÅK/Ñ•K*°mĞ’÷?øï?FºÓG9¾°éd1¿óê×êœ–_áÌÔî›İOW¦|ıò+tó>‰%±,Í‡Ï<Î™ƒ3ŒÒ%Ó“Dµ
õñ&vèá†¾¡†™bkÏœaÆ!Â¶[vîª(;Z–U¦ü9	+”Ÿe‰?ãü}CWÖ6¨h«46ˆ=Ö‰Yˆ]Û¢È%Ziß£Úhš:mñùÏ|–s¯¼Êßû‡Ÿ#gÎpıÊyöÍO²°0OXmqîÕ×ùéÿi¾ıïã‡>òİTB-3Ò4¥İn³µ½E†ã:ä¹æÚâ2¯_¿Í¥›·ğ¼€éñ	æÇ&ÙZ^dn¬EÖïâ—Ø4Ëp¤*Ai]¢^Œ|¯ã*³…Xe*Š…*íİÖİÑ­QÇSXåXÇDû¹BÈ¾etÆ¨]4™ƒ6q–c×ä
k„cvJVŒ¶ğ
…£m¼  ßc 3v†2•ãù.ùæ*M™ò‘·¾‰c­İ×6<g•¼Ş×E©ÜèM}×qAC³ÑäÀƒ¤ÃØŒ6]](ò4åÚõk4Ûujõ*"\¿uƒs/¿ŒVP‰j´Ûã|ñO¾Ì±cÇ¢ˆ}óûø¾ïû|ösŸ­‰ªUâ4C¿„¢[Z¸‹wnqğàaht¹«;ÔÃ §ôwºh¯İ`³?$l4)î‰Kµ„Ñói%±„]vàL×2/·ôÎââ,ÇBiÌšâyŒâSí	?(G¾i–á9E¶ãĞöiµšLMN²¹¾Éúæccm´†zµÊ[w8vìB=¶r,Ò4¡Y­82Ï©T+„^@§Æ*Ãc•ÊÖB"\é€×ÁsıòÙQ†: yš-£Ø´È8Ï©¶ÚJ³Õë399eÛ¦»g	Çb0˜H¸JdºZJ—ëƒ(ë
Ãú³qwb‰Fæƒ~™f[2´ÚsMS ßë",ëyà–]MaáºÎÔ_•ÉN–[jŸ‹‚À7ÅwšÄF¿ZH‚(Âó=*•ğÿ©O|×DHfiŠTĞë˜½·Óİa|¼M«ÕàæÕóÄ¥QÕ*¿ÏtÕŞh÷^¹}ÏôÂ¶m’,Å±LênLŞnCÉñ\ìúÔüÇ''&ÈóŒÑhÈ‘#Gét;ŒMÖŒ’„Éñ62ÍÈÓI2àY6óÓSÜ¾y‹fc‚O|â7ùëëÿdus‡'ßúVŞÿù6¿òÿûeîÜ¼ÊÁóL“¥)^y£:î.GÊl y^`•ékkk¤™9!ì}'''÷FºJ)ã„Tjso(„ Š"n\¿NÃ€$Ii4êtz„€ãÇOUCÖw6°…æÀä×{–îÅ‹BZØÏC¼÷¡‡é\»Æê«¯QÅ4’”şÍëˆxÈ§OóóûQŞòĞYŞòÈn\¹Ä+¯¾È¥›¬m®QmT«½~Ûqˆ2=Å„ç^>ÇG?úã´ÛüÎïü>?ø?FÚ‹ù‡ÿè—yæé§¹}g™(ªÑhµğ¼€±‰Iƒ„••u}ú^zñ×¯İ¢×2Œ¸NMŞä8º¦£!RËò&Ë²‘²Ø+š–¾¹‘“$Á÷|2©Ñ–mœTBãéœõÛ7¸~ñ"~pòÄQ¢ÀÅ<¤%f•öi™×lt*¥‹’oU‚-‹![K«¬ŞY&ˆ"¶6·«Ô(’˜,ÏPµ6ÏĞ­óğ‰£|Ï»ßÂú­Ë¬wv8röîôfWÚŒÒÇ¹Æõ=
­È‹ÂğúJ÷¦Ô
©¤ÑxÃdH¥VåÌƒRk4Y^Zegg‡JP5L)Y”ÎkÇs_€ë”ĞÖÖ&;;ÛŒMÑ°°xèÁ³Ü¾½Äå×/1Öh3;9Mš$Fl,3ü(0™Öv©Ãà»(CÓw„)rZ­ ½^oOl¬”b0 TmóÏ¿Ä ?D>GÏa;/°*†½…qÆJËÂòM\–*ÌØüÊ…×Ìi¾È=ŸBK¤*ø‹ßúaæª-n]¹Áv:äk·^'u,,eN¼Z¦|ûÙ7³?lÓÛÜÇ&‚µ¸Ëÿºø©ìª<¶ÿ³Q^óµË¯ÒQ#r¡˜©FüÈ[ßSe1ÍÉ1æ- \›°VËÆ÷”4U:•-Ë2ïaYY®SvMí»…uÇNıÙ<_Qº…­òßìöî×~3æ¡•‰b© Öh–BÁÿóÿ‘÷|ë;ùá_øßX¾xéÙIfç§¨ÔëÜZÜàÛ¿û#¼ûÑGøè|JÈÔD“x8Äõ<“¦FXBáZ¦ƒ°²ÕáÒí.İ¼…”’£‡2ÙhpãâEí›ÁÎs|ÇğÆT–º©0©¦¤³Ê¼xS¼ª¢0×Ê¨dïF€•á^$P–étB!u(r°lå:eÂh“¤×ñq¤…À1)*ÂÆÆºû;øôuA¯‘x‹Lt»t·Vxçü,?ò®·Àòu"â ÆÿúÚ9Òú82ŠYBè{$ÃÁÛ²˜˜¦ViĞïL‚…í#µAÒ$qL÷É²„Ñ°ËNÚenŞÄy½üò^xáâÔÄÎï?@?MØìlÓhsì¾£¼vé<I‘£,‡~’2k·LJ	KHFı.".Rº.ÍJˆ•¸Bpõú6{.İY$h4	ü
Eb°…)´RXÑ¬9–…ï™Ø³z³Iœ¤¬mmâF{g™9ÄHA»Ùdnfß^ÇÈ)FIbÕJÇ†#Çfÿü‹KKdIÊÄä£8ajr‚Ÿ‘©©IÆÆÚŒ4Ô‚‘›ë‹ç0Êrı!3c“øÊÂVº´)t	×Z¡‹j”6è+YŒ‰cÛ8B taÀğ¶áÛ)­ñƒ€­n¿Z!GÓé (CB@úÄ£!hcÚğ\Ï÷Œ4*Ïï”›ŸÊ¶mP²”0XfÄ¬
jaDT©0ğ=Áh0$‹cü ÀC”eAÂX¥ñ¬Pjo´l»FBWä9~`rî;)èÚ´&ÆŒ2'K\×A)‰ÌC.Qšz½E¯Û£…:xˆF­Â…y^{å%Ö—naÙ6ï”~z,
“SâëŞ Ëü&Ñ²k;÷H†ÊÑı.|°ƒÖôÇ«Õ
ÍV×õØÚŞ.çÿŠn¯G†`4è*˜o³µ²„Ê3ŞôÈ#œõe6Wnqúù‘ı	~í7>²mxğŞÿÁ÷cY’¿ı7ÿE:dvjŒÎöcccx®G¡d™+ëeÙ^–ŸiUlmm±´|gÏÉ266Æô´Ñ,í
şÍ8ú.¹W·°;.s]—~¿ÏâElËØç=Ï¥ßïÑô˜İ7ÃÜÜÚ¶P–b¼Ygéâ6^9ÏßşèGù¾7¿•û¢INOÎqjzí?Â¼òÀØûàw2k=4Çwğ[I†}°áÕ×Ï³±µN§·Cà»<ñÄ›XØ?O½Z¥ˆ“?91è(òœF«I§Ü¹½Äû?ôØ
^yæ¿ıÉßáÄñS¬¬Üá‹O}•/}éË¼øÂ+œ{å<·o/ÑŒh5Ç˜ŸY Irƒiš“gø¤4š“Z`
ã8KÈó)ó2íCRÆ=[Ãá­Õu\kI¡5^P”§Ân·C%ªğÖ·¿ƒCûHâ!ûg6Ø‹Eä6˜mÛXÚÄFéRI–å¨HĞ[Ûb}uL¸®MÃÉ‡1ïsµ×ey¹Ã‰#÷éŒÕßà'>ò]|şO¿F^©L/w»„¶…ÌR¤ßC—‡³°ˆ²pPZSÒ­&ÉS,Ûf8Ò8~ì8G£×°x{	ËµM"„0‘4ÍjõÃ¸%®çÒÙé°¾±†çy´[mò,g~~f­ÎõK—YY\bvj†F£N&s”P…*‰ö¦cé{JJŠL¸>ŠÂ,²Ø;AçYŠ%µj…	§Ê…s/“Å‘GÄo1Ò¦CZ™M Š"“Ø)42ËZú.ç_}‰ÁÀhšDQ«ÛüÀ‡¿İIØZ[g3ğÂËdc9(¥©iÁûŸ%Ìi’2Rb”²©~÷ú‹d*çDm‚Ss‡¨æ‚n2àë·/Ò·s¤R<yè ï:rıŞx6s‡Ôk8Â,¶ÖŞØÄÇ–-À¦ŒqeAèî2öà§Â,”¦ 1ü»½°tZŠ²ë­µzCøÍ¨‹İ‘‹¸§/vï‡@ƒÛ1ÏO^Hü b0òkÿáWù‰Ÿú1æÛcø¶M:„Qˆ¶|>ò‘EK›_øÁïGhÉÃŸAi1æú!ªÌx¶-A™ØÉ^œsşÊ®ßZBjxÛ“oáökt·6¹ïĞAt1èw	<‡jXAÆ1Úv²ŒqÓ J¯vl”ÂÒ´–f´(QêSHË5ã[L.°,
c¶l2ºê“ifX”Vè‘¢H¤Xƒ²¡°…(ÈÉÉtBª2Ğ)x¾À³n’ÑÈr„oÙ?Ç{î?É·=pŠbõîA³Æ³K=.@5†½>µªG¯»Íh8"ğêµ&aTÅsüÒ`QH‰ø¤qÌöú?øßËáƒ(•’ªœµÕPÓs
éã³Ó4'Æ	êUÎ½ú2~ä1wp™…9^½p·R/ÄBÑíw©EÉ OÕXİXÃöfææXºu‹šÚ.ıN—W.]¡'çoİD„c¶q¬¢ËX5ÃYtJ3dä{¹¡WH¥iµ¹½¸¶M¡)¡Å¦5ˆÂ¨œä¨Õªô{}êõ:Bk²4Æ±lŠ<Gæ’‰±6­ñ1®]½J«Ùd}c0ŒhÔk\¾z™±±6„UdœCl$*ğZ%ì?É¤M¡(›–	ÀÂ’`‚j£TK…ÂqLKRßuØk­p½€N@,%ÚqˆsÃíİK>)
3©KšåŞE×3ÍŒB"J¶¥m9X®À¶E^ìaÜÒÑ€Q€’?ŒTAc¦/ZÄ#´€ 
Íı«ÔŞz±;İ%Ø¶³æ´”ô»]´2ÓÒDfäEF­ZÅvÃ˜•Æ iâe5YšÖa’á8‚s³Ü¸~™×_~!$aà—pS¸ö¢Âqì½ØÛ»ºİ7şò}ÿ®æO™îß. ßq]ì7½ı=ßà …”´ÇÆØÚŞb§ÓÁóú½86cõÉ Ç`{ƒÎÖ:ÿö_şKÒ$æ•—ÏñŸ?ñœ<uš÷«¿FP«ğècğÓ?ûÃ\½v…Ÿù¹¿ÌxËàT.¾~õuÆÆÆ¨Vª&wRQ€ÕjÛ2™®ÛÛÛÜ¾ss¯#599ÉÔÔÔŸÎ¾ûâwãŞÒ4-©æf,|éÒ%²4£UÈò„¨",˜šbaÿ<µZ“A< Ö¨÷{üÉü¿ğ½‘·>Îíç^ÀÃGKÉÖöj…Çx ÁÒíÛ<pß},LMó'_ø"¢±ÖİÂr]jQ…·¼é	<Ï¡³µÊRD.‘q†Ì
"?À³†iŠ–Š^gÀ“½…«ç¯ğO~ùŸâh›Ñ æ¾ÇAÂøÄ$¶k³¶±Á+/¿ÂËç^åÒë—¹}ã£ajF5*•ZC`êçì%JHôDßF êaYfä¸‘fïŠe-‹\¡mo0Âñ<<?Äu<l×çÂ¥k\|şâáÕZÄÔì™’øQD&Á¶“Bw¡R¨<'ô\úë[\½r…Íî6QQ+è\ÔjÜêö¸±¸Î±ÃÇğŠ˜HğtÁÉÏòéÏ…ùûOS±md– Ñ8A€p<’$ÇwC2•!,aÔÁ&(­öY–a²%p¼ …`§×Ãó|}ì	&'§¸vóÛÛ›ÔêM×%IÓ=7V½^E£Å±éèå9×®]aey•™™)*aDè{ÌNÍ2ìõyıõ×	BŸ©™Iz½µ¨Fš˜¸+Ç¶I’4~ˆ,
ÜÀİúîÊvïm!·/]¥Ö¨sòáÓHÇ¢›¤Ïl~RB£R7Œ2Û¶±1ã*[I^?ÿ2Yœ”œ²G8„Ï×÷²|áEš±ö9·t‘,p<rÉééı¼eÿ†[œÀåNo‹Qo@Qõøãë/¢Ò‚³“Ü‡•äôTÎ7V®Óv.ù'ßÄ>ÏG;)íé1ZÓ“dº ¬FØ–Û¢ÔçÙÛ6š`Ë)ÍY€¦â®óowlŠA…]¦'ì…Vìêİ,3™Tè?Çù+Ê>µqÙÖİŸÿa9Â°í¤ÂõR™Öêœí5á9~ñ—ş
E–¢U”šæø4ÿûÿ˜¯üÉ3üï?÷W©È”ÉéIVVW¹rã:§z˜n‡¨ZÃñ<,$¾F–6;|æ+Os}eßxğôƒT+!W/]dc}©©Ic-qL’&4Ò$C—ì=-„é¤º6º,¦)‹;©M<—*Ñ/Z´Ğ¤e„šĞG—|?Ç"s#[âbÚ®K]htÒ'KF(™â™×PyŒ	)¾•ÙG9š£a…ûêun¶yÏÜ<ßwêßuÿ<13Ã‰JÄ(î ²„SD5¾±Üãö¹¦ú8a´6šMææˆªU’$%/$¶k¦A%"NÖÖ–y÷;ŞÆéS'I“>Ÿ}±ñ63s¬/­3èiOàW"vz;Dõ
S33\¸pöä½^—©Ù},9ÆâÆûfX]^fem…v³I5ªPä¦¥	Í±1–n/R#âŞ€/ÓWŠ‹««,u»ä¶Ãäø”IX”,[¹Wüí2BeQ˜ûQijõ&£$fem×õQZâ¹y–‘g.D+£İw\­4®s·óT©T}Ÿn¯O{¬MµZåüùóLNN’$)–ëàÚ7oßblj‰ZG™¢­WŒiI¥V£P
ËöÈlAav×Â$}h‰¢R°N8W ¥¦(Ç¡JI„–2¼ÚBÃV@P¯1LrƒyÒ˜×™g²`8à!ív×3‡¯]“–ïyå:ée>º”8–ƒgÛdiÆp00zj­™˜˜2’! Y­Ç#4V*ÆXQ9°„a+–	ŒE˜ìÃ4Iğ‡"—¤IÌÔÔ48fÒú½>Y^ J,˜”R•)Û]°¹±Fg{“Ë—_Gê‚(ğ{9IeA·;åÜÕîî	–eÃÕ=‡Ø]“Íîè¹ÒhûÓpjµ×¯_gllŒ^—\IZ­–Q0>1Åâíë4+[ıMşîßş[¼í­oæ?ûşäO¿ÊêÊı¯ı§Î>Æé³§ù®ïı6®_½Î¿ú•ÁôÄQÒív‰¢ß÷©DUÒ4g8š
/0aÍ¶ÍæÎ&N‡Á`€”’©©)ÆÇÇ©Õjø¾O§ÓÁ¶í=ÇÑ®>êÏKNØ½0Fƒ^§K¯×3bj4‡ãããŒ3	ıßñY\Z£bGL4ÇÑi­$ƒn…û"“Œ²´¸ÈÁ¹&''¹|ık+¼ùÌc¼´xƒ—¯]aêĞïx÷;¨¸ƒ^K'ØZ`+‹4Ë@i<ÏAæ£$¦›)9ó0ÿò_ışÉßû8+Ë›LµÉâ¥$^}[x4â,frrG8ŒºC677ql¯Ô8˜Nêîu+•²Ò7]&ÃL»×©)ŠÌ€ ³»ş(Špë7ç¹DÚ¤>XÂ-éwFè"åñ³'¸ÿä	X Ñh°¼¹NPHÂ²²Ü]Ì„PZb:«Lg«HÈ¤ù8vÿ}üéWÂ?|µ bJ²aJ5ô±†XEÁÅk7™ó¼ûğ1¾ñ…/òøÛŞÂÈsÉĞ(mX…‘kJÁ4{ğÚ]=Èî‰Éñ=£}+eI^àã‡E!YÜXcöÀ?ôcå©§â¥g¾N†ŒµÚŒ}vú=dU+4Ç<ŠÜ8è'f'@j¾ø'ŸáşûOsğÀaªÕ:§¸ŸÙÎ/_|õ~Ó#ÊÆQ0ÊSŠŠëX6 ¥~å^Òş®¬0ğö ¦æ&éwº8‡¤ñ ¿Q%NS*ª@+3ÂpÇ¶‘HÇfccQ·í™EÎ–.I5Œh×[\èt‘™¤;á
¡¹’¸hÏ/àd’N2¤ÚªñúÚ"GNáãb“Ò®5pm‡8±*Ê²ÉâŒ}Åıó$ı.¸SÓÓDQ€,M¶-(ŠË-c©(,˜•7ÀhwİÓe·gîlÖ„»ca%vGŸw7Ö½‘ç7i ßz`ıù®áİß¥ÔxaH6J±ÊÂ®İ¼Â#ŸÅ­UÖ¼z½ÍoşßãŸø_¼å‘GY¹~pzŒæ0aik«·oòÒ¥«´ÛM²QÌÂÜ<K×/òà§9sö1ÂJeÏE™È‚¯}ıiŞ÷®wòÖ÷¼Ÿú*_}õ5,ìãà¾9ähÄÚÎ¾íb¹`+…4(alRæ{y²BØ€4Uñ=/Yèb/ßM p-A®r2™",…ïd²ÍŒçsæôIÆ'Ú‡CìBPBb™Béö<À3Å…cÛØÂĞÇ•HI‡"ÍúŒ’!±Ê‰C×¸•[ƒ‚Å;«Øánà¡+6›wnV"/`m{“á 6zi)KœŒKVÂÅç&&ø…¿ú´k«k'H’3ûfN>Á¹—/ğüiÆg&˜˜`ĞÙá³ô‡\½|…OŸ¦65ÅzwÄòê•Óªzü…ÿA>û{Ÿââ¥«Ì5ZL·ÇQqÌvgÈÆzÇD.:^yå%V{Òz…›››ô´¤éb¢ĞGT²\«0®e M¥ÉDÎ—°×ér`a?®^¥q,›Ñ`@èø‘Ç°sîÕW8yß}dIJzt·wµõj•,IQ…Kã‹QwÈÜô+Ók8¶Gšét:Ô«5*:¯¾ğ"Ş±4<‡jR«6ÙJ S¼ªCœFÚSäx%¶Ê²,´c2i:ÀvMŒZZé.
ËA#q4$*máÊRZ•
kƒáŞT*IFøn€e™‰’íƒC·ß£Y›/~9…Ò¥Æ]kö Óh‰m»xmbµÆñLglĞë³¶²B¥aÖª^Ïä3£ĞŒC£¹+
GX§|@”F[-%¦ƒX"¢j…~¿O¿7äÁÇbkk‡ÍÍMÂ¨¶‡î)ta0LEÕˆCjõ*ö@sıÚÂÈÅ	=„4)”ûÕn$ï®†?Ë’7à•„z£c{7­ÅÈíÌ÷(Ë2¯-‰±§ÿøäÔY–—Ü!-7oŞ ğ}²Ñªç²~çßö÷ñ×şê_aqy…üà÷ñ§O?ËÏÿo“'¿å=y‚ŸÿùåÚ•+üÔOıQ¥QÆvI4‚••5ò\23³ÁpDú{›”’–––èv»8C»İŞûØÕûé20z·ĞÛİw±÷š@v”ãc“,-.Ñëö¨V+eäİ€öX‹0ŠLğøp„Tš³ó\~ñïxğ!ÔÎ&§™hMq{y‰^<¤Y­ã*Ad™è±F£AµVåås/ÓÙî`+xá™gñ›Ï<Àvg)3Š,'Í‚%,âxÄvgÛs˜İ”ÿş›¿ÅæóŒM”óıŒõµêµ*Û›[„‰¿ÒåI¼È2llÆÛc8vi}·-<Ï§Ğ&ÇĞ²½~ÇqË‘¯bKY ”‰ïÉ²”4ÍQÊ †Ã!ƒÁ L=Ñ„aˆëúC×ÁS
‘‘;›Œù6ßñ®·3?[grjŒùıs&W1ŠpÁ°oÆú¶.Ã¬¥6by¡E9¥énlĞïöyÏ·}ˆ§y†AgÀôôq!yíµ‹4ç÷QmV©»Fëµ1²µºÁÏ>Î‹/¿J®3ûgÉ\‡$‘„n„°]R%qì»1_ß\6Ò€¢Ô?ZPhmt~Ñ5uû°'î»ùƒYYYauu• ŒÃ
M§ÛE86V…¤ßï ‘¸Íâ%®^¿B«=fºaÈÉcÇY]\äk_ú2ãã“D¾-l
ç¢Päy†ëùdYºwºÃpÏ²«‰­Œ7È²”(Œö{4MfT×¨UH’¡Éúô=lÛA£2Ç÷m®]½ÂâõË¦S¢”s“óÀÑûxßãoãüSß@ ¸²~‡åŞÊ±ÉÔ½w{€j/¥°,¼JÄ§Ï?ËHHö;Âó^%(,Î8Å¸²ÓéâN´ùêµtÓOì?À;x€Ñ6~è1è ®ïQ­TĞEQ‚…8–ÛÚ6ÖnSËtKl3ú5f »[¹áØğŸ^¿Ëa»é÷ßŒ0ùfdÌ7ÿ(GB)r¥xÇ‹ç^àØ‰ã=~ˆB*
íĞÏ5û¹¿Â(Nyÿ·|gg|zšÖôûOÜÇû>üa}ó“AÄ0N¨Vë´SS4š-:IÆï~ú,mwp]ŸÁpÈíÛ·9söa=Ê(/8wõ"«Ûœ(¤16‰ÊR¤€Â2…ŸÜå»i…,«•%jeÄîBÜÃ­Teç‹¢d¢É<Æ/RÚ£3Ş}ö4~ìaNNµ³$µ€ã:ÓÀ¾VÄ|0¸Ìx–`M»Èiæ9ÂÊ‘£.E1D3È{ô‹!ÒÑX‘K˜,ß!öB®öR^_í M-YÙ\'ëvèöú¬nl°´¶ÂV§Ãvw›ŞpÀ(2L“nàòCıA¾ã»¿‹Íå;yÆôôSÓLOMsöÁÓl,/óùOÿqg‡È²P£”gŸy†™™}4ãLÍÌsáÒU>ó…Ï#<‹ÃÇ0;=ÃÃ‡X8°Ÿa›Ìñ¨F§ÓG)çh¥yıâe¬F×V—¸Õİa¨4¹TÔMÂJ¥4”å&ÙÉ¶I²!,òÂÈ–6°Å1ÍV‹n¿O¯×%Bò¬À¶œ’¨ØèlP¯VŸ'IR×%ğ}ƒ£*£Æ´à#Eæ;~œ^x‘É™ŠBâùíP±:«XE‚“ÇVî {]ŠA—å[øvHúØIŸP§ØéGH,$gá[„lYF†´-Ìšk#H„¥qÊªãtÓí»¤E‰¶±Mñæ:—æ)ı~ ÷¢	á.EQvïJi³ö)ÍÎÖ[{4ÍÆÖÖ^XÄæÚE‘ã‡ƒ¡‰Oõ]·ìØI,ÛĞµ*aËZ!Êƒ¹*$®ï!´ ’Ñ0!¬Tğ=´E­Ö2îßrÂåÒ+qe£D"eçì’LgÖ»İ½|·àËóì)QJíÕU»š»lYS?ù¾¿‡²ßôöoıøâÒÂ±év»ã:YF«ÕD§	«K‹Üü¿òÏÿ+++ì›Ÿçÿïÿäÿë“‡{'¾é	~ôÇÿ"/Ÿ{•ŸıK?ED…eX¦3Ò0>1‰„ø¾G‘K,a Êı~Ÿµµ5@E!õz¹¹yjµÚ›Çó¼½h™$IîfÙ•c1×uMX™²ëÊ²œn·‹’Š</p›±±19jb^’Ûu	ü!£mÜ8æÈÄ‹‹4Zmd`sñÖ5”¥QiÆÍ×É‘xõ
í‰6‡¤FTmŸûæøìç>Í×{š³O<LDú=(‹×áp …ú8Ë‹¯]á×şÓbjr†ÖØ8µZ^·ËÁCû©Õ*,İ\¤ÕjQY	EµË6sƒJá”Fƒt±JZzA­VÛ;1Ø–[Ş4æ¢µ,á‘F¿ËkŠ¢ˆ ğ÷XO23Á:Ë°ó/‹9}pw<t{Ôg'Şâıï/Ë+Ëaˆãº|îóŸÇñ<:È03º%‹i6 Šr‰ãÀ`c‹QsâÁ3†1O}ù>ŠğB²~B—áÚÖ7)€¾–Œ‡UZ„#÷ŸâÓOÿ)ûÎ¢ğCDfaKm»]`†^&¢Hkmxtãzd²ØKğ0×ĞDî™ˆ7s­&'§8|è0y!Y[[%Ër*ePxĞc0ê33;…íØ“!yR*ä²àÖí;$yF£ŞÀ±,&Ûc=x×.¼,$õfƒ 
ŒF²Àõ<”6'Ëz½ÂtV,‹ ÔuyJLRËÆ Cu¼ÍÎ°‡#/ÀJ2ˆ¼)ab·r™A™ôráÂy+«X®}·0ßöræĞqÎõYÂ¨Â«‹×XwĞCªSÍ6o?|¿3B.x6ŸzùëˆjÀ©“'yùµW©—SÇï#Ì´AFÍNñÔ•WI²˜wŸ:Íñ™	ÖûÌÏÎ269A.“à!,,!ğBBfì£Q4í?sÀqìÒèµË¶%—Ø.µ~ÜlY–A;ØÆÍúÿ¯ø»—ıW(¹—XpoŠÈ.6Æ²]ŠÄtÆ­2T	ÅíÅÛ<üğY´+(4gæøëûã|ékÏñ3égY˜šæÒ¹øò×Ÿå™_àÆò2km6·wØ¿ÿ 9ËX»Í}G`›Ş`ˆÖùä}šÎ eYÈ¢`8påòUÒ,ãÌ#Rcsg‡µMÖ·woTHµ4¯Cšƒ—–C`9f'5º0ZF£{Ü5¸X82Û&A¹–ïæã–à@½ÎGŞö6VêDÃ:î1ddHìœ‘1$c¤bR’‘‘’‘“’áÈ-3,ÏBx¹6ëC v.© /dÓõøÆÊ
‹q†òV––H‡1*ËĞÚBÛÆø…mƒcdÂØ®É•ì‰ÇùµÿûßÓ]_£…ÔkE‘“HEVoÔùêŸ|—/³0=ÍòÍÛäƒ!Ú·i5Úìlõxö/qgq‰ı‡ñÄ[grf’A¯GUèììğÖ·¼•¯¾fÒ{$Ø˜¨³×n’iĞ•§/§«¶Qä’j­AµVCIœšÎ·pÈ‹Û5 B™Ñß ß7…™ïF×n^'ËL Âp8(#Â,×çÎâ"ÍV‹vkÌ`¤vuÚP¤”x^`:F˜½tjv†+×®255Åòò
ëá¤	c­Gfp’a2EÌŒ·°]*2#LFTdƒ>ÄCÒA™Æã;;›ÄIJàûa¸Wì¢µÉ/¥A%°$&¤(9õögÖ°½tÇ"ËSFIL½Ö4cîR×¡5x~ š=ˆ¾R×5É@ÛmâaL­^erjŠÈó°‡BJ:Õ¨
hÖ×ÖÑ–`²5F­V3Z%±Ëæ€–
%V©sw]§t×Pßèõû¨BÑlÓïˆ“„Bi9ÊÔÌIš2tÍ¡_DAˆV’Á Ë.Â°È‹»Ål9.÷<ÓQ5Å`±gxİw»7şm·62lHy·(´,¤RØ§Î¼ıã–eÓj·XZY"M"?`nvGÛœ{æiÎ>Åû/ÿ‰Nw‡f{ŒÿüßÿÿÇßıG¼åmïâ­o=ÍÇ~ì/òÂs/ğc?úãLïÛO¥aÀÑ™Œ	|ŸN·Cì_Ø°ÌB­”ÄvLøÖÖV©=s˜İG»=F†f]„a¸gğØí†ìÎ·wO3»ŒRwã¿”Rø¶ÃòÒ"I>iš2??Ï±£ÇX_]C9"
Ù7©',½zo{ûÛxıµ—9pà8Yš³0»©ö9šÅÕÛ·øò×æÒúSµ1öÏÌ3uhß÷ùÖÇdåÊ¾ô•¯PkÖÑ©d¢ÑÆÊ5ëÔÛ-zE‚U‰øûÿ§˜;È‘‡¹síıË‹K¬.¯0è°32ı Ë°4ñÃ±KóôÙ±zW£P
ä“4Áq=d!‘åFf66ÛœòµÀÒŒÜ¤É´lÛtP„‹ÆFi“@2ìï0;YãCï3mgDe´µy‹p²ÉÔô8nà9>_ûÒ×ÙÜèğÀÙGğâQ/
ÊBàip¤„Ò)æÊ˜õí5ì@P¯z»=îÜ\D8!QĞD„)U×B*%<VÈd³ÆRo…#3ìô;\¼µÄ‘ã2J5Âñè¤}ìŠM`‡R“e´ºå •‰¶C/IÈòÂD:.…4bkeYdR¢3…ãúH[.¶ïñàÙ³ŒMNsãÖ67—¾C¥^§@³¹¹…LLLšg¢±„…8lí¬sóöu|×fßô¾å±ÿğÖÖÖ8ÿò«{ñƒ–RÆ¡©5Âóql—á`D½Ş0ÛÏ¡7²µ±ƒëùÌíÛÇ`{GC«R¥%ø–½çÓMnIœĞ¥(b<Góg¿Æ¨ß%´=tšòŞ·~ÿè¯üŞsø4WÏçêÎ*r,àÙ¯0’’TK„ïĞïwØ68Ö˜%XM|}ñ*["åşƒG‰W6îtyìà	\iñü­k„fxéÖeÅæf¹z’Á`›‰…}LÌLÓ‡çX¸eààEQ ,a™Îo!Áö+XH7 .ÚöĞ¶ƒVFìí{ÉdÎ5¶¡Ëä2…pãâÎÓaÿÙt­[hÀsˆ“×‹ ÿ·ŒÔË%-pÏ¸ÌUí˜Bz~á¿ÿGŸáÔƒÒ›á—şÆßá×ÿÓoñù'Éâ!ÿâßşk^¼z™ë+k¼~çO¿ü2ŸúÂù¿ó|ñ+_ÂFIB&%•jÅlÕ*¿÷Ù/rmy”…«-p,†YÌòÆ:‹ë+ŒOÏpê¡3øÍ&w¶·Y½½È Ëñk5¢ZİğÁ$¸ÊFe9^WÑuâºë8Xq”k#u¶%_:)ƒŞ6G]‡ï:õ0zğa‚d“x´ƒ,òĞF;.ğa¤	Ñ­,i!$ØRà*•K´e´c™Rha¡,©]
\œD1´|úvÄ«·×Ù¤Ü\Y¥Ÿ&(ÇB)'¥	N»˜g)ã¢¥$‚ßúõß`n~šá G+ª&)¹ĞØµjíÅU~ıÿúçLŸi'¤…ì­ˆáN‡\gP4æÆiŒ7)ø…‹å;øµˆµ­nß¹ÅG>òı¼øÂ9)‰5ÜY¾…UÉ+¾ğ:ÛYNª\GP12©UPfrå»Y”îl‡ddº(ÌS+â4¡Z¯“Û\×EXRI²¼0¼;!¸³´Ä¾¹¹=H–$TÂEEôG#cÚ(µ÷cÍ¶eñÊk¯qèèQÖ·6©yÃ´ËÖÎ
ßÿïåPär_5àìD£ÙVÄıSœ:v€ƒg9ppšƒóØ7Æñ
ìŸe_=À“}:+7î¬Ñª…&OhpÍ¾N^
—$âø™e“	‡¨İÀÕ62Î‘Jƒ/HeF-¬ÂP‚{œ§t»¦iºÙ·0&ÏõVnm©$“¦«ã!ı°oÿ<~­B£ÕÄs\Fy†.õ˜m0CRIòÒA¯ÑX¶C'€e²|]ár™³³µB»İ2ºÅaÊÜÂ,ËaF–—V©D¡é$ŠÇÆ$µÛ s´!xÄ£ÏõÍ÷JMµ‘¥)Z¸x®‰xÔJaÛ.–ë"E9HS<ze’Rš&€&OBßÇ>qúM¿xéİáöøã“,Ş¾M½Z¥³µÅüÄ¿ø×şÿ÷¯ş>ş$øéÏòÿÉ?ç­o};O¼ùmüì_úşôËÏòá;­ö8Ó3ûè÷‡loo35=ƒë8Ü¾}‡¢È©Vj ÀuM±Öï÷LD[ãº.µZÍˆ:ËÖh4zƒöæŞÖînÁ·Ë«óËŒÜİé½:å•eâ$Æó=²<3ü=ß£m‘+…Dlmlrõõ¨~Ÿ·=t–™V‹[ËkÜwú$;ñ O#ª03;Íáîg­¿Ã³/>O\¤<õü3 ÇöÄÊ%>üÇåÎù+Ä[}n]¾A†LÏíãÖÊ*ûğùŸ¹uöÏÏ“Æãcã„a@øe\Ğn5Í.Di¯×oÈ3öKÃË^{ÉÿÙÕûC³‘–'„¬Ô@Ş£ïÆÆH
©ŒF2+ĞJîÆ¿c	%ÍçÖWÖh4ZŒMíãÚòó'21»7¨ğÔSÏpåâ:Êı< ¶E¦ä]]¦Ö $(‰–ºÈq-UF¸ùÔëâQÆâ’X211I:ì°oªÍ`` ™íÖÇ÷Ğ6ô¶WyàñGùò7^ hQo·)”B[ßuÈ£sò}O2°«¥s]—ÀõqmÏó°#Îµ(©(ò¯twZ–UDÌÁ£Y¯sÿÉ“X¶Ë¥%úƒ^‚di†ÌÍFG™ÎP–÷ë°xûkkŒON@¡o¶hÔë\ºx‘­­-ö<ˆD“¹ÁW¸.JkF±wÛ–…#,ªAHàÛ¼øü7Jrø Éö”,?`gäJã†!™ÖÈ’ÚİÍM^~êl-™®5ø?ñ—øè÷}?—orë•×yåÅs¸Ï×o_äêê¢¹.Úäj*•35Ù?6IêZÈ¼àë7.ĞÉR9ˆ`uÔåá#÷‘¾qıuÜé1.¯Ş!õyÇ}'9=¿¡2>;Íøø8Ilïâz.¶m64?pA(Ò,Áqü(D;6Y!±Jñ·ç8Xht‘ck…-4¶V] Õî¿éİ›’(–ãàB]¡¾·KhYhÛä`dYë¸xG–&æ¹†'•ÜI¥ÊqKe­Á…×/³İòØ“ïäßÿ»_ã—ÿÙ¿åmO>NšüÖÿüm„åÒh´9xàµF›öÄ–ãE!.¯½úäMÁwÜ°Êÿüƒ?âöêaa•z@·LG,Ş¹Ãúê:QTáÄñû°š-†J³¼¶ÉNw€m{XnH!”ë!›u‚ls“ãá` óga¹Ú±(’g0à‘…yŞó–Ç˜l…Ä½M9ïá:6ÉhD6Jğ…Mh{ˆ\¤9ÔhÜrPoàµ	Rà——0sp`ÀÎœÂ#«7Ü.
¾øÒËÜîtĞ¸DQ™4¢ˆ4©FI“æ	Õ(¥ˆ<sHşşïø~æ~ËÌic helper caching. Closes #439 [suggested by maritz]
  * Added authentication example
  * Added basic Range support to `res.sendfile()` (and `res.download()` etc)
  * Changed; `express(1)` generated app using 2 spaces instead of 4
  * Default env to "development" again [aheckmann]
  * Removed _context_ option is no more, use "scope"
  * Fixed; exposing _./support_ libs to examples so they can run without installs
  * Fixed mvc example

1.0.0rc3 / 2010-09-20
==================

  * Added confirmation for `express(1)` app generation. Closes #391
  * Added extending of flash formatters via `app.flashFormatters`
  * Added flash formatter support. Closes #411
  * Added streaming support to `res.sendfile()` using `sys.pump()` when >= "stream threshold"
  * Added _stream threshold_ setting for `res.sendfile()`
  * Added `res.send()` __HEAD__ support
  * Added `res.clearCookie()`
  * Added `res.cookie()`
  * Added `res.render()` headers option
  * Added `res.redirect()` response bodies
  * Added `res.render()` status option support. Closes #425 [thanks aheckmann]
  * Fixed `res.sendfile()` responding with 403 on malicious path
  * Fixed `res.download()` bug; when an error occurs remove _Content-Disposition_
  * Fixed; mounted apps settings now inherit from parent app [aheckmann]
  * Fixed; stripping Content-Length / Content-Type when 204
  * Fixed `res.send()` 204. Closes #419
  * Fixed multiple _Set-Cookie_ headers via `res.header()`. Closes #402
  * Fixed bug messing with error handlers when `listenFD()` is called instead of `listen()`. [thanks guillermo]


1.0.0rc2 / 2010-08-17
==================

  * Added `app.register()` for template engine mapping. Closes #390
  * Added `res.render()` callback support as second argument (no options)
  * Added callback support to `res.download()`
  * Added callback support for `res.sendfile()`
  * Added support for middleware access via `express.middlewareName()` vs `connect.middlewareName()`
  * Added "partials" setting to docs
  * Added default expresso tests to `express(1)` generated app. Closes #384
  * Fixed `res.sendfile()` error handling, defer via `next()`
  * Fixed `res.render()` callback when a layout is used [thanks guillermo]
  * Fixed; `make install` creating ~/.node_libraries when not present
  * Fixed issue preventing error handlers from being defined anywhere. Closes #387

1.0.0rc / 2010-07-28
==================

  * Added mounted hook. Closes #369
  * Added connect dependency to _package.json_

  * Removed "reload views" setting and support code
    development env never caches, production always caches.

  * Removed _param_ in route callbacks, signature is now
    simply (req, res, next), previously (req, res, params, next).
    Use _req.params_ for path captures, _req.query_ for GET params.

  * Fixed "home" setting
  * Fixed middleware/router precedence issue. Closes #366
  * Fixed; _configure()_ callbacks called immediately. Closes #368

1.0.0beta2 / 2010-07-23
==================

  * Added more examples
  * Added; exporting `Server` constructor
  * Added `Server#helpers()` for view locals
  * Added `Server#dynamicHelpers()` for dynamic view locals. Closes #349
  * Added support for absolute view paths
  * Added; _home_ setting defaults to `Server#route` for mounted apps. Closes #363
  * Added Guillermo Rauch to the contributor list
  * Added support for "as" for non-collection partials. Closes #341
  * Fixed _install.sh_, ensuring _~/.node_libraries_ exists. Closes #362 [thanks jf]
  * Fixed `res.render()` exceptions, now passed to `next()` when no callback is given [thanks guillermo]
  * Fixed instanceof `Array` checks, now `Array.isArray()`
  * Fixed express(1) expansion of public dirs. Closes #348
  * Fixed middleware precedence. Closes #345
  * Fixed view watcher, now async [thanks aheckmann]

1.0.0beta / 2010-07-15
==================

  * Re-write
    - much faster
    - much lighter
    - Check [ExpressJS.com](http://expressjs.com) for migration guide and updated docs

0.14.0 / 2010-06-15
==================

  * Utilize relative requires
  * Added Static bufferSize option [aheckmann]
  * Fixed caching of view and partial subdirectories [aheckmann]
  * Fixed mime.type() comments now that ".ext" is not supported
  * Updated haml submodule
  * Updated class submodule
  * Removed bin/express

0.13.0 / 2010-06-01
==================

  * Added node v0.1.97 compatibility
  * Added support for deleting cookies via Request#cookie('key', null)
  * Updated haml submodule
  * Fixed not-found page, now using charset utf-8
  * Fixed show-exceptions page, now using charset utf-8
  * Fixed view support due to fs.readFile Buffers
  * Changed; mime.type() no longer accepts ".type" due to node extname() changes

0.12.0 / 2010-05-22
==================

  * Added node v0.1.96 compatibility
  * Added view `helpers` export which act as additional local variables
  * Updated haml submodule
  * Changed ETag; removed inode, modified time only
  * Fixed LF to CRLF for setting multiple cookies
  * Fixed cookie compilation; values are now urlencoded
  * Fixed cookies parsing; accepts quoted values and url escaped cookies

0.11.0 / 2010-05-06
==================

  * Added support for layouts using different engines
    - this.render('page.html.haml', { layout: 'super-cool-layout.html.ejs' })
    - this.render('page.html.haml', { layout: 'foo' }) // assumes 'foo.html.haml'
    - this.render('page.html.haml', { layout: false }) // no layout
  * Updated ext submodule
  * Updated haml submodule
  * Fixed EJS partial support by passing along the context. Issue #307

0.10.1 / 2010-05-03
==================

  * Fixed binary uploads.

0.10.0 / 2010-04-30
==================

  * Added charset support via Request#charset (automatically assigned to 'UTF-8' when respond()'s
    encoding is set to 'utf8' or 'utf-8').
  * Added "encoding" option to Request#render(). Closes #299
  * Added "dump exceptions" setting, which is enabled by default.
  * Added simple ejs template engine support
  * Added error response support for text/plain, application/json. Closes #297
  * Added callback function param to Request#error()
  * Added Request#sendHead()
  * Added Request#stream()
  * Added support for Request#respond(304, null) for empty response bodies
  * Added ETag support to Request#sendfile()
  * Added options to Request#sendfile(), passed to fs.createReadStream()
  * Added filename arg to Request#download()
  * Performance enhanced due to pre-reversing plugins so that plugins.reverse() is not called on each request
  * Performance enhanced by preventing several calls to toLowerCase() in Router#match()
  * Changed; Request#sendfile() now streams
  * Changed; Renamed Request#halt() to Request#respond(). Closes #289
  * Changed; Using sys.inspect() instead of JSON.encode() for error output
  * Changed; run() returns the http.Server instance. Closes #298
  * Changed; Defaulting Server#host to null (INADDR_ANY)
  * Changed; Logger "common" format scale of 0.4f
  * Removed Logger "request" format
  * Fixed; Catching ENOENT in view caching, preventing error when "views/partials" is not found
  * Fixed several issues with http client
  * Fixed Logger Content-Length output
  * Fixed bug preventing Opera from retaining the generated session id. Closes #292

0.9.0 / 2010-04-14
==================

  * Added DSL level error() route support
  * Added DSL level notFound() route support
  * Added Request#error()
  * Added Request#notFound()
  * Added Request#render() callback function. Closes #258
  * Added "max upload size" setting
  * Added "magic" variables to collection partials (\_\_index\_\_, \_\_length\_\_, \_\_isFirst\_\_, \_\_isLast\_\_). Closes #254
  * Added [haml.js](http://github.com/visionmedia/haml.js) submodule; removed haml-js
  * Added callback function support to Request#halt() as 3rd/4th arg
  * Added preprocessing of route param wildcards using param(). Closes #251
  * Added view partial support (with collections etc.)
  * Fixed bug preventing falsey params (such as ?page=0). Closes #286
  * Fixed setting of multiple cookies. Closes #199
  * Changed; view naming convention is now NAME.TYPE.ENGINE (for example page.html.haml)
  * Changed; session cookie is now httpOnly
  * Changed; Request is no longer global
  * Changed; Event is no longer global
  * Changed; "sys" module is no longer global
  * Changed; moved Request#download to Static plugin where it belongs
  * Changed; Request instance created before body parsing. Closes #262
  * Changed; Pre-caching views in memory when "cache view contents" is enabled. Closes #253
  * Changed; Pre-caching view partials in memory when "cache view partials" is enabled
  * Updated support to node --version 0.1.90
  * Updated dependencies
  * Removed set("session cookie") in favour of use(Session, { cookie: { ... }})
  * Removed utils.mixin(); use Object#mergeDeep()

0.8.0 / 2010-03-19
==================

  * Added coffeescript example app. Closes #242
  * Changed; cache api now async friendly. Closes #240
  * Removed deprecated 'express/static' support. Use 'express/plugins/static'

0.7.6 / 2010-03-19
==================

  * Added Request#isXHR. Closes #229
  * Added `make install` (for the executable)
  * Added `express` executable for setting up simple app templates
  * Added "GET /public/*" to Static plugin, defaulting to <root>/public
  * Added Static plugin
  * Fixed; Request#render() only calls cache.get() once
  * Fixed; Namespacing View caches with "view:"
  * Fixed; Namespacing Static caches with "static:"
  * Fixed; Both example apps now use the Static plugin
  * Fixed set("views"). Closes #239
  * Fixed missing space for combined log format
  * Deprecated Request#sendfile() and 'express/static'
  * Removed Server#running

0.7.5 / 2010-03-16
==================

  * Added Request#flash() support without args, now returns all flashes
  * Updated ext submodule

0.7.4 / 2010-03-16
==================

  * Fixed session reaper
  * Changed; class.js replacing js-oo Class implementation (quite a bit faster, no browser cruft)

0.7.3 / 2010-03-16
==================

  * Added package.json
  * Fixed requiring of haml / sass due to kiwi removal

0.7.2 / 2010-03-16
==================

  * Fixed GIT submodules (HAH!)

0.7.1 / 2010-03-16
==================

  * Changed; Express now using submodules again until a PM is adopted
  * Changed; chat example using millisecond conversions from ext

0.7.0 / 2010-03-15
==================

  * Added Request#pass() support (finds the next matching route, or the given path)
  * Added Logger plugin (default "common" format replaces CommonLogger)
  * Removed Profiler plugin
  * Removed CommonLogger plugin

0.6.0 / 2010-03-11
==================

  * Added seed.yml for kiwi package management support
  * Added HTTP client query string support when method is GET. Closes #205

  * Added support for arbitrary view engines.
    For example "foo.engine.html" will now require('engine'),
    the exports from this module are cached after the first require().

  * Added async plugin support

  * Removed usage of RESTful route funcs as http client
    get() etc, use http.get() and friends

  * Removed custom exceptions

0.5.0 / 2010-03-10
==================

  * Added ext dependency (library of js extensions)
  * Removed extname() / basename() utils. Use path module
  * Removed toArray() util. Use arguments.values
  * Removed escapeRegexp() util. Use RegExp.escape()
  * Removed process.mixin() dependency. Use utils.mixin()
  * Removed Collection
  * Removed ElementCollection
  * Shameless self promotion of ebook "Advanced JavaScript" (http://dev-mag.com)  ;)

0.4.0 / 2010-02-11
==================

  * Added flash() example to sample upload app
  * Added high level restful http client module (express/http)
  * Changed; RESTful route functions double as HTTP clients. Closes #69
  * Changed; throwing error when routes are added at runtime
  * Changed; defaulting render() context to the current Request. Closes #197
  * Updated haml submodule

0.3.0 / 2010-02-11
==================

  * Updated haml / sass submodules. Closes #200
  * Added flash message support. Closes #64
  * Added accepts() now allows multiple args. fixes #117
  * Added support for plugins to halt. Closes #189
  * Added alternate layout support. Closes #119
  * Removed Route#run(). Closes #188
  * Fixed broken specs due to use(Cookie) missing

0.2.1 / 2010-02-05
==================

  * Added "plot" format option for Profiler (for gnuplot processing)
  * Added request number to Profiler plugin
  * Fixed binary encoding for multipart file uploads, was previously defaulting to UTF8
  * Fixed issue with routes not firing when not files are present. Closes #184
  * Fixed process.Promise -> events.Promise

0.2.0 / 2010-02-03
==================

  * Added parseParam() support for name[] etc. (allows for file inputs with "multiple" attr) Closes #180
  * Added Both Cache and Session option "reapInterval" may be "reapEvery". Closes #174
  * Added expiration support to cache api with reaper. Closes #133
  * Added cache Store.Memory#reap()
  * Added Cache; cache api now uses first class Cache instances
  * Added abstract session Store. Closes #172
  * Changed; cache Memory.Store#get() utilizing Collection
  * Renamed MemoryStore -> Store.Memory
  * Fixed use() of the same plugin several time will always use latest options. Closes #176

0.1.0 / 2010-02-03
==================

  * Changed; Hooks (before / after) pass request as arg as well as evaluated in their context
  * Updated node support to 0.1.27 Closes #169
  * Updated dirname(__filename) -> __dirname
  * Updated libxmljs support to v0.2.0
  * Added session support with memory store / reaping
  * Added quick uid() helper
  * Added multi-part upload support
  * Added Sass.js support / submodule
  * Added production env caching view contents and static files
  * Added static file caching. Closes #136
  * Added cache plugin with memory stores
  * Added support to StaticFile so that it works with non-textual files.
  * Removed dirname() helper
  * Removed several globals (now their modules must be required)

0.0.2 / 2010-01-10
==================

  * Added view benchmarks; currently haml vs ejs
  * Added Request#attachment() specs. Closes #116
  * Added use of node's parseQuery() util. Closes #123
  * Added `make init` for submodules
  * Updated Haml
  * Updated sample chat app to show messages on load
  * Updated libxmljs parseString -> parseHtmlString
  * Fixed `make init` to work with older versions of git
  * Fixed specs can now run independent specs for those who can't build deps. Closes #127
  * Fixed issues introduced by the node url module changes. Closes 126.
  * Fixed two assertions failing due to Collection#keys() returning strings
  * Fixed faulty Collection#toArray() spec due to keys() returning strings
  * Fixed `make test` now builds libxmljs.node before testing

0.0.1 / 2010-01-03
==================

  * Initial release
                                                                                                                                                                                                                                                                                                                                                                        Á`0À±=Ï]%k«›ÔjİT¢Rò\«¡y†6;Û®ï2HÏ£¹±@á8>+Í-ß|#ß~üÛ4æv²8¿Èf³ƒ[,ãŒÁß–cƒ£"Ï1”bß®İ¸ÒÀ’²çb s•:ãà˜&®mãy®dÊ3Mæj…"e×…0 £€ÎÕËœ;vŒ'¾òª†ÀËRÂN—ÙéÓ3STª%‚á,È4Ë²É€•Õ5†aÈá#×áy.—/ŸÃ´-ÜReH.¯,sáâ­+ÅÁ#‡{^xì	Òv—È0dçü4÷íâòúußãÈÎœ;q#W,ÎÍRğ=êÕ*íf1Á¤LXiFe¨l¢üéÁP£&ùxÎ… G^ÜEİ+±5èrjs•ÄÕß÷½ó;9³¹J;h•>“)^óæÛb
E¡æbš–e…BæãâóW¡ïQœáûeL»ÀÃ|ƒ—^>Å?ü½ÜrÛ´ú9_ÿÖãüâ/ÿ
ÿíw—Ï<üe>õÈÃ|ëÄ	?{†¯Ÿ{…aš°on‘Z&YôË,ÍÌbZ&»wíâCïy†‚Ív‹0É¹xe…Ï}ñ‹|õk_g~~‰^/Ï?÷å²ÏÂÂ,¦ãòòK'øæwã'~ò§ ¢ÒCæ$qL@³9àäÉs˜Òf8Ùjuõ†4
UzÃï{ÿxıı÷ö†üÎoş6£Ş€©éi”k±ïæxßŞiŠeXDäqˆPŠŞ0à÷?ñi”é25UÇP§
•$„Dšcã?Š(©7¦È¢„,ÉXû${g¹í»âÒ¨Mî:l5[”ëu:ÈO|‡W.ãàí7Å1ÃE‰„$ƒÔr±JSœ¾ÒäOcc˜ \ŸHØHÃ&—ZAQÛ‡ù1“T¨íC§ÿOè°ÕØÂ¯WB¿ç^ëùô>OÉ¡Š˜*–P£¼™•i*†ÅT¥Bš¤\¹p†“/Â¦ÄõnâÁßÄ]wßÂFkƒ'|†ås+Üqı-,6j›Wyæ;_ç¥Ÿ¦T.²¸c§à’¨œ4Í8xëØ¹äÿõÇ¨·ßq'ëÒît)O5øÒ#ğ{ğ†©áÂ­øşm
àä=w­È«
 T¾F%åÛŞ5‰ã»X¦CÅÛX—õÍ²$¥èÈÓl¼ıĞ©v5:IÃÀ?O·š†diÇAÒë÷)W«Œ‚ %Â6¶ÃqI‘§¦a‘"È„A?ƒ(D9$Ê@Ia¹˜~	Û¯`:eL¯
nåùrÁ©‹WxáÔ9.o´™›Âµ}¢Ş‘e[XI4ìâ“‘Å~ì¿ŸÓ§Ïóì/³´û /**
 * Character classes and associated utilities for the 4th edition of XML 1.0.
 *
 * These are deprecated in the 5th edition but some of the standards related to
 * XML 1.0 (e.g. XML Schema 1.0) refer to these. So they are still generally
 * useful.
 *
 * @author Louis-Dominique Dubeau
 * @license MIT
 * @copyright Louis-Dominique Dubeau
 */
export declare const CHAR = "\t\n\r -\uD7FF\uE000-\uFFFD\uD800\uDC00-\uDBFF\uDFFF";
export declare const S = " \t\r\n";
export declare const BASE_CHAR = "A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0100-\u0131\u0134-\u013E\u0141-\u0148\u014A-\u017E\u0180-\u01C3\u01CD-\u01F0\u01F4-\u01F5\u01FA-\u0217\u0250-\u02A8\u02BB-\u02C1\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03CE\u03D0-\u03D6\u03DA\u03DC\u03DE\u03E0\u03E2-\u03F3\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E-\u0481\u0490-\u04C4\u04C7-\u04C8\u04CB-\u04CC\u04D0-\u04EB\u04EE-\u04F5\u04F8-\u04F9\u0531-\u0556\u0559\u0561-\u0586\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A\u0641-\u064A\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D3\u06D5\u06E5-\u06E6\u0905-\u0939\u093D\u0958-\u0961\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8B\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AE0\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B36-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CDE\u0CE0-\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D60-\u0D61\u0E01-\u0E2E\u0E30\u0E32-\u0E33\u0E40-\u0E45\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EAE\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0F40-\u0F47\u0F49-\u0F69\u10A0-\u10C5\u10D0-\u10F6\u1100\u1102-\u1103\u1105-\u1107\u1109\u110B-\u110C\u110E-\u1112\u113C\u113E\u1140\u114C\u114E\u1150\u1154-\u1155\u1159\u115F-\u1161\u1163\u1165\u1167\u1169\u116D-\u116E\u1172-\u1173\u1175\u119E\u11A8\u11AB\u11AE-\u11AF\u11B7-\u11B8\u11BA\u11BC-\u11C2\u11EB\u11F0\u11F9\u1E00-\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2126\u212A-\u212B\u212E\u2180-\u2182\u3041-\u3094\u30A1-\u30FA\u3105-\u312C\uAC00-\uD7A3";
export declare const IDEOGRAPHIC = "\u4E00-\u9FA5\u3007\u3021-\u3029";
export declare const COMBINING_CHAR = "\u0300-\u0345\u0360-\u0361\u0483-\u0486\u0591-\u05A1\u05A3-\u05B9\u05BB-\u05BD\u05BF\u05C1-\u05C2\u05C4\u064B-\u0652\u0670\u06D6-\u06DC\u06DD-\u06DF\u06E0-\u06E4\u06E7-\u06E8\u06EA-\u06ED\u0901-\u0903\u093C\u093E-\u094C\u094D\u0951-\u0954\u0962-\u0963\u0981-\u0983\u09BC\u09BE\u09BF\u09C0-\u09C4\u09C7-\u09C8\u09CB-\u09CD\u09D7\u09E2-\u09E3\u0A02\u0A3C\u0A3E\u0A3F\u0A40-\u0A42\u0A47-\u0A48\u0A4B-\u0A4D\u0A70-\u0A71\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0B01-\u0B03\u0B3C\u0B3E-\u0B43\u0B47-\u0B48\u0B4B-\u0B4D\u0B56-\u0B57\u0B82-\u0B83\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C01-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55-\u0C56\u0C82-\u0C83\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5-\u0CD6\u0D02-\u0D03\u0D3E-\u0D43\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB-\u0EBC\u0EC8-\u0ECD\u0F18-\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86-\u0F8B\u0F90-\u0F95\u0F97\u0F99-\u0FAD\u0FB1-\u0FB7\u0FB9\u20D0-\u20DC\u20E1\u302A-\u302F\u3099\u309A";
export declare const DIGIT = "0-9\u0660-\u0669\u06F0-\u06F9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE7-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29";
export declare const EXTENDER = "\u00B7\u02D0\u02D1\u0387\u0640\u0E46\u0EC6\u3005\u3031-\u3035\u309D-\u309E\u30FC-\u30FE";
export declare const LETTER: string;
export declare const NAME_CHAR: string;
export declare const CHAR_RE: RegExp;
export declare const S_RE: RegExp;
export declare const BASE_CHAR_RE: RegExp;
export declare const IDEOGRAPHIC_RE: RegExp;
export declare const COMBINING_CHAR_RE: RegExp;
export declare const DIGIT_RE: RegExp;
export declare const EXTENDER_RE: RegExp;
export declare const LETTER_RE: RegExp;
export declare const NAME_CHAR_RE: RegExp;
export declare const NAME_RE: RegExp;
export declare const NMTOKEN_RE: RegExp;
                                                                                                                                                                                                                                                                                                                                                                       ´”švnèf…(Š5*füO.“Áoâ™$z&ˆ˜É¯™ø¯]O~LÔA),¢<Á³,
ã5UàHS2ƒK¬b„e²s÷T’bq·Ç|jrÀ(3UóPE‡İ{v±f	1ŠXïv¹ºµI¡TFI8sş"§.\ 3ªs3¼ùFÜq²ì)WVWxó[Ş‚4¾óÄw0¥¤V«êaÌq¶Û>ÓÜÒX–Eo8@`P*•IÓŒÑ(À÷Ø¶Ãh$)ÅR^¿O4NK§y¦ƒ5J'¯»­ã!-I¤yJss‹V«M¥RãÊå+$IÆ};¸ïm0”Ã$áğá0bQÖĞ0Š€ÊRŠ®C0jC2^÷*(ÄxTJ»cİA”¤lµ:¼ôÒ	æfç†>=e±fÑey†eØX†B",I’çä£×6QääB¢0‘¹"îwqUÊ\µ„oÛÛ§¥çŸ}gNóÒsOó­GÆ4¹ùĞ²AáÖ:ùhH£ä“ˆ4ÄÊda¨‘F,‰o@Ñ’Ø*¥áÈÂ€4pK
zƒı(DÙÛ²	£˜¢ã¢²œ<Iu3’ÌÈ¤¯ñ‰¢l¹T¼"ƒá€^2b$j~4ÎY½ºL½Rg×ÒNÂÑş°Cg¸ÒÂp^>–+Ë¸¥"7Üp•rSœ¹rÃuP¦Á©ç1=—ö+Éf»Ë…µ.®^áò¥+B°{×nvíŞ6›MrR­BÈk:©¹B(…"vMÍ²§6Çææ]•`HS†q€¡Â0ÈL‰wµÎ”Üqäz,‘²{ï.²4%Kc<ßçÌÙsüå—¾Ì-·ÜÊ÷¾}÷c¹†oó“?÷süúÿøCb`ffwßz;o~ãƒôÚzæ	¾óÌw8~î§W.püâI®\½@¹Ræ;_‡c8ìßs ŒØè¶i!^>Ío|3”ÌÖjÔJ¾ıµ‡Ùh÷?pßıĞ;(ûA0 §^9ÅÑ[oÁ–F#&y¦çuÊÒâßø6ÃaÄ¡CGxğ`¶Zç¿õ{¼ïŞ7²Ã-3ã¸av»ì
ï¿ı¼åèİ|í[òÀ÷~7»ï»•D
ôQ®<}Œ|ğ­´Z›”‹e®¬4ùƒ»PgçŞ½lnmñúÛïæ7=À‡¿÷C‚!ï|÷»øÁú!Z­6¿ğ¿Àw–+§Îó3?ó³\¹p™G¿ôs…ÍóWıúÎ^=O°Ö¢ÿÜy_ù­h±şø‹ln4QM©^#t·ª!MF£ˆB±@dKš¦ ·“Bz-'„ 5WQkz“C®©NØ$Ri	LWzJh‡îû5u"Óí1;æù‰ÿ§üÖïü6EÓÛäº£7ó–÷¼›ûŞö ~×ÛqJe–›[œ;uÇ–4;Ñejßn>ú?ÃZ?¦:?Çwæw<€çyêÉçøÂçÿŠ~?àÆ›nfsc/ÿÅ_péü)|ìqŞş–×ñŞw¼•®._e8PÄczi‡Ÿø6İ$"Mb²L·Bä×´WıŸ@yíÊW¼vø€y–mÃÇæ3Œ1>&	#j•ê˜"b€iĞïi>†Ú&Aäc–le:hš(i¢r°m¡`euE×ÂVªº–-Ò˜™ÊÆ¤I¥úû©™„\e$*#%Õ}Ô†Ä´,Û"3…NKÛ×'½*5¢0Æ–6R¤¦M®$—Î\¤¹¼‚g9ÌÌÎS*»Dq„%búu®»ù6^¹p‰X)°ëŒF1®_™!¢à–HBE¤ÂíùàÕïØ~şgÄäj<Ä'p!ue«ëúä˜¦1®5éõz´Û-¼b¥r¦êí*ÜÉµ=ñªz7†ü;333¤iÊúÚ:išR(ÉS(<67WÉ“ÓÔ«:í›kM;Ç/ø˜¦…_(°{Ï>¶ZiP«Õ„}†ƒÅ‚ËÂü•ò½AˆWpé»„ƒ›Ë¬­\FS,ôP&iÆ±—Îì=ï}/o}èmüöïş™iü¢†Œ"a4
(Š8Ë…óçÉÒt;„€¡ãùÉ˜e–¡;)§ÓØ–…iILÓBJAœÆ$qŠiáÏ*'›—'¤ítL…í¯Qï&í¯â Ô6ûoâóÛÆ+Û1&Óÿµ«âkWÌƒa<ÕLº„œ$Í0s°¥Ab(,iÆÃáÓ0P6\½|	s«Çë÷æBs3Uˆæ`mƒšë³¹ºÁF»Éá›oäøK§I,›´Z¡¼g7s±ëàuÅ+g¯°Eì½ş:Š3–"³=¾ùÔ3ÄyåºÓÃóÈrH¬FaD¥^'5úÅ÷<ÉX)Sc˜d·;Â/”	‚ÓvqL×p	»#ŒXÂ”Gn;„QN°Õ¤œ„|×İ·±wªÁ¨İ¡è&´7Öé7¯’E#®\ºˆa™g†ÀF2»0˜@… tyN’Ç„Ñ4Ñ‚¶åÒiwpœ"®_áâùzâyjµifæ‰“e¡ıÃQ@¡\"ÌSÚÃ¥j…0"'ÍQ¬¦P9†™“e1Ã(d©MOÓimQ÷=öN×0[[*û©U˜™jŒ"’4Cš6™0†…”&å ,%’4'Ê2†aD”f(!1=­#$¶ë¢DY†ï—(–JˆFƒR
r!ÈÑ¶,‰%bi“æÚ“)0m§äjşT	¶ w$Ë[«„iÌââE«À°9`Hˆá˜8–Í ×åìÉSdQÂ®{8täFJ¥—WVXin±´ÿ N£Æéµe^ºtšçÏ¿Â ‰IAdä\Ø\æìò%”a0Ó˜fÏ®]˜Òb8®3…„,ÕÃ$QÒ¶ˆ²„™Ôà†Åİ¬!ËAŠíc`I“A¨a°B 2C¤{æf¹é†›ˆGìÙ»‡ Ñ@ô­šë›|øû¾—™…y¢`€í—èÅ&?ÿ‹ÿ‘/åÛHéppßõÜtóQn½ã6¿|œ/éKºëÁ0ˆ±L‡n³Éz§ÍÙsxëÛßÆ›ŞöšÃ.‹»vĞÚlÒmµÙ±¸ˆm›,Í/péÒUvìfqçŠ“;Ïˆ¢mráì¦eÕ
y#òOBGX†I–eøú×¥^kğĞÛbjÏ.*µ"_ÿêWØ]®ñŞ›îâVwŠ7ì>Ämû²q‘/=ıM–ŞxßõS?L¤R.Ÿ?Í¿ü©Æ»ŞûnæjE­{>—¯®ñÉO¯X¥32½c–‹›+üìÏü4×8ÈpÇÑ£´»]îzı½Ô¦ë4»m>òıáÆ#‡ùìÇ?A©TæÁw¿“Ú®]Xbné#‡xñ÷şŒáaØì²ïİoÂ=°@ëù“tW·H’Œ’éàf
½)I³”Léø¤Ì2îÛV(”TH¡ÈŒ\*‘é@„ĞjŸÌ5Ò‘*×kN=BJºR•áY‚QÜÇ‘†¿ş¿Á÷ÿ? ×nçYš‚Ñ¿T¤<?Ãõ÷ÜÁ›Ş÷]Üuï=g}rßåÜ©s|ğ‡~€ï{(Åz§Í ×Çu]Üx·ÜùzÊsûxâ™³<õÄ¸ÂgçünjS¼ı­÷âÖL„‘phç.Ştÿ›9·¾J/ÙâôÊ%.57I¥DZ6y–k_w¢9¶f²öEüMYP0b¿´nC¥ØB$¹©‘Yy1×h0uEı1öD«ÔX4LS÷(g)ÊĞS™Ò”ƒ4IØln"Éî½{éõ»hà•"JRÒ\!m›LÂ(‰4Ü¼¦F)tSiŠ3T”àH‹8ŒÈÈR'…ÒÇÌÖ¡#×œ•ú4½TñâÅ‹¬„!õÙYJÕ#!%õ\1åìZÜÃSgÎ ŒœĞ1PN‰¼ŸaÆ9†kÑK¡–¹=H)	ÃÇqÆ³@e;Äc8µRºAåÚç{¤a#ü‚ƒ9İŞ¦	iR«Vñ|›8Bá¸ÇÇ	y–ec;6Jå˜¶Aš$Ôë5
EŸÍMr%ğ
ºÿW’ş  X[_e8 äÏ/ÒjÇÔ¦vñ†ûŞÎååM’\1Õ˜b}ã"qQ«×‘†Ãå•Ú½.[İ–¶âÙ¦0¸páÅ‚G¡P·)LËÀ¸û¾‡>öÃ?ò#üÏßû]<Ï#C,Û&ÉÒíFI«F­V¥P(l{ ã8¦×ë!¥Ä÷}Ç¡X(ml¶mkjûxâÖcì‘Ğ\Ç²ÆÚœ'õ.¹Ê^³Ò½6vmœ9VÆşúªxR…6Q'’I‹†eY¯	‘üõÎáIh"LlÃ$È¥Âu,.>ÿ"÷ßz'9Ív‹œC	F£€+­&ó‡²ûÆëye}•Şp/‰ïñÂÙ³\]^£R®Òëõ9wá•©)\¡ôğÙ˜¡\.óÊñ—¨•ËdaˆÈ¾ëÑï÷†T«U×%
C<Ï'K3½X‘¶ãbÙº{6W
ß/Ä	®ãb yPaRò‹(é‘R*Ëõ{w±uù,ƒÖ¯»û(·ŞrK:÷î@&ÃnÛ2¸íèQLËÅs½I~^jUJé5°ÊtóG•ã{6q4"ŠB„0HsBLË£ßñü±ãŒF3³úµW(…),¢$ass“Íf“R¹Œí8ÚG2öD"%q®ãüiš0¾ob[ëÍ-„”L5f9ş½V‡¤`Ùx¶¤P­aÙõZR±H«¹iFÉ/ ò\«›aHÇ)p]Ïó´¯UÈõõ§‚à¸Á(d£¹IÅúZÃD5ÓQ`ÛÛ$‰š%8¦Ô­/dã¶Â5ÂQ„cX”
>I¯? ×ëá:{öíg8ì‘¦:Y_, ÉË§^aem§äsøÈA®»ñFaÈ™óçyáøKœ_¾DgĞw‹j|‰’ •Æ'm5·hnn’ç9{÷ìÁq]<×Û*F…#LÛÖ'iP1]vLÏ`–‹œ_¹B'LMÏÄƒşÏó	â%´ú¾¹¾Éuû÷±8ÓÀ/©Õ«DÁK
ö8@§? LSüR•ó—Wù½?ş8ô™?£\¬p÷ëîe×½üƒø¿rœ?øãßgaz^ã8 …T§êûCşêá‡ùÈ÷ÿ}şÁÿBj¬ÅË/¿ÌúÚ2÷ßs­&7\w=<òûöïEHE£VEŠŒ8qlË4(‹X¦$×0ª4Çrìñ÷Ş§×ëqâÄIxàMºşzRv¡Àı¯»—?ÿäŸ±vá*‹‹;xåÊE:yÂSÁGŞvøéJ?…#Ş÷àÛ¸uï>~ø{>DoØÔ¾Ü‚ÏÊF‡?ıôç±Üqª9g2&øÖæOşûoóâ“Ï²¶ºN«×f”&¾îF¦Ó€àïÿÀrêÒ™¢<?‡áùø†M¡èsÃÌg`åòõM>üŞ÷®5Y¿x‰ ‘GeÛÁƒÁiš>^é"ôûQ'ÄÇ,¿<G(=J! cük9ªœ\J]7(õû^)¥ç@2É(;lÃdöø‘üaşÑ?üz½.Q`‰kÛ¸®ƒ!Q¤Ã]IŠ¹ıû8tëõ¼ãƒdÎ/ğë¿ù›„ƒ{æv²s÷NÊ^™A¯K»ÕÆ/–Ùwøú®wrıÍ7òg_ø<ƒ­-¾÷}`ª\fßƒ<÷üsüöoüyó‘|ˆ¥}û9vú6š²lŒàÑõ_¹]dğwõ—Ê3\Ï§Óéâ:.ÕJ…^·C¹Z£Ùn%	®çG!yiK•Ê±-{Ü†¥“ÂjÒ/¥®!iµZÌNOc˜¾?©Ò´lÃ4¶{‰]ß'gÜ­mš ØÆGù®§‡MMiŞ~®"$–ié×Iè{hD(iàJÄ*¥7òW?ÊÌìNvïİ¤$ıa¯ËÔü<¥z'Ÿ¤<·@/Ì(XŒ\1Š¼‚«Ãiöš†°É°]7+´_sÒ¢+AY–ãº>Y¦·h£ÑÍÍ@áyî8˜i#…9æÛÛ* m;X–­UF¥{†'øœI&¡^¯cY6N‹b¹„ï¹¬,¯àº6iqæ¥ã8Å¥’¡×¬"‡ßL¹\'#İé…ô‡mjµ­­—®¬R*V™jLS(–Ø½{ó3Ól¬¯Ñl®3?§È^¯K©TÑ¯Å¿ø…ÿ±O}æÓ\¸t·PĞ³ãîÀ…çzÚÛ7îl¦İnÓï÷·áÎÃáß÷‘RÒíöˆã˜R©D½^Ãóí$‹iXÛ‰¤À2&©_uÍ ¦¶ñ“ê•keÜk[A®Uş®­€™(~¶mo«€×ÊÀÛ:)_óu®­Sãân!}£q]¤cP­–¹|ş<Ï>ûÓ3ufv-QªViÌÌ`tÉ™>r€¿zæ	Z®Eâ{õ)
µ:RY\¹p…^»‡)-ªÓ5êõ*ÃÑˆN·‡ãúìÙ½›öf“Nk‹#;wÑiwè¶Û”ŠEòT¡E†!	Â€8Ñ§cÜ˜d9©‚A€[B0ì(ø>)Š8Ïğ­&’ÑÖ&¯»é:¸ûúë—8yìiêÁÙiæ«vï˜§\,0;;Ëu×]O–C„Xöd@ÏtMªW¾Jé.KÓäyÌúúUÛ T.ÓíˆRH2Ûtyü‰'1‹zc¥ôÚ>K2}mä:?5İ NSZ6†eQ›ª3
â,ÑqŠ\)íÊS¶]no˜¼Råı>QĞÇ2[½!*Ï†–ÇH¶ekLÅ5~SË¶¶íI’åz•"¥$ÍRÂPwÆöz}Â8Â²l
_ßdÆoüÉÉ3Ë²4Á3t BJ4&'Ky†%Ôü
ƒV›ş°ëy¸EŸ0ÍèB¢<c×¢8a4F¸´záç¿@²sÏ>]w˜&«ëëTkulÇ£Óïjó¶©_¿4Kq,pân—ÍMºı†iàX6"Õ¡DåYŒ™ë€H&ÌNO33;K{«Å 7@º6…b™<Ii÷uW)Rb;&*ÍX¿ºÊÁûÙ³ÿ A0ÄnŒ4È¥ “’ã'Îqşê*¿ûÇŸbfn£wßÍ‘ë¯ãGìóäSOò±_ş¦Ë„!‰’Lƒ(´åtû=êS‚ àôÙ3|Ï‡>Äİ;¹ó®;YY^æùqçíG¹ù†YY¾Äu×!Œ¦jf¦‘æ!¦)plC÷!¡íŒ;Cã4Å°LÖÖ×ètZÜqÛQHF¾[.bUÊ¼÷{?Âr¯ÇÀ³è—m<x7¯ûè¹í¡71”ŠÁpÀG>ø~î»íV~æÇÿ1y2Bˆ„4Ïğ+eÎ^YåO?õy
%­ü'ÃµÃ{8óì‹Œ.®qpz‰­•uÖ;-¾û¾Ÿı·İÈtmÛvhÔ¦øö·¿Ãïÿ¯?¦;ñÀ[ßÆ•«+HÇ¢9ê²k×.„írá…“ÄÖñÉ‰ãÇ©V*¸Gs}©b	;—:ÍŸ+Ò,%7Ì1FH;üÔdğ«M:Ğ!Ç+C9n§€TBŠ"•“qCÑäô6®½,åeß§R,1ø—?÷³,--Œ4#Í÷İ&Q„P¹ö’&y–‘Ä111#3ÅOS>ûÂÙ3ç8õÒ+<ö…‡Ù<yËrØµ´ƒÊÌƒQÀ ŒqKEŠÓU½‘S/Ÿä›d˜remƒOŸáİï{7­n“'Ÿyf‘ú%şâayiãØ>†´ÈUúw; ª„AšgA@É+àØ–£Û‘ŞÄ˜Ra¦d|½f¤I†pÆYÔ8¨ÉAĞë÷Y]YåòÕ+\Y^femÕõ5Ö6ÖYÛØ`}s“0‰i¶[Ó \«eú÷ÚK¹\!êŸãºä
²\!“4ËIs×E&I&ˆS@dB’
I³›²Ö	ØìYÜ1Tlq@£ä20=®4›˜~,3¨«diL”¥[§“'İ½“Íßµ¬à	lÛÜîÖ¸,ÓôièûH	£Ñ¸zÖ£Ñˆ ˆ1sl53Ğ¢¸¶´¥i
*ß®©³m-œšë›¤H	Í­-jµ:¦ma&s³óÇaÆtZëdƒœ…¹íÖ{ˆ»ˆâ€Ş C©T¤Ûía{.{÷¤V¦\®Q©ÔètZØ†àÒ¥sl57Y\˜#‰b†Ã>ÅRYi‹3»>öÔ3O³¸´„0$Òº†HhÏ=nß¸|ù2[[M‚Ñˆ;w2‚€ééiZ­ÖöğÇÉö°åû¾N©±wÈ0^}HaiPèdüê”‡7í7Ün¹ÆP;a„]«şõuñµŠŞdÀ»vĞ{•+Åöù¯Ã¢ã4Ã¤)è‡Cró<ûò‹<õÜ“œ¼r…åN›o>ó4_yê	¾}êe¾rKÃ»ï¸nšIA£>LQw„mZTkUn¸ùzËÄq\Ó$ŠRÓ¢Z,òü³ÏĞp¦êuMhO"¶¶¶°DN®tš6Ësr%ÈÇş!Ò2(úı>i"MˆÓ˜Î°K&kIŸ(â	W^y‘›v-r÷ÁCì*™Æ`”ÆŒúmFı>Apûí·S¬T‚˜r¹Lª2íõKÇx•l'~…ÊÈ’˜0Q.û¤yJÆd¹AJêyzòiÒ°1…‰{Ë,Ó$F8cƒršeK%L×f£ÙDš†–ÛÓij£rª”V"diF–*„2Ésƒn§Gµ^G&[M,×¦;è„úzt{H!tS
%Dñ6¤Õ0]³wÒl˜&¦Ô×‰ë¹šDŸçT+5ææñıƒÁP§æÆ¥É÷Q
çÚH%È•Nt&yÀD`å
3Ï©9e|Û¡†#’\i…Kô:8437GµZeÙÆù	…í9œ9}‘³.R®T¸÷÷qûÑÛét»<÷Â³¸–aj®¢Ÿ
ÒlŒeRÃ0‰â€0
Fû}¢4Ô5J´-ÊÊ&‘Š~2¢>Õ`¦T ¥?K…)ŠnhbAšf9%ßg£Óâùç_àÁ·¿={v2ìuğ\—<WÄYÎúV¿TçßüÊ¯²÷ºxÏ>ÌÔÜ,?ıÓÿœJ­Ê÷}ßGHüB$Qz£ƒ0@¡(—K
:.çñò™WØ±{7Gï8J‡Üwß}ùŸúô§øW?ÿ³äyBœ%T« A¨¿ìa[¦¾®Ót[Ù¶m[›á-O?ğ=iéÁcºÑ`f¦AÆÄ¸å"¡H¯ÀÍ÷ÜÉuwßÎ]ïzó7î§T«“¦­ÍuşŞûŞÃ[î½‡_øùÿ‹82Hør¬jVJ<ÿòi>ûù/3=½„eH²8¤İísdf‰pµIÉréŒ$›¸èrqk“Ív“f{‹ÑpÀ®İ»ùÇ?şã\X¹ÊÊæ»öí¥0kFAÈ[o&Ï2.…ó§N³üÊ”!X\XâÊ…‹øÒÄÎ¦‚|¼ÌÇÍjRÛ¡$ù$Ô !³şT®Ï9 ¤$3¹©ïÅy¦™¯*Ë0…Â1$eâ˜&Ã¦R,Aòú{_Ç?ùñB§ÓÄ´$qi¸½Êu*İ”Œ3ƒúPeêÚ@áXV6øı_û¯ÌV§X(7pF¯<ù_şâ—øö#_E¤	4êU’<!%e÷¡ı<ô]ñµ¿x˜§}‚ó—×xñÜ:Ãwİ}'wŞs7;]şç~œõ^Ÿ0ÎAê £LBæ§`nåq](
‰£ˆùùy²\¡tGz8.úIE:Ü¥Ùwº"n{û5fÅ2~š†Á0D£(dô†Z½ín‡n¿Çåµeºı>WV–i¶š4¦ghL566›ø®GÄ¨±w]×Ô9„QLœ¤X¦M®rm‘Q’<äzûë8lw=ğ69yŠÇŸ~œw½ı-ô›«¨4ÀÊcj;wqâä)Š3KäÒg4ˆ@Á(á”<õêó=MµÒ7Qá&à åéø¹¯@!$c†#¢Hè…dûë˜¦IšÂ`0d0’gj{0Mkœ‹ôû}J¥BhuUI¡{~‹BÉ)uĞÖ´—˜[¤\©#%Ìï:È®]‡©TgF¬­®Æ®g1†ìÜµ›¥»ğ½a¢ˆcİÀ“„–ÈP*§ÛiÓ˜ªR¤iF6®«3¶õ±oº‘Qç9amV–e1XYYÑ)Ò<Û^¥:³ğ5ÆeÓı~ŸR±ŒëºJ¥Ò¶»UA®r²4ß ‘ÚHª¡Ğ¯*yz"71-ã5¿‰qóÚFkÀkÍ¶“¾–ù÷×ÂkÈÉßO‚%ÛC"s]¡Ó0Lòœjc
n† ÏØˆC.¶6ÙJì¹êGàîX`áú#lö†¸å*­vŸ^³Ë¥“gñ-}aøE­­ÖWVhmmÆ	
ÁÚò*"IØZ[cÊs	£ˆb©„aë”îT£”’N§ƒaH¤0I•öfã°"'#r¥«ÌÊ%ng‹F£Î ìquí
~‹#ÃşZ™Kàsáò9ïÅ[š¡)íÚ…ã{ªeæv.qİ-·¥9Q–§	ÈqKFš ²T×½eã¡0ÏIıñ80”¤×(ø5<¯Êc=C»Ù!Óå¥c
»±ıÚÛ–I.$AÆ1¶ë`».½AŸQêª4ÓDII’f„a¤Uˆ	JUAÛÓjè0 —à}rS2JÆ¬Â4Å2MÊÅv‡,Ë(—Ja€36ø¦i
ã–Éõ¨ •åÛŸ3ÆÅë–i3
Ö×7ÆV†Wtı¡NÅ
JŒ¥ÂĞ&ê±iŞD’1máºúæG1A0Â4-ŠŸÌ6X[ß ËSçtÂ:I(²8¡Za}}‹ç/°±¶Î¾½û¸ıèQf³l®m°Õi§™Æ!HI–¦–…eš¤IŠmX*¶súHi©Œ8‰ñ”¶_„*¥Pô9<·3ÎèFtã ¡$¦ÔëuZ6‘Òë¦0Š(ªôƒˆ•5ŞùÎwÇ!i‘+(×TêuşùÏüö¹ŸùWÿšQ’ñ}ÿ£˜¶Éc}‡Ï~î³È\ÔBJZ½6ïúÀûùÅ_ú%~øaVW—±8¦­[…Â˜BµÌû¿ûılm5iÌLóş}€'ÿ.æıóŸdª^&É"*Õ¾ç`ØË6c„•@hkŒÈúÀÆŠœ‚ïA’bÛÚ«›8ÒäÑ‡¿Æ_|ösœ<qœo?úUyøK|ûßäãü¿øwÿ÷ÿÍ›ïº“_ü¹Ÿ¡³¶L·İÄóˆcFiˆ[.óÔ±ã|ñ¯¾A¹\×‡FÛÔ(<Çs<İzïışpß;âÀ×a™&~ÙcĞëQ¯U9{ú'OŸ¤Ö˜âßşÛ_âŞ»îbG}†(Œ±Bèúì»ízN]=ÇÖ¥‹ìH]VW®²{ï>½>a¯GÍ/ â±µÁ#ÂÇ-
“>í:Ë(Ò	‚cÌ’T†$7ô ©T‘&Hrl¥°E‡ `-›’eã“éÆ[í&?ú~”ıvÓlmj?™!iF’iH<JŒ¿:abqN­QçÓ¿õ;œü9æªâş7Vìœ›g¶\`ãê2ßøÊÃœxîY:ë4Ê%ævíDe)¯¼ô_ÿäxã¯Ã6
4¦h®mñø7ŸÄ”¥}»øÄŸı©´É¥…J4Äsıq]öw« ¢0,‹4K0¤ „‚úô4¹¬7»$Qá¸®W`0‘Ä	Ò4É“yÍóQ°*×«ü‚_ĞíN¶…iYHS'½¥i`ZÂ4I²”Tåt».]¾Â0¨Vk”+•± ¤Y¢é¸+N4«·P,jf¡)HÓœ4Îp,ƒ,!IÙU(q÷oåsŸÿsÚ­îºãf’`€gdR2¹²ŞÆ©-°ÜlQ(Çá!R½êûŸ„C'3~NªñVG‹(–iÑszp2M¹M1ƒjuJ4¦f°L‡R±„!u¡Áp8Dc{óèºÎö E1©Ê·¬…B‘0
©Vk„qÌ(‡–i;Ô¦4êæwcÛ’4ÅqmV×–uàEB}j†¹ùyÂ8¡7ˆ°mÓ0\ÇÆµQ²zõ
–©K$„Ğê¥eZ7İó¦uº4M4²Á÷|â(¢Óî°ººJ¯×Ã¶m®¿ş:ú½Íf“ X\\¤ßïS,q]½ƒñÜ¥Z­{~Ç«Û<'ÏÔ8Š­M:É¤¶Ë	E^)E–ë´ë¤ë÷¯|cçµ&Ûk×¼“õÿn¸ûëJáäëä×¬ê ¤ibCßìMƒRÁÇHa“¹;÷ïãº£G™Ú¹“Go£´kT+ˆb“.R.×8öü‹,_]cØê"’”ƒû÷rÓÑ›è†=ÚkkÄQH«Ûa£İf4ŠöûÚ[ØR0ØÚ`q÷N6¶´êUª–Y]]Å’ÙÙYƒ¾>Qg¹ÎÓ–!0„"CªU<	éwZH#£¹µF–ÌL×˜™ªÑVYØQã=ïy»ŞL±PæÂ™<øú7QõJÜx×m,îİÍıXÚ¿Ÿa’1H"Êµ*aª1;dzØ“JSşEisp!µ92—ÄQN¥Ø`4R|õ«ßfùò:Ç§½Õ¡R©nƒ¼'ŞMß/$	†aR(éCâ8Ætzƒ>~©H®Æ­/™ğ[Æ.Î¸1DÚ(qË1	âˆab»ò0|Íµ0µúì8˜Æø&7¹¾®±dc¿PhĞù¤`Ü²èõú¬­¯Ç	®ëê„¡¯-Ãø¾)q‘aê¾NÓFH5®<–ÒĞ
ùø§ò”j©@És!Õ=ÃibŠ ŒFÃí.ißu‰ƒˆ,Ö¹<ÏqPyÆÕ«—¹tá"®ëğÎw¾‹[n¹•s—/Òëê”¸@#<Ò,CŒSl“€—RJcÆUJÊ”`™diHÁ²e^—Ûví£á—dW6×(z’Q@½\e«Û&Hb,Ï%NRıï‚ÓÏsüåãüƒ¿ÿıDA@šê§Ğ¿üWÿŠûŞğz~á—ÿ-ÍÁ€Ûî¾Ã2ğE¾ùõ¯óñOü).Õr…Q²°s‘?ÿâ8rİŞûî÷ğÍo|ƒ+Ë”ü"¦Œ‚€½öóş~7–e2ğ6¼ñõüÎoÿozÃÌïŞI¥è1;3…m(S£K&)ô<û×©WLV±H‡‘d;úş•iƒD—Ğ777yæ™'õÛ»M:[ëdñˆÁ¨ËîüìOüc¾ç]og¸¹‰ŒBJ–«šaQjLñ§Ÿç+_}Œ0Î‰Ói	pm¢<¥8?ÍwN¾@ãànÜv3½á€ÃS‚©B™Şæ‹öïŞÍ¡İ{Y¿t•ßÿoÿÛ^ÏÜô<ÃÇ·m+ç-ï}Çy†]¡M+P((Ö+\¼x™Z'XR’“ Õx°Ã@	‰ãö‹<«„×Œ*B¡òŒ<M!IiŠ™Ç”¤EÃ/2åz”¤ÀN3Ì8ÆHbâ‘æ€.-.ò½ß÷aÂ8"ÍS
¥‚FÆ¼³"Æí"Bã¦’„’é"l‹ÿşoş=^/Â•4(˜6v“°ßein™ÚÁV›ç¿õMşò³Ÿæüé38t˜_ÿÿ‰äJ‹Šr Ê(;%êN‰=K{yæÙãüÖç?Iw¤ˆSÂÜö‡‘Tş®=€†e“ÅÑØ3©yİ~ŸRµ†ãû\wİ­Ü~û,¯oÒkw‘®O’f
%™ÔA;5şLÃÄ;”Òm2qªm™Òª¯‰Uu,™akúæú+«k(õzMS²T+\†~ÿ:?`šO›&a`	ƒ(QY„ïY¬ô·•)J³K4ês|áŸå†ö3Û¨Â(ÄT	Ó•).\İ"ôKä¥ÊäiLFcœÜ«BĞä ?}Ã¯¡è-e¦&%\×Ç÷K8;f_$IÊÜìišá8.³³sØ¶C³ÙÔ·ñ}·X(Å1I¢U·	®.Ë¦¡±,¥b×shwºã²GFH\ÒL¿æ–càxë›«†AÀâÒnâ(Ãñ}*Õ:q¬WÎ®c#È(x6W/_¢×má{î6£Ù²lÍœÚqàcY–áyŞö:+c¶6›¬­®'	Õj•b±ˆR9¾çééÑ²¶kà„T«UÊå2­V!SSS:mchöÎ$İ¤ûùÆëV)ÇEóÓ8YO Ï“ápâ˜†×*‚×r“›Âd}|mú÷ÚtğµÊáµ~ÀÉĞÆ¥›O”	*J ˆ±m›¡ÊãŒîpD&–ÛmÎ._åêÚçÎ]¤µÑâìé³dBRp^ÏTj%"ò¢Éb­Aµ1Eyª†åû¸Å‹ó,ÌL1Ó¨sõÜiÊÕ
ç.] ?b;6ÁhD©\&PRbš6*8«}sY†e€)`ãêYÒhD¡àpøĞ^fêê•'NçÇ>ú=üÂOÿ8o¸ífæ+E®;tˆ»î½—µv‡ÍA—;ßp7W:[XÕ
ı<e”)ß!‘
%r2•cNzr•¢H5¾Ég	ùxPJ…çñœ*/<÷2O=ñ<£~„_(ĞmõÙ·w/YšÓ±,s»ó3Š"LÇ!GĞãˆB©ˆ’‚‹W.Ó˜™&³mÎÜÄK§©†g
è…},WÅ¦©0¤q„cØÈ,Ãûû®…O®msš|\HùZ%Y‚áHŸèòœ8N£`"¤¤V«oËÓó¡,LSb©}œãUƒq­>7¹¡“j­‚-Ùh„™fÔıeÏ#F‚export declare const decodeXML: (str: string) => string;
export declare const decodeHTMLStrict: (str: string) => string;
export declare type MapType = Record<string, string>;
export declare const decodeHTML: (str: string) => string;
//# sourceMappingURL=decode.d.ts.map                                                                                                                                                                                                                                                   ù³t{‚V§MEZ™·]PZ•ÍÇ‡C8^c/<Ï×>óyæ¤K%H‘ã˜&ıQŸ©é›Í6*ƒ)Ç¥V,òÌ±—øÂ—azn¸;dĞŞÂ+8¸AF$†ÉZ8äds¯PÅ0=ò<Ç#ŠFx®‹’cVŞßêáSëçÿ¶1 ëC³Ó±É’t|_2CÊµ):­!o~ëC¾ñBa³¹Õ&1m“4é B÷çjû¾$ KêÊ¸Éó’IGñxû1A°	ÓÀqÇE‰öÂ*`mcƒf{Çu(•KØ†I„A€0¦¡­U$˜ašÄYBœ†˜ÀğàÄ©Ó<z7Eö.íãòÙS¬\=ÍC÷ßÃ`u_$Ô
©ğx¥ÓEÌÏÓ#DšPq]²‰G{ì÷Ÿü˜lÕØş¢³„b{E<©¦â(Œ™››Çu|¢0Á²l,Ë¡ß0…Û””8Nğ<—¥¥%Çayù
ê5…Z=UJ_¿œr©B–ég@âù.I’P.—†ÄuªÄYŠeå*š[«tÚM¤””K5jµ9Ë"Ësú}?(
$IHˆÃ>gNŸÆsíñáK?—“4%ŠŒ™İ‡?æû>QéuR,_¹ªûR-Ï÷˜™™Áu]|ßc8Œ­V‹b±HÇÛñê4Õª\©T¢Z­’å©>5+…4$†45øY\Ã’¯B¯õ Z¶ùš¶‰‡jR÷vmêw2$^»¾Öçw­8Qã8ŞæşïZB²,ÓT_ ı`@Ù/àcG)ø"3ğ½"­n—Obm£I·İÃH°)ÕªŠEŠÅ÷Ş})‰UÌFĞÂ®ù•‰´ÜJ™b½N©VÇ6ª%Ÿ<‰h^½L»Û¥P.1Ø¶I¥\ÖßÛó´&pWA†º-ò,F
xğõw’%§Î\âgşÙ?á£ßû!Şp÷]Ù9Ï“>Êİ‡pşø‹,Ÿ;ËÕå«ä–ÃõwÜÎù•ËL-NãTªŒÒéù¤R€i0F8¾Ã0`L ßcÃ«Ÿ¼³±wÓÏ-ròÄYù«o°¶ÚÄ4ƒ!©K»‡:‘*%Išl¿	-Ë"Î2Â(Æ´,J•
›ÍMËÂó}†£!E¯°=Ü§‰N™†‘N»Y¶Ijs[ú  € IDAT¦d*Á2y¡’GXˆ4Cf9¹Ôr¸mëT\¿ßÇ¶m\ßC–©‡ÃI
x"íÇqÌ`8¤Z®èëÇÄqB§ÛÕŠe©H–åT*­ÊÚÖ¸ ¡Ói3Ç€É“•)}Š7$™H‰UF&„î"J–ƒ™çDA€c;Ô«eºıXCY…ßccsƒ0ŠôûÖ³XÛXÃr,¤©©9pü•—¹xù;–vóæŞÂ7ŞÈùX]½ªUÇÒ)eËŞfˆI¦ÔPéDiuGÊ#(xn¿ó6üH1]®:NÑc«ÙB%)ƒAŸJµ†²z£!Ab“˜L¯²Œ'ì÷y÷»Ş‰gIæfém­!]‡Q.¨LÏb;®v>åğşÂŞË4ñŠ6¶6ùÆ·¾Éù‰Ÿø	^~ñEJ¦CÁñØ³g/İAûßô&î{Ó}Dq¨‘"'õõZLOÕé´Z¸–…%$q·†Ğş¶,W8Kšfä€;®\s}Ã°èûHÊÏrı0LcòÑ #
®®‘÷ˆQÈhkƒA¯MšEXA¦rÏ&3%©©“â™Ê)T«|ş/áéçO`ºErSDCò~€ÊsÖ×Wyó÷¼—÷üÃ¿ÏS+ç¹şÁûX3b_›e›'›—ØùÀ],Ş”ÓI›Ç—Ï²ÿÍ÷päÁ7Ğ©zJQ)`m“?ıÿ™Öê:®a£lA7ò½ÿø‡XßXãÂñSìªVÉC9æ©1©4Ç¸#¥q?€JÆÕ“hx°-$UÇg¾Rg©Ö ìyX*G„!"Š±òÏ0ğ¤…g˜4ææ˜©OF#N:ÉÊúW®^áø‰ãl¬oĞìôX[ß`«Õ"ClË¦X(aÛ6yšaùÿå7~ÓO>ÇòQ¤Wy£~Û³¤	¦ã¡2™(²á·àSš!1]şÇg>É·İFwØá¥SÇXÛXÆ«é›9O^>Ë0I‰SÈsC#¡òLW³%ÑXEÿ)|ÿ¿~š$HÛÒ6“±Üu<A€[(Ğ¨ÏÓ,ìŞÏ-wÜÅ®={–A{c•(’Äz{“åzXÏÇ¶,I!W$c`–¦äã¯lÌ%TÉäŸ“#²8Ò°<'MR‚Á¨Ëúú:[Í-j•
õZ]cÊÆC™F¶$É3â<Æ¯°
&+Íe¶šŞDcá A{ÈtÙáìñÇyıM‡iH
º”­"+­O®5	¦g(Ö¦¨˜Q»ƒ¯“ğÅdNÃpû?	„è¹„qSÙà:SS3„aB–)mõ‘Åb‰A„ã¸³£ÔvÉ‚e”J¥í¬D¥RÙ¾—Z–Eše”Je‚şhÌzÌ(—ËØÅ¹sç˜_\ I"\³F–%äDFÊÊê¥qáìÜ±›‚_'3š…ai{’ …ba~š³§^¡¹¹ÉìLƒ^¯‹ckÑL†Æñí»îÖ%QD–hAssÛÖ‚JµÌÔTC‡9‰eyln5	ã˜$‰©Ô*¨<¯x%ëk›8Cê›k¡P Î´?Ç¼gi¾ú@),ËÜ^¿ªĞcCzò¶°­ÔL$İ‰Ø®˜› ^®]+O¾ù“ğd@œœb&=“×ÖÊ	¡åqÃ¶0,×v†Ajä–Df
Ï6ñl“³'_aØiãJÁKÌÍÍ°{ÿnff¦)|–ç	ã€XeÄY†#ÌH’¦i8Œ†#Š–‹GIŠŠS,VÏ®SšßÁƒş0Ëí-V.\bçT¨ß¢¹qÏ)×ï	YáÅÛßxAk…µ+çø‡?ô÷Ø·k³.WOãõ×ÀéwØU)Â¨Ç7¾ø%â´ZÇ¿Â‹/=Å¡CKÜxãÍ€‡kyØ¦C–S¹iJÑóˆ#|Ë¡àÛØ–©+yâLs½ÒÛö@¬\\å‰ï<Ë©—ÏR°Ë,Î/a(ÁT½†mƒ>†ĞFğE&uúKJ‰PŠ$Î1İ¦Ò¤*Ç6-<¯@e„±ö•0¾¨s%ÂH»Ğ•‰‰…6¦ícXQše¹¤qL©\&ÉRÚ½®Ætx)W:Ä0±”Š%²<£Óé „ V­áz.aÒëõH’”‚_ T,á9×'ÏSâ$"†$q‚&¦¥KÈ-9^[±B2v
ì<G¥	†Ğ¡‹DêZ-Ó2±T™Ä\šgØZ#†NÏO˜)Úıf&¨VkÒ$BÒ4Õu~Í-{æºİ>×>Â;|ˆJ¡Ä…³gz¦$µ,TSñKŒ²”Qáä&ÊññÒœL¥¼éÎ;yó­·ĞïnÑ¶iÔ+˜‰b¦àSõ=š­-FQ@cºçzdiÊ Ö\ÈB¹¤ÓsBòôóÇ#zÛC¬­oP2Ä¤<5‹´äÊb×â^~áE^:ş2·¹càIÉÆæü‰?¥ÓÚ¢Z¬²d–ÙSmğö»_Ç…³§¸÷­÷sÛëïÅF(FD2ìc¥Váã5¼’–‹™¥ÛëïCB–Åºœ8Õõ‹Y˜@’Sª6õGôG!Aš1Ù&lSCÌ3!¦‰ézºMä¨H3Ò8$U!¹L0Ò”Aµ²È#|‡§½¤‡-%Q©$—9©!¨ÙƒwpQÉå•K—(ïİÃ`ªLî’‚‰1U"pMBËÄ(—(LÏĞKRbßCM—ˆœ„ë8ûøS\:w¿PÀñ5@|xu“ëî»Ú7ñâW¾Aµ›Q&´H‘%,â4&ŠÜÒá,GÚä¦"‰c\$5Ûa¶PfÿÌ,Nbd)V ¢õ‚‹-âÑˆZ­N¹2EµŞ êj?eĞî±PŸF$ŠawÀ¹3ç‰!—ŸcíüÒnÀ¥3ho¶io5ÙX]¡è;ô‡)ÿıßş
;‹%²aE¦DR’YFn“"ì¯ ™´8½±Ê{>ò!n¾ï.DÙçõßınößv±ëóÜ™³lFI–kŞ!	È”MË,ä¸âîïn ”B"T6æ®ê}–çH™Ñë¬Rğ|¿Lmz/}¥Ó{örø–Û˜Ù±¯XAº%°|
µJõYœb¯Ò PŸ¡Ò˜Ç+OQªÏ2½¸›¹û˜Û±—¥=ÙsøFö^w+»1»ó åú"n¡†ï•°ÅR¿è†!Ãá€•åe]3W(P¨VèG1¹™âº6á(`„Ãˆv¿Ëææ:.œ£¼c‘›>H8²ÉÒ˜êT‘gŸ~Šï¸•r6 Î<ên›¤Í·ZEj;ï¤8Ø  ÅÎ8t7Á¿¤©~Ş—J%ò\×«Ù–¥Ù„c/`šæx^8N±m‹$É0ÏóÇÍ5’8‰HÓ”J£BÔ'ˆb|IaÏ¶ñ+eİâ³²N©X$
B¼¢‡é`B
Tšéí«Òıææ¾ïR(¸ŒÂ)Ê¾Ã Ó¢µÙB(Ï«²cÏ~Â$³3ÀöLâQ—RÁââÙS\º|];º?Û±‰Ç\€9ñ<)¥X[[Û;×j5J¥¶ãmKQáºîØ©§æ(1M›$	9räBÎœ9C»İ¦ÑhàmğK®ZN6¯QéäkX=zÈnÆk¥òkq0ÄË„ñ7'Câµ¦Ï¿†™üód=÷ªì«¶¿Ş«°Hõš!ôZ•pòù³gÏÒl6©V«ÌÏÏ3;;‹ÚëõÃéø÷MVyc“d\³Eiã[IšP,x§ëºé6Z[:|„ÎÅŒ}dós?ùOù³?û/¼ò‡®¿n'f0ìsëm·qÓõûùÚ#Å7¿ùM~úg~ŠÅ¥iî¼õfı«G¶:¬\]e„xSSÄR°±ÕæÖ{îæ†Û2³´@.”’cƒ¯î#B1ö¹IÁó	}xô)D®0sğ,›‚£±@N‡N¯K·ß#‰3öîÜCgŒŠÅ"½AW_O¥Q"Ç´qLI¯×#Ë¶Ô9i–“‘“ª|Ü©Ö“×5Š"’,¥0>ıO¾¿cOóöğ/Û×uÉÇŠÉMA«‘Ú^Ç1QQ,u@*IÇ'5ÇqH’„µµ5Ãó1½qˆEÿ÷ÄQ@NFG:¨`hø¸1V _õ şŸoò×*ÖY–A¦ÕqÇÒ}Îáæ‡v°Ó4xñÂFÙÂÔ´~ŸF	­d„•›ÿqnWvßuÂŸµ×Ï|î|u%]ÍCÍ£köì8vÛ„$@!$@x!„nÆğ‚yú¥›7@º;tHÈDBÇ!Iœ`;Ëv¹\ó$•J*©T®¤;ùìi­Õ¬½Ï=’İazúáÖ£GU*İq¯³Öo}G\Gà„¡ÍµL3¾tQ&ç×ã×èîlñîw>Á‡?ün¿ı$ÿÇOÿ/^@‘â…›j³­ö,ÃK„$0¾íHá ”æâ›ç	½ÖÌí™YüJ…Gfg9}ş<76©7k^^a%IXïn²ÑíVjdYŠ_­ñ¿ıì/Ò¨EüÍûQÖÏ>‡#sıÜY–ï¸›\åxaÄıå¿ÈïşÆoóÈw³AÈ[§Ns[{7ú.—ÕJ;#ÅÜ}÷½|ì}7ıx@àzøUŸdgˆÎS{q -ææ×ìFÓù¾‹Ra¥Âh0b´İÁ’ÍÍ-æç‡$Î©VBòÔî-•Z¥5Yš)êÑ¸‰Õ@ëÒ4‚Ñ`Àöö6R„g³1]Ï!waÿİÇi?À…+9sá<Kó+ìÃãÚ8e(l“’ï†Œû‹Ãi¬xdÂ°ÓëàSa&ª‘nõxês_¢êGx¹a4ê#«!Õfƒç^x?òÿîÂ,ó›Ìø!A6ŠIó/rp|ß~'8€JÇ²ĞhÓ¨DT\Ÿ lôt¨xƒl€ô’<!ò\–›´ÛmÚíEp<’ÌáÒÚï{ï‡plíl3õ¹cß¶vvè$}®œ¹ÆöÕ5Ü(à|»Eµ^aeÿ>z››|óéé®oqàøQb)È”AjÇVÑe®’(•àT|âDá(‹æãJxìaPöÂ—ç9÷<úîyÇ;øá?ÿçøÿãßæéS/!\]î1åaøo÷fÄMÛÉõkëøÑuV:‚Ùeb•“fšz¥ÅñÛîåî{#Ë²‰ÖWÜ¢s.‡§2;·”ˆ••.¢}¤”…Ü: €r²u:¶ƒ±cØZ¿ÁÎõë\8w–ëW.saí¢ ÒæFæqŒïy$©B;/
q¤bfi•w¾ÿÃ7@JQ’áªœÌ“ŒtFĞ¬²}u›±†^JX©“¥ ú™•û8Ö¨Ø™!Ë2úı>¹RhcY¢4ËpœB¿(¥=tN&ÒŸ(
p]SœíF’8Ã8i·Û\¹²†1†™V›$K0Æ0éG,Î/b¬¯¯³ººÊ "\ºÕ"GN˜H×uI’„º©B‘M8XßÜ ,XuôàÒ4{¡CF£[›Ä£>ëk—ÙŞZŸ<¯ÄØM8±æ·Şïìì°µµÅÒÒãĞl6©V«Ö9©5~à—ååe»ÎTNœŒ	‚Àº¿ŠƒõìÙ³c
Ûó·,ßª×ÓzWçWk¥®o:fzœvõ”Ş­y€Óƒ[9Lo®·FÅ”Cä­›şp8œĞ~å9xãÆ._¾Ììì,G¥Z­’$	q£µ](Óô<Ï'
XJ-\ÇaœY=Q¬2ĞŠarøîÛÈëmÎ´©V«¬]¹Ä÷}ô;øïûn}ğ^ş×ñÓü‡/=Éác'YÛê33×¦·™ğşÜŸçKO~š×NŸæÄíw°¶¾É]<Àæµuö;ÉïüîïQŸŸcïŞÃÜ;¿Ì£O<ˆñnl\Ã´#@
ò4ÇöÅ-ğÇ|ó«_góôE<á`Ò¡¦Ş1xa@F„¨QB’fÅPª1•zÈV“J¥†ŠÑ¸‹Êmƒ‰”ÒZÕSÔi´¡@õŠµí®§Z­Fš+ƒ²Ø¬’$%¬VĞY>	3ƒ<Ãh4¢ÓéĞ¨Õ¬3J:øa0ôÊ‹„/í‹±¼ÀT*•‰+¬ÓéP¯×o’&$I‚vİA@T‰3šk‹>'Åæ’ç9'Ù-„â&““WZMÖ69ß^vs-İ$ÁMÆèXpçâ¶’„7®]ÇkÏà×#S9R'ÀÂ¢Ø÷ó„ıöòâ+/pêÔ«<øÀı|×w}œŸø_~’ûo™O}õs¬<@mu‰q]²8·È«ÿáËôÏ]¡êH”4…sò8!”ï¸ï>nlîàC.®_euu•™Ù&ë²µ³Í[—.C3Ôg–H{cz£!Æ‘S…qàıóŸ&FğşÊŸçêÙ4\ÉpkÓ¹FĞš¡7îóğòÁ~ŞM~ø#ßÍÛs/ ¥dcÔa+!«æ˜›_äS_ù
úÇÿ*óV‹­R0C†ƒn![±S‹ÍU³°æ?ªÑÊ•š—Øç-k¾ñ¥¯réÊUîº'¤‘Õ˜i7­9ŠdĞïáHë¬,õ¥·à:“5!)<0ınÏæ¦	F+D%àà}wÒZİÃõ¸693"`ğú›|æç~‰‡şÄÇÈ–›$ã_ºˆXUCr	™ÑŒtJÔ®÷zì[XákÿæWĞÛ]ÚíYáz>C­hÎÏòê«¯òƒóœ|äœ=ÿ[–ğ#ú2E®¥¦†)‘”ø “‚vk=KK 5&ËQIŒH\Àèœá¨O£R­ÕXY\`ya™d”¸’^È›oïpüğIL¬Éâ˜¦v¹÷Äİ¼õÖy.5—št‡C^>õûæµ³gè¬]£c“µ7ÎqêùWˆGŞxû2±ÉiÖêÌ†5jÄSLhZG[	‰”o_¿Lëè~ß{~‡J-BéŒõkk¨qÂòÁƒd2ÛíƒÅğgvg0§H!øOAøşŸÖØ}\t'ßüÃ‚‚Œ“‘´_§ô#ëÎN›#e+ûï[ÎK­5In‡i$cA‘$“$Iqy)\´¾/ÚÁh›«siÍÅO´p”ÛİË½‡Áöoƒ­mâxDµ=‹ÎÕ(ÀqCÂj?
	}ÁŞ•iÆõ®Æ%A½N¥°÷Ğ!nìlA»n/N€[ó¡ç.Â­cTLEx¸•İBˆ(Š¨ûıh4š”U€ş¶3F	ÔaSN²,#Šü‰ÍÖãJ²L±´´ÄÖÖ76ÖY^\Â¨­k t%õf‹n·Ïå«kìÙ·‡Ş°G¥^ÅÓuö\û»ô\*•ŠÍµ×‘´ÛzÛë\¿¶N­^af~f³	Fp}İJŠñxˆÎ3ÚÏ•K¸~-Å+¢ô”2ø®e",…í Œ@®¿ûI’°¶¶fƒT«<„ËKƒ±'¦¸eY–…!KKË(¥¸¶vİÖê=Êöö6Q!=ûIw4›²]şğµV»¹€ï.<=¸M£wÓCİ­NàrŠÎü™ÖN#zÓ…Ï%X~Y–M*ã¦QÃòğ.¿«W¯²°°Àüüü…,?V9¤–·¨²y¤rE^ «Yb—jD’¥öw•[—”ïR«WyùÙg¹ğÒóTIø±ú~j&e4îò±ïúÊsxê™§‰GC>ò¡râğ!Ş|ãuŞ÷ï¢?RiÔp=Œ`õĞQ†YNÔnóÑïşã<~œ½‡’ Øt‘aˆôÒÜ
å±>eRRõF._şÜç˜óÒÃà	—F­”QP!ÏrB7 ãU*h“3NÇ´Úu÷,6ªDÕˆTå„A@2¡•¢×í‘fÂsí-ÑP”¡c]˜EºB’dP–|öú8Iq{£‹Ód20eYFÇ¤I:éjÔJ‘+…Säü•¦&¯?û®7y†RJÆñ˜Œ1$Ğó¬ş#IÒbÃØ]ëÂ±9]ÖÕ^Æ ìR–Z,PeÊ›"·²¨ƒ2ÆØ®ÔâÂà–ùƒ€çh«‰*È\1Ûš¡Õáúæ:HI^¸ú„°¢c£®´š6¥aÍg8îßœ·.¾ÍëëìYZá]ï~{VÙÚÜ"“†öÊ"Y–rö™çQã×•Œ³˜F Cn?t˜F¥Âh0äîã…—_Bºk×®1˜Ÿm³<?OäJQÈ¸×E§†½K+ÄiÆ(K1KEà¸|ñÉ§ØØŞáÿ0ºz•, %Tpe€‹Ë;xˆ·^?Ç¥ÓgÙ¿´—#‡Óœãîï§Öj²9ğõW_áÿó÷~œ;ÿ»÷‘ØøH:ëWxå©¯1Û¨âEèÈ¶—QôĞŞzŠßzX;„W¸Ğ.’ßıİßçË_şJIâ”Å…yŒRú}ªµ*8fi‡ÆVi	„kFh¤qÈµÄqCşÏŸıE.on }‰ß®sâ“D-zİÚh«¯hÕjx•­q—•;n#'8ÊÖZA„†q \áÁ¼0>}‘/ÿ‹Ÿç`c™¹«ÃØä´ÛslÅ#î{×ãÌïYæéÿ)Ã*Q.È“˜ÌEnc”¡íù´¢ˆf³ÁB¥Š`°µA>!TF-}—Q@­°wi™ƒ{÷0Óh’öÇD2€TsöµÓ<üÀ£D@„ ú¨aG§Ì6«z[Ì5[,ÏÎ±ga‘Q¯Ïßû¬ì£Võz4|Oøltzô“„AœÑí÷m“Uâ†Ê—ŒÒáILàóvg“ş™ïã®w>L¯×%
„°¹´íÙ9^|ùşæßù;6}¡t=›	|[ô¯İÿ

ø?e S£Á6­ØÊ8¦”K½>Ãüò>j³dÂ!¨ÖP¹`ĞÏñ*u²r-p½Gd
4Ï¯`¤Onrã`Ï¢q~„p„ ´ƒtCü°‚ÂÆq)ã`„Äó«8~ÄhœÒíSÂz‹™Å½¬?É±»î£1¿Ÿ£·İAcv™Ö}´÷"¢~¥A’Á 3(·Æ8Q R"_"³!3Y‡Ç/²yc7¨°–¼¶ehî;N·×EÊ2òHÓŒñ8Æó|*•ê$‹XkS€1š\åÅ¯ÑE»“kÉ7°™€AkE–åHéFn55Û,ÆfÃæş	WÒïÚò…z£Á7˜[˜³†Xã‘•\)|Ïe8ì3hÖëHá‚Î¹pñ-*Õá¸øAD£ÑäõÓ¯³±µ‰ç94k5öí]fyiAo›S§^£Z©àºv_ÑZã:®ä´Àu=›Â²|ğä'JÔcaa¡@0FÃ"Wåd .Jç‡CÒ$ÆK®tù¦IÆÒÒ•J…²,£Ş¬O&N!Ä¤
®ˆ¬áCŞTçæ8bò0¦7Ü[ÃœK±ØJä¯‰.¶é>àé^àiSHù~ÎTé}‰J–14ÓCh¹Œ1ŒÇcöíÛ7nËîx<¾éVUêËÏ§µÆwŠF)ğ|ßªqŒSÀã©Êq‡âÕ§¿ÆGŞõ(Ku?ı=Gê„¨ê±ÑÛâCıí…>óé/òğıwñÄ#‘Æ#ê3ušs-ëPtmeÕ(ÍÀó¸íî{ØôÉ(ÇĞôğÃ é»FC*aD’Æ¶>+2v…€,ÅÅÇ)ëW×miáû™6/`œfÄY†çE›‡C¦2<ßeva–#'Ñl7¨·Û„Õˆ¨Ñ¬ÖXœ™§İlÚ°cÏe4¶ı®“!p·$`‚’aH¯Û'Nª•ªíuÎ2Œ„•§¬ıÂ $ğı‰ƒ]é÷¹ÊId®¼ü¸®‹Qz²6M‘â8Õj•0'ºSûËNß  ‚Õÿ%1q“”¡æS—”r …ónº	Çšõäì`o³t'úUYñÈ²‡(ğé†4fÚD3MŞ¸x_xxëè+Ö¢2ÆRûZ‘«˜ÜhÍ&ôq=—«k×yù¥ÉsÅûßón®ìåÒùl¬¯3ÚÜaóü%B/ #ÈrL’qâà!Úmvvvèö{8®C«=Ëx<¤×ëpåÒ%šµË‹‹¨4eÏÒÕJë¸~À(MPFb¤ë!=§‰şÆû£gØÛA»‚µJ“Z{æyôİïañÀ>n$C^½q…¸òåWŸg=ãXä»şÂqô=aØùÅŸùiúÌ§¹sß*só3¸(\4B)&.„06ÛRü?vÚü9­ã"]ŸÅ¥e{áE®^]£İnÑn·HÓßs©ÖªŒÆ#éû€}ºĞõ	LQÍe‚YªpãDüóŸùy¶Ç1ÍÕ}4WˆæëÇ	‘v0ã!÷Æ"ñc2æ÷¯úÕXJ8·¦’\%Ôêz0âˆßâ3?ısèë;4¥PV:‘ H„¦Ñh‘fšö¾=¼ãïæ³ŸıæF‡Å È¬¤*'p${-ÚAD %QâÄ¡'©Z…x4ÂhçHâQÌ½{¸íèq†;]dfpÄÓ’+o_æ£·ãÄc*BÓ]z;7¨Ô|¼Š 1_g»¿AÓ«“¥)sólmnqmm÷¼ë]T£ãGrìÈ!8ÁüÌKíEt’1ì÷ÉUFo<`[Å(Ï!!Çø>[ÃÕ…9~ôïş-tà¢’˜<ÍÉ8QiÖùä¯ÿ:ŸşìgíÅŞq¾ıPVüşŸ2 ~»Aï?ıÛ "‹QIB#´O¥Öbqï!ÚK{é')©ÒåùjÕ£rĞO:¸E6¯0İô	ˆÂègò¡.à9Ñ¸€tFeÙ+ÖHG¦Cûq<¿høñ&9ıD±3ˆéŒŒôèÆ2E†KªÀà*E.=Ü°N®rc[¦œÑˆ¥lÀ»/såÂÛTês¼y½Ç
ŞÌ,İ4#-:ãlÀõíÀ®ñ 
É•"O3[W8€]W"å®”,£ÉyŸÄ	`lÎ ë†Õ
FAÏˆ¢ÁpÄx<¦İj"¤Kš$ $Q¥Š„¬ol°0?6ß³u»®çÏ÷È³„~·K£^#ªTÙÙÙ¦ÓÙ±Œ\±¿ıö%fgç8°?ÕjD­"É¹¶v™‹ß"Ë«w%NhÏu'¦t)¥ ÷»ëI’$ê-¾KKK(¥è†“8—Z­>qÉXíŸdĞï³µµ1à{İn—ë×¯S«ÕØÙÙav~ÖN›¥fÆ³·©rXËól’Ä½«ñs&y€%B7MÙŞj
ùv~e]×­ˆß­:¾’‚)?v‰ö”Q3¥ŞaZ8İ'üÂ/ „`uuu]2ME—¿—pùş%-,¤$Ës¢JD®Iš ÄILØÉVÒ¹z	§¿ÃßúÑfe¶ÆmÇVÙØ¸ğn¥Êõ~ôQXáÉ/||ôÃdé¹xQHn`4S«6PÆP©Û\½°ZAHˆÓ1®ïây.*×øÒ%ÏS[ö.l_çJ„¶Ujã°wi‘µËk¤YZ‡4ış€Ä"”dÚkEœ¹ó»8rüıAŸÑxÈÆæ6¹ÖaHwg›ªâ9’J£A"nßjş„@1	œ8É…CR´ÏøA`­íEíÎ¥K—GÖ%Zô÷mEé¥t cõã8f4cŒ±¦§b=IáL^®ëU*DQ4	Óœ¡¬,şLƒçÛ T[§'ñG¥ìÀ•»ßË.ØTÈ%˜
3/èHY ‹ı¤¤Å\b5ºÍ¹Y¶Ó/œ}ƒùı+& MR»®
3–ºpjÚÏÖjÏ²İéa 7ğÇ¤YÊ™³o°vå
ßÿ¼ëFİ>/|í›$>‘EèE˜\QBöï[ann†¹ù9¾ùü3TkUxçãôû=¤†C^zå’<c~q©¨ğƒ¥åeéx››ö¦ªm’^yõ6·7øø÷|7q’sîì[üú'tSi5	›fìåğC÷qèÁ»Y¾ë8ÇŞqşÓ‚»ßûs‡ö1ÎS~íßÿ&ÿÓÿ÷ïRwá¯şĞŸåàÁUP1R+$JS¢8Æ Uj³?ä­ªEAÛ3++¤£˜³çÏÑn×pÍÑ#‡¨ÔªÄ£íêÎ4Û˜b ´]{ÙÒEÖšJRjõ6;C~öW>	33Ì=€3ÛàRw!}jndÛV¤C7I¥¡Ú®³Ñİ¦ÔY\X 3‚ÌqPÒ!ğ}HS`¥ÁéO‘7>ó–«´¶&†Ü…ÌuÈ1¶Kvœá·êÜ÷á÷råÊ%Î}õ›¬6f1Éf4à3Q'ÏHF#’qBÅõQYf«³ŒÑ`H³Ñdÿ¾¬®dßÒ;[;ÌÏÎ¡´Û³¼yş-fç—¨7š4B)­Û<¬ø8 ¨GtÇ}æ÷.1Ø2¿´„„<r„Ím{áî¾ûn²$A	Ø·g/'á“·sdu•ÃĞhÖéú\Ş¼Æp4d0I¢ø~˜|ô#\¿¾F-ˆ¤G:N0ÚPk·ùŸâ'xãÌêõVâN]ÌÍC ÿ…àÖ X¦ P°°; I½9ËŞƒÇhÌ.Ó-Ìq²0Ù	“"PPô¸;Âà¹LNp%x®À÷09Y£òtò÷)&Å¨£¬©K ÈâéxD£Z“`à‘+»ÖsáàE5Ü B+ÛÿV"´1(!‘Ò#ObªQC’¦Gè[)qÌª§¹{¾Â°³Å`¬™_^åÕÓ¯Ò\œe$\¼zİë¬s]ÏóI³mÀ÷Û„¢lN­™b¥t' +=Œ))ÒÄ²&aXdzEäÎ€(¬ìO­ZeĞï“fö\÷ü m4qbK:âxÌÜìÚìÎ"ƒtT²½µEè{´Zmºİ.ÛİÒóHÔñğ¡CÌ´gì3ğ=tsñ­óœ;{–$±¸°`Ï'io!V{îl¬E‰ ÷¹ãı~Ÿ^¯7I»v]—Z­f'à¨b]¦Y†Ê5I3ÉÒÄF[>‹‹KEmJH¥RÁ÷ıICˆã–áŠ–Bu¥WĞÀj
åûÖ@[µus4Ëô¯R/§ê¹¦u€ÓÅÏå[9tNÿw‰ÈİªÇ˜dÁMdypOLRÒn·©Õj]D©9˜şú¦¿örÀÌ²Œ8¶5a´á¥hE…ˆÂŠ2èAg¿ğYşæ_üA¿ï6ægkh“Q©Uğ£¹¸a•­N—;Nœdue™j$	+>"ôè†×†)+­1JOrò2•!š ödiF½R%KÆH§ĞB)ëFUiŒJbTšP‰"<ípıÚš­M+†)ß÷1$NS\¿Š,Òâ“,¥Z¯>İ~Ï÷ gªl2INg«Cg4°®Ó±m†È”"WeãÀîÛh4f4‰,ª2p¤µàomî©Ô:Nƒu»Sm…%a;²,›¬acŒ¥s¦4yYÇñM&¤’2öı`R‡h{"c”Î'ÈŸpÄnÖd€»9™¦$‹õïØ(Qnó¥Tbêıs­ZÚ‹›[¯ñâ›gIª>²U'”C¦5¹cĞÚìJ)i’30¼ @CTjÒ,emí¯½ü
ñhÌ;ßû^Ş÷î÷‘îŒxóü›ã’*M%Œû´ê9ÌÆö>öë7¸~í÷?p/µZÕ6ŒT"Î¾u‘_{úì+ûöĞt	‚V­ÎêÒ^ffÙÚØ°(‚€AšğüéS¼ğÚ)î»÷An;v’å=+|ş‹Ÿã÷ÿwøô§?…y¬ÚO¥Q©U™[Y@‘óÜËÏğ3?óòÓÿüe¸³Îß÷ğÃêO@:D'}{dj5Qa€«í³0¶ÁàÕ f™5äx>âò<‰9vü‡bĞßæÁîgf¶EÛ†ëYÙÀp4²2JYY›V†(kÕZ‹¯<õ¿ü;¿OãÀ~Äâ,‹·Æm1Ršá€šÌdY“)ê•ˆa:‚VfìÆÒÁ¯VlKšRÉ5îŸú©Ÿ¥²$FDıdlòÄA …‹—Çá¶>NP‰xå÷¾@-3Ô=›;â°ÔjSB\éR­Ô=ÏñŠÈß÷Š¼Ø&ıQÌh”°İÛWÒcÂf“k;;Ì,-Óœ_$‚$S››Áñ\®mlP­7ğƒ
®R¯¶ÙØÚÁH¯Z%UŠÕCFôú=¬vX)’ñGhfÛ>À¡«;tˆ#x>£Ş­ÍMÆIÂ#O<ÆL»…ƒ!ğ$N®ÑiF£ÕâÍ·Şâş‰Ÿ`Ğ%iax)†®['3ñ_6ğıçhÿ¦Më—Å9£,¬5AÔ`ßê	Z+dÂ2M¾ç‚¶}äaåe³1š,³IeëÊ‚µ…G	­r²,±îgÂ¡ˆı±¡ÒŠ$ÏÒ³{·ãÙLQ×!Mâ"¾¦hÍ)\¸ÂTšàmkõÒWZÚ51‚Èh¨.‡ºÛ%Í%‘É”W.P_9Ä Šã }rÎÛ=zW/¥$ô}ÛTÄ·8NÙ)o&aÏP²Šöõ•«|âìW¤,t|~€Ö6»Ñl²½µE®L¡=l¿¼cS.]ºD…¤™"Ó6:ÍTl
Àöú†UÓ†N·CZ0GûWW9tèB[€ Ëcº;›¼öêËÜ¸~•ùù!èz¸•	9EKºlÛ*ô¢–Îs‹PÔj5¢(š=QÙÛ‚”õeƒlóÜfy‹#l­ít4Ü¸qÃÒÁEÆ^œÆDQ¥àÎ)Ğ¿]‘¥]X»À´Ô­ø–ánZ£W~Œéa¯übª¶kZ7xëÁMº½é±<ÜËaqº2®ü÷z½>A„Ò4h•²7[íO¾ÿ²hÛ¤§û4ZM’x\hÁ“.ÃöÖ&×Ô]‡+§^æïüØŸGªY>$×™-¾Osd!}ë¶ö„Ã‘ƒ«ôû;8Ò0ÊsZí6Y1èJ@âàÈ"rD(ß#NG ì€î9’d<Ä“ 2e)Hci<âÚ4½ˆ·ßº€P54¹!Ïëâ İ8!NR‚ŠO«Õ`mméKY¿±ÉA>½A[zg4âzgm4y¦zVk‡¢=ÆÛµzÁ`Dœ$øE.[šX³Mù4¢(*tuv -uœªxay¾Íhêv»xÍìSJ¡suıïzîDPê§İë£ÑˆáĞvGm‘\STJ·Ğ›—×u1…¶X¥ŒÈ®EÇêX&’‡2×²”1 pf¥è$1¯®]¤¶²D×¤è±!¨Wˆ52¥h­ğë¢°†ÆIZ´[@œŒÉóÇ“HÇ¥ßéñÆ›çêœƒ«ù'ŞÃ‰Õ£¼öÊ)Éi`íÚî½÷n*QÀå%>şñ?Â«W8uú5®İ¸Á(Mç9{÷¯²ŞÙáÕsoĞÙŞdvnv½‰'TšÒ¨×X^^"Bôhˆö]Æ:ç7/òéßûé`ÄãO<Î>òA¿ï.¾ü…Ïó?ÿs|ê·~‹g¾ş&MøõOş*çïş8¿ø¯ÿußçüí¿É|ïwqpy‘íõ«øöòÉrœ"ì±[ChCÍmGéöæ9­2ÔáØaÎ^˜cöíßÏí·GE¥ø®¼Jóœ<WTÄMƒ2¥hÌ©+£Ğh\#¨Ögøì¾Ê~–¥ÛNÒqáĞıw°tô K‡Í´È|É I	rMS9øBb<Iç¾í6bO2À ‚€áN‡š,7š<ùÉß¤{ê-Ü
ÆdÀHô=ÆFá;¶»ÔÙ¸ã¼Ù¹^û½Ï3¾|™ĞC¤³a•åö,iÚ×» 9T©U¨D›aã8e8ˆ™Ÿ_`vï"£4e³ß#G°3r}§CÔjÑ‹rihÍÍ3NÉìÌ:5„n„Iak4@x6nC†ZÀ¡£GxûÒ%²<ãØ¡c€AÁ8v_wŒaßò
Çá®·ñÈC°¸¼D’gllmòÂ‹/¢ÓG:,ÎÎâ‡¨Zå³_ü"ÿæW~Å†î—ÜØ6 1=ş¿ıòí@Æmå$L@Wº¸^•ı‡ngqïaıQ!•ÀE›"¿°è6Ï•b0'	(
ö’Å²<·Ã„”ÅşYô!IWú„•ZÚšR?¨âú>R
ÛS.òlLkªQ@ÅEkŠ-ólU"T<&§T+
%4ÊhÔìœ‰y9bFh1àÄEúyÊ«W:,ì=NÖï3*J.¦Y¸i@§†ŒÇ#ò"Öó\Œa’¡rUPê>iše9FÓÒÚÂEimÄÆ6a0è³°8O·Û+L2~°µ¹E³Ù ı~¿RÔŠºRúlC¿ÛÅs%ãQL¦,Sxğğ!ªÕª-OJÎ½ñ:çÎÅ•‚ÙÙƒ>Je“~tÏ—8¢ğ^d%‹iµ€B&ñxÌææ&I’LĞ©ÙYÛ$§¹…fó?ğ&È,-.sùòÆƒ!£ñˆ¹ù9*EõÉ8q=ŸV«5xÊv)]¤´Ñ"ªĞ–nÊÑf7³¯Lw‘CKÕ•jº®Œp)-ìÓÔí4İ[RÀ¥°Ô‰•®ßòã•CeIÛ–Ã\‰–ƒrèœv)—Ãå´ã¹ ¬É âá,3h%p¥Óô{Äñ˜;İÉKßü2'Ïóıßõaº××©ûu|X@XCá \¯¢¥"Î†E—®­ıñÂQškEä‡ˆ,Ã]†jŒÖ%)¾«¡s|G â“j; d
iài”Æu¬×K§_;ƒƒC–dø®¨L†²4AM·7`0Š‰vº}2ehÖ[hã ’‘kT±‚íqÌÕk6Snk„ÁÖ+IY˜*”!×éÚaÏšu,b†)šŒÕ´Lç=¥ñ}áØÍËõ\r­ñßsfgfñ\T¢m´í¾”Î$N¦\?Ó…q3Šc”ÖøQDT­DõF•0Œìš¶k[ÏdÖ0H°úcoã°Q7º0eåRû½J«1ÂÁ3‚ª[Á«TyúÜüı{Èê™+	|I.5Û½-–—pµaÔÇâø!`ˆ<ßÄÃ>Ò•¸¾G¦4Æ1øõZ8œ=u†‹çŞ¦97Ïí÷ÜÍãï~½~—‹o¿”>¹6œ}óÇNe~a†Åå}ôA–Wæ¹íö£Üuïm9v„í´˜™]æÔ¥³¼vî¡vXe¾>Ï°;f§Ó£×éàÔ"Òa†N4u¿Aw8æÉgŸå×~ç·xşÅ9qçİüÉïú>~äOı9î¿í..¾ußü‡Iû|äıïäŸüÃç¾ç£,4C†WÉ{›T¥ƒ«2/‚¬¥c`•cĞHaƒ=4-ò‚’7ÖœƒA˜İÃ^ûÂ6ß¦	#F“[­ñú[øÇÿä'y×{ß‹c*O¬VÊäHß'NSğm³„é	RbbS	«¨¾Âd6ÚüÔ/ü"ç®^gaß^z*aåîãìÈ‘K*wÂß»À½ûsíÔ†:'—.áPĞIR¼Fæê
iè‘¨Óïq[kóO=Ç«¿ò;´ª5rlÇ1
¤ëÑ‰Çø•gÙ¨ĞÉÆÜóÀÔ®rùú®ıZn‹z°:Û$‹{ŒM‚¨‡P„è6|Çä2©#0‘O8„sZ{ö2·°ÈâÂ2ßùññğßÇ—_~_úßàû~ğ¹¶~OıŞ§ISH„d#N!ª°0³ÈBµÅÌâ"o^¾DmaåØ*D•e,.-òÖÚÆñˆÙù92­A@œfH)‰*²<CÇQ‚ÑT|Ÿ•åeæyû­|ãÉ¯réõ×é\Û$tBjÍ9şò_ûë\½±”&Ï'†!J½ß¥éã?78ZkEx6\ÙŠÉì>â|¡Q™bavûVo'l/’ú.ı$&r#¤òÈt>a%Jwk¥´¶¨”ÖVƒ]æ&ÑiÆØê?mğƒˆñ8%K­®M)ƒëùxÒCh[h”E÷²$)¨N…Î´ÊmA„ exY:Æ
¥r2íx!"éz9›ã„CI6Pg„Èûœ¸ÿAh-òô3Ï°ÒªD”ÎnHXmĞéY†ÈÁ€ÉHâ‘•ĞHkà½¤õº½±sŠ¾`Cš¦…>Üa8R«VíY¡ml~±qHÓÇ±u‘í™Yº.ÃÑÀJ‘Bß¦[ÃÎÎQT%ˆlo†„HãaŒ¦Ú®3™™Ybanñ(Åw}N½şÃ^‡J%Â÷}r¥‘¥7BåV£)¤¯Fà¹V]8·Ó<GÎï;ú‰4MÇH)	‚€jµJ¥Ra<ãûí<-Ê¼Ë ecëë(¥HÓ”v»M£Ñ˜”GQD·ÛeqiÑÖšLµrXÄÏjŸ’d\tßYÄ%I¬ĞÒNêâ¦àÒy[ş{y[Ÿ¦§ÓºÁ[#i&¹pßÆ]|+İ[IÊ¯ü|Öù™L>~‰şİjíŞ¤O,ÑÀ	­X˜klv\Z×u ^­ñäg—Gï8Êw¾ó1†ã!‰Îñªç9à!F£WRu=f÷¬÷‡Ì¶Ú\_ß¤Z¯ù!ÃyšMÇ1ä™ÕÅ	@ç9*O‘ÒFıXTN©£RÛ£s¤4$ı˜‹o_²îRa«n”Ò¶+Ùhü¨b¸R§9;İ[ñ8e”$ °_ßc³ÓAx>/¼ü*)XXX¡Z©¢òœÑhdíìA B’eéäy”´|é¸S	ïÒ‘}İ4ú[Ò¸Ó¨¬Õwì^(|ßÿ–¦™i¹L”·ıÁ¡5‡D•â¹Ûõ¦™u¿LQ.Ğªˆ(¨yÛ¹kP¥Ä¡@ü&¦%ÇAáÂÒµ]àúdFóöÖ:[*Á™i‘
An®²´/Ò¡ÛïÓ¨V™oÍQ‘>İmFÉv«E¥0TUúƒB:8Ò¢£á˜Àõı€«kW¹ğæ›(£˜_˜ç±'Ş‰ïúœ}ãZçdiÂ¹7Şà}x¾ãA®]y‹…ùYö­ìaq~–#GñècO ’N¿Ñdsk‡7®pcsá¬¬ìeinOå†}|Ïc{Øe¨‚Z…Äätz=Î]¸È¯~ò×xõÔiZ33Ü÷àı¼ÿ»>ÎŸşßÃ‡Şÿ¼ï^Û›d£!•0°4«cCK*k²&ÊØ³»w×®i[&g‘b'³†ªñjcÊc#ğ«RáñôÇøøÇÿ(wÜv;&Ïq´ñ
t<ÉĞHÇ^(ÇÉ­s*QH2ŒAjõë½>ÿäÿøiRÏ§µ¼LOæÔ÷-¢"—¶rugƒZQOÏõkÌØËï{'^³ÊVÓX=~ŒŞxRP5†òÉúS£ŒPz6¦EÙÁ×÷}ë'_H„1øÕ¡ÎY½÷NöŞ{‘¦¼ğ»_äxq\,6kôò³²J%Ôƒ*~
Ú“h:Ó´kM\-¨ûUÒaBEøÌ-ÌáÁ¨ÓÃó}>Èã¿“×^z•w<øN<Î×Ÿüµ ÂÕµ5íUbrúìÖ;[´›m:Ã‹{Wh¶š„¾m
ÂÕƒxö™g©5ê4Z-ÆIL­^³QNBĞíõH’”Ó¯Ÿ¦×ïãú'n;ÉÒò2õz»îº‹KgÏsö³¼yá"ÿæ×ş_}ñ9´ç’gÊæEN—ışW"ÿ%o”di†ë{he¥DAè‘%{
	"name": "shell-quote",
	"description": "quote and parse shell commands",
	"version": "1.8.1",
	"author": {
		"name": "James Halliday",
		"email": "mail@substack.net",
		"url": "http://substack.net"
	},
	"funding": {
		"url": "https://github.com/sponsors/ljharb"
	},
	"bugs": "https://github.com/ljharb/shell-quote/issues",
	"devDependencies": {
		"@ljharb/eslint-config": "^21.0.1",
		"aud": "^2.0.2",
		"auto-changelog": "^2.4.0",
		"eslint": "=8.8.0",
		"evalmd": "^0.0.19",
		"in-publish": "^2.0.1",
		"npmignore": "^0.3.0",
		"nyc": "^10.3.2",
		"safe-publish-latest": "^2.0.0",
		"tape": "^5.6.3"
	},
	"homepage": "https://github.com/ljharb/shell-quote",
	"keywords": [
		"command",
		"parse",
		"quote",
		"shell"
	],
	"license": "MIT",
	"main": "index.js",
	"repository": {
		"type": "git",
		"url": "http://github.com/ljharb/shell-quote.git"
	},
	"scripts": {
		"prepack": "npmignore --auto --commentLines=autogenerated",
		"prepublish": "not-in-publish || npm run prepublishOnly",
		"prepublishOnly": "safe-publish-latest",
		"prelint": "evalmd README.md",
		"lint": "eslint --ext=js,mjs .",
		"pretest": "npm run lint",
		"tests-only": "nyc tape 'test/**/*.js'",
		"test": "npm run tests-only",
		"posttest": "aud --production",
		"version": "auto-changelog && git add CHANGELOG.md",
		"postversion": "auto-changelog && git add CHANGELOG.md && git commit --no-edit --amend && git tag -f \"v$(node -e \"console.log(require('./package.json').version)\")\""
	},
	"auto-changelog": {
		"output": "CHANGELOG.md",
		"template": "keepachangelog",
		"unreleased": false,
		"commitLimit": false,
		"backfillLimit": false,
		"hideCredit": true,
		"startingVersion": "1.7.4"
	},
	"publishConfig": {
		"ignore": [
			".github/workflows"
		]
	}
}
                                                                                                                                                                                                                                                                                                             F<`)ZË³\Û^'3
éJª•OHŒ²—©‰6ò ğÑ*cíÚU^}õuÚí6³s³|çw~'Q¥Ê™7ÎĞôùÌ¿ÈÁ¸÷ûÈò„<‹©Õt‡#~è/ü(gÎç>ş]<üà=|ñ+ŸCz’X¥ŒUÊÚÖ:—¶®ò‡ßC5ô˜¯W8¾4Çíûöğà±ã<~Ï=|ï‡?Â=œà‡¸ããÔë®£yù¹g¹ôæ9z[Û8ZQ¯Yª&M,Íïz¶üİ8)vâr ,İ×bJWe–%¸ûÏÓ_šápD­İÆñ­¤ Z­ğ³ÿò_ò#?üCÌ7CŒJ«òª5k€Š*Œb›ı©”FƒtlX÷x8"Œªtú}Úûø7ÿî×yúÕWY9~ŒÎ{†æ¾E%¢?BÔCj~ÄÛ/¼ÊÎõuæÂYj3
%*3-úé“åì	j\}úEú¹_æÀì¢5Xå¹5o…!ªè½v„@(CìB·èlÆ ƒ€»x¨$ãOCQ|g›å¥9ÒŞ€±Îq"Oâ 4Šv»…R®+ITFP¯Ó‡ÌTkŒ¶Ï9Í3Ús³ÇáÀáƒ¼ué""ğ©†ªÏÇNRªtv¶¹û»©Ö«´£µzk7®¡•æòåK<÷üó|íOqumÇs9tøQµBkf†¯|í«ìİ¿cÇ±ou?~%"IS¤gã:ùæ79xğ ÷­rãÚuºë[¬,ïC	‡ıÇñÍS/“d)ÒnÒˆÿ¿… şÇ@­5²È*•B ŒÍç|-$JWx÷?NĞ\b{#—$#”MSĞEvy–aö“ó«8Û!&Òû)$ß¦L¡<ÇK†¥dY´ÖDÃR~¾2“Ïf[*Öƒ#ŒFg/ÈÂA:£QŒÁaqÏ~Dª¸ğæ%î¿÷~6·¶pHÆcÖ7úH·ÎÃÇçyä¶Ã¤ı¹Rtc„ï“d#¥}ı•é'¾t\Ò$Ã«NÓ„0Œl.ÛQ,em%fLKYäkôÄ«`ô®-Ü>1£Ñ˜ ´™„ÃÕkW™mÏÚáƒÄĞít­f±R¡ÕjQQC§¹ğæl\¿ÎL»EœôPÊj1ƒ Ä|DiºĞ§JÇÅÁ™<¯r¶‘{İö‰r-ë`fggi6›ŒÇcKQš<¥-%6Aê¤œ8bJ
´Ùl²¸¸Èììì.ÖÃYdEO
•m
÷î¢±l>I§5zÓÃ\ùß·ÒÀÓf‘]ã‰øC5Ó0õ­tğ4ª¸›¾û5”%ÓÓ”ï´Q¤üó[ëêJ:¸…¨\‘$Z—í%Œ*œº†õsgø~ˆÙ™
#’	CÅó©»ãñÏ~‰Ó_sKÊĞªÖp…d<Ñİéreí*Ï~ãiüÌçùúSOñ÷¾‹ÚìÛ*¦G2ìà’!²'Ëñ…ƒŠ3„äù¡5*MĞy“ÇV4+†¹äëO=E£Ñb<Jì‹Y+fçgh¶›äÉ•§ :ÏIÇ#T‰ºG´g¨µ4gg¨·ZŒãŒç^xc‡2Ón¢s]¬ƒ”$[9‚ëc„¥š½â¶X>£éµPîÉãØ²sa7,±4H–á±*aNĞ¼iíè·»¥—Ï¹D¶Ë5¨Š×PRP¾éÖ“çº»¾
¾ĞiØç­‹
2;êÂqç:î$?³Dj¬¤·Ÿû>;*áµëWaa9Ób”)KÅk•ÁÁÇ4Â !%×ú[ŒÁyN<zûbae‰ë7®ÑÛé2Óh1èôñ¤W8Ó,b:ÉN”µZ• ôÙÙîñÒK/1XŞ³‡‡y˜™¹yzı.]áSŸù—×®ñî÷¾—å={X[ßdqß!.^½Á+§ßàÕW¿Éñ“ø›íG¹xîõM†q‚†±Ê*Åû¾ã½ÌÕ"æ#—Ûö/±ºĞfi¾ÁÊb›ïÿãácßó1ŞıĞ½|ÏûßûññÑïüNN?ÁwŞÅòâ#	< ´QKp={cŸ K
ØS{†“ÃÎ:ên¾|ÆÚWO½Êâyææg¸òÖ9æ[~Çƒ¤ãm@Õjd®\[gviãH2m ·”Ê.±:¶\	2#‘Õ>ñ?A_@sy‰ÊèfcfW¡ÄÏ4‰ÔT‚õ×ÎÒßî²|âáB‹îhÈx4fkÜc¤2ÚOkkÌïıÔÏPÃ¢?™Rè‘ÖJ3QÅeÈ ©ë ƒ\jÍ&1¼ëı ÅP­ÖyêS¿/‡¢Ñ`„ò´ª“ÃhlÏ‹ñ˜V’'cÒdl»Ñ÷­ĞôYš™·&¬JDw0`iÏ‚jÄ(³ÿÈ!.\|›Õ={¬osçÁc4ı
YoÀ='oçcÇ9pğ sssœ8v‚'xœ½ûösç}wSk5A¾şÔ×yùÕWxé•Wxæ¹g9yÇíì?°ÊüÒ"ıá x¶È÷¹zõ*Ü~ÛmŒ†CâÑ˜È˜›ŸçÚúãwÿàHJ=Åk÷¿å ¨¬ëTim;Ã…*lì¹ñY:r/÷=ü:±¦?q\‡,ñ¼ ƒÀ÷½osV—y1Lƒ-Ól[y!6ú¾Oš¦SÕ¯Îá+uô%P3ı÷¦[ÁJàÄø®J3ğ]z½E’Ze^>{•WN¿ÆGßÿ ığü*Fùô®n`®?‹vh5›\İèğÖµ-ZûˆµMPp=Û•å
é¢0D+Eš&é`
`*It9„ó61"²ïYFX		‚À&¦(…ç¾mZ†8Ò¡ÑhÔo0ªE!×¯]G:‚j%B:Ğïu‰Çcûµù³³óÖŒc,+´µqOÚìE„*MÉdî&—HÇÃXëovó¬cŒ±&n·;¡m]×¥Ñhàº.½^í•jÕÖ˜Ã^9,:BİÀç133sSÊ­g©)ĞÊL@­ó	\"hA`Å—išLÄöÓ.áiê÷ÖÈ·¥§^HåûO/úéƒıÖy«ã¸¼õÙ^ß„:N‡NOëËÏ9q~NÑÔyf[+¶¨:/œU®´9®ãğö™Wù?şQêµ<O	eÀBµIïÚ:O}æl®­ãù!×®]£ÒnÒXœ£±¸ÀÁÇ9zò8ïx×ã=pˆ9rmmÏ|ã«¼ïƒÂKBu0:Ç—’<Ip´m3HÆ1Æ}„0¬æEy^„~À!§_}¹ö,*Éğ=tğĞöìYfqn† p»Ú˜ƒ!Ç ¤D	‡q#=‡,ÍXZXf~f×Obaq‘"ªÏ¢u ¬ş&IaC6oyşÓNîRÏ‘+…pÚh«}’ñxÌ¨?˜¸~Kmk9äOnuŸOkImœOÌ8Ç¤Y^¬wrÁ™¾ì»7iŠ[õD_X¢Ñ»›/°¾XäÊAàD®{\ô©®,‘9I’ÚÁXk<¥ğáIvÒq õCËÜşşÇpWÚÄ"·I¥èŞØ@õºë[ÔªÆ£?ğp]¥-¥,=£ix>37Ïp<âÔ©S\¹|­÷Ü{/?òYª9sîMN½~–W^;ÍmwİÃÁ£'èôcfW¸tuW.¾Ró#é/pÇÁÃÔ/7¨QŒIS^ßXã•3¯røğ>Ú­*W×.á‚Şh‡~›SÏ?ƒ™m7ˆFƒNv«Ífg‡Ğ$IL\dxÙg`c*<éNØ†iàtj¨EgÍä—Ñí€nŒfeÿ*ssmZE:‚x8 CçüjãE¬mt8uî"õ¯ÿM–÷íçä·³±±Nä8à8G€ÊÑi+}z‰fï‘ãüÜ¯şÿö·~‡…Ã1¡O¬)9ËöbCib¡Ê°qê2ÉY>r ]'ËSÚÍ)8è7yæ—~‹ñ™·Ù;¿Èæ ‡#%çcrÅ ÓeØëaŒ¡Ölg)ÚõpŒ¡:Ó ¬TXû:÷=øáÂ~½ÆÛoŸãô«/sßêaTg€¬WÙJFè4§"]š2d¶R%éIÌL£ÁêÊ>æ›Mš3¼uñ
™ºÃ!íÙY¶:î¼ãúñˆ¥•=FcÆİf˜hÁR­Mw}“ŞöZ• Ù¤·³ƒÎ2=B?ÓZ˜áŞûï§Õn³¼²‡øÃdZÑœióê©×øòW¾Ì8ÉòŒş`Àèõû¼}ñ"÷Üs/ƒáù…n¬¯“f«ûW9sæ{öï£¹pùY®¾uŞûo0 º°ÃK¢²O¤HrIĞÚÃ?ş§³ÄÚ×Á¨WZTHá1T7×£N7!ƒo‘J•æ·iCf©á/÷ËRX$åû–ˆâtík	ŠäS½ìåÿó¦Íw}´26n¬ˆ˜‘®K/¨ìÙÏù‹§Ñó<|û~Ö.\ éù,zĞ¥?Ê¸ÚËxú+Ì<I_IRjÍ:*µ.cWJ+Qp]„Ã•M‘î. %¥´îj×'ËR<Ï#Ib’,¡V¯áù>Y–#· ‰*•
Iš¢¡Ş¨3¬ìÈµÃï`Ğ#
<Oríê*Ï	‚¹¥e‚ b4?{‡^gß•ŒFÂ(˜äÎjm&L¡U¶¯,¢ŠŠ ps3“)Wbcc­5õz}Âû‡C¶··A£iÂ	,‘5G8$irSItYöí¨×’*ÕÊàº^a±¯å f'û¥i2Nwõ–7„é›É·3qÜŠM›:¦§àiúğV-Ù´ õV‘ìô‹bZ£8341x+UlŒ)â_|<?œä!Z¨àúåóü±?ú´ë&Í©;>½Ë×8ıÜ‹l÷ztG1×z]îzÏcÜû¾wrğş;Y½ëvdñèm=ÎÚ‹¯áh¸ÚÛá÷ïÓü©ÿîÑõÃ&7di†Ğš<ÏÈ²Ä>UôjF£³ë²©”W{¤?f±5OÅˆ¤K:S	}„VŒâWzTªuõë±Şé0Î"ğğÂˆq<Ä`HFc¤p	ƒ,MÙél²¸¼R¬™Ü:šŒ¡Ûë³µÓ¥7[$lÊÈ3mĞ(m¢¸
Ç¢ØFk„tlOæpDµ¸àLvÓôı4Â˜MİˆËàï4M‹ ç2¿Ò+¨€,K˜4}LĞf3ÉÀ,0úIu\°%„°Ì+ÖeêÛâ
{9$å…¬íì°™§TççÑF À3©5UßE‡’ËÉ6Şê,}ìÌœØOÇŒğ†İ.Ùp„;J¹qö"{Z˜66wğ¢×±´…çû¸Ò¥ß·BåjµF–æt‡Â0b~~}æY´Ò4š-Şó÷qøØ	Î}“×N¿Î/ıò¯Rkµyô±wrüÎ;QqÂ±“'ùgÿôŸqõÂE–æyÏ»ßÃ|»ÍL³A³jİqëkë¼vêEŸ<Æcï}'ë[›6HA=¨ræìyÖ®İ`ÏÂ‘ô©ø¹Q8¾$Kêõ:tÈUï…Vë”fš7u9Ô»Ü“ÃE‘Òg÷¿¢!Á)6Ø<3t] Í’JcÔ	šóœ»ºÉ—z‘Dû$Úãşà‹üùú!ªDª·h<°ùÏÚÒ®I[i°Öğ?üİ¿OO¥ì9r˜±ÉÉtğ³‹³d*Åäà»Ä½>ë§/PóÚû‰%ø®Ëv¯KäH–İ
—¿ò<ç>ûUfğ‰Çcœ0@HrEÜí3ŞéaŠ¾îZ³N®5F;¾‹[ÈŒaçú&{÷rğ÷‡’»OŞÆ×ÿı§É†#j3mj& ’JÇ%¥¸®OX©NèİÒl´q`¶Öf£;@z>³‹Klït	¥ÇÕU’<E9†¨ZãêÅËø‡›ª^ˆc4ƒá€ƒ‡2Ò
G²qlMW&ÇB6»Û¼òê«ÜuûíTk5vº]n¿ó¢JÄ=÷Ü3@z½>Ï~óYîy=ÆŞ}ûˆ*<ßçÒÕ«Kó¨,§ÙÁ«†|æÉ/T*¤Y>‰fú/ oÍ·½õ×ìÍw 7ã¸ ¬t\¼æ2÷>ò~ßıãÌ!.ç¢³1”¤insUõ®ô*Ë²	°Qj×Knrv ÇÄœ9µ÷fE“ÒtšF‰ N ›â\.spËÄò\,A’r ØğèQœd)4™ÎÁõ,7ãä‰Ã|ş³ŸFÅ1ïüqv¶·È=D)²ê§6:ŞÃ°k¸Q…ÁpHX¬Ï-Í¦8Œ¬DÇØlBß³¸<Ï‹ÚG…”.¾ï‘f	´Õ›››¸^ÀÌÌ,Yn"ec”…fİ0¿´Ä®ëØ×£*Íèõlµc³Ñ ÙÃhŠ¹ËÆ¯]½|	­SüÀ£ß€±hŸ5~ø“Ÿ_–e8®DĞ…}Íè›æ%¹røöOŒF£ÉCÇ“ƒj0°²²— ´zéÚ±Z­N43A1Ù&ij°šU,¦L*ÔˆÂùj0F”ğ®V.+ÒÕƒĞ¿iqN£(¥øuºLıV*÷VúîVƒFIéŞºÀo­Š+e	W—¸t:MÓ‚ÓÃïô`R%½A!„õÁ@ÛJ0K“ƒVy8.W¯œã}ïy˜Õ=s¸q†è§|ıó_âÂé×éŠœã÷İËwıÙ`å®ã<CÏÉ˜œítÄ ¿M/S7‚ë¯ãÒ…·9zßİœ:õ:OşÎg¸ûñÇˆ*5FÃØÖûiÅ8"‹¸	ªpt‘‹g´}öqœpúù3Ôƒ
¡ãád†<Iõû4jUjQÀ UdJ“¦–JÌ¬ml’OœÄT+ƒn—F¥Îx“Œfæš\»qÍ Q€ëyìtw¸ví:İŞ„GTñ<g‚øMëó¦k Ç!+dº–Ã°? 
Cfgg'›İ­¦¡ÒÜT®ÏéêÀ2\´¤ƒ+E=œÁ^†âØÑÓ]Ø%h¿>KÕJ§°çOiÓ¼c;®E¦0ÈÂâ	aA0dFr­Û!}¼Zİ†ğº"Mñ ß—¼µq…ÕÇîæÑ?şÎ÷6˜ÁÆú:‘–ÈTAgHïÊ:rh6ZDõƒ4ÆQª ;r”VT¢ÆÀx8D
	À÷\âÑˆÀ÷h6Z<ÿülmn±¼´‡»î¾“|ápÈÚµküÁç¿À•·ßæ…§Ÿæò¥·ùû?ö÷8úŒÍ½ìîğÂK/rä¶xƒtáİÇïåÃq<Éïáë>ğ¾ïà“w)‰[iĞœ™'Ík—¯2ÛhÒjÖÄCğ¤ã$ÁAà¹ª ¡Â0´5{S.àI÷”Øu,Ò*Š˜!)i
\é I¨¶ê¶ş—Aª¸t£ËÖ0ãüµm^~ã<ñî}ğqzúY}úişÆıeÔ¨‡§3Ğ‚T+pY’PñBâ8gvÏ*ÿë¿úW|æ‹_aõÄqLä‘æ¤ Ó9~ÕGE46¤B“GŒ.]'r|ª{æICÇ$hZÒ'}ëOıÜ¯2ëThUÆIBP©™œQ§ÇpsGka÷Õj³øhõJDì(2¡¨¹UêósÜö¾'X'&\8y7o6xc¼MÿÒ&-'äZ<Ä™m \—‹ë×Ñ‘G}qL@§7 Qo')‹‹ûX»~%¬æ7ÅÌÏÏ2»0G§ßcqÏ
›ë›Ü¸r•…%:Û,íYfmã:a³F­İ¦·µÃÒü<9šæüÊuøÆ3ßä Y«'	qlQà…ÅE®^½J´Ûm¹ó;œ:}šç_x4ËĞÆñ˜½«{©Vª¸8\¼|‰wİÅg¾øE6{=\Ï½¹*ú¿•âø:Ë­¦Ş•äZrò®GøÀù^v	2¬¢Š‹£Wh:sHÏ^fŠs¹şÊı4Ë²‰fo:iaúŒÍ¦bÑ¦¹ID–Ôn™hàûş$Acš&.ÏÓ’Šã>J*õ&Ê:-¢ŠO³U§×ïÒus²ñ/¹ÿ¡÷ò¹?ø2jÔgßñc¼•H<ã1
f¹’œïts‘Ü‰³Œ ô	¥Çp0À•NQã"œRQ«$I<‘îØ™ÀV¾æ¹Í–œ¤}	ƒÁÀæÖjDa8Ñ˜{¾o÷"Rgff†4ÓéìØºÒ4¥×ëFÖ‹±¸´„>Ya¢´ZCÉÎÎy#¤ 
#ËĞ(ÅxÛÆ§RcéÊB—^<³"cqz>’‹«Ç?±½½m9ìÆÍóœt373K£İ ²p´Ö¤ynÕ‚¾*İ‹²¬-í]×!Ï³"÷O‚qpİ2g//¾©İ<µ²ÅC’Æ“¨•ÒLRFs”‹ªŒí˜FÙ¦‘Àiê¶Ë¿[_ÊÁoµ,óÇãñMãr(œ¾½•CÀ´p¢¡Ès*•Ê$+nšZBR+ğ—†Á¸‡T*!ãáV½JìKÎ>ÿ,ò=ïáĞì_{òY~îW~•Aóÿ0ïşş?Éê±£$qÆ°ÓÇÓögnÔğÑ½3L¸rå"[›W^¿Î}œ7.¼Éÿş‹ÿ½¡âîû¡=»€8IøzŒšá°oÛCRÎ• ‰£B¾òÅ§Ù¾¾E»Ñ.úCã$Å¯6pü:•ö"#O`¤q|Œ±ÕÒÇTüA<Sñ<fÛu*Ç8 M¢53K{xöÕW)ƒ_iĞåŒMkv°ëG87n¥.szˆ/;=ß§? µf«³Ãò=„~pÓÍv½-7¶$I&ëÀqtxêU ØF[­œ±B[“Ûìâˆ‰6ÃjMQ=¤&Z@a,º¤ŠÁÃÂ¢SWâ9.6#Ki«Ÿ5iJEŒ}×vÖIü€ÖÒCšà¤9:
Xo2wïqnÿwóöÎ*V´Â*ı~Ä(¼LQQãk;Ä[C‚ Â¨èÇlU«8xtz=„çã¸>Z*Q<‡Ñ8%<²Ì^şR•’å³óó\¾|…§új¤8yì$÷Şû {–÷sum¯~ói¾úì3œ¿z‰÷«¿Æ×z–ßøíÏò/~şWùÕO†ùı
ÿıßşk<v˜K/>ÃÊÒ?üg¿ŸúÁä>÷y¾ñì³h)yüïäĞ‰£,íYâÎ“ÇYİ»„A	nÑ}l ®ıw=e*º›İ0"KR‹®J¥6‚Çq®‹çÎ Ü*i&À­k—±ñè¥åUØŒ=^?»Æ/œãüÚ&[qÂHÃ¾Ã'8pğ·?x‹ˆLñÏò'©ÔB¾ç{>N2èâ(…’¤1®ca%ò b;Nùk?ş?’Ô[x:Ú±7yWH\ªµšï×>Ûñˆ|Ãµ.U×GÏÖèÛXPûÌßüåß¢¥C‚¨BGÅ
Y3X»N<Z$ÚqÀ•h1šj«‰gäuŸ¾‰©†!U/äúÆïû£ßËFfH´aaÏ>îyèÌŞsV*\Ùß`½îóâÎ:‰\XáGî¦m|œ­!Ü:;WoJM$k\ºx™8N™[ZæFw‹j£ÆÊâ<ÎxÄ¨Ÿqòäí¼~áM†£”ƒ{öS.k—/S¯Wñ«>7ˆš5Œ/!|ñ+_âıï}/µ("îp‰Æpmc»ï¹‡™™®^½jÍ6^ÀÙ7ÎòğÃóŞ÷¾—LåìôºÜØÜæÅW_eg{‹ù…Yfæf9õ"ûáó_ş
ëÛ]×Gi›Aj³G-^/ûz6FÛŒ¸"Ú©ü%Š×¼ÕdeE¶§Ü«2Ñà»•§£ñ·ĞªÚø­Ê÷ÑiL«¢ĞÄJrìñóü)Ò¬Bº+úr4ÂH/£Õšg0Ù¢iÍ¥1BYf+?­¸vHW r[H¡/ËÆ)Ê’q21–Å%ãzAh™2Z®¼Ä—€””¥Å¤É%ÏëÔMi¢¨DUB°…6>¹ãqø{øÙOşë××ø½5ØÁiÌòòÚ—A°¸A®“ŒQñØ‚0H×'.:£¡ßâ:Î„­TÊ`Œ(t€eh61ˆHGí7‚dÔggó½A—ŞÎİu†;›äYÌL«mk qiµj¤qÌhĞE
C-
Ç´fç‰ª6ºÈ/Ì)v†±~c0
È³¤ \âöí?LµÚb§Ó!ğ%i2Ä	<ŒI‹ÌYã¸ãLŒ¦òÈ|bšÆšèÙŒan~¨Rİ¥:Å.›—”çm:=Yîjê˜“ŒšòïÚœ¹]í¥W‘Üı˜åÀW~®²Ûõ?öV"oÓHß­üôĞvkœË­Ær¼•¾u6®L›QÜ)Ó‚1!-4;Â%S‚Q–>İíM–[3¼úõ¯0ëjËúÆ:·İwòOK÷ÑÉ’“Ùê8)Fåh¥pŒfgØÁ÷%‘#9óÂ‹ôol2ÓlsåÊ¸×“Ÿyòëüæøt†}´V,-.±<¿¹‡“˜©6©{!3µ&U/dıÊ5^}ñEz[øŒcƒ¨Gi‚däsæâ96z;¬]¿F·ÛçÆu.¼}…Ä(´tèGÄyFµá
˜i40*£Uo2ŠcÆiJš+fççÙÙéĞítÁ€*\j#£ÑpDñx<¦V«}Ë ^¶x”¥ßYÛvÄ·ÕƒNŒ·„6îe÷«Ü"ÊÚhFIJ8d<“+ íº¥Ó¼DÂ‹·X“T9ë*•S¯×±ô 'İ‰öO`l@i¡£ÙAs¾»…Ójà×+¤&Çw\êQ…½üÕYÿè‡¹ÜßÆq%"Éñ•!ñ=5ŒñRC¼5 í	ıÅî¡åº­ÙYúƒ>ã4!|´1„Efwº[(c¨U+H×³´GšR«×ñŸg}†n¿Ãââ"·İv’cÇÒï÷ØÙŞ¡³Ó%K5+ÇC5Äñ}î¿ın:W®òÌ“_åÏıÙâÄİ'9sş,çÏ½ÉL³ÅŸÿ‘¿Ì?ÌÙó¯óg"‹Sz[Gø6°5Ïp\!í¦)œİ².GØ@Çq¬È[+ü0Be)Æ€VH”!¨6Q…çOŸçFo@ßÀÚN‡Ï¼Áú`Àµ._}şyN½ùµö,ËûpèämÜóğ#<~’Z£…Á%
tšóÊs/ğ·ÿÆ_ã{şØÇyâĞİ¼†‹mûBŸ4KP¹"Ëó{öóÿÿ©Î¿ş{#¨F(ÊH#‰6'°—`ÑMi…P¶‡ÔÂ
º2HÌ(¥‘k¶Ş¸ÄÆ™KDÆC¸ÊØCv4èvğ6àİh…ëHª•
a0ŠN< ªW­î7¬UBN¾ó!Â=‹øÒc3ğ–;bmÁ¥zb/{ö¯ ÉµímŞ|ã4ñ0¦^Ø»wÍZ•d¬ìİO¬~µI{a–n‡Qãø’q<bÿ¾\Ï#ªUHæĞÑ£¼òÂËt··˜›m³±½…vK«ûéõ8ÒåĞ±#|ùk_ã®»î¶Ã|®Ğ£˜¨ZÁq$Ï¿ğËKKÌ4[Ô*Utf>Ì™3g¸qã<ø ‹‹xÇí·ßF–g\zû"ë×¯óò+¯ğØ»ßÅÕ­M~ùErÃ®=È”1AE¼™±QA¸á:“_HÆ†‡…ğ[¨JçvŸvtÈs¨Ô›dòT!›«µÁ÷T:¤ŒÇ#2ípôşGx×wş”¬²ÓY³9Æ1\Œñ1™ÍxEk$
•exÒÁ-ÚFå8TMŒ A`3ó,Á¨­r„StÚ;Òºë»Q$X“Å­¼e¤Ön9„™0kÓ/¦èâò¿§cb²,£jÆ^H*"bâòø£ñÜ7¾Â©Wã÷İÉXz\êykgŒß^ÄøF)(‰2†ÉîÉ¦@)ó,±îZ!¿Å3=ïh“OEÇ‰‰ŒÄf*‡ä…g Ç¸Ò ÙjÛ flj€Qš<Ë­Óõ˜™]@”r¾Ç`Ø£İªrùíóÄã!:Oğ<!\’³ÿ*­V›,Ï¸±~ ŒğÏ
á SHîl)‡¬ÍíıD‰€$IB­V#lWåÜÜœ=!›¿yQ¶|«Şíf-˜jà(¡]wú˜-Ê‰ÅMf]•ù„^+õ…Ó.¢iî´ÓÜB;—z‚i˜úV´°>o5‚LIß:L‡BO¬éab×Ù¬¾EÔkŒ!u2<ãĞjH·JîúäÒxÈL-bã³,F?ò§¿—Õ}‹¼ã‰‡X=v„~‡T„’¨Ü"ç"´Fg¨T#I§é¸|úÖ¯\µùk³s¼rş"_=u– Ş$šYàÜ•5~ãS¿Ç§¿ğ^9û[#ÅH…¸­=äá×ûš¯½ü&Ÿúò3<}ú<áâ>ö/í%N”Õ†I‰#]r³İÙæÍ³o ²Œí­-Æ£„ŞpPÔ	Æ*Å«D$ı®14B‹H„^@w0`«×Ã¯„¤YÎÌÌ,®tÑJ…QáÔµM3~1\AÀhdõ|Y–ÂÜdòlr­
m…,;Â¢k®#oÜ§uÓnïéÁ]ßõcl‹´(£ç{EË`4wwmc×v–ex;Ù0Ëa”bó”Â!×Ï•xÒEÚI“ÀóZãù>[(ŞtÚ3x¤BºãQLâ
îø®÷cÚU:éa'I‹
4Hã™hF²aŒ„Åí´ø…¡?ì1·°€1š~¯‡ç9¤qŒ+%a%Bå9ã8Áõ]|Ï#+ô1¹VÌÍÎğÚ©×xù¥—XXXààêAxì	ªA…·/¼M7M VÅT«Ôªú×6xôöûxú+_åÓŸùßı#ßÏ±ãÇnnóò7ŸEÄË{–8qÇ	;Äp§C·Û±:5|ßfFGã‚¢“ıª€fÒ)	+a<DâL‘‡Úì—Öwø—?ÿËTV9rÇì=t”ÖÒ¸£wŞÍŞC‡¹ëÁwğğ»åèmw²°ÿ õ™%p=2eÈ3Ayœ9s†ÿíŸş$?ù‚q·ÇŸıÁïçàŞE’Q#r´ÉÈó•i¢°ŠÏ¾ršı;ÿÅC+Ôæ1R¥ù$ĞUçºØ5n?#TªP!Õ BŠ!ÅøcMu˜ráÅÓ8CE-¬ ´êu;d£¡4”<)ZaŒùªÔ*ô]MFy,í[AÔ+$‘Ïİï|„öü,d‚0ğI»Vgµ>Ãë_}–/=ù$=d~n$ËxşÅçYYÜCE¸98‹W©ÑcR¥¨6ôGC—ézÌÏÏÑj·‰“˜8KĞÒá‰w=Áïÿşïó™ÏıÍ¹6¯=‹–’n¿Ï¡ÃGxù•—™_X`ßŞı¤qÆ|sG[ÙD£Ùdcs“v«…•0dqaõíMÎœ>ÍÃ=D…|ösŸ¥=ÓæøÉlíláJÉ]wÜÎâÜ<W®\å·?õ{l†\¸z•¤ìÎ-¯›Á¥ŞÍXÍ±)Ï¥r¯‘ÇµÃœ'—“3µlÃp¥sòÔÖ”9X4,ğ}|Ï#IÆHŒvğ«³|Çı“Üûøû	ÛKâœî`@àKŒHA(®cŒF R“g)çI§0{(eQq{€ñ0Qú¾m²‘”Bº!™R „Ğ*$\ÆØ¤…rÃğ&ce©,Ïí’A+ÏÔé°Kº¸üXI’@Ó6'â…[İ÷?ü _}ş^zîÜû(/_ZgåÄİh¿ÂvÇÿ<×Gj›Ú)‹ä*‘§)i<¶¹¹<âVspÌMî[­v"cÀõm~`µ"‡Ñ8&W9õfc4iãy.ãÑ<³`ØÜÜí™yŒ“ºÒf3"÷ØX¿ŠQi’Irî¸ón9ÆÖN‡L)ö¬¬Xçrœ ufX08Æ™ ËÂ±½ÇRyµO8˜ĞaU*“ Æ´Èˆ*¿[/njÓ@NzZÒ±M×õÅÈó‚	"g´3 wi[]ÔÏ¨	WR°¥á¤\%*3º•AÕ·êönvbîVN›:¦©İéïyz ›şûÓHà­º¿’Î
[ø­:E Bğ8¹d8ÊP‹qsµŞ+„£>ÿâ'ÿ1'í‘ÑöéÆc¼("Uš0¨`”±ú$!È²­l–ŸÊd¯Ï¬ÑİÏ?ù~Ì/pf{‹ßüÆs<rç#à„¼ã=àÀíwÓX^!ó"^|ë
ğÌËüş×_àßüŞ—øµÏÏ½x†—¯np-sx«óÆVtíõÆ,ATA:Nnõz´*5n?vœù™YÂ daaF½	Ú0ìíÅu*§U«ã	¹mÑÀÕõêíÚ@Zö[Ív™“P­Vl•[–OdaNi9üi­ñC‹nmm!€jÍš>,#nr;9Ay1ĞÚæU)­ÉsEšZº@™bŸpÜ"{Éç©Í“2z¢‘Râ
ëæµ±/‰­‡3EŒƒ ÛÈ`ŠµV¸ÏR¤VxBpƒ€M•siĞ£2Ó¶Šc…İ[;;ÜşèƒÌ?v'o^}›j½F>iÇf:‚ÑxŒP@œ3¸¶ƒ‰3</DaQ¡Ò³ÈEš¥„a@µG6Á±YT±!¥Iœë?ÈµmI“3³3(¥yáùélw˜Ÿ™çØñœ8z’‹×¯qîõ³ìİ³O¸Tü
›[Û:|„-¾ôäğ=äcÜqìU?àå—_æÒÚ–÷-IYİ³ÂŞ½{}FÍj“;İ®Í*Ô¶	¡x ³Ëb(ŒÕ¤&#ü Ä8Zxx•›ı˜¿ğcù+ÿ½÷;iÎÌ!ı?¬„Òµà¾™Œ8ÓŒË6¸BàjÉ™×NóÔW¿Á?ø{/~öóìß³‡JàòïGîÅ¢t‚xäZ“§†ñ8§:3ÏßÿÇÿ„³×¯1wp•X¨bïEk¹o¹8Zà$
\“+ÒaLµZeœg˜4'Ì!Ùì°¹¶A«ÚDº.ƒÑñhDÖëÙ*=«…tŠCåHÏÅkTËN>¢5ßfnßhTY¾íáL›#±yşmÎ½tš³Ÿı
égé>ù§ã3ìœ>ÏÒÊÎB›ñ²$£·¾ÅÁ™%î=t77ô{#¶:=”+ˆ“”«kWØØŞdvn†,KGì?°J'HÏ#¬×H´â=ï×.súÍ³tÇ6v¶Ø¸¾Îë§NñÚ«¯Ëo½M \¶Ön`8®¥Ç±e–––IÓ„x4fÿ¾ı„AÀ7Ÿ~š¥¥%ŞñĞCœ>ıWÖ®rààjÕ:o_¼DµZáCú0·ßy¿üÉ_ãíÍ()À‘ñ»NşéóÂ+ò×Ê„ÇˆÉïZY£_ R+£pøÂÁ“P¨<Cp<ò\“ç¿Ò`õä;8vßc|çwÿ OòÖµFF˜ÜV::Æ¢uNª2Kı9\…‘
G„)7‚,Gz =´ÏÉ?ŒˆÓ¬¶{¢çûÄIŠp\Ò)İŞnM¦uï–ò±2>®<ÿÊıy:u¡üÿegoùñ¦/ß¥Î~äTêÔë£%øQÈæHñğ‡¾›Ëë]~óKÏâÎ®°°ÿ ½ìIğMN>ì!¤G®,m´"MÆÄ£i<Få9ônÒ>Ş*÷Š“¸ˆ‡ÙußdâgÌÍÍY¯Dn]µ0Œôûä…Œ*ª6­¡Pºn€
abÎœy…$îcŒ¢R©ÑïjuŒqX»¶N¿?¤?rıúuâÄjĞó,±I+Z[pT[Ü’^-iÊşÀ"9­ÖL‘-£o: §›/¦{Q-2¢§Ï"_§X)|ÅºûB1·¸¢Š!Üİ:¯©F2«­ÌüvĞÓTôt]Ø´€µ\xÓ„ÓusÓÑ3·FÚÜª›ÎœşÜe°p	uOÇã8C-¬1t©†uÚµˆñ€fÅ£íW^™_ú©‚Ê{ÜØŒ©V\|é©ã–ªÉu†r4¶ C¡UŠƒ¶aÍIBŞíâ8)×/_±¢êåeN½ù&¿ıâşÒı%¼¤É3o§“h2SŸ?ÈÒÊV÷0ÒE‡¤iJ£ÑÀ8–z·ñ c†Ã!bí
O¯]c¦á¤1í `uiN1Ìm°À£×‚xCÓqq¤ÇV§ƒzW0J3Ü²]¡ÑšhùÂ°Bkv6·Q™&ôz½7¨5ê7ÑóN¡•‚]=İÔÆQ¯×o’”köÖØ éçs«™hR§£ZÁúæ&8ÒvbæSšš\éìŞM®Pè]á°tZÜ„JO_@$Yhns£ñ¥´!ÑÅÇÓ`XÄxÂAjH„¢70{`/‡¾—3ë×YX\¦×İÁAêÔÅKAî€£…¥Š‹qì4ëš$OŠØ† ¡BæfHã„ëk×ĞXCÅÂÂı~ŸÑhDš+ûh1öm t’òä×¿ÆÚÚu¾ãıàä±ãüé¯òõ/~…g¿ñ<K÷İÃØÍéë \ÁŞCÇhë!îOüÿì'ş·?ü0í½{xáÅùÆW¿Ê»„~¯G&TBŸŞp€P«ÕHÓ”¨’h«Ë2A;§BÛa»V­’åö¶®D•*åGş
GßÁ½<ÆƒqŠX'£Â!IF´íîÔ¡€;7vøÜç>Ïg~÷wyşùç‰ª5şâÿcü«õ¯X¿~zÅãÀê~Fƒ>I<"ËÛºS©3Ğcf—÷ò3¿üIşıg¿Ä‘‡ïƒF8â»´¯ï´È¹5«¤Y†Tvˆs<×4öºÂ[~¾Ëp4fØ‡ -Ê”§Ve[ë…µ¹²Ye+ÓnÕiÎÌâ4Tì%Ø³HçÊ:ÿôş#–¢^|ƒYâöìt6Q"C™š!ÑÊ·8N7vá0×œaĞpíÍ‹Ì4[ì]ÙGæÖÖÖ˜o¶X^\äí7/°ÿĞ*;;]Æã„Jè’æŠõµ«´I²”¿úşÿ×/ü¿ôó¿À±j©?duß*;ÛdqÂåsoQ"z*¦Ùn137GoÜ'¬D4ê3xKÕHÇ	Gæàş|ãß Óéğ¡~˜3çÎò¯?Íá‡¸÷Şûxë­üæoÿ{ŞÿâúÄ?äƒæûğAnŠK¿)û»ÑNHó’!ÚuÁNöm¾Í_LµB 'É‚Fò" S'j2»¸™å½ìÙw˜¥=+DÕ~kÇÙŒ‘¹Ouf½í.µ("”z,pü åX—»–.^á¸Je'²æ‹<#W9ÆxdÁ×Ef	nàÂ`Dª5±]1ğÀ‹Äc{Q,Îg!DÑ—+'Ã]©¡¦{Ëıñx¼Û;\ ‚YQWçy~™`Ê u"„ ªTĞ¾dûÆ&‘ô¬¤Å…Şpˆã…lvRN<ñ–îÚÆ÷}.]½N½ÖD«Œ4)Ì‚ÂÁ•¹²Zwg¨Â„:]+;şLÇ¼ù^°›F‚5^MŸ÷ZÙóÀšF¬ Íéx„ïÙ´Ñ¶¥÷,óZ©UI“ŒZ­FiÔk<÷ÍçĞyJxÄq
d'ì™™§Z¯3'D~Hfø¾‹ç:¬_¿NØó°<·l;V	{(d}~ß'ÊTS|á•JZ£NEíÜ4ºå8hÛ_*¦4rLôTÓÃ˜œ¤}O»3wÀú[ìS»Ù\fbÒ(‡½òãfYö-Ü­pùµ—U5·îÓîtÓÃM7WÄİ4<:¬o§üvõd·¢ƒBtœá8’XçÓ!®É³!û?÷¿ÿcö-Uô·™›¡ßïÓn4ISKqê\¡E¹áŒÎA+„ÊHã˜ñ`€ëJÂJ…/}ñ+DaÄÅ‹WùÆËoğCöY=xœŸúµ_§uô i¥Šr=œ\`Æ9ñ0#WíU‘aƒLt;ƒ”X9x•&r¡I}u?ÎÌIÊV–qví¯]|›;$Jã¶gH/¬àá2Øš›°ÒKG¸®M‹Os…p=IÂÎ`@–k×6ÅDAˆïùäYN£Ñ`fÆÒCå†á¤Î­4
ÅqL­V#cò<§^·5=Z)´Òx®wSøé¤¯ò–àÓ]Z¿DšİÉ³"æ¼¼%–9ZRZJ!/]É…Sd"j[E&äM²
¦©$GØ*¡‚–ó§Á’L€S‰¸ĞéĞ5ŠV«mkíò1©k¸÷ıO -Óô©Öª{=$à9qÌµ"U9b”âÄ9ÃÍé#]Y½¦ˆÎ	}ßsÉÓ”z¥B¯Ûaksƒ'Şù8÷İ§OŸ&Ï3|?À÷}¶¶¶ È\#ãá˜Z½çù¬o¬óÆ™×QhìYá®ƒ'q3Ã™óçº†ÃwŸdíÊU|ÍæfæxîÅç¨·›¬9ÂÌ\_.9G{f†f­Æh0Àu]¢ $S9AÑï÷qËf±[ÕØáÚq0(’,Çñ}ÜÂàğ›¿õ)ü]<ğĞ#(TaØQYŠçÙF„Q¿Çë¯½Æ…gOñÿö“üÚÏÿ¿ñ³?Ã§ÿí¿Áö8´o‰şÎ6öøÀûøæÏf#¾ÿ{ÿÍJ€ÈBÏÅ!;½!2l°Şó#ıo.ÌáÍÎ2–Ùx“©	…è…5eå™Ööâ£I–FÃÁĞöûfŠÎæ6õZñpÈ ×#ÅPdØY\™	Û‚+	ê5¢fú$æ›mË‹4î§º²ÂNœqäĞQï]¥U©ÛÔ‡n—ÑöÒ—´gšÔƒ 1J^Û ŞppÏ
ëç/ğè¾c4sÁL£ÉüÒ"Òu¹vù
3õ&•0¢]o¸İ^Ÿ4K1ÀÊÊJ!Ù°-CHÉp8ä¡G¡;ğÅ/|ù¹9ŒÖ4ë«¤•…DÁ‘¸•ÎN‡á`ÈöÖ×¯İàôé3œ=sõë¬½½ÆÎN‡'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js');

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._noop);
  p._state = 1;
  p._value = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

var iterableToArray = function (iterable) {
  if (typeof Array.from === 'function') {
    // ES2015+, iterables exist
    iterableToArray = Array.from;
    return Array.from(iterable);
  }

  // ES5, only arrays and array-likes exist
  iterableToArray = function (x) { return Array.prototype.slice.call(x); };
  return Array.prototype.slice.call(iterable);
}

Promise.all = function (arr) {
  var args = iterableToArray(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._state === 3) {
            val = val._value;
          }
          if (val._state === 1) return res(i, val._value);
          if (val._state === 2) reject(val._value);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

function onSettledFulfill(value) {
  return { status: 'fulfilled', value: value };
}
function onSettledReject(reason) {
  return { status: 'rejected', reason: reason };
}
function mapAllSettled(item) {
  if(item && (typeof item === 'object' || typeof item === 'function')){
    if(item instanceof Promise && item.then === Promise.prototype.then){
      return item.then(onSettledFulfill, onSettledReject);
    }
    var then = item.then;
    if (typeof then === 'function') {
      return new Promise(then.bind(item)).then(onSettledFulfill, onSettledReject)
    }
  }

  return onSettledFulfill(item);
}
Promise.allSettled = function (iterable) {
  return Promise.all(iterableToArray(iterable).map(mapAllSettled));
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    iterableToArray(values).forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

function getAggregateError(errors){
  if(typeof AggregateError === 'function'){
    return new AggregateError(errors,'All promises were rejected');
  }

  var error = new Error('All promises were rejected');

  error.name = 'AggregateError';
  error.errors = errors;

  return error;
}

Promise.any = function promiseAny(values) {
  return new Promise(function(resolve, reject) {
    var promises = iterableToArray(values);
    var hasResolved = false;
    var rejectionReasons = [];

    function resolveOnce(value) {
      if (!hasResolved) {
        hasResolved = true;
        resolve(value);
      }
    }

    function rejectionCheck(reason) {
      rejectionReasons.push(reason);

      if (rejectionReasons.length === promises.length) {
        reject(getAggregateError(rejectionReasons));
      }
    }

    