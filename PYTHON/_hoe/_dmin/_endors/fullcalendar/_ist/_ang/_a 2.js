"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildChildren;
var _index = require("../../validators/generated/index.js");
var _cleanJSXElementLiteralChild = require("../../utils/react/cleanJSXElementLiteralChild.js");
function buildChildren(node) {
  const elements = [];
  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    if ((0, _index.isJSXText)(child)) {
      (0, _cleanJSXElementLiteralChild.default)(child, elements);
      continue;
    }
    if ((0, _index.isJSXExpressionContainer)(child)) child = child.expression;
    if ((0, _index.isJSXEmptyExpression)(child)) continue;
    elements.push(child);
  }
  return elements;
}

//# sourceMappingURL=buildChildren.js.map
                                                                                                                                                                                                                                                               0��씡���1N�7U~?�5�K�X��荕�-�^]3պ�pk�0՞�Na�a�Ae�������<W��>KA�&[���|���g?���,B-��L�޺�~@�Ԅf�;�LKveo��K���'#�Rߏ��~ w�[�EA�z�鿂�����Z?�(i��TS�o��k%L���Ήǜ�w�)2G�pm��̏��2R���5f�Td`��a�.u.�$�>���g¯^��[�rT�	� �F�]P�|��yo^�|O��s�33�@�+�O�/ƾ�^ɵ0<?N�7�m���&r���<1C��)��.�\��e�G�]�6�|����&���*���aAQ,Kd�L���Np�a%KR���8�讛g��x9�y}Xa�����{Ǻ]���5�����!:xU<=R=S���L�D�<�2��"��)��\�=nSEp'~��=�� ]5Xn3��O9xK�4��y��cP��Ir�Xѐ*��ڜ|Ӻu@)AR����7�`鴮=[������!aqʻ��#48-[v�EeI_;�2Ŋ�(����0���-��nd���q�A���aˈ�v�t���1-B�2��@-���XQz��XD�ʍ��4�Ww(�(�����l\�&��h䍋�РQvK�u���f&�w[�;�T!�P�O��*�����"Fg_��^��V��׵���4	D8�Zq�橋:�P!4>$xu�|��Wy�����?%|%BrܨOJ�ټ� ��?;��?w�O��d�g�6S��Vf�V��"�:�:D����B ��v��x����P�����B��+*N�@�M�����ҕ
O=��0 �0ROp��UxR�v�:�0�BI�.C�E���S����d���AS���N2���R+B�F���{*��VE>r���x�V��Ҿ,-_*�>�����t�~�m�1A�~Ǯ�/Ь��:h)B��q��fըծ�/������S�&]	OG�-�s�����Px� �6�p4m��i�G��P�bʼ�QƻB��V��/�E�g�f���I��3k.[^��9h�R�ZnǴף%���ƾ,��o�R��4UD!���$�J���pO�y&D�iT���PRc�ব"��v�"<�K�������'$t�/+��8<O��r�8,~&��� Z���=���_7@�x7� X
�c	!���*����!�G2�i+J�T�!�_�3^��J�I�"�-�<�Q���NO�UR�¨Rr�a}�ԛ����|�p<Ov����@�쏉�F���U�0K���l���p�k��?���ټ���P�!��j%;���`�K�q䀣\ACG￰�C��؎�rO��V�]�Io�&E�N����U��f�}8�GG�b�����#�/o��	��7C��2�~;k����?�1�(������)dM׬�X�#�3QȲ��rV��V�!O"��[�wl�m5�It�����І�^aHS��B"�/���/�f�EԬnӧ����[�I0�B�RW�2q¤�φ��@���e�ϸ�g�CQr��?����P�T;q�|��Դ�b�Ŷ��k&�O$D_/�5�ːi��v�#�4DI5�����%�"���Z�mc�g�/m�2�i��H��U>���`���Ӊ��LNI�Yr���O&���q�.8�� �ﰃ
�f�y�`���s����|Ym�����۾�� �V�ME�u�����8��5IdU��2L&�����<��l��6�A�1�E�߈�J����ɟ�t�������Cٛ�����R�6¤�TO�	xV����N/�:�%�2��!�������.�z_�H���yc�G�-�E��Rs3�e�7j<2g���|G�