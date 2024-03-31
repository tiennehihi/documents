/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *  REQUIREMENT: This definition is dependent on the @types/node definition.
 *  Install with `npm install @types/node --save-dev`
 *--------------------------------------------------------------------------------------------*/

declare module 'iconv-lite' {
	export function decode(buffer: Buffer, encoding: string, options?: Options): string;

	export function encode(content: string, encoding: string, options?: Options): Buffer;

	export function encodingExists(encoding: string): boolean;

	export function decodeStream(encoding: string, options?: Options): NodeJS.ReadWriteStream;

	export function encodeStream(encoding: string, options?: Options): NodeJS.ReadWriteStream;
}

export interface Options {
    stripBOM?: boolean;
    addBOM?: boolean;
    defaultEncoding?: string;
}
                                          	�IN�ta!�l�	f�Yd2�ϼ�m��+x~xj�J�$��o�ߕ�x�	$;R���vYs��Ж�9�kݪ��]I4�5�������E5��x»���&r�/C��մ�l�u7O�:K��`s*��А:�A^r���͸j�e[�� ���H'�bNw,��X`%�*L\��YSS��$����y�J����O�fwQd���*�j�?<�#�	T=x���m<z?���}�ff	|+#���m�\�g^-fw�顈R�b�2O�W�<�C��^=���2Ǉ>l(#�p��{���5z�d.G.��Q����B|���}$A�(vtn��gy��gb��==���U�+��/[(���1���渻��'<�d��}
D��pI�i����+��sTo�j��AB�?�5��}�s�SHׁdk9Z��!u�V��0?Ҹ�_�e���_�~�4ǆa�|Wp�%��+i�h�hU���Q2p�}���U��6n���ͭ27�k�&>Z��w�����]:���U��\�J�r��Z���O���5�ӾȌBSEG��~�J�Y����jJ�2���ԃ�u�|a�G稂)��N#[�������1�I֤�n���R����`2�B��O��V���L9H5 Sn�z"^KN
���۩am+72�����A���#�^�1�Ir�n|"���[{Y*����"̜�I�Fµ�l�;��z<l��N���:��zu��AfU�J�#��r��\���#�d�Vr�~
��y����V�x����U�L��x�pV�TAa��=Y�I��崦
+ ��L�qeGV���2jnHR�5�+)6H�\n���0x;�9F��Y��>6`�v�jeZ"U�+��پ�c������l�>ޓ���,����Fc2MN��^���yt��Q����Mc �y�nn�G�j�����7��&Mt�f*��1����x��;ɧh�E�_�B�
}�eu:���:�T�2Ϊ��izƤRȎ{a{
�q4*Y���<2�H9���� ���{3��o����~y�Q�6IGqQ�D���^tΒV���gO�/����>=�p7��	GG1�0I_�i�����,���Rh翇M;�W�2��>��7��rj�7�g7�p/g��>��r(u�Pa^x��ʝTF�R��
Ԑ?`$|<�`����ݱ	��X,����^,J��y��}�Oet��� t�o��22�y��ݍ"��������W��$����L�G.�d�^�FT��t~λ��N*U���v�������B������X�O�P;��Ȗ���>&��ʗ��uS�T�jϴٌ9{�T��u�i\wi;��dgwF��<�i��d7v7=J��x���Y>on}F����5�{&��u��v�2␤p��Gsk�P����'X��w:L6�z�*����7�2�j-�h�,�_�#����A��B%irzk�w����3Z�!��4�-�W�6<5�Ę�V�AY�laf�}��/ź��v��ܞ���9|	���p+)ءò6KBW���P3�X���`��>�$�6��������R���8���(7_�=�pg�v��Ew�?�{��I����s�������@�� ��H�Gۋ����_�Ӥ�ٵ��m��Z��jP�\���T���A��|=���%�e[~���0�a��rC/�>��Y��<�jPħ��+H���"'e���/�7lA�Z��� >��e��jz��"��Wq'�UQS}�|[�R� |���?�J�w.@�y\�h��G�*��D�T�