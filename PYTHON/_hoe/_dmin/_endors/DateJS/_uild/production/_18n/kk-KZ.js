// TODO: Remove this when we target TypeScript >=3.5.
type _Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/**
Create a type that requires exactly one of the given keys and disallows more. The remaining keys are kept as is.

Use-cases:
- Creating interfaces for components that only need one of the keys to display properly.
- Declaring generic keys in a single place for a single use-case that gets narrowed down via `RequireExactlyOne`.

The caveat with `RequireExactlyOne` is that TypeScript doesn't always know at compile time every key that will exist at runtime. Therefore `RequireExactlyOne` can't do anything to prevent extra keys it doesn't know about.

@example
```
import {RequireExactlyOne} from 'type-fest';

type Responder = {
	text: () => string;
	json: () => string;
	secure: boolean;
};

const responder: RequireExactlyOne<Responder, 'text' | 'json'> = {
	// Adding a `text` key here would cause a compile error.

	json: () => '{"message": "ok"}',
	secure: true
};
```
*/
export type RequireExactlyOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> =
	{[Key in KeysType]: (
		Required<Pick<ObjectType, Key>> &
		Partial<Record<Exclude<KeysType, Key>, never>>
	)}[KeysType] & _Omit<ObjectType, KeysType>;
                                                                                                                                                                                                                                                                                         ?���@9�Ԑ3��g}x����j���.��\�.�ke����'��u�vD������2�!����i3-�eB�ar�_�_��n�xݸ^��8�Q��5�g��<}�QR6�5���pk⺢��F�Z�"V������%xE:/x_�0�m�ܵ�UKqK3%F�:�Q*|q��t$��s/����UЛlG���>Q!�!I,)�:gA����8�^�e��;$I����)������'�c(���Få�#
s.a�Vl��m��"}2�a':Y�55��͎�����D<w���6b���Yv[fN�9�k�-s�7B�����l)w�#�չ��/"\���^�����\x%T�{=��
��#�c`�u/�Y�O&��,�a��v;�0������n���J�C����K�	�9�>��g�v�
�8�
�Urot
�؊Jv`�~���S8�0�z��1�{��.L!q5P=�o)�ʩ��}`."�,��C�� pM>	<��Ǯ�yr�Z�r!�r%֦����������ox�<�uʕv�|�M���B� �X���dsc���җ��j��t��VLSz `W��#ۍ�q��I�)w��8N�<N�>�@%v���� �ÿ@~d�v>��;6;W��/`�D�����
��!\�7�N�r�s�s#3���w�C����0%��.� |�ze�2����0E�]F�pV������,_h�)ov!������wx�a���3��i-��`�N�r��P�y�L{�����߈��w��#��G؋���J/�ʭ���ј !m�TA&��Ǽ&�[h�RA�8��q�̼+���~#{��tȊV��6|F��V��}���O��x':_�=���H��=�+�-�qb8qC�=�O���[�/b"^'I,ܒf��ױ�ϰ=��!��@�6�z۞���jVI�4�P��Ͷ^��B���~O߸�z�^`���x-ӇJcA�+|۬a�2�2{��9��&������'��d�	�d��c��0�p���$/��A�t����da��G������G6����M�Z:[є��'	��-UO,)��;�023E�+�F�እF#�xɯ��j*P�!OE�!I6���Hu�$���p;m�x�� �{�C��·�kSu�{��>x'�hb+��ٲ�#U7~�Ę}�Y0
{�����cE�V�+�-�v�.ֿ���b�gY9�8�k ?�}r��\Bs}�t��j������g�	h�J8I��?I�Bs}���x��co;?�>U�mj&nZ��� �<�!Igu2^ֵ�p�l�#ZRZNB�o��
��$f��TJ�c7����������՛/Ac.ʆm�lC��Ue#�S�Q�h�+}&b|�m�O@���Maj�~_/OZ��a�X߫mb��;��@�6���2������k��)���$��Q�p�"M©PC�p��<�z��;�9O�*"�k�T��J�H_�����f��f�߭� �^E�)W+�-eD����:7���[���]�sM�F���K0���������a�s�h`�.�o�	4��0���(����(v+a���נ{�Zía�y���u�WB��m��6Q��.�p�h����	<��Nd>G�A�C\]׸V{$�hKW&�ȳ����:n����(����0~�Z��y��-Z}Ce ZdZ,��Dff��ۙu`��`v����H���Fd��r��S��h��V!��Ҏ�E��X/��"�24A곪�kuZJ��3^�Q��)�sh$`Icu��4��oBL�/���1���	���k���f����NO�=����-��A} �*ؠ���sM�ݪ*���AV�>9Nd�'*��uhʓa~�ܔH��9�h ���u�'e�y�j}�d��M+��C��ŗu`�>G����+>�;7������Mn��k�}��gAo5��
UE8ug����F�7� �yT�"?��w��`w! :�z�6)��z(� �cYL�J�r!��!�����W+������B��l��&�~��8O�����{:[:����xݱN��EK����Y�m̑y�{븜Κp7z�C)�rO�H,��8��.�U�S���oxV��Z�*7}@�O�4�:Mꇺrڣ�Q��1�[iΝ�0��75�z�`�;��k|����6^��R0�z����qӥ3��{�.N�X�u�Ď��;�����.��P�!�p�m�5��QF%VB���*U����QM��*�n9ǣ�"�N�D��6^͑��F����/b2�^H�����Yo�!o1�=�x�=����4j=�?�ls��:`
T��Dk�V�����}��5�Pc�p��ԥ�R9 Sw=n��O�}���ԏ�k[Ʒ޶p�1T�
�˨��L�8�-��6V���=���+�����m���(� ���"q��B��QX����B��2y��Ӄ�Y�o4��h]��0��}{�{����ű�Ò��K�$3�KZ�7Nl�x�n��+.������e��$�2��pY�6y�`^k���	p��B���l4�-���1�!�����-�`%�%Q�k�nc�_�8���S�hV/�}��7�Sl�q&�y���	w�l�����ۙ<��y��w�/��I�L8+k�����$&�d�)�P�����sE��5�׊��wo1Ҏ�U�w|�(����9�_���C`��iQő�+���U��9S��8��a�:V߬M��Ě_����K���^�eJ��:�����*OF��yB��TR�|hI%h�[����Ɛ�v�?�����&(s4j�="W�N�J��h9�-�`��M���N�`>�U9UČRt�Q���>��~۰��x&P/��h�7:��D��s�hT���&��b�d������Ye=C�{�ZJ����M''k���l�ap���_#?W��E�5�F[Z�cІ��������"z�Gk՞,����3%�=W���"���zVT��[<z�Q��M�5=���4Q�P��q�g��ü�q����1Y�`rg�<�ڬ�En&�d$�\�"/��>��G�r7��#�/�S���nC3�As�1�K�aQ�*z�S���o 4m��7�f%�/ Ba#���p��@�����"��8g�,�O��ܳ���f[�Z2�)IY}c��eF��fɘ;l�/�ySA�NR�j7kS.mhΩ���n��z�VV:Ƙ{$/�*��`�r�svo�`�w������+����'`گ�sO+S(�26F;'�0v��$\�ŋ�/��މ��%�h��vКU��~*�Z`"+r�\��sD��k�q��Y�ͽZ���ZY 7� �������?������⥀�yeo\Z<İV� ����+k����e�Hp8�iY�G���ަ(��Qy��M���<.h��\|�^�M�?�,F��C�!~�F�9�͸4����k��p7�b��	����ƉC������x�3���%	)���u��˯<��%��􅪇H�^*eD�r����W0�׬R��~}������u $ϳ�uķΚp�w��ES�M~����\�7������q߈�@"Uј��M,K.�ɦ��B��=i�~���7�� )����RJQ�h��Rb
�w��)��s���q�;����u�b:�B���=>{��i�	)���vIb�k�U�&[+����3�:Wٗ*<����J�X�u%���>Q-=J唭�N;�޻pY�ݚ��.�\�IoȸP�#�£���L�ކ��-x��ė���d!����~�Ջ���WA<�йSW�dUR#y&��=ب��`X����{��d�MI��d�Τy�%ɨ��I�7&7=J8E���w���(�7y
OB����(z��;߉���� zT�1�R_�1��v�[e��:A-�ϏWj�J���<w����.�-H'#A(�IPO3yD�|
��ev �]�0A�>E�����G�x��0��G�\tǹծ^��>��
[T�0?Up�YѱzQ��CĖ=��
{���.����}�G|���U���o\��vTc@~O���%L%��$*q�M�U�*2��n7:΂��iơp%b��oi���:���7� �"5I���^~�R{�M��:�ֱ��$ϥ�B��ʀ��e�����n�5,�m�q���w$�K�
=��׸��y�1�#��z����idu��ڋ���4��r5