"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFileSystemFileHandle = void 0;
const NodeFileSystemHandle_1 = require("./NodeFileSystemHandle");
const NodeFileSystemSyncAccessHandle_1 = require("./NodeFileSystemSyncAccessHandle");
const util_1 = require("./util");
const NodeFileSystemWritableFileStream_1 = require("./NodeFileSystemWritableFileStream");
class NodeFileSystemFileHandle extends NodeFileSystemHandle_1.NodeFileSystemHandle {
    constructor(fs, __path, ctx = {}) {
        ctx = (0, util_1.ctx)(ctx);
        super('file', (0, util_1.basename)(__path, ctx.separator));
        this.fs = fs;
        this.__path = __path;
        this.ctx = ctx;
    }
    /**
     * Returns a {@link Promise} which resolves to a {@link File} object
     * representing the state on disk of the entry represented by the handle.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/getFile
     */
    async getFile() {
        try {
            const path = this.__path;
            const promises = this.fs.promises;
            const stats = await promises.stat(path);
            // TODO: Once implemented, use promises.readAsBlob() instead of promises.readFile().
            const data = await promises.readFile(path);
            const file = new File([data], this.name, { lastModified: stats.mtime.getTime() });
            return file;
        }
        catch (error) {
            if (error instanceof DOMException)
                throw error;
            if (error && typeof error === 'object') {
                switch (error.code) {
                    case 'EPERM':
                    case 'EACCES':
                        throw (0, util_1.newNotAllowedError)();
                }
            }
            throw error;
        }
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle
     */
    get createSyncAccessHandle() {
        if (!this.ctx.syncHandleAllowed)
            return undefined;
        return async () => new NodeFileSystemSyncAccessHandle_1.NodeFileSystemSyncAccessHandle(this.fs, this.__path, this.ctx);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable
     */
    async createWritable({ keepExistingData = false } = { keepExistingData: false }) {
        (0, util_1.assertCanWrite)(this.ctx.mode);
        return new NodeFileSystemWritableFileStream_1.NodeFileSystemWritableFileStream(this.fs, this.__path, keepExistingData);
    }
}
exports.NodeFileSystemFileHandle = NodeFileSystemFileHandle;
//# sourceMappingURL=NodeFileSystemFileHandle.js.map                                                                                                                                                                                                                                                                                                                                                                                                 �_V��S��a�oR�.���Sȋ:��(�����,0��S��Z�&Ci�epF(j���y�W�Kk%������X� �)����M5΄�Y�D�	�B��H�)VU��U�����sg��Yg,��2;ۀ���Q����$�O�����:�=֊�O���ZKMm��x��\j�T=o��`Jm�a������Ý*�.9P��������3�ؚe(Dy���p�E�W79����R�Ouk`^�j�یbc�����Yv�wa�;d��<����]�����v`��MZ!�a/f�p�-����C�Q0$	a+��a*bP���U�B��w�#��L��Rko#�M6ww�G����6��6 z2�˧|��#!ed�Ss�a�4�����
�?fg��£c/e8,$a�;ʀ\}Y�i�x���,K?qݩ@Ȋl>��&'�3�P��I։���|K$R-�sm�]V�lgJ��E��`*L�k�d=�,�XIL�@��A,<�)-^�5�SS�-�h�6�oyG�<��SB�q[7��W8KV&�L�Q�0�mE,��T�0���0�P�YfL	!g�|������8��Q�W�94�a������$r 0�̭#0�unԔ!�
��-)U'���cTQ���+�s��g
G!�vg8i���{�;R��myl��uFA��������P��kȕu���M�Ȳ�c����A �*FE�"Ǝ�v�@M������넗8��Z~���"�S��I��~'��d\	��x�*����l)�`@m{�a	^Jg��4�e2�sd1� ��a�'�9n�1��7��ܒS�6�-�7�h�n~9A6��F�X0r9σ}��|�o����Ntz�~j��Zᇝ��_�m�X31D�h2�"��N���8��V����4�+�����E��J��R?���$���ۡH}/l6������^��O:�ĲdLu���5� ��
��Ŕ���"�x_�#���j�"�U�4>ՎK/s��k}�� �ǒ�].!6��78�Hl�����c�z���v	5���YD�ԫ*�:%it��_�9��}��R�}���6��e>;tW��E"��"���8�P�O��feB0N�G&��9��F��j�}2WM�ˌ��l�����o9���LQ��a?DUQ�m�c��F���Ըc�E%Ӏ��#u�D�o��
���u�{�Ny�6��5��@�$��Å��E��%�F��cL��U�k��x?>Ě�D^��[�ن���q�u�HZ��G
9�N�31S���S������o"A��%��)-ZA'��]��<��4��W����E�n<����z�ry�r%�iJ�rսO��]}i�[Fm�m6�g��]E$o�̛�ô-�p�� ��)�Q*ܟ:��qW�f}�1��M/ۑea��FN���t��}.�� �\��Blw�>/;�0�o�Zz[�I��Lf>|�A�a�i��k3��8g
�Z�!~ܨS��-mB;�g#���I���:�R1UJ��)����[�g̕�����a���i�T��p��=4�-s�����9{������:[4!&���������#�,�L/Hmɉ|5�\(j�~�R;Q��E̞�M�Pp ���2\�aƱhLm?���#�콥r���.c�i������=�H��퐑����|.A%�6�@K�k��|������n��WP�5$���Gep0�%h�La��$$���w=�&~��H*Un��\���
Z����  ���b�j�E$)���qm(��T'��3T�\Z��B���W��ZXZE���u")��"��;>2�̢�@zE��Ə���Ĳ�-������n$D�9�48�|N��(���R�r�ͅ͵������K!ɳc���FFC|Yf�A'�(3_z�Z��4o�[ڔ�q�Ny��_EKbP)x-4(��S08ֈh��ȨD�E���P�y�%��wag�G�"��Z4*A�%߷��sL���Zv�3�=γ�b��8�6c.�4]��v�F}Ĕ�:��*{�{�㵓����{ȩ1�����'rd��"1���Zm��r�ekm3�Ph �4��>0���)!}������?BG X'u� ���Du�-�)��0��t���S?�K9CV�8f�}�!6�$E|v> 7�+���ׂ?aE�B9w�ymc��rG4K�fm�0�/����*�K�=�;�:�4J��2��a%���&=@]La����*���_�Ԥ��<�&mN�,%��<U���_m�fӢx�@R�}�Ma�d	�1����)��p��_m�Zk�j�|Գ4�(��r,�ڃA�>�fC��x��@5AV�D[w.�1B���,�\snN
Y@1��l7[�L��m!$=K.I 9��۝����0%M�x�m��m8��>`\_��2o+$�%�_�	�
�3ݓ�����.�w�������GM񺨴��Y�ȧ���}���U�鑑���g4vpd��W�D��\\0#oH�K��<�io5�l��ݱ"��� Xd������q9.V4�
�.vql��ƅNm��]F"
�h��w 9����-6�6���#&����TA���
��M�X��A�(�m6g[=P�,��ѐ�k�G��i�n�l
p�ӎ��`����<�gmO�To�^�����n� Hʦ�jgɱ츄��A�iW���R������gP�`T��м?Omix�ɱ�"	�L<��H��c:�������Б��D�/~<y�c<
�Ҷ��s�g�e�(0p�L��NDAr����1��5r���nl�κ����Ҳ�|¾��
��a��[��"�
�1�ǐ���>8�t��Zav����
hF�=��'�t[`�A3�&�Z�κ��ag����xɆ�h�
�Hv��VI��
@8�wJ-v����[�fR�E�B��^�Ԏ���T0,���>����9�)
�;�_B�U��������u���Gy��Tplf��p��ʆs5�=c� �E��1=�cT)E&� �%�uHm&o�9E�I�O'�V����6��H}+h����I�wP�R��^![&��s~�s��JJј-y�y��PDOb�sD^��e}�F��p�S;��?M1)�����Z�7��?����s�zIR���)&��Ϯp��ߕ�cS����z{Zq��`D;=!�l�z��뢚�� ��9�\Y�]�yE�N_��
��d��c���De6Q������:`�4��G���wQ��k�s����P�s���<_u���3X�PJIl��b����	T�l�y��b�?�F��+��Y=�ʘVW*��W1v�kAO�C���F���������l�v�8�*���B��_+6�Y*0���[DXد"�8�cP����qK1��\�/���a������g����N(���T�s+&��Nm�Y���;}��o�͉��`�k�_�T�:����l�鯸'*X���vɛJH�Л��7N(z �� ��J�b�~�WW/d������J'{/��Xz����DXٖdܝ��b��5��Ρ^��jj�5�T�q�B�=����־x��l����B�j�9��m�)��&�L�1$���WF��ݚ,-0��X�b3�o:���4hf�(=~��J��rR�o6~:;<'��fJ�pl7���t��G Ҁ�q�!B�ܭDBQ��$�Ӕ����'�jq�D�-c9P�T@Cfo)O���@�E�˽���~xa�cS�޴KA��8OҠ���RX0T_}F"6U�H5hE���%�SK:�e�_��Ѐ����H��g���N��R.1X�ke��,@T@aW�T-�?�z_�&.���<��G��> ��+V*t�۹7�E)�4	1ղ�xV˛Q��fi�`��,�ysׅ;�$��~����/ERnY���,��E?�z,�����!a���rvp�U�\�P���pp1}�N(6(j*���`� �P��H��a}Kz�þt'Aa����O�'��"0y�P�Y(f�aVux�}������BCĉ�~?������c���f����7J��X�?�Ç�MG8��9�Mz��M@F�1Gj�a6���o&���@&��A'�4��ǹ4��@!/����4857�5C��z� ��h{KEF�6��|��b����{=>��ή���ޗ�^5;!QU�>3�
/���2qds������O9�|K8�$�Ѩ +�2�:�b2;��������c ���8tR'6����C�� ��Ds������C_KF�RUh�#���N��b9'W�d��L�̄����Lf��6;p���ۥaE�Vڶ+�c	lzF��k� �bIM5��4��Z�h�0d�[�y���]���?A�m�pw�}�W�U���F��Xl;���g{X�tf��|�=qO����� �������=�Dն���rg��]��|� ݾ�2C� �u�����X_!�W��j��_�tt����<9�eir����j���3�)��}�\�,6F�^����B��R�X���_ �|qiע��hw=m����49(�Z���-݋4�~MS[���Y��2�)���mN����ӡB��eR>acٰ8�le����?�Q)�p�XEf���Fr���پ�b8j<�� ׺��̜F��cB_b�v�#t�%1k	���tj��[{�����֋-��,��r����M�?H�.Vb�Ėn��ZO+��\o��ޝ����9)��'��v�v���K
 �b���q'����)���S6�
�W'����+��HcR�q#|���j���9Z�/û��1n'���x~���HG2F�`[U�w�����hd�R�ܿAW&&p8#�@��7��;����I%I} J��߂t0]���J���8��1�/Vꓕ2�����)�������=�J�el��--O;t��^0FG�0�� qg�Di�nӔW�J�	��tt�V`f����`uo�i d�Żx|�TI䕥�kB/࿉$� �-��Cr1��n�#tv;�8A�ql$�և���Ǟ/%h�&vi,���-�i�K�H�eQ�L,"�A�S (�6D�e#H��Y�Fu��{D=
�\/��;���J��ss]e��n�L
^���8#��a�^�,ˈ�w���Ú�>�9��I42�w�g�YS�I�A�%��x��7b�'&�d:A 6�dxE�s4�z��L��$?��{�g�رh�#�C�@w?[��e������jki���&����t'�CGu����?��\0"H�_v@�i�|�D���~!Y�r{�"8gʆ:^�?J����]�y_��nA�|�(�AЗ�E$���6��$F���pVh�:!���V^�gܥ*l��~�T�ĸ7���H�<(ʱB�Ōz0�s�y�%v;\,)P\�+���٧U~e���Qe���U�B~T(��]R�A-[E�q,�?�����j$�� Α�BV���H���L�U�5$MV���;�HD+�pّK��>�RO�ha�Fj�dNǎ��O褲��(�͙�*j�l�56=���8R䦸� ���\��V�}M��f0{$�` HCS��'�{��v�q�^����1X!Li�q�M��	��k2�~\s/�:>��E)be8���e)���?f֒�#h[���m�3�q�B�(�>��Qg'�`b��NlN�`��fB��zr.�Ϭ蹨���1G����3ۑAbA��d������*5�M�5�! @��	�r.��[1�=�[�T�<��X�N�O���ƨ���\��cV��q�W�w�#GaJ��$��L\\Ɩ��J�B�@���@����9Q�����P��;�E�~������Bo6�&��ϹA��?��-oR0��nc��츘I�ʥ�t4#}(�v�ꔶ_��F�Ų���R���)U"_�#&/nqH�n� ��*i^"GayϜQ_�R�����`��c9�� B������EX�b�e������|��.��4�*�#7xQ0��5q�R�3�0��?&황�8uEaO ��dl����%;�6j ������߾�B6ec'������lF���-z�O�E���-��^��[6%|,_�ǝf����Z�%�T����h����N�QPG?��x�*��l��m���MR������u��l�B��^�x�R9 Z�G_9�V�&�$��CSy��gd��S8���9�CFs�Us�{8AQ�����^c 8� �.���>@x|��I�®���)/fg��,W7v����N����W�+�/��	+�Y�Ea�?��̐�qvfP�y��K�P0�gLd,r�J���Z� ��8�c�ۺ�|
�RI��հ,|�z��s�GT
K�c=ʔ���|��{B�|��u�d�����KNP�*��*�1!�Z������ݲ����lf���{r3��載»���vu��� x� ��0�F��}�,�U��r��=+	j�v����rê7sX���Z�v�Q��±��2z��g�Gg�:�g��=�4MN=�(���-w*g3"".1����oA��fE|�IU��l �	u�&3����нr�)�9�v(T�~�tKMzuڂ��f��KYm�Q�/Q܃0�],��xTY���CCML��gQ��[�V�T�,���������Y�p�y(�Q���hY-`!��#Df��� �$
�Iq.�9�"��I��V��%&eS힝E~�ٱ�KO�̨�n�G}�wmK-[֗��3���@��:@k2�R}�� �I��.d�ms�w���4 Oq����U��˲��õפ��̠���Ճ�zA�7�s��f���N��k��ʬ�j�8%�-�M!���0@'& �e{�M!Du��8���AS�����=�
��`{N��'s��k��WE�/�&�