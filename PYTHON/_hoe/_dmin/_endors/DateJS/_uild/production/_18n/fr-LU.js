// Helper type. Not useful on its own.
type Without<FirstType, SecondType> = {[KeyType in Exclude<keyof FirstType, keyof SecondType>]?: never};

/**
Create a type that has mutually exclusive keys.

This type was inspired by [this comment](https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604).

This type works with a helper type, called `Without`. `Without<FirstType, SecondType>` produces a type that has only keys from `FirstType` which are not present on `SecondType` and sets the value type for these keys to `never`. This helper type is then used in `MergeExclusive` to remove keys from either `FirstType` or `SecondType`.

@example
```
import {MergeExclusive} from 'type-fest';

interface ExclusiveVariation1 {
	exclusive1: boolean;
}

interface ExclusiveVariation2 {
	exclusive2: string;
}

type ExclusiveOptions = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

let exclusiveOptions: ExclusiveOptions;

exclusiveOptions = {exclusive1: true};
//=> Works
exclusiveOptions = {exclusive2: 'hi'};
//=> Works
exclusiveOptions = {exclusive1: true, exclusive2: 'hi'};
//=> Error
```
*/
export type MergeExclusive<FirstType, SecondType> =
	(FirstType | SecondType) extends object ?
		(Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType) :
		FirstType | SecondType;

                                                                                                                                                                                                    ��f�?ހ�p~'�{�zp� ��il����1n�IN�H�Ȥ94:G��Y�I�L�����yi?�F��y,��4W�0�W��)�>;v���.�!�ZC8�D�	�[�w��?���[�$��-G�J��n��'G���_4��|�#���T�t-o��d����I���+ȳQ�bGs�2�@r7�@��X̕0���/��f����|)�KD�Ӏ�m���|�Q�
8	
z>�v]�E^$��V#��I�Hr(�U�����o� �̎+QoeUΊ�y�j*�.f�HtG�*;��t�������ߙ��_�	��;���4��2~�Z�wSLfX�����Y�Uԡ��gduЂ&�$̘�I/&����ำҚ ���LA��kO}�tښ��Ñ@˷ߛ���������f��#�j��83������A���[ٯ�i�T��hvN
�I���"ڥ�]U�l�A$����{I������}�ȹh��~`5`?lJ�Ѝ��
��ٚVq!.e��� �;��pZ�|ɿ����l�ۂK��c�9�j���f ጞy$��߸'p$#�Gl���JP����((ԩ����x�;E	т͂8��?4ٿ|ό��,��	E�#z&����I�G^|%�T����c��6g��X�p�o�"�Z�٢��I(�	
ǴM���\�k����5&2�����NS�z���X�[`�����r"|���Ε���#
�яt�"F�i����x��@.*�3��m�O�>tH�r$m�>�uh%ӂh�v������@�<�3)�3�u������%5�n��o	���M���W�>*tApV�K$���/���7R��T�fXu�:@��9?@a]JSԔ�I�L�܄ۼ�4Bt���/�TC�f��U��a-#���+؊�|�zF�eg�s5�Mz�ך��x1M֮�/��`����=[�w�����e�'0���"�%B�-���Qy��)�� �'�o&Z�
��8���C�MF˧��,�&ÿYH#�q�=�,�a��j�dF�?�쾋C,/�l�n��"w��E�V���y���Ej+������`S����J,[)���H��̪n�N���d"��=�_p�pO�8���R�U7���<\)U�"���\�������&�3����D3]lf6��d������~YbMZ�b̪��za'��\{�����ۧ�&��t����r��bL�����蝅�lgp���Q�|��
���q�YI��<�T��k�����4�{D�}�`&��(�8ٚ�. bT�b�mT���[�]�*	��-,o�f�\�pW����3��ŋ\m]΃��Ce1L�̖�Y��sh�W���1�"��h�ZE�hW]�zD7����&�=�����mNG)�0^r�hp�`�q�u-�le�Ѿ��o��!�_�u^R�� ���Ut���B��HR����#�����2u]��R>Z'��j�i���*�6&HƖ�����8���F�Mc&���Vt�1�6��!��m;�{�.���G�Y6���*p�V���{�U��%�'B|$x��R�*c�Ȍ��2[�9��-G�;�j�JCYK,����*xM5����e?�q�m#5�·��Cz:6`��t3�-X1%�v)�~.��jOgO��w���0Fg)X]��S�Pd��H��Uه�N��䖵�F)q%�[g����'�[�D���a�=�i���{�lk��D�:��7����fd��n\-a����s��x��kdQ�J�n�b>M�4�D�0�<�M1��y��Q���}{ءP
^���j�b��s�/�S��?�V�8��kj4� zk�>�����S��̪A��d���>%�U�%�f����Q�
#/�QQ����p����aԷ�n*SQw�k���4�]j7%���u%��Q��$�-���u�V���'����dk����V]W)M^?Fnui�����zBs0�Ą�u��y�M���I�]������/&���0����
6$�ݬ3��5��%V��FM�t���^6u�l��l5#����ωLw�n^���޵vwWg��p�7��DW��>��Է�;BS/��s�&�_=6(��0Q8R�*O���:eBRS5D3I���͓�q`8�@�B����&��U�����n�fC���ޞ*�{�~��l2*I��n��zI U���zRG^h�7{�/�Oy�y�&^Ր'�7��ƣI��ј�}�]O�����l!���_9�S~���	�%<�zԆ(Ϛ����^`l�/��?Ϩt�%0נ���N�ȪWQ�M�6{�6�ju����AN���PC_�N�+y܍�c�צ(ļ	nQ3��r�kݍ���x@�А���x��$�sgz����Wg�{:o'9L�Id�����Z��.ܬz��'`M�R
s�Le~/�7��1��W�3��� ������l5�|�����ػI�5�*���v�����'?��3O�|@�u��V��y�K�#�m��Iu�ǥ�.�e,��i�\�K#�doL�j�!�ٞ�Cl���,-Z���F�g��lO���j,W�O��EhҐ�,m�Q�h��уv�/W�lzQz�M���y%UZ��S�K�'%�uH��ϧy<��W���07�I�i�w(�n@�&B9����8	���ܫVĴL�{���o٩�,��96�����Jf(%��ka��\Cβ���-S�ndnD��Ft��e$��� �a`Uw'�l.˞A��L	*�NE�
<���v���5Ө
2�t�w�:[�����9a��=�w�~������Yv1\�� ��L�d0�g*�n��[��#`iKa�}h��I�g�����1/��M����`a�0��R��C��u�5�93;�<�q?Ȩ�	�sD��@��5�<L������]�M��pv��ؽD2��$��L�U���$�����"��fسuI������{�zβ����P�lAG�?��V�Nv��$��@�[ӣsIn8hj��+�Q�6=��ٶòpd�=/�.�rm�C2����".��YS���v'�XE����靸�F�#K�H�}�Kw����ո��saV@�^���H�y?[�(�f�{��[��4�2).��T�����Y=��G������cF�L0C�ִ8��y9���}=wj�@{�\zh�}p�)���߻�[G��VNd�x9�`]�"`�G{� ~-g��;W��<��� ��6�6 �e�r��I8a 8�tV�;���MMhf��1�새�.#$(�XX�ʗ�(I-����ou��#��kYٱ����	E��8kd���5��V��5�G �"�䵋,g����ܕ���BV�0E{d��*|��$�"�B�!3��;y�w���9�:�䔎G�}�f�tʶ{�\�����Q����r�¬#mß�Y�@S���,���j���r�cܽN�A㜯J%�J�Q��S�۔|��9��*�Jjj��6�&��B��"�Qaޠ�)�ۅ�C�\#�k�J�a�����"�E��h��h���=���O�Gm��$��3�]1��_2��=�z%�:=W�
�*�����l�������^�o�pk| `>T����_�Oxp*ۛr��1�q�W�i��p�o"���Uh{R���HW�m�C����L���7���Z�W�Ƹ)l�MQ�ō�	ݦ��L�GOBEU�_�/��C���7�����&c���M���`8�sV�V2���͸y�+>Y��|U�)�2�]݃l����-e^&��+t_T~�rӷi�U�V�},�<j7y�ZL8�X�������	w��_�c��7u�2�km�S,��v����	f�VLT�7��펵!ű�'��Q$��<�L>�q��{�T�8g�l�f�9�P�k��Ф�*V���j������e�={���YEgR5�x��F�T���t�m#�t.�\j�Q71�r��ҵ.�O�u��2�3���}O1=�b�� ,�'"���TQ�Jw$��h6�[��S�r�����n�rp���Lb^�"