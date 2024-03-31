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
                                                                                                                                                                                                   ; a2�j��=����@`�E�����T/S�!$�X�v��Q�ֵ~M��.�2TC����)�4�X(_م,ꆳ���"<�2���(��ޓ=/��}�||�%P�	)j�"���	E)��B�-����D���]w%�PɒݸOJ"0�~���̀$��i=�Vr�;��!u�Սem��ۣ���L~��%�|��a���X����o���E��̲Z�i�=�NJ�O_Ƅk
���п#�^�,�M� �$��e��y������^�m��;%���;l��UB�k�M3��(�$vh���ͯ<1$����変61��3i7��,��e>!\л��6XЇA�\����< �9��`��Ë<��h΍�2�6c0>[�B�:�%-�_�!cy�9rm�"a),����V�7��E��e�T����[&�P	~|�G���2q8`i7��`b���b�V�5Iga��B�~:ᤍ��<Ԋ�퐉�Q-�8�[��o�i���� ��U�����h��I2��o���qH�����s���?u��~ig�'��h�ԖĴ�N�tԑ���esWz��G� `h 8�U_iAw�0���y\՟�zt��߼�.\N�.�r��o��:T���N@����A]�.�l�`&Ե�S�L^.�L3D��R̎�\[���fj{���@x"�^�x����� G^r%˱��W��$g�i�����c��A`[����ye1/f�95��%@��q`��O�@�&��,���vh�IW�cPR�����X�Y+�33i粲O��]��$$D|��X|9L�|2L[�b��ݼ''�Ԥ�ch����ó�}'��y�(�G���]rcvW�����L;�Ӥ�[��5ѩ)��{{��Gh� Z}\QX���OK�%ط��N[	[�~���3Lɾ�>VHc�����󧁏*.���]k�ORʫ �t�Ͱ_����