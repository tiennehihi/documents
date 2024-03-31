which patterns are considered "greedy" in
Regular Expressions vs bash path expansion. This may be fixable,
but not without incurring some complexity and performance costs,
and the trade-off seems to not be worth pursuing.

Note that `fnmatch(3)` in libc is an extremely naive string comparison
matcher, which does not do anything special for slashes. This library is
designed to be used in glob searching and file walkers, and so it does do
special things with `/`. Thus, `foo*` will not match `foo/bar` in this
library, even though it would in `fnmatch(3)`.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 kأЕ~I����j�FW���h"���d� �%�rFT.	�omP��'*Gn=��hx��l�+t�W?9�_�LMq\�&+
���L���E!�V���SR���"�Jt-bcQ���D�\�T���o=�J�2fF���W��&T���7f�}���f�馘e͍�C
������9�؉ѓ���Ԉ�h��UXB�ͺ\ 4Y �Z�Vl�N�=��x�+�U�dDBE��Ǭ��J��Q���v8|'�>q�1~�7(�?��,��apd���:� �*FҜ<P5{411�8UGI{t1�x���N���#�țQ�@?Ѭ���ZǾ��r)Fm�X�M�lsVkPX⃤�Zh�Q��q��S̓�*"��$i��~k���j���Ih�|`~u
�jۆj�kD�{�Z�bg���7�Q?,���1�H�]�߮~�r���x6ؙ6lA	_��(�%=�=���_͉�
��0RG�w$x�+�㖾�*��4�4-0"wN��0gu��~˛?���K��1ܫ n�<��;Ye��?h��=���h�_j�QU��f[J�i�bS�����L�T���-!�dR�]v���窱����1mq�氘��6�v�;j����V�am�M��N�p����ڱ���D4z��]PF�ӑ�5i;����W���{��*(��	���l�|�%�,ѣQ����_4\�DW���
2A8@�V4��m�����˃�	�t�j�D3A)���]�P}H�FJں�tBN�_y/H���:e,�0�˲s�q[?�˽bBHWU�q�y�d�v�j��?�{���R`�lR좛H�J��e?_wδ�IKM��4"-��ŲA\��!�k�k�%���L�Wf,�֗Y�Z�ꁈ�B��n.�~�� C��/�2jb�uQ?�B(54�yZ��6Q+�Nn�<�7�fP᥷ϐ��e�UڦY� �xH�o����4�mPئ�JQq#�����e@�h��2���ܩR×�?�|J;��8��2V�L����M��)�^�2��ӡ��4�Q�s�@�=��hkm,Rf�Ȯ�[�bk����ۭO�������3{P�]�լ#�E�b��/�S)<ڹ�6�*������5b>ᓲe`���&QtD�����J�_/(�:�S�����27����/�';nHִ_\Ԁ ��#�n`?ٛ�4��Qb��d�MO
���A�4f<c�J�����0\�Vq���n�$�:�CB�V�b{k~龲�"kJ�F�-�ņj�:߯��H�|�?�ۋ���n0��c��>3�ܗ�232x=E��!�*5
��±:����q�����nh�L!����"��O��=Q��n�9�