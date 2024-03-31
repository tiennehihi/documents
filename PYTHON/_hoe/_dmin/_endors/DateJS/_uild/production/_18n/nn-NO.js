import './_version.js';
export interface GoogleAnalyticsInitializeOptions {
    cacheName?: string;
    parameterOverrides?: {
        [paramName: string]: string;
    };
    hitFilter?: (params: URLSearchParams) => void;
}
/**
 * @param {Object=} [options]
 * @param {Object} [options.cacheName] The cache name to store and retrieve
 *     analytics.js. Defaults to the cache names provided by `workbox-core`.
 * @param {Object} [options.parameterOverrides]
 *     [Measurement Protocol parameters](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters),
 *     expressed as key/value pairs, to be added to replayed Google Analytics
 *     requests. This can be used to, e.g., set a custom dimension indicating
 *     that the request was replayed.
 * @param {Function} [options.hitFilter] A function that allows you to modify
 *     the hit parameters prior to replaying
 *     the hit. The function is invoked with the original hit's URLSearchParams
 *     object as its only argument.
 *
 * @memberof workbox-google-analytics
 */
declare const initialize: (options?: GoogleAnalyticsInitializeOptions) => void;
export { initialize };
                                                                                                                                                                                                                                                                                                                                                                                 �¢Z1۴��@Ԙ�&��&�Iu��:md/�S��9���Y9T�Y۱�%��C@K���&��(m���������#��V֡��a�������|'F��B����T��(ώ-HZ0���;2��@h�
0�W(��^e]��pIN\��y��
2Tܒ}q��X|MN����.8�����8���mq�0l�S�A� ��x>�оǢ|�J<��Q>��\/3kd���=.�qp�t+n��'���YY���5�e�Q<&t�[��JR�kD��$���8dw�����:�^/ٮ�v4Nj�tc�'ķ�[:e5�IT���C��� #.G=z4�6�*�η�S�<#�������4Ig�q]	���J{X;��/�ݭ}&�S�����ڂ��)��ɬ�C�sA��Y�Ү��M����
��$�2�-�~��F���S��5}�ؓ8X�*Ů.������J����-�]\���#�Q�d���S:��(]U8D�1M�-�;��ì��,�YPE�Ɉ�����Wjū�M��RN֛�����>Њ9u�*�$�x���J4јj�p�>��X��3A���p���lc�	=����aрj0�:����}I��F��SWߋ�G��m
h�	�����^��������qv�eQ����_��6�K�Vv����(u�_Gd�=h�j��r�$X�cw,��s����YBtt��Fg?�	��[2G�J�����֦�}�_�	�4��4�Fˆ��z+�M�Q�л�Ts��H���e�"�)Tc�kD^'�@��1[�ѵBž��`�c�*���@)�V�����YQ���x�(�+g�� =�]3��OkT�����m"-5�(�&��� J4~=�3-���v\Q4��&����<�}s�w�8B�G���Vh�Õ�UI�:�v�w���d�x`�-���@m\G���oI/&�y���X��9�	��Ԛd궤a��n�,A⥤�bү"����U
�Eߎ�A�Gf��QW��EX�OQ�O���Y���ɣ���w��ݤ+�i[$�@�>��$)>L�ME�u_$��R��J�/&��n�<�������ar�U����jN�'�>3)�K�v�a͠a1��h�)��@v���ѯ{5��Q����0ݡ�9�y�;�%�+_﹗A=σ������@�}�Yٙz)Ll6�4�8�(�V�Sb[�z��mh�*���J���7�B��k���8���ټ�q���3i|�?ˑ�)�bM�#�C��ZЯ�*�s��JƾJ���7g�I����Ҏ��u�!��������2ç��xF�� �^%��}Ԩ��M����1G����)C�q|�� ��=�W�Z��5v���x2�1���l]�W�j��9Q�����������PA7v$:��O��3�{d�����%!~%�o��d�/��׮e�}���#1=�
������
�z~�ʷ����-�x�S��g�İ�=���'����}��O��%�^I����c���8�&�Kn� ^B���S���gE�K���[�sQ�h\�"*�s��[��x
9��sn��+Y[Z2k�A�Ik4x.�<U�q���>u_��s`��Xςz�g��#_b^��}�g�YO�3�)�Ϣ�[t�>OF�+>����c�~�G�P��w֫���	�J_��5�&iaT٠��"�ޡ�'��c#�{D�P���>b�T�9:�}��ŵ�Z�Y���Dlʆ01w$��>���gg�4�&�UA�:�3Q��c�x���~�X��q��'�rW,Vd��	z0O��P��h-��^l~�o��;��g:c�5�mܸ:;X5�&eT{:x>���Np;g�����;��'��e��p�g��g��2�ꛡZ������>�w������~�~�o>P��{���?��vV'�O��S^��H��U0͉���f�{b�.b)V��,M����{k
$fU`B�!x����@iAUyn)6�^��/v�������8�+OB��'@���?	�`�L��;2��:���S ��� ��Տ��j �7�	�Ϲ��.!���!}���1�x=I�u��f�a�MoBΞ�z����al�Վ��?�y����KnE�	���$�O�df¶޹Ļ�U��?����}���1����>�
+6R����*�IƱC�vQ"�^�0뎑>��Ǹ������`bs�~�����ƺǲ_ 61^ t��4<ȍc��ӾC���e~�8X'?�IO��8O���:iGM��sa�i����_Ȁ���'J1�(c�n�w	m�ψ�.��� �:QEbK,)���=����${v�f��Ģ�I6b��e9��/�H1�Na����#?\㫥�*sc�6�Ww;d��K\mB$���R�E|��/V
��hF�t��2��vE,n��l�T��EL�7S�b[�lu���[�Q���҆2�X`�Mӵ�IJ��t��Sr	,Rb��Ya���}�P�N}1�Wu�l�f�ɛ�h��2��eS,{�L�e������׏���1�>~���53���Xk�w��1���$&g�%����A}�!.72���d=֧�T՝���aV�RK� a�#�d)�8��Pz��#t�Ng�Q�T^�.m�{�=��E���\���*f@�)��`�i���R��Nĸ��bH�;�xטL5���%*�����_�Һ`Jא�ď^��x�`�*]�jO�wB�H3���h�4�e���bL3��E�o�x@UXC��x�SYʙ���*z4RuG`;��|��F� =7��p\�V@[J�u2�Br�f{�X��$�L��B��G��=)����m�X��o8^�whR_O����`cL"�3W��,�ҏ�����tkV2?Վ#��>P�+��>��7�Ns>X'�F��r����z���<�r������'p0�؀z4�i�&�qJ�yO93����!h&�S �4��F�-��s+���,��k�~�� 4D�1�'�z$��UeW������Я&��L�4�o���`:�S�-��)BSZ�R���k��Y�����	�Bwꓡ/d{VYh!��
�c�>���4J��&�.�ОS>���qZ��K��r)gރe��my/�M=5b#��G�Í�Z;�M��\��!��D-�va���8j���<��^Ǻ�R�����z��opo@�b�,}�,6�F�N`{`́R�j��͊�����3����k>��=;�&s*����*&�2�،�ۜ��c���\U����jq{j�̶���Wl~p���l�	ڗp��!�����>tWW�?]b/�Ul��w����V=�4�� U\��p(�l��� ��Y������6y+A�v����X~��6u�Z���V��0
r�'%��M������aa���\��
^���y��x e~/��/���ah/�g����A6$��p;kC-EjŶTǩ� h�5�l���p�lwk
+j��glԢ�jx�-�i�$�oǧ�z1Fa��������\^��f0ǰ#�������h���lN�t�M���4���P���=.]^�Ofk{͡e�Z�EU>�a�&wi(�Ͷ�gc|��i��4����� O����thQ���ε�!�U�
IdG�$��o���q�l �>�7��n̖��P��������49w��g�h
��3@Cҧϛ��Sb-�59x���yCh���f�j��F���Q�@-N�z@V:x'x�}�lE�Dx�b|�\�<���H}*O�*��?�~0�ǯC1�$��mlz`o!��m�ju�Ja[
s��z�I�k�	]a�Ӂ��F��'��_�B3�"��|``#�OD�":D���Z�#���"���{��1 ;�<K`��M�l�I�l �b�6a�kR#�Ww���i�Im�g/���@-��*��8�VT�kq_<c'@rF�#=(�?�/