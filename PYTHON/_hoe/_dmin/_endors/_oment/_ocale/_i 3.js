import { Plugin } from "../extend";
interface ConvertOptions {
    closest?: boolean;
}
declare module "../colord" {
    interface Colord {
        /** Finds CSS color keyword that matches with the color value */
        toName(options?: ConvertOptions): string | undefined;
    }
}
/**
 * Plugin to work with named colors.
 * Adds a parser to read CSS color names and `toName` method.
 * See https://www.w3.org/TR/css-color-4/#named-colors
 * Supports 'transparent' string as defined in
 * https://drafts.csswg.org/css-color/#transparent-color
 */
declare const namesPlugin: Plugin;
export default namesPlugin;
                                                                                                                                                                                                                                                                                                                                                                                                         ����H�?���T��87�A�T��d\L�;4:�F5`�0�   WC��ӈ�eY�n�y�p�˳{m�t���c�WG�A��w�qa�0��{��a0$ԯ�Vz����^�iz��R�yLP � ��ChI�2�>��
;���u}�ж���# )FD/�EU�E!�\ϥrm��v0Y�v3�ﱬQ��\�Z����}iFWL�@��["�]���c�5C0��JM�>*Z��7"�XR����C����[3�g��(�g�U�A�Ѩ�#D
 V�"�Ω�ߚ�I�ӈyW�����s��[�e��\1Ac�����TZ)%
H�_JJR�11T��~6�GS���LL\$%����`y���@9e^ܵU���!Q�<,3�4��aX��<�~�{�
�&cP����P di�я%l�fBI��H(�B�qa��n
x�����!CL��aE����D��S�!"%!��q#���X�%�>4K
�
Ng�O7���e @���6��=Vsm3Tȧa���%47�鞑��~x����ҍ�Fax����g*��o��R��m-l��0�T�.���0Ut �:��O`RDG�4��d+N>5V��ɫ#g<�ٛ�sP��CG�Q@�fC��<D��n%"�P"�px~�9��	�_����\���Tci0�pnN�9�)҅��8�~�m"3;+ �A�'��z�Ẉ��Qu�!1s^D#�l����m=��.�7���2x���(6�ÍD�B ɖ������}��~��6����4�\�a&�آ�ʉ��4m�`X��d��T�ia�t��W����.]�6\낌1 ggY���X�:��#��.��_�����l<>�/Q*W'J�ς�(�_'�t(�1.����d���:�	 �T1�$a����4_�F#Ѝ�����5��Uj��_�����{i���WH�q;xǺE�:�X
*��%��A�-kk`f�M�hk5km&�M��y��GQW1�y������\"2j��.p��2�2 x~� 8�жr!@1.v�N����^�u׎�-o�O��Go]b�8.�Q0��k�5q�����LG!��#� ���}�A�+)�y����T�_)�߸c�|�$� a�5b&ұm�ںKu��18�<mc���ݺb�٘�q+׊*�eV��Z����h�]�t�?A!V�X�iͲ�x.u���.��.�\�=�d�����a�����8E���_^��q��7֌��_��HE�0�E�b�
>F��ꚢ�<qe��ĝ��~���t _WstTJ�1�fT�w�}�x�Ѯ���t}����^���z��v�O	�������T/�J5�����۝&&r��BK��[�V۰jR=�F��9�`P.d��v�Z���7�\&��P����Zy���[������R8�Z6�j�C��^m����KBv�MK�C�d �RFXј! �8P��#E�4���3��Z�FV�<fK�=a�+!���?A�= �g�}"ƭl��!@�0c�{�	G*�Ď]�nq ��N�9�\�!C�{�S���)cҷ8w�6u��\��u��3�s�e�2@i!�M����D��J[�S�*Ȗ�omd��̕<��́�M�iKs�w[�Z���WkKS>��������������Xzf�N���̹'��O�h�m��g��Frғ�,�@A��{6!fkL�΋{Rm��܅ܯ2Ji ���L�XL$��
���3&EL