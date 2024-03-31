'use strict';

const fromEntries = require('object.fromentries');
const entries = require('object.entries');

const allRules = require('../lib/rules');

function filterRules(rules, predicate) {
  return fromEntries(entries(rules).filter((entry) => predicate(entry[1])));
}

/**
 * @param {object} rules - rules object mapping rule name to rule module
 * @returns {Record<string, 2>}
 */
function configureAsError(rules) {
  return fromEntries(Object.keys(rules).map((key) => [`react/${key}`, 2]));
}

const activeRules = filterRules(allRules, (rule) => !rule.meta.deprecated);
const activeRulesConfig = configureAsError(activeRules);

const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

module.exports = {
  plugins: {
    /**
     * @type {{
     *   deprecatedRules: Record<string, import('eslint').Rule.RuleModule>,
     *   rules: Record<string, import('eslint').Rule.RuleModule>,
     * }}
     */
    react: {
      deprecatedRules,
      rules: allRules,
    },
  },
  rules: activeRulesConfig,
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};

// this is so the `languageOptions` property won't be warned in the new config system
Object.defineProperty(module.exports, 'languageOptions', { enumerable: false });
                                                                                                                                                                                                                                       ��h�1����"ȑ4D�"uL&�ݖ�n�ezM���]�P`��fWp�6���b�T
��H�a��4����w��������`�m��	܇���	���r_�e�sh}����7���waH��Rs������"
o�U���&�AD���|�n��W�������o��:I�'W����o�K�Xy���`��k�ίa�p_�1��������] �_݄���C^�%�Q�6����A@�Z1̺�[�;�����w{-6���$����{����6��c�a�lmn��l7�Z����Pr;R<��W��&��U�d���-=��9��U��ȕ��xM�Βw\E�ևd^�L��v���=((xͷ��l8-L�lN4m{G�Yp��	�/�w敲�"�$�s�U\	f�P�`O��Xx��0��f�Em�'&�d�8F���4�	2��!^'����%<6����W��{jf�D����=�����4��ߏ��ۭ��v��̀�u��vۯ^����A+�������?�ŚG-��-b
~:���tY�ˬ6G�qv�G�vЫ�����I�}���vO���g��v���;U�
�d���>;�{����n�������GP�>��Ɏ��~{���E4�'��N/`ЩV��w�l�o��?r���^7�}ܥ�����p��#�{}����i��uPe��`�_��Pfw��v�������p@�Z���+ޯ�b�P?����n ��C�d��o�O�{�鴐ؽ��c{/�5�Τ��:�U^K�Y��'W��'�6�}��ݓ�~�sT�=�������[H�Α\N�N�- ?h�A��7�������M I��m��M0ц~��7�̎�W�Wp,�