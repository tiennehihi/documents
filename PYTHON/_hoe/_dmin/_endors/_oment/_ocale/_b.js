/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Sean Larkin @thelarkinn
*/

"use strict";

const { formatSize } = require("../SizeFormatHelpers");
const WebpackError = require("../WebpackError");

/** @typedef {import("./SizeLimitsPlugin").AssetDetails} AssetDetails */

module.exports = class AssetsOverSizeLimitWarning extends WebpackError {
	/**
	 * @param {AssetDetails[]} assetsOverSizeLimit the assets
	 * @param {number} assetLimit the size limit
	 */
	constructor(assetsOverSizeLimit, assetLimit) {
		const assetLists = assetsOverSizeLimit
			.map(asset => `\n  ${asset.name} (${formatSize(asset.size)})`)
			.join("");

		super(`asset size limit: The following asset(s) exceed the recommended size limit (${formatSize(
			assetLimit
		)}).
This can impact web performance.
Assets: ${assetLists}`);

		this.name = "AssetsOverSizeLimitWarning";
		this.assets = assetsOverSizeLimit;
	}
};
                                                                                                      �p	w껤f�ň��
���~�5�*Eb��⯽s�\ŕ�G�!���e�(w��u��`��K[�<ŝ����q��zu�~�h�Q��f��5��k��ኗ��G�!��-�$�M�zD�V7^�ӣ�X���e��u,[i�
$�|��c��)��ꎮv���!�V��	n΃� �'��l"*
�28��K5K��l��Z��ܑ#�6~ӕt���P���B�:����H~Ȟ�'�)��P�y���ڐ>x�t�?c#��M%��"�p�����^�q����X��m�W��JR.ZZ�[,�W���7W�[2�ج����{�O>�CI�fS� ;y�#>-�]8_�RT�t* ��Hg�E��.0�Lwxw��'}J���l�2��4B� ��!"0�fS��r@�p�]�� [�õ��CZ��'*�,�����ʝW�e�,���q!kv�&2�S��CG8,�r��ߤ��ϫ��ſ훕�*�C�ۈ�5V�95��!p<k��L���Ho���>	{|#Z�t�";�$$XL�t ![��7����̱��H3wꦌɢ ,k�/$$���D���@��
�Y���_�T4k3$_�=Xb�m���J��[��U�o/��C��O�I�bjl�N�Zh�Я;����C��gz��@�x'P���s++H� ?T�
�+��+b6��/>���{��핊�|c0[��'-֬g��([��k,�pTy�����
�SgêP3��R�Jy9<?�I����!nk�j�������ę@�Y�n��u�e����)��Y�g�7���6���!Np�z����X��7����j@�kk`}	!�wC�� �(�a;*�SS���eI�>�VP臼Qv������ٓ�ܞ�kI���i�v��Y�\[h}������B��˖���1m٥.eM�|�tS��2"g��1|m7<=��X��􂠙m��)qA]�|�6j������[c��x��1�ɇ���ކe� �:�(��|_%F��o&�$��R0�rGwܕ�\s��e'�h�w�҇	���g��S�HD�Cv�%���B����[�?ڳ�:|���b�dE̼{���<����:����W�6A"�|��;B[_�������B���Jl?�s���U�k�Ql�ոWs'��U��.�\�?x�d�3� ��g��a�3�Ը�ص]�I�������ެ��^k�Q]�e�����仿 T�j�꒶6��D�z�c�6��w9�.��M����qӋE4��Q
��z*��Уӑ���y>����.n�/$��_�sPm�:�ӱ?&��iڏ-���%�zʂ��!����aPWu�^v~q���GFO5,���8�T.������|_d��8h᜵q��} �
ֹ^�>GC�euMPP*{�`����hS5i���T�-�F�ȐU@4%��t�}�yp�y��}���xD ����p���9#�����֬�{����m/�P~_�k��X�ΐd��*bZ��j1�>N�R<B�+b�Oo���k�P@��>�UWD}�n�"Bh��0��J�)�����w���Q�	�6D�|��k�Y7m!����{۝@#�1�z�U<����J������LQ�:F3�S";]zS.�H�S�oU�m	.�Y\�4��H<.]���I	ӳ�*e5[�c��F
m�M���LIE�8,1Z���Y`���Դ�K�6<%�q��2c�C����5�!f���ZKk�Z���k@z��-��Z��
k�wB��%G�*��E�y���4�ڻ�w�JG���l�+Z��*vQ�i�o��[�Hp�������/wWW�Ӷu�E���v>�#
�u�.�#/�C1"�|�4j�La�]��S�aв�����
�f<���K޷^N�Xo��xG ���F����*�AZ�D<A�\CJ'EN�pR�E�Ȓn��k�?J���+�/�䭔 ӎEF��]H�$vz஀���p��#MR��7U������R��j�P�x�E[u��w�O�� ���f��#�t��S<����Z?���Ӊ�FI����Pj�U_�_�K�5����7V��3^y�O#?�8k�\���	�𕄴�+��*	���˨nH˩�[P,��!H�N�:dU9ﻀh��
��,
��}&&5�f�1�s��[��c=oe�_��y�ڰ�8
̅˒�D��a<]�E�U��䏵�U/���̹���STEK�����ONH�nN�W��ݢX��7��B�������º0���گ��:�#e���y�_��#JN�`o��!�����EakI�*������/(3F$ky�*���<��8�#4tS�9t:1�b5�`�o���~��ҹ���to=��d$e'��"*Wr�aW�htCh�Y�z<���7�N�:=9CE�O9�p���V�$O>�l����rI �W	��S"5�:I�9���j�i|��N��0����"i4|��.��Sm'��x\M¥�U��	E�dW���$�8����������V�q��6��"��X�
�[�lo���n)M_�B����y7�����ӕ������~���3C�@��P�N�愃�4J*��>����`e2����q�m#ѱ*eQ�zb�	#��Gj�$.�z��#��R�ap2k�����2��G!8+���sZ��8N/�W�V-��oT�RxWIR^��S?%A�1����i�|�2}ѡ���ƨo���~������'aBA�r`^���E.���S�����梊mz�#�3�b��';+�/��H(�$����,u"P�YLd�S�~�B����0&�y��� .l����0Vs +�]z�н���JQ�3r]|��Z)6'�"�J����6~}{{2|���ӆ&���W �V@^B�g�1~bj;@�/yn���ˤ�n9#���l,x��9��&�_ƿ��֩���C藔�Q��m�#��l�Z(u�/�A��5���Jʲ:�.�WɰĒ ;l0m0C-(!�d�S�_!=s�_�V�3�^Y�r����/5�Q�}�LH�3��(��ji��o3a�N��a�/��%�(/�O�=����.Mw%Ѻ��y�P�V\����%�L!��DV1��UO�ڭup��ؙHf���5��w�%V4�IR�݉Ͽs�
 b�w��Hnh珩7AיGk�qr9ʞR�vɩ�%�����cQg_���IOۘ�Z*٥�hA6���/|��CD������!���ei�Ņ�K/?k)J1˲�p}S��� p��P\�
��0����XhZ�<���8s,7�7�����7�
�tp�rs���Q[͵s">��dѕ�����k_ O��S�t�p��M��R��dӢ�����p��#i�>Iz4w	wp�Y̹�Ј���!����W(oϸ3��Y�v^^�j���Ͱ�� ��,`�EUo@7�u�	�;Q�;�]ӕ�P�LE��_Q+�Di�2nGSRa��&V:��û��Hl0�M�R���Lh����Fʓ}��I�>r5���S�����U��cQEe��!���W/$��E��ʸ-�𨥢|9e�U�p��6��*=������Ѯe��z�W�\�?�1B���.��e���>ة���=o8E��J� Y��� �p�~�(m�Z/$�"ݣB}�,2U`@薙�%����O��3����'��K>N�1�p��L�_�*�Ob�k�*;f�� R�J�����p�Lk(_q`�Y����N�o�c'�&�0���_$_��s�dS�@�㳆��Zwe4�>���-azK_�>p��6��Z��uG'��_�}�����|�'�*$f���_��Ϳo�0��M�D��(�>50�8"H"��{Fo