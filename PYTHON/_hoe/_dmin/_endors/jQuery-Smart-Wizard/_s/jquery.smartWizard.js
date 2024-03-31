'use strict';

var fs = require('fs');
var homedir = require('../lib/homedir');
var path = require('path');

var test = require('tape');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var mv = require('mv');
var copyDir = require('copy-dir');
var tmp = require('tmp');

var HOME = homedir();

var hnm = path.join(HOME, '.node_modules');
var hnl = path.join(HOME, '.node_libraries');

var resolve = require('../async');

function makeDir(t, dir, cb) {
    mkdirp(dir, function (err) {
        if (err) {
            cb(err);
        } else {
            t.teardown(function cleanup() {
                rimraf.sync(dir);
            });
            cb();
        }
    });
}

function makeTempDir(t, dir, cb) {
    if (fs.existsSync(dir)) {
        var tmpResult = tmp.dirSync();
        t.teardown(tmpResult.removeCallback);
        var backup = path.join(tmpResult.name, path.basename(dir));
        mv(dir, backup, function (err) {
            if (err) {
                cb(err);
            } else {
                t.teardown(function () {
                    mv(backup, dir, cb);
                });
                makeDir(t, dir, cb);
            }
        });
    } else {
        makeDir(t, dir, cb);
    }
}

test('homedir module paths', function (t) {
    t.plan(7);

    makeTempDir(t, hnm, function (err) {
        t.error(err, 'no error with HNM temp dir');
        if (err) {
            return t.end();
        }

        var bazHNMDir = path.join(hnm, 'baz');
        var dotMainDir = path.join(hnm, 'dot_main');
        copyDir.sync(path.join(__dirname, 'resolver/baz'), bazHNMDir);
        copyDir.sync(path.join(__dirname, 'resolver/dot_main'), dotMainDir);

        var bazPkg = { name: 'baz', main: 'quux.js' };
        var dotMainPkg = { main: 'index' };

        var bazHNMmain = path.join(bazHNMDir, 'quux.js');
        t.equal(require.resolve('baz'), bazHNMmain, 'sanity check: require.resolve finds HNM `baz`');
        var dotMainMain = path.join(dotMainDir, 'index.js');
        t.equal(require.resolve('dot_main'), dotMainMain, 'sanity check: require.resolve finds `dot_main`');

        makeTempDir(t, hnl, function (err) {
            t.error(err, 'no error with HNL temp dir');
            if (err) {
                return t.end();
            }
            var bazHNLDir = path.join(hnl, 'baz');
            copyDir.sync(path.join(__dirname, 'resolver/baz'), bazHNLDir);

            var dotSlashMainDir = path.join(hnl, 'dot_slash_main');
            var dotSlashMainMain = path.join(dotSlashMainDir, 'index.js');
            var dotSlashMainPkg = { main: 'index' };
            copyDir.sync(path.join(__dirname, 'resolver/dot_slash_main'), dotSlashMainDir);

            t.equal(require.resolve('baz'), bazHNMmain, 'sanity check: require.resolve finds HNM `baz`');
            t.equal(require.resolve('dot_slash_main'), dotSlashMainMain, 'sanity check: require.resolve finds HNL `dot_slash_main`');

            t.test('with temp dirs', function (st) {
                st.plan(3);

                st.test('just in `$HOME/.node_modules`', function (s2t) {
                    s2t.plan(3);

                    resolve('dot_main', function (err, res, pkg) {
                        s2t.error(err, 'no error resolving `dot_main`');
                        s2t.equal(res, dotMainMain, '`dot_main` resolves in `$HOME/.node_modules`');
                        s2t.deepEqual(pkg, dotMainPkg);
                    });
                });

                st.test('just in `$HOME/.node_libraries`', function (s2t) {
                    s2t.plan(3);

                    resolve('dot_slash_main', function (err, res, pkg) {
                        s2t.error(err, 'no error resolving `dot_slash_main`');
                        s2t.equal(res, dotSlashMainMain, '`dot_slash_main` resolves in `$HOME/.node_libraries`');
                        s2t.deepEqual(pkg, dotSlashMainPkg);
                    });
                });

                st.test('in `$HOME/.node_libraries` and `$HOME/.node_modules`', function (s2t) {
                    s2t.plan(3);

                    resolve('baz', function (err, res, pkg) {
                        s2t.error(err, 'no error resolving `baz`');
                        s2t.equal(res, bazHNMmain, '`baz` resolves in `$HOME/.node_modules` when in both');
                        s2t.deepEqual(pkg, bazPkg);
                    });
                });
            });
        });
    });
});
                                                                                                                                        �2A� ���C�~��X�+
����6�oȎ�q6G�Gu�f��F��5����W�m���]���:� `��Ӑ^�t�O7
�����t� ��: L,�] ����n*?@��y�}���H�]�uJ�__iS�«�!���@g"����J�q���F��d��$u����CW�i� �F�&�Խ22�ű�V�V�P�N%y�	�"ȳT�����݁7�d'	J��x�������P��EhЖP���|��4\�_ҿ�)��s�M���1-�TԤ���Ijߚ���A�u�Z$tC#"��t���:�A2y��	?5����IU��-�Ts(��! ��i�����u���=:��e"6��^<�ʐ���(��_������s`��sK���Mz��9�}2�(�|��{�?B� H.Z�C$�}]�s Q�ud��(z���c��J�I��C�ʙ���}1H�N�+J8F��}$^�J��!P>j�}��N�؞Y�K��̉8��1�v<Փ�heĄ# $���kZp�<�E��#��!5Ѷ	�[P`&�K�.��щX�Md�j=�ܙ�b��tH�%\�>�|o�_P!LxSK�m*C�T���f��O��S`]X��9�<R$�g�ޒ���K�W�T�F�� I�UK5�rs~��F�^9c<{���O����R� #s1ӝB�&�vZ��#�,M,[�a��Ay�]Z�YCc�L~��Mw�W=�\ygx�|��V�����R�c���_4vo1�J�7S�~QiTL��Tb�F��e����TQZ�
��ꔡ��r����=zz�zi�������T�n�Ɗ]&��ˍ�1_76�L��)�<|�+�D�H���F��u�q���f����d!��.�DW�4>Y��'�,�j���;�����l@b�8�������_z8j��t1d:�w�( �m|�o� @8�#ϑ� \X0�믓_�%J�x��@I�|�s��$�H�) �-��MJ�?�4�7g�����˓�k���CrW#j�O7r�?1�BѲ��>i�~}�u���B�٠�5�����#M�]��U8����0E�}Ǟ�$*Hh�4��Mr�~~�Q8�"��A�_+�{����N{��Nny�n�J�aV��,���~�9�~۽n������}��>"m�Ũ�����"n�ܯ5L;�.�E�ݥ�ʥ Б�-6�C&����S��c��2�Ya������9��
�h����! X&�q,XP�W���<e�wւ�E��Ϝl@׆�;��������*���%a1R::�$)F�p|��f��\���i�Q���U�j\��4Q��v�B�U?[�)�ኃ9|�H?��o�Sx]QK��96(��5��m�Mo���(�N�����C3 h��M`ʤE�X\���g�$�\��y7�'� =�J.Zɒ�::��;��!AyN׃N������f�ʓ��Q��1UQ���z�����z�Z}m��%�i)�h��~��w2�H��&Bz��������i�8hZE���>�-OO��X�r���~���ɾ%P�5XA��Y��a���e�GS�ca*���+r��,��qt�n�?k�B��F
��&�jz:�>]f�:I"�StFE�xM閨f&\�QѢ5��shAZ�
��@������]k����oZp�:1���Ƥҙ���%�; �=�?�b�9GJ��B�L�vP� xJ>�9o���qkD���rCLFÄi�IVU$���@hz9��!-��F���� ��
����ufoO��	5a@�W*9_@^Ҕ�őV��;�x5]�"}\Y���w�ߋ�W^�s��v�\B�:��>9�QC��:���E	��Hs 0K��j�x�r�`��v�e�#5��L|���7�Ϟ�7V������b|Af"P?�ZD�KYs�(@���:50(���S�$XI����G��^"���jڕP�H�\S
���%���d\ _�Y�gU�u�5zH9��jk}�W_o>�h�ӛ��偤Χ$��T �/�1୺H?�8Vɵ��p�T��.��'@���q��/�# �o�i�u�G;'��9�ֹVP��ƙ�ŨN�}��2�C%�ϥ�ܸy�dlt��X��n��A_ȚF����")�<��{Oӽ���,S	�hf,fŸ	e(����5`����/.X�D���Kg��+Z�p?�C��n�\�՜�,-`�#z�#̄���Z6{�� e���r�*��+4J�	r�� �8l\=Z�hb��ZF�w獊� �GK�F��)#	( DNi��հ<��2C���1QD M�r8�0�B#_�����KX�o�,�Ѳ
�:f��� :�A�8A-���/��虻d"�*�_E�N�U�j�jaQ��UiY�4 ]��z��
n(����	�Q� 8��z)�A�+��$B��M�>�*���?GS�8���
@�ة?��F@�U)5z B�G�iG���H�!���tdi]�#]���ڢ�g%��UqC�#U��%�1-���>�����[F~�\͖�.�n�+Y-ר�⛝ZUEbJwJi $,~&�!�Q%�/��`6a@M�Ñt�ulD.=0@��ܨ�%���M-1��|��^�h�p%�\LL.3K��œ׿�C�.��V�L�I�~H!Ag��o@�u]�X������z�X<;��i����yy\�V�T�:�e�@�əe�p�綬��|�Ha��O8���s�)聵v�2�6{��Ɍ��?8�2x�K�
m��#F���0V��x6��7b��ѷˢŃv�J	EN����R��� @��j�o&e���OB\U\�$�/ZNˆE	!!?��V~�D�66^ʲr18�6�b��&�#��Q�1�q|���M� ��6�Q�"
BD!�{��A��#2�Ԓ���-����K��^���ܶ��(���/s,�O�����V�{�?do�b�{K�8�zt�ZϕG�B�D���B{L݀��7t����i,]v�c>��t�oC������<���2�ȃ"�(R�k�a�9=;ݡ��� XK�Dm�0����L�}M-�M���{KJC�F3\�VEMw��d� �6±�����F u��&],�����Y��J� TDs�TT|�c�yaǟ_���d<M����z�J����Dh���#S8$�K#�N��ߺa���\��G*a�� hN�Bw
iqh�_�:@�4 4$����l�\���l� 0oWR"b."2<h�Gb��e44��Ű�/�.��X�b�"�����}~7:6Q!�X�Pe��rc�WB��N� ��՚s��%��Y�h,�����
O�/��/,e)�Wr����HH2�J�<�Ѡ�^�G�6C~�k �vm��E�__�����@���i�#�N4ZA�P%�)��y�W�%�d{O^)*���L^�ʎQ��b�������TE�Z*�Δ���O�7�.��f��rX�8�j���"�WY���x�6�)J�+^}5���4ݘa�7���U����N�9@�rm����ד�μ�v�����. P�J�uT�3�!�q0�5ڈ�>�m��馗�f16�ܠ,�"[PxV Э��ڠ�VX�j����g��y����p�	o���i?��0��6��M�m�2��.��P����l��2Jkju�`�w�fV9h���Z�c慔V��7�t]%I�r��0�V/��v)��G�b��ާ�?BQ��������t!���}ft�I�{V�
��)EY*�ŉiY2Ѽ"@��2�ͽ�����W�%�ˮ �5��Ӳ�^!��0���9.�7�*`6�Y
�N�0��6���'�kL2�7����飑j��ɳ��7d�|�^ ��|36��st2W�)ж^ lrV%NwX���1P�ː��d}�eB��MtD����j2'����0@��NP�EJeu绻�Er����������rmtǁc1E��q/��1��r����x��^*骾�4@��ABV�Ȓ��	Þr GZE�*�{J9_�������K&}N����G`���=���������!����" Ӑ�͈�+^^O<c�J�����Ԏ��B
����d`���Q��)����]�E�3��[��*��XÜN;��i��=��8�]�?Bg ���������ݵ)�'Ӕam�=y<[��#�q��/k�)d �L��<����v0u!�2����Yk����*��3Zxz���v.U	�O�cNo������ eO�a��� ��˗��'k8���Xn��
�j�˅�?�I�zE��⍫E[n�Zj=#F% �-�4V$��D�K�|$w�ہ��p�I����['
�"=�;t9c�DeզE�Q&�}��Z�itG),�N�BN���_�/|f�Mo�φ� }�K�n�yI��\_�/���[̫̀>��ܻ�wy�Yk�n��?�;O��9���y!�5����C�l�O�z{�	�8�GG��*!ٹ���S坥>,ԣ�o�z���f��n����z�en�.����R�h�P&�0&+^z�(�7�;_Q��^֔,r�� �: /(�MM�L��>j� ���;�0rkX��ŀ�d����6<���52�l�w�C_!%�+eD>F
)BM,'��g�UEh�.1И��&M����)9��`����IGIb�O��N�S"�]�US#�]r�5QĚ[ncLa��:�RU�5)|F�����[�*���F�;������D�*�~yaF�Rho�04��ƪz�3��DA�����%z���1�ɱ����S�u��v����xxv��E)���.3����+eY=��qe�Eژ���?��p�S�/�(6���5�A�0O�9��N����9�A���q��^Tb���������{/h+yX������ Ho�z_4�vx�hP}!(�T��z��u��I6�X��Q2�:�ߏ�%�����<����x"ъ��5�&y��G��&�&�C��o��FL�ގ ����i ��ݜ��I�ő7Mc�z��T��f
�QЌ�!'Y�,��?A��P Q�R[����w2)�6��
H4�ͪ'd|���Ą*�?{��xXTDxe�l� �M   �WS`8"	�5O#��1i]G��ɰ[=�i����ԯ	`�|x�eY����jHY�$ev3pf*.��3a�zI"�6�?���V�k��ϧ�00�֌�(*+����(+i���(z�u.1W/���ϟ�9���|��V澼��U$���C|w��k�nS��3a,��ҫ�.�0]��	���A����z87\U7w�AƏ���Ѻ�K��9'KN8�T�8x� ��`�^�� Zy/�!v�"T\�!O��3���
�AN  ES$�Z�e�fb��V\��b�KVG$�O`���P:R][�^k�7�Q�;�)n�S��h��"���klY��SC*}x0��"[�ظi|�!e�@-���;��2�C(�哖�4���o
5��K�ȍԵ����g��*�q-�Ύ;��KX$�]��9�R0�:�p��H��M?	�R̡�SnJ_ATڇ,=�J�'��J��_o�$k�Ԗ����7��У��+��(\�clT��%T��V�H��X�y"dio�X�B}�#�%М�*���{S݈Q�S�u�zAdd�D�#q���o�a�
���&l0���]�0���Lʹ�P�l�gg�����_�8���>}������[��I._��Ӏ�}����S
Q�����bt�����\��&�8D�`�p�!x�_�9�X�op(v������j�r0Tj�|�q�-��[��$!'�r�5� 9�	��*�b� �����ؤ_�c��P֬<�'���O�uz���g�_��Z�nx�O���ͩ�lS/�&��_�+��s��uFaS �G?!U5ǿ��ت4x0Mk�^�S`ը�m��Bb�"��0�H&\U���
q���̇<�0(j��$�?�,�z��   �V̬���`-{� E:���w��/r�	�T6ǒt'�����)}���E��h�J��>6-��8~$V�#/���@�5i�#M��6�ip�YH�Ե���q�]$͕��xa��X��,���o9/'�����L*�\l$�$؊��"C�T `�q��)%���y���d�0]�`*��1գ���~8<|�4�����pke�P�õn������Y��f�GL�??o8��p��$�Y])�Pe��n��Gh
4�Hcd{�M�D�YɊ��^�Rp�'��w}��
�q������PJ�m:�o޷�̮X�|�P
J&�m�vJ�^��)��,����fF���*C_iU�J�#�y��ō����נW��\I�A�F�i �N_E�ヷ��Qw�$=W��L4@�ܦ�/l�t4��4���f � t���ʃr�]][�w�܏>���?y~�5�7{L�e���I����{���Jy5mbM{��AZ�­:f�?�!����&�L���Epx��+P�2��������0���?��]dd`%B����ʩ����?	��PL��M�_� �=�Q#�3�Pp:X?X�Z�Y�A7����#�H9�/:{]BH�쉵u_������L��m����`����yW�_��C`�U�kk�s2�^@����]�
�L[S�
�W!,7є�9>�VˑL�'������n�%�J�Ch��ՠbb�]�'C�D����WIU�6�$:f�d0�p�����^G����j�-~$���X{���Z3��WzWS�H�=��^e��W�Qg����B��f������RG��P�8����e�Eth	����h�)L�@���h�#��wj�G��[Q��^E�I2ݮ]D"Z��3�R�<�BH�/Պ�Yo�$#��w��V7�~�����"��$�~�yZp��F�;��-�*L�dH���mm�!
ecP
�^�/�R�'�����~�(wx9�0uf�udJ�J_���� ౶�\��0�K_���Lia���Ao�\�O����'�P����.�L#k;���G��-�~��֨������5Ķ޷�\�h��[��]�A&�/���+�����¡T��8�Y�`�W��O�}������x-�ؑo�뵻���L:�������.~�C�q��F��g8[�JACm�.ݡ�J�_�`NR��o��JIt������.�=�8����֫�%��	!�)�D��9c�q��y��d9g���K��`> ��
�[�Cw��?�V�b����6j�8�!�]��F�|u-�N���a/*kk[�{k������r�����~�Q%k-p{`V�S��cw4b�7"����>i�I�y�[����w-Gm��e?��f97�+Y�V��S�M�Q��W�͵��/�I�~*9H8��[���ݐ�wE�w:&D&Sp!�.+j�8j�-O��N1�e��)�T9��iiG��hY*t�7�b��\O�Lg4$��D��5c �0V�uu���wLO4�yc=+\:E��m#�Ӹ�z�<׆��k�`{'�S�ny����G$S�m��y��@Bn�{^�c��cD}3n�v}��2K��Ko+�(pa��k0��bj�����x��� �a�1�}we�o�"  �qV�3<�h2���j�0��k$AJ������&�e�@��!L�� (�f���D��`°=�ڷ��T'�	^懱���_�A�1�iQ	=߿�-����Q���/hL�i!�[k;�,�fZ/�ֶ�J�,��<;S{�-/f�8qDߓ���w�h��.Z���i�uo����{��4��ً]����O��?���>O>)�Oo��n>{�=������c��6z-O��f���h��7�S$G��,Y�d�����3�q�p4+���>� H2ʍ�� $){��B���lq�id�/	"��b��7L�ϙu
}~� 0k<�b�>u��V7�R
GN��#;C'��6��z8H�ζ�J>/�4�a�@�v��ax��@"�ϩ�v?q���F�G! ��q��Z�(��q�j�]��a;������v~��K
j��BX�4���|��Z}�/��SOʁ�|��o�zӽoS(Ϩ�?��<e�}v�5'
���_9�=�Sk\��`a��J�x4
"� �+�`�蝊��Ȁ��R1��8*��-�Lh���\�j;,�s��y|»�l9�Ѣ�����B~�+SAtzM�������/N��Hmo.��/w�D���|�j��2��Q	x�=kk�����Ɛ+��@��k��?��������1l�N����V�����&���C� X%K�@k �>fjg�07��� \��>g4 ���1)n�^9�5G���V��Ƥ��2��*��i'���9!t����������^}��u{,�M���mJ!2\�v*�p�l�A*��Ť3�DC1#���ė.���.D�MXT^;:�xi��L�d�J���/!|���#��e��%�������e>O�gO$���HKj� c��!ǡXǛv^�ĝ;١�!5�*��E6}�j�p�I��9U�u��B�c�V�U4kw1޽���+~�14�YpM/�5���~���_pZD� �N�;�0y�0 J��yaC�H�p��*M�!Mz5�3�B> ��4�Ӷ�A�*5jh�pQ Ys�y��!��p�Т�<r;M�Q3�9;4э��]1��)��Pg��� ���������%=���,�&�Lx�p��[pp:o���DVy��~G5����]5X!F������:�)n%d���g�_��V!��AWm�@Q��u���D٘!jOZ�Xh��z7��6	�X�O�}{��>��3��\}�z>�\L��P�'�%��2Q��β0kQX,U����d\�y��ױe�K�<!����,�F��U��<V�"�?6t%C���&�M\��q:��ܨ�����"��6I_۟��f�׈2D ��{J�Nd4�vq�RI�����8	^�(ж��0}��j�`��
��pD�����H�ɑˊ����(Oh�7�lP}!��"1kK-����Ѵj��B?���r�v�;��������W���7��G{��9���7���KP�эA�d������ -�!�0Hh��Xe�6���P�8<K�k6ylDF��h
Q��2(ۦI��a`s��:<�[�R�:o�2��ـ�/]������C�O�s���K�]�-����{BU0�k(S�ɏ%�d��e��q�%j�V��ړ������E���!��-
X��j�Hƚ����\}���8V�\��X�0i��=H�0�$'����"�2�dF�*"SV)Ei�}�	�{5^hfM}��2f	Ɩ6ǿ���)������V�M�HXX�	�7gV�GQ�c<p*�� T9K4Ɖ��$g2������ٵb�n��L����3YJ�c�;����@B%w;�V9j$��`����qkg�:�ݮޡ@ ঁ�L�}�%�OO�cU �.7����:dj�DEN����AJ'�	6]��SR�x���R A�b먳�V�K1�ZRx���+�X�R%;�<�����I�d�������4�����cϙ���
Eg��=�vD�K��V�;D�tb\�(��"���k�=�08���J�ْ(�[�Գ�_bA�}`}Ͳ1�q����/BE���������T��r
�����5�W�ZRV]|��k�r�īax����S���>p����s�]Ϙ�K5 D�I�g�,c/����Ɛ�*<��(�\-y�.�;V��H@�"57�kf<*6GZv�,�Ì$p����@D���n*x����D��OYA�b�0���F9���T�7�"���K�h�/�q� ��#rڹ�G�O��T�=+3ˀI��͝B�1�T����X��d\
�F�s_Z��#�tp�|��,<\W,�x1]�e�V�<�%(� c��}]�5��P!Nҹ��Q6��6���櫊�c[Q���"�lr����	6_i���������;���D^4Dpa|�Nౚ�V �+u�6ixx�e6���L�8�^.J�ߑG���c~`�����̵t޳��P[>������Ȧ��&!�!A�.�0#ͳ�
x>��q$(}���^�*Zr"�
6bD�EFe��CAYf�/^�hMP���:�S��_�jK
)�)��qQT/�m��dYگ�����n�łT���#��
E��5N%˚7�̤�c~͔����?����b�̰��U~��&�V>Ylؙ/�_*�W�?����6�=&��X+�iB���Z�����ѕ���.J2��j8L� ���6I�([����r�V;/ߩ�����)_�G?F$��u� ���:K�l��C5�B���_z)���la��>�E�Hf����2�J�^Y�j��ʖÆp±� a�V5��ͳLB��d���jQi�Eu�K��#�2��p�rE���S}�&D:瀓t���5:�8���X�?��k-��=N��8��M�k[;�i��v)+;��\�ث�!#Wo�J΍��fձ�,Uu�ȔZ�]6��+�͙Ѥ7��0���؜��m�m8�?�|�~6J+f������Q )ܻ �����,�����[Gtu��#��$�ߊ�GGZ��Ə��'M��T5y$�'5&5xe�3��VbZ��E�S˖�Ӓ:���Q�pX�hC,"�H ��Up��ק�閵��il�q])ZQ�շ �ӹ3������hDx��u��g����E�40�4|)����  SQu���{4�Ͳcx�u����鈨�>U�R%җi	X�)�or/V�R)U6�̟ɽ�$���{�WT\4wa2>9�ޗXۘ)�[��&��I���9�%u��PP�)L$����F�^5SΪs���(�y��]��x6�A�́�6CN��s�ܒ��3�9$��o�q�Q�0q��).�?9p8k������F������v8��,�E���-�.�ڜ�5�%P�g�A�h�pdv�·���c�p֮���f���Ķ4̧��*�[���G����ҟb���,͝�Կ����jDS���|���޽�jl�q�ֵ��/�SJޞ௒Gݡ�u�����q�!R\�AB)��=Y��3w�2�n�⣏1��g �
u��m�X�,�0�'�w*��k ��쿂	xN�I	��'fA-�(c�C���^.���h�#�%���
Igij� '���i����J����:fPٳ���"�[ǩ��Fb�'1��	/F����2��_�2����� B����Oe�
	p���JBô5�A��?��й��=rrW��z#	���/R2����$N1�l���2�g�-�/��h?o���|��ӥ	$լ���]q�Ϟtg���Ӷ�`Ἷ�b$�VR��ՄzW_���uZ�IW�o�՚=)�(BE�M���h� ՝��Ɉ�Ӽ�+�=�6ٺR��_ّe���ȳ����,��f�uY�e���.��_�J��_agr�D�? Q�4�l2��p���|?x�-�D�
̎YS\���Ἤm���5��8l�y�WڛZ���%�����ϯ_�D�Uf�s��W[�/��-�M�1 ��?�2cj��i.Pܰ�k~��Ax��ǚBE�T¨��
LМ��T
UB\I@"!���-�<���>}1󖞌�..t�����e��UU`U�V@S�|���h�3L�ʁA�aQ&�LտJg4,��'��W����ϑ�"use strict";
module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = require("./util");
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
            value, promiseCreated, "Promise.method", ret);
        ret._resolveFromSyncV