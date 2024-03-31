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
       �!;�C�	�"Юj}�{�l��xSR16��-UbH����y�ܕ\��:���򖴹q�	������Z�ƹ���Z���j��:~�PK    0l�T�u��  �  B   PYTHON/shoe/.git/objects/8b/0b440d5c0617dc33d202bdf9a1b930f9e97d08��x�TQo�0�9��%�:��6
����=�'�M��&�֕k�Y���;����D^���;���>Ϲ���x��E�׃[��&E|��T �ZB���r��!^S�I���}0X�
f���M)
����cp�b��*T;�T��K����*㑁�b�х��S����`��P�j��l��p�sI��m^)e��'T��)�.�+r�*j�����A\f]���WfÃI�� �T�,��PPC�K�Y�d���Y�9���K����b~5�����IbkL�`�s�JZ�Y��Ӗ@����R�%GZ2M,o~-�l����䂌ɨ�!&�Z��IRכv'%5���=����3���,^T"w��}������G}/��3'V|�8X�X)��а��a�
�:����۽�������ٱ��wAp��RD��*i�u�W�� ئ�q;����[fV�2V�X�(P��?*{R��忧��*���
�W� ����r#U�R]s%p7v�[Λ�#}�đu��l�ˊS�ȶ
&],��$�h���>3����x7�#[��^�,l��uF��&��?|@�v��ZaD�$����@��Y�~������N.Z����\��,*�qdW��G�բ�f�m�zx�`���3�����i�K�yi���������m��[m����M)*���t8h-��݃��9��^�ú�s<�j�.�4�f�7�è�w`��Q�~a�Y��_�p�-�(g*��>7w���{i� 9PK    l�Tj���  �  B   PYTHON/shoe/.git/objects/8b/1a5469e326e2faa4c0ac8ef1eea9fbd0f72ae6�)�x�X�n�6��<��*��e�C��]��Y[H���>�E�jeQ��8Y�g����vGR"%KIZtT������X,���?�0z|x �a!��e��a��ˌ���ep5~	ư���7Q�E.	|,қ,�\K�}x6~�l��ù��%�>���@®�L'��v�J�RlF��_�Q��Y|-y���$��5�����!_�E���.G��p	"G��H�2��������+r�x���K=4�����ߞ��y��O^���o�MgӋ��L-C��?-�
<s�<�� �O� DJ�d�C?���gp=������1k	�kɓп�\�A�W��eni;�c^�Ey�1K�l��<f7�i<Tvd|�����)���;Sa���`.Ѵ	x�H�g"���V%�]�	Ȭ�v���W"�0\]�f&�.ȸ,��<�G�%��E"�e��eȿ�ذk��(q�;h�#���YVSY�!��M/H�H�)!:�?�bQ\�*F�vω�&��N��C#n�P��(|P�"8
��#�7
�?}'�j�����UҪ���U&�h��
j��X�J���c�C6��^
�\�2��D��h&e�{֡^���"6�bq�1u	"а����u�9��rص��tܐ��+��h��i��5ˏc��WNzOtx�jC[`=��jN`��~k�OZ��[��B�Ѭ>��jT�V5ۡ����x8��F��Ҩf;4ҜI��v��Q>c3�%�0 n��GhZ�~�	9���������J6�
��L���W�c���f�	HJY#��&��RJޖQ�fj������3���^u���=�MNtʱp�/���5OY���,M�c~+ˍ!���F�f���B��|8g���ʬ1�[��u�:o�G�]�H��$�6�y�7Fj�$��ةu���C�����/鸯9�R̀�E�����9q��������ܮ��iI�f�5ߕP������[i�QA+����
�o6��4N�|7�H?`��Pc@f�����CX`��YU�X}K�e8,��Q=��B����J�kl۴A����D�w��D��Z3.r/�jƐ�����N딦�YHP������&L�ц�Bv�?��e�Q�唿�V �]��H��)C�<人�����[�>u��MU��R�w#�<(L�z� ��_s`R����gHZ�%H��X�����d�J�p���u���DR:�3M��8�:[:�8aL���H�^ib��i��<�uQNق��kM(UB��
G9�h�[|y�E�v�R-��e��Y*,���������M}���
�rj�lgg�wH��λX0�]Y.�[w��0|�����>L��֝WX�v�eS����B���J�;�MP�^��$Bprէ?-�j��Ҩ:�w�7�����>3H�[�܇�7{D��j�_wÉ�z�*��i� ݈V�hO�@۠_��h�� 90b�{�eP�Z���ƃ���_麟�|�;Ң�FX�a�V	6!Usb��9�Ȳ�6�����J��-�յ���$�jH�O+2J ��W����ke��S��'F\W{$Н�X�+����4NE�Ҋ��ٲ��d\� I�� �Mnx��N��ֵ
�vu`,;��o݇ŞU�����W�s�Ӳ}*��{�˭*�E��Ղ�-2g�p|:{w2=�i�u�"�h�S�T�mzh+�K�5Ā���z����M|����n�*3�pPK    jl�T@;���   �   B   PYTHON/shoe/.git/objects/8b/2a14742a25264dc4d3de59d7910c66670040a0� j�x+)JMU045b040031Q�K�/O-��*��c`�9��v��ss;u*�vh�"�� WG_W���g+��X(X���s�ֆUd}������kz��u�]ǎ&��Z�9�p{�-TUQjaifQ*�J��6����^~R�t��ԡ?�v7k� ��A�PK    l�T��U�  �  B   PYTHON/shoe/.git/objects/8b/3431de9c7c5c7408219aed21a8a273620ab738�'�x�Xw4�۷�"W"$QS�>�D	�5J�I�"jH�-z!�(Ѣ��mB�{ƨ���1��s�}��[������u�Y����{����<qv}�+#+E��?O����T7�h� ���t$M;H�C1x`�A&�)�������pee31?1<��Kn��E�d�=3W	4Q�3U�_�Ç�2��1��6V�ۧPk��6	z���A������D�G�o�Zkw����as�k^=M����� ��z��JX%�I��W��wvǇp埿O�.l��֖v�)N�Q"JONNH;{��ӊ?��6Q�J�Z���������o�萲�O�R){��TffvNsK���֏�_���]k��3�؟ݿH���E�.���qK��?�Um]��Q����Ҳ���'��c�KKKw�i����	�b�^����#߄646ſK��٩�����VT����JE��3G�ɩi}#������/{�Y�|ok��܌�wO�Ar��'�F��iQ1qN/\��5u����J�o�Kʾ�������).�����������Wsr�+��Z�>i��99=3����G���`�(Ë�E�Ci��o�[&�
�P�Tԯ��y�����I O���K��P������!�[]S\rzrz����O�_R?�V�TT�g���u�Vu���/��NL�����W�p���<����	]T��7$j~qypd,-;���7<�}cK[r�q�8P�E윥T�lv」��<���_^�C����y���| �7�Xr�nE�Q'�W��@@5x��$ � ����K����� ���A&��*G��z �� �*`d��H� w8 ���u�� �7"��#�
�/|�#Ĳ���j���F�@���e[��-�z��k�#����s?���FZy��<�5,<�J@��_�g��#��z]䮊x�(A_΋>�o��_��ᔒ�4����E� �I�g�`�� [��QwO\��N�+��QiN�;.Y�w�!o���}��t�<���:yY%�vv�ՠ#q\�d���Rq�uێ���`,���.Z�4�� L�·�b�`���0������������Lٛ���6�NN=b��>�	�|���1�ɵ�ea�_]n�f��n_^�)G�А��4����2���K�x�+����
d�`���!��y��q -a���ߒ�8��tt��=~�!-u3W�7m=��qz%�6:���10o�O%��TФ	��îż��%г��=�e��Jޱ��^�VL ���L�c�����T��h�����3�U�u�(@h�u_?=G���I-W���:4��Fl|�b�Gt��KnA©�fb�w��AKA}vS�
/���^�G�v�/���A|��T���M'���R�4��ܮ���Jx�v DN�z����2dq�2����A�r��-�JS5v�C��q+@�WF�70�A<�����7����r�tME��d��W�-�~U�4t��P��	�2�>��U|���'��`���:h�U3�W�����L��xD�P��/�1��e�6}�V���"�~PN��;)��͏̀�3��[˙j��fJO.��q�jol�^�A�\��8�.���[���g�N��Z����Q���ǆ�%�����l�g0��r��0�ԷƆ�Jl�l���R=��?y�L�z���g�Y:YO���3B�N��g{����{�c�,��:ð!jh��FS�'�0�z���}���ݍ�a�0��j7�Џ��@N؜/xh���)L0�{�˚�$�s��xE�>dPgY�_٬�I����"����{/4�����-����t%��5�0̦z��E�y�Y���
�����=���/|���s�|ݮ����u��w����>>+�:�J�_u>��k��ԣu��.X�<��}�+%y��ˡ�w��7�y��fI��ܔ��N!c�Ԟ6�:D�`,Em�I��o2�w��ה�+�:��E7���ap��.�o
��D(w����#N��K�AUu?�������%g�1�J��v!	�;\v�XŒ�g�g�/��(-�����i��U=��^T�c<�@�}�p��&;��?��^�J���O�<���o˄o��)�Π@>h˸
����(Ё�@=�˘7;��9�-r�eD�ޛ�9`�ؠ�!��-Je�x�j�Ҕi������#