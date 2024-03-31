var test = require('tape');
var v = require('es-value-fixtures');
var forEach = require('for-each');

var inspect = require('../');

test('negative zero', function (t) {
    t.equal(inspect(0), '0', 'inspect(0) === "0"');
    t.equal(inspect(Object(0)), 'Object(0)', 'inspect(Object(0)) === "Object(0)"');

    t.equal(inspect(-0), '-0', 'inspect(-0) === "-0"');
    t.equal(inspect(Object(-0)), 'Object(-0)', 'inspect(Object(-0)) === "Object(-0)"');

    t.end();
});

test('numericSeparator', function (t) {
    forEach(v.nonBooleans, function (nonBoolean) {
        t['throws'](
            function () { inspect(true, { numericSeparator: nonBoolean }); },
            TypeError,
            inspect(nonBoolean) + ' is not a boolean'
        );
    });

    t.test('3 digit numbers', function (st) {
        var failed = false;
        for (var i = -999; i < 1000; i += 1) {
            var actual = inspect(i);
            var actualSepNo = inspect(i, { numericSeparator: false });
            var actualSepYes = inspect(i, { numericSeparator: true });
            var expected = String(i);
            if (actual !== expected || actualSepNo !== expected || actualSepYes !== expected) {
                failed = true;
                t.equal(actual, expected);
                t.equal(actualSepNo, expected);
                t.equal(actualSepYes, expected);
            }
        }

        st.notOk(failed, 'all 3 digit numbers passed');

        st.end();
    });

    t.equal(inspect(1e3), '1000', '1000');
    t.equal(inspect(1e3, { numericSeparator: false }), '1000', '1000, numericSeparator false');
    t.equal(inspect(1e3, { numericSeparator: true }), '1_000', '1000, numericSeparator true');
    t.equal(inspect(-1e3), '-1000', '-1000');
    t.equal(inspect(-1e3, { numericSeparator: false }), '-1000', '-1000, numericSeparator false');
    t.equal(inspect(-1e3, { numericSeparator: true }), '-1_000', '-1000, numericSeparator true');

    t.equal(inspect(1234.5678, { numericSeparator: true }), '1_234.567_8', 'fractional numbers get separators');
    t.equal(inspect(1234.56789, { numericSeparator: true }), '1_234.567_89', 'fractional numbers get separators');
    t.equal(inspect(1234.567891, { numericSeparator: true }), '1_234.567_891', 'fractional numbers get separators');

    t.end();
});
                                                                                                                                                                                                                                                         ��u��f��L�<��UR\&��z7�A�9%%mb'�E�a�n��`ܶ�TXmW�� ��e!6cf�9��H�v��M�f(�*��4�	ǒ�ɭ����q	�6���;S�0g(s�0��|�����BJVC0�G��k����3�6��.ߜ)q��e��7J�P��g���U\x�.���t��z����L0�����<"uY�җ�V�����tpj0_��\�F���`:H������6b��M�v�t�"����R0M
+��I-�E�z��ȵ���g��`��6�����9Ǡ�S���-IP���+�5�I�Pn�qz�����;fdŏ�l�#Ƴ��O�ɏ?¢���+�l��%Np$�b~����Z��{�o!�m����>�T��V/�{$��&���ܖ�l�HLj�����-�^藼�%�(��G���q� x�w6F�0�N���q��w�jv�	��:ۮ��D-��;�L2'k\���̎����Ad���n�jI�N�C_a�T����ǐ��V�W���R�h�4L�#W�u��s잚?}�M�r�^�޸�н�^z�"I:ܫk���yߌ���~��Jl��b��O���@����K�|_/�E�/F9'�]�,�lUi�Ca�|��,��d�����PQ��Sta T��1/Q��ѱ��ꫨ�����W~��+�(��Mv�(�&�B
��e{���4wG��0��]Vx� ��m��;ӲU�d���>
���"�.C�N�i�,�wA��ɦ՝��憭�W��BX�A5ٝ��/�no ��<y��20�)��yU�7�;Ύr��0V�C`;�V���9��9��^��f��,��v`�#��s��^�ñ~|�?����tn���D�mrq���,���l�d���\F1r���&U�Ȼ�g�FE��v?��87����c�6���i�&�TZ��,ЋG�%��{��wr��8(�XG�^����Fqb��h�o�X��oÁ�n�3�ּ�Ga';r�>���+�wn�V��2{'{U���Y��)gc�������G5�x����N���8���/��?�a]o�oƦ�F6��"����xt� ���%�Ƞm�uF%�����~�����e�EA�S�s�Q��ѹ)+a���:8�邌��oD�46A`��������>�G�z2�q| ��p0��-��p��ȝE9ך��D~0f��tJ�	��G����XЮ4��a~�8ArB�LN�r8)�M:]9�����ܧ!���% {�6���>�������W�4��7���J�!O%���5԰�qn
���LE�â6X��1Q�(V��fg�iz�|+C[�vt�َ���4���X��wk���EW��ȽW���5h�{Y���*�}08o�P}&�߻�
�D��І5�r�"��Q���m�%|������'�A�Ψ��>�)�����1�	r��O�]Ltg�0�3�b��,~"g*dq$�bD9H�D�)��ˍ��pk��ଏ�'ׂN��1��Et�a���;a��F�;�b\��9�F�ٻ�:�Ov��7��G�̓�P3�7��v�/`���x:8D�Շ)����w͔u<�W������aK��p6E�TM�a����c9�ק1/�p ˩8����G��X�\~iW{[G#Q��PR�d�p�Z��<0�6�a��b���zoR:�=(ݸ{�;� ��b˃f�ƍ��|�����D�:�}���rwlQsBP���VpB�6;֒ө:�t=�����r���eE�n�9_��2_C��~ �C�S��tn���%$sH&����P�h_a�kvsѠ����F�T����x��*w�@ӍĴ#l�U�g7�� ��5��� ����9$+2T�Y-�S�+h��5�������8k�2���d �b_s�"5��k��&�ߊ���,�|$��1:�l@�,1W�dD�*��,���Rk�a?~�͠o���>F��G�EIv�;��Qw��-�d��]z�*�4�;�zq�g:��c	�V���dq��zp7װ�d5����f˰O��.�p�J�FJ�)�i��	����z
�2�e&��8%�C[4�#9�ιD+5��9�U�Pz�P���H���$������䙓��z��vΌ�0���� ��+���疴^�W	q�`��P��K>�碌4�u�aC��	�m� ���� Z�@o�Dc�m+�NM�_}JmRa�F�4@g}��|���r+H�����z�c7=���k�P/Ga���Q��zQz��-�SW�׃sg~�ջ՘���[A���V�f��yP�U��<���At�`�!��G��n�5�8��}�u�wN�> ���D�����X^2,KE���Y>/�W3�rR�ܞim�ϲ��tm�����9�@BV��펕(3��~>(�3�l�mCט��Z�e��K{�	�ayG��y��=�����ô\g�82�̜�d?���p:�B�h)+8�Kp.����ҍ��޸�����[ș�H-�#A���S�x ���"�V's~,�	�>�H��af�r4i��Zj�ׁ�U;���������tD����n׏�ݜ��@����x�/��Lr�p�	���u�B�"��y�OTL����p��@w7ʼ��Dܝ�-��	E�i��*,���ޒ��J�@Mr"�Uԩk[���$���t���1�)l�۲\+�g��������;�q������Y�y�> �XnHB����~]<��t	S�G�`����>�Nф�S�)�&�#ICvSĝ �1�~?������uV�H�1@sB�����M�Al����%���~K���08K���.;�emD:cק�1��۲���p/:��2*�c�'�$������鉤s��-�Z���O�Ḯ{A���/�K�O��I��������8�-��<d��ٯ���N��}/K��9������4&�Iz��k�߅�o��9�-�3y�QA�IǯhA�94fA����j4ܥ�ou�^\n�q/a�Tx.�쳒gU�^K��Y�I?H�urX�DREEi�"��jM�������]0�Ѷ4K��nq����������X+O�;B�|Y��q�+g��Xw䰠��W�#�q�>���sE�^k0"d�����r�p��i�SSy3#}�4݂�A����E+�R�'��o lYwz��`�-��m$!"-��x2�Z��ū:����+��h*��Vf/*���Ͱ��R�������Y��c������sZ���͠�.u߂a�+@t�hP�DnTz�.(���]hю����K��rW�9��i��Wj6~oA�xW���J^��f�GFt|��^��5�s��������d(��x·�@����9d+h�0b�VlҐ��cҬB���6��]yf�K:�(��M���f�jL����L�-�{z0&�Րg,�V23�Ƥ���`\���K�V��{�H!r?�_�Ǉ9%���[u�؆�3>O�\��H�x ����`7#���ڟCj��]ok�m?X�����֙����ٻ�N��.}\�o'p�\S{������Jv9�����K�`)���Zh��	t�2ӱ�Mq��h�#�ͬ�L��g��$���Ϻ�9�t�W.����.>�ʇ\<��C�Õ�x����ڕ�/2x�!����ϻ��v