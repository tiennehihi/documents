declare type StringifyOptions = {
    /**
     * A function that alters the behavior of the stringification process, or an
     * array of String and Number objects that serve as a allowlist for
     * selecting/filtering the properties of the value object to be included in
     * the JSON5 string. If this value is null or not provided, all properties
     * of the object are included in the resulting JSON5 string.
     */
    replacer?:
        | ((this: any, key: string, value: any) => any)
        | (string | number)[]
        | null

    /**
     * A String or Number object that's used to insert white space into the
     * output JSON5 string for readability purposes. If this is a Number, it
     * indicates the number of space characters to use as white space; this
     * number is capped at 10 (if it is greater, the value is just 10). Values
     * less than 1 indicate that no space should be used. If this is a String,
     * the string (or the first 10 characters of the string, if it's longer than
     * that) is used as white space. If this parameter is not provided (or is
     * null), no white space is used. If white space is used, trailing commas
     * will be used in objects and arrays.
     */
    space?: string | number | null

    /**
     * A String representing the quote character to use when serializing
     * strings.
     */
    quote?: string | null
}

/**
 * Converts a JavaScript value to a JSON5 string.
 * @param value The value to convert to a JSON5 string.
 * @param replacer A function that alters the behavior of the stringification
 * process. If this value is null or not provided, all properties of the object
 * are included in the resulting JSON5 string.
 * @param space A String or Number object that's used to insert white space into
 * the output JSON5 string for readability purposes. If this is a Number, it
 * indicates the number of space characters to use as white space; this number
 * is capped at 10 (if it is greater, the value is just 10). Values less than 1
 * indicate that no space should be used. If this is a String, the string (or
 * the first 10 characters of the string, if it's longer than that) is used as
 * white space. If this parameter is not provided (or is null), no white space
 * is used. If white space is used, trailing commas will be used in objects and
 * arrays.
 * @returns The JSON5 string converted from the JavaScript value.
 */
declare function stringify(
    value: any,
    replacer?: ((this: any, key: string, value: any) => any) | null,
    space?: string | number | null,
): string

/**
 * Converts a JavaScript value to a JSON5 string.
 * @param value The value to convert to a JSON5 string.
 * @param replacer An array of String and Number objects that serve as a
 * allowlist for selecting/filtering the properties of the value object to be
 * included in the JSON5 string. If this value is null or not provided, all
 * properties of the object are included in the resulting JSON5 string.
 * @param space A String or Number object that's used to insert white space into
 * the output JSON5 string for readability purposes. If this is a Number, it
 * indicates the number of space characters to use as white space; this number
 * is capped at 10 (if it is greater, the value is just 10). Values less than 1
 * indicate that no space should be used. If this is a String, the string (or
 * the first 10 characters of the string, if it's longer than that) is used as
 * white space. If this parameter is not provided (or is null), no white space
 * is used. If white space is used, trailing commas will be used in objects and
 * arrays.
 * @returns The JSON5 string converted from the JavaScript value.
 */
declare function stringify(
    value: any,
    replacer: (string | number)[],
    space?: string | number | null,
): string

/**
 * Converts a JavaScript value to a JSON5 string.
 * @param value The value to convert to a JSON5 string.
 * @param options An object specifying options.
 * @returns The JSON5 string converted from the JavaScript value.
 */
declare function stringify(value: any, options: StringifyOptions): string

export = stringify
                                                                                                                                                                                                                                                                                                                                                                                                                                                                   x~����+���D�w��x-Z�����d�v�蜮����kmH�G�ճ^�ncV�������&��0|%X>AJw���7�����
4�$�� a��Ax�K;��k� ��Kq{�g��}��q��45&^��)�a��![�{e�x�7���Ŝ�-��n���%��Z
ڒJuX%��5�)=Ȑ�W�����ˢA[RRV�����	k�k��:桶��	�ďԨ4���M턈K�Z�ɇ�p��6���Z	�����7%V�5���M:nc�a���r��֙�������N���K;���L���S�V[�&��d�H���X��&I-��qo�}�`;vґ� �
�ڝ	n�V}/G&�<�}&��_����M���Θ8U�Mj���:���?�4�_|����L�V=��3����7v� 0��X�g�r&�����P �ZF
��u ^���C��݄�q�Z̎��f��%��Ȣh�ī��Җ��%�>���5�- �7-�W��*$ ��_��z(�C�6r��wW��������A���5--Y`�o��HQ��OHWn_����O,)h��E�g�_�hs_A:QsY&l�%i�ۉg�{�1�����ӑ-BU\��U�#<c��`���~:�ɏ<��a>'K��7�Md/�n�i�Wl�~l���[i�i綎�8���!��$��R�����/=J�\o�NY�Zox;=�S�ѢauL����B�N�����$�	�խ�s��eUY6(LS+���bJ�΂���|C\�JN^s<ͥ��d��1W�3����6�*�	� cN����.��c�x����Wt���s�����>!��<��tl��q�e������PTm]������g}��H'Α����R̛Z�ޫ���q Թ�8&ȗ��B���T)-�v>پ'%�����;����Z�$�?�1�j�gy	�*��<'��6e VU��6�T#��H��-2�:�ƒEj��