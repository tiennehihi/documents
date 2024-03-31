"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
const constants_1 = require("./constants");
const { S_IFMT, S_IFDIR, S_IFREG, S_IFBLK, S_IFCHR, S_IFLNK, S_IFIFO, S_IFSOCK } = constants_1.constants;
/**
 * Statistics about a file/directory, like `fs.Stats`.
 */
class Stats {
    static build(node, bigint = false) {
        const stats = new Stats();
        const { uid, gid, atime, mtime, ctime } = node;
        const getStatNumber = !bigint ? number => number : number => BigInt(number);
        // Copy all values on Stats from Node, so that if Node values
        // change, values on Stats would still be the old ones,
        // just like in Node fs.
        stats.uid = getStatNumber(uid);
        stats.gid = getStatNumber(gid);
        stats.rdev = getStatNumber(0);
        stats.blksize = getStatNumber(4096);
        stats.ino = getStatNumber(node.ino);
        stats.size = getStatNumber(node.getSize());
        stats.blocks = getStatNumber(1);
        stats.atime = atime;
        stats.mtime = mtime;
        stats.ctime = ctime;
        stats.birthtime = ctime;
        stats.atimeMs = getStatNumber(atime.getTime());
        stats.mtimeMs = getStatNumber(mtime.getTime());
        const ctimeMs = getStatNumber(ctime.getTime());
        stats.ctimeMs = ctimeMs;
        stats.birthtimeMs = ctimeMs;
        if (bigint) {
            stats.atimeNs = BigInt(atime.getTime()) * BigInt(1000000);
            stats.mtimeNs = BigInt(mtime.getTime()) * BigInt(1000000);
            const ctimeNs = BigInt(ctime.getTime()) * BigInt(1000000);
            stats.ctimeNs = ctimeNs;
            stats.birthtimeNs = ctimeNs;
        }
        stats.dev = getStatNumber(0);
        stats.mode = getStatNumber(node.mode);
        stats.nlink = getStatNumber(node.nlink);
        return stats;
    }
    _checkModeProperty(property) {
        return (Number(this.mode) & S_IFMT) === property;
    }
    isDirectory() {
        return this._checkModeProperty(S_IFDIR);
    }
    isFile() {
        return this._checkModeProperty(S_IFREG);
    }
    isBlockDevice() {
        return this._checkModeProperty(S_IFBLK);
    }
    isCharacterDevice() {
        return this._checkModeProperty(S_IFCHR);
    }
    isSymbolicLink() {
        return this._checkModeProperty(S_IFLNK);
    }
    isFIFO() {
        return this._checkModeProperty(S_IFIFO);
    }
    isSocket() {
        return this._checkModeProperty(S_IFSOCK);
    }
}
exports.Stats = Stats;
exports.default = Stats;
//# sourceMappingURL=Stats.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             R� �tϏ�������I�b�+���0֚[T��>ݹ�^Y��6�����diO�
��KJ"�ˬ�'IPi?L���+fd+��g�3N�{��tt)�)��!���kX���H�>D䦊������۝�d�]j}UA>��'D�����F��l��|��b��hO�����Hk��B�[���	� �sw(�O�B��1�[���%�
r#ޕe��э�n�|T?g,��C�W��:B��O��t �Hq�&�����[��N�[x���h]�Th��gy�����lU�9s�+zcyv&�lQթ\.=^�t��b%N���-WV�k��<�ʤ�j	����װR^&v�҉�~ȍ;��DHm�_(�3���I��AIbcR���9C5�`Gf꤂�V���!'o�ԡV��@$,C�x����{Fp]�z:"����lN��j�\�1
���	��A�2�7�E�&���]"e�P��ַ�W���Nk\aӋ7����#Ǟ�8���I��p�8��;��}DF/x��-Y�}�0s]�i�/�9���:t�5x��`5� �oS[��=ӽ��}���I~�Ԧ��TX��g����������s�t������L��´q�3��9ʡ���M��t�gH���.$�V-L q��CYXȯQ�FC�Jr�jf���NVC�ch6K%)��4���Хr����N�0��(�nL�����*��׹��?;��7���tg�w-SJNeт�}UG�R L�hzD����S���Z��~+�?�O�2<.)Ib$hn��P����6�~�\��Z`l��P��-d�g���viW]R�o:��{�����%`��{�G#�޶��?t�'P�d�L}a�:�F�9#��bi�D�i*���C��f9���%�8����#�yxA;U-�:,;�KI�Mg��㳠��J_{��e�'��m�2,��zTlF_:u�Eu|A�f����L�{��q���M1��s��qw�_d�Q����`��.�J��6�?bUP_�����7O��٬���J�>>�Ӗid40<�����X�1��ȷ��C�'�!q�#�@P筪�\"K��,������|!�~��}6�E!ɩ�������DH�x�灂�ɰ�kF[�0ZjWF�԰M����: ���R7r�I�p�<�=j�CW�໛�4������w+�K���a� ��%���ە ���7�cYl$ugPB�C�t���A$�����/k���%̐���h��4z4��"�Ǡ'΃S�v\"�����گ(:�v{*4A��G�����ZJ)8na0'A�ɏ���`��q���|f�֬Hq�I"%'y��BAl���+�uD�S�^�� %6D�r��犸l�>����P��r���WÈ0�R�������V��7�ԓB�[~���������l
_����
�Y8���ճ�ZY܂�����
�=e5�!�	��P��;��k�:Ĵ������GN�؊�c�7��9�m
8��ӳ4�pí|er���5�~oU�P�8˕�i��7��cdt4���{}6޼��^�t8YR袐��Bǀ��7S���;aU�!���� q���Qnc�5���a���$.�	߽陟�H�v\<�2;J���N�lQ���5@>�Xj��qU����7�F�!�3k?�N?��0�Ɍ��}|�Q~�=b��a���X����B��09��U��վ��g�&SX� 0���$a��{z�W����N����/@� ,��*��%�s�^X�\S���C�B���N�7���ŋm}_8u�c�!����D;H�-;o�����P�x>�]�����B�>��O����g
vP�s+��,����"�Q
���o���1j
�=�o��A!�%�C� qj�.+�+Y�j7����1�ǜ��k2��s!�4�~�\i�˳m��oH����ZnH��#����1�>�)�c��2F�����z��
d#�BqnAWӂ6Sa}�*+�G#�=��PbUD�@J3!AͰ}+�:��lk�/z#�h���C�2�t�+QpQ�Z�؈���w�]8{C�	��
d��S+U�-H��<���<�'s*!�1<������������E�����d�۽��Э6L�:�q�G�ơnG�4���,QIvY��#������j���$WhK�P�������>��L��zbw�+ ��x�9�-������v�P��/+�$δ}h�v����>��#�{.2,Kp���?��!�DM���p�lΦ����Pȳ�m������Β;r�>F4�U������9��	�l��9��1?%���P	Z�=-��,bl�W�ɬ�/�osډ[�<�=����4{:o�����K�
,���$l�ܛ�* P�� L?�H�04$:��lK���z�u��'�RBps-"�VNBN<�Ԟ[P����ڜ�5+A��a���aMj���4&ܼ��+�%"��2�d4 ��U��y��<ZQ#9��3ٳy�	�n�h��*L��1y.��^��9��h��O_�b��}�o$I��1=��F_��r�ڏ|�o����U���I����Q #��Ƀ		���E��iMWw� m��;�m�d�Z�)���:�.+wG�V��BovJ��(@���jz���������F^S}�A73�c��,e�@�ʲf񀆋��L~{Da5���K��xS�{E�XF���N�VTK1u���jMl(<s������٩%�V9�@��gOWT�c���#��G��M��$@pjQx((񥯵~� � ����ʔ��cw�2�à��z�Q�����4�k�Μ���]W���ʗB�%�&��g�a�o%�M�y5����>ڏ���}��U6n'f�%��&�`�58  R��dG,�*k��Ğ/*IW4(�r��p�|�q9��Z$�6�h��?�\�U'�x�']��qm����m��Pl3���:jN�>��_ֶ^��_>�^~���޻$��w�1ɟ3ؒ:��X���CO�q�{�3�έ�Ӝy��c轷&�8��~�yl,i;� ��A���H��rp�_k�]���c�D�uF��$�ϱ�V������M=uG������b���������ߋ� o�03K����ba��r��|�����ߙ�1����\\/��6N�+{�/�\��)��7�����8,k������m�MƔq�_{�HP<;z|Ov_�p��C@�a�.��t�
~C�l2��q�+-)�2���g1/���fs�3L�<"#�V�����)Ĥ[.=��:� ��ƀ�z�^/
 �{5���8�\���;[�6�qU�7QO�j�ŝ��[�U;؜�y7����E��)�2ݥ�z�&��I�O��ƞ��޷������w����˺�rn��
N�%������%��e�;,Dj}@��3O���0�&�8�p��md�l\㹍`ۥGc�?��C�PL����ٌ��r����ț\iX���XM����e`-�~c0�͏v���a}���!i�귻p7��D���������{����.!�%]��Jw��ݝҊ����ݝR"ҝ�)� -��y�����{�=s�w�53w�t�4�W��K[f��{�����c���#f��\��Z����C���6�	5�"�����u(; őm96��4֩�:q&|�P1����>70�j�u��C!���#ncc��>~�p�F����DZ�w� 6�E��mV��`�%��#")^'��ʳ��pqz(�GX��XT)����@ Q&jX�$��t�3���ё�+F������5�X�?�=T��d.�r�T���������Lo��d�(D<}s'~*�x���Ma1�c�|m{�I��_=v沤�c��_�D�O����O��<=/m���!��J�)���]:(Zp�	oL���=�����(�g��S����Fe�j�f��	G��	e��u����{`�Goч���"����i�����4����x������!����½Cyo��/k@���C'.�em�%f,�jA2�W���Oڤ�o������T#\�g3�4�d(�qtFx��G	�K/�	(.�(��*��s=�Q���KZ3#,�zsfLs�W��d��DT!)5{�u�����JO��+��Ӈk�, ��{on�k�l����%�C�Ф"FyF�D���''��
�C]���&H����4�.#(�6A$��{Mf�νQ��aBG޺9��6�����X���)H�S�	O�+��$!;K��)}_�b�n���KOE����!���M��c�e�0��Mm��h28�Ẕ,TO�{��2y�Ѣ�9��,z��H��_�K���
�v���m..�EJh�I�+lm6>yF���(
(�a{���D2G�s+z�AzgK�F�?/s&���.�>}:u�٫��p�C�.�k���S$b��dؓt��{�Ut����܍�+��ڕPkmCD���)z�xIF�}�_��Mj�"No؎��"�M��d�|;z����8�3q. $�W �?���p+?_;Vhja��9S(��2P�n��T�#\u���{�%#k�M.5)- ����>�h�|�x���_�˫PRdf��7Ҍ���~���e���v���٥͙�/��~�Q] ,`r����P�$Kv܅��f:b(�.>�G9�m�����fh%nX�XO�j��LMXD�g΍��
�p�|*J�$���*US�Rr����GS���ԄI�������7� �Wl��Ⱦ����}�X�����u�������-~�B���>���JvPS��!6&:l�%�%�� 6T����s_2�m��\gm`��8���=̊e�3
5�$��oAWӾd�p�c�P7;q��
�h�cԲ��<3X������R�$�#R�CB�Ub_3�~$�Z<�|�c���d��t.w��s2n.P����^Pc�P��=�gc.jB����hN�"}����w/�^�T���IUs���¹x
p�G��EMW{�_8D���m͖Ul��8���=��9��x4��D���osN���'Nr�b��;��O�A $PZ��m��M�Ku��Nnt�V��~��s/�p=r[�^C<���	U��((O$Kb����ŭ$��6�u��o��b{o��bN�cy9� �������!�Bd�P�0ݶ�`�
�V���Z��.>��`L�I��F㩫�B�BQ�5&>��_МH�2������ !���g���w]��Qs@�4F]�KXK�i�2K.��E��ie��x��]��҇,X�����(�Ǭ@OpS�TIF~�g�6��ڛ��gqN~Q?u^���Bc�ؕV���tO�-�s��*�*I�w3�B���vv����w�i��҇�
�*;�zA���,ї]���o�7|��_��e�ܒ�5�1L���]��6`s Ο-��.E���xs�6���w�IʫlH�����/v�XW(v�D��E����n�Xp|m���ה�
!���zRCϻ}0!�c��?[��5� 9^VsI2w��D���ě� |�U��P�e �x�����?�׆��h,�m*�Li��Y=JG��#j�^''���%p�����a���ԏ|�-%�{# ���R�B�+��Ɩb'_E�;l����^,KI^O;���iC���_�1Tp͏Dq�+�S��7z��ƻZ���W@��<lW쐽Kp):��d�_�+���;�q�k�)��F~�AKJY�}_�+E��E�d�~Ƽ�M�����ݫ	��"@�.o�����?�{^� �!S���(C}�����=0G2�'
: �b�`��"�����ہM��Ȋ�^����i����Da��jk�au��l��2�Xa%�w{��*��,�]w
�z3�"]����ze�x�e@��U/֠�(ȶ����x9�^��h`�����Vo���\ͮ)����O�R²Y߻wV���_v��'m?���Х2�r�_ԆI_P�&3��6�C�;����?�J��S��D�Z�Č�����k�Sv��<�B�v���4����+E m`��Dj��"@taF0�7�i�6����fXNUn�.��V9��� ����)\t�>{�5Y8��ȵ^�)�]�Mu��oJ8��d֑%�	�zr�
9|/`�/��j��~��6vz. Pɏ�+�q�4˒5k)?�5��w3��:�u��{/"I@$t�E��C�k�h��A�s��LQ��	�sӥ��y�ޟ��o�\�\95�5m`��qD?�p΃�\q8�?�E�L�����[8�cF<��R������e����6 j��%���CЩ]�U�՚Xe`����/6ɖɾ�����	�#����#Ȩ�a&v�c2,���Kڟ�Eb� ������