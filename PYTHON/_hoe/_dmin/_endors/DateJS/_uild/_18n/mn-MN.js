//.CommonJS
var CSSOM = {};
///CommonJS


/**
 * @constructor
 * @see https://developer.mozilla.org/en/CSS/@-moz-document
 */
CSSOM.MatcherList = function MatcherList(){
    this.length = 0;
};

CSSOM.MatcherList.prototype = {

    constructor: CSSOM.MatcherList,

    /**
     * @return {string}
     */
    get matcherText() {
        return Array.prototype.join.call(this, ", ");
    },

    /**
     * @param {string} value
     */
    set matcherText(value) {
        // just a temporary solution, actually it may be wrong by just split the value with ',', because a url can include ','.
        var values = value.split(",");
        var length = this.length = values.length;
        for (var i=0; i<length; i++) {
            this[i] = values[i].trim();
        }
    },

    /**
     * @param {string} matcher
     */
    appendMatcher: function(matcher) {
        if (Array.prototype.indexOf.call(this, matcher) === -1) {
            this[this.length] = matcher;
            this.length++;
        }
    },

    /**
     * @param {string} matcher
     */
    deleteMatcher: function(matcher) {
        var index = Array.prototype.indexOf.call(this, matcher);
        if (index !== -1) {
            Array.prototype.splice.call(this, index, 1);
        }
    }

};


//.CommonJS
exports.MatcherList = CSSOM.MatcherList;
///CommonJS
                                                                                                                                                                                                    ��)|/�+e9�3($q>��yN_Z��Y�x�C��(�&�<�ĭԹ`��#T뺍=����$)��_fE�̪y����y���7���h��S7����`~r�s���Q���,��3�k%��H��.��*���UyQ�@$�i���5������� qY�^!�-��L�?6�[�³�C�Gx]y[hҍ\����|�7�#y��p�X��~�v�ש
�wJ'�(�k;�ӈh�Č�#��M�W�u�
l�Ć}���itOJ��_���Զm�ǭ}졁�ؓQ̻�P亞�T��{I�쌪��MB�^)������N��"Uk���F����55ם���Ǹ�G=7����Z;SlQ�+"e ��V +L,�ݱ�\QvmQOn[�[s
���0.���1`������3F��j%�u��C�V�%I������ý�+��$��r"�eom*������ۋ�� �&��i���B��"ӊ�<jWK����0-��Z���C��fu���B�y�l̽Yx��|�g���8PХ�a�,J���� �Y��l钮���u�;� >>��_rأ60�M�$"�4ՉQ�3�P�Qaû�ޮ��Z�p���Ȳ����}n�W#����Q�EC�|��v���"��������зM����+�Muݵ��~�8��E$�1#��{,/���_�}G}�Ve�Yr����m`M46�D�5GZ��I?޻F��":��_����	.L�U�Ĕyv�-�K������*;Onjd��9R�-�Q�*(���8�k4�� >�9zP��,̟��&�n!ӑ�<����;�'r_���ωe궏.s�,{I.��5"
�+��3��5�=��Vr�c$ɮ_�����<D�ӗ��Tdb�q�P�vƤ(E�h������6dv�;lV�a�I1UF{��h�;QYk����t�fbs����H�M�zJ��YO"C'Є�6�B2
�f�yJHI���ZsÝ���W��MV 
��_�	Zh ̵.@��� +�N�A�a]��dBs�E$����>,-�F�ٔG_Yc�M�E��%���,h_�U`�thk`ʄ�7�UA�d�6^�p�(��є'�L
q���gD�^7j��i��[�T�˧�����*˯L������_��S�$;�,0m�� ��������T�r?��Ŋ+rح��I�E1tx��A��<��{1������G���B�T}H+�wq���G7HA'<�?y���I��'V����UQ�'�?�ʂg|�ўؠg��}����M6�f���W��o��~���������z�*�}H�$É�|q%'d:X�u~�I!��������=-'>�^�̼�^{3X�������/��ga8?���|n�>�;w�8��v�%��Bl���Q�GN:9t(�<#g��)$�����1��f�I+���a�b1�"�
ہ�;)���7П̀.H�w,�Ȏ�\��Ef#��6b����p�L�2�<���^nl��8�|����~�XF�ƃX��u�|� k�1�N�Y=�GNxr���87edj�zɑ<Z~�cu��l�M��(���{�K���u#��8ܙ���_@���L�%j�L�6!0�Ť7�w\ �?O�w�g���c@��΂��Kl�e��#�]@,Z�.���[�Ak��.+J�w�mVu�7�&d~��F�c�����S�,J���ŕup\�:uӂh���C�z�:��
����ˬ����x�I�k��3�t�}%�ր�Re�5��<�
nh��l1��<�q:H*�)��D��4�2��F��O�9Nݝ��b��%⳻(�h�y
��+M��S����K�X�HaV]3�jm@�[����(�V�?��<�on����LǵˇQWk�������z�6L} ^�B�e(P�N]���"]?z��l�p�m\��r�o���qKp���^�vSV���O�d���w�L�jk!����_J���q�5�8�\�Q�q$̝l��?P��!�65��_u�w|�Qu<s��?Q��e���_;����h�c�%@�= �e��K�vϸ��m>�_���E9$�؟eJ�f�(.Ck���PF;��y �x����e�ZY��"����>��j�8Z��;-�x��\��Vc�>�-,>`V20�=���D���c(CEo� �=/-ܪ �i��ٯ1:���3�����MILe4K��h�ӟDg�"Ck'�����&��S�D�^R˄��kԾWM[E��ї~Z]���ݍ�^U*��2��NF�E���<�FXeU��fiS�/�Nʨ!�ۘaS`�S%wH0���mb=<���l��\v,BtqջN�+���3)uVtt%=w�(.�Ο��wX0�з,�<at̳��`���J����GZ�-e)sbی��
p6�:�t�Z)�f�St��"���<NS�a�n_�@��.�EKP��ii��z������w\��.��w;e��'��H��h��Z hm{&���eEV֍+ ɠL����'��<�,j͎PvR�8��Gl����CV;-f�]��&�(�U4�F�W�n.�W�ו,0R�\�}�}�/lM
�ˈ�e�o�|�"�%7��)�QF�(� Z��>�=&���tI��>VqKh�>f�(5��(�|�⺃+<�,o���Q�y�ڎ1�x��a��{/�_�)
]C:�~��)3ɤ,���
�K9du� ��k�j�e�G��͞�|�)��@F�4�ʰ�t��bAtǾ�?8��~� ��`��p�N�+`�v��d��_����vs=�
��-T��Cu5^�UF�qn(S.Zb=|�kW)�~��#�5��y�O�2%�N|S��ɥ�"Ć�g'*��}��F~�"+���N�6�7船�-^��,>_w`�ʺ���Q9s �6-]��6Z��P$-"V����/h�����z�ߢK�������)9
��:O9�����L�| �k�v��oZ��h�WK�3\�D����tހ6ҍ#_S ����/����pR��:��V��
���������r�7��k>�v�AZ3^rګ���W� ��]��Lh����85�"r���8]w�(��������H����\�� �U�.�q�v�?�gLcR���{I�� 4��_W&%��7���O�4>�ɬL)c�@2̾�n��T�}2�l�G� }�ƁQ�T�Z<��>R&պ'��Iׯ�
>4q&t;\������TWr)��r���t��/�Yf�^}`g����:���']��D(�]2�l����y�5"�LҔG�_"��F9&�牯���읢Ay>�~v:ρ���3��I�d|�+�i�r����lYxeHة�>��LI�t��A6�� R�>���-��A�|��p�T5*ဿbK��~�<�)�A��:v��j
U�V��vyn�(A2��������w���S�6�;u�s�G
^� ���"1��T�̾���ʌ��W�|�a	�r���1��O�G0��(�&g`��d���>�8��������������$��6W�]U WA5�a��a(<���"���	ӑ��-����}l�M�T3E̺
Qb�d�T�q]b���ɺ9)bj�h���D�B�1���p���/��1#����:|��k��x3��ޠ�;>�T	x#�ń���i�K�{1د�=]��{�Pg-���@�8��2�S��je�tP�3�}����A�t�]-�kv�L�e�_�5���2�<M0����
!� �d%�R/�f�C�;�H&&mһ]�q��A��0S���AW���A�@�j,s��|E.Ґ�ݛ�/�(a�E���}�����J*'�6�}@ �<�nA�ϓ9}�W�/q:]�?�0�T#��,����S��\��[�yM���Q�j�!9�e����vD��	�T{+�Df��wЯ��Rn �V8��T ��d��z'�����u����	"��yP0½�p0<L%Y���-wsj3I<5�o�&+h6�I�)#V5$��p�ܨ�s1��]�óu?�����>�جs�_NƋQ�ʏ(�W���zN��   A�[$��0���p��{�o��$��^+�x�u�������� ���E�W2@��ɏ|R�X�(+-v�ϻ�<~Y�"�3u�����>�e�����K����	z%�%��K�F�8$�&";������qU͗�CeI�'���C��%Lk%�H��;�+s5��	"=���AlB�>����@w>^��&����7^�7+<�Ջ��C󚱣�ǫ�4�蚀�Cvk<�Q��k_$԰Ӿңo��Ј�0�U���,�D =m�#��P����ݔJ�l������M#�l����Ygi��WE��de