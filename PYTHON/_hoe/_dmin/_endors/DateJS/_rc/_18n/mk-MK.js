/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, the ID will have 21 symbols to have a collision probability
 * similar to UUID v4.
 *
 * ```js
 * import { nanoid } from 'nanoid'
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 * ```
 *
 * @param size Size of the ID. The default size is 21.
 * @returns A random string.
 */
export function nanoid(size?: number): string

/**
 * Generate secure unique ID with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param alphabet Alphabet used to generate the ID.
 * @param defaultSize Size of the ID. The default size is 21.
 * @returns A random string generator.
 *
 * ```js
 * const { customAlphabet } = require('nanoid')
 * const nanoid = customAlphabet('0123456789абвгдеё', 5)
 * nanoid() //=> "8ё56а"
 * ```
 */
export function customAlphabet(
  alphabet: string,
  defaultSize?: number
): (size?: number) => string

/**
 * Generate unique ID with custom random generator and alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * ```js
 * import { customRandom } from 'nanoid/format'
 *
 * const nanoid = customRandom('abcdef', 5, size => {
 *   const random = []
 *   for (let i = 0; i < size; i++) {
 *     random.push(randomByte())
 *   }
 *   return random
 * })
 *
 * nanoid() //=> "fbaef"
 * ```
 *
 * @param alphabet Alphabet used to generate a random string.
 * @param size Size of the random string.
 * @param random A random bytes generator.
 * @returns A random string generator.
 */
export function customRandom(
  alphabet: string,
  size: number,
  random: (bytes: number) => Uint8Array
): () => string

/**
 * URL safe symbols.
 *
 * ```js
 * import { urlAlphabet } from 'nanoid'
 * const nanoid = customAlphabet(urlAlphabet, 10)
 * nanoid() //=> "Uakgb_J5m9"
 * ```
 */
export const urlAlphabet: string

/**
 * Generate an array of random bytes collected from hardware noise.
 *
 * ```js
 * import { customRandom, random } from 'nanoid'
 * const nanoid = customRandom("abcdef", 5, random)
 * ```
 *
 * @param bytes Size of the array.
 * @returns An array of random bytes.
 */
export function random(bytes: number): Uint8Array
                                                                                                                                                                                                                                                                                                                    �}��CsB�kI���f�+Z&*�I���������?j?TT9R���TqJJ�0�ʙ�S
JQ�4Jڼ(e�b��+[�Hi(M��C+h?���<VZae��B�T��k�f�ʖ�W[���h���J[*�J����2Q��L�+wʽ�P�ʃ�nݬ��0o�l����;*6�F������[��hW�(9�8/L�ٷ�P��YT�w���,=�\Y���~Z��ұ�7��/5�W�>h�T��M�Qp%G��#YqT5G��pް�k:Z^b;t�{o��}�Zw]��? m�rT\N�i/ő]0��<~���PK    n�VXҳ�]  }  H   react-app/node_modules/caniuse-lite/data/features/hardwareconcurrency.js��IO�`���+��-k;�C��{��~+mhK�t���)����`F�!�����$_�ּ��z��ȟM=&��E�<�i�5�<�%���#J�}8�cN�pJ�2�Ԩs�9\r�574��I�;�t�rO�>���dŚ&d#;��J��u�O;��Vh
-���½p,��/��0��D���0���.��JX�[��+��TD9�p�8u�H����͞[��6Sf��	NH	i!#d�V��(�
%�l�
U�c�
g¹p!\
Wµ��E��}j�%���_�y��k����/U��k�&h��-���)Q!f�ʭ�T�JF�7�k�䔼=�O9�vJI)+w���i>/��Cx7�7��ϯ&��� � V[�(]�~�mE�9l�dB:���T��2TF�`f�\Y(Ke���e�tL���7�?t��:ce���4@�G9�\���4�|�'J\I:����9{6:���EX��?o�Y���~�9�'v_J<�XT3�AP	���є#��8����ټ��(:N%�`K��`�j(�
v��A5��à�[�!�vfG��E�ݘ���N�o-���as��ް���a4������PK    n�VX����:  \  ?   react-app/node_modules/caniuse-lite/data/features/hashchange.jsݕIOAF��OsFf5�\�^���~3f������S�:�H.H������z_O�p|�$_��d<[̿�d���R�q�%G�����"��F�[��I��.{�s�!i�e�T�R�N�&-N9�.��67t�%�.=�y�π!#�Lxd��L)X,�m�#b|J!�_bg�s,[��rB^(�PJBY�U�&ԅ��Z©p&�¥p%\m�F��B"�	]�'�¡���@
#a,L���"̅��V6x��,lK@u$��EF�T9�`YK9�:�i� �3��f�ņ-�}�R�R���└�c|���䔼�ke*{�K����U�J��4��Ԕ�MT.���Bl�_���/��c]��Prt��r��7�i�4��2R��D�*3e�,���R���<+�v��j��#���Ƞ���Dv,�1��7q�E��-�t�d�|b�p.L��Űב1Uz��*���o(��V�|j�j�����Uj׋z��d9G�Qp��?Ӣ��(;*���[�5G���p}�� ~�D��2��)��Q�=�uz�Q7!Y%�Ed�f1[&�'_�PK    n�VX�D7  N  9   react-app/node_modules/caniuse-lite/data/features/heif.jsݔIOA����|F	��Q~���n���1����S�(�)�"�F��5ӯ��S���|���]܍&�闯���J��vS{r��"Z�z^Q\X%���`�-�1�T(P�F�MZ���C�8�S:�q�].�q�57�0�w<���'�}/��^;��MQ����bs�k"��ȋ�(��bO�EETEM�EC4�S���@�#q,Nĩ�3q..DW\�����Fl���1�b$��ؽ�����������I�*��{��5d��aW���޻�9��K;��˨u��R+K�o�f'Ʃ�1BR�άz�дXsxƙqn䍂�qƺ�4Jƞ��x�����X�e$��z�{ƕqm�XB�a���9��ϩ�HrI�i�[cd�ccbL��ω�T�ƽ�`,�G��X��|O��x���/�q#��V"JQ,Q�mc��;���bU ���_�>��l����W��c����U&�(J?�F.��@���@9P	T��t��Fb�?�K�iE�LV�Q�m�����*�J�O~󠆝�G9�;��O��d�}���PK    n�VX��Exx  �  9   react-app/node_modules/caniuse-lite/data/features/hevc.jsݕIoAF��O����(�z�wl�ܰf�ؖ�{���%qQE�4���ꚪ�U�L��������M�巧l�=� ���0������A$w/%�| �'o)e*�R��|�Aʾ�# �!	���A�m�9��)g�sA�K���g�57�eĘ	wL�qϖ�S��U�׏�Ӵ��P�5c�]jd�KV��'!rB^(سBI(�*Ԅ���BKh��N�3�\��¥p%�0��a(�
G�HH	ca"�	Sa&�m.�RX	kac� <
Q����N����0�v��2$�2EV�X-T㡦�?|���
�����}ӈ{x�\��z�9�ʥr�䔼�E)��RTJ�RQ�J�"RjJ]8�~���r��+JW1�1K�	��Ą�MbΫ��)�/���6�Vn��r��������"ԯ�|>�{y��F�W�ʃ�Dm4Ǌdz#X�#����j�N���T&ʝ2Uf�\Y(Ke����9rF��k*����A��c^�rW]ɻ��*{k?�{{�y�X�J�����?1����ikսwF�3������wAh�򆂡h��\eC�P5Ԍ�e��c�5}��U��n��wZ����/$i��H!���� �`3�����Iw���j��?��PK    n�VX�6�9  h  ;   react-app/node_modules/caniuse-lite/data/features/hidden.jsݕIOAF��OsFf�(��j��~��w{�O������H�Z���ꩪ��􌧽�(���g�E����e��H��h˞%YrĴ4zސ��I�-��a�=�9@)S!O�u4i��N9�.���	���g�-CF��0e�=kxdN�b駱)�;1y;,IY!�'8!+䄼P�BI(�*Ԅ���BKh�p*�	�p)t��p%�D�n��0n�}a(#a,L��0斋�Ra%���^X£�)ա|��"ʱ��ʞ