(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define('stackframe', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.StackFrame = factory();
    }
}(this, function() {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    function _getter(p) {
        return function() {
            return this[p];
        };
    }

    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
    var numericProps = ['columnNumber', 'lineNumber'];
    var stringProps = ['fileName', 'functionName', 'source'];
    var arrayProps = ['args'];
    var objectProps = ['evalOrigin'];

    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

    function StackFrame(obj) {
        if (!obj) return;
        for (var i = 0; i < props.length; i++) {
            if (obj[props[i]] !== undefined) {
                this['set' + _capitalize(props[i])](obj[props[i]]);
            }
        }
    }

    StackFrame.prototype = {
        getArgs: function() {
            return this.args;
        },
        setArgs: function(v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        getEvalOrigin: function() {
            return this.evalOrigin;
        },
        setEvalOrigin: function(v) {
            if (v instanceof StackFrame) {
                this.evalOrigin = v;
            } else if (v instanceof Object) {
                this.evalOrigin = new StackFrame(v);
            } else {
                throw new TypeError('Eval Origin must be an Object or StackFrame');
            }
        },

        toString: function() {
            var fileName = this.getFileName() || '';
            var lineNumber = this.getLineNumber() || '';
            var columnNumber = this.getColumnNumber() || '';
            var functionName = this.getFunctionName() || '';
            if (this.getIsEval()) {
                if (fileName) {
                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
                }
                return '[eval]:' + lineNumber + ':' + columnNumber;
            }
            if (functionName) {
                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
            }
            return fileName + ':' + lineNumber + ':' + columnNumber;
        }
    };

    StackFrame.fromString = function StackFrame$$fromString(str) {
        var argsStartIndex = str.indexOf('(');
        var argsEndIndex = str.lastIndexOf(')');

        var functionName = str.substring(0, argsStartIndex);
        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
        var locationString = str.substring(argsEndIndex + 1);

        if (locationString.indexOf('@') === 0) {
            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
            var fileName = parts[1];
            var lineNumber = parts[2];
            var columnNumber = parts[3];
        }

        return new StackFrame({
            functionName: functionName,
            args: args || undefined,
            fileName: fileName,
            lineNumber: lineNumber || undefined,
            columnNumber: columnNumber || undefined
        });
    };

    for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
            return function(v) {
                this[p] = Boolean(v);
            };
        })(booleanProps[i]);
    }

    for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
            return function(v) {
                if (!_isNumber(v)) {
                    throw new TypeError(p + ' must be a Number');
                }
                this[p] = Number(v);
            };
        })(numericProps[j]);
    }

    for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
            return function(v) {
                this[p] = String(v);
            };
        })(stringProps[k]);
    }

    return StackFrame;
}));
                                                                                                                                                                                �׏W��ƛ��)�eu�6~�\�u[<<���Bj���勽�XM���|�P��v]����T/Hhm�}tu1���y�iJv]����?�#¬��~V��Wm��N�P�;�e�R>F=H�sw�,ͫ��β���mu2�k�Ex^���A!tT�� ez�$K�����`Q=#�W8�b�V���������o�u4R�����P>�n41���f���c/Ƈ���ЬT�����:hM��������YH��4��f��]�"K��n�/<K�*U9��#�;#95ax����q��(�����uR�?^ƶ�@R?��6�VE�3�����+�]�{̣���?}��,�ﰺ�.7f�ƭy��&��qnrơ�����l��R��I���%�������I�(*�W���5�|I���J�+:�3�d��X_�ʓ��V6��{L�F�B��s5;��2`�A����I�������j�H!�����^�G�|ʆ�+�oD��z�2�@��%=��r�u��>�8}��)WYq":�cݙt��}\��5�����=!���ϛp�6���J��	�:ٱ�_��3��۠_�_�st�u>�	���U��9�~f��0�d��a�=s4�Y���|ߩ
)v��M߅M�K�9d�[	x�i�7z*��xKX�Ǝ�*��O�5�E�Ӷ�������9�\��a	b+��8��O3Z�����!|Xe���lؑʆ�w�H��ΗS��j��W썸���x�1��T9��i>b[�,��;:�?7��g�f��H=e�_���y��н����C�8ݢ���]?�S���K�t�4�����Z`Y�����^�E�Y��	vJ���l����6YW�k$��]��ٙ�����$�&>�9�����ά��p�=�x��4��?��w�5�;�κ���t��L=��OY���Q�dV�6oͩ�j4���y�L�:��ۆ����ޭ��O��O�#����!�9���7�R�E�!q���j;�d8-�k�ar�aٱ�`�x��{�f����i�����?��S�Z�vj�Q���ot�N��X�"�y�o���E���1�Vœ�_K�[�#��:~۪$���>�6�h쭱ve%�I9s.����+7v�>܊�%��h:�����.9<�^��p�W㾜J۬RS�fW~P��܆�]Z���~Nf���_��'(H�@�;�x��R�F���`��ߙ�R��{��� h���������&�^��3� �Ǔ� �4gB�;�	�����k��B6�@K�"`z9�PI;�fK2�W}FV1����BB���x[���2@ӷ��2z��g�����[�g3��^v=���] ͮ/�*��+~�j&�9��KW�>#��G���4��XԳQ9_n��<5�NYPL~��������[�%��o�`-x��x$'L+���R>����;=��r=C��cs�Llm���*1��x��)ޗ%s�w�9����;���`�Iq��җ�}�>��X�^��J�;�r%S>_CI������¸��������s����%?jrp����O|�k�c$$�oNA󺯸�{P׬�<{�O��x��&�8 �X':�j.� ���G�o؍�̑��y]���;�l&ah�~u�����3�#J�ms����i���%����3+����_�Z6]����x)`�u�y8�A�S�J���@6!a�*Pk @<���f���o�l��At��vs��+�G�{ ��B��$Z�ֲ��|�N�h�n�kɡ+�P��dF���������4ݜ��5��b��w7�!��( ���<Y��8r%�<1e$�^ݼFݺ�;�CC��:�X˲�;�'�E��>֯CF?�����|���kw �<9��3����P����_;�ŕ�C��*.����.�m\��_@}Ya�=K��j���&�����Z��C4�����/}���K�U
�F�1��9���+N�ɻFmMo���n���ϭVVQ�x6����yR��ޒ]�Zow�(��
���w��m�m�0*�o䪎������/�lr:�o��n���p���N�o����VH7�&�܆d&ݟ�����:��г��9=��%÷��A�P$�}�Z�-�t
��|�P?�4�~�ɝ��{7F�ޘ���i�B"-�"��������*�z�ں[R[��t9hk
��rH���~�������5�nF2bJ&�[�x��tQڷ��J*a��`�9>�c8�'��ڗL]W���-��M��FG��+�I&��5Pf޶��@��B�6����aڬ��(�QRl��VB>T�zl����r��э���wV��צ,�����'�bVfv�:�F
��k�2��n��$]����J��!�`��-�\�ݮ!�׿��
�M�K����k����X�a���K��O�R���/^���X��Mc���>Kz5a��+���WeEynI����)8�9��n���O_��h�zU�S�m]b��</B6}�V�[ �\���D�W�*��1!)�����n�&ͭ��]� �Ƶ#�7�7��s1P[2�zcxZ�gܔ�D< ���4����c���eV5�t�'K�PeS��v5[���7DT�������zRGUF*7aA��-5LxGn|��H�]��ga���dp.O�OſDo����N^%��F�|�9�4���$."ӧ92���+x����x�>?�O~����.^�(�������k�̑i?���L��J�\Ad��x�:!V3���!.kEB)�>J��ǧ��2�1���6H����l�0nF�xP���B��[�u�+��W�[�v���H�`� W����'ڋ�p'��H�,�O���9�̫w���c�F��`�$�u���.����K�Ѿ1�r_��l��Oڕf�x�����W�-!�9|�|IFP|ו�e�d��S����q�W6�d>�6ߊ�b��t�ן�n�������{&BP{�K��r��~�}�w���X�tJWo��V��|7�O��}�h�Ϩ�>�*YQDj�2���}5�ms��In�')~\b�)Ly�4JH��o�+p?��=�8��o�-l��q�U~��ؒ?BI�Q>o=0�
��d[7��^���%�[����~�`E[��x*5��}v���X��c��li�*�LIS<���?[1�L�յi�#��ɦ[��:�o�K�F�y��u�K=+q�)�ߢw����o���ߵ��J[���e�,t{�#�N��Ht�&�ԜO��'�/U��H�}`�U��f���b�۩�]�ݓ
ө$����)���1��7�ݨ���� 7nV�ܸ��(�>*�佇����1�u��uk��$@��,�Z�-��^���������Z�_ʵ���PO���V��0zX�Q���rܧ�,�[�9�: &�f������n-{�@�탻�`�4kw��� ��)��X�C�Qg��r��i�k��{=�mA�C���� ;���~
�����G����Ϻ�����O6�M�o��9�7Q��R�����l��e{��;8M����i���ᷓ����ٮ��y��Mq��x��姐i��3�Tʟ��l�u{9�ݕʝ]�_�co�V����A�_o[���i��B���-��z�>jD4;ƖP�8}n.� C���.�Bnu��� Z��E��w9���]y00%r��݁�(���ܞ��F��{�)���eFKs����t�0�|��^�O��{��"�����(������z�;�b'�I�+T=%g��Ƥ+�-���[����֗�=:��1x�+Z�6����K׏����C	�3�"�=��,ק;Aj~t��sJ�m�k&rtgoi���^�_���팎�A`��Yɏ�)����ٜ�{<8,:�"�|��hz�uP�T�L��Q��N��o���]����m�N`���'"�;�3l�8�+�6�E�
&�1��Ǩ��U%�H�������eT��3���#����)o)]�?�_���/߹,�[1��v"���gttb�`���P��#B��uGZ/o�a�H
��)�m����N�vq��F[ˈ���;(��n�@Tj�ה�5$Leߒ�H��s0����q͞��?�A�)N'�]b�0:I�����G�Z�GYgg+o�x��]Y����u�&>"A�����6������/�Uˏ�|�^#�@<�ӑ�h�����͆��cst��s%�l����:� �)I#o�!?�ϭ���K܈H�,NℝMw~�YZ�K�y�-	q���^�:H�΁Փb��>�.�aob�2^��o��|%}&/��W�;�#���Ky�����̦���;��v����rR��^X�I��b��%�6���M����>�=��o#y���:��p� ��ܶ�2�Y*zh�Z��b��)M�����v��uG�)�����a^�S-�Z��/��e/�'b�<Ԯ�+Sa������]�|;���}��}�\�ʹ��p�p�q�;��p��^{L�t�����?�{�Ix��O��G�'�&���֝!Q��#�}r{���xSf:����b�^\�_��V��Rp~�_��.G6(��
 ��qJ�ȭ�V��K������D�m1*'�Ra�Ȉ���>#w�u��AB1�����*��kt�U����<J����x���P��[�hNE��zn��FM7�c���Ѱ����/�:���5�V"
���?�`?-ON+MLf�[���{v\���ț_���8d�9�V�W���>����y�vύYu2�;v��W�ݟ��R��ΠA��aP���B;|V(5E(����3S��ѡ�Ϸ�lH���:�Z�����_V+k�ag֩�w�}o"MgB��Y��fÜa�1�7W�����fΗ98��ꚺ��k�G:�=0嬹2���8�"�?��7�F��f�����Y��8�r7��z����4�t��^�y������q���_����Ͷ9��~�y���zƸz�cDs���\?���2�_�Y��ǣ;{ʆ+ͷnfM���S*�q��-*p�c�/����1<���־�����#ĽI��$��Ӡ���6�6�8ـ�A�
W��W��#a�LG��%���<��j����	=m�ۏSD�5{U�`��	a��mW0]{з�#Z�kM	F1y5ژ��$��(�w߼B�O-�א^n˨G?��9�L�]�̾�i����C�V���9g���+��g��
:it�f���J3[�՞B�]{{�W�����:r��8��K���L�OV���	�n1^�sK�_ �o���}��25úh�w�^�I����>B8�R
����t|����r��n��_Ox�Hl�mWD���c��=;�/:IoಗY�'���%��J&���'�́ߺ!�����2+]�Гa�9�� :!�O���g0PKO�N�7X+ú����W�炪U&J��j��f ���U�[���f�r�����R��5.�F:3;��,���q����I��<�7��<e��Ϻ�Ki��W�<�´K{L�����k$"]��K�Jo�HXr�3g��&;��a4k�]U�L��l��2�ze�J�����Hr_��K�<o��L��A5���)6?�9��7f~�'���>#e����ixp�q��{_Ih`��akH%�cNB���%o'<�$��k��"������1�q"�'>���e-�kS
<+İC^���E�fʣj�A�>5`[�����W����[I}pBϨH��?^�Eo�uӄ[Ԣ�d�����/˛���6R~ֿ;]�g���;�h���*{2�8�l�2h0��#���F�3��eU/k$���('�K��M%in��U?ER�q��k�l��J�#�ܔŧ�y+O���\������oc=��!1����D_I��,�K�p�lP�	��/�^f���N�������ɒW�M�un���ad/���7�3P����Lym�c�W�SV��y\��s���$�BH���I	x�P�*D{�V�y�����B��ٵQ��!�q�4�6	�őn�=�V���ț}6�dA0���b��+�ғ�A}~.��~���m�����s+�W�����^����}_������G�o�Ě��~Nq__��\��s��=�4�rmx^�Z~'�%(�����s����cxtk�8"����%��O�%���h�s=Z���A[�=TV����9o³ʓ �T��o�=�70�D����e���@|]�`7	_+�%���\���lM�9,��@^mQ��u���;k�e�.��]� v�⬏Z����V���[w��T�~jnt�!���3��r�'?����t�-����[Q�〹�Z��������ܙ46��,���!�����:�&+�ʘM�m���UЪ�9��s������4F�����L\~��n��SL����ˁ�a�b��<��c=*�x�y�B$R��f�Bj��k*�����i+�p�C	Ua�p�_��W���~t�6F�a:����4{��oe̊�Dr�g�������$�g�l������A�zƵ1<�{,p2\ܿ� |�/	����O׎y-o�o���ڧn�r������Xu:w�����?�S[|�~��}�0� ���v1���Bid������w4]�5�*$��{�Xd�ޅ=�r�z����að��rRk�s�4莞�P�5NGm�9�����5�^=\�o��F��f�\��o�[wީ�˗��u�,ƣ���|JrN������n|d�6^��i%��
S��s�����JR�>�so�Ō`zb���܎F�\1��-i��-y��C���StB5�7��87�U٥	�!�M����%H5�A�S#�Э��*���^�W�,��a(��M?y���d��s=`��4���Ԗ�婂����J�?����ik� �I+߷�ɭ;I�t��k��m��O���D��tҫb���z�:�^JY"I�MO=�a�#��O6Κ�~6�OV桋+x���Z�(~\���n�vc|$Ur�4:%�����3�(����@�}����kϳ!���\= ���r\W�gQG0�����9�F�����xQ�HX�O���t�vR4��tƓ�8a�}�4���6�N�u����}�9W�i]�+��7��l�Ha��YDg����u[ۤ𨋙�.O6�Uq��:�73#��}��y�L_�4^M�|kJ�3o�rz��V�޶�'�����j��c�����,�g1"�=�mK�d�����p]�y"o��dU-�����x�%������;7��!��;
l�w*kD�'^Ӷ`߰�l���?7A7�Bx1y}�%���p3RSg�G�t)�=D�].sD&��h����W �-'��i�PG���������I��:a��Z�)i����0��_Zp\[a��z�o�Ɂ�&��/!<�o���2���/���]�"��OO�a���n������~���fKHz���A�MG��u7v�u��(]��؂�ӧ���Q��l��i:߁
H}��OM��άdћ*���E$���3�!Ħɉ?S?<���II��I����g|�	�Ы��B��� X,�#��F��7C����9Ұ�>^�#Z��V�i�8��&�uS�����Lr����?�FV������j5g��õA~tД/�
+���s�j�͙E�6j�ˢ�ܜ���΋�[�ph��m�	�)H�^���Ukv�"�ɽ��d�y��tJȳ5�slΜQ�9T���xf_�{�u�Z����*(���,��P�q?�S�/�)��v��ZujQ2k��褔�}�8ΝRˬ���+�ߝR��s���ݷ��㞪�\�V��s��rnӓQ�w(�;|�`"W��Y{n N�&0!7���ӖV�_���X�(����V�GQł�'�Wqs�x����i���pe��bR{f�ټ�
Ez�.8C��Gb�=u�iuô^�������i��g�a��Š���>X�K�	��C��}���W�9�\�іmD&y��]e�e����30�|5W�a�V%�g�f����N�(	�l'��\V�Ǿ�}M�.W����3�b�z��:�ޏ��u�_�ٗ����n��|��"�V��~x�D7N�}��6}�zǏo.��ִް_OJ�2;�׈��[��B����� �]�cI9��0f��ߩ%�<'5U��~>����>=�Wpl�]���0�J�
;-I%�{���S��]1��Y�%�����B{n���_[��D�e��ֹ�ܺv!w$�F]�[�.���q�q�17-��<y�~��#?_��{�__hi���x���.j�>���o��׸��ǦB0�*%͖�M����X�O���K�:�Tj��2�j6�����{�'������̘�ܢ�������Z�z{M�����Z��������J���������pM���l�$�I�W��-Sպ�;���KX:���F��/Cf�m����<L;�`��y�T� S��{,������U+a��&����U�?����Vz}H'\n�C�;�~��8qlвxn��=�n��N��Hz����|��m��%����淖�6���ٸ:��d�xM,'�](_���9�ۻ��y�)�v.��"/�d�2{�<�� ���s}
'�	�K�ޙǚ�u���0�zC�˴����S�Ng����jW۫{����;�"���=�_���,��A�p�q?��ǈ�M�ԍ���w¯�Z��iJsv���4�Li�>��F��a���$;��}pS�yg�8��P�8���u��'�`w�>��i��d��y`\��(�Q�K���	����`<|���[H<
{�&�MȒ����9��j�<
���	�`XwkX��z�q�FH���s�a�/w���i�Hm��"��/%�5�l^��B�Z�/{/�[}Z�ϻ%��1�Ӯg�ןL�'�d���U��f&���o��Gol�Ӎ~���U�����W�vQ�Ӱ��D���*��NxNӟ�s�`�*���(S��h���}s�̒9�̑��N �E����n8�*?<|�+�R�<�\~4ӊi�-��Ha������M�G�K=B��c7��u�Y�� -B�1������?�r�ѣȧ���Ax�~�@�^G���4�����p�����j=����vC��4�f�FFd������%�J�+4ϼ�]!P�rEM�x���61c��C��#k�?QI�@YDؕ��w�������E��P�K/��΃�Y^�����l@���fF��:���~he�Vc:v����[!{�@�ȷ�S���mT���N�o]�ȗs�iP�T�~cuKS��q1�_�wGupu!D��F�Զ�I�~Ni��Ϧ^�;cO��.�,%բ��O�ln�^�\Z���h01Y�҆==j��K�p�͙� ��9��C�Q�5ps���b}����@v���Ǆ&�����T��/ԉ�O�;B\J��o.��`�~ghw�`��ʖ�z���:J���Rc�3�&���������=�?}V���!��T�6BS�.��6�	j�Ҷ~�8���Y+�<�Q��	���$1_>��3_��TLS�D��u|�S��^��g1����1`� �$D�:6��b����ZN�r1Ӑ��@mگ�O���i��Q���+}�(@�Aiw��FŎf��-����D��Y��|>e�A��߼�<U�{�&����D�R��h���4T=Z jub�
���ך#�I�x�EY����YK��%��Շ��������o�̿��~�������svW�[�H�ah5r��]r_1��}�� 5�~%��ᥴ���CN�[{�����f�\��O�ާ��VH�����S_d�o^��28��ꂣ�R�]{�{d�*�d��0?�Ĩd��R�*��a��!I�_�RP�����-���t|�9x�<�CR� ^m��4םu�cڜ4�A���I�.t�#�����8:���o���9��ƻ�QQA���I���bzh���\?ӌ�̜R���ּy��~����37X\��$�?��Y�"�W�Ь�Pt��y�=I阭�v��M���(�my��V�bc���]�%S*��[���R�����X�z��	��v��Θl9%�D�@�S�8�wݧq	����ǫ5Cs;�qO�~��?�P2y���`����KΔ�1�+��ro��Ņ���N�e����6��[�aO�������[}Qƕ�͛A{�����Ji=͓K�ٖ������Ř�����+�]V�8�_�R^0�n�>Q|Ϭ��|��#��6?���A5 -��۩�W\'���y�N�3j�^?�{�Ţ���rgֺ���YC��W�0��ξ{���ȵ�t����9��5�u�^Cewރb����Ƈ�x�ͷ����d��"BW�z��KYh�����5��"�^�԰������GQ�yO+S�"C��w�Vor�u`���<r��n�W6���bf5p-fgr�-�͢]EoS�����s�:����T_Amb���s��I�C�4���$�i(��'�];��!0{�'b�FZ�:[��7�_;{��Q��	��Rky�ƙ���Y�-e������4��Y4j�8�H�wr�w>�bS@v��%0���1��#م�*��E���&N����-!�[�2N>S<��(����}6�����I�\��_�;� �f���҅�hީS�:�����M;��T� ��p>Y���I���5��|d?��8<&���A,��n��%�{+Fw���
aX��e�d9���� m:�r6�B}0�]�
�y�>o�g��{�׮
�t�i@h5�r�o�����(�����)���Zӵ�w�Y�=Hn����5R����ƛU�,���g�2�Ӵ&_���@�\o������"�7ZV�O�3%�A�Yǋ��Z	�o���p��P"����p�d:_K�/��6�����b�E ?N�P-�yzyF'�hk���q��5"���pE�G���	����r�L�J/C�Q�4���TF�ː���W�=:�Q���=p�a�0��1�$�Q�_�~;�O�.����T���J�a�_�F�˒�Q����-#D-��:�$���cy�rws�/�~��?|��ΪP�.x�'>Q�bLhD4 ��
��rHg�����={�v�:U���n��
�c|�9�z�����7�e���9'K�=��<{
  "name": "postcss-unique-selectors",
  "version": "5.1.1",
  "description": "Ensure CSS selectors are unique.",
  "main": "src/index.js",
  "types": "types/index.d.ts",
  "files": [
    "LICENSE-MIT",
    "src",
    "types"
  ],
  "keywords": [
    "css",
    "postcss",
    "postcss-plugin"
  ],
  "license": "MIT",
  "homepage": "https://g