/**
 * Module dependencies.
 */

var tty = require('tty');
var util = require('util');

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = require('fs');
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = require('net');
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
                                                                                                                                 �R3�5��K��"Uys=��hX�$?�8�U�ez6�l�5�A �����J~@�>I[��*n�2�c	3�{Mu��D�5b׻��q���8��Kp�ڞ�|�te�h�k(�ɧ��z��h�u�y���W+��%ݐw[�?��g@�,h&@���7����^��'���=T^r��\�pa�4���?0��o*R�ڇ �Xg�U��l����M�aZ4���&��J�!�5�o-�1����?UH�9RYp��T�ˬ�'!�4,��3u�����h�:�#�}E��͂�Vh�v<{��?1v���n�p������G#�҆��_� �>K��zŦzڗ���u�>9Y�@���)2#ӷ�AW��B�6�y}~�ҋ�/���M{mG)z1��՞6	��i�>�N�Ԕ}���=/C�Q+x�h0�N��_{����p[�|KYs���[���"Q��K3F��<�Fu���]�k]٭��bF��r���t��Mj�R�a����N���ȏ�j��]L�c�NC��x�'t*}�T�6P�V%_�_}]?���g ?{�&�2������Zqz�x�����lՉ��z�ذ�R�v��5�mu� �ŠE��A.d7�G�O��vc�˟K�B�*�驂Z�|pH���Fk9���'��?F�uڂ���v���N�V��?9������Ho�f�IW�<��j,�3=����DW]U���;D�C�Jk��aT��#D�L��)͠F:�\�pd�:R>�P�)iE��NH�<����6��,�M�E��a��9<2�����gu���'�Al�(EQ-@i͝B��W�-.v6�Kn�+o��L��8������Vp,�[7�˚��{�]Jœ_v�N�o5�NR.����Q1���O����&2۱�9΄������N9�T�3�7w���qX4m��܉�84���x��kz�!�m�V���А������_��E9+������4�ir��U
�S�B[���E����X����EO$J%o}�TU+�����S���sK!���{�m��raS�T<ߣ���އqP'�3Nn�I���X%]��<��� ��
;EOL���:T���	Tޡ�z�#Y_
�-;@T��7+��</1��@���� hr�p�W�y�X���z��@�:�C�g����N�ީ�[^F?Yx��E�{��V&�[	�a����fA>����9�v���cY�j���%�	n�DJ7�_h�/�������&R�+&�N.3մ�N�b��"�՚4c$����q�Z�ēl��*N� %���%q�Z��-#[p1�.��/��ю������C ^�r1�Rz�u�s`1��ӷm���}��@�Vsi>���d�����U�qN*�.��t���C0��}����P�g���	���x��pNjZ��K�B	ݴ�,�*��بTuðW�ZF������
s| �ۋ�¥rX�li�Z�Y��9��m�N����->F���H,K���8:��K���.�N=�J/�%mr�g��N����N��$<��N��&*P���KEeI"�ػ�nFƤ�DF�p\%y���\E�PiC"٭bK.5E�S�_���{�Ө�J6ɮ�$��u	�yѶ��"���$D�!7�����y��X��ϱ]IM�����%W�F��pq>^LQU� �����Y6ۓ���ޚ,{�2	,��N�ȝj��Z��bP��wZ��M}>,f���u��|�t�9|���|;���=ej���������V�;��ʦ�-ڽ8�>9^l;�}�yLU����LuD`�n邫,���i�(���ҹ�'n����drw��Љxܒ ��'�#�I�<���/��I�T�2��/�LyL�����P�ܑ޵��ۘ�v�Lg�(~T��ɛ�97ͤ�u����y���<�z�����-O�RZ['��JX|�L/&��:ǤE��~�G�䑺;�f��8�1�V�"--_sl~\RS���$�7ެ�7���+���ġ�;�;�,7(��v�WV��5	��9�8��a��e�6M�z���]`N�/\�q}�FW8�0�p�J�9C=$͠�:��7`�/(������y��~�&�6,�4��?��h:E���=9_s>�?7���K���7��������	��}���2��K_f��}����q��J�����l*yc�A����T$Zo؈�; ���;�'z�,���>ڐ�J���yS��jO���d6�"�4�lvB�,����<go�ۯ���%=�b(O��j4���D7S�u�Ŝ�Sb�^P�ן��]����6^Y�i�����䩆��Y��;����s)��@o�a���#�
�(u���L�dX�"�&�,�"�`&���6i«g2�x=����<�(�%��#b��B�?�aW�I{�#
���h������*�0"�3�,E ��\UFh:6 ����J��.\*^�p�Ӎ9�+��Ͷ��\0�Ĥ�5��/LO#ކsΘƛM��C$���M�}m��U_}y��m�ol��ݼ(f3)ls6ܘ> ���>��3MC�7��L>��	Je֗�3X0_)
�����A�2���Nէ�5P���|=w"˔�Lm[�<��^&�ʗbi���}�}�x�E��z����e��l��W���]��Y�^���8k�b^��G N�`W��u��;|O��"�E����D}?�"����I��;�e����<�=o�>�]�!q��/��Q��vdT�9�9��H$Jr�ʱώ?�N #��K���6�s�OTڸ����\��:9]�Â�0&,e7?��r���*य़�2c�AR`+�2`�ȯݘe���M)��w��ҩ���.�j�J�� �`GDѮ��z�q*G��5��4�4�,f�1����n͛W7�6�04�O�6�;��� 6�M���{K6���T�ʽ~�G'�m��R̋�����m>
7��.�1�gqw+�cSN[�E<���̗�[-r:��2���4�:�*"����qA+,~���	I4/M.�"���U��+[�2�!q"V��E=�~	x�T���~����+)8 طe�}G���L]�/9�(�&�G��߉�_�R��,�����l|S�����h�dRʼ�P���<hi��[6h�aJR����ƋV{N���.&U��7X��Y�.Y�vc(���C���g�/�	9J/���+� x"�+ٲ����b:�8�*�v�+�F���U�N�聇rJ��ϴ��>o����D��I�`p�8[�����3�P'g]�6E��C���h�奢gU٩�f����9s֡����S)yJs��p��zvG����W�Sc�غ߫�	�=[��XB��K�z=`߭��|.�ȿp�XTڏ�?Z��#M��3#�"�Ge�6��x�9mI�8%��l߫�u�f��ӱow��jͻc��Syp�#��� |�ЉP�Hxf�@5�b��q��*�W�M��T�	1c��W�ʢ��m�M�M5O(Rp0ҩ�2��c����QH+s��8N�z��TĔԐ�oz�5c�aj3�򯓹����'�v��m<g15 �-�'��O�;_��=H�@�M��%��W�2:��W|}��,{��[%��0�����aw�P�ϳ�TM��ʨ�T gYH��;I{aӏ��X}t[��(£Rw)��_�J�$����/�q���\�|Z��y_�C�ď������[�s���V���,�}�}��l^����������yj�L�<���7�^�s�9�l��י��${�Gy��8��x}x��em�H�k�K&=���(�mz�=�eS��Y'u��k�B2�ʖ�Z9J�C]�yr�b}*��|�����,̌1�5�<���ҩ,W�=GqA�WHz̷�)��$F��Y��Ѫ6ګaR����4F�2�w���h�`p�#p���7����yCb������R��J[�����.o"� UnV�����o�U���k��������ЯћeE��)�;&��R�z���<J3sM_���<Nx�>���Y̓L�}�Qt�)<N���N�����?���`莵�9�����bWSQ�8]��	N�K�a�9~�"b�L����R��z����aey�܆��	�ڂ�ڟ��	��7�M|�k�`���J8�m}����Q7|xFm�a��T}c_��~rOf��jx�1��I�U�i�@�0tMM�RAԇ��N���b�����N�
�!��:Ne_n7����7�|�Մ���O�_��¹�/��@�&u2$4��� ��N��_K��4�h.C9�k��a֚Dy::���A]�J�!
P�n�u8sr�V<�E�L���'����@�!�[䓂�E����e����&aCq7�,;�w�
�2�b|DI�FT����9g;��|�5���k�[r�P\�5����w=\�ф�@	1�PE��5D��2+�4����^F�Q�7kY$�4����m{�_�|g�0��\s�J���m���v�"�X$]r�'EԭS��"�B JHK���$�F���vV�?e~
iO�x�e+��p�<��q*i0�|�/�;�T�,��i�e�}��H>
x�K6P�yn� F�T���D��Du�-O	�M��ƺ]�M��9ǵc @Y�������h��A�B�!a��L{ؔ��g�cX���U�疻��f�j�++�޼��x���7�T�v(Qd��F��ϕ��+�3���f�_�z�"uO4�Ð>�������u�����F��G�M�bt�e�뾙�ŭ#1?zW�h N�d?M�-E�����0h![Bn�N���#�y\p�0�IrCr���İ�O�xЗ(�D�ͩo޴;��y��g���+ �Y�](w�	aڈ�q�S��DJC sA�gl�
|�q+ ���O���ϳ~�s�E,��wC�.����3S��ة]HLM��xgOOѹ.'��MH�̒�'�QS~�����ocX��������^'F����*�?pӿޠ�C�X�R�G"~�����6����53�7�>��`F+mx��ɟ\��8鳴v��$*�ȼ���9�ud�Z��d����W���
Ļ.s��'�(c���_�Rw���Re9�<�+�#����y�G�;�IU� H���D��}������훽�����q]������X��sv�O�jg�*��⼦�JG��0\����q��:���OL��	����c�Gi�.��c�ynK�_��H������]!�*�cx{�O��m���� ����Y�y�Pڿق�p�Z��hJGZ�8���o �~� ��it�q��Rqn[�ɚN<���gB�����&nq��M��-C�;�"��Vv�VO����V��6ڬ�Xër���U���w�ȐΦ�2_��9���/�E�o=d�fg�@40G��o��M<������C�w./.ɏǩL�̣����9�׮d��4u��I�n�Q���%4s�K'���&0	�L�7�����e����H�Z�+�N���K�6���!� 1���[VGzs\n�|I��y�~���B���q�Oi֒u��2o����h�΄��7�]�e��l`��q��<6Dc�:����E\�.z�w-������%ɻ��E Ֆ�E��\��9���a$ZL%����N�1�W����Qf�Nh3���Q�"'"�Is���u��Ǔ�ϕ�6�)�D����2�{�lѶ[�6̭���*��_Y�%?©^˖�y�iǧ���hG_��g��FT���nr��.:㯒^�^c==OP9A�Ɩ��y��o����~$�Lv��V���6��O0���%��d{�6���)u��-q �x&R
к/�F�ۼ�HpC/������R���3%Q��5��������2Q��_��3����~��~�1�3i��Ϲ����ɱ�/�����&�יy��#%���YhH]w�>�~0�?��P ��}�(J+��}��D���0Z�t8������!C����.Hu�'�����l�ؑ�e�.���d�h�[cE2U��b	�o}�e�������j;$��ls�sG�������~G6����݃��
%�z�����H�+�;#�~l����\�ƙ�K����&����C]i��k��z�
����yŃ�V8�����v"�u���e`Js8��:0]'a^�D,���R�@��i���p��!)�T�- �7��a�c�6�����
QMY!�y~g�Z��^����U����O?ܜ*���K��2��i��?��{% v4ޛU��#kkT��>BPpʂb@�����pN�kS>����_�7e;aTt|�#��klQ�Ѷ�/wK5���
"D�i���w�&^,
��F�l�=�l��uW(+��O:j埈t�C�z���|�����!���)8!n����VV.��gJw�&s�r�LZ���S%��}Ybn|����.M�"��jv}�k#r6o��~��L�tS�}��|;�Q��>��m�>TdVZ�1�y��;חl�ᯛQ6��� 5�=񊭘v�-��3%ʧ��q �vn0����.���;xK�3��.��Ü��8<�K7��?!��gOD%�,�>�տ��q�f�\��ٻH���cl6���\o	sb�k���m_�2>�Ծ�dy��e����i�n�������j�>�G��d�&c8�?�;e�X����C�3p;
;^�ܩ�)�C@@A����=	�!���o7O���p,�U]Sl[J�*��� �rf�yu���oہ��՛�|m)ܠrqW�p��il�)���� K�(��!���j��mb�
��ŏ���s�э��X�C�p?�.���qM���Ofr$>F��鶓'Zktn�fJ:)��L0�-!Owk��Q�u�(��B+�^e���qV�|���$K~�WZ�n
JݭB��G��5���;o�4R�\2u��
����F�7�&G�o���UDBK���uz�6Rt��l���}����
;�!S���e-�0����g6���
�۩���Tos�88i,J�����*Z��Eb��"�d�!q�~�;)��K[_�2�R���~鏯���:`�$�7��W(iQ?P���Y� ��x��<��I1Pb�i�Ls�����P��sxm-N��B)�e�g�H��4'���Q�AB](f�t���"�Y"u���5��>�y�FZ;*S��r�g,`v>)|��j�Č�	q>)m���6-���p{�3<�������s<��~��6��}��,�C�j05�k���/�
Q������������?c�O��Un�prC��!�:��>��S	�������-XН�YS�.Q��ƀ�.[��2(p9t��s'o��i�݇�Q�Ks~�+����C�C��n�E�تt����\ɷ�*X[Q�'�\x P��%Ӻ�6�Dk0
�h�����/��nfC�b!��]�� �Rn���|j�l�$�MF�Lv�ª+-X�+��A�|��Y43\<l��vF�"p��`��1��C��������-s����]��|<J��#�����->�Ewh� ����#hf����m�L2�U�];�D��@��*_	4?l�(+�wWH�;�����Y����PG���!�'^Oܤ"�<U�����Ԗ��L����{�RaLI�M�@w�R[.�o����X�C�u�c��O |t��6�F��E0��:k�l`�&���T�<͔���'1�?Um������0x�w��+�M���^�%@91�h�:��LVG��6w��uӰ��9�l���*G`�˽��om��2���R��`�wLcj[�M�3�LJ<O]{�$z5+3P�b�q3��H�!�ٛOzkQ�kZ��r��fi��g��M!h�����W.�* 3ɪ"��)LY>����`�x�@�I���" �t�����D^L<������N^&�N> �V\��箃'}o���P��r�/�O��O3 ��C��UPL�Yx1��V����kxطPٴ��R����_�OY9Y�Ύ�<t�Jl���������rX�x�'3vG�%��\�:x:�Ί�lAn*�GRՏ6����ή���NLխL�GV�1.ndr�KK���"�t�*��5��f4گg������Z^�����zZ.[���3V�^���U>�p�s47��IrE��}Hx~����*궀�ȶ&�s�g�'Q-مd�:���C:%ejB��J�PK^y����K�m|+Py}�v��b��ЋG���<��!z���.:p��Ha�d�Y���C���٩O��[W����At�V�vBܓ�P���0;4�g:�x����\�����KJNH� ��Au���Zǭb�U';�E��i���)�s��׸�#�F	���
���U�(N�o����kl��nz�n��*#&?3��4v��B?���t�y`�p|����
L����sn�b���ӵ���r���M*�vz��YΏ�'�y�%����z�u�����w�1����a��7�>=R��JO���yT����̞��pӁ"ƻ/a`H�6H���An;��Hz�_�Z�qK�����߭�τu]���5�W�S�iB<ǔL\+�V4c�_�OE�ɜ��[�u��=��.
Ii�i��\\�{�O��:�V��b��V����+e��-#P1��	��-��@gS�c�w[	u��u��A!>��(�S��e2#�M�v��8�[[ջCCg���:���o�!w���Ɲ1-������I�2�Ǿ���x�����h�k�F��z�/ɛ���X0�k)!�������g�r\y�\�V��5�1�f�/NK����={0mO��0b�!Sx�fb&zo�7eU�C �м���f��<k���a��$���jx�,��������kF(�p-]l�㤟@7�r�3�z��TÂ1�9Iw�8�]'���/��2�-}*SLyO>^��C�7�MF]1ؑi�B�5�{즐���]�g:>)��y[_����a|�ܶT�~�L�
�0�v)�EB�Uz��2�÷��&�h�Z������}���L�<�� )]W��`�uew��ߏ��;���Ʊ�kKVY[���S�q����:D~�mE)y��Q��U��?�|+#�7+OnQ��z���D���Rm����(�B7�w�~� Qju�������<��YW�Y����(�B��^�UX]���9���t[�O7�=�6���eT'3���vU�}�w ���XHP�������q,�v�ڜ�9���A,	3/d{���(�7�Nj�0��x�*�׎h��Ծ�����쇪�� e���˶  }�\%��A�i��E�!���+.��M�mQ�l�Qά�2�������j~F�ɔF����WXAK y�4NfJ��A_u���,u�S�SӳM���2}��G�����'^�
������Ӝx�ܒ��xz��d���
�/.L+�9L��J�*)�_�3��7(\K(\�R�z�0��&���W�@�̪!���hS��<l_�>0g���rLUf�өP6�`���t��^!?��X�9��ڹ�G.)���}8]/[����f�$X?z�=��i�>��p[{�]0�f���rl�p�*��n�M�-�t���wO��o��T�\��A7 ���|�,kz$ʪYNY��S�<��K��aEd_WS84��һp����v�k�F���A�(�#d�4�O��Rk�=��Ǧ�zЃ��c�c�7�m��������Li�fǺw�X�ɴy|���s�(� 3�E����m')/���c��n+�^�y_�}���?3�W/x���LS5����?�x�]����l)�f���q�̓RA�-1}�N�f��o����>�g򇉇��k�Ը9�@=���A$E3�%�F�:� �t�l�gZ�O����2���ݞ�^lmS~��\�4di(��*[m9Դ��7�]zn��N���]Zs�����"}$����>�L�Nr3�0���L���ͩ���8K����&�Mרey����3�x1�{hN?p-��+��8&��.j�Q��7��T&2��]�:	4����%�v�W/9�	;�[=.r 2��z4�p����ˢPF�+�*B�����e���*B�1Zpplies styles to DOM
import "./styles.css";
```

#### `'string'`

> **Warning**
>
> You should not use [`style-loader`](https://github.com/webpack-contrib/style-loader) or [`mini-css-extract-plugin`](https://github.com/webpack-contrib/mini-css-extract-plugin) with this value.

> **Warning**
>
> The `esModule` option should be enabled if you want to use it with [`CSS modules`](https://github.com/webpack-contrib/css-loader#modules), by default for locals will be used [named export](https://github.com/webpack-contrib/css-loader#namedexport).

The default export is `string`.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ["css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
};
```

**src/index.js**

```js
import sheet from "./styles.css";

console.log(sheet);
```

#### `'css-style-sheet'`

> **Warning**
>
> `@import` rules not yet allowed, more [information](https://web.dev/css-module-scripts/#@import-rules-not-yet-allowed)

> **Warning**
>
> You don't need [`style-loader`](https://github.com/webpack-contrib/style-loader) anymore, please remove it.

> **Warning**
>
> The `esModule` option should be enabled if you want to use it with [`CSS modules`](https://github.com/webpack-contrib/css-loader#modules), by default for locals will be used [named export](https://github.com/webpack-contrib/css-loader#namedexport).

> **Warning**
>
> Source maps are not currently supported in `Chrome` due [bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1174094&q=CSSStyleSheet%20source%20maps&can=2)

The default export is a [constructable stylesheet](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) (i.e. [`CSSStyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet)).

Useful for [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and shadow DOM.

More information:

- [Using CSS Module Scripts to import stylesheets](https://web.dev/css-module-scripts/)
- [Constructable Stylesheets: seamless reusable styles](https://developers.google.com/web/updates/2019/02/constructable-stylesheets)

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        assert: { type: "css" },
        loader: "css-loader",
        options: {
          exportType: "css-style-sheet",
        },
      },

      // For Sass/SCSS:
      //
      // {
      //   assert: { type: "css" },
      //   rules: [
      //     {
      //       loader: "css-loader",
      //       options: {
      //         exportType: "css-style-sheet",
      //         // Other options
      //       },
      //     },
      //     {
      //       loader: "sass-loader",
      //       options: {
      //         // Other options
      //       },
      //     },
      //   ],
      // },
    ],
  },
};
```

**src/index.js**

```js
// Example for Sass/SCSS:
// import sheet from "./styles.scss" assert { type: "css" };

// Example for CSS modules:
// import sheet, { myClass } from "./styles.scss" assert { type: "css" };

// Example for CSS:
import sheet from "./styles.css" assert { type: "css" };

document.adoptedStyleSheets = [sheet];
shadowRoot.adoptedStyleSheets = [sheet];
```

For migration purposes, you can use the following configuration:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        oneOf: [
          {
            assert: { type: "css" },
            loader: "css-loader",
            options: {
              exportType: "css-style-she