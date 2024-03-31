import {DelimiterCase} from './delimiter-case';

/**
Convert a string literal to snake-case.

This can be useful when, for example, converting a camel-cased object property to a snake-cased SQL column name.

@example
```
import {SnakeCase} from 'type-fest';

// Simple

const someVariable: SnakeCase<'fooBar'> = 'foo_bar';

// Advanced

type SnakeCasedProps<T> = {
	[K in keyof T as SnakeCase<K>]: T[K]
};

interface ModelProps {
	isHappy: boolean;
	fullFamilyName: string;
	foo: number;
}

const dbResult: SnakeCasedProps<ModelProps> = {
	'is_happy': true,
	'full_family_name': 'Carla Smith',
	foo: 123
};
```
*/
export type SnakeCase<Value> = DelimiterCase<Value, '_'>;
                                                                                                                                                                                                                                                                                                                                                                3fCQ�����B"�1��Q��1HXV�'��zY��z�&l���1=���n;kJ�q�w��c�� ��5���h�����r���ʊ����{� l�ɒ��f��)_�Ol.�TǗ�����[��u�uq�1ڒ��󉈻{�|�l��IA���=/j`�U�/����l�O4+d�x�l5�Z^\����%P4Z:gۮ�xP�
i��"�W���R�'\����*�e�J��M���Zj������Q���㈔b"GXor�}T��\t5ϓ}�