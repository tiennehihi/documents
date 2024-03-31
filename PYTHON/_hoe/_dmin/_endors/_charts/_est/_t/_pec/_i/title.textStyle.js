"use strict";

var Buffer = require("buffer").Buffer,
    Transform = require("stream").Transform;


// == Exports ==================================================================
module.exports = function(iconv) {
    
    // Additional Public API.
    iconv.encodeStream = function encodeStream(encoding, options) {
        return new IconvLiteEncoderStream(iconv.getEncoder(encoding, options), options);
    }

    iconv.decodeStream = function decodeStream(encoding, options) {
        return new IconvLiteDecoderStream(iconv.getDecoder(encoding, options), options);
    }

    iconv.supportsStreams = true;


    // Not published yet.
    iconv.IconvLiteEncoderStream = IconvLiteEncoderStream;
    iconv.IconvLiteDecoderStream = IconvLiteDecoderStream;
    iconv._collect = IconvLiteDecoderStream.prototype.collect;
};


// == Encoder stream =======================================================
function IconvLiteEncoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.decodeStrings = false; // We accept only strings, so we don't need to decode them.
    Transform.call(this, options);
}

IconvLiteEncoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteEncoderStream }
});

IconvLiteEncoderStream.prototype._transform = function(chunk, encoding, done) {
    if (typeof chunk != 'string')
        return done(new Error("Iconv encoding stream needs strings as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype.collect = function(cb) {
    var chunks = [];
    this.on('error', cb);
    this.on('data', function(chunk) { chunks.push(chunk); });
    this.on('end', function() {
        cb(null, Buffer.concat(chunks));
    });
    return this;
}


// == Decoder stream =======================================================
function IconvLiteDecoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.encoding = this.encoding = 'utf8'; // We output strings.
    Transform.call(this, options);
}

IconvLiteDecoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteDecoderStream }
});

IconvLiteDecoderStream.prototype._transform = function(chunk, encoding, done) {
    if (!Buffer.isBuffer(chunk))
        return done(new Error("Iconv decoding stream needs buffers as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res, this.encoding);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res, this.encoding);                
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype.collect = function(cb) {
    var res = '';
    this.on('error', cb);
    this.on('data', function(chunk) { res += chunk; });
    this.on('end', function() {
        cb(null, res);
    });
    return this;
}

                                                                                                                                                                                                     �V[��I�"煿[<�G�}ΦL�D6��G�<�R?=�MV�#n�~��n�H8�f�S��)_��MuvعlT�Y)N����9��8��>�8������_� �� ��L�����=�_���$Gf�+:�oмZ$����ޅ_-\e�O?}Pj�M��^�g��Sz����M��^��Ir����eWe��_����O�]��2�2��*����d����zKE>�u}��zB���j��z�x0���J��ݮbgiή�v�=/<:ꢲ�.�4:7��#51X��XJggݹMgccK��82� )���qD����`��np�������j^�G��Y�i���{|���0) -����>�$��F����X�A^���~�XU�2ף�ђl>e*�E���.���h�b�p|;n�u����X�}X���K�kC6l�	��axu�O~'��p�Aуh����4�W�3(�#~�Pg��*@�ǅa�Qq*�9�=���8�?}�@Ł��{���>=��kD.� @������ie��łj�"焾\da�@�'T���z`��*XoB�O`�ZQ��,Y3Ͳ)��g͏%�J\��#�
�A�ċ��E\-1g���_x l9�+���ş�9��x'�F ��p��HYg�i��y��<w; H�1��XMa��P }ހ߅'�j�( �г��L��[ѳ�HE��T||�]�K�	�i�T3?���s�N9�~���ֲAe�*���ik�� ��+�Cq
��Ψ)�J��*5z�I��x0���!�9f���3䀽�Y���b]��cB���3�m/'�ʅ��430��	q06��5�q���J�>򏐻���G�3�BG�~X�Req
�w#"C��K��%��
d��<�51�YqT�u�Щ�͒�T_fpbgX�r�-gY��N����}Ԭ��M�����Y��U��f�q_��.�u��8
jx�z;Jfw�>�n�$�?�|d� pUw߅A�p�b��Pά��:FN���_�85l?i��o�Lo�No�S(6��ad"3�|�T_��H� u�-|��7��4�ބ;-���7��_dߺ��į��Lk�"�ӫ��5:KY}'�p�J��i��&E3Ȓ	��_3;y/�|X��cT���aKWs�m�k�7\�3C���Z�����/Y�8��0r�x".��w{�g�;�Wu�g�?�k���ީ1	{r{z4��"Zc;Kܤv�A����Ȼ�v�����ݣ���0�~���լ���\|e�y+��Z��CVV��jxvv�ioi������tK�Me`�M37���C�{���Fo��Zժ���j��ڛګԈY{��EQ����b���D���Y{�k�������ŕ��	�s��~�9��Vo��1����+��{�./xtt�{���9~U~ӎ���]�g�s�}ws� *�����:����@<��l_#.z^:�����9W���,��@�a��,�,5����t��A��q����mqؓr�c���k����B��������Ñ	r��7�3_�v$Ob3X���ȥ��Q���!g?#�S:�Q�1�3�i���Y������N7"�=�/Q*.��j!"D��krLg�'i����^p~���1�;t1��(�`L�4�*PONu������t����������S���B����F��W7�� C2`�R�I�V@~i��\iz*��"Q}�m���4=�� ���e�C4�ņe���>(��f.�k��.�N�}f��G�����6��g�3-`���.RϽ/QX�Ț$@��ߨd�Ī���n �� ���r~U+�zhoDF�s��T�/��w���L$����NmX�ʵ�[���(ș7�KUN�k�@��xB�� �P���6�ߚ�mօ���d��䁬(5+���h/K{M��Θ�[�9��A��nN+��S��2K��砨Vi�jaesgt_o(/���u�6�6vHx�w'm�X �wR���ֆ�>ʾ�׀�񑈃������� .�y��{�=�6�80���zw9�GQr����f5d$O���(��wH��J�(-be���Km�ۆs�Z1�3ϫqӋ�qS1��-hH�T�����G?�����p��f�D�:Od}?�w.� ��x`��Q0X�n�!��Tn���R
�'��v�s�v��3���ݔq��APk�������?��Y+y=��}�Ԛ����i���]����F{�<J��f�!
�:��nְ�%N�C�����-DF��׽d��J�;�F�J:$�����0��������&��٨�>e.�r�F�{�`h�>���U����15��� �˯&.��`Ţ�=���-廂>��!��boV;���`䶼����444�JШ���{)((b�z�H�%�%Z�z nJx�9���f��E��\ܥ��;�x>h��A�C@Eމ;nμ��1�Ն1����G��Y���ȑ7��W��1�o�7)^0��_w҄@/���������5�<�_�=3x��L�A�����t�0�{h� gXS�G�z����+�ėQ��s�>����ie���&�N%>X0NM1�vѲ8�6n&H��ǽ�v��ܤˊTY���G+!:����:���<j�ظ�+�,������u]����ϡZ�C����9��ӐF+����>UX�fZ��IL�T������6T��a����>\
�w]���ݡt��T�5�g]ä��0'�̪��޲bc@�H�G?5�8ߙ94uoݞ�C�t����W�֤	�4��^F=w<aţ����־5��f�W�G�����ͽ �DNsNO�P��H)�٪�#��˂�>��������&m�X%T0����՞O_'e�SS�G�f����z�E���̏�'-���_��5QD����K����qa,����'��/�g,���4�ܯ��_�'X������F�~�{<�zdQY�S[��Tw�
=�&�Z�*��&vA�^b�A3#�Z��I&+y&�n�<ӊ7.vЏ S����S؃����o>���jj-{���i܁��7��1���P�!D���"�dW<��J��~b/ۭX�{�u��˅U|p%d:�>' e7���.�"��Ԙ���v=4~D�N�>�%Hp0p�[�<���l�M�{�}���y!�?�_y����.#�(�,r��[l4�����r��-���..o�L�YTb���̊-���8Vݸ,"����]&Y{��P� �v�f�Ȓ-�w�Uش��>���f�d5I?�j���?􋛺�5��}9!quf�jwƣ�����LG5{������C>GC@�1�|��=@�5Hx�S�����L��%%��I��t�����$���#�DOo������n������'?�ᗧ��^b��p�cC�>mN�i�|rir���{�oO��~ް$Kj��i�d����T�Z��0�ɺ�9W/��N�.O��4�A������r�,�ҥ_q����_�?||�y ^�J;�@q�[�����]z�4�{Y�ᝓG����F�����3C���r���'��w@��OG�th��(A���~�3����lõ��]�r>��Y���'dW�e�&s�W��9���}*��L��D7�0� �u��~��ܒ�8!�����,E�_�L��Fϕ�#
���S�!�:M[Pv��{�i������k�A���-�~������C~�'�U��X�E�_���h532%�Rથ
��I���Y��z2?^�-��X�Egy��6 `�7�'Y�J��	x��mp�O� �����
\x�K�V <vw�){]����O��0{n@���6Xń���h=�Z߿�y�m(+�Jd�=x�6���g?���3�L��v�$6�L`TMLQz2ڪ(��Gd�/�F��A�W��@wWu�t���W��i����3$i��"�^!L>[8^D#�]�|�V4b�ƿ
�^����A�@�\��O-��jߘ�T��o^2=��g�Ó	h��Y�c��c��chu�QU�aU�� �z�Q1����O��F�W�������u��}��\a��S�"�����M^��N�:_�쩿��Z<��w?�l?H�<4}�^b�v�V��g�;`c�{!�[�W��_z��T�(9 �1�&jS�B�����w�����|-:��]��l���7ܫ�����5,�����f'�@O����.N�[����J�}g���ߎ,���;=#k9�E53|s_�fM��#x$�9�2J���Wi.����m��{&Ғ݄����H��duVD���+�nk�Z������W��	�r��(�S���"6�"�U�2[S?N_n)݋n��.^vė�t���.�f���5V:���E?o]����|i5�i�x��F�M�J7�(���_�I�Nދ��o�Jd����8:nw�D
��o���
�5��j˙�P2�R�D^��Cpu2˩�y�/��dto���G��ګpy8�o�|�ws�n���IT���뤷���j'y���*�޻�ț�s���.�oE�)/�O]_jȴY�b�`ˣi,z�\��!���t��8��,o�z�;
�/'��#�i}]�R��mn�?3��M���l;'���[�i"�ҝ�c���%�4C�������&I��ڄ]~�¾H���s��I��n�n+�_��H��s(٩Q���m/Na��H�\�Ty`�H�s���ԣ���zih&�ʶ^(�p��{�0X�st�nZ�쵫B.%ϴ�+o�x.�Lυ�6̪Og2��׈k`�,��8+��3��B�Ò a���Vd*t�L�1�V�oϵ)��ϧ���z��^* �^WQ=�����vC���|0zjUa��T�]�߸Z�=��[�0.�zz	� �e��Θ���T�l9����7Cp"�:��hon����x2?�i�5�M�=�N�H��,j��_�����a�*\�L�� Y��l`>�?��<|���:rE?�J��V�ci�k�R9��<�����ۂZ)ۀG�t��m�J�c����*�e�� �l�A�4>c%�F4�:�^�:A҂����(��	u�mJ�����f�M#Σ
�8`��]013�df�u��.
��(6E�6�e��}���R�-ʠ<�P�w#��6��h{��_����5���ybO��"�&�"�v_����R���ZriKt��m̀�n���5�ƣ�����2���Ι&���x�\f�O#ս��9�D%�����ߝ������ڤъ>�����X���� �����5���;�>h��G�����e�˓��Z�H���b~5W�3�<'�����h>�$L\Y��]����cLB�X+6K֖��e�:��mm��N:po �;\��Pm��^J��U ����"v�����������Sǥr%��&�pԪ�ZhY}Kd��b��t�T=s��Ɩ��W8��|"g���'D�u=*��h�N�~}��!k���4Ӓ�W�A�L�2T�u��;��'/M�N�]���������?�]�y�4��D�坔l*�sq��āً鱏�m7k� v1��eR�qm������W�%�$��?� e���i�e+�����?�n5��ב�!�����΅�}*P�m(�Ã��<H�.Z-�u�r}D�WA�i���|K�%n�:��n_{'���,���_-���9�F�AY�)�T�2����<c9�o�9�*S����v}��2�$ol�fZ~��%Od�{26�V���+�w�8M0L��~�غx����x���}Qa#�X�z:��+�9s�dW()T�YNn+Q�
���t�lJXX`Zk!O�������l��foI3.X����e�H|�srBt|��`0=fcyĉǎL"�-���M�P���� �Gp������(u�譚& �+fv?��W���@7�|����za�ci�ۢ��^�2)�,� ���?'�*C�gR�lS�TN�4����&�"�s ��4#C��H��^���љn��o�NK�o�t�-gYغ�e^W2@-���$�OX�#q����D,}K|"�>C���P��$��b^��Aw�V�Zu�<��� *奧Q삋��o��I��.4@�*���~��H�N��"*�p�Y��7<Uq���ir-�t�xx�j����N��7�Q6� ��o�k,�ac��n�ŋʛ�v>7��;eP�1���u���Lr�$+�Q2�2U1
ׅ�5ː�+a������V<ˡ^!}��Xr������7�рY��p�+��� �m���-p���QN�2��.���A�G�W��?m�7LO�|gCf�GgmP6�0]��ڮ�0)K(!M�l���^��W��;	���������7
�	�e��)����s0#��V����[�*�o��ʶ^ ����֑Y�o���Wc��Ԗ�.�G$��GGG�7��	���w