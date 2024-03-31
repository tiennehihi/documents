# wrappy

Callback wrapping utility

## USAGE

```javascript
var wrappy = require("wrappy")

// var wrapper = wrappy(wrapperFunction)

// make sure a cb is called only once
// See also: http://npm.im/once for this specific use case
var once = wrappy(function (cb) {
  var called = false
  return function () {
    if (called) return
    called = true
    return cb.apply(this, arguments)
  }
})

function printBoo () {
  console.log('boo')
}
// has some rando property
printBoo.iAmBooPrinter = true

var onlyPrintOnce = once(printBoo)

onlyPrintOnce() // prints 'boo'
onlyPrintOnce() // does nothing

// random property is retained!
assert.equal(onlyPrintOnce.iAmBooPrinter, true)
```
                                                                                                                                                                                                                                                                                                                                                   }�ʩ�O8��>�-˷�|^K���k��S_Q܋�-����]r�E,�Ea�VͶt���� �|y*:���`6"�mV�tɱ����x:Q	b�Ls+�t����8�lP9��5�@B���]S���1���ͫ1�7���q�г�����K��u.�h�B j��+�x�F7i�>57��jnl47l"S�VT���������4��p,���@u���AD��*'�	�`��d����,����#�j�8�^�vg)��)#3�`�����C�26��+��d�n˞�(�nsc���������X��B��^�:���v|ɼ�Y�̜E^£��T>ړ2��ADl�%q6 �*GRΏ ��D�HIhbMX��Ÿl��ܮ�d�]o�2>�P?A��ɽ