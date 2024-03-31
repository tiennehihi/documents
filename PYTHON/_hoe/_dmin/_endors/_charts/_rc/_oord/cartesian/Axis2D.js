const SemVer = require('../classes/semver')
const Range = require('../classes/range')
const gt = require('../functions/gt')

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion
                                    Y���%������D�*(�B���w͌�t?4L:2��2��-��z5(��e
�`� �{Dd��b���W�)���J�1�Dd�Jw}q\r����c��y�j8,:�T��ơ"�$��p��[�~�otѩXF�0��,l7�/PW�@��|?�}j�Z��k-��r<�x��r��ϥr<5T�����F$^2��<X�d�)��׿����.��)'vu��_E� ���������o�4#�Hc�$��$H�A?�s��Fo�� ǌV�[�������WM=�Á��dI��<�rA�K��N�a��.> ]�Zy=7����/�ֱ-n/�`��w�!^�p�D�p��A������|3���j<9`��>"�����8�`C G?�j�����ρ�� �vc�l-��@��=�;���8�j�8��kD����Ό=J��ak�;Ʊ\G�p�[#>�����H�"�v�5����m�a4k ��_�����'���n� �;�³�%%k�\��P�u�^6��U�]D&D����Mi_Co�=ԉ,�Dl��w<�ڃ׊�����(.��I%g�(�>;���8�12T$�����h��}�P� )� �c��})���4;#j�^B�h�V�R8`��O>��{Y���Aℚ�`JN-XF�8��}�*OxF;y��l�5(d����?/�}�3�|ÐO�Lt�u9_��9�0qS��̽Of���>�����G�����k}e��da�tm��W��?�vz����*��i�B�Д$�.Wz�;��5�� ��v�� [�y}� �Ť���z��Ym]d�2��`Hl �k�+��ío��̛I�&��6$	T��¾;�Y�칓��|�G�K"�Ԋ�[���� |F��h�9�o x���S�}��xR9�$��#�EO�������oO��[�t��5I���~3�1!A��~�o�/Eյx��� [��+H��t�Č2������@�;�^�</}nd�R{70#���?�Xt8�j�lmRt֪^O�J߁�b2�q���Y/=��@�|Y�(|=m�;�����0���2˜���?6�����SK��?�� ��Lk�B��}�.x�����
��uky��V�>��[�1��e��H(G%]���"�@~�Wڿ�_꺔�u��o-Ԡ`I!�e�����_5��Fa���FW�/�=l.W��nV���|`��(O��x�-�0�Ba �<���y9'$�ɛ�w��$�'� �6�{.��w�ļW��3�>�����ç_�Vu��w-��j�	��`����=R�m��ya9���7�S� u ~5��,Ƥy�]�Y�,8�G�_���	<U�x�G�P,�zj:P�]8���zd�\<�-����ʾ�� ���wz���������w!�XJ��kFq�ּG�:G�nf[�_U���X���8v��0V2�!wt��{+�<^��w�;��j��Q��o�ψw�ej��C����[��s��9��ោ�MgZ�K��� �u�K��-�%���e�U�y�x�Wď�q���Բ����ᲇ䲴8�Uz�'��*����x��4��5�,od��E�պ�vɑ��"G$t<ִ�JT�ʢ��gFJSQks�c�Ť�{m?�