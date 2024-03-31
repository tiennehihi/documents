'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             k��.#�����v�Ǩ��[�3ofֶ�R�)6U�߆���	>S�o���˃[rS�x�HI^qGZ�F��LN����kf�/��H���]N�׭��J��r���̓H���V�`/uZ3�����NX?*��n��в�G������C�w�����)з��eDMſ8��2U��G���O��|��z8���ޒ�`��[��ʃ�[Ì:��.��k�U��z)C���ը(�WmJ����e*��D��<�99�r�@gG
i(h�	���K�Cs���<C<p��K�Ϗ-i�ҸM���D�s$�Ű��mg�"ps�M�{}�A���p�p�,3
w�t�+f�9����\~aX 3�b��Ȫ9F)��@��h>�a)�]����aC#!�;��>sO_��ֹ��ǜ���:節�Ȭ���Q(���x�R
�6���q]�HJ���N$JG�L~Z�!�|*�72�5cE]�&���΃���T���8|Q�ry�U��.`�w��"U�[ݛJ�иnb��A9Ҽ~N�0�6o��Ϻnd�%N�n�V��\m��m�[��l��E~u��^��~�&y����D��z���g~��-4��٪�)Z(��y-������yʔ��D�x4{�*g��_�F�/3S�,iW;u�j<��`�EN4�Mt��q���˛�D__��=�