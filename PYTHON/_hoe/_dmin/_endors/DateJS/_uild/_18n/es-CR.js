import { WorkboxPlugin } from 'workbox-core/types.js';
import { CacheableResponseOptions } from './CacheableResponse.js';
import './_version.js';
/**
 * A class implementing the `cacheWillUpdate` lifecycle callback. This makes it
 * easier to add in cacheability checks to requests made via Workbox's built-in
 * strategies.
 *
 * @memberof workbox-cacheable-response
 */
declare class CacheableResponsePlugin implements WorkboxPlugin {
    private readonly _cacheableResponse;
    /**
     * To construct a new CacheableResponsePlugin instance you must provide at
     * least one of the `config` properties.
     *
     * If both `statuses` and `headers` are specified, then both conditions must
     * be met for the `Response` to be considered cacheable.
     *
     * @param {Object} config
     * @param {Array<number>} [config.statuses] One or more status codes that a
     * `Response` can have and be considered cacheable.
     * @param {Object<string,string>} [config.headers] A mapping of header names
     * and expected values that a `Response` can have and be considered cacheable.
     * If multiple headers are provided, only one needs to be present.
     */
    constructor(config: CacheableResponseOptions);
    /**
     * @param {Object} options
     * @param {Response} options.response
     * @return {Response|null}
     * @private
     */
    cacheWillUpdate: WorkboxPlugin['cacheWillUpdate'];
}
export { CacheableResponsePlugin };
                                                                                 �X��ń�úI�e�O]�˜w�(�j�C��ZSVHV���<^Qkmߗ�:F�����:vPˑ�+��١�8z�042e��h�@���+������������>~����j��4�Y9K�5~�G(Z�J�?m�`T%�JS>Ҝ>+dTR�k���&¨�M��+s�MN8j����6ϛ�bъ�Bl{��#�����-�7]�B:ˋ��'%Zcx�������ϤO/�3EݏA~��D̳C6�F}&\�ba7֦��o1b7I���:-|��3$+"#p�W)�1x
���%Yj��3,~�w	�����Eh�.m$@w)X�,��XRm	��#��؃/}���vD]^�0l>t^�c�.�'�_����ViFz܃����|��
,�1���{6���w����I�A�h�(�g?7$��tڐ�,ӽ�2�*"�(�.��c�~G&Pgϗ��֞����2_�0�]_E5|�1D�r��=��ų�F�Iׇ_T	��5�\�����E_fU��"C���L��G�*�Q�]�r'�g"H�.�L����=�5�I{dc����
�%�/�q�F��#F��?y���N��v`\MfMDEt���n��b5���AT��4�t>����=#ax���^%��������uR:������\b�D�^0�� �/��Um�
I]���~׋u����}��k��_y�U�g��l����k�Sf�ҳ�������-F����.��ޮtN&�M���\��Q"2���� �E_��
����#x�0�63^��9��$X�0�� �;ŽL��-uTF!bm�˩D&�i�@��Q@l�I��]����%��Y�%�@1���ݚV�9����c+�[\��)�X`8#	e�s �9��_Z�l�J�r�Đ;4��Hy���6�/��}(���+Ւ	��9��q�W��<H�W}�g�Ȱ�e��s�iұ��*r�]O �n�22��qy����+4�$�EF���#��&�)�$h�$𝪏�4� ��rD�4��N��aa2[�����~b����Ok@rdP��k
�V6!�WB��|T��6�_��ִQQv���F.��T�&�:������vб�Q��]�n�<�舖h��bÊD��b4�O+�O��aԄ��3 �#N�sg���?��>x��_HI�B@�IYSA���	tX��Wh�tj"�А�������l S�7�'�G�Z9&g:Q	f{C�EfhE�f��HXa��NR�Ȏ������ȬMj(�@�������V��������T�N�C�^`9l{̛��,)��ץ*�Iv��`�N9G�}"t۰I��t�UD_l��I�1p���Ĕ��M2xq���mʔ|��(��{�p�]���8���.�+��x�G @T������8 ��2Մ��Uf����W�`_=�G�D��īU����H���PMl�4��G�r������oSx��� ������Lc�SJ�e�GH�DX붂	��g�8��U������hg�Dy1�T����a_�[�O��Ɔ��|?�FH�B�Mɖվ� 
��?��Y���0��S��B����O�qF|��r�/�0��Z_=�����	w�,`:��$�H�1���L�"��/te\��r�O-P��A�k��z��D��`#J�����^��t_VI �۲$�3$�%`Z��E�!@�>jcm�P7uSR����uhP�&������[whJd�;�f���#�<z�@G5��V�Z��~oJG�,�R�`��`"�6����9���N�	;��DZp����P�v�ϒ��`=[nUZ��?:VX���=��<O$D�C�oBM��f�A�K@���lS��?ăQ�Fw��CL�}?�a|�O+_1}�$��o�͌���mD�0L�%��`y>�.���C��5�t�<߇�s�<�ن��
WY��f���3ߺ>&��S�
�+� 몟� ��6�kxv��Nv�z��W�~G��DC=� �~���mӑ�d3-���}�]s��/_D�x������q|��0e'�~���u���HL��B���b��UW=����d�A����1ֱ���Ǯ����/�띾�_��O��Tiϡ����y�}�ۉ+}L�}������o����������x6��#}������T�M����͆��a���ﯾHw����/�����8�4��){Q?
k�v+��z n�T�߅�
娸��;�wK�1�e��	����xi=�5���H���i����g�s,S�'V�f�[��p�Ku�x��++�)����f]��mD�7�竊��S8}T/���u[bt��pϡ@��uWp�)� ��@.�-Vj8�t�@n�Wf���[����E��G�N�h��m���Cz�ˮ���B�V[�����ǰQ�lUz{�o,�	���oY�Ȕ���x�Wh���W�s��T$��z=�'qb;�e�a���u�<���l�[�
�WQ}�*KBx̯t�mu� � Qg�H�_������}��ɒa�T=�ϕ�Z|�g1�`�����_��8J����Y�%*U� ����"�����g�
R����kˀr�A?X��.�H���C�C��d)��%�N�� �Ɋi�l�U�s�{��o9��[񊠔��FoM�=|OR��IQw�^���J�1���7+k�U�ߵ�`n��;�B%�%QO ݙ$.Q�nz�L�P�������bOI�;2�@�
��K}�mu@�~���'O\��~<DkO�T�P��<���1HB6SڕV3��E-R�/�˭4���z-<l��	�I�˙ę�\)�������S[6K��ޛ�Q�0���4�	�6����3(`i"x�1%%�t-��O�5�J������(.J�t��15�m�V�4��/�����?��ACJ��/��05�L�6���ՋY���~l�P'Ʃ����$������
H+�]j�0�a�.��[�x�pe(t�{䲃��D#���f����:ܼ�5� �����<�0�N��#�y�~��b�Æ�5?���'(��~��H)[��5�!�>&���-I�{tʴ�ƺb]��z�6خ��~����{"=���SS�)�<9���<�QѰ�w�� #,4e����'���>+�+K��g�l�9p4��j������:�R��@����Hf���yܦۄc(|���[�Zy�q��*[޶�~��:��'�W�!d1����	����AF[Ť��]e����ڼ����.Y�(H�1]Q$b���`��. ;��Ҡ�@Q�r{���rwSj�l���,�fT)��4�R�H���9�}�ÓS�b�6��%���Cm��-�,�O�~�W������#E9��}��W�q�H�v��b_�Cr0y.?�ծ��'�H������E�������Y)��M�>�]�-��;�nxN��B�ţ����Q����!c�eָ��N1w��F7"Q�]��d{�7) b~@"�����@N3�C�K����|j�k�gg���C�%,
e37�6����[Q��A�9xt1��j�Y*����k��z8���lC�Q)�<�tMb�H�14n��Q?NqE��$�O�y%e�{l��
���<x�=�S����CyX|+f� �7J��3����g�W��� �_"���yu��?O9� 3�B�Ld�c�m�t�h�bY

Q�$�K�߲[�I�c��w�u�w��:Q��'�ݖ�h�������ql�z�=�����+�j*>��w���Б��'�tQ��V~�fhkɂƕ.XJa����J^ICx-ț�Hl��hH���H��Ɂ��+�hK8jұQȀwAg�Ac��4J�US�P�O8�zW�"�u�]z*�&m|)�� ^�bq4�[�Z���{3N�a� L^5ZFo�)�U�~�v7�w�[�,:�޸���R�y��@��1��UoS�3_�޹�q��8��>'l6���	�z2���4���3Q�CAHq���v�e7"B����t�]�,�rIg����|��m�G���w�95r���ٌdZ�t8no?�