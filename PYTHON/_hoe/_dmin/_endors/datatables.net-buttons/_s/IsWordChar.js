function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null
    };
}

export default function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}
                                                                                                                                                                                                                                                                                                                                                                                                                              r�'5�[��+a�X��\e��R�?�3�]��sx�(������ ߹�ƢzyY匫����J&�i���wJF+������J��S����'Ή"�����\o�B/~��X���b�o�����.S	�z���۠3���ڻi���LMƭl�=���و-'~�5��2��l&@�`����pQ�I��<✌D��ރ��
U��,#��w��e��� c*�/��4�Ǟ�؀��WK�Ӹ-bT؝"C*�z]�^NZ
0ɰ�kA1u�)Ϙс�h���f�T��/��&�F:�/��;�#f��2�zƩ�n\���9��`�n��t&l��/��QȄQY׈�*������߁�%���I��q�H�k��+�;VV���ѿW���"Il���M�]Fe������	P�D�&����(�XQ