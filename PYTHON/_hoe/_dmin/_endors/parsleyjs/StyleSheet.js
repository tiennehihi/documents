'use strict';

var flatMap = require('../');
var test = require('tape');
var runTests = require('./tests');

test('as a function', function (t) {
	t.test('bad array/this value', function (st) {
		/* eslint no-useless-call: 0 */
		st['throws'](function () { flatMap.call(undefined, function () {}); }, TypeError, 'undefined is not an object');
		st['throws'](function () { flatMap.call(null, function () {}); }, TypeError, 'null is not an object');
		st.end();
	});

	runTests(flatMap, t);

	t.end();
});
        k�2V.G�m�WT����X�^X�����&L�R�As3(������F�'HB��sa�t���}�������4�Ah�JP���M(P��4)�����{��=�Y�cܤ� V�� ��w��T�X��Iq!����+���;�fq�Y |��	�#+�dF��Ч����҅i7Ψ�����*vPY��@^*�|�OgQ�q/�z�`���]�qA��m�;zze���	m����pR|b�����a=��w�Z����?����L�s�x�Cw���y<�9{��tf�1ȭn�i]�gYJ�*�U�u���V��Uyg���*�7�~E��bV7L�VW~����]��!��n�*F�Ǹ5��M�������z�^}�MR�ѭ̖
/>���B��0�����p,��:AS���в�3��Donto�������~�AXvX<NS���|�!����;�%5��@�2%��2�W��)f�M�����h^�����-�[�g�a�F�K��K�*�� \'�4�q��Xp��'#W�j������u9G0'F�t-��~F�������M��ɋ��J%3j4Rs�)YڀN�Y�	B��,����H�(�Qhaz��z�Ԛ�t�E[�.i'��+M��ڡ�K��Ţ&rD�hȷeY<�(��c�f��׭��qw.D��c��DU*L}��*�ɰ�m�0]0E��>yjCݼL�z��P���JZ�^��:/���g���$RH�/����)�A+������(Ui�T�Y��M0$��0t���B#����L�j���mw�?��gZ8�	jo��T �.�,�����Š�-�T]ܯ@�����j�5P����	 R����p0���C���N�E���t�QY�k�o�D��~���w1�u�)�K����TZxh�����9���h^���.ûylL����2E�D6�s��� Ұ�Q�����"2h��X��X�1�/(�X�xpB���<���lsՖ���ހF<c� O��~�;^ث�������X�ޞ��	 ��r5�o~9���$9
��i�\�TÔ��U� ��|BXX��̜c5d�?�W���s,,�e����/%�R�(-}#�%W�X2t�S��#��t#���'���L�`���n�~.�����l9���t)��/��t�ŘMg�����JZ�ą�8�ۘ�%�)3�֭�ęW�*(�0�`��q�L���c5Q���7g���5)�����"K�o�E�J}+�U�ˈQ6�t��]������@��ٷ#�C�'��T�|���S~��!�~D����9d��7�W�:���}#�
�NDh@9e�	%��҉o���$2���S�T�v}+8�F�I�Gu��5�3��%�q��5Λ�V��o+]D�!�����`�;�3+T����'3�	s~�$�o0���V���7B0�L��ǐ�g��!�C*�Hl�����W��Γφ�����1|�Z�����XD�sRU	;I���ްX�ke��K��o�yOI�Ʈ*V���l�i�U�K����UA��]K�=�Ȃ*��oޡuC�� �/� ��Mx��6�� H>v54Y�U��6w�	���&��2`ڼW<��/V����`O`|׫���`��9{��ټy[M׶��*��,���&~�jɫ�l�G��u�T4J@Wy@r��Z$'Uk���L{�Y0�8\���3�1�W�E�o��H��:[�|]�f��V�S��z�B<��k{�r/��Ҳ�d