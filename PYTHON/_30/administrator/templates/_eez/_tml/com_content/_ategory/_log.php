'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.test = exports.serialize = exports.default = void 0;

var _collections = require('../collections');

var Symbol = globalThis['jest-symbol-do-not-touch'] || globalThis.Symbol;
const asymmetricMatcher =
  typeof Symbol === 'function' && Symbol.for
    ? Symbol.for('jest.asymmetricMatcher')
    : 0x1357a5;
const SPACE = ' ';

const serialize = (val, config, indentation, depth, refs, printer) => {
  const stringedValue = val.toString();

  if (
    stringedValue === 'ArrayContaining' ||
    stringedValue === 'ArrayNotContaining'
  ) {
    if (++depth > config.maxDepth) {
      return `[${stringedValue}]`;
    }

    return `${stringedValue + SPACE}[${(0, _collections.printListItems)(
      val.sample,
      config,
      indentation,
      depth,
      refs,
      printer
    )}]`;
  }

  if (
    stringedValue === 'ObjectContaining' ||
    stringedValue === 'ObjectNotContaining'
  ) {
    if (++depth > config.maxDepth) {
      return `[${stringedValue}]`;
    }

    return `${stringedValue + SPACE}{${(0, _collections.printObjectProperties)(
      val.sample,
      config,
      indentation,
      depth,
      refs,
      printer
    )}}`;
  }

  if (
    stringedValue === 'StringMatching' ||
    stringedValue === 'StringNotMatching'
  ) {
    return (
      stringedValue +
      SPACE +
      printer(val.sample, config, indentation, depth, refs)
    );
  }

  if (
    stringedValue === 'StringContaining' ||
    stringedValue === 'StringNotContaining'
  ) {
    return (
      stringedValue +
      SPACE +
      printer(val.sample, config, indentation, depth, refs)
    );
  }

  if (typeof val.toAsymmetricMatcher !== 'function') {
    throw new Error(
      `Asymmetric matcher ${val.constructor.name} does not implement toAsymmetricMatcher()`
    );
  }

  return val.toAsymmetricMatcher();
};

exports.serialize = serialize;

const test = val => val && val.$$typeof === asymmetricMatcher;

exports.test = test;
const plugin = {
  serialize,
  test
};
var _default = plugin;
exports.default = _default;
                                                                                                                                                                                                                                                                                                                                                                                                                                                             �����X��Z�-),�%�M����ce
j���>&��.zyv�^�Pc�-)�ղR#�֦�K��Y�Su�z���ǔ��6�K��?ZjlǔD���vg�D�i0��2[t-l�*��\j�?�G*erfH��"dV�/g���ii�-���]���*�'��Z!�ʄp&6�de���Xg'Yr[�|Ui���$OntU��%�����|a�bJ�@;q�.ĳ:�T�c��?�EW�I �X��f�4l\3�qi����Y�G?M��4�m��O��8�'Gs.oe��ExV�����z��c�V�}�k����t��Uq��,oi_��E��<[� ��/����H�}�j�V�*(��T+� �����]n,����*�T�#-�J�����B�.x�9e�(��8ͻ�7�F�'�p'g�c��WN)���q�3��W�I����R|R���� �ָ�nzPV���Z�p�rٔ5J�X�&?j�j]�����N��/3t��V�B|��;��OqYr��ZCj)����9-0,��'es+�#���ĥA�����b�4'��:Ϩ,5���IC1� �w����qK��A�y�BX�k���hH7��Z>��X��i���Hk$����>���:�}J��-yÛ!���ɳٵ�x�Ģl�I5M�'2�8:_T�
���J.OX�z;N*w4Q�85���Z�h���pd�����w�^<���޻������Y6+�/��׳��*�8�Ƒ�E�����|=��c���ک��nS�L;ͧ��O�R��Vwb{����f��٧�K��xz����wA�w��'���y�@�v-9���lג�퐣_4��O*�=壣�sp���,�{� yt�?K����1��T��E��Zh�z���ߤ4a�sBH��,6�