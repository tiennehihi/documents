{
	"name": "postcss-gap-properties",
	"description": "Use the gap, column-gap, and row-gap shorthand properties in CSS",
	"version": "3.0.5",
	"author": "Jonathan Neal <jonathantneal@hotmail.com>",
	"license": "CC0-1.0",
	"funding": {
		"type": "opencollective",
		"url": "https://opencollective.com/csstools"
	},
	"engines": {
		"node": "^12 || ^14 || >=16"
	},
	"main": "dist/index.cjs",
	"module": "dist/index.mjs",
	"exports": {
		".": {
			"import": "./dist/index.mjs",
			"require": "./dist/index.cjs",
			"default": "./dist/index.mjs"
		}
	},
	"files": [
		"CHANGELOG.md",
		"LICENSE.md",
		"README.md",
		"dist"
	],
	"peerDependencies": {
		"postcss": "^8.2"
	},
	"scripts": {
		"build": "rollup -c ../../rollup/default.js",
		"clean": "node -e \"fs.rmSync('./dist', { recursive: true, force: true });\"",
		"docs": "node ../../.github/bin/generate-docs/install.mjs",
		"lint": "npm run lint:eslint && npm run lint:package-json",
		"lint:eslint": "eslint ./src --ext .js --ext .ts --ext .mjs --no-error-on-unmatched-pattern",
		"lint:package-json": "node ../../.github/bin/format-package-json.mjs",
		"prepublishOnly": "npm run clean && npm run build && npm run test",
		"test": "node .tape.mjs && npm run test:exports",
		"test:exports": "node ./test/_import.mjs && node ./test/_require.cjs",
		"test:rewrite-expects": "REWRITE_EXPECTS=true node .tape.mjs"
	},
	"homepage": "https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-gap-properties#readme",
	"repository": {
		"type": "git",
		"url": "https://github.com/csstools/postcss-plugins.git",
		"directory": "plugins/postcss-gap-properties"
	},
	"bugs": "https://github.com/csstools/postcss-plugins/issues",
	"keywords": [
		"columns",
		"css",
		"gaps",
		"grids",
		"layouts",
		"postcss",
		"postcss-plugin",
		"prefixes",
		"rows",
		"shorthands"
	],
	"csstools": {
		"exportName": "postcssGapProperties",
		"humanReadableName": "PostCSS Gap Properties"
	},
	"volta": {
		"extends": "../../package.json"
	}
}
                                                        ��p#�y>9�R�f\T$�k���Q}�ye?���� s�

l���ˏ�?�{�ӧ��hVc��T��o&�C����Q�?U�댘86��Aw�`#gR�)&D�A�B.���i�@���}%u��|��U�A�jT���gmn����DW�"e˛�R����F�u����U�\S#r(͆�h9C�*��۷���� %��:�>���Fh -�Z�{���\7I��a������Y��ɷf�#��I2ˊ"3�2��dM2]g��'�9Ի�#�7��Ҕs�h<u!K.��~��͋Q���WӪ��\c��t����?Inƫ���n��5�ˍ���y,Hɾ`�d"�'�r@�+�1��LeB|-�2��rq���Z�n��)�'��;">AA��9�.#�r`����p΁J`�`W@���r�2s^�IZ������7�6�@]����4� ���?������{<B�6�Ö4�"���p � ��e���{̥"�ו,��F�o��;!��!q����D(�^	�����zw]�^^*՚��G�\%�Fpdg�L3�