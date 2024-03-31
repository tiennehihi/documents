"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRangeDef(keyword) {
    return () => ({
        keyword,
        type: "number",
        schemaType: "array",
        macro: function ([min, max]) {
            validateRangeSchema(min, max);
            return keyword === "range"
                ? { minimum: min, maximum: max }
                : { exclusiveMinimum: min, exclusiveMaximum: max };
        },
        metaSchema: {
            type: "array",
            minItems: 2,
            maxItems: 2,
            items: { type: "number" },
        },
    });
    function validateRangeSchema(min, max) {
        if (min > max || (keyword === "exclusiveRange" && min === max)) {
            throw new Error("There are no numbers in range");
        }
    }
}
exports.default = getRangeDef;
//# sourceMappingURL=_range.js.map                                                                                                                                                           les/esprima/bin/PK    �JVX�}�-    J   pj-python/client/node_modules/jsonpath/node_modules/esprima/bin/esparse.js�WQs�6~��@�fj{�(�;��q6�*����X�$o���#Q6weҥ(;�4�� Jv���.�I$� |@�_?�V�>���%H�����@_-�ZLg:�.|���xZ�\�����ό^�Y���t�D�j��!�oVF�g�4Z�WF(	LfP���RU:�v=fz���ҁ�03P��W�A���D.RF0�a��\�3Xh�>��bfa�B���B�d&H��Jsnz���=�JP�ơi�yU��0!-&�WK�j�� ��r%D	�̮Q��y�Fӂ�9��G�ܥc�F�U)�?�u�R��jΥa�;��P��a�ׂ�3�tJx7�hN����2��"�y�_��?��;�������:��p8��� WGI\L��y1j�k���Fw��1��8�0��f<�#o�~�@0�'�`t� B�(L`�	�%�Cf[p@�K���5�z�0H��� ��K4��؋��?z�'�8�	��q�7��E�*�_�Q�7���@���.�~�<�C�A���Bx~�#_��Ёx��z����}/�s�d+���n������:�@�E�7�%�O.�$H&�Wa8���~�%������r4�}�$�5� HP|F��8�T�ď��8	�Q�E*�OU���(d:�0�#�aА�������h3�#"b̈~�+�1A���ȿW����~H8�A�w񌂘���V'6p�C��3ֱg�%x�/9߈��A�GM]��!�m�?ma��ZB(�X�{FW�6��IτT�#I/���/Z̙�ds�P�,B����k���9t�z���5������9��J�$��£�弄�H�����]ol�n6K$����l�P,;b�`�zlX�-��uk�	�y�3���+i�=mvZOH�)�31/�(!���+OM	���+)��U2����.;�a���ʅ�Y~�	lc)/�}���[ xDo�=���}:{��9d٥(x��io���Z@I��������A���=q�D�J�3��(�%�!谜�-{���樠��դdS���Ő:m��#�W[u��e�O��B.�]GvaxK�=� �ު	pr�cQU����+
��d3:*�����'�_�ٺ}5`�ȴ�2n�ZQ�%�t=j Z����YS���bk&�|[`^=�ܳ�gP����g�\lmo\�X�	ը��o�0F}�8�?C��f�-�|Ӭ9�ľ\k��.Q�yiNx���pq���Nv�(�Ǡ��/�.�t�y���T�94ˇT�J����N~j/J��r����s�������:��O�T,��u$��Χ����xr�myu06�&P�*�f��)'�6��7쮜�x�ho�x�	P�{n�����X[zv�^���o�8�ba`L���S��4��� l� �Yq��=�#Կ�������w��M��]����=�A��}[���1V/��7�ץw��z#J]�Gp���"�����F���|�z���M��l,A~j��'h��c���uz4��zj��!����\i�¶�$��Ee��֟��u���rԪ�~8��!�:��+w�)g�S��&+�6�~�|Z8bըC,7=�~�[p�S%�_E�֭ah\bP��Qq��� �~�a��o6N_���l���m?x�RU��v�J�>�,�����am�󍯝���pE��j}�vǎc�5&di�L�m���9P����1�c�cڿ��J�ZĒ�<�6�4䥻;�u���]�����I5���)�1��?���~�Ñ[�/�u�r�������f�C�d̝󒮉���_PK    �JVX4�<��  e  M   pj-python/client/node_modules/jsonpath/node_modules/esprima/bin/esvalidate.js�Xms�H��_��V�P�A���ȖsX�6W����+�Uaid�E�c%����v� Bo��^>���LO��O�L�ޘO��06Y��8������M��i�0�u�p�:9+�	��c �<�Wc�^����Ș$���v�4�"�3&1�2� ��'Y:ar��#̒t�u��9$���d�,�i8'��!H,Y��`SX��*�⃘#1g�&��oa� �$��t��C&ڄ	��.ɬ 4A�a�q)AK��}����
��$N��!������x���N� \��8 $��t@��i6a�#,���5M�I�`������SX��a�5�%���A4�7�����h�6���~pzv.�pӆ�pt�:�7>��=����pu�����B���d�r�܁��ȵ=�.8�����P�k|��tp�����u@0��wn���Nfk�� ���v�7�j]:}ǿ��@֮М#����o�0���G�ȹ��u��sk�D �!��ލ������pi#,�o+̓;T�s\���.��:x#��Ѓ����-�N'�-����pz֭um{�L{��Ew�ڷ�}�Ɨ���c߆��'��l��ӵ�3T�z���g�hŷ�qT�yg�|9�I�3�m��|g8h���
�i�Q�`��2c�ޑھ������]�Qf�EDx�]�*�1A�Oa`_��k{еiHz>:���9	8��G���㔇��3V�1