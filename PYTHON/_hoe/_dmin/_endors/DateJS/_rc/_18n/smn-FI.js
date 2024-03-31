/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/**
 * Compare two arrays or strings by performing strict equality check for each value.
 * @template T [T=any]
 * @param {ArrayLike<T>} a Array of values to be compared
 * @param {ArrayLike<T>} b Array of values to be compared
 * @returns {boolean} returns true if all the elements of passed arrays are strictly equal.
 */

exports.equals = (a, b) => {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};

/**
 * Partition an array by calling a predicate function on each value.
 * @template T [T=any]
 * @param {Array<T>} arr Array of values to be partitioned
 * @param {(value: T) => boolean} fn Partition function which partitions based on truthiness of result.
 * @returns {[Array<T>, Array<T>]} returns the values of `arr` partitioned into two new arrays based on fn predicate.
 */
exports.groupBy = (arr = [], fn) => {
	return arr.reduce(
		/**
		 * @param {[Array<T>, Array<T>]} groups An accumulator storing already partitioned values returned from previous call.
		 * @param {T} value The value of the current element
		 * @returns {[Array<T>, Array<T>]} returns an array of partitioned groups accumulator resulting from calling a predicate on the current value.
		 */
		(groups, value) => {
			groups[fn(value) ? 0 : 1].push(value);
			return groups;
		},
		[[], []]
	);
};
                                                    ������g�Wx��5Δ�-xX���d�1l6���~�I?�׿�b�K���c��b���w�{����]�&|3��I)W����?PK    n�VXh�ښ  �  6   react-app/node_modules/caniuse-lite/data/regions/TH.js�Wǎ$E���>w�2\�A�� �Z���F��D��\XS�/Md�/�~~��?�8^����_������/ryJGJ���"% M� �� u��� w@�'���D�@�<�Mh���`�j�L�� 0�tC��hqۇ}f��hۇ���
JVCԓa����B�>E��.

Th�		�P3`��(!1� )P*@�'`6�,�
��pn 	A�ADA2Hi�Z@+h�� #d�̐���!�r��� ��P�B1��5AE���
��@K�AchM�٠�Z��bMl�P�E�l����=	�����z�^��rݯ'iT�
Y�y���U5�P")�#�ܛUi���d�8�~;yK(�F.d39�۲H���`����cj�1%�.��%6f�9(��\ųSS��1;u�Z3 o�93�{����Ѧ���²m�5
�o�[��zS}F���A+�Z�u�6�MF�PU�cpSP+ci0�$e��qa	UZ�2�i�/O��Wb
dE�<A
&����"ՇH��Ñ��kxR�N��,�T�rhc���|XtJ֤�%o"X���T��S��HiEP�REJ�<r��ܯ���s��n��:����1�q�uz<�B՚�Q8���V�P�_���ʼ��I�D�S�s��z__'�:U�V�-hYz?�ޮ�Co��X-7{����1t�ѡ����=++ƪ`�����V<�:=��[@�P�Z}�G-��}����W���iu���\�Pn�f4W�ٵt$1לI��Itև��2�+9�[y��<oe������2�B�2�lb�yn*c�D��������^y�xdǖX>0�[&���Z���t�ǖ}=$�c��3� ����G�9�ük#w8署��~2�ҡD�·F�� ɨ��2B���+#r�4f͑ψ�׏�&���_��Fb�7��G����f��0bQ��)~]�;��rI�©��!aW�5�����s��c�=Ma��$��×�\B�/ <���Q�S)���`�^*����*3'��u�����D�:\�Qc����gYQ;�̈�^C�C�)�G
z|���W��Z��.CH���f|�ի�M���:�ҏ���N�q�4���%�zr�.�"'瘸M���Q\*��I<Mfb��L��jE��������P,xJ3�jf�[�i��`�4`mɗq*�EG�3�NE����s�VfX��%z��/�Q��<�Kƥ�OB_�<��ΑA�4*;Pa갭���έd-�u_�$Am�맖��:�Σ3�o�٢t�6:WF�6NI|D�:��s�F�_?_���&�����WǕ���s����N��`bN�-��;�����Lzr��Y�O9_==/}ב��ܴK1���۱nX��1Y���'������ ��U�~��� PK    n�VXׇn�  [  6   react-app/node_modules/caniuse-lite/data/regions/TJ.js�WɎlE��WX�����b��t7���=� !���q7���B,XTV:��>�?����ޔ7�����_����痧V��k���\��&���W�<	��I�u�6�c�ik?I2�X\��=��0{�8MI֞�<i����hjAU{�\������C�
X� �v@T@t�
�@�@�	��W`�܀;� +�;4�F��\�֡	4���+t���Ï]�+t�� �@������VPe��A�y5P�`F`��:��El\Gpg���\�ck���F�5��}��k썔��������D0Ҁ�.j�����e��*v�B�gP��P���FK[W��čʖ�lF�� *�J��R��[�wyi��l*�+���=u���Мs��O]�~ɸ�����g�M�j�VL�M��Rg��h|ڤ�=����}�t�s̞��Kjc���z;��ޯ)���v�re�i�qr)����}�L�{��^a����&��M�	�.��i�l7o�6N�{CX��ln���=�v�ǀ���J5�Ǹ���m�+.*nc>�����`�S�1�b�F�ItCs	�f?�	]�Yt=Kn�S7�*k���h�\,��r�X�Ͻ��Ʉ��Mn	K~&#<I���0�{+�ޅ�8��z��D`�̏*�M�G}�;�L�
�<裿F�
�l�X��/x�� /��%��h��1���k8D"$�Gro��$H�U9wKK:S��]�L��wzU���F�Sj_��9f�R�n��喓����wI��1 ����1 v�x�p�%���4���sF���ib~>s>����)~�{�o�⣑?}~	��/^D��Ȋ��p�4>��5-8����9�^0��r*BW�k|pz�xJj/�|C�a)�9Fʩå�y��RJ�gqi^W���TՂ�O�Нn����������Y����7lp0I��{"�J��z�R�zL�X9��q�
^��t���>�!�&�t%ă����q�`�xᱴ��G2�Ʊ{����Fcm����q�Oq o�D��3��)��qc7��Lhiۃ���Zk�oLO(��P����F�%@uԄ'�x��^�'�/
A�ĸ-@o��~ul�ŃAºZB��R�d)�����8���#�g�}��Q����wܐ[k���� �b�0}F�񎡥�&�i�p�tH�Zp�?»QX5H�@�&_�/ӣ�Qԁ�%I�w&�vGV�	'p:�R�ޢ��rk[�궪��݋�"��i�52l�&��wr��o�/#a[k�՞�v��n`*{��&��WLi{'֯��z��{�
��Z}���}�z�|g�G���5Mt\\�:���.��N�'Y����6&}_?��B������{��o��=��i��n�o�)�)�|q\A�]����3��w��?� PK    n�VXА�G  �	  6   react-app/node_modules/caniuse-lite/data/regions/TK.jsՔɮ$EE�|�U��Ba;�B,�ǆ>��5b����߹����'=	D#i;&�\g�����~x^���˟�均���]7�!!����C"D 
1H�dH�TH�th�
T�M�-�
m��0��H�%X�X�5XG�H��H�1!e��T�RG�Ȃ�Ȇ̄2rA����DAQCI(̷�T���Q#��*��&Ԍ�r*jC�hM���ZF+h���u�.�n�	=��NN�8"yD�$�$�I$�H*�X"�l\�����sv��9>��@.�l����a�]c��E��K�k
&�w�����g��������/�o�`K��{��|���'�g鮸�A66l�������c?�v���i�~�a�Z�פ������C�����_���@��.|*��,�	D��!���otR�I�}��!��%�g�	3;G����ꅃmW�κ�%����?f��ؘ�x'
��L[i��vf<�83��i��K�vria`�:�}���Km]���e�%�{�1�>���^>=�9[s��������2iyٽ�x��N|D{�G��5F,�y�W�;HfR��Z���-#-#������Q¨}�~"Aj,}���|�_`[f�~o�lf��g�5�QO�[�y����2��ʥҮ�f�M��f�6�N3]u[8�8�O+�_��F�)K{��;��?e�經ޙ��
�Y�d�T�.��f{����ǿ;�}���S~���;V<��]�c��Y�^�
oF;>c|�C�|���Y�)�gA���=�c��̃���Z��k�fS�n�O�u���PK    n�VX�B~��  �  6   react-app/node_modules/caniuse-lite/data/regions/TL.js�WǮ$7��+�9�b���s� _�7k8 ��M���6�>l�cK�P,�4�����_^�����?�x��ç���)�����B8��z��mE�a�(���"�iin`�&�M�(�W�7�s��haEW���₅��