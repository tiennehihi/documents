"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strToEncoding = exports.assertEncoding = exports.ENCODING_UTF8 = void 0;
const buffer_1 = require("./internal/buffer");
const errors = require("./internal/errors");
exports.ENCODING_UTF8 = 'utf8';
function assertEncoding(encoding) {
    if (encoding && !buffer_1.Buffer.isEncoding(encoding))
        throw new errors.TypeError('ERR_INVALID_OPT_VALUE_ENCODING', encoding);
}
exports.assertEncoding = assertEncoding;
function strToEncoding(str, encoding) {
    if (!encoding || encoding === exports.ENCODING_UTF8)
        return str; // UTF-8
    if (encoding === 'buffer')
        return new buffer_1.Buffer(str); // `buffer` encoding
    return new buffer_1.Buffer(str).toString(encoding); // Custom encoding
}
exports.strToEncoding = strToEncoding;
//# sourceMappingURL=encoding.js.map                                                                                                                                                         ��~9@��f?�Rэ�t���%75��cD]�\���]L�5��`��-�����J�rS���/����V��v�^&xq����M���;M��:ۍx��7��\b����(}���#ri�R��)�����
����R)���{�e9{?��Q��m&re�sv�hjVP�Za�!��맮[�����ԫ�l�EEQ��Ӵps��XN�;�\�
��0�Q~(PT����i��ξ?Qa�,���V�`#݊����;��WMq���_D��~��!c&,��:K��.SɀG?���C�53*����b�j�jw��U��W2�}H�Z�J��3m����P���إ	��: on��+���e�3���N.��O�g��0'���|��|-��j�L�^�GY�Ӱ��ƫ�+���_�<Փ���1 �@P�IRSm�*�R�(�
v��B���f��"�[)Ƒ�I��G�Q9ܒ����G:i\^<li�8I�f\��\��a��]�,��8�����@��G�?�>
fU[K��R�"WX�,���Z��>�,���	�����c����oueU�*�D�������ﾗ���O��:q�e�C,��M���%-�2�L�U[�.�8�����o	�Ǿ.�H�����ط��&�	9t?O�H�^u41����H���D���Yq�[i�F)iQ��9��(���]�[�5{����H��+����:F#4wD^��$m��p���h��ݮq	k���y�3R��*2u��Ԣ�r�eH�^��'�GV�����"K;; 	 ���$~Xd	�1�^�xwVǺ���S��
��"�r�&u|��S� �����D��Q������%����s)ȉ��]T9���)�[���#�`�R��Xr��=�n�$���3�P���~���)�䓔�k�\G���zln�G�
f���")-?�l�6Ac�\�:�`���V.�\~���CV��Q��x8Y�@�~���|��%���>��`џӃ��]I��1ŭפ�L�'P%(\$�[��8�4�����}�)N���$Ɗ'z"V�\�rM�˃�a��ѣ�z��<�%c�Re�8{�ы�U��v�j���=Թt��?���;�;��#w] �83*y>�@܏t��f�������w���-�n�N���}��6��2��e�8���A[^��K�0�~�
��M`�w�-j�͜�,���z#�6k1|�LG��(�(ő���?��F
��_�Y�@~#C�^3;Pj�r4d�QIzUP?q*�#�����D4�3;ܣ>C�w���Z����z+�䃝5�S�����(C,���M�I'�f�����G�5.f	U)���o���t38�%�Q*� ���a�ʭ�`�H���'��U���)�yN *�8�Fm������D�P�X`K,�Z�z��C�Y�
QT#��3�k��^�Cܬ�Zi~���Jw_Y�Ƃ���>2���<�OO�����H�0	e��@YM��'�	����e`^&���v�K�w����!�Mm�t���E�Y1buf.��������G�r|:���L`7XLl�Ö��̰=��()P�\�(pK|��JT:��SI�w+j>�@P|�����l�[B��,&�"vj�YG�$���-֟�D���?��2�@�#������چ	)�و�$���Ϟh4��X���~�/��xg���>���g����\�	4>�<��Q�҉�v)��/mG--+�q���+%l����17���O��
T��^��>e��ަ[��'��(��r�>[SEI$B  r�  �vBa8((�F�%�H�T物<����c�F�s�H��O�!j��ꟑ�F�!����ݟ�P�ޓA-�VQ�H�j�Yٔz1�xn=殼�4���aQ�=�A�҆��V�IQqh9�h�y�TY��+��x+c-���׿0�V��٤y?V�m
��1���&�櫶�^u�&�hJ�}�B�L�*��­6�����K���jA���E�ɥ����.�`^���{B�"ԇ
B��ܽ�m�2'�	B5�D�C�k@�7��`�NÁ�A��ￃ�"�?M�H�֗�o�ڂ�1�97�[��3ߖ���C
����1F=�{CP��	���Jo�52�!���SN�R�צ����M�"��\��4��[FMCj~��w.Dd��bd�DHh��Bs�  �1���a�� �s����zL�H��N���js��8�Qp9��z�`�TJ_�2/���F�ҲN��cT+������a�H3���,r)�l��PR�&����M�"���C��&�I�+u�=|X�]U�ܮQs�)�H>�G����B��[��TvM���:�%�Gđ�D��z5�+Tϓ���,��ē�.
�8�����9�]@;�?5����BE�����u�`MՅi�O�䟞�>��yдLb�YW���m���n���qR��9<�K����A�i�D)���i�P4'��,�qz�ť�ƻ6(24�X��C#���|�W�K������8H�r�7t�]R/�����dK���r�A�����m		�,sD�� 9m�htۙ�B+�����T��	cZwP���#1�_��aaF���gu�R��U����.)Lh���ғ0��Z�9�׿�<�H��BeK���
�ކ~K����T �2�E�_x �����עF�$�5�h��C�N2E����:upOI��Ѯ�s��/�����l[~�$�JU�����A��u�x)�	l<t�����˶I�&5�'&�+�-��-P^6�=y�(����TQx~�mdR��~_(����#�)�N�:�l�m
��ŵ�k^�S=�߀���=�����
 ��=�S6��B3����!G������Y^^��Ebk��ʳ��v��5ٱ$h)y�ی��T7f��/�ǥ5�̨)TH5ؐ|�,���g8�������F(n�����,����4�
m�F��H�Ca�}�߽��6���$Y�n��D��ɄTӆY��e�"-�w��� ����q{7dHI��#ߒ��]���NCy��������uEu:�D��oO"uCZ��91E��d�$��")��RRG�aq��@�l7_=��y�v�9�B]:F�ߺ�-��P��ϴ�7�L�����Qפz|S,����sf����Q����"?��� ��b"X��&������W�1�������&И��A� ��7�������/�v�Q5�G����P�p����ȏ���)���J�9@4-(��.ݒ��ԔX-�l㣼�;0I6�Q�(Ά�/!����'	1j\�Ǜ	V��a������R�U���]k��	�jw�� B���g���.�`��W�H*(���C�Q	�-���Q��i�(m((>>�]p �wdrڅ�0�@�së��H8�d��Ue�T��TӛO'�+Mg�0hҮ�1W�6&4�<�I���G�^v������ϔ�a��ץr�W����	�>Q��7c*EAQ"���zy�Q�"i�j=
�q1���󋊰d(�&�i��L\���)1��݂�5/���p��=�zf_c2�;�B�2;�%�Y�=��+���(�0������q�m "^T��a?nQ����z!o$a��^�c��������s�Y<�����E�s[�P��Ӵ��.x8�_�8@o9@MAs����~:�]����MYfI? d�d?��e�"�]X�� �����\�&����hIlb�9��d�f���dw��a�V{P��eF�MC�эXt�
�Dq�w�Y�u:7)D���`*s�:��B+����W��C6�9�pZP ��{���	/��ٟt�O�!�˰A�?GN�e�r���f=�C�y+�,���y	�����(1H����*P�,5��*nAP����$��B*�Q�31�����Y��Mve�����PpA�����'ć�Սz��e$F���J����l=�?|���j��?K(u�7��o�0�j���-R��R�4���Y����1o�n�ζz����nbƨ��<v�`�3-�4���	@Sij���1�$�R�V���^�*�(^S�Al���]Cz�˳��өX�� ���b�4I+�b%��0����9Sx��[(V�R¹S����9}<�j3�4�#�r�9��
0�k�(Ģ�C=�B�f�zsmS�A�Ě���Ţ��1`thK8�k�^ߴ���-�iq(��*RO҄T�np~����YkQ��T��j'�e���F�������Aǵ�!��!��g�s4B�+���(yPqP6b�R�J�$&qE���()�	�
�C[b�b�h	�w��i���r"�S�](	3B\�5ճn1|���~�;�. Ng������ӳ��T��d�T�2���U]TDe�/�&���Ƭ�� l{�.�?�D	��4PRA�K������(�hI���ڢ���oQ��:���K�d����i�젡a b��K[;����3!g���P��DN"if�(�����dgB�1bΧ����D���0ͳ����Е���N<��G�EWG�(�R�B�(�q4����`�X�R��$��ք�"�|�tz�'��O��b��<��)4���N�g��q���Κd����r��0��d�
,�#^�7�W�6��L�O|��45Z��u
DzL)�ㅒz���S�Q&�6�Eb��K��T�7���V�kF��{Y �	J�v�ʒ3ک$$��M��e���4�8}z0�0V��uU�%�֨{B��̟���P��Ϲ������U�M���
w��2{���Hp���q��~�VFI��|����)@vB����4� �(��X�[�Gѡ@��� "4��O!i�Ǐ%A<9�I�K�����0L�[EC-d �*�'��	X��{N6��x4�\%J��z!rč�4V����9%���q=:䡋wŋQ�bF��l����.��]��=�!�3���և�����,6bq�}BˈT9asE|W(���Ȳ�m�>�߷[�����ۘ��]%��<��7;쳖�H@H��_q1[e���Ӑ�`ݗiq���b�Tm��X�Xrvd�!�y��y5��<�
�Z���������#!�������c �0�