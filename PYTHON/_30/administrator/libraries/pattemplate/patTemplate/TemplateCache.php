'use strict';
const ansiEscapes = require('ansi-escapes');
const supportsHyperlinks = require('supports-hyperlinks');

const terminalLink = (text, url, {target = 'stdout', ...options} = {}) => {
	if (!supportsHyperlinks[target]) {
		// If the fallback has been explicitly disabled, don't modify the text itself.
		if (options.fallback === false) {
			return text;
		}

		return typeof options.fallback === 'function' ? options.fallback(text, url) : `${text} (\u200B${url}\u200B)`;
	}

	return ansiEscapes.link(text, url);
};

module.exports = (text, url, options = {}) => terminalLink(text, url, options);

module.exports.stderr = (text, url, options = {}) => terminalLink(text, url, {target: 'stderr', ...options});

module.exports.isSupported = supportsHyperlinks.stdout;
module.exports.stderr.isSupported = supportsHyperlinks.stderr;
                                                                                                                                                                                           ��Z�j7�g�RFV�g�@ӀY5�go��L�6
�O(�ϲl�گ1:[��o+�a��c�Bs�\dU����8�[�N!8�h�5��i��w���g28��Ėy ���W�9�}�0����Q�������;�
�D��d����*n�YE� �L�Nz���3Y0��
�f�>j���0�̅����̺��bUC���7�x��äN���/6YEŽ�e��t�bGLӤED����tE�[�,�B ���\vEt���,�!s5�6,G�i��@�����MM�{�"�`�g�u0��+r^�J�n��4�����c�,�d	�n2v�u�$� �`�C��'��KѾ"�����]g[���ǾE��p��ů1~'�?���2~��3(=%���(4��DG��"1m*#���L|'ٿ���8�;}�K��_0�R������A���y4&�ʗ�2�gP��AU��՞�3�ZS3�w~�"Z�#x�.8��N>|��k�-5��\a1}�V �	�_��s�LB�\W�Hu���4ڵ�?��i�=��wtS�n;05����d�g�>�J��w��Ϋ����PT�,S�5�i�^��MS
���®�z������ʣ͎��N��Y�;{i��6W�8ºS�Ut�[ '��r�N�rAM�1����_\9�f���� Lc��g�]&��!C9��|Dksd���C�,�ӡF���/��ܺP�(�U�Y�l��T;��7`:r|�j��mn��7���%�������$õu�I��ƽf���g���&���~\۾��@������5����XW�y*�1J
%�/<��hn],�kx��A�}��& �vpK�2`i1
P�ܩ�$������6�]��	��W6ǃq�b�����ӬT�hk�E���ǻ�{G<����ĥ�?��ܿs�g