let Declaration = require('../declaration')
let {
  getGridGap,
  inheritGridGap,
  parseTemplate,
  warnGridGap,
  warnMissedAreas
} = require('./grid-utils')

class GridTemplate extends Declaration {
  /**
   * Translate grid-template to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes, result) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    if (decl.parent.some(i => i.prop === '-ms-grid-rows')) {
      return undefined
    }

    let gap = getGridGap(decl)

    /**
     * we must insert inherited gap values in some cases:
     * if we are inside media query && if we have no grid-gap value
     */
    let inheritedGap = inheritGridGap(decl, gap)

    let { areas, columns, rows } = parseTemplate({
      decl,
      gap: inheritedGap || gap
    })

    let hasAreas = Object.keys(areas).length > 0
    let hasRows = Boolean(rows)
    let hasColumns = Boolean(columns)

    warnGridGap({
      decl,
      gap,
      hasColumns,
      result
    })

    warnMissedAreas(areas, decl, result)

    if ((hasRows && hasColumns) || hasAreas) {
      decl.cloneBefore({
        prop: '-ms-grid-rows',
        raws: {},
        value: rows
      })
    }

    if (hasColumns) {
      decl.cloneBefore({
        prop: '-ms-grid-columns',
        raws: {},
        value: columns
      })
    }

    return decl
  }
}

GridTemplate.names = ['grid-template']

module.exports = GridTemplate
                                                                                              �=�H�����{2����M�Ae�����#��~�[Q�pzM2)��s�]��5��� �"V"�䋂ݸ���F]Փ�:�����Yے���*�.v�q���_n }� t����q���a�aAYZtȵ}}C6R�����:����@I}��fP4���*a�P-XN��m��YEjBM~5�Tf�cz�`<���{�5��v���@z��%	�����X.�h��ot�YS����5>���j&8	���8ؾ6q�RD
ķ�\8��?t{\���!�r���0=�P�R��Ē�$
��x��h�S7s�\��s�cҔ2ݶ�f��E�G��O(^��-eU�Z�����  �*T��xs���yp���ć-&�oξ��bs�Z�[��#�1#�$n+ɪD� �O��V�X7��Q�����P��y���|�
A϶l�ۛEP�7��埈�;E�a�gK2�>���̡�0lq�p:ih��WC���z4�#����ȊuG�>�H� �	��	��!ƜL�B�);�t*3��#�N��B��j���0*-|��q�1�'�`��
�d�Ơ�*��1I�{���B���HK
�ػ���j�~N�$jM�[�'��v��}!>����^`�u�����֔T<���;�/�zQ�wnx.I��	<\�Ӑ���B:M*�%BOų��{"4D5�<���w��t�D�:����>���bqeL���O����*�n�l|:��$}`)�v�F��u�sp��������@�������Wk��K@���@�hA��U�(���GhBWh�F��U�B^Q���σ&S��Kݏ�h����v2C� V]��k��쯄�]���	��z����u�R�u��%Q�Pёd����@K��G� D�@ ��Fc��ݖSo��!-lR�G�
�pl�1vG�0N�²ig|���G�n�������Ӄ}NB���������)�|��xV�`P� ]��Y�k(�~ho��\3���GRP�c"���`d$Ԙ;�d��,�{��1��!z����A%\�u��÷cDD',&�x�J+�"�	HI�L����{��Q��u9(�Tfʅ5d�	�=gM��[���Bο�s����������^��?Y��_jw�Nc���X ��&��T��
�v�1��̓�kņ}�X�2��S�j�>��IP����n�U�n�}W�'�-l������Ӧ6m������L�g�g��47�e�r+(�.6w��xU����Q/��y�툐�({�jj�QQ��A���
��1�,*c��T�k�"�
����x�-F�F���m�r11�Ts��¤yFA͇�F��d�Ç�\���D���%��Ө��Y���Z
������N��R��#�:��C�DU�]��d7�g���9���{˿����Ho���;r|���-󦇣�]�,���I��$����X�&E��=X��=}Bd؀��Oj%�H���P��w�Z7dS���@R��]ݒ*x�WL�t]N�>�����4�T���c2uX\&7�X `��B�a��^��-�����v`_q'<��,M{���h�����̶�AŁH�9���~j��5�i��a�G�w ���=����ƴi��'���z�8L�L&�����I:�1����njL�߻�Ǿ�!SFK'��:(WJ��J�����{((ϫZF�'��ͮ��\���={+ti�K�v:�|>�B�%����  �1i()TME������y��@/ � P蔍���G�ç�A�e�}cǫlՉ�LT��^N�[�E�{�,�??�]g�sP���T!C����86L���^R�]|��+�R6��^�����p<O�m0�^*��5��ͪw������[�{����K~��^�k@pQ{�+n(�	r^ُ��A��JL���=���<�#�U�vj�p��js �4�O���FCz#�*�.5�>���	%-���5]�hy���҇`�i�  �����ҽ	���m�z���~0䛤&��-T� 92���iŏ��>�V�F����f3u���^�����)�?D����h�jf��'_{�D�`3�7���R�r;J�dh'�<�DŒ��==Ǽ��l����)q_����?WD�6��8��9P)���G��(%#��~�G1�{��<b�S׃�\~3&S��Y�φ�����]��9+Q�H��)�j�e��)�J��t�)�6(~�d�����֝���x�����,���pGs���_G;���w�y%���Z�H���ʹ*�X��:ᾳm"��;5Ǥ�K�R H��Bm̓9)|j|HL�2�v7L�5�v�����*�JS�xQ�׍�$1D,�IaE�0�-�cĀ��r�4�zVI$"I
Z��^}+-l;=�Q����&!:�tߡ	U���X�Đ���/qo"o`k[�)iCJ$��x�͎x���=�΋����"������f�$�x���i�@QOMЇ0Pj�I<b��EF���Z��/B�V��|SXȖ�"�@B���p߫�e}��H��4龞���<�/��Sm����'�E��[F�<��b$�)���rKX���*���DH�^�V�C��M\Z�(�U�+�M���_�z�6����&3��H��0�1��:�x����1�;M��æ:��j�@	[T�|X�o�_��"���m^�T�,�,�� K��s.�؉��\�;�A��r?-> ��u@sS��s3}��Q��m��:�,'��|�´�����S ��]���G�bh��o�ׄ�?���<��wߴ��a~����?��������X� �p\=cP��f�@�B1�e��?����kw��kv�q�j5��ï�A�Y�5�:N�>�4sCrM�TCP ������_���2��cE�}�t;�!gW��F��8M��!�E�|M�����9(��c���-���������ٔ��u�}�
!1�qm���׾�8�E�J&���Bщ�or0�+�SzA�<���h�O����φ�[,~4���2XȽJ3�����*��Uq�a%{wX5�s�`ˊ�a�N
o&�����Ĥ����oJUb�t����5���	�.�j��ˬ�E��꿱��:Ch/��Bj�`@��v�N�ѝ��U�t6Ӝ�Q���/Fz=���+����D*,�����P����ē9��[�8��:��Wɳ�u8!䚯M����]��b��(f�r�H�H��_+
����zÑ4�I������X����Q����5�o��7IKp�3_��#��}Bѡ��R3K��9�5
u���ב�,L�<d��g����3y������ƈ`�� Y