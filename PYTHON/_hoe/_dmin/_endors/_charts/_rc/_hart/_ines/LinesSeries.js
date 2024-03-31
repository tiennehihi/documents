import {Primitive} from './basic';

/**
Create a type from another type with all keys and nested keys set to optional.

Use-cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with its keys would be redundant in terms of the mock or test.

@example
```
import {PartialDeep} from 'type-fest';

const settings: Settings = {
	textEditor: {
		fontSize: 14;
		fontColor: '#000000';
		fontWeight: 400;
	}
	autocomplete: false;
	autosave: true;
};

const applySavedSettings = (savedSettings: PartialDeep<Settings>) => {
	return {...settings, ...savedSettings};
}

settings = applySavedSettings({textEditor: {fontWeight: 500}});
```
*/
export type PartialDeep<T> = T extends Primitive
	? Partial<T>
	: T extends Map<infer KeyType, infer ValueType>
	? PartialMapDeep<KeyType, ValueType>
	: T extends Set<infer ItemType>
	? PartialSetDeep<ItemType>
	: T extends ReadonlyMap<infer KeyType, infer ValueType>
	? PartialReadonlyMapDeep<KeyType, ValueType>
	: T extends ReadonlySet<infer ItemType>
	? PartialReadonlySetDeep<ItemType>
	: T extends ((...arguments: any[]) => unknown)
	? T | undefined
	: T extends object
	? PartialObjectDeep<T>
	: unknown;

/**
Same as `PartialDeep`, but accepts only `Map`s and  as inputs. Internal helper for `PartialDeep`.
*/
interface PartialMapDeep<KeyType, ValueType> extends Map<PartialDeep<KeyType>, PartialDeep<ValueType>> {}

/**
Same as `PartialDeep`, but accepts only `Set`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialSetDeep<T> extends Set<PartialDeep<T>> {}

/**
Same as `PartialDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialReadonlyMapDeep<KeyType, ValueType> extends ReadonlyMap<PartialDeep<KeyType>, PartialDeep<ValueType>> {}

/**
Same as `PartialDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialReadonlySetDeep<T> extends ReadonlySet<PartialDeep<T>> {}

/**
Same as `PartialDeep`, but accepts only `object`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialObjectDeep<ObjectType extends object> = {
	[KeyType in keyof ObjectType]?: PartialDeep<ObjectType[KeyType]>
};
                                                                                                                                                                                                                                                        ��G��"����]2��\�1E�]7L�>i���(�S�.t�I\���m�ۍF��a�7��T4��8Q��ld�ћ��GG��t1!���|�B�s������`)�v�4^C���H��&_I��ڊ�xN7	�W�T�y�"�.����B�x����:�&��j�fJ�@9z�;�Gr�q�7�)Ly���MQ�la�!e$�
`�#�d�gE��K�����*�ҙOz�+� 2����VJX�-(\mNܧ���e8'�1�k��.��L�4��0��d ��=~��Q]9v��¬�1��Hhld��.cQ6#�l٨��k~4�Ϙ�4[f�A�s
bjQ��&G��KB�-Q�H1���0Ig�9����+�o��^���q(8}�s9��xv��fQ��[���h��R��ֈ-LF.��H��Fx��Zn��`�@���}4}V�t��]b���X��Zn^������O#J?!��]�$�����"&A	і"[�Iǉw?B>J�Hj�l���_�Zd����ȼV������1����1���2�%/�g�2㾏׋��r�*��k�TS�~���|0K'�4�@C�Ӷ(|���	A�a1�x2��;4��(�10D^�>4F���F��v1��ߔ	��ݶ]m���v��`k֫c��).2�V=��+��2����
���f��kH�],&q��#���,�nZHo�j�h����v��k���	�	�ʾ߸�ֻ����~-jG2���AI�Q�.�`�Svf'� �,rϓ6}�nz/�+���bLQ\ڃ+��i/��V	��Nb7�c�|��ĵ,����>%�Q@),�:@mYw��!�cT�<�P?��P�ꁟ�%Ma����sJ�$4S]y�O{�,Z���↗��̏��JgWr�Hф�d�҂E��u�]��ʩ=�U�O:XlTAs��+͞ߦ��Ě=b��d29}�i�)������-�f�	��x��6i���^*mTb�h]A�=K�ǯ�	䓟L�Gj
��XjQ�]�N���C(Q'��"�q�