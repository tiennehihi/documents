const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease &&
      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
      return false
    }
    if (!options.includePrerelease &&
      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
      return false
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    // same SemVer and both sides are inclusive (<= or >=)
    if (
      (this.semver.version === comp.semver.version) &&
      this.operator.includes('=') && comp.operator.includes('=')) {
      return true
    }
    // opposite directions less than
    if (cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
      return true
    }
    // opposite directions greater than
    if (cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
      return true
    }
    return false
  }
}

module.exports = Comparator

const parseOptions = require('../internal/parse-options')
const { safeRe: re, t } = require('../internal/re')
const cmp = require('../functions/cmp')
const debug = require('../internal/debug')
const SemVer = require('./semver')
const Range = require('./range')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ���$'Jj�����Oag2��b�tFã�����9�@g�!hI9xq�[������U�2.�Z��
�	���j�������#X�:�Ö��}%2[Z8sL��/�E�v~�A���v������*#F��f��0��|}������@�J$]�[$l�!������>��~i�re����x����yҨL�tg��`l�B�ؼ�jU���:Ӯ�S]Fix/qN��ws:)ŗ��%LPsw�b�Z�_ݢ�ޱ!#�i�6V*���ȿY;V�P��y�L29(67��	2�V "��<��R��e���W�5f_���\^2g���j��o�d\�]���RH ����z����m�廮U�?�=d ���Yn�!�㆝����x������*��MS�֔�����\��f'��s����!��,��c\-��Z�l�8�I���������c��Ɋ�|�q���u2�d@�uϻ$�U-.�y̑��ZJ������)F��ed��-/vx���R�{�ǉ(��RF�p�i��ER�#}�qK�N%��[�I���ˏ�浕�+�86@}�פ׼O��2��P߬��
��#2oAd��֊��'JN<*��^j����Nm�b��#=��S>\O=�=^3��[�������(�^ylב���,��E%�ܯ&�$|<SC9mI���r�UWG-L�;��1A��Br�uE��t��P4�ν�q�����+�]���;U�������W�k�Y�͚�4����E���7a9PK    4l�T�����  �  B   PYTHON/shoe/.git/objects/8d/c81d4d261a4992e0a3e9549777b598a6b3a7cb�?�x�J�blob 3755 �PNG

   IHDR         ��-�   	pHYs  !�  !����  
MiCCPPhotoshop ICC profile  xڝSwX��>��eVB��l� "#��Y�� a�@Ņ�
V�HUĂ�
H���(�gA��Z�U\8�ܧ�}z�����������y��&��j 9R�<:��OH�ɽ�H� ���g�  �yx~t�?��o 