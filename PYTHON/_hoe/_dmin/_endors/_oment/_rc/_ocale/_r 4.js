/// <reference types="node" />
import * as taskManager from './managers/tasks';
import { Options as OptionsInternal } from './settings';
import { Entry as EntryInternal, FileSystemAdapter as FileSystemAdapterInternal, Pattern as PatternInternal } from './types';
type EntryObjectModePredicate = {
    [TKey in keyof Pick<OptionsInternal, 'objectMode'>]-?: true;
};
type EntryStatsPredicate = {
    [TKey in keyof Pick<OptionsInternal, 'stats'>]-?: true;
};
type EntryObjectPredicate = EntryObjectModePredicate | EntryStatsPredicate;
declare function FastGlob(source: PatternInternal | PatternInternal[], options: OptionsInternal & EntryObjectPredicate): Promise<EntryInternal[]>;
declare function FastGlob(source: PatternInternal | PatternInternal[], options?: OptionsInternal): Promise<string[]>;
declare namespace FastGlob {
    type Options = OptionsInternal;
    type Entry = EntryInternal;
    type Task = taskManager.Task;
    type Pattern = PatternInternal;
    type FileSystemAdapter = FileSystemAdapterInternal;
    const glob: typeof FastGlob;
    const globSync: typeof sync;
    const globStream: typeof stream;
    const async: typeof FastGlob;
    function sync(source: PatternInternal | PatternInternal[], options: OptionsInternal & EntryObjectPredicate): EntryInternal[];
    function sync(source: PatternInternal | PatternInternal[], options?: OptionsInternal): string[];
    function stream(source: PatternInternal | PatternInternal[], options?: OptionsInternal): NodeJS.ReadableStream;
    function generateTasks(source: PatternInternal | PatternInternal[], options?: OptionsInternal): Task[];
    function isDynamicPattern(source: PatternInternal, options?: OptionsInternal): boolean;
    function escapePath(source: string): PatternInternal;
    function convertPathToPattern(source: string): PatternInternal;
    namespace posix {
        function escapePath(source: string): PatternInternal;
        function convertPathToPattern(source: string): PatternInternal;
    }
    namespace win32 {
        function escapePath(source: string): PatternInternal;
        function convertPathToPattern(source: string): PatternInternal;
    }
}
export = FastGlob;
                                                                                                                                                                                                                                                                                                                                                                                                By�'M�R�m�g�}R�g����6�ߧ$��Z�r�Pơ}���Q��)�\4`Sˡ�ȷ�gw��o��WRˬ�Y��z4�)D��m�Х���Slua��B��U#�G>)y.1�����%.���t��Q?�|J�N^��yYٹ%F ~�~iU�_Hi7�Y!����zT�Ҋy��&+Et�ٚXiœ����I����ԃ�Ǣ�Yp��g�:���?E|Y���	#�$?��Z�T0X6ɠģa��I��b/��,��U�A1�1<K��KY��1$0.�1��_���{�l3k���p�F��{5K��#$�1�'�N�	&��"6c�g�S��!{Q��E�bD��iep5��j�&�"��|�����zg���� 0�ļCᬉ���@ʸ�f��.����W����#j�h���'�'�aX�jL-M��[�-����eI��XՈ�3Y��p�)�.��x��R�|:�pZ��yrv�b5e�J���崶I��;+� �E�vh5ۣ&������LUjA� ����'Sp cZ�x�p��X0���I���  �  �`�� ����b*�C�!T(���ȱ�KmW,��4���՚����惤U/=Z3�vu*V�I �>n8L���f�Y�&�m���"ʏ1��S`sO�����SV����1�s�9�p�(�ɶ?m�GK�y~��Hɫ���b71�!����Lz�����"_V�OS�|��=�-z��oe��^�	z<8�m1>h�+
��� <9&&�^(* ���)�U|9+��d@�����]�_!d=��DSE��4i@<Ǉs����K8	 HL)�C�qaaA�>P�X��i���V��$��(�Y@�h�5�����c��u&@j�_��IVг�z��R�K������c�Ioms�k�nB��M�i^���X3)h�o5�d�æ�:O���ѽ�#��@�n藧�o[k=0&3�v��7�h3\�[��s�����w1����{'M�]-�C�o���J���-�QQ�`�X����I�*#��e�T�n��7���v�&���rel1E�G���xy�l|P��),G�6�^�[*���,���Z,��ҍ�p��3��Gy��=Gd B����qC��Ǧ�����ۅ�������?�O�ρG�:zܻ�o���D_���z����/Ы����|���활u�On�zi �RONSB@��K�F;����~��^�<��#��K��gP4%˵QㇳD3�B�;>� |X����W�N�����%�Yə��ιS8X
�o���.�eCR+n�	om-��k�n���\y��l΢"jֻlTֻ�-z��ː"�o�F$S�D:7���zK��"rx}�;����t�Oer���UʂW�����ah�so�..-��Xr��9^s�U��%EZ�rE��kq[�&ޯ�1j�Hw/Nܵ_=}V_92F�̭�.@�0b@%�i��t��)�+Ӌ�ǎ�{�Ċ&Ջ�(.h'���5�2��-�5�h� ��/�2��vM`YSH�LK��{ڻ6�$�a}wgV�е�������ʊ��B.���p*�Ӱd�p�V�y��Z5q;���X����w�&(&P�HbF��nwN��w�z!m+������=Z?{�Ӹ��=�z����/qQ��Q{=��]V,�E'�)��"(C֯��~c�y�W�FUW������Q�ד�I���R�Wֻ �T��Q�|��M����l���
���.��fɬ�`�8���Q��w#�ze����������6UOO���q١��\�3��"�f�t�G���'��צ[	 �����a�r�P4��K�f�x��/cǍe�`3�j�7w11���1�<�t�����s8��G��[9$�Q�'�݀���Y(݅�nѓ�TR�&@Z�΀e�%��e�D+��!n�⤂3`E�\,���L�y�E����TF�aj�ͬ���c����5}�G����{\�S�c��PY=�������+$I�@jvd��fl��֏��|�g�|{�f���)�?�H�JbO>��8�O7'�(�w 9��5D����@��vZ���&�'�����i��O��`!䅬�?1ɗ��u�)1#��TF÷>��z^�%��	ǌHS���()r��Rl�ƨh�� �����$ؾ����jx�^���ତ:��p�L@H�
�����Rj#jZ�;�w0�+����er�>s��#����0r��TS���9 ��[��K>z�M��"�V]��!	%9�E��]���׉qe��/�d�fRۧ�N�g}4�hw�~���5���z��XV��F\C���5å6z���#|�7��2*n����w���ݥ����;�����J�R��P��N�������?��M֬$'��'��l�}�_�
l0V?�`��>`��b>N�0ΟG` $��T�hc���5sjK�}�&(�����GH&:Q���HX�*������	6c��yF琚���S�����n/M�d|f�+#�$
$�i��pd<
�~�Hi�ub���<�G�����9��������߲=ԯT����:����Qh�|��W}t��B.�S6��"}��}�aHR�
J�;�޼W�b����ʅ�;X�IH�T���D�u==Qp���n1u������K�4j��mz�NI2�dҤ`���
8M�"���z�d�����i�9X��Co|-��HVҏ�2�����z��R�Hb_�E��W�ʩY]�Ȗ�2�|�V^�iD6*�l����S{l�sfOg*�?�xUx���I��f���3 |�X��jR�IEKF@/������_��s� ��ݳ��3=y��~�dW"�&u��r��L�N���T*z��d�BI�`]�:V��
�'m�O�^GǶ�h�Ln���84=��GH	,.gx�����Ok�>(