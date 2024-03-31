/// <reference types="node" />
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
export declare const signals: NodeJS.Signals[];
//# sourceMappingURL=signals.d.ts.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ��v��l^ǭj%e�ֶ�2H~��9�~5�b5t�.,㱷�Fػq�9l(=��_c����*o��vh��s����,Vz�~X1�*cv8c� ��I�{W�s�<^(�?�L��P��R�����p=pO�X�����Y]\��]I�,4����r�glv�3ԙfx�u'W]�WD��
������G�.&��EnL6�3uq:��\:�����6|�����r��������Yl�O��i���i� k^R��M>X��f�T�d�1_�=��\\�Rr<�b�2)é�dc�Z��F�L��;O�ws��	m��>�:�+�?hO���!�����mJQ�WJ�>�GI�'�ゟ��s_!�٬r��[�M���f�k� [��o���%(|K���Lx����m�B�Kqp�*� ����OJ����iy����-̗^Ӧ��m�[�2�!�|�6�+6����My>�m3G�4�s�[i3�G�T��c�W��]�\x��]��-��Ճ�6��;B�IY`���g���W�1�S�f��8��55�6�d��4��G���2���+{0��k�]J�CK+Ą�2[��Rk�X�<C�xj�����m-��KZ:A�� (,ǧ=k�m&��}#O�m�O��C�)������k���3�Z|�������ܹ�T��fXe���b0��$��߳�~�~�$x>�_u��ƾk��-���X���2i파���_a^��+��z{��[R�+��r琿a]���buai��b���uy�o
Iy&�M:��D9�x�x��,uCK[�.�$jr�dd�~x�f�����"���X^�� iz�W��"-wE�{{k+�,��X z��H�}W	{�*��{� �G����K�Zi�#˷��#���*\����l���H��P����Iq<�؎�Y��I�.Ĉ�,O`�On�SO��MI_VԼ?�Cr�G-Τ�2��8쭼�gc� U�GZ�Oxz/���t�OD���t����M *��&�k��D-q \;.q^�L���>{�oE�� ��[#�Tj�ş�����~-������+ѱ�$����z�O��6?5չi��vϽ�3ǧJ��gM-��Z�@?�7�