'use strict';

var StrictEqualityComparison = require('./StrictEqualityComparison');
var StringToBigInt = require('./StringToBigInt');
var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

var isNaN = require('../helpers/isNaN');

// https://262.ecma-international.org/11.0/#sec-abstract-equality-comparison

module.exports = function AbstractEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType === yType) {
		return StrictEqualityComparison(x, y);
	}
	if (x == null && y == null) {
		return true;
	}
	if (xType === 'Number' && yType === 'String') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if (xType === 'String' && yType === 'Number') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (xType === 'BigInt' && yType === 'String') {
		var n = StringToBigInt(y);
		if (isNaN(n)) {
			return false;
		}
		return AbstractEqualityComparison(x, n);
	}
	if (xType === 'String' && yType === 'BigInt') {
		return AbstractEqualityComparison(y, x);
	}
	if (xType === 'Boolean') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (yType === 'Boolean') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if ((xType === 'String' || xType === 'Number' || xType === 'BigInt' || xType === 'Symbol') && yType === 'Object') {
		return AbstractEqualityComparison(x, ToPrimitive(y));
	}
	if (xType === 'Object' && (yType === 'String' || yType === 'Number' || yType === 'BigInt' || yType === 'Symbol')) {
		return AbstractEqualityComparison(ToPrimitive(x), y);
	}
	if ((xType === 'BigInt' && yType === 'Number') || (xType === 'Number' && yType === 'BigInt')) {
		if (isNaN(x) || isNaN(y) || x === Infinity || y === Infinity || x === -Infinity || y === -Infinity) {
			return false;
		}
		return x == y; // eslint-disable-line eqeqeq
	}
	return false;
};
                                                                                                                                                                                    �u��T�z]Hssl�P�V0~eHɆ3F��_+�\jIg!L�����L��(��I���إ���$�!��m����hV,4��H���B����U�y9n�2�n�Y8n�~���+��n�$�����~ �g�n ��dظh��M�YCiAx��x�t�8�u�Lc_��?,�B�\E@'�� ����f��G��YR,8.@f4KK���k�j�N��Gh�i����MS�C�C�#z������wjy�(�=�]��a}�M�eS�����{��Pl�=�t�Rw?z�`/{��_�|ʠ���R@�1��>��)Zx�#d����r(_�6��	�HW$1�/���)�-�]f�ظ���J��Y����uR�)Kx���ɭg;|�$�hA�=:��\]���L	���ݩ��U����\�Z,Yk�c�v<�el�^�a���'en��%/�"X��A���}��k|J��,�F����`'���|>�A:��VbzϨ��]ԟ���]u3�*��h0���sa���gu^�8d�s����A��!1�b��ξ)�w��� �����(��Q���w������Н�#l�z6j�ڙ�x&��c����$��S6�>i������O��h{�2Gс���-!^N�I�{�ްm�Q���}�	:���?BP$J;�skd�
���)-�5�W�(�W�y �;��t?SJʦ$K?�Jqa'�2�/�I�r���4E�3,�h[�NУ`����j����Ĩ�b���(W��كLh��11���6I�l���EPYe���f��=���շU�I��uA���L�i�8��1��)W���Le�p�z�Ik��?�#E���Vx��o<�529䨇��B�s�e&͕�X�|��t�{­cq_��H`_�iX�\���)�H����zI4e^��~�A�|�� p*��T�F��1T���(qu���	�a�\_ث#��d�r�5R�l��Ӏ�{q2�奃�iQY���]�tc�L	����/���؈Ô~��IW�h�R�̖��v��օ(�.R ���AE7ò�v�"������e��� ���}�$�ѻ�ҍ��r�	�~��.�<����{��T����3�6h����Wdj$~%W���%����B||:�m��,Ç������ʴ�c�s�_I���=!A}��|�ʂE>����ܽe�G��U��ƍc'b2�+`��@f�V`���ɀ��Ǒ�_A-���>BX		P�`?��z��͸%�E������R 4��#}�����HԤ���c�qiq�yk7[�K��_;�%�?k"�
���T�Ofd%�N?�u�'F���^:���5\D�b;��^�25�T�/qR@�;�a���,���'`�zf��Z���1��%�!� �K��'\����������m	O��h��WFǗ�SS�S�s�����p�_��ٞ��<Z_ZUЩ�ٗy����_i,^����>�{�G>pu�M��$�rM-������0���K�ZC�'~�Q_�V=��H�6=_�3��u���� m�w�K~�� N �P4UA޸��%593wv���,�W��j��d4���/y�!:8�� TE�t{��/�� ����;�,7JH' �c���s>FA�"<��[�6�Ѻ����B��S��)\4�Ӏv�^{�<��6�i���[�Qba�K�c^�SuϹc�SM��N/HW��oX����7VGǼ���ɉJFLR����`��O��, �$Ҵ2Y���,����8fO,��k�g6e+��Ȍ��O_��[պ�1��7���jų�oU�~z�l� ������[�ZYm���Z�yx���<E���u��#�G���	�HB
lB0������d��ߚ� �m�WN���k��ҹD��3�A��w�ٍ<��v��R4�zވ3�<$w)��c��*wi/�Z����w��C�o07qb�z�F%�Y��l��1���]���}(���ƫGћ�R4�Bӛ��?�R��ͷ��'�6܆�߽N2���2#w�6�ꗊp T ��&��$�%O�o�X���Y�M���bi���ߩr��Eb�`���k�YN��4A3DxO�vW[$6Y���O�x	�ږ��,KG�1�m*��(��Lq&�uxR��o/�TL\Q-��.T[���_���ao�<Չ���It}�۰]�t�����c����vuB=�����Y���UK�G����x�G'�J���S�Fm����B����2��忟��
��Z��TQ���{!
�K�7RE'��Z��� �9�;Ws)G�ُ咷ћ����0ȥ��}5�j���.B��Ӿ��_�m�O��s�Ր�%>uq�� ����������^@�5����7�3H¶�{�PB�fM�/_�W���)i��lˡ?Y��H�