import GraphemerIterator from './GraphemerIterator';
export default class Graphemer {
    /**
     * Returns the next grapheme break in the string after the given index
     * @param string {string}
     * @param index {number}
     * @returns {number}
     */
    static nextBreak(string: string, index: number): number;
    /**
     * Breaks the given string into an array of grapheme clusters
     * @param str {string}
     * @returns {string[]}
     */
    splitGraphemes(str: string): string[];
    /**
     * Returns an iterator of grapheme clusters in the given string
     * @param str {string}
     * @returns {GraphemerIterator}
     */
    iterateGraphemes(str: string): GraphemerIterator;
    /**
     * Returns the number of grapheme clusters in the given string
     * @param str {string}
     * @returns {number}
     */
    countGraphemes(str: string): number;
    /**
     * Given a Unicode code point, determines this symbol's grapheme break property
     * @param code {number} Unicode code point
     * @returns {number}
     */
    static getGraphemeBreakProperty(code: number): number;
    /**
     * Given a Unicode code point, returns if symbol is an extended pictographic or some other break
     * @param code {number} Unicode code point
     * @returns {number}
     */
    static getEmojiProperty(code: number): number;
}
//# sourceMappingURL=Graphemer.d.ts.map                                                                                                                                                  e��t�e����/SPvw�>�V�U]C���T	���	�>&�������Hʋrk6�#X�� t��ae,��
U�j�_N�g�L{�즣�ɘ�Lc��j���TN�5Nh��	�	�4��	?pl�4���(�i��o �L���fbQ:�*}�si;�AT�����I����2k�ka��R{^��H���%��4X���<;���������:�!HzCŭA����c�k�+�+j5vB�nE�l�Ɖ�7x���0��c�a9;�л:�@��\ҁd,O�j���7Z?�_@�~apP���U����п{E��F���������Z,|���TvPVo�na
w�9B��:A���+벁�{@5�=��!�+��a����yi m��K��D�����2��oPK    n�VX�c���  x  J   react-app/node_modules/tailwindcss/node_modules/resolve/test/home_paths.js�WM��<�ﯘRR)d%8 Q��$[@�}�&�6��	�����3��$v�tX"U��{晙8Q+(ɋLFˋ���p��-8����KM���>f��eYl.;�l�܍��Y�4SR!�LIj�=Zi�\C�|^T�l�|C�����ҳ�yx�F�H/G1����>��V��%[�UHU���u�b%�@��:��U��%J��iY� '�0�&O*��@�J��2-�mY&��AE��eZ�f?/ S�XS{�rn�SlOH��6���G�%�	J��JJx^߱�w������}��1P�*	�ȼv�X�1���2G/�o�j�P�mEJ�!�W�uY��*�R�$�OQFˎ����SN��@�'e�!�~�t�*R�8���T41�TMd���`�3vf �i!$L�	������}y"x�-��7��qN"��qT��6L�me&Q�[D�RJ��L������,u��
�|�"�抌�j�G�+p~���u����3g�T��)�,w��k�hج���t��"��Z�H���ȼ��;Vꖥ�A���0�u��_j��o��a([C���I��7��OPޚtP�x�޶�魈�,�U����{-(��q��'�~��k��q���.�8r꣬�� ����h��
l10�;g�Z�	4W~�CՒ.�ǆ���񁮭����v2B��������(͍8;��_�NIy:U�Cr��5�~-�؅G��FU(����5HϜ�����z��$��@���x�/��4��)��`�ZsGt���߶���2��{���-vLc���+8������^:7ֵ�啜� �Ws�@��b�%�(�
�o��XG��`����B��:x���6n1]�3NrJ������^@z�k�����υ�вϋ�7���H��4���=\��/#< ����U�ٰm���5��Ϗ*��(S�M-w�|yК���:���� PK    n�VX�c��t  �  O   react-app/node_modules/tailwindcss/node_modules/resolve/test/home_paths_sync.js�WQo�0~ﯸ�I)#Z�0ihOۤ>$���=q�Qh�Pۤ�����m�@�lچ)�;�}w��0A-(ɳD��Ցp�	� ����a��,��}Y�4�2�y�]4kX�w��Z�RR!]�$��z�\��X=�
Nv��H����ޣ�'e����\�^;�eы������g�5I�V�gJUn�]��P��!�X��uQ�uN�ұ|�+�	ό�ɓ�2?R���%�dW�Df%��(��9 �9$���|�nX�PK[�rnԓ�"�$[-�[�	h.�g%#I	O����VW��Q=�S�JB�r��������6'/�ﴨ�+��ۉ�>fB�[�Eִ�u�(��#�ѶNp'��:�(��#��-I���T����n'#�͖��Y�8��?���g�c���f�DCG;	�Eg�O#��z���7��I'�5`��+su�E��R��dT儅���Rk�Vx��t@F((��yf%�%<d8o��p��\iƌ�0�1Ne͙���>�=r�@�f�u��(��R�H���Q�.P�njf�9�݆��0����:޼���n:s�,K\��2i�����~���&y�Ҩ	=��+��e�	�=M������Bwu��6�^� ���肾�H]V/���5�6ڀ��z?O��(�a�����n�C�C��x�q����D�ǏQ>7�H(��a�1F�V9��05Լb$�sR�\��W��^¦�
@�0�
�d�b�%��c��+��Q�w5^t�՛W궷��7�(�r�=+��Xo�bAC/L^�s#�tj; ��ҍ�PLg1�ҿ�(����E��	�k�NNbWj���V��ډ��&�� �S	��)��4��]&ݵ�����PK    n�VXc�l�e  '  D   react-app/node_modules/tailwindcss/node_modules/resolve/test/mock.js�YKo�8��WLs�$��l�=,bx/�����ڞ�"��q�D&�$��k����'eK~�N��D9�<�i�2		�c�����Dסg��uhL����f	c��o���S퐘�LDp�ta4偎W{0��Č��\z&�Q�2`�E/}�>&c�\�뜎�82i>�����g��8RI�[p2 -������D+w���j�$�����ygP�RHwks#��8vfE��B0��P�
�.��q�kLؤ�B���L��{)�z�,�S$խ[A�<��ՠ�6���Zșm�1~�]Ϟ������^�D�+UA����н�-C�Oy�-��)�˧�t�YY�f/�&�2��͕mA4J��Ҵ?bQ����оYq,ve
�~�4��]��G�0���zM~�A��Bm�ہB��'��2s�7�\hS<���1B�#)&���o��6f��9�z�x����ӿo.//�>]�;���Oگ\�#�����Lccܱ�<~�O�m8EA��&,�g������B��<���I�OY�fY9�Ʋ�K�shf���ǽz7�\f��F�Bn�A<������WZF�*��*�9-�k�����nkk��l}�Vx<O���)Z�6=f���{��Q.��<����HJ?')�t��H��#y��R�I�ג�뽞�7
�F=��~��J��'1*P��W�ze��z1-�q��Y���Jh�hU_^T�EtQ���|�_#{�z�W~o���ĒC�*][t�������r6A�R�胙�fd�nDs���&E����m�ʐ�R�"�YI�h�����Y�0������9��J�6����I�թ����(���-v�����Wb�zl��/�D�� ���"�=���q@��W>Bh?c��H�Kk�j�R-3����q!�\��#Hh�9,�}�`Q)�-��u�)E�AV�U_΃��y�W�&�8
�}Q��1�+=����[��ZY�+�\e���ֽE���o¤B���m�,������޵�(�"����v�U�C�Qc1�/rTM�G��XO�5EN�?��WӷS�7����F� ����r���;9)�c)�[M3s }	F�g>���2gB�fP��9Śp �h���6
1l�.}�PK    n�VX��"Ћ  �  I   react