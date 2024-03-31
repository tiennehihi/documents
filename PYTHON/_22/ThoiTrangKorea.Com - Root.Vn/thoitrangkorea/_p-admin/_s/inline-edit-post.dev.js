{
  "name": "uuid",
  "version": "8.3.2",
  "description": "RFC4122 (v1, v4, and v5) UUIDs",
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
  "keywords": [
    "uuid",
    "guid",
    "rfc4122"
  ],
  "license": "MIT",
  "bin": {
    "uuid": "./dist/bin/uuid"
  },
  "sideEffects": false,
  "main": "./dist/index.js",
  "exports": {
    ".": {
      "node": {
        "module": "./dist/esm-node/index.js",
        "require": "./dist/index.js",
        "import": "./wrapper.mjs"
      },
      "default": "./dist/esm-browser/index.js"
    },
    "./package.json": "./package.json"
  },
  "module": "./dist/esm-node/index.js",
  "browser": {
    "./dist/md5.js": "./dist/md5-browser.js",
    "./dist/rng.js": "./dist/rng-browser.js",
    "./dist/sha1.js": "./dist/sha1-browser.js",
    "./dist/esm-node/index.js": "./dist/esm-browser/index.js"
  },
  "files": [
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "LICENSE.md",
    "README.md",
    "dist",
    "wrapper.mjs"
  ],
  "devDependencies": {
    "@babel/cli": "7.11.6",
    "@babel/core": "7.11.6",
    "@babel/preset-env": "7.11.5",
    "@commitlint/cli": "11.0.0",
    "@commitlint/config-conventional": "11.0.0",
    "@rollup/plugin-node-resolve": "9.0.0",
    "babel-eslint": "10.1.0",
    "bundlewatch": "0.3.1",
    "eslint": "7.10.0",
    "eslint-config-prettier": "6.12.0",
    "eslint-config-standard": "14.1.1",
    "eslint-plugin-import": "2.22.1",
    "eslint-plugin-node": "11.1.0",
    "eslint-plugin-prettier": "3.1.4",
    "eslint-plugin-promise": "4.2.1",
    "eslint-plugin-standard": "4.0.1",
    "husky": "4.3.0",
    "jest": "25.5.4",
    "lint-staged": "10.4.0",
    "npm-run-all": "4.1.5",
    "optional-dev-dependency": "2.0.1",
    "prettier": "2.1.2",
    "random-seed": "0.3.0",
    "rollup": "2.28.2",
    "rollup-plugin-terser": "7.0.2",
    "runmd": "1.3.2",
    "standard-version": "9.0.0"
  },
  "optionalDevDependencies": {
    "@wdio/browserstack-service": "6.4.0",
    "@wdio/cli": "6.4.0",
    "@wdio/jasmine-framework": "6.4.0",
    "@wdio/local-runner": "6.4.0",
    "@wdio/spec-reporter": "6.4.0",
    "@wdio/static-server-service": "6.4.0",
    "@wdio/sync": "6.4.0"
  },
  "scripts": {
    "examples:browser:webpack:build": "cd examples/browser-webpack && npm install && npm run build",
    "examples:browser:rollup:build": "cd examples/browser-rollup && npm install && npm run build",
    "examples:node:commonjs:test": "cd examples/node-commonjs && npm install && npm test",
    "examples:node:esmodules:test": "cd examples/node-esmodules && npm install && npm test",
    "lint": "npm run eslint:check && npm run prettier:check",
    "eslint:check": "eslint src/ test/ examples/ *.js",
    "eslint:fix": "eslint --fix src/ test/ examples/ *.js",
    "pretest": "[ -n $CI ] || npm run build",
    "test": "BABEL_ENV=commonjs node --throw-deprecation node_modules/.bin/jest test/unit/",
    "pretest:browser": "optional-dev-dependency && npm run build && npm-run-all --parallel examples:browser:**",
    "test:browser": "wdio run ./wdio.conf.js",
    "pretest:node": "npm run build",
    "test:node": "npm-run-all --parallel examples:node:**",
    "test:pack": "./scripts/testpack.sh",
    "pretest:benchmark": "npm run build",
    "test:benchmark": "cd examples/benchmark && npm install && npm test",
    "prettier:check": "prettier --ignore-path .prettierignore --check '**/*.{js,jsx,json,md}'",
    "prettier:fix": "prettier --ignore-path .prettierignore --write '**/*.{js,jsx,json,md}'",
    "bundlewatch": "npm run pretest:browser && bundlewatch --config bundlewatch.config.json",
    "md": "runmd --watch --output=README.md README_js.md",
    "docs": "( node --version | grep -q 'v12' ) && ( npm run build && runmd --output=README.md README_js.md )",
    "docs:diff": "npm run docs && git diff --quiet README.md",
    "build": "./scripts/build.sh",
    "prepack": "npm run build",
    "release": "standard-version --no-verify"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/uuidjs/uuid.git"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,json,md}": [
      "prettier --write"
    ],
    "*.{js,jsx}": [
      "eslint --fix"
    ]
  },
  "standard-version": {
    "scripts": {
      "postchangelog": "prettier --write CHANGELOG.md"
    }
  }
}
                                                                                                                                                                                    %�{���Մo���:�h��a~鏁-����hO�����t�Qآ~: �H��҆�=�"��n��RC�����v���a�}ubz��]YZU��ի2)�g��$t������΂�@�?�=5��\%��G��9��s�"�0f?똡����L��	��k��Z���|�ַ�/E�H,�uz^��}?�h-��6KV��n;.�_yC�T�h_���˝�Mdx�U�a]�	 �~�+��_��A�m���P�-W�#�3
�i����~R��	gƿJ�ʪ�c��Q#��O �r�����J�����[���GB�z�)�_��IF\L*�r�{e��AZM��r�I����ʀ$���洀CиV-^������X!QUA�OZ�/Hd��`��|x�lMQ�[��)��%���
�w�������\��{"Ŀ�S{șqXi���4i}3�x��jiڈ�G�*�D
bP�X_ň"Au�wJ�C�wy�e}��}uy��tu��cҎ�L.�=Q�r����`�v\�#�MdQ|$*�$�\0W�#6�#�{r���r�2
ަu6I�Rh�|
�kn�ެ�Ču+��͋�ĴJdx����FF�JV��?���kh�+����#-6(]�r�aF�����No_ۨ��]�^����}v�[\D�������_�?���(@b\�j�%x�u�B�Hzޖ�\޿5�}����$
����iIa^>��zaj���S����pW��jA��M[���+A����r�U���ah�3Fƭ6�ظ9̱��9"}Ȉ�i��FM촟p&-<��"(�}a[7Lu+��u�5�j^�,�����:F%�i�=\���?��;����q�8h���!nc�D��gLM��v [O�L�ȡ�;��Hc��z�
�縫�]��Bn}���E�^jd+esĺUn��z�c��WX�ؔ�_��1Im�Iس_bȈd�Ǐ��zrΓ�PdG�k6~6�X�m�4)`k�~���J�Z[�):V�F��1��]yk���Zg��b%i�8�����p7��t� �
���Ui(9([h�Ylu	�t���P�x򠝡%�U�����Apg���1W�cv��K�����ΓM�RX�ᘞ��"�~g�����в26OO�1Q7#?H��h�8U�-J��qp� ��I㨝9�i�ӫ��|N��F�uc);	%�	>/����-�O-t�Go3U*�P��3k���&��\?}�?\��'g�Jokh��5�˨}����^"��&��V�ͯ�§�im��,�)�R��2��c�����fF�.D�<de�܆�L�&����~Zs&;�iiC�T�b��X���h(����Kk98$�(�	pҙ�M�rf�����.��S�}XXG�]ɝ��d�O�VT�Я�+d������	}���/��;kG���l:�u�>�^�:��^���f,]��F\�~A۷`�:O�)���a]E<���t��莝��)X�h{�$����w��1��l,ewe�o:�`��4��g�=��J.xY#��jG&/�dzO�E���:��U�v �a�I�mv/-��}�bv��!;{��zA%k�pY�4�%�+��:�wXX�_ ��>����b8h�(��y1�,>>��0�q;L,�WG��bS?�o�/wПy�pX�W)���z)2.G��o610�R�-�r�t/�7�L�����{�#�v� ��Q�S��Ӓ�b�,@P@#�Qjpx˾[%Z���=��M��]��׵6Ӝ1�Rr�K��O�P�u6��R��qf5��A	(i٢�u��z��3b,�ja�jT��k;A�V_��(�CI���#;��%!?!br�e�;M�r����r�쟗�08��t�@W.�B紏���;�.4���{������ܜ�ˬ�d��������	�}��3ė 0<���5;�i�9U�<�kJ��G�ZǳҴ�wԋ�qJ!A�e����z�\���B��׏[�I�[���A^��UP{�0��2;�U(
|���(�$`��4��L�7)�J5����e�C�2�G4׬OMV�����K���^�,���(#g|nq��K �����[��o����c�c�?��	��GHe���T���yˠ�y��i<�e���abTo��`��QwӚ���W�h8���oQ5��lc�65=mgJ�C��w��:�% �X�G}m�O�(fw XI0��n���R�'��}����ʧ$w�:�Q]�mu K`o�X_c��H�Go�ک���0�fr�h�Y��
u�T�P&�Vuػ����r�sZG+�R�%ML�k7l�w��g?qR_-^L���D�r�3i$��W���Wf� �$�MM�}n
���fM������.�-��������uz�G�(�lŅ��X1?��i,Kd�E�
$�=s#[�f�8�Av\i�	 0>m!J��~<���ϩ z���ۤV��i�Lu�m�H7E2�(阫��%z6�S�囯*�|�_��=^�z=����uU·�4؛LzW�I�L��=�`1�kf�T�%ќ4�H�fD.h:-W��Z~�ubk�ct~t�y��x���Gy�ۂ��I��g�-N���gqX�F�6Së�Ff| T�s��+_���!>��X�ˠ#U�_�ԟ�?�ԯe�W�ԥX0K�n�e�z�y2�q3����O{�>���khB����H�B��i, ��<΍vc�D�|є�"ݏ�� ���c�s�'��O]CA��kگl���  :U��4���x�{T�e�ҙ�V�%��Q�bΊ�O���oJb�HbYE�J]����d��egk�@v�8�#�f�E��|<�vӃ�Hq��
O�b�M�@�VC�l�^�5�.�}_3c�l�SAT{?*!�
~��]������lw�u�;�Yn`_����'E�f�>�-��6�������'�g�]����~�^�Crț(Ԥ]9�������g�~���_�&P�]õ��y�/�͇����ҟ����_Y�fy�m�SBr9ڹ0�ҕ�;T�]<�|����U���:�o
j;5���7G���Wr��a��/A XT�37X $���'�Q�r�F����"�u0+�����!N_E�>,'Y�WG���2�Mp�-V-�A��0?Jz�2'r[D(
�&��j/Q,vO�[��x:-��ƚ&}��r�xk��eM�l�=�b]�ԐG��p�W+��aŲT��5.ϓ2�����g���X�8F�MS������&��jl��ME��/���=WǏ��Jd��O�������-�m�����{�V�q�Ǹ�s��B���T
�HW�A:ވ����Qii[k�]��ejI�c�VcТ�Z����K�*�GB��L��׀Ơ��|���I�	�Cጁ�R%,�\2�f�?��{N�6��r���aUl<��uH`��jN��!�U�st�p��ԧ��6��l�q,������?���;���YӟR������ɛ:�������ӧ�C�0Y0��R7���.0����a�����-%�o�W�C@�↣h* B�f�M��zڡ�a_�ξ�/ױfX����]zyv����w��$��/�~l�D������@��H����<�� E3�����P}�kæ\
%�-�}ÛK�R!�%C�ߙze�/������C���6�@Կ�T@ 8�,��t	�َu���ΏM@�c�����b����ƭ�j� 8a�i��>�Y��#�?�&G�a,N{����}_vd���{�x�,U ��U�>w���kJ�N��$.��I��d�ŰY��~��W��LB�F�7���7�������1�ҍy�u6�;���&6�:C��ػO�8�qA�:������-�N��T���A�TY���XGה��-J�����,�6  @OG� ف��1�I���/���Q��d�a���K&2j�zZjQC�ZZ�~2J��A�ƉK>�ؕl�����␣��/�\_��"�q�8��g�Pc��2��_{p�0~:�!_ڌ��VG<�V]n����|s4����F��`�>������a��7�����I�=�r�� �=^8��pn�h��V�P}���CE�x;i`ڏ�;5���>v�Rv@� �\d�,�V�H�^�k]���qR� �!�2�����ܙ�w�d/������-ƕ�OH��?�d�իoR�!�����\�Û8��d>)�N/���l.r�;�Ep�m�]�8d*��AS_w�ۻ,��{sK��"�mۥ��<:t�.�Y�/�����\��<j��	����1�K�ˀk�!���K��ȯ�X��ͪ�֩�}NUN�5�V�{zb\�?B8`�W����3��D���\� 
4��H!�ZΟ��cr�4�!Smv9��w��i�:U�?N���?�T8�W����rR��ǵ+�V�M}�c9{��͎\W�-�rF��#���1n�ױ