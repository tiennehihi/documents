{
  "name": "webpack-sources",
  "version": "1.4.3",
  "description": "Source code handling classes for webpack",
  "main": "./lib/index.js",
  "scripts": {
    "pretest": "npm run lint && npm run beautify-lint",
    "test": "mocha --full-trace --check-leaks",
    "travis": "npm run cover -- --report lcovonly",
    "lint": "eslint lib test",
    "beautify-lint": "beautify-lint lib/**.js test/**.js",
    "beautify": "beautify-rewrite lib/**.js test/**.js",
    "precover": "npm run lint && npm run beautify-lint",
    "cover": "istanbul cover node_modules/mocha/bin/_mocha",
    "publish-patch": "npm test && npm version patch && git push && git push --tags && npm publish"
  },
  "dependencies": {
    "source-list-map": "^2.0.0",
    "source-map": "~0.6.1"
  },
  "devDependencies": {
    "beautify-lint": "^1.0.3",
    "codecov.io": "^0.1.6",
    "coveralls": "^2.11.6",
    "eslint": "^4.18.2",
    "eslint-plugin-nodeca": "^1.0.3",
    "istanbul": "^0.4.1",
    "js-beautify": "^1.5.10",
    "mocha": "^3.4.2",
    "should": "^11.2.1",
    "sourcemap-validator": "^1.1.0"
  },
  "files": [
    "lib/"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/webpack/webpack-sources.git"
  },
  "keywords": [
    "webpack",
    "source-map"
  ],
  "author": "Tobias Koppers @sokra",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/webpack/webpack-sources/issues"
  },
  "homepage": "https://github.com/webpack/webpack-sources#readme"
}
                                                          EYݧ��RT6�jx�q���c'?�{��CL*�M�TP�m�Or(��\}Sg���&���B�����RDb��������קg�߼8��%\�Ӄ���-U����eWU�{�R��V7;л��?�eu�U�`[~?��e�ߟ?�=�����>f��j��C���$O;�EJ.eb��Q��:�ah]�x'�$U`�z�^�B~��,g~�П�4�V���>u\�L��D�5���M�/�u+�w�`���In~'z�Z�SfvXf�֥���<�wX@+��9)�,�|S�ʺ��xO�a��pIQ�z�o���FH�l� � �@y-h&J J�ׂh�%��0�ه����y�/�c(�w���4���PU�n��������+h��c��qd@�S&��M��dCŮ���cVh���R��)le���T
Zo����(&�r���7����`���J�cȘ�;1��2��z�G��
6q>����9+��<M����/�
^-�܇���?)��r��k����l�����QR�5�h��j؈�Mժ�jU�)TD$FT5���$�����R��P�
w6�S"����ē �Wx�3��
'�~:h],��%]��5��ۡV���)��6
\�.�?t\��R�:�h� �4<w|��_�@\�t���d��h����2�i6	ⴶ�g����p�`ғ�i���D���g�K{r2�.�ĘbL[c�"�JA�c��oC��:1�Y ��K)(l���|��R���Ѳh�sfv	.�(@oD&G�K�1�����M��R��!r�NB{��!?k�wZ��v����7���9TvMg��u���v�"�d*�WE����w8�|�Z��5��c�^5�O��6t���K��r��^R�t��? Y�^� m'0�ƇB�6?6 @�)�-n�bMZ����ڼ���8s��}���)T*b�P�A
Z�]MgT�%�殘���%���A�@��jf����:�9Fj�K't֍��w��}�eď�/���9��y�lb'�CGݱ\ob����g�� um*��-+���/$�)��h�	*	7���k`�ucP�����&�;T~��Q�v	_���,�U�^��58G���א�ݥK:ޥ��{�SJ̺X������k�x
x^�˸�+�.����!;��a`coQ���ȽQd�n`ϸA�m�9��i�mŝy[��y��`9�>�8��`�5m]�y
<���c�(a̍�v��-r﯋r�$�Hhr	ۃ��=�&4��E� ��;W�g^�p�7*��_UpV��l�>;C��#R�c� F�,�μ�U8�8�C�
��ٰN�(�t_���tX$��g�$ m�mjT?0�B�c�Sx�/��7�Sr�d9���IKE:�|T�~�}uYh������I�l ��\�b�?a�^DK�je$o��ѣs}� ]8/&���lG��<B  �s����Q�t��a�3���P!2�VEc�<|^�5fFzY���q�Fx3�u��!B|?�p.��V72���\�}nKޯ��8���哋L>�&���"�1���8���ċ���~�2�"/<��!�Cx����3����4d��E5F��<_X����a��S��$< �Op���������i������E|��μ]��D5�nC��)�ˋ_��l��|���� ��	C0����z?���.���b��*�w��u3q���$��dk���B:5���Jj5H�^��9�.��=�n������6(�t)�	�{�4@+8��I��Q^�!��j�A7��,�9^��e���Z����*D�T��*���'ԧ�F�q}�>L���
�E�����ėTD�N �(;��d�r6'�a��Ƙ#@vN'C����D���T�)�1� �fj]��Lm��]3^U��?�bj0^l�b����3ќ-5�E[�!�*K�N�ۨ&E-Й6�i�M8sfYH�S�W�g��A�ox�%�5gl��[
���c�� �Nk{s�a��C[�i������iwڃ��:�Gۻ��w_� �ߎ�7��@�����xD��N��8���)0sK�6
��&ƌa{���A.�l�fI�a���j�ruTj������Wu�	~lz,���0g�� Q���70��*�.�",���w�����"�I(��D0��U�����5T��֋���_��}w��x|�����hss3��6�qB�0��c��DBh2�/h���k"MZ:5�ڙ6NڤȨp�Bە_BC��(,d�̦�Ƀ�*=�Ћ�]��pn�x��)p�u�Q���Z!id�ڴ�����NS����~�Ts0t��6'TOʹ��A�L���[�Y1aQ:����ˆi��� � �x$����u�"S������KE>�ƀ)��Ǡ��O���զfX�ZnY��7�?�m[ɿ��=W��G�W[���I���=������[�msC�^R��[��/�` ����9w?Y&��`0�]o���,h��Jec ��+i'T{ӡX+^cC��^d�������\��,�l��E��=`:=���GJk��h�Ъ�,ךqZ��3�P�\k�p�����pZ[�֝>,Pj-�B����+jX����L�d�Î�J���p�64�"�M��e��ޟۀ��ꀿv�w��;�kI�