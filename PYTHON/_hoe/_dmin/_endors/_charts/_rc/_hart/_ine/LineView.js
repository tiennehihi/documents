import {Primitive} from './basic';

/**
Create a type from another type with all keys and nested keys set to optional.

Use-cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with its keys would be redundant in terms of the mock or test.

@example
```
import {PartialDeep} from 'type-fest';

const settings: Settings = {
	textEditor: {
		fontSize: 14;
		fontColor: '#000000';
		fontWeight: 400;
	}
	autocomplete: false;
	autosave: true;
};

const applySavedSettings = (savedSettings: PartialDeep<Settings>) => {
	return {...settings, ...savedSettings};
}

settings = applySavedSettings({textEditor: {fontWeight: 500}});
```
*/
export type PartialDeep<T> = T extends Primitive
	? Partial<T>
	: T extends Map<infer KeyType, infer ValueType>
	? PartialMapDeep<KeyType, ValueType>
	: T extends Set<infer ItemType>
	? PartialSetDeep<ItemType>
	: T extends ReadonlyMap<infer KeyType, infer ValueType>
	? PartialReadonlyMapDeep<KeyType, ValueType>
	: T extends ReadonlySet<infer ItemType>
	? PartialReadonlySetDeep<ItemType>
	: T extends ((...arguments: any[]) => unknown)
	? T | undefined
	: T extends object
	? PartialObjectDeep<T>
	: unknown;

/**
Same as `PartialDeep`, but accepts only `Map`s and  as inputs. Internal helper for `PartialDeep`.
*/
interface PartialMapDeep<KeyType, ValueType> extends Map<PartialDeep<KeyType>, PartialDeep<ValueType>> {}

/**
Same as `PartialDeep`, but accepts only `Set`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialSetDeep<T> extends Set<PartialDeep<T>> {}

/**
Same as `PartialDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialReadonlyMapDeep<KeyType, ValueType> extends ReadonlyMap<PartialDeep<KeyType>, PartialDeep<ValueType>> {}

/**
Same as `PartialDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialReadonlySetDeep<T> extends ReadonlySet<PartialDeep<T>> {}

/**
Same as `PartialDeep`, but accepts only `object`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialObjectDeep<ObjectType extends object> = {
	[KeyType in keyof ObjectType]?: PartialDeep<ObjectType[KeyType]>
};
                                                                                                                                                                                                                                                        0�6�6:>ᬬ�?�۸��D���;}ɖL<
���\�ƣYw1�(�'I:�f� q|��f�xzw�.���F]}���hDK�=�0���=��,&n�~����c rgg�'<~z��ٳ�o�p���,��8;�������k����@^|N�K��ӹ��rc��/�}�ȶ�*���}^���o٧�|��fܲ��4�vB"�y�-������n�]P��j�\���l���l��ϖ��H&{�`�����xS�oDpB�j���c���T��q���R���^
�м��tKE��Oˮ��¨{�?�nα��-L�r5{���W��i������9�l��y�+�����amIZɳ�m��ybܪ��y�N����y�+�"`����(��r�y�	����C�ȓ:!x(�:4S"ݠ5��D&�O�屈y'DL�:�nٝ��M�D)�]"���I`���m��&����^�*��a��d{p-����bt+���!�v�37�ɪ|,�� ����{�S�����EmA��pca�q���.��sx�|��lE�w8r�g�@�k̕J�3ﷺIiS_ެc+�)F��d?�
�*�}g}��6��J�W�ￗ���`Y8wD�A��+}�RkI�\����Ο9Wwk�������?�X�޽���ȡ��f��'DW���)����ރ�#`�fO�'v"�C��w y+��<���b���: �L��f����N�ܐ��i��8�\���������R�#�)��u�_Nw�jL{=c�SC���e��X�Eʤ�Rg��R#�?c����'<}�����+��B��t���`$xo�����l��,��"
?��d�|CZ����ގ����9w�K^���9�z-I�|���5>Lso�w�U��mK�Վ�͐�njuI,��g���
�p�j�M��4[h"�j���.�>���]̲7�(=v)K���c�0�r;��:a�ٴe����mBe:[tM�-RI��&�"4����Ƭ�6�u��{:C�t��Z�R�VZ�^ֵb��/�Sē�yA.l���e���M}���U;�}�@+��+e��"�c
�p,�����Y���U��/yDSΚ������0�eJ�gSm����%�HrY4b	�_���-�5f�N�����E��t��r~}�|�S�q�E������ޔ�a��A(��n7�}�f��7���ƣ�����M�J~ϯh|�a���f���`���llvf8���!}��C�@��v�^���n;��{�| �T�J�R�T*��*>\�Aߕ
�b8��h�W�|]&�ҹL �l��Cx�p-p4g�m�f��9d�\2{&{�bݏ���H�VA+�Wt�b6��+I3B�6�]���ٌ�7`Q��'�[�l�ST7�|��gո?���psn�����iI+I:_���u�8)n�=�\М�±�
Y�@(���:}�_�A�-T�q}�v$͎'��,��O^�����D������GL��T�xZm��o ��ս��{���H��[}�.�� �-�}�?�����ơ����e��Z��302@X�I�߬\2����U�/|s�/�UGw��9�I��W�E|?��x�+f
N�Ƈ�x�1���Z��z�(�Y`��a2�zWc�6�+��Ǒ��m�W��Yz�HGI�Ż9��'�z5f���w�`p�q�[������`��rϻ�,H�>�
��f!$YO�����(rq�#u>�}o��k��!7�����`eA���`%L���EJ�`AZ����`Hd�"FG���]��h�b����W[�(t�V4��*����M_�U�^�:��z0E���ُ���E��0��d��?,#�����~�V���A��^
c9���4��JY@s�]�:V�@�`d�Vq_�u�q�5ߕ��Y�ȸ��� �K�E����l��NYaE�WJ���ꥥ�{��=H
uuњL��4��h&���nL���jo2��n�����"Fb���m�J!� �^��!���/��ad�mҖ�&��*]���?\�+��V�qd��,Mf]0VÌZ2�vA�N��s�����k��RΪ�����x U6 ^͆͵r�Uާ�k��d��s�:�u�m/���Xɧg��Qa^ ��p��-1���۷!���A�CP~_A�c����~��>��|Avb<#�x�ԅN��\߮�"��z�j�Tkb?Mf�Y)�c�MBZ��F�e#��p�*�v�\Ow2L�����9:"ϛ7��A��r*��u�h7P'���sy~�b��W�=�0��}�J���C����A��g@Wlc�8vA�7�G� �a��U���{ӥ�6�L�Y?G���k/��Ǻ�2K�b����;���ل�+ՈO��P�	,���tX8:�,^�)�R~2����w�EA���c�Բ|X�n$8E�4P�.�gw��.w��A��ϛ��+6��N��$(a���`�*07Bk�w�-y���##�\���ߡ*��?�]�I�֦[��-f�t�G碉��g$�g%�Y�*Mr$A��:�� �R�M�xސA�����*��y����T�A�&{)~���)�+�A�W��]}�ػ��@��h!1�B����F%!��AIi��RF�Յ.!K�X��L�Sl��Q>ϣ�{�{�[aP�%��ba�Q���(.h!�5�������z,�n�M�j�ۭ�"�↼e���-�)s]܎UHH-+����
�]�:����i��g�X(!P .}y[f:�����Sw>�Ol���Ҿ*�j�)V>�UEc6�咭��'m��&Wb1V��QbC������
�ր��J�si�srՀ9ب�:BΆzv��$GC�<�2U�G�q��� Vi2�["��S�����&�,\;+M��ŬP��HY)j�Ic�H��"6�D_��s��$�h�Dz��g��f�U�3I�G�|	��|ϒl2� |L���d��(��\D�8�%hS_x�m����ˌ5s˰��r�0��=vAe�����,�@N+l�j�	"*@�xZ٦hCe�v�gу���YV"Rk�b_����{�����u-߲:Mf���+`x����[�}Or�W�vM������D�oH�La���E��s�SW�Ā喹 � �}�r|����L���|>͚����;�����	�R/k�l�C0��Ȅ���i�J�{J�SN���U�n�;���Y2�E� ��Y|dȲ���(����?��dDCd���f��~<%9�W��搏�toF?����v�S�\6�v �_�纊P�?]��3�1����9�E�i��)�ERZ$�E�ǧSZ�9�E�ǧe���ڟ���(����ϡ�9�>Q���&ͥL��\n�d9�G�
>>��������#�����[�#��_���xGg���;9�g� ����B@o������2���X8� >��EA��'ڜ� 4��G���Q�ʪu���_�;M�뿨����R�9�������?�3��_,_b���{���h�+~�\�8�A����F���ܪ4�%�|�&�[��$�߉��)���C`�p�D/�AUi���khq6�Mz
K���'@'b{<&3��(�[`f��0C3�r�y�̫,����d {��jy4�vU3-���䩖�}��\V��p�m-����Y�O`����׺���#-%Β�q�Zgi��I��M�>z�͔HZ�׵ ����j��B`i�����0(6�P�� � w�+�4�������o���8��}$('&�	5��I=��������kf2�킜��
�-�#Tޣ2�]�I$�c�'O�pXl˼�%Q S�V|���AYyhn�6�'|���$o�w}6�_���L{`ޠK�Ӌ�{�Q���������CD��S������*n2G,G=|�a�"����nd~�*�t�.�+h�I-�c���D]��4q�N�ܔ�tE˰cz�\�kr�W�������9|o���&Ѣ����N��C`z
qX:�9'�"zv�A[v�K�i����7�Zv������`H�H��d��©N�54ÍT=�c=���#6��}o����}�Nƿg 蹷��g�� 9��٤Ny�ꥦ'x_ 6U R���
Om�~n}	�)9C���0���L�M�'Y5B䶟,SCX�,�',�@.��}��=�!���8}GSE(�|T:x%L��*�D��=a�x�4����ucAM��C�oK�2Ń�[��G�D/�2aˆ���*Ǩ\7��jԐ��?<I�����k5��S�ႀ�,��I���雯�?��/�$��)q����Ή�Z�Cb�_����g��+I?>��N��_`;׃���q��s�{���c�C����o/x������w���#*��|ن��&�ş9�� ��n���}(��� ��I���Ks�KEg:'{��v���d��׫��OO�{��@��-F`Ǯ`�����&{k���w���^��`���y�Y�NaB��������?��_�!%�/;��^�O���t<�U�[ۿ��G�Tm٪�r�wp�;���q�v�6�4�n�ϓl^�	=(PS.CXQ�"����v�����Ig��s�l�dO%��������s[~�������ڏ��&�U��sTw���	Q�Z�Dw�҅-L~��^<��"^ڷ�l�Yz �<� T�3��4��F��������~�]��א����Vz�7��1�����^Vc�4Z��(%���p���2"���8bx��|�1^�=]����3�÷?U�4�+�x�*p���a	�8�a>�LϓըCPfʇt��b8O��4���_F�[!L�m������T@�k��?M(}M2ՙ��f��n�ݢ�@�v�8��E�1U��������c�r�h���yeM�)�M,�#x�~���|����j�#y =w<\�nv�Q,�&���WެR��K�H�b�ф�4��$�$I׭�XC\��x�l��2~#�l-�����b���g�hr;r��F�q��ʙY�.�7o���!�����F{G�,lbk�&5��ڍ�Ϛ�<�"��.l�#���4iF�v��fq\}͢�x ��d�L���<������şO�>U��q �4FU�n����]4�뀳sbY��f&�L6Xvl5.aY��bE9HE�1({�NS��
��8��FkO���?�2a��j�q�2쉘Δǉ��B��P޼��|�:��O�0��!d�&�N�|%��C4X	Vq��HB�	(+R�U\���<j��c�)��k� ��w6�)iGdBn`r�V���T�Κ$uxh�?���דن��������b��+fOw[�7��Nl(Z��B/�Y9���:-z��Moy����W�,:��E�#ND�[#K�n�,+��3�n:�g�v��]B&/֣��ܖ��rWm�I��m[a!Q͓*՚s���0��O�{�	fœ5R���o��A�l	�[x.^��̣����eC���6�3�8�Nw_�\1���q�Ul5*K-�+��M.��\�����'�F�����9���D�mZ��EE��E���I���I~[ �	��h:��&���*�^?�ˬ0�Aj�6T.�G����>$��*��z6�ͫո�⡎�8�u�6j�N�jjH��$�����O!��yz6���	oo%e�� ��ΦW�aTB�е��؏!��T{,�ٖ��0�{Yk�aAW?�5,�Y7۴���Ma�b`��[�>��3dZזe�6v��߄P��V@��{y�`���>�= NK> g�+gP�`����99�����[<|��������Zʻ��&{��T\@���@O�bה.��#!%�1���E�-��M�,XM�ΒOh`:��w<ɂ�,���g:h0�,
HE�JL�0�2�I�j�ѩ�*��Q������X�&�P��g�������o=�j)����(@��wt�6]�*�&�<:�7����Mpr�)`��׼�!1,@2�6#�_)fu�eib��F�m�f�Ef=��!��'���_��8����o~�-�GEL��yx�#�}�QC�h�Xl�VةC�몏l^�R�OZ�]
6h����XA�𒛋`�ҮS�����xb�k�ݻ^�K�X-��ި�Y�v��>�5K��ؽy9��4b�#�������Iؾ���u�[΃Ǘ�ed���%<ļ"�^T-����$�λ�e+���uU{l�=�es]���n�P�W�0Zp�"� �Q\Ԓa�%y�ۜpS�w���DQ��>�M;��~�R��	�~^���.Fޱ�Е��R\js��f%A-�� 4t\4Favjz�o�N�e�����"'��?K�kI��3�2ۼ���#Z�X�\6�K�&W{�U����M.f}�%@���-�$�S��U�e-�����T$���u��=;}
�*�xs�՗��SQ+��n0i��ͷD�*�W�������= �R����n��\Kj����s���ü��xk.{�C�ž~B/|�ss�����T�Q�^�w]�49����탃���u^����Ϩ�l�Y�����M��$SE���O2~:������"��Y�`��D/��%�"]��mؘ��1î�lk+5E���Y��P�Չ&�E�/�$#�0M��e��9vu����n��nr�MB)՘wg�fjO��9���w/H4�� +&��F���zN������/F{�4��������,@��ʱ��� S�ȗ�G��5FICrz�?�H�b_�B�7�V��.�Q<?H�l~4N�́��Ea����[����qL�ND����Ƿ���!��z,�.n4hK�Ng�u�"J}CӲ<UMU+9��xV4DP�k!�d�-0����|3r��L�9_�,�]!~�����ԑ����ɞ����y�Y)��-� ��œ�E#�L�#����_��q }O'���u��>�R�'�ɇ�aՠԀ���C��l��i2j��m|��tZ���_�:�~+Y����^�[�#)���_��r3��KQ�
���e�=F&g�8}�w�(֏����hf��z�DC�M�P�J�o*�^�R���E��y�yN�M�h׿n:�HR'O4x��U�PE�A�M&�(Pe� �4�ϔ��2=VP�R��	���f�ȴ���ׯ�S��rsɫ��r[��?���8����t�y�f8��]�rMx� ޼XO�Q׳?�'�q<��оdY�0����2�����R�6���
6	�r#�m����]��j}�Dq4�L�K!�F�b,�IU�8��B�u=x�����������GE�k�-�+��C&�����L���a�.ގVi�ǥ��Fw|ƞ�$�,M���ޖA���Qq��z]Z�^i����]�!Z��Sk��Mᵪ�K����|iW�����$����+�-��-E�l,�o:�b=P;����P�Q�)2A-V̰��f��(��,W��3D��r�Y��}lR��G��Hn@{,hQ-V�ّ��wY�!@sM}�=�L���Q�@��T�[E�6P��X{~��U�B��*�ʄ�-I!����..vz��w�P�,���װ-҂�g��H�D�&|yʺ�ȷu��I$X�d:��Iu�͛�6�ף�O��CP��7��j�=�f�,n���a�Qv��Ç��RD�U��b��`UF�Y��*�yWy�MA�7��t0���'�;~��j(��:C
�'�`Gco:��I�`���zk8>vBˆ������<��~2�I�D�Z�[��'����2�!#���
���J4x(|[�C�D�qvt9V��}o�[e�<m:��'P�)���z�����_�Cs����;����D�.1�o<8�vL�U��c������S�+}\@����t��9A׶w�/�{��tt1��y"ޣ�q�r&�'� D��0�uv�����$���;4�����)(�0�b�����:.
[��w�����l^����0��U�u��c`ǂj��"��ʚ 3BU'�p�rd" ����v5�,S	��,
C��xA��g�X�T���]����d��� �d� Q�)t�{\�$N�������vΦ[��u�{��0�J*�9u���,�V�E�ǻ��`{�S�FY@V7���# G�۬v��{�f6D�����ޡO�|S6�y�3x�ૻ³��ĺ�E��-9�
���&nv=����^Y�}<�\>!}��}�Va���*�?�ޛ-���-����`p�J�R��Ƅ���;�>�[ʉ�D����we#�oR%õOP#�gn��ɘ��`4���&�y+��`b� ؇X��[�.�WAj����������̛�ھ�JoV�D2�R���;Z�& }B��[�Q3r�}����=�DJ�3��RB�pB8� v��4;�̟�&#�:��@���=k�7���+�:�#Ų���U���y��.�_�a<�iK��^k�*�&�w��~���[�����[M�� �$KD�N�}�$.Q2l�ĉ�<����l�0}ck���-qH��[n�8��w$��zjh wa���.�������(�oJ��֣�Zҡ�sbB���+�̘GM̤,� �^���"�5�Ҧq�,[����r�VJC���tG�}��de�/�5ֵ��䑹cH�+�ڋ�;Xȋ9� UV7�7[?��뼗��A��ٲ�
��9*���<h4+��Ј$�,���Rw��P׉u�c��6��M�%��뱛j<���s*N�s
H��09z!�-��)�V�z���b��^�ڍȣT:lq�	d*@�J�3�18bה}�7L^k׾6(<c��3-p�~�����˽�s�A�6��n�/��ҟ|1Q,��j�V�	5�Ҡy�=}��޾}ԇf+�k�2RP�s]���N����߮��ͻ'�M{�Hv=�h��ߧQ��#�F��Lt���K�W�q�=9�45r�W�ջk��0�q�ʾ������t���#�`�u�㌫Hu�7� v��i`ve�����'ǕƧ� �i�م���I�;obzcR�C쇟o6���(�}�]�v|�Y�,�r��d	.&4��[XHg�,��{ȼ������<�X�g���JP���Z*�-��54j �$!B���W����	ӡ��A�:�C�Ⱥ�ž�:;[��d����ڨ�T�
ho�!g�-�L�(LL̘c�����?���|E��S�)_.?�\�;l�l�~J����On<���o�s�%�I��#
3��H����v����T�O��{�4��}cQUD0f�����؋�<}D#����5�oN�SHƢ�(����A2��������OS%�ج�<c�\x8s��w��\�+��B���#ԋ�R�]��o����~3�A ����G>y���h�gBlُg�&t�k=B�&��`��6D���Mt�h�'sͷ�{��4;�*Z����z�Բ}1>[���5���\3�#$h��̝�z��h���Q?˚vE�-Ƞ��#'��Lm��c�N�[=�qȪ*&$�������Y7����+�OMX�uE�,�����.�C=t���}�Q�8�T	E�a8ks�}�	�y��D��|n��|����S��C �3d��/�/���K�ۍxma��Lr��2J���6E�)�q+0Ob�<|�y��l[�gU����ܜc���������ږ���b���z~��D��uYa\y-����/�Vp>ό�}���Q��cy �+t�kg�*+Wˏ�Xq	+e[?�vUfe��ɮVgWK_Z�Y�X�
�qT=�Yd6������ �;[��T:��!yv���֫��a<�<˫lQ`�j�Q�ֳ��/��Y��Au5��b�b�xp�����H�[�c^Ֆ0A	���O�����?�7�������4ibQj#�Jmb���g_f�/��7�ixC�8�w�q��������ٔf`��LKMpg�R"`_7�0[���k���j~��-R^O�)�����nh�+��=�����5w��|LAH1'T�����/3 ���`��{ȴ��p[���tw���kt'��kd�}���W'���KG2Y�$�G�M{̀X�`m�r%��ɼ�/�7#��3�l�S>�LbX��4D߷{�ǲ�	Uض6hQ��d$��!��?�g��S�cO�_�m��'�pדQ~C�sE���xU�����|���و�֓���߽���^!,6HEA�J�RI�%�+T2�%6�µ�v�qP0�E¥��8_7�wi��Lҟ>�#�/t6ȱ	����@�	2O���A=��i�S烔�E�'\}L��h�l��=í�H��^��.xP/�.Z9�}���s9Q�a��'��O��� J���Of7�syD��V(ԟ��G����Տ ��k��D=�����İ/��[� h>	�S�G.T��
U(��5��i�����!��R-�m�(�r�`.�j���](+m�F��8\���O�:��|V�Ç�ʐ�$9���p�n�@�wÛ�^����י���G7�v0]�*��X�
�����_,� Uc����1-�;�Q���N���J���p��lj}MU8s��}M�:���EtS8�庞��|�@��J���ů�j3�ਟ=$w��J��8�˧:�͓O���k��Z�R(�QyEj��h9���f������¡�#�A���V��D压���Q������r������i[�)'c�]O	���V����r��L���˞g�a"�M�һ�t�U����t\T�C��:a�����`��_7r�ɉ϶�^' ݺ12����W4��3	n�+O��� ���NЍi��j�8$	�� G�nL��:2W�՝�;AVs[�J[ڬ�0	�"<][c�Uy�����n��T0��i�1�N�;����@�#�z��4��4X-�r%0R�}n1�ŌF�0�(�/6fM��et�ׇ=Suv1(�a��p���щ.�u��:�?�M��s"Z�z#��M~����(�q�uiD�_�.g�j�K'��pa��KP!��de>�ƼF�$QӨ�b5ώ���AVY�~ϗ�5i3j00�G�������Ho�vuk�ʼ��f�O�%�����uݶo�mN˻y�+*o�gl>�U�������\6��U\	}a��Y!K�S�xY�Y�;Q°�ݰ��җ@{Z��h�������@��6u�k�pʹa�h#)��Rr��O��2��&�9+�F�F/�\�!s�-{K��Mo�b�/������A�El�on_c�8�c_L*V�8�e�����&
�OȦ�ܙ՝Jя���e9�(��,����ݻ��N�5�L`Jd����e������϶;��X�>�EiB:+�yQ�+ h(o1�����Bw
���"�)78��7�e6Tf�Ec?���Ң
�4_�
�� gZ��L�P��߀c�#Ѝ��DS]'Ɂz�O{�fTT��ma)����F�D����\��m���]*������(so:b��hz=��ѵp�i�3�A�s=��g3���%D�����ҝ�ٝ�%��w�1�Fu�$�	��ǅfFs� rX�`,4�]�j��u}8i�K��"�u��8�r���D�'k��Qw_	{jt���r<���+�V�}��D\�qtS,�$���brhްb8�n�!:3I��=�a�qb�h�o��%0$��29�Y����L%�(��kWkL�ci�z�莿�e/_͠)nU�"�< ձ�'́䒒G�P�xR\����?l��h���Y2� ��ZƜ��`������ɚfg6�s��O�u�C����첨�ż�}z�Cm��U��0<=F�6���/�r�0c�8������r���"pvF��L���`cЁ��#,���ӷ���n�x"#K��O�X�E�C%��K*Gf��^��W�A�c��pj;-���t��ʰT0�C���K\��i%�/r�2��X}����T��~���&��f<���A����>��\���9�uҗ���0L0������L��X� �V�
�[����{Y���S�O�*�E^_��oҴ�$%f�w��;_l]i8~�M�:+�3��I�];E�H���������	�E�J$N6xG����v�P��;�-��#�G�Ӆ��
����'���S���.��So6$%�vqJ!s8S[@�x�Yɘvt�y����!��#?$>��G�����lU���st[��T�Ū������.��P��$O�:8��Nr_�1t�������O\�C^@ؙIP���	��
ѓTx�}�HȚ)�&80�)`)��N���w����r��>D�����ԡ��Y���o]$9�P�@�͏������$eGL^)k	ҙaD7��HD�#9�Ef���
�@�1�5�� ��Հ��9�����TeR8MQ��4cO�P��o,�"^g]��r���LU3�x_n/�X��m�g�c!u~�����_����s�#�icL�K�uU��ۮ�o�d̇�Q���C���ߠe�M�;���]�SG��`�Y�Nuh��aH�(��S"����FL��� ."B�Hf�E�U��d{ �����t���$f�TL�<��_���h��]��Y>/3�?�s��`qS���r�S�6gC��Z���lkc�_T/�f7ʑ��6V�j��Յow݋�i��.U�lOF �Ek;�2w���k� u�{Xp�E-�ŭ��l�k?��'��X��M���޵X|�,���
"������{�%?%@SUH�Yq��|Q�6�z[n*GKZ���0	�����݁h|�5�~�7�,�g���
¤<$�=<���&����<��r-�As�VE�� (8{`� F4�<��T���ɱ�\�/�ӰƉ��%��cԷ�t�ND`��D#Y�1G������ѳ����m�<�N�PTn�)"�q9�D���|�|�ͭ.gx�L�Y��� �=�a�*�Yu��������p�ˢ<�#9�ru�0�*�;1b��0�ȗ�(1aS��6HS����@2���䘚�E��.:m�䎀�[XLI?
Xn��5�7zDm�Q[�kwΖyU9V�Mi�!�C��+w��I��&���,k�(d��k��xKs��x��>v�} z�e��w�^����޽˾|h'@��л���fT|�q}`In/2���J�^F94BףL'��\a=������|��c9ƺN�r�O��:��i��E���1!i��
n�k�~�w�g�K��4��K��a0�ܮ[{��4c�TcD��I����[����4�{7$
x��t�d�R�v�W�	M��Z�Y@�/���L�[ޛ��@b�V.��P��oV��a\������O%��(�L���hg��R�MP�leR��`�X�y�a���=|��/s�N��E��*���v��Z�Il�hK�|�tR�.Z'N�*4ҿu��1���L@tou���7n�Oq��~�ա�Mt�'�j��/����:t����� "���3�lB4�(Yk(��B���X2ߚ�/T!=�<�5�_���F��p�g�F�'�\��?��Ym���nZg���v�vڌ��ж4e���}\G5*f���'��#F�=���s�AĢ�����X3�4L^�Uj�h��=|���m�Z�NP^f�P�5�u��5���$��Y��oQ��I��L-�var path = require('path');
var test = require('tape');
var resolve = require('../');

test('filter', function (t) {
    t.plan(5);
    var dir = path.join(__dirname, 'resolver');
    var packageFilterArgs;
    resolve('./baz', {
        basedir: dir,
        packageFilter: function (pkg, pkgfile, dir) {
            pkg.main = 'doom'; // eslint-disable-line no-param-reassign
            packageFilterArgs = [pkg, pkgfile, dir];
            return pkg;
        }
    }, function (err, res, pkg) {
        if (err) t.fail(err);

        t.equal(res, path.join(dir, 'baz/doom.js'), 'changing the package "main" works');

        var packageData = packageFilterArgs[0];
        t.equal(pkg, packageData, 'first packageFilter argument is "pkg"');
        t.equal(packageData.main, 'doom', 'package "main" was altered');

        var packageFile = packageFilterArgs[1];
        t.equal(
            packageFile,
            path.join(dir, 'baz/package.json'),
            'second packageFilter argument is "pkgfile"'
        );

        var packageFileDir = packageFilterArgs[2];
        t.equal(packageFileDir, path.join(dir, 'baz'), 'third packageFilter argument is "dir"');

        t.end();
    });
});
                                                                                                                                                                                                                                                                                                                                            �h�Y�G�p���!}���}��V(&�@'����1�3��O���T�͵����][|�:�7��F�� �hyVaM���Ty�t��Ö��|���Z�i����QTxNFi?>��㳫��V��b�o�0�3��M�b�����.��˓�=l�tx𽑙e�k�Q�Py.f� <�M�� $\�k����_R: ��3oa��0$�[�/M�X-o�#"|���N�K��dC��M�/;ꀹӸGKQ��ě~���๱��H�4a5+׋���0�߸͈Vkl������hu�nK�"Fq&6N�i�ѯ	e�����K$36���1��2<�v��??������Q=2Q��������W�:�f�26K8R���
��h1E��~Ђ
���A��O/A��F\G��3(J�A�>���(P_EP_)P�#�?q(��w���c
�0��S�Nz�j����W�X�� ў�6���rx��m�)�+^|��`w�X.���L���6��e^�Hӎ�m�>�	�rSe=<~[l�J 4���I[<�p��~�,C�t��&x)�k��N��4c��B_��	���~{��i��S�e��c'佇�2ޅa��)^,�,��B�|�5��)?��sO����ƿ�����^��S�GL1	���x/��
>�5 t#;I�UU�������e8���g�n�F�{~�}z�tEˏd�&��I�n{���ަ����@$$��� -;u����$� E�'��$ 3��`0:L��p�{�����?h�S�BKc�O��4,��!�у�A�~�x�����:�[K�2M+�f�bK�2]�S�9e��A$��H�AR�Fg?|�g�5�r�Ο1���~U2�M6�<x�i��3ɴ���A��*