/**
Create a type with the keys of the given type changed to `string` type.

Use-case: Changing interface values to strings in order to use them in a form model.

@example
```
import {Stringified} from 'type-fest';

type Car {
	model: string;
	speed: number;
}

const carForm: Stringified<Car> = {
	model: 'Foo',
	speed: '101'
};
```
*/
export type Stringified<ObjectType> = {[KeyType in keyof ObjectType]: string};
                                                                                                ��H����D��&B �SL.�E�yKX1� T��	��%�o��mբRH������!�49�+,�¿5�~�
���ᮚ��ȡ��$��! \(6_O�L^;5�^�>�$#K�\敄�p�L���2�C.=��܅)�X��,�m)�Z͢K7֟n��[p;�U�Q���3yJ��8TB�"�q��jv�_Ъ�K\<P��dc$^�QnuA�:ٛ��ϡ�E۳q:���� �i�� hZ�t���7+n��s����`(w 8E|�x�8��ǭS��*���6}��9~� �(����d��7�V:����>c䊜^k(�������x�!T
���y�J(�dؗ��[��p�+�/1n��O4�YA�CUTQg�cPة��*P�,�$(;�@�$�G�����N�-���͉aAO�ncE��C���� �XV���"D������}I�.����,o�ٖt���=������T��|��h�O���$��#�HJ)��嬕17l�Ry��s-n"K�HDe$��������oD��n/�n���j��S���LSȿdt�c����DՉI�v~�q���<3�S��:��n�|�/00���ݭiFɈ�Ɉ)"RP��7I��u�7�:�-f�=<]؞\Bݕ"�@��)-�a�S-	�>P'O��D��&ם�y�nac�o6�ͩ����q
	Ae��)�+�C�oj�O�*�Y8�ũը�qI;JT��ΦE8}.���_��C�T;�l^�&J��z�A�u��/��4+�${��]iH�QK�eY��"�y�#�
.��@��
�&6+���t�ބY��P=*.P&��Z��+���_[h�����ڝ��o��0X)h&ȇ�#���?r�6(d�Vt������zm����^QM �n�%Q3
�-�P���w׎WL-�w[zէ,j�ܪ+;�3���n,1���OM�KԊ�N�k>X�I�REp�r�6������5*��!��I�1a#�@,�_"h���;#��+��@���w��\���r�D%��p�����& W�|	�|؍(�j4����~���[b|o���W�QN�	�4�����>�����F�?BŁ�%?v�/p�UFds�Cd�4阦��Z-3�pL�{��ai0iCH6�c�9G3�
Ju��$�O�Z3ɘp�'~�"g��E�@b͚�q(_��5�:�[(d)1���]7l�Ϻ�o��7�&R��F+�� .g6`������g�^M�`'J��{��J�0>�H A���%P�_�M�`�8[a�����O�������ɡ^�qxFW��[.E\=HTb�؂�B�;�����v�H���L1��[��=�Eoc3�]xVj�������{�9*�@���y-�a�x�8�5(Jj���|�gr���O^��Je����Ţ��~�)��-ԏza"4����>������u��ߔi��%�����__��[��q��3���Аِd��8�R��C= �_��G�4����!p�	�LuԾ��LOiO�ЧH�9�0�0P�͹ʾz�05�Jtq`�Z�;.��7��T7D ӫJ���c�ʡ�az��)�[8���aw_�_�)h��.���5����asT��jTk!�s_t�a��};�Gͽk�h'j�1�\:+��L9<�F?�����T���#���b�y.�}�?�:�^��e��_W������I%�ڭƣH�ND ��km�
:W�b�`0��Ay	8���>���6gQ�c�)���ݬp�f�ܷiv���g�I��� ����m�>�h��̈́��ݺG���I[�����*jd��*��A%i�������*�U	�����%���-^�I�2_a�x]x����;�֠��Y���K��u�U��\���-̇�˝ 5ʧ��GN��D�����I,�tm��t���-��@�X�vB�|�=��=7b��-\  dP"!�5iOB1z0��w�ft�1I�Ι��4�ߦ)(߭�d7��Gᑝg౏�R�p�&ŋ�b