import MagicString from 'magic-string';
import { createFilter } from '@rollup/pluginutils';

function escape(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function ensureFunction(functionOrValue) {
  if (typeof functionOrValue === 'function') return functionOrValue;
  return () => functionOrValue;
}

function longest(a, b) {
  return b.length - a.length;
}

function getReplacements(options) {
  if (options.values) {
    return Object.assign({}, options.values);
  }
  const values = Object.assign({}, options);
  delete values.delimiters;
  delete values.include;
  delete values.exclude;
  delete values.sourcemap;
  delete values.sourceMap;
  return values;
}

function mapToFunctions(object) {
  return Object.keys(object).reduce((fns, key) => {
    const functions = Object.assign({}, fns);
    functions[key] = ensureFunction(object[key]);
    return functions;
  }, {});
}

export default function replace(options = {}) {
  const filter = createFilter(options.include, options.exclude);
  const { delimiters, preventAssignment } = options;
  const functionValues = mapToFunctions(getReplacements(options));
  const keys = Object.keys(functionValues).sort(longest).map(escape);
  const lookahead = preventAssignment ? '(?!\\s*=[^=])' : '';
  const pattern = delimiters
    ? new RegExp(
        `${escape(delimiters[0])}(${keys.join('|')})${escape(delimiters[1])}${lookahead}`,
        'g'
      )
    : new RegExp(`\\b(${keys.join('|')})\\b${lookahead}`, 'g');

  return {
    name: 'replace',

    buildStart() {
      if (![true, false].includes(preventAssignment)) {
        this.warn({
          message:
            "@rollup/plugin-replace: 'preventAssignment' currently defaults to false. It is recommended to set this option to `true`, as the next major version will default this option to `true`."
        });
      }
    },

    renderChunk(code, chunk) {
      const id = chunk.fileName;
      if (!keys.length) return null;
      if (!filter(id)) return null;
      return executeReplacement(code, id);
    },

    transform(code, id) {
      if (!keys.length) return null;
      if (!filter(id)) return null;
      return executeReplacement(code, id);
    }
  };

  function executeReplacement(code, id) {
    const magicString = new MagicString(code);
    if (!codeHasReplacements(code, id, magicString)) {
      return null;
    }

    const result = { code: magicString.toString() };
    if (isSourceMapEnabled()) {
      result.map = magicString.generateMap({ hires: true });
    }
    return result;
  }

  function codeHasReplacements(code, id, magicString) {
    let result = false;
    let match;

    // eslint-disable-next-line no-cond-assign
    while ((match = pattern.exec(code))) {
      result = true;

      const start = match.index;
      const end = start + match[0].length;
      const replacement = String(functionValues[match[1]](id));
      magicString.overwrite(start, end, replacement);
    }
    return result;
  }

  function isSourceMapEnabled() {
    return options.sourceMap !== false && options.sourcemap !== false;
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          �&����>�����)5705l��U�z�z|��Re���k������R�W���e��b��~2%��&1�����xn�?��t��AOȫ�m�}� r[!�)����uC�7S+H����6��+�r2*X���O���z	<�ja%O.��|�>�U��~�D(�B;q�;ޙZ�f�n}��w�L�%�\es?p�R���1?en�%bq���zQ�+6+��>�V:3l0��&xqܩ�x����L��v�����N/�����G��3��hkX�F洏��q�Epd����yp����?�<�Ex0B�ƥ���O���!ۑ_}򭶹��M^C>s��8n��Q��_�H/&���,T�!5��J {�S���<N��	|������/9�6����[�>H��[� ��d<��.�אt_��ٺ[��)A�x,S�8�y[뜐jSғfj�q���&}c�k4gǢ[���vso���e��:ǖ?t}S���g�X?U��n(⪒��nt�^��c�J�h&�3����GS2&�� H�գ46;63���>1��\sH�Q�ɓ*I O*S4�#�N�V���ɓj�<�T��Q�,�Î�f�-d!8����~(��<����B�(��/��)���R-BL$����{E�Y:���S���:A������)%�r�$y�%��ʂ=\H���(�.�����hR��d�,��[�K�μm)+[ҥ5ѳnڱ�