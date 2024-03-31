"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ariaQuery = require("aria-query");
var _jsxAstUtils = require("jsx-ast-utils");
var _schemas = require("../util/schemas");
var _getElementType = _interopRequireDefault(require("../util/getElementType"));
var _isHiddenFromScreenReader = _interopRequireDefault(require("../util/isHiddenFromScreenReader"));
var _isInteractiveElement = _interopRequireDefault(require("../util/isInteractiveElement"));
var _isPresentationRole = _interopRequireDefault(require("../util/isPresentationRole"));
/**
 * @fileoverview Enforce a clickable non-interactive element has at least 1 keyboard event listener.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

var errorMessage = 'Visible, non-interactive elements with click handlers must have at least one keyboard listener.';
var schema = (0, _schemas.generateObjSchema)();
var _default = exports["default"] = {
  meta: {
    docs: {
      url: 'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/click-events-have-key-events.md',
      description: 'Enforce a clickable non-interactive element has at least one keyboard event listener.'
    },
    schema: [schema]
  },
  create: function create(context) {
    var elementType = (0, _getElementType["default"])(context);
    return {
      JSXOpeningElement: function JSXOpeningElement(node) {
        var props = node.attributes;
        if ((0, _jsxAstUtils.getProp)(props, 'onclick') === undefined) {
          return;
        }
        var type = elementType(node);
        var requiredProps = ['onkeydown', 'onkeyup', 'onkeypress'];
        if (!_ariaQuery.dom.has(type)) {
          // Do not test higher level JSX components, as we do not know what
          // low-level DOM element this maps to.
          return;
        }
        if ((0, _isHiddenFromScreenReader["default"])(type, props) || (0, _isPresentationRole["default"])(type, props)) {
          return;
        }
        if ((0, _isInteractiveElement["default"])(type, props)) {
          return;
        }
        if ((0, _jsxAstUtils.hasAnyProp)(props, requiredProps)) {
          return;
        }

        // Visible, non-interactive elements with click handlers require one keyboard event listener.
        context.report({
          node,
          message: errorMessage
        });
      }
    };
  }
};
module.exports = exports.default;                                                                                                                                                                                                                                                                                                                                                                                                        3*;��ɟmx	�84��*�k�^P��ⴼ�d!��ǡ�ҡX�j�/�DOpR(ɋ�W��|�5uN.q���Uߧ���e�g���Y��ON��ې��i	i"��X2#4�cF�I�̏m��& �B,  ���9�l<��
{���T4{�P;X� `�'fG@�����  �x���� �p�u�R�2N���y2����b
��
"u-�s� ��'1�e ��C+�����҆��R`�Va "@ݺ�)+��ၖ��e%�;O���jI�jDj�g�/ga5�1�ZͿ��٨�u�^��$j�)����t|F��ڭ���`���v�Q��-��@���Ts�s�lC?���çg7�cof������bx��_�yY�+k��]�l�]`>Qi�h%��b����x:�%�)����*`08
Ll�#�� =H�Q޼+Z)D|�A��j���mb�S�K��,v(I�[�e��~$u�2bExw���f�"
��� �6�������I����)I�P�aU����>KPMTl�DX˚��]��R����p��^�?�R|��:;�W<{�Ԯ/N�1�7��07�����@���{!7��/�$����r�}� p��1��2��t]P�¿�>�" هD�D��] �/E%��8�n����36��Z0+#�u�`�(��єA }�T	ȻH,��'_�~VE����1�=��`K�#̷��}�1��/1Y`F����MC�l�/����R��ڱj�����y��ծ�3O��+n�"��k�zx��髴���-ۮK�N�?��g�n����
�e�$4+� �F_5;���9="�5��k*�!pƁ%ߋg���h��#�C�`a��	?�\�����E���7�<�8s��g�U�H�dl�Cn=WД�a�.$��lкT�_��A���k%��5�q����V���^�D	��I���s�DJ�)p�>� �N	q�]��=0|��,������f���Ƀ��l�ͥ�f=��NHrYBF�6�G��+�3�@�W�������A���:&�wͭX޶���L)�5��,�p��S��k�v��;���-�����$=L4���,g:;��AEh�!y�{�逥@�!Q�E�׶����d��GU��e�F{�[D���D�|�p2#÷�@Ѹ6qD�v9��qTd�Eі�)ȃ��х<lQVj�/����2<T�qc��A�8��<�x�k

��e�Gzn_W����sS���f�i� u�P[6����tt�������-<4��R,�����H�|v�3t)+�%}�Eb?�sH�z{�q��]U-�s�]�<����������軇����c�炠�u�处�7���Z:>�F͌�GQ��r���v�2c!��{��F<>����G�2Z�w{]���d#�%4�n�U�vP���'��?���@,�%��Y[|��:����1e�\��� uryt�99��|L��d����Q��5��Ư�7��J�!���
�O��wI�U@}��N��w$�[�*�	�����O���(#��r]39���p1�8�w7 P�e����x���:2fJn���QIQ$Fk�~zB�iЎ�G���'C��4��e+x�AQ��6mR��꘮oA�ܵ��b�n?��6��;��8��:/�7���ġRs�*O�@� :�)6Ώ\���/Fv��jw��ٓ������>���ɮ����ٰ�g�Atא�x����	��0r,���  ���.�)��,��FN53/J"G��SN͸�!��t*�8=3KR~��=�cR���'�ݫ�����ڔ����cg2�CC�G�|_ͭ$b�lZǉW�E?��1-Ws[���)��[��qHŉV�!�q?ɤ$Hgݐc7�Y��@�+N���۴��͡􌳈e��f;w�&�2,�9)�{(�Y�d[�.��p]�Ȳ��Sd(O�]�Ԝ���a4�T��:=l�A8Jm��,��-����yf����h��2������W��܇���t�UZ��`~1�O�@O����_��M�0�a����Ԃ���U�1�j�Ɠf[�O���Dm���H��GYsL�?ێ��MG!ii��� @K�G�YJ�DB�.��;C���|�y%	��M���Z;�P��ȿT����:�	��L�T��A�?~a���"�f�!�S�������,/j��6@��� 0�τPnw���F�l|0=�2�8"���N��^�1��4|JVX�����E�Q��f�@^_l�$6��$d���a�|�E���C�X����O��l_���G`�.`F��`{��[0CQ6;�X+Π��ݝ)�� �g/�5��?�!���	�D���s�w�ҁ}+E�%5(����`�W�GeH��\���'�3$�#o��0s��BYJ���z"�bWڏ�� js0B<vqv��=�?>��j9Qc9ß�cx��?̲�i��E�'��ÇM���t1�v����*����`3bi�]/�������.�W��,�c��<�Ѡ�㻰���R @�7Xjl��������3r����1�C�KC(~��JW�8�6r�o�\q���y�Y����c��%'�f����cHV�e�h�">�*z�}�>�H� ��kgDپle�2�C�7�����H���K� EQ"�E�[3��M(3���1+�9{2< ��"Њ��`}/�5S���QŮw92�I�N#�^��~t���V�8A��Iz��
"%%%G�|�Q��Q4A�Ҭ�-Y�Hn�K��������mB(}Z�lQ�p)���
�"��yG�����tN$�M���-dyH^���qB ��PF�9�֩H�\K9�� hʭ�S֘Z��t�
�_�������%2�Q���Hp蹑�ݥ�ro�޺ތ�2�u[����^C������Q*!����9�O0�g�Ot��7	X���  �(���աQI��'?��5�O�$<�ф���Xt�Nʮ�@jM��>̽���ݍ�����k Q� ��}E9�۝'k���IV@BI�j!�p�C(���*����v(4;��3��D��7D*Ye�x��t��N��Ni��A�$˯�?Y]ih�J[�f�nJC�&X�c��h�¡U�,"�P���n���y,!"��F�:*Bw���"���V���'xJV��0Y����V�}��78��+���/\������W���Nj쏨��eS #�UkcnVW6c��`�=�p�)�oJ�޸߽��t%��d��/?Y���1���r��:�`6�X���V\n���׮fY|S�?n�>����@|�JAV���2�EtxmSa��
�����]?�\.�N�G�*�GΞ��U�D��>Zf',��漉;EMU�9R4U���f��1�,��Ro�90s��㲖��hס%��~K57N�?��=��d���'7�Nf&���x���N۟����{�G�	��lr���K�Ҹ������:Ȁw��!�>��ܑ��y�%X��O[ڥ}H+��C��ft�G�$s�{�C��3mafBIԯ�ŬZ���v��V����4����I��X`� n���� �7��ƪ��@��m�R�y���<�>�l0����}���Sn���^?I�A�>Q�� ��2F�`�{Us�96��=�kQ��V{��9�G�gD_��$O(�On��)լ6}�I~,��}s�B�x���V�ٓ1S�Z+蛉M*X!�c�[��}��o�n'�_�bz��@|�]�/̄�IjEb�e����An�����3m|�u;��?mzs��f�k��Ք��� ������;F��Z���-�Ǖyݦ��L@���]�JFilы�}Y!o�av�h�S�!I04�����tɋ+��/*�P�I���e$�/�F<��o��$���_�
פc��>P}�O�������7��k�+	;y%2�"�� p���:�%�2%�
V��mS���&u�0g��{8鱚L��S�"%���U�Rq]���5�/�myv��I�:������,���Q=����Ѱ+G�(4���+�\�\�ޜ6�	���g1s��>Z��O;Ӭ�w�Mq��Y�%9���/mV�}d��D��۔��@�:�ã��pMC-,����Qq�M�0�x�^�_� ��h���{��r�4�����V�����ϫ��c�6�5��A8����A�lau�=l�ntLj���V9	_~�����hmU(2�'L���y~!b��q�,�l��������U�ř�)0��-�!�����$`pL4.Y��
{L�B�p��l�U����	�s3
��p�c�%��}^�t�]��N_���9]��8�룪�м>ڠ
Wk����1~t���G0Ȃc�D7R�q�Z�� �'9��wB(�޴uj�l�'w��w�z�P{�3靺DH�v�_i��'kI\���<�X�9:�qH�2\ ���Y���,o�K��|��/3}>�%W��~�ˡ�+pV����86!�+���.�rG���7���k!�+Ǩ�$�N�bA�/��$�N��O�ʵ9���/ �6'@�)P����T�\�G�UK�'��{ٿ��vu�a���_���d�����X�R�`R1�z�޽�U{�a�)�TƹR�G)�qH�~�3��bU+5����-���S�V�/:�����o������� -.�~�L�.Y<�ɀb?� �b�g�U��\ћ����/����x�m�4���U&D�*�����m�:p�d	� �ل�(�6��也�:)2PR0�b�勇��/���W�9Gm}�3夻����)���|nh�!�^��T���(��{����H�}��X�k6��x錾�BX��@�����Jt�XQvjn�z��_��d����CŪ"�/2cT�æ�X�Ѱ���e4�X��l�A��`��Rq�Z\�֠7;S�uc����}�*�*\�.^J��n)���u
w��~���IC}��56�͠\�:ȉ�B]C�� O�[=6bf�$Cǯ�Xp���	W�	E��7ђ�UCs��%����*\���