n false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _keyLine,
      _keyLineStart,
      _keyPos,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = Object.create(null),
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;

      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }

      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      typeList,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockInde# ESLintRC Library

This repository contains the legacy ESLintRC configuration file format for ESLint. This package is not intended for use outside of the ESLint ecosystem. It is ESLint-specific and not intended for use in other programs.

**Note:** This package is frozen except for critical bug fixes as ESLint moves to a new config system.

## Installation

You can install the package as follows:

```
npm install @eslint/eslintrc --save-dev

# or

yarn add @eslint/eslintrc -D
```

## Usage (ESM)

The primary class in this package is `FlatCompat`, which is a utility to translate ESLintRC-style configs into flat configs. Here's how you use it inside of your `eslint.config.js` file:

```js
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,                  // optional; default: process.cwd()
    resolvePluginsRelativeTo: __dirname,       // optional
    recommendedConfig: js.configs.recommended, // optional
    allConfig: js.configs.all,                 // optional
});

export default [

    // mimic ESLintRC-style extends
    ...compat.extends("standard", "example"),

    // mimic environments
    ...compat.env({
        es2020: true,
        node: true
    }),

    // mimic plugins
    ...compat.plugins("airbnb", "react"),

    // translate an entire config
    ...compat.config({
        plugins: ["airbnb", "react"],
        extends: "standard",
        env: {
            es2020: true,
            node: true
        },
        rules: {
            semi: "error"
        }
    })
];
```

## Usage (CommonJS)

Using `FlatCompat` in CommonJS files is similar to ESM, but you'll use `require()` and `module.exports` instead of `import` and `export`. Here's how you use it inside of your `eslint.config.js` CommonJS file:

```js
const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
    baseDirectory: __dirname,                  // optional; default: process.cwd()
    resolvePluginsRelativeTo: __dirname,       // optional
    recommendedConfig: js.configs.recommended, // optional
    allConfig: js.configs.all,                 // optional
});

module.exports = [

    // mimic ESLintRC-style extends
    ...compat.extends("standard", "example"),

    // mimic environments
    ...compat.env({
        es2020: true,
        node: true
    }),

    // mimic plugins
    ...compat.plugins("airbnb", "react"),

    // translate an entire config
    ...compat.config({
        plugins: ["airbnb", "react"],
        extends: "standard",
        env: {
            es2020: true,
            node: true
        },
        rules: {
            semi: "error"
        }
    })
];
```

## License

MIT License
                                                                                ��S��c�4��^����4A�ch��#vbv5	�˨r�� ;�0�˨
)�����	���U��Dk���v�b~�"�Ǻ:�
 `QÁ�����D��3�dX]�r��8�����Z���Us@5k+/ޫ������^��=׭�y-R�?�wj���û�@j�F�>Á�Anc�R��L���#��h��H��,[e�ZZ3�
�:3�bH��}��L���k���l��YU͓c`b�9U1=8X옲u�W�������잿i9Y�}�=��J��_�5(��P��8��ࡣ��o	 �8�4m]��+L�xf"�8Ti0�l�,tq��Ӣ��������_��r�o
o�lP�^��_�[�����சÑɰ'���Y;r4?�}pX�.��A��γ�X.f�t���J�L���ڜ�<)<IK�|�V���Y��uBi�,$!�
Pd�5@�0Y�:|_����X}m�>���oY���Ɩ��l.W�m�4�����y}��xq�� �-1;Hu@��9��J�M|֪8(VpO��8�Ւ͛
*S�!N���Cc&%�Df�bg�T��Jc�����G�}I�`���a�%�$=%Kb�Bu��=̙�~
H>
����%�%�y2`����E�&"��5�T-*F�,~������A9GK��̇��*c�
��Q�5�;�l�w���ӧ�(�`䉎(��q���2Ea��'�@T���uA3���q�eN]�J(���� /{��?�Q��~��Sd쎭���`4L�
���Z�3�``$ ���g%%Qp��c9��Y�)^v�ޱ_o�ɬ���/�,���	�c�=/K�?O
���Ҋ�q�?~Z�b�V66μ��ͣubY,A�<>��hN]M����L<Z.�v�Dd6H,ƖP��5s�	�8b6:eQ�ғ]KT4X��[p*G^Nh��FݺD�#���.i�x8�b|�P�����⫺���=�ҵ��>���I��U�H���G;���M!ͺZ�(���
E6�^��o�0E�$�  ��0�D��ڨ;\��=E��?��R�)c]x���[�+\�MȨ;���*Ɲݼ��Z$�Ɍ����Ԫn)��Ӗ�*��aB�hZl���0L}b�a�Rp��Z�
�s8GoJr�^�5�i�~�n[�$����mB$�V�����7d�
�̓���a1J.�qlb��LDū��:�!�K�l���j���u����t_��mϽ�YH3{a�δؚ�5�IF���岤�,"r|���
[�n�
�P	���cc���_���#	zA�� �͕��Up�9)�ۦ�lNw)ˁ?���f,*�
W�H8�]�D�>�T��W=_j�=�-a�1�����I����(j)r_����%������s��U�ǐ
%��+U��d���r�S]kuo�H��w�7�h$����-�57>ڢ�
�bJA��C�BFamgd��$�� ��[Բ�[�2��xTM��k8�6ؘ.�C�cƟ?�<bxg�]?N[5�5���mhD��}�|�� �f�_}�2�)�k��?BjgLܡ���ƮR2-y�le�Z��(
7�+�媙�csޖ8���@�J�y�;�KU�1�վ�NyB���5PG�f�A���'��PQ8os�C����]�����# �e�LO������l���6��m3�����u�<�3R��t/���Xv�%�����U��I�]S81F`Y>��-�զGC��ӟ��<Fb�IQ��^��d�.6*a$
 @1����ި|�׬q����ǑwY����r��n�{x�f-��>o�Mc�|��1$Tj�DZg]�����QMc�C����z�fI$��x��Fԕ��z���[��{/�Hǵ�������%/��D��<��$�}����!���wvك=�����B�>�>�aP7H�Ѫp�ARfu7�=��������@��Lψ��?V�� ��u$���`8d(a+Zh�I�"���Z���4L���\��lG�mI�,�~��@Eb�r q$h�h��Ͼ�R�~1��ϷQ���YLqf��j�[U;j~��)������psc��m7�Ǒ�H��'9H+��HP�n���`a"Sm$���Kɿ0�i�N�c(
x@��%����� *���`:��A��N��Ĺ�<=�0�<��
ƒF�a���� ����j��ب�/�L�[7���7��Hw�	Z�
�.�I�T�p��R�a͉��K�r�*���5+�%���l�h����Z?AN���H,D��>��StZ�J����
��S���V��J��D5t8	"���q�#�
�E8�X��1���=@� ��W�.��8�((�,��u 	FeC�����s��y��ɉm�66�m�vc۶mۍm5��8mx�o����|f�k��{f�����O�`�4p��L;a��+(�zl��b5�}zb� ���O��E$R�[v\��������J���yDm��)d����?ťc�D�wcG�:�7U�\��[�`(���V���TgjF��*p��}�@��$u�ju'����/B�ۿ[:U�ࢩ>��H�ʋZ
>d�"U�0�`h��&1Q�p�Td��x����������bB{%��r{$�ͪ��ݧ��R*�G�2��ҝa%�P�V�Ѣ� ����J8 �P���W!V;U�]lt��4��@�*�_��H�g�����k�����X� �

J&���88��2�CeݐΕ���Fh��|q����/e}�&7�{�a�V��t������K5�0�X�Ei�l�zB�#M�&��PxТu\k������i��p+6����VB��z�cd�
~H3�
oĆB��f!� yಮזF�Ɠm4����䒡qBKٹ(=#������k�|E�S�.�����?_�U�����]�>��*���p0��_�	}�y���+�"�~�HM�.�h�n���{z*��Ο�9�m���RHHL`H���yTi�s�����R��B":�Y�P�d#�V-�k��O_���C��B�2�+��ܧb2��#tP @X���1TNt�_�!�����a���`Nc^ʓ��a�=�,���@fpI���r䌴��M"<F<�yUC���=S?<5�"�����*�ߒ�(b����դ��}�˻�w{�w�=Ǘ\��KyE&B ��@���U�%H%%D.��jAR��T5���m_=��5�y��
n�@� G��ə@�UXG�k��Y*� -9�Z �!�DH�n
g'6i��˄��A7���wޏ���4,#�Q��s�3Ki�@��8MY� �̝�|�ۛ�=@
t������3�,|A�E��Q!��h#W��yZ�h^熝�¿#2!
8&e)f+3bp*�`]���Sk�#�6�4EE2����|%���
�dL�T�aBb#^�$��ߩ�ʮ����`Ds|O_X͗�n ��8��@�[e��i�tf�,��pp�, IYi��Q����@���6�b���$�0iօ�Vn:Z��U��ʇ�7����9�g���.,-��ۡ�1�l�K��-���+/���v
[�_���=,�U��i�E_�{�o�:Ϥ�Q��s��@$�uQ;!��i8~�T��4�X�:a��+������+�0E%,�6�N9P"U�Q��n�ڨ"�T:r�@F�H�\�ƞH9�,ӥ���Kk�eOz8�5k��8��&�º^֤݁�]zP^_\��OG�����/��="�ŷ�X>~� !i�s =
'	� n��E��ͼ
8���> 2�R-Y���Sm�ی��*c�=q���Qҟ/���H��>�-�;�-4|�¦=���b1l;���
�ި^5���0����7��색�$���魍�������nkЫ�׀3ç�"�~���0�ha^��l���2�-��${�}bz�-�m�a`v
���:�G�8G�*VRU�S�1t�/_����sf�!w2W��I��U���/�ܕ�E�%C��JpgK1鼉r�Q::|,�Ƚڒ�����D�+��@�����xd�/��&u����m�[���<}�?Ezj�F�Ru���<�eЎ<2� '_9�FF���6_L����	Ճ_�����N�kW�o��t$�y9֓��ڤ�<��Gl��j���~��ʲ��������<��(Α%Z�l �3�<We?�'�th]`.���9�
m(<^B���)�4{�E���.V�E�;GB2<s�0R��Bv�Z�g�ߒ۪��V�۲�(t5 ��o�̩�yʡ�9i$Q!e��&�%��g�
/M��R+�iLf��ƙ kn��i^ *m-b4^YCTs����N������B�����x'H�{�m�l[ZP��Pr0��M������BJ�����ˮU��Z2OF0c�Sy��ΰ_G+�f-��JM8���{�ҥ����CC��X�J�}���XO�!��Sfy�F {QdBe~e�X�p%�%�y�}v����:��!����0�x�j��h��|�"Y��6Mݿ��Ҟ?4H+2g����Jm�����h��Cz���V�+g22	$iW֚�1��=�b����-C�+ �`7�*�M3�H�ʖ����[a(��t��"'QhL�Q�FKg�+�6��ؔBK+���ݖH�/���}������*l+/*��up�af�\jL��8��5�T��DDB�/X �e��� QH��7�
X&L�$,
����N�aU-�=NCQ�{�p��ɖ�D����cwi��Ze�/>O�]�Y��;=��J�߻���08���F��t+\���Rt�,��ew�G{�~�.�1Z{T��E����M��(�(P����@�r�<r�+���W��7�C)���Q"ÊW�w����, O2߲��w�8�Q4!�0���Qn���,G8�P��Ń�g��M-fI�]���7�J#��&'��Ke�����6"G0�I��]e��<pSS�9����K�����_qI��l��[mn{�P3I�d��x0���Ҡ*�f����d����i�SаJ'�J�P�Ë����uv}L����J�gjJM��g.���k��\�o��]4��KB�(C,�n\Y��N�L2�gO&i�A ̯����|T����O)&%�ȸ�xv<����Qy�{���6��H+��K�Q�62��i�Kޗ��4��p���;䮓�^ǚ/Yn�["�4j��EUQ֔xu����f �K�j;V���=���swJ*Ju|2�.�m��4�qK�4�
K�	!��Z�xz����!�H4O��CNi6�%� �A�,�~�4.���ܨ� �ۮ�S}(�.���#H~eg��F5��&�������0,���OIv��$�	#��ZB����n���k���^|"���QQ).
-KX�V��j]p,~O$υ�E��P�aՇ��>�1N�ɹ.Ԇ��@@�O��$I���ub���e��W�k��j�s@|��o��4-��3	��u'a���ew@����+�^��6+���Ep?]F7�$����3��4+b-L�$�?D���!BF	��]:Z˰�g��9��1�I��3w��U���^,�o�����7�=� _�n,�w6�匒�6��u4�w�H�˧��*���{�۠gǚ�x�؎'lO����1�G�(HZA
�(��QᰟzA�T���Dx�eq^r�0�I]~S[�&>�3�fU�H�sc2���h~����ۢ��x��!��+�}I��+�Y�s�4�c,��M�HJ�(j�j�0y��%��a�	��oC����ﭬ��%u͔���p�5�b)�ox�܁��A�������5�W
��aFBW^%��٤�h��,�X�G�gY ��+��
ih�����5��� 0�㺑�ar���[fx%o��AۺbɟP'��P�>Q^��<!
��3�c}H	��H5�i�Y��.�B�c�+�m�R�Ry������T�\F~4�]Ǽ����^~�H��44|0�#�&�e@Sv9�ʅ
Q�#�D�#b-�$�M�6H�2�J�x+�4�SNHG3�jiUŴF�[���e��n�o,�7��q
#�3�ƥI�r@�x��a����d�QQU�$��F2Y�E���V,�V�5|(�9��?�����?6�N\�K8��f+���NkU��B�'��5Ԓ,�[Sć��&��ӗc���d�u�����\�=�(zDf(�۬�f�2ho��OfH�4��Ck(5�����w/:L]i��t_�=-e34����*���ڛ*[D�F�cDN��*�d�go�f�]%���?� �U����]E.-"�K��a\%�w��k0�P��]O����h�N�0-$�T%��=�j�©ؕQH��FW��Ćʖ����t_�@����d�+M�fA������V��B�}��=P�mG1� ����х���uS2�j�%�_/Kֹ�e�+B�rg�i6ʳ��_>˩^���GM}�������_�n��U[�`��:O�:�Na�Dwn�E��)�8�K:]��ӊ ɪ��N�g�8�;�Gvc��-W �J�/T����F�q#4�Lo5Y��tA׆�/cf����ԉQ8�
2��?�����8��;���a'E7H��8�@��у�~J�^=�KA�I� {�e1HD̉��&�C�0�J��}����H��R�5�C�@Q��S���V30�Rvu�
}@�`H.���:T�C�͆���X<c|�r��x���xưh�C����Q&��L���"�p|S��@xCM�>g��^z�'!�'�������諸�ԫ6h�RM�:J�Hu��3��|&m��4<��q~�%V/��x�1�L��b�3��o@˰�j̤떤��Q��:���(a���SV_��5��孛���:�ţy�NM����U���g�����5zaP���DVU���h����x����%Ck��S��Ѭ��hn����2~|�He���Y����o��XZO��.|�X5(

^d��O���&��7J[�tlv��ps��E�N����Z	��5�w���:.����>��Z�>e��o�c��{��~_4���~�(�^��;�Uh�9�_����bX�P�I��RjR�4�+J.���=��h�L���d4z(��L1ҵ��P�M�`拆O rS��"��_�-(WoO�G[�T���	'�W>�4~Y=[��k�����(�t/]���z��
2vw�l4q��O�ܡ-N(�H,�隆KHmR�BN�V;�`S��p_���:�Z��d6|]�import { Plugin } from "../extend";
interface MinificationOptions {
    hex?: boolean;
    alphaHex?: boolean;
    rgb?: boolean;
    hsl?: boolean;
    name?: boolean;
    transparent?: boolean;
}
declare module "../colord" {
    interface Colord {
        /** Returns the shortest string representation of the color */
        minify(options?: MinificationOptions): string;
    }
}
/**
 * A plugin adding a color minification utilities.
 */
declare const minifyPlugin: Plugin;
export default minifyPlugin;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ���nO
��U�}�J6�-�U�Fo��ܔ�f	,��
[�%��H�'�ކ�I^!t����v�3m�89��OD
z^V����.� .sk�J�H��T�����'�e*��25�B�~e�48���";n�4[jŀ=�
��]�.�WWZ���{^�؞�`��N�����k������
<*h��7Zp� ���(܇ �f��@<ZO������:��h�x��D�Ao)9l���Zd�@  ���;>E��:p�Y�Ģ�p���qTOJ�p��z���9IƪӢA+]��)������������h�{3���
�Aj?��T:�����??���,��Gh3S�YP�P�*��c\�}������� ���0�@�9BR��Wο�?B
�����U��*�#�q�vFM���*e`�M�����<,���z���~�l�N�2c\ �=��N�M{
?.9Q�������!/㜎�l��?*�'��m"�@K#&a4>�k��NJ��m!��;?|H����Q�z�K(5�ܘX�� �-?
��Xi���K�@nð� �w��m��G,�=�U���	D򋠅ak٧���;��Q�(]����c
������'�2L����wx�o�h: ���u�?�6�Qq��:��r���+���Vy�x�g;l%.s�+��ո���,֬#45�8f?�hk��à�q�xrȭ�8)��ƹb� �/,��$X�ʥJ�P�Řr�M��,��\S�1m"
'*��k� 8��L�嬻�r�r֍�fŕꙬ�0�
�F(�TC��j3MwT��:|��Gy�n�N��w�\
c2D�zOYI��ZkH�I}�&Ðb���N������s���h�uO��mx|�J���Ɣ��[������:�d.�<d��m�B�J�;��~�ŧ�%/q*'��、�a웉�d7[��zv���l�
��4�� �.�U�[�̿ߢ��/���+�z��n\sAPP 0pP>"�_MR��v�إ�To�L���Msx��8�7�}%�w$�v�S�
�1��_@̰�օ �Xr��jXoH]�`�^,�}�%��T;Ք<
a���w�vk�rD���b��3��y7�&S�������hW|K4�%��̤i$����f� �'��ӟ��e������]#����8v�I��\��Db �[����Jv^m��V�ʼT!%�	 )����"R���Oj-a��$�Ō#Rʰ�>�����EL��:�m��
	т��dϡ��t����t����_YF����d֒��o��ъ��E�a�|��N����|S�9���Ӹ��(	Fح�d����		zS���XN��̍^�A�|RJ_ܕ�bb�lqb'�Ҝ�|_�ߧS�c��o ���g��9����޸0U
�B ��21��-���m,���I6����';g�и�]I�Q���4��#
��������K����k(��  P���#ka�����͜;���fX���Lu���En�-8�?~i�r[�/���C���[��8�Ì��ТM�����l 9Ʉ�a�Ц�ܙZ��2Oba\?�gu��t�H�N�ʍ)�*��c0fz�6��v�5UҨ
�K8��b�Qc�C<E�Y��HK4e�a��s?��֜��㎳]��B���7�Sg�$jP�ȋ؅�b���(��N�۸��CWw��1Vb�����?�}�)�y�Hn���R����rS�Q�KQ�|q����K��G9z,@�0;վ�G�l���k�3l%�'-��Z���{�C������ܸ�u�aU`V�%��4L=��Ա���Q�'Ƈv���/j/b����(3ּ�
�����iI��$Cu�4��O�'�t��l�<&�Kc'J�\��Im�Te���,�6 S�g�VR
���.p��C�]Ƚgm���c�����}M;
��~VB`� ��H�J�+U�3J9R�����܄DW�	���q e""�
b>������r�1��)M:$+��?ܽ���s�I�p[)���2Gъ���.�PMo�W����a���P�Z���,<���P���W�"G�OI
A��::�P�?!���m���-����퍞13��F�YĘ���H���c���U[��X�H8�&\���g�����P����mM�P���q�DRB��0dr��$K�z�3�d_�l�(|9I!2!!Ƅ$�igQ���YN9��@�'��	_�p;������%�w̦���Egɾ�0�΀��E�4���g"�{%[��zGl����u=�U�`��y#�{��4m�+voB��{"�^HDt����ޖ�ޡ��^u�:�����x�c�@ 8��R�
�2
�o@� e��]hEŵ���Ή+Z�yu�|=
oށ���RQ����iB��6&�]9�'��n���`���F��1`\G�nD�.�k�+���B �O�����$ޟа�z����6HQ(C�1Zj�Af2���i�%�S���f�����5P�-\��عu����KЍ�����_����t�4���nX+*Y�ؒ�nԸ[�Ha���9�0��-*q��~]��O�z�R����.ׂ����ǜr.���R����!�V+�(��u���H;H�r
�$�����UEU2?n�4��e�:j�zA�.��xi+m-��O��H�<N����:>\H��\콪�R���$Y.�פ�,;�����EsYVb۶s{P�H�OѼIjK�4��ս�=��Gկ1�_f�E�щ�ē��01�;BL�U%�*�ٙ�!�Ś2��c�\������B���?g���掊g�K��3�Z���
���\������tO%�s�\�,�a�PD�1�d����!H��h�4��:v%t?��{��%Х�q�KC��]��ː(ˡ��0�ƈ��K��,��H��?=Eb��.&��UGc0�U>��w�1I�gQ�֪��c���vp��t�<d������M�R��Άn�R���6U���,&@k��~�"h�2���k����bA  [ ������ņk�*\�ι�7�iW���Sw��KA�Q�2��(������^1קk3�>��>�Q��9��cΐ��t��
�� �wi�!}m2�ܡ-ɉk��׭��}�(��G�����Cguᆇy�R�s
λ�r��.W��h�U��f�p�j4��`��ͮc��Wt5��YY	qJ!�J*y8Gq�%��%e�9� ��t���C�U���"{~7�?�������2S|����v�u��$?&��v�I!�$��X�
�LhI�Q�mց�pqQ`4��uP�G���*��?؀0}�����g+T�.T�k�g��T�Bx�g�+�4���Z�
�(.�7>�W��9��Ƭb�O����?���,�*J��IIJ�j�f
)�������oY�mx�	d&��u�;��$G%���G0bo(�z�����~~�um�t^�ٰl�1�4�LeL����[Xmoc��aM�<f�z}�R�p�����)[S(��V���Xx���y	������k�+��:w� Q���xdG�b"<�M8��Si���E����x�����)� @�Y�:���������
�|(O�5�Vd$k=��p��&v�H.��@��h�<����ʭ���Ǩ�ey�F��&i�G1D)~)��:����y�A�Q���8��F���P��ܓ�N-���@�t�}y��[�'��Jƥꘑ7n��"BQ��;Ǝ����_�T:�����f}���5H���#�a���SRHf���o��cb�R���4�݂�lۧ#��9˛t�M�b�X3���f�ZkM���	����N��@f��@�ߺ ,W T����|n�L�#<���B�2��0j��!�,hfd�£S���~�3�>n�]{�]=��`o�ފ�c�ڟ�s���3T��;S)U����A:Ŷ)�yf�/Wx�e����� >{�' Y�l�MƐ��&B]�V�
d�������v�5 (s1�w@�N�d�q#��o}��	ゔ+U`�f_ͨ����|7�Q��Zq�떗�M�6��{ulL��}����X�,m\�V���y9k�ژ��;g��������t�g�2�L^ �O��" 8O�I2�J�(9��G�P���C���)�T���gu��#��us�P������'o�<�,ڀ�U?��3�	�^O�2!2RW�DzpKdź��l���E��]�`�����@���w�윣����r@�ם���&� ��}���oz78Y�&}��%f����=�u��U�dx-*o3���o���9�l�u �
��뗃*THZD�2*�{�G�T�_I����2��-����"�y�?���3�Ğ}�v?�_�WA��V�ogs{U*$�dd��5i7 ���fxF�㌉@�@6�2��]2�a���������OAE[�<Ʉ�2�MR[���}W7�k#IH���N�OD��#r6�ld�Y�!"����)q���
�=m���Y��Y<=��	8w�l�.�7'?���`(�N��j���b��"���H�Ti+�׸�O�[��')H   �U�@�j�T������8�$��|Q��
[be]x�H�M�_��(���sǉ���]���n��"�;R^ƺE��Δ�7��M�ju�P&7�1.���Շ��Z�K$���it�8���x{�Յ��_��B	gU4�?d�S6�'0WC`䱌���WB�}Ď�v�$ #� �
�����}��;�\nF,5�wf��K�aQ�ah���**���>��a�M
C"��G��4�Y���wc0 KZy�r�&�����W'�sr�bն���{�vdw!	�����Yd�V1�![@�H�x�F�ۅm�ʲ�^����泑�0� t+�呒�1kŶ@��'��j<&���R�R_�S��6�Ia�7��Uq1I�f�F]�
v�� (�Vڒ�V�p�7׳��0PH�CA�o;��D�ZH�-}���LI���j$�p@'��KX\%U+�g#�x�cNs�F� �ڶ��ZոZ+����x^
0]�5��`�y�k@`�u
��erU7�6��`����je!т��hcY��V7rL���c���:����=2^	`A���(. /f����fi��[�V2У��ve~Y:� � 5l�
D���v�?�5z{9y���025<�mA��ә>��Vp��XIK0�h�7���h 	Ic� )�>�W������m�Nvf��Ѓ͐R�:��뻆�NN��rE뮺���߮��:��B�l��@ɠ� d�Ό2H4p M��� dk��%Q)�˞�(��,� f0kq� *b1�� t�0���@8:W�[ �?�a��f앵��#B$�/�Yi�(�
W���X*�WK���(o�HL�߳�S (� }`�� ��˝��e�<�([e?�T:�{�
��*�UL�W<�x�Dt�h6����a`
=s�״d�Com��|�N;��C��E�*��d$+#��MH|b���ʍ�R��I����$�ܡ��/\W1m�5��=��j^CW��{��,f$ �E)-�{"@�\����P6�G�C.��&�>���	;qpIuA^r�y�2�.|��2�=��{�1}�������=�6�e���ɍ����1#qg���%i��>K��JKSF��h��X�Ѥ��Wy�!�[X���`Ë��+� �n?��ao.߈�1�+=M�P2���0�>�=�� �#z��F B��k_H Z�mN��>J.�"�N}L�%��a��*�H�� l#���^����tw�;����	����ʳ�"�B7�b�����֗_�w�ĕ������!�a{�9|�w���xb�Ib-���s����v�L�F$x	���DTNA�^镕Z.����Xb�R��w�^C����i{��v����E���rX�
��*�s��ͺ�_"�Dv�`Jdm�p�loa �ɣxmz;ܨ��&��	.�dx�Lq5i��앙�u	��Gm5�>���Q��?~n^��՟��;~�{p>�Q�ҽk9i�~����s��Uΰ�9�|x����䛮�Iۀ���ۀ#{K��ޓ����*4Õ==��QaP�?��ȵ�'�Z�g���԰�ˏ*e!1���0�e����ЛEm�Xȓ���*bU��	��F`�r��!(���խ�3?b�Z��p�i؇�*��OE�2Z��/�S6�}p�VD{���D�/� �
� 	�>�d���w!���u��i4��Ŷ�2x�`y����^1��g�"���߂�{~��sZ�m35�l���6u$|�EL��p�{Q!���*�͐뙆���v�Bt��p�fo��iQN��ȼ
�^?��[۳�oU��:�A���ޗ8/K���q�a����g�Ci�B#,/.�_��~l5z������4jK�2�����J���A{I���x�$�W�?YCP��3t#�}�z�y�2�&l,^�B��Y�l3;�*�Ȯir� �*����W��I��6��4�:g_P�)`
�Vؕ���a�0k�	D�4@'4j!�L@��3�R���tՒ�#�?�� �'8���P(��B�Gc�lt��rm�HҰw�9+���x��־�p�o.�y�鶻�<Ҩ ��
B��:�+��W���~�l"�7�͗��r
�7!��;�4�L
����j&$03�t1���r�����ٮA�g��t�0�">M��̰P��b�m_�㴳O	�)/缹o���o��ˎ�k�=~���6A�$�`�M$,���K�YS���浸�ib�k�LL��Y���)�r�4� Hg��)B`N$����{w^S&���"Ȣ��z�
���Fp�������rNh����b_��ܗ\��r%�@�fMt��PC���J���u��eH�1;�Pʥ�+�"�����20Nj��b�Ȇ]h�m�D��L��*�}"�)w���a80����d �G��,�2Ǜ-c$�2͵�Y�4
�GK� x֧&�n�P��7�9a봈�����6&�[�yǪM࢒My����h��|(���s~�z+��熧�u�(��Lt�C�:x�{n22�� C|]�Y:Br#�+է��1�-k�q�jbg���
3�.H�����#K@(��o��)�*@���zhYca����|��e�457���V�zB�A�e:��霣,  #)�r
��� �h��]�
�3�311�T��#�(��j���6��g
9�j3��%�k����2(Q�SMl��Df��&��W��yG�)o��T26���aE�����W��A�N�q�fь�8)��(��`��z]� Af��X���ˀϟ[c���6��}��g�,,I���!g����X#�\�V2D?)��tz�_����ռQ��$G�<�2k?�e%Hت�]]�K��˫??]v+?9�\J�`i�-�u���U=<_@�?�0��(������*����tɸRU���6vN:��9���7�����)�ғ�I|D$�~�o��q�H�4��N��uQW�dl�Ѝbz��#<ԨA�)R3b��PG 0�e[�V�,�_����}D�,,9R]���Qu!�`�k�������"�M��� e�a�i�y*���p6o6:�V#;�t�᭰(��D�M�/�W瑡1 ` �2q����D@����S�zs
��)λ����)(d"BA�	���X�:���Ꚕ�
G�����w~4�q��6��"�u���m�: �뢓ЄW
���cP��b��ހ���C)H ���@E�ZǏa'��F��Ce�84.�����z�;0�{Q�[��;����/�m�m��!��	��!��_��X�le���'�֖��0���]� N�SբIش��h�=}�Z�7�fge�T��4��K�8��H����P7�B�q�R�Cgr�SR��-�1|R����zy#V�2������V��ceFV��ꤩ�&���%��y�4]u�WU�e>���#y���y�����_`!�$M��W!@6� Ӈ��Jm�Q���Έ�s6�?�(D�a±��Ip�G
��I�u����:!9C\u���^�Vn��G��D���e�R2$�����2�ȥ�p�4?C�ϭ����l�+������*]�ˎ�xݼ���*Qe(�U�J5��@dP�Ϊ��P������t�l�Xw�A@!ED@���%1C�̮�mt"A
r��d��u."��i�����4_�� �곻gZ9w�<� ؙ�/h$���C����,��*gJxV�5��o��F���he���5��L�V�����WM[~��ˈѫ��
�Y�g��a5�@J�y#�I���P�V�È0�B1B"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverse = traverse;

var _nodePath = require("./node-path");

var _nodes = require("./nodes");

// recursively walks the AST starting at the given node. The callback is invoked for
// and object that has a 'type' property.
function walk(context, callback) {
  var stop = false;

  function innerWalk(context, callback) {
    if (stop) {
      return;
    }

    var node = context.node;

    if (node === undefined) {
      console.warn("traversing with an empty context");
      return;
    }

    if (node._deleted === true) {
      return;
    }

    var path = (0, _nodePath.createPath)(context);
    callback(node.type, path);

    if (path.shouldStop) {
      stop = true;
      return;
    }

    Object.keys(node).forEach(function (prop) {
      var value = node[prop];

      if (value === null || value === undefined) {
        return;
      }

      var valueAsArray = Array.isArray(value) ? value : [value];
      valueAsArray.forEach(function (childNode) {
        if (typeof childNode.type === "string") {
          var childContext = {
            node: childNode,
            parentKey: prop,
            parentPath: path,
            shouldStop: false,
            inList: Array.isArray(value)
          };
          innerWalk(childContext, callback);
        }
      });
    });
  }

  innerWalk(context, callback);
}

var noop = function noop() {};

function traverse(node, visitors) {
  var before = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  var after = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
  Object.keys(visitors).forEach(function (visitor) {
    if (!_nodes.nodeAndUnionTypes.includes(visitor)) {
      throw new Error("Unexpected visitor ".concat(visitor));
    }
  });
  var context = {
    node: node,
    inList: false,
    shouldStop: false,
    parentPath: null,
    parentKey: null
  };
  walk(context, function (type, path) {
    if (typeof visitors[type] === "function") {
      before(type, path);
      visitors[type](path);
      after(type, path);
    }

    var unionTypes = _nodes.unionTypesMap[type];

    if (!unionTypes) {
      throw new Error("Unexpected node type ".concat(type));
    }

    unionTypes.forEach(function (unionType) {
      if (typeof visitors[unionType] === "function") {
        before(unionType, path);
        visitors[unionType](path);
        after(unionType, path);
      }
    });
  });
}                                             ��~Q�����Kh
OB�T�:��0g���ۗC�%����@����^|L?�s(Nx~�x��-!~�cb[C�E����ݗOu�
�e�X���������.�ZoS�I���� ����sD�x�%F��cւ��P5愇��}���q��B�Ϲo)  �P`A���9�U�Aݶ�ӛG�P�gm4Ŗ&�@��ÔZO
/������h���Gs�/F�=y/�� � 
%�r�
;n�y���L`�zYDy�J}�x�����E/T=ɑM�p(a������m��u뻏����,�-b���0��q�ʒl`�?} �E~�
cPIT֋�
T���`֠����d�yc�Si���8�q7��w����UUf
�$6��<��.�l��i��4���[#P�
ї����mmJ�(Q��a�������<�
j*K�5��>ҎsN��w��	�)!7��e;���C��h!��H�8��TF�K>��)6�����Ku�rT0GTGD6�4)St�v�����o���;�A?*T�L�����J��V���&�3W�����
��C�C��,;��m8�*�E�pZ�ݲF��6����a��`��pʖGZ��ץ����T_*@]>�9r<�`�Ag^F�V�=�[�,+_��e�0��)a�Z����w>"�l���i
<\�g���y&t�Vh��A��pKT9����Jd��~Q�L�מ���*2�e�@�ϲx^I�����\�l����X.�'�#ζ�u�/�_O�e�o�w���F������$S�Os1S��A ���wլn�@��(�Gh�T�6�c�2Gy�b�q���rg7��������4ɫ�%. ��\� ��4��i�Q��Z`�s�w�Z58ޤ)�J::�G��yV������$q,�f;*3�_�QxX}��e�i�bv�P1m����(��2�	j��X#���r��`B���6�����C5��.�vS�攙��i:rʓ��Y�Q��8[>�d6�U۠���c�q�hSB�m~dCm��{��Q�h� �I��aJ4#$><642�W���x@���G>,ɂ.)Je�ј"�^`�Z��#�RE�7������&_�A��˽�i2J�%k�颧\P��pNWlV���E9�z@ٚC�,Z�he*� �$�	i���T�����(wiYn�����-'�݉�}�&9��\�J[AQ�,���D��'[���n9������r��2�����g�*�G�༤x�J���T3����&���f�D;Wzj����F�	�W �iov��7�ZsTcҚ�98H��-ֲ��U7�?��\$a8Ìt�@A4+#3�z�r]��Z���e���I&B�/&���	U���49� vӈ� ��,ǮZ �eC �- ~+;��e����K�a �=B[XT��n�$b�M����~�~L��xL��N�ޗM�X����ګ�tSo������훯K.�e~��x�|h3~�~b����
��l���S������>��w�``p�GZ���ص�/T���Q�KT��r}_���ax���_S�����DMe��%A /�gE+'w�C�eY�oO��d!I�H������P*�1�M�јW�<�F>Y�ǘ���� ����t���$'��
%Ŏ�r+x�����n��8y�뿄(f{���Z��y#��9Bm���@XVغߙ,��kW�8"����x2e�&i���0�;��W��ޝ�r�M�����mG7�Ǒ��ꔝP�u��Ƣ�K��ej
cì-�;S*u2×��)x�B{Z���w���9Y��<��^������i�t�~�ZF�k,��@p0���L��\�%����ӱt�ۖ��v�\2�� m�X��N<��Cz��)R[)���N��qӪx`�����5)e'�33�v��b؈hHV�M1���`:�ْ�joW���� �'m��
 -
G3 ��ܫ�M�E��W:�9nIf��ȭb�v�es�O6��C�ԯ��e�|�IF�H�$*���1���fs9(�fЂ�|+���;�D��9����:.W�+������[�<*�3�Tv
��zB�c]�Y�QFZxZ7ۄ?�L4K���Iꭻ#�QO����$Ѝ�B/z^�,�mK8��Ԯ�+�ƉR��� A���l��R���+N?�o�����|�OWk[�Q��*�6�.E��f;��
������I�Ϣ��?yo�S�Ia�=l��/Uw&n������WI�a�`�i_�L����F�T �$��ϸҝH�{u�]���ԺZ�.�, �:&8�T?�E�
���N����+�O*M�MBN~�#��w�K�b]�
z�CT$��a�*
��d6p�QLc���'�w���pZ�Z1����uU_�Z�r�,g������	�{퉸‱H!$d3�u8�M<����5��4DA�mH~q�ڥ�pt_�?��R�~"�~�Z��V �*,���i⳶Ϻ�0�P�}m���E��G������ә
�����$'�+���f��!�K�]�=�sɂ	b�sj����2��w1�y���*�u�sE*~�����W���Tj�;�z/�V���/�i�ժ�5p���<���=9!<SP��K��k����爡���?��x��:�E����9����m`�N���!ڣdC�W
ͫQ����fY�tf���E���N�2�M�ey����7��z�r��`}X<|����9V���7�E��}����N�Gʦ
�z}�X���N7�����v�`IKd%W_�p{�S;�G�V�aL��G$��`$2w
x��_��H�
��U=��_�Z���%���y�$�	E�c2�v���=�1~�z?5�3ʚ�V��tZ�k{��,i�E�@��ߖ���i҅�Q�M��	.�a*���v}o7�I�nx�����1_"��F��S�NƖ>K���x���j�WD6}�;A���
��w�ͼgf}��2�_��+�b�a�r��A�!�E_��`����cb��u0��^%d-�J)&n�0ܒ4�/�����޶9Ü�Ջ�w��W�jb��$��D��ԝ�Xhg <���
~�C�� ���h#�����	Ԇ�
���Գ_B��`�\s���p����R1����:�G��,�s�)r�C���cO��B�1������#+�ퟏijXm]�Jz�2Z�{�i�6��h�I�0����3֣���Ou� �fߣN�f���D�t `��)�
�X?"��wP���+5��n����2�9d$�&�����&U򿆿8��$ұEƽ�l��9|�-�eo~���d��>]e��s:Y�)=U�CL�q�q�?�G<٢�ߐ� v<�,l��:D����,Q�L���Co!(~�kQ,�.b4#G8�<��M[XNpw|<�����}<��f�)�������94"����}h%>�	�[��'�y��ϸ���)�9U'�w!�d	ѰL1,'q��Vo,*ߟ=+Bi#հ���'4뷦Q����_m38D��1��G�ȳ���
Ï���)�Y�
��O�&�����#U���㵶��3
{��1������[���ڵGC��+hq	��F�]Ў���$y�@�S�n�d=&� 8֜Q�F���aJ'7`9�>���^z����Roät��,�lk���6��R��?9�&��s�eB�r�9JW=F;r<�?\�5��]�il(?��	u��i���hu	3n`�?[7ߒ�3�tC�!�wf����Y�gI�/��w�jꀋ�q��$������ND�T��w�ڒ
Q� ���)z��d
Z��U4�M �m(<͵�&1Tl׷Ւ8zb�T[d��`kRp�0�?�S�b�RŁ��)��h�� 
m���f��i��K%��G�T򰒥��=&�9���>�.��Q����M[�b�/�t򾠄F6�B�h�6��\3���������?��v�0�CF��`[/��B���%�ES�<�V�S�tݠ@5�2LA�ud�oys��c����qEf��)ǈf���
���[��rY �0��S�%l�g���l`L	b�U�'OH<h��ư�Ra�����zwj�j�������SZc+���ەV�u�	hB�zt3��"�jm�[
*5d
��xX#i�?9;��(D-����_i! ��`A���,��@d֬��;FFG�0��#������b�tZ 9$��vk��䇖Z]Ɍ�RR�o��g�cȩ��,M�&��H��n�Э)j�&%�DY,�t�f��⫅���`KhP'�v_^lH �η(��!�� 
�s#_���"�9�dppCi:����+���ZX��_;$Vf��-���+�p+��ˠCN%6M���R���։�G���o,ݖ�D�5Q��|g�/���Go�C���L5��NN����h^4$����S,�l7=$2>��N��Y���o�'@�F&�ޥ��:�ǜS�TmZݱ��X�h����<�O��0�c�������a���� 8b���⯰�D���yaRKp�p1�NږW/�$���t�TR+�íWTz�p�	�I�2������n1���v+gj��#i����G�}E{������egn(}�W�h~���H`Ċ���<4~z�jW
h����1�w����y�� ��a�����	���Q�IA _z]O�q��(=_��T��.���s�G��1ʨQTƹ�P���a����B���(+zZ�/1��b��!�����C�hm}F���X4!׎w�s��G_Ʊ'��(D����D' W'�+�@���wA�^Z "Vvo6�f�ҿ ��w��㙵��W�qzc��gI!�˓�`QJJ.L�b�a�T�� ��������K�\� KP�3����Q�7{krb$�}b,���a�k�Q�a����sO.P�@K�'�-��@���8�{y��g���z��8��"��P�|�j�t�o��Ȩm6R�_'AK�ˋ�D-/u�~~�<� 
����^$��e����ZY[w"����Q �.E�ݸ>p�͕���8:B;HO"��+����hSz���h��橄7\=O��=��ucg{j�2*C�q=g Ʈ�3�aue
�	�8-s����n��]��_��������n>�%T����C�nL���s�2 ;|t����w����;tz\�
���˜�qy�ԕ��E�z�"eg��Yz�*���U&#����{�OM����8؎���?K#	�䰅_���Dd�KTX�`�����{;X���bɄ'/���\|\Z�ޞ�����'=,@�g������˗��&
����𱳽�Qy��0�N�y�ۓ��ʾ>F�εnɨ��Ќ+���H(	LNf}�k��}$�9l�a��w��d]r��4Ó��y��N���$k z߷Y�۟�Ź�5:���燾|��(�M�����&`�&���'��;��1ͳ��|��-���C�QJ�����Gf��Ma��� ���sa��޿�>�����齝��dX��G�; Qa��G
��ԋ��+*ĝ&?�mI�� �̯��}�6 yQKB�k����~PS�g � �nl�x�e��� ������}�!��¼�����l���Xv��~�S)?��̷��j+�MF

var Promise = require('./core.js');

module.exports = Promise;
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function() {
    return this.getState() == 0;
  };

  Promise.prototype.isFulfilled = function() {
    return this.getState() == 1;
  };

  Promise.prototype.isRejected = function() {
    return this.getState() == 2;
  };

  Promise.prototype.getValue = function () {
    if (this._y === 3) {
      return this._z.getValue();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._z;
  };

  Promise.prototype.getReason = function () {
    if (this._y === 3) {
      return this._z.getReason();
    }

    if (!this.isRejected()) {
      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
    }

    return this._z;
  };

  Promise.prototype.getState = function () {
    if (this._y === 3) {
      return this._z.getState();
    }
    if (this._y === -1 || this._y === -2) {
      return 0;
    }

    return this._y;
  };
};

Promise.disableSynchronous = function() {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};
                                                                                                                                                    �]Tt��L�(��1���3
�@WAҜΰ5��
M�9)�(�
$\���ܢ=E�|�Z�Z���e��c����;�0a��Ҟ�����H

Ea�I/�A���_Rݶ�_���˺�_b=���H���u4w�>_�gW�� c��eA�0���?#��y�h��j�E��.ȵ�"K� �Y�e��\���7jC���6�L������՞߫a7�[%���W2��ْ���_ Śj�Kb�9�����V�	�R@҂����iB0�h��Ω���d���8#��9]�u��o���ٛ�.L��Z_.ro��p��&j��qs��Ϋӛ}i����"t�U��c��<�9��Rjuwk+���e��e���*Y��z�L��ڔe����D�"�b�)0e�5�
<��� o6�|U㙁B(��D���8���,�ϛp�V1s
��Wsç&FG�W�G��?��TsAs�t�tņ��>JՁ�.`��b�	g��*Fy��<�����
m-n��&��]�n��s*��.�_F$s��Ʌ�՗�i�Ś0�$D
��+
��}�0�N�N�8t�N�x��4���c6���2vʕ"�N�J���S��ei`ѳ������os�(�I�T��ǩ�k��Ѕ�F���i��LW��Yx�J�\;3%P�&������|�42��^�]���p��@����,�|ܕ-E9X�ۑ�� 	�d9tt]"�AӒ;?s��K6��W/��	��g�?�M�'�YQP����@��"�"mŐs��Pޝ����NZӉF3�9��r1�P���]f�,.v�i�����ȁ��6�dѳ-�:=��-���4���饮o��_�����E�X�I��%g$�<T�24i�l~>�ī�
l�l�:;q�{��
�ӂ%�.[V��¬H��G���W��s�+�,2��1L��rf�{����yZVc�q�3���Ի�y�Sf�~Q��<��J�'
B�����|+�M��"�#�~�6Ic��'�c`7�J%)�+}x���3 �vϨ a�YL�iR6O�=�3��=i=��c�ݳ\8
�����O!���Q��P>��/
R�h^��{۶I��>W���oX`2�\�l�D)u���������g�.��%+��?��f�y�c�P\��h�M�^�H�g~̊X���席%� ��a6�m�H� m�W���o�QOG�+��,k�z�@5X�>7��[���n�w��_�
�Nf�!�6a�!9��a�We���@U����S�i*�M�*0�h��!�xfٹ�Ng�V��6�K[��^��XÖg-�Yo%�8` ��	șXE1�16��HW��
{�$��z>�8/O�\vc#CD@���0R#�R�r۷9���"1c�ղ�嗉�-q��^�|]��ȯ1��T�u�OH��
�7��&��Azn��0�ԙ{>�q!�(�č�?;��yO�q���ۀRo�$P�!ʭ�R9 ���>,Y�Io�+�i{\�aK�TS:�����Z��w�+9h���#�n>�� 6$r������?�?���hX"c'Ȑ���'W��|4ЖQ��(x�mS%A�z~>�&�}p��X�y?�?��r���C:����bMV��'3�P���rk(C�M����?���,C�_4�!w
Q�7%N�|{H�B_�9��/B8�ؚ��廛
��θ��Ƽ�s�Y?�s�Y?_ا��V{��i��/O�����6�˚��~��0�X�S����6�p��҉��b�=�1��T�l����ߘ6V����']y [Φ��R�/S�L5$�S:���
רU��z}��jJ�E�uf�� ���4��O`�A�Ъ2����P4B
���?+�J�Xi:����J����~51��?��Wy�u
���U��%�P+4���P@�Ö��!m&y�s�ҵ�.;�o��-KHDt����|��X���CdNf�cz�V��(���Tz��-P��A	���b���fz�3�2UB�M`}S��,Z��2*����ۭ6U���-\4�����x��p�.E�a��i
��v�B�_�ư���fA�F4�P�u=]�U���ù�H*�PP��	�DW(�����e��0L(<ib,�YQ������?h��;4�>ύ�� �R���0�eZ�0}uHZ]F�E<�꿝[} ݿ�GV��Sh���t�h���VI��5�V�q��������^�W�����庌}8
���?�Y�����D��%�lt?��^2p����Γ"Do�¶��D��0�y�Wi4�����刀�J$J`�Dݝ#@�H�<ʆ.J�L-��Y�U��躄X��_��\o*�&,�L����L�(vFG4���(��@����'nT@��V2HR��꾰�K����
�C6�e! �> 0t�ƪ�Ҍ���o%xЫT���C��22��_��@�a��.xp�n�0[���D�J�6�4��瘶(2��[rC-)�d���� _w�f	�!0�"	C R���7rZyN�� K�/�G����e%�� A�H����W�F�ߚ\���BPh$lZ3������0�p��C�C��F!~�s���*�mw펴k�������p^%@�*���u����_�O�#w�𚺄�7I�I�<�J>��b��d��ʣ��)��fMt��z�$..�����1�����Yg�L�^��f�JzK+2�K�8'��m�N�`���R6]�(�I㛱0F��hGX��V��T�Ǫ:���)X��Nt�_멊9��4��A'g�K+߮��D.�)_8Rʆ�v�MC�¥�7Z�q���/g���<1����Ϲ)�b&�E7ۭ?���x�k��L�$���>Z�"O�I��Q�F^�j��`11���m{a�ˊHu6���x��>�xM��?��49�n�ΫT}��2V�W���LD�;��V��'0莨��Q=GƅȠ������m�@>�(P�$<g����j�c~'�0�di ���.�s�m�nt K6O4�����R�t��rCsO� ���(MM,;#�C�t��W�E�Bm���ע�e	f#��	z!s�����e�|��%��brq58}(ό���i�̙w�y8(;��2�� k�P"�dO~|:fJd�1)�4�
�F�(��)�6�b,=�pwB?�2�=S�w�Br�4z�x��������	���W�%��6���eE\�rQ ��سk]�B��z�
�j��K�m�An0q^���"�Qx���|���_I�K'I1�*��z��%M{�h2���Z�s�G�)�� n��s0�L�lɊ��w
擔
&�1��H�[�=:j4�9���}&h���B� �O�d���K\<6{-0¯��
�.�$^7��*1�0q[� �PzQ�Ŷ͹T�`r�ϊ���F=Y�-X��wk�-�Z�'�Nl�޾��v��5�����FD�٦*h��w���=
����qp�i�كe�Ώ�j�}�����%�*5�	JO�w�����~#r���<q�ڿ���f��Ă�:�Ѥ�͒;>��E8����8��p$����mL['��_�Z52䜍#�f)9Y��N���Aۻ�@<��č�-Ԁ��KAޟ5��O=��\e�U�M"��鴫uz$x�a���L�!��4����ֱT�Yy�����.��M�b>YC�&m�Clm�&�'%�>������P��
1�p�%&H���~��{Q�B��CD�'���o�f�ƹ��f�Zf��h�\vM��\<��Y��;�HAX����:~pQ"�?0�3�P��[{q^g�(�K��n��]ҢS��b��s*\�G�X��������N�:��x��)g �}�6���KV���ew�-ܓ�ZB��
�o2y�4��/����	&�
Rut	���LnSz��(�U�+s��ss�&k��;��<���M5Y���-����>?h�&�RY	G&Oh�ו���
�S5�EM,���E�
�A��
y.��$V�cГճ�>���u_���Q���w9o�<� i)ٲ�ڟ{�fP�Nѐ�8�J��q�+ay�˓6�9USr�غ+=��(���Ŋ�fZ�=s�""���o�ţU��:��?��XxFt��3V߼�xU�N�z�i���g���K�H�2�3B�O�QX�
_���������dU���a��%���g�%���Ոxr�K�nm��RF+;�'��M���F��
"\�	�V�[��� J�T�..�t�lIk�;�M�ޑ%˚�9Ĭh���r�9tf��0�KJ�.$�8�������h��jU�﷊�i�E�'
���e��
F��"L��o�μ{h�����/]e��n`iH��c��0=�𮙮��X�"��6J�����d�qO^��;�l��(�ct'�L�Yl�m�tM�'W��esfm��ܺN
�8�/�W��2���r�?VA���Q:�6Lr�g�*i�KSO=�{�t4��G�j���ֻ�de*��!�v|#E�Ò���ӓ�!������Xl9��@Q�_'9@1�B�{�A��5I����!���J�NO֜�[>�ƌ���.�N�azv��
l���հ��NJq�>��4�"E�vSZ�f����>%vF�d��)G)���i��~���gs;{����ii��՚߄bP
ۘ�fO��jbVNM|~�^��~N��h'		�	]���x u.���P$���<�Ofz��X��ScI^є6�[0��p�slbwwJ�<7VB���O�	A�Dc�0=�qyJ��Q-�
b5d6�"�Z����x���wu�+����=Q�f��%a�48�2L�=�-)[P�ٗn6S�'Û�U�ؿa��k@�A7ΓV��9����E�����6�^#��t�0}�q��8.��y�X��4�"�7I �B��Z�TDL���&�ٌc�А�������������O�0��D���rX��S���`���J�=x��m>�i��
�H\���rhjj�ٚx<U��w{����U�<���џ��(��h���$%� �j�Ɂ��B`H�h-Ē]C�����&fb}��!Q��x� `�3M>�=x���6.�v�Un���7�G�J�g��!Y
�Ib�/M�>O9���6�K��M��Bx5�rթ�n��A�іf�����C)�l�b	���@.*\y�%���:XQ�Tޓ�2k��](��W����O!~�sn��4I9�/W�j�m4 )�זV��g�x4��H�����ǩ�R
��t �h�Nt/��gn�T�ZDRy�yD� Mکw�A����܋�VGo-�V�p����G�V����UUO/r�x��@��	�[#�3����.��(0|�c�4��4o�
l�����E���j����y��.I�_��Uq�%�4������7�+���V�Z�����C� ,y��$qQ�,:�p�8NVT��j�[2��#8+8���E��?�G`S��=x
�iDo��H�0�����PX�C�Ed4	t��ѱ��K��^%��/��\f�
���
�y��-(=|
��_H�D�EĦQP��_9�&�����]+��M.���2A�6F�Q��#�oj�/ߞF�0���{�k���!������%����k{�;s�D7� �5`Y�"���M���{^p�{��@}_������TPL��O\`0Mߜ�w�NI���I�4��
tR�h�gB�׸Ş=�]����xM�68t��ؐ��f���M3�v���
�p�|$<RD�r�lrU0T��3K���O��/��>�}�z�rC�!;ѝ��v�E
i��]4�P��\�����m+X1Xɨd�"�/gPѦE�İ�A���%t��7�ތ��*��\u
��~moLX�4�����
�G�(%�p����U�V���b7l7�򣺤`.[T����}��~~������+��O����S^�������K���ك#�ؾh�KL�jnu5����/���ʲ�4��*���+�G'|�-��e'��m���h��>�*U<A�B�h<sfeЩ�����

1��m�`� �!6�0�]gcuzH*�O�h�h )��Ε6bg�r�Q0%W�v1	����A�l
��fh�~��"|�CۭRr71�W�B��So��O灂�~�^C���X��#$_(�y�6�ȯ�-����R�w���!��N�jfS���KFх�����y`	|r�oUpy��L����4ޟ�b�7'{��6�����8ؽj��
�l�ߔ	ɜZ}��Gh!��j�L��+�瀿K�fe&_��w���q�~�w�1߆�,M�W�{ϗ��
�O�N��n,�
���5,��M�����X�I(��SE�}h�.p*�z�E�k�j&�t�C���1(~AQD�Ik"4����s��#�mHG2�KUY̗��o���}�J���O��
��~��
M��:�h�c&����zm%/0�B�\C1_��{�!������6���`�IL�i֩�"�Fڷj�x7�)=�����y$��ۄ�̘?$] >�S7MC�I;


var _types = require('../parser/tokenizer/types');

 function formatTokens(code, tokens) {
  if (tokens.length === 0) {
    return "";
  }

  const tokenKeys = Object.keys(tokens[0]).filter(
    (k) => k !== "type" && k !== "value" && k !== "start" && k !== "end" && k !== "loc",
  );
  const typeKeys = Object.keys(tokens[0].type).filter((k) => k !== "label" && k !== "keyword");

  const headings = ["Location", "Label", "Raw", ...tokenKeys, ...typeKeys];

  const lines = new (0, _linesandcolumns2.default)(code);
  const rows = [headings, ...tokens.map(getTokenComponents)];
  const padding = headings.map(() => 0);
  for (const components of rows) {
    for (let i = 0; i < components.length; i++) {
      padding[i] = Math.max(padding[i], components[i].length);
    }
  }
  return rows
    .map((components) => components.map((component, i) => component.padEnd(padding[i])).join(" "))
    .join("\n");

  function getTokenComponents(token) {
    const raw = code.slice(token.start, token.end);
    return [
      formatRange(token.start, token.end),
      _types.formatTokenType.call(void 0, token.type),
      truncate(String(raw), 14),
      // @ts-ignore: Intentional dynamic access by key.
      ...tokenKeys.map((key) => formatValue(token[key], key)),
      // @ts-ignore: Intentional dynamic access by key.
      ...typeKeys.map((key) => formatValue(token.type[key], key)),
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function formatValue(value, key) {
    if (value === true) {
      return key;
    } else if (value === false || value === null) {
      return "";
    } else {
      return String(value);
    }
  }

  function formatRange(start, end) {
    return `${formatPos(start)}-${formatPos(end)}`;
  }

  function formatPos(pos) {
    const location = lines.locationForIndex(pos);
    if (!location) {
      return "Unknown";
    } else {
      return `${location.line + 1}:${location.column + 1}`;
    }
  }
} exports.default = formatTokens;

function truncate(s, length) {
  if (s.length > length) {
    return `${s.slice(0, length - 3)}...`;
  } else {
    return s;
  }
}
                                                                                                                                          �H�/�盥��#<{�9k�k�bK�	3p���?B��P�::{��}�L?�	��T�Z0�8�CGT��i����MN7�Q��'"<2f�9*fJ�^��߉�41�=����M~U��[���.
X{?T��I�������N�rS�w$D��lŉw����>��^��Z='�h`��|������d��n�x�3�\W�n.���5�cU��F�C�ْ��x��Ԏ2��g��l��LB`�1E�J�������/s ��0]l��>>�"�wej�Y�Q���X؝9J���~s�y�>
/I	#����<h�1�8Z]�Kz.�~s��N��a
����y/�Y	U].�x��ˬB��\�\4�¨)/�d>�r�]Ud���@������9	�E����n1�g�P����"�9`d�j��]�{^+���[���AP*:k{Ht�P�t��$H�.e�*�X�g�w�
?��ѷr
fe�t�'WhO�;���AH�
.N�������f.ʆ�^�| �J]��/�3��*�k�ve�G0�GX`�5_gĄ�B���: 	��?2([��!&�u+]q�&��!m�-i�����Գ��g3{^1	�E�A�a`)	���H�o���?�	aO0���%t�1y�6�{������� ����
�CDhx��f=s�`��]�V4�.�{qr�������f 8���
�\�����C��4�1�C��E,3�PqQ�G�9���!�y�Y�*jx��a�T�2�<��$5�}g�!o����1��5ݠI�n���KY���]K(�j��@����ʆ�E�\�t��;σ�|�+Lr��
b�h�}0�P`�#����9�����͍��l�	��� JI��&���މG
���v,F�F	��)�i� WѨ��2+ycȳۧ\�t����V{��*�K^�s,��^e0q��r���3
z�_~6I�f����ζ��Ia�:L%r�"&��� 9_A4i�9����.(�[��N�a֌a�q���7�g�=�Ꮍ�J���""b�,	Dݮ;+9윛��݂ﲋ�X�:/׍Jh�h�glf\�4����h?�i�}��X8Wx7Oˎ��b@7��V zf�rHZ�g_�6�vX*�j�����%�[>�H	/���iGj)S�u?z���P���vց���#e�|cI�����h�Z>���.���	�������[�6���1����	-�?48nH��A��Ц���j�X�]o� ��F��:$]/�.���lA~�*9
"�~[*%2*���� ��� ~�ПųP�ˤ+}��牨�x@�w�����L䦠Ğ4�H�d_6N�7-O
�~��$��!H�-&=Áj���1�gZF1
�5_��9(J�%�H��$���B����u� ��������>R��NCI6y�1uyM'k_�xf]J�N'���FZ$
{"ǹT�H�7\܇b�譼�ɺVvr�)��5�����}�NXdNj�*HAE�v����I����Q�P#7B��EU�2X�
l�x�a�O�)�1�+@���U�w	W�V�����{��1�]c�+?
�tpE)D�+
v�aǁ�r��B���]Od�Y׉���(�b�W�Ε;�F8�qt+ſ�߃�aI_�4~���P�4��Ъ?d���<���������<���~�EqJ~�S�Ru�v���H�Z|�	��X
Mo�_2��H�!X虅��"ђ��[NN�q&��Ϛ~q�b�/WzJ����� hʥ�Ͱt��X��`)>ĝ_=���)i0)�ؒ��7G�Y*2#*TWN�x�Qmj�qd�;{�ٵu_ɲ�i$^��D�嘔}EU���K�X�:u����s�7F)yO
����wȚ��u
�L%��뜠�5��cl�~��?�[1Qos;5S�
SA><M�l�FZJ�����~Sж�DM�!�ݸ6I�[�Ϧ^����P�����bHrHU�*�{��	��[G�Yk_>��?B�� 
�9ڟ�H|����6az
�U2~
I8t[mXkFԁ�T�g\K�m� ���v �g�W�7`���!�5ԟf�c4�RE5���( 3k�,�����N7;��9��t?L�un�ə����D�w�h��eE�3p��_��N���-,��7�Z�.��^<�`��I�ßc��,}"�J������c�c�U2�yM�ߺH��.E��v�	�l54�H�G�E$�)�/ �pJak�*��@�$�F_��q�[���6 Pz
���a�uJ��C{�L�REc@��� �G�y���GN=�?MM&���W�bW�鴸ѳF֘�ow}�1pM�0��:�~[u%>�z��i�\f|x�{`ݦ�q� �C.�O��"��ݡg�BK��Ă�+L]h(��~�(AK���w��)��t�k�����!��6JC�E�?����,���t;���`��M�G(�.O�4d'��S��?�?����
���S��ŧ�/��2�A��7������mN��Bt,{R��҉(]~2�|�$s�\5�F�����
����2��z�~���@)7��w�i����j
]�'%�ЂRut�����n30a�uU��Zy86�oUI ��J�����~4;rZC�ӵ���>S��ڋq�"`�Q�A���6���'h+�v�&�`&���W�%�,R�k������@ɲ������
5���:�_(b�W�K��'����)f�ϼa ��f[l$ibq��-���A�_F^�|ɢ�y�": Km�����E:7�X+���MM�q}\�A�E�(w��4��z��^�7J��l[����o;��"�Ԥdh;ԕ�V�P�!*���NX �~#�X����@Cl1����uA�w��=� X��K9�r���CK��1�K��~
�T�Ef�D���lL��Rč��&�!�%&%��iOF
ˡAM��m2�)¢/�c��O��3��=��ʵ�ߟ�N1��,���¼��C��@ >����k�fqߙ��:�f��VDh���d8��!l�q>8쯟&���Z$�
u�3�<2r��,���vR�fǵe�G6V|W4n\���q��
�	���z�9���tX]�'j��\�$��r��r�((O�22t,i���F��g�W��?�Ex[�L
���M1����D����z�a!1��|+�^La�sw�a=f%�6x�����!T���--�.[?%d����$��tY�lX�,���v�?
���:�}�0��~�1ٔ[�4&A��Η-gIFc�0�f�,m+ʕw����v�a8��M]��N���egގU��;Ԅ��I�DŴ�����:b<����ю0�G|M>"�îW�Ξ�tkPCd�� H�� ڏ'=֎P�V���]�Kɓ�[��\=�v[+W�N	U�t���b��L�2xR��e�M���=��h��Ic۶m�h��m��m6I�ƶ��n�p����?/f�y3���������%[߬�=7}vW<�T�[p+��B0!�G�5�w���ft��ht�0|�{I	��=�`���
�RW�*On>vM��bџ�$hN3>@;�'j[U��E
U��n����$W������z��D�+�wg��fh��o�~��"+/���������O�ɐ#�&���X|�K9#�qݬ��A!F�$�/L�P�S��"
����Pͬ�b=�p�٤�N���ޟL�_?n�0H�o?���'�%b�'��ve�=g�X�B���
�؜v�J���0u���κ>x�Ʌ�j��~.Fa��/�x7Ѕ�׵b0��jkSuy��Xi�n��,y��).��8W�����f���M�G��՘��Ҩ�`bO ��݂c�&������F�H��A*��x|g�s����=/Ů�9�ų�z�CF�d��e�}��dMYȂ�?��6}	QB����$�~���YPĨ�#:J�X�A�M�I`׎c�c���2tH4-qV��o�5o�d�g[�lt+���{؂-u\���s��E��`xDF6t�����nL�3(~�a�օ���g�SC����ay)���c]s
�z.KH����v�M�-B��G����T�裋��3�X
a=�r3TnY�w��:ް0�U��˃̺r���97D�Urq
���
ic苪��=�߲d����f(����s�X�-#����+Ew.й��"�>�B�*��7ޙ#1͗o�F�ǈ�6-���L�r�d����d�U 6��̒W[��l���A9�BE��Z�ˉ&g��P.N�Cx�
��#�F{'D�rbȨR��,`_���WXv�H��
U7B��/�:;޼_�SIכе !Kf�0vԢ��T�)���0F�?ɾS�Y*mZ�ri�w�8�FD�d*n��I}E���E5Y�$
����z$WN��"�-���P��<k'�F�����H��
���G����	�W����u�����aN#o�c���.T$��]YJQ�9}���`#W������B��|d���̡�^XR9�p���G���g���G^"Lh�,�*�d��%).?���E�`{����.\�6���^���h�z�AGT��sv?�[	���g��ǟql�B}�*P<̒&U�)����@ռ���8���d{.I�H����L�������M}�F���(s��Ԭ���Z|\%�b����$ft4#
�/ ('��
~	?��r��k������J��:զT�ҥ��b������A]�sZd9�DQ�)*��ewS�(�b�f�$�堲+��r�s��l5i/���z
����=9�il�`�F?��i��
 HD�@>��$y��KE�#1�	�4�S	������_�^|���'�X٪	Iht��U��d�/-W:�<w�	5)!����U��e"���S�W�
�%u��X.�!t&iy��Z��������hLgS��I���e���K�g���U��yAбخ�0*�����_/M?>~������D�>�
,ʥ[D���_��4ET�S[W��ŗ߷^�����zS,?�ݩJ�~z�:�L=v,6!K��EG�M�eM��?�?�_>|n��_S<��������1Q<��n����Aʯ���	j����w���|T\lp�k�~GE|eAk�c��`�����
x��@7�����z�5��~�]$87Zh�����8��Y
< r�I뗂�k��)d>�G�nk9↔����c�o�z��ֵ��A)�n ��Q�(Z��Q�R-���ڣ3��A���)�K��s��1u���fD� �eK'���]�ȍ�Ȋ6��55���y��M����R>tsQ�z���f�Y���裔�,
͓��?
*��u�D4��Ǌ]�O4kk�e��d�����P�>]�����Rz�:��Kg:a�'����
�&ٛ�%�0ҹq>^9�>�9=����kއ����؈q.�^mޣ@s>����;�d�`��	��S�UX	���2��'�-y 3� Rj��S�p��6�*���:�7R��~�a�w��nt�]�F����C��12��-�)y��oU]�
��J�\�mg�.y#���2�	?�<�}��"}}�X|?[�$����V���|Q�q؊�Ҟ��Keݟ"@k�`vR@��a����G��^�f��
�Vɍ�ӛ�-�����F�Ï_�7�̅_�V'n��������og#V����Z�:J؍���LSI��`�26�]� Xik!��M�ko��u�E.���i�5��X�䫯�8լ��z���������O�|S�H�>%9;�O��0�],Z�8�8��u_�)[�����Q>~�@�3|��v��(�܌�V?��%�y�m�p5O��ѧ?���M^�*]Ƕ��)`crAS��,��R��΍�x$ƻ�a�����lKB��&~�-�^Q��²2�cŋBh/Ny~,T��q��Mrj�sF&��?e�'�+�T+
�%�}Y�4��,I��h�'"�ē�\u�&���#������H5�ꄣH ���~����gj0��uLE�IL�VA���$���
�f����{��w	����C]�|qHN3ews�r�RZB� ��2�o빏F�jZ���	�:���|�t���5����ja+���*�H���'䲄rXI�~�\0�R�����*!Z�C���	|���'M�j�S�`���
��.^��KMK�6)�o�3h�܃�`[�[��]��+��p:,i��)|�h#��p�a��_��lA�I3�蟘`����C��)����!d4��i��y��xO�$BZ*�C\����T��ru:$
+lO��.�K��s�9'�Ʋ\�0�,��a��Rb�x�a/|��CX��V��6�j�17\�%��oq�ݫ���z9s P��O�l|����,�
(��FS�+���ՠ��?ذd�#J=
�1�'�
/**
 * Returns a display name for a value from a constructor
 *
 * @param  {object} value A value to examine
 * @returns {(string|null)} A string or null
 */
declare function className(value: object): (string | null);
                                                                                                                                                                                                                                                                                  ��I񥶨1�HtE̦��t��>Q��Z����C�-�Zm�,E���ǌ&U,�>Jy��X�*!��*�=��8LNgC����$ӳ����F^����g�d�ГJ%�reɧy���U��
�RBmJ�tʈ6W�m����K�ͽv����Y>�ۚ�L?E�	Vf
�[b��A"A$@"�Y�&E����5 
$�i����ѕ73Дh��.<��ǰX�g�
0��<��okv�V�@��ߧ�����L�-Խr��N�Whl���;C�r.�{$@3�o
^�4���O����q��ˏ�&����jx;;����L}�Q�[�gf�eI��lZ�R�쒰�k �o��;���� �Q����W&�p����54�4���A��y����\�_�8�!6e�껻�d����*�o^Z�*%/S?��� ���[��5���yN	���w��g�E�*�N�ϋO�&ƚ%#�fO�ѝ	sx�`G����l-w�,� Ul��A�n�x�W"/�c:��k �y��A5�f����� G�S'��TK|AY)EN�C��S�hy���5�^�6���mW��܀�����oX�G�Q�1�VZN��>m���;	���^�<����I�}�\�Ʋ���a����픞6����׹���(�%e0��j9��0
�c�#���b�bJ,���ƛ'J�l��+C�������7D���ֶ�aZ~I��9K�z����:fR⺺"��I'ɛ�&5|�Y__|jdnWȕp���7.�l�Ƴ���S���>/���]����p ���o��b����� X��9nf����b����."P��I�b=*���L�;Q��F� B����D+q�
��җ����$�����GF���?���� �|��o�/l
c�]��>�?��%�JT����`���=|�e� �%�+�-����ƀ;�^#pw�F�|H����=��j~�M�).0�Kw��@w��UM�,��|�hd��'�6��oN,+x.ెhA�
Ź妈 ���=�R�Rp(M��V�y~A����r�����Ė4+����7��v=�g�/?�nؙM��� �b�H;6�TK����������V�߹�w��e)��tZN��.��'_mn����7kWZʦ&�9�O]
l��1��p���-��)OH��RN� ?��=����r�Fk���ȳz���B�x���W�צ��}��yg/^���>��Ҕuj@Χ�*]�o_O+�(���IcF]���%���J|��Bȁ3�l
l9<8�k_ �n�C�'i8��7p��~�7�z�[���=̶rV1.�R��
�D:�1��f��%h'�[�I�����䍶��!6�r��i-򀾣��(�9]8q�!�� =;=�A�-�=��bh�4 uF�.�<vt�Tm��?o
7���	;��o��m�Fu����Ie��\��~��I�WS�����ӭ޳M��d�Va ���G�.E��dP�^�~�|��r
~���~�o���P�GqSZr'��S�|⋶'9ͼ��z��uB�wS�PA��}�e8t�
��k@�.4���$oDj6
ѭ%�k�y�G��In�u�L5fg���5��y���������!BřL���<^�Pr�F�[҆����9�,��S��z`�l��r�\��jx-D[���5�_Ґf�0zF����<����udf�BT�4���Q$�,��v���,BqCM�`�D�e�G�j#g�BWޔ?�F~jEn���mfm��q.�8 �/�5*��_�g}�*E�O�:1�I�$%�'�+�B:�w�4� ^H�PY�2��������OF��7�t�r2y̛�3���v�~��¤+�`"Т+.�s�֟ʮ6�tFl���j)�d٬�KZ�JA}�_;�e$�"�$��Qt//�.d�����3�`?-f�D�C���ˍ�a��23��j�]�ܲ(4��������
ߏ[`�~p�Z��C��=��I���9��xN�9Y�L�u���!����^l�Z�!�� ��_κ$P��T��^�95�P-�����jT�̮���� JK��)��t 5� ��B��6(���+��Ff�jD���e��X-��Um~l�'(Ү�[�?��-�Zߤ*^G����v�p%�Vԏ̖<'��;h�ʥ��,ע >K�#������V�8�����f�<���6R�\��)�%���}ɽ�k=<!���ַ����l�_1o@��f�d&���J��8�L�I�⽨$�qVX�/���R��@*Yh?���	�lp�ORJK+�䦴��z/����-�3�� [{S�"���^��s��:��c�n�C����}7�0�s#��ݩe�����'(&ӉgT�2��4��8�'P'�*k�����޽�Xg�p��F��u�_ߧ�)��*����g[���q�	������r1��"�Hl��VC����t�|I�W�7�XbY���k ���5�AIr�� ��Ɠvn���a���
�����E�x"�}��<�� ��%�5����XN���:f&�Ca�:���P�������I���78�E�	�D�p.�l���)4Xa����ãR
�]���6�6�$��i�jɒE�CE�~���q-�)C�r�����MBARP3X�9�\b�G��)8���E�#�3�NSM�>@�P�+���$��׈�Mg�aX?���Ey7V_�Z���ڪT�b��^����1���{o�ٳ'���uq�曾
��Û���p�,��ijR��� x�I��� �27�,��������qn;��f_�G���) �W!�A��:	���.�D�_�,g�3�'}@�P@�Lf�]K��V"��V"��o>���"�=m23N��d��9J��L�-����0�X�}=T��OVj3(t*�L
��eU
?���B6����}l�C4��OC7�5+8L���gݴ�SicG��i����໬�0��)����s��+��3M=���]����QΘfy������ddm
@��ME(o���x�"3!����b:�W��X�M�FHw��b�\	�Rر����9H�,W�o���LDTS;�2�o��b��
-�
{f2��p���e
=�y��ڐݓc���������yԶM��l8
�%d�`Y�{�a�Ef[�)iD�N�R�b�ޚɚ���5|�L��O�z"�L�=ߣ;���wd*?���<��ߨ���X�'���9ȭL���VޅAh�7ߣ ++�>�Qq�ק�*��A��1a�#�GY�~x�]p(S�U>EQ�jR�ޭ�X���n�$SKP,��#� ���U#�pI4@6��r��s.N7�p���+����ج_��o�-"�����I�b<z��	������ڬ�Z�P ��,ƛ����#�,��	/�m��p���j���Ca���]��_��I�T��~O��T� �2��z_������i�
��1aX3R:�Ѫ7o���"B΋�jvx�=���[�F˕t���X�'�U�wE{
��'�������)��R��}��$�*	�x��79�V5�	��#�r��D�����Vf˶"Y�1g�t�_�k��eQ�j�!M��:��
Q�1�Ƣ;�9y���7�|`�q��&�Ϯ��L�D�@P=|���I�X5?0���R`��4��b��ķ�윲o7(vӕ7�J���cp��\�|�����#Gt�,��V�	���EC_������MG#lf��1��������\���T�70#$�4c�%4��z�@_�Dwzn�������2#Ҿ#��(�(�) �;�?,�]��m��T��S�0$�y��R��Z�(L�h�ϋ���`�4LX
����V�C�^�W�K���6O����iyf�?�#����3 �W
+E
n��+H �ԁ�R��qThM�dB0P!���︥�Ů�m}��5Q�i�J�6�3�O�~��ڱM"�w�,�ri!k����O,t��E�!��� sw�B������w���C�r�y��{�0�	� ǬH���-+th�l<�?��#�lp���R�	��|�E����츛^!Z�I�HU�SRD��t�*��0��GNά=�
��A�;ǲ8��? ��#-0�c8Բ<��kB�.i�:޿��,̃��Z�L�Df�!@��M=��r�p�͉��q�A1Fn��6Y�l��D�B_ug��������D����:��� �K1 �K��ʵiKA''��e�%�,�_��4ʄ����H��m��3���k7�=�����L��2�=���Ǯh�Qx��P.�y?G������_ͩ?z�yyb3hQ���;�� [���	)���B�_��AD�{��h������d�5k?�xH����w�_�x_9�鈶��� �.T�����\����~�o�4h�5�ff�D��k`{��ٶ���&�='��͸�)2J�2�,����|]�`B�u��<��9'W��]�&>�P��.��?B�APr�{�D7��vς.�����p�Q��� ��_��ӝE��Z�J �oۨ�t��Q?TsP�P�n��C����3f�'����OL�7_���c��O��R��v��K�7쓤<��f��}��$�)4s�)W/��t���o$��}�Qp�ϙ��Pt�Q�|�"F�}:���^��t�^*���j�}�l:��o�t',~�4�:���i͏|���o�;S͏_��T4�L����K=�vl[@�\��[!�h6i����!��><�d,듳|׃����󫗍�����l��PB4�y�sN�VLOz���"Z������6&ps5
R2?��}�UM$u�eg�;���(��¦t~f&�&S�7w�P�"?z�w'�ֲ{vcWis��Ǣ��Qȸ:�=�;��
V���7H���m����s	 �l�.,=��{�>�?vDaBI}p��!��v��Woi�������A�k$U�[{Nޣ�h�J��X���X� $�R���� kW$��� (7�M�s�Y=�BH"TN*�X���s��(��R��Z6��f�3�a�䆆4�I~")<l�"��G�"�N�ݩ�w����?���gJX�?o���,�wf�g�$�v��[(����ozw��px��«����4�@�
�,�<xo�x�ww��;Q�D# ��.O^>SfΗ�-�v������~��k9�7T��ǀ�y��X��tD�nوڣ�EGp�ĥ謫o��.?�U=a�\}�;�wM|&�$0@����8�����
bh�X$���(/�����J���K�1*6�Qw.j�@��0�9#�N7���vpF����Õ�X�	�[û�n�O����Ȋ&��cp,��kq28Y ����2�TB\��c1����6~���'yVe}�g`�c�#�ztH�Р�!*P�4�(^VT��Y5�!��&��MdÒ�"�e#J	�̆�撚:Y�ouY�ap�������j7��uPSr���̑A���t������R�eBL�*�Teo���8u�ǋ�X*\|өpW`���ɔ	$�~������<;�z��ۆ*�P�Gh
	fTO#�6@D@��4��@W���� 3�Yh:��`z� �H�.�L#ꋇ_�'{�e�_�]�0Im<��O":���ꉘ�X�f�N;�f�5hU��)��V�䯵�8��g*	��f��c>=�����`:6�Zˁ��;
'4��Y#�_z+����-	� t�O.\�"6�����%x�4���܊?�/DċY���)�̤�5�i�b��KF�#�!�ˌ
+8^���:X����r�~L$E?4��h�D�eǆO�|jHl�]�ْ!�@J��6fA��.��<唟��L�0>-M$��.j�����ؖQS�����a���Yˡ�<T��\�Q���~�i^
{[l�<�Y�1��A;K$Ò��Jq��h&�i���E��Λ��"�I� ʓ�G��'�~Z���ozh��Q�ֲq��=#��Xv]3��N2� 
�������b����>��R���-��KL���"���Ѐ}�?՗��J�ڱ�疊i�x�!���q�5o������D˰�OS_�' @Z�f��T�6YU����%��kx*�0��,442��F��-�3���f���goq���w���Gx���P���o��حX�EA!@r�����]xW�Ѝg���{�^!�iկ@�0 �)�I0�I�P���HP�Q�#�,��U�UK�:�P��k��g{ۖ�3��ҍ��V�Z�#T1G��B}���,A��2�� �����s.�t�Qc�txdL�R
��� l��1�.���H�eXRe��Y슡cYT���r2���$�W
��2k|�!����t.�S~d���<kP�@ ���؈Rb�蓋���X�5y��W��d}2_��HˋR;��1 �&ʴӄ
0��)u���jf�#[��>k�_��$�F&ǅ��J���iTH����{�.>-��8LV	(���OT����ś��R�и�ʧ�kp�_2�$V����t�g�n~���5(��� �x�7Ҋ���i{f�u��;��j�˨��r�6�̣���ڈ�t��za��3N��b�ї	H�$ ���
c9X��agm�(i�,9F'+/�����ӈd 5�
U ���q�DΊ9F7���4����le讐T$�ʪ��).��&�xr�����&�Ux���l��am�#�Y���5U�l��Q	OvO>�Cr�6����-4=п����W��[ "z���.��xP욡4
�b���]�D�G��T���e���鏽�'m�H�W S�� �����(SI��:���g�\�)����B�����7	"f��n�޷;3���
@a�&��_��f.���v�#�"����y<3~�8
~��
Aa�ga�@��5V���Ю�3ժ���W��-\JJݫ��?�L���Gͫ���&��J���5�޹<���(��N;�O���vs�Ȓ�O ˣ�@�����F��pC������c�xٶ��`�e.q"jǜ������yx��Ύ��}�4����v"^?�Y;`�?&��x3_aX��s@��ʈ��<��۸���-�i��"��B�ǎ����D6���͑�C��bj	���܄�U�v;�7���M4�eӬ��?5����|@�6��L�c�|���ndZ����b�P�`s'<HUNv�RBq�B��u�<�N�2k(%B�u���K�2V�Ց c�4|5���������N�<�.*�5 �^BTP��B��������?ݯg��׽3����,�,�cTD�M?l�P]}P�M�+�k<���|۝}���]A�U.�&y�Of;�7Rn�!J *@��䀣��Ⱦ��'���(�ct���+��Ԟ^z߂�%>h9A��^���&�@{�v�pO ����9�3B�DK�����n��Hڝ�f��[���I�Ez�; �����U+��i_s���OD�p�j� �it�?��f�g��TZ|�+����Q�6}��L��)UB /��.i����yq0��J�0<���a����LM�+y�Y�Q]
̗�����w
lEe��i�kT����1�^���E���;�'N�	�� � ��o,��b�K�Iq�D�gy�(*;��nrN+l��榪��ę�L0��;�ꈤo�3��zyN�&��&��eE_8sҹx\J��{��>���;�yӐ�3O�9�FW�Pq��־-�pg�g'+�*������Z�  �E"�M��)7HW��>�������dx��^s�_���Wg ޓ0�x�ۋ$��U���&�F�P��Sӛ��TV���h�Lj�mo�9���Kx�g����t�VKT�scpupdA*޹���'G#��q�A���������
�6ċ�t�m|L��3_ŭ=C�?>��82u
 ���5��D�)����� �������78Ώ�8LV����b�-j�n� �
ĵ �k������n���>K��� %d:^�E8�>��|=�
ـ���m�1wE��.`BQ���3���X����(�5�+�SQ�v2z0��$�0�!�p�p+D�N�ɼI1j�&w9�;:�c�R���"U���ǘ�F�[�
".�S�Xus2D�鯻��z�l��99��W�ٸ`!�CDW�>j�RM�x�E�M���K,(%(F�)��� ���I�Yx����d@RC�DǡP�������?A��BC����W;c��+�UH�Ж�+�ő�Ώ��\�ݺe�qa&�-[T�nd|P-4��ԖԺ[;�F�n�����s��G
[!�B�*��_��5s�$8l�IaP���1YE���pY3���z�<���Oy�H^JP$#�ݾ�a���Y�d~d�эD)}������,[�0U����-"��v\�� ����ߠ�*�F��T	ҕh6o�H���/=�w)k������6�H��(�x��NT���ǂ!��T�i[�ZAu�/̴L�L������?´zd�߇�i+`J�s(
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _keyLine,
      _keyLineStart,
      _keyPos,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = Object.create(null),
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;

      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }

      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      typeList,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockInde在してはなりません"
    },
    "landmark-no-duplicate-contentinfo": {
      "description": "ドキュメント内のcontentinfoランドマークが最大で1つのみであることを確認します",
      "help": "ドキュメントに複数のcontentinfoランドマークが存在してはなりません"
    },
    "landmark-no-duplicate-main": {
      "description": "ドキュメント内のmainランドマークが最大で1つのみであることを確認します",
      "help": "ドキュメントに複数のmainランドマークが存在してはなりません"
    },
    "landmark-one-main": {
      "description": "ドキュメントのランドマークが1つのみであること、およびページ内の各iframeのランドマークが最大で1つであることを確認します",
      "help": "ドキュメントにはmainランドマークが1つ含まれていなければなりません"
    },
    "landmark-unique": {
      "help": "ランドマークが一意であることを確認します",
      "description": "ランドマークは一意のロール又はロール／ラベル／タイトル (例: アクセシブルな名前) の組み合わせがなければなりません"
    },
    "link-in-text-block": {
      "description": "色に依存することなくリンクを区別できます",
      "help": "リンクは色に依存しない方法で周囲のテキストと区別できなければなりません"
    },
    "link-name": {
      "description": "リンクに認識可能なテキストが存在することを確認します",
      "help": "リンクには認識可能なテキストがなければなりません"
    },
    "list": {
      "description": "リストが正しく構造化されていることを確認します",
      "help": "<ul>および<ol>の直下には<li>、<script>または<template>要素のみを含まなければなりません"
    },
    "listitem": {
      "description": "<li>要素がセマンティックに使用されていることを確認します",
      "help": "<li>要素は<ul>または<ol>内に含まれていなければなりません"
    },
    "marquee": {
      "description": "<marquee>要素が使用されていないことを確認します",
      "help": "<marquee>要素は非推奨のため、使用してはなりません"
    },
    "meta-refresh-no-exceptions": {
      "description": "<meta http-equiv=\"refresh\">が使用されていないことを確認します",
      "help": "制限時間のある更新が存在してはなりません"
    },
    "meta-refresh": {
      "description": "<meta http-equiv=\"refresh\">が使用されていないことを確認します",
      "help": "制限時間のある更新が存在してはなりません"
    },
    "meta-viewport-large": {
      "description": "<meta name=\"viewport\">で大幅に拡大縮小できることを確認します",
      "help": "ユーザーがズームをしてテキストを最大500％まで拡大できるようにするべきです"
    },
    "meta-viewport": {
      "description": "<meta name=\"viewport\">がテキストの拡大縮小およびズーミングを無効化しないことを確認します",
      "help": "ズーミングや拡大縮小は無効にしてはなりません"
    },
    "nested-interactive": {
      "description": "ネストされた対話的なコントロールはスクリーン・リーダーで読み上げられません",
      "help": "対話的なコントロールがネストされていないことを確認します"
    },
    "no-autoplay-audio": {
      "description": "<video> または <audio> 要素が音声を停止またはミュートするコントロールなしに音声を3秒より長く自動再生しないことを確認します",
      "help": "<video> または <audio> 要素は音声を自動再生しません"
    },
    "object-alt": {
      "description": "<object>要素に代替テキストが存在することを確認します",
      "help": "<object>要素には代替テキストがなければなりません"
    },
    "p-as-heading": {
      "description": "見出しのスタイル調整のためにp要素が使用されていないことを確認します",
      "help": "p要素を見出しとしてスタイル付けするために太字、イタリック体、およびフォントサイズを使用しません"
    },
    "page-has-heading-one": {
      "description": "ページ、またはそのフレームの少なくとも1つにはレベル1の見出しが含まれていることを確認します",
      "help": "ページにはレベル1の見出しが含まれていなければなりません"
    },
    "presentation-role-conflict": {
      "description": "roleがnoneまたはpresentationで、roleの競合の解決が必要な要素をマークします",
      "help": "roleがnoneまたはpresentationの要素をマークしなければなりません"
    },
    "region": {
      "description": "ページのすべてのコンテンツがlandmarkに含まれていることを確認します",
      "help": "ページのすべてのコンテンツはlandmarkに含まれていなければなりません"
    },
    "role-img-alt": {
      "description": "[role='img'] 要素に代替テキストが存在することを確認します",
      "help": "[role='img'] 要素に代替テキストが必要です"
    },
    "scope-attr-valid": {
      "description": "scope属性がテーブルで正しく使用されていることを確認します",
      "help": "scope属性は正しく使用されなければなりません"
    },
    "scrollable-region-focusable": {
      "description": "スクロール可能なコンテンツを持つ要素はキーボードでアクセスできるようにするべきです",
      "help": "スクロール可能な領域にキーボードでアクセスできるようにします"
    },
    "select-name": {
      "description": "select要素にはアクセシブルな名前があることを確認します",
      "help": "select要素にはアクセシブルな名前がなければなりません"
    },
    "server-side-image-map": {
      "description": "サーバーサイドのイメージマップが使用されていないことを確認します",
      "help": "サーバーサイドのイメージマップを使用してはなりません"
    },
    "skip-link": {
      "description": "すべてのスキップリンクにフォーカス可能なターゲットがあることを確認します",
      "help": "スキップリンクのターゲットが存在し、フォーカス可能でなければなりません"
    },
    "svg-img-alt": {
      "description": "img、graphics-document または graphics-symbol ロールを持つ svg 要素にアクセシブルなテキストがあることを確認します",
      "help": "img ロールを持つ svg 要素に代替テキストが存在します"
    },
    "tabindex": {
      "description": "tabindex属性値が0より大きくないことを確認します",
      "help": "要素に0より大きいtabindex属性を指定するべきではありません"
    },
    "table-duplicate-name": {
      "description": "テーブルのサマリーとキャプションが同一ではないことを確認します",
      "help": "<caption>要素にsummary属性と同じテキストを含んではなりません"
    },
    "table-fake-caption": {
      "description": "キャプション付きのテーブルが<caption>要素を用いていることを確認します",
      "help": "データテーブルにキャプションをつけるためにデータまたはヘッダーセルを用いるべきではありません"
    },
    "target-size": {
      "description": "タッチターゲットのサイズとスペースが十分にあることを確認します",
      "help": "すべてのタッチターゲットは24pxの大きさか、十分なスペースが必要です"
    },
    "td-has-header": {
      "description": "大きなテーブルの空ではないデータセルに1つかそれ以上のテーブルヘッダーが存在することを確認します",
      "help": "3×3より大きいテーブルの空ではないtd要素はテーブルヘッダーと関連づいていなければなりません"
    },
    "td-headers-attr": {
      "description": "ヘッダーを使用しているテーブル内の各セルが、そのテーブル内の他のセルを参照していることを確認します",
      "help": "table要素内のheaders属性を使用するすべてのセルは同じ表内の他のセルのみを参照しなければなりません"
    },
    "th-has-data-cells": {
      "description": "データテーブルのテーブルヘッダーがデータセルを参照していることを確認します",
      "help": "すべてのth要素およびrole=columnheader/rowheaderを持つ要素にはそれらが説明するデータセルがなければなりません"
    },
    "valid-lang": {
      "description": "lang属性に有効な値が存在することを確認します",
      "help": "lang属性には有効な値がなければなりません"
    },
    "video-caption": {
      "description": "<video>要素にキャプションが存在することを確認します",
      "help": "<video>要素にはキャプションがなければなりません"
    }
  },
  "checks": {
    "abstractrole": {
      "pass": "抽象ロールは使用されていません",
      "fail": {
        "singular": "抽象ロールは直接使用できません: ${data.values}",
        "plural": "抽象ロールは直接使用できません: ${data.values}"
      }
    },
    "aria-allowed-attr": {
      "pass": "ARIA属性が定義されたロールに対して正しく使用されています",
      "fail": {
        "singular": "ARIA属性は許可されていません: ${data.values}",
        "plural": "ARIA属性は許可されていません: ${data.values}"
      },
      "incomplete": "次の要素のARIA属性が無視されても問題ないことを確認します: ${data.values}"
    },
    "aria-allowed-role": {
      "pass": "ARIAロールは指定された要素に対して許可されています",
      "fail": {
        "singular": "ARIA ロール ${data.values} は指定された要素に許可されていません",
        "plural": "ARIA ロール ${data.values} は指定された要素に許可されていません"
      },
      "incomplete": {
        "singular": "ARIA ロール ${data.values} この要素に許可されていないため、要素が表示されたときはARIAロールを削除する必要があります",
        "plural": "ARIA ロール ${data.values} この要素に許可されていないため、要素が表示されたときはARIAロールを削除する必要があります"
      }
    },
    "aria-busy": {
      "pass": "要素にはaria-busy属性が存在しています",
      "fail": "要素に aria-busy=\"true\" が設定されていません"
    },
    "aria-errormessage": {
      "pass": "サポートされているaria-errormessageの技術を使用しています",
      "fail": {
        "singular": "aria-errormessage の値 `${data.values}` はメッセージを通知する方法を使用しなければなりません (例えば、aria-live、aria-describedby、role=alert等)",
        "plural": "aria-errormessage の値 `${data.values}` はメッセージを通知する方法を使用しなければなりません (例えば、aria-live、aria-describedby、role=alert等)",
        "hidden": "aria-errormessage の値 `${data.values}` は隠れている要素を参照することはできません"
      },
      "incomplete": {
        "singular": "aria-errormessageの値 `${data.values}` は存在する要素を参照していることを確認しましょう",
        "plural": "aria-errormessageの値 `${data.values}` は存在する要素を参照していることを確認しましょう",
        "idrefs": "aria-errormessage 要素がページ上に存在するかどうか判定できません: ${data.values}"
      }
    },
    "aria-hidden-body": {
      "pass": "ドキュメント本体にaria-hidden属性は存在していません",
      "fail": "aria-hidden=trueはドキュメント本体に存在してはなりません"
    },
    "aria-level": {
      "pass": "aria-level の値は有効です",
      "incomplete": "6より大きい aria-level の値は、どのスクリーンリーダーとブラウザーの組み合わせでもサポートされていません"
    },
    "aria-prohibited-attr": {
      "pass": "ARIA属性は使用できます",
      "fail": {
        "hasRolePlural": "${data.prohibited} 属性は \"${data.role}\" ロールでは使用できません",
        "hasRoleSingular": "${data.prohibited} 属性は \"${data.role}\" ロールでは使用できません",
        "noRolePlural": "${data.prohibited} 属性は、有効なロール属性のない ${data.nodeName} では使用できません",
        "noRoleSingular": "${data.prohibited} 属性は、有効なロール属性のない ${data.nodeName} では使用できません"
      },
      "incomplete": {
        "hasRoleSingular": "${data.prohibited} 属性はロール \"${data.role}\" では十分にサポートされていません",
        "hasRolePlural": "${data.prohibited} 属性はロール \"${data.role}\" では十分にサポートされていません",
        "noRoleSingular": "${data.prohibited} 属性は、有効なロール属性のない ${data.nodeName} では十分にサポートされていません",
        "noRolePlural": "${data.prohibited} 属性は、有効なロール属性のない ${data.nodeName} では十分にサポートされていません"
      }
    },
    "aria-required-attr": {
      "pass": "すべての必須のARIA属性が存在しています",
      "fail": {
        "singular": "必須のARIA属性が提供されていません: ${data.values}",
        "plural": "必須のARIA属性が提供されていません: ${data.values}"
      }
    },
    "aria-required-children": {
      "pass": "必須のARIA子ロールが存在しています",
      "fail": {
        "singular": "必須のARIA子ロールが提供されていません: ${data.values}",
        "plural": "必須のARIA子ロールが提供されていません: ${data.values}",
        "unallowed": "要素には許可されていないARIA子ロールがあります (関連ノードを参照)"
      },
      "incomplete": {
        "singular": "ARIAの子ロールを追加することが求められます: ${data.values}",
        "plural": "ARIAの子ロールを追加することが求められます: ${data.values}"
      }
    },
    "aria-required-parent": {
      "pass": "必須のARIA親ロールが存在しています",
      "fail": {
        "singular": "必須のARIA親ロールが提供されていません: ${data.values}",
        "plural": "必須のARIA親ロールが提供されていません: ${data.values}"
      }
    },
    "aria-roledescription": {
      "pass": "aria-roledescriptionはサポートされたセマンティックなロールに使用されています",
      "incomplete": "aria-roledescriptionがサポートされたスクリーン・リーダーで読み上げられることを確認しましょう",
      "fail": "aria-roledescriptionをサポートするロールを要素に付与しましょう"
    },
    "aria-unsupported-attr": {
      "pass": "ARIA属性はサポートされています",
      "fail": "ARIA属性はスクリーン・リーダーや支援技術に広くサポートされていません: ${data.values}"
    },
    "aria-valid-attr-value": {
      "pass": "ARIA属性値が有効です",
      "fail": {
        "singular": "無効なARIA属性値です: ${data.values}",
        "plural": "無効なARIA属性値です: ${data.values}"
      },
      "incomplete": {
        "noId": "ARIA属性で指定されている要素のIDがページ上に存在しません: ${data.needsReview}",
        "noIdShadow": "ARIA属性で指定されている要素のIDがページ上�export = LeadingUnderscore;
declare class LeadingUnderscore extends BasePlugin {
    /** @param {import('postcss').Result=} result */
    constructor(result?: import('postcss').Result | undefined);
    /**
     * @param {import('postcss').Declaration} decl
     * @return {void}
     */
    detect(decl: import('postcss').Declaration): void;
}
import BasePlugin = require("../plugin");
                                                                                                                              @BZo.Bp��Rܰ�;���Uq���Sbp��˖�8X�&�j����O�{�M�7,����}r�3e^ƶ���
�G�o��'�va(Dn�t�46�`�}�%�감7+�����I]�c�QK��7�@�^�:�I��Ω�M��{XV%���%v�e&��ПƩ��|����p�fw�wruj4�XQbl�K������M�.���(�\��9����� 	�,���M:7���G-_�l��cS�L��y�����e1ȎI�26
��͙�`�6�[�������J5a�<��J�fk�޾L���pܸS��^����;�|���.ߊnd�ck��*O��'�8�	��KiT�D�ҡ��t9�r1�xً(bj4/jQ�]�U��2YQ�<���&8-��������tm7���l�T��"2�������h�4��[�M�a�k:t�	�"NǛ1�*��&�r�#�R.�:`�f�#'��&N����h���1=u��Q_�<�R�5
�R�R�l<s��` JvDW��ά�������Z��.�wk'5;B�,��W���&�
^�?ҿ�3���
�>V �>m��L���.8dj�M����/t�+�s?1�dbd �Qv��_�k	6G�gL�5��^&6�D��@0Ry
[DML+#X���[;'��%�_��
 �ZW}���|�
�Y-OשD=������t�>({���t���'��F��y���aς�I����;�/n+������y-Q0�c�_<.cI ng5���:t��^�]m�K�r:���ʆiWy��p�I5T�yp݊�M�l
���L ��z1q� w+�H�b��ˌ���=m��H�Ր�}�>|:2
�9�v=�v=���է�;̽ ����NΣ}Τ[A�5i�sL�$����&��V�?B�a֫�h������_�2
W�z|�sW�pBJ"��r��}fc���ד�c������+L���Ss�E�*2���R~�zP����w����
M�/�1�^�MK�@�$�F}E�T�-D�6t��M�Sd�Df��A���K�.����vU�8~�_ʼ���ėv�M�h��8ޜYTɚ��9Ѐ@�AFg?�?�
��#ن!)���Y5�U��˵ )-�m�E�!�(����Ԇ۶�(�E/�2��N�K6ց�>�-6m��Ř���4�O7������P3|a�O�(�Ŗ:Nf���5� U��/Y�@8��lR����v��q�ʉ�Ki�^,�eh�3�	�)�� $g����:[�5�A ���.B�
��Ȩ���IdZ` s`�1�ȇ��ok�HǕ���nW�BYl���91i�ҧ球I%�Õ�SJ�Q��v�Է+{̩�@
o
F�-�)��߯M�����h~�1A��  1G�~n0��ơ����}����/\�������х�WKa���F=rg��)WA]��$�*�@�o��g�+o�j�	�pQ.�wH��i�V�.�4�߉,�Q�@�竺$���.r%"֒ChZy0 P�  GX��ڧ�(!��A�s'�A���;�U�׷�@.O� )�\�'�����̺:E���;Fʏo���@
�~�������������e@4X �(���栘�{�� �oP)%�������7�CHCf��
�C�#O��X�o����2�'�f}r(] ��n�����5��]��j��9Y�qH�:$7�Lb���n�(���Vk���M��_�9|q��_�J �����"�:?+!�2���"��zh�+#|�����T'!�|7�Yw���t��x�	�k��������#�`���}��G����F��I����B�D��+�����#w+�*�j�@��3�_W��T�C0�dK)����6p�-�Q�����Ğ�a\s����<H谎���l:��*}�(�@��j�s����\x�Y�O�c����!�F��eW���~6��@�!���X�Æ!:l0+�ש��iox|Th����k2Y7=##�&�D�Q́E��Z�Rf�݋u+��)����S,�s�)�c�U_I̮o��\L� ͒Q@}�$��U����hVK9�����`C�`�.Qvgyk�����;Pq*�� ���Gʇ���aE{�u'�J��A>X�H����E�s�#$�����V���۫z�G�
^�Q�q��pjv��C�Ǘ�.푩��KsՊV���caI(~p�̟������|��[��+^X��U���M����n(8�˩ҚcK��G��;�!CNY
-���[��K�7�8L70Az�kH���4�cL������������n`�:w*I�H/���~��x�i�%������ Tj$����|�����
mZ�/%-ZȔ5\�o�$�L̇��j����s%a��==@�x�V²X�[�z-��$3J'����"8e�g�@ˉ1O�Z�Q g<��
��peW&r�hH�p��P
�~�cF�t�KV�~����x6�
�y�D�'CTĉ�1�>�n�]|V��\�
���Yu:�ٰ#���/�pf�Q�'.N=e��nY�3)`�=��x*/��� �H��Ҳ?��?�4�$h�uP�T�����"��$l�ؠ�Nc/�²U�&X�=��j�K����1�p
K��L�/���|���>o�D�"ǂ�~� �1�ۺ����}of4^�F	p5U��&k#��I�1�/aJ��߻��M��A�Y�cEçjѰ�n�a�9\SUǒ��ׇsg?/�MmEe��A�d���0TR�$(�i�/�*A�DRPYjz[qԜ
�j>��8)��rvZ�^��?� `0(��3v�{#��@D���)�R�ݎh�Č�&����Id)��xR}�Pe�O�`��i/�.B�E%|�A-�^���&���=��#�V�4��T~���p"zR��ω�-��2���p@Q����}�
6�����]Z�q�si���}^�$E���@���ꯒ��~�®Lik*��1�~�C��������h�W�7]Bv��8�wȳO�"�w�d�>������K[S�B�fزЏM����V�]_V�\�H0댃�􂹨����q]cs��tn\)��إ_4�<x�ryr�e��&���ˤ��I-�&oy�]�Ă��v�s<Aϟ��t��5�G��v�{/w�{o���3�f\����=��!"ՙ���X��f;6F�d"
�7�K�e(�q�&Co����-$U�/��t�%i�$�|v,�$n��c���y�]��H4h:�X�N2�́_7���L:_�
/l$�K�0ӿ��#|~�x��X<\
��k˂��o��{<��}Jê�2�*V?]��P��1K��m������C��;gg�j����=�v^��b\iL���
܄�U��X'�Y��!`Ҝ�����dG����
ř ��8վō<�J_����嚋�M��7���Q:hI���`]i�Ui���qǻ=��d~o��P�3�cI��
�d����uUI��R��#=���p�V�W.�6�eC�	�IT�[�wѨ�~�L�7�Q�Y33�d7���T�cQ �bc��r���:=�C��m�-���߉>cI�� �gh ��js|�}
���
0����`q����̈�����>�-^�/�V���?[{���M@&�O�W�<�ܟ�v�_��k��	0��L��5*'f`��u	��6���Q;f��".�pq��BE���BL������/ �ј�? nW���~�O��eVc�&'��.BX��73��V�Bp�C
�a�V���k��;�B�����~9)����A!��g H���P5=!���1ʎ���9��|`-�(�o��Pٜ:��D
��-^�����9u���~�(�8��g���� ��������"?���b�ø��aT,��`'��)q��vo�v�-ɬ�X�ɞ�@1ߋ�)��'�6�elV�2|�WZd�ͬ���G�9.kr���/B�ZI�̳*��c�"2e'9n���y���_P��E��@�j6]z��͜'���BX�^7$�T���Yyպw��;,D�-��<um�73�=Z��<��!Qe�H,G� F����HX&�`�[I���d�R��� E(_h��b���3��(2�4AXb��F?���K㈄�
��P�~��Z�;u&(.1{Xܕ�ps��j�C�leВiIp�q�S]�PO	��F;�+����3��(}��< �� ��#��+t�����є���^��S��PD��#�%КpʱP�[F�z��N�zh�m�Q��?�pǡ�$��,U����ȋ4�v�[�36*�%j��pf�U����s��5�lF�-��N��q~�;����A�ꅡ�����w��~�tww/!xD�r
�H����H��tP�oF�� �i��jl�xqmIx�����+����%��}HEqZ
�:5t�dmY�
�N��@�(��x�^Q�>$�vJ�U�~�aF���T�+��Bی���ݸ�eq���!�(x�C��4's��Y�1��UK�}8����:O!���m���c *�X���hO��#�Y�����c,�}f<�g���*��I�����C�v
���F�"\��^;ӛ���"EVe1��3K��en�g���[mv~�n�
�<�&�`Ҿ͛aS���m��
���� z��&w�z���{������Wێ|�R�S)��^�m˖6��!O��d9���`�8?���<���
a�J��51��헫����ͪE��h��n�dku�Z?%�T�5m� )����V>�����p?��.����G��5P� �tSH(qxQ ^9�*��&�xUH��Fq�K5�;�?B{ ��Ś� p���e���if�9 dLSu5 	�%�.�o)��Q.X��-E�ܢ�h��,�w0�����9Ǔy��q�S�)�3����3�:��LF�����9�Bޙ��g��;�#T<������di��%Y�ݷ�r�Yt2����$I���^�@nE��:��x>�x*5�t����XiƸ8��[\2�d"�xM�MW(�����@(�D�ٝc*>&������46I9��B��z	KW,ń������h��iY�${��x�L?)
�VF5�Щ�Ue��9oW_"��=���*���������e�Z�Ɓ�Bѫ���6�n"����ȝ�~
�u{�]O�k������S��O[���p[��[pD�9����w���t"�N{��"΢\�+��9���Cƻ�a��~8��@F�f;� �a$��! �AH�]+�WT]�N/����\���������I��wAs>=9�O�O���G��qk�~n)_���f����!rB���F�nkh���*��O��XÁc�7Mx9�@��5˾�VZ/��۵���TcV�t2�҇^�-���\�^QSnΡ�uJ���Z�{�$�w��%�? s�C#��~�q���(��/�}�!����(r��*
O��yA��tg�uχj=J9
��J��@�8>|�WY�g�TKN�����?܎��FY��)���{��e��A̣���S�D���z�aPB�%.��=�u�h�?V}k� d�d�����r�2����F������>�2JI�dGC�8@3!oR��hF��	q/U�Zk���W�Sn*,�'o&���E�R��l���W¶�6����zW�T1xT���RSMN��,鼋�w�}_�[&�ށ�4�NX8A���ؕ~ \�S��:�C(E�x�;ǉ�V�**�$B�w@�nt�:,߻p��9㱎/٠5
#�M�#9I�=�m��]���������+��(H����B0����>2�����?0ǈ��F���C��ď�Y�ק��Œ� 2PC#�2EW�w�.#�� �e�͉5����V2�!6�v|�tw@R�&�#�lw���eA��7a__��oz��ڣ�2w1Z�-�?�CM���g�g_��E�\�D���zC���!2�m�� ,�{4�>�bs�#$T�0}�>��V�Xډ��Z�o]	(j�z��Ra�a�dj� YT��V6c��L��o�P����[�Dj�dq�h1�kf�H�f�7�d��.�����ש=�A8�`o5X(k�z�k~���i{_�DK��M��ۢ&��k�	��vY� ���B�Uh
�+q�$!�٬nd��Y�
�Md�
������}$Oo9=�,,$�?�/�&ݜ�.-���BS�C���f�?B����D���p��Վ��N�qg_����L���_y��ۊm�����w���c[����k��s��U�̧��+*  ��hN,�KŇi�䇵��م�=���p�ϸ"!-�D�����g��m�m��Y��@D��j
>ihq�QUh84׍����l���D��8�h�8�_ng��﫳��!��B�c�����qNW��G��f���5���C^8.M�WR���hEe����kd<�.�I�Ӻ�����0�<G���G�:`�<�2}�њ��*5����t&Kk�}�e?��'|�����v'D�q�䀞�
֞J�������D��6�v����2��v�=+�~�_�5mu�?��f��P$���������$D���a_C����0����X#����{���(���I�M�d�{�:����>�M��7�ҝ�����/� ZwQ�b�������\q��Pg�5�G'Q�p����!�����3��8�bj8�c��y���ۢC�d�k��?�x�~�z�
��Dy%�K"st1m�,lHS�ě� � MR9_��h�fY�+i�(��<"�~.�"i���ń}�(�D�T'
 ��޿�xv�F3im�D�/�*��?����F�p�W�ʘ�)�J���Û]�'z�Q�{V��¥U����k������v���u�,���L4�6��&���_{���V`�/��=8-�jJ�t:�& ���;�eS���������+n-Z|c9�Q>[�1�����?���c!�js]&c4�B Ή�,�p�g�W|LI�Ԑ{��d �:�O(2�(��ƋE3��?2SOf����>TC���a5�-'q|��YH�O���D��̗��P` ���ѱ ɻ� ��.{�F4X��F1��"�"���A-��q@(<��o������{0��-��{(5���V���	����s�'�%�-��y�-+�S�@�Z%}~K`�+aS�,ؽ�QS8�񵳱d9��b>ʴ�|K��7A�rz�]�o�:,�CT��U���6Q��[��~�U��A+P���T��	��/��CWG�
�1<x��Wjqn�
�H��\d%��obI�������
��9�)D'f?N?"j�O;?hg?}�{�Ņ��g==*~�CPU�C�E���lL�!����RB=�,v��0�<�Q�r=$��X��/^�Ճ�q�5ۄ�8Mj����mh�qr�2FN3������Ӹ�F0��C�j	��}�szJ$*���p�L
[� ĶQ7y�M¥J�g�Ŷ��NG�\��3�
x �][�p�17t���0z�8�zTA*^�h��}QW�Uj%Mx���R���c�__��W�M�!�*�A�݇���V�S��
xO���5��N�%��O���Vm=X$��N,�	�H���)0�� �jю$�
���#s�O�;zi��,�PR��G�Gm3�ɗK����'UL�S��_��6K~b��@��x����0N�ѺY.�ߌr��+���u����*�m;�Z՞��kwo�8��(Rj�y1oJ����+f�$v9�?B�AP#��t��*���f�^�˴��=0�Iut��=1�b�!��~��m��"��_J1��x�	�pC�~t�H/��ĭR,Ȩhu�	"�)ӕG��Άeb�/쫦�����n�6O�h>^Næ$?��
˼��إ��$zK�= �a�G/��W�᨞U�_���Z͹�s��&�J��B�y(���ꊦ��ś�$��VS.a-�1�LF#���WfT�x�wξ]`Ա���84��L�4n`�K��� ���J��}؇.'���'�����L��B
j H�Jɽ�h�P�n�}��n1<��������oO��|{���~(�;r��py�hx�ء$e
o�^`�(P��#�g`���@�S�2�H����,dN��bؚ��:[�$�\�g�U`"@38|MD�8��B0W��\ɓ^+�%0t���$�}ԇ��11��'��v�8j0�wxV�dϣz5���Yơ��b�����f��i���w��d��El��)z�ɒ�A��soq���:�8��� ���5�*�c�%�x� �AFtƼj�6�.�5��Kg0�Wy�w`4dg|;��Vw̲�p�`b�B�Bb�y��U���E�7!|_PR�)Ćce3~!:��;�rʟ��8#����E�4ax��J�5�>�ZC�+��}_�;�p���G};4�����F�a,}Y��M��F�2{`�������T<�1�k���T��%�����ϰ�������9¾=+��8ļ��� �"�fτa*W�M,h�lf�_�QO �^�r��Ѝ��a�B.���9�j�P�;mz[Z�H�|���e�Ma��dZ�)��G6��沓��P�V5��o�M��w��o���=*ݠ�M k���qA�
� ��~}�B���w%s�2DAh�A������R������_�_	�-��.�R��a�Uv��	�A�g]���{Bd�
����C3͎Z~�/��7��Y��/R�s:���Wb��&̡*��q> ���>��(�����K�e��8���ᥩ�V1�/
�[��F���Sp-:�]f�������NAO`!�`�^�"��H5B�IS�or86�+�� ʬ�9�=�<$�P��*@������Ba����JC����"zl��;)G]����ۖ9�I��^#����FqcX%&���%f�*�Q3�sG�D�\�w ƛP�&h�T�U�xw���r�=������s�)�
���'H�$t�-sPh<R�o��V��sʉ��H�e��!�Z������K���V)<[[�0Fѕ�+���g<6Z��8/�n���[�b(�^��@eS�EI�va���p�k�Y�>��p|揥#�5͊�Ԅ��2>�sN7
��Ref+������B��S�0Խ2l��s�e� �`��GNl=B�CN1m�R����1�k��,�
�E;r;��6�~2I�keic<&�'���|JmRv��:lPX]Q���eU�C@5�����i�o���U��[Y��k���]u�롪&4�s�����-m4A��������gs�N��7�JE�|���0zi�}[�@��c��k�B5��ו: �C@�A��Ƭ�q't�z���ۃ� �p�-����#�/:�����]������λ�������p}���b3|�B�Qg��/��+��Q�P	C+E����~X)�^��Y��\�i3(�v�)���?S�\�U]�M
�3������گ}�^UR�Rp��z�^���2�����F���@\���SQ [��IB��c�Q��������P�b��Ƒ�{ӂ��ن�_8��~��Ɍ���[}a�
�Ai���^�=�/o�*�iN27�uI,LY����K!\�6�&x����&a�ϵ�U�L��TD����0N�8�O4dr��8>ͺj���H:Cb������@(���L��)�C������v��$9�8�D� + �#9 ��9��j�j:�9[��E�ޖ-�28��AVD��A"�>g�����+\x]�Viw͝� $�H��f��"���"�\��!3������}z#Wꮯx�X�b����V+T�6��㴐�X#�۵����C.���Si��X
-���HKM��3q�T����'F>=tw�{��:�ta{�lKҋ�1j��R��D�����3д6R�S"���*�l_f��||���n�^���M^��l�X_U"�`���A+�O�wQ�4[Y�oPA�Ɩ�.(ղ�ˍ"���D%? �sF�B",�i�+q�TĶ�[��_��]j�Z�.����9�#BQ�ݢ���$hS��h�ef��_�7��E�5���X�~|D�25D�:3���je�KU9�Z�Dw������RV�\X-iX��0<���go���Ʉ� �Q%�#��B���E
�\�����)������=�~�U����iU-xŎ���C�����;R�S�B�(�	αd*bj,����|w
�.��z�XV���,�q������Y�ZZ᭫���/ۥ4��wK1d�D� �A^���N�z�<��k�Ra��X'r�^�k���\\;xQf~�kZ�s?��s9���V�ogPYUړ"kG�Z5a�?xgO�\����O�]!c.�����5Ɯ^%oA]����;9ݮ�;9�;�ao)�>�����g�n���2
�<&����oӺ'���Ii�1=���'
���.��_eD�M�e������ؤ=��^L�Oj�9��3Ć��K5���z
_f&F��<�0aF���7,CwG�-���Ĉ������Q��>�{X_�/����o3N�� �2��`�f?�/�T�R���V�>7�Ƥг�L��J�w�?� �����YC�d��,:n	<hJHi�����Q�.al:k���o� �� P��� hS �4	R�X�L9�*�iܚRG_����P(mKEL����;��8��	�����Q^_Ny��>g�<�)��h�#�k�n�^�gkg�.Eԩj���ޒϼ���L~=�=�_7C�ϥ#���Y\���Tx�8��H�U�����TU:�cfx��C��浕��|���6xM��jx��:L�B:���x(���@�)�#;�@�ݕ��<a�	�\?�_��NT�*����S횊�d�t�[g�4 �]�E������T@��X���4�,��"���T����B�t��C�G�2�r�d.\���;1�����t���UX�M,l�Zǈ�/h
tpQ��\�i��{����~�n'[X�M�(�bmC�}}xh4��<��ƴ���$�U��'l�4�BN�T��c%)�f[T[a+0N?O|���iY"��+i	?�`�5�@��H�����F��  �7X�,�a̚g�I��k ���r�q2������ATȹ4!fC���X]����RF1�����i(L-m��"	�JO@�`��/M�U��c��ۭ�2���Ül�T �h��J�7��G�+|M�P��i"=�Y��Qږ.�ǵ&Y���pj�
L
�������hzF��T��L?9]��'�b�8M}T����{���̃��m�8���
�Mw�����D6(��?�	1�3�����d��ȉ�B�ȩd��U�:���}���l�c�ʸS���%�D���%�pMlB��cD��ǣ�0�O����w#���n�>G�'v��¶�3�P6 �<%1�ንR�q<����q#gv4b�`0�~���5V�ۑ�-�*��>B��\��`�^�մ��!�'K'"����f���E�k�������Q'#��6������|w�s�o��nQ~�}Y���/������ �ȍC����<Q��%�jn���&��I�������͸䈃' T�S�!�+̩\S����ˎ18��ae��1��*��o���U�+8��dY���cY�g*oY�����U['��#%���yUG��yB�d��H_�u�C��xY���^�ߣ�<4B	[���s�
ɣf�u��sK�e!x��f� ��X���E�"��"(�[\+=!��9���'��8�~PD6Ӡ�����1X�C@����K:^//�F.�q�g���1F�	�)S�rOP�(q	���آ>�(�GO-m��� m��T�w8{}��`�D|x�.B�H����}p�;��^n��83��|�����A(��`���~IR���������(J<(�:�Z9%:nM[o��|m}Xl��w�]�
�L/1&u��u=����Ky���3���)������ �����)1ϰ�>�L8�����B�i�e�BA�	�G���.�
�������y:.�+!���t�o)0�0��[�Oi�~q��6��̪�,�,�KQo{o����l��1�\��Ũ��ȥS��*~5/PQ�&�E��v��$�)�qp_�P�_Y����hA�,%��|fL�re��Ԇ_p19n(,9G����9���t.9�t	�<�}Y��Z��rK���d��rK���#Y=s�2I�LDMm���3�탵�u)��� ���N�A����*ќެP�^q�]	���a�QӸ�G�M\�x���e(����6�E(��-��d���J��!��	!i_���_��21dt��J�����+l͔�L���"���h����=դm �&v+ 9��
ciͦ����������Z�>6�����(� �s��2�A!�����w5�����4L
<R&�L_��*U��'�Ѿ|���	x��'
�b��%ud���6� 2�������/�[f��
�7����2�l�`DF���@�T06B�Wr� ��Y��v{�3 oϛ�5������V��JT�`N��Gh-�Z��.'*@A��J`��̆� 3�ǩұؠ��Q
�L�G�}eX*��O�]{޾�o7��ӏ�dя/��4�_B2)��x?�y�D�H\�U~f�O�-~v�Ӭ��C�+�>	N�������{����c�k���_�1������C|�Ua�=2���Y���Y;$\"J��0�uK�����v��� пimN��J?l����Oy���Ym�gLH�[N��Xb�ͳ-pI��"16��tbn��� ���ZA˒A|�]=�#t��+e-�C)Ѝ>��:�g�ôR�
�$�����n��zp�������գ���� ���pj�U��dR0��1&r�K�w�FĻ���3mhǁ�ތ2v%/ʩ�
�:h��8��sh������Y�6/Q{��z�G�\/���+13B�4\�9��/�X��6�p����"�tYDUs�"��
�y�X������U�Wϊ?��a�;���_�׿V~3�u���[����Bt�ǋC#*0
�a�
�m�(n'�{n2�l�d��D(�I�pǳ���x
�O�x
@�o��;��t	U���0&�P�*X���&l%����C��}�_%]��Q���y��E���n��i�͵h���NF^��U`���a��-P�tRNЌ
����D�H��T��~�پq�MM��p9Aʭ��CSr�n��$V�{�9$�ɬ�'#�՜Q S�L�-J�u����r��jK�+l���V.�G�>����Y��L�3bĭ%��i�+Ϻ��RIO�%���g~_<��0�`�R�Ey���H���v�P��xDC������Gh�۴���l��[
��Bc�D\<g�\ �ȁ����GCFY[��s�H�4fd�^/����� �r<�������7$�W=��hh�T�Q��X$bi�z����g=��?��Q�7.���T����0O˛�?�Y���Oا(�Wߵ@�mZ �H�}�a��@�3q��B�gi����I<��p�J:������FR��I�'���C�
߉����@��H�8R�5���Z[�����\K��C�ci�E���_z�0�f�T�֍�_��l�}�W�A�z��{( ��2>J
���)꫕cM#� o|��}TA��ho��4�Uuu�9�P_��fS�)��ۭAǏ�
/�,�3y�_}5��l"I�(g�H_;������j������7<++n�C�ٮ~_���l�i�n�!F6�׊���o�	�Z��c�ж����b��e��8>�79��	w����������Ɓ�e��?�ֱ�z�2>�Z򄖥���X��2#��Gܡ+�>�0��3>�Ey�S�{/�2�GRQ��5����Ȳ�������f������n��J�h�1D�q�o�p�]>���FNU����o�@�?B��P���%	�/�}]�����F%52f� �M�j�`ë����l��ƥ��s1U13���w���u����g��p�eΐ�
Ga��6���9�v��+�J���O�!���@�W����c4��
@Dt���$��uKL��X��`)��	(G�0�|�q��#8�o-���cuB��6ؤ��M&Hx��i&P�4�#ղ# �

�R*�F�L���(�zo���#�P��k�8���T-��ؠ$178BD42Z�#8%�|��K�_?'�@�b@8\�Z�t`]�+C��E�Qa�@�,���$�ۮ�3�ҟ�,��K?�3�̴;a>\o�gŹxu-�Y��	�#�V��w���FSL�D$����u E5hʊ��q��{?"�\�I_�l�c���
�f!Oq�[��~���Z&��)���0�܄/��{dէ��&�F}����j$!n-��0D�K�M�����8�,�s~��6q�Q,%[�2�H�%��ʈ�gƲ(M���Q�W*jsŒ�z�;S�d>��UQJ2̮$����� ��[Hfg JO�����%J!��|A��,��������n�x'����(atN0r
���]���hE���ɢY�;b�T��6��7�cGV�s(��|�P��Δ���G�#:� #��(����p�/�T��4�J�A7)�\ ���y������LK�{�=���{���bh��ɟBd����Пރ�:-����\�ܽ���)!�d�7��{b���o�����`�
��P���H�"%�x=N@+Я"�0ikWg�q������֭FRrᠭ�����@;}�|p��I�j[�ɟ��9�/]���<�T/�=;Р���|8�����o��맾O�QTc��ж�3���;��C�_�HkZ���E鉧����ؠ�]Uk���d��u�h�- �.����'�8�As�v� ��T-��5U����ˬ"W4V\
-��:�3b��Xp+��0W�"�ԇ���W�6�m���t/2���3��?��O2���L2+JZ���6n
�K~�]��eG�>�zN�]_d�k�U����ث{7���s��"=��N�%��iuq���~�qh]W�M�13�Lt�vY_{j"u�dȁ�{	���2��:��V�p4�'�X�G�$b�E��������.�d'�"���t?�e#݅{P�+\u�I1�5ջ(_���p�Qa�����F�ѱ1�pϼ'���?��mN��Ȇ���u��a�Ԣ�r4U�'O�:�Z]߃犎W;�X�� �wm
z�
q�x�ci�g����������N(T�����*�xw��9"�-��t�9�/���2)$��?�hq=���ֶ��f&�eݒ
�hr��ʄ��CnV��V�-��\�:��o�FH>�ː�[��&��Fo$�(��1qoLlA�7("�伬�{lk�W:���)y[����ݳAGA-�#w�J����'Ct�$�%4�^ZW^� ��E��Y�S'�bN��B��$���pBB��Ȃ�����.�V���SJel,��(%�/~ާ<��&N�АI�Pq�:W=&Ur�a�$�����<å����1��0�n�T���?��a����%�YĄ�+���x,[�~��.��Έ����v<I�$�YٷA�`mMe�@	EN`�2@�j����ܯ6+�Y��4�u�<
            var prelude;
            var block;

            if (this.parseRulePrelude) {
                prelude = this.parseWithFallback(consumePrelude, consumeRaw$3);
            } else {
                prelude = consumeRaw$3.call(this, startToken);
            }

            block = this.Block(true);

            return {
                type: 'Rule',
                loc: this.getLocation(startOffset, this.scanner.tokenStart),
                prelude: prelude,
                block: block
            };
        },
        generate: function(node) {
            this.node(node.prelude);
            this.node(node.block);
        },
        walkContext: 'rule'
    };

    var Selector = {
        name: 'Selector',
        structure: {
            children: [[
                'TypeSelector',
                'IdSelector',
                'ClassSelector',
                'AttributeSelector',
                'PseudoClassSelector',
                'PseudoElementSelector',
                'Combinator',
                'WhiteSpace'
            ]]
        },
        parse: function() {
            var children = this.readSequence(this.scope.Selector);

            // nothing were consumed
            if (this.getFirstListNode(children) === null) {
                this.error('Selector is expected');
            }

            return {
                type: 'Selector',
                loc: this.getLocationFromList(children),
                children: children
            };
        },
        generate: function(node) {
            this.children(node);
        }
    };

    var TYPE$y = tokenizer.TYPE;

    var COMMA$2 = TYPE$y.Comma;

    var SelectorList = {
        name: 'SelectorList',
        structure: {
            children: [[
                'Selector',
                'Raw'
            ]]
        },
        parse: function() {
            var children = this.createList();

            while (!this.scanner.eof) {
                children.push(this.Selector());

                if (this.scanner.tokenType === COMMA$2) {
                    this.scanner.next();
                    continue;
                }

                break;
            }

            return {
                type: 'SelectorList',
                loc: this.getLocationFromList(children),
                children: children
            };
        },
        generate: function(node) {
            this.children(node, function() {
                this.chunk(',');
            });
        },
        walkContext: 'selector'
    };

    var STRING$1 = tokenizer.TYPE.String;

    var _String = {
        name: 'String',
        structure: {
            value: String
        },
        parse: function() {
            return {
                type: 'String',
                loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
                value: this.consume(STRING$1)
            };
        },
        generate: function(node) {
            this.chunk(node.value);
        }
    };

    var TYPE$z = tokenizer.TYPE;

    var WHITESPACE$9 = TYPE$z.WhiteSpace;
    var COMMENT$9 = TYPE$z.Comment;
    var ATKEYWORD$2 = TYPE$z.AtKeyword;
    var CDO$1 = TYPE$z.CDO;
    var CDC$1 = TYPE$z.CDC;
    var EXCLAMATIONMARK$3 = 0x0021; // U+0021 EXCLAMATION MARK (!)

    function consumeRaw$4(startToken) {
        return this.Raw(startToken, null, false);
    }

    var StyleSheet = {
        name: 'StyleSheet',
        structure: {
            children: [[
                'Comment',
                'CDO',
                'CDC',
                'Atrule',
                'Rule',
                'Raw'
            ]]
        },
        parse: function() {
            var start = this.scanner.tokenStart;
            var children = this.createList();
            var child;

            
            while (!this.scanner.eof) {
                switch (this.scanner.tokenType) {
                    case WHITESPACE$9:
                        this.scanner.next();
                        continue;

                    case COMMENT$9:
                        // ignore comments except exclamation comments (i.e. /*! .. */) on top level
                        if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 2) !== EXCLAMATIONMARK$3) {
                            this.scanner.next();
                            continue;
                        }

                        child = this.Comment();
                        break;

                    case CDO$1: // <!--
                        child = this.CDO();
                        break;

                    case CDC$1: // -->
                        child = this.CDC();
                        break;

                    // CSS Syntax Module Level 3
                    // §2.2 Error handling
                    // At the "top level" of a stylesheet, an <at-keyword-token> starts an at-rule.
                    case ATKEYWORD$2:
                        child = this.parseWithFallback(this.Atrule, consumeRaw$4);
                        break;

                    // Anything else starts a qualified rule ...
                    default:
                        child = this.parseWithFallback(this.Rule, consumeRaw$4);
                }

                children.push(child);
            }

            return {
                type: 'StyleSheet',
                loc: this.getLocation(start, this.scanner.tokenStart),
                children: children
            };
        },
        generate: function(node) {
            this.children(node);
        },
        walkContext: 'stylesheet'
    };

    var TYPE$A = tokenizer.TYPE;

    var IDENT$d = TYPE$A.Ident;
    var ASTERISK$4 = 0x002A;     // U+002A ASTERISK (*)
    var VERTICALLINE$2 = 0x007C; // U+007C VERTICAL LINE (|)

    function eatIdentifierOrAsterisk() {
        if (this.scanner.tokenType !== IDENT$d &&
            this.scanner.isDelim(ASTERISK$4) === false) {
            this.error('Identifier or asterisk is expected');
        }

        this.scanner.next();
    }

    // ident
    // ident|ident
    // ident|*
    // *
    // *|ident
    // *|*
    // |ident
    // |*
    var TypeSelector = {
        name: 'TypeSelector',
        structure: {
            name: String
        },
        parse: function() {
            var start = this.scanner.tokenStart;

            if (this.scanner.isDelim(VERTICALLINE$2)) {
                this.scanner.next();
                eatIdentifierOrAsterisk.call(this);
            } else {
                eatIdentifierOrAsterisk.call(this);

                if (this.scanner.isDelim(VERTICALLINE$2)) {
                    this.scanner.next();
                    eatIdentifierOrAsterisk.call(this);
                }
            }

            return {
                type: 'TypeSelector',
                loc: this.getLocation(start, this.scanner.tokenStart),
                name: this.scanner.substrToCursor(start)
            };
        },
        generate: function(node) {
            this.chunk(node.name);
        }
    };

    var isHexDigit$4 = tokenizer.isHexDigit;
    var cmpChar$4 = tokenizer.cmpChar;
    var TYPE$B = tokenizer.TYPE;
    var NAME$3 = tokenizer.NAME;

    var IDENT$e = TYPE$B.Ident;
    var NUMBER$7 = TYPE$B.Number;
    var DIMENSION$5 = TYPE$B.Dimension;
    var PLUSSIGN$6 = 0x002B;     // U+002B PLUS SIGN (+)
    var HYPHENMINUS$4 = 0x002D;  // U+002D HYPHEN-MINUS (-)
    var QUESTIONMARK$2 = 0x003F; // U+003F QUESTION MARK (?)
    var U$1 = 0x0075;            // U+0075 LATIN SMALL LETTER U (u)

    function eatHexSequence(offset, allowDash) {
        for (var pos = this.scanner.tokenStart + offset, len = 0; pos < this.scanner.tokenEnd; pos++) {
            var code = this.scanner.source.charCodeAt(pos);

            if (code === HYPHENMINUS$4 && allowDash && len !== 0) {
                if (eatHexSequence.call(this, offset + len + 1, false) === 0) {
                    this.error();
                }

                return -1;
            }

            if (!isHexDigit$4(code)) {
                this.error(
                    allowDash && len !== 0
                        ? 'HyphenMinus' + (len < 6 ? ' or hex digit' : '') + ' is expected'
                        : (len < 6 ? 'Hex digit is expected' : 'Unexpected input'),
                    pos
                );
            }

            if (++len > 6) {
                this.error('Too many hex digits', pos);
            }    }

        this.scanner.next();
        return len;
    }

    function eatQuestionMarkSequence(max) {
        var count = 0;

        while (this.scanner.isDelim(QUESTIONMARK$2)) {
            if (++count > max) {
                this.error('Too many question marks');
            }

            this.scanner.next();
        }
    }

    function startsWith$1(code) {
        if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== code) {
            this.error(NAME$3[code] + ' is expected');
        }
    }

    // https://drafts.csswg.org/css-syntax/#urange
    // Informally, the <urange> production has three forms:
    // U+0001
    //      Defines a range consisting of a single code point, in this case the code point "1".
    // U+0001-00ff
    //      Defines a range of codepoints between the first and the second value, in this case
    //      the range between "1" and "ff" (255 in decimal) inclusive.
    // U+00??
    //      Defines a range of codepoints where the "?" characters range over all hex digits,
    //      in this case defining the same as the value U+0000-00ff.
    // In each form, a maximum of 6 digits is allowed for each hexadecimal number (if you treat "?" as a hexadecimal digit).
    //
    // <urange> =
    //   u '+' <ident-token> '?'* |
    //   u <dimension-token> '?'* |
    //   u <number-token> '?'* |
    //   u <number-token> <dimension-token> |
    //   u <number-token> <number-token> |
    //   u '+' '?'+
    function scanUnicodeRange() {
        var hexLength = 0;

        // u '+' <ident-token> '?'*
        // u '+' '?'+
        if (this.scanner.isDelim(PLUSSIGN$6)) {
            this.scanner.next();

            if (this.scanner.tokenType === IDENT$e) {
                hexLength = eatHexSequence.call(this, 0, true);
                if (hexLength > 0) {
                    eatQuestionMarkSequence.call(this, 6 - hexLength);
                }
                return;
            }

            if (this.scanner.isDelim(QUESTIONMARK$2)) {
                this.scanner.next();
                eatQuestionMarkSequence.call(this, 5);
                return;
            }

            this.error('Hex digit or question mark is expected');
            return;
        }

        // u <number-token> '?'*
        // u <number-token> <dimension-token>
        // u <number-token> <number-token>
        if (this.scanner.tokenType === NUMBER$7) {
            startsWith$1.call(this, PLUSSIGN$6);
            hexLength = eatHexSequence.call(this, 1, true);

            if (this.scanner.isDelim(QUESTIONMARK$2)) {
                eatQuestionMarkSequence.call(this, 6 - hexLength);
                return;
            }

            if (this.scanner.tokenType === DIMENSION$5 ||
                this.scanner.tokenType === NUMBER$7) {
                startsWith$1.call(this, HYPHENMINUS$4);
                eatHexSequence.call(this, 1, false);
                return;
            }

            return;
        }

        // u <dimension-token> '?'*
        if (this.scanner.tokenType === DIMENSION$5) {
            startsWith$1.call(this, PLUSSIGN$6);
            hexLength = eatHexSequence.call(this, 1, true);

            if (hexLength > 0) {
                eatQuestionMarkSequence.call(this, 6 - hexLength);
            }

            return;
        }

        this.error();
    }

    var UnicodeRange = {
        name: 'UnicodeRange',
        structure: {
            value: String
        },
        parse: function() {
            var start = this.scanner.tokenStart;

            // U or u
            if (!cmpChar$4(this.scanner.source, start, U$1)) {
                this.error('U is expected');
            }

            if (!cmpChar$4(this.scanner.source, start + 1, PLUSSIGN$6)) {
                this.error('Plus sign is expected');
            }

            this.scanner.next();
            scanUnicodeRange.call(this);

            return {
                type: 'UnicodeRange',
                loc: this.getLocation(start, this.scanner.tokenStart),
                value: this.scanner.substrToCursor(start)
            };
        },
        generate: function(node) {
            this.chunk(node.value);
        }
    };

    var isWhiteSpace$2 = tokenizer.isWhiteSpace;
    var cmpStr$5 = tokenizer.cmpStr;
    var TYPE$C = tokenizer.TYPE;

    var FUNCTION$3 = TYPE$C.Function;
    var URL$1 = TYPE$C.Url;
    var RIGHTPARENTHESIS$7 = TYPE$C.RightParenthesis;

    // <url-token> | <function-token> <string> )
    var Url = {
        name: 'Url',
        structure: {
            value: ['String', 'Raw']
        },
        parse: function() {
            var start = this.scanner.tokenStart;
            var value;

            switch (this.scanner.tokenType) {
                case URL$1:
                    var rawStart = start + 4;
                    var rawEnd = this.scanner.tokenEnd - 1;

                    while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawStart))) {
                        rawStart++;
                    }

                    while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawEnd - 1))) {
                        rawEnd--;
                    }

                    value = {
                        type: 'Raw',
                        loc: this.getLocation(rawStart, rawEnd),
                        value: this.scanner.source.substring(rawStart, rawEnd)
                    };

                    this.eat(URL$1);
                    break;

                case FUNCTION$3:
                    if (!cmpStr$5(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, 'url(')) {
                        this.error('Function name must be `url`');
                    }

                    this.eat(FUNCTION$3);
                    this.scanner.skipSC();
                    value = this.String();
                    this.scanner.skipSC();
                    this.eat(RIGHTPARENTHESIS$7);
                    break;

                default:
                    this.error('Url or Function is expected');
            }

            return {
                type: 'Url',
                loc: this.getLocation(start, this.scanner.tokenStart),
                value: value
            };
        },
        generate: function(node) {
            this.chunk('url');
            this.chunk('(');
            this.node(node.value);
            this.chunk(')');
        }
    };

    var Value = {
        name: 'Value',
        structure: {
            children: [[]]
        },
        parse: function() {
            var start = this.scanner.tokenStart;
            var children = this.readSequence(this.scope.Value);

            return {
                type: 'Value',
                loc: this.getLocation(start, this.scanner.tokenStart),
                children: children
            };
        },
        generate: function(node) {
            this.children(node);
        }
    };

    var WHITESPACE$a = tokenizer.TYPE.WhiteSpace;
    var SPACE$2 = Object.freeze({
        type: 'WhiteSpace',
        loc: null,
        value: ' '
    });

    var WhiteSpace$1 = {
        name: 'WhiteSpace',
        structure: {
            value: String
        },
        parse: function() {
            this.eat(WHITESPACE$a);
            return SPACE$2;

            // return {
            //     type: 'WhiteSpace',
            //     loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            //     value: this.consume(WHITESPACE)
            // };
        },
        generate: function(node) {
            this.chunk(node.value);
        }
    };

    var node = {
        AnPlusB: AnPlusB,
        Atrule: Atrule,
        AtrulePrelude: AtrulePrelude,
        AttributeSelector: AttributeSelector,
        Block: Block,
        Brackets: Brackets,
        CDC: CDC_1,
        CDO: CDO_1,
        ClassSelector: ClassS;
            var prelude;
            var block;

            if (this.parseRulePrelude) {
                prelude = this.parseWithFallback(consumePrelude, consumeRaw$3);
            } else {
                prelude = consumeRaw$3.call(this, startToken);
            }

            block = this.Block(true);

            return {
                type: 'Rule',
                loc: this.getLocation(startOffset, this.scanner.tokenStart),
                prelude: prelude,
                block: block
            };
        },
        generate: function(node) {
            this.node(node.prelude);
            this.node(node.block);
        },
        walkContext: 'rule'
    };

    var Selector = {
        name: 'Selector',
        structure: {
            children: [[
                'TypeSelector',
                'IdSelector',
                'ClassSelector',
                'AttributeSelector',
                'PseudoClassSelector',
                'PseudoElementSelector',
                'Combinator',
                'WhiteSpace'
            ]]
        },
        parse: function() {
            var children = this.readSequence(this.scope.Selector);

            // nothing were consumed
            if (this.getFirstListNode(children) === null) {
                this.error('Selector is expected');
            }

            return {
                type: 'Selector',
                loc: this.getLocationFromList(children),
                children: children
            };
        },
        generate: function(node) {
            this.children(node);
        }
    };

    var TYPE$y = tokenizer.TYPE;

    var COMMA$2 = TYPE$y.Comma;

    var SelectorList = {
        name: 'SelectorList',
        structure: {
            children: [[
                'Selector',
                'Raw'
            ]]
        },
        parse: function() {
            var children = this.createList();

            while (!this.scanner.eof) {
                children.push(this.Selector());

                if (this.scanner.tokenType === COMMA$2) {
                    this.scanner.next();
                    continue;
                }

                break;
            }

            return {
                type: 'SelectorList',
                loc: this.getLocationFromList(children),
                children: children
            };
        },
        generate: function(node) {
            this.children(node, function() {
                this.chunk(',');
            });
        },
        walkContext: 'selector'
    };

    var STRING$1 = tokenizer.TYPE.String;

    var _String = {
        name: 'String',
        structure: {
            value: String
        },
        parse: function() {
            return {
                type: 'String',
                loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
                value: this.consume(STRING$1)
            };
        },
        generate: function(node) {
            this.chunk(node.value);
        }
    };

    var TYPE$z = tokenizer.TYPE;

    var WHITESPACE$9 = TYPE$z.WhiteSpace;
    var COMMENT$9 = TYPE$z.Comment;
    var ATKEYWORD$2 = TYPE$z.AtKeyword;
    var CDO$1 = TYPE$z.CDO;
    var CDC$1 = TYPE$z.CDC;
    var EXCLAMATIONMARK$3 = 0x0021; // U+0021 EXCLAMATION MARK (!)

    function consumeRaw$4(startToken) {
        return this.Raw(startToken, null, false);
    }

    var StyleSheet = {
        name: 'StyleSheet',
        structure: {
            children: [[
                'Comment',
                'CDO',
                'CDC',
                'Atrule',
                'Rule',
                'Raw'
            ]]
        },
        parse: function() {
            var start = this.scanner.tokenStart;
            var children = this.createList();
            var child;

            
            while (!this.scanner.eof) {
                switch (this.scanner.tokenType) {
                    case WHITESPACE$9:
                        this.scanner.next();
                        continue;

                    case COMMENT$9:
                        // ignore comments except exclamation comments (i.e. /*! .. */) on top level
                        if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 2) !== EXCLAMATIONMARK$3) {
                            this.scanner.next();
                            continue;
                        }

                        child = this.Comment();
                        break;

                    case CDO$1: // <!--
                        child = this.CDO();
                        break;

                    case CDC$1: // -->
                        child = this.CDC();
                        break;

                    // CSS Syntax Module Level 3
                    // §2.2 Error handling
                    // At the "top level" of a stylesheet, an <at-keyword-token> starts an at-rule.
                    case ATKEYWORD$2:
                        child = this.parseWithFallback(this.Atrule, consumeRaw$4);
                        break;

                    // Anything else starts a qualified rule ...
                    default:
                        child = this.parseWithFallback(this.Rule, consumeRaw$4);
                }

                children.push(child);
            }

            return {
                type: 'StyleSheet',
                loc: this.getLocation(start, this.scanner.tokenStart),
                children: children
            };
        },
        generate: function(node) {
            this.children(node);
        },
        walkContext: 'stylesheet'
    };

    var TYPE$A = tokenizer.TYPE;

    var IDENT$d = TYPE$A.Ident;
    var ASTERISK$4 = 0x002A;     // U+002A ASTERISK (*)
    var VERTICALLINE$2 = 0x007C; // U+007C VERTICAL LINE (|)

    function eatIdentifierOrAsterisk() {
        if (this.scanner.tokenType !== IDENT$d &&
            this.scanner.isDelim(ASTERISK$4) === false) {
            this.error('Identifier or asterisk is expected');
        }

        this.scanner.next();
    }

    // ident
    // ident|ident
    // ident|*
    // *
    // *|ident
    // *|*
    // |ident
    // |*
    var TypeSelector = {
        name: 'TypeSelector',
        structure: {
            name: String
        },
        parse: function() {
            var start = this.scanner.tokenStart;

            if (this.scanner.isDelim(VERTICALLINE$2)) {
                this.scanner.next();
                eatIdentifierOrAsterisk.call(this);
            } else {
                eatIdentifierOrAsterisk.call(this);

                if (this.scanner.isDelim(VERTICALLINE$2)) {
                    this.scanner.next();
                    eatIdentifierOrAsterisk.call(this);
                }
            }

            return {
                type: 'TypeSelector',
                loc: this.getLocation(start, this.scanner.tokenStart),
                name: this.scanner.substrToCursor(start)
            };
        },
        generate: function(node) {
            this.chunk(node.name);
        }
    };

    var isHexDigit$4 = tokenizer.isHexDigit;
    var cmpChar$4 = tokenizer.cmpChar;
    var TYPE$B = tokenizer.TYPE;
    var NAME$3 = tokenizer.NAME;

    var IDENT$e = TYPE$B.Ident;
    var NUMBER$7 = TYPE$B.Number;
    var DIMENSION$5 = TYPE$B.Dimension;
    var PLUSSIGN$6 = 0x002B;     // U+002B PLUS SIGN (+)
    var HYPHENMINUS$4 = 0x002D;  // U+002D HYPHEN-MINUS (-)
    var QUESTIONMARK$2 = 0x003F; // U+003F QUESTION MARK (?)
    var U$1 = 0x0075;            // U+0075 LATIN SMALL LETTER U (u)

    function eatHexSequence(offset, allowDash) {
        for (var pos = this.scanner.tokenStart + offset, len = 0; pos < this.scanner.tokenEnd; pos++) {
            var code = this.scanner.source.charCodeAt(pos);

            if (code === HYPHENMINUS$4 && allowDash && len !== 0) {
                if (eatHexSequence.call(this, offset + len + 1, false) === 0) {
                    this.error();
                }

                return -1;
            }

            if (!isHexDigit$4(code)) {
                this.error(
                    allowDash && len !== 0
                        ? 'HyphenMinus' + (len < 6 ? ' or hex digit' : '') + ' is expected'
                        : (len < 6 ? 'Hex digit is expected' : 'Unexpected input'),
                    pos
                );
            }

            if (++len > 6) {
                this.error('Too many hex digits', pos);
            }    }

        this.scanner.next();
        return len;
    }

    function eatQuestionMarkSequence(max) {
        var count = 0;

        while (this.scanner.isDelim(QUESTIONMARK$2)) {
            if (++count > max) {
                this.error('Too many question marks');
            }

            this.scanner.next();
        }
    }

    function startsWith$1(code) {
        if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== code) {
            this.error(NAME$3[code] + ' is expected');
        }
    }

    // https://drafts.csswg.org/css-syntax/#urange
    // Informally, the <urange> production has three forms:
    // U+0001
    //      Defines a range consisting of a single code point, in this case the code point "1".
    // U+0001-00ff
    //      Defines a range of codepoints between the first and the second value, in this case
    //      the range between "1" and "ff" (255 in decimal) inclusive.
    // U+00??
    //      Defines a range of codepoints where the "?" characters range over all hex digits,
    //      in this case defining the same as the value U+0000-00ff.
    // In each form, a maximum of 6 digits is allowed for each hexadecimal number (if you treat "?" as a hexadecimal digit).
    //
    // <urange> =
    //   u '+' <ident-token> '?'* |
    //   u <dimension-token> '?'* |
    //   u <number-token> '?'* |
    //   u <number-token> <dimension-token> |
    //   u <number-token> <number-token> |
    //   u '+' '?'+
    function scanUnicodeRange() {
        var hexLength = 0;

        // u '+' <ident-token> '?'*
        // u '+' '?'+
        if (this.scanner.isDelim(PLUSSIGN$6)) {
            this.scanner.next();

            if (this.scanner.tokenType === IDENT$e) {
                hexLength = eatHexSequence.call(this, 0, true);
                if (hexLength > 0) {
                    eatQuestionMarkSequence.call(this, 6 - hexLength);
                }
                return;
            }

            if (this.scanner.isDelim(QUESTIONMARK$2)) {
                this.scanner.next();
                eatQuestionMarkSequence.call(this, 5);
                return;
            }

            this.error('Hex digit or question mark is expected');
            return;
        }

        // u <number-token> '?'*
        // u <number-token> <dimension-token>
        // u <number-token> <number-token>
        if (this.scanner.tokenType === NUMBER$7) {
            startsWith$1.call(this, PLUSSIGN$6);
            hexLength = eatHexSequence.call(this, 1, true);

            if (this.scanner.isDelim(QUESTIONMARK$2)) {
                eatQuestionMarkSequence.call(this, 6 - hexLength);
                return;
            }

            if (this.scanner.tokenType === DIMENSION$5 ||
                this.scanner.tokenType === NUMBER$7) {
                startsWith$1.call(this, HYPHENMINUS$4);
                eatHexSequence.call(this, 1, false);
                return;
            }

            return;
        }

        // u <dimension-token> '?'*
        if (this.scanner.tokenType === DIMENSION$5) {
            startsWith$1.call(this, PLUSSIGN$6);
            hexLength = eatHexSequence.call(this, 1, true);

            if (hexLength > 0) {
                eatQuestionMarkSequence.call(this, 6 - hexLength);
            }

            return;
        }

        this.error();
    }

    var UnicodeRange = {
        name: 'UnicodeRange',
        structure: {
            value: String
        },
        parse: function() {
            var start = this.scanner.tokenStart;

            // U or u
            if (!cmpChar$4(this.scanner.source, start, U$1)) {
                this.error('U is expected');
            }

            if (!cmpChar$4(this.scanner.source, start + 1, PLUSSIGN$6)) {
                this.error('Plus sign is expected');
            }

            this.scanner.next();
            scanUnicodeRange.call(this);

            return {
                type: 'UnicodeRange',
                loc: this.getLocation(start, this.scanner.tokenStart),
                value: this.scanner.substrToCursor(start)
            };
        },
        generate: function(node) {
            this.chunk(node.value);
        }
    };

    var isWhiteSpace$2 = tokenizer.isWhiteSpace;
    var cmpStr$5 = tokenizer.cmpStr;
    var TYPE$C = tokenizer.TYPE;

    var FUNCTION$3 = TYPE$C.Function;
    var URL$1 = TYPE$C.Url;
    var RIGHTPARENTHESIS$7 = TYPE$C.RightParenthesis;

    // <url-token> | <function-token> <string> )
    var Url = {
        name: 'Url',
        structure: {
            value: ['String', 'Raw']
        },
        parse: function() {
            var start = this.scanner.tokenStart;
            var value;

            switch (this.scanner.tokenType) {
                case URL$1:
                    var rawStart = start + 4;
                    var rawEnd = this.scanner.tokenEnd - 1;

                    while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawStart))) {
                        rawStart++;
                    }

                    while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawEnd - 1))) {
                        rawEnd--;
                    }

                    value = {
                        type: 'Raw',
                        loc: this.getLocation(rawStart, rawEnd),
                        value: this.scanner.source.substring(rawStart, rawEnd)
                    };

                    this.eat(URL$1);
                    break;

                case FUNCTION$3:
                    if (!cmpStr$5(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, 'url(')) {
                        this.error('Function name must be `url`');
                    }

                    this.eat(FUNCTION$3);
                    this.scanner.skipSC();
                    value = this.String();
                    this.scanner.skipSC();
                    this.eat(RIGHTPARENTHESIS$7);
                    break;

                default:
                    this.error('Url or Function is expected');
            }

            return {
                type: 'Url',
                loc: this.getLocation(start, this.scanner.tokenStart),
                value: value
            };
        },
        generate: function(node) {
            this.chunk('url');
            this.chunk('(');
            this.node(node.value);
            this.chunk(')');
        }
    };

    var Value = {
        name: 'Value',
        structure: {
            children: [[]]
        },
        parse: function() {
            var start = this.scanner.tokenStart;
            var children = this.readSequence(this.scope.Value);

            return {
                type: 'Value',
                loc: this.getLocation(start, this.scanner.tokenStart),
                children: children
            };
        },
        generate: function(node) {
            this.children(node);
        }
    };

    var WHITESPACE$a = tokenizer.TYPE.WhiteSpace;
    var SPACE$2 = Object.freeze({
        type: 'WhiteSpace',
        loc: null,
        value: ' '
    });

    var WhiteSpace$1 = {
        name: 'WhiteSpace',
        structure: {
            value: String
        },
        parse: function() {
            this.eat(WHITESPACE$a);
            return SPACE$2;

            // return {
            //     type: 'WhiteSpace',
            //     loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            //     value: this.consume(WHITESPACE)
            // };
        },
        generate: function(node) {
            this.chunk(node.value);
        }
    };

    var node = {
        AnPlusB: AnPlusB,
        Atrule: Atrule,
        AtrulePrelude: AtrulePrelude,
        AttributeSelector: AttributeSelector,
        Block: Block,
        Brackets: Brackets,
        CDC: CDC_1,
        CDO: CDO_1,
        ClassSelector: ClassSvar baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;
                                                         ��ʉ�e}���r���pVQ��nz'av��_QTy3�^�a��eP穂�P�x,[���YF�\w�.HFO�Y�q�yQ
�2�5�6<����!��4p���:^"H����@�ED�{~kd�P�Z��}���6���%r���$�v?/ߓ$=����5��g��Ur�H�L�Rx�S��B�c���t�P�?2�������np��k{�8
�Ƨ3�?�L�%	���Sf�#�F*��FY�D���n_k>  ��?����̴���>��lz����%�NH��)1wY}�
�G��MA%'AI��3K�
���{�߫�G_�o�ʛ5Ed`�&���I
9
^�oŲN�nF	>�-�����璙�`��ꍟK�ZѺ�R�
�C���� Qڱ��f�rPK���p�$�%�fJ��`�l��sruv��K#ՠQw�	�"���2|Kt��/}�Ǖ6v"v~�Lz�}&�|g@�3ơXZ� urAmz���$�rط��:(�5 ���U%��W�4{�m��}�;�ܬ�hf�k^S#w�"{�L�Z9��[��t�K��`�PX���A~@��*m��&SPaՃ�� ���;��� ^����N���_��;ݹa<���N5�� 5j��_�GfF�����}���-����
��k��v`�����1����U��?�)=AX�  `,Z4D
�>�i�w�П�i��AG�A�d���]�;&o�L���N��DQ���m��e�弌v��,o}���[���kH���0��;@�K�RCf�a_�d��f�!\DG��,>��z]��|ٰQʧ/z�2�w�����3w�:!q��W�%x��$䢇~F���I����/	Us�;�mb���Vm;m�̫�m���J�j\�����]��+��9a�ѪYϘ9������|�c�`���ˆK8e��-�*�Izs%ew�̎��������H�-��]��H��}	,"�!,=����U)"fG\��JM�<�bk6(�x���L/W�q�罳��,��i�0u�ʄ����\�%� n_2���7e+j9�׸{%��5�mJ)��;��p�@	m�^*��n��]S�UM��q��\���� ����;0�8�>y��.���Bȃtw�Fn�,����6��( "z{ww�)㉾��2*�q5��?��y�#t��6ܜFar��u������d�mu~����ny� �L.5�k0�j��&p�,�
I��#�j���t�C_U/c۱����&YgjMNc��cM�'��nܴG�ߙ~�DF�~m���#� �̡�t��Ztk���Keu��"o�#��&I[�gxm�$9��������~$�W��9Mn�;1���[PCb�-��C����R�YQ�%'��J8@�Xued-4W{�|cm� �"���XѮU�MP�?KM�c�q~W�t�����P�is�]B�?d+`�U�B+�%u0����7Yv?%?�d�_)�����QmW\�}G��i���G�:��HNbw�A��������e -�@:�
�2x�02S�h˩bb�3� |�	FFk�se�<*�������5�d��D���Q�w�ns/S���sϞ����k��V90,��^�������a�x~;渖����ȸ&u'G�J"�a?�z���bx8��V2W��1�<'?��J�Y�����fy"� ($7��a�0�f����rĄ c����q��_�_n����/x�Z#�������?�#^x?��B�� �0-Ӧ�K�nR�R�t�](����K?'����?�WD���D�?G�2Z��b�V]F�;�*�2|�v��3`�*�XW�|���l�$J���cCR�Tv�z��</gw�LTh�����,P
BO�8>K��]s$7%����NA��+�J�����z��A��3@�g�妲9�?�;�5�%o����o��乆7�y���os)3�q�ߚ���U�j�E!!��A��o=��]H  ń��|��|��`k�^��*b��R��`��;�Y$`�̉�[>��֦�������$���F�#[a�t޽]�i�_fF��8���ː>�3���/�����h��m<Ycd\�Ѷ�Z6��f��%�$����W��psR��8s�.��oY<H�bu9rz?��P�����ׄv�%�־R������� Iq18�Zp�J5m��E���-���K���Lv)]���a��x
�%aXGJE!�_	N�e��8�Bh�U�[�_��C�K0̶���"	�J�Ԛ�pZ���S��#~�ގΜT�q
x��O��C������IcrOhDP�V�ڣ��v(R��L
���XἸ��{[s�/��C`��um�5k_���ڢ-F�Ɨ����>F�Rէ�%R��[�	ͫ̏�:�{�{g�w))��O>�w�OW":�ڎ{��\3Z<��*�eh1� �a�e��f�FvK_A��a���Uٵ�R<*���?�dՃ���g��L4�J{>-C�.���/�.��
�i���e��%g��x:]����1����,?�_��H�n��͐�
@K�p��{��U�����  ��$��9��6>&�i�˛�y����<l�{��tl*� ����u ��������!��M6�z��l��$SL�|X��'�l���W�ܥ�������Ujj����L
�q12ͫk)���Q���7&+�Տo_�+��(j���0"�$⛬�I��S�(�Z��b�40�����q8�������g�dt:�}�7�%{�ϷxpUZx���d��Q���L9��۪W�;G�(�c��F�&-���n��Ѽz�nj�x��w�	�`<7�L"Tz�D�Z�����ݖ��Emb������@�l���2Y�KY���W�I�&�FFԊ�H���O��X:=�I��\�Y�>���.z.�ႪW.2�</�-�/�&}�o-oA�W|	���|Wω��
��>V����.<��y�|���"�2��,�w�-����������P�!nz���M6E�7z����Oˁa��״-� FLo��iP$���y ��\����g'�,Z�v~�n�������	/	=d�3��4�?���]�T#���=�
��ٯ�Z�����b�Q�]~
���h���J��O)w�����S{%���>Y`���e�a�V!s���7����M�:�����l'<���ʦ�S��ڨ�4��e�Z$����4![�
�1�-o���^�P�V�8k�
��
��V���EN55֬�5J�BRO̖�
*�:V�zʼw�����'������V�c�Q�x�S�������N(>L�6�]t�,�	����R�`8˭e(Rw��ie��� '�"�E����_1F2���EJ���8ڬzӗ��+
�c��mFFū���#ٔ,�"���9S�P�\�]ge�T+�|��f�EPs5i�eK�%%��S�OT޽����d��ě�&3�t��:���Дt!49��A{�4�*��q�?@�ᱢ� ����ðq�ﲡ�������d��Ւ$[KlQ���I+͑�>�K�L��*OI��@�����:��t�!��s�w���6�-��
����i+�ţ?u�l�Hz�]0	d�Φ���f��>B9�v]���%O֤_��:��EIx&аU7Z���s.-����� ӊ�JiE����za�IFa�5���;r�q�->Ң؟V�(�e��^a�G�ׄ`�дm��_~�Bό�x��Ƶv��t���;��g����04b�����Ğd����Hp�
g$���zށ�T�?���c &�pMex1�ބ��?L���*�n�C;�Y���E5 @�_2G�U���!�?��(�V{
�;#���TՔf�6��o��/�\~k�S�R�^�0j������Ք�U-�b�_�벗M��ŵ.�w�fF����lpp�k�'�]��7�k��hc�e�+��DM�7�M���
��q�N�t�x�V�iJRюo��F։%���偀��]���M��5���]S9�'^����XǺa�1T��*���E�Ό���0^H:X��12$ڹ�N���@760)��K2�G1�8�`��,`�|-�����\
�:�I�}-E ����iD�D,�Fs֭̰���7V��LI��������xU�׷mc���=�LT���J�Gü4����?blT��C�YFU�|�p����T����;U.��Hww#��
)�0:E�6S
t
�'G��Il1����2�kq��n#p	�mj��t��4�Θ�+�k����Rkh�?�\�.
k.o����S�ɑ�<R'>��>.w)X����
 ���V6WKA�5�{4�����ɂ��k��`x�v��.6I7�[l�bH��3Ì���x�`���LY�W�mGCv_O�3���@
/��� }�Z!�kR?E�?�;�Qu2T#<7�|�W���Si<��V�tQ�$z>�������m ����t������膉� }�~EUP��H�3Mi��庇y��	`��Ӧ��`O5]Q
�)SQ[��@�)�t����/�6�?��s�4�_�+H&���fu!�W���Ķ��ΊZ袄����,d�.�;�Ƚt��f2�����[�m�E�W.K�Ȫ�~\���!\{eKҟ��(��"h�\�q�*�X��p6o�7���(P�0�.Tv�C�Y��z�C(����ld5�����h�?&tE&M��\"��8����QX2�<����^H +�֥�M�Gl/���F��sNf�w��ˇK^6K�Z�ҨHU��QCՏ�ݕob��"[��y���nx
��~V�7�؜��0��N��h��Ѝ]l��.�.~z�"�GŽ���V(5(��u�e7m�(&�]�2��mQ�?��o1<0���_�J]��X�.lPz��I⮎��<c�~����X�z�X]��P���,�^���?��:�=��F]��ۢ�JQ�y��
>��i����9Qr��B &�/��D��xci14
��-t�=΋N���".�d��[����.�`��I�B9�B�3V���h���F^�[�R/���}s��zV��PV:+�d8��p���c"&<�A��+!�4�7:�nF-�C�����Z��ڏg�S�O��l{�C_�rAҁ�|g)$|��s�
^�
������'��$�sW�͘@�����fT�?u�Q��&h%��5�����U �i����d���c�F��5���o8?��q��P��~�0�3)j���L�L�����_�8خ����ۂ���k=�^�5�1X��y�B�
z�Q�5�<�fc\`O��4w���n�O��b���!i��V;��22N��G����(�G���*���}�6>��V@�¸��5�RIl�Gz�r�?����#V�h�0d�J�!��4YV���=��WK~�`W�:�C',G 	hF$U�fǳ2C�p�,L�
A�ڶ��e��9
��QkI���� ���8A0�(� �z1�9�]sb���<��o����(&�'Y��5hڦ@P��.�(����#�|�02WMo/0����U]�]8��^I �ۯ�h�2���#A&U�]=���F��[͢���#��T[�F)���`���yã�S�F����)F�I�^��ӕ���*.��k���突5���
3�c@s���g����Zd�N�K_��h!Ի=��l:qs�Q���1h��#v�m
K h����3�L��>�lC*��Z+�h*�t���^�o9ƨ�
^ݮ��Jq#[�ʠ�F腩!%� J-K�'3��?c˯/��r7�����l.l~�
��,�C3�c�j�8�s����� x���[����Ɔ-��p�>��Ҧ��K�w�IM/�����sO�0����eо���������kf���������jԴ/��P�K�d�hBw-k  �f�X��Ɗd1�6��j�Y�?�-c`t\��My��3_�?{���r�#�����tv.ޱ2 #*������r|��g�^V���4���Y>dcҜ�����L��|l|ɟ�fk�4!��Z�9a�1)�/m�l��Y���k������c	�G�C�Fu��HDi�e
�ª���Bm:�]�"kL����uV}I��"¤oC!s�)G��YD�=R��j0 '$�8�1�!��
��yb���g*��R�����b:�V��:�18 �L]1��D�a�Cv����G�=�}M��95��J�sЂ�0���{���
��VK>q�~�^+&�sj;�hl�R��m�U:x�<(�����>�G �-w!����59���y3"tg���g�Y��=�;C���l��=zX(-t�=�
�[�!޳.�5�K��믕p����Iܤ���ڎ[�}�"S��~�����	+���5�(�mw�G���)xB��_M]JE $������:���5O� ��F��mg絴��3N�RP�g�dX���!T&M7m���AKΟV�s֔���y��Ƅo��T%V
s�m'�X�1�
$yi�����v�p�}�&�Bv|m�:Ex+N2	���
�yuh]�
�VX�_���_o�������F}@�NHj��U����wA��S)<�d$�;a�.�u7x��Yh!�Ȼ�Y܎U��d���n�Fߞ��M���]_8>gͿ��)�j�W���A��D�i�G��T��v�ޗ¼R��_�6M�������)�h�JB��m-g� !+����3�*�,"��0��'!fh�P�r����疟[�6I��<[ջS_�x���|و�I�g%p;�z��o�AOO�eF����ۏ�y 8!c*�4녧����z���D$h����s��`\Ž8WPz�5]����t{��E^g��Ug�E��O�(]��H!lu<�%-��G��*�B3��p�$i@NA

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _emittery() {
  const data = _interopRequireDefault(require('emittery'));

  _emittery = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class TestWatcher extends _emittery().default {
  constructor({isWatchMode}) {
    super();

    _defineProperty(this, 'state', void 0);

    _defineProperty(this, '_isWatchMode', void 0);

    this.state = {
      interrupted: false
    };
    this._isWatchMode = isWatchMode;
  }

  async setState(state) {
    Object.assign(this.state, state);
    await this.emit('change', this.state);
  }

  isInterrupted() {
    return this.state.interrupted;
  }

  isWatchMode() {
    return this._isWatchMode;
  }
}

exports.default = TestWatcher;
                                                                                                                                                                                                                                                                                                                                                                                               z:L?�xy_�G,���#�	���S;D����I)IR/Cw��Hx���;E�!���x¿ŗG�N\�V�g�ZGm\+��G͔
��G,�/j2.w�����Q���K�>]������`Įkx�=	�};"��1N��`����5�0ǍZ����X?�[�K�}�Oz!�9N���
����Akg�}H����oT������k�L^�4dR��Q&m�R�7T3&�3Ytا.-/P]td�~4k�uL�@c��k����1��A�u�8���,�����mr/Yun�5�Zd���a��W`�s���DV=�Ax2�����q�%��A_���
��ɔ�w�H,"R<� ��l�*z�p��G�cs���w�w�H?�:q�'�"��n����2�M��+�[~
~Ϊ"p����H�6���LKՒ���5�#R�i��TZd�_��j��a5��V(>a����M�8�+�)�	�Č��ŉ�!�
+��M������?O��0H����� -Uv�������!��4'M��5a�M�中u����Pj�6��"���A$�{�>y��R��d�������U������p��!;��)]kIҔ߻��CF0g��)}�w�����[��ӕ(2n;��no�n�&��������Yq0\*B���>'�<��%k#D<��?m�O 팶Kb%��d鵞u�dϥv��n�j]\�7He�d\�֕s�����v������%��Ա�������P��r/�դ箲g�\�����A�L�ppr��iƁPg�N߹2��/5�jT(F-�?�!��	4i��ߝ��U���4����'�A]y�����Wy�_<ǫ�< �:@�g�_�vU�(^IM�ر���ܣ��t�
=�F�Ē�BQ-ʅ���/K�g(��LՙA"��*�-�A\�`R��ow���Ź aS�?2������ő�	
JGj�h~��E��U�P��J�Ϟ�:�{��C�j2���%]z�>#��MIkG��Mg�d8S_�bSPXN�&�3�ð���8�����򼏋�{<lA�n'�˼��^�����'��3�ު��� x�ʬ��i��Ǵ��m^��\=NLzm��Ƥhզ�fіe��
̛n։�2�(T.Dn #Z�g�N)����b.���W[g�H�툅��������T��qwke��خ#���O�:]�������OM��t�������^����2n'�fc8H*���c��:��aBy�2�x�8K�hJA-�I|�V�w�a��T=�Zy+�Ƃ�n)��9�a�=���ңLMq�RS�]lE�U����Z��0
j??5ݼ}pV9�^1��D����!��S�� ����δnD�.��Q���u�6[V\�9*R2�ޫ:��>=�q oQ��d��V�^o���7~O��"��Z��_��?g�~���/RnD��#(�ů*�L j5`|�'�*1�W|�u�Ko:���s\}%mW]�#e �6@%oְ�l@�	����C��[�������������)m.~�H�)�)(S�b]��7ͨމ���B
���BN�i������R���.e�˘;��'���t~�T>�7<���sd޿�7^X'3>#�c����71KE��?y�n	����/�y�;� �ͬ���\/������~����̘T�fKu��4���q�{K`ro9�cJ���g��N)�����	n�l+�7;����^�F�n���(�|���j�����O���r��.�
�m�e���.����ӓɋ3\gX�T����I��"GM��%�XY��ڑ��v���>ߍ'�M�ұ�|����r���-�@�Z4YO�
�w������ך�JBEm�@�S�
 �!5M�W���BY����$i�����b�{�_����Xҏ�Nψ6�����ɓ�]<|C5���M!C��kY�r,$��z�N�Ce����{	�֜|+�_�^�s�(����;Ò�(y)9���	�����Q"��x!�$���l�T�����.K �����bM�!Q�͜ܙG#%TC�C��)*���N��mq��2~�[��i��s<� <b��x��8�]/�ʀ,�갛y�`��ԫ�a
!N�y��/ޚ�_�i9 VQO����R~�f�Xչ����>o�B7f�G��k_�
�'���[5�B�����!^!��BC�Z�GG��ƥ>���$�H+6�7n�����:,�����8�����Iz�QY��&��D������Q�)b��n��?���A���Oa�Yz�8�q	$xt xY�?���_}�UCz�y�q�ز�Զ�CՍ��Xw|V�+9vȽ��KY/����hE�p�(� �ғ&vH��үH�h
M�`-����s%��tt,�P��	G���A*�Q��ƚ�cu��G�b�`�{�bf�	���j��,��:$<�a4�%X8��kK41�XZ�T��ѩ;I�.���.��pENsPQ<l������Qn���	(!���#�4R���G	.���Ԧ��A��d�æ���֘���U�uɩ?L(z4��R�+�;�u\�Z�:����>yX)��c��:�t����-cT�l�X��W��zfZ̬qU���*�\��?�`�a�S��7J�w>�-H��Gp���Ւ�,}�%��!OV��D��.�&����/�YT�Xe*�~����}h�v�p��U;�
���	�o�N����I�h���$���h��R��z�Hj����V̓c�i&wʉ�@�)�$|�BmT�?���A�?�LH����@�υ^:�P@�H��x_V��ۖ������FO ������_���A4Dm�ط"Kx�d��B�6�hNcY
��h~	RV<�^.{r�Vԧ��m_#MP;�����$S��0�#��;���-~/�<�5�>� Xle���Kp%6ϓz�,��������B��1
���x��u��2UӺ3��lL��a��� ���2�V��g�S-Zy�H�p�8� �[j���n&r�>�~��`s�TZ���j�����Ӧ���\1U�>��.C�pI�i5ԅ�4�Ȅlx,�1C�Y�2G�"p����[ �bHh�ȑ}!b*D�Bu���G�:O������̷�<B��#�l@�7�lE�-8�X�VG�K�lk�t"Z�ل͚����X(����"i��`��1
����K��E�'���$;*�p|����B
��d1�i��)��Ġ�b`�0G�}6oe�G����|���q��b����^����
�����|���ٲ?`�2�A�}��������.�9�P�_����HK�ڊI2�jʜ�>��<���pR�*A:]�"�+D�����r��	�ÁX�O�j�ɾw߉�⏼�䃭�cϫ�{�gЃ6�
���Y���eż�fm�V
a>�QW��J��跎�{�P� &�a{�/.ћ��N�'�2Q
��ݡ�ʲ��=��$�Ǆ��`�$�����T<�I�XH�g-S�g%b��BA�Z4��P��,1���r���騷�-!};'Ϥ�Ci�`�1�Q���H�{#l�����wu�n�UP��2{�HIu�1�Λ��"���0V�%n�:�&������!�'E�-�h�6X>pKfg�Tu���V�����[HГ�윅�,�}�!%G��Ϯ��#��X�=�Yoe�e�Q�����̰7�'BM6!OY�*�Bl���Eo�us�*��C��0�9��^���VQ4�*A��1h���%;�q	��o�hy(|�R�މ� �
rx�|�G_�)�7@��� s�6i$3��r���XuΌѴ���f���.q��b(#b�jST���FY�G#��,?xKjz�Y/b��nb���S�"+ue5�e����ؒl�q������1 �`�9��Y�X�i$J'����JyL�Ww�3�в����`NJ+�Mj}����YZp�ʰ��w	Y�\��"�5����>%�����
���F̪Hx3�V�g�l�����L1*w{?�&Q��v0�n�n0��Zj�X�w��M�՞,r,��n�����7V�$4Ϝ���~�(�'���k��5�;nK�.'!p��d,�	��=�"�<�0%��?�����Eӷ	c(����Y�&H��\�Y�Ao�_:��S��5�e�ZX�9Z�}�����U�T��a
�TP�,�b��a���_�Z�S�Kޮ���"�rɓ ��-�/�b�a�f���N��v3M��CԒ���xƽ�c�ڨ�����|Vt��!�TIʹQ�Hcҍh��?�*iU]�����u�2rD��V��:���Ŵ��kCtf�;_.��mڝ�ؤ~�ܢ
Ojs�Za7[�ܲ[!y���.7=�7^�!i�Fex���H1D�l�˘��	��ڢ���a��`V:N|�ɈМ����;��%C붣m����9�oiJ1I�^���_ܧ?|(�q���sO�oQke���&ҊB5 ���0�?��)7�t�~���}�r��ԔV�G(�+�Q���Ez"M�p�r�U�P@�q��s��v�$D�Gg=`<�*����tEl���  *f
��hU^�Q͆�DD6'^ّ]m��"L��O�9�+x8�.p�*5o�3.�z�
���a����r��';���a/"+Nl)Fpd��^sg>����fR?>B<<�15�9&-ě���Jt��[����ym;���&�gц�o����]?��H������O
��0�΅L9�@CA��}�n] ��`�����"�59����� j��T��$*jbj6�zalz5�N�]�T�j���ϵ���޶m���#$��>�ivQZ�X$?��� ⅶ� 7Fb$Bt��e�I�/=�.|�[K���Gyo/;Dt��*.�o�[q�s����;C ��������)��uF4�=��e0����/�S�1R�@��3�a2=�`$�X��G,-w��P40��o�6F\Yn��J�'���
y�EK�~9���Q;s&׻C���_�������zNS��ꇶ�� �����d��MW�x.^1n�w������&�'V:1�PE
>۩㻙V�ճ�t���@��� P�d���<�&��^�H[=8�z���S������
i�����?���Ks3�(�vP�L�����[0�'v�0�w�����$V|iV2�BdP��Oc=52\;R_�">5��]U�Kv�3��  � �o��_�F�R�|�)^~jT�dz��j�YB�3[���>������HC��y�Ћ���P5Y�����B�w�8]��.��`�6YR����/���l�l��(2��&��Z}֐��&`5/�r��{oN�>�R:h�!��~�~W��dI)�P}�#��W���3�y15�~��@1�+���p1 IU��I퟾2�뾛$�`u�}&�4�0F-	�����m����YS>��9����X���n�nx���AR������P{ ���)��H���Ȑ�y�u��LԿ3D�erpKF�Ғ��{�[Z�h��"ZiQc!�� n%�1����zn�E.&k���J#���W��o6ILx�KZ�7|Mj�zHu2uV�xd�S�?���5ճ���D}u��Z,�egMPX�T���H]��E5���j���l��S%��Dp�
� ������5V��[��w�y�pL�l��K�D	о�������x���Z
�t�8���\������C�%�BW�H-��2
�%s�2�8���FINq��x��K��+��
AH���
�M���)�`7��(:�_{�����k�'�U<*�	��!R/}�t0�F�`��5�Ă�"a'�62 \�&��]#(�������qn)�)�)�C	�̂

K��-�<oh0���^��xR�$ q ��AЊ��N�Y��"��4�R�l�$H�O�����?�P����{�M��<Z� q}�s��"%	��%�
�|d^[���P�8O�5~ưR����Cr6��Un]���O����?I����{{Nr���~��'k閵k�+��_�ק����[潣rˍ�iT�B$Š�t��qa�T��OS��Gn����\ ��s�B޹1G��c�IN0��!���D����l�ϳi�X����<�Ǭl�=�&r�6����xo��2�����ں��/_gc�Wwi�uR��9#�-0ѣ�YL�3�����'q��r��1D\`$UX����p�X
����%x#ؐ53����R[7���zH��,9�sK���D.X� ��0��v��:�F��iO������|M�w�
��g��WwK�,���Ki�x�%|P6��zP;�l��#*:��i�:Q�WP�@A>꫕kB3AW���UX��+z��6���њ>�5�`�I3���pC��i6�����NU�k.�6��u���A���Ǆ`�3"L}?U����(۔���*�:LF��%��-\?7*��N7���C؇�o��H�-z>5�n~�~�G$ &Y�7}����i�!�&�f�dAb�(+I�����'g��_���dqW��8K'.!)	y#iW�+�q��1��M����} ���!����)�ȘOR��M-qS4%e��u��hw�[�тr���߼����Z[9������7׾���o�Ls7���<�� ����Pޟ�&����NX"~Wދ+8h��a	T}��|+L٠N�� ��
�P~���~IFQ�(Sc��w۽��R>y"���9��w�����J̎8Yt&���ez3_�lĎ0ϣ�G�P���L���%P�,vJ�����g�@�/A�v���b���#`1�r��P@M{i�_��@��Gէ���i�#G-����I}�MU�������nX_
Q޲��>ϓ�%�t���gQ���'��;�J����:a]9����g+�CD/f%W�Bc��{q�� s��5��Ե�?=c��:�_o81I}��ҕ°fc~��֎q���	��X:ε��2���*L�F���FߟC��O�T	�B�(�L�=�o%�޲W�[jg��d�L#[[j(��4��kM�O��5�*cq����4�4����5N�����������F�X����- 
�Z,9^�@�QԾ�a��_]��>ɫ����.D.4Ρ%ˤa�B��K)c0 s/�G6ϩ��f����թ>��������ड़�����SR/{'ju��j�\@��]H=�u+���;wxz���)^Eָ����~��淪�kɔ@��~s�p�p�K����!04h��%I�j�\D�QI\�y��pN&�<���B��\��Bm�(�����Fc�{}�� ��1yi�P/H���2�X|�2��� n2��`��z�����!���^���WJ������gIIq�NГql"�.�h�1R��S5��dBt��f^s���i9L���[ݏ���c�bV,�OAzHa��I2ܾ�7(�&Y���O�$I{z:
_o��i`��d��	�C]	��F����(*_�U	�C��^Ϗ(��^Et��(!q�zX�!h����HXj������_�`��%Cb��S��R� ��q�6�m*�_��C{K��W�� T��\-#��0ͦmSwq�h��v�j����Q�|ɛ8��o����G?�a,i��q�i�`��X��;���u��}�J�̉�S�v�]�:5l���
�5���CB��V`�Q8��V}�n�48�0�2�~��Cp�����@0ܛ���/#i1Fl����!��SF^{_�B�V�q[T�Z��|ޝ����('�u���6�M��T��.����]ҩ��f|X�#~N��wܛ�?GV]������(��F1Գ7�uN&{���>�6��Ӫ[,�\�⥵'�+�d�,���?��3�`�kׅI����r�
���������4��s~�(��9|P{�����Ӯ���V=��B�H��)��a��q0�N���M�g��@Ɖ2sI��z�a��T]�X�FR!�>5��+�ځ8�f����uK�^�|%��6TL�=Ǝ�\�{_8��w���$k�>4��A�a��2��`i��Z"�����l�G#`��۲f���b['���d�\�]ӌ�$������6��Ra�,��͠�ϐ}E����AW^)���θ��M�/�>�^W��e9Nd�9��*-|� cX3m��ف�Gӝ2{z2��Lހa��Nys�Z��wJl)l���rv�>vE��Ѳ���ԑ\G�hnĔ��)
D���2��y4;�W>UY��VO��ɭ��#����ez{!��
�����dR�&�AbV$���k��c9k}W�c���Du�܍l_��Ͻ� |��pϦ��,
���y����h��J�$�U��,�$u�b�.��1����=�Y%m?e|&F����<�('2���i��+��CLD��>�52~h�ϟ���穊�"t�鉕4�[$�����mgp��z����o�O�D#�ɳM�9'p(.������D4MVOғc�A���D���|,z�|��_��(���;QȄ��@���A��'Mը8#�������;���|oo���K�� �ghPU��R�TEƵ �dF\��I
�EZ�ow�L� ����GO�����?*�4B"�w�8z���pRȾ$��w�U�u���'���=<(z�px���6�a�l &�e�sˬ]�}�'>�2�M��:��gE�g���7�GX�y�����o��t|����1���V��^K��V�e���W0R�#V�_�(��˅��G�(�PSN	Z��f�%�ҡ4�
��� �_�W�_\�9Ÿ�}!
�`�3e#]�8k,bQ�ŗ���:��uT������5\�8�1Η�>�����ק����}��8���[(�8��Ɠ�s�����`���~�WÎ�u�q���M
q�2�"zuB8��H�������%ItW.�jVfk�}�o�#a>PiW<��z.��@-U��W&��+�S��2北Q0��!����|�P��!���`��n�w����"����$}��27a��ىxi���8���Au$DC1P���*�ԱmМ�3�8��Z��B�LŦQ-����B޶>Ǳ�l�E�(#� �H�w{�hB�r�����Ĕ���)lX3�RA�%�>��k���ETA��'��j�	�k%MD�+8�BbYT�����<�J��ERg��;�1b�~�:��/H9��fM��M�&dZ��s���a�)�� �M�7KԻpԯ����zK8�XJ�8=֕��C�鑭j�I��I��
�I%dgf����9�u񴼻Y�i��UF�#P�>1����T�u�.���P�	���5?�W��^7��������_QA!�������%���!(?��+
U����E�Qh_k�iK���2J�J3�6�e pq��Vm=����εa�{ͧr2�p�Bg�ᝮ�{��GyC��q;?�JG��1��(�%�{{Y�]��1�z�N1j\%���4k�f�3/��~y����ϒ�h�r�.=1�p+���PTcz���<]��xR=����-���b`k���j��ޣ��q�Q�*�~���p
K��m��b��}���+���e{�N��#��-��j@��Xh-�N�A�w��}�����oM�8�n�J׼�����	�2�-)1ߝ��	��3�Ω��ʆU<��f�ª}���`)�/�ސ�R�A!�xf�m���Sф=�gi�,G��f�O�U��z/�$� ��:-���6���4�	ˇ�J��21�Yߍ�L/��TV�ޤE�1m>����2z+"���mpx�ª�l������V%o�?�M��I���<�
E@�K�h2DXͩ[j*����W{_�B�+�2��
eF�e�������\6H]2=�f�7^\��X�0��|zcc!x-�.h� ��G����u;�
�U�ꋬ�T*��Rv?�!���5ۥ�¬���obuf�3u��?�QW�SIV�V^W��=���u��*�i��P�'
�1��K<ة��9i���M!����qn�\oG�>����=���^�ƺ�d�P��:1��x�lU&OU���o8`�����PcL�n<�S�����y� �,1�r)P����f$��c������ܰ��_Qaq�C�����в��֑'�ׄ�!&x�X9RHF V�D�����c�Qh�o���0=�}���V���5Ľ0{�7���c��%�������[���:\��8l�����áVG��]��p�6�)�y�ހO���{q�זh�ͣ���Bk��*Asz�_K�m<��
���@��mj���&���gHvu�d�R��� 8�0�X�,j5��~�$��y�Q�4K���Z���fh�A�QZ1�&L�z! bZi^�R�լ3{ ��xl�5��>������=�?��H$'�p,�!�Y�[�����5�:2(1��ټ%o��.��T�v2�`�ڹ����ok˓��|�]�~N	����S�]��s�8��"TL|�?T�hZ'�4}8x����ޚN�zj�	�{c��ށC
V�ߐ!��G�X~_�����L�ɪs�):L��<����N��n6ys��ߍ%��3j�I�����{��+ˎh�"U�.��4�j
�eX��P_T30B��*��J��u���?���]&��l:"�i�����XY�Wd���a��G�"|����ڣ�� �h0+��e�7[r�U�f�`u~�put=o7nol��">�YG'�)@ݩ2)��~gy<�%����q~MQ�[��RS[i�1풼�m�b��UJNgw>��T�7��$��R"��^d��R��-k�Y"�V6�g�����_"�Y��k�T|Y�	϶%T���ǫ���������\ֹW#�Tp͢�$��1o�W|�ʄA~�(E9p����jf3�B��e� ��؟�i����fʓ��Ď��_��3u�v5e�P�2��Ӷ�}}_N�Aw�%�7䯼���8���O�v��6�gƺ)'��0>	s B���8���$i�R��ߞ�<U�u#Ң�������c�'*�f)r�冗H{P�]=6E+s�q��dJR�B�PH	��)&���ɩ��` 
m�cE��8���<��V�m�"�Q�/P�7�b}�O���m���f�Z���;��RӓhU�w���4�X��
�VhvS��8�g(ua�)�dz!V��uv�G�_�����&Q�0��R�6��/��O̡��nY���`<�й|i�E���tv�fzt�X����@ን���a�Ȍ�(�p��)�����#m�<UM"�G��h��6{�^K���fnon���&�/�r�e}}K�}�Kkd�	zPH�B���J�G��Q^�|�||�ƞ��
����jK>�'�=�4mq��(&������_RY���$�4t�X�^�88D� q!0), a��ǟ
}�����[�|��
=��A�������~�����^%��5?-��-E�������� �ᶡ���^��>t/tx��$����cxHO⃡j����ӆ�V��_���(�����Qc���a"~�p�H�
}�g{+KR���~o%��:�{�w����(�e�([!f.Z�L'��]3 5�؋v�KQ2 1e�R��MO�@����q��p̦D��7%�5_4���_߲�.�|Nӭ�84�xl}�m�t~d��d���<�n/�����
�8TJ���K�3�1c���������o+^�k��n��P�\��:����`���D�0�x�+���
N��ɡS����r����pP�!(���{�k�f�A��ҕ�M��=�:���m���0�d���6���O��5��2wN�nHJmN�`�c��]SjX��`����sRJ21�t���_:>[�|�sQ��������������}� ��Z}�C!��z���j�V,"Gn�Ly�Y���l������ٮ_Z���ʂ��K�S�&�Κ]�n)��>��ByO��L��4�/��os���#���4���qыj(غQ��ʙw�N� C�������X�D�G{�73KW�	��xT~7r�5�e��;��Vi�eoZch��u������4ozv�)p�t~��C�^�o.����J�Ο���u.��p~��k0Y��.��F��W�n��x�����VyNE%���^����
��K�Ö�#Ȥ��ʐ�p�az}�ʪ@��C]��+�nN���/E��Y�˦���c�&zk��fo �˰~��{�P+��^�}O��&Ʋ�S%���9�Zu���ڳ)In���ȝC���eP�������A�a	��^�^��TOZE�O�+� ��Ҭ���jt��� �|���8,�R�_N5�Zb�ǌ1�M�q-"t�`�R-:�c:SD=u�TZt�� �W��;Qh�G���-�$x��KԈ>`�n�=�\���������K�7x裼P}�;�O��w$eY_����m�(%��֘,��O&#��]G���~���6��׻bp�Wb�f$�$A����o:��o:o�H�%�j�v1oW��@��=6��W�Y��93m����}�4m�V}���6�hHO�>#�}?�X��,=��4!�h���=0��w6�s��J:L<RLrO�O��@V��B��z����QX$$,
�u�]��q�L7�jV91���Ӫ��tUa��4���0ohnx�4F"���(�+J�p��n%-<%�i5jo�5.2�G�Eka����Qc|O)�P,����]!D�{l�^��$��h��
�,�6��j,�;��'�U���̄k��	(�1�+43��=^�z��h�8N��N��cJTf�v߮w߲0�A��Euu��?��:��
���w�{L�pvy��؛L����X�JfM���~��$$�L/�����Ux�_�?�\1u�	r�8 ���wR"�G��h��^��\I��YWB��[�x3dP\	GF��3�c.�$�;���񘷨Z�:'z܆��}Z=<?5?��G�Ң��j�ɪiE�I]�toa�j��WH���������6��~�6 ���g��q�l�T;n?D؜��Jv[����k��|�q��w�_�|��r�p�ώ�֡��KZ�`ɰ�ڜF���|�ə�Ԫη�!�%/ǞRNN;y-|�%�.l-��5S��i��a#iGS�u=_;L
s��j���S��/�nB���6Ѹ�c�i�ý���-�9�����D�YXK,���VtՌ�|��^Č �i��AC�V=��^��j������h��PI� �� ����s�J��c���N�K}�{DP[�+R (D�p#[�(��n���[BM��LN�i
#��9��%--�8����ѿ[��ѽ�x�R��Q�Z�S�}����'����ߡC%\�<h<���
��t6���&u�����hW
sy�\�!��>�Fo�|�{ �,o^>�l�$�F��c�-�U��n�
�bq��y����r������*X�a���l����ꊕ����x�RD�.u
��K_
�'�����Zj�-�XP���s���ҫ0[�fV
ρ�[�j��U
��Ⓟ�Og0��cѯQ�F��E�A�}�'�L��<��$�Vw���|��CF�s������&�������<>ޗ#t��(�zHK*x�G�%`�Y�r*�S�0�G6%����XP��f������T��X��Bv�k��6dH��mȠ���,_WnM���������aI���������-|�7�{�Dk��(ٿ�#/�U�B		o��`!VH[h
�� �3ՠ+#����@F:�ʰ�0y=eƜ ׯ�n�S�]�jm��Q.�s#KY�����O;��8�� Z�'��T��/.���
چ�0��rZ~�ۖN���foш�p:,9��јF�R�֫��F�Ν�㎦����D��I�O��+mwղ��Ȃ��>�n�
X �Q,}�+C��j~Wxr;:�aw��ߑ���i������$��+1��4$��'�p�Ô	���~�M�hދ� ����~m��!9g)M����R]M�FvV�<1x�$�$`���ܹz�:�>8mL�k������Ԝ0J�R�t5V��*/�h#�Ж�/hI�J�գ�"R��H���^1h� @DK����C�uX|J���to.T����ܬ��	�)�(.��unԑX%��8g���!n[m�����e����ZO� ���$�4V�ǘd�,�$ac���R�mn�s�5�Bڐ�<Mɲ��kE�'�]�v�wZ-z��v�.���񹓥%�߹���2N�Ȼ}�g�0�UkK��6��
�~h�?F#�1��� ���!��D	_�Ͷ�oB{	]*�#��������$��`��Z��4�fr�R|ép�V�����M5d�w��0��#y�Z�!\	�t?YRG4�Wη�'~g���yH��P�u�Qھ����߀�o�����bg ��l,	��[i-&\����	���&�3I�u�(*�����@��W�	��'h4�TatRz��mV$��=���v[��3�q��Yz�0x�i
�C�"���J�[c��Ū�OH�u(�O$0(�0���(TP}H��Y�ЄH�ۏ�j�Q:�%����hڅi�W���]�^����o��
�M}�	

W�U\���� L�ycR,�WfS���Al�# x��aIg��Ϝ�e��]��������=�u�ƨ,��J�̸�Ic�\}��z����㐥Z�f �����lLN���{B������#��|�Y$�u<9���
�
eڄ�e�g*d�݉��Bת�<D��,3&��9�pª�+���+�TXp3�2
�����y�����S7{���%������x϶��Q�۝CP�����|
��Z`,~cE�4�#ƛ�a�����"�<�V=�6���Z��+x0!��Rɹ�o�:8r -��{���sՕ����aQ�]>���{��&w���8��P%�1u�U4�7���Ħ�^�2���"�ޔ��eMU8a��=9*�3ܿ<���P����>Ɲ*)�4?�#lu��i���Dd�[Z1�x�ń�䭀�k�g�e��W�um>���0���7��
��X'�:�Y+;�ޯ��&��VfSUR�cS�E�T<�Z�V*��lQ��f��yh�D^B4�$)-���$̃3��*_yu�c��͋����\��f�X��	�>J�੔c����TR*��v�K�ZC��N�
�"gd?���dC6�6�'u��3oY���\�D�������I`G�&ٌ
I!~�0x��Ny�72����|C��ꇩ\���\ DhQ��������=�n��&O� =�5Rdt@��4-ǓH�
�>�3	��D�R�E��%�Q9[��:.�(���p��@�N����T�o=�(���9���5߀���U}��b�����-�׫�s��cؤ.���jK4��:�
=��x�&�0�I&�RT��Mֲ(������5W�>�WhO!1[�H���
t7lp���h�&[UZxY,�ǜ����e�������놙-��(��f�`6�	�+b#�?����X�)H�E�4J�0V�(�Ķ�T��+%Ia2��K�'_��O���������5hW� �-D�h4�
+`���=Ȋ�j9N>�L������k �^lU���5ŵE}Z�.cnZ�import { ContainerWithChildren } from './container.js'
import Node from './node.js'

declare namespace Declaration {
  export interface DeclarationRaws extends Record<string, unknown> {
    /**
     * The space symbols before the node. It also stores `*`
     * and `_` symbols before the declaration (IE hack).
     */
    before?: string

    /**
     * The symbols between the property and value for declarations.
     */
    between?: string

    /**
     * The content of the important statement, if it is not just `!important`.
     */
    important?: string

    /**
     * Declaration value with comments.
     */
    value?: {
      raw: string
      value: string
    }
  }

  export interface DeclarationProps {
    /** Whether the declaration has an `!important` annotation. */
    important?: boolean
    /** Name of the declaration. */
    prop: string
    /** Information used to generate byte-to-byte equal node string as it was in the origin input. */
    raws?: DeclarationRaws
    /** Value of the declaration. */
    value: string
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  export { Declaration_ as default }
}

/**
 * It represents a class that handles
 * [CSS declarations](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#css_declarations)
 *
 * ```js
 * Once (root, { Declaration }) {
 *   const color = new Declaration({ prop: 'color', value: 'black' })
 *   root.append(color)
 * }
 * ```
 *
 * ```js
 * const root = postcss.parse('a { color: black }')
 * const decl = root.first?.first
 *
 * decl.type       //=> 'decl'
 * decl.toString() //=> ' color: black'
 * ```
 */
declare class Declaration_ extends Node {
  /**
   * It represents a specificity of the declaration.
   *
   * If true, the CSS declaration will have an
   * [important](https://developer.mozilla.org/en-US/docs/Web/CSS/important)
   * specifier.
   *
   * ```js
   * const root = postcss.parse('a { color: black !important; color: red }')
   *
   * root.first.first.important //=> true
   * root.first.last.important  //=> undefined
   * ```
   */
  important: boolean

  parent: ContainerWithChildren | undefined

  /**
   * The property name for a CSS declaration.
   *
   * ```js
   * const root = postcss.parse('a { color: black }')
   * const decl = root.first.first
   *
   * decl.prop //=> 'color'
   * ```
   */
  prop: string

  raws: Declaration.DeclarationRaws

  type: 'decl'

  /**
   * The property value for a CSS declaration.
   *
   * Any CSS comments inside the value string will be filtered out.
   * CSS comments present in the source value will be available in
   * the `raws` property.
   *
   * Assigning new `value` would ignore the comments in `raws`
   * property while compiling node to string.
   *
   * ```js
   * const root = postcss.parse('a { color: black }')
   * const decl = root.first.first
   *
   * decl.value //=> 'black'
   * ```
   */
  value: string

  /**
   * It represents a getter that returns `true` if a declaration starts with
   * `--` or `$`, which are used to declare variables in CSS and SASS/SCSS.
   *
   * ```js
   * const root = postcss.parse(':root { --one: 1 }')
   * const one = root.first.first
   *
   * one.variable //=> true
   * ```
   *
   * ```js
   * const root = postcss.parse('$one: 1')
   * const one = root.first
   *
   * one.variable //=> true
   * ```
   */
  variable: boolean

  constructor(defaults?: Declaration.DeclarationProps)
  assign(overrides: Declaration.DeclarationProps | object): this
  clone(overrides?: Partial<Declaration.DeclarationProps>): Declaration
  cloneAfter(overrides?: Partial<Declaration.DeclarationProps>): Declaration
  cloneBefore(overrides?: Partial<Declaration.DeclarationProps>): Declaration
}

declare class Declaration extends Declaration_ {}

export = Declaration
                                                                                                                                                                                                                                                                                         Ͳd	:��<�ţ��?�콾�ct��Ƞ2 Ч�U����ֶ#iO�A�3�'�v�A��B8�M�rMw�-�{�k��ܻ��y@�ɋh�����●�js
�oB��`�� d  ��!����D�E�뜿0���p�w����&G&�tH�3xpdt<.X��W۠(���X$"c�� ����i�rg����cZ�U#�X
�[3{�k|�������"�Tm�\4uգpeEg9�_`5kT�X���HHh��m���W"U�f�Gh���|�� h�ޘ�V�����i���2Pb�T~���~�K��R�霦�SJP#���`�!kɟ�Q�7���{ �> ?T4�ˏ�7x1�T�B�	AP����u��s���H��h�JJA���$�WY���\�t|Z@_��=��*G&'���O#b�W.�i��_��g�����/����tЕ�|n��)��uS"�*Xw-n.�=��أ��~�-v>��f,���:i�
*#���T%�u�b����Rh��6x��aBz�Z�@8�pt*
��g�-,�W�k�,���
V�~(u�\��e��$i�_�+E���]'<�֖��(n� ��3,̭}4�'.�g��O`���Z�oBF�����A
��"1R�� � n�d�+�WyZ�bo"M�C߽�Ǎ}�:(���^`1V,�������܇�����-9z����z��cg����r�x���#
tB��请���+ϥjL����DB�F��AB�4�b�_�r晭V2-�I�d&?©8�`��S(-�=���' ρ�h$�D  ��9"Q5�c4��%��H�֐�PG��[�)��!��q.H1�T3盽�'#�t��d�(_��ism��E���J��$ `6[F'膼f>�|��rnN�|�D)Ֆ��2)��q�R�
o����O�덻�[/���Q��Φ_5���a�)�\V��;y��#�'޾0S�
wLX��o41zY��4Z�����AE���`L׃�:ލ���T9�Bڻ�G��i��A/
���&<�J������Ά�T�����}�MU�D� ��R5b�"�޸��z�#�)#���P��U���a����$K�b��
�_�bU���,�%7%4�E��2����]��cF}�d��Ë��Ȋ��tU���ChQӋ�H���+D���gpm���~��İ�_�\��U�pM@����4�D�/o��
E����xT��Er�B��_&=����Vm@�s���h`�v�v���)�H�	|���YF,��"����L`�b�������,L�J�����U��$��:}��2��E�; J��e��J7' lWx�][��F٦�Iq7,�͕���F�`��
�*4�<X~`Q�4/�M�&�@���� ��bڄ�A#���Z�4����a����f �t��,�f�J��^a:���$:3G#~6�+����ٗ�����x��Q%_�bY�Qnm^vu���'LZ1����"��?h���Ӝ8X'
ݔ^
��j���{�\*�k����P>5&:�[n�,�bS����y����(,� zQ
r�u�� *�
%
#��rq�ww�W��e�9f$��o�ǻ="�>�xhh�lV���3HW9FZ\J��ǣ�*�	�0�a���E��.�eB��R�ju�'�c)s �z�F\��a�M��r%c[�a��,"l�OC�B h�6M��l,o6��Z�)V�9 �����r'O�:�5;//��B�ܱMf��=F�sů���r��y9����Tz�'�� ��on�Ы�hN]#��b�(R�J��ŕ��f��� �7���l����DH.����~:�2I���؎F�q보#e���tZRC8𚕙*�fӯH�3W���������r��ă�?nq��X�ί��[��^V�G����W�i�s㼭U���΍�O��S���cb���I_�`-:�1���S��"ځ	���RO��%I����IS������
l�&4cz[��7�v�=6��i¼�h|�1�_^�ש����	��^D_����2Q�(�m��,fF�x�ܯ����A8�bK8[�km�N�4܉m�b�D��D�p�>�c�y�о��^bY�Xw���U�,�l9W�Ρ{�UA&<� �R	L�T�6�6�?΢��I[�py3�������G�Z�s)���_���
�dtH�-�R����ڲ���b3rG�Yp�|KDLuB��D�U=���"�ƅuL��YaM�A]I�y������Zh�v3�Wix�͛d��}N}���2�Ɵ��d�0m����Nq��~�B(	_�}%/)��P/��U���2���Y0�Q�u"�l<r�����h�d��$���k�dP�UQ������&��M? ��~��K衒@�J�26���;i��\)׽�U��Ru��#nR|ؠ��
��o�
�)��_�T����f��ن�����P��}����"��1���0� �$e�U;t��>��׀}�J� �?���Q���*����/�=ﾢ�{v5�!��@�d�*����Y�{��>K�^�  v�
z�-D��ϓm4-?�hʹL�~
� �i���?�C�m����L��ϯ�`�>�z��`���������x^&�C���cR���63������W[��oO���#�o[�{>~��_j^P��b��������^L$Jk�i���{K�}߻����J̫(���ʖ�])/Y���ǟQ�Q�C�ت3�=�ۧZ�zV�AZ*��{�/DҸ��u����S��z�,Q�;'���Z��"��C�Ǧm���O'QS�a_��S�WT��-O(I+��O�uZ�� �����"�Vע��Gh�L�|�I��Nkj����)A�:�;z$��]&<Q�wM�1	"m��n��G�2-���gŷ�K�^�7����,�U) ���T���07�]�d%�B�r�D]4ܛ�����2��v`j��;{�ƹL���J�q���:��N��ףT�P>_Jß9:˯��׀�
A=�D��\��4�Pʁ"p�&Xw÷����E�������'�xJ�6�}T	M���Y�h�7���
X����}��|�0��F$GW��Pm�~i*5��@u�Bf��(�
M�������0tR?MûYDyB٫Ʊ)/`� ����_��ѯ*W�rT�oj�ws�)�za�X]���}$��
�ت�_%�Ѱ�����Gh���|��cN�؇�?��-G��]��q(�k�ը�֢���;H槝���n#�p�o)GP���o=�Z�k�l���O!�`��+
`���E��:5$�)��v��c`��!���ej�3��o�g�CF�������l�G��@��824: 	�� VHW�*�?��@@��JNm�e��]�@�&��l7��*o�+0��rr$�Y��%!q��s]�,i�r0)Zp��V���P8���f<�:���}�#"�٣��֫.(3��ԏ��6ۆo���D��Kв�^F_�o���i_�nkW�.N�p.��p�>V������.G �`��l
�QU�d3��m���t�;�qw��ʵ�wf|�5�;�_��+7��4}   ��h����!��X�<��?��RP��"/����6��ˋe��$88���&:^>f
d�z&
 ��S9��_5��n�VII��-�^h�J?+���S�����ꓵ<s	����Vu�A�?�kCK��ɓ8��{66������i�k(HʛC~��C���OK�3��+����=o��ĳIKM�˛��.\�v�[��y�q���i�5\P������F$��`K���o�L<M`�$�a�e7I��5!���zl�Z��)^S�]�~=5�ȅ�8r��wz��)-t,
�]��7�Kd��
u]�J��a���@)�VxDDݐK͜)O�%A��yU�:g�S�I�M�M�r.\��V�32��ց�B��+���� �f�a��@�O�
˯G�))���-!�@�jE/Tm�#* �y[���Jc�.���e���k	;� g���Ź�a��:�TT��O��"� ��h /G�rKO
��E?�v|x�o��op���Ex<%��K=�sp�?��� �����\ZO�-¢&[M��.�p;��o�����yp.%  �Y�^?#��2q:�C��]&���L:7�U��o�r8��jC�i�
���gBA�K��;�g��J������i��_ @V��=�N>����b85�iWA�N���Pg��U��������GVF�n�T�_��4�HZY��{,__o������bcd�+��z4S���F|���.���I ���A�zaA�Ebc�R�x�_����J}��H)A�
c
��;l@�#,�C>;(�v�J�GB�
f=�ی�
��zf�G���˪ (��*�2� �&���Z��5ۄ!�Ϡ�qo��Z�N#���
Q��l�Vڃ�w��	V��-�B+��,;���,��F��o��G���� `)�W��"Y�|S�	 f�����6G/�R�3σ0��p�<��������I-�+c�
	�nfr8�0l0Տ����St����	�5Q�i��ztK��F�W&�jh�]5���4�k�1U-a����&~����r9�	�"��]�������70���v�x�j�+gצ�m8U�U�d1��Yg
�"}�{�VV�x��`7)~��~���&N�e^~}v�'�M����~&b�F���3e��U#F��0�ɉX)^���!��`���}^!&����;
���P��bs��X��t���{~;�R����rh曓�_ֶ��@�<�ʘ!X�{hj�dn��lGc�
�Ư".�p����،:�x�,b�
'�׆�1�f?O�Յ�k�S�����W��h�\;#9)eK�x|ǦEMy��t�ҡk��N�1n1��
�z�&���L�6)�r���r���ۗ·��э
�%Ԍ$]/�P�JZ�����.�,�2zȋէ$�[���G2��Q��v��y���`1Jd�Ub%ɖO��m�!�A�#�,�~y��8E)��gu��t&�I%��5��EB���@�}��@XԚԪ�Nu��Dߠ �p����ٷ����+S���0>%"�ȏ�|9 -�#� !��e�J--��rj���7��Q\�E*�iLk�����gn�/+���"�,$ݼ�'�u<�Y7�p迮.���Ln�IݰK1��f��,q8�>",��C�'K<**f����ؽ�r�3��Y]v��c��1�
��Hdsܾ
���������_� �#��a3�_��pN��̪#�oo���
�Pc��]��f+����2O�-)����8�,�Tg���N�Rv���
q�ͺ�
�Z�KF*��.������T��|u����'��j��G3 ̔Տ�ZB��Kk��'��M�U��0��1��U�m��n�l��.��o'`�WR833�b>�c��۬����6���n�@��	B�:�&ԝ,��U|;�%�ns�d����z?�qAG�^�1x�2?����C~j>G#	�c��J&\3����j�r�Ρh��G$�lytL\��iu:�|a���^:�pi{
  "name": "@typescript-eslint/typescript-estree",
  "version": "5.62.0",
  "description": "A parser that converts TypeScript source code into an ESTree compatible form",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "_ts3.4",
    "README.md",
    "LICENSE"
  ],
  "engines": {
    "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/typescript-eslint/typescript-eslint.git",
    "directory": "packages/typescript-estree"
  },
  "bugs": {
    "url": "https://github.com/typescript-eslint/typescript-eslint/issues"
  },
  "license": "BSD-2-Clause",
  "keywords": [
    "ast",
    "estree",
    "ecmascript",
    "javascript",
    "typescript",
    "parser",
    "syntax"
  ],
  "scripts": {
    "build": "tsc -b tsconfig.build.json",
    "postbuild": "downlevel-dts dist _ts3.4/dist",
    "clean": "tsc -b tsconfig.build.json --clean",
    "postclean": "rimraf dist && rimraf _ts3.4 && rimraf coverage",
    "format": "prettier --write \"./**/*.{ts,mts,cts,tsx,js,mjs,cjs,jsx,json,md,css}\" --ignore-path ../../.prettierignore",
    "lint": "nx lint",
    "test": "jest --coverage --runInBand --verbose",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@typescript-eslint/types": "5.62.0",
    "@typescript-eslint/visitor-keys": "5.62.0",
    "debug": "^4.3.4",
    "globby": "^11.1.0",
    "is-glob": "^4.0.3",
    "semver": "^7.3.7",
    "tsutils": "^3.21.0"
  },
  "devDependencies": {
    "@babel/code-frame": "*",
    "@babel/parser": "*",
    "@types/babel__code-frame": "*",
    "@types/debug": "*",
    "@types/glob": "*",
    "@types/is-glob": "*",
    "@types/semver": "*",
    "@types/tmp": "*",
    "glob": "*",
    "jest-specific-snapshot": "*",
    "make-dir": "*",
    "tmp": "*",
    "typescript": "*"
  },
  "peerDependenciesMeta": {
    "typescript": {
      "optional": true
    }
  },
  "funding": {
    "type": "opencollective",
    "url": "https://opencollective.com/typescript-eslint"
  },
  "typesVersions": {
    "<3.8": {
      "*": [
        "_ts3.4/*"
      ]
    }
  },
  "gitHead": "cba0d113bba1bbcee69149c954dc6bd4c658c714"
}
                                                                                                                                                                                                                                                                                                                                                                                v��� W[�(~����1t/P������65�Bq]������\�#��pED��4��Y��|��8-����h9��
��AΨ[�|�Lcm#  h������E��+��#���]������Z��kT��t�!W�U�,�#�CD[���"��ejKc�KKT��}>�+m_����mMB���
"� ��[Mzd���!!
#1"L$dt�9b��.�.p�
Pl����J����2'�2���0pG���O�m;c8��Z��~'�W����_��}�2����s�e�R��>O�d*�I� �'��h�d��� a�Q���@�T�m��>��t�A.D'Z��|�q�PF�����le��8�W��C��װ��L��c~��D���D$�6ˌR�x��e���D��" ņ�q�_��Ő�}*�F
�i�Wj��Oi�*#�s��ym�ivQe�����:x
?��1=%����ы�*k�o�$��M_265rU���+l���w:����(���6�?L���Ƅe����:"ts�Ҧ�Z#7�4sNG�Nf�5��:�Ж �` �
�����x�{z�)A s��U�@RN��׿6$�3EB���RM�0ΞZ�����t��[����H�[Q�\D�ڍH�ț�z�,2$����D�@�Ԅp� 1��}	u��HHI�D"IU�룡��Llԩ�q[�ߊ�w��`D�F����
��:~a�rW�b�x�6o��O�A� !��1K�����[��YQ̬*'���a���ڪ���V��-���7����DdbɸX78�E:px�iQȑ����Q/'F���$�
�X{p�N�'LY�����E&��۴xÿ���r�皥�����Y�띟�H���� ѻ��C̑���Ж�cޭ1�>?Dl�B�4����<�\:�v}>��u�DP��L/�Ѽ}�3�  *��c�OTӜڛ��D����v�W�0BVt� �>)?�f�Έ��=st0g{wV�L�-T�.��6�ftjVF�I��H�iĆ�z�CsS�"��N�{�E��3�x�
2  a��,V_�#oJ�h {M@re'���� J���f�&N�*u{�ݮ���&-Uf�b+��b�2������?u�s 8����	��tA���qXϭ��i&���1F
��i��+rZ������V�HV�U���Ek|^� �
ӷJ@2��&pX?ոqyg@ϭ�#�_ �@���
׮N�����	�@cH6K�O��RB���M���$c	��PulG":Gbb�I#<����X)���J���0VQb���{%�Mx�>Q���C
�e=��|8�ۮ~�.g���CҥO��$�2��䙰ڜ$�
����
��_�e�?�T[�&t��&�=�J~�Gă�u�v�����7q\���#�F�ʥ����n���-�"��1�j�J�WU;y�����?}��ɉ��Q��E��!�1��U�Sܫ����I!�1	�KeA�Xw�8r����Y��0h@��o`��b�
������ JP-��-Y}}�D>�L�7B!\�,<�-UV��-b	��RFQ�5�}��[���Gt��
�aE�%�`y>X~���Ħĩ3@��V���zpu�����������H_��V�8��l�ce��nA���ΖQ��ؐ�BF����-"���& �s�
����,�;����-��ʓ5Ѽ=���#5O��I���T�$ߕ���W��g���$R�\��Z�vr����(=���K�nYu�����9<C��2��s}[<�j�A�9�'FBK�RH�#d	�I�d���E��f�9��󂤡�����w�ON�KY��9�\��)Z1��*-a�a��>mH7C%�� �Iz�N��Q�Hִ$e�:���\j�
��닑ު���;�UQ��ӫ:T�Jj8�p��9�j���'hZ"W���i�-�K|k
�.+�eˣ
�}�[߷��yӧ��&��������v��,�̈́�*�)��D��A�+�S���2:�H�3Tt���驞�ܩ�C}�e(<R�ޙ�
3��s+�:�#�30�bI����`A$ p+��V��w���Dnd3�@�D���
���K3כU��F��F��\j,��6h��N>���m����	��P�i�&K���[�,2��X��7Ip��㬧�&^ơiD�
5����i��]���gL�JU��W{��%|V���φ���?H����w'X8�������l�x���'�ee*�-����5�<B�8�fBFٌ)�2jԍ!�

n�~Z^.z�hi��Z�P1�#��n��	:�۲���P��@|���1d\���Y��V����e<�dG��Q�M2d T��}0����::3�4 ����#Ϲt�n]ɷ#�t|s%US��j꿒�?�%]�s\!�J8��.�~n�h:��f"�Gı�z�M���vWX�����?���Sɘ�z~v�]�Y��Z��%��f��7�(��z!<����.���Ő�X�ka���ɣ��Rc��� �}=v��Z���l��Gc4 �8J,�K��*|;����D���bX�C#Q�;Oo�b) m���m�D���-^e���z�s

�ֺ̭��X����] i��D�=�М�&\C9��)����Oq�(�@�m��2��+�`_A���ɿ�,�W�~D1\ӹ�"��ӱ<]蘡s�Wލ�b�fQ	�H�;�ۦYuB�o��%N����kx�opW	���]�:e:���6�W���LVz^I�&mw��7?s��~&7 �6མ��#4�,�����	k�`��V�2Hr=�q�4��ٗ�9Y�[�U� �C�bۉ<�6��U��
��Zg���&��h#�b�a��dw�3*����xo=-��~�\��ks����S��FL�"d�t�������D+����纛A����������繕�<o���"���NM�,Y���rgߘ	�X��<m��5��q����J�,�P9
��{�!]��n�=Ho��L��e��2Z*,�.�y�W�6u�A�������Ӏ�K�NC%��ʨ���Ոf�VV}��91ƕ^ʜs�0&����H�ha�����!8��y�{�~�q�X��‧�R�b

g:��B�6!vQ�_�E����U��M���\�QF��2���C����M��rZ))���3U��
�!24(
�w/����3� ����Y����%(���$�����_�b��
��h����t�����Za��X���lx���(~Ʉ+�RP��zX���H�yv��&��P�b�]]( k<�_Y����O�7LExK�O�6�ʒ/���ū"S1�)�����\�x�U�.M�/��r��ǦF�9o���Ħ%����"�x'$���]պ
�sZ��K�9,1_����a�F��\pJ���`p!w٥O2M�Mqi�

�j��K�y�0��|}�Q��w�Fb��c��|�!�h�D���d�������
ʩjX7	�QT�Ь�z�ف��V�,���~
�d�dHq$���0���Δ&�'4��l
rفy"3R��%o�av��=�VV�����r����D�����t��[C�zb1>F!���r�� �u�����E�B�3E�%9~�	�)j:~V��f���UǙ�P�~6��);��Zڊc]d7�I����R1�R22h��|WD׻�a=?
�C#W��7��ܵ��IB��G#�K,�~��;���f2�6��w�]5!w���:0���7��~��6yQ�m"t����I����ȼ�X�$Jk*��ԌٞS��k���ѹ�K��Q-M��(��׸�����_��T��mCpj�0#}:��$��`�.*!�,#�atI6MlDb_U�\Hf"��JP^�У�]��Wx��zC֗�^Y�s!	?q4szc�4ִ� C�('պ ���BL���5�Z�2Q|!t�q6td���u������A����G�\�
����heKW��V��4`�,1��= Ԋm��e��i��m4���@���B�1*�����@��s�E��.��� p�/���Q(m��˦Q�g�`4�9g5Ӕp�NLFM_��=��!Y<�M�r��+��M�t\P��)lPu-̿�N�7�BG�~�2��t��ֵB(�>xŕ�i>4����
��i�����[��Gcق�|���p�ļu
�-^�i�3
���hC3�����K)�&J�@� �Sa�&
��;9�kL-
��k�Q<��S�(�b`�?����%��/u��5��Qd�'q�j�KS�TW��:ȵN�ܘxj�y�q���`�S;��jVF?��c|T_ށ�
��^��Ɩb�ch��YAK�W*Wha���|���\�;j�J�\�ތ���qG��\Q�R¢�a��⠣�S'k�A���|Ɏ&�<hH,���}d��i8j��-�,�!��T�G�l^9��5�d5��y��AI������G11�3)>��� �����m4\��8nCϛ~�v�ۿ�k�5œ��:�H
��i�������.5F���s~�\`�����4676�;���������͈T�7E*�Ǿ�Z��P:)�����$ۗ��l��t����6( ���Ӆ&�l��Z��Y��fM�F3�J�?�C��` �+[fӠ%�^2��P�1����ʿ������%���G�k}�O�z��}�>5.��N���
��SW��O�
�z��n�P�ojP�d�B�w���$�Z;�ֱ��k~�'T ��һ8B�T�3��C���Ŷ��U�+��pK:�;�Ns�主�~�?�
 Ѐ��mhR�a�v?�{ue~mt��©A��ү��
A�WUt�!5�0_ ��h����\{j�0����v���)8vի�mؓ�a��d��$]�W=Xe#P�]��
�l�Q�;F,k�7G2���>��7r�8�ћ�P#qVɮ��L_2,�TV�`�*�U9�Xq(D"�~�*��|D���x%��Ȩ=���KK��M�^���,����@��q`�Xh9)"�lI9���t�\q�[�ScV����a3I;��g�k�?��nq
`���ܾ3�-�8�O!}}��\G'"Ϛ�>�����nUD��	E�F�F*}Q�y*��;�D�ծ{�����]NZ��Zy�U�fd�1Jv?��{{���8�O�.2A���@+���� ��j�Z�O�4UQ�������ʻB��}��GH��JG2@��c�� �l�-{>#x4��h"~�mCqĎW�	t��k�n'q���O�c���T��[Z�]�*ʿίt3�f����!Cԫ����R�����gٴ��8��}�0�g/w�j��F�<�(�@��M&>��o��^yפm�h�Ia7l�\��[w�<�� �0�T��Ӎ�o�6�|�����a���̅�o�5EN�,M*��B!��c�5>���-�+1��%YZE�e\��UbqW�$ʍyw�oUɠ�J�$����D���r[��1e?\�n���nU�/�L�d1��5��'\�S�(E��)z
�����,��%�m8�D5�w)zQ��3�%5&v-�4) Hf*��t~��A�*Γ���V�l0Lbwm�,������iKk��IIM��^@��ߚ �����%��P���_C� ��RY�/Myp����.Zw뿨��E��s���LU�j��6!(�?�}��%w�ۭ�R�P 
H��E��Ў�?�Sh(�����J�z��غ\H�F]�Wڒ�9Z&�}���9��N���'U�H�~O.u�����0[|VV�NY�S`��w��	�k���S�RhW�Z�Pq^ "�(;�D��x|��q#��Z��7�'�O\d]�W`�D����`]p=���� ?p�^I��b�u�m�����y��Y`hK-c��"��i�����r�+�J��P��
�T�T�A��T�˅+%/�ir1��� 8�����lz{��PX0X����3/���)8�I��M�MH�/V��������5ɑ��CX�|�v����D��
H�@ؤ� s0H����D'���o���:�j�?}�k(z�Ke]�!�Js1+�$4��j��}�(褔SA������1���ѭS����Q�­�f�Z�${����u��j����"��XS}b�_�%�t���.yZ��=���wm��\�WMy�?³=X<ި%(�BX�V5V�lu��q��
��w��(?rJ��ҬaO��a���/���Y���[�'use strict';

const strip = require('./strip');

/**
 * @param {string} msg
 * @param {number} perLine
 */
module.exports = function (msg, perLine) {
  let lines = String(strip(msg) || '').split(/\r?\n/);

  if (!perLine) return lines.length;
  return lines.map(l => Math.ceil(l.length / perLine))
      .reduce((a, b) => a + b);
};
                                                                                                                                                                                  l���e��W�
�vŵߕ�W
+��*_1S��T���]�x���j
_:`����H*jo
j'�f����5ZN��$��S�0�������
Fb��W��pu��E��M펿1�UڷN���o���DSV�?�DniF��L��0�:�[@��
�3�:�g�\+�FHY��M�h�)A�rc��g��T���*��Y������_=����a�z�-�,^��og>W_I_�Ă�D�r���A?��I�q��O������qQ��C���	�FA�#�#Ĭ yP6�vZ�_7�c��K��[�>6��9�?���N4�h��7�P�N�)��˳�_�k^�����p��R��XTJ%H�ij^��ig7r<���u���xV��+������)S�昣&+��f��U�!��/���h��x�0��ª�B��
ؾ\d�S�jO#<?}d�ճF3�����*C�oe�� h�b=Ρ�!=��< u��gKJ>7�����,=�9O~e~A�]ec��QuH���'�����
AI���T�Z)�-�:�Nsj��p����S�J�������E��Y����5�aV!�j��FbJm�M$�|.dڠ�������1����%�?��+;so=�d���K��r��*S�{5o�L��&*���(T�9�f<�{�c`�I�)�Qs��ؖ	z-4ߧC�)r���Ȉ ��XX�@6�7	�I��{�E`�O0=���;S���tT7���tqo�@��K���#�x�U�E�!4�>��C�b��g!
Ծ� 
�|_WQh�˄��'%<�j�V�UT��濣�n��{�#��ѲX=�s��� �ঐ
zb���|�ՅT�M�QV[���&�ji�2��ڮ?)�pdܪ�A��%����M���z1��t6�0�{'����զ�.
j
Af�_�.E��m_Q�e����䎱Ο���Md��j7�q�QM��x�g֞w�A�YOL��nU��� ��x��9+�:���IYI�=��ZN��WԢ
��9%����8�������� ���q
O�x

�(݁D)V]�������'����B����ɥF��/%%�
��k̃�W�/�>�˝t�q��3�o�Y��X�`�|�,H"�2�6}���Yn6�DjAh�0�>T�A.poy~Uv���ĚB�'�L�u�[D}�\Ir��j($�%d贛�U˫73m�/#[ƿ(Ů/V(2�������Q��_i���{�1� ����jT�����m�~�S4��2����u��s�X�*��#�)m�*�V��d�*�������Њ�'ʠ��M``��o��`�����U�v$v�n�Z����\�v��_=_!P 1�v�`֨���/���$�G��rH���U*�ׯ��g��|7�J�0�ݨb�(	�o~����v."�F@
<"�
ۢ�n*�ˑ�Q����%����s�u����V���U��'��M� ;�Q4M0Q@�a��P��!0נMħG���7���
`�	���4�\��w��s��
��L�ULu|<��B�"��GM�{���DA��w0Г��)��o�oZPco*��rJʗ�'�� ����w5[��;J�)VZ���$8�B��{2+���R`�+������g�	E�n�}�to+i���
7�8�B���
P�����v�LF+����P���R
�Ӱ�M��a�AA��A ��y��O(�WK[�X��*��)���L-
�����H��%i����
s���;��\��QWw��?Q�iλ/#zO�2&��N����3�m�R&�0H�p|w���j"���Gt4r�y�ný<�v��VnK����;�ۢ� `@��偘:�5Zq,Bᆘ*�U}�a�<dűHJ8�{׭�i��F;��B~��	�f냢�v���Vq�I��f�Y���
s�Z�Q�Z��n����� ��p�c����˿,i��,I����ՙ���K��j�Rř)-X�_u:V�	�5y9�G�F?�6����L>a���%cs�3C[�ƌT#K�π�h�ޢ��6.�Ap�m�L�c�A@0����煼Q��y��H��9�4��/��Z5&[ĩ���97�Ln�(
��^����͖�^�.Pj�9��r>�@8{��lz�g�*`~�n�݂��/��7_�pf�CZ�y\i{K���E�T��{C r!d �%%w���/��:�\�
5�st��QS���em`�n����}��	�\�ck��v�|�U���\dfMy��GeM��h����Ŭ��toh
��Y΋�dⰢz��sS4�Q4���LM�Ӭ�H�'���-_UQ��}t���׬�k������؄�9k6����c������\����d�e�������vn��8�}�f�q����)��/�'����
6�[ۇ� �E0�bw�'_��k��[�W���©;,�Ly8<����� �񅮗��&�K�jQ�,8�C��?ɦ茙#��m@�q�� �3�����N�  ;g��[S�YCR��#[�ՠ��Co���N�)��)-v ���Av�3!++K�����Pmd�ݡ��C�[A��,��eW�o��' ����ģ��^V��[�0�oVL�Z�B���P 䝹*�
����V����q���D2�Aޘ��غ��&�E��^��Loa>`a�,c(K�����<�cIa\�����E�=s�����v�QҌ����Ϊ\�A]��K�ߵ<w����iIm���Ί%V��/:J�Dk�f{���t����eco,�YS"������U��F�}:�.�B�B�ti�I�?+�仐��������U庠!d<� @D���>Pz8D����[Q��*�r��N7~�"-+�j?3A��A?0�z&��ќ/^BÔ����:�|2p�|�a�!��E� L��XE'��}�tC����Ή���:VLY���~�!���B ������+|�N� p�anӌA���D���꣘`n����_7e~n�����X&���b_�/��;�������VX<�ݏ�.K��2�)�1? �����F`%�W����C):G���B���]2{�J�%�d�������Kw�M��럾��S�N.��"?[�V�WK4?�0H��6�`���k�J��9��%�q��4$�
7���F{�2IO�@c��I����?�P���"�,�3�����bI�P��O�ܺE��J���ʲ�E�be��E���DHW�Y����C�A1����m4��*r(D�D2pF��i�8�Xp���	������Λ����A��
����S�
=�