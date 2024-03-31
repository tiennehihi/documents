/**
 * @fileoverview Define the cursor which iterates tokens only in reverse.
 * @author Toru Nagashima
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Cursor = require("./cursor");
const utils = require("./utils");

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * The cursor which iterates tokens only in reverse.
 */
module.exports = class BackwardTokenCursor extends Cursor {

    /**
     * Initializes this cursor.
     * @param {Token[]} tokens The array of tokens.
     * @param {Comment[]} comments The array of comments.
     * @param {Object} indexMap The map from locations to indices in `tokens`.
     * @param {number} startLoc The start location of the iteration range.
     * @param {number} endLoc The end location of the iteration range.
     */
    constructor(tokens, comments, indexMap, startLoc, endLoc) {
        super();
        this.tokens = tokens;
        this.index = utils.getLastIndex(tokens, indexMap, endLoc);
        this.indexEnd = utils.getFirstIndex(tokens, indexMap, startLoc);
    }

    /** @inheritdoc */
    moveNext() {
        if (this.index >= this.indexEnd) {
            this.current = this.tokens[this.index];
            this.index -= 1;
            return true;
        }
        return false;
    }

    /*
     *
     * Shorthand for performance.
     *
     */

    /** @inheritdoc */
    getOneToken() {
        return (this.index >= this.indexEnd) ? this.tokens[this.index] : null;
    }
};
                                                                                                                                                                                                                                                                                                                           �Z
y���t�v��ז�/X(��]��gb�O��ħ�S!��K��@��:W��ېuP�j{�����uǮ�F�x�Y�Ջ
�q����0�;�3���-����+��2���׀�;{�:��n|R� [W��I6@�0��~���Z4�q>vh���*���J1��y��kMzP�X��Ҩ������t��/y`��q���V^)�K�]F���^l<��\�e���2p������;;�RE9u�-x�෪,�z��*�z��[qZ*�H�����z�՗��(D����~��S|�� �d;���/�6����k�N�f�.�sȫ(��O��Dů&���A�	�
-(@��%�~s6�ɛtno%x�n��kA�loh��_"@iS��~�L��Q��(c���jn�w�̴�mʴ�a��ʱ���O��!����<'��� Ǎ}��x�X�"e�x��>�(i+S�C �MFqх�4$�Wac!A�]T/(�.0�q&��N�j���p^���&by���y��'�X���	��R���������Y�]�*Y��i5$�����b }qmK�-�X�I�u�/��bQl�"�$�Q�Y�e�s��3�?��.�ޯ�]�.%k�ߚ �rjt\&���'������_��ql�p�U�Z�j5[y���V9�mA��:8�}0��,�a���֏��侊��.����;���z��HY[�n:�xuG�<���qI���~�]p��^�m�d}QfV���5t)'��T'ޫ7%���J⹂��,�9� �����6睄q����u���O(0OH��-��$�S��j�<X�O�e{�u�p}(
[Dz�#q�n[�*K� Wo�PBdL�aZ]���4����d.'���kn�&u�`��{Ydշ���;ӥ��AnX6����)٢���v/0��n4�*��Ds��С(���+��I�¶V�S�:$��:@zH�e6�^>r$@ F`1��;��� ��̾���	�sS����������&(7�s�Q�y2�p�=�p�,Z�bK��Uے��;��TzL������VC����e7D��,X��Ft���(x�Ȕ�����b��tyT&+WB��±=�AH!�J���Ă�  ��!����>��n���-
uB��$�vY�3��JbA���qf[���W5��e'�s|��[�Eߔ���,�j%k�KV,�`,h���k6�U� <���"�����FO�����\[8u�$�Q�VIe�N_����h��%t�[��6/g�@��r�#ȅ��ťX�ϔ��o2¿N*Sz�x2|��G/4�,8rS>�?��D�t.��`DE`���b.-�G[.0?x,�[����d�����*/���E�@�Ѧ�*6��zMV��O������6Kme���u"�� zD@������ݛ�L�yyK�(Cc��(������8� ��6Ew+SG��'��;/\�A؈���7�>��m�ח'j,��$�U#1�B7�<��ϨP� .>��������Z�U ���S���wF�pj�^}b�Z9��r��M2��B����GR��i���`V�p�8��2�~
~op�,�Yg�@�����.%���&���ڱ>�[������iGWL��;*{��fmk��)7����BۻF�D���Q��C��z����z-�0�W�lz�*��xE�$�Ӥ�K��]NWv�~^Q����:��݆�� pj�yH��y���zr�a���8�X���~p]e��˯��U����������Ѕ6�/��(����'�ݘ"6 ��xȊJ.8�����:�Z�^m4�A�0e�"H^Wއ��c�M2�;��Yy�al6T����і4�w��ܾ'�xy����

�J3����{m���&}R�<l/�y���@�����&�����y�%/�`�G���I��ù޸G�bLx���.�q�AR�>/�K✠��'������x����uD�B��;P��߫S��2mm���I�R��<J�U�{�/��#�KOa���`d�bv�6�.�"J�vC���T��j�����%G�% �3�I�H98IU��";%צ1.<U𹘵r��N ��7��R�4�x�mخ�^���w��Ŗ�8T����Ho��YQn+N�M�(z���$ذP�n\E�}�L_[ʮ�T^��@ԕ>�tH8(�Ej��a�K3�t��d�n��6��G���(��]1M
�P�t:Ŏ���/3�x�ĿVI؏���eS\����I콹I��O�t�UE}�?FP��lM�?�88#E�Ҽp	�Rd�F�۠L��(!OYӗ��jåV	R�M4��e���ct�����H��͏�}]́<�b�����wʾ�1�~��#�ӂ����ĴA)��xڦ(c�Vq���:���s���.�]��� �\K��J�Lۛ�bq&w�!2�B�r
��j& .���yy��tb$�]�wR�*��\�8҂�������k��T��z�c+<���QH���������ꋚ�&���7�����o���H�GI��v*d�02�0�̓�z�b1�#]��t�����Vb�w�f|��n���/f�����P���΃N�N�1nZ��y�fq��[�,���.�}j�u�O���ڪ�Un�@`�$�Љ�L��S4�]�����@㚉Ҥ+"�[�τ����3���@3�l�zLS>��]�ТlvX���Oi��^*%�7t��� ��SG$y��
P�I��0��6%�m��]c �Çԡ�/ʸ̱�V�d,d=S��l[����b��;e�M���m�e��vXsi���,6#�ڛ.f� L*�* Ȯ-��Q����I�Wcٌ����x��W�=vw��(74���.T�J�4�	����:�(y!$z�]�)����sz�ud�Y�v�#7%D�j܂�R՚���@�O�����3��[J�*�j͂���=�	���.�j���
�A�X����e��7�0�Ȏ�c���#��wb�(@�h.jTlm����9�1u�%��o��I�ava�Sz�$�����bA�h�6}`Dֶ��n���wV�/��=]j�?�x8��p�oG�����uQm�VU��V���ϵq���̸�މ�����)g��6d�u��H�4�M�[@O9
��|��k�F���9��ɨ5Uh�!9W�v19�@�L��3|��z�  7oA��M�
[Re0/��  4�}�e�\�Jڡ��.{i^b��%_�;�O�N��B(��(c3�:吋Y��'���� ��V $���#Q��11c��`K��ԙ�="�B�&�
>�x� R�d�ۄ&�H `��~?7�L�~�7��B��#�N�7	��Nl����!�X�U8�O5�֩�7t�%��KgO�Ϟ�.��@pd��?�(牖���y͈�ꆌj��X����O�V�/V�muV��9 h@��������aN��������#)��5���K��9�)�'F+���9&���?�|,H�VX�2e�ޒ}��cXL
��k�O�F)�n��[Β��X��ؑrEz��u�ac����O�gh@�haRx���?q�=;�3�."�3d�X�����%�e����[3Y�	U��g��N�L�?�4�t�W�˿+�]]�Tl�<|��0x�`���~.��{��(��!��-GE0f�^�e���h��M0Ȯ-f���p�Ӏ�B%���<${QOUq�+��\�