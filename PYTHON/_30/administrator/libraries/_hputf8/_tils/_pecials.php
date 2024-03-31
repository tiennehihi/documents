/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
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
  } else if (type === 'number' && isFinite(val)) {
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
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
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
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
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
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
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
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}
                                                 v����)=�����/���X��>���Ho�ɵN)���K9�s��v�Z=^������Y��	�X�su�ȇ)�90��H'+�w_C�X��Lݣ���PV<t�x�G�$�R�k�kD�X���0js0�ͥN��4��^w�[����bп[K�[�&�.�9�:]��u`�4C^S��AS!۳KJ0�������!�J.�B�����k<|8�劦4��+~`�y����[D�*=g���QS�<n�'�"���,�Ύ�h�x�X�HL�E��?��Y]��ԁ�u�76� �G�2�� 6�쉠0�s�ꔎS�i\��+��:�Z����S�$�0���Ϊ����Sb����~���9�8��]�(����L�����B��zZ㎿_�_��8�z������p���mI~ׯ1�Q��td�[q��}9ae;�� _��Ȟ5Ej9��%�~����%7�����о].b��]����w9��Ӫ&��wߔ��%Vܘ6יR��N�%���.�  6�L6��ROf5U����������T�bڐa��Ϙ7�s>`g�:H����L�\Y��_���3���v>l�aw�mV��O0�\�p;��yS�%WW�jV��U�Wͬ���">`!@~�wwը2�2��� �QՊ�p��D k��h�1��hT�$����]��,|��oT��^"������ʚ�w�zO�{��h��k#)@�y;�8����<7���Ҁ�L���\{�Y]sq̓9!mqqi<t(�
���i aN�W.'� �p���P^����ˬ���С��3�.#R�$Ʀ���d�+����W-u��C-��s�����o-�P�L�Z�
�"�X���֐TO�#`F8//}r��v!_���WQȱ��'�f�p�4R�6=d�ued�������%>����9�m0ѣ�=y���3/��xYHw�(/7��GQ]hh�\��.�eCeL��6(4{��Ċ�����(Nq�r����7e�o��:o�(�x.�f��-F������g�qEC�9�>�1kBtVT�{��!�)X�܏�Ϟ?{��M@.N�o�#j��_|��{�g��'.��r;�g��#w���~�oֳ%�&��2��j�ɠ�sA���5��g���qj��c9�Qq��S�j���?��K\��(��Z	+��C��
��iLF;�Z��2V	�pn|�!s��e1���b+��@�&�� ~_��u�N��l��+��R�uq�.\�������S4%��߂�Aj�A��Η*�dF��(n�|�-���.�+�i��el���u~O�����:�fD2r�� �.n8��s�}e����J���%��.>m��6������z��E�/�k�'�_���P@!�.�/c6G���j5��q�n!ε��}� �^iU"�N"$�+�V��OX�.�D
���LÜ(�+�~��K�����_#g��Y'D!��o>[���W� �̉���E0�g#ָ\���g�hJD=�K���hޟ�ꁑ!<��x���<����W�t����b�������~��*��e$���T���}�p�N+4T!��tz���@��Ћ��¾(.;�v����Ţ|;[�0�9�S3]ٮ��g)v��x��%�Cr��@�Jt�&�x	�N��­?�nk��5���{�|��i�o?�-� ǑS�oA^�ku�Z�'�q�S����MЪ�N&�)���S'�:F妝<�g>ެ�<�·����i;�t_I!�$L��&a�E����p���G�샅�R���\-�̇�t�45߀��؇�)�������)�!]x�<D����H�p׺i�qf� �_�V���i��o���� F�@��U��jP����=�bC���H�v�
/=+1SW�j>�1K����ѽ�>4�����o�_j CsV��}�vm�ҵ�Z^��}��mB"�nC`�bdݔ˾��ѺI���>ۡ�������Y��x��F8b���'�Pp�Є4*D���0zq�P�/��Q�(tq�^se�g#>�Nnf�E�L֡.�B]/�8[@���Kg�tө�ِ��v0�r�@��~��!���*JjBAc/����r��/�[��Ȉ����PY�
r���zJ&]ma%} g�_�!�M�7����õ��OѮOp�G-)D�P���%���������+�d縇hJ��_�Szq�~;���T�"���}���]�_t�}�=N���<��C��"���\^4�� �a�U(x�)�1��pju��0���� �+t��Ro>��o�P��Ș̟�t�F��(?r�*2b�}���_�X�q*�=S>��y�M1�5qr:!l�e:�h� s/����{R-��IO*�-��{Fϛ]ʇ K�|�{�O��=�LD�|N8c`��򖁬p��M�L)��<A��-���E�� aC������:J+�ŜB��i3�RQ����/ީ{�z|r�D��CQ�~\\s�l��d���;N�>�_
-�a
QI*���Jt !��w�����8A:ĭ�q�l�	R�J�S-'�M㫆7m��WRڑ�Wl��7DI�����3��+��hX�F>Y�r1e�#�nz������iU��S�b;5<�>���}YL����Z��%���� ���Q�q�p�Y��Ƭ9/������n:���޾��D��ܰ��h�u���S��q#��B�1��Ԟ��@������j�5
�z�=��%�z�\�p�o�^Pfs6G+:�ޢ',��t��E���!���������v�n�\~܇��hI��J��5�_�'�w:9�)E?KX���K�����g�E��
ȣ�'F�F�TxGC"�W��L'��4��H���:�3�]R!'����]1��sW�it��ė��a�۩Ԕ�
VN��PIa�������OΟ�v���Zґ�)V>9~3��� Ef�c���
�4��r��P�T��򓆤N�b|G�g5�h��	6���'�]~b��fsP$�S�@�@Z�m�k��Ӹ�8�����]�6����v[��D⽎�5v!
�D���[��c'�0��T���"����ؕ�M|V�<Z� �>qc������@q��M@P%�,՜H�K����^6J�P�.V�׷��= _{��a�7��ݬ���氊'�?�5���.�MA�Ѹx���0S���8]I�a]gK�ba'�p�UyFc�O�jQBB�Ń(�A�d�ˌ0���Āyr'�t�1a��<�j1�sP^ҧ�\qn˰֤��8��'��߸�i�ǰ�e�����&[8�"�n�M2���gE�(��-m��,�DIA=1�[ U��z���S��Nbg�a��Xgv��S�d��v9o^������*�f�5Ψ���|���􏸋�%�����m`{�}�3s�YA���Zi�\��UUb���W]&"�!��=x�����_���K�[s!�(�r�P5W�����H]���G��8�'�1��a�6�`lUq���8V4���s�/䧌�m���P ݴWk��zo�s�R}*�]���?�lJ���3��W�~3Μ$i4�6��R�Pm=�'(OI�@$�SՆ����x+��P�ԕ�U �T=��p-��͎��)A�ͻ�5�(ou�a¨@���<�5�].*�-�̑ބ�����XUY�_���4��e4[B�_Q��@Lo�t'�4���$�	�z&��+�9��^�o�:a��#�?�� �z3��	,vN�N&�z��7µ�L�~�����e�n�6��S9���^8�00���gIw��Tz��<X�Vp��t�0�=b��d���%,V��@C(pcj�2z�^V� ��_������س��2
mnj{<�T/�|x�&�60Q$�]�T&`*�^��e*����[g�B�V�ݠi�������L�B����^�Uj$�wݬ�D����c%�}��-�)¬�7��4������c�W�M*x�TC^e����uc�w�w�7����Mia!wp�H���? ������`l�IL�*���t\�&���,oI�^�%��|�	�7��� ^!�y�Ge]y�i�7)��tQ ���dW�c�I��F�<�$c����zB�>D������h�:��߽��I>���	����j�	A��m?̖��8P(�֪�rq�xɗw"xs��Y̗C%>��LDi���f��2��K谠�����=d��l��X����|�mK�XQ��@���-�lwkn�úDHpC+]Ľ�~b��8r֟�h�| �T�6��N��"�^&��������~����(ݵ���͖7W���kg����<j%9b����T�^�m0� \����k�HN
7=���5NΖ