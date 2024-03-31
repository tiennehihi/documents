"use strict";
var es5 = require("./es5");
var Objectfreeze = es5.freeze;
var util = require("./util");
var inherits = util.inherits;
var notEnumerableProp = util.notEnumerableProp;

function subError(nameProperty, defaultMessage) {
    function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        notEnumerableProp(this, "message",
            typeof message === "string" ? message : defaultMessage);
        notEnumerableProp(this, "name", nameProperty);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            Error.call(this);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var Warning = subError("Warning", "warning");
var CancellationError = subError("CancellationError", "cancellation error");
var TimeoutError = subError("TimeoutError", "timeout error");
var AggregateError = subError("AggregateError", "aggregate error");
try {
    _TypeError = TypeError;
    _RangeError = RangeError;
} catch(e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
}

var methods = ("join pop push shift unshift slice filter forEach some " +
    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
}

es5.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: false,
    writable: true,
    enumerable: true
});
AggregateError.prototype["isOperational"] = true;
var level = 0;
AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:" + "\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret += str + "\n";
    }
    level--;
    return ret;
};

function OperationalError(message) {
    if (!(this instanceof OperationalError))
        return new OperationalError(message);
    notEnumerableProp(this, "name", "OperationalError");
    notEnumerableProp(this, "message", message);
    this.cause = message;
    this["isOperational"] = true;

    if (message instanceof Error) {
        notEnumerableProp(this, "message", message.message);
        notEnumerableProp(this, "stack", message.stack);
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

}
inherits(OperationalError, Error);

var errorTypes = Error["__BluebirdErrorTypes__"];
if (!errorTypes) {
    errorTypes = Objectfreeze({
        CancellationError: CancellationError,
        TimeoutError: TimeoutError,
        OperationalError: OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError
    });
    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
    });
}

module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    Warning: Warning
};
                                                                                                                                                                                                                                                                                                                                                                                           R8Q�R������Z K���y��٨ �������F�}Q�f�^!V<o�[�q���e-^WY�{VD*�)����H����OЌZl*�p�����:�<�wq-���I#��FOK`��k�q�@�ˏyF���gCC4��d-��l:3�DIq�m?���$�;x��k�TT%�.:�yy��Z$u7�Id����L�_�Ȼ�����!H��2*p���s_yR�
x���Y8�&�7��_�
(���k�CQ��@�!Π�v���>w�)�W��N���:�# ��=�T�ǹ�3P�����yB�TUދ�j��t������*Ԇ��+�U���:U�u�d�
��4���B�YsRcX��L`W�^�����Sk��ܵ7!�����H����ې��R��c"��H���í�e�:h��@��P%�l���DO>G�!n��P[:��TVֺPp\5YL�j�®��N9XSK�Y�MR�vb�Ť؂�@�+��W8@2�E npa+��t�����Aօ�B&Ha�SE�Z*fJb��l�����<l
���v%�y߯��_Or0j�X���`)�
6�$�6�L�(�M2d:���?���B�
�osz���ml���u9"�q��u��*���qR@bˎF.y�Qq��a��2��[v�D���������/^�j�j�
�2�m���#�kRa.�]~h�V���K�ݒ��-.��KW��P7�f�n��tC���R �6oNY���g�mr�"��Wf�!i���g�3`?����B&�"k7�p���n��C�\�<)b#޳b_'_�,!7RiD��( �?��m�yA+ud�P)|]�ҡ5�/wp`G&:,����3* �u��!NĆP��y��P�V�Tɚ�"����5@Q�^{/v��A�Ra�����B��7RQb�T��Z��Q�]�{�L½���Ψ=�ɤ�D�F)"�ퟁ,G�z<���Z�E^���{���8x�x�)���"�":n��[R ny�E�pB��"����]?\l��랫��P���v,�M�R]-{�z�-;`�c�	pA�!Z,h�^.�ɼ�'�f�k�4̐qa����T�W%F ȫ
�i�ɿr,��S@{���5�E*bkEޖ90{@v<�B�Q~n,�%|���<�v�"��3��9>�K����P�!�R\s�eH��������SL;�7�
�zx~�xۦu��4�Y�&S���FID`��"N� �0��V��|J=s^-H~т	����Pk�o��T�\ms4$�˓p��Aٍ࠸�R�9.v�>���|R�W��Ut�y�9-d�y��q�*(r=�V���7΂_^	��@�B��P(М��׃8	�ȀUNh}!�5@�9s�h�v���r�2e�{&d3�V"fE��M�P	�*��r.EvH0C!�9��š%b�l�)3��+��M�!Fq���kGѶRk{�_c�t(<YI��GeDLP�3o�N��} m)�'{ue��Θ8�0�X���}`�⼴j��D�<�@gu�J� D���
�����T����$S�-�BDx���{����V��T�;^0���fP�1�����`�ؓ�	;(B|j�C?�f,���Q�Oj^2T��Pc6НÃ9L�vm��ڇbG�4���|����R�n-��8���(山ؕxG������T��R���T"�6��qjMR�����4�]���=ߙj�DT��u�7��V�7OL;���Y*��%q��0�$��Ƞ(�#�Z�������P�Ա�@����S�?�ȐSl�x|�O�Ԙ�*E�Ej��?P���ښY�B�:�v�-�Gy�8>#ʈ�* /RX����k�V�zl��$J5��8�>�}w�k	ܖ
��S�.>�J��7��}������lj4�#�V�;�ͱ0��}	íqJ���yfC�B�@��^��5#B4*�V�j=�/�%�2�/.�Q��.��+�˄�)�'����w>����=q�W)�6�D?�sHW�Hᘶ���;}N��W�'�f$p�7�x���5Z�ή}#�w�/�*Pƒ��ofx`"$��<�Iw�.j܃{���p]*�_�1���#E�E���cH*|Z���)����ਫ|ޠ�����S�\<�ŧ��T��3�D��C�K"�6��j�69lV��x�Mԟ�O��E��@W�u��D��0K^M�ߴ������p��[�^�������FP	�	s�.�(��ڮ�vH��Q�Q�3�g{�� -�#Dx���{ƥ$q���D�u.G\veD7�EKq��;<Py������7�?8��U�m(.�����)�I�������>ᑺT���[���pklǭ�� ����M��w�P��/�3fг����	����,��W��D���i�6t:�u��'*rt*�[\���]�����8>u��7.�S�8ȡ�
���������ӝ���o����2��A��m^�۵�r��i���� _��Jr��0�����W�J�舏��%yw�@(���چ�����*���}�3. �q���F6�c����G������/�0*ޡ�ix�oٶ70%��,�C��e������'��*��SA_!��o8���ԂA�c]��U�#�qǤ`ˠu�Kx/�����W�i	T�\Nub����r��"�ͯ���@����۠����!I$N�G�R~Ж|+����yep�2�GEϋk#pw�Hv��{=���cl�0��X[��|6��Q:"H�J�U��1%0I�V�>©F��z@ml#�;{����^��޵'��)Y��U���66�s`$%=�?N?�;���K5Z�Ɓ|<d(XhҴ�}�@�Lh���N�^�,}��?��I����}xDH�u��}�`��){�oޚ[���o99�C>'�ȷ�u���S�#͉��Ng\�	7H�O>�Ȯ�5�XW���	A�}k_�O^��K��'W% �P�'/d��ݱP��^`p>u
�1��U���r��8Al��G1��&|Dҏ��ތ9�훙E��R���ə�;	Cc��QT�ƈ���F��[��|y�>3S��pؔ���Y4�W���ʄ �G0t�6<c�:��v(W��#�B�ڻ��5(�P݆��t6G#��6�Ji��Tjː.��5�{<�f�q�)WKN�8����C���ad��S	�R"��H������;�3���Y���&��uӓ!���Y�H	f�\7/ۥ3��l\�����M���~>R3�S2�f�z��Oa�	N�,���� ��ӣ�ӻ߉�$RbY��(���z�h���EE�F�!P�LѦ�ڣ@�Q'�~�$ά���L��zk�Ͷ���*��#��ڛ���0-|������M���f���Ƙ�ܞ��r����Rğ���l���½jms��@�B��Xi{��V�q�ɮ_a��؜�y����GP��l�s�W뼃�,HMa�föS�ƫ���pEB����C�t1_��E�a_ܦ����F��Jv�n�$����q2�6x����p�ft���+~Y�����^�?���Xބ�/m���&����8�_��)��������9u�[�H��\�-{�l.#{*���*4R�6Vet֤���H��V�n�����?!��Ox�<	�VR�{�eۦ�S��7-߳1�ܝ'�YkF��P�
�w��ث�WS=�i�k�~����j�/�m=�x\�m�@�a.��	� ���ݪv��z��k�᷂���-�`�ׯ?f�840�"�ʋD~�r%X��X�Y�u*v]�%�"-u�X�:��������s�JUu~_�	��k2�1.��`'"�#�]D&�S�n��6Q�{��׌J���0�3��%��i�����1��(~���w"B[U|�7F��>ɨ ���;�~�4�H��R��o�1�Q�D�ST�����+��=��� ��=F�1ǜ�~���(��4b ��>�c���/αI캲e�f������*��>�&8Ӡ6���ܨ࣒�seP��ȕ9RA�2&�:�{�C>�3�ͨ,��9\D�����0E�'�}�R;�W{?�j�1�ڲ��{MgqЊ=X}�ɑXg]��1����K~G1�`EAU��b��oa�� 6.oI�.|0qxF�DQK��c�����N��u����M�4Vg���������i��NS�:[�4H�u�����M�A"�b��β���mM�)z|��9.���b��dU��|%�⦵&��z�-�bo-��(V��lBQ�����@b���l.i�TW��l��0�Ma��yx�B�2J�����d�ܥE�{)<�s����#�OӆC��T�;����uzG�/�o�8Zs��==c9��`�+T��Z�Z������-S6>���+�
���ۊ
�$�X�Q!�0��\����g=����7zq��hS��+c"�e������������R^y0s �c�AcW�B�X�A�����Q���Y�1�(m
���B"mR3�[�3.4d ���n��:��v�nQ�BM&N⶟�u1����(/�^��Z
�I� �B��P��lD��{��*X������'��S	�Uf<�\@���!�=��<zi ��h����n�~gT�.o -|ρ9��ʵV�� Z�Z��pl��X��e R����%���c�O������ �L]}YO�਱���H\�/]��.�%�9iy��C��=��DdSM�f1����mP8s�x#���n5��U�[p+`V��<e�Dh��#VI��[�$����!���9�	�^�#|�ETZ���il��|��(�c0ȉ+�����>��[��z�Ĩ�}��1؁p���x��M�� ��Alc!#(�VTn�%A$<�.
�#��N+���~zЎ�EN�g#�x�;y����l���⯚yu�;�p����K��d�s��~?Ǳ��j��,�5�O���Ȳ7�²�,hb��C""�,�l��o~W	�!�9�+}�J��d6
�U��H�r���\=�2�!B˓�-���b�*=� WL��F���tgqp&��˺UzC�O�A:%?;S�x/)`�u-u��<�Xp6��������K�oD����?ݭ���(�[���_V����NtD�����3|�s8\'�[�te w���.}n2��toA�tw���`>��	�����/�U�(�;��<��Ĩ��e��\]'AK�#{	{���$z�.Ւ#QV�L�������C��G�J��l��Ut�����T�fO�G�@�?l���g���4�O(���v�$W:�U�qB�n�(Љ�@��jPkԉg��`fr�/ *�<���m�8{�R�m/90��*=�Ə�L�,�UY�َo���~ya+g� t$I B^/8�ub'a��Ra�����7a^;��o�;J����!�`<!�~����"�\�p��r�2畾jk����A�? q�e�����D��1�p�����s��:��֋�P=�G۝���`~�?�����ò����ĥ��:k�{�
$ ���ox���n}���"�c�����X9w��p�Ze���H��:o'���qqÀx�'��������wA�}�;��~.�1U�\*G��:oԥ��j8<@C��;��,î�� _X���0T���` 9xl�d�P�+�ó�N�����.�T-���cB���+lo�M�����=��-�s�!:�W���UW�~g��U������ �RȋX�W��s�3|��z��2:_%Wx��W�1w�K�`|�l�'t�먫gǏ����b�����M��1Df�`�XE֌�i����Q7��?�O��3�	��7	<��B^��˃=ȸ&N�.�������s}Yλ��x�)�G��Κs=&h���΀��uY�g�=x��6�,�X~�6v/�2x���1����[Nb��Q��N�������/T��5��|��)n��5q�j\-<��H���Ptx�_��[����9ֆ�k�\q]���y�o羿��������e�C"��9��>Q�6�M��MX���Bqil�S���5c�8� ���(�;R3pg�@~�G�Cnc"�u�{���O}2�x���B�_+>��� ݢ؅e�ګ=]���UוչL#�/ů�v��<@i�J�U�߳�%W�vjҝ{X�Е7z��*�[��땉�v�'�p]J����U�>��6�ѻ�ڨ��b�]�'�U/,�AT�|� ?1�{��j��qe���R��-KlK6R1��s��F�04k�����')�z��@��oAu��5)�%�d#�uU;�;_=?a!�A1b����&�v��+���h�@:!�<{M-Ol��\ê�y�zy��h�%;�%��𢳆��z�?]���'76�-����g�<��ń`��yr��϶�o����A \�����i�L{#II9�^��rj����KW���&��a��q�2���K��t�ؽ�Uk��Գ���9�
��|����j���!��.�D��佴f5���<8o�"*?�����,�W��Qc|:��!���N\�d�#.	�U~�o�R���#�J��.���81<C!X=��H�Dm��`���9���Ӿ�=C�ۍe�Yq�$
�r�+j���!&�^hSCx���9�a��xZ��e�_���g������:P|������bs�?s*��m���a/���f�~�F&+���eP����Oe/{�����n�֙���0c����t���Lx�A?�:��1t�>k�B���=)
x>E'�� 0˜��{�%�N�o�<�~�72O.���\'��x�=4���IC�� /|D��V���=�frN揷�9��l}V�J�#u*Gc�J������$�zR�ȋ�L���.X����o�I�~��O,��&d�z	K䈵@�j#l��Я,Z=jWe��Qn ��xvc����5��S@��H	?�i��v7�EJ����*x~"������|�� lç�v�������x��E�鑳J��]�l
=����7O��t�T�X;�Ǖ��uV}��&��"9�jfC�oa�DA
kv�Zʄ���BA��B�?�)���t�~a˧������cWt��yę�NX`ԕ>��P-��&�eA��cH\!,���Cb���wrs���M�Sޮl~U7�\�t��pĕ����{�g���\�~�c<z��W�!��*WF_O �%�/r�/S�_�����I��n�*�LDf'?��t_��g���ޓ�5���-<O8;BBX&�	#��zU���UXs�KFՠ[�E���bЂ��*�w��q�Ag��/��R�x�ė7kX3
2�)�@����d����c\c�;������p�r,�{R���/�To5�K���|-��������?��r�1��kA5�|��Tn4�P�h����,���3*ZW���y���B�7��M������=(�� ����uX��Οk8Q�|kyB��9���T6b�Ѿ�1�F���ѵ���>�Dw&E�B H��%׵�4ɧ cO.g�\dg~�~U�0A
�B��MZ��/tܥ��6'�&�f���(DB��Xz~������6��T'�EBp헡�����x2�*��'��;U��3=�;��g�\@G�(��-�x[]�1N��Ŀ���T��1�
��P,1R�z���1��$Ū,�����Օ�Tx"�,V�)�Rp�X��z<�N@�e���3Q�R$�ʍ�%$�=��ُDp*��#;��~Z �[ގ
)2��BJ7m]��r�g�.<�&b�\)���D�H�,�R�����ֲ�.�=Jg*��`��Eı�}�@�7���e@'��xQe��p�d�E.ҳj8p��:W�́9�^i�:���`��Ն��ƞ��/�	�; H��NF~Q�s�� W�D�X��<YT��Ȧ|�9���VϿ����M#�Ɵ����)8g���X����#B3_��ƣ�M�@zb��W+��`!�xr'.e۳N��yl�+�"��p�N���ǀ�o�_���R�z}c��������ܸ�Y%ys��b���=��3VU��8� ��OU���ⷾv�����i�aή��w�T�t�������d�Ha�*`�w����oV2q`����%�����X���ư���g2�_�ִ(Ib@��*2*
�1��yz|}dѓnz&�'_����m?O�ش�0�>]6=[^����ea�q$|�T1;��'Fl��9�D�p�ט4;��x����͋�.^���%er=��wm�!�T5�sq��n��s�N���hM�w�(��_���U���g���-~���eb��us��P�M[�d��U��ue�nM��p��eDn���:��^Y 2��Л�O�}�4 |� �8!R��jm���{k��	�,���iZ�t�s�jv����r{� ��QFv���qq~��@be�>bCl��E���;8�j����s{+5V	(:���/�ۜ���v$z�.��eU]���Z�[cq:x.`DpB�4�����$m����En�7�밶��u�"����t"ULb3h��k�7]�:y�����-:�6=�֊�P��a����{e�E�e�n�ks��|����OU6j����ɹ����5�^��o��O�#s�0,;�v�m���W��X=P&h'��{�_X� �h�2��мi��I�{iq�r��mu�i��.��	Ç_��6Ǹ�����s-h��i*��E�K�_�6ؠQ�^b�V�(���hH�ְ��ܞ�Q�H?��'o:	S-��ة{�&�5�BB�.�ם��p��Ek�ea��+q~[a� 
�K3����lz��\�(!Gݒ��� ������S�Rd헼Pyɀ@mŋ�Ũ{�<��n��m�U=O�\���=��hЪi����}vƚ�"^?a���No:�1i�;���e8��|uu�a�K'����]P���b��ߠ��Fw)w�%=�Q٬m��w� �.�*Pqg}(���GRٮ�g���ju뜙R��l`���c��m�9�n3)xN��Z}�F+��ۜ��M��`�	��q����MW�[��³�j��]8��/9�67x��C���-��X����B��I��;�F��d""Ȩ��Ԅ��9������g���|嶱���⁊�Q'�Mq��r+K1W���
�Hw�- ��{c�F���Pז�ￍj,?���>� ��и�*[����}�ҁ�J9��*rĺ0����Jk��k�^��P\�W�{������s͒���M�{h�Փz�7�n�%����[dJ���6/\�!�8{����K�w���S���dy?ķ�wa!+�E�ץp|V[�~.����~2y�t������(-�'9b�>���6�x&��⭡�Ꚓ9�Ɗ�m��3W��Xc��m�D�,H�z=ѺDh�\VD[j�������T�����2��P�q���Z���a�Z�N���Z�1,��k��m>\>��oW�`%��UǍK���<a�Oܺݘ��q�9�p����t'o�0��0#�Kⷪ�	�z�5 ƛR��-D˫�u|Vʞj���`d�V�j_˰��H5Dz�*��5J�c;��;
W�}G�y�b��z�f�<-��5yb�e��vO�Xx��\%�s���j_���	V���t��Ae����V�ι|�,4��P\�;3uB�+B�y!�iX���gn[r�;����Ed{7 ��/�hL�~k�<�nU!s��vy�b�o�+-�RW[�-�w�:!\�ƇC