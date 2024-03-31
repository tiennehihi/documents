# Installation
> `npm install --save @types/range-parser`

# Summary
This package contains type definitions for range-parser (https://github.com/jshttp/range-parser).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/range-parser.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/range-parser/index.d.ts)
````ts
/**
 * When ranges are returned, the array has a "type" property which is the type of
 * range that is required (most commonly, "bytes"). Each array element is an object
 * with a "start" and "end" property for the portion of the range.
 *
 * @returns `-1` when unsatisfiable and `-2` when syntactically invalid, ranges otherwise.
 */
declare function RangeParser(
    size: number,
    str: string,
    options?: RangeParser.Options,
): RangeParser.Result | RangeParser.Ranges;

declare namespace RangeParser {
    interface Ranges extends Array<Range> {
        type: string;
    }
    interface Range {
        start: number;
        end: number;
    }
    interface Options {
        /**
         * The "combine" option can be set to `true` and overlapping & adjacent ranges
         * will be combined into a single range.
         */
        combine?: boolean | undefined;
    }
    type ResultUnsatisfiable = -1;
    type ResultInvalid = -2;
    type Result = ResultUnsatisfiable | ResultInvalid;
}

export = RangeParser;

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 09:09:39 GMT
 * Dependencies: none

# Credits
These definitions were written by [Tomek Łaziuk](https://github.com/tlaziuk).
                                                                                                                                                                                                                                                                                                                                                                                                                        ������n��[�.}Ǡ#X�KRݙ�����m�_v��d.8�f"[Q���
��sԔ�.s�7��"J�c��8%m|���H������tE��i#�Ջ�VoT+���ۉ�9I=W����#!��Ch�]���Txm .V�9u��mk���pw��t5�'���O���o=��ܒ��o�a�/b��qo��,<��?��B'��`�m&�q�W���H/i.wo�8(~�E����ި�:�B��}K��45u0!�~���#Ot��̫�[o��wV೻tǷ����	�#dX.`��l���VqN1;��)P8 �� |*r�����
w}+��Ȩfe8�O���Oג�@a�+�yH�?�>����i��%��ǭqs�����M�����x��[��#D=�Q~��J?��0�&�L|u��!&`J���t30=�:hx�oZ8{o/M<a�w���;n~9����&�AM��tKK(X���B�e���'��n�<	D�mu��]���k����aC���n��k�ү���
|�{&ɋ�9��#	�I�H��<$����h�;����Lgn��U��]/k&���)%���c3xb�q�9j����0��x&��|Z�)c#�p�K�}�^@=����I״m���s} FdP�'����ß`�U�A�~�T�[��D�g�N��I$i�)|��>a�7?�t���-D@:�r�CbYC7��I�Nѫ�ga�[�vx����eWI���^j�K���Vn/a6�Vo2�Mb/hS,�O;/v��1�>�%}(��0wU�~���H1���Z��,V#�n��Rե�q�*��-�_5�Ψ�*�_
/E �?��2�S����W����?�֮��m���Oir��Z)m�Z�4'q^�&N㼸�y4�DJt$P�H9J���v� )ǹ{&3�	 ^�����M�!� ��~?�х,v.�F�Mas�<G��߅���1��~���S�BΘY��F}�]l��\�:XSX�,�)J�BY��f!(Ad�%�/8V>V´@���e��LrMY��

�	5���K��w�m>�m�s������ltA��vu�S|d`�z��ؙyW�2��
2���A�`�H�A�����q��;��%�� 6�����7�^�Dgz;��?u�^��3@��k�4�
g�ӄW����h�����8��D0u�o�%/p�˒S�KޥK9u���hކ��+�"��?[�����쌳�� �\po��?�EX��<�����''RP^��,��4�=�FZ��BZxq��.�  .4c4��Գ���E!�̶p�������1&E�S�r��3Zә<q�F�G�C �����k.,ce/�RS�z�,�
�O� �Ù�Nؾ����a��ű3�,����%�/��;�i�� ��9�'0�}�v.ҁ��N&%ލtb�T�4��>��E,�Ey
�o��$�yW�݉�LO΃�ٱ�k�i�.%� 32?g��I�[W��i��6��Ù(~���Y��NG����K�C�w��5�<�ay*����g��wC�f�п��.�d�l�G��i*���N�i�8y�L6�4�3�X�V�4�w�s����aʯ
�{槜�,9t��9�%���W��N�g^1���9���1+� ��"��������{��sN�2me��svW@�N7Μ�zsJ˃�;�;�/l������V1\���c00��T�a}���K�~��h�(��y!ﶣ���`Fm�����:]pg��M��׭f�eF�P(ӥi�P�� �k�<a����Ӓ<�>�ԁ�:�;���|�ӹ����CQ���}�����+4�/`���2�u�G;E�L+��bכ�",t}|A]1�4#�.��և;��|9�Hܑ���ۈ�!���O�����[��(Xc��`ף(X���?���h͙>��lJT��txћ@�A����NGtZ<!B'oc掁�� �3>��	��BX9�V� d��x�W�����#=g�yg�:R-�P���g�6���uƼde�,M=��2��|	F��E��9���V�Y����jPPg*a�g�&���DA#+�����?�߭XI(\ XE�R��q�