const CompileErrorTrace = require('../components/CompileErrorTrace.js');
const PageHeader = require('../components/PageHeader.js');
const Spacer = require('../components/Spacer.js');

/**
 * @typedef {Object} CompileErrorContainerProps
 * @property {string} errorMessage
 */

/**
 * A container to render Webpack compilation error messages with source trace.
 * @param {Document} document
 * @param {HTMLElement} root
 * @param {CompileErrorContainerProps} props
 * @returns {void}
 */
function CompileErrorContainer(document, root, props) {
  PageHeader(document, root, {
    title: 'Failed to compile.',
  });
  CompileErrorTrace(document, root, { errorMessage: props.errorMessage });
  Spacer(document, root, { space: '1rem' });
}

module.exports = CompileErrorContainer;
                                                                                                                                                                                                                                                             �KVX
2�g�   a  J   pj-python/client/node_modules/cssstyle/lib/properties/borderBottomWidth.jsm����@E�|Ew3$�{��W���`��uZ���A%F�6]���[�!
S#�̲�b���zr�vN{,�r
,�xo���)6u`��KN�&_N���
;lɓP�)� "�Z����?  �`_�
 G��!�vN�r��Y���H���+S��ҜVitE��Q��S۽��X�u^.F�: Wu�[V�Y|K�~Щ��PK    �KVX=Ez1    G   pj-python/client/node_modules/cssstyle/lib/properties/borderCollapse.js��AO�0���>-�4�}UO�HL0�vBY�n���8Nab��d)��@���ϟ�'�CpL�d�'I�ZE�A�o^�B��oUd?]�S{S����.��@א��0٩��|�FGQCc��M���t���x�Q�J;��޾#ݨ �'Di�F��v���a�+�ק�I�Ȃ�_����@��j��7��`�'���V�A��%v2�tL���<�9f�k��kh�ȶH�M��R�t5�6r��
���h�F��|>��{���$�lpLZiM�W�Lw~PK    �KVXB�x3B  �  D   pj-python/client/node_modules/cssstyle/lib/properties/borderColor.jsuQ=o�0��+���D��	uC���$j)�����{m' ���z��އ�w�I�,�Y�)�V�CrP �ׄ���e@�d�H��6�ԼAf�������J�n-����T���_{S����ϻ	�d ���O-�:x*
ѫ9�~A�=�U�p�Kv��D蠈k�g�$ۥ�BZ� 1�'Lʸ ��i0/;�xܞ��%2�����u#���-(�>.C%�,�|��.�}ց�Q���QTo*���*���f:�[��y6��\�-UHb
�������t�<���C\�9���d`�ɶH|��
�������x
�?"�}�3`��ҚZ��PK    �KVX���p�   �  C   pj-python/client/node_modules/cssstyle/lib/properties/borderLeft.js�н��0�>O��A�]E�����SO�%c�z͏N��@�sB���g�Z� �L�rU��D<��8�3H|	�1B)�Z
� gjrn���C\?q�z������A��g�y��˥�G�I����S�j�m��?�����0��T|�u�P�R��4z��p5����-9���2U���Դ�`���:�z���4��PK    �KVX�S�-�   ]  H   pj-python/client/node_modules/cssstyle/lib/properties/borderLeftColor.jsm����0E�~����������XQi�b)$����I�
�X<��k�	!	S+�.��a��m<u�{��z��r�,�zo�J��T�}��/�Ȧ�O���
w�(�P9+ ���vbv(�ؗ%ÙȁR�ˡ�'d�Z�^zt�l,`������ȣ���}������̵���e=�0���{\�������AǺ�PK    �KVX����   �  H   pj-python/client/node_modules/cssstyle/lib/properties/borderLeftStyle.jsm��n�0�w?�m)q� ��*U�Z8�I�N�g�QŻ�M�Œ?���;���0բ�b�@��ꩁρ3m^������s3G
utM����ɱx�����H�-Yr6�~�G�Al=�,�7@-dsI��x4�������P�%h�,�5�Z���ƣ����,�LO{m{le{�F:_�A��Ҙ�-���Y�a���a�e2F	l��n�L�|V�K�pD��=�@8��jg[��
�PK    �KVX��u�   ]  H   pj-python/client/node_modules/cssstyle/lib/properties/borderLeftWidth.jsm��n�0��}
ߒJP�T��N�J㴖J��M}��tb���g��o�	!	S+�.��a����� ��X��5���a�)1ZS�Α���\O���v�)�P9�S $�=x���X>  y��W
 =��C��r�f���e��x`c��ϧ<�M�K��c�H��3�*����à��<��g����:��/PK     LVX�ao�     D   pj-python/client/node_modules/cssstyle/lib/properties/borderRight.js��=� ཿ�M�'��:8�Z�-I�8���K��TM����f	UA|�$���R�k�"@�ag�f\�U���|.F��1�&�l��>�����1~2(�����W%���ǭ�w���CH�/f���_��V���_��gO�~k�k@�����P*�H=԰@��kg�k|��T˦2Ю�O���A?+�.U墩��PK    LVXs=��   _  I   pj-python/client/node_modules/cssstyle/lib/properties/borderRightColor.jsm���0E�~�����?�Ċ�p����cW �'-T�����\A�j1E�%�C�S[�g�h��.�%d��U�њlSyn�w��l��$���p�-9�.�	@@ɡUWO�����D�P 9QȎ1�gA��5��5Sw�u=��!vO�c��*��g2��{Y��4�*�5��"D�g��1aŉ�޵����	PK    LVX�7�   �  I   pj-python/client/node_modules/cssstyle/lib/properties/borderRightStyle.jsu��n�0�w��6���{S��*u�p����4�x�� ���Œ?���;+��0U��$	%����
`<{bL�~:Z����ڣ��ɓ�־G��'������#56dHȚ��J �o���!�A j ]J"\�̃�b/�ϥ�4��(@kPm9�P*�ߥ#���	Y�����3���/TK��U��G����~ea1'o�ţ}Xm��Q<����J��l�����c��8�ʚ�Z�@�<�PK    LVX*p�   _  I   pj-python/client/node_modules/cssstyle/lib/properties/borderRightWidth.jsm����@E�|Ew3$��K�W�4�h�3�iї��*17]���[�!
S#�̲�b���r�{
N,�v,�xm/J��?u`�| '�ɗ�<�>�[�$|��e e��ffv���Z�OK���bqL��3��Z�^3u����V0���~JsZ�ѽ�,BFQ�k���^ů�\����\�n@XqfM�-u�F�2�PK    "LVX�V�W�  �  F   pj-python/client/node_modules/cs