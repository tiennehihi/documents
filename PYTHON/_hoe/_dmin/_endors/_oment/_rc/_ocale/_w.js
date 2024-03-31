'use strict';
require('../../modules/es.array.iterator');
require('../../modules/es.object.to-string');
require('../../modules/es.promise');
require('../../modules/es.promise.all-settled');
require('../../modules/es.string.iterator');
var call = require('../../internals/function-call');
var isCallable = require('../../internals/is-callable');
var path = require('../../internals/path');

var Promise = path.Promise;
var $allSettled = Promise.allSettled;

module.exports = function allSettled(iterable) {
  return call($allSettled, isCallable(this) ? this : Promise, iterable);
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                          a�UZ�D� $����e�ދȼc$��x�o	]�f[%>�Q�!�'q�m%�
�R�1ì<\�Nr]*�j�S$����쬏qθ��Mj�>�I����YO�C=k��Ӕ�w۹d��%E9�H��O��v���).n����"N"v��>toS��xU��|u�Y-0��i���i}���������mۅ3\�n�P�������7��g+_&��1JK�_E��J�eX�^�a�\|���v	J�̶���qE��vT�{"Pxc\rB󖿣��´O\��Q�cmI��X�v��O�@p���4�93���p\�}kP�*�}�d`O��'�*QAB2���!�Q��Ŕ� ��vB�4i�^����h��W�Ҵ�نS������ ����D�Kyt
M�Z lav�	 Fb���Ֆ8-�is[И�7�m�i���v䙌�9���Ծ��U��U�o�:����yi��l�����~�t��6ۯ�0�o/�VT�_?u~�'�-iQ���+L@w�1@������P5۞�3i���ϲ�h*�Ia"���x{�p��L�@��@3�o����P�Ȕ ��#�_��B���X�Q�F�