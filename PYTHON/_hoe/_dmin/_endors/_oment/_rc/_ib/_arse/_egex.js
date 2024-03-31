"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _tokenizer = require('../parser/tokenizer');
var _types = require('../parser/tokenizer/types');







 const EMPTY_DECLARATION_INFO = {
  typeDeclarations: new Set(),
  valueDeclarations: new Set(),
}; exports.EMPTY_DECLARATION_INFO = EMPTY_DECLARATION_INFO;

/**
 * Get all top-level identifiers that should be preserved when exported in TypeScript.
 *
 * Examples:
 * - If an identifier is declared as `const x`, then `export {x}` should be preserved.
 * - If it's declared as `type x`, then `export {x}` should be removed.
 * - If it's declared as both `const x` and `type x`, then the export should be preserved.
 * - Classes and enums should be preserved (even though they also introduce types).
 * - Imported identifiers should be preserved since we don't have enough information to
 *   rule them out. --isolatedModules disallows re-exports, which catches errors here.
 */
 function getDeclarationInfo(tokens) {
  const typeDeclarations = new Set();
  const valueDeclarations = new Set();
  for (let i = 0; i < tokens.tokens.length; i++) {
    const token = tokens.tokens[i];
    if (token.type === _types.TokenType.name && _tokenizer.isTopLevelDeclaration.call(void 0, token)) {
      if (token.isType) {
        typeDeclarations.add(tokens.identifierNameForToken(token));
      } else {
        valueDeclarations.add(tokens.identifierNameForToken(token));
      }
    }
  }
  return {typeDeclarations, valueDeclarations};
} exports.default = getDeclarationInfo;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   �Edz�X«�GX�s��ߪ=�W�`�8p�hz�Jp��#4
 ��5:��9ʫ�"�D8#7�b q�̥5C��Gы�l%cPQ�� ��ma��S���7�6a;��DXlYg1��֠+*��j�/�Uf�X�ָ8�w���Z�x-�y��!O8kԑ.�����w���κ9I�b#���,hYA � P�)�y����U/�Mdz��Uk������M����L�"1�-Χ�ETGES1���֧���wbE��.@��X