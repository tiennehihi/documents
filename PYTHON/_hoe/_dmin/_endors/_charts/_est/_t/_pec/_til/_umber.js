  default:
          i += 1;
      }

      escEnd = i;
    }

    if (ch === '\n') {
      if (mode === FOLD_BLOCK) i = consumeMoreIndentedLines(text, i);
      end = i + endStep;
      split = undefined;
    } else {
      if (ch === ' ' && prev && prev !== ' ' && prev !== '\n' && prev !== '\t') {
        // space surrounded by non-space can be replaced with newline + indent
        var next = text[i + 1];
        if (next && next !== ' ' && next !== '\n' && next !== '\t') split = i;
      }

      if (i >= end) {
        if (split) {
          folds.push(split);
          end = split + endStep;
          split = undefined;
        } else if (mode === FOLD_QUOTED) {
          // white-space collected at end may stretch past lineWidth
          while (prev === ' ' || prev === '\t') {
            prev = ch;
            ch = text[i += 1];
            overflow = true;
          } // Account for newline escape, but don't break preceding escape


          var j = i > escEnd + 1 ? i - 2 : escStart - 1; // Bail out if lineWidth & minContentWidth are shorter than an escape string

          if (escapedFolds[j]) return text;
          folds.push(j);
          escapedFolds[j] = true;
          end = j + endStep;
          split = undefined;
        } else {
          overflow = true;
        }
      }
    }

    prev = ch;
  }

  if (overflow && onOverflow) onOverflow();
  if (folds.length === 0) return text;
  if (onFold) onFold();
  var res = text.slice(0, folds[0]);

  for (var _i = 0; _i < folds.length; ++_i) {
    var fold = folds[_i];

    var _end = folds[_i + 1] || text.length;

    if (fold === 0) res = "\n".concat(indent).concat(text.slice(0, _end));else {
      if (mode === FOLD_QUOTED && escapedFolds[fold]) res += "".concat(text[fold], "\\");
      res += "\n".concat(indent).concat(text.slice(fold + 1, _end));
    }
  }

  return res;
}

var getFoldOptions = function getFoldOptions(_ref) {
  var indentAtStart = _ref.indentAtStart;
  return indentAtStart ? Object.assign({
    indentAtStart: indentAtStart
  }, strOptions.fold) : strOptions.fold;
}; // Also checks for lines starting with %, as parsing the output as YAML 1.1 will
// presume that's starting a new document.


var containsDocumentMarker = function containsDocumentMarker(str) {
  return /^(%|---|\.\.\.)/m.test(str);
};

function lineLengthOverLimit(str, lineWidth, indentLength) {
  if (!lineWidth || lineWidth < 0) return false;
  var limit = lineWidth - indentLength;
  var strLen = str.length;
  if (strLen <= limit) return false;

  for (var i = 0, start = 0; i < strLen; ++i) {
    if (str[i] === '\n') {
      if (i - start > limit) return true;
      start = i + 1;
      if (strLen - start <= limit) return false;
    }
  }

  return true;
}

function doubleQuotedString(value, ctx) {
  var implicitKey = ctx.implicitKey;
  var _strOptions$doubleQuo = strOptions.doubleQuoted,
      jsonEncoding = _strOptions$doubleQuo.jsonEncoding,
      minMultiLineLength = _strOptions$doubleQuo.minMultiLineLength;
  var json = JSON.stringify(value);
  if (jsonEncoding) return json;
  var indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
  var str = '';
  var start = 0;

  for (var i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
      // space before newline needs to be escaped to not be folded
      str += json.slice(start, i) + '\\ ';
      i += 1;
      start = i;
      ch = '\\';
    }

    if (ch === '\\') switch (json[i + 1]) {
      case 'u':
        {
          str += json.slice(start, i);
          var code = json.substr(i + 2, 4);

          switch (code) {
            case '0000':
              str += '\\0';
              break;

            case '0007':
              str += '\\a';
              break;

            case '000b':
              str += '\\v';
              break;

            case '001b':
              str += '\\e';
              break;

            case '0085':
              str += '\\N';
              break;

            case '00a0':
              str += '\\_';
              break;

            case '2028':
              str += '\\L';
              break;

            case '2029':
              str += '\\P';
              break;

            default:
              if (code.substr(0, 2) === '00') str += '\\x' + code.substr(2);else str += json.substr(i, 6);
          }

          i += 5;
          start = i + 1;
        }
        break;

      case 'n':
        if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
          i += 1;
        } else {
          // folding will eat first newline
          str += json.slice(start, i) + '\n\n';

          while (json[i + 2] === '\\' && json[i + 3] === 'n' && json[i + 4] !== '"') {
            str += '\n';
            i += 2;
          }

          str += indent; // space after newline needs to be escaped to not be folded

          if (json[i + 2] === ' ') str += '\\';
          i += 1;
          start = i + 1;
        }

        break;

      default:
        i += 1;
    }
  }

  str = start ? str + json.slice(start) : json;
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx));
}

function singleQuotedString(value, ctx) {
  if (ctx.implicitKey) {
    if (/\n/.test(value)) return doubleQuotedString(value, ctx);
  } else {
    // single quoted string can't have leading or trailing whitespace around newline
    if (/[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
  }

  var indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
  var res = "'" + value.replace(/'/g, "''").replace(/\n+/g, "$&\n".concat(indent)) + "'";
  return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx));
}

function blockString(_ref2, ctx, onComment, onChompKeep) {
  var comment = _ref2.comment,
      type = _ref2.type,
      value = _ref2.value;

  // 1. Block can't end in whitespace unless the last line is non-empty.
  // 2. Strings consisting of only whitespace are best rendered explicitly.
  if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
    return doubleQuotedString(value, ctx);
  }

  var indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? '  ' : '');
  var indentSize = indent ? '2' : '1'; // root is at -1

  var literal = type === Type.BLOCK_FOLDED ? false : type === Type.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, strOptions.fold.lineWidth, indent.length);
  var header = literal ? '|' : '>';
  if (!value) return header + '\n';
  var wsStart = '';
  var wsEnd = '';
  value = value.replace(/[\n\t ]*$/, function (ws) {
    var n = ws.indexOf('\n');

    if (n === -1) {
      header += '-'; // strip
    } else if (value === ws || n !== ws.length - 1) {
      header += '+'; // keep

      if (onChompKeep) onChompKeep();
    }

    wsEnd = ws.replace(/\n$/, '');
    return '';
  }).replace(/^[\n ]*/, function (ws) {
    if (ws.indexOf(' ') !== -1) header += indentSize;
    var m = ws.match(/ +$/);

    if (m) {
      wsStart = ws.slice(0, -m[0].length);
      return m[0];
    } else {
      wsStart = ws;
      return '';
    }
  });
  if (wsEnd) wsEnd = wsEnd.replace(/\n+(?!\n|$)/g, "$&".concat(indent));
  if (wsStart) wsStart = wsStart.replace(/\n+/g, "$&".concat(indent));

  if (comment) {
    header += ' #' + comment.replace(/ ?[\r\n]+/g, ' ');
    if (onComment) onComment();
  }

  if (!value) return "".concat(header).concat(indentSize, "\n").concat(indent).concat(wsEnd);

  if (literal) {
    value = value.replace(/\n+/g, "$&".concat(indent));
    return "".concat(header, "\n").concat(indent).concat(wsStart).concat(value).concat(wsEnd);
  }

  value = value.replace(/\n+/g, '\n$&').replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
  //         ^ ind.line  ^ empty     ^ capture next empty lines only at end of indent
  .replace(/\n+/g, "$&".concat(indent));
  var body = foldFlowLines("".concat(wsStart).concat(value).concat(wsEnd), indent, FOLD_BLOCK, strOptions.fold);
  return "".concat(header, "\n").concat(indent).concat(body);
}

function plainString(item, ctx, onComment, onChompKeep) {
  var comment = item.comment,
      type = item.type,
      value = item.value;
  var actualString = ctx.actualString,
      implicitKey = ctx.implicitKey,
      indent = ctx.indent,
 