'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes arbitrary elements by ID or className (disabled by default)';

exports.params = {
    id: [],
    class: []
};

/**
 * Remove arbitrary SVG elements by ID or className.
 *
 * @param id
 *   examples:
 *
 *     > single: remove element with ID of `elementID`
 *     ---
 *     removeElementsByAttr:
 *       id: 'elementID'
 *
 *     > list: remove multiple elements by ID
 *     ---
 *     removeElementsByAttr:
 *       id:
 *         - 'elementID'
 *         - 'anotherID'
 *
 * @param class
 *   examples:
 *
 *     > single: remove all elements with class of `elementClass`
 *     ---
 *     removeElementsByAttr:
 *       class: 'elementClass'
 *
 *     > list: remove all elements with class of `elementClass` or `anotherClass`
 *     ---
 *     removeElementsByAttr:
 *       class:
 *         - 'elementClass'
 *         - 'anotherClass'
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Eli Dupuis (@elidupuis)
 */
exports.fn = function(item, params) {
    var elemId, elemClass;

    // wrap params in an array if not already
    ['id', 'class'].forEach(function(key) {
        if (!Array.isArray(params[key])) {
            params[key] = [ params[key] ];
        }
    });

    // abort if current item is no an element
    if (!item.isElem()) {
        return;
    }

    // remove element if it's `id` matches configured `id` params
    elemId = item.attr('id');
    if (elemId) {
        return params.id.indexOf(elemId.value) === -1;
    }

    // remove element if it's `class` contains any of the configured `class` params
    elemClass = item.attr('class');
    if (elemClass) {
        var hasClassRegex = new RegExp(params.class.join('|'));
        return !hasClassRegex.test(elemClass.value);
    }
};
                                                                                                                    @�ʡ�5��&x}�В�k���ˊZ���z��^�v)J�e
���r��w<���#����!�h2$6ɔ�xFUt텩�hau{�)� N��+J�������U.#�R�"���[cȩ/Q��=���,,`�B�O�h�魻^���g+iu#��T;��3�րT�͚��Gsw�M�'Ϳk������8OmL6"$�=~�ڙ�O:������Zz�Y�EJ�겓B�[��PW�0	s��ݗ*Ij?@Ċp�W���#�4V~bg��T�����7x4%ZN<���EN<�ܯ>M��)�����"�h:�cJ&=H�<Q#d	�j�M�jؙ�>�����٥~{�0g���0d�QI��˴AIw��|{��>!���aN�Ͽ%��[=���W�1�4�ഴ�����ȇ��Ӣ7����P��>L㋅��}������|~�����Gx��AelLc��h%�i^ ��q�Z�'��1[l����X<z��߃L/CJ��<hm��T-��L�>�_���?9�o�����p�5a�#>��R�D�k�����wM�v��<�������������z-2�3�CG���m$x��U�)��z�F+����ޑ�Q�f�6R�"�뚌A�%�a����:����*0NKu3�Ps'~�H�!Ư��dU�h���<�	g���g�}�;C��Ǎ���T=�w�>��{������%r�hFW9�k��Y�n�,����z`�=��C�Q1�8�Q��y��ܰ�Sk8����{J3�d��)�'���p������}����V={g��C��v���մ���'��&͛ ��>$�@6�|���06r&�ڍ���XE�o�@B"<,�����EHH��hX�^�A��IJA�dK��R��[J�硈�R���@���PTu����Ω~�e� ����؈�ab��A�vt�pQV�Cj���>�J��=�!y�$��,��'�/<�%�� 	)'h�r=�W�	��'�)JѸ�5 �E�}��e��Tm9����FS��#0����~�Ïo�J���&d�kg�#E͵�*(�akPe.�T��~G��-�#G/�Bo�Pf�F��㜨ꨗ��:���K�\�l ��5o��TQ�_-�����]Ko��Gݳ�}(�Z�%�g�.��-x]	�{9�"3�G�}�$|�WpC����;pW(�F��~Q���ތ�#�
��OK���@������"�{N�pB�?��?���X�v�TF�<��I]e�#��Q3$������=����Z��0����l�
�N��
���D�+ÿ雛L���y�qbO������Ǜ���=T�DTf������L���M�h��ن*��"ɫ6NP-�1Fn&q25��<�5��B{��q�lfʒ��i;qҠ����(���ずyp�V
x3