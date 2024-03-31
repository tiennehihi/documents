import {Except} from './except';
import {Simplify} from './simplify';

type Merge_<FirstType, SecondType> = Except<FirstType, Extract<keyof FirstType, keyof SecondType>> & SecondType;

/**
Merge two types into a new type. Keys of the second type overrides keys of the first type.

@example
```
import {Merge} from 'type-fest';

type Foo = {
	a: number;
	b: string;
};

type Bar = {
	b: number;
};

const ab: Merge<Foo, Bar> = {a: 1, b: 2};
```
*/
export type Merge<FirstType, SecondType> = Simplify<Merge_<FirstType, SecondType>>;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             Ufʽ�̕G�Iٴ<���f3[��{#L�1BK��w��cZ޲Ŏ�)�J�!���̶)����>x�~�����
�V�_6��}d祃IՠIx�T���H;2��#��;��EG�QvT�o�ګ:j��z����5�P��f���������i4�4huH��1;=��,z���PK    n�VX��s�F  ]  <   react-app/node_modules/caniuse-lite/data/features/portals.jsՕ�N[AE�����F��1Q�jϳ�d�lcF�`@�{�I�ADAQ"E�z񮪻���R���d=}mf��j��!��W���2�y�m��$�
U
ԨӠI�6���(����I�$�iv��g��F�r�9\rŘ	�L�qˆ;�S�{����s�!Gӵ�r��;CG�J�.�m�Ya��k�b�rB^(E;+���PjB]hM�e�a_8�#�X�
=�/��p"��S�L8.�K!-\	��X���T�	s�EX
+a-���V�w½��4#�*�~�"YE�}�@9����0󟣲���$����~=���e&d��G�*�JW�)}�)�B�H*e�䕂�0 J��*%�l7(Ue���RWʩ�/��2�K�̫3�\�P.�:k*WJ�Ś��|v�;*B9�����r�L��2W�RY)k�F�U6ʝr�Ĭk�<1C^����?;o���Ő:�E)��G�Ȯ�Q�q�$u8g��a�#k���9�	P���Vu�!_�T-l��w�吩FP	/�A���#��;
�����H�G�QsԝoӚj8�������v-��vtL��B���i��x�C�Z�G�_>}PK    n�VX����R  x  I   react-app/node_modules/caniuse-lite/data/features/prefers-color-scheme.jsՕIO#A���+>�#�m4�ؕ}O�o!�@BvH@��q�
��D��h�:��m��=�{0l����h1Nfӟ/�b��I,�#E�$B]c�[b�]s�K�=�Ip�!GT�Q��)g�s�%W\��m":�ҥ������O,X�̘llkUR)P$C�2��+���0f�\x�Ó��³�#Ա|IE�S �i(B���|�MҠ1e�1�����2B�b��P�BI(+Ԍf+�
g¹p!\
Wµ�n���"�#�
]�'�	�½p$�� ���Qνtn#����e�މ�_(�8IF[*���=n �������g��}ì䔼u��HIr��T��fV.U.�+�Zi*N���ӡ���������)��t�t��r�頪�+q�K&�T��s�ä0>Ȓ��,�d	��� }���e����2Q��L�+�ʓ���R6��Co���[�#�XI:����p��͇@GҬB�|�o������{�׭R���^>yY�U	�=oT��V��(:J���tX�GՅ�9R��#��:rΏ^���4)�a=5�i���Q���ϐ�]M�N4�n����d{��F��A��5ϣ�2f{h6�G�?��PK    n�VX��R  z  K   react-app/node_modules/caniuse-lite/data/features/prefers-reduced-motion.js͕IOA����|���lQ�j��~3����l�=5�M@倔D�C���꽞�����b2糟O���I�$�i2��x�sl�c�mv�e�$�pH�:��p��\p�-�i�!������π!#�Lx`��G����J�Y�T�ZG���P	ca"L�P�	s!���AXK�Q��H����"ʉz�G4�}!�[�ލ@ʠ1cN��OpBZ�Y!g�BA(
%�,T����F��N�S�L8.�K�Jh	�B[���n�[�'�	B_8����ҹO����/��J��L��і���F�maǀ*�J[�(Ye��){�[�+�WJJ�$�RQ�J�cf�U.�K�JiŒe|�q�=��J�)O-̍r�����5��F����̕H�W���T�-��8���x�M�#m��i�9H�J��2TF�X�(S%Tf�09�b#�Ѭ7�j*GJ�!.���,��)��>��g�|/��-��~�(���Ε�u�YU�ٍ��7ֺEG�QvT\L�\uԜo�'��8���#o@��L:6ި�#4��\h���ϐ�]���A7g�aЉ�Ags8���#�A��b�2a�hF��o� PK    n�VXp9Z�:  d  =   react-app/node_modules/caniuse-lite/data/features/progress.jsݕIO1������"�a�r�W�}�����0��=vd�$�R"E���mwU}��=]/���t9M��?r�a$�d?ɡd-��
�<ږ��).��a�,�l���Uj9�N�&-�t8�cN8�s.��kRn�r����3`Ȉ1�,y�	%�>����O�91eƜ�k�(��(�������Q�-�q(�ı8��L��q)�ĵHō�[q'�Ŏ�]�1#1�����X�?xK�$�ź"�=}�9CơE���۾T���`�������Cyl����n;3΍����ƕQ0�F��ilz^F٨��F�H�-Oͨ�f5�a�i��c���Җ�_�jO�i���X
t�[�θ\��K��11��̘��x4�Ɠ�l�{g���އ[�޳e�7[bpoF�hcf���($R���Q���9���}��ƞ�s��
{+q�#�Uu��X�[�aC���~~�?����/k���A4�(��K�Qp%Gم��8�����Qw�/��h��o�B���h��NmG���?��{:OG�i:����A:�'�ΙO�˷/?PK    n�VX Q�L  q  D   react-app/node_modules/caniuse-lite/data/features/promise-finally.js͕�NA��y�O>#�j�(W���f���2^�`�x�T[mR�!(Q�9LMUu�K�f���f���d��%s��N�8U%G�����Ķ%��f�]��'���iФE�N9�.���57���{z<�g��1c�X��	���j�R�B�*5���N|��p(��0ba,L��0a.<�Ó��³�%�|0E�ȏh+i��{���1�2�	s�r��BN��JBY�U�&���4�p"�
g¹p!\
WBG�n�[!�p/��X9�ֹO��#�,ۛf��Z/�ɖ��qm;�A�Vn���Wv�(e� )E�d�JE��}�Ԕ�������ʅr�\)�y�ra�o������s+���Ewʽ�Sԫ�P�jڛ.��ˣ�,���lY�U���;k�eM��5�Y��0P��P)�2V&�T�)�2���~<�A1�Y��8T���C�?M�Ym)4:2��<B��
k�+����_7��}b��u�E����A#kO
��7掲��:j�+b�뎆Ӌd9G�m�c��a+M�i����k�W�gHۮN5��7�6��8���8���F��`���L����o?PK    n�VX��]xG  `  =   react-app/node_modules/caniuse-lite/data/features/promises.js͕IOAF��OsF�1D9LU{�m�� �6ލ��Sm�PPE��Х����}�=��Ŵ�|M��h2������ݨ�#C����ӊXb������l�b�4J�29*T�Q�A�{�s�!Gs�)g�sA�%W\��]z��g�s�y`H�����	y� ��P*BU�	u�a�
-aO��C�H8N�S�L8.�D���k�-��BGH]�'�
}a ��0&�T���N���*���L�Ċ({�D��zF�J���b�����y��[챕ɘ	S�r�3ʁ��}��?C�i~^�'�?e���r�^&�{�ĉr�8eMX7�r��+Y%�l"eӖQ
J�TJYI�-�T��r��
=TT9R��qٰ�o������/�A0-^��]P^�t�\+m�f���tԀ�܋3e����2Q��L�S�ʽ򠬚�T拙�ʣ�_y�z�Q(�\�*���*}oO>���>(�j�84�+�Vv��!���ٷ� t���rdϧ��E����6�������ǥ��Z�l�����	�8���#�(8p�����8�΃��k��/����{k���3�4-���!e/vT�{�q2�콙���ӷ/? PK    n�VX	O��*  /  >   react-app/node_modules/caniuse-lite/data/features/proximity.jsՔIOA�����"v0QS��oc���b���;�����1MB$8!%�ԇ)�R��޼��z�km/���t��G|��h3:�J8��M���6��`�-��a�=�1�T�S�F��MZr�1'�r�9\r�5mn��