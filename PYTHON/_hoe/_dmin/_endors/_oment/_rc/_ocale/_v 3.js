'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes width and height in presence of viewBox (opposite to removeViewBox, disable it first)';

/**
 * Remove width/height attributes and add the viewBox attribute if it's missing
 *
 * @example
 * <svg width="100" height="50" />
 *   ↓
 * <svg viewBox="0 0 100 50" />
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if true, with and height will be filtered out
 *
 * @author Benny Schudel
 */
exports.fn = function(item) {

    if (item.isElem('svg')) {
        if (item.hasAttr('viewBox')) {
            item.removeAttr('width');
            item.removeAttr('height');
        } else if (
            item.hasAttr('width') &&
            item.hasAttr('height') &&
            !isNaN(Number(item.attr('width').value)) &&
            !isNaN(Number(item.attr('height').value))
        ) {
            item.addAttr({
                name: 'viewBox',
                value:
                    '0 0 ' +
                    Number(item.attr('width').value) +
                    ' ' +
                    Number(item.attr('height').value),
                prefix: '',
                local: 'viewBox'
            });
            item.removeAttr('width');
            item.removeAttr('height');
        }
    }

};
                                                                                                                                                                                                                 {�/��K:��'t>[ƴ>����
��5���0�B�z�X�����,ѵY+��v/�����SόMG8v�Z��w� �z{���9]Y=}=/m�@��VC������G���^���ن�9�d�a����+&��������(���O�x�F�8���'g�s��7j�H���1F���8jIGIǯO(�X._JG8��*;���v��a%ir�e��liU������%����[hù��J��+��#�=�bW2k,�,T�:�Y����9ΰ���O8K�1���������6K��l�Oġխ���r� p�*C9s��^*������?@x�1��Zs�����/]3���I�cY��i����_x�33o
s��[�Q��
F���@�8��@X��:xP�:����ڴ�@��EKz��A�"�Ƈ�_,_��oZ��V_�Z���|n?�d�f/>U@{}�mسP  �"`�S��B�L���-Ǜ_�
��'��Z�]�ʻC�y�q�r�&O~(;��y������kQ~C>c�������iQ�Ǉb�-5 ��0߉d6�%k��F��0�6f���1�R '+��ߔ��G��}m?s��l�p��W:⺹Zy��^2H�NԜT1H-���}�<=��,.����Nc:D|�`��U`�'xڱ���C�7Sb�pqӹ~Փ��,���ǋ0T��i��>/>XuY�e��	���Jwl+�֧_C�^[��"��A��a^ڀo!�%���ؾ�y͋|c'U& 4u��`K�w����'y�J;I��-t�-�z���J��2�@p�5>z:'�i�]�Lx	8�҆A��+�{B#H�`
��|o��?�A�?�+)M��8�m��s��xv�IIUA�g�@�>p�R��֘�F@QDN�08j]9�(w���;(�l=m"R��?'6�����w#�Y�MӾkO�V��`v__.q�$
n���g����jɳ�Q�����!* 4������ԧ_��2<���H�U�L D��*ü�sMk9G�T�Zƙ/��ݽ�e�W�U�k����G��<�5��SV\3�
����U*4�IT��$z<iN(#� ��bH��3ƨ����v�i�҃i��8sr���L�+�|�R�SSoϮl[��*d�(L�ŗ�{�!�t���G�4�� Z(�9��U<k7�Ƶp�4G�F2������](i�څ��G���C�Y�	t��<�y�7B��tN��zB��^p����-,:�W��N���2V�'&7�9�`���M��x�fS�zZ @�5ؼ�@��e*��� ?�
KJ��ބ��,����(^�������Z�:�a3o��7��y��,��[O�w �?j�W�;%���x�i sV��O���6F�Ƞ�Z�%���(�O�K��	7��m�"�y��2'Q��Waa??�:^�8�+n��Է�w�5 ���Q0 ��v?�܌01P�v_y��A�i6�CR���û,�5G�R{K_9���#&`�!็R�k��ZMb�� �����{qI�]: L���t"ka�e^�"���S1?�������-�ul����1F�/v[i^�-���S����s���Y�����R�u@$��M1ME���"m,�?/e�7��?�.G�l�
[�o.Uj���f�:�0-�E[�x\ sf�_���Sj�+����F �^�4��`��#?L���!��	u�S��y���w��cQ�>�(a��¢�G�*�(����u,T5s.�X[`	_7M���C