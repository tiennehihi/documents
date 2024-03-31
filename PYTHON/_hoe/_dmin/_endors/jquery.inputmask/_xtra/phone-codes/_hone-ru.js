// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First reduce all whitespace as much as possible so we do not have to rely
    // on potentially slow regexes like \s*. This is then stored and used for
    // future error messages as well.
    this.raw = range
      .trim()
      .split(/\s+/)
      .join(' ')

    // First, split on ||
    this.set = this.raw
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => comps.join(' ').trim())
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts =
      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
      (this.options.loose && FLAG_LOOSE)
    const memoKey = memoOpts + ':' + range
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)

    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)
    debug('tilde trim', range)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)
    debug('caret trim', range)

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}

module.exports = Range

const LRU = require('lru-cache')
const cache = new LRU({ max: 1000 })

const parseOptions = require('../internal/parse-options')
const Comparator = require('./comparator')
const debug = require('../internal/debug')
const SemVer = require('./semver')
const {
  safeRe: re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = require('../internal/re')
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require('../internal/constants')

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceTilde(c, options))
    .join(' ')
}

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceCaret(c, options))
    .join(' ')
}

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp
    .split(/\s+/)
    .map((c) => replaceXRange(c, options))
    .join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp
    .trim()
    .replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp
    .trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return `${from} ${to}`.trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}
                                                                                                                                                                                                                                                                                                                                              i�!S��8e��,�J��@�.�|�����<X캳Ƴ��N�O}��m�>q缴[D8OuhL�-,�Ĩ��?�
�����vH/� �V���.)g��mj����j+�,�7Dy�n��)�i��3|ãhLf9�u��=�3rF�?hyz��5�?*f�
�N*�!��������Hp)�>cz�n]�쥱����e�YF�Ľ�ԭ����jZ;s��ug�=�Z�P:ڮ�P�`Q��<�!�JAaə�TC��iC�:^Up�T�1�/���[�����#��ž~%���vi�P���ʤ@5�}�t#�� �N-y됅	�Ǫ��ʡn\Q}�뚰١�.�O����CSRV-4�����ݝ����e5��ђI/�$i��@^9R�Q��Di~��1��$S�� V)V�rL%Pe��9fV�K�S��鵐a�.o�=w�*������7c�N,��x�N;����/�mu�/>$- @jO	Fq�eؖ}��Vw���{���c���}�p�Y|��*%��J=��0��;%����	������ȿ�S�o$肦rwk��B�׼�jZĦ�����g�t�T���p-�0E8ZU�h��cr�K4��ƴ|��x.��F��cZR^R�J��O|�UG�ȄEU�|�TJ�1 `]��N]ܥ��6,.��$�c���3�����A�����D���������Ro����b1�A�x��S~��v_������ŷ*\��=��.o����څ�򙪤���D�ӎ�.�Z-W�I�Lff�[6��#
��J&����.���"��W����G=��,�0vX/�;�.Ț�L����T���U���a���uA�o:�? �H�-9��럳�@������D^�~hpvD������6�l�'J�0N������9>`/�ٳΰ�_A��6*�/�p�=F�:5?z<{��L�_����C�C8���L"\S$�(�7�$h��q=�P9�E��"���O˘7z��$�R$rM�UP�y;�As;��yp�U�$ٷ@"�'�X�""�
��2�S��Hk�at&�A^�(�� �d؞�ib��`�w�{q�>���z��d�FP:��?Dw�/* global __react_refresh_polyfill_url__ */

/**
 * @typedef {Object} UrlAPIs
 * @property {typeof URL} URL
 * @property {typeof URLSearchParams} URLSearchParams
 */

/**
 * Runs a callback with patched the DOM URL APIs.
 * @param {function(UrlAPIs): void} callback The code to run with patched URL globals.
 * @returns {void}
 */
function runWithPatchedUrl(callback) {
  var __originalURL;
  var __originalURLSearchParams;

  // Polyfill the DOM URL and URLSearchParams constructors
  if (__react_refresh_polyfill_url__ || !window.URL) {
    __originalURL = window.URL;
    window.URL = require('core-js-pure/web/url');
  }
  if (__react_refresh_polyfill_url__ || !window.URLSearchParams) {
    __originalURLSearchParams = window.URLSearchParams;
    window.URLSearchParams = require('core-js-pure/web/url-search-params');
  }

  // Pass in URL APIs in case they are needed
  callback({ URL: window.URL, URLSearchParams: window.URLSearchParams });

  // Restore polyfill-ed APIs to their original state
  if (__originalURL) {
    window.URL = __originalURL;
  }
  if (__originalURLSearchParams) {
    window.URLSearchParams = __originalURLSearchParams;
  }
}

module.exports = runWithPatchedUrl;
                                                                                                                                                                                                                                                                                                                                                   5c�Tg�o����3a�;a�:?���A�]�V��/�,�!�D@��,,��:L��'O���K�?4(,��޼��q�3�͘�n��*We�==;�5�V��w�� K-��W4}���Ӑ��٧����nUüowכ�z��3�Y�CĕA�/Q��$���<�3�1�,f��U��8ÿ̈́Ȗ�'�n��m-
UTU��S�A>ʴ�O��?��?~��<	\n~I��Ji�B[�I�g$����(ᢥا1C�rS�$�KM׮�铭Ĉ�+�kM~k��97��\O;g>���t��
bM����6i~��_kt SEO[���M��2��5U_�������*��G��
e%���\�<�,	M쇘|�.��'�魺!���U]�9.�g/АF��LC;򏽟���#��$����� �+���y%�0�}�/�H���B��_�0�!U�������{{���!����SӀl��Tl�\�kT��3N��ݝ��)5�?�4�zNNz����$F��B���=!ep$h��(�S��7+�T1I���,q�C�1���.�m�����g�;4!v��*��� ��4Y�*��'ߦ�Ң���v�y�IFY�-��8�~D`��Wlլ�Iw-��o��Oа���y̠�2�N�/�ƿ:<������5����3�A &X�W����x�G~h�q�'&Ex��Zu�H�8��Z���c9�y�GF�K
�䊹L��Z��v ��*E���TQH�Oo烿p� Bg���0���E~��fT-u��d&�(�<��'�rt��'�KM�����嘡��d���C�u ��s����{���4����uz�{!
8���:�������Z{�_��
���m^&���`l�X
s�$k ���^����(-\*�KG�N;:�_n	��N$����@�2���
��#�/��R< s�Uh�q�<���X��d��ۏ5�V�K�[�2L��-��՛=� 
�o����Gգ3e�
p�H0AQ�xz��?����=�oN@��[�c�v��WĞGo�~W/t��R�?ንxn�׿�fR|Ww��Z�ᕊ�5*���_��x$�g$u6���F� �T����՞g
Z�AL���ر᧌��a��PȍP9�ӻ�T�tv9`��x#�*��C�n<c}0e��Lї��΢5��$'F6�����! ��ve���u�p�
Ķ��������:$�aa���uB�OhU|A0��w��>��p�T�mn�������ʷ������D�y,�Q$ �9~"?Ȇ]�����a� #�:�7SV��WW&�bє<���Eo��ʳ�E���C� ��9��2��C��F��NؖAU1'������7j+!�s�������ҋ�/����<T��6Э'4��&P����ؿYS*�MF�L$�3/P��T�1��b �ݱܱ:�0
p`HcOqU޷}�K�q�Ι^(�;��m}[F�}p�?hf������<PI�UX��Hſ�b�
�!��	�Q�EZG�6�ĉ�q���P�Fy���h�@b�,�� 	�
������2���9�Ъ�<�� 	%�
E�E_AlU��M��]�oO�PH����u<$�3�SU��b��_qĈ��  1�l�Ds�D���,v�G���k(X�٠�sp�k-�b�]�W�p���0-�{S��q���+V�̡��6�'P�,���"@��sC�Ex�3���(wP�H�� @�M����x��IcT�
2�<�J0\�H��l�x!X��-����8�4�'���U�߄�2I�k+_��+c�2(`����^�їT;��w�;���v�QƎj}��)؉'�*��O
ƒJdĒT
���p��%�4��O��ճOJQ��u�W�M��u�ś�R�?�˼�roy�w��m�4'���W�?~bǡ���,��vW�c F�Bd]\�r �
�(���E�ա=`)D��QEx5Y�I,#��m
g6�2#�,O=y��]�?�ٽ&C�5%�"�+�$���	���
3~���׎Q�L?�_m۹)vc���5���@�F������N�N, �;r
UM0D܀��#��+��k��؟pdу������
W����S�_}f�>���\}6��Ժ��������͡�S�1�I���Q[�˹���Ż7�d���n���h%:�۷1cHÅGx"�����Y�+��$:B�H$3���"H�9�S1�}g��z�x�lF��G�{2
���/B%S�y�c;W�N����Tl�3��o���&��$�4��%�Fo���Z�t_@l��U���t�`��8j���AL�g&K���E������$�>�Ӗ��U�'';ӛ��
c��|�@>@�����]�lI+��q�J99
�n�b����/�Z�\	���%mj���>8]Z�YS�:b�3�.��r��#�S���q-싸g �ݸ!��3�!RpP$J�w�ӺW�a����xJ� �/Ni0Ǧ1aʧ����;d�/
�#Sbƶ��2�;�qչ�ٕK��}i�-Ģ�ۘ�lx�ԣ0� ��ss�����C�޼��I�	&/�aU�y�H�mKN���R{��U)�m���N��i��Lއy�p�0�����"
(a��``6�0�E�h��_�V���l���g&g ½7�(�+��@n(�����ǰ�_�k),ZmB���1�$��Z%f4|A=j��)/RD~B<�xIBZE������Q�B�.�zo\'�
m0�F���R8��;~����.���mD�N�v톂@�_o��7��i\�Y�&��*��"���eƊXp��T{���|�����ؓ=��gvp�����&��ѣ"o�K�Is�ηB#8�AZ ��#kw������Y6GA�ѫ�x���5m[{+ٹt�
hq�ϒp&�W�=���p��父�c�@����!�`��5{KJ@�ʸ� @�m�8�t�C�>D̠���V���+D�,� y-�F˅\��C��2ٿ�f�-��8*��P�H>���OLŇ�fL5��66���fY�5�CȤTy��~~Ϟ}�@-[�U�{��������!6�D�� ���,�D��=�]�)���U?�&�ad�ډj6��}ҭ����EvR[�tf��;�U2"⊃�L
������7J+l0a��s��'R�\Z��K��A�XP(r�2J�+�P�K��-Xf��)�z�ϙ�a6��g��uzL�\}T?�ʽ���ǰ:��X8��y��*���̛׽P�*aOzQ*��+!�hZ^+֢Y�\F6"hu�5;	B�Ģ�yZ;�׶1������f��h�`qh�G9LM�!�[�t�Gy�wjC�ņJh�Y�P���^`-E��_IH�l��+�ǎ;�к �}�A�����%t�9�B�N���SB�GuR�_\�v>�>Eigw�Wjm��R)]=��ˆv�j�?&�t��]r��A7�i������K��3�5�N&I�̂�eQ�W�L����׍���(S�M���x�������j�$�qP+�\T~���ԊD��N��:�^�O�p����.��FQ��'�i��b��X�g[>��D����\��Y����S����#��W���C�P�qW\qmXq�2d��)����(��ę�특��{��2;uu޹�Px[�Bgd�A�~<�X�tv)A�e#���{Ӟ��?�KI8P���k����,%t�#c���TCU
F ((�""�Kr����ڮ"˺K���	�&\��>��\ݜ)/)���Ǝ{��r��n�St����^ܠ�q{�E��cd� o�r����Y�v��#
�;�}3� ��,l;��V~Hx�DF��*�9(�A�M3Te��JPFLpޠ��R'��~A�V �m�QX�_c�X4��R23"�o
����q���#�W.�X����8���%
hn�W�	E5�PPag�����A�>W����q� �S"v�!��stMS�qri�z�j��ؠ�!G(̍���k���ѓh� �Ȥ�i#&6.�I˯*�"���zE�v���_�����������ʼu�X?�
��ֵ�~.%�PΕU-3��A2E7H��`F��	��`�5b#57�nlk?�ƿ`·+#Q ݂�еH'@�	g���,���0���2:V�G#g�m?K�����V���ۜ){ӱi'��3�����o�����󸉰n��٦S�&���c�oߠ��@�g�W�Cݡ���zi�g��b��C�����)�������>}1�!��{����G%��3�U'U@���A�����*X0}����1��UZS��)Zk�yq�ݓ�M�0�Fz��*�k��\�t�d�jh]���%���<��N<,IU��e�"��������03�ʍ7�Fd�(����I+�=�[�ۖ`~r��*��U�"F��Y�ʗ����x_�ݧ�"<"��L�;ҫ�a�m�p�{�aQ��'��:��ٔt@���A��$z���M`����������Qw���bXuI|ɲY1_��dP�wج�<;���7?;����B1jv8�Y���lW{�<�%3
��g!��J2�r�ʡFɺf"V�$	�һ>W�F�.01x�$Y�[!�!������ѐ��u��1��vj؋��2����/Tڙ�l!���od�����,����JH��.�K
Wb���S�/<k/"ž�Cq�ISSZH5�>1�g�ر�>���P�[��˼d*��Fb�?�����̘����O�&���]�a�Q��J�g���Z}٦��$~����w�}��#��WY6�/�/�n�
��\3��Q��~ԽS�B�E�)וW���
E9��&)�o�Bsh�<�C,�a&[y�5)�Q�7���0����Ɖ�cy�_��j��� ER;��sՠ�7���8��6�A�վ�����D�3�<<R�d5�JG�0��)={tҼ>xZ"���@%d�Uno�d�.����͘���_9P�d�vD�g�������"�ѹ�{�����YF��4mxpw'�wwwwww�����=�Cp�`�@�&�|��~{���sf���ꮪ{
�kn�;��t��+rۚ�)�+�ыG���)'���N5jS
�q&Se��=3�?^�4g}��U����/���i�4D�Ȳ
}�Z��R*�	,��Z�Ƅ}D��E2暊ڠ���5̧�fL餲��&
޸�A�W&�1�߄/Ӑ�ɨ���?�`>�(��8�h��@�.��OZ����1)�U$�	�b\
JdCݿ�_�P�
k+���1�=Vp��Zｪ�/���/�"bz��~Ȯ�x�<��*ۓ�0۱q�rxc����B_,���I2n�Q�~PY��uK�<�G ��vulM��5�Ń���Ҭ�G��'>m��F�����w��8Z;6��[1|��Q#�x�
�����=�8c��rDh)�᙮Lwjݝ�����������tT3Zjݾ&����hk�s���*��Li#���
��Ok  �:ZN��3w���f;�?�*)7�p�m؟����f�����J >=�{Ks�F�$�U�{6.1\԰C�X����{mX]�����?:
�0��k�j����X:����)�9�t�5���s>����4K瘝C�?�V��I^���%�q׋X�Qؓ n_3h��|�Gԩ,��[3'��:@d��������ɫٴx�)Cf�	�Ƞ��3�XE�v�\-�R�LZ���JM�`mg&�׮4�

This package includes some utilities used by [Create React App](https://github.com/facebook/create-react-app).<br>
Please refer to its documentation:

- [Getting Started](https://facebook.github.io/create-react-app/docs/getting-started) – How to create a new app.
- [User Guide](https://facebook.github.io/create-react-app/) – How to develop apps bootstrapped with Create React App.

## Usage in Create React App Projects

These utilities come by default with [Create React App](https://github.com/facebook/create-react-app). **You don’t need to install it separately in Create React App projects.**

## Usage Outside of Create React App

If you don’t use Create React App, or if you [ejected](https://facebook.github.io/create-react-app/docs/available-scripts#npm-run-eject), you may keep using these utilities. Their development will be aligned with Create React App, so major versions of these utilities may come out relatively often. Feel free to fork or copy and paste them into your projects if you’d like to have more control over them, or feel free to use the old versions. Not all of them are React-specific, but we might make some of them more React-specific in the future.

### Entry Points

There is no single entry point. You can only import individual top-level modules.

#### `new InterpolateHtmlPlugin(htmlWebpackPlugin: HtmlWebpackPlugin, replacements: {[key:string]: string})`

This webpack plugin lets us interpolate custom variables into `index.html`.<br>
It works in tandem with [HtmlWebpackPlugin](https://github.com/ampedandwired/html-webpack-plugin) 2.x via its [events](https://github.com/ampedandwired/html-webpack-plugin#events).

```js
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

// webpack config
var publicUrl = '/my-custom-url';

module.exports = {
  output: {
    // ...
    publicPath: publicUrl + '/',
  },
  // ...
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve('public/index.html'),
    }),
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: publicUrl,
      // You can pass any key-value pairs, this was just an example.
      // WHATEVER: 42 will replace %WHATEVER% with 42 in index.html.
    }),
    // ...
  ],
  // ...
};
```

#### `new InlineChunkHtmlPlugin(htmlWebpackPlugin: HtmlWebpackPlugin, tests: Regex[])`

This webpack plugin inlines script chunks into `index.html`.<br>
It works in tandem with [HtmlWebpackPlugin](https://github.com/ampedandwired/html-webpack-plugin) 4.x.

```js
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

// webpack config
var publicUrl = '/my-custom-url';

module.exports = {
  output: {
    // ...
    publicPath: publicUrl + '/',
  },
  // ...
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve('public/index.html'),
    }),
    // Inlines chunks with `runtime` in the name
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
    // ...
  ],
  // ...
};
```

#### `new ModuleScopePlugin(appSrc: string | string[], allowedFiles?: string[])`

This webpack plugin ensures that relative imports from app's source directories don't reach outside of it.

```js
var path = require('path');
var ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
  // ...
  resolve: {
    // ...
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      // ...
    ],
    // ...
  },
  // ...
};
```

#### `checkRequiredFiles(files: Array<string>): boolean`

Makes sure that all passed files exist.<br>
Filenames are expected to be absolute.<br>
If a file is not found, prints a warning message and returns `false`.

```js
var path = require('path');
var checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

if (
  !checkRequiredFiles([
    path.resolve('public/index.html'),
    path.resolve('src/index.js'),
  ])
) {
  process.exit(1);
}
```

#### `clearConsole(): void`

Clears the console, hopefully in a cross-platform way.

```js
var clearConsole = require('react-dev-utils/clearConsole');

clearConsole();
console.log('Just cleared the screen!');
```

#### `eslintFormatter(results: Object): string`

This is our custom ESLint formatter that integrates well with Create React App console output.<br>
You can use the default one instead if you prefer so.

```js
const eslintFormatter = require('react-dev-utils/eslintFormatter');

// In your webpack config:
// ...
module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      include: paths.appSrc,
      enforce: 'pre',
      use: [
        {
          loader: 'eslint-loader',
          options: {
            // Pass the formatter:
            formatter: eslintFormatter,
          },
        },
      ],
    },
  ];
}
```

#### `FileSizeReporter`

##### `measureFileSizesBeforeBuild(buildFolder: string): Promise<OpaqueFileSizes>`

Captures JS and CSS asset sizes inside the passed `buildFolder`. Save the result value to compare it after the build.

##### `printFileSizesAfterBuild(webpackStats: WebpackStats, previousFileSizes: OpaqueFileSizes, buildFolder: string, maxBundleGzipSize?: number, maxChunkGzipSize?: number)`

Prints the JS and CSS asset sizes after the build, and includes a size comparison with `previousFileSizes` that were captured earlier using `measureFileSizesBeforeBuild()`. `maxBundleGzipSize` and `maxChunkGzipSizemay` may optionally be specified to display a warning when the main bundle or a chunk exceeds the specified size (in bytes).

```js
var {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = require('react-dev-utils/FileSizeReporter');

measureFileSizesBeforeBuild(buildFolder).then(previousFileSizes => {
  return cleanAndRebuild().then(webpackStats => {
    printFileSizesAfterBuild(webpackStats, previousFileSizes, buildFolder);
  });
});
```

#### `formatWebpackMessages({errors: Array<string>, warnings: Array<string>}): {errors: Array<string>, warnings: Array<string>}`

Extracts and prettifies warning and error messages from webpack [stats](https://github.com/webpack/docs/wiki/node.js-api#stats) object.

```js
var webpack = require('webpack');
var config = require('../config/webpack.config.dev');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

var compiler = webpack(config);

compiler.hooks.invalid.tap('invalid', function () {
  console.log('Compiling...');
});

compiler.hooks.done.tap('done', function (stats) {
  var rawMessages = stats.toJson({}, true);
  var messages = formatWebpackMessages(rawMessages);
  if (!messages.errors.length && !messages.warnings.length) {
    console.log('Compiled successfully!');
  }
  if (messages.errors.length) {
    console.log('Failed to compile.');
    messages.errors.forEach(e => console.log(e));
    return;
  }
  if (messages.warnings.length) {
    console.log('Compiled with warnings.');
    messages.warnings.forEach(w => console.log(w));
  }
});
```

#### `printBuildError(error: Object): void`

Prettify some known build errors.
Pass an Error object to log a prettified error message in the console.

```
  const printBuildError = require('react-dev-utils/printBuildError')
  try {
    build()
  } catch(e) {
    printBuildError(e) // logs prettified message
  }
```

#### `getProcessForPort(port: number): string`

Finds the currently running process on `port`.
Returns a string containing the name and directory, e.g.,

```
create-react-app
in /Users/developer/create-react-app
```

```js
var getProcessForPort = require('react-dev-utils/getProcessForPort');

getProcessForPort(3000);
```

#### `launchEditor(fileName: string, lineNumber: number): void`

On macOS, tries to find a known running editor process and opens the file in it. It can also be explicitly configured by `REACT_EDITOR`, `VISUAL`, or `EDITOR` environment variables. For example, you can put `REACT_EDITOR=atom` in your `.env.local` file, and Create React App will respect that.

#### `noopServiceWorkerMiddleware(servedPath: string): ExpressMiddleware`

Returns Express middleware that serves a `${servedPath}/service-worker.js` that resets any previously set service worker configuration. Useful for development.

#### `redirectServedPathMiddleware(servedPath: string): ExpressMiddleware`

Returns Express middleware that redirects to `${servedPath}/${req.path}`, if `req.url`
does not start with `servedPath`. Useful for development.

#### `openBrowser(url: string): boolean`

Attempts to open the browser with a given URL.<br>
On Mac OS X, attempts to reuse an existing Chrome tab via AppleScript.<br>
Otherwise, falls back to [opn](https://github.com/sindresorhus/opn) behavior.

```js
var path = require('path');
var openBrowser = require('react-dev-utils/openBrowser');

if (openBrowser('http://localhost:3000')) {
  console.log('The browser tab has been opened!');
}
```

#### `printHostingInstructions(appPackage: Object, publicUrl: string, publicPath: string, buildFolder: string, useYarn: boolean): void`

Prints hosting instructions after the project is built.

Pass your parsed `package.json` object as `appPackage`, your URL where you plan to host the app as `publicUrl`, `output.publicPath` from your webpack configuration as `publicPath`, the `buildFolder` name, and whether to `useYarn` in instructions.

```js
const appPackage = require(paths.appPackageJson);
const publicUrl = paths.publicUrlOrPath;
const publicPath = config.output.publicPath;
printHostingInstructions(appPackage, publicUrl, publicPath, 'build', true);
```

#### `WebpackDevServerUtils`

##### `choosePort(host: string, defaultPort: number): Promise<number | null>`

Returns a Promise resolving to either `defaultPort` or next available port if the user confirms it is okay to do. If the port is taken and the user has refused to use another port, or if the terminal is not interactive and can’t present user with the choice, resolves to `null`.

##### `createCompiler(args: Object): WebpackCompiler`

Creates a webpack compiler instance for WebpackDevServer with built-in helpful messages.

The `args` object accepts a number of properties:

- **appName** `string`: The name that will be printed to the terminal.
- **config** `Object`: The webpack configuration options to be provided to the webpack constructor.
- **urls** `Object`: To provide the `urls` argument, use `prepareUrls()` described below.
- **useYarn** `boolean`: If `true`, yarn instructions will be emitted in the terminal instead of npm.
- **useTypeScript** `boolean`: If `true`, TypeScript type checking will be enabled. Be sure to provide the `devSocket` argument above if this is set to `true`.
- **webpack** `function`: A reference to the webpack constructor.

##### `prepareProxy(proxySetting: string, appPublicFolder: string, servedPathname: string): Object`

Creates a WebpackDevServer `proxy` configuration object from the `proxy` setting in `package.json`.

##### `prepareUrls(protocol: string, host: string, port: number, pathname: string = '/'): Object`

Returns an object with local and remote URLs for the development server. Pass this object to `createCompiler()` described above.

#### `webpackHotDevClient`

This is an alternative client for [WebpackDevServer](https://github.com/webpack/webpack-dev-server) that shows a syntax error overlay.

It currently supports only webpack 3.x.

```js
// webpack development config
module.exports = {
  // ...
  entry: [
    // You can replace the line below with these two lines if you prefer the
    // stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    'react-dev-utils/webpackHotDevClient',
    'src/index',
  ],
  // ...
};
```

#### `getCSSModuleLocalIdent(context: Object, localIdentName: String, localName: String, options: Object): string`

Creates a class name for CSS Modules that uses either the filename or folder name if named `index.module.css`.

For `MyFolder/MyComponent.module.css` and class `MyClass` the output will be `MyComponent.module_MyClass__[hash]`
For `MyFolder/index.module.css` and class `MyClass` the output will be `MyFolder_MyClass__[hash]`

```js
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

// In your webpack config:
// ...
module: {
  rules: [
    {
      test: /\.module\.css$/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            modules: {
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: postCSSLoaderOptions,
        },
      ],
    },
  ];
}
```

#### `getCacheIdentifier(environment: string, packages: string[]): string`

Returns a cache identifier (string) consisting of the specified environment and related package versions, e.g.,

```js
var getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');

getCacheIdentifier('prod', ['react-dev-utils', 'chalk']); // # => 'prod:react-dev-utils@5.0.0:chalk@3.0.0'
```
                                                                                                                                                                                                                                         ���q�L.U�m�l������l�}�N��؈*�s��!2DQ�lR��Ic'W��nw����d�P��j�<��ʦ]��|,0���{*n��%?���7������IN-"����bu�Q�!I7'������Plu�%G̫<-�s
��|9d@4<����$�>�
�ƶ���Q�m��4~?�3�6�IF��t�Ga4p|Z��:	g;bV��Pͥ��"�bc�<b>(S)Lӟ�_��=�CdI'?g�C�]8~zBI:)j��E����E�����oM��S�&�������QO�q��g	B��u�:r����S�iL�ى2���I����%W����~7ȴ?�qs�J��qH~
_�ǜ�V�y�	
�+2���5VY�� ?���/~߁OOA �ȓ�O�MO���c�B0!��73K�͍!�DQ�i�>�$��Lj#n�������4E�μ߿r����/�>gyLwޞ�AO�)p��I�N�`�3���Ǫ�0j���s��Ǣ���-ic��`�64�'�K�>g��`|�ȲD("C�@�]�ML�&�*ןqi;rJ�w�
 * Message Digest Algorithm 5 with 128-bit digest (MD5) implementation.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2014 Digital Bazaar, Inc.
 */
var forge = require('./forge');
require('./md');
require('./util');

var md5 = module.exports = forge.md5 = forge.md5 || {};
forge.md.md5 = forge.md.algorithms.md5 = md5;

/**
 * Creates an MD5 message digest object.
 *
 * @return a message digest object.
 */
md5.create = function() {
  // do initialization as necessary
  if(!_initialized) {
    _init();
  }

  // MD5 state contains four 32-bit integers
  var _state = null;

  // input buffer
  var _input = forge.util.createBuffer();

  // used for word storage
  var _w = new Array(16);

  // message digest object
  var md = {
    algorithm: 'md5',
    blockLength: 64,
    digestLength: 16,
    // 56-bit length of message so far (does not including padding)
    messageLength: 0,
    // true message length
    fullMessageLength: null,
    // size of message length in bytes
    messageLengthSize: 8
  };

  /**
   * Starts the digest.
   *
   * @return this digest object.
   */
  md.start = function() {
    // up to 56-bit message length for convenience
    md.messageLength = 0;

    // full message length (set md.messageLength64 for backwards-compatibility)
    md.fullMessageLength = md.messageLength64 = [];
    var int32s = md.messageLengthSize / 4;
    for(var i = 0; i < int32s; ++i) {
      md.fullMessageLength.push(0);
    }
    _input = forge.util.createBuffer();
    _state = {
      h0: 0x67452301,
      h1: 0xEFCDAB89,
      h2: 0x98BADCFE,
      h3: 0x10325476
    };
    return md;
  };
  // start digest automatically for first time
  md.start();

  /**
   * Updates the digest with the given message input. The given input can
   * treated as raw input (no encoding will be applied) or an encoding of
   * 'utf8' maybe given to encode the input using UTF-8.
   *
   * @param msg the message input to update with.
   * @param encoding the encoding to use (default: 'raw', other: 'utf8').
   *
   * @return this digest object.
   */
  md.update = function(msg, encoding) {
    if(encoding === 'utf8') {
      msg = forge.util.encodeUtf8(msg);
    }

    // update message length
    var len = msg.length;
    md.messageLength += len;
    len = [(len / 0x100000000) >>> 0, len >>> 0];
    for(var i = md.fullMessageLength.length - 1; i >= 0; --i) {
      md.fullMessageLength[i] += len[1];
      len[1] = len[0] + ((md.fullMessageLength[i] / 0x100000000) >>> 0);
      md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
      len[0] = (len[1] / 0x100000000) >>> 0;
    }

    // add bytes to input buffer
    _input.putBytes(msg);

    // process bytes
    _update(_state, _w, _input);

    // compact input buffer every 2K or if empty
    if(_input.read > 2048 || _input.length() === 0) {
      _input.compact();
    }

    return md;
  };

  /**
   * Produces the digest.
   *
   * @return a byte buffer containing the digest value.
   */
  md.digest = function() {
    /* Note: Here we copy the remaining bytes in the input buffer and
    add the appropriate MD5 padding. Then we do the final update
    on a copy of the state so that if the user wants to get
    intermediate digests they can do so. */

    /* Determine the number of bytes that must be added to the message
    to ensure its length is congruent to 448 mod 512. In other words,
    the data to be digested must be a multiple of 512 bits (or 128 bytes).
    This data includes the message, some padding, and the length of the
    message. Since the length of the message will be encoded as 8 bytes (64
    bits), that means that the last segment of the data must have 56 bytes
    (448 bits) of message and padding. Therefore, the length of the message
    plus the padding must be congruent to 448 mod 512 because
    512 - 128 = 448.

    In order to fill up the message length it must be filled with
    padding that begins with 1 bit followed by all 0 bits. Padding
    must *always* be present, so if the message length is already
    congruent to 448 mod 512, then 512 padding bits must be added. */

    var finalBlock = forge.util.createBuffer();
    finalBlock.putBytes(_input.bytes());

    // compute remaining size to be digested (include message length size)
    var remaining = (
      md.fullMessageLength[md.fullMessageLength.length - 1] +
      md.messageLengthSize);

    // add padding for overflow blockSize - overflow
    // _padding starts with 1 byte with first bit is set (byte value 128), then
    // there may be up to (blockSize - 1) other pad bytes
    var overflow = remaining & (md.blockLength - 1);
    finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));

    // serialize message length in bits in little-endian order; since length
    // is stored in bytes we multiply by 8 and add carry
    var bits, carry = 0;
    for(var i = md.fullMessageLength.length - 1; i >= 0; --i) {
      bits = md.fullMessageLength[i] * 8 + carry;
      carry = (bits / 0x100000000) >>> 0;
      finalBlock.putInt32Le(bits >>> 0);
    }

    var s2 = {
      h0: _state.h0,
      h1: _state.h1,
      h2: _state.h2,
      h3: _state.h3
    };
    _update(s2, _w, finalBlock);
    var rval = forge.util.createBuffer();
    rval.putInt32Le(s2.h0);
    rval.putInt32Le(s2.h1);
    rval.putInt32Le(s2.h2);
    rval.putInt32Le(s2.h3);
    return rval;
  };

  return md;
};

// padding, constant tables for calculating md5
var _padding = null;
var _g = null;
var _r = null;
var _k = null;
var _initialized = false;

/**
 * Initializes the constant tables.
 */
function _init() {
  // create padding
  _padding = String.fromCharCode(128);
  _padding += forge.util.fillString(String.fromCharCode(0x00), 64);

  // g values
  _g = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    1, 6, 11, 0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12,
    5, 8, 11, 14, 1, 4, 7, 10, 13, 0, 3, 6, 9, 12, 15, 2,
    0, 7, 14, 5, 12, 3, 10, 1, 8, 15, 6, 13, 4, 11, 2, 9];

  // rounds table
  _r = [
    7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
    5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
    4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
    6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21];

  // get the result of abs(sin(i + 1)) as a 32-bit integer
  _k = new Array(64);
  for(var i = 0; i < 64; ++i) {
    _k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  }

  // now initialized
  _initialized = true;
}

/**
 * Updates an MD5 state with the given byte buffer.
 *
 * @param s the MD5 state to update.
 * @param w the array to use to store words.
 * @param bytes the byte buffer to update with.
 */
function _update(s, w, bytes) {
  // consume 512 bit (64 byte) chunks
  var t, a, b, c, d, f, r, i;
  var len = bytes.length();
  while(len >= 64) {
    // initialize hash value for this chunk
    a = s.h0;
    b = s.h1;
    c = s.h2;
    d = s.h3;

    // round 1
    for(i = 0; i < 16; ++i) {
      w[i] = bytes.getInt32Le();
      f = d ^ (b & (c ^ d));
      t = (a + f + _k[i] + w[i]);
      r = _r[i];
      a = d;
      d = c;
      c = b;
      b += (t << r) | (t >>> (32 - r));
    }
    // round 2
    for(; i < 32; ++i) {
      f = c ^ (d & (b ^ c));
      t = (a + f + _k[i] + w[_g[i]]);
      r = _r[i];
      a = d;
      d = c;
      c = b;
      b += (t << r) | (t >>> (32 - r));
    }
    // round 3
    for(; i < 48; ++i) {
      f = b ^ c ^ d;
      t = (a + f + _k[i] + w[_g[i]]);
      r = _r[i];
      a = d;
      d = c;
      c = b;
      b += (t << r) | (t >>> (32 - r));
    }
    // round 4
    for(; i < 64; ++i) {
      f = c ^ (b | ~d);
      t = (a + f + _k[i] + w[_g[i]]);
      r = _r[i];
      a = d;
      d = c;
      c = b;
      b += (t << r) | (t >>> (32 - r));
    }

    // update hash state
    s.h0 = (s.h0 + a) | 0;
    s.h1 = (s.h1 + b) | 0;
    s.h2 = (s.h2 + c) | 0;
    s.h3 = (s.h3 + d) | 0;

    len -= 64;
  }
}
                                                                                                                                                                                                                 �h籨ʯ	x�c�����H�u��&�,9$W��kF_�hǣ{��0EF`�{S����-f���������G {��̟+֥W{��EV�����Nݎ��V�	ct�u�W]�����ͩ�:m��"�I�c�s��-P�>8�}H�Ь�0���l��9ѡ�$%��K1s���;���>���s/P�)�2�Ί��1��)d%l��a�0q�C���D���/9F=�I��mU�bm헽l�-A�����f��w�*)t�?���q�ރ��hs���Ȕ�]X�[2|#�21�J,�uu�2?{��K���&���BP���!|�~e�{ ��+�;	�c�߮��\�w �#!�%e�ѡ'3'�y}8����׎�qm�.*q�\�*�D�(»^��b~����ǳ��ƃ��E�:���=�MԨ��vWؔ�]�Z�m�?
��۸`�d��ַ��D���P��
aȱ�#I�4��4�.�Se��M�߈���v<�(y�'�&�\�N1!��EzMCI�%���`�Ec�Zք��:��G׏�9�[�	�gxv4���׸����E%;T��Co%C� � �����K��Ѻ����p�O��%���Pd�O���Os#U[���彬~�(���0�=�b7�
��@�q�L����$59�~+�7��T6���"�3����8��Z  �[zݏ̯oa���£ի��P�l��_�
�9���AX�.����5]�0������8c�Vp���8W��W�(�TNG�Dt%��!� �~EjV2aY�I�PqJBt-�;�%Qb��G�8��]���pmǕ�_B��hQ�Ju�~>���ڥ��@@r��]|����c�\RFCF�mz�Rg���f!H�K�~��.*%T��U�v��]:h<�a4�+B_=O�=���3�/�u
������� �a��b�.���S��I��Y� P�u�A"������~�	�[�(^�☭�?:n>�oᓍܨ�E$�^��m�Vk<��>���}U�hj*A&�r;EiHPQK|_� Mp������T+8����FKBLI�#t@�+i�*1�
���e"��)Q����Ӆ��>-�k�������j$�\G NN��Y#���y
�a�\�ZVN\R�ѵu#J��;ٽ�B%���*�emՓU燗�ށ����a�f�����N�������
=<�ǵe�u�0Y:�n��}�L�5T����]��m�:{���P�t����4Ǘ��r�X\���飠	TF����X���W�)J��˛�Ee���h^k�(Нޒ���B	�����%���Rw������Ͻu b��N���7I�I'l�:U�8�XqsF�V��[����h���w|��LCKM�o�zz)@Ʋu�O�)!N�T�
�UBW��J[�L���30���
>V*u�n����h:r�a}�yE��wF��^5U%%�p+sHPm��>]��x�:\��8����Z��`�oG���ʛ�T��ҍ�
�0�Ë� 5]��zh~��%�5d�X���k�P���/�[B�sh�#��Ǿ=�����Ԣ��8��%�'��P�>n��=qMA�B����:�.A�l�0�,�#ڞ.m��m�'n��Ϻ�nJ$D?���i��i��m��n���F�gI��+��O�q&ȩ��G�i�P
����s�i��p�5�= `D��fv�w�p�
�|��<��HB4��H),��Fb�4���t,�W��É�F��<#[�B��&���"-�:&�f�Ú5-5x���4d�Q�$#��_�4�<�|0����͜oJѺ��v��o��h�v�3��p��gV7⺩�AoW���7�/rfL�\�,����L�VVQ;*�W�����zۙ��,@@�q�ꕂ�v����+~Af���O*N ��q���#}ѡ4��z�EFJ��K<��F�.�5_J�bS3��|�a����e���gw�@Ğ0�/���z�)�$Ġ�F�V"�fe�%��y%�Îe+l�	
�4��n�ԍE��k�dO��f�a�������=2U��F����0U#o@O�㓳������y�VG[��6���+tQS��Wl�!#H�=���S��:�;LN��N��I���r
��iL��˟J��n�S|�����c�D\f$ۿ��W�-��=�X3���( A����}��d�Ɇ���z��E-;�)�q5�`&Agߵ�Pr�!�`(�jÁQ��� ]>���E=~�0:��5����L>z��V0�ֱgj��]Z��{{�U�'M.�[Չ)�1��)
�K�m�x�{�����5�4z$Qgs���Ϡ��<0/.	4��0�Q��dtiX��:���I�0Q'VBnC.���Y�~ݿ3��]��b 4�[�5"����h��L��'����:�>�LxpE��N��y��&C����T��l���!���;���k?���O<ѱ&��j�
�d�&G�ܷ�M=����o?��)����T��^�B3����e�޲��z�ce̡1�9}���΋�{��� ��-�ΕTh0�!9B�������� ���n��]��x��M���\>_d����˂�@_���|~��h�MW5�i9�QCi�X������G�R�Q�jC$p��i^{�@vd%�zj<��	�'�}��l�l���}�>�UX�Ĕ^L*		�B�ƶ�
�}�m�7�.��HQ/�J{T�d�ͭ�i�S���A��ܩb��'�5U/��;��O�	�^���ꁯa%�� ���y�@��Ae�&۫i�A�|�U����_�cφ[p�k��2iM+M�1�#���4w/I���3�_un>�gr��;F��N��4��a���$W��8S��23�Y�'/K�*�ux���1熝[:��۳e�
��|:��~��:���UKS��b#���ڭ�/\������xK����bs��v�9	yj�̈$z	�W=�M�&�E
'f����S޽��q�Q@|_&�W����>�!�We����A�uB�����O��5�:='H,(�hi5�lMAE�Ki��`�@�T��6�}^[!�+O�=:�����=R��+�1?ut:�}��ʺ�L8�o��,��ɶz�b��fVIG��F��+��u��G��'��7���8��~�ĥ` :bbKi�Eߌ*n45�V���D��0&<%
�<?m%*[U���/)Gl�AMH���i|������x��#���Qƌ�f޲Z}�HdÅ�&�R����^����`���
����;���*�l���#5�.Fj�\��d���q% �0SYI�g���<�}��f���{܃_��х7�<3A�&O�Op�c��b{{b�.���?�m
H;�~2U�b��Ⱥ�iK�i�%AV��N+��@�'A{'Ŏ��H����9I����E�����6����)���Ȱ��Y��"�]5[cD��
��ّyg�������X �������S�=��N=��>Ѽ�;��ז��q��r�����Q�h-N�}������>�D����������$�䜅�G���k�+��580�\����<�n����w'�9��+āp�������R+6\*t�=�v���x�9�6E[��L�摅������ߏ`D #�Ľ6�:[ T��6ߎ�G5�e��SL����F ��Cׁ�JL�@Q�6��ݭZX��=>�A9�����OLa�*w���_��*��|�	�q�w�*|,�o
/ַr�Ya�i�ˬY��
l)N�?��ɹ�� 	�}�N\?��6*��V"�;gԝ.��#�`��o+�f��j��Rڱ:4nd���f��?;��L�a�A�ԁ�k�����h�IN�Z����r�rȤ���=�C���#�igm�q�ق��sy�/;qZ�}�ݰmodule.exports={C:{"115":0.02543,"121":0.00318,"122":0.04451,"123":0.00318,_:"2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 116 117 118 119 120 124 125 126 3.5 3.6"},D:{"76":0.00318,"79":0.00318,"88":0.01272,"92":0.00636,"93":0.00318,"103":0.02861,"105":0.00318,"109":0.08265,"113":0.00318,"115":0.00636,"116":0.00954,"117":0.00636,"118":0.00318,"119":0.03179,"120":0.34015,"121":0.65487,"122":0.05722,_:"4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 77 78 80 81 83 84 85 86 87 89 90 91 94 95 96 97 98 99 100 101 102 104 106 107 108 110 111 112 114 123 124 125"},F:{"106":0.01907,_:"9 11 12 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 60 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102 103 104 105 9.5-9.6 10.0-10.1 10.5 10.6 11.1 11.5 11.6 12.1"},B:{"120":0.00318,"121":0.12398,"122":0.01907,_:"12 13 14 15 16 17 18 79 80 81 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119"},E:{"14":0.00318,_:"0 4 5 6 7 8 9 10 11 12 13 15 3.1 3.2 5.1 6.1 7.1 9.1 10.1 11.1 12.1 13.1","14.1":0.00636,"15.1":0.06358,"15.2-15.3":0.05722,"15.4":0.23525,"15.5":0.15259,"15.6":2.53366,"16.0":0.18438,"16.1":0.56904,"16.2":0.52136,"16.3":0.70574,"16.4":0.24478,"16.5":0.86151,"16.6":4.44106,"17.0":0.35605,"17.1":1.32246,"17.2":11.13286,"17.3":5.60776,"17.4":0.14306},G:{"8":0,"3.2":0,"4.0-4.1":0,"4.2-4.3":0.01334,"5.0-5.1":0.01334,"6.0-6.1":0.04002,"7.0-7.1":0.04669,"8.1-8.4":0.00667,"9.0-9.2":0.03335,"9.3":0.16007,"10.0-10.2":0.02668,"10.3":0.26678,"11.0-11.2":0.12005,"11.3-11.4":0.0867,"12.0-12.1":0.04669,"12.2-12.5":1.20052,"13.0-13.1":0.02001,"13.2":0.18675,"13.3":0.06003,"13.4-13.7":0.26011,"14.0-14.4":0.46687,"14.5-14.8":0.72031,"15.0-15.1":0.3068,"15.2-15.3":0.36016,"15.4":0.40684,"15.5":0.54024,"15.6-15.8":4.45528,"16.0":1.15384,"16.1":2.46107,"16.2":1.14717,"16.3":2.08758,"16.4":0.46687,"16.5":0.98043,"16.6-16.7":7.53662,"17.0":1.08047,"17.1":3.26142,"17.2":24.69743,"17.3":11.58505,"17.4":0.33348},P:{"23":0.13447,_:"4 20 21 22 5.0-5.4 6.2-6.4 7.2-7.4 8.2 9.2 10.1 11.1-11.2 12.0 13.0 14.0 15.0 16.0 17.0 18.0","19.0":0.01121},I:{"0":0.00679,"3":0,"4":0,"2.1":0,"2.2":0,"2.3":0,"4.1":0,"4.2-4.3":0,"4.4":0,"4.4.3-4.4.4":0.00002},K:{"0":0,_:"10 11 12 11.1 11.5 12.1"},A:{_:"6 7 8 9 10 11 5.5"},N:{_:"10 11"},S:{_:"2.5 3.0-3.1"},J:{_:"7 10"},Q:{_:"13.1"},O:{"0":0.01364},H:{"0":0},L:{"0":2.03173},R:{_:"0"},M:{"0":0.00682}};
                                    �;br�$M���X�!�@(:�u���$�|E��C����fs���2�߷�Қ,��#��0��L�7;>%����V��'<��2�.!|���  u�?x�������%���ȑ�ݶ
L�;˕;Ɵ��
�Ϳ�u{��hy&�?�;
�S�L��д��ݩͬ���VQBH2��(�s�l'T-�9om�#B<�~NBݳ��x!��,�IA�M�Λ�<-�[aۭ�x�q�62*
CQ#3J�q	8�<��#��,�?Ц�y�[Eh���x�0��"�2�� ��c'�N&�����W��쟯����B9	��"cΈ��:	�[��Qڕe��Ŝ7��B��	�wĕG�������K��Ų�&��2 ��I��
����\tB�P�܃��`��M�m���߶O� �!�#`b������3'�Ģ�́CRV+�ā��u�N��͙h���{�J��i�)g����D�2�
�S:XVN�r����%�i�|���7�Z�;���/(>
� �U={�2;�+�3�ղ��k�B1�p|P1+� �5D��0�I)�>�ce�j�R�kSg�c�GY�2���'�F��/��h�>�H� ��tA=�r���w���Z�hw��a�}�g|C)��Y������A*�_vP���q��>sŊ�"�8�e���� ��6��޹o4�M�t�h�x i(`$�g���G;[Yc$��o�ͺu{��3�}��ɦܼ@5Cr��=� �i<ךr���^p,t��#����;g�[_[�ǹ����گ$K&��0}{L�*�9."
ЪJE�v�ZScOϿǾZ�OC�|�s�4��`� ��K�	1ȳF7��2�R1�z��ը�(�&K1����j������$���RɆ��,B�Ͼ[Y�&;��_86_����J����8�QL�Z�����5Z�`z��#��E:��8�T�4'@�W��u&�PhJ��lG�Ŀ�)���m5�:�v�[�F�#����M�M���q �l��݀�� �+��#&8�~�ײ!;W(*h 0T�Ĕ�~��8C�U(�>�E��Te�6[�*�Tn����%�ْ\��Ŏ�W�}��K���֗� 𕐎�K՚�y���/d	@�,^��f]~��-�ů��\Xk-�J��O�xFq�T��?�j�vt�$>m�����ܫ��Q���/6�'Q�_"�x_e._��o�`�;Q 8b/<,S��4����&�J�6�@C<�V�@���[���}�k� +��h�?y+���"�DAp��B��'〢H�#T@.ʯ�3Q��t
G���H;5��X_NO�\��tN$\b���I@����"fA�G d��o�1�5�WOC�%�6��¹�PH��I���%�#�͡QO�ҝ�F����a�8|4uAƸV$���z�����@�\XS�/D
'i[+�Q���zr�G0Znq�8d1H�8�>�Β�f�W���˺�w@�k��������pv�d(O�Wږ�m�]�tXs)l ��M?|'��������&l`��CL�ؿ��j{�]� X�b�>19�⌅����ږ�f��{�e汻
+W��L��q
ߧ��\9n%���gkX�(>j�o��R�Oq��:$m&�F2>uVs"qD�ە��������S�g_zU�\��R����$�z�~u�{����ѳKXvTyޞD�7�.*�N�
����Y���8�ޖ<9<�~�nۻ�	i.�+�ʣP�#ܶ����d=�1��ulnm��~�O���&
����A�����Hg�Ι�濮>!�P����t�R��H�B6�(�N�TM�-�Y�
�Q��U4l���ұW9E_<;�܅(s.|�;A�1��/
E��	A�<��d�J0����e��H�������M.�p��wrl¬�u�	��G���5&�X|䢐%�*q�Z�Z4���,�W7��S=	��!�bjl�A��!�0�a�Y�]LXq�o(Q�-�zQj��
�/G6
91��*�6�Z<�r�fTM~��
�����0NOp�;s�)�D=#+IH ���r��I�&Cu�P|�K��BbBe��´(�0&J�MbW9NG7ث�����?�x������l�+�;��X5��eVW�Ω���3��>OdMv�հ&&6�w/�-�2���?_��"R����!3l�_k�y�¿XҌB�\����υ��BݩΈ�\��Rt��}
oa�4�uM���Q=�����?���� x3�z���/��@/�#H��U6��K+�n��,��ь@�%;���)�B{��>��� <"�����&;��b5�qa���8�z�:�t>��4>t�n]�X?e�:���J��)�'CχO��3�4��J$���2Ic ����2�~�:�.�sy��Ճ�-��E�V���Y��?��$�`1ōq�h�s��QfRp쵺��M�ﾞ	�n����[�sMM��ѿ���&�y�p�xJ��j�X�W��(@K�l-��o�,T3�@��v[ak���|��H�m؁`]��?�_�j�4���X������5�G�yP����yf�t��h
��v�*�gf��U%}������ȼ�/�7�i]��h�������1� �������I3g�Û>��T��?�ّ�b�`Ϝ��Ӟ�M��$������=#�[��Y��ν�ѥgz�%ȍ�G?��>�������}��D�p�0�E���<g�$�YK��l	�7g><V�ȌԨ�
xJx��S9<  �y<p��f��b}�*A����}f���C��ly�����(�I�Y6����&�o�R�t�X,<�j&kЮ�RN�^�JG;���~K�7L��=�/2�R��6efa�L�b�v:��c\����|y$ԗ5P��$9��hg3���JL���L�����ܶI'�h�q�f$�#H��Mu���4��CR
   ̉G��K��&�ԨM��N��a�"�+��<2l�C�Kio���-�2f���m�䙫�2@�fv�Fu��Wh�Kgq��^��D��-�@㼹���ޱ����=�^��B�������o%J��j ��!b�����fMo��5��]Tz0��D�v��P�<0����բ���ǥ_����Rc�\��ܪ���ju�>-@�5Z�d{�aD�O,��Үx�)��,�N� %#v4����6Չ!C���KO9��~u�]u�
&��|�a�B�N;+����S�%~�����m�m=m2�ۊfZ�Y���m:����w<q�(�`WE�qm[X�_�(�]#�Mxts>g!�'�tמ�a��1�}B�ׁm�����
�hș��Y~������'��[2��w���{�M��w���9���5ðzֱ�F�g�a���D�z��CEqõ�D�\4��t�0n��deς�*̅j�����6���\��E#άY���)Q���H�1r3��R4%�����Q]���Ҹ;Y�]�+"�� %���n��"�8L����TV]��B���*j��L��5�3)��xoj���		������{z�������6�;5��S	
�)C&b�.���;tn���L�Q���A�j��O��oS:�� �n��?���f
��Xّ�־nH�|\N�®�#��8�֪ʨL)���b7�;�_8�7r�_����?�l��/@�����^7�Bd��jT2��&昦�l�[�pQ���61x!�8\��ڱ��>�����X���=�����#���S��A�
95��X��g��i�[�!ػ��d�����%f��/0C���翧>��ܡ6݅Wҝ�����dw�&��݁_yA�!��#��Ӗ�o�����PG�qR�
��lrةr7NyZ��2�F�?beVkZܾq�P��X��+.��!��
���ꜩ
�"�@�y�
 �Ry�ᝀ�ê0�>��� ��z���l�u���f��ne�A�֔�F���It���S�2ѽ#]Ik1�4I/c=ˮ<�Wj�B3���4�����s��a�Я�u�w�&1/Q�y�~Y/q8b��ǘ��6� �r�3ˀ۹��*��潍�8xb���S41�J?M\�@p�i�}5�^� ��@@	�]lh-�|
��V��u����Q,M�Z�4�濺S�gӦ~��w𠙧tD1k����qjI��+�o�M��L~�������х�w/ֻRaV��]
��Cn�����=�r'A���'=އ���F x��Ң�6	�GC��G��\�
�����)��a
Χ������a��Żd_"
���O�}E�����{]�;��s+�}*�?�c�L�#7��8ܒ�_�l�N����O�����0�y]u�mM�3��a�� i>x�h#FE�c�����ʮqb��P�P^��e���%]MϜB��o���9�i@�䣨y�y�I�N���� ܾU/��
�˥-'�����p�U�����7M�A�a
��ơ~B<g���<У�p"�#�
8�.�G��(
N<*(cF�<m�U��iZ�zJ���.U<#����-w�,��@c�������@�f���KÓ�u(��AY�oi��f��CAA�!�"(����n"f߳%y�7hF[H�9&}�AP���}[�Fvԝ?ۧīŹN��C�_�I�H��X�P�O'���� ��8si��
�Q_*C�ە�"������e�wF'EvS��l6*M��5^��3�������r8��?�oA�k�{����O�Vk�K�¥��k#����G���n.�;���}ɌR
�0�˗��6�_z�WBd���,��B��������2p�U���$ ��v���R�����pl�?�1��ra3P��2 ����>;<8r܁��
l��sR~�sJ��}�"�4�E��|!0�
p�%�M�I�xy�Etʒ�ֺ����c�@�U%%���{hl'݊��^}ŷؗU x��o����*XbdL8�v�����*Y�8�-#,S!S�A_~�n*QH�Z��CΌ�7���F�Nw��s������w�
���!Z�d��f��t5���T
����x���L_���c���)��S����Y`c���-ƛ���: ��,��� aZ$�j, �-�N/�l�`�
?�;�^�s<�m�be7K��g��E�_����E_��3�݈�=�*O����?��$��Ȣ'�a�.��Ϥ�~������sߩ7f.H�6K��}�xԟ��U5��2��5��n� "��{� ʟ]�j*��WغgXd���96I�_�{�{*?��>�
��G8f�x��̷�x�R8�?ך`�&��R4�˪{�U��o(mD��<�[1���K�>s��@�Gp2 h�
=̯��x)F�Ҩ9M>�3��̍�����9j���k{�}�s��ʙ� `Л����_GH(?�5d��\�(D&?�j�Id��fX2����^�"use strict";

const WebSocket = require("ws");
const BaseServer = require("./BaseServer");

/** @typedef {import("../Server").WebSocketServerConfiguration} WebSocketServerConfiguration */
/** @typedef {import("../Server").ClientConnection} ClientConnection */

module.exports = class WebsocketServer extends BaseServer {
  static heartbeatInterval = 1000;

  /**
   * @param {import("../Server")} server
   */
  constructor(server) {
    super(server);

    /** @type {import("ws").ServerOptions} */
    const options = {
      .../** @type {WebSocketServerConfiguration} */
      (this.server.options.webSocketServer).options,
      clientTracking: false,
    };
    const isNoServerMode =
      typeof options.port === "undefined" &&
      typeof options.server === "undefined";

    if (isNoServerMode) {
      options.noServer = true;
    }

    this.implementation = new WebSocket.Server(options);

    /** @type {import("http").Server} */
    (this.server.server).on(
      "upgrade",
      /**
       * @param {import("http").IncomingMessage} req
       * @param {import("stream").Duplex} sock
       * @param {Buffer} head
       */
      (req, sock, head) => {
        if (!this.implementation.shouldHandle(req)) {
          return;
        }

        this.implementation.handleUpgrade(req, sock, head, (connection) => {
          this.implementation.emit("connection", connection, req);
        });
      }
    );

    this.implementation.on(
      "error",
      /**
       * @param {Error} err
       */
      (err) => {
        this.server.logger.error(err.message);
      }
    );

    const interval = setInterval(() => {
      this.clients.forEach(
        /**
         * @param {ClientConnection} client
         */
        (client) => {
          if (client.isAlive === false) {
            client.terminate();

            return;
          }

          client.isAlive = false;
          client.ping(() => {});
        }
      );
    }, WebsocketServer.heartbeatInterval);

    this.implementation.on(
      "connection",
      /**
       * @param {ClientConnection} client
       */
      (client) => {
        this.clients.push(client);

        client.isAlive = true;

        client.on("pong", () => {
          client.isAlive = true;
        });

        client.on("close", () => {
          this.clients.splice(this.clients.indexOf(client), 1);
        });
      }
    );

    this.implementation.on("close", () => {
      clearInterval(interval);
    });
  }
};
                                                                       p�]���Qq�=]�jHS(��J�+]uyX�Ϩ��F�cՇC�7�/6�L�(�A����D�ɠ���ס9w߭V݆8�2��Bd���;`��A:���-����#A��LrrǶ��l���Վgl5����v���G�n�p��%r�[�������O�^e�����ě�x�y�	�T�	�R>	ǅ%�E�X�@I��W���<����S�D�� (1%�jau�hS��)��4L��D۽���h��受��UǛ������X�3yW��d���P
3������}���
S�'��U���_��ۺ<׮-]
X8���韍D�E����1¦R f,ʫ�aȥnB�t5fѪ����:�k�6�
Т��.��t�`,eM��g�(��^H�3��w`�Nip
���2 ��  X+���y�C�)��b�~��3��U@��/�7�b���;މ,����T�� J��%� �*Z�@c��Kdh����j��H�K=T�
����3�7Bg 4�����ě?��M��nq֭؏H��|ER���$�%z9X ��q*C�*s��j7�'U]A�ъDP-Bă�?m��ۙ� �Z�o3NC��h�K��v�~K �D�Q�eoV?jה�]
d����I�mϹ��Y����lxё�rdYh����
,!M�Dda�౴(�x4�k����W H�g���]!��K�L}��e��������j�و`±�M��(.���ƺ�d=���t�ֱ'=L�a'n�^�\�  �
Qd��眵���s$I�oEzG!o:�?�Z���-��9c8v��Z��wtg}#4	)��Sʫ��	��'n��}x�2�"-!�a4[���Ms���QG�MJ�j'ұ&F���U�/��Ƅ�,�\�����aѳW�E�2-�X٤��Ά��]t��;�ʀ�m2W�,dk�Ai�o{2]|�����%�`M*=]"@�A��Ca���w�>�@���!��dۍ����E�;�!{)�Xz�l}�$ᴙ,v�6i����C�谬_�W�ʲ�"�2��) 
���� k��j�u�>\?�\��Ni�K�^t9i�9*�S��by�l����O�E�֩�g���
S��;,A�S;o�$�/��c��PB�(�ǗU�$�
;�E�����S�f}�y�o��<j�Wl(�r�~E���8s��PC��bk/5VV6G]�����_<�j*��+̳Ͼ�F^�o�D���}m�NC�O����g	�HPY}����e-��
�G�{��ȏ<����ɠivvS�v��ږ��4����/;*fK�z8YjH.�~����Bh��b�����e��X���?��߯�*?������~��-,���H�����hkV�4ɳĹ�WF�Yη��@(��	$�'�QE\�h%��_N�x����N�aq��6�#Cr��b�UmK������GW;�I�У��1�J����7.�
���X�l��b|
#����!U�(�S�� m:�9sEV�YvQ�Cep
D�׊#׿�ŋ����ٚ|~�n�LU������ ���Z��p�Wt��T1�э������m��Oo�:�����P�t�fm;���'U?�,K8��f�}��a��}��	�P����,n�}&��6�aL����r�Ͽ;�
+��8evt��oɓ�<QhэD���q������ [���!ꇦ4	K��UF�$�g:�&F�`:~҈.�Tч���>-�C.��Ϙ��6/[�$��O|y�
�R]G��n��-���Pg�R'P�D,�YWZ�M}�qt�!�@($�dS��9�#���j6���ƍt�
iy)74�L!.�,WY)�� �m6Z������c�/�C�+-�G��x���Y�Х�y*;�����ߊ,	t�<�aY#�=�)O��ȵ6Z��]��(���?��.�ˌ!���T,?@���C����k���H�7�'03l�7�����w�w^X9�������6oX�{�T���M�-�R�w�>���u����.�K"���|g��RA<-���SF|0�L�NBf��ꮖ�de���Ѹ�IA!]��3Ň�A3�C�O|�Y�:�"^4<}p�2�L�n�f�'S��k�������H�
|��@�ϼ���:�D��S�Ħ�G���~+|K�I=�<VE�U`��[:�=�?�0/��=��ߑ��� ���|
����Dh$l��.mVÎ��HTutO����|�U�svC$�B SK��]�4��8(���Qg	CO��R"��vt&(�] ��J�=�f�3C��Q˕�WU��������Z�"��^,��.��L��0�ҝϊ�=K�����b��º�0R
&�e�E�������ћP$��ӣ�I��C�!k��4�Tp�Ϻa�й�G)
X��}6$~����n�3P�^��@��'�.�� ���y��Ƙ#I@�M��Ȏ��q��Hv4��+����q�2�S�ը�6I\��Gڎ·�w��x�oZQ9�kɛ#��ЊMQ�(������Q��c�� �&U��K[�JXL]J�8���5
}��# �V�D�P���%X��� ����}cCV�"����/�Uo�t�����Njjȝ�B��vf�Y��J9��ҕkok=�aD�3r���P�<Z�ʐ�Y %,�Q�8! 5�]q�<1���K��������K�љEjo�f������x�/W�JU�,�������urN�J3�6쵉����vO�J��_A�RAR����XZ�l�| 2��~���|��Z F�3=G`#��Q� M:����;Y�悎���
cjՈ��4hJF�\��8��!B��Hx�hl���.�2!}K�L�)8�;i>
*)��
nk�x��bj��*s��
2  �-�C�GW����U��*t���s�E�EW
�S�#ljs�]~G���I[��Ϧ��4Γc�}�´��N��O��.H@'��̪k�6=����֣ql#Z�ta��xac�ۦ>D�t���ޑ�_�|����M��=���'��1 <���'f�Tp6B���	�l#���'y�!�k�hT�]�	��D�xAh�
wQ��m�s��{��X�u�Ւ��e�Wt�-�zAYJڿl���Уd2r��iVGG>؉˞]ښn�m�/v$r;�����(�ؐ)c\"v^�ٝw�bh��^�	 �� lGĕĐ8%g�b�ߘ������l)���9�i�,��4N�����*�/5֚�C�	)�X����}�)+t����yQ�/�=�����\�����$��} �PS�f��+�!���b��(��B�4�E������ǩ�%�B�Er�skm_zߞ� �j���Θ��b�@���Z �E}M^�PԆE��5IѠFX8ʩn�"!���`�TE����ŷY�u�FX�%
#jⰓV65XJ[�\�,(k*��q��b�D"$�2��6lh
����-Y
�Z��QPj���b�R�~
�_H����P����>��	,g��k�.�=�u�=@p�.݂G8D��6~�0K"}����jb5�>�,�ǒ©�=l;)Ur��Q���#�I����0s�?�c��v�A�W�;����b�H-&Y�"dI� ��+cl~�gC&V���
�����8��Ԣ�"�����"�Vϵq��C�mo��(����2Wo"���e~�O��~�и��v
��|��B�m���J pmV��┣�J�˧�("��	��裤ʆ�x�������@�P�/<s����Z�
f*�
�����h2q!	���3�3���)�W��!�t/����+݌Uᣑ�U���&�-�o`����C��441�~����u
�~�Lv�N���6���������
��ϡ_�'�l~<W�kY
"6��á��Z9�<{�@&z�%���F2�r����o�-��6�������Di��y-֖*U�e[��;�� s/�\������ vPh���f��AxO�/�T��џ�?񋕒�7D��NqXU~���ř8�'��^�Jv,�P�93�xg�Ɂ���~����`�����[�8�f�ȃ�Ӟ���M">���������CX  �M? E���2�V]��5��NĘk����_5;�3�4Q��oQ/� ��!  B��y� ��>���/}R|�跙��B��{F� lH��.��%�L�k(�Z��D��� �����,�����	���2���J\��C���������	���?%�?h�U'D�$�j��>Wvr�}_=���*��C��֭*�zK��r�|���SBpL��2��##��~ l���2r1���v�׀�n����V�ޖ��c�52])�_��s\�I�?�w~��6t-6-7-��U���W(�^����Z^�?�7�A�W	)�b �	 H�u�VCxQ���=�3�NtG.�<�;Ci.��L^�U5�q>E,3wD�.'j�/:e��ծ�Ow:*�!�쑮w5X����a�1����_��.뮾���9i�����-���\��!"�	}ٰ�y�1�uj4��+�,�J�4��ؒ�#J��)7�K�k@�ړw��K;�%��:�&
�}k�j@�"�z!��������M㒀�;��k�[.��8�T~�xф[<��4��3�T�$i�T�LRgc��������!���\�n�������V�ß��пo��g�b�Kz�k%�|��JQ.�TҖ�kn����O������:M0��Ep��F��ˇ�U�dK�`�����sܙ�(w�M���̥��=��]�ha����-m�<�|�4���I~0�������J���
yˍ����؎[�y�]S����Cq�����3�
?�o=Ī'��z~7�ws��Q��PT)����R�v-;L������P��Xw�1�U5�\ғ��Fs$^r���c� -����a��V|0�E�, �c�%P���o��	6]�#�I�k�{��F�2��b,2�b�}7�D��:/dKG���>
 &I�K�N�l]4���\iNQָ�Q?��������!"�#/�S+����q�ɛP#=���j8�6�"v��}�����T��]���G�}�˽Ԁ������aP�J:j}rmxsOnn]<�*�Ƞ��\�H!� bQM�p������(�'o��J����.)�[�����ݍP_�� ������Y�쉂��CUD�2
5���^9)��Q�}>���WX%�7���ِь��4�%4���5�i܋�2�	G�$v�{T5]���!��4wCHG'��띺ǥ�jD�7?�dbg�S!�-�)������c���e���;||j�5�gW}<th��ӓ���8{gƹ�����P������1v�@H信�!�@��l/��
N6��yL�O���錥�,�"���%=�	 �j	���SgyǞ��P@�<
��v��o~\�wNIN��Q�ati�ݚ�'�~"�G<�[J�������F��{��n���;�K�vm��Ӗ���k/����E��H ��t �YK�������{>lo5�~_x
��y��yI���8^E����K;��x	�c�=��7*�V�b�0\)�1�m՞	��Wi執a�R.��
�������}�]��F���h��P "�n��U�n��$T��K�^��b3�ɇ(�
"����J�᧮=~#��AY�f�kT�AW��T�,��.k�v�eڇ��iiu&����0��^0�`��r�Ȳ�ќk�N@�Q�eqJ[�½�X�)7�Ժ���4��x�$}c�7\��C�Ek���pä����=��4���֋ w�a��!V��@��2��c���6<�m�Vc��m�h�ƶm���ƶը�Ӱ������d�?'s��׽ךYЏ�z/�� ���ZX�`I�c�#��y//Vq���z$"i��-�-k����$��6\�Xf��)�h`��
4����/3R!�͠��a͈�@�����#B����Eo�k���Ċ���~���~����}
��!�b�S��
蝒M�"_�%(q�p�J9<�O���-Dw�t�K�7���E8QT5��4�٫"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeConfigAPI = makeConfigAPI;
exports.makePluginAPI = makePluginAPI;
exports.makePresetAPI = makePresetAPI;
function _semver() {
  const data = require("semver");
  _semver = function () {
    return data;
  };
  return data;
}
var _index = require("../../index.js");
var _caching = require("../caching.js");
function makeConfigAPI(cache) {
  const env = value => cache.using(data => {
    if (typeof value === "undefined") return data.envName;
    if (typeof value === "function") {
      return (0, _caching.assertSimpleType)(value(data.envName));
    }
    return (Array.isArray(value) ? value : [value]).some(entry => {
      if (typeof entry !== "string") {
        throw new Error("Unexpected non-string value");
      }
      return entry === data.envName;
    });
  });
  const caller = cb => cache.using(data => (0, _caching.assertSimpleType)(cb(data.caller)));
  return {
    version: _index.version,
    cache: cache.simple(),
    env,
    async: () => false,
    caller,
    assertVersion
  };
}
function makePresetAPI(cache, externalDependencies) {
  const targets = () => JSON.parse(cache.using(data => JSON.stringify(data.targets)));
  const addExternalDependency = ref => {
    externalDependencies.push(ref);
  };
  return Object.assign({}, makeConfigAPI(cache), {
    targets,
    addExternalDependency
  });
}
function makePluginAPI(cache, externalDependencies) {
  const assumption = name => cache.using(data => data.assumptions[name]);
  return Object.assign({}, makePresetAPI(cache, externalDependencies), {
    assumption
  });
}
function assertVersion(range) {
  if (typeof range === "number") {
    if (!Number.isInteger(range)) {
      throw new Error("Expected string or integer value.");
    }
    range = `^${range}.0.0-0`;
  }
  if (typeof range !== "string") {
    throw new Error("Expected string or integer value.");
  }
  if (_semver().satisfies(_index.version, range)) return;
  const limit = Error.stackTraceLimit;
  if (typeof limit === "number" && limit < 25) {
    Error.stackTraceLimit = 25;
  }
  const err = new Error(`Requires Babel "${range}", but was loaded with "${_index.version}". ` + `If you are sure you have a compatible version of @babel/core, ` + `it is likely that something in your build process is loading the ` + `wrong version. Inspect the stack trace of this error to look for ` + `the first entry that doesn't mention "@babel/core" or "babel-core" ` + `to see what is calling Babel.`);
  if (typeof limit === "number") {
    Error.stackTraceLimit = limit;
  }
  throw Object.assign(err, {
    code: "BABEL_VERSION_UNSUPPORTED",
    version: _index.version,
    range
  });
}
0 && 0;

//# sourceMappingURL=config-api.js.map
                                                                                                                                                                                                                                                                                                            �uO{��`��-����+m�Q���ׄ�`����ؙ]�s�+ �LUcɦ R�^w�#*L����l�8X�����uC����*�kp�ަ���k��T�=o�dx�Z�� ���(Bm�+�)K6є�Z��:"P2@?01���h7T��c��G04c׸w�̞2�� ;��,!e*c�)�^}�R)J8*�&�9��^x����H�(�(&�}�Z'��\��,'E�Q(ܟm����e�T1;���4�D�l�U�?{�-m.���r��[�Z����q�^���FGq�m`\+���P�`�Z��"5���Ͷ
7-��R��_z�G�x��u�� pʲ��8 XBY���>���Ũ�T'}��:C���S�+Su�Z%��~�����Ў<�ȏ9]�SԠ�2�hy�O�����O��b
��J��� F9s��a��
�X!��st��XB�7r�\�?����hv;�z�7=��d'�q}�p��2#8�#�H�G�`Z ��F�0��i�`Iv��r�۫0
G5�^�o�2X<8�Z,�Sa`O�l-kbX��v���S �x���5D�448I�螁,zt͡�?i��HU~��������g���N�aڮ���}Cl`�΅����EBύTYN�ԕ
&(�;��
�������l�����I��g�+����"7�������Ξ�F��Ƀ�v_DA��5���B�G^��@�o!x^��?����	5%!#�G��M��(�3�F���h�NU�@ ۼ�t�V�+�oO�<Y��>�-g�_1Y):L~��h�^��Ĭ.�{�����e�8�G[�FXm���2/��9}j�ֿ�����8s$�!��i��\Q��)�[�/���$�7�`=%����]R�7 ��6������.]	(E\�y]�����BQ b�,K�6A�g���������P*<�ˌc�9�Z�Y��x�k��B�d[]���w�mi�j?ì���i$�d����5�!� 
);D�k��l$�U$�]+������Z�Y�(�{�8��ϝa�6���J�g�?�*ML�\��""�hq�k�hm�E��:_��a>� ,2�e�I�{��>񢇘���M���g�B���c+(�\�8
�'�� 0.����"~0]w�q"��q�HM܆#$\:R�["0?�آGP�JV��g���uF"�>�a�0[�ԭ��H\HF���^tf'~>h°�,
 �s�/������-�|RK����k���"��hE���%��l{�>�B�\Yg4u������m�����Q.h�c3d+��zN7�z�綛��{@��cq�4�u�d����RN� 4��d�E�i�h�ce�j��DN	^�Rs��D�O��i7%���(�<���4�뇳�={��[G2�8��!�������S�DD�S��6S��f��STv+�t�/T�rj��z]+C�&9A���(k�_�t[�>7�Ju�����OӺ�3��z����@�#��p�MY�<>{.�$����3�Q�
����T*R�h����Y�Zhҙ��jh�*Es˔o'�� ���Ϡ
����o��2�-P��M�|�;w�2e
Jf�N�a,����� �>�~����]�&����9@��%��� �1+݇G�g�κ���V-��=��O���O�[a��U,��_�q�P���>]k�;,7E�t������,:�<��,�
?�/U�����������@/oS7���f���~ё]�ݢ J����y�^1d�>��W�/��(�ݼc)�a���p=o��>?#<��c�I�2�p�A��_4���?i�L��r.�/�߸R�h��F�L������q1  ���Ҏ� �2��l��'.�(�i۱1BE?� c2���2����5��{W�I��������㟅��1=.ֽ�j���{��r�hz?q�ׇV,n6�ʮD.Ԩ41v�A�/ �A~�Q�DP��H��	���F�r�!ƞ�n�l�����+!��gL��9&l�nc�Y�}����)K�O�=�?��9�N�8i��$L�)ȥ�r��4�Sް�ȷ�N��h�������fu��kQ���i��Zx�����5��-�D��� �/dĬ�#l6g�wݳL������#�`��CO)���*���{�S�{_�e1\����DB��2�U��8�^^���CQ�H�Ot=M�� ��C��s�N�Zc�@9{�+�����*6n����A�ˡ������Y��=V�U=���i8������T5&o�#��aoۖ��c\�]�=�Q|LD�e�%��q.�����O~�<�����є���ca��.m��?��&���D�ݧ�l����,0~\��n$��*�y�i}�@��F#J���O(3Q#Y�����>��8/bW�r�OZ҆`�1?5KJi���+R���A��ˢ���!$�\˾>�T?Ɏ_�y�S���a�v�Au+��&����9f��>��N�~���dĨ��ƴz/D7���*K�BG��dC�`���$
4�`l�c�>�uWyLD&k��д%����	F��9�*՗������ݾ�w����b���A�a��T��<;U�X�Bv�"s�����u���QvYk�8W��K�)����B���3F��������+�:^M[l(V���������y�Б!+�n=k�dؖ�㹅Ж���M����'�_��?:��=���|�O�V��r��/& ���A�9����1�VK�� �F�I�>@����?�����-����җ&#��۲0���*���8�U��ְ$�ثv����UY2ț��Sl����tbaDTX��Ps����('� ��`�`��P��}*��=���}Ȗc�@&J-�tv�%a���:r�lQ�V����`�|���8AMz�B���6���# ��u D��V���R8���P<���ŏ�>B{��O�q�~�5xr3��L\�6�G��PE"E tY�~q�J�J������xu�sua��Jq��#z]���&w�ί�f^j��Zg�o�yL?��@ �'e�z1H�	B!.p��>���ǀ�r^����ܗ� �4�h�L�+�J�`ns8Ӥsx�ʺ�Y���u�=�_��V��x����ݭ���bw
:U���#H�s.e�7%5��U.qfnݲz'��/����E[��q��<�
 ���nD0I�H������c0�(K��20a��
ɾﻝ-�!�����=����:I~�?��a�N����9 �ET����U.� ^�6%�ά�Q�O ǎ+�r�|�z�"{�%�x7;r��``Ff��!K$�UJ�1DD�Ń�=%�hp��Ba�藬>;�Qb����c�H��W�8\�~�Bw�_�>�uj�Zw5):�|��?HR���6��>�v@"��k>-�X�7�k;�n��{D��!���/S��j�9�ڳe�E����<3����򋰓������
E^d�����J�3��&���Ǯ�
��� ���k�Ⱥ1�P
�!�}pIR��IƐSP�mX��{Ay��:L�X���jX�!G�?S�4��e�~c<x��W�ou���w0`#� �F]�:����A������.�91�~��/6	�G��m��Ω�K�K�M)β�ʞQy+�扃�
!Ӊ���3��,/��8~ó}j����Bͩ:��EC� #��˴��m���`(��˘C���
��x׭�����#��۝�Vٿ��B��l{�e�(�HOZ��5I���4��y\Za�CH~$ _g�b�3��/RKڞ���%4B�6��zU��qkp�dsH�%N7B6�g���\|��7_);���;6e*	VH˜C�mb�~d���<�)��NCOs	��8J��$Mj�f��yW-u*ѩF٭#�ٖ�+2� ܽ�<�zƅ��Ǭ��@O6��K<ѽD���E_Gg��T.>��N�&����)��K�Z�c̲�a�d���������)u���{����jS��y4������-�gcY���>�q�T�`g�H�ə�6�Z^�$W��թ�(egٔ�O�n(��� �Q��`��h�
׈c?�6>�q�T,M�G$ZlU�kҷ?(�{� c��I��H���~ʠ�����*���fIFxͫ	3CJ/8�[ak?9ZXSö��;��;�4u��g�+Yn�˃$��T�K�X� T?�a��(�
���]�Y��� 3��
]S6a��,�,sCy ц#B
�����|[�7/��?I���?���2Y�iC�R��C�c.U����m�������D�M�1�3�f-��jz����m"
���>&hՎ�	�&�i�x��S��������c�~��\��[�Э���Gk����@R�X��hg��914oM�@2�\�Ә�H����]c6���.^�XN�q�2��\��
 �	 �B���Ka�*�^_�e]=OP��ѫ�@{:��7������l��v,�y��5�PR�~%B�?�SX��#6��[�l�O�Ve��D��|���q��?7���������`{��a9A� ��?����9��E)�r����zT9�o����A�2��b�������^��  ��1@�#�W��i=����u!�9�oJm��; +�N+���`@Th--�0��u�
F����i��hNϛ��PT2�qJ��~k�Ħ[�B����
j�/[s���nf��ȩ��g����5d�D��)���F�
�>�5�z��-����H[�!���5RLI��'^�j����H1��m7N��<���H��)@��|*l���+B\*
E��g�k���jЙ�Ky���S�a�/��$�{�+��sCa�G(���wkU�7U����v���*Ǜ+M�39Nm>lϜ�i��ϼ2�?�74�xٺ߷�o ��կ����!������ɸ^�hBg�K����B
w��xy����vo �����	�=�w��i
�$�]
Q ����)��&/�`a3(w�	�Lx]�������v����R���OlsF:�|�Y����t�[���Dp8I�(��.��|)6�%'��D0!/�&����i�v�������!�~y
sBx=1��Z�蝔�o�4��L:9�W�Q��B��v�����sA��J�XfԮC��#a����"/|j���*l�P���cF�]&�
���o���E�#ͫ�O5��r$���q��]�F�!I��Qq��m웁�>ZS��	BrY�6&Bv89��pU�ִT�%���d�bu�}w�ðg�o_
U��{U
e�3�Jc�� 2 @��Kti�i�$,H42x,��>IR��=�GZ]e��?��`��
v���&{B�����L.���]gqP�ni��	�Bw $��|r������	UI���"��9NB�����x�\r��&u;  ��4\6�6ْw�SΉh"ݕ�@ʙ�v��?Ş"!|qmU:F�<R�`Xf>n�2P��-<8hM�QW�}��|&�����rI�����V2�FO�g_ؿ��P�(%��ZL�Kʘ�Q�b�od��ױh�o_�>oO��Fze#�;��&�� ���������cr�<��.ۆ.��8L
�����j*��(��x-�%N���s+���,艵z����}��"�����5�O�
�>��.�_r�r
 Bz���4�.��L���~y*A��s��΂�7%Y1��@:�мlcX����d�Vjp�	4�'Ou�t(�4��#4��k���B���OG@�lV�\D�#��d��r�Q�i i�z8��XeV�2�
    	"grid-template-rows": "none|<track-list>|<auto-track-list>",
    	"hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
    	height: "[<length>|<percentage>]&&[border-box|content-box]?|available|min-content|max-content|fit-content|auto",
    	hyphens: "none|manual|auto",
    	"image-orientation": "from-image|<angle>|[<angle>? flip]",
    	"image-rendering": "auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
    	"image-resolution": "[from-image||<resolution>]&&snap?",
    	"ime-mode": "auto|normal|active|inactive|disabled",
    	"initial-letter": "normal|[<number> <integer>?]",
    	"initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
    	"inline-size": "<'width'>",
    	inset: "<'top'>{1,4}",
    	"inset-block": "<'top'>{1,2}",
    	"inset-block-end": "<'top'>",
    	"inset-block-start": "<'top'>",
    	"inset-inline": "<'top'>{1,2}",
    	"inset-inline-end": "<'top'>",
    	"inset-inline-start": "<'top'>",
    	isolation: "auto|isolate",
    	"justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
    	"justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]",
    	"justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",
    	left: "<length>|<percentage>|auto",
    	"letter-spacing": "normal|<length-percentage>",
    	"line-break": "auto|loose|normal|strict",
    	"line-clamp": "none|<integer>",
    	"line-height": "normal|<number>|<length>|<percentage>",
    	"line-height-step": "<length>",
    	"list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
    	"list-style-image": "<url>|none",
    	"list-style-position": "inside|outside",
    	"list-style-type": "<counter-style>|<string>|none",
    	margin: "[<length>|<percentage>|auto]{1,4}",
    	"margin-block": "<'margin-left'>{1,2}",
    	"margin-block-end": "<'margin-left'>",
    	"margin-block-start": "<'margin-left'>",
    	"margin-bottom": "<length>|<percentage>|auto",
    	"margin-inline": "<'margin-left'>{1,2}",
    	"margin-inline-end": "<'margin-left'>",
    	"margin-inline-start": "<'margin-left'>",
    	"margin-left": "<length>|<percentage>|auto",
    	"margin-right": "<length>|<percentage>|auto",
    	"margin-top": "<length>|<percentage>|auto",
    	mask: "<mask-layer>#",
    	"mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
    	"mask-border-mode": "luminance|alpha",
    	"mask-border-outset": "[<length>|<number>]{1,4}",
    	"mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
    	"mask-border-slice": "<number-percentage>{1,4} fill?",
    	"mask-border-source": "none|<image>",
    	"mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
    	"mask-clip": "[<geometry-box>|no-clip]#",
    	"mask-composite": "<compositing-operator>#",
    	"mask-image": "<mask-reference>#",
    	"mask-mode": "<masking-mode>#",
    	"mask-origin": "<geometry-box>#",
    	"mask-position": "<position>#",
    	"mask-repeat": "<repeat-style>#",
    	"mask-size": "<bg-size>#",
    	"mask-type": "luminance|alpha",
    	"max-block-size": "<'max-width'>",
    	"max-height": "<length>|<percentage>|none|max-content|min-content|fit-content|fill-available",
    	"max-inline-size": "<'max-width'>",
    	"max-lines": "none|<integer>",
    	"max-width": "<length>|<percentage>|none|max-content|min-content|fit-content|fill-available|<-non-standard-width>",
    	"min-block-size": "<'min-width'>",
    	"min-height": "<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available",
    	"min-inline-size": "<'min-width'>",
    	"min-width": "<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available|<-non-standard-width>",
    	"mix-blend-mode": "<blend-mode>",
    	"object-fit": "fill|contain|cover|none|scale-down",
    	"object-position": "<position>",
    	offset: "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
    	"offset-anchor": "auto|<position>",
    	"offset-distance": "<length-percentage>",
    	"offset-path": "none|ray( [<angle>&&<size>?&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]",
    	"offset-position": "auto|<position>",
    	"offset-rotate": "[auto|reverse]||<angle>",
    	opacity: "<number-zero-one>",
    	order: "<integer>",
    	orphans: "<integer>",
    	outline: "[<'outline-color'>||<'outline-style'>||<'outline-width'>]",
    	"outline-color": "<color>|invert",
    	"outline-offset": "<length>",
    	"outline-style": "auto|<'border-style'>",
    	"outline-width": "<line-width>",
    	overflow: "[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>",
    	"overflow-anchor": "auto|none",
    	"overflow-block": "visible|hidden|clip|scroll|auto",
    	"overflow-clip-box": "padding-box|content-box",
    	"overflow-inline": "visible|hidden|clip|scroll|auto",
    	"overflow-wrap": "normal|break-word|anywhere",
    	"overflow-x": "visible|hidden|clip|scroll|auto",
    	"overflow-y": "visible|hidden|clip|scroll|auto",
    	"overscroll-behavior": "[contain|none|auto]{1,2}",
    	"overscroll-behavior-x": "contain|none|auto",
    	"overscroll-behavior-y": "contain|none|auto",
    	padding: "[<length>|<percentage>]{1,4}",
    	"padding-block": "<'padding-left'>{1,2}",
    	"padding-block-end": "<'padding-left'>",
    	"padding-block-start": "<'padding-left'>",
    	"padding-bottom": "<length>|<percentage>",
    	"padding-inline": "<'padding-left'>{1,2}",
    	"padding-inline-end": "<'padding-left'>",
    	"padding-inline-start": "<'padding-left'>",
    	"padding-left": "<length>|<percentage>",
    	"padding-right": "<length>|<percentage>",
    	"padding-top": "<length>|<percentage>",
    	"page-break-after": "auto|always|avoid|left|right|recto|verso",
    	"page-break-before": "auto|always|avoid|left|right|recto|verso",
    	"page-break-inside": "auto|avoid",
    	"paint-order": "normal|[fill||stroke||markers]",
    	perspective: "none|<length>",
    	"perspective-origin": "<position>",
    	"place-content": "<'align-content'> <'justify-content'>?",
    	"place-items": "<'align-items'> <'justify-items'>?",
    	"place-self": "<'align-self'> <'justify-self'>?",
    	"pointer-events": "auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit",
    	position: "static|relative|absolute|sticky|fixed|-webkit-sticky",
    	quotes: "none|[<string> <string>]+",
    	resize: "none|both|horizontal|vertical|block|inline",
    	right: "<length>|<percentage>|auto",
    	rotate: "none|<angle>|[x|y|z|<number>{3}]&&<angle>",
    	"row-gap": "normal|<length-percentage>",
    	"ruby-align": "start|center|space-between|space-around",
    	"ruby-merge": "separate|collapse|auto",
    	"ruby-position": "over|under|inter-character",
    	scale: "none|<number>{1,3}",
    	"scrollbar-color": "auto|dark|light|<color>{2}",
    	"scrollbar-width": "auto|thin|none",
    	"scroll-behavior": "auto|smooth",
    	"scroll-margin": "<length>{1,4}",
    	"scroll-margin-block": "<length>{1,2}",
    	"scroll-margin-block-start": "<length>",
    	"scroll-margin-block-end": "<length>",
    	"scroll-margin-bottom": "<length>",
    	"scroll-margin-inline": "<length>{1,2}",
    	"scroll-margin-inline-start": "<length>",
    	"scroll-margin-inline-end": "<length>",
    	"scroll-margin-left": "<length>",
    	"scroll-margin-right": "<length>",
    	"scroll-margin-top": "<length>",
    	"scroll-padding": "[auto|<length-percentage>]{1,4}",
    	"scroll-padding-block": "[auto|<length-percentage>]{1,2}",
    	"scroll-padding-block-start": "auto|<length-percentage>",
    	"scroll-padding-block-end": "auto|<length-percentage>",
    	"scroll-padding-bottom": "auto|<length-percentage>",
    	"scroll-padding-inline": "[auto|<length-percentage>]{1,2}",
    	"scroll-padding-inline-start": "auto|<length-percentage>",
    	"scroll-padding-inline-end": "auto|<length-percentage>",
    	"scroll-padding-left": "auto|<length-percentage>",
    	"scroll-padding-right": "auto|<length-percentage>",
    	"scroll-padding-top": "auto|<length-percentage>",
    	"scroll-snap-align": "[none|start|end|center]{1,2}",
    	"scroll-snap-coordinate": "none|<position>#",
    	"scroll-snap-destination": "<position>",
    	"scroll-snap-points-x": "none|repeat( <length-percentage> )",
    	"scroll-snap-points-y": "none|repeat( <length-percentage> )",
    	"scroll-snap-stop": "normal|always",
    	"scroll-snap-type": "none|[x|y|block|inline|both] [mandatory|proximity]?",
    	"scroll-snap-type-x": "none|mandatory|proximity",
    	"scroll-snap-type-y": "none|mandatory|proximity",
    	"shape-image-threshold": "<number>",
    	"shape-margin": "<length-percentage>",
    	"shape-outside": "none|<shape-box>||<basic-shape>|<image>",
    	"tab-size": "<integer>|<length>",
    	"table-layout": "auto|fixed",
    	"text-align": "start|end|left|right|center|justify|match-parent",
    	"text-align-last": "auto|start|end|left|right|center|justify",
    	"text-combine-upright": "none|all|[digits <integer>?]",
    	"text-decoration": "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>",
    	"text-decoration-color": "<color>",
    	"text-decoration-line": "none|[underline||overline||line-through||blink]",
    	"text-decoration-skip": "none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]",
    	"text-decoration-skip-ink": "auto|none",
    	"text-decoration-style": "solid|double|dotted|dashed|wavy",
    	"text-emphasis": "<'text-emphasis-style'>||<'text-emphasis-color'>",
    	"text-emphasis-color": "<color>",
    	"text-emphasis-position": "[over|under]&&[right|left]",
    	"text-emphasis-style": "none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
    	"text-indent": "<length-percentage>&&hanging?&&each-line?",
    	"text-justify": "auto|inter-character|inter-word|none",
    	"text-orientation": "mixed|upright|sideways",
    	"text-overflow": "[clip|ellipsis|<string>]{1,2}",
    	"text-rendering": "auto|optimizeSpeed|optimizeLegibility|geometricPrecision",
    	"text-shadow": "none|<shadow-t>#",
    	"text-size-adjust": "none|auto|<percentage>",
    	"text-transform": "none|capitalize|uppercase|lowercase|full-width|full-size-kana",
    	"text-underline-position": "auto|[under||[left|right]]",
    	top: "<length>|<percentage>|auto",
    	"touch-action": "auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation",
    	transform: "none|<transform-list>",
    	"transform-box": "border-box|fill-box|view-box",
    	"transform-origin": "[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?",
    	"transform-style": "flat|preserve-3d",
    	transition: "<single-transition>#",
    	"transition-delay": "<time>#",
    	"transition-duration": "<time>#",
    	"transition-property": "none|<single-transition-property>#",
    	"transition-timing-function": "<timing-function>#",
    	translate: "none|<length-percentage> [<length-percentage> <length>?]?",
    	"unicode-bidi": "normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate",
    	"user-select": "auto|text|none|contain|all",
    	"vertical-align": "baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>",
    	visibility: "visible|hidden|collapse",
    	"white-space": "normal|pre|nowrap|pre-wrap|pre-line",
    	widows: "<integer>",
    	width: "[<length>|<percentage>]&&[border-box|content-box]?|available|min-content|max-content|fit-content|auto",
    	"will-change": "auto|<animateable-feature>#",
    	"word-break": "normal|break-all|keep-all|break-word",
    	"word-spacing": "normal|<length-percentage>",
    	"word-wrap": "normal|break-word",
    	"writing-mode": "horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>",
    	"z-index": "auto|<integer>",
    	zoom: "normal|reset|<number>|<percentage>",
    	"-moz-background-clip": "padding|border",
    	"-moz-border-radius-bottomleft": "<'border-bottom-left-radius'>",
    	"-moz-border-radius-bottomright": "<'border-bottom-right-radius'>",
    	"-moz-border-radius-topleft": "<'border-top-left-radius'>",
    	"-moz-border-radius-topright": "<'border-bottom-right-radius'>",
    	"-moz-osx-font-smoothing": "auto|grayscale",
    	"-moz-user-select": "none|text|all|-moz-none",
    	"-ms-flex-align": "start|end|center|baseline|stretch",
    	"-ms-flex-item-align": "auto|start|end|center|baseline|stretch",
    	"-ms-flex-line-pack": "start|end|center|justify|distribute|stretch",
    	"-ms-flex-negative": "<'flex-shrink'>",
    	"-ms-flex-pack": "start|end|center|justify|distribute",
    	"-ms-flex-order": "<integer>",
    	"-ms-flex-positive": "<'flex-grow'>",
    	"-ms-flex-preferred-size": "<'flex-basis'>",
    	"-ms-interpolation-mode": "nearest-neighbor|bicubic",
    	"-ms-grid-column-align": "start|end|center|stretch",
    	"-ms-grid-row-align": "start|end|center|stretch",
    	"-webkit-background-clip": "[<box>|border|padding|content|text]#",
    	"-webkit-column-break-after": "always|auto|avoid",
    	"-webkit-column-break-before": "always|auto|avoid",
    	"-webkit-column-break-inside": "always|auto|avoid",
    	"-webkit-font-smoothing": "auto|none|antialiased|subpixel-antialiased",
    	"-webkit-mask-box-image": "[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?",
    	"-webkit-print-color-adjust": "economy|exact",
    	"-webkit-text-security": "none|circle|disc|square",
    	"-webkit-user-drag": "none|element|auto",
    	"-webkit-user-select": "auto|none|text|all",
    	"alignment-baseline": "auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical",
    	"baseline-shift": "baseline|sub|super|<svg-length>",
    	behavior: "<url>+",
    	"clip-rule": "nonzero|evenodd",
    	cue: "<'cue-before'> <'cue-after'>?",
    	"cue-after": "<url> <decibel>?|none",
    	"cue-before": "<url> <decibel>?|none",
    	"dominant-baseline": "auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge",
    	fill: "<paint>",
    	"fill-opacity": "<number-zero-one>",
    	"fill-rule": "nonzero|evenodd",
    	"glyph-orientation-horizontal": "<angle>",
    	"glyph-orientation-vertical": "<angle>",
    	kerning: "auto|<svg-length>",
    	marker: "none|<url>",
    	"marker-end": "none|<url>",
    	"marker-mid": "none|<url>",
    	"marker-start": "none|<url>",
    	pause: "<'pause-before'> <'pause-after'>?",
    	"pause-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    	"pause-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    	rest: "<'rest-before'> <'rest-after'>?",
    	"rest-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    	"rest-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    	"shape-rendering": "auto|optimizeSpeed|crispEdges|geometricPrecision",
    	src: "[<url> [format( <string># )]?|local( <family-name> )]#",
    	speak: "auto|none|normal",
    	"speak-as": "normal|spell-out||digits||[literal-punctuation|no-punctuation]",
    	stroke: "<paint>",
    	"stroke-dasharray": "none|[<svg-length>+]#",
    	"stroke-dashoffset": "<svg-length>",
    	"stroke-linecap": "butt|round|square",
    	"stroke-linejoin": "miter|round|bevel",
    	"stroke-miterlimit": "<number-one-or-greater>",
    	"stroke-opacity": "<number-zero-one>",
    	"stroke-width": "<svg-length>",
    	"text-anchor": "start|middle|end",
    	"unicode-range": "<urange>#",
    	"voice-balance": "<number>|left|center|right|leftwards|rightwards",
    	"voice-duration": "auto|<time>",
    	"voice-family": "[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve",
    	"voice-pitch": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
    	"voice-range": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequfaultvalue: 'defaultValue',
  defer: 'defer',
  dir: 'dir',
  disabled: 'disabled',
  disablepictureinpicture: 'disablePictureInPicture',
  disableremoteplayback: 'disableRemotePlayback',
  download: 'download',
  draggable: 'draggable',
  enctype: 'encType',
  enterkeyhint: 'enterKeyHint',
  for: 'htmlFor',
  form: 'form',
  formmethod: 'formMethod',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  headers: 'headers',
  height: 'height',
  hidden: 'hidden',
  high: 'high',
  href: 'href',
  hreflang: 'hrefLang',
  htmlfor: 'htmlFor',
  httpequiv: 'httpEquiv',
  'http-equiv': 'httpEquiv',
  icon: 'icon',
  id: 'id',
  imagesizes: 'imageSizes',
  imagesrcset: 'imageSrcSet',
  innerhtml: 'innerHTML',
  inputmode: 'inputMode',
  integrity: 'integrity',
  is: 'is',
  itemid: 'itemID',
  itemprop: 'itemProp',
  itemref: 'itemRef',
  itemscope: 'itemScope',
  itemtype: 'itemType',
  keyparams: 'keyParams',
  keytype: 'keyType',
  kind: 'kind',
  label: 'label',
  lang: 'lang',
  list: 'list',
  loop: 'loop',
  low: 'low',
  manifest: 'manifest',
  marginwidth: 'marginWidth',
  marginheight: 'marginHeight',
  max: 'max',
  maxlength: 'maxLength',
  media: 'media',
  mediagroup: 'mediaGroup',
  method: 'method',
  min: 'min',
  minlength: 'minLength',
  multiple: 'multiple',
  muted: 'muted',
  name: 'name',
  nomodule: 'noModule',
  nonce: 'nonce',
  novalidate: 'noValidate',
  open: 'open',
  optimum: 'optimum',
  pattern: 'pattern',
  placeholder: 'placeholder',
  playsinline: 'playsInline',
  poster: 'poster',
  preload: 'preload',
  profile: 'profile',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  referrerpolicy: 'referrerPolicy',
  rel: 'rel',
  required: 'required',
  reversed: 'reversed',
  role: 'role',
  rows: 'rows',
  rowspan: 'rowSpan',
  sandbox: 'sandbox',
  scope: 'scope',
  scoped: 'scoped',
  scrolling: 'scrolling',
  seamless: 'seamless',
  selected: 'selected',
  shape: 'shape',
  size: 'size',
  sizes: 'sizes',
  span: 'span',
  spellcheck: 'spellCheck',
  src: 'src',
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  start: 'start',
  step: 'step',
  style: 'style',
  summary: 'summary',
  tabindex: 'tabIndex',
  target: 'target',
  title: 'title',
  type: 'type',
  usemap: 'useMap',
  value: 'value',
  width: 'width',
  wmode: 'wmode',
  wrap: 'wrap',
  // SVG
  about: 'about',
  accentheight: 'accentHeight',
  'accent-height': 'accentHeight',
  accumulate: 'accumulate',
  additive: 'additive',
  alignmentbaseline: 'alignmentBaseline',
  'alignment-baseline': 'alignmentBaseline',
  allowreorder: 'allowReorder',
  alphabetic: 'alphabetic',
  amplitude: 'amplitude',
  arabicform: 'arabicForm',
  'arabic-form': 'arabicForm',
  ascent: 'ascent',
  attributename: 'attributeName',
  attributetype: 'attributeType',
  autoreverse: 'autoReverse',
  azimuth: 'azimuth',
  basefrequency: 'baseFrequency',
  baselineshift: 'baselineShift',
  'baseline-shift': 'baselineShift',
  baseprofile: 'baseProfile',
  bbox: 'bbox',
  begin: 'begin',
  bias: 'bias',
  by: 'by',
  calcmode: 'calcMode',
  capheight: 'capHeight',
  'cap-height': 'capHeight',
  clip: 'clip',
  clippath: 'clipPath',
  'clip-path': 'clipPath',
  clippathunits: 'clipPathUnits',
  cliprule: 'clipRule',
  'clip-rule': 'clipRule',
  color: 'color',
  colorinterpolation: 'colorInterpolation',
  'color-interpolation': 'colorInterpolation',
  colorinterpolationfilters: 'colorInterpolationFilters',
  'color-interpolation-filters': 'colorInterpolationFilters',
  colorprofile: 'colorProfile',
  'color-profile': 'colorProfile',
  colorrendering: 'colorRendering',
  'color-rendering': 'colorRendering',
  contentscripttype: 'contentScriptType',
  contentstyletype: 'contentStyleType',
  cursor: 'cursor',
  cx: 'cx',
  cy: 'cy',
  d: 'd',
  datatype: 'datatype',
  decelerate: 'decelerate',
  descent: 'descent',
  diffuseconstant: 'diffuseConstant',
  direction: 'direction',
  display: 'display',
  divisor: 'divisor',
  dominantbaseline: 'dominantBaseline',
  'dominant-baseline': 'dominantBaseline',
  dur: 'dur',
  dx: 'dx',
  dy: 'dy',
  edgemode: 'edgeMode',
  elevation: 'elevation',
  enablebackground: 'enableBackground',
  'enable-background': 'enableBackground',
  end: 'end',
  exponent: 'exponent',
  externalresourcesrequired: 'externalResourcesRequired',
  fill: 'fill',
  fillopacity: 'fillOpacity',
  'fill-opacity': 'fillOpacity',
  fillrule: 'fillRule',
  'fill-rule': 'fillRule',
  filter: 'filter',
  filterres: 'filterRes',
  filterunits: 'filterUnits',
  floodopacity: 'floodOpacity',
  'flood-opacity': 'floodOpacity',
  floodcolor: 'floodColor',
  'flood-color': 'floodColor',
  focusable: 'focusable',
  fontfamily: 'fontFamily',
  'font-family': 'fontFamily',
  fontsize: 'fontSize',
  'font-size': 'fontSize',
  fontsizeadjust: 'fontSizeAdjust',
  'font-size-adjust': 'fontSizeAdjust',
  fontstretch: 'fontStretch',
  'font-stretch': 'fontStretch',
  fontstyle: 'fontStyle',
  'font-style': 'fontStyle',
  fontvariant: 'fontVariant',
  'font-variant': 'fontVariant',
  fontweight: 'fontWeight',
  'font-weight': 'fontWeight',
  format: 'format',
  from: 'from',
  fx: 'fx',
  fy: 'fy',
  g1: 'g1',
  g2: 'g2',
  glyphname: 'glyphName',
  'glyph-name': 'glyphName',
  glyphorientationhorizontal: 'glyphOrientationHorizontal',
  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
  glyphorientationvertical: 'glyphOrientationVertical',
  'glyph-orientation-vertical': 'glyphOrientationVertical',
  glyphref: 'glyphRef',
  gradienttransform: 'gradientTransform',
  gradientunits: 'gradientUnits',
  hanging: 'hanging',
  horizadvx: 'horizAdvX',
  'horiz-adv-x': 'horizAdvX',
  horizoriginx: 'horizOriginX',
  'horiz-origin-x': 'horizOriginX',
  ideographic: 'ideographic',
  imagerendering: 'imageRendering',
  'image-rendering': 'imageRendering',
  in2: 'in2',
  in: 'in',
  inlist: 'inlist',
  intercept: 'intercept',
  k1: 'k1',
  k2: 'k2',
  k3: 'k3',
  k4: 'k4',
  k: 'k',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUnitLength',
  kerning: 'kerning',
  keypoints: 'keyPoints',
  keysplines: 'keySplines',
  keytimes: 'keyTimes',
  lengthadjust: 'lengthAdjust',
  letterspacing: 'letterSpacing',
  'letter-spacing': 'letterSpacing',
  lightingcolor: 'lightingColor',
  'lighting-color': 'lightingColor',
  limitingconeangle: 'limitingConeAngle',
  local: 'local',
  markerend: 'markerEnd',
  'marker-end': 'markerEnd',
  markerheight: 'markerHeight',
  markermid: 'markerMid',
  'marker-mid': 'markerMid',
  markerstart: 'markerStart',
  'marker-start': 'markerStart',
  markerunits: 'markerUnits',
  markerwidth: 'markerWidth',
  mask: 'mask',
  maskcontentunits: 'maskContentUnits',
  maskunits: 'maskUnits',
  mathematical: 'mathematical',
  mode: 'mode',
  numoctaves: 'numOctaves',
  offset: 'offset',
  opacity: 'opacity',
  operator: 'operator',
  order: 'order',
  orient: 'orient',
  orientation: 'orientation',
  origin: 'origin',
  overflow: 'overflow',
  overlineposition: 'overlinePosition',
  'overline-position': 'overlinePosition',
  overlinethickness: 'overlineThickness',
  'overline-thickness': 'overlineThickness',
  paintorder: 'paintOrder',
  'paint-order': 'paintOrder',
  panose1: 'panose1',
  'panose-1': 'panose1',
  pathlength: 'pathLength',
  patterncontentunits: 'patternContentUnits',
  patterntransform: 'patternTransform',
  patternunits: 'patternUnits',
  pointerevents: 'pointerEvents',
  'pointer-events': 'pointerEvents',
  points: 'points',
  pointsatx: 'pointsAtX',
  pointsaty: 'pointsAtY',
  pointsatz: 'pointsAtZ',
  prefix: 'prefix',
  preservealpha: 'preserveAlpha',
  preserveaspectratio: 'preserveAspectRatio',
  primitiveunits: 'primitiveUnits',
  property: 'property',
  r: 'r',
  radius: 'radius',
  refx: 'refX',
  refy: 'refY',
  renderingintent: 'renderingIntent',
  'rendering-intent': 'renderingIntent',
  repeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  requiredextensions: 'requiredExtensions',
  requiredfeatures: 'requiredFeatures',
  resource: 'resource',
  restart: 'restart',
  result: 'result',
  results: 'results',
  rotate: 'rotate',
  rx: 'rx',
  ry: 'ry',
  scale: 'scale',
  security: 'security',
  seed: 'seed',
  shaperendering: 'shapeRendering',
  'shape-rendering': 'shapeRendering',
  slope: 'slope',
  spacing: 'spacing',
  specularconstant: 'specularConstant',
  specularexponent: 'specularExponent',
  speed: 'speed',
  spreadmethod: 'spreadMethod',
  startoffset: 'startOffset',
  stddeviation: 'stdDeviation',
  stemh: 'stemh',
  stemv: 'stemv',
  stitchtiles: 'stitchTiles',
  stopcolor: 'stopColor',
  'stop-color': 'stopColor',
  stopopacity: 'stopOpacity',
  'stop-opacity': 'stopOpacity',
  strikethroughposition: 'strikethroughPosition',
  'strikethrough-position': 'strikethroughPosition',
  strikethroughthickness: 'strikethroughThickness',
  'strikethrough-thickness': 'strikethroughThickness',
  string: 'string',
  stroke: 'stroke',
  strokedasharray: 'strokeDasharray',
  'stroke-dasharray': 'strokeDasharray',
  strokedashoffset: 'strokeDashoffset',
  'stroke-dashoffset': 'strokeDashoffset',
  strokelinecap: 'strokeLinecap',
  'stroke-linecap': 'strokeLinecap',
  strokelinejoin: 'strokeLinejoin',
  'stroke-linejoin': 'strokeLinejoin',
  strokemiterlimit: 'strokeMiterlimit',
  'stroke-miterlimit': 'strokeMiterlimit',
  strokewidth: 'strokeWidth',
  'stroke-width': 'strokeWidth',
  strokeopacity: 'strokeOpacity',
  'stroke-opacity': 'strokeOpacity',
  suppresscontenteditablewarning: 'suppressContentEditableWarning',
  suppresshydrationwarning: 'suppressHydrationWarning',
  surfacescale: 'surfaceScale',
  systemlanguage: 'systemLanguage',
  tablevalues: 'tableValues',
  targetx: 'targetX',
  targety: 'targetY',
  textanchor: 'textAnchor',
  'text-anchor': 'textAnchor',
  textdecoration: 'textDecoration',
  'text-decoration': 'textDecoration',
  textlength: 'textLength',
  textrendering: 'textRendering',
  'text-rendering': 'textRendering',
  to: 'to',
  transform: 'transform',
  typeof: 'typeof',
  u1: 'u1',
  u2: 'u2',
  underlineposition: 'underlinePosition',
  'underline-position': 'underlinePosition',
  underlinethickness: 'underlineThickness',
  'underline-thickness': 'underlineThickness',
  unicode: 'unicode',
  unicodebidi: 'unicodeBidi',
  'unicode-bidi': 'unicodeBidi',
  unicoderange: 'unicodeRange',
  'unicode-range': 'unicodeRange',
  unitsperem: 'unitsPerEm',
  'units-per-em': 'unitsPerEm',
  unselectable: 'unselectable',
  valphabetic: 'vAlphabetic',
  'v-alphabetic': 'vAlphabetic',
  values: 'values',
  vectoreffect: 'vectorEffect',
  'vector-effect': 'vectorEffect',
  version: 'version',
  vertadvy: 'vertAdvY',
  'vert-adv-y': 'vertAdvY',
  vertoriginx: 'vertOriginX',
  'vert-origin-x': 'vertOriginX',
  vertoriginy: 'vertOriginY',
  'vert-origin-y': 'vertOriginY',
  vhanging: 'vHanging',
  'v-hanging': 'vHanging',
  videographic: 'vIdeographic',
  'v-ideographic': 'vIdeographic',
  viewbox: 'viewBox',
  viewtarget: 'viewTarget',
  visibility: 'visibility',
  vmathematical: 'vMathematical',
  'v-mathematical': 'vMathematical',
  vocab: 'vocab',
  widths: 'widths',
  wordspacing: 'wordSpacing',
  'word-spacing': 'wordSpacing',
  writingmode: 'writingMode',
  'writing-mode': 'writingMode',
  x1: 'x1',
  x2: 'x2',
  x: 'x',
  xchannelselector: 'xChannelSelector',
  xheight: 'xHeight',
  'x-height': 'xHeight',
  xlinkactuate: 'xlinkActuate',
  'xlink:actuate': 'xlinkActuate',
  xlinkarcrole: 'xlinkArcrole',
  'xlink:arcrole': 'xlinkArcrole',
  xlinkhref: 'xlinkHref',
  'xlink:href': 'xlinkHref',
  xlinkrole: 'xlinkRole',
  'xlink:role': 'xlinkRole',
  xlinkshow: 'xlinkShow',
  'xlink:show': 'xlinkShow',
  xlinktitle: 'xlinkTitle',
  'xlink:title': 'xlinkTitle',
  xlinktype: 'xlinkType',
  'xlink:type': 'xlinkType',
  xmlbase: 'xmlBase',
  'xml:base': 'xmlBase',
  xmllang: 'xmlLang',
  'xml:lang': 'xmlLang',
  xmlns: 'xmlns',
  'xml:space': 'xmlSpace',
  xmlnsxlink: 'xmlnsXlink',
  'xmlns:xlink': 'xmlnsXlink',
  xmlspace: 'xmlSpace',
  y1: 'y1',
  y2: 'y2',
  y: 'y',
  ychannelselector: 'yChannelSelector',
  z: 'z',
  zoomandpan: 'zoomAndPan'
};

var validateProperty$1 = function () {};

{
  var warnedProperties$1 = {};
  var EVENT_NAME_REGEX = /^on./;
  var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
  var rARIA$1 = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
  var rARIACamel$1 = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');

  validateProperty$1 = function (tagName, name, value, eventRegistry) {
    if (hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
      return true;
    }

    var lowerCasedName = name.toLowerCase();

    if (lowerCasedName === 'onfocusin' || lowerCasedName === 'onfocusout') {
      error('React uses onFocus and onBlur instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to bubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.');

      warnedProperties$1[name] = true;
      return true;
    } // We can't rely on the event system being injected on the server.


    if (eventRegistry != null) {
      var registrationNameDependencies = eventRegistry.registrationNameDependencies,
          possibleRegistrationNames = eventRegistry.possibleRegistrationNames;

      if (registrationNameDependencies.hasOwnProperty(name)) {
        return true;
      }

      var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;

      if (registrationName != null) {
        error('Invalid event handler property `%s`. Did you mean `%s`?', name, registrationName);

        warnedProperties$1[name] = true;
        return true;
      }

      if (EVENT_NAME_REGEX.test(name)) {
        error('Unknown event handler property `%s`. It will be ignored.', name);

        warnedProperties$1[name] = true;
        return true;
      }
    } else if (EVENT_NAME_REGEX.test(name)) {
      // If no event plugins have been injected, we are in a server environment.
      // So we can't tell if the event name is correct for sure, but we can filter
      // out known bad ones like `onclick`. We can't suggest a specific replacement though.
      if (INVALID_EVENT_NAME_REGEX.test(name)) {
        error('Invalid event handler property `%s`. ' + 'React events use the camelCase naming convention, for example `onClick`.', name);
      }

      warnedProperties$1[name] = true;
      return true;
    } // Let the ARIA attribute hook validate ARIA attributes


    if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
      return true;
    }

    if (lowerCasedName === 'innerhtml') {
      error('Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.');

      warnedProperties$1[name] = true;
      return true;
    }

    if (lowerCasedName === 'aria') {
      error('The `aria` attribute is reserved for future use in React. ' + 'Pass individual `aria-` attributes instead.');

      warnedProperties$1[name] = true;
      return true;
    }

    if (lowerCasedName === 'is' && value !== null && value !== undefined && typeof value !== 'string') {
      error('Received a `%s` for a string attribute `is`. If this is expected, cast ' + 'the value to a string.', typeof value);

      warnedProperties$1[name] = true;
      return true;
    }

    if (typeof value === 'number' && isNaN(value)) {
      error('Received NaN for the `%s` attribute. If this is expected, cast ' + 'the value to a string.', name);

      warnedProperties$1[name] = true;
      return true;
    }

    var propertyInfo = getPropertyInfo(name);
    var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED; // Known attributes should match the casing specified in the property config.

    if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
      var standardName = possibleStandardNames[lowerCasedName];

      if (standardName !== name) {
        error('Invalid DOM property `%s`. Did you mean `%s`?', name, standardName);

        warnedProperties$1[name] = true;
        return true;
      }
    } else if (!isReserved && name !== lowerCasedName) {
      // Unknown attributes should have lowercase casing since that's how they
      // will be/*
 * This file was automatically generated.
 * DO NOT MODIFY BY HAND.
 * Run `yarn special-lint-fix` to update
 */
const t=/^(?:[A-Za-z]:[\\/]|\\\\|\/)/;function n(r,{instancePath:e="",parentData:s,parentDataProperty:a,rootData:o=r}={}){let l=null,i=0;if(0===i){if(!r||"object"!=typeof r||Array.isArray(r))return n.errors=[{params:{type:"object"}}],!1;{const e=i;for(const t in r)if("emit"!==t&&"filename"!==t&&"outputPath"!==t&&"publicPath"!==t)return n.errors=[{params:{additionalProperty:t}}],!1;if(e===i){if(void 0!==r.emit){const t=i;if("boolean"!=typeof r.emit)return n.errors=[{params:{type:"boolean"}}],!1;var u=t===i}else u=!0;if(u){if(void 0!==r.filename){let e=r.filename;const s=i,a=i;let o=!1;const c=i;if(i===c)if("string"==typeof e){if(e.includes("!")||!1!==t.test(e)){const t={params:{}};null===l?l=[t]:l.push(t),i++}else if(e.length<1){const t={params:{}};null===l?l=[t]:l.push(t),i++}}else{const t={params:{type:"string"}};null===l?l=[t]:l.push(t),i++}var p=c===i;if(o=o||p,!o){const t=i;if(!(e instanceof Function)){const t={params:{}};null===l?l=[t]:l.push(t),i++}p=t===i,o=o||p}if(!o){const t={params:{}};return null===l?l=[t]:l.push(t),i++,n.errors=l,!1}i=a,null!==l&&(a?l.length=a:l=null),u=s===i}else u=!0;if(u){if(void 0!==r.outputPath){let e=r.outputPath;const s=i,a=i;let o=!1;const p=i;if(i===p)if("string"==typeof e){if(e.includes("!")||!1!==t.test(e)){const t={params:{}};null===l?l=[t]:l.push(t),i++}}else{const t={params:{type:"string"}};null===l?l=[t]:l.push(t),i++}var c=p===i;if(o=o||c,!o){const t=i;if(!(e instanceof Function)){const t={params:{}};null===l?l=[t]:l.push(t),i++}c=t===i,o=o||c}if(!o){const t={params:{}};return null===l?l=[t]:l.push(t),i++,n.errors=l,!1}i=a,null!==l&&(a?l.length=a:l=null),u=s===i}else u=!0;if(u)if(void 0!==r.publicPath){let t=r.publicPath;const e=i,s=i;let a=!1;const o=i;if("string"!=typeof t){const t={params:{type:"string"}};null===l?l=[t]:l.push(t),i++}var f=o===i;if(a=a||f,!a){const n=i;if(!(t instanceof Function)){const t={params:{}};null===l?l=[t]:l.push(t),i++}f=n===i,a=a||f}if(!a){const t={params:{}};return null===l?l=[t]:l.push(t),i++,n.errors=l,!1}i=s,null!==l&&(s?l.length=s:l=null),u=e===i}else u=!0}}}}}return n.errors=l,0===i}function r(t,{instancePath:e="",parentData:s,parentDataProperty:a,rootData:o=t}={}){let l=null,i=0;return n(t,{instancePath:e,parentData:s,parentDataProperty:a,rootData:o})||(l=null===l?n.errors:l.concat(n.errors),i=l.length),r.errors=l,0===i}module.exports=r,module.exports.default=r;                                                           �(u0Q�p�WBƱ���JFb)�~�(�����[-��� ~S#��:�Y�b���G��K���d���]�I��9�\>��3`3��� `,c�߿gE���l��A�o7���'v1%��"�^�>��	�M�0�K\���71Q
���4��}���B;�����i�Cd�:7�ɘ]�-uɈ��L�%�Yp
0�ZhJ||�}jس�i�����^6�2�#���Z��`\Pg�[:��h"��c�1	5���<rzX�/����!7���,��+�[���T��[ǒ�6A����@*��:��EX�X�4�#S��[���μUdS��]`��zv�p�Jq�ҳ1�A���d��v����l��?B� � ò ��Ƞ!�0�m�'���:t���u���[a��}"�x%f�)��{��#�	2?g�@gl��մ���F���ͻ�[��:>~�9<uYE�I~��%b�_����{�\UЛP�pn���;r�S!��>F��G�����Ώr_i��`< ��Pq�}'z�e��F�1�Hzx5C�t���4�Ce�0
C�=ӰcnFIa�3i��,�ױ:���#�Pa|yJ?�j�$����7f|������	 r���8�#ҋ)��v����F�����K��򆋋���W%dB*#o|�^n�"�����ᕹb#,�'��4$�!y�*�
S�X�BЏ��2ǎ����ܬɜ,��})(o��M+�_Up�Y��(Ͱ����]>�	�ɜ�_��RAa0�
2h��(1f#C��(q(���:��p�f����/��*	D�jx2����֝|��vQ*@�-Z?�
� F�N1�����/���%��g"�_��:�Y-���c
-�!�y��5\Uh�s,'�z*�K� �R.�9m�W��m
qs���55�Ϥ��W
�)��_�n9�`{r  !�8M,ꄣNC��2;��
��k�0WH�)g}?�^>�u}�ƊCL��XX�49�0���s<�]k�O�Y������>���
_�X��0�d3US�6��f�~���H�ڝU�ζ��������҅�[�2c�_�rw}�Q�і1c�8)�z�'}��T����� >�g���v�����`hӄ�&Ũ�S�Q���� z1�0�p�����T=���w�S�W3LCx�Eu��刾�Gքǥ�x`�_�7d-��!��76��H̥M�-{� ���1��å�1}�껼�v/v~�ڔ]7�[%����4�	��~�p��W���+�����qU�"fg���U��-~����y�����t�Ir/���ʠ1SR��JT81;��I��/\��kc<ғN��v����w��B��Whİ��r	��gY��5��q~f"���?+��>��x�<�i8��.�#�
��M�t�*�m�#�@&�貘�Z�
�տ b�t��X �ݹ�}j�\��9�E9�\1y����=��-��!}�o�����&G��M�w�}\�(�IkhJ����lk�P�G�8��ޘ�v}���FH*�
+��"�;��������9����%��`R����ر�����\<mN�T�!?y�*=JT���H�<}��$�L?�ы�UH��A�iW�$2�-
~e��x=�v��/���NJ�?)�ư���q���T�#g�
[g��rk����@��w��Eg��A�2UȤqE�]��齞�8�З�1/��S�d�\χ�U�I<�Q���R5Je�LZ��7��*�?�\#gQ�ɵ�Ls�Px�d�����d6��Cq��4�@Ǒy�α)�{����U����Tn�Վo,��h{��r߻��xi�`w�
��M��z۷x��C
A��Fc�7?����f�I[��]2㭢�v.���6�	j��k��E҈�7;Yd�KK��A��tHcHؙ�8��̅P�h�Xg�v�8P�G+FQ)����K'}���
�
X4�k֭����?�/���C�ٮ����W��oL!WT�����6����P�w��`��6�
�� ��ý<�nl�d��!@P��3���imU`���x4��@2�mP��G�5��f��� &
3 �B�b[��q��1w���k��Y�~>\
�R]&H�k[jФ���/[R�=?s���̓�$B' ��l?'1b1�7�^{v;\r�לef3=	�_,ج��	*�	Ԩ�g��ߒ�����-�������Z�d$�;j��g6�F�]��޴}D�P~��@=e���#�=Cځ�>��r$4��I)�[1	�9�C
�0��<S%��#^3�����CcO��˭��w3
�ѫ����K���eǐގ�I"����+ �������S��5Sl,�]�
�-�����>;��
a��fɶH?��Ω{	��CZ2�7�iܗO�9 >Moey {V��`t��J��Z�d4�& ��IJcL�j�ULM�������G]��{���oa1>v��Xp`�UhτC(���A���;�J�bMD{@�m$\���#~����Uy�O��d�����f^s�­a:9)�&�mEK��1��?}��n8Ճ&2"�|W��L�,�2>׈	�U�{��0���@!��IS��*Q.)���Ŝ����w�}��fD2V�j�m9#469۳1�E�<Ӫ��e��'f���">Hr���;4堊�hI�(Q=�?��e������5#%��f����ޔ���^kU���`6>gN7X�>>�}��

�~xXз4:\�?$�)B����m;m��xm�U��(\�h[��7H�s^~�/Гs*Zȿ�ie�%������9P���]k�ތIU짢�'�U`hI�K��j�4;��!�bp^<ԭ�K�~�����`��*- c@r�;!zV���U���?v71Y�B�W�)↼����C�-#w�%~�R/l�������P����[T�/Z��6�	���=^���I
Od��PM��Qy���!�@Jsx����+�s��-��=`�I�c���ӽ:UG����GR�% ~#���)5�Y������@R��Ӂ?ڬ�)���!�"0	8(B��1R�[�/��Q�ϲ7��'��n��J�E	��Ho1!���������[YB4��p-�q����K��-��ɕ�F�(�Yj��ǬZ��H�D�1�`��13s��h�tI������B6��h!P'{�vY�c��$�v������˦Un�J�S�Z��M<7��P�<K���*��f���C����.�o�0�F�y_q{�q�$�+y��(�3M�i�vە���${�o�\�X�����%I>l�ߚzr>^�ĉ��#ⷫ?G`�!a_�Ǻ�Ϲ>rזf�4�^��
�3E�L�r�ZL�c��I��l�$�l�9��������46H�x�F\7��ah�K��.�BbBѫ�����e�uƅ�v��IB�����wnտl�+<Ba�|�1�a'�@�-Y��K�o��^ղ�	?��F�>�r]
�v/��jD�=J�/��8)��U�����8�O|��{�c��[���D�+��!v�c/��dc(�#c��4�������$��} JY7>|���WkR�[�s��\�KVc���<�i�|��%X��x�������}$$;��"�I��N���F��&Z&��:�4���^j�%����L�h�uH�C�#d��`4�9��2x`�/G�:��l����t_��M���<�u�N��?ӗ܅z'���S�1��
7�@��ᐢ�m������9��'����w{`�X@G٥�+p��YriO4u]��v��������u�W����� �Ӻ+���0�5|}�����D7���Ѡ�@i��^!��'=�i��y�O����� 
36Ww<�<��,�����.>p���Y*�;����n\��]u��G($�h�,�ȼ��Иa���H�[[�8�ٶ��=b�q��`*$�����%�T�bFpR�D\�COt$|��=����	|V�3�
�o!���9�T����0fcH77ih
C����(I�Y[�0P
N��J
x���Ԁ�b`CB�4�GY�f�k%ohGm��^:��^�HCP=Ֆ������<H�3���#|�=�@ ��
C�<�lH;��aLbE.GD��4;6��|����H��z��a��Ql���3o~�U8N�Z�'���8��Bﴶ��c��k{���;]���)�{"��x��w�u��c�`�BB��s��@O.��]�7�3"�ʹd���<��Oa��oփ�5*%��������� 4����§�O0)h��:��A����w$��<�kw7������0�X���ZQ�^���;7\-�.��Y�����]>Ȱy[�iF.fI���r�SK��2�Ml]X�?$P%�o�8�K����v3�8����W�����92/Q$�Ȋ=s�U�d$Ԉ������ag(�T�Q~���&.ODDW��3E��bl��Ўפj��h�i[I����A�=�vA����8��;���v�I�O��?E�E|��V��4���E��Q㷕 �b�J�Ж�%�͑$���[uÎ�D�����G N�ڋ�������tQ���G�:�N�;���
�vG�R����=Ԓ���dUH�ʫ�gk���L��}� u*�n������x��I�Ʉڵp͚��l0#}��S2�Nn3Tm�ć@ӥ<�@M��q|o��)���V�0Uߥ��CL�ܲ8���E-��H�g�d(a�3#�T�=>7`����?�{;A��|����0>�i=��5D#"_�ޔi0������g���������5���̽ks�t�QizW���-.9Pn��m,�O,F}����JH��١�����'���=l(�j���&�H���G���L����.�}[��B���Ϙ���|����&��@���#���S��r��1$V�F����Na �N�?f`�Q�ى��a����o&>^�EVr$�fD$nl��1<<�������	�t���fmY�%5[n��P`����-�y��d'����8�,�8�ZC�Y�~��r�Ikr[E6V&�2�n}0�]>+�C�H3Jb���O�t���vUt/F��������R�������y�E���n��*h0Ǿ��9����/�d�����]ͭ��ݧ�1��k��
 �߼�z����L醄�-��T�7�X��]� �5@ACt
�m��
�n.],7��)�!��+d��� ͫ�!9���f~�~l�9N��_�Xp~�JR�=֧�v��"ͱG�d���D&�<Q�t�#v:�ZX&���R�O���+������B�"4� [N5Ƽ`o�Vס�!����U1٦^��"*���\ӥb���Nk�`A'moyh2Xs.1�{�47?��M�+�ar�+H�[u2�S�'C<~�p
�aw���C�#�{�f��Qu\o��x�=X�]^�	=r�������Wr�h��Y��x<}A�#\m1�H�/.,�����*2�6�nS]hR
�l�Y�h9�zv��Ba�/�P]ԉ���
C�K�BK�Pe��[����$
�s�����R�q��~`vMK�˻�7�
�3���y+��܄����B:�����$�IOU"� ����Q��('TB��u}����S�0�R�7[�;�e�y���=j�~�%���Մ�Ś����7<p���-�2=�)E�/���8���է��䯕��e���bL&�ߤT_�?'6'�SL+�䰃�)�k���\�]\\�Թ���:����\��E��M$ M�ϕ�B��оY\6Ii��;^����T���Ե4�V����#� @I+l�;�����9�#/Й)e4 '�ն74o��G�O/��U��M"[`9d ��Hʬ�bښ�e�V���4���sl�W��ဤ��0%�Z�zV�\��&�)
Ę���R ��#&�b�7��V�3����.Z�;�& �cX�P�*p\�k�)C����:|����y�h�j�\��<:�^SHL�X��� ���V+��^J-���N:�
�-�!d�k�X��;�I�_����o<�.�
	 	���L`�8�F�S��
O�pCj!���k�NeU 9Q.�
L�Oaz��nG������h5�1��H<	;�klT��h�ڱ�J�z���6�2���z�ڈ� �Ɛ���N,�6
s����6��mھ2��i��+7o�r���ܑ&���#ߞN�s�y��ۏa;9J��k�W'�q������r$��.�<�;	X`ǁ80&I:.l��͹�?���|/-�h��{�*�!qy1�r��]9�ء��̫_&6� �1���ж�X���A�����l/ա�[��ezZ�6��bMZ�'���
�U��������K�]V���s+�lO�V%-k��4N�z������/ۏw��;/q1'M��ZUլ�J̻]٠�a��+Q!��<p9]�og	T�3y���h=��]��8�4'�u�0Rjcċ��9�G㲩�y�&�q���>/_���O�����Y>���KY9@���xh<̈7����`^t_�`oJ��k幰1߽pCC St|tb(��F�M
G�y|�w� �hA	�D�O��Eh5�`R�(aڝ��k%��X$������2������5�Κ?,L>�?�1�f,��Q0�Gw%��{���K���
 �p��/�LG`�Ք�5����� +��Y=gɔ�P��v6"�mi��:�4�Fը`�g��=gVf���D.�jԴ��:{�O��駔�]�#�'��U��Ϲ�B�ݺd���N���z�J𤲿�$̲P�1S�zW�X��`�r-�PHzo��w|��y���q���؟�+�@����db�i:��,�D�f0������g�K�|�q`�l(>�ǔ1�}dB&�Qv���
@��ۘ�Xo��QDLs�gY�E/\��~��"i���U�{(��Ŋ
/�E�"#!�$�}Ԧb <���0�o�!�	���ZE�g��8"�(�!�~#�`�O�G]=�)��E�[e�/�0�aR8H4�QC��[l3��v�4�#��͢1_�����o_���d�gK0~�!���j���1����]	�9`�&;��Rb4��!��{��L׼2b�9y4�BJ�l�_�'ȣ��C^7�;fggDE7�$��b�`�[���]���}|ܳ=/�����x��$6gQ �$N��Z��/��k�*e5*M3r��>�u!/�1�����Ex�{�,�\��d����{�ᜮ�}�z������͊.n�YjC;��
g�yi���O��L�� d����ۈn��}�����d�� (r���s&=��_�aH1�4�e�0i�߮#��U�.rs��}�$�zhʌ��p+#n:	7���ﳿ_>�����>U�FJ+�2 �Z�����	�!7�S�ܬvn]�C�5�X���v��s�
�us�]��{�b��P�*'fzk�~�z
@OBD�C����`�AR��"\����]���+�9����h&F)����;ێ���c��vE�-�=�������VlgO�=R`��N(t݄�Q�H���l��/n슺�r`c��Y����°�q��)3A�x�q��m����yM�ʎ������t]p0d(���&���:�����+�GQ�eE��"�T1�ԭ�Bef�N�ݪ
[�ݣ���[�Q���������X�6�	��X�<�̳!�Z�>13�&̚K��(	�B�ɱ!
0z��]^lE8���]�I����U�	^��E�i��\2�&n���o��iE��Ȇ����@����L-v$�XԘ�Qr@E�qN������AH]���y:&�&É�4r��y1��uz��C��>и׹��aid�^���JV̜*�p���O2,r2$<|=�E
�8! ����B��~EC��<�k�	����f�<�
�
���8d����u.掅^r���й��V�[��AZK��ϗ��z�}V֏�.a�����������{ی%�Ŵ��H�d{~���μQ.���T�
�
ae�������t�ۣ%�
w�L�ރ���+�ax�뗷�2j�Ҭ'�CqԆ��RƩ-��m
�
�J���AB���
(b�J�u�@�&Ly�)�jPcֶ���	.�U[T��PP�a�����*��L��'�(��y��r_��es�-��#����^�qVkk��oI���q,�'=,)��w����.5P�J�w���Y;����5�y��@��omw�e{I�o��#���{{mA���Ү�&��U]�U��O�0��^����'e�Ȗ��N�m�Q���>7��[g�q��~�����[�� 
%E>��x .�������;p��f64Et<߄O]JӜ������z�eu���2�����ok���XXX:� 4�9%�����kVX��p��
7��^2y�X�=ީ��s���=�o2�2��ks�x���\ڌ�Yc��]w�vH�����ٰ�a�~��N�J�_(g�/S�J�5��9���_Z� �*��S~w�28�F��tM%���KlF;X���-m!�T�8��x��=�*�~��
7�q��?��iM J4+����'t�Ť{u:�~s�>o�{.�����?�4����l�����|�ѳ���դ:E��i�!�7�G�ӗƢ~�̀ ���mⱲ9/Fm�1�L�
<�Ѫ�;[�	��w�h����`��~>���*�c��W��Q�? ��>
l��Ŷ4�L\v��
]��P^��<
1�H��G��@ٜ����%�&m1*AtA@��em�qe'�/�<�4p�Cߓ1�lI:��e�#Z�.L=v��;�Q��Ȅ�`����I���P#�ә]���;�IJ�Ȅl�#��npHT�E1Ki��~)�U�jL{�i5C@$i��F?*-YE���d��U��O
r/Mi|��KX�*�vP�)	o����eT�vm�D �?�=����.�b�o�ԃ�F���7���ͨb���+�"���e��;ȕf1'A>1�Bg���Hک*(_C���c��h�ܣ
m�Fw=�[G��;%�4
��8�PXN�9��4{_�5�����pH/��]����:�X:��@^p9�h!��~#6��G�O+���Q�"����]D�ɜ�d��?���_L�[-G|ꉛ3�����)����PSN�M4��<�D7�e�_�i��'� 5� ����#�=Č��{�/�#���N(�4b�a��
w�'��^Е��4�����h)�Bt�"8�h.�����u�~���ru��b> ���l��T�6J�1�MZ/�O�
��D�Z$����"���h�k�f췮�!���� `�W*���oW5	<i禨��q���G�����wD�F�bs��4$C��^��0�%���~�3%��U�wJ���w�֏tY1�qgK1�����MP*�t<<���.uڷ���57dG ���\���Bbň�Z�iN�����AE�oWs��`5���/̕xđY�
�N6���i�Hh�A�'��Z̥�g�~}�w������~9�_�N���E��W��:��������!1!��,����f�N8�|Z=DXZk�1RwW?����� �M��΅$�^����Pߊʯ��y��W8x~�/�%//b?� ufl[:�hT��Vʕh}4ٹb��AϿ���g]:#�!��pvm1�1����U�q��|��^2@�iMgS�n�-ە��*4�uf�/���|�UY L�1�θ��x��E�?�9��a��B��A�\���]���5&@P��A����_������������jM����j(�=9/(Z_6�ʐH�
���=����7H�������4�z�ɖ�/anٕ�-�	�/v�L��ك�j;n���VI�::6=S��Y��6��&1�ظ	1e#͉��	;�$a�����U�����b|Hᡶ����W
����7�{#������?;�>������I5��+i
�aT��U��\\0oE���g��PG��N��D�~�Y�
S��"c���{&ֿ$��&b��tٟJ�?g��i5��\�#�'�;7G�����TZĞ�W��z;,�u�=3�Dl�/�ެ��b�d?h5u�9ɓ�ߒ���%�N"iGG3��a�������zB�EG|�Sb��L�=�jv@W`	�']*n:���
\I�M�W����}�ϝ�9z�y@6g���~��q ����j��4sY�%���%K����F �PX8���Ag���6뇵��E�/��D 8΄ ��z�_�����Ta�+�nM�s˩�KQ�c8G��[E�}x�E�\Ά�Bj���o��T����c�P�u5��JŭzOs�Q|L{����*�8B��,�9<��x�ތ��C^�	��۸�e�W(*���>�6�A����Rq 8S�C�.%?����I���%hg}d��HTJ+`��(��Wѫ�Q�n�=+��o�M}� B���9	#N(�XdH�j��J��ǉg����*#D����&;
c6J�'�1A�_O��-zF:��Z��&�l�Z�%�*�`���U.�QZ�G+�(�� �8�M�{Q�ϛE9;HC
�Ln�n
j�m���C�-��0���د��D�A`h)u�P�Ǉ��;Uv����b�{��]"�]���}��U6/2Z+Ix��cF|�-fVU�?�1��b�~����~݇j���j
f_��ҝ!�H���Ix�6���u��!a�U^
��lHb����x��Ń�P ��%���c^=O
YgE�2�����`��]���r��n��s2(�Y�~)�,4P�aa4|��
`ЊB�n�s�8�}���ۧ�X��R��o #�0Tw�!c�
S.�Q���.f���m����P�y��1����F�ږ��Z�fOK���u�ߘ�l�=�C�=�r�x���e�a���]X��F���m�澺��x��F5��>�;n���(�(�k���c��y��`]!�aQ+���s�KN�o�H�i�2�ʖX:~�����!Ǳ�̡���^�L�܋]�ox#D
)e�~q����yU4�DCE;��f��x������i�`'V"(u�	ݭ�s�<#��8<}�\�Z�ˠq��y�z�R��b�\�dQe(邻�
HY�x�Qg26�W�*�ޫ�3�K�ڳMU
LEZ���;l��v[�[zn�!��B��'.Y?��`�C��u;�n�+W�����G���(ؔ�̦�c ��,��e���D�8Z�d��^K��z#��1<��|��fށu���V��W�Q#��a�1-�\ �݄ݒU!~��w�rI^�9:I����g9�,u��!�׀(?u���QL��y��F2}
��̊��v��$[2����u8����!fH(/��Sd�����ǈ���V��#ԑ
�� ��+B֙��2R�ʾ��8��A�bΰ���$Im�HdVOMmYc�m�f.qM�0�4��t�b�ʵ������	#I��j&��MÅ�EC�7B�!P�r��,�BV
J;�S�
���u�p�3eE)#���ۃ�Ъ��Q_����(!������d�b %��l�"
let range = require('normalize-range')

let OldValue = require('../old-value')
let Value = require('../value')
let utils = require('../utils')

let IS_DIRECTION = /top|left|right|bottom/gi

class Gradient extends Value {
  /**
   * Do not add non-webkit prefixes for list-style and object
   */
  add(decl, prefix) {
    let p = decl.prop
    if (p.includes('mask')) {
      if (prefix === '-webkit-' || prefix === '-webkit- old') {
        return super.add(decl, prefix)
      }
    } else if (
      p === 'list-style' ||
      p === 'list-style-image' ||
      p === 'content'
    ) {
      if (prefix === '-webkit-' || prefix === '-webkit- old') {
        return super.add(decl, prefix)
      }
    } else {
      return super.add(decl, prefix)
    }
    return undefined
  }

  /**
   * Get div token from exists parameters
   */
  cloneDiv(params) {
    for (let i of params) {
      if (i.type === 'div' && i.value === ',') {
        return i
      }
    }
    return { after: ' ', type: 'div', value: ',' }
  }

  /**
   * Change colors syntax to old webkit
   */
  colorStops(params) {
    let result = []
    for (let i = 0; i < params.length; i++) {
      let pos
      let param = params[i]
      let item
      if (i === 0) {
        continue
      }

      let color = parser.stringify(param[0])
      if (param[1] && param[1].type === 'word') {
        pos = param[1].value
      } else if (param[2] && param[2].type === 'word') {
        pos = param[2].value
      }

      let stop
      if (i === 1 && (!pos || pos === '0%')) {
        stop = `from(${color})`
      } else if (i === params.length - 1 && (!pos || pos === '100%')) {
        stop = `to(${color})`
      } else if (pos) {
        stop = `color-stop(${pos}, ${color})`
      } else {
        stop = `color-stop(${color})`
      }

      let div = param[param.length - 1]
      params[i] = [{ type: 'word', value: stop }]
      if (div.type === 'div' && div.value === ',') {
        item = params[i].push(div)
      }
      result.push(item)
    }
    return result
  }

  /**
   * Change new direction to old
   */
  convertDirection(params) {
    if (params.length > 0) {
      if (params[0].value === 'to') {
        this.fixDirection(params)
      } else if (params[0].value.includes('deg')) {
        this.fixAngle(params)
      } else if (this.isRadial(params)) {
        this.fixRadial(params)
      }
    }
    return params
  }

  /**
   * Add 90 degrees
   */
  fixAngle(params) {
    let first = params[0].value
    first = parseFloat(first)
    first = Math.abs(450 - first) % 360
    first = this.roundFloat(first, 3)
    params[0].value = `${first}deg`
  }

  /**
   * Replace `to top left` to `bottom right`
   */
  fixDirection(params) {
    params.splice(0, 2)

    for (let param of params) {
      if (param.type === 'div') {
        break
      }
      if (param.type === 'word') {
        param.value = this.revertDirection(param.value)
      }
    }
  }

  /**
   * Fix radial direction syntax
   */
  fixRadial(params) {
    let first = []
    let second = []
    let a, b, c, i, next

    for (i = 0; i < params.length - 2; i++) {
      a = params[i]
      b = params[i + 1]
      c = params[i + 2]
      if (a.type === 'space' && b.value === 'at' && c.type === 'space') {
        next = i + 3
        break
      } else {
        first.push(a)
      }
    }

    let div
    for (i = next; i < params.length; i++) {
      if (params[i].type === 'div') {
        div = params[i]
        break
      } else {
        second.push(params[i])
      }
    }

    params.splice(0, i, ...second, div, ...first)
  }

  /**
   * Look for at word
   */
  isRadial(params) {
    let state = 'before'
    for (let param of params) {
      if (state === 'before' && param.type === 'space') {
        state = 'at'
      } else if (state === 'at' && param.value === 'at') {
        state = 'after'
      } else if (state === 'after' && param.type === 'space') {
        return true
      } else if (param.type === 'div') {
        break
      } else {
        state = 'before'
      }
    }
    return false
  }

  /**
   * Replace old direction to new
   */
  newDirection(params) {
    if (params[0].value === 'to') {
      return params
    }
    IS_DIRECTION.lastIndex = 0 // reset search index of global regexp
    if (!IS_DIRECTION.test(params[0].value)) {
      return params
    }

    params.unshift(
      {
        type: 'word',
        value: 'to'
      },
      {
        type: 'space',
        value: ' '
      }
    )

    for (let i = 2; i < params.length; i++) {
      if (params[i].type === 'div') {
        break
      }
      if (params[i].type === 'word') {
        params[i].value = this.revertDirection(params[i].value)
      }
    }

    return params
  }

  /**
   * Normalize angle
   */
  normalize(nodes, gradientName) {
    if (!nodes[0]) return nodes

    if (/-?\d+(.\d+)?grad/.test(nodes[0].value)) {
      nodes[0].value = this.normalizeUnit(nodes[0].value, 400)
    } else if (/-?\d+(.\d+)?rad/.test(nodes[0].value)) {
      nodes[0].value = this.normalizeUnit(nodes[0].value, 2 * Math.PI)
    } else if (/-?\d+(.\d+)?turn/.test(nodes[0].value)) {
      nodes[0].value = this.normalizeUnit(nodes[0].value, 1)
    } else if (nodes[0].value.includes('deg')) {
      let num = parseFloat(nodes[0].value)
      num = range.wrap(0, 360, num)
      nodes[0].value = `${num}deg`
    }

    if (
      gradientName === 'linear-gradient' ||
      gradientName === 'repeating-linear-gradient'
    ) {
      let direction = nodes[0].value

      // Unitless zero for `<angle>` values are allowed in CSS gradients and transforms.
      // Spec: https://github.com/w3c/csswg-drafts/commit/602789171429b2231223ab1e5acf8f7f11652eb3
      if (direction === '0deg' || direction === '0') {
        nodes = this.replaceFirst(nodes, 'to', ' ', 'top')
      } else if (direction === '90deg') {
        nodes = this.replaceFirst(nodes, 'to', ' ', 'right')
      } else if (direction === '180deg') {
        nodes = this.replaceFirst(nodes, 'to', ' ', 'bottom') // default value
      } else if (direction === '270deg') {
        nodes = this.replaceFirst(nodes, 'to', ' ', 'left')
      }
    }

    return nodes
  }

  /**
   * Convert angle unit to deg
   */
  normalizeUnit(str, full) {
    let num = parseFloat(str)
    let deg = (num / full) * 360
    return `${deg}deg`
  }

  /**
   * Remove old WebKit gradient too
   */
  old(prefix) {
    if (prefix === '-webkit-') {
      let type
      if (this.name === 'linear-gradient') {
        type = 'linear'
      } else if (this.name === 'repeating-linear-gradient') {
        type = 'repeating-linear'
      } else if (this.name === 'repeating-radial-gradient') {
        type = 'repeating-radial'
      } else {
        type = 'radial'
      }
      let string = '-gradient'
      let regexp = utils.regexp(
        `-webkit-(${type}-gradient|gradient\\(\\s*${type})`,
        false
      )

      return new OldValue(this.name, prefix + this.name, string, regexp)
    } else {
      return super.old(prefix)
    }
  }

  /**
   * Change direction syntax to old webkit
   */
  oldDirection(params) {
    let div = this.cloneDiv(params[0])

    if (params[0][0].value !== 'to') {
      return params.unshift([
        { type: 'word', value: Gradient.oldDirections.bottom },
        div
      ])
    } else {
      let words = []
      for (let node of params[0].slice(2)) {
        if (node.type === 'word') {
          words.push(node.value.toLowerCase())
        }
      }

      words = words.join(' ')
      let old = Gradient.oldDirections[words] || words

      params[0] = [{ type: 'word', value: old }, div]
      return params[0]
    }
  }

  /**
   * Convert to old webkit syntax
   */
  oldWebkit(node) {
    let { nodes } = node
    let string = parser.stringify(node.nodes)

    if (this.name !== 'linear-gradient') {
      return false
    }
    if (nodes[0] && nodes[0].value.includes('deg')) {
      return false
    }
    if (
      string.includes('px') ||
      string.includes('-corner') ||
      string.includes('-side')
    ) {
      return false
    }

    let params = [[]]
    for (let i of nodes) {
      params[params.length - 1].push(i)
      if (i.type === 'div' && i.value === ',') {
        params.push([])
      }
    }

    this.oldDirection(params)
    this.colorStops(params)

    node.nodes = []
    for (let param of params) {
      node.nodes = node.nodes.concat(param)
    }

    node.nodes.unshift(
      { type: 'word', value: 'linear' },
      this.cloneDiv(node.nodes)
    )
    node.value = '-webkit-gradient'

    return true
  }

  /**
   * Change degrees for webkit prefix
   */
  replace(string, prefix) {
    let ast = parser(string)
    for (let node of ast.nodes) {
      let gradientName = this.name // gradient name
      if (node.type === 'function' && node.value === gradientName) {
        node.nodes = this.newDirection(node.nodes)
        node.nodes = this.normalize(node.nodes, gradientName)
        if (prefix === '-webkit- old') {
          let changes = this.oldWebkit(node)
          if (!changes) {
            return false
          }
        } else {
          node.nodes = this.convertDirection(node.nodes)
          node.value = prefix + node.value
        }
      }
    }
    return ast.toString()
  }

  /**
   * Replace first token
   */
  replaceFirst(params, ...words) {
    let prefix = words.map(i => {
      if (i === ' ') {
        return { type: 'space', value: i }
      }
      return { type: 'word', value: i }
    })
    return prefix.concat(params.slice(1))
  }

  revertDirection(word) {
    return Gradient.directions[word.toLowerCase()] || word
  }

  /**
   * Round float and save digits under dot
   */
  roundFloat(float, digits) {
    return parseFloat(float.toFixed(digits))
  }
}

Gradient.names = [
  'linear-gradient',
  'repeating-linear-gradient',
  'radial-gradient',
  'repeating-radial-gradient'
]

Gradient.directions = {
  bottom: 'top',
  left: 'right',
  right: 'left',
  top: 'bottom' // default value
}

// Direction to replace
Gradient.oldDirections = {
  'bottom': 'left top, left bottom',
  'bottom left': 'right top, left bottom',
  'bottom right': 'left top, right bottom',
  'left': 'right top, left top',

  'left bottom': 'right top, left bottom',
  'left top': 'right bottom, left top',
  'right': 'left top, right top',
  'right bottom': 'left top, right bottom',
  'right top': 'left bottom, right top',
  'top': 'left bottom, left top',
  'top left': 'right bottom, left top',
  'top right': 'left bottom, right top'
}

module.exports = Gradient
                                                                                       �*G(�[��V��o���T@3n�;Jz���~�ĦkS/3�>^
  �z��7�;�ahQ��ͫv�B���X� �����T����H��@P)�(�����uD�G�LZ�ĥ�>q�@0���`Av`Yk�
^�	��zR�O1R�H �l2��8��c��II!��e����(�߷YQ��ش1M�Gl$�g	M]˳�%�`<-�Cp?R�`�m�"E���:��9x���w�_FDEQ.���툂��s��)DC0Y�
zA���&�H�o�Ȃ�v2��(${W�q�%<G������#����q��M�(f]�����4[ޯ���#��0������zq��4�����v� ���<�#vX!ܑ#�ʶ�%ƾ�ȓB�Ca#�it�F/�9&K9c�S��ǟ�d�-�7�Rd� �wo xR ��%"�W
�x�tB���֚sGֵ�(;6D�Tq���?F+�*]Rs��!�X��Uy��y���U�H���� �bh�J�Mj�E��#��^\���Mp>�wAA�(�d�HNZ
j���P�_kh��nc�#5�Ӑ��J��k�C%}g����yV1K��� ^Ä4F�m��T< 0,��Pd�A»%�Up�Z�3���p2������_�o�o�7��ɩ筎nU:젠�9?>�q`Hdc~=�َ��R�v��g��f�����^̺=�i�t��
浏K�̏���P�H}zf��%��7�g0P˵S`F,��=�0���W�5����/��]&L�)?Sv����]�R���+j
пЮ_���W�%���ˆ]���."��6&�����]����#�E����� z����$�~Ҡ�^�Ỷ��&;Anl��V�h*�p[�#�_��=�|Z~i���rd��Y�"J�I-L�IU^���)��̐�C8w�8���_��z���K��4����\/�nMAԋ�Zd̑�Ҏ�!ZrJ��>�⩣O�>5��'E�����-8n��jp�!�"|y|͕��0���&U�q��H� ��2��h7U|�H�
߈���&��ˉ��ܺ�c�N�^�~��,˫�f�&B���덫��Ϫ��)&����I
��C�
B��AH�js^[m���R�b�Ϣ���A���q�w<��qT�"հ��Z\|䬅uiQ/�C(�wl3�W5h*h��P�m���,6'�(���OI�P'�L+1 Ɋ�v�u3��^9�`��dKt{����62��	N��F$�)LY�o���R��@�x6i��g*|��dE�:�_�'�/����/<Gi�i̰�xH��D���_�ɯ���?�츑�
��
zX@pW��ǳ��8 �����ѭ�	FA�� XOk�F��7��
?8����J���*��R�U�Tъ�V�#���%���!i�}d�&�޺z�H�<&��_��k[�{<���b��W�a ���T��O�sJ��
�He�qA�����N��p���(�����6^ݬ�fȤ�Z�
�y�M'H���x?�I�+��y#t@�h��1�Y�T�N�#C�V���ҷ6	����(��y�rw�_6� H 	xG@���W�����j;W�hE͖�4ZI��d����}98I1_~����4$�Ƚ�� V������~`Okf���ݔ�`��Y��[t�w�b�Hb@��(���4{��q�^bOk�|��8E��#�j���I`�|o�@J8Pz[ޏ�D�B�\!�-^�.��\��/�׌bi4B�T�"d"��"���eK��'�L���8���i��^9P�)h�E�߻�,���}Կ�
�5\����j�9{�Z����r�|@�o+������؞����B�:��qf�#�2t��/��Au�l�'Y�۴!�e!��MĬ]H����c��+,���7�C���ߒ�^K y�Ww)(Z[AY�0�N���A��Le@'�v ���;�~�*U�w-��vFҭ$= h��b�,�sJf���q�		�
��̡�5\�������'jnGki��ˋ��^ػL�|��D0,ε;�6>�֔��4e� �{5A��j����#:+��K���B��p��j�j���[g�4�S��#�9	<$���<:�Pa���˪��^Z/9���Ʊ�M���(4ҟ{is��W
5l��H��ꋀ,ͬ�4�2�ݳ�ٮ�q	LV1����]=���tJ��	r�.�c����\����pf�� :�s�&5��S`v�Z���f�8ߛ�(�K�>_ӣ{\,���I����\"�j_����TF��%^]�<K0g@?�Q� �2X�]BXί��b�)P¨�s���S�b���Uˉ���9;��8�����oa:|S�4�$�)�d�VqSh�+��v*7o(��?��6$��o�,��#�WY���%�u���@=���)έl�:��;�F78<y���HZ\<�Ҧ�dJ�4$�Em���Jt���1�d�"y���,�X���c��:�C�`�/Dk[++�6����}{�و�T@9�<���Y�p��ͧ;&�����t����|. Y�1	1�Ey��wέ�UML;�R�?�<Yq���E�X�Yl\	�{�>l�ϺNE���7�}���ɽ��؏�7��N�վ
oS������wd2�z����E#�O����(�:��P�	-�FKiQ 0]����mB!��k҆����܊s��\GsLz��)�K6�����l�]$��!�m9aF�N|�������<���mC�jt�i�o-�m,J�
.��Nl:�~W(	*��l�%b�Q�:�����_�!JCX�T���M�S)j����N~��5q!_�
S�F�[���邲�j���T�˝��+�-w�L��t��5��T4��@�?�J�iB;Ija��^0��:�vY�%��`Q�$�۫�O
���?�B	g`��:����Y�m�Qt��>�`h����������Ը��l���O7Wo��_�g�8(������j��cGzA�����Un�oѶ}��{}���}F�9�a}RLL{��1�a��ym�[B����+�g}Չ2��iM��.�d\m����q�Pe�ވ����o�Ѵ�h�-�5
�Lf,w��.�K�g)������yD�[�b$W�E] ���)�Hk��V5�5w��0c-ti�$�^W�k�����W��9(T�EVj�PE1�*r�>�c���1�YQV����E�#�N�v!�t��u1Q���di��D6��H��ʿ9Q]���ï��ݬ;�AD(��`�KN�0��F)@��ۜ�ͤ������!�T�9���ܝ���'�k)�S��ǋry���#�\,�*���1k�2��yV��Q�_kK~���6�rK7��n�tYp�{u��3�Wǝ��Su˿Ц7��Ru�����/}�A't�/�n�+�"�y���C-�'u���:_�>h�?��͠6;�/��A�LR���~j1ӎ�g�q�T�5��Az��9n���3��.��m���k���ދ�f��>��nj��"�rUy?3Ϲ�������"�E�(/�PCE����/A�2g���x.u��8k�� ��l��(a�c���Z�ϗ*�e�Ř��������Ag~��M����d��ƪݸ��mWż��wCaƨ^IN�� ��Խ�s�Q*�Eb1Vک�ND���4�g��?Xx��h���|�UG����u/�u6��s��S\)��NklU�bR�O��p�q��Or����Dc8�d�I�"R�cфΠ������~�-p`�h��^v�^��$[�j�H+�=J��D���$HeE�s�d��SX,+�ȿ�#�_�VM�w'䭬�{������j�k�6�q��e5F�{�+�h �?���G�1(�4�Y8�����v�7\.��f?���/���+���8j)����M�y �kh�+�����I����7ىU�᛻�"����������{�Osp�@�_|
d�3�P�0 ���Ͳ5Q"W����	u����`���e��$T�W����ec3k�4nH#�\}�i��펮�q�#��>Xe��*J9B���F����!���Ս���w (�a�N�i�O�e!V���#�����e;�HA��F�o��O��<�]�(��w`���&z?���pZ��9�Aw��x���Ff/Bđ���}>2JYXI�\3vlgBra(�+��W��?���ń5��j-<�i��;����L/�����v#FƔU��2�Nd5 
"v*J	0~)�՘aiJMU�pg��� �,��|�M*2^�[@.9˫<�q��;C�m�ً����L?.����o�߾�lD�Ɓ���rd�gKb���v�z�$�#�~$(>����k���p�@rۀ�~j����� L(y!b�'\WnR�s�����G��/1������C���nd�9&'��/��D|LT�~�Z��Ǫh,,% �Rg|2u>�^�]��h[_.�"���V������V)T?n�i{��|�-�4�?FM�t/�,�!9ZG]�����{[����C}�v���w�kw�޹��C
)#叐FBU�XH1�E[qr�i���c��Zu{Z�C�k	�O��(��]
�r�h�X�����1 ����+2���u�o�xdQ��� �|�?Ut}5V�5vBi��1��#Y)�M�9�
��F���RG�����ޗh��������},���?C�b�H4����ZΓM9T�쉮3�����R���W�x��i�t�3T�Y�_�Z��m�3����Y�h�F���s����beԅF�������r̮�XE�5*��[ւ����傢��a;3�,�N�x��ƀJ���@��E�3f2�W9ϧ��Ə��0YhS�S,-d3���>��uG�4k�`��pi"�X 
n�6�e�~����+�$O�r�X� �X�t�)Y�T���F�:Q���R7W�ϙ�!m�;7���A��鬽��F��>�"�0h��R!��	��*]R�}/nn%��0,C*��'C���(���v�C�9���.�����go�1<�+��������d!�F��b{2�W�ґ��(&���>��ʠ�}M�9h����
�<&F���y�[y�m�f"3lDs��A_��&�k�S��z�}z81�ҍ�����.��6��6�t����%��r 곴�9��1�nE��8[�*���O�'wnU�Ut��eF������E���;Ԣ1NK�`����r�e�}�2f~Y��r�Ӄ�de[
�%z��2w�����.>���j4��~^�9�?���� [�N�
��Б��jb7^Y�{�(w�"�G�����֒��.�Å`SZ��F���;*�˄8s�����9 {�@`+�����DQH��U��!!��0��.��w��%��r@钂�@B��?�ã#�C8�䈛�[}i*ᙆ�hY�G�R&~��Oc�m����%Yˑ�z==փc��ܿ�<ߥM*,�ި�u���'���#�����9���Gb�� ��%�eMf3����r���.��P�
���tl�?Ӈ���w1��4[~So�v�Ɉ�o*�P(އ�5��Tj/�'fa>�K��Hf����Q�F�N��/�����m��i�{(�X<�"�v
=8"���W֞�΂[98��(jB�X��_���������M,�%	F!�Ҳhݲ
��E��]�=�A}3<=]���^�:�����)�y���_ޖ��9�!MAi�o�J2r��<���� I���!Ƹ��3P���󩄷�t6�%S
�c
|�K��l���KF��T��K~����==,ɥ�(tRthh�`�\�d�#�v#,EG�J��i��;R�>��<����C�&����w&(A,��6���E�(��f��+��?BG Ծ��>���ty���x$�.��f \�1��B����̉#�J�&<�%�4��6�H�(���妵�~owK%�F ��?�pQCj�E[ؗ���iFL�]f�P��q-���5>on?���3�d�z���7�~7N��j�L[���ph%n��]h���h�`󠟑�\M��ѩ���a%��Ҩw��I+��B>����4���`!ٔ#�b�B0��Z;T�ž���S�ٖ�հBD����d��Ac�#�8��@~�yMa[X����v�#���i������{\��;��J[�XobRK��?wB���z
}�-��OF��9���zVV���L�	��F�C�%��б$�)�}2�k݊����*,�"��<!�?�ڎ�8�*���=�s���u\����c���W� :��b61	 0���Qn�V}�ë<�L/"ca�Ä
�6x1qo4�9��_�_��ݥF+�����#���3~o����3���6
�C4�,�k�&.#k��Ȁq�Ԏ�j�e��m)�����KV��:�P�s���~*|E�F
�,c�MC�]kk�WHCF�@NO�A�bk���Pb�ڿ֪��7	�>��@fK P"|�{�4Ô�S�"T��� Ly��R!/���XM�L�$������d�5ք}�խ��WH�Cf�ag��B�	#
�
0�
�v^�6�!F�ǭ�%��2E�m���c�XȫPY��/�!�z��;1-`��M �2���dhE$�R��<��
���Ҝw�,��$�:��C�1z"���8 ����(�,�k^��$i��$_��vK�l�*ĨzX�b���P`���)�7��̂��*�������NvOq�D����/K�1ˏ-$8Q$Z����`O�c���� : c�erhE�z������3�?9r�5��֮�����hCm��4X�Uv����Fb��x�$�
�)*�2�b{9)��7����nI6.�ӻ>8�
3#�z�T��az$��g�Ap&x�1���Dy���Q�	id��p� �GK�u��Μd"�20t��VA22�/�ʢAd������=be�S����\�t��/�m������6�?&YF����a*��d~�8�Q0t�jA�h�#��HI�v�#��a\�"��W�rec����U!^�P�	ʋrjܭUMY��跶<}�����b��x�Qf��^]����[�v��s��f�=�O$g�꫆�������>��R��V��+�!)��9�

?�Hd�\F��X%9����|_��F�B���Y��8���kkK�r�\���i!�W��k���Æ9r����*
�p�\z_-
݁�KA���-E	?Kā��@��_��ؑ��eō!c�/rf;���P��n����$�\�N�#W�JF_x��~�:/�Es�H���GY��[!�_&.R��<�a��0�ܰ[������Z�����4FE�\4��B��M}[�X���0�e�1Zʚ����ڒup���/��7�^=�F$���"'����U���oiZcj����-o^Ѱ&G���n{̬C�b��*N�ʦN�σCm�d�)1,��l�X��"�ez���H)�Y(Q�n�;9����� Yŝ����\���܊�y������%E
(h�%5���'��n��w��$\k�<4����b5b���۩�&u^��('�V���]U]UU����@pVN� t�������o�� ��I;��`3`@	��0��P#G���`�	}��"D��_r]�ú0����<����w�ݘ	�}��

��,C�?������m��X��W�r���yН�I��g��sN�@�
lt3�i���	�+��;*4T�?~vl���I��ݐ.'��OI��e����U��]�e)Pɖ�Az���A�ܶǲ�q����~!���n��z0J+|��J�wO8B:��<\�0q\��Pvҙ��A��xj��h<M�����:�45�@�fi�_�R���ܼzh �@�Q�V)u��@�w��+�Z���O�!X�+��%�
�BG�~c�=J^�W_�y`�cx�۫�M2B	"����ٱ'���f6�k+��
�4܄�3G^��g��ܐ��t
>]�����'dX�'��]/����k�Zȶ�?
��uX`W�h�;|Ɵ������fW��{g��%���S�!�����R�^��i�����EK<��JI��r+6�.���ڦ�u>i�B	ã�Mp1�ZI	�̀MF���J'��b��:AĬ � �E@-�LWVZ��	��hQ
qT�PG�;�~1�B	�t�.iQ��`й�-P�/{jle)�.k���~"
19_پ�k#L����xS�IaGS����,2Q\����i�LH��W��nz5���,��y�A��c�7�Y
�/��x�F�b���QD%�|�q���!�;�4,6�Ŏ�\�������5q|i�	~[fiHN�
��a��ŭEvk:��Mw����������-����k�e���Ϳ��Ra[J ������ↅ�ҖA�Y;[쑯{����DҮ���bɾ�_����y�B�3���%	�b�\�0򉩾�",\ӈ�b�ò|ă���"� U1��v�ULE�;�:�
Q-b��6��C���"	�'b̑�{���{���NY.?��) ��6F���L�����H�'�e��ԃU��e �/���OX���ܠ�v��,�f[�ϙ�i7��:� ��l�(�.H�
y��'W��>�C�9N�ހ�p��#�/AK��/M:��c?�j�s���
�9���W
��:* �`X�t
�$���a�;4#/h����D��>�e´C�<�p1w萁=�5i�q)�Z� �0�# r &̈��3�
>�e���) �H F�K����+�^��[9OU+In�Y��=c��&�f�|٬Ƕ�b��B���T��]���t:��ͅ�z����X/ߟ�Q�$^����$ֿ!��������OC�Wd�d�:Ռ��>�@A�~�A��]F{�V
>SHWE3��`C~��4[6 > )IL45���{����Ux��̐J��0��~|�AhP|�������[�� �R�XS%�u�N0�s(>�ƶ�|��7�Ћ9aH�@Y��R�4K!]��T�d�t���1��>>~�ҙ[���4���:Vb�њ|p���f�H�6�d�<��m�>3!��L{��(�?��5�PD J��셀%_B]U�%Jl�O�ˍ�����L��z5uٔ!j�f՗EM����D���[�w�[�1Ne���O�B�*e�+I�#���^�}�����#u���\���Li�d��'��ND��#u�[��Ő��p��Ԑ�̬��~��7�^�a�L�ۿ�j4B�C���S-sy<�h����\��
Q���ik�4�N�e��PA<w�.�Lz>{��_�&J�:������q}aӡ�Zٞ��*��LI���d��������i
��b���~(����Awd�̪�I1? �	ͪ�o_5�~6� 6 ��2��D:�>2��/�T-���dVhDJ���V-͗��F�~#cL���fT�@������x�ۑX"1 0���M-���9^��S�INChh���0N"�+<��:pO�L�ŗ��ې�II�H�1v�f?7����8P|]�c�k�.�e�����x���f?Ց�XD���ËH0�.�!�S�rq|7�Ba����HV8��E��q��䫚�� �ˊ��X	�QXL���D�u1��s2?�N��n��T)*�����Q3(�hK;�=e<�������&  e�G��P�Z��7/#�H�|�'�HN�T�`Z�!9y҈oG�z���h|0�1`��A�ɜ� �{(7�������{W!Bק�J���Ow~?;Z��8�²3NמaI��Y+����d;@�r\��aZ:�I���Wطz|�c�J�6�N���;v/ϕ�O\JG17�Q?1�z���$��y%M��"T�P��{!�� �B�V�=׭�F�%^��+�3G�$=��EFk%�'l4!���
������ai��BRY�Md:x�z\���'M�
۟��+���k]���֖pD�B���PG��
���U�Ḥ歟Z9C��(κ��07�(L5�4�hf�/O� 
r��]̕���J�;9��Ǩ>FU�(⠠
!��`�^�=��7�&�Av!Ð]<���O�^��w�����U�B33J"M�<�8JJ�����-m�T�K;�Ol�X��4r%..9��]���9���^OѬ����TӲ$\�)��
f����4�)7_8n:��l,�P��x�@.Ob}��1 ���3��*��Ŋl��R��&q���ٛJa<D+X�cJ8V���1����~l��q���"Cπ=x2%����^����a�4�byL��_�U�d�K�čs�
Fߛ*_F��@��0��]�/d�Q:��Uf\��X�����H�F����q��**��_rxByM�QD�·]�*%L�T_5�j�p�Ҕ"K��Vn�Rp+7z��P�!�5���	K�4ԛo4�WP	����e&!U�"�'M����Hr�_T�Lv0`�|A�g����`k����c� �Oy��u<*�>'	>h>�>9^�3�/����SY��0���F����}�`>b1��4��H1��L2��3��6t��42�Ap]�:�IM��5�T�^I�R	6��߂R��-ֶPb��r~D�xQ�t��u�������9��&m���j����J���50�'����$�#�O��  
~�+���O�+S�C����jU�nSev��%��
Paht)�!I�,q�D������|�_����K�LBPAR�YTu8���`3p��g�"��Y�2uR ъn�t곤*���CS��w[Ƣ�%���\\�-�m��I\��F�l3m�VW��
����^tR �(/�zp/I�D� ��LJ@1K���T��F 5�xe�����c�z֮[��)���ᶔ$��O
ԃ.�\�h�ȃ��w�(�
F $�

   
�&�%KM�WCd�J��g��003��\b��N��-���gN�{�)nMW	G������X 𪆙��a �Xw3P���ポl[���+9��'��9ȹO�W|T���  AS�_��q�:���v����\�O�
����`��/��
�	�#��!M

�����5�:a��mg��S�j`��vz%�&
�l�t��ט��?OL�W���.�L���8e\�M���t�t����jʚ�Ӭ�TUϑ<Z|yٌ�3V�B7���lEOK���Vi_멵�5�:�Xk�������w���}tW݀�oR�����=f+mνWh�o�����`�C��M�N;g^�@f�< �G~m
)忘�6u�!U�Y��$�ma��b�(_:��eP��>��=�p۰�SC3^n�DX�?�]�#^^����o���J<g�_���^2X_�܁T�x�?��q$�{���	�[���W�h�?� ��jRv��WX/�Ȅ~�c1(�:a�,��k��T�QH}ɛ�mP�~(I+E�Y�˜�0K�̹V�^��ۊ�Gs��]���9y���
�-�g
�Q���qq�lr´3%m��)�(����旛�z��۴�i��'�Ʊ�~�����TFjbG�=	J�(;*I���eK��h�HV0�Յ�c����6��4q�*�+�/����|����`��ii ��(!�EA&�v'�M,����J�P�*Ϥ_�M�qY�0��DM� ��<-���AYLXTШF���W$lz*l�1 j,�WDm�dm�w�B�*T��H1~����ӗ��l<�OW����}��H3'=Z����9�>���r3��m6_���x��ٶ��r��a���ݓ �Q�s�
*���j�c�=.�Z�Kj���Q$���ׅ!�#�t�V�HM�]�[�]y�x�y���.�=ͽY*��w��\�}5�������������1���ʕ�䚶���X6N ��8��b��Ű�Qe��p��V�jf���)� ���F�Q)qb\[��Ȯ�	7�Lo'��|-�Vgs��zĘ�?������~��2-�Lh�i�0Hq�MR}�Խ܌d����#�5�p?@4_^˾<|&�h�J��j�[�#5�wP硊T��� ����u�g�i���d��=����#��'m:ω7~`�@|N�#��$ ���a�DdL=���aR���D	xN!m�� �͖٦@-
z�$0X������Czi�Bs/wxz=K�q �II���޻��ݑ�>�۲�+ke_�A'dg=�mLh�HEK��C���"Ui��#o��P��#B�|M���8Ek�T���{���3��E١�Gn� ��~u�547m�f���`dk��Pw
��V�&�9ǥ�����e�;��(���%���6�#�_9O�Ar"�y�V����{Q�Y�sp�m�%�X
rG�|��}?]h#<*r9�t��3�� �S��:j)q���.�)���&��� �ٺ���I�+SŁÄ�XJ��%Ta��T� {5S7���4����/)�Q�r{��{շ�H��Є�-q!�_��_����i�W^�k�;cR�[����݇tt�L�l 0a�4y�1�F*ӘW���!�]bk��rf`Ⱦ�ːk�
9ۢA�G}�ֹ��%`4���;�2�珅<r*-I��ǅ�� 
���{dH��	�3�ٖ��D����Ŭv�2ʡ�o��`�_�9>��n{g�6����RM�~;�ubS��~�P�l��쏟�	y�ʢX+��}�W���JG��V�4��/��/HvR��3��o���k���qeJ��r[f�z�/P��3�Z�G���|Ջ�R=� 8v u�v_B`���kRs_�1X7���۝�W��n����i��C�q.�!| j\G[]�]hL_P�[�ƥe��� }i8Y�]�GY������މx��jYQ�߉�����TDR8n�~�7F{�75 �S��QC����)F�c�
p �7��?旣��o���ɽ�9տ���ˋH�d	'�0��I�k���G訸�<��7E��y��坞c8��R�AQ���1���
J��$&\���$����
ȓOZ%gG�_	���Ə`�":<b���4��ى���oy��.5��+�g����T1;�ĨJ�~bBT��]���z�Kʅ׷6���j�wŠ�X1���q�'��m
B��H�7e a  l|%�Lد!�CW����L�ic�	��`>i�:� 9
��
K��A�����]�ޫ3�AB��2�?����6�USYSbm-����t4df���n�է����f����c��9�y)�Q�۰�ּc�uT�睭Pzcf�βt:��L{��s/Q�d�а�B�*�ahW�0���	`0X�I"�N��+&b B�ڠt8�IԔ� ag�wޢu�\��>[<������»mGi�N�2�Q�ww��6؍o�Ba��N�?���kEŸ�̃����_��13������W�~bLB?����Ah�`P����/�Һ��Wڒ�1�Wj�XU�i�v������C�`A���f�>���ó����ܟL
P �b)�F���������6�h�!�hI��|[��EΈ������?�K��rTO_	/i�����?_Y��y<|+$�>�`&A 7ғ�"��Y�̱�X&���" �.T��[�l���ێ^g�S��Ol�i��V�)�y_�w���8�7	jJj��t�>�gL,�+X�/Ԅ�� �z֮n+?���]�=���MMiAHq��ߑ����=�4O�!d��f�����+�3����5���Cu�r>Ir�����խ#/�o���뽍�y��|a��>��.�D�k��nZ�H�P!��Z�	�%!�Amy����p�����0�mƐ.m��ṿ���jU�=% �vι�?6���˨e4$��K��ܸ����7��7'���뗕oK�#��ȠzD� d_���9���8V]�/L�.%m����Z��@�PU�_VD~���)XQ�+5]��6�q}��#R��t����k�s��9��R�� H��+�I0:��(��Kv�P�'VW]3�!+�<� !5��q�ԥk����ٹ���9-��e!�w�?*2E��V��^�hM�Tҙ1v�U��ӂ%%�>��fp��\6�0j|�2"mg<��8��N0���d��o�F�1���mu���_-O�$���/ɒ�  :��i<~4�f��
����V���>0EͲ��S/�����Ǚ��#^���%XH, ��bq��@^ �d^!5��JA�����~�'�B8��LwxĚ�G�+�s���Z ���2��<��6Ta��JK^�����0��QĜA,Q����a2б@��Ì#*�o�͵eH/(I

�I�J~G��7��W@Pg�W�] �_:p�k���)]T�bB*�` �D"M%�4A_�J�#}���X���OSYv#,�Z����,�������$�τ�,�  d��E�-X����'ۢWͬt�����x���2����ah��+F�KUvl#@1Y�.8YbxM'jO�����y-��OJ�w^���g~k=�KX⚺�Wk���X�?[3h�P�pvB�o8�.mG)X$�:�&N�L	{��d���i콁��x��Y�"|
�����RՎ�$��D
U$�97�����7
1/�eTNr!2=�6� ��-��G�k(��ª=���@��˿��֦�%���j��O:|[��OΟ��{�]�E����~*l�6L~�w�\���,f��
`@�vs��d*���a�fW���~U��6�ds�}��l[w�`��0�>���E+R�Ȑ�ar�H�y0i�r#EZ�2��&�ʾI��^do�"TP��ݪ�ixӽ�!��P��[HWz2�oXv=�o���}�a���P��Y���(��]`;��jn�㓮z!) ����+]Q& �eS��bR�.��]D�8�Kk���<ɀ�r�Wܿk�dz[�����mH�zO-Ʒ
s)��B�	U�tUY��'V7n&�t�<j�^�/��(>�0��g����M�;)������`ږ7�����1�{<tD���z����79_�����`�
��$w�Q��iSjJY��I�(_�t��ٍ�����'W�h�E���[T�;N�>�F.�[�邛̌e\I�;�cRO�pE��L?9l�����������E.s�4�X�a\�j�Nl�ƘH��+���ë��3���ջ��e%i�y+T�Wĳ!H��aD�+�qSz�T�3v�2/ l�u7"6�BeC��ɸ�c���[kM�=�
���	��/
*z��Oԗ�~n��ʾ=���;d<�.GBg������df���ע�&�S��3���0#i�)R�=��Do�+�A!aRS�" �k%Q$Y�_h��ih[Q�h"ܨ�=��@�f��G���Q�{�d��1���/����5V��<\�S,*���s��Y����"^�yb]�4�9&2+��`s9:�z쯼6��fQ��)n��#4bWVڴWf�/��щ��4�(i�@;K
�R�2o%��(T��N̫�6ە�'Wt�R�D_��D��*�2�n~lE�eT@� ��v�*&n7���5H|�/'��=E�q�^h����/J�ː<!��T�z]P�x�� 6� �%����d�W�BWM�`����B��>)�����8�q�(8&lh�ͻxc��g�&`�(�PI|z'
x`ۺ�)z�
퇈�Ԡl���7�^=��e�
�*�˥~)5�>��#�9��d��T1	
ZK�X���M#"���.j���'�qU��p��Ǣ�56.=�i&ۻ�a�^�5�� ��A��y��B�W�8�,+�#��]T��&r�����"W��3<��M��S8l����!ߟ����t~���  @!=�P�b3�.T[����r��y�U�.Q�R�/��tY�"�KV�2�`��������^�w�[4�>~׶��
�'Â\�-��7N���i!;��li([�#6뉠��s����e�i�P�h+�T6,^�����cO�g������q54�,Cr`��d�j������&��S�Rf� ��,x����s�N��X+<��t����#ߊ����ւ?�_ȨT&��iY�OP
J�,>4��Z��+��12�_��kt�h5xhr>�"�7�y�7Z���8�48Z��_~RM:y��J�>,��j1+-XO�rG����1@Q'�����!t@8.&Ʈ�H�<H�tzN����:���]��nw�X��G��hC���Ƭ��4��$1b�X�����r�]&�wj]��]MFf�e�J�3�Y���m�ϊÂ7	���Q�_��C`۹Ӣ��2��-��:���ژPP� �
YتzjzӾ5mm�r[+��9,CdK��}%���������9�
�3�uͿ���^k�nA�6���®,�`��0Z��l���ќ9�-By�r������|n�WN�v�q�?���h�vQ�"I�$\Bd���g!���P�KD1$
 �!�Q����E�,�$���K+��8O�X�շ̿g����m�_/��_��i	�{�#ȗ�^�jbV]mŮ��,��<�
�a̹��'l|���U����X?��2���2�J���&&o$`m�a�cp����teq�V8k�0�%���Ǣ�2�t
z٪;`�Om>�\pH��}<��M*v�4&mwۺRsT��b�6}��u��h'6W˿��b<Ԫt����"���JK8�� �9�@�a]��p�F݃�}tT���&8��Z���/~�����������yM��P����\�@���6|+m}`)XӀ��?�=�՗�.|���DS-�;� 2��U����t�$Oҗ�h�ej::ˤ�6����k��*6�gK�{~ȝd3%ʢ~��Q�iUo+,_���)�YΣGk�9�#�䅸h�����\\Z"p_�&,����Mί+���I�{�����"��@l���A;Y�.ކ�5�'R�D��/3[���+K�R�st�Hۮ�|5�NG>7Lꝱ�z�闖/��Nn�["
�� ��L�-g�c�1~J�0���p�ȩ'��=�q���g�t\�Mk�����h��[��
\�R~c��h���(����!��r_�zv��gE���� ^� H�l���� (*�uyXl=�J�KH?T��|������8'�lw���䡜\����
A�sY��n�`�8E*���F����G��z���:��鋣��	n-	)�j�:��'6��Â�[��u��x� u�,-H�~����fFj�����j9섵��o�I"��)���!������Ǔ�r��􃡀J�M��[A���U�75�����>�UT�E��߳F{d]ȫ�? �a�!e��>L�#+�>+�>8��_�<'7U,{rr������h������J�����L�UA�"��D(�e���L���%)^������������'	��u�1Op�P�_�����Z ���eI�xrn�Յ��^�`��~����?6N��Gܼ������)�����௧i ,,ymRx!��k��ǟ��¬]A�fnܖ��Ws�%��d�4ɥ.��B:^���K� ,�5{:���)�}f�RÚ�� ��3�r���DId<`7�M&�Uh�T\_�g��4=�]K�1Υ�Y��+d�_XŞ: �m�_��`� " t�9���C1�@�n����Ą�$oI	$�E���@ն|�Tg��)��R��{�����Q��	l釧��|������1�4����Os��BO��c���r(����m�',2��t&�y��!Ff��x�l-�� �	Rvͯ�%%�'/?J�:�,dd�@]Ҽ۴���c ��	p��a#W2���
��X�q��qVI׻���fHg�-���;��{Gժ�J�'D������#�����(Lg6�ȧL�ι9��LI���̯�بX5)�g)K�Y���/#g�<��t��)��� D^Z>�Z�*�S|�z%$t��$)y��[����h(�R���9u+~�HCJ�ޕ�}B��B��6U�)A�5�b�q��{~�Le�AKQ�A|}H�
���e<����́�=��}��;ӓP��}�LՠO��٤��`�#�	�~a{�*��oZ�1��6E[�8���9#OΖ������͜�~D(�a��K��=�d
Z�d�}N��ci � E�H0.َ
$�jE��f��!�t��!��6��D�<�:�<
�d�H]�*�B�IR�G(�L��g{��!ba'b�L�`YS�,
�q�M��hg+����o��ȳ�*j��8k�\!e7��Z�&�6/���E��/������T�TWנ���ug���(b��1�}{#�v%65��n�()5��P��m�<*r&���4�ŤL��
��p��|ce��a��FxI��]Y������kL6����=L�p�}7z�/5�]�7]5tu �?��,n 0�Yk�$|���y�Q1M9u��$|��a�+RS����Է�jN��<p-m]��/�{��J��?�a|�J��R�p%���"Uk�J���.��3���l�
Ả~-
�$K���O��]�?a"5
�h�
��
vE�Tw`Z�c��{iI�=���"��o25��G��<*�?�$�U����c����X9������wM,  ��=p�}ۨ���4�k�՗�Ѿŋ���*����l�ܢ�fԧ��α���\��]
1�!��"%�5+���̜��p�qĝ\�&��������`�OO4!��0⏩<��5B,;����\�X�����h[�έ~�����Ҝ;�7�_�u����ݝ5u�����)�y9�����ݪ�W�3:�]�i��2�� 
[�Z!]
��7������HG���~�&�w����*� q0���
export declare class Server {
    mdns: any;
    private registry;
    private errorCallback;
    constructor(opts: Partial<ServiceConfig>, errorCallback?: Function | undefined);
    register(records: Array<ServiceRecord> | ServiceRecord): void;
    unregister(records: Array<ServiceRecord> | ServiceRecord): void;
    private respondToQuery;
    private recordsFor;
    private isDuplicateRecord;
    private unique;
}
export default Server;
           ��*
S4ڥ
5��bd�}���w�8t����k�n�b9K^�/�e{x�.��
%!s/�z�J*%q�4�F����9tдԔ�Q�gf]��M��*uF�LQ�5�~�G�� 8������IOLx�3^;v!� t'[^�O;��ԫ�b+^�e�7Zu��K�a�q7�~n�wm��d*N�����K���״[%?6]z�DL�=�,�(#��
 
�dH��NQ�?FgDT�����o�#dY~L�]U�\�B��zSW���N�|��e�#�����[	�=c;�A��<��+�O�R��:'գ7Q֢�dQ��MV��cC'aٮ�L*$���Do�Q�f��,_l�.�:�`�E:_�Т�Ρy ��e��nh7f`��Ч]��,�3��X�z�oҠ�
F���Ώ�Yr�8�7��h��=?|z%�x��vX2�V�'����;����L����� |l�/���h��{#Օ(6�w�sz���b�f�^�B<�4�1��WT`�{�l�i!��(�E�AV@���;�󙋾\}4P�s��EC�������ݡ�M�;������lI��9A��q��C��4�Ѷ��}���Rs@�,�	io�Z&�&^��4+ �A����3�����5M�Cm�,�AG�%�������r"*bR�z*�_�l���sω��5�o�eɎ���p�A�X��b�̩�5�e��n��9�y�F�ibMw��E��WD��� �3̾i�)-i�[��>;�^@�g_�n��}���q
��;PWuk�0�������p�B��ĳ��x^���z����z���~1z[8���O�q$��N��O�e*��J������
�Kn��a���oa*��;q�-�o?j�>VȝҴH.]N09��:6sgٷ��3U��{��tzy��b��"�S�#�ZE!�w�u$3���C�TM���4 �'�"����^�$��Q����{*�vm�gc��d�G|�:�0:�6)��q$E��c*B�8b�߀����WPX�� ��@�q���왏�b?-�5�[�z�2�iN#�Т��:��w��W�t�[N�&F;�7�e���%��̏�լB+I�ބd��Q�	9 0|RC!
��	I0�'Gę���H��۾�\�D���45&a2sKL"(�Xj=T��x�<*4l�㛀�EE ����8����/�tb؄�����5Jʔ��$�R�I��&䬂�y�x�J�V �JSR��ST�!bLlk��{�
Z�9�|�	:���� ʚ0M��z2tu���Eow�R/����c�OU���U{}�
-���[�ʛ��U��E�G��Tc��L���`�����-��ߨےu\���d^��EJ��W�𖸏��j�d4MG�te�x�)�G�a�$��o�S�#���/Za�K�J���/<_XU�Y[YW	eT+f��� ay�Sh��|��l�PӨ����Ύ����4�0��g�8�~#E����v��Q83���S��$*8��h],�ri�X��#{5�� �~�3$�Ո\�g?�>y��Î߼xkF(y�,g�ɼ��U�E�����Z�]҅g�"߿?�!�YՅ��DF]���:����S�$0zw�+�*��I�-�2�|aZ�i����%��Iݗ�h��	��?�F	�|s�>6�-�km9T�jHe������D�r_����&!B_{c�:캥N���lkD�?w4wZ=�&&�b+�5ڪ�Sd�A
@p�ݖ�?=����%���01�\j�T�±[��߭���3��F��Wi�,�b
C���g�u�$���Wxd��!�|��F[@9S~ �V!���sF��R��d������3��4r��/�:�*�6r���o�B�235�/�4�*��S�o��w�	��_�G��/��k=
.Y=�х'R_���h2e�*H�?�1K��M���uo�J��|	��8jA�>�d�h,O�Ya�����
�����Fr:2��2���B��_���'��n��et�f����Ԅ�ݹ��T ����-�ȸ�h�ܶ�U���>Z|R���Y�,�k+t�������
�G	�\��C��l�Y�B���Ԅ�M�F��ai7
,�Y��Ow�g�0�R<ɖG���^�W�
S&����~]2��;X�����$��lkK�Q�4"����1|I&L�X>:�Bѐ��6�̧Lwo��9rg5�BCd ��y8��
z��Z���w�I�!�L&�<՝��tk�{��7#C���eU۵'�Ժ!��lf�	d�>��曝_�O�=';���k����]��B8�߹�A�x<�1�����D��{����v*.�1iJI�C�"?���սG#d��f0E�ѓ
O�TB����o�k�-Z�N�����2ݱQ��y���v��,�/[�"�ݏ�/m�
?��p��ù�%_�B���,wѤ�I?
�{��u9T�ǰ�>���K�ԟ7��%������z�Z��X��'�t�ܢ�!S4#s$���h�u��ǎyp�@'�|9+��B�;�O��8���q-�����mJ�����m�oɈ�1_wY�ç�7
�ؑ������䵈HT%��!B#����:J�ⴄ��YC����Y�;�����땡�y:��0������K)��������z����^�(h9	Z��#0�W���d,�$�1���XA�4���ʟK�;��ژ�V�<����1V�] ��X��� �t�
mFo�%bJ�/L�0W1��*C��K˥E�L��	ztq�Kd����-���s�(�/.3y6;'����~���&�����yM.L��Sg�h�����(��(�ҥ����u�����_�9e�3`�*�~������k��7(�t6�If���(����Dx�Pl��ѱV�_#BMk����#� ��-#@C������E+}�(v$�xd ��4E���Vdb����G��p쾹?�f��!_Cd\m��hq�r���#�؈)?/h�V��J�I����^�06a�	T�������x}�S~���+����S���Rqj��	�O�r�mc%��k�3 ���i�؎��K�Ac�}qD* !]ʹ�}\��@�/�2.��L\����Ib�\�
����~JE:�JV4O"��*R���F��u{JV�������W�A���R�h��#�f)s���D\��p����V!�ma�S�`��4���z̐�9���'d�v���2�S�9.���+�ñ�����Ca<�(����^�Z��޻�������|=u���ejz�4��5?���\�z5�  ��������hR3ߍ$E����8GD�.��8bg��SX�.���:��w|����?ћp@p!~��ݓ��vk�7u��+2�j�����""�?B;�ob�1���&��B@fH�m[%���䤅��P�\
H�h����?c9�0ԿF����n5a��%��ْ[S�綢�*M��-�"E����1�W��4+1%���1
KV�,�Ԑ`�²� f���B*N���
o[(t���FB�L�pI4�d��r��h���H���ޚ�/�oΤ�������n��� n^�y�ӫ��V
�_����V��>Zi��}���p��.��������-����|-�	+�I������K����,����u�B��ԅ*�)�^Yv�=G��([��#]�{� �+r8	��I�����:i�ǖP�8����!w ^����l:�I��W��7�5J� i2dC�������&J��V��5	�����(��J���y��x�y����mEO߅���h�kŪ6���ޖy7�[�\U�|k�vu�Z6(
g]Mw��^��ϜW&��7���*�!��J���)�R���窎y� �]^�c>j�� �L��;e�K����#I�*EZé�
��;�E ��������r�CތV��н���,���3��7%������+��}��v���m�FG�:&>���K:��?��rZ�k�z�]� W�{
[;������=kkY�,��ų'�"�*�A�a
V�"�ڙ�D2w����M/��l��6g�G�1Ljui���c�+ǻ8�Z�O�fA(��a�\�	�<�HՌ���ΰ�֞�IP��n�gy���Bd�ͷ��߾�d�d��mi�RH��}�ƀ���$T#p��<�J�4���$5E-�Ή&O|7�C�^�R�k#�t=L]�������/V���s�����$�v"����I]��G�5{;�9~^���d�Kj��LN�G�^��OT92���o��d��P��(�M��8��u��l�Dh04(�$�L�k�M(i/�`���CIÏ�\\dŤH[~YY�3D�	:��Orơ�ʡ�����靸�덵���~Ov���,n���������)���������
�"�`�y��ܴ����Е&�EX
H�yx�t�A路�
��+�H��ž9�2|ۄq�A��s^F5bM�k��>TX���T�
$�AI�70���_|�%*!�K����������06�E��%�n7/���0����Oc����iΫ	j�PǶ�����V�k���Q#k��09������X��g��Kz9�q�\��?�%I"��,����������DE��xq�z��B��^V�oY�WeVjY/ȥ%NO�`�k2��9����?( ��.6 >��0�s���0�u�kU¼�	W��W-^>En8�{�*�+�T��~��aFU���l�,G���Q�@��\\�t[���v�� �h8�����Ls�8e���l}I�E��-U�0�K��C�ׂy�)��.f=��!�z���xO�,.ĺ�}(?�(2�t���r��q���$ �[ڔ�#�U�N�	I�ҵV����2p����f�W�s$
�d=cZ^̈́u9T�U�`�r�ߤ+o
�,�'2-�AU�S�8��$#\ԕp��%��.e���-n:�@xGu��.լu�\���nO�?ZRˇE
 N�������\�LVY��CTa�M*X5�\�Aփ+�O�C��}"���g�
9)C�b��Ow�̝(�Bs5�&VU�i?au����|���t\	��k��<�%�&�q��*��� ���(L�?�ߣ�|I��'�ː^�h�y
bޱn�~�m�b�&S�
�e��}��!,����B0\v����1a���#����@�Y�^���M��U�\}꜐��w�8Q�a�p2>�UJ�2�*4 �I8
`�3��8�f�Ϝ5��R��,pIf�2�t<>������a�_���t��k42�����@�i�)e�����2��?|�(�/���;ﻄ���N��&<;)d�~>�ұ`�G��'=܎�|�D� !)�
o?��v�M������ ;���_ÜmW���>#���K��L�
��V��C0'3�eWj���d��Cķ�M�az|�w�VDj{�w�x��#a(kpQ�vũA�*Xs'�S1�v�5x�8$z݌��R�u�̭Kn&hb�-���Y]<"�&v(E7j����ЩZn�<���q(�M�����[t����c a5�[~��4������p��\t�?B2 ����􁰤���	Z��/Zk�4ͩ߄L��s���s��2��Ӟ����C�<Q8&KXU$��>s���J�p��>�:�b#{�(�����2�����2k.����i,��9W�����챷��~܏D�YÒ��q�_;�sI)Y��q�E{s�Y> 0���  .����D�%Ӱ�`jk&�US�Z�+�¸���7����	.��9!����/�
͖�<��.j����}����q�	�H�(������p{t���
e�u�!����C��"�N��W��	?ԗ4�\OM�*�X�T��k+0�6��快��HC�3��{a����ö�����iLe4|wV�ore�|�;s��vˌJՑ��l�'�^��*��p&�,��C��B�ZĊ����`�8�߲%��zy�BA`4"uԱ���Sd�'�ε,-�l�Vz���!7�z�`�#�
�j�;�v��%����Ҫ���_*+�ܗ���󯧀�' ړC�NqK^�H�2)���NC\�Б>�X�TEe%*�p�~:��D��w�p���@
#���w�kr]O�ξ�D'�7��ɋ��R��/m��F �d�Mn9�N�L�DF���YE�cVYwltv�"�Ҟ_ݐ�[D�v�A��k/�+�d������|�+o�_|���B+�Ɠ� BRY�5?-�:��O�y��� 9+ǋX=|_[BM�x�0ɤd	-f	��ȸ�i>|<a|'����D��'��.��b���`�Q�����Z�� ���6$�ԷE����\�sK�^?k���ן�x9� ZM�H�S
�.�����9�;�ۍ�����&u=gպ��J��u����d�6�6�s���*D_�g�$a��,o$�an&/�׀�??	+�C�m9�Fi)��v�R<o�
��������Z�hzV�3�+������G�*����_�ۇr�*jg9�H����tT.X��kB�0~y��I��y�^��dX�_,��_�?T�!�I�����I�wi0#K�Xb�XVDD�_
�۾�_�d�;�Uf�og�����T��� �'a��_P�9����Ð��U�E	���T��c`��sF�� �Eu�M�4��F�P^��xH���V �@c��"%[���R�~~G�!X����~a!u��[N�Ò�C𰼲��������|N̈��>�	ʎ�#R��KJ��%*��H\����4���"Lۤ�]�hɐ|�#L�1��0��oc|]�}eH�������>�y�h�jNރ/�=�aK����*�·t$ GW��e���{4����2��y���~�.������c&Iai�u6��(�q�qܫ �4��LV�N�D��;��5��/�&���y�����s�\��Ｇ
���X���D����l�hW�����GAA�m���6���E�qG�BdG
������"
2����TW�k��71�,"f3���+���<7�OB�$��Ԕ 0t�ǎ�2�Nж9�E�n��n,&�G��	�HY�;3;#^�29��1���@0�u��5N"�D ��԰hi}Y��ߟ��@�qjs�Z�(FD��ZΎ�V���Mc��]mS�/����]�Ni)J�"�f�k�6>XTu
��'έFj�"cY|���a�tpf�:�;!k��}�M��#]ð�t%b� />��� PZb`P���X
g��,���񻇳�Џv 4p�-q\�߱#�r['X�7mGp�>"6�WE�5�+�r�hmF��3��n\>�=�U!�o�h�e�pi���`���v�������#4��I�"�I�( �Ţ��%]B�1	N_k] "DL&t~� �����+$>x���躄�1��Jo6S�^���qJ@�=1c����ѳ�U��n �jМ�8u�pw�����e�ұ��
�.�P����xo��xMDzq��4���/#sZ|���`��M.���2l���K2V	B��_\�t�������[�,�d}�䌬�,�3џ�^I��B=	.��{*�F�f�C1֟�+�W�+o'��lnI��E�m�R��jnz
���)���}�'����Az`��:g�6{�.K�/���qv����S�F(�-<��#��A q:�&"��?�,�
��~Z�U�9�/"��
����4�1O�;�A�mJ�����p��,;\td�7�y�Rn%x�h���_|{z��G�����;g������_�a8�9�) ��x>�yT)�WG��Fu'��8�����V}�s3�}��8�X>���D�VK|�)dHj�Y������h�Q)ˏ�5�FU��D����\8d�L8
�
3U��f"�2�ȯ8{<�tNw-yS	
*�O�BQ�*֎��Ӆ=ּpE��6P3�*�"����|��B��	������9��]B5C�[�`��f��특/��h�҃
�d�{x��~d�x7ᖮYhm��
�/*idP�N�_1=��	j�eSK��
`h)�}�UE2�Pb`����ي=|����Ɠ��E�M $DW
;`)�z]Q��lP.������9|�h^OfNXF�As��Z����Sd3��e]�u��ݯ��N, ��q�&(��Ү<�I��O[J
��+�I�󷍉�#�~ I�Z��FU�����˚V
K0��<FJ,OX�~�.L>�I��}Wl�~[�|�S$���md�����Ӹ�Ƒ���卂
1�<LU����=�a�X*�쨝n�@��YSS�S�$��ɱ��7Y�v��y�' �����zeT�PT%�M��L���y�{$Z1��׏�ϭς9�3+HE���ⴉKz
���e]��M:\x����ϓ��w�;��Jv�Tu1��?#
H��*�R���f��.��z�!�%�^-����2�<G%z�+F��S�C�3���N(XbЉ�Fj�S-�{���^�y���G�߁�&L���SD���Q����ms� O����5�It���Q����FTzc_>��>?��+9G���+��)a�W�(�"�	���GR@TI�\���Ҿ��O� .�9�̬�_��h�-%��KP���Jm
����<��3fyCXMWQ=��l� ��5u:I�ɳ�;�DIt�R�Ba*$����W��3��k� �yw@��X�T^Α��^��'}H
����6���&�]�s ���谕�ȓ(A�kRu���j}D�����.8�r��M�7 ����)���#	T	)"4�i}jl����+���q=���-;�����;�ᚯ�u
��xz=���-D^�,��������?Q�ܽ�P�'�/O
�F����C~����Mቔ�:}�Y���!���]\�F:D|%*�.ʈ؋^_�U��P�y�LR��?|~s�H?��[���si��� =m�X�����t;�/��\z)NO����&pɗܰ�[3�N9�f�>���
����Ez[(9��5i��z24[��@^\)�zC�c�����vef-��n�ޓ��!���h�Æ�_�>�p�j�����D��,��`��
W����/��O
tO&*j� �FUcʾ��
}SBa�v�qھ���濵��#e�dW���Vli��`���R�}\����d��9�ek"�H�*Ƨņ�<l9�z�\�9ب�f��ݱ�vz�ؾM��t����(\bw�,�߼�N�(|��)�A{Q% V� ��!X�E��%���_�T�X�J.��)+�.V���Æ�k%�����o/QS�BGэ��5�Q-z���O�l�+�b����!�v�B"&@}�%��c��~���u��|��$0.�J��)�~1v-N�%K��#�`fݪ�}�OA>ϣ��7,  � F���]8Z6S���$�r��� QK1!function(n,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(n="undefined"!=typeof globalThis?globalThis:n||self).uuidv3=r()}(this,(function(){"use strict";var n=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function r(r){return"string"==typeof r&&n.test(r)}for(var e=[],t=0;t<256;++t)e.push((t+256).toString(16).substr(1));function i(n){return 14+(n+64>>>9<<4)+1}function o(n,r){var e=(65535&n)+(65535&r);return(n>>16)+(r>>16)+(e>>16)<<16|65535&e}function a(n,r,e,t,i,a){return o((f=o(o(r,n),o(t,a)))<<(u=i)|f>>>32-u,e);var f,u}function f(n,r,e,t,i,o,f){return a(r&e|~r&t,n,r,i,o,f)}function u(n,r,e,t,i,o,f){return a(r&t|e&~t,n,r,i,o,f)}function c(n,r,e,t,i,o,f){return a(r^e^t,n,r,i,o,f)}function s(n,r,e,t,i,o,f){return a(e^(r|~t),n,r,i,o,f)}return function(n,t,i){function o(n,o,a,f){if("string"==typeof n&&(n=function(n){n=unescape(encodeURIComponent(n));for(var r=[],e=0;e<n.length;++e)r.push(n.charCodeAt(e));return r}(n)),"string"==typeof o&&(o=function(n){if(!r(n))throw TypeError("Invalid UUID");var e,t=new Uint8Array(16);return t[0]=(e=parseInt(n.slice(0,8),16))>>>24,t[1]=e>>>16&255,t[2]=e>>>8&255,t[3]=255&e,t[4]=(e=parseInt(n.slice(9,13),16))>>>8,t[5]=255&e,t[6]=(e=parseInt(n.slice(14,18),16))>>>8,t[7]=255&e,t[8]=(e=parseInt(n.slice(19,23),16))>>>8,t[9]=255&e,t[10]=(e=parseInt(n.slice(24,36),16))/1099511627776&255,t[11]=e/4294967296&255,t[12]=e>>>24&255,t[13]=e>>>16&255,t[14]=e>>>8&255,t[15]=255&e,t}(o)),16!==o.length)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var u=new Uint8Array(16+n.length);if(u.set(o),u.set(n,o.length),(u=i(u))[6]=15&u[6]|t,u[8]=63&u[8]|128,a){f=f||0;for(var c=0;c<16;++c)a[f+c]=u[c];return a}return function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=(e[n[t+0]]+e[n[t+1]]+e[n[t+2]]+e[n[t+3]]+"-"+e[n[t+4]]+e[n[t+5]]+"-"+e[n[t+6]]+e[n[t+7]]+"-"+e[n[t+8]]+e[n[t+9]]+"-"+e[n[t+10]]+e[n[t+11]]+e[n[t+12]]+e[n[t+13]]+e[n[t+14]]+e[n[t+15]]).toLowerCase();if(!r(i))throw TypeError("Stringified UUID is invalid");return i}(u)}try{o.name=n}catch(n){}return o.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",o.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",o}("v3",48,(function(n){if("string"==typeof n){var r=unescape(encodeURIComponent(n));n=new Uint8Array(r.length);for(var e=0;e<r.length;++e)n[e]=r.charCodeAt(e)}return function(n){for(var r=[],e=32*n.length,t="0123456789abcdef",i=0;i<e;i+=8){var o=n[i>>5]>>>i%32&255,a=parseInt(t.charAt(o>>>4&15)+t.charAt(15&o),16);r.push(a)}return r}(function(n,r){n[r>>5]|=128<<r%32,n[i(r)-1]=r;for(var e=1732584193,t=-271733879,a=-1732584194,l=271733878,d=0;d<n.length;d+=16){var p=e,h=t,v=a,g=l;e=f(e,t,a,l,n[d],7,-680876936),l=f(l,e,t,a,n[d+1],12,-389564586),a=f(a,l,e,t,n[d+2],17,606105819),t=f(t,a,l,e,n[d+3],22,-1044525330),e=f(e,t,a,l,n[d+4],7,-176418897),l=f(l,e,t,a,n[d+5],12,1200080426),a=f(a,l,e,t,n[d+6],17,-1473231341),t=f(t,a,l,e,n[d+7],22,-45705983),e=f(e,t,a,l,n[d+8],7,1770035416),l=f(l,e,t,a,n[d+9],12,-1958414417),a=f(a,l,e,t,n[d+10],17,-42063),t=f(t,a,l,e,n[d+11],22,-1990404162),e=f(e,t,a,l,n[d+12],7,1804603682),l=f(l,e,t,a,n[d+13],12,-40341101),a=f(a,l,e,t,n[d+14],17,-1502002290),e=u(e,t=f(t,a,l,e,n[d+15],22,1236535329),a,l,n[d+1],5,-165796510),l=u(l,e,t,a,n[d+6],9,-1069501632),a=u(a,l,e,t,n[d+11],14,643717713),t=u(t,a,l,e,n[d],20,-373897302),e=u(e,t,a,l,n[d+5],5,-701558691),l=u(l,e,t,a,n[d+10],9,38016083),a=u(a,l,e,t,n[d+15],14,-660478335),t=u(t,a,l,e,n[d+4],20,-405537848),e=u(e,t,a,l,n[d+9],5,568446438),l=u(l,e,t,a,n[d+14],9,-1019803690),a=u(a,l,e,t,n[d+3],14,-187363961),t=u(t,a,l,e,n[d+8],20,1163531501),e=u(e,t,a,l,n[d+13],5,-1444681467),l=u(l,e,t,a,n[d+2],9,-51403784),a=u(a,l,e,t,n[d+7],14,1735328473),e=c(e,t=u(t,a,l,e,n[d+12],20,-1926607734),a,l,n[d+5],4,-378558),l=c(l,e,t,a,n[d+8],11,-2022574463),a=c(a,l,e,t,n[d+11],16,1839030562),t=c(t,a,l,e,n[d+14],23,-35309556),e=c(e,t,a,l,n[d+1],4,-1530992060),l=c(l,e,t,a,n[d+4],11,1272893353),a=c(a,l,e,t,n[d+7],16,-155497632),t=c(t,a,l,e,n[d+10],23,-1094730640),e=c(e,t,a,l,n[d+13],4,681279174),l=c(l,e,t,a,n[d],11,-358537222),a=c(a,l,e,t,n[d+3],16,-722521979),t=c(t,a,l,e,n[d+6],23,76029189),e=c(e,t,a,l,n[d+9],4,-640364487),l=c(l,e,t,a,n[d+12],11,-421815835),a=c(a,l,e,t,n[d+15],16,530742520),e=s(e,t=c(t,a,l,e,n[d+2],23,-995338651),a,l,n[d],6,-198630844),l=s(l,e,t,a,n[d+7],10,1126891415),a=s(a,l,e,t,n[d+14],15,-1416354905),t=s(t,a,l,e,n[d+5],21,-57434055),e=s(e,t,a,l,n[d+12],6,1700485571),l=s(l,e,t,a,n[d+3],10,-1894986606),a=s(a,l,e,t,n[d+10],15,-1051523),t=s(t,a,l,e,n[d+1],21,-2054922799),e=s(e,t,a,l,n[d+8],6,1873313359),l=s(l,e,t,a,n[d+15],10,-30611744),a=s(a,l,e,t,n[d+6],15,-1560198380),t=s(t,a,l,e,n[d+13],21,1309151649),e=s(e,t,a,l,n[d+4],6,-145523070),l=s(l,e,t,a,n[d+11],10,-1120210379),a=s(a,l,e,t,n[d+2],15,718787259),t=s(t,a,l,e,n[d+9],21,-343485551),e=o(e,p),t=o(t,h),a=o(a,v),l=o(l,g)}return[e,t,a,l]}(function(n){if(0===n.length)return[];for(var r=8*n.length,e=new Uint32Array(i(r)),t=0;t<r;t+=8)e[t>>5]|=(255&n[t/8])<<t%32;return e}(n),8*n.length))}))}));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       �g�0<TH�7w�EO|�l�P7FRn��!9�"}�����{	���IW���_�k	���� 
�!�28�P���5e
E��	��{���y�'�\��i{�	��8�t�4*�,`,����E�Si�$h��!Zh5�&��Ll��>�9E�9�&��Jd!����kd+��?���|���X�{ HP�$?87���Z���R�P�qDD���Ubal��:C�E ���"Lߺ��\������C!�������T�Sլn�~���������h\�e���ה{9'�;��k�����l����'&Z����r0#E��a]k`b⤎�p��!>XFe�乫��P�wY$�l4I=��*�6����!<�da������KA�e�Q���Z	�^�n%�刷a�D�Me��z�T�V�ҫ��tl�y-�
�5z���T�����h2�y�q�lz�3��2��� �\]�u�Z��1�&�;��\2f���d�2� E�i��mS����x��E��=�[N�B0� x�pk����E�~�
�O������Z�Q���!׎�1k��T�@��Ǝ>H��Q�%`J��"�x�oV7�-T� ���ʾ�}���Ԟ�1��PA�P�록���
*'+����9-��$��+�����ޔ�7�� ��Nb�]S8���0�g�\'���$�r�#���=7����K��Ց������� p�%����n
W�D����٥�����y�(�Xۈ��!^X����=ӥ=��cD�W���[�ȷ��B3��'�_tvT�[�n��T~D��ABn=�8�5�d�GT�W��[��	F�E��0C�*=�֩u����sOW�k�/.n�I)�_IW�@4����,7~��w�� u�ՀU|#�e����^?�
���Hu �LN/.Pь���T����j�
%O�ZD{�1bR�L@:U�$��C�i�ɸ$AiDT٨lUKJX�~��8^��ƌ���k"��'`3�1��W�=J^$2�.����,h��]�2%1 ������/4�D>��� ��a��s�8�$�KR
�'��p�rW�=4Fn�P�Ք�95����{�'>�M��]f3~[Q��S�	��?p2~��J�C�/�܃��2d�ApT��X��3<��e���ڥP��`�ły��dO����h���8kL�H�dFRfx�m�pL�p�A��R�!��˳������^o���?B� �^�
 �;d�5��)eZ(��<Ǖ�&�Kخ��G��L��:H}m1�E3ٶ�ij�}��64ǩsG����)��P�r��x�0�8	�[-/A�P�u2Nc��O�����Qv�I,W���l�*5��`��P�YQ�$k(6=N�1�9e>�ڿK(X��� ���D������&���Ŀ�?=���-�'�<(�]M�}\&�߁cQ��c�K&�0��<�����T�z��¯"�k%o�t]�u�D���*xH�}�OG-�|͆�{p�����`G��XH[�Z�Rb�/
S�b��řu
���5��a��\ ��>��'Q䍃� �`�>�0զkc�H��(���ѽ��p����@�6^�H��FcEYK�-��P%���=���db�І�z��Ay�bH�����PC,�Da�@9��%��F���%�XI�>�T�8qT%M��$���K�c/������R��`-����"q����d� �H��&*�DF1����\��t��ئBK_����_�3@��w�9}��Q�[hy��р%��h���ípk��@=ܨ
�
���7�旳��\u>k�6�4���������b��{3t�?8���VTm�mF������#�0ӎ�t��ᤷ���!�	-�KK0,|�����2��_g�@C��,�W��+s,�����RƨaK�TǑ5�$;>���7>�&9P�G�����	E!�jQJSM��Q�HW,�=���cɥ�I�z���ɚ:v�(�%C��^xY�h��#L��Ϭg}���ƅJ|n��k�k���ED�_���3�|5����߲Wb���F
Ur�*e�9l=K����6�%�����6��i����"�u=��o'#L_q�-b
K�^�Oh[�^�Z���lްQ��hYZ jL��4������C8���"z��f*�6������"�^��?�8%(ư=uӛ�=���;��J5.��N)�Н(5�a����=q���n�ܒ��� a�́)��O�����#�A��J�C��.&�16�H�Jb�*����<9�T���D\��2v��A�v�L��x�Wy3���Q��ܘ����ͩ�#7i�ͩ�����	6�(X-��X�i�k�	���2R�����K�ӑ�h���]��Ns�����}����k�=��N����}i�����٭Ⱦ�yk�8xnӡ28���hxSD�b�&���k܇4L�ѫ�b��b[�VUy�P$�b'�]Wϵw��"M<���E.8)kYz���
!0N�[Ǹ�"P��P��h�6�^���;xL��M�.�蒭B����2�P�
/V�ϭ>A�Y'�ӜJ:�b��9I� (�j�X#��=c�" r?����8��JT����v��3(�����]��w�T:nx~� 
�v��J��#���ʍ��Sa"�-���9���W�{����& z�����Y)�^E�>3z�s�?�;Q��#���I�,����c�tt�w��z����*��E��f���3��ZB�WY'a���E
hKX]%?4��"�m	X\�7����le$���P;��fM�eP�����Ĥ��3䈠�Ort���Z���D��+�;r���mV�"�V� +D�_Q�c l�>?�@$�vdcX
��Zi���؅��|ҟ�0��4�,g�Ŋ7��e�^�8.��1/�3�����ɓ@A-�&[5�����j~aH�
���ռapy4^��j5�c~��2���3�Ǳ$IL92����97�~�?d#�>o�Q�r���)'CE �=ϸZ��?����{�o!B�WW��
�h��Ƣ�B������LM/Q��xM$���d��גV���%œ���2I�Ff�ګr�#�����P� l�MXxd;�rSy��<,\��~/��i�Xׁŧ���5OrY���&�(7������<o�	�jĒ�^BD3�=}��연]�}l�B�b�(�<����P�EL���_��(��2,ņYG�������.����	-da8OM7yt�S&?�n��>� X�D��IȄF���P�t]̸8R���zuJ��.r��2��y%:��E+aݺڼ*t.��r�;���Qk�f|-K�PQZ�Ζ͸��ч��}q��v�v��f�}�>����n��l�w�}��߲;�Z��~5�Ø�311����ɧ�@�j��s�<�iI�!�=������kX�&`��˹ٽ �O�!t(��Ym�bZ=h��&Fb
��.��,�9��kG�A�l�����7�J����{#Nx��/�,����~����G��	B���2�-��*��q#7f������~+�/-S�7�~7��陖�`�ܞk���|7<�ԩt��{3&�aV���P�4U����!�#��|�α���y�#��8;���n��\P8#
�E�i��[������0�.+��֐9��t��6�1����?�����]���p��^j��՘	7��ȴN�ކ�vt9d��?���Hte��B�ÌNc�
(
�G�b5��<��d�g��2|7�fj}
#�Q�qB�9>'�����j�cZw�NI�
�sA�m�HA@�Q�d4���U?b��>b�q0l&�siRX\L�)���%������8����wn��@@ҍ����M,���0>������պL"���ި�A�l�8�	�j��O	�� ���V?�.:]Z=��+	[I�xSy�	�B����s����t�O��ԝP�� �~t� �²�h>��ӡ�D�rFNАg#ER�>���뤰��UN�X���!���N����ۢ�b�h(	]@��(���')��J�����������k9(|�5:��ڛŒ�r�$U0*a�F1�p��3�_C���O���E��@0�������:���*z/��#ԓ��^7��e��Zzܰ�3XTn8�WB�_��Z����pA�0��	�CЪ���m�H�̘֜{��+Vڧ�V�P����[����\N)���0�]����|��BvO|���{U�	�^���� h���	�{7�7� � �g��9\�0����N�_躥�a�^������y��.�Qq����I�g�8���̀`�9?��	��(Ѣ�uO
�����M|�Q���5�N*��R݉��5L���������`Z�K��m�ů���h�j�0妲�w���J��ᯡ�o��ȩ��h
���|�46!
��0߂u���_�ƫ5�	:�ڍ��Z�W���ս������!��)�&*�<�R�@����g(��&Gg���(�=�E��������
���9׊I~i4�����L�G������|��M}D�V���>L��<�W0p�<���G�eN.��_����e�
��¶&��Ҳ�U(V&���ί)�`�сBD�»e
�e���ik�pk�e�:|�y4(<R뎱���'������i�ES����$���Y���k�5J�Lh)�|�g�����:���c_!�IX@��>�f(�?B?!П���������El��t���9�*��ʢoLU�۰�R�^��p���S2��cy��+�����~L��h�'��V$��@�eS��Ά�nj<�%��D��Y���ێ�ۻ���� {ó��d`������������^}^�'��t�0f�����r�M�Ge0���_~	d�����A����2z��2>L{$���c��^GW�4����͖�	+���V���+�X���w�ނ�'%�	^C;ES]�VE�8?��I�\��f���9���O?4�s�n�=�L�1b�b�y��p��c"O�d
�g�I���S��`�D�<�'�x36�9�?��Q�����?j���1��0J�i�V��M��L@?K��(b�b ����SDYO�WHE��w)h��RKW��#����ed�H��r�pՁ�c����N���ɱ��=��VT55 EP���}�ay�*%p�o屯��"��FNӗaR_>l��ό�t��t�_�����QP��r���`�e�R
�m�+9	<�G�M=x=�+6���ozh�4�kgo�鴬8�w"�h��n3��_OSу��`��b�9��@���A��5Α'-���֩]8�E�}��������Kv���JB
2S'[.           5H�mXmX  I�mXӧ    ..          5H�mXmX  I�mX�P    _TYPES  TS  �I�mXmX  K�mXJ��
  _VERSIONTS  �Q�mXmX  S�mXX�?   UTILS      iV�mXmX  W�mXG�    INDEX   TS  Qd�mXmX  f�mXҬ�  Bt e . t s  �  ����������  ����N a v i g  �a t i o n R   o u NAVIGA~1TS   �h�mXmX  j�mX��g  Bs   ������ I������������  ����R e g E x  Ip R o u t e   . t REGEXP~1TS   Tq�mXmX  s�mX��  B. t s   �� �������������  ����r e g i s  �t e r R o u   t e REGIST~1TS   {u�mXmX  y�mX���  AR o u t e  �. t s   ����  ����ROUTE   TS   1{�mXmX  }�mXC�:	  AR o u t e  4r . t s   ��  ����ROUTER  TS   l��mXmX  ��mX_��>  Be r . t s  D  ����������  ����s e t C a  Dt c h H a n   d l SETCAT~1TS   ���mXmX  ��mX,�0  Bd l e r .  ~t s   ������  ����s e t D e  ~f a u l t H   a n SETDEF~1TS   c��mXmX  ��mXٳ�                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  .           >H�mXmX  I�mXԧ    ..          >H�mXmX  I�mXWY    Co r t - m  }e t a . d .   t s t r a n s  }f o r m - i   m p b a b e l  }- p l u g i   n - BABEL-~1TS   �I�mXmX  K�mXI��   Bn v . d .  +t s   ������  ����i m p o r  +t - m e t a   - e IMPORT~1TS   �R�mXmX  T�mXx�/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  JS-YAML - YAML 1.2 parser / writer for JavaScript
=================================================

[![CI](https://github.com/nodeca/js-yaml/workflows/CI/badge.svg?branch=master)](https://github.com/nodeca/js-yaml/actions)
[![NPM version](https://img.shields.io/npm/v/js-yaml.svg)](https://www.npmjs.org/package/js-yaml)

__[Online Demo](http://nodeca.github.com/js-yaml/)__


This is an implementation of [YAML](http://yaml.org/), a human-friendly data
serialization language. Started as [PyYAML](http://pyyaml.org/) port, it was
completely rewritten from scratch. Now it's very fast, and supports 1.2 spec.


Installation
------------

### YAML module for node.js

```
npm install js-yaml
```


### CLI executable

If you want to inspect your YAML files from CLI, install js-yaml globally:

```
npm install -g js-yaml
```

#### Usage

```
usage: js-yaml [-h] [-v] [-c] [-t] file

Positional arguments:
  file           File with YAML document(s)

Optional arguments:
  -h, --help     Show this help message and exit.
  -v, --version  Show program's version number and exit.
  -c, --compact  Display errors in compact mode
  -t, --trace    Show stack trace on error
```


API
---

Here we cover the most 'useful' methods. If you need advanced details (creating
your own tags), see [examples](https://github.com/nodeca/js-yaml/tree/master/examples)
for more info.

``` javascript
const yaml = require('js-yaml');
const fs   = require('fs');

// Get document, or throw exception on error
try {
  const doc = yaml.load(fs.readFileSync('/home/ixti/example.yml', 'utf8'));
  console.log(doc);
} catch (e) {
  console.log(e);
}
```


### load (string [ , options ])

Parses `string` as single YAML document. Returns either a
plain object, a string, a number, `null` or `undefined`, or throws `YAMLException` on error. By default, does
not support regexps, functions and undefined.

options:

- `filename` _(default: null)_ - string to be used as a file path in
  error/warning messages.
- `onWarning` _(default: null)_ - function to call on warning messages.
  Loader will call this function with an instance of `YAMLException` for each warning.
- `schema` _(default: `DEFAULT_SCHEMA`)_ - specifies a schema to use.
  - `FAILSAFE_SCHEMA` - only strings, arrays and plain objects:
    http://www.yaml.org/spec/1.2/spec.html#id2802346
  - `JSON_SCHEMA` - all JSON-supported types:
    http://www.yaml.org/spec/1.2/spec.html#id2803231
  - `CORE_SCHEMA` - same as `JSON_SCHEMA`:
    http://www.yaml.org/spec/1.2/spec.html#id2804923
  - `DEFAULT_SCHEMA` - all supported YAML types.
- `json` _(default: false)_ - compatibility with JSON.parse behaviour. If true, then duplicate keys in a mapping will override values rather than throwing an error.

NOTE: This function **does not** understand multi-document sources, it throws
exception on those.

NOTE: JS-YAML **does not** support schema-specific tag resolution restrictions.
So, the JSON schema is not as strictly defined in the YAML specification.
It allows numbers in any notation, use `Null` and `NULL` as `null`, etc.
The core schema also has no such restrictions. It allows binary notation for integers.


### loadAll (string [, iterator] [, options ])

Same as `load()`, but understands multi-document sources. Applies
`iterator` to each document if specified, or returns array of documents.

``` javascript
const yaml = require('js-yaml');

yaml.loadAll(data, function (doc) {
  console.log(doc);
});
```


### dump (object [ , options ])

Serializes `object` as a YAML document. Uses `DEFAULT_SCHEMA`, so it will
throw an exception if you try to dump regexps or functions. However, you can
disable exceptions by setting the `skipInvalid` option to `true`.

options:

- `indent` _(default: 2)_ - indentation width to use (in spaces).
- `noArrayIndent` _(default: false)_ - when true, will not add an indentation level to array elements
- `skipInvalid` _(default: false)_ - do not throw on invalid types (like function
  in the safe schema) and skip pairs and single values with such types.
- `flowLevel` _(default: -1)_ - specifies level of nesting, when to switch from
  block to flow style for collections. -1 means block style everwhere
- `styles` - "tag" => "style" map. Each tag may have own set of styles.
- `schema` _(default: `DEFAULT_SCHEMA`)_ specifies a schema to use.
- `sortKeys` _(default: `false`)_ - if `true`, sort keys when dumping YAML. If a
  function, use the function to sort the keys.
- `lineWidth` _(default: `80`)_ - set max line width. Set `-1` for unlimited width.
- `noRefs` _(default: `false`)_ - if `true`, don't convert duplicate objects into references
- `noCompatMode` _(default: `false`)_ - if `true` don't try to be compatible with older
  yaml versions. Currently: don't quote "yes", "no" and so on, as required for YAML 1.1
- `condenseFlow` _(default: `false`)_ - if `true` flow sequences will be condensed, omitting the space between `a, b`. Eg. `'[a,b]'`, and omitting the space between `key: value` and quoting the key. Eg. `'{"a":b}'` Can be useful when using yaml for pretty URL query params as spaces are %-encoded.
- `quotingType` _(`'` or `"`, default: `'`)_ - strings will be quoted using this quoting style. If you specify single quotes, double quotes will still be used for non-printable characters.
- `forceQuotes` _(default: `false`)_ - if `true`, all non-key strings will be quoted even if they normally don't need to.
- `replacer` - callback `function (key, value)` called recursively on each key/value in source object (see `replacer` docs for `JSON.stringify`).

The following table show availlable styles (e.g. "canonical",
"binary"...) available for each tag (.e.g. !!null, !!int ...). Yaml
output is shown on the right side after `=>` (default setting) or `->`:

``` none
!!null
  "canonical"   -> "~"
  "lowercase"   => "null"
  "uppercase"   -> "NULL"
  "camelcase"   -> "Null"

!!int
  "binary"      -> "0b1", "0b101010", "0b1110001111010"
  "octal"       -> "0o1", "0o52", "0o16172"
  "decimal"     => "1", "42", "7290"
  "hexadecimal" -> "0x1", "0x2A", "0x1C7A"

!!bool
  "lowercase"   => "true", "false"
  "uppercase"   -> "TRUE", "FALSE"
  "camelcase"   -> "True", "False"

!!float
  "lowercase"   => ".nan", '.inf'
  "uppercase"   -> ".NAN", '.INF'
  "camelcase"   -> ".NaN", '.Inf'
```

Example:

``` javascript
dump(object, {
  'styles': {
    '!!null': 'canonical' // dump null as ~
  },
  'sortKeys': true        // sort object keys
});
```

Supported YAML types
--------------------

The list of standard YAML tags and corresponding JavaScript types. See also
[YAML tag discussion](http://pyyaml.org/wiki/YAMLTagDiscussion) and
[YAML types repository](http://yaml.org/type/).

```
!!null ''                   # null
!!bool 'yes'                # bool
!!int '3...'                # number
!!float '3.14...'           # number
!!binary '...base64...'     # buffer
!!timestamp 'YYYY-...'      # date
!!omap [ ... ]              # array of key-value pairs
!!pairs [ ... ]             # array or array pairs
!!set { ... }               # array of objects with given keys and null values
!!str '...'                 # string
!!seq [ ... ]               # array
!!map { ... }               # object
```

**JavaScript-specific tags**

See [js-yaml-js-types](https://github.com/nodeca/js-yaml-js-types) for
extra types.


Caveats
-------

Note, that you use arrays or objects as key in JS-YAML. JS does not allow objects
or arrays as keys, and stringifies (by calling `toString()` method) them at the
moment of adding them.

``` yaml
---
? [ foo, bar ]
: - baz
? { foo: bar }
: - baz
  - baz
```

``` javascript
{ "foo,bar": ["baz"], "[object Object]": ["baz", "baz"] }
```

Also, reading of properties on implicit block mapping keys is not supported yet.
So, the following YAML document cannot be loaded.

``` yaml
&anchor foo:
  foo: bar
  *anchor: duplicate key
  baz: bat
  *anchor: duplicate key
```


js-yaml for enterprise
----------------------

Available as part of the Tidelift Subscription

The maintainers of js-yaml and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source dependencies you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact dependencies you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-js-yaml?utm_source=npm-js-yaml&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)
                                                                                                                                                                                                                                        �v;K��s���Q��o��:��������9ڣ�o,�;�v�J.:Wd�D��:����E�ܞ͋�/,e`{#6Y��!�����ą d&�b��t)�渆��)%�v>e��xj��1	m����Z�<�
��S���uCY-#�MC���l��0[,!mt�M��w�aF��� �јN\�ˠ�����l �Mx��Lz�D>��tOir���</���,8۠��r6�cߎ
£zJ��w����䋖"O�~��]����E��ɡ�e}�/����R�{�4���M�mq���,vtMr��e�+Q�����-�*TA�Ǣ��G��::2h�P�ֵ�5w�(Yy��5q�N4��ׅ�o���&;���%���0v?��}�k��}�`-:=\�\��05[w�$s
R�C�+�8���W�b����H��~���W�x�O�)<��i�b���W�^��N F����-f'���P���Ō���r�[�+�Z1=a�!�K��p���l�B�t�ݿP�>�kQ!��2�s��ṳ߾h��מ%����3��x��#]�
(ս1s�'PS*�[P����n
y�N�ɩ���L� ��(�ꍶU�$idۓ���i�
��śXGiKf�X7���8x_������<S@��7�����f\H�cL�$���;��b�̳��	�,�6�i�tn�˽w� �-�N�>ۆ��(�D�%Y�dj��U��$�i����%1:�uX뚮��>q�P�9'.��UU�_U�����<�ڜ��R���[��X[ �
]�g�<���s�P�f6Y�� �l�kP�R��{�w�.�Ņ���fˠ c�c���D�/OD3K�v�"�6�{_��vB�N�l�T��ί(�:█y/{1��u@�cr4�:.	�/e��Wj}����N���
jIg^�Y�[�d�9���T�v�9����t�l�)1@��Q��+�5|#Șܧ��2oE�߶�QIj�tr\"�߮����>z)v~xW:9��d�'�9���O�l�����z�a߷�Jd5��,�j�R��Nrd���^�0e�.�W\��ߘއ|��M	$9�|h���d �-Y�S�=�d;G�F!$ �` ː�d���,rg�d��ޒ����^ki����2�.n�
�M:�e��u�6��>>#��m�ߑ���J����!�B������8N����wIVI�|{��]R�fnw�g"?Y�~�H���Bғ��\���c�E^�\�݂�tC��Gv$�I����m����3"
 �\�	X���p�@<�D���ݞ�Z��q�s�`���s�0�(ۇ���;!����=s�(�"	]
���R���]f�_D�|�$o����1���\%��M����^�r�׻T�>2Y��
��mZ�
b�T
AX":���ls�G[���eL��%:��s�F���#��
�O'�1%ƣVm���DW��^ӛ�gV��G[�x���n;��Ga�~|ji_.l`�D���=��ֱD�.�d��h�@�`UG���s�?�2�����G�]c�>a�J�x�o�!�'c]��cs��2إ`=O��gv^����$/��{WE&���C��D�����q�t��͸�����[I��O~��,�F�`

���i`-�+G�l����y��g�����p`r~ښ��S\���R��V����e����h-3�^�)�YhT��o/��35_�k�p�@�Py� �E�y���I��@#����|2T�Ey��B�o�(�%gAKJ�on�[|�A�E~ ��!!�UQ8�A��w;%R�a# kf�2E�gu�f��
��|bޯ��'-��nR-����aLyoX������"�-�����!]o��9�7�ìܐDH�A�	r  R;/��3%����
�B�6��H[�M\�FG�"N�� "5*�9�1��_:���hЋC�@ꀁ e�Zî55ף��زԢ���[�䈗 睐�JLQ���F��E8@�p˱����i��mL̓y��tt�;�QV��� ?]ޡ5���⮼�4I3|�z�O�o@���IόY�����`�`��,�XMrzt+��S��u��Q�CH[�F���L�/?�D3ĺҢ?j�8g�p�������7�`28&0�MbM���@Dq&�X5��~i��/`�_�C����lV�cJ҆ �(}�O� ?8+��L�oLh�W��N�woW](�̂/|	��o��>S�3���`26%����SI�	���x<o��$�+�kF�Δw�Ŵ�+ ģ6M�n��I��2��J�x!9������Մv�SM�Y?3A��d����.��
 49$$�O�⼆���q�x?<�w�c�1��T��=�o�Xw�`d(���fS�K���C�����ؘVƭ�ģR�Fnz�P�4ܙk�6�áj� `R8�-���d<o�H�}�v�פ����L�?5�d�W@@͞����G���I>�%�����&7����®��%�B�zPڽ 
$��h�K2������}�����
��I��)��`�U���Ʀ���Y��Ϋ�J��3��v��[T=����Q���NcO�X��#e}i���wJX� U���	�ٙ_'�r�4��7_��^���e!XX��H�zi1�	xȕ�u=��	s��;��Sb:c?�rX� �h1?`V-�.�S�9+�Is_��a�E�y���5D���G��E&��n�_m��+�Iy����"�R���@pيg_
����n�Cu���T[�$����!@hI�B�0U�I
l� ����!�H`> LF�OFnч�%�ƌ� �uI>�V�� �Q� v�6÷�a�V��s2�_9;&' � ��ya��_t٦�G��jL.AA��d���R�@��'U����=�\~�w�u��W[8�r�;`3=`E����U� %����l� h
�4S0F�(�o��ፅ�{��!hQ�����T}�,hH�.�7Vk�u����}��1�K�ƆN_/dݕ+�C�}X�l�c�&!��۝$�e�s�Gp0���x��Dɡ}�/�%��>�������|-n��Sq��V@�HT��(���'&���`��1B�uOJ)�Wf�ǾL�O\�ƈ"��2RXm��� G�=@�+>w�	Ŧ5z��G� �j�0/!�sf�K"%U?����=���%UH
3T�X�F~kS!��.�{�#��g��/�L��� |�u����@�Z�~�5P�i�i |��'�ag�K�a����H���
"�g����`C�P;�z�K���v��e�����Eg����j�����˞J�����/_�OՎ�YR��A:�nB
�W~:H���v�d����p����%����.��y�)]v~Oy%�hA��ځO9����1%��^�mѝR�ιOl���?��+�0�����K�n�	����YU��W�o�����a����L!�0���j�8ċ�!v��Б�#? ڳ�!K�����qB��F�����䍲)J����fĮ@����FK�倀			�� :�����
!��mN
��#����6���c�h�)Ի$|���Ϙe��R!���V�(�f��
import { CosmiconfigResult, ExplorerOptions } from './types';
declare class Explorer extends ExplorerBase<ExplorerOptions> {
    constructor(options: ExplorerOptions);
    search(searchFrom?: string): Promise<CosmiconfigResult>;
    private searchFromDirectory;
    private searchDirectory;
    private loadSearchPlace;
    private loadFileContent;
    private createCosmiconfigResult;
    load(filepath: string): Promise<CosmiconfigResult>;
}
export { Explorer };
//# sourceMappingURL=Explorer.d.ts.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ��"���*�>?��K|1��<EvFD�.����~ҝ���i��X��*�N9.�f�!��r?�v0�?�� ��s)1��Gl���3�+ p!�
�����VqM�,0���$X�-�.�C��0��m�T��`�l[j~V#�P'��"Ҕ��F���8�W��P&JB�!�n!Y�F�� �2YےԺ8 ��((ky����|_�gJd.��~����B�._*��� [u���*9���΁p7���'�s�����w٪5�oŖ(�+J����V5�W�
r�2'�Q��4�_���Iq%T�7
u�%� ��P�y؝�S�&
ӧ�"�!�(�O��"ֿ��ƾ��8Ut�N��E����bcH�,*�ѺwØ�"�֙�]��x$鍅e'w����@�'n��@��1Q�� �(�v�9�jM#{U	��,(~�V�D�8q�H1X�|f7�o��)�-�8���[	ڂG{׽�ܪ��w#B�#�?h���f���s�߱��ᆻ�Uv�2�YS!�GL˷jN�3�T2u6���������zZ�.5�����4�ۭc�,���8��<f䛚�l[ڲ�?�K�F�<�`�0R��C�"�r��ĩ��P��2i���$wS>C��9J��x"Ť��a`/ּ|"TU�?4�u\T��������Ұtwww�� �tw#�ݍ(�
HG�_bF�=c������k�)H��KǷ�pܾ�wc�ǜ�X5�qpWix��=�V2�>��'���漓lJ	���_hohRSÅ$�٥��)���P4�����"�����Bƴ�-���u��e�Х��
���%򦷢����g�{�����k��#��ƍ������֝����PG�PD��Adn|�O�������N6(!;8�d7�I\�����2f�F
��%�I&�+����Pb�����n��a�(�����S������32��I*�ݧ��蔗Q��&B��,�a:�S�U����h�y�ߺ�� ���=/���,#�����w����m,��ZAO�@}=A�ʒz(��F|,/�ib�_��;+^��s�ta7ۛ�gE�]�2V���|�>J����U)>ۉS�� �p�r�zabP:����P]T�u���_y���֜R����^�Lʢ*�I���l���Zޤ�o�FZ?򒬧�||�e���[�G`��kϿ�g0ލJߝ��fe�Y,,Y�0���B�u\
���P��pT#

H������q���Դ�SSN.��o`
�P�r|���	���(O�5�}fq��
~���N�y�p��ȇ����3�����$@V� Z�'�X6zjO�|���YUm�<?�cK�U��^-��zzeR�Z_r�����v��
3�`���n���U�(�	
c��T�EӞV#-��F�Jf�"Qi�ݣ'W�����<���D��I?�����S&X-I~���6��ۆy��m����8V3y���<
�k�0]�D��5�ۯ�0��E|B=�I�0\�QeD��ҡY��{�:���!s�ڰ�������/�%T�֩}&?H�O��A�G�X_�~�S)p�o�	�B���Dȇ\���(�-l@��di����e�E p0R�=�.��X�b��T�x��^��&���D_�8MJ�[�V���O{�K���R�Z�R#�\��6�#����^9S!뗕'��o�0$��-m�D!s��#0�12a��]���BGB46H���	ʮY~.��7����0pP�t.K�f'5�f�%7,���į��`���3�]}���~w>������[��B�_?�V;~�����
 l@#|d�òs�k-J�~w,����-z�F+�����~8*�(}����Q�l̮�#uJ��DgwvS�p4�7{2�fF��v����3ږ+O�5%���H���(� �ª%z��Y�F��L�s�B!h0W~����:�\o����Nh�	�Fp�^sj�a�,��������"-�^�:���0ᵒ � �a��!�CP5x?no�AǠ).-��IrL3s��B�HE�Wf	�x�J`x������_Y��H�
��[�:)_#���
sL��Q��c�j��A�j�ɐ�5�W|�Щp�F���>uǂ& ����&ͣ�O#��jLa��nf��|�%�fG*��>��A9�x!��McĊ�'7��}'+P�X�r@Hh���9�D)�Hx�����0���������1 �0�	X9a��~���p6S��/޽N �nƐ ��G����`�����O�.��F�=���<Ja18������|H*�6��a\oǿ�P�����W�Ȑ�z/�Ee>Հ�����K# WN��D!m��(�T�+TԾ�euIz�lp�w:3�u�vȞDWݭ��������
�� ͨ0����J��2�
DT��2�W�d,��8D��e~&����ͨa:ME�xe�1�m������差�.���h��C�����6���G۝��͏�L)|������\��T�z���易�ޙ������}�6@O���u��MOW�,c�'g<��m���������?^C�]s9ݼB�KH\�Z��S���p���*ge�� ��߅�Ҕm4~ ����zՏC.���P��8$�%]W F$������v튃�p���a�����[(��V�L:���c���o�4g�WmxTԬUK�9N����)�
��(Q��pbV�����Yst��+��A�'ͩ<���}�כ�խK�KKD�������F��wʀ���%Lr�C��?�2N��W�bG:u��%h��K��*�7ִ�Q��@�^"]n(5�Fa��)ЮK��k;j��ś�����x�þgk��Ǿ��'D~>zWw����G�ϒ�>�}���ŵ✪[m <@J�'���(E��J��s;��ݍ"�OҒ
:���	L9�kI�kU�	��H��1����@?I<p�	F�jd��cpqI���-�:lڃj|&l����Tݤ�����=- �5�h��W��o%84�9i8&4���oL%��|��p"��
�=�4R�܁ъ`��g�^hMع�^��Z������	þ
1��g�g��q��C%^L�'��'e�h7�\���"���:�;Q[��6��H�ܙ9�~4��c����ca�I!��|��[����j������׍KI���ǒr?�((t�o]6��|qo�2�O7�(r�E
�Gb�H[xӟ��l���E��G
���/*]�i!���`S��!�(�FF�k�U���]���P��4O.�����l���5�Kρ�3�T�WfqK�N�px�hNN�׊�����I���\��0W �\߄5�Ձ����;�ؙ���&�/7��%	c+�*�d���u�W�B�$d��*��b^%C�F�����l�η<桱�i�ux��y*��D�҈(	C���c}@�-�X�Qa��-[�����IO�d�Y烘&�rb��e)NlAC��!�u��l�鏨'���d"�C������%�W᲼�/�ϟ'�ޘ;�)��������.~[��b�`�{���K�
h�o��KΡ���|���^�Uj��_5�@���8+��{����]Ȧ4����..{k�^�p�n33���{&����w�W��0L����{b��D�4��IZ�V\=: <�dx���
�Y��v �m���S4Оk�ok!�Z�����[�W�Rg���0iz�H'G��餈U����ט��R���}�0Kl���*��%�Xo��x�C
��
��:,(�?�I��˓����vV7>�;�,u1h��U<}!IK+Q����F���C2�2K�͖"�܂Ih��� ����q��9 gf�7���%/s�"��x�ɼ��!X����*��>�8'ݙ1��-<x�UX��`��0T��6�.�}{T�|�q��e�����w6.Ɂr
/��>o�g䋛�������
�e�^��E��e,�8���$x�������t��	�Uݵ��b��E����k�bt���� =� 7 ���->=�
���WQ
r��ȿz�CUW/1��ؘ����=�Fbs+�7,#�.S�u�RO�"Y�D�أ�/�=��
�d��V�0����� �*|;f5Wd�k^!<1�Y�h<*W�v9_-��pҸ>�[}�O#��9;��%Oz}�����w}���o �+�(��rtO "�
@�/��"���[,���zF���ѼO�D5T��>�ui���3�N��s�;��U�����<�c|k�����գت�VN�s�f���i����24��h�BV��[
+� (��cQwQv�Eq�Y��͠SXq�3�߭����d��
���Y���	�8��)L1o�i�����3�eu��Q�c	�+&P���%�x����R���y�������=:=$��	{@P���a�,Ī��*��g�2ot��+>��Q����B~0&-��Yt+�Z�[��`��M�E��]a�m��o}o}���QP�?}��dȉ <
s�!�X�"`,�{ϙ��+�5�sP��'$em���ҏ�b��}o����쬶�]/��o��B���YV]�?�\ VK���A�K(�\����۲�I|��lr���+9b~ru�}��[���Ě��_ᷓ߸鰟4$� 5X�w�"q���_7��Q�q=����
 nm\8|1fC�:D[{�
��	��z�/�+�������Hĸ�g��?��w��
��s�Cz���a �k�x�sdq.��e (�Iݵ��2��Y[�mɌ�Q
����Gm'JvN8�����e
!`*Dwy^zA���aWX�-ikNؒ=�	�7nߴ��C�1{��U��!�p�������d .�V�x�u���wD'��B`yV����$cb!��~	y\'�݆�[	�&�v�ģ�|-� �I�x���|{�W���&F�r�*T�Y�T�����n�g�8�]�����l�;��,u��
�h3�
ȳ*�V���3�ӹ��:M�& y��Rp�-�������
^G����Ɇ�J�Η-�������I'A�IZUP�K�3��[�
("ȷ�����ՠ�ᆴ� �6\�j�y��c2�!)\���A�mP�) �O���K��pl]�X���N'G����а�����YwO���4��[`�Q"�S%��s.0�)W.��"
�I@��~���r��C�N��ԂQ�,U�#�/� &mo��#���D�P4��IkX�0������I{{���E�c����'��1�Oyi��iSYA~�Y��-uAK���r:����I��l{�j�)B�ɜm�8��E6]@]� \�:��km|����j�����\�b�h�gy��D�ی�tPW3�c2UF	���f�AG/�����_Ŀ�B�v�c�
�����(@�ȰR���UBpߛ�ȱ�ܯ�)Fk�6�o�Ҩ�N��+f�����iWF
�����rŵ�����5���R�k�y�-	GFI���<i�[��D���l�(�}�n;񀥘���?
��E�|���l/���m�E��Zݶ}Δ���k����y:K���K1��n���Ek]�.,}.�P��qz��	�a� �����>�'��x=+�>��6[:�l�P�M	���}����绔^y��ڧ��it�z
:=��[�� �Sz����U����	�Ů
��S�SV�)Ae����7V�ӖD$s��MA�S�p�wB
f�X�=�c /���v.<��c�p��KЋ�����c�㙌P�2O=��n�l�ٵ��ۼ~f��p�[��V3������>��&T��˺�� ,�Wv�ds��Qh13H��)��1:��uzL���"H��-dꦈ�k�7�	�S���^�y�1]d�"ֆ�f�s^�(�?���=���笇��Ӏ\��m�U�VGB���/q�`�w���Ƽ���ʟ�<[�o6_�5~f��h�l�~P)����`�)dѤ�����7�'����������N��I0.�fu��Y�o�}�ӂ�'��itD����C�GLE�i�C��ib�xd^�,ɔK!�R��{�n2��LE�˞�J�_���ƐL5��r9,������\$)�(��T���[����=����Z- ���Y�4�<��߿�d���W�}��xE�qUM�#��	�OG"�=�Tz�uy�`5L��r�t���̚]sb�IAQWͯ	�Ql�ڬ��r�ʨ�u���xl���n��"N�\B���m�q��a�ڇ��ɉ�H߽\�~ܒEi�����.tH���p�c�u�*��w��H~R�TM�!�	70�5���FbG	��l�^��DldH6��>�g^���Z�m�m�Ug�g��.&'���V�mϥ����%�^G]z2u���x~�#�穷�]�tX��~�J+�~�1z��j~��p�,��굁��cK�G��味�з�0�:��`[!��Q�4����k��zv
t�Tu�������6Yk�	?;�
:/��IL�"�b�YV���hvi�o��:��of���6�293�^9z��̲�:1�����3�ߩ<Q_�cr�;�x:��3�������'���h��
Y�<z��9�煤R��h��$O��J��-WEA�E)n�	���t<Z���`�Ng�pO��<��o�YT�8�#S ��9%�$��&ZQ�n��8���ho�&�w����&��F��[~ݴ['��^�"H<�g�ءobFD
a4��'�0˒���,3�Qiq�w��ylf�Ux�>����9�
Ш��g@�%�jF SRI��!g����V5��	�<�3a�V�U�򍐱��9�b$���6�̭�RZ4R�{]�7F��^#���[�W�4/�M4��QEg�SN�D����K�`�>�oD�%lW_�دQ=`�������/�z!�L����n�d�طz��)Y��L�:�Zae��KxW$���4���� ����E�2�
��\}������"�cZd*���L6���h�t��} �E�q; ��Y���
�j��\]ɨ~:�i�OI�&�̘�߯��ik�v����-��+T'#ܿ*�w(�h,o>������x���i��X��K|���˾+�s3�)�φ�-��Q�[[g���(%�G�l�߫�[�r0P4ĳ����T��Y��<u�^Y��qγ~V[,:�=Ha�I_���p��A�R��S����qC<�I�?�~�?����F�X:X���e��eyc �s��Y3$���5:����RЩN�uy�A��V�63|�D2���X��xfnį9R>�'^��+	|/vUX��i��w�=?z&91u�]�h�vg
�l���������`��}@����Vl(Ӫ6&��� ��o�oY�\�Z@Ad�ma�;���G�S���7�)�G�`�X��@F[O܉^�C�?�2�Ҷ��

�V���s#S�f��.�'���	E��|á��=� 8r�'Znr`�:,���Lb�%F��(g��Nvc3�؊D��~���"b��ۥ�&8��+�G�]����Eߞ$Ӓ>�S��RQ1��9,���40E汹�.k�0)�Gyh���.?@p���+FT9|��厵�!��LZ���2�
t����3SE�H��s2O�7��֜�l~Et�=+���{���5
p�dϚp6�8I�w���\>`�7.1t��˅�3�L;g��sЪ�ޓ׾���֩��3x��(��n����	/;�eA��y��ݐ�0)���U�Y�=��'��e(Y��:}��e�*�eߩ�	N@Tp�����^9���BL�S�����Z�g1B�m�f����6i�_�B�՟�PZ���E���ct{8Ī!_��m'�������^ݡ��CD�{A|t�ǡ�j$7�L���i�Ql�!3���~3�R�߼�b��
.;
G$k��F���F�ԞW�d.L�	H��X�/(�R*w�'[a�>g��`Q���0{"mޯn����<�<50�&Jf��m���ZXȦ/�}��F��5c�>Lv@�l��r�o�:��z

c�'�5n�HL�֍�*3cq2�ij��^	���J�#4�C4����5����km��Ӎ6k(Z�
�D�0�^���zY�uWVr7Y�TRn)�AYW�+9�9Q���U�|��:X;��*�����;�}�5j��y�DI���#�W-Z3��
����8��I%����ʊ�r�&���������[V���l󛷮�77��/]�d�3���Mz"�DffL�2�W>Ҧ��B�yu6�2�>�B}.����lI���)���%冧�v����L~�Pė
��a���~�!Y���  @  ���RpVQ@��q?()g$��f�
ا��梉���
%�A�g}Z˸k�R`*�v�B��Vl~�)��O-����'��J����I��d��sNy�ź�jf0�4��Lx��~��HP��Qw���J�0�0����W�,H3�I�c/��7Z[ODO��ҹ=ڟ�:]q��uܲ,x5����lCo��.�z���������{�|��l�7���.-��q�))�t�ZT2�ኂ~�gn��yc�
�zi�Y���R�_�*!�0*|:l�n�E�S�ӌ�
���2{[��ӖX�p�H"�{��\���̰x�v�2���2����-�BfH��� �AJ�C�U2��J�l�G�Qʋ-��)M�����T�����MP��pҍ����$̱��|'�i�-���#�e�VT{�w��F6�*�A���s��]�J���.֟2�������Op0�Z�\v$��2�t��fX�by~c7�у6DDX_�8)��_������;>,�g����6:�gF����`"��]�}��������yy�h��}y�'�]��Ӫ�'*�a,^���aߧ����+n�PB��y--R�9a���1N�s� Y��5c�ϬY���xQ��˿�2��������Чb�g�M{����ܭ., P�Fŋ�m4i����ϴ�#�
��26�A����������F��Iwm �9hˉdم��0M��N��i�;��X�w���IO��K)�Z�T�珚�K��[ޑ�Jp�{�s����[w�q�Ux��n�[�E��r���X�_�6 >kw���[e����a���~�4���/��eA�&�m��,,���&cOka�vd��rL��;r�4���*}Q���*2��nW�c�MGc����5�5��B�N������'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _onlyOnce = require('./internal/onlyOnce.js');

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _wrapAsync = require('./internal/wrapAsync.js');

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

var _awaitify = require('./internal/awaitify.js');

var _awaitify2 = _interopRequireDefault(_awaitify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
 * the order of operations, the arguments `test` and `iteratee` are switched.
 *
 * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
 *
 * @name doWhilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {AsyncFunction} iteratee - A function which is called each time `test`
 * passes. Invoked with (callback).
 * @param {AsyncFunction} test - asynchronous truth test to perform after each
 * execution of `iteratee`. Invoked with (...args, callback), where `...args` are the
 * non-error args from the previous callback of `iteratee`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped.
 * `callback` will be passed an error and any arguments passed to the final
 * `iteratee`'s callback. Invoked with (err, [results]);
 * @returns {Promise} a promise, if no callback is passed
 */
function doWhilst(iteratee, test, callback) {
    callback = (0, _onlyOnce2.default)(callback);
    var _fn = (0, _wrapAsync2.default)(iteratee);
    var _test = (0, _wrapAsync2.default)(test);
    var results;

    function next(err, ...args) {
        if (err) return callback(err);
        if (err === false) return;
        results = args;
        _test(...args, check);
    }

    function check(err, truth) {
        if (err) return callback(err);
        if (err === false) return;
        if (!truth) return callback(null, ...results);
        _fn(next);
    }

    return check(null, true);
}

exports.default = (0, _awaitify2.default)(doWhilst, 3);
module.exports = exports.default;                                                                                                                                                                                                                                                                    �?<7�v�	���o�O��U�L@���ao�vП��'�X�zU�X��2�{��M_m��-�3���}
� D�1�fO]�q�L�Rs~��_#\w�_^�Pv�q�����K8��5�:]}�ǚ��A$�U��}j�7�;l����eR���LaR��PK�?�v��NTuo�>���ҔWN��)׸V���<R��0����Ɇ�%%QSk�U1��EX0�61�e[��m�4�3l�+/n�TU���x28�W����;D�O�5W&�����+h����Nz���4h�%�(dP�S����[���R���9�&"q��5�y�w�w�>	3��Zg�խ��,hS~�2N��W��7�bv�Gݻ���!I������)���31�j���Mtw᪺��̳gfv��nJN9
v��O��(��H��i@4�f�Y�-��B����J�ǘ�)k� �RX2�\v�-���3��5�G��׬H�&		���
?曪̪��SG$S�H'I�fi`��i�u�����k��T�uQAg�fUM����_%ğ)s��0��n�����2�qL������5¢#�阞Yg�|���U���u��F�oo���� ��ƲoY�E>��)�U�2(F˱a \�l/�'�z6SVC��[��Y��rt�]c����>��*�m��>�)*�����2V;}?g��0-��� �d��)��E���BEl�����Rs���Ŏ�Q�A��K���<M�o���c|_�P�5�4�0��B.����O27�6���\�I������>�0R,�#*���]`h��5�@ ��YG�F)�����ڲΦ�t��A�D̪�N,_M�ݝ�`�z�?^�@S}NMΪ� �d�	F���G����o\>1�9�`��*"�^Ֆ&J
�`Zu����sBL;Owyo�NrnN�a�ҩ�ڠ���ە�4����G
n�#%.���#)g^�,�����k�5ߕ�7O�����Sc�"�.��D�Ӥb���,�HHqR`��-�'\uf��F�c��P����Ouk�L�:��ξZ�.�t���f��Dm�ؼ� %�����°�d,ۮ@�f���0����_�@�U5��4R*	n��/�Qf~O��)�Ū��[���l����S��V
�;�oՄgr���M�â���e�[��2�nO�i��J�5M�B�)KO�r�W7��e@���ѐ�| �B��o�&����y=�
��JN ���l�>�
���N�4�����@<�,�W_
�w�Q�ܶ��?�/{���!0��`R+{�%A��8]���i���_������,-H
8���t�`Ak2�q�agV2B6��/��r���\cu��4���[��>E��zZSZ���,,d"{��A���q%t>2���	���$B}�.��:�����<9 ��~ja���(i�J]7�A�J�*�{5:r�y2zw,7�xS���^�p��~�!c�X��y*{�FP�
n�)�)J�d����FIӰdK-�u��lTI��Ӣo�1��(o�{QB3(�������[	q�n1��12jr��lAŞ~D[���O ��d��xRmnb/ϑ�H�U@��Vx
k�BB�]�B�2�Q�Y3�H��DYТ#� ���P���̍���?����mҾ�M˚�	��b:��J�JVc$l����p���X�
e�u�?�L�����Z�:}�cj�_�L��a&k\���!%���ڇ:?4T�S���,�}��Z���!.���jٝ �A| ����OX��p�2d_��l!p4qȀ�?BGXS�ﮖ ��/U;
��f�wu@`��O�y� z7Z0���(2y*š~
����N`v8���r���K�@Mn�joՄ:#S��-�gh�N#��w}��Dx�:`��
Z��ijD���<6
<UY�%��9]1�6#�r���L1n�M[F�5m�9�9��g�1VM�ʃ�i��0"-1����%���oVA�sΈ3�/6z�� �;����+�L���5xCn��Z��fL���;��&�N�O�ey{"�>�W�
}�c�`Uv��-�� �i7n���#�1���A(��.lw`ҕH�'E��� 3ӥ#���a�c��2��|�H�|��M��,+��xK�����zL�)W�;Ǜ��&��VW�VS�{16����l��b�RY�5�6O�
��gj�]�x9�v>���H�ʕ����I)��檾J@��0��,P�@0���6d��Q2����t�?��� ��iO�hU|![뇾̼�o���q��M>r�[��G�[s�O˼�r}����#~�����D��#VGx۠��~�" �S�P��`��0F#*`X~�d�A�)�O�)y�{������G������f����g�}�g|�dAY�#����7<@2�QoD�M���"�d�+�V��^
 v0���v�����(��:Qe(�1���0n��jH���:�h�R׼��w��)!PXwFc�%]��j�ukG��O��ֶ�=FDH	�H1��u�#Ď�Hl8��8�Iذ�.ҪPf����̂�]��$M%į-��8W��:���em�OU�*2e<EJ�ms�2	�?U_�%����j߰�~Y��`��$�B���=d&��jye�ls�w{D�e�PG>��~[^5�9��A���@��J�j���
+��� 0nM�>�wt�����m������B�W���q)H�I�D�c�
�����5���d>C�5������p;���C�`��M���
��|�4���k�����I�s��[�n���T��O��j��5,��J���m|DLZ�kE��&�*�9����dZ)G�P�j|J1ݘ��3�|:-l�/�:�0�B����#�t���_�4��x-N�!2�܈�ڸ��3��eY#-��)��~�i���q�u�����d��L��t�*�=ıD�
R��]<�~9���X��I��?�Z����8����{�&2�S�PPc[��_��?��AvJ��v��m��JOE1��4	���(��xs�Od�=�����S���M��/�ɜ�?�W�Ϗ�ij|�<���g�e|��A{�PY�7t�[h�E�l�K��z�S�������ϊ��V8�v9�I쿢�. *�� 
��5Vu���Zrd,�lbMwz	e޹a��i���];?��t}��}�zs������lFkc����ID��3���$��M�uo�M�$ ġ1�b`s�lC������=�Kj�h�1XlR��j���d��9>7@W�=��
r�<6��+K �4��&�#� �Ҳ,�:B �!��Z*��1YѰ�r�����p��`S֍E���H��,�@��3���Sf�KQcR��.2�MA,z�?]^��+(q��������SxA�l��E�0�����:.��z�{�� (�i%F�N������ ��}�[�{���_px�^�<lm����P��AE　ˌ�iv4H�S}��Q�l� ��~W^��X���{�&}:��T�6`>���;5b����f�>L(�ʙ�.ܰ ��d[������
��"�q����퓆���v�^�P��o����UD�Q�vUի�b�WM��yi�.�Ɵz�ڟ�6��q�
����Ͼ #�s8��)����,��*v�"ɯ�V2��z�%�KU�sh[�7v7�)e�t�@�#���+�$��?@�����]��ʪ��F1�5�=]i&)W3ɓiS���䲀�|���a��;[�Д�adLG+EW'��hD�nC�Ͼ�U�9��:{��V��$ ��C�Zy
����^+:�E����E�\������%�V�'���J���Y�o��wY�m�q�;2�����>R7R��/9�]*���u��+X����u�iњ7�0�L���W@���$��#!��*X��|��j�ⵌo��4�/�M
�x�Dr���B��%�u�"y���+i��P۾JK
�nRa�J�#����,oz�Ul�gY�Dq�W
ޏ/Rƚ���J9��<�r�}s�邭����ܗOn�DI @�M��m�Ԍrl@#)�e ���"M���*���1�9�v1a��EG��X�Ryht��w�ȁ��~^�j��=�W�R�Oͻewk#y�ֳ�Q��>F�]�� �_�!��qRBݯS6��^�3b��[�%�@%��h�j��0&
k�'YC��-�T{uR<[�	|z&�R͎���6�u����{/��ef	m �T`�f��i�f��׺��OS��c�c��`A.�r4=)H�g��Ea�(�Tղ&��[ʶ��t��?Lp̕�,��ȱY!��C��*�$mY-V���s�����,��t���!n��caF͵\�E �D��֤9��3��ʌ�Y�73e+�]�l�-�l�wx,4���,gT{���uD!�����'ˋ~?�H4e?Fbh�#� ���2��� �>�-�_BW�O�|wD���
�F��m��i�Q`��z5Z#-���kՋ~�nVm���?���>m����HG�T�-~�ֺ�g��o�G�A_��-����d��i�+_�����YzzY��΂l�S���/|Ռ�I�No�-t��~�'����о�rvk<�V�ϩ�t��-ݞ���һ���%Ԏ�5�\���HSApo�"�o�������R�)@�QE,�tH`l
;��TެDF����5V��欄�/|  _b�{�E�z��Q�ki(�R��`�Τ������T�tPi�f"��	�-�dl��l�"\��O���23Ϫ�rH��,@�;��2g�z�ͨ��T�ZYQ�'g_���-9��b��>wނ:�X.�k�j�� ��G��G�F����g�f�^:+uy�jR�),���q ��O:�0R4�Y^�F�\'
�T��娲G��+۾��3�9�=Q:?�_��m	B��Kܾ�l+V���b���)���5cHM�4t�X�QK� � �v��M<9�r|j��U o4B:*d�����Ҙh�ǩ��U3�#�̻c]u��<,���62�h�2�eZ��OneI�t���_v�_q̟�.�Un��*��UR�G� �!̰A�u�9�r6��2dKyDUi��Vc�}�F���}\��������xԯ�He�'*��^L���(����L��٥Fo4,��!�6p���+�D�O��kBt �xu�e�}jh;sz��������<{,R�^�,Wqk}>�S�����c�{u�� h�c�M00�s�?�4Ͳ��1\@q�<�V-DS���D�/�;N<OZ�L�V�:O�[ț�;��^X��1D�V
�p*��>&|�B���gիsVT�qLq{����`J��������+�U ���)������Zf�t��qϚ�ߧ�V��&Vn�q�6
}�zL�-pP4Q��k��P�=���|4�{cԟ�$Z�T#�����: Xua��qY�q�(��c��3��_B�i�I�N=,s��u���(�&緵b4M��O�BY6v1�^'&8ac�2>�jͶ
^CL^���u�`؀�^�F��
~ƒ�TS�m)�{Q.�Zml!�vB�_7R<L��������L �}M�u����Z	CJ��E���R�� ��5��%(:V?jl��UH��Jk���v�OA*?(t��0�#]�r��y*Q�ʉ�1����c��,}��M*2��^��TW_4��\�3M�a�E88YDTG^�ə�_��F�8y����¾�ߨ���/�bY�F�撑5���CS�5�%V���kC�X�p����tA�?��D���~�;����CpL%��
�w�	S���@�՞��m�Vm�9F~��̾�2\��z\����F�f�*�����l�g�`��z��.x�
���A§��B�M�Ch*@��|`����j��z
AkjN��6��GO��������EJx���^d�C.��ഠ~�\�k�^I��x�_I�N�?�h'W�W���56�&)���Ԟj.�x>F���r�_N�|3cZꜪ
�-u
��j�A��+q$� ��(�
n"��^���_,-����!j a�3���ي0v�:#�X�����>�?jb��n�O}5�(�A)&����iu��`�j���aIo#���wm;Ԑ��'(��C`����������Je��u\�$
 Pж>.�b���G{�	}Ɛ�Ȋ���2ظ�&Ir�O�y�!�$_�ǰ�����.DGe�a��Z�ѹ��Be�n�C��ٟ�ƧNw���7y������y�;b=�]�Q���L�!n$eɞ�!xk�V:B�g}c@��=��1nI���^m��+VZ�h�h��`$"�o���8�o�6l���y�JfPГ�l�yI��೨`d��r��4}���[B��ǉ8T%�g�����X+��^~�n�ӹ��8ݼ�|N|=�,�T����
pN��]�5�~jZ5=�ee�u��2��Ԟ���P�ت	OJ�vh��s9ߟ�z�����I��oI�*�D�� e�%�dY6i��Mx�T
��;��rY�w����_P/�cI��j�0��3c�z�jƉ��Ui���Ӽ��{0���$�_�H9����^Y` �P�7Ұ���|a4�㚓�ů
e���V]+OoE�m'(yoQ��R��o�O[��5[�S�2JUJ0^Na�� �*����<f������b��������E$W�� �]�N�63�����x�������%N���CRh�n�)Qbɲ�e~��#G*����~޻��m&ǫ]�]��O��a�&�e;�`Y}~l�FI��gSB"�{��X7��lLA-��y��ո̹�=�2l�*s�6���S�9�&�4_�/�~�v���l�/��9�1���Dк0ihN���%h�+��۴�HO�Q��|:��I�r�;��qa�I��V�j����u�c�\���:T��ԋ3rj�o��.�ʸ3T���1��3i߿�}�/{�Q{�}?K1.�ߞ�ED����;�8�R�%}�K���h�'�iz(Ӭ�g�+�7�*�A������D*���/l�}t��~K�Wm$2˧��gr9 @�G7AB�f[�YHY�'ɦ��D�S�2y<L>ں��{�����D:�G�+��( �{����7Of~�0�V1؉�*j�9�����s���
	_����n�axg��f�*Rq��Q��c�rՆUA���-���ʯ^͔�.7��'b&�3�X!cV�e��CD#l���PH�˯���8����#X��C��f��
V�
��s^=���ч޶*��
,1�');�����l�t���q�k?�T�+ߕ�G�NByq�EFC�Vi��>�MH_��x�wm��SZ���T��j�+Lh��B$�Gz4�}�F�kHk9(h/�Qм�+��!�.�U��'������J�U"�
����Ŝ�<:枉2�v7�
��ߔ��7��Ez^�jd��� �x��3`�ii���>�[E��N&�#��I�,�F7z��]� �z�b�E'o��>-�"U�����w߿uS�(�}Ss�VI2�o/�g�0�sqx|j͚�5��b\n3�k�~i�gY���'����˨+�ʩ��e�������������Η��(mQ_'�UT�A0f���0�ތ�!�7 �#lM������������n�2�6���O�Q�>{ ����x�?����s��+�ee� ��0�E�Ll��Q.�B\r��&�B�˳��C�Wr
��_ZP!��7Fenǭ2׺퀀��jX�(:�Bt� }�����ǯ�u	X����?_����H]6�4�,W(�F(�\�`./K��C��Y}}n�6};���Sݹ[-��bN���5��Ћ��<���ÑP�/�ֈ�zӹ��7�L�v�o�����7�����?=��W��p3�pp�|����ϟ�@&x8�(GK%H�h	�O�u��R!��b1�bG����A�Oe�J�����pn�ah7_W��@��L����EܰQh�X�΅%R߃�&�eF���)�T�c9ٮ(�����8�����'����)YO�B���N*����HE{�)TC4Sc!%T�tts0�V��s�
X�z��X���P��f�E��/Å&������o`�gD�m�������0�hhq����<�N�� ��7����L׮L
+O�=^����x�?�dj��.           IH�mXmX  I�mXا    ..          IH�mXmX  I�mX��    Ar u n n e  �r . h t m l     ��RUNNER~1HTM   J�mXmX  K�mXL�u                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// Generated by CoffeeScript 2.5.1
var Height, _Length;

_Length = require('./_Length');

module.exports = Height = /*#__PURE__*/function (_Length2) {
  _inherits(Height, _Length2);

  var _super = _createSuper(Height);

  function Height() {
    _classCallCheck(this, Height);

    return _super.apply(this, arguments);
  }

  return Height;
}(_Length);                                                                                                                                                                                                                                                                                                         �6��x��Ǭ׶V5�!
Պ�6?z
��xG@2,�=�2EF��.���4T*��f���d����_�q�b����=ʢ:n�V�a�y�~׶�,O7,Y"�X��I����*�m�s��t��ǻ^��AD6����͐�L�"A
���ט��=��$3uqU�Hj2t0H�0[&��qP,in<G.v�o�@�5J�K�l�U(�c��c����V�>�"��^�.�݂�J��2}9D�Ťh�",�
�͍�(x���!=�`�Q��wl�����O�^�{#��ō�*
�9��0���i��-�@ˮyV��_5\mzk�w��߱��U����R.�h&�3S�FH�d���������W�0g��s�M5ٶ$�PE�L3Wi��U$��)�I�"b�~����w��7FBC/���,:���+�?C�=�ՂݘFs��b����4Z�/[�%��轪ؗ-����n���ޗQ#l!U_�ϛ�ô
 ,#�84���E��k�61��4�Lg㟲�\�n�v��TŖr��%�#�3�Բuĥ��f��e+)GJ����|(���Κ�G6�1����D��M��E9"�%�E(�i>Z?m�P)Z�23F�Ml�$� ��?��Ki�B� Qڞb��Sd�
Qj���z�ǩ��:q="$���/�����w�?��T�~����B>y����6��r�'acHp<�A��vao���F���X5����&^՘�E~+4u!Eq�`n<∸��Ip܏�/lx:�l�ִR��'o=^{g���&�AN����B���8�D����-`�\�A��5���G�jVj�TD��ۮ]�9��l��*��Z���%ڠ�0��k���԰(^�����&�p�[�����e�\|��њV��;#��8p���4*~��a��ߙ�*x{Jhn�Ә�LI�9Qd�����*�\� /P�߱�[y3� P���.Z<�͠߾Y�6��+֤1�
'E������bbI��҄�!3����n�W:�f'�Z�[���U������
����ɸ��U��c+�4T-�ۄճ��Bn��,w���s�n���㨿�I��]��N�7���$"�' Ȗ<bL�mt����K�+}�dVm�7��>�bKsϛ���c:��H�S%�ao�yU��
Ȧ dN˟�,���7�~�6s���D6����1I^!J��*W3A6!�K�t�*�"�h�e�	Q�2R���s�u��Ll�\���wr.�ĆGn��]�A��U���uWL?��"4�-D����� �ӆ���f�c��ɕʮ1��!3#��㔹���3#�#���28ĈB���I���0=ea�R��Ҍ}�mq�fJ�k���J���I(�� :SGG^�M��P�V%�ۼ��JǞ�����5x}9�+���]҂p$��%9jy�^���+"v�gAō��e,fLI��ZU��8��w���E�"��7�l.?�����Z��ҝ���	��ɓ�����!/���b�t�
��8��Q��v&+v���U��D�Xks��ڣ'�on�?�:�Y��+[F�
oǽ�=���BZ	[��?f��ӳM�KX�D���i_d�"к��G�1�x�8:�t���zY����j��������|�Z$�P�_.�Ţ�����M~1�,��6�M������o��yM�}�'y@C�\n/.�6��������?�j��B�u4�]���+M��Q6X��Z�q�m	T��ߩ��`�ϼ�
;�\VK�JEzBt	w�0��
x+
.'�MaqW����L
�"��9�q�Pߣ
���������&$��B�o'�Pu�Pj�3r��^k�{��}e����ͤ�������#� �&�Ud�*RBH�I��zq=(�:\|��|�ۜ�4�X��!�3񷼷�$	<
��z�\�3W�Z#�<�T�.�A
�;ʺ[��C
^�m
���$��$�:UFH�>ಪ3���[3�5�����9��?��D�=x��ݏ)ʨ���-w{4vg�t�6��=��^z}j��$�{2ޭ�
�@�e��E��O�O0����'_�ڎ�����$�i����bH�rL%'�W���ɼ�^9�_���(�_���O߮�J ��T/X�6�ٿ׺:I3d�����q�Z���ɣ����r+Q�v��Ț���KF��Kߏ�ԤZI��I�
F�����|f�^������%6�G��.��;g������B�����3@��Lw[x�0V�%��ּB4n�@�#�+��%@5q��,��]�¹ ��c�u (}��F4�L�ä���U���%e��C8��r��i}SAa��e
��K���b�&�)�c\s��?��)?�3I����\�-uY��gu}/�j�¤*~d�,Da�&F���k� A*��MSAJ�g/������B�,�g�G�#����llsf@�����M�<B6�5�L��|/�'QY�$f�a?A�kR����W����3�5_�RQ�Vܘ�4`�!�M����g	z
��_1��J`02�U�!qk�N�,M�E��^Y
:����vG~��,{~H�p���ׅ�PR��;�z���ŏ���Cz,i�e��~�2�NC`b�f��6�xT�-X�� 'X�����6r��G��̳N���c���M��T�M���g��n'���K�����+p�d ����6�U��܇�.��m�ڒ'
$����a	��3W�c���ߜ;���_��V#�$G��dW�'�)G����S��4t}bߖ*����S7o��Qs��5��a����3���7(���������6���A	��q�u35���U��-���3�MMD��2�~$���Xc�g؋ϰUl���)����o^�ۿ��J��P+�����s{ױ��`3���Ӝ����A��I�T��/+:A,^��7J�VtR �ɲ9�7Xt���1��k-ub�� �?f�rb���;�:��~V[_�8m(�uO��:����u�艗9K
���^�3�J
j�U���P �H��W�	�FY�.�ɏ���Ts�p8iQU�F�Ց�k�G C1�� <q��3K/�A���$ũA�ǘ��M�e��CA�.��:3Ҵ�0���h[�AA.�E1Q�{1����}Wo+MD��!�"���g�7�������,��b�VM�A������Iԏ�RJ�@C������=#�d1�#Az���/�j�g�;͟��@�~zT�vpA�"��T������^H1*Д�zרb���#���hÿʬ%o֨6���(~������gm���A��S��u:%.��NB �\�t�d����Н��{��@$O&����ާ�ٝ:��;/xS-����<#EǺ<u�B��i���3nof�:��s��<�`��
����2?u��"S�,)k�]�>�)o^�g�U���x-lR�H=�?�k=}|�H�Ґє_�*���[ey��Q:Yp�`��Z$��� �8;:� � Y*gC��~8}��
��qK(�*�Q�$G4jk�ew��uJ�4���oj6K�Q����t�(2
[�����h����o�l(F�
����3���������5/&k�5ȏV����MM'���>0a�~��8���������/�TZ��gq5.�Iq���I�*�6�xR�KӖbW⦊�.��d�b8�B�֢��ND�j`9��/.Nrw
�`�p�&�����
/>I�\J��A��9��ٸ�3���A�7K�sE�}�0���j� 15���[��cZ�����6^`�>��j��'I��X�5֔�����1
�NpqYT��j�
��m9B��NS�W�f�q���H{��C�FY0�&	,�P��� ���*�l$h���H����C*$-�Vx���X���7�J��¼s��z[��u���t��I4��Қ��|��h��
�pD"T�rB��Ȯ��9>͔�h0 �Ȕ�.|s�1�э"���d�pP���eQ�:߼5WG�mC�)}.��U>)ɴ���M�w���	`��S�{),�"{~��{�p�"Dh����Q�o��P�����;U�`fM�M��
�'!�r)��<<��=V�Q2��/��|���h,w]�}`��b{�S�	�(���
5ǎQ˾�"��@��m��� ����q��̌�T�1 ������?V_{�� �@�� �����{i�P���ק�\�ª�t(��B�T	�] 0�I�}�5�d�b4���\�����=�E��"9�3�%1q��':����y�jA��P*淇"�'![j�^L�D�+� F�%��+��mf\���?b�|��t
��m�Z��*� Ъ�=2�����9�չ�������,<A�]������oND�I<m:OI(H�ƶ<W��l�Q�%���?�
�ݩ n<����|1��W�nQ�]Ze&��G��pN�
�V�H�2'8�lAM�� v���Ŵ�b.km�Z��	����C߬�
�����ǖ!�DTq������ܖ��w��}�dZz �C�O1�*��''��� *>2�ԩ�{��3�������kvz��X5+�2S!����wBU�Ӗ���d�P�\��Ƙ�X,ƵE@6� �E!���{f�� ��"Q՞X5�B�&K��y��W�G�?wB��cn�c�Z�L�1�E��7,]�!M Nx�����H��P�2	�uM�� .*�	\��( ��5�
/�J!u��z.���-"��|1L����1�g��=HG�{�U��l�-� �p>y����(����
���ȶ�J���\��
�A|A���Lr���orȃ:�#��w9���8�)��y2͌�[�%8_��3M,��=�
$xi��~���� ��!��g���w�L��*�/&P!攼��Ԅ�"����OuC/�����g>�xbK��֕KJ����H�=6��G.�?^?����s}/t�y��� \��W5�X�}@�W���aS��R���\q��%b"K��,Dv�`f;�2{��dd�7�{,���]݄�|�la�����j�pkvG#��!�!UH���1����%�"]U,qrܨ�=�Aը�?�,�u�3��wu�awO���X�.*�B[x��\.'�\TϞ�hO�P@H�Ry��=����s���;���?�^�]{�Sgh�'@Ŏ�b�#�
{�� �ͅZ�xb�"Ϩ�wz㤯f�-�i]�-��T�n�Og3$_�j�.��5��*}ҡi�l�V�˰����;��g"`�B��D&=�y��mڌؖ_ �6��P���T����g-��6íy���U! 6*Ã��G�ZF/��1���b�鋻Gp]R5�/�f`��e��ݚ��c�Ҳ���r�SvBMM�4������
8`�ԅ6��&x�2�9������XK���E�Aj=�n�}�,�1�<��=���H� 9D*v�%q5��E
�:B����5֮Q��Av�Y^�pG���k�ʀ�1^D�DMG
�K'A��V�w��:��	�j�lμ�.�9��[��:���A�����Z-�+˧3��\-��X���?,-���y�݄�l(:22�*�Gظ�Z
nC��X��g|?���(�=ހBl��!e�Y`::B��7���˞]# ���/*yH΀U<v�grCÅ����j3l#
����zG�e��-m���n!�J��p��orNlo����^��:�;�[�Of�w<�l�f/G��
F���F����)��`���uO�sm>���XOvv��:���E��Mj��Ӎ���kj%t_�B��$�Ρ�Ȋ�F�� ���`��w���W��~��#}o�)�$p�9!�֩�3|�a1�lt��쫳~>�r��G�����?%)�{�j��Wr�U��R+���?'���:�>��m9�Ut
Object.defineProperty(exports, "__esModule", { value: true });
const FormatterFactory_1 = require("./FormatterFactory");
function createFormatterConfiguration(options) {
    return FormatterFactory_1.createFormatter(options ? (typeof options === 'object' ? options.type || 'codeframe' : options) : 'codeframe', options && typeof options === 'object' ? options.options || {} : {});
}
exports.createFormatterConfiguration = createFormatterConfiguration;
                                              {.e'�@�䟥��o��=���<��N41N�_�M-��2PbQre+�QL�U,Ƌ���*?^N0�����T��*v;ylq;�FvZ굍���[O׵�]�!�6�@��ӜJ�Կ���R�����y���d���X�CQV(�~�'^Ok�V!� ����*��� �X���ԕ�\Q:�Lm]��66��NxI��j��{�#���M����]"=J����#�1���O� p��z :o�C�E��)Ώ�c߮�������O��zљ�.�o���?1����<��IB (�,90��l�Q�E�F�~$��8�� ��x�8�[i?�� Rx"�5fJ	��\.
le�&���&/q��N)�6c�Z���[ǐA+��/:�;H{.k�}B�A�'�V�c2n���8����A��̒�&r׌�u��+P��3zr;w��s�a������2ds���yH��-�:���ny���h3=?������[�ߧ<j��sӌ��U�|��ʟ;��>?�4*K�z��??׮�l���$�ܲ��].�+�~� ��eq�0b������'V�ܙ)Qܺ����YTA�� n� H0~��wCw86��a��ӡ1ŉCL��2#�.�a������l�\��GG�f����EN4���	�ɥ��wS�+��|+��-�a�=��Z�p
N�!��%+j<�8�讄ݜ�r|�rt��*U�N�{bo%�Y�N7Mqw- �����}J�Ӿ���IB�N�V=Ý�Pl*����)�#���Z���wQ�8�<6t��vF!�T8��%hT��JYtἪ�f��f.��0�����8��!�\g�)$�38��_D�iN����>��fI:�3� �02p;w
�Ӻ�(�l��L}��#e��H���8�w'�u�'��ի�N����ܻs^��Mv��DB�1#޵�#��((-m.]`��].��^�ف�1�dȦ��RˊT+}>�9�@%H_�CͅP�vS�
���Ȍhw��"z�zRշau.��l^�U���N�F�L�B��`۩�*t�b�������^���&����oJ4�J��r�P~��e%3���D<�v��b�=u���2���|>~�63�)Ly�P�X�.�B�Bd��8�q�
h֩��Ձ�?��?�]��$��544���1��1C2DvjZŀP\��S턣Es�I�*���Ă��}�/�T����l� ���g�o�+��l��T�������t�n���r�e�:y����"�t��S��.��H0��.O��l����2d��dY
0�Ľ��X�>����ǫ�GJ��R3�����ۘ��yr,X��<�����8Go�G�:Ae���+�[:�^>�2H�b�͇}���#V�!��R������@2+(��O�7/ɒM3F����]G�k������X�&|����y��W�N#q2W���<I�O��-�K_~_�)��U�:��!�XM�bG̤)f���2�i�4�"���,����B8%�� ۽^q�U0R��bɺ� erX$'S���5q*ܚ�>\j�]����ز'9zT�a�
f�Z��-< �z���2��Ȇ�jm�:tRE���$�".e閆����}�`���6�H�3��N�V��¬tDt0J��Ig���#��dS5��X)������b��d�g˸'DkO/h�NB�?�0����u�Fn\��%ˎ��^�,g["�D
 �ݢ�XrO_b�KgW�t���������Npw	��������	���%	�����
����zW�U�_�r�&g��#c�}���8P��WyBs-���ʦ/�e��c)5K��P Q�JƏ����ӆ?�r������l�Rz��js�qmkٶτΡ#�%V"""�@Za��V�iK,7�r>�89�p�u�q��Q:��8���2��@�&zHR���_�:c��l�ҽ��;w�'W�3~Jsg���`��nc�&O��I���@����Rq��� ��E�ɵ�t���e�)�A��T�E`�&Ӱ��#��C!�2�L,���pTAz�8����>��@(
����(3ء����=����_��#�k�5[Q�ގ��S�Ы�h ���[g��^�e���ƨg��'ɫ�O���ń�4 ��8�`e+ŭj���}�f���ү��kD ݠ��=Vd��:!uw��e����f�
׎���]x��6�K�J�S��iUme��[�_;R�+qL\�vK����{�|�z!���aD(�
ԻJdf��@x#��"�`�k�+w/��Y#g��>hْ]g#��H<g�����|�rg�Օ}�~��uܾ�u�[�*��H"�u���r�3:s��C��"����1Fr�K��L3:�*q
�>
��ABԌ�ֲ�4����	�=�N�Gg
4�]O�@�0���ڕ�`9��(�1I?B�� <Vj �(�N�?BzX)	�x\u��ICa���P.���ٱ|�%��ӣ�c�?0���ZL����&E≰��Sӷ�ւG�"���xM��={0u{�Ԍ��C$7,@�
�a��j5�v����Ȭ�s�_^����MZصy��;�=��Z�k�S�tC��3��o�#x�;���[�����?i�gc\��m�JT�g��I�‏y�o�|��>" ��ޱf�џb����쏪(c�H�YF]��I��;=_n^cw�Q_�Z����w���'�h�KlT�5���:�[n�m�{ƚ�Ʃ��@=l�UA�
4�}���Y�[Bl.�]����ga���=����Or���uIkμ���Մ�i
n޻<��4���њC  :�?�$��J���һ�1���p�
%
5�8M�����#d���ں�`W�4��
"AU�\�V���C����ƛ�q���8�!���yD�jV��{/�+����[��c �y�J�ë]6����gB��9�0�C�EDs����O3��g�)�C ���-#�~�yr����F����!���ټ��
c�3}<� �H�r�Q���ͩ(��n���V�6�|S�V��vV�r3R
ZJg��+�BI�� �4!r�cN璆��ƈc� �נ�u�d�'�T\y酚lt�B����-����<�x��d��3\���[�/�L*��.9��	L$1��tI���E�WtP�B=.b=��E�j�W$�7W�#�v#+�7�pV׌,zpi�����s�˞V�-�N���b6�z�A�=n�G(�� l��J�S�.@D��5�*�,�]�!���W��)� ��&��v���͒3�ü�A<I[��s�)d�e+���6�L�>�^V�rV��5M��k	�� ���ƕ���H�����y`��Ϯ��Q;���g8?r2T�����H`�w��hc/�6hMLE���:{�����Q�F��9��˶���dy7����5~A 3�Sk b>�9��u�P�@X�1��S�������v}�\R(�ݝ�����
���F�f�����}��#�( 4ټ*�'NM� �4�i�j�v�o�WX��r�(���e8����^�S:��c���z��p�ؖ�qj�g4-�K�,I]���1�}�+��
���ddO)�s���r��Q��_���Du�PFq���nlJ��yW2�����K�a���e #�X��ZEv({������L�vd3� %�b��ߏo�Ȑ��2@NLCx2@���D��O �{?r6�]d�2Y&
�ʉ�V��A_u �  �@4$8�w�X�/r�����Q;�U���O���l|g],i_n�w?�e���#���_�.\��H�ei��/I��CW8�4��?Y?�#����tD%2��2��ύ�a�U�V{�g���e�#NK����R>�u:aa�;��#���D��*(_b��v����)��C�%'"��n��%Y��*�.AE;���$����*�4�V�#�7e�i�����Q�Ʈ"3u��^��,(! l��VxlW�}��l臈jP�)�zSF&jqw�\5�4��af��y�dF�4u���'�#�o���Z:�׶��U_._��q}�<B��+A����j�i�o�c7�J��	D���=r�?�@ԧ)D���J(:)Y�經�Ⱦ��M0�#��h�&�5����
��3nNA�ZT?������@ID @5��淪�;/ M�=����
�h��Y_�Pչ;U�%�7\�E-p �2�%�iA��Αr@�'$b%*ߤ�$}7N�(�s�#� }9�t��9V��ꢲ���養����eu�����6���g��l�����B�H��ASn�<����c��O#9�$�ݤ`�t�	KT����玌ۮ��h��T\ޏ}���.u�P��]*�fu>�t�8a���*��B	g�~d����O/������B߃P�_��X��S��LA�J�`ڕ�¨>��Yΰd���&��-.��ٶ�&_�McCg'�8��>�*#��J�k�Q������v����J�ko��DP\-$�A6g���yJ���Ah�c%�'m\3���m�_�k �b;H6)���h�+R��#V��8}l�����יn��%�'wK��(�%�,�-�o�G`�B�"�������]:��)xg���l�ll�b�͖���B���mawն������DF.wҝ���VQ��?�8�e.W#i�,gj�`��j�]����9���\K�?��:�m]�s�]����盒,�.Z���R���}x}����?=o�=�����k�\�b��q�e!+S>D$�*\%?�:w�6��On*��$�.�ު�з��(t^�
 �쪎5��6+�,���>u�b���n@�F��z�� L"`
��3����Ѐ7vP�t䁅om�Z�IGQ��������N��`yj;���H�D��E��a����=C<$J�������?�Q�"�Zq�o�&�`1��N)�/�P ������c1$�B('7�Y���2R[_0����9a���!�U��jʒ�_|�x�/���$���;��އlMTAy��ә6�b�v�!ǝ}�sWC#\���K�<uiK��
\t�ir%���q>ٸ>��)5~����f �!"���TR���Uo+�:]:xöߪ�dv4R��q0�*� ���
����i
.U9�	>ZLp��o�@w���M�X��+st\��>��-��!�^c�,\<�9����i�Ͷ��;qH��u�oGӈ�� �L�������90�����C����课ʃ֥�=�"|Q��S���ْR��$QM��K	���4��p;(��+���G	�J�����P~��/^aBqꐁ&i�Ta��.�3�I�?�m���Bk�����|7�qr��l��q���_A#�l�<���!D)�FIh�2�awB���D��3?�����ӧ����{�h�4�l��}���	i�E��eS�Xv���������u��J�@l3Ϻ0�Ke��ùd��XA��g�7�|,@�22���O�$b�����Aa�-��zm�UO�v��!�;/-� �8& �^�����-)���G
"*��5��.�2>4��q��P���:)�ĸ���aٰ��,���-ږ��0�ٚP������no���Œ�����/� �Z"ƝU�F=��&�ؖ�v��s����~��