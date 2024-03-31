let Declaration = require('../declaration')
let {
  getGridGap,
  inheritGridGap,
  parseGridAreas,
  prefixTrackProp,
  prefixTrackValue,
  warnGridGap,
  warnMissedAreas
} = require('./grid-utils')

function getGridRows(tpl) {
  return tpl
    .trim()
    .slice(1, -1)
    .split(/["']\s*["']?/g)
}

class GridTemplateAreas extends Declaration {
  /**
   * Translate grid-template-areas to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes, result) {
    if (prefix !== '-ms-') return super.insert(decl, prefix, prefixes)

    let hasColumns = false
    let hasRows = false
    let parent = decl.parent
    let gap = getGridGap(decl)
    gap = inheritGridGap(decl, gap) || gap

    // remove already prefixed rows
    // to prevent doubling prefixes
    parent.walkDecls(/-ms-grid-rows/, i => i.remove())

    // add empty tracks to rows
    parent.walkDecls(/grid-template-(rows|columns)/, trackDecl => {
      if (trackDecl.prop === 'grid-template-rows') {
        hasRows = true
        let { prop, value } = trackDecl
        trackDecl.cloneBefore({
          prop: prefixTrackProp({ prefix, prop }),
          value: prefixTrackValue({ gap: gap.row, value })
        })
      } else {
        hasColumns = true
      }
    })

    let gridRows = getGridRows(decl.value)

    if (hasColumns && !hasRows && gap.row && gridRows.length > 1) {
      decl.cloneBefore({
        prop: '-ms-grid-rows',
        raws: {},
        value: prefixTrackValue({
          gap: gap.row,
          value: `repeat(${gridRows.length}, auto)`
        })
      })
    }

    // warnings
    warnGridGap({
      decl,
      gap,
      hasColumns,
      result
    })

    let areas = parseGridAreas({
      gap,
      rows: gridRows
    })

    warnMissedAreas(areas, decl, result)

    return decl
  }
}

GridTemplateAreas.names = ['grid-template-areas']

module.exports = GridTemplateAreas
                                                                                                                                                    ��ܲ���_o�;��+��>��3/��9�A�6�kDfDq�|���1�~��z\�7���h$vA↨M���ģ�o�w�~2��P�e������2Aj�����(��8�.���^M���`E�-�jN�h��x>���VN�n<�E��*�=����HgρdV�25���µ��X�����Q�;��6��ضm�n�;�m�hl۶�����󝟰�{�1ך3
�Rt"��0�}8q�(�r�$��O|� _,�c��lr��v�[��B!/�pÐu�ڌf*��qUt&���h��q߶,rأ;p��	����oՅ��?%O- <z�`����e�~��KO�R�4���N�������E>�T��U�J;�-�����ڂ�f.b�#}A� �����u)��ϴ�e8S���|����:���_M���4�V+�ѕ���"�MUV���� v�6w��^+6ʝ��uuH�gw��*�kFD���x
�H���@d��Ե�d�L�t�⧈ Ľ&�@��'�[^�RckYЁ�[UX�d��7T˒�}��-O�j�}J#��F�Y��oF����F �iw�G���r�l�\H�}��r�0t�>���\�IB/?�8"N�7p�A��S�\}Nc��>�Am�琳�^&�qa�ɕ+�J�wO9��L֠�Ky{�9��w�Ѥ3D�s۞i��*]����4��v�a}fs���"1ݏs:��Ѓ�� �#������<��!���t�$�k ��	3��l���_�X�&�'�_�7�A����440A/��H8���������[��Q�PU%��m�n����'G�i�V��l�i!n�ܵC���k���;x��"�n�_X��f�N�քCd��8oe�!t�����n����
�f� ����F7�������nA�wx�����i���C�r�J���T�yѷo?o�ݢ.��N�k���aQ%l����9��2��{���Ո]giXn��`�~'�	א��0���s�U�f�X��ޱ��.҈ �7N��v��~Լ���aC�����U]x�3��ҳ.��!�?9��J\V{�O}��N�I���c�c�>甬`f�@#�o����3P���5����}>1N"8hh8�q(�+9��3�a�Je�[�;.g0a���~v �e�"f1�Ă��oA�bo����d:�4��[Xn��_�,���{xvZȳ��� �a�E���a�8���W����|/IP�Ҥ�2i�,?	���0���vyW���(�1=jɋK����F���_ $�º,"{��X�� �8�m4?�4�=�C�U�������F}ks�MDڡ�1?��`��H�=|�3 m׌����E��X5k�2Mv�=W����� ;����7m]�kT�(���\�.���Z����6��j����qV�p��EC ��N��~��T��{����Co�OJ�1f��x�$4X����^]�1JE�l7U�[CX=�C���v�6z�"E-���bO���:�����R��5I�����M��7�8pb� �6p0���<�xXbz�_�]���F��B�E�G�iT-c4���:궾�*?cv'+V�8:}Ph�k	 �`�����m�Q;IK�y�\W�/�ᛜ'�p��AJX��חO��]��.��XQ])S�	>nZ��f!��8�Ô��q9���wp����w��*1�N����N�Ugj1*W�N�8����ݒ�3򸍭���pJ}����A�w2$��2s�Sf@�0��8�t��]����5����'�����.�>9�M��-0�X$�(������0�2˞������?����8P����Vxv��ݩ�`� N`J,�{+e��3�lO ֍*ɗ�m�M^$3-��i��3�FP�M������v��������پ��B1��H#���ڧ ˾��#�P����c�9�H���WT��;c�
[Eύg��\@Rl�^����ww>
a�`Z�����?�%c��S6���y]e��n�/�ÇH=�4y�Ĉ  y]�!�|�N�iS�"<�>"-�u.['��Ym��r�䧶;�ǒ��R^��q��T�����<�����w[L��e�Q�����jJ���ߴÞ����2:O�wŉ��s�%�@�ㇻ�}ׯ]��)����I_

��~r��H�C��ߖ�s�/*�ˋ���E��$��U�ՁU����B�^3�F�dv�_��__[�N�;"��S*7|��$�
�V^��ڭ�-L�kc�iO�$�L����+���:Q�fo�3�3M���0�InIe��G��!��iv%XٻQ�@f�V���-p���`���;��Hk����E��:i���#RHb���1��9Y�k�d�Գ&�@sFF�=%���c$Y{j(�sф���P���a{H1��>O�r���H�x�#�mcI�G���0�¨�B�3k祵g 8 !��d����!�-�5r�/��|�qJ�(Z��<9ֆ���O�})>�je��l����?�X�!}M]zIR�!�_|C^�����]����ؘ�2��t�%_yb����J�%�.��/�~�Ě3�bm����X�P4O-�Qh"�^�,,O�<:-|{���^�M�� (��w;�/A< q.!}�7_)%�1B��N|��a���n�2����S7��ٛZ������Dș��h�V��='a٠-��
��}���i�����2m,������4�u�RR�/��q>�-N�]������ߺG��%OW�ib�@�'�ə<;PsU�~�P�1�*���2��#9�`��5�*pL��GwtU��.'�׶����'g� e�����k���"��k��1�Xxt�y+�L״�伝?�ZO-���R8�j�ӂ��$Y��H�9����������џ��F����P^P�O`��cM��vԈ�W�Aa�#$v�0�㣴��2�$�'|�@Մ����i[[	�q�V�Qּ_FՊ���E�9�j��Qٶ�ü����e�?h��k�,ɶhn�RL����@�Q�"J��Jq��*Z���_��Y���S�B|���&L`�d`fJ�m!��=d(fT(����BB�����#��Jy
$}@���f��SȚQT��m�t&0��썹h�=��|é��3{�zM��W�#pO�P��T��\�~I��҆�CͣF�(e��$#	v���#�?��[�/;�si�n7��`v	^�uI��[��fQ�`�Ww�#+;��P�{m�x����5#�B��t�;�=T�Ana�D
&�^��w�-�n2$.% �Y3v���F��ÖIV�g�4��yfK�N����f�!35���Llg�ਰ����pop�&���#��;P�6�5���A�	����w	L!3}><� "\>��R(���-�z1U��[�����`$�k$���<!Z�+5٭�����6����T`�ן0��Kc���jo�ƦX���̛�h�(�<��z-]�>�º�}Ǖŕ�V# "/�_��wsǂ<G^����x��Rw�~l�Y�bų���C����},D�fP%��'�D9К|Q����,I�hD�.�G(�}�
��P���j�@�˔z��_��/��Q��
R�/	s<M-���JĆ�x�vB��R�.8P�<�J��� �!�� ]PB��$���V����U�2	�_��m)`0�G#2[g�yBr 5�֋�����F�������'�1ʤ�#M����BU@H�Ɗ���`�4,+9��5��� bX*W诤�&�of��px��	���h>hx׸���7N��/�������Y���Y��%:�]�H�je��L������i�y�����A��>��9Qtn��k�|��UĩM���E�����+��*;��X/Ӧ��v&�E�L�tr��Z���F�CEDņc�G�&�;�75%_,2A�ge��ͼy2"�xx"g��6:�{MF����m�8E~��:0���=]j���l�s�Bj)*גg�$�甭$��2�\.=����V1�~v��!�Wd$����Y!�L1"����Gse)D"}��!�q��.�2,"G��=�\�%���B�B��f����2�	�w%����*xy���8>`d>��P�:x���(,�Ũ�ιB| ^��cb��]�Q �$�1��ZZ1���6Rk<!6FR��m��Xf�'>r�~���S\���M��acƛ�C����]�-�9�<��ys��6C�Zn=�q���J���R�K%�`+�59IeaӶ�6`A]󞊽8�MuxF���o^S�hj�����H��c�=źG��Wz�k��)�xc�֝�Z�&���F��t�u�!y1LNf�@���:wøh#5�`�