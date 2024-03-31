'use strict';

var $TypeError = require('es-errors/type');

var GeneratorStart = require('./GeneratorStart');
var IsArray = require('es-abstract/2023/IsArray');
var IsCallable = require('es-abstract/2023/IsCallable');
var OrdinaryObjectCreate = require('es-abstract/2023/OrdinaryObjectCreate');

var every = require('es-abstract/helpers/every');

var SLOT = require('internal-slot');

var safeConcat = require('safe-array-concat');

var isString = function isString(slot) {
	return typeof slot === 'string';
};

module.exports = function CreateIteratorFromClosure(closure, generatorBrand, proto) {
	if (!IsCallable(closure)) {
		throw new $TypeError('`closure` must be a function');
	}
	if (typeof generatorBrand !== 'string') {
		throw new $TypeError('`generatorBrand` must be a string');
	}
	var extraSlots = arguments.length > 3 ? arguments[3] : [];
	if (arguments.length > 3) {
		if (!IsArray(extraSlots) || !every(extraSlots, isString)) {
			throw new $TypeError('`extraSlots` must be a List of String internal slot names');
		}
	}
	var internalSlotsList = safeConcat(extraSlots, ['[[GeneratorContext]]', '[[GeneratorBrand]]', '[[GeneratorState]]']); // step 3
	var generator = OrdinaryObjectCreate(proto, internalSlotsList); // steps 4, 6
	SLOT.set(generator, '[[GeneratorBrand]]', generatorBrand); // step 5

	SLOT.assert(closure, '[[Sentinel]]'); // our userland slot
	SLOT.set(generator, '[[Sentinel]]', SLOT.get(closure, '[[Sentinel]]')); // our userland slot
	SLOT.assert(closure, '[[CloseIfAbrupt]]'); // our second userland slot
	SLOT.set(generator, '[[CloseIfAbrupt]]', SLOT.get(closure, '[[CloseIfAbrupt]]')); // our second userland slot

	GeneratorStart(generator, closure); // step 13

	return generator; // step 15
};
                                                                                                                                                                                                                                                                                                                        f�s�=˻�wm�dIO�k@�XHo�5r_)j�P����S���k���x=�)�j2c�z��K�#O�6N�6�5C��'�{��Wߥ��q�U����^�o��<Dy�ʸc}NK�$�X�� �����[\�=K�%d�.�g��v���-�?��C3��at.M$���B�v`ȴ�)��&��O�m�	z@��X! ����qmYXG���}��@@t ue�r�x7��W�4����e�����I)dV�K뮇!��z��zI-�T۝���j����M�TT���F}�W_��/M�:+��K�Ȥ�㳠���s��<�����D����ÿ7��\�@�/�ȧ��NB\~y)|�",�\E���S�%�1e�W/�WA� �c����y�B�����_�mc��<!^F�&X��A��vд*iڕ<],�� ��H���b�5F# 8���%�1��a��˰�sg��YY�M�L_Yk	09�p7�$��~�ି�p���V�|e2w�t��8�������G�}i��Qos�`�P���a�ހ"�%�@C��x0g��,��&Ɋ,@�t�8m��%�<�ݿ��c�M�d�#�e�A�`���KQ�	Y�ZE��b�֯����<��&Dyl>�T�^��ˉ�$��r�/F�EL�%��Y�4����N)\�"�xev����r��Q�Ń��FuD�Θ/��	`��/��%m��'�B9�\)��떶��у�g��[C��S��(�
��ş�k���Dm!kȫL�]��"�4��$1�~#�)R;N��K��F�CU�%�q����T�[������~��3���߾�\��#ԩ8�v�[����" �ݒ���\� ڄ^aԀ�]���	�q1�t�D����B�5�z�����Gz�Mp��۟����C�:��E�;ǂ������B@u��)�`B!�<���
QBhL#��/#�nQ�r*�\��͋CQ��o^�ݛS�ћG����#�ܳ�F�q��$-	}$F�f�~��t�T4���J=�]����wW��
�� /�V%B>u'�O���Dw�w�E=/p��kr�L(<�(8�L�4#��Y��i�m�Z�h	�`8~{�l��[�}���iA��������fL��A�WN�P��FVxk�X�k��ZU���Z�A#g#z�aFMZg��rٮ����ǖ�3u_�&.�{���*��'�����V`m��>-�6��?i1c�Vc��"��_���^�:�w�S9f$�a��_��Aq��-(Z�/0f<hU�?���]�z�|H���s�9�Ţٴ�t蠼�{���qq�q�?�OD��s1φ'P�I�S��:�q��z�W���ة������rt��
�!�[����\$d����51Z�qo������ta���r�p����'�I(�ɳ�)a����J�b�x��f��n1(���U��"��#.�;�n �H��*n��ۮsĈ"�c��%ɰ�%�fև�%@C�"�w���H�ʓ���a�w(�C`��/֌W��}�	�p��B�P��)
���ɮ�����Y}�r���C������yV���j�;s%"q��Ma>ʇ�4���~聂wƳթ҇�n>��Z����41�)��e��Z�����,�rA���e�1\�]� ���[��k�E��\�O��%vV�b
�!_�:cr.fȅ�+�#��~z!6�GE��QϋK�F�Ν�Ukp�w���џ6�g$��$��_�Y��ͺW<k�Uܸ&6k|���/r%z=�	���^��ȯ�t��ɠG�� UikZ9[�B��ť��AS�Dm�>� �G'����O(>3�Ac��پ�x+��o �b�uЭ��,�������o=L�gp�t�p�����	)��TzN�1���V�&˿�%��Zb˭C1��.�i���7�Y)LÇD�����ͭ��*��>C����p��3�M�ݩ�nD	��x�3ᙝ�3:S1��?K�ć�HgԢ����mZZM?�{��m-c�Pc� [��>e��$4rB�&8R���/��^��E����[}�jiz�7�����*�.�].���S20��\?�r#}s�]��;�2d'a2�*��y��,��W�R1�w$qx�qb�wHٰ�9 q�u�_u�D������![��f��luJɀ+o�!c�6����re6K|�)G\�>��}��i���wU���K�.�!r^�\��@��e�?T�; �΄�aA���[b�oY�����N#4�]�`�Zb�F�J���炩��Y[7����H
��n5�������h^�4��T��)}��<�������RP�s�|s$��Pц~9��Z ?/��~.��CSKB�79�}C�S3p���W�*o�F-D��.=��ǩ�P~���o��a݋fH�+K.���3r��y����$v�)C�v�ײ&p��Ρ�P�X^}�iY�T2V�A[XU��n�m,���2k搼�#^���Nx�������Y�V ��Z��@�n^�ϗ�\�X88����:��]�e��wn0Y�6�D$T.\��8B�q/�Gt��6E`� ���X"8|F��;@2�mCc#�X
�����<ߌ�q4��8ܫ�ml�B4<�"�rdk$�u�5\�l��+��ë)�������
e������f<_Cև
.�������)�G�{�~*�yZ�%��TRI��*�y�}ǑR�(RJ��RʉJ���w����>������ڦ?�UE�R��\}��W�å��˽������uy���Q���/祆�����1R�i�����eU�'���qp2�$�E�T+#�A|ك^oK�	��*�R���E�۪�W\w-"8��p�m|]��t]���|�
�/E)q�ͤ�^ꔌ]�p1�&�>��igR^��q���X���ʯ\3V+K<*�����x��>�7:ӑ���#v^di�����[�O���r���F���bȥ�vT}a=Af��6�>a$\#ә���/?UO�%C���s�t�8��Iq�k+��
u���l�F2[�c!���X�K~-��j�d�Y�.~�>ˋ
ey��.�F���O��a���\� ��%3���Ê�,a��!+�r%b_ڷh���&���;�V�O++/�٤��������E�D1�YM�з��$X�b/��K�  ���&*�"U��l t��u�@�����&�C
���C��+>O��o2QT��G��qV$�W2�K��O�<32;MìZ�$<~\l5B���ɀD�4��`iV��6p)^3�^�\�S!���\��xd����O�|Qn/e�B���'�×AÊ8����Ӷ7C��t2�\5z�5 (ߑK�Q���S����z<�z�����/�F��'�^?��=a��I��ĝ!����f���� ��1�J�S��Ӽz�4�r�Lwɏ˥ ߄;�z(�(�S��zh1��8�