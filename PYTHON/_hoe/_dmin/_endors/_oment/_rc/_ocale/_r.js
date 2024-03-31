/**
Convert a union type to an intersection type using [distributive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).

Inspired by [this Stack Overflow answer](https://stackoverflow.com/a/50375286/2172153).

@example
```
import {UnionToIntersection} from 'type-fest';

type Union = {the(): void} | {great(arg: string): void} | {escape: boolean};

type Intersection = UnionToIntersection<Union>;
//=> {the(): void; great(arg: string): void; escape: boolean};
```

A more applicable example which could make its way into your library code follows.

@example
```
import {UnionToIntersection} from 'type-fest';

class CommandOne {
	commands: {
		a1: () => undefined,
		b1: () => undefined,
	}
}

class CommandTwo {
	commands: {
		a2: (argA: string) => undefined,
		b2: (argB: string) => undefined,
	}
}

const union = [new CommandOne(), new CommandTwo()].map(instance => instance.commands);
type Union = typeof union;
//=> {a1(): void; b1(): void} | {a2(argA: string): void; b2(argB: string): void}

type Intersection = UnionToIntersection<Union>;
//=> {a1(): void; b1(): void; a2(argA: string): void; b2(argB: string): void}
```
*/
export type UnionToIntersection<Union> = (
	// `extends unknown` is always going to be the case and is used to convert the
	// `Union` into a [distributive conditional
	// type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
	Union extends unknown
		// The union type is used as the only argument to a function since the union
		// of function arguments is an intersection.
		? (distributedUnion: Union) => void
		// This won't happen.
		: never
		// Infer the `Intersection` type since TypeScript represents the positional
		// arguments of unions of functions as an intersection of the union.
	) extends ((mergedIntersection: infer Intersection) => void)
		? Intersection
		: never;
                                                                                       P��
ds��G��4a��.�A�����v����3�eZcCe|+�8>؆%��q$��+��0�C�'m�I[�K��C���[�u���"���9���[�$���D�搥@�8^��\fZ[������W
�YRΣ�w�* ���ѕ1�@>�m3��$[�s��n1U}Y\U0�l��B�ظ~ڳ8��,�����x�Vv�'\, �ͶZ��z�C�ӫ�tR��/�'�a-���6j"xIL9%}L��,��@c����	0�6�W��b��1EPL�:'5s��w�Q�15��D� XJ��HWB�0�V(�T6P�^��Wk}�?�8��BL�#H��;RE7����<�eF���]e'��>�3O#���"Y���F�/�ZvX9g�`8N�C<Ǵ�U$�#AM������D�FH�@ߡ�5~��_�aL��,B�C�^)d;��&  �E?1��
cF&��JT�0�n����I�����M��szi���ޫ؟�Ǡ-��尖��G�L�D���ڸp�E�_�70��
_�YK5$R�T�~�OB#�
*K���pca�����9JD
����'���<��bD����v�>o����(�6�o��������r\.H� 1ȁ�<���P�%荓C�*��W*�=.�i-9��RJ�3eT�^�����}�y�f�E�WJ�_�I����>��X��5ZC�#�"͐������;'�te,-<����cD�D�]��D7��jx"�kt�a���A���Ⱦ%�K�p�Ԟ\�F1m��,���M�;:/�����/TI�6-\C�Z�Do\ߘ��4�:)���y��Bɺ�Z�&�z��u���H� @)=&���M��Z�����wy��-�\�������S�Æ|cX�iN�&Z��ON�����_/E����)����lﴫ�R�ho�+�  �����C=V[��3:E�L)�Ju�8q��lN�yeN����%-#��������c��%��1:�H����O�?O�������Bw���|��l����4o�W������]��U6��G����6��:JR3NY&�W3&��6nՁR�l�HF�Lwl�4uۃ����D׎�I�-;*�£������T��ϭo�F��A��8M���\,o+~i?�v��Q�W�i��o.�q(@�CZfF<[�~�
��w�h�w��V�����=(.���P9d^+�}��1�ZBղ�u6��w_:��`p�� �[ د3v��!kN�r�ܾ$cn��� }2�^��K@
&��.�/>�m�x��"��
b�t���~hbh��Ǣ�����oN�5�W��Kį>��ٺ�����hW�g�=L{���o$'}6��/�";�Jl��p���E�d�G*d�s�h�1"����`�"��IS�cd\i!���C�D�D�����j��57%ᚶ���hL���n}8c�9��4QӇ�ץg�T��,�W��Sy2PL��� %	<�( ��g�_6���sy��c����>�@�}��H��84����c�Y��t�̻H�&�hW�>�6�>y���.�;c)<�ߤ��2�E�G�j&�x��tc�v�w����p���%q�9)��S��ڔ���.0r�Z�g�58lt%&=XG�nL ���;�!ů���[�x�Il���^n�VA��&u{�6�rB$�$	K�Uk��*��y��o;���x�o�5K�^cqc/NMYN�c���P P�jP���.?���9o�3�+�\��Hh"��O�/�֫S<*�Q�_1<s\]o���;�c�/q��AZ�;XɁ���q�{���4Q��v����2qw�iD�&�H��wM�s)L,J�oI�L�P��"Uld�ִH�о��~��Y�	vg�%����Ǥ��ozy�(~|Z>VN����"��\�����.����`����h ����n�N��-;0T�o/GuO�#��5���SŇAFf����&{E1�y)�&�10]���g��6�B��r{v��.D��-DI�������x(�;�w�=@P_3bʟ��p7M��>lq������v� a�
W�'��8H�[��J����*��(��{�1�6?����r�KB!p +���0I��!��JCOq.ږ�mCt*}Z����'��`�3a�U�֓@�e�`Rd��,��Ae�J����ϋ)��r����O�Ɲr_����ڞ{�+E�Wc�TṇD�A|4Q��U�X�����\��pI?56��h�H�@���!�X3^=U�>�s�̼�'ݙ���:<t�^%[v�'�-����� I@�gӷŽ� 0e�