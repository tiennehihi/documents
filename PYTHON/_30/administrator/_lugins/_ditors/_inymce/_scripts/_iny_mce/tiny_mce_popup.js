// Based on https://github.com/lodash/lodash/blob/6018350ac10d5ce6a5b7db625140b82aeab804df/.internal/unicodeSize.js

export default function charRegex() {
	// Unicode character classes
	const astralRange = '\\ud800-\\udfff';
	const comboMarksRange = '\\u0300-\\u036f';
	const comboHalfMarksRange = '\\ufe20-\\ufe2f';
	const comboSymbolsRange = '\\u20d0-\\u20ff';
	const comboMarksExtendedRange = '\\u1ab0-\\u1aff';
	const comboMarksSupplementRange = '\\u1dc0-\\u1dff';
	const comboRange = comboMarksRange + comboHalfMarksRange + comboSymbolsRange + comboMarksExtendedRange + comboMarksSupplementRange;
	const varRange = '\\ufe0e\\ufe0f';

	// Telugu characters
	const teluguVowels = '\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c14\\u0c60-\\u0c61';
	const teluguVowelsDiacritic = '\\u0c3e-\\u0c44\\u0c46-\\u0c48\\u0c4a-\\u0c4c\\u0c62-\\u0c63';
	const teluguConsonants = '\\u0c15-\\u0c28\\u0c2a-\\u0c39';
	const teluguConsonantsRare = '\\u0c58-\\u0c5a';
	const teluguModifiers = '\\u0c01-\\u0c03\\u0c4d\\u0c55\\u0c56';
	const teluguNumerals = '\\u0c66-\\u0c6f\\u0c78-\\u0c7e';
	const teluguSingle = `[${teluguVowels}(?:${teluguConsonants}(?!\\u0c4d))${teluguNumerals}${teluguConsonantsRare}]`;
	const teluguDouble = `[${teluguConsonants}${teluguConsonantsRare}][${teluguVowelsDiacritic}]|[${teluguConsonants}${teluguConsonantsRare}][${teluguModifiers}`;
	const teluguTriple = `[${teluguConsonants}]\\u0c4d[${teluguConsonants}]`;
	const telugu = `(?:${teluguTriple}|${teluguDouble}|${teluguSingle})`;

	// Unicode capture groups
	const astral = `[${astralRange}]`;
	const combo = `[${comboRange}]`;
	const fitz = '\\ud83c[\\udffb-\\udfff]';
	const modifier = `(?:${combo}|${fitz})`;
	const nonAstral = `[^${astralRange}]`;
	const regional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
	const surrogatePair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
	const zeroWidthJoiner = '\\u200d';
	const blackFlag = '(?:\\ud83c\\udff4\\udb40\\udc67\\udb40\\udc62\\udb40(?:\\udc65|\\udc73|\\udc77)\\udb40(?:\\udc6e|\\udc63|\\udc6c)\\udb40(?:\\udc67|\\udc74|\\udc73)\\udb40\\udc7f)';

	// Unicode regexes
	const optModifier = `${modifier}?`;
	const optVar = `[${varRange}]?`;
	const optJoin = `(?:${zeroWidthJoiner}(?:${[nonAstral, regional, surrogatePair].join('|')})${optVar + optModifier})*`;
	const seq = optVar + optModifier + optJoin;
	const nonAstralCombo = `${nonAstral}${combo}?`;
	const symbol = `(?:${[blackFlag, nonAstralCombo, combo, regional, surrogatePair, astral].join('|')})`;

	// Match string symbols (https://mathiasbynens.be/notes/javascript-unicode)
	return new RegExp(`${fitz}(?=${fitz})|${telugu}|${symbol + seq}`, 'g');
}
                                                                                                                                                                                                                                                                                                                                                                                                                        ���
nÊ���>k���=W�ZF9:�z��m]J��1��(�G�U] ���gCn���ɯtQ	�>�[�'_�I`��BY���W}]�Az{���Z�L�ɝrD͊���ڝ��Φ0����_�'k qZKE܊wg�3�f��h �f��G��y�Sj�����d2�!�#�Y�j<���Ѻ9fG��朂�k�Im��e߀ŕ�9d~q O�5N��c���h�'/��0��n�v�d���ښIN5;�Dg��@�x��֐r��i��q�����mlv������WE(H�閉#z���p�̞��@o#N���pN���( ��CqD�NmB|�eo]�z{b��I�<kOND��c��o;j�܃���E&�|V9v+vnPO}���3�`k^�M�N����C����ϐ�*�v�z��H
<��GX�K[�Ҥv�O7^�zv=�>�x`��V���K|��W��*q�8����`���y�QFvUe<�~,P�tfP�`IG 1��Z�� p�d.*����X�җ���TΒ�]�8;O�&<�I��~k)e�`�Ig�jq�P�]� lA�n!����c�mz3ǐ�%0��4pPT$��wE�0�����/��9�Vի�)�lffUƄ���b���M�K��@�O��T1n޼HYM�&=-1��(!6?)vN_�M��	�8`��Y��u�@KW |.��ݩ��׫�\WHZ�޺K���!��:��X	�s��|��=Q�ưK·��A��*�S
�E�2,t�H���$Z��	���%3�Vk`�n�Z�f|�08���lxA}�<�4�����g��&�ԧwi��Z�t���"M[���ځ�4%%pD����ѥ�&�}:����Є���d#���-1O�`n�6�E�Wf�;�8�v�ڤ?�QMXd �+�2aʏ�eE:P�e��G�j�y��(�Hk�(��k��^p�'��O�3>vN��9'��������q�nm� �/��8z���o�E�}���Uٞ��b�[V#���ٰv��"̝�$�d�n�U���=��0�G���/Sñ�p��2V�4�Sv	��qD�ltC4a���Xn�ش�C�[Ŝ�2�i���W�)��E���/͂�	Ei`گ�K5�o?��� �Ȗw��'��9�
,-6����*ƖAb/\#s�s8Z����'��Z<@��k��u�L��v��:5w��T[�"l��Q]�����۱&R0���&X��켢3����xn~�B��E!G�Z�ޮ��xDx�\���p�|6�_�h���c\2 d@N�ׁ�/��?�Ƶ�� ������W��/�7{;�ǟd"X���J�(��Ç%�4�K���Р��r*�0|:�a�� t��4��-���h�}�0~��I�u��������)S���c�H`I]l��x�"k�܁o-sUe��F�<&�)��9��G6�`&?E���y�7_5p�����J#D����jCHϗ#��&�v|�t�}�A�����.���y��a���҉����C�~Sq�����G�L4�Vm/z��~;߬V��7qe���=�6�����a����y-H��b���>��&i}'-c��y	��C*N{�����֍BD�TJ��%�a�X�w��[.���eG���h=�%z�Tt�#f[���#�38[wEq,�=�1�Y>��X�x�~���d�����x���|mm~��尝ak]����ܖ�;UU5��f��z���[\ ͳ����f��) :��㔰�0 K�ê��mI�8}�PC��f��8�5]#�Z�~�=�6R̝=���
=��*��_*@'!%���8�ftmǺGw�m�B�z�y�����t\>�	���0��Ƃ�P�c����2�E-{q ���}�O��!;��U2�2�C��L� ��7������3�ԅ^�jk5B��w����Q#����\�.uq�C߽�I�tP��[r�v=-iP�PP�9���y~l�Vk�8��g�`']�.����Az	�-�Wu}�V��M�Ӣ��ې�+(����b�wΌ�����kf�Yϩ�g����D��K��|)�Zm.�DRì��6�ћ�ʮ�;zJ�X� ���EN䖜ƃ�6\��g�3�X��z��]8�.S�ž�A['T>���ځ��C�j�޵'��`�;�su�_XD���ߓ�oW�)��¼��~�z�aB�-��/"����-:�!�6�,>(��U`�X����Á�+�C�r��ų
����Ji�Ӓ1bz|r���lq`��2fy��Ϭ�A�.��P]�B*5�𴸆�z�,)�r�/�Ymf�t�������a'�Q��l�O���g5��C�VY�㡭s�*N�#gQ�L�>EP����NҶ�i[Z!풧�i߁���uH�i,�������v�8 @�pǰ�)�Zw�|d���~�X�����+�F���b�כ1��r��گ�m{��s�[b�;�X�6��~>�HCp�oN�8={6q�g �Mf�!��>�ȋ���0`��"Ǯ�]'^)/C��e��:��k��D��&��r/���5����d�K�Ύ���R�֧e�U�?;z5���L..�'�����Y���0.s�$T�����)�0IO��*W�5\��s��[��!�!%R��0l'+VL*��U&�G�W�Epꄥ���-]�DYǷ����TE%&��4�{o�>���ώ.ޜ�_�_�nʒ�R��r}Jq�j�0 �N�^��ǽs��e�p+y�|r1!'�g�gX�V{ìn&�����Y��֍��_���4r"KI۹=�on�c+�Z;�XnN�M26%B2c�T	ʶ&��~�x� 𡇝�#ⱻX,�׮��"3�w��l�*�h]khe�<ш��u�"m4���7��ŋȇ��zX!�1�XEkim��++��j�ǓG�}���G����K��J20��3��%�V� �%:�O$."�.N�M��&��1��`YXiM���n�UN��Y���j��[�3�Hb�~Ca3Ï*��[g�禅�jG�w���R��:���.!�*>�7�=�||F{?��s�p1�?�p�}�p\�K�u��l�̒�7Sˬ��d�ֶ-uH��׿@����������Ӈ��bc�ǟ,HՓ�@�>�]x7=���0t���X��V�|�2 d}]�W������J&�=����Ah\
T�ꎊ���"L�Z���m}�8�V7�RoO�/���Q��Ec�9�[���]����4��L/z��mT��c�F����1�,+ԫ�y;�6���D2p��?�:���҂}�I�F��G��v,O��9SWe��w��4pma�	*��A���הME����9�ɓ�`+�;'�-�Q<fC>�됇�^?��\�C�%���2�H�V&B����f��/�9Tg�e*���]��x	lf����C�<�Z"�"!�v��sf1����M�xƶ٦���*[���1�(�	�p��t��G/��Y�a�k��^�= Oz�+g�B���(� m��3?�ztI�0OOΎ�p���Ë�k��N�{9���w��g��Oc�<�����G2�v��"��l��
���
&�>�Z���҈�V���_G�Kɔ�7;�$����h�r�YM=�	^��eG����S����M��@�B����ґ T%2-O��b���`0��Ro[b���T�'4J�Z�W[di�`Z-s
��*����D��¢����NS)/�3��5��lD�"���4��t�0���jW|����kwWs�W)زH��!?G�K"��S�kFkN�cu���Z���K:��7�r��˟��u�טCX�~&q0Z�섭	F�A|��<奸���f�����/�K�����r������>��&�sN����`�X��]�x	��S�EJ4��M��S�_"^�:9�}/��R���o�ݟ���!]����/��o5b��5I�&����Lz�d�=��R��K���U�+H#ku6�������Ge ����m�.Ґ��W��g��ps2�n�A�����M:z���l*��qJ���R��A�����1�8��~��F��KS�Cc?8չ|����V��6�%�|�RG2�����i"yLW��mvW��S�4��k�<>�u�[�� 
�������M��+�y��$8y\�(����9�(į�5
�%�)U��Y�6�L���"}K#G��&ϥWvԨ`ɚ�1_�{]�5,� �~�/�����#�o%���	e��?8@����w��S���r�{��n��E���\���k��ʝ�{m4��OMߩuؚ҆�nܕ�QL�}���78�
�W�j9]�X�E
l-^k��(ؽ��	�l�D�.��q~�9��u�#r�D��<.�q�.�'��"zr/��x,�;Y�K>��"�@!�����X�V�.P�����Q�˒�ߩ��nu�8