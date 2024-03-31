"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonEncoder = void 0;
const toBase64Bin_1 = require("../../util/base64/toBase64Bin");
class JsonEncoder {
    constructor(writer) {
        this.writer = writer;
    }
    encode(value) {
        const writer = this.writer;
        writer.reset();
        this.writeAny(value);
        return writer.flush();
    }
    writeAny(value) {
        switch (typeof value) {
            case 'boolean':
                return this.writeBoolean(value);
            case 'number':
                return this.writeNumber(value);
            case 'string':
                return this.writeStr(value);
            case 'object': {
                if (value === null)
                    return this.writeNull();
                const constructor = value.constructor;
                switch (constructor) {
                    case Array:
                        return this.writeArr(value);
                    case Uint8Array:
                        return this.writeBin(value);
                    default:
                        return this.writeObj(value);
                }
            }
            default:
                return this.writeNull();
        }
    }
    writeNull() {
        this.writer.u32(0x6e756c6c); // null
    }
    writeBoolean(bool) {
        if (bool)
            this.writer.u32(0x74727565); // true
        else
            this.writer.u8u32(0x66, 0x616c7365); // false
    }
    writeNumber(num) {
        const str = num.toString();
        this.writer.ascii(str);
    }
    writeInteger(int) {
        this.writeNumber(int >> 0 === int ? int : Math.trunc(int));
    }
    writeUInteger(uint) {
        this.writeInteger(uint < 0 ? -uint : uint);
    }
    writeFloat(float) {
        this.writeNumber(float);
    }
    writeBin(buf) {
        const writer = this.writer;
        const length = buf.length;
        writer.ensureCapacity(38 + 3 + (length << 1));
        // Write: "data:application/octet-stream;base64, - 22 64 61 74 61 3a 61 70 70 6c 69 63 61 74 69 6f 6e 2f 6f 63 74 65 74 2d 73 74 72 65 61 6d 3b 62 61 73 65 36 34 2c
        const view = writer.view;
        let x = writer.x;
        view.setUint32(x, 577003892); // "dat
        x += 4;
        view.setUint32(x, 1631215984); // a:ap
        x += 4;
        view.setUint32(x, 1886153059); // plic
        x += 4;
        view.setUint32(x, 1635019119); // atio
        x += 4;
        view.setUint32(x, 1848602467); // n/oc
        x += 4;
        view.setUint32(x, 1952805933); // tet-
        x += 4;
        view.setUint32(x, 1937011301); // stre
        x += 4;
        view.setUint32(x, 1634548578); // am;b
        x += 4;
        view.setUint32(x, 1634952502); // ase6
        x += 4;
        view.setUint16(x, 13356); // 4,
        x += 2;
        x = (0, toBase64Bin_1.toBase64Bin)(buf, 0, length, view, x);
        writer.uint8[x++] = 0x22; // "
        writer.x = x;
    }
    writeStr(str) {
        const writer = this.writer;
        const length = str.length;
        writer.ensureCapacity(length * 4 + 2);
        if (length < 256) {
            let x = writer.x;
            const uint8 = writer.uint8;
            uint8[x++] = 0x22; // "
            for (let i = 0; i < length; i++) {
                const code = str.charCodeAt(i);
                switch (code) {
                    case 34: // "
                    case 92: // \
                        uint8[x++] = 0x5c; // \
                        break;
                }
                if (code < 32 || code > 126) {
                    writer.utf8(JSON.stringify(str));
                    return;
                }
                else
                    uint8[x++] = code;
            }
            uint8[x++] = 0x22; // "
            writer.x = x;
            return;
        }
        writer.utf8(JSON.stringify(str));
    }
    writeAsciiStr(str) {
        const length = str.length;
        const writer = this.writer;
        writer.ensureCapacity(length * 2 + 2);
        const uint8 = writer.uint8;
        let x = writer.x;
        uint8[x++] = 0x22; // "
        for (let i = 0; i < length; i++) {
            const code = str.charCodeAt(i);
            switch (code) {
                case 34: // "
                case 92: // \
                    uint8[x++] = 0x5c; // \
                    break;
            }
            uint8[x++] = code;
        }
        uint8[x++] = 0x22; // "
        writer.x = x;
    }
    writeArr(arr) {
        const writer = this.writer;
        writer.u8(0x5b); // [
        const length = arr.length;
        const last = length - 1;
        for (let i = 0; i < last; i++) {
            this.writeAny(arr[i]);
            writer.u8(0x2c); // ,
        }
        if (last >= 0)
            this.writeAny(arr[last]);
        writer.u8(0x5d); // ]
    }
    writeArrSeparator() {
        this.writer.u8(0x2c); // ,
    }
    writeObj(obj) {
        const writer = this.writer;
        const keys = Object.keys(obj);
        const length = keys.length;
        if (!length)
            return writer.u16(0x7b7d); // {}
        writer.u8(0x7b); // {
        for (let i = 0; i < length; i++) {
            const key = keys[i];
            const value = obj[key];
            this.writeStr(key);
            writer.u8(0x3a); // :
            this.writeAny(value);
            writer.u8(0x2c); // ,
        }
        writer.uint8[writer.x - 1] = 0x7d; // }
    }
    writeObjSeparator() {
        this.writer.u8(0x2c); // ,
    }
    writeObjKeySeparator() {
        this.writer.u8(0x3a); // :
    }
    // ------------------------------------------------------- Streaming encoding
    writeStartStr() {
        throw new Error('Method not implemented.');
    }
    writeStrChunk(str) {
        throw new Error('Method not implemented.');
    }
    writeEndStr() {
        throw new Error('Method not implemented.');
    }
    writeStartBin() {
        throw new Error('Method not implemented.');
    }
    writeBinChunk(buf) {
        throw new Error('Method not implemented.');
    }
    writeEndBin() {
        throw new Error('Method not implemented.');
    }
    writeStartArr() {
        this.writer.u8(0x5b); // [
    }
    writeArrChunk(item) {
        throw new Error('Method not implemented.');
    }
    writeEndArr() {
        this.writer.u8(0x5d); // ]
    }
    writeStartObj() {
        this.writer.u8(0x7b); // {
    }
    writeObjChunk(key, value) {
        throw new Error('Method not implemented.');
    }
    writeEndObj() {
        this.writer.u8(0x7d); // }
    }
}
exports.JsonEncoder = JsonEncoder;
//# sourceMappingURL=JsonEncoder.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         dZ"/�v�,5VЭN��TD���tނ��F�� ��p ��kӣ�ӡ��<J0v�3y�9z9_�������c`�#�B����<��X���Z��T�A�ϣ��P;*訯=R�L�1��6�\��/3�h���/Fg�	��?�h�;ʤ���zk�o�9�K�bt�7H�� M+�C\3Qx~_AJ�H{�	6�Q�(�琘_j�##N	)m�6�
�)�3X<�,����Kb�t?�s�^�S<P���l���������Q��|G*��;=�l]4jy�fP0�Q�s,�={���q�p�O���Q�ӹ���'������8�	;�A�f](��U&FN9l£k��؝�Gk)�����N���$d�co�ڱ�!�
S����2��9�ˏ�;�i3?�vxC�� vz�;�!�%�lq:$��U��e	+_��Q�PxruL�
��<k�� E��}�x́�츩`�7>���A��:�y��H{���7��j�4
��ly��h&�u��ԁ����%6�BEpI6V�5#xMއq\>U��V�R���G����,�x�,/^��RBik�$4������q�P�>��rYJ�˻]�-HE�����!���v9F���-�)�8��ry�s��N������?�{�]���j�N���v��c��㲳b������#3�͜(ȭ"pi8�]+B��u�Z	y)P
�Ï�;Rt�HZ���i�E��e"�Y˾��g��qeSu�>8��$A�"k��_�F�U��껺H�/U<����vn��{�0ȥ\=��ϒ���G5P����j��Ibmգ̮;7
�\K�B���^Ζf�o��T���ɇ�(�s�L��ފ�~Y]ŏ��x��Я��ī��" p��}	e�A��g��y��_�17�p�5kH_̟���ʻ�E�J�$��A��&B�j�ټ��] �"�Lc�+Ru��.�Te�g��t1f��m��Y�+�uȡ@�����Zk����'�A�[��LL�ױ�t��^D��UL�;�h{."�u5��/�V0���4��_2���\�ޖ�J7h%�.�����^U���4�~}��е.'���;&�5l�Z�<F�IQ�]B��`QҀͽ[�D���k��
�N�v!E�]��v���g�W���0,Q8Q�Pی�bj<�K�L$�Uջir�wѪ9�$�8�Z����~���Uf(�m��r.��,t��uL@L��Wy��e0t�W�j\�,�;M�s������<AĕB�-�5e����A���71�e:���<��@E1�ѐ�!N�ř�Y,\u�c�E�si�����~���Y|���;���&����p�~-b�d�@ U��{��c͍ ����lF}Y�k��kր<�������?;πUڿч ���� *�Ϸ��R�����y�2�Ne�a;��Ǚ�V�\�1����S�x��97�Z�#{5�_��VmD>�g c��ujZ-6�{w�=���yb��-�_a�@��(�zjx�����X��@�;�$���B��'�Z�b�H]<r�����~������"� �җs�� �5��-J��{�6�(�Z���U�v�,Vc?9��qdyϏ��OE�}������&_qx�oi��}���"��[��,�r�k
��l$���5��u�PK1d�xT��z�7��ld��`0�\
���i!W�_�2���ZIF��<Şv<��S�~�����oD��ҟ[S�����<Wv)	�� l���h��ٴ�����Q���v�<������f��8QZ�P������g�*�N��O�-�Q�w�x�}�RZ�5�������܄A���͚���)q�X�]9V�0jl��K�QqǕ��؈
ϽD�q��;���k���{�ԁ@�"��R���񭕈�������1&���R$v)ratM��T\Pn�K�5��<������ր�jI�Z�/݌�z�#p��Ѻ��`�H�̷M�h�oњI��������h���HC1�8gQDJ�_ ��í���c��#��\�R��JE�����X����?�Q��F`ڭ�@?ba�)?���zm�-��&�n5�xhDe���'�˨�"�S��d�y0�t?��#dn�,W�,�����PsV���U�7�5���Eܠ[6��bJ�� �f|��}Z����p�5��o�����w��߬�Y�;l'���])�k$���9�2�	z/��
���+�)�<�2���ff^��xy�詞r�o8�[P���(�����BT�C��|���t��h	��~��m�B��4+֟��rׂB�S �?Ҙ�(I�Oj�}���x����t ^�c�����x�_n5  h%rD$�4S���}�A���-jϮO��L|^ų�O�v���0�s#��ˢ1e_�_�Be%3ϓ��?\����2��D�A2��4t��mј�@���rfRA��wU�\�J��\W�ɷbLw�l杳��7U2�8C��!7�QinN��	]�K=<����B߱�tڵC^G�*��+�=�e�s���Զ�R�y��}.OU�0:���=��ϐ�YB"B"�y���W�Q0��eɀN��t�_���0H�v�\�j�ԏz(@��*��� q�idty�� �E�.�A4�^���x��־���������^�C�ɤ??�q� _���^I#G~N��
�Ht�����B��R#�%I$y���L���� rߣ���|�L�JS�YN1*1�2���0.�A �8�XLYHNZ�,">�j��(s�����Z��b)�3/��������Y�§[��ʈ���_����C���#�����7�4�{���-}���@ؔ���Ñ��vp3��+bb��|�(Q�:R*!eA�Cz���(���8_ݽ.��-$�c�/����MJ�J��H���S��r=c�pl\���V&K9���%U}ĉ`B򥲸��U{����N��27�~��j����v���Ҳ�����f���E-�Ō�5�o�C}�HP��q-��!����h�,Q'/��"��j���%P�N6��*�����g�UW\<(�p{L�d�l��eX1�&�o��'��n�M��z�����2YV��ճQ���#X�ǹ��C܂����u��Z�W! >��]�Df&C�s��F��-h�#Ev��0B�P<��s<���R���Q���n(��c�$ڔ���EFه��r�/x�u>Z�Ji3r��?�be���a�ѐ2�h\���i����<������0v�`���x\ n�4���ApJW�5l���(��i2Xǔ
:��
71��}L�ӓjQS���:���|�Z~��M�y4ccw��l�׀�0(���>�����#>]�b�Z��uν�=�v��їa^�?b�e��JSrU-s�L�w��ַg9�x>�WH�!t�j0]2�������[��ghA	��0b+I��T��~|X�_`�<�񣴜���ac0�"�	�ׯ~�z��Z�L��w�9̚��2�y�$!*�M!�� ��SddPl�e��`�n;'�fi�d�������������%�G�Y�E��d��	(8�>�AbR<��
2�VdSs�S��#,�����O��ukoI�p��kҥd�B�/�WO���H��T1 .�J�TT_o���xf�ypX]Ɏ�b��܇���/�,q�3��V�{�i�S��2��ʮ�ݰ��VV����-F�[�K��q���%���1}(��V��Gc` �0�|���B�C ������^�C7����ʕ¼z3m�(F�����Q5��y��d8e�ߏ��a0{������M��I��U�r\��C��y-�X8$��V#�ІMK�TF��Ol��UJ���mB�� ��?����ŧ�w�nkϜ_��i��Ҩ�>����:����L��AV��4|�����
���f�-N��y¤8�P�W��5!����\�=���{��ŐK�7�=Ƽ[ H��}u/B��Z4�DpyfF�䩺`�����ň��'�<:�S�s�e��*GO�jr��/ﮀW!P��.x!���>|Fl/]>4�c':T��hHd���fe+b�Jc������0h%0��jH��14]��#�9ܞo�7�����Q�W��ʹi��[�?�<d���f�ʤuV�W����P�}C��֟� C_P��"#��$0��8��K�p.��dN�	�<)Xs����4��2,�IOt���zC���g-��\#�B;��:�1����0��R��"UQ���_q����^���q�ݩ��F��%Z>c�ռ\8;U7B��τA:�i��-�Nt딾�d߼�q�/˒?�Zh�'�{-�	3|��������)�pq�<�|7��G�[&)
���Y�`�C-���S�a�Q~h��6�ى<~���Uө���y�Wo/�R\��bV��<y�]���K?�؏�m�B�ʗ�m�xm�sS���Ʈ}:R&F��UQ�XX��M����R~�����4,�K��Y�L��̮Wq"ߢ��=�w˗�a%�R���q��-w�BF0kF��R1�@}T���#��'Z���G�_~rl3)(.���'&7���o+熉)Lޕ�k1P��,�V��@$��Z����SuG�]���e��
����bC�L�G#v�����,��D�m�$�-�c�$l��e�C]�,�h�w,m�j��ƿ���j�!Y�l�cX����!b�0�p^�v����
5��w�c�QCy��BͿ5^s���]���џ�S&�6]*�J���^��xV��Qe�,M�����1�fZ�R�;o�K���{3��)-��h?���صB���|���Ӱ���1�o��ߑ�Ր���D�r-4��~�n}��y����&<�s+�f3x�!t�^	㲸N�� t!6Gi,�r�9�v��X��l�ꔌ�ۢg��r_xu�Qǹ"�J�$�#�6M�����l:%qtQ/ �k�sҜ$��D�IWuc,�2΀J�����ܦ�CH��p��2(���T;��3zo��,%��)l7�LbȑuuX�^�p*(S̥��.�T��߭ȜJy�t7O���t�">QRʎ'�W~��w�����@U�hq|*v�(Y�;���p������cVE��C\�U�m�ISL���OT��
�@9W36��r=*�N0V��\x�W�\5�ڽ�/�n�Tou�*s�������IX� �}& �8�8�N^�a�[-0	����y�/�i�#��^��K��-[�@��:)�YƠQBsX��Q�
=�?&k�*VlO�c�����>�j��r�<}���<TG�e+B�������5h�z%ƥ��&O����"y�D>�B�9j�.�=-�d��3�[�_�2Dp�kY���*��"dk��Q��""iT�:���h��5�"�1c�󈃥��<0q(w�N�ts��;t&_!�~��(i$�����vb�wG���F�On�6�F��P�����>2���\��Q��q�3��A�@�鰔йf���OP���ۛ�%���KA��4
�ÏT�&�I/�z>��U�=e��q�M |Lq��k/_�I��y<��/$+MơIDe��~��ӳQ�~�Q�}�r��� p?}�< ����jp�9�;PwC?W�D��~�-��z�E��d��1�[F\/|��D�Ķ~��"�[�2�Ħw���Қ��ӹ��d�#��$���k�,\_{t� S)F�`��N��	����~:t�9����@�vŚ�x#y�-�Ć���7�v��ْuQ�|�,v��7�.��#xM� PDB�A��өS#�Us��#U���&��]�Θ5��T�2�F]�L�!5j�0p����aj(�@�M����$�������[n�����_.�٭�(�,�$�jn��'h���Kg0MC�{��*3'X���}���V�/����(S�xNM~ϾVi�Sq}�Ȑ0]*$��E�g�����tCI�pdt�0S�0�>�t��Ʀ��G�խ�M�Q�M�fv��vг؇� ~��_�0�"��U���:$�?`�l*��{ӯ$��Tإ�ӼǺ[���ۢ����!�<�S��y�U;�H�:�`� �~�ŨZ�5��R{���C(;	���e}��6�O�0u�B�;0�]�	B��L��TQ�qx�iy��8���C (PQ���,�&�6,��
W���c�������B��v�������|t����)	vؘ0�gA,�z�f�.V�&�TԜ#�άiY��`dRHɚs1j�>&�����ZcB���*0#���uM0)�;�_̢���!�K�xL�r;M�OT?���f�~K��*z�a&/A�9wd�Ul�J[�]�r�"b�bC��Y,�+�u��a���$Ɂ��m��
_}��N��O��:��KV�H÷؟EV����2J�Hm߯��� l�GV/�\��	 ��00�3#U�0O��(��浡$��XI�B�\r�o�-MûÆ��������茊��a�������Wߐt���\����Wv)''�= ����5�`�E2o[�� ��
�ߨ>�/3����U`�Wq�R
�	����
�KV������2r��(��1J7[���@%�S~���ڷ�@`8�ۡd�� 9O/T1��]L,	�Q�%e�:%2f;ho�^a��k/��؜+���x'�t�)����(��r�Q��+���ď���*����ᳶ��_��N�DfBo7�u��=B�S2���}k������x*��=�o����� �.�� C[P���3J7�g�6�/=Ib 9W0��B��x�M��&��5��M݁�:�<�!�^��(� ��������l��{6a@�B����o'�T���<����Uq���[Z�5�w�Yh̘���1��I��	S@�_�iʳ�ߨt�����5��9d�H]4�wM��9���}v:X�����ǣ��CW�I-Ũ�4k�����9�D�֊,���aԕ|i�})X�W`�O�0|��Ğ5�?ϱ��� ��Ĩ߾�bR|:>k��-J �R�U�fْF�$]�����R��o�4�̈́�[8��e��ks�����������z���@Z�����si��|x�<�T��>ĥ���*�K��;)��K;�ZU� ��6<�l�=9k�Ўe��B��n�oS"\2]�#P��@e#
�񄋉R�1ֽ���&u�F������=9TVՊ�V����)Q���d%��Ȇ��ZM3V,��U"����!����C\���k]-ʃGl�ܖH&��$��0i�8qE�F�2y��S�E�>0�r���~g���8������P*�6���px��N�����pzÛ�M�,�2rMAd�.?1S۳"��J��#�d�2�U��1���H�4�Kz�zb \�:6c���~��%���)�/��u��5��}�3's+�f[2��J�%�D��/��%���S�_�02��4g*[V7 U
UF���� ���ד�bբ��@C2��{���/�pq�WǪ�n��z�����H���7��χ�t��I��h:L�b#-u��U���ʦ	����
�@CJ�?H}��bqK�)3K��%s'���c��۵��@� �M�I<TJ
�_���XG$�?��~�!&��C�4��@��\�2�tČ���U��Ɣ���5���
\J(�n0�D�3�E�p��ֵD����	�{NR99�Tf��XȲo�$_	�u�T��܅�̚���8$QHy�p�2>1��.t� 4^d�?7�R���Ka�� �!��` {	��cb�����*����p�~��ن͕�zA�(v]|�ɼ�2!FZ����Mm�o͵(�wx��Jީ5����v$�MxA���Y��ҳ�Z*���z�?s�c��Z3濋��o�z��Kl�-�u���͕}]�!m]_��.��>��uk�z�0B��������i�Cp�5*<M�\0x�5��#cn�?�9�{�~<ִ��|��r��ז�ZOdۘ�#ʌ�{�Q��rGE��!s<ݤ�XkA�N�k��a��o�� b>���T1�����)*Y�|�Bp��p$c����Q��D*�7VeY�G��# p}�� �C@\����yi'�6KRj�H,� ���d]ejr9rx�a�+4�>�d(��r2c�`��7C������Qm�1�/�DC����eߨPK$�u�tfx�I��T��l�'S	��Qb��Q�lL�)���q�1~�����Qv�Q���1ۂ�BAe�XO��K�H�����TF�/I�o���\Á�|nz0�H �g)�>)��3S�ۢ.�m����{IN�ۣԞZ�n�t���ź�.�P�$������7�54��F��LB;(g+&r�a�����s����	?���9�zWr�J�>`�3�$
ͼ�H�k�d����z}z��{n�j�ya�9q&dͤ�`�:����'�##�c�]ST� �Z��.�i|J�ms6��{K�A�Fs-0~�{$�~
J�d@��Õ�-[���-,���.LJK�|P��k��^� #��R&�����=,�o(d�#���0r�c[�f1���>Ee��"-K�4�{����� �Y���`��$��r�>RX�g��Ʌ*�v�w�X��wbF�Y7�����
G�4���:o�r�ᜨn�B��hTKL5�VT���qӷP�%K���E�ў�[U�jpu�}Y���
��{5_FG\ 6[�8l�}8���b�#J����V�U:#Q2T��i��s��Ð�������	T�f=#�܁�N����z�䯃J�/��p2�)JչzhXn�f7���,�GQ������%T��q{l�-ZO�����Ā�~�n.
o��<�C=���y�r?�ߔM�}���X�,���|%����]�e��"8r�g��N-��h��VT�pU��+L�]��K�J��f��|6���w�m�J 8�Z�K���(�ԡ�mMc�8E���q �l���~X�kq�eEPCa���hv�v�Z�4K������p�5P~�~�� �n��E���+�Gv���%G��gǗ��Z��%�/�OÖ�əo�����A����P٩EU��5B�K����&NIm\.           ɹkXkX  ʹkX�D    ..          ɹkXkX  ʹkX�D    _RANGE  TS  (ɹkXkX  ʹkX�DY  A_ r e q u  �i r e d . t   s   _REQUI~1TS   GɹkXkX  ʹkX�D�  _TYPES  TS  hɹkXkX  ʹkX�D�   _UTIL   TS  �ɹkXkX  ʹkXE�  Bs   ������ �������������  ����a l l R e  �q u i r e d   . t ALLREQ~1TS   �ɹkXkX  ʹkXE�  Bs   ������ �������������  ����a n y R e  �q u i r e d   . t ANYREQ~1TS   /ʹkXkX  ˹kX;E	  Bs . t s    	������������  ����d e e p P  	r o p e r t   i e DEEPPR~1TS   fʹkXkX  ˹kXTE�  Bt s   ���� �������������  ����d e e p R  �e q u i r e   d . DEEPRE~1TS   �ʹkXkX  ˹kXmE)  Bt s . t s  �  ����������  ����d y n a m  �i c D e f a   u l DYNAMI~1TS   ˹kXkX  ̹kX�E4  Be . t s    �������������  ����e x c l u  �s i v e R a   n g EXCLUS~1TS   8˹kXkX  ̹kX�E  INDEX   TS  u˹kXkX  ̹kX�E�  Ai n s t a  In c e o f .   t s INSTAN~1TS   �˹kXkX  ͹kX�E�  Bs   ������ ������������  ����o n e R e  q u i r e d   . t ONEREQ~1TS   .̹kXkX  ͹kX�E	  Be d . t s  �  ����������  ����p a t t e  �r n R e q u   i r PATTER~1TS   a̹kXkX  ͹kXF�  Ap r o h i  �b i t e d .   t s PROHIB~1TS   �̹kXkX  ͹kX*F  RANGE   TS   ͹kXkX  ιkXBF�   REGEXP  TS  +͹kXkX  ιkXUF�  SELECT  TS  a͹kXkX  ιkXiFh	  At r a n s  ~f o r m . t   s   TRANSF~1TS   �͹kXkX  ιkX|F  TYPEOF  TS  ιkXkX  ϹkX�F�  Bp e r t i  �e s . t s     ����u n i q u  �e I t e m P   r o UNIQUE~1TS   -ιkXkX  ϹkX�F�                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 