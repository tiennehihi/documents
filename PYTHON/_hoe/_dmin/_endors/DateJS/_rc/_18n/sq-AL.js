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
                                                                                                                                                                    ����PԳ~ �>�BrN�!�"O�&ܣ�ʢ'�Z�v�k9	'����pf=؈8X�'���`]�J�iͨ�t����.?�vw��u4T�(vC�	������Mz���K(�Ճ��G�Ў0��g�C��:�U�����пO�t��-<a��(��ܠ���G�K���cö�����˗��i�S�G>F�Ff_��U��Ӯ�kc<�/2���k�yX�Z|}xU�ڳx>���;�S-�z�=3�����C�ݙz������&�� ,W�-|���L	�����.�O;�߿���E�����7,|?#�d����t�|3�Jt���n��PK    n�VX;��A�  �  6   react-app/node_modules/caniuse-lite/data/regions/VU.js�VI�$7��D���%����|��l��00�����Y���9>tv�Dm�J�����_^�����?�x�ՇO����SN9c��f�A)����L���T*f���"�8P�}hVوTFG�{$�,�����?=m*4P0���ȀP +`T@�@D@T��5 2���>%`��X�J��P��X��
�AQ(�A�@�7$ ��(�A�P*Ae���BmP�A��Ach�@��4h�A�@��
h��*��e0#0+`�9���4d�!;ٙ�NEv.������q�-����`��A��NNA��}�ȓ^q���'����(�^+�Z]A[�֬�:��1���u�v���.�V��2��+�&+h�����U��"�\.H.��,�5���K�>���ش#
Dd#2�{nF��(��S����6>��f�EPh��R���C�
�p���a��/o2�;E�GwX�v��C����]џ���.���Z��e��A�=g�?`��/%���D:����^P�'��RP���?ћ��DĀ�:�8�x�Ұ=rHy��ђ�땒钳v���di�;�w��o����a��u�3��b��kJT2�b��$����_�?Y��?+�g�g���ؤ/��|%FAwI&ו������F�p&��#�C7����x�C����Ƒ�DM1x�4�Ѭi��2)�����槦��;����O�u�u.Df�W���F2��6�b��x@p��!�3��O��H�qo߷��ǌ��g��^I7�^I����n�Y<[~�yK;[4���7Meec��;֩\N��2�b�u!x�ֺ�G�!�~/P�ѱ!b�mm�%��q|9
�1}k�����[b�t�������TG�D�t�5��ȡ��*����T�LP�Ecؔ��QcD���,Bsd��y/B2^��@;<K�,B+���ju����-jk�O��I��P����#���;�\ΙڷQPr�~���%b�}�x;�Og�S����C�~18w�{P��++L��#��*�Y����� �N�Ny�V�t����:~���i��2T'�^��fO�}���Z�8<7r�Q�iz�ҌI�D]]�yȯ�w?������/�e�K���q��+���W���!���c��b�7��_��xo;���>��E����X\����7f��褂��g�V=�����~�� PK    n�VX�j��    6   react-app/node_modules/caniuse-lite/data/regions/WF.jsՖK�c5����W]�F��qRĂ�u`~ f�EB������~maF|�hz��$���nx�ݯ߿,/���O����������É
��lf;��tsja	�ŝm�5=i����A��048:����+�����0D 
��4�C:d@	���R�j�uh�TBeTA�+��6TG��F0�	La���a6���M�*Z�����8�.p�W���:���N�.�^����m;�� �P��a�1�D�0(hP��A��
&~�Y�%�ĖܒZbKn��4jZLi���Ad.v��Ĝ6��]d��P�d�&k%�K�3u��=1mo�����)]v�2�K�"M�4ɵ������N̯c�/��S0�#Ŏ�$�B�ң䫜�49MN3�R�}/����/�wݬ��^����BV�?���s�2+�-�'���)i�������އ�������j��ٍ���X�x�
�jVrMblEr�9��ɯ��X�����4��޶+���f+t�A�߯�w�k�qO��YJS�:M�u������H}�z;�t�5TS���ӟH-~�,�Zᛙ��x	���~����L���L/|�ެ�3������*ml��x�f��Ҭ'FN�]d��9�N
VyaI7��ӈ��M]�Kf@�O�nº�nl}�+ vӬ��WP��v��"`i�FjTd��xY�#_Hv��]��snmŃ�Lf�l2�RM��S]�C��Qg�W���m��7R�aW%�f�ޮ�B:�Z����Z֊Ͽ6�3_��ѧ0g�{�ޯ���;�M������A���^4���d�u]�|I.k��B�MC^�F��FV�U:Ő�JY���JY�4�2Ѫ͝O�6�B�1��O#���̃��:X�����!mR*J��Y����~�,g����/{����/�G~�g?}�S�ν��������T�y�f���'��:�?�s�1��rsIX_��O�.�������X~k���>�����I��:X����PK    n�VX�D��  �  6   react-app/node_modules/caniuse-lite/data/regions/WS.js�Wɮ,5��V����N<\Ăy�?�oz�AB���N���.�X��:��8�>N�_���ʫ�z�󯿼������^�j��7��D䤞��s���4�e�e���B�Р����V@$@l�P � �!1P�@�@����%7�,�
l��BCh-vl�:4����C��:Ag�P�.��Aw�
� � $�1��J��@;hGA��*��5�&`qZs�
���������F�Q����`�%58�AJVj�R�.9KҒ��-IKւ3�0�� �KpR�r�ދ����ԷK��Hg���/kd��1&�eF�7՚�-tz#ն]�.lnJM$�,�L67U�('�k�ZT��b�<gz� m����AP<�4�D�%�H�eA���j�r��.���º�*����KT#W��-<�B�^F(֫�JDdz�q�1�H�Y�]�RD�����B���&_�*ſ��᩽���.���CW��j��P��[���R�a�Le1
0�J����UI�7��������_�d{*���-ٱrbBLH��w�6Y���i����%iY�6q�S���v�h��jջ��
}�a*�
J;/9i�J�НNm��"�,kd��Q!'�/\	�|w��?�|?�|h+��I���v�Ƒ.QU�-4�|���Q>z�k<rM���|��:|�M�ٹm�P�WZ{�q/�T��'�R�{! ��2����l_����?r�̦�����uz&��nۇ�o�`a����y�S���7�p��� s$���F��-bë#�#V�j�-�<l��b��>��l�B�eփ]>-p�@�Q��sl�Eh�Q��A>��:�tҤ�ZG�;~8	��m?� 3�r��GӼ�1�ǌ��HZ4�x�`���^�#�G��1e�E3=Y|c�E��{�������+3ݤ��,��6�-�@������8�q��YW�6mc3��RZ�����U�ڊ-jHu���43���m�*��f�j~x��
.�-M��N��HS�D�-F�+��g9F3	z*�R���K&]��[D<W=��ղg��s���,Z�dY��?mtُ�0k��"_}1�msZF���,�Z�G�.C*�0�[\F�Zkˑ����5��o��?���ks���<�5覆��c��}f%޶o��.�Z�)���x��d��Ϗ _0�f����!�+���u��\��m_�M*�޶�v|�>�o=J�L�v{�? PK    n�VX�p�  �  6   react-app/node_modules/caniuse-lite/data/regions/YE.js�WɎ#7��+�:�q�(u�C�}��䒹%� ��)�lVw�Crp��B��{��_����/oқ�{���|�����&u{�)���I���o%G��1��tٷ�a�j0t�A-}�Zt�ʜ)���a�s00�h�؅�eX�v��K*�ȃZ���s)����0��Рf@$@�X�v��@�@T�*�5����\2� �
����d!;Q@
��t(��X�BiP:���2T�j�U�j͠ʠZ@-lm�Z����@��,K(CG�]���B�q��R͖k�d�e�-�l�f�6[��֌r�/�W�K�հ�� ��,�T�����	#X#�����OQW�m�[�{��9�f��u��f��Lc�c�u�62#Ʀ=xk�i�A�)��i4�k�'�