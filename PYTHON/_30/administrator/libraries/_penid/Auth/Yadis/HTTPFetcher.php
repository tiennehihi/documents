'use strict';

const detectNewline = string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	const newlines = string.match(/(?:\r?\n)/g) || [];

	if (newlines.length === 0) {
		return;
	}

	const crlf = newlines.filter(newline => newline === '\r\n').length;
	const lf = newlines.length - crlf;

	return crlf > lf ? '\r\n' : '\n';
};

module.exports = detectNewline;
module.exports.graceful = string => (typeof string === 'string' && detectNewline(string)) || '\n';
       �a�F�AGBg�����N�גoHw�D��љ�㡳Cg��;:Wt���-��yb{��9�ClG����;`o��#��ػc�}{/콱���9�#��^�1c�Ũ�S�F7��-0zb���Q���Q�Ejആ��QgE��oܾp�ᾋ{�)x��ȷ0����x���|��1�aa<�g��O���s���9>�^W|V1~a�ŧ�q����"��;�/�>k�����+|�H��'eNʑ�	)wR���d�d*dJd�ɞ�}%{E���T�P=����7�ߩ~�����ϩ��֌Zsjo���NH�u"���ӥΐ:c�%�K��Q�I�+|
�h�dK�-���ii�R��D��%ߐ���ڣ͌6��y��hW�]�v-�Uig�Ρ�K��gtҭN�%�
ս�۞ng�M�6�[H�#�
7S(/�w��-.5����f�ŪŪ�j��'��Y�Ym�ze����Ί�2;1׫��Q�n�Sb��Ή�+�����n�S���3;&׋.5�+��\���bgĽF<��`ǃ��)�<��Q��2�'��<�x��j̫6���Ly��@�_���j�j��:�4^^y���W�
�]���)�/|��R�s���W>?�|�s���&�U���Q�G��}~����1���I�I�I�o_H{!݄T��XHg!݅R�M(���B��:G�-���	��P�U�ׅ^�+����Y�s-��t�)���j�o�~�[����*���WE�,����@����AEbp#[�U1��X�BDkD��YD;1ߋ�N$�H�"q?�2�wP�A����������	� W���x���5k����tF�YB�	�9tj��S���:S��Й@G���t��7a2���.L:0�ä�Ll��`b�$�I&��)�ƀ��7�3X�r�w<�ؔa}��
nx��|Bb@�Cڀ���[x�Q�⠪�2B��� �'*%TtTk�ڨ*�VQy�rEe�JQ�Py�>A=�z�o������ַXw��c���*��X�������-z#���`��~�:�=�+��b������v��|C�� ���8+��pz�yg&Ζ8��l��&Ξ8�p�,�� wܝ� �>�C�B|0i��I_u|�T0Q�5�W_)�^��`���×���I_k|-�u%�Fj���SRR���nI��j�:#uH�F�T���TU���~�{ �On���CrKT���; ק���1u%��[�Ι:'꼨�S�J��4Q0�`C���!?/@��w<��'k
�:�`IAH�=�5
�v(�RhSh�$�Х�I��f/��4/q}K�>-��ӲE�-���zL�$��=�t>��B�ݛt{�ݥ{�����)[Q���L�����r��R���VO�Y�Y���g����ג�G�j��/V笫lT�Qf�����'vo���ݰk��ew����E�݈��;v5���s� �'�M�u�+�K<x� a�̾̾ƾɓG#�Z��.GG�L��5x��"�ՆWg^]x5�ՊWG^WxU�l��uO�Vy��Uȫ=���z�*��WK>�|6�l���K�/:_>��"���~����ǁ~����ǔs~�9�958ys����x8�G�>��%J�(5E�,J-!�����(UD���(UE��[�JBi�#ԭP�B]��!�0:B���	C�[aX
��U�0��P��z.���_���Š*�b`��C1x��]��"��q]�]1n��)�1�E����k�7�G���b~�_�f".+�*��&ҦH� /@ރ<�yr�6��.�'�k �@�rS��	j;輡+Aw �t2趠�A׀n�&?��Aw]�u��������7�2�M�}B��$�(���!L�0[�l�	l�)
�x���&��C8,�0��s8,��a
��p
����<#x��فg�&$�&ddGx?Q���O<\�Q�P}���:B��j��klT���������/t]tX���C7���	v:�)P7����}�/q��E	�{\4qa�|����op~�EU��pa�|���#����x��H-Lޘ61�b�´(�1�b�`Z�4���ғ���'LcLϘF��1�`z������s	�3&6&�Z��f���� �Mf�L��
U��Nɍ�]�{$wG-�<���V�kQנn�D4T(�(�)�PT�pD���+
#��h�мP�{Z�h��u�����@�	�۴/����o�ޡ}L�
�:?���M���G��t��^��a��J�3�Ot�=�{N�Ac���ѠG��?�)��w<��#�c�'���4�R��V�I�9�鬙�欕���ʋ�
�-ևlX�4��sS�7��8s��ō��7�ܨs#��M���}��C�g�_��r�f�����O�]9zrs�q��i���缶y=�u��U^Ox����גoH_�y=����]^����z��5��|����˗�6|��͏���Nۜ6���X����RQ��P�BQ
Di ��P�B
�&�X���S�*̮0=a$�l
��R�0�9�Rx+�E	o*�=��E �4�/� CU�
�qW���TSULm15Ģ$��>��\�JbW������"^�H���(�H ' �@~�RE� E���3L��p0+`�``V�4�:B��=t�>�[�s�^���^z5�u�Wޡ{��B	��C/��!\A8����TL`k��[�:�p��a���p��=�{�!<G�@B҇dI I�2���zGu��� �6j�_K�=\MQ=��A����:j�j�mQ�6E����=�+t�>�1��:6��8bc��&6��Xa���=6v��`���-6z��q���l���c��+�O��p9���%\q��E��	.��4qq�e�*.v�tqW�]�S<�x( )�,ŷ������5�v�0�1�㻆��#fS|w0�b�����iEڒv"mI�G怪5�v�]Qâ�o��;N��sꎩ��S�Ω;�nH�>�_4�ҰF�
m�4�(*�J�"��7Em
S���i��J�e���Lh}����;ڟ���J�:�h?��M�8]�q�GB�.=��豤GD�>=��Xѽ�{�8��Iٍ����|���Ks������Y���V�[����sk˭���r�qk­7��7sni<,sp������91Kzt8�9h�d����u�V