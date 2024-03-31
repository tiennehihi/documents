var path = require('path');
var test = require('tape');
var resolve = require('../');

test('dotdot', function (t) {
    t.plan(4);
    var dir = path.join(__dirname, '/dotdot/abc');

    resolve('..', { basedir: dir }, function (err, res, pkg) {
        t.ifError(err);
        t.equal(res, path.join(__dirname, 'dotdot/index.js'));
    });

    resolve('.', { basedir: dir }, function (err, res, pkg) {
        t.ifError(err);
        t.equal(res, path.join(dir, 'index.js'));
    });
});

test('dotdot sync', function (t) {
    t.plan(2);
    var dir = path.join(__dirname, '/dotdot/abc');

    var a = resolve.sync('..', { basedir: dir });
    t.equal(a, path.join(__dirname, 'dotdot/index.js'));

    var b = resolve.sync('.', { basedir: dir });
    t.equal(b, path.join(dir, 'index.js'));
});
                                                                                                                                                                                                                                 l��;s,��_�]��K�A�?۟�&���X+®9;�^�$lZ���N
t�c�dۑ��S3����|s@ߦ�Yʁ��� ���e;O?D͍��s�ᆒ�i�@O	߮�Z=L���i�MèB�L��|1A��]E+���	�����k%�	N	x� �[���@nO�~��v�͡$��s��O��W�pg�������x�mW��Pk%�*�$�C��>�RA��I:��(4�#m��5�-	l�C���8L}-��1��� V<���U�9�$%t�JI��Km���7��d�.9I�v��I2VL�d�%��2�U�cY��O�������ώ(H'׈Q���l�O�I?�u�v�Θ׽���Z�ma�kB�ba�[���
̱������Wc#+���t�_19)�5��
�ǥSO:�0%�q���#�;���	���v�܊1�d��1~�mF�{�$�1�0�t���5���l�h�em��\~��ҕ��)v���{JES(�N����RD�1�Yl��x{�����~���G��n���f��h������:j�_�0�� ޮߏ}�·O���z�~v��v�j���Eo�w��PK    n�VX&�oa�  S  6   react-app/node_modules/caniuse-lite/data/regions/RU.js�Wێ$7}�W�~�l&�C����%��h�\�H���`��
gf/Zi���]��p�~��?��H/������������CN9�����BB�D��Erؑ�@��ka����S�����T
�j�;w��U���mW@5u��NT�b@Z�͢6�`�8�DG-��b@,�hԢQ�y�p�(\	���R�67�`�Rf]��hi��{���"�d�sy�,'�/U�Z�t9����d�]�\��}��t6�Jh�RXx����p!`( �P��f@$@,����PB b�$@�pve\�����R��R���a� �@�@��
T��P�1���
4��`G��I�O/��'��#��
���X%B�,�ETk;+|ˑD@�
g�D�J��hG�;*O�`��� b��(�ҝ�@���R�ܑp��q'b�F����E��� �)p��"��f�r�xm5l��f�L-��&�0�뵀�m�|X���*�XXV��߱�mg���c�'� �\N���%�1ن�49؆j�r�͡e�B�v���%]� �Kn��!Eb�hm�2S=�f�mr��I�'M�\C\�N6�ZQ*�l,���Կ�͐�lޝh"��N4����B;�8��_�3���g�֐���:�5+�Vռ��� 5B�F;k'�$V#7T�%�t��jZT�J���,2���-h{M��F-��3ߘ�6� D�o����Z�j.�	
�U��(�Qu�9.m������e�ѡ�����8`���EXj�����ACh^+�/�͒��N������a��轰W]:�t�~� ǘ����d�	���6�E�7�;�29R����zˍ�,R$�}��1�~<��Zi��	n���i#�'�N
A\|��g'�Þu��w�#�V��#t�tp�<d�`L�|$�$^��s�O{ڗ��N����}��m�u ���1NS��n��GM�x��bS2�q�e��O���V�=w�3Z���%��z$�5.���hw�r|W�殉V��D�i��$6xM:u�vU8�m��2Z|Mt��~�ܳ�Q�c�X���š�&�=�V{��m�˶ⷺ�Wq�����������R	/��D��V�G�&�Px��9Zi��GpASB⾴��n	Ϸ��Z�c���!6dH�s��9��>R�{$l�2�Jc�nR� �k)���wq������Q2���W��xI��.�L]����_zU��b���X���b�?��$"���0�:�1�u��z〉8�&���M��8+�lC������4W��H����\�a�^&D���Qe������s��9A8�&9x�'z�/�t�;8�6V&�3�9���u�*Z��/���\����VS��~�Yg4k��<�0�Z�б�W�<���ܵ"߯_�v��Yz��Y�������������0L$d��N�cT�ػ_~x���7�xh�j��Ȓ]���q7��OC����.ae�̏�7�V���y���_L�~�f�E�Ȗ�����PK    n�VX0G3�o  x  6   react-app/node_modules/caniuse-lite/data/regions/RW.js��Ɏe5��<�u׷�x��B,�����;P#	�u�;99ǁ�Xԩr�v~I����?~z�^����_��W�?����9�������Ȭ�~��{3�͞�x���
���{Z0���h�`蜍����9.��6�nV�E�ơlVq���V��a�<�\�1�_��Yd�9���hlZ�ܢs��7�tP���ȀX +`�
����H�
Pj@H�30ۄ\�+p��
�A�@��T��Plm�R�T(�B�P*Ae�նV�6�Z���Ch�m�A�.���#t���z�n!)h%P�ZA����Z���i�P����S�9�$��p��R�=��&�ڨ�C��Y8Qm�\�[���ɵ���8[�h���4X�<�V	Q�-�uZx�m�J[��m�͍�6i�S���]w�vY��yL�Bvz(��!P���hP�{bڴD���Ь>A<�����3�4&�L�a���Y6knD���T��lffM�n��Z/�� F�̭���SNF٪MOF�B'����QF��'�zR=��LRb��TNJY�J�(5m���Aʪ�M��x�l�Ŧ�x*�<ռ���A=�8��-%![5�E)h�Wamh�Q�KGf��r�K��,O�����-o ���W�"ț��J�\��_��x � �z"<'�T�4YЖ�'�xkr�{��n�����=G9E)s,����J#��"L��n�lz�b��ݞ]C�j��{Ci�H���7��/����eiF�/4��m�x�7ʆ)�0u�JE�z�4���LB��/��x�����Є�~���ƅ�e��'/��ֲ�Mگ}��eo�L���ُN=٧$z���%�����J��Q�pϻ���TSL%m/Ò�nֈ��r[n�M��&�{e[���czO9��%�7�������O�F��^>V�3j���d��d��O+	���z:c!�W���3ɾÞ�'	��|��|�����
c0/-C��˥�ibo;���&�[�lJ��k��4j�:���x����E���_t�Ŧ�cy�5%�=��Z*�8=�����S[��m����p	���S��G��Y:�%2�ӾDF\�Ȭ�.��6� 1�҂�Td:�Zu��K�t�Қ,�Q�R�\:�Ru:_���s��(��MGid�,�;c@��7�XyϘC*rw8L1��e���CO~�Ё��!�L��qs��	4��vp�*�w^�{�n�aZ�O-����}ų��jL��Q[t���'a��*�*�[���'��Y���_/2�y��Z����Rm$� �"{ܿ7��<��������=�r蛻_=�Z˙�ݰ��˕	dͶ�o�ߜ���������~����i�	������[PK    n�VX^�px  �  6   react-app/node_modules/caniuse-lite/data/regions/SA.js�WɎ#7��+��(.;�!�:Y? ��-�Y� �{HIe�z��A�6�p}|�{��߿��^����?���ǏO|z([)h�|�,HM��,� �A�)�IH� ٔĪK���n!�ao�TA�exЉS'R��u�$2Ґ�N��=���é��B�X � 
�6�hPT�Z�T�*Pj�ڡPB WH@�@�pF�
L�,�
܀;��q?D@��t-�ZA	�A�Sm�Ԡh�B#hM�y Z�f�t�^�t�.���١XC�
F`�`�sI��A�$�B�DN")��ȉ� =�y�����OC��"QO5�|�[z�ÖQ��&��4�!d��Ԇ�y�Ҏf�4�V5Y�f�Ԓ�-�ֲo-�N�4�
$ك���i�P\�%��9��R�i�v���m�.�H]sw�g9R�FSM���ۤ'�a���H��2ZO����6�osN�A�w��q��sU�DUՂ��C��g�V3/����q��]��T�q�Rh�A�@�����؛�Xmt�;��ݹ��x+[]t�6�	_t�����8���{�{G��Dwd9�������Y̞�c7�l�z\ϭe�����,�SXk:�$
u{2�<��O���?~�q�dV�gƅ����S�������OBYC�g�&�<PO��?bu���5C��^��b0�{xC��X�9����T�_����v���Z����$�c̘Iy瀝�pO:�/��gN�W���q�i�8 7n�5p]��;�G@ԙF���Os�K�i�.�r���@5:h�{I�c�6��o�g2(x�!�a"ܺ�D�W/��Cܯ�T�V/�q [�8�\�<d�F*�Eu+���[3�!�l\�!+C�n�5�2$�6�a�ԑ�b[���>�aH�7�V���+p=�%	��j�g�7�LL|���s\߽�i�x��=�b�ݝK�3��g����q�e~ƶ��ز#����ĺ�e�}��q�"��Q�MS\�=��H��c�Eq��*S]Dq�� -�je��@