'use strict';

var $TypeError = require('es-errors/type');

var Call = require('es-abstract/2023/Call');
var GetIteratorDirect = require('../aos/GetIteratorDirect');
var IsCallable = require('es-abstract/2023/IsCallable');
var IteratorClose = require('../aos/IteratorClose');
var IteratorStepValue = require('../aos/IteratorStepValue');
var NormalCompletion = require('es-abstract/2023/NormalCompletion');
var ThrowCompletion = require('es-abstract/2023/ThrowCompletion');
var ToBoolean = require('es-abstract/2023/ToBoolean');
var Type = require('es-abstract/2023/Type');

module.exports = function every(predicate) {
	if (this instanceof every) {
		throw new $TypeError('`every` is not a constructor');
	}

	var O = this; // step 1
	if (Type(O) !== 'Object') {
		throw new $TypeError('`this` value must be an Object'); // step 2
	}

	if (!IsCallable(predicate)) {
		throw new $TypeError('`predicate` must be a function'); // step 3
	}

	var iterated = GetIteratorDirect(O); // step 4

	var counter = 0; // step 5

	// eslint-disable-next-line no-constant-condition
	while (true) { // step 6
		var value = IteratorStepValue(iterated); // step 6.a
		if (iterated['[[Done]]']) {
			return true; // step 6.b
		}
		var result;
		try {
			result = Call(predicate, void undefined, [value, counter]); // step 6.c
		} catch (e) {
			// close iterator // step 6.d
			IteratorClose(
				iterated,
				ThrowCompletion(e)
			);
		} finally {
			counter += 1; // step 6.f
		}
		if (!ToBoolean(result)) {
			return IteratorClose(
				iterated,
				NormalCompletion(false)
			); // step 6.e
		}
	}
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                             ���,/_{/�X��@Ne��������_.�V3���O���oy ��4�6-K|l(1�%�|�Z�,��_���0��fd��(f�IzS2I�߄s�?+[_�����U�T��n+�.�8}�-��׺p��Ԛ ��.-[e@j�E�)�N��z�⠴�����P'�0�D1=�����/�tJ��L�p��ܭq������S��ؐ9HZ�,Lp�M�Zl�x(�GR)�kV/�8�/'R%�G��ܮh��x���M��?B`�fB#�K�~s#�K$��?�FS)�k�'Ԣ_C�j�L(���X[_��b�y��cӣѓd���T		����P�����)�:�x4��N�ձ��K��i	� Z�ƥ���+�
��(-"�Wh��I�6���ņv�E�H���ޫ��>ڂNC:�#U3"2�bEaUPl��7��8���#W��_J1aЄ�rN�Io����t�z��E����M;;;���M�V����4)��8Պ��J�O;��B{�����0[Sc��M#�R3:���u�����8XuJ|���	�(4��ϖ&��C>�)�BR�*�R��%�ģ�	��X("�KR~��Z�^ ?ir�Vb�`�M�m�sCkUM�僖Kx�X�k�z�����J�A�L�'��H��*X$9j	��Tj��n��|�L�q �%_�/��abQ�(m�I��.�B�DcjO����Rb�+��q�������k)��=��"�_v���a=F��}��e�H�ݼ��ur9���6e P�)�"�#�L���-�h�G�|?	�Dv�P3!�Qu�c��V�[w�tg����)� ��dWJ�T �J��Qw\�JЌ~jvgB ���5޲���[�JP�1q~����Y\���}�eHvN�)���UC����"��~����"�:x�b�C ȫ���k���s�d+ic���9�5$O�+��m�CAO��3/�Í��i�I��j��B0K82!�[�D�Rj���F��S�$�_���;U��&�D :N0WF�榀p���z9�WW�Ȅ4�4�%(�%o�Y��d����A�!��߂�K���v�`-}/��� �Ljc�K���*��hCK��*��X��X���Mz��1N�`  ��"��rF�3_ӘX�,yz,�*G�<B@|b����Zm���r��KV$<ɤ�D��Q��TiQ�N�d�Ao��uz?��L��ĵݧ?�*$��-.���R(ijck�1��hT&���G��	G�ŉ��>��(�S��0���X��ΣhIl�U��w�X�&�ŔT�  ˡ��y�0:H}~�3N
��r�D6�^7�ǈ}�Ù)�;h� �L��k��E�@b�y�}k���qџN�<Mp��'�B�� �f�E�3�V#Sȓ2`���"�%Q[���t�(��	T��h�խ�7B�}��sd/��m+{��>�{ze�\����؈  �����z�i�f	�{�ԚNi����D;S+�c�K�
 ̦4�=�fҢD����an�/bM�������� �����yz�)bCS0����
�$��M�4��ݫd�6���Q��v�qLW�EB�JPd;��b�����v��
���j�x�7'Fˊ
'fV��e���LwS�Գ��+?WԫaK_f�&�H*  �����⮨;B�NeaVy�
�\F��O�W��9ks�F�$�
�,):7��<�vs����s/���V� ���wm���9nv���t��KVޓ#Y�#k�j��ȩԛ�n