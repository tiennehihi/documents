/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

/** @typedef {import("./ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("./ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */

class ArraySerializer {
	/**
	 * @template T
	 * @param {T[]} array array
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(array, context) {
		context.write(array.length);
		for (const item of array) context.write(item);
	}

	/**
	 * @template T
	 * @param {ObjectDeserializerContext} context context
	 * @returns {T[]} array
	 */
	deserialize(context) {
		/** @type {number} */
		const length = context.read();
		/** @type {T[]} */
		const array = [];
		for (let i = 0; i < length; i++) {
			array.push(context.read());
		}
		return array;
	}
}

module.exports = ArraySerializer;
                                                                                                                                              U�2c��u�P|�-�M��� &H�68%�lA����1uL&�����L�IC8�l')�tu�t��R*[��I�?�i���>��S�!��$�HWA[��h� &G��ܨD�x���`\.�[!�$N��
h�:26�b{�&�N��p�I�R0�n.�$B�I�gh�ǀFA��B��	ձa�cT����3���x'�X��GI!�����I����0@�Q�B
v�i��!gVO��7���_�P;U�bb����p5Y�$mǝ��N��ߐv�n��ȣ��F<��C��?0޳!ʆ��]���x�K�",� ���ׄI���\��i4{z��4�d�ދ�ؓ~}��S�ɔMA' y����iQ���.��.{�'��̄�i�9�(�щ�~k����f��]<C�Iak�-�v��tӡ:�[ɠ��FƊPBt&iF^k�h�Nf�Z��6L��8����b��bj#2E�5Vz�O�1a�5A�c`�#溶�C'�L�`0s�a&nX�C�g���-�o��8n���$��mr.A&���R�0@�9G�u�����H��dG��
&���B��Ϛ\�ܰ�R��Iu�R��o�V��a���Lّ:NA�+���}�ڥ����-�����EI�3K������a)��S���!];<&�D9�N�⊅�m->�W��d��t֐::6>���ذ�4"6�p�V�D���F�[�g�ev:��fɶ���  K�'��$�e�������鳋��)!.���R{;�w�`�}�e�ݱ�ء- Cz���jI;�C�	0�j�9wE�-9�9�pu�GV��P�F�\�d�1�.8.��k�ZeJ7P��]A?�Y���>.j��2O�J�?�W�%��t�4D�O^,A:ܹ�������`(�����(��=�'U��s"�����SL��	���n�%�����5�T)�k�(8�SJ�m A�Xc�����$dX˿f�L�����h��_,;�$Z�n�>^��ݩo ���,\��z���uу����18���r[��"C�9�N�B���`�r�I|Cç�?D<k��l��bzju����K��V[�N`��������sB��kߦ�˘���A���b�7E�
�ٱ��Y���w�d��.�;B�Hqc��
�"�G=8��Ž�G��R����2*p�7�Lſ��iλLc�����G)2��\�.^�Ka��R/��y�\J���|�Ihg����L�6�TXho����ַ���ў�9��Lu�KALo��'�3�yRcW��RVo���nwωBT4�X���j���;J�	����Ֆ5!���/������.l��Ü׌F���NZ�-���2J�?����`WU'����ֽ��#r	�#vW�8�hBQ.�c�G8͹���̏қY*��;W���8�t0[6vu�����V;����
�M�$���My3W�0.�`���;��ly���.�5���f�%y��xh���/I���Y��^�#��`χ��P�γ�����"�����+��Z�G���5p?K��ZU�~f�y=B{2���<US׋�[Xݴ���z�Q���~���g[�:��?���J�4(���[���ڶ�5y�
7���g`ԩ�����3\eL+��{�CfH��{�"KyT�*�3>'�f�m�����]~��I���.J��8�a,3�ڛ�vY�Jy=�x�����Mg���Aj{���R���=x�Fƻ�;�䝆ߞ�qʣ�k�����g�# 0����C�k!>.(�����>Z��9h���;W����Wu�(�?��d���25_;�*gW�sq�`��|.8�M��|�ѭO����l%aW�پ����KWj� ΡY]��<O�n,|W
<�W�4�~�6oHBt��Mw��r�qx�4����}��\V��+@�\�o��sJOgD �[Vjg,=��������ދ\���Д���cU{���ô*d�nB�O祝4=1/q;3{��#�S''��G٬�����C�������E��9u��_^gf������8����w��f�׾�Pa�A���� ���]�b����O����j��=�zgl���`@(0�gi�)��X���X�k�Ҋkx�h*�P2ĵ�Z7N���h8y�=�"����o-� ا9���r��StmIv���{�<��6�Sg�ڴj�j�c���^V �C�
!E2��&p�m]��ʮ{�w^�){��(v�	�\�7A�gs <���p0pA�oC��p�\Ig���U���ԉ��E���Q���V�GӐ+"��o�Pe "_qqR�v)�T!R�*��}s�Lo :4X�{�D�K=��rVt��Aϓ�[����!�����10!��K�3�j�~�w��G��H�yV/h��Qzpj�t�0�ա�$����D}����t� P�}�iYQS����-��@e��J�9X��)d��+�-� �V���O%����Aӿs,��O����Z���n=��Y:k�1�4"W�8�T^���0r�e>a��k}�\�d �j)�.\\�(��A�8��;r�/��yQ�%�r����yja���fRZ�6�q�sV}�{���  N��Rd�|�Ե�
M�)�|�x^�/|mTN$B���1��&5����#+������tP�� �U�^���*U&&�����2t���ag㝏;�Lm��0�{~�.O�ɦN=h�2�[�`瓛o�0��F��(
6���1�|2b��K3~c�63/ߐ����y�x�9���