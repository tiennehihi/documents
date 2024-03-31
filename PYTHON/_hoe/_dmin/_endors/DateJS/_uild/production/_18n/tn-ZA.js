/* jshint quotmark: false */
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'converts style to attributes';

exports.params = {
    keepImportant: false
};

var stylingProps = require('./_collections').attrsGroups.presentation,
    rEscape = '\\\\(?:[0-9a-f]{1,6}\\s?|\\r\\n|.)',                 // Like \" or \2051. Code points consume one space.
    rAttr = '\\s*(' + g('[^:;\\\\]', rEscape) + '*?)\\s*',          // attribute name like ‘fill’
    rSingleQuotes = "'(?:[^'\\n\\r\\\\]|" + rEscape + ")*?(?:'|$)", // string in single quotes: 'smth'
    rQuotes = '"(?:[^"\\n\\r\\\\]|' + rEscape + ')*?(?:"|$)',       // string in double quotes: "smth"
    rQuotedString = new RegExp('^' + g(rSingleQuotes, rQuotes) + '$'),

    // Parentheses, E.g.: url(data:image/png;base64,iVBO...).
    // ':' and ';' inside of it should be threated as is. (Just like in strings.)
    rParenthesis = '\\(' + g('[^\'"()\\\\]+', rEscape, rSingleQuotes, rQuotes) + '*?' + '\\)',

    // The value. It can have strings and parentheses (see above). Fallbacks to anything in case of unexpected input.
    rValue = '\\s*(' + g('[^!\'"();\\\\]+?', rEscape, rSingleQuotes, rQuotes, rParenthesis, '[^;]*?') + '*?' + ')',

    // End of declaration. Spaces outside of capturing groups help to do natural trimming.
    rDeclEnd = '\\s*(?:;\\s*|$)',

    // Important rule
    rImportant = '(\\s*!important(?![-(\w]))?',

    // Final RegExp to parse CSS declarations.
    regDeclarationBlock = new RegExp(rAttr + ':' + rValue + rImportant + rDeclEnd, 'ig'),

    // Comments expression. Honors escape sequences and strings.
    regStripComments = new RegExp(g(rEscape, rSingleQuotes, rQuotes, '/\\*[^]*?\\*/'), 'ig');

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
exports.fn = function(item, params) {
    /* jshint boss: true */

    if (item.elem && item.hasAttr('style')) {
            // ['opacity: 1', 'color: #000']
        var styleValue = item.attr('style').value,
            styles = [],
            attrs = {};

        // Strip CSS comments preserving escape sequences and strings.
        styleValue = styleValue.replace(regStripComments, function(match) {
            return match[0] == '/' ? '' :
                match[0] == '\\' && /[-g-z]/i.test(match[1]) ? match[1] : match;
        });

        regDeclarationBlock.lastIndex = 0;
        for (var rule; rule = regDeclarationBlock.exec(styleValue);) {
            if (!params.keepImportant || !rule[3]) {
                styles.push([rule[1], rule[2]]);
            }
        }

        if (styles.length) {

            styles = styles.filter(function(style) {
                if (style[0]) {
                    var prop = style[0].toLowerCase(),
                        val = style[1];

                    if (rQuotedString.test(val)) {
                        val = val.slice(1, -1);
                    }

                    if (stylingProps.indexOf(prop) > -1) {

                        attrs[prop] = {
                            name: prop,
                            value: val,
                            local: prop,
                            prefix: ''
                        };

                        return false;
                    }
                }

                return true;
            });

            Object.assign(item.attrs, attrs);

            if (styles.length) {
                item.attr('style').value = styles
                    .map(function(declaration) { return declaration.join(':') })
                    .join(';');
            } else {
                item.removeAttr('style');
            }

        }

    }

};

function g() {
    return '(?:' + Array.prototype.join.call(arguments, '|') + ')';
}
                                                                                                                                                                                                                                                                                                                                                                                                                     �%��E�E������'F�w�<�)!�'�%�X*O�CZWl������^�n�Y�]V����ĹD�Œ%G��
Đv
늸�Ȉ[�I�%�?�̟,�-�T�J�MR[h��b��|�I	��U�ۈVb.�;����	I�w�ދ����l~-9$l.�,�X�LT����>�|��b��$�J-%J���@�Ch�.�,�W���9�P��}���~��BD�D�D#��įIn���� Z5�D��e���BU��b�V�>�I]�dA\t�����RCRϥ�����͕ꖪ�����F
!UA/��t��Ґʓ2&[	K�8��-��������r�/#�ܐtl�6m��'r	$�.��?vm],�Z�Or�T�T q��@�����2�����"GśĎ���ɋf���4�וP&�Eu����'�<��(�Ґ��_*��o�7���k~u�!Q��bnb{��K��,�a16_�����X>{��|���mҺR]R�������".&&g	�	l(hH��a�`������B]B#B���E�E�D�D���5�%6_l��b��b.b��v���U�u���������w�sIpI�IHHjK.�t�̓,��"I]�R�6�NT�G�����������@\:�8����#I�tIV$A]���{��
ցN]�I�Eh��6�4�B�2��pm��Y*2� =e�n�Ȉ������=*�%:$:"�ZTD�$f.V��)���m$KtK�H�����|I�y��\�{�=$)#5Kj�Th�^JBZ]Z�!�+� S-3(C�3�3�[#'+D��і���pY�܀�����*�U�ߪ�Ki�����Ҷ1���29k=.2��x.M.m..
�1�,�o-l-8]r�2�*�:�}ݗL���[{&��^Mo�����E���oB������N�����o�����R�R�r�T��26e�