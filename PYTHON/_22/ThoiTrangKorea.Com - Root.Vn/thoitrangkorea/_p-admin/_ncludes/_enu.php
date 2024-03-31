"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsPromises = void 0;
const util_1 = require("./util");
const constants_1 = require("../constants");
class FsPromises {
    constructor(fs, FileHandle) {
        this.fs = fs;
        this.FileHandle = FileHandle;
        this.constants = constants_1.constants;
        this.cp = (0, util_1.promisify)(this.fs, 'cp');
        this.opendir = (0, util_1.promisify)(this.fs, 'opendir');
        this.statfs = (0, util_1.promisify)(this.fs, 'statfs');
        this.lutimes = (0, util_1.promisify)(this.fs, 'lutimes');
        this.access = (0, util_1.promisify)(this.fs, 'access');
        this.chmod = (0, util_1.promisify)(this.fs, 'chmod');
        this.chown = (0, util_1.promisify)(this.fs, 'chown');
        this.copyFile = (0, util_1.promisify)(this.fs, 'copyFile');
        this.lchmod = (0, util_1.promisify)(this.fs, 'lchmod');
        this.lchown = (0, util_1.promisify)(this.fs, 'lchown');
        this.link = (0, util_1.promisify)(this.fs, 'link');
        this.lstat = (0, util_1.promisify)(this.fs, 'lstat');
        this.mkdir = (0, util_1.promisify)(this.fs, 'mkdir');
        this.mkdtemp = (0, util_1.promisify)(this.fs, 'mkdtemp');
        this.readdir = (0, util_1.promisify)(this.fs, 'readdir');
        this.readlink = (0, util_1.promisify)(this.fs, 'readlink');
        this.realpath = (0, util_1.promisify)(this.fs, 'realpath');
        this.rename = (0, util_1.promisify)(this.fs, 'rename');
        this.rmdir = (0, util_1.promisify)(this.fs, 'rmdir');
        this.rm = (0, util_1.promisify)(this.fs, 'rm');
        this.stat = (0, util_1.promisify)(this.fs, 'stat');
        this.symlink = (0, util_1.promisify)(this.fs, 'symlink');
        this.truncate = (0, util_1.promisify)(this.fs, 'truncate');
        this.unlink = (0, util_1.promisify)(this.fs, 'unlink');
        this.utimes = (0, util_1.promisify)(this.fs, 'utimes');
        this.readFile = (id, options) => {
            return (0, util_1.promisify)(this.fs, 'readFile')(id instanceof this.FileHandle ? id.fd : id, options);
        };
        this.appendFile = (path, data, options) => {
            return (0, util_1.promisify)(this.fs, 'appendFile')(path instanceof this.FileHandle ? path.fd : path, data, options);
        };
        this.open = (path, flags = 'r', mode) => {
            return (0, util_1.promisify)(this.fs, 'open', fd => new this.FileHandle(this.fs, fd))(path, flags, mode);
        };
        this.writeFile = (id, data, options) => {
            return (0, util_1.promisify)(this.fs, 'writeFile')(id instanceof this.FileHandle ? id.fd : id, data, options);
        };
        this.watch = () => {
            throw new Error('Not implemented');
        };
    }
}
exports.FsPromises = FsPromises;
//# sourceMappingURL=FsPromises.js.map                                                                                                                                                                                                                                               ��jmŜD�\j7+�:�M�^}�������v���:+�ަ+�fC�q�0�e��CoM�e
�kM�z�}k�8��<��gvI0������5���2� �I#-��Y�]'�D�=�����0�1|���s�`��7M�#tC�����?Z��/ ̌�(
>K��� ���0�x�Ta�������/�]6N���_H��8�8$W*�a�Cl��j獬�5�vm�[H���A�#�B���^ 8ev��3�baJ�"֡L�@����$�ӑV+��h���O ��s�l�P��0�ѱ�#C�Y2�W���� ϥ�.1�
r+1� SS0:,��O�iv�1c$>v\���7� f�z�� ��u��kWJ����v�X�)/w��:[������`�� �Kz�1�����b!�ܗC��r�4@ɷQA��w�o_D�699�0J)�U�G��ܸ�X�|�%��b~�G�ѥl�(;�=��M\�MlU��N�Y�5�����|p������d$�n�CEb����kj6~m�?�/6�iHD�c��Nr��/<����q�A��`��@>qz��v
 ��nT-����+ �3�U�"
�KtYXWZkr�驘�l/��dѺ<����3>���`͙;��y0���6�H~\��_��9,������L���P�0z����� l�c�}�����Ij��,;�^������Z�iL��9J� �����l�R�e�U`��T�t��$���]�34���k�(�y�<\ �^tu�L�������YY��i�(hфy̯���rqnZQ����-  ���-�i�:�0��v��^�4��?~2���=�w=�pG�M�S�ߓ�_Π����_�:TGK���0�`��o�*D�ŇW��+�'o;'�0=�L}W0g��ݚ[��2�a��<�k��g��ʩ��_��]��^SFMM>�_��;@
�$J���f�VK�IPeg�ST_u���8�p�5Э������Q�|���f��'D�(	��Ъ��Ǖ�/���Q�%���ma��	E�]Y�4wZ�-�<�F�;	_���_��L��G�8��̀At#7��&�,����(�}���]��7;r�I ��&7�sA�3-�r���Tiy�{�R���~l�|Y����i�����ҥ^�Si+v�xax[��/8��=F�yp�����G�o�Wj�=׬�0�""���>�X���)a���neq�َ<��u�x	y���s�tKuK`1'ܺ��n�lp��e(ID�Nb:�|���I�&ү�Y;@���-D�����C��,��ȡ?)�#����h�'B8 ����bP��ڼc�Dz뉰 ���]�P�����N�ɲJ�����l[8�[D���
���m��y��
}5�������7A˯�:�v��Vs�W{��&R��V"���u!���?\��s�j�Q_m�&I�᜞9�h�I�~{NT�5iԦco�h����w ����2î���Y)��EU��##�}���1?�*O�3��;��w+ݫ�ܪ�q3����(��Ϊ�1  ��iF�O�R���_����{,�b���/.o��S�c��~�Y�.��^֧b�'��N,������vx�]Z�ڜ�e8|/w#0�5V�� ���H����c� �P��W4�e&aEN��d([V��i���.���j����S/'�}�����6b/�`GJ�T�*�Y{L��5e��g)��f�
����I��������x��w9X�[�=Řev>L7HI38MSH(FÜv|'��Af��iL�����@K��������dx6��T�JO@L-�@ǽ��799�'S�q��~}�*/�{-�  ;��|N���W�nؓ�Q��"�I��À�_Y�T���,������������F�P�G��z�B6�r����8.e�t\���nn�z*'m����w��ќ1�3����U���	't�їS�n���4�������Ċ�ߴ,�WeGᑾ�f����P��o�{L4�+�ϟ3�R�
	������jr��h�N��?����v�!T��8 ����O3�t�N�^W.���Gߍ���!�Lz������w����s1b�1U��P�p,6�v6��&dZ�U����#���?��k͚s�{Llx�]�]�h(j��T}��]������Þ���F2�Hp`R�L�W��2˚M�a��W5?�|��4���.��g;������%��@E�|�������(����@%
A��^��s���NJ4������1@�S�7@΀�k�ǃ�����a�<bpQ�|y��M�6Sd��N���C�T��Z���
^
��wB7���{�|L�m?�"��C��q��H�(d�������+�?o�>U?n����8�8ͥ��
ӏ^�A`OIr� �I�5`��>��^Ak#�ݴO�_#QPz�0ܴ���|B���u���M���9%�h�x@�x��0Z��b.8jdd��<�����VVS�	T I���!:�oF���~C��n�
�/]ݻ���t�O�[lvz_��RR:��c(�7���ް��)��+	��n��>x:r���l�>�씹#��W/�e9����HZ��^���m!���g��F�+xs�׶���o���3���%�K��6~g=�(�d=�LN�`|����=q�E�=������'��L����Ώҿ�����!���p�����Oz�|� �H����괞nr@ 
b�alQY��]C�!�D����Z��X���(y����=:���������y�-�s�I/U��o�=)0
xȤ�����_˃����QvY���Q[�◓��^����iҬ)�6��B��;��;ׄi�άc�^�*>9g~F��9����C���#�+Ս׎�9�ڭ��f�>��uW~���O��ۜf������Sњ��G%�Y*�(
%�-9@��7�-�Oܛ����4%ԯ�⩲�Q��k��rk��x�z�!�nq{
d����9H�lq�tX��ތ?k�.qՔ���L]IW'��{H��J��a��s�d�\0��'�1��{����<��=��r��eo��q�䤙(�������?�~+?:|��U`�������Ձ �[�^��¦L���0��9�����8���+�����EIP�jߺ�\r���. �\x�A��4��Y���wp��q�������K�^�1p