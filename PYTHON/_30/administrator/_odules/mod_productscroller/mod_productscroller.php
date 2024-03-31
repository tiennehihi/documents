# Changes


## 1.3.1

* update deps
* update travis

## v1.3.0

* Add nothrow option to which.sync
* update tap

## v1.2.14

* appveyor: drop node 5 and 0.x
* travis-ci: add node 6, drop 0.x

## v1.2.13

* test: Pass missing option to pass on windows
* update tap
* update isexe to 2.0.0
* neveragain.tech pledge request

## v1.2.12

* Removed unused require

## v1.2.11

* Prevent changelog script from being included in package

## v1.2.10

* Use env.PATH only, not env.Path

## v1.2.9

* fix for paths starting with ../
* Remove unused `is-absolute` module

## v1.2.8

* bullet items in changelog that contain (but don't start with) #

## v1.2.7

* strip 'update changelog' changelog entries out of changelog

## v1.2.6

* make the changelog bulleted

## v1.2.5

* make a changelog, and keep it up to date
* don't include tests in package
* Properly handle relative-path executables
* appveyor
* Attach error code to Not Found error
* Make tests pass on Windows

## v1.2.4

* Fix typo

## v1.2.3

* update isexe, fix regression in pathExt handling

## v1.2.2

* update deps, use isexe module, test windows

## v1.2.1

* Sometimes windows PATH entries are quoted
* Fixed a bug in the check for group and user mode bits. This bug was introduced during refactoring for supporting strict mode.
* doc cli

## v1.2.0

* Add support for opt.all and -as cli flags
* test the bin
* update travis
* Allow checking for multiple programs in bin/which
* tap 2

## v1.1.2

* travis
* Refactored and fixed undefined error on Windows
* Support strict mode

## v1.1.1

* test +g exes against secondary groups, if available
* Use windows exe semantics on cygwin & msys
* cwd should be first in path on win32, not last
* Handle lower-case 'env.Path' on Windows
* Update docs
* use single-quotes

## v1.1.0

* Add tests, depend on is-absolute

## v1.0.9

* which.js: root is allowed to execute files owned by anyone

## v1.0.8

* don't use graceful-fs

## v1.0.7

* add license to package.json

## v1.0.6

* isc license

## 1.0.5

* Awful typo

## 1.0.4

* Test for path absoluteness properly
* win: Allow '' as a pathext if cmd has a . in it

## 1.0.3

* Remove references to execPath
* Make `which.sync()` work on Windows by honoring the PATHEXT variable.
* Make `isExe()` always return true on Windows.
* MIT

## 1.0.2

* Only files can be exes

## 1.0.1

* Respect the PATHEXT env for win32 support
* should 0755 the bin
* binary
* guts
* package
* 1st
                                                                                                                        	��0�g�!_��rC�x�"^
Ĩ� Q��Ώv���EzSLw.�o-�voy=��J�ކ�z�k<㪳Q��B�We&�;�D������Ÿr��Z5b{�	"��d�qeW�A���W���E���R	�|�=�?(�4�<��!��U/\o��K	i��Q��P h������.���0�:�<�E�lřCH����%�;��h�I�j�J���3�Z9��S��d(ΐd
O�V�	&vZ����t�FL��}�~AcȲW(*C:���\�$�_���b��O�@�ڏ� e�;]�����_r~S����Wl򵼗��f�����Qy�A�"��2�#	��[�Yמu\�	}�;T�.���k�.O5O�'{�������ʗ�e��mu��h������!y�tN=��	{�����P���[YI�G�ޓ]-����3BktDJ���<x��L:%:�C$�E��c�C3�zޢ�?���IA�d{f�{�nu�6�6Q�6�I�oJ�����
d���}U_U��dw�[+��w�0w�|��wȂ	ҹt�Z�]q� ��Awsl�ԗ�=�@�#�A�5�A���
P���o�|*d^v����8{��� ��� =C�J	Fg���Rc��?{I����.����Ml�2��? '�>�_�w��m��(I�6���u���©��Ө�2/��sȠ��K����ͽr�A�s�z����~�u��X�^F���cY���c���0wP��G�Nt����qTו�������_z��e��u:����Q����l��o���~j�ͪ���+Ӌ.�b���r*#v��gD��,/)�S������=>>B��+��)��?��3��r�ɱ������~y#Ѵ����o����Sz�������3�q�������%5�N:��t�4�Wb5���!O�n��۷�
�S<s���4�#.9R\����NSz41V��~�@�k*��܄ϊY�!UZ�sx���R�1"��k
�*�AB�5��Qt�I2�b�i���ݥʀ�:h��
zֹ7��܌�o2Z����/|\����"�㐾�N�iP�;�yx���呬�K�n�����CR�*v�vH5�i~���;�!2	�HI����[z��MM�*)�/=5�B��!`�|�Z���p�M>%�8j�V`@��C^ {��v�^��qe�ޔ�u���c��΁}<�E�y�Ȏ��C�0��R��y@�i��h��>f�Z+�_����6�\�}�0�I�l��(���\,YX��^K͕^�ܻ��b; �������%�Yr�àM%γ���3������L��-"*㝚̣Ѹ]�Cۡ��.�n�
��05���Æ���I�Lo���F��1�b� �(�u�qHP�����7� ڃ?��S�K}wy�(��b%A�v܂��K�29��~7�p\w�n0�c-��R:�p�����fx���qh�ǝ3,[E���ȳ���ˢ8C<F&��u�{�]�D�A��B���H�sw�,d��w%�t m��z�����3���Qr����7��(���¿�hC���s%̧�';�;;���O�� ��v��K8���r�Ӆ��n�`^�6����Ȟ=u��m��x��]IkLZ.:�)�� �$�u�Yb�\���K��:���zܥq�T��h�ctqg�&�C�S�����~�`5��C�O�ϐ��EB��؈�kO��F��{=�~�Zfb+��@���:`�X��Y��Y��0�py���5}��3��P$H�_2�a_c������8oA���A8�D�.�Uq�����au��4��R��)u\�m��},�v�w��A#SrY�6:�z��/�E��~�ʖ�C���nE�R�`ww��8���i��{�
U����(�H�٪t���V��b��,�����5���*�����S����]k��{��,B�\�l��P���S͒I���´m<��^U/�e��� �����B��K0�?r���i��^�w��9�t�]�c2p#~�lQ��~)���r��p���NfT�/�����Mo��7v]'�$T�X;�r7l��8�`���A�z����+��`p������3��%���x���GE"@�Y',ٵ�r�]-&�ٵbҟ]�C�t+F�Pg!-���v�X�:?1k6 ��1ﮎi\lt �Oю��a�S�v/5�(7#�l3t�T7�9?��q59a�w��ēo���n�90O�-&!B�rR=@ٞ�1���e2����q>ƫ��=���ly0)C�y.l(ͷ[��霻=O���P�~u�� ,�V�$$5��n;��1#'K�8�xk�#��?oE~��u�OZe��X�Y��ٌ�#E����f��W��"�:���K�2�-1?���3��Nf�Dm�!=�!��F<��a]��RHD9�� %���P0FZC��B1��\��_��������}�l�� �	!��!,0��nv���v�����!���*��Jm�a���CbK�R�T�J�RI�n�,�U6���m�F����F������[��~JK��9^��+�`_=�)m �b ���-���	P�q���7L�rb.�WV����w�n������w(��yxH��P�Lh�.+��E���F�3Eq����: �i%�ba4���>��Gx�`�3�	y�w��Tg�w��f*)�.��מ4ᆃ�c%�F�<�zx53/�z�+`ªy9�5�*�ª��t�.7���|Vt�Y���L�����~�
�\��D�8�� Hʋ��m�{9�p|.:�(l��r�y��E��^�<�R���]���V}	J@3���C����K�f�i�y���/V��X��2�P�Ư؄Ͻ�Ď�����S�eZ�������O�����j �d[FA�G�Y~�OLn�`�H����rF���m��c$�22�0�J�A��qnV� B����J��=N
n}ٯ�A��|
�R�-'�fV+(G��B�Knס�&�߁���WnG�ǳ�����ݽ��f�^`bfj�`���U��-*�<�`���m��ƢK�Q���/��쿅0V)( ��Z[Y��D܍½���g����� ]Æ�L|�����9�-?�٧,1h���l.!��m0u��&5��n�攝���dPEU�d�r��dC���a_gcE�*ׯ��w4~	7-K8S˄�9��ڕ���M�~ɝ쿢
�O'&����Oi3��	?��<��(���M�.���yԷ�~�����*�O� �?[�����F�6�o
]d���ZB��ޖ�o�p�X�;q9ٔ?y���$� �b�$y;D�����:��[Î��L����4���zyzlΑ�`;��]�����t���<��!�hKZ �ߗ��^��]��3 ��&g�Z���$mqcd�fR��u���9�����f�W�F-�|pw����.�E6&��*�\r�����c���Uz=-^d�y��~���yq1�{���+�8öz�u��3[؎������I=�o��e_@Y�i0�=�����I�q��r��0�_Y�DmM٣'D�3EY���5Q�{ʆ��[�����(�E���D�Í(���0���� ��Ӄ�XduT�[�Q+oY���Y02�J�$mW)#��>���F���[�����{ro=���(��	/"�S|�8h�n���1ə4�}���+�����Q����3��Rk0��-Em:lp���2.�A�U���~�iW�?7��ޤ�k:
�g�ݎ�#��D��ᚭ�?,¦p
����':b����N/�6c"��#~bY�y�Rv�lY�x��\�K�t\`bo2����mEY�|⏡V"� ��{�v&<{�,zZ��x?����QNS�4.�s����Bq�Ń+�{��"�7*��.P���`����=K���BU_P[����M:��"�0LI1Wf�U����*� WNWzO�.��
6`�]Wth���0�{D�'r=4?��^�� GQ<����б{D���L�y��G�A�(zB5(����~u���.�ɘ��Ө���΁�B����k���B�W�Fh6�Z�Y�"��������6T[$@���@��ټ��dyz�{�.!��t�bm�0Q
=��?Z<C�"���� ���F:��e|S��3� ����(�C
�2m��ʥ�-H��E1��
GU�8G��8Ѫ��*��z=� ���7�!�B&�l�����A�J�w�;���綘��C�!�g��ٕǪ��@��b�rm��O��� 륆V+�_�@��?0S)eBh%^)�	�vx��9�å���'��tyz��wa�T��kó<��}���m�.��f��=��ڎ45� �J${���D6�g�|u4ϒ�*}��]����-�	������=Ƹ1+�+H�1����	V��[��sC�_�!ʔ@I�<�2$�i��9��B�凴���"=�Í�x^�[~���-.��u��^"��Tl�W`k���d�~ �Y�ս�,�"ј�\��;�`O�>����FՓg�&�uIn� �1\�0��8,���I}\L����]W�\�R�q�J�h�{c��Jn�J�n�p ��� ���$� 6[9���?�j
��ZW
�>��TJ5��п��Wu��[�b6����~6H�F�=�2S�b�z�5Pm���OI)�i)���W*|��Ӂ�ُ�.̙�9K&�a���Ǐ]ނh��.��j�;�c��@%a;�L�L��*K;�ךR\ϣ	NF|;���-3Uy"\&I�{&�Mg<W�}qj��M�d]Z���G9u�Ȑ�_J�;���"�j4|�v��2&N�K�]��(�cw���Ppk��H�.���Ѓ#à����uV���h��h��R�7���Td�h=�_FN�~'d� Ǐ\�S����MQ�{�ߚK��4_#=X�#�	E��WI��>.T����G�PG��Q�9� �N��Eq��iq]u~�/.����!����\'��Z�v;p��/��O��~�P{V�̒�~�:��F5�D�u��p�<���"�QNN[��a����\���s���$Y��a͋�<���u���y��|�t��*��{�,��h)�4\t��l-zF�s����|:�2l�|�KS�k�-P���t��ú��ȏ�}~���z��;q0��J�c�`��ɋ�|*y��S��X8�3/N�I�ryW�{�ϐ�5�!��:]f6G�,>>�x⿟q*Ħ�Q���WE���ٴ��z&��-6#�5�&z���b��g2&x�*� .zx	R�+��v�C�0����Ƥ]Q�iV?}Zߢљ�=��:,Љ����*.f}&��P���}��J�O�I2�4)f��.SϷ�s@�q��?�����(^>gԡFG��=�Ӓ,2=.jqN�ߡ��N��*��vʢ@Q��%*�����,E*;2S�vOE	dѪ��ʨ�;q�YLP�TU0�w�4YN�1��uU�=����/`�1H�bC3���08#���H����w3�F��n���t>Eq�%ݢ�X"���U�f1?�c�b��!?k��!�w��o�<�mƿ��Q?�~w�$	Y��0~����+������'���PN���	�ц���"�:`$i���)��E^���"˙>qs��%�&�Uǃ|a���y�R�F��"���b�mk^�L���\�~k��_���[��u������=M�4�f��v�����sM깊�z�_W�������Ɉ_G.�v7Ǐ�� >i)oB�s�c�`��Z�B���tZ���"�O+y�۰�m�vn�aR�]^>d�����M2��������lP\q_~x�3Jd;�t_�-��EQ�Ahj���4J$��0�S���|�i��ّ����������(5
g7:ȹ��NJ<~CVg��M	Ij�KK�`��yc���M~/���9̂��CEF�*X�UQ����WfW�	�*#�.��M*t��F��̦�E�:��ͺ���<��Q>�� �Yp~��d7z`r/!o�@�~Q������n9�..	z�<���dڟ!ʊ�/�<)W>/�ޤ/���q��i�g��	}���>����&˟Z�B�>X�Y��!�r�y�際�2�`�K[���l�w,����ԭl�Pu�T����>Vw�A���<��2�7���E��8GR'^&R����G���%䡌^;?�M��A�,��W�d�≯�����#^�^���;h��"�s]������C�X��8�yaX�e�oZ[-���pw?Pᷬ%�w�����y}�o��B c%�H>�
yՑ8`�.��‽��s=��t>O/��:��[,�>�X��x��ǯD��u��n����<��}H.p�=tI}�o�����)`a������Ӏ���Y�K?�{S)$�E
Q!+?��C��2�S�*�4��Ex�N�\�Λ8����79\/�i�������4���o�����;�é��t����>srK�Dۤ*K���w�w�6������n�j�3��q����������d����#oқ5~��0�䟛ҧ�4�Sr\�&�E�<BT��+�c��b4��iχxU&$H�N��-��\~H[���b�xׯ�l�������>�ώ�E� }]67b�uz1/&W�=�bD�U-��H܌m�tVm��,򆞲a�B��O�aS�$����yRUM��>���0�y�?����^:ɯwYw���X��Q��y����_���v�ލ�D����L*(����^�M�tpsJ@V�`
C2��R�#�*��O���ʒ|eօf�y2��T���ث��"A��]#5shw��Xz2���������j���?hMS�^�qcB�)n$c��6)w�RM�	t��γIVG��2�ںLW�j�	U	��.h��1�*x$4�-�>��\�Ϙ\�}bl�ZV�Y��gn�sK�:��0��� �E]f�칵���Ge�UI�����w���'ɪ�|&��Y�&y#����ʕ�%�Z`9�ɽ@:��rFV�g>D��K�1���+��I�A�c�aA�a�seXl�߷����=�A��s����"T_��d�Z-ƅ嶀��V��Lo6U���Emr6P��3�ښ��`.5��p���SM �R�����"o����Қ[7�ؕ1}e���1a-�ȇ��V��$Y���l��>_���y��2]ΓI����_v.�Ji,����/-���U6s7��7L�/�����Vڛ�0�t�w/r<�9NRz��8|z�ȭPY��Jt���B����K��-�sp#�AGy�.�8yfC,�qM��PEU�2bK�%�ַ�n��I&x���
0������=�9�-�
 [��C���Z��X����^A#�S���Ģ*k<BM*x�\�K^�su��JV�4���KNhmEqU��]�Q�5eu��	V�I���)�i#^���'�n4t<N#�o�����mt���i�l5�3*~\����vkp�j0x�j����AP�d�y�vW�k	#j��<��(��A.��n�%�	Sc R�ݟ�x$⋋H��*�T�	��(6U�ؓ�T� "_�[��ý]�2[0����r���MW�������6���%T�y¾����`ﱯi=�M�Ͱ��I�|�Q���km'x�ԁ�8��E	a���7T��E�����C���#a��'��~�e�ÿ8���=>k���~��2��؁x���Ew��|��n��Fh�Ɓ�w�m�A[<���D��%��D]�Y��8�*�L�v-)f4������,��G����VL��8�=5I�����(ϓtY1\�\I=�g��i3ճͿj$Y%�FC2'%`�V|�M/�OYQv�����'&��R�
�am�F��eZ�7�r�k��ơ)�.��7H9����XqPz�����S=ߥ�hj�E��OvV�I	�0����]��V�Y�Nl�U3~�+"����ukW�M��uO
�h`Ϙ�Y}N�./T��eT	�l���r�����ʆ|'�� ��?[[g\m�.����;�t0�{l.���� l������k�wR/���u=n[	
P(�T��~%��Y��.�W���|��