import { Selector, Traversal } from "./types";
/**
 * Checks whether a specific selector is a traversal.
 * This is useful eg. in swapping the order of elements that
 * are not traversals.
 *
 * @param selector Selector to check.
 */
export declare function isTraversal(selector: Selector): selector is Traversal;
/**
 * Parses `selector`, optionally with the passed `options`.
 *
 * @param selector Selector to parse.
 * @param options Options for parsing.
 * @returns Returns a two-dimensional array.
 * The first dimension represents selectors separated by commas (eg. `sub1, sub2`),
 * the second contains the relevant tokens for that selector.
 */
export declare function parse(selector: string): Selector[][];
//# sourceMappingURL=parse.d.ts.map                                                                                                                                                                                                                                                                                 �{a��g�+��14F�ؘScf̍��4n�;ce�ƺ��+��F��e�O��|��sbS�(&�<o��ƞ�q�E5��9VJ���/���囑�>��$D���O�{�-գz��P#A��	�:r����(�h(K����:j.jطWw4�:���F͵Ԍ��1s���8���N�ݦvag���_2��2|���PK    n�VX	�_H  U  @   react-app/node_modules/caniuse-lite/data/features/css-regions.js͕IOAF��OsF���ٔ�����a���x_1 �{jL��D���Hs�o����}5=��͢}�V��t>���=�� e9�5�
v�	{�E��-�l�$�i2�G�mB�8�S�8�K��憈[:���}1��<1��v�R�J�uv����}B%#��$lY�.��0eƜbs�rB^(E��BE�
5�.4����B(	�p*�	�p)\	�	�BG��½�+�=�/��0���rf�\XK{xV£�$$�cܗϐ$��r�+'j�o~��i
�U��U�i�� �?�
×��^am��TQ�L���\)�J^)()C���nJI)[�RU"%m��ԕ�r��0e����\�P.{�������˶��Ն�(wJW�_n*=5�F������R�PY*�JyT����Y�9a6��J�#W2�\�X�c����2Uf�\YĞ}��(y�����)�J�!.�M�٪�_�Ț�x���-}���~�h�Ol\?x~w7�\*M/Jo]�s�G�Q��XG�Qu�uC���f�^�o��+j{ъgB/ڎ�t�H۝hҎ:��p�3�.���/�PK    n�VX���	J  k  H   react-app/node_modules/caniuse-lite/data/features/css-relative-colors.jsݕIOA�����lE0��rpU{�=�7c0��n��=5�!%�(J�H}���W�^�f4�Z���z2�-�_�s��	v�à�#O�BG�MB,��@�)� ���C�]��'�J�E�4hҢM��#�9�3ι��%=����[��1`Ȉ{�Lx`�#O�?��7��1���O��d�*B���~�#'̘�`�XLpB^(E�do��PjB]hM�%��o!��c�D8΄s�B�
�BO�"�Z�n��p'������H���D�Z-�\XKae�a-<
Oxٲ����SD9R����<�޼��O-��R��	�{��JM���5�4��r�*��;UT9SΕ��8%)�zʥ�S
JQ�3�}S)+�غ��x��6�d���F�U���V��2P�����)~����7^�|��Pi+#�^+e�̔��P��JyP�ʣ���љ)��;�R?T��)����uCn�SF�*9���u8gw+��#g�����|���&Q{K�I����}7�?1��h/-�o�wEG�Qv�VUG�Qw4\ܕI�t����>A>��A;��t���ϐ�h҉��E�ǳy`�g1[F�/��PK    n�VXv��[  �  L   react-app/node_modules/caniuse-lite/data/features/css-repeating-gradients.jsՕ�NAE����^[�`�(�W����3�1���OT;��R�H�x������կ���r}�V��l1���9vW�$HI[1d���`�?��.IR�O�QJ��S�J�:��8�3ι��+�\sC��[����>��3�O<3�`��O�z�##̘�`�*!+䄼PB�(���P�BM��)���T8΅�R��µp#t�H�����/
a(���0�֋0�Rx���Jx���H��+T�(���Ϧ���K8�JY}DH��Mpʙ��|�� �ej����6���������ýT���b�]!ia*�ʍ�S�J�2Q�,[%T�v�RV"e�V�JM�ݶx��&�".������@���d܄r�wW�Sz�����Ӷ���R�S�2V&�T�)se�,��QY)Oʳ�c3S�6$��V`���#0oM����x*#�p��:�D�MP�1~��v�#%c��!b��։b܉��Ǝ����o2o��u�;�xW[W|=�uu�ɯ5�RNԽ7G+k��!4�%C�P1T��d��ug��w�^4�Lˋ��e�����&h�E3�D�Eo�%?kwz�h1l�Z̖��Ƿ_PK    n�VX܄SaH  n  ?   react-app/node_modules/caniuse-lite/data/features/css-resize.jsݕIoAF��Os�"ޭ�j�a��~�2�1`` ���S��Ȗ�\,%R�>tuwu����f0������|4L��/��t�� ��(P$����uCl#c�dȒc�mv�e�m:Dq�	��q��\q�1��qO�z��Ȑ��Y�dL9�X�T��(Q�A�"��y��?�B)3��'��P�B(T��P�BCh
-�m:�H8���T8΅�R���!n�;�^�
®����0��0Ɩ�0��Lx���0�R�o_��"ʑz���c"��t%����x�?��7�_�i�
�gxΔs�B�T���FF�R���RRr&P�2PJ�T�W�)��m����Tn׵;U4�]���ez�A{���;�^�*+�-�����#Y1>%ߧ
����Vʣ2TF�XI��2Ufʓ�̕��T6�V%kձҼ����*��R��C�F��nb���)�J�!.ML��يwt�ͪz�'�����Ԯ$�~]��Q���/k��~'�-o��J�Qt�eG��GZqT5G��p�\�t��O#�mM!U��F;�y#Z��j�s�Z�4�H�Iw3J��8�.k;�d�~�	PK    n�VX���@  h  E   react-app/node_modules/caniuse-lite/data/features/css-revert-value.jsՕIOQ���?�U@ثb��{�-�[�/����/$�P[��4�q<��������n�=Y�����S��?�ftqdȒFhj��&�ذ�:l�b�mv�e�C�8�SZ���.I��n��C���0g���Gk�QJ�29*T�Q�A��&���Ha*��a.,��QX��f_�iE�C@�����[u��O4�L�"����BN�[�PJBY�U�f`���l`�C�H8N�S�%�	m�\�.�D����V�v���'t��p/��Q��u�S!�P�W]�E��8~�2A���ڊS6�M#��+JV�))âl'���D)+��m̔�RS�>R�DQ�Ti)g޲l����:�.��Kk:_0�Z�Qn����u���������2Q��L�+�AyT֭ƾ6C̍7�ld��;s�HoFWi(=�^�+e�ɇ���B@��d�۰��+i�8�A�ٷ�P�H[TZ�*_v��h����Z%���z�*��2)�C����:���uf�8���#�(8��EG�Q�@aB�3l����C�:5�W�ϰe�:�8f�̒фY�;M"�;��4y���PK    n�VX��?_  �  A   react-app/node_modules/caniuse-lite/data/features/css-rrggbbaa.js��YObA���W|a^�D��U;�� �\VE�}�b�h��ɘ��CWWWթs����a�Gg5	f�����q�"��q$�#E�$B]#�1G��D��G�}8�*5�48�3ι��+��hsM����sˀ!#�L�g��L�Fv6%�E2�(S���aŦ��µ�n����­p(�#a(���a*̄���-� <
��[I�g�!��r����@���7͒4h�Y�D�'8!%�����X!/��P�B��
5��
'©p&�¥pe'�Y(�����e����p���l�� Dq��!2�R��� �b�Gi)m%�d�=�I%n𔜒��JQ�(�R)+��=�U.�K�Ji�ҥ}�w1�r�=���*�UzJ_���XUJ�$���z'���+e��)��JyP�]�o�MS�H��t�F$�p*e�Ԕ�2Ve�L�Y(Pֿ�����h�/��?RJ�!.L���n�:�f|䝏|��gjba�ŗ�띒�Om_>~��U�Шzc�P֑s���G�Qr�]H��]qT���{"�H;2!��O�
;�{�z�hl��v�1���G��f�n��l��h�`�8X4�`��i1[v�?��PK    n�VX}]�h  �  H   react-app/node_modules/caniuse-lite/data/features/css-scroll-behavior.js��IoAF��Os&�1�(��}�7��`����O7n�Ar�HD��05ݵ}��g<�Z�z�z��d�\�xJ��D�TPĐ!K���sH��R�L�
UjA(�D��k�Qb�G�iФ�1'�r�9\ҦC�+z\sC��1�	S����#3�6�ڜ��W��P�<�%'©p&�¥�:BW�zµp#�p+$��p$���p'L��0��BX
+am� <
a��%e�I+�k�*���
~GoҶ4,Y!vM0BF�
9!o}��P�B�*��:x��K����0
{(������xؖ�ǈX3~sJ�nU�"JA)Z���S�V��Ԕk��w��)��+ʥ�V��Vp�OYOG��t������� �@�Q��@���+C%�N��·��X�Q��Y��[�r;��Q:ܡ�e���P�ʝ2Q��L�+e����r�l��Q	[a���b6�G����(���>���)I%m�Ҫ����ik����{���Ψk���9T��3�^M=�:X��z��cά���c�7����d(*��q�Y�j����dYCΕ�x��q]6}Ԇ[ky���ٴ_�?$n��@[-Z��d4�������d�+j9_����	PK    n�VXe	�TH  X  H   react-app/node_modules/caniuse-lite/data/features/css-scroll-timeline.jsݕ�NAE��G�L"�c�HqU{�m�70�w��j�C�eS�H�桯�����R�p|�L�7�j2�-��>��������#O�BG��	�J�"u4iѦC�9�N��h+�m;7�"E