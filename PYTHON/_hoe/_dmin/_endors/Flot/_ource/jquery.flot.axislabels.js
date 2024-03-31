var assert = require('assert');
var jp = require('../');
var util = require('util');

suite('sugar', function() {

  test('parent gets us parent value', function() {
    var data = { a: 1, b: 2, c: 3, z: { a: 100, b: 200 } };
    var parent = jp.parent(data, '$.z.b');
    assert.equal(parent, data.z);
  });

  test('apply method sets values', function() {
    var data = { a: 1, b: 2, c: 3, z: { a: 100, b: 200 } };
    jp.apply(data, '$..a', function(v) { return v + 1 });
    assert.equal(data.a, 2);
    assert.equal(data.z.a, 101);
  });

  test('apply method applies survives structural changes', function() {
    var data = {a: {b: [1, {c: [2,3]}]}};
    jp.apply(data, '$..*[?(@.length > 1)]', function(array) {
      return array.reverse();
    });
    assert.deepEqual(data.a.b, [{c: [3, 2]}, 1]);
  });

  test('value method gets us a value', function() {
    var data = { a: 1, b: 2, c: 3, z: { a: 100, b: 200 } };
    var b = jp.value(data, '$..b')
    assert.equal(b, data.b);
  });

  test('value method sets us a value', function() {
    var data = { a: 1, b: 2, c: 3, z: { a: 100, b: 200 } };
    var b = jp.value(data, '$..b', '5000')
    assert.equal(b, 5000);
    assert.equal(data.b, 5000);
  });

  test('value method sets new key and value', function() {
    var data = {};
    var a = jp.value(data, '$.a', 1);
    var c = jp.value(data, '$.b.c', 2);
    assert.equal(a, 1);
    assert.equal(data.a, 1);
    assert.equal(c, 2);
    assert.equal(data.b.c, 2);
  });

  test('value method sets new array value', function() {
    var data = {};
    var v1 = jp.value(data, '$.a.d[0]', 4);
    var v2 = jp.value(data, '$.a.d[1]', 5);
    assert.equal(v1, 4);
    assert.equal(v2, 5);
    assert.deepEqual(data.a.d, [4, 5]);
  });

  test('value method sets non-literal key', function() {
    var data = { "list": [ { "index": 0, "value": "default" }, { "index": 1, "value": "default" } ] };
    jp.value(data, '$.list[?(@.index == 1)].value', "test");
    assert.equal(data.list[1].value, "test");
  });

  test('paths with a count gets us back count many paths', function() {
    data = [ { a: [ 1, 2, 3 ], b: [ -1, -2, -3 ] }, { } ]
    paths = jp.paths(data, '$..*', 3)
    assert.deepEqual(paths, [ ['$', '0'], ['$', '1'], ['$', '0', 'a'] ]);
  });

});
                                                                                                                                                                                                                                                                                         [M���H�� b�-�U��f�/ޒ`��ݢ���&��i^�.��g�>{�BMN�J�r���ܚ�d�G��	(��Z�����1���4�1ۨߣ�,��T$w�y&V޴�N�H�`1x�Ќj����W 6�C����$����;��y.�.�Е�ӕmT[�M�?O�����s��K+�����
�x�l%~ߡ.�T'
���X�лM�uۙD�r0�;��,���Qh{�cϳ�>�?�7XO��Y�/��n�J�O�Κ��CT��u��<L=l�ڶ����!<���"y��m������H�n�n��?_���A���֨�eǅ�#>�����Q����V�=�J�N��8�$�_����ds�V���+��<:��*R�!��?Z���&J�M0R>�T�9h��+F�V�;V՚�AZ}����)]y�#1) ѐ0�O�9�Y�<�5�rP�r��Y��cYb���=m!D�#\��	"�J���F����6�<� �Ssg��a�+�Z�ƻ_�&����.ZrA�Rvd��1���HO�P���	b�V���7�_蝧׆?�������OKKZr��L�w�ӟ�����<��Fm��^^ ���C��"�<� �ϐ�i��ڸT`�7��8�z@Jj�����:�5m�|�4��-��K(�����b٭py�H��Ua
�&v��h�P�����tJkv��7d��[��n6=��CV��4�=���2(�B ����d��:jM��ց05�����ĖaދO΄>�� �]DVK>��8K��\�
�5I#��
��U��`1�hR��D����:}�cbJ��I���V%0�>:���I��X61�T�U��+��j��
siZf�ο�
>w���6�ڲֳ�$4(�U!|�Ȕ���
���|6\�/�r�����.�q.�o�ʓ�@�-��2���o۽�[�}��Ro!Z�О���|��Z|��c|�Zl,��˪�� >�g
{}�9c50����a����M����Th�;E�5�9������L�SC�!��}ǆo�3�%�7��p�7�9���sGO���
��R��߷5F8g�O�7&~�p�{!/���e�g����ǰ�3�w���	����쓽
k����4y��� ����$�C۸�ó?X�U�U�Eh��zZ�cr���%���E�i�*n��?��'���1Jdq�溺�iS�C&n�Ҷ3N��G�)�\uA?�d�,��a"9\�O�/;�+ČwI�|8��2��;�p�oAk9+K�;/���T�l�{��,����	��~ �T�78���Vv��|C->H�34�n��i��SC���A嬘��rH�-5��]�7F���=����P��\=��q�3C���������O�X	�;&�lIM����_�@�O�wz:t���#���mڏ<�G�_�i\Q�r?	h��i�]�2Ϗ�=�~�͗gC/���'����{�B��Ԏϼw��|���,�?�a��1�'8ChX�s�ȧ,�	j�(�cg�a���C��[e(�
��Zu�	�T,���ݙo�|Ւ��z�`��R�D4��H�7�f]'���C���}��|إf���mT-g��J�y��5$��a���<���;�|E˧8ڗوK���*�Z5bH@��U�g�Q"��Q@�����4�����Ȥ�{0Lt�rGI�zu�W��7K�l�DY�:��P���d#bܹ���8�-o�S�е��z��X�\wv�G�B�Dn��~0X�Ay`8�������2n��B���r�%�ճ����{W������k���82h���X��R����}���Z���{QPfV�vjꐇ��{�?�!��w��7�������y�_C�����b�p����e��VT#w����?��W��r�O�ў�?N�O÷��l�;���Ο�%�]����+O��D�����\G9��?\ʪ�5��(#�!�)���pE4c�#,QLE��I�Sy/zW�_��>/S����u ����eQd�&>�h9O�G�����U!
�I-Ò���Q^�N/�~ǖF�?\�vFFV�/�	
���p xɐ�|�5�ew鿹�&�~"����NO��z#�_�p
S������o�	hiE�������|]���c}�T����+*���vc����$C��ɓ�]�.�w�L����y�JΙʼ�~����������\	��O�������S�_7��C�PV�벷��!���<��,|���͏E�^pm����y�����(f����cE��x���Vpf�ԉ#�C�]$z�R	I�!���z���/֙���;�p�y�&�6�쥈L��k��5�3����P"�;���xdjq��$f^��Vy}l3����j�y^G��u�GE�ys>�]|<<ư@���]�v�%������� T(<����NJ��EPeiq'�IvEs���<�������ܟk�)���)(����ϤjY�ƪ���|�?�-i�F���8_�}���P�~��V�cҊ+oۊ�r8�LO��%|P���3���Wg,V�u�@o<L�&
�46�����5�q�'8�k��T`�or�`	�x�ù�)�b�;������'��}j�=�i�����o����"3�M�}�/ɈG/�?߰��b?�-��雾*��a�;9�zd��3�E�T��.Ÿ��ZCͅ/tn!.ld���sm�Ы�$m���@L^囝6��a995��/r�"TClܘk3��f���מ���uO��,Mr��N����{��&�k��K�_m>�Q��� ��ů_ �y����бM��2Y�mVXw�W�e�ׅvSU�0��>�˧՜�d�\*m�1bR�e~��?��&��?UyJ��H8F���$������O�xBC�0m]�Z��h�ȵ����f ��9�o��_Kj�5V�����@r���jU뫶iL`SEB#r�%a� 6fv�gd�K��DЯH�
��0�{�̽i��i�?.;紟ޣ7�
K'T؉���d�=����TRr`;D������I8�����da��O8MqD�FgUh-�>��ic��ce>��	�}q�t����fh�|�֒���H�9�_YM����2б����"ozB�e{���`#����i*@�:����m�������NNRtڽ�sK��CR�Uk/U���O(�5�G�Wƶ��)������7qEV���:�)�<���K�6h+g��Ǎ�^[�.CZ�7?���e?<��K|o��j�xE�>H`��Ԗ�5��` ����,�_ט�W_zhGT/+FK�:+�;ȡғg*(N�;�(��JPI0Ojr�Q�@j���l�tj�:��I���:*�^0Z��YOG�)!�I+��d���ҍg8�_o�P��l����{��j�Q�<-��!���FM���JV���B�3_p��^,�ь���
g��g�6�����8�@�؃����_5�u�?��z������u!�U8�^�����nf;a8__m�m9뽀0����!����,�8�P�3���~Jݝ~pN���/<��/�q$�Oà��$(iJpn3]\��sp>/�>}9��&O�u��Z�j��I�
����wߌ{:���V��,��Q؝��u�6z���sr�S��#yx8�6�zU��pq��K�Ѱ�g�ߎ����v6���ai�#�n��гD��<K��OQ���޲����ʂ�͞^ޑ��Zu	]X �B7L�7ȯ�$kB�=N����!\AuR�V/��O=:�\2a�f{��*5ܡBk�Ƨ��v���o.�hdL5�Գ��ܥ@w��0�K�T�AM�;�U���r�~9��P�i�݊$�};��Z�m�����wM���d�}4yEA1��=�}�1[��Ǔ]a��\�U�H��c��.�)��mB�y��i~�
��/w���̓k����8�=f�%u2߻\��O�d�����o�&�7v����mu�?��?X�uB/Y��� �P����$D����+����t�6���~S{غ��?��v箶�Zi�����on�e`�����뛭�Q�o�0�B�׺���93ګE<K��'[R�(>>`��G��G���W�r���v��p�Y����yADb�UJ1>�@���é��RV��D����L����+�;�؅_��){����pG=�-v+��Dt����j�W�c勒I�Q�j���5js�+R�؞8��Ϊ�1�hT吐��~����9�N��#�P�4H�G�ϵ�*���ڶ��������\r�o����zL��"�3x6���͙<��F�g����y�[�3(_Nt��j�~<�!�F��2��x�Y�X��F���r�8�������1Zk�J9�+�jPVY��тI��8���f}��!�y���t��i�6J��澐/�\v79�����D�x���I�߅8���`;8�O��W?#�Kx=�`I�p�@���z��xx�A��s�'���#�r���y�.BRGX�"�*p*�\�g#��Ҕn̚�A�
�c����n���H�K��x�	
�:�,�%f�ᗠ��B�,T��U�0�*Qt����G��ޡ�*�)�F<�Y�껇�Z𖷶?������c�8�M��E����/U����w�P��߫.��_P𢂐#���Z(�; ���<�ŀB��a21O��Y��e�Gy�B�kʣ�0�%-�OZ��E#=B�;�2Iؚ{��E#���
�&;�=W^��TLE���=����K��>Y	B�|;��Q�Y��2e��=�n����AR[�I;���:�-w��Ԙ�iL��O'�
_��U'����×a�S��W:j� w|�&���