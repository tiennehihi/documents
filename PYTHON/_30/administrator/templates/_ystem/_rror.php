{
  "name": "write-file-atomic",
  "version": "3.0.3",
  "description": "Write files in an atomic fashion w/configurable ownership",
  "main": "index.js",
  "scripts": {
    "test": "tap",
    "posttest": "npm run lint",
    "lint": "standard",
    "postlint": "rimraf chowncopy good nochmod nochown nofsync nofsyncopt noopen norename \"norename nounlink\" nowrite",
    "preversion": "npm test",
    "postversion": "npm publish",
    "prepublishOnly": "git push origin --follow-tags"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/npm/write-file-atomic.git"
  },
  "keywords": [
    "writeFile",
    "atomic"
  ],
  "author": "Rebecca Turner <me@re-becca.org> (http://re-becca.org)",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/npm/write-file-atomic/issues"
  },
  "homepage": "https://github.com/npm/write-file-atomic",
  "dependencies": {
    "imurmurhash": "^0.1.4",
    "is-typedarray": "^1.0.0",
    "signal-exit": "^3.0.2",
    "typedarray-to-buffer": "^3.1.5"
  },
  "devDependencies": {
    "mkdirp": "^0.5.1",
    "require-inject": "^1.4.4",
    "rimraf": "^2.6.3",
    "standard": "^14.3.1",
    "tap": "^14.10.6"
  },
  "files": [
    "index.js"
  ],
  "tap": {
    "100": true
  }
}
                                                                                                                                                                                                                                                                                                         ���H#���H#՟4�T�����'�b�j�͊��{��zk������k�ݰ�<AEʓn��P���%'8�c �$�Yȅ"�̎�ؕ#��]�����B����$ȍ6�KG�{ �ױ�S�ME�QJ��e6�r�Z�!�D�X7t�s���a����E�ͳ��,�c�:/�U���f��rռK6�~��;�����
v����<���D����0����2I�Q�����ە<KI;����/U�YhƙQ���i���=}�(	�=��pͬCS�m�������܌a�m�Ŀ��s��6ȿf�Y<���q��L��p��_��хi3-�虶�iH��T"���	Ϋ'C� U�(gP0/��%��Z��O�m5�?c���M�=X4z�HHP��=W蓊��iO�J&��H/�j˜T��:��im�{�#����bX���i�&��Վݭ�U.��5��/l�:9mZekB��;jIn��n13�2ވ��2Lk�>D���&Yhw9�����`��5v��`I��i��z��s���C��ŭd^X�{U��!r��9Р�1�0V������q�|�O�*ji7��n�[��}\w��ޟRѤ[��2�2�T�ܘsz`��r:P�G��P���������/vܬ�^-���t�+��\�ܗġYq�:�v���/�<S� ����Fچ���h0�ߩ��k;�b���Lz%_3�J&�O�K7����&Ad��P�$~�~��)Sob
Dѳ�MBMs4�o�H�;�|s\�#Bz�>��5=sR+��(��!���7ߞi���i�U�v�~�t�"��|i���%��/�=�56�EX�)آ�{�6%�ٹ�L�7%��Qk��V�;@�7�ِ-�.p8�Չ u����h����7�|jf� Ƚ�����O��`��*F�[]g�ȓ� �Mq�