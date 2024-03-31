'use strict';

var Type = require('../type');

var YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9])'                    + // [2] month
  '-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:[Tt]|[ \\t]+)'                 + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ��) `*�n��`�d�Y��8��e��b����}����N��H�Z���9�#�k�\N�Z�Z�D4�U�
��H���Q�q�dhl�ђ�fƮ~xaH���qWG�f�����u�U)�'H@���sy>�|��X���8/Ju���gLĤR�kԟWŷ1�[�m�/���7��Hn��ڸh�Q/T�ދ�LpD�:������0Js�T��U�!�9KW��58=�~��za=� ��i��z	���8�	��O��|��8�I�k8�qc��'E	y�{��h{�����)*5?E�����&w}fϺr[HF2����� QbH )��9��(�ӗJ������9��|�q� ����#���T�k�v(�r��J�U�x���cՀ h�(�I�9X��p���B�6ԛ�@
Y�G�F���D�m���֙L��=o��k�xRb����p���=�24,��_��c�	^��K�2"��_������6q9'�]�y��Yڙa�>���F���;�����8�� ���sߣ�	�II����G:�K�p�珡S��Z=Ś�ӼaE³�[��n���?i6�� 1|I�
�X������/_3#O�n�+L��~~i��$�1(ę�?����7�ӫ����XY���h5�S9�r_ItV�Єv\
Na��}��>�5�?����&RO�MQ�d�90rq̔ 5��9��Ĳ�Z�f*z,:������Ϥ��:������W2�FD?g�4/�r��7`��\p��{.��� �ak����yI� �\��7�QI���T����?Bh h8+�).w>�\A@$�7#�&�	�X�6ʄ�i�
�ˁ�0�:�]�y�|��%')N�]���l4���G�!�O��;��Y���	vaY�:��3����͋R�H�9�+�϶�Xw9̄Vs  )|4	Vڈt��	����A��^<Ƿ�b��*�Q}�7èu�{P�u4�>��NHPfѢ��	�(��Z�_j��|m����;8�2�ʦIb����Nـ,BT�W�^�/s�4��c:��Gp�0��4j|J3`'���G���� gQ/+��C=<��`E�+2N$���@��-��L����}&RE^y�.oEJDD�\���F+��U�OJM�PZ�.�8j��dix�U�·��� 
�r��ב�)r�6q���y(�����Dg
|���*6�9��Z�b0�#AI0Fau	ACa\�%��7�H�KY|h"���,���Y&؂	+��?��*f��Z�y�_�쥛}Tn��P���Fv�������l,���a�a��z��9�[����o�@���,�Z��ք�.��pr��l*����B��*=ISU��糽� ?d!V0N�h�ch�q-�煡�-]A(dq��U���,V)����q��f�d�M�	�(�Q�Y�z��e�����7��<O�_fi6O�_�@f��4̯���o�Qق�.^`���GV�1^
�������T��g�D�rOhҷ�y���9���aH�e��X@ѻIEb~�N?I���Ѡ8���dY	QJ�,�!c�=lI���԰�X6Z9�Sm�QnAh�_�s	ّ��!t�����Զ%	@��	����-��"������lB��NMO(��=�R� ��?�fC����@on�Y�]*�3���3.�����8}i44����o=rD��DX@��,y�W�u�RWw�
�4���e���Q'f��<�cU-�%h;VdȢj�[�]0��[y-tR�/+��,����)�k�+�F�}A����K���RMx��m�V.C`��?"�G�}/ہ[h�*y
�,���B~R].��u�:�]u����%��]�a)qq@(*�U���������g�@»��Y�<\��;E~Xh�q��;(���/<ݟf#5Ζ���h���ՄP�O�v?�����;U�1�G��F�cL��?[��d�L7%?�j��G��)�dF(��T�����jZ�&-�C��i��X�ݭ��j����~�с ߉7��~K�$�٪#�6٘q�8�>�j�~����/�`��q���D	����!��C�$����u��1�cXz�-|{ime���x^��̏m����X,ˋ�G5��f��:�<!]ǂdg� tȆ�+�� <WF�BzdRKG�~�,|vth\��j��3��S
3r[z��!^мw gv�wRt߄�%�/�aM}N�^K2wv����g����e�R����K2Z�"�p�42�G!x\8$꺻j.\a�Q��^����$#��U�֩��pl���m��]��-�
�Md.�>���ׄ�TF���TK������ٶ��}-�<�z����_~�{0
}KKNj��R<&`��k�&�軇aϞ�����L��.MM��Ku�B򣝧'��t�6!v�(���X��z利�?Bb �E�ݗ+t_eȷ>�D$�L��2;!�VX<V��U�d~1��0Zs�Vp@pwj�&��ܯ8抶�8�� ��-*�H:d��r��!س�b�t3�:�cF2g�z�Q�	�_XY����L�W�'5c$X�j�`hx+:���gZ{��䖶Ș���o���7 �X\|$��!0U���DsB�R7�HGm���t�F%*R&���4J"Z�h��M֜yE�Wk���U�C�"r��<\2D��J>��f�=�<MUbA�1�
�Mѭ����D�� [!)�|zh��������'c�����k�d��*'��44�  ����*����� �hO ��o�W�Z��(5"N.#�\�����u=_��ɉm۶�ضm�il�il�I۶��q�49���y��=�?�ff��u=`0�P"P��@%����Y7�-W�z���~��h;�|Z�"��Su���i�� �������UI�����`�5��Y�D���X�JYV��L����UҨ�{�ى"������	*[
� ?�K���B0S7�s��o��~����M)}�&�}�9w�N����q�Fɒ9L9*��e�f!�� M��O8�Q�nJ�CϦ����NڇB��1����}���EB��bvs[�3gQϵ)�����
q�T]"H\�(9��_��V�[��Z�������T��I#`��"&�/�g������AA/�V�LT��׷'e�N=�Z�&��SY�L�82�Ĭ���E�M�C$�����MYab�>e5)