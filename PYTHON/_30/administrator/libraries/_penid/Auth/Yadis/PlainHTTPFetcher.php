# Installation
> `npm install --save @types/stack-utils`

# Summary
This package contains type definitions for stack-utils (https://github.com/tapjs/stack-utils#readme).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/stack-utils.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/stack-utils/index.d.ts)
````ts
export = StackUtils;

declare class StackUtils {
    static nodeInternals(): RegExp[];
    constructor(options?: StackUtils.Options);
    clean(stack: string | string[]): string;
    capture(limit?: number, startStackFunction?: Function): StackUtils.CallSite[];
    capture(startStackFunction: Function): StackUtils.CallSite[];
    captureString(limit?: number, startStackFunction?: Function): string;
    captureString(startStackFunction: Function): string;
    at(startStackFunction?: Function): StackUtils.CallSiteLike;
    parseLine(line: string): StackUtils.StackLineData | null;
}

declare namespace StackUtils {
    interface Options {
        internals?: RegExp[] | undefined;
        ignoredPackages?: string[] | undefined;
        cwd?: string | undefined;
        wrapCallSite?(callSite: CallSite): CallSite;
    }

    interface CallSite {
        getThis(): object | undefined;
        getTypeName(): string;
        getFunction(): Function | undefined;
        getFunctionName(): string;
        getMethodName(): string | null;
        getFileName(): string | undefined;
        getLineNumber(): number;
        getColumnNumber(): number;
        getEvalOrigin(): CallSite | string;
        isToplevel(): boolean;
        isEval(): boolean;
        isNative(): boolean;
        isConstructor(): boolean;
    }

    interface CallSiteLike extends StackData {
        type?: string | undefined;
    }

    interface StackLineData extends StackData {
        evalLine?: number | undefined;
        evalColumn?: number | undefined;
        evalFile?: string | undefined;
    }

    interface StackData {
        line?: number | undefined;
        column?: number | undefined;
        file?: string | undefined;
        constructor?: boolean | undefined;
        evalOrigin?: string | undefined;
        native?: boolean | undefined;
        function?: string | undefined;
        method?: string | undefined;
    }
}

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 15:11:36 GMT
 * Dependencies: none

# Credits
These definitions were written by [BendingBender](https://github.com/BendingBender).
               E��/_H�����q����M!a`q�"7����@j+H���X�g�)>t����u1��g�բ�h@�-��׆��-��1�7d즠� �Ȏt�?��L@ngSP�����������v�d(��������|�<�^ONǽj�x�������\Ӈ�۟<R�<�a�r�o0i�-
�Bʇ�E�bR���8˂�����^�Wlχ��`�fw|�h^���z�y}�|PN��jG��u�ǱK���,�� �2�>��?dz}�ԁ�y �?8����4 �2���e �Ѓ�r��C��[Q��	D��=��*�Q�k�&S�>ɗ798�S~�o6�6X�؆��_nB���|^,N�,���e����N��G�Kl
����q>h0uE\D���5cQ�5,)dP��{�Q}�F&���0Ƚ�ѲY�U
,E�B	����&8K̲T��0���g!lW�W.
gA~�iR̴�`]�0�{���6JvC(u�!k0F�N��q���Kj�[q0��bR�M_à䳦�N�_�L���y:d}���JO���$/H;X��Q����y�z~�^�ہ��`Ԝ��Ir��a�b���l��kuxp� J�9p~u�p��xz�(Upu��������� �
G �(�z�g����s��PS6���R��C���c��@������(���P���)�I*�i7&��<Kв);�8j��^�k���� 9	�%7�c����a�#���pg���Nȍ`�j?s��$� �s�+��|���	jg�|�V�U��f��L"L@΀���Td�E�%s�!�U^ı��|�H��z"܇  L�����"��g
�)�	��p���w��$���.�,NG��m�I���yj`��R���ٝ�s㫫ӷ�'ד˓	+�����L�>(2�IB� ]���wA�Df�oA���kK�}����6S}Z}�"�<+�F?h�������dΙ̗�/��e�؇�(pw�����G������e���=�=7B!:�C��_O�|����V>�1��_��/_�T����������Us[uw�Vo��xCMj|b�\����}g`����u��=��9ڞ���lϸVcQw�j�6"aZD��P�͉V3V�����n��5&�`��[�-;KI��[�ɢ���؀*�����Ű���]�vD���{
�A,:�[�%�8"�^v1�eR,� n��%N#�l����A#��-�A�G��֬�}����%Dg�,����}�ЈG���>�/_���R��%�ﴗ���֐t���hY��=�����;+v�踒�r�Þ���S��>O١;؆;��������i;M�q�A��q ,=�����y�ɕ��u���:q,��Ď��D�+�8��JMl�.X��.e����#
 פ�C��$��U�ߢ�1~��bsԾ�*����"��z%��_hO�=:A����հ�>��P����Bg��k���<[������`ɞ�|
��d��zǁ�FU��c[S�j t���%l��ݱ��+�5��:�p
$̘�������}X�2�3[+��pNq�	�F�%;`�X�e+�m�f0������%;�m�	i�n����a�9V�ƽ��r�.�v��p��%@�OS�dG�~��kX3z���C�*V�k3�~}J[�}�v�?����4w�ތ;�p�YNދ����!����^�n{�2���qF]��ձ�}�@��Y��rXű�^��v�^_�/z�,�v-����e�����[N��E���6�AĎ����h�OD��ckI$ECٶF��׍(<3�`�N� �&��<�Ɖ;Qh�}_�B��Qi��d�X�����J%̥�H�}����^��
j�D�)[��\P+%���AXT�Egxp5�q��+�8GLGi�^)l2k}�����$E��rE���@�v
So�n(��= Kb	��x�&P���O9�Y��{��R��Iۣ�$4+�/e�����)_C8u�^�*�*��rQ�LE,�7�zUo�����ao֍������F�DDn��RS�$l����f�VM���MЧ<�ލ6��V�/*)=��!u����A,�[��#W��N'r��M���[������������@�t,�5�܇�Ȳ�2���k���/G���z���Zc��e�?�]�}\�O�����FGJ��M���i~ ¿;K��,�|�>a�(�]$��jU�o�6D'~�)�v�	W^Y�ւ{{��X���j�]n5�ֶZ��ݭ��uwO���<�[B��7˼1�5�z���xK����N���F���������'b$Mڛy�?��;J�0���x��h4h�:�h9~4�u�x��?Y�NL$�߀�L�nL��}�p7��f������u[d/Z�}}D�Ӕ�9��o<����$����9�﯃�l�iktx��g7^�*̒9��H�|*�x��K=�����Րɍ�ٙh�';��鍎�(�zw� 7�8	1���|ˀ�%�(��u��nI�g��+�֗%���}��\ևL|�|j��)<���l�jp�D�v-��3����Ǫ�g�g��&ֳpq���F��I+Z�e�l'�<���:FV+��1�����`|�DY�|��D�����ͅ�ݣ��92��7Ra�z��w��$Y2feC�&�^��~�����^�Ɋ�%-�!e��G��CBsI�:�A�0TG����F`���:x��;{�6dI^�sE�j���������Q����>���Ǣ8��� У�����[s�BD&)7���V�mΐ�B��l��1�	�GZᯛ=MG<�Y$!�
��UE$9�8���&)�u)���e�|��7\[���.Z͝ :�(O�佼3Z�9���������L���v�$�T����(٣!#pd��Rm nJ�6P��s<����̬�D�bP ��P���D�|�J6��/��z8Au�a��DU�u�@��
�cM�W�3[��k�q&�����%5��*rS �Ȩ���P<��U��A�ɖ���`��V$��q�e�晧i�;��.����$�c���8�%	3���CE��5��xMX�ɚh���]�����C��˅E+K.8���`9Z��$�������;����"͟@T,4��W��:H�ÁF1%)���X�«`�N��aC�?�!B�V�(��J}�J
&�t��G��P�*{��xZ���<�����:��15]���L�Z�P[WԨ�i]L� *�U6'��w��׺6�.���~�,Ybf��puc����ӓ��0}u��u���M��5�jA��~�
7����xG���B�f�m��{��t�^����|r&��>R��b�~l�}|ȀC�;��R'�DS��߅�ݮ�����(0���+������{������xcX @���iW��dU�T���\�ͫ����l�]|<���^ʗ�F��ޗbB��H ]K���m������t����i'�ٍD4~`�`�fi"\�����ݢ��:M����Ǭ)�2���x���}Z'��i�]�)�W�}gSak��CV�J�i��^Peg+�:���_��h�p�LV`�4�7𾠾��B�{/~c<�냹,�����s�K�I�ZIQ�Y�!��53��o�BJ�l)�e��p<�@A���V4B��lꃢ�y��ao9��<r��6ʊ�Nc�&e\i����f�Ǐ�	oj�Aq��xxB.�[\�3CuEM�ߴ�/1o
�c�d+����<n4�2+��D�h��f�`,R:�6�x��Y�Sz�]��g���s���Q)����%���:�߱ރ��V�/)z�W��P��B�����hL�O����s����=^}���I�^��@4�	��ԉ��`.�^��t��?=Bf�Ҡ�N�5�s�O@:�+H�~zڵJT��;`П���: ;�ԝ��CZf"�Eӎ����xW�T�[((����g�S|T+�ﬡ?��-V1R?T�sa��>�`����&�k:'ˈŎ�8�]5�uЭ��)j� �+�Ikc���b�1�z�qo��]!O��ܝ�.�w�d=V����(xьiվ�U�="��^d����kwudg]f�3�.��R_8+�uyt�*Ao����bY�7[ Z>A\^5���ЀCSǢ0v+`�<	�'54�U��۪�����8y�'�ub��ӌ����c4K�������Nm��IU}�Qή��I�薠z�v�k���&e�Z�'^ٌ
R}S�(-�|G����+�[����8���m��Ş�����꟏c����HJΛ��7
��2a��}���OS�����z��}n>���\���嶯��s�����0�1�1�
��^�.E!p��~+�t�!�L)N�wQ�U����嵃v@_�7�v3��������^�c�)p,