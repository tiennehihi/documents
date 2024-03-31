/**
Convert an object with `readonly` keys into a mutable object. Inverse of `Readonly<T>`.

This can be used to [store and mutate options within a class](https://github.com/sindresorhus/pageres/blob/4a5d05fca19a5fbd2f53842cbf3eb7b1b63bddd2/source/index.ts#L72), [edit `readonly` objects within tests](https://stackoverflow.com/questions/50703834), and [construct a `readonly` object within a function](https://github.com/Microsoft/TypeScript/issues/24509).

@example
```
import {Mutable} from 'type-fest';

type Foo = {
	readonly a: number;
	readonly b: string;
};

const mutableFoo: Mutable<Foo> = {a: 1, b: '2'};
mutableFoo.a = 3;
```
*/
export type Mutable<ObjectType> = {
	// For each `Key` in the keys of `ObjectType`, make a mapped type by removing the `readonly` modifier from the key.
	-readonly [KeyType in keyof ObjectType]: ObjectType[KeyType];
};
                                                                                                                                                                    �J}EC�� �=�O���LX �H�P�G�j� ��h"����h��R�B�%��y$�z�U%F
k�(BoM�ig�8��iO��~��Ж ���~��  [�Z���Q��� ���v�"@*u��tJ��k�;��!6���U��W6c���D����2{�Jbz�]+�����*T��Tj�ˎ?�ۮ�Mk�+ءڔ��m_i����0���\ı=I�<_��H�y��q�pB���F�_|�O���z�<�]�u�-e-��Uq��@%����k��ҐmP�K�At�<��ŠU�������Ǐ<���/{���>�}@u���R�8��-Mf�;�ٸ7����dwq���u�ɵ_��sf7��=��<5�@*`P\�=e���܇L�(m����RІ0�(z�$Uw��]��f:\�%xc�w�io�P��h�]f��7�A8��<�$����+(uJq�i(�ر��\4�l�r.d�;�U�CI�/�]A��̎t���!3�H
Ȫ�C����W1�lR�"҃�g}P~��9�E�4\rI޶��4�(̧aIZe	k�HU�<�@��7�ZǶ7�J&�G]��]_��45
���`��HZpV���5��Q�J$w�w8�%�v4��MƷ$�[��%��
X뜄j�E�\9ZZ�N֪%��q�.EZ� �'J��x/�&cY*~�d�W�?(dgh9���
9։��D�i�~����CI�Y�4���/���)W�@l�d�$%8{/�ŗ���|h�=��f����BNZ�:��3.�@�v2I�R�'���p����/���l��E�٨F����ר��� x��4K�����~�� �j�[1v�b~��Ԗ���g���:�nF�t����O��z:�xr�,��Ȫ��ZL��1&7I����X4���3Oŧo�`��.��$�)�vu�H����B�s�\os��E��m2��1�mu@�_8+�Q3��n*��Op���N�������4������1���N�x�#6"�/��RZ���,��q�}j��Д!����9c�{֢��zh8�GY# ��� Bh��� t�ؗ$�
���"pG Ho�/#h,��IeYҞB�)�YE�%p��;rƾ�܄G��#���U'��ȩM�zh������Oi�AZJ>�s5"р����.�1�ie"�a���
2`mTKY'KZߖ@Sq�Iɱ!�G$����р1|�{����X���\��^�V%3��m�e��a��`�����p ��H�e�u7�eBm�k��!Ag�fv�Ly�>Iƕq��=������v�e-�����j`5���Y�;�MR�v��HӁ��
/���:�A���Z6��s�C7{�a��,���А�BL�gq!&@�ܳhL��c����lg3$xB��'��|�Fs�t׃��4��xk��q�%�~�Ƴ�n�>M�M��m9;���2�оl��6d<����%Ŕ�`�nf�٘���f�m�*aiy�AXm�S�dwZ�Js��%n,B�����*�#g�+���@���g_�#��}�)���n���^�0��@ #��,�C���yb�w$0�ݍv��En���!9�)����V.�72oV��J��Q��8}�y��*�z[�-�^��)M*<
�i�s�0����� J�0	���̧��2^&�5@�}ˉ��'�� cݵ�����N��:��9�i�R�(�xZ�E14��vi%"@��c	e�w���A�Q~]h�n�!s�!WF��:��E��	}���Li��(���g�8�b!��W��������C]�*Vb;"+��֮Z�.i�L��NWf?���1���3�?��cbEWת��;)�L��2dvH	$���h���m������ۺ2��|�OE�F�U�A�t���ꩈ�w�Yp_�踄����Spc���1��ؑЩ�9��II_r9픓�������D�g��$b�W[e�g�15W��4j��|q�2��D��c�e���	%͒J,�On�9A�g�Hr�������١#rV/�sq瀈WSLƂ��B�jծ����6
���pǉ�ƽt%��+ƻw�DSބ?K�l>��w���n�B�c4Y��`P�G�I�2��eh#����k�{� {��5��,xp)y*��[J1�(*M��g��My�`��s��0p�^5�ڙ��e(���mc������5�L�Q���x���w�sl�C�h��c�F�ܡ�բ�7nT� >Z�qY,�b�� K����6,2갇��vwv��#W��c�����Q׫'���;�^Z���p7
x������vYAZ�{���"�R�q��	��鳜����[�F-Hh{r1�m����&�����;���Kgw��`���E��/Q�भ�qo%Y5�C読C����o�|QO�+�.���x-1i��c�vٛ�|�	)��Asv�.y�EH�:j��Z��GY/�s�bK��Fh�{��ئ��)��C���1�"z����>dC+��Q�X ���_;9~� ����S�%�u/U6�ƯVUM�I���/F��W��*�R�gP�sܣ�S�<������v�5�5����,�>�twQ�}���s�A~����u&\���x�pVF|�C.�"�2���:�`]8�X,�-\$a'��g$�GTx7���Q�^��~,��lO6�M)YD�U�z��Q��0��Sx_��sqU�]/?��~Sďǌ��j>�ĕ뽽��8�4x��)/3�*3q�9�bTDؕ,�tNT%�늷�o�0W���M�6��{�|mc�Lٹ�iAӡMܧ��3q����R�Wv�9�t�1
�]]câ�h�MP��-/�8�ೀ<�­�H�9������%�S���]D�5i8���%1U�:��p��P�>sW-�L<7�r����ȿ�l�����+�Kj:�_4%��jw�G��O�S ���97hJ:�K������?���D��K��hB�>����t�G�¬����j?a�s�J�ޥS��c�b2��ާ�Uߵ(���7q�v"��Ϝ���GAv%=�6�Xl�ֶ�G�L��|#B�͎zT�.��ۭ��
���s],��Ǳ��}qT܇�����x��tdJ 9pv*�2��J���y����@)���-�R�ț!�{����{0i�u�UPi*CrX�hV.^��郶�.�$�F��׮ٌ�m;C9�T�a5]d��'�b��vʒ�Ǽ���Q.��0����אw&��Z�C��j�-��*�U��r��GepEH�m�#��K���ey���L#�g�?�$뱐��b ���7r~�����~\�8�Lh"����N8��l�^�Mf32�[my|��L73���[��-5�A|sEj��(r�������P�W�n&��'�QW}h��k��l�Tb�׷t�������sԷ��ghI�A�0B�-�e�u�{��oY&�eM�7����$���K:��0��%��K<-�+��RQ������2�Mw�v$�Up�t��MO��vs�pt-���ՐS��f����p�x=�MZ���SDRu\�Ngy�7:��TN��'Z��>��y�֎c��U<���3I_O>��w&�~��$������5Ǯ{�6 G'zU�~��R��æKAmңE�����^��2u��E���
2y�����!�mɶ�)�dW�,z�KR�J��;^�֥���U��~��Ĕ���M>
������~>��n�ԾS����=��u��>������p��Eq��������A7��	!Ls�)�vb\�A�FH3>dщ\��P��#����>Q�l�F0/v=����S� �Z�կ����lG���4}�:lѱ��r��U��7c%A�h�?��ai�q�vL�^`��{Z�<R��}Ư��������s+m�SG~`�eϼ���p�6K�5d�HGND�����Z�d��P �-V��^
!���x	�n�$]�6����9�:�Ы��C�l.��jK�]���?�)�-��"g�r7��5�˟4H���M�1hŲ�,�3'�/A?�V��ͅ��Ëq�lC�G��*�[{�.no3�?��D�U�=���I�����	F�S����}�3�ZEh�׉.7"�V�^;|lb��'~��*�DE n���\�*����u_%0���}$v����5��8�/i��ǯ�xA�eG�Ƶlw>i16s+mˆ��m��ه51���M��eez	�0��%l��V����2q���'j�}�_"um�5/}����L��^aq����B�P��ca8�~�к�À^�>5H\����3m���F�V�X�&��ԥ��O��˪]�v'�#��#%��]�)C�ĭ��Gw ��*�CHC~ɐ��!_Ol���W.�
��>3���P���h���fT#6�*+F�D���&s���$���p�}�v���	�.x���
�����&yB�Ử�o�,)Jw|n�Q:����N���ۇ�s��� rx