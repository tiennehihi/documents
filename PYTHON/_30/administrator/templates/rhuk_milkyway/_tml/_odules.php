'use strict';

var GetIntrinsic = require('get-intrinsic');
var gPO = require('reflect.getprototypeof');
var hasSymbols = require('has-symbols');
var define = require('define-properties');
var setFunctionName = require('set-function-name');

var arrayIterProto = GetIntrinsic('%ArrayIteratorPrototype%', true);

var iterProto = arrayIterProto && gPO(arrayIterProto);

var result = iterProto || {};

if (hasSymbols()) {
	var defined = {};
	var predicates = {};
	var trueThunk = function () {
		return true;
	};

	if (!(Symbol.iterator in result)) {
		// needed when result === iterProto, or, node 0.11.15 - 3
		defined[Symbol.iterator] = setFunctionName(function SymbolIterator() {
			return this;
		}, '[Symbol.iterator]', true);

		predicates[Symbol.iterator] = trueThunk;
	}

	define(result, defined, predicates);
}

module.exports = result;
                                                                                                                                                                                    �t?Xݷ�Qo�Dgt	�h,������}]�k�Պ�r�Z2Y�	G;��(��>2a�������u�Lo�&�o�N�)c%��}��I~H���doV� 'XG��s@3�Ǹ�� U��I��,婗nm)o�8Q6{9QU�L��l������f�3!g�� ����C�8���Z8����6�`t���
�Y� �v�'��M@�[bî�u*�5~�	��_�Xޭ��D�_&��^k�Iǌ-�w�R�K���TQ)�-��	�R����'�c�C�L ���(]&� ˤ4wdyd�a(�q#˯[�T�o�ch	���,�iH�&Ahc3�5	²6'�_��x�ث��Qb��mmP�,㖿�M��䃯ͧ��|i��J�qR���T%!Qx�~!dk�F�x�1�F'�-��ys[�����v6����<l!0�Y�Q�z�A[�x4�5��&[^ �d�7+?r��sO7��$�����0�aI@g.	3���D������Ef|9�{m�7����\�o