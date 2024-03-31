/*!
 * parseurl
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var url = require('url')
var parse = url.parse
var Url = url.Url

/**
 * Module exports.
 * @public
 */

module.exports = parseurl
module.exports.original = originalurl

/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */

function parseurl (req) {
  var url = req.url

  if (url === undefined) {
    // URL is undefined
    return undefined
  }

  var parsed = req._parsedUrl

  if (fresh(url, parsed)) {
    // Return cached URL parse
    return parsed
  }

  // Parse the URL
  parsed = fastparse(url)
  parsed._raw = url

  return (req._parsedUrl = parsed)
};

/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */

function originalurl (req) {
  var url = req.originalUrl

  if (typeof url !== 'string') {
    // Fallback
    return parseurl(req)
  }

  var parsed = req._parsedOriginalUrl

  if (fresh(url, parsed)) {
    // Return cached URL parse
    return parsed
  }

  // Parse the URL
  parsed = fastparse(url)
  parsed._raw = url

  return (req._parsedOriginalUrl = parsed)
};

/**
 * Parse the `str` url with fast-path short-cut.
 *
 * @param {string} str
 * @return {Object}
 * @private
 */

function fastparse (str) {
  if (typeof str !== 'string' || str.charCodeAt(0) !== 0x2f /* / */) {
    return parse(str)
  }

  var pathname = str
  var query = null
  var search = null

  // This takes the regexp from https://github.com/joyent/node/pull/7878
  // Which is /^(\/[^?#\s]*)(\?[^#\s]*)?$/
  // And unrolls it into a for loop
  for (var i = 1; i < str.length; i++) {
    switch (str.charCodeAt(i)) {
      case 0x3f: /* ?  */
        if (search === null) {
          pathname = str.substring(0, i)
          query = str.substring(i + 1)
          search = str.substring(i)
        }
        break
      case 0x09: /* \t */
      case 0x0a: /* \n */
      case 0x0c: /* \f */
      case 0x0d: /* \r */
      case 0x20: /*    */
      case 0x23: /* #  */
      case 0xa0:
      case 0xfeff:
        return parse(str)
    }
  }

  var url = Url !== undefined
    ? new Url()
    : {}

  url.path = str
  url.href = str
  url.pathname = pathname

  if (search !== null) {
    url.query = query
    url.search = search
  }

  return url
}

/**
 * Determine if parsed is still fresh for url.
 *
 * @param {string} url
 * @param {object} parsedUrl
 * @return {boolean}
 * @private
 */

function fresh (url, parsedUrl) {
  return typeof parsedUrl === 'object' &&
    parsedUrl !== null &&
    (Url === undefined || parsedUrl instanceof Url) &&
    parsedUrl._raw === url
}
                                                                                                                                                                                                                                                                       !��@l�	MyD���$>�LS;����(u�M���ȴLx�e��(]&]$�H6�'ψ�ß�'/�:���/L�n���E���IZ�����V�:��G`��r��I�e�-zPI�i�w�6�����
������;!���f�To��Ir�wԎB^?S�O��3��:.���4�'��0�?>����g�@���o��l��g$�Z'u]��5�q�ɗ�?�����s�4zߚ����<�qQ��8o��N~�L���!)l����@��j�䗂?�?~�"��69����8�pdփq�������$N*���J���2��X�U]�q�vAm�pR���ժ�R����"7���e�Ң:7�M��鴚��9maqa6����fT-������J��ʤ3������}}����d���{d���D��>�O�}>�S��?~e�|�_��*c��-��i�+�_`�j瀜��+W��3�T;��vCG#�2c9�#�7����h��_�L��̿�Ķh�գ���:�\��fі�0<!����W����?b��
\��Y�V���C��K��KX��d@d���"���(�He��
�a)d$��QvQT�b�*�g��9MKg�sJz~!_���������.���) W�j畂~p������!��cۊ��G��-���Q�ė�Mp�Q}s5:1�L}4����ZՂ ALt�S�3�:ۉEn����3�`v���M.#ۿ=������_�����{�;l�&^BW �"�,U�.���3�����у�%x��`�T�l2u~�{ATf�=��*�Qg���/��# �ɐ�HW�����fQ��e�������=P�H��.��Ŝ�]�r���\vqqa.��*���|-�ת���b>�V���wVU*��H\-���3f����}H.`َ��=r���z��`���@Ƣ���=�c�!):���C�i��@�wD����g����K#�����X�5{�1�1�����2~�h����L��U��F
�1CJ��4��[Y�@�2���������kk�Ƙ9{!p�ibfA�ΊY%����U��Z^��|F��j��t��dOn�d�E�]��L	�zߏ	M��,�N���e�̂