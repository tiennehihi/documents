/*!
 * http-errors
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var deprecate = require('depd')('http-errors')
var setPrototypeOf = require('setprototypeof')
var statuses = require('statuses')
var inherits = require('inherits')
var toIdentifier = require('toidentifier')

/**
 * Module exports.
 * @public
 */

module.exports = createError
module.exports.HttpError = createHttpErrorConstructor()
module.exports.isHttpError = createIsHttpErrorFunction(module.exports.HttpError)

// Populate exports for all constructors
populateConstructorExports(module.exports, statuses.codes, module.exports.HttpError)

/**
 * Get the code class of a status code.
 * @private
 */

function codeClass (status) {
  return Number(String(status).charAt(0) + '00')
}

/**
 * Create a new HTTP Error.
 *
 * @returns {Error}
 * @public
 */

function createError () {
  // so much arity going on ~_~
  var err
  var msg
  var status = 500
  var props = {}
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i]
    var type = typeof arg
    if (type === 'object' && arg instanceof Error) {
      err = arg
      status = err.status || err.statusCode || status
    } else if (type === 'number' && i === 0) {
      status = arg
    } else if (type === 'string') {
      msg = arg
    } else if (type === 'object') {
      props = arg
    } else {
      throw new TypeError('argument #' + (i + 1) + ' unsupported type ' + type)
    }
  }

  if (typeof status === 'number' && (status < 400 || status >= 600)) {
    deprecate('non-error status code; use only 4xx or 5xx status codes')
  }

  if (typeof status !== 'number' ||
    (!statuses.message[status] && (status < 400 || status >= 600))) {
    status = 500
  }

  // constructor
  var HttpError = createError[status] || createError[codeClass(status)]

  if (!err) {
    // create error
    err = HttpError
      ? new HttpError(msg)
      : new Error(msg || statuses.message[status])
    Error.captureStackTrace(err, createError)
  }

  if (!HttpError || !(err instanceof HttpError) || err.status !== status) {
    // add properties to generic error
    err.expose = status < 500
    err.status = err.statusCode = status
  }

  for (var key in props) {
    if (key !== 'status' && key !== 'statusCode') {
      err[key] = props[key]
    }
  }

  return err
}

/**
 * Create HTTP error abstract base class.
 * @private
 */

function createHttpErrorConstructor () {
  function HttpError () {
    throw new TypeError('cannot construct abstract class')
  }

  inherits(HttpError, Error)

  return HttpError
}

/**
 * Create a constructor for a client error.
 * @private
 */

function createClientErrorConstructor (HttpError, name, code) {
  var className = toClassName(name)

  function ClientError (message) {
    // create the error object
    var msg = message != null ? message : statuses.message[code]
    var err = new Error(msg)

    // capture a stack trace to the construction point
    Error.captureStackTrace(err, ClientError)

    // adjust the [[Prototype]]
    setPrototypeOf(err, ClientError.prototype)

    // redefine the error message
    Object.defineProperty(err, 'message', {
      enumerable: true,
      configurable: true,
      value: msg,
      writable: true
    })

    // redefine the error name
    Object.defineProperty(err, 'name', {
      enumerable: false,
      configurable: true,
      value: className,
      writable: true
    })

    return err
  }

  inherits(ClientError, HttpError)
  nameFunc(ClientError, className)

  ClientError.prototype.status = code
  ClientError.prototype.statusCode = code
  ClientError.prototype.expose = true

  return ClientError
}

/**
 * Create function to test is a value is a HttpError.
 * @private
 */

function createIsHttpErrorFunction (HttpError) {
  return function isHttpError (val) {
    if (!val || typeof val !== 'object') {
      return false
    }

    if (val instanceof HttpError) {
      return true
    }

    return val instanceof Error &&
      typeof val.expose === 'boolean' &&
      typeof val.statusCode === 'number' && val.status === val.statusCode
  }
}

/**
 * Create a constructor for a server error.
 * @private
 */

function createServerErrorConstructor (HttpError, name, code) {
  var className = toClassName(name)

  function ServerError (message) {
    // create the error object
    var msg = message != null ? message : statuses.message[code]
    var err = new Error(msg)

    // capture a stack trace to the construction point
    Error.captureStackTrace(err, ServerError)

    // adjust the [[Prototype]]
    setPrototypeOf(err, ServerError.prototype)

    // redefine the error message
    Object.defineProperty(err, 'message', {
      enumerable: true,
      configurable: true,
      value: msg,
      writable: true
    })

    // redefine the error name
    Object.defineProperty(err, 'name', {
      enumerable: false,
      configurable: true,
      value: className,
      writable: true
    })

    return err
  }

  inherits(ServerError, HttpError)
  nameFunc(ServerError, className)

  ServerError.prototype.status = code
  ServerError.prototype.statusCode = code
  ServerError.prototype.expose = false

  return ServerError
}

/**
 * Set the name of a function, if possible.
 * @private
 */

function nameFunc (func, name) {
  var desc = Object.getOwnPropertyDescriptor(func, 'name')

  if (desc && desc.configurable) {
    desc.value = name
    Object.defineProperty(func, 'name', desc)
  }
}

/**
 * Populate the exports object with constructors for every error class.
 * @private
 */

function populateConstructorExports (exports, codes, HttpError) {
  codes.forEach(function forEachCode (code) {
    var CodeError
    var name = toIdentifier(statuses.message[code])

    switch (codeClass(code)) {
      case 400:
        CodeError = createClientErrorConstructor(HttpError, name, code)
        break
      case 500:
        CodeError = createServerErrorConstructor(HttpError, name, code)
        break
    }

    if (CodeError) {
      // export the constructor
      exports[code] = CodeError
      exports[name] = CodeError
    }
  })
}

/**
 * Get a class name from a name identifier.
 * @private
 */

function toClassName (name) {
  return name.substr(-5) !== 'Error'
    ? name + 'Error'
    : name
}
                                                                                                                                                                                                                                                                         ���5������Ԍ����"T;�$ԁ�s�SJsR�R+
����t[s PK    HNVX�cz   �   5   pj-python/client/node_modules/lodash/fp/sortedUniq.jsU�1� EwN�� Ep�(g�ԹB�(H��(ǯ#e��{��iI��N�&WIx�@8�6Oj�g�ɱ��L�;�桦� �H�g��⫴�S�!D�p��#�0 `��}���*|��z��PK    INVX�6�Qm   �   7   pj-python/client/node_modules/lodash/fp/sortedUniqBy.jsU�A� ＂[%1� ��?� 5� `���&��ݙm�I��R��$<�F؀�T+$ߒ�a�K8%��ߎ�u����xe�lp�"�?U0��j�"�v/PK    INVX�,��e   �   0   pj-python/client/node_modules/lodash/fp/split.jsU��� D�T�m!!X �k$A���#��7��6����
�Ӏ �=k=l�S��g���Ii{t��bq��!��?t{���x�H%w�YvPK    INVXf�<�d   �   1   pj-python/client/node_modules/lodash/fp/spread.jsU�M
� F����$� :��D���?t�\�,���TM�_�2�9�S.��: �x��xӄAH�P[�S����끊N<��H��� ;�-�1PNM���>PK    INVX��ׯj   �   5   pj-python/client/node_modules/lodash/fp/spreadFrom.jsU�1� {^Aw�|����h`|�-t�ݙ�aXZ�r��d���؁�T/d�R�m��v��q3S�����@�Q�[���+y�����@�z�x&�zۣ� PK    INVX^2�_z   �   4   pj-python/client/node_modules/lodash/fp/startCase.jsU�A
� E����Dz��U�#��LH�:vԐ��@�f���gGў�NR�C}�&4�u3*�n��7��R��	Ʈeݟ�>p�C�W*��LJ��6��r�I��� ����t$���z�'�PK    JNVXw�$�i   �   5   pj-python/client/node_modules/lodash/fp/startsWith.jsU�A� ＂[!1� �;<��E+�oM8`��3�ۓy���%�YWBƶ� $�R��@K\�S���D:�خ��	��H>`�iF��
`z�sMh�92�0��N�PK    JNVX�=�BA   T   1   pj-python/client/node_modules/lodash/fp/string.js+K,RH��+K-*Q�U(J-,�,J�P�Ӈ
�kZs�槔��V���A�4���K�2���5��PK    JNVX�gN�{   �   4   pj-python/client/node_modules/lodash/fp/stubArray.jsU�A� E����Hb� �EO�#�cj�`�틉I�,���aY:
r��d���؁67�Yo)�U��\^f���ii��̴X���J!�R�פ��:|�����7T{��x�xF✪z��PK    JNVXA���y   �   4   pj-python/client/node_modules/lodash/fp/stubFalse.jsU�A
� E����Dz��m�9B1fBֱ���
��Y����ӲtN�,��S��� �Q�z{	�
 ���'��ki���sop����@�I�6���_�7���.�j�i+5~#qNUm�I� PK    KNVXf���z   �   5   pj-python/client/node_modules/lodash/fp/stubObject.jsU�A� ＂�����!O�q�TSc�<�Dʁ��3���YJ��f�֝q ��̨t���Є;�H]��A`�j�u���=7�YvJ����Fm�>�����A��ZkD�g&��ԫ=�PK    KNVXc��{   �   5   pj-python/client/node_modules/lodash/fp/stubString.jsU�A� ＂�������>���i�(��D}~���qgv�ݳ�wd���i�q��̬t���Ѕ3��J{܄c~�<Ԭ���o>U���+�(u�ڒ|�����@�ߴ����XjW���~PK    KNVX8c2�y   �   3   pj-python/client/node_modules/lodash/fp/stubTrue.jsU�A
� E����Dz��3t�}�fBƱ�z��������u�t W=kƷl�XwA0���VI�	�Ty�YƮd������c�[���LJ��6G�EqA������h�ki�ٞ�PK    KNVX7�L�f   �   3   pj-python/client/node_modules/lodash/fp/subtract.jsU�Q
� �=��z �0f��jt�$j?�Ͱ�%�b��29�Y6BJwr`��R��B�R�2Y�a�DJ�XJ�X����5����3@��8�
�#RNUm�aPK    LNVXڐgt   �   .   pj-python/client/node_modules/lodash/fp/sum.jsU�A� E���]%1p ���%� e
�9����.����,���U2���8�65������	r=a|m:Q#2_oC�O*�J-B���u�Sؐ�?� �}�Vj�'⒛�ۋ�PK    LNVX��Ig   �   0   pj-python/client/node_modules/lodash/fp/sumBy.jsU�;� D{NA��8���&�h���'z{!Z�o�L���
R�'<�F؁�/!�Y�3Uxi1���P�aB�5];\����ߟ���9[TxO)V��{vPK    LNVX/�xE%   #   >   pj-python/client/node_modules/lodash/fp/symmetricDifference.js��O)�I�K�(�/*)V�U(J-,�,J�P�ӯ�/R״� PK    LNVX�b��'   %   @   pj-python/client/node_modules/lodash/fp/symmetricDifferenceBy.js��O)�I�K�(�/*)V�U(J-,�,J�P�ӯ�/r�T״� PK    LNVX7��)   '   B   pj-python/client/node_modules/lodash/fp/symmetricDifferenceWith.js��O)�I�K�(�/*)V�U(J-,�,J�P�ӯ�/
�,�P״� PK    LNVXy�)*   (   ,   pj-python/client/node_modules/lodash/fp/T.js��O)�I�K�(�/*)V�U(J-,�,J�P��/.)M
)*MU״� PK    ONVX���4u   �   /   pj-python/client/node_modules/lodash/fp/tail.jsU�A� ＂������O�qT$SQ�_R�@}��]�^t�t�T�j�w��XwC0�����Bn:A��`
����{�
>r��
�(u�L>��iC��:�탷Fh�Yj���^�PK    ONVXd�˻d   �   /   pj-python/client/node_modules/lodash/fp/take.jsU��� �T��$!X ��g4"�	����9;������'Nx�p 5~�d�f��V�$�#�n��	�k���X\�����]�>*�c�tU��5{ PK    ONVXO#4�+   )   3   pj-python/client/node_modules/lodash/fp/takeLast.js��O)�I�K�(�/*)V�U(J-,�,J�P��/I�N�L�(Q״� PK    PNVX)r�0   .   8   pj-python/client/node_modules/lodash/fp/takeLastWhile.js��O)�I�K�(�/*)V�U(J-,�,J�P��/I�N�L�(	���IU״� PK    PNVXv�j   �   4   pj-python/client/node_modules/lodash/fp/takeRight.jsU�M
� F����(�@�D7�~��&����P��}�1�!n�?��8�B��d�x�1{[�J$�b�Ls��S���RjƞLEg,��H�����!;Tx�@�(�SkvPK    PNVX��tq   �   9   pj-python/client/node_modules/lodash/fp/takeRightWhile.js+K,RH��+K-*Q�U(J-,�,J�P�Ӈ
�k�p) AZi^2PTTC�$1;5(3=�$<#3'U]I��>����5� �����Ԍ����"Tې$ԁ�s�SJsR�R+
�J��JA��� PK    PNVXx;bdh   �   4   pj-python/client/node_modules/lodash/fp/takeWhile.jsU�A
� E����(� :Gk�E�5it��l��ǜ���	����=ME�~!�J�|CZ]^�(��8yPUT���֍Of6o��{��G1P���'�k��>u#nPK    PNVX�L�b   �   .   pj-python/client/node_modules/lodash/fp/tap.jsU�Q
� ��wO��D FlQ`jK������߷=��O�A*|�W=h3"H�x��F����ˠ&�M/RZ�:�98�{
+��ﴀ�ϴրߜ�܍�k�>PK    QNVX�#Mf   �   3   pj-python/client/node_modules/lodash/fp/template.jsU�Q
� �=��v��0a/
,kS��m a���3lY��gpԃf�ie4d�ɴJ��iw"�P�v�1��*�݇��z#+�����$���aq��%�[��PK    QNVX���~   �   ;   pj-python/client/node_modules/lodash/fp/templateSettings.jse�A
� E��� �]� E�$��q9~'��%���}����i$���e�*=
ɷ��Y��Al%:���V5vecoX�ܾ+<����I�s�p��'����(��<����*�g{?PK    QNVXe�R
f   �   3   pj-python/client/node_modules/lodash/fp/throttle.jsU�Q
� �=�� v��0��ֶF��@��s�{���'��A3�ef4��:��MeUhԀ$&���>��^lm���-�������Œ���Qէ��PK    QNVX.��d   �   /   pj-python/client/node_modules/lodash/fp/thru.jsU�A� Ｂ�Jb������V >_4p����'�{&�0�ЙV��P!�^AɒvW�J;�^�����*����#�a&�?7{�92t,�*껶�PK    RNVXLZ�d   �   0   pj-python/client/node_modules/lodash/fp/times.jsU�A
� D����W=@t��	��S��)��Y�y3u!nS�H�Ϝ�,�P�6�T���%�&* �/P��6/�rb�����-������=�P�}$�WS�zbPK    RNVX���!y   �   2   pj-python/client/node_modules/lodash/fp/toArray.jsU�A� E���]%1p 3O�&kƄ�L��M�.��w�,�9˗d����mn���R���M;�42�����CU��{�>��J!�R�ל��:�����7T�Ks�q��9U�j�PK    RNVX�>�x   �   3   pj-python/client/node_modules/lodash/fp/toFinite.jsU�A
� E����Dz��m�=B3��u�8��B��|��?�g(�Ȣo���"��]̬t���Ѕ�N t�9
�<���a3r��|��()W0fQ��%��/J+���!�n�im	-�XjW����PK    RNVX1�ez   �   4   pj-python/client/node_modules/lodash/fp/toInteger.jsU�A
� E����Dz��t�#1�4`;��ǯ�@�,����YJ;��f�ԍq �NfT��RSh�I�'�Ʈe��M���c�G��Rc&��I����8#���h�����7Ki�ў�PK    SNVXb��z   �   5   pj-python/client/node_modules/lodash/fp/toIterator.jsU�A
� E���]*=@�f5GĦL�'����BN������YJ��Y3���8�uOfT��ZSh �d/�0v5�:`z�>���Y6J����Gm�>�����A��;-5��3Ki�ݞ�PK    SNVX?�cz   �   1   pj-python/client/node_modules/lodash/fp/toJSON.jsU�1� EwN�� Ep�(��=@���D���r���z|���ӲtN�,g��-� �4j��V��B�dz��'�]E�UO�{�>��A!�R�����:�ɯ���� ����x�xE✪z�'�PK    SNVX���y   �   3   pj-python/client/node_modules/lodash/fp/toLength.jsU�A
� E����Dz��z�"f��c�1��5�������=�@iG}ӌ��1`���J�[j
M�� BwL/Ya�J����{.>|d�(0fR��9��+���{@��4׈�L,��g{R_PK    SNVX�M��x   �   2   pj-python/client/node_modules/lodash/fp/toLower.jsU��
� E��
�&!�b� ���\����
�y<��;�e�(l�Y�$㯬�hsCP����\n�A��vd蛎6U-6����S�+�JB\s:z��C~F���P�/�ţ�#�Tի=�PK    SNVX,�)x   �   3   pj-python/client/node_modules/lodash/fp/toNumber.jsU�A� E���]%1p ��#L��L����������-KGaG�r����2v��A�B�[JpU�i���}��oJ�<X�ܼ��b^)$Pj���[�_�3���&�jo4��H�SU�� NPK    TNVX)���w   �   2   pj-python/client/node_modules/lodash/fp/toPairs.jsU�A
� E����Dz��3�7(b&T��5���@
v���g�����f���8�u3+-��D���>r�y�X��f���T�^Z�,�Y�:�lI>��Ҋ��{@�7�=�ţ�*��^�PK    TNVX (�-z   �   4   pj-python/client/node_modules/lodash/fp/toPairsIn.jsU�A
� E����Dz��t�ޠ���8v����@ v����,���Y2~�g@���l���p�
�����0v-mn����W2>S�3(5	qN��Í�����;-5��o".��g{?PK    TNVXӎ��w   �   1   pj-python/client/node_modules/lodash/fp/toPath.jsU�A� ＂�������A���D����%��������Y�C3~��8�u���n�����B//;�Cź�H�{��3�A��1�R�����)����� ����F�xeb)M�ۋ�PK    TNVXt���|   �   8   pj-python/client/node_modules/lodash/fp/toPlainObject.jsU�A� E����Hb� �3�4�HC:��������aY:�r��d�V�8�6Wj��V�kP����덮��5��3�C��lȸ��)fPj��)X�;���G��Zk@��D\rS��$�PK    UNVX],��~   �   8   pj-python/client/node_modules/lodash/fp/toSafeInteger.jsU�1� EwN�� Ep���ԡ�1m$���(�/�2�����ݲtw�"��WW���BP���|��	W:@���8ǂd��6w�zh�ކ��TV����8�u
��|���썖P㑈Kn�ٞ�PK    UNVXֶ xy   �   3   pj-python/client/node_modules/lodash/fp/toString.jsU�A
� E����Dz��3t�1�V������@(v���g���Y�E3�[d�������p�	�n�1?`J�����o>U���+�(uڒ|�'����@�_���?�XjW����PK    UNVX�^x   �   2   pj-python/client/node_modules/lodash/fp/toUpper.jsU�A
� E����Dz��3t�u3!�LG9~�`f���v/:P�Q�~h�o���`F��-5�&\t�B/f��ujz�ދ��\6J���:�,Gp�8��w4�Cs�h�`���z�'�PK    UNVX�hHbg   �   4   pj-python/client/node_modules/lodash/fp/transform.jsU�Q
� �=��v��0�+�֪��S���7�^���x!g�HƳl��CP���|��
�����w?��^��,D���ŕ�C���P�\	��>�s�j�g� PK    VNVX�.�d   �   /   pj-python/client/node_modules/lodash/fp/trim.jsU�A� Ｂ�Bb������V >_4p����'�{&�0�Й6!���M��dI�+B��l�f`�3(���𓣕�L�n
,v�9y�t,�*��PK    VNVX%RYZh   �   4   pj-python/client/node_modules/lodash/fp/trimChars.jsU�A
� E����(�@Zu�	�5:~
.j��7�#��q#>q«n���b��Z߄A��98ʠ>�6�����^�3:�!����3@���Ԉ�3Q�M��e/PK    VNVXZCl   �   7   pj-python/client/node_modules/lodash/fp/trimCharsEnd.jsU�A
� E����$�@ZE�H0�Q��Тf��{�e��/��'NxVO8�_B2�n��6�����Kt ?��ԩ��ީ#�[
���3@���j@������Z�PK    VN# fresh

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Covera