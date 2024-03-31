var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;
                                                                                                                                                                                                                                                                                                                                               ��V��ԓN�-��� �G�����\��
BD��Y��Zy5����z�4�L���I��3�$#`  	�6�t/,���b���g��-��/�8�ɽA� ���k�ǥ�����E�*��-�������Z���)�rfV��e�h�D��^�����d�ӑ@��g��!���$
@"Vz汐� ��V	x�LI�oI;;������&��g�U{�z%��])�0v���S�`w/���(`�p���'��F�K����)�A_k���/VI$�Ҿ�5A��Dܸ��\�#��u���K�5�xF k���A�i�'�#���b]�?��o���}_>Z�K���l��@f�nz��ᚵ�}L"�[��Vr��]4Yk>ND۟�K��h���s�&�mK�,�*�����VZ�]������n�Z��:��'��ҌԚ� UN0?lbL�G�vk�&��}!����F�mNK���w|�!��r���F&�����X�\,
�����r��2��~��$�2a14�����(~� seD���I�o=��M)m�k��GS��q8��O��麓����̤
j[�����Ϝš])�g���t�e�����|����� �1mh�����I�CY�.�e�`ԃzNG�i�	�^���7l�a(xY�$�$��Y�E��N�*e��/����!$#��'*���D �p� 
:��5�G��؆��o���������k	���J,_�Ɔ8f�ǣ�Ks�����sp��$J]VQ�T9�����,�q͙��=�qrs����w���g��vo%;�g'�E(�+EqY�lvETE�+��O4�"�"�K" �K@Đ�8s�*RC�#Y#S�Nxv�~�W������B ���5�+��˒�'YN^�*S�H��%����~r4J�5f�,���=v�jr�{=Q���n�g!���x ��kGָ-ʽh���6�)0V�{v�!x�����7�L��h Vo�eE�C*T�=n������υ�B
��+`]='��%�9v4��7����z�b�F�;�e���O�n�.G줄��p�=͙H��F�+g�[TD#!|h���K�8wuq+A���?B� H8FK�21JAf�h;��T�![y���s���h�ܹuyW�+��(��z��4E�_=!в��@��p �"�}���!����֌�|�:2�#C�6+����Ͱ����+f���y1-�e�0������צS����IA�9�6{����Q��$�i͏��a10$�/�c�*�lk�8CD�;��鵷�`u�����gI��!oa V�0k%v��y�(%�"G��j`�8j�V!�Jd��#�X�&�\@ɝt� �ED0Q/��V��+v��]K1^_���������W�%�_W�>b'���7^�1��Xַ�D��Ӕ��X��v���3!|X�=��誟
v���W������d+������3:��H0�bt�ή$X��xz=}�A�$}�!����� �G�XKR���� �wm���R:�k�p��<�A���0V�T����7<�\�Y2�[[ًM�kWi�W+(�̈U"1>�"�9C�JȈ��k*+����y�j����)G����Gx-b~jL�,�6O�j��`�y��Ct?�׈�