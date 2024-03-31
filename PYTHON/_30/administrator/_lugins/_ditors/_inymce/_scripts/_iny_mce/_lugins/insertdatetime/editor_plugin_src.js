"use strict";
/**
 * The Grapheme_Cluster_Break property value
 * @see https://www.unicode.org/reports/tr29/#Default_Grapheme_Cluster_Table
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTENDED_PICTOGRAPHIC = exports.CLUSTER_BREAK = void 0;
var CLUSTER_BREAK;
(function (CLUSTER_BREAK) {
    CLUSTER_BREAK[CLUSTER_BREAK["CR"] = 0] = "CR";
    CLUSTER_BREAK[CLUSTER_BREAK["LF"] = 1] = "LF";
    CLUSTER_BREAK[CLUSTER_BREAK["CONTROL"] = 2] = "CONTROL";
    CLUSTER_BREAK[CLUSTER_BREAK["EXTEND"] = 3] = "EXTEND";
    CLUSTER_BREAK[CLUSTER_BREAK["REGIONAL_INDICATOR"] = 4] = "REGIONAL_INDICATOR";
    CLUSTER_BREAK[CLUSTER_BREAK["SPACINGMARK"] = 5] = "SPACINGMARK";
    CLUSTER_BREAK[CLUSTER_BREAK["L"] = 6] = "L";
    CLUSTER_BREAK[CLUSTER_BREAK["V"] = 7] = "V";
    CLUSTER_BREAK[CLUSTER_BREAK["T"] = 8] = "T";
    CLUSTER_BREAK[CLUSTER_BREAK["LV"] = 9] = "LV";
    CLUSTER_BREAK[CLUSTER_BREAK["LVT"] = 10] = "LVT";
    CLUSTER_BREAK[CLUSTER_BREAK["OTHER"] = 11] = "OTHER";
    CLUSTER_BREAK[CLUSTER_BREAK["PREPEND"] = 12] = "PREPEND";
    CLUSTER_BREAK[CLUSTER_BREAK["E_BASE"] = 13] = "E_BASE";
    CLUSTER_BREAK[CLUSTER_BREAK["E_MODIFIER"] = 14] = "E_MODIFIER";
    CLUSTER_BREAK[CLUSTER_BREAK["ZWJ"] = 15] = "ZWJ";
    CLUSTER_BREAK[CLUSTER_BREAK["GLUE_AFTER_ZWJ"] = 16] = "GLUE_AFTER_ZWJ";
    CLUSTER_BREAK[CLUSTER_BREAK["E_BASE_GAZ"] = 17] = "E_BASE_GAZ";
})(CLUSTER_BREAK = exports.CLUSTER_BREAK || (exports.CLUSTER_BREAK = {}));
/**
 * The Emoji character property is an extension of UCD but shares the same namespace and structure
 * @see http://www.unicode.org/reports/tr51/tr51-14.html#Emoji_Properties_and_Data_Files
 *
 * Here we model Extended_Pictograhpic only to implement UAX #29 GB11
 * \p{Extended_Pictographic} Extend* ZWJ	×	\p{Extended_Pictographic}
 *
 * The Emoji character property should not be mixed with Grapheme_Cluster_Break since they are not exclusive
 */
exports.EXTENDED_PICTOGRAPHIC = 101;
                                                                                               �R&���Ip'��6L��l��{泎���
�\����[w��O9d�"�����t�!"H;������u�+H�N�Pw?5��:�N��R>O�A�2�������OkU�N���>����s�~�s��c���4@{�m+�7{�F;{މv^��:��C~w_/�,��P:,�0���(�M ���� .N�͍��<As��ע=2_'�DkP�L�{ ���M~�-�\�6���|��Lv�C�(Rڜ�{�f-{�}|\s�i�2ߨt#"����yŬh4pQ�S���GL%E@���$3~�W��É�&G��3we͍#���0��݈���G{f옇=b����KI`7b(@K���o|�Y�Y@^�uS����ʳ�&�{$�D#|,�-��!�����"a��0���毷�����&��� �	�_�e?����9H�Ԧ���&c��?:�x��v�sJ߀C
E�DO���,���G_!�����`ro9�����8�5���M�x�v�f��~������-���A��}9N��4*V��o�w���C\0R8\.2��
�2<�P�x�9�.��$�y���R�_��w��Y�y|He:��E��{4���C�E�>֒X�ƞ�h����J��:O��������z�_���ג����_\�x!m�8�A�j�iJ�ßH��FR�%��5?QJ�o�$,�hEI����mC9��LK��4;��_?q �J+l1M..-�a��XF^��}}5��
��*�T��>�h� zh���9*d ����]�Y"���n�m^��o��cf������Y�D��,8"�ޯ�*�UJD�Ad�2KJ�`��ڍ[���i>���85ْ���Nm/��h���˿x�5��T��'��+�q���v�~3K0���&Z�ѵ��_�6�T���U�����vvq���*�-ۙ�M��r����н,��C_��ea��3��V�F<���a|��^����k~�Dƭ7����W�Pf')f/G�'=WPX����=X�}������
U�R,��z0