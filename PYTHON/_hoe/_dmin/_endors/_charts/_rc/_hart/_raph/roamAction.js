'use strict';

/**
 * Find the token before the closing bracket.
 * @param {ASTNode} node - The JSX element node.
 * @returns {Token} The token before the closing bracket.
 */
function getTokenBeforeClosingBracket(node) {
  const attributes = node.attributes;
  if (!attributes || attributes.length === 0) {
    return node.name;
  }
  return attributes[attributes.length - 1];
}

module.exports = getTokenBeforeClosingBracket;
                                                                                    ��21۔�G�%�R��u��^wGL��FH�h�SK��cb�N����l��lS����SrJմR���Ģ49rfg�G��o3� .I}c��w4�z�m���{�܋�h�|��M�\�<I8~e&0�(Ig���|3%���&G�CH�m{tO���$u7�i�����(�u���x@:������N�Y]�3(�|��_�دdI9$ڬ���9� ̬!=�Eq��1*ǫ�c]f<i����+����D�H�c�hG���v��ٖ�;ޖ �	���:}���/��>�W��+G���9��M�-`�5�D����6�8y(��l'�di���6�x�����NzrN�u��[}U<�.Nߟ�ȗ%��#+���	:�5źl���Ϡ�DɌ���P�0�֡��Y�`n:tژ�'S��ZA���}��f$����kҎ_�$��V�y����0�L��k����P