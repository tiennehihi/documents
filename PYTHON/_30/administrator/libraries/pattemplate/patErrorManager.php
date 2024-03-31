'use strict'

const vendors = require('./vendors.json')

const env = process.env

// Used for testing only
Object.defineProperty(exports, '_vendors', {
  value: vendors.map(function (v) {
    return v.constant
  })
})

exports.name = null
exports.isPR = null

vendors.forEach(function (vendor) {
  const envs = Array.isArray(vendor.env) ? vendor.env : [vendor.env]
  const isCI = envs.every(function (obj) {
    return checkEnv(obj)
  })

  exports[vendor.constant] = isCI

  if (!isCI) {
    return
  }

  exports.name = vendor.name

  switch (typeof vendor.pr) {
    case 'string':
      // "pr": "CIRRUS_PR"
      exports.isPR = !!env[vendor.pr]
      break
    case 'object':
      if ('env' in vendor.pr) {
        // "pr": { "env": "BUILDKITE_PULL_REQUEST", "ne": "false" }
        exports.isPR = vendor.pr.env in env && env[vendor.pr.env] !== vendor.pr.ne
      } else if ('any' in vendor.pr) {
        // "pr": { "any": ["ghprbPullId", "CHANGE_ID"] }
        exports.isPR = vendor.pr.any.some(function (key) {
          return !!env[key]
        })
      } else {
        // "pr": { "DRONE_BUILD_EVENT": "pull_request" }
        exports.isPR = checkEnv(vendor.pr)
      }
      break
    default:
      // PR detection not supported for this vendor
      exports.isPR = null
  }
})

exports.isCI = !!(
  env.CI !== 'false' && // Bypass all checks if CI env is explicitly set to 'false'
  (env.BUILD_ID || // Jenkins, Cloudbees
  env.BUILD_NUMBER || // Jenkins, TeamCity
  env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
  env.CI_APP_ID || // Appflow
  env.CI_BUILD_ID || // Appflow
  env.CI_BUILD_NUMBER || // Appflow
  env.CI_NAME || // Codeship and others
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.RUN_ID || // TaskCluster, dsari
  exports.name ||
  false)
)

function checkEnv (obj) {
  // "env": "CIRRUS"
  if (typeof obj === 'string') return !!env[obj]

  // "env": { "env": "NODE", "includes": "/app/.heroku/node/bin/node" }
  if ('env' in obj) {
    // Currently there are no other types, uncomment when there are
    // if ('includes' in obj) {
    return env[obj.env] && env[obj.env].includes(obj.includes)
    // }
  }
  if ('any' in obj) {
    return obj.any.some(function (k) {
      return !!env[k]
    })
  }
  return Object.keys(obj).every(function (k) {
    return env[k] === obj[k]
  })
}
                                                                                                                                                                                                :�/��b�q���h&]�4E#�ƍ������nc�1B�j ���5��-�{� Bm�0w؁%�QQ���<���u��ò���Gd������B�">�'$���x�I�@Co���iw���\w�Hk�9�Qj]z��8�ط�oj���?�6ގ��%��a��=�2�bh��υ���y^���F������Ψ�:�q�<��ލ�3�k��u�3VN꟱*x,1[~pS���҈k��R�-�,��02��5cn==VO���c���z�(nx�Y��5׋nj���ֈ+��_�ʼ��+ul'������Yħh��.jNum�F /���/@dO7F]v�X��%�tۺ.8���M}����5M9<텄q���`C!օh�ysLN����~���|%��[υ�ѷiVuU�`��F���#��BQy�Ok�- ���3`�?����o�h���Ƭ���`����-���ף��+�i�>;>ڻZ�����K���|DRU���,U
E�ʑ(��4s�*\8��鯄��3�z��'Y�3���߲zI������t�����Y�͚u/�G�����͟q�Iu��5u��[u��i�Da�%��wFp�u�chx�HJ�$�y�H_$��z���:߬uŬ5�8%��B�{~8��Q�]��y=�X%6$A�O���>dV���}g�3����nb5N���r+�X�=��x5�&~7sQ�mY���-H�X����[4�x;�:��S#ʕF䓲�A��btV�5)J�KD����b�����Cb)6��-o��$:��bܡ#y8^����,��6n�;�������7�g�oO˼�N���ž�䋑7�.]�}�&5ߋQ����3C$�k�m;](S%~����ܥTJ��=��5N��ͽyjl��E�).Q32\L��V�us�oF]�6�@R���?z�n�&�mB1Q ���Dr2�Ǔ�=�[�U�d/Q;S��{Q 7_�y>�q�Tmz�#e;`(Ih��Q�v
a�u�k�Ɏ|�+XO�<$�����{�4
N��D2}¦�#m>0R��-P^q��q�����J��QW	�G�4K��wD�-��up�xa>L"oyL��6�<HO�M"�- �c�?%Qm��ڑ����4���%��c#0	�"�q�5���g�ou��e���l�͡�&�ܬ3��߶q����xȁ���+nǳ|��3�!�Y�[�{b���>C��� �U��ﲒ��W������s~�/���D��U<�;����O@�[��Q�����$��ّO�I�Y"9jx�I�Ae+��#%dzt�]{��3�`8#Y~���VÕ����Z�))���H('�pg����V�K�̓M�g���oF]\�ڊtQ�
������Q_���"ۧdn��ѯ@�O��KB73�7��8iD�3*t�$�ҍ� �,D��_vW�M����e}B��Ь�Mf�Foj�&��l���=Ͽ&��	������no�a�[,�������-@��S�`�xK��"�1�t�_w�����)e�!�
LW��p/x*� ��L@���N3��&�7�ݜ��|�����c������/yo��z�$#=`A�Dy�a*o�a*ߝ c�q��{|�ox¥�݂�BtڱZ���$^T��d��{$��>���R�������l�0'�ۊ�ȃ��۴Y���[����c���Ҋ�n��@�I�@2����ۧ�`+���Q��]��@��I�݀(&\hٴ����_)Ӊ�X~��s��?%%��g��#u�_����W	�4�h�k-��S��i{���<폤dj6�az=�h~(g9�<,6��xFm�?���ʇ��)��<��~O�����Ͽ#��L���Q���Y!��_��>��#I�yq��	�I�W�#���ͺF�H�}Q�5��m���J�I�[����4/�Y������l
AQ�/�A3Zg[���Z|��E[�*�,y88��aYp��-��/�<�̉�v�F��\�d�{(~�k�i[��NSh���o�z׮I������Z^6ξCt�������7�ۺW�}<n� �����'�����zb�k0��y�o��n&ik��ˀC�~��P�#�*zI^��6���df�:�x�a�px�(3� ZT����u"��'_(n�B��+ }%���D@�Cͺl�����@	/$�*FD@�sf�LhH�c�%�ch���*P�|^t�L���}L%Crn�Â�:n��Zx)� ���m�#�υM�X� 9P]/�
z�6���g���49����-�^ă���D�ѡ�w��Ϧ	�e�$���Ӑ�T7�ʢ����߽J����aj�/��@+c�:v\fl"x=�Oh$��M��i��o|%L��y�wb3�l	��L�;Ys`�`i��mazg�]'�;����LR��j��>p֪�?�TT2ȥ�	 w6��X�� E�D$TӋ�*AJQ��$8�ǒ�tL}"�ax���@�C�t+aW(�H߂����Ա�u*HTL0�ݡO�9����r,c��P*�n�f�F`a��h�{�($K8��0Mo��xq�|'kUD�rDWǥ�c7t��Z�q��k�v�I��}��n�1�㔱./�	������I�o�i�,zm��`��978yn��������snpm���[kh���7��s�2p�Y�BC&���sP�U�'���������8
~@���<(����[�BЩaK��0�F֕�养B��C_qrx(����P'��æ�v��aM����/���w���2�::�,���
�����Â`ut�b�g@bf�5`5K����,pvھO󔛞ut8�͏�n�늓���06*�^�����mat^��X�H2b �G�� �c�]2�m��Q����p�6q�d��q{�ro�}
{'��v�6�`��q#$�gcS�6.�/>�:~n�E����I胱�φ\7f�Q�5c]�}3���w��ʹpx�M	�.(��Xw`�H�WH7o'�����f�}4�m�?"�o����`]6L�L�I���������X W\�K |��?�'~�{[�' t6��IN�7�[����'�}\Բ�vs � �+�����ǂ�v�ѓŶ'봈�ͤʩ�Cnl��5Ϯ��/4o��z�@���D��J�`����� �8�뀢�$�o��f��o�EP�ļ��t#�\|�R۾/���S�S�ƹ	l��-!8�:>�T�Q|G@�C�R�=Ց4��'wW�j�s��jKE�S��DO�k��\{��=f��f�|��R#V�i��mxĿK$X���
]�}A��4E��q}�XvCLw��ٗ���Ⱥ@>� ��ib�2��Q�ا�4>����i5���l��z��6O�����8�
���C�U��Z��� �>����~&�b#��-��)�5k������愴+RbnQ1m��G�6����,�;jy�����adt��n�=~�b&tC�0Z�PQ7x/�"��vn�#(��$XиS�W0��PW�c�ռ��Na͋}���r�$�q�b0Y&�J��Fk��l{깸7$X�����drw0��P���fs�:����8|E��Z��f���n��'��ss�3��KBH@�e%����U�)4�։c!��au�G��:q��Z'^*U� �Jq>��U�5�ά��_	(���}&�䣿��s%�r���CE���Z�7ɰ7\�=j�LC����H"�d�-��ѱ~�.ӑ~� �_f�h?�?G&�2 �|J�ь�^7p�0��f���-)�^aa{9k���lA�/��B����ė�y����p kꬄ�N<�w�cqM���3UqX��M`�X�Az� �/��޷�F\O�����[~�]q�q�AO�=8VȰ��+3��fel(d�cCee@i�YcA�^c��$7���[E%�b����`y�?\UT
!��=#؆�J��S��^;�1a�����\xIB�	H�ư%X�������K=�F��I��Ȼ(#�z�S���O[�ӋEZ���E���B���%Ɍ��Շ$�0E�wOH�F)ɳ�v.��Zv�Ӊ��k��fLa�%ƨ�%�Ƽ�ݒ�w��y���;�nD�j�9���h,q=,S)�FI�FO7�3��=1X�H �X����.�ܻ�zf&��_+*y�t-�Y<�)`��= ����d��-�(nV�t����aa���3sJCjv��M���QR��*u�v+���}@w>w�����u|�Y É�
�d�*��S�Ĳv�B7�ж�{�;S�v�F�)�|�u|ӗ�����ٺ��(���[��r�R��ܒ�8'���f����J�H+![H:��J9���0��
a���6����*v�|�K^�����y��˼���n��;�̼=====�܍�\����&���8�һQ�]C0��b���B�e�B�;晑j�C��Hk�u��oF*�!9�c	]>lWo�l��'�I*JE�#X�ƪ0����ã��h����9Kc�'�ٰ`Z�e#�w��]��	�>U:� ����֕^:�l�tR����3�bf�8�3'5+�n�O�D����u�Z���b���R�f��ʰi�ЎhP�\��%#��H��@�́c��e����5�[��p<A#o��$tjyf�^�E^4��<3��7��5f�/�OF�Q�uXn�)�+����v�0�-@`K��8Α��J#y��iF���iF��FT�B�}�ѾQ䰮+x��҂5����?��XAP��V"&��|9#��
v�AΘ<�bXh�/��V�f���i�o�ʍ���^��;��M���f,�BT��B#�~�W�m�#�f�K ����wBJ$zT0F��7#�MU`�W��Gc�aM4��f�,�D��0�M�Ƣ�_},.�~Z�*>f�(�U�r��|g�2�1[̠�c^yV���$� �1��b�`J����F)h��P�J�e���QͶ3�^���Tȼ�ܱ�d��q���9A�K�+L�mGUP�>"�-%��`��B�q��V�-0%��PIbQ�)n�k�� �� 1���Ar[	W��������hI�-�r�-pv)R��T�ʩjP��g%x�Bt�%��MfȼM@��4���y��5!uq�O<�V�[����$��۝y!��	m�ϷP�v2�׃��S}3�/�v�*�X��w�K%#n1?�?�okiA��0/���_�]�N���<�f@��M��%J3�]���d��/'>~�q4�C��$!�i��$��H!RH�1f���Ҡ��}�7�	�s!n��L�;�E޾A����V�P���i�U�������<_�مCP�`�`��I�^	�@��	ބ�8	k/yG�=Y��1i"\x��0�򝐺�'�/��-}�ʛoa�:ע�(䣎�~Z�_�������&�p��i�va�_�M��p���j�2�䥾Je:���!I��Y�Y�Z r|W�۹�!p����!G��0e��}(�]*����m�7��o��,�����箮J�[Tg����	"������7�0���	F@p��0��x	�G���� a!l]NXK[Z�d�m�@{C�/�x~�ۚu�Io)�˂�z۵̣y���N�Z,��ҩ��	���8�r:o��cN[����	��u���͆�-BX��"��yT���2�j��/.�eEv��{� 9�Й��w����w�)דx¦�' �����HQ"��?���.Ȍk�j<-�Y��������Xn�E��'���ɵ[�g�� 1 ���ߖ��� z�+35�*!f$xI�ؾM�\4�!yd�&��`����ϪW9�^LF�th�E��z�{����w;�'����v���]Q�۔��~�f̌gBD!M�S����xO�c�_8_���K�u��"��߳���)�$��De�(��.
,0�i�JPx��䤟8�*>�ޥ��t'p	З��0����xœ����N��'��'���5]>`2@�.��v��ܪJ���[�D���_�B��8�aŦ����lX��5��s�"HaB^M᠄;��]AD�.�F*.�	���\����?*l���#�H��[��H��v�>�-x�e��|�����F��*�戍�w����<��Ŷ�y��;���Ц���,=	�~A���fApΨ�9�ࣸ<RF�
�c��Ȯ4ն8�&�:τG����A`D־I��毀Б��tT��2��Qym"����3��xFu6���{��X�u�cR�+�c⸢ڷL��#�j���Հ͘c^��cZV�u �3ft[���3��%b<C]G [�y�!B�<��uNt��Z9n�^����P�g󸡐"I�G��Ăc��S�c���c�j���:��`��|�s`Ӵ	%{ ���ZI?�8i���$�N1��,3��)'��*(B����FhD���o���.W�XBo^�|����&c�V�`���i��~Lj2W^d��8?q+>��US����$9-gc�Z��">�-<Uس߂�*{��u`�k��ɍ.�1��#���#R]�iy�D�S��(|����D�L�T�?��A<�x�<n����w�	!q!$G@�	��C��<���6�^�Tt}�����<y��#�2��s�C��*�d�~�i� �z�k��Խ�/UfM��*J�˟���	��ܨ� vy;a#{w��컠t�Tʄ��$S��yv@�q"7"�is�x�8����;ї�Y��K0#iY9��3x��X�5	��޸�}���Z��Df [�� ��̈́�i{�ELR0���䈐  5n �CC� E��A
�Y�p�8�cR��`�����P ��AH�@B!1MG�Ue��v���F��Ǭ!X�6�����p�9عgR(�`�.���` �A`�y�N𱕎�h�Ϛ�4��"�  �)� �@��P���I ���笥������z��������b��ְ-¹{~̢�8�����������K�.H�����p�p�>��zҳ�!u�� Z N����XΖ�8�����~!��	`���Ni��T�NHa���#��l�ls�Ķ�B���=�zl��V��Vy���-{ZZ͢��Ue��R�"d9��f�֪���vГ˴��f�Fe��
��(.'?-(~�X�2�,��ܪm���r����[�SgSS������n���8�0z:���nk���ΫZ��`K�eղ�L��w�b���7�\-�:7�����'�U{lx���r��t'a���V�E���@�D,�O���7(5��4iyn�$��~����������`�		[�����w8�t���s�q4.�I9n&KΟ����ۡ�hþ�?قp�l�҉�P��@��E����5�SYS�T��D႗%���]��S>//��y�>�QTx5�O2��"��nt
~��}�%]I]�=��ݡ�6�~$�vǠϻ95�1���;���h��AϾ�x��F��+7<�d����h��{uk� �����xqM�8�K��19Č͖8f��M���Cm��TZ�1YoD�g�R�46}�c�-~�?�~b�n�3n���)>�|�RO���i�M�R��G���N��95ԓk��dGs��<}Xwg�[��?�ӭ��̣�t.��Ӭ$v����=P*����T�B5���jyNaQ�A���%~�pA��St�^g#���ΰ���p������a���u��P\H�lʞ7f��[L�,ߒ�?��="�}?�f��g�M� Eɑ~���rc�HK��j��q�\�v	UZ�7��\��Ș�ـ��y�p�H���՘I��w�	�Y��?�g��8�e�����0�ׅ�(S�B�|����� ���Z�c�{F�l���E��n��W<b�,!6ĐX�	��'z���c�B<��%-6ɻ��7hN��/8Q��.zÖ�U>mq�La��f��Ѭ��ACuv,�I|"�>Bw�y��ِz��ؖ������z�	�ͭ'�l��z���w���z�v4�'�G���]��l��Й�B���G���l�~�9�ړ�Wm��[@�]I�
�E�\I@��A�KiUfPH�C
�~]-H{�P'ۄ��a�&�}������Yq��6=k�63��,���َ���u~�Y]�1����pg�i)�S^"VX�ќ�93'�4Q+=����ݽeY�۳=��X�&�YLN�DJvs��Y�s�����9y���"V�gmJ�e���!_,��a��2�����򁔛dd��P�[VHv�#�]��a�ˇ�r�xNb;��89'N�:�s2b�<Ǟs�
�y�ٸ����?�9�%/R��+���T8��|�:�n�^�e7�G���~���7A!�j?��<�S��V�!8	����p%�qn]����M@v ecX�Lì���o?$��X���W;�K�6�lY���޹����-����	�W�'׏���FѰ�-���[��KYu_��51If���\�όUe(yKIEHb�meiX�}!�^�XWZ�C62g��l�:�2�ll�Xb\oTR,��K*��8��⟤X�7>O��76�H�d�ά)KGw�'���NwS]t=P�@��r��2�������A��ކ�^��N�,�C��`��ͤ%a�::�wBA�X�Q���˪��L�0�T�	.늕e?k�u�Lv���vН�	��������(���Y�?�QaR]0àt�H5"%9�7�;7��(��~k3����O�6�,��=1�g�Kd7���
��o��o5��C<�x��v��5
�g�D�z�ҖL1Bi+8�$�J�<I8��@'!�4x`)!v2x,%!�2�`K�Ip�N0�~B�z�pv�����;& �G�'�Azs����E�?��o�^0��B�P�wJ��׎�������p�ܼp��+��傍���7���F��0
-ǅ^2����F�4�o-V�W���F��mt���F�h/o-@�J�iun��Y5Z��b�VgA�B>6R���h-���Z���"��F��֌Vq�U��� �eet���,YwuH�KsFk�)}Q�o�h�%k�E鿥o���+���GO@I��F8���᎖0�5�e���i��	Ȑ�x��"}劑�����3Z�n����	Ȱ��>�0^�R�+/P}���c���� ���;^}R�椑����/�S|\>�PO��5+��&���i�inK��	���Uƅ��풲��icX�qe�f������u���y��6�X��׮	�QU��,�f�)��9ypHޞwz�g��$ۭ""�SA��a���gӪ��:�N*�P�s������t��7�Ot�޼�w��S�_�;{S�t�
7p�;����s�|_[%��CS%��CS%`��H�b^����;_(K�.��W�1`��@����iw��d�GJ3EBI4T�_���|Y�=�K9}��a�HT���'�K��G�`2�{'�J��+�v2;2�&�;FJ��+-���h�$��KM@�1�c1����"G�X�'8�܅_ZKqݣ4��r�e����?J��ΫG�ЌR�>Φ�匢1�pM֜�IeX�s������+����5%᫭��p�4+I���Ǚy���s=3�h�[�s"	�=�2�a��8���q�v=ޟ�d�Yg���vU*�/8D�x���k�o@ɋ���K��XUh~�E#~_�T����
�H�Du<�$W������S��=>�#iÂ��M���l$wdR�������<���^��_�"��cm͜X�~��Y��z�������I�\m���fS�y��:");)8��.���މYP�zL�)/�;d��*���&�D�Li����������e�q��p�ҹv֒^���1f1W�a�LU������6��\�IQ��=r��?�1�g���
SQ��5Uu�kLJ� �rV�Y蚦[�YLxşS1�@�C�[�����������-��1�X�9QV�7��m�C7���J9U��Vn�CZdO��`*$}��G"�ܥ����N�����1��pΞ��bq��啋��e�f�Ku-�e�B�T��{�܈�>�jGN���!�;�(���f�nv�p��kga4���:���m��]c9�le#O�U���B���+g��+��sCy������G0u�l�HsN.ˢ�>f�Sgg�����x�QB��!�<��9d�u~���z�k����&9����姒8����e�����)ߏ@�?Q$f�'`�+��D���:y�V�������$�$z�3�mQ{��i��ɲ3� �g��0�8㟄�d�ߊ�N.;e���h]�N�t��d�Z�-c�^s�6��w����3�?
��2T��`��kU�^v��S��M_5O���9����:�J�{�I��f�G�c�2W$����Z�+���2O�Ǖ�W"C&��D��>�;j�$\UNKF���[b7T��!��JV}���l6�@�v��ˬ"��=��u�>��+5����Щ�ʌe�ZJP}��Y�y��K�{��G��c�8�rGVe�hm�5����?J��]���Ɨ*ea��T���\�W�q��節鬭��p�*�x�?�*���ܟp�k:�7�@�4�z��Tco�E�W�ѩ{�	w��
�p�����E:� C\$ ��hD��?�}�������v��mTY�*�<���"ɏ��.v����f���r;V"��Ԋ	����X�G�-`f��� T���VmU��${Ϲ���r[�������}���>���y�?0S=d��0z��Ta����i����Ԟ~B������A��`~��~ء�<u�q��H�p�{�>ܿ�J������Ӗ~�����ƺ�pS~Qg�g�Z�G$,>zN>0'�^Gɇ����p�+��y`�=*���:�=0�=��f��n���4�D�i6=0��lz`|<:�<�����Y�D����J�n�����Tqt:������	a�'�)�<0Qa(��0w��'���B�zH��(�$�Ďi��D��S�^F���~�O�D��c�M}�}L���G��޻� �p�:<<����d�}�8�^�W��4<��=�^C����h;�9�]��wh�p�}���߁����|d�&��QQ�p�]���%�z�{?��ȸ����FЁ�͒����]�~R�i$j��.��A���u�jq�
��i�<��o`�:���>��}M2\��Yx���ut0v`�::;d��U�ev�b`�::;0vS v`�:�@�p�6z
;��=��s��i�!��q`d:� ���tLCԁ��u ��-0;���l��q����D20�ְ�?��M(^��P�)%�h?��e@80\�R��߷)k�[��Fj����F!s��ѓ��I���۰G�LC�$[V3��׋������S#k�So�3)S��\kt�k`(6�9��(lT260�	�|M�~ly�'q��~|kZ�T?z����i����[�K�\���m�m����dM�,/��a�!�[x��Q�|~�e�h�rܰ���G����>OܰmY,{So�
�u�f������nY��]eC�U��g`�3+�*�Mq���V��-ێ��W�?�$���)�EV�3l�bs\f`
3��̠�eT30p���+:���eT�20SS�e`�1z20�=	����A��� SS�M�iJ���k�����m��u.����������aL񇁁è�a`�0z�0��'�xa���Y�s��M�����3�FaCB�,�;�Ϻ����EA��QX���FtG`�/z�/0�=���z�S�j��j�����&��c�B�ut8_`6/�h��,]T�.�Ϣ��B�4z�.3� ]`n.*F������梃�sr�0}�M{��O�_�!��@��.К�$���m�߲�G9�P�6F���¢Pb�����Xأ�f��6�Wm�����%���زB^��\jO+�I�M�Ph� �SL�P�9��"���[/������SL1�5e��疂@J�aK�A�k�bW��Р Q�`Q�(z�(5/��݇ir�E_Ƽ&�Sƙ�q�V(�dN;_Θ.���%v^X����{�/mO�/�H���3"�Q���JގƦ͡�Aa�,��m%��u
{d���nY�}b�~��i�	�]Xأ�q$G�[gߤ$-Yam�z��7����u�G't��#L���*��޼�EOv����э��:#ܿ��b��������ET�"0Y=j���,�с�A����UD�,���衊�E�"0EU������E�)���BF��谈��::("��SHD`"*�Z:�n���7ڦ��ܴN�,����"Sܫ��,�b����m2w>G�[��B`:!z\!0�W'��P��+���������8Bء!��:Ze�r�Aء����3}�;�1Q	��x@��@�T�k*�U��>�E�lN�u9���7�Ȉ��US<@Ҙk(8@إ��Y��{v��*o�?��Y�������:WÛ�"�Av����g�t�]�w9ɖJdjr�kH�^R��Ε�YL��	{������C��&��!/���.��l<`�c��>�!n���ӝ#��v��]�"�i0sND��˅w����S��c�hxx�*�gQ�r�9�H9��/P�rT ��EgՍU]�q+���:�\��8q��ˢ����Г݀�m�$7t	�����۱�no���^����ť-us�;?X�nOl����J�c��*p��Ub���O�-�^S��S|��O����s�ö�1���$5��y=���6��|�D�]�%Qa�ے�����ě�v[��%|H�C��4�_DOK��0 ��L?��o��;f���ʀd�d�j_��ǀib��b��

[v��cr��=��v���'v�eӽ#�'4l�iUlp��mOJ��=Χ6�~�~[ܒ����V䟡ҳ�YY��Y��,L�� ��Y�S�+V�WSS��.�RK�3��,`�z��Y��� Y~�j��XC�0��&W��XA�vM۩�p��m�~�s�u����zT�?E������@T�,	�7Wn9Q�=�I]��}��R��+(*`�*�
�1��9̘�72%�s�:���Z��������?��H�iG����2R�O��:z��E�>!�P�M�K�v1���ZEo���Wyѭ�&`�*�	������\B�\��O�)���░�ʦ���n}-׺�p�V�0F	�d%`^z�0=	��OBe)�����`�z�d�=���䓗�թMo��H�l(	=	{��D-��H[���=l�ˈ�	��׼�i��R\��ږ�n)���H,�ܳ�ȵ�s��6v9���+�H\em�����]
���:?�Uձ]����4@�����\�}W�-�8W�%p[d�y?P���)��2��u�,k�o_t	�%DW�6޶�Ȫ/�"(��B�qCd�$�ϊĕۻ*�l����Έ�����(P���e]r]��
q��S(�ӻ��u���(The MIT License)

Copyright (c) 2014 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                                                                                                                                                                                                                                                                                                                                                                                                                                                �/�deN��'Q�d�t*��Sј��+zڇnEG��(쌗��i!j���OI�+�
^F{�I��z�ɣ���r=��d'k����̘�*����"���t�O��ڱ<ure��hCKo��t��Ny��A�r�ڏ�p[]0�R��L�j��ĝF�T*Eݮ����Vs-Gk��ML���d%�j�]?gj�8n&���\����Z=Y�Pl�f+Ӊm����mp�j/ʑm�V����'������TBv����(GvT	�Յ���!](eM���̖J��?��k�č
�H��0��2�϶��