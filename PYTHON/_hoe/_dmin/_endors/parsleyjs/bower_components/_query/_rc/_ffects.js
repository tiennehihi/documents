e.definitions.every((var_def) =>
                    !var_def.value
                )) {
                    return false;
                }
            } else if (stat) {
                return false;
            } else if (!(line instanceof AST_EmptyStatement)) {
                stat = line;
            }
        }
        return return_value(stat);
    }

    function can_inject_args(block_scoped, safe_to_inject) {
        for (var i = 0, len = fn.argnames.length; i < len; i++) {
            var arg = fn.argnames[i];
            if (arg instanceof AST_DefaultAssign) {
                if (has_flag(arg.left, UNUSED)) continue;
                return false;
            }
            if (arg instanceof AST_Destructuring) return false;
            if (arg instanceof AST_Expansion) {
                if (has_flag(arg.expression, UNUSED)) continue;
                return false;
            }
            if (has_flag(arg, UNUSED)) continue;
            if (!safe_to_inject
                || block_scoped.has(arg.name)
                || identifier_atom.has(arg.name)
                || scope.conflicting_def(arg.name)) {
                return false;
            }
            if (in_loop) in_loop.push(arg.definition());
        }
        return true;
    }

    function can_inject_vars(block_scoped, safe_to_inject) {
        var len = fn.body.length;
        for (var i = 0; i < len; i++) {
            var stat = fn.body[i];
            if (!(stat instanceof AST_Var)) continue;
            if (!safe_to_inject) return false;
            for (var j = stat.definitions.length; --j >= 0;) {
                var name = stat.definitions[j].name;
                if (name instanceof AST_Destructuring
                    || block_scoped.has(name.name)
                    || identifier_atom.has(name.name)
                    || scope.conflicting_def(name.name)) {
                    return false;
                }
                if (in_loop) in_loop.push(name.definition());
            }
        }
        return true;
    }

    function can_inject_symbols() {
        var block_scoped = new Set();
        do {
            scope = compressor.parent(++level);
            if (scope.is_block_scope() && scope.block_scope) {
                // TODO this is sometimes undefined during compression.
                // But it should always have a value!
                scope.block_scope.variables.forEach(function (variable) {
                    block_scoped.add(variable.name);
                });
            }
            if (scope instanceof AST_Catch) {
                // TODO can we delete? AST_Catch is a block scope.
                if (scope.argname) {
                    block_scoped.add(scope.argname.name);
                }
            } else if (scope instanceof AST_IterationStatement) {
                in_loop = [];
            } else if (scope instanceof AST_SymbolRef) {
                if (scope.fixed_value() instanceof AST_Scope) return false;
            }
        } while (!(scope instanceof AST_Scope));

        var safe_to_inject = !(scope instanceof AST_Toplevel) || compressor.toplevel.vars;
        var inline = compressor.option("inline");
        if (!can_inject_vars(block_scoped, inline >= 3 && safe_to_inject)) return false;
        if (!can_inject_args(block_scoped, inline >= 2 && safe_to_inject)) return false;
        return !in_loop || in_loop.length == 0 || !is_reachable(fn, in_loop);
    }

    function append_var(decls, expressions, name, value) {
        var def = name.definition();

        // Name already exists, only when a function argument had the same name
        const already_appended = scope.variables.has(name.name);
        if (!already_appended) {
            scope.variables.set(name.name, def);
            scope.enclosed.push(def);
            decls.push(make_node(AST_VarDef, name, {
                name: name,
                value: null
            }));
        }

        var sym = make_node(AST_SymbolRef, name, name);
        def.references.push(sym);
        if (value) expressions.push(make_node(AST_Assign, self, {
            operator: "=",
            logical: false,
            left: sym,
            right: value.clone()
        }));
    }

    function flatten_args(decls, expressions) {
        var len = fn.argnames.length;
        for (var i = self.args.length; --i >= len;) {
            expressions.push(self.args[i]);
        }
        for (i = len; --i >= 0;) {
            var name = fn.argnames[i];
            var value = self.args[i];
            if (has_flag(name, UNUSED) || !name.name || scope.conflicting_def(name.name)) {
                if (value) expressions.push(value);
            } else {
                var symbol = make_node(AST_SymbolVar, name, name);
                name.definition().orig.push(symbol);
                if (!value && in_loop) value = make_node(AST_Undefined, self);
                append_var(decls, expressions, symbol, value);
            }
        }
        decls.reverse();
        expressions.reverse();
    }

    function flatten_vars(decls, expressions) {
        var pos = expressions.length;
        for (var i = 0, lines = fn.body.length; i < lines; i++) {
            var stat = fn.body[i];
            if (!(stat instanceof AST_Var)) continue;
            for (var j = 0, defs = stat.definitions.length; j < defs; j++) {
                var var_def = stat.definitions[j];
                var name = var_def.name;
                append_var(decls, expressions, name, var_def.value);
                if (in_loop && fn.argnames.every((argname) =>
                    argname.name != name.name
                )) {
                    var def = fn.variables.get(name.name);
                    var sym = make_node(AST_SymbolRef, name, name);
                    def.references.push(sym);
                    expressions.splice(pos++, 0, make_node(AST_Assign, var_def, {
                        operator: "=",
                        logical: false,
                        left: sym,
                        right: make_node(AST_Undefined, name)
                    }));
                }
            }
        }
    }

    function flatten_fn(returned_value) {
        var decls = [];
        var expressions = [];
        flatten_args(decls, expressions);
        flatten_vars(decls, expressions);
        expressions.push(returned_value);

        if (decls.length) {
            const i = scope.body.indexOf(compressor.parent(level - 1)) + 1;
            scope.body.splice(i, 0, make_node(AST_Var, fn, {
                definitions: decls
            }));
        }

        return expressions.map(exp => exp.clone(true));
    }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      @�IL�:�fM)����JA�@�����}�����О3KA��+�_�lgR&]���=ӖCTEȲ����,�����r?6�IǼ�=S���韩�`L��>��p�%�PbK1�*V����I8��iw-X!���ǏRͪ 2��
�O[�������P��*��ub����g~�<�~~7�E��� ��G�hs�r�Q�I�ט%s�e_�P��1h���$��z���U�;O_����@�s�DiN]U옲�i���m8L���
���t-�h��Z��1k���d��넁�VQ�A��u��$e�bZ���)Wm�l�gm�U�'U�M� �@���k��+
a��#���|�~�x4�����rG�*ak��Z��f>����4�ҿ|�H�íA�㰲,Y�o�б�	�d0ǥ��hcȔ<�}���C���F*�����Z������6��{�Xl3�� �L�![��yo1��-$�R��Ћ�+������+z����=P���
˂`�H����G#9sg���������<�9�qԾM�pf 3�9L�Bq�A3Il�� �&�p��(?G�M*W&�@@�$Q����4��[���j,4zq΃�ҹ�LP�H����+�0���[c�DU������
���DrtnNC��)�󳧜@�r���Ca�M��Y�����D���?>�&��/ı�'����篿���Y�17s�8`�d�}d� 1�4�XͰc�$�r���iSD������m�#�ʃK��#}� �47ǔte��uXI�e��$aj��P��e��p��M�ĪY6����*q ��i�du��lm�Ď�s���y��wws����Г^��������%90%)�c�"�~d�,�q��؟=޽�es���a���=�W0Z_�)�d�Q�4S���)R6~��7��B���� t�Dx�b�s���0�
~<	b+��"�0��D�RNYdC��z��N�����v,��;t��T�W+氡����ЇN�.xV�i��jS����Umg������F�@L�`�H��*��8�W+>Z���U�p�%�rj2!��R(����123tf�Qv��5Lpİ�'��b�_5��iS�����������;�����j|e��d��d�ZQ[�-q��m��l�UR��@���f�vϵ]������k�+Y0�C��C����B=��'4R	���TY�FOE�O�,mp�C҄JI��U-����V���ޖ����Kd��Oc�Q�x/vi�/�\`
�Ac������ޱWD鿳sJ���m�<E�QP	�U-%%�>Sk��n�>��7}5�j[���A�䟫�5�C��}+��A���fO�o.���iY�}�9��1]]��4W�T������P$c��!�G2_{�	�A�o����
^�zc>�Q���X���}�!@j�Q|<JX�U���'k� F̇��l��r�UP��	�#������y0���9�$�ԛhX(*$���t%'��:*�*�6�Z5_ҵ����n������C�a� ޣ�ZJp?
���@{A7,�w��j�{�E���s���q,�=�6�1.>� 黨J[@c.�����s�YU�p���X���F�%��V*��R��%�n�b��w����^p��}m�m�jC�\���hi8�1Gܑ��X++Q���ec�ړ�F;�bW����^��I��y�쌸�ꗲw;2��*��XΧΌs�:�O�AO��/de	>5�h�q�4=�#-�n+?���51���h�������"^���ʊ ��"U��S�{���J��:N��	�<K�L�^�C�e��<�$����c�D��ݎ/����'�<?���2E�×H\,����s�Kw�|�~��η��o���`i���#<1��/"��	d��ퟃ�$^�$#���׶�vėZJ'-�A���jR��ߠ����p����ZE�t���]��ؔFk��wl�r�Q�47��}H��;5��=H�U-n}o��ui Mݧ����%G�^n ���W_��A;��PG�'�es�
� ��-�C���ћ��S16lr��4��TVa�7��e��C�ι�=��`z�D�%��?b,k�c5ϭ���a��S<�u��x'�.�5@,�Kګ�����d{�)�ɢ����kL�&��}���z���6�-O���5�1W�w��/��V��ϑ��lò��O-rg�����8�:��m~���nP%����mB�m  �6>#Ხ=����]{�KW�:%RF],QZ�d����q�C\`M���'��A��{2������(���!��.���#����s~8 �ƺ��� ��� b�+X4�r�d�Q's;Y�V��HF�aM��l)��%����c�Qh�#c��c |V\�Lf�ΛyS���"��C1Gm�Wv������K�W�(�@ql++r��%#'7���S��u4,bxb!�`7\&�*'5-U>��71�Ƒ2�K��c��q�lY�z���1Ծ�ئ�o�r�_g��$����O?�����s��B�oA�	���I�'n�N
�*�������2���Z.�+��vu��:#`���tW����xz�C�.=g�5���� [�D�Osm�[1�v�l �����$���#O�������K�t ~���C�<���m���ybj�̏��=�7L�Ì^}:v|�{ڻ�B��4�𴟣P�9u�j��?B� ���4����K>�#�Ý-KY� ;��߱�CmP��ɤ�ߞ.R�j۽p�b�P�S�����~�sey��|�NY�~��g?\U�*��'�R�d�p�>��WRQ0 �с�iè��t��On��l���{H3lM/W�ob��襻̮�R���;G�~S%CUv[}˿6���X3��9%�f[_-�$-�@�e_�v���B-B�����b�1�v�y��}�/3
*�}�ܢ�#�o�Z�g��	���7�#���M$|n�����rƿ���s[v=V�م�C�uq!�m�<���|�@�;���.��l/�E��W)��[�*�{T^���g����WDP��6s�>��A�"����(��1b�?������ ��^�/2e�%*���F�O>X�ڷ����zOE�������01�#$��i�x�3 �h1䃊��VQ�J8?�G������N�Jͦrؠp��'�X9�a�1 1^�K�k���-�Ye�&���
��j��}�Y
=;����Xqf��% �w�n�]T�R�L�{E��3����A-j���a�%��;�|�0L�1��H�?��8�7X��%�>�X|�Վ�[آ*Z�����j��r2	Y������C���j�}� *	:$а>ƒ��p���/��0���1*'���偱�EÕ����V0�ZG�&��_�ro�Y�9���`5����m��ϩ6�����"X [ھ�����^:%�H%�3�����cK�~�
9bݽԷo�B�#���!Σ��kj?�-�H��G`�:�����U��U�iۣ�=��&.�@���7��H�4NO�TN�(�u4��Z�m�Vx���g�a�@�DT�h�ѴBvS�Ɲ ��B����E��*i��˔l%v�����]۰I���{p�#A�"����*QYmD�����`��j�8T��O�uY�Ĵ7���W!Z���{��
�P�U�K�v��k��lB���H~f��^u�\ f/,S3N��إjW�"���%re���ʨ�k'�}��Rzz(Oz/e��	�2�fZ�|�ˤ394��vZ �D4�5��D�o�)��!CH�D��d��qC?���}�i�b��=Nw9aBwo��y�L���IEG#���^���(��n~�%�D�ڱ����?�;%~Y9@�P�\�zs���\�*[ �����\�}i
��
�
.�P���RP�G� ����̈�!�%���b��u��9��E��k��3X�� �:�� �[=��yn�?;�o��,�XC���i�����In%=d��5�4��g͊�AY��a� 08>�F���CY񏈑H}��aa/�o����q�n#�1y⡴4?�*����>��!<u&�4���H�W{P� ����Z/����A�����������5�-NGL2j�hF2z̓�zj�9\��RJ\:ܘf�&��~T�jmpz�PIY��J�5@���)��^�Z�y?��[��;��8��;r�
�n���)Ƣɾ�������s�2��x����-���5����.	�s�u�U޴�~��K'n���������,���^�C� �� )[�-��$��2X�v�e������?D�x�� ���i� g�#�����ӳ@a�-��h�f9Nɰ��ҿ�V�b��[�{�֍ �V~�~� .�Q�Vx ��c���<h�t�jU n�$�k�v*UZ��#�4�a�}* �����'P~�FS�]��6J�i��?�_� Ӽ)�C�T���mQ�[�_Zt.Wn:�9Z���J�,��ò<u�^�i,E�uŬ�>x �����p]MJ� �A��.���ɉ���h�Ac�� �#���	��a`j�j3l��K�/{U��ŵ��n�	�ʯ�ř��}3��S��5�ɱ-��52i��_J�b��CP;&'6���5y����S�iڲ�M�����<�`�20�$LL˶Z�V�'�%�˖/�^#����DgiQsH��f����u���}�¯���^hE �� �%��4�|�j���1\�Uƹ7�G�͚j��\N��rf���8Ƃ->2�VW�K`�B`$����Wd̝�˿���
��5����v�H����m�4I��9�|��	��#넖@�SoJ�~-7ao��f�|��� \�{7(H:u���4��C\�b���/&���8�&\A�w"���6o)�� �nO�WgI0��p����O��u�M�G�G��h�p�^0���	Dd��[�P{����0�⯙a���Π�D=�J=l��n云���U<�χ�Ըc��jJB_�@�@�6`�2�Af� y�p�Z��߸�;���*�b�͚\�Y���O�����R���%���Mԟ�h4x� l��L����d��,<VM�d�I�Cĺ��Ha��-J-��V�HL5�*߷���'�>�xX�.+2�w
�3A��f��f�iJ��G��R/0,y���.����Ҽ&LdK"���ک�՟IexQ�:����L7��Z*��{��3��QT��.ӗk���~�������_�Ԯ�,Mb�2N��7�9pIn=k��7��Q���B�j;���vA�������XEoN������΍�М������^e�L��?�����  �������͂]��1��j� �(�`1,���#rq z ��@$�0�[�T����J�/�9J0$s�s~'2(��J�,��� �$UhqT�%2�c���	U�y�&�������K��Q6�DUkŦF�
Վ����R��
�z��������Iea�������ջ�/;�C�0���$	�O���KG*����.��@cgpe�*��Ω �)	�y� ��+a` �0�6�SD��4/�/ǀ���W3�AeO����E��@x�xx�y4�e,��Ӡ�կ�̗I�w`<d��Vk��;���i�'���C#�h�0q~��[��������-Ho���x�?�}�w���Y`*p��L�͵x�k�[���JN��C���iק�*�^�X��\�cw�Yozյǅ�.���_,�;��ae�[��=�f_�ƙ���6�������ͬ� ��`����]��^ty���(.w}�ɏ4��Jf/����3i>���O��>���X�����lg�-�/��*&<Vw�5 *�L]�}`��W����r:?�Yj������y&1�@3��.�g<v^<�M����3A�^�F�Mí�L{L��N��{���)�00:J�AE�8ؘ�8@C�u��q�/�n�ּ�{Nbk�O��ޥ�7K���%��yU ����.6����1�2.����Y>^�UB)�|�6�����o�pz�u�;���oEH�GyU�Ʉx�C/?��I��Z��N�9	,���Z��M��ml|S���;�Uң��p����&��+��
7lF+��q\0v"Q��`�1�k�:J�A8��7gI-�����ȅ��p�p���wT��%e�2�C�1�O���?�ĤZ�<����
�+���}�Jve�s�0U%0
�Wþ�5D��) ��$�a�f5Y1�HXKl.�4A���<�3�Ě6��c�/����}{�͵�y�ks�4��Sc�j�Ｙ���@��� ֟
�f��J#K�?���$~�U�}�,e�|ji�=6�GH&���c�b�-lc�dI����x���P�@�U�?�u��A����)���T�2��m��P����)a��+��_�Zq2���>"N����)�B��c7I�6��N�=��U-Oh):����l��l2�6��y0��k������M���"��ʅ�'AP�TV��,�#2�Б�m}Pn�YK�rc��j�����&�gh)#t�Vę��� �4�`VGl!�4�?�Ą�0Ju�kre��p��9��qt�#a��>����J�l��QB�}�_v�O7�G)@C�f��!���cwR���Qv�_��v;u}̟(�sX��=OaVjE�(�aɈ�:}��NM�#��4a
���ʱZd_�A�׊q��J�CS2�I[�x3���@�=�j�#1߃kU'nAFb��Y'������)��}�A����
�����QG�)q�BC���Vs�3}2(���˭��U�����NE}*����oi��},������$�o|�%�f��ƅ5��������8�=�PS������~-l1b��R����0��2}��f�����x\�_}�C�`��B�,J������׉�*�6ga�HJ���.?¸�-^�9�]����`Sx1��K1�>�q�멷�8jsIٻP��i?z�S,��V#dh�wR
WiT�R'j�;�.�@0b5!"��)�n�6RE<�y
��Ts��l�)8Zg<2"y�\|��/��qa��������D�WH���L���C7mr�c�iE	3�J��� �ڬ�s�{�3Y�����p�ܜ�Dݱ�| �a���di�̺^�n�ZI�_��MԶQ���������?Ba�0�R����BQ�D���0�]�8���ƹx� |q�J8G�!� :�^j�=kr&��8F��x�C����Uܧn�O��^G�W,�(	��&���������.��izP��Ofw�\s$%ldJ��o��~2XML�Ηͭ֞�I�cINL"��>|x�Z]�Tx�{���.%�8%��U"?���u$+�
�'u	4�!��[�!ڶ/ȿE�TD{���)[	*՛�&v��e�Z�ES�z5�ݤ��ݠ��8�*��/-5�Ƨ`L���Dܟp�x��[,实l-�l�x<r�#i��<�_�Ki|N���!=����-����-�V��*�	�U��ꏾY	)��2v��PY7"��ܲ��|2/�]D,���Y-��IHZ���̍9�.�0�K)�y�i��Cm�jI5JD�r�E�?By�0�j�Y��l��Xy�1ں^jF�!���I���qp��oھ��h̢Eb-��&	 � �"�i'�e�ā�l����17҃����r.7�up�<
BH	�i�0x˃u�r\��l�^	N��Q-���w	�|㧲s�O%����q�B�X͐}v��Ņ�v��`��E9���o�0K���:�����x5F�����2]��ׯ���V���oIPuh3%8�^("dZ+�Ϳ$4F�nJ���$�I�ӈ����V0�l���^�S5�&��狝�7��_��(�_��>���޿�c�F�3�hW��#��Qw\ԡ)�m3�IJq�ǫ���D��b��BĨ�f��F݀��ʑ�R���>��@<�Bh6���ypQ�E�d.��w�� �� �D��DRX�d|�S����Z~C~B���C�0�2��D߅�PTECY�\q��<�St��k���K�]�n�����:�Љ�/��(����^,0�����_;���OC+�E��G-�q��o��u�w�B��$j�w?� U@��׵��E�sM?��r�_�1���J
����
.L0Bar�nrT-iꧤ]u�!�V/�� �k�ne���KՈ�x=��I߇2zx�m"d��Eħ>%f/�Ӕ��� V��+C��:nJ;NS2d�a��D<�:�ye���N(��/ֻKm��?�B �"2T�뭉57vt+��҅&Bf�w�S��\��uz�@2�`&5�=-~ҹ� h���U���� ���"BAS5M6w:IC��=�	����'����������x46��bSO��5�t3�t�W�U~�{�UTꁼ�b���hCgvbQʩg�STԑ뺦j(�=aԞ�,`Td��-�'��ޯ�"���.'NQ�p%o � '"�Tb�'n Z�|�t~��[de�����'��x&�{>��wlхk�+���P�̫4�t��������l�($���-��{���y~�Ϣ)?^�[�]�{�VR쟢D�a�w~S��QA�����fh~$r��(h�ja�3����Pc�1X�8j6�>�bTmҾ�
\0�|�u��f��C?G������������B�b�F����R��U_b���`����`�����j�������Vb8��E���V�z�(BJ<Hs�E7#}@�&��fB�`b�va?�rGk�����5 �H~�j��v�+tm���k��D��m!0�}_���;"&Q0Hu◝�X��G�(�S�`��tH<d�)�^E4iҏ��39G^a�9r~��k3)o�igU� �O{K��(G(��t��^��Em��*ь�4WN��z���\�):�x�_!��C��M��2ʪ����m�h��BdP�5Z��5h����a��ΤNE�
��z�C���te���x6����@�ZC:� �MDt�/�#���=�����|L��P/l+����1��B�h����wkZ�2s3��6�����"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metaSchema = require("./schema.json");
const applicator = require("./meta/applicator.json");
const content = require("./meta/content.json");
const core = require("./meta/core.json");
const format = require("./meta/format.json");
const metadata = require("./meta/meta-data.json");
const validation = require("./meta/validation.json");
const META_SUPPORT_DATA = ["/properties"];
function addMetaSchema2019($data) {
    ;
    [
        metaSchema,
  