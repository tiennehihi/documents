// ** I18N

// Calendar EN language
// Author: Mihai Bazon, <mihai_bazon@yahoo.com>
// Encoding: any
// Distributed under the same terms as the calendar itself.

// For translators: please use UTF-8 if possible.  We strongly believe that
// Unicode is the answer to a real internationalized world.  Also please
// include your contact information in the header, as can be seen above.

// full day names
Calendar._DN = new Array
("Sunday",
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday",
 "Saturday",
 "Sunday");

// Please note that the following array of short day names (and the same goes
// for short month names, _SMN) isn't absolutely necessary.  We give it here
// for exemplification on how one can customize the short day names, but if
// they are simply the first N letters of the full name you can simply say:
//
//   Calendar._SDN_len = N; // short day name length
//   Calendar._SMN_len = N; // short month name length
//
// If N = 3 then this is not needed either since we assume a value of 3 if not
// present, to be compatible with translation files that were written before
// this feature.

// short day names
Calendar._SDN = new Array
("Sun",
 "Mon",
 "Tue",
 "Wed",
 "Thu",
 "Fri",
 "Sat",
 "Sun");

// First day of the week. "0" means display Sunday first, "1" means display
// Monday first, etc.
Calendar._FD = 0;

// full month names
Calendar._MN = new Array
("January",
 "February",
 "March",
 "April",
 "May",
 "June",
 "July",
 "August",
 "September",
 "October",
 "November",
 "December");

// short month names
Calendar._SMN = new Array
("Jan",
 "Feb",
 "Mar",
 "Apr",
 "May",
 "Jun",
 "Jul",
 "Aug",
 "Sep",
 "Oct",
 "Nov",
 "Dec");

// tooltips
Calendar._TT = {};
Calendar._TT["INFO"] = "About the calendar";

Calendar._TT["ABOUT"] =
"DHTML Date/Time Selector\n" +
"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n" + // don't translate this this ;-)
"For latest version visit: http://www.dynarch.com/projects/calendar/\n" +
"Distributed under GNU LGPL.  See http://gnu.org/licenses/lgpl.html for details." +
"\n\n" +
"Date selection:\n" +
"- Use the \xab, \xbb buttons to select year\n" +
"- Use the " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " buttons to select month\n" +
"- Hold mouse button on any of the above buttons for faster selection.";
Calendar._TT["ABOUT_TIME"] = "\n\n" +
"Time selection:\n" +
"- Click on any of the time parts to increase it\n" +
"- or Shift-click to decrease it\n" +
"- or click and drag for faster selection.";

Calendar._TT["PREV_YEAR"] = "Prev. year (hold for menu)";
Calendar._TT["PREV_MONTH"] = "Prev. month (hold for menu)";
Calendar._TT["GO_TODAY"] = "Go Today";
Calendar._TT["NEXT_MONTH"] = "Next month (hold for menu)";
Calendar._TT["NEXT_YEAR"] = "Next year (hold for menu)";
Calendar._TT["SEL_DATE"] = "Select date";
Calendar._TT["DRAG_TO_MOVE"] = "Drag to move";
Calendar._TT["PART_TODAY"] = "(Today)";

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Calendar._TT["DAY_FIRST"] = "Display %s first";

// This may be locale-dependent.  It specifies the week-end days, as an array
// of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Calendar._TT["WEEKEND"] = "0,6";

Calendar._TT["CLOSE"] = "Close";
Calendar._TT["TODAY"] = "Today";
Calendar._TT["TIME_PART"] = "(Shift-)Click or drag to change value";

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "%Y-%m-%d";
Calendar._TT["TT_DATE_FORMAT"] = "%a, %b %e";

Calendar._TT["WK"] = "wk";
Calendar._TT["TIME"] = "Time:";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 �0N=�*�8W)	5(k5�&q7w(�2),�,�)�*�&Z."+�0j0�-�+�*�$v)��h
���/
v��	��K	�� 9�}�m����d��	���$/�Cu�OQJ[�%ig�0Nt�>7x�Jw�O�z{U1~�ZX}l[xyV�zX={�\e|9[W|(T�}�QKwvK*m6>c�4�]�1sX�/�J�$�AR�>��:�J8�q5qK-K
.
!0a0��.'�+5	�.M�3B�6��6�q2��/�
�-T�%v#��%�����H���������������}����7�W��؇�f���v�������U�^��ʃε�;�l��dŏ�U���L�>����T˓ϫ�O֮�]��#ڐ�hڐӥ���:߈�����g�T���S��[�,���lՙ�Ԗ������цٜнܻ��ܪ�����u���?�?߄�����lځ��8���+�ׂ� ���������E��,�����[���g�%܅������5�����h��ٶ���c�������������������~����@������D����f�?��_�����t�p�4���y���s��
����@S����,����!��x#��tr�����$��2'	�3  %*`�&��-�
5#5l�6��8��:.�5104�3:�F<��7:S,?N>�u:��:�=�>�:C:7m�<�@##=��?1:B�x@D�=9;�>@&�@$C=��8w 6� 9DA8��0��*��,�/0Z&����H�$�|! peL|���?����������f�N���������>���@��ν����ڋ��6!�r%M�-��E8-�A��M�V�#�b�.nfk0�aG,n_,�\�&JW�BT�`W�b[�V+M�4Bs;4g�+�]&`��^١�.���|�]t�����/�ù�ĺ��g������?��q�5�"�������b�����f�?�	����p��W�Q�,���ѷdװ���	��r��֋�_�w���x�V�ì۸����w���S���L��Z���	���h���i�#���ϯB�̰��ƴ쪾��?�ӫ����y�°�S�B�s�zĪ�ѿ���r�S���(�]�N���G�a�Ͷظ���m���W�R୶�����������i�Ѳj聲���3䥪��βo�g���]���|�H�G��3�f�v�&���캵�����^�|���¸��D�����t���)���9�/f�'���X�������� e�"J�'�0���6��������R9�QT��k��W����[	�$	�"	X$P�)��*e�)��+ /��1��2$%�6�.�7-+�4u)>6Z.�:K2%?4~@U91C�?�G�A�G�>C�<�@�A�D�FHG�JI�I�F�G�E�D�E_F5HH�K�B�K�@�M�B9L�GsK�F�LC	Lb@,I]B,I�@ KW:�J�:ZK�=�J$=�G�<�E<�D�:(D�8�?h9�;u:M;.;�<�<�:}>�6�;62^952�B�5*K6]HR4�CI4iC_3�E�2�Dp2�@�/jB�.�BD,PC�+�@�(;l$O7�!-26"%R��0�EU	�������$�H+� �1�(�@�5NSRA�\iH�`�Mic�Ph�P|h�J�hcKRg&OEe�H�fL?Uc;;�_�;�[�4Q]-�\g*�R�%nCh�67b.]�)� K��b��&�.����۷�L	H�����������U ������-�����z���|�T�������Z��&����ͪ�%ȼ��h��$�H�(䩺R�1����ܿ��������N�Ө�����k�EǼ�%�+�3�	��c��� �2����m���4�����˻묜�����ĺ����y�ޱ�������!�$�=�i�g�������Y�P���C�����I�7�Κ��q�0�\�M����F�s�s���Д��f�Z�T��ʔ��a��ő��?��ʗ���a��ʶ�/˞�_�����\���w��ǥ��
�tگ�Aޓ�L䔣G㜦��5����C���k�����e�D���3�ջ5 -��:�w
��o7Ɉ���E��ϳ(�b�ڨJ�)
߇��c����������h�X��^IT Y� �R
#��$�-$ -!)f"��&��&�'�&�j%M�$B�#;-$e�$�s'x �(��%( �#��#L�$�[#*$��&=�"$!&�$X)f	,�3/�&4�y6-4�6��@��A=�E@T]F��E��C�5I;�L5�H�BE�pF�QI�Ff�E�~JKSkHd�G�<Hm�C��>��5�
%,k�&�^!�/n�6��x\����-��m�fP�So���j,�	�6i�=F�A1�Ia&�Q.W5]_@?E_�>h_=2c&@�dB0_~=OS]4lN�1�L'/=F�)�6�-�=(��I=��X	,�1��V�������J�k�^�(���Y��2��F��w�w�Z��b��f���E�8�4���k����F�P�Q�G������T���`���}�������S�i�Q������+��6������=�Vݸ��\��ց�)�Bا��p׸݌�3����F�3���v���q�zβ���P�R������x�7�&�}���N��\�u���v�7�E�C������$��ѧ����Ҭ��ԍ��n��O�w�?�%���Ѐ��ؿ�j��d������l�u��ι��؝��� �S���ز�/�Z���\ 
�4s���zD��