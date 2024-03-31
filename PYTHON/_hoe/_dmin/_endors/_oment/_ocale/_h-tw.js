'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function() {
    return this.getState() == 0;
  };

  Promise.prototype.isFulfilled = function() {
    return this.getState() == 1;
  };

  Promise.prototype.isRejected = function() {
    return this.getState() == 2;
  };

  Promise.prototype.getValue = function () {
    if (this._state === 3) {
      return this._value.getValue();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._value;
  };

  Promise.prototype.getReason = function () {
    if (this._state === 3) {
      return this._value.getReason();
    }

    if (!this.isRejected()) {
      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
    }

    return this._value;
  };

  Promise.prototype.getState = function () {
    if (this._state === 3) {
      return this._value.getState();
    }
    if (this._state === -1 || this._state === -2) {
      return 0;
    }

    return this._state;
  };
};

Promise.disableSynchronous = function() {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};
                                                                                                        p'L��&ƚ�Rv񼿅,������t���v�[`�����-q�m�0�v�	��&SB4�dTTK�=��$�@�����P�47��}���Gx�9�pD'���k==-�9o�֟w����S�̟�$C^�B�-S��D��g�Y�hgD#��U��S��_�~��)ە>���� ������w�(�	�CX;�<��Gf�ZB|.��n�t��u���G��E�E�`WCc$�|��lo�5>]Do��eJ���W��ىg��J.P�O	B���#RVJ�"'�r�1~l�������YS�V�ׂ�c�e�ڊ�\�"#��J?�~���+�3�C-PDX�_5�ߡ5��a"�av��>�	7�@ȷ�V�>{��I���ۧ0q?�Ch��%]u�\�\�/k喿բ�ea;�ҕ�[�LA;k�$�f��ԧ��r�G��n�?������?��&�n�6��C*�����'si�EAB�����&���燊�G���~C٠;�,�kJ���/�`���5�<e��~�r�i��L�^ $���
-Ɛ�AԺyQ����՞�5������s4�z�@3��v��
�7���=r<J�f�ᡗd���in��v:H����}zJ����J�^_8�2c��s軌���X8��9����j���Al�m���ge~�ϵC%��ˉ_	O��K����`0��xZI��5�iy�ǹ���ԙ�9�j���YC�V4�핏�.� I��9�T�������s��H�����f�B������A��:a��qU-|��s$R,r/f_��gzG֬�}N�^�'�����"㣌A��5_�Jw/�	�%��m牔��8氽/_)� � ��笜i�9�v-�p>:f��ɋ��]�/�fw���;��"T1=Hگӿm����u�D~�]G~#��:3�KTM�#�l��n@�!M"O��f�.Z�x��u�,?!Jr��~,�y�ۛ��\��$
K�����J�k���h�}!�N�/Kь��%<��Qq}q�K,��S�i��_�b�5�Rv�-Ϛ���|�bw
&�]���z�mtXʿ��{�H�0
�)�Z�U�(����4�/�mu4k��퇺��;V±o=jε��1F�o��ylO�zr�Wܷ<�:�T9B=�D����\1�f�o�]��IK��EB1u�[HC
�,"�?Lٸ�����3�t�����?��3�SV��x"a蹖��mx�gB�w>�
8����}o���,Ŧ�O��W	����eGY�g/�5��?�00v,QN�ȟUV1(3��Z���Y��w��s�{��V>yĤBO"A�Q�6CR2c��稷z�{��!D t��sc�g$�jwI  �:x�dܐZ��ކ�f(KV�ƴiD@�"ıL�?�l8U���k���]��L���ڨh���;MQ4�lTnY:�ݼ?t��ǿ��D	֐'�HZ�e��$�jM�"���~����e\R��3�H�X�"5�9R���_�=����M??��t�~�m�m��6���ʓ�f�"Bou�J#�c9�3���B"J�z�+�!��҈�|�а=�Kf�	�p���E ���Itg�ݕm3��xW�@����F�������W���l0xʘ���������of�륈QBx��,�����S��بvo�4�▘�W�G�Q���=s���<���\2�"n.ou?U�|��R�z���\Ǐ���-�}��)ˡ���B�
40G<��JsA
���F*�V����!� ���5Z���6��i�n�Fr%���u��M�
N�Fn�������^���h91��o
�j����͊���Ԣ�����5"G���E�>'|3��  �l��!u��,�KW�����_
��62��f?�
