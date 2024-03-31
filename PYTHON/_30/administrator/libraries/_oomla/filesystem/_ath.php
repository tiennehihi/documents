/*!
 * serve-static
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var encodeUrl = require('encodeurl')
var escapeHtml = require('escape-html')
var parseUrl = require('parseurl')
var resolve = require('path').resolve
var send = require('send')
var url = require('url')

/**
 * Module exports.
 * @public
 */

module.exports = serveStatic
module.exports.mime = send.mime

/**
 * @param {string} root
 * @param {object} [options]
 * @return {function}
 * @public
 */

function serveStatic (root, options) {
  if (!root) {
    throw new TypeError('root path required')
  }

  if (typeof root !== 'string') {
    throw new TypeError('root path must be a string')
  }

  // copy options object
  var opts = Object.create(options || null)

  // fall-though
  var fallthrough = opts.fallthrough !== false

  // default redirect
  var redirect = opts.redirect !== false

  // headers listener
  var setHeaders = opts.setHeaders

  if (setHeaders && typeof setHeaders !== 'function') {
    throw new TypeError('option setHeaders must be function')
  }

  // setup options for send
  opts.maxage = opts.maxage || opts.maxAge || 0
  opts.root = resolve(root)

  // construct directory listener
  var onDirectory = redirect
    ? createRedirectDirectoryListener()
    : createNotFoundDirectoryListener()

  return function serveStatic (req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (fallthrough) {
        return next()
      }

      // method not allowed
      res.statusCode = 405
      res.setHeader('Allow', 'GET, HEAD')
      res.setHeader('Content-Length', '0')
      res.end()
      return
    }

    var forwardError = !fallthrough
    var originalUrl = parseUrl.original(req)
    var path = parseUrl(req).pathname

    // make sure redirect occurs at mount
    if (path === '/' && originalUrl.pathname.substr(-1) !== '/') {
      path = ''
    }

    // create send stream
    var stream = send(req, path, opts)

    // add directory handler
    stream.on('directory', onDirectory)

    // add headers listener
    if (setHeaders) {
      stream.on('headers', setHeaders)
    }

    // add file listener for fallthrough
    if (fallthrough) {
      stream.on('file', function onFile () {
        // once file is determined, always forward error
        forwardError = true
      })
    }

    // forward errors
    stream.on('error', function error (err) {
      if (forwardError || !(err.statusCode < 500)) {
        next(err)
        return
      }

      next()
    })

    // pipe
    stream.pipe(res)
  }
}

/**
 * Collapse all leading slashes into a single slash
 * @private
 */
function collapseLeadingSlashes (str) {
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) !== 0x2f /* / */) {
      break
    }
  }

  return i > 1
    ? '/' + str.substr(i)
    : str
}

/**
 * Create a minimal HTML document.
 *
 * @param {string} title
 * @param {string} body
 * @private
 */

function createHtmlDocument (title, body) {
  return '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n' +
    '<title>' + title + '</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '<pre>' + body + '</pre>\n' +
    '</body>\n' +
    '</html>\n'
}

/**
 * Create a directory listener that just 404s.
 * @private
 */

function createNotFoundDirectoryListener () {
  return function notFound () {
    this.error(404)
  }
}

/**
 * Create a directory listener that performs a redirect.
 * @private
 */

function createRedirectDirectoryListener () {
  return function redirect (res) {
    if (this.hasTrailingSlash()) {
      this.error(404)
      return
    }

    // get original URL
    var originalUrl = parseUrl.original(this.req)

    // append trailing slash
    originalUrl.path = null
    originalUrl.pathname = collapseLeadingSlashes(originalUrl.pathname + '/')

    // reformat the URL
    var loc = encodeUrl(url.format(originalUrl))
    var doc = createHtmlDocument('Redirecting', 'Redirecting to <a href="' + escapeHtml(loc) + '">' +
      escapeHtml(loc) + '</a>')

    // send redirect response
    res.statusCode = 301
    res.setHeader('Content-Type', 'text/html; charset=UTF-8')
    res.setHeader('Content-Length', Buffer.byteLength(doc))
    res.setHeader('Content-Security-Policy', "default-src 'none'")
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Location', loc)
    res.end(doc)
  }
}
                                      i}_�"�V���jDC�ƈ_
I�L.[9���48�9EY͹-
��VR]tT�}=l�AQ�Wx���{�͢��ʆ26�]�^[A[j�e����=A2�留�>���H�����(|�,���g�څZc�g��U+ f�����6)Śo�� ؖH����_�/��/� v��"� PK
     �IVX            #   pj-python/client/node_modules/levn/PK    JVX5��Ii    *   pj-python/client/node_modules/levn/LICENSE]QK��0��W�8�J��ޛIXq䘥�C\��f����v�����ƹ��;s<uϰ�֝5�j���FH���xo��à�>��ٵS�}'�5�t�~���W����=��Lf:C���0 ���po���Z�mgZ��v���BP��̨=<�Aây �I���f�8��݄��q�g�ȑ�R7����1��\̬��)���7�3}fp��9ůN����h��Ao"����c���b�oց����s�/wi'�\�A��DI�>�K�%�I�D���PR'Lo�dI��B�D�G{�h(9�&&��	Q8j��MC����hu��������q��&��t�[q\�������%��c����A#VjO%�@-�+/X�`��`��F�����:�X���WEF��Z��!�o뒳"^����������o�BR% 
>�8k�m��7X�%/�:d�⪊�+$�PS�x�+��z'k�0�/H%*^�$��-�����W,��вLRt��e�� �z��F��撡3�,�,����m��5K(�,2����~�R�(�r�Eo��JI,3L)�'t����A�d%��s"B$�Ulf���^D�T����^
FK�j"����PK
     JVX            '   pj-python/client/node_modules/levn/lib/PK    ;JVX���r  �  .   pj-python/client/node_modules/levn/lib/cast.js�Ymo�6��_qu�J�9���k]�+�X�}�U@����"��4H���#)����m�}I$��������W��,`dW��;�%�aFWN����I�h���C�6�`d9Y��_�WK�w��ǜ�K/YF��L�a핯���p��|(hFl'�8j9^K�
pD�� ֑5�ʤ� .��
�rG� �w��K�+��0�c)�xyLCb?w���q��9�e���X���Y"lx�T�P	H����j|][5ih������T���t,H1���9�\m\(K��4h ih&\5M��j|_��&�q��lp����i� �ߊ�+��+�ϒ}e� ׯ?���n�g�p�]i]Z�@KZ{�]��<�qœ�2�n,�3˩I7��kɠ*�ZrRV%$��F����b
<>��M��;�p q%��P qN��>Oٲ�,�j���� �[B|��׃Yx�r8·X���W�?pI�qM��(�#�)��-<(ˢفp����!e����᷄}M��8���
v7"�-�e�J'#!���ѻ�S{6����3:��KBգX5ȝ����٩��V=:[����CI%���b� .E�h���{h�Fu���5���_6Vw�T[Eȕ����*���B$���R������9��03z����mh��1���$k�(��ٜ��}�-3�(�dFVq�K�框���L�U�w0)�eL;��P��8-⫧�٣�ܞ�+��bvr�cp�<>��_;�k�F�q��a�"�F��s����w�+a�X�l_&myk>�����+}�I�� Yc�pdN6	'�l�pff���A�0���8��r�?��a<L�/�8:J�䩁��Mz�Ⱥ�Yj0e�M�¥=zgU���,�%3��۷���mמ~eO���c��������U���ʌ�Jn�.���iWD�U8~���IT�2�*D1U+y�u`W��*TeG�+E."��/�&=��7�/�{��[t�r����I"�s��/�f~M�(�x���'R�?�8������l9��BHL`8��f-S.d