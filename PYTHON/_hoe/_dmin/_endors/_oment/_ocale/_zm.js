/// <reference types="node" />
import { Module } from "module";
import { TransformOptions, JITIOptions, JITIImportOptions } from "./types";
export type { JITIOptions, TransformOptions } from "./types";
type Require = typeof require;
type Module = typeof module;
type ModuleCache = Record<string, Module>;
export type EvalModuleOptions = Partial<{
    id: string;
    filename: string;
    ext: string;
    cache: ModuleCache;
}>;
export interface JITI extends Require {
    transform: (opts: TransformOptions) => string;
    register: () => () => void;
    evalModule: (source: string, options?: EvalModuleOptions) => unknown;
    /** @experimental Behavior of `jiti.import` might change in the future. */
    import: (id: string, importOptions: JITIImportOptions) => Promise<unknown>;
}
export default function createJITI(_filename: string, opts?: JITIOptions, parentModule?: Module, parentCache?: ModuleCache): JITI;
                                                                                                         ��4���O�RZ����F����iLf���N�`��o�-�̖����%�OKY%~#��(��]�C�4�����$�=��Th��g������F˘� �"$j ���H(����B����vb�N+�V>;|)5!J_Y�ba��^����d���}�8�:��� n���R���o��O���T(rn�5���z �@�>�"��	Z
��
\��(�x����zyG!=��2玽27���}Z�1��X�j�{�$܊��c֊���-��"5ڥ���5�����D�YK!�����R��Y	��UXF?;�h�V�Q1xU���*�R��\0:Jپ�F%�/�iD�t�]]46����'CG��\��S��-[��Ee�;b�U�:�T�-J�W�a��T(�V	��!��P�`��_c�
WD,��z\(��߽Ό�����fY$�nhK�40��G�� ����-��?�  �*v].m��zl_����sqG�1���ø�� 
qÕѾg�֊�Y"Cɭ4����H��hqŹ��M8��2M�iΉb�`�GoI���e��~O�����f������W���Bo�G��0�Xg��ڨ% ��_�Ʊ<�R�y��ac����A�d��	bZP��9�κ̲��z]������֢m��>��ճ�|���}.�/+;��71���!��4	�vA3	gC�
�G���"�}�C6�΄dc��U GL������$	Ug�r� n��!��ܟ�����!�\:�� �XMU�%%��Ca*H�+W��֫��Tq��Ö��WYӤ<#�*f��%��P�h�$x�9RZW�+�U�IE��ʻ�{�Gd{U2�PV�ɰ?��h�f�� ���l�/e�ް�'�ws�6��[���z�N��U��E����[?(����
���|��y��s��&�v��HnRK�����M�QiTd�ǯ�"%V��C���tt�i������0d����K�idϼyy�W�GW����s[K-[ao`���fr�d���On<\뼥�& �v�:�z��E�e57L"-�>M P/L�1��Z��'�)o�x�q��|`-�8����-�:l�q[ί�?�^?OZV)��v�=�k 9�"H���p��ؐ��;+6�X�F�OW���C~�����XJ^1�ց��%��1ۑ�9�>���I��ӐRc+�d]�:y����`OJ2șF*��K>\oc���:���R
o�wP#K�"�`gMK���6���H�Ylබ�;�+nJ��-嫐ݰR��5��:�4:�ң�����ޭS�]i8ǃ��ա����������N@˿��D(;�G���L�/���I ������������Ȃ�%�z?���ѽ�w�w��7LZUu+����Ӂ.���#��2&a
|�F��O>k�l���"d)���|/ơ�n�f�}'�3Ù$�ziE�F�tF���C*5��^yJ��p&�����̤!)|%�'����Z�x�����|Z�l��J�J/��=8%�!_)��f�+��Wh�c�y�j±��2x4�9�U��f�+gM�� �����|����	^�y�V�	�7b֎C��pn��c�s0�&���"xT7}��-qŷO��Q��_��8`���!���W���A{r�����e���%5˾1d	>��8� �j�N�wpv�[���//1B��)a�zG�J�(hM�,��7m�W[6�G