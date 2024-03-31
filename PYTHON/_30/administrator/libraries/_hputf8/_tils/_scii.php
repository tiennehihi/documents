v3.0.0 - November 9, 2018

* 0b5a8c7 Breaking: drop support for Node < 6 (#223) (Kai Cataldo)
* a05e9f2 Upgrade: eslint-release@1.0.0 (#220) (Teddy Katz)
* 36ed027 Chore: upgrade coveralls to ^3.0.1 (#213) (Teddy Katz)
* 8667e34 Upgrade: eslint-release@^0.11.1 (#210) (Kevin Partington)

v2.1.0 - January 6, 2018

* 827f314 Update: support node ranges (fixes #89) (#190) (Teddy Katz)

v2.0.2 - November 25, 2017

* 5049ee3 Fix: Remove redundant LICENSE/README names from files (#203) (Kevin Partington)

v2.0.1 - November 10, 2017

* 009f33d Fix: Making sure union type stringification respects compact flag (#199) (Mitermayer Reis)
* 19da935 Use native String.prototype.trim instead of a custom implementation. (#201) (Rouven Weßling)
* e3a011b chore: add mocha.opts to restore custom mocha config (Jason Kurian)
* d888200 chore: adds nyc and a newer version of mocha to accurately report coverage (Jason Kurian)
* 6b210a8 fix: support type expression for @this tag (fixes #181) (#182) (Frédéric Junod)
* 1c4a4c7 fix: Allow array indexes in names (#193) (Tom MacWright)
* 9aed54d Fix incorrect behavior when arrow functions are used as default values (#189) (Gaurab Paul)
* 9efb6ca Upgrade: Use Array.isArray instead of isarray package (#195) (medanat)

v2.0.0 - November 15, 2016

* 7d7c5f1 Breaking: Re-license to Apache 2 (fixes #176) (#178) (Nicholas C. Zakas)
* 5496132 Docs: Update license copyright (Nicholas C. Zakas)

v1.5.0 - October 13, 2016

* e33c6bb Update: Add support for BooleanLiteralType (#173) (Erik Arvidsson)

v1.4.0 - September 13, 2016

* d7426e5 Update: add ability to parse optional properties in typedefs (refs #5) (#174) (ikokostya)

v1.3.0 - August 22, 2016

* 12c7ad9 Update: Add support for numeric and string literal types (fixes #156) (#172) (Andrew Walter)

v1.2.3 - August 16, 2016

* b96a884 Build: Add CI release script (Nicholas C. Zakas)
* 8d9b3c7 Upgrade: Upgrade esutils to v2.0.2 (fixes #170) (#171) (Emeegeemee)

v1.2.2 - May 19, 2016

* ebe0b08 Fix: Support case insensitive tags (fixes #163) (#164) (alberto)
* 8e6d81e Chore: Remove copyright and license from headers (Nicholas C. Zakas)
* 79035c6 Chore: Include jQuery Foundation copyright (Nicholas C. Zakas)
* 06910a7 Fix: Preserve whitespace in default param string values (fixes #157) (Kai Cataldo)

v1.2.1 - March 29, 2016

* 1f54014 Fix: allow hyphens in names (fixes #116) (Kai Cataldo)
* bbee469 Docs: Add issue template (Nicholas C. Zakas)

v1.2.0 - February 19, 2016

* 18136c5 Build: Cleanup build system (Nicholas C. Zakas)
* b082f85 Update: Add support for slash in namepaths (fixes #100) (Ryan Duffy)
* def53a2 Docs: Fix typo in option lineNumbers (Daniel Tschinder)
* e2cbbc5 Update: Bump isarray to v1.0.0 (Shinnosuke Watanabe)
* ae07aa8 Fix: Allow whitespace in optional param with default value (fixes #141) (chris)

v1.1.0 - January 6, 2016

* Build: Switch to Makefile.js (Nicholas C. Zakas)
* New: support name expression for @this tag (fixes #143) (Tim Schaub)
* Build: Update ESLint settings (Nicholas C. Zakas)

v1.0.0 - December 21, 2015

* New: parse caption tags in examples into separate property. (fixes #131) (Tom MacWright)

v0.7.2 - November 27, 2015

* Fix: Line numbers for some tags (fixes #138) Fixing issue where input was not consumed via advance() but was skipped when parsing tags resulting in sometimes incorrect reported lineNumber. (TEHEK)
* Build: Add missing linefix package (Nicholas C. Zakas)

v0.7.1 - November 13, 2015

* Update: Begin switch to Makefile.js (Nicholas C. Zakas)
* Fix: permit return tag without type (fixes #136) (Tom MacWright)
* Fix: package.json homepage field (Bogdan Chadkin)
* Fix: Parse array default syntax. Fixes #133 (Tom MacWright)
* Fix: Last tag always has \n in the description (fixes #87) (Burak Yigit Kaya)
* Docs: Add changelog (Nicholas C. Zakas)

v0.7.0 - September 21, 2015

* Docs: Update README with new info (fixes #127) (Nicholas C. Zakas)
* Fix: Parsing fix for param with arrays and properties (fixes #111) (Gyandeep Singh)
* Build: Add travis build (fixes #123) (Gyandeep Singh)
* Fix: Parsing of parameter name without a type (fixes #120) (Gyandeep Singh)
* New: added preserveWhitespace option (Aleks Totic)
* New: Add "files" entry to only deploy select files (Rob Loach)
* New: Add support and tests for typedefs. Refs #5 (Tom MacWright)
                                                                                                                                                                                                                                                                                   p�y
�u}D�-n%�� ������1���:�F�l���ž�o"��%PK4�I��`m:��x��ʽJ��t�Hx��^�c�ق~�T5���IO�}��+~Y̿&������ݣ�����A����������Ѡ�9��#��Y�ccY�kAO����7�Gg��Oݜ�Y_����@#����o�'�ʮl'�$�"9(� i���9�V�-��xcMt���KV�=�I���5t�@��B��9<�nX`�]��yQ�D!��n�ˉ��.� ۉ�7�])�Y�D;�H���w@��+Ë�"-R�.�/�B���K�|Fg:�m�����	1�JP�%�C\�	qi�<������o���˝�2p_h�=+>��ؾ����"��黠�;�u�Gn���V�G�jE%��N�M2��u ��{��M����{���M� �Փqr5������N���(��2�=���㛑!9��5�9�ov�#F�7�Q�u���(�R *�d������.�z��/7��F6&G��kJ!��ڢ�q¬�8W\�h�Su�!'�y/���$���Wfz����"B��r��+��4ёr,@���~N^߱�~˅#�|W�7��?)����^���U�j:�-�^�H����w�������i�25��e����!��t݋�o&%�����7�*���f�s���]/1�Qp��:�0���h��	LNBx�L�}�3<{���j�mv����IK]c�1��8L�j�'<#Dd�\���u�}� k�-v@y p�J�N��m0'�(g����'��#��jN���!{5�ӛTL�XR�\�yv9�G]I�\����m"�E=�,�kr"{ÓB:����m�V/^�PK��z�5�iW����|�8���ȫ&+���Qx[:T0��"9E�ذ���J�c�g���x[G
���8a��3���p��5�8�X�J�>_r��~/w6�bA���O4B����B�;x4�%�[�������2T�X|�n���*:H�i�ȣ����[+I�����U�/ƮjP��-��)5X��l�dx"�`t3\��O:�:6D�h��O��x�������a������"!/$�i��S�=���d��C���.#{�Xm�����.lt�9y�Q���?�����Ėk3��
yNB�j5�b��h��d��q��loT��,7�����LG���Ӝ����Ǹ�(Y�&#65��%�@<��f��]�Ϣ�ˣH}w��)&�v�1�w�yÐׁy?<l�&6u]/l��K��0���sö>�էS)�!E�I��n�襅KU��N磯n�x����2|4ɔZ�&Y��gb�Rבi7�A��Yv���@���V5��38�3�~�9����(A��`�wB��m����	2�vx9Y�X�y�O^B%C)#�2Yuae:l7'u����h�����7�}XO1���Gݦ�a:�B�%��$��$IɓI���S_\�aA��������Dݼz��F7$%�^�~�ϖ#(�;%5ﰯMR婔�<[�G���/�Ѯ�'
���W���Am+q\�7��v3��j�5��6Vr�6���V|�
�������f����v��ݶ�_=��~�7��W?lw���,wnbg�odZ3<+��q�eC<�(�2���ϳ	}�r:܎a��	�?�����e����現�u�F�ʚ��*W1��w�Vx���,S�����R����/�N�k��[d����U�s�����G�:�q���A6�-%�\G��8�0ǧ���d]�Ͼ��5�񇡿���"��2��g<����o =�s/"̯Lc|���[�\�M�Se��0��#-pv�:Y��g�D~�@���ѐྍr��;�Ǝ�Kp�xtr�,�r���N*�Ÿ��E�ٜN'��B�S��W��-��)�r�cw |ԛ��e-+�ms1��ߜ�W؜-��b�<�M�%z��� Ul��","4Pw�%�ď����q�.s���S4�`��«@��ڢ"/+�sS�F냸�����h�ѵ�9����#��m�N� *�[��t[�3zm��Gd���gӸU�k�Y~��c8�>,���T�Z^<�m��Dk��Uw�4�
HD�*�\N�A�]�����j��)�fk�R9$���Ek���%30�K+#��)�c
��A�}d�u�v5�qǭ�tv��r����6��g�I� �z�>+�*�I�Nn��x�f
����U���R�*��R��b�?�N񓜛7lMr�ƇO�ѨU�@꣝�i*�>O�>In;�Y����'��y[B���=%C�*��L���mX�R���� ���Џ3zF-b����G���Y�>�a�S~��u��N4l��{��FO S#�`'
߷�ڒH)}C�[�yTяD�d��ᮁ��d�G�>�VzĿ+�92������<�EAٌ1��4��U�Q�V���i���)�����m��>�=g*�ci�c*r��F�?`��-�N�,j�6\� ��"uD`��4Y�aw����Ke������~]A���_��0HG�"Y����0�x5�����dh�B���|��qu�:�T#��'�ou~��N
Ƕ�?����TN��^/���W08Z��Z�^jk�bw��ro�ۥq���2c��F�����Z�~âD����2j60'4 k�2��%+��Ӥ�nh<�D�fMt��kQ����0�[��[7y��
3oy�ؤ1~;4��=䬳0k��Rj�f��5�<\�q7yZ�]��b��,���w�|��[�lUo�N;nzĊ�,v�������Χ����I�s��Җk��~~+ګ�u��_:o��W��\G��·���Λ��.l7iN=�Bn}�D���?�`�Sݝݓ_�ک	a�,�U�j�� =���ɔ����[;��w�y+�*��X�k1��x���ɒ���Ϙ�� v�"N�d�3�� LG���D��Ʉ�Z�i���������Lt)>�(���u_]d:u�Tl��y=b��`-9R���!˩�A�RY���˾�0�;LΆ��.�3%�%X�ALE��X!���ՐNȎ]'+	�a��p,�o�dȜ�d��t��b�1[��+QM2E�Pd�$�J�Z�������uC{���,�v��;h�]��\n�F����p&�sq�,#F0e�-HC&�f�<t8��h[A<� ~�uO:g�'��*�F}j7q�A��"\p���;x(?/0v�AG�*��no'�d$.N�;�hO�Ԅ�e�a��#?�uL����.�E2K/�ˋ?�w�ݱŐ�t��ϻ���%Ћ,�+s�>�o�^ĞP݅�j�^�.�EI�K��%yn�-�����I��E]RbJ]�]8�_f{kFo�����&k���Xؔ(+��` Ǳ������A����DP  �Ӑ7�(�_��HIa����$�K��'�'�Dκ�ƈp�����E[�L	A7(=�":W-PK���)A����ᑲX!��Uq8X���(�TYx����e����f}���'S�����U�eJ����4��-Ysp�l����#��'Q�O� �1��b�G��F
�W��e֫�p)�Q�@{��&W���,�L�ߗ>�5�m� �X� G��|���n��i���a��[�WY��쬀�T6����ߓ��ѩ_zˣ:�I�W��}���v�t�ֿ�𓤍0&��;o	��4ͼx������>��:򩂕Z�Rl�4��L��s���Et�
��]6Q�UidA�
i��逸5��G�t��uoa�B6�@���?�Kl��c;1��Kv�6����5W�P�λ�j��)�ՈעAK��`Ks.Ȯ ���B�z��:�X�b�p4�si~�
+�$_��N�x�w��j��܍)���z�����[���8 �MatٹH���/����|��2gy�Sݲ�Ȇ�i98�m+bZ���ò���$��y������R�h����c:j)��T��4�	ğ�~N���߆�>}�����,��^�Z̙ 3`���}�����/��a�sbo��ȥ���@�����j}om�B�̯��9Yv��%vo옞���.k�F@�K�F�Z JY�$��	��.�[� �\�uݕ���E���^�/C��g�e拸	�3/3�0����t�IY2U�>Jg�>�O�������R$29�&�qG�ѾT��
ه��/���~��f�z�����^