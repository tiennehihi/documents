'use strict';
module.exports = function generate_patternRequired(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $key = 'key' + $lvl,
    $idx = 'idx' + $lvl,
    $matched = 'patternMatched' + $lvl,
    $dataProperties = 'dataProperties' + $lvl,
    $closingBraces = '',
    $ownProperties = it.opts.ownProperties;
  out += 'var ' + ($valid) + ' = true;';
  if ($ownProperties) {
    out += ' var ' + ($dataProperties) + ' = undefined;';
  }
  var arr1 = $schema;
  if (arr1) {
    var $pProperty, i1 = -1,
      l1 = arr1.length - 1;
    while (i1 < l1) {
      $pProperty = arr1[i1 += 1];
      out += ' var ' + ($matched) + ' = false;  ';
      if ($ownProperties) {
        out += ' ' + ($dataProperties) + ' = ' + ($dataProperties) + ' || Object.keys(' + ($data) + '); for (var ' + ($idx) + '=0; ' + ($idx) + '<' + ($dataProperties) + '.length; ' + ($idx) + '++) { var ' + ($key) + ' = ' + ($dataProperties) + '[' + ($idx) + ']; ';
      } else {
        out += ' for (var ' + ($key) + ' in ' + ($data) + ') { ';
      }
      out += ' ' + ($matched) + ' = ' + (it.usePattern($pProperty)) + '.test(' + ($key) + '); if (' + ($matched) + ') break; } ';
      var $missingPattern = it.util.escapeQuotes($pProperty);
      out += ' if (!' + ($matched) + ') { ' + ($valid) + ' = false;  var err =   '; /* istanbul ignore else */
      if (it.createErrors !== false) {
        out += ' { keyword: \'' + ('patternRequired') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingPattern: \'' + ($missingPattern) + '\' } ';
        if (it.opts.messages !== false) {
          out += ' , message: \'should have property matching pattern \\\'' + ($missingPattern) + '\\\'\' ';
        }
        if (it.opts.verbose) {
          out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
        }
        out += ' } ';
      } else {
        out += ' {} ';
      }
      out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; }   ';
      if ($breakOnError) {
        $closingBraces += '}';
        out += ' else { ';
      }
    }
  }
  out += '' + ($closingBraces);
  return out;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ��1��aɡ�7/���qM�P� כ�1�`=��bGrj�^�U}���j��R�#�$pN�#�,55-#'�P�<���5,ҏ��DL��'g�ΛC��H��1�����A��D%����/b���O������
��{?^���)3�}�t�.�N�r��&4/g2#��{��/�v?3x\߂o��eoB��r����n���_��dK�:�3��@W�$~GAD䓻���*)(ԃ���.P���][��~���:Z>/WݏWO���e�c�\��_�~Aǁl�l���{����:z0R?^'��qˠ]@'d�j'���㍜�A.$���k1�(��"vC�6鸯��g_�<`�j�����z�_W>x[�ꌫEz�e��I�P�j������NW�'[��^M����:35\>g�
��s�E��d�վ�?�=���w��dd��)2e���T�&�]�R�m��*D���#��ϕ5R�yEM
J��'�-���Ɵ��G�*��E�cɶX�
�V�1�[Qa��gx"ԍu��4��D+Q���3����*��Ͱp��9�PQSi382�L1�vs��/`E$�t�(z�{��q)%����L;]���D��c��u��-�N'nA�+��`�O?�縗!tPAF�� O�wl�w\��=��qW�����A�HZ~�G�8iB�?�~z��S�S>�f�rK����\��������A���wD�67�q��G�)h=�Q.䬭�KL��v���&��1�w9��g�؊	��d��/�?�Ӻ��<����Uߵ������6���m$�?�:=�������_�Hɔ�o/�i�(�X�T�-�۱I2��9��GEE��AP���퐶��j����e]������d�����ɺ��:_�Y�߷8xD�Ĩ��?��_�)G�<������~�T��cŝF�r������{���<�}�z��v��?�?|͵l���]�%h�I�B�� 3ۆ)8�s��e����y_m0i���1p�x{�Ѱ)\9����!���89�Ja�
����w} ��QbH�����%Z22�踸&��Z����lġ�ǐY�k�4}��͞=u��j�|ǚ�TAUg9�^6��Y45uM�������5�fzQ�anb�����k���U�\SRƻ)����$(�K(EE�s�ܠe�8��[->�|Z�ЃV)���#�y�0�(�1��Owq%��;v�#n���D(�o,���0 o�Sy�<�;�db��J�/���)�-�p�_�/8�Iɤ�o�+�蕤���E�͟r�d�%�E`��:}!Cg*fw���\�����K� ~��q�e'<�T��P�H�,���X\+`�pG�6ȅ'?�^�"^%_x�M2Q6Y��3��,�������\յ�iI��Ź�B=V����5��h��Oب�a�n��h�!h��U�ߴ������OO���Ƽ��G��VY*�_a�Kv�55���
C�!�R��*��f��DL�0�C�+Y���.i��׏���ћ�g��5~D�MC�v��
裣�Ǯ��<,ӹ]O����:cc�@�������7�8�;3?�W��[6=���3��Y��!��w;n�I��0��k������ni����C=���a�u��),yQQ�иh�Z�-�� ��Jh��<޵}����i��aE���'�{}{�����hv�~����;2WQ,(DZ-.Uo��A�^`�ݧ��l?���k��n?����\�^����}=���{�w2���1�����_o�)fw[���dY�����J��'��\&��G��<���4�(�n���5���ǟV�f�ڣz&����:GG���p�;l)U��4���8�$�E\y�� �p\%�F^��xY�����A���%�H|ί9˨�)�乌�t��B�3%�x���)����,ZpD���t�I[��]@��w �UɆ��C��]YreS����0y��P���\�7L���@1����=�>i�������Y_����V,���HI����D�1�4���nf�&")� �r��;6���i��[���W��w&�K��+�F n�4&z���|gvQ�:���,�L��p����o�F�:�Un����as��b��_�2��C� $��r��؏����.	͏�4�跤Z��,���i��e�c�8 PI�,@	��dP���ܼ��8�#�
�kh�!��6~���<I��W�zC����9]��0E�@D��FQ�z�Q�L��JAvx/:��F��b��"km�fIi�F��~�E|ɉ�ܵmѱ��@�*�fV�W���<�Z��C����^	��FAMWP*��D�D��߯D,hD*/�|q��O�d\��^�5	�3\,�8YF.�|��@dDϰD�'*����o N�A]R	�>Y`����c�uxo�O��'���lQp� Z"D�)�G� lW9D'zE���q�,�#��L��?A��#�>3���8�f�}�d�	����w��\oh�;����{��G#
�+�R�9�'v�ڔ�x��&Щ��_��g�E�юD/K�/ѩ���w��Fǒ`��01	ɡ@E�ŢE��緸��o��B�HnD�
��@)��Dn��S�N10��xѷt��,�9<���0Z��]h�O���@бg���������`F�_=��;��ũ�m�h�p��i6��[}5�O�-ĝ���T`[`����E����y�֟6ꔯhq��L�ڲ3����Em@�����,�)��7���Ɏ�Զ�l�y�O̔�H�5�'��<�y^�έ
F+�A�~��]�+�~"�w���͓Y6A�|�(�2T׊�05�}j��b�f/�u;�V�
�v�����}!�>B����r:9�iL��� �Q���Qg�ia��K�
�G�e�����FB,,��%�xD���gn����`'W1���!l��E�S�7����-HTp�%�Ö̲k�-���,�U��ǟD�h_C3B�ba�NE/�t[u<&D=[�Zڊ����n�q���S[�H��
%M�`���sî�m6J�*s���u�Z7��l"
�?Dz�6̓�'��M�m��AyoM��(Po��/���G �p����4�ٯ��T�ʞ��n�PE�����&���e�^�+�-S�|�6����Ba�#Lł��e�O��>{�D��D���ۦ�%����Y2�S������}o�����ٮC�/ �#<��͙��O~}\���ݻ��2H	�gn"��-�2�&���,?��W�u~y�Q?,�������'4�hSFc	T�FO�޴�]b�q�@�����8ac&G�M����5�q�I�E�B-�:�L��|��T;t.�Z�2)�G;5����Z@:��\�"�	𦶗U��Q��re2G37W��q��EʑWPN"-5�THZ|�1?�8��N�(S���6q�e�Uu�%n���_�E�E�3- ]?��)C��u�@�B"Q�w*g�p�S�T��:��36"�<�w�Z��Zf�����:�&���×n'R��r�����p�)�5{x"e4٠]���γx�d��+\�-ٸ`n�#i�1#�s�͟<�$�w}�P*�Qjr�=�^�[�b�n��rg,눶G��"d�� mP��8c�4|2��AΠ����P�7{��l�Q�]�"(�xc�)1!��f"qvW����[�4�RNd�o
F�����i�I�j�P!{����4�5���͘��s;
�~�l�(W_�7}՛
t!qaE�̈́i�Y�b�M�w-8Y妐�Q�g������4\u��'Y<,���G+h�g�
��+3���f��V��W�	%�шJHH���`L�j��˄��;oĄ����>4�!�KJ`��r���7ݗ1u��6�$���Lo6~g\�Y�TJb=z��_9��=�\��f�ygrǮu���0��v$����p^R�Lx@����{m�/k��7���T�Q�C����ł�np��Ϥ�rm*$7ז��y�V�3��aØ"s�<ʪIОK�`zq�rTra��\|W��n6qS,��;�ǀһXthR(^��q�a�lH��>��[�⿌�n|޸����D����O.�O7�П�� ?$�4�4�:̹�	��i(��S =e�C�o� N!��,��l�&���!��F�k�@�g�dԦe�|S{�x�uc�B�Q00�3m��⯓;X5�Y�bf�
TK@�,���p�� ���F��S�禐ov8�h���PN��ɴ7v�̊/0&�+�Ƚrݻ��R�"�K㼘���ΡQlz�L�!�5��K��z�Z%�jn��VT���2�|ż���#�nT]�ƞ�RGB#Z�D��M���-��
�S����������=��]0\��Kĭ�I������Y��6��:�+*��o�%,?Sr����?���@'�ft���)Ա���be͠�{/� ��+�K+�N��4��c���U��rS}�� �M��D4�V��h��&^���.�b�!	O ։�����D����bꂀ�S���O@�if��J�����]ba	��_:I �Q@u����@І�cUK�ܙ8����&�ж���̿r����ؼ�E!#�!!.�^�L7ɺ'�&>2[��@�vD�ck�w�����ش>B�눊
�� �A�^��������?q�	��폽������[E�Ԋ
�X"�9?>Y���;��i0
���!��q������}�>��W��Ak��:v�J��P��9|�ۛ�31[ћ����#�Ru�,W�����gY�u�hHg��p�p�`2%P�M��]ȗ�^��$���\~�t�C8Ǧ�/7�Q�i(#ٙ��Q#�r�FPa�_�p18��_���yr���+�,�A�!Ζ��ǩ^��!6K�ɦ�(&��Q��˾M�W�>T�a&���s����/��P�s�Ry�SC_�d��ί�jz8h)t�=��?��qm('?�T��P	�e�_$d VÄp���@��,$Ꞙ�ſ�P)Y.���7������ǬP�TL�jT{<�ȴ��� ��8k^Nl�z�[B����F.<�I���BY�Е��W+z�{QJ�d"<���x���~��-�a��B�1��5q�r�P�>t�l0�<>`����/�L�G�9-��j'��b��po�����*@�ݛ��|73G��%gɐ��/.��r�:$� 6�@��d�V���<�U=�ÂX����P���6�\�K���p�k��d�D�8[ikG��b�5�c����M�7�W�j�����Z�
�oAƎBC\����6�:k�m��V��>���;��mIjf���k�A��0�V�9Y�e��ȠNֵFD����X�w>��b��	a��K�k��1����s��5��<�����g����ԇ��1)��j��W���~�$1��}��q�C�5���/�����59��`���#N�Y����=l}پ�����	�ñrݝeO�8��f�D-�lIp::J���
]�`R�߳�@}��ޅx�rt$]lx��_���ae�N���GQ�<~kn�Q�]����W�uoJ�����!h6O������3�,������q�0�r�yι/*��j�:E��=2�X��h&�g��O5h�'�O|0�\[�5��`+�bTmG�U�ed�MD<Q[��+�	B>,��ܟڄ&��v
Q5����<}��bɋ��1M!����1�L�۞i��oY�y<��P
~�v���% �e���Nh�4.q�ǅn�.� �D]��dD^~S��+�»6��f|�1>]��s;%6�l�4��a\�rއFN�VA�%/�fx�,i��:��d3k��X$��wt~Ge�,$>��3���e�ġ�`"c�Xw�.:�K鬶���[��k����������9~9�������J&�.�P9�+[3@�Wo�u3b�����nh�n 0`��n?�b�U
�bj8m���Q1���[[A�����
j^g>��(v�Am�h��g.�.\�H$�C@@�%)ט�J���PaP����=�+z���<���'�o��y.;@���#rO�B/&����Wi�*�cL��OS���)�#H��O����ydJ讉7}�wB�{=��NN	9]�5q�Ϙ�׍i�t�T���ܾ^��1J�X������d�(�}�\�<�?!���x?�]��J��n�uj�s��s�r�Gb+,ܯr�a�]y+u�~�+I�}G?�Fu}���қ���?$$�h(ga�%�!" �(�5c8�*�;����(_4�s0�DO?���(V�PfL���I�&�7���&��ؓ�P�p`��o��*i7�@4�����ffY�i��mNy���f�O�&����+v�`\�F�V�x(W`W⌨%�I��(����51G��VNH4[~���E<�f�D�t���`���8���¹��4��,����dɟ�p���s�K9ɮ�w_$���������=CؗҔg�t$b鏉�N;�BZ���L�4o��2���z4�;p��q�/5�Ns���"WYb�'Q�+���N�Y���%qa(�u����S3(և!&Uik�ē,z�s:�|�m`���	e��w B!��q��=N���D���s�mA���Cbn_G�-0A���QI����r��,�.��`��@���P����2��4����꼄�|9L�oep�J�)?/�l�V�Zͯ��/'e��U��_��ޮ��)���9�|��yS��t���c��S};���7!s���������c�]���J��C�I�hF�ւ�������(���������&���C	&R�ZZ;�6u��/ț���_�:��K$G3�؆�2����ɀۗ�a�����S��5���;bߟ��:ϭ*n�N�p3ܡuH�\<���-�T�{���g��r,>��7���f~'�O��(�g�%�$�7/K�`j�4�(,��S�7ҋ!H��d�犅!;�.���`�"���$P�t�$f>'�_	h��A�$�Ԍ�n�vy511�e)Q�8�|F(�E�a�N��u���;��h��񊶈%�pw�p�R(Z#��,ר���U�YF-��t��xO�x5=w�
f��-��<*m��B�C��>s'�cA���뚥�a�k+'UQF �G���@��m#�F����$���X�l��^��mk�]�\u���Y�2