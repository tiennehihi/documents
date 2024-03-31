## 0.6.3 / 2021-05-23
  * Fix HKSCS encoding to prefer Big5 codes if both Big5 and HKSCS codes are possible (#264)


## 0.6.2 / 2020-07-08
  * Support Uint8Array-s decoding without conversion to Buffers, plus fix an edge case.


## 0.6.1 / 2020-06-28
  * Support Uint8Array-s directly when decoding (#246, by @gyzerok)
  * Unify package.json version ranges to be strictly semver-compatible (#241)
  * Fix minor issue in UTF-32 decoder's endianness detection code.


## 0.6.0 / 2020-06-08
  * Updated 'gb18030' encoding to :2005 edition (see https://github.com/whatwg/encoding/issues/22).
  * Removed `iconv.extendNodeEncodings()` mechanism. It was deprecated 5 years ago and didn't work 
    in recent Node versions.
  * Reworked Streaming API behavior in browser environments to fix #204. Streaming API will be 
    excluded by default in browser packs, saving ~100Kb bundle size, unless enabled explicitly using 
    `iconv.enableStreamingAPI(require('stream'))`.
  * Updates to development environment & tests:
    * Added ./test/webpack private package to test complex new use cases that need custom environment. 
      It's tested as a separate job in Travis CI.
    * Updated generation code for the new EUC-KR index file format from Encoding Standard.
    * Removed Buffer() constructor in tests (#197 by @gabrielschulhof).


## 0.5.2 / 2020-06-08
  * Added `iconv.getEncoder()` and `iconv.getDecoder()` methods to typescript definitions (#229).
  * Fixed semver version to 6.1.2 to support Node 8.x (by @tanandara).
  * Capped iconv version to 2.x as 3.x has dropped support for older Node versions.
  * Switched from instanbul to c8 for code coverage.


## 0.5.1 / 2020-01-18

  * Added cp720 encoding (#221, by @kr-deps)
  * (minor) Changed Changelog.md formatting to use h2. 


## 0.5.0 / 2019-06-26

  * Added UTF-32 encoding, both little-endian and big-endian variants (UTF-32LE, UTF32-BE). If endianness
    is not provided for decoding, it's deduced automatically from the stream using a heuristic similar to
    what we use in UTF-16. (great work in #216 by @kshetline)
  * Several minor updates to README (#217 by @oldj, plus some more)
  * Added Node versions 10 and 12 to Travis test harness.


## 0.4.24 / 2018-08-22

  * Added MIK encoding (#196, by @Ivan-Kalatchev)


## 0.4.23 / 2018-05-07

  * Fix deprecation warning in Node v10 due to the last usage of `new Buffer` (#185, by @felixbuenemann)
  * Switched from NodeBuffer to Buffer in typings (#155 by @felixfbecker, #186 by @larssn)


## 0.4.22 / 2018-05-05

  * Use older semver style for dependencies to be compatible with Node version 0.10 (#182, by @dougwilson)
  * Fix tests to accomodate fixes in Node v10 (#182, by @dougwilson)


## 0.4.21 / 2018-04-06

  * Fix encoding canonicalization (#156)
  * Fix the paths in the "browser" field in package.json (#174 by @LMLB)
  * Removed "contributors" section in package.json - see Git history instead.


## 0.4.20 / 2018-04-06

  * Updated `new Buffer()` usages with recommended replacements as it's being deprecated in Node v10 (#176, #178 by @ChALkeR)


## 0.4.19 / 2017-09-09

  * Fixed iso8859-1 codec regression in handling untranslatable characters (#162, caused by #147)
  * Re-generated windows1255 codec, because it was updated in iconv project
  * Fixed grammar in error message when iconv-lite is loaded with encoding other than utf8


## 0.4.18 / 2017-06-13

  * Fixed CESU-8 regression in Node v8.


## 0.4.17 / 2017-04-22

 * Updated typescript definition file to support Angular 2 AoT mode (#153 by @larssn)


## 0.4.16 / 2017-04-22

 * Added support for React Native (#150)
 * Changed iso8859-1 encoding to usine internal 'binary' encoding, as it's the same thing (#147 by @mscdex)
 * Fixed typo in Readme (#138 by @jiangzhuo)
 * Fixed build for Node v6.10+ by making correct version comparison
 * Added a warning if iconv-lite is loaded not as utf-8 (see #142)


## 0.4.15 / 2016-11-21

 * Fixed typescript type definition (#137)


## 0.4.14 / 2016-11-20

 * Preparation for v1.0
 * Added Node v6 and latest Node versions to Travis CI test rig
 * Deprecated Node v0.8 support
 * Typescript typings (@larssn)
 * Fix encoding of Euro character in GB 18030 (inspired by @lygstate)
 * Add ms prefix to dbcs windows encodings (@rokoroku)


## 0.4.13 / 2015-10-01

 * Fix silly mistake in deprecation notice.


## 0.4.12 / 2015-09-26

 * Node v4 support:
   * Added CESU-8 decoding (#106)
   * Added deprecation notice for `extendNodeEncodings`
   * Added Travis tests for Node v4 and io.js latest (#105 by @Mithgol)


## 0.4.11 / 2015-07-03

 * Added CESU-8 encoding.


## 0.4.10 / 2015-05-26

 * Changed UTF-16 endianness heuristic to take into account any ASCII chars, not
   just spaces. This should minimize the importance of "default" endianness.


## 0.4.9 / 2015-05-24

 * Streamlined BOM handling: strip BOM by default, add BOM when encoding if 
   addBOM: true. Added docs to Readme.
 * UTF16 now uses UTF16-LE by default.
 * Fixed minor issue with big5 encoding.
 * Added io.js testing on Travis; updated node-iconv version to test against.
   Now we just skip testing SBCS encodings that node-iconv doesn't support.
 * (internal refactoring) Updated codec interface to use classes.
 * Use strict mode in all files.


## 0.4.8 / 2015-04-14
 
 * added alias UNICODE-1-1-UTF-7 for UTF-7 encoding (#94)


## 0.4.7 / 2015-02-05

 * stop official support of Node.js v0.8. Should still work, but no guarantees.
   reason: Packages needed for testing are hard to get on Travis CI.
 * work in environment where Object.prototype is monkey patched with enumerable 
   props (#89).


## 0.4.6 / 2015-01-12
 
 * fix rare aliases of single-byte encodings (thanks @mscdex)
 * double the timeout for dbcs tests to make them less flaky on travis


## 0.4.5 / 2014-11-20

 * fix windows-31j and x-sjis encoding support (@nleush)
 * minor fix: undefined variable reference when internal error happens


## 0.4.4 / 2014-07-16

 * added encodings UTF-7 (RFC2152) and UTF-7-IMAP (RFC3501 Section 5.1.3)
 * fixed streaming base64 encoding


## 0.4.3 / 2014-06-14

 * added encodings UTF-16BE and UTF-16 with BOM


## 0.4.2 / 2014-06-12

 * don't throw exception if `extendNodeEncodings()` is called more than once


## 0.4.1 / 2014-06-11

 * codepage 808 added


## 0.4.0 / 2014-06-10

 * code is rewritten from scratch
 * all widespread encodings are supported
 * streaming interface added
 * browserify compatibility added
 * (optional) extend core primitive encodings to make usage even simpler
 * moved from vows to mocha as the testing framework


                                                                           � ����Of��j��Օm�T*��l<���{�	R�4<cZ��f�G6����>��o�����Ș�I����ٰ}���}��Z�-�zX��ߦhNnĲ�F�.�%Rn>���L��nRM���p����)�C�j�t}�}|���Ͱ��-����
��Q�jIχ�T���l�l3|5���7l��Oٕ�?Vt̆�]�_�<~<�j�-Fܑ���t��C���NC�i�w?Ϝ9WIƆ�TpM!M��a��@�r�u9}�t�J���ŵ����Nz��P�*�m'{l�iit�\j��0{2�8�c{��$Jsь��g~@��|�t��*�"=�F�e2�\��1��!�B��A[����a��@q��X3�u���������>��B������î�����ɘk/|�V\��v��l�:փ
J����Ri;�����{���֩�a���k�%>�E�� �[�v��P(,����i\͑��g{+���9pU�bᶧ[�������۫��rm?{��>��b���S�5Z̗�F�Bn�UV��y�1a�A��snk<�llDu�2� r��D/�
��T�y�$|���2����*.��'ƌ4ahըk�h3�x��=�!�hN1؁jfM4���H���jX?����/o�I��n��ןӝ�_'��7JS�2��v(.7~Q�}�5nu��c�97o|��,`�j��4r?\���u��Ͻ]�?J3|Jg���Q��l�	���m�T5'��t>����Op������ϗ�.�"���6<��nm�"5�Q�7��T���I���*�mE�G����� ����`a�Ȩ� ���d�0���7�[�yu�M�	��źG�[��I�FFh��	���KƩ���]?;�jTY/�)wu���ߔ;�ؑ:V򧁠ĥЫ^2d�VZ���
WEe�1ց�8U����0�TB�/t:�w�]��<!����D�Q������Zz�@���1P@�248��9���*jlf��T��O.�6��t�s�OT�<{�Ƚb'̔����U��m�/�G��Ҵ�ZC��p�"��7�B����\��b�O�T������
o�u,���N�
�$�z���V%����.���+T�FH��q*a�*�Z��sl�CS�,���:�M��xFߏ��'�ً;3rnjQS���x<O�e��+}B��!��ؽ���'}���?��a.��� X�_O�":v�����O����5D�=�q�ދ<v� >�Ͻ���?��85U>uo8��~d&��LS6�"Y�Cc���@����C�?�g)[V閫T���w� �i�#(�E�*F���_������i�(�.ϒŏ��z:�y�'�0�m���R��E"����ּ�n"��)
�����Z��{�����Q�Iݘ��c�+����u�)��x�p�P���H�6��<6G�_T��H�~�ɽ�9�Sc��A4����Qz�B�;J�o�k&rj��[�/_m���{��j"a���j_"^�Hl��"�2���9z3W��B�Z��G���4�6�?�[L�W�T�W�;�����v�ue�7��)���A
��"�5�J�r�b��.��o�JPΛ狪O-<�g�5Q m���a�$��I��d��8���v-s�wm�*��ʚ��N�sDzj/	FL8�#r̗�㼢$�|�F�US#�2��e�F�
�'7�%\,���{�u&�:���6\��g�f�����c/2Qd ނ�8��wߍ���f���M낐zR?��$��wƜ��AoC\�?��!�,�La_/1Am�Y���A�j����0.�<b�MMw���}L���u`y��cT�ܽĖ�-+�kߜm��Е�s�Փ߻	����E�ۣ����ޭo<��r�J��21�X4�XL�lN^�s�Ǐ!ņϻN���p�W���zT�C<痭�6G�[�7���E��Kl�*Y/7_��_|_:Y�)��s�/]��)�pJ�o�(9fA9B��8�-_Gs�g�*1�W�4����#=�]F�3�n���/rx-���`_�t�ڬ��H�jF]7H�͏�@8�My��oF_��0��.*6���k���wE��_W�@��"欔���}�a�
p�Ra܂4����1�UͶ��u�,��=kJ�D�
�˧�6Q�k��-sS���-������#"-� �qpt�{�ܞD��"�,�,��и)�q�� J���k��*���:6*V�S�t���O.l�h�qE��%ŝ�̍�^� ���-Ul��2Nݵb����D�Ő=�!�+,�b�WA ��ܷ����ȧ�!S��ց)y;�����h���t��TʙR�$&B;�gݯ�jfc'��O5/0Y�v�)��e��ۮ-�D�7�qk�=��<k��+ۻk=�Q��7yi�7nr۝pƓ����SG��
^���oi'Y��,�OF�l�-(�j�w<�j<�7������'��$��7��-��w�"�LŹ�0�q��=�^���x㡑E���;S���l��Q'��A����Q�Q����˿&���H��������l<�D?+s5]R���;�ö%P�m?"��zeK'�5��7�(rtYVv���4
˺�Q��B�Ķ���(�6�m�˙S!gP�&mM������-+�UpZ�<��v�XWC��^`4��GL�F#�Weo����X
qw��������D��l�kcm���i,�B=���A�5�y�-G�J���&�?ˉ�s�2�럺i<�%GI��Wd竳"j�B_fЖ�(���Ƒ�9zB_��R?��m����{��䶭�ñ���A����t����{$4��kB't�^���{�B��Z����9{?�����{>L�����s^c�1��g�;c��O6�� n�f7����^Jj����s_W��b�E��;b���&X+l��X�8_MCٝ��}X�J���ȧ(y'"7U�0+OUӽ�)=�oQ�Σ:���z�p�}�ĺ���@�D�1�KY"wr>=\���#>A�}��B+�Q�3rr�Oy�����$������JQ1��p dNw�q�O�U����	�1�	Ed}2�-�-�Ɋ�n���˝�����3Ι�@� ���븹�Đ�Z�O�[��t���8z���h��P(�.ţd`q03�o�.ʮo����5�:�q�u�-�\ޓ�ս4=)��]j�㉁
]�~��j���+KYAC�U����C!�X}�C��{u)Q�Y��^�ũ�w�D�lW7/��](�FE�0���ȨP�;>
��0��n��#��F�<��&�64Z@�k[�Y>s��dzpE�{kxfW�%��n�6�L�������r�/a[���|��O6OW�\�*2\���Ŷ�0۔i��Y��/5���i�'�����$�,�N�d(& j��秅1"���z7�i�n}�u���O�(4)U��Z�ש_;�벯�� J��!�lR�B��oCt4<��.7���h-wp�Ù�^�F ���_/~��3&?����!��-��[	?N� `���e��!�{�ܧ��l��@�I9.Fk��n���j�F{�lBa�>�3#�ݳʂw��;��>w��*����]X��z�!�r BrY&ǧ$	!�{���O�����Y
7?5�n������k�V��$[���inR��aAO�Y���	���Y%k_A����7������9�b1O=����^4���!?�����q�
/%���Q�	�Pn�_{��f�U�u@��F:�~�3�.�}@7~*om�Ӏ�CCa�X=r���Z�W8�y	������l�I]��.�b��t�|�/��l�O�ԫ��-<�gt���sk� ��y��:,u�bF����Is+�A�.'%�Gi$�Wi���=�?��,G���rh����6v;?�\6=�g�7�%�Jп��&��vah}�=��a��|w����=X��-]�샎$"�}��k �������?�v�m�u��yg�|^*F���r�ۭ�S� �X:��{�V��-n�$�"��j�f���fge����]1�@Թ�/���ݡ�0k�럪6�coo���g�41�]�]����z����ǿ��ώB<�]�C�퉺���Omw˽��n��!�$�`~��j�݅�8��o�6��%L|)Ӣ����r����6��f� #P(z����7/�݃���ŗx�����x.G\�+�yI���j��-�ǿ�.<�JXƕ0ʚP�����5�7ŒW���oSи�չ��f��OrV]u!b��&_�7'��C�Ij�=V�s`^�mD�\�a�'�Z�i���1��P��$�M�W �������O�`��.g�ڥ_�O�����R9r��&i݌7�et�Z�%T/�*���z�����/L�I��xQh����?�F��B0�Q��6UX~*����֪y�CV`D�3_o���G�rϡ�[ױ8���!i��`��q���Ż:]�nj��F���5/����>���ڐ����5��!�����D�`@xL[��\ʺ��� ���өV���VRI�h�/���Y�6�n����}���);}h��G���ɪ�l������<�A*AO��Y�#��m�]\��zLjˤ7���A���ѐ	�jk�к�0�M�mM�#��G�?a��<1y+�:;xuG���\YX��#AXr�Yڭ�$�h���b��(�]mt�3��}Y �1`Z�l���\=�K�3+#������(�)�F��&�7�H�Re���W��0 ��#޴���/�w� �-�^���+��<ݬ��I����ɋ/'�k���B�N��*ƷZt�� �$@jۦ��ڟ
�$R5�
�,���	�'5��F�6wek��1���؃͈}��a�-/,����ש�L�33D�}���O��"sb����v>RQ�L���K�j���\��n"�De�
�Vj~q�~o����I���g_�x4o��fZy��&!�ͬu]�X^!��m��H�{����z��c�O�|�r;�Y����X�戽��P�y�ֹC���I�OJ������[���W� ~��\�̟F�]o.���&�:��"�/@4
�e�f�z{�_m������D|�@}����<%[C=��t�*㾁'��eF2S�mM��@�x{�����R)uɩ�b�n�:�W`*i�2/�P�*oH�t��ݨ�!!U7�%����eU���������y���c����
k/.\7^nǵZU��`���e���mcj�z�;����7�4tl��4�WF{���Biz<f��u/8,t�F�ܨ�h��[^�$DyƤ}i_�l%Q�.�^�g�a��?q=�(%�G����-�熻jL�fXN� 5-ziIcRxm�F��𐈅vK�fud������!�5{S|hi������ȿ�:���ȈY� 6~�"9dt�j�t����{ns\�냭���#}C��D:��_u� g*����Rw5Y�P�/����(fM��Q[&.�;�/"�T֓�̹��9vj�*B�'ttdn0xD��x�'�Gw�a5q,t�P�DX��rR?�,쭨��y�6�Ӽ�� ).asf%"���X��g�����02���VYo��)ա��Vʗ�9
�Om�2J�hc��<��Mz*��@��~����p�����Gj1�ά�(���Ƣ<�)p�rK/�/bD�����:eψ�*�`�v�*De(�Y���#�d���:��{�@p�Z��U�OL�gw�w� s%�_Z��UF6�F=�}Ch`�\�S�{�o�H�ji�(�ۗ�̴ݠW�Y2k�'��3��bΥN"�.i(��3��k�٤ꐼ�=UeC�������#�j�J�f+����( Ws���cO�[Z1n�Q����H��o�6n䢛���@"+&�F��$Y����!�����QzVpX���eE@:��a=O'=��HI�š�>#p�ePQ�̪�q�t)��Ҹb�0��.�Т}��L���qۺ�Y���B!�S����2�"G0��f���1\��Tpi�iQ���Kf\-V*���.+u�nȖ��_u:xmz�����k��R�.��c6��R�����1��A��M����)�W�C *�!�2������M��o� �a��&L�vј�L��C�F������+�C'��M�Ш�<�	�fin�УG���z	X�.��$e@�t� A5w�����bL��H�5|�Pmo��mT�Y�������ǐ���E�oq�j����&�6���5m�c��c�ꋙ����H*x�n�<b0J:P'A%^�t�����C*r��KG���U��-�E�k�A/�^1߈��b�^�	�'���r�1���]��pZE�wV6�{�G8qCO<�wL\�S]�l@бp�&����-{��