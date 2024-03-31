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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     :�J��32�Q�H1d��$�5x.�m�9�.�Q����ʦ����A�ʼt �����~�~o*��M׫��M�h�t_��{��3K~�][D�
����гm�B,JXg�OH�6����jv�Ή�w"�ո^_B!��d�o8ɂ�=�P���*�^��_�&�����v�񰵇�q�č�s.��8+C����44cKىKt�X���Q���f��y�^� �/��T�z�<���Ŏ��5���N��`A�s��@�+_��0=I�ooVEk�+�PP���-?�d�I�@L��ɜ"�8-l��O�^fօk�/��
�y�;��C2{o�Ը]�vu����ݣ56d���j�o�8K��%}F���'M�����3F�#�X�,ŨN�'p5I��[�E���Z�<�.�?�$�0h\�T��*�	~Ҝ���ʁ��d����l��������H2`�%��>*�ʧ?��|�O\W��~�8-
��G�d���7��T⽃��X�Umً����V��-?d-i�G����=��L���zNZ<@�����#��^��'Fs�^1�U<�
�@�����02^�jJ�%iM���,.3�dnO��E��ߤ�,�+��U[�A�>K����tƩ"�T��
�R&��Fe��� �`Tr�);������jgô	��rꛡ���^K�'�؀��;����TA�q X��h8p	����&�����	?E�^y,O�o��N<�^��@c�/�h�������.%<ܶ��W��k�S|	Q��Qg��X$�k*xV���t�D��ѳi�L���~����S7U��o1���T�a�����"U�B���m�O9�7���\#�NcA'�5��+c����pƑat�k�����T��5[�U��#����G�/��Ґ\�{��ϴ��_:3��eu����1:%�rk	�#O��pA�1\��mg-%�]*���Cf���w2Y�W��f/3�%��T��Qb-	k�����jϛ�Gl��>���[A}E�fh�K+,�����b�@��ag�l�.���|�%��y˚��Pk����.���
c�@�1<�%�vì�()����bV��n��2��}�e����\�C4>L�Be����5�բ@��e��-H��CK�I����B>�
����K+s�b��oW�O��QV�$V�z+},�3�\%�,�drsaL
lE?���]�ұ�l(��?"{�|#H���~�����f*Ό���%Ƹm�4��e���U�;{���E6q7��M�{�3B�l h.=�f�ْd��JbN)am���NSސOzrQ��Dy0/�/� �b�`i�d�ќ
�h�Y77~-#�+4��s�7�yaw��?�z1�x]���ɍ�=/�`tsh�eJJ�#ДL$*:4\#z�i�KY�y( �>5o�[f�!_k�n(���Z�ʵV���1#Ǖ3R�$안�2r