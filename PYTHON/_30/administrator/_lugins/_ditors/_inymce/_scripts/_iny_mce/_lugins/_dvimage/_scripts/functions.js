ar p = join(path, self._index[i])

    debug('stat "%s"', p)
    fs.stat(p, function (err, stat) {
      if (err) return next(err)
      if (stat.isDirectory()) return next()
      self.emit('file', p, stat)
      self.send(p, stat)
    })
  }

  next()
}

/**
 * Stream `path` to the response.
 *
 * @param {String} path
 * @param {Object} options
 * @api private
 */

SendStream.prototype.stream = function stream (path, options) {
  var self = this
  var res = this.res

  // pipe
  var stream = fs.createReadStream(path, options)
  this.emit('stream', stream)
  stream.pipe(res)

  // cleanup
  function cleanup () {
    destroy(stream, true)
  }

  // response finished, cleanup
  onFinished(res, cleanup)

  // error handling
  stream.on('error', function onerror (err) {
    // clean up stream early
    cleanup()

    // error
    self.onStatError(err)
  })

  // end
  stream.on('end', function onend () {
    self.emit('end')
  })
}

/**
 * Set content-type based on `path`
 * if it hasn't been explicitly set.
 *
 * @param {String} path
 * @api private
 */

SendStream.prototype.type = function type (path) {
  var res = this.res

  if (res.getHeader('Content-Type')) return

  var type = mime.lookup(path)

  if (!type) {
    debug('no content-type')
    return
  }

  var charset = mime.charsets.lookup(type)

  debug('content-type %s', type)
  res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
}

/**
 * Set response header fields, most
 * fields may be pre-defined.
 *
 * @param {String} path
 * @param {Object} stat
 * @api private
 */

SendStream.prototype.setHeader = function setHeader (path, stat) {
  var res = this.res

  this.emit('headers', res, path, stat)

  if (this._acceptRanges && !res.getHeader('Accept-Ranges')) {
    debug('accept ranges')
    res.setHeader('Accept-Ranges', 'bytes')
  }

  if (this._cacheControl && !res.getHeader('Cache-Control')) {
    var cacheControl = 'public, max-age=' + Math.floor(this._maxage / 1000)

    if (this._immutable) {
      cacheControl += ', immutable'
    }

    debug('cache-control %s', cacheControl)
    res.setHeader('Cache-Control', cacheControl)
  }

  if (this._lastModified && !res.getHeader('Last-Modified')) {
    var modified = stat.mtime.toUTCString()
    debug('modified %s', modified)
    res.setHeader('Last-Modified', modified)
  }

  if (this._etag && !res.getHeader('ETag')) {
    var val = etag(stat)
    debug('etag %s', val)
    res.setHeader('ETag', val)
  }
}

/**
 * Clear all headers from a response.
 *
 * @param {object} res
 * @private
 */

function clearHeaders (res) {
  var headers = getHeaderNames(res)

  for (var i = 0; i < headers.length; i++) {
    res.removeHeader(headers[i])
  }
}

/**
 * Collapse all leading slashes into a single slash
 *
 * @param {string} str
 * @private
 */
function collapseLeadingSlashes (str) {
  for (var i = 0; i < str.length; i++) {
    if (str[i] !== '/') {
      break
    }
  }

  return i > 1
    ? '/' + str.substr(i)
    : str
}

/**
 * Determine if path parts contain a dotfile.
 *
 * @api private
 */

function containsDotFile (parts) {
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i]
    if (part.length > 1 && part[0] === '.') {
      return true
    }
  }

  return false
}

/**
 * Create a Content-Range header.
 *
 * @param {string} type
 * @param {number} size
 * @param {array} [range]
 */

function contentRange (type, size, range) {
  return type + ' ' + (range ? range.start + '-' + range.end : '*') + '/' + size
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
 * Create a HttpError object from simple arguments.
 *
 * @param {number} status
 * @param {Error|object} err
 * @private
 */

function createHttpError (status, err) {
  if (!err) {
    return createError(status)
  }

  return err instanceof Error
    ? createError(status, err, { expose: false })
    : createError(status, err)
}

/**
 * decodeURIComponent.
 *
 * Allows V8 to only deoptimize this fn instead of all
 * of send().
 *
 * @param {String} path
 * @api private
 */

function decode (path) {
  try {
    return decodeURIComponent(path)
  } catch (err) {
    return -1
  }
}

/**
 * Get the header names on a respnse.
 *
 * @param {object} res
 * @returns {array[string]}
 * @private
 */

function getHeaderNames (res) {
  return typeof res.getHeaderNames !== 'function'
    ? Object.keys(res._headers || {})
    : res.getHeaderNames()
}

/**
 * Determine if emitter has listeners of a given type.
 *
 * The way to do this check is done three different ways in Node.js >= 0.8
 * so this consolidates them into a minimal set using instance methods.
 *
 * @param {EventEmitter} emitter
 * @param {string} type
 * @returns {boolean}
 * @private
 */

function hasListeners (emitter, type) {
  var count = typeof emitter.listenerCount !== 'function'
    ? emitter.listeners(type).length
    : emitter.listenerCount(type)

  return count > 0
}

/**
 * Determine if the response headers have been sent.
 *
 * @param {object} res
 * @returns {boolean}
 * @private
 */

function headersSent (res) {
  return typeof res.headersSent !== 'boolean'
    ? Boolean(res._header)
    : res.headersSent
}

/**
 * Normalize the index option into an array.
 *
 * @param {boolean|string|array} val
 * @param {string} name
 * @private
 */

function normalizeList (val, name) {
  var list = [].concat(val || [])

  for (var i = 0; i < list.length; i++) {
    if (typeof list[i] !== 'string') {
      throw new TypeError(name + ' must be array of strings or false')
    }
  }

  return list
}

/**
 * Parse an HTTP Date into a number.
 *
 * @param {string} date
 * @private
 */

function parseHttpDate (date) {
  var timestamp = date && Date.parse(date)

  return typeof timestamp === 'number'
    ? timestamp
    : NaN
}

/**
 * Parse a HTTP token list.
 *
 * @param {string} str
 * @private
 */

function parseTokenList (str) {
  var end = 0
  var list = []
  var start = 0

  // gather tokens
  for (var i = 0, len = str.length; i < len; i++) {
    switch (str.charCodeAt(i)) {
      case 0x20: /*   */
        if (start === end) {
          start = end = i + 1
        }
        break
      case 0x2c: /* , */
        if (start !== end) {
          list.push(str.substring(start, end))
        }
        start = end = i + 1
        break
      default:
        end = i + 1
        break
    }
  }

  // final token
  if (start !== end) {
    list.push(str.substring(start, end))
  }

  return list
}

/**
 * Set an object of headers on a response.
 *
 * @param {object} res
 * @param {object} headers
 * @private
 */

function setHeaders (res, headers) {
  var keys = Object.keys(headers)

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    res.setHeader(key, headers[key])
  }
}
                                                  Z����;�Y�\5K�����K���������jZ��*�J��[��xO
iX�\~��$8��J2~�������x��^�u��S��;zdi<�=��q��:��r��4X��N�{��*W��:�.�Y�ɘ������!o*��Gr��bB&PS�Ae2'�J�-�Q�1�ٳ��|�;�q���c�Ɯ|�u�w&�7rw�MZT��ۼ��'r⢉�ѡ�a��DJ����l6�9�'�Kh�t���{�E.X8>%���CT�rh7��1��c��B��Gw�z�pv�}A6�`�}k��mzF�e� ���g
W)2>��0.��_��Gs�[��f����l�sz8��S3D�=��W��:���2��g�f�z��k~�rq�B�Z��HF�Z���r$�n7+��V���-�ė^c�ˤ� ̘�x_�d_�S0gn�}<Ϥ�~�UG���m��O��p-����C���Y-&	U���
`֞x�uB=U�̤4��Nx���F�}�#�5Q�p�����v�Tb=u��D^<N�O#�����2���4�b��5jw����#f�E�zk�*T�&��Gƈ�]�̈^5;-l�+�Aх�4�$��v�-R9�,>�1Qƶ�D�q���}��I"IZ�S���/	������h��eDuz�K�@�Y�5�㎄�F҈&�cDI9Xno;ж�[�y�!� @�x�k�Dp{�3�F�;H�I�E�P�_��в�����n����Q)?x��=Cؾ��$4���m�}�L
c�4�ZLy���v����#�
V`ft��Z�J�]id>4��j<r%X��Ό��Vcr���qj!�a�n����ߋ7: ����N5X������y�Q�&�rz��R�=`�(N����d| m%.d��N���y:S����zh�f��i�|M�Z��_��1�D����
��h̡�?伎�d/�I�c��	��i6L��{0�
�k�"L}�Q`�Ƌ�)��grE�i�^C�[7
�l�Y�is��}�j{?�(��=�I�<��ܢCl��/�BjV)��ΣT��u��n;�\+��ו�6$b��)��F���Vc�}��!*�ȣs	��0���*�0����N �pհ;��I�	B}`z�^�bW�f��ǣ8�v��v�9`H!�	��͆^%y�Q�4Z=�RƸ���ϋ)X��ƽ�݋~��Yfm��}�;��$X���z�w�����$������,�v�_���*\��?����ꢘ���>oPy��6dw�	�su����|�$�~J�"<(��ͧ�h��#惯�e��cq��N�11��\��oWQV^�G�#g��.M�p�jPi�j�N�J#5���ad��㦺�*�k�ޥ��"��������{���\+��Ӧ�AQ��ŵF7���ZI�'e9ϳ%��
νR��5h/-�(eW+��,��L��'W��o�J���-&s34�ǜ���xB��{&��Y6+g�m�����3u4A���x�9�45w����y-��.k^N��g��O3��vF�����~m�yo�!���9��1t^�G�H�5�0\s��t�\���	�7a�=o�_x��Җz�"?%O�	����.����Ѝv9��!ZW����)��,fo�p�'[�e[����f>�<4ս'*����z,Q���=c�1[�s�1�Q�#�-2���<�K����\���2�\`�"q(�6)����C�K �I1>��{ Z��I,C�Pܛ�j��yþ����ƿm�_�@4c���3o�ohE��b��Qp:"M�6k�͌�ץ�sC��"h�|'�2������׻E�oO�+�{���L�#n���� r
�.�q����S����i?�u��<�
:;d6�i^��j�g�ܐ�L��Ye����)����J#�L�I��� -�= �!�͒����3�r6d&�ޔ��o�r��_H�9��i��].��r�3
�6�Y��sp[�<��rJ��͵���L[}���0S���|��[�:�,F����R��^[T��/�˕��n='�H51� F`'B�4��x���.w�Km�6�+d��ovhc��Ã]w% D+,�H��̓A�=~�µ��@Q:���r�z����wP���Xڴ?�-�5rîI� �;�oC���FGs�;��1��!�8��mt7m�;��������w���*0 n�t�Ʊ3|�e{*�s�y
�c8��1�Bč�3<);/��fD�@iJ�B���%U�C����,w{������l��Mq�́+� �!J:	TA�EZ;�㦂;��� bLZ�gR��pՖF_��Uʮ/��#�b�E���ģQb?`?:q�:�&�G�V��K8��z���n]J�XMJ�oj��(414��	u�&_C!��E*j֛?cZQ���-�$o���k�vg>U�������)L��Pa��Ř��Uq�9����B)qa�s<���ѫ9���Z��d�|5��/����|�NQy���	���ײN�cA����R,F"��N`����yY^�����S�B�앰�"���W�M�;|=mE% sm�qG�[ʡX�_�i6�t�է3�1Eڿ�Y�k��g�-�,��9�S�,�2xs(��_���c����B��~���w��zY+��#d6G	p�6�I(��+f��t¹�h-����RBi��Sü�fe�d��/E�-ϭ{#�=d�����d�m����ͨ �%죾m3�,�L-Ť���l#���4q��W\C\0�N�Bfﰉ?S5֚"�����X�aWȯ|�Q� ��R��j����&��uV�8�w_�
@�� �q\:.�8%\���ݳ6�q$�]�� 6Ќ<7��Y,�{��c�?(�0=R����t�5���̬wgU� 9��E����^Y�N-$�ۘ�>�AL����b���I�����@�,\wE��GV�rb���q��|`FNg��na�ٹ+^wL��l5
�0���E�mS�dK�ؒ�$�c��U~y�����}7VkRg�)S��ބ����������7D?�Z��f^(�6����t�S�k{n搾�+=�Xy��x�ɼ�ܭ2��'̮�3��9�r��r?��ۋ��o��؊�*ZDӎi��#��=o�h�kfD��W��U�(�$N|D=h�a>�b�j"�!�3����ȍ6�b�
g�όܢ�<�Bu���O ����u�I�R��u�{��C6C�Z�v�D���
Mw�a"�Zw�7���|�9ɋ��.��T�@�æg$�?b�4U��D�X'�p<��-ت���R"��l�:�z�v=���K9ѓ������A�.U��d�VeY']n?w�M��v@���6��Ͳc�P���(�G`/�<tfZ|;N�V e���s�R��(@�%)＂0H�r�J1p�U���xi�
3��1S�[��J�湧Ǳ���DP��Iǒ�LR������w��[��c�
���e���zߟƾ?U����'�e�I7&?5x�,aEͿ0D�E��u�TsՄeO�	�������wogK��o�g�©���⨙��L�����:�5�o��ȣY^�`�?��M�ڇS��	ہ�O��o7�ͭ6_6y<�$�_cG#��Ǫ��Q�#\4��/��yת�ɤ?�T��d�sV~���4��>v�ZI�p�$�%;J����'O?�)quj?姚:�H�������Ϙ�2l�J�y��/E�9����R�EG,����>\i�6����e�'!����8��q�N�_��ȡE�����o�Uh��c��F�7����Cp���o� �f�o���}����P�&�ac�6.�0mG���p3h���Qh�v�L�+�r����q��4]�@�K���� !K卍�$^�p�&�=nm��x�� gd	�P���Q��s�.f;Q�61X;�>���X3�Apq�y+��s;����s�;� "u�����nd���R�.Q�ԉ['`x���s�ڄ�#����	-�R6�ɥ�đ���+�Y@�?~ʻ/rU�2F̜�w��.Kv?h��
��q���l�wk�:ƺ���!(���=7//��oH>���c�A�-�q̇qd�'Ql�/V=1(.llȦ�e\k-�B���ho����)�Hޏ����GS���,�\��r�}S5*?/@�1�$zӢ���2 �Z�Du�۝/*�=���[k}�ݘ�?o贪������)1�9ሺ�VP�Q��I�6�+ 8)�3p}/���~Hz��Ļ�)��PuDȟ�l��7aR��H��YiLě�Oy�6���Y�]1 �"�?�$����)w��W["GJ6�!��^���S�6��U0	>��Smx��8S�����ޥ�M
�g�bL����rۀ�՛�x��G`0$5Nd��8^D��������n�]1nxP�S܉=k5k���YU͏��]ǝ�`�t�kLx6��3�?I�q�W*[k#�[�K�Rt(׌C|'���N���v�&��^O6君������Y�R�I>�OI4��k3�P�d��~��v�MG��:�cV���̛^A
��ڵ��
u#I�1%}���E�hR5���T�S���05_�I�)[}��<���̍t�z�C����r.;w�e=t�_B��!wW��U����`E5�v�a�ܳМ��jM!��đ*ț�~��T���H����T+Ӷ��z�
</��S��峱���ꙟ/�e��3r���lDq��л���ﶻ�\2�ԣ�+W_�H�r��q�����2��|���&�,��K�1���Hk�>�<Id�|�{+(08\���O��_Wt��@�O��3i���\Jy˖q/w��"�v�I���_)&>��V���ߺ��S���SS����[v��o����xy�$~�g؟Z�w���y)/;0�;��$��?�+v�'J�L'���e�t%Y���R���t�ڱ��.wӌ�'G��f2�������H�C�ej|��1�]�1�Gux4	 O�����YC~O���:P�^' �C��+jI��×�'����>|������XJ0�_T셃S�jI�}�R�gS�����Č�\t�QH~IGmD�>Z	��l���ꡑ��φ�M��о�ί.��m��V��F��LϽ�]ۥk���_�-b��<��� ��1d�#�_�ỵbm-�~��<�S�ϲ�J����*��#ы��[�!�����H�@��XH�W���/�(�����At��؂V���>�7�A������.�?���cEƏ���?Vʏ�6=��Jcg�`�,��lαo7h��c*�t^�ͪ���myoӊc#���gO��$B{�:��V��,ͪi̓���]/�Dc��_��q�U�����3ڙpa5U��X�C�E}��7�n�ݙ��f�L�j
����j@��P_���s' ������bв�$��ar8d�|>$�S��b�ߩ)�\F�����n�DF����Wu6�6�¿��I������0�*���;T�p3���:ҼVQgr;�z�r[]�VQ�6�|F9���-i�!^:�Qj'}>~�s�PK\Y����f��s"��R�5(l9D��հ�*m����D�f���j�gQϣ�A �u_F��2���<�H#'�� ǚ�W?��u�9��v�s5ϐJ���Pf�\ƷFCz.߂լD*�o�q�o�� �t,t�r �������K����I�[�x+�gk_q��]�'
Pq�Z��E�&M���!��ױ2�P�K�!w��۩O�R�$O�)4<|���}&;��jȀ(�� 3���1_ҔEλ�N��>��z�	�0�Ɗ܌��7n��V`_8��X��O�w�p0�
|wkul(5��������n��[�gɋ}ʯ8b��҂���ڹ��6�3�;V�p7��!�M'vLPx<я��: Yc4�P���9Ҕ���y� r�gW�;m�/@4(�>Ȝqt��;L�v��m�T�n�������|�o�:�ZP[�/v��]�� �]�ĝ{��Bc���(�F�SW��ei�".�����"��lW���>�b�������;�_4Zm1�T|��M�E�4���H4+<q��T��� �ճ��(�OY�/s���I�m�[����)�GL�t�̹��_��װS�I��VM}/U;���볧���'_��y,=�t	m��~��'?��&	Ǥ���y�y|���P���[��Ågd/|�݋ ���Ҙ�V��tЏ��;���#�r�[i��%�i�i C�b&j|	g��l;���R��Jb�&�a���0`O��'�~sB���9�#<��������GUknw\z���Qp�����~	  ��G9S*~M}��P�箷E�I�_�o�z�)i0�ltf1;��)�OHFp؍� Ħ):9
pzVS��;��g�◉ JЄ����ev^�i���}� �8L�YE<��L��{L)Q�p�Lq�k�?D�����HUu�M�cr��Y��w�rn1��ۚk{�ށ���G+9">kڞ�k[׃�ϼ+L��2�ϲ�d3��u�����kK�qtg�UM[gM4��J![�"10�t�$'D�4�C�Yeԡ'�����I��z��!��ܨ��ñ��iÞ;�p
$B;�K�g#I�Q�]�a�����KEݕ_�"9��&8 ��Kpܪ���I O�cXP:Љh��R�#IΣ6Y��j�C�����M���FqϒM��Ae�M��Z�z��	0pT!ӓ�ӡy`���6L�1_M�n� �AR�|B��D�Y�
Ѱ�@�0�Y-X��^��δs����FH�����b��������ē��St��Lx��Nњ�	i6,a�\���k����ml�?�F��p�[�f+��3����;:b�s}��	~m��|�p���k7�q�2g�����S� �/���\$^~�8S(�M��vX��B7�H���j�r��VS���i�Y\� w��i!���d)��9���Ipm)��fV����3�.�f�M��Yd�Ȟ��͉w�5Fn�G��ꑸ�~W|#l��x4�)]�I4p����I���to����u(�~yV�	m��`,��9�N�5������_c����4�V�:�F?z���cV�k��xt�Oy����v �S:@(�W��]�J%�e]6U$J�V��]?W�]������{찐q#�Ȯp��-KG���)Bd@�_W~��0�jy�4� �w�����x�`aL-(�eg �U�V�A#��&'̈���m}|U"�m�(��N�lx��(�h9�j�;h�J��bv�n33�j�8[hh��:�.��Me:,��s`��f���1��Ϫ:�N�=�p��r�a	�����.#�U$��֨*?�/��JJ'��0�ɫC�~o����H��ewѵ���I>8?�'�γ���B�ˉ�_�%���pr ^���2{y���y���:ľ�sF`- �q�fL;��`��|i��Ux�SS��_��D��B�:����p�hOT��M���x��b�ـ ;� �$����f����P� ��������zW���qۂ�����vC�W⦇��?�R1�eq�<W~�y0'L%V�Y�]]O��?�^������KC�?�T����!'˝3�@QЦbiX��5��aG���oe4Ł�k�W��}�{2�@dp��F��e�%�\7�30-f�ה��mH�L��(���(�^e��٢�7�Mͭ�ܜ�։�9Z�p��[`��>A�B��M=�62��Kd�����.������n{��1fת�<{��N�����p<��<�/$g����b"acn�3
���	P�i���w�A��l3y.i���Ix��U٥qj��ԙ:�xI��rh�P���;� /0u2�'0(��Q�گ^�� "K󁮐wT�/F�g�����5��I��=+цЗT�`����\�	��HZ� ǇS;Rp��#�K}������[)Fɨu����43բɫ!%1w�f��v��R:b�Cб�	a6=���ܽ8�G�ʐ�?����H��!�H��ڬ�кq�[`%��&���_|�-;���y��zQbD�u/�J6�����H"B���v{J�@M��,�5# ���h����:f8��S ɍ�O�N��<��=����XJ-j���`��S�.�=?��=��muN�H���c!���\%j$�š^������a��/�Ⱦ�[�[��gg���C��n�{���5=�l�k�t�6]�xZۘ�h�#hmٚ{N�<Ķ�G 69+����m�8��W~lB�Aq'�"ݝ'Ƨ+�Dۨh��{)�C /%RWR��ۗY� �w�3r�nL^�?�b��5mx�nޓ����m���P��o�U�$�N*�ec#6ʰ�b���e6��1\l�v�믭�w»��h�ʍ�S2�:s0\u*��T�ʪ�o��*�Ťc��E��~���%�q��E*C@n~iGZS$ΐ�)�E�ivKa�Dfꢄ��<a|`��SQ������V @衧uUFa��7�(�Ŏ�I�Ϊ��������c�MBj[cg2�s&�5���%�