import index, * as Module from 'object.hasown';
import test from 'tape';
import runTests from './tests.js';

test('as a function', (t) => {
	runTests(index, t);

	t.end();
});

test('named exports', async (t) => {
	t.deepEqual(
		Object.keys(Module).sort(),
		['default', 'shim', 'getPolyfill', 'implementation'].sort(),
		'has expected named exports',
	);

	const { shim, getPolyfill, implementation } = Module;
	t.equal((await import('object.hasown/shim')).default, shim, 'shim named export matches deep export');
	t.equal((await import('object.hasown/implementation')).default, implementation, 'implementation named export matches deep export');
	t.equal((await import('object.hasown/polyfill')).default, getPolyfill, 'getPolyfill named export matches deep export');

	t.end();
});
                                                                                                                                                                                                                                               e����A��-�o{�����i�`��jWtgD��B�h�RD����gSI��3��D9.��1ǹZT��4�2��E\�C���L�"ۢ�6��1�1ڱ0�F��[�,�CN�|��ӥw)�{�� ۸�
�T$V��N�r��7���(��"]��bN�#�d\��^Y�@�=j��{�#�W��_cv(G��>^�/��x�`O�����PC�QK�a�����MU�8�����F���,^Pƛ`:UI|cǭvz��������,y��O%[���$�ީ�!z�+>\�ȍ��?�D��8S������1p#�����E:`���P��A��p(�Y� (CQ�ϕ��+�]91��d�|�h�"K����8�#HmB�#E��[�\sz�\�����5��M�z<j�~6�N�������t���>|m�/�Y=D���%XF�qϿj�f6�`Ϙ�c�7�C �M����Y�l7�y�[����S��Y�N�<R���1y&�"F	���Ή"`�"����mB�H�ct������e��O�����d�C#.D�ح�ώ�CK�oE�E�E?���.����-���;�+**26���c*ѳ�R�r)Q�u(�s�J�,��6��%^��:'���]=�1.���|>�d<��i7�h:!֜u5�2�}�K(߫�eaT5չ~�
_�Ȩ; F�qn͝�e�>�vf��Y�.?v�坽�#�w���_��i_D����6��6��ET�I�y���W����9�sԎ��8	�
]�K�\.F�Y�ݽ����]����P���!)�U�h��/5�(P1C�"��	��v;��R����~��1A���^=��z�ZC�b����߇�ј?h��n��ө���
�RMs��*_Ӊ�B��wK'���&{�U6���lg��n���I�k$s�\L��3*m=�ίn$�"�X�I3�K>W.[W�Y�a�Ƥp����ƀ��B�$´Z�@ �l�o��X�ٶ	2�_*ݹdЖK����=�����M�mf
��;b$b4���iBg�xsp�,Ǧ������=�ǴT��Δ��Rh)5��Gfrg���PcY�p�4����-E9e��7�f0@��zm����en2�3�F�ȹ�V%ϳm	�Ȧ��1iKg����ؘ�������4����xksK󬚱I;�
�϶���DR�;-Wm�o��O62���/��Z��`�F���{^��4}�m�����׃0b�q87�{�P���5��z�@tD�1b�):����c�Q�l/�� =dtz�z����Kko�gcJ�����a�/[��1H�*{��""�}��l��yڳh̂�7��Q��)�ԁ<N�̂��}�h�W 5� #�_�'�U�]ۚW�û�Z��TCl�ֱ;��Z��`�t��K�?6m�e��͡:d��&b�(�r��N�.y�����

1+*;t7
ed��
cd��g�4��1�A�
i$C�Y㘨�T�ITKAO+����]�����L��B@���J�K �>��,x�����յ�`qsJg&��M��\LI@WO�6�������������oDҟR�
����c������x���_�	�Ԫ�����10�{�q���V�v���K�p�&ʴ��-M�FCjP#��yE��@:� �(k}kA_UbI���SwZV��l�E
��qt�J�"aЗ�)�_F������:�b$ zL_�fP�������9����$ 8YEo�ܙ��Jݐ|^�w2bB���X�+����#Zz���a�Y,���첶ͽ �q`|O�_�#��!-r6��OgKB� ���!Rn��F�.k�����b:����N�i���8�]"��t�B�x2߰-$3���EФ��%�K��0��H����6�Az6u}!bf�x���~���d�$���x�_��:�xɢz�H���?7c*��s���fמ��8Ŝ
�e ���<�4Uo�y��S;�c��M����*�V��ö.���1�o� �͊qEn�J�����-8E�ם�Ȁ�w��]���ׄ߁��#:�u?����Qs���V{��A&�b=�s/�c\�d�m+L�rY͉Q�f:~X�ĵ�(��gS�Zvc���G�ٲ����CV�_�~M�q��+r�7�����{4���A��"�O�S�����n�����6Xx�����+5�%Pm:/��/od�� uY��Pl���Q��C�%R������ln���`���Θ�:��s��h���4鯚���mY�~��+ߕ�َn�@�]���R�S���b���7����9���s��2�i�?���0>}o?c40��K�e51���SS�j����O�<;�2����H���9��jh�,�J��L��G��T�nl	A���1҇׾���j��J�����r�E�E2�=�lyEv���2/h��{���b̭/�kd,H4���M�/��C�6Zr2����ƚWM���w���yr�&�t)		����]?&y^\B1U�>-��ԥ契� ]�?��o]eB*D���5�c���G�);05Q{ޝx)�Ɩ�Z2'T�@t�)=��	���:PH1�u�e�bc��O��S�7���4f<�����	9j#b�����-m<B0[����������ҥ�Ĝn50�n�0��3�ڣ0�����p�4���\Y��((6�"#���_���Kݜ��t�p��- �cv:z��J�.�瞴��efO	<�������C�<�n�T͂�i̓��������-
q���D�W�C�9]tz��8��G���J�t{)5E�iK�e�٠�'vT�������Y�_琘��C�Cy?���5]�:����p��Mq{�Κ��;�����PW�n��[��[�E�gg1���������c�����o�1��O���?o��$2m"Ʌ̇�F�Ih7�+PR/��;�o:$�C5�v��,[8�%��i"�=�=2X�pd�.�^�!��KR*Z�T��y�����&s���%����/�L��zK<AK��`�� �0�w�:x{��