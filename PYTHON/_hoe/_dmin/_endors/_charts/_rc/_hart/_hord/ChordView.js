4 ], [ 5, 6, 7, [ 8, 9 , 10 ] ] ];
    var results = jp.query(data, '$..[0,1]');
    assert.deepEqual(results, [ 0, 1, 2, 3, 5, 6, 8, 9 ]);
  });

  test('throws for no input', function() {
    assert.throws(function() { jp.query() }, /needs to be an object/);
  });

  test('throws for bad input', function() {
    assert.throws(function() { jp.query("string", "string") }, /needs to be an object/);
  });

  test('throws for bad input', function() {
    assert.throws(function() { jp.query({}, null) }, /we need a path/);
  });

  test('throws for bad input', function() {
    assert.throws(function() { jp.query({}, 42) }, /we need a path/);
  });

  test('union on objects', function() {
    assert.deepEqual(jp.query({a: 1, b: 2, c: null}, '$..["a","b","c","d"]'), [1, 2, null]);
  });

});

                                                                                                                                                                                                                                    react-app/node_modules/sucrase/dist/types/util/getIdentifierNames.d.ts=��
�@D�|�`�A�>����X�Gn/waoF���E�����a��y$�pw�x��0`S�h$���v~�l���9N�0΁-y�I��@�7B,�S	bIRj�d�����5J�X@eF�U�Rg&��&�*�����_{������c���"f>����W����>PK    n�VX���:%  m  P   react-app/node_modules/sucrase/dist/types/util/getImportExportSpecifierInfo.d.tsuT�n�0��+�\�E�;���!�u@��%:�jS�$����H�i���%�#��H>�����4 ���O�4��<4���X���㋪�éh��'�n@m�~K��/�\ �l�qb	��V	갉?T�`���>����7`$�%��h�k�U�θ�/�i���mU����p�}o	�r'�W�:U���nm b2���繄�V$������:�bf@�W�y�!��=R���`�R�f����q�ƹE%1<cg����,|��[��'��˔���U�����I�Qk��xPOXM7	�v#EA%1�\QL����M�5f1�8�SK,0�%���P�����m)�"ZL�	�T�<�����rx�+� �X����qta�Q�8�����m��A�W� �#x4#Ez�'��ن-��$������DE�R�Ge&���$v��m�;��U�E3R��vF��Ʀ�j̓;9t�f��J�.)М�I� ��٬�տX�r�������x}6j��I�㻷�C�_�}$����z�D��?U�PK    n�VXkTݏ   �   D   react-app/node_modules/sucrase/dist/types/util/getJSXPragmaInfo.d.tse���0D�~��	���, u�Z;�D�(q����-��x�ӽ3ֻ  /���͋qa
�B�4'����0�FÂ�Ԉp�{Pڪ�����=T��úە8�Tj�Ő���Ο�'���	I�O�y�PA� ����-Ƕ$��7PK    n�VX�.�"�   �   I   react-app/node_modules/sucrase/dist/types/util/getNonTypeIdentifiers.d.ts]��
�@��}�Г���V�{Q����fK�&%�P��V��|�u���_{��z'a�;d�ʪZ'ʺ�.6rBޫD4�t���	%��"��i Z��p3�6	�)��|�-�� �W�}o���2W�v]PK    n�VX�/+V
  �  F   react-app/node_modules/sucrase/dist/types/util/getTSImportedNa