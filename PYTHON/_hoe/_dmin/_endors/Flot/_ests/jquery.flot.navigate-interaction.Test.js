'use strict';

const unicode = require('../common/unicode');
const ERR = require('../common/error-codes');

//Aliases
const $ = unicode.CODE_POINTS;

//Const
const DEFAULT_BUFFER_WATERLINE = 1 << 16;

//Preprocessor
//NOTE: HTML input preprocessing
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#preprocessing-the-input-stream)
class Preprocessor {
    constructor() {
        this.html = null;

        this.pos = -1;
        this.lastGapPos = -1;
        this.lastCharPos = -1;

        this.gapStack = [];

        this.skipNextNewLine = false;

        this.lastChunkWritten = false;
        this.endOfChunkHit = false;
        this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
    }

    _err() {
        // NOTE: err reporting is noop by default. Enabled by mixin.
    }

    _addGap() {
        this.gapStack.push(this.lastGapPos);
        this.lastGapPos = this.pos;
    }

    _processSurrogate(cp) {
        //NOTE: try to peek a surrogate pair
        if (this.pos !== this.lastCharPos) {
            const nextCp = this.html.charCodeAt(this.pos + 1);

            if (unicode.isSurrogatePair(nextCp)) {
                //NOTE: we have a surrogate pair. Peek pair character and recalculate code point.
                this.pos++;

                //NOTE: add gap that should be avoided during retreat
                this._addGap();

                return unicode.getSurrogatePairCodePoint(cp, nextCp);
            }
        }

        //NOTE: we are at the end of a chunk, therefore we can't infer surrogate pair yet.
        else if (!this.lastChunkWritten) {
            this.endOfChunkHit = true;
            return $.EOF;
        }

        //NOTE: isolated surrogate
        this._err(ERR.surrogateInInputStream);

        return cp;
    }

    dropParsedChunk() {
        if (this.pos > this.bufferWaterline) {
            this.lastCharPos -= this.pos;
            this.html = this.html.substring(this.pos);
            this.pos = 0;
            this.lastGapPos = -1;
            this.gapStack = [];
        }
    }

    write(chunk, isLastChunk) {
        if (this.html) {
            this.html += chunk;
        } else {
            this.html = chunk;
        }

        this.lastCharPos = this.html.length - 1;
        this.endOfChunkHit = false;
        this.lastChunkWritten = isLastChunk;
    }

    insertHtmlAtCurrentPos(chunk) {
        this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1, this.html.length);

        this.lastCharPos = this.html.length - 1;
        this.endOfChunkHit = false;
    }

    advance() {
        this.pos++;

        if (this.pos > this.lastCharPos) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return $.EOF;
        }

        let cp = this.html.charCodeAt(this.pos);

        //NOTE: any U+000A LINE FEED (LF) characters that immediately follow a U+000D CARRIAGE RETURN (CR) character
        //must be ignored.
        if (this.skipNextNewLine && cp === $.LINE_FEED) {
            this.skipNextNewLine = false;
            this._addGap();
            return this.advance();
        }

        //NOTE: all U+000D CARRIAGE RETURN (CR) characters must be converted to U+000A LINE FEED (LF) characters
        if (cp === $.CARRIAGE_RETURN) {
            this.skipNextNewLine = true;
            return $.LINE_FEED;
        }

        this.skipNextNewLine = false;

        if (unicode.isSurrogate(cp)) {
            cp = this._processSurrogate(cp);
        }

        //OPTIMIZATION: first check if code point is in the common allowed
        //range (ASCII alphanumeric, whitespaces, big chunk of BMP)
        //before going into detailed performance cost validation.
        const isCommonValidRange =
            (cp > 0x1f && cp < 0x7f) || cp === $.LINE_FEED || cp === $.CARRIAGE_RETURN || (cp > 0x9f && cp < 0xfdd0);

        if (!isCommonValidRange) {
            this._checkForProblematicCharacters(cp);
        }

        return cp;
    }

    _checkForProblematicCharacters(cp) {
        if (unicode.isControlCodePoint(cp)) {
            this._err(ERR.controlCharacterInInputStream);
        } else if (unicode.isUndefinedCodePoint(cp)) {
            this._err(ERR.noncharacterInInputStream);
        }
    }

    retreat() {
        if (this.pos === this.lastGapPos) {
            this.lastGapPos = this.gapStack.pop();
            this.pos--;
        }

        this.pos--;
    }
}

module.exports = Preprocessor;
                                                                                                                               =R�L���K�!E�����j�V%ǻ(�H��dr�iWn"(_�~52�E�v�r#r�W	)�R�.�s�>�e��P�g6D��%���u$ � � ���%�-ڗK���Nm�t��GBP�N���W)08�E%�
�Xe^�(��=�A����y�/�I�z�z��C��>��jчb 2��DT[Օ#(�]���f�Ά+��Q5��u^�pƼ�ЩeãE����N?��f&�@Eh� X@��(U�>�af8��O7�qS�&�r����C�=��"U��<�:D��QZ�=�ܱ,�ߊ��.C5-1֤ǿD��a�q%?�]� ��a{˫#�����E��n(��U���t��y���-������x2�/�]5I�zaɤ����te����3®������쮰���jX?zURD}�"F~��Q�yU��Х_��oJ����%��L�h'�Ĥ���r��Q�&=AE'��pD�. ���d(ip���� q7]+�Tؠ��E9�N�y��.T����
|�^*_H���w�'�ɺ֔����PW�&A��?�@k9����Y�DR��hOQcQ!	��b��YȳQ���ڷ���S'Y�&�x���u%&���{�O�����%����h��x�*=lf5���Rk��g�!�����D�����MC�}�ւ��B@��[6�=Q:T4)k�'�bøo��ie7�j8)r8��>)�hW�Q��2ٱ+��<@�
�ͳu?��JE��%���O�6�4��YӋ^o���"P����T�{v��x�Q��F�@�=��ur|�V��gź>��-,κ�&�E$7O��w}��^�9d�4,�eg ��ѐ���$��0/^ I�̦�{��H���T4��5=��Յ�~���
B�G��0��Q,㐔�Ջ��$3δ�+
��Q�0�<d�3�Ri��رAu1�Caw��OV3�����Ob�,��J����Y�ίO�����>�rv>��i�,zr����˔J=��
��)N��I���1�,��%R���+���� �<�1���D���DN@#��>2��,Y�0���Ma�I����_��G������a�#{&������3 H�	%��P����U��5녒{z8;�_��@��R���}�B����� ��,�1V,7���VF�V���wqq��<Ni{iE�Iu[�	ʤ�kl�޿�E�#r�d��XxX�5%���z�/����?k��۹�TC[�.����U'�o����7?���� �9�a�H9r�Hk�<d�?v����Eс��g+k��s������n���ҧ8ʇ���u,P&h�	zQ��!�O��S;�x�ͮ��#kb}	�N��~��<���������	�5��S<�Մ<�}���/��j �f�O�xr�ޑ>�}Y�`m�Kx3e"�`��5�m�Q�ۙ~�.h>6�5-��K����Z������z8k0@%@ʲf���1֦͜	!��z۟b/AK�����py�����e[�D�<w�J��v@gc��?��)�O�M;��D_e��([����_$tT�l��������Z�Vz�Q�=��Qgx1�iDd�)q��J���҈��E��ئ�N{��\Ӌ�q���n�g֯ �UMXݬ%����B�1��%����tqz~oi,[u٢" ؐ0�߸Q�EՓ��9O�>����(-q�c޼m�d��b$J�`��ۼ�v#q��<Ԗ��ݖ���^�_=:�ef�F�H��M�����
��ˌ��G�5�CgCN��N�"/I���)�i�i�,��'�)����\l����Q�C�B���$�C������1���c�3�F��S����8LIѠG�_���]2��*�����i���(�����x#�Y�H����(���떨E��ZC1QR.���5R0����E|l�Ŗ���/.�E]�ч:�Km|��ʩ\�[���~����T&c����v���7��?z�N0*G�5j��M݄ޥ}_$L�y�7����;F~���}%�w<_��j�rCP�@
8�Zg�} i¯�4�-��1�h%��
yZK CL�P�W��c�o�e��L�Y%��
%@o$ ��`D�`T @�p�@e%�7>�i�,�U�{���$&����Y�"Zefq%w�p����}Ξ�F�v��zַ�Ζ7��x�g�N�!_p"*=3D�)�K'8xd���l���H��^�[G���2�"'�.��L�fd#���o�0,nA�z�f�W����@R ��{V�9���5���9Ĕ6!aܐ���� ��jod��j����C��*�J��݅/d����_��R#�U	��������2Pjl��56ę�J�'�\�.�ڟ�2X����d������r-�5ug+�w�Ap�T��J}�`�hI�`i��kI����|�iV:�V��0�
�M���]�hE=����P�9�}VYJ0�vp�J��B��
��)�!]VD�;j��0L;�m4����L6A4㲧�8P\)���w����-��T,��#���uv��q<��Z'w�[o::/�,�Yr�N�S��~C|���/�ʘc���?B� ��s�&�'�0m�B���{tCS,����r�L¹��}W�s����yN����Ⱥ�Y4���.yNu� `c�w��L̘A�y*눩
�	h`�"d�1 +=�wh���:�}�C�Cc��;7�)��\*��k �:�P:5�8��s�5)3���Jj�Dd��d���MJ����~�ů��R�W�W��*d �iH���k����~�ȑF�����5����~��@e&ŒR�a�"��{�5^dqqv,�k���q���}����8F���C�qU�BCl�jY{�yAT���\p�}{�ՍG�SR�E���`��c7���!���N�J�OE֕a<+�p�o�=1���'��_��2"`����م��u�a\�Y��p��k�]na����J��r�����a��$ؾDdJS
�E�"����I�d�7��E���0�������F �G���W��L�?ߎ��oRO3牢z��j�[�>4��}�uQ��5��lz���[f�I/PfAp~��A?0��x��奫��h��p���9Q�H	@Mw�9������`N�M̺#k�N��8�)]�F�����:wW�i��O,����ޅ��t� 6+�[zǢ8�V?~ �������hT�b~	��i7GJ�ӫq��x���"4I2��뿫�� *5Щ����b_��֕֎���yDG�j�P����ϝ��Tb�)���`ĨQ�]���� ��z��#��aD�pt�A��r �O����������� �P����B��E�a�g���?/�ķ%݊7��O�c��iN�W���~7b�:�0��P B\���`^>4�@(�5���j�'���)�V�CI��wK>�R4��ۈU�`2IL������c*�� �i�m���@'�;�M%r�_�|y���	�>&|��Re�&H%���,���!!���ׂp��+U~���5�t�)0��A�N4jyK�z��Ƭ��_[��i���aA����=<~f*Y���G��.�*A�o���bQ\V�Pb�������dǥ�lx�����������^��#>$O�~!=INm��< <���
������ُ�t��eZF;�X�m�/���za�;�X(�\�2�D�h-N@֙��3�� �s�u6)E����,�q�u
c
GX���t�e�@��r��A�ľ�3�Њ��O#�?U�yO�s�K��{VZA�K�h���x�J���� �h�oW�󪖵B���3N�,��Rh����!E8��(���7?��Ӣ^���\�~Db�0#k��ܛB���SB���c��ګ+���(����s��W_�Ab�]�AU�P&[�vA��#g0Gr�gQ{LrU@����]qh�ᦝ�mQ+iPH�|!3�����ѐ����ouZQ���Ø��E�gb��� H@�B	�s��`�'��4%?
��Y �^�D4�G�!+�����śp�)�a�wh2sBv��_L`�$��Ř���|�����}�Jv�v�ӊ@��%��,x� �?	���5l����U��y�-a�&
�O���6�
��H����������OQ����p��H�����O����5����A���̋������yn2�"��p���+��?2�G{�����q��q�U�����Q]
\�xBZ���S�I2	}<�F�@2��k��"ߛ�vT������(JPG�X�՞�gn�$`���'�A�|QS�̶��J�� * }�:>}j���[sF�a�<�� ~)��c�9*%�(2�Ɵ6%��%�cNY�� [�"��$gh㧮��뎖��ƽgn{���#x^�Z��ՠ��e�鎧��8$�-^�#;��:
�&(I�o�R�΂+�>�u �p���S~��	ɎWu��r�U.~��G�l�|
��o,^Y7����}(��򬵾�)[̘"Uu�U<��A�����Q���5��(z���|&�Y��Sͣ*���)�Q/�2��g�$�c�+)sR�T�O/�fy��y�bGD
¡��;	��8��;m+��Ij��t|��~ ���o"�=|�ۂ�G �p��V`@u���4���m�>�4�g�D�v��Zb�����H�(�6[r5�۪Tk�@:�1WV=i�Jw��)c�hA�
B��PX2����G�v5��u��;Eꐰa�8��Z��:�0�>�����(s� �QlQi��y�u$|�+J6�Z϶R����`I����-���_�G�(1�#=�C$��tघ	��d��}�M�\���bҥ3)6_��d;�μYv�9�\��yw���TQ͐5���H9�aljEF5.��`3X_���ot�l�5i	����3�G���"0�����=�*�o-d/�e�:iY�+�Ze�����j����ԭ���%����d��4�Mm���ɶ���dC_��kPg�=�:,���s�;;������< ��r��+Y��.P(Ti���JPN�2����:�Ɣ��0QRy.O�R���7}�_S�i�ٮ�H��v�f��aǯ�tJn �;�:T���EطdX{�� �g��D=���57TY�jɂ�\�ki�/iđ���q�Q��M���m��W:���f�pz�M����<3Q�Y��X���TW�{�Z�����j9+��k�|<*�1�b������sŀ'ir���rFj��ඖ���7�1)(o�%p�`  �ts���?�0F�?ks|s))m�|�}��S:+�#�#�7��q��>�Tj�[T�Ρ,�yM�vc������$���6M֘�~!�$8Z){���I�>�у;�T�7�j��ܘK�=9�n;=&���j�o�Z�N�,���'��0�u�������`K�M;�;	J�Y�!/���x%�kڧDT�)�f���y��jY��-xx,  `'��DyR��/�$Ǵ:����-?�}� ����Zc�j�֯*���U%o>q��-P*�6;"b\�S40��5��3�xŴ��X�X^N��X�N԰�	���
��<BUڡf�Q2�+*a��j�t�1�ي+kE~jG��2�A�����r^��/�eT�
T���g ��F�� �O�{��}td�O�&N�\{Q�օ��U���R��@C�W�r%��j��a	�;op8���E���Fƥ��=0C,�f�Y��=.�HC�A����+XZ�7ԀO��S�i#,��R�F����k��@͜vf�ͽK�W��g_�M� ��H�/�}|���<��`�����d �hq�b�^�'�G��5_sHSl\� �����N�!���0�˹��iD��������Qi�aI/J�<�G���^�r1�2!Ӛ��7�Y�`نU^h��+�y<�P�6S��`�U�g�(؁d2ɸ�L(hi�e;AO�u���0�  F!'!�KT�Ү��$�E��:����2)�N{��F����ߍm�Uj�<�2uk���H޶�psGOL����N�Ξ�S��������o��A�G �'S+���>�g�!@() �$� 4�$���n�6KU�I~��3��Sg�Hd@j�bl&(����`��f���4�ڥ����|�����sr�}�@g��"}a�8m/�a6��X�W���E6	�9�S��������?�Jw��Z�z-��4��{fĨ E'p0)�ѐ��U �o�)�N	��зC�sVf�
�G���`lr��bc|�Eˊ��yɾƵ�l>�c���q�������L.(b�%wӡPoa���n�Pa�6���Wq���o ���XPp8�"�g�ȣ�I�>sQ�O֙����1�j}�h����e���1�"��j�Dhs�2/Uٱm$ ���殢9��B@��HW��y��!�O^����+�;��m\��%�#ß��b�H'4��S�7bAOߏ��:�t�N��P?o�y������ƃHqvE�K	#�<�l�R��@�`q"�&Bz�(	���Jp�[��1=c'�@����	��Y�q2y����y����{On�(����ϔ8gXů�*񓁋�|�toMޡ��ȩ$:z,y��(�	��J�*�^�,����m,Z�����C0&���9����P�4RU�M��Z��k-@���,0���-�~�ѿ�ܘB� f��Y!vL�%IS��!~�<��9fbc��?�·���S��k��mJ<��� �@Z,5h8|���-yb���xk)�J�l� @���^f�Wi�sظ}S��*~/#�ߗ&�2/�ধ�u,q�/�߸f���K(5�ߌ�&��ds�Y�lV��+w��&�l���g��h�N����9Ӌ�֣�1M����m��Z0 X�G���[�Rz�<^%Czx��℉�[h���]�BC����ut���M�Bڽ�[��i`G�R���Rs�W��0-<� ���c.Q%�����Q�Vn����2�3�['V�?z����M�Qr�+^��!��Ʒ���ů����w̌,kz�G�m�}}�#t D۲�# U=�c
�F3cdUPJ�o{�����"u�5S�t]��Gxx4	-"�Bp��EMGO��������;��*��#����BD�|�������CP���|��G��?H8V�_��B#%����zpE���&���jZI�@�Ƀ�`@N~1]NNN�Z�j�}����~��>"�Z*9�O(8\g��$��k���1_y)��d�v�[n�+?���<֝�
$
�A[��g��x�~��k#]$���e�)�7��7v�w�ȇ���Z��M���A�,��q�f�r^x�n�]�G$��O����a7�`L����ĶtY�,��-��h�_aO�<�0����������k�f��mꪎ+Nd	�6�/(�q�Gmv�t-P�v��ձ
:Kz�a��x&�����2�@��S�Ii��!I Ĵ𺃉1@�A��@X����������z�A�X�ZK�3\�^J��pެ�(����uJ�2�n�ֻI�N�f�2*����Jq�ht�4�ˣN
��kI�@�'��X͈��z.��wc�;ؐ�U|g�&n���Q���9����xr���e'Pp�d݂@�\o���T,9�=�Q�_���q#F��!�T�5b�b�������V�G s`�M��󡈰ސ�R�W��R��Azx�L�y�?���6�+Z���}�ቭ��?��;�X�w{% $YA?g�e�|�u��}��8�n���z���ݪ�d9�<���*�-1������V��a�LQL/�N�o&�u�Vۆ��|�uY�M:8�l�Y)v���2-_;���'���B�{�珯$�r[��
X�N���#=�u�e=~�&�1O��W} �X�+	�kN|���-<�)mBآX�ǲ��L�u[�C�ǋ� �vr����i`"�+u-�ԗ��]}u�ւ�|���$��TP��I<%���	��T��Qr�����9T�h͝r����e�,>��_9�]�s���x
�A !x{�C�d1�,5?}1.lMTy2"�]@����8�9#�<�Mxf�(�Mv���u 
N3h�?Q��h1�?^x�5��t��N�V�o��Yc�a^5���D#e�e!C�cJ��"�L���<��3@��c���d�����3w� �=���>{�ж����!_
�+):�����?�X�\n:ǘǚ�X&R��QGY��Bd�C(+�¦Fo�����/Zht�5��c�GΣEh�dD����M�2�ᚮ�K��]�=l�]Z)]�GO���T��GH ��k`��w'C���F͎(��5��ƚ�x7�`���o�?=��"�H��Qu�`�,����ԝ�&"G���������C.J�dP��ߴt�t���w���&�c������I�%3���5LİM���5e�]H��833)X*)&4�&d�L�%7Wx�1ѹ�d���"�h-#,����X�{�p�k�7X�|Y��� @S�w��]5Ut��)��׊�
��z�`��T�#J��b�X>�'���Kiĭf ˪�9��j�tL)	����?$ blųР�}�����ۥ
`'M���7"�65<�����a������Q�)�MN�+	�u�"�`3��>����fv�xx��A?ǳ�z�J���3������t�2��6�D��B(`BT�?��'�N������v��,��p��q�pa�H6^W��P���O�{Љ����u�V8C�"^���c]h���.<MKK�4���T0e:ڻdt���<E��+
=,��朌<����k�]Gd�	n+�I��4�V&�R6P^�{q��%�-g
][�����x�=B�IF��k9}�-�O���KL�` �o	<w����b��+/ϒ�k�3�B~c5^i��[EK���1��T� �p(I�a���$=���5רt�3�|�{�n�/�_�޵h`u���AsM�%�4�Q� e���&�-�;��0eek��m1&���m����s&�E���ʯ���wg�M�OI&��������?�/�֮��t��^ت��%3}��_�]��Q��(�HWg�i:�CZ7;$�~������g\2+�}ǩ����M_ D ��
�+Pt�/�� ģ��f���tO�����;P's֧p�o)��sw�8�r_q��ɶS�o^?�q|�~Ҡ),Ǧ` ���C��ap�ȴB�^z�3E��[�A�Er�r�5[��T)���h��ǣ͛�������eX�j[s�^�L�����"<ؼ�D{䥴����_g����y�~��&�{&��P=��<� ��7��C�Q��m�R��Y\�eˇ���'�>"�!(��������'�g�b��p<|qL�^rt�\���q��q����jō�ݗ"��'U�Z��	�A��k�\�8�D�1<^��?DzC�Fg�萇���Vz{ź��j��l��?�������(��d(�Ы�lf�s��b!�`k��2'�H�H�]Us��-_�+(�_Ccd0� ɮ�	!������o�Pn��������9���5�X~X�?�g�~V%R+Q�����0U�["��3�Τ�8g`B�U"D����b���a��TŸ��~�ӆ��18Z4��rs'�O2O������+5j�k����s�W@����~�}��\ʜ����#GJ�-.Dl��!2�
u�ݢ�Ǒ��Lvs�ꝥMM�2�)�������xq�~��l5�x>|h��#k9��1h���p��O���C+�����i�8���ɰ�!��`8>�C�Vc�y��صSO��,��7��9�_�M�%��bL�+�_�gQR���I멓J���f���$T��r2�8z4����ky8��=�=�O��  e�}����6��� ̙&�bB �r�8���c0%�R%�Ͽ+�������������S�g�Ư�Y��e��,�k���V��+r����P��>��`sT[X �~8��ɀ1.#SZ35�L�N�iK6�C1�c�"?�����ky��Ղ��Rg��/�i��|i��O�妬�F��B{�b��e���MZV�긥W�ɠZoH�Hq0���,�R�`>�Z����� iF ��1�dV�����o(���#+3��E�,c��~��X�IƧMŋ�8Q&y�Ip�iϷpWa���w��E����X�Ɓ�Z
�Q��s*�FW�|FV��Z4K�M�b�:�G�����&�e��"R鐂k�8�pʬ������U���&�<6�IUPыp�Ta5�A����e�7'���B�P[��#k	��� ʹ=�2	?Ђ�{B.�A���!c��v������Qp�q:(�JPj	������n�pÚV��3��A�S���Eb\�b�6��M���85��PE���;�Lz|9�
q̓�~g�8l{9�^2?@)|4�i�McƗ!/�4��M��F�Q��N��vs'��\�=��M%�̄��C��+��oT����J������֎	a��a�s�,a�uS�{8c�\��H	iE���jcKVHr<�	K`�om_�ff�2'�6n.h�΁�?��j��#���X������01�8Wt}�4~�3��j
�	�o�f��5�	�^�%]Ų������ف�r�����2�8*\!e-(KH�Mh����p\�o�E ��\����s�����M�ݬ,��#76�4lT\T��=H��2v��KUs���&�!���?	��r�P���QMV�l,�w�+��'O�R0�NW��`�Xn�߲vDY-��՚�g� Qu� ��2�J�&�߻mħ�v�A�37"_�?=�]6LB�v�>������"v�f� \���g9������KB"� h��"(��ɧ���|�(-Ӈѻ�{]�Z��I+�r;k�A�|<>S�q��]�tă��w��$��	-��#���M����u�E8Xc���U�U��e��P1��������=��"cD3RM]�&ק_IM���e/G����v�.��s���r4����W���4��:k����3��!��Q�`��>��2��{�#��*C��D����u�7Lv���WGR¨W%���&3Yb8�8zB�
�L9�#؆͹��'�3�H��}�T��:��6��?�w�����E,���va��e�Iw���������w�X�F��N"�W��tOC�U�Oh�9�v<�o܃c��@%�҂�ki/��!�y@�-hI�t�O�f�9hf���g���k\>%- X�*
S��b�}��2���A|AV՜.�jF�նBq�ø��FU����ݹAE�����K {؈M����� ��a�i���%�p�oCKC'�_���O�&п%O�`������	^Ą���z��G8��/� �����m�z����k�����W��m;���Y諷���	������/�в� ��� �Ҝc��/�X�\5�%u�"j�|HS��G��2��Tc������"��Q�Y^"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_NAME = void 0;
const utils_1 = require("@typescript-eslint/utils");
const create_testing_library_rule_1 = require("../create-testing-library-rule");
const node_utils_1 = require("../node-utils");
exports.RULE_NAME = 'no-wait-for-empty-callback';
exports.default = (0, create_testing_library_rule_1.createTestingLibraryRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow empty callbacks for `waitFor` and `waitForElementToBeRemoved`',
            recommendedConfig: {
   