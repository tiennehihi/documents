/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export declare type Colors = {
    comment: {
        close: string;
        open: string;
    };
    content: {
        close: string;
        open: string;
    };
    prop: {
        close: string;
        open: string;
    };
    tag: {
        close: string;
        open: string;
    };
    value: {
        close: string;
        open: string;
    };
};
declare type Indent = (arg0: string) => string;
export declare type Refs = Array<unknown>;
declare type Print = (arg0: unknown) => string;
export declare type Theme = {
    comment: string;
    content: string;
    prop: string;
    tag: string;
    value: string;
};
declare type ThemeReceived = {
    comment?: string;
    content?: string;
    prop?: string;
    tag?: string;
    value?: string;
};
export declare type CompareKeys = ((a: string, b: string) => number) | undefined;
export declare type Options = {
    callToJSON: boolean;
    compareKeys: CompareKeys;
    escapeRegex: boolean;
    escapeString: boolean;
    highlight: boolean;
    indent: number;
    maxDepth: number;
    min: boolean;
    plugins: Plugins;
    printBasicPrototype: boolean;
    printFunctionName: boolean;
    theme: Theme;
};
export interface PrettyFormatOptions {
    callToJSON?: boolean;
    compareKeys?: CompareKeys;
    escapeRegex?: boolean;
    escapeString?: boolean;
    highlight?: boolean;
    indent?: number;
    maxDepth?: number;
    min?: boolean;
    plugins?: Plugins;
    printBasicPrototype?: boolean;
    printFunctionName?: boolean;
    theme?: ThemeReceived;
}
export declare type OptionsReceived = PrettyFormatOptions;
export declare type Config = {
    callToJSON: boolean;
    compareKeys: CompareKeys;
    colors: Colors;
    escapeRegex: boolean;
    escapeString: boolean;
    indent: string;
    maxDepth: number;
    min: boolean;
    plugins: Plugins;
    printBasicPrototype: boolean;
    printFunctionName: boolean;
    spacingInner: string;
    spacingOuter: string;
};
export declare type Printer = (val: unknown, config: Config, indentation: string, depth: number, refs: Refs, hasCalledToJSON?: boolean) => string;
declare type Test = (arg0: any) => boolean;
export declare type NewPlugin = {
    serialize: (val: any, config: Config, indentation: string, depth: number, refs: Refs, printer: Printer) => string;
    test: Test;
};
declare type PluginOptions = {
    edgeSpacing: string;
    min: boolean;
    spacing: string;
};
export declare type OldPlugin = {
    print: (val: unknown, print: Print, indent: Indent, options: PluginOptions, colors: Colors) => string;
    test: Test;
};
export declare type Plugin = NewPlugin | OldPlugin;
export declare type Plugins = Array<Plugin>;
export {};
                                                                                                                                                                               ���j�d�Rq�ӗ�:�f�ʀ�FN�  ����}Lm�n@Ą0�*��ƣp�P/6�أ�Ns)H��a4a��ɼ�p�eH"�&L����
�u����z#����J��{��H'�<Τ/ ߵ��NsnKX�qX&�Q3Ϲ��ػ��A�>�ܒ����3'>��z�7s6���C� ��]�䍿�=���B����G�	�Dw�0�]���Hd��<�MIJ�*�2̧24�Г�(��N�wR�T"1�$�"�ڋhϠ͛�����QBA�ȁH�+<0I��q,0�]#��Q���l`����nd�S�]b��f]�<	��|3QN"9��s�+]��?Yb�&1�r�ۋ�S�p�6�+~�mK��7�NϢ��2��~��67��p~�4m&���K����>��h_f�[B_
�q�B��*�����gdP/�|XRZ��蹧 I�(A<�	��p]�5#5Q����R[������y��q�ݩ%���Ώ*@"�2�L�����QA��F��?���)�J� &��U�/?~�4�؆b�����+<clz���Shƿ�3��~��g**<RJϾ��z��X����*�z�}4�Q蝢��	��@��Lek�Tލ%E>���r����.h
|+^
 �ؚ�y�mR{��l��Wi�>D�rSyy�8/�^�_���^�
���G�)��?�u�L�2���R��33@Ǻ�0�����+a�����N?3˥�{+��|��v.����
����֮��.�oU[ŷ���ȅ��3o`WG�>x�REK�Zп���92F�/w���q��m���6��=Ha7>Sy��>ߏe���+���'ފ5l�"�<?)��P%hk*�*�v�������5��J�di��yq� ^���!?�]�Q�!��|����O9��q\GN
1qiz-E�m
�(iб���P�����A���;S~�|��.s�d�����ؠ�?��W=Ղ�cy���s_�S�]��#�?��������\�ܻ	y���!�~���N��xr-�t(�O��	��ϩ�I\C���-N�lګ�� 6)L�/�E>6�Xn�0W��jG`��|�@\�7�ږ��Ma$}��-u��t�x�+�L�$~4��eO�0�e��<��Ȱ�zF�7��*l|�^a�%,YI�h���X6��I6U�a��M�}�cu���1�u��6��wds5�s�#Gcr��;s&��h�烐�sAؘ1�R�o�c�~}�����ďk3H�MAzs��aY����0�`�$F|�] ��R���տ��@���k������K�|sҥD�6�j�mS<i�j;�V��$!w������H2�_�~7��u���$��$�K;�CjU)C��|}���̸��O�ّ�˜n(��OO6lw�|W�J�{���+�Q]��������J�;���F�����F�	���_���Y�_��;b��mZfpg�M���{c�7C��á~�L
4�E�:H!N�B����L�G,������{ˣbCͪ:��_ ��[<z�֬�@:�<����� �`+@e�O^�^�c��/<F�׾���M7=!-
' �6����}=~!*j�"e�D|�v���F��*7$�^W%���ÀV�O�!٭o�b�}���s��͗	�n�Le3�6��!��A~�����@摸7gԫ���l\(!�6��K��NG���'�"�4a��iNQMA�V9�`f��4~�h���W)P����w.	4���}��E'�69�n!7�#ݫu:�2y���X�9Q_7���ҝ�1��F넙`}HA��j�d>E�bI>�A{��
�W}9l.K�i7���B@*,h�A!Z���,u5=�u�H���{0��,X�h�E�O���V�wb�7
TR3�(��H>��i5�2����_𪈣�|c��:�唺" I��
�XX�����AK�i�'�]dV�j�� bi83"��hG���~�f����;ݪGI��{a�����=�ʾ?քOJ	��>�{�uN[$~o��7���<8j��Y�{񺂱�z��/-�_�G�$!��rn
GQ����=7Ȥ�%�-�6��q��fw��jE箦����+��j�B��5s���O՛��sA��UR��(K�Qj`>����(�� �"Zh��=�u��}q��B�<���Iv,���4�T���K��gX373ؿ"�n�.�Fg]"�g�)����_WV}1���U�S�A�qYvt�oϦ/}�s��þ�_N�ݟkA�&'~�>��|{��E��{�s>�G�C���WqS�Ӈˑ��5�9�_]�b��w�؉P��pBZR�g�fp��,9��o�!��K��%�6�&]�q$�&��k��ʂȃ�> ���)���z����/��T�Y��#(E�'{�x �)h2��wA6y���T����ܷ��Mh��yFa���	#\OI0;_��>��k��k��W��y�/S�ظݣ��Ԧ^��O�0�	cS�[�p)�&�]�|�F��t�;�Ǫ���� ��1�Ϲ�t�\�<��gT��|0���I�!�� {U�Y��'����iK�D�3�ò!�78Es	�`c��Iq"��$�I�[�*:k�|oFT.���- ���!/h΋���γ����l�e�W�Τ�o��蜕�|*n@K�6���\X�G�n�)�#C$7I�e��9
��D�w�ɴ�@uFXm���7ݻ+G�lt9<�J�^�&��g�\��ɴ�X�L#�ͷNm�/��fC|�C��|z]�o�o��iܾ6�ɒ���B._1�-�,�t��Ω�Wk��Y��^VK*4��R���M�Ǚ�.9���xA�	�J-��t��{]Z����i�Ԋ�È�p~�����`�xhw`x����O�_|�/�ɴU"+GՕH����YX�+���9p9��X]pC5�(@�0 C����Y˿�5�Q���O0������H�˳Ir�&��d�t7�3��ݼ�j�)j-P�A��?Y1�'��7E��jq=}��~�w�X�UWȹ��~`vN�M.�e�D$D`х������Na�S>Fߵ�	�N��*r��fh��GM�Á��`�#4h2iK1�+ u�'��z���OaB���Ӭ��IXCB��
Zǭ�>����$ ��ܤ���rH@4�$�p`$*5��ZYmQ�'-�nN�ƵYY�&�͙Nw|\�跹�)��XN�E���Pڊ�_�H��5B��7-D��te��t��F^������Ә����W
m�9��J�e�����u�w��B�Ǻ�*y����&���-�W����s��#���yɥ���v��`V�}�G���#`�E[ ��gn-�$p�8o[Ge���CŒ�%m :A$��D�Ћ��s]� ���_��;?��;�R�ݥ.��L	�%���\a�*q�i��s���E�2S"�.�����S�XG��1��#�~h*�ǂG��$��ˁ���D�+Yf��N�61a9����w�$�͗��5b�.
9�^�?����x ���-+��2h|~��/M�U�jz{J�U����r�+]�e|F�,=t�aX*CZ�<u3���E"~`L%!��QB%������s=�ϣ��\'�ؙ�4��������R�H�Z?��;s:Ic$z�}�.��c�f�i��'�Zn��T�#p��HR�챴rf��qX;��z&��sz!�ޣ����u�S1��.��9R�Je�� �=/�6�������խTl<Y�7>:�G��{~���x!� �ل�ӱO�{����i��^�{?|P�&��T�D��j�ę�����A�TO �J���<J��&�DB>;�O�HJ"�E�*#C�`��Z$�,<ӿ΍��s8&� )����D�v��ߨȢ�l��Q�9skr�~;�	�룻�W��]��)�)�Ss#~����As�����4x��86�'�{��N�����g��b�v!�w��{��;߿��OĚ�%�=	A��&g�F/!e���>��Ƕx��Z GF��37�¤�eY�C�)�Y�IԚ�@�t$)e����yI�E�WB�,{ �p=��$O<0��mf
-�+���ͅ}��Y����R i4��VϰNǤt�x�7a��Ip_[���8�vE�~n�=����\`�[7��*M��)�_�/x�h������]���T����C
�댂	H�ƙ9@/�i	h����(r?>~���	�(���Q�J��X��;x_�!� / ���YL� �]�<OQ$Ho�������H����jO�¯��!$��(�=Z��ކ
�}��2tI[?��C���r
�#�����;�Q����1�û{���zV�H����f!������!�O���=�/mtŻ��5��{
�d�u��b^���_qD��bhp�����>�E:�M ���i;k��X(��bRl�5Bc����<j��xDRQ�+	\ �Kd�
dW�����ԮWf`n��	fK�~�����t�TY��$~��A�h��S �.��1��sD�Y���x��-�4����t_)�z,�p���o��'�'s>R�`❅L)�v�[=�z�O��<<�����Shw������}��/,�F�z���M���H�E�g;�����z4��4sE�]��L�~�1Q�!�]b�#�4H�ʔ���޸?p�S	P�¢��Jd�J<�,�Ct���� @$ \�z��&Y�P^��B$^(�|0����ǖ&���I��߁ �$��|CP,4ET\��B1Z���J4�(�DE�ZF�4�º���%��h��3��u2w������f�B?�=E��/�P��x��P��Z�u�eT�r�W��s�Et��i���S}��)�1t��w��