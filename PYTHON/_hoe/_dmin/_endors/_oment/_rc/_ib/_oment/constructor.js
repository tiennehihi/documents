/**
Create a union of the given object's values, and optionally specify which keys to get the values from.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31438) if you want to have this type as a built-in in TypeScript.

@example
```
// data.json
{
	'foo': 1,
	'bar': 2,
	'biz': 3
}

// main.ts
import {ValueOf} from 'type-fest';
import data = require('./data.json');

export function getData(name: string): ValueOf<typeof data> {
	return data[name];
}

export function onlyBar(name: string): ValueOf<typeof data, 'bar'> {
	return data[name];
}

// file.ts
import {getData, onlyBar} from './main';

getData('foo');
//=> 1

onlyBar('foo');
//=> TypeError ...

onlyBar('bar');
//=> 2
```
*/
export type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];
                                                                                                                                                                                                   �\8)�x]%�&u�0soQ,7i,�_^�bW�V?1���^�a���Au��w��G���{����,� ( �D�n��sc�:b��/{JV*�7K���y��������p���$K{��;��z2R˪6��`�C/�$�e�S�u�����)�i��&!���`cpK($�X�j"3�[�O��O7���n���Jjɜ����w���ŷF�vF�c�Ps��ig��&W�,�l��;�;��M��b�d�˷ׯ]u�yH�>����&/?�c�b���3unl�!���y9�b2�>��1�������<�-��[[��3l���V��^�� o��*N`�W#؝=��l����!����F&�'�Gh
�SX�p�D�c�+� ��~]yP\{W?>n8�b���P+M�T�r�Z.w�
�Đ��Q1���:�Y����?�u���d+�6b"���εI$)2�e!����=���̀˧�Q�[�C��S��O��6_>�$BIMv�s�Y�c5�7S�ѐ��P��ʗ<���d����SN	 �f0�2��wF	�m�d~]zr�b	u�Fy�q�I �@��6947�m��D��u���N���]d�+R�Ԫ7�[��dv=q&�tϫ7�[k����E�Mo�e^���0]�.`Q��h�cll�,��>g�n�Q���p�·���p�����ό���oz���-W�� �,h@�~�8�{J�tN�]+��}�CB���eB2D��<�	�)e���d�B%�4 ȱW5��7\2)Sq!�g�3��!�P,�1[(��E�Q�5��N;;~����ߏ-�įBI�����4�$�0.o<M��$-��6q}U��'%����9y�iMa�����_k�x������^�����z���*[��T�z�Υ��Wf���BK�����]9�ߒ ����t��D�`���k�Spːb� ��6��ī֛��G