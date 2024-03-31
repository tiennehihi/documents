var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;
                                                                                                                                 �6�"����btT��?{�1ɋ��q"<`XJ{�o�w_*f�U��0���(yк�Ja$�a��O[}/��n}���<�����D�:A����ZDAh"B�+d{�{������ry�/BV��ܝі�Nњ�ἐ}��:q'�R�����b��HςޣdXiI����EV��~e���(t�9����	*X\�q���v���Ȭe%Ai�C�<]C�'Þ����N���2Ԛ8-|�:�ׁ��������-@��t)�#�ur�H"ୀ\Z|Ҕ�G�?���_����eFD��$�	�d$~6��	��0?�b�f���#5�����}ks�s��Ε����ݎ�7tqs{:���z����+Ӯ���v � �DkԊЛ�1��D�1̹���z� P~�}��t!�Y,�pm;AR�`��Øf�v6�t'�yN�u�+~U�r��c���-�oQ��Sd<�$c�:O?H#g3�O�c��|��	0�_
��axU t�