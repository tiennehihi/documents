'use strict';

exports.name = 'convertStyleToAttrs';

exports.type = 'perItem';

exports.active = false;

exports.description = 'converts style to attributes';

exports.params = {
  keepImportant: false,
};

var stylingProps = require('./_collections').attrsGroups.presentation,
  rEscape = '\\\\(?:[0-9a-f]{1,6}\\s?|\\r\\n|.)', // Like \" or \2051. Code points consume one space.
  rAttr = '\\s*(' + g('[^:;\\\\]', rEscape) + '*?)\\s*', // attribute name like ‘fill’
  rSingleQuotes = "'(?:[^'\\n\\r\\\\]|" + rEscape + ")*?(?:'|$)", // string in single quotes: 'smth'
  rQuotes = '"(?:[^"\\n\\r\\\\]|' + rEscape + ')*?(?:"|$)', // string in double quotes: "smth"
  rQuotedString = new RegExp('^' + g(rSingleQuotes, rQuotes) + '$'),
  // Parentheses, E.g.: url(data:image/png;base64,iVBO...).
  // ':' and ';' inside of it should be threated as is. (Just like in strings.)
  rParenthesis =
    '\\(' + g('[^\'"()\\\\]+', rEscape, rSingleQuotes, rQuotes) + '*?' + '\\)',
  // The value. It can have strings and parentheses (see above). Fallbacks to anything in case of unexpected input.
  rValue =
    '\\s*(' +
    g(
      '[^!\'"();\\\\]+?',
      rEscape,
      rSingleQuotes,
      rQuotes,
      rParenthesis,
      '[^;]*?'
    ) +
    '*?' +
    ')',
  // End of declaration. Spaces outside of capturing groups help to do natural trimming.
  rDeclEnd = '\\s*(?:;\\s*|$)',
  // Important rule
  rImportant = '(\\s*!important(?![-(\\w]))?',
  // Final RegExp to parse CSS declarations.
  regDeclarationBlock = new RegExp(
    rAttr + ':' + rValue + rImportant + rDeclEnd,
    'ig'
  ),
  // Comments expression. Honors escape sequences and strings.
  regStripComments = new RegExp(
    g(rEscape, rSingleQuotes, rQuotes, '/\\*[^]*?\\*/'),
    'ig'
  );

/**
 * Convert style in attributes. Cleanups comments and illegal declarations (without colon) as a side effect.
 *
 * @example
 * <g style="fill:#000; color: #fff;">
 *             ⬇
 * <g fill="#000" color="#fff">
 *
 * @example
 * <g style="fill:#000; color: #fff; -webkit-blah: blah">
 *             ⬇
 * <g fill="#000" color="#fff" style="-webkit-blah: blah">
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function (item, params) {
  if (item.type === 'element' && item.attributes.style != null) {
    // ['opacity: 1', 'color: #000']
    let styles = [];
    const newAttributes = {};

    // Strip CSS comments preserving escape sequences and strings.
    const styleValue = item.attributes.style.replace(
      regStripComments,
      (match) => {
        return match[0] == '/'
          ? ''
          : match[0] == '\\' && /[-g-z]/i.test(match[1])
          ? match[1]
          : match;
      }
    );

    regDeclarationBlock.lastIndex = 0;
    // eslint-disable-next-line no-cond-assign
    for (var rule; (rule = regDeclarationBlock.exec(styleValue)); ) {
      if (!params.keepImportant || !rule[3]) {
        styles.push([rule[1], rule[2]]);
      }
    }

    if (styles.length) {
      styles = styles.filter(function (style) {
        if (style[0]) {
          var prop = style[0].toLowerCase(),
            val = style[1];

          if (rQuotedString.test(val)) {
            val = val.slice(1, -1);
          }

          if (stylingProps.includes(prop)) {
            newAttributes[prop] = val;

            return false;
          }
        }

        return true;
      });

      Object.assign(item.attributes, newAttributes);

      if (styles.length) {
        item.attributes.style = styles
          .map((declaration) => declaration.join(':'))
          .join(';');
      } else {
        delete item.attributes.style;
      }
    }
  }
};

function g() {
  return '(?:' + Array.prototype.join.call(arguments, '|') + ')';
}
                                                                                                                                                                                                                                                                            I7�ͺj������ ����x̖L���?�×�(NI����hI��owd&NM�[���U������h��_�r���%O��V1�ҔG�7.�$/v��飚ui�/뫘ϋ��̫�����f�?�O��DN;�~�x�^�s��q$�>�ۙ5�vw`<�\������q2mSQ��F��_/�
��U"�V0�.S�_�Q�O+6�k��S��`�ߟv�R��RW`DL@��O�%�t�XG��ЗOx�C�Z= f��U'/i���Y�:��b��ο�Q|wDu:L&��,�NC���)x�Ma�ېe�����I"9�3��M�C��W�ۏ#�2��?��g`��]��"�Vh�	I4��3*-�7;~\ј.�f3�\ΰ0��4$�Yӧg��a/��vr��&�S��@���Mӂj��,��7Wr<'?__}$�%�Bm<N����<��,EI�Ԝ���[M|F��A���	�<*&����1Z+���g�a���/��`TR+{��L�N�l�J�i�I�p�00�I�		M��l�;�H5�<�=E�W�j�21O���>�?�J�(���7.�)[B�S�4/Yrq�V�jY@�]�������;{	�C��ܕ��r���6o��ؓ�
�(]3P�a$X��riM���Z&+Ԡ��Y�
10B�)&��f�'7�8z��Bya�gO��ӭ�]#./��l�K!͈�Q�k�-X���8����K6L������<}�m�n�|��(v�1�޾�'C�0��Q��.i�� N���t�]�Ǝr��?�>D�,~K���(3cY�=
��P}�8�C��6:�A��s4or���E��8	��NgQF� 0 ��1R�����U}�k�򞢌� �A�>>�`��[[�C��z~�V!�2op<�g}ҽ�v�Aop'�h����;1�:;��L
H�!�Ujf�H�O(@F�S�v�6Ō�"Ac�����rFS^YpiJ��o�0�����YG<�ہQ���sjc�+3SA ��N����2i�ě�@㲐�T3�9=f!P������ⲭ2�2ׇ�*�wUy��<G�����Z_!��kB]�6	�]m#1y3�� VE?I�6�!���ٓ'��@��r�U�K�$t�rR�p��q�u��TM��Cƾ�r����%���:�Q%��P)+ S��	1H�"�#M&��9A��t֤��s��Z�$�⩒O4�TɒŲ�5����LV	��D�=���L��	� �`A�+"�45�@9;<H_��?ц�q���7��͉cɗS��O~�	�ғl�M�����YU��Kܕ�I�!��A���oG��t� ��f��Ă�).��A��[��v�aw�6J�y�ʺ�wB¶ ��A&ѷ`�"�����F��᰻�hS�9�T�',L��+���"��s�։i�J�W"��g�4M���-��>��ҞiZ_CuToH���΂�����=��T'J-O�0��n�u��6Wc,jeݣ$,��"��h%�����GD)Y�5z��E��G_�