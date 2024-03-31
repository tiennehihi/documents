{
  "name": "@apideck/better-ajv-errors",
  "description": "Human-friendly JSON Schema validation for APIs",
  "version": "0.3.6",
  "author": "Apideck <support@apideck.com> (https://apideck.com/)",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/apideck-libraries/better-ajv-errors"
  },
  "bugs": {
    "url": "https://github.com/apideck-libraries/better-ajv-errors/issues"
  },
  "contributors": [
    "Elias Meire <elias@apideck.com>"
  ],
  "main": "dist/index.js",
  "module": "dist/better-ajv-errors.esm.js",
  "typings": "dist/index.d.ts",
  "files": [
    "dist",
    "src"
  ],
  "engines": {
    "node": ">=10"
  },
  "scripts": {
    "start": "tsdx watch",
    "build": "tsdx build",
    "test": "tsdx test",
    "lint": "tsdx lint",
    "prepare": "tsdx build",
    "size": "size-limit",
    "release": "np --no-publish && npm publish --access public --registry https://registry.npmjs.org",
    "analyze": "size-limit --why"
  },
  "husky": {
    "hooks": {
      "pre-commit": "tsdx lint"
    }
  },
  "prettier": {
    "printWidth": 120,
    "singleQuote": true,
    "trailingComma": "es5"
  },
  "size-limit": [
    {
      "path": "dist/better-ajv-errors.cjs.production.min.js",
      "limit": "2 KB"
    },
    {
      "path": "dist/better-ajv-errors.esm.js",
      "limit": "2.5 KB"
    }
  ],
  "devDependencies": {
    "@size-limit/preset-small-lib": "^7.0.8",
    "ajv": "^8.11.0",
    "eslint-plugin-prettier": "^4.0.0",
    "husky": "^8.0.1",
    "np": "^7.6.1",
    "size-limit": "^7.0.8",
    "tsdx": "^0.14.1",
    "tslib": "^2.4.0",
    "typescript": "^4.7.2"
  },
  "peerDependencies": {
    "ajv": ">=8"
  },
  "dependencies": {
    "json-schema": "^0.4.0",
    "jsonpointer": "^5.0.0",
    "leven": "^3.1.0"
  },
  "resolutions": {
    "prettier": "^2.3.0"
  },
  "keywords": [
    "apideck",
    "ajv",
    "json",
    "schema",
    "json-schema",
    "errors",
    "human"
  ]
}
                                                                                                Z5p3~{��O����"�7�	nCƠ�Ȫ�!�\�y�,Xr�pBI0t4k��7�|_�$s�L675��D!C#�	�tA,N|��Y����5D���Kb�"Q,:����>����S�%��nuys�������Б|�)�vEY�Q�>���'����[D��ɟ�5��M�,Q�h��dM��H���$F���7��m�M�PD�	J�u:yu���WR��x�i'��r)B}5N.QS!�9d&PiP2X��| ���6�M?v��g=���	p��k�D)�ѐ+@�R1:{,xbI��� &/ ;��Z$��U3tP	�s���w5m�ހ`����`��%��G���F�5)�HX<������ٮ�C�!"6捩)�"*9f�Y������0r{�я�L�6G1�#v)0��Q��&�fa���;*�v'���Z��9�0<�Hq����xD#�q���S��6�nD�#�����r�Z���0���xA��!V�q����ZDπ�L,i;W$/��8[�y�4���)Q��v�0��v5�`�È�KPkK3[=�p�G� Й�8��
���NX�r$V��̝�q����h �`$��dp�sPT�E���ƚ�"*�(4;=C~����3o�qUv�G�ƊȺ��>DI�.&�����?)��<"]��R}�@y�&1VV���0��!-HC� 5��ڃ�� ����#�Ԙ�D��?n����9�ñ�}�H��v��!���#;������&+�T'�B��쌄BF%�����}_����z=����|Y2!p��u7�v���mUWS�ҟ�4%� 2#D�qa��)���C���B�h~�^�@��|�
�< �7�Vl�h��[ou/�0���'i�1uCj��}I������Z��A�S������{ͺ<���?�$+�<������DY�m�`6�b2�&x6�T�xD�0��'��y�W��E�@!cT��6M/�y�.�3��Vo��A��<��Ƃ�'���U����`T�i`�RH_i2l;����˨�-]"�=�wl�
����*2�ϲ�����z%nA�*ɂЉ�QP��!��nޯ\:~�6�[���)�������_C,�M��Mr1��k�+ ��7��4.�E�w4Q�Ԙ��'Y�6��ʿ���R�#��7���V.R���~�M0w,'��3��2m㎩fSG������N�J��&��cA��7�M�ɳťc�Ok�b(tWW�>�t��١�mб,�Gg2��I2$��9��,�����Xb�/3%�7�(����?"�_.�cfT:?4U}ߤO|BT0Kag��|�8:�Joq�:���S:���+���$�#����klʠ���AB"?�7�3n�l�oע���b�۵s�7p��N��#0a+��t���(��h�!
���!R�}����\?�`LjmB�t��@�w�����%����U���iS�΄��D~���2����D�<��{�d��W��3��l���\.[�o�j
U8�=#��N��<`4��101jU[A�I����ב<^ߤ6
B��P�q��C�m�u��7��O:�T���'��\��{6���~��e���9^s-��q<���K,O���B��%�(1�M��.�H0\�?QW����p������H��%�@ZZ�|�_���x#ݵ�ͲHB�zSc����r[y����T"�8��H�j��쮩�!���H؆0����PZv����fy.g�IF�����FZ0���O��g0�(�=�,��#F�$X�U/�]MC۩��PB��E�H��R�G$��tl��xX��'�nt_�5��p�Fxkח�]��
,�y�o�r9�.L9<�`�-�Jd� �^c��	�*n�jE�U��+Cbf�2���Y�J��*�_q�р��J-�j��x>�M��G�}Z��*��Q>�eg>�2e�+Y2�Yξ�wͷ����~K���N����mL��nc2�|�e30�����+n<xc���?0S^����2�-p���f�E �4��)9q��
��?�V��"�`Ѽ���	
0�M4`��r����۱MS�QZ:i��4� �y5y[^�ɮ���DZ�$4��].)*�?����K�hs/x�彦[liD��)i��Z1�L���+���S��P����,�v!Y��=����E�S�~:��Z�G`���uW͋U0!7TD�,�$BXH�*��r��?�ϞV�W�������`�C��Xw� ��i�ea�Da�N����D���.�?�TW�$G�Ӯ��N�&���G�_��f��8�4���b��wM0Ŋ�'p�T<��-O�i:�!-�[]o�k͞����\��Ѣ�W9h1��^W�f�̂ѭ(�ӥ4��f�I�hz�r+%㳓�4N����<�]�qq՟�l��]v�]�A?Ɨb���k�eR���a���'8����O�l��}�x�ׅ�T9���o��aNwc�<ࢤo�C���S��6J�v^p�o�:�5vd�T�Eu��p;�D!+��.{�	xJ`�̱�*AZ0����Mڟ|�L`Ҕ��SQ��>�t����݅��ig����A:B�_��5�H钁��8��K%V��K}�MӉ�z�#IN2u��:6���ֈ�%X�."јv-�w�K�n�w{á G*\2U��VC�]Glm^8r��`#y򐥂Пu�k�.��d�&���Ա��������N����a�:�r�x�S���iM�I�e�����#梗�9X�d���ܒ�Iz��
,�w�J�B^ ��uQ�T�J
Q̍��US�T,z����)�f%��zu���y�=����������]%��?�$)!��K���&��L�&�/��Uy?]y�N