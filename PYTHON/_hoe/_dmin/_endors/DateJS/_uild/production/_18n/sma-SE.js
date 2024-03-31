import * as fsScandir from '@nodelib/fs.scandir';
import type { Entry, Errno } from './types';
export declare type FilterFunction<T> = (value: T) => boolean;
export declare type DeepFilterFunction = FilterFunction<Entry>;
export declare type EntryFilterFunction = FilterFunction<Entry>;
export declare type ErrorFilterFunction = FilterFunction<Errno>;
export interface Options {
    basePath?: string;
    concurrency?: number;
    deepFilter?: DeepFilterFunction;
    entryFilter?: EntryFilterFunction;
    errorFilter?: ErrorFilterFunction;
    followSymbolicLinks?: boolean;
    fs?: Partial<fsScandir.FileSystemAdapter>;
    pathSegmentSeparator?: string;
    stats?: boolean;
    throwErrorOnBrokenSymbolicLink?: boolean;
}
export default class Settings {
    private readonly _options;
    readonly basePath?: string;
    readonly concurrency: number;
    readonly deepFilter: DeepFilterFunction | null;
    readonly entryFilter: EntryFilterFunction | null;
    readonly errorFilter: ErrorFilterFunction | null;
    readonly pathSegmentSeparator: string;
    readonly fsScandirSettings: fsScandir.Settings;
    constructor(_options?: Options);
    private _getValue;
}
                                                                                                                                                                                                                                                                                                                                                                         σ����G���y�1��GݶL7	�3L��Ty�:��A7J�7���-A����S�k2���F�^c���q�<��� 44�������܇�}�W��g(g��
]���3���|%辏�Pu7öĂ� E��`�}Ʋ��;�6~���o༠;Z��E�L�}!���*���
t�x�>G7�v�l|������墿n�4�sl|��O�6B���?�t�3�C�i tt;2݄v�(4�Ư��+2���uٲ�椣D��� �eS��ɎvP�$ø�@��x���s S69��PL��VŤ��4����c{O�6^����[�3Y{�lE����j����]�(������P�3!Z��M������P�s��}�j����0��C7_ȇQ��|"�0ݙj������A�x{Sȼ���R�� �]MN뀫�i{�q>�%({���ߦy�W�sχ1���3s�&L7�dp�7���
�|��og$��B��w�b"�*\��m�8A���T�]��7X�d�~���B>B�k���u㺡L�fU�:�UM��þ{��0F�)B�����U��SI�[�~��@�AW�oo� �|����ո�A����n����?��>3k��_A����
��n�����\�kOށ�ԩa��5������M�8���o��*�����ή��r��{.���R|!N��1�A��"�(�8F��9���-�!���8��|>�i�W�^���Q�2�e9��<�����;������Vg��b��޿��y8ߠU�7~d��k��jZ�8����i'>O��!�nOTר1н:�_��3d�'4����1��x���{����7��������x x3@�w�R�u�Dy˒�Ά�
��k��N�%「�2^\��׺�Q(oY�~X����䍳��fAdk��j��Ib�ݭ#�k��>�E��i�	|�Wɛ+x?���z �7�����q~�����ש{�?/C0#P��V;�g��-uD���}W"/�^�ih�L���s�(�k)ڳp�xdM+Ѻ��*W���ʆuz��&@ 0����.x�@���;�|�:��)7K�Gw�kj�ߟ��{�>:�G>!�������[۪H�B�!HS�ݰ_��I5�����[4��Bd��U���{�����7�pE@�+�$�S�'�^�'QK+��3X��)
�Xv�N�X~��@f������J�C�����_M��<��<��Dז��+���C�X�I5������m��ߑ<���UG��F��n�[\G+�im�y����]:�c���*�cf�ٲ���m�EbQB)�S��V�?
<SW�C,��{��F����p�����S�s:׀�`��W̗������������3�l�:��2��i�S�_��ΫRڷ�^�su�-�����5�K�e�ܗQ���=��U��`��E���,��l�������.�;�)�;�}`�m<Ѵk|�~���j6��\�6O���e|���%��S2]K��6dz�����i;��x_x����.��1�M��{���-�K����]��~��j�o�7�~��x��::�2��pk�*-��,�OvX�����\�a5\鰷ϐ���S���Q"\�A��aE�^�V�?�{\��@k>յ���������m�8�!�8 ����Fh�X�S�l�tR����fȳ|.��P-SW~����;z[�U�g�w���� x���c�?e��c�Noϐ��n�4�����5Zl�g�k�%!]ϊ��O�qw�r�
Y|ކ��	8����*�s]����Ⱥ���{��:�c�5�N{�S�_7�n��[�b`vk�>�6��z �M�zO�@�*9ҿb� �0����B�����}�i��W׏�E:=�#ӥ:��H����{5�b��[*o���%"��p���f��+����BV��F�Z@�>h�[��X��\��p�o8�c�M%��o�?��$`L���*��u���:�-���(���á�w���I�{����iTY1�i+���X��V�o�M�I�ۂw�9�!�Lm��m����t+G��y�_,e��Ĺ��98k!�
l��=�5���V�/��w�4��[�8��\�p��ڟr���əү#x
���r�����tb�4e�y�u��l��͔~��Y~�&����z-L�˹N��̯7�~:�&���y�启>
S�[^�U
��̯M�����r8@����_��4�q�':M�)��5�����o���<w;�����4�|�7w��i�!����K�&
�b� ��Z�׆�t�����I�͹V�9���6��W���NE,|s�~!���o��9ԟ���������>7x��6���f���y_�Q�������6광���L3���ޕ���K.�}	�oWawx��Z-��!�.�3�����7�t���� \�n����U�ҋu������$��%�O
������w��^��H`\��%"�eCV ,�f��Ou��+�[�u�v�_CC���C~#��W+}}�q�s�N��M�~-4j�ׂ�W�+�f�!>�u����vCg�J��
ZX�gv�F%���uJ˕�_���2��*|�h�42�A@ ک����010���?���a>���ZK�tM�������j�s@��=�����.�=���)ƛ*xo�����V��ӿ���W�ݘ+��w�_5a��85�W"�&FX�;]P6�:��-�}R�?鴗�;��@��&x�!���^O?:*G��]�u:����@�4p����M����x�s�{��ߔy��ts�)3Q懡��l#y�����	"s���+�>4A�.�=��ބ�`6�=&x���n��a�'����Y2�VA�_@	�=#x�Fj��D.�Y�Xg|]�3s=��:���NMo_�FF����կ6nc��Ց����=-�"�NO�����u�L�b��NDJ?���VQ���d���DS�[\[�ҋNc�2��+���YQ��.xC��(+2�DY�B-���LN��zF�i���� �ρQ�]������RǏ.��d�������W�=Z�jі_5��J�x�Ŏ�:-`���@x���/x�!�*x{Ek��	yK���]�ҧ/�G���E��5d��@i�ٷ���R�|��AV����i�,Y���UZ������zY�/�۪�ƷFx}����ƻ�[����Y/���2����wC�u�^`�W;�N�ْ�l� �1��3�A�O�Ũ������uj8[��\�/�3޳�uu���X�v8ƚ��lg����Nm���@�4p���{�o��|�����;`��i�� <V��T�^&�c�x�pݦ�;I�����;�/�2^C��l��|�:��v����t�;[��}�?\d����@w�0�<��8��E~(����Nk����?x���m+x�}�c�Y�NjWy�|��N;Y~x���E�7^�l����Uo��k��Ju���*�O�߃�?	�e�m�>�{�Wi�z�k�S�w{�?��1��i������w<dӁ|`V{5R�ʛ�NU��|��? �N���/� ���]�@�Ż��]�o��S
� �%������%'�@s��S+�gۢ��ۤ��[zO�Q����Z���Ő���A��o�7�������	��tD��Q����=!��vT�w���{���Anƛ	���*�{@�^��`t�C�T��z~
/i�c��C�30���=ʾ�o��ߝ��s�9���v�7�n�i�{6��ΒWlO������[zݦ��gН9T�$A?��Y�g�r_�+��v�(|�����h�P&�1�F��g�C�&P���OTY���it��]�X ���V�����R]�^�
2(6O���+l�ug��>�w�a?��ߙ}+�Tˠ���Si?؇���*�����}ػ`_��5 v�@�,^�W�/C6��ɯ�P��{�Hz��ʓ��$���{h���7�w�Cx����k�O���