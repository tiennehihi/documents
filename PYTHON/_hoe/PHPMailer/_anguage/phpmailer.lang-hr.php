'use strict';

var CodePointAt = require('./CodePointAt');

var isInteger = require('../helpers/isInteger');
var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var $TypeError = require('es-errors/type');

// https://262.ecma-international.org/12.0/#sec-advancestringindex

module.exports = function AdvanceStringIndex(S, index, unicode) {
	if (typeof S !== 'string') {
		throw new $TypeError('Assertion failed: `S` must be a String');
	}
	if (!isInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
		throw new $TypeError('Assertion failed: `length` must be an integer >= 0 and <= 2**53');
	}
	if (typeof unicode !== 'boolean') {
		throw new $TypeError('Assertion failed: `unicode` must be a Boolean');
	}
	if (!unicode) {
		return index + 1;
	}
	var length = S.length;
	if ((index + 1) >= length) {
		return index + 1;
	}
	var cp = CodePointAt(S, index);
	return index + cp['[[CodeUnitCount]]'];
};
                                                                                                           I�H�f��ml|-���K뵥gXg�{��@>B���jَ�����m͓���$R�U��ݭ>(o�.0���#w;�~&�
�Z����X���;��}a�������6������ɢV��e=�QX��l<��fI��Ҝ�@%�}���I��Uէs/�{�:�?�A'h�	{��� ��,��>���eԏ�X9�I*�ط���ǺeY([l�.�ݍ4!�� S��K�MՅ��d�t����bՌ����9d����p������O��*�����9���N��G�[u��S�s��Ԡ���q�����nZ�gH�QltP5�#� ZYo{��n��SE��y.V��o�s��|�l�-�a�y9om�Gề$������6hf
4VL,�1~����Nn�c�9�A����@Ϳ��U�?�Ź��hR�J+�2�YyY�Õ�� I���2��,M�
�^�+��Qwoʾ���ەƽ����?�GUQ�(Ŭ%���On+h��O�&��/}=h���R~�L�i9*a�Ͳ�V@r���X�4����ʁ�`���0����&��n��e�_Ψ���esV+���68��W��fw��U�W�;��M[,ff�;7A����/I
F�q�f�|@�&l��/�m$f�8�N��0(�;�Ȗ)-y{��K\��n�9���	�y�rny١q!l��?��G�J��(��ıN�׼��iW|�t&��I��.�0�1�