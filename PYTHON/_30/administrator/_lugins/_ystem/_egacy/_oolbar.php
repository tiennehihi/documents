{
	"name": "postcss-preset-env",
	"description": "Convert modern CSS into something browsers understand",
	"version": "7.8.3",
	"author": "Jonathan Neal <jonathantneal@hotmail.com>",
	"license": "CC0-1.0",
	"funding": {
		"type": "opencollective",
		"url": "https://opencollective.com/csstools"
	},
	"engines": {
		"node": "^12 || ^14 || >=16"
	},
	"main": "dist/index.cjs",
	"module": "dist/index.mjs",
	"exports": {
		".": {
			"import": "./dist/index.mjs",
			"require": "./dist/index.cjs",
			"default": "./dist/index.mjs"
		}
	},
	"files": [
		"CHANGELOG.md",
		"LICENSE.md",
		"README.md",
		"dist"
	],
	"dependencies": {
		"@csstools/postcss-cascade-layers": "^1.1.1",
		"@csstools/postcss-color-function": "^1.1.1",
		"@csstools/postcss-font-format-keywords": "^1.0.1",
		"@csstools/postcss-hwb-function": "^1.0.2",
		"@csstools/postcss-ic-unit": "^1.0.1",
		"@csstools/postcss-is-pseudo-class": "^2.0.7",
		"@csstools/postcss-nested-calc": "^1.0.0",
		"@csstools/postcss-normalize-display-values": "^1.0.1",
		"@csstools/postcss-oklab-function": "^1.1.1",
		"@csstools/postcss-progressive-custom-properties": "^1.3.0",
		"@csstools/postcss-stepped-value-functions": "^1.0.1",
		"@csstools/postcss-text-decoration-shorthand": "^1.0.0",
		"@csstools/postcss-trigonometric-functions": "^1.0.2",
		"@csstools/postcss-unset-value": "^1.0.2",
		"autoprefixer": "^10.4.13",
		"browserslist": "^4.21.4",
		"css-blank-pseudo": "^3.0.3",
		"css-has-pseudo": "^3.0.4",
		"css-prefers-color-scheme": "^6.0.3",
		"cssdb": "^7.1.0",
		"postcss-attribute-case-insensitive": "^5.0.2",
		"postcss-clamp": "^4.1.0",
		"postcss-color-functional-notation": "^4.2.4",
		"postcss-color-hex-alpha": "^8.0.4",
		"postcss-color-rebeccapurple": "^7.1.1",
		"postcss-custom-media": "^8.0.2",
		"postcss-custom-properties": "^12.1.10",
		"postcss-custom-selectors": "^6.0.3",
		"postcss-dir-pseudo-class": "^6.0.5",
		"postcss-double-position-gradients": "^3.1.2",
		"postcss-env-function": "^4.0.6",
		"postcss-focus-visible": "^6.0.4",
		"postcss-focus-within": "^5.0.4",
		"postcss-font-variant": "^5.0.0",
		"postcss-gap-properties": "^3.0.5",
		"postcss-image-set-function": "^4.0.7",
		"postcss-initial": "^4.0.1",
		"postcss-lab-function": "^4.2.1",
		"postcss-logical": "^5.0.4",
		"postcss-media-minmax": "^5.0.0",
		"postcss-nesting": "^10.2.0",
		"postcss-opacity-percentage": "^1.1.2",
		"postcss-overflow-shorthand": "^3.0.4",
		"postcss-page-break": "^3.0.4",
		"postcss-place": "^7.0.5",
		"postcss-pseudo-class-any-link": "^7.1.6",
		"postcss-replace-overflow-wrap": "^4.0.0",
		"postcss-selector-not": "^6.0.1",
		"postcss-value-parser": "^4.2.0"
	},
	"peerDependencies": {
		"postcss": "^8.2"
	},
	"devDependencies": {
		"postcss-simple-vars": "^7.0.0"
	},
	"scripts": {
		"prebuild": "node ./scripts/generate-plugins-data.mjs && eslint --fix ./src/plugins/*.mjs",
		"build": "rollup -c ../../rollup/default.js",
		"clean": "node -e \"fs.rmSync('./dist', { recursive: true, force: true });\"",
		"docs": "node ./docs/generate.mjs",
		"lint": "npm run lint:eslint && npm run lint:package-json",
		"lint:eslint": "eslint ./src --ext .js --ext .ts --ext .mjs --no-error-on-unmatched-pattern",
		"lint:package-json": "node ../../.github/bin/format-package-json.mjs",
		"prepublishOnly": "npm run clean && npm run build && npm run test",
		"stryker": "stryker run --logLevel error",
		"test": "node .tape.mjs && node ./src/test/test.mjs && npm run test:exports",
		"test:exports": "node ./test/_import.mjs && node ./test/_require.cjs",
		"test:rewrite-expects": "REWRITE_EXPECTS=true node .tape.mjs"
	},
	"homepage": "https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#readme",
	"repository": {
		"type": "git",
		"url": "https://github.com/csstools/postcss-plugins.git",
		"directory": "plugin-packs/postcss-preset-env"
	},
	"bugs": "https://github.com/csstools/postcss-plugins/issues",
	"keywords": [
		"css",
		"csswg",
		"features",
		"future",
		"lists",
		"next",
		"postcss",
		"postcss-plugin",
		"specifications",
		"specs",
		"stages",
		"w3c"
	],
	"volta": {
		"extends": "../../package.json"
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      v���J����i��\[(I+�ĩ��}~�q����v��B/ߧ�Z>�z]��yO��ƭ�_��W�4�Jr6UK��&����v"�z,�kD�DD䐙Z�5�����$����~�8 w��h4����9zF\����3trqO���,!�����#I?d�W)��N}���Rn|K��Yg�JI-��1;c�Ay+tx�1fŔ%�k����}Q�X!�H쇋�5_�����M���J2W�Ln]v�%�
��-������)�_D�ktԃ�.�&u��/� ��S��I=��ץ��as� dA/�5>c�*Û�<E3RR�{+CV+�9�%���Y���'�(4,�^k�zQ��j�t
2,�	�^�M}�k�� ?���N�!�����&U��Ŝы/���J���LFQ�"��z�dӅ2E9�j�����b�I��ċU~OS@��nFF��&e�J�K{�r��˳}�/�����>
w�Nb!���]��vv,X!�� �X�t�n��z|��5�L�l�/�w��g�"l���.�$`nڕ�����A:����Rh��44E4v��N\���}p���]�>'��e�>YIU7ә����B�q*��z��5�3�s��	���{��Q�C�
s���|� �l7#|�..��L�3�5��u���~�� ��zM�F��TMcQ��x�r���=���n��5��g�F~i�in��K���NU�6�t�r����OI$Q�8�#�=S� d�L7\��u�X^����>����u�բf\�l���W�l�bA�¸C�=��(�/��:���L�!!��.ہڟ�n��
%jc�AQ�2Ѷl��~�k�|���92��qj��6���Ys��?�<k��-�e�3��.c��W1���$�h)@�:�5E���Z?q�"A�jRJN�΋B�������|��	x�g�Q'�޻$�n˸ճ>���2����it��סF�7Ib���y�uN��v�Qi�Fp����eRi�ѐӻ���Ul�X��s���]}��s]G(��'6���=S�=r�����.Vh\z��(� ��[�?��GV���,�[�R���m�\&_)���B����q�ݦ �1�Ҹ���-FTZҶV�i�=�`4�8B��FR[=0liS9�ms�>���s�t��Գ����t<�(��m�c7���>`�����M�7�`��F|lD�L��3 ǫ�i�����n��Z7���.�J�"��*`�IPZ�~��Jn���Yg��!UZ�im����bį�PK2R�B9W�r->x7�Җ]�3�7��H��F��y�ױ��L7q%@��P�/�����-���{a�ں����f��)����'W��pt��mO^�b�ځO�6�<�	־�D+�3��Ç���-&���)F[G�fR�3/���=����ˊݵ��eb��x���tRh�qvԄ�Ӻ�꽑c1�ɗ�}{H�B��$���@)��R*���\q�n�Z-YeK���ǟ�H��-R�Z�T�GUpqe1�<A#��&_i[VS�%B�kץ�{3ْ�B�|Sk*���.D5�j�j�%5�\�R��K|�횯&��k|Q$�"�B��S�\?W�����S3���¾��4VI *��ȑ��5�ћa��F�+�eXj	���>��.��:7��z�
2�#p�ݲ�Pv�z�e �|���&cS#0ӄ��+ѕ��+��;���ˎ�F����_�������[�n�{z�^�T�	V9���Y=P���r<n�z��H4l���Cy+��W(៤VX�v�Va�(z�t
%�g��	��jvXL����W��0�ل�����d���+ۣ.�=D�d�n{���P�4M�Ó;CLK�Q��CL�M�dh%�+�[zZd�a]����ϵbMe���u����oZ8�k۫�^�l.D��.AX����_]���k~����?Ў� �2}g$<Cl�	���+�.���ц�/
&a����@�Q�)��d�lL��{L�u��P���^����K������y����y7�tؙ����5�5_6��1o����&nj3�=��:��s�ڡ6�oW�CZ��}ܺ\�@[�̏c�#<o�m4h��E=�4rS�dƶU��s!*H ��zzU��*�x�RJh8�:�?�+襔Vr0;��cyݘ�T��.��L5l��dL��k��㷄f���^ם
XS����������ie�����]Ƴ裢�b�u�<�g��Ur4�����n:	X�DÉS����lβ�>l���̀�Тö�N�5W����Nl�I@�m8�uܫSg�*���٠D��.�>5{��)(��O��P�6Pc��m�@y@�7Q���'�)7�����}� 	�K �sF#�1�(�e�1.�CDz8��YK����D��D��/���K#�}�#e��JC�0�QD�a�Hm�ԨQh�
s�T����=q;�%�l���yl�B��5�CV�� ��[��-�Ǫjγ���b����/>��ó�q�cw�����(N�{�zu|:
��q��PD�D�m�t\2o�j���P�K!�p������=�CbK*�$�5��kI��o��3
�'>8��<�i�nA,�7 �b	���+u��ҙN�P'P�Rj�0Mx�����k[���{sqۚ�$qS:��& ���dM�-[�����x�趌'M��4�n��#��\fFw��s�9]+��S�|r�4^�� ��9s���m��Br ,k3�+�e�,Y��]��2	;�a�H��n���<h��Դ�������˘���)�H#���=�v�qkdm�;;��aMA��59������X_L�3�sg��SYe�2���b��=��U�%Yb�ĝ���%k)�}�"��j�;
���T`�V�;.�^�ʼ�A�'������ئ�J2�'��%�⵵ J=Gfi42�J���˽�#ޮG�<>ܗS��.ɽ��Mi˷6uZ%��p�X~4_�ߘ�/؞iMozٍ�wd#Pe���O�F`""0:\��I�E��E���R����WKq@�!v,�pΘ.���Na�@+��NU�F�|Ƌ�L땟�{1���	�����n�77r�*Ic��\�;�t�!̓u�FгB{%��tkvן�h7v<���T�J��*jWx������N�B|��fM�(�:LR9I�jƂ�	zHE4)eXgigToj�n4_�ި��x_ksO���;8�*r��˪}	�c�MPU���'�K�6P��@N�iS���U+�m�QZf���꺉��hWkE�����������A��Mda�VQ�C��̞҇�((힢�+�A95$�T2���1nBj���FB;flm��Hr1,��C����赬΁K��؉,ܣ�q1�-����G������f-_����gq�1�=�ꡡ�tf�\�֘Ɠ�uV�D�6z~o0�Z�)g�͊�q0c��5|U�@�A#V���S`'�T9�+6ej�o
L��6L���&�S'N��bE-�p�>�Z&I�4P~uj��Y11NI��匸C��BM�H�ݓ�?d�r]U(ll����q;�=4�+2@NϐVh��|�L���ֿ� z��)��o;�J��}[2��7Ԫ�˰��,uG��&�W���&ώ*C�$��tߓ�Y�/M���`����0�~C�Y�7'��m�Υ��$��U��W�!�� ܮ4vzy������7��?ߔ�hM��a�_�١ni�����]�t�Y�%��4�'9���G�_!k_��1�>k�-fӨP@�|Rv��`���dk�H�k���zO5%��u�\F�_v�H���Ȋ�ŨC�&i�6zoG5(1�+��i�*:Ǝ��� �{�d:��{o�9����.�zw���'Z��M,���yqR��]�