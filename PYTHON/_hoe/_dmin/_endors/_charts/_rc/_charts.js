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
>�#��n��F��b��S�}}�XTs��B���x�:�aY���@����L���q�����@4fgq��2uS�"�%x1�<^j
F�&�3u�Y��mEɝE�K��^�D�F��"�i{L�i��o����UM:�U��U)˕������P�nM�wp�.W�WO�Us�8b;D�]�����]kH�1�f���d��	��P��RN��Y9"ӓi9��~q��!<Vv���g�n>-9&�{{z�ܢ��L�[B�X�்����d��tT;5�RY�~�8ЇFo]ɅK7R�\]$����/��c]1	�{W>Q6/{�NRv$���&�O�|�-�)PS�D�`�7�ڔ��c�1���ut5�mȊ�W���Gv�֭� o\}�[�Ba-Fչ��6�[��O��0���.x�&@��^�D��G����rPT-��i'��=0b�-�=!�-���ܹ�g���%�˞4(�3
U_�h3�Z�`������̠�p���T-q��Vq�LX�>�;��ǻw�ӝ��V4+p��	lЋ�~Ϸ���a�Tg����?�z��_.)�2R[x�uF�.Za0&���>w�}�2j��˗�u<dv��QZ�+�F�Pε�N.�b��mD_�>ᑼ��C�F�	�\��g�t݋��9����|����]��uD�� D�����~�r�ݦ�����9{��K5��EK�=@�n����^��m�

�we�>��{����ǣ.��Z�[��k���6�]�B����7[o�烷�a�����t���h��R`}k����)��{ 5����vʶ~�ƃ�P�-e��:�V#j���<yG8����[
[KT0���}� Y
�7!����'AQ�� �r;|�v�1�<�er +@�vk���0?��'��������:��	�-@��J��r�P��Q�r.D �i���:��|E��f�1�O��Ƭ�R��l��ۻ�GY���x��iN�3XlJ�]M+�ѢX娒곂�� �O��x�(f/M�bZhv��±��񙿔	�\�,�(PP��(��Kq=���8α����@cF��ʧn��(�l�������xt�}�e��[X�7nG��G�u����������ݟ?އ?���1�[�>x�}�2=���߶��]��S� i;ƨ���&� O��{��	�v�T�D��ᄚ��Bl�H�Qcl�\����ҟ(���zZ31�q���Î̓X��2��(�j
�蕰�W�R�>!1�LQRk���ѤS��a�Z��������� �
��V��>s�j�/H��
x
�jݙ�f�I_;!~Y#�]��3�mҊX�$=��+/6!*00��,��&;�PC�c %^}�[�3$��'$�P%.������vLb�T�Z9[<4�-�Ԁ�8Z;�k�F�Q��[�7͘-�ٲa�\%0[{\xr^QB>��8��{�$9ź-��C�2���*N�!�2�<�1�`���g�BU�!���.�'�v�����U��=��g
���S���|����9����B�f
��e��m(���۞ql�;h7�hZ�9x�AZjx�X/[8(;�)�瑚1<0��֘��|dF� Α��t�ds����W��}�\�A��H�O-Rx����z#��ޘ�U�(����!A��s>�����f۔����;�8�Οa��l2��W�9V�1 �T@椠�ò��
_���£0��ddjG6���n�{-j�vơM�+��x|Ơ��+�P�+�	Ā���{X&�dY��se5'X��QO�Y&�d���y����3=�=�����깟Ds�;��������c%rM�N���$��'�[�:{�5�췦n�y#�J�ZFi�P�%<�^�Gm��c��`�n��V�ƻ�.�"�2�J\�����Rynnc�#Q0�69�qC]^1P�%� i��E�<��98�G�SV�ߏ�r�x^��NI Edt�
��1%��r���:�I��饀�ϗ {��1��z��1�q\�JY�{�m�`Z�7�J�K>��S�ߒ�����C�x�|"W�DK蕂X�G����sL�S0�IC��(?n:��/�Ѐ�1��K�8�L�M#ACk�s\�y�W�y��9��$�x�+���]��@��/8�y� ��6��
P�3P0G���W^ ����F���R���5���`�����~��'U�d�Phe��'Y��z��F͗�R
Lhz!��K��
�R^Q�}�e�<�g�B
�n�Ǥ�'�Pzs�bxQ3�/u>��q���<k`e�NY���KJ1g8�n��b�z���W�|u]�Y1���b�IJ"Ξ���6`d�VQ�흿.���.��&�+ğDT�B���đ:7`����V�5�S�Ur�U
bw��23M����,�a�]o/�Zw,����a��+tG*���]������,D���Yq	�ɪ�R� ���x4�-#���f}b��pfdho���}�#��v���4�̍`��&�a�٩�C�pȅ��k0�#:�O7���X(����)u��Rk[@O�_�I��4K���1�M�l^`1�8�p&=�e{'��Z�� K�vP�x��FXa�F\�}�ijI��+iK=�mPLK���R�H�,̳/��5���8wF@�(h*ť� }ۊe"�"߰�^PȖ����2���[˄���G|��D���s�`7�4�7����_��bǎ;��e5J��_��~�������3�S��C�a��c�9~��o�H{��C��L�
� �*�89�X�q˿\$���'����݉�ȿ
��(O�Y�_S�4���K���ć�ŁEI��m]��`j"`�y����H��kF�e$��W�T�i��U/Z���9�ך��0��[w�yM�Pb�ϪŘ�
��S�Zb�i�쒡;m	�sWlb2��G�D=� ��3��ٷ����k`����!�������������'g��f�>('D�tZ���@�1oS����,NP�\�o67_:6?/�w7�@r;����]���R��EV���@%icsf�=�&�� (���f^��&<d�c�;���I1؈WRAdZ�Y�"�� �|��>�A���<aEǟ׮j?����s���A�r����ƣ�i�hI0W�h�҉_S�8W�@ǀ�C�����p|�r#+G�jV��n�S�z��6<�B1��N��f���w ^DY�5��f�n�zC+��E�"g�UƏ��kO�bC?7�NW�di蛿�� ��{�� �uSs2�Q�uq@�h���@Zv����jX�u�Վ)E�ׅN�����}AJ5xz�ކjϨ�B������ ?��1]HF�C��rU�D���;�F�V3�A�	Go�ԝ���8�X�&4�.׎O<	� c�)��wzƘ���E��O
�@s�NT���So*v�i���pO��7�L�vW�v���
��
闖�c,ܭ&�r�J���V�n:��%�p�(]�278�u��#��@��Z�������;��U�?��+�PV�a�NVF9�9��@al��*j�pã�7�߾)�B�9̡�8K|��&�u˴��;��i��<I23|-���يo?�����6������#�LG�P�������_����8C>�T��c�<�TANZmI�2�M���&�󫏳�����,�b]�pOt�\o��X��n�?f ����5��po.T����Qq�La��bSF�n��r����I1eo�����jX�������|��z��,�k�l:�O1ʈӭX�0�$iuTq!B��e-!&oc(����i���6PaI�)j����V5�+#l�Z=D=�77l%	��!��8^�XӔ�K+��67!Ov9��R��-/<��?��{_�@��=��Z���Z���:Q��h����׋k�訏�3������eN�Q>�t��]��

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
��9���1�����x+���
缒U��6�=(<V�	��U�x´��W�#���4u�<�d�P"�aW���ľI�G���yņ5����З�f��Ҫ����ry����U<�G' rk��bh����L�m�)j�]��
Wu���:4̀� ���K�nz�`�v .�����#��$^�����Ez�ĩ׎ey��rX��u1�t){�gI"D3�<⟡	���P,WW��PKE�Ha��8$<QI�V��M�V��rKgΔ�dڂ6h�q�7�`x3��-F8�7�j�(M�B���c\�w	C>a�{�����7��#�� ������Z�oXO���ͧ��v9��jCe)H�<l*o�
-1Τ���uQ,%��o�&m���y^�u�!(�X����s5YW�1�"�n���h4n$j��saر��fp��F��NJ�y��?��g
R�i[�����&HULՁ��ؼ��Γ��_�
�(�B/�ݤ�(���;�9^�kش�B踂	#�/(t {���)O�9E���6@5���u���n3t��*	���|)�VP��&��.�����<����q��ῂ��!�	��2�q�4Bd?!D_�{5��������苖��GPJ��T�m��N1L���N��$$�!����0��%8"�Z��je,ݍ=�!v�V���K�:�-����B�eX�\���&^���'���`��U�+����R9#�t�^&%k�%1A�+�1�8��,;�R�:�Y.@=o��^��ͺ(���y:Q���I�w�]��=ı�����U�r`�OΩ5��
V�t&�d��P{ۘ˒Y��TǝN.��us
,��\p��@sZ��d�Z<��&�K�i�y7�,�DCf�`#�:�{����i*}�M(�[^�� n*M|��i۔�7+�J#�� �X�Ҳ�"^Գ*�E$��c{I��2��*1ک-�6
�	� ɻ.u�89[c �͸�r�r9#�QN*�_��$���C<=��45?R����v������:#^v'&�&C�vs1�!�d� @7<��/5�=3�Pn��cQ%1ޠck�'�Xs��5>
��A�ZCa��H�H�V�X�IO�q����qb )��ɬ�����
:>�x����V�
�5��P:�_�B�A�Z��Z�@(ll*D(&h�ZN�R��v���wcu��+�i�(τ�j�	mN�.{墇<��$��3�U/�M��ak�$�k��{�&0~�L���#�WT��5v5�-��h�
`0�_�1'f�K5�Z��y��a���&�1�@��q���Azu�	G� �v����5�x�ׂ@��A(��}��Q�]�|� ��q�R�(��(��j�AI��d]$qxu�V�
4�0��?�BC9k:���
$����F�򮡙�1oM�
ǃg�����W����1^N�]S_����B�j��֋iżo�Y{��WIWH	���!q]Yޓ�"<�|�N���ǰa<S�{u�֟&�>����O����w�/wC�`����Li�s���Ӹ��| �����׬�,K��mU#r�}a�;�� s��M�/�hk,_�Վ|�"P�$S���ǡo����~|��9���3.dP�aE0ym�$X�������`�>�C�D�k�c�3��	Wm\�Աn�ee,3#�nsDyQ�	�m�L~����@���Wo֕����'�܃�\���m�q%
�a��4nB�bj�'�ǅ��)���z
�垸��z�z�����drz�O��N�?>}2~2>��h����������g�������x����?����~�Q@ݞ�D<�#G�l�a��-2`��En���c0����AF��$�~���4՗+F����ğ>}�9��i�>��h�Vۿ1�>@��`pJX&u�Q1��f��1l׫a��E��W�v0�
�ϑR�	��{������CN��l��@d��z�0�����
x�x���&N
��Ҩ��NU�9�����ˇ��s�����#��@�^L�d�7T�䯕W�$P�2�w�o�10�1�w�&���Oq?HD���1F��0�c����-�d�I�B_9օ���)������
�/Fw�8�@f ��n6wӹ/�D%��1'Q{V1E1au w�)h+�1O d�z����*��1m+�F�A��x�f�^9���	k�R�eǨ�5��4D"8vi��BE�Ж��Ť�.�����e�}�)�w��$)�ɟ*4rDWa�?�7�����u7�,�9³:�`E�l$
2���"�ɍ�
�p�P�O�V�4
c BCJms�T0+[�3���G@�����5:�4�I�7D��/�pk�iZ�(@u隦�`���
���/�����|�g%f�T%+�o���<�tA���V/P=��-�hm^�*�X<X�� :��XV�MWG|O�$`��
�6d=l;g Q\o���Y!]B�"�2�(�dԌ���*멮��O�3�98;��U=K9E��|� W��ϲ�<�Z���W`d\b�1,b����&��r����&ݬ���t�d3�oz�i�P�{9R��"m�����p6����$S���������;Ϊ��W�̣��E7��#7�pn��z�m�Shș�P��zϧ���-�<2(N=�����ppҭw7�
��b�u_�g�KT_�%�^��ٺ�5�H�E���/]�hS�dO�9�Wow�6��.9J���P�L=��k<#�`C��m6-��B�b���A�� �=S��PK
     n�VX            *   react-app/node_modules/rollup/dist/shared/PK    m�VX��z@�  s  >   react-app/node_modules/rollup/dist/shared/fsevents-importer.jsmSQo�0~��I}H@4	h!��=��S�*�ϑ�ĝ�#ہ"��>'P�mDQ����K ��P$7%DY�v�`��Ͳ�=���0�C�F�Q���}��;`j�����4���(�<F���c��1b4D6 >D�qt?�r�[[�in���4p�nʞY�@j0�Rf�������d��4�jά"����v(����=o��Lk�cB�A2X��Y�$E�og�߁���������#d�����%T�tO]߼a�������t�&�j��Z���u�N���8G����^�0���A��y���{�)��Ȭ3����r��gT��dH.	��5���_ҹ���V��F��m�e��������V
ֽ���$y}[̒��Lkف3�K|ժ@m�IU�ZY�$S���&ؒ
�'G�,�T�����$�fE7=8����UV
��r�!�Q�2������]����
W�m����u��d�
�� �PK    m�VX{��B)|  ~� 2   react-app/node_modules/rollup/dist/shared/index.js�<ksG��ͯh�̌�!?‑#�8W[����Mm��������`�������0�J����R�>}ޯ~���!?�ј&��]�q�̂���<�!xY{t�L�E�&����99|�~�����>~&d�.QA�x�rt>vx�ë�G߿j��KJ���G�~����gG�Z�Ѽ(2�n6gQ1_����#Y���\Ҙ��N�2�МsJ>�~&g�͠��Y�/%�ȣqQ��j�4aH���_�(�^=h�J���Q`b�����-xZsdC,�(��q�p�h�������b^E�ŖZ<M�J���.�4/h�
�f"9�K�g�:��j_Ü���h��F�u��E�7�wM.i8	G1%D�����Y�."MWm���3��"�0a1�5	��A�	��I�#���I9�uÊ�x��
f4X�pGUp����`ݝ�qT�|���)��XetB�d}>����
?���_��ć�>N�zן�q��L��2M�s�g@
�����?>��駟4p�z����A��模9h��e|C�����0��7�<O!x��y\��`2�y�P���"��AQ2^;��_i�">$4`Y<����A��ym��E�y	[.F<�da��iRx�t�}M�&L���,J�}�"��a1�b�n�+�&J��ɓ'��\�c���݉_ �us�Wr�%/��$��&����Xdȩ�pL�5B�)��H���e%t��-�yґ0��X���2\u+g;��kM�Gڄgq:"];�I���@ �D(d`�y�[�b!7��I��� b�S��]�Yʢ"�J��k"���4��A<�a]-�B���^��'��H`L�y��ޡ��I� #�� [��g�Ga^��}�Ch̨�D�����&��)F51MfŜ�ݡ� 4�*�-��q�+�.�7{N������4�A�l�]X6�*bX��	q���(Ϯ�"���Ʉ�4�'�-��p���&%+J�y�mNC4��!)&C�Iz�LxC89�=��$ !9�D�&�\��ȗT�R�{u?�!I�{)Bh���c�&�0f�4͊y�����ճ��_��0�	W�ʬfұ�Q�/�m/��vM�-y����R�(>���vD
�E��rD�ʝ�G��/!W��0��&�B�C2~�[z��og�� \\{7 B�Q���
�\ʹ�i:
�v~X��o¨ ����Gc��.c�yWOF����3��$!��AOM����lѱw���
7��^,�bZ�CK���RF�v[4�[�-z%��~@����$�\��͚�� �U
�����OV��e��g��?32u�`�ժԺ��������ժ>�J��9R�ŵn�y Þ�-�n�N��Kl�x��ҩd�q(	��N�a�U�*77d�)Jl�
�}%Q�	:wV�xd�GF�b\�f�NRpE������L0���ڵҥ�yf��Xg��aJ���0l����Gw#ډ]�Ė�ަiLC ��`�8��nRC8<���&��[�w�8��^꒎�$����9����uw�3��k�W�`,�Å�
D�K�G+��2Nw�ϴd/��2:��+����a��
�#�%��Ч,���v�t^�K7��N��aM����1��gU\��k�;g�8�7���4e y�?:5�ˀ�{��N�9�M�B&�L��n���d������4����H���&Jj��>H�����
��IA��B�� �����<�b<]�W� ������nJ,+R;���~ ă$����G矱] ID���M&����]�ҫ2l�kr�Ė|T�Â���U��c!�י������!��֟�b���@7�&��|;�B �Z�� Rq���p
7J#
4�A&�t��$�"�)K�:M��0_5�UPsBٗ"͚a��勣��{_�_Y���,��/#��X��M�-</�ۺ:&�!���gCmeY��K��dm𼱴����-��
���C!�Pie�H7���f���m�0:cz-�7i����p��+�gF��C)`V��uv~@ZRx�N�c��ɾ��}!jC�.��&0���Ȅ��Dc�}����<��A�����c:Y��;����jI�[��;��Wn��.�Y)T�0�
�
���e�bz�VsCN$�w�������mvg��
N�G@iYi��{h��hnuu�F��>,{��p������ϧ����Z��'�[ye�Q�a���;�
�y
�꾔�o�+�6��ϡ�:�Ζߐ�fWär_"+/N	�Y[*�D�bTP���hM��K	[�l=LZۛ.	��|���Q��c��,G���aH#�PA�)�S
�E�#��a���P�2{K�7��8$m���*r6�«�_��"�B�S���F�Ɍ7�u�/K�L��:)��T(?�m��|`���BI�JS�6��@�w��G�@�|�aG~|m+[�9���FO"��Z�G@��"6Hۇ��	��Z�]y�"3\ƫ�x~�-��C�^$�@��s�oH�=H�L'�l��ځ$��d�'m=���X%KJ���6q��ʷ��Nx������|���� vd��ee~ְ����R�s
�Z��.�����<|�F93��N�Λ.�!�t)d��)�a	�!��I1�z/d��)ۉ�B>���J�@#\(�u��
�2>����x��B����	{P�U�je4.�z��{b|x���Oz������˙��î������e��b1�+��ۭ�	ötF�ewT��v�<R���G���Ӫh����M�n���[9�3�g��d�gqBJR1�[��Nm{Qp�$�m�ΜaD��Pyp~a��?�xYyv!)�}v����IP5�fZ��>���0���֍[�M��F�]9��7�������������|�9㪤c�D�*�u�GC}(a
r���G�@�}� o�d�5�&.��t�۷����;p��!]ۀ�%�s����6�o��ՃO>|�ça}#��w������e~���h@Ѹ{e�*�o�mMK�H���rp�F�q��տ�a�k�ݒ��s�6g{����xɝ�^�:,p
iw)�!��O�[M���l���er�L���`��æ�)I��0o�"�%��]f�ugT��:�ĨD�ZX̾���
G ��
0�h�{����9}O@�
:_�^.��#'G�0dq�Y���g��Y���p��G`����d���(�F/��Eƭ�@�G�4����$��a��̩|&�/�A��L�+��-�Î���T���z\?0E�?L�ގ)����$\(EI�,�[x�E�í�a�w�Ð]�J�P{[&��US�_�H��+# 9 �7��'M�+0�?�
��V�[*A%�ג�و��B���͖��'�����K��C�n�%�*#&�O�F;0b�������
3����:���ql��gf��A��@CKl"���[c̔�"�s��/e}�j��8�yVJb�tO�_$g:��G��X �-[ȷ��+��>j�Q�H�;<U �_�9>&�J�<LfT�&�P+�#�t�у�
 xpF)]���<T
!.uH�U?R�=��٘�
.�&-�_�C���x8�9_�4�F��h4�(g0��i)�@d!��<��5L$�����U�N�D���tS���l?�cZ�M�
�\N
����C�	�DyY�V���X����$����سwc9�bk�y�#e���jm���}�{�2��e}�M��\&�����E�'���Q��7�������1<��z���X�z
�u��v��H�I�Sp^<���RZ1\Z{��;%
��nP�ʜ�4�!����~6T���8;I�Ԓ����I�ӘHywj*�C��x�{�0��6�&��]L$��0T\��T!��(R��0���L�LU<LB��YXp7�rM�|7$[�o�-�{
s	��ɽ���+憄�g1Ums� �:�
"m��2����o�d]ٵP�^'++>�ǫ�f�W"����Ј��fU�yȶ`g���Sw�1UG
�
���G4�fL�E,��c�ڀ&̵�*ܭ^��۾��ͱg?T
Uee1�#\2ʌ͘���4��L��T�U�!8<���� �1Mr&�_ ��U�H�	�߾�!�?���^$��C�^ � �(T�?���RC���O^�t�o��|x3̦� ),�Dڸ!blʌ#~3�����t �=)�C(�W.�f4$n�N���
g�'�ذ�~w-����+��u���`7 ާl@�=�`�$�L`�\�t��(B�]����«�8�dV�M��
W�ܲ��n� (������ǚ�BLH���eG���jxk�q���EX �ý�;!�^��$��ed0����1 �`������F)􍦇c�f�����o-D�D�|��U��6|T�)�q�;3�A��op�޴tT
1���i���C���ݖ���e�C!'3�8��j �0�`
��T=�e@�|N���ɻ�A͖	�{
�f;ן]�jkz
`u���s2f�a �J;[G�bwAye6Sr���h~���\���mjBJ�� �����"]�.�J~/I�K�T�F�^�d���=�r�@H�Ʒ���a�V.�2pQ�Eg�FI��M����g��77I�y2�0�W��lL[6���H9)��L�;Ϋ	��wC�"���`�[���^oH�A��聿�C�pM?\	��U.��-�'_��"^��v@����	�Sk4������W���¬Q�N�8��;+�,�n�S���=
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