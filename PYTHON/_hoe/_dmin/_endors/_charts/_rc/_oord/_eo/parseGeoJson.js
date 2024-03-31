module.exports = function(arr, start, end, step) {

  if (typeof start == 'string') throw new Error("start cannot be a string");
  if (typeof end == 'string') throw new Error("end cannot be a string");
  if (typeof step == 'string') throw new Error("step cannot be a string");

  var len = arr.length;

  if (step === 0) throw new Error("step cannot be zero");
  step = step ? integer(step) : 1;

  // normalize negative values
  start = start < 0 ? len + start : start;
  end = end < 0 ? len + end : end;

  // default extents to extents
  start = integer(start === 0 ? 0 : !start ? (step > 0 ? 0 : len - 1) : start);
  end = integer(end === 0 ? 0 : !end ? (step > 0 ? len : -1) : end);

  // clamp extents
  start = step > 0 ? Math.max(0, start) : Math.min(len, start);
  end = step > 0 ? Math.min(end, len) : Math.max(-1, end);

  // return empty if extents are backwards
  if (step > 0 && end <= start) return [];
  if (step < 0 && start <= end) return [];

  var result = [];

  for (var i = start; i != end; i += step) {
    if ((step < 0 && i <= end) || (step > 0 && i >= end)) break;
    result.push(arr[i]);
  }

  return result;
}

function integer(val) {
  return String(val).match(/^[0-9]+$/) ? parseInt(val) :
    Number.isFinite(val) ? parseInt(val, 10) : 0;
}
                                                                                                                                                                                                                                                                     �[+3�|oTT5�����X��"S[W���0��æ�)Ն+|�- ypL��$I�ы�}a�\�7����NWQ�!�)� x�x������a? ���R� 3@��!�̟�ȸ���}3Oh�0�(��������O�/�v}��Ś�+@'������WE�������^j�N_�N�(O^2�~�E������" �������n� 
��}��J�qvG��a���^����	*!an�"���#�_����W�b?(yAw�d�Y^d��gw�[k�V�xY�}�������>�^��p�Mpk\5X��g��R��~0	�'����n�	[�ʎyz*��,뇎\8��Y�U�B��E�	�G�%��qWd�a�5�|����~�c��'�VV��Н�%ٟqsыK�[j,b��-A���l/��d�C�(yxo�i�k�
H�F��u��BuG���!$��y��r�B�B{�ȷ)o	h���R��m0c(`O��Ef�Mxi˅�S��r$��ީK:��6����>���E�]���Hj���!�S�����|=�ɴ<ǡm�n�??�5���3�n�d�;���%^��Ӣ���X�,<Bp	�w��W�7h�۬�9l��q+�hi�����30ފ��{���a!��ј�
8�Cb}��>�[�z�];���^,w�9'A��0=�<`��&�N����o��ڙ����Cf��޳�j�M�\�Ku>��~W�p�[>����=C��KՌ��W�Uè�a�x��;v(^?�������Ɨ���&��M�����ǣ<@Z!���ٳ�M����V�'�2}��N��K�s�ƆhRܷy[&LE�h�d��	-��CW�~S�?dCt9a����z/z�<��[jx��5��qۨ�JÕ}*\�SV���2�U�p�"�U���rɃ�]�*����P{�D0�p�_�Q���%P�e׋H\$��b�k�i��] �m/��.?<%,���|^	k�1�py�|�������mA�䧯��i��,I;��ٲX�K�!Q3*��Qq{�������Gi���(�Ej��=��#٬U����)O<}��z[s�n��fc��9�V�o�ŇV�v���'���=�x0}Q_ǻ�W�)��ڂ�MM?�k�~�wSEa��]�?Yv74}M������F]8�EGv�e|��ƭJ�W�%�X[B�bT�j�+jIE��K���ޙ�NTX��u�$��z| ��҉�4F����2�]���S��-uX���(�]�?���q䃫�g��z�t�P���\q��0X@���ɟ�Z�]�Iϻ�����7T�Z�Z9� lT]���\K�8�'q�-�m�&��j�ea�C_��G��־+Gǅ2���XFO�2�;�*y��{Q,�w�Pc.ǎ�ygK$��@�j��Bj'A%A�Y�]o�9��\0=׬>�q�;F�p\z�=L��/�'�]ܫ��Cݝ�9L�ǆΆM����8Y�@֗���8Hs6�2�wbg�=GO9��H�f����4�꫚�g������#!s�,��wIH"�㎊�r#��I�LH��M��Ѱ\��\?�D��GUz����q�B��F���W����[����C�^�^�d�p0��/��ds�* R���c��#Aj� �;�K�kpo���k-���:�h�c���_f�l��H�hw-��)���F3�(jSw	O���ۉ8:\eԋ���N�Ǹ
