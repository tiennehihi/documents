# @jridgewell/set-array

> Like a Set, but provides the index of the `key` in the backing array

This is designed to allow synchronizing a second array with the contents of the backing array, like
how in a sourcemap `sourcesContent[i]` is the source content associated with `source[i]`, and there
are never duplicates.

## Installation

```sh
npm install @jridgewell/set-array
```

## Usage

```js
import { SetArray, get, put, pop } from '@jridgewell/set-array';

const sa = new SetArray();

let index = put(sa, 'first');
assert.strictEqual(index, 0);

index = put(sa, 'second');
assert.strictEqual(index, 1);

assert.deepEqual(sa.array, [ 'first', 'second' ]);

index = get(sa, 'first');
assert.strictEqual(index, 0);

pop(sa);
index = get(sa, 'second');
assert.strictEqual(index, undefined);
assert.deepEqual(sa.array, [ 'first' ]);
```
                                                                                                                                                                                         R�{�pE+Õ���/���ʻ0�Cna�g�YF�!f���A���m��#���i�[��/X�ۡ�������H6���C���G~�G\^,c�[BG[b�1�,��1]~���n��B*���6�F�c�����ݪ�%�7�<�;�����mE#A�=�Y*0ǯ/��F0K�+������{]�X�?�ﰍ���WKc�3��� l|����SB�ǅ�7RFB0B�r�X1��u�9�C
�ֲ ۧ�4+��0p�T+�Q<"U\�t+�H䙣�Mv{6��[*c"@ml\x�A�P>�x�x�h=�����wVs	�Յ5�s|箻i�j 46�˘�k_�֫�����i/��~�(=��kzl^�e-D����d�L�\��6Vu�������+�t"JFߐ��>S����HP�jw^m�|�r�ȋ-fI�q@�%}�ݣ;[���.�5�;}H%�u璆&{��l�	��i-�4\OPN��'�hS����~:|�+�\�^#�m�ӌ)i���F`��*�r|�wӬ�z���xV����5���æ���g=ŭ8�bT�_�.t�G��ϻ�r٠xR�����3g�)&F�ڬ�$5Em�r:;�I<�!%v�}�ྣҨ��z��o��Y�R��#V�ڸ1H�k�j��<��U��`=Mx��?!�r̰��Ggdm�$�b�`ޡc8~�NK厇;~v��dzJn�!>u��b�V3���v������Vޝ��eE̑���%��dx��}d���V��	�'�qD g(�ڍC�������@�LQCvr[k��ԛS��a�$�d�׋�$���T��M�G����1-lm7(�K���m�-�ĞN(�쫆碛Dy���#�`������ωg�zJ�d| ���7��R��R��
f��Es{X*b���o���ڹ<�]e����_���"X�E6/"�������2է-��;�~}j�������4�����a�y�� ��fT���㛍��nȃg�1@>�yA��tE~Q9aAXZX���`ņ,�)��jjP�&C�zӊ�ˢ���,���(	LM�p���'�A����AZ8�2s��*.��N��u��ކ�!~��3%���Z�:!�m+C�-H�D(șK��&�R����M��9%-U�Ѕ0V�9I~2�wd����ڳ��a&&�q�k�<ځj�P�X�9#����FP�qn��O����J{��y�
�
-0v�M�����+�$���<J��b�@F�>�`ކUكX��5�3�:� O�n��y�(Τ,J���e%��8����'�!*eZ��m,�n^�,��w;w����q$��U���E�6_k'��>�
��1��[W�7b��9R���m��=R���N^˘M0b�ڊÝ��-�C�W� ���~�l���7$[%^�)xl���hKOi��L�<~~��lY�'�W�ķވ���)��]<��H^��9�u��䦟��C���e4��s����n�Z���,��������Zqoa�3=�n0�@�M?a,�g�RI>$��(�[$-8����)��"����I|-O�[_�{�z���O:q�|�����:wF�� x���慥)��̓�bԹ�h�³��TH�1���z���4��>����Oe����uHH������A�6%	#�н�zK�~��eы�M#]d�K WI<����sr>7�x4m\."��>�F���j|B�;�Q��x��m��6I�_��x� -�����#;`+��-��Y=\;乏1��W-9�u6 ,[^H;�9,���E�m��m[������x냕k�p��fy�,���T��������VȀ	�3���@��4�TN��n���à�l{D�)�Wa�����h�L�Z�����2 #�m=�t�fꥺ��wm�!������h|����L�I�D�V�Y�*��C��=PX���"!�M][ ��ĜlDE�*��� B�$Y�ַ 1i���K�*�V�2ո|��43ȉ)~��"������� ��t���kO����(�Z|{<�a�C)Ö���%��{i?����:Z���Qu��}��׆ATpf�~�Џ���-��B���0+
��b��&�|I	���[�02�3�vO���������[��l*����.�>�e�a�c%�r%�۾�v
4�W�s�mrS\Jh�����ϸ_�{VDNJ	�QFM�J��Ƅ�Q=����>���m�k-��fF����q� �r43�6�[^/nqk���nd�݅��m�ʏ��ň�����2>���o�q�~�_�����tp �}�U��C'�2�[΋{ ��7�6	[2@P˩�׬6���.��)mw�Dz~�VD`����ƍ��w�m.Y�1{m�7�_g����O�U��dĤ�1�l��e:��k��bJ�?<zP~�rPj6�Җ�m̎(�zZ߮���������,�Ҋ��<X��.�1��3��g�7T��K�%s����^����Y�襟�X���6q!�L�X��i��9�A����׍ox!}����٘I>bxTٲ6s]���,���A�5T�a�����n9�g-�Ckʇ�^{:X,�D%��ݪ��]�'=D�2ȭu����`��te�X�\�M��_��)NwnK�j4ãmvA(�{�����='��,���6��ԘKy}aױb������'1�4}�Ԥw����L�s��h�tr�Үnr�����>@�q�$�{�bO K^r�y�ހ2�YH&r�bXvi=���H*�^~E��E��'N�ߺ%+����A�aI�1�~��5����{C�2҈ۘlm�{��(���/�Y����G������]3|�3�[��:�EV8b��L
	��oi~���[S�T�{xW{§��E\�����✃=�l���ʖ����̶�����Vd:��Nݩ�ċP3U/\��Zo�
�֐��@�h�M�1_q❏�W3b������>wӄatӾ�E�p��K��<�-D[�ue6��vt$�O�C��|���W��+$��'�4��!1��yM�#��o�&�q�?����|Ir�;
~V��e��~�5:t��N[+KJ�]�yθv�f�;Q�ف,$g��{9��ĐeE�����iB]�PM�S�pB�D�T�H�c���o���0�܉�����ߪ;"j��N���A��)gys�l�t��!�B盓����9`���{����g��Z�u.�;����\/7�낉�R����q0w�])�����3_�x҉S����&/R�A������z�@%ۨ��r�(1���_��x�>M����n9��;
up�ݗ����.~���x������nS������JI@��WΆ�f �UY-�s�C>g������䫆d�N%��1R�kU3b�j�7)t�=�����UZ0p�`����4/�����^�>�̌|bE8�<��s�/��B���t�G�u��&w2ǭ�o�,�_�%@�1�:�ŗ��!W�ɢ��8�z��V�e�1� (RUk�ֻYq�/�l7q�յv�K����E�]����I;*9P����