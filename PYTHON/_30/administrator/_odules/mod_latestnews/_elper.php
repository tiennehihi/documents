const minimatch = module.exports = (p, pattern, options = {}) => {
  assertValidPattern(pattern)

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  return new Minimatch(pattern, options).match(p)
}

module.exports = minimatch

const path = require('./lib/path.js')
minimatch.sep = path.sep

const GLOBSTAR = Symbol('globstar **')
minimatch.GLOBSTAR = GLOBSTAR
const expand = require('brace-expansion')

const plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
const qmark = '[^/]'

// * => any number of characters
const star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
const twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
const twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// "abc" -> { a:true, b:true, c:true }
const charSet = s => s.split('').reduce((set, c) => {
  set[c] = true
  return set
}, {})

// characters that need to be escaped in RegExp.
const reSpecials = charSet('().*{}+?[]^$\\!')

// characters that indicate we have to add the pattern start
const addPatternStartSet = charSet('[.(')

// normalizes slashes.
const slashSplit = /\/+/

minimatch.filter = (pattern, options = {}) =>
  (p, i, list) => minimatch(p, pattern, options)

const ext = (a, b = {}) => {
  const t = {}
  Object.keys(a).forEach(k => t[k] = a[k])
  Object.keys(b).forEach(k => t[k] = b[k])
  return t
}

minimatch.defaults = def => {
  if (!def || typeof def !== 'object' || !Object.keys(def).length) {
    return minimatch
  }

  const orig = minimatch

  const m = (p, pattern, options) => orig(p, pattern, ext(def, options))
  m.Minimatch = class Minimatch extends orig.Minimatch {
    constructor (pattern, options) {
      super(pattern, ext(def, options))
    }
  }
  m.Minimatch.defaults = options => orig.defaults(ext(def, options)).Minimatch
  m.filter = (pattern, options) => orig.filter(pattern, ext(def, options))
  m.defaults = options => orig.defaults(ext(def, options))
  m.makeRe = (pattern, options) => orig.makeRe(pattern, ext(def, options))
  m.braceExpand = (pattern, options) => orig.braceExpand(pattern, ext(def, options))
  m.match = (list, pattern, options) => orig.match(list, pattern, ext(def, options))

  return m
}





// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = (pattern, options) => braceExpand(pattern, options)

const braceExpand = (pattern, options = {}) => {
  assertValidPattern(pattern)

  // Thanks to Yeting Li <https://github.com/yetingli> for
  // improving this regexp to avoid a ReDOS vulnerability.
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

const MAX_PATTERN_LENGTH = 1024 * 64
const assertValidPattern = pattern => {
  if (typeof pattern !== 'string') {
    throw new TypeError('invalid pattern')
  }

  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError('pattern is too long')
  }
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so 