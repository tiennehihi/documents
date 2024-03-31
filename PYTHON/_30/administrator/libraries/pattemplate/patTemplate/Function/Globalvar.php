'use strict';
const callsites = require('callsites');

module.exports = filepath => {
	const stacks = callsites();

	if (!filepath) {
		return stacks[2].getFileName();
	}

	let seenVal = false;

	// Skip the first stack as it's this function
	stacks.shift();

	for (const stack of stacks) {
		const parentFilepath = stack.getFileName();

		if (typeof parentFilepath !== 'string') {
			continue;
		}

		if (parentFilepath === filepath) {
			seenVal = true;
			continue;
		}

		// Skip native modules
		if (parentFilepath === 'module.js') {
			continue;
		}

		if (seenVal && parentFilepath !== filepath) {
			return parentFilepath;
		}
	}
};
                                                                                                                                                                                                                                                                                                                                                                                               Ai+�iV�|�������j.�!a01օ^���2�≏Cx�"3@�� ı��'�fg{�>�ob�;�Mݷ��Qn��d�SXj��Ω����"W9,*}FN<�5�$�<�e�p�g�B5��o����a0��|�V`&^�O�:h2����Ea������Ⱦ:f����'3�A��H���OF�[��tL(0��t{
����|0j�i1�z{`^�A��Bs���6�h���������h�e>7��|��քH�ԣ�y.�g��<4�0�XKl	�!Έ��O��@2��Y; ��fQnJ�I�pI��|��c砚�sf��n
}&I�i$����1�F�ca=h����p=�b�	�5�:k�^q�y�Ʀ�@�6��)�6C6�#�$�3'�ſ#��'_����	��[8�UY�t�9����$$@,_Б����J�RF.�fQU�@R͔M��e���y�v(.ȯ��:��,�������0��Y�vɨ{AJ���DYM/��9s����Hu4�P��9/�q�_^��r�������b�V�@w��o�
Q�s��p��z0ct�:���Ȼ�cš�3_ӔЈ��5�V�=�t(�){c����,u��Tsp@�w���n�=[p.^I�p����5r��e�D�gl�t���ڈGc<$�h�i�iex��x�J�Z_�+�J�1�,p�9�{ev�0�6�A�Q@8 U����g�LV\��k2�F��BW��9��&��j����d;y�D�& ��?\	�`�o���������l��xTf�?�����g�(��:i𜀥���x!���"���G�:��A0��@<��n`������+1��~M4*��1����)�D��;D�q}���i#�3��>���<
�'�F=����[r��(��P���m�X]�؉C��-�"��{���f�r�Q��e���a?�Ѕ��l��d�a�Z�?��YEx�