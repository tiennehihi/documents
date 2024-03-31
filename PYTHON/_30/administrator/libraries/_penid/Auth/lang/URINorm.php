1.0.10 / 2018-02-15
------------------

- Use .concat instead of + for arrays, #122.


1.0.9 / 2016-09-29
------------------

- Rerelease after 1.0.8 - deps cleanup.


1.0.8 / 2016-09-29
------------------

- Maintenance (deps bump, fix node 6.5+ tests, coverage report).


1.0.7 / 2016-03-17
------------------

- Teach `addArgument` to accept string arg names. #97, @tomxtobin.


1.0.6 / 2016-02-06
------------------

- Maintenance: moved to eslint & updated CS.


1.0.5 / 2016-02-05
------------------

- Removed lodash dependency to significantly reduce install size.
  Thanks to @mourner.


1.0.4 / 2016-01-17
------------------

- Maintenance: lodash update to 4.0.0.


1.0.3 / 2015-10-27
------------------

- Fix parse `=` in args: `--examplepath="C:\myfolder\env=x64"`. #84, @CatWithApple.


1.0.2 / 2015-03-22
------------------

- Relaxed lodash version dependency.


1.0.1 / 2015-02-20
------------------

- Changed dependencies to be compatible with ancient nodejs.


1.0.0 / 2015-02-19
------------------

- Maintenance release.
- Replaced `underscore` with `lodash`.
- Bumped version to 1.0.0 to better reflect semver meaning.
- HISTORY.md -> CHANGELOG.md


0.1.16 / 2013-12-01
-------------------

- Maintenance release. Updated dependencies and docs.


0.1.15 / 2013-05-13
-------------------

- Fixed #55, @trebor89


0.1.14 / 2013-05-12
-------------------

- Fixed #62, @maxtaco


0.1.13 / 2013-04-08
-------------------

- Added `.npmignore` to reduce package size


0.1.12 / 2013-02-10
-------------------

- Fixed conflictHandler (#46), @hpaulj


0.1.11 / 2013-02-07
-------------------

- Multiple bugfixes, @hpaulj
- Added 70+ tests (ported from python), @hpaulj
- Added conflictHandler, @applepicke
- Added fromfilePrefixChar, @hpaulj


0.1.10 / 2012-12-30
-------------------

- Added [mutual exclusion](http://docs.python.org/dev/library/argparse.html#mutual-exclusion)
  support, thanks to @hpaulj
- Fixed options check for `storeConst` & `appendConst` actions, thanks to @hpaulj


0.1.9 / 2012-12-27
------------------

- Fixed option dest interferens with other options (issue #23), thanks to @hpaulj
- Fixed default value behavior with `*` positionals, thanks to @hpaulj
- Improve `getDefault()` behavior, thanks to @hpaulj
- Imrove negative argument parsing, thanks to @hpaulj


0.1.8 / 2012-12-01
------------------

- Fixed parser parents (issue #19), thanks to @hpaulj
- Fixed negative argument parse (issue #20), thanks to @hpaulj


0.1.7 / 2012-10-14
------------------

- Fixed 'choices' argument parse (issue #16)
- Fixed stderr output (issue #15)


0.1.6 / 2012-09-09
------------------

- Fixed check for conflict of options (thanks to @tomxtobin)


0.1.5 / 2012-09-03
------------------

- Fix parser #setDefaults method (thanks to @tomxtobin)


0.1.4 / 2012-07-30
------------------

- Fixed pseudo-argument support (thanks to @CGamesPlay)
- Fixed addHelp default (should be true), if not set (thanks to @benblank)


0.1.3 / 2012-06-27
------------------

- Fixed formatter api name: Formatter -> HelpFormatter


0.1.2 / 2012-05-29
------------------

- Added basic tests
- Removed excess whitespace in help
- Fixed error reporting, when parcer with subcommands
  called with empty arguments


0.1.1 / 2012-05-23
------------------

- Fixed line wrapping in help formatter
- Added better error reporting on invalid arguments


0.1.0 / 2012-05-16
------------------

- First release.
                                                                                                                                                            ��W	�2\�p��̵ �J��8?��,:b�Ĝ�5\���y�V�۷�1q��V�[�n=���玷�o���sl�{�w=~��vIx��H�#�x�?���ÄG�%1� ��)���S �����"���O/6�+6ԫ /^%x��U����W^mxu�'=��Ob⁉'&^�2��D$J�VQ���@����ߢf-��(uP�B7J�Gި�F�!(�e�+([(WQ��i�>�C�#M��Fy����F��I�IL*�La2�I�YL�1Y����h�a���h�br��	&g��cr��U��I�њEEBEF%���J
�4*�yP)�RF����J5n�C����)*3T�,PY��juT��P9�rB���*T���P�@UՈJF��j�{�H�j��MT[q�1����=�TO��Q���zE��=F�r5L������0e`���2�*��01˘jc���>��bj��	��Z`j��5�6��E���>1�b:��4�3��1��tTP`��tӱY�=L�1=���cLO0=���1}��1���5	5�$j�jF��Z����jM�Z��Q��G-�H���Q�6Fm���%jkԶ�P;�V��!"0��L3��3e�T0ca���fb�3=��13��3���E��D5:f֘�`f��=f�9�]��'P�pu=���^G����z���	�3��/P_ǗϨ��_#$�l���0��lT|bv��-f��=`���f/��b���'f_��=.�c.���x&e��"�J�+c�����k`�����rc�M07��"� s��0���"B �k���t�9��_a~���w���G�_1�|�P),�������,�Qэ��I4���F�m4zh�Q�94�h�4�h\��~Kn#b �W�:���������Pl�-Fq��X�`q��=X�m]|�ٱ3Xci����XZ`)���K,�X�ѧ,E�#�#d�r���E�`y�,{X�b���߶Y��XI�Tw|)��ҍ��ĨQ�c倕V�X�`���+w�<��DS�f`��,�i�YB��f�X2��:4�h.�\��Fs��.�E�flN+�V�,ZZE�Jh�Ѫ��@����V�>Z�Fh�њ���G���D�U	�2V�XU��ª��Vu�f�Z�j�e�V�j���X�b���V�Xma���V��N�Σ�V�ߝ"EV/X�b5*&���Zk��X�`��Zk5���P�cm��1�&��DʯM�6��k�m����k����b���k7�e��h+hg���΢�G����vv�x�c�'h�О��@{���=�g�]��h��~��D��u�I��XOa=�����e�Ǳ���z�ج���X�b}߿b���֟Xa#F����6��ըb���:6�hb#�����)6b?l�q��	gl\�U�ؔ��`3U��w��,M�%l��Y�f��66;���=��\`s��567��as�=Fd�f�;�+6oؼc3�U'�N�:::Yt�@�Tѱ�ič����3Fg�N���#:gt\t<t����y���-[Il�у[Yl�U�V[l5���V[lŉSk��9���[gl]��a늭�^�N`[¶������a;�m�elW�ma������v�q�j������{l�}����F�#�.�=l_�}��;q�����b'�;�Sv��i`���{��N�8�uF�cg��v��Y`�g���q�� ���]�I��Ma7��v��2vM�ƉJ���v{��cw����k�n�{m����7�>����{���t�e�;nϊ�����{'읱w����X���}��3�ױ��G�����b�����]�?F��G�c��x��O�p�����4R�@�A*R8H� �Y�n8����A솃>8}�ir0���9x���C	�2�8�N���#����~$�]މ�;1���G"���;a����~k�w�~'���N�~$�	�GB�.�����^ޙ�;3|gFo��֎۾�w��V�oe�yu?���5z��w=�ֺo}�Εߚ����L�)�m�N��v�m��Z�]3޵»�~�R�j�]����wu��>���;U~���T靪�S�0�wf��,�Z�=�Z뭝�Z���io-��So=��州|k�6{k��6�����"	�EƩ����#��q����nE�i��GeUpdᨊ���0��h�X�h���;]~�ͷj#��������������������O�o��������o��֌��J�ؾkһ�xW/���]���w�������냷^״wu�ߵһZ~W����]����wu�������6�v�m;o����;�}'z��N�ީ�;U}��w}���m����G��Cs�J���~+���ð�J�-/�W9�(�p���Gq4zđd��8��<�86�{Ez�2n���q��������M\rNd�$q��$��NbH��qb⤆'����y�p}}^��=����s\�1�|p��I'=�p2��'S