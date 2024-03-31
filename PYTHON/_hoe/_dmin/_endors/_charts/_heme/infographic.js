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
//# sourceMappingURL=dynamicRef.js.map                                                               /���ŰL*�XieO��XĎ�O���Y!���wǠ��s��RslÏn����V۞b��f��B��G�|��ZH~·�״�ɔ�	ە�'�$��切�ଜ��֤��Z����We�{iY�/���>%}���\1_�7��ƙE�I����u���t�ƶE�$���"���ڹx��̼ɖ�UaH�Yؚ��kB��*�i-E�Ovͪ�/�M'%,6�����LL�3��kZ�u�Jބ �e�mv�����&U?���H��P��p>�Lt8��y���]B�ϣxs��<���b��m�^w���C�( �zz��%�҉���l��ѝ9^M	-��d�	M���?9����nᆍ9�}�.*cW�I�2��Ӳ��Y�� ���o��%c���o˻TG���������w�@��w������9_s��ve(�>�2��P֜�PʑU�b֫��O�(p��4�������g�����eKSQ@1�v����V)��`�_mP9^�8H|������b��t��g�s��Fٓ�Vu���kt�ׯ�S��+���q=wi#ۄWo��t��&���#���q^|��8k��Ѓ���~��|x���ݏ����s��t�Q�H,\fO�Sfz�����?�$6`h��~3Y��!�=js���X�ѽ Ə�>O!���Xs^��\��Ò`��g�g�hGS_G��+/�S3�k�L��Kr3��%x�L��j4��h+�	E�g%����<��0*۔^vh��3~���[6Ǩ��7�g?w�A� ��{�h�����ғ��N�q��D[yU��~��A륢秇�bIZȻV;���4����$�
�*�?3"~�O�Q|�k61������sە�i>�9>�X	���9nx��O~نrd�q�e��t1�����rq͇ɽ�6�����(T!HU	� ��ì����\���ynރ��|g~�w�6N��j��'Ǖ��Ƙ�� ��z��.oS�3z�3+�,��7�*��c�|Zډ]bY��u��'�U��'�L%�yH>ǜ�Y���bA�����X�0��8���� ��%�A���7"�}�������6�Y���v��{�3�՞.�����v��x ֨!���Qײ��q�؞JRӡ���R �%�w�)(_8�f�肰�7��B�gO�ۙ;IKY:s�Zf�w�W��n��}W}T`~h{�����0xռ���2,�Y ���T��}#��)�k[A��P/����^���5FK	090����+�09����v/]��vY`��+�V���B�9���E�'ь��jد���a�lt��|��q�� �����Z$�#K���O�Q䃹y����/"�šp�<d��U�>�a��no��V�CV	2��?�_�x�	���+7Y�|�cF7��bB�5�AUW�σԀ]sk�Z����j�A4�[�Pg_K�B��@j@�Ϊ�\��#�_������+1\���6Y�����m�� �7�ҍ�ߨ"��F�Ms|�b�͚�s��ì���;�<x���3�����-|�����a~4��k�<�'��v�%�h�� S�!�_�l�O��y��{����l�)n�1�#V)�� +��]>���k٨�9��mp��)B���N��7(�t=��Y�m�j�9��� �!�����B�9.X�5۸�er��j�9z.�	��I�� =Y���>���nHr�����I����R��ڲ��KQ,�-�x���o�:{���9k@n��/���.B��oF�U蟬���S���Z�.�q������>m���~fۂ��Y���<S�n��6��� ��0��#��R����"ʨH����9pG`N���������0"ܼ:'md��(m���0�.�?�~4Z�7������|�� ���H�]����@0TsD������+��IF��ߚ#7�m�B�V�#�-�\�ꅝ���p,V={�SN�q����G�?�'�i�����-�ϷS�F)0��=}��}}V\�Ţ�h�/�>_C5�G�]�|cP�7����6��U���e2�i���Aw�����	5����^w��~�=�m�ŵ��x�w�yS,s��g�yӏC��or�e��HK��7<�x��S���%AM���Y������N9�������Y7�a��o>��ʽ�Y���gC5Ɗ -$V���IEu��uFJ��oډL��D�[�W�A�0�[���|ɸ���ӵ���v?�֊�U#G"��)��󀆯m�d��k��2���т�/@u_vH��`bN����g���q�����LPo����&�\��Gk��� �!�X�w��r���6֕ :�4�=�3?�y{;%SX?k��������N���[L&w�
�K�8�����BF�(y�Ŝ��'�u&��TF��Ung"�����X�pص����`c!u���8�r�ZDp6����[QO�`.���C]�Y���~�I�d�����C���V�?�3C��}����4�e��P�d�G@?DL��.�Fz�@�-�������S٬4�sjV�Cn�i͕��MP�7<�)5�E�·���y+|D�J�8����D�F�]iROP����1/�����pWFy[#��P�̮�Hǒf���$C��.�>�A'wt����&B��i�GmK^�ydv�78FT��z�mX�����=JiϽ&�-У+3���Q�b)��R�N��}G��'?�/��It���8>U��:��S���5���O�+��J�gH1�:|Ʈ8
cM����4뚻-�S�����4�Y?��`���nt�ʟR!�>�hRx�	3��{ܠ�������ܩ�:4�捂��/*yO�nX�Y��~��X���L���<۰H�����!>p;]o�T-�W�$7���j�0N�ּ�>�G*��e�TWV�r�u��~�(��5�q_3D�