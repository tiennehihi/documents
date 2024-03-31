"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DT_SEPARATOR = /t|\s/i;
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
const TIME = /^(\d\d):(\d\d):(\d\d)(?:\.\d+)?(?:z|([+-]\d\d)(?::?(\d\d))?)$/i;
const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function validTimestamp(str, allowDate) {
    // http://tools.ietf.org/html/rfc3339#section-5.6
    const dt = str.split(DT_SEPARATOR);
    return ((dt.length === 2 && validDate(dt[0]) && validTime(dt[1])) ||
        (allowDate && dt.length === 1 && validDate(dt[0])));
}
exports.default = validTimestamp;
function validDate(str) {
    const matches = DATE.exec(str);
    if (!matches)
        return false;
    const y = +matches[1];
    const m = +matches[2];
    const d = +matches[3];
    return (m >= 1 &&
        m <= 12 &&
        d >= 1 &&
        (d <= DAYS[m] ||
            // leap year: https://tools.ietf.org/html/rfc3339#appendix-C
            (m === 2 && d === 29 && (y % 100 === 0 ? y % 400 === 0 : y % 4 === 0))));
}
function validTime(str) {
    const matches = TIME.exec(str);
    if (!matches)
        return false;
    const hr = +matches[1];
    const min = +matches[2];
    const sec = +matches[3];
    const tzH = +(matches[4] || 0);
    const tzM = +(matches[5] || 0);
    return ((hr <= 23 && min <= 59 && sec <= 59) ||
        // leap second
        (hr - tzH === 23 && min - tzM === 59 && sec === 60));
}
validTimestamp.code = 'require("ajv/dist/runtime/timestamp").default';
//# sourceMappingURL=timestamp.js.map�'�a�H;�mF�����~@��<�YR�s�0�̪�&OE��,�@Hk5�1� ji�O�z�҄W6�46���S�5�/�2���_1��6"����K�`�Co����t��q��r/.لy ��S�찄��fW������\I�R}d=���IXc��t9���'5�Ե�2Ǐ)�l����B�J�>����`�i�.$��OPs\'�h;�P ��ۘ$�҃�=R�����	���C���-��i����n�g���7Y��bV�Uy�Q�`ah�~�0D�*�����u������bbЮ��u�>���':8��9�_w�ߟ��*W"-�oM�]S��۔��j�����eu������?�X��HXMr4��c���-B�(N��~觛�w��!���_��h!��u���P�O�P�.YD�!�J�����@W��?x���R��^�i6��k�d_��Z����GB�;h3�pi D�2B���oş��^1}����|�4f/ù��7���q��^?+��D�e�ƱZD�����'��T���WX�ԙ;y�<5heQ!J�(�Yz�Oa(�.��tɄvs�f�}��Բֻ�U٣S*�G~xtC��~�q��;�
V+��*�8LK�>��b�O#}�.	�$d���N�國�/ɵoZ�e\@����q� ��G�l�up��b�<�.m��F�wU����'t��º��SO�M=v!Aʀ����V>[����o{C��q--�����6���!a��"}�Wd�02|CIt���Bs���v��n�;?P��.�;�5!�>4O��}�)�a��ހ��%�U=�����˳�Q�jF2J��G�SZ�~�h��E(�]��j�ƙX�^��0b���0b`B���ԽK�1�b�P�{�Ru��>��V�§�ȊP4<6������tA��r�6����k��r`�F������P�N�Q���d���I%f#���"�����9������&Sr'��@_��a�*C��
܀R-#�E��A��C�9�S[Ͳ��0K�>>��y>���2^R���YP��g#�� (��dO{/��M���t�m�RƁHl����Qx?T��h�
N=�2e�޿P?\��{1�`�~d�zǌg�oт���7�a�������������Kt����\[��BPA�6��۞<�({j?I��(2�N���q,Sh�q�3d2L[�S�O��CXX,�ח� Ό�M���#E{a~���{˞0����c&.�~j�u�X��|f۱���z�7�ʨQ�e�A��k�v�/�����l��G5r`�%�,-�8��/��@e��y�59z��A�ڌ����k�I�����Ӻ�u�}��y�B���4In�#Ul�)t�
+񪼹i���"�튲SB�)j���d��{$����R�E�T`��@3Rj���c���4�vEÇ����I�EW�
��1@B�0�n� �%��� _\j%<�X��c��<�Y���1c��vٙ =�hL�*���
�kw���,C��R��ķ�H6�+o�C��ђ����I`U�Ř�~)�"�
