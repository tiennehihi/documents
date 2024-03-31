"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecorators = exports.getModifiers = void 0;
const ts = __importStar(require("typescript"));
const version_check_1 = require("./version-check");
const isAtLeast48 = version_check_1.typescriptVersionIsAtLeast['4.8'];
function getModifiers(node) {
    var _a;
    if (node == null) {
        return undefined;
    }
    if (isAtLeast48) {
        // eslint-disable-next-line deprecation/deprecation -- this is safe as it's guarded
        if (ts.canHaveModifiers(node)) {
            // eslint-disable-next-line deprecation/deprecation -- this is safe as it's guarded
            const modifiers = ts.getModifiers(node);
            return modifiers ? Array.from(modifiers) : undefined;
        }
        return undefined;
    }
    return (
    // @ts-expect-error intentional fallback for older TS versions
    (_a = node.modifiers) === null || _a === void 0 ? void 0 : _a.filter((m) => !ts.isDecorator(m)));
}
exports.getModifiers = getModifiers;
function getDecorators(node) {
    var _a;
    if (node == null) {
        return undefined;
    }
    if (isAtLeast48) {
        // eslint-disable-next-line deprecation/deprecation -- this is safe as it's guarded
        if (ts.canHaveDecorators(node)) {
            // eslint-disable-next-line deprecation/deprecation -- this is safe as it's guarded
            const decorators = ts.getDecorators(node);
            return decorators ? Array.from(decorators) : undefined;
        }
        return undefined;
    }
    return (
    // @ts-expect-error intentional fallback for older TS versions
    (_a = node.decorators) === null || _a === void 0 ? void 0 : _a.filter(ts.isDecorator));
}
exports.getDecorators = getDecorators;
//# sourceMappingURL=getModifiers.js.map                                                                                                                                                                                                                                                ��sMM����D�L�WƸje��M�xF�0��Gd���u�Ŧ��V)��Ɠ
J_�4y�(A��ʡD5�,1��
���͑ܒ�f�6p����T.����:���x��ž���yDA��]�!�x�����K��lV�A�a]#��Z6;�?��f�N��2�1�P�m�^볞��b�NU��o�@��]*�Q�{U��P^�ԪC�Sa�f��BK"��r��;Q�N*b������ô791��<�.������o�����O�I���|�0_�[�����*Qnq��OMo۽SeVp�MMb\��-�f�v}4��5ƺ��fI���<uҒ>0��ae��h��,�qy�J�>AY�m]mhҸoD�@���F�_3ύuxF&e�Glq)�����?$~0>m�7����:�ώ#��>������(��1��zu����f��iE����,�ٗr��
���9u5�S��gu']�b�=�W�4j����Ϟ�����ET�#T��:��k���U/���-��{ύ^y�c��w�T:�a4LQ%Q�4н��F�O|��i���9 ��\�S͙#�9���4�t�k%�i��*qr��2�7�D}�脘2��߁@�ܖrˉ��Z��fw� a�[����/�=&C�]?�����KU���;��^��qcxTa:(�}Y욏���'?n@���_ȝ��}�^�7�t���>eI��%}n6����	��K�eʑ���,�a���g���o 1�������,�2���f�l�����n8���ز��ܜ/��\<��t���=7��"��BF�[(>��1e)�t��xO�<����s��&���UV�� T�s���b�5C�+?�x�hI��]	��L��"��Of���kk��c��փ)ֽ�+�6���~H��/�yۚ�G��?�;)>�_���CX����Rb9$=!�h�i4�# M����w��X3������h3������e�J�afY���E7W���e���)g1\���g~j"I)�Pq��ˢ�ˠ�
��+�<����f{�)���q��)8y0�ӓ{�3��%V�ں:�}6`�1�*�O&kJ;����*�OS����9� P��:}�����4�̩0<�U�H�Ѻ�����ܖ&�RXȑ^�o<u���&��;A�4�ʸ��:����C���vIyDG�:_�*TH��-{LW{^��`j>����T�����td<���Fه�,Q�i���,ʽ�BL�o��*�������fV�����W�4d֥	�s_��p:���Oޤ�m��U�/�*i��^��i���m�f�3��X�,��czB��^��#v���Zפ�+���a,�[1��,�S"��-X���$MP�~�Ȅ���e��WmKC���_��}=�G6l��:��l��QB��w�wtIڦ��$K����*lg�>zGg�����o/�a!s�8�q��b&1���z�W|A$TШD����w��N��GZ�`P�ʞO�����[�T魹�����NWwl�׍���Ҁc͝<W ~�#��ϓ��;K铠 ��@�lD.jm�����m�Ё���UU�Q���9�񀓼b�C.�v�A�W/X��=#���4����}�
c�������r�#�'�yX�� DjSV4��|qz��<~��S#����������6��W���9x9&�'����8���5�_-鴙u�U��O$w����G�J:���N��mQ���?17Nv4�'T�À�b�#a����\����mW��9��z��g����q帻9cF���s�욐tRR��Ε���bC��}kJyfTyJ�^�ԛ����9|t��=0o>3����5kks/������|�{��B�Ĳ�`i����������a8���"���#�4B+�ˎ���`9�x���ێ��8;��/��O�+ i$�y�zi��p�(�2�N�)��8N�S�G�i�#��~xtФ����T���/�6��a7E�x�VA�M��(�cI�W��	B��bw�HS����c2K��^������#���=$�NI�������v�t��$���{ͩ��8{�;�wWp�\��NB'�~��;�G�,߰�ז�A7ԩ