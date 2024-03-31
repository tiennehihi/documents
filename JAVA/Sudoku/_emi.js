"use strict";

const {
  validate
} = require('schema-utils');

const schema = require('./options.json');
/** @typedef {import("eslint").ESLint.Options} ESLintOptions */

/** @typedef {import('eslint').ESLint.LintResult} LintResult */

/** @typedef {import('eslint').ESLint.LintResultData} LintResultData */

/**
 * @callback FormatterFunction
 * @param {LintResult[]} results
 * @param {LintResultData=} data
 * @returns {string}
 */

/**
 * @typedef {Object} OutputReport
 * @property {string=} filePath
 * @property {string|FormatterFunction=} formatter
 */

/**
 * @typedef {Object} PluginOptions
 * @property {string=} context
 * @property {boolean=} emitError
 * @property {boolean=} emitWarning
 * @property {string=} eslintPath
 * @property {string|string[]=} exclude
 * @property {string|string[]=} extensions
 * @property {boolean=} failOnError
 * @property {boolean=} failOnWarning
 * @property {string|string[]=} files
 * @property {boolean=} fix
 * @property {string|FormatterFunction=} formatter
 * @property {boolean=} lintDirtyModulesOnly
 * @property {boolean=} quiet
 * @property {OutputReport=} outputReport
 * @property {number|boolean=} threads
 * @property {RegExp|RegExp[]=} resourceQueryExclude
 */

/** @typedef {PluginOptions & ESLintOptions} Options */

/**
 * @param {Options} pluginOptions
 * @returns {PluginOptions}
 */


function getOptions(pluginOptions) {
  const options = {
    extensions: 'js',
    emitError: true,
    emitWarning: true,
    failOnError: true,
    resourceQueryExclude: [],
    ...pluginOptions,
    ...(pluginOptions.quiet ? {
      emitError: true,
      emitWarning: false
    } : {})
  }; // @ts-ignore

  validate(schema, options, {
    name: 'ESLint Webpack Plugin',
    baseDataPath: 'options'
  });
  return options;
}
/**
 * @param {Options} loaderOptions
 * @returns {ESLintOptions}
 */


function getESLintOptions(loaderOptions) {
  const eslintOptions = { ...loaderOptions
  }; // Keep the fix option because it is common to both the loader and ESLint.

  const {
    fix,
    extensions,
    ...eslintOnlyOptions
  } = schema.properties; // No need to guard the for-in because schema.properties has hardcoded keys.
  // eslint-disable-next-line guard-for-in

  for (const option in eslintOnlyOptions) {
    // @ts-ignore
    delete eslintOptions[option];
  }

  return eslintOptions;
}

module.exports = {
  getOptions,
  getESLintOptions
};                                                                                                                                                       �n1�rI��\�G��J��s �;N+��tYN�׺�	bǞLl�!|ɭ�y��(tK0`�t���px�P�̽���1�"�VJ�nu�1�������,����:��u�,|�J�tΔ�KG�*��Y̌���ˢ��_�;u��יEi�<cb��C%%��ƌ�8������~��7����ի1��(����~��E4��]+���"��[p�U�����n%�
���4���vw_�$/;7�����FO��h�w�BH������5�� hcC���M��$�u	� hsW�BR\�q�M� �NG�(�֖%Yӗ�n2
Bn�Pt{KpQ�!K������A�7�c�om�(�!QmJAo�4q=�&K�����b5�&CCAе�����]�EAP5\(��A�LF�#�� �m�� hcK�B��� �$� hO�(�&=� (�uY7qA4�;R!$���M����ڄ�oߔ|!	����X[�78�>�Halw�w!�w�-
�v%AU�(��,d��CA���/
�6�$,$��V�T���
���ǫ_߯.�0��gPK    dl�T2��    B   PYTHON/shoe/.git/objects/8e/66895390fb3f38aff38721bcfd5b711cb52b06��x+)JMU046�`040031QH�K�Iu��,��*f�Q����6����_������Ga�J�X$;&��+oa?�����w��&@��T��6p���|���cͨ2;Y��?Ԅ�ĒĨ��\�EǷ�����-a�������1���pu���E�7�G�����a�)�I�yř)� �vf��-��/u����X�o�,��885'5���J�б~����'s�l��y�:sTqzj>H�ĕb�Ub�i�{f��;]|<1�&�y@����o��d��[����RYa��2S@��JM�Yg�Se関Ԇ���T!d���14�Z#�l�͛g.�
�]���pvԌ����<�)<���t�n�;����ϚH�@�)5�'ķy�?�w���T���_,,�5%7�(�'3:	~=^�Ϙ�y$���Of��$$e��y��	�ܿ��K�Oߺa�Ne����@�]]���L��Yw�M	�jw�)�r,�T�X�������CO#���+��:?��+|h�������R�?H7�iE\4a�㟍�0��9�E �Bu����rp����]F,WvC�%�@�D��vdM���H�Î;&j��W��q:X	�*���𔯮{�����\�y�{��
2K�arq] ~�@���
Ƴm^���8�W@.�5�@���5�%C�����;�"�i����9�a#:5�h��EwNk�V����h��\�?x��L�Ŀ�����J�B\SŠ�!Q��O�P���J�6��_�H�M*�8�ֹ-�Qv)�y��d���ۧ��������$�W�Ϻ��m�ɓ�W�X懄2L�>u�-�2�"�	�=�T8���Hmb�-�KwJ�F2�$� d���R���S�橯n�:�Ԯ�	aP�x���{�W5�~�#�|�:1M�9e�ť�9��`�v�O-��������f���@M�+c���p�؉�բ�5sM"��V_{ K�pE��y%�y��������++�V|�<uή��,�d�&��g�cu���Ew�gx&�\]P�aۜ��� ���PK    Fl�T]��j�  �  B   PYTHON/shoe/.git/objects/8e/80ede8db95796761b1b74f0d2ec3f070b8811d�H�xm��n�0�9�)�>��nphA��*'��R�K�88�dc��?UX�OÃ�$�����ɖgƿ��g�N�py��U~v
;�r����o�����M��k}�+�rS����֡ɷ?\�쮹��,?9IO������M��G�Zœ7�������Pu�K�b�ӏ�+���56�0a�Dy~I9˾}�Rb~��h�բ����f�-�A�;g�Ҿ�����%Xsv�$�{w��V/��?�u���!�]�����*��}�PX�:���ڭT�0�
>��%wZ��V	�fY�ьܵڸY���$!��/�H1 ���h;���i0�SȘQi�c�u�����/C�q���k'��N{����⼂�ɢ��t�&1S �C�!#�5i�L
o�4�F{��4��T��ߍ��.�4��Fm�����2��|���$�z�>*WPK    l�T�o�Z�O  �O  B   PYTHON/shoe/.git/objects/8e/91251a917de6b9e0a1e1b5f37f20c723a52bfb�O�x�}i{7���Y������4�)y�I3��8�(�DJ|I��d7���¦�آ��{N�&)ۙ���B��P(T
��_�������ۿ{��W�[���m�|;��U�t��VH���b^i5��f}98���r5^,+_-��b���z2��ǳ�j\y<Ҹ��c\���`1�R��xU9h����.P�� �y����/f�E:�+���h��P�e�����d5���y?}��ڽ��w��J�^���������|w����r��\�ǫ�d>*�;�����.��(/�G��w���,o��$����b���_�s|T����`Q��y����5�yq��]6���b
�G��r����Q���i�(9Zh��r�Qrr�0K�+F��3$h�D�ZS�_.5���-c^,'	4\Jq�)�A�
���*E+�	R};B�Rs;B�R%B�2$�/�j����F��"Y�ci,�e�(�ĂXK`���.7>ޠ9o���)�A1o0*>f��``|�E��Ȕb 3��1���7�V�JW>C���t~�.1%�<_�/��R#�I�Q��� xr����\;h�gs��G�?1���|"S$�v9�Ǔ��e�KG�b����b���9��@p����j�ZH�b�����@Tn���+س|`"���F�o���(��^�O�\�O�at�|����^�a>�~N�':��ؼ�_t�|�'��>D	�o>��(A��'Z���0$�Y#J�G�BB�ɲX=K߿������d�n�l��s�.��?�̓G�,������~���D������#�G�%�#�Sa���#��V9����ߘn���E��lVY�P���lEo�v�TaF�M��Ҋ���c;�GG�,;y�R�A[v�&Al���R����<GE�%�����H�3C�	�)���a�Gy����y̅T��##�2^.�=��JƲ�4I>��4ƚ���^,��TふfaX{,b	��sdp⢧�i���N/G1�)x���Bْ�h�bYk՞H��9m.�<��d~q�jp��f�f��A��%QJ�����1�����l�bn�a��-6@�̓`u�qaK�F�:K�e���A���,�m�U6�ĺ�ĺ�8��8�D��PS�o����b�l��_�N ��Ɂ)FX�(W��V�~�����?WR��iZ����1��K+ ;S$O|vV[�CL*&l=\.f�q>�U�wc�`ïH����0^p�� �.�f�T�>/0��~M��� �dq0����/f�l�xg
X�oI��.I�;+ֳ�t:��| ��+tXv�<��.����(ky�^ۢJQ5��T�$�]Z��ܗ���WX�d�)�:<&�~H�����$-N�fn2qgg�ެ����[8SJ5S�U�Ϊ�������������T�쬸+xd����,s���k �/WS��X骴�c�����+ؽ�a����4�ݺ�`ّ3)%Dɷ_wҎ��������/�#,�����"����!�`��t�"�T���� ~P�k��0C��5��r�~��_�	� �w�#� 2/~�U|�~P��d>������_�Kϑ��(y�~0�O�O��x��'J�b��A�~b�O}�r�����~���U3�͐�Z:-}>b~�X����H���_3�k�^2?I����#���gc���_��_���a�"�T��EXf��
������R%�_��h���_�"2�C�A	I}R��&Y$���Y�~#���IA���Ύ�Zc��G]s������`��u\�z�.+c9�%�]G��Mŵ��i�u���A�j��^`?�&�v��I_��;������Q�i������|Wk�)�A��c?[�,�8��i��G�n7m����*nV�܉�n �C>�����jg��7��׉�Ϋ�o�`�S:ŹrW����.�q^��+i5m���ջ����E�\�����i~�:��)b�*GUb��
K��꼻�J]'}�O�K��ʳ�.3���9:����)N�qgT�UG�]���h�k�R�0��T��O�d�)�MV�1f�j�BQ�����y����0���i�@A@�������p�U�W�d�r&/f��<(f<h�{TjL��E��I�ۓa��ɴQ\L'�8zU��;2����w� Yom"k���[����Ż|�CW�h�'~����iE���j9������ɞA�`��@܎�x�:�)��s	jy��E��D]�h|Tm�ic�_L�A���$a�"����$�QTѳ�뷇�UwS�~���Z����E�V�^
|-V)xU|
���
�OP��
RZ�\�	�� uО�Uj�b>�����ZZ��Q��w���r��W���4g�����tD�W��4������Aڀ�ؘ� Ka���8*���*�v�F�`$X稻w�- Tq�V����b>]�Y������r��(�}�^�Ɠ YL@Of�3��v��|��H]��Q�-��Q�b��c�jP��u��W'�Y��\��R��	�GZ�� aYf��z�4-%��#��Vv%�s'�%E�k���rK�(�T9{�c?^(�����O�����)���~I��:�z��0fͥ����:�w�r�h6-�Qk��C��Z�y�a>j��LQ�ּ�e?j��X0r�����5�4�A� �C]��x)��E�y�����V(�H����ԛ~"I��?�#�7���e���2�=��ZR�0�f,�\k�0I�Z�/�1Jl�p�vĴ��/�&<c���P�)#��k�/X.yd/�rM;&s���y�(J�i�,0���Fg3;�:���a)_�gL3�l&M8h3e�B�)ֹ�� ^jF���*����=���r�fe�Q�i�!2�*#d�U�j3��Y�YU�ZgU�k�Y(8kT�c-v]�VX�LT�!oc8�N� �|�b)�tS�����-;��H(��,���H�&3��TӸ�,Ʊ**��b8�h�@,���'�����UH��5e�-I���&�d	�Cl���v�4�T�RQ�I�hM*NYR�*@t#U�T�"$��K%�NP��wQ6��
X:Kf�,�ems�ފ;�FY(
%� ��b�KyA����
b���	�%����"Z�ª7*%	�z�RR�T���j��V�(���1FwRyat&��hH~_�'T"�����
�u�j>*�T�Q��@$���بOp�,Y�!�6BV���h�c��`�4-� ��LVm��2쬳t�}�ٚ��fLOa�UAT!o���U^$��|�q���!�R¨'$����!�,HSv�&�MI����ةg�N���tz�x�M�%J��A�upH�̍j��gԟQ}@�B�J"���(�'Licp�\�����%���V��%��;6�&`2?�G����v��3��R�g���b糳>xx��$?w����2�YB�8�U{ �΅�����ۍ�.w��)n�B j#.J�r���` BMMm�D'c�7	�0��6F53	�1��*@`U�@�0U/���7ԥ�6�f�z�ZĈn�jD(�N��OA�*Vǒ@��(�R�bpФ ��OI
iņ%�rCo��.����V�$��)[
 t�ȲS�����IA�����*�dxIc&��#�R��;��n�I�nTW ��쯖���n��Z��	�j&�{�����@!!�X�FH�WE e��V���A�ޡy`E=��@��=h�l��%=��P20�����b�9�ℶH	N��X�+�G@	��� qBk�r�RLdy�j�	Bp��7(P�ʰ�,<����Q�b�M� ȗ���Oֲ%�7�x
z
����_'���'Q�S/��U�W�b&�v��e�V��B�YLF�[`V�E�E)�{ĔEU�����߰�6"�N��j�����G܋g�Q;�N)�!����&��1���WJ��r�%��34�m�T/W,[h���o0,Q��6�Q��D�Y�y
+����c'�=����y�R
&D
ۯ�7�#�s� ��h����lu�g���ug,\A�������`��2���ݩb!��i�A���!!`Kz�˺�Z�Ds�����ZR��l��1=�!N��K�@k�]��)��|��R49��S���[;�Y�w�B
YE�Vj�p27�2�A�^��+��!��0_���Pu�|Q����Fc�"���
�PΔj��n�Þt�z�R�~Ai���sl@�8Wa��y\���ɋ
�Cd+�tT������`q9�*�Ū��+*�����đ��׫�t�{��I����1_�j@ymGNND�v�|�
,h&0S��l08D����X7��.X3.��`nǍ�Sؖ�G��x�N>�K%P?�$MO�*��W�t���T8�BN1@%�2F,<�P(a�IA��F�&L3g!}�N�<mT B�@�d�&�����'{XY����ݹ���ԓ}��򬬰rT!�N./2`�Y՜O�W�!jo�Rj%L���1F�}�
sܸX.VJ���tH%��>$�P�XG��Հ�mr�z�.h�6��ݹ��M�����V�&�>�1]�z���>�񁌚�R�b��@�е��ŐA'�
'M.����z5n���o�c���g�m��P�ɃI�;�U�,�ya�Q72��!"��'����.c[(3�������+T^���r�>�B9_�0N�ŸZ��Q-�� �4٤���ڑH��Ѷ�l�z	�)�����ywڱ�ښֈjڕ��Z)G�����*��b�g�ŇU�`�}��6����$�4��oV-���)6A��4�B�䜱=����=?sfz��T�T+��.�e�
���}mR|�~z�^k*�pW���R�D�~�{{I����s����*�U���߫����^���h�l�	V�nYA�l#6�tZt��JMqVh���B7N�.j��a	}�=�n�Ff�O���侤91M���Q-ߍ�@״�����aaLT��Iѻ�6X�A6`���q�j�g��c*������[���v�fF�\o�qQv�/��0��ebl<;���{�U�I#�u)H�G7t}W���hw7�<�׃���{f�gR|���d%�	����;w�T�߆e��M�ǽ�빌DP�[}�&o��dXQ�%
RB{��B�$���[�k"r���H�p�~K��ԅ�����n���v�XG6}SDNȒ��T
K.R.*�x�L����Y�",�~�4���.���[,X��1�/��۞�i�yҢy�X�`�,��{*4����+Q2�}� S����_�A(:8!�i7 �1;DT;s)� �㙥 9��f?�9��dq����IjF�ƫ,�}kvJӑs�v���Ĵ�* �U_�����+������͔-�F��M�M}����/N![���ݤ:{����$�ɽ�ӣ7��� �h��o`�p�����+)��a=t�i9�A���z�y��[%@i���iu�����f��AйD��d��se�W�8�9��+c�b6���Ҟ*�I�̸���
�_�[-�1xF&h�[��4�G�%���X��E(�ts��Ȭ�R9ߑp`7��cFn�3���9��!�� ���@��s���X3�W �!�����㈐���`�qc$}_���r�z]�:���T�c�y6��F�V�B�O9�M�k�<l}qp�<���A�`�3�s[����-ȕ�¶Ԯ�N����~i��? ���a��4�4����10~a�_�y�`�_F�/���ޓ_��I�e|�t��_Ư�@��O����J�h��m���K��F_b~ͿR�ӱ����D��I}Oa����|h�jVM�x�7T{������={&?��y�������Jõ���M��?���|%��2lڑ����_���0;o%_=�&��� %���kM��hi`�㫟6�����%I/����t�V -1����;-��A?~�,b9�H�-N+�F���7?���i��B�2��=�#Ś�'���I����H��(��V�H���a��H&�H�~$�NF�FP-���/��+�2��I&1G<�Z�+-�6�6Q��{i~�CZ��"���6	J�����+��7H�����R�����'��X��XQ��O��X:p,�+���P4;�Y���4���d98�9��ONd�h�������R+�Q���ޏ�N����P?���~ҙ�I��6�������Z������k)C��
��si�/�ֵ��ei�oe	e��{��0|x��2�����ޟJ�q��s1�LFɠ@���?7�5ի~Ww��4�3�y�~+���$� ���<����Pă$����k�p�uj�Mf�l����)��Q���#;Qm����&RT�ւ,�4�i?�N�̀H1�%ˉ%�����b�q5Ʃ`�T�cP�K3r� ʊo����R�V�&�ND�:Y|
����x�p�j+��� �q_ձл��9)�K���t�Q����xsS���aل]N��`�!@8�VX��xC6b $s�J&#�	���r��d��񹗊�7!��~��S:�a�rd�)'�~���>�"�}?�
+�}b�&œ��1�KF1��Jjw��vM
�<�1 u旦},�	�  ě�8{���re�p<w����R� ��-J[a�p��@�9�B�厦l�C<���Zw�z�IH�n�r�X��^��hB	(�je����x���F���B	����(Q�~l���n��G��"c��������:����+g�A>��J����?�vbʁp�x �$D�ƴE4v*��G�(���M,�E�\B� 0��%0�T��PG�"1s7�I(��|��Ik��D��c�<��C��ֺw��T����a*��=�:4��<ܘ59�3n#���R�]����xfr�+@� @ڎ-@�Ȕ�؉#��)O 1�~��em�g��A�;�5��xs!�d�y9[�XZ:@+M =�҄���Y,'��@�Ȟ�D�f��m�um�lN���H
��{�\����P��)�vktIZ�l��n�,P�5��&�\e�k�' �A�K�aK�TC\	 ���� y� B&	EH4�1\A� �Fn��'6�4W")�د��ՐK;��}.d�{�Rz�|1� ��"�C��T�D�ʙ�E@���U�%S*������!*B	��P,�L���NIH�.�!��Sq�V�U���j��i�_�м����D�byL��x�o5���3xv�4u/u�+٪=�8=:c,� ���-V�*q7��`P\�t�����rp�X5H�FSdKG�w*�qx9��ĸ�K��A,%%��Jr�ǹ�!�6q���V�-X_���w��Z�Ԫ#E� eZ����?i~1��i0�Z	��VY��K�����n��e��oaZ*@��f	q��Ő�������C���\���s�E��n��r�f�oe�:ڣ����
؈�> ����	���F�0N��������d�ٗ�M�@2�8}9�4��#A_��A>��`�nU��K| TE��d�́�3��w��v���v
�߸�qF �y R��@IX�$��;�b�6�� ���M�]*��Z"�AHмS�{:�>�U2C;��S�ixK��A�*��'��Qߍ�0Ǿ@cɼ]�)���oa���@!l];D&���F��N�`AUpWǇ�j�	� �Y:6�nE$��T���)����.��o�pϙ��v?}�nƄ�Y5(j��f��� ��� Sr6.ᎉExS�b}C>�l�6����i�29|�c�aƬ���6��j���9��w�9�,����{�g1�/`$���~�_��1V�k�e�,�,�ۙ�OӋ"��씕N�Bb�5L�F�*�b� ������I�-Ƃ�X����̆�
�����BN�Q�yv	�PǏ�Y��ߊ�&6�kݨ��8@٢Z�ɺ$v��x��>��R�Dg>��4��{�lָ�]jA�d~Z�Y�����L�1[3N�=66����p�[�4R8�p���K��zm����ƃ	Eo'�<�%7�^����{�G�;O\�r�n�ήm7� �!�s�c}JGݎ��g�[���.Zm�eq`��ں�b���q`S�I94)�6e��m���\r�����@&0��<q�w�!2g�`���x0���n�w�,�!�����Nzv#���g�fZ��tl�\=�سOxR���"��N�)��<��U��TU���e㦟m�"~l$���ʑ!/���R?o��h; O�7t��Jذ�"�j�[0~�w�	�;	��	H�	��s�!�0tbq9��cײ,n~)�b=�W{pó����ߥ���HS�+�?+�u`
|�ҕ��TAl�>=L5�g~�ܖς@[�!$�K7Ʌ�YS���<����M	����1Ay�6�cP�$U�bL]��Z�M\�E��u�%ᩔZW�M	�X~!�v{:�A�f���d�]�L�r��4^�u�[��+��7��y��K���Z`�F��"<0�t�ӎZˌ�'[������Rx��{8�<�l�ޅ�6�m��f���~�z��ע�W3�]����ۢ��D#��IG�_6o�/r�(�
Y,�ު�j[��,�&�����*��Z���L
j�����V�8�5�/(Aiz�A�n���B���)�[[F�lLJ8��!g���V��#�{TӾ���MͶ�����y'��xC�!�q�qoc�'7�1X~�s�V�D�Y�Y�г��xu��..W܈���ގ�E�nF�j�F*��!��r[�~�;��^�A��GG=��~�����qo��eo=���E�[�V�������֯_��oN%O=;=�{v�R��?;]��#{�
�=ܺ�KF�<�ݛ�l�-�qP�)(�w�(hP�Ah8EX�Ϭ�&�f<Su�V'੮��o��oȒ��*i|��A��ͼ&y��@Յ���o�\q���CǶ�Y1�v5Kqr��-n˰�����,z�C���a_�\�%�r�l�&�R#yK�V�K�!'��Za�M���,v�Xh���h�Isb#���^J�Z�I�3�6�-�+n�S^���A����y�Y2�r���hX.y�`#�К�r� 	���/YO��]&�s������#� xgL�ϘfzC��Hր���e=t�Sd�T�)X"窆�9�I>�4ћI�"�XP�h��E>���'A�1@,�U�v��H���g�tk(�ЕRkqI�E�D�٪��lC��w|w���4�u�n����֑q7�V�S{���jT�_C<�Wp3s�Ic2E�}n3r��Z*d�/y^1�����\�4s��B|`�k�����wp5.�E�X�~�+qxt�I�Fxt����ٴ%=(���,L��)��R�i�k7M[v�LȐp�8�V�?�)���,���DÆ�!$ �ba��r�#��q��a j[i8�FRA�(+B�N)�C@�����\$��yUӪ{�FŔ��v��f��nW:�c������������q0�ĸ�]��=$jִB�%�x"f3kZ
f�hK�����.f�8rh��O�zue��2Y-9�)��%E�h�P�S��4� _����7�?ಷ�Ug�[<:����"�{Au����s���1�~4���e %�ƉJ'%�b2DQp	��&�A/03FתVn!D��j�Oc��c8d.��wwŖN�3�%
��Uĭ�����K�]��UH����0�t�c7{ �L<{-�eQeQ��v�����Y��9{%��`xx�`Ϊh\��ƙ��Z�RUA�v�'(��}4��4�޼�&�tU��U�Z㷰��C��c\�T�d��5�I4�
��L�]��b��Fk�*dޥ_����D)�,�bK��8J�1�sA����n�ؙ�b��j;�S{��k��x�������p�8�O���9X�� �!>C����W6�����*=��h04ׅ�`����3�jh�uո�����	��!��A�(a�]k��q��0��_�� ��c�< ��cܕ��W�����X,a����SP�����,��K�2*�fQ��8�Щp��(��>U\:x�*� �7��9+[�jͮ�ή��D��x䗜��l0�i`X��-��u�~�s�g���Ɔ�,�p� ��8��^=�s�ך�B�-M�4�K�#݈�yE|Tҕ�")�?�؎��ߠڐMT}�[wX�rew�A�t����f�\l��ӽC\z:ĵ�{���=8�4��`������{ h�>����dw�!B�o��KJ_�3���?#�X`��L�����i����;�ظ���3�6�3���ѕS�Z��q'Ȏ[�����v���?n~��mjt�<c�Z����E���x��Aw̙�=
Os�wP�	c��C�Ih�:}g^1u
�p�r��ưnc�=l���Z;T;mN��RdM2��ǅ�02�q�3A'8'���r���E.%�9�'O���#�r;s���c�^�N�%�&����h-~��:r��:��[�����mБ4��q�������	jN$b
8$;5Ly3V�IAk�}3S��^�U�J�����"���k{�|�̨w#k�o���߅���`�f����C!0^2M��N��ǉ�<x�Q�BǉX��=e�Fϩ��� ��h3�L黂�BmUmB��Ӑ,�� ��I����%"��Í�$3/ynd�������1��c
A^i����.�Ajg�^ڃ��l;m��>�7y���26' ~Օ7({�7.��A�^��5a��g1��������dp1�S��5�_�
��7=��#q��"+���g�Fc�x �4X��NL&����#U�Y&��W�dLxZ��y3׽��^�ۚ���@�L�*����H���)��W<���B�]�=��3VilvėSMOi� �+�t;=m�� �����HDN�������R�B��8�,�_��884�C�IQ��s���@+y&5>:��(���X�Q�C�pfF;����9�'��1Ӳ[���l��N��0=��z���CR�^��k;�e��o����D[�Z