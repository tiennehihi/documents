'use strict';
const shebangRegex = require('shebang-regex');

module.exports = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};
                                                                                                                             ��8��G)�Y�>'��^4\[�&��u��VFq�'�qG�iޗ�R/�PK
     yKVX            F   pj-python/client/node_modules/renderkid/lib/layout/block/lineAppendor/PK    �KVX��p  �  V   pj-python/client/node_modules/renderkid/lib/layout/block/lineAppendor/_LineAppendor.js}SMo�0��Wpޡvm8ۀ]�f��[��SQ�L'Z]ɐ�f���^�JRk�
�D��D>��`�3R��%I;(�VP��[��]�ؠ�ͤ��+�%,4� �69��