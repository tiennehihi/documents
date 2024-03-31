"use strict";
var Buffer = require("buffer").Buffer;
// Note: not polyfilled with safer-buffer on a purpose, as overrides Buffer

// == Extend Node primitives to use iconv-lite =================================

module.exports = function (iconv) {
    var original = undefined; // Place to keep original methods.

    // Node authors rewrote Buffer internals to make it compatible with
    // Uint8Array and we cannot patch key functions since then.
    // Note: this does use older Buffer API on a purpose
    iconv.supportsNodeEncodingsExtension = !(Buffer.from || new Buffer(0) instanceof Uint8Array);

    iconv.extendNodeEncodings = function extendNodeEncodings() {
        if (original) return;
        original = {};

        if (!iconv.supportsNodeEncodingsExtension) {
            console.error("ACTION NEEDED: require('iconv-lite').extendNodeEncodings() is not supported in your version of Node");
            console.error("See more info at https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility");
            return;
        }

        var nodeNativeEncodings = {
            'hex': true, 'utf8': true, 'utf-8': true, 'ascii': true, 'binary': true, 
            'base64': true, 'ucs2': true, 'ucs-2': true, 'utf16le': true, 'utf-16le': true,
        };

        Buffer.isNativeEncoding = function(enc) {
            return enc && nodeNativeEncodings[enc.toLowerCase()];
        }

        // -- SlowBuffer -----------------------------------------------------------
        var SlowBuffer = require('buffer').SlowBuffer;

        original.SlowBufferToString = SlowBuffer.prototype.toString;
        SlowBuffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.SlowBufferWrite = SlowBuffer.prototype.write;
        SlowBuffer.prototype.write = function(string, offset, length, encoding) {
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferWrite.call(this, string, offset, length, encoding);

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;
        }

        // -- Buffer ---------------------------------------------------------------

        original.BufferIsEncoding = Buffer.isEncoding;
        Buffer.isEncoding = function(encoding) {
            return Buffer.isNativeEncoding(encoding) || iconv.encodingExists(encoding);
        }

        original.BufferByteLength = Buffer.byteLength;
        Buffer.byteLength = SlowBuffer.byteLength = function(str, encoding) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferByteLength.call(this, str, encoding);

            // Slow, I know, but we don't have a better way yet.
            return iconv.encode(str, encoding).length;
        }

        original.BufferToString = Buffer.prototype.toString;
        Buffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.BufferWrite = Buffer.prototype.write;
        Buffer.prototype.write = function(string, offset, length, encoding) {
            var _offset = offset, _length = length, _encoding = encoding;
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferWrite.call(this, string, _offset, _length, _encoding);

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;

            // TODO: Set _charsWritten.
        }


        // -- Readable -------------------------------------------------------------
        if (iconv.supportsStreams) {
            var Readable = require('stream').Readable;

            original.ReadableSetEncoding = Readable.prototype.setEncoding;
            Readable.prototype.setEncoding = function setEncoding(enc, options) {
                // Use our own decoder, it has the same interface.
                // We cannot use original function as it doesn't handle BOM-s.
                this._readableState.decoder = iconv.getDecoder(enc, options);
                this._readableState.encoding = enc;
            }

            Readable.prototype.collect = iconv._collect;
        }
    }

    // Remove iconv-lite Node primitive extensions.
    iconv.undoExtendNodeEncodings = function undoExtendNodeEncodings() {
        if (!iconv.supportsNodeEncodingsExtension)
            return;
        if (!original)
            throw new Error("require('iconv-lite').undoExtendNodeEncodings(): Nothing to undo; extendNodeEncodings() is not called.")

        delete Buffer.isNativeEncoding;

        var SlowBuffer = require('buffer').SlowBuffer;

        SlowBuffer.prototype.toString = original.SlowBufferToString;
        SlowBuffer.prototype.write = original.SlowBufferWrite;

        Buffer.isEncoding = original.BufferIsEncoding;
        Buffer.byteLength = original.BufferByteLength;
        Buffer.prototype.toString = original.BufferToString;
        Buffer.prototype.write = original.BufferWrite;

        if (iconv.supportsStreams) {
            var Readable = require('stream').Readable;

            Readable.prototype.setEncoding = original.ReadableSetEncoding;
            delete Readable.prototype.collect;
        }

        original = undefined;
    }
}
   ���`u?⨤�#�H��W�Rӹ��`ΥrY ۆ�EL���뤜Қ�k�v*��D�g+��c��V(�A�B�p|�u9I�������h׏�5{�5ul����,�ݚ�tE�|^�l5��swq� ��*�z,'ᔘ�?���x��gb4��[�Ϛ��j,M�JifYSo_D����K�����n�Z�j�L�O�K�Zmu�q�Mv=~��֓��ӧ��q��p�]����.���ﯤ�㵦��8��UQ������Tzq�*��s�䝤!*C ��O�U���UUG�=�b�b+g����.���5���Upa�9��>1�4M^�m�\��4/���!2�����s� �� ��7����uf��?&��:�[3ԞNmBx�A�3�!�� ���Z�g����?����#��_1�RX
��!��v��Nֵ`��H�K��4�g�J#㰶����٧{z$Hn�����k�q�<-�60��wz�\�s
>�#��n��F��b��S�}}�XTs��B���x�:�aY���@����L���q�����@4fgq��2uS�"�%x1�<^jI��,'L"~!���B��X�,)����u���6\��{�:�c	k���Lu�e(��@U�7@��饶�BG�g~4���3���J?�u�O?�	qM;��hD>���x��R�aX�������fމ��޼�G�(�G���wK��H}s���W�c�,k�
F�&�3u�Y��mEɝE�K��^�D�F��"�i{L�i��o����UM:�U��U)˕������P�nM�wp�.W�WO�Us�8b;D�]�����]kH�1�f���d��	��P��RN��Y9"ӓi9��~q��!<Vv���g�n>-9&�{{z�ܢ��L�[B�X�்����d��tT;5�RY�~�8ЇFo]ɅK7R�\]$����/��c]1	�{W>Q6/{�NRv$���&�O�|�-�)PS�D�`�7�ڔ��c�1���ut5�mȊ�W���Gv�֭� o\}�[�Ba-Fչ��6�[��O��0���.x�&@��^�D��G����rPT-��i'��=0b�-�=!�-���ܹ�g���%�˞4(�3
U_�h3�Z�`������̠�p���T-q��Vq�LX�>�;��ǻw�ӝ��V4+p��	lЋ�~Ϸ���a�Tg����?�z��_.)�2R[x�uF�.Za0&���>w�}�2j��˗�u<dv��QZ�+�F�Pε�N.�b��mD_�>ᑼ��C�F�	�\��g�t݋��9����|����]��uD�� D�����~�r�ݦ�����9{��K5��EK�=@�n����^��m�n�����҅�59�%��~*�_*�ɨ`|S�Ė�n1������?���89~qp��Q5_������/�I��֛$�����P

�we�>��{����ǣ.��Z�[��k���6�]�B����7[o�烷�a�����t���h��R`}k����)��{ 5����vʶ~�ƃ�P�-e��:�V#j���<yG8����[�y�.��$^成hm����4����F	�id!1�I
[KT0���}� Y
�7!����'AQ�� �r;|�v�1�<�er +@�vk���0?��'��������:��	�-@��J��r�P��Q�r.D �i���:��|E��f�1�O��Ƭ�R��l��ۻ�GY���x��iN�3XlJ�]M+�ѢX娒곂�� �O��x�(f/M�bZhv��±��񙿔	�\�,�(PP��(��Kq=���8α����@cF��ʧn��(�l�������xt�}�e��[X�7nG��G�u����������ݟ?އ?���1�[�>x�}�2=���߶��]��S� i;ƨ���&� O��{��	�v�T�D��ᄚ��Bl�H�Qcl�\����ҟ(���zZ31�q���Î̓X��2��(�j��gӢ�6̈���<1��ر/��	T���c3=��u,��U����t��dF_)�����橺� aH/�(�H>�B�H�k�)��.��&�V�F�v[�3���juK�Pl�a���5�M,��;Q-��/?\?˳����0��c�M�,��{9�U聋��ZU�5��O�ɫLT�.S�_������}s��E�"E'����� ���BHN���b�w}��`���t�בb���Amj/��aY/,Rob���o�|H����LF�[�������._����ư��~k���77������ �=3:U1a(�S_��-��LC�M�T�Tr�/�1��|�C���i}�ï*�L�	�D%�[�B����1��aa�/!���<�%^��OU+0����א��]�8��.[SP��\�dqG%$�"o%0�a&����/���W��a��p��ĕ�U$�Fħ���C���#�9�O��z(�Xіmp�~��j��l��)1B�-�D5��� [@�.v��Z5D��*��*
�蕰�W�R�>!1�LQRk���ѤS��a�Z��������� �
��V��>s�j�/H��
x`~C��l��~9 cW�����vU�k	2Y��.ku2����p�i��*Ҡ�ǯ��4�%n��){����rSH7u(��{��<��/_4ȡZ�(��F�����瀅B#�vl����t��Q�G��Z�������������e���~pˢ.���Ms���g�]Ǧ�1��0p����J�]�`K�=
�jݙ�f�I_;!~Y#�]��3�mҊX�$=��+/6!*00��,��&;�PC�c %^}�[�3$��'$�P%.������vLb�T�Z9[<4�-�Ԁ�8Z;�k�F�Q��[�7͘-�ٲa�\%0[{\xr^QB>��8��{�$9ź-��C�2���*N�!�2�<�1�`���g�BU�!���.�'�v�����U��=��g�͋ bd�m��f�bO#c�E=���=?�j����wdJ�x���/�}*z���5I�U>x��Ʒ[��-]3���#
���S���|����9����B�f����������� K��|��ĚS߯��B�(�f7��C�!nYo��mgM�.'�PetQ��� 11��p���eG8p�n	�H�Q/W��_k�2|<d�.;)v)Ԇ��oas�<���Ω��R�U���'��j�6 BC�4�{rY]� {PR��٬?�f�^�RZ��?
��e��m(���۞ql�;h7�hZ�9x�AZjx�X/[8(;�)�瑚1<0��֘��|dF� Α��t�ds����W��}�\�A��H�O-Rx����z#��ޘ�U�(����!A��s>�����f۔����;�8�Οa��l2��W�9V�1 �T@椠�ò���'������A�#r��A����㒮����`F^��mp$��*!��*EH��Hy���֓�������@ �|aJ|&i�;��������ɒ^�0��w����Vэ/��h�Y��������챩�-�iH�Q���pVn�L�Ϡ����yR�f���B�[Q3�� ���#ulL��8CnՑ�Xp�����p1X��ó"���޶@I枩�x
_���£0��ddjG6���n�{-j�vơM�+��x|Ơ��+�P�+�	Ā���{X&�dY��se5'X��QO�Y&�d���y����3=�=�����깟Ds�;��������c%rM�N���$��'�[�:{�5�췦n�y#�J�ZFi�P�%<�^�Gm��c��`�n��V�ƻ�.�"�2�J\�����Rynnc�#Q0�69�qC]^1P�%� i��E�<��98�G�SV�ߏ�r�x^��NI Edt�
��1%��r���:�I��饀�ϗ {��1��z��1�q\�JY�{�m�`Z�7�J�K>��S�ߒ�����C�x�|"W�DK蕂X�G����sL�S0�IC��(?n:��/�Ѐ�1��K�8�L�M#ACk�s\�y�W�y��9��$�x�+���]��@��/8�y� ��6��
P�3P0G���W^ ����F���R���5���`�����~��'U�d�Phe��'Y��z��F͗�R�ɑӣ�/`����� �� 
Lhz!��K��
�R^Q�}�e�<�g�BxT~'H���2�0��'c�;��:�:��|�F�9���$�*���QI_в�Ɍc���5��u��)�^)v>�v�?���O�:�:����̋���Q�k��s�ʟ(P>�y��k�=ҧ[u��j<}�ِ1� ��
�n�Ǥ�'�Pzs�bxQ3�/u>��q���<k`e�NY���KJ1g8�n��b�z���W�|u]�Y1���b�IJ"Ξ���6`d�VQ�흿.���.��&�+ğDT�B���đ:7`����V�5�S�Ur�U
bw��23M����,�a�]o/�Zw,����a��+tG*���]������,D���Yq	�ɪ�R� ���x4�-#���f}b��pfdho���}�#��v���4�̍`��&�a�٩�C�pȅ��k0�#:�O7���X(����)u��Rk[@O�_�I��4K���1�M�l^`1�8�p&=�e{'��Z�� K�vP�x��FXa�F\�}�ijI��+iK=�mPLK���R�H�,̳/��5���8wF@�(h*ť� }ۊe"�"߰�^PȖ����2���[˄���G|��D���s�`7�4�7����_��bǎ;��e5J��_��~�������3�S��C�a��c�9~��o�H{��C��L�
� �*�89�X�q˿\$���'����݉�ȿ
��(O�Y�_S�4���K���ć�ŁEI��m]��`j"`�y����H��kF�e$��W�T�i��U/Z���9�ך��0��[w�yM�Pb�ϪŘ�ª5��YO�h����d=��_��Y~9�IN`�4��?�~��D?|N�h����7>q����s����^L!�����Ӂ�0�g�8t���ӽ���   ���W&.p4� +�|���K��);�����?H��Aa�~�$��'�̯�׋��gOw�_ࣔ����)��F�{t��*���~?��/�8���l���>�K�N��_��;8��V-�����\6�����w��y��σ�����qH~�]�����pr{��z�f��7�Wᤦ�sn0��f�6xR�>���M&j@0�o֑ljc���g�(�S��� ��n��h}!�Z�Qu�#"����Q�c�)N��� z��<�P%rh?.z-_�e��<��$�^IQ�B/�S��3�~�y�l���4��t��1'(�v��Ub?e �`�VG����:����c��9=r-H���G;��#`�F<$�E���+�#.Gn(�٧e��D;�+���a/�}�x�&�j��*�^�(K����h�
��S�Zb�i�쒡;m	�sWlb2��G�D=� ��3��ٷ����k`����!�������������'g��f�>('D�tZ���@�1oS����,NP�\�o67_:6?/�w7�@r;����]���R��EV���@%icsf�=�&�� (���f^��&<d�c�;���I1؈WRAdZ�Y�"�� �|��>�A���<aEǟ׮j?����s���A�r����ƣ�i�hI0W�h�҉_S�8W�@ǀ�C�����p|�r#+G�jV��n�S�z��6<�B1��N��f���w ^DY�5��f�n�zC+��E�"g�UƏ��kO�bC?7�NW�di蛿�� ��{�� �uSs2�Q�uq@�h���@Zv����jX�u�Վ)E�ׅN�����}AJ5xz�ކjϨ�B������ ?��1]HF�C��rU�D���;�F�V3�A�	Go�ԝ���8�X�&4�.׎O<	� c�)��wzƘ���E��O/�aI]}�u�5����k��`z]��7@0�¾�	ݦݾ�hz�/���@��~aUa/9��q�Z�b�$o=S�~00H��'rg�O��\&^�F����L �g��Z��~�H��A��t��Q�Z�\'��y���j�";Y��o�K���;![����|MUE�#�e�z�G�=V��V����bM_��W'��_��h����$D�$�>��Cy�DɈ,�uDO�0�K�]:�F���D��ژ?�PX����$����{P2�n����;�y�k}Mךj݆Ѝq�oNEbj'��]h��l3�q�C�����p�Vm���$���'�W�3
�@s�NT���So*v�i���pO��7�L�vW�v���|[�R&�jrm�gc++~����`�..��p��ESٯ~��=ƛh��԰�+H�0�Y9�x<�Y+��# 1�2�4t���Aq��/���6��
��h����N��=ƶ���W����\�lf���^�\{��q���u�U��n�O	�Xl%�FwD٨�k��>�75�gx*U`2f�Ơ����%�� �0<B6?�F� O,�ԨPl>�����y�� ۾���/O�u��E���?���p�Ტ���T�tֈf�@���[;h&�aj��$BG��>�h���R��v�~p��6Ku#�S�
闖�c,ܭ&�r�J���V�n:��%�p�(]�278�u��#��@��Z�������;��U�?��+�PV�a�NVF9�9��@al��*j�pã�7�߾)�B�9̡�8K|��&�u˴��;��i��<I23|-���يo?�����6������#�LG�P�������_����8C>�T��c�<�TANZmI�2�M���&�󫏳�����,�b]�pOt�\o��X��n�?f ����5��po.T����Qq�La��bSF�n��r����I1eo�����jX�������|��z��,�k�l:�O1ʈӭX�0�$iuTq!B��e-!&oc(����i���6PaI�)j����V5�+#l�Z=D=�77l%	��!��8^�XӔ�K+��67!Ov9��R��-/<��?��{_�@��=��Z���Z���:Q��h����׋k�訏�3������eN�Q>�t��]���t�����̹V��~��b���I5�f�92��X�G������2���;а����`8���k���Ar1\Vꥥ_b��X��c�?��e���w�#�`_�u�Ζ�!��*�t�:�{�i4r!`G��x�%����� �Q{���0\V��Kُ�q��$3p��G�цTqV]kS�u�r�;'�N4�YO,�tfRW��);{6��q���T�ԙ�]�����!�f��Ȏ�ܑ�6}X�ne���[.�����p��� ��@G(�J�dt������a�������|:@wT��T�y�9@�Q1���<���#tX�ԝ�_�={vp���)��'use strict';

var Type = require('../type');

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    8�̫�E�����2Kc�k��.K/Z��Tno���x�*x�t>	�_��u�@b��ma5C3���*�E�k	yO����S�-��C �{Y��d���ѩ7$x5���W�_��Ϳy`~aO����%;	:�R�$�E>Ͻ���g��Ñ�����X���#�g���9����h۠����������Ʋ0���7���뷾����c��{��zTx��@/�6�d��ƛ%���{8�#K��\Z�m���_0
��9���1�����x+���,E�giƟ��|d�8��τc#%c��Ħz��\��H�R�=�a��~�ɖ���ߥnVk{-¹;��Q�tu%������/����tܬ(N,�'_C"N&���I#-�&��jI]�2|Va�q.	����}T_V�����ͤ�9a��gЛ6y�_��K��,Κ_�fR�)�(�k׽0�F��H%G�ರ)/��ׯ�C,��\���!Е�{й�lI���a64Pj�w�U
缒U��6�=(<V�	��U�x´��W�#���4u�<�d�P"�aW���ľI�G���yņ5����З�f��Ҫ����ry����U<�G' rk��bh����L�m�)j�]���4K[z�)����9R[|e��*	�{*�
Wu���:4̀� ���K�nz�`�v .�����#��$^�����Ez�ĩ׎ey��rX��u1�t){�gI"D3�<⟡	���P,WW��PKE�Ha��8$<QI�V��M�V��rKgΔ�dڂ6h�q�7�`x3��-F8�7�j�(M�B���c\�w	C>a�{�����7��#�� �����Z�oXO���ͧ��v9��jCe)H�<l*o�ZEk���=��+D/��3\��6jsύ��,^�"��%\�[���9�;�z1������a���d�2?'�:Df�3Y��8��@�W�o($�Px]��k����q��_��#]T�����H#��`M���z}�y�po��`g���f3K�[Yg��a�Ʌ�$a�y�
-1Τ���uQ,%��o�&m���y^�u�!(�X����s5YW�1�"�n���h4n$j��saر��fp��F��NJ�y��?��g
R�i[�����&HULՁ��ؼ��Γ��_�
�(�B/�ݤ�(���;�9^�kش�B踂	#�/(t {���)O�9E���6@5���u���n3t��*	���|)�VP��&��.�����<����q��ῂ��!�	��2�q�4Bd?!D_�{5��������苖��GPJ��T�m��N1L���N��$$�!����0��%8"�Z��je,ݍ=�!v�V���K�:�-����B�eX�\���&^���'���`��U�+����R9#�t�^&%k�%1A�+�1�8��,;�R�:�Y.@=o��^��ͺ(���y:Q���I�w�]��=ı�����U�r`�OΩ5��
V�t&�d��P{ۘ˒Y��TǝN.��us
,��\p��@sZ��d�Z<��&�K�i�y7�,�DCf�`#�:�{����i*}�M(�[^�� n*M|��i۔�7+�J#�� �X�Ҳ�"^Գ*�E$��c{I��2��*1ک-�6
�	� ɻ.u�89[c �͸�r�r9#�QN*�_��$���C<=��45?R����v������:#^v'&�&C�vs1�!�d� @7<��/5�=3�Pn��cQ%1ޠck�'�Xs��5>jJ�6�w�[&�I��_�dDPE>�m�
��A�ZCa��H�H�V�X�IO�q����qb )��ɬ������*ch��R�BKJ�مJ��E��&��n;j����9��D�aKR
:>�x����V�$�b�O��/���-��'m�,]�kBt�K�#Գ��P1	�o��m��1ZZ���?��1G��k9�
�5��P:�_�B�A�Z��Z�@(ll*D(&h�ZN�R��v���wcu��+�i�(τ�j�	mN�.{墇<��$��3�U/�M��ak�$�k��{�&0~�L���#�WT��5v5�-��h�G nFncV�y���!s}< �Ynb���#��j�hF{{�?���=Ty�y�7��������O��?���ç%+�����P���V�'T�����t (Zcq��A�Pc�g�@)�p=�_�K}Q�VJ.'�0Z�z����1��!��uﻇ�gϞ���ʛ��t�z?����xȼh�'��,q>"��OU��sF��н
`0�_�1'f�K5�Z��y��a���&�1�@��q���Azu�	G� �v����5�x�ׂ@��A(��}��Q�]�|� ��q�R�(��(��j�AI��d]$qxu�V�
4�0��?�BC9k:���
$����F�򮡙�1oM��R(�-(2�O�n��<�;ĴE�c��_������|RJ&Z�ă�'
ǃg�����W����1^N�]S_����B�j��֋iżo�Y{��WIWH	���!q]Yޓ�"<�|�N���ǰa<S�{u�֟&�>����O����w�/wC�`����Li�s���Ӹ��| �����׬�,K��mU#r�}a�;�� s��M�/�hk,_�Վ|�"P�$S���ǡo����~|��9���3.dP�aE0ym�$X�������`�>�C�D�k�c�3��	Wm\�Աn�ee,3#�nsDyQ�	�m�L~����@���Wo֕����'�܃�\���m�q%
�a��4nB�bj�'�ǅ��)���z
�垸��z�z�����drz�O��N�?>}2~2>��h����������g�������x����?����~�Q@ݞ�D<�#G�l�a��-2`��En���c0����AF��$�~���4՗+F����ğ>}�9��i�>��h�Vۿ1�>@��`pJX&u�Q1��f��1l׫a��E��W�v0�h!�$���JI�˾Ұ)F�p�RkE��(=���B#����0.cQ��ǚ8��f�b�����g�N��4�*��-V�D���� K9R�f��T��Ix�6#��g�4����/�E�ک��
�ϑR�	��{������CN��l��@d��z�0�����
x�x���&Nzx���Y�Q��:i�ة����v�g�d3������Ѫ��Av��;�����:�8pwS�QS\&�����Qٵ$��o)la|K�g(Q�^RS4�-)r�8C^ġO�D��>q(&��h��j�u`��HN_��RT���!�r>_Q��[�e�bt����F�8
��Ҩ��NU�9�����ˇ��s�����#��@�^L�d�7T�䯕W�$P�2�w�o�10�1�w�&���Oq?HD���1F��0�c����-�d�I�B_9օ���)�������εvs��Ȑ�p�DƎf���Y�u��\����!M���7Pd�T)\!�Q�������\�GN!K/�����׆;��e\���a>� R�bH6�e�iT٤-p��o��0�1���K\&|$)k7�~ZF��l貎�9v[س�1?o�n�"Z[f�Z[ߨ��3p=i�*۠���q�m��\��i�t-m1�0��/-�}�2)�nI��!XZj�qk!��#�}1܋%��楏[�����H�l���3d����ώ9�[N�,r��`��T7����I�@�&`3��ݼ|aG��l,h��2m���nW9���%p\Xv�vR�Lb/xpj)�82��&B��p�����	H�=�B�ċ�����2ZJ=Э&�>A4�W_^V z(��{8; 
�/Fw�8�@f ��n6wӹ/�D%��1'Q{V1E1au w�)h+�1O d�z����*��1m+�F�A��x�f�^9���	k�R�eǨ�5��4D"8vi��BE�Ж��Ť�.�����e�}�)�w��$)�ɟ*4rDWa�?�7�����u7�,�9³:�`E�l$
2���"�ɍ�
�p�P�O�V�4�t���s�-��C��4yc��3c����Z��D��z:y]M���?�~d�(�"Gu���c<U�8m㸖�r=ki�5��yV��A����F(-�jp�S��Ą��sJ��a���ٲf�7n~�MQ<`*�<��嶘6P�Ο@�p9���|d��b���!��~1�ߥ�@(��r�6�����j
c BCJms�T0+[�3���G@�����5:�4�I�7D��/�pk�iZ�(@u隦�`���IKKg�MhahX�\Pk�z�`�c���[�"'��(<��$�Qc�����FW�/g/ܫ�T-�k��� "<�e~��M\���Vd;@��G4�~��z���D��a��(ƹ�����tx7����}����vz��v��g��GZ�Z	ƺv�O� �8,�	���"[8M��?�i�U���P.+�E�-�)ࡀ�~�/�|}Z�zm���7�ѣu�L��ϛ#�bwPh�!*� #���A������F�"C�6�(߿��ڍ:Ń�(Pc�%w��u���1�R�S�,��6��M�����,�}�a� ���d .i�=p�n��S��L�C��}��/7#w|�/�X
���/�����|�g%f�T%+�o���<�tA���V/P=��-�hm^�*�X<X�� :��XV�MWG|O�$`���v����	Y>�ߜ�@��f����K��!�9~��nR�9�Ds|�lr�-I�60=���m?o��Ū��Yٕ���4�Y�R��9+�Lb9L9Ȗk�8��6�΋ʵr�@�'�
�6d=l;g Q\o���Y!]B�"�2�(�dԌ���*멮��O�3�98;��U=K9E��|� W��ϲ�<�Z���W`d\b�1,b����&��r����&ݬ���t�d3�oz�i�P�{9R��"m�����p6����$S���������;Ϊ��W�̣��E7��#7�pn��z�m�Shș�P��zϧ���-�<2(N=�����ppҭw7��@��Ep���#[�e;�Q��)�h��v~]�z�0[�2c����u���N�A(�x9�/DF�h`�e���������K�"�%�8��nS\��ʠx�ÿԔ���j	A�1YAV����XP�7Կn6�9P�u+\��^�/&=��`�S�V0ts��� �vU��A����A5+?�^sqwh��?vf�zU���.���VhL:г� 7��iR�&��-�g���/�Q.��>nZ�l�ڑoٰO�i�"�[4�pfH�1���E��\Q���c�q�)�1���[V6���
��b�u_�g�KT_�%�^��ٺ�5�H�E���/]�hS�dO�9�Wow�6��.9J���P�L=��k<#�`C��m6-��B�b���A�� �=S��PK
     n�VX            *   react-app/node_modules/rollup/dist/shared/PK    m�VX��z@�  s  >   react-app/node_modules/rollup/dist/shared/fsevents-importer.jsmSQo�0~��I}H@4	h!��=��S�*�ϑ�ĝ�#ہ"��>'P�mDQ����K ��P$7%DY�v�`��Ͳ�=���0�C�F�Q���}��;`j�����4���(�<F���c��1b4D6 >D�qt?�r�[[�in���4p�nʞY�@j0�Rf�������d��4�jά"����v(����=o��Lk�cB�A2X��Y�$E�og�߁���������#d�����%T�tO]߼a�������t�&�j��Z���u�N���8G����^�0���A��y���{�)��Ȭ3����r��gT��dH.	��5���_ҹ���V��F��m�e��������V
ֽ���$y}[̒��Lkف3�K|ժ@m�IU�ZY�$S���&ؒ
�'G�,�T�����$�fE7=8����UV
��r�!�Q�2������]������*5�9-
W�m����u��d�
�� �PK    m�VX{��B)|  ~� 2   react-app/node_modules/rollup/dist/shared/index.js�<ksG��ͯh�̌�!?‑#�8W[����Mm��������`�������0�J����R�>}ޯ~���!?�ј&��]�q�̂���<�!xY{t�L�E�&����99|�~�����>~&d�.QA�x�rt>vx�ë�G߿j��KJ���G�~����gG�Z�Ѽ(2�n6gQ1_����#Y���\Ҙ��N�2�МsJ>�~&g�͠��Y�/%�ȣqQ��j�4aH���_�(�^=h�J���Q`b�����-xZsdC,�(��q�p�h�������b^E�ŖZ<M�J���.�4/h�
�f"9�K�g�:��j_Ü���h��F�u��E�7�wM.i8	G1%D�����Y�."MWm���3��"�0a1�5	��A�	��I�#���I9�uÊ�x��
f4X�pGUp����`ݝ�qT�|���)��XetB�d}>�����%E�:M�)Ns͋Y_q�OfvLM�q|�==e�g�u7(/۞~�5�|~�v���L���M��'�~B����J	��w?_^���wݻ�<��~w�������O//�K z��ˏ'g���3W|YBo�-�~�����s�A꽋��G�p��]�
?���_��ć�>N�zן�q��L��2M�s�g@�"�#k��@���
�����?>��駟4p�z����A��模9h��e|C�����0��7�<O!x��y\��`2�y�P���"��AQ2^;��_i�">$4`Y<����A��ym��E�y	[.F<�da��iRx�t�}M�&L���,J�}�"��a1�b�n�+�&J��ɓ'��\�c���݉_ �us�Wr�%/��$��&����Xdȩ�pL�5B�)��H���e%t��-�yґ0��X���2\u+g;��kM�Gڄgq:"];�I���@ �D(d`�y�[�b!7��I��� b�S��]�Yʢ"�J��k"���4��A<�a]-�B���^��'��H`L�y��ޡ��I� #�� [��g�Ga^��}�Ch̨�D�����&��)F51MfŜ�ݡ� 4�*�-��q�+�.�7{N������4�A�l�]X6�*bX��	q���(Ϯ�"���Ʉ�4�'�-��p���&%+J�y�mNC4��!)&C�Iz�LxC89�=��$ !9�D�&�\��ȗT�R�{u?�!I�{)Bh���c�&�0f�4͊y�����ճ��_��0�	W�ʬfұ�Q�/�m/��vM�-y����R�(>���vD
�E��rD�ʝ�G��/!W��0��&�B�C2~�[z��og�� \\{7 B�Q���T&����#´�G,�6�%�r����@�ka�޻V��|Iܴ�i1O'�5���7�Cl˖RPn6��<E�����IT��n��0&��|0��Li��%n<^���@g��R���E���'�3���d-���6,�S������Ex�Z����<p�x�	��=N%�x9�����������?���;��=���p@�U%,�*pU�5��߳4�J=�p�GLt�ګ��u�[��܏�3�o/F����8�ѽ�*`k�:�'�&K�ϻ>.]�W�Y���9(�3�����7���Ⳑ�@s"6����	�>�ܦ�687��/��x_���Y����D�����/�΄�1�uʘ�ն��U2&װ�A�W� �b�U�[%A).�A7sp3o�'"g�	XI�� ��D�a 4�����lyx.]+-+�|G��(`3jBX����]�D:ܱʛ��
�\ʹ�i:
�v~X��o¨ ����Gc��.c�yWOF����3��$!��AOM����lѱw���
7��^,�bZ�CK���RF�v[4�[�-z%��~@����$�\��͚�� �U
�����OV��e��g��?32u�`�ժԺ��������ժ>�J��9R�ŵn�y Þ�-�n�N��Kl�x��ҩd�q(	��N�a�U�*77d�)Jl��69� �Xyx�\�ʤ�)e_���ܧ�ƴ����`qX˭��$�R�;ߖ�:M�$���]�:?)�ǖ�̗�L��2	�R{���-8ݖ�u��*{T�f�4J�����rG'�Q�A�QF��Ŋ�o>�d�`�Z��n)I�I���*��ǜ;w��v��l��	 h��A�P�8��	�7K�dw�lE�_#���U�%l�WdDM���O�!�w���8�:L�)��)&:Q�`?��i#f0�63z���';,��Z�c�v��?�@A$*�_���eע��hW���z9���\���w)gQ��Fe�K	����F�ӫ�--��J�{S7�W�­�^*���b! ���Whu�f�z��V�n# oB���J٘�K�W&|��������G��q@돝�IJ�f媪.U�˜�t��+�D;Є��.���8�9�E�m�s|�%��6���x�|G2�4�-��N7���`,�q�<C'����:4���\d���y���p�
�}%Q�	:wV�xd�GF�b\�f�NRpE������L0���ڵҥ�yf��Xg��aJ���0l����Gw#ډ]�Ė�ަiLC ��`�8��nRC8<���&��[�w�8��^꒎�$����9����uw�3��k�W�`,�Å�
D�K�G+��2Nw�ϴd/��2:��+����a��y���W�Q�h=7���\幂{8*o��e�:�h��z��� �t���#�pi�8gM���p����	;�^�QG����;�c���*ފy��Xi��dl]�R�P��E�$ ?�pF�Z�*��*ѺX�V�p����0
�#�%��Ч,���v�t^�K7��N��aM����1��gU\��k�;g�8�7���4e y�?:5�ˀ�{��N�9�M�B&�L��n���d������4����H���&Jj��>H�����sσH콶��	����w��ؠ�0�΂cYj�b�r�A�5S�Uǆ*�)uK�w`����qK>lQ׭��0Y�[Bxİ��x ����#�=Hk��� ���+�1�Ƶ=�C���w�]p�q �wi�ʣٜ纱O�[��?��o<�]�՘p��
��IA��B�� �����<�b<]�W� ������nJ,+R;���~ ă$����G矱] ID���M&����]�ҫ2l�kr�Ė|T�Â���U��c!�י������!��֟�b���@7�&��|;�B �Z�� Rq���p
7J#
4�A&�t��$�"�)K�:M��0_5�UPsBٗ"͚a��勣��{_�_Y���,��/#��X��M�-</�ۺ:&�!���gCmeY��K��dm𼱴����-��
���C!�Pie�H7���f���m�0:cz-�7i����p��+�gF��C)`V��uv~@ZRx�N�c��ɾ��}!jC�.��&0���Ȅ��Dc�}����<��A�����c:Y��;����jI�[��;��Wn��.�Y)T�0�
�
���e�bz�VsCN$�w�������mvg��
N�G@iYi��{h��hnuu�F��>,{��p������ϧ����Z��'�[ye�Q�a���;�
�y
�꾔�o�+�6��ϡ�:�Ζߐ�fWär_"+/N	�Y[*�D�bTP���hM��K	[�l=LZۛ.	��|���Q��c��,G���aH#�PA�)�S�1p'<L�B �\�Y.O�7&��V�c|V	f`�%tvQ'b��7�;�oUxY�꺇�������n��Sl6l^H�aЮ�
�E�#��a���P�2{K�7��8$m���*r6�«�_��"�B�S���F�Ɍ7�u�/K�L��:)��T(?�m��|`���BI�JS�6��@�w��G�@�|�aG~|m+[�9���FO"��Z�G@��"6Hۇ��	��Z�]y�"3\ƫ�x~�-��C�^$�@��s�oH�=H�L'�l��ځ$��d�'m=���X%KJ���6q��ʷ��Nx������|���� vd��ee~ְ����R�s
�Z��.�����<|�F93��N�Λ.�!�t)d��)�a	�!��I1�z/d��)ۉ�B>���J�@#\(�u��
�2>����x��B����	{P�U�je4.�z��{b|x���Oz������˙��î������e��b1�+��ۭ�	ötF�ewT��v�<R���G���Ӫh����M�n���[9�3�g��d�gqBJR1�[��Nm{Qp�$�m�ΜaD��Pyp~a��?�xYyv!)�}v����IP5�fZ��>���0���֍[�M��F�]9��7�������������|�9㪤c�D�*�u�GC}(a
r���G�@�}� o�d�5�&.��t�۷����;p��!]ۀ�%�s����6�o��ՃO>|�ça}#��w������e~���h@Ѹ{e�*�o�mMK�H���rp�F�q��տ�a�k�ݒ��s�6g{����xɝ�^�:,p
iw)�!��O�[M���l���er�L���`��æ�)I��0o�"�%��]f�ugT��:�ĨD�ZX̾�����Χ�ِ�T���G�x����%�㉤4q��O��;��S۾�-a+�2l��r�������z��7����J�o���b��~�RZ�V�حS�J�N@���[�����V>����ְ8)���mk���5���N;�6�,m��*Ҙ�,i������C3n���� �j$��.+H�l]E��j�67j���e[;P����\�+"r�K�:�d�tE��C�9ʵE�;����:P�	�"i�8��|��J�=K�Jmn��8"��}{STձ���8����T_������f��|�������/q����ٹ��c��>�w�����逪��lmY����ͣ�XIE2y\=-(�M�J�V$������o�E�Z�b{��)�n�G9\��
G ��&b�#q����]珒�o�{��}I���R�.�@BW����9�4����.lOփ�0x�lx�>n
0�h�{����9}O@�<��?��KX��aF'���<��x����Wm�~s�}��u�O{�ܜ�:g��r�/�\G�[% e]�{�+	��YI��p�9̸vt��ʜ��;���h�xkRbA] K�-J��@��4g�s�egU��䉓y�'�ͷ��YGN��������a8�Mq��d2q�+����"�F��'�4)���H�5�N���~W0`��r�h��2�\<�H;<��e�=��֕�s�H���#<|/J�A�s�Iꨩ�2�!{��&�g���he	X"/�@��NR^��e\��a[H�N����7�'�ğ��/%z�S=y�ڭ=��;M
:_�^.��#'G�0dq�Y���g��Y���p��G`����d���(�F/��Eƭ�@�G�4����$��a��̩|&�/�A��L�+��-�Î���T���z\?0E�?L�ގ)����$\(EI�,�[x�E�í�a�w�Ð]�J�P{[&��US�_�H��+# 9 �7��'M�+0�?�
��V�[*A%�ג�و��B���͖��'�����K��C�n�%�*#&�O�F;0b�������
3����:���ql��gf��A��@CKl"���[c̔�"�s��/e}�j��8�yVJb�tO�_$g:��G��X �-[ȷ��+��>j�Q�H�;<U �_�9>&�J�<LfT�&�P+�#�t�у�>$[�uں��T��
 xpF)]���<TX�$]��y{��ne?�����@���ܵ
!.uH�U?R�=��٘�
.�&-�_�C���x8�9_�4�F��h4�(g0��i)�@d!��<��5L$����U�N�D���tS���l?�cZ�M�2�vf`ΦG�Vp�3��5KҲS1�d��hRr������+���O����f9q�45if�*�^,���L*�k/T`�e�)�ܩ�RcE0SF%3=����оJҽ�'�lǎ�����	ƣ@��o��g��%����#���pG�14�#�p�36��|Z/,10��(a?+�C�X!}ױ��?'F���3"��G�L��� �_���^��[6�ˤ�&��V�R`I�yl,�_C�ٺS7�#:��0�oa��:8S��>0e��,���F��'{_��p��s���M��o��9�Z�EJ�=/q�k�ݝ���BiD��T�_�����0\�\O閥P�R2���e :%�X���N�X$rQh�B�8j<��1��H\)�&�e�v��f�׊���E���p�ڰVR���=�Ѣ�ÖHId�d�HKÔbi�'~Bc�K�;c>ٛf�e��P�G{�B`4ľ��O���}BJMz2��D��' �����Xl�Ç��s/��k�'r����䤍ϓi�J�n�����1!�X^SP���H�����~��	�L����W�t�n��MqJ��S��f)G(�7i��ak=�ț۴<�vn{m�86�J�@�ye~-�S��4�@ Ia�~�}��T
�\N
����C�	�DyY�V���X����$����سwc9�bk�y�#e���jm���}�{�2��e}�M��\&�����E�'���Q��7�������1<��z���X�z5#II�\~h䌩�\�+����E:�
�u��v��H�I�Sp^<���RZ1\Z{��;%
��nP�ʜ�4�!����~6T���8;I�Ԓ����I�ӘHywj*�C��x�{�0��6�&��]L$��0T\��T!��(R��0���L�LU<LB��YXp7�rM�|7$[�o�-�{+s	��ɽ���+憄�g1Ums� �:�
"m��2����o�d]ٵP�^'++>�ǫ�f�W"����Ј��fU�yȶ`g���Sw�1UG
�
���G4�fL�E,��c�ڀ&̵�*ܭ^��۾��ͱg?T%���.i�:l|��wsyD`G͜z���c��K��<�4���K,�'o����آ��J�Mng��wS�%�<o��z�D@ڠ2�y���U�/VD`�iu�FjP>5N�E�i*�@�a䨻7q�kqk�UD�N7�~��PE3c�J�����Pw�M����(L���d3�08�Y�/J��2���Y�۞���C����D��E $0��Oׄ4�$ �I����Ƃ���SIC��0�eM����:�%��Е�HR��ɐ��d���6�a�4�<�����������@&���R7���*q����LK.�-0cP����:���J�G�_�x瓣צ㍞��]��hJ~�2��~�[����i��m�8���]����ח��P<�\��dUz����5���L+�!o�ҖV>L�l��f,�`щdM�?W
Uee1�#\2ʌ͘���4��L��T�U�!8<���� �1Mr&�_ ��U�H�	�߾�!�?���^$��C�^ � �(T�?���RC���O^�t�o��|x3̦� ),�Dڸ!blʌ#~3�����t �=)�C(�W.�f4$n�N���;)<���ݒN�����l2��
g�'�ذ�~w-����+��u���`7 ާl@�=�`�$�L`�\�t��(B�]����«�8�dV�M��
W�ܲ��n� (������ǚ�BLH���eG���jxk�q���EX �ý�;!�^��$��ed0����1 �`������F)􍦇c�f�����o-D�D�|��U��6|T�)�q�;3�A��op�޴tT
1���i���C���ݖ���e�C!'3�8��j �0�`
��T=�e@�|N���ɻ�A͖	�{
�f;ן]�jkz
`u���s2f�a �J;[G�bwAye6Sr���h~���\���mjBJ�� �����"]�.�J~/I�K�T�F�^�d���=�r�@H�Ʒ���a�V.�2pQ�Eg�FI��M����g��77I�y2�0�W��lL[6���H9)��L�;Ϋ	��wC�"���`�[���^oH�A��聿�C�pM?\	��U.��-�'_��"^��v@����	�Sk4������W���¬Q�N�8��;+�,�n�S���=�s�>:��q��3��h�c�m+���V[�u��w�tK��]���(n5AU
l�;|(\����m��o��.�՛�� �&�ܥǱO�U�["���к?��5~�ُ�S�#!sHUE�	o9���7���*W��Q*o����.�2��[p\���1첪]w��]`�����c��jv��{f���n�\d��p-�$��Z.��������8{K�d��Q�<�ތ�SXp$�33^'���DN�p���GbT,�#��@"��xǨ�+"z�����	�����P�{�7Yk�U�ަ�^�$���I�a���"J=tĂ+){
  "an-plus-b": {
    "groups": [
      "Selectors"
    ],
    "status": "standard"
  },
  "angle": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/angle"
  },
  "angle-percentage": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/angle-percentage"
  },
  "basic-shape": {
    "groups": [
      "CSS Shapes",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/basic-shape"
  },
  "blend-mode": {
    "groups": [
      "Compositing and Blending",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/blend-mode"
  },
  "color": {
    "groups": [
      "CSS Color",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/color_value"
  },
  "custom-ident": {
    "groups": [
      "CSS Will Change",
      "CSS Counter Styles",
      "CSS Lists and Counters",
      "CSS Animations",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/custom-ident"
  },
  "dimension": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/dimension"
  },
  "display-outside": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-outside"
  },
  "display-inside": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-inside"
  },
  "display-listitem": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-listitem"
  },
  "display-internal": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-internal"
  },
  "display-box": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-box"
  },
  "display-legacy": {
    "groups": [
      "CSS Display"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display-legacy"
  },
  "filter-function": {
    "groups": [
      "Filter Effects"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/filter-function"
  },
  "flex": {
    "groups": [
      "CSS Grid Layout",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/flex_value"
  },
  "frequency": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/frequency"
  },
  "frequency-percentage": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/frequency-percentage"
  },
  "gradient": {
    "groups": [
      "CSS Images",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/gradient"
  },
  "ident": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard"
  },
  "image": {
    "groups": [
      "CSS Images",
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/image"
  },
  "integer": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/integer"
  },
  "length": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/length"
  },
  "length-percentage": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/length-percentage"
  },
  "number": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/number"
  },
  "percentage": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/percentage"
  },
  "position": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/position_value"
  },
  "ratio": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/ratio"
  },
  "resolution": {
    "groups": [
      "CSS Types"
    ],
    "status": "standard",
    "mdn_url": "https://dev