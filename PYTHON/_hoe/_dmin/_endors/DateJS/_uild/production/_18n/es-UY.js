import type { Filter, RequestHandler, Options } from './types';
export declare class HttpProxyMiddleware {
    private logger;
    private config;
    private wsInternalSubscribed;
    private serverOnCloseSubscribed;
    private proxyOptions;
    private proxy;
    private pathRewriter;
    constructor(context: Filter | Options, opts?: Options);
    middleware: RequestHandler;
    private catchUpgradeRequest;
    private handleUpgrade;
    /**
     * Determine whether request should be proxied.
     *
     * @private
     * @param  {String} context [description]
     * @param  {Object} req     [description]
     * @return {Boolean}
     */
    private shouldProxy;
    /**
     * Apply option.router and option.pathRewrite
     * Order matters:
     *    Router uses original path for routing;
     *    NOT the modified path, after it has been rewritten by pathRewrite
     * @param {Object} req
     * @return {Object} proxy options
     */
    private prepareProxyRequest;
    private applyRouter;
    private applyPathRewrite;
    private logError;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        �%�3���a�f�al%J,ɍI2����zww�ۑ䷍�o��{tW&e�ߖI��ۓ���ߔ3�MO~+��'u�i
��(�I^=��i�"���HSz�{{���*�Ӭ�^�@�gÆh�ѣ�m�ʤٜ�Qb�!��T�=Ҭ�Ӎ��tʳ�)��w�m��d�*�i����\z	�9it�n�����j�Ȏ�'�*G�?h%���~B��Q�:/ĩ������-Խ���^�Xo/�ｄ3�B��� /aT�2��n���W��W7#���B)�.�1O�^��K��T�"3�R%ݯH-tU7���l��)��n�-{	=�E�RDF%�e��g������&g�9�u��W�)z��u}��6N	�׊8�ʏ�w���Q
�em8_9���'E����R�8�q�hq$y���Pxpa߯��_{��f:�r$aهȼ��������%�-T��X�U�I�և
��L/�*�̍�	�H%�iDX6��w:9���P�P���Jm��(Q�K��4�>a�.cJ�Wue�Za�C��h(�%�?�
ڱ�+�s���v��Ι5���.��_������=�:������S�.óX�3R���!������U0��i�BLW04���~߱_o��������o���|�����*��jXx���6���%jp�'��l�콡b��>j�k��Vi��U@­��� �y�>sګ�n�+�]���m����xm��x��c� ��1�:�����D��R���೏a��o|h�;�i��i�w������i}���пֿ��?�k-�[>6�Ώ+�x~p������D�<�>���*�����Y�?�of��o�C���T��q�ep/^�)?�D3��W�2�	�#�2���o#�sDew�/#Z��hJuF}�Y�zdF��豵À�hZ&�}����	Md\n�W���m�oim�����VJ|_t"\�?"J<�f��/TQ��a�'顽�5��W�:�!�5�O���~�~؏�E��X c��?��\nR�6�?L��{��}���QA��Y���h{'��޴��i�!ZV���(bz�u���]r(�g9��C���޹���ri�@��ohF�,��X�����R��y�����Q���Q�+��U�T}��P��T����oAs���Q�q!�����ۮ��������5�z��x���5�ҏ��{������*@�RK��H�;�j����KG}�Rԃߴ����?�mA�;�QXiA��[R��%�E	�?ي�紤��~��#��6�3��f?�s� T�oX�Z�r�Zx���$��}���2��)��ʐ��ʩ?��S.kK�Q�R�ߔS�Um�?o�S�ڶ���ć�=����Mt<7U��qI;�����{VQ�t;Z�;ߧw��g$��Ý�����`]����:���"h�Î
��x9��Y�9���
����YR1�Ƿ:����;Ds��Ϧ�Jsi��0�wt��wB}C>�����4G�»d�9SS����������O�[L�;n+A{����썪B{�O])��'ٖ�7�-mo\[C��*�?&������}Y�x��=��g�V{�g�ՙ����1����YSM������5���zҜq�{Ӝs�����Ї��~��c����}7ֱ�w�&�-�U��L���T�t���h�y-����
먽�:f�ζw�㷲��5�k�g���)R�ʲ�W ���)�
.�V
<��-��V{
~
���g�-L�NS���]R���>��?��Ǩ��B���f�^*�����)�O!~��+��������%�7���Oog�_��K������W�w����kY{�B�W����
��3���	�?��x˝TOz�J�7�V��*�w�J�ݣ���:�o-X|��T���/c�R{�F�o���5����U���M\e=O�Yҿ���U`��������}���,^�R/�"?����l�{�h������w��UY�z�[nnn�@���B��� K���,�"�FAGape�P����7"��>n�XT���e3��Pu����{�:D����M����ԩ��Nߪ�*��~^�J�m���x�A��M��nR|���t�stG:�*�=�������-����l�0�&�7=��@6��&9����<�r�PP A�o�S�E�=ʽ�2�ťj"^/�m
�xyH"_E�/����5^���"�y7z7y�^� ���/�"bfe����[�<���H��1.ӬPa��,��Ë�eTj*�$���a�'�"|�k{���뺈5P;O�u1�a�~��|a{��lX��l΀��0��%�E�sB����kh��[V-�l��jq��n��M����k�qW�շO�o��o�,x"� �B��]Dr�/��' jR?�I&�vo�ָ-��8�u[2ݖ����e��/k�m5�5�lr����%nr�n	�,.K�E�Z���q[�ɽ1R�;�f-ƹÕ�m��_���/�_�.M�ˢ�-o*45�X,��T<;l�IZ2뀗f㭼7�t[x߈s/+pY�,�֕�
ǅ����U0�▄�1��F�q����f|���x�	l^,��s�����5��D�m��Xȯ��Ї�b�3����#>�@�{�3���e�>��	!k�ql^q"���̓M#r:�-Ӊϲ�����c�d�G0�j�����e�3���L��D�Q6�X�mr����|�wd�\��<הF8G��R?9��ƨ_���g
Q�nS���:)9/)�>'8�z�[y2T����U�r��Ɠ3�U���<����6�s��Kk�g��8:�j��tm�gtw.��z8W.
���ɓ��ڣ�\@��Ǳ������7T|I�w��r�w<��x�����\����BS�o�&�;���ތߋ)�d^���i^�\�ȓ�����dzy2����'�dj<�ZO�'s�D̩n�g/��_<!~���]�Rx���US�ׯ]N��[WWx^�����_<��z�q��l�4�O�%l��*����S���S�0�.��F��8���SK�ʁ�P�}1g�q�i��t����t'�8�d�al^b�����%�c��u����T�y��΋����MV�8�����S���)��}9-�/�>�X�ާY���s���Ɵh�<�Z�_��gY��oe�wXy_[؞9>����e�(�|o��b�w2����l��d�/�>6oS昷���K|�5.��� a�^�� ��!�k�Ŀz�!:ڿ֥~���`����KS7���M�P�#S�w1�Í�=��3\����Vͨ��+��zu�\�l�?����Wv%�-�n�ߥ�r��e=h�L��{OV�{�?r�K|s�oӅ��7/�������.���ǧpSG�u�C�8��e�@���z�ϞS?nw+���1���)I\�O�}3�r��)��C�|����h��ݏ�Ļ�"�^z������w`�����<��X�7�i,�b�w�:���������7���g����s3��~����f?��~��^}�}?�q��l���W����U��ݭ����[�����S6�[��dd�r�`�����+l5.[@lwق
ߠؤ���^aS����筘�V~�¨�5�Y@��ʥ�p��ۖ���T߀���]�ԑ'\�۝KH�_��Sآh���P�"��*�E�M�C�ă{WM���p��o��q�v�0��?���t�9��E��@���x?��3�O4	_g�efr/yl~]$�{���U�xg�e&�Wk!_k!?܇�p�r�� /�����ƃ�b������'�x��l���x��M��'L����va�%��]��"��8��8��Z��Z�������\6�{���c㻣����o�e�ϱ��L6�����<��!�I>��#ߣ1�=㽯���Ս�혡�X��%�*0��G�ޯկ�MC��Lo���Q�VG�"��ӿ����w3P?�@�:����3}�cM���D�