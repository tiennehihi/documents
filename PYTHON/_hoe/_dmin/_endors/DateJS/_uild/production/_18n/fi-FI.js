/**
 * Generate secure URL-friendly unique ID. The non-blocking version.
 *
 * By default, the ID will have 21 symbols to have a collision probability
 * similar to UUID v4.
 *
 * ```js
 * import { nanoid } from 'nanoid/async'
 * nanoid().then(id => {
 *   model.id = id
 * })
 * ```
 *
 * @param size Size of the ID. The default size is 21.
 * @returns A promise with a random string.
 */
export function nanoid(size?: number): Promise<string>

/**
 * A low-level function.
 * Generate secure unique ID with custom alphabet. The non-blocking version.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param alphabet Alphabet used to generate the ID.
 * @param defaultSize Size of the ID. The default size is 21.
 * @returns A function that returns a promise with a random string.
 *
 * ```js
 * import { customAlphabet } from 'nanoid/async'
 * const nanoid = customAlphabet('0123456789абвгдеё', 5)
 * nanoid().then(id => {
 *   model.id = id //=> "8ё56а"
 * })
 * ```
 */
export function customAlphabet(
  alphabet: string,
  defaultSize?: number
): (size?: number) => Promise<string>

/**
 * Generate an array of random bytes collected from hardware noise.
 *
 * ```js
 * import { random } from 'nanoid/async'
 * random(5).then(bytes => {
 *   bytes //=> [10, 67, 212, 67, 89]
 * })
 * ```
 *
 * @param bytes Size of the array.
 * @returns A promise with a random bytes array.
 */
export function random(bytes: number): Promise<Uint8Array>
                               ����J<�fw5��I���34�@����&L��u?��Iɛ�,�������C�E���v4٬�I�� ��_�t�j2
p��������G��뵋7�R}���+p,j�M0zd����郏� �:�X|�BV�Y�A;p�\�)��)�t�D(:�?W��3��8�d��Gap��,�X�g�A8��X�%,Q!�J ���o�dhq�u����|/dŵp]�VӜ�r�|�*������E)�"�b�d�$-�v��[I[���2�rx�(�5�袠����k�JWj-:/�?Y;O V���6��VP�n����/>�7`�u� }����w0��4�G]wp�������wOǖ�e�z9H��~v�X��!7�:���A(HFP�	�`���������$���Yk!���iG$�`��S֟���%��ڃbD5f����6 ̘�����sݗ��L<ؚD��!�U4��B��B��?_u���G���?Ȍ&��u.�����aCAo�W��͗U���!��%�#9�Y�hQ��0�Bٸ	��K9�Ѳo}�Z�~ʗa��đdH$^�bI��ֆ��#.%���4�tB�\� ��/��[����.�<��<Q��$h(�@ߗ/lsN���k&�	����m쭩@W������e\# �L��X#B�;�U$����"72QO��H ��ì��\�;/s��L�[�X����<_�~��`d#k�����M��FE�m<^�e��"�XܑN{��h�k��r{�V�&j-d<؞ࡃ��q$X�Ig�N#^���Z���W��o�HؘѨ]�z�ب���Sz�ޙ�4(��b�54�E#=�+����L���}§�aE�x,�J�h�����onUK�Os4�	{]v�~y��KQ�~b#�d��B���X�N��ˮu�T)g >/�r]J,��D�M�w��T��C���)�$�3�&��'N�T��Eǰ����c�|��P�U춆���������e�0*�^6���NřO���#^�6u���`���-'-@q��E��)�kx���מ�������~�Ȕ��`�����kyKA������P]�# �Z9=�;�.��EWT���)a� !�{&�5�8�{���#jS#���p���ۢ:���ᯗ������z9�����a絓����N�¡�?�#{���_�#���/�#���/�#������\�C���G
��0������黇N�E;�T?2n��'�@�q�9\V��LOGj����8�x��iR�A�׎&eU��8�vz�V��IB4�C�����}O��}O��=&މX�F��r]��}ђ����:b7� �܊u�<�=���S�r�;.V؂��ۥ0On�#A��l���="&�=ټ/���������
XJ#���ӷ�ZxX�����+ʊ\؛
��j����%�HY����n3�M�݂�����|i�X�]�\��]-�F�h����"EU�ׇ9ǗKvtL��!NH�鲲q�O�?7����_��q��'�-+W��R]���4�S���)�Nw4�plX��Bs�NQ�PpƱ��Ґ�\?;>����[�o�C9���S�c2��ӤqR:^�k*ǋ��5Z�3���ҳ��'fw���uD,,����-D>|t����B�.�	?�±�����B�ԕM�S�9"�upDqt��#�"&+�[B�R��G�ţ��}�f�wRN�#ژN��{b"@��|�3���-t��$ɚ��B�c�@${��|�t8/�O�Е��+���'}���>�9'A������J_L}v��Ʌ�0���'	]���A�շ
`a�	(����)b�9��Qo�ص�	1��	A��1)��K�*&$E-,��	:��5EE#�}���r�Ρ`1��~�%�]�6�m��5���凲k
n�o�E���AN:�; �7,�-b)�`[9�}���˵2��KV��b���E$���{x&����	�|k�`3��U�㻣�}W�{N-[����ɮ��Q�PxOq��� Y��l��0�^썽�� �&����f�:����� ����&����L�]��l���r#QH���ODl���	e�S�����a��E�f� ~g0W�������nWMSm@��TV`STYz�^��p�U��<�*I��f Q�E�d�˸�2�nQ�Zڅ�K����^UE3PT���f���ݞƧ��eZ�ѦhGRw�����Mƈ��ZD�_M��X�-V�0�#k�ox5 ,l �����nI�E�ԃ��=�A���\v��hڲv�rU�.����K�|�aAA�,ZV�)�	���7�mX� y�_Ț�'`�*Y7S�;�1�����
M]���2���)%�Zy��"I
yl����$��{�R����j$�m!�^-C��܉�)8���}�g�[��*c�l=4�i����a��~O�!�}b�X�γ���׏\dX�iZ��"��k�ok��兹����@���9�&s�I�6*�,Y��at�a��a
���P]
�{٧�,�&� ����fz�h�.M�,�i�xU����>�n��Ը\�u���s�3�`�%�����u�x��)1G��p��}���/��i�q��0F��峄� ��HR�z8o�����Īi,�lۙ�dH�b�)kv�	@�w*�kP�k0\�I�U�nE?��/G�	1�%���IdN�)�EIG�X"mn5p����K�t��!�`�9�ד$������A��`��`eF@��y�1��*�q����NY�>WT�>Q�����$�l`J�;�Iw}k��m��BT�� Ϩ��M���w��.z�0;�-<�������I�ϑ�@�HK�y�e���cDYr�KG���*V�uȒ�ؼ�/[dU��(ol�l�C���/	 �8
�`�[��c���:;6�X�o�lg��:��eyQFY������eXm�kEu0ڐ[��&���ж�3G2���0�q��1�Yl����v�MVr��Hh�Vv,��h���7����U5�pnH����'�,�um�F�u�(bB���J��x��!%�#;
taKF���62?��T��'l�ůTzL61�Ű}V/��vj��G��_F�'Պ�-�+�זտ��<F��y��O`E�
R�G�p�#8N{!����G�R<��.P����>"�hkƭ�� ��y|��T�f?IUt�4��5&Y\�����cq�A{�����g�K,����;wH:�5�a�D41p��r|�0B:lߘX�����4��Y��(6�ak����=��r�#���B#�����u����<?~��h;B��ޱ�/��dM����59x+�C<6�$v���Q�a���4Bސ�1j�8E}��}�U��������䬆��n�����(��C���S	;~�u�u�C�${����Y��%us�8��q�C&�/��᭨��jۃӅ��O�N����[Q!�!��j8+8�%\�f�oh_g��lۮ�99�
 ��US�K����q�p���aD�[���W�c�>�"�}�vU+�����,ϒ:V��yg�ljػ �� ���f65lc�M�m,�囒]� ۦA��'��~n�T_O����9�"�D���O�5z���,t���;չ�M��B�V�u@hx�����*)R|0�K���E3;.l3�tf��t_ W�O:9/6lG�I���{�D.\�H�P�_ ��*Mғ��Z�(iR6|�r#lWq(i�&��@~�*�V�@��b�B���׃&��m�	ȍ�.H���;�;����^4o����Z#��0��b�����Uǂ~��X` �v�1~�X�]�Bu�ċ��H�M���'���mtU
� 4zzl���=�h<0%�����XJA+��/�����T��[鵡��H䧩�������s�3��L-Sː'�^�I[w��&���U�