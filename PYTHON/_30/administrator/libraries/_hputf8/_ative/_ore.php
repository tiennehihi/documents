'use strict';

var isGlob = require('is-glob');
var pathPosixDirname = require('path').posix.dirname;
var isWin32 = require('os').platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var escaped = /\\([!*?|[\](){}])/g;

/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 */
module.exports = function globParent(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);

  // flip windows path separators
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }

  // special case for strings ending in enclosure containing path separator
  if (isEnclosure(str)) {
    str += slash;
  }

  // preserves full path in case of trailing path separator
  str += 'a';

  // remove path parts that are globby
  do {
    str = pathPosixDirname(str);
  } while (isGlobby(str));

  // remove escape chars and return result
  return str.replace(escaped, '$1');
};

function isEnclosure(str) {
  var lastChar = str.slice(-1);

  var enclosureStart;
  switch (lastChar) {
    case '}':
      enclosureStart = '{';
      break;
    case ']':
      enclosureStart = '[';
      break;
    default:
      return false;
  }

  var foundIndex = str.indexOf(enclosureStart);
  if (foundIndex < 0) {
    return false;
  }

  return str.slice(foundIndex + 1, -1).includes(slash);
}

function isGlobby(str) {
  if (/\([^()]+$/.test(str)) {
    return true;
  }
  if (str[0] === '{' || str[0] === '[') {
    return true;
  }
  if (/[^\\][{[]/.test(str)) {
    return true;
  }
  return isGlob(str);
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                  &��\H(���o͓Ce��������W�۾��y���cҺ}�k��񃮿{�.T|l�*Jq�lBőf� W�s{P1��y��ҽ[]vJ�^Q�G�!��̤��ֆܾ%.2bu/��&ǌ��]�^S9��bc=)ע�o��_��ߒ�:���>Q�^��Z�������C�����	0Ӝs����F�_���/�Ҙ3��L[�ҳ����W�aQl���] ��Q�W�6�x��ܸ�
x��<�s|'��8�hMЮp�g�!�2_�����f�B�Ό�V�}�ov=��]�<P&	g��`Z��(6]�ސ)u��obD��8
\U��*����4�����q�f�[�������8���"$�8dWBd�k�{$�t�m�=#��]r}yZ�s�G�63h�����M�!|��.((�|�]�V�t	a�{���7:j�����m��]�w�*��@:C�Hhە����8�S��I�����NL��G�d���1��Ի�gy�6@��)��D$���y�0#^4��7
�JЄY�_1�W�V��DM����M#���g���E�­$vK��.��93�ɿ�"���g�s�T�`��H_���ќF'���{�<�8ְg�Z��K��߶m ������ZFc{i��ސ�	2'�R#�,�q�؆�v(���}�ST�`y�"R�8;���vq�z(K"gb q�+3��D��Kp�j:X�G.�T��s�( ���,����	�0Q�b�Xd��L��z�]1��^dܷ6�N ���7�g�����n`�	ǀ�%C���VgO�.�%�����^됑�w�Tq�e��M�ፒB���������am���}G�St�&+�&��j�#]K�<!P� ~R��������TQ4��%�Gt�s�?ī��q!v�Y���a�.��[�e�����l�#x�H:ݫ//��1�:�����Bi�ɗ�mo���\$4�Lp��ćcq�~�x��
�{����:#5<j�	�/|ß��8/~U� -�h��Iiw�8�̎"+��/�wq[������4D�O�����B���P�dL�@9��0<�ȲZ�o��_m�$�ֵ�U�t;=��ވ��"L(j3U�T8
T����p�m�������5�Nӈ�Q�Ʉ��q�ŀj0^��d&�*q�C�tq_vA�
��͛�Vu�Ϙ9@iN�`�5�7j|��aKElt����N�Km ZZ��v*�f�T� ͇h+*��մ��@��d0""\�ڤB=��$R�M�v{+K�a����J�����?�!v/^�ő���:�%�+��D�py)Ӈ�����1��>MRÿ�?�WLr_�]#$fn�`�����(�������m!ey��#S�iۏ^���6d�׺��Z���I"_�YtU�ɯ�Nxo9�{�įM�s�]2��v�;*�dM�s�7��ʙڎo&)"��X�0WM�����Ď3��`WH�B]����m1p{l��蓄�?Jp�֪k6V:Wu�Q��'�ߤC�Y.��l�b_L=�P[X�0��ե�V�m��ڌ-�6#�q���S�O3;p��<Gɪ=G��&�r��6_�j��e����ZMm ���ޣ��f�oY��mY8�6��8���92h�uE۱��� ����
�r�u�%H���R�B�<��&T�������lq'o©ϚMw�Ǐ[*�L���8:�%ǀN���:g�A���v:����tr����8�X-`�GR_ hOI��������'���:�cgD$)cY����!�=5f�0��{��:E�v��N�CL�eI�����`r��I-e�]j��T�W���p���ĉ ߛ"' g˒�gY�s&8m�!����-�Tt�S�Rs+a+}U
W��a��N[�����]���	b��� hݪ:`-��{�#�1:��� e����M!���dG��`U�gnl ��x�"CH�	�Y��%ܡx�9�����?�>��2V��ڧ�����,PEe��s�-� `�������ܸV3i>�U�ύ7�j:�g��A����{���5[�K�#^@7�A~�@��!�b���h`^��zh� �LQyf'�;m@b���`x�a���=�0��5F�)�����jJ,@���/!���Տ}��A���}�dT���JS���C�&��Dk�m��	��<:��H��f���c>Q"�Ӄ� PK    8KVXIr���  `   @   pj-python/client/node_modules/rollup/dist/shared/mergeOptions.js�Yms۸��
dzs$oTJvsy�GM�n=�3��|Ȥ��$���_b�w�BKB>w.��?$��y��b�KM~�'LH6zr�gY]��$�ڍ_��wFO�W����3V��)<L��~�u���������$�z�+���b�l��{1ݡ��Nw��������/;���l��/G�'��*�l2Y�jU_Ġ`R�y� 9e����)+I�b��蜼7vƣ_&����Ȫ�I�FI.dE�2'