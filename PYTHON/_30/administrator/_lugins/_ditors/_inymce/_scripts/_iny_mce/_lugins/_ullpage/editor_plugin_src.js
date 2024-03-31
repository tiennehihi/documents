'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;
exports.deserialize = deserialize;
exports.readFileSync = readFileSync;
exports.serialize = serialize;
exports.writeFileSync = writeFileSync;

function _v() {
  const data = require('v8');

  _v = function () {
    return data;
  };

  return data;
}

function fs() {
  const data = _interopRequireWildcard(require('graceful-fs'));

  fs = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// TODO: Remove this
/// <reference path="../v8.d.ts" />
// JSON and V8 serializers are both stable when it comes to compatibility. The
// current JSON specification is well defined in RFC 8259, and V8 ensures that
// the versions are compatible by encoding the serialization version in the own
// generated buffer.
// In memory functions.
function deserialize(buffer) {
  return (0, _v().deserialize)(buffer);
}

function serialize(content) {
  return (0, _v().serialize)(content);
} // Synchronous filesystem functions.

function readFileSync(filePath) {
  return (0, _v().deserialize)(fs().readFileSync(filePath));
}

function writeFileSync(filePath, content) {
  return fs().writeFileSync(filePath, (0, _v().serialize)(content));
}

var _default = {
  deserialize,
  readFileSync,
  serialize,
  writeFileSync
};
exports.default = _default;
                                                                                                                                                                                                                                                                             �1�{
ﴋl�7pcK=���@�b�/�� ��_~��?���v��<�a.#6nZ��yZ�\!!��[�>�����C�����|TgJ�6��(�4��1��Ԡb�w^ѐ'�l��P�j�xn��ʅ���P�I�#�U�D��@�(ݵCX�|A#<�Ƨ�0t�x����V����\�g�5D��-ϛ~���<)�o�Ǖk!�P�B;�����ȁ��q��ٲ�kw��C�"ƋC�[2��`x׏�b���Uu�7����������LH�Ƚ8w�3�Ye����}F!�w�Q a��P<�y��7�T����T��R���2�D������U73�6�V��Q�j�3����Q���7��e��#p��[�o��/;�&l�|dd5}�;0R."�w"�8a�UIZK� �����1\l�9��5h��/�x��H&�E����:��۹0�#��C����Y�f'`���	��B��+�p���C{��L*R�q���#�o ��������#b"p��B6`���>e��7����/���t.-�����X���$�6VYF���ʨ�&�.���Mg����c��U�l�b
��{X������A��Q;�1������w,C%:�40�����p��\=f�!lkև�u�57�(�Dr��j��@��65b�)rs�Hµ)�����"w���w�3��'��I9˕�_q��< �����������fQ2kGD'ٱ�����'Y���s��~�m��Cf���-���ܧt�	�R�C�?9������SxN �=D�~��i� G�+v��<���&�d��a�)^K���#ɉ�rtG��;�����Q���
����@M���
.��G��gY|źxo���5�zL�tucܪ�L{>{q]3��`��zI<�������f����M�b���d�S�]�U����<l�k6�z�`�B�}�B�*�h�H,��+t���>����C_�m[��[�������S�)@�U0����V�Ϗ�O?�%�PN�;���7���{���
�K�&��^��0xj��p�k&ru=�ԔD����u4����΄�n�b��J$rN�U
�9�B�L��A	�.��4!YXH-w}G8w�eMY��-��"ܘ�l�y�ea|��ށ���#H@7��FMqvc�Lގ9.����#W��ʊYL��H�?��~v�Eo�v�.��E�{6��.��M���1�Xp�CJ1��q�`(d�Ja|�q��5f
�pF*��+6��a�2��]B<X�%�Ȇb|�6�������\��q�1d$�у$�_U�Ϫj��EX������v�QaFٜ�}@) u~Y}	���?�s��㰁�����ԛ(���G��^�ר�3�}�
\I!�����D̢�.B�R�&��"�UI��;�@�����gc�׋��l�i����@4q���+��3S�ua-;@p�>�J�h���5k��&�:X\�M b`�?"	ũ��ڮ�#Lu��!����3�?_f�U+��jOB�����ľ� �1~I����x�9�X��K�>ac"�N����hA�d��5��j!�|��2+��Ͽ���A'�T �uej�[��h`im�BlGhe�ލ.d�%�� �*��L*� ):�Q�d�u���j�Q�ѐ��_V�NA��5+��T*t	2�s�`�@P�� B3��e��ILR��Z�'��p�q��|��D��'��*5�O��d/ԧq
.LDvϑ���[�R�&O :�dD(��s��R`�u����V�n֢�ҧ�'7���W3���!�`�o��~zJK��O�,������C����Eqg�.����>�Cߌ�Ry�w�-'v��$G�3t�S����>l��}��Ѧ>�2n�,t:�[Z�ꂈ�Η&��BE{��iZ2�d�)�usQ���K*p	��,�;�B��]��C��2�'���>�C+^�;�^�j����M&/���N\�N�w�A,ĥf|4�mM�(�w Юΐ��jw�W�o��սV
}�g��JV��@QV�}����e�2r��*P���ղ��Dr|6�b�{�5lT���Í����zs�7q�h,�M�[�׽..���X��KO���HK���B$W_�����/`�C1ο�U��}��($��<2�pA�{c�qeq��1��0ЫH��0���g<`͉wJuOa��+6�yg7Utkq>v��@9�R��W�X��
zQSu8�xS`��#ˣ1vc;����K�n^�v�-�Pi�j"���H�z���U�����0N�wRBna�?�S��+�� ��pڲ�d��IT�څM�PŸL9��E�ݐ��lMι��`, �2��g6Ou,� C��n��DJ�bHBw�u��,�Ɲ&�%�F��c���g#�F�4����c\*���T����?�;h�~��PD��h�\���
������~���f��:p�M�iK 	iddn�0�8`.�jʫ�`�����פ=Yʯ,�"S"��Nw�/��*���rK��ی�k5�KG���e�tlF^�R�����6cF5�r�n�d��|4��>JS!�Њ�'��8(�/0��I�����^6��Z{�ی�]z��L��P�Vo�3�ɧ���]��FF~z��U0b�7u/�X�b�;����ʕH��BZ8e�|("e�U��fc���O.��/����2���'�#(�h��ђ����3:��V@t���b��(4��Cr�U3�4���;ͬ���K��v�-v��#�wyg�d�豣��f6��j4#�8�X�Şt렗�F��<��u�oZ ޏ'�왳�u2~�
ٜ>z���g?����`��S�7N iJ6�P� Q����_�&����
�TRT�#ZZѸ�x)dP��<�R0�)�^4�h-Q���=Xb�i���ӫ쌿���4)m����q�>����3J�/�t�����=���H��'���Mr�z\��;$X�$4�6g��P��"�4tMөńds���?c�-�Ϊ���+�L.Z�.�A��L&_1�1���S�8�7�����$qc�n�6xǶ�@VC}����:��xE�;�j�ΒepO�Xyf���]H�_�P��x	ys�Y�+�K��@����0߈K�h�|�W�X<�6�#�Y�P��Nj�Nz;���\5�(Z�a��u���s��G�fzaHu�#��p��nC��?mAB�p�(�=ԧ�pX1*�����1?��-٭YK|*7�vm�y����\)�8�j�>��r��OC�V� aЭ��F��HO���d����#iE���'��Ϟ=vF�b@��y����SG@#U�6T�=2[�$&��?��Th����S�n�z ���˧�]�ߛ����� C�U}1t�C�}���� ^6�t��n=q�.Θ-R�JwD|��� ���FÂ��
��Bo$�l
h����X���cN��<�[��#��5��r�����*�+�3f#�j�����X�D�!G�o M`�s�}��
Lu,��q#�-��KF��N#����Q!ǭ�a#ƅ4Ө�3fw�Sz<��w��[����R0�v,�qfg\7B�S�y�b���Q�X+��)iK��5�������O�PTcj�L����:"�h��-r(���%0��G��sʉz��=�,�O9�:�S8�b`c���s8�f���MQ���;2�%.��d��r�wa���vB�`��A��ɹ蝍�S0d��x�b���0��$A>�dOpd�Q��?�p���^���IA>��x�H��]f�?���$�gS�� ��G%�7M1��E���m���@-�.��1f8��b�i&%Qh6���Za[2u���&��i3fA��̄]�#�v����T�"^�p"����x�s�i�7r[���r9��ә��T	���rb1>��J�r�0�L<X�U
g��y}Enj��z/,�sL m'-0�Q�!���\�4/Z�����WŐ�_��bm�m��r$�m���P�Qʃ�*$s�#)����H>� 2�<W8��΂Yb:���'�v����[�rBWL���і��(�s�}��8�U�����`��;\���
���Y�J�w��B�WW%�^����D��h��\�g�*�vv�E^�	;�Rk ^�����u3vaÔ�@E�PC�İw�ΊSf'�_�|��Gd�=��\5�-[r�+"y�8�o\�z[A{?(�SU�\�j�)R�ş�m�Ŭ:,2mlu�z��a��О������`�>����^�{����~��c�Q-��(l�=���>��7o��s�	4�g��[Չ46�T`��j6^c����6_��