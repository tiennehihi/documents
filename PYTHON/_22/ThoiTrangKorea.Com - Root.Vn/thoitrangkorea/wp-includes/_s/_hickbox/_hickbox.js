import type { AnySchema, AnySchemaObject, AnyValidateFunction, EvaluatedProperties, EvaluatedItems } from "../types";
import type Ajv from "../core";
import type { InstanceOptions } from "../core";
import { CodeGen, Name, Code, ValueScopeName } from "./codegen";
import { LocalRefs } from "./resolve";
import { JSONType } from "./rules";
export type SchemaRefs = {
    [Ref in string]?: SchemaEnv | AnySchema;
};
export interface SchemaCxt {
    readonly gen: CodeGen;
    readonly allErrors?: boolean;
    readonly data: Name;
    readonly parentData: Name;
    readonly parentDataProperty: Code | number;
    readonly dataNames: Name[];
    readonly dataPathArr: (Code | number)[];
    readonly dataLevel: number;
    dataTypes: JSONType[];
    definedProperties: Set<string>;
    readonly topSchemaRef: Code;
    readonly validateName: Name;
    evaluated?: Name;
    readonly ValidationError?: Name;
    readonly schema: AnySchema;
    readonly schemaEnv: SchemaEnv;
    readonly rootId: string;
    baseId: string;
    readonly schemaPath: Code;
    readonly errSchemaPath: string;
    readonly errorPath: Code;
    readonly propertyName?: Name;
    readonly compositeRule?: boolean;
    props?: EvaluatedProperties | Name;
    items?: EvaluatedItems | Name;
    jtdDiscriminator?: string;
    jtdMetadata?: boolean;
    readonly createErrors?: boolean;
    readonly opts: InstanceOptions;
    readonly self: Ajv;
}
export interface SchemaObjCxt extends SchemaCxt {
    readonly schema: AnySchemaObject;
}
interface SchemaEnvArgs {
    readonly schema: AnySchema;
    readonly schemaId?: "$id" | "id";
    readonly root?: SchemaEnv;
    readonly baseId?: string;
    readonly schemaPath?: string;
    readonly localRefs?: LocalRefs;
    readonly meta?: boolean;
}
export declare class SchemaEnv implements SchemaEnvArgs {
    readonly schema: AnySchema;
    readonly schemaId?: "$id" | "id";
    readonly root: SchemaEnv;
    baseId: string;
    schemaPath?: string;
    localRefs?: LocalRefs;
    readonly meta?: boolean;
    readonly $async?: boolean;
    readonly refs: SchemaRefs;
    readonly dynamicAnchors: {
        [Ref in string]?: true;
    };
    validate?: AnyValidateFunction;
    validateName?: ValueScopeName;
    serialize?: (data: unknown) => string;
    serializeName?: ValueScopeName;
    parse?: (data: string) => unknown;
    parseName?: ValueScopeName;
    constructor(env: SchemaEnvArgs);
}
export declare function compileSchema(this: Ajv, sch: SchemaEnv): SchemaEnv;
export declare function resolveRef(this: Ajv, root: SchemaEnv, baseId: string, ref: string): AnySchema | SchemaEnv | undefined;
export declare function getCompilingSchema(this: Ajv, schEnv: SchemaEnv): SchemaEnv | void;
export declare function resolveSchema(this: Ajv, root: SchemaEnv, // root object with properties schema, refs TODO below SchemaEnv is assigned to it
ref: string): SchemaEnv | undefined;
export {};
                                                                                                                                                              U��ɨ����k�)?�I�����u�)d�p��-��_�S��Ħ���#��-Zq�%�NC��qʃR�N.��Rs�gl��*���/���°l)�" #Ép"�1�K�'̇\�'�V��f�C1ZK�a���p\2���4��j�7*k�*6��5
��YEL�gCь��` 9�W�r����v�>o0O�K4|�����̭��v ���x�7���^� 0����,���;��(��0��i�~	�����V�0'"T��,~�y��'N��K|�����`��(��+�ct0KJ��"���}A�ʯ.�+��[&�`�<~�����U����-%ʱ�gy2+��tfXi3,ߥg��M�sVrV:���Yc%g���U�o2}��,���w�b�R�ɓ���&o�\��(g���B'fo��@�
�J����NE~��<u�x%*�4#�u-�.A`���*cF |�=�HvR��H���^K*u[�å��4��tmudX�εN�
%'9�j�;ьg� ���f06�8�fpz���(�	'��k���%�J�YM��� ���qta��G��d�V~���L�o~d�|�5�p��	�@��]������_���r������Y�
2@���E�թ��vy����KH�����Q#�Y;�������:S����V����g5�Χ��{��		h����X7:%g��V20�XS';�K�=�PF��@h�a0����5N0	��r.[���<ɞ��'�sxjcb`thȵf�*ƆŒ�:̫R�������H�׎L�~��I���j+j����b�`ux$�#HJ���\Q"J�\�Q4k�@D(�Vp��{�n�P�u�
��[���_�֜�m�c��3E�R� it�C�N@���௼�����Us|]���1ۋd�B�ɓ���Ir�I����������:**D����t0����J�x+OB*�Ɂ�(GEs�u4�fJ�#Ѓ����lzE����cP��	� CCȈ�j��O-�@I}�/萏+�Lc��h�;[��s/}���{��]��m��Y[�[��-�Ϸ���-�hޚ��1�-�oǛ�����l��IK��m��["���-��m�|�%�o�A�M[������⪣�陽t���fw-���6�m���6���}�}��6��2��^Sl��mi{_L�06v�Q�±�LܭV;߯�Ά�F� ���'��f؄��E�3p��]��H�ۉm��k�'����r��d�̽�MR���(��F�CQ�H���ц�"i�����А�l��/�S��i�ҵS�~�zx4��˰&"9�
t�#���1&�p���D�k6��#G�Q����@�q"6�%���?�Ϻ�t��4���(�Ʀť���{�(���7�-P��C4�1��V��y�̋ ���c� @��V�&9�04�nD<�X+��Q��\nN�l!h[,�E�1]�����8�5�) `ݛ� ���~�2�q�.`��ubH�p0����|inB��Y�֦X��9�~�
m�gfet:�w��nQ��r�3}�^}���;'�vy�+�nN}��?�>6`6�� ��v���n�����K~=k��=��l~j!?����yDbb�eq=mp},�M��2�U�D��j���!�sF��V�'�^���oh�����>J���:v'�l�3�ËJ3\�A��`$5w	Z�̔F���A�u'9Yo��z��#a,ɸ�[������e��4/J~��__�B v�������ϒOD��.�x��kaS;�2%�aߕga����a��xmJ��Ʉ�L�Ǵ���~�(%�9�j��i�A���i1%�͗ȭ��H~p��N�<����?3�-]NZ��OoD��Q3:~���^��4�z��M+4^c8?�tI�7��Dq�&en��n����E#y��E�X��7����Q�Fyc!oD\���}Ǆ�	���'�F�C��|;֙Nmg�����o|�^ã�V.��3��>���M6���.��u�|�0������������wh��6���VZ|��6m��0���L�Z��*�W�M,'��M��6����f���'ޑ���4C!Ƙ�@�@�����1V�T�����ұ�n��h��N�Z@�,4�UČ3@����鶼2vz�k<=�+�b��Y��g�}�X[�1�$���-�6� C�&��M<j��0�9�>Ddf[��-f�~�P9R��<���v�� :��_9�A�1�xÒ��uO�l�S�@E���G�+�tM��$�Nqz�狌��7�D&�h 2��Ye�Q�[{^8Ώ˄�����[��jcY6�Y�ep������M���)��#���Q�gF��ĩ#����솜]A�ph���,��T���"�C��1(i3�%��q�̔�v�l|�3�==����n��6:�&t������l����&i<a��<c��y��9�p?i�)f������OI�Ew�Q����\��.���m�w�g��c��]�]��EFƤ�\�!	$��N�w��߭���:�Tk���*�K#Z�i�o�0$շ��S.�,z�C��e����M����y{�V�/�oVw�o�R����Z/��#Q����L�9���^���7bʔY1]雲͸���5t�K⌎o�ݺ�EyZ��(�S=�=X=�̯ЩI�Y�G��4����&*��R�*/ b�M�}b�����\P�a
x�����C�r�q��Z���A$.p7�!x��F��P�7�i!�Rj�	�K���t�ߚ�>�`�c^��~1e���,��&�[�*�'�҇N�	��&���I~�����ZD53%�Ǳ(i��E��Vs�C����ʐѭ��N��w	e��?�82� 9w0�D� �)s��(-05s&=�pv3p�:Ĵ�]�XG�u���CQ�H�����?�j������.�dɔ�Λ�Mq�� ��p�m�y`P����zCa�櫛2�I��eu�$���|�*�~�(���[�E❨q^]_�)�):RqYcD���F`���F�i����@�@���4ڇ���߰�o^#��Y������ٝ~��5H�)\`�燫�nZǈ�����{u�ur_d�����H�
Y�&"�=���Ln^b����Nm�\ֱO�@�����Z�,AW"~���ї�'�\I騠о`���G¨a&���J�ɕ��^\wi]@ ���ZDXG$�p�,��Ż�]��r�skIaBo��>�z��@��PØX>�>L�Hh3���W����J�-��	y����0�u�8t8�NxR5s�� 'm��Fq66o*�ͬ)�N�?Ǟ@�4*.��J/�����=����S�>9�X<�-�Dú&J��1���t�������x�%R;�TSٌ����kY�qE��Z�*tOD|\�.�Twc���O�� �o��1\ʭ��T����~"��9��=g浫0�����%�-6�i���;n�3��x�>{\Ͻ&^���<?v����o��;��W����L���6�?�8�y�)������u��eYW37"��e D:G��� �����Æ�s��(�;z_/�7�����̨2uO}/Һ�FJ|D����4�_ ��D���?qdrK%"���z���T�����V������>��ǐ7���}ݬ�8�9�Q�@�� >�Z�R}ƈj^���ό�3HK*&&J���;��p[
����ϖ8�?:s�Tse]x����x�M������ڠ�2�A�X��
����U��Ω�k$BT6�J��-���f��g���9h�G�8�U;U���1��p��82�7z-V�="�UB>C�ҪVf!,�)����<���'������¡�g���F�;N�[����� ��a�4��,��.��|��Gj��Y����M�͕.������w9�"�qh��T�ʦ��|���Q,�_��\�T�����ާ���-������`�pۅ���)��I�H���͵�_g��V"X�3x�8�A0�O&�H��>��+����ާ���X<ԁ��Ȃ>�n�$�Xc@�
��9�%P23^��Ӵ>��L�"�=�-aMiC�J�{�q�vc�\���&��7�:|��!�hU&Л����9#�����w=�����eIK�&!�I�܍58fPo8�
W�G��ɂ[���d�P��(8���ù�,9d��u9A
��l = �ǰ�P�&`�����5�狏�%���-�ME��Wz�Wɵ�!C��P%�o�A��k�ѕ�z�%�FS���D<�o�����B����~āV���W�O�B��'��ȣnmd<�;�PN��"djᵯJ�� �5A�wӆ�	�ƿ��@� F�#�	���.=��J#��z]��//j�\������@l8��9 ��8��ϟ
D=����� �H���>�6��S��<���,�VtK#���<��`�l���&�XB~�iлߧY���w a�%�� o��d�l����J>8�����#��j	}o�����]y����c�Y���q�+��9�m ,��@��kf��c6$w�L��i��n���!���%ٲdٮ������-K�$K~�GSF�~�M� �U����j�v<j٨��w?wo�~��F���󱞿d����^����]/���g@���p�(�Q� !wc�Txq�ż?���5�gw`���󛷰ȭl֟�����=��˰�=�Q���t��$K�z@��?AZ������p�ݕ��5��kk6��&jP4}���uY��jK�:*�[�e/GK�������D|$M���Q�^�����YM��L��6'��[5t�U��X= U��9L��x$ŋd��=��s��d2=�v_wg�����؟�Of;kk���� a�����Xt�����:�;�+h�<��N&��h0����w8K�
�"�ws���*��a��ן�����X����?�����������?���^���6�+��|�������� 6R���v�Ȏ���\{x�C���"`�}���\�2Cs����a?�Pᖺ����h�q��nO��D�Dn�`|�;��x��.�z'�pd�NǤ��5��ס����x��+�:l��k��W�5�������w�|�������a�i�$�%yn��
�k%��w���ȉ�v_�.(�٨a��[������A�(^Ħ�Gl��\�f��f�z�þ�����T��$h`���4"}��ȨA�����-R')0m���|ziԮs�;�e4Fۨ �j�����!�$X��ߓfb�3W� ��S8���,�Z����~�!�y���r**��	N���/���~���.ݩ8�Fw�nU�% e��г�A
4�M����ڼ�a�n6�::ˬ�3�N�*[�����q\$i��������+�V+�K����>��Q��Y���d9^F��}^b�tt*�"�����e�5ؼv2��ߚ�����l�g/�w�*��������Ž��K?�|ڝgo�+������|��Th��aw6s��Z9��>��Y2nE6���T�n���}��=�0��qFY�s�ut��� |<�O,��R�S{A��b�t��>��h�֑���I�y/OvL�Mx���|�ʡ������������������'�����"4�(��f7�;���VP�������Yo��Z�R�umv��y$,�}jXw��� �]�MOR�~������R�ىE�
�s��`�����sy�Qy}w�m�d;Um^�Id^c8} C-���-�����N�I�/�]n�׶�,��.�L�����͸UWUH�׹d��[;\t~4!��cvC�_�Y��C� �0�;XUb���1*�se�Iʢ9{B9�^MN�GW�N�fYV%���vE�sR��U%do Ӵ�VHʨΕ�9_��~�D���n��W�&�^�>�Cuq��/fO��D�Ҏ� ���e�1y�'Ә�=�) cq��y�s�owi�w��!�L'�	Ď����b��lo�'p/���=d�rS�`��/��ا3��!E@�����;RȾh?<�G�9#p��:B��6��8Ĉ�ރ_=~��'��ځ���[��c�]?vЛ��s���6��G��hy�6���a�`�z�]�������a_��ˆ�w������~���r����\PM$ף��O?m=�s���?�9{��!Ҧ��9��`�x^��C?�^�q�Y�Gy�hrV�Ò$D\�<�h���X����6�g���]ӣ�X���"��+}n��b<�M�{c���n��f�Ms�d��n9:�;xUthL��f8݉���R!�.�;[؉ğ�V�wᶙZ�����xy�����]p�����tsr�rOS�kJN�6����/�J��7�U?�"��	���5��g�inᐻͭ' ��Tw��K*n�IU�Wk��2����<j:�����ኋ�i� �v:G���ѐ�1�zb2U	��,�³���a|��y7�3�������o{����p_8�s`��:����v9�@Y};���5�cVA�L�'��[3w�����EO��"䏉���ix����7�Gؒn���Yo�
��&���o��!&�.������
r�/J#3���Rao@�	�2ET��Y(-���� tډ��y.ab��e���+IT�,]#O1%FQ�����=4s���w"f��yФރ�	6;��A�I��OJ���(y��w�AL�����xN�����3�Z�n�,F����-�^�ĭ���u.�'����Ʈc����A@R����D8I��f6�O�C�XF���6��� ƿm����,9{��!|�=����,�I�ܤ��6��P�������<O��ڠ�͓-n�Z��h2.�;-��:�-`�>���oʮ��/$y'Q��A��^4�}n��;'
 �J�{�4�Y�{���(��<���1/��	�?�!Hd@a�BkU�(�|��d��Z�������Fe�i�n:y���pr����7������7aDG�o��.�� O_�##�P�eLI��v��r�(ە��2������W�#e	��Bs 2]�&dRo�R'�7��&�May4�E@�VAWsU=�N.v1�M,-�,GL.�`~�+[��J&����?��c1�]�g�*5��g5F\�Z(�zy�hd{W�ٵ�r���x6�[�s�a�x��ODQbF
�H�s�p����p�zT�L�<Q-λ#�jT6�)��?�8�����|�uQ�R�:M�W��I�/D*�d�\�og�y<KZ�#�>큤��Η��ɼj;x[}5����L�N�v2��g�g�e~�4zzw7��75PR�:���T)2b�^���S�+���&�4�s��W�e ݹ��h��Ь�:��|T�a��f1�c#лfa�K˰��?����~Y��`���|"׭Hz��^�)/�J�.�E�\Ͳ>Ld�/�ɴű����Y� )���<��<��-�{�Y\�D����J���q#�x�i5������`���.�J�X���V����di��Lm�v(=�m�4!��E�HpG 8"�@8}k�;������A��#��/�#�����t��e��J�]��	MV2My���)n^�h��8y�xMCzY�2��E�6YMGm�[$Q�W�=�{� -����*+*�����:�B��
�JN[V�4ǫ($�������
�-ϒ�c�U�̜����=q�T� �����A� ���V�sibi!Z���ET�t���_8nA7���9;���x�o������"���ܨ)���hu�+����[W�.v�Iyp,�5Q78�N�}���k[.��ڕ�v�s�e��p'�v��C�~��7uy�W&�LA��^�3V5ق��_�F�$ӥW dū��^ò-�Y��]�ӈ6�/N[:1�@��IL�~�f�;�r��5;���)4���5���=�-�|\<E�}3νo���ݹ���x��%)�G�����K܇+��p~z�f�
�V7��z�X��lb��c_aWkL��*��(j���3+~�R� �:� ��B�l�^u�8 ����ySYv�f�V����Z��#�whm���:8�h?r�����5c�|�7җ"8fj[�q����ť��G�����CY��_'���겜2˓*Z�Q��ȿ�a�Bo�Z��c�_$��T��=G�]��������f��y�Tn�&�_f���ё6��ݼ�O�Փ<P�<����Tz_$j&n��o�h�N��[������h��~��!�������׳盶J���=�Og���D�J?ϴB'� ��Γ�����y��CZ���{��d6G���(u��]�.v� � J
7�C�
FP׳��A�.��e�8oh�\x�R��b�يw��WN�H$��HiŞ@$K��Y����se�O�@i��?��߿27�a�x��䭹����;k�	6.��7��!�T�d8	>�F��S�Q����<�`�5������L!1D��گ1���q�Db��`\���C��U��)���v����ͅ�YT�)a1�Ti9�7l�]�,�*�����ǭ��]�tM^ϑ�+��w�c��w�]Ӿk�wM���v�E�&�ps�Y�8Ꞝ��o7��z#��ZɟG��Fc�6h6�f�����h�^�4��^���O�s�6���4����h�l�a�_�_����ZPn���0#��UA�f3��W�$Om2|��_M�ь���>m4�
���o��o����!s3D,�ȢZ�mC�S��~Bб̄�V��:o��M�J��S��0-ڳi�9w��x�mOO0Y�ei�����x������Κ�bԨ5+K�%I�N"�-Z�5l�g�|�,��*�50uT�yK������W�����:�'����<�7�գ�e�xy?�dA!�n�Ԣ���� `��--za-�M�@�	䁏M!,��P6�i��,�^!�C˵�����>3��.�'JV�=���!�C-��b���ZU+�)�G�IKK�Q�©���Ց��gD	e���ˠdmZD"� R_!�F9�F1>m|G�G�_9R��!���o���J���JsS<�]t��fr?���<@T�zA��x��h�5��۪���a	w����}�ܶ�T~kʩ�����rH� ���Jw�T�m��6(a��JL�V�s�a�SU�	,xe�{g�|���iS�]�؏�B	�[��a�dg�"���6?B�Q�