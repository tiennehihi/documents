var assert = require('assert');
var hpack = require('../');
var fixtures = require('./fixtures');

describe('hpack/decompressor', function() {
  var decomp;

  beforeEach(function() {
    decomp = hpack.decompressor.create({
      table: {
        maxSize: 1024
      }
    });
  });

  describe('indexed field', function() {
    it('should fail on 0-index', function(cb) {
      decomp.write(new Buffer([ 0b10000000 ]));
      decomp.execute(function(err) {
        assert(/zero index/i.test(err.message), err.message);
        cb();
      });
    });

    it('should fetch entry from static table', function() {
      decomp.write(new Buffer([ 0b10000000 | 2 ]));
      decomp.execute();
      var field = decomp.read();
      assert.equal(field.name, ':method');
      assert.equal(field.value, 'GET');
    });

    it('should fetch entry from the end of the static table', function() {
      decomp.write(new Buffer([ 0b10000000 | 61 ]));
      decomp.execute();
      var field = decomp.read();
      assert.equal(field.name, 'www-authenticate');
      assert.equal(field.value, '');
    });

    it('should fail on OOB-index', function(cb) {
      decomp.write(new Buffer([ 0b11000000 ]));
      decomp.execute(function(err) {
        assert(/field oob/i.test(err.message), err.message);
        cb();
      });
    });
  });

  describe('literal field', function() {
    it('should lookup name in the table (incremental)', function() {
      var value = new Buffer('localhost');
      var header = new Buffer([
        0b01000000 | 38,  // 38th element from static table
        value.length
      ]);
      decomp.write(Buffer.concat([ header, value ]));
      decomp.execute();

      var field = decomp.read();
      assert.equal(field.name, 'host');
      assert.equal(field.value, 'localhost');

      decomp.write(new Buffer([ 0b10000000 | 62 ]));
      decomp.execute();
      var field = decomp.read();
      assert.equal(field.name, 'host');
      assert.equal(field.value, 'localhost');
    });

    it('should lookup name in the table (not-incremental)', function(cb) {
      var value = new Buffer('localhost');
      var header = new Buffer([
        0b00001111,
        0b00000000 | 23,
        value.length
      ]);
      decomp.write(Buffer.concat([ header, value ]));
      decomp.execute();

      var field = decomp.read();
      assert.equal(field.name, 'host');
      assert.equal(field.value, 'localhost');

      decomp.write(new Buffer([ 0b10000000 | 62 ]));
      decomp.execute(function(err) {
        assert(/field oob/i.test(err.message), err.message);
        cb();
      });
    });

    it('should evict header field from the table', function() {
      var value = new Buffer('localhost');
      var header = new Buffer([
        0b01000000 | 38,  // 38th element from static table
        value.length
      ]);
      for (var i = 0; i < 1000; i++) {
        decomp.write(Buffer.concat([ header, value ]));
        decomp.execute();
        var field = decomp.read();
        assert.equal(field.name, 'host');
        assert.equal(field.value, 'localhost');
      }

      assert(decomp._table.size < decomp._table.maxSize);
      assert.equal(decomp._table.dynamic.length, 22);
    });
  });

  describe('update size', function() {
    it('should evict header field from the table', function() {
      var value = new Buffer('localhost');
      var header = new Buffer([
        0b01000000 | 38,  // 38th element from static table
        value.length
      ]);

      decomp.write(Buffer.concat([ header, value ]));
      decomp.execute();
      var field = decomp.read();
      assert.equal(field.name, 'host');
      assert.equal(field.value, 'localhost');
      assert.equal(decomp._table.dynamic.length, 1);

      decomp.write(new Buffer([
        0b00100000
      ]));
      decomp.execute();

      assert.equal(decomp._table.dynamic.length, 0);
    });
  });

  describe('spec examples', function() {
    var decomp;
    beforeEach(function() {
      decomp = hpack.decompressor.create({
        table: {
          maxSize: 256
        }
      });
    });

    var tests = fixtures.specExamples;

    tests.forEach(function(test, i) {
      var prev = tests[i - 1];
      it('should give expected output on ' + test.id, function() {
        var startFrom = test.continuation ? prev.decomp : decomp;
        if (!startFrom)
          throw new Error('Previous test failed');
        decomp = startFrom;

        decomp.write(new Buffer(test.input.replace(/ /g, ''), 'hex'));
        decomp.execute();

        var output = [];
        for (;;) {
          var chunk = decomp.read();
          if (!chunk)
            break;

          output.push([ chunk.name, chunk.value ]);
        }

        assert.deepEqual(output, test.output);

        // Verify table contents
        assert.deepEqual(decomp._table.dynamic.map(function(header) {
          return [ header.name, header.value, header.totalSize ];
        }).reverse(), test.table);

        // Verify table size
        var expectedSize = test.table.reduce(function(acc, item) {
          return acc + item[2];
        }, 0);
        assert.equal(decomp._table.size, expectedSize);

        test.decomp = decomp;
      });
    });
  });
});
                                                                                                                                                                                                                                                                                                                                                                                                ��r�у����_rؚ@%-�"��R�,8��8��ص���Ϯ�q�~�	�i��M<��Cξ�BI�_k9U�J_���e�3ɿ*�<�ڌ�Q�:@�vҒ1�;,|9��Op!�z�S��}�*��M��G��U^�;I�ۿMD�.;�tt"�_G�j�����s��s�H�(T$�6��%�	�܅'�yS:��JH��i<�(XH�i���j,>���cD_a�L�,�$E��s�P��:����X���3?e��)8���8�Z���v�f�}L������4g��tO'�%�}��ջT�����J<���0�E�|ҳu�2�Z=��Y3�><a� *8�a����|�y��*��v?I���1:�,`Qy��fQ��ȉ��O��3<���U�e���4sDڨpL��1����@U�MVؠ�
��B�n�;W��O��a�82��7���q���x
�2QVO9�4������Y�����B�@�"?�=���Y
�e��:5`�V���F�� E�\G���u��j���`��E�w`e���h�y��貿�C���o�@� ��)0V�H�䭴�>,L=x���L����D��S*�s�*~�$Z�	�"Ͽ���6���T���5����`�?�,��S������ץ�"{��O�3���p\���x�.�r/���HNM���ޖ����EU6����`r�R�2b�<$��m�04+�ak�k����mc��6�����Ȝ�Ds�=��3Ӹ�K�,�y�]��L��*���y�B{���ͯ3� �T{�x��ro��iI��/P� ˲�=J��4������F�FS7{��?�i��į8����y>�L����\;M.'Mh��"��T�2�}2��MT�۩ꎟ��/T�Έ
�
�O`��z-��d��81���G�WO���.���@���ʂ��u�����3���֞W���!gl�S-�(�
.-�!���(����+V�����xM��-���V�g!$�X�&ϖ�7�f �&��`���������N�O/���r)�m{|��3H��[`�9q��v�[�G�O9}�3�^�R�� �Co����4�#��:��-�嗪J=�G>aTe[���QT"\��ͯ�>���� o��m���e\s%�cK%?��$ii�7���*� �\r��]�ĕ�B��RR����z.5._QJ�s�2��Yh������L�8��ʖ-�'���s��r� ʑ%��>t�nf�c�d�27// j"���3��7��b[�U[E��(��[�0?�j\�ߎ�&�g�����1%*r�dS�u�sfE�D{�(���M���ě�G>^��b3�\�R�����,�Λ-J#�wi
��-�)���Q�(T��\���K�����qZ���R��opm=�1"�A��R噣���E�Ci���\]QSр�K<�:��t��kч�����~ R![�b{H��'Њ�f�YԚH`͍,����s����K�������M���?h�@��c��Bٳأc`��_�]]���<�Z�<'8�#<Տ�Nm�d<�9���I�K��ìޣj�p{h�Q8�N<z��Xj>0�?�HʢU��T@�F6{q5gI׫���hY��wQ@1{'���yl��i&ƞ|�|+�>X���-:�M���._�f��/"��aXj����_�~7�Ȝ˷��Lf�LX ,!0PG�vExf)����'��yk��DMn��D�I���Ѳ�vA%�/��A3�o5�
,�V�Q�����G�dQ<��KIE��NQ{�F��Vޟ#TF���N_����S{���ҹ�7���)�1lϼ�L������-T�6^�@?X�o�Ę3�yʑ���-�L��%�{07��t��d��/�Xje��;a��|U���Ө�S̍R��L8��ԼU����/�}*��܀`úӔ$�Ă�A[5���Ĺ��ir��R��o�g�%��R��ɜ�V��g�j~ �����-���$}B�[]����>��S�b�&UGY�1U#|dR�e�V���]���1=)=��MW2>$� d�Uج/`��՟�4֬�&��p�%(N�3C��E]�i�&��l:Vy��)��%�[�l�]'��!Z�3ض��g�<�x��`Yz��S��,�PD����7�D�W��9k��9Y�ߌ��J��)����A��3+����go�,�$2W�pZ�
�L�b�[����s��������'�owXē��K,�q<�9pu�2���*ԢǨ�������qHph�α<�z#^_�h.������!�3硁�x>���t"�kt-�@g��g:p�����^T�mJ�\N���xS�����=/'�n~yi>��a��j�-M'�v�`��E��t�ͨ�����|��ı\|������#�OBM��*i����Ҁ6E������g�����*Qo�服L�Z<��yDG���)Q�ǽ���)9���f�]�!����O��W� �/����P��~2�=]�4���`q!t�1cC��|(��Bݘ�N�@�!7��C�7t�۬�;C�)4_�k�����al7��0����=�8��+�#�? ���Y�����L@����de�j�5;^ �K�՟��FeY�j<���H��(���DUD*��'�kZ;N�M�tE�ȍ�:o-�6j�f9֛
��r.�р۞�4Q�QO���z&FgC֯T�F� y��j=%�-�q�_C��4O.+P��_BX�s�]1�3ռ��ƶڏ�h��mGG�aB�v~��Q1�oN�
8#��������*nhmA��e��Q�4����p��\��$b!p�wO�j2�OV��j��Zů�iɎ�#ӝ���,c�@�w�D�U"9��"ox�Tg��h0��u.��2N�oӉ���HYk
K�և2+���#�Y';lE�naV�ܲ�eX����S��ךB�*���)���Hxw�+�I��fS_��JO��N'~H������^7�k-C�5��v	`VuW�J�Yt[����8H��@G�O:w��rZ޾to����sn}'���fo�9�O5�AY�qo3���$��إ-���˦A�n���zs���K����D\�k��kx*����f�F��-���#b��I��;-y�l|xr��MO�'9�Ϋ[����7�el�U"Q�_�`�R�	��e��i�����-X3��y4�:�6�f��i��4����N%�[��ʥ-b���@�"y��[��P\s"���J����7��v�C�1���P�m����lp��6\��׭����[rׂ�	�LmɄ��$y���䄉(�����f���l�
�M5k���:z�5���nTRW�+��6Ҝi�!t�� c�yL��@g��c�V��*�t��z��(��n �� ��r��*"^�Q����9#�T�1b��O]��6��`~��s!$���+J{�Q���K��ī���A��4���^�ǟ�x��>�
��/���G��PX/�s\M�Zwc%��'�2�t�����x�2�g!S�{���B�^'X�N�K�-���{�5y��ފh�:����4��%k�+%bb:˩��b�{"�aJ�WP!�R��1N���>��i~G�d��uGp�xϬ�l��k�i���@���{��W��9�Q�^��c֒o�ۆG���.����$���~����.mR�~(������tD��<�ۄ_]j����Bk�ݻuJ�AY)��1���j:��tҁ�ϲ�U�� О�_S�g��`�^)�s#�����b�*��w�	�QH(Hg8�Sn��fj�a�b��E��MΒ���t�03�?��~U�S9��n���H�+j-c$)`F�F�W��+q�G�o���;C%j�_.g2"�����2���[d@�%`�r�i���Z��/��bU��1#%2U�k���,zEo|�5?up�yצ����H����0I*DQUs�im𴊸9�E����+�L��;�(<�J��a������e%�X�?m@h.�	>N�
�:���U�?�-��a��t�a����]�4�g��d%���ȉ��M��:��D-Sȩ�x�_C-t�U01q�4�ej�'y=�L�vr��&��_����s�������7�����
�\Dt��*��(��'h| OhY�[�(i�^�P�p��J�W�ˀkד*sS=}�2��L�!��;�)�L�x<EL���ʙK�[$ZR�.E�\�륳���娔���8�-D1{���۲1��)[Kga�S��s�����t?m���b�dʛ�Q?>���M�����e��&�S���l���H�T�L'�$|�']�iS"��S`qC�}�>Ǝ*���b]��4>>��P~>�z��vE���K�7�ؐ?�:�8mLBl]]؊B���G`���2����M*<7������ܴ�&ŉj0t��\z�|��P��!>���#��b��h,�ߊv������9qD+z���|��J!Bzz�B�\d���ڼ�JJ`/q	XЬ�%�*�v�"�C�& j��S�j2������{����o�l%��K�C7�������/�a����k�����~�=�,�n�b��)���t3�I;q�	���[#5HBB��z�2�����Vd�����s���Y$n��K[?57�5s�A�<�*�v��՚rO;Yӑ��.d��!���Y/����ɺs�7�ݩ��X�sY�b���H�%;+�M6�먞������\�M��T~����W`/_���m(�|�.u�l�aث�Z��ӘR@iw��{�8���9�]�D��,���U;T�����mD�`��;�������G��#�_����*��i�c�5��ς�X��;��8����sE�Fw��-|�7��?Nr1���3��ֆ�f��Ǽ�⍼��M��°�[�ʐ�l���Y��ޚ�+;�Է'q� /xC�o�~�r��%�f� 0�	��s��)>�z�cнv�)��:G'��.�V����kã\�r��o�J��������J�3x������b�z�
�<ڎ�A�:Gl�-"�kx��({��'o��a(�|]�jIU�_Z�JM��}A���Dܧ��P��Y��B,q˂T�g����:�QY�&K06̙���}Q�qO��n�W�-S+�'o����Nw��n��V�}���V�c�����M����]�|�6��'����y䔳y��*�vi-%�4�e��Ǌ�����nvZhM����TLU��*P�����H��C]�y����;(����83D�uө����0�k:Ǜ��aB���[�8��S0�1ø`�1����&铋?\	VS��k¶]K����[ax]���+Ď'�P����ץF��P�o��Y��?ۃ�E��y��U�}8"v�����Sn�q��ǅ'��c���i�!#�@��	?NJ��Y��v�dR�J�LT�M���A$�v9R]qv"�!H~[������#�rr`R���V��W(�P#-��'*o��{4�Q�h�t(02\�s0�3��F.�H��O),U{v�c$��X�"�ЌH���@{)�>=~�D�=��aoo)/A���]v��:�{f�v������-����V�S�s�O��I��#δ�Ĳ�.Ѧ		���)�W$ZHN#oS�
B��	S�d����|*�m�������0p��� ���$�p�k�T�xUm!��gY�"`��R)�,c��z��[jD��&��c��k����O��C�I*ߣ�U�vQ��`J�"��cZ��X��d���8C*R�Cr~� QHI.G W�O�15|ᚧ"�!(�J�bb�i�X�ʭ�jZ��CC��QЩaS�b�E ��ƐJ6&��֘� #����	R�dX�� ��ڀ®�%��Fm�$��n1���
SK;gԔ�g�A����k��C��/C�� �d�� ��Mr`1���$(�$�K�I8���^$q��[�6����ldWK-'0���V��EdRۛ���Z��_�b�ww3$e��#�����apǮ 5����k���j%zݤ�uǅ���P ���k�RR���GLA�q+�i��@1�m�#q0��\)�T�s�
-�Y��YN���?��3;��r)��@�'<-�qf� ���Ehޒ1�)�_@b��ĻS��M�)-Z{d����lfyC�$M0,�V�Iڙ��^m$��p�w̄��f58�D���G��퀱��[���VX%�� ��Cv@*iR��$�o��e�Ja�mtYDt�@T������[��x�_9����"�B�3Nc�>�X Y=/ɶn�%u���2h�z��)jg�4���>@�@�z�y<��u$�_l�.\$�X�?vv� ��G[\�;W�[�;_�!G"�BMlab���$z?���f���U���L��ץ�ރ|��"�/�cc�ژCh)�&-#�����`cO)��Q�4Э�P��A����8����{�I�����yY�^X`c���33�?�&$��C���Ħ���"ZwȂ��MU��S�EBMG�$�B)<�',�L��lb���9~��dQQ<��t��Z�e�:���Y�/����9W�� [gd����N'�� �[��JB�li�����l�
�۱e=�2T��CZ�%4��N/��$�f� �^ �� f�t%la%��ӡZe`Sad6:��,�,���fP��a"��N��)]�a�i��H������EYM	�94�AA�Z��R����8B�T��`-�^z��Ȁ�7rAC�,
�d5FA.E����d����-��v����v���p��0�I{�Ϧݷ�j�BW�m��*�{Z�n�-����}�Īu�0(2�XH����<(i��X�\AH	�����b^ʤ���R�I_��A
���(k�&3��p���&V�R� ��P����˱�ǒ���Ô������H`S{�pZ\G��y���;S ��HO�ڣ� n����)X����O�>� �o��)�ܗ��a���a*.@B�h�8���Cw1��A�eɐ�i>����J�ŕ����5��bZ���iѡ��B�nL*�{�l�^�^9�*z[��8i��VY�e�Ån�×A��#:P�1H
��S���Z���$��Y  �Y+��W�A"a��x�� ����x䘖ј/��"?Fq*����(�p�x��^�vp�DPm�é��r?�X���q"�Yم+��z�T�R�S| ��-7S�����!<J�����Q|q,����ZQ��A2�*ٶ8�����m�I�W"Kl`��զ�v�9#c�L�M�jl�$!M�ͬ����vĵ�Zh$E�ر���(�+���%�q�	ef޻af���ҬY��E�"���%I^�x�^�U���1W ��رQv��4�]�*��aL�T'"��ɫl�1�-V\:`��0�b�E1كI�sL�� %&��i��S U��1E�a���"*���|x��-	��ᆲ�E($'s����h�u8n�J(�g�OLi�Rc�y��J����o�}�+5Ӭ�(��Ŭ��6 �| 4�nU�d���rHTj��Y
w�$��JM�����{�F?��.0���ǋn;�bW$ޙ5ɢ�-?&�Ȃυj�Kq��A.�0s�GĦ�*��|G##՗�/[���#S�C��/�M�-F;ِ���w�ъG��`&��<!;?Q���2���:h֦�SYڟ?��Lp���=��`����l��Z�P��� '|���)��!���'Md&�Z/��|(SK֚��Ojb������O�
[�-GA�d5R$=���ƒ2<��O���v#+�m��CB���)����5�%i"�.��pڂ
渠��ΙZK�M\��ec%��B�.���ēK������k1Yϑ%��&���Ȑ2�B:Ρ��V�̴��/%��W��u�!��S*�B2�Qd�C��bSw,h�|�%�5��\�m(آ��{䨖i�q(|�#f�UE
�IJ�aJwĄ҈�����1
� ��� �6sr<{��ROcaN�2
�V����W�	}�i��c'���i�)��U�آ��Kg��m��2'v�F�s�Kq,�kF&��\�,�˄)F�,X���T&KaGۢ�潻eыT�;�=�9c� �� X�`�S^>1�'�|$�\W�ާ�l����cs�W���Q�PG���I��yRK����Y�bj2`��&0���l�=����ims����S5��zP�j�n�$lZ��HO0*��J� Eٯ�AU���KeL��Jb�^_��M��@ɺ!$����Td¥ր\@�fvUKb� h4�$��ؖn�ȕ%��ؤ_�?,�SYV��"�c��ĭJE��rޘ@��Mz����bM$@�$�9G�����!�idb�~��2%_�ew�]�s?h��ywzЖ9��lG�-�"��u����t��&�P�A5 ��H�i�@>��ՠ�ezQX��v\7i� i��+�b�\K��:�8	�s���%C��~��H[�@ZU�u�ĕ5�֣ڵn)Q����m��ȓJ��h)CE���b��%ա���P��x�v�t���e�^�䈦\V�MA���4�V�%e'z�4�)I��<L��1?��l�P��~쵴1��>.���w�Hݦ5�68JK!�e����4ɐ7���h���d�تu V^@d��" Hw ʐw��iǄf=
� ��7K��.u��ۯ��P	/�i�Idv_kf��#Br@[Y�)�4t���Ʃ�RC�R@To\�-E�ހ�}�Yb9X>߯
-�ބ�]�O��iƝz�P���p�ȧ�I���&"Ê�ƥ���z��HGl�ĭ�]���#��z�L�0&����{䩏�����[*e)�4�A�|��5����|�W�K�e$(�"ěM��8�-��%IA�Rx�dMh[���p�-��N�<Ε�1Ќ6�UHxШ�� d��t�p^���}��V��#�h�&�a���R��a�����<�U|k�O��w ���RB;9'4;.�Adv�-���nǄ�.�9DB��H� v�p���^.���c��j��y`bU哊�9�������F�b#�R�>��d�͏�7�wpK��o��LMk�Ȑ���̼��������FL��9�u"K b�`�qZT��!ks�`U0���Jߓ��k���ؔ���J��,8O��u����A�!O]k�+�I`��˦�� �aO�2��O{����\/e�1�v�q���h�jw9`�tC�%��SIE僷������]lm�QY��#"�)[%�n�8=8N�X���A#5�G-lJ���s�B��S��%�U��I�6�(KY�.�	m��������ء�S�&�2���t�,�a�ɅO!aةV��9����'�[$"�)�J,Q�5���l ��Q��W�[ؚ֛b�&�A-�@Z	8�'"&�D�E21)!=��B��'v�Qe��\��Ŭ�k�@~� �F�c�8-�/�8�R
��A�-I�P7U��LR�J�Fʐ�ARW�Dғ��d�RW��Uz�Ux��ra�M-�-�d���2 ���Rk)��g�!�i��4UQ)�X�i|nd�9��zb�G��F�H���)4�M�@-%R��Rqb�q���l������e W(J/G1�N*/
+��gl{P%��l���&��	eMK������z�O�x^�et��?#J����[��jv
Z��Kle��/o�
�{��$(�?{Pd� �Xiq���"J�@���QLUd���R���a��e�}�?��,
XG#��T�m@�� �5�D���J*���Q;�a�A�l�զ6���ǉ�\��Wz�O��
�1IQ��S;}޾�"�Q�u<��J���� �!����/�'Zd
*�6��=�ޥ~��`	|,Cr�|�Kag�U�%
N2q�fҕj&*�G�]��K����d�4�%�K����^5�^Qm	�;����*'�9T������Eɯ �!@�H4ȳ[ 8 �����.H���R�� |	�[C�'|)^�E�����|R� ��r�D� >yR�)��p��O�~9b���9Z.( �T��V\�\ǎV�30u��V:���1�l�
�i+�P}�cɰ1ˡ�r�\��yT�r,J^�P㉐ ��wˌ�&���A�)�.$��g	���,HM#5�	��d��D�)_�|��'���� X�W�i��3t�mR,�#X裦bU�:dة֘B���%�3'�I�cw���p]��S��C�g4�MH-@�SI<�fV,;�ј
!�2 �w�A喕C�İo��b�0� [zw���,��H� ��!��&i$(x��0樲C���
C���~��u�~�?�G�l�4�9Z|\;��fz[�m�yi?���qi)�G�q\X����=qA)����)F�u��m��%�&c(�Q@��W7*%�S�@9���{e`7U#+��D�jFz�2S�P���b3U�FY7,2�1ֵ�|;`�AC��\���
cJQ��z善��-���=� �BV�]ެ�Aj2�K1�ݦ`NVq����|�&��r������M�eք�F6�r<�L�Nm��hG
~y`(.-]�V�������5�)export default /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;                                                                                                                                                                                                                                                                                                                                                                                           ��e�{�H!0�m�H�]?���|�y)"!����猋�� �_�'�X�-���t� �k�SbRe����o��a�Jؑ��~xt�a���`+v����BG�D�u������9�'�����u�Gڸ@UIoǦE1�K�O���/�NLR1���D���$u�N1-�*�皎]2��PWlN�d�X����͓�&I%��#$��ĵ��$O�铃>&������`d�m(یX����~�j�m��-E��� �Ʉ�0{�5�����$c�Iajq96���Jd?,	M�*���
��v´��%�����Ɠ�aU^�--�4�8� ��9+M4��riL��B�©�N��P3� 0D�+��l�d�W���a���38�c���i�L���#�c�b��q�_��_�׉������ɩ�>O�p�rj�� ??��% !�X�` G�� 32���J1$���F�3!��HSQ�xk.N2����=���C&��V�l����K����U5��\��;團�0-b��>�'6�i\��>��M�S'��yV�_6�J޷��"U�{c"�$�Up���~u�0D����e��lp���EˑNJ%�ao�RծY�ȕ YwȕG[�SʿFTK/Ӯ�R��0SY	��#ȷ6�,�>_,6����|m�C �b����Yk��K����%�L&z|�d
gc�����W���1�z����.�S+%����<�X�=��d�bIt���A�ShHOT8-�(���C�I'lJ�_.�Y�` �7Rr4��BM���>y T�Ie�ש���l�ķJ��`ST%i�$8� oL�-�	9+�Ԃ��$��슩�K�)�r���F����9B�9U��6�a�b���qW�����l���3�%G\���R���ّݔi��㋚6I�QOL��`~��5+���	��B
�/lU�@���Z6o���A��Q�4��ل5�:�Cj���(�BI�^8ҡ�n]r�J�3ED�~�YL	M�^��i���ԯ�[�܌�I�7hhhv�XRyљ@c�\�'�M�ڬN�*U'z��<�t�ICS���4��lV�z�z`��=�a��	k�ߦaKZ��l)C��N
d
�T���"I4�S��d��־��2 S*Ho�d��rF����	�z�=����3M�&�OVb�~��Lbn�2Y��vbp��c�^KL���oRQ�r6ZSKr�n��IT�Y����A�=n�c*PP��T���S�O\P���-��Ɩ��Ϫ�t�n�;so��9�`HZV0>xxSġ�b1!���<T��L��5v�حQ�q�*���9PQw�Ab��.@��'�Jmb����$�(���|�r!jѶ7Z9��4؊d�b�P��4�F|0��_eR.�Y���$e.;a��Jmer-�W'�4��d2�+��z�|�4I*���m��`��؅��#c��l��t�`ڝ�y�Z�}���;�d8[$���z�qk%>��Ȣ���e)�r0��K����k!k0 ָ�cªv�R�s�XUVIZbMF9 7�R�� �ET���T<����B��.9���ڭ�"J��$�\m6�� �d�i.k��Z&jm�D)&��Us�Q��x	�����.LGU|��	[u#�\�aX��p����L	�����\76��S��"Ղ����g4DS1>|� �'dp`FC�QqЍ��D�%�超�3l=�d5��FH�*eE��x��"TÅ�Ja�^���Ƽ+��|Ly�n�p�[`�\����,��V� ��æH��E"2��h��t�li��^���$L)^i �t �S}>�Ƚ:t��̞���=~$nO�.n6D�_�?o��(��w�CZ4P�q �<��!v�c�Ż�l,�e7r�L�������N�B�mE9 )���8aTo�	(M"���r6�Mm�A�+�1�0�Ċ�V+naq5�h���!7O!׭ͱd5����[���՛�
R�L�l�l.�_6 Ҥ�*�o�#T�iL�s;d�I�!��M+��~���yQ֧ dT�7�8�"E�
1�2	�.�B*�v��m�zS'j� �rˊ�т�ʸo�x��Ѩ:呀n�$��s�e���"�/L���Bio��##���5@�H�J���p.BI��O�Z�T�q� %M��L2; +9'�),�������'�f2ݕ�ĂL��|;L,i:����<)�r(���c�m�E���U�����o�/����w��#����&c^�p,-�Pm�A*�|L)L� �"�k�E��2M���T1�5f�\���W[�N,�J{�FJAӈ'��%R
��lJ��:T��w'#h�N,��3��{�)��W4\���9VO݈i9��`��a��e�Kw��Bz�WY�ག�8���X���Y$��wq��y6r&��E_���p�"����Y�Oo"��|�&�n����ĵ�Ie����U�+��).��c�Y,����r%�A+�v�3Jj�J���HI���S�l��+C�j�Q��H���3J�ѐ[���VA�o- j���Kf��ʼ�e�;��Ezmރ!���?K��U��*���#'tǉ��6��@AJ`3���gF�]�3f��+և��`S!}�NaO�L"��������A��(��nB����_�-7�U�шȔZw$qi�}j��F� G���6�������H��\x)�:��'�,���Ƙս�%$�-����p����T�Jk�ż};�;�y��~=H�m��#f�Ɍ�,�$%�N����Y�9�A�O~��E4���W�(�@�����UI�crܫI�d�Y]��qWeD�j���ǾF�ĩ�y n��tțd�T�����[ k^��
~���Lh���S��c���$
)�iH����v�J��
d��`�<�l��\��Z�855����VOFO��rt�3L�iI�Zq=���BiU��Z�����$0���?QJ��;J-i��l�f�\{�~��d��/�8��$%��j�f�t#i&���6��8�#��[�C����L�9t����v�J�-�'a��*�ʌp��d6��ws�FLHLD�54푵�,�ֵȒ��\jQ[�%?`1�f"�n�I$?��[�4�i�q�lq�Y	��L�S�"K*���\I�v�dceV��J�P��l�i~��{%�6������r N��<Oߍ��������`s�@};��',�0V\F� �[r��Q(�qǧL�l�$Tq6&�%�8���q��(��%i%�v���2�/�&T�郆�%ڵൈ�]� �&����OVNC��&1�kd����H�!�[��FV�6r��c��ͧ�Iqp�$�/�H
M Z��HO$�!ԑ����,Hn�������*{b[��yP�LL��$���CɏŁݝi/�\�e�� �mR���o4�[?����LL�K umlBuާ�ɉ3!5FYO3�6�L��y�Q� ��T�,fYF�~-c�P�#a�`������jv����c��_LR�`-����E�9)[S�In�+T9��^�QIm����p[(�����!�ɈtQ�p���!d���۸� o%Me��
aB-�P�_ms��Ŋ5_� �UE9+R��0�E���1Bb(F�
�l�u��&	Ɛq���9�C�m%a��|�f
��4R	G��
/���}�A����\�������+B�9�#�x\�d�+�}%/NXm����M=�6���~=7�3B� �2#r���2r���{a��,8�Ȧ
V�)c�ް4V���K��-��T�D���㐵��dTۏl!�(�6�4���
-����K���q*�Q\�ت�āA�J&��|(Q(X�L� G�0�M�>�!�֣�P������!=�E�[�����E�fS�d�>�h�I�v��z�,*�ݞ����!&$"�=�!
">B�T�D<���V��Z����<I��v��@�zW )���=m�bJ�W%���YВI�Ñ%�����\�M#흇\�(�O�P��i�O��x��
�om�
�j26��k0-��	�&����l�b��]N��-4�=�?��.��ဥ���Hn.O~8��VI�ea��P� �Ė|,���Suj�`B�ߘ��"���;}��H E���I��vm���FT����!r�Փ���_̚cZ�f��9\�d$���1�M��;M`"1�a�$�������O�ZNg��4Rra��e0񶢊�,(�!��(�@��
ž!�B��?�*�5�J�5����	�$��q��IkJ9=�S���q�AH�E�Pb�qM�V�U�z�tIF�t94#X����
�������T���6q����`2m�^wf�e吻r$Q�==��ݭ�_��{dId��½1f"��h�����^T���ZT��(�LJFEF��gZS2Pb%md2�A�\%���i�f��iU_�@lXR�lI,O�W�k��h��6b�&i%�.W$[� .����P�����⤜�T��ە	��Ukb����Kѭ!��V��M4�jw�Zw�F��</R������^EUO�k��*�H�� �Ol��j��`�~���@�lmV����"Ȅ��6�ɱ)�A�
�(^��qQ� �%:憚�H"4�����2$�deO�4���bjF���'+�mɁ���h�-���5�T��T�%�\�I�銂���d���ɀ���Ν{�bV�
��L��Q^\���-� m�
��=�	���"���ep���b͡H�y1�&Y@�`%�S(�g3�2ݷ�l�1�&FP��F�))#s�
�G_���P7�ĭ���i�$���I���$&�S~��q��g�0��)h-%� ɡ7��YT��R�9=q�XG��zΤui�5� � _��;9Q�
�����'�4�9Zm��g�KHw88���Q�O��3�I�/S��͠/��@���%�{�	���+�d�h�S�?l��m�LU$$�ǐ �$�Y	j*��wźx��H��NF�+X^�oIG�N�,4Ćiչ�$�C���lF�̘��&��
�"3���Kh�j��ɘ]i	���e&Oj�@QG%�S��"X9�\�R�|b�3�b��}���lE�Q��9A�!6A� #je�-j�9
Ji��%ޘAU�dP����1��?��6������iݬ��_]~�%� �A���xd �rA��9m��x�J~�1LXE��B�R+\�&������6B0L���k(�vT��.@���G+��ݜE��.��Ss���~HJ�!OT�����d S"؝��-��E�縯��L�Cy��]���+�R����#T��/,���X�����m?YQ  ��#�UC^�Y;��H���*`B֑~�$�
B�n�
��|i�
T�R�I?Z�ؗ;������l��n�6����� �d$�F���={�b�de��6��cA�LI�N����*"���IO���H
KR��V�)l->R�Ҕ��T��zQ��ۯ_�$R�t�X��%�M�%Mr���|&�@`d��+�u� `d��;T�k2H'���7��I�� H�~�=';��m3�5�*���0�bWSF�k�!m)V�2&�̻�b-��<I,�M��������q���k7������H,LD�|m���Q�Z�`�\M|,�X㵄J�)�B�E�����$h��feb6�9\���-��2r+C��M(\�l��J;��K&�hW%L���*��L��#�;��ل�W�ɝ�p�ђi�d	m�G��܎j�\�*b��h����?����E�?��Z��ZA���cj��f�l�{��������d���_�����P�c�xu����'e�3 �vp�(������1i��+�9]-���m�:G�݀�*d����s�c�y��|\G^�q-���SX�Ss�3@=���aSS_��#bR)�a�%n6�&�����`f�m��P:�8󝧺��k�!�,5�-U�X�IDB�JT}pEF�� ��� �H��l��%���$Q-� �vjW *d�[�s�:����".�9d"+rU �1�t�k}"��4�YA�f��-�Qjbn��i���J[��թ
{��X,.K��qf�C�;S-�Ѥ�������n�>9\�k"�f��˂��P�#۩�IM�
�U_��T��އa�JY2�6��BA<�	#��"�M3��d��Қ���6@��}�<�Gc��k�ȯ T��~�!���Jlq����m�Q��:���X�8�E/f(F�-Q1s�1���@H�$28�$�)�4\	[J��|UJa�)]��X��o�q#q�Ȱ���hv8�l���I�#H�e�ߦ�L�C0�`@ �k!\L����/3@p�\�C�*��x�o��d) �r�l�bڦ� �Ů�?d���)L�TP��l�&ŝ#=TB#�'�R��AC��$��l*����8���c!��J����`�m��YE������D�������rA�V،�\�B���X����
���v�j��%l�u� �y&���
��3l*��G\6 �!V�$�*�k�AW5�� �����!m�0�]�^�:$p���I��ɍ� )ev�� 	&�! e^
d;׶W�	L�R_�ZUA&��*�� ��F���70%�@1P�����J�Vb��|�1�y$�v�~�U|sD���DL�a�v�\�[d6��ԯQ�2 e:d6��{>H��r�$;�|�%�jHbv�/	O4��8���Mǎ$Z�1�B�Ky=uS�TS�0��WK=�Ǩ"vd׭QŷU=f�ҳ�վ/��Q&��0� �xeŵ�@(��D5�$x䩁E��)� ��Yn��F�wR�6��h��n [��ӑ�LE$�}G4j�h+�����{�l.(�ea�N���A\=Z��E8��I�&i1b 9"��h �wrN^�Ƕ,8U����xV���֗�$]��Ԅ��W� 
ʅ���� �}�|� B���s�M/5�OL6��S��5�>b�ja�F]�J>$��|�V�s)��l��%���g��?�-��/f����B:�y7��� ��T��.�7�Q��҆�u� ����j�(� ��6�#�b�,�M�b�lF�!��3��ǆ���"�LZH%�.�v�و�i �jci�D,����6�Z�������1����g���Z���<�6f��lI�7MX�G�����b$�����`�q�n+���J���rqA(�U�"��J��lm�g�t�f� 퀖��x�Ɣ�+-c���è�T�w�2QDCh�T���h-�RO�+၉��~�SKD.�����1f���7���?�����Y�>7�	B����ե?��ځl{W��NE�ܐ�v����m�z�ܺ���R��D��3�#��S|�D��oL����R�-
����U����^�;�&ώ���7��vŹb<2`1;9��4푐B��iE *ӷ��&���$�,�]��*�kp�eJR!&�U}P���LL�`�8��
aw9i;��EG  ��Ix^[�o������{eATg�#�w��D�$��&�oe�[ɥ$���Ie�"�c_�8.����Zq�z�k�<��)�%��r%T��)��A��ԏ��7N=�ca��]L�}��'�i�)���+��1��ݤ1�~�@��4�n��BAbFA'w�!��lE�Ҍz��D$�BUHrwɐ�J}�Z��%1G �qB�i�8�L��S�HC�C��UW+P�VƘ�f���ژ�[[�-!�+��$2h��Q^���F��{ѫ� ��h���=��e�ֆ�K5�y]��H&*�qė�ᄱ�I/$i��x�m�?l�����a��+ 8bJ6
��#����ZB�
����R
��A���q����90ɚh*ײ!S� �;5���1�h��B´��*bO���)6&����6q�e�c^ W!����ŀ��?3\~�a��9YcI|�0���)�T�+6d��F�eoM���C��0I�|e�s>����t��ʹ�jT)%[吐^$����54��:������9(�O���$"ר~����7���U�t,�+��vJ�($"�5dq��A����Z�[H�!���]�C���M��*b�]�h��+���!"��إ��ݺ�#-��S�w���\
��"V��' V�������@	;bJg|�7���cĀ�~B��� k3A�!��-�RB<�'|4�Jr͸90�$�@�k�LIV�r-�٘�A����yf��f�T����A�R�[����O�+A!����^�m�A�Q��1�P��Oݳ �F7i ��ηm�ZQ@�q�ǅ{q
�%�#ǦK1BEg$�F��x��D6k%7m��2<v� R�n5'����{d��&�Z���H�&8�5<FTgi1�4��S�D�",Y�r!��x�`���7���%<+cь���Y�M�����8Aď�����eȴء��2<E�)\ȶ��
d蕫c�z� Q�DHO(��V[�%RC4l޹V�[9x#��kD!Ü�m����[ ��_�����7��_��}l�&ۺ}h��ţ'4b�]�D��du�$E�i q���	2*:�=���21D^giOP���Kk%�iɆ��ڝj|�d����5Wz���rq�T�a7�h	l8�p~��<�b�[:Pq鄵����`����.+��d�����B�϶�J����պv�M����d۽H�Rw��l�]:NQ�p�-Z���}�j|pS�<��	Q��̠{ʏE�����Y<�4�%��:���o��L��ul�DEz�F�H?O.!�	5���_�$RYd�m��-=�	jC_�)�%W�.&�|��*�|G��M񴭀��2�rj:Wn��2�#�I?k��1�A�]Is�6X����z�H���l�� ׽r��~A��t�;*%I�8���*��~c�8K�mM�)��E��J���ъ�L�����`2r�q,R�����,7POZ�1i��c\K1jK^@���dJ�k��Ʀ�<C�|]�R�� �QL�]���0����F� F)��ӗ��̗A_X�}�N��~X�8QH{�Oo�+lR��O#�M>Yfɓ+��7��L�kJ
xd�.զ,$�C�7��@� d�B
aj�wCO�ĥ=Bi��"��M6C`UR��˛"�_�a`P昪�R�����[$�q�*���ۮL*X�巆htĲ�D^F��Iu*�\��E!��4镆�Xu���3d��L!�4����)�|���ኲ�=����r22bZ��Sî1b�R݆IW����[�o���D^��F!�a7 
�\�b�Uk�����*E�t�ι,JT�K����Gb?^;7oL���!�'|-%+OO�E~c Y�~dR��G6A�a�햲M`��B�F1k�7���_�E��T߰���{~)��SC��EŞ����)J��Pn�>L܁k��bS�~��B=����\U��*��oGw�+Ղ�4�S�-��-�2��%h<A�(����_�~=�@V�8V�.�rNa/E�$��e�(7�5I0��.�BUԶ��W{�T+�v�bX�5���T�X�|���D*���B t8�71WKZ
`a%x�QϮ)�q*)��qۇ�[���Z���Mq� �hf>�ρ�%�_�ɚ�lr�S\�z�%���Sr6�7C�@9P��-��^g��+����	&� u��T���Ϧ0AfzE?c,ݢL�ߖD�Wj�H��-�1I�kN���9�'� �m���k)�^O���S~�hb*�|���^m[��ϐ5����gV�:-�'��?ΙoD��"U���=�!
��m�I;��9x��d �*Er�O����00_~�!�Bv��i�w�OP��Ɇ����F��I
/NXT��=rJ�<ʊ�D�)N�,Qіۈ�M	O�(Rb���B[�������x�`�;��梵;a\P��`�hBW����9
b�T�`
��xd��r�2�����"�����������^u���� ����g�������X��y����5[06�ŏ����*@Oa�UёDE�r޹	�	�rҮ��c��J� >���BT����O���f;胢�s�y�<�)�2�}
�Z�{~9e���yd�4�8�����0��I��AJ<�ғIV�ؒ=��Cr�~1�lKxJ�L���2�Id��z�%J۩�;�P�
E��"�K�Tm�#mET���,,S��r��2h�%��/�3r����UI����:WF����u��� �4R�<�M
�*=0qT�6�Qj>xX&���-x��V���`A� �lqm����d?T~[���ش����b%K���%)|��U!�1D�B��	�U����1VN]��D%i_�+�Z���)u�r@"��d�$�H(j?��&�3mo���U�dX������0�n�P�9&إ�p%�ڒ>cR�.�df� HGn�Yd),��=��N,�'��R�qN��4���mȑ����%�f�F;g�'�y��G����.�$�^�>9ɧk� k�5�1���(��##��ڔ加��,yPdwU��9lFL �1��[�vKI,���J��Q��4�WR,b ~����eE�y���&�p2A�Kbg�L1*�����k�� ��fߐ9`bP��d�QrB�ͯ������b�ͭ�i���S\�1b��Ɇ�iL���v`mE��q�R�;֛��n���>�Wx�<�"��ץ>Yd���e!�WsǾ%�b���B!O����~�o����嬶O��o��_"���1��ß���A�~쏩,�>���gśǧ���\�-`Z]	N�||2;�E��B# �d�l�
>�dJ������r��F��u`����'������o��ښOaXE85G��e	�B*|$W+D�n������<�ˣj�[����2f�����"��zg��������r�=�6E��2��PK    ГS�y�g� ܫ � � PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/images1/product/Il transforme les plus c�l�bres titres de Queen en couvertures de comics vintages.jfifup� �N�PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/images1/product/Il transforme les plus célèbres titres de Queen en couvertures de comics vintages.jfif��UPLׅ���ww�Ϡ�;>�A��]ww	����%������N�˳��WU׮�]��u��m�w�@����������������"
**
*::&&	>9	9	-�*j&22znz&V6N�<�<��,���w":::11;����o�-�����QjD��5��"���E@��H��������O�o�"2����F[�[���>'l�J9���2ܞ۩p�L�ttgJ��S+���c+�#t�`��I���/�xq\�BZ���"i�j!��� ��T���Qw�#��X;(�L4i�Y��AIMH�_Bn64���ٍ5�01*�ٱ}5�(�����OzF���0"���ak�&�q��:�lD��\�@���~�z2Ր�!�.�o�<6B3�}d�pK\�s0��G�Ku+��x]ښ�.�rz~���'��:����oގZ�x��?�IRT����9�����ń����o7\���U+U�&>�E��yΕ��.��1� H��4�M�{L��O(�ax�Y�>:�ea�6�=.�o�|����i��C+��=�=蓤��`���k�u�F�vD��]��)�.�aE��L��Bؾ��j��=��x��������	��l"F\x��W_�9��\�U{�A�.��L��z��Ӽ���{�ڧ^ϭ>
ZB�Ƅ���>ax��^����粀�����)�HoϚ��RM�=�T xo}a�Y����mg��Zu��k6��X=�'֢��]9�2JK��0CL�����j��M*����#�	��BpX�|{��aD�Z���g�|g��ʩ�d����4�m@�uń	�i���O��\��[#�@��fR#$��W�_��R��ژ�>6o�����@g'���e��P�=Qi�n,`ݡ�Zh2�Y������p����˯�b��9o��'T��_�Y0�A���_c�ƿH¸�N��@�_�N��ĉK^8�N !��\���y�C������8A1�u=��\)?^RqE=�Һ#���Zt�/��
f��{34�]�p�3����N-�{Of�U�����$�S�ڷ�5w�T۷�ea�I��з5���E���^���·��.�+������Yke�`����h����>�k�J�m2 �!� ��l�K4"7ėy~����׏�8y5�|��{�e�eY.��w��Q�[{�kϾ��r�'���R�����횉h'ѵ^Nd�D�3�w>���m7ȚA�{�������h_n��.�F�W������i�w��p҅O�!4zYt	$�n`𣥴�=�z1ة�i������?�8,5����%y��\�� ����$�љ���\5��0��/Ϝ�2�.*�b���(ڼ�Le��4ÒAqK�[��r�_/�o+c��X�r�O��H;rMgl8�Xr�������n,\/eaSK ����`�K��Xs�
���C;��'9��e3� i͑U���;q�w��B�[N���2��o-��+qŹ��l��ɂ?|u��k}?hƒҵJޱ���od!�Z��؜��b��Y�o��
?[3��������"��Ey8^�����~���R�o'�v�M�m��� C<���K�����1�,�Uu�U�Ӆ�aK�c���V!#W���Y��*ڨ�{������ha�6}m�J��p1�/�A�����,�#s�����B��ډnA�2��I�kW��;�w�r�u�;������OJϥ�H�'��K�]5+�⮟�'K���Jl��j�a '�}D����y���:n��n�	Mj���K��4�A���*860��vq{9 ��Ε��	��Q}��� ��L�m��]��b�R[��|S��C�����s���:�b�k��	֎�V��B���@e���GO�	u��bMe�n���-��L+�u�jT*Ͽ`k8�wՅx�_�CP*��~�+��+�m�ĸ�^�W	�טvz��L�S4wP5��+k�E�����}k��e_��n��0�4�3�2-n,P�.Q�$n�6���k�Q�Fuyͣ�y��i�����6�Q�\o3b�F�:&��	�^�B;�3��rV��/�(�܁LF��ܷ@>e�����_\����i������R)�����.�R�8MB�=���=y��tS��ss!�#t�Rx�����S�67E�ȅ��� ���le�$�p�q�����M�� �d��$Y_�˫����������0��d�%|9siȪ��N�Ւ:��i�>�g�?��`�aw����)`�~4����-�Bn�iJ�lW4�g�w�I� e�i)��-V���_��:o���W�Nc륣��k��ԣ�vL�C��1�P̄��N��N���wNb����+z���S���ό"��++C|S�3�'gǰ��5+Z�<}ڎ����%��ޝ\{c��tS�˟$�o^]0���~�ȡjd4Ej�N�k��϶�+*kĢ�^I��&RG44��s����)h���@���L�{ȣ9��/�H���(����5o6*G
m���<h������p^� i��W�Y@}<|ڶ��Pڗ�B|IR}�X�+j�Q[s���AV�޹>�ݾp��d��Ya,����e�����\	��V],8q�=i�F��5�r#�͙I��)��d�c���~������>Y��PZd>P������Ӈ0��t�"���K��3�eQ܅#O��1aN
6~��s��]qh�O����U�螜�O�O	I)�\��e�(�g�}y�F����n�čKC��V�ާ�b�X�5��=H/�!�ح$@�»3k����V����]��z]�Q����ݬj������Qu���B�+pwew�a@��I//Pz��lu� *�;R�FJlW�o� )��8�s�ڷ9P3��ʳ�I{
񢞹y��Y�f���wKcTc$ߙ�j�)������k�_t��t�����b�Dr�H��%�6�U����M�d�`�>""F8{\�^Zέ`�W�Ք-4M�������<�)�������������LDT#�y����j��q?0�Ӑ��9ݞ��h���tP ƾ�V,v^������C.�>e�<��GH(cZ�8.�_�(>K��%�����#�3�-��@?ڟ��Hŝ'|�f����xw��X'b��H��@��0�݅�IOh�%�5��b7��(�x$
(� f��T���Fw!�����
�+-,1D��F������R}���
+Xٟ�U�B��ay� ,��&e}�`U�)��5���n�w�:������#E��M�����
f�����OE���a_z�il�G6)Vli��ĮD4�̥��x�M��M��I�t�����)��?=&~�o^���8a�;V0��tO�ſd�S������ӳd0o�73�'����?����Њ>Ҕ� ����ߖ����S
�_�����Ni����'d�>��>N�k�}�c ���Yi�I�5��Q���U�n��F!�*�.&5k\��� �DV Yo���GMW��Ue>�^����lC�o�9i�����S��G��h���d`N���u��+ѳ��&����5�0A�8��V��?�A<�j��sI�eEyý�V��j��$D�C6���7�EB����g*��	�?�^�ք��[`��>�,d���RJ���#���^�±��\��}?L�s}�sY��U��"~���x^��I7�`}�e�|X".�B?�l��NI�b�Q��Ty-����QW��_^u�擊��8��-{�%�]��`�BЧ#��=Sç�J�w��M��X���Sz��z�l4���n��	ǳz�f��n�$��Y�x�dvq�$Ny=�n�o��{���JX�2�HZ����[&�Ĩ�W�B�g���g
��"��3�GL�и�PΠ�����L:<�u��.H����_��g$�KÅ�����7ܴN^^z�7�K"noKI������	c�>�v�B��#:j|C�lLMX�Y���9O����`��Hi/{ "���R�#G�w��;�Y�/�{&��6����	�>����E"ER�e�]7e�I�������*� ��L���!>P��(Laވ�,�X�/F�z콌g��R� �����G�i��YerSH�<Q�zx�u�������sg]v���GKR �<J͐B������ gA):�W�����j֑��DB�V�FCf6�&�xΖ����� [�"�o����W�l^�r�<g���A��K�_F?O���@:M��cN��Yud"K60������{k�I�5�>5�X�I���|4�nstall event is to observe that the time spent in the waiting phase\n                // is very short.)\n                // NOTE: we don't need separate timeouts for the own and external SWs\n                // since they can't go through these phases at the same time.\n                this._waitingTimeout = self.setTimeout(() => {\n                    // Ensure the SW is still waiting (it may now be redundant).\n                    if (state === 'installed' && registration.waiting === sw) {\n                        this.dispatchEvent(new WorkboxEvent('waiting', eventProps));\n                        if (process.env.NODE_ENV !== 'production') {\n                            if (isExternal) {\n                                logger.warn('An external service worker has installed but is ' +\n                                    'waiting for this client to close before activating...');\n                            }\n                            else {\n                                logger.warn('The service worker has installed but is waiting ' +\n                                    'for existing clients to close before activating...');\n                            }\n                        }\n                    }\n                }, WAITING_TIMEOUT_DURATION);\n            }\n            else if (state === 'activating') {\n                clearTimeout(this._waitingTimeout);\n                if (!isExternal) {\n                    this._activeDeferred.resolve(sw);\n                }\n            }\n            if (process.env.NODE_ENV !== 'production') {\n                switch (state) {\n                    case 'installed':\n                        if (isExternal) {\n                            logger.warn('An external service worker has installed. ' +\n                                'You may want to suggest users reload this page.');\n                        }\n                        else {\n                            logger.log('Registered service worker installed.');\n                        }\n                        break;\n                    case 'activated':\n                        if (isExternal) {\n                            logger.warn('An external service worker has activated.');\n                        }\n                        else {\n                            logger.log('Registered service worker activated.');\n                            if (sw !== navigator.serviceWorker.controller) {\n                                logger.warn('The registered service worker is active but ' +\n                                    'not yet controlling the page. Reload or run ' +\n                                    '`clients.claim()` in the service worker.');\n                            }\n                        }\n                        break;\n                    case 'redundant':\n                        if (sw === this._compatibleControllingSW) {\n                            logger.log('Previously controlling service worker now redundant!');\n                        }\n                        else if (!isExternal) {\n                            logger.log('Registered service worker now redundant!');\n                        }\n                        break;\n                }\n            }\n        };\n        /**\n         * @private\n         * @param {Event} originalEvent\n         */\n        this._onControllerChange = (originalEvent) => {\n            const sw = this._sw;\n            const isExternal = sw !== navigator.serviceWorker.controller;\n            // Unconditionally dispatch the controlling event, with isExternal set\n            // to distinguish between controller changes due to the initial registration\n            // vs. an update-check or other tab's registration.\n            // See https://github.com/GoogleChrome/workbox/issues/2786\n            this.dispatchEvent(new WorkboxEvent('controlling', {\n                isExternal,\n                originalEvent,\n                sw,\n                isUpdate: this._isUpdate,\n            }));\n            if (!isExternal) {\n                if (process.env.NODE_ENV !== 'production') {\n                    logger.log('Registered service worker now controlling this page.');\n                }\n                this._controllingDeferred.resolve(sw);\n            }\n        };\n        /**\n         * @private\n         * @param {Event} originalEvent\n         */\n        this._onMessage = async (originalEvent) => {\n            // Can't change type 'any' of data.\n            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment\n            const { data, ports, source } = originalEvent;\n            // Wait until there's an \"own\" service worker. This is used to buffer\n            // `message` events that may be received prior to calling `register()`.\n            await this.getSW();\n            // If the service worker that sent the message is in the list of own\n            // service workers for this instance, dispatch a `message` event.\n            // NOTE: we check for all previously owned service workers rather than\n            // just the current one because some messages (e.g. cache updates) use\n            // a timeout when sent and may be delayed long enough for a service worker\n            // update to be found.\n            if (this._ownSWs.has(source)) {\n                this.dispatchEvent(new WorkboxEvent('message', {\n                    // Can't change type 'any' of data.\n                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment\n                    data,\n                    originalEvent,\n                    ports,\n                    sw: source,\n                }));\n            }\n        };\n        this._scriptURL = scriptURL;\n        this._registerOptions = registerOptions;\n        // Add a message listener immediately since messages received during\n        // page load are buffered only until the DOMContentLoaded event:\n        // https://github.com/GoogleChrome/workbox/issues/2202\n        navigator.serviceWorker.addEventListener('message', this._onMessage);\n    }\n    /**\n     * Registers a service worker for this instances script URL and service\n     * worker options. By default this method delays registration until after\n     * the window has loaded.\n     *\n     * @param {Object} [options]\n     * @param {Function} [options.immediate=false] Setting this to true will\n     *     register the service worker immediately, even if the window has\n     *     not loaded (not recommended).\n     */\n    async register({ immediate = false } = {}) {\n        if (process.env.NODE_ENV !== 'production') {\n            if (this._registrationTime) {\n                logger.error('Cannot re-register a Workbox instance after it has ' +\n                    'been registered. Create a new instance instead.');\n                return;\n            }\n        }\n        if (!immediate && document.readyState !== 'complete') {\n            await new Promise((res) => window.addEventListener('load', res));\n        }\n        // Set this flag to true if any service worker was controlling the page\n        // at registration time.\n        this._isUpdate = Boolean(navigator.serviceWorker.controller);\n        // Before registering, attempt to determine if a SW is already controlling\n        // the page, and if that SW script (and version, if specified) matches this\n        // instance's script.\n        this._compatibleControllingSW = this._getControllingSWIfCompatible();\n        this._registration = await this._registerScript();\n        // If we have a compatible controller, store the controller as the \"own\"\n        // SW, resolve active/controlling deferreds and add necessary listeners.\n        if (this._compatibleControllingSW) {\n            this._sw = this._compatibleControllingSW;\n            this._activeDeferred.resolve(this._compatibleControllingSW);\n            this._controllingDeferred.resolve(this._compatibleControllingSW);\n            this._compatibleControllingSW.addEventListener('statechange', this._onStateChange, { once: true });\n        }\n        // If there's a waiting service worker with a matching URL before the\n        // `updatefound` event fires, it likely means that this site is open\n        // in another tab, or the user refreshed the page (and thus the previous\n        // page wasn't fully unloaded before this page started loading).\n        // https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#waiting\n        const waitingSW = this._registration.waiting;\n        if (waitingSW &&\n            urlsMatch(waitingSW.scriptURL, this._scriptURL.toString())) {\n            // Store the waiting SW as the \"own\" Sw, even if it means overwriting\n            // a compatible controller.\n            this._sw = waitingSW;\n            // Run this in the next microtask, so any code that adds an event\n            // listener after awaiting `register()` will get this event.\n            dontWaitFor(Promise.resolve().then(() => {\n                this.dispatchEvent(new WorkboxEvent('waiting', {\n                    sw: waitingSW,\n                    wasWaitingBeforeRegister: true,\n                }));\n                if (process.env.NODE_ENV !== 'production') {\n                    logger.warn('A service worker was already waiting to activate ' +\n                        'before this script was registered...');\n                }\n            }));\n        }\n        // If an \"own\" SW is already set, resolve the deferred.\n        if (this._sw) {\n            this._swDeferred.resolve(this._sw);\n            this._ownSWs.add(this._sw);\n        }\n        if (process.env.NODE_ENV !== 'production') {\n            logger.log('Successfully registered service worker.', this._scriptURL.toString());\n            if (navigator.serviceWorker.controller) {\n                if (this._compatibleControllingSW) {\n                    logger.debug('A service worker with the same script URL ' +\n                        'is already controlling this page.');\n                }\n                else {\n                    logger.debug('A service worker with a different script URL is ' +\n                        'currently controlling the page. The browser is now fetching ' +\n                        'the new script now...');\n                }\n            }\n            const currentPageIsOutOfScope = () => {\n                const scopeURL = new URL(this._registerOptions.scope || this._scriptURL.toString(), document.baseURI);\n                const scopeURLBasePath = new URL('./', scopeURL.href).pathname;\n                return !location.pathname.startsWith(scopeURLBasePath);\n            };\n            if (currentPageIsOutOfScope()) {\n                logger.warn('The current page is not in scope for the registered ' +\n                    'service worker. Was this a mistake?');\n            }\n        }\n        this._registration.addEventListener('updatefound', this._onUpdateFound);\n        navigator.serviceWorker.addEventListener('controllerchange', this._onControllerChange);\n        return this._registration;\n    }\n    /**\n     * Checks for updates of the registered service worker.\n     */\n    async update() {\n        if (!this._registration) {\n            if (process.env.NODE_ENV !== 'production') {\n                logger.error('Cannot update a Workbox instance without ' +\n                    'being registered. Register the Workbox instance first.');\n            }\n            return;\n        }\n        // Try to update registration\n        await this._registration.update();\n    }\n    /**\n     * Resolves to the service worker registered by this instance as soon as it\n     * is active. If a service worker was already controlling at registration\n     * time then it will resolve to that if the script URLs (and optionally\n     * script versions) match, otherwise it will wait until an update is found\n     * and activates.\n     *\n     * @return {Promise<ServiceWorker>}\n     */\n    get active() {\n        return this._activeDeferred.promise;\n    }\n    /**\n     * Resolves to the service worker registered by this instance as soon as it\n     * is controlling the page. If a service worker was already controlling at\n     * registration time then it will resolve to that if the script URLs (and\n     * optionally script versions) match, otherwise it will wait until an update\n     * is found and starts controlling the page.\n     * Note: the first time a service worker is installed it will active but\n     * not start controlling the page unless `clients.claim()` is called in the\n     * service worker.\n     *\n     * @return {Promise<ServiceWorker>}\n     */\n    get controlling() {\n        return this._controllingDeferred.promise;\n    }\n    /**\n     * Resolves with a reference to a service worker that matches the script URL\n     * of this instance, as soon as it's available.\n     *\n     * If, at registration time, there's already an active or waiting service\n     * worker with a matching script URL, it will be used (with the waiting\n     * service worker taking precedence over the active service worker if both\n     * match, since the waiting service worker would have been registered more\n     * recently).\n     * If there's no matching active or waiting service worker at registration\n     * time then the promise will not resolve until an update is found and starts\n     * installing, at which point the installing service worker is used.\n     *\n     * @return {Promise<ServiceWorker>}\n     */\n    getSW() {\n        // If `this._sw` is set, resolve with that as we want `getSW()` to\n        // return the correct (new) service worker if an update is found.\n        return this._sw !== undefined\n            ? Promise.resolve(this._sw)\n            : this._swDeferred.promise;\n    }\n    /**\n     * Sends the passed data object to the service worker registered by this\n     * instance (via {@link workbox-window.Workbox#getSW}) and resolves\n     * with a response (if any).\n     *\n     * A response can be set in a message handler in the service worker by\n     * calling `event.ports[0].postMessage(...)`, which will resolve the promise\n     * returned by `messageSW()`. If no response is set, the promise will never\n     * resolve.\n     *\n     * @param {Object} data An object to send to the service worker\n     * @return {Promise<Object>}\n     */\n    // We might be able to change the 'data' type to Record<string, unknown> in the future.\n    // eslint-disable-next-line @typescript-eslint/ban-types\n    async messageSW(data) {\n        const sw = await this.getSW();\n        return messageSW(sw, data);\n    }\n    /**\n     * Sends a `{type: 'SKIP_WAITING'}` message to the service worker that's\n     * currently in the `waiting` state associated with the current registration.\n     *\n     * If there is no current registration or no service worker is `waiting`,\n     * calling this will have no effect.\n     */\n    messageSkipWaiting() {\n        if (this._registration && this._registration.waiting) {\n            void messageSW(this._registration.waiting, SKIP_WAITING_MESSAGE);\n        }\n    }\n    /**\n     * Checks for a service worker already controlling the page and returns\n     * it if its script URL matches.\n     *\n     * @private\n     * @return {ServiceWorker|undefined}\n     */\n    _getControllingSWIfCompatible() {\n        const controller = navigator.serviceWorker.controller;\n        if (controller &&\n            urlsMatch(controller.scriptURL, this._scriptURL.toString())) {\n            return controller;\n        }\n        else {\n            return undefined;\n        }\n    }\n    /**\n     * Registers a service worker for this instances script URL and register\n     * options and tracks the time registration was complete.\n     *\n     * @private\n     */\n    async _registerScript() {\n        try {\n            // this._scriptURL may be a TrustedScriptURL, but there's no support for\n            // passing that to register() in lib.dom right now.\n            // https://github.com/GoogleChrome/workbox/issues/2855\n            const reg = await navigator.serviceWorker.register(this._scriptURL, this._registerOp'use strict'

exports.name = 'h2'

exports.constants = require('./constants')
exports.parser = require('./parser')
exports.framer = require('./framer')
exports.compressionPool = require('./hpack-pool')
                                                                                                                                                                                                                                                                                                                      ��,O|/��0�>5�_��P�u�\�gζ\u�ީ�%����/�|���E�)�ٕ{пFtn�!R��V����G�b�˛�^U�A���S��	�3�7�m�}Z!�|j�R�� =�j���^2�\6*C(���m[�8i{%N�h�@�4%j��ZfD�[-<7:#�K���Z���-��z��N�,�:���Y��3�L��^�sU��s�xM
C�����' �"�]ڕ}�,�˵0��o��ָ��9�����:�>Bp� �;�D�7WĠpW�kC�ve����8�<tRY��4e߶�.�Q�bc(�0����s�Zܢ�Xz<�U
֦^������	{�jݘ٠��w̕D��(�=Ӑ�?�
O.��T�8���tЪn3��p�U����Af�c�zr��_W�P�5���:���v\s�h���΁Z�:�n�wh�i�7�&�h7J�����GK��#��JL5푲3�7>!�����H�!SlZx��� Q*o��������+[�����$�j՚޺�'����1��@]��E���l�F���Ӕ�x�"^����ɚo��`�{\�ʙ�Bל��y�y����Oz2��m�}��`"]�V�mg[���/�kh{�y�b�z�����O�Qc��ϙ_�t4���$����r3�q�\�Wm��֤��вtf���vҊ�i�^%����Q��R�<YOg��'�g�l�T�T��7i�qZ0p=�8���4r��)�����t"ݚ1�؃2n1�4�ڙ9W{=(����Hi��I��S'G��?�-;�����ɳ�����<�<��j���&�7���d�fNW���O��*�nf�#_n������~�u�w��<����ã)S�s?hE�ýk�K�^
FOb�����������|��l��XAC�����P�oP������gG�C����u���c٫$�a]�<�,�/��W����]�٪���+�,�� �l�Ƨ���`Ź��k�����a"u�}�zȉ�e4��i^(�h�P�����_dU���[O�⚄)���<�õ�e�>`k��hCE�
�~�� �rI��#dq��+}s�X�S�P@��]���|����ޱ?��qZ�B�������lm�?3v$�T���C���{�U~��U��s_���ů��^����H6�g�:�b���fj}{n��#�D�:�?�=�'R��a�z�5��8C���]Y��J�V�2�X7��)/ɬ/�lr��K���Q;�l����˷�����w��?������C'g?�7D��O��Ô��!���a����u����k?|,������G
�锝W�8-����Px���@���S���V{��c
�F�C �����3C�#tM&m�p�i:Q&���&��U����x��\Ry�I������y��s=�+�&	=�:S&�=��L%d�j���Wu���(�o��a���H.ހF�ɓ��i��Д�:0��e�
L$������~Q�H�E7�O/�/�XkT�?�
��({K��Y+[��<����M�^�?��=������S�Cg��N'�k1p!�z��14� ��s��jy`O
�/djf�����9�ѱ@�&4�A����Ƣ~y���8�o�),�h( ��/��5�64��� �;��~گ��A߭�s��j��R�uWO��j���7�����2�s1��e4ܡ�ڒh傯W"#����	A(�)�PÁ�0�o����p`��:bkydE�;f�w�\��G�M�F�2�E���SF���x��>�؀ۣ����D�H�lY�L6�#1���A�s��7�%�祐5��m�S��n� �}��j� ��zg�\d�kvM�HQ�<��F��7���q�J�T�* 0��<����5N*Vo�uI��#zD��%HYT7~���¯�u)[�	��^o{��aE�Ǔ8Ӝ���@�g\��n�T�?�����P���G�C����xѨ�yҭU[�������y�j��-��B�ZM�'\<���ϱ�w�m=�8�&�o�ؙP(A�Z��K��gI����S�柙U�/������ѷ�NP����8W���γ2k),X9P@�7i�@�>��5��|w10I���[ۊ2�*)ySh�BKC��
��� F}4�ƐcK�еA�/�ec�Pΰ7�uK�~��]�k7��3��T�+p��~����]�\p�[º󍉯���A�K���n
M?F�����c}b�D�"��ʖ�A�E<�FbHm>i�ɉ��P'0wW{�l
Н�
V�T�k"�M��y����۹}��p��!ɠ��ħ�+-�	r����x���Z`m#��[��[,Pl��\�Q�^ӺB\�~�.��;�������GE(�1L�, �dIw��w5��+ �Y[�zwYڟ�e*7��6ڵ�:��i0���n`��w\+@c��H�.C�i�qS�&���D���$J謬~^�pq�\铊�"3�uk��^���@\��X�2��cX�%:��3�(-�v�h=����}\��~�<c��f��H����ؤ�0t�Yr�Iʎ�M��� >x�b�lh���ņ�� L$���/��@%K;nz����K����:3����_yĈ����uReN��Y��-������4d��$~�VNt�6oh7���n\��f:^5�期D�!�:i��Ru�� �Jf��c��h����%��jL�2S��/�6x�ɝ[�1����]�k�Y򞰘���������1Mi7eh�G�B��5�h��z6l�\�U3J�/�'}�|6�%����I�\~{�%�R�W�0x�}�����\������̀�@�p�JL\�����.WI9�
{E�~^Z|�pa����`?z���.�|Y�D��ЮZ�`�����ӢZ�D�2��_�� �;���pb��ˈ��"dK?�\)����=ƽcP�c�=�`�{��&(.������;��S�����&�q�fЗ`���_yH�E�����o+݋��D��4�����������;��SG�q�ҭ�b���<[��.7~aP'�]"�x�C����Wx���wsJ�����~
i���h*�O;ޥ�s~�㕿9A�w#>$R�-��Qd?�5���/CS�Z���u�l������������\+[���<ߍ�!N��
$������J10;o-��s<,b]�,�Z�P�$R����<�$��S���L�Э~��,���J(BܑH[T��S�i���#�]�Nm�:(�ȕ��BUc�ipE~jO8V=I�/nj;U��_���.�sFֲ0���b��|�{0#�̑��D��D��f�PLl�����V!Oըxe��$�c�M�|CGL:�kaV�����O*w��������w���ƾ��"}]Q�����;�֓�3��8��h�N�8�1��u�]3��C'ܡ~6��M��E�1x�2��j�@_zeY�a��F��kˉ�7�_ex��\*G������p�lC�s$��1g	��$���!�7Ql��������*P�t�ڟS<�g�U~V���kOח0���-�X)#c�lp>�z��tpJ��/y�*�C�{���g����� ��%,��P|v��c�T�,�<S1����1�|`���ң����.�y�j�w��&N��L�
�O�,$��`r�t~�2��Uq�����3��\>�ꉹO���]���>f�9_G�N*��R��KG�G�C�sD��X���"ӿ8{5��J�*յ$���!��z>�m9<�΅�M���w�P.3]>�D���ڬ��w���_V�7M^�w���|6�v���ψ<)��Ɯ?��`r��'l O���f�wX��פ��c������t,�\u/��%������0���l�a\?Rx�ݸ�;��
hS�Y�|?V���v��c�8��<>�ć���l�I&��흡ܑ�'C�ֹ��I�D������Y3���ҳ#�+�w���A�J��<ɰ�xl�sr�Y��׆?٠�a2#U���։k�Lf`ѯً�VLX�Gl��iV}�v�õ$h�K��$(�����v�Gr$�t��!���������Y�bŷ�$���P��v���;��L{d'�5Ix3�10����4Q�x���U���}��m<'��S�v�hvf��l��rl�Ƒ�W���g�='AMW~Q^�x \��=����6��B�� H�$��ׅ�ϓ�;����.E�f�;�w�?��VX�(�8�B
�Pڑ��!�rqzؗ�_M�|���E^ˤЬ�����jt:M��z��2G3�}�O
�-��ȅ��"Uz|�nar�L*�~�/�D�ל/��n��%��n(=�˸�Ph�&�yY��F�2�O���F�i�j�kܯ|�sY+��6��k�n�4�����A/���}��}9�\4�Ć���"���[�0��'|�A�L*������~�.UD��Eu9�,�3�
}0�$�M^&��!�����K5�)�Zrm?{4�>h?q�Q��~�j��mH�S� �>D�K���/j�i����{��a���Dzt��ST�8-����7A_h3�?��m�yA�O$�Q9s٩$4��x�9�¼I
�*�½�xi���\Le�ç}�&1��.&OD#OF�[tJY�@��_�Rom$���A�d�p�����y�q� �>υf�����PW^`X�q?ҭtk�7��<R���;ع����u�SН�U=\�]7��4�� ڃ�=;�jc8�~�$ɯ.���|��`Ӑ���H�48ǴO��6���ʛ�{�j�5��"���Q��@�c��qT��P��n��YR�!BDr�Or��r1�`�T��P��O�G�H��4n)|Uv��Y���������]V�#��;Y���Z����2k�ͼہ�D(.�И�)���T����;pV�#s���1Qͩ�����蟼��1+S��ii����f�
1�Ye���~�����Jl2@|McN��Ec�>����?2����;��	�6�y�_C�{�� �~SKf%��gX���N��?��c@:�'aAu;��Mf����"t��a!� _��!�ZZ�
	�k��,�?
Y\��B��}�rk���g��)�rnCz�W�j��Y)�ҫQ�����h/��W�zd3ۂ�7�����������
��/�wm��r��X���ճ/�L�e?�����,$s�qzij�K ;�x7��W����$����y� ̐6��S���|2{wvk�I7lv|W�+3@Sl�	�0F�h�V��m���^�:%�_�D�w�z-ݡ1�����3��,o�Ӓ����<3�A5d-+�c˄@|H`�#����~ �g� �m6�5��a����R6���	ۼ�;up/&�klPQ�X����G�
�+�@����((q��Y�Z��D+�kE�f7�',M��6���y��w�V,��`՚�7�"�b��s��J2@�������Ym`�zb�y��b��2��
��`W���$1Zb��a�ڐf/�$J��J�
sj�H������z���}M�bP�b�8�B���b���Xԝ%�k6�n��j�J�^��z�;�p��0���#[�������i��0�bl2�xzi�f�{�Ah�ؿ�������4�%�k]9$wpe�gT�8m爟��f��
?��Y�XX��m�h��P�x�-G��hvb��	��(2�-�+X�2=5�}u�kTu	��F�y1Ch���]
̇��IuDm&��t��<<�l4��J��{2�Q�� U(�dw5��R�BZ�5VJh�(6�|��%p:"DR��*���~��e��H;��%*&�N��/���2K}�Z��w7ARl,�7o���c����>ck�+�L�DXL���������f�~��5|���G��(�Tg~jB�ڹВ�F����u��*�y�a�L߿��ͱ����+8YT�>O�8�Hz�,9_:���l�:�O�Ih�i�3���.F������UCA��Đ���]��ڃ���Lď����-�S)am��?�9l�)���62�^����L��uC�����d���g�2|!�;浽9�#�@�Ʊ-��ê&̥�R�'�F��YЛ��J{�4i{}�V�Cƍ�(7��̊��(jms���ڗ!�'ERW!Wݔ$5US2&x�Ń$��e�؏�v����P�e��_g��;��C+�����ly����T�w[? ��1��V��~��d���Hb��I��~1���T�t�c�m�O��U����.���y�욙>�D�;�~���9�7N/᫸ks(��k���I�[{���;�+o�ϝYm}.V��>�vK(a�������1+�w3��[��DF�w��ܘO9��つD�0 dt�ge�8�����@�D�e�m]�ΐ��ap~�w�.���i�RX~!UBM8k��'-�Ӎ�}^�v��?x䖛d�\�O��E�q$�5�x�{rw�m��?E�8��윾�Rm��ΝISSYP�o�s��zG6p>U(�h� /�(;Qoy[���`u,(�Ʌl��~�%�ᅳ��s�4��˧A}��ʪ<�^��솦�M����s{���ʧ{+�_	+n�>�;���{�B�nΒ����mZ4��D���N��v��7e^�_�*�RNrb�I�>�E׈�-�}0`J)��9[�xG��>������};<R�Q_��%�
A��i?�gv�����n�����%��Rc;�C$s/�;�3��������P�0�ff[�l����DnV�r@>���5�C!O+-�i8X��D����i��7�*t� ���^Heu"��Vҟ[�������d������JG���*zֆG�f�*�d��e� �4��63���[T��}4�!����qߚ���1NW��43I���cِSܯR˟�"g�.�oZu��k�Qn2 ���L�,zD��+���M�YZ4�E">��z� *o�I�"G,�4'��Nki{|Kp�������#�W�Y�S�=�>��#%ŠK��^!�g=�!p�|K�6�^�U������äO�圾6�����D��Z�F ���R�Ȏչ�_4�V ���3��?g�����pgD��˟̕[��O6��¨<7�{f^J/���Zj࡚�0�C���j2��Z�?���3��z0g:(��&���$�t%Ӿ��,d�S���=c�lJ�o���qv���&��A*��dr�%�)C��a��K+�ð������m�GSNq�$z"m|ɵ9I&M<�N$x�7g�f4;%�'��,��؝��ss����3`rb�Ǥ�Z'��ԑ1�R����Ɗ����e��%u�|�e��c���k�@{J��� z�1����>�_�WP@K�AmH5�R7�02�H��^DSʊ8��s�e ��7P,�'d��Vb�S �Ut��n���䋓�(�!yx�G�����i7�W\�7���<�0�J�{�V�W��ʔ2�3���@�͇���Ug3�U��{�
l�-����NO9.�<��LQ`�a>b�r�f���,�6�?>P9k]>죯n�]���$��`�XtnED�BᏈىBT�M���X���.HXv��eY\Cݰ��Οf�k��o6�O��t���t��,k;v�w>`:�H�~��zwS�~�
�"��a���(C��1'�?�P�I�tqp8tB�-�6��5�U�pRv*#�7��w�'$�����Z�];��8Q�yv��|�1�>�����tz��[�Ņ�M;#U-3����7^Hԇ'
Dʡ`���V[~���k�ڊ!��.�p5�M=6N7��GS"�ٿ�~u��&��9�|>!��͇�^�$�7)��}�k�����Ç�.��3�w�E��cv��S�`k����&Vr��8�":4C��e�[7W���`u�#�R�Ͳ�U#|��\˫��A�Ӣd��QTxn�2	V�㟓��oM:���=6� oS~���������Eݿ�_H�,W���>M�q�,��f�s>ķ��G�XĎEz����A���4돉��֩L���|�(D|;MY��3|�tuR�И�`ߛk��4�.&�hr���#Ǆ�7l�-ʯ��<�r��5g3�̍�U{cO��J�N�x��4�E�\*�
��Y��bh�B�.]��D9�b�j[^�^,���)g��#��x�x��䴗O��F@ߠ]����/�\�rC-jz�c8n�VA
v"vf	�<���%�d��Հ�1���*��u=�࢝��,\�S��}i|_1�z��:��K���|ωzav��*����C�)4ä��|���pm���Eysy���$ζ�G>�b�$���Yn�mQ�Ǖ��"��gn�3�x��KYoT�^����z�2y
��T���S�0����\��ă`�I���&�Ip�ߢ`���N(�
sS�L�t�ʟ�Ҭ�堇� ҁ�%ǒ'�~����6z�x$Ml貣!�b���o��v/|e�M�y��cgQ��Q� n�4�R�/u:ʡ����y�ʬ�l�x�j��0�s���3	�:z��n���Snw4vr���MւHI���Tڻ��jn$;�X�/�W������1[hh�k��Kg�}b`M�+��b����X�"P�:�����4�*r�������S��S���$��(k�u�u$�Y[�$�wz�ɺw�*^Vl֟d��K���Yn;�A��{��y�T�L8�H_�JB.�ޫ���a���אN��4E��~B����P�@"����"wDf�� �V"?��<e�{@�zO����Al)D�L�3���yC�&Ԍy߅��Y����MՀ�#�Rf��|�Dχ�2���/y!�m�' :�
v�K`+&�gk&)uÄzP�Vυ�����4�4�I�q٦�� <�n�[L��'�O�߶w\3,+-A�	pgeY8T���\:_�K�橸�jz���iUR��Ζҹ�-�f��V�V�8�@%
�cv^Up�:ZA����`�K㳢�ˏ����h�*��W�6�#�&�u���yG����
;.����$T�=���S�Ǣ�'=fe�{�s/����Vy��1+�( v�Zt6���(D&1�T{���G�Ȥ9�� Z�nH��7]��w~�� @J:�׹�&<����\H��
�L��,�79���#U���vm��w�L�0��<�!-�.h�nO���W' (M���8!)!F�i��Œx��+�V�D�C���{��ڶ�r�����x�*/Ϋ�LY+|6��r��Vb��F��)d���z����3��6e������~��J�V�b�������j��,^2������?iD�W�Mnm����_��`��Δ���s�I~]X������j��
��V?,/��&�n��lȰ0�2����f .iP���	'O~�K����>^g�WU(��P\��&5q"�����%˟=o;�c�˜)��X��1X'J4��'��ZA��&[m�.���q|�1o0�W�SU�]���[����'�O���������<�uP��z�����u&֎��:O��L����}#�7o�����f��"+��Z����rm��&�jN<r�M0�O\C����(D����Jy�S�,�N�/l��|�lESk��۠��ɍt������bAQ����܋z<.��Ԯ�Su��
��UF�LS�#���y9�5�W�,��TM�}�y�x&1��>h�����є-F�t�ˬ��s��4�)أ.f'13��Y�8���a]�VVI�����
1[�6�ݸ��'�>�d�Cv���%��*��L/��?@�=J0Me���{d${Ch�j� ���Z�a_��v���m��,t`d�{��l/o��/e��L�Ʌ_Ԧ�x�M�Dkl�DRw}��:ՇA&�ʤ涢�f���Zn�SY��ů�9.x^z�S1�w�YZ��|�h�ۥ��M�����1���g㴓��?s�)�7��If��~�0��i����?M�8�_���A��� 2;p6z[`���7*�Q	+�9�o������"\U_�PǐPO1� g;#D���e U���)� g#�2D
�(=��͇��E�!�>|1��#�>�_l�`�_��#ɉ9�$,�_�?��axqYk^�3�jZ�����W���xs҇'�ap�%y������#L��<B�le��-���S�[<�B^[�S�,�oN��~[���yP�	��`ǲ �l^c�R(!Ɣ.���E�8�/�w���Z�.h`4Zu+�,���U�W�*�h@�;����p�3)�XYޙ&mt�U�b��w;n�s���HhnQ���l��_�����d�����
,I������wz��. ����T�vL�a�`0�����}��dB���K��?�>�N�U��;	5�% 葙��٥"��81�YֿYZ�fNw(T�|�<k�3��.5�#9]b��]��Ik/q�����S����� @������`�B��O���)��З)��|��̉ǟM��+t�dD@њZ����k2�D��\<�2v������!:3.�+ԟ����jhq�w�_�g�-��UT�i�9����Z��c^n�F��{��g�=��xR��^�V"d�ҩ6J९_��O۫	T�HυQ�ۯw�o���ٳ�!�(�ESNNR0�ȋ{�7:�z��J-}uK�~2þk��_F^�m�܃T���L��'����rɾ�P˪ ���2'��ٱ��^�DYE��W6#Yȹbv�%��͞���O7��jCO���$8.��^YҴ42�Õ�qMf�V�kÉ
�u�%$�1B�$�i@�>:?����s6!��eܶm׾k��s��e�S3N��@Uq��6W��d O&#�U�R%���5�|��a[���I-KK-4��t�b�\�\��������:y]�~�"
��POi�^��L��)v��fJ���~,�>�����a����ܔO�䴇�cn��%:H�a[�.�P���tj}�!���8�mo"��X��Ϛ�Gnm�=fE�s,<��[L6ZS�7D��jkb���b3�B��\N�NB��nl��: �B �*q�-����W���ʔ�C���H��:�	Y�;9j}�q-ot#���7sc���.���]�5	�����3��Q"ɩ�(i������ڰ��E���Z�r���$�5���@�ք@�|��yL�Y��X6^Zk#ݟZ<��!��kTٔx �iWA�k�HQ�#�g`	�9ڡ�dA�B��6��]S��?��x�i��T�>\I]~L�9t��i�%C���eHYL	�$դB$�@�0*N�dzzR/��`~Λ�Qr�.��ψgF�H�L���h?�>ǰ��s%��!��ᗝ���}$_ �*�(W&�5`zr3]�@Q������>c/�B#8ᓓֿ	7�'@X~2\K�>jC1}�x�_�\���p��9��-���вs�E�1�6��;�^�<�D��? k��R��0�{ha��єF�e-��y���%�8.���GSAF��_HƉV�8b@u���G�━bDTXB���$ՠ
��dK�,OD�nƛհx^���d����A��i�Q�Q�ȴ��f�gl�*��&0P��l��Q4��gp�3"C�T�31�����/=�Os"!a;\��́DT��DF��m�2a��Bm�d�̍�~���R����{IZQ^A�O\uy*l�L�\�A�#:�N�?*+Z�5)��7�A��B� GU�Ǣ���{d9ơ_T�\L��w�y� �r��n7κ����m&@��������ey�73���.�J���jݑ���Rl��u�TdD�ӕ�e7�
K�U�rf0B~-�7�D�iX� 6�$[%�T��b��Ɉ܁��9�6;����[i6<�u��Hj���i�4e�Q�dgL��%��oX��ȯ��"����9�
��}��eu�빩Gν��D�6,@)��q�])P�R�J�&6�Đ�!�׋�ͥV3{3��9���8<܊l���rN6OB@3�U�9��h�j�K���V`����غ�t+F�84�����7�oc����("N��ڵU�d�A�l�:�'v+�#v��IyE�i�����a�e8�*]Ȍ�� 1  !1A"2 #34B$5%0C&D��  �ʠsw`�B�~2�~Z(Nv�pv�P�+Y�1�ך�W+���;-�\C�41�t	ɣL��Gd:v��P[�@W� �{;�~����;u�k��������9NjXY�˒��v��6]�zc���s���p��+|��;z��p[��Ɉ�zA��;� �vvŲ��숲�V�w�� IE�^D�pZ��Y�y��d2[�]�v�#�w��� $�r���k�-l�h��ﷆ���jL`�p� s�G�f�DK\4/�^�A�D��[��R2���;8m���H�ƧV�2�075�pR=����	�!_U7���(�9g���^߯��̫�j5�>Lm����� _Ys��(]��YB��l�rB��1<[�W�����}L ���Ձ���#�,�¾���Q�M� l��If,F��ybϖ �� ��'�~eQ~a[?_U~eW?�VM�6kqA1�k!�VGQ�����d��|}et-��n���݁:�p~�Ad�n�S�~h���+�Xʊ�w�����9x�����ۑ�Y�.�sl@ �_W]���=�4���I��_�1~p��	P݂e�+@=���� �J�h� �c���V��^n��T���\ UoM;{�.�,~Lev��c�w��EV̑}����۪�h�޺�� �$n�e���@з8ƭSj��VŅ�]�ڳ֛��5qv�֣��(��֝0ӝ��R?5��������޷�6�~ ��KZ���SFa���э��M���^��;��ac|`io�r_^zhRv�Z��gn���Ϭ�U�  �h`-��7���Ӳۮ�/�����+D� \t�C�VʳC�ܲ��nY���O|j�ϩ�R�ర2�0�����ݵ4p�Ρ,��Z,K�m��O��n���m�e�閻h�б��b��+x��]�R���eG���٩@�B�n�h���*%T���_6���x����V��F뱅f�OP��V�sAG���C~KX� ��x���
�G�h���W_?���N(����蓾�n�Sn �� :���\�������w�GI#����HW������oH%���w�R}�t�=���џդK��*�ֿF�?�����L��� jO���%eQ��'}��.)��C,2C�*��-9�h��r�]�J���7}��F��3W��+�.�F�"Hd�N2!wr��I�a����� W��aXo憎�ҷ�V��c�жC��� �ʕ�C�8���xt?�~:����j�� ����Z����Z������ ��� �1{CuWQ�����}`o�x؂P�������GS�A�v�W+[��m�m�����ͣ�©��*n�d���<5/I��j�}E�F��?F��$D:<eڈ��mYm�/����Ю�
�blWW�0��D�~��V&�Ri��J٨��kP2�7�i�����!��۵�y�-��}<9���z�iU�4� K{kD���X=��$��������S� �.w}�
{Vv�xv�Z+A��F-dlc�Q���l~�j�Z;v���g�؈ʱ�K_�J��k���?IkԬ~�'�3#�̡����V��x�ԧ�~u:~�=�4&�� ��M&c�LQ��U��U�hL��5��b���>Վ�������q����G���Vw�#�F�{_��B�����ۻ/������ ��%�V�(}%�{�{��ޅ��~Ek_���ч�7�� Z�/�F��B��ţvX���DǷ���d�2HuO�v0!�����b�<���#L��~:�����id_�̻�՟�(M��m.gjӆ�b|E������S����xF�0RY�P�XCI�Ll�]�]��ܑ���8m=�W�������n����p�w�ۅ��/�?��%~"ޙ��~���	!۫������3�$o��R���;�h��CGv?((�;A�_�&<}�W��>��,q��.=�?��	{c��9��s���Z�;W�� ���v��B�:ŠrV��XC�f\�#j��*H��Oz}(24׼Y�45cv�ឌ�c:�� �����SL�_�ߵ��Q��h� On��l��\�r9Y9�I]�,��B�� ��V�3u�ٸZ�Ŷ����I����w^�oc}iǶ�{��N5���c㡐i7=��d8���Yݖ[�j�H� ���ò�pqQr��|h�:����A��Yؐ�� o��3z�W�"9�����5x�t�VU~�ݸ|Վ�������7��~�h�;�V���s|�zi�� �{Y�����Gp�0.����wMY����«jZ��٬��߳�R?4��<zh�*�����h�Z��j����v��#�_bi0ހ:v�˵��&s���l8�>+W���i�pUͪI���Hxm�0ַ}p� ك�`i4��}KZ/���ӄA��Ѭ����i��};���m����k4����W��i@�xڌm"&60>�\�O�U?������?�xw��+ې��S���6Z�1c�G�(�V���w
6��e�>E=:W���7#�o�QZ���� ��A�t(--�����:�����6���N�PYc�#�6��C�-:���2{2q�v\��:�����ʵ]�"�RZ���;+��;��C$�%�ҩ������\��p�UөV��VL�!��Q�]��+4�u�"nA>�o�Ňև� cH	�p����\B�5�YA�ev;��=Ƿ*�m�&����U�hV���JkC#�Z+(iuW�J������X�:m\:�CN���U~]Y:�?-��,���E��D+u�4xr4j���v�
���V+.f�U;I�W�T:d0�n����/���k/� L����uye�����GJ�����I4���6�_���z��8��ʨi�T�}`��X���"�t�6	�mdt�2�>���0��߱�1�mg�h𣢅�:�Hgs4��Q���)�pnQ�k��6����?.���w���}��:�g�]"2F��trz4i�eV&D�4�6��q�	����с͑��18�!�Lv7K��u�Z��S0�ѐAp�6�Y�ǖ����D��^V�}DK�a_Y]:� �cT#��N�+!�U_�V)��A�s���{<cf�	�_Q]�xq�!b�0�m��I�W�@�ֶN�Y~o]b ��\!�VGX�C5
�M�]�(���싐vSw]ݧݩ�gU�Q�*5~iP�~��U�:�T���������j5Q��dju�ҮN�U~mU^�?7���@S5x�:�*���H��;b �ѳ%�#\�\!<��G���0�x�"���&!��Hx�C㠖<�F&�����o�%�'Z���v�T�dў	����f�k#�@�5����_�V_�VGU��� ��Є5���h{d:8�~xQ�94��0�;�ϕ����Q���7�rl�����
l_H�*�}4y�h��ƌ��Ƽ/��}&~����Ġ�!r��������`Ub�F�d�$k�#B�h֍
�xll1��g������x#_OuV/ڙ-��z��(uZ�!��!�W�O�,1F��Amx�kD��%��/��}<k��^����x�1x�����-	��1�۲+��4]��R(�ұ}3B�/����*J�S/��><3c�20���# path-scurry

Extremely high performant utility for building tools that read
the file system, minimizing filesystem and path string munging
operations to the greatest degree possible.

## Ugh, yet another file traversal thing on npm?

Yes. None of the existing ones gave me exactly what I wanted.

## Well what is it you wanted?

While working on [glob](http://npm.im/glob), I found that I
needed a module to very efficiently manage the traversal over a
folder tree, such that:

1. No `readdir()` or `stat()` would ever be called on the same
   file or directory more than one time.
2. No `readdir()` calls would be made if we can be reasonably
   sure that the path is not a directory. (Ie, a previous
   `readdir()` or `stat()` covered the path, and
   `ent.isDirectory()` is false.)
3. `path.resolve()`, `dirname()`, `basename()`, and other
   string-parsing/munging operations are be minimized. This
   means it has to track "provisional" child nodes that may not
   exist (and if we find that they _don't_ exist, store that
   information as well, so we don't have to ever check again).
4. The API is not limited to use as a stream/iterator/etc. There
   are many cases where an API like node's `fs` is preferrable.
5. It's more important to prevent excess syscalls than to be up
   to date, but it should be smart enough to know what it
   _doesn't_ know, and go get it seamlessly when requested.
6. Do not blow up the JS heap allocation if operating on a
   directory with a huge number of entries.
7. Handle all the weird aspects of Windows paths, like UNC paths
   and drive letters and wrongway slashes, so that the consumer
   can return canonical platform-specific paths without having to
   parse or join or do any error-prone string munging.

## PERFORMANCE

JavaScript people throw around the word "blazing" a lot. I hope
that this module doesn't blaze anyone. But it does go very fast,
in the cases it's optimized for, if used properly.

PathScurry provides ample opportunities to get extremely good
performance, as well as several options to trade performance for
convenience.

Benchmarks can be run by executing `npm run bench`.

As is always the case, doing more means going slower, doing
less means going faster, and there are trade offs between speed
and memory usage.

PathScurry makes heavy use of [LRUCache](http://npm.im/lru-cache)
to efficiently cache whatever it can, and `Path` objects remain
in the graph for the lifetime of the walker, so repeated calls
with a single PathScurry object will be extremely fast. However,
adding items to a cold cache means "doing more", so in those
cases, we pay a price. Nothing is free, but every effort has been
made to reduce costs wherever possible.

Also, note that a "cache as long as possible" approach means that
changes to the filesystem may not be reflected in the results of
repeated PathScurry operations.

For resolving string paths, `PathScurry` ranges from 5-50 times
faster than `path.resolve` on repeated resolutions, but around
100 to 1000 times _slower_ on the first resolution. If your
program is spending a lot of time resolving the _same_ paths
repeatedly (like, thousands or millions of times), then this can
be beneficial. But both implementations are pretty fast, and
speeding up an infrequent operation from 4µs to 400ns is not
going to move the needle on your app's performance.

For walking file system directory trees, a lot depends on how
often a given PathScurry object will be used, and also on the
walk method used.

With default settings on a folder tree of 100,000 items,
consisting of around a 10-to-1 ratio of normal files to
directories, PathScurry performs comparably to
[@nodelib/fs.walk](http://npm.im/@nodelib/fs.walk), which is the
fastest and most reliable file system walker I could find. As
far as I can tell, it's almost impossible to go much faster in a
Node.js program, just based on how fast you can push syscalls out
to the fs thread pool.

On my machine, that is about 1000-1200 completed walks per second
for async or stream walks, and around 500-600 walks per second
synchronously.

In the warm cache state, PathScurry's performance increases
around 4x for async `for await` iteration, 10-15x faster for
streams and synchronous `for of` iteration, and anywhere from 30x
to 80x faster for the rest.

```
# walk 100,000 fs entries, 10/1 file/dir ratio
# operations / ms
 New PathScurry object  |  Reuse PathScurry object
     stream:  1112.589  |  13974.917
sync stream:   492.718  |  15028.343
 async walk:  1095.648  |  32706.395
  sync walk:   527.632  |  46129.772
 async iter:  1288.821  |   5045.510
  sync iter:   498.496  |  17920.746
```

A hand-rolled walk calling `entry.readdir()` and recursing
through the entries can benefit even more from caching, with
greater flexibility and without the overhead of streams or
generators.

The cold cache state is still limited by the costs of file system
operations, but with a warm cache, the only bottleneck is CPU
speed and VM optimizations. Of course, in that case, some care
must be taken to ensure that you don't lose performance as a
result of silly mistakes, like calling `readdir()` on entries
that you know are not directories.

```
# manual recursive iteration functions
      cold cache  |  warm cache
async:  1164.901  |  17923.320
   cb:  1101.127  |  40999.344
zalgo:  1082.240  |  66689.936
 sync:   526.935  |  87097.591
```

In this case, the speed improves by around 10-20x in the async
case, 40x in the case of using `entry.readdirCB` with protections
against synchronous callbacks, and 50-100x with callback
deferrals disabled, and _several hundred times faster_ for
synchronous iteration.

If you can think of a case that is not covered in these
benchmarks, or an implementation that performs significantly
better than PathScurry, please [let me
know](https://github.com/isaacs/path-scurry/issues).

## USAGE

```ts
// hybrid module, load with either method
import { PathScurry, Path } from 'path-scurry'
// or:
const { PathScurry, Path } = require('path-scurry')

// very simple example, say we want to find and
// delete all the .DS_Store files in a given path
// note that the API is very similar to just a
// naive walk with fs.readdir()
import { unlink } from 'fs/promises'

// easy way, iterate over the directory and do the thing
const pw = new PathScurry(process.cwd())
for await (const entry of pw) {
  if (entry.isFile() && entry.name === '.DS_Store') {
    unlink(entry.fullpath())
  }
}

// here it is as a manual recursive method
const walk = async (entry: Path) => {
  const promises: Promise<any> = []
  // readdir doesn't throw on non-directories, it just doesn't
  // return any entries, to save stack trace costs.
  // Items are returned in arbitrary unsorted order
  for (const child of await pw.readdir(entry)) {
    // each child is a Path object
    if (child.name === '.DS_Store' && child.isFile()) {
      // could also do pw.resolve(entry, child.name),
      // just like fs.readdir walking, but .fullpath is
      // a *slightly* more efficient shorthand.
      promises.push(unlink(child.fullpath()))
    } else if (child.isDirectory()) {
      promises.push(walk(child))
    }
  }
  return Promise.all(promises)
}

walk(pw.cwd).then(() => {
  console.log('all .DS_Store files removed')
})

const pw2 = new PathScurry('/a/b/c') // pw2.cwd is the Path for /a/b/c
const relativeDir = pw2.cwd.resolve('../x') // Path entry for '/a/b/x'
const relative2 = pw2.cwd.resolve('/a/b/d/../x') // same path, same entry
assert.equal(relativeDir, relative2)
```

## API

[Full TypeDoc API](https://isaacs.github.io/path-scurry)

There are platform-specific classes exported, but for the most
part, the default `PathScurry` and `Path` exports are what you
most likely need, unless you are testing behavior for other
platforms.

Intended public API is documented here, but the full
documentation does include internal types, which should not be
accessed directly.

### Interface `PathScurryOpts`

The type of the `options` argument passed to the `PathScurry`
constructor.

- `nocase`: Boolean indicating that file names should be compared
  case-insensitively. Defaults to `true` on darwin and win32
  implementations, `false` elsewhere.

  **Warning** Performing case-insensitive matching on a
  case-sensitive filesystem will result in occasionally very
  bizarre behavior. Performing case-sensitive matching on a
  case-insensitive filesystem may negatively impact performance.

- `childrenCacheSize`: Number of child entries to cache, in order
  to speed up `resolve()` and `readdir()` calls. Defaults to
  `16 * 1024` (ie, `16384`).

  Setting it to a higher value will run the risk of JS heap
  allocation errors on large directory trees. Setting it to `256`
  or smaller will significantly reduce the construction time and
  data consumption overhead, but with the downside of operations
  being slower on large directory trees. Setting it to `0` will
  mean that effectively no operations are cached, and this module
  will be roughly the same speed as `fs` for file system
  operations, and _much_ slower than `path.resolve()` for
  repeated path resolution.

- `fs` An object that will be used to override the default `fs`
  methods. Any methods that are not overridden will use Node's
  built-in implementations.

  - lstatSync
  - readdir (callback `withFileTypes` Dirent variant, used for
    readdirCB and most walks)
  - readdirSync
  - readlinkSync
  - realpathSync
  - promises: Object containing the following async methods:
    - lstat
    - readdir (Dirent variant only)
    - readlink
    - realpath

### Interface `WalkOptions`

The options object that may be passed to all walk methods.

- `withFileTypes`: Boolean, default true. Indicates that `Path`
  objects should be returned. Set to `false` to get string paths
  instead.
- `follow`: Boolean, default false. Attempt to read directory
  entries from symbolic links. Otherwise, only actual directories
  are traversed. Regardless of this setting, a given target path
  will only ever be walked once, meaning that a symbolic link to
  a previously traversed directory will never be followed.

  Setting this imposes a slight performance penalty, because
  `readlink` must be called on all symbolic links encountered, in
  order to avoid infinite cycles.

- `filter`: Function `(entry: Path) => boolean`. If provided,
  will prevent the inclusion of any entry for which it returns a
  falsey value. This will not prevent directories from being
  traversed if they do not pass the filter, though it will
  prevent the directories themselves from being included in the
  results. By default, if no filter is provided, then all
  entries are included in the results.
- `walkFilter`: Function `(entry: Path) => boolean`. If
  provided, will prevent the traversal of any directory (or in
  the case of `follow:true` symbolic links to directories) for
  which the function returns false. This will not prevent the
  directories themselves from being included in the result set.
  Use `filter` for that.

Note that TypeScript return types will only be inferred properly
from static analysis if the `withFileTypes` option is omitted, or
a constant `true` or `false` value.

### Class `PathScurry`

The main interface. Defaults to an appropriate class based on
the current platform.

Use `PathScurryWin32`, `PathScurryDarwin`, or `PathScurryPosix`
if implementation-specific behavior is desired.

All walk methods may be called with a `WalkOptions` argument to
walk over the object's current working directory with the
supplied options.

#### `async pw.walk(entry?: string | Path | WalkOptions, opts?: WalkOptions)`

Walk the directory tree according to the options provided,
resolving to an array of all entries found.

#### `pw.walkSync(entry?: string | Path | WalkOptions, opts?: WalkOptions)`

Walk the directory tree according to the options provided,
returning an array of all entries found.

#### `pw.iterate(entry?: string | Path | WalkOptions, opts?: WalkOptions)`

Iterate over the directory asynchronously, for use with `for
await of`. This is also the default async iterator method.

#### `pw.iterateSync(entry?: string | Path | WalkOptions, opts?: WalkOptions)`

Iterate over the directory synchronously, for use with `for of`.
This is also the default sync iterator method.

#### `pw.stream(entry?: string | Path | WalkOptions, opts?: WalkOptions)`

Return a [Minipass](http://npm.im/minipass) stream that emits
each entry or path string in the walk. Results are made
available asynchronously.

#### `pw.streamSync(entry?: string | Path | WalkOptions, opts?: WalkOptions)`

Return a [Minipass](http://npm.im/minipass) stream that emits
each entry or path string in the walk. Results are made
available synchronously, meaning that the walk will complete in a
single tick if the stream is fully consumed.

#### `pw.cwd`

Path object representing the current working directory for the
PathScurry.

#### `pw.chdir(path: string)`

Set the new effective current working directory for the scurry
object, so that `path.relative()` and `path.relativePosix()`
return values relative to the new cwd path.

#### `pw.depth(path?: Path | string): number`

Return the depth of the specified path (or the PathScurry cwd)
within the directory tree.

Root entries have a depth of `0`.

#### `pw.resolve(...paths: string[])`

Caching `path.resolve()`.

Significantly faster than `path.resolve()` if called repeatedly
with the same paths. Significantly slower otherwise, as it
builds out the cached Path entries.

To get a `Path` object resolved from the `PathScurry`, use
`pw.cwd.resolve(path)`. Note that `Path.resolve` only takes a
single string argument, not multiple.

#### `pw.resolvePosix(...paths: string[])`

Caching `path.resolve()`, but always using posix style paths.

This is identical to `pw.resolve(...paths)` on posix systems (ie,
everywhere except Windows).

On Windows, it returns the full absolute UNC path using `/`
separators. Ie, instead of `'C:\\foo\\bar`, it would return
`//?/C:/foo/bar`.

#### `pw.relative(path: string | Path): string`

Return the relative path from the PathWalker cwd to the supplied
path string or entry.

If the nearest common ancestor is the root, then an absolute path
is returned.

#### `pw.relativePosix(path: string | Path): string`

Return the relative path from the PathWalker cwd to the supplied
path string or entry, using `/` path separators.

If the nearest common ancestor is the root, then an absolute path
is returned.

On posix platforms (ie, all platforms except Windows), this is
identical to `pw.relative(path)`.

On Windows systems, it returns the resulting string as a
`/`-delimited path. If an absolute path is returned (because the
target does not share a common ancestor with `pw.cwd`), then a
full absolute UNC path will be returned. Ie, instead of
`'C:\\foo\\bar`, it would return `//?/C:/foo/bar`.

#### `pw.basename(path: string | Path): string`

Return the basename of the provided string or Path.

#### `pw.dirname(path: string | Path): string`

Return the parent directory of the supplied string or Path.

#### `async pw.readdir(dir = pw.cwd, opts = { withFileTypes: true })`

Read the directory and resolve to an array of strings if
`withFileTypes` is explicitly set to `false` or Path objects
otherwise.

Can be called as `pw.readdir({ withFileTypes: boolean })` as
well.

Returns `[]` if no entries are found, or if any error occurs.

Note that TypeScript return types will only be inferred properly
from static analysis if the `withFileTypes` option is omitted, or
a constant `true` or `false` value.

#### `pw.readdirSync(dir = pw.cwd, opts = { withFileTypes: true })`

Synchronous `pw.readdir()`

#### `async pw.readlink(link = pw.cwd, opts = { withFileTypes: false })`

Call `fs.readlink` on the supplied string or Path object, and
return the result.

Can be called as `pw.readlink({ withFileTypes: boolean })` as
well.

Returns `undefined` if any error occurs (for example, if the
argument is not a symbolic link), or a `Path` object if
`withFileTypes` is explicitly set to `true`, or a string
otherwise.

Note that TypeScript return types will only be inferred properly
from static analysis if the `withFileTypes` option is omitted, or
a constant `true` or `false` value.

#### `pw.readlinkSync(link = pw.cwd, opts = { withFileTypes: falsess.\n *\n * Most developers will not need to access this class directly;\n * it is exposed for advanced use cases.\n */\nexport class QueueStore {\n    /**\n     * Associates this instance with a Queue instance, so entries added can be\n     * identified by their queue name.\n     *\n     * @param {string} queueName\n     */\n    constructor(queueName) {\n        this._queueName = queueName;\n        this._queueDb = new QueueDb();\n    }\n    /**\n     * Append an entry last in the queue.\n     *\n     * @param {Object} entry\n     * @param {Object} entry.requestData\n     * @param {number} [entry.timestamp]\n     * @param {Object} [entry.metadata]\n     */\n    async pushEntry(entry) {\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isType(entry, 'object', {\n                moduleName: 'workbox-background-sync',\n                className: 'QueueStore',\n                funcName: 'pushEntry',\n                paramName: 'entry',\n            });\n            assert.isType(entry.requestData, 'object', {\n                moduleName: 'workbox-background-sync',\n                className: 'QueueStore',\n                funcName: 'pushEntry',\n                paramName: 'entry.requestData',\n            });\n        }\n        // Don't specify an ID since one is automatically generated.\n        delete entry.id;\n        entry.queueName = this._queueName;\n        await this._queueDb.addEntry(entry);\n    }\n    /**\n     * Prepend an entry first in the queue.\n     *\n     * @param {Object} entry\n     * @param {Object} entry.requestData\n     * @param {number} [entry.timestamp]\n     * @param {Object} [entry.metadata]\n     */\n    async unshiftEntry(entry) {\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isType(entry, 'object', {\n                moduleName: 'workbox-background-sync',\n                className: 'QueueStore',\n                funcName: 'unshiftEntry',\n                paramName: 'entry',\n            });\n            assert.isType(entry.requestData, 'object', {\n                moduleName: 'workbox-background-sync',\n                className: 'QueueStore',\n                funcName: 'unshiftEntry',\n                paramName: 'entry.requestData',\n            });\n        }\n        const firstId = await this._queueDb.getFirstEntryId();\n        if (firstId) {\n            // Pick an ID one less than the lowest ID in the object store.\n            entry.id = firstId - 1;\n        }\n        else {\n            // Otherwise let the auto-incrementor assign the ID.\n            delete entry.id;\n        }\n        entry.queueName = this._queueName;\n        await this._queueDb.addEntry(entry);\n    }\n    /**\n     * Removes and returns the last entry in the queue matching the `queueName`.\n     *\n     * @return {Promise<QueueStoreEntry|undefined>}\n     */\n    async popEntry() {\n        return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName));\n    }\n    /**\n     * Removes and returns the first entry in the queue matching the `queueName`.\n     *\n     * @return {Promise<QueueStoreEntry|undefined>}\n     */\n    async shiftEntry() {\n        return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName));\n    }\n    /**\n     * Returns all entries in the store matching the `queueName`.\n     *\n     * @param {Object} options See {@link workbox-background-sync.Queue~getAll}\n     * @return {Promise<Array<Object>>}\n     */\n    async getAll() {\n        return await this._queueDb.getAllEntriesByQueueName(this._queueName);\n    }\n    /**\n     * Returns the number of entries in the store matching the `queueName`.\n     *\n     * @param {Object} options See {@link workbox-background-sync.Queue~size}\n     * @return {Promise<number>}\n     */\n    async size() {\n        return await this._queueDb.getEntryCountByQueueName(this._queueName);\n    }\n    /**\n     * Deletes the entry for the given ID.\n     *\n     * WARNING: this method does not ensure the deleted entry belongs to this\n     * queue (i.e. matches the `queueName`). But this limitation is acceptable\n     * as this class is not publicly exposed. An additional check would make\n     * this method slower than it needs to be.\n     *\n     * @param {number} id\n     */\n    async deleteEntry(id) {\n        await this._queueDb.deleteEntry(id);\n    }\n    /**\n     * Removes and returns the first or last entry in the queue (based on the\n     * `direction` argument) matching the `queueName`.\n     *\n     * @return {Promise<QueueStoreEntry|undefined>}\n     * @private\n     */\n    async _removeEntry(entry) {\n        if (entry) {\n            await this.deleteEntry(entry.id);\n        }\n        return entry;\n    }\n}\n","/*\n  Copyright 2018 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { assert } from 'workbox-core/_private/assert.js';\nimport '../_version.js';\nconst serializableProperties = [\n    'method',\n    'referrer',\n    'referrerPolicy',\n    'mode',\n    'credentials',\n    'cache',\n    'redirect',\n    'integrity',\n    'keepalive',\n];\n/**\n * A class to make it easier to serialize and de-serialize requests so they\n * can be stored in IndexedDB.\n *\n * Most developers will not need to access this class directly;\n * it is exposed for advanced use cases.\n */\nclass StorableRequest {\n    /**\n     * Converts a Request object to a plain object that can be structured\n     * cloned or JSON-stringified.\n     *\n     * @param {Request} request\n     * @return {Promise<StorableRequest>}\n     */\n    static async fromRequest(request) {\n        const requestData = {\n            url: request.url,\n            headers: {},\n        };\n        // Set the body if present.\n        if (request.method !== 'GET') {\n            // Use ArrayBuffer to support non-text request bodies.\n            // NOTE: we can't use Blobs becuse Safari doesn't support storing\n            // Blobs in IndexedDB in some cases:\n            // https://github.com/dfahlander/Dexie.js/issues/618#issuecomment-398348457\n            requestData.body = await request.clone().arrayBuffer();\n        }\n        // Convert the headers from an iterable to an object.\n        for (const [key, value] of request.headers.entries()) {\n            requestData.headers[key] = value;\n        }\n        // Add all other serializable request properties\n        for (const prop of serializableProperties) {\n            if (request[prop] !== undefined) {\n                requestData[prop] = request[prop];\n            }\n        }\n        return new StorableRequest(requestData);\n    }\n    /**\n     * Accepts an object of request data that can be used to construct a\n     * `Request` but can also be stored in IndexedDB.\n     *\n     * @param {Object} requestData An object of request data that includes the\n     *     `url` plus any relevant properties of\n     *     [requestInit]{@link https://fetch.spec.whatwg.org/#requestinit}.\n     */\n    constructor(requestData) {\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isType(requestData, 'object', {\n                moduleName: 'workbox-background-sync',\n                className: 'StorableRequest',\n                funcName: 'constructor',\n                paramName: 'requestData',\n            });\n            assert.isType(requestData.url, 'string', {\n                moduleName: 'workbox-background-sync',\n                className: 'StorableRequest',\n                funcName: 'constructor',\n                paramName: 'requestData.url',\n            });\n        }\n        // If the request's mode is `navigate`, convert it to `same-origin` since\n        // navigation requests can't be constructed via script.\n        if (requestData['mode'] === 'navigate') {\n            requestData['mode'] = 'same-origin';\n        }\n        this._requestData = requestData;\n    }\n    /**\n     * Returns a deep clone of the instances `_requestData` object.\n     *\n     * @return {Object}\n     */\n    toObject() {\n        const requestData = Object.assign({}, this._requestData);\n        requestData.headers = Object.assign({}, this._requestData.headers);\n        if (requestData.body) {\n            requestData.body = requestData.body.slice(0);\n        }\n        return requestData;\n    }\n    /**\n     * Converts this instance to a Request.\n     *\n     * @return {Request}\n     */\n    toRequest() {\n        return new Request(this._requestData.url, this._requestData);\n    }\n    /**\n     * Creates and returns a deep clone of the instance.\n     *\n     * @return {StorableRequest}\n     */\n    clone() {\n        return new StorableRequest(this.toObject());\n    }\n}\nexport { StorableRequest };\n","/*\n  Copyright 2018 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { WorkboxError } from 'workbox-core/_private/WorkboxError.js';\nimport { logger } from 'workbox-core/_private/logger.js';\nimport { assert } from 'workbox-core/_private/assert.js';\nimport { getFriendlyURL } from 'workbox-core/_private/getFriendlyURL.js';\nimport { QueueStore } from './lib/QueueStore.js';\nimport { StorableRequest } from './lib/StorableRequest.js';\nimport './_version.js';\nconst TAG_PREFIX = 'workbox-background-sync';\nconst MAX_RETENTION_TIME = 60 * 24 * 7; // 7 days in minutes\nconst queueNames = new Set();\n/**\n * Converts a QueueStore entry into the format exposed by Queue. This entails\n * converting the request data into a real request and omitting the `id` and\n * `queueName` properties.\n *\n * @param {UnidentifiedQueueStoreEntry} queueStoreEntry\n * @return {Queue}\n * @private\n */\nconst convertEntry = (queueStoreEntry) => {\n    const queueEntry = {\n        request: new StorableRequest(queueStoreEntry.requestData).toRequest(),\n        timestamp: queueStoreEntry.timestamp,\n    };\n    if (queueStoreEntry.metadata) {\n        queueEntry.metadata = queueStoreEntry.metadata;\n    }\n    return queueEntry;\n};\n/**\n * A class to manage storing failed requests in IndexedDB and retrying them\n * later. All parts of the storing and replaying process are observable via\n * callbacks.\n *\n * @memberof workbox-background-sync\n */\nclass Queue {\n    /**\n     * Creates an instance of Queue with the given options\n     *\n     * @param {string} name The unique name for this queue. This name must be\n     *     unique as it's used to register sync events and store requests\n     *     in IndexedDB specific to this instance. An error will be thrown if\n     *     a duplicate name is detected.\n     * @param {Object} [options]\n     * @param {Function} [options.onSync] A function that gets invoked whenever\n     *     the 'sync' event fires. The function is invoked with an object\n     *     containing the `queue` property (referencing this instance), and you\n     *     can use the callback to customize the replay behavior of the queue.\n     *     When not set the `replayRequests()` method is called.\n     *     Note: if the replay fails after a sync event, make sure you throw an\n     *     error, so the browser knows to retry the sync event later.\n     * @param {number} [options.maxRetentionTime=7 days] The amount of time (in\n     *     minutes) a request may be retried. After this amount of time has\n     *     passed, the request will be deleted from the queue.\n     * @param {boolean} [options.forceSyncFallback=false] If `true`, instead\n     *     of attempting to use background sync events, always attempt to replay\n     *     queued request at service worker startup. Most folks will not need\n     *     this, unless you explicitly target a runtime like Electron that\n     *     exposes the interfaces for background sync, but does not have a working\n     *     implementation.\n     */\n    constructor(name, { forceSyncFallback, onSync, maxRetentionTime } = {}) {\n        this._syncInProgress = false;\n        this._requestsAddedDuringSync = false;\n        // Ensure the store name is not already being used\n        if (queueNames.has(name)) {\n            throw new WorkboxError('duplicate-queue-name', { name });\n        }\n        else {\n            queueNames.add(name);\n        }\n        this._name = name;\n        this._onSync = onSync || this.replayRequests;\n        this._maxRetentionTime = maxRetentionTime || MAX_RETENTION_TIME;\n        this._forceSyncFallback = Boolean(forceSyncFallback);\n        this._queueStore = new QueueStore(this._name);\n        this._addSyncListener();\n    }\n    /**\n     * @return {string}\n     */\n    get name() {\n        return this._name;\n    }\n    /**\n     * Stores the passed request in IndexedDB (with its timestamp and any\n     * metadata) at the end of the queue.\n     *\n     * @param {QueueEntry} entry\n     * @param {Request} entry.request The request to store in the queue.\n     * @param {Object} [entry.metadata] Any metadata you want associated with the\n     *     stored request. When requests are replayed you'll have access to this\n     *     metadata object in case you need to modify the request beforehand.\n     * @param {number} [entry.timestamp] The timestamp (Epoch time in\n     *     milliseconds) when the request was first added to the queue. This is\n     *     used along with `maxRetentionTime` to remove outdated requests. In\n     *     general you don't need to set this value, as it's automatically set\n     *     for you (defaulting to `Date.now()`), but you can update it if you\n     *     don't want particular requests to expire.\n     */\n    async pushRequest(entry) {\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isType(entry, 'object', {\n                moduleName: 'workbox-background-sync',\n                className: 'Queue',\n                funcName: 'pushRequest',\n                paramName: 'entry',\n            });\n            assert.isInstance(entry.request, Request, {\n                moduleName: 'workbox-background-sync',\n                className: 'Queue',\n                funcName: 'pushRequest',\n                paramName: 'entry.request',\n            });\n        }\n        await this._addRequest(entry, 'push');\n    }\n    /**\n     * Stores the passed request in IndexedDB (with its timestamp and any\n     * metadata) at the beginning of the queue.\n     *\n     * @param {QueueEntry} entry\n     * @param {Request} entry.request The request to store in the queue.\n     * @param {Object} [entry.metadata] Any metadata you want associated with the\n     *     stored request. When requests are replayed you'll have access to this\n     *     metadata object in case you need to modify the request beforehand.\n     * @param {number} [entry.timestamp] The timestamp (Epoch time in\n     *     milliseconds) when the request was first added to the queue. This is\n     *     used along with `maxRetentionTime` to remove outdated requests. In\n     *     general you don't need to set this value, as it's automatically set\n     *     for you (defaulting to `Date.now()`), but you can update it if you\n     *     don't want particular requests to expire.\n     */\n    async unshiftRequest(entry) {\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isType(entry, 'object', {\n                moduleName: 'workbox-background-sync',\n                className: 'Queue',\n                funcName: 'unshiftRequest',\n                paramName: 'entry',\n            });\n            assert.isInstance(entry.request, Request, {\n                moduleName: 'workbox-background-sync',\n                className: 'Queue',\n                funcName: 'unshiftRequest',\n                paramName: 'entry.request',\n            });\n        }\n        await this._addRequest(entry, 'unshift');\n    }\n    /**\n     * Removes and returns the last request in the queue (along with its\n     * timestamp and any metadata). The returned object takes the form:\n     * `{request, timestamp, metadata}`.\n     *\n     * @return {Promise<QueueEntry | undefined>}\n     */\n    async popRequeimport _default from './commaListsAnd';
export { _default as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzQW5kL2luZGV4LmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiXSwibWFwcGluZ3MiOiJxQkFBb0IsaUI7cUJBQWJBLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmcm9tICcuL2NvbW1hTGlzdHNBbmQnO1xuIl19                                                                                                                        t�^rQMZ��D,���xWd�Z�vG�,�}��ݕ��]�Z��rjڞ&M����`��;/��Q��d��X*�0пK�6����'��{	Z�v��;ְgO�s�-�A�+ �� �nݮ��e�v��Se������՟�}޲Sz����h��az\&�:<�mLlX�>ȟ��:c�k@������/�D��-&2I�Ө��weK+ �̯�>�O�"�3�v'u�z��獭������v��D��jO�5�Yov��$�.I���F��!��\/��K�Y��"�wX���>Pͧ�m��D ���:�Qo,���N���nZ6�p�w{�پ��SWI�v #�kRvSң�Z˿s:��"~$m��I���#tҚ�=�e��9G�������wy��;c^�+�A���Q��gw�q�1���h����u9<���b��/|���w�l��J*ı׆ݩmɥi���J�B��:�Z�wh�d9[��ӷ����E����U=����ߣ��\-)�ډ��L�V�c�5�~�vj����X��:]Rp� #	�N��b�S�r�*��r�wlp��-?�[E�ľ(t(��+���g�!�Ϋg�fdI��Iw�����j]�]�\)�$g˧�/O�Lݽ	*Q�����o�������#��K�����&�,�Яs;�{�{�um"iJP�}�C��d1޸�r��i�5k��<�J�T:"f�U�Aƅ�֣�(� ܊�a~ ����~�9'\��t~����G�ݮ{ u��N�*���w=�o�ᝌ�`��pv=-Ǿ�{����v'��GfgZ�싄ѻ��7�>�]�U��J�N4�/���M"?0�N+W�f�j_m"^����'�Lܸd�?g%�w�{�C�7-���iC���)�k�?��+8N�cK��yɻ!�'�=5����+���
��b�a�]YC������X�@3����j:��f[�i�o�{AzC���٩�0{R��(�e���ՙݧ���:jU��0A��G~���?:�I��r}�2���V���n���Pwbk�ڶ�� �G��-V"�*�p�K#"�P��O�i'��Ll�fsӏt���Vgv��;5/Ff����훫[����͓᭫J��TC)�,�x��Q�7�p���&��>=\+C�X찱�Qo��+��=7�N�;��^`T���`Z��Z=�xE5�(���G�����62�=�t�8W�YEp	��^��.ܿ�n3�e;q�H!y�i�b�c,���+(�0W=s��٨��t�c�3�^�)�a�|�g((��e�{���X�ݥ\�����N�"�e��� ��+*�{�b*þ��߶V�ǧ� �c(�,W�e��U��ZewO<�g.����3�~60����LaaXji�zcu;s�{F���j-�t��h��·�=u��#�J<�z��(���Q�\z����l�L�쿨�iV��,�z��?~�}"�w1������)/�z��*��Z��wF���9zף����:�cO�:v��4RW�h�_�(�X��x��M�9��n�#��g��� �:r�%���}S���:)"'$�H����W��댭�IfX ����9^�Zt=�����"���9Z^&�E��b�Q�R�m�)� ��~N�9�<g�?�i� CJ��x�a�+=6���|N��4-ʰ�ר���}�ze7��������8J��������h�:�ѝ�_��b��ڒF�/���:��8Y.C`��&�Z7M��5OB9�s��n�C�j�����1�߮�u�����vE�P��h���'�	����|5h:�F;�5�0��Ӻ��G�ta,t2	�%X��W�%u��>(�m��Fr��Z�����`XV]��F
=,?�1�+��ip��Y��ݣ�}��˻�n��J�eg�G�xfs��z��++��YoƳ���K�A�B(����v�EI{��'d��y�G��C��9Z�aj�K���jx"��Ȅ:cU��Y��Y_)\��K�O&�C�'��"0�R;�R�&����ߦ���;Fe�"��`"�����j�w�i�;�&_6����|]*�0���s>7/^ʮ��t	��5<�N)�N�6��8kD��r�wkZ��1���9t��F��;��>0�++u����l��NI�y�M��ߐ\�;�;�僧� �j�����8\���=�j�~�J�'t)v����vu���击NԤ�Og�z𽠵ʛ���l�Z� ����o�9���g�2�lGn��Ί�:� ��jU���:��$d��6�Z5R��tz��v0�є޼�;����GŬ�����$r��(ʪ�J�=di�� #t�Y���`�924p�&՝՟��NL�C}j�<�d�F$0����v�p���X^ݺ(s����m��C�:��x����5Y$uK~~��ߍc�=k��XЦ���>��
Hİ��f�[3؅���cm�N��QV�wG�?5�E5&��޷I�� �^X(��;����Y��@XoBW
G�2����t7�J�f��*��zP����Q��.�Z5jo<������a꾑d фBo
�5
�Z�v���� O|�C�w�;��o��¸ͽq��v���^�G�Z�{Wz;���<a��{j��umFv̫�>���Y�g����oA��(�z)�(�N��@�vV���L����l�-M��c`�>���ӕ�3��k��GMZ==*ǂ��=��zʟO�2~�[��:]V(�׍�֭� ������n��|��3������YMK&d�uK�g��V:k���1۹A��潗՞�F^��;Ĳcr������d���up�=Jh����u�d����Z��|�?��G�'�q�x~��ݡr��w��Ƴ�\��R��&�]Ex�Q�9�ʎ,=��Vl�H�� �a;ѾQ���l��Gd
y.���ݥhr���ېzp�%���-:wJ~�2�Yn$��{�j���������q?��
���;�5�� Ц�U���u?�X��c���6�>��n�֪w�K�����5H�r�ؘ��;��/tnIJk�b� 90�#�:ֵ5wA�F�� #f��O~��� �>��',�~�0��,��U��1��g�wqf>�aWv.�Օ�q�.���"��=� 5������lZ�@�Mݖ}���ki�BN�tv��s�������i�+Lܶ'�����G���lZ��ݚŷBڰ�k+H�'n[���]��[C���}� ���g��ӟѨ� r�ʲ������
�=⥗T�4owj��i�5�^5�Z�ָ���_娭*�>�L"0�S������F�5��"��=G<R�qn{����&�V5��.��bg+����k�_������^P�fgc�'+�nU'�=�wM:>��k�۫�WZ���Wa|�R�D�TԋH-��\6��;r~���c?i��'��vȰ�Beg����-M*pQjvcU���l}8i���{��sC�rRΟk�����?u�=�l+Q��c� 8Z���{3���K�kK����Z�o�����N��}�=6Ƌ`O�e�@ݫ+9(��J{��Bܻܲ���O�oR��SG_��E��v�{�XC�'l�ŦwƉ٣(7졓�1�nyP�㇦��ɦI�ZR|Cu���+��V���ۥʭ�h����2��~-��''v���N��
N]��:'w��n�	�5k���Î�
���75����a���^F�Ȩ���?����Ԟ��Y���O~��K���,.Q�5^��1�����?���ɡM�]�uz�UYp�(���Ħ���s�٬��i{{Wh�cdU�)�iGn��з��׆���sVڢSVrq����M�-.��I���~����S�B.��{�;D�ғ�q�ȷ\ז�π�B>��u��-e��5���܆��t���5m�QiV-!#N�ۣ�{K��ݮ3������d�C�82�C� ߣ�ݚx�\�����u]<YmY��=;qZg?�t���?rkq�o��w��� �,�t������V��ح;,Bz���?�7��X��.QA;�XZ;�����	���eR��� ���'?��qߠ;��t�US_��c��A��9F&�:3��#�>V���7w,`�	P3��˚����e�lѶX���>��t6�e��/�t�"�7�+��N��nSN4}�ki�-�Op��9�ta����j��Pj�9��9��ms,�R���sE��)��=���=�ti4�Zj��)�l���{#ԠB�����'e:�3b�f�J۩���a�1�f�T՛ғ��v��=�䍋�9���U`���g��n� ��	�
�[�i�t����z��3�!���=g����Xrԫ�-��NY��yMnP�T�H4�M{��Dk�;*��S?��Ɂ������{��1����:ln,)�ڝ�Z�9�vy�ee�����"~E�i��o��)�$���&q��w��B��v�]��kU���օ���%�Ϧ�2��0��v�n�=Y�7�:C�#�j�G�L�[U�2��#/MYSن�jf��)߅��P�?t/k���n<?B��:a���P���O�z��)�ۦ��y<��Dl�d��ۧ��e��:��{=0p�������GŸEh��� ��S�7࠹^��(����RO-n�τc)o	�
C����p���t�l'Af����m�:Y�A�\�v����߷c�����7(���Oj#��w3*���p���櫤M�z< ���_��:iX���Q�H�7-{{]]���G�p��;�_r�m���.j��zz��
��inV
MN�`�LRkD#��*I���J�榊��^��.W��o�VwG��b	<]
+��`dv���W���\�����!�=2K6��ܹY��q�h�D���*��R݌OW��H9b%1���	�B~k��~/%=!�w1���-���;��1<���̛a�
s@�~7��e+Wd�&D�w:�����u��'t�@�[���S}���;P@姠�b�N�n��xuJ݆���5��T���Q��!բ﫠K�W*�;������X�����6�����$�"��QYg�M&�T�8���t�D�Ke�������h��2.z�\��R9Ι�9��� �8��磷Cf5���t'�M'�acㅜ㞚�=-^���UG��� �����t'��p�4/��:8�����^��ܗ���Y�*W�6&�<�;|���*c���ü��k������7k��)d��]ُ+j�l��&�dv��h����nu`�M�M�S�;��������,�aL��� {QD+pxݷ'�ÙtƖ�hE��B���nz��bࢉ��?3�"��UND�j:�z����'"~'�C���s��W��;�0�P{�l3�!;��y\#�C��'��`Cs^�%��lLp��Jy�"���G��H?�S�Y;�;Yʕz
g���p
������6��)�(öV]�r�0w;��C�Zw�1�s]�0đ?!e��1�=�|�i(C2HP���՟�[��$E�V��'�?;zzj c'5����w�0��Nr�l3�-�Z�)5�.Rڞb��r��b�����G��'ޙ9���۩�_S�}�i.pú��9G���_�Q���L��Go�ܰ|N�I9NElW�x�m�v��-z���^� �ޔ6�xEi�\��ګNS~�r�ݭ���b<�Ȝ�+2`@��B���wnpk�Nv��i�v{q�F��e7�7*fe�e���I$o�Jk����c]��`�t�Z�V�ggnv�9���)^牳6V�Vb-su"3䘲��mh�Dlo� �*��c�~歧�*ҵu+ε NEݜhz�d��5�T�.5{�P��7�t��<�q�b��w=	�7����3��,�.�#�6�T��Q�xU� ���[�H����$��ӷ\�֠:z aJ�����B�F㳥�a9F������վ0s�l�t��tO�vz9�=N�|9ac?F�o���Ak�btOfQR�9�;t
�"f����ظ������t���(����[K�Q+�*?�<Irӗ�f�'s��g���ȔVw�Q\��pߵ�w��^�PC�N�VHZ���*����O�U{��ۮ��O����H���j�	R�CJ�e�wG .���9�|-�9,�������r7]��8S7�л���6��!�1�	;�۞�^�x�kIc����~��Y�"~E�<� �!�@�q���p��.��v?&�������Lg�p�����Zn3�"CZ!;Z-Lի���G�I�ҙ[�b��?@��`9y�v(����SS��Y�l�ܧp�;�|����?1�ovp�y������5�v��j�v
y�l�8�{��g�����;�8C�~$([����� ����,8�L�V��G�dV6Az��
vw�ױ�Y[#����� �B��>��{�_�+5�8�3��
o�E��Q\�l�1�<Sѐj��,���ǢL���`�����h�9�&<Z+�hiR�t"T�]�C�Z����Ow{����ԡ�����ɜg�Tg�ţZ)�t+��s#Q@�e9��
�U�B#��
j!S��}-S��wZ����c(S������v��a������NA�°��B���b��ٔ6����h8tXfT/�`E6�[,P����#�O\���d�2ӕ��3�e����6��:W��?N���n3����Y۠؛v;N\Ka�rH2�Aa5���#?���4��@�8<�o=�"�r�,��wN�%�rP�ӭ�ōrg'V�ZM��Ȯ!�L�(wo�2��T��ƻ�I$�J*�ф�Z�r��`�x�߰�uS���E�ٔ���v|PN�?%�l˳�\��<�z$�Lm�g����PX��e#����4t	�1��#�$���H�OK�b�$,M9��y\)��^�\�^&Ie�Hʶ�ߤ���K���e���F2�/����5K�k�&~�-�<����%g5߇�ÿ�)t;lҵ� �#�=@�z:rG��.��ܖ6Kn����!G�A~�>��r���9{���f�[�C�����ĺ4S6�Vp�<*���o��fզq}�._W:������iW9���"n����$�����{�zr�#� �����;�����}���;��FT��>�{�:��gf�IN�����()�o��ÿu�OjH���wRwSB����wWUh�sM�����}5�p?C��wto�~��X�:��q�5�nNԮ�:͇<����R�疣t�#��92�iT��Xh�_�9?F��u�#�;��:N+���������U�Z���]���j5��G�i1#��a:�(k�˿0Ӧ��dZФ��<�o�-�A�5��H9�ʭI,��.�k��Ֆ���A�ְ��I�H�f\�����r�v ���z��]�֎�;C}���; ����x����XX_r�OC�aev��gy��!w��t�r�M����d1�K�jL�Z���oX>k5�\�Z�p�ss�"������Ѷ7�X$��C�4,�je���V���z�_��Q�Z�%�\���ü]�.:4o��;��z���������grn�N��uQ&�&&�nJ��ihCp:8��GbxU�ZvAFp�I|n���h�.GP���U������:�������P����e;��g����ޞ�D�!�Y{������rH��;7H;^՝�9�A�j+�����H�"�N�C��"���C.PGdQ8�u��U��o}2�ap&�Jw쀵�7�����ڷ�Q�#��:�t{7Dz;W䰄4z������i��~���&H���Q�(��%�rSz��Q����VX�2��[��r!gn��F\�A3��Z_ChE+S� ���my�����y ���W-0�Hխ�J;��5	B�Yw��[�b$�^�e���HCqy�{k�vE8w��8�@NX�G��ǅ�]�;�~�$��ђ�G��˺z�r��x��2���r}��%�9�=�;����m1��­U}%JߙC7r�m��xj�9��FzC21ѕ�r���p���X5�W�q��pJ�F���U�*�W>8�Vt�^�О���k���\��L}+Ӡ��s�)���>'��Ѻ�2Xx�&MтE|~SQ7K��Ѭc�^N�����"�L��.�+�<"V��G^��J�c,T�6:oKO�i�JԴ��A��A��1���4rW��F���B�Yʃ0U�L`�A�/��8���CW�-��^0���8ܮ����OtP�~�arr����)�P�Q
;��;"X���[�]Fz�������*N���n��B�	�j6�,�)�<i�m�e��o��%FH�Ь������_�e쯧��7-P�ʵY�Y������T��>���CV[���28����E}�M׎��xg۝�O�>&L��q��*U�Ɛ�'�s�KN�ٌXa�w�h�� ��Rou6�i���r���zk�=>�.i�\��Z��M#[؊�y]���*G�c�xj��`�6	۸�pG�þ6� n��t.Û���싔nʕ�lN�`X'����f��W����� ��nn�ڵ^&׎��6i�Xds��jK�7��t[Yo��&������%V`|I�Og���1�۠�� >���R��W��N��׵�[�Sr�4�6<t�1?�#c�IGL� �w�r��:�������
�p��\��s<'1������YC���5:�^�VZ��.��l�1�,v� �{&G5�w�65;��(��Ԯ�s���h2�a47�,�����9ĭA������NnSF�N��VS��8,s���t	�*XKLpp��������]^��-�p�,�����S�m�8���t���6&��� R1�����֞�#�	�+5F��Ƣj�F���1�'���?���+������-Zǖڦ��9������V�3k��ڊTI��p]�Y��9�w7=����W==�AY%��2�㵼;�3��C��o���큺?np�K�L�>�_XXG	�l�w�`r��]�h�#�h=���ˬI܃{�Õ�v=��w+�X^��d���)��О���f���7b=�^�5��;k�N��P�g�V��8&?�I~ ��j�N*�XR@�6�9Ge���7��^։�h#Rj�%�O��C�-2yأ�,�3Yp7/�h�/�܊vNY��	�D�P��K�+c0�O� �k�9�@������]j�uZ�?���ڕ�۰�$$9�!,�p�`�V���_���s�2��jro�89=2�7+��r#vL&4F�L�xC��)�-�F�;�m����Z�\�NO������� RB�MiC��)��,�z�<��ca#����KRv�XϷMo�Ǻ�X�N�����K^�y춽H�tS5�(����'�cp��~ v+���{����H���� ��GR�v�::����J� �=3��X���Ơ�^c�R=�x��h�c'm�ܢzH3
��p�ݺ�R�
]Xڴ�/s�0N��8�(c1�H�L>����[�ј�ͣ[�I�����Φ�>��a�'���,d?i��sO{��7�Te��n�L�ACua�@eF��l����p]�%����scX۞���F��y����@g�M�3;\�SNFsӔBB��)�x�0E��Va��J/�T趺�VN�c����Z`���^�
F)#,Z��4�ڭ^*�ʿM�����_KI�H� ]T����7UX<��C�<cty���)��<ת�퇨A�=�J�K��SP���[k����ʶs��o��[�y �-��	f�ק�r��i��'�GޯiJ����� ;���B�J���u���eĘ�/=ǷD��F�#�Ԓ��(���,�:��s�W��z'��+M��aP�r����Q�,d岷��I�A��>�u�p�NӨ��(-��`� ����!l���d�^�5�Q͐6iX녬�����-���N��M[L�:})��ϖ�O��z8a�l�\��)��VSF�t��t�w3���p,ars��L�=��OFf(*<�"#�j8E�v���_��/|n���\��Gd����.��Q�PX�-�rdO��{s��4�1��b�Ge�r�ӿB��V�d�{�@E{�_�k�R0��ɔ�,�Mj���wYstR C��wCa�=#Đ���X����-��=Ǩ4��&W�F0NÖ���,xwS�MT���3��+۰�ܨc|�B�F�p�G��@�P��P�zUfd/@�0V	B��:�SN�6���%l�Z>O8MD @A�����0w7�>MhT����8�GV�:��q����q��֏7��Cu�IC&G���L��eFP����L5���v�ЩOϽ9����-{_� +t]ھ�vLz��OjF���,Lyk���mӹ��#�Ixs\��C��;V0���'�״���akP�_��u+��z�ƻ<�[2ʀ���ڲ�o(�r��8��:��$9��T�G�ge��T3E�y_@2�U�&�֕�����4^7�9�8�g'�S~�N�k�dr5�at2�����c�vm�#U��1���y;J�����`׏�Nܦ~ܠ�V�?|�+��ټ�2bu�YCQ�b�rxYX�8�C�n�IAN��}�6�����C����A�������Vqמ�v_p�2���PHAO!1���������� z����z�>6ȼo�G>NU�� dr>'A�$����V�03����n����U�c����N�����^�A�����%2���-�3s�JWҼ����Li���E����=��Z'9�B��ىT�5b�|�?�F\�� "�[w3�-|���`ʗ�ST2���46i�A&(�QM8.�Wu(�M��9E�H�Uzs^7�F?8�C��e�`�a�����;�n����L S�2�ܘK��7=B�n�߿|��I`EC6��������4=���	�Opsza�(㻎���,>5k�u_��Q�U�v�� (�]Y�;��	����#c��,.������8�4���L	�1L��߸�60^��qL�Ơ֎�A�?vVw�;5;�g�2+M{{�;��*��\-u�i�f!���5o�7j�y��2���wu���q,u,����� �9uf��GJČm+|�ʳ3g���Y��Q(le��ǐ���WI��������fE��"�H˳�< ό͖��&e��3�ϔ[^�������  �������	�	���fpL�=r��{�'=9C
�� ��� ����?��D�{�ܧc�=2�6/9'9Z��%��B�(9�y^��ydM�D�H�e�HK`)�ڵ�|���;��"
gŧr�ѕ����B�� ޺��n�7 ��;�o-Rc��j.�%���SCC�r.�� %�~�� �96_qy�`դw>�{+��(�9!����;T�A�ӎV?O���ۻ�w؇s� �!�l|�n�˹�BU	<RK'��W��|q�F���y���vɒ���x�B����NR�ڲ��!�u���P�h�� �������dt��P�����iٱ��Ɲ���ҼLB���� �^���2�300���woLa:8��"���¦�(�$wt�ae7Æ3���sH-w�y��	)��Di���z`�V{"ZUc �����>����i���ov�;�a�v�8���B�&��#B\W��85��\�Uc� ����Yg�`�Ibd����3��(��2����A�L�4���-E��?�c	�㪴w��������=���8U"��hX\ ��p��������s\�j�0xx��#��~⫌@��_��ܱ�wA�M�tc�Ek�������q���x#\�ǫv�qt�����j��r�+2;�V���=��>f��ңh��r�|�IO%/�I�p�/�=�47���{����U�� G��I^��v�����`���u]�����)c,M��!	��9� "�WNn~��J����<����#��������fd��wB2�ӕ��r�ʵ��o�z�۸d�N}3wc�X��\��wפ��� ?�a+@[c����� T� ���TM�G�FW����y\#�T���Z���{Tc̙ٽ�PD�V����&��s��
���(��tfĮ�&{�lE�1�=��|4��cZ�X��M��pG�_� w�\�F6x��B�i�͗����{%n���s��G�: �HNۤs��� �^��tٍ��2�#�[�ю�^� Dy?+�-
>�G��2�{V�+!Ֆ����`Fv�Wng\��	�PM=�Y�O�׳�;�����~#�;�o����9.]����s��EF	�a0@wۣ��C���AO`+��1�� ��ާ��ʙ�Ø!�6��(�W"�0��d ��~xp?6��g}I~���ɖwː8�_�s��S���S8n�+ܑ��D������Y��A?������\������O�~om�mZ��5z�ӷQ��g�/��0lI�� d�v=x��%xW��_L����1�f�J�u �L�|���[��xv���t��P��	�}5��]�+A?&������v�c������~�vNw)�k:>�,O��9�V`z6a�W�-D��aG#\��I�Y
6��=

6��;����������bHZ�5�ٗ�w6Gvx�ES� �<�rq�[��ۆ�C�!����t;.���Ϭe>W��Ge;����� �N8Z�sHt��=
�wD���מ�Zc�q��q+9 Ac�J	��gg�}�V=ЮQ᨜&��A�@��q��U��� ���Vp[��� �ն4���uBݚ�
��]b|��ҿ������[�����M�>��_��{��C���4�cN�ϓE{[^��.���]�pn:{�jg�N��#�v���{�؝���F��� ���ouWk��v!5�"[}�I(��|q�ց+
��{�7�7[HMsr�2zap���Q����V�ۚ<�=D���[�=0P�%J� 췔�/�������E4����V:kL��禞S��yn�~֧&�NVp�mP�?��K�L��IX���_�J����%���������N�./.�ך���k���-�2�� �Q�R'V���ș�ooS�y��-�r;4�֡gˠ���� �~�'g4=�sث���D�0P&Kw?�N�W��Wr��x�9�ԏ�l5�,v�I���O՝�s]㕲y�gM�χM���M�`{ݢG+f;�S�Ca�'����Y��A�*�� ���VV������|�	;�sCgm"ܗ.F�nC~����Ѯ3��Gڏ��<�R���Մ�jܡ��z�QU�읖�{�$x`��%�`h�� ����";����y�ۨzNwki�u�7��؞��l=�4���h��ŧZk�ҟϧ饰PҞ۲铝F�I~��Ğݼ]��:� ��}��HA+#xt%��5J~�b������+l��
� y;�̝Pb���ޫ5��F�5'9�J�E��S$�L�,�-� �H�-6j�s+in��pPJg&�e�w����݇���2���G���� ��ܹU�t���7��Sh��D�79#(�ڎ�tyoL�4|�3�Xl�`�9#1r���ME�c�}���rʋ�ʼ���m�c�2 \?�����mg�Z2��pce��qp}�!��.V?�hxV�eH(ފ��y��L���c�&��uh'�쳼�.f����dÊiY����P�丱6L�H��VW	,0m��[k�gpp��Ĉg�$m��W��'-Ҩ�ˮ1γ+��/M��FM0ʒ:rw:έW���~�R��F�l=�-�9� '�P8X�*� �U7�Z��^(ZÿN��׮�浃Q���a�3 {��FHC+�v��'l��Js���Whbx]��� �7@�&&��YM\&�NL��
o����)�v�c}��j���Y�]��Rh���l8<�r+Y�݉��\�-G~��Z�g٩�P���t�˭n��2�v'XuJ_Nt�>�G=�6e�\��aMr��D�(�=vL����z��኱K��k�d�s^{�L8�ӚXY6w�!��8����U�8C��g��	Y��!��|��:�riEԛ;b���W�V��82>�\���W��L�ؑ��ߵ��0� �[fx���|��/�6W����"�˶W��/	ǀ�W!6ݭDf��$mʖ�c��ʘ��"v	�*�K٦I���I(g+�ݓ��2㕺��o���a�֥�h8���Ӻ߷8Q��T{K$�C��uq����������O,N�`c�_e��r6[�}�֛|�u���ZuϬ����F߄\9Ook��`2�{J+�;Sm�h�ٓ�T�� 'q���� #�L�D��%��E!a�1�]�-�K��i��U���Bkr���Y"U5l�������'D於������öٹ��Z#��~ ���fvC�+?����� ����gj���c��aF`@���_NJ�}��ch^��z<w.ZvZ�g�A�we7Rs�m��\�G������bw����{�`�ϯM�����i V���-C��Q��n큘G�OT�j���;&���� �"J��^z�&�Oϵ��}F�ni�F��;���*ؑ�8N��E�d�)Tyx�1��h8����v��W>9`tnu>�Eoڎ�s>���Np3�b��z��ޱ{����a�P���"{V�C��d�o}�C[zٱ"c���E��\5��B ������4��V;�������� ��Ϝ���j�9++;����G3�i籒nt����7t6i['&}�d�~�t]ozU6xV�9�>��?��rǫ�|�ם�GC=�&��h��r(�Y�5��`�q���'++���]����=ΐ4��~��%ˢ�h5��zح�f[��M�ʃ�̵����Z3��.D��Uw��:�7yk�:ͼ�W�����5��1x�l���E78� }��"�>�5f#mE�,�O~��Z$q�5y;(�A�5�7:i�yi��H;���m��}˵�1$��w�E�� CQ�2���Szz7G�O8d-�e�~ܼQ�EM�(�8!���KS6_����Z����y������wOLE���� �E�R~��Q;��!r7�nѓ������b'���w�����o�J�)��>�5z����f��i��bwшe�k�����==��Iە�S�D/}��K�滺f�4��|�s��oM�YsʖS��.m��4���cYPw�Mjډ�^�4�I^v.To|jWYb�zi�����i��� ��H#+~����vA��V��17���E i���:sӎ���ߠ���vLl�����v�����^Z��l�8��E��T9`�?���	م{;�w�;*�����8��8D��܉%�{!7�n����� �L&�ΘsE�'�����wYY�['�#��7m����w����[t'c�yn
$�o�@�G�C��� ���7����H,�7��V��H�w�B0�?��w��8��cm�|/��X N�rZ%�0I#�3�Q�+[�`NnSs��-gj �����.��kJ=�u�;���r���`1ݨ����n��g��7���� (q�#�g��9��ߴo5w�O��%�r	ɩ��zk�
� ��X�P�a�h�7ۺ� �♎�~5\_�]n{�့�as���ߝ4T'.r�`uBr���̈́t��VI^'use strict';

var path = require('path');

/**
 * Infer the compilation context directory from options.
 * Relative paths are resolved against process.cwd().
 * @this {{options: object}} A loader or compilation
 * @returns {string} process.cwd() where not defined else the output path string
 */
function getContextDirectory() {
  /* jshint validthis:true */
  var context = this.options ? this.options.context : null;
  return !!context && path.resolve(context) || process.cwd();
}

module.exports = getContextDirectory;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     s��9��.j.�Cq���;e���#�����GC�0}W��(�����u��_L� Bӯl+�r!B �,QD�2��!�o%�jL��U?�-�����Aۡ�8�ˬI��� c�?]�l�w�!�ܓ즰��a�Wn�R��wI,����ʜrze�*��Dp��wRsvd��:�v�̪w��$.�/$V���v9�5%�����,Nq��*�)a{baO�w-�~�p\>@��Z�g{~c���K�6e�?�����S� x��E������kEfW�t��!�?�������A�>r1��򘦁Ъ�_]�9��n;p�9�ڲ�,�煬��t��jc��෩��c�����ٞ�����+:kNA�h	�'9��r��;mН���,��������~����vw��왩��n�FS~�ڀ��Sg��3�H�F��O���H���i"&���V�hr~�N5{��Ȯ�3d�.�#���N����=Fi<Qy,GfgI+�ۧ�T�<R�
������W��ך�q�U.���<�9댧7�r��̛#�_��'qdM�;����?��n�����|�Y�Sc�da?*����C��,�V�Fymi�`�I�s%e�+��Π�����|�v��֗�c��6������!p�S2��;ɨRg�R��#�����.�����jN���^����^�fx�z�.g+�pV2p�p6#�߶6X��D�'�5�� w-R�l�JbXʏua���/{[�gv95V{j�lf{g����OAw�ڕo�����x0F
t壼���U�����ܚ��;Pg�n�G�/v�vy��Aڬ_����c]���hf��:H�a�Q�Hb�j�}��2�`&����en�{����� =�<����Wz�{&��f��w��a;t�*Nad���B�"�&�ez�C��\+q�����4�W�fIF�uz�@>��s"�4C\#�jl�2f� ��rf�'�ѧ��6� �j���k��9��ҧ�0(!�`�@��rmK�uh��5��E��� "�����Y��VC8q�e�kf���둃V\�&)�Ƹ��]�΅4,l�#d�]�gnb���
��P7\�ۙ$w��=V�p��e��nxl-Fr�8����F�N������C��>�*W��_P�?� VhG3aқ��Bb�Otk�csis%6��S��t'��{������N;8l·̿�d��"--��v���@HN(�wb��H�ne`�~�ؿ�/�<��;�v^�N���1����L�8��7����;`���b����SJ�TҘ�Ռ{���pz{X*Խ�4H�r��(���w�?�7�$����?�v�l�Vr���V��إb�p�/a�P[a4�,d������Zs�Z�qz�!�XP�ȁ�[g�����ZS��l���8�>�k�I��J�B~IR����2VJ'v7!�a�`;,^�WB�ݾ�����&�ȷ��ڸ��w����v>$���s��i̠�ݳ�r��$BO����#9Lv� �ȫ�HӖ7g�������{uQn/ث�=�F�|�/M˚��V#�*�������Z�{��-D��,�nL@�#�������� ��Pr�[9��޹O7���6�;��p���븒�]�O�j�QI�9C�K�#9 �6I�aO��֍N-F��ޜ�J���矬�@���l�����/T�������e���w���XM`9X�?��A�ݑC�	���&�����
��Y�}o��5:�6�P!�r��;���7f#Q����v�Ħ}�a!���<�=�*O��5���
Ǻ�n�=6�sY��E kic�G]vx�����������Pi�0��.s�,2�H��c.�;�w�x�k71&����ӡM�v�{�{��1�0���)�8�i�+�`��.܉#*z�76 �pg��n�G�"')!펽r�j�9�C����#��6�.f��cU��� ����~� �k�������'����e5��8����.ߜ�~�?���S��밦�#i[�CCwN��?G=
�� <   !1 A"2Q03q#BaR�4���@Cb��$r�S��� ?����Kĩ�����yq����P���&��ĸ�P���!��X���^jP���%�� 7���x��/|�	�K��@o���"�cĴoI�7���H9ɹ���$��j-�����?3@��V��q<C�%~FTy�}YP�=�a�[=^K�D�h��K�S7Y[�w�O$�t�i[�o�E6��Vҷ���bS}\��xbjӰ�/���!|¶�x�ռ>Y��b7��kI;���jA�t�c6���bzD��J�x�ߜ���AȞ#A�Af�Q���yWk.A<�ʉ�ҷ�l��,#���6��l�����������a����Vʗ�V�*>��Mb�q�s5���:y���M+Z1��T���K�|ߘ��J��M5G]&�P��_iu������jΐ�G7n�lo*�r�.m�'�d��K���j_�.��6�ۜ��ea�Jt�ʏ�*<���G�7��G��iH�D�%��&�4��M"Xd����M
ǦX�x&SR��3�3�3�0d�O	����hԉ;O	�!Pg���hO��F+i���ʛʔ�n'�`�A�F�����Z}��{O	���Q��[��&�	�4�dh�O	���Q��4�2�&�,&�,!Q4���	�B ��h6�1i�"|ȟ4'�O��5>hϚ�5��޶��|����S濉�F|џ4g��^�bT�QNg�q$O��5>j|���>hϚ3����������>dO��V|�ϙY�"%@��C�������S�6�lm�z����L��>d�\�J�~r1r��#s�֡ĩ� y�����G����3s�nr�Uf�U����=\���ߠ)c�EP��#X�Ѻm4�n�9���LG�CДA��}��+�6�S7Xcs�����g�ϖ1���k������o�zl��D�� �t��i�9��<z(�����̰�L4aч��S�b{C�`\�� q�Gӓ��M���B\K�qщm�(������I�N��7��g���kJ�4��yI5����x�O��0Qs� �H�XZbx�ωM�țJ�.z)�ci����f�5�/iPݳQs).U�c�@��9���@=���$������+�X�D<tR��X���Gh�tS�s�U��,O�G�'�л�^%$�@�#��&h3A�L �/Vk/B��'���7�W���f����r�臏��S���īq|�>���+�%fX�^#s�A;��a�%��@6��"|�lA=�(��'��g艆Թb=�B�ca��0���k{�|Zb���ZL�a}�ʉR���)�Ѹ�w��AU����i��S��l/��J淾O�V���;�7��q�A���0��)�sn[�9}Fb}1��3�<��a����'�b�n��[���|���	b:����J����k0���W�C�v�c�X�Bm̫[kOa�Aw�{D����f'':��iv���|����0��O��|�ϗY��<�ϗY��>XE�i3ϗi��<�J#��Q/�B�e����ȏ�=��#�*ӷ�x�V�����x轷�i�����-�U�6�����ϖX��\Mk�p�5v�b�+�m�_�O�_���Z� Q������g����`+�1�UOR���R�Q��S��G�c?����6��C�������8\@��Ҭ9C,Õ3X�k/uO��L8f��	L�a�Bw�^W"���a]&��%Խx�D<�M��D�� ��Z�ZUjz:��6ҥ{�A�����Gv1~G�\�b�����_N�#yV�Qm-�ٔ� =G��4����*����������.�{GM "3����Ta��4l;CM�Q�\�\J�pf���臎�)1�{Š�YV(/����ݭ����E�}ȼJH���}�ڝ��u�>��y��*���ca~�����X{�W�"�#�J��x� �};F�}A�kÇ���-nv�Z���v�>֔��X�L"�O�Ø0�OD_7�^&
�~?{^&�>���T1~�Au;�R��MMU�Q���oSkpbbkS���lZ�ۃ�s�.��%OLK�3�z��� e�zqށ��ZP���;4|����	]{^/�ik�IL8xh40��[T���U����Bs�J.��� �L�[[�E;^q��mX�<8�Û�S�t�"���~�(����`�,g�����&/��UM*E�1�{��M��b"���_����_�S>�D��(�/)�bG�nDOH��I�Z6�����I�Կ��~!Q�QWH�`e���}R����)a���,�M��Sc�4G����ԇ�n���j'y�����7����g���OŪ�S��Q�?���ub)x���66m�YPrnD��gn�*Q�SԱ�C�7�eJ-O�?�U�is��/y��&	i~������� � �,|Ej���M#��D��u��>%OMAW�E4z����
0����uAv�b��7��T��8��OI*z���6��F�}U��ơYyXZ��ߡ���_�il�F�����1��0���_;g�Ƴ4�N��a>��?�fr 0����G�H��݌L�  m���b�Y5Z��~�~!7m�郌�	�u��*�a�e?�H��E�^��],DnD�����g.a��!��Qq4�z[#�3��w���1��3`�Fa}o��Ɲ4� 1;��m��g�>��mk�7�Y��g�a���-����?+�� L�U�R��7_���csx܉O�3���Jg��LSj�aPbT�O��>"G�YKN���%�O�)��3��2����}ʟ���]3R��v:r$bR�Sұ>����)`���e_��^��V`=� ��:,�b�� /SoI��Ӊ�x�����m�A��?t\}a͌_�� Z���n����\����Mȉ�&b� U�b���/����5i"R�S��[�B�����X?\��Z�ۮ�
�M�N�L���Oҽ5E����qf�ߓ�h`ʷ�Q�����n6��o�]t�c�������]�Eݗ�!��	�
lmP@o�H�D��N��Ìg����0���:�|)O�Ƿ���F˱�?�ykt#TF�J�<S|�X?�(�֩���t���:~�*|I-d�&P��0�� �`���*�)��ۡ��RCt0⨎XJغ,�J�����U�R���c�5ǡ��6�r�����Kr"�zzeZ)TYĩ�u��?���[/�w�u��vR��?�@en�@ʿEڞ�&�^M�(������&ma��>d_��UiOį�:��=�gf��uE�<]j|4��^ՄWZ��zFeCz�ਿ����>
�1�'�[#�q�`έ��������@m��n��t��vS?����@�neo��奼vz����p�uf�&�����q:����H!S�����[�l�&*��:_:U��Ԇ'��q�x�i�����w�i�����}3�E+0�0����� sd�ۼ"��5�	�e?���� 3�b��U�����n:�yf�s�x��"z��c�/� 1P6nڎj��P8�J~%I^��P�dH��aU���6������~$�ֱ>!A�6��۩����oU�oTd%󼫈*�����w �_��6�m�˼\�����1_t�a>��� !� ��z�}'��eLU*^�*|I��_�Z���hRoi��U�:Ck�A�/�YMP��N�ޤ�i_��2��ʛ�c�oӦۈ����� �O�K� PZ%T���h�1��ZP޸��~�A܌��G�K�e�+l�K���7�|Q������e���'���:���O�裔7(ӫi` R�O	W�g��Fb���79�� .l%lb��S�|��i�<�SӐ60}w�V�]���r���|�r�HԳ�لu�N����2/�J;��1iS�r� �� �*��k��[�:�������Kl%�=[ƪN�n�/�\;�0����R=`�Fknb{�6��^_7��EK�Щ�+X�KQ=b�.�oIȉ�{������J����� _��L���+}�c��Q^���}f[%��D_�-�xϻ������\��@$�AEW��l�K���ʩ�7����L�6��4�s4���&��<�*O�˲6W�Ҍ�j�,G=@_2��X��x7�0�N}".��Д���uS��4��*a-�����_KyO�cJ6V��&Ԧ3j79�XO�"�o���BB��qtG-EE�C�}++���������z��T��H'9��F��������\��ơ��Ǯ�/yKf��)u��2yK��r�h�56^zV�;<j_�7�&~ �|�#��ҍd�.��j0��z~�2��xa���]���O�"� �o�ɝP]�&��R�m5��4,k���5<g�дٸ�U9�_�T�R�g�I}"6!���X����$Z]�:z𝇒Q]4�ܘ��TA��<��)��27�xo�O�°W��jR�����P��S��d+�B�]ĺ�;�S���S>X�� չ��_�p��VíO7�VR>��� �=&Nx�i���S�ķ�e�
��U�־�X��JǴ�3Q��Z<��nsU,l&���J�ٶL��_��sjȰ��7��9S]Mh�i����0����D"�����7�>ϴJ����j���F@wN�P�"���4Zv�#�Qnc�L7�e��|_��LE5F�����R� � �*����cm�S��l�y�AK	�R^a��ng��)~�i��Di^ab��?�m5(�3��&u^c⿦]�z�an%)m�jʡ��}���T�w���ī��;�ۈ��e,�h�����s�6�ߧq�z�"]Ә_Y<#h�?��yX~�5�f3�t���J_��J�Ro��І�[�6��STDW^^���6���s}�"=Cd�h�|��j	�ߜ���1��f66�9�ņt7�5��Diܘ1+p�w�]u�Q�HX�m�m1?t��w�n��*|��p���ٷ��5'E�c�0�s��|q_%H�0�ʯ�����z���7R��WŚ�@�7�3q݌ a*ZҚ�ȧ�^��M�;� 2�&R�Zxa=q��32�&�,��0������Q���JL2��O�G��c6��Gf�w�����`�Ue�X!������+j�����-�����
�b8qq��]�ڧ�R���7�a�"/50�P���N�8���J8�ß�R��E�U� ��b��A�j��j2�G�P��l��"�p��V�׌E�碭�[�q5E�g�	�	�O�U�;�7=V�������)h�	ӊd�h��E�����y^�~����QoH� IW_���)�i�����ϊ����
b(��ħ������\��Z����69��,��f�i��#�GR�Ċ�i��1r29���"0a|��;�-��~e,I�k�gm�R��:�����Qah�o*U/��M-���]o�T������ņ��P�4�e�x��%���i��:0��1��Õ�m�ҀZ-�łQ���%�gR����k3Q��ox�.!��������jYR��nz �e/)+�QhvK�I�H�F��u���4�a@�U�)�b���Z+�/�������?�>/H�jJEE���h�zI�Jt�1i���%���OӦIɎ���ү�+�.  �d��U`��������y�-y���Bjr^!�s ���Q�.-���JI}���9"k�O,T�+WӲ�I�鍠7���p�į�@���غUp�Q�� 2�%��F�jl<��Z�xk����;�yR����|E����4�N� �O������Gm_CQʍm[c�l�3�]���hj���M�����#X�+�̘70o�s
�L�����9��5P���#@ʽmQ��ZL�	��^��L.*�1d�L@�\��iB�JM���*��*�j����'R��"���O���0�|�/�+��[S�ϔ����5�&�����)�B-��ịWA�ޘ���7&�hn�i�$�)���ɌX��&���D����5��]]�W�������C��*6�EP��+CM"(;A� k����-�h?;� ���N/��&�Q�L��4ƥ0�e�0��6Ș.��=eF��i�,zV�0 ����O"^1J��9yN���d�5@Tw.n~�<;4��]A` l&!��x)��(��GS,zb߿A�i�N�f���:���a4�2�;Ħ9�K_&kJzZn%j����à�S<��Q�"-�o�-�ʐ��֥�^�!n"a?�
(;M���O醓����Q�������/��?@ 8���F��1�4�߶q7�js)SR.f���7|��U���7�� �7���2��n�J�}�l�u����M4�m����[v�y��Pf�0���*��7�-Q����CXdEťz�����JVo,o)�����6�a	2�ӣKWxw:���%4�`x�ar>�]7���.������W��Um ���3�Munz)�W��M�#��W��u�J��s��&��ݶWNҙ���O�)�V��=@B��&����� ��� P� ��}W�0ex��nz@�_�����mTG]-lϪ[Q�GЅ��s�
&��V�l�h/�W���	�A6��	�'�V�&���:��ZP�v߿� �E����W�xg�K���D�_���*T�=�fON2�� �"zD���ECQ��8�{F���ST./��QRÓ�;dG�T�>n���k�S���}�!�*/���*	��S��M|D��ǔ�{�S�-3�3�hp�8�������3��,3凼\:�GǍU��J��<��=TOQ��oB���^*��4�&Q�5>x��t���Ty�߉O���׼����<�7ħ~��'�c����+�q �ζ%S��j��O�L�"��@�B����R���N��|���y���
d6i�[%	����Qg�|�i_��Q�I�
"��q��,N$(Ҽ�܋KN&>��V&	s�4�m{�Q8F���JT�G�Z��~��u���
��F��H�ˈwn&��t���^S��z*5�������H�қhk������ �SDP;���P.H.w�Fǌ�
��wU�1�׀��I���Hw������',
lZ8��M;���P�c��s�]����ˤ���u�^��i��d#J8����E�Sn�01�Wv2�!2�~��u=��T��ݶ&��e�C!���"���J���-�Y��L���x�5��AV���E�T4lK�-O�x�x�ł��|�F���R���xA�M� &-�6�hM��J:|@[�b�\�X)���YQ@�_�j%;�c�����:�m�.�����Q��5@�q���l��s��9����a*��C��"��|?�.y̝D�)�5n*���K+�T�🪫�hZS��9�NeT����3�l���'���h˥�	�,O[a�ŀ�v�No��t[�SiI��o�Eu�j�3���W�-A�a�F���� �&����`��65��E�?�C��m��-�6���/B��P]e=Ī{Db��.�ܞ��N�4E�W�f�R%�\�H���#�����")��ؤc�y�I6�ژ�*-1v��IT]V4"a)�}G�L����~�F�f9�u�Q*�4��`�b��x��Oh��]s��@�oS�=�?L8k��ݯ*z�u���_yy�;?���ւ���T ��h�
ŲOV���#���z�4;�+]t��5=&���5O�J�n#VOĆ��<�L<L:�3u�![�c3 ���M�jƩ*56��B\o�_&>k�M[�n��-�d�Q����7��Q��LGa���^���4j;�"֏H��R�){�eL��"�dq���7�%V�
�R�/�[���]"0��T�	�5E��B�R���J��~�8�\�ՕS�al�/A6�R�JC{��a�;�"����׫|��EP���s�5�.�y�S�n"���*s�:�������N��aT=_�]Q.N�	ӹ��� `�[���B��S͵8)�hV���6��߈��e�~�`���2��q�:�R·�i��q.:��@k0l:�S�����9��4h�
��9p�Y�eJ�O�+�j߉��}\�m�5&-���q ����HɎҐ��/S����i�#Z5�0d � ^cy�"�U���--4�K۞�5�@-	�$���O70�������)n!�)�ț^jZ�'a4�M�kr%��M���S��^*Ω�(��aq+K�Po-����o �+�9�c\@�U�����b ��ƪ~"�\�v��S�g0=�h�OQ��@㡒�­?���-ne�>��i�a�hD)�s�j����[O��{�TN�|�<M7�^[�yo�ȋ��j"Z��~%�^a�j�1�SM#2/�3��C��#��N��H�r�~&��S�K>�N�e�b* ��6�'Q�F�:t�"��6ȋ��m<U��-���ts,G��^0���1[�[iE:M��./��d���`7�,l%5������T7:DKۡ�vm�6�l ��q���x�c�\�@��r!�eUm�; �t���/J����c�Sm�$]%1sX[��Hw��v3���OLj֍^x��X7�o�XZ1�/���6���2��n�4���sv���x�)?C.�)��9=_h�|����j(��Ҙ��w9ֶíW�,9�GX������[h[VtA3K@��8�t�ٴ�Mqʣ\�!*���	W���NnzPXfM�F9�ZSk�����z�B��<�s1<�ͤM��[�
�z���^F/�-��y<��͔�#��ͤ^T~�q�_L~rT���w���5����_4�ʼ��\JGhx�As�T�h۞�oc��Nq�=�Jb�%v���4ܛi�\C��A��Cv9�e�	�)�s�l�� /+� ��Ev��ux��bQ�JAz	���eT�l��eOP�6kB/�Dw��Tjt}�U�H����,�Ox=�1e�ʆ��җ��@΋Y�E��d6����؉\Z���G~�%�u��-9�[>!&��*�3Ls5�ʦ��gT[�no<Q<Xj4����S�n�c���-��T�S�;d�SDݥS���*��P����<O�_�:)���p�^�0q�\kJ���n2�;�n!�^��i���D�c����xfZ,�T�װ� -N!��R,�]�CKqHp+�nŊw��B�Z� �]
ŭX������9�9�ٙٙ;s�<ww�d������8~���,lt��b��E�a��#�X+n��v�x�=X����lʿ$n��,�
ܣI��?"�dv�%�clV��L�y4�:�ʯ8=+��[�&
njhϟ�$�y&e��N�z�<���z�����MBN8�Q��m�ok}g�e��v���l5�Q�;��i��8��xΝ�ⷎs�4 f㻄��X�r�Z�w����#�ؔ���g��>���6a&��_���S���V݊t��:(�y֚��QQ%�]TV�ւf8���RQp���¥�#�����^ay�Y��υ��=9ǁ����LKFC��+���U[4�%0q�A�{���w�6/M��+���~]�{X�0m�(8��ȁ����n�4�~S��B�w����w4}�R�T>���c��]^��E�<���o�O9ĉ������"�(��/S�ub��-rK����e:y5���-�}�P�]�iш�ʠ:+S}z�1���Q�H�7,�R$L�&�-߮�"9�f�����j�+���*��:���W0����Y�C�z����J�Ň���	��+���������uw���&)�X�a �_�0��G�4�d;檀��X"ք�OG/e:��3�%Dg��.~?�Y�ְi,�y�X�c�Z�q���&�E��ZX`�-^Ï47�%/�G���pq�2��_, ���̖�̪'}˸�p�_�Ҝ�,]j8��!�N��׶��M#��#��{+_�W���E;m��Mi�����ߐ�~��u��%�9N7�Yƨ�ȷ�l/&���`�	�Rd�(�-G�F����!Z5%�%�Ssk�'���A���I�����e]\()W�p鏧������O�Gþ>�w�����M�F���jx7�����z�>CdZ�U�Z�^S���_�k�2~jW�e:�0��^Z�E�^4q���qevN�|?MM%�n�n�W���Z��h�ީ%�/V��fI��J��;̾��=��m���J�h@�ez��/VK�������^����Ĝl���n��fR�R9��j�616kdQl������AF�������~�}j6�&e7Mo�y��PKp�|��_[�̞įq�֨�����w�rQ�="7�>�Lw�t��2�;:f�s�:��ESSS3>���:*
���e�ԟu��g�u�r��2D���
XїtA��7�c�/t����YRw�na�oAJ�(��5T������`��q�sJ�r�SQ�ܳ~g��o?5I��G�璏���y�d$��f�'��
tro�K��>�����s�5�]ng`סi�I(��|�`.CĿ>��9��G�pN��v�f�pEcGT�3�֎{o�������;��Jm��SFR�3��?�Ҳ�dÜ��~҄��SC.~֪eo��'�O��	s����]� ��7�)d���
�>������d��c�0ų,C�b��"�W>�=`�����~�~4��e/��⹶]�I~�M3a��qZ;N�}#[�O%C6�6��pN���T�c��y��ǅm�]'�M�W�G�Ů�Rg�3$�?���E�a�	�F*�X=�2���z�iD�{��bet��	��]���4_��S~ǜL5G�Þsv�L��/t6t�R>{i�������ޯb�#�?�o�x�c�f��"�`��<*:�Y���x��m�%�w�ѢK�QYZ:d!|��!A���^�P�E��)�}�|�F��jdYe�۩�[��UB�I� V��T5�&"�U��_�P�&W6�>�#�5̕�T����ɹ5�T*Y�����ONN��h|��bgk|��D��b/�&۾\��^���²�7{�p���_	]M=F�W�Q��f\Ue�o�?�~��Ď��שO��}��{�Vu�R��@�`A��/髤c���C��0������j����ō{Zy��S:��_o*>M��P�eAM��ޫ`L�g������If=�ҮCj�8}%�b|��l��f�xT�kʾ�-Wٜ����Б�E�W	��ILD�%~g$��NPK�;p�ܛ���CG]�II�3[1�"�3 ��|�L�5N�";V�N�r�n9a��St:P����v~��	؛j~ꏂ��1���N|C���?��A�}Vi�rݯ�/5��S*�j[mC6x�4�w'U��.a$%��A�hs{Tr�Gi���kˊUa3�5R�M�dY����tK�1e��a��Df���.�>�30��:0<��ZrD4��|2�+����-���~'�����,���g�XTyf��
|z�=�=�HR~Y�䊬����͸0³�2C�Z&���+�����;9?��L]�2ݴF E�Q̆s�b�� �F�1ϸ��k����l��G�)V[}��+���#{�L�� �5�9�񨚝�н!R�W��?so��l��Ys?�ä�0��J5�%�Sp�,&�J�Ѹ�5�W����8�
D$ޛS�K��O���e�H����\�W�(	���]��0�a�d�4-�hj�o��6"���������s+�)�M�2���-E��:pi��8���jH���>��!$���\Φ�Jt@�.���S'�e���VXB�"*b��b'�d֓q�N�=p���g\��˿����p��*�"�	Pd�-B���YU�:J�%�J��	�ً�� �ƾ��l��Us�:�}��w�R;�����4�09�7(�@9�E�[�H�m6O�N�'��U:"�������p8�]�w��B��dvT�8±�#��|�^�{<R�DU�������x��y|�_�a�dxj��󛬺F�,��u�k�ԣ����V�x�"�ѿ`�8˪�N�n%��X�Fo#B��! �Ú�*�O�	�#������?O�L�J� jM��2�WY]Mi��":��� 3ݪp��>�4r}o����oAm��1�����5�|�����K뷕jCp��i������]��s��\�x�_��\,��|�g>�LUwr��L��2��>��}�ǧ��*85�ӹ]���&���6)C�
~�a��l�vw�+�t
�=�a|���kkD���6��˻���D/N���	��Iu�P�"$�P���^x�b�������0+P����e�Z�@���m����j�V@	Ѥ��1�up�hA���)9s�DM1���[rIPO��Ҙ�O�w�M�<�F�EݍR�ؒ�(.i�.e;��+n-꫽��L8� �^��W��N��7ӣ�kW�����y?	�ţTF���	�/��o�8QrNa��j��_�b�bɭ�A��6���yt�ލ�꠺E�&Wp���:::Z3�%���qM�S��R|�b+�ޔ奈�v�%�Z��^,)R�GO?}�_����J`=~���@	l������ ̼��rڡ)2���M��x���_����"%tn���>�i��1�𤘨��X�<3m{&��I�a��V`��mt���0��t_F���hL�3�Ҁ�(��ap����x�/�Փ(k���?�T;��s@�=V��;JV��6~W�G)�e�ŲƤ-��ڬc;���_�����t�z��=��e���F���{_����K��,u"�D5�E��X��b~���l�Ë��-�Ä�.M�tN�밝6��_/���4��<�͠�u�~*�B��
��D3b鲞Z�&�x��*�u�=
��@B��tJ���
�ހ�m��#?�ճɭW �w�]5�A�A)n����Q� y9]$�@4c%�vPܥz�YA�f(�����̧X����itA&м6 �<�w��u��82_�;H��#$�V^g-y�yś�J��BN��VIk��M��8�XY��
[����Y#9�Q���p��ID}��-�O'K�ۆ��.wJ�<��%Jf�����ug۷�m.��z�pE���/c�?���
̜D���h�HǛ���.�u)g���n�
�6_��ħ�l=	J�g�o��5�����Gù��鵎`�export function parse(text: string, reviver?: (this: any, key: string, value: any) => any): any;
export function stringify(value: any, replacer?: (string | number)[] | ((this: any, key: string, value: any) => any), space?: string | number | undefined): string;
export function toJSON(value: any): any;
export function fromJSON(value: any): any;
                                                                                                                                                                       �Q_4���]��򷿼���ձ��[�l�C͈vO���@7;)�N��2���;)��V!�'��떟Ӯ=��ޑ�<'�G���\�}x��|����I���?&���dP�{C9��A}ݕ�B7r�F���|�	�W�{�����;5�
�f9i��yeF+�ob�eF<�{pm���bMwR��^u�ߡ��0��<�`�%��X?#�sZ":\�_��@ΐעF��4��F�_��_��ٕ��?3#�	|�K��=�
���DSX���zORD��ޭF��_���r�M
f��X�7
A�Ij0k2+�\4�GT~׷�jևbB;��+z��5\@A�EQ���Z7j���WxbĆ�0	��^<������c�7�ܢ����(F^y������z���u]�L�Gn5$��)a*����#��Z�_��)ꏠ�E�y�Y3��e��4#OZԖ�>�E��%g�{�dg�]X��a���t���?�<��F�%k��>��f��Z�6�;��%Y�%摄�Dt����`}T�3��Rr��W�i*z]���?�F݋�*.�d�c�Td4�ew���T���C4�ф�@���w!�*�[��Ld�)S���&zLh���/�ZCy����8VY�A�e��t߄��~��k��$V&r?;����B�x�O�կߪ8�z�lv?A�3�ά���I��eo�%t���~L�cj�f$A!c=����I+A�Նl�/�3[:/���]<vY�@��ͱ�9�t4�W8PZ��U����X(r��]��P&K<$��O	���j)��=I����QCH����1����YXQ�V%r~z����}�:��XdL����`_n�b��#7�+�,+���(���".a��
p�ڹN<ktu�ט�'��n�D�VЏ[�� �l�<��ӝ�̼�-k��/��X�+d#���?ﶥ��{K3�.U��\��l;Ab/�J)}t�Q:Zy�kK�|{��k"�.�:����:��>�%�O�wk`�>lo�I�@F��ܖ�}dAn�)V��y,�o]�S��H�Ǹ���U�F�o�߷wak��(����A=�
�d��z]�V�UmN�_���p_L�x2a8<��2�1?��d�3��A�C]��Hq4�@�K\
�_-џ����x�������7��Q����]C\��Um|���}w�گ�Kx;��ʻ"�s�~QU��l��i:P�jq��7bT}��C
K������%��V��|�O�5s��y~��QW�GQd�%���*U��)6��K�Du���X�l#�\@=�%I�}��SZ�z 0@8E�t��tiq7p��ڬ��Q�
e��m��3~k�vn,�/���������F��0`bN��[�g�Jd�6���ח� �Xf7��.m#.[4���ʱ2�\���Z��-�Hy�����i�Ƃ���X�N����O�X	�ء�(
�Ŋ����J`Q�R]��q�ɣ�A���Ƕ`-3�����{�p����E��$q�����+����Ƚ1
��]���J�\�V�N�Ã�qRlņ?csp+�����;J�ɨ���5�c��p�u���L���?+i:ۺ�1C�yD�5�K96����_ƚ��<��H����ܞ�����+vM	&e�{�vϝޞ���-�܎I*e=�P���/�=:��o��e�ife<����T)���/���'��Q:U�gax��p��1>&���{�h�q+*�ąEQ\9��Z�6H��N#!����FT<��_,��珬�	}&��sX\�+�^�~����d�%�?�i���I����in˘�!�aK��I�KW��WNk��Pcj�M����FE���ؔ�����yz�Lr��t���q��jw�&�������Ǥ����v�R0�W�[x4��O����P�ŧv��l�+"1I�d�,�6���+D��ཏ��V��M^`9��{�5E��)��k�e_���GcC��g]�c;�[֓ه��w�/���+���y!>0�B����\�M���l�8�pL4,E�S�\����M�4����s�m��ak�,��#K�=�OY���_N'�i��u;,4����!e�P
����aW�%�'η-�&�ot���v�ш驽ԙCI�"}IsQ���oXCF��
�f	T�|��| r���ܢ,:���8�� kq�~"m�Q�I�Os�v(wg�$��'�g�}��Qzm�]-����$�`�|#.t� hJ��~�?��	�W�%}���}�E�me/=��H�����`#@H�vt����>c�PԱ|4FD>�/kq/��n���Y���#|2Ey���ń�[��^�`�a�d�8�b7�#[��a�����
h��P��d��Y�=w��?5�o�2��;����/���Wu�=nP�o{��g��VJ����(��
~�B�So���z������4��ū^b�Q��#�wȇ2z�Ne9��7�Ć�><zSk{���,,��@"<?%b/b$����cV�9�=E+/�]�l�k�kː,6���E6���96ͱաO/�݊�w�Z��@^�?H�P��m�D�1�K�<��>�ċQ.n�UV����*���x��b	�q�a��`5y����i�O��u�ք��;^�?�쎛r�Y{�B�|{ ��]��I^`9g|�`��{-oyI����H�|�h�eͤwB��Q�4Ǧͺ*]W�z���F�V�Qڏ�e�A_	$~]�L�JD�P���(��X��1.��ta\��x��u�?��K��*Y�)j
4����ID��z�(/�$�[�j}��˝qݹc$�Y��e�?�W�P�;zG(�$����I����|�^�T�I�z�l(w.��"�К�Q��vc���9x���.��n�Z��Oy�7�~V`�o+���{����wT��ǯ�m�o�<pt���k�}q�� B�l�k�n2���G��1[-e����TE�ϩ����ޢwq4��Q^�5+���o��rт���p��Z�M����<��d�6,>�r�^й����췵���f�7fk�[���+-W�d}���&���K��ټ��]�봘".a�P��6���"[ښ1\��t*�$��zM8�EHyX���=���L�A.k(�����~kX�|�:e���m����!���,���Qs�(��G�/�q�k���F����ؕ'V`Fd�w�[���O��x*���1�q���g�3g]ML��B�J�%�V���D���v3l���tF��1�U�N>2��vp�#��[W?�/�o5�_�����������9<R���}r\4�TVlR���2/d.p���p������Bf<J���\��]�ؖȳ�M�+/{/P�cdoKMB��KO�b}T��Y�U��h���eZ=\I�]��/�*a��h"��d��G��_�{�������턱Aڣpu��>x�A�:�!��[{T���E��n(_>�o+���ܮg(�[�g$�>RRI�,��|Rn�ް���|�w��qVOHzx��"�ρ���]�$����[�~MH��z3�`�`�gNøW�6.f�(�GoRZ<2�WVr��#���׮�L�}�������(j,�9`��8tgk�}qV����}G��mv���xg׬Z�P��`4U�{�{�X���hXNSA�>TX�)��-�������V7�Կ+S�5�����0r��] w�$O�A%"�>��l�i6ìY�;�ŗ���I9�.;�'n_:�MP����%���Rɡ}x�������b��q6�r"���GV,���-�I4Fxz�٭���]Vw[�Cg�oP,�0�p�xN��*_J`��Z���D2���d�t��T�X�����~|4+���I�nS���8���'�T�ӣm�%�ٴ���D��#���ڳNqA�|����6�A㩕�>�:J���F�kYWh6�F�֭�S��D��vb��
�U�k�����dRڌ{����G4_�Q ���->��s݃,&���v��p_Ui�{���a��y��r?y�>�Cϔ�3��?i\��M�(ǈ�K���G,y�?�+�+'4~?����o�wA�����OZ��Q�7n�2Q�5P8�д�sK
?�JEO�	Cf�<;�$z��<�q�������Bi��߬��GDh/�D��і҂!�p_p[�|�