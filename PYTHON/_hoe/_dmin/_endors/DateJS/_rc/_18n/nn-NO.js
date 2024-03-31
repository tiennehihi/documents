'use strict';

var inspect = require('../');
var test = require('tape');

test('quoteStyle option', function (t) {
    t['throws'](function () { inspect(null, { quoteStyle: false }); }, 'false is not a valid value');
    t['throws'](function () { inspect(null, { quoteStyle: true }); }, 'true is not a valid value');
    t['throws'](function () { inspect(null, { quoteStyle: '' }); }, '"" is not a valid value');
    t['throws'](function () { inspect(null, { quoteStyle: {} }); }, '{} is not a valid value');
    t['throws'](function () { inspect(null, { quoteStyle: [] }); }, '[] is not a valid value');
    t['throws'](function () { inspect(null, { quoteStyle: 42 }); }, '42 is not a valid value');
    t['throws'](function () { inspect(null, { quoteStyle: NaN }); }, 'NaN is not a valid value');
    t['throws'](function () { inspect(null, { quoteStyle: function () {} }); }, 'a function is not a valid value');

    t.end();
});
                                                                                           �4+xaÝ��m=��ߢ������5؈2jFg��V�
G�E���Tr��G���v�uG�y�禣�y�����N��>މh�8:���eR��ca~>��Ɠn8�����`t��Nf�����PK    n�VX�6�0j  �  B   react-app/node_modules/caniuse-lite/data/features/text-emphasis.js��[Oa���+�pm9�4�`��|�9â��wԦV�6M6��o23��|����r���YM'so��1���P$�p�ɐBhh�iO�6�>a"D�'����e��c&L�gŚf�B{�dJ�Y�T��Y8��u49�SZ�q�m.��7t�Ye}��p.\m�R����p#t���n�a 
Ca$���0f�\X�����^X	k�A��1�G0�D)E�c�8��$�<�I~�)���%b>�	i!#d���
�(���P�V��ZV8N�S{+�~�hį�#ԽK�]�Z�4����DK����c:����/��┰�N�K�J�(Y%j���5�䕂E)%��ĭ}��T����U�tǢ�ܿ�� ç2Ț���*=���n�֔��]�?��p�������4�(Se�̕��)K�N�WV�ZyP��#�D2�^	��`�7�m7�2T��H��=z�� �vn.��r���,��8���B���<);-��L����aĿۥ]���r�=��J�q`V5�D}�[����K�<iGƑu�y�x�Qt�eG����D��c���n�̺�P3(�p4���(1��!���vF�^{�_�������%�͗���_~PK    n�VX/9�;  H  B   react-app/node_modules/caniuse-lite/data/features/text-overflow.jsݔIOAF��Os&�l�\��w�Yo,cیw"�{�I�(��)���.MU������r�|J6�t���V8�O�D5EJ�h+�؛�FO[���!C����>9�:�4iѦC�1}9�N9�.�"a�57�rǐc�I��f��L�X.}3�Ki�e-3�,X"v'8�(���P�BM��)�����BO���p(	�p*�	�p)\	�0���V�����F�X�Ra"L�a.,��������Ga[����E���K9��'V��Uj*G�4�&��s����,X1 {ϱ�ʉr��)�Sv���Q.�K�������|6\JU�����(�Mi)meೖBV��_Z0���l�:�P��p6k J\+7ʭr������>R��X�WRe�L��2W�RY)ke�<(�ʶ9c7+̇W���ɖ�_l�ԕ�zߋjϿW���W
q�$u8gQ��(���z�ߏQzn�"!¯�f8O��
g�����Ae��Q}����(;*����Xs�G��r�W�����?��zAt�MD���?c�8�8��O6���*�F�:����-��/�PK    n�VX���Z  o  E   react-app/node_modules/caniuse-lite/data/features/text-size-adjust.js��[O"A���W|�g܈�}����A�����"wE��}k�5��$F�ɼTz������ƽ�m�{5��O�t�{A:(�Ȓ#����9"���]��c�8	�РI�6�t8�N9��9��s��r�-#�3����R"A,f��2�T�Q�-�k�}�m%!y��]?aƜK��'d���
�+���P�BM��i���p(t�#�X8N�3�+�BO��p-���n��V	w�X�S�"̅�����AX	��Z��bJ>$E�C�����_�}��O�"ة�A�j������pb�e�O�u��r��)]�)Qa�T)�ʅ�S�J̆+�&R)*%kW*J_��T��ԕK}��$����:9�7���yf�M$_���+�Z(�M��F-[�%�X��JS_�,#�N+e�̔��P�ʽ򠬔Ge���Pgl�N�?qJ��d

^A2,�S��������q�3���9{���ʾ��wn�����i�u�s��~�ڜZQ�m��u�b,,�x��u�yG�Qt�)-9ʎ��꨹б��;�+)ژ��M�|�]�����mu�sH�mh�͢�Z����N�7\���A�ٲ����/PK    n�VX�&.�X  �  @   react-app/node_modules/caniuse-lite/data/features/text-stroke.jsŕKSQF���X�����ʂ���>١��aP��Gg�T��JR5�on�����3�6]�W���S.<��X6V���@����=	�*��^,�0�O��$E�#Z����N9�z���C��a�-c&L�1g�=[xdIɎ���vv�:��Z���JJ(󾺗���	+��l[��
BQ(�^�"T��PBSh	mkS�
�p*�	�I�Twe��r_�����	C�Z�F­��0��L�ai�
k�6=�[�Ax�%d����$��r4p�ܷzbH]��#3��oO�6�O�3b���G|�UΕ����ą�\*WJA)*	�S94^JY��	JM�QSJSi��^2]+7�H�}9����D���4i�/'��#?�L��2Uf�\Y(Ke��_�(wʽ�U�Ge��63�\xgJ�O��~1% �
n���R�M:�P�vn�mz����s�jT�s\��w�LVý���j웫wQ�6�LԳO�e�4�x�l�&ՊTy7yG�Qt�e�h�Qu�uG��ᦣT��a��D��uwut]{�%�v]Ǵ�����׵���=�����&���>�j�=��PK    n�VX��S�4  N  @   react-app/node_modules/caniuse-lite/data/features/textcontent.jsݔIOAF��OsFf1K���j��~<l��1"�{z��M!�D�4��T]]U�jj8�-��x9ϒ��/���2�~T ���hß+8�t,z^S0��a�M��&��Uj�ӠI�6�p�ǜp��\pI��+���;�2b̄�<�Ĕ��eo�ڣkdE���^��%���1'a��M8�Q%�+*�*j�.�)Z�-:�+ġ8��D��3q..ĥ�X\�kq#nŝ�}�+b(Fb,&b�ss�����b)œXW ���0#g�80���]��;x�&�����qb�gƹጌ��p���(Ec��hlyVF٨xw�f�ƶ'f4��qe��d}��4x!O���N��� _7ƭq��e��#]�)x0� &��hCcd���15f��H��qo<K��x2����5�ߎ�����d��*K[S
줢����K�2�s+�]c/�\	�9��A���}(�W��V�t���y�ύ�.^5��LE+���;
����(�t>+����;.����t�����f�	��Z�At]��͟�9j�{��$^&6%�(���If���Ӈ�PK    n�VX�9I  m  @   react-app/node_modules/caniuse-lite/data/features/textencoder.jsŕIOA����|�	E�G9�U{�����/`@�������"$"�a�����{5=�Qwޏ~D��h2��zH��Ob-��(�Ȑ%�hZ�qE~!�VI�F�u6�d�m�4hҢ��p�ǜpJ�.g�s�%W��3`Ȉ1�,��k��F�29*T����'L�1G�9�Q%QQ5Q߈h�����@�#q,Nĩ舮�ę8�R\�-�ۢ/b(Fb,��DL�L�ō�q'�Ū�}iCF��ZƦo��6��Ǟ��'SqFZ������i6/`��$���-��)猤X��Ʃ�1�F�Hy>ƺ/f���7�Fdl��Fըg���0��82�����ˆ��f�{_9��Avi���ƥq�^7z�{.��ef̍��Xwƽ��}��Û�ʛ����|�M8T&v�o4��14F�ظ6&�46&�ɭX�i�o�姹m�i�\\����bHt��*�̛��4�O�.-��~\���k�^�}xN�VR��QxA�qd9G�Qp��%G�QqT]��C�9���@&�D#^i�t����
IO'��b�vF�h�wb墥J�Kg6�G�?��PK    n�VX@X�!j  �  ;   react-app/node_modules/caniuse-lite/data/features/tls1-1.js͕�nAE��G<[���(T5��x}�7��6��O5ip�8�,E�F��=���sK�pt��>����t>�����W$ٍHd+�{G[M�R�r��F��$TE�'�6IR�F�P�@�:��hӡ��p�ǜp������+���π!��sϒ�P��t�HP�	