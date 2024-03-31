var _setup = require('./_setup.js');
var _getLength = require('./_getLength.js');
var _isNaN = require('./isNaN.js');

// Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
function createIndexFinder(dir, predicateFind, sortedIndex) {
  return function(array, item, idx) {
    var i = 0, length = _getLength(array);
    if (typeof idx == 'number') {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(_setup.slice.call(array, i, length), _isNaN);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}

module.exports = createIndexFinder;
        �٭h�@u������H�F'�0�Y��i'0לGq�xe�)��7�I�<�?�c�\�����ؐ3�����^�a��}O�>ϲtڛ���m��s�W8 �߄r94d�5ʳ��1$v���iGnqV�\�&�
i!E*��ͬd�(�C�e�|iOe}�UPH����Q�$��čch,�k)�b�S��58�b]�iWi:t%��^U�1&��N<�4!�������&�,2�⊶�$��u��7��@,C�:�=G��9�ßm���M�����[�ə���v��6�!��+[*1PU.I��x�6�|�~TI��SjD�2�l�l����f��g���TҶ��iB�.�^���Ɣ��\돊a<"�^�M`���M��7�M������8�|����+E���T%�C��c�`��n������~'�}�+Q��~I�8��b��Xa�OX�ɜ�<��E�gD77B���^��?�Ξ?iVvo��1-��ἡ�?��Q��rlM̥3䍣Q�t��B����n<�</ ܊S�ҡ��0=2�`�.�t����8�Qt&Z�T��M��:ʘ7��)pT@�6���~�T��n��{��N������3�Ӱ�+��{/��mf����Q�R>"����c��s���S��G�?!~-W�kR3��{�P{e�s}N�]���fi����*"�j��*5+����qRΘu��r2!��@$�B�3�z���<@���Z��]V)A��ŊR["��1�br���gQHʾ}$Y��f��O�|�D��w���ZF:��[J_-�^�(��.	�c|/6ҏ�������q��tDɧ��՛�ϱ���94n� '��+��D9�SEH]�ǿ]n~<�(�oo�d������ݜ��u�P}c׹�����[�v��<�[	s(&@�-�M�t��/��� 	�S�#];j�S0D��R)p'D&/ 8XO��!T�;�Ӎ�	�� �s.���ڼ��x�n޼��DgE�8;�]�Y f.W����sq[wK7�@�w�&:�D�������O����V��nIQ��r�������ևߋp����'VT���ꦙ|�L�[�=�}���\.�'��D)��_���,�a�q�����g�(��ɟ�,}���̟ϻ��]�/D�}���(QOǥ_1�J�@9�B^^m^�Ȃd���yډl�Q!�71�Xp-k� ��^��A�&�
(?��|SM��󿖬�K�*M�C3;d��ӧ��:�:�������E��D�BJ�q2��};k�?�g.![��E��F�ր�L����uz��@�)G�&�/ψ9ʮ���mѳ�<j��	��L6�����U  �~yВ��~~��B�'*����Dh��u!��V���\�����;�6�̕	�А�Sf$����l
��z4,�:��>vr+-E���:���,<���&�K�c"������DI��r�"�$1�H��@���?�jH���"�;aG�-q�-&��9�8�s@��[��m��Gy9@R�Pd2�l�N�"G�Iͱ�IE%�Yb2�U�R�>;4�\�,wx�Ͼ�(�˙IZ����E���3��ur	���o6h<�QI���'�ؘ�z���=�>Z<�)�\�M� ��ۈ���P�5���˃��M��OG�0_!d�67��B����8�L��:q_{�?�╦�����{��޼��g�v�Z��&�2�-q�l9�9_��z齾@��E��f�]���@h��H�W��dR�M��H*�,G	w�Dk�*$�c��|	��+EF�+�;�ǀgzc�