import Pool from "./pool"

export default PoolStats

declare class PoolStats {
  constructor(pool: Pool);
  /** Number of open socket connections in this pool. */
  connected: number;
  /** Number of open socket connections in this pool that do not have an active request. */
  free: number;
  /** Number of pending requests across all clients in this pool. */
  pending: number;
  /** Number of queued requests across all clients in this pool. */
  queued: number;
  /** Number of currently active requests across all clients in this pool. */
  running: number;
  /** Number of active, pending, or queued requests across all clients in this pool. */
  size: number;
}
                                                                                                                                                                                                                                                                                                                                                                   T:��,�w� ����_�F��'�c��{p��Ch׳������/$���Aj��J����p�09��}����n�!i���x��Ue���Ѫnթd�������-o�"#��^���E&,�����	�=o�Қ@��(��7ZqlRbDu��Nqz"��P>�N���t����]z�/�p9�n�^��M?a]�nK�\�c�D%����7�-S�iu����-��:�:?�'��T���Vs|���tGw��>*D�8>es��|�o�hiu�jt9��=�@O�WI{J���Afg|mA i�s`�[/F�J�R
�S_@�aPW޸�����yRF%Pa��O���?+��KzXG�n�~��~��;\ߧb�����FT1=u�W`�|6<Z��L�W?��s�&c�͍b[��r'�s��#��������$d&���|YW�2N*]�y�;�_�ǜ�/F�?%���Q9���g1d��I��S�
�2�s#ɋ#���Kk�������/��r�������ޚ���h �	d)�wx�R�Ou�2�~|������Y��˷��y^'K�5A#0���n�ܠ�Y�=�,	=�o����B�5_��lN����}]ʁnFiW{��C���Fb�_�GɁ��g��+XSRĂH61yF-� �_��V�t�!�R�Q"���?�i{���L���p�QJ�z��!'���J�5�'�GyU��m0�21��9���N�e�Ru�v�����E����vR������֫�#���u����˸,s���t���������m{��s���uT�'�)܋ ���/X��	ӱ�E򋲧����aP�����FxE�_-$�����&����Ф��yxA'�MɄ�Q5�Mk���t�m��ƞ^5�z��}	Q�#���tG:�P��%���^��K�l��&t�IwH�h��"k��p�J�մp�I������Y8_\��`��ʗ���
Ĳ���~�'����7v|~��_�p��0�.��z�b}~�C:����	�<H��''����@�@$���,sF��B��{u�= r>R�ꬱ��Z�D����\譚��T�}6F5+l�c���X�6?��']?���&"
�(�x��5����@��#��2�-�	��MLuh�ŀk�Kτ�Uvt��c���,�_���q}�X�{X�M�x��S<1��8�>���d�V*�?ؐnUEN��r�d�R���en�Kd>��}=�ee�:�nKhO�=�1"H-�]WR�1ֵ�|���F��uߺ>��� ;�|��M}n��,r<�n�c���eV�:u�hu�G�d|?�h��I��Z�L����m�Rw�.��1O�b/���8�D}�om]ZFRĢ �GQ�N�%.�H;��K�9�9�:��R+lZ(m������z��muC\��3�<J����/r0ɍ{M�{&��
�g���Ӯ��LFy�R�����w���S6�9yG�M�p�)�%ӥ??7l[�s1%> �VS�u_{:�|�#"()�r���l���������Z�w�+�r��51Lf 7O�!K������N]���m�~�1��C@Y�n�:�vK�َ@[mM����^�NDX�_H:�s����cɱ\����KH�ϊ�;	��棱��q�߆��/�Nb�C��]��C��T�Fl��C�f�%c�!6u�&FώnJ�;��W�;��d>�Zl��>��Y��N���=A5T/@�ρ�ՏH*���F�?2�.=h�tc����8
�űp�t~ɻ�BJ��q��
!��}�t[���d�)��u��O�	gER8&���E4�&�<�뻯s�Gh�]3ｆ�p�/�!��wU���ϴ>��)���9<�w��U�C ��5��U��
5m�rʀt̮&���\����bb]����o!7HK���5z�
vo����UY��T1Fv��a�֛�l�v&J9�!��i/׊[�V�%S��6�i6U�!��C�=e]��<p1�5�\]J���tg����R?��k���������Mg�	�*��ϵ�Ў�4�9Z�ThDտ 	�����P�D!g`��@Z����a���P��5�ȸɽ:V����,��Z7���ͯ��~�z�#iQ3�:f�K�}�{PS��R��	���!�����y�	���h��3�A�5:i�ri�Z�C��_�X�U_[;5K߇�6J&��ps�W�� �n��p��W5�������Qt[���'��16�>W�/�靪rE�!r�TR�\CP7]J��ߑ��+��i�>ـ#ꗐ�bg׭�H�fW�?E�U]�n~|��Q����Y�ڷݢ�ʰ�؎W�??~@H֬-Q�6v�%>��P�r� �mN�p�>R��cPx���:}�2>N��~T�q�6�b���|�H㬙v:�:�$��b�>ô��+�X�CYX^zh���.�cr���ݣ��:�j�uuj�X�$�K�G2��6[dϭe��*N�KJ�Ņ����ț�O��7��#���SIW���M!,�o����Ճ�Փ�� ���OE~*�;ʃG��ؿ���/^߼G�� �tZKsv����-��7�E-��>b"��T1��P��Ķ�����P��U���x��ѝ�Z�Xz�2�RF0�[�� U[�u�.�p�&9s�%�}��I�r*Y�0!���2��Lv����Wp)��w]/]�m�Ɉ�rb� ��	�-'����g[�G���SYls�2��}ȕ	�e��鍁��/k��	ZY����Ҥ2�7���U>��'rp�?n��+;݈��$�ϕ���e젇߶8�\v`:��(�˯*���N�R�	,L��<xo��F����-Ne��-��5�cG���|��m8]�^�F_��n�lq����u��踷������J:�o.�z_Ϻv�Q�s�����||,6wu�O:�g����>W�~�fX$N��r���n(��c�5���T���]�[*��L*OX�I;�QI��?e�k��ǵ��A'�sqBd�}\P��7�	<�ط"�臒O��՜'.�YMl�(��H�� l��,�Y����H./��b{��e%�)��gd���y��Z�Y2�T+�`Gǆy����/_t5�kC�`~I��ɏJ���k��}��#vW���,��c��ǖg�G�f�7�"1�(���-���+��9����ٷ��v�_~�����Q��`���}���Mc