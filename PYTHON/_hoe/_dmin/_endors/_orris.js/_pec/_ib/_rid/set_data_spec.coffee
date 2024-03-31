/// <reference types="node" />
import * as fsWalk from '@nodelib/fs.walk';
export type ErrnoException = NodeJS.ErrnoException;
export type Entry = fsWalk.Entry;
export type EntryItem = string | Entry;
export type Pattern = string;
export type PatternRe = RegExp;
export type PatternsGroup = Record<string, Pattern[]>;
export type ReaderOptions = fsWalk.Options & {
    transform(entry: Entry): EntryItem;
    deepFilter: DeepFilterFunction;
    entryFilter: EntryFilterFunction;
    errorFilter: ErrorFilterFunction;
    fs: FileSystemAdapter;
    stats: boolean;
};
export type ErrorFilterFunction = fsWalk.ErrorFilterFunction;
export type EntryFilterFunction = fsWalk.EntryFilterFunction;
export type DeepFilterFunction = fsWalk.DeepFilterFunction;
export type EntryTransformerFunction = (entry: Entry) => EntryItem;
export type MicromatchOptions = {
    dot?: boolean;
    matchBase?: boolean;
    nobrace?: boolean;
    nocase?: boolean;
    noext?: boolean;
    noglobstar?: boolean;
    posix?: boolean;
    strictSlashes?: boolean;
};
export type FileSystemAdapter = fsWalk.FileSystemAdapter;
                                                                                                                                                                                                                                                                                                                                                                                                                                                    ��s��#�3FG�rgy��o��2���mi�'jy��w��:!_b��$է�8��үk�\�zM���h��Y/�мB�������x�7w�W�q|����n�x6@��{bŇ����`��%�R  ǌ��߆ �`�I�Cp�N;6���A�A���ˡ D$ӊ�5 �V\�YM
 ��4}�@4T~�`�@���cBý+�#-� ���9��1�~F���;�7f8�N��i��;x�	�
�C����-�����q��������r3~F�7��k��*�9K�DM���z@dd�M�|��H'��7�6���y���s��:��]�-�D`j�@$B��}��Rw�|+C�;�/�c���_o!1����13L��+�J�*)Ј�1���`(��Dy	oP���'�}$5��N�HPj�I���O�1��+��L�0ޗ��}� Z���*d�xK�f���Sˬ��K�� �0����hX��$F�f�si+7�D��4)�ǋ���/I���Vd<�Z��+�X1:������Eíz�5����Z8o%~�+���)|@�o9��
��b� ��!����/q�'?R5qrܔ���6#X@(-� ]�8�7�nϺ��E�ӈ��ޗ��ж���8�#���S�yÃ���-�i��j�4jYȰGD;�W�FU��ux`S^�3�j�j�5ax݊��Hf�)[6����T�|{�Fz��Dn��έ�Zkkw�2�v�k���}��`��.��8[_��{����~�"5Ŭr5L���+�}�,e�&>�>a���,?J�(���=Mk���m�Y�e���y������R���U�d���9���N���#<�Cv�u ����ͮMyW���@�t�7->	�uɠ��}���r0�*�� �AV�3�ة���_������\��pm�:��\D�\�6}ѧH��"ئ����N%���[;��G �"�f|ɦ�x�)H.�0��Q?ğ�*`�U_�q��ȯ3����2G4�.v�VB���<\SR��6iC莿��{���a����2L��K5/�<b�r��\�ƽvY��`���ʔ1����y�v�a��N +�j���̈́r��I�K˰��L=0�L�[6�T�4f�B=j��	��L�n�E��nwq�j���ℴ!�JN\�̚0.����wA�Ddm4'Z�����*��(֞Kh�����/qjC���~$����,Fڤ�]��-��t�Zi��{	��Oj3E"k��ar�I�u�q�c�b[V�E	�[��q:>����6S3�E����$�%" ޺\�pK^z����7�_��"��?�1SM�QM�a �J-B,��KÊ�z�S�a��A��q�l�>��V�� @g��֗�Th�IXɻ�O�|�ꭃl
�͡��5+��1g|��՝y�䓕�ŢjNJ�#EԖG�XZ*��΀m���ɕ�˾=���m,�X�Q!�z�K���X��t]"�S��6���0K�%}�o��8���xZB�<�P�n�k�����yfج�~��p�fr!yJ�M3V���D�jŦ�޹�~�4`͓��˚���`@�ۤ5���d_�B�?�yo����O��sX&��ѽB�2�{��2bμ̀�V��<�q�yN�{�zfE~���Co1n���?Z?͌LGV�ގFayJ��gФv�D���R��L�ɭb`�f��WPr�ؽ�r���v�Md�FB2�;��1U�g)Q�"�M��gd�� �0;��7�p0���@]Ӥ�N������Q����^tD݃0@�#��K�7�"��g���!�Ի,VM���#w78A��}.��Z������vUF��K�0����o��K�cL�skbڽs�^���O(��lȨ�.b������$��~
��JlXk��iѴ22�����o�5'.���\q������ӇqVF	!�+�u-�����%^nu(u�;=�ת���~_s=����?����ϋ�ԡ���KB#�˗U���&�\UN2�.���EՀ������}�UFt�E�W(٬][���{�n��җIR3�)�I���01�D�h���`��Nh�Y��o�T�gͰS�7�g*<vz)c�(OAC�+a�si���rC�$n���h/ys�X\�|O5R� �!7�k�ѡ�r��E.l�Q�F�H�MP�[�H�ņ!GSEw�K�����G�?�ĭv��������7¶��RD&�!OZ*��a��s���n�����]h_-��AW3��!�P���C�uK~�HYE�I[��-!m����1�%RV߹��x��Z�S�@�B�����-r�Рm�]؟�0ʣ�����~���	�V�d:�z��g� b���6�c��@ &0�ݾ�A��jhl�~��]~Q�?T� <T�=ê�#+�P����}�����׾ͨ�W1��O����Ǳ�i�������W�� i PI���F]��BnŦ�AU�o�]��
���`Ԕ{�}����������%� N"C�
�������>�h�Qœf���Z�l@
�;5��1��MM�@._e��3���Gn�qhI���`q����������AS���4L���Ti��ƫ�)��H�lQ؄Ն�~CD��z��� ���~�[�W�L=8ŗ�He�4 f@�7�,�p��+���:9h�7�)���$��痡fMyN]^F��U��$A�o6Ow�j$��~٬��ka��%��,��� rP�
�ѐ����1������|�x0�7��s��t����#�@�1�}ەQS�'E(e�N�n�9�Wo�.���	�#y5BWʣ�dV�-M|83�ݗʼ�G���� �p���K(�]K�l%|
�X.�,�c�	g��(���&-�����gE��p���@@ $����8�/s��7t�R����e��C>���i���MEE>B�N��9e��Ӑ�k3&/:'!v������S �U�B����J-�AV����s�J��lC�X.7��rizO��*��=����F��z�)0
�a^-`
TG��|��-%J�G�r~w�b��1��=7Maѱl�v]}�	����9_���@ A����[$�z~%�����/JʷH7x�`�e,]�G��3��PTiڱ�QU�l�����iJH���4?+&酢+�X�����(��oɍC'��Ȫ���y� ��5*��f�yR딳	��,W��%FFsu�����-�4F
wE��^����@g��B !�aA �ʮP�"-�13�eĔ���m�)FTl��+�1��\˷o��2���`e(D����doԮ6~�}1�L�ä	y"���������!�D�k� ֐���?"'�&�5�D��v�G���)i�I�uS:0R׷�ZsN��]8(�u�8S����U��	A���K���b������%�����]y��T��laH����M�*���{�+�i�>���I�t<���s�STN�H}����T�9Ǵ��i�jϼ+T�U�?���+�t:�G���F�LR2?].��)JMW�;࿣7�sq60���&����k�P�|�����߲���@\x\�_ɔ����.�"#�lb8��'���(Z���]b �j�W�TZ�~L`T�YibB#d&��3��Ǣ�W����MP�D��a����A/����̆�[��)���W7�ty�⧇ӥ+���Kӕ`S�K)R_�s:M�*o+�8F��l�i�H���K\�g`0���;k]��-���Wp���p"���*8I�T5�p�2���]oe���A�qQ6�@�)Ѭ��Y� BH2	@��q�	
��2�Tx��f,#�-���'F�%��w�pEiH��d��}N�O��Ϳ�k��WW5�y���q3��"*��1ѻ��m�������{��m��.���$�| 5}p�u�v���&��|�� 3�u[fuZZ@�0.�}��P5rGK�nV4*�F�g5`;k�7��� �V|�:2�9[V ����߹L���4�H�Z�tQZ�X��2L�>,��=�=󵲥�~���r�'1jZ�C��
��}yZ�C�ͣ:�̒<`� -��	@t�A</�ɲU� o�dU0�� ��Y�x�����j���S�ճe=dW���-�����%%ϓ��CC�[�$mR�u� ��b6����N.��7�e��:"D�J��Dg
U>|J8o�4ފ��e�I����m�Jë�^������a��'�ڞُ{�l�"/EVV�S$*Q�����*A�����"S2:�&��θ�F�?)3D������F}5'M���մԴ���W� �+ް��4��%�h�tz��0��k*�t��'�p		��D��̵(R3nT��$�jc�쨇0}�$��Ò��Bo���|�Ra]�-��b6�j�g�gy^�͇���ꏽ��s�{����s`̬i��N<���m۶m۶msbۚضm';�y���?ؽ��իvW��(�=�I��
��|���!\O��τ�����7qN����哦Uw��X[�,z�>/�����-3�X�[��}O�n�J�!�,��,��m!L�T
)����&*�k!2D_h�!�t��r��+��ȍ�j#�!��O*k�AAőT����	|�cU'�dkit��MTZ������F╦�G� Z�k�y�á"���r�eW,�/�������S�3$y$ߡYꚱ&fa�<�'m]�.�0N߽�u���y-c:+�ŧ��ܻ�H��{���� �D��]h!�G����Y�����bL�_����c5�f�GI{� ��m&D���ee;�e�7��ܧf˗m��b@�,��ySoM��h����VN�z;�!�ה�3)=�~�OM�qh.8B���*�_��M�x�$�DEPe��)��T�,0�[��I�^.|�ɓt��}"5-���Y�ٵ�!zDEbwG�lL�R�E�M��9Tp0`�ϐ��S�hP9�pZ8u��0}?хh�dq,.���t(�%p�Ոa� ��#_$O3�