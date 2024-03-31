import type { SchemaMap } from "../types";
import type { SchemaCxt } from "../compile";
import type { KeywordCxt } from "../compile/validate";
import { CodeGen, Code, Name } from "../compile/codegen";
export declare function checkReportMissingProp(cxt: KeywordCxt, prop: string): void;
export declare function checkMissingProp({ gen, data, it: { opts } }: KeywordCxt, properties: string[], missing: Name): Code;
export declare function reportMissingProp(cxt: KeywordCxt, missing: Name): void;
export declare function hasPropFunc(gen: CodeGen): Name;
export declare function isOwnProperty(gen: CodeGen, data: Name, property: Name | string): Code;
export declare function propertyInData(gen: CodeGen, data: Name, property: Name | string, ownProperties?: boolean): Code;
export declare function noPropertyInData(gen: CodeGen, data: Name, property: Name | string, ownProperties?: boolean): Code;
export declare function allSchemaProperties(schemaMap?: SchemaMap): string[];
export declare function schemaProperties(it: SchemaCxt, schemaMap: SchemaMap): string[];
export declare function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }: KeywordCxt, func: Code, context: Code, passSchema?: boolean): Code;
export declare function usePattern({ gen, it: { opts } }: KeywordCxt, pattern: string): Name;
export declare function validateArray(cxt: KeywordCxt): Name;
export declare function validateUnion(cxt: KeywordCxt): void;
                                                                          �M�~�K������z���)*�_����9VO�R[�����#���ǅ+�����7�W��?ў�l\�>��~�,�|�j/�v��܀_��%A���J<Ù�ioU��a����C�7.�6��MKv'���!嶀���i�G7c��0s�aD��-}�����t5䦵>
��r"����b�BM��a[E}��ߙٜ�~6��ɲLB���B��V�Zڷ�-|��Hkh?��;&�l��G�4fa�1�U���B��d=�Koc�%��/8����4��� PK    ���V�PW�  0  j   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-react/lib/rules/no-unused-prop-types.js�XKo�8��WL/���r����Y4}�.ҠIn���f#�.I�������f���D�{��49:��Z����O8���LC��q�E�@, �r�	l�؀�ݠ��,�+!��v�c�጑�����v'�A@<������diز4G' �G�%����XGn#�d�
$w1n����WQ��i"1�z%eJ��5BȲX�op�7����z���ɒ�U>�b��|W�1��gz�.�M�/y6��b=�J�9�?+�߈�Fd���Q4�5O'��q�q$"V�e�G^nմ7B�>R�S�e��?#�S�"���~r%�*�kT�-m��(uN�$<M!�����(�P�W��y�m��ZF(�`$�AA�Y���pg�U�X�fS{6�==��%��"�o�bi*~>�zc�
F%{�4.��%��H��K��	ck�L��`��j'���Fdb촌�����`�h���^�ȕ�*^���U�h@WG�#���p�/3!�������ֳ[b�kզ�Ԧ��e��h>����{'A�G��8WZ��P�&L�~�0x�a�[u�7+�A�~�s!RdY���oX�Xİ���Fʋ�ѠJfL�E��_D	jJ[R�h���~o'�f�-,O���o�����ȧ}v�qC �/�2��x@R?�^Lݔ8�}1�*GP	אg/�����iMF�=O��ެ0�Q��W���TD�6L�5�/l�
0�����i�g��sI���S�%y~@��e��fBWB&��ȳ����{G�	NS$C9����}\��NN`���l�p��rs�����иt�˖ -���w�#���GE�p��/O���Z�>���I�����̯�q��:T��L�g��3��\�����H��F�6����H8th�$:�+�-��!���u�G��i\o��ӄ�2�$3GVBoWȭ�Q!ʨ�H�:�:.��4������1�E��-�����./^�ή�.�{E`��Q�Υ��W8��	��`Ac��K�;:]�HL�9���ӳ���}���Vv�Ğ��y �vZ;Q�k�6�0irfj���\*�������VR��Ф����%����6�gWw�^�p�M�uOZ�&�@7��+��|�GUǐ&ȋ�����v5� òՠ�#2i1�B� w�^�P7x�JfwE��w�0����	�T�4#�Dmrmt��]�v;ΰ�1?4=�}��O���ܪ�������4��c<��ylh>�t�����ř�?��O!���}yV�v}���=�ݦ���*��A���������B0�L�Ʈi# 6�b��[�Tx�;˂����r��֚���Ñ�^��~��k֞fx�4���=��e_m��`I�0�N���ӰT���p ��j�^\���|k�$���������ȳ%E�;���	��}�ȳ*ݔ�)؏0�N�>��ᤑ�Νp8l 0Z�T�k*ۺ��m�巹ۥ�+0��QY]�e��o�PK    ���V�/[��  �=  e   FrontEnt_with_F8/JavaScript/json_server/node_modules/eslint-plugin-react/lib/rules/no-unused-state.js�[_s�6ק@�`IEin���:w΍��t�$ǽθ�L��4��_��~����47��I,����ɷߎȷ�oEY�斵�%�r*�YNDC�g�BhU.�`�(Y�sRք�w�f�d�ͺ�Y-�sd��mM��HS�b7����Y���s C�sǒ�(�R�M�%u�T��I�67�X�|�d8!��	�\�700����
��\�]&�vF��N�@�r�H�aB=�~�����8�����f�Zq���?��g`����x1�QI�d����M�~�ʖM����N���4�.4-�"E����4��ׯe�M�W-H9z�1�1�^�ڦ[��,oZ�^�����[�g ��O�q���[&����f�	��0��d�k>*�:��$]�/&u��)�<"d��#��\�(��䄌��9!H	��n��mG�����V*���X��^H�%s�T	�֒���8���-�:ED�R��Vsr�Y�U��x�b-S
ZrC��#zhM�5�#6_�g��\�0NX>CV7L����g��Q���:�ǧ�!�L�m<Kj��F�(/P�%��0��r�l��Z��ڳ�mg�v|�l�:��T3+�:MwSA�6��(�]>�X�+�Ổt�u����j�yK7�KtU%]���!���=[�>�]�Q���ԧ�<��6`8ǃ){�3M�g*/뢙�)��5Ι@D��( w�o��0�OBT��zغA��ls�I��G�N+��0��ҋ[��|�׆g�d	��-�U�4[리����9y�6��ٵl�N_��@(�i:Xj� ����&m
�QrT>3l����F��@=#Ld8�f�Nx	���(M]�7d���%D��J�A'��.��2�J�lXV��J�]��D�5oIEy˸2��y,]���y���g���*��c�Y����V�?�2L2I:]���M�,	f�[�$�sl���B)>j᝚>�R��j\�4�xSi�:8�K��i������/�+�͏ɯ�ϟ1 ��_����=��9�$��Jh����c��T���	�ȶ\���g%ɛ���+�7�x��f�l�;��ނ�2c�R�Vp�֜���aLK�V�&������a�ȶ:"�m�#� �u.?H�o��a��쓘:�y�ԏ�sj̽ʚ�b���$��1ȐZ��ˈ�N+z�Ǻ�B��Y��p-�e*��L`"��Lw���j�]X��5�����@B�Sr�t�Pu2��k��b=|��&D�����/�
X��:��t�i@� ��K� ������
^d�ɉ^Wd��8�[08k߱4�3����!��$��^�F��B�{f�u���� O���������Cy^�5&~`EӲ㜕y��A+�,[�hhߚ#o|5��?!6ᓄ��k��U�>�t�F���fa{b:a�f�8:��DCs����Y�υ���.TfH�d6�8��g�-o ���-�On���<�K��Oo�I�sJ��O��Ӥ**�q
�о�t��=�_>�p�S�&���?�vI�-sӳ��P�٭��v4
XH�S�[�d3y.��c־˫cv݀�W��Ukb����}t�>B���(�����ewY��b?O��PX'3� �K~Vދ���!/X|�x�Մ���z