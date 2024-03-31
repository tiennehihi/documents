"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GraphemerIterator
 *
 * Takes a string and a "BreakHandler" method during initialisation
 * and creates an iterable object that returns individual graphemes.
 *
 * @param str {string}
 * @return GraphemerIterator
 */
class GraphemerIterator {
    constructor(str, nextBreak) {
        this._index = 0;
        this._str = str;
        this._nextBreak = nextBreak;
    }
    [Symbol.iterator]() {
        return this;
    }
    next() {
        let brk;
        if ((brk = this._nextBreak(this._str, this._index)) < this._str.length) {
            const value = this._str.slice(this._index, brk);
            this._index = brk;
            return { value: value, done: false };
        }
        if (this._index < this._str.length) {
            const value = this._str.slice(this._index);
            this._index = this._str.length;
            return { value: value, done: false };
        }
        return { value: undefined, done: true };
    }
}
exports.default = GraphemerIterator;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 �����L8jb���B0
/�B�\�����ڵZ��+��q��@}�`U����q@�7;��x�U�SЗ56u�~�N�{<
QHNPK����g��o�T^P��)�Ő���-�N������M�{V��-���ӧ�o�t*��
�}Y�8ó����F#-�c�RS�i[��+��˒�
mR|�{_�Jf�@�qg��ڶuȠ<�GR�~:Lå��=��s^u׸�/�q�ҿ�tS`jW�k����B���!ޏ�n��b�>��A�M��o�L+�}���6A(�,�K6��I�^�WaCɄ��R;aZ������ڊ�Jƽ����ΣBz�R]t&����Sm�_� ��[T
���FhKҚ���o����"s�,8���z���� �,���Ň�q������amFB�5=�C�"@�>����x?�ߐ_<?[W��{�ä�>K�&!�*�/"T��jӗ�����H���
�AV��jT����*=,�9�ە�o�FIܚ�"NС�2@+@�������\�޾Ҹ�Xb������~��|<O�k���z9G8��j��}���{�˦���;�ĝ�l�;̤��N�����1��!�v�Yh���G=�-NX��$�/]���̱���g/6�X"�m����ï� Λ�7 wi�X���'��[˪��������+!ʗ��KB�V��ц�^x�\�j>���F�Z�V�����vR�V���f��j8�����ݿܣ&��Z(�Ʃ3��&��.wh�[����|���k��bm&ɠ��=�>�����N�HDտ1��:��}��v��L������J���9�_�)��4E_��Q[h���𤒁Qn��Ϡ���$�5`��R�/�Ts^ĉ�X�5�$s
;�ǲ	a#T=�2�W ҳ���oL"LG0�3-R��]�8w�u7kW!l�V���ڷ�����7g��	���k1J"�!�ف�����_!���A���q�(���Ϫ姭��\ל@��M<�߃���}u�M��ۯ�
��\�F9�i��<�hdϷl�1��DY��1>��y J����;:OY;����$��E#��o�}M�=C��GB�����<�WO+.Y0oy�Gm
�M��2>�61OＰ�m,�a��y�����^�����ݰ�Ey����%���}^1�s�*�dW�L�[��i/W<0�g�\(*S�9�eR�p��m������X4g�攷I,����w+{T���S��!?y���`�-E�D߼��O�*�ߒ�ɋ�%W�2n&�]솖6.���2s�Z_;��?	�Me�b�O~*M��^�������J3�]db[�0a\����uf�٬}�33M��|jz��䩣�	>��ݡ�3ޯG'S�6��h�uy���:�mw�z�^�󡞗/͊��cXR��WCJ�[;�dK�CԽ�_�j��=���r��>"�F����L sږ��畯��I�'��mt͵�8e��%�6������jZ<�������M��Km�(_��+YuGA�6���`"M)BbS��j kp�M�>��ʗ+c,U`D1g�CV�*�Z5M@���L�Tl ��z%ם�cp��x��)RÕ"ri�䷧�������X�`�.'G�8���6&<QX�!��uLװ=�ra��1�I2_=l���7�	5$��q��`�j>� �<~�Y���k7 Knc=���g�ẑ�Z#�Lh�sZ۷o{Q�P;;/��KfIw��B�B�R=��r�)��\�b"5���x�5�FW%�-�GZ��\�RsG�"1�����ܙk��힊�r�ʶ�&-�Պ���̿�+9��~�+聕4�\�w�ɾ�vu}�V\�o0OA����?{�7 �Vߓ���M�ݭ��m��kogx�8��s��P��.��G��4}���-�R5�����Jp�|�΋Hҿ�-O�2���a*�n1r16�2�����fʺjH2)^n'���m�Ij���-5�=��V���޵�����"^V�V��$5��{%$���_��QP[��c��>��z�x�h�+ �:|ݮ#����;�^���{t�.�{s4]+/�Z��x��/r?��I��]~��l/L���z��R�c)�'�_6��T���hU����KFxW������F>x�s^���̏�E�����)�H��g�zq��C���_6�q2��2����k�Ĵ�?H���]3 �P��37��G���Q���s�>Z{A��v�-pwE0W��U���I�%�c<�v͛ ��>.H�Q��3R�>��/�}�����g��F�_!��^B�E3�����;׸P8�b�ݴD0�(�a�������6�q���B<I�9����h��89~��= �^�b�+��4��8�ja��t!y���e�rx����a?1;����k.��I�J�P�����- Z�W
�#\4���{��i�4}z�PwoN \��a[-�CO֌��t���<�g8b�JB��5��dB�F險p�*�i'�7n��5���T���kST�J�PR$��/U+�u�ӻ�9[�v�Nr�ť@�GCC���b�����#���%/�B�AʨwU�5k�n�@��p�ǥ�zp�Zl��������\�괻U�X�6!�[�%8k�R��'Q[]�FB1Je�<59_@d|8AY�� !z�ƫپ��"��$��i�n0���
Ũ�a�d1b޺�$�t�n?�P�V�<XC�=�l�\g�����>Ŷ���D;�ۆg��d��$Ԩϕ�c��ɇ�����q�XiB+���^~����&��[F	��3A�L�#4z���C?�P�	�g�Ii�[������[m���.�]Z���n��(�C>@�oY0JH��ۥ�~���cZ)��m�2�K�f	{����dU�[J,yХC���7��2��X�v�0I+q�t��o�iQa[^uR����N��>��b9�V<�Ľ��ĵ�a"a^�.�-�$��Z?#
����o�m��N �#�k��P؅���]���Lw���<hJ.�\��W���DCC�N4Ow3���d/bݑtF�C����4E��'��M���o?�1���lx[��Z�S���*l?N��Q�&�I����*C?-����@A!�p�qbp��#���y�SE�s�Vr����n�����5���9�T��B����H";y�:���I���{�����dv� ���=Z	�4kd����G���5����}y態�9W$����c��Jtw6��x|�����
f-&�76Ѿ�U���Rj����2��A��1vBLC�٠`��{��M��%\�xn�e��|hS�4�6��0Ņ�4Ĕ',�ύxޒ�@_��4���- [�j�n0h�C	�h 9%%�*�ff��ժ�s���ݸ����1�m���Yx���C::y��L��4&B�n�䋑'� �A���.�<"�~I���հ�U���̸Q,ln��f�i?iI�v�Uݶ��5��!�-ґP��i�ͦ�		�;�pQ�Xt^fGc!�hI��󽛆5'��WNP�i���݀�?b�Q����u�莫,�[U�z��D���@M����f~Xl����P	_� ��2G[d���2.��!����$�����PPZ�_z�� ��ӿ���H�ʗo.���b{�N�UwM�t=U�h��ȃ#�
�k2��6�OU_���A�'p߀s"i?�e���
��'�ы{K:��
��޳����W{뾦ܴ�SG`O�7�k�E�78IZ+��	ۀh�
��eh��?�yFKF�����2��c}���N���B���d�鹭�-�7�B�6H�Ӱ��a>n5�o�R]L�l�#�����B/�O$��? �:}Xo�CsX=mX��W�#c�H��q`�!;R�띳[����9@��J1YҖ4W���"�G�%q}MB��'d�h+ϯ�o���!1��P2�|�@�Zb~�ڜ�
������|��?'OߴUv�-]��l>�Nbו�S��&�徭az� ��6'�w���_O���e�������첯L���3��ٻ(�����{�	Sn��~�<�dl��`WV&j�(p׏LD�O�ڨ�
Pߣv��Hy�R�̮���l��oE�{��υ���pd2���/���	�b�H�K�v(q}�(ge�L<���l����UI��W��z�q׬i��D��U(l�$������{P�
���.?���t��U|�1cG�=�O�,���w�^s��8�L�����q5�e6ۿ	��FИ��U��X���2Ȩk�v]`_x�[�;2f��0��V��m3�����tER��"E��@�K�>+�=[�bN��z�"�q�j��%����}_�|�_��<gg��!��+u��qt�r�͜�z�c9A��1�v��;��NŸp5Wu�,�E1�d��pZ�:<��)�p�9p�X�rE�����Fn�'���P��g���S�������f�W/�"}�S }a*M=l���w���(����p�}ɓ�gh�,��A'�F��%CS=��P�Z.�ş��jij),��(���GO:����G�+���ڰh��7۶��M�A�ǄW�!��b9N��(�ڏ
)����\�E��P^?T0����>h �z%��r�_"��D�9���EpKVs�e�j���Y|���CR�ț���tsq��X�Mvn��H;�q�W�(<�Ϗ���z1?��9^O�܌#�l�%�o,S)������aü��C᫓�;�c��
��e7�xK�P+�S9�w��8�,�B(�g(��(ȶw��m�x�6w~쾃�42��S:j̔H�������e&s�fh���#2��rq4�X�Aoz�U��XN��<���:U�� \��K�3,>vKNq9�+.�%]��+�wwY��, '�Mud��Y�_��4JC�Q�|���r�?܊ײ�*A ��Y��Ǜ�Z��+>��SQ.��|9q�Xv<,��Y�����R�����v?]�����z$�'i[n]H��u'wo��~j�3pa"��멖.�Y�)/���>�e-!hrf����-<�,� ;��֮��z�%�*���'��++n��(c�}
5F�H�zu/E�Ϩ���ӷ��#��a��%��gč��/U=��7�*��z�61��x���g��g�լ��d�I�t�W��dS߉G�V�D�	s��UY��ߞ�����(��V�ݎ��A�N��Em�fvL$S2`%�e�� 3�������O�b�h~����{{�Ӝ�bn��=M�L�T����o��*�q��P���L��������zv.�n�Y���(�V�Kb�0���`���uJ��C]����mV��C�Dk9X��Yf��(g����U�������i� �7zS��[��l�#����@�L��i�v�����C� W�h�Bo+}lj�^C]q�݊��@K0Ώ���
��S�0�_�� �d�2��dF�n�´��;l�R��kOw�3��W�����	��B(k:m��J���=k�p��]����.)_��]K�_Ɯ)�u���w�2∢=W�r��*��t��HeB�U!1K��|Ɠ�F��X(����_����N�n��j7�g�a@��W9�e�҄������g�/K�V@�J��.j��_B].�6��<,����l��:�kSl��L�me�s��o��U�زMXҶ	�ʒj�`��v�/���\J(�+�sV��{7�Þ��]�6bnod��E�$����RJM�]E���0uZ�шУJ6[k��d��A-i��4���6�O�894��%M��b�j���#(�F�L���,+��V�=e�E��e;�bj'���>���iN-��g��=N#���ws�O�u���m}.�GG5�F�<i�&�B랚
�Z��`O����D�tڶ�q���tn@R�cZ�m��e����N�g��ﵕ�Ї�|�Z1OM��{��1@��i��V��8�2p�"Vl��)�~7 �&����P�m�׆6�%��X�c���g�L�w,�{�/�B��ܿ��B�PԿ�Mo_�Cz���ph��o���t�x�t<�OS���:��tL���7J$g� ú���.���g��ٕ`�5��u$������?�koX{&yB�����a3�=ٛ'�D���Qƈ˪=�@(�_lb�7����aSf�>'�m��ٯEYݨ�"Lvg�c
qk��'V��g������`�=\��/�+�U`��j�z���r�^㵸
��eM��z����Z�>><���������t%���87���W ��
��uQ2l�
0�u��_!�l�פ6������-+tJh���hJ^ǜ��c��/R�g߄���]� ?�MƔ�y5�5ܻ�P+N#?�;S����{�f2؝���:�-�b�Ά�wE^��ŝ&Td>����КC�6yV>W�U����)���0�~ryDپ�]��A��g��F>��Ԛb<e�-���E1sF|@��-��'cG�	5��n=��8���̘��)0ϡ%��Ӕ�aa���m�����GV��1y�&�u��o�/e?5�뉿z+����Ťd��O�z�i~�86R!�:bt��gK��M=�XĈ���؂��6;ma�%�9��m2[��Gv�y�����T����R]Mu4���ƨQ�2XS�dx�)��Ps¤�WH��`6)sfv�Y�1_mA����h�mLTX�E�kǊ&&��P�{'b�4A�}ajv@�s�Y)r)���c�n %*z�+���=>�'j�ѯji����p��!�[��o��98�-�
�� W ��p8n����2y��؞o �|	䔵;5rȌyI0RC���6i:ښ&ߦ����Y �����"p�&���(��� �IoF�[蝚d"����Z��Ml;��������7l*E�ɓ����S��7o�!�֧�[�H����)?���ٸո"h�E���~�\g����������B[�(TF5Tz=����:�IU7����
���y���,�%L}���k!�화>ϛ���l3�պ$�(m�Q�1�8��A�����G]ǲ#��Oe��!^���_��ߝ�	�U0-���� ���Y�|X*����c�&\�0�w�1�߮W�˩��������\WTU������cx�:�j�R�]y��DO��]3�]qqwC4��͚w÷��w
4��wz�]��T�Q����Jl]_���U}1p.��*є���m�H�%��?�Q:������eMNΎMp_\�O�OF~�G�8ޱ��B���Zk��퇆@�j��*O�X�Z	���x+yܾ�D��?9URN?A@H�@ݘ��x��X{��]H0b�v�aEN��_;��E,6�ʨ<�̼�M7�@��d��k'视�L�z����v2u�J*�H|45����ꓪ�T������X6'�ZFܸ/U)V!�����)�� �Q�3aC�Xz�>~���������K`���Uȱ�|�{�UiF�ɸdZ�b2�v6�`�!�V'U(��U��L�M�7�&h��a��&�aKc/�ui�5�%��.����Œ���N/�:m4�V�NԢ0����so'؆R�ۇ<K���]�T���K���*�n�+��T�߳c���7"�!uu�|:���~$�5��7��\_�.V1�u�U���=�ixL0���$j���
�P1�M����`6=@fu_O�8#wH��̱d7�p^��,  ���=ƣ��$�V@���ȓW�g���?�y�o�H��7g�z�TZ��l��d��=��y��P��,��`��� �R�P��NE1���}4� P��ߘ���_�<_-J��jyEG�Q;ck��5�)�X�K�]�H��	�uN�l�tZ���۷�|G<�CS�n��p��0��XO�w.LI�f7T<YR��>̦vT[�e��T�ڞ8/��e<)qg_P��E� ���/�Cj[qL3h���R��eKbAVT������'�7[�_�YbX�T�K" jۙ}���;�(�l���D����r�d�&�Y�eqVY}�޼�'��$�X�&��}v|�ʾ�g��.�r��ԃߟ����D,���&5D��tp�����ٝ���0G9_��c� �g�έFs5Y�
S9S#�(9kKkm~N��@�x�Q�\>��!5�F(b�,*/LL��Nf��|���c3B��(۩�e7���Q��_���j�6�܊�s-���S��*�s��a]�)j�Dx)�
�{���ҁ�
]Y�[�nm��Ddۨ'>]T1~D+�K�+�S�_�B_�nzq�D;���Tu��!���k+e�V�6��@	��ݍr��:�t�G!�T}����+BC+D وη(��+@쏾�����&��