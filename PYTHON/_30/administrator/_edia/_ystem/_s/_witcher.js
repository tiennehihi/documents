'use strict';

Object.defineProperty(exports, 'commentRegex', {
  get: function getCommentRegex () {
    // Groups: 1: media type, 2: MIME type, 3: charset, 4: encoding, 5: data.
    return /^\s*?\/[\/\*][@#]\s+?sourceMappingURL=data:(((?:application|text)\/json)(?:;charset=([^;,]+?)?)?)?(?:;(base64))?,(.*?)$/mg;
  }
});


Object.defineProperty(exports, 'mapFileCommentRegex', {
  get: function getMapFileCommentRegex () {
    // Matches sourceMappingURL in either // or /* comment styles.
    return /(?:\/\/[@#][ \t]+?sourceMappingURL=([^\s'"`]+?)[ \t]*?$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^*]+?)[ \t]*?(?:\*\/){1}[ \t]*?$)/mg;
  }
});

var decodeBase64;
if (typeof Buffer !== 'undefined') {
  if (typeof Buffer.from === 'function') {
    decodeBase64 = decodeBase64WithBufferFrom;
  } else {
    decodeBase64 = decodeBase64WithNewBuffer;
  }
} else {
  decodeBase64 = decodeBase64WithAtob;
}

function decodeBase64WithBufferFrom(base64) {
  return Buffer.from(base64, 'base64').toString();
}

function decodeBase64WithNewBuffer(base64) {
  if (typeof value === 'number') {
    throw new TypeError('The value to decode must not be of type number.');
  }
  return new Buffer(base64, 'base64').toString();
}

function decodeBase64WithAtob(base64) {
  return decodeURIComponent(escape(atob(base64)));
}

function stripComment(sm) {
  return sm.split(',').pop();
}

function readFromFileMap(sm, read) {
  var r = exports.mapFileCommentRegex.exec(sm);
  // for some odd reason //# .. captures in 1 and /* .. */ in 2
  var filename = r[1] || r[2];

  try {
    var sm = read(filename);
    if (sm != null && typeof sm.catch === 'function') {
      return sm.catch(throwError);
    } else {
      return sm;
    }
  } catch (e) {
    throwError(e);
  }

  function throwError(e) {
    throw new Error('An error occurred while trying to read the map file at ' + filename + '\n' + e.stack);
  }
}

function Converter (sm, opts) {
  opts = opts || {};

  if (opts.hasComment) {
    sm = stripComment(sm);
  }

  if (opts.encoding === 'base64') {
    sm = decodeBase64(sm);
  } else if (opts.encoding === 'uri') {
    sm = decodeURIComponent(sm);
  }

  if (opts.isJSON || opts.encoding) {
    sm = JSON.parse(sm);
  }

  this.sourcemap = sm;
}

Converter.prototype.toJSON = function (space) {
  return JSON.stringify(this.sourcemap, null, space);
};

if (typ