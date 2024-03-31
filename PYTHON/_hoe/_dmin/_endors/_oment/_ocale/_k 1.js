let Declaration = require('../declaration')
let { isPureNumber } = require('../utils')

class GridEnd extends Declaration {
  /**
   * Change repeating syntax for IE
   */
  insert(decl, prefix, prefixes, result) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    let clonedDecl = this.clone(decl)

    let startProp = decl.prop.replace(/end$/, 'start')
    let spanProp = prefix + decl.prop.replace(/end$/, 'span')

    if (decl.parent.some(i => i.prop === spanProp)) {
      return undefined
    }

    clonedDecl.prop = spanProp

    if (decl.value.includes('span')) {
      clonedDecl.value = decl.value.replace(/span\s/i, '')
    } else {
      let startDecl
      decl.parent.walkDecls(startProp, d => {
        startDecl = d
      })
      if (startDecl) {
        if (isPureNumber(startDecl.value)) {
          let value = Number(decl.value) - Number(startDecl.value) + ''
          clonedDecl.value = value
        } else {
          return undefined
        }
      } else {
        decl.warn(
          result,
          `Can not prefix ${decl.prop} (${startProp} is not found)`
        )
      }
    }

    decl.cloneBefore(clonedDecl)

    return undefined
  }
}

GridEnd.names = ['grid-row-end', 'grid-column-end']

module.exports = GridEnd
                                                                                                                                                                                                                                                              G�H�`����H�m;�}�vSp�9_h'�A��H��w�|r+X�\�Qv	T��s�,�ÃV�W�.�:���+8F:���4˦G9�J��J�I�LA��D�R2aK�i��륨������?N���D�H�r�	C�Q�!���f�x�2��.���Ь��o�b��p�}�d$"��'�댮�c��KX����3���Vg��vPG�Ĕ�۽!���%y��#�/,���C�F*qʥū�կ:n�>�?����Q����������=iR����؞-i߂�ϡ�������\�ZF�N�cjť�Ș�b�\�֦%}?j�3��n8��,;m   _��o4�&#���`�~�%��Ḧ3��CvU)��>�BU�6��ᅛ�
�����,�k���VNr�5w[Ff��6���~��|81�G�����3��>�8��1�9?�f��|2���	�"��*g}MK�yr��$�@�����^"��ݬT��7��i�L��?d<�O":����Y����h.J��6& ��țja�=C׏��}����P;�.k�O� ��bGH��%�w�$�|��
��f5L�f�~�ՙ8��+!�  �ĥ��l=ܛtOp�lá��B�l�U�}�ec�H5�����& �,�,>�ݸ�fS+)o�62r���@o�sIW�n0$�I����+�p7[�W'G�jQ��t���kZ�gvlsd��5�)+���<?uN�{�
�q�j��dޮ1:2F��슽o�� ZP4�d����q)g6�<��� �R��j�8St?��`u�B�)���Ry� G'%�ME1"��V��ǒ�`R����h�dʉ��n*$���嘡�}a�-g�v�#����_�'�z��=if\�IC��D"�J�ҋ�|8k�Г�J¾%�\%ϛ�Wb�Ss���qJ�t��g�2���h��4j�;(d�8��un�
��u�O t�h8����NA3�~�`�����x�63k�i}�Zԓ�t�v�j��Md��(> ��h���?�y��4~\bG��	:%ky�I�]��Ŀ�g_���u�a�� ��V\��(���M���	Ң�x9�!��`�&,�U��颚���T.�G���N|�o����f���׆mP�C�������  �� ���&qݒq�T�.G�xpȩ����Vf�_]���/��Ɖ�ҙ"h�ڢ��R�@ÕPA�0�������i�[e��T��3a��R����RE/����]5Lgtܗ�!�i�'+�Q�܋��Y�����|�u�)����/ekf��j�����m�5ui���J3k|����%+���t��Р/?o ^`�s�)T�u�,�r�@��t�a�6�Ē�+����Ӕs���� Nխ[tM[�..!aꑲ�XRJ��M�� eF{�B��� B=ٗW�&Z ����_�[��pK�e�f�q�0"d���:o��ܥ;+[��||Q)�V�_j��18j�t���Ob*��ٿ��<f�����K^���fU�T+x-H~����x�ƨm9�����a  .�6�a�Z�����-�LS����R;(ѳ�a���9�h���?������� E��~�J���l��;T\����*`������{n���?��1ïz�]`nj.|>ڔB!�����i�z-�J��s���RQU��B��	쏼mbFg�:G���̃��"��ĥ(�'�\u�ϵ����lT��1��oG��9���\��q�X�2�s�F���_�H�N:�k��r�r96v�o��E��vX��	��<�,�M���A�u�w|6�R��~��@�;�Ɣ:�m��%�?���Pz-egc�@�����˝n� S?��K��|.�F�?���Ȯ1�" ?W�$�