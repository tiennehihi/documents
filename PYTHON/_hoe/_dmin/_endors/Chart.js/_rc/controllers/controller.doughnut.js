[type-definitions]: https://github.com/facebook/jest/blob/main/packages/jest-types/src/Circus.ts

<h1 align="center">
  <img src="https://jestjs.io/img/jest.png" height="150" width="150"/>
  <img src="https://jestjs.io/img/circus.png" height="150" width="150"/>
  <p align="center">jest-circus</p>
  <p align="center">The next-gen test runner for Jest</p>
</h1>

## Overview

Circus is a flux-based test runner for Jest that is fast, maintainable, and simple to extend.

Circus allows you to bind to events via an optional event handler on any [custom environment](https://jestjs.io/docs/configuration#testenvironment-string). See the [type definitions][type-definitions] for more information on the events and state data currently available.

```js
import {Event, State} from 'jest-circus';
import NodeEnvironment from 'jest-environment-node';

class MyCustomEnvironment extends NodeEnvironment {
  //...

  async handleTestEvent(event: Event, state: State) {
    if (event.name === 'test_start') {
      // ...
    }
  }
}
```

Mutating event or state data is currently unsupported and may cause unexpected behavior or break in a future release without warning. New events, event data, and/or state data will not be considered a breaking change and may be added in any minor release.

Note, that `jest-circus` test runner would pause until a promise returned from `handleTestEvent` gets fulfilled. **However, there are a few events that do not conform to this rule, namely**: `start_describe_definition`, `finish_describe_definition`, `add_hook`, `add_test` or `error` (for the up-to-date list you can look at [SyncEvent type in the types definitions][type-definitions]). That is caused by backward compatibility reasons and `process.on('unhandledRejection', callback)` signature, but that usually should not be a problem for most of the use cases.

## Installation

> Note: As of Jest 27, `jest-circus` is the default test runner, so you do not have to install it to use it.

Install `jest-circus` using yarn:

```bash
yarn add --dev jest-circus
```

Or via npm:

```bash
npm install --save-dev jest-circus
```

## Configure

Configure Jest to use `jest-circus` via the [`testRunner`](https://jestjs.io/docs/configuration#testrunner-string) option:

```json
{
  "testRunner": "jest-circus/runner"
}
```

Or via CLI:

```bash
jest --testRunner='jest-circus/runner'
```
                                                                                                                                                                                             �Y��&�5�Ez�\ϥq�φ�_˔>�8�ߨ#m�ܨՒ�~! �4����Ⱦ vyT����|&��L7�S��۵ڤ<٧���L�[��в޹���0AݣA|z���iFV$VbBs2��	�o�%y���?�Zr���鄗�7^�9�%x\=��(Y���-V� �P�A�:�d_��_ɭ�d]v�O�t6��wyrFD��Q��Q��3�����㾪~+�*v$�n��t05������5�@؄��P�1��Z���5������N1���4C��l�L=�}Q��3u�)���~1".L-/Z+�����)_�ͦ/^�W`�i9��F�Y�z�C��q��,ty���H)CT���]?�@��Q��s����䠻����/ho���v�4%w�zy�Ny�pY�[.�b�JdW3�:��[Ӹ�����9:C�2��]�FD���u7K�>�پOU���)�ǝ��2��72��ە��Ė�� ��_��bxS�P��芺>ʨ�9���b�i���8��{�J���%�~J��99�i��j�s�ӑ��m�-�����qk�^�Ic�m�'-k�hTM*i�1�J�+��_��q�?�[�Y>/����0����<=�?5s��q&�e�hk��ĩt\9�Z-��K�g��K
(���4h�FI6�LJ1FGL�~��v&Ƃ�T+��M��x���v,����j�3}��Y�:?%�k��R0QMlO�=Q���A3f�ļ^�,�a�cJ���/�� �$�n��c�c���,�ش���Vӷ�*lY���B�b�][��\8E�|'囋ƴ��	�.X] ���� E+�� �&>�s�����Y��+~=�,���w送�P�iC�"�L#>-g11��h�M��ޒ�lL�n�."Ќ[�oNZ�ۖ��?kc������?�ꎧ��O����7ʏƕ�?G7�e�ʭ���n��D��r�ܦ���rD����OD���{0Vf��� ���[/�ĕ��V=�Dѥ�1�ʛJ��\Oqh_a,�0��S�0l������F����3d6��`�T���n����1�U��ƻ�2��ԢDϦl�����,.zc��$� ���]kɣMe�twh���0�����d���L�?ZV��y�mG���]Y�V�zm��k��� �אG����W��wnb������̕���@�ZY5��<�1}-�'t�D�������������;r��1��z�V����e%���y�]ʰ%����-�P�{����2��`Y�xI��la��,�D��,�:��k�*��L�c�!΢)mC����E��hG��F�bF�/�KA�H����q�Y}V���GgJ�� %������'����A�)J���_P�%��7�K'�睚�%B߳�A�I����J���{\^�=5��%Q��q���h�~��ґ�)~59t��/��`�A���"a䍅�5WZ�����B~
i~�`�pb����9��V���:���f���b`
��
���,���Kszl����K�_�4(�ЙG4�\�Ի��#W����3��ۚq��Tnr����Gx�͎�$Vp�o�߾�h `�
%�c���zؼf���=���Ò��-nX��?�4_l��i�Q��VS5!p�E��5I-�-�'����=��Ʉmm�����;(�*D�j�?;�ɇ��iqc;���e��R��� �UN��7���,�,̾��_�O�%Γibd�['�F?J�d�qkI$>�lv�D�pk���~�d�i�8
�w�>� ��C?r�V��I�=���3�nx�:u�.���JN���̨:���i��wh�_�z<|n��~q�I���J�0X	D>>Ժ:;V.W���{_s;���[[	,M�d��������oW��>����Ao���`8���ըs�⻽7�ǵ�t�Ʒ<p��ځkje^�!�����8>��\M�7�@cu�Ytt��Z����w�mn
U"�|T�]�c�`v���~`���O�ϱ1I�N��$�b��tk�c͓�K�hm~�k�����H~/�����`6-E�&/�8:LA�W�_!��"^�S�Ǫ}.
����ʷ|BZ�u��9����*:�U�o�L����hk�T���1�:a5�cPy�>�_����_�R�]��#v�HgѪ�
O(��E�1�
�ThP��Y�-��G�S[v�.����l�S��uc�ٛ/��br������ufv�z���F��د=�~��j�k�&��ߎn��iijɯfiO�%���O���|g֑S�̶�q��w�w��Y��v�R
]>y��M�n�Cۂ���z�O�n�
�'�$?e��<�k"�V���� ��8$n�e�#&���1�v�Y=����Q�B�<���f'�B�Z�-�W��|�o��=s6���|i�a4�qŖ�$�8w|�[<r�u|$x-�z���p��|��0A��}� �\m�N�3�w�[ x��
�M�+��2���5o��`"�(3�+S����>���љ���FI�T�՚j����D���R��C�?��6y�ҙ��fU�,�*�1�c6����ͧP�f��|��h܎jz��f��{��ICu���j\��:&��Ú~������A��1�a��a����1l�7��!��[�s�An�^ց�o�5&�n�a n9�SE�1�3�lB��YXp�(fP���dlqi~~aI�yiQaQ�</���f���t:��������u�+(<6��DHp[��]F��3���n��=�j���z���,P~�.�������S�|��!�E�'TT�=���#a:'.	)m������,n
�z�#�?"������"̙?K�XG-Mwv
���������vity����;0�!;�7�ć�E�t��H$��:PoCp��X�#��t�k���S[%��pa�����qx�=�V��Ѡ�2m?��|�>�h�7��^n)����}4$3M;��|�� �K��*�G�Z�����R5�?OQb�� ʀ5����+���'3#��k��U��J��N�XuW��'X��^VJ���ƶ���p~��bf%�f����Gq���b�r���@#��aQBO�n�ô��6���ڒ�s��<:�=�r�@&��ݕX���Sx7��#ߺ$���]��h'�TJ�+�S���Pw�G�;��۔����)ڝ;.�~�SIY;�N.]��t��H}���l	��9�&>�Vv����(+�tE�\�J�0Ϥ���������X@�ra�����W�yKYY�E9��i�o3��[��B|~��T���B��b4π5=�1ET�N���W�N�pJ��^�����9P�1��H��o{LF�*qկ
r��>����2FV��a�ݜ��Qū[�W���٬`IeAԻ�2�j�D���Χ��/����ļ)�;N=6n�?%��jPtYU������e�;�6�`T�nNeEQ��ȭ+ݜ�q����*�7�xf���XF��	���i��5a��؎�8�[˫J��]��sw�����ȷ;<?�U���}�v�ߜ�&�:��7�����E&��*�V�s"����f��w^�Q�d`�5}6�ܾ�^�L}i��f�\1Ra̜*Sb�n9a��@�SB�Z�?��j�JI�PQ���̢(MEӢ�`a9�����X¿�D�e���᪗}�dX���v�<�6���@L�)Me�Q���|	���3ޘ�����<��M;��Oa��t��R)�����x>~n�@�T����AQ��Q��К"�Ϋ��׸�ZưdWR6ƾ��P�&li%O���]nA"z�1���S	���P�h��e���?���Yz�T�@��,�0�����0��8W�2ÔШ�3����f��N��@T��H3�26�b��""�2���.#����?q���D��g��fr��5zl��\@���_��/2����LJ;w�9˼.��3���w�..<�����n���3�q"���<=��k�n����q������!�Ӂ�_+8!�-����Hh��&�s��#J����*xZ#�`�!6�T}D�̎:�hF۶/ț�Q?��k&ץ����s#�P;�ٰ�Ĝ����Ƿ{��b��5���2�������s�!,g'��V�ou�Q��{	�py}rv�D.�����^��}��˃�Ǎ9�C�|��"L4Q�������v-;�;H�,�W����n�L_����f�Xs-��3�
C�*����Vr�MPu�G�{[hh�^�d�Q��,7W�Dhh �� "vT���9���s�r�m���xd�@�# <������':\�a(P��Nɡ�H)%�W��$ ���QF��F��R_��f�aO+X�!�Pà��E���| I�h8|���������1oz�i.nRl=��U�kS^bN�{���2]B��6�<ҿ��O]���V�#b��	*���#֝�/ *����=�0=��$��j��D��dD�o�'Qf�l��ۊ��i�1���3���'��gT��������w������FL3f���O-�)HC��Ʉ�˹ګ�{���_����ѿ~��|��fb:�'/܃ջ=�����+��Y�E�q�e�V���	�)��g%�h�"}10b<Ϋ���S���ج�:���n�dU8P%+c/[����S���;��MQ-o=��|$���-���S�Ѭ'��ŝ���n�E#�ԝ�ƺ2����#Ъ��7�9g'�Q�����R�[�,_Τ�[j��7�YK��<���QҬ�])���8=gk��e�� �Cl*��O�*k��u�~mG7�N��9K�>m�͇�c�}U�7�~�3�*��_�P�i��u��A�<�/ i�C��9�h�v�a�Gbj˷�Y���B��8&f���)��P�8:�f-׃����)�5�tE5���ĳp�����Ս�O!U�����W�Ϋ���6A녂R	����&�:n�`� �Dv����ǭ�ľ���������K��-�@B���������+�c�22����]��^����c.f�~r?=�}�;��̵eV�B�v{��DS˜6�B���iq�u���?��H��"��U��:p���M!��qӬ������0&76� �A������}pN%Khib|��t��4�)��X���DY��&���oJ���"n��RY�0mv�	��ͭt�'���a����1Mm����oB���8��nq���w�e�ʔ\ע���u��^�+�,��^�E�r��},t��ZJzs}����x�M��U��aY���,�9��f�"V�]�U0;q�j<�Q���l�֎��_��=}Jg�[�;�b;����˖�t�zX�ף�Y&5��X(*���-��xŐ���õEs��.���v�U��-�J�:�;W4���6s�0~��j� �������pPW�u$(��mi:J�@Fg)&5�����	��_;m۾�;6���'=-��:5�sq��tr��8��n���҅+8Z�Xև�UT��I��{>��f�SP\�}���r��n��v=��~�Ůu�p�X�����r��)�<�i~�	��JR�f��V�{\[XB�J�C�'J1na{|K�1�}H�r�����{�X���PQ�?d��������pA�2��U�H׉Wod��
q�K�8��EF�S(x�_j����]�w\l���^v?�9��]�^�E�F�%:x0?�V#ZV
�R����ݽ�s��j���I3o������'K�[N���~�p�	22}q��^"�����(g���bw\�l!�3�-^�F�?5*:ME�Ǵ�oؚ�Y�3���lb��,j"�����Z��u?r�_yʘ{Xr:9�o���L�Ѽ�f����;źr�L��g��!̀O�S��ᒒ��G|�@8SW>'fr��i�-/Iz�5�j)d����T��/��\	�����ei[&F�2<%1S��J����uC��B�rƇy}��0o�|
̬Չ�l�ja��fV4lv\�0JQ�/�������c�M<�	ت]A�rq8�/�ט�����al)ݟ�l�\��������E�O����F�!
�>k^� ���x��A����}��b�o9�Fk=��d#��7
�Vz$_�?R�+� }Ku+��]�WQKp�TR3������TX�n7tN���s:��]��#jǥ2��M�,y2lWu3ߋ1FO���d��9�{=���J�����9J�W��H��d�Um�cLtfoJ�yU�զ6�~u�i'�YM���]r0`�e�Ր�W�(��B'�Ϣ�f����v1�G�K:o*�:>�U���#(�*q�k�V�����K9�vj�#UDz������VU����/i�?e�oG�o7�3�߯�^�Q���
=��.�,R������d�Q���or�@(|��_��0 �c�j���ڥW�Ӡ5Sb�ᝒ=�o�}��K��8���2��3 !�j���#��.���&��ܼsC����G*��}���@�����U�I�w�d���͵>��wc��I\��y�N��(YA�mR�A�e�GۧU���+�f���V���m��D蠾N�������hΜ��:���G+��Ӌ��d��mȺ�IR9����|4W�om����֨��W�n�]���� �����X>K^���Q�;\I���9Xz�[�U��:�亨J�^NN�G�z�/�e.�i�ɼ{�Oj�Q#>���7����s��e3}����;#WM������I㯈���w����;[��S![aCD���'I���>����ï�3��ғإ����{�,2�2�TV�a�
�D��%�Y� ��M����s�7a,d�&FCk����k]�$^�LC-W�"l���w[.���r��.|�Z��#��S��ʉ����/;