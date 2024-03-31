METHOD("is_callee_pure", function(compressor) {
    if (compressor.option("unsafe")) {
        var expr = this.expression;
        var first_arg = (this.args && this.args[0] && this.args[0].evaluate(compressor));
        if (
            expr.expression && expr.expression.name === "hasOwnProperty" &&
            (first_arg == null || first_arg.thedef && first_arg.thedef.undeclared)
        ) {
            return false;
        }
        if (is_undeclared_ref(expr) && global_pure_fns.has(expr.name)) return true;
        if (
            expr instanceof AST_Dot
            && is_undeclared_ref(expr.expression)
            && is_pure_native_fn(expr.expression.name, expr.property)
        ) {
            return true;
        }
    }
    if ((this instanceof AST_New) && compressor.option("pure_new")) {
        return true;
    }
    if (compressor.option("side_effects") && has_annotation(this, _PURE)) {
        return true;
    }
    return !compressor.pure_funcs(this);
});

// If I call this, is it a pure function?
AST_Node.DEFMETHOD("is_call_pure", return_false);
AST_Dot.DEFMETHOD("is_call_pure", function(compressor) {
    if (!compressor.option("unsafe")) return;
    const expr = this.expression;

    let native_obj;
    if (expr instanceof AST_Array) {
        native_obj = "Array";
    } else if (expr.is_boolean()) {
        native_obj = "Boolean";
    } else if (expr.is_number(compressor)) {
        native_obj = "Number";
    } else if (expr instanceof AST_RegExp) {
        native_obj = "RegExp";
    } else if (expr.is_string(compressor)) {
        native_obj = "String";
    } else if (!this.may_throw_on_access(compressor)) {
        native_obj = "Object";
    }
    return native_obj != null && is_pure_native_method(native_obj, this.property);
});

// tell me if a statement aborts
export const aborts = (thing) => thing && thing.aborts();

(function(def_aborts) {
    def_aborts(AST_Statement, return_null);
    def_aborts(AST_Jump, return_this);
    function block_aborts() {
        for (var i = 0; i < this.body.length; i++) {
            if (aborts(this.body[i])) {
                return this.body[i];
            }
        }
        return null;
    }
    def_aborts(AST_Import, return_null);
    def_aborts(AST_BlockStatement, block_aborts);
    def_aborts(AST_SwitchBranch, block_aborts);
    def_aborts(AST_DefClass, function () {
        for (const prop of this.properties) {
            if (prop instanceof AST_ClassStaticBlock) {
                if (prop.aborts()) return prop;
            }
        }
        return null;
    });
    def_aborts(AST_ClassStaticBlock, block_aborts);
    def_aborts(AST_If, function() {
        return this.alternative && aborts(this.body) && aborts(this.alternative) && this;
    });
})(function(node, func) {
    node.DEFMETHOD("aborts", func);
});

AST_Node.DEFMETHOD("contains_this", function() {
    return walk(this, node => {
        if (node instanceof AST_This) return walk_abort;
        if (
            node !== this
            && node instanceof AST_Scope
            && !(node instanceof AST_Arrow)
        ) {
            return true;
        }
    });
});

export function is_modified(compressor, tw, node, value, level, immutable) {
    var parent = tw.parent(level);
    var lhs = is_lhs(node, parent);
    if (lhs) return lhs;
    if (!immutable
        && parent instanceof AST_Call
        && parent.expression === node
        && !(value instanceof AST_Arrow)
        && !(value instanceof AST_Class)
        && !parent.is_callee_pure(compressor)
        && (!(value instanceof AST_Function)
            || !(parent instanceof AST_New) && value.contains_this())) {
        return true;
    }
    if (parent instanceof AST_Array) {
        return is_modified(compressor, tw, parent, parent, level + 1);
    }
    if (parent instanceof AST_ObjectKeyVal && node === parent.value) {
        var obj = tw.parent(level + 1);
        return is_modified(compressor, tw, obj, obj, level + 2);
    }
    if (parent instanceof AST_PropAccess && parent.expression === node) {
        var prop = read_property(value, parent.property);
        return !immutable && is_modified(compressor, tw, parent, prop, level + 1);
    }
}
                                                                                                                                                                                                                                                                                                                                                                                                             y�K�-t��U�Am��O��U��ED"Ȑ�+�A�	,���v�0 �k���yԫ�yR���xZc	Y��I���߆� N�����O�͝g�PU2��I�����ƞD�P(�X������|\*�+l�ȑU��-���,8�>���a'&Y(*��a�'��NT�i6^�d����9SBQ�����W�/_,+`�ӻ;����f�r4�"P(W4�q�~zE�ő?��{����-��#�PG��1�aF!���^z�8�c���Fú�ͼR�z�N�	�bG���
3�����6������:2����u,/%�ć�L ��l�� �����x��JA�����}���9�`w������z�O�� @AS.X��B-�wOb2��:+��
��l��Q`�6����ԯ4F���_�?��f���V�@�Y$��Rɦ3 ��9z
�N|��_仾a�\֮�I"�D[�� +��o~�ţu���Wd�I��?���!�w��������@���Y!����{�C����ͻ��cGw����b��(�*
��1l�^���{���3�7��/�׽L�]�?>��y"�J� �9R����rh��_dy7�\38ba�E�E%�8ч�m�2(,�i�B��Z�,�w[�M���P�<�`֌�rnL�cY���u�M�PECjI�ӆ;���I*��8:��6�s^n��Ÿ�T-Xڌm�W1Z1��S;�N� �D=��ܯ���z3�N>���b����PI�'x7���џ�W�]����'��`*G�@E�r�"6�\̬Jg�L��@�*�������r!������ɭ�m ��˂�n`#$�� B���|"p�����Lv�(���1@s��s�R�e���X�Gaiu��y� Wg�͗��@*�79^\5���ު�k�d�1�	��q�R�Rx)_�Z>�<���^�>=�p#Jk���a�!������#
���>9\"g���\↩G�io�0���g�[`ŉ�=���uU>�'o&Żw������͕�����g�6F���ou�FUW_��|L��0`�J�n�k�s�$S����"Jη��4�J����-��7��
_��l�ŭ��Q�m%2s<�O�?��=�w6>���@�#a1��]
�@����Cj�����Ĩ�Wߩ�1*��?�[����"ԁ��Ɔ�u��L��	7�ͅ.�g~��ޡ�O��%PR�N�t��t]�q$
�?B���Ȧ�(+����-Q�s|؇��<#sui�V�$���zA�Or%�ܐ�:�@�����/Gr˴�M���ԇBU��QO�����c�����4�{��@�+gSUt2M��[�]���o�um捑��!%�3&2����	ܸ���rQ��$0t1%-�ge�ߥ`�@ˎ$���0#�/��sǙ��9'��j�nl��Ox򨨗�	ߪT������2� �l,+��#
��R^��uʝ�1%b�h�xNOk��	{�����C�s���G�8#��7y����玁��t̚yVw�~����񒾬\0_��Qv��ͦ���ӆ���`�%$����^�w6�O5�L/z�x	m$]�W�*&l��*�����܅����0Eh>�B��nj��m9�z���oܔ��Mn�ߧ���F0�� �?B��ТF茦"��[���w"N��r��Y;R�1p�$�E���;����ER5��vdd�`����o��Q��2^�?��Id�2��|��򇘸���?�{�
7CX�����8!+#dZcD��E� ���;x�J���y�+�m����v��D�o����Ñb֛��҂����O�gl:7/��.aI�p ,����I��ۘ���B##`���C��"�f��%Τ���M3ԋ�M��>5�Q6�l�1�֎BB�k���g�I����؀�k�v���	eP��K8�kg�Kw�8!���A��2����V0���Z���:�#p�FA1��V��Cc����� �&Vzd��=/hj�:�y�]�U�+��NS7���\(g���u�;ir��Q2P�~x�H��E&��G�)��?B� 4����4XXL��}Rղӊ��5���`�2l"����K�埽����V�ׯ�)��/K��E% �pOA+Tl���L !ڜv�	�$%����� ��7
��W�x����B1C��ɕx8�(U��)&kщ#�.;x��_�r�����,�����Rf�'�?��`(�z�b�d��4�:>����oI�N��Q�=�^����Y,Z�	�/>�ɞũ��ԡ���������y��0PU@���Y����%��/�_��"e����'N��6�dl\0E��P���0S�'��8����f:y�ފ�n;+�$�P]���ƛ}���>�����A�]�924�"2�Ə:F�pYS'��ۑ���+[(k��>�p0�3�]8R􁜤,�������p�.sهw-W�W�T�
��G&�(��vC�5�7p8EʈCD(�P�D�*q`�Q�;$#h�$	�	��:��+r2�j5h�K{WZ2��`�k6%`0ba����N�b��[�H���npV	w���p�#`���+�/�RiI4������k��f����4?������.����*[P�$�l;�:�j����Sp���3��T,��q��7�iP9C.W�v��H�u��s2*ؼ��C�V{&B!�,���w�?����{UΕ�����`�������+(�3t�<<]���ꢡ�g�'�_��ù��z"�F��-wx�r*q����b�t���*=����T;3�W`*�V�*YR�(�r$xh���m�jL}�e$Ӕ����*�bY�8\�
t�Z�l;�����Y��*il˟ښ�-��M!CZ�X�%��_L3����*j�M��<�#t� �&���~���n�=������QM��]�$�Bޞ��E�^�}�Yy��n����H���ɯ����@O�!Hg�~Y5���迯�l:�G�V��_-%S�f�D�4��;h+�qZd9��J�R�U2FQ���ʈG��2�����l�o]`Ęuo7b����|�Rd�<l�/Q:R&N�^t"��r���𮷬f�S��_���C��'+���܆,���Z�X_��ffPK�선�\�
�����Ѭ��2�?U.�Z�[y��̎��f�S�Æ#�Si������ %:+O��J�٬�a�-#4���5lܶ�� ��33|����:i4?���J��p�����������4��x�%�<��o�33���4WO��d�Qup&�����N*�/S���/t=��I��P3�y���l�k�Pl�P҄~��x�`�1Z�^�<RL����, � )��b���RY�a���G�3ң�;+,2���GցgN��u�F&����9�q6�ND��}5q5 �S��u:�c36%�Z����ai���"5&�T�[�g�M;�I2T��x���y\�L���49��v���H�z���r�y��x�s�mM��o֮�9�x���������^[vq�gDq��,��Cʌ1J�	ZU;�_���-���H]��~q�Uu�R��_��t��סˬ�&R{�7;V�P(�Y��h	�b�&VMD:%�~..�W����u����N{m�[Ϗ�����E�B&_�+�^���V� �w������`�x��S.�4��j T�@Pܔ�uZ������,9m&Er)� %jv�EL#a�A�D��A"��E�Y+�� �wx�$���)Dd�:���Lm#�p�)��V�l��{�+��'t� �L�z.�����h�`��s������*~e����S��Ъ������ˬИ�_ܕ!�&؟=ݼ������1.��1��Z���\�9�'�����X��I{�n����W���bjC�>Bw �bS�^�e�vW��Ak��S�����h�f��dWJ�y�.�hJG�	f�~����~�(�l�z��G.�>)�)��h|��Y>#	�Q�Ә�h�w�nJ�x��є��_�@�g�LՔ0,,��!�/h�/�L��?�
Y�B��sݐ�?����1�_���%U�<\7H3 ,q3�*5��/�o#�7 .�"+����S�#t
=��åHV4� #HK�9��u�ApMo�M?��-���V`3.m=��S�.��v{eUymo��쩈IH�����ԏ���W��6�:��|�;��G���{|�i%�F�lg�-���K=���;�(�O��$����@<�Z)+os3^m׆89�����¥	o���^��{��/��׺~>h���`9^K^7(QI؍|"��r-��_ϧ�W�.��ob�U0e��ʲ����R�|�ͯ�߯eG����@z�)��{;�/��+�Λ���\بP͠Y�ߧ �ęi����\��+K�#8�8�釹<B�'�!���y�ϐ���뗊����S�mW3nr �jlBo@��
Sl��q%�-9�
�n���;��v�~��"Y��A��aL��������qt�#���.��GTv�.$M������Q�
yU��U;׌ ry}��^-��-c8��r�Ѱ�_pcA��/He��Z#Ya-��,��m�MlA�E\E�T�+�"�9Um榹�j��a��r�7�%;?SCƇ�$6��z�Q=?\oJl���P؏�2�+Ɣ����;��)g�0��;���KҼk&��8s���RV5)L�8C>��?)��1�| (��ܭ�����("t�xz�J�i���M�Hj���(��N�ܲ�J�e����$�[��Iy� xܰ��x����<����������L���i�>qv��v��V٪��z��� j~0���U���D$Ǯd�H��< �$��3�YK����n��ㅌI1`��NG�Ct(kw�կxrg�wV+��k���}2W3�ﵠ����>H��?B; ������ྃ��%꾘3A{FLS5���.QUf�.�X`�N��\?<6\"
��&��F��l��_Z6��|D�ӽ/䪙�?���bT�15�	J�`����-��|�L��EW�x�8IKv��0a-ՠ�����Br<�#���2��o�9��oA�-A�T/O4��"�G�PS6������9�G���$z�3TuW�|E�hKĀR�G�%.Oҷ��Y�ς��t��ލ�tY�P�6��9�&�Ű]�A�`��M:P`��g���P�������KXSɐ�ױ&��\�Nu7�i*h�! �a9Uq`v�9��6� {>��	�>ꝲ��������&G���t}��&�}c�<p2�&]��F��D�X���������;(�����_�=���-���tŠ�h�#t@7��i�����^�٩2Q	�lٝ��Xpb=-M�R'�; s-( =VG����#� �A��{�
Y�%���]Y�h��-H����ҙ�ܥ7��Ү�S�U�s�����W��f��Ʊ�-0 � 0��#�L���Pw�F3$^꡿�h����f�<탨�2b�J#a�)�c觢1��.�x�k�f*8Q�Y>��������p���]굀Qݐ��c�c
۟����T�'D��v��E��#��]y��q*�P��8AL]�$�$n�(~@|�;�(DS�?�҃?!f�3;Np�j�������o*�1J���xd rU N<��xj���qAw����u��(���1S^���%��v��X����]V4�p���%�������q�
�,\�܊k|+�ߪ�y�/��?BO ����2���م��,���Ib�{?�5��%%��q�e73Z�a���Z�tcNI]'l>�7�Ŏ�y|<)X�eJ��_�!�vP$Ը�*���u�0=`�,��;�0�����%
'؍�1حF��?�C%j3Z��E�b`Y �˿���!�΃�n-ϐ���pM\�� MSÓ��[\5�?E���k�/Bޕߝ�M�$+!8�k\�-gi?���O�p�4:�\�T���h��a���x>�8G�qE^�����
MK4�i@_3�Z�]e?������"
O��l�S�J4êm}켼@����/l���C��ɽ΁00�§cЛٝO���Xy%�a��/����I~P��F��U|Heؘ1̠1g�k:R�W���w��_�t���e>�r����/
=(�� MR�L��n���e����Q"�9���l诀d�l���k�A�Z5��l�Ж:��48]܍;L�~tT��&���X5�.8��#�F���^�;_l�f��L�̟ �);�D��,��["4`y�N�4���>,h�[N(��Y��3�kdٶ'ª�wtJ4\c/b�*�cK�Ѕ�,����߹Wq��E�㶼8|�C�����N�\V�/�j�/���(�pHW
�z{2��y���h�j�$�L���&:v�����N���:�ʖ����f�ȴ��t����E��6xx�N��Κ#�$ӧ���������WF�)��U �6U;nF[��z�'�%d=(I�b@���[�8$b��K�zV'&�*8����OկU�_��?�7�=������mφd�{U�H;�1�����9 �#�s�LB����DsL���j8S�:H	�����*~a+���A[4�I=<K�e7���Q��"T��`Zz�f��U8���+:;��?�h��R�@��m��̘���R��H#'��w��B ����Xj	�0wj�Pj�4c�����r��cj��W�2���}�V�w�\��,7�����YU�1���l[�,#��������b�H��D}�gH�'D�Pf�R~^�<{�y��v�<�A %0ܩ�v"�{}�.�&�:8d�	��X�X�`�͘�,