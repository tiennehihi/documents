"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signals = void 0;
/**
 * This is not the set of all possible signals.
 *
 * It IS, however, the set of all signals that trigger
 * an exit on either Linux or BSD systems.  Linux is a
 * superset of the signal names supported on BSD, and
 * the unknown signals just fail to register, so we can
 * catch that easily enough.
 *
 * Windows signals are a different set, since there are
 * signals that terminate Windows processes, but don't
 * terminate (or don't even exist) on Posix systems.
 *
 * Don't bother with SIGKILL.  It's uncatchable, which
 * means that we can't fire any callbacks anyway.
 *
 * If a user does happen to register a handler on a non-
 * fatal signal like SIGWINCH or something, and then
 * exit, it'll end up firing `process.emit('exit')`, so
 * the handler will be fired anyway.
 *
 * SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
 * artificially, inherently leave the process in a
 * state from which it is not safe to try and enter JS
 * listeners.
 */
exports.signals = [];
exports.signals.push('SIGHUP', 'SIGINT', 'SIGTERM');
if (process.platform !== 'win32') {
    exports.signals.push('SIGALRM', 'SIGABRT', 'SIGVTALRM', 'SIGXCPU', 'SIGXFSZ', 'SIGUSR2', 'SIGTRAP', 'SIGSYS', 'SIGQUIT', 'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
    );
}
if (process.platform === 'linux') {
    exports.signals.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT');
}
//# sourceMappingURL=signals.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        �W}�$��)n�%sZ�nw0D�m�G��@�A��с�2o�l$�ڃIy�Ϝ��>��S��b#��rzI���`,��#ܐ������9I�{�����]. aK�ԍ0���i��Gr:���1ǵ%�j=H7-�[+��)F�ATRC�Xm�$� �k�C��|�'��=�+p;�g����P�Č��<�iʇ�hL���s48SN�f2�wt>@M�)�*+��uUY�k�����?Ʃ]�e�8��
i(�
��˿`U ��y����]e�<K���K}��!������c�҈�-lK�����{���#,nQ�L�0E��d7�s�rQ�� �;ƭ�"g%�Y��u��$�1�f�S�@L9v=SR^D��e![s��'R�k=�jT�=�R��TC��t(�B�d|�#�m�zu o�s��H),�xN�}
~BdP�u5�.�w��N��	���ăʭ��R=?���E~���T��b��6�X��(u��]�@;��� ��w�����b�JU\��Y�4*�5�]��%�ja*�h�ޯ7���
�[�+�'C��@K�4f�5%f�6D�nqm7c��z���+�1R*>����z{67�� �''�-M'�"�L�3IL�{�JvVa�4�baВ�vဠO���m�T�zK��BY�~��\�RZ�w��9GVq�V���)V������8�F��a��!2�y� ��7��Ʒ������4�u����� v[5;�(nMt~0K2�����{��W��NzW�gY����x{m��*%��T������P;��%�V�T��ù�OV����L�(�U,Jja�P�k�X�Tvh�0��[7'���Z;ǕcP��@ao�n��lǰ.��W��j���
,e.�<�l)\�"^;��EX̅��炘��ڵ����"�շ<���|
$��ڮ������� �	�̻�?� G
�'H}���6~��a��|d�6XH)�v��ڌm��J^��8	�,[l��i�(7Q�a+ }�u}��itp��#�H�S�\O"0����W�'j�b�Zx��(�KV1�������^ˠp=},�D�{=S���1WC\����9v�q-g+s�"P�\�P�c!L�$Da?DI:�ǩ����Ydx���ށ�G��RxO(�aC�;���h��㣕s��9�����������z�wf�7���S�i�*<���@Ó�,)̐�4��>[ĵ��޺�����SO)CG3���[&"�����E�e�ixơ
�G^q��U R!�È�d)��B���Ң���O%�3��%��g��=�F��<I�C���c��b�0N�_�ӋW��~��|�bm��lv��z��b-��g���0I�#)��Te&P)�a��IXB���YS��Z���"��I��TH�R�5���%�B���m0�&R3�M�$D
�En�O���· E蕰Ypt�;�ʄ.#� >G��^(?����$y���W(h�+e�$}��(wi|�������B�i�>���NZ;��_-O�FPK    0l�T�;L�(  #  B   PYTHON/shoe/.git/objects/8f/0eb9fcd6e7a3b483ae66db974ec823de3057df#��x�Xmo�6����+PԲ�(��]Ro��nX:l���m�&JK6%%���݉�DJ���bf �"�{�U�xoã� ?��������J�iR�8���gQ����"E��1
�@��(�R~.Y�5��c��>|ӪP}�u�O��;���Dz
�,��"� �WLf<�C��{xq-��.拴k�$ب0��d+�BRN��A�xneg%�E�Bm}|.�*0h~˖c���9<�/��s���f���:,K������/;p�]��"�d�T�L�/,����<]��(ݘ���%�"��k���֊D����2�\`��h.9(>�p�g��Ӄ��E���:2��LE6�<�8ϔ�Q���r�l�w�bJ2����.��o0#�rr�)��TGx�1�
ɓˣO� ��wutɧ�g[�f�f�xԱ�ɍ�:���T
���QM�KpZg��k&�U�,�
��k����Zv�pJ���UݾQ��}y����_��/�h_=о��7
7�/JEǴJ�^�R�\m��4o%Xy6����^v<��x���&-\t��T��I�Ýl�|���%Sg7�֭�^��/�p�{�K�E����<Y`�_�h�?����eia����E��C�Zɯ�kfR;�&]�fv�
����j��ܽ�3�G��M�����>����z�?C�9��\�*�
5u%�����xuVMz
z>ì�����]g��QU)�m�u��uǫ�8��"��]7���ꕛ��#���"�,$U�&I��\IZ$׃Jf�&3�d��d�+���J�u�����{$oq�Jxm=��(h#˦��&��V�,
�hjR�#���n�1�UT-��3t��08����?є;nv�r��&u.I�7$�>I"�!y�Ă'�cķ�-�drK�ֈ����������e+�����p�����۬�U���RUԗ�4�|���ߞ�͋,���l�l��ʖ�~�	����B���M��ѽ��?]3��Ώy��g��p����������&�mͣ��&��V⺛�B�pt���8�M�Jt��M�\ʂg.=R���#e�k.k��LaDo�Vp�Ҭ%P�I�Po5��yg��7�	�6rW1�_S����4"���X��S�P�)�,Nڶ�7�p��ǹPɃ�tEu]*�������N�hR������vcQ�㑢	����X�ʷPjL����.m���R�A��j�;D�Id�Ҧ>�@uy���P�q���·���i�V_�I8_�Ҽ�l�l�S�CZ��Pb)q��G�`�|Pl)���'�x��AR6�@]x��G�%=��¡���n��t!���<�+V�?�~����yK?�o�w���'��A}6�p8����T�VE��wJW;IL�~��g��/�����'#ϗ��'�N|7/X������sf���F�'U5_[��������F����"O�;��[�v}�p�1����ng?���z�;����k,�-�&g�/;�������_��u�� ߶��Ay�l	����Я��''-F/���'b�PK    Kl�T�6r!A  <  B   PYTHON/shoe/.git/objects/8f/1a855d3c15081f623de228b0c0c704761b253c<��x՘�?���g�lg��o�lg�����Ud�C6��y6�!N�8#�����{SȌ���3�?�^���?x>^O_x=��ON���KO�E  ������1�_�h������� y�Y� t,�2@^>' p�V_[�����7�/Y�{��N2U�÷AP��t��-�ux&׾9�;d������������'/}P9��(6V O�D�������� �@?�,��!��߶� m�{M�.�AW��p��^��)��8������|����+H��d�LVZ��!�1h'}�tj��o�'�)��e��mR�s;�lG�T�c�B�ł��V\~�坜���J�����+�1��X�����1J���\D}ez_��7@ W;3s�h�	5�� �SHy5#Hi}6��i�������u��[�c[�@#�G�'����O��$Z}��JH�t�'�c�}8qՊ��d
�9���P�eH���qRWF� �/�Zܼ��$+󻨁��|ƻSkT�P'��I�5�׮�
���}z�i=��X��ok�HeD�"�~H����>?�iv�N��+}�@���9ԕi�9B�x�s���ˇ�vJ��)�q&�A�
�=��5Z��SK��T���QTgh�An��As�J_ɩs�����󻛹尚jh
{X��{���mKߺ�`�ާ�rπI��IQHTp�nC����p�{�{�~��m[�6"%/�@8����p��;�*-��ԃ���p_�&�iȝpOna�H�����U֍ǋ{I�JF�lV$Up"��Ȱ�]P["4xbg��֓#�!O�bٻ�fj�����jg�ۂ�c��vSg)�%����\�ݻǟ3���P7j#�QU(�lr�n��e���"RX.D!�# ��j.j�>��K_�5s�%ƻ�T&���P�oWpS�JE�u���˚�Y)��)�2m"(T�\�ƹ+�חgp~���n5r�\�vV�r,���<J�5���5��,��k���;b/Jƹ���=���a�����	�s��������oK���[��H�C#��"�尘]�'��4��Jxo�9`�dFDj�b|��X���ó(�H
��5�����ݐ����i��͇�	?3�~(�c�^:a���U��Z��tS��Ð�Z��n�i��ސ�&��_j��