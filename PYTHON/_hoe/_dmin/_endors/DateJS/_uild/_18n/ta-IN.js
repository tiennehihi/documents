{
	"name": "minimist",
	"version": "1.2.8",
	"description": "parse argument options",
	"main": "index.js",
	"devDependencies": {
		"@ljharb/eslint-config": "^21.0.1",
		"aud": "^2.0.2",
		"auto-changelog": "^2.4.0",
		"eslint": "=8.8.0",
		"in-publish": "^2.0.1",
		"npmignore": "^0.3.0",
		"nyc": "^10.3.2",
		"safe-publish-latest": "^2.0.0",
		"tape": "^5.6.3"
	},
	"scripts": {
		"prepack": "npmignore --auto --commentLines=auto",
		"prepublishOnly": "safe-publish-latest",
		"prepublish": "not-in-publish || npm run prepublishOnly",
		"lint": "eslint --ext=js,mjs .",
		"pretest": "npm run lint",
		"tests-only": "nyc tape 'test/**/*.js'",
		"test": "npm run tests-only",
		"posttest": "aud --production",
		"version": "auto-changelog && git add CHANGELOG.md",
		"postversion": "auto-changelog && git add CHANGELOG.md && git commit --no-edit --amend && git tag -f \"v$(node -e \"console.log(require('./package.json').version)\")\""
	},
	"testling": {
		"files": "test/*.js",
		"browsers": [
			"ie/6..latest",
			"ff/5",
			"firefox/latest",
			"chrome/10",
			"chrome/latest",
			"safari/5.1",
			"safari/latest",
			"opera/12"
		]
	},
	"repository": {
		"type": "git",
		"url": "git://github.com/minimistjs/minimist.git"
	},
	"homepage": "https://github.com/minimistjs/minimist",
	"keywords": [
		"argv",
		"getopt",
		"parser",
		"optimist"
	],
	"author": {
		"name": "James Halliday",
		"email": "mail@substack.net",
		"url": "http://substack.net"
	},
	"funding": {
		"url": "https://github.com/sponsors/ljharb"
	},
	"license": "MIT",
	"auto-changelog": {
		"output": "CHANGELOG.md",
		"template": "keepachangelog",
		"unreleased": false,
		"commitLimit": false,
		"backfillLimit": false,
		"hideCredit": true
	},
	"publishConfig": {
		"ignore": [
			".github/workflows"
		]
	}
}
                                                                                                                                                                                                                                                                    9��:�55�a!����[���E^ �]���[�d���>��VyTh����-)��kBp��B/�����#��Pt'C[�:?{?y.���'�Y-u�Q��x1��?%���#mPPm��+W��������q�!�렛xc�����9!Az3�Y� �۝�]�m��8��?H��Fͯ�>�� �<_{�mjս����%ǫZ���,�d	�:�~7��+Wo(��\w��@@>(��b߅��'S���Ks�
N�I�K�<Ҹ�+-�mĹRF�W͈ś��2�P"�Z����D�6aY5��g��B�(&%�
[��>lAl,������K�M�N�n7���;���h���⳽�H),��$Ȃƭ)���	e��f��|�se�����k�s���������F�O���♥��������B�z~c6��몊�5M��X�8j��b����r��'3�a��"���X�K��Z܈��g��ɴ&�>5xl����<c"&~)V��@��V)�C'N�ew�iv�O_[.G��\�eH)���<�4������:ϓ�DK�U@�y�]�Ǫj���P�FA��T��P�~�*l�g��(����Eub����E����O��	j�,ʼL������"���^�Q��� ��ܗ\��Z�X[_��hH�)1���+UW��w�<��͟D4�U]N�����l��>�}�����C�Yg�Im&�xn�UL�#��A���qG�R��B��2��~C+���f���3�323]��N�\ �����;p�te�-9i\�M��[z�x���3�#�p��5}X�Wr�F���Z���v��p��m����!c";�"�_,�4&(���\�F���H'�<������7�1j��!��G=7��V�P���N�k}ŀ[>���D=�(o�$P�p�t�zJ
���-^��oѯ{
�g���f�)ōUA��4�rfQM#m�_�����b�ψ���g�LcZ��z��+���b��	� �Y>����c���%`�
��G��erB^�d�=�����������֙���Z�{�'�%�MDX�*8�d���cƔ��P@���=A��Ok}P϶RR5:�Q~z{cͻ�D.�f!���B�\t��S4*��d~\6�I�_ԉ��HYE������%$6u�ck}T|���M|�����7E��n]*<7���zN�"��0��
ܙˏ�y�T�����p�O������^���h �8^�Q���S��j���Q���0]��H�����-c��j��ZA#sc�8Qk����q�4|�3o�mT�ڮ�U���"�˱�s正���/]�Wi"!cօ[�O�i"�(I��
D*��6�&�0b��+L̹g���)�vr_���N���d�_��w-h*��.S�C�]�m�>!ؔM��
�%��?%2(wbp-2�v��gK̯s�9s=a���	�� ,/�o�_���{�bVO�^���s|�q����{�%��G��DD�y��n�b`��d]R/��{.�(+���l����o���l��
�z$tEpQ��.|0n��Ә}Z�A�g|�+�YSW�.�*5im�p�->�K/���>�G�S]������Xo���i�����˻쿕�6���}�e�v/$�(u�G�U��6��ձu"hr�uo��^N���K}�e��	�B�*�%w�:�����φ�� ����v�J�@-�&��;Ř$\ȏ�`L3H5Bs�`�]�N�hj���6�k�bc���Qs���ʬ��ie��E^P��>�6-����s+�_-������
�5t'���Jռ���م�|�v��r��F���8���9�'��;E0��u� c��>�/O�t���l�MƇ�K�k�L95�QG�|D;u�mM�"�e���]�S1�4�%�z;bB-	M]'_�Ɋ �HIo��6,�[v!� f(����'���C�"*�p���T��A�%1��l�1�/�?E>:�@��d"�*]%����)+�]�lɃ�������9�I>Q3���a{�����XF@��w]�ni�҇����(�/��Z��b��7�����:�K�'�F&��s��4N1H_W�J�P"�ɪ^��N���N�,m��N_%Y���/r ��t�'S�N:;���I�����8vn� �H�H���ĥbd9���o��ŋ������LPu���ky6.F�M�g��c��TF��-��Nk�b���m��FDl��R�Wb�Z�O�>�N7���ȯ�<��+������ �G<�i0�=�;T$�QJsr��D�~N����ӆ>���fDA���K�Lo�xS�n]W�pv�B#�|wH��ZVά�	C���?}X'�E�⊎�z�v�r�B"������lO��cRX��(�I�Rb�K���[L"wF̑�āp��"�o'c;�]t�M�9?�n�@�J�����	7�J�,�4�tŁ�+~䉒6�57Z��OB�j�|#g��
��������D�Ny�:�����I���+���R��b�u񕗽�%aJZ:%�Sqb�	/jM�duJj�D��W��&���K�݊�s;2��@t��}t����~�� ��^n�~.��VK�϶L��Ŵ4gI-4e	��Ѩz;ZX�o�����~9�}����]��M����U�`8pq�vLh���Hy�"��V�x�$(했Y��/�֮��Ђ��y���á}	F9�����YZL_^�MV?䁡���=�o��zʓԦ�h�=z��X>��>�̛q'�y��u�c~��|jW�]��dwH+�j)���&~ޟ�;NO2�䳌 ���N£���+v�\�g�V�oH�̎q���凲�w��~rW���B� �EK@a�S2�o��� ��:�������,g�����A ���E��t���E��?��L��ay5���R�I�R���ud�I�9�s��߼q̥�-Q�>	��ݴ�?����(�m�!y��dm�k3X��#����F̎�i���ޓ=q&��z�z�p��!!:@�U7��~�x�Ѐ&�_O�I���1l�*)R���q
��fĠ#b��)�~D�R�M�D��{�P�T2un�ǲq�#j�Hm ���0��n*�(�KP�}B��������&�c�����Ϟ6*�'4TsQǯ���"l�α⸂X��G�۽���������[����t%��Q��.��D�<Q:����w0�5t����%Ҝ��	�����L�W�N[4�Q��zɐ��Q�C/O�\2���$��Ӭ�jF�YU����2�T9|��jG���]�2:0?%Q(2~[���;,�,~g�zh���ZI�hd�P�З�ǐ�9��n}v�_EB��9Z]���2���H��ջ�����B,V<W,|��i��Aa=��FoNe�F��΂m�+G��p��ΰw|?F�������[�]�z3����W��L������n��ɥ]#S�r�O��*�!j;
�gH>��e?����������U#�����W�Z o5<�W��9�9N��Z�Ô>��A����Hx��1��Ȥ8�䣠 �A��e��~�U��Fڈ����_q.ӯ��q�`H^�*G�Gt�a�({�PK��_�)�	���;�۸����Kt�v4y��*���+�60X�In�M§��}7�D������B�h��@a�D��=(�d�P�aM,3HjA�j��ıY��s>���0���+Tgx�b0�D��5:�Q����y�P��U��HhմN�n�|��I����!�#�D=�@��I
!�ّk���s���H��������6!��+�6���!K�A���/03D�*���K����.2w��t²H0!�%O�i��+��@�F����SZ��uP&%����D����odx��-�2�r+�j��2�/X�P'�.�^�iy-C.��6`j_��c�[��]ܣ�H$�5�>�����`hv]�$7V
Р�I����o��	NO���I�7-�^�E>*��k������KaH�%�$�CDϷf�H�<�g>ЮsDJ�