declare const pTry: {
	/**
	Start a promise chain.

	@param fn - The function to run to start the promise chain.
	@param arguments - Arguments to pass to `fn`.
	@returns The value of calling `fn(...arguments)`. If the function throws an error, the returned `Promise` will be rejected with that error.

	@example
	```
	import pTry = require('p-try');

	(async () => {
		try {
			const value = await pTry(() => {
				return synchronousFunctionThatMightThrow();
			});
			console.log(value);
		} catch (error) {
			console.error(error);
		}
	})();
	```
	*/
	<ValueType, ArgumentsType extends unknown[]>(
		fn: (...arguments: ArgumentsType) => PromiseLike<ValueType> | ValueType,
		...arguments: ArgumentsType
	): Promise<ValueType>;

	// TODO: remove this in the next major version, refactor the whole definition to:
	// declare function pTry<ValueType, ArgumentsType extends unknown[]>(
	//	fn: (...arguments: ArgumentsType) => PromiseLike<ValueType> | ValueType,
	//	...arguments: ArgumentsType
	// ): Promise<ValueType>;
	// export = pTry;
	default: typeof pTry;
};

export = pTry;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ���Pԗ�.~�DB��Z���� 7�%a8/���+^��yCj5�2N(
d(o��)E����NDm��TJx �c�G�����Zc��jwګ"y�j��,���>&1cwYL�.ICf��F=mF���`�N�7���:x�2O��I��9,�f*�$h��?����u�哳*�n5�-P�<˘$��92����$��X]N��}�J�I��Z�( ղ/�ѡ��m:�43������Ly���͔��p�	 s���.��c���<�f�q,}V3����{�ȯ�C����r��3�?^����sp�ᇦi�2g{||��k�$|L�
�އCC����@ôe�ې���{g������c�+D[��`:���9��z�Ϳ��˖�C5�L�A~.������ˎ�̱l��:T���gq����X�\֠\�u�G\����ql��
��[8jz߬��B�(��W	�`+<]u�l��B��
(��V	�`�������t�<e��R�խ�eq��o�*����;f�B�en[�9����Eu���d�!�(���	�����ƷW�|Ӄ	�֥І�?�)Y�ȟ.*x�m���1}��l�I��8�"�v��jb
a	�
K1H6 ��f�T]��ق��p�s��g�D��6��г�b1��R��2/8��r�}y�f����W8��r���9/�l��������X0c�^w��B�GITס��M�F:����	��}uJ'P��y��5�5�&��i�W̚�Xۏ���&���Gc�m��a���c�)B{���W������9���_�LEMC���}G��
�G�T�.4�F���F�7��}��D���N4<����������m��_�O��pDKIݐ��uz?!���}G�e�^����u�k���bY�p�O�̖9-x=�n��H+�����ձ��W�2M��]����~��Ӕ��=����|��i��Mc^��4�J�����Rd���Re��h|�%�L�f�8Hߓ������51R�<�w#��+M2!cm��v���ăo$���8�j(]���N7����K:�=	��|�E|ߜ*֭f��F<㇜c�p�7�&��T �CH-%0��i.̡}
a�4����9�����a�=-On8��ы�Cz�V��a�+�'_�C/�y�Q���cD�j� �C���>��{�n��\��=��
��v9�q @!��jB�"'
�Z�����ğ��=�W�+(+�H�B�%,U�wz�ja*���)����@��s��SU�ki\@��-���K��x� �FC�x-�Z|��|8�s<��}�_�`s4?������w�Y�IyVM߰��W<ڍs.��h�Ǌ�q��  bQ��Hį˪_��_�eڍ!�<�
\u��4
�ZF�����+�t�����w<xa?9��qn��k�MO��7��~�Wє̘���0Ɔ���Rn�xN�3���z���N~�~$.Q�I�������\4(����̘٠i"�-� Hx�j��z+	��0���lU���P�M+��G�'JUKJ{���|���k6Ŝ/
�9���a��+t�q�TF7LM�E�7��J�Ơ�`��.QF�2����&��������9����$�@�Vy�B�GG�6z�؏t��?DX5�~-ћ� �Q+�<�	`Up��^��q��z�������-����`
Ǹ��ڋ'<�$-��+�Kh?e����$�$�V,]�>!�<G���կ�kB�V d�x5nI��P�`m�#����mHm��COq��}�]���^7_�K��ਗ�	F���w�2��c�x���p?sNE�wW �Z��[��MmhL�m�ׂ���Zs�IM��l����_/
V�"|�Y���-�{#\�L&�����^�ST�G�"G��)$̮��]�ٻ���@�5urϋ��$-h[��4���jѓ�M��A��H��Ƀ�MOAl~ �8�lAu��݇]�����>���ۧTLQ����2�m�o��4�A/�0�-[pI3H�w�#�t�ܸ[q�w�y�}k��]r����Q;r�����"�����0jSs8��_1z(���&��q��'@�,0�xP���ZW���.ϳZJJ?x�ݭ[*t3U�s�7:�Z�wr�e�N.�X���9�ѱ�0��ym�XɣfD�0��Lb�e�(��fg��I���0nG]����q;���M�"k+��`��Ȟ����<4���s�������u�lq ����mVܳ��2(�cC�Ca_�<�'�k4tM��v=Ut}��b[>���A�|��)���_�k@��jY��Q�]<m�>6M \Ӽϖ�dtz^�/�&�����>�ǟ���d�|p�M�9�h�/V�Օ0��Pku��ei],���}�����*���s�b�gu.jc�(@i4�������b��y̲r�6T%��l�s9x8���h��~��uO��đ�_�g�Y)4^��"3(��[n��s{��a,��	b�h�8^I������efd�>�5��o������U�^�[��O�����Ӏ�����zV%���;�����TAP�J��{�p|���ì ��II�u���d�@u�ݭHN��<+����H63�a�$��§)�mE{%�Ϣ����M��=4�����Z�����"loa��k4XL0dqy��*����۫Ve΂��V��`��(�!&�6J�z�Z��}Z��~�����@�WS� "�I }-sd�x}*V�VQnOJjԛ��|1>������\V�����,o!(���uu��"A����H��.�.x�ۢ�����쬘ڴڛ��1 ����S�'���qQa�
ZKB�͓�P�M�����������������·�����:�����%���w��Nw��޻����C�fgk���P�m5T�xb8����{T8����э���bRc/�qz������h��X��k���=���/യ�jR7(gQ�3�=�&��:��v�mN�o�~��4�:�!S�b��4�������1�����Ť�8���ss�k����j�$Q�+g���&�0�����69�����24(Ŋ����!��k�UA�@�q�V�Tq'�]�N��o�&%�+˰�#{���^�@����Y 4�x+���s�
��ʊ�B"�{�*�:G>��c�l��|>��� ~>�_wjn~�*P #I�{�W�i1�Gn1��f�-F ā��T�^������v[U�q4���Q��W��]����,��h�h����Fz�\���*/=+ծS^Ã�Qù�.�8"ë�[K�zli���}�d�Ǣk�@�!�{fq�ɝ�`�
����J롐�Ă���w�fL�jSS9�t��$�Sٸ��6D�z�7�l��JK����rQxF�{��yc�Z�_����-(��b��'<4ąRx:u�\����o�w��2��>�W ���+ZOJV����*Y���u�a�`��O�U� �O���uf�����#c��'G۞^ ����ͣ1�i@2����f�&�|�����aRVɦa�"!�9F[8ߏ����}U��i�"5���� �VA��% h/MS	�!��~(�E�գK�;�i�?��s;m�9~l��q~vVL�E