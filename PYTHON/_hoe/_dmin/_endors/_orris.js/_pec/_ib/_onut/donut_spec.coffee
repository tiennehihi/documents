'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes doctype declaration';

/**
 * Remove DOCTYPE declaration.
 *
 * "Unfortunately the SVG DTDs are a source of so many
 * issues that the SVG WG has decided not to write one
 * for the upcoming SVG 1.2 standard. In fact SVG WG
 * members are even telling people not to use a DOCTYPE
 * declaration in SVG 1.0 and 1.1 documents"
 * https://jwatt.org/svg/authoring/#doctype-declaration
 *
 * @example
 * <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 * q"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
 *
 * @example
 * <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
 * "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" [
 *     <!-- an internal subset can be embedded here -->
 * ]>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    if (item.doctype) {
        return false;
    }

};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          S�QA����º��� 3=�~�C˫��Y}��2�/x��1�Z7��>!�ȖJug��Mt��T7}�j-ם�BF�[��/nr�骼[:���_�h���X�,egm"�Þ���[O���j���X���(�NQ����$櫎3�_��ӏ�Q���	)�}'Ȅ!�ԹR!+��9<{�l�/_tܶ���'I��8��y�<�sžܟ����$�A�a֒�ӲeЯD��UB�����ФTsk��r~ވ��2�AS�W�ƈ�ٙ��F�F�Օq[�o=w������,������#� u���3��92	��!�?�F�*��1:z������FO
1�y�Rc쬣C�E>�U�� �:��D���A�vcS�π������ �I�0�4��Ϙ�l+�5�H2u`���i�;XY��MO��!���\�ʛ��i��� ������t�O���C�<eR�T�d<P�B�@���pev	?��s��y�#:�h�ti���zp4���$�m4I2�Ĩ�"Z�IZ㒉����4W��F) F^�u�����c�vJ�����|)��y�v�zc2.��=��DjkC��T
��R�����1dz/��~~�cj���g�zL��lV��
A���e��+��'��z�ke�́��PA���V�Q���k�G3o#�}��j���A�vo�@P��%?L��������%{~0��r�ܻ�����g�V��HKYn�vf.�5��Ѵ8=�yN���Zd�`b&L  �L1L� y1�|�G�}�����8��Y5�f5�����ҷ���m&�:�@8	�QY��`r=��_��r�Hl��6u�i7̕���<��[�;ۀڏu+��)ŊH����
,!��͟r�/[;�����e��|��N�Ad�̌`��W$B��l��T��M�e�hvK���4|/�1����3wlj��
hokOq�kf�4IJ��R���f9�XV�fĕ/�ω����%�DE���G�i��,�^�ee1N���d��A[璡J�E� �^;p]0<u��$M�˃B_��� Pϣ\?Fba���^A�x��n��?�S�¶���5bZ���9�ZM&B��P��c��ʘ�_���4��{p I7,��AO�g�؊
��VT���}j�\��kYZ�ӹ;*V���kU�H?P�a��m�'�ž;����0ExC�B�@��¨H�f�ĕ��lt�&ܦF"rc��4p�)��Q��=� �?Z���\�8�pqb��Kת�4�\nO4����`��1�J����|F����Dv%��� f� ���Uy� ��όAE�n�x�{�X�d�gD����