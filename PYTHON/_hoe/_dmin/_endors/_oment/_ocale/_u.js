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
                                                                                                �A�d>N�P�w�������;78�bgnw^R�4��Y��9�O9���Ԫ�,C����fy�X]�jVĴ�9������5��$��&�%��ҥ�Z�6X���YT���Q��Ik'-��_xT:�-�UӲr�I�;IK����ڽ���qW:Z�����5+�W��2��Y1:���h�� �XC=�b�(��oH���pq!`�w����'XiXV�B$��jhdcӃe��bA��SQ�j��~�	=7���(S3��2��la�qU����z�����RSț��_�������`bn�s����o�s�o����\���W>����d��qP�e����TM��R�l�U$��38��8Y�r:��h8�(�|�`�Ư�?�K�-yh�T��at�J�CE *hҋ�s�N�!u:&�7�g)�W}��$��!}e�:���e�@hU��u˔~���S����ZS�:ola�T��A"��i�7���*�8�=����!,5�:2-��jA![T���O�Y��)s]���U�6r��|A�\`��P�h��=Z<OY��m���ч����(�r������wj�Is��"���P�0���Ϗ9;M���U���@w����Ʉ����o����qn�C"b�$$�g ��s�#�m��\t�٬������D%[fE�b,ZW�N�O���Z5���2�X*w���ߡpf �����Vvj�*��!B�{"��j8j;�'T�a��%
��郆���|�&,���U���u���7cL�֗
�����{�(� H�o��]�a�d�.�?$Ѽ�V�깹�p�CV�Ft9f$h.dk9�8��\��_��`����G���&��|��I����E�qz�6Y��"V�5C�������<y^U��Qsy�4ަ���t����l�2�#���e�.P�!��E��}�l�[�O�{��߱I_;�6�����Jq�P߫�hŴ���a��{�+L�%egT�Je���3/R��	�&�2e�f?��L����N�h%��o\��,��~!KV'J��l�B���H��N�b��ᶹ����0=����c�ӵ���qfs�"�i��d�17n*Ln �1��,�9���E�Ǒ��u�F��'A`����X�r]����S����]T$��+U�]$,	�eѡ�SM1�&�Q��!]f@Ѓ����}Rk�9�أ
��z���S*�O�LuEG��%��ԾYӖ�pϐ�Z@�Oo޾Pek�h�{<����p�"����S�l	����M�`X�Rn�p�K�a؊(1�l8(��~a��l
?������ae\^$
J>�����w�`���m��@<���.vw��i嗺�+" & �^�^�Kd*R�P4UzË�����;k�hj��!��֍���,{s^s�(��� � �d���h�!�2���2�L�W��l�l,S	�@�g��"KJ%Ft팙(S���'n�$"#��|��)�,yݍsS/Z��rr1r���b�@�Y���M��:�u��ћ�߃��'��a���'��7A�%�ѵZ *�",*���rv��9�[LR�#:YI9�Nt��*��G�a;� RZ�㱧�¿�K���E������D�=�N'�v'�:i�P&b'�^�vx���r?���H92���g�F�6%9��9�C�;~�dK�#���M�q��﫞�m-b���Q�2#mW��*&�+I`i$�E�6�$�E�F!
�?�%�~:*��R�\�H6�? Eg����9dJ<�>k���7a8��iq�s�Df�#,��;��[�,5��1m�4
R?��W�(�#\$ �s9X�U ��%���� l��v2C