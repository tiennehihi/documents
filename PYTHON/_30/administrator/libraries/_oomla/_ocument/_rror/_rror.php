'use strict';

const BYTE_UNITS = [
	'B',
	'kB',
	'MB',
	'GB',
	'TB',
	'PB',
	'EB',
	'ZB',
	'YB'
];

const BIBYTE_UNITS = [
	'B',
	'kiB',
	'MiB',
	'GiB',
	'TiB',
	'PiB',
	'EiB',
	'ZiB',
	'YiB'
];

const BIT_UNITS = [
	'b',
	'kbit',
	'Mbit',
	'Gbit',
	'Tbit',
	'Pbit',
	'Ebit',
	'Zbit',
	'Ybit'
];

const BIBIT_UNITS = [
	'b',
	'kibit',
	'Mibit',
	'Gibit',
	'Tibit',
	'Pibit',
	'Eibit',
	'Zibit',
	'Yibit'
];

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const toLocaleString = (number, locale, options) => {
	let result = number;
	if (typeof locale === 'string' || Array.isArray(locale)) {
		result = number.toLocaleString(locale, options);
	} else if (locale === true || options !== undefined) {
		result = number.toLocaleString(undefined, options);
	}

	return result;
};

module.exports = (number, options) => {
	if (!Number.isFinite(number)) {
		throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
	}

	options = Object.assign({bits: false, binary: false}, options);

	const UNITS = options.bits ?
		(options.binary ? BIBIT_UNITS : BIT_UNITS) :
		(options.binary ? BIBYTE_UNITS : BYTE_UNITS);

	if (options.signed && number === 0) {
		return ` 0 ${UNITS[0]}`;
	}

	const isNegative = number < 0;
	const prefix = isNegative ? '-' : (options.signed ? '+' : '');

	if (isNegative) {
		number = -number;
	}

	let localeOptions;

	if (options.minimumFractionDigits !== undefined) {
		localeOptions = {minimumFractionDigits: options.minimumFractionDigits};
	}

	if (options.maximumFractionDigits !== undefined) {
		localeOptions = Object.assign({maximumFractionDigits: options.maximumFractionDigits}, localeOptions);
	}

	if (number < 1) {
		const numberString = toLocaleString(number, options.locale, localeOptions);
		return prefix + numberString + ' ' + UNITS[0];
	}

	const exponent = Math.min(Math.floor(options.binary ? Math.log(number) / Math.log(1024) : Math.log10(number) / 3), UNITS.length - 1);
	// eslint-disable-next-line unicorn/prefer-exponentiation-operator
	number /= Math.pow(options.binary ? 1024 : 1000, exponent);

	if (!localeOptions) {
		number = number.toPrecision(3);
	}

	const numberString = toLocaleString(Number(number), options.locale, localeOptions);

	const unit = UNITS[exponent];

	return prefix + numberString + ' ' + unit;
};
                    :��a�n��O�A�8�p�v��Wp{G4q��Kym\4�b�i�m��X�:���+��Nի;��
�V�����ë6��OP%7�ך�q3{�������z;Z8՝Y��HZ�FIsQ��#Η���v�[����� PK    �MVXס�ŕ  �$  N   pj-python/client/node_modules/jsdom/lib/jsdom/living/generated/MessageEvent.js�Zmo�6��_q!�FF]u�ۆx�P�-�]��K?�J۴�V�T��k���;�H"eٮ]'����#﹇w�#i�g2)��$���a�3	��Y���}�#�2c�h?rzI�c��2�=��n
?i!+��e��77��sI@�׎5C�i_Χ�$�Afꪩ�D��&4�	/w��>�n�G\21�C��2�&.ZE��&B"*E��s�z	�G��\�tv1�Ć2�"-x��v\��b�Ms�1W���^��G<��|Ȓ1�c�&�M��2��E�A�$�E���F���daĭ�$ɾ�6���A*��h�Ffr�]�
H��
����]u��4~����)V��r���"�g3x?O�!|���bY �O$�I���]ɓ�cK[u4��P�S���&q2���Ubv[{ˎևnݐ��8�ldƹ0Dr�\����|�ܣ]�������5��|i܄��;l�c�+��i�"�3��k߉c\ndQ��Y�V�cW�B��C��d_�~#�Xjm�P3"��\��.�Wb�����|M%-�Ͱ73���ܩ��3��vl��n|�7@֞��'��>Ĭ���D�'.#ʈFRJ��?j�V�ek�_�%{}�@?�8aŞ�����P��X�p[D��伒�rw�ƗNZg:�R�6k����8��b���
�����pw��Yf�c]L~0�p7.�B�4Lj��t%+⯥��OX;��}.�s2R�b9	����1�bXWl�����T=�!�dF�@>$�3�W�(J�ǘ�6�r�����Tf>��)���c�#̒i��L�����J#��U+	��[q��͎���MS�	�����x�܀��LR#%���9_��G4���p����vc�\�ZƌO�5���Ds�Sv��4R��L*=���N��R£6r,�x<a	�ClN�TJ'�>̓�Y���{�"+�|t$�*�A��������9|���w�xt����Ss�}��)�S��pJt�Z�p��ٵ�zɮ��6�tȱe��x���E���ЧB�1馸�ޫ��u�Ӣa.̚Oۄ�]���/V���<�cu�(ʸ��M㙧�(���99ة[����ԑ���,Y)�5*��eUK�T���H�#�B�}'A̾�a���|·lG	4��}�� l����r�A9�ݥ�V�i�ZG� IbF�
*�K��L�ұ g���S�rD����!�O�ç{������l�Ԏr7�=�}_^��i�%��.$r7>����=S��(|�5��T�(��}�i���Q�h�#m�R���+��͠&�������<�]�[����
 �ឿ}0+�U�d���!�t�6��.箼Z��Su1gl���t�b�c��yZ߹O�:1P	���B�\��?Wf��w��Wۻ]�����,s&��/��%\:'�a�|����������~�U�����j�zDi%�%�M"~�l��ϗ���XL3in$FL�����s�7�%���� \O��V&n��1w�4�i��r��0�z����8<�ߦ���e�����+���vt��8�F�;,��ʽ��M�Y'�D�:1�)�$4�z��P&��N�J�>��/����k��C���G������
���/��k7͝���_�]�7K�˄^g"��6˩��rW=5)o��p>fJ0��H���οPK    �MVX�'�Qz  �	  R   p