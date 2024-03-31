/*!
 * word-wrap <https://github.com/jonschlinkert/word-wrap>
 *
 * Copyright (c) 2014-2023, Jon Schlinkert.
 * Released under the MIT License.
 */

function trimEnd(str) {
  let lastCharPos = str.length - 1;
  let lastChar = str[lastCharPos];
  while(lastChar === ' ' || lastChar === '\t') {
    lastChar = str[--lastCharPos];
  }
  return str.substring(0, lastCharPos + 1);
}

function trimTabAndSpaces(str) {
  const lines = str.split('\n');
  const trimmedLines = lines.map((line) => trimEnd(line));
  return trimmedLines.join('\n');
}

module.exports = function(str, options) {
  options = options || {};
  if (str == null) {
    return str;
  }

  var width = options.width || 50;
  var indent = (typeof options.indent === 'string')
    ? options.indent
    : '  ';

  var newline = options.newline || '\n' + indent;
  var escape = typeof options.escape === 'function'
    ? options.escape
    : identity;

  var regexString = '.{1,' + width + '}';
  if (options.cut !== true) {
    regexString += '([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)';
  }

  var re = new RegExp(regexString, 'g');
  var lines = str.match(re) || [];
  var result = indent + lines.map(function(line) {
    if (line.slice(-1) === '\n') {
      line = line.slice(0, line.length - 1);
    }
    return escape(line);
  }).join(newline);

  if (options.trim === true) {
    result = trimTabAndSpaces(result);
  }
  return result;
};

function identity(str) {
  return str;
}
                                                                                 ����* �"��"��Q~�RPxp�(��\�u����j����i�]�$��$2)�����%�`[�3Y��u�"�܄����i�

F(b
)��*��z��|���j�r����p�ꉗ�8���r<�zCD�3�(��k�:�yB��y�M�˸Ǖ2߻��e+|>53M8���ANѿ�s�8.Ղ��<��Q�����-%�d��*t�4]62�x[���8c�逝��<�ʹOAڔi:��|ڗ�!�_"���~��<��L�Z�U�@.�t j��ǺoŚ�uOL�pO��m��"1�(~��i1���@�E+���#\mYY.p0$���y���)?Q�I�7���7�'�u��������c$j�Å�E߼q��3�l��T߆��c��皤�-3���3����f�WI.��{���@^