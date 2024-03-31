'use strict';

const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

module.exports = pathKey;
// TODO: Remove this for the next major release
module.exports.default = pathKey;
                                                                                                 ��8�x)�����Q�G�u&<�<�Y�	�,τg�g�3�3�����Lxfy&<�<�Y�	�,τg�g�3�3���,�Lxy�xy�xy�x.:���c���x.>&���ъ�s����x.:G+���ъ�s����x.:G+���ъ�s��\t�2���Q�3�3���L��x&yf<�<3�I��$όg�g�3�3���L��x&yf<�<3�I��$ςg�gy�Oy���L�~���?��PK    yJVX�f/I�  vj  =   pj-python/client/node_modules/regexpu-core/rewrite-pattern.js�=�r�Hv��W�+�`S�<�l&�p�,Ϻ�#�$;� iL�l��  -qeV�*��<�'�=����9}$��$�T�"������ާ�aoUPR�y<.�~�=�Ң$3��<*)���i����q�h���엂�{A(��b�2�k�bk���	�S���$�*��ل�����<[Ҽ\�cD�� �␎Q1��e��?EɊ���9�ƫ���2Ng��&�N�2�ƫÅ�)����ӓwg���_9F��Q�K����(i1�������Ҟ��qg)�&Q��<��2��d����nI^��d�\���-��Y~��~\�|��`�Z��'86.�� ����S��U1�r���[:��oM
Z��U���_rZ��T��oo�J^�;;}s����N.�e]��������c?���}�|��3ƙn���)�6J"r���q�0\e�L�-����2�Ӳ�f��BR:���LJ%�x�3FD�:a�ߜ^�BQ�$�|~F��e�Ψ�p�!G/�^��2�����'ow�|ytt�}~�ǷoΛ&��-F��m���4_�iTf���?/�e��v�G�K���MAǇ	�<,h��-F���I�0L�����E߽}���z�]�L��hF�%��w�����7��W ��\�� ���u��h97��1����I�yTT���D[fd�2E�f�5v��j�&�0R�ݯ.��?
y��)�p�d)�<�(����IQ��t�}��!��p��ԵSP�3��+
��+5�H'�!�,�rz4&*��]B�	&��dx�P��͏��gOO�Θw/���D��ش]��g?~x{rYߘ��{�����<I�P��7�c�{UI�Q[�_L"�}�������V�ɀ��cƊ��#�#Ȧ{�(�6C҃��!��r��>d�)�5��.���6�C�����HٰH0D6�1(4��Ø.!&pA��<�g�잜�y�� ���(N�-�t�����T�}3�+��#T��}c��fY;a0y����eQ��y�������df8o��W	3L0��Ȅ��)c�,��CA#,"#d��%D�YI{d��yR6��S�����4��u��U	��
l,�X�5��k�7�1JN�(�`�_���
�f��uH���F�w$�����rQ6ńR͖�{��c6�x�xƚ���6*�d