let Declaration = require('../declaration')

class TextDecorationSkipInk extends Declaration {
  /**
   * Change prefix for ink value
   */
  set(decl, prefix) {
    if (decl.prop === 'text-decoration-skip-ink' && decl.value === 'auto') {
      decl.prop = prefix + 'text-decoration-skip'
      decl.value = 'ink'
      return decl
    } else {
      return super.set(decl, prefix)
    }
  }
}

TextDecorationSkipInk.names = [
  'text-decoration-skip-ink',
  'text-decoration-skip'
]

module.exports = TextDecorationSkipInk
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    �ٳ���v��jJ�{%���Yٮ���ex=�����!{2���n�8�!�(����:���G`3؆���~����>CNd������|�;s:7��w���!|��6��DJP�Hyr5c�Z��Ԝ�&�"`2򦳏\=�9��⣐���϶���9��� J�6
/�%���
��p	X�c�� �׽ef�68wD�N2�@�*z{�\����r��M´�)�Qp��Sp��L�7�c)7���kR}���Aـ��M
�xP>7�"�s�Y���;�]ꠑ��l�����0ߏ�&:s�v��խ��T3{+:��)�֕�w�@�Z���s߉�X/�%c{d��$�v����_'֨��*7P�S� �P¾� ��o4������_����N��Rp�O� �W��p����1ai�*K�i�-7�[���5T���b�*������K�I���!�l�­�D��H�P����"�4����yO��6 ��'��ðg�T�k<�R�g��L� 9R�pT���b��$��nַ}���&IC��d�XZ��֯|G����r\���=�X$~!��y��� �X�!�4��s����cO���@�@