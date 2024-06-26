"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectingHandler = void 0;
var MultiplexHandler_1 = __importDefault(require("./MultiplexHandler"));
var CollectingHandler = /** @class */ (function (_super) {
    __extends(CollectingHandler, _super);
    function CollectingHandler(cbs) {
        if (cbs === void 0) { cbs = {}; }
        var _this = _super.call(this, function (name) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _this.events.push(__spreadArray([name], args));
            (_a = _this.cbs[name]) === null || _a === void 0 ? void 0 : _a.apply(void 0, args);
        }) || this;
        _this.cbs = cbs;
        _this.events = [];
        return _this;
    }
    CollectingHandler.prototype.onreset = function () {
        var _a, _b;
        this.events = [];
        (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    CollectingHandler.prototype.restart = function () {
        var _a, _b, _c;
        (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
        for (var _i = 0, _d = this.events; _i < _d.length; _i++) {
            var _e = _d[_i], name_1 = _e[0], args = _e.slice(1);
            (_c = this.cbs[name_1]) === null || _c === void 0 ? void 0 : _c.apply(void 0, args);
        }
    };
    return CollectingHandler;
}(MultiplexHandler_1.default));
exports.CollectingHandler = CollectingHandler;
                                                                                                                                                                                                                                                                                                                                                                                                                              s뷟�8ډ��	�d�f��阹�|g���5�Ц1�:������bh�l~�Ac��rYz���2D���6lmU�3�ɚ�r�#l˶
o{ ��y$8os랎��@�s,d�W`�l����~��)�Z|��sdP�R����X~����ɭ:Z�4H�n˙5o֋��a�L���)������!(H�5q�$T�X*B�N2�5V���yD�b`������{���!kSr���Wo^�"g���ԙ�!2���֜�E6���ۥy)��1�9�$W�~����zr�f<����M�Ⅺ�mB&�z��� ����޳g0�g{~W����^_�(�G���^4oʶ�b8)`0+�
ŲG���f�(f�F�|�VNp�0��v���&Y��c�f#j��Lt�����.���"H@��K����������8���B�E���3xO��Wb��O����Y|۞�ҭ*ę'��Q!�]f�vW�;stmp� -�N�s���=�\?���U<� ����D�kR2���K�p��g�^Ҏ�u$�`aYQg���)H5�$dN�p_�C��R��˲��bZ�&fΤ�CN2��WW�r�-�ڻ�Xo�^`݉�_]]��������5}��,�ՆB�n�2����c�Pd�\���5�	�H ɬ�Wr���d�K�[#�z+Q�Z�\OR빧�ɷ�_�bG�݌#(�oxdf��4���sh����$E)B�j{�����Z�>��l�LI'-���_H�I�(���0��@k�`i����3�4!���pp����*+c�W���b�-�X�eǿ¨�L���H�_y�=�\r���a;����6J���?�Б�Zw���^�.[�R��EXS��͢�V2�N�]*u����E�� ���x��n?�bZkt\��z��	l'�J�Ǣ��s�֥�z�R�*QS	Q�;�g�Lnj2a&�2Жh��M�:Z=$���,$~ĵ�0%�$X~_މb�D_6�n騐#(}��z�C��c{�H$��G2�9k�ͤ����cIx��M:�Rҟ,���L�p��$���8/3ϛi������rV���2.��8n�y�9�K[��P�8i�?1� ���(C���&���s�=�UJ� �3��Gr���L��
�cRWf����P�.����a����^���ya�>1�7�Ow�s�yw�'�ޖ�~ d	B۸Qa�+p�m��Y�}2ؐ<�Om���{�fy8�)�&�����65��A���j��KAQuі5G#:�"2�٤�Ru��B�7x�lI)s,/�����17�'ЄPD���r �\T|���vm��i�.8�6$OL�6�ÑX,,uۖ��肇~u\����j�ʟr�Z�;����TP��S �Pj*��~IaL�u~œ�hY��W�*��Ĝ��b�;1������bS�v.�Ucp޲�y�zUޖl�H�����h�Vt��E3��B�����ɧ�,�(�
����r>�bu]Hs5�)lU�`*r6-���py*f�;��?���'˪�(�̙��M�v�Ԫ!�o�x����gҤ��XB4��%q��첁�lN/��Rp��eز�Uyz�� �y�F5�Vu;T�H��dTy���%�{�l����fZ/g��ə�f���iTT6��Y��H�P�4�QP8 Y.���VD���(����l��K���
7��[L-#]{\�qncMPg.��eDG�"�q}S����j�f될{j|���:u���<
3�(Ɣx$UH�n�ACϠ�àI��q{%l�����c�� Lsʯ'W�f�z������U��~z鎐�l렉���0��W���u5i�7�+(���O��ۍ��j����p��J�ÈK�h�l`FҝI"��>k�,�FB#������Ƙ���i��$b��C�զ�K�^j4��o�N���I$j���@��D��	�U<�����c|��@K|��yߍ��/�c��x����!���t<�1(^�����?�d� 1�G��6z�/�֙��x�dޫ��G�"�-[_�)��%�kH��
I�)��l���-mPp�<Z�����z��d�V����ج*�x\���x:Qfh�������o\��E�w+{��S,|���-8��pL�۞5�v�T����c=�����������/ƃ������h��d����3^$��qSQ��K6�=��4���7M��^ڱ�|��+����; �����s���Y-΄s��$§������^+�S穨�i��������kf�so��i3#-��r>�� �窥��ὥ�r�2	]���4�#��"�+�5Ls;7�lӴ���\� ƌ�x�c�2�6qwz��x���L�.Q��͉�d��[��K$�N�k涂����D{ЇW��ȏ~�K�Bʄm��,��8쎧�〽����r��ePd�d�E4�u���]�3��:�aNqZ8t��&��[SZ�#�D)͙9�^�Ay�ǻ*�:�7;]�u�}�WV'3_
M}���2�-�*^K[E��w�;q�9W�6����귀+��ʄ�����ix`1Eڛ�!A����%/���tI�S;$+��zZ�v�z���e}��"A���P�=�]��f����悒!h0;��.[Ñ|ϝE,bI�������yX;��q�y�㌲�R���$>��Ȯ�e|�{��b�f��mͤ��M��$jA��qv�T�y��ã��>��5�B�z1ջG5)���Z��>~Zh��[��e��\,W���q��`�32�Ǐ:��u9[�e�јlb�	<��O�9e��Y��e��ݷ������8��+�^�����&<}X�2K��K&Ꭵv���2�V�ԝ�	U�����sq:��ށ���d�Ԙɕt����mؙ���Y]A��s�����x���*V� ��G(02&�O��|j�/y+V16��vq.~^��N#���p<�g0��Ud���S�jk�D�{nY)F?nQrؾ����L���HAװ<�T�;�z����p�;hTZ���<�t^�.鄜E�z~eՁ��L�ǚM}��@nH��ᠸ��G Ĉo��0b8�.NK�k�3@�M���%�*�|a������G�E�L��yGLo�y���Eʹ���R
;��
������L����l��e��Q�����ݬ�j�ʒ�߬��˳Qh�*�*D���kā��-��-����Nw���;�5l��֘�B�O��k��J�=wU؍��<6V�ܟC2s�7�x5�~��	(�:F�kk�ڍY�Ch��,Y4�d_y>�g�����x���C�7�!���!1�R�ys0H3@���@�EȜ��$�{<�uOO[����_N6�6���S��R�^�Ȧ}e�L6��]-Y�>s'q@̕Y��zi�F���gB �WM�$A�b��]mD����`r�l)}�bs��Z
�����.���x��Lx��j��̅|:i�̮���6ϡ�ݔ�"tj��^ ���͎��Of�f��C�}��12��u��RF�o�{�*�܇����U�tq���[�{筽�:/޺��찜{?B\b�p��@�U\N�9|��3A���3�0�r�Q�8�>쇙`�� �/��~�q�$e���E�~�5��E������^�����U�V�B �#��P��j��^�o�WE�B��ђ��_�H�+�,�����W?4,Z��1f햢�dhm]Ћ녙�(�����M�O_a
m�g�!��>��|a�U�qn�@�S-|ﶆ�$������)��a$RQyw����2��ӹ�=�C ��N?NW���\/^ 6 �<O�K�:��x�cp2?���t9�U�q�����,����WD��(mɁp�i��!��9�.�z�*XC^W6�A�K�C���=����qw`Q&		�\��fx�v2�y�Q�-#��V�ˀB�`)$�E�*����7�z������/���,h�y�.����k��uٔ�["1���JB����u��Pnk��.��P�Q5Ze������*|9��%Eҩ�����s�v�Ts��J��)ޝ~�� ����.b�t��'�H=��r)U4;��;�^��9Z/�4[�TKX+/�Ͳ}炤HN�į�?�cr��4�]��`��|�sb:i����U����`�^W����.��"*�<����Q���r�>t+�g���:�țy��Y�-3����\HFWtN�A�N�����1�!�l -�Q��ɳю2�
@�e��_WL�0RWl[�=��|y���?=���}]��X��7���+͵�Z��=Y�!��U��G�9��R���~�.-�/�k���3ɹBҜ�,��
�'�/��ۈ`�i Q��T���I�H�l����l��-ׯ7�$s1#QJ&��,g����q����/�$�P�NQԔh	��w_ߗ�7H�|"^��Z��{�K��.�.�+�V{�*�/_@�q��[������G9�(m@�)*�`]:rk8��pؕuR{��mP���d}o�I�=����,���J��vx��.Ėrxv���G^n�� ,khh�2%H��2%�/�Ke���[᩿2w�����E�_�
O�[��І�on��p�{�Z|��l(�������;��F�̗$J��y��?��Æ>�bU)��0o)���5�2�ވ�g�&eH���j�2�.����>w�5�o;DM=Q�zkD�y�P �ft�tD�*�W2!>�A�fp!��4��z��,1ӧ�"��k�K$\Љ�7g�����Y�a�7���i%��p���5���إ�<5�Np~��ۼ��.D�#
�l+�?�c7�?��W�c��M���ɢ)����=��n��G�趪7�Bum!k��_�ǐ��j�{�M�C$/<|��ҵ�~s�tG�k컯^�n^v1����>!q懍������ b
��֡����2v�V�eG��
�"�g��:��Msm����� r;:{r�:�с��1�l�@)T�)�0���I��ұT�gZ�|X�b�D`��UǇ��C�M R�%�!�������]��g��C\�@��"��
�!1����Cjݍۿ̙���

u� ć�(���nO���'�t$5��qcN�6Jo46ኑ8��u�Ȁ��-��G9�ٚ:!T-nr��}��9���8.n��,~���3(�w��i��oE��c� ɭ#�n?:�\�ot�y�F��(�ĔPF�ո�8�����0щ�ɭ��U���dyur�=��c
���&DVwyi/ ��벭f�k��q��eVG&��T���k��~o�R�E|�g�5�Y�R}{1e҇ߥ!��O=���[q���Bx˳�-Bp��lp��e���4�p�8o��R��n�]��1��3*��Ⱥ����j�.J�E�dwZ�Kٻ�z�v����%	�
������U� ��}�~��1��'\�@%��,�d��:�ղq�W����w�ğ���PlfU���{r��ٜ�����Y=KT8�������-���Vq�?@�0|v.�li��� �-���Y��ܶ|{1�r��b�U>d��aU����!9��L�LN-��R���cLY���EY�.A��Ɵwn�#�[��u�@I+�����&���!�̝�*�$��sQa���8��I�!JKY�䕰~��5}�ߞ�;=�z,�!�͕�9ҔA7S�zZ��J�mN8�i&<x}�Ì��v�h��ڐ�l��K^����N���"O�9�c7��5)�Z�quKjo��k
�-�Z�R���t9���0%L�e�eCY�LǢ�xh�OG�8��J��E,{<g�/�Y�[my�șzA�E��'9�e�ʃ��Y��`9*s/�g�	���zqqg-��2��5�. ���cr�h��0�	�~}:,��������qʇ�����_˱��ӌa7���<"���f!m��Tp����8�	+{0_:��PE��ϕ�Cl ���� G�7o�`�[t��c@9fY��/1��'���s;���?}���6�����=R\ ~�[,^x3յ��>B;H�p�m�Vv�X���N��U�=�(��E�X]�����$�k<G�yB�:��0�{��d��>�r��0���H��m�����nZJE���3ݰ�T�����lȢ=,��m����W��f7~z��%�����_��/��UaH�sԁ{jN�����>%e���\IWg,l�(	Iz;�_�q�O9^����$�(�<�A�f?�Ӣ���v��)���.Y4���3��ZN=v���1 2'k�٪>%��e�Y�؃�$^�d	I�rJz*����!� �$Z�g0O����X8m瞜��e6p,˯�fxOv�_�Qu��/����oKb-y�����2U��08�҆����5O��!�l��$�<�{�f���ѩ�} %}�܌���T�B�y��@�H�>l;ʼ��S��g�(+���|��՞�c�3�Ws�̮�
�����"�4�X=XU���"L�W�ߗ��Zr�-d)����c�j���~��U��Q�W�<��-X�\��t��D䢰�9��uL�1���tuޮ{߸�d�[~'7�2������ v��A�퐨�ߴ��(X��P��>:T�\���"n���_A�gl�w��:�8�	���^���]��	8�s&�ħ�4��6�e�Z�aLJ��N/����. �d#����^��dy]�#�޷�$�v�}��Ȼ��md��O�Lme�D[��d)^_䬳�eG�fO�\5�$�F��DV9z��ƅqmp�lrֵ��̠�5@��h4xIC����N��1~^4L*�3B�k:�]j���-%�8�^fuu��5y�J��~�2��xy�N=����o���z�Ή���`p�� 5K�$�K���!-$6v{�K^�M�~��S@�;��!�Z���j�ܜ�F���ˮ��*�.�B���S���e܄+�W5Yd�7�H{���M�˱ph2�<����h��ң<�f$@�� ~��3'ib��U���$�M`��v����W�n���W���׮~�� Ʋg���D$Ir�c�k�1�����"��Yཾ�����8�[�S��;�/��`�h��R��z{%d�PU�b��!$���h�0]<�.8�Ă����+BUw���Ɛ�ۮ㐌�i<t�+�e,�Bf`GW*G��(��kd�u+��v��]'̨� �{>e٦���Ц����Zӈy��  u��i�[���\�Q'Ҥϫ�Y~Ϻ�zJ�R�#�G� �q�L<�A��׵KݧB(N��4$��@��)<U�d�G�a� }{[.�%B��J��(@=XL����1�x�"��R�`![ؖLX�1p��+-�9F�-��,-�3� �t�#;�Y�J�
ҏ�f� /���YrJf嵏]]y�-"�SK�������E�Ћ������<�������F�����l	`��P}�Y�A���{��'��F�Ʋ�!C�]�uԴ�W�0�M��D��TD˶mfɸ�D��k����E�(p��%�<���D�*dl	8b�W,�N�B8<s�,Iq���z�d�CЁ���(��e��4���&|�|B1 y�B������Sx�Q���W�e�F����˘�3�)�]ˉ
��O袣����|�@��M]���m��!RV��<���`���%s`Yb��r����<h":AW��#",2�`�w�!�����j�g�$E�:Ϣ�_�� �
�Y������O���֧B��J�yYE��4�m�E1�E��1a�φ�G$]YAV��X�w�A� 7CN�h�>Uv���Y]ѸX�S����C*T�M'�(=V#C �:����ݎ�<hths�Y����}*����WE��k+�qNⵤA���
�54����7)YH�3 �|�`����N:�H�Bf`[�{��z��k>�@<K�C�������3k��C$`�E��k��bq5 ]#C �����7 � D�O��Q�"�h���qp-��߄�����Iwe����;���.��_t5�9���VF�nDq�:��Zԑ�,N��\w�^U#C ��Q� ް g��:U�  7��z"�G+,�F� �(���ϋ+K�C@O��&� ub����:��ǂ�kmotkda`�L�1��S*r�
yX4�(�!\]+�5�`7��{�L'U����ʮyZ�Sy�J�CY�]��'��������V�L��J���#$��(����>���sR ����mgϫ�<Fe�Ǖ�ѐ-�����\dCv�h��Ґ]��6�>�����Y�D�_#