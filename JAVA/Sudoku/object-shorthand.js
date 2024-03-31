var callbacks = thenCallbacks;

                for (var i = 0; i < last; ++i) {
                    var maybePromise = tryConvertToPromise(arguments[i], ret);
                    if (maybePromise instanceof Promise) {
                        maybePromise = maybePromise._target();
                        var bitField = maybePromise._bitField;
                        ;
                        if (((bitField & 50397184) === 0)) {
                            maybePromise._then(callbacks[i], reject,
                                               undefined, ret, holder);
                            promiseSetters[i](maybePromise, holder);
                            holder.asyncNeeded = false;
                        } else if (((bitField & 33554432) !== 0)) {
                            callbacks[i].call(ret,
                                              maybePromise._value(), holder);
                        } else if (((bitField & 16777216) !== 0)) {
                            ret._reject(maybePromise._reason());
                        } else {
                            ret._cancel();
                        }
                    } else {
                        callbacks[i].call(ret, maybePromise, holder);
                    }
                }

                if (!ret._isFateSealed()) {
                    if (holder.asyncNeeded) {
                        var context = Promise._getContext();
                        holder.fn = util.contextBind(context, holder.fn);
                    }
                    ret._setAsyncGuaranteed();
                    ret._setOnCancel(holder);
                }
                return ret;
            }
        }
    }
    var args = [].slice.call(arguments);;
    if (fn) args.pop();
    var ret = new PromiseArray(args).promise();
    return fn !== undefined ? ret.spread(fn) : ret;
};

};

},{"./util":21}],13:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = _dereq_("./util");
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
            value, promiseCreated, "Promise.method", ret);
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value;
    if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
                                  : tryCatch(fn).call(ctx, arg);
    } else {
        value = tryCatch(fn)();
    }
    var promiseCreated = ret._popContext();
    debug.checkForgottenReturns(
        value, promiseCreated, "Promise.try", ret);
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === util.errorObj) {
        this._rejectCallback(value.e, false);
    } else {
        this._resolveCallback(value, true);
    }
};
};

},{"./util":21}],14:[function(_dereq_,module,exports){
"use strict";
var util = _dereq_("./util");
var maybeWrapAsError = util.maybeWrapAsError;
var errors = _dereq_("./errors");
var OperationalError = errors.OperationalError;
var es5 = _dereq_("./es5");

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);
        ret.name = obj.name;
        ret.message = obj.message;
        ret.stack = obj.stack;
        var keys = es5.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!rErrorKey.test(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    util.markAsOriginatingFromRejection(obj);
    return obj;
}

function nodebackForPromise(promise, multiArgs) {
    return function(err, value) {
        if (promise === null) return;
        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (!multiArgs) {
            promise._fulfill(value);
        } else {
            var args = [].slice.call(arguments, 1);;
            promise._fulfill(args);
        }
        promise = null;
    };
}

module.exports = nodebackForPromise;

},{"./errors":9,"./es5":10,"./util":21}],15:[function(_dereq_,module,exports){
"use strict";
module.exports = function() {
var makeSelfResolutionError = function () {
    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var reflectHandler = function() {
    return new Promise.PromiseInspection(this._target());
};
var apiRejection = function(msg) {
    return Promise.reject(new TypeError(msg));
};
function Proxyable() {}
var UNDEFINED_BINDING = {};
var util = _dereq_("./util");
util.setReflectHandler(reflectHandler);

var getDomain = function() {
    var domain = process.domain;
    if (domain === undefined) {
        return null;
    }
    return domain;
};
var getContextDefault = function() {
    return null;
};
var getContextDomain = function() {
    return {
        domain: getDomain(),
        async: null
    };
};
var AsyncResource = util.isNode && util.nodeSupportsAsyncResource ?
    _dereq_("async_hooks").AsyncResource : null;
var getContextAsyncHooks = function() {
    return {
        domain: getDomain(),
        async: new AsyncResource("Bluebird::Promise")
    };
};
var getContext = util.isNode ? getContextDomain : getContextDefault;
util.notEnumerableProp(Promise, "_getContext", getContext);
var enableAsyncHooks = function() {
    getContext = getContextAsyncHooks;
    util.notEnumerableProp(Promise, "_getContext", getContextAsyncHooks);
};
var disableAsyncHooks = function() {
    getContext = getContextDomain;
    util.notEnumerableProp(Promise, "_getContext", getContextDomain);
};

var es5 = _dereq_("./es5");
var Async = _dereq_("./async");
var async = new Async();
es5.defineProperty(Promise, "_async", {value: async});
var errors = _dereq_("./errors");
var TypeError = Promise.TypeError = errors.TypeError;
Promise.RangeError = errors.RangeError;
var CancellationError = Promise.CancellationError = errors.CancellationError;
Promise.TimeoutError = errors.TimeoutError;
Promise.OperationalError = errors.OperationalError;
Promise.RejectionError = errors.OperationalError;
Promise.AggregateError = errors.AggregateError;
var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {};
var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
var PromiseArray =
    _dereq_("./promise_array")(Promise, INTERNAL,
                               tryConvertToPromise, apiRejection, Proxyable);
var Context = _dereq_("./context")(Promise);
 /*jshint unused:false*/
var createContext = Context.create;

var debug = _dereq_("./debuggability")(Promise, Context,
    enableAsyncHooks, disableAsyncHooks);
var CapturedTrace = debug.CapturedTrace;
var PassThroughHandlerContext =
    _dereq_("./finally")(Promise, tryConvertToPromise, NEXT_FILTER);
var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
var nodebackForPromise = _dereq_("./nodeback");
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
function check(self, executor) {
    if (self == null || self.constructor !== Promise) {
        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (typeof executor !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(executor));
    }

}

function Promise(executor) {
    if (executor !== INTERNAL) {
        check(this, executor);
    }
    this._bitField = 0;
    this._fulfillmentHandler0 = undefined;
    this._rejectionHandler0 = undefined;
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._resolveFromExecutor(executor);
    this._promiseCreated();
    this._fireEvent("promiseCreated", this);
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
    var len = arguments.length;
    if (len > 1) {
        var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return apiRejection("Catch statement predicate: " +
                    "expecting an object but got " + util.classString(item));
            }
        }
        catchInstances.length = j;
        fn = arguments[i];

        if (typeof fn !== "function") {
            throw new TypeError("The last argument to .catch() " +
                "must be a function, got " + util.toString(fn));
        }
        return this.then(undefined, catchFilter(catchInstances, fn, this));
    }
    return this.then(undefined, fn);
};

Promise.prototype.reflect = function () {
    return this._then(reflectHandler,
        reflectHandler, undefined, this, undefined);
};

Promise.prototype.then = function (didFulfill, didReject) {
    if (debug.warnings() && arguments.length > 0 &&
        typeof didFulfill !== "function" &&
        typeof didReject !== "function") {
        var msg = ".then() only accepts functions but was passed: " +
                util.classString(didFulfill);
        if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
        }
        this._warn(msg);
    }
    return this._then(didFulfill, didReject, undefined, undefined, undefined);
};

Promise.prototype.done = function (didFulfill, didReject) {
    var promise =
        this._then(didFulfill, didReject, undefined, undefined, undefined);
    promise._setIsFinal();
};

Promise.prototype.spread = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
};

Promise.prototype.toJSON = function () {
    var ret = {
        isFulfilled: false,
        isRejected: false,
        fulfillmentValue: undefined,
        rejectionReason: undefined
    };
    if (this.isFulfilled()) {
        ret.fulfillmentValue = this.value();
        ret.isFulfilled = true;
    } else if (this.isRejected()) {
        ret.rejectionReason = this.reason();
        ret.isRejected = true;
    }
    return ret;
};

Promise.prototype.all = function () {
    if (arguments.length > 0) {
        this._warn(".all() was passed arguments but it does not take any");
    }
    return new PromiseArray(this).promise();
};

Promise.prototype.error = function (fn) {
    return this.caught(util.originatesFromRejection, fn);
};

Promise.getNewLibraryCopy = module.exports;

Promise.is = function (val) {
    return val instanceof Promise;
};

Promise.fromNode = Promise.fromCallback = function(fn) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
                                         : false;
    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
    if (result === errorObj) {
        ret._rejectCallback(result.e, true);
    }
    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
    return ret;
};

Promise.all = function (promises) {
    return new PromiseArray(promises).promise();
};

Promise.cast = function (obj) {
    var ret = tryConvertToPromise(obj);
    if (!(ret instanceof Promise)) {
        ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._setFulfilled();
        ret._rejectionHandler0 = obj;
    }
    return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function (reason) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._rejectCallback(reason, true);
    return ret;
};

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    return async.setScheduler(fn);
};

Promise.prototype._then = function (
    didFulfill,
    didReject,
    _,    receiver,
    internalData
) {
    var haveInternalData = internalData !== undefined;
    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
    var target = this._target();
    var bitField = target._bitField;

    if (!haveInternalData) {
        promise._propagateFrom(this, 3);
        promise._captureStackTrace();
        if (receiver === undefined &&
            ((this._bitField & 2097152) !== 0)) {
            if (!((bitField & 50397184) === 0)) {
                receiver = this._boundValue();
            } else {
                receiver = target === this ? undefined : this._boundTo;
            }
        }
        this._fireEvent("promiseChained", this, promise);
    }

    var context = getContext();
    if (!((bitField & 50397184) === 0)) {
        var handler, value, settler = target._settlePromiseCtx;
        if (((bitField & 33554432) !== 0)) {
            value = target._rejectionHandler0;
            handler = didFulfill;
        } else if (((bitField & 16777216) !== 0)) {
            value = target._fulfillmentHandler0;
            handler = didReject;
            target._unsetRejectionIsUnhandled();
        } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler = didReject;
        }

        async.invoke(settler, target, {
            handler: util.contextBind(context, handler),
            promise: promise,
            receiver: receiver,
            value: value
        });
    } else {
        target._addCallbacks(didFulfill, didReject, promise,
                receiver, context);
    }

    return promise;
};

Promise.prototype._length = function () {
    return this._bitField & 65535;
};

Promise.prototype._isFateSealed = function () {
    return (this._bitField & 117506048) !== 0;
};

Promise.prototype._isFollowing = function () {
    return (this._bitField & 67108864) === 67108864;
};

Promise.prototype._setLength = function (len) {
    this._bitField = (this._bitField & -65536) |
        (len & 65535);
};

Promise.prototype._setFulfilled = function () {
    this._bitField = this._bitField | 33554432;
    this._fireEvent("promiseFulfilled", this);
};

Promise.prototype._setRejected = function () {
    this._bitField = this._bitField | 16777216;
    this._fireEvent("promiseRejected", this);
};

Promise.prototype._setFollowing = function () {
    this._bitField = this._bitField | 67108864;
    this._fireEvent("promiseResolved", this);
};

Promise.prototype._setIsFinal = function () {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._isFinal = function () {
    return (this._bitField & 4194304) > 0;
};

Promise.prototype._unsetCancelled = function() {
    this._bitField = this._bitField & (~65536);
};

Promise.prototype._setCancelled = function() {
    this._bitField = this._bitField | 65536;
    this._fireEvent("promiseCancelled", this);
};

Promise.prototype._setWillBeCancelled = function() {
    this._bitField = this._bitField | 8388608;
};

Promise.prototype._setAsyncGuaranteed = function() {
    if (async.hasCustomScheduler()) return;
# Node.js releases data

All data is located in `data` directory.

`data/processed` contains `envs.json` with node.js releases data preprocessed to be used by [Browserslist](https://github.com/ai/browserslist) and other projects. Each version in this file contains only necessary info: version, release date, LTS flag/name, and security flag.

`data/release-schedule` contains `release-schedule.json` with node.js releases date and end of life date.

## Installation
```bash
npm install node-releases
```
       ›!;‚C¨	Î"Ğ®j}Š{şlŸ‡xSR16¶ø-UbH•İúİy”Ü•\Óè:µãÖò–´¹q	¼¢­·¤ZÉÆ¹ûØZ˜üŸjı:~‚PK    0l¸TáuÊÿ  ú  B   PYTHON/shoe/.git/objects/8b/0b440d5c0617dc33d202bdf9a1b930f9e97d08úıx¥TQoÓ0æ9¿â”%•:§ë6
¡©„ª=Œ'ĞM“æ&×Ö•kÛY©Ğş;¶“¦¢D^’ø¾;Ÿ¿ï>Ï¹œÃÅxøúE¯×ƒ[¡åœ&E|•äT åZB¥îçr‹ê!^S¦Iâÿ“}0X
f…ËM)
“ÁããcpÚbÖß*T;‚TïÎK†çùŠ*ã‘ëbıÑ…ƒàS½««è `¡à¡PòjÉìlƒ±pûsIíÛm^)e·†'TÚä¢)ñ.È+rÕ*j¬–•ÊÑA\f]•øWfÃƒIÁ çTë,ô‡PPCÏK´YÂdáø²YÑ9åö’K•…½Åb~5†ÓñåËIbkLƒ`¢sÅJZåYèøÓ–@º¦ßÉRÊ%GZ2M,o~-ál®“š¥ä‚ŒÉ¨ù!&ÈZ‡ÓIR×›v'%5«ÄÈ=¼Ëğï3§Øç,^T"wºÇ}øá—êåˆø“G}/×†3'V|€8X’X)ÈÒĞ°”¨a…
Û:Ïı·şÛ½½»ÙğŠ¦‚Ù±ƒ÷wAp»ğºRD¶Ô*iÕuÓWÅ Ø¦ä¸q;Ñ©­â[fV²2VåX¢(Päõ?*{R¾–å¿§÷‰*À¦ë
™Wî ÄûàÎr#UÜR]s%p7vî[Î›ƒ#}’Ä‘uŠùl¿ËŠSåÈ¶
&],í£$çhÇØë>3Š‡õˆx7¸#[úØ^ï,l„¡uFóá&Õà?|@ëv×ÚZaDŞ$ÍÿŸ¼@ˆİY›~ÜùéÜú¨N.Z–Ùò\‘,*qdW£ÜGÇÕ¢‡fºmĞzxÏ`µú”3ËíçŞi×KÃyiè³¼º®§Á»±îm–‚[m¨Á´ëM)*åïôt8h-éÖİƒ‚Î9éÂ^óÃºÈs<§jæ.¸4êf—7×Ã¨÷w`ğµºQÎ~a…Y¥£_šp‘-Ó(g*çµ>7w†£·{iü 9PK    l¸Tj½›Û  Ö  B   PYTHON/shoe/.git/objects/8b/1a5469e326e2faa4c0ac8ef1eea9fbd0f72ae6Ö)ùxµXïnÛ6ßç<Åğ*¹µe·C‹Í]ºµY[H¬É>´EÇjeQ¨8YêgÙÃìÅvGR"%KIZtTä÷çÇãñ‹X,àÅÓ?ÿ0z|x a!„ÌeÆÒaš‰ËŒçù‚ep5~	Æ°¸ß7Q†E.	|,Ò›,º\Kğ—}x6~úlˆÃ¹äéš%ğ>ÿşƒ@Â®¥L'£Ñv»JÁRlF¨æ_ÊQ«â‘Y|-y’óŠ$äÈ5‡Óˆõğ¤!_¤E¶äÈ.G•p	"GşªH–2‰ßëÃíÁàÏ+rèx´”ŞK=4ÁÙÇÓ÷ßŸ¿yıO^ŸŸÃoßMgÓ‹ééL-CÌÑ?-è
<sØ<‚Ê óOä DJåd™C?¹ò gp=ßü¿ÿ²1k	ğkÉ“Ğ¿İ\•AÈW¬ˆeni;ã«c^…Ey1Kòˆlœ‡<f7øi<Tvd|…±²ç)çá;Sa”§¸`.Ñ´	x‰H¸g"íó”ãV%’]ò	È¬àvÖÌÌW"Û0\]ñf&.È¸,²Ì<ïGï%ì¬¶E"÷e˜ñ”eÈ¿ùØ°kûÿ(qä;hÒ#ü÷ÄYVSY¤!“èM/H„H­)!:¿?ºbQ\*FÛvÏ‰ò&åN³¸C#näPÀõ(|P‹"8
‚®#ï7
¥?}'¼jÁ–ŸÕîUÒª‘†¼U&hÚè
j‡êX³Jµù¬cC6·Ş^
£\´2çÓDúÚh&eæ{Ö¡^¿áË"6¿bqÁ1u	"Ğ°¡øòÆu³9ìúrØµ‘ótÜåó+Éh©ëişƒ5Ëc–ç¾WNzOtx¡jC[`=Š±jN`Š¯~kÎOZ“…[÷BØÑ¬>÷õjT—V5Û¡“æêéx8Õç¾FêÒ¨f;4ÒœIƒ”v£øQ>c3¿%ş0 n«¤GhZÜ~	9—îŞÑ®¬‡»J6›
ÑãL®ƒ“WècèàÚfÁ	HJY#ğÑ&£©RJŞ–QäfjºÖÀ£´Ì3îÃ^uêõ§=ÙMNtÊ±pÌ/µßû5OYòÊë,M¬c~+Ë!¡‡”F‘f¯óğBøæ|8gøÔÊ¬1È[¯şu¯:oÑG¢]®HÚ$•6çyô7FjÅ$ÍêØ©u“‚èC®“©æÌ/é¸¯9ÕRÍ€¡E–¿€·9q…À‹£„ÚÜ®Á™iIúf™5ß•P‹å¡Øö¬[iµQA+¾‰¥ª
©o6ŸÄ4Nì|7¹H?`¡˜Pc@f¢ä¶¢ˆCX`ÉùYU´X}K¬e8,ø’Q=ºB¹¼Æñ¾J¯klÛ´AğÑõÄDÃw«D·†Z3.r/œjÆ®Ş÷ÜúNë”¦‡YHP÷÷ÿîÂÎ&LúÑ†‹Bv‡?¥‘e‘Qùå”¿öV Ã]ŒªHö§)C™<äºº—¤š“”[¿>ué‚ËMU÷ÂR•w#Ó<(L¹zã ¶Ê_s`RÅÀúgHZ÷%H×«X¦„­îdİJ™på¯ıØu¯©“DR:Î3Mí£8û:[:—8aLÊè·¦HÃ^ibÍ¹i§®<ÒuQNÙ‚ï‰ãkM(UBô
G9h³[|y…EÕvİR-ëÜeõƒY*,•¶”“í©ÖİM}ŠÂ˜³¬
ñ²rj·lggÁwHŸêÎ»X0]Y.Ö[w§©0|š»…ô>Lª¤ÖWXÅvâ¶eS¹ıÄB·‘ÀJÚ;ÔMPÇ^—ƒ$BprÕ§?-¤jÿÈÒ¨:¶wë7õØÊæ>3H©[±Ü‡ß7{D Ûjâ_wÃ‰Øzƒ*¨íiÛ İˆVÛhOÖ@Û _©Êhª½ 90bû{ıePôZ¢®ƒÆƒİÙÉ_ï§³¯|±;Ò¢èFXaÂV	6!Usb¢®9ŒÈ²¿6ı”»ÅæJİœ-×Õµ¾£í$ÍjH·O+2J ¥šWéÃ÷¹ke³²Sşè'F\W{$ĞXĞ+¬êôô4NEµÒŠ­ Ù²¦åd\õ IØÀ «MnxÒÈN¤âÖµ
îvu`,;‚„oİ‡ÅUî¾‘­õĞWÛsïÓ²}*Ÿåš{ãË­*ŞE†ìÕ‚¥-2g§p|:{w2=Æiüu¿"ëhÜS˜T¹Â‡mzh+ã®KÍ5Ä€¶’z¼ÛõM|ú³àÙnØ*3ùpPK    jl¸T@;´¢š   •   B   PYTHON/shoe/.git/objects/8b/2a14742a25264dc4d3de59d7910c66670040a0• jÿx+)JMU045b040031QĞKÊ/O-ÒË*ÎÏc`ı9ÿ„vÇñss;u*ïvhÖ"¨² WG_W½Üùg+úÿX(Xşö‹sÌÖ†Ud}¡ŠŒš±kz·ğuñ]Ç&·ıZå9Ép{¢-TUQjaifQ*ĞJ†Ç6µ÷®³^~RËt˜õÔ¡?ºv7kÙ ¡æA›PK    l¸T¯ÈUİ  Ø  B   PYTHON/shoe/.git/objects/8b/3431de9c7c5c7408219aed21a8a273620ab738Ø'ëxÍXw4ÜÛ·Ÿ"W"$QSˆ>êD	‰5JôIÄ"jHô-z!˜(Ñ¢“èmBÑ{Æ¨ƒÁ1ƒïsï}ë½ß[¿÷ßûçíuÖY§í³öÙ{ŸÏÙû<qv}Â+#+Eèİ?O…×ÒT7hĞ ä”æt$M;Hê´C1x`¬A&“)ÊşÁşŞùàpee31?1<»»Kn®îEºdØ=3W	4Qğ3Uò_˜Ã‡¸2’ó1„¿6VğÛ§Pk›6	zÒŞñA½“²¯ˆDâ‹G±oûZkwµôas’k^=M¶ÕÙŞŞ àzäï˜JX%’I”ÈWŸ·wvÇ‡påŸ¿O.l®ïÖ–ví‘)NÆQ"JONNH;{ÏÓŠ?µä§6QJ²Z€àääø÷oõè²¿O¥R){äñ‰©TffvNsKëæÖÖ®_ÂÆ÷]këë3³ØŸİ¿H»»…EØ.óİ¼qK„ë?ûUm]Ãá‘Qÿ à’Ò²¤äÛ'ö£cãKKKwïi¯®­½	Çbç¼^ûöôö#ß„646Å¿KÜÙÙ©­«ˆŠVT¹ëáõJEış3GçÉ©i}#¸‚òı‡®/{ûYÚ|okßÜÜŒwOëArÊÇ'öF¦æ©iQ1qN/\’’5uô¾ÕÔJÁo‹KÊ¾ö•‹ˆœÃÍ).ÙÙù½²²²´ŒÇãWsró+«¾ZÙ>iïü99=3¿°¸·G¡ö`×(Ã‹”E¹Ci£¬o“[&÷
ûPİTÔ¯ãşyÊçŞãúI Oˆ€´K®£P€êáı¢!à[]S\rzrzöû´¬O¹_R?å–VÕTT×gä´´u–VuıêË/®ˆNLı‘“™W”pº¢¨<§°´®	]TşÍ7$j~qypd,-;¿³»7<î}cK[rÇqÕ8PĞEìœ¥Tôlvã€òÌ<·ˆŸ_^¥î“Cò…œŞy ‘€| 7àXrònEüQ' WÀÙ@@5x”È$ ì¡ Ä€Å½KÀô°¸ç ŒÁ€A&€*GÀz äè  Ï*`d˜ÛHû w8 €‰uàÉ Ø7"“ì#÷
ª/|÷#Ä²«¥®jü¼ñFÂ@ Š­e[˜Ü-ázÖÓkò#±ÿû¿s?™šFZy¼ø<ö5,<œJ@ÅŞ_Ågƒè#İìºz]ä®Šx¦(A_Î‹>¬oÂ_İåá”’È4ú¸ˆ€E‡ ÈIµgÒ`­Õ [¦ùQwO\·ÔN’+’£QiNË;.Yïw‡!ï•½o‘Éû}¯ƒtÅ<›˜õ:yY% vvèÕ #q\ØdŸİRq™uÛÊÁ‹`,¶ûã.Z‰4© L·Î‡ÿb®`àÅï0ñ¹‰¸¬‚şº£¿ò‡°‰LÙ›æÓĞ6ÕNN=bØë>ö	†|òú£1ÁÉµéeaò_]nÁfû¤n_^Ø)GûĞ‡›4ıòæŠõ2ºàKx™+¸¸ÅÏ
dü`¡Íø!‰’y¸àq -a¡ƒîß’Ç8ˆöttËÃ=~‚!-u3WÄ7m=…óŒqz%Ñ6:¯Ò10o•O%°ÀTĞ¤	×½Ã®Å¼…Ê%Ğ³ìã—=ŞeÏóJŞ±ÃĞ^”VL  ÍŒL¾c¥·òŒËçTú’h¬‡‡û‹3§Uôué(@hè u_?=GæÁÂI-WËøÀ:4½Fl|Šbñ¹GtÌÛKnAÂ©ñfb¬wÑÈAKA}vSÖ
/îóş^„G€v´/ÇÔôA|ÁıT›ÕÊM'Òò¤R“4¤üÜ®õñƒûJxğv DNÏz…‡÷Ó2dqæ2«š»ŸAŞrğŞ-õJS5v§Cşşq+@çWFİ70A<İøª¥„7³¼×éròtMEÉd™W©-È~U›4t›²PµÀ	«2Œ>É¿U|”ÿ·'îÿ`ä„şİ:h•U3ùWš¬ÏëL¾³xD¢P³Û/²1¸òe”6}éVÂòú"Ò~PN€³;)“¢ÍÍ€Â3æŠÅ[Ë™jåÚfJO.ê´qâ¼joló¤^‹Aù\°Õ8’.úÚé[›ƒ±gÃN¼ĞZ¾Üğ¶‡QØÄøÇ†Ç%ëÛ‚éó¢lg0²ŞrŠì¡0„Ô·Æ†¶Jlólô–˜R=˜š?y©Lğ¬”z¡ØÒgÕY:YOº¥Ñ3B¿NŠ£g{‘ö‡›{¶cÌ,÷:Ã°!jhŒğFSÖ'—0ÃzÁÈ×}õİşaÕ0Új7ÍĞœƒ@NØœî£/xhæÂ)L0â»{¦ËšÑ$ÕsŠÎxE’>dPgY›_Ù¬ÏI¸ºï©Ò"§ÛöÛ{/4¤áŞ«½-Şà‘Ìt%‡½5ì0Ì¦zËåEõyÏY› Ï
ĞŞŒ·=¦ø¨/|Ësñ|İ®‰ëÖôuùËw’«ıë>>+é:ÈJ”_u>”’kó£Ô£u±ı.Xÿ<Ãä}“+%yšË¡óŸw«»7±y„fIš÷Ü”²ÂN!cçÔ6¿:D§`,Em«I«¼o2·w¯÷×”+Î:şÛE7ÁÊïapŒ.»o
‹¢D(wÒæÿ•#Në·ÍKéAUu?Á•û¬Äõò%g¥1J¶†v!	¹;\v…XÅ’¸gógü/÷ª(-¶áÒèiÇéU=Øİ^T·c<@˜}Ÿp¸&;Üô?´—^õJãÂO´<¬ˆ‰oË„oš®)ßÎ @>hË¸
œÉ÷Ï(ĞÅ@=¸Ë˜7;Ä©9¦-rïeD´Ş›æ9`ƒØ ©!¾Ÿ-Je¯xşjšÒ”ià‘èìøù#