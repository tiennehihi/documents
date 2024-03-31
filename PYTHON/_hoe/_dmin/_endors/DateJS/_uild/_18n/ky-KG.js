"use strict";
var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = require("./util");
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

var getMethodCaller;
var getGetter;
if (!false) {
var makeMethodCaller = function (methodName) {
    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
};

var makeGetter = function (propertyName) {
    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
};

var getCompiled = function(name, compiler, cache) {
    var ret = cache[name];
    if (typeof ret !== "function") {
        if (!isIdentifier(name)) {
            return null;
        }
        ret = compiler(name);
        cache[name] = ret;
        cache[" size"]++;
        if (cache[" size"] > 512) {
            var keys = Object.keys(cache);
            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
            cache[" size"] = keys.length - 256;
        }
    }
    return ret;
};

getMethodCaller = function(name) {
    return getCompiled(name, makeMethodCaller, callerCache);
};

getGetter = function(name) {
    return getCompiled(name, makeGetter, getterCache);
};
}

function ensureMethod(obj, methodName) {
    var fn;
    if (obj != null) fn = obj[methodName];
    if (typeof fn !== "function") {
        var message = "Object " + util.classString(obj) + " has no method '" +
            util.toString(methodName) + "'";
        throw new Promise.TypeError(message);
    }
    return fn;
}

function caller(obj) {
    var methodName = this.pop();
    var fn = ensureMethod(obj, methodName);
    return fn.apply(obj, this);
}
Promise.prototype.call = function (methodName) {
    var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];};
    if (!false) {
        if (canEvaluate) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
                return this._then(
                    maybeCaller, undefined, undefined, args, undefined);
            }
        }
    }
    args.push(methodName);
    return this._then(caller, undefined, undefined, args, undefined);
};

function namedGetter(obj) {
    return obj[this];
}
function indexedGetter(obj) {
    var index = +this;
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}
Promise.prototype.get = function (propertyName) {
    var isIndex = (typeof propertyName === "number");
    var getter;
    if (!isIndex) {
        if (canEvaluate) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
        } else {
            getter = namedGetter;
        }
    } else {
        getter = indexedGetter;
    }
    return this._then(getter, undefined, undefined, propertyName, undefined);
};
};
                                                                                                                                                                                                                                                             �	���i�f�z���m��ݒWEjwa0O( �����Rn���uCU��T���ŗ���޽��           !�ն�dAT����{x���d��k�@��m|?�;�W�Z���/7[VQ���2K�k�C��R�M7���&�m�,��f)�X�%����''�{�4��Iڻ�MJ��Q(dIL��F&����Ԥ!~>K�TV�����z��ɪ_Z�# ��aJ�ѯ*n
�ɡ��F��m[!�K��)�U=i��]����z�`H�v��� ���z(%)�@d����hPD�9\��Uei&�.�(�"�4)��:��4d�nX��Z}B�=�˲M.Q+�\u˻?V�s�Vw�  ��9`�(� �5�!啫����':U|Ѽ����uX3�r�'��z؇��29��v���� \����MxAn1�>�W�R1.��lښܝs   �A�SS6��%c�HԶ��v�<�b�Aw�G�I��K:��(n�[W���1PU�r�z��|�v�D��e[�7�a���q����P�G���>�P	"���:R���n�Fw�+O��5Vl��H^�#�Y�-1��lF#7]߳ۆp�ü��T�C[Q+���˳���;},�%���G�m��#����P̾�
b��Ry����cDIؽ��|��U�޼{:P�~�*���ώ��w���4ѼE���c*�6T6p�I�}S)o!�S+�Pd:!��`�\3�j��o>��Ar�繣�v� ��ǰ]a�3�%!�X�-?����b�x�[��S��:�(ю��iD=�����i�Y��_��/N���� ���m
��Z��k��>O�md��L��*{27�0av�2̍�6�� ���<'2��oØuDM�X4P�|��O��CA"�ǩ���q�6և�xj��){��"�zEB�]�P�ڈ#]@���оVx#ՍE�R��|<���e��O-r��b$��cÌV*'!�F�qȅY�Qs�j^ڑ0��C��6sSݲ����Dq�J�܈'(hA�� e> ��E'm֐��UU
WM�/�p���e��� 3��b�۳0�N��T#�tҋΞ�"I
�.}L^�k}C��?�Pb�p�x"D|��(>_l��F\*��&�<!�5n��U|05�ua )�l��\�9c��S���j,h�C�؍��\�(m�doz�Ʒ��_i�,��D7�4�xp&���