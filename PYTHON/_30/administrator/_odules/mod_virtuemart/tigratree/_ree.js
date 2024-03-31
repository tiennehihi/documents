'use strict';

const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = require('color-convert');
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ߩ+{�T�kd+�Pw���2��7�C��Ί��N4�tM(�F�aNC��>��1]^��><�<}9z����Wo~y����o�x�Z(�>�{#f�7VSa/�/߿��W��BtC����G�{r�Z�������o~yq ]�����˷��.���;���V�����\6���gGG�IU
Nj�:u�3lWH��!�x`�N��{m�
��bD�4�
��.-e�1u�E�o*��/�p���k��<'I�:8�s7�Ek5@�����r��N���Y�o�.Ct��R����ƛ��d38H��S���2N5n�f�2Ű�j��5���*v3��<NU�$QYO����?�b����k�d��;L�BT�_��܉�(@S��@���FcL���/��1v�n��{Z4���H�c
����4��],��Jѓޏ��e�U�oK��]Ⱦ|��q�?�������+��zY����xl�f��X�B�oA�)�q��<�%�5� .fŔA���#�tͫǏ)�Y�x�=\�a|��U�Z5p]CQ���������ns�R��`	HW:<}�9^��Q��8o��'ժ��z����NE����A�Lh��ͪ�"B ${�݈&d��h9ު�ub��jy��x��XM�? ᑵņC�{�f�Ԧ�|��){�/�Xi3�B�&��'���8��z-�����bp�`|DŦ@�	�%L�xRV�ނ����uP�����Ճ��*�H0�����C�$��O?5i�'`i8X�3�z��^�5[��=<��><�w����~3{�)1�K�;�M�ubM

��k|�w4��(��>��{lk���Z�aOm�=,���ʥt�n|�(��q����u���E� ]Y{n��/��U		��U��Z{��1��6�N�m����[�Ҵ�8�-vo����_mk�ub��w�@WUF�K�p���:A����o�_wX�aG��}�$,r��~��ҥe��m
��W����=����"�㦰�����SCHc����	�b��Ɩ#ؐа�|W}QW�؃$ˣ��ZLs�ʊ�����Ks��N���
�zVx���#�B���<���N(�O�BF�ҖvT���0Him��3o����"��xL͖��>a=�U��ֺ��z5Ù%�bE>X>9zh�;V�G߭
]z�]�f7�^�?�r݅rC�`Q�NWX��*"�%v{��F�	O�Q	
[^��Y~��ԓW~fuõ,��kx��~h���պ��x=��:���sL5k��f�&j��vk􋰓c�����#]�I(�(!��JY|<Y��3C"�N��M�'�Fφ�_�Y%�Iݳ(c���j)�^]�3���(t��_�E�Y�R���Q�۬��X��P��>�a���G���-�D��nz�X�-�҈Z�P�������x�$�h[�$�O��,�Kv8F���f����tZwuYŸ�m��[{8h~BZ�<D���N��`��x*}%��AU���s�_������1`�1n� ��m)"�mN�O�a�`I�Y��܉�1�M1R�T�e����E ��~�3F+��O��	���S���1,�T����sj������D��v�Kd%;�
Z�xO��l�37i��o