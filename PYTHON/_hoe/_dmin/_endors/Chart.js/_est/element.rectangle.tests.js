sition);

    if (ch === 0x5B/* [ */) {
      terminator = 0x5D;/* ] */
      isMapping = false;
      _result = [];
    } else if (ch === 0x7B/* { */) {
      terminator = 0x7D;/* } */
      isMapping = true;
      _result = {};
    } else {
      return false;
    }

    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }

    ch = state.input.charCodeAt(++state.position);

    while (ch !== 0) {
      skipSeparationSpace(state, true, nodeIndent);

      ch = state.input.charCodeAt(state.position);

      if (ch === terminator) {
        state.position++;
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = isMapping ? 'mapping' : 'sequence';
        state.result = _result;
        return true;
      } else if (!readNext) {
        throwError(state, 'missed comma between flow collection entries');
      } else if (ch === 0x2C/* , */) {
        // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
        throwError(state, "expected the node content, but found ','");
      }

      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;

      if (ch === 0x3F/* ? */) {
        following = state.input.charCodeAt(state.position + 1);

        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }

      _line = state.line; // Save the current line.
      _lineStart = state.lineStart;
      _pos = state.position;
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      keyTag = state.tag;
      keyNode = state.result;
      skipSeparationSpace(state, true, nodeIndent);

      ch = state.input.charCodeAt(state.position);

      if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }

      if (isMapping) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
      } else if (isPair) {
        _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
      } else {
        _result.push(keyNode);
      }

      skipSeparationSpace(state, true, nodeIndent);

      ch = state.input.charCodeAt(state.position);

      if (ch === 0x2C/* , */) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
        readNext = false;
      }
    }

    throwError(state, 'unexpected end of the stream within a flow collection');
  }

  function readBlockScalar(state, nodeIndent) {
    var captureStart,
        folding,
        chomping       = CHOMPING_CLIP,
        didReadContent = false,
        detectedIndent = false,
        textIndent     = nodeIndent,
        emptyLines     = 0,
        atMoreIndented = false,
        tmp,
        ch;

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x7C/* | */) {
      folding = false;
    } else if (ch === 0x3E/* > */) {
      folding = true;
    } else {
      return false;
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
      detectedIndent