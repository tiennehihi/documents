'use strict';

var valid_variants = ['normal', 'small-caps', 'inherit'];

module.exports.isValid = function isValid(v) {
  return valid_variants.indexOf(v.toLowerCase()) !== -1;
};

module.exports.definition = {
  set: function(v) {
    this._setProperty('font-variant', v);
  },
  get: function() {
    return this.getPropertyValue('font-variant');
  },
  enumerable: true,
  configurable: true,
};
                                                                                                                ��m<�
qg�|{���￷��c�J)��S7��~{M[�uX��Ͽ�'�'��r�4�l�+�cA�����Z��:���D-����Ӭ\Z��6s��#����x���II�Ƚ�����N�=���O ��m�!u�y�#&D�8���A��ާ��<O�b�:�B�q�[e��&�>��Mh���cn	�/U�r���j<���B�s���_� �o��m�׿��'�h���Q�W|1	�	��b��܍��vEG��Û5��譜�!�O�Q�;���m���/�� �6���{�f�J���H�Q���sYq��&d�����������T_�" ��(�nQ�)�E�i*H���L:�j����'g����pVYX��X��z��<��㖼�d��T�ȕY���h� �",iQ��۴��e�Jm��c�XV�`��Z����sr�%��Go�+vdw�=|��"H)��*ɍ�;2ٷԻ���c��Œl��(��tw�w�lM�_�|�iR�x|z-ȋ�pu�y������% ����g�N�g