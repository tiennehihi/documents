var baseClamp = require('./_baseClamp'),
    copyArray = require('./_copyArray'),
    shuffleSelf = require('./_shuffleSelf');

/**
 * A specialized version of `_.sampleSize` for arrays.
 *
 * @private
 * @param {Array} array The array to sample.
 * @param {number} n The number of elements to sample.
 * @returns {Array} Returns the random elements.
 */
function arraySampleSize(array, n) {
  return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
}

module.exports = arraySampleSize;
            ��g�;��k^�jA�Ťp�-�\�'�4`_�06�~�30O}
��q �3��q�ZXp&�+h�jy4�+��+ϲ4x�h�k3��Rm��
����[L�9;{(Zrd�-\�v�m��� ��u4Q*�R)q_���p��C�.5�6��̾r��Ҏq�Q$�]q��H�VW�W���v�"� ���P�)��y#/D��Wk�o���T�f��cnM���XTe#�us�������GJU����ɶ��*�j���x����{`��VU/?97����ؗ�ǲ�����IeB=�>�ɞ�a@���w��'}O�o��0�aB��i01�m[�*�܏�rt�Mo�ey���;�G���f��{�>��d��rHN
�8-Y�h�����Z��c�����$s���T:z�\[k���@��"A�R�
�ئf�r�T��P��G���m���떛�z#C�U{�S������j0�|�ym�k�!�����r8H����I�!`�f�y7��&/VG���?Ù$A$G��f:p��w'E R�}��W#�2�"8��,m�#n�	{�$�f�U�>����D��LG	}�ONP�J����A�X�nKD�%�"\�>���`�=�h�(d�M�o�y<�V�X4z҈f��+�e�����/��!�fî~O.������ϛ�k3��S��&mҁ�Zn��x�.�C���5��.���]��2	_E����Ǡ�tX3