"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicRef = void 0;
const codegen_1 = require("../../compile/codegen");
const names_1 = require("../../compile/names");
const ref_1 = require("../core/ref");
const def = {
    keyword: "$dynamicRef",
    schemaType: "string",
    code: (cxt) => dynamicRef(cxt, cxt.schema),
};
function dynamicRef(cxt, ref) {
    const { gen, keyword, it } = cxt;
    if (ref[0] !== "#")
        throw new Error(`"${keyword}" only supports hash fragment reference`);
    const anchor = ref.slice(1);
    if (it.allErrors) {
        _dynamicRef();
    }
    else {
        const valid = gen.let("valid", false);
        _dynamicRef(valid);
        cxt.ok(valid);
    }
    function _dynamicRef(valid) {
        // TODO the assumption here is that `recursiveRef: #` always points to the root
        // of the schema object, which is not correct, because there may be $id that
        // makes # point to it, and the target schema may not contain dynamic/recursiveAnchor.
        // Because of that 2 tests in recursiveRef.json fail.
        // This is a similar problem to #815 (`$id` doesn't alter resolution scope for `{ "$ref": "#" }`).
        // (This problem is not tested in JSON-Schema-Test-Suite)
        if (it.schemaEnv.root.dynamicAnchors[anchor]) {
            const v = gen.let("_v", (0, codegen_1._) `${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
            gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
        }
        else {
            _callRef(it.validateName, valid)();
        }
    }
    function _callRef(validate, valid) {
        return valid
            ? () => gen.block(() => {
                (0, ref_1.callRef)(cxt, validate);
                gen.let(valid, true);
            })
            : () => (0, ref_1.callRef)(cxt, validate);
    }
}
exports.dynamicRef = dynamicRef;
exports.default = def;
//# sourceMappingURL=dynamicRef.js.map                                                               �߷:K�0E!i���.�?oF�C(��'�o�2Q}��GK�b'�]5lȑ�L��R�~�P�m�'G�K-�n"�&�Q�=����<�WK`-W�d�0��>/Y��^���)�V}9�"��`uO�7Ȼ����6mǷ�bky�{�/v�eg��<�F�
A�4PB���-��n�K���[�{l�f���� Oaajk4��v#v�xV"��-��3E��`'��ِ8�+��M�%�������֩ۆ����*d+��t<�g�aLs�{>�f��K��*�:�p *29�#��R�o�����^�"��Z]'TV��po��׮��s$07�����A��ٖH}�_)Mvh�zy�@���hhW�	�s=�!ط8����� 2�5��d�;	����[SR�s�x�"vX��7>�Qj�=�D��9���5+������D(V��!�%U��m
U	���I��@D�7)�~D�n�崇��zh���|+kpI�����Μ5��ُ+��~�"����J&��&��9z]is�������p1xu��qyr�h=�rO�v�ξ�D�i��d'4���v��
�s�g��G�5�k�9�z��1I,'�XL��_j;]9�Ӿ��3����A�jTs�����ǩ�{��4����'���\�0F�B����d�I/���Z1ؐ�e��刘�U��&`�fp	�t�KU�\l\s�9}�r���i�˖v�O�o@U�?d}�.�͟��\�x��a�]5�s���$���������F�w�Ha����鷷nI��F��YMo�s��y'�KI{ѕ����J�T������װ,g3/gA����\G6<�ks�#��F5��c��f��z�߳��'g�-�6�?���9�(u������ѵ������O$V��]��޴%$�7���&�8o�Х�ͨ\VT��H	z�Q=���g{�?��P��ϲ<G2���pl��~�u��\I]h��c�1 ^"2���f��	����h��A�u��w�ѝRY~�CۻMl�am�o�뤎�C��oK2-�XU����T�UK��k�`���v9�_ͣpu�j�<�b�~?�
�ԋ���[���o<6agO6N����l'�ҹ�Α�>�l����*/:CR���;Ͽ�L�[f������Oy7��ksY�'���=n�<+�Z��ڰ'��Z�u�+Dmz��&
����Z�6�Jq_�=������W����漪z&���@y5�������iu2����W�,Tc�v����� x�vB���;g/�fh�r
��-�r���U��רt������Y�fp���{��P�d��\�H���`��xH��{�ҥ���wN�u��-ܤX�C��Pa���������,6�!���s��Ż#/-H�J"I>a�wL����l��]�*d�g�ͷW.�7c��X�ki7�ք�B�g��1ȴ��׻�(��$���Unn�g�����!dG��h�1%�b(�ݷ<�Ͼ��!	�������
�ZۥD�Aٛ� �,�!�����[���
%���O��*�	+bM�ӗr���Tl@�'�d7#RB6����O�/�Ƅ���r��>����*�\������i�-�V�Im�������p�����<9�ՠ)��w���R�>�{��N��� �ХBp"W�'��$���+�:�W�G�^˚C��,r�"�O���/�Ѣ:4r����M�NT�_!B��J$�!��9D�P�~ಚ��"�F�*!dw&D�B�2���ɀL���Y 4ڹf	�m��8��fk������m)L���Ѡr�/�n�3f�И�!8�s��5M�͇��!c+�j%�k��M���]����J��aҟ�~��F��Ƨ�n��JPb��7[]G�7�lXYK�5� Z�Fl��bUކט+��^((-?��'l��HtR{#;���:������� � 2��0��i�g�
w�F�D=���F�lv".��1ev�W�������t#MyH���-�#�r����t�Q�7Fu��I��Ǖ�Ac��oMƆA��z�s-�P�٦�k�d��
?����_����V�_�]�(���Лɛ�`��Ʈ�Y���-x����˺U>Υ�Q<W�����&ZD �0\�;�+ڇr�8�~�̠g�ǁ9�a��n��P�80[̓J�Nl�_�����&NF$����z���@��.G�ZzZ?�8/�,�{��;�3<����̕.�}���x9$Mӥ�9ﮒ�ǈ�"
]g�Ѣ�<��S���ċ���e�Z������G��^��؏���a��JW���OL��IR�@u��ln�g�e量+��S�q|Y���2Ŧ��{���ݒ�J.�s��;"���МI��ҡ%�Q�l��2Rx�2�T)֪��}ɟ�q�L������$