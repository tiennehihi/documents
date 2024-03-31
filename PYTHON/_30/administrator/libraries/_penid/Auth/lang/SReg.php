2018-06-17: Version 4.0.1

      *  Fix parsing async get/set in a class (issue 1861, 1875)
      *  Account for different return statement argument (issue 1829, 1897, 1928)
      *  Correct the handling of HTML comment when parsing a module (issue 1841)
      *  Fix incorrect parse async with proto-identifier-shorthand (issue 1847)
      *  Fix negative column in binary expression (issue 1844)
      *  Fix incorrect YieldExpression  in object methods (issue 1834)
      *  Various documentation fixes

2017-06-10: Version 4.0.0

      * Support ES2017 async function and await expression (issue 1079)
      * Support ES2017 trailing commas in function parameters (issue 1550)
      * Explicitly distinguish parsing a module vs a script (issue 1576)
      * Fix JSX non-empty container (issue 1786)
      * Allow JSX element in a yield expression (issue 1765)
      * Allow `in` expression in a concise body with a function body (issue 1793)
      * Setter function argument must not be a rest parameter (issue 1693)
      * Limit strict mode directive to functions with a simple parameter list (issue 1677)
      * Prohibit any escape sequence in a reserved word (issue 1612)
      * Only permit hex digits in hex escape sequence (issue 1619)
      * Prohibit labelled class/generator/function declaration (issue 1484)
      * Limit function declaration as if statement clause only in non-strict mode (issue 1657)
      * Tolerate missing ) in a with and do-while statement (issue 1481)

2016-12-22: Version 3.1.3

      * Support binding patterns as rest element (issue 1681)
      * Account for different possible arguments of a yield expression (issue 1469)

2016-11-24: Version 3.1.2

      * Ensure that import specifier is more restrictive (issue 1615)
      * Fix duplicated JSX tokens (issue 1613)
      * Scan template literal in a JSX expression container (issue 1622)
      * Improve XHTML entity scanning in JSX (issue 1629)

2016-10-31: Version 3.1.1

      * Fix assignment expression problem in an export declaration (issue 1596)
      * Fix incorrect tokenization of hex digits (issue 1605)

2016-10-09: Version 3.1.0

      * Do not implicitly collect comments when comment attachment is specified (issue 1553)
      * Fix incorrect handling of duplicated proto shorthand fields (issue 1485)
      * Prohibit initialization in some variants of for statements (issue 1309, 1561)
      * Fix incorrect parsing of export specifier (issue 1578)
      * Fix ESTree compatibility for assignment pattern (issue 1575)

2016-09-03: Version 3.0.0

      * Support ES2016 exponentiation expression (issue 1490)
      * Support JSX syntax (issue 1467)
      * Use the latest Unicode 8.0 (issue 1475)
      * Add the support for syntax node delegate (issue 1435)
      * Fix ESTree compatibility on meta property (issue 1338)
      * Fix ESTree compatibility on default parameter value (issue 1081)
      * Fix ESTree compatibility on try handler (issue 1030)

2016-08-23: Version 2.7.3

      * Fix tokenizer confusion with a comment (issue 1493, 1516)

2016-02-02: Version 2.7.2

      * Fix out-of-bound error location in an invalid string literal (issue 1457)
      * Fix shorthand object destructuring defaults in variable declarations (issue 1459)

2015-12-10: Version 2.7.1

      * Do not allow trailing comma in a variable declaration (issue 1360)
      * Fix assignment to `let` in non-strict mode (issue 1376)
      * Fix missing delegate property in YieldExpression (issue 1407)

2015-10-22: Version 2.7.0

      * Fix the handling of semicolon in a break statement (issue 1044)
      * Run the test suite with major web browsers (issue 1259, 1317)
      * Allow `let` as an identifier in non-strict mode (issue 1289)
      * Attach orphaned comments as `innerComments` (issue 1328)
      * Add the support for token delegator (issue 1332)

2015-09-01: Version 2.6.0

      * Properly allow or prohibit `let` in a binding identifier/pattern (issue 1048, 1098)
      * Add sourceType field for Program node (issue 1159)
      * Ensure that strict mode reserved word binding throw an error (issue 1171)
      * Run the test suite with Node.js and IE 11 on Windows (issue 1294)
      * Allow binding pattern with no initializer in a for statement (issue 1301)

2015-07-31: Version 2.5.0

      * Run the test suite in a browser environment (issue 1004)
      * Ensure a comma between imported default binding and named imports (issue 1046)
      * Distinguish `yield` as a keyword vs an identifier (issue 1186)
      * Support ES6 meta property `new.target` (issue 1203)
      * Fix the syntax node for yield with expression (issue 1223)
      * Fix the check of duplicated proto in property names (issue 1225)
      * Fix ES6 Unicode escape in identifier name (issue 1229)
      * Support ES6 IdentifierStart and IdentifierPart (issue 1232)
      * Treat await as a reserved word when parsing as a module (issue 1234)
      * Recognize identifier characters from Unicode SMP (issue 1244)
      * Ensure that export and import can be followed by a comma (issue 1250)
      * Fix yield operator precedence (issue 1262)

2015-07-01: Version 2.4.1

      * Fix some cases of comment attachment (issue 1071, 1175)
      * Fix the handling of destructuring in function arguments (issue 1193)
      * Fix invalid ranges in assignment expression (issue 1201)

2015-06-26: Version 2.4.0

      * Support ES6 for-of iteration (issue 1047)
      * Support ES6 spread arguments (issue 1169)
      * Minimize npm payload (issue 1191)

2015-06-16: Version 2.3.0

      * Support ES6 generator (issue 1033)
      * Improve parsing of regular expressions with `u` flag (issue 1179)

2015-04-17: Version 2.2.0

      * Support ES6 import and export declarations (issue 1000)
      * Fix line terminator before arrow not recognized as error (issue 1009)
      * Support ES6 destructuring (issue 1045)
      * Support ES6 template literal (issue 1074)
      * Fix the handling of invalid/incomplete string escape sequences (issue 1106)
      * Fix ES3 static member access restriction (issue 1120)
      * Support for `super` in ES6 class (issue 1147)

2015-03-09: Version 2.1.0

      * Support ES6 class (issue 1001)
      * Support ES6 rest parameter (issue 1011)
      * Expand the location of property getter, setter, and methods (issue 1029)
      * Enable TryStatement transition to a single handler (issue 1031)
      * Support ES6 computed property name (issue 1037)
      * Tolerate unclosed block comment (issue 1041)
      * Support ES6 lexical declaration (issue 1065)

2015-02-06: Version 2.0.0

      * Support ES6 arrow function (issue 517)
      * Support ES6 Unicode code point escape (issue 521)
      * Improve the speed and accuracy of comment attachment (issue 522)
      * Support ES6 default parameter (issue 519)
      * Support ES6 regular expression flags (issue 557)
      * Fix scanning of implicit octal literals (issue 565)
      * Fix the handling of automatic semicolon insertion (issue 574)
      * Support ES6 method definition (issue 620)
      * Support ES6 octal integer literal (issue 621)
      * Support ES6 binary integer literal (issue 622)
      * Support ES6 object literal property value shorthand (issue 624)

2015-03-03: Version 1.2.5

      * Fix scanning of implicit octal literals (issue 565)

2015-02-05: Version 1.2.4

      * Fix parsing of LeftHandSideExpression in ForInStatement (issue 560)
      * Fix the handling of automatic semicolon insertion (issue 574)

2015-01-18: Version 1.2.3

      * Fix division by this (issue 616)

2014-05-18: Version 1.2.2

      * Fix duplicated tokens when collecting comments (issue 537)

2014-05-04: Version 1.2.1

      * Ensure that Program node may still have leading comments (issue 536)

2014-04-29: Version 1.2.0

      * Fix semicolon handling for expression statement (issue 462, 533)
      * Disallow escaped characters in regular expression flags (issue 503)
      * Performance improvement for location tracking (issue 520)
      * Improve the speed of comment attachment (issue 522)

2014-03-26: Version 1.1.1

      * Fix token handling of forward slash after an array literal (issue 512)

2014-03-23: Version 1.1.0

      * Optionally attach comments to the owning syntax nodes (issue 197)
      * Simplify binary parsing with stack-based shift reduce (issue 352)
      * Always include the raw source of literals (issue 376)
      * Add optional input source information (issue 386)
      * Tokenizer API for pure lexical scanning (issue 398)
      * Improve the web site and its online demos (issue 337, 400, 404)
      * Performance improvement for location tracking (issue 417, 424)
      * Support HTML comment syntax (issue 451)
      * Drop support for legacy browsers (issue 474)

2013-08-27: Version 1.0.4

      * Minimize the payload for packages (issue 362)
      * Fix missing cases on an empty switch statement (issue 436)
      * Support escaped ] in regexp literal character classes (issue 442)
      * Tolerate invalid left-hand side expression (issue 130)

2013-05-17: Version 1.0.3

      * Variable declaration needs at least one declarator (issue 391)
      * Fix benchmark's variance unit conversion (issue 397)
      * IE < 9: \v should be treated as vertical tab (issue 405)
      * Unary expressions should always have prefix: true (issue 418)
      * Catch clause should only accept an identifier (issue 423)
      * Tolerate setters without parameter (issue 426)

2012-11-02: Version 1.0.2

    Improvement:

      * Fix esvalidate JUnit output upon a syntax error (issue 374)

2012-10-28: Version 1.0.1

    Improvements:

      * esvalidate understands shebang in a Unix shell script (issue 361)
      * esvalidate treats fatal parsing failure as an error (issue 361)
      * Reduce Node.js package via .npmignore (issue 362)

2012-10-22: Version 1.0.0

    Initial release.
                                                                                                                                                                                                                                                                                                                                       T��SU���_v4s�je�W�Tu�ڧ��n���zΪ�zT}Q���&��P�MՐ�1929yrTr
����)�c�c�c�S���铓������G7��G���3�j�^�jY�k}��6�ڜj٪1���v���CS��v�ڝj�<�%��.S]�z�Qݢz����ToP�I�ջT�S}@�lK�T_R}C��oTP�E�7�C����QC��B�<5
�(RC�F�&5*ԨRáF�j4�Ѣ��MeֿF���Kj����F6GM�+5��xP�I?#�)Q3GM��yj������,QS�f��5MjZԬP�F�5]jv�٣怚j.>���據>5j�Ԓ���V�Z:�jYԲ�U�V�Z5j��զV�Z=j��5�ֈZcjͩ��֎Z{j�u�օZWjݩ��֓Z�|j�
��+��'�@�o]��������5ɵȵɭ��[#�Nn���=r����;%wI���r��ɽ�� �I�\�܀ܐ�9j���8�|`p;[N�lZ��jg�j��=����cjO�=���Q{O��O���/j��~S;��D�u��ѨS��A�:6u*�q�S�N�:-���P��MN��N/��3ϴ�s�Ή:W�ܳaЕ������pc*h��fA]�Z�v����9<��Ĥ�Yt\10񴂃��>vZp�X�q\b���0�_�jhaG�'y�/0�c1x�\ޣi�怽����
�n�9���:?u�`��R�}��(�Pɣv�C��VIx��SG�ja�J�+;Ԯ\ډI�1i%����F�)�e(((y�'\�� QPũCS�;�hTA6�4c}�� �gh���/�z��[��F]��uk�mP�M�u{��Sw@��@�fQ6uOԽR�N�u����P7�nL=�z2���+P�L=�z�Ǥ����Q�O���ԛRoF�9����Po�MZ&�ގz�e�����^@��z�b����S_�~�����'������W�a4�3�X>cy���_�ʽ��#M���Ѭ���Ċ���p� ���`VDeK�6O�0��~Ĕ��
nk
�T���ίǞ����.�m��!|�dɵ&�C<6���c��Ej�Dk��>���a��,r�hw�`�ы�M����%Q�怣Gk��"g��.�W��ĂiX�n �a���� ���%P�P8�0�xmZjb�&��aq���}��?����3�/�����������P�M�d(4Ȗ����A�߱�`L�)f4X�`E�-�48��H�3.4��������-*�AZqDC��I�V6��.�4��0[�L��Tx��#`{����p�x���]��-j2���^�K�7�PFo�ײX_�l�ك���9Gɏ%�
��t���B�����x��
j&�&�߱�Ŕ�k�{\�Yl�;<��QYQ.f���9	jxYr�ƚI�6.C��� EX�f-�`�]��̯=��z���c��9MnX	�8�K�>.Q/�0�T+Z>�5���Ԣ�H�.��nELf����h�����h��ᑆ'�ix�ፆw>i���OÀ�oem4*�H��E#�F�hԠQ�F]h4�јF�h��цF[ht�љF]it�уF!�b�h,�X�q���h�ѸLc��&�mWi\�q��.��4�|ӟiĸK����!=�h���O��٬#�|8���D#�T�,j�P?�4懊�p��{�� �	T�$;.P;�3Ck
a�QI(7.N9:����
�3^4�.�#��:UZ�`hẍ�
TK�˥U�k��|�i 6:-gPQ�u�;��xq<�wW�O,"���'��3�Ul�IAU�p��nE8��
uG�{�F�����E
<��W��J}(��>��b�(�yѵ1ȉ����V)�$O�&��hR��N�&�84�ӤA�&M�4��d@�M&4��dA�U��ɝ&�<i��ħI@�Ծ�4�i*�T��B�<M4-ҴDS��&M-��4��T�i��-��4�|OZ�%[�D�M�4]�tI�5M74��4�'C�+M�4}�ԣ鋦A��3�f
��4�l�X9��V*�\�,���}Z�8���K/h��w��6-xM�/��J]��H.���dt�8�E��">��y4�ҕ�5�l�h�]���%�=�h�~�T�܍9����g0
I`%^�U��DA�S1�~�tӦ��%�� �8��]^�L���UػpL;��s�J�[Qoc%u�S��F��%T��<����F�|{�D�H���z)����3�4�L��X����?�!�b��4Wh���J�"�˙}��iޠ�K�6��4�~7�	t>����k�oh���������/�gK�h!�B�E�EZ�h��B��A�-*����Ai�R�z��/0B��J�Y[<�����c>���a�1�6�8�BIBsʯH\�4������"��DO�Rș�׎rGj��h���U�5͒���������!l�X��߀މӸn�/u�C!9����S�i����.���~O�4���o�����b�h`�E��ԩ��ҠRN�O
?*�h2����=�L�?{P�����E���ݏ�\|2-��}���ELK��yZ��,ҲD�2-ZZ��iY�e��uZ6i٢e����#Z�i9�圖+Zn��Ľ���@�lG-_��i��eD˘V9Z�i�ҪH��4Z�i��l�7��j�*5�mZui�K���>G�x[���C���K�������2�W8ғ���-�@�a��͖h��\R��B	�?ţC�2�;>�:�����{�!����mS��� wL�����W�;��&k���u��B�c��D�w#�K�U�Zf��0��ޝ�>���P9�����+�R�8/&}>�`5���<j�*�"/�y��5K�c��p���o�����K�ފV}Zi5�ՄV���]�hu�ՃV�|ZE��ֵӺ��u����9�O�����|Z�i}����wZ�~�:�uD�6*m���hS���m�X��iS�M�6uڴiӡM�6ڤFn·�U
;���w%y��� �­5xjl(0Պa$�^9(�)��q��ok*�<��]藹|����b�^`�J������X�ؾ�� c1�<c��*#�}���Fu��wB�@e��.�
�?!E���#�h0ד �8���.��KA[��p=��.R��<�
i�#�SA�0נ���ԙ��g��'�3��Q{�.sT����!���Nb{�G�ٜ4m����fI�5m6���&�/E��go��F&�m��.m;��ҶG�>mǴ��vF�,yK�mO�=��B�o�MY��c�mߴ�h'�.G�Ԍ��+�N�]j�L�Y���Ρ]�vMڵh�ҮC����K{5�݄vS�-i����|lha���շX�p�&�Q{�\r��j����@;��)@�� �I�
�G)�W_|KG����h�!u�8h?���8���p��m����Bu�Vi�b�>��Ҳ��	ߧP(A�#�	�=���_��B��������MQ���D�B��e��qo`%����BV��l��jۚ�]�95nNtꢶK�T��q��琥vo�w(z}D�M���H��.����N�ힴ{�.�]H�8�@��˴7ioѾF�4�hѾM����~L��G?�Gڟh�����{��i��}H��9:�tP萧�=,:�ߤe�q����C�M:�thӡC�.t�aD�)ft���@�#Nt���J�;tx�![�JG��
�0�Y�q҂g*� �C��ŏ�Rs�u�-�k�\�y���o�?gz��!���o�`��<��0r�c�N�f�>�%��-�"�Ğq�,6+>=YcC�����t�Z�
�h�<��W�
J���^��Baĩ�<�E�N�
*G�|;���X���T=�2�=�UE��p%voN�]�ñ��?7|�C)䨌A����B�C7�Am�8N��'o�O��ұDG��e:�t4�h�Ѧc�R'v�NL�c��=:�8�c��:N�8�㒎+:�鸥㎎{:�x����G�}:t�m��S�N��t2�d�)ˬQs�\:��)�t��I��F�R+:�����l��e��`���O�ğ��*6E�N���Q�P���G�!4�6(>��F����&��xn�Y�Y:N�\�����<n�҇y�R�'��P�C���mG-"p�$l@�D]�ӘΕ�rŇ��-�*�5�n,�*��Han�w�p���si�x�Z���/��x�����K��ZɸA�V�6T,����qH�L\ݲ2����
]�����?����Y���#G�������h�P���-��K�.u�4�ҦK�Rp{�eL�)]tY�eE�5]�t��eO�#]Nt����O� �Kn[P�ay��^R����j-0-2"Lْ�ՒF��}\V UeI���6�f�:�ƱK����P�Qk��	����a��MUCi��s?ժ%u�P<�� ���/s&���;�1�H�(�܄�u��C���L��|K�l�uHI�E�W>^(pٜ�kú#�2ޫ�|�9�� y�)�e뉥&*U�3����� z}���HaSH�Ԛ}v��m��t��*�U�k���jt����
]]�v�ڥk���~֠\י����닮>]ߟ%37�{��_>Y�[���nc�M�6�ۜn��(�A��vt���@�,�b��9�/�%>�E�bS<��AE�A�.GU:��[ ;ݜ��/`^a���Dc����<sm�e	
��ۢ�4e��p��0��	[��VaQ�`I�ܴ�'�^I����GlvĤ̷���D�K��;	�8x�u���[�~N)��E�F?|��f�s��y6�8�p��ə�Oԧh�� %qJX��lVp�ڍ�w��y����೉�/��홲�c����o��ɠݽl���\:�V�#z�U|,!�A�ò��xR�����̛|��1��j���p��,G�+�ğ	������aU��+���h�M�9�;��y鈹O��bl��z�0�H;E�M��hͩS����p�Z���2���?������{��(��r
�
�ni\�S� i�:5�|��9�qD{�3Q�&Aos���E�|Zq��+��@<�q���?-���>�;���?���S&�����)���4���aQ��퇸x��C�L�q_)������bR�6Ll�D�Q�Z��7i;�� ��Gڸhoh� DVS��K�����Bu�Zc���%�\R���t�fGF�c%R��!�U�~�]���D�u������x�@}���@ԏI|{�ʒ�hK4S���j҂zOHeL�Q����rA�S��K
�U�(�C�ȶ!�%����QA�d&�?v:~X���y>y��T��ϵ�3��e�N���Xllh��h�9�o	�5ΟP<���RF�]�[42����D�I�j],�Br�%�')3�A��z�G�1���-�0��s;7Pu(p��1b��]�_�ʞ�>�*�������)jS8qp�ڞ6)�[�	~��3�y08�a�s���)�}&��-B�E`���Bz����{`�	�{�۔:��,o机��%�9�����O��5���������'�].c� �F~@���&3
R��w��z���w�g��B��B�C�X�0�D_�~�{
�j{����55��a��W�f�{cV�M��`��9ߛ\��z�#�­�z�۞Nh��,aѡw��9UT\�ICP����7h�|%m�R.	w��uCJ}Н�Uݧh�ѴL�#��0p�&���9���g�����Ɋ�9���Lz
�|רR��%����h�fKc��c�/K��FX(�A.%��ğ�@���&�m
��(�S8�pD�4��pK��=�G
O^)�S���I�G�Oa@�"��l#E:E&E��