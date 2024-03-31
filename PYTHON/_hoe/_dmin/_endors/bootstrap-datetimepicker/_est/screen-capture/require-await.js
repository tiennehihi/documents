{
  "name": "jquery.tagsinput",
  "main": [
    "src/jquery.tagsinput.js",
    "src/jquery.tagsinput.css"
  ],
  "ignore": [
    "**/.*",
    "*.html",
    "*.md",
    "*.json",
    "*.min.js",
    "test"
  ],
  "dependencies": {
    "jquery": "1.x"
  },
  "homepage": "https://github.com/xoxco/jQuery-Tags-Input",
  "version": "1.3.6",
  "_release": "1.3.6",
  "_resolution": {
    "type": "version",
    "tag": "v1.3.6",
    "commit": "2af96f99d231f6c5b2355ce61cd71de589f826e9"
  },
  "_source": "https://github.com/xoxco/jQuery-Tags-Input.git",
  "_target": "^1.3.6",
  "_originalSource": "jquery.tagsinput"
}                                                                                                                                                                                                                                                                                                                                                                                                                            /
function upperCaseFirst(string) {
    if (string.length <= 1) {
        return string.toUpperCase();
    }
    return string[0].toUpperCase() + string.slice(1);
}

/**
 * Counts graphemes in a given string.
 * @param {string} value A string to count graphemes.
 * @returns {number} The number of graphemes in `value`.
 */
function getGraphemeCount(value) {
    if (ASCII_REGEX.test(value)) {
        return value.length;
    }

    if (!splitter) {
        splitter = new Graphemer();
    }

    return splitter.countGraphemes(value);
}

module.exports = {
    upperCaseFirst,
    getGraphemeCount
};
                                                                                                                                                                                                                                                                                                                                                                                                                                     B���1C ��l�&0�q�S��!&XPd��T��Q*�q狧�G8��c�Ai�2���}%(������
�v�@�ŕ�G�@�:a/�3c�⚵�q:d`�d��N�r�cO���Ŵ����bڟg�aJ��`w�K�7�jJ 3�Q�&3�������-=�F�ws�ю���8�]2_�K���T�,)�Q�o�zT��w���3���/O5���d���=O�@i�����7s�����i�vsѹd&/�A�.m�.N�E�tiǱ���ʋ���]����^/�|�m���>�,*�%�2��H ޟ?���BcxR��&��!��ɄR\i���N��i���3��r#�������Ӹf;�-�a�j�  0��_ 0��j^�~���4��6aFR!n�T��9 ����ⱌ*%������8z�;QՐ�=U0�I��A��g��~��0����G,?(.f�-�� �&	f����R�+Q������"&��K��n��q�2��#�s"���.�B�oM������@	u��#.^�G�f����~c]��xh$�� a��]Ū���c'ڃ�~ B1��4�h6�$���M��F�7�q�א@�H��R� ���aQ�@{c���Ps`�ׯܱ	P§?߀`X�E�0kJf�yi��I'S���y��P ����	'���\\��܋ ;%�9��T�Y��{�ƍ����<���7F���_θ'pl��Xo3 /es% p�Y�jNYB�����Ȟ:�0U]V��t�5m��UQcP�,%����N�a��w�����g���2��;��?T�Wl���#����{T��IW˸�U�K��H�^��߷��b��Q=bZ�Vn�}��� ���w6<�:s�=Q�1zTg��׹������"��~J�Ǹf cOu�*���� �0��#�3��*�~�\q:CؿB�bg@��g��3wZf��!�פ��hg�#\R�F�����e�C��-��,��˦ɬ%��iX��4�qcU����͇���N�j����_}�>���S�;��K5����;��a�!�U���@ 0����(!�8�E�0�B$i��M�Gڴ&`�Hu�%p1�
�J�zt�r��3a�W�$�F$1DYuW�B�6ɥRU������lФiF�����8�	;�ZL�j����v���:�E#��n�0�I}~%);o�2��S�`����km��O,m[p8��Ű�\�K�/��Ԣ$�(����?��� �aiD���:$��