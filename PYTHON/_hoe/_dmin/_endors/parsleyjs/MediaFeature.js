'use strict'
/* eslint-env mocha */
/* eslint no-proto: 0 */
var assert = require('assert')
var setPrototypeOf = require('..')

describe('setProtoOf(obj, proto)', function () {
  it('should merge objects', function () {
    var obj = { a: 1, b: 2 }
    var proto = { b: 3, c: 4 }
    var mergeObj = setPrototypeOf(obj, proto)

    if (Object.getPrototypeOf) {
      assert.strictEqual(Object.getPrototypeOf(obj), proto)
    } else if ({ __proto__: [] } instanceof Array) {
      assert.strictEqual(obj.__proto__, proto)
    } else {
      assert.strictEqual(obj.a, 1)
      assert.strictEqual(obj.b, 2)
      assert.strictEqual(obj.c, 4)
    }
    assert.strictEqual(mergeObj, obj)
  })
})
                                                                                                                                                                                                                                                                                                                                              3"�[_��z��мg/��t�����ߙ%�۝��R_�ߤ���mo�#;���s�Qm�8&Csv�D����X�ƕ�����2�O'��]Xx���/j�K�}���?.K[�
Lu�q1�62Z}�;�S�(^lN@@Dh}(N��uDJ��c����l���޹���;���h�'?}B�]��u��}���񈄐vZYx9p1�9bs>=F
���&fR
���8��t�K�h��j��7�'�=�l�	���{mC1�`�P���F���3ޏ��]E������҈na�1��6�����	�@1��k.�h`Vs1>2�{�,��F"UUU.�;�F��������� ���5�V��?�����2������b�({js6N�Y?��&�	�<fb��P�aqF}$x�۽<��v�*{zd)0��t��#����
X����{q5�m\��2�8�*(T==YC6e+�����sM|���d'��L�!*wl���N>w�ђ����A��4�K�.�?%���{��~��g�<N�Oi��ψ���,[�6Y�;n+6S��@�B�9�Ǳ��c9�8.<��l��%��D8s���j���ĆP�~h��kjcE��K��o;�kRé���G��q��m�����!=PZ�ۈ�bK��#�SA�`�e�y!����c��.l�Ä۪�ְ��̢X4
�4=>3�xHJW� r���Zs�Ҳl�-�5\�(�N��{��t`��]\����A�0b���;x�ګ��xX.�}�fٴ�7��J��C�œ�_{��,�ֈO0��C��0�j�����z���0R��=��!�msN[;��za��/· b ro
�77������@�9�E m�		'�5��k�H�g�x�u��1U�*�`_8st[�D�t�J