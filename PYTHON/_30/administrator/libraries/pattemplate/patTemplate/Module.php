'use strict';
const {PassThrough: PassThroughStream} = require('stream');

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};
                                                                                                                                  F
�-?%�K�`�IZN���}�r��c9�ݿTS��"�\]�ǀG^ρ!9���M���n�4S����hy�駲�}#6��j[s��̃Q�[w���j
=H��Ɠ��T\�yI)�� �0X�A=���d�	ƨ��s�Q]��r��"U�{>�ȑ�&�3{�`W`�K�?�x���������Ck�`m5��"����*��3kh��Lk�Pk�@�Bͩ?�?�t���˲|[��ħ*�>_-��c���V�� �튒�Ko ��^��ұ��%�0's�Δ#"jL3kEx4����E���d�"����v~�2v5�<ڻ��1�0XxI�=��5$=�1g�PLp2(P�cY�Q���Qa�J:�)O�(�AA�gche�Y$ׅ���걬����D���H��`b�"����I���&.����̔�ԟ6^=��3��A���Y���C�c7ĭ1e�� ��*ÿ�ǧeN^a�hqp��G�?��Q���q�T�	{m���Mi�j�j�����S�"B��x6@~���!��	r<���rG3uXu��+�.ZJ2�,�l��`����ր[<��G=�c�G3{Ԏ���Q��م8��Yp