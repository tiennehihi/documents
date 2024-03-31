import { FunctionCov, RangeCov, ScriptCov } from "./types";

/**
 * Compares two script coverages.
 *
 * The result corresponds to the comparison of their `url` value (alphabetical sort).
 */
export function compareScriptCovs(a: Readonly<ScriptCov>, b: Readonly<ScriptCov>): number {
  if (a.url === b.url) {
    return 0;
  } else if (a.url < b.url) {
    return -1;
  } else {
    return 1;
  }
}

/**
 * Compares two function coverages.
 *
 * The result corresponds to the comparison of the root ranges.
 */
export function compareFunctionCovs(a: Readonly<FunctionCov>, b: Readonly<FunctionCov>): number {
  return compareRangeCovs(a.ranges[0], b.ranges[0]);
}

/**
 * Compares two range coverages.
 *
 * The ranges are first ordered by ascending `startOffset` and then by
 * descending `endOffset`.
 * This corresponds to a pre-order tree traversal.
 */
export function compareRangeCovs(a: Readonly<RangeCov>, b: Readonly<RangeCov>): number {
  if (a.startOffset !== b.startOffset) {
    return a.startOffset - b.startOffset;
  } else {
    return b.endOffset - a.endOffset;
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                   jL� -���z�Z�̡p�X=��{��9���iM=S2(4�̽�ɭ���	A�_��A����f��a�g�I��
Ub�3�#�PJCxP�pԅ���|;�v����������	�V�U31�����Ƶ�,&#ϋR���K��|��Ϻ��
��v2aO��Dn�E.詉����S�L �:E�� ҈�9���u	\x���(^f�*�5���L����נ����XQ�����p�`�n���~���|��?��2�M��jՇ
d)��ӕ�Xåf$x`3b
b[RL��=i()1#�N���g3�IJή;��� ��e� ~i�F�d"!ZE���o
9O�L
u�O�O�O�h#�1���k�ƶB�ЅՀ�p��l. �zc�h1&&5�Y�u5�:/)V�2��I����?C~D��ڢ��/r�s�@���t��vvG���8md�b���xЯM��$�⑞:ٱ��?�~�ˌE�bNLL�������߾[���W�p8�`��Xv����bȿ<�� ���m����7g!E_���zE5�A0�	ͭ"I�`��ɲ��]�����e58�w����	7��˻�7��<ݩ���Adq�� Ts�2���4oP{1�-�@�78i��j3!+P�,ZF(2�k�u�+b8���1wl�n�?�^�]r�wO$#�~_Vi����f	�����=�}�+�˽2��XȆ�X2��aRe����5ԭ.ʩ�N�pj{F���Ǩ?-�fM�잲����k��P�1� �n=�[]��&�wg��&���ER����N;��G1�W�~-�3��F�@�0<T��Hv�tg�VЫl�2��HL���!}/��֏R��z�����	M�IM_�Q�����|�8�uLjS	D\�������� T\�V�����I*�ͦ���.���bf��c!݉�4�>:.h��j��8�J�T�Mwc��}q˳z@u�US��&��,̑�Q������9ƜTķ/��j������\b_�z�8�!��N_��-F#�����.��L�c�e+�Z�u��Y'P�R*�
�]ZS1pT�#�}h�jɌ����U�K��	!}b�o�ˉ�����W?']�.bɽ��uZ@��os�s���)����!F��g�+�(�dO�J-+D��f��w_�2s��pdl��7�T1N6Ƃa��V"�C��d��s��׃��X�l7W�R��?i�A�+U�/[\(�1�O�~�>�pP��֙��V�|� �H�ak�m% %������.h��ȎQ�Gq��t�� Avx�w�g�������5P�v�D���3K�d�WHD�Uw��ݵ��,�K%�h������y+�P�$E�H�,��a�;�m��O�����b�
n��!!������f�3j��`�T�^��*��Y�����\}�3ά$tV�|l�� ����)C�z�sX^�;����ij�O����z"j�����=�f�1#�����6�:��'x�k)����0r\~7Ϩ��,W&d��zȃG�v�99,J���i���ei��Eh�|�qddC|@�Wo�kė����T�qrӓ��5���.�H��V�5�@KsFo�SG��B���+wE�[�w��l���>w1t��-�^+�WP�ؔ�|k��G}��eތ#媋)�T@YE]Q����h�6Axk���h��جxx��5��~:G覵�5��N���PD��&�ؤ�����i�:�8���gCTZ���w9��@�b��Q=��$������`�L\��3",�/K���ㇶ���� ۑ��[���&*_�<��C�l{�>	fص��h/�f��ӕ��xN���l>^���(,C��ٳ3���Խ�S<i���V��D"���������l��i��K���5)����S�,[���z��jı�uݵ���'���2+����Rz�%&d$b{��% K��ϏW\i�D苝����тВͽ1u�S�8d��k̖Fv�e�p����Q�S,AJz�=�X�%�.q��� 4S�1���� Qtw��Ǉjd�u4B��D(E��ח�f�=m>�w9;}��s��	|�j��xa����	u~���J�y2,�hk���G��^<��ݨ��U���Tr�%-�Ѳ0�N|�1[�A$�Gд�֦*�d/w:����D�8)�Y-����po8�$*?Zĸ�I	D���l���!�H0��_w��A�}Ԃ�&�l�J�^/