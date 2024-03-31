'use strict';

var Type = require('../type');

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    �O^��*��7���D�As,��O5�M<'�ە�C�G����<�at��Ɲ�2O�[=�F=����-߶�j5���P��_(����j��!�T�M��k:樴.��S:�(���d���N6��<SBSEc��8���7:��nhph�IP �DD?�P|�s(����03��)�r�0iV�E�p��KX\�����T��j�p��SY�#��ML���o4 Pt��V������;�*n��s�v��PD�efG��*�Խ^��V|�hbV�r��`��ң��1V_G�2�������<p s��Q)b�Q�̊�:)��8�"M��T5�I��5��פ�VyS�q�z���3�V(:����ؼ]��س)�s�]�)��(����%�͛�`�**�o�ױUDNB���E�)��.L4�wK�I�'%Gț\H4�_P�7�Fq:O�w�G7Y.�'��Vf��TCOyV�	��nv����v�
��;-nm�T��V��,�# ��z��@E!�"H��
�}ϾV�|"����OLf~`G�1�^�\}�$�@"QP��b����;48�V��X�Ixl-� �8�l����١��*k��<-Ȏ4�����%�b��oWNLꭕ1ҩ�L�<� ��MB�������j�ju����e�""+�I�锃���4�AH�_����{u{�[DTr04�i�����|�H��(��)���(�5kL��֜.y�� ��9�S�]�TU/ ̳���e�� =����&��f77�������E@a�?�L"(H�lT��)f?vS?����V�*�%uiC��&�ס�I�)Ǩ�#+U{zՁ��X"��dJ�~��M�+j���D�k����SYa�<`�d�B:�M�T�J���S�M�Xb*?&X�c�w9��hٌ�G���A�I��G� I�c`{�^�^�hJ�ܩ�yIi�Z�p�'�%���,Y�U����{{$�Ҥ����Z���]�	�R���˝#�>� &	������r�+���j:�K���v�}����=!��-Y�v�����u'n��<ش�g�֛�/�$�����5��䪱 m!���Ux