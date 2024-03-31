FFFF) {
      handle = 'u';
      length = 4;
    } else if (character <= 0xFFFFFFFF) {
      handle = 'U';
      length = 8;
    } else {
      throw new exception('code point within a string may not be greater than 0xFFFFFFFF');
    }

    return '\\' + handle + common.repeat('0', length - string.length) + string;
  }


  var QUOTING_TYPE_SINGLE = 1,
      QUOTING_TYPE_DOUBLE = 2;

  function State(options) {
    this.schema        = options['schema'] || _default;
    this.indent        = Math.max(1, (options['indent'] || 2));
    this.noArrayIndent = options['noArrayIndent'] || false;
    this.skipInvalid   = options['skipInvalid'] || false;
    this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
    this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
    this.sortKeys      = options['sortKeys'] || false;
    this.lineWidth     = options['lineWidth'] || 80;
    this.noRefs        = options['noRefs'] || false;
    this.noCompatMode  = options['noCompatMode'] || false;
    this.condenseFlow  = options['condenseFlow'] || false;
    this.quotingType   = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
    this.forceQuotes   = options['forceQuotes'] || false;
    this.replacer      = typeof options['replacer'] === 'function' ? options['replacer'] : null;

    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;

    this.tag = null;
    this.result = '';

    this.duplicates = [];
    this.usedDuplicates = null;
  }

  // Indents every line in a string. Empty lines (\n only) are not indented.
  function indentString(string, spaces) {
    var ind = common.repeat(' ', spaces),
        position = 0,
        next = -1,
        result = '',
        line,
        length = string.length;

    while (position < length) {
      next = string.indexOf('\n', position);
      if (next === -1) {
        line = string.slice(position);
        position = length;
      } else {
        line = string.slice(position, next + 1);
        position = next + 1;
      }

      if (line.length && line !== '\n') result += ind;

      result += line;
    }

    return result;
  }

  function generateNextLine(state, level) {
    return '\n' + common.repeat(' ', state.indent * level);
  