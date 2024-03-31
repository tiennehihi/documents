import {Except} from './except';

/**
Create a type that makes the given keys optional. The remaining keys are kept as is. The sister of the `SetRequired` type.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are optional.

@example
```
import {SetOptional} from 'type-fest';

type Foo = {
	a: number;
	b?: string;
	c: boolean;
}

type SomeOptional = SetOptional<Foo, 'b' | 'c'>;
// type SomeOptional = {
// 	a: number;
// 	b?: string; // Was already optional and still is.
// 	c?: boolean; // Is now optional.
// }
```
*/
export type SetOptional<BaseType, Keys extends keyof BaseType = keyof BaseType> =
	// Pick just the keys that are not optional from the base type.
	Except<BaseType, Keys> &
	// Pick the keys that should be optional from the base type and make them optional.
	Partial<Pick<BaseType, Keys>> extends
	// If `InferredType` extends the previous, then for each key, use the inferred type key.
	infer InferredType
		? {[KeyType in keyof InferredType]: InferredType[KeyType]}
		: never;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ��>fc�a�l����k{������F�U�{��%��Q��Y���?Fx|K勌��F_�Iw�Θ��w�8z����	�u�v���>�Q��O��1[��UQ�^�~�/PK    n�VXܑeb%  �  6   react-app/node_modules/caniuse-lite/data/regions/KM.js�Wˮ$5��V������iĂ�sx~ f�CB���NRU.]]�bj�+���cW���?~�^����������Oi�{N9S��K�a�2��A3j�+���bϹT���ŭ�"���RvK[m��E�w��x�0��@�f@$@�X�v��@�@T�*PR����\2� �
܀��d!�( ��(H��� �b�(�B�P3T�JP�@�4+�U�eh��14�V��4[�A	�A��VP���v�:B'�]��z�n 8A6�!��ld!
�`ȶg�d{���s�(Gʡ2��0B�����q��jM����%�5^8��ĕs�ε��%�8ö:�XzŌ\�T�w��8�!a[����m�����3Q1��А�N���9x���4R��Ņy��.����8s�g��S�"nP͚q�c��ԍ '/�R���'Ib�Wݫ�� ��gF��w)/t,h���k��m�����N˅-��e�^R)��e��%���wqOeGY?4m��Aӻ���Tp���C�7�VW� �&/��'���8,��D�L�!���ɭܔv:ͅ�2��6YP�)#E;�)(����?��?w���倿���Ik���n�r4Э{�Tn=y�L�f����C7�Mt�Z)?�R"�'�r��5��X$r�ب46���j4��h-
5�ʱ'�r_���W�L���xkzpe��ܨ샻�dq!��Ƨjt|�,����_����'���-�V8NF!��%����G����vה�A�8����Z�ͫ�u�	D�Cf��~�]Nq���WK��6���_��UM']�����I�����q��ez��	l�����t����W̷���s�`4V"�-h.b�ф7MNu���=}�AU��R�3f�)���׶`ھ?��ib���<&�����m�B^XJe��Q�ǧ� /�45�F�2L�k���ㇲ2(e|����wS�TG�SkF�V��F��>1�Pi�	���R���\pz���kU9�����9b9�b���u��:W>Y&�,V���<>ʜ���q�Qv�6,���+!�(�����P��eoT����������h�(Ff�踾6�Ya�mװ;:ҭ�7�4ђ9�|ej8_����l��9����I��O,�W:��,8�h�������ֶ���&���R"-uRZ{�]'������}�����k\���61�9 Gg<Fٜb����6�v�t|\����|�q���a����ib���5�_�v ����}��7�"�B���ׯ�ьZ�w��PK    n�VX�,8�  �  6   react-app/node_modules/caniuse-lite/data/regions/KN.js�W��$7�����"E�����>?��7�������ݤT�zg�N8��~�(=�G�y�ӟ?�\_�����������qE���	rGT( Q��F�H�Ֆ�n�͚'j��bNc�ӴJ��$��/?>>0P0��Ѐ��H�
�Pr�����\�؀+�7!�XR@
��Hq����bP*��@�@T@cC
j��A��	X��Xs��T�*PT�ǩPjGpgp/�
n�q��4�&�
4�fЂ��!��`�"0����20�t����*�J��� 7���5X�a[>��]�e�${j�Ȕ�R�)�S���)Zf0kD�D�Z �i��0�	�9h���9Ns�j��S���N�v�o��B�^���k��t�8SZ��i��')�������Y�IG:�.2;9}��x�k&%�?6e%��u�]���^T��H���M/3�������J^��f�����坪P�<�����b���_�|:yؘ�Φ-�W��Tӟ�g�сe8��%	7}nj:�8�LG�Yδ*SM`�N��v���Aa3��K��������+[[��֬j+��#{�,t�F	)!EK��W�ږ���^��$��$��_w��͆�;g�ޡ�4��熤7��@s�;�����ȳo�c�ӐgW����4���إ��ͮ|ɳL��7Ϝ�S�y�D�ؖ���2�����*�ȥ�!��_G�{r)���X�Cw9(+���k�|�R@�Ňܷ�E]�	��:�9��}��w���:�[�u���y�#�xpĩU�`�ʴ�8M
��uđx>y���j�0�XG�%�m�4�r������#V�;��y|�I5�.��%�x��c���nnuo!�h�n��iV�1m�iL�㔑���<�!܇X����!t��6�$�_P�
��)2����6r'U[�F���(�����0u8v@.CL%g����&�1� �ަ��MȨ�u���ԛ;�����ѥ���\z#�u�b9�3�E�/ՉK�Ku�Rۥ:	�R��Q�TGR��D�����z#-��4f�!=_U�˥=��
ux�x[����@R�㙏��L�Ʊ�x0J� X�^E�v9��?��R�ov��=��c_Yg<*I�o�"!ȼA&填�.e�ERChT&����8�]��öC+l��y���4E&�kCv����|�1���>r�i�Gs��^�f��cii���<f��Ue��27�-�_���@O�9��-?<>台�Co��}���gF���� ���(�_�aAږ�Ƹ��7Gg�(���o�W�[�q-�m{���PK    n�VX��d�  ?
  6   react-app/node_modules/caniuse-lite/data/regions/KP.js͖Ɏ$E��<ů<g����8��������HH�zw숬�j�`�����t,����~��?�*����������Ç燍��3U}��	GC� ��Vp����B�D!b�4H�(A[*�B���ЁJ��*�qbE5TGm�u��0�),.d0�5X�8�.p�Wx�������M���Z�NC�h��]�������v�A�!�Q1�1F�H���
"H(�P@��B��"nb����]�KxI/�?�d1����`T|��en�s��WG��H�ݺ��m;sa���鹫�}eX�JӚ~[��������O�]J�5��>���O��y\�>3�7a�����(v%:�ɨ��r���t9])P?�z��R[q�S��(�7ĳ�z���)
��ު��Z"������7>�H���Ɩ�S�Q��,�y�4�F�h��&)eH+��V�w��G���ӊ����i䢇�o:���Fk.�c��f<�i�*��V�n&�u�cF�e����q(�Z��z�w�FČ"w1c��]��b��%L+BB4�3�WD�g�,�s� V⌓���:���s�s���R�l��q��Ex1)"<�t�B�n�m�4��%�q]7���眳�K̥[��ir�d���o���/��L�;�t���n�u��z���c;㼢g���h<]�F���te>��<��]\��k����GQ�n����ԥ�Uj�*�Uj�
bv�Z
:K��_��f�']t�+[�Hm��PR{��y����, ��, �:��NZ��&�%���a�%�%�i吹җr<���s\�Cd�,��y�9�֭	<����ޟ/��Yd2/�����3��9�m)�o�3���r��}}�Xk����ώ�]���(�n~����_PK    n�VX�x   |  6   react-app/node_modules/caniuse-lite/data/regions/KR.js�Wɮ,5��V����N��"���lx;�C�U�;vR��\�,��N�Jb��8������Uz��O�������}z�U�=�3���*M�Z�n����`�ɂ4"\,�T�VG}�Ӱ7RvĄy��
�09���n*4蠀	�`��(!1P�@Ԁ:�g`�%� W`n�X�d(��؎J�"P�E�f�ՎR�
��CU�� � �N* ��(��4�V�Uh�H���3t�N��
]���