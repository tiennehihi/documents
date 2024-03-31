"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFileSystemSyncAccessHandle = void 0;
const util_1 = require("./util");
const buffer_1 = require("../internal/buffer");
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle
 */
class NodeFileSystemSyncAccessHandle {
    constructor(fs, path, ctx) {
        this.fs = fs;
        this.path = path;
        this.ctx = ctx;
        this.fd = fs.openSync(path, 'r+');
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle/close
     */
    async close() {
        (0, util_1.assertCanWrite)(this.ctx.mode);
        this.fs.closeSync(this.fd);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle/flush
     */
    async flush() {
        (0, util_1.assertCanWrite)(this.ctx.mode);
        this.fs.fsyncSync(this.fd);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle/getSize
     */
    async getSize() {
        return this.fs.statSync(this.path).size;
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle/read
     */
    async read(buffer, options = {}) {
        var _a;
        const buf = buffer instanceof ArrayBuffer ? buffer_1.Buffer.from(buffer) : buffer;
        try {
            const size = this.fs.readSync(this.fd, buf, 0, buffer.byteLength, (_a = options.at) !== null && _a !== void 0 ? _a : 0);
            return size;
        }
        catch (error) {
            if (error instanceof DOMException)
                throw error;
            if (error && typeof error === 'object') {
                switch (error.code) {
                    case 'EBADF': {
                        throw new DOMException('File handle already closed.', 'InvalidStateError');
                    }
                }
            }
            throw error;
        }
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle/truncate
     * @param newSize The number of bytes to resize the file to.
     */
    async truncate(newSize) {
        (0, util_1.assertCanWrite)(this.ctx.mode);
        this.fs.truncateSync(this.fd, newSize);
    }
    /**
     * Writes the content of a specified buffer to the file associated with the
     * handle, optionally at a given offset.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle/write
     * @param buffer
     * @param options
     */
    async write(buffer, options = {}) {
        var _a;
        (0, util_1.assertCanWrite)(this.ctx.mode);
        const buf = buffer instanceof ArrayBuffer ? buffer_1.Buffer.from(buffer) : buffer;
        try {
            return this.fs.writeSync(this.fd, buf, 0, buffer.byteLength, (_a = options.at) !== null && _a !== void 0 ? _a : 0);
        }
        catch (error) {
            if (error instanceof DOMException)
                throw error;
            if (error && typeof error === 'object') {
                switch (error.code) {
                    case 'EBADF': {
                        throw new DOMException('File handle already closed.', 'InvalidStateError');
                    }
                }
            }
            throw error;
        }
    }
}
exports.NodeFileSystemSyncAccessHandle = NodeFileSystemSyncAccessHandle;
//# sourceMappingURL=NodeFileSystemSyncAccessHandle.js.map                                                                                            !M; �_g{=�4IAڠ�v4D�⠒y��	�sh����pU��=�.!4��� �jX�^$Ԉ��q࠲	4	��V�4�}��sD4r:.�H�z��.��N�c����l�_O8�<cK]*��+F��1t~���<��^)���^s#t�56T��1������1JA��?2�]z�����,J�Yjb/�8pY`�P+���W-t�ϰ��3�����]#��0"k����K�W����&Q�����h��0gD�R�:����4���rm�Y>vX5F����qm)�)��U:�a�����T�g
bYJ�_$���h�J�i����j�Tvbx%������3xH �]Db�d��l�����G�^IѶL�9��X�O�D"��Z4C�UXf�����v�[�_h�F�a@ʴ�����a��"��H-PH~ԅ�KJ�f4++��s� �{�p&2~�r�e��C�SA�xy�O�8 �zF'�גf���9f���%1!�RIIm��(�@�����>2���A\4����չ����wqʋ���r��+�H+-��`P>�Z����o6�I��[��|Q4%2���x�I�����+�\|Y9!B���
�߂�^�S���N��U�
Y!��}FV<��G!AF��<�~aDf�'ĺy����+������&Du;��s��&}�HH��$��<��MU��Ecm���nEgh�e���lM��T���*���~ɲ���M������V�+��sx�3a �5�ެ«�<��gܛ�V2u�.c�"���74�&4�5��p���sCP���~ ӏI0F��s�t}˾6cV��KA��
2Y���z}p$�=��Ϛ��kM�ï�E�.x�?�t[�f08���)�SB�T��E~�'�B�}@�a�	���e�x�<&[�ۜ�2};��|t�MW�S�`pe_��y+�\7mh�9����k�q�H�Xa4#��(^�ݴ���c�8:��:_c�҈b���0V�
��t��{.���K�����SL�f���k���ޡ���}�H���?� ���m�^'!.��JƄlN�����P����/[%�+�h������ڛ9ZT�g��`jjq5� ��7J�	��RI�AClN)1�Lﻟ���?!�` ;)�}"�3I���M����k/��o�÷m�� �.L �l���)o�]���-;7R�1��y�6�=�>�V,	$ַ�/%�d��u	&ѻ
�*0���m�lt�k����%5Ԩ��A%����xX��0��,??�m�J[��?��jMbl�!~��ͱ�����x�ou�-YW��
�:�hd
$����X7Ky4WIe�|]������P�x��b&#���1��K�a�L骈�A�,d��\g��C��}㵪������`����f@��ͧ��rw���w��+w��Q>BE�Կ
]B�+nОs�Ɋ!d�Z �=�O	"F"3����,�F%ii��
徜����EJ����]��R�R-)A��#; Z.EB�DSt����@8�Q���v`�8��|�?$�h����!s������m=�;�u�ª�?�ކ	y�j�}�1�� [�2K?<�[�h� !��(I�\G�q��]����Z��T?�ޓ�{����b&���9Fg��j��H�We�X&3��j'���1��Y0 �P	��T�ʫ�GD0��*.�D<��j���_Y4g#�L	ɜ���+(߂k�oK�+>�x��)�=���/��'��m����置Sh�l�x���.l4Q ���%+	f	i�>�9}8ku?x)�)�ښ�%��\���̌�6ݸA�S8W�G��b7�J0anK"�
� �u�ϰdCfYOX�籬"�<��bn�2HrM�*dc�+nn@�U�6-ݩ����D�ݺ��K����9�쬡�!�� !N���.�I����s�n�}��lF�P�|����[85�W{w��W�u��?�_	�$���� 2Iu��(�G��2�wԁъ��$�nh�<^��NT��+g+�+~��*krK�;!B��V^[\� G�������@]��w�1�O�Q��٤j4[`�+!y�>K����A�
Y�2Nfh��X��"JJŵq�on��{��x������Yc�/��`7��׏W�x�'�f����bҊ�5�iuu8�< �=������8�&./c�3U�d-,��~���W��Q�s�x�n��R��m��ㄫ2o����I��T�,|�6�?��TG��	U��F�Ly��6"�+��ġ�/���M��C�%S����c�S	ME��/�P�h�7ybg_��O��m��c��L��: Mb�@�'ݘ�RZ�a��u8ք�-���(w*Z������yfvˉ���f1�lc�3}��ۊ|&�K����}�u����<���~��c�Q���kӎ�
o>��	��q�K��M�p������D;.)�3����-�#I�F�uJ���L�oH�zS!����̄Wse7Jn���-.�@d�0.S�8��՟�2.ĺ�
rUR�c2���`��"����ϧO����1�)I�bY~Yai ��d��"n����6�����&�K�$ڗH�2ф�d�Y�k#}{���8#QT���<��c�������Pa"�J�Ia����?���m袈��"�����Z�Vc��F�~�+�Y0/E/����I>,�i1?��&�KK&�r�T�{d������;�	���A3���s����@8Rĳ�Ļ�����A�[�3��|��\M�#��Iu��fi_TF2���rt�M�U@�` �e[��V/+��`g8����4!��S��`^��#�ϑ�O/���w�k�ӱ,CrG��g�a�G��F���8\3����n3U��OW7��ŖoIT�$C �L�oWL�J�b�H���`��6��wFA������ee҆�ϬR�Ƥq�q������EJ9�˝�!�'?���KY0 ��D�t:t���k�S��t�Z�(q�O�B��"�LW��mъ��ۡ!A����	�/c��m=��b�zY�8�E���($~)&�y~��`u��/��0���\}�껇��
�y^�B�k�ɿQD��)G����T����^��.�.�5l��^H��@U���=
@,*@� }(�ߩr��M^�n-��/g�,w�V��oR���{̃��[@�Zb�����(�D�o����ӽ��َ���5g?A�m�b��ej��N�P�$��iݍ���hc�Zo%x��N��~��WlX��Xʡ:�f�Qt�#�������ا^4�������z�gEL���A@�'�1pˠ��\�cRԔ����eH��%^���`�7*\[��"�-�׻�߮b5\8|�u���]�fqU�' X֑TQW����t���e�>б�9y�7됡�ٌ��yŃ$�������FGP�CS|SPt��K�YVȃ4U9�'���[�څ�`!S�j�AIRk;A 6��ݯ�=��t�y�����%�#'M��c�^��u�L�}�5k�����(�&:�(��
����
��|�Ic�w�8��9��������-��9l���IƿP$� ��#��n�5ùa�T���n��F��ܲ��KK {W()S��&���>oݱ'�j<�u������S�q��0K��\��:z��˞������z������j�Wv߯��αXe���B^��-ow��E��`Lh	3JH�A�<%��Y�G����	�?fB�y���;RX���٣��ǳ���F���Gm &�0 r!��.Vxi��PaA(�֒�*T=�]ּXL�nA_.J�@�}�+�-�F��R��g��� ��s���S�Y=�����i���3�h7�c��[
{f�g���d|H�XΣE������Ѹ��v����=���2�B��y�N���F�������*��8ڭk!�F*�0�}���%��D#z~��p��iC9�)A�`�[/L0����O�L�d{��o���~-h���1�B���qlԸ�< X�F-ئ�Z���c$^�[g)���ly�#A�!����
{(�FH��!�K�g�$sA���C��F����?�x?y��h��K"on�qo���s��ٱ�]���D�ʚH�c��� Z�C�sk��SK��J�3�-aθ���:F���c�TZ�	en����"�3���+�+<� v����T�,%J<��$n�7�4�5*�-#��XI�-e�Kg����"t?�/�y�jd�s�w{�������Q�%�2�k���͵M~+�fn����E�F��AD90�#��5�Z:�U�~�s܏`�E�m���>�0���c�����P ��^��rJ�X������U�2��F�5�uű��ۧ��0C���b��H����������.�IP��<�1� @F5h���@i?r���s��a�PO!7���%v�hf�ќy�7Ԇɺ�K�P���Z��������
�)j�s�vꪧ�_�z�.�#O��o�>S���������6L ˁ�0�|8\cg3dI�Z����k�=�o	^����VR�2��="����i�/���U����紖�E� \��o�U�`�f;Y�[{�o�/��'����,�ޖS��Iv��՗����ܷR&���.hσ��N=2��%�8��5��p�
���$d���.���@�`$m\9�U,�=��qo(�����E18��ս��X{���b�;Y@:I��3p�g-5��Q�RA_C�'N(�-��[�^*��2��(�� ]��ꃏ����v�h����t�#.p�F��*=�p�i�r����ܧ���������EB���3��9���6kK�f�#�����]�_�"���y.����S%��X� ^_�a��%4)'�m�~勹�
�wd��1�B�/��y���7����)�v�Ϣ�ʮ��M��;J❉��:� �	0�dyM<�M��&�RE:V�b�����ك����������ϒ���[����3���od���`���[��an��]�ao�s��}UC3�no�|�-/���ӯ��D��{��J�|�6g��1�����:�0�$��݂!|(�E��b,7uOp$.����ts�5�j�(:��)���$β���`�7�у����8��&��G�!0.�8SR䔙A!��ެ�z5d̜6����=˼�m�O�R�b�o���x�s �>Ҧ[�Z(N)�{�/��J��t3@�r�yc7���.��D3.�\ _�b�5�R�z�e��:����䋣�����0�j���5He�7ֵ��jIO԰!{��s���W{&�߸��%!�WZm>0I@ Pb~۪�;<N#hv��,�0K���:��Tፏ�[�v~&o�l2c��;[Yaqc�z��q��V�6`FEin�B��3 M�G/�޺��A�!��`�Z=���3��$9s�긥������+���?)t�g����C�Ϗ�J�77���s臁���� �>QS�*��T,~K;JW w�K_�^u��(�j��6Z �z�[��Q۸�'=�|��`ޥ�P�ԧˉ2&�j�o�5՗ޘ,���V��c4>\����i3�u��8�棶���3Mާ�O��� ��4��X'|3�������ؓH�a��Knָ�����b(~i3�ѯ����U^D���V�;�l�-��"��ʹ�v��PO3n����#��|��HC���``����,p�i���oӉ���␁I`�aw�v�V4
[��z�cP�}/��yO4��=2�L��Y�F��2�g��N����[�!m�#����	h������g�#	�8��9=Dt����������z��ʯ�!ǃGX�A:1w��P*�q.J^rL/J3�h(+X�J։�_�ia���9'
���2B�fv�r�W@��k�m���d�h�p��!���x=p4r��pF�����`�'�#x���( i��1"p[������D�@#Gb�R(��[��i��n=o����������.�;�Č� xj䰓"%'���sc0y���C)������N�9Ww��j,�s�E^�����^z��gZb�ҌX��-�T�gƶ�C��,&�����'��Vr��O9ek��&���0��7$����ؒ��!`ǎ��D��W��I��b�ͼ�Ӷ$�"�6�CI�`���#0	����Q"W�ڤҰVy��j%0K��'3u��)ٚm���P���"�҄}v���f<p�E�Z[D
��,YvqV�_��x�5�iS�\�z*V�wgZ���%��x'��y�B�3���)b���:��C�}�En���-�Q@��D�v�SP+��\aN���è6wg/A!�   Z���P��l(�Y�2i��s����x{����>'(��|T��S��+=DrսK	L?�c�.�guҎʄ�����4B�����@�H\@ ���x<R�6q�7OUF%�Y�4�� ��F�ڈ��{���e��Uw��kz�2ʘ"0�,���N����J���y:�~��x��xc�cq~��i~��*�ٛ�ǣ�[T�Fݔ�[�?J���ÅXS
*���+	�`�2O�KN�?�D��^�׶x����Ue�Ah~����bm"߶ŵ:�]Vx��Ĳ�}�w��3P���@*Y� sR|�(c*'�X�'�z��ZCx��k.��"}!����bIh�b��v��Y�I�?D��� �-��|�)�)��X&mr�)A�~dƻ'ܳ ��ٽ_�<'q���C����1�1P;�q:ժ�#M$��,Z��8�\<�4�Wp�7�"��r�R��b�\�Y�9�b���|����K�l�f a&$��P1��ŀ����
�-}�J&?�K0�_q[5�`�V��Yf�F�2�NН�R�������`[���H-P�A�����l앮$�Q���2Ͷf]��R[�Z�XҮ�E��$�N�/�ci(C	<+"+����E�����{qy���=�[��hx��n,���l�1Nǽ*Y�c$�U@�|�7F�*ȉ��p#�JP>��i݋켥3c�U�_�sd:h��'%e�=����p���w��|�n���;����ҪkE,��� �5�����@H-��։��e��' �3�Z���D�~{B�]9⇒o���� �<�.��1��U`a��	���z���U���h^, �0��c��1�\�[�pi� �	t��e�ߕ��]��5��}���\9��d�S�"lw^zį>h�6D��5�Q� �f�i��DɉI>�#�震�eT3q��$T�tQ�j��B��z�ϙӐ��_�Hb'?�<�ד7��0���>��30��1a���W��v$�w��F`E�X�1H  0W��h\��z�
W%O<�\E�塋w�FZ �}�Lq�XQ�-�� $ü���%���ZW¬F�F������р �ޱK�b�!b�[�ط����"�23pT1ǩ9�I�Fן
�L���3�4ʑ�/G�-�E7GŅ��������~˚�~�E򦴏Hw�!�x��J��~XjtE7�^���⋭�����G|5ǓnJt!��a��
Eu���6"^+}��G�X�5���&:Z����U��$
b������⥅�xs�K�b��\Q�ܒ��J
����ͤIA�W�.c�e(��v�d�W1�s�w`�Y(a����	3R���O�Υ��|��~�5�̧Y_$����k��j�BU�nc��ɥ�O�ֹ�_�ң�%�ʖv�}|vw��ӥ�E5���7��*�8�0��WO��jG��m@�)�ѢA�B�w8j�ё��H�x��%���fli�e3�x�Wf�0�k��~��c'J�/A�*ƛ������}��_t`�>��Dԗ��.ֱe��DOk�&3�7[�+��owc�U�蟪��ַ�ｋ�`HO��<���j�3\��LK;
U�4&�G�9�;�#|���ja�C�nKA�R�������g���Sm�y��jL5�b8k@8Y����B��P$�V�\��4��������X�7�mZ&/�!諞�:"׉�Ԋ��O!���2�=0$J�ܩR���W��Im�M�yr�=�!����h�-�}��`��b�����[
m�]pܙ�_�jRrE��Q�&�%0�$?�b;�X��%�Z��Z�A}�j�V.*2O;���;��}� �r�M��8RI9�ܸg����d������?���F��"!$�CjpD4��f�\�$��Aq���3���ѕ-?�6h�(I^~'���>t`��n�;��h���F7�Y�#!��4`����\��Cb�Nu�Y.�B�mU�b�<��I!M3�{����ʦw~��"%j�+Hn��mkY�T�no���N�9Цp�p3�����um�m���z�g�@.z��Eш 5i�w�%Z	�dq2$�x#�	m��ޱ����@:�5�a]�ڿ�1T������Z�֠8}lP��]d�b����>^���q͐7�B��{wsv�\��W\֓�w�G���7W�0�)��#l�����j^�{J��lˎ�M4%:�r�[��,�!܄
�#[=܌�X��?��;8t�>F~�|��m���n]|x~���CEI�ɍ��9�M��k\�F ��!��/�y��Ab@D�ק������l���*A,�ο�\�M����,u-��Q����|�)��i�	M���D�q���]y>O�U���>�A�P1J)�<;Q�E��<�I��j���!k��3L9Q�X�H��(SDV48��5,q$y�+�g�3Mg,+�b�ZBQ�f>�7#�E��[����+����e�ed�È߱��c��2h�Y���$��_}<{�r�"~���h-��	z�X/
t>�z�=ϏZ�nǑ���<�w���I@$�p�f���$+�9���6<�ٺ��_��#HO��#���K� &�A�Dt.�?B�ňd*"a�R�˦��l��/%���T]�7����Xò�ޏ�:O˚�H�]Y�MQh���X���H���Y�0nH8�����G�o��0����C�IM�����vH̛���{�o�}|t�z?�m�P �w�w,EX#;cX��'Y����K� "��WZ�)��V������l�>¤�
|����([�6V�0��>T���rw!G�t�����Y�!�(�0�Ңz���~da����qu��ZTnC������n���J�ic"f�oe��2 d͂���#r�L�qN�H��":�L'o��3�kvH"Z���]tx~�m&��P'`(�Ԯ2��/�P�|z-UW�#�KZD��h��� ��|L��c�&��}.f���fW���e->^K���o��vQ�ze��m�G�Ά�z�O�,�t�=�
f�9��.#��s�%�&�w�Bid��0X�沖r,�3���:������C �f-��mQLs�E���N����/]�g@D 0PxSY�ʏ��y����Gu�I��]�3�Խ
��"�DΈO|�υ�]�NO�_���̈�.ևԉ�[�>ɴD�h{�����̝X��s+��c�k"0&(��
�3 ���R���}$9;���ݒg�:=�����g`<{\O�Ow�lH��������T�E|H��X�������?��G�muO�
G�?o�Eg�4$��s𾴋b*;w��,+	��w�m#��B �,��$!��|oIɪH�n�q/PPYX�!����Q+D�l݊P���Əm��^�����,�-�N���u�!*$�nF��_�>0Y�����Y�Y��W����ӓ6�C��4�0���W)vx�ej�qS*�=��p�ϔr
��*KM#?�rˇW ��D#6�# MuR�p�g��"W��"��9��ѩ��G ��I;FMTJL![�&�T�F����X��a<�7�m��ΏM��J4�$�r(̟�����;�.-��m#���th�]j��W�_!P:kb0D}��I�p"�e[�X�z 3"#�C��1^��o�_��c-eX���a��:�-[��d`i�cM�P���{��<2���*|�E��������3����U+Z��S�W���dp2I�`@Tv:[�#���쳿�P�$���� 0RE3᠋��΋'��,{���]\�_����p!��nb�{�"ʧ�E��0�U2�L�5S"�U�+.�}�(�ע�c��#?��Nd�x�B��Lʏ�b�9�� �f�=�RaPuFגWu�dL�Wa���:-�L��(�A� oj�E^������P��3�5d@�5�wr���)H�i-I��g�zH��Y��%1���W#�u��qɎ�}mA�t&��W���ѵ��֕�����`Z��ܰ���	��`����x����Ħ��g ت��_����Bڦ(lw҇����(A�u�p�5nps�M��Bb�����S��/�pW5��Ͷ�-�2�gɲ�����O�_�X��VԬ��P��ѪU���H)ѐ���Lf���eɿE�Y�B�p�uطUc<��e	wߙ�|�VYD&�!j/Ρ�@ m mxJ��a��h�!3�!2�����H����05��m�GA��+r�m��ŚeN�r8�wߕ����IT�C^�։N���e�=���-��Br)�!KHM��^n����{�s5�!���	��d)��a�(�fz��psW����v�7݆��̿�&&?
B�  ���A��g=�Ͳ���[t�:��cG{���X:|�V��ؚ��)�2Z&�\�yo��\�W/�v�%�Tg{b��������2���'�C}�p�5+i������y��l�QH2��
�A/0�G�L؀%���쉅
R"&RT����R�YU�X���^|�G#Aj��@'�J
Xp`Rl'B�'�c_D~s{K��y����;�C��FV�Ń�`��(XMc��҇�?���U�R�>�HC������Ru���0Z�'��h�ҌƑS�IN�f%א$����֌D5�B�1M7&4!�Y0��:)�i룸����eLZX�ii���b�S�%�fSd�#�y�5���s��'�d��������Y���h$&���I ����-x,5��xږ�]_���ʐ�|u��<F�B !B�`�%����*�����J���~�!Ԓ����C�bDc������{���
E�)|�(i)YF�V&%�N��1g�������\]�Ea ����	�!�=[F)����dV��F�s�hDw�s�E�n}/eRnI��t+�"�q�s%&�iR��p�٭x6�+�تh4�����P,���1DwުfX�0�uOY�=�tXw<Z��xV(��*�l�1as��`6��p�	 �.A����6$�z�↢�j_!�h�Ðs͹ uT�Ay��fN�qL�'���W��>��t{�ݲ�S�t;��z�:���{7�ma{Y���OשHlE�&'���ᔿ;�CQ���`�oC���{��リ���	�I�rm�@��M�{T��yOh��4žfl[�Pi�i�e�>2 ���h������ZC/6s#�#}��sb�����J
�&�~����L�+vxĄt
�kj~�QU���[�m3�&�)>t\�U� (DY��s#��Y�H|�?�Xe$�����,A����>Du�����^�����*��몀"�"�Y
�%����N��rS�L	���g�u�ǜ��D�&b��P*DjR���
�y;�r�����k��) ����amZ-3���_��+��i�yd�Jx)#�o���p�C{^,a:�I�k�F�Y�g�}������n������p�t�FGHg��-{�' ��y��4@cB]��z��6,D�[O���<)X:#B7H�J�4�y��j��xE�9&�)Ga\zzy�䴾/LaR�[�d^,Ԡ� B��s>�p[�-G���<�y��)j �E�
�c���eFB���xepHr-Z?j�~>�i��A�#˖��E�.�J ���I@�H��B���B���
A
����*�]��붑 �Y�"�w�F˝��L���Һ������:��Z�,����"+M�P�D4�  "ix�V]��p�VNB�铱c�}"�K�!/j���[�9��
\�m��Vv��S��ܿ��3��L��ZZV������1d�"�mz}�A��1)�ʹ��*^�3�#;��Z����'U���8H}tj��T}1�m��T�z�f�c��ib��v��]n3]�Rb"t�tTixݘy��X�?�Ig+ P:�(n�Ntd���蒙��?&���F��/���⪳�a��e�z'�Gi� B��Kn�<^{������������ T�93���1j#?!�(8���dF)m��H�?u]卽B�X��6�.=B����LP�<%f�	�`��*�!���e���1��U�z�3�%����%P,��r����Xy�߫�=�_dR�Ke',����=�������(�n,x�`
� �dzb�>
?)�d��*hIyG$JC�Y�ol�����V���ҌM��"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamicAnchor_1 = require("./dynamicAnchor");
const util_1 = require("../../compile/util");
const def = {
    keyword: "$recursiveAnchor",
    schemaType: "boolean",
    code(cxt) {
        if (cxt.schema)
            (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
        else
            (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
    },
};
exports.default = def;
//# sourceMappingURL=recursiveAnchor.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      �ط�R�͗�V�C��B $��b?[܄�;l���å�����ՠ#ƀ�:TV$b\m�̝�$�P�#\Y[�._�(�*ِ|���AG'_�r���~�1 �D]��NR׎�����d�A��7��9�����#R��)�V��\���z�;�L�(��)��̃��H���iT3�4�~cEk�L���
�Ν�K��4q�k�C���>'s�L���I��)�g#�H�頲������ �C�A�W����+ƨ��M	�7��Մ:�W��l��P_�i�,{��,\�����,.�=b9�ݯؤ|�9�d���qA6�u����*�b3����p���/?".h1��O^�m>�2i gAX?f�p��TD2�Է/�qsR�}�6mU׌���4�q��t�i{g�d�e?N��$�p������4yER�k�_+h��70�
�!��+Y9O��	��`�}�oxW����8?Y#�-W5���Cl�Bz�"W8ξ�#�i���^��7J�����Ĵ��Y$!;�
�y-#��A	LO�F�gⷙ2�����=�3���Ze�v,J�`�^GE��GC�Ї�yBA��:�	Á������8�B�Kyq�L�.Y��'���h��<'=T;-���D�����A��4�	��y���j
�I {*8� �+4!�Ø	�������O�:�q�R;��Q�ǩ��ֻ#ϿFZ�:��3���Kn�բؚ�L�;K��6?Fp��;m��b"�� �3�şj����d^Z�
��$R��&S�]�&�U��Y77�#�"��o�t��vN7��JC\0�g vav�^;��~~���T��@
t��!,�-�d�A�d�yl"n�X�K��a������k�}6y��Q�a�*.��,\S�}�����(��O����y�Xh�-$:�*t�"�X�T����KA&D�,����D��{�C4��@-�9N�?I{�r�ܝ�`��+��"��3h�oS��ϸ|ʽظ1���s�S 8�O8X�>���V��	�㩙�XW}I�MO`'�6�]��w���`|���U��SNQ�2����s�S�3Z�J���a.��R�Y�
)�]�B�Z��;����ѝe�W=���~0������
�Y�9z�u�q9w�b�k��o)��9��7|7dܩ�n�D*��rs.Y�3��9��>H����y��\r2s�H&���I
~St��,x�i�X(d�>����T���������v������]��$j����Ր��;�Ty~�Y����KcoF,v����@4�%\�v��bv�X�7�09T08W� 	��� ���R�\�`8'2��mi���+�M�C���ֹ'�)?	2JG��SG�1j,<��^0���M�<@- B
'���o�����A�J��є��	�Ws�/O������ ;� �!� f^^=�����C2�Y��><2�Dں�5� ?�pT���u�$�l��<=�����C�{y�Ȭ@���q��Rr��0��pe��{��m�b�����-��i���*e�����p�M�2|e^��w�:
VW	 H#�'rPuF��� y+&0�Yt5�_B"�����i1A���z������e��Ϲ��~�ﻏ�*  T��N��2����:��%�-��R�V,���Ug�whc��$���2S�I�A�C���՟
��vq�\�������5���=��ƶ��V�ƺ�m۶m��8M�ض��I6�o��������>s��3��̙[�M>����)��e��~�����w�������":
�{ ]���ĩ�`�^9�g+I���h�������� J>BI�8���4V�8z�	��{ʃaZhZ7_�'d���3�"��K	?��of*>��V9)�a|��j7��}�E�q`!:#i}��C�N�W���ɧ�_������@ֱ8�,��U���:��.��D��H�_*s��)�/�B��.r6��A�h�����8~����g]EY�@�ɬ]��I��@(9� ��� {\�Y�✶jɘ<ьY
���|�۱`���`k�A�,�!��|�`��X,�z� ����"��AY_�:E:F��%��{��x5��n*e�Q�+��]�5U]��PG�W2E\0?ZJdݸx���&2��Cݷx���)n��`!�ı��\AY��!th� 2\h�����5 �RL���I�lSN0� Eٚ�A~����.����i�$xl�g0�������cK����o�DyhZ�x c�ǆ�DX���u��^6$��f}..�%�C�wD��Nb*a�	���6��V\I"1���Q��pI���=�'wOph"9&'���
= ��XD�(������A�a1Wa�����^�n���,�25[Y��֬�4��(�	|���
�TG�!��N�!d]�D�	���+SQ��B�C�h,�;�^��[�I�����.�Q�k����B�~�!Jm\v��*���4��ϧ*�~�Ka�q�+��ͷ-2Q�^Y�L�..H!�	���w�s�	'	Cﵪ[3~�LF��N�wi�J����b�f��zq�Z�2��Ds�Hľ��~��.��=ݴgЭ?آ����	k�������A״�`$j��_���q�t�B:J;?%�jsQ�����L\��4.
א��_�{�?�X�^�E����\��s����ʔ�@'����Ż�B��r��YnivwQ��P@,zK8��X9$��6� ߔ��� �A��Z��p�tQ���+�t�Vo[���e\�
��挦���-e�j�&9Wv~Y�`ј�g2��@��)���4�}���������)xC���-
���75��qÔK��ۓ�u������dN{;ʖ,<�B>�.��8�L�"���0�~����"en\��#�E�)�����u���$΃ԿB�մ@4.k)����&`��t.	 Ĺ #P�Vw��*���Qڤmd�h�$�������Pj�����ꐚS�m$�f�ق�C��5`��g��?� ����HN�b5~��VhW�&S��c1W�� io[�e�����c/��g<Af��b�Ȯ}�$G������W��1������>r���P�"A�۝��%h���\�I"9���\�WĄ{�����-{�fG7U�X^a���A� V*c�L�)Z���O��ګ��	�D;v�pm�z��$b�U�f��uԀJ����Yk�i��&إU��QW�.ݗ_9�e8�3j��_k�w��~l�q�S.�)M��je�cM2�f�1F<s�'l�Q<�Kz�X��"���J
n�l7��.i,�Nb��~�JT.�>�}���h �Z�a��i�ŀ��*}ʾ-[S`�͔|b%h��	�h4�an��t��f�5�z��gvZ�E�ߥk�'�c�9%ɢ�b� n+��Ch?�L|�U�V�kM�q����v?z�5WX<kK���z���~L��<S%�M��^>��.��[�h�\���<�YNr;J��*�&A"�����)�q�f�IP�Fol=J����n���(4�2�~� �&�3�W�~g|�����Έ)<��p�L>�g��v�f�]^�>k8F���4>	����G���FM78C^]�u.�Ƴ��5QXs`�+w�����υO��n|�5a��g�u�f�Dji򴣄�g�=q�S������ӟ:�+W�����6���O2	�RU�ƍu���tYs���&LVROE��U�^-�O^0N����:u��Q8����j����W8���T"��Q����$aS��:��f�X�n"��m���{���Q