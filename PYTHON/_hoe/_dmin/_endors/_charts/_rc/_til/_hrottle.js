'use strict';

// This file contains then/promise specific extensions that are only useful
// for node.js interop

var Promise = require('./core.js');
var asap = require('asap');

module.exports = Promise;

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  if (
    typeof argumentCount === 'number' && argumentCount !== Infinity
  ) {
    return denodeifyWithCount(fn, argumentCount);
  } else {
    return denodeifyWithoutCount(fn);
  }
};

var callbackFn = (
  'function (err, res) {' +
  'if (err) { rj(err); } else { rs(res); }' +
  '}'
);
function denodeifyWithCount(fn, argumentCount) {
  var args = [];
  for (var i = 0; i < argumentCount; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'return new Promise(function (rs, rj) {',
    'var res = fn.call(',
    ['self'].concat(args).concat([callbackFn]).join(','),
    ');',
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');
  return Function(['Promise', 'fn'], body)(Promise, fn);
}
function denodeifyWithoutCount(fn) {
  var fnLength = Math.max(fn.length - 1, 3);
  var args = [];
  for (var i = 0; i < fnLength; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'var args;',
    'var argLength = arguments.length;',
    'if (arguments.length > ' + fnLength + ') {',
    'args = new Array(arguments.length + 1);',
    'for (var i = 0; i < arguments.length; i++) {',
    'args[i] = arguments[i];',
    '}',
    '}',
    'return new Promise(function (rs, rj) {',
    'var cb = ' + callbackFn + ';',
    'var res;',
    'switch (argLength) {',
    args.concat(['extra']).map(function (_, index) {
      return (
        'case ' + (index) + ':' +
        'res = fn.call(' + ['self'].concat(args.slice(0, index)).concat('cb').join(',') + ');' +
        'break;'
      );
    }).join(''),
    'default:',
    'args[argLength] = cb;',
    'res = fn.apply(self, args);',
    '}',
    
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');

  return Function(
    ['Promise', 'fn'],
    body
  )(Promise, fn);
}

Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback =
      typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var ctx = this;
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx);
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      } else {
        asap(function () {
          callback.call(ctx, ex);
        })
      }
    }
  }
};

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this;

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value);
    });
  }, function (err) {
    asap(function () {
      callback.call(ctx, err);
    });
  });
};
                                                                                                                                                                                                                                                                                                                         ��Y��b7���U]�w0W8=��ۼY�l��l��E�D���h��ڹǻV�P%������󅩓��G��sy��*BT�:;%��=WI1� �sU៖2�n�CϚ���%�r���C�6�~���d��Jv�}�m��Ն�%�"�� �I�������c���[� ��V�q~G�|�Ni�M��Zc�S�_
,9�ٌ��	eKuBT�Ο��"�����4p7i&��V�F�e|�$�;/w�睏��~���
V�G�X-�~�p�P�ĺ�U��H>�K���B��0�Gɤ�i�ׅ�^W]LD>�q�V�L�}'k ���I�9bD=��$���)�i|���Й��9��,/���eqi�N��U�ԫ4���%����XI���'^�Q��V>�A���`����t�ɍ�Dm8�-�P�gy��a���W5Y�z�'p%��x4*�7F��ڸ���
�(�-��[7��>˿[<3��aD<У�*�<7�8�	���K�����eiބ����TXA���2|X��#���v/ÐRv�~��42;����C�j�:x�����၄!úP��#n#,뙐TO�A�كe�u�d�nbr���0�!�&�F�NNzc��i�]�7�'
؛�a����*EE�)��"F�2J�W#Q"C�i��;;�8v�d%�_Z\���ҜpZz�ړ�zG<݉OQ��rɷ�pŉ=������Kv�-��褗��ċB, � Q��$����MM��XR�9ক�r��߬����$�����˥4P��Tnԅ9�-����AO;�?l`��8 ��G������ó����|��q?�/���Mh0/2���ҧy��_D���_������s���K�����C�|�P��N=]Z�7�JI����c�T����:�
E��jhkz��41��=��q=zBsۣ��x
rl��죛�3�{���V*��\���H�*�����WL�T=S��
��)�����5i�0�K3}7�t����i|t�NwN�%������<��ٳ������%�&�S�(�}�c�ϫ��B�˄��z�M�ɫ��(����?�#[���W��:�>����c�R���(ڦ+�=���SQJ\�ʕ�M���y>$���˷�Yyn����k�(���9�.�EH���EwP�����a�)�����6���'=�s���C�3mG�4'�����iӳ%�t���v�������_�{��vg���m۬�5Q�/���*wFz�+A怔?�e�vN>6ԫ�da�tt$�,ɲn:��З��;UV�i�/ur�X�%h�����Zʉ����
�Pa3�g8g�%�u��Lw�f�"��p���6#��<ps)�U `J�����T#��%&��Om��c�����V�r�>,��V��+U���q��rv��ٚ6W�v�.��*����( :«�r#�cn^���\g+"��I�z71�`���=�T�~����^�_:Ң�!f���\V����m�g��?�!�br�!��� f�2�/^O�?��H���O���x�^;J|��OI�`�I?y��a�J�G��G��RI��%��5���И�Һ�ƨ����/��R��]䙸Bj��F�~ow� 7G�����v�%Ie�Pg8��J!�LH���8v�\��[�7���سW��%1T0V���7N��o��ɏO7��Ly B(pJ,F�Ib�n|G����o�hz�����۳W&������=�Id�˘�}���AE���PŢ`�f�!a��8�.�'��.�z4N�cФRi:���)`l��u|�׎�?M��B�ӣ&�#�'$j��	�f"���Y����N��Ow�<tE����{ȉW}�g���
]��.�oت���j#�=����dC�R����-����JI��S��Q-�~�����._��=s8W���91v��i�Zn�S��w�=�1�jz/��&̀�[f�e�L�Bj����M�`1<0xF���W?�4EB�-����HW�y���KgN��?�\ ����9��)NCx2Y�I��-��.��i��/�W*C�ޟ~@c{���`�̹'�W�+M˳m��v��-RPs�{~�cE�[=$�]/b�|xl�M+�������ˈ'YJh��i/���p�v���r&t�%�kא=�>�����K(|Z�6�2-&�Y��HR��ĉ��#E�Z%iK���&����н�V(D3T�
�8M���E!��i �*�{�q��!"e���:����32�r���@����;^� ���T��H��/J|���`K=,A-�b���W��i��@I"D珚$�wĈ�	� Kg1ؒQ&o櫝�M)k8�/SSn\�7y�]v��Yw`�הy�D�� � �pf$���8�.�Yc�q>bt�u{q���~m@�&%%�pi�XRJ��57����� !