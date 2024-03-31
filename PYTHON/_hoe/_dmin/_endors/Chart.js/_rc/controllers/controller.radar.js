/**
Methods to exclude.
*/
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';

/**
Create a type that represents an array of the given type and length. The array's length and the `Array` prototype methods that manipulate its length are excluded in the resulting type.

Please participate in [this issue](https://github.com/microsoft/TypeScript/issues/26223) if you want to have a similiar type built into TypeScript.

Use-cases:
- Declaring fixed-length tuples or arrays with a large number of items.
- Creating a range union (for example, `0 | 1 | 2 | 3 | 4` from the keys of such a type) without having to resort to recursive types.
- Creating an array of coordinates with a static length, for example, length of 3 for a 3D vector.

@example
```
import {FixedLengthArray} from 'type-fest';

type FencingTeam = FixedLengthArray<string, 3>;

const guestFencingTeam: FencingTeam = ['Josh', 'Michael', 'Robert'];

const homeFencingTeam: FencingTeam = ['George', 'John'];
//=> error TS2322: Type string[] is not assignable to type 'FencingTeam'

guestFencingTeam.push('Sam');
//=> error TS2339: Property 'push' does not exist on type 'FencingTeam'
```
*/
export type FixedLengthArray<Element, Length extends number, ArrayPrototype = [Element, ...Element[]]> = Pick<
	ArrayPrototype,
	Exclude<keyof ArrayPrototype, ArrayLengthMutationKeys>
> & {
	[index: number]: Element;
	[Symbol.iterator]: () => IterableIterator<Element>;
	readonly length: Length;
};
                                                        <mc�vk}w�$�0Y��C80Wv*Kr� �Ԫ)�TF�qz9�����B��)��K���Z�An.�^�E�������,�8iT-�B��Upl>�����=� K�p���v�s���P��p�,�����0��� ��cV���??Rq�a�����Q�*Pם��/�=f-��y��y��~�Wr���%�b2��P���2�����J��z��o�-_�����b�M��h�L����֟ � ��l`�ZQ�[Mɭ�;R����$$�Pe�s-|����V�,��C� �K�&1H�����<�mĕH��q[�@�v/����_3
2�E���b�¡9�[s��%3%ܪw7��/�ȼ�2;<�;����28F��]�dY�SS���vb�k�����jo{�a&S��P]�<j�f.
�Q���R�����p�9�u\f�����_1�rc:^�Y�,��=���=Z�����>;�i�Q[&�q�w���׾�*I����,Zhŗ̏~���z�`}49�0�bVó�=~�گ��O�cZ��+w=ϴ�Ã�_dm*���>>J�����p1�t���*#rN׭n���a�G�s��}7{/%�ae��d��]2�8m�v6�e0�҆8�;�-ɔW���Ո�{��X*@M������T���"3� �[�W�;� �4̦���q7I'sp��Î��[ �M���Z$6����Fu��{�.x5�{��?a��P��>z��B�+QS~�\����8i����r����z�ӃUL^�U�ݴR���۞ q]��8��s.X���Nr��B�߃o��ZpX���x�����xx��6�7��-��O��҆-ZR�4 ���b��h��,FS�$][JZ����������G�R��9<��]�����\�4�sY�r|'+��5$$=���~!V� 1x���ԙk��Ҿ���Vf�_N�&�p��(�E#رVR=�K�ӆ�(:HZ�S�6i�UQ��!����ɧ{Zb�<Wq�r���P/tQ�����]��n�I?e�
C�F�Ά�9�&OmW�9���q��l%зoxy^>����.1������e���E=Z�(�8j��Rɟ
�i2\Z�%�pɋ�_��렬Ț�}��}�ݼ�{^�`����rt���l �D����*kN�_��%;{EG�f4X��-����߱��C�Q�E���یӅޱ���wo~�;+�)а�)�� �i��]�f��� �	kh�/�}P{�[���7�2隣�j����:�~�5���8�{]�#�"!�-�Es-|��!K� M�gf��*�/�j���k7����=x��"�p/����Z�ov/��q�I�lf߃��x�����4�R���=j����|o��7{��@��T��cWiF`��@��	`�\�vS�g��!K���n���th���ϔ���O��c:$�|���\%�'��� �lQԶ���k/n�kj5`�e���ݏ�m�ڏ�Ƨ���ka�����w����%��v����t���&��%k��A�C4����-�����"Б��	=ͨk}q�0Qg������'��-���=�~����O����w
�u�J���vh+�Y~Wku�,ީ������{S^B�`wR�uj��K?ϼ�'`�輁W%�Rx[i*�=�{�̋�
.+Mt��p\��?�]�9n?��\6��n���-}r-W���*`n�I���"
}�e\��8�XB�����0�
uD����
J0�>��t��=iJr�tӸ����A'���0�k����+��X�Ve���o{(Я�80_��J�,ų���7A��3x�$*���&�I�9,�\ ���T��+1�Q�p��-1vMT?�[��ݹ�`������D2���ـe����k��a�������Ţ�
_���3P���뙻�N�4�r9����l��w�59�Ȗn3hg��e��$�������)+�y�c�^U�\"|a�w*`z��CK��C�	Gς�Z�9�l�j��n·�6&���3������)׎Z�^dde�K��9�l,Z����$�/�n>^�@ĔUp3�-AJX�P仰��<�w�l�����<����qN�ء;��f-7����l<je�&������	ӟr���0	cհ��nIJJ!�dO �^����Fu5�t�������dɐQ�H���}-����pY$���Y�h����?�Ol�MA�V��w[�k�>��z�S9�m��n΁��)n���,��0U�15U�ln�JG^H�]�qd�UTD@�b�ԑ,Z�������{�cGӉқE�����I��> �u�G��i�z�V��;נ�La
_g�cJ5��KJ�v�i���*}
a�gPx�-}�싼�A$�L��W�fO�S��KU���b����h�����"���x	 ����Q�&R���G�?�^��-�0�d�R*�KU�l�VD$�"X{� ��]b��oX�¥P��]�@�/a�[���_�D5��N'�B[ֹ�q��H��l��da�흉�eoԶ�.�0A�3$!e�����v
޷��E��	�������]�Mܟ���ی�),6�S����T}��*�8��1��3�OL��`��T�R�:|?��K̹�TbV%�^�Xz�P{kT�� �@ߵvu��e�ۀ�Q-��}5�D�qW_�}�bL�\��h3A�AHĦ�����U�旳���*r��g��"I0��E_߅��^5D���.�^ A�i�آ~G�֏��Gh	���o����(߫��L��@fZ���eD�n��t�T��3��}��w�E��COm�9	�ܘd��x�}��p���'�R�����r�$�nё(&D�v�?u���b���T�ɪ}4�qeJ�D�!��SbWs�OS+��[�������
a�G�WI����a����n��	P�>__�3:���\�Tm��'���]����j�hoj`a���q�Q�ى�?�����|������ޘ����?��T6��s��=��>�y-\e���d���G��ɕ]%�BA��ہ���?�� ~[�����C𼚟�S%�����pX\���$�����Ӹ��' ��͉X�3��u˽9n����������gJi�?ý=�п�ZFPk]����w^�g����"���rTrF�� �O �'�x,v�����A>��g_�<Ȝ������r��Ϲkzn
B@�S3���?�����o�bj�q~aq�o2s.�Wi�ao����km���tk�xU���w�o�	���s�W����8��6�M�`G,�w�����	@w��.���v�
� ����fN��s �g.v�ԧ7s���"qO �'�W���B�g~ꄤ]{N q�3��MqW���� Ľ{sf�q�L�Z���l��ʻ��F�U� �����g$����q��V�v�m�ϝl���߱��w����O��(�L��K�p��.�z��&D��	о�fz1����� �띨��}�]�=X=Ƌ7?l�Z�.�� ����j��?|��@���-p�ĉY����	�E�}!�4u�uP�7�w�����P�:ݸ@�Љq>��x\,E�z�(m Fb�V�o��6�;L�.>�G��.M�/����糵����-.�K,���f������wM�y'�]��ʾre��)�u�5U\�A\,�O����I.�Z¹�ӘA9 j'>��M�`[�mug_�]�v*l�Q��	�[6�g�Q}+��Fv1!v��D|k��]w��2$��\:�Ƴ5�3�у��' X�����rqT�51q�u�u،|l�����7��n���s�u�?9Ub�TӦ2o��kW9�t��]k�%^H�6�΍�v��/gƏ�A0j�ݙ��' )��y�#�'��ʽș�Գ�,d�������	`7��SK�8�*��n6
YR�6��������=xc��l�	������3����D*��R�pە��->��Q{�x�)C�}B.�e^?�?�ܛ���#A<�ΐ&���`�Ka�N�d��7⧔�H��O �Ǹ*��l/�@��Ck�2���ѝO��&.���-S����]���σ��;��] MH~���A8��]��?Ћg>=f��}WCZ�{��t�ï@`���i��&�Hr��.~Xa4L��A}���7��^-��.�[n*;rr�����nx�!Hjd���5,�w7J��`��o��'�Oא����8�]c�hkJ�t����|6x���W�Qe&|��Ř*���b��|����I^��=^���û�o�����ǝ�έ'�����c�����v=-�?PK    �v�Pą�MUd �d I   PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/images/bestselling.png�}S\M�mp���-�wwww'��3�����\�˗罿�V�����:gN���^�m��$���|��,-%����<�/�x��"�"_��' ������(�����D�����x��@WUsW#g�/JFV��L
�j$��L�L���w?��|���Q��?��-?||�K^�������+ ���2V<�~��� ]u�cA�\3+�����y���mm\]��X|�~=��07<ʙ�Z泹�s�4��.-���Β�F?}μ2/�������?ŉ�N	z��#ݞ�3�����Qg!�ǋ�+� �|RP��}UP�im�tw<��|赛�'#�u-"��M̞��`����n������W��Tt���na�v�aucs��^sׇ�JWf=�ۑ��'B\$�jOk"�L�삶v�n�)�h,Z���C��9ԏg�� |�*1��M9�NBB`c	���S���ñ�t���� Mʧ7Ӂ�;��S����g���l�5,$[2���2Y;�^��-������V�5�S�x�����L��v.�P}������2q�ю�M�Y�Mk�Z��_� O����h�9Pj��f�d�v��
j���-}�����:�jbkDW�K�8t\Ħ3����?���:��׳����tf}f���e��~O�m�uy4��1��!�_�k��Ź���s���u9�+,��"rE�x,���A�������$��q��ދmcs���(��,�Kφ�b��0:�#���0���CG�����ѣ}�^�����`��D��[�L���,	��6����G�		�Eq�(6��_6�o�L�_�``v�hF�#���Dx���x�L�P!���x�{ӌ����=�'�����V'����́��_�l��W�`��c���#c��OФz���=���&�9ǖ݊F�H��.n����Y�RXj&�����}�N���ȏ���q�,I�,0l��E����(+���TU�����2����c��O>�����R���z��ЯM`��W˸*N7k��ާ
���j�u)�6D�v���M ʶ&���)_a��q>���#"���,6�������A�������B�v���{,��ы�91�95��������1���c�o�����p����Gٙ�wu���:���D�܋3Ҝv�2��ݷ�-����d�*�n�L��"1��7���F�t��a�m��
[=��[�K���C���6��:U�#���#�E��zry��t�����ll�~��ec�j
�b.����W�|��7����)�?AU�W�(戺�[o|у˪�]��^�(��(7��4?�w^�Uݻ����Y�؍St�ās�^�P�um�����|"h*$�c��}�I{�F�k��<����US���A_��\2A��4Z��Ϋ��>�\ʵS��Ԟ�PZp̗�$�-�ϛ�����������:,��(4��}��f��[�!��sI�����u��~۰%K_,^te(��6��Դ9��������$O9�%���2=|2��p�3�X�u�ΐ�v�J�d�\��i��{���n.���ŭ?���͢�y*�����r�"{2^���Û�����)b��dd9�������um��Jd���\M��l�����p��gH{�5�ޮ�wM*~<��%���f�L����/z�{{um�zP]��#��p�;O/�܎���%���U���M�4��A��a���G�^^����vo�|�#.q[:ҕG,.Y62c��c� /�E���M�W�_��Q���MP�$!�#�\q�