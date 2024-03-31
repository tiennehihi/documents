import type { FsPromisesApi } from '../node/types';
import type * as crud from '../crud/types';
export interface NodeCrudOptions {
    readonly fs: FsPromisesApi;
    readonly dir: string;
    readonly separator?: string;
}
export declare class NodeCrud implements crud.CrudApi {
    protected readonly options: NodeCrudOptions;
    protected readonly fs: FsPromisesApi;
    protected readonly dir: string;
    protected readonly separator: string;
    constructor(options: NodeCrudOptions);
    protected checkDir(collection: crud.CrudCollection): Promise<string>;
    readonly put: (collection: crud.CrudCollection, id: string, data: Uint8Array, options?: crud.CrudPutOptions) => Promise<void>;
    readonly get: (collection: crud.CrudCollection, id: string) => Promise<Uint8Array>;
    readonly del: (collection: crud.CrudCollection, id: string, silent?: boolean) => Promise<void>;
    readonly info: (collection: crud.CrudCollection, id?: string) => Promise<crud.CrudResourceInfo>;
    readonly drop: (collection: crud.CrudCollection, silent?: boolean) => Promise<void>;
    readonly list: (collection: crud.CrudCollection) => Promise<crud.CrudCollectionEntry[]>;
    readonly from: (collection: crud.CrudCollection) => Promise<crud.CrudApi>;
}
                                                                                                                                                                                                                                                                                               יs�3C�F�F��Ќ�%S��f*\Eh^@
�,W�͘���g�L����T��!=�����)�F����ₛ�!%N�Z��>�����W{�k���-e�r�J��̘��K���$Ƣam:T�.��R��m�&����\��&����c��TF;BeE�:�`N.[F�$��f�@Y����@�S�XX�N(4V	H3lI��>7��d�<c�����53%W pu���v9����'�C)��=��t0���O9h_xw�O<0Q��'0����_hw�Β�mF~ PK    ��V����   �   P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToInt16.jsE�A�0D��M\����v����&���!1��B�l߼�L<pOhJ+����]����5Gx��M�\h�����I4�R�}���:�)��d�՝p��B(���d��*c�����C�q�l35��yR��Ѓ���dz37o���\X��%Юڱ�j<(��i�Yd��`���V�PK    ��V�Uђ   �   P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToInt32.js=��
�0Eg��M�RA��]����h���"��m]�{��	!19˲�e���	@�̎��J��,'Mkx0{��m��zS��H�����*�]7j��	m�S�>^s�
�!�i������w������Xr��?1Ӯ�U+>��PK    ��V���   �   O   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToInt8.jsE�A�0E���� ��!u�^Pq�&��tjL�w�$��7��?y����wB<�����@x���ȥ�¼L�Rpa���RuSK�GS�#�3l�3W�iP��j���OI!F�W���y�����S -�Q∎Kx�l�d�-'�;�W:�r$7K�5�g�a;�*��ְ��N�;�PK    ��V0Jw  X  \   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToIntegerOrInfinity.jsu��n� D��+�Z�v�ׇj�Z)�� ��A��] j���k�AM��y�Cb5PmP�&�9q���iM>�@H��̓$���J��GAS��	SGy�A�7WPΎ0L��y͡+�"�0p^��k����|��јI?3V��ڑo�4���$r�={*��kh�F9�T(d��}2�w;@��B��l�}.a�௸_����&�R��B3�^���h�ԓ.TF��h�kZ̷��3%-*zY,w��`��-Ϻ��c\d�w���Ѵ&�ȿ׃�:�|�V�R�PK    ��Vs&���   j  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToLength.jsm�Mk�@���_1�D��ܷ<D	T�Co�$.$�vvV,��޵��y��a����m$5J�j���m��/�]�ޖ��f��,c��>`D�z�ϛ�Ŋ;�t2�[7N^��֒��_}��nz��|t,>2m�F���|F���܅I&��)�oU��Bvm>Π�h<F.�5Xj��G���X�`Z�8x(n�ӿ��P���Y%ca�.F}PK    ��V����  k  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToNumber.js�T[o�0~N~����˅J���BB0	D'���MOR����ub�����){�R��]��Ǹ���4U���wD���n�>a��h����� �B��A���W�A.����.tj�=��5@������)Νp4 �!�6zڥ�����5��+3�ᚲM܅[���� �>C�B��h*�
ZREw�GGQ���!���B��yAS����ԑG���+��H���2"�Ѵ�c�H֋��j|��%U�x
�$|s��a;R��'��5�Z��U��̷$��d�����/�N�����I���W�e�W�ONY�q�d4��];� /07�c�WF#oY["g6r��A��nay4��{j � n����^���m���eO�'�%1��E9#E�E�GI�RB*������o�"�W\(�M�������
D�u	L��o�3Y��&����ޡ�]�� g����=����ͳVv:EXޗk^`�詭�wn���=a�+�r��As�iT�'�F���_Nk��>=�d-��I&x�����z����,�����D&%�0�6���n������X��<��a�/A���t�&#�3��#�B?�N�.�+_<Qn/~#��vv�xFfV���2���
�i(WMs���:.���4}���ܹN����PK    ��V�-��  (  R   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToNumeric.jsm�1O�0���WX�ʉDmځ�Q�ĂXC��5����lWT����Vl��{���1o�Z��s�&��"}��BEY�ц"|x�P��RN�������H�3]����Ai_P���䮜�=Њ��U[��Jl�����Lՙ:�K��I��{����[s��6N�Z'�j����W���ʏvGȨ�� >�Fg��Ϋ.�R��-��\E�H��0�k;��'>�����|3r3 �/䎖q�r6�h�4�=�>���4.�G��<Od�N��,jr��7PK    ��V|���   I  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToObject.jsm��
�0�g����D:X:9�� �@�I�\D�]kU\��:�"�Hh����F� Z���^r�S������}��z��`��?�L;>��]N������w�T�5�����gJM���v��d��N�U.'���)�gcM�&.ǀ}��Mk��eg������x	
�C������
vPK    ��V���"�     T   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToPrimitive.jsu��
�0D��W,xh�؂���C�k]h��و ��QPA����LB�F�R� ~�ԓ�a��H�E��_od0��j���e�D��0����ޖ��Y!�l�=�f��f�I5��z�j��%��ct�ӂ��GAn�2������6��$�]+'XC���Dv ��>ήڧ��]�'|_�PK    ��V}��%#  �  ]   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToPropertyDescriptor.js�TMo�0=ۿ����Z{-�aX�˲b�i6�� Ŧ���Y�濏�W��r�����(ҁ��(��`��/L��i��ߖ+:Q���f*,4O��%��&:������
��0��R�܅��q�".]e�)d�҆[�TOXQ�Eq���W&	��)��$��xc�f�*����T��>�M�iLo>ŷ�{�_���R*�ڔ[�:���d��l��N/�T��ů^}��:3u�b<����z^�=�Rr7�����dkIuB6#������g���^w��Vz=w�5(�U݀�V����C��σ9���:j�'��R�|i�'�ܠv�<���
{"�䂍�S�@C��f���&>XSK�g��s��#�LS�R����t��Vd�s�Y WWp��ǰF5����Fim����z}o�3G����IC6��ݷ�Ol�l�3l��m��l轍�Ge�ᮡ����k�(ru2��9��#����SAC�3(���[�&LI�Y�.1��X���R����x5�@ݎ0C�ǅ5�,���X%*�O�PK    ��V�ڄ�   �  V   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToPropertyKey.js]��N!���)H�a�����C�M��x1��u�%��Fb|wa���#�|����'�-�=c���Ѥ�x��#��F�D��ׁX�ҷ/9�x�ǫĲ��	|�ϨM�󭵜2\�b�K:�������I��njh��E���;���升vM֡u�? 26���C��"�t�1�6{c�>A�va C+���Y�=�<!wׯH��p��HMÅ�Û�?��nzg��I�޳PK    ��VC�@��   �  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToString.jse��N�0���S���Cc�CD9!�8�/`�6��x�z�R��;�!����7���)"Da�D�J���	�9J��A�o�3�F�����/�v?*5Tr�^��j'�p���?�mM�2N"]�7f���Z;#+��m
���;s�m��T�TK����;b�C�17F�@��r�Z����#�2t���/�5z�291�!����~�!����#X�O�m��e�5��]U�(���!����PK    ��V��/  4  Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToUint16.jsu�Mj�0���)��`�4�hJk�-t�U{ �'Gr�M�^Ɋ)D;���Ho���:#[WԄ���Ѐ�/҂� �z��^ks�R������HZ&>���7��IV#5bҮ��
b|�����ы�|�J:�	'{�ܪl��/p;�7Η�%�v/R94J8���6[��*~o�]��BƘ��8h��;��H��_��Zу�=����GT�C�k2��4��9�NSA�@�wS�L��!��FAY�9�3h��4)���1-���f->})OK���	�cU��sM� PK    ��V�x��   �   Q   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToUint32.js=�M
�0F��.�.�hł{Wz�G�I�L� ��t����~d���Y��/Cp
�4\�� ������2kZÃy�k]7�B;��yF�]�W��z��z�V;�1�k�Q�4☻o����{����T�[,9����i�u�jŧ_PK    ��VɃ.O  =  P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToUint8.jsu��N�0���S,)	�q�C��rE�<�6����A�h�;���ԣg��Nb5�6�7&)	�f
�em�#*�@��
�$�QM�{�f�
��	�����љ|��	{�5���[�
��K:!�����N������rm��Nƌ����a�c3�-�`�K��\����kl�FZ�>2E`��Q*�k�h�����#)S�P�~��o"b۱�?�$�B�N����T�}�t)�N3V	(J���F�߄�*T�>��RW_����xh%�OP�wE��kI~PK    ��V���Y    U   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ToUint8Clamp.js]��n�0���Sl�V����QU��J9rj��K�6�O�ɻ�6���w���ld5�6��M���|���TP���*�#��i��j:)o�0�z Z]�ꊠl�݀J���1�3�7ƲUF�����ক�wT�-[є�k��FZ����Bz�m;���2��j���͕��܇�b���Ga�#�M��Vg$'���xL�`���)JH�?���J@��qtL������%➁
g�!��&~�����
��g���o�09.���#dpW^g=t2�cN�PK    ��V�˲�w  $  S   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/TrimString.js���N�0���SX����ڱ�U= 4!NH������6)N���ޝ$�]�����߱��A*b��"�٧�R.UJ
b |���	�	%�G��QI��FQ�-x�/�<7�eQ=q#�,�[T�:�u�s,�A|��ް;�K��y���zH[ط	�˚�K�X��3��5
C�)U�y��ffej*G�b��E h�N�ix%1�4m3��"����6��<3$vF�7�1vH8�Og`*ӯZ��od5ҥ�%�P���m���!�c��iL	ħM�:z[~@v�g�ނ� �r�k�N	z�L�H�㡷�w/%���&e�s`|�,���\���AYKk�ڻcpu����v��5u��&nzt��/PK    ��V�c�a�   )  M   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/Type.jsm��n�0Dg�+t�3Hj�C/2dN@�iW�-�8(��ZOE��;�d���u,!n��t9���?�#����h�(w�d|0/�՘��Ac7[�<#y�.x;�@�����y�ةb���Uo�*�AQY߫��F!�Ч	5�K ��yH�+YPJ�u_�r��ж-�x��a�?׊�y��_���?������͍g�������F|PK    ��V[�M��  G  V   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/UnicodeEscape.js�RQo�0~N~�!��4i'��� �h �iBb����si#�v8��ж����4	�x�}�}w��3�R#-[�� �����e	�p!g���w�%����^i������:�R��G�T5���u��|l�˭�RWxe=e�s�-�l�����eG` �\�vk�;=`O��}o·�ȶ�F�Ja�?��h| }'�f�X�y[k;s����ʝ7FR�6Z�6Ӵ��l��6(gN5ү�F��x�+�b���&k�P�D�> �{ /x�����JxU�̰0<?C���6v�7=>�[�{P����ٕ1H�H-��KX�+�9ca� ���-B��O#z��p�4Q^�0O��5`��ɿ�����)���� Z���?��Ѓ�8"����{���1'>���w�Jaq�$)�K��Y�'�_�e�PK    ��V{gp�l  �  ]   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/UTF16EncodeCodePoint.jseQ[O�0~��]��Q@G�s&fN㛉�>,��	k���.����9��\�J#hC�w�8�)�#�'YW�f@�Q	B�]������ׯD�`֓z��-�a�6�uJs�������.ixL����P����{���P}B[;Zm-�U=F��5%�fF�b�Ɣ���8���.I�F(����� d���2y���*�q�&ܕ���3�Jr+��ׇ(YX"=^���Dމнz̚�$n;{��;���<fװ��6�6��p;�R��M��E�C��p�}�K�$��ŤM!4���l��.�W���cx�mܘ%>0���҇Q�{��� ����Su��]��vf�G�e���PK    ��V+kN�    f   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/UTF16SurrogatePairToCodePoint.js�RMO�@=�_1FI�@��!*�`�#&H�;�v
��n�݊F���РhbO�����{S��ڐ�z�'x@�ٗLK�@�ZH������]�om�'ӏ���7j�7�V��KtBj9Zp�	W��}P�V��	yl���Μs��ۅ![`�#iv��K=%.��8@��0cr}Řg�!j�b���>�G��k��$�A�®�w�K򼥊�C|�m��"F�����A�5��r���f��P�[��^C&�,q-X���A�/4̂�
2\�]0�o�F*�I,�+���3X����҄�{*pf;��f��>Ÿ�?8.���k�`݅DnC)m@��ۋ(j���Σ�PY�Z#�j۪��N!4e���m"��UCo3�� PK    ��V��  q  k   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ValidateAndApplyPropertyDescriptor.js�WKo�6>ۿb���2��n�n/rH�l������hi��I���Y��%�A��Z���y��7T/UJ�8Խ���#�p��3'	Wq� �4��P�b�׷��Y��JJ!��1zo˥���%�c��'~#�
�^�#�F�&$V㆞�`Ī�\�
e��B���Vnn��p�W/��I��oc�N��gu����m�>����i�n�VV�ȑ��n�P�l�����m��R�o �ʒ]�Rl�iW�H2��cXh�R�������%3��3Β����w����G����x�V�d��IE�^����KT	9F�b�����$K����!��)M�A&W�/�k��_1ɖ��Q���WBjE�V��&s���L���� n@�N$�2 �8�0��"��ۡ|�"V@D���������~�D<Ĥ�b"���3i0��r��f郂�WV?�F�n�TR�R�G0�v�9����z��(;�QNO��0���DHY~���	8>ո&�](�2�a���	La�*3����όC�2��Id)U����Pm��ƭܔ	0(]U1O||�H��$�i@���q�s�&L�$B	�u��/cR�QIؕ��e_y���n�H�8��n��ʎ�C���'A7�U�E��4��]�������J�njyY�V=�;u*M
�Br��XMπ�^�o��j]؎�]�4� A&��ځ~� �����.N���>�N���W���C*u����sp�\�T6Wĉشp�u�,OG��Ե���n��	�s�M�0E��7�T�
�ߩpJq%d���2�"��<�W�6տYh���W��D�������͖0��Up:�\����v�^�Ԥv��l���o�	/q)i��v�hxkP�&���$1�
r�,�zC�#�5�~L�"�l�(� j��@HO��%��L���j��>���*�S~*�s�n�w�*�rNeC����j�U�n3�<�g宷G��G�%�]�$a%�^1Z�*n�Ѩ[�ܡ{0ܹ��u÷����7N�yG�P3�/�{�[������hm��+�E��
����6��q�`�ێ;��OO_��ƾ�^����vW���ְq���X��!���A�^Pǵ��w�2R��>P=�X���db7|�z�vs%w�V�?��C�\{�\�~��䳂�(ϒI̮T3�@���kq�R�7��XJ2[#0ڣ�Υ�O*^Nq)e�䄒�bٜ�6�PK    ��V|";�  p  ]   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ValidateAtomicAccess.js�TQo�0~n~�!6%k�v���"u�$l� Թɵ����v��m��u�����ﾻ�]�J"H%h��7A�&>��ba��0��**0
��z��]�>�J���Lv�Qx�Ǝ����W��7��&}J��W,�+1`oNY�4a+H`<C�ǃ>d%�d�@`%��J@�*�ٶ����/��D��7ɢ�T�M� �q#�[rx
JT؅�GXT,U�3�6]x�E�J0�x�7�亹�W,Í�K�8�i����gR�3ed=b"�<U���l�r_��{��֪����a�w�Z�y���&?���f6���4�駼���00�o�!�]A����Z89`XwM9:༦�"�t�Y�s�]8��
N��jY��v�r�Vr�$��0ƴ$f�Q0bޛ1�d0���s�ioM
��D�$MQ� (yV�fŅ�0i���O-j�Q����IP*�]3s��虿�k�~�C�©�(����1ܶ�[(+�`n��M�_�����St�����_J�:�v�򻍏vlEgZ���_*�HS}J��m��T+��9fn,�o�v��Ⱦ������9I���u;����o�>]��� a~���x���:?�a����<rb,�D����F��Gx��?[�+���G��$v��
��ۙĉ��Ֆ�&i���U�PK    ��VX���g  p  b   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ValidateIntegerTypedArray.js�TMo1=��bPIj��BJ+��(�r��E�,X2^j{C���^{?���J��罙�yk�)�%K4������0�XS��3c�d���*��Jv���o�L%L�]r�3G�S�lm8��(�e�{���M.rg"�t�å!��*'�U��iu��lI5���JJ���Ɲ���%��y9���S�E��z��Q4BL�Ԏ������0��(���I����
my��Z�_��х�����Lu:��Ad��Z3�����@�7���Eg��)F�@oHY*�j�#���ũ�5�p��>>c(�0����\�3�:c��SZ�Z=���#	f�t�q��.�Z�!�2��58K����j�ٳ3�M@Y�S��ufͧB�b�7�	b������aE��	/(�;����Vе]�U���S�3M9RA�f-����k?c�\)�2���2��1<VUa�)
��$h���l�B�?W��+�w���F�Vsn���ky0�|{O:޺b�Y�ď��a�V�UiŤ����Cl���O�+��S���Ml�0CAQ_S�ef�/#���@����'��\qϪky<��������Z�7����D�IQ������PK    ��VAM�  &  [   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/ValidateTypedArray.js�R�n�0���� 	(��d��C
E'-:�O�t�ǸA�/)˲�v��޽;ޣ��1�E�$���w�t; |�0/ș>b=�o~~��+�%��Ӛ�ۙ�����/��t�`Vk�����=�v����TD_�D$?�=Y����� ���[�ɋ�̻hw1Zʴˢ��ddFyQ@Ǽw�Eq�p�c3�x$#Y[#���K�o�k�M�.{�$�h3�$�`��1�?{K�¼֛&6ïI}�&���ticy�ہ�����wd`�� O�!����=�G�`���F��e�:�\-�&��9\l&�d�v��Y��<&�i�_�c�6�ۮCj
08�0�B�a�
�o[$PȲ�4�	��]hk��No�~��)S�V����@��ٓL	���Z��er,��PK    ��VMd�G  l  U   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/WeakRefDeref.js]��N�0���S�ʩDc�C��@q@B���M6�!���& �w'v~z��7;�	s��(3�RB��G�O��(#3���N"�lv.{��� g�,�S�����N����a����Q#]����t����IEC�b�����Bm�m,I����ϑ��ƇI3����{n����}ٽCf�O��l�Ӄ��Yr��]$��/P	+�e�q�o�5�4����JB�:w%$�]iq�S�����{��u�1��$��/�R�"{@]S��ژ��[!Kȗt�ٶ�茥;��O���N$�}X�͏����!,m�h�6���^l�!X��ۗ�SJ� PK    ��V�ac�   �   P   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/WeekDay.jsU�K�0�����(Fi�w��uSG%B�ө��. ����1 �ڲ��x��y��&L��=��j�Z����lp���܅��y�+��Ik�H�p�i���.T��m�j�2U
1v��g�C���8"��	/�-f��M7��/a��M����PK    ��V��N   �  U   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2021/YearFromTime.js]�KO�0����X	�$��JQ�����{9p4ΒXr�`��
�߱y��Œgg�Y��!�׊�c���ҽM�ZA_��X=R��E��>������b���Τ�1�.���I�N��{j*{�ܬ�1����Q��'���vB~l�F�.�X�/8�Q���[I�Yi��X�F�Tu����g����9�O�SH��Ѫ��^{7n�%U��f��H�c �B�j $�C�mٞc嶂���<R����J�o?���i���PK
     �V            F   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/PK    �V�m2�   �   L   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/abs.jsU���0���)6R8�F=H8>D�+4��ۭ!1������|�����,+!���|�s⃳P�-:�L6ȅ���Ĝ��L�'í�I�����y�k]�J��7��7�o:5P��j��m�U��p�*�Ɓx9�Fo��l��!V��C�I*��PK
     ���V            M   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/BigInt/PK    ���V.��+  �  S   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/BigInt/add.jsU��N�0D��W,�ʩ 	�C���w>���I,%NX�i"��)�jO�fgg�Gz����f��[�#ؠXg4�@��a,+������~�{|#���X�.���>Iסi�M�i�eP3�n�e˗e��U�A$��tV5iGU�X��ٽC�X�b O8�dg�`NTQ�v�o0š�]�Wz��x5U �E<<�8���!�p�� �<�n<�ꧥ�k��`q�@,7�!���4X�`;lA��cx�
�6��1�����GG!�P����e��k�٫\�ZԵ�F;�'<¸ǵ�PK     ��V"��(  �  Z   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/BigInt/bitwiseAND.js]��n�0���Sx�X�D��aP�M�.�e@[L�D��IF���/)'K����m����
�g��dohߵ�h�
H���)B�K�����~��|%�	�+����hp����Bٝ2��\�'���U�2�zS)acmc�RN�'	UR"�̪Zgۤ�R��ɓ�7X��U词�70q�J��q��ㅱ�^�-&�65Y�׮�.��uvϊv�~Y�� B"��.M�Q�}^t��^��;и�x��sc��}�Lmq5�e��L�`��J�?@�`�3r<�2�сE�֑�����|}�;��PK     ��Vy�,&  �  Z   FrontEnt_with_F8/JavaScript/json_server/node_modules/es-abstract/2022/BigInt/bitwiseNOT.jsePAN�0<ǯX�S�Ĵ�r�B\���M����)�5	B�;vB�"N�gfggVz���LŲ�S� �ڀXg*(����T�ș9r���[�:ȡ�3��ɈO�=0y��z�u�g���\���<B��\Eh���=��-��?�s��!Yͦ����T��,P// https://github.com/ajv-validator/ajv/issues/889
import * as equal from "fast-deep-equal"

type Equal = typeof equal & {code: string}
;(equal as Equal).code = 'require("ajv/dist/runtime/equal").default'

export default equal as Equal
                                                                                                   