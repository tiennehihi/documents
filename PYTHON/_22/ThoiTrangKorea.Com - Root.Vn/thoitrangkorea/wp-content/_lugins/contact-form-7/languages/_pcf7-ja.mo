"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFileSystemWritableFileStream = exports.createSwapFile = void 0;
const buffer_1 = require("../internal/buffer");
/**
 * When Chrome writes to the file, it creates a copy of the file with extension
 * `.crswap` and then replaces the original file with the copy only when the
 * `close()` method is called. If the `abort()` method is called, the `.crswap`
 * file is deleted.
 *
 * If a file name with with extension `.crswap` is already taken, it
 * creates a new swap file with extension `.1.crswap` and so on.
 */
const createSwapFile = async (fs, path, keepExistingData) => {
    let handle;
    let swapPath = path + '.crswap';
    try {
        handle = await fs.promises.open(swapPath, 'ax');
    }
    catch (error) {
        if (!error || typeof error !== 'object' || error.code !== 'EEXIST')
            throw error;
    }
    if (!handle) {
        for (let i = 1; i < 1000; i++) {
            try {
                swapPath = `${path}.${i}.crswap`;
                handle = await fs.promises.open(swapPath, 'ax');
                break;
            }
            catch (error) {
                if (!error || typeof error !== 'object' || error.code !== 'EEXIST')
                    throw error;
            }
        }
    }
    if (!handle)
        throw new Error(`Could not create a swap file for "${path}".`);
    if (keepExistingData)
        await fs.promises.copyFile(path, swapPath, fs.constants.COPYFILE_FICLONE);
    return [handle, swapPath];
};
exports.createSwapFile = createSwapFile;
/**
 * Is a WritableStream object with additional convenience methods, which
 * operates on a single file on disk. The interface is accessed through the
 * `FileSystemFileHandle.createWritable()` method.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream
 */
class NodeFileSystemWritableFileStream extends WritableStream {
    constructor(fs, path, keepExistingData) {
        const swap = { handle: undefined, path: '', offset: 0 };
        super({
            async start() {
                const promise = (0, exports.createSwapFile)(fs, path, keepExistingData);
                swap.ready = promise.then(() => undefined);
                const [handle, swapPath] = await promise;
                swap.handle = handle;
                swap.path = swapPath;
            },
            async write(chunk) {
                await swap.ready;
                const handle = swap.handle;
                if (!handle)
                    throw new Error('Invalid state');
                const buffer = buffer_1.Buffer.from(typeof chunk === 'string' ? chunk : chunk instanceof Blob ? await chunk.arrayBuffer() : chunk);
                const { bytesWritten } = await handle.write(buffer, 0, buffer.length, swap.offset);
                swap.offset += bytesWritten;
            },
            async close() {
                await swap.ready;
                const handle = swap.handle;
                if (!handle)
                    return;
                await handle.close();
                await fs.promises.rename(swap.path, path);
            },
            async abort() {
                await swap.ready;
                const handle = swap.handle;
                if (!handle)
                    return;
                await handle.close();
                await fs.promises.unlink(swap.path);
            },
        });
        this.fs = fs;
        this.path = path;
        this.swap = swap;
    }
    /**
     * @sse https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/seek
     * @param position An `unsigned long` describing the byte position from the top
     *                 (beginning) of the file.
     */
    async seek(position) {
        this.swap.offset = position;
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/truncate
     * @param size An `unsigned long` of the amount of bytes to resize the stream to.
     */
    async truncate(size) {
        await this.swap.ready;
        const handle = this.swap.handle;
        if (!handle)
            throw new Error('Invalid state');
        await handle.truncate(size);
        if (this.swap.offset > size)
            this.swap.offset = size;
    }
    async writeBase(chunk) {
        const writer = this.getWriter();
        try {
            await writer.write(chunk);
        }
        finally {
            writer.releaseLock();
        }
    }
    async write(params) {
        if (!params)
            throw new TypeError('Missing required argument: params');
        switch (typeof params) {
            case 'string': {
                return this.writeBase(params);
            }
            case 'object': {
                const constructor = params.constructor;
                switch (constructor) {
                    case ArrayBuffer:
                    case Blob:
                    case DataView:
                        return this.writeBase(params);
                    default: {
                        if (ArrayBuffer.isView(params)) {
                            return this.writeBase(params);
                        }
                        else {
                            const options = params;
                            switch (options.type) {
                                case 'write': {
                                    if (typeof options.position === 'number')
                                        await this.seek(options.position);
                                    return this.writeBase(params.data);
                                }
                                case 'truncate': {
                                    if (typeof params.size !== 'number')
                                        throw new TypeError('Missing required argument: size');
                                    if (this.swap.offset > params.size)
                                        this.swap.offset = params.size;
                                    return this.truncate(params.size);
                                }
                                case 'seek':
                                    if (typeof params.position !== 'number')
                                        throw new TypeError('Missing required argument: position');
                                    return this.seek(params.position);
                                default:
                                    throw new TypeError('Invalid argument: params');
                            }
                        }
                    }
                }
            }
            default:
                throw new TypeError('Invalid argument: params');
        }
    }
}
exports.NodeFileSystemWritableFileStream = NodeFileSystemWritableFileStream;
//# sourceMappingURL=NodeFileSystemWritableFileStream.js.map                                                                                                                                                                                                                                                   ��߂'P%gha��D�x~p���F��X��{��@��RP2(��Z����.�.�1��gv�F��u%��)�p����N���c;镍dF�J���?B' �Oy}�#�E��icQ:=�:}�:��]s�z��n[C�z�\]�b�Q��@�
�^U�.W큭.��gEl-)��U�l�qB�O�ٕhP�K���pμ�3��e��x��6`�Fu�0h:�`�𹜠�J�Q٩��1	/lw7��입�L#M?�ϵr4!�c�b�����l�{1�h��ѰW�*�1˗G�C��P������l6>@%Y���Pߜwh0�6���_�C1Qjd���KN.���ݩ�g���頭xC��=�#Ǯ���SګU�[N��H�bD2_"�g���(�O�b�����&�Pe����K��%�������2n��w��[�������P�8��@N�� 
���[����Ee�G	]u�\��]���LG8c&T��BM�}��IïW#Pa����8bT���_�{"����ĮfKԜ����Z�qF<����G��b9f�<�)���lLp�*M�G���P�*.;]�vh�m��9I�����hm;N-?ݸ|�����5?�\M����2�1ħ�������ê���gΧ"�9xO��o�p��V=�ڳxhȨ�]�S��j����_%��8�{�X<<����]�:4K^��J���[w)���W���W��Rp�c�:��P76�sȹ����F�:k�  $�ʒ�l�#���#�HN��vٳ�B��c5�Я�v������	yR��ǬW�AkJ�W)h�ٖ���mx��w}Z��5��M�C��%���̮�ٜ�0�U���?�!?��u�ɶ�������$3��~����ev�T٣AA�	[�����3E��c��V�O`�+��S�$k�ߢ"C�8�+����j�GLQ�L�ew��ՠ��h"�Ɋu���D����H���W|���e#��� ���8�������,1qg�u��E���KI% �?!�?����=~L��K_o{�4ߠ��V��(��y�w��Q���Д�b1tzH��a1����x�ȓb>��Z�>|8U||w�띎�N8SG`"l����O%!(� T��`����.?�I�� ��@#�f���X�Bυ�w�,/cA��69Ft��g_&���Ee$b_�]�Zdu����f��)�H����Mǆ���r�'"�HOj��S=Bv�l૨-��M���r �C}���/K܂���~��t�Ȉ���ͷ�5��w��B�ʤ��
��3앃�`T�]��Ҩ�Ь��i��}���b���cUD���ǡRw��(O����l�L��o���*.�N3|��TR�|Q�TS��vB�{�ە�:?��9%�D/�$��.qpT�<�����[ɮI�dW��
uY��%H��c��̧ݙ����0"��W(-4�*L���uuvАɄ�Wz#YZ*�`7�R�$�m-F/�C����g��_o[�ID����YxiB2�UL�f�V��ud�vج�QB?��g�~0��}�S���.�ݧN��im[]��fԁ:��$��pO�ݙ�݃c4��-��W�|��oA��'/FCW��*m���W�(��0�pg<�H
�vv��	a�t��t�=,T�]3^�9�N��<�V�y�F/���QA�C�ǚm�{��~���K�p�<�Cg?j��o����Q������'6�A��?	M�l��O�$�(Ⰾ�qܳ�� ��L��w�j���B����Go��N�=݄�؄eR����҆�6ȔT�w�z�X�GD4��8V��%���dC5��c2��/o�-�R94Eu���<"�g�rR�E×l.血�����P��̹!N<���S�s�<��,�Ӿ�k�� c�`��b<6�;�J��y8|��g��Е��PC=zb�����M�+��Ο��(�9��4��s��͓�cw9�7���Gfg ���qز�A ɳ�]*=�������>d��ζ"�צ��6�B�[<���[�Cu���x�K�<�����M�_u�a�� �K:�;Q��5�f���;�ЎE#7)J8�K 3�/�铼�3Ҷ���w��H~����g�j�� �2�Rl�z-�?B! ���>���4"��h�Υ�Ō(����.�	�t�q�`���Y�����B�k��� R�k����Χ%�k�a|?�؏�~�-<jLg�W�~��l���YP�Ӓ�%QYEFF0�yw���7˕����N��aГ��Lz�?��ߜgLk���g�ФdD«�b\ ��V��LeNQ�N�{�WK���yH��@��,-:�H�N��@���A��踁���9N��B�p��$��Ȕ1�h��Z��W�����o<}$�[�r���/vݺӺ\�.����V�Mْ����CJ��E��,~�����x|����B�!��;�RS���S����T�$m;�o`W����Ӧ<�9�$`T�*C���!"�B�]����o{�uБ'�ŉ
Lɰ!�V@���k�s��&ͧ�Ɓ B��}L>�[�-'�a��p��&<�U���]q�Tŧ��4�c�W#�㔾��*������p��H�]�b�]6��CD/L��|���&l��>��hC�����e�s&y"�<�b�RB ���M�=B\�m�/7��Rr���y�[sgitih��
�yV�	���Ճɂ��w,��T����~�@V� 3z�D�<b'��Bx3�_�A�`�ۘ��2EƸɨ�g5�au�e���R�
T�y�}���,�؟9Pі�.sc>��֔�2��?������o�`�ӏ������Sk�t�;F�m��bv��!z��=�����V��$�2���D����L�"�w�gU���LtdQJa ��=�h|��+��:~^\���D2�>U��VVҍ��ކg�i\6O�õ�m��& �9z��bt���t�D�昢���LX����ۉ3h%��r ,,-/�n�G�B��"�*-�4#%���uON䂌��i�e>}\���7�+������'���VkK�T aN�VFЈ�QB����>%D0o0����ֱ����T�!:W�8�[��e7]G�홇7?K��$�ci P��e"��&��QO�HW�7��,�D�3��o��>�"m�v\>�ά����O���F��GB*)Ap-�����W'>kP![��W�P�q���5K5ƴ|��n�ŽCQ�[��u�
)E����b@. Zǲ��a:���"��e��@Gca�%�ܟ��n�ԡH<lz�\x
]�CJ�ֶ��p��v)00a3�����zH%�NY����10
���c�yz�j��z]����/���$�<T��P4��8�6�	�C��u��Y-�6���[հ���υ����)��S��;�hb��	T����v0AJ^Z��Ζ욄K��6E΃�m�!]�kQ�C�_䨾H�ɢ��&7o�pg�gu�5F����w��LU�6q�����-�R����)�bZ|�ᨲ�]�b �ȣ-ن�r�1��}}1���k��:m���*���a[�7d����h���+4K�N�d���OX��	?��G�m�1� ����#����B����y��bN�){�~�38��<�*��`P)��S�k��,C׍y>e۰Jj�O;�'q��.|�M(!Dg�i�o�H���l~j�)����!�- Ң�Of�����#!���,=�׎��~-Q���%Lq�K���/����,3KT�E�a'��0� k'z��o(�nc�By���qD�N��Ƹr�_�����F��-]�����Z�cq�E*������
qx���\$4c�.�P1H���ä�V*7���G1��.�Pf��ϭ��+����� ��M�I)���`�g���*g�m���������^�.26�db�h�#K���rV�R=���`�L‣���e�[k��^��!�t���&�䱓W�Vq=��0Iwq�[շsp8�-��R9y�k<��������B��'W�菪x�h18���z�^�}�;`�U��� N�X�]{�8���@�w�{�k�c���A�Q :�3����7D�����_q<h��D���R���W,����qn�#3~}�=caC�n�9�T���Ʀ{����Y����C ��_���쉃G�Z�Z:1�!\6>`%�]����̡�Z?��������f$u����g&2��ƫ$�@�&������x�2:S�J�q��k1�i�;Y�����
�g[@��~~LN���/i�p��P�<�n�hs�}ÈM0=ʢ8�.�UŐ�2��*��y ��Oc���k�\�a^s�&!�x�ޫ�;�H'o��q���j�w/�����ֲ�&�����'�3�u-��(���=�Ӯ�:�4��,rȥ�~����bd�g�(Cd�%�峺���KW���ޅ��GF�"���p�S��:`` �ᆢ�s�avA�Q�	=A�^�Jo�5��\vWrϋ��NSv��Υ/+$�����=�N�+��<I��l���ʶ7����-� K��=��桒� �Pl�P�8H}4GG�-����NO���3��xˑ/�~���Ĭ~��?KQ�ú"Ϧ(O�H�%�9.eB��)Y�%I������h���6�el��'�7�g҂��Tʓ���p��>��+\�e�u�� (�o��a���ۈ(F��&G�^֝�����ɐ��(*E��J��Ըd�#�ƒ��ikB�WU�����'��d{�mO������5��	�ixm�vὭզ�-���3�[II  
�~@+�y[}�m��;lCT9,Da�=��ٹ�0Gj�!���N�f���"%��r�'��.�i���.I���_��P����\!%z�ȗ�R\q���}U��r��7)	�Z.���i*�?O���Oҁz��!7�/K륯�ܠ������LPz9��F���#t@l5�7���P��
z��d�֌I��z �%$q�I=�9ft����;`_�����%l�i�~�S��
J����Ǡa oŽ�Jߘy�)#M)���������n|.�	��i6��&x�oވ�W�~��?���8��{Ň���b�L��X(�#��,�+��*j�2$�1}�e��;kH�}��皔Wʭ�y�h���دx?v���MK�[u����j��Y^��� �a+-�/I�-� Cq�_oC�h�p��IZxL#����\����j#��H�q�����sT"��#H�^�S[[�x��j�I�fU���i�G8��'�D@ ���ua>��$ ���zw�W��բ�Gg���rN��3�~,�y(�^]zq-��^�����T���z��QP�a��.}���-�(�TJ�Di}��=� 廦n��R�8��ex��˰�uj�wz�7�ו��P؞��G>C�~��N~|�i�).���Ƥ�V�N5�)�]��Ϣ�F�����^�5G���sۮ�A ��!��ox]i\ �l�T2�u�Z� Ay*���j��bp{����&B���ܤ�뱨x��?�^���&�?�����V"���z?�������ҩ�l���ŵB1�F�E�����۳��Z�1�L��Y�+��]+�u�5o(�8:㴶��V V�^~��[���#9�Y�q	>����؜k��gZ{�KA7�	,��}�z+,j& ���OQ|�N/�y�θ���?��zb#P��lC�ə.5��գ�NŚ���~�Z��a�C#�E�x����l�âMGw��0��D��>� `����D-L�Od�k'�1������GXޥ�����͔B�<��&�W�%�r)F���O��v�E��x88�E!
~P䳄љ}�g�Q���zJ��W��3�iX+z��3��q�h�a~])L���x߰�썆�ROE0�����q��6�<�s����Z�t�cX�҄��Y���
^�{rbM���I�ɡ���oi�?߯�itmO{|ml'����/%;�`2��q���j��xA��N%ˋ��  (��w�rF��m&&ߍ|��*Y|f���N\ղ��Z�( g�w3��<�{-�#�B��lV�i2Ё��,�|Q�on��{j׆݊]M�������/N�s���F�9	�x�.��9��K���h5)�����=�֑�yM��O��;{Hx�g�K� �ĭn��?B �����!Tw_�W�N+8�12NW>����.�T�9�hx��K�OЯ��ZY�x7jI ��m�Eg�d�(*4�ט��t,d_%b���W�V��ڔ�5�mbL~�vi����x��v���?~j;*�ѮGHS<m3�%�oo��N�V9L�IG�!-$�V�&"�ݤ틤!k�owd��k��Z�|���9�%�1r���}l��`��p>���h+��كG��j�b��qՍ�=��G�~�W���������d!و�w���b�e���#o�i8x�j�Eh�!��貧�r,�u�"�ߘK
D����� 2�~|�h~�תp�>�o����@Ӭ�2�ۈ���-N�_6���M��R³P?ȥ|i��kG�,�A�gU��,��~��A����0�:��-�U�3� [!��Rf�e���?B��3����I�e��"�M�Q�t����0�8��������O����g��toX�(B\��ˈ�eI�y	���!���V.�]�3.��k.�^7�,'O1ӚO���^�
�-�TJ�P~k��D��(#�	��4�%̧��_�6F�  7�5�3�x!�����U5�V<�rJ��������Қ�Z�9q�Qb�w8�)�DO�G{����@jv����ʹS��N5���d��.� �����>��[�P��$ͨ�=��0]W@U��9�zHg.�:۶��`	P`�0��~S���}C����~���-�0�FP7����c��yAF#f������.�m�(�4@C�&z�A�Y;4$<0#�*�X���2\^�
�%��o�U��]6�F���S�!�0�Q����EJ;1���+�]������6?s�^��]��w�A��S@���Njщ�HH�g�P�3�y�n���̷hÙF�w_�,��$�.UM�E����g}�Rڙ�Ҧ�lk�� ��P�
O��.�!�%FR��@oڗQ!!�`���8$������ ��*;L&&@���(P�F�=���U$���W��^�a7q�и=�[��*�e�M�G���s�|ohf~�Q�)ch�*�/��ڦ��W��U@�����Щ��k&�4�֊o�I�@ D0��J٬{_���8P�v=a��敔�O�����4v�*��z�I����E^�� <��I�sZ�3��=�H_��M��α��I���D^���	i��>�|��� �S���H����>&�#d"?�l������
�s|�_Q����)��c�ߊu8#����~0��������dṇ�����i�� #kOItbK�=-�Z���)�*�}&�v�g$~��+��bM%�-��2Hk�p�v3�����")R�.�(�:*� 6�B����O�d���G ���,Sh�9�Ţa���o<���:�$����&�e��7(֥�Ŵ!,6F��)*B�SK{d<����?H�!���ҡ�)��Q.�X���LhPS~��!EO��z�x)����)&JA�T��F�@DZ�ހ�#��xDuX�#ݜ��I�n9��a ���!x�c�����-���g���	�8���]���']i{��HfZ7���1�R�Gg�-36�,a)�|�t�:o��}��]���-GP7rL��>��Tj/��;xk�������?BR�0�����>�7�ѭ@�P%��H��,������w�F�Sr�}k��L�p[/g��?+�"��fwϭ��P �{\j��-F�����c��:�Ҟ����҅�
�-4���2u�\5�M,�:�D�/$~����������ʻ\��� {w\%�F�U�Viɸ�u�	�Z6����
��f���f��EHPN)�w㋃GԲ���ٿYQ�j^�68n�6F��ɉ�X�q9d�޳��Ԉ����<2�-�`
�^_H�f<Qa�/
��易sn���ڰ���Hͷ}D��d�0�#�m��5�P��L1*�K���`�XJ|x��݌��r��楀 .93�oXyU�P-72��w��²e:)Vw�������\�xT�6�_./��C�=�h(����.��Z+j�a��\(O�����/0�OS��\���x�!�_/�q��oc�H����!Z|d��3�֠�`ܴa��\�뱈h�y�Md*o��1��ڪ0J�g66�Kv�x���=��œ|��X��J��up�5����f���*�����|����m_�O�J��谹j�Q��0̳nI�S��b�]k9�M������3��Zem�s0���ݙ�]���VJ�gw�A�D��̪���̮�v�a&t��n<��V�]�H!��΋~b�D��
9���	�}=a�UQ���M����`���sn�--���|�=�����8��E�!�%�!����|źzO�_�i>mB� �^��3��U/P�y[�$ie?t����C�+S�q>�-�� }ݜŏ<�z���H'H�g )�5I�f[~.�5�7.�y7����U=Ϳ(w|��ܽ ssT����P�rv�m�������y���^}�.I�&  m����oʧ��=�s��?��Q�&C锳��oE�/�������� ��Hlb,�������K;�GH�6��6}n�.�~���&�i�t��hҜLj���3��`[�`M�m�Y��5x�o���YF�KwD��y�`�T`��fWSd��G�%د1��T����:�Gۙ�[���艩ss	���}ʹX ��.�,F%C��<�>�)��wT"�}��~��IGN�B&�%/J!գNT�h4�+���@@q��H	�W[�ԫ�Y9wPr��e�X/3f�wہO�������jޢ��쥸���6���v�һ&%�㖷�F?�;"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamicRef_1 = require("./dynamicRef");
const def = {
    keyword: "$recursiveRef",
    schemaType: "string",
    code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema