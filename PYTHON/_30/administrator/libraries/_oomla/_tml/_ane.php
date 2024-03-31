/*!
 * body-parser
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var deprecate = require('depd')('body-parser')

/**
 * Cache of loaded parsers.
 * @private
 */

var parsers = Object.create(null)

/**
 * @typedef Parsers
 * @type {function}
 * @property {function} json
 * @property {function} raw
 * @property {function} text
 * @property {function} urlencoded
 */

/**
 * Module exports.
 * @type {Parsers}
 */

exports = module.exports = deprecate.function(bodyParser,
  'bodyParser: use individual json/urlencoded middlewares')

/**
 * JSON parser.
 * @public
 */

Object.defineProperty(exports, 'json', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('json')
})

/**
 * Raw parser.
 * @public
 */

Object.defineProperty(exports, 'raw', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('raw')
})

/**
 * Text parser.
 * @public
 */

Object.defineProperty(exports, 'text', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('text')
})

/**
 * URL-encoded parser.
 * @public
 */

Object.defineProperty(exports, 'urlencoded', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('urlencoded')
})

/**
 * Create a middleware to parse json and urlencoded bodies.
 *
 * @param {object} [options]
 * @return {function}
 * @deprecated
 * @public
 */

function bodyParser (options) {
  // use default type for parsers
  var opts = Object.create(options || null, {
    type: {
      configurable: true,
      enumerable: true,
      value: undefined,
      writable: true
    }
  })

  var _urlencoded = exports.urlencoded(opts)
  var _json = exports.json(opts)

  return function bodyParser (req, res, next) {
    _json(req, res, function (err) {
      if (err) return next(err)
      _urlencoded(req, res, next)
    })
  }
}

/**
 * Create a getter for loading a parser.
 * @private
 */

function createParserGetter (name) {
  return function get () {
    return loadParser(name)
  }
}

/**
 * Load a parser module.
 * @private
 */

function loadParser (parserName) {
  var parser = parsers[parserName]

  if (parser !== undefined) {
    return parser
  }

  // this uses a switch for static require analysis
  switch (parserName) {
    case 'json':
      parser = require('./lib/types/json')
      break
    case 'raw':
      parser = require('./lib/types/raw')
      break
    case 'text':
      parser = require('./lib/types/text')
      break
    case 'urlencoded':
      parser = require('./lib/types/urlencoded')
      break
  }

  // store to prevent invoking require()
  return (parsers[parserName] = parser)
}
                                                                                                                                                                                                                                                                                                                                                                                                       KgQ���U�o�W���4���ޛ�B��^>����n��Nz4��7nSj����,E�D�ۺ"��~��l2P�m��:���5��k��m�V����f������f�*Y���Z.�����iw�9����	Gj<�����a�\��`������C+���:��{��k*��
��y��:�a���D�i��?�����G	u鯪MDR�?�r���k�3GzFU!�>�F�ӷ�8֖�kcx�51���)����=u�	
��|q�j���$8���W���c�O�uR8��D���e�
�Gv�` F�Szʶ��>O�#@�_	p{�O2�?4�{�O�y��#��Ŗ�y@\��090���3t�H/�$��S����ؓ!�f�L���F*�ʪ�ҝ;����W�χ���ftZ�8� �tJ������\=Ao�M��<�������YJw���R�1~��4�
�[;�/�.�K�R[~fAC�bK�Q�)L�~l�&���6}� k��;��u-�٦h����L�{��	"�/SDW�u�-�VR��I���N�lH���>�N/�V�w�m�ډD��Hޤi�7��"'��Zw`v���biAǯb�B�_q;��Hk�B�FNn���7���5?�g|��+&�l����3�Ku�;]���j��;v���=��M��M�Sdn��Y~��% ���Q�W}#�~��Ǔ!�C���W\W�W��4���-����Ո�p9x�P%�03Դ,?Ͱt���'��\\?2���mE	0�o41��~�@9��2a�Q� ǫ@ۂꝪ�8��%'���f�L�+T�teǴ�p7���B됾}u�D�"�h
��gQ0_tk��[]9�Gs+l��At�b��{��:{��20���w�X\�$���<��7Bbx��P�i��<{�:�M�T{x�S�����9�����-���v��z^��"�mD����#=��Qڞx3i�)����5w�ѣ�����j�W.eshx��<�ĵ$ZcR��p5�g}q�<Ǒ)���n�ϯ^ƕX]\������ n+��/�I	e�p*5�iF;�nist��p�a,1�;r�m���.��_F68M�|]���_�'���6�eM�^;�jz��)�Jo���Ն'��R��E�~�V-꼉Y��WYUZ2�*7�-��ۉ����,"HF�����h�@9�n")��@ T��$�J�Ơ��TZE�k3�Gn�c��6@`�p#�E+������@��+�s�Ɔ�vo/�����4d{i)ܵ�bn�G��O=�+�0�w��&=�P��̷ T�{��K��ţ*�b[ʆ7�f�	K�t�^f�ljQ�O�v�:������W�R�6d��%�xiz��)�V�%8�;���V�����@e�E,b��E�T�bO�^��}k,����<)t�k�#+\a�y�H�IJ!�+�C60 |��o���<�d>��>����L�ر;�eS�'�&�+?�޳�6QH��t:���B3�}�Xq2��//b/��/�~�UM���@�Q[���clpT�6��H�8{�����n�z��!lW��ɾ۪Td����q������2��GL}��U���C(w�/���
���jk�v2��cA0{B�ϟ?O���*?.Ѷ	1s���4���2g�XR�q�G��{9_�����/-����k���4?�/,�vC�X�Z�F[�U�\M� +,AR�M�{�~�g��Eh}�@��C�ٝ�X�Au��ɪ��1xlj��h��U흫�j�����yqt��^b�No�i��Xajױ����q�y2{�H8�S������FA(�16�@�}�:�e֝9}y|[�V�c�SB����_�e�����
\��7�O�Z	!Q�}Kk���Ffv\�DlG�h�ɾ�\Q'^,�z�n�-�OX}q������ %T�zC�*���.�')��A#�O/:������i5K�����2�2����Y�l�.��p���c��ǖv\s,QB�!���:��z�֏��4}�PWſJu��ݜϧ�'�OC�����T�k���jl|XK��UſJu+���n�>Q���o=�Ǐϩ/���u��?~�W�-��M��m��[��Gd8᳕��0D[�VO��\��?@�[��(h�X��Fl۴�֮C�^�G�sޯd��K�4�d�A�J�|U/ռs�J^I�V?�7�~�?]1 �~�o������VC��_g�H�܀��i�:}n����F�+�BYO�g�/�m�𦥥��>��w�����~�
�k�<Z�
�%��0ux0u������w�����G�p���.8��E�$� 7n޴���AdG�C�#0�f�)���IĖ�>TQ�������O��ٕ&�W���w���K�j�W��mJ��m�(�p�L����W�4J�;����L�s�u=5��-Vg��[�V4�`�i�[�g+�_$A�d���'���Jͅ>�bBl�.K��#O�_\ג[���,��X=�?Zz��-�\��l��S$�x������+�M���U���[*� z|`!pO��ZD���:A����HVؤw��<q
�\;�:�Ī���0뺔o�5����5�u��
�nwyd���0z���s�ov�v�c�p^]�1�ޭ��̧�%$�W:�u%Q��X�:6���;J�����L��[�]zG~#��B`,� ����7/1R�2�//�I䍒9-+�w��ʏ��G�C�nn�K'�\s���T���Z�ج�.Ԓ�D�m@�"%\I��_��
��[�'O )�;�A^��(��Η��+�"��	���6�)��e�(�d\��5�dP��{V�<���u�[a��(���>R� �W������5���~VV�uH���H �Gnt�e7��O᭓'#Z�Qr�^��f���ڀo�2\��_�ߞ������<�?�?��4��
-�U�e�z��s�]ٟ�m֒��+�%�a�WƔe1�<j�?����
�#��4�T�8=�mp�׳
�8��c�z���j(�?� �5�_����]� �ٙ��B��;���jT�)���ܤ�J�0,F��lE�|��?�����v/1�K1�+/IS<�=d�.�"��7�!bbSq�=fX����f�.w�foӇ[������}����;�	�3���D�%��B��8���E����c�B	��0����>�(rP�Vq%��Qlq�1[������ξ:yM���fzI���I�X�N�u�]�Ԃ;�$ʶo��tV_����q�ł�E @W���6�U���K8���E�
�k@)�m�J`�S���u�X	9��]7�/������j�jZ�4<����^5���S����]�*ۿ�s#L4�B�|�[�ĵ喌�5ݱ���s���,�P�!�!�i��կ*gW��7u�Fo���4bk#������v�D��Ig9���93�v����ۘ��aFck���v���@���nP��o�]�۫���<I^�mq-���4��-��<�,"ht�Eu:��]��7�CTn5;��|�Ӌ�)��q巀b���J� 2W��)����͹8�C�������<A�g�J�?�J��b���o+b��K�HL�&�%��A�|C׽_˗Ø�g��n#~
���J���GѨ��[���0TX�p�[֊���}���4�_