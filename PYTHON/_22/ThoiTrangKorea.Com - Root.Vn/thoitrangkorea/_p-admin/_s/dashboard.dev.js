"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const _1 = require(".");
const requireFromString = require("require-from-string");
class AjvPack {
    constructor(ajv) {
        this.ajv = ajv;
    }
    validate(schemaKeyRef, data) {
        return core_1.default.prototype.validate.call(this, schemaKeyRef, data);
    }
    compile(schema, meta) {
        return this.getStandalone(this.ajv.compile(schema, meta));
    }
    getSchema(keyRef) {
        const v = this.ajv.getSchema(keyRef);
        if (!v)
            return undefined;
        return this.getStandalone(v);
    }
    getStandalone(v) {
        return requireFromString((0, _1.default)(this.ajv, v));
    }
    addSchema(...args) {
        this.ajv.addSchema.call(this.ajv, ...args);
        return this;
    }
    addKeyword(...args) {
        this.ajv.addKeyword.call(this.ajv, ...args);
        return this;
    }
}
exports.default = AjvPack;
//# sourceMappingURL=instance.js.map         }�9�������z�$�jL���4���%�&����'g� t�q��j��e�ٸ���P��mY̧9j�m����Qc���l�G����?ޑeZ(:���e��~��*y*@�m5r����́�\F�X�(EҺS*C�������Hg�đF�8�m ��K.��K��h-��]�΅�8�F��J�{~�4�2OM�Եw -���r�B�k�ό�8�������v��r�/}�hCe+�r+c���^��J,\"��_�x_�OFE�A�&R)K-����Q��1,-;I\�K2�Cg�/]$rʾQ���E�M>�Aߝ��{g_^�r�!�⢒ �y%�2���q4��'���-&��k��̘o�4{�?"�$�l��T�*�j��pK���F��8�Pt=Q�_P�~��4c������A����Q�b҇4U�@uZ�����%���eq<8����W��<V����E@�'	"'����y_:?�#��F\� ���L�M���'�� ����n�=��?�Yd�v����)��x!!�P�{��bn�"�ʑGz|G�F�4��������ݖ�&�S�Q�b�b�@�N�D��?}��~�X��	瑟��P�u�t&�Jģ���I��3c�o�����+`<ﲠ@���=�8V¬�C��/#~^Aq�^=������h̐K(L��B��9�0���96G��^p,���~p�	ř���C�t�!�ȥ��`3G'�p�Kڈ��"�c������@��Q�2z�|�Ghg@T\��@r�ّ3͍����Xҭ�/F5�C�����w{�R֣�� |s��?��լ��A�cF�����E����hx@C�۵��Gon�I����v.��6�i3��~̀:<�,A�n�5K���X�)tKC�h�y��U�=�3ʂc��z�	3͝.�L�G~jFm��Oh�Lul3��3�_f�B�T�H_R��G�S��KB�1W'�3�-s0'ze��.AY�`���)�����>��2Q��y��X�ݰȻ�_��N�g]3{|h�r��*�Pb\�2�,]������R�mi�Q�
&gĶ�)������D&@a��9�ȞR�K�9�q�DtS�V�r*�+��=���gIK\X3�l�����U�2|�ZԛC�!�����u�5�U�����<s�0�G�.2���7Y���+G"���m��~�뿄H��rH��'1�yPN[�<�鉰�f�<���J��Y[]�#'G�б�[��Et��L���:�z��-�c��A�Z%����$��ܵ$����窖9Z�����6qkY]��f��E��(�\�$6PS�F�x��Q���P��������/&q����<��&e��/Yv��>ax�`�'�.�ӝ����bE�� OR���ID���J ��t#��P�G�r}Ռ�Rd�V��qr_�`��lJ��ݚnzz���Tǯ��s_��_��p�7��6��4et����xau\a?���pFB0z]Y��D��e�5�JI�q�1��Gۤr���e�x�\;�a�uKÁ
�"c*rU���\ɔ��	���p�?B=����<t��s�<4�����u���/6����.�Iu��y��Pf�/	d�@!���3ޛ~,����n�^�����4RL���4��q��T��0qF��Ӿ�U����4���aV3�����~�;��PW�������� ����÷�1���4��{'ٰ��@ģZ<���$(��h�x3�������C��iÃ�R:
�{_�<ŋH��