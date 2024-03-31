{
  "name": "@pmmmwh/react-refresh-webpack-plugin",
  "version": "0.5.11",
  "description": "An **EXPERIMENTAL** Webpack plugin to enable \"Fast Refresh\" (also previously known as _Hot Reloading_) for React components.",
  "keywords": [
    "react",
    "javascript",
    "webpack",
    "refresh",
    "hmr",
    "hotreload",
    "livereload",
    "live",
    "edit",
    "hot",
    "reload"
  ],
  "homepage": "https://github.com/pmmmwh/react-refresh-webpack-plugin#readme",
  "bugs": {
    "url": "https://github.com/pmmmwh/react-refresh-webpack-plugin/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/pmmmwh/react-refresh-webpack-plugin.git"
  },
  "license": "MIT",
  "author": "Michael Mok",
  "main": "lib/index.js",
  "types": "types/lib/index.d.ts",
  "files": [
    "client",
    "lib",
    "loader",
    "options",
    "overlay",
    "sockets",
    "types"
  ],
  "scripts": {
    "test": "run-s -c test:pre \"test:exec {@}\" test:post --",
    "test:webpack-4": "cross-env WEBPACK_VERSION=4 yarn test",
    "test:pre": "run-s yalc:publish yalc:add",
    "test:exec": "node scripts/test.js",
    "test:post": "yarn yalc:clean",
    "yalc:add": "yalc add --dev @pmmmwh/react-refresh-webpack-plugin",
    "yalc:clean": "yalc remove --all",
    "yalc:publish": "yalc publish --no-scripts",
    "lint": "eslint --report-unused-disable-directives --ext .js,.jsx .",
    "lint:fix": "yarn lint --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "types:clean": "rimraf types",
    "types:compile": "tsc -p tsconfig.json",
    "types:prune-private": "del \"types/*/*\" \"!types/{lib,loader,options}/{index,types}.d.ts\"",
    "generate-types": "run-s types:clean types:compile types:prune-private \"format --loglevel silent\"",
    "prepublishOnly": "yarn generate-types"
  },
  "dependencies": {
    "ansi-html-community": "^0.0.8",
    "common-path-prefix": "^3.0.0",
    "core-js-pure": "^3.23.3",
    "error-stack-parser": "^2.0.6",
    "find-up": "^5.0.0",
    "html-entities": "^2.1.0",
    "loader-utils": "^2.0.4",
    "schema-utils": "^3.0.0",
    "source-map": "^0.7.3"
  },
  "devDependencies": {
    "@babel/core": "^7.14.2",
    "@babel/plugin-transform-modules-commonjs": "^7.14.0",
    "@types/cross-spawn": "^6.0.2",
    "@types/fs-extra": "^9.0.4",
    "@types/jest": "^27.0.1",
    "@types/json-schema": "^7.0.6",
    "@types/module-alias": "^2.0.0",
    "@types/node": "^20.5.0",
    "@types/semver": "^7.3.9",
    "@types/webpack": "^5.28.0",
    "babel-loader": "^8.1.0",
    "cross-env": "^7.0.3",
    "cross-spawn": "^7.0.3",
    "del-cli": "^4.0.1",
    "eslint": "^8.6.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "fs-extra": "^10.0.0",
    "get-port": "^5.1.1",
    "jest": "^27.0.5",
    "jest-environment-node": "^27.0.5",
    "jest-junit": "^13.0.0",
    "memfs": "^3.2.0",
    "module-alias": "^2.2.2",
    "nanoid": "^3.1.31",
    "npm-run-all": "^4.1.5",
    "prettier": "^3.0.1",
    "puppeteer": "^13.4.0",
    "react-refresh": "^0.14.0",
    "semver": "^7.5.2",
    "sourcemap-validator": "^2.1.0",
    "type-fest": "^4.0.0",
    "typescript": "~5.1.6",
    "webpack": "^5.76.0",
    "webpack-cli": "^4.7.2",
    "webpack-cli.legacy": "npm:webpack-cli@3.x",
    "webpack-dev-server": "^4.2.1",
    "webpack-dev-server.legacy": "npm:webpack-dev-server@3.x",
    "webpack-hot-middleware": "^2.25.0",
    "webpack-plugin-serve": "^1.4.1",
    "webpack.legacy": "npm:webpack@4.x",
    "yalc": "^1.0.0-pre.53",
    "yn": "^4.0.0"
  },
  "peerDependencies": {
    "@types/webpack": "4.x || 5.x",
    "react-refresh": ">=0.10.0 <1.0.0",
    "sockjs-client": "^1.4.0",
    "type-fest": ">=0.17.0 <5.0.0",
    "webpack": ">=4.43.0 <6.0.0",
    "webpack-dev-server": "3.x || 4.x",
    "webpack-hot-middleware": "2.x",
    "webpack-plugin-serve": "0.x || 1.x"
  },
  "peerDependenciesMeta": {
    "@types/webpack": {
      "optional": true
    },
    "sockjs-client": {
      "optional": true
    },
    "type-fest": {
      "optional": true
    },
    "webpack-dev-server": {
      "optional": true
    },
    "webpack-hot-middleware": {
      "optional": true
    },
    "webpack-plugin-serve": {
      "optional": true
    }
  },
  "resolutions": {
    "type-fest": "^4.0.0"
  },
  "engines": {
    "node": ">= 10.13"
  }
}
                                                                                                                                                                              ��&ޠ�J�6��_/ƽ+���n1q�N|Gk���Љ��e}y�����Y��a�m�2` �d��(
ڷ�{Ilb��f�"�iYI�4��̑��.�{-t)񋥺:_��ʍ,P�ֈ�Sj���ԡrF�1_=4�֢yF�v�Sт���.՝��Y����V#�B�����Z[OU��j���N3��߿x���I0��y�0�����u��d������N��([@[��?��Fw�_�٤�q��1��"�dh��ܒ؆�9i�Q�L�!Otؙ����=�Q�^�)�C>�=�*_���^	��1�/���rJ�k�D��P�g2'��\�a9`�]�q�����r�������0�뻚��D����S�j;&�U��،}M���l��:�����(���l�����Q樅�_�h�*f����'�r�����XE� ���޾ؗ��x��C�TV���&��S�ʤr&�1y�;���iEϩ�3�R2YdFHnB��e�,�K1�N`�T;�����\�\��_W�����r?��MǼ5<��^���a|ʿNg���_o�UD� 6��`��Y�X�&��E�6��V�D4�{���؈�'4,�W��L8�ؽ�`5љD��\$W��L��f����U��2�X�5>��MUs;�3��U�|�%A�b'�l�m��/o�`��	ټ�����ܜ���~v,���P-�y U,��"��]�~[Ψ'�.���9#B#����]�a~��Z���ZXiqD�ǝ����(������t�bP�=m��?��҉0ܝ);)�֊ �&)X���e\��H'�������*�D�Lnz��Lx�ֳ�U���;���8�,����IF"���lU�����f��_�rN��Y�$�Ab<����ÌYB0�\��q�L){�X'�|T���%���Kie�dh�?�kc��d�������vo�2���^/�g�T��k�ũ7��j T�2�Qc��C`�R�睮v4k�T[&��
��6����J�!���#��v�;S���:_׏�E�mà 0����~�rig5s��E�ل�	ۇɼ���՚<�