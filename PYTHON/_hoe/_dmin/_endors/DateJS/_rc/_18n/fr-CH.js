"use strict";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyURLPrefixTransform = void 0;
const errors_1 = require("./errors");
const escape_regexp_1 = require("./escape-regexp");
function modifyURLPrefixTransform(modifyURLPrefix) {
    if (!modifyURLPrefix ||
        typeof modifyURLPrefix !== 'object' ||
        Array.isArray(modifyURLPrefix)) {
        throw new Error(errors_1.errors['modify-url-prefix-bad-prefixes']);
    }
    // If there are no entries in modifyURLPrefix, just return an identity
    // function as a shortcut.
    if (Object.keys(modifyURLPrefix).length === 0) {
        return (manifest) => {
            return { manifest };
        };
    }
    for (const key of Object.keys(modifyURLPrefix)) {
        if (typeof modifyURLPrefix[key] !== 'string') {
            throw new Error(errors_1.errors['modify-url-prefix-bad-prefixes']);
        }
    }
    // Escape the user input so it's safe to use in a regex.
    const safeModifyURLPrefixes = Object.keys(modifyURLPrefix).map(escape_regexp_1.escapeRegExp);
    // Join all the `modifyURLPrefix` keys so a single regex can be used.
    const prefixMatchesStrings = safeModifyURLPrefixes.join('|');
    // Add `^` to the front the prefix matches so it only matches the start of
    // a string.
    const modifyRegex = new RegExp(`^(${prefixMatchesStrings})`);
    return (originalManifest) => {
        const manifest = originalManifest.map((entry) => {
            if (typeof entry.url !== 'string') {
                throw new Error(errors_1.errors['manifest-entry-bad-url']);
            }
            entry.url = entry.url.replace(modifyRegex, (match) => {
                return modifyURLPrefix[match];
            });
            return entry;
        });
        return { manifest };
    };
}
exports.modifyURLPrefixTransform = modifyURLPrefixTransform;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            �>5�� �hʩ��|��8���?��'nb���vNp���������2���)T��СY��ӊ�ym���1�s�|~�z�	��?u�h�?wP߻��|� >M���q \�1]�K kqvͱP���F |o�(_p�O��(l�`l���{�kc��xIM��{��Oʑ�H.�i� Z�0Y'��%{r$�(D���O���kz��1�U�D�?s�ˇ��kS��t�C�.�8w-ݏ�*pF:��?���Vݣ���H�[��  Ui��Qđ�<���Q�Vޕ�sL	KT��B�f�t���vf�5]�p��;*��[%[E��2�X�uY�)���^��_�FO橇�c��;̼�	����]�f ¯�v��r��*Y[�H�C�������YF�Z�w�4P*̕����1�Gx�C/>&��.t���\?�m!g�Ǡ���)������*�O��]Ņ#}~�\=��N;'7F��\��&0�ڇ��}���)p��@�s��3��+�����mq����#'�'7���s���`?��@�h��JZ���5��8�2�=����y�&��GC�Ƶ���Y��u�̹͞�@�Zs�̣L���a�T!��3���l�Y����s�����vG��D9�)��N��5r�[iȴF6ε�?T���zr B��..�$V�nb�,{�Ʌ	H~���e�Zf�
)�B>Se�1q�ߑ�;?R��M��!I�@}+Uƪ��xC@��$c8�p+�{��j+�����7�?q��F
ɺ�9�1d,�����OL}>0W͘N��n�������R����IpH������6
��$=���ICf�t�G��?GAa"ZGd�_wh��
y�o��(�ҽM	q�����Nom�L��;{��wd��׌��ZaIaA���5��o9�����#���d�����G�Z��H�z�+�Y}8���� =`_ ��^|g�%���ޜJ�b��PҢ��� ����q�U0VwG)OԂ�wܨ5�j�ĵYTĜ��m3���*�;E�u�����볉�*}��aIc�S��r�'�s��V(s{+aj�E��yW@u�:�d�%
��!���dp���P���ˌoe�r�Y�j��c���w����;�"�����U� 
�s3J�k��'��w�IS�m߹���0_����|���B��.�*Ц�p�瘂��@����o��W�a�LE�}{��1��3��F#��1t�"8pW;+E�/�up�P����`fjm h����DI���h��C���e�Pp��D�~��l�~������F�"K��[�����Y�����
��[�:��ڹp<�5d��GVP7i��ys�@KJ\o`ZUB��[B`����7j�]�8���]�1�����n_��~B���ዅL��w�����5���k/�UO��n�!�l��`�*P5��Ƅm���{[�Q��I�GXI/��� �c�BaK Jlя�-�^+���m8v��{���T����Fa�X8�M!|�	�ЦH.O��i�p�otF�6꣏K�v�B�E��-*�[m�I��M�-��i*�Ѝ	�q-p�ϯKO���DN�62�gz����L{��݃�&3����>F��h�+�4�� "Dc��z�ğ�祪ym��	��h��6q�2��h�1规#<>�>cz���@��B�{��0r5����`�z(�	u��Ze5��dOG��� `��� �(�Wuz�(����96Vj��4s�T� jb���
˝S��
	�_Z��,A�����!�ك4��_杓�R,����]o�d��*�KÞ�]��|A��C��;�n!�s�'jD����˕H�}?���Ã��P�`Ơ����~�����6��@rQߞHa:s(�߄�3���U�ծ��c�� �k��]w��3�!��'X�^-"���G1��)x	 �^�����D�1�'��R��R�I�,媚��|+�e̴g�X�����R}|��?t�v��7��M���Ϛb�-J�4
��}b���>q�;�=�j��@��S�4E��Ό����v�V����p�]'2~,=�ɨ��p9/1�T�>��sL���8�i�5���V�9w��xޙk��d�'��!�v����j+�ȖE	�>�����	�VM���D�7�F�U�&��߮nf"���UsX�f�)s��Ev��A�R�T�bh�����;�JTK�'؃B�'Pڮ�,�Eօ(y�H6(����~KIm4�T&4�_(� B�ٳ3�&0N�Լ54-�ZU�O;����� p��׋�j
�[Yk��1���F2�P$�:X�=�/�G��q-Vh���O�%A��F�#�ߺK�򨝻z�?[w�*�����Cԍ��;	P�  U��q#s撚ue�����{&w<��$\�6����>Wys��<�_���x��"��?1�����b!rA��`F9���d[ex( �韊eeD0�Q��[Q�O��i	 �,� ���љ�zCݠn� ��&9�Я���ESo�@�h���u-9ޡ�P�
��6��P0*�U��=|5��J�e�nh[s����T��-on`���yo'3�4����wx����י7c��Cd=��Zv����{� c�!��������Ŕ����zx�p�2���60�����ܓ5���9$��
��]7�N�M_F���kr;��S`e������<��M�f��qJ���h�B��w��"ٮu�)�����c����ky-�0KnV���(�1�C�����-S]F�2���/8(�A�mF��8��9	i(�B���f���Qޑ�SӐU��d�����;�1ˏ@�{f9��ն�jW���as�c#��Ʌ��!fjH�@$B�ufN��)7K,S9�hl��U��D�`��j��1�7zZ��8#>^�]2'��q/��/C,�co��J��!�Ft׬����D
�Z=J4�ZN�+�C}��m@���m���@�;V��Es�1J�	;��f@k