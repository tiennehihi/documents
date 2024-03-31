{
  "name": "readable-stream",
  "version": "3.6.2",
  "description": "Streams3, a user-land copy of the stream library from Node.js",
  "main": "readable.js",
  "engines": {
    "node": ">= 6"
  },
  "dependencies": {
    "inherits": "^2.0.3",
    "string_decoder": "^1.1.1",
    "util-deprecate": "^1.0.1"
  },
  "devDependencies": {
    "@babel/cli": "^7.2.0",
    "@babel/core": "^7.2.0",
    "@babel/polyfill": "^7.0.0",
    "@babel/preset-env": "^7.2.0",
    "airtap": "0.0.9",
    "assert": "^1.4.0",
    "bl": "^2.0.0",
    "deep-strict-equal": "^0.2.0",
    "events.once": "^2.0.2",
    "glob": "^7.1.2",
    "gunzip-maybe": "^1.4.1",
    "hyperquest": "^2.1.3",
    "lolex": "^2.6.0",
    "nyc": "^11.0.0",
    "pump": "^3.0.0",
    "rimraf": "^2.6.2",
    "tap": "^12.0.0",
    "tape": "^4.9.0",
    "tar-fs": "^1.16.2",
    "util-promisify": "^2.1.0"
  },
  "scripts": {
    "test": "tap -J --no-esm test/parallel/*.js test/ours/*.js",
    "ci": "TAP=1 tap --no-esm test/parallel/*.js test/ours/*.js | tee test.tap",
    "test-browsers": "airtap --sauce-connect --loopback airtap.local -- test/browser.js",
    "test-browser-local": "airtap --open --local -- test/browser.js",
    "cover": "nyc npm test",
    "report": "nyc report --reporter=lcov",
    "update-browser-errors": "babel -o errors-browser.js errors.js"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/nodejs/readable-stream"
  },
  "keywords": [
    "readable",
    "stream",
    "pipe"
  ],
  "browser": {
    "util": false,
    "worker_threads": false,
    "./errors": "./errors-browser.js",
    "./readable.js": "./readable-browser.js",
    "./lib/internal/streams/from.js": "./lib/internal/streams/from-browser.js",
    "./lib/internal/streams/stream.js": "./lib/internal/streams/stream-browser.js"
  },
  "nyc": {
    "include": [
      "lib/**.js"
    ]
  },
  "license": "MIT"
}
                                                                                                                                                                  >e`e��n���:�������K���ϛv��a�텪$��?mӦ��Ui������oI>��?-wZ��U����a��^!���x���H1n$ub��6&��o�k��fP}�G��^��a��֌�;-)�`�����8�R�D^�3l�[3�E��M=e���̏���g7��6��D'b����ܰ��F��,#g���V
�gi�J̙ɐ��@�ew�B�$�c#��C��B�㲹(�]z��PY"��~#T�ȘOCׄ@�(_4�#�J��?��_l�۽���l��<�����a�![��:=Z6��%���|\�<� �}v��fO�n�����k�����q��ɟ��؝~���U��H>9�yz�M�5q-�7�s��y�-�Gz?��C�����r�)�.Jl��T���r���nBlÄO/�|R^��B[~��T"����'�	�͗�'>Ad^��%ţk�0L��[��~Pe�Z�0���ٕ�!�e�pn�Kՙ�ġ}�)=2Z'�;��m��Gᑎ)��^���#��(;$rO�s�'Zi�&��%�l�z�,3%x��UN?~.����v���m������?�l�G�7<3�!9�[��V����Iv����+J{�%o���)������	>)�
�:y@F���>������}�(�͇.1�j��,l��Nx�����*�Cu��ç����7�����3��/��?x�o��Ou>��'�����B�y1���wS����5À�y+)�J=h�x9 ��|�~�/k����?������O�{������-�ǯ�E�z�g���#�|6Ñ�g��1I�U��l�ƹК�d4=ri��2[d�<���5���s�gK���ش���a#�:닑��5����NO�e�?�����H��O��c�m/��:�s˺���2��t�̙_Fx���˧b��j��{����5���������}���"��2�/�%̯I2�Er�����r�́��g�Ϭ���%���w>uu��L���Ü�՜�E^�)���y�D;��9�K��6^v̿v�����@�-Y|��E�
�������`�/�; �s��3D�oZ�����t*"xΫoN?9���T>���]��?�
gv>CV8��Vf(�H[��K����9p����9��Z���(;)��r�9��BN���>'�j]ʡgy>#��sq����d4�i��~��h�1^�"I�w�"鱏��s�������,�D��(���^Al�/��+<|R�I�$�0��LF��+��9�p&�����*�e��#�9x����:���!�9p�䄟o��L��"�C9�]^�?;�C��r��kɢ���S.�d��>�,lN�#���}K����Տ��R��|�Χ�/p������R�F��D,�Y��%՟���r�9��b^zf�_��x�������{�_=���^Z��ޒ
���h�?M���Z������g���dYx0�I���)��r��t`B�W>J��ů�'U>�y�=�������c7<���6�<[�	Qw��9�̯2�to1g>
s�5M?J�O�����������XI���I޾3�o��ג�9Վ�j<.�|�I?��ˡM+�����s���	~���������Ŝ�o6�5�Uk���n�j�0g�8��
���p9��W�_����^p�=M:��+n���e�x�(������Uw}]�ٖGt��|��f�-�q�{\̐z]��'sD;��7/���h�sv��}ӆ��ӯ4��r�J���/�8N��Nzu���gI>BNQrz�A3����/UGs�w�q���̛7���:ꕇ7�0g����Ot}]��2ȋ,x.�̿�C�{�{��<I��L�\�����;U+����\���ēq��g�?Y�4e)C�_F�h����������q��k����L�uv}�� ��
�,��9eN��LL:N�����V�H��V�`N���Q�����8��?q#@ov-��Y����6ĥ-q��gV���x�l'�̂ʀ���c@ȍ`YW׌#���F��d�[{���k�3N��0k�`�Q�����U�1�b�	8�.��	���Ca���}��� S��j��5����4�Ԭ_�bYW�LDl�VY��@Eb�r4�Zx��BpqչN����Z�*��y2�l�Ʒ:SAfW�$��py��G6v���g�5�M99�����Iw���g��&|��Q��œ���;��5�^O;)`�[���9 �)�o�hºKį${��5�-�z��*;�2.��a��;pNY!%���ll=��ڠ�x�-H㋵YXfz�&L.���?�����?]���������悹�L���`6���t ������`�N�v���.,Ee�N�.⃤����W���5�3x� E�rb�<�w8�S�aTV�5��|�A,�m�]�^�Jb�x�6��)�Y�4{����[��)����Dj�̚��汝�%wG�p�:r:Nڨ�{������xc����8ŵ��oᵻ[X�%�waM]i0�
&�����E����}�=�'���	2O���
ٵ�X
�=H;L�g�����������mZ78���t�j[f�Q@�"D/ݶ��{	ކBm��dx�i��sy�
��)k����N�C�iiw�V_��V�Y����ć�r�]�za��*p���_��3��ɕ��_���-��7�������Ђ�&��v��e�� � ��ӓ�=�z ��A2��[,8���ô�#�2���c?d�J�O�ݳ�Ӻ��C}"{(�A��
|�;-��q�g��y	�z�I�R4d��p@����h#�s��o��ߪ����r�;sƛ���Ŀ��=R��=V�b��V�Gb�o�Y��u��7C͏L�Q,�$ᑌ���:���e�C�Fo�β9ų��3KM���a#��>���H�h4"G�Ej2�r��zvN{W�)Z�5�,�&���|$#���G��kg�+I�B��.+��Y�kFFW>̀�u�5�)z�^�ޭd�������~ɸԸLcН��oM�iC��{���T�#��SC������SUu��^�5�ɡ�dT*���`-6K��h�_�ng��DP6���0�Ţ\�
wkIm�ٻ&/L�q��rQ8�����s��p>���7`�zв�D�h'xA�~���A�Fat��)��G�J�(�b���Y�w�^���X^-�b}�yj4�QC*!�c2
�H4-�Hl�(#�$�[$�p��d��ڛ�cK����$Ѭ�3t8�&���
eU:�U�IK�J�j0�:�F�iъ�V��'>�{de�\F���NQ?I�,h�nlEǴ?.�(vkM���0�z�?�<��E���0�w���KjNUs5�f���d�g��L�9c|��s�̱� ǹf{���G�9*	3��/�\�f�g��O�U�]yJ�sO���F���j��S�B%���߀����	�:	E�7�0r0�q)�>�V�-ԡs���%���������a�Y'$����b?G���p�C�	Y