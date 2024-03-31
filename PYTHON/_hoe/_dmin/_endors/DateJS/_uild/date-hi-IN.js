'use strict'

var parser = exports

var transport = require('../../../spdy-transport')
var base = transport.protocol.base
var utils = base.utils
var constants = require('./').constants

var assert = require('assert')
var util = require('util')

function Parser (options) {
  base.Parser.call(this, options)

  this.isServer = options.isServer

  this.waiting = constants.PREFACE_SIZE
  this.state = 'preface'
  this.pendingHeader = null

  // Header Block queue
  this._lastHeaderBlock = null
  this.maxFrameSize = constants.INITIAL_MAX_FRAME_SIZE
  this.maxHeaderListSize = constants.DEFAULT_MAX_HEADER_LIST_SIZE
}
util.inherits(Parser, base.Parser)

parser.create = function create (options) {
  return new Parser(options)
}

Parser.prototype.setMaxFrameSize = function setMaxFrameSize (size) {
  this.maxFrameSize = size
}

Parser.prototype.setMaxHeaderListSize = function setMaxHeaderListSize (size) {
  this.maxHeaderListSize = size
}

// Only for testing
Parser.prototype.skipPreface = function skipPreface () {
  // Just some number bigger than 3.1, doesn't really matter for HTTP2
  this.setVersion(4)

  // Parse frame header!
  this.state = 'frame-head'
  this.waiting = constants.FRAME_HEADER_SIZE
}

Parser.prototype.execute = function execute (buffer, callback) {
  if (this.state === 'preface') { return this.onPreface(buffer, callback) }

  if (this.state === 'frame-head') {
    return this.onFrameHead(buffer, callback)
  }

  assert(this.state === 'frame-body' && this.pendingHeader !== null)

  var self = this
  var header = this.pendingHeader
  this.pendingHeader = null

  this.onFrameBody(header, buffer, function (err, frame) {
    if (err) {
      return callback(err)
    }

    self.state = 'frame-head'
    self.partial = false
    self.waiting = constants.FRAME_HEADER_SIZE
    callback(null, frame)
  })
}

Parser.prototype.executePartial = function executePartial (buffer, callback) {
  var header = this.pendingHeader

  assert.strictEqual(header.flags & constants.flags.PADDED, 0)

  if (this.window) { this.window.recv.update(-buffer.size) }

  callback(null, {
    type: 'DATA',
    id: header.id,

    // Partial DATA can't be FIN
    fin: false,
    data: buffer.take(buffer.size)
  })
}

Parser.prototype.onPreface = function onPreface (buffer, callback) {
  if (buffer.take(buffer.size).toString() !== constants.PREFACE) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Invalid preface'))
  }

  this.skipPreface()
  callback(null, null)
}

Parser.prototype.onFrameHead = function onFrameHead (buffer, callback) {
  var header = {
    length: buffer.readUInt24BE(),
    control: true,
    type: buffer.readUInt8(),
    flags: buffer.readUInt8(),
    id: buffer.readUInt32BE() & 0x7fffffff
  }

  if (header.length > this.maxFrameSize) {
    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
      'Frame length OOB'))
  }

  header.control = header.type !== constants.frameType.DATA

  this.state = 'frame-body'
  this.pendingHeader = header
  this.waiting = header.length
  this.partial = !header.control

  // TODO(indutny): eventually support partial padded DATA
  if (this.partial) {
    this.partial = (header.flags & constants.flags.PADDED) === 0
  }

  callback(null, null)
}

Parser.prototype.onFrameBody = function onFrameBody (header, buffer, callback) {
  var frameType = constants.frameType

  if (header.type === frameType.DATA) {
    this.onDataFrame(header, buffer, callback)
  } else if (header.type === frameType.HEADERS) {
    this.onHeadersFrame(header, buffer, callback)
  } else if (header.type === frameType.CONTINUATION) {
    this.onContinuationFrame(header, buffer, callback)
  } else if (header.type === frameType.WINDOW_UPDATE) {
    this.onWindowUpdateFrame(header, buffer, callback)
  } else if (header.type === frameType.RST_STREAM) {
    this.onRSTFrame(header, buffer, callback)
  } else if (header.type === frameType.SETTINGS) {
    this.onSettingsFrame(header, buffer, callback)
  } else if (header.type === frameType.PUSH_PROMISE) {
    this.onPushPromiseFrame(header, buffer, callback)
  } else if (header.type === frameType.PING) {
    this.onPingFrame(header, buffer, callback)
  } else if (header.type === frameType.GOAWAY) {
    this.onGoawayFrame(header, buffer, callback)
  } else if (header.type === frameType.PRIORITY) {
    this.onPriorityFrame(header, buffer, callback)
  } else if (header.type === frameType.X_FORWARDED_FOR) {
    this.onXForwardedFrame(header, buffer, callback)
  } else {
    this.onUnknownFrame(header, buffer, callback)
  }
}

Parser.prototype.onUnknownFrame = function onUnknownFrame (header, buffer, callback) {
  if (this._lastHeaderBlock !== null) {
    callback(this.error(constants.error.PROTOCOL_ERROR,
      'Received unknown frame in the middle of a header block'))
    return
  }
  callback(null, { type: 'unknown: ' + header.type })
}

Parser.prototype.unpadData = function unpadData (header, body, callback) {
  var isPadded = (header.flags & constants.flags.PADDED) !== 0

  if (!isPadded) { return callback(null, body) }

  if (!body.has(1)) {
    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
      'Not enough space for padding'))
  }

  var pad = body.readUInt8()
  if (!body.has(pad)) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Invalid padding size'))
  }

  var contents = body.clone(body.size - pad)
  body.skip(body.size)
  callback(null, contents)
}

Parser.prototype.onDataFrame = function onDataFrame (header, body, callback) {
  var isEndStream = (header.flags & constants.flags.END_STREAM) !== 0

  if (header.id === 0) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Received DATA frame with stream=0'))
  }

  // Count received bytes
  if (this.window) {
    this.window.recv.update(-body.size)
  }

  this.unpadData(header, body, function (err, data) {
    if (err) {
      return callback(err)
    }

    callback(null, {
      type: 'DATA',
      id: header.id,
      fin: isEndStream,
      data: data.take(data.size)
    })
  })
}

Parser.prototype.initHeaderBlock = function initHeaderBlock (header,
  frame,
  block,
  callback) {
  if (this._lastHeaderBlock) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Duplicate Stream ID'))
  }

  this._lastHeaderBlock = {
    id: header.id,
    frame: frame,
    queue: [],
    size: 0
  }

  this.queueHeaderBlock(header, block, callback)
}

Parser.prototype.queueHeaderBlock = function queueHeaderBlock (header,
  block,
  callback) {
  var self = this
  var item = this._lastHeaderBlock
  if (!this._lastHeaderBlock || item.id !== header.id) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'No matching stream for continuation'))
  }

  var fin = (header.flags & constants.flags.END_HEADERS) !== 0

  var chunks = block.toChunks()
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i]
    item.queue.push(chunk)
    item.size += chunk.length
  }

  if (item.size >= self.maxHeaderListSize) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Compressed header list is too large'))
  }

  if (!fin) { return callback(null, null) }
  this._lastHeaderBlock = null

  this.decompress.write(item.queue, function (err, chunks) {
    if (err) {
      return callback(self.error(constants.error.COMPRESSION_ERROR,
        err.message))
    }

    var headers = {}
    var size = 0
    for (var i = 0; i < chunks.length; i++) {
      var header = chunks[i]

      size += header.name.length + header.value.length + 32
      if (size >= self.maxHeaderListSize) {
        return callback(self.error(constants.error.PROTOCOL_ERROR,
          'Header list is too large'))
      }

      if (/[A-Z]/.test(header.name)) {
        return callback(self.error(constants.error.PROTOCOL_ERROR,
          'Header name must be lowercase'))
      }

      utils.addHeaderLine(header.name, header.value, headers)
    }

    item.frame.headers = headers
    item.frame.path = headers[':path']

    callback(null, item.frame)
  })
}

Parser.prototype.onHeadersFrame = function onHeadersFrame (header,
  body,
  callback) {
  var self = this

  if (header.id === 0) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Invalid stream id for HEADERS'))
  }

  this.unpadData(header, body, function (err, data) {
    if (err) { return callback(err) }

    var isPriority = (header.flags & constants.flags.PRIORITY) !== 0
    if (!data.has(isPriority ? 5 : 0)) {
      return callback(self.error(constants.error.FRAME_SIZE_ERROR,
        'Not enough data for HEADERS'))
    }

    var exclusive = false
    var dependency = 0
    var weight = constants.DEFAULT_WEIGHT
    if (isPriority) {
      dependency = data.readUInt32BE()
      exclusive = (dependency & 0x80000000) !== 0
      dependency &= 0x7fffffff

      // Weight's range is [1, 256]
      weight = data.readUInt8() + 1
    }

    if (dependency === header.id) {
      return callback(self.error(constants.error.PROTOCOL_ERROR,
        'Stream can\'t dependend on itself'))
    }

    var streamInfo = {
      type: 'HEADERS',
      id: header.id,
      priority: {
        parent: dependency,
        exclusive: exclusive,
        weight: weight
      },
      fin: (header.flags & constants.flags.END_STREAM) !== 0,
      writable: true,
      headers: null,
      path: null
    }

    self.initHeaderBlock(header, streamInfo, data, callback)
  })
}

Parser.prototype.onContinuationFrame = function onContinuationFrame (header,
  body,
  callback) {
  this.queueHeaderBlock(header, body, callback)
}

Parser.prototype.onRSTFrame = function onRSTFrame (header, body, callback) {
  if (body.size !== 4) {
    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
      'RST_STREAM length not 4'))
  }

  if (header.id === 0) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Invalid stream id for RST_STREAM'))
  }

  callback(null, {
    type: 'RST',
    id: header.id,
    code: constants.errorByCode[body.readUInt32BE()]
  })
}

Parser.prototype._validateSettings = function _validateSettings (settings) {
  if (settings['enable_push'] !== undefined &&
      settings['enable_push'] !== 0 &&
      settings['enable_push'] !== 1) {
    return this.error(constants.error.PROTOCOL_ERROR,
      'SETTINGS_ENABLE_PUSH must be 0 or 1')
  }

  if (settings['initial_window_size'] !== undefined &&
      (settings['initial_window_size'] > constants.MAX_INITIAL_WINDOW_SIZE ||
       settings['initial_window_size'] < 0)) {
    return this.error(constants.error.FLOW_CONTROL_ERROR,
      'SETTINGS_INITIAL_WINDOW_SIZE is OOB')
  }

  if (settings['max_frame_size'] !== undefined &&
      (settings['max_frame_size'] > constants.ABSOLUTE_MAX_FRAME_SIZE ||
       settings['max_frame_size'] < constants.INITIAL_MAX_FRAME_SIZE)) {
    return this.error(constants.error.PROTOCOL_ERROR,
      'SETTINGS_MAX_FRAME_SIZE is OOB')
  }

  return undefined
}

Parser.prototype.onSettingsFrame = function onSettingsFrame (header,
  body,
  callback) {
  if (header.id !== 0) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Invalid stream id for SETTINGS'))
  }

  var isAck = (header.flags & constants.flags.ACK) !== 0
  if (isAck && body.size !== 0) {
    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
      'SETTINGS with ACK and non-zero length'))
  }

  if (isAck) {
    return callback(null, { type: 'ACK_SETTINGS' })
  }

  if (body.size % 6 !== 0) {
    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
      'SETTINGS length not multiple of 6'))
  }

  var settings = {}
  while (!body.isEmpty()) {
    var id = body.readUInt16BE()
    var value = body.readUInt32BE()
    var name = constants.settingsIndex[id]

    if (name) {
      settings[name] = value
    }
  }

  var err = this._validateSettings(settings)
  if (err !== undefined) {
    return callback(err)
  }

  callback(null, {
    type: 'SETTINGS',
    settings: settings
  })
}

Parser.prototype.onPushPromiseFrame = function onPushPromiseFrame (header,
  body,
  callback) {
  if (header.id === 0) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Invalid stream id for PUSH_PROMISE'))
  }

  var self = this
  this.unpadData(header, body, function (err, data) {
    if (err) {
      return callback(err)
    }

    if (!data.has(4)) {
      return callback(self.error(constants.error.FRAME_SIZE_ERROR,
        'PUSH_PROMISE length less than 4'))
    }

    var streamInfo = {
      type: 'PUSH_PROMISE',
      id: header.id,
      fin: false,
      promisedId: data.readUInt32BE() & 0x7fffffff,
      headers: null,
      path: null
    }

    self.initHeaderBlock(header, streamInfo, data, callback)
  })
}

Parser.prototype.onPingFrame = function onPingFrame (header, body, callback) {
  if (body.size !== 8) {
    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
      'PING length != 8'))
  }

  if (header.id !== 0) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Invalid stream id for PING'))
  }

  var ack = (header.flags & constants.flags.ACK) !== 0
  callback(null, { type: 'PING', opaque: body.take(body.size), ack: ack })
}

Parser.prototype.onGoawayFrame = function onGoawayFrame (header,
  body,
  callback) {
  if (!body.has(8)) {
    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
      'GOAWAY length < 8'))
  }

  if (header.id !== 0) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Invalid stream id for GOAWAY'))
  }

  var frame = {
    type: 'GOAWAY',
    lastId: body.readUInt32BE(),
    code: constants.goawayByCode[body.readUInt32BE()]
  }

  if (body.size !== 0) { frame.debug = body.take(body.size) }

  callback(null, frame)
}

Parser.prototype.onPriorityFrame = function onPriorityFrame (header,
  body,
  callback) {
  if (body.size !== 5) {
    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
      'PRIORITY length != 5'))
  }

  if (header.id === 0) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Invalid stream id for PRIORITY'))
  }

  var dependency = body.readUInt32BE()

  // Again the range is from 1 to 256
  var weight = body.readUInt8() + 1

  if (dependency === header.id) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'Stream can\'t dependend on itself'))
  }

  callback(null, {
    type: 'PRIORITY',
    id: header.id,
    priority: {
      exclusive: (dependency & 0x80000000) !== 0,
      parent: dependency & 0x7fffffff,
      weight: weight
    }
  })
}

Parser.prototype.onWindowUpdateFrame = function onWindowUpdateFrame (header,
  body,
  callback) {
  if (body.size !== 4) {
    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
      'WINDOW_UPDATE length != 4'))
  }

  var delta = body.readInt32BE()
  if (delta === 0) {
    return callback(this.error(constants.error.PROTOCOL_ERROR,
      'WINDOW_UPDATE delta == 0'))
  }

  callback(null, {
    type: 'WINDOW_UPDATE',
    id: header.id,
    delta: delta
  })
}

Parser.prototype.onXForwardedFrame = function onXForwardedFrame (header,
  body,
  callback) {
  callback(null, {
    type: 'X_FORWARDED_FOR',
    host: body.take(body.size).toString()
  })
}
                                                                   çHw:B�L�}�t�ŧ��uD�Q&j��(zH�7���S��>U��28A8�ֆZ��9ρC�7r�	��z�sj��+X�c"�H���K����Cg��~W3Sfu�?,Bo ���a��a0|'5�VZ��PlhJ:V���S�Z8��"�m��h�^����XQx�됽���P���������0�ъF$�
 @ӈ5~��
A��r���b1���#Wjo�4�
��檋b����)�G�Yj 7�zY����h�ht����{K�n�������!AzE�~EH{'��O0���v���{;b�Gw\1v"�H���X�m=�5f7�!��P�c+'"�ȇ3Y��@[C`����F�m7et~�θ	DdUo<�U�g	�� �[Z��{���WOA�_ǉ�{���^�wNe"�F��g}(&P��wBt<���U�D��	�Igs�n��<.=�%j�����@9���+�I��;?�Q5G�����1�^D�#�Lq��v0����؊����b���Q���	��T
�QT��u�w}֌%���".�!�o
�� c��~"�K�:���׎F������a;�5U<^����_l�8$��������IL,��5N5(���k"��=F|���*3"#瑤
export { _default as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzT3IvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixnQjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vY29tbWFMaXN0c09yJztcbiJdfQ==                                                                                                                         B6e��bI�Ĕc�o�;�-�EZ�UIj��2���Z;�;Q�$u���W:��Δ��`E ֞ ��i�V��rA��Qm���e���:A��j��X��2I�xvr;m,�z����sz;�_��-_ljי���LI.� �s�~����
� Q8AU������~�iTqm$ڔ*[��7����m��֟:���m�hb��������
W<�
��Ey�҅}���8-�y�d�d�N-������.�z�9
�/�=T\��7�+%�i���D"a�
��&a_(_�7�y��BBV}�e�/����TTĖB�O�\P��qʸȵ#)�,�h���E�.֡�W���~kڧ�i9X_�C�:�	P�����������N:e��ƣ�J'80񊷠��3a�m�h9~ݘ>�	��*��$}i�>���  U�i� /�@��E��Q�c@N���Z�v""��=�G2��YQ'K�|�ɨ����$���g��Иb�c?��O6�i�Y�L�$-a#(�"V�v�Sn��$ /z-+������tD�~��'� �$xwk �}���fx�+7�_g����x.���a7q�58�-GqzNR�?��$é�d�A�%�4�����p��=٫G+RO��� �E*Kc���f�)�TaP��F嚬w���086wy|nغ�3��x��~���i.��+���D�ӨY�oVƁ&�+�$e�wz��o�eA�j�Y%���'��ѤN�N�[_/bG�[�uԁh�KV�X8��   ��n_ �A� y���g5�.��@�)���o2�3Y�`�Ď\_� j����Y�T����TD�Qu~%��#n�&�ؓ�2B�'�9Yb!��[9f�H����^���YG��/���;�̉�O ~��5���
��J��XUj��A ̕ �����V�n?��A�o(�.����^�Tn����ID|2{��Xo�@~���j
M���
�ѵM��rK'{�"�G��lH1J:Պ�\"�U�yǓ�ɩ�q���=�]H<��Kf��`I�vR��
�>HU��h��xz{�(n���;�>'���9^o)-��uR�*̢�a�m e��S��ũ��w� ��=�`����c����ng���M��|�H(�"EoxQ{6x�NT��]���1���◑�$�@��y5(Fr�n�^�<u���g��1�'�E�ց�}����H�l�]�Dw�M�C����N��X�\/����z��:>W喕w�c��&A-��,>:��mU.�eL�`�����m����[��G����P0�ۨ�Ăaq^�M ��R#haQ@�k�Q��v�<������
$.xc��O@�M |ƐL����"���s��>��Z�
vk��a�I�f�4˴�ڠh��]�B]DS��e��f�?�����M��D�^�=����"�G�
`#يlN��%��eh��w~pf5s���n�	eus�6El��Kf�9,�mG�Ec��i�
�g��7fYá.�G��v{��
`\\��ZӼ;���`��7tӯ�
�)d�ݣ����J���G~����3c�������(J�nK����eሲ����+�~~K'�#�n����V�w������������qߛ4BB���	�	���"J�����b�Q�W��].�+��
��׉�s�Ln(����a*_g���
�a�A�6���w�'����c��x����Sbk���*�M���v�t��8B��u7B�L�̅��~����wH���o	HƝ����,9�E!] ) 6��I�u��9?+c������j ɕ�DB&�ݑ�1[�r�b��GK,��/��A2+������9�{ˡӌz}�y_��eJH�3aș%�ܜ�N�/�a��a�F��)v�N=^a��az��}�]I��KF�:�gA~!��H���SG���C^N���������-.��جǓD�oц$\>�̽$�\h蜀�OC����Rv%K���bQ��v�������T���9��<�r'�g�gD?O�/0���{�W(��A���ʇ�&s�����z�ȭ�Ȼ�iS�I���Bݻ��$]��\��!�٨�IBA�A�B���7��b�����n9�a�A��B/:֞ʃ+�� t��i�I5�5�%����MZ�>Ԏ��#�x�f��a��\�/U������ 1�P�V� ��P�9�T�;��14Vy
H~��drl�L�ε�R�{�����ߝt�̬+���V�%�g%WXM9�)r>��O�^��
k����0�JR���l�n�iw��J	�D�T�EE,����VսI����xN�	��:&:]��@�CT���'�	��-H��;�&��C9�v71�S��?�"(ɤ|�W��
B�GG��A"5�r�:����f}�<���Q�`�5NXG�C�P&�I�,	�ô�J��#�,�-Kd�c�R{ƶܼ�U��35��$�yT\�A{�~��0����y��!
�S���aHq��͂�%��{�4�g����~pH���v�
�&��\	"[���+��f�&�&�@
G�p���5>D���H��q�O�~ˏk
�c�����2�ĀCk ��8w6��$yOb �D6����d"�$b����Ь�%�H>M��X������O �	U������+��'U �`"S���Cm�*=/���阊��8)e��
�����|xk,�:��c� �!����b8������9-2Q���Uv�1W������%PBr��-q؄6�{g���������:L�k���wZR�� ]��2���+b4�����s̴P�N\ݵ;"x�)jf4���Sv�9A�4l����_���<�Flэ$%�ƃJ�C������Ȋ7W�	���֩��[�w�/�a�L2%=6��=-�ۮm�c��S%�֝��R�����4��<� �d5Gj���B8e��e��Hn}���ܼb�І7���>\�~�O/�(�5��j�7[fw^�*,�0Z���� Rs|M��]+do�mM)���(B@�%��k�%����S�<�l�-e�N_g{WO�
/��7F,�B�	�E��1v�/8��n�}s�ZA��'E���׆�	��د �o��=�hp�LRz ��O@�ʅ���t�V�vΖ�M�Z0�����$�y|Bh�V#bn�sKt��J�l�Z�"��pc F}�G�c9Z�QO+��"O!����J��6ԇ��X�����L3�UzL�Kr���&֝ �,�;�?�=�����$����()(�&�o�kjkt�e
�q������
z�Z�X�m���o��T�,�5"������y���'�v���.��0ha����+�'�ڦ�)2�!���AzA������G������X�f��b]6�ܻ��y׃8����;e:O#������BW�C�D��� /`fs�C��{�ibW�N͹Db��.����wvX����k"�`��i> �����QtJ��[�Fhte E�I[3����)�
*�>�N�\2=�5%��ON�t���ܓ]i�܏� ~�ރ[Uʚ�!EY��Y��T?���  �A�;d�D\�!��Th��0�+�P(Y���#�!x=T;7��D%��V��6N2�_$Ќb�`:�K��D�SS�
P���� � /@�%�y�ЩȖ���:���PI�U�_�|���O�
�;�ɨ���V͌q��P��ػ�� q$��g/�\�:�n�`m�,X�Pc"�*����Ԅ��94�&��.�5_x_K��Ado�ub�C�΢M�K��r�U��+�}�ϧ�u��mW\O)��k���Ǘ��U{���6�����5>��]t� ��e9���F�K�A��͋lah'�d�I����^
��$9Z�rn@�������c�%G.d��(��U��k�rZ\���"JuD_��o(h)��]���^]������!��y[e(v��s�1 ���fį���B�N��Q!F�F9��
���v��S�2�e@Hn�>�$��4d���	B򭾯P�C����עO2*i��D�М٘H���VvV|�����K�j�$gĶP�����$F^�P�X2-B�'�����,:��U��]��Qƙ�z��4�u$�q��ct"�㛉3�.�`��_�ٻ\�)x�
R��HC�H��a�3i�'$�sRh6X���bcv<8�7C�����;�p����;��e��,�8'(z��to���Cۏ#�K9�y.3������s#�$���->�tP9���a���#����W�L�t��� !�� ���]������(��혢?�ʬߩ;��g�p�N�7Lc����ڣ�V��'�f�+: !xr�Q2m�k�Ӥs�|���,!�z��!M/-c��󁹰�~
ȼ����|>��'�J��M�B��-�P��,$*I���2��ɣ�!5%��0��8���7!�˧�^���
E��'���[2��<��F�bt���^�i��A8Ꟁ\pA�W�{�a���
�rD�o	���xZ�Ρ����]:�����>�с���I�B��
}����h���w�q��)��>$X�XL�u���J�^�t걂&O���mc������9�f{����N���f���(���F��*�*����L�_��u�a�V��l�D��]�Y?Z�ek3 R$-��'K��F����&��@���71�)v�d��Wzs�³`sk]^�]x0�F�a=��KC׈-�B[]pCLy6�<����#9��$��9�
���Bf<�L����K��F���d�fr.Cem�2�w���4�����8�v,o��������`��gt��5r��4�-o������n�Y�6d���~�}t7�#��7LDI:���B���g��[@���T/�������Y��?%�p���O��U-g��u���},e?�5��}<�c���=&lv�l03�d��33.y�3��0�F�yɞ�`F�k�l���"�L��ԩ�mAj��@q�H��XP��w}��Z&F��t%��3&�2c����2�L�_���wS�ij�2��
�����I�(E��˟v0��M�'+�-텱����]ǻ���>��r��e+e���kWFk��0�Rb�0G-�4K��{q�Ƞ�(�9n���+%�)Sk�
�N��:�|c\ǄbV��1$_��?Ң �zDK�+
��)}*x�������=d�������p|[�P	M@b���:�����A���`�w	
�I��Jk�jG�ҹt-x#CI�5\%C�FA�cd��{�#ge0�����ږ��)�UI�d\ =əb����J�>֔��4fy%sx���v��[���P�HN�Vd- ����Ij��I� j�Pd�0��
�{�o��3f�6�oz�܁����p5d6`�m��u��0x�q����T։x�_q}k�YG�e�~]y��ݫ�LC���e�'�Qzy Q��'F耪�#�p����������[�p˞�o	q�䩢U�_�r$"2"2&�8q��ن�f�{�J
��\�u�bS�W3���˗]�_}�d�n�|����T�����n��K�⸻�j2�K~^K�R(:{eô^n��ܝ��ztt��B���ס:����'�+�8����(,�J��p萈Lg�%��X��l����~�=i[�Sp�H��] J��D����OQK��=�-��N �����D��=��0>�У�y�B�GM��#����z��eR<�쏋�Н�n I�h�Є�\w��'�^
��TY$�N��r�]d�w�P��Qc;2�}(��MY�W=<�
�k�i��t���F����Y���Ge�T4�+���y}%�z|���3��fu�ޗ߼������
�U�ɹ�O6i�<S��vH��1���?�P-�BY���w=��Z�!.���˭'��}E�{����Ƀx�G�F��
�,���mҝ j�x�k

var path = require('path'),
    fs   = require('fs');

var getContextDirectory = require('./get-context-directory');

/**
 * Infer the compilation output directory from options.
 * Relative paths are resolved against the compilation context (or process.cwd() where not specified).
 * @this {{options: object}} A loader or compilation
 * @returns {undefined|string} The output path string, where defined
 */
function getOutputDirectory() {
  /* jshint validthis:true */
  var base    = this.options && this.options.output ? this.options.output.directory : null,
      absBase = !!base && path.resolve(getContextDirectory.call(this), base),
      isValid = !!absBase && fs.existsSync(absBase) && fs.statSync(absBase).isDirectory();
  return isValid ? absBase : undefined;
}

module.exports = getOutputDirectory;
                                                                                                                                                                                                       aGQN9�!�J�
k�$a�X�?bH��M1��~u_si�/�i�%�F��ȌQcň�48���E�T�,ާ4�`��QX�q�K���U�O�A��̳D��`����)�p���E�2L]#k���8�7�1s���z��s(�vvH�v��:��t�T*Y�c#|1kv��Zm�ɁJ��&12��0s���W+m�ۣ�[�lm-�%*��u	D�5CN�(xe�G�w�Ү[%��h�ƭ��<�5Xx}�u��UK{��(�Oǵ� #�hn��ޑX�B�/���d����Q�G?&���w��p��w�f�&�͒Y�4�=�o�C:�F���?�e����9�  W��i�,N��	 D�$��Co�z�W�"�߇]Ud�N"'m���U4'�W��H~�{��?�v�(�
��Ӣ�Y�1iK�)�V�u�:��
ȓ8����VP�X��T��+۬PK��C���^ym�k�s�q�D���P��`L��'kl�V��4f��nz��yYws8�(��Ը7��<
K@��&N.�
]���M��9��r���0�l7S���u؟��#}���@2�G�
��A,�t�x?�j��W"���t���.0}L��aXn��Pm�m�/��ZP�}�U����`^NA ��y@�	+�}�*;�c�뒇?����[���c�^�}��+_���E2����]�1#���Y��6m�ٲw���k���$��ݫ
�u"vWR��*�=�z��r�h��˕��[-B!WqWe(�v����r�<����qF��]�!��$p�����1|��p��S�I�"E7�O2�X�[�p��V�:=�¡C`9UW���}VCCHI�_�9G���J�z�eL�Wu����^+�M��L��� �r�:��{��n+Y���������X7hF�m��s�R�v/����Lؠ�S�F�A\��>@aw�ӗT��*(��OP��7+ǀ:��9��X�m��p؊�F�gI��#������ZZ�iq�]3����V/q!O�h�o�܌�RR�bHף�������Q�U�|h��)"»�P����9��.uw2Zu
U+�R��n:V����5ޏ��J�2捴w"�%}<�}ZP��i������8"��sv�w�2a�iO���1���^�`0|a�P~��$,�Ze0*fl���pb��VF|Ty���]w�������u�[ڠ.4�F��WJ|&о�����xU�O�BT��J9�u�#Y0��ב{T9 ``�<��^�0�c��r�)���9C����%X���G��%����Í��̜U(8e��nA�$�
i�0G�J�_я�	��P;
YϷ�x�He0�
��VZN}deP��ET�:<X��/4��e�JZH�(*5���]9�^�/�\Ƅ�4�z�3��YKQ��<�7��͵&�5�m�J������.$�������l:�y�&�DM��@4˟)B����:D�*��h�L1Vm�h��� M$@O�x凄|�O��  �A��5-�2�� g��k�f�(�:ح�E�<��o�r>��p��YOȆ5EŎ���l,��4Zz�<x��]tΪ�&������c;�1��|+��<��n����+l�
�����P�4�@:�2��Z�;_ԫ��Q 
��6�VC�����bbN��=5���'Q����0'/��Ϸ��   S%*c,&C��{��4�㢠q���BlK�K͌
�nƧ=!���H���cW<��ͪqd`wx�Љ�� �X_���߀�B��}������7*wHY�S�;��~d���P��3��i���K�B�9=]T�	E�0K�� Y���"�G\��e_�/\�p��,E=��D�NV������iy��E]�@֧�6���,��"j�� ��?����o.l�'~�EnY�j7��
dz�V=��̭r�=��ME�TN�W�����ۊl(j�t��ğ⦼m�˷Zd�˛��R��tj�t�J���B1��Y��K�~��n���e\�#Q�/�+�v(׽>6�W<�m��Ԧ������P�]0zo��]w�W P�C�C�e�� )ůA;��\\�F�L�����/�0%Pj��ZW�|���D����~*��8j��]0�s�\�ZHXu���)�S�_cGe�z7�q>��A;�b��jA7UĴ���L�~^�:�M��/[�ڢ)��� A_��K���>�^�(�.�3n�Q�������8�RO��aqd*C��O�-Oَ+}�S�K8�rbޠ&�gMJW3�x�p$��Y�N�0%qFr�t��;^�%�B�Pk�v2��,����\ o`�^5|8Fnu�s��ns�Dg	��C��$
�Scm^4����/�X7˘Vo����ڗ�́�e�*
��t���ys�g&U���A�<�x�!=xEٱ$;�������R2�p��`��	����AuJ�aA���)�x�{O�c����єW���
�V_��l��w�T�6`L6��6��nR�
�zaP^�I��N��RKa��P�
ǖ�u��D~2 �cYIR�V�1!��m��f�*�ZкG >�c�V�\"K�{〈�S��/{T���l2������5�z[�����@�>S��q���iI-���*�QT���ko`�lYE�߯P�uWb�����pZ��l�;ᡰU�B��~c�o�W�Ԑ1���|*�NaΔ�m�s���]�W��_��Ï?`�d��OU�1�c8�;�_�샆�%o$0�p��Y�˅΄*��D6�;���vVX��by��tu�LZ�+n��H��
"T����F�!]�ȯ��
?eGV�����t�jֽ��Y��4��"e
]5-�C�
N�;�P�-������Y�,�,�-s5淺�U�cV{��3��"�&7A�2<���������Ua���pA���X,�`�Z/^�P�۸ǧXW ;ʘWC4�,ͱՁ��wn�z(��	��G#\l&��_UZ�-�s��^c��N���`A�5aq�9��o\��n���N�^G�����5�-D�~�j�v�+;ӟ{Уj\�d7��~���o~��+�&���]L8��7#�[��O�)�4s��I��מ��v��M���%�G���,����	qd���{ښ�x�b�j��0�K绋v*|�I�E� �%�=U�u+�g����R7t-�w�@$��u	5�=:و_���|�b`����wN�W��E��1?ͼC�(7*�>�̏U��}����}�OZHV����B�A
Th(&�7:�X���y�EWx�ˑ}Y7A�V,���J�ki@\�tBm�`�f��nd`+i�H��Pk��B��z\�C���\Uji����
~G�<�n���>WN��t���^��:y-y�V�F�'�!f&&�$!{�iL,���©�
���!�͌�8kQ���r���c��/杢���G�Y��@Y����Bh��~�-�?�DѤ7^ّ�A)�7U(BϚ�]Wz��:Esw2Rfp�f�'�2� Fz[���>����<��Ee��0��V�i��*�:>�s{���ȤdX;v�$�q�$H��a��R�ݏz{�T>N?g �K��P���h�����/T�?�i֐�M��4���	�$:����
����m���./ ?��}����`�{�E� #���O���.]�%�Y����~�pgJ9����;'6s\�=��s�W�9����sRWj<+c�=x�Q���n�@W�euI�R
ש��T����w�ͯ�]�<���W<���G��ᅅ`l����g�'w�W -�A)���Woa�Z&�Jʁ�q�Z�u/Ʀ�R�Q����9ʋ���g>���_����׶FBd�,I�C��Ŕ�q�z�iA~��Y8h"#Г�8X�RK
HV��'�x��d����
�ss�
�~^�,�];7�#B���̣5y�׈�<��R���3+���3�r]���i\������>~m]bK�p����/��t��v���!���C�AU�␺
�E�;P�W����45��
���������F[ɨ	�y��G�4]ݏur�w��b@k�.�سi��V�)�7���Zo*-��q��qt�*�����xz��( ]��V�%}�xD9���3B��С5��ۖ!�HnVX�"m�q�>Cw9Uc��~t�"P���z;�ʪ ;�䪹R0��)e��Chd��Z����t��XA���Y��po2�S��O9Ө�Z(;��[�i�X�B�78�RTw��99"r�ޑP��Y�-�^�$6~ܞK3Z�~��V�Č�op�o�D7�v[�S���HXk?9�� �Z��4#lt-�Mk��*\�X��~c�*">y�#�"���ϥ$PE7�`�t7穓����S�u��F���3,�n��ֵf_1�g[����ڲ 
���dd�y�;���XgX�U��=�a,�$���,�j��茊����s�i����7?����wS
�M:
�P%�9 o`�$2���V!G��|m0uH�� �EW�*����T���?H2v�i~c+���$t�5��5|�J�Y�MNRɱӒ>'f�|�i�yLV(�QQ��x�kctMt5\O�r�4v��>
��y��1���QYnJ���Ⱥ��,���/�)��x����1�/ڊ�\�P���Ș	��-��T�'�
��s�WF���� ��hڃ�si��:2-Ț�q�p
��H�
�2��A�mV&�}-�Ut{`��u�� ����H���4ԫ��*�3�5.--1���e����%�u�E���jI��*�?�}N+b��'��dH���KV��21��$�?��`��mG��X�|ѥ�N/n��r�I0���$=L]s��HJ���[�Ҋ���ֲ+
����k��JukhD���N������~���8�e���K5Ў�T��+��4 b��@���'�w�"��7����AA�],���r>�j�\`8V�}�a���^��;�/3�����j���a ;��  �A��d�D\�2>[���P    6O:�"�Πs����Y���ܕ$�?�tG�eWk��{����E�M�Yy��
��
�����@A9��&`fC3R��;��]yӁ%�`)��/ivj�o���8���e�@�5�@��sO;�:Ѡ��8I�8��JHk|���vxW���I?�^SP�t��uIYQSH�.Sԃ��=c��ř���%�5�i�J��ܯ��P�����h�8�������:DW4�M�κ
������W4�H���A�:_8����FT�O=��e��%P"��U�`���R�$W��z$$jN��E�}NG+6����!�q���V�-M��'b�b�@c�]+�p�-L:��#3 5�r�!��?MuW8!�K|`�A!,�9q"l:����sm�DU��qd�`��=�t������0�i0�"iv����/��_�e�Se�(w耧��x��������u��
y��%+��Pd�R��v4@
�g�W��_%���2��I19m_�H�����U�4��K�D���.y�7#0�!�[�i9^U����	�K������>Y���4�?��'��A����M}�3E�@ʐ�i53,�@8q��_%���fƸ ���X����V�:��(%�.�X�B*��sLrR�;��\�"ZAҮL�̴�T1�c_r�d*��O.�7f�����v��r|���tR�B� u����f0G/Qo�3k"��h!�Q<B�%�`����V�ӷ��R�]�E�X[=b��%��$��#T�85f�O��yȩ^^ן�n!n�VY���Y�lb�Z��Y^]�1tke�f���jn��5��Э���Th�7��b,d�*I��iL��~H.��}����Ձ�Aތ�[8�^��Rn�Q�S�+ae��Ҩ��xiͱc6���i�^�Q*'\v��?	�5���X�^�{N.�݈؂��I��L���ъn)�?̒5����0��Z�;�.יD�2x_�&��>75�-�gќTI�ʄ���Kܺ�4z�=|�q�^,Q�]Z��q\C��گ�2�{�{�;ayR��f��~RL������2!��Bu��z��M��c�9�����
�>�\��<��}]��4�@�%zʭΛ�7�����l.`} �q�}� �r%j��:���
�y����T6e�M���+�v�����D��˫;���e��;�c��؜B^�����������0��<Hk�#�8���z`�e_�ً�S
�Fsz����Q�;-���M�~��@�*_��d��Z2W�2}'U���Q)�����I��VJE���L�z
���E����<A����2
iI�ULX�e��[U̯A���'����Z��Y:9F\���K���~\��\��(�+iLƁ��A1�g51�f��|�U�Ҁv��O�CW\";��|PQ�Ok�%��s�qY�/����V�L�Ǻ�tyP�@ͺj��w%S���![�F�vK�#~�������2_@�xbD}"6�,��%��Mh���	C�^����@��F͔�>k���l7��cV� 	��R�{�!_�B7\�Ȋ�/�Nu�v�I�<��,&SU����l$a���z�� h?J����{��;�B�����r.0��SߠH4�̲H��ʀ*E��@��0��[�1�Ov����R�v������kncb�'
�ɦ���x.�������r>�������Ü�ii���-�2xbV1TZ�q�|A	T7\��ؚJd��k��(�v�n�r�
��2H��p[�N��P㝂Q�IYhn�-xe�`.�@�P 2��`  �A�
��t#�$�&���ɡ�D�ϱ��IE�\8�{��*Mݚq|[A)Y�o��'miu(-��0ur�����!h��L�,�x���#
o�һ�.n��9J=,��X�*+�<S�^{���k4�b�#JZ\:pm�����\�K
��	�ȝ%��U�	y�?�՞��Jਗ�?��7A�MN�Z��y{�"f-�Ё��a�9b ����	�/��	OE�Ter����Va�Wyx��Xee�@�{~Ls@�������T�ͬA-G�w�j���t�5���I��^F�9��V��n���>��oL$s�A��]'���� ����>ZO~,mP��;�Ie��6�N�<��4c������:+�3~�1:���Uʶ��%���!� y�Tn�"i&{i�-��w��#�@�ͨ�r�dN!7���jQ
����m����(
1��d(���^~5�8�`���$�I�d�M��"�7v=�(s0B�$nF��XZ�;'�g�md�el��P��6�;Q�!�6}���Ո!n�l,��c��uyy~�e���Ba��O�x���l< $��"�
�'��~���&�J��ZY^pC�[��q׆���-Y',��Ҋ|]�
���ḷm��9ٟfT�O�|�m}-�3�\6�s��hs9~���|�X�->GL5�ݾ}nwY.1��ha�I=-[�� ����DAЦ��QG��g`�me���\��'2l�<���J6^�"�[m�:�j�4j�3VY|��K�"1��p8

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Generated by CoffeeScript 2.5.1
var _LineWrapper;

module.exports = _LineWrapper = /*#__PURE__*/function () {
  function _LineWrapper() {
    _classCallCheck(this, _LineWrapper);
  }

  _createClass(_LineWrapper, [{
    key: "render",
    value: function render(str, options) {
      return this._render(str, options);
    }
  }]);

  return _LineWrapper;
}();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   M8Vg��l~��ĺI@�̇��ĺm��?��hc���'m~
vGL��:q�#�dj�2~��!��X&m����Yw�M����g�A-�44�0TZ��g)�K�n#|k�T4���? D���uf�DJ�1g��wWU\?�˱\�x4�*h�9h��
sE�((+!_:

J�,h(((,*


���>�H
!�{���Ȝ�?��` p   ��Ln=~�Lr���`����MD�;��� ����BI�>{�
%D����Б�~t�u�<�pkߊ�4�Ĉ(��*7e�5W��3^}�x
�[m"��"�D�C�H�$��ҟ�z0�\�6�����#3�dF@&�N�2�z�����H2����e2��	��
'A�p ��y��6 ��%=2�vF�   &���PK    �SV�Ɍ � `   PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/video/skt_2308_1629122919_musicaldown.com.mp4�[	|T��=o�-��I2B"�EY��(P�**�D��	$PŽ.���;� E�EA+.���UPD�"VJϝ�.�w���;?.������~˹73 �Uq~ٰ򑥀
cF�h��~������Q^Q^bԹK-����U����_W�+�z;w��v쵫U��;7"�l^g����;Ɋ�U��K?�<�>��Ϋ\�Ȏ�?Wm�e��e2�*��+*�w���zp�x��-b����XT�?�,f����g�B�~��3v��]�;!��1ݟ'���Zҷ�n\�Ʈ���vV�����ig�vߵ^]��C���N�9��\���iz���������������'q��`����{��k��Z^�o�{����}���&�w�o]�9?�~��������w��/"�~��_�;��}���:{��y_�����?պ�����֯Sξ��:����q��~�c��g_����8?���#_�u���S���?ո?��:��e�B���˛���ʏ�>?�<�e}�syE�`�����b��,/�ϖjd�!x���<��s<���x��70�F���75�_xoi�����5�C
a~�h��!:f��5�տ$6T�����Ibk{Ni߭��`=�T�GO=�Fԁu����V��e�5�$uk��܍W��s%��:�&����e���[��uj���XN��y���$'�j��d�r�s�e:�E��w�]p=���%V�8sߓ/X*>��B{3�[OJ̣~�nR�T�'�R��'#*);٪����XJG�8�2WX�R�N��⌏獿�/�豝Gů�\_e;���$rN�����״,.�ͦ<V��/��Ԯ/��^����}ԣMڕ�o,���o�ֳ;�XHl��������R��u�oM�N?�[�Df7���U�Wr"�9B�2%�Q�L����_����3��R�j�OӺS1,I[�`��k�9�W��Ǹ�3�Vb.�MPW��}��Q��t~�h'Y���k�g��y�x��
9��'d]�7b)�};4G���˜��z�1�V�W庂�2���TL�Z�N>mѢ�Ю�ȃ�κ]=���Ϣd��e�h�ݨל��&�F1rK}��/����*wR�vX�)�v�����o�9�.�|`�����˘�S��R��{��u���[�\� mȡ΃l����N)��~<���q��3c�����Y�w~��|/�x��B�m������<��G�<�����:\'��k5��9I�Y��E\�Y�ë�Z檳��	hK�&�W1r.夭ؗ�x�b��xZ@��K8CǨLڳ;R��Ӛ4����N�~g[��c�5���>��G���
��5p��Ζ�p>z���%p[�n��~7������߂�ȃp����wu�/����\����������~��ܫ���=�?�a����^�c����W� �ѽ�U�w˕e�� ����9�}��{�zx��[�����V�o�x
x[o��m�/F�۹�1�ȁ���'�ߧ�~-��,�	/¿m�i�?����_[�����D��چ�!�?��T��������� P�	�%w2��G�p=�y�H�\���;\�
�g�b�_���@���zޏP�
��F��z�7NAtS?d&X�%�yT�=�#��m�,[��魐��k�yqĎ��A�^��uk��F�*�{b/�@����7���@l{��'#�e�[?E"�����vtMnA�սH�?���4�q�HLi��[q$�� +�Y�������肬�d�q���"k�|d�|1�߅��+��I_d�㑝��M�Ev�����e��}7�K�#{���~��d�ANá�9��X��Q�#g�T�L9OA�sW g�f�l�9�G��/D2��o"ٱ��NF򘋐<��t5�W���ͽ���1���!�j R��!�r9R'>�ԩ�!u�X�FtE�tR#� U��1g!5u
R�>Fj�_�zmRo_�ԦM���
��� ��<�^�
f�(�ڎ��� �>�i�}�G�is�`ˑ(�ރ��PX�����p�(|�e����Q��GјlM
���(�E���~ c�K���Y靶�=?��Û��ǭ�T��d~�`ft�g�����c�5k��s������0��ҡ%u��K�"��˰�~�rjiY�b�Yl�ET�9tHyI�G"Υ�^�?_���:'�//ꥊG��rM>oҧ�
Χ��6�A������w��d�d�w�������V]	�l�}��������h�m�d�-�ȓd��&�nw	����;���z�HFn��.�Q7�+��w���b2�k�����ݱ���XxS�����d�O� ���=�$�5/�����ަ-�>�NF����x;�����$#O��y~�	�����І�� 2�d�Q��7�e�W����b���A�
��@�d � ��Ț� d] ��; 9����@���G� ��x 
��?"g���PD�(fq �3 J�?R�-�QP���p> T��DN�� ��{ ���D�
@��N�#rr ����.���@��G߸( 4�D �H% M|�f1	@���G�d ���D.���% hS������C�#r8 ��- ]��n@�� ����#r �s	 ������#rn �� }o��s�#r �h �K����7`4�`4
�O �����]�͈��pϯ:�{�#H�D�j|���Bn�դ�a��f��^�;zI�$i�*�[g�����սe�S��(4������#?�����S�8E�Ҙ2����"��1�Op!�+�8�i
��E'�t܏-���K��/j8�~d��NU��tq���%9
�Y0z���+�D��ю�Eu6�J7u��O}�[��Oٔ��Z����3`-�ڮ�� ���������8���ަ�Y��dk*�*����;3;+!����	!+翨$�?����+����׀ѿ;{kSgBfFF:fF&�Bsgg{n777���Q�������ь�?����6��t��-�l��	�
dU�5��7�l+�Y'�� W�'�@Z�3+悋����J��3eH�E]r�ۼc���8��.O
�,o�MX#��վn�r%�����c]�Ge�y��O��%u����jL;D���V8Yvs�w���g@0ʨ�,�lK���1�g�\;+m}�(Rd>�?��t����%�ar%;Y;/�����ٛ]�q
�Bk�ig&���w��V�Hn�L5�nxBA�]�P$�Cϓ�"���]�(���t|��S��t���
��w�B�޾�>��'����\���3�{;
���V
5	�GȋN`oŽ^hL&��[�����Z���o�,�w���loB�qRvR�H\z�%r9��ۆ]ڼ&�M�/���
�d�͊��A�@Q�x �X�N�ra]rik斊I�ز���m?�T��	{�>�c�����:�O�IՌ�њ��^�x�Ufx]��Q�,k)_���Rf�}Q����b<o��i\�;.�v�#��;�
�4�j�	yZ�a���t��ލ���� ����o��E�}�Kݺ�?�rLF���e��|�,�[=w;���� ��G�y+0��Ҁ'�d�t��fo����CkC���Y�x����L#�~���~F�ͷ��LL��5�ut��X������<)<W�{���W�6����W��;�s�
�����h�μ�h�9�~�����e���d�%��g}X�R�ª�5��+��7yTA�SD�Jc��Vo#���r�smN�?���-	�-]g꠷��Os2!rsxj�)��:L-dA�ã��d�lj{�ݙ�s���?}�-�x"Dp��"��؎q/iNm̭q���̏U��p�q�ٿ�p
?�u�n�d���[�f���uՄ���R�0�n��5���N���7�,3J�lL���j���?�/G���3�"�\b�%0�+ ������p�4��!����425wNT~�ݗE�Q뿉w��]N�Ό(kj�SZ,�������k
��Û+C!Hz"B�᪣3�N��u�*u���6ju�9LZ�9��SZ?:ΖFأ�<�f�3!�1�s=�3�4�`�m��x\�"Ꮴ����4�x�>b9��+�G�X�W�  ������~����1����?ȓ�h_9GxB_> ����
�E��&P@�8
��n���m.���,�D��/��Q����[1d�_R�`��i�R؝j����a���Z��{	�>�ե�_p�$9�IG�L��	و��{ж�[��?;7<���!V��ֆ+��1�{�����8�:~�EX�Ĳ�8!|�:E�|�ӥ�R���{���H1Uo�f�[xlV�[������g:L�Q��� )��m�n%%X`�q>)z�e:%��6b��uM�>�8l�2�������X�ޝ�/8�w��e�BO���ǰ
4��B�3Ȳou�Y
��,����[ȭ�^�a�8X3lЪ�sN������&���G�@�����$�9H�!ű"�$�c�Tl=\=fl�SL�����i۠JN��4�gQ����o��r#��=Z��<�5_"m���֦U�:���f`Bű����O��eX��Knx�Q�PM`*���[��7��ٖg�2����:��Э.�H}B���GRZ\+���sp,2��S�j`�Ԅ��G�Dm$�I��KI�V���w�goy�]�D��2�K�e3�ϙǔ���9�]����S<��;��g����E@�N�H��!�w���Ȼ����!B}�^B�.��A
�U��kR1�r/;`[��(ip�R�×��O��j*
�97t|ж[ډ\��-�:��*|	��碰�Z��F�!"mn��N��㷼bo�I;	LiY�F�T�"�czHC���ִ+L��bٹ-�ͫ.�Ew_���O�p8�О��/me����h�� zJ���Z��T.�{8r��0�ِ���t>�������ͫ}��}�0��tw������亃 H
~
U��G ���3�r��{p܁�o����Ԩ
OiA~�@l۬os-�^�Ŝ��!Σĥ��ܖn�/k�n�"sQ��u�A
u������Ѐ񊆴�IT*|��8Q?n��[6��?3��P܌LG���N��c�-��
i3/�.����^��h=�����z�	W@�Sq �=@��X�_�x�t��@y�K�d"�U��ao[:(��������"��}��7x�!S�f������;�$`�ӿ���^����V���3{i�fG��J �0o�	���
�o*���$�<�I�a���F��m����
���چ��d��\�z��t~t���m����}����v�����w`�����H��m�ƹiw�t�ݓ��Kc��n��n������Z��0z�Gb&++���ԋ";}���*?�a�o�{]�^�j�_LR@R	��ӥh�����
���w�v��8~�+U���f�ꔶ/R���[�	���j{�$SO�w6R�c�):��3�ó�͓���M�B�cܿ8��%Z+͛���x��i2��*���3J�.�6��$��\�����8F]�?��׏�:��$�ޞ��ػZ������֠�zqt����.�u$w�[j4U��c��.z(6���(^�s=�ԅ��]E&rb�qM|����uo��3M1P�-�gT1�kp���&b|ث�������ɵ��Lf���C�y��}[��D����h%��l0ǹl�h%H㵖Ȕ;��A�x�~�-)�Qa����9����X��2�k

x���a�=���tK�0��eg����Ŕ�4�ػG����r��ۺ\1W�U�̂=�V"949�ꍜ�O�hDN�^��#
�)�g���=1���F�M~�^mZ�E�<��/�4BD��iud|��Ǥ�_j��R��K�h���Qedl�J��,t���n<���v�Vbe�MHOK
��ǋDkD�\ JU{Z�����<�&���t�}i����l��\�Ƅ�&op$�t$a
��E���<&A%�� �g�~�-!X�O0"Ae\%���q��fY�#i�b��Iȣ]��R���q�C�x�V�:S<Ujc�5,��L%���&��V�,WzԼ��K
�x�?4���Ĩ܃��oS�����W؅��`�T
��������'���6;�!��}�ͧ�[�h��z��S�L*x�����D�;��raz�MW�1�y5�r������w�0��sJJ�%.�l�O�{q�Z ��I�;g�bE�DU�3�V�q�W�T�L_	��������9�"�
P�hn1��� ��l.{4��v���!�)��(Q����[u]�e܎�G@�����i
L�?��x�rd��T�3WҖ,dm$Z?&?����71��w�"��`���_�g��4��ߋ�d����Dy���j��=d�-x�˜qY�_��C���S��'�R���^'�b`9�>�W[=��
�K&|��-
���/�j��iH�������4��=�Q����7�i� jk^��D�'����o�R�H�A��䢉6սv` �fX�H�3�d��)���Oe6w$�����H�B�����z)�uP�����27� ��K�b�\���j�(���3~�^�` ]�w%�JY��~V�x�՘��+�~�QйF��\=�[Y�6_��\�#˲��l��[��}���vL�g%yo�'�g��ě	�8�o2�oY��h'�3�C�,�n��؜� ���p抓�&Z�������T
�#l�m���CH����r8������>��%N�~�䒓)���.�:���ه-n�I�}�x�*��P��EԮ~�"���-;'����segV�4���u�H�$s� ���~Ŕ�U��|{\����|��8'tPp���E;���n�K���S�p�aWW��]�7���Y�z�AI0Q�<�eM[��9��E[m���ʟ%�])6x�0A��Ǭ�W7?�/���� Er�\6:�DWV���K󄂢�u�gt�9��[Q]��:$��'	]]��l�Ҏ��d��:[��jI��R�|t��וN&��T��E��]�н��&���PT���m�$l5��#M�CD�Ȳ��R�d���aQ��*|{�EE�F�|z`%
��t~e�n}3�I�UͅԺ�@U.��P�Z-Q�֐���.�H�-^��Pt��)���9�kȡ��w��V)t�Ϛ@��Dj��P�GE��!���U��Hn��kF]�<��B�?

  Fast, unopinionated, minimalist web framework for [Node.js](http://nodejs.org).

  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Install Size][npm-install-size-image]][npm-install-size-url]
  [![NPM Downloads][npm-downloads-image]][npm-downloads-url]

```js
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install express
```

Follow [our installing guide](http://expressjs.com/en/starter/installing.html)
for more information.

## Features

  * Robust routing
  * Focus on high performance
  * Super-high test coverage
  * HTTP helpers (redirection, caching, etc)
  * View system supporting 14+ template engines
  * Content negotiation
  * Executable for generating applications quickly

## Docs & Community

  * [Website and Documentation](http://expressjs.com/) - [[website repo](https://github.com/expressjs/expressjs.com)]
  * [#express](https://web.libera.chat/#express) on [Libera Chat](https://libera.chat) IRC
  * [GitHub Organization](https://github.com/expressjs) for Official Middleware & Modules
  * Visit the [Wiki](https://github.com/expressjs/express/wiki)
  * [Google Group](https://groups.google.com/group/express-js) for discussion
  * [Gitter](https://gitter.im/expressjs/express) for support and discussion

**PROTIP** Be sure to read [Migrating from 3.x to 4.x](https://github.com/expressjs/express/wiki/Migrating-from-3.x-to-4.x) as well as [New features in 4.x](https://github.com/expressjs/express/wiki/New-features-in-4.x).

## Quick Start

  The quickest way to get started with express is to utilize the executable [`express(1)`](https://github.com/expressjs/generator) to generate an application as shown below:

  Install the executable. The executable's major version will match Express's:

```console
$ npm install -g express-generator@4
```

  Create the app:

```console
$ express /tmp/foo && cd /tmp/foo
```

  Install dependencies:

```console
$ npm install
```

  Start the server:

```console
$ npm start
```

  View the website at: http://localhost:3000

## Philosophy

  The Express philosophy is to provide small, robust tooling for HTTP servers, making
  it a great solution for single page applications, websites, hybrids, or public
  HTTP APIs.

  Express does not force you to use any specific ORM or template engine. With support for over
  14 template engines via [Consolidate.js](https://github.com/tj/consolidate.js),
  you can quickly craft your perfect framework.

## Examples

  To view the examples, clone the Express repo and install the dependencies:

```console
$ git clone https://github.com/expressjs/express.git --depth 1
$ cd express
$ npm install
```

  Then run whichever example you want:

```console
$ node examples/content-negotiation
```

## Contributing

  [![Linux Build][github-actions-ci-image]][github-actions-ci-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

The Express.js project welcomes all constructive contributions. Contributions take many forms,
from code for bug fixes and enhancements, to additions and fixes to documentation, additional
tests, triaging incoming pull requests and issues, and more!

See the [Contributing Guide](Contributing.md) for more technical details on contributing.

### Security Issues

If you discover a security vulnerability in Express, please see [Security Policies and Procedures](Security.md).

### Running Tests

To run the test suite, first install the dependencies, then run `npm test`:

```console
$ npm install
$ npm test
```

## People

The original author of Express is [TJ Holowaychuk](https://github.com/tj)

The current lead maintainer is [Douglas Christopher Wilson](https://github.com/dougwilson)

[List of all contributors](https://github.com/expressjs/express/graphs/contributors)

## License

  [MIT](LICENSE)

[appveyor-image]: https://badgen.net/appveyor/ci/dougwilson/express/master?label=windows
[appveyor-url]: https://ci.appveyor.com/project/dougwilson/express
[coveralls-image]: https://badgen.net/coveralls/c/github/expressjs/express/master
[coveralls-url]: https://coveralls.io/r/expressjs/express?branch=master
[github-actions-ci-image]: https://badgen.net/github/checks/expressjs/express/master?label=linux
[github-actions-ci-url]: https://github.com/expressjs/express/actions/workflows/ci.yml
[npm-downloads-image]: https://badgen.net/npm/dm/express
[npm-downloads-url]: https://npmcharts.com/compare/express?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/express
[npm-install-size-url]: https://packagephobia.com/result?p=express
[npm-url]: https://npmjs.org/package/express
[npm-version-image]: https://badgen.net/npm/v/express
                                                                                                                                                                                                                   4LfWP����	�4��l���-�K=^��#�l�L�$?ə.��Hط�q����&`TgJf�k�X��qh���g�ҥ�2)_Ea�xL���akh�)$�8b�N��IYL��a� .X�������(�=Kf^�����싋���Pz�Q��1�i��?� �g�k��^.}�_:��Ǜu�M���v���]���t��
W=N5�g>�W A�q��8����e?k��A��I�ړ���F�ڦ	11���޲H=4SW���ϗ�aJH+��g�F�7X�;�{^Ӏ�2s����
5r�[��B��Q�5����y0e���~��&�@�Z��dwkѢ�T�e�[�E~cj�~Q߳�S��[Z� E/�Sّ�NT�}���[n/5�_��Y�;±J$��e1N�y'4��q���y��<l2���R��tė�(PR����&\�`�a�.�ݱWL�\&&h;�U�9)��r �xAA�=W�;��.(x8G̞��I{�3�8�ݻپS0�p�#��8qf��s�k��y�P^�#jQ��M{8���e�?&d	���<Ew���I�-�g��(��3GN��)������S�k�IP�co��̌]E��oN$}Tp�,4�/��A��
��?����{�.�?����l~<���&:m��@���I�X@�h���g��Η�х ՛q�6�b�S ��CI�����H1�Lw�2aD��:wH�0��
�b�Nn2j�ȎQ
�d��j�<���L�s�zsw6"���3e_uLuUzD�,�d }�V�wtL"P
S��X�j�F�$������b:�9?����EE!�݅v��ּ��x����j[I�ۭ�(Σ�bձػ+����m�Gz�`��	��qo%�W66A��k�zn�f��E�_Q���h�(ϑO���q��$*ӫX��Ob#&y�A���m/��s��Z4姾����:W�P=
%���c_�� �P4�f/��Sީy<�7gОc�ۃ�Y�00�	���0<�����JX����>UN9��iSee�sc:�W��0�*&Y3YE�S�M�tحM�2Ow�bЯD���P>�;dB��r��v
W{Xؐ�!���ߙĦXN���9��$��Q6�d�C;\�`��)�uP�uC���0��"j�=y�af��Ï9i���LG�^��3/�_}���������%�/5��T�Q���j�S�����84�,�itD��.��Z�\���K��]<�I^�ث@��D�o"=k�-b�\B;y�"��,\�va����@�u�d����"���;�.0/�ݶq�P��<t[�)�����է�p�����Q$�nx��u��Q�nW����3�r��hc�'��V�1��C�ԊW����M����q���ݒ�l7>a�ݦ�Ɠ��0����G%]z~��[���^R=�j�T=2�R2���"F �"h�ɣDi�D�JD���ژVbk��[��n����o�<�MO��<3F��:_,�v��]�V��f��n��Ccj\��qU���|5�@���Dp�Wu���|�Nh:�9�d��L�Z�y�z7�U8R��ZU'#�G �_��_���
�:]1[n?|\Ʒ�ɿ��v
?����{uCB��p&�E��
{�i0��(��B�!2G[��R8�}��)�HJӕ��EE��{ev�BZ�+aߤ/�͢n���s�D�����U���1�}֓H��n��Ψf��R?};�1OJB�T�ìa.�dn՝)W�0�^��=V�ð� ���f\��2�����WJ�L����e�M:~R�-V����M?����Ȃz6:޿��7�]|Z��ɼ�n�G�w�7���^��W��)*��~kN�yl��a�՘ ��v 
</�$�j$(z�3O)�I{��� �K���BI@1�YJ��X
��Z'���L<yu�0�q)h�`|�'6i�k�6�r�pT4B�+��z5$L���Z��j��0R�3`��}���\���Z�����\�g8�;��+:�ׇ��qL�Π��k�n3��-p��"�����D V����`)o��K�h��
�JOT7��X��(d�����H�V*��
@�Lid�2�GC��}�NN����C�D�؛��kI.5�L�Nys=�����	KF6��VL�˳3�����6%������N�Њ�?�Cl���l)IК�\<S�|i
�&�����Ք�sM���+�~����6��Ӯ*��a�;��+Z������aS!.?���j��i
{j�O�@L�;k#�L��D�%�W?o�g��4�}BJ�_7D��׎�X��eT��_��`�Ø*Ai�`qʾ���hG5��m��x�ԋyW�}*NJ.��Ў/(IHuc�$�L,����K����J�{���As_:ȗ��UTg�Ÿ��E�΀�2�͒��%���C-�)�ؿ����a ��k�-LlN��N%uV�`\���������@���߂�梈�S)��gK�	�O[SRq#*�B)�W��6b��d�;=`]-��3�$���d���Yj��"A�<���8kI��\���O}b�У.�3�5ǘ�t�-8�@|��-�V%��sn��'т���<�֧��H
��N
������3�m�"��ֳU���o*�����D��*��,����9�� �i�܁�\7L�Z�9������t�mN��z�ZO�D�/���&�_���[�K'H�Ⱦ��$ciH��FE��Kf�_c��9{e�g�t�Hx�?4�	�V�_�P��Z���Ն���T��mٵ٭��f��F��3�;� �0� x�G|�4��v>��8۴����c�Lb�C����Kmͪ�q�Yÿ�I�?%І�,�U�=5|����@�tR���_�;��{P��]�o����h�۱w�g0�����g�����~�J���i䟝띚?����A�,o��s� -��f��P�9�C�A��2t}e4˶ԜY�\������ur�|��a��RBarcd}���.�v,�"{�)��3�r�K�q���t�]q���݂ɋ_�3SHp% <Z��{ͤ]�[ڕ74p	1�ֵ�>�}����l�8���Y�u�l7y8����#��)k�h�G)�e������=.�����E��F�?g���#+tNʳ��Ю�7�]�N�"�ҁ��3���h:�v�}����d�AFU��}KP8����\����y4Yr���.E�8�����H��U���S�[�B%�A>~f��
��$ə8	_V˓}ֈ�έAW1�=�Gp�"^٥��̤��;A**cXbJ=u���Q�F��T��'�Q�!c�d�B�!���3��K��G���v6�/��)1F9%��/�ȟ�
ooQ���3/"E]|*����
6|�P�9q�f��}b(.&4N2龰)����<_���, �[A�4DOp�]�n��q*�B�|zi��~�E4�S��a��.�6��#��M��C�s�l�P�<�yhB�8�r{؄�Nd*8V���%_��w �ƀ�.5˚ң��{���hՅ)�_%u�eU��U��}ٌ���ku��D�]f�cV�#iS�i� 2��]���J�<�W��@M��z�9����y8S,���=
e���<f��-Q`m �B�eK��Ζ5_������"�Bd�:�`���#&8��p��'�����y�3�����VS���+'v0�: (r<1���/	�N�H3[��k�/
X�!,��W�U09����cf���m3�P��5�&8[�<�a�BZ]�a'F��Nվ���U���F��ڣ4Y�N�I�r��)-nQX'�V(C��Ήє��{��s�pg<���?����:�nM�֢~��К[d�����q���hM� a���bPj�H1��5�����(��5%!�s�ܳ�������7��H;N�/	U�{[^�J������r#���%]J���: �j��g��	�Xf��g��g����]	���XmVkae����y֎9v]������+&�698�2�@�e� ee�E'���L�C�i�
�|�yE�"u		��l/d�BM�8ԡn�w 	����B�u-�vjT�#�>�%�F�o���C2	��턨�+�ğ�P����� '���UFTK!���;��7#T��O�Z�������gA���
�����=�z�������H�q�,g�.� l�8�>�=�>)c���9���]p�yߘY?u�S����%St��	o�)�C#K�}����U��v�}+/i��4�m]d���Z�S�ʸ�;K�r:��J�i�c5�DI8)�;k�X) 6��~���#�^>�R�y3!��=:q�E��Q�=�1��#fo�T8*�R���$�V�1N�8~s�y��}���a2k�&�ӕ}a�@�H�A�?`|�V�VEgcTI"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  numberLiteralFromRaw: true,
  withLoc: true,
  withRaw: true,
  funcParam: true,
  indexLiteral: true,
  memIndexLiteral: true,
  instruction: true,
  objectInstruction: true,
  traverse: true,
  signatures: true,
  cloneNode: true,
  moduleContextFromModuleAST: true
};
Object.defineProperty(exports, "numberLiteralFromRaw", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.numberLiteralFromRaw;
  }
});
Object.defineProperty(exports, "withLoc", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.withLoc;
  }
});
Object.defineProperty(exports, "withRaw", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.withRaw;
  }
});
Object.defineProperty(exports, "funcParam", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.funcParam;
  }
});
Object.defineProperty(exports, "indexLiteral", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.indexLiteral;
  }
});
Object.defineProperty(exports, "memIndexLiteral", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.memIndexLiteral;
  }
});
Object.defineProperty(exports, "instruction", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.instruction;
  }
});
Object.defineProperty(exports, "objectInstruction", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.objectInstruction;
  }
});
Object.defineProperty(exports, "traverse", {
  enumerable: true,
  get: function get() {
    return _traverse.traverse;
  }
});
Object.defineProperty(exports, "signatures", {
  enumerable: true,
  get: function get() {
    return _signatures.signatures;
  }
});
Object.defineProperty(exports, "cloneNode", {
  enumerable: true,
  get: function get() {
    return _clone.cloneNode;
  }
});
Object.defineProperty(exports, "moduleContextFromModuleAST", {
  enumerable: true,
  get: function get() {
    return _astModuleToModuleContext.moduleContextFromModuleAST;
  }
});

var _nodes = require("./nodes");

Object.keys(_nodes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _nodes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _nodes[key];
    }
  });
});

var _nodeHelpers = require("./node-helpers.js");

var _traverse = require("./traverse");

var _signatures = require("./signatures");

var _utils = require("./utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

var _clone = require("./clone");

var _astModuleToModuleContext = require("./transform/ast-module-to-module-context");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ��v��WE�%�0��H��E������:xp>lP�����/^��7��-�q�����A��_A���1'>X�/=Ajմ����a6�j��љ�S�������J����J�t��� zJ{��K�嶤#����"�8F�|�*]ȟp�N��t���=*�hc��D�b���?>tn!p��>�I�v4s��+��[�e����m{�Y��B����Y��"�U{��y����T��6�<a-p/�OL�3m�}=y���[tG�;�I���5�G��$�%�Q�7E�1��!QG�������6gK� @�+�%{DP K��@�xצ����
�t�����&���
?a�@M��@/H�N"z�������H��o�bN� ��3X�e�F���wH���.aQ����H�Fn��ǆE��WO����^�a�rb��c8�G��8�VƗ�Ve��U�\�炾_�t�W��g m�6�����c����K������O�`>���N���t��,�R����8�&��L4 ��|N�b,tO�l�D�#��S�)���3�W~6㝋�p����Qf�
m�ު�Mu`�2�t��� �!}��������[�M���({2{�+�߃{���A��M�B�{�m� �_�"@��`�<k����U��|�z����Y���>�ɤCZ�?���׋-� 
!�tsWf9��˼��l6@.
/��Kd3��-�/��f෵Î;+A1�D��\��#1���w�V� �- ��2��FJXmE���)�!�W*�Y�p�q�������MUv�?�����;�˹��j�?��Ԥ�;��S�}@��	��t�y�=��aqY,
�ӹ��S�3()��L�=U�n�ٰ䆿������D{	�op{��Usq�^��piLw'��BІ�AN��	Ec��p����րX�՞�\��h��{�f�1w͋��+8�q��&I�H{(�G#�٭��Wh�4mb�=1O��	���e������:|6�~y"�i*��8;�Y��vhi
�������	��qY����j�ڴ��N���R�}ސ�s�!K��Ԅ�/�S��I����^�|��h-!�J/�Ң����BU��d��(����P���ٻ䩜��f�R�;^+b��IJ˧v`��V�PF���s�2هgN�)0%>���kbЖ�C:��h�^�O\5́k�����ۢ$k�����X|�y�ED�F�䌿:+Ֆ��6�x4y�M�a��h)Y�=����"H	}.`���m��N��(�R����0��Ҥo��;.�d:�E�Tc��A�ȡ���⹿�[����>���d+���Dc�����i���c�(�ʛ2O�R����s�cm!��Ri�c�u���4������Vڏ�'
���e�5�w�ؙ�	,��Og�_���V���&X��e�#Cm̓pE�S�t�7���N��Ϧ�c�g�ݒ�z�����?��w� 
�%O���Rՙb��.�a���� o�>�˟���
����r�A���v~�d��ԯ|�|~&�e`*�^6�߉	��qE��87��Q��?^c??jy�� LV�Zs���Ŕ���ȧ�%�Em��m�Ɨ�"�g@79	2Pe/N��koң��@�p�t�D�����vQ���5$L�j�w�P솝�J��8��L�{ce��\�C.}�o��N΄��<�֤zT�D�ՙb���o�u��C�e!�����}"��;�w*d�|Q�O�väβj)
7��z;8���3�o�*�g�1��TR����j��7���,��?(>87�
&��WwK1J���i�e�|�o�71�@w�i�˸�/CU���|�4n������������:ֆn�|�!�$�����^<�]���	�w�_����Z��n�v*��-UP�hg7	Zq�w\���9�2qX�
k}7|+	O4Y�
�3�0�|���b��x�(#�S���\?%�W�u��O,��Gӟ8� MNH�^�F�At���GT2��7��Q�
;*>+w�K�%)}�+���hJV3��9��U�xoo`���F��a��6a{ɧ
�y�j��M�+�Wx�W��[)���5?&�
�-�@��c��e"ɪ�_�2m#�@F��Ox1/I�3 
Y��>o���Mb(�Jz&Ox���
���hs��}����Eci���ǃ#�� �/��;�]ŝj�f�g��.Եo!TJ�'����8�~P���n����g�����F��� �Z��{@4����=Wd�W	7���}�vi�;��b3��+���̤<�B��l�1"�j��'����ʘ�S�&�
�<�<�Z,6}b�hѧ��-�Y��Q��0���s�d������ߡP;Y�f�)� Է��<�l4"dx<�3L�j�x:;��EaT�M�
�df�G���q}%�N(JR�*�[��بe7�zz�e#�$r!sѽr�,�m���5A���Sѕ���gk��B{�|*�����ڌgۤJsbnv�q��Npe��g�dl�8��1z"t՝Rfh�P[l��<���Rc
�Y�~hs,�aTa�7U��xB�j�^z��JL��^�h_���.��c��pQ�D�@7�vY�=Ō�_�'IQ�Fp
!�oh���M�c�y+0�
<�m���"r�YNz:����n�A0���a%C�7�_=�f`y;��j��L3į���%�Y��2��W�Id3K�,B�'����
���!�虧� t
�`1�P��7a�	����ʄh!�M������=X��2Gv� 4�M�m w�խ�P��8_�|����A���7����M��#��W���?̟���J��T�Z�~9c�F{Y�|���c���[_V�\9��f�/�zIvHa��w��r��n��B:�9����B�L0�����<ф�E��'*�'�O��
���BQ-`��~�tEE��;���y�%�	��Z�3�x�7����\U�LT��9�C���v��k�k����Ʊ��>%�:cP3�_3
A�u��/6Xޤ��I��u���B�O��Z�T��tQn�~(��LPs��·���+� 
m��>l�?GO���s�˪
HF�aG�5��X@�g��5<�u��;ʘ�y�Vm�WV�J��X܊T�F��¦a|
K�n]�)��|_R����\/d�@?<�=��?]s!�+Eok�ҷ����0j{���A
����чU���:X o	���VمJ���m{�Ä�/�i�  �  .A��<!�2�+��� 5������:� DNfK�v���Z��}a�3�	��!�2iZ25Q��Z�A��L?p�� \� t�ҏc�(0����,��gHر��\��ѫ�����e�������h�69� ��c����Hr�ZM(3��z�u&lR1���/a̵e@5�� .�8Zս�3�vN�c/��N��d�-GhU�Ӑ�N(� �����H��1WgD#�� L�m�-7��'��$l[/n�I���"f�<&�����U��ۥ�IԵ�������wsK�M�
��y����K͐�F���پV��O�`vu�ܐޓ���9���%R��1c��D�!폵_����o]�F��ST�(B�|��DNϟo����R`K�t���b���I�8����/}?)���u��6>y)�]!  �A��M��e0���  �fz���~�������� $�]�ny�(�T�LjCYL���x��+
#�v��N��K!	E�@87sd��`�E�Y������2Ӯk,nv��Tϥ����"^m��$�խ_sn�a|z��ߤo�����9d��4Fl(̝[�����N�~M��18_�ćT�Vz]�q�{�  a�A��M��e0��� �w��@}ɂ�$�]Z�`pu�j($���q���/���hS�$��G���O���پRP覩���Cc!|b��+�$X3ӝ�_K[�
.j3��a������Sğwc�[ "2db�T����ʭ�_�W0�o<�ȣ	����&��SԵp ˁ�Z�ǵ����4*;�p��"s����P6�W�`%@��E�
����B���̉���@$���U2�=Y2iƗmr�v �$���u�ǡ�TL)'��,�"�pd����R�L��c��N�z'!n���et
�
`a�44�@> {"��+	�vݏ�� G��+˽��" u	�]�
ջ�aed�L�׼ݳ����*��J��卦�(O+BG����y2���_�����������QPr@�_��L�0D<?,�
xkZL,ǵ�uy�r#�:�Y��`�#K?1f�^
��D���W����a*���CG��׫�+�}���R741�q!��D0�aL�WK��C-���hl;��Ȍ�7���_&����L�Y�nӗ���h��NԘ���7I��ES!д���z�;_,kd� L:�4��;��`�p����ޔW�nna�_��6���-��ЋkH~����_���j��q�EO�Z.l��o�C�����q'�e�gv��>��W�܁R���e��+����*�4��"����p¨�������H�+�vӝ�a��n,��Ƙ�CŖw*��K;���5�?+w�n���zS
w�G&�~)��LQ���;�����.mB��;	ߕ2�����J<~�1�!B��u{�g������k�{�������	B���h������AO���u%���&J���p�7 �N}�)��sY5�#�i����,'��IFpk	_���3��.ڀ,iD��΢�8,����l�G�KI��ڠ��;�o?:�ZV}.7�_��u#M�]	�Ie:�d��k7��4q:*���d�k�$�TB�~b���r��*FR�~�U��sao@�:� �J�m
�*�=;�i�����c �_�`���Jj&�]x��:�R*m��~��L} p?RǪ��L<E�k̙�OV����g�ٮ�Kr����
�-��iE���s��Wx�>�Z�Z��?��wY2�<؛"/K�����c���ŀP7%	(Q��1�4q�3������'��4�m%.8���(FE'��K>wTQ�`��˶a�������bvmˡnL�cˌ��a��5G_�3x!���$��*9�[�F�·C�DU��
�{��2�E`�\8=SBh (s�\��W%�cr�V�������dAs��So�D�7�*�ԔK�Z��u����i�<�oQU�uy!����#:�����د1t���ݗD�w� �h���:�!�^0?m��ʺh��ZX\�h�[2H����V�%��0U߃p����=�΍'L��+թ��u�TIjoRx�ɒ?m�N�+��j�|(-{|�Wzz�F�a����1����·���A�xQsI�иAn�#�(�R��V�h�.2RTN��5����5�u�ʕQ�?:G(��[]B�z���v\���T<]#G�\�S
��&C�gM�vF��ռͻ�J�G�4�_?��.!�y�o�O�4Imܱ?�g3s�>��(l�y����3�Ɍ��8�l��{�{&����y�Ȣ����|6�>�|�+��-�����a'uaÓ�����ϼi�3e���t�3��.��[-��`�_���`"o������DS��V�JmV��+F�#ZvV��a��Pj!���4*�k�kTb�t��^h$3����A�sG�:CX���1 ".���{�[=V~i��v��-a�Q1��N���i#���}j� �LňU$/�g�6�N�3l��1:Η0����B)�
nϴ@\}�%q���Z`ʉ"�b�4��跖�/�����$�j~bf(}��KZ����}�ņ�'�o�?j11��y|�㪓�6\�R~>���sT|�O���r��ÇU��E�_��_�
�Zޜ@�®����N�]�9
7�!�}��Tq�a��%_�����"�g��
NXyh`7s!-����-�.	GI��uS��_͂��>�y$c��	8]�z),$~S�A�=u��]�Jakڡk�=���I��C��e�{��RE����?��&0�]p���Z�x!�ή��Ű��6Z5wAYR(���,��s��W&�(����=�8�13ԜL�{�И~��������]�_��-�_���Y0�(@p�R��@�hLv���~�QfA��.y8�1K|k�f�
sv���z�
��o$S����&O�K[� �ת��,(�ڔ���exF����F	���P�p�t����h�Nht����d�����b5��~݄���u�uf`-����)�:�N�봮�s9���A՞ľ-��<�
��Vͅ�T�k(eFqR�e�ȈZ���Rn��5�oߑ�����m�շ��J�Pf��6`DnW$�ϸ|iF�͈n��fϱ�t���u��$�	}��\��$E�+���>P�Ҥ߆��d?��n'� κ%?��=8

var IDENT = TYPE.Ident;
var PLUSSIGN = 0x002B;        // U+002B PLUS SIGN (+)
var SOLIDUS = 0x002F;         // U+002F SOLIDUS (/)
var GREATERTHANSIGN = 0x003E; // U+003E GREATER-THAN SIGN (>)
var TILDE = 0x007E;           // U+007E TILDE (~)

// + | > | ~ | /deep/
module.exports = {
    name: 'Combinator',
    structure: {
        name: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

        switch (code) {
            case GREATERTHANSIGN:
            case PLUSSIGN:
            case TILDE:
                this.scanner.next();
                break;

            case SOLIDUS:
                this.scanner.next();

                if (this.scanner.tokenType !== IDENT || this.scanner.lookupValue(0, 'deep') === false) {
                    this.error('Identifier `deep` is expected');
                }

                this.scanner.next();

                if (!this.scanner.isDelim(SOLIDUS)) {
                    this.error('Solidus is expected');
                }

                this.scanner.next();
                break;

            default:
                this.error('Combinator is expected');
        }

        return {
            type: 'Combinator',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: this.scanner.substrToCursor(start)
        };
    },
    generate: function(node) {
        this.chunk(node.name);
    }
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               �!s�����IwJL �h�z��Q�]����m���Xt��WK:��5��T��z��?Òd����j����>Bv���lD��yʲa!�?��w|U����>TI�ܐ\�d\�FT�t}0���E�r��g�F�Љ����9�!�<D�`��u$�3]�O�ֽ�9�11�RH�,�)��M�js��|8���	@�Q�X���������f�:��m���u y1���_����67�Q3���q�\`��XNYO+�4�A9]`~=jݟ �q�G'!V!�^[u=�c��Wl唏��ꈪ�S�c{�nNH�n��-��
�?(��u �z�8�.Rl-a�� $��%���A��dݭ��6��J�}A�G�c૛uD���Cl����b{���݇Ĝ�����U�o���P�Z��0�H7�(9}�?��]��{��K�YL��p�y}fj�_���>�١n��x��^��Y�aYkW�`
Z^D��o
|�~1|g��� x�_�cH�%�5���om�>j�vRP�Бft��H�y"��UVʹU/���a(jOg�9����ޫ��ݒ���\�6=|�i�T��S|+I8E��.�嘙$�0��
��/S�������y����Yv�zM�iū�a�uz�$k���HK�+���@�+�ʵ�n5�j��a;��>24<�{��c���H Llm*�lGҊDں�/x:L��KP0r��lny�Z��B%K?���M}����aq�W�D����wt³����v��\p��-�2����5��t��lv�g+-J�l���.�)�I��:I��_�⑼c���ex�bq�q���n7;Tk}��*��C/�LT���lܘ9�D�X\Kg' ���{�v�{��Cڻ�8�{�z����K�z��
*��tlY�5�6.E�*�BGIU�����*1��zk6<�'�2�d	Tn�h���5�d	�CW �� �C�����JG5ă�֕5��L���l�АF�T���.fS�X�:F,+������\o;�
DV�#����3�*Uz0a����g�PN�4��m��9�9���p��5h-t���{LFm� Y���h��~D8.�g���T}���?�N��x�(;�hI��G��GM�#�rS@��
ϋ\a��$z�1W�*eu�[6k��iܴh��=��,X���n��M\>�|����q��>�sϞ:��Ll�i��_�j�jS�a��"tkOU�8{�.'���}I�9��B�ѻg/���2�-�
�����ɍ����n�o�j�4�w�<O�&Wd�����l�Fލ�6k�bpt�A���R����@�a�ӻ��|*7��_@�$F���4�	��2����@����P��T�aTE[�ͦ�|�5�/:���T[�Ӥ�"��;��:dP�� ���"Ù

-Q��=bmK��.BxxW>C�n�}'&��$o��84=�:l\з��� Bm��_ȫg��ċ9E��篐t,��鍺�j/���
�ʇ-�UB ��:F���#6��L�*i7���@Ǖv�[���/���Ͼ5J���M��/&u�e�Ď�����}��6��K��������$|�*�n�@cG����ї�U�"q�j<�-��.N�Ko
����k�:�L:$i�)q2���.�?���
��(�)쵪��*d(Q�^�}ڹ�hB 8I��[���n��}������ty�tzÝ\�M�=�A;�eD�`�^΂R��:y
��G�����.'Xn�I%�}�q�=���w:���.�-�.h0�PY&x�G��r�qU�2u5:w�q�1�#��Js��ڻS�Pk����P���]��P�5Ab�-j�2�[����I)>Y�̧qО�����=-�k�A��
���Ӭ��j���p�������Ԃw�#�"rYC�6J2%pb�e�=o�C`�1F��֩c��*�>�e"�@�,�y�H:)^����ye>�|d��/������>$�GT���
%�ɨ3�q��ِ�S�7P_�g�d��I��9Hs�W8�!���}����n}��CN6t9��s�T�EH�a	�ɂ�zxh�D`�g	V�y:��l�Aq%P@d���6�7
�u���"^ ���|�
F�Of��v�����X�j��g�$XMK�)���aC��fC���^��e����m�Z�O��a�(S6݋/W�i)ݑQ�o�Q5�UZ2���8�!���w�u��������\�D#��
h�XGS4ڜ}��V�Aoǿ���
�3'G�oR-�^��Y�}�9>z���C��;%Ȟ��_uyk�֤װg�����J0�"0b�X�W�����-�ݒ�����*���+��+(�P����N9�[;���W\�����.�7�s
���3��D��z�A2t,%R����ꪨ�Ա�$*�����DXU!��?�yxѮG��q.��o���ω�����Ր�$�43�R�G`u�*����
A��c��a�Yh8
����6�M\����� �
��Mx?b'a2�@Z����q���q�͐�!��v��'sD�/$�� G
4�C��x�7���%,�L�e��wpޛ_7�_^����ٟ`(v-�d�.�sU9�rr��W����`���hL��|��W��Ҽ\?�-�C	��6Q.�����\��8m��ϯ�����fw�˳��@��0�e6ayWo�L�kk�di�彂"�e-[C��Urк"4����.�	����"`_��@����K�lCc���ʷo�ouus�	G��ۊ��@��u� �,<�k���Mٴ��dvPc��j�գk��"�U��1S�J�����k��MVT���AowʎP�1�4���~C�4/w�h�Œ��'i$Mÿ�b��w.�Q�ȆñG�{���z���	��c)s�b��Ms���y���Q�?�4vR����0+�����N�\��q��,��0���cL7&l,mF���V������T$����y��7��R�)s���(~�OtU�1��A%�@bJO��	v������! ��5��8�\�*'c���f<���b�&=F�E��`��Dzq�w�S�侹��,��b ���질�k~�u������҇S
��,Q�ǎ)��X�q�s��'�ΪM�Mg�h/��lb���2'����t##~- ����qt8!	���U�q�Ǚ��ݟ�Z-��)iHX/s7Q:��4&�=���8���5���Q�����g������"��Y��ŋ<<ll�5F�?l.-9R�w��}���1@��f�@ �~(�%ց@��T�Gį�\���%l�G
Y�F. ��R��;�2�uܕ�����jWK�;�N���^�[���(�
J��m��y�JY9(��C���Nٕfd��˂s�/�
6h�5$]�y	���S2�Q�d\��U�����/��K�Y5'y��x�3����%l"Nr+���X���%(��+���}bh�f֋q�'h=1`I�5�v�u�#0���`2y��%e!�}���@ ޮd208�����@'����%��ð��d��)�<�Ҽ6���1�B�Y$��yn���3~!�Sr� �q,�)�Y>���^�-��{_�_!�${Г� ��-��:
��v�A�φ�"T������
@x��ocx���5.���g�] 9Ns�r��؇�I?2���3�9ض�"8
й|�Wfh��D5i	�^
S�1)gǞ/�7ݠ�o��ٝ��,0~�����v1��H0OA�ñ@i6X-Ug���/<v�xKҏ�!��'�3.�} �ԧ6�� b��[��}��xڋ5K<䝶���k�5P� 8��Q�Q�dߴ���1���dL$�fOҼ��2��B1�sBY8R�s��.<4�5�g�AX�jp��Za�ǐ_xyI�g��u��!^*������{���=�q�S�QM9�7����!60�[:,u��ZG�R�x�3�`�!(
ޠ�X=��7��$p�y���W�v�>fP
�Nu#$d���-�����4~	f���V�\!%�/2
�?G��t�\�n��~3AO���<��`K-W���kb�y���L�D�[�Ss�4_�����6�ܭ�PW�Ɛ1�W`I*>[v��<�_���`�/6\���R�wF$e.籦.FNY��
h��Y�4�~��o\���j���$L�y��P�͟)����C��+���0�-ZZ����Y����',�; �v~�5ʰqe��&mI�1�^zX�<�N
q� �9'9�}���&�F?��9�8�F*z���iqT����tĹ�,�j>[ëP'ڧ��ggB;�b�)Y�[]b
C,��!�G����JOF�
|��.���&���'�S�)���E��CG�)��=6�ӗo�'1#Жoe��3nf��~������OL����˔U՟����.���6�3;�˲��\��P]��`�w���� �޳%���@Am�9lo�'���]E?\�'���u	6�pߏ��-|f�l3���!2b^0�T�$��%�z�;�A��36�˼l[�~��6��λT�}rwd�qR�c�l������hD�z�X^��D���'͒�5f�5��k#ԣ��}����{s��m4�����^�s�a�����w&��
��F
����cY���c��h���)�߆W��>��B�;a':�v��H)���A3BW�,w��)��T5հV�Zx�z9סO+r4��^᠂h��-N�e�h�3�WY�/Ѽ9�QS,�Ȋ��~X=ޙ��Ι��1����cͱ��<�(��L%=�
�i�˼��\���p`��I`LSc��-# ��2�a��?e<�ဨRS�λw���;?��iW����'�t"�Dki�kw��5�L8�N��,�¤�X�~�����5%��l�_//�gGd��^��ѳ�!p(���Fv���j}1��>WШ�s��R����u|���E�E��na��?H�=��7�_�{�Wp�!�W��6�9�~��8��Gӥ+hJ�Ƈ��=3��h>>��YjT=�>�ӽ����>Y��7�m\ 	pJʗ�_���D�ѧ*�,AwD�	��MU�H��f�n���c��R��=M���%��)����G�+�f��ӫ�|���v��ɭ�K�K���6Ŕ.���;�6���{�!S�i#��b0/R��#����~T��f%���i|7k0ҙӵ��!�J=5\D�� ��PT�Q1lDA$�c}� �ބ�!�����Atwh�S����>����(�j�n�8i�#�o��Juw�����/�䡡T�:k�޲�J�d�JC��(q�����d?��= C�}���H��,O��)��F8���R>����,���5���d� ���\H�`V��-�zMLN�_�F�g�,.�=&4᫞M�8�>����6���^ �xH��Y���_
05�I?"(��;\M)6�1Э�Rk�R�W@gݎ�P�%��_�R%\J@��b���-�M	�y��3:|�%2
;s],�1�>��v���^ǰiG��Z��q��\��{��Z8���5leg�Ѭ�i����ؙ�	�z�YW0�I�\��"+�0\G��,�[�"��w饂�10������{��6�#�U�.�7>��21Z�Cՠ�W�
���A�]�$�r�Y�^��sfȹy~<w�N �4�����P)<o�_�\�$��\����&]Zt�( _·����5#���<
��z�����}녰7���y�#�߂~L�-�76ǋ3Nʏ0'�ʝ?��O��W׆�ʄO��-�dGW
�e:�oo&�eh��J���Z�I�+���-%�q���.-��Dl\���_�e�%��'�$�2���U��-�6�/�g7V/���!|�r@��m~�/�0��h��4 ���0��͞������[ EɘkE�D�ʡ�\�mjAE��B�!��qվD��l�h��ޣZ*Θ,��s<� ��w��4
����@����څ���D�=��*q�/%�̠b� m^��[zӝ���Oh����,��x_���o�9���t_6��ag���Е·y��$uƒ"e������8���"�E����tԇ�3*���h�w��AFNl��M�zGE��(�:��ca.��-�f����F�v��c�'u�<it:��}[�7��8zl[t�����IwI�"�_�����;<Of�r⌯�?�a�^]�\rx��j��?�*#�͗svQcx��!�~qV��c��M�	�6�������iD���Y���	`@�XyV�j=?��{��$v�w#c�I��F����\��V0s&��x��?%�W���i�{�1�>'pQ��ϳױ�
��_�Φ'�Q�C��"�m���暼��D@�I�Š��n�R��rO2�X;�.Ԉ�Q�/U\ɪ&����3}.��C@Ҹ��y��|PdR�N��N��7b ��Tf�)9�������l��s������f*�4��M��h���t�
�:Ø����=KTy���y +x{+��#���(Y���}Q��G?�OG\��%J��k.����ֶ>.Qk��5z�,v�2��~@k�����GB�G��s�l�cɳ�* n�J�'B����;>@�fÖ�_b9V�om-}�5�zw9�K�Jj���͇��(:��*��"ʘ��a��_Q��4�D%�Hb�ݰ`�1<OEΣ�f��s�1�9��>E{|�Y���L����j�&�J���a~M��?24X�y����يIMl�"��3���wbN��������]X!Cw ���&f��+�u�I�&������"�?nᵒ0
5iv1��XL���<���yw�������Z }�:�&�fN|Y�B��S�J�p�-;�r��c։h.��ΒOU�tr�g�H�=4��V0Rr`%�汫kI(�#?LE�W�M02zf��X�Q��2'sv	I\D���[�� ŏc�܁/>�L��מ�N#+� �v�,���{����U����b��%��NoF#�YF��zO6C����O
C/;�{W
Ir7n�@�P�dX� &W���Nd�!S,����ᴇ���+jc�݁/HY�Q��(hF�m�P�Ӈ暕 T ��t���H��O���Qr��NE=���!��t�Ih�I4Y��Y��7�Z�9X*%M��wN�����)�G�wAxD�Bڲ��Ka���e�:X�ǎ�F�PC�������"e���^lq���2�
��N��i�u��vv4��ݗ�@˚c`1���A�
# ���ۡ���%3��93�@��P�k~MwBE!���&q[
���[/��t��v�F��*t댓�8�U��m�8t�eR_Cb�'l+��#V��5W��c�>h�]�8�OR�wp��+:���c%�"��Jb �7����W�����ʯw�W�WH����S�g�=�~ �7��ؿ��J�"�t��X����v�3�g=l�/��B~��W��'�������
�O�6��w�~!Zp��.����Q,{�&�D:�:���\�\��������E�����\��+�r���ڶ1#��T,��M���<���\`��o�Kҗ
�9�oo��'z�����	
�-�F��7E �GEs
�UY�Ds�Z����i�9��N Ico�u�־,W	�����z�7��0k`�av�e�j.dl��6�ut�J��R���G��-��͟��&;
�A �j=�������*�Np^f<_�1k��� �����5��ef�^i�_�,ӂRF/�Dϑ�glR�oU�++���0ܴ��=���~���?#Rm&��-��BB�]�܀k�/��a���+��Q0u<�	�<��+g����(nC2�Ɍ}�2Z 0�6s
diT5Z����~+yf@Q���?� ���;0k�G(�GY�m�&D;�����
��DU7RH�|�JH�Ĭ+��:`��eL�p���fܬ�KB�%3j��4Zq~�N ɐ�U�F(�
���7�MO�����V�y)�-��y^���P4������R4c�Qd�9�� ��7�)H��Qy�\��$M���������=�z�h $�c���}^{Ff��h?�l��1��U��6�����Q��jX�W�5���
'�VWqlTI��/�_!җ���pO����} ��	�"j��^��1`!5t�R�0m���|�'^=����?�zd�Py��b�I�4��W�2�+X�gt�M%�f
3�?��̡cK�Iy�\U*�������oS�={�*nb�)j�&'g&F�=���>��@�$#�GJ�[>с��c�X|���I0��:�����ؑ��^i��}�P
��it�^����2��x��41W��bX��{'4��������̄^q�:������e��jWu]'�0�;u�_�D_Ƕҍ�m��$��-���yt�W��o֚��s�d�O�gץ���_3k�ʦ98,V��ii��4~.���n���^1���W�
soB٬~ *[u2<+�6$��E�������������̅]ޟ^jZ��
�PE��7�ѵ�R�I�O��jP�{
W0� ;�}���죚��*��Y����Cl�[q[��+��ਫ਼$�R��DEEilG�b<�^��}���,c&&;�\�W������Q%S �MEvǚmeGϦq��&�}�����������؉��U�e.I�D����C6��;�ˮ��,!\�F�7Ԍ`��ƫ*м;�]8I�E���U��������   �A��$�TL#� �I�{���U=C����h�0)@>�/�$&*O��P˗@�J݁���0ם�
�Ey���Q��Q_너�D �C����]�U�H[v�i���D�B��K�q�k��;_�ܓ���l���&Z���;���n�Ih�S�]qs�U��)@p�-��ڞ��%�jh�銊$�5�D������'a���ўei�'�����a�i�F��M�Q
�S��5������|C 
gOh�W���+ ��+GL�ob�	��ݰU[�v�w)���BM����B��K�q��[�kʂV��AtG2������?A��Ƀ�/���H�Ǣ�hCiY|%  ��)� �bi��;7��K���+u2B�` <��NP䖨*�a���o�.�yZE�K��M�R6�����J㼧�?2�8~�0z=?*�e>B�J��cR��iȍ�����ʋ���ĀS%@�fx�n�̦���q�b]��e\�v�AiײiB�rϽ��PQ�C8sPr�61�(���h�#»�TE	{���u��P�W` 4��%�B�^�5�	K
�Q���~Q�zG@t&�1��g\�\�