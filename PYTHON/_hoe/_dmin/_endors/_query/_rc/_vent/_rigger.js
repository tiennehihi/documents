import {Except} from './except';

/**
Create a type that makes the given keys required. The remaining keys are kept as is. The sister of the `SetOptional` type.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are required.

@example
```
import {SetRequired} from 'type-fest';

type Foo = {
	a?: number;
	b: string;
	c?: boolean;
}

type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
// type SomeRequired = {
// 	a?: number;
// 	b: string; // Was already required and still is.
// 	c: boolean; // Is now required.
// }
```
*/
export type SetRequired<BaseType, Keys extends keyof BaseType = keyof BaseType> =
	// Pick just the keys that are not required from the base type.
	Except<BaseType, Keys> &
	// Pick the keys that should be required from the base type and make them required.
	Required<Pick<BaseType, Keys>> extends
	// If `InferredType` extends the previous, then for each key, use the inferred type key.
	infer InferredType
		? {[KeyType in keyof InferredType]: InferredType[KeyType]}
		: never;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   #�R b�9K�B2����x���	��1����=�a�"߀�}w���:B�d菏���K=�'*c~����^��C����?�&>l�CTS�w�r���f�d�9,	�7ӳ�W���j�s����*�R�e��@~�_1��l�����q L���#k�����#�R�%�y�02�
�iMR��s���2��J�#��[�¹y!7rG=�		�]]�FԼ��7��@0 �hIy�:�ۙ�NB�_�ȟ�M&iJ\Wڻ�[��#n'�&������ߴ�ީl�eb�:¥R�@fXQyͲe�8�f4��
ɬ�PPR;�x���N�Iqn�C�Z��}L6�Z�lJ�/���ցOI!;)/�TO��#I���7	� ��pG�>�sQi&��D���O�V��P֠�����+�Y�7����C�e�"��$_o/ms\xD��ʻ`B���B�v����ѯlBP�c,�j����},�H��y��Z7��C�S3�/�<�c�o.�����Kv?І�B[ �s)%Q���HS��F�iq�r ��N���HN<� ��BA�8T�C�W4��YZol��W�� CN�P:�h�<Xl3�a.<�!��^3�\������|m�NP3T��|2S2��͓f2���Vܹ�Zg����U����Z�ެ�G�U�;M��m^R�o�RRR��=�d=�0�2������\\l0��Y�c�߀�g*y�� Fc�)�`NSթs7-D����)�;��T�4�]�?�!l
Bt�ϸ�l�ZYp5B�"����]F
�Zf�w���a��ٴ�u�0y�۹ �vn&�3�s��Y f�G>����	�㯨x�R�1�4 |}�.�O��;��i0Qn2VF��o�^2�X���X׌�F��,Ȯ���M��[u���N��"�<�@�bݖڇ�aeRx}�kC��4h�5��&k��N�ό���j+N�qv�bE����hdt�å�@�i� �l4�^��".�[q��Լ�8��%ĸL��8�.�uf&=M��7 � rk<>�&c
y?�U7]�l�o=c�w+�� ��a8��]�����Z��MAeHn<h48S�i�k_:%�)��?�.�!���G��������#������G�7�w|� u�#]ks���Yy��{�Ok�[�x��F� �ᒮ��~�]A��Uh��0Cv�s&���/��e�vr�Iy�ŷ
�<UX�gṟ��U4�.	�q�a�f��2�6����Z��
�c(��Y�Fr+rd��[R�M��q2������<��E��y�&�uIR6 ����D��W�	�D��u�ŵh�&=������j���/�8,]��� �H�$��kd�߿T��IV(�,ӏ��v��kh�N��7��B�Cmd]��V!z�Ź������},��?��G�4Q�7+U�TX���}}�. �Ġ�#J+�İ���>�ؓ��g8١�p
?ݍ۵�
I�����
n�(
`�Q���r!�*�ԉy�2!�_�o��r=E	j�mn��J�i�TR%8	
N�*ƥ-}�Un�g��*{�j}���px�{�t�}���*�`��\�����O�$�LK�u/��O-���߾�ʨ�2	�����r)��������bF�ͼ$������~�KO��6L�b�tW`���<�t��N������qGz�F��U5���2��HF���� ��e�)(�!Ev_�P�4jx���KQQB�"8���4��!2j�-5D 9�fi�{Z��ʅo,����tc|
�.w+�����!E�C��&����!�1n�����ʄ�}ō0D|�!�Y���~'��`� f����R�����Pp�*�v����4L8�;/�m7O���^��o��'�mا_[f����qɠ��{��Z��7=[ �(:���:,����̕��Ԛ���~��$�;fm��Y������Y�HN�Ѡ+��|����O���n��d/$�/D���1���4����s���?�J��0�`*d�f˹����Ț�đz������A�XM�h�3�".����)�V7�	S�QZ��\K�$�$|�{]�B/Xi��G�}���Ͳ�����}(�aot��b���>��˵i2T�V]A
�T/�*�?4:����Am'*r&\��� (����)T*0��!�\]SA��bۇ J]E=}1��-Q9��t���1�F�(�n��k3�J�_oH���ΐ"�7�)�HR��c��&mؘ��P��?���"���F&�~R��4�������"7��	�T���܆�h�Mt�:���Q~޼��8dCoZ(Y����b�W�~�ab  %T�j�]��NfP�u/A��¢�5�R�4�'����|�E��M��O�W*}���ZF�'�ƥȂ(���T#~)R����qu!�gl�������ǒt�"��%��r�;��R����gP%i�2S\LB/��=Y(����VO�@��Ohݙ#����?���XM�j<�Oj�t��z޳  *�c��!q"1�Nv��gIz�Z5�S�I\�y,�A�1�����䣦Q�ᴺ�I8�#�E�v�X�S��
��wX%��5T�ԝ����iu�Y��Os��k4�@$�
v�� ��j#�_��-;+]j͡���\�E���rи, 5�C
!������e�U2TN�f#�Y��#~؝��e���J��y*���x!u����,3���2�?�G+` �q���eG�*��JR&q d�]�������Di�e�����9X>O~ u�p+���c���o�kN(�����9$ӈ˵5H����`k8��t�y����fKgsX+�=�Wz��0� ��QL>�cU �,5K.�Sa�bS-�~ku�#�=S2�b��I��Qy��ȡ��{C3G�@1��"��!�@�3&��&��H?��˙�(#�y[R�$��'��$��@"��6�n	��ح�U 2���?�Y�7c��`�y�����z�R��B���ϙ5)5U_E������o���0�e���p 䥪`�:��2A�b�P��DD+s=Q�8Ȇ�!�P �U=p�uo�L6B0\�n�+_08�Ϋ�aKǎ���(I�:Gl*��v�s��'���6�,|����U�t6��;�i�%B
<`P&��)��ׄ��?2�hS�O����4c��/���ס���b	�r&�_�<ܗ�x�T���W-���%�	x�gYFP�[��(k�{�>���駴d�9 
�⏏ŀ g��'�#�w'�%H��'�P#���ڑO�ľ2d���� x<�v���a�{ �^�(��0~/�5C)�da2�
�����:�2�.���K�2qO�~f� m�ۿDr��4I8A��Y��##^+�F�����C��r�G�