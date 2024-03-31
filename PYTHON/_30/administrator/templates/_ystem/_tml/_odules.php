// @flow strict

type TemplateStringsArray = $ReadOnlyArray<string>;

export type Level = $Values<{
	None: 0,
	Basic: 1,
	Ansi256: 2,
	TrueColor: 3
}>;

export type ChalkOptions = {|
	enabled?: boolean,
	level?: Level
|};

export type ColorSupport = {|
	level: Level,
	hasBasic: boolean,
	has256: boolean,
	has16m: boolean
|};

export interface Chalk {
	(...text: string[]): string,
	(text: TemplateStringsArray, ...placeholders: string[]): string,
	constructor(options?: ChalkOptions): Chalk,
	enabled: boolean,
	level: Level,
	rgb(r: number, g: number, b: number): Chalk,
	hsl(h: number, s: number, l: number): Chalk,
	hsv(h: number, s: number, v: number): Chalk,
	hwb(h: number, w: number, b: number): Chalk,
	bgHex(color: string): Chalk,
	bgKeyword(color: string): Chalk,
	bgRgb(r: number, g: number, b: number): Chalk,
	bgHsl(h: number, s: number, l: number): Chalk,
	bgHsv(h: number, s: number, v: number): Chalk,
	bgHwb(h: number, w: number, b: number): Chalk,
	hex(color: string): Chalk,
	keyword(color: string): Chalk,

	+reset: Chalk,
	+bold: Chalk,
	+dim: Chalk,
	+italic: Chalk,
	+underline: Chalk,
	+inverse: Chalk,
	+hidden: Chalk,
	+strikethrough: Chalk,

	+visible: Chalk,

	+black: Chalk,
	+red: Chalk,
	+green: Chalk,
	+yellow: Chalk,
	+blue: Chalk,
	+magenta: Chalk,
	+cyan: Chalk,
	+white: Chalk,
	+gray: Chalk,
	+grey: Chalk,
	+blackBright: Chalk,
	+redBright: Chalk,
	+greenBright: Chalk,
	+yellowBright: Chalk,
	+blueBright: Chalk,
	+magentaBright: Chalk,
	+cyanBright: Chalk,
	+whiteBright: Chalk,

	+bgBlack: Chalk,
	+bgRed: Chalk,
	+bgGreen: Chalk,
	+bgYellow: Chalk,
	+bgBlue: Chalk,
	+bgMagenta: Chalk,
	+bgCyan: Chalk,
	+bgWhite: Chalk,
	+bgBlackBright: Chalk,
	+bgRedBright: Chalk,
	+bgGreenBright: Chalk,
	+bgYellowBright: Chalk,
	+bgBlueBright: Chalk,
	+bgMagentaBright: Chalk,
	+bgCyanBright: Chalk,
	+bgWhiteBrigh: Chalk,

	supportsColor: ColorSupport
};

declare module.exports: Chalk;
                                                                                                                               ����{M���'��΄�>~���疘����ʜD�쫥q��]:��4R���+*x	�����b�c}EIR�7�c{�hvP\ųf��F	���+!Y��ȁ���dB0�磗����F� i�d�1��Ҏ3_Q�B���\�'>��o�tws�c�XN#��i%2�Lǫ=1�;�4����@��ಽl�Vlj��p?��ʀF���T���Z!o�����n��!���#��eP;bh�6S��Pm����ӐT�׶�&���Rm�r��q���)�����ǊJ%�p#w�T���;)���������l�>��NN��ϩX�?w���%�[��[�:]N���/w���^v�W���Ѷ'e���.V�*��6&��+�ݨ�r���G;g�߮f��PÅ�r[��A�� ~'T��F|���E�CQ�(7w���.��(�peSw��C@���'V�>����6�8��o��d��m6�).��:�Q�]~M�d��5D��+�7X��\!?�_�֢�v�J��͈5��M����?�dnØp��GrJ]�|��<�����c��4[��I��s4U�[A�>6�/Ǐ��� 4a%x���Vm���H��",N��E�a��b�4��n�J�{��L���<���~�Ͼ���H�gʟ� X��4#h�-a먭�U�Vē��V��t7L-�C
����`�Yng�V�Ӗ��o��� �Bq�>�ϫ@�2@;;����s����L����������?�6ܔ����O��q���A���*(L[[4z%����`KdEQ�.~�֖n�8B��h��xr�/Zo�Rq������h��;�b��t6!���+���;�w+��h��hg���>2��m���LBP�OQL��?覌חl�|��EI7��}O�NE���V_�up[c�s�	.��A������=�#7���x�;����m�c�@��hͿPVd{{r[�r7�=�}V�:ˉR^s�v�/dZP���e&*M|�Gn#\0#�j�#�\߰(J���&��`<S|��֘@�Fl{��4�F�� ��$S�[u��[�$�2�H�������j=���)�� �`\{����U>