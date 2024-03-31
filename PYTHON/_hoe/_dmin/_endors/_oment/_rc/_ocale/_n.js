"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Require a message for `toThrow()`',
      recommended: false
    },
    messages: {
      addErrorMessage: 'Add an error message to {{ matcherName }}()'
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        var _matcher$arguments;

        if (!(0, _utils.isExpectCall)(node)) {
          return;
        }

        const {
          matcher,
          modifier
        } = (0, _utils.parseExpectCall)(node);

        if ((matcher === null || matcher === void 0 ? void 0 : (_matcher$arguments = matcher.arguments) === null || _matcher$arguments === void 0 ? void 0 : _matcher$arguments.length) === 0 && ['toThrow', 'toThrowError'].includes(matcher.name) && (!modifier || !(modifier.name === _utils.ModifierName.not || modifier.negation))) {
          // Look for `toThrow` calls with no arguments.
          context.report({
            messageId: 'addErrorMessage',
            data: {
              matcherName: matcher.name
            },
            node: matcher.node.property
          });
        }
      }

    };
  }

});

exports.default = _default;                                                                                                              9}�O�X��C!�U+u���Q#�n|�&+�4��{��f�HJ���V���~��U��`�n4��KaI���V��jP��A���juZsh��<�{O繞M�h:�-)M=}������UL���^�0|g�8|������J�z��_ɩx(��A��)�E�+}�E�݆C���C<�"!S�q��	}�\.2wZ��˛������iI5��h���(ێ�a������V]�~���
u%ܥF�S�*�&��8�?q��m���oR��+�/�N�~SPs�:��L��V 4����5`Or��ׅ�bZn�f��&�7G����bGaA�u�w����"��Ǐ}fKW��Ӡh��:V��w�g�7���Yv��*" ��]e��M�*�꬧��aN�o�VL\[����x����V��C��Ź�<�)|;�W�8������#�u�.���aJ&t��$��S�1�%�r׹ys��+*�D/�퐨~����T"R�^��	~U����}��-�+��m�µ�<�  .�!�R-��nEr*����c��vǃ��.8�G��̰!Ǥ��PO�+��U���&�sY�!�%]p.t��rD���|<\30��)��#L��ij��y9i���v��)k^�����`���0	� 5��j�("8f.?ܬ����0�2��EbRD�(x�٠]_�%������O�=���J�����)�+��<���Ѐ��`XN�$R=t�&��:���bO���,M�.��;}�T\�����SUR)NKl?��?������Ry��?/��߾�<��T �u|p9��wꙈ5ZG�Y�RO7oT�W8R�?���C$L��;ttA��\�g�9�z���w���E�$ʬO���.�w0{��e-7����0e��䃃���ZDU���S^�r�Ǟ˩8N�S=5xKG�LJ��
���a4U�v��oAD�{Đ�dI? e�� ��z����p$�ᒇL��p�Nx����Jh���\��
S�=��J���/JG�Ƿ0�8%f]����ʶE]�O�YT`j^�I�C-��Z�㕷q5���Ŏ�l���<��RZ�K�����D��|T�CT��S�W�������������i�T�{����8�z���'9�@0�����D6;a[����ƿL����Q{�릒��w��Pb��%PcMqX�Ӝ�z�cSDLQgq��z��r�N������pW���w�ߛ���?_Bb�ӷ+�S�jl���z�G#��\���!L�l����������~U���w������d:=�b�`�YO&A�"!�����/�̯�(K?s	@�U�d1�N>�*�������ס^��K�?Nar
�N�z�n��= \dX[�#���5؁�N��d~)d�ƘQO��]��������2�`�
�f�HS
=$�7�m�ӂ��J)ˑ�6X���d�a��3>��NKƞ%��|}<;H���,s=(z��-Zl�t�N��}8/�ܫ�.M�RM�{\X6����.g=�����r��a_R�9T%-��!n�J�a�^�E@�?z}F��������b38��@��r	ݜ{j�A �|��'r�tQ�>)7��ط���rf�n@��s�<M��OCJ�����#kTE8^T0�r��A��er�\�i����b����t���@86P�|�_
S�5jY΅�a��s?�R�M3J`Jj�l0?W�Nhb� 9�c�r�94���(*��VIy�    P�K���*���Xo0��j��.5���x�v'D�r4J�I������0hpj��t��/�ݻT�%.J�u�X�*}G���6�B���v���:E������J��x�g����)w8�ߥ��w�7o�26ܧGw���ҲRE�)u])�	̇$�Ɨ�2�kYH0�Y(�1_���*�}����&��x�4�Z!���4��j����	�mq4A�C�P:#���y��~P@J�b���F��r vd�5��Ƣ���k�3�'�LGp= Z�ܐ���im�ɱ�9�@���Z�����Τ~�os4��m=6��λ���?5`G�b�n�r�=�G�]�5W)
�9�e/T;}�~�(X��2K�~%����Y��|T��t�