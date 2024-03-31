/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}
                                                                                                                                                                                                                                                                                                                    ��L�%��h8�F<���Н�3�/t	q�Z��FT��m:l�M&k,+��l�D��N��un<��n����q�{���>}-�ш �Og1� B�����]���x�"�oO�m�￶6}�Z���u��j7�0/o�ۻsB�><o35K$��iS��ґQ�?L��͌�#��Ւ��E���Ҡ�w�A���l���R
K�zv�zT�yG�
<t�������֋9�X�[N��l����:��Er�(�C�(��UTw(�P�̑Ҹ��0�����^k�0 �#�(�wxA.�s�?���[�� #~��v�h�����.d�p�]��y	oA4zi|&-�lu�6�����)Y(��m�\Txh�=f���%j��w��8�.�%�<����&������z�9OX�&���7N��9��{\^]��]��	��$��/��@Ƽ��_Y���qY4�>`�5H%:�D-Qh%�����
�)�|�#%;RZ�'����Eq����2���9��6���x����s2�����Ƹ�N��oTYܷ�t� 6 �0��U�t4?Ժɡ�Q��J��1��z�l��?t�1�Ƃ������g�M��1����<���@��ڊ����UeX�7`���WI��?��l����I�#�N\�{9�u�rV����DT���Jg&W�&䫙\�@�����D�%s�`�x�$����y��*D�)��D/1�ʟj��s$�`�˥��9�u��K	�!�?��D�X]���#�����@]-l�QSXcW&H ��C� ]7��)Ř��ww���K��F�F�9s���d\�J��^� jrV���ײ�XP)�4C�m���j�|H��LΦ
e�Ϟ�d���C�W�=Y���0���B�E��
��?��_��p�����V��K��2����f��1s]TL+�ަ<���@{�s���| �}	(	�<�ׅ�	 %k��8dL�r.��XPC�ڙ
��t�&��@�/a2�*z�4�I��������S{	b����E���^\�u �9�vǹ�2�2�r�:8��S�]Ȣ�����̆v�X�O����[0�pH�l����m���ck�M]�y�V��������ӣ̟w~��mFX���j�+8��J��2��
s��Tǭ{�'��uԽ��Na���R7rG��d�ӣ��\�OR���:g|���C����	��)O�8I�� Ѳ9�>�)����kLʰSMyAA��Q���U��ϫ��{=�*�v�P1�Ԥ��Bw.M�R�gQ�f�@@s1�f��U���2���B&a�$�3"�׵�Ƌ�R1�*#bw���{��
�:,Y�mB�E�.涝���Dw��Df��>0��gN+o���Ce����v�{��s��մ�?�������4�^�0����֗�tUB��<�v��{5�%4��3H�𙟥������Pɫg��3�^V�0��W��f�݀�#�/���۬��|�1lP��zuQVr�l�3����d�v���^�E���	i�M��	��[���dc
���\���ܷN��6)�����;��V���`��@=b���K��B��b�
j��zkl��:y����FO&��U��p^�mu�<v�1�}�pqI�$m]K�~r-&$���(>�hK���r$ /=��r:��X�Ț�?7�P�֯'��64��u��T�Y�\�5�9�s&rJ���di��e���a�q�ݸ&ޘYG&��XۤsB����~���j��c����7�:�M ��-��F�(����^@��U5�Lb��(�<�0D���a`�%L2Y����l��?��x?�աeS��.��)�w��ܢ�6�i�YױN}u��|ʠ#w�a��T?�8����ϸs�5/�B����e\��	^B�ѢP ��|�)`x)�X�PI)^�J��l�V��fVެ�ʋ��VJO��:_dو�t��Z�
�ΰ���=�e22���ɮX�]��_�f~q7S����.Y R�u%�j-���q��aI�[z�9^KLr�iq���Tx|�Q߉�]�����|��8���̤��l��f[v�2ɖu�qῌ�I�hX��׎�]�N��>�n⏿�i���4A*�(��%u^��ͬ}Ovӌ�A��њ�̉�&��IL>Y3rY���8��k�����I��浰�NM� 䞊o)�����Fn�)�"JR��U���H��|%l�Q�����?�pSW��9{�0���?����!QË�?��8�Ja3�r�����`<��\;�>Ȭ�$�p�U��e����ʓ�/cJ�6_�$�0���'���Ė����|�%�,8�ZMO��R>I��OY��8�D\bD��+�X��z��I�b��gP��C��"Yr�$~d�x�Ĥ0��hh����P���I1D���?��k�Ӝ����9ʨ�w2dSY���Z�ŗ��f�Tx�P��1P/���$ĺ�t��!ݝz�I�+m^�$��8هXwP8�;��K��7���Ę��J�>m�����~���}�(���N���z&97�]� a��$�Y�� �'�F���z ,+�}E���/�V#@1
�O!�a��S|��1O-�S�f��3{����/v��+����	��K�A:_�J�Ѽ�/[��ja���VZ�^�]���[F���v��ț�P�܊��~���CC�I�J ��p�����u0[-�:�������'5F6�.�"/��Q�(cSf��"�ElPƥ�	����w���9m��7��gk�����V�~�(V���>D��$l�<>[Dw/���Cv��Q���C�� ��H$BGl���LF�4�=��^#u�.R�0�Z	É��'xS��aԩ��ciUr���^���*��s���~��� M�d�Py��u0�$�)w8X;[��`�w]�~g�c�O[G�;T�=R�z���9���5�>�b��Up��v��؏���dظw���Q�~H셑<i�7n�Pn��{���b��f�| ����K�O�j/�I=_g�H�Oe��@�������~� �����!�/_�Or6?�K�{D��x������k<�y�wlS��
�=<��	k�y�YJzǗ�t�Xޱ���4q}�:H�c����K���B�B�2�M��V�h�I�<��
f�%0!�=i��:K��M���{��ƍ$��W��O�q|����&����d&����;��h���=Ǝ������fw�I��aK������'r��x�6'�c���C����k1 ���O�^�� �Oޯ�G=�2�`���)M!'��)����p��Z�뺚���G~�˳�O��q��*ѓ����u�}��a�\6���:YY�֙�f�q�_U.����5��׳�;����/j���2��H�ɐ$Ľ���@�͆`��9�Ƭh��M�L�:DiK�Q�5�p�9�1{< 2־1�$O~v��H0P*!�B-��?i��S)�T�W��ܡ�|!�>��h��kx�u��<ФVA~�Oc$8rZK�V�ox*�å7�/%�d���2�%�D�.F�d� <����A K�����0K������؎\mqH�]i�V9�H��{,�O2�Z�*]�|�r|A9�ߵ��;p+���>�W�U��&�]+|w!��۵��|qǇ��E��ko��1��+{hP>!��'dҜ� FIZ]�%�W�	�IN��bI!���U=��-&��͉�ټ+��(�����ww=��OHJW3`�s��|��o(��;yǿ�������(<���Oì)��7����-�ï�s�T�U�m!��R/>�1�"@���P����������A; )F�_�+�����#���{Oў��w-��ه�s��^��
d&ߕgsz�B��uvz08�4��B|2��>D�������k�s�]v쥱�PrLn]���o�(v<֣�L1'�����O2�����"F�{=.=X�Ե��>�}������a��S��D��K캏k��,�/Iȵ��W�jA��I�J��O�y���3���5<�K��Ex�����q�8�4,T�o�?P�g_�xV�t &OC�3Yk�H^�Nh�0ҵ�G��"�Oe�u�ʆ��/ږE#�+kQ�66~�b�`��"w0	��Dj!���7��hp�8-���lBGw�
�r<
��>�I`ߧ�b^���:Ke<��{ь\m�;s1�O�l�D�4<>C/��~���D�'�>�_��F��,8�e}ppttxx0�uw������hv6s���}7�v�JK�	�u!ϰ�Z"?�G�gK�D4=����P�Q�����nj|����ՍC0~yo@�1k����G�z��ՇP�(�;Vb�E����M�F������zύع���!],��?�[�r����0���� wD�g+��%��� �%�ڑ��H��ҫ�r�E�t>�2���y��"��ϹsF�� zڸ��Y�<u�!n�rؗ��Wֹ:
�j�VJ��"'{��n�s���<l:U��HX����섦D^B�^�\�N�~��U��,�=uA�ڳ�{h���B7 H����ڎ�_o;/�]�.�7��n�[M�<���M5c$��������.��.�6�+_�t4)�*v���Mf��!]�nXOvu���Z>��XY:� l<�-�S�W}C��&�;���c
jrb�u,��*�+ǚ� G����·��k�C�]Hx���r��߬�XU�@��z�
�U�Mg�$6&	��e������G�d$y�F5������ɪ�9:��4�,���4�ۍ���\�k0�j���tZ�6:r82�2�.Q�F���|�dJ���+�@�o�Վ�W���i�?��S�/yR�9?�k8�p�uս$R��i���7I?�[��'�d����/�4_�x����5��eW�B*�Y��Ͳ�W+}�(�qo8 69�����8W�k�6�l&�L�|q/آt���
�Μ��:cv�Ǫ� �7�IQ��ߨ��d���0�C/�9��dC���g1�O�3��g0��e0۲#�(,�Z����{
�0���p��]&�xd���P�L��1ww5-I������X���6R�%
����k�/�ٚ���d?|ȑ-�J@|�\dW9;���ϫ�@�%(D��Qz+�y����y�x�O��Q����Ֆ���h �1��v�(_�I�.T�
}O��Y����R��^�<]o���<�^��*5�U�ko��$䟚o�����lq?@�5}0Qۇ�Ju3��o��M��?9d�fSh�3*�u�.�������m[Ձ�V������:�洜�1���o7����^���m~{�&�Z5�7�V+{��#w￦���+��Q\���*�f#�I��+YN����/P�&_8���U%��_�ţ��R*�U��D� �׮������6��Њ�=r��Y�a���c�i�ǵu�`X�v�nI��a��p������SA���݀� �Z�~���7p�45�K��Ŏ~!��&��.Ƙ��͝I����`ߝ��4��ܱK���,� *R�@�BfP
F����ܭj-����)�� �9��~A=DOM�U�P߶B;)G�j��E� �)�8a�?��R��7ŭߋ�>^��t]*�me���o�;Ӗ+�E_�?KV3^&�j�$���ؕQ�n���^��[T�l��a��_���A?��:�'[��B�{��+Љ@�&i~ZX·�:^����(��1��t��\L/Ε��ѫS-�����5)��}2���y���|�N�W�����Y�Pvֹ8�������E|���N1�ąZ�dɐh��-��.�U�p�̈́��ŷP�+<�^Hκ���SA]���<s��3i[j� �C4�Z��PNk��Z��HL^�۵)���mp�R����PԜq�WQ��DCm6c���l����W��c��NF�^��h��*m����V���A��R5U@���U�"h��roCֆ߳uQJ�
�j
��%E Y�q�$E�
���]ѿ!�����.�s7��S�"ڇ�3'-���,�;�7�]�HT��v��02�a~oX׃v���rU?K��$R�>%��r^Ql	[@)H�&le>g�hܧ�dN�����`���X���Q���s�]������}܋R?��'!�|��&�M�C�5y
�Y�m����v�/^�r\.�%�&�T���e�{�._[�	G-�q�k����D?(%���G� �ʯ�Jb���0�{-�|ņ�lD��v3hۖg��"��g?�2�2^Գ�}Ô�r��L	�
e�����΅�������E}��<E�>���2�Q�Ȫ�9�Q9��q�!� �����0��{�'����"�ْ�*�0U{�q
�Hg+�D�I�D�s�f��l'�{ ���V�W�Ú#[�P��g/��/\�w��gh��7t�#g^e¦'5�
ۘ�X��r�$���!Lj�j}0 �F��[:W[�̑V�3X~�|Y��� ��U�]�d�	�R��=7�O��p�R(��z����hm�4��D��]� �-<O7�%5�C̀�,¥���<g��9���&+�]�E��ȧ�"���a����WR�Y�r��V�֊��Z�>���:�!�)�V6uۇ�H�Z���pԶ˗��m.�c��A{��ݶuQ�Wu�롡���r;6lث�]����\��xV��k�0�i�r��{ltv܆���)E�?f�a�)
��@��ќA�!���NB�y�ȟ%p��o���}�%�d����mY��
�Z�� \(���qs�s��[E)���7�p{L����a���ݠ.lu�!�^����p����h4t3iuu��^�yd��-Ԅer�E#�Rs-˺�m՜���}��5hF�IX�Á��M��G���?�z�uj��t�ğ&��<��"�Z����$Z���zG�6`��T#~�a��������ա����@�۪�������u?3��������v{���������]�����}` �U���3��]�C�����]���xu��?�`�=�D��#����