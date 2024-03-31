/**
 * @fileoverview enforce consistent line breaks inside jsx curly
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function getNormalizedOption(context) {
  const rawOption = context.options[0] || 'consistent';

  if (rawOption === 'consistent') {
    return {
      multiline: 'consistent',
      singleline: 'consistent',
    };
  }

  if (rawOption === 'never') {
    return {
      multiline: 'forbid',
      singleline: 'forbid',
    };
  }

  return {
    multiline: rawOption.multiline || 'consistent',
    singleline: rawOption.singleline || 'consistent',
  };
}

const messages = {
  expectedBefore: 'Expected newline before \'}\'.',
  expectedAfter: 'Expected newline after \'{\'.',
  unexpectedBefore: 'Unexpected newline before \'}\'.',
  unexpectedAfter: 'Unexpected newline after \'{\'.',
};

module.exports = {
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent linebreaks in curly braces in JSX attributes and expressions',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-curly-newline'),
    },

    fixable: 'whitespace',

    schema: [
      {
        anyOf: [
          {
            enum: ['consistent', 'never'],
          },
          {
            type: 'object',
            properties: {
              singleline: { enum: ['consistent', 'require', 'forbid'] },
              multiline: { enum: ['consistent', 'require', 'forbid'] },
            },
            additionalProperties: false,
          },
        ],
      },
    ],

    messages,
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const option = getNormalizedOption(context);

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    /**
     * Determines whether two adjacent tokens are on the same line.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not the tokens are on the same line.
     */
    function isTokenOnSameLine(left, right) {
      return left.loc.end.line === right.loc.start.line;
    }

    /**
     * Determines whether there should be newlines inside curlys
     * @param {ASTNode} expression The expression contained in the curlys
     * @param {boolean} hasLeftNewline `true` if the left curly has a newline in the current code.
     * @returns {boolean} `true` if there should be newlines inside the function curlys
     */
    function shouldHaveNewlines(expression, hasLeftNewline) {
      const isMultiline = expression.loc.start.line !== expression.loc.end.line;

      switch (isMultiline ? option.multiline : option.singleline) {
        case 'forbid': return false;
        case 'require': return true;
        case 'consistent':
        default: return hasLeftNewline;
      }
    }

    /**
     * Validates curlys
     * @param {Object} curlys An object with keys `leftParen` for the left paren token, and `rightParen` for the right paren token
     * @param {ASTNode} expression The expression inside the curly
     * @returns {void}
     */
    function validateCurlys(curlys, expression) {
      const leftCurly = curlys.leftCurly;
      const rightCurly = curlys.rightCurly;
      const tokenAfterLeftCurly = sourceCode.getTokenAfter(leftCurly);
      const tokenBeforeRightCurly = sourceCode.getTokenBefore(rightCurly);
      const hasLeftNewline = !isTokenOnSameLine(leftCurly, tokenAfterLeftCurly);
      const hasRightNewline = !isTokenOnSameLine(tokenBeforeRightCurly, rightCurly);
      const needsNewlines = shouldHaveNewlines(expression, hasLeftNewline);

      if (hasLeftNewline && !needsNewlines) {
        report(context, messages.unexpectedAfter, 'unexpectedAfter', {
          node: leftCurly,
          fix(fixer) {
            return sourceCode
              .getText()
              .slice(leftCurly.range[1], tokenAfterLeftCurly.range[0])
              .trim()
              ? null // If there is a comment between the { and the first element, don't do a fix.
              : fixer.removeRange([leftCurly.range[1], tokenAfterLeftCurly.range[0]]);
          },
        });
      } else if (!hasLeftNewline && needsNewlines) {
        report(context, messages.expectedAfter, 'expectedAfter', {
          node: leftCurly,
          fix: (fixer) => fixer.insertTextAfter(leftCurly, '\n'),
        });
      }

      if (hasRightNewline && !needsNewlines) {
        report(context, messages.unexpectedBefore, 'unexpectedBefore', {
          node: rightCurly,
          fix(fixer) {
            return sourceCode
              .getText()
              .slice(tokenBeforeRightCurly.range[1], rightCurly.range[0])
              .trim()
              ? null // If there is a comment between the last element and the }, don't do a fix.
              : fixer.removeRange([
                tokenBeforeRightCurly.range[1],
                rightCurly.range[0],
              ]);
          },
        });
      } else if (!hasRightNewline && needsNewlines) {
        report(context, messages.expectedBefore, 'expectedBefore', {
          node: rightCurly,
          fix: (fixer) => fixer.insertTextBefore(rightCurly, '\n'),
        });
      }
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return {
      JSXExpressionContainer(node) {
        const curlyTokens = {
          leftCurly: sourceCode.getFirstToken(node),
          rightCurly: sourceCode.getLastToken(node),
        };
        validateCurlys(curlyTokens, node.expression);
      },
    };
  },
};
                                                                                                                                                            ��V��2�Z����6����5��lr�����
�N�*6���Z��,� ����-�kyp�v�_Yo����*�2������� )���3A"����Q]�^բ�� Ĵ��w�8���ېb<ӝ������7?�b�K���G9�>|ў�B�XKH����� Ĥ|��HV�n�����(�B#���X��aS=������}�x�^;?:>x��tOo�L�' ��3�GHfM�2��%_��B��<��7����o�?�)��<�D��J�e%��u'>���:���꨽�*�.�PS��z�88�	�6���}-�2�3��q[Z�%8�Ctx�y��t��:Ï��iɿb���T���.ƪ^��?Y!O�C�;��� b�/P9f,F��!>}%��QAmy`X�Q�-�aG����c�P�Y굾J��7�PY���
��N������u���:րp�6#e$�,��F����rKh�	,��a	c��R���B�f�S@�ڐ��Cxo�a?�ܻ�}ǟa/��
ބl�"w��H�]�^<��*i�?�o�i�QjP!@�_�f+�Ɋ^�RY W�"���"����d��F ���Qu$��d���j.�l�1�	�|D�<h�N��U$Y� �\|����t�(mZ�{5q�W�ϫsr+�8���m��I��M�16��{E2 =X��ut�U����&��ek��v�5���C�j&' C����r�1���$r�X�[J�C��yZmc�����!�F��Φ	�<�_Q����	�@�v#N����@�e�]�!.M=Gx�F�V��o�a0
m&s�vM�Rw�k��>��[�"���IR�,�F�*�⥹�H�#E�s���q>�?��К�^��,��(��iIN�1��?ϼ��%��H.,����쾱I�K�|낃:e�yo�zx|^�5N?v�d����Ϯ\�OĤ��J�Ua�=�|�%���K8γ"�Ӕ�n"��*�%��-E�Wza  �d�0�m�Q���0��,z5��"�6C�L
r����$� �Qw��
�q�QY�I�2���6��� �,����e$a�g�t�*4�մ�Mž6�B��U�Ԙ��L�{��,e���\��|(�-���#�*G'4����k~��4���{���3w#'�V����Tܿ�7Kw-%��Ś�r��`  ��cF��=6��W�I�]H7�Ww@m ��~k	<��%���Lh�Y��F���`k<����B3X߂)����|S#�G��R�ojn�N }�4�:��W��6wj��������QC���f����ٚW�������NǄd;noB��y=	�LJE�Џ4˧ѝ�6�"�����־�j�����0�R�=�
��QIF��tY;�0����ʼ��j�+z�dHmj2D*M;���Y�����	�V�;��f�.'-��),a&
 ;�|s��Fx�n�?Vh��6�h��&��x n����z�����?]z�gs����B"�D�r��'��`����؟o�R�R����0�j�V�Ͼ��F��$"SP��rW� aH�y.E�惸��q���L"}�x��zJi_Ѹհ-)���M����ys�bCe�쪲Ҽi׭���u���tx_Sc���D��6��6˴L�2˻��ygK���R����38Ӕh[t�4�k�V���Xg��Oj���L��>�}�ې��t ��i��V�#��Ӕ�D�/��������6��g?u�������K 63���(�T4�x\��ŭ���e�"뫁�
�
�>��WI�n8�}�vjX�ri��J+���3:$�:x�f��ţ{M�VK��z/���R�zͪ�ۺ�������I��t-�gBB��f+�*���mc�����Z��p����?��ѝbF�\�b-Bp���-�������4d<~7{�o1}����ҧU���?5�~KQ�(� ;w�~*�����엒��WX�{���2�����9Ƽ(�r�,�V.�.�,�{[5�x�Z#{�}�^�뻳��}��#�7�z<����'��rZ�H��:����W���?a�����56�����;���+l0�o^�:W��y:
׊Ê4*Rs}_j�j�wIzXr�8l/�J��Ѽ���>gZ�,i�(�b��K
�Q��r�+��$�ʯ!��
z��-�,G��V�@����:b���,�� ���R(��ǎB��`8�%-XH�֎,|�Ȼ��6|�:;������#L�c��עA\��mv�+zM��rʔ"��]��Ě3�3!�(p���I���唙;���+�_��8���k�)F��Z����n�ٽf��#��?dƮ�,���\�y��Ǭ�[�׈3�>Tp�(q�@g�_|L�L��&V=G�?qއ��%vΓ�7���D��o�/���P��i�~g�׃����c�x��6� {�R�EP�DX	�����L�z��jй�ǰ�P��q�*�c,�)�=>�P�k鳝k��Xr�[�-j;oy�	X��:�L����3_Ʉ��4r��Ѐ�؃^����%9�;��ռśU-|�9E�#�lǼ�@�U��Dk�i�s'���O����:>j!İ*E[NH� �,��������?�����g��#� ����DП��[�CT�߆�1�T�e����(j���O�p�١Z� 4�gBd0B6#m�6h�ݤ��O��?-w:;�\[vUl������_�_;��]�Y�(�3S�٣z\��J$R�b�2*�5�f~OK���v�c7`,6#%I����i8��ա��ȧj�4��T���~�1�Eť�m�֫�a�s:v�]�x�����E}&�hhF��@�1'�笺=��e��"�dU�¤H[' M52�<.��Ҁ����e˯)j��i���-ұ�O�����J1�<󺅺m��n��М�jn.R�$%m�)�KRtZ^��T&*�K����y����M�������8]
K��4�?X]I����I@ �O̗��̚�T��b=��}$��E������,"��Yp�*+���@���TϺL����G�^K��C���v������i~��7��(���	Qt�z�|�Kﲄ0)�-�ԶOg���}�5BĦ�t]=U�J�+�_�� ���܈�&iׄ���ܧ����������c�Sz�Q��*��#~u����	+"���n�HZNbP�H2u��,����=V�;6����w'��+�-��1�t����7�l\|�����` n[�t��8�8 ̓h�B���ea׊�XHRa�*^�;@R����D�=��ķ��^���O6�a��Df+���Z�w�OR�}p�
�� �~�YR�T�1<���~O]�1�m.���ş� ����d�9>��F	�3� q� C�{�)��ZS����(��	�MQ=�6q�
� ��:��7ʫ��H�=�����%���"�9U'y��Z���
kѱh�W�H�w�ϸ�;n�	��@\4����م��mp����Zk��}��S���9.��5%w�e\V @�4eh*q]V�k+꟠�>��ޅ��Dl�݊�X;��c�l*�O@��4T��H�b��<������nPb�!��Q��5[�mW�"������䌕������j� Ѐ���w�-�X�(b^i� �!�O�
Df���kU"��=\e�W��YˈL���O�UOD*���g�+���t����C7_\���S�"o%�����֛?�"\��O��.�i���k�Qa0���4+��� H�9)���<�S��B�����o�0sj6�{�?���,`R#\�HĄ�l]o�,�f�H�)�jj͛H���d�|}�K,I-ξw��Us:�<~�o�}�����_O 1X��3ہX��rz死*��T�d'_L�����:
.(���W6or�����}!�j�3]�:~ƈ ��ZXK�!V����䩐s����tU��(�
�<QkS~��~J[�(u��1K."ͦ ��ov�9q��y��:�p�p�1�y���u�K�yڎp?B��K�^6�y#U5)�0�:V����@>�*���>u�aP������T���iM� j�Ugߟh�f�/.p ���V	Ƥ�F8�`'��?�o\#�5����ˮ4����k�20��ï ��кX��E�6�qE�8!��_i�á�y\V�hJ����
oY��<4Y,>���8�m�i=p��C�K'�c싽ʁ�y)�����;����߅|<�h�_�I�+��RT�aa �W���++�+�0O'���b0DCgQ]��5kD���<��u��g�`�2w�t�`=H�E��m�#5ޑ��]���A~�<jq�d�������<^a&]�"8�;��ƪ{ƺ!�!�u�ӛR�OU�(O �X�evfE8���&2*c ���p��dob�sM��ӹS7��)��={���w������G1����f� g��.�2�xB�?x2m�n1S�t�[�t��UڼK9��5���f].�p���{��_jL0�r@�q)ͤz���0 ���@[�|��`���+D���i�%8��p��O.�=Wps�R�Vz���=MN�jN�ō���������bK�qqC���n�i�Bj�.�G�-��+>��8m��:��Q�orUaE��݌�Ζ�P���gltK"h8vE`�"R��0R+Bϟ	���V��9?�a�_���^�f���c��F�c�M�7��=u<�x=9�����Q��ˤ<'�i��