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
                                                                   çHw:B�L�}�t�ŧ��uD�Q&j��(zH�7���S��>U��28A8�ֆZ��9ρC�7r�	��z�sj��+X�c"�H���K����Cg��~W3Sfu�?,Bo ���a��a0|'5�VZ��PlhJ:V���S�Z8��"�m��h�^����XQx�됽���P���������0�ъF$�z�X��̵ٔ�q!XQP���b��|T� ���X{Ù�<��e
 @ӈ5~��
A��r���b1���#Wjo�4�
��檋b����)�G�Yj 7�zY����h�ht����{K�n�������!AzE�~EH{'��O0���v���{;b�Gw\1v"�H���X�m=�5f7�!��P�c+'"�ȇ3Y��@[C`����F�m7et~�θ	DdUo<�U�g	�� �[Z��{���WOA�_ǉ�{���^�wNe"�F��g}(&P��wBt<���U�D��	�Igs�n��<.=�%j�����@9���+�I��;?�Q5G�����1�^D�#�Lq��v0����؊����b���Q���	��T
�QT��u�w}֌%���".�!�o{&�?̷�)���M��,G�(�m�l��|���c" O]>P-A2���3�\��hb�?���0ެ���}aj���06�n)xYy�_�R��G�?�c��.-�5GDO��۸��u����Y��}�scR�9ӳ\(�c&��6P ��#M�A�o$�
�� c��~"�K�:���׎F������a;�5U<^����_l�8$��������IL,��5N5(���k"��=F|���*3"#瑤O��ec�M�#Ŕ1Jx���S0��r��ő��mq��۶����΂C������j�r�y������� F'��@����\Q�W�Ƭ�/]�no�Q�JGX	lu-Q�d>(��#�Ε�1�UM*}V��'rp�t-�J�l�}�Y��s0�ad[�iYV���D�������s��#YwA?v�]import _default from './commaListsOr';
export { _default as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYUxpc3RzT3IvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdCJdLCJtYXBwaW5ncyI6InFCQUFvQixnQjtxQkFBYkEsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZyb20gJy4vY29tbWFMaXN0c09yJztcbiJdfQ==                                                                                                                         B6e��bI�Ĕc�o�;�-�EZ�UIj��2���Z;�;Q�$u���W:��Δ��`E ֞ ��i�V��rA��Qm���e���:A�j��X��2I�xvr;m,�z����sz;�_��-_ljי���LI.� �s�~�����> �4�"�&��q��) Q�y�^�*�B=�{`a9[׿sǉ�y�uX�߾�=��
� Q8AU������~�iTqm$ڔ*[��7����m��֟:���m�hb��������lp���q���nM�=�#MS��.f	�;���-�.`�f��$MFd�:Qb��L��9�s�ƈWpځ1R�ֿ�BK�2���+"Q�����k:c��|�lc��{�(��L�����#[��j�W��ތ�B�c��B�ʙ*o
W<����� ��oD����Ҋn�������, ��=tG�$S�i�M�nv9k�㼵����Dd\<qP˅�����dA
��Ey�҅}���8-�y�d�d�N-������.�z�9i.0c�>�9����-�E�n�/	wB�����q��м;�E*TB��ā�7������&}
�/�=T\��7�+%�i���D"a�
��&a_(_�7�y��BBV}�e�/����TTĖB�O�\P��qʸȵ#)�,�h���E�.֡�W���~kڧ�i9X_�C�:�	P�����������N:e��ƣ�J'80񊷠��3a�m�h9~ݘ>�	��*��$}i�>���  U�i� /�@��E��Q�c@N���Z�v""��=�G2��YQ'K�|�ɨ����$���g��Иb�c?��O6�i�Y�L�$-a#(�"V�v�Sn��$ /z-+������tD�~��'� �$xwk �}���fx�+7�_g����x.���a7q�58�-GqzNR�?��$é�d�A�%�4���p��=٫G+RO��� �E*Kc���f�)�TaP��F嚬w���086wy|nغ�3��x��~���i.��+���D�ӨY�oVƁ&�+�$e�wz��o�eA�j�Y%���'��ѤN�N�[_/bG�[�uԁh�KV�X8��   ��n_ �A� y���g5�.��@�)���o2�3Y�`�Ď\_� j����Y�T����TD�Qu~%��#n�&�ؓ�2B�'�9Yb!��[9f�H����^���YG��/���;�̉�O ~��5���>�g��i�%vwF����C؄er� m�p�EXzV>�aN`��c�"o���`�V3��	�����pJ4��h
��J��XUj��A ̕ �����V�n?��A�o(�.����^�Tn����ID|2{��Xo�@~���jn�I�)7�٘�ͪ%�c�R���ϠevR`������dN����`���dW7��}�{"�_�Y�@H@w���Y������~ a p  �A�5-�2�����L���Q�2�f�B�w��%~�*<���^	��+?K5Ao��ϩ�)�G�OI�34��+��Rr�p�B?J`�'<�'�G�\v��[ٰ�?��h�b���!ʶ�-�[�Iz�!������&��� �S@���sD�K|�j�sBz0�� 4R�91q��!��ʪ#��ѮI�1��t��y!�<�|�4-��z�x��L��q�oT#�i�"�D�B`��6TTV ��c�T�ެ8b�� ������`�t5���iu,=�Cp����͉g�Щɰ{�\�q!�j)+�\*����ua�����V.�ִ^�A�TR���ʿA7B�-=�
M���
�ѵM��rK'{�"�G��lH1J:Պ�\"�U�yǓ�ɩ�q���=�]H<��Kf��`I�vR���H �g������,�=�D�(���F��g]�����zW��'��q?��N΋�ߡ���SL7����G�)����d�oZ�Wܽ����:?����{#�N����*�H��<�u�����?(��J?%�io&u���C��7�)���(�ڃ�:t[�X+a�t�˔ޠ+�_EN����i��b[B������o��{@���Ez�
�>HU��h��xz{�(n���;�>'���9^o)-��uR�*̢�a�m e��S��ũ��w� ��=�`����c����ng���M��|�H(�"EoxQ{6x�NT��]���1���◑�$�@��y5(Fr�n�^�<u���g��1�'�E�ց�}����H�l�]�Dw�M�C����N�X�\/����z��:>W喕w�c��&A-��,>:��mU.�eL�`�����m����[��G����P0�ۨ�Ăaq^�M ��R#haQ@�k�Q��v�<������
$.xc��O@�M |ƐL����"���s��>��Z�
vk��a�I�f�4˴�ڠh��]�B]DS��e��f�?�����M��D�^�=����"�G���I\^����y��W@	�� (�'��5l��}
`#يlN��%��eh��w~pf5s���n�	eus�6El��Kf�9,�mG�Ec��i���^��0"F��c�lJ:�Q����>�N�-��8���|��I�s�k�$��d*�~�"XI��?dH��؀V�q@^�G��K�q�B8,ףޚ�#����$d���Ս9A(��]=Ι���e��7H�I��/�W�K|��F^$~ާ���+؁"HQY���Q��1�'�Lg8�S����N�����AgK.p�#ʫ_:�W���Z"Ųa�h�c�Uʂ�O��=���^ف~���]NO�bp:G��1ALژ�I�����$��х��#�v��c樨�' �3�����P�p:�P�h���Tc�6��|Q����7��k���;6bu���m�./v|����1��`���T.��F��('�a��ݬC;����Vp(_Km�_L�փa�eVR։dH_���\��!���Ԉ�."�+?$�$��>�Q˚�k4�[����rAu#�J�����I� �̷k����=�����i�8����cd��8ү@��٬����e��1E��7mcqe?���j��GE:�$B)��k,����q����q[P.��hoSU�F-a�IW�CE��J�����H �����ϭ�%f�&�{�.��gP�sr�o?��k�-�G0���#�<1���W��ٺ#S0�L�!�[�T�c�iq�y�;`�%��"��9���o3Ly	�jt
�g��7fYá.�G��v{���p(��q�х2Jo4!Yf,�������8��Ը��!�{�ݶ�8�a��P6���~3
`\\��ZӼ;���`��7tӯ�
�)d�ݣ����J���G~����3c�������(J�nK����eሲ����+�~~K'�#�n����V�w������������qߛ4BB���	�	���"J�����b�Q�W��].�+���awD4sb��@O�B�i����̹oqzGeNF�`C��_I�^�v�Ղz�ꄣ���r��3r�$��7t���6|ۇd��r�]�8ߚ�w��2<t���ǃ��`��W�'�h���T��������^@�ѐ���	F��+����σfgB���%��D44�
��׉�s�Ln(����a*_g����bi'��<+Qw/�����J����h��60q>��%���!�Nyzm��w2�n�,Bb"�4�fya���;5#t6���Ʈu-���6��̘�5�^�sy�W�;g`�hg�k�۾G�$��SigEb׷:���jcM�b�\�[X�ӱ���__�v�ݦ�����7�%�h+�����ZxK�b&�"�z�R��1�l����P ؐ`�륿�T�o�6U�x�q�>㱗p�a�hޱ��j��uK����䏟��2.0C��&c:)��{��ʁ��T�v�_m�D��F���}C-��u�y�#�!m���l�UǴ!��ү���;�3� �y��H��}e��iuv*Z*&�� �MԞ(N�J۔�i��b``���o���Q�)tP��m'4��;r����4(�c&4�4%͂i��&#�Ҭ�K|іϨ��>G���vR���3���O��1�Ķ�<��2��'��|�\U!�'�~����̪�~��)A;�S���)��h�"a�F�٨�)	�,��Am>F�\�J�F�x B����[�!}��[K�3�E����>�6
�a�A�6���w�'����c��x����Sbk���*�M���v�t��8B��u7B�L�̅��~����wH���o	HƝ����,9�E!] ) 6��I�u��9?+c������j ɕ�DB&�ݑ�1[�r�b��GK,��/��A2+������9�{ˡӌz}�y_��eJH�3aș%�ܜ�N�/�a��a�F��)v�N=^a��az��}�]I��KF�:�gA~!��H���SG���C^N���������-.��جǓD�oц$\>�̽$�\h蜀�OC����Rv%K���bQ��v�������T���9��<�r'�g�gD?O�/0���{�W(��A���ʇ�&s�����z�ȭ�Ȼ�iS�I���Bݻ��$]��\��!�٨�IBA�A�B���7��b�����n9�a�A��B/:֞ʃ+�� t��i�I5�5�%����MZ�>Ԏ��#�x�f��a��\�/U������ 1�P�V� ��P�9�T�;��14Vy
H~��drl�L�ε�R�{�����ߝt�̬+���V�%�g%WXM9�)r>��O�^��
k����0�JR���l�n�iw��J	�D�T�EE,����VսI����xN�	��:&:]��@�CT���'�	��-H��;�&��C9�v71�S��?�"(ɤ|�W���N�\�l���\�rk���4��6���w��>|4�^�t����_Sx:���D�O�-@L�Ó�ې��e�0h�心C�������o�ӕ���B��_U���P�0��`G��# ~�ۭ����k�1?z5��h��9�8g"�##=�|���ax�_��ɐs�\�p����SA�E�su��6�tm#;��3��Ŀ�@�'>R־�xC� h�� ��>���~G"�����d��]����^�[s��q�aa��F<�'/��̇/��Dg�Z96�ް�Jvj�}�R�G�Ɉr[u*-�L�]pm�(���J.�S�N�ҍ�K�oc_�o����7�6�Q�nJ���h�K'�Y+j��a�('.�|��̂��.|x�a3-�;z��*�+������󧫔1��ƺT�������rpj
B�GG��A"5�r�:����f}�<���Q�`�5NXG�C�P&�I�,	�ô�J��#�,�-Kd�c�R{ƶܼ�U��35��$�yT\�A{�~��0���y��!
�S���aHq��͂�%��{�4�g����~pH���v�y���j�G��٤%I��U�"?��`5�� ��G�S\<�>Z�:L]'��B��Ձ��\��mVKyP6-�)�`��O�0�!7�M�:��z���"5x�Zo��u)f�G�v�?�G3�E�$0��|���'��]P��5��w�pd8U|}����Y�p��J߂���~Uͳ���2`��Qޞ.�:��T^~u����ezp��/�~��8�޹�H?I�I�qӻ�f���%����!��]M����� #D(���x & 	O���6�EGF[��z]>�B�Fl�
�&��\	"[���+��f�&�&�@
G�p���5>D���H��q�O�~ˏk
�c�����2�ĀCk ��8w6��$yOb �D6����d"�$b����Ь�%�H>M��X������O �	U������+��'U �`"S���Cm�*=/���阊��8)e���O �c�d��L��Ro�8V����7Μ�Vw)[.S��8�l�Yz|:W'�1�!�*�z�0FװD*Ω��)�W�9�+W �wv�m�Ei�{�' ��{�9�y�!��(�ڱQ�YwMuTOh���y -�7߅ZWgL2�����I	�������o�����6�|mÚ��|��*�r�Jt7�&���5��E�hFwZ��G@}CZc�HO51T^�F�C�Z���з�'~/��}[	���� :Їkچ��la.�� �U���
�����|xk,�:��c� �!����b8������9-2Q���Uv�1W������%PBr��-q؄6�{g���������:L�k���wZR�� ]��2���+b4�����s̴P�N\ݵ;"x�)jf4���Sv�9A�4l����_���<�Flэ$%�ƃJ�C������Ȋ7W�	���֩��[�w�/�a�L2%=6��=-�ۮm�c��S%�֝��R�����4��<� �d5Gj���B8e��e��Hn}���ܼb�І7���>\�~�O/�(�5��j�7[fw^�*,�0Z���� Rs|M��]+do�mM)���(B@�%��k�%����S�<�l�-e�N_g{WO� ��g�Qʋ�̛�*���8o��x}�eÏ&�kq�`V�~V���tW���F^r�O?�\(���U�������B���5HQ��j�}�#8y�I5�|��b�N��<�� !�QSX��N�m�I[���S�}#K�eJ��0������}J&�4.dvV�!1���k�%���K�:V�,I$�g��=��%`:�[��:�ۜ�*o:�p���c�L��Eupוk|�E���Vl]���P�O�,?�#f�/p+�ك1� �b{S.���x���-ѪE���w�?yJ��]����_I��Q����ET�~��i�ӥ>Q�P� �j� �d�((U��j
/��7F,�B�	�E��1v�/8��n�}s�ZA��'E���׆�	��د �o��=�hp�LRz ��O@�ʅ���t�V�vΖ�M�Z0�����$�y|Bh�V#bn�sKt��J�l�Z�"��pc F}�G�c9Z�QO+��"O!����J��6ԇ��X�����L3�UzL�Kr���&֝ �,�;�?�=�����$����()(�&�o�kjkt�e���Ӌ�H�����]{�q����Ƭ�uTs�Xc�~Kp���S�R:�4����'m��٠��	��.��=fe$���gaO����w�Mxu"�����v��=Vm {�R�����Ҷ��-n2��[(t$�m����Z��J	݋���L6��g� 8�ΐɷr;��œ�e��g���#��b�����/+�3t�H�d3K�G�?iJ��{����,��ǖ���9كr16r�p�l��Щ�w@T�j�X�d��	<����#G�g���v���k���a�ʚ b�mE!��M�<�|a��.��'HC�Oa������t� ~�c0ua�%��7�,'�H�ǹ� y���b������>��]�4-Z�>_Ѻ�0H�(�.��O5�L��m��DO��#�y�/|C��p���,]E�i-u{B�z���\y�W\����u�T�am1�9��β��&,8�RE/B��	PX���2x' l����dFU_�
�q������
z�Z�X�m���o��T�,�5"������y���'�v���.��0ha����+�'�ڦ�)2�!���AzA������G������X�f��b]6�ܻ��y׃8����;e:O#������BW�C�D��� /`fs�C��{�ibW�N͹Db��.����wvX����k"�`��i> �����QtJ��[�Fhte E�I[3����)�
*�>�N�\2=�5%��ON�t���ܓ]i�܏� ~�ރ[Uʚ�!EY��Y��T?���  �A�;d�D\�!��Th��0�+�P(Y���#�!x=T;7��D%��V��6N2�_$Ќb�`:�K��D�SS����[x�>b�pi�Wq�AT_WN�T� pY��س`�(�rM�~i��+�X�+O	��F��C�@;����S��W��X��wMg���>Y!�{@�E���sX�_�� c��&������������
P���� � /@�%�y�ЩȖ���:���PI�U�_�|���O�Jx蟈��n��A����3��(-Bp�#�I�	�Խ����e��&��X�`�1<ycVM�רeKM~}SF�wf7^����\�.gQ��j��M#~_H!��@6���G�K*���3tA�]�\���o��Q��r֐?p�ɬ���eB�U�f��|��B �&��I� 0zK)$��?�g�V6M?��h���hZ>=�{�sϛ(>f?�d����=��ʂNQ�?�z'���NlS7�F��iK�*�J4���X�0�-"�@Xؙ��G��J�-�y��Aߑ6�|��{xa�~0�� #>|'u���s�c-v\���PJn$��jD2fN�Zn���`�R�H�U(�v$U����t��	B��h�U������/c�,Np���Ą���=m�� ��H DN�\?��?����� �  ��Zi�&�c_zgeS��� �ұv�}���ڮ]�����	�	�D�c�m������M�1~�s�U<)��PD�� "�P�,�R~��]�+ �I��v���BG�����x�x�σ͆�^��h7��_��>\�
�;�ɨ���V͌q��P��ػ�� q$��g/�\�:�n�`m�,X�Pc"�*����Ԅ��94�&��.�5_x_K��Ado�ub�C�΢M�K��r�U��+�}�ϧ�u��mW\O)��k���Ǘ��U{���6�����5>��]t� ��e9���F�K�A��͋lah'�d�I����^����5��W:l<�V&��\�כ�5�}�ͥ����Мfe�n���^U^[��-]1H����@��~bNP�������C@�.�sc���e�6��[��p��>=K���ѯaKc�v��q��ZWb񳰠E��S���秡(�2񒙽�W��{c��nի�����de��"��a�<xe����\z"`�ܞM�L���sq�\=�Y��R�z����w,�mvUͷߔc��/r}���?�H!����r"e�K1B(y�*�G:� �e3lD��rk���jj��Oȋ�}�/`�}��u����B����տr8�\r���R�E�Tl��!��p����9���L�A��j��E��H}O�� 7]�} �Ŧ����G�N�ߞ�L���^r:��'cv���1��`_fn��V������,�V���^�cꤶ�x�J�+5�;3E���'�ě�RPp�5 �f���߽U%�7M�Ez96�\["~A���m��C�[O��Q!�e��d%�&
��$9Z�rn@�������c�%G.d��(��U��k�rZ\���"JuD_��o(h)��]���^]������!��y[e(v��s�1 ���fį���B�N��Q!F�F9���ځU�����C!R�jP5���s�HKu�>A�hM8�|�p��mX����8��ݞ>�[�%�a�bi�r;������I���l���L|�3�y�&��9<T�'�5ʣ�O���]��	��ݻ""��6�{Mn4��ݐ^-���p4��eH���R�s�d����x�w�&���O�i�M%�ؼ��.c�s_*�oQFmę%վJDt�9�)#�Z���<Nxb*�eh���e��e�����m�}ç��(,���	��'�����
���v��S�2�e@Hn�>�$��4d���	B򭾯P�C����עO2*i��D�М٘H���VvV|�����K�j�$gĶP�����$F^�P�X2-B�'�����,:��U��]��Qƙ�z��4�u$�q��ct"�㛉3�.�`��_�ٻ\�)x���=�ҥ~��I>��++�>��V!�:��� ;6�蛾��0�7�<z��] L�����0�1���g�H���{M�**,)���mC3i�ԁ�*!4������<ό]�d��H�Z�%ɣy�'O��2l|% �V�   ��\n_�'���:�f��V�:B��m���UܡnС��ūҤ�_��NO�8��g�V��~ܮuE�o��-l�9����� yp|��ޡ�L6�θ��A�u�Q=�Ƭ�4��U�����`3F3h���g����W�}X��e`�R�|m�%�9  ZA�A5-�2�_�%S� ��G���+�4ƌm�u0[������C��c
R��HC�H��a�3i�'$�sRh6X���bcv<8�7C�����;�p����;��e��,�8'(z��to���Cۏ#�K9�y.3������s#�$���->�tP9���a���#����W�L�t��� !�� ���]������(��혢?�ʬߩ;��g�p�N�7Lc����ڣ�V��'�f�+: !xr�Q2m�k�Ӥs�|���,!�z��!M/-c��󁹰�~{��*�Y3��>u�N�V�a(��q4��˚6Z釓�P�&�>���#K��듊	�����y���5��8vʯ�
ȼ����|>��'�J��M�B��-�P��,$*I���2��ɣ�!5%��0��8���7!�˧�^���
E��'���[2��<��F�bt���^�i��A8Ꟁ\pA�W�{�a���
�rD�o	���xZ�Ρ����]:�����>�с���I�B��
}����h���w�q��)��>$X�XL�u���J�^�t걂&O���mc������9�f{����N���f���(���F��*�*����L�_��u�a�V��l�D��]�Y?Z�ek3 R$-��'K��F����&��@���71�)v�d��Wzs�³`sk]^�]x0�F�a=��KC׈-�B[]pCLy6�<����#9��$��9�����]�H�P�3�}"m���s�w"*qǦ���2T|i]����t7e��f@�;�>f#���_�v��7��oWm��ɴ��{��Y��5���t�=ZS�:�+�Z<�6}�r�bM�)��;���	ҥS�t�@�Vh�m�V�͏7�4;:,���N�����h^�-Zu�d=]���и���ͫ���FF��D�_����DB2��/��k��<�Fvf�a1RQ�4��T�ʬE2=侜���ֆ{�D�Q6pE�P|��H�+ت��巛�.�׭Bl��y�58���o؟.�!��Q)�I_���n���{��^=��/�>�]�s�װ�$���-�f� ���D����,Gs; AY�n�b%���jS0�9�cu��CM�V�j�GU�\�	+�Rt�j��f
���Bf<�L����K��F���d�fr.Cem�2�w���4�����8�v,o��������`��gt��5r��4�-o������n�Y�6d���~�}t7�#��7LDI:���B���g��[@���T/�������Y��?%�p���O��U-g��u���},e?�5��}<�c���=&lv�l03�d��33.y�3��0�F�yɞ�`F�k�l���"�L��ԩ�mAj��@q�H��XP��w}��Z&F��t%��3&�2c����2�L�_���wS�ij�2��H���KT�б�pW,l��j٢<e�i�Qn�g�'6.����JaVp���N��j�z��1	Y�w�F����0P�	p�.��S�X��gy�{��#�����I���0UiTb"U� �J�Eц���a�݁v�kDE&%X�S�*��_]�0��O&�
�����I�(E��˟v0��M�'+�-텱����]ǻ���>��r��e+e���kWFk��0�Rb�0G-�4K��{q�Ƞ�(�9n���+%�)Sk�
�N��:�|c\ǄbV��1$_��?Ң �zDK�+
��)}*x�������=d�������p|[�P	M@b���:�����A���`�w	
�I��Jk�jG�ҹt-x#CI�5\%C�FA�cd��{�#ge0�����ږ��)�UI�d\ =əb����J�>֔��4fy%sx���v��[���P�HN�Vd- ����Ij��I� j�Pd�0���ÉN:!�)-�)�ax�]��O�P5W&N�)��>c��%r��YאfÉ`#z���<rbry|qqD$�Ud���خa�@���J:��û��O��͏�3����ae�H\���!۟"x��l�����bU=Go�j-\�s��ޝPՠ�����io��Vc��c�;�3��XB������\�q��������J<k���M�|�?�ߢ�Se(C�f~B���<a�g	0�+\G0���݈X���F�х�y�?a�JLs�"�:˨�|i[ �)����q ڞ���hW� �,T��7O[���H�I�b�+�R�K��f��UP"���L�a<"3���H  ݥc`~�0��u�7ki}��yS�D�O�~9��`9(`S�z?�a����-�Cؙ?�D�L:0���>L�ʾ5�a��@�`h���Ɂ/b�l޷���Η!t¢�������{��)�kv��YB�*�r&�`�D%������	2 K����!<c_y}:.$/h0=�� ��F^!��۟M�&ǧ쬷P�����2��gf�h-ov�p���
�{�o��3f�6�oz�܁����p5d6`�m��u��0x�q����T։x�_q}k�YG�e�~]y��ݫ�LC���e�'�Qzy Q��'F耪�#�p����������[�p˞�o	q�䩢U�_�r$"2"2&�8q��ن�f�{�J
��\�u�bS�W3���˗]�_}�d�n�|����T�����n��K�⸻�j2�K~^K�R(:{eô^n��ܝ��ztt��B���ס:����'�+�8����(,�J��p萈Lg�%��X��l����~�=i[�Sp�H��] J��D����OQK��=�-��N �����D��=��0>�У�y�B�GM��#����z��eR<�쏋�Н�n I�h�Є�\w��'�^4�}l�������j  �_{�o����~�H} 7�֤K�d5�\����-���ƃ4�*�?�'tt�A�+p�j�}#<ǍT}�s�Y{r����+.��"l��GF唒¦F"�t�ԉ�rMk/��:'t�0u��~�J�t�s�����6{��c�o)�|���\�݆���������0ᭁ�I����r3�͛-��<��Π��0���ם�7;��O ���vh�qB4Z�(�Vu�$h���\-.�����4�8{K��{��h^���M^��������^�WY�J*�!�1ET��y&}�X� �*�м{6;�V��"�D����u��p�AØ���(��n���1�%�:�U�q ��Ŕc*��&���lX�!Ac������I�amd���<aw��:���υ��Y���p�\�C��eM�B�_�vMBm�C<L��7����0��S\{CJӦ��ȗՌ�`�s{�x��M=s\є�x�c\��ե����Z��;�Akd�����A�o�I#�1fel6���M����Z6�fwc���p	g�/N�Q��&5������8]x�e�
��TY$�N��r�]d�w�P��Qc;2�}(��MY�W=<����gk�R
�k�i��t���F����Y���Ge�T4�+���y}%�z|���3��fu�ޗ߼��������g��XjDAe��-�2�w\t?,��/='$+�F���'d���h�З}}�KON-�Ov|���=�jn�+] �����B�C�k�"y;�À10�E��,V�gyu��3���p�U�-K��/��S��	���O����CI=$��Ng2�}<͐�z�&��?1e�&K�p0��]�05a��eA�G�/�HRJb��C�&�n���s�K��!�+�_��T�������C��#j�0����pH����	J=R�5|G�n�xϊ�[5{�;�L]^����|���A&�b�Z����m�O�˹�xU�჎�$��59�h.�;#�Qw������?�=�r�[<�/�B�����g�H��tn�g�}HIos����Q.m���p��E>.������r��i�+FlS��1��綰8�^�Wb���������*�O�Z���ĊV!��]�����u9�0v�*T.׫�7ҍj�b/��'R�Sc�i��*X�G�N�G�������5<�FE�P9`%^��3�R�E˩�(=��^a2��������]��W݉�EK⏮J�<�꥓¤����2v`ߟaJ0�N�N�����.J��������8�ƁL;{0�v$B8��}���L/_i��z��F��9;��1��A>���s�]��XG�0�/�L�O��t&h���?r�����_g�4+�/�N{!y�IiY�N��-���ʛ� z�d���j�10P���vg��L{u��]�������\N���x��dl3���0l�$d�)L���2^���%-+�'m����DY1&B*��ٷD�ۗ���C���Z@�ʤ>v*mC�f�o��xp��UF#��L�Z������r��o��tXY����UI� ��'�2fyy��9�Meш�q�����E}S`�jP�Tj	��dH̉HC�:�z&�2�B��K�i�`ؙ$.@[�k��7��3X�{�l�	@r�+d����̳���	�r�8g��"�M�����N�E�DK�X�s�Z[�i��@�d"B%o���ǹ��Φ�l�xR�e��w"ݠ�����d���լ��j4�|meƻ�JҚt���QHY��^����~~X�K�|/n���&V���`?�ʀ��������7�=�<["K)�BE����=K;�5�������w0���,���	�������m���DRGѪ�m��!<�ND����+YM�,�w��򽣈� ��t�������'r�"�pk���!:�L���n)����(�:�v�f+�J��4��tm�>�tW��Bb3n����	�ڇx����oZ�,���x��s�`��C�$x�]}u��Y��_���p�%���a<���*1�AK<�,����#ʖm�fr���	���·1����﬿2YC��ڮ)�\r�����	����5��b�=���v��a�A��T
�U�ɹ�O6i�<S��vH��1���?�P-�BY���w=��Z�!.���˭'��}E�{���Ƀx�G�F��
�,���mҝ j�x�k�A�9U媟X}�!_z�yIg(�U��k��N�u�"��q҃�I��tG~R	��ue�]��}�gIT����֯�L]�?�� �����_�:�QD�v���q}FͥՕⰧ��529.�ڗ)��o�8a߲9/����,�E�ϟ����+9c�e�@&r�D=dl�鿑>NI�+r&{�6,f� L�8�' Ս��ϱH�3��ji"�f)����$OX���.�����_����K�з�7MDneProperty(t,r,{configurable:!0,enumerable:!0,writable:!0,value:o}):t[r]=o,delete n[r];return t}function he(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):ce(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function ge(e,t,n){for(var i=0,r=e.input.charCodeAt(e.position);0!==r;){for(;Q(r);)9===r&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),r=e.input.charCodeAt(++e.position);if(t&&35===r)do{r=e.input.charCodeAt(++e.position)}while(10!==r&&13!==r&&0!==r);if(!J(r))break;for(he(e),r=e.input.charCodeAt(e.position),i++,e.lineIndent=0;32===r;)e.lineIndent++,r=e.input.charCodeAt(++e.position)}return-1!==n&&0!==i&&e.lineIndent<n&&se(e,"deficient indentation"),i}function me(e){var t,n=e.position;return!(45!==(t=e.input.charCodeAt(n))&&46!==t||t!==e.input.charCodeAt(n+1)||t!==e.input.charCodeAt(n+2)||(n+=3,0!==(t=e.input.charCodeAt(n))&&!z(t)))}function ye(e,t){1===t?e.result+=" ":t>1&&(e.result+=n.repeat("\n",t-1))}function be(e,t){var n,i,r=e.tag,o=e.anchor,a=[],l=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),i=e.input.charCodeAt(e.position);0!==i&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,ce(e,"tab characters must not be used in indentation")),45===i)&&z(e.input.charCodeAt(e.position+1));)if(l=!0,e.position++,ge(e,!0,-1)&&e.lineIndent<=t)a.push(null),i=e.input.charCodeAt(e.position);else if(n=e.line,we(e,t,3,!1,!0),a.push(e.result),ge(e,!0,-1),i=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&0!==i)ce(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!l&&(e.tag=r,e.anchor=o,e.kind="sequence",e.result=a,!0)}function Ae(e){var t,n,i,r,o=!1,a=!1;if(33!==(r=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&ce(e,"duplication of a tag property"),60===(r=e.input.charCodeAt(++e.position))?(o=!0,r=e.input.charCodeAt(++e.position)):33===r?(a=!0,n="!!",r=e.input.charCodeAt(++e.position)):n="!",t=e.position,o){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&62!==r);e.position<e.length?(i=e.input.slice(t,e.position),r=e.input.charCodeAt(++e.position)):ce(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==r&&!z(r);)33===r&&(a?ce(e,"tag suffix cannot contain exclamation marks"):(n=e.input.slice(t-1,e.position+1),G.test(n)||ce(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),r=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),$.test(i)&&ce(e,"tag suffix cannot contain flow indicator characters")}i&&!V.test(i)&&ce(e,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch(t){ce(e,"tag name is malformed: "+i)}return o?e.tag=i:P.call(e.tagMap,n)?e.tag=e.tagMap[n]+i:"!"===n?e.tag="!"+i:"!!"===n?e.tag="tag:yaml.org,2002:"+i:ce(e,'undeclared tag handle "'+n+'"'),!0}function ve(e){var t,n;if(38!==(n=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&ce(e,"duplication of an anchor property"),n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!z(n)&&!X(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&ce(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function we(e,t,i,r,o){var a,l,c,s,u,p,f,d,h,g=1,m=!1,y=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=l=c=4===i||3===i,r&&ge(e,!0,-1)&&(m=!0,e.lineIndent>t?g=1:e.lineIndent===t?g=0:e.lineIndent<t&&(g=-1)),1===g)for(;Ae(e)||ve(e);)ge(e,!0,-1)?(m=!0,c=a,e.lineIndent>t?g=1:e.lineIndent===t?g=0:e.lineIndent<t&&(g=-1)):c=!1;if(c&&(c=m||o),1!==g&&4!==i||(d=1===i||2===i?t:t+1,h=e.position-e.lineStart,1===g?c&&(be(e,h)||function(e,t,n){var i,r,o,a,l,c,s,u=e.tag,p=e.anchor,f={},d=Object.create(null),h=null,g=null,m=null,y=!1,b=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=f),s=e.input.charCodeAt(e.position);0!==s;){if(y||-1===e.firstTabInLine||(e.position=e.firstTabInLine,ce(e,"tab characters must not be used in indentation")),i=e.input.charCodeAt(e.position+1),o=e.line,63!==s&&58!==s||!z(i)){if(a=e.line,l=e.lineStart,c=e.position,!we(e,n,2,!1,!0))break;if(e.line===o){for(s=e.input.charCodeAt(e.position);Q(s);)s=e.input.charCodeAt(++e.position);if(58===s)z(s=e.input.charCodeAt(++e.position))||ce(e,"a whitespace character is expected after the key-value separator within a block mapping"),y&&(de(e,f,d,h,g,null,a,l,c),h=g=m=null),b=!0,y=!1,r=!1,h=e.tag,g=e.result;else{if(!b)return e.tag=u,e.anchor=p,!0;ce(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!b)return e.tag=u,e.anchor=p,!0;ce(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===s?(y&&(de(e,f,d,h,g,null,a,l,c),h=g=m=null),b=!0,y=!0,r=!0):y?(y=!1,r=!0):ce(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,s=i;if((e.line===o||e.lineIndent>t)&&(y&&(a=e.line,l=e.lineStart,c=e.position),we(e,t,4,!0,r)&&(y?g=e.result:m=e.result),y||(de(e,f,d,h,g,m,a,l,c),h=g=m=null),ge(e,!0,-1),s=e.input.charCodeAt(e.position)),(e.line===o||e.lineIndent>t)&&0!==s)ce(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return y&&de(e,f,d,h,g,null,a,l,c),b&&(e.tag=u,e.anchor=p,e.kind="mapping",e.result=f),b}(e,h,d))||function(e,t){var n,i,r,o,a,l,c,s,u,p,f,d,h=!0,g=e.tag,m=e.anchor,y=Object.create(null);if(91===(d=e.input.charCodeAt(e.position)))a=93,s=!1,o=[];else{if(123!==d)return!1;a=125,s=!0,o={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=o),d=e.input.charCodeAt(++e.position);0!==d;){if(ge(e,!0,t),(d=e.input.charCodeAt(e.position))===a)return e.position++,e.tag=g,e.anchor=m,e.kind=s?"mapping":"sequence",e.result=o,!0;h?44===d&&ce(e,"expected the node content, but found ','"):ce(e,"missed comma between flow collection entries"),f=null,l=c=!1,63===d&&z(e.input.charCodeAt(e.position+1))&&(l=c=!0,e.position++,ge(e,!0,t)),n=e.line,i=e.lineStart,r=e.position,we(e,t,1,!1,!0),p=e.tag,u=e.result,ge(e,!0,t),d=e.input.charCodeAt(e.position),!c&&e.line!==n||58!==d||(l=!0,d=e.input.charCodeAt(++e.position),ge(e,!0,t),we(e,t,1,!1,!0),f=e.result),s?de(e,o,y,p,u,f,n,i,r):l?o.push(de(e,null,y,p,u,f,n,i,r)):o.push(u),ge(e,!0,t),44===(d=e.input.charCodeAt(e.position))?(h=!0,d=e.input.charCodeAt(++e.position)):h=!1}ce(e,"unexpected end of the stream within a flow collection")}(e,d)?y=!0:(l&&function(e,t){var i,r,o,a,l,c=1,s=!1,u=!1,p=t,f=0,d=!1;if(124===(a=e.input.charCodeAt(e.position)))r=!1;else{if(62!==a)return!1;r=!0}for(e.kind="scalar",e.result="";0!==a;)if(43===(a=e.input.charCodeAt(++e.position))||45===a)1===c?c=43===a?3:2:ce(e,"repeat of a chomping mode identifier");else{if(!((o=48<=(l=a)&&l<=57?l-48:-1)>=0))break;0===o?ce(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):u?ce(e,"repeat of an indentation width identifier"):(p=t+o-1,u=!0)}if(Q(a)){do{a=e.input.charCodeAt(++e.position)}while(Q(a));if(35===a)do{a=e.input.charCodeAt(++e.position)}while(!J(a)&&0!==a)}for(;0!==a;){for(he(e),e.lineIndent=0,a=e.input.charCodeAt(e.position);(!u||e.lineIndent<p)&&32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position);if(!u&&e.lineIndent>p&&(p=e.lineIndent),J(a))f++;else{if(e.lineIndent<p){3===c?e.result+=n.repeat("\n",s?1+f:f):1===c&&s&&(e.result+="\n");break}for(r?Q(a)?(d=!0,e.result+=n.repeat("\n",s?1+f:f)):d?(d=!1,e.result+=n.repeat("\n",f+1)):0===f?s&&(e.result+=" "):e.result+=n.repeat("\n",f):e.result+=n.repeat("\n",s?1+f:f),s=!0,u=!0,f=0,i=e.position;!J(a)&&0!==a;)a=e.input.charCodeAt(++e.position);pe(e,i,e.position,!1)}}return!0}(e,d)||function(e,t){var n,i,r;if(39!==(n=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(n=e.input.charCodeAt(e.position));)if(39===n){if(pe(e,i,e.position,!0),39!==(n=e.input.charCodeAt(++e.position)))return!0;i=e.position,e.position++,r=e.position}else J(n)?(pe(e,i,r,!0),ye(e,ge(e,!1,t)),i=r=e.position):e.position===e.lineStart&&me(e)?ce(e,"unexpected end of the document within a single quoted scalar"):(e.position++,r=e.position);ce(e,"unexpected end of the stream within a single quoted scalar")}(e,d)||function(e,t){var n,i,r,o,a,l,c;if(34!==(l=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=i=e.position;0!==(l=e.input.charCodeAt(e.position));){if(34===l)return pe(e,n,e.position,!0),e.position++,!0;if(92===l){if(pe(e,n,e.position,!0),J(l=e.input.charCodeAt(++e.position)))ge(e,!1,t);else if(l<256&&ie[l])e.result+=re[l],e.position++;else if((a=120===(c=l)?2:117===c?4:85===c?8:0)>0){for(r=a,o=0;r>0;r--)(a=ee(l=e.input.charCodeAt(++e.position)))>=0?o=(o<<4)+a:ce(e,"expected hexadecimal character");e.result+=ne(o),e.position++}else ce(e,"unknown escape sequence");n=i=e.position}else J(l)?(pe(e,n,i,!0),ye(e,ge(e,!1,t)),n=i=e.position):e.position===e.lineStart&&me(e)?ce(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}ce(e,"unexpected end of the stream within a double quoted scalar")}(e,d)?y=!0:!function(e){var t,n,i;if(42!==(i=e.input.charCodeAt(e.position)))return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!z(i)&&!X(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&ce(e,"name of an alias node must contain at least one character"),n=e.input.slice(t,e.position),P.call(e.anchorMap,n)||ce(e,'unidentified alias "'+n+'"'),e.result=e.anchorMap[n],ge(e,!0,-1),!0}(e)?function(e,t,n){var i,r,o,a,l,c,s,u,p=e.kind,f=e.result;if(z(u=e.input.charCodeAt(e.position))||X(u)||35===u||38===u||42===u||33===u||124===u||62===u||39===u||34===u||37===u||64===u||96===u)return!1;if((63===u||45===u)&&(z(i=e.input.charCodeAt(e.position+1))||n&&X(i)))return!1;for(e.kind="scalar",e.result="",r=o=e.position,a=!1;0!==u;){if(58===u){if(z(i=e.input.charCodeAt(e.position+1))||n&&X(i))break}else if(35===u){if(z(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&me(e)||n&&X(u))break;if(J(u)){if(l=e.line,c=e.lineStart,s=e.lineIndent,ge(e,!1,-1),e.lineIndent>=t){a=!0,u=e.input.charCodeAt(e.position);continue}e.position=o,e.line=l,e.lineStart=c,e.lineIndent=s;break}}a&&(pe(e,r,o,!1),ye(e,e.line-l),r=o=e.position,a=!1),Q(u)||(o=e.position+1),u=e.input.charCodeAt(++e.position)}return pe(e,r,o,!1),!!e.result||(e.kind=p,e.result=f,!1)}(e,d,1===i)&&(y=!0,null===e.tag&&(e.tag="?")):(y=!0,null===e.tag&&null===e.anchor||ce(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===g&&(y=c&&be(e,h))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&ce(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),s=0,u=e.implicitTypes.length;s<u;s+=1)if((f=e.implicitTypes[s]).resolve(e.result)){e.result=f.construct(e.result),e.tag=f.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(P.call(e.typeMap[e.kind||"fallback"],e.tag))f=e.typeMap[e.kind||"fallback"][e.tag];else for(f=null,s=0,u=(p=e.typeMap.multi[e.kind||"fallback"]).length;s<u;s+=1)if(e.tag.slice(0,p[s].tag.length)===p[s].tag){f=p[s];break}f||ce(e,"unknown tag !<"+e.tag+">"),null!==e.result&&f.kind!==e.kind&&ce(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+f.kind+'", not "'+e.kind+'"'),f.resolve(e.result,e.tag)?(e.result=f.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):ce(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||y}function ke(e){var t,n,i,r,o=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(r=e.input.charCodeAt(e.position))&&(ge(e,!0,-1),r=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==r));){for(a=!0,r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!z(r);)r=e.input.charCodeAt(++e.position);for(i=[],(n=e.input.slice(t,e.position)).length<1&&ce(e,"directive name must not be less than one character in length");0!==r;){for(;Q(r);)r=e.input.charCodeAt(++e.position);if(35===r){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&!J(r));break}if(J(r))break;for(t=e.position;0!==r&&!z(r);)r=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}0!==r&&he(e),P.call(ue,n)?ue[n](e,n,i):se(e,'unknown document directive "'+n+'"')}ge(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,ge(e,!0,-1)):a&&ce(e,"directives end mark is expected"),we(e,e.lineIndent-1,4,!1,!0),ge(e,!0,-1),e.checkLineBreaks&&H.test(e.input.slice(o,e.position))&&se(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&me(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,ge(e,!0,-1)):e.position<e.length-1&&ce(e,"end of the stream or a document separator is expected")}function Ce(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var n=new ae(e,t),i=e.indexOf("\0");for(-1!==i&&(n.position=i,ce(n,"null byte is not allowed in input")),n.input+="\0";32===n.input.charCodeAt(n.position);)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)ke(n);return n.documents}var xe={loadAll:function(e,t,n){null!==t&&"object"==typeof t&&void 0===n&&(n=t,t=null);var i=Ce(e,n);if("function"!=typeof t)return i;for(var r=0,o=i.length;r<o;r+=1)t(i[r])},load:function(e,t){var n=Ce(e,t);if(0!==n.length){if(1===n.length)return n[0];throw new o("expected a single document in the stream, but found more")}}},Ie=Object.prototype.toString,Se=Object.prototype.hasOwnProperty,Oe=65279,je={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},Te=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Ne=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Fe(e){var t,i,r;if(t=e.toString(16).toUpperCase(),e<=255)i="x",r=2;else if(e<=65535)i="u",r=4;else{if(!(e<=4294967295))throw new o("code point within a string may not be greater than 0xFFFFFFFF");i="U",r=8}return"\\"+i+n.repeat("0",r-t.length)+t}function Ee(e){this.schema=e.schema||K,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=n.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var n,i,r,o,a,l,c;if(null===t)return{};for(n={},r=0,o=(i=Object.keys(t)).length;r<o;r+=1)a=i[r],l=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(c=e.compiledTypeMap.fallback[a])&&Se.call(c.styleAliases,l)&&(l=c.styleAliases[l]),n[a]=l;return n}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Me(e,t){for(var i,r=n.repeat(" ",t),o=0,a=-1,l="",c=e.length;o<c;)-1===(a=e.indexOf("\n",o))?(i=e.slice(o),o=c):(i=e.slice(o,a+1),o=a+1),i.length&&"\n"!==i&&(l+=r),l+=i;return l}function Le(e,t){return"\n"+n.repeat(" ",e.indent*t)}function _e(e){return 32===e||9===e}function De(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&e!==Oe||65536<=e&&e<=1114111}function Ue(e){return De(e)&&e!==Oe&&13!==e&&10!==e}function qe(e,t,n){var i=Ue(e),r=i&&!_e(e);return(n?i:i&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!r)||Ue(t)&&!_e(t)&&35===e||58===t&&r}function Ye(e,t){var n,i=e.charCodeAt(t);return i>=55296&&i<=56319&&t+1<e.length&&(n=e.charCodeAt(t+1))>=56320&&n<=57343?1024*(i-55296)+n-56320+65536:i}function Re(e){return/^\n* /.test(e)}function Be(e,t,n,i,r,o,a,l){var c,s,u=0,p=null,f=!1,d=!1,h=-1!==i,g=-1,m=De(s=Ye(e,0))&&s!==Oe&&!_e(s)&&45!==s&&63!==s&&58!==s&&44!==s&&91!==s&&93!==s&&123!==s&&125!==s&&35!==s&&38!==s&&42!==s&&33!==s&&124'use strict';

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
                                                                                                                                                                                                       aGQN9�!�J�[(̑�����5��'�M�P]��dڑ��i�Ǹ���4����B6�
k�$a�X�?bH��M1��~u_si�/�i�%�F��ȌQcň�48���E�T�,ާ4�`��QX�q�K���U�O�A��̳D��`����)�p���E�2L]#k���8�7�1s���z��s(�vvH�v��:��t�T*Y�c#|1kv��Zm�ɁJ��&12��0s���W+m�ۣ�[�lm-�%*��u	D�5CN�(xe�G�w�Ү[%��h�ƭ��<�5Xx}�u��UK{��(�Oǵ� #�hn��ޑX�B�/���d����Q�G?&���w��p��w�f�&�͒Y�4�=�o�C:�F���?�e����9�  W��i�,N��	 D�$��Co�z�W�"�߇]Ud�N"'m���U4'�W��H~�{��?�v�(�
��Ӣ�Y�1iK�)�V�u�:���媣h�$�����g����B9�~~pF�~�$Z>�x���Bģ�Һ��
ȓ8����VP�X��T��+۬PK��C���^ym�k�s�q�D���P��`L��'kl�V��4f��nz��yYws8�(��Ը7��<$�.�*�:Ã��$Nv�B�#T
K@��&N.�
]���M��9��r���0�l7S���u؟��#}���@2�G��<B�T}�lM��;t̹G�?�G��jH�o�D��D���L4�ʂ��u%h�  @���ߺ���Jj)�ƍ�i�pqAJ,��%�EC��k[���Y�G��s�����5B�|E��l�ms��9�h�b��Z{���Ю(#�g��u7%�t9X������K���RTs�� ��K}kp��pd�A����}��]�!����m��0�   ���n_2�\���J��������) Ɋ� 0�\�}"�n�O��z7
��A,�t�x?�j��W"���t���.0}L��aXn��Pm�m�/��ZP�}�U����`^NA ��y@�	+�}�*;�c�뒇?����[���c�^�}��+_���E2����]�1#���Y��6m�ٲw���k���$��ݫ
�u"vWR��*�=�z��r�h��˕��[-B!WqWe(�v����r�<����qF��]�!��$p�����1|��p��S�I�"E7�O2�X�[�p��V�:=�¡C`9UW���}VCCHI�_�9G���J�z�eL�Wu����^+�M��L��� �r�:��{��n+Y���������X7hF�m��s�R�v/����Lؠ�S�F�A\��>@aw�ӗT��*(��OP��7+ǀ:��9��X�m��p؊�F�gI��#������ZZ�iq�]3����V/q!O�h�o�܌�RR�bHף�������Q�U�|h��)"»�P����9��.uw2Zu���v/�����҆�K�b�z)���/v< �I�ҿe��Y�k釅�8�"������u;V����hz���i�k餲�Xk�E8͇YaL��X�CΤ�.�s`\K�	>��u����˓�A�/W~4.c�RF�d���$�F�o��D���ZDE����*�ZpZ>�ͱ�ч�o�,��+�!���EI��.Z��F��Z����ꂌ�V�%կ����̓o�v�e�_���aΉ�e��3�>��Z
U+�R��n:V����5ޏ��J�2捴w"�%}<�}ZP��i������8"��sv�w�2a�iO���1���^�`0|a�P~��$,�Ze0*fl���pb��VF|Ty���]w�������u�[ڠ.4�F��WJ|&о�����xU�O�BT��J9�u�#Y0��ב{T9 ``�<��^�0�c��r�)���9C����%X���G��%����Í��̜U(8e��nA�$�
i�0G�J�_я�	��P;dKw�"�Oi��q[�Y�5	>@2�Ⴤ���.}�iH����:�ˊ=a���m�c��iu����EOK��Ѭ��\-�y�Ӽ9�t4���ԝ�Y��TЀ�G]��6�":%���k��t1GZ[��/(�M�z�KN>��᫲����Wцơ<0f���x���[��Y�=���B�l���5 -��ܦ�\z�M�Q��$�%�������a����)�jP�нi,U���B�<o���=b���q4�-�=V 1wug����%�Vݫ��3��v��t����P"��%��W"e��{A�G��%�{l�Q쐎75BJ�2�_��-J�bOD@{��q����E����+��+���lr�-��m��w��0�`�L��R5BMW��:�� �Ts}h&��l��6�����պ��FD'�bX L9",Q]
YϷ�x�He0�
��VZN}deP��ET�:<X��/4��e�JZH�(*5���]9�^�/�\Ƅ�4�z�3��YKQ��<�7��͵&�5�m�J������.$�������l:�y�&�DM��@4˟)B����:D�*��h�L1Vm�h��� M$@O�x凄|�O��  �A��5-�2�� g��k�f�(�:ح�E�<��o�r>��p��YOȆ5EŎ���l,��4Zz�<x��]tΪ�&������c;�1��|+��<��n����+l���Ð�qM�_��m�'�mB�feء�D���A��?��Պ���:
�����P�4�@:�2��Z�;_ԫ��Q 
��6�VC�����bbN��=5���'Q����0'/��Ϸ��   S%*c,&C��{��4�㢠q���BlK�K͌~�AU��$�kl�G7Q珡����"���4�CFڿ���m�Z�������0_S�J�"���2�3�2 �R�
�nƧ=!���H���cW<��ͪqd`wx�Љ�� �X_���߀�B��}������7*wHY�S�;��~d���P��3��i���K�B�9=]T�	E�0K�� Y���"�G\��e_�/\�p��,E=��D�NV������iy��E]�@֧�6���,��"j�� ��?����o.l�'~�EnY�j7��
dz�V=��̭r�=��ME�TN�W�����ۊl(j�t��ğ⦼m�˷Zd�˛��R��tj�t�J���B1��Y��K�~�n���e\�#Q�/�+�v(׽>6�W<�m��Ԧ������P�]0zo��]w�W P�C�C�e�� )ůA;��\\�F�L�����/�0%Pj��ZW�|���D����~*��8j��]0�s�\�ZHXu���)�S�_cGe�z7�q>��A;�b��jA7UĴ���L�~^�:�M��/[�ڢ)��� A_��K���>�^�(�.�3n�Q������8�RO��aqd*C��O�-Oَ+}�S�K8�rbޠ&�gMJW3�x�p$��Y�N�0%qFr�t��;^�%�B�Pk�v2��,����\ o`�^5|8Fnu�s��ns�Dg	��C��$
�Scm^4����/�X7˘Vo����ڗ�́�e�*
��t���ys�g&U���A�<�x�!=xEٱ$;�������R2�p��`��	����AuJ�aA���)�x�{O�c����єW���
�V_��l��w�T�6`L6��6��nR�
�zaP^�I��N��RKa��P�;4���C�-����f��`�mB��(e�@��{��w/�%e^�n8�Q^Q��1^����]	�[�xl
ǖ�u��D~2 �cYIR�V�1!��m��f�*�ZкG >�c�V�\"K�{〈�S��/{T���l2������5�z[�����@�>S��q���iI-���*�QT���ko`�lYE�߯P�uWb�����pZ��l�;ᡰU�B��~c�o�W�Ԑ1���|*�NaΔ�m�s���]�W��_��Ï?`�d��OU�1�c8�;�_�샆�%o$0�p��Y�˅΄*��D6�;���vVX��by��tu�LZ�+n��H��
"T����F�!]�ȯ��
?eGV�����t�jֽ��Y��4��"e
]5-�C��6�s�È��3�K�Q� z��:]�`��!,�����xǚK�����V���Am��~��H��Q�VH )�~>W��6u�u���.�4~u�� j�Qb},ǆa�{,Y��g	fK�� �ڤM��|�eJ](<��L��?�%�u�.;Yw�#D�������V��8�YJy�x�+e�:j����X�q���֌�I/@i���R�̔-�ny��$�#|Lm!��\�g~��1kW�L�xEAoQ�fʘ�������ocBT..���=dj!GA���דP�IB���!|�KWqOX!�;9���r~�i�C��F�_.���4��zW�4�H���삆�|5�Q�?t.<�O9`�烕5?˗��@V�+xo�3��`�@1�|&����eD�S��O�ٴ��QT-d �JO�cl8��Z��PG�@���6H��)1@�&�e�� �O&`��E���&�U5���3>[̳i�6�͓�(!*���� �,π���y��}����̚���y�J K�sQ1T�}<q*gp~�M<���TR�`?m8��Z0$�n���GĮ��q�_~yn�]�ϴq5?5orƜ�B��0�r�	�l�,���tF����F�#9��?�����'��}H�:n�tKF ��jlܧ��Z�-b(d�e`�vy��[��C�Q�;T
N�;�P�-������Y�,�,�-s5淺�U�cV{��3��"�&7A�2<���������Ua���pA���X,�`�Z/^�P�۸ǧXW ;ʘWC4�,ͱՁ��wn�z(��	��G#\l&��_UZ�-�s��^c��N���`A�5aq�9��o\��n���N�^G�����5�-D�~�j�v�+;ӟ{Уj\�d7��~���o~��+�&���]L8��7#�[��O�)�4s��I��מ��v��M���%�G���,����	qd���{ښ�x�b�j��0�K绋v*|�I�E� �%�=U�u+�g����R7t-�w�@$��u	5�=:و_���|�b`����wN�W��E��1?ͼC�(7*�>�̏U��}����}�OZHV����B�Au亄����ɏYآ�V��7�P�BK�o�����/A)Ai�Z�����A4/VA�g��C4c� U�?kݐ��Q�Q_͆���v�{�t�����q�7�A,|kL
Th(&�7:�X���y�EWx�ˑ}Y7A�V,���J�ki@\�tBm�`�f��nd`+i�H��Pk��B��z\�C���\Uji����ov�l�H�8P��ԟ.��p)���<fyesC��`B��yz['�? h���"Șg�@KN�Ǟ�w�Pm|��H(E�/�-J�S�g��;��H���Z%�eJGz]ɝ�7�5�l?���{0Ay���67�)�=�)O���{�g��1Y\��9:���w���	�қ ���}g�ޥ���/;#lg�����V�Ą¿`ɫ�Q����"9f�9f�=��	�Bنu��9��$��Y��&�#8O5�e'X��0�w<�G5�^�Y2���'_!!5���g�Mc&6��~_�	�N�+i@V��uaP�%܇�H<��~�����A��A��z"�s����N����M�l�dNq�v[�e�	����IA ��k��a�sOӝmӳ���
~G�<�n���>WN��t���^��:y-y�V�F�'�!f&&�$!{�iL,���©�
���!�͌�8kQ���r���c��/杢���G�Y��@Y����Bh��~�-�?�DѤ7^ّ�A)�7U(BϚ�]Wz��:Esw2Rfp�f�'�2� Fz[���>����<��Ee��0��V�i��*�:>�s{���ȤdX;v�$�q�$H��a��R�ݏz{�T>N?g �K��P���h�����/T�?�i֐�M��4���	�$:����
����m���./ ?��}����`�{�E� #���O���.]�%�Y����~�pgJ9����;'6s\�=��s�W�9����sRWj<+c�=x�Q���n�@W�euI�Rm߁Ȓ�k$�q�% �U��C@� Y�8����!S��V+�U-�h0��~������d�2�Ʀ-"BCO�ZS�#��v!6V�xuslv9�o1{�M�[��Z2}~(?�ן�9��y�&:Թ�@b�!R!�zj�{����UC�4�^����s��otb(�o#7�<����ml��+�e����?De����!wYu\��`��ee_s��?��{/C���)b��I�+�4���h�Lp�q�0�&Iz�G���ߗ���nW8x���M��Z�KX>-_��#�U��cm��v�P�/����^!�r��c�3J6=׶ZM̮Sa�1��6=�_P���Ak���ÏjA_�O�qH�.�V-Z��}[��Q�asf:R�1RXS�p�n-�+d�N�_��~��"�y����$Z*� ��2�v{Y�a�@�2q0<��E��(٢��_�g�����ZZ�:|_��>�'$[��A��lȤWZ�k�┰@3g��o�|jͺo�nw� �@pI��e�@�ƺ�G+��T$΀�Zts������/n�lx\5�gij�<���A3q�=bvҐ�_��w�8��-�Fu���@��Y|�����@c�*�7�F���]U��ymY�R�0�EN��@���{�uj���z ������yb�h�Hv�F@게�Ø�ɴ1?���AU���b}1��B������/ˁ�g���9�5*�<�Ӈ�,Bh��kS�<R�hn|���p�%��A�;�g��Cb�!NU�3�"0���g?��ď^�_�,
ש��T����w�ͯ�]�<���W<���G��ᅅ`l����g�'w�W -�A)���Woa�Z&�Jʁ�q�Z�u/Ʀ�R�Q����9ʋ���g>���_����׶FBd�,I�C�Ŕ�q�z�iA~��Y8h"#Г�8X�RK��~��O�/v�48@�@s"�v�,�bA��w �ї�F�Ư�N������Pm�B��:���Ȕ�rW�V�����e�)o�6_��p<8#6;f �:�㡹�w�����N7p&k����ά_���)��vss��YH�mL��#hf G7ǈ��8xe�j}���k�� u欲|~�])�yB�J��W>���/
HV��'�x��d����
�ss�
�~^�,�];7�#B���̣5y�׈�<��R���3+���3�r]���i\������>~m]bK�p����/��t��v���!���C�AU�␺
�E�;P�W����45��
���������F[ɨ	�y��G�4]ݏur�w��b@k�.�سi��V�)�7���Zo*-��q��qt�*�����xz��( ]��V�%}�xD9���3B��С5��ۖ!�HnVX�"m�q�>Cw9Uc��~t�"P���z;�ʪ ;�䪹R0��)e��Chd��Z����t��XA���Y��po2�S��O9Ө�Z(;��[�i�X�B�78�RTw��99"r�ޑP��Y�-�^�$6~ܞK3Z�~��V�Č�op�o�D7�v[�S���HXk?9�� �Z��4#lt-�Mk��*\�X��~c�*">y�#�"���ϥ$PE7�`�t7穓����S�u��F���3,�n��ֵf_1�g[����ڲ �6f_ީn̓�0q_/A�<a�u����@K��Y?6�ʵ���#�ףT�VɅ`y^���q�BÓ"��a�[J�i\\��ͳt���Z�������� �7Bӵ$&��B�2y`�[X=��hH�fo/���,�,v/�ʼǖ�/�6x�k��t�f����!;�1���v2�������zOc�#���Ϫ[�	�W��E�,yu���Vha+~8܅�'������pX�7Hn�'@�W|����Tw�P�V��W$s��T�̩L��D�Փa��M�ڋ1<�pd.�s]#�i�웗�����x<+����p�:b�~�1�I��Ys4�c�ȡ�_�ۦ�x�Q`4R.�GE~f�ǝE��0�7u���G� �wX*3�S��Z�@���Ɛ�,�s(�qF9����]��YX	��i�m����$�{ ���J1�D;��{PV�9�
���dd�y�;���XgX�U��=�a,�$���,�j��茊����s�i����7?����wS
�M:�&'�T��%��EM(��8=����*���g��x��ߎv��"V�Ӣ��5�Sn? ��Z5�U�R\)�����b�����t������R�p��m�|�ۀ�|r�5g����5�9b��D��27@:q�����=���E�~�E|�)Kw�n��XX���T��h�U M��#.(�q)����ߗ���P䳰�w'���[3��w;�a�w�����M��|��
�P%�9 o`�$2���V!G��|m0uH�� �EW�*����T���?H2v�i~c+���$t�5��5|�J�Y�MNRɱӒ>'f�|�i�yLV(�QQ��x�kctMt5\O�r�4v��>
��y��1���QYnJ���Ⱥ��,���/�)��x����1�/ڊ�\�P���Ș	��-��T�'�~�J1��L4uۭ�-�h�
��s�WF���� ��hڃ�si��:2-Ț�q�p
��H�꿿���Gtj��8� ~eo��� �f��<�&����uV�5�s��Vc�^�)��v�T�	5CE�<�"<�Y��C��,F��c�b����T�m.�4u,sh���	��ڻ/��Bi�8)�o}໫ ���K"�Ǖ��ty���}"H �����%�?k�5eb��|@^4��)J$���Ao{�҉2ݹB�g���;�Qh�'�Yx��^�i38|pq��"�U���^�\n]Ct�3Ƞ(����vl�O��D��X�v�=<��=�x^��Ly���Y?�N:.�I��k�mHe�T2���}ǨX8���nhe�v!�T�4�3-rT��qJ�9(A�V�;�j�3�5���}h�����VC�����0#���R����99���:=W�?���] �S��7���K&��b�����ɝ�/�9�����x#G>�}>���·�F�9�L6������K'{�~�L�q�f�S��ba�-�Ø�d���f�y���v(���,,�|z���\��eb����r��8-��]ө���L9
�2��A�mV&�}-�Ut{`��u�� ����H���4ԫ��*�3�5.--1���e����%�u�E���jI��*�?�}N+b��'��dH���KV��21��$�?��`��mG��X�|ѥ�N/n��r�I0���$=L]s��HJ���[�Ҋ���ֲ+<�"�hWN�{����͈ى�N�P��h3� �zcO������J�|5on�ѹ�k��o�0>����j;�i!��?�5U�	�w����P�8��7����y��u�����JQ0(Y�(���ņ��;�ͭR��4�� ��]`^��c#��� ����I}�Mfb��"܅�N�;�5A�k�?�A����}����Ҡb���b�F��\�	��W;�f��L�f�Aɷ�L]��M�r�Z��=��Y ��.0�mw5t]w_�N���^��Z;����6KZua��eGl��1���U�y�/�������4�2�Nq^я���[=�c4���4G<(�R�M������ 4�J�[tw���s*#���a%�ДXv�GJ��{v����W�Y5]��T9�p{�\��W���&�.�Ɔt�gF�!4�h��z�2!'G��wȧ���t��q��
����k��JukhD���N������~���8�e���K5Ў�T��+��4 b��@���'�w�"��7����AA�],���r>�j�\`8V�}�a���^��;�/3�����j���a ;��  �A��d�D\�2>[���P    6O:�"�Πs����Y���ܕ$�?�tG�eWk��{����E�M�Yy��b�#h��W�C��g�O��V�X3�&s�Ŕ9
��
�����@A9��&`fC3R��;��]yӁ%�`)��/ivj�o���8���e�@�5�@��sO;�:Ѡ��8I�8��JHk|���vxW���I?�^SP�t��uIYQSH�.Sԃ��=c��ř���%�5�i�J��ܯ��P�����h�8�������:DW4�M�κ�����&��9
������W4�H���A�:_8����FT�O=��e��%P"��U�`���R�$W��z$$jN��E�}NG+6����!�q���V�-M��'b�b�@c�]+�p�-L:��#3 5�r�!��?MuW8!�K|`�A!,�9q"l:����sm�DU��qd�`��=�t������0�i0�"iv����/��_�e�Se�(w耧��x��������u��e����xP���Z�B@7nG(����-\� ���߅��	��d��_��fK��ek�3f�7���� �ޔG킠'�>uN�)ͼ�*u�=&�u��}��;+�8[�,���l`��J�Sw�N�'#���xv.�)^Y6.|	�ψ�� �җHe'�;�")]�Tc��@J4��f5"B�U� @B B>�l��oyT+ǬV���O=^�#L[v�`4��I2���+"�|�����[.��������<D5Xt�>��e�Y��������횛�	��,A��	k�J�t�(�<�z�S�,ʫn�]���Pyďع�A �@�"�;�8����   ��i�1���i�( N!�̦ឋoq=��᪃�&�p���?3�ݝ��1D��QJ_tD�/�1/Y7�g&�?>�}�Oc�@\�����E�SB��h+��[�T�^~�� /�R6(y�Mm�x��k�5���7�9sJ��S���ޟ�2s'B�^��T���	X\4^�+���q��������  	��n_6�>��;��v����V�d�[�D�   N��R�aؼ�����0�1n�ׄr�JM�6�}�Հ��,5��ޛօ�`���~�X���¹�� ��  ;��,6�{�_Jz�|����9�{�]Hi�D��Uh��"?��x��U9�xA�N- ��7��U�T��y:fةY[ M���>�w�S�y7=2r���(���{9T���0!��� ,�9�B+����x����f>����7w��e &q�ݼ�6gi1%UNOF�_�������k�,mr���>B9^b��:��	㈪�NX��$�'�@v� �r_Q���b��U�=	�5��8�Hh�0�M���7�:�����q�2��. G�F�}t��	h̼i���p�a`���f���M͚��ސ������@H?�p�y�י�7w���R�o%�7'��7��Q.����a�ZYgp��^j�f%��/��IRP�^�O�g��o�ñp�3���R�ڏ�5P�	����`aJ+W.�&��=H��C��|헊[�G�/Rnh�"P��Jc ;������S��?��L�I�Bt�~��oJm�)���O,�p͡T'�1�Xh!�>E����'����ݸ㕙6���H��b9U��J��l~�.�fS��l��Q���1O-:�����۵�/�c�;V��Im�7{�G-�k�$�р��)��D>~*������k۬�9nKrQT��%�Q_��ҥK����
y��%+��Pd�R��v4@�Ϝ��c*�[��Šc�\P��]�ÿ�y=��uyᬺ���G�'�0Z���4�0⑺�I��.Da��L����ώ0+���T@��.i�u\KX7��b�c+�B*(8�z��P`9M�_�!�(IF~�����:k�C('L�pUnl������nd<�������ˡ�U�̆��̩I�]-���˺�p��t�۾�
�g�W��_%���2��I19m_�H�����U�4��K�D���.y�7#0�!�[�i9^U����	�K������>Y���4�?��'��A����M}�3E�@ʐ�i53,�@8q��_%���fƸ ���X����V�:��(%�.�X�B*��sLrR�;��\�"ZAҮL�̴�T1�c_r�d*��O.�7f�����v��r|���tR�B� u����f0G/Qo�3k"��h!�Q<B�%�`����V�ӷ��R�]�E�X[=b��%��$��#T�85f�O��yȩ^^ן�n!n�VY���Y�lb�Z��Y^]�1tke�f���jn��5��Э���Th�7��b,d�*I��iL��~H.��}����Ձ�Aތ�[8�^��Rn�Q�S�+ae��Ҩ��xiͱc6���i�^�Q*'\v��?	�5���X�^�{N.�݈؂��I��L���ъn)�?̒5����0��Z�;�.יD�2x_�&��>75�-�gќTI�ʄ���Kܺ�4z�=|�q�^,Q�]Z��q\C��گ�2�{�{�;ayR��f��~RL������2!��Bu��z��M��c�9�����
�>�\��<��}]��4�@�%zʭΛ�7�����l.`} �q�}� �r%j��:���v�	8��qTAy�F  �d8@;h�<�P�$-���(����V+4��)���S	o�]-0eJw���cs�#��%�G��m��l� db"EY.����Aq���ˏ/��y�Wo�@(���&Z;��ap�S �2�ަ����U�Q0��61��h� ��x�J���r���������	�-M
�y����T6e�M���+�v�����D��˫;���e��;�c��؜B^�����������0��<Hk�#�8���z`�e_�ً�S
�Fsz����Q�;-���M�~��@�*_��d��Z2W�2}'U���Q)�����I��VJE���L�zٍ���蕔�i��g<�P͵��&�a�sl�!�(����e��hTA���Kun����p���.^��Fg�t�.uC �M�Z�CN�|�,��tA��Q9"���Y�WH/��d��=3� ��ǦϾ�ƃ�9��a�?n�� �Zmk���v��{��
���E����<A����2
iI�ULX�e��[U̯A���'����Z��Y:9F\���K���~\��\��(�+iLƁ��A1�g51�f��|�U�Ҁv��O�CW\";��|PQ�Ok�%��s�qY�/����V�L�Ǻ�tyP�@ͺj��w%S���![�F�vK�#~�������2_@�xbD}"6�,��%��Mh��	C�^����@��F͔�>k���l7��cV� 	��R�{�!_�B7\�Ȋ�/�Nu�v�I�<��,&SU��l$a���z�� h?J����{��;�B�����r.0��SߠH4�̲H��ʀ*E��@��0��[�1�Ov����R�v������kncb�'
�ɦ���x.�������r>�������Ü�ii���-�2xbV1TZ�q�|A	T7\��ؚJd��k��(�v�n�r�
��2H��p[�N��P㝂Q�IYhn�-xe�`.�@�P 2��`  �A�5-�2��Ta@#�%'�ג�oJ�:�aG����E_��7rl[N������(@xe� ���^�Fn2A�\,Ҟ)�G�~�n�W�v��V���p�MR/_N����7>��E2�Lw��g�!�@b���C����x���MA�H��K��:`Đg��PH����l��6�6��=�sp#�}aGsƹ�j�'x����OԬ�h~1]�8��BZq,%J0^䷓��TIM�g���~�h��6�����|���L�����.�8�1�pgZ��RMy���Ģ�J�~��+؇?nՔ(Yc��F�=
��t#�$�&���ɡ�D�ϱ��IE�\8�{��*Mݚq|[A)Y�o��'miu(-��0ur�����!h��L�,�x���#���RM|Se�e,z�r�ݲ�=��zN�j=��X��J/�s<]���:x�&�+' |��KD�PƄ5��$�x�2��`B�_�)�ǵYjT�d�u�������,����%\'\y�g�Z���T�}�>4�^�Y���\���Z8�o=/����kҎ.��y��5c<0���F�瓥����	K�P/�|���4G�;說n('��Oz�>��F�J;�����.+�=|�AG^�u͞K�yG�����y/`S�]ި�hZ����W�Œ;�}P��J��Qlm�Q��>�;u�� ҝ���
o�һ�.n��9J=,��X�*+�<S�^{���k4�b�#JZ\:pm�����\�K
��	�ȝ%��U�	y�?�՞��Jਗ�?��7A�MN�Z��y{�"f-�Ё��a�9b ����	�/��	OE�Ter����Va�Wyx��Xee�@�{~Ls@�������T�ͬA-G�w�j���t�5���I��^F�9��V��n���>��oL$s�A��]'���� ����>ZO~,mP��;�Ie��6�N�<��4c������:+�3~�1:���Uʶ��%���!� y�Tn�"i&{i�-��w��#�@�ͨ�r�dN!7���jQ
����m����(
1��d(���^~5�8�`���$�I�d�M��"�7v=�(s0B�$nF��XZ�;'�g�md�el��P��6�;Q�!�6}���Ո!n�l,��c��uyy~�e���Ba��O�x���l< $��"�8Z��
�'��~���&�J��ZY^pC�[��q׆���-Y',��Ҋ|]�
���ḷm��9ٟfT�O�|�m}-�3�\6�s��hs9~���|�X�->GL5�ݾ}nwY.1��ha�I=-[�� ����DAЦ��QG��g`�me���\��'2l�<���J6^�"�[m�:�j�4j�3VY|��K�"1��p8�"use strict";

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


���>�H�d>��� ���:��@��u>S�h�Q� Öf��nl��2�Q��$�Ee�uh�� 7�h�d
!�{���Ȝ�?��` p   ��Ln=~�Lr���`����MD�;��� ����BI�>{��' �!.����{xDܵ`���LP.md����P\��یD��*=��>��	@*Eo2kC�쑅� �7�5�$����x{l��:���#���M�vsQr&�����0z9�`����GF�ڔ�53��tȡ�_຾,ԗ�e�V�P��U�"w �4�4�A$cd�PMH Y�0��x
%D����Б�~t�u�<�pkߊ�4�Ĉ(��*7e�5W��3^}�x
�[m"��"�D�C�H�$��ҟ�z0�\�6�����#3�dF@&�N�2�z�����H2����e2��	��
'A�p ��y��6 ��%=2�vF�   &���PK    �SV�Ɍ � `   PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/video/skt_2308_1629122919_musicaldown.com.mp4�[	|T��=o�-��I2B"�EY��(P�**�D��	$PŽ.���;� E�EA+.���UPD�"VJϝ�.�w���;?.������~˹73 �Uq~ٰ򑥀ueiS<v���em��X:r�X�Q:vh	��8��������������ƏbU�.����c:_�������,�`�!%�Q^����ז�m�/-V�tTZ���;Q��8yY����%#F׾;�d�Y�/�G�(>�d�U������=�79cK���%��%�]A��!g�
cF�h��~������Q^Q^bԹK-����U����_W�+�z;w��v쵫U��;7"�l^g����;Ɋ�U��K?�<�>��Ϋ\�Ȏ�?Wm�e��e2�*��+*�w���zp�x��-b����XT�?�,f����g�B�~��3v��]�;!��1ݟ'���Zҷ�n\�Ʈ���vV�����ig�vߵ^]��C���N�9��\���iz���������������'q��`����{��k��Z^�o�{����}���&�w�o]�9?�~��������w��/"�~��_�;��}���:{��y_�����?պ�����֯Sξ��:����q��~�c��g_����8?���#_�u���S���?ո?��:��e�B���˛���ʏ�>?�<�e}�syE�`�����b��,/�ϖjd�!x���<��s<���x��70�F���75�_xoi�����5�C���w4�#�H�b�]�h?��c���o�D�c�'��~��4�3�Ll�g�Pa�^f�|���5�q~��_l����~��_m���~���`�7��~��O2��^���0�>��2�>��+|���7����3�%���?e��|��?c��y��_2����_7�7|���m���=�l�[�c�f���_�s�n�;�_�q�ލ[���0���gx���c�I�3�|/4�"��������`�xk?x7��1�>����5g՗��0r�)�oê� ż�h��5:��ԏE{�����ğ%���*�í��ӷ�'k�b�A,j>�%/��qi��s���нq�>d9��7���GO��I�[ �RN����#u���<`�]�����Zt���f���X�+:&Y*��g
a~�h��!:f��5�տ$6T�����Ibk{Ni߭��`=�T�GO=�Fԁu����V��e�5�$uk��܍W��s%��:�&���e���[��uj���XN��y���$'�j��d�r�s�e:�E��w�]p=���%V�8sߓ/X*>��B{3�[OJ̣~�nR�T�'�R��'#*);٪����XJG�8�2WX�R�N��⌏獿�/�豝Gů�\_e;���$rN�����״,.�ͦ<V��/��Ԯ/��^����}ԣMڕ�o,���o�ֳ;�XHl��������R��u�oM�N?�[�Df7���U�Wr"�9B�2%�Q�L����_����3��R�j�OӺS1,I[�`��k�9�W��Ǹ�3�Vb.�MPW��}��Q��t~�h'Y���k�g��y�x��rV��[hc��b�Y�-�#���96�"7����K���R�O��6�/��~��G�Nޑ�Ѿ�ֱ�x�H����l�Ҧ.
9��'d]�7b)�};4G���˜��z�1�V�W庂�2���TL�Z�N>mѢ�Ю�ȃ�κ]=���Ϣd��e�h�ݨל��&�F1rK}��/����*wR�vX�)�v�����o�9�.�|`�����˘�S��R��{��u���[�\� mȡ΃l����N)��~<���q��3c�����Y�w~��|/�x��B�m������<��G�<�����:\'��k5��9I�Y��E\�Y�ë�Z檳��	hK�&�W1r.夭ؗ�x�b��xZ@��K8CǨLڳ;R��Ӛ4����N�~g[��c�5���>��G����,�;�r��y!ڭ���~�W�W�sw9��~�#t����ô���ڮB���g�2���,�ۏv�n<�\3��x�Ю(��)K;�\G���f'���o��3s�<�i[Qy�S�����'�?eo��3\x��z��q�D=��ϳ�"~ϒ�c���2e(T<v��uh�v���$�9�$�Q�(w��p�1z�$<��΍�-���;/���6MY����-�� M�w���)ǵ��I�1'�'�+P�|��'�|���2cr*_�I��3i��Mr�A\}�P�!��G�u�6s���S˵�9W�%א�'��]Ƥ ����́>�ħ�9��(m�%�u(S�y�gp��Եs%��~�U>H?˥��/���w�*��WS��{'����J���u��1O�s�8n��tR��"��5j���u�7���m\���\���ݣ���+��ݮs>�c���u�.�b�$vŹգoiV��cjy����O�2���ʗM��<掠����~R\;����Q����g�t(��8య ��ù����I}�W�sm0N���k���Y�!��O;��rU<��>:�q��dO�O���&r��L�y(�?���l�B�n��;���U�ϛ����>�A�Ӟ�����W<S��J���P[�}�YO�޵X��V��)Yn�N�����>�^:OX3��On9�!�c�x/i=(�);�Rێu2m�FS�̻ٜoke��?)�0s�O�&ך�&Z��:�t�=�D�Ԝ�zn_�G?��y$�j��n��q"ɸؔ|����fv3W:Q��Ug(_�}�/�X���[��W{��zi�Qvy4cM�:�o�N::P���)^�sk�slO���	w�.�Ѿ}5�#5~�s�A���F����v~��L�䫵�$kĸp�u����E�?*`O�g���-�	7֕W)Gv�A]���?�=����r{X�=k�2X^�7I�{�>��=\��|����	o���Nb6��O�S��3�
��5p��Ζ�p>z���%p[�n��~7������߂�ȃp����wu�/����\����������~��ܫ���=�?�a����^�c����W� �ѽ�U�w˕e�� ����9�}��{�zx��[�����V�o�x�u_�����
x[o��m�/F�۹�1�ȁ���'�ߧ�~-��,�	/¿m�i�?����_[�����D��چ�!�?��T��������� P�	�%w2��G�p=�y�H�\���;\�
�g�b�_���@���zޏP���k�u2B��z��^_�����p�+>�)�=W <��O� �v�[7"�܁H���Q�HW���- R3��[��rD��"#~ 2�52z��5c���X8�����SM=�h���:�ê�t&��NE����&�WB����:
��F��z�7NAtS?d&X�%�yT�=�#��m�,[��魐��k�yqĎ��A�^��uk��F�*�{b/�@����7���@l{��'#�e�[?E"�����vtMnA�սH�?���4�q�HLi��[q$�� +�Y�������肬�d�q���"k�|d�|1�߅��+��I_d�㑝��M�Ev�����e��}7�K�#{���~��d�ANá�9��X��Q�#g�T�L9OA�sW g�f�l�9�G��/D2��o"ٱ��NF򘋐<��t5�W���ͽ���1���!�j R��!�r9R'>�ԩ�!u�X�FtE�tR#� U��1g!5u
R�>Fj�_�zmRo_�ԦM��
��� ��<�^���5En���;��ː�r}䮏#��O��/D^�t�u|y�?���6�[� y�� ��$�^����<�Q0r5
f�(�ڎ��� �>�i�}�G�is�`ˑ(�ރ��PX�����p�(|�e����Q��GјlM
���(�E���~ c�K���Y靶�=?��Û��ǭ�T��d~�`ft�g�����c�5k��s������0��ҡ%u��K�"��˰�~�rjiY�b�Yl�ET�9tHyI�G"Υ�^�?_���:'�//ꥊG��rM>oҧ��_�ؚAe��:�hf��HN w���>��*���I�u�>e�b�ٚ9�O&ޑS�XV��V�T/�U����Ƀ�~��5[N�+�)M�}�μ���yz�tF�%'I�+xX�|Z��֧������"��Rg�`��tF�5C��\��9yZ!}͓~f���r}C�P�O��	S[�w���zB�U��5#�=Ó2�,��Z�4dxH��b��͐��G���e^�"�#"�Bg��a���-��/����6OH�J��Y�E�U�8+��y"c�ԟ+��Y��W�̕��,U��1��C��Q�`�E�*c�蠶�*��iS#��v�}.�9�ڌ*o�S�]68S�T#���Z�h�1�G���	���bˌ��˵Ҙ{�k�`�1��������uxU�|H|e��=O�1O��R��+6����b������,�o�����<����)����%R�R�S{�<[�HtWk��zD��h��R��kd��r>,�F�����b�f�g�rc��ީ�:n�5�KnVW��7���*��'�>�x�K���O%#?N�b2r΀[���9�-yC8S�o�LF�
Χ��6�A������w��d�d�w�������V]	�l�}��������h�m�d�-�ȓd��&�nw	����;���z�HFn��.�Q7�+��w���b2�k�����ݱ���XxS�����d�O� ���=�$�5/�����ަ-�>�NF����x;�����$#O��y~�	�����І�� 2�d�Q��7�e�W����b���A�Y�q�d�	�X���#p��My������'��� ���]�`�2���ȉ=ۂ�<!�VC�� �cB�݄���ȋ����Dh�d��~&�ͫ��>c��J^�=���Ed�"b��H�lD:�t�"�,F�f2���d�-�t5"_tGF��HF�W��O~5_��7GƦ���DS��{Ѷ�"�q'���A�'���d�?�	�!:o<�����!��=��{2�w���w`���vw۶m�6��m۶m۶�m��Ӷm���~8�'���UIVVV��T���( <� �_��� ����9, ������n�� �A �� �_� 	� �c E ¢ ���?"  <�^� �g)�����s �� H�J $�- �> ��_H@b��G� $�Z �ǿ�B_ Ҏ6 �
��@�d � ��Ț� d] ��; 9����@���G� ��x 
��?"g���PD�(fq �3 J�?R�-�QP���p> T��DN�� ��{ ���D�
@��N�#rr ����.���@��G߸( 4�D �H% M|�f1	@���G�d ���D.���% hS������C�#r8 ��- ]��n@�� ����#r �s	 ������#rn �� }o��s�#r �h �K����7`4�`40Z� K� �UM �:�?"�`���#r�D���`* �� ؾ����� ��.�G���� �[���y �������d�S��G�@ ��X >�> _��o��/��,& �@� ��rh�M���8 A�o A��~������ac��`���K�6��W�+���O��)�����Y�/�&���x���be\M�8�Y���������@�af�OH�ؿ����.h9 ��Z����.����;���  a�cm��� '
�O �����]�͈��pϯ:�{�#H�D�j|���Bn�դ�a��f��^�;zI�$i�*�[g�����սe�S��(4������#?�����S�8E�Ҙ2����"��1�Op!�+�8�ijk��xd#��k�b�ٔ_���lY�{�0���JC��=ԁ���ӄ�ʒ���
��E'�t܏-���K��/j8�~d��NU��tq���%9
�Y0z���+�D��ю�Eu6�J7u��O}�[��Oٔ��Z����3`-�ڮ�� ���������8���ަ�Y��dk*�*����;3;+!����	!+翨$�?����+����׀ѿ;{kSgBfFF:fF&�Bsgg{n777���Q�������ь�?����6��t��-�l��	�����m���M�팬����	l�=�L��Y�ݙ�XmL��M�	�\��8	�<���;�9�1�3�+��Dhc�nb���E�%�l�L���	���l��e"tv4���p�c&�t�46r�'2r��c$4610���5�cf�eb"45prֳw����c�?���LM�L���	����p�c�$����20����?BB'k#��W�Hh��?�Y�8��[gGk�J���.�zFv6����F��������������:ؘ�g�P���_�����z����a�gha�_M��&�c!t3�03w6��ggob�gfg���������[����cfc��Q���IB'#[#g>VF�����>u4q2�W��H������_���є���_���ֿ3+=#����1ҳ����g�Bw>v�'g{>VBWCW�2���������.�N����?�?{�i�3���������a"4���6��O-�����Y�o"�k���S� ��(~��(^Q��Pe����Z�������Ͼ����zO�����*`��=��2����r!I˘�:�^c5 5��.�}�h�����G�:ڒ7��2�	�
dU�5��7�l+�Y'�� W�'�@Z�3+悋����J��3eH�E]r�ۼc���8��.O=�L��B�e�s�D����=�N%�
�,o�MX#��վn�r%�����c]�Ge�y��O��%u����jL;D���V8Yvs�w���g@0ʨ�,�lK���1�g�\;+m}�(Rd>�?��t����%�ar%;Y;/�����ٛ]�q
�Bk�ig&���w��V�Hn�L5�nxBA�]�P$�Cϓ�"���]�(���t|��S��t���
��w�B�޾�>��'����\���3�{;
���V|��Է���ۓW9,��k ���cF%j�'��^�������(�YPD-�����-P����Y���4�N����N���U�9EO	���.�\��n�k�V7�a��_)���X�1mɌn��{\�מ�~�/�V�9�(l<�f�ğ�
5	�GȋN`oŽ^hL&��[�����Z��o�,�w���loB�qRvR�H\z�%r9��ۆ]ڼ&�M�/���
�d�͊��A�@Q�x �X�N�ra]rik斊I�ز���m?�T��	{�>�c�����:�O�IՌ�њ��^�x�Ufx]��Q�,k)_���Rf�}Q���b<o��i\�;.�v�#��;�
�4�j�	yZ�a���t��ލ���� ����o��E�}�Kݺ�?�rLF���e��|�,�[=w;���� ��G�y+0��Ҁ'�d�t��fo����CkC���Y�x����L#�~���~F�ͷ��LL��5�ut��X������<)<W�{���W�6����W��;�s�
�����h�μ�h�9�~�����e���d�%��g}X�R�ª�5��+��7yTA�SD�Jc��Vo#���r�smN�?���-	�-]g꠷��Os2!rsxj�)��:L-dA�ã��d�lj{�ݙ�s���?}�-�x"Dp��"��؎q/iNm̭q���̏U��p�q�ٿ�p
?�u�n�d���[�f���uՄ���R�0�n��5���N���7�,3J�lL���j���?�/G���3�"�\b�%0�+ ������p�4��!����425wNT~�ݗE�Q뿉w��]N�Ό(kj�SZ,�������k��}��4��#@;~��x<�����%�a�
��Û+C!Hz"B�᪣3�N��u�*u���6ju�9LZ�9��SZ?:ΖFأ�<�f�3!�1�s=�3�4�`�m��x\�"Ꮴ����4�x�>b9��+�G�X�W�  ������~����1����?ȓ�h_9GxB_> �����J��D�y�P#䦑p	��?�4��6�O�(���C����h<�锳�*����؋X?�E�?*�\�w$=�2��}�C0ڹ/�qI��H��*������4�l[d��[7����{���f����j�V��5��T���AP����B�4��{�:.�ꖖ�ܫJ�65��łG�Zt~�Sqz��i���x�z�/[&�U�A�<(0�FM�qt���F��Toy���k�}��w2^!�gFz�L-��`(�y|e�]������E�m4q�\
�E��&P@�8�ʗ�������Z	G ��Vѵơ!�fgZ�W_w�V����>]g���T��%\s�厄�Fk�M?y$
��n���m.���,�D��/��Q����[1d�_R�`��i�R؝j����a���Z��{	�>�ե�_p�$9�IG�L��	و��{ж�[��?;7<���!V��ֆ+��1�{�����8�:~�EX�Ĳ�8!|�:E�|�ӥ�R���{���H1Uo�f�[xlV�[������g:L�Q��� )��m�n%%X`�q>)z�e:%��6b��uM�>�8l�2������X�ޝ�/8�w��e�BO���ǰ
4��B�3Ȳou�Y
��,����[ȭ�^�a�8X3lЪ�sN������&���G�@�����$�9H�!ű"�$�c�Tl=\=fl�SL�����i۠JN��4�gQ����o��r#��=Z��<�5_"m���֦U�:���f`Bű����O��eX��Knx�Q�PM`*���[��7��ٖg�2����:��Э.�H}B���GRZ\+���sp,2��S�j`�Ԅ��G�Dm$�I��KI�V���w�goy�]�D��2�K�e3�ϙǔ���9�]����S<��;��g����E@�N�H��!�w���Ȼ����!B}�^B�.��A�_�����1Z#���L�Y-Ɣ+&��υ�M�⍤Ӓ��K�lO�01�_ܦ�i&�0����WC\Qv��D�~���%�Z�8�f5�c��c�h����u��\G�w�6�Lޑ�~���#�[Ĕ�%�}'��޷�I��[���9cc�g4�:���JN̩�B�������]%�6�S>�??l�TBmYNO�5�WH�q�v���o�B���uvZ&�zyu^�xҼ�i�C|�����n�>_l���Oe��O�̩�m>_@|K-l�����k6F��( ���H�i�����-)5�O����;jДл�n��w[�#�)&O0,�ǲ�M5us�a;
�U��kR1�r/;`[��(ip�R�×��O��j*
�97t|ж[ډ\��-�:��*|	��碰�Z��F�!"mn��N��㷼bo�I;	LiY�F�T�"�czHC���ִ+L��bٹ-�ͫ.�Ew_���O�p8�О��/me����h�� zJ���Z��T.�{8r��0�ِ���t>�������ͫ}��}�0��tw������亃 H
~
U��G ���3�r��{p܁�o����ԨYk�ԑ�S*��x��
OiA~�@l۬os-�^�Ŝ��!Σĥ��ܖn�/k�n�"sQ��u�A
u������Ѐ񊆴�IT*|��8Q?n��[6��?3��P܌LG���N��c�-��
i3/�.����^��h=�����z�	W@�Sq �=@��X�_�x�t��@y�K�d"�U��ao[:(��������"��}��7x�!S�f������;�$`�ӿ���^����V���3{i�fG��J �0o�	����I۲�c�W�1a!����ґ��d��M�`�d%��g�}̺;!�#X,��]=�:��yZ����0g
�o*���$�<�I�a���F��m����ov��k�8�ű�	b�ř;x)3�b�k�N#~�r���m�x�,ʛ�CR3E��r����^ᇋ���a>����R�Z,�&�fH9н�66����]�@�:�O��U����q�S�:�W�&t���߮���!-!������\A��`�֔���?%a�?�	�8��������]╁�x�9�
���چ��d��\�z��t~t���m����}����v�����w`�����H��m�ƹiw�t�ݓ��Kc��n��n������Z��0z�Gb&++���ԋ";}���*?�a�o�{]�^�j�_LR@R	��ӥh�����1�RZ�ɻ5y]��Dd�/�
���w�v��8~�+U���f�ꔶ/R���[�	���j{�$SO�w6R�c�):��3�ó�͓���M�B�cܿ8��%Z+͛���x��i2��*���3J�.�6��$��\�����8F]�?��׏�:��$�ޞ��ػZ������֠�zqt����.�u$w�[j4U��c��.z(6���(^�s=�ԅ��]E&rb�qM|����uo��3M1P�-�gT1�kp���&b|ث�������ɵ��Lf���C�y��}[��D����h%��l0ǹl�h%H㵖Ȕ;��A�x�~�-)�Qa����9����X��2�k��n��L�#�O���+���Rt�U5!�Bـ%�8��!�S���;�r�C&�q���j�5J}�w:ȩtj����sU3Wޚ[jRA{������,��k?9�W\)��a�} HI>˓���:���dv�����@��0?��O|fҀE=�.��gk��Z/��u�c���A�xI)�h��vHg��\�RcZ�����4$Y����8�RhH�_���-� :���rP��ك@G���r

x���a�=���tK�0��eg����Ŕ�4�ػG����r��ۺ\1W�U�̂=�V"949�ꍜ�O�hDN�^��#
�)�g���=1���F�M~�^mZ�E�<��/�4BD��iud|��Ǥ�_j��R��K�h���Qedl�J��,t���n<���v�Vbe�MHOK豉�y1��p�O�'26�gK��m�����)�X���s7�z�����jٯq�w�8g[ �X��P��D\fh�!�J����+�Jt5��Y��tFZ���ʺ��-F��w��n�H�߱�Ӯ-��/����	�H+�T�}\vT�zWS��V�Y��sܓcJ*�O/�V�Aӯ���6�Q�L5Ve~�>��n����j�Z�q��J;��լ�jt��T!@�Db
��ǋDkD�\ JU{Z�����<�&���t�}i����l��\�Ƅ�&op$�t$a
��E���<&A%�� �g�~�-!X�O0"Ae\%���q��fY�#i�b��Iȣ]��R���q�C�x�V�:S<Ujc�5,��L%���&��V�,WzԼ��Kn��sLd��R�EiG���=� �;��+
�x�?4���Ĩ܃��oS�����W؅��`�T��K�nj�ϛ�Q��IE� �ǫ�i])02�ܐ��J���Χ�Q%͕�¢�)���]މ��Ĵ���E,k	{�w=WH\�'�i�ݾ¿����-�?|/O���v� ����=�%�~�0Ny.���yS�u�hF�S��'��ӟ�1n��"[�7n���D-n� Xc�iOz;�.�rS���u�Ԏ2Ն͜a��Z����ƥ(��mġ�dۯ��8]A0ӆG5��L�B<pj��ǧh�3Ӎ~�=��<�?ky��ݤZ. 9,&J*n�W�}F��T��*��R3Z��&���;��J&����K8��Tm�b���/������cO6���0~������UJf���G���V䡨��(���^ifH̀�l���tC#�I�l_�'���N��}���SI����}+�|�ۘg�ϓϩ
��������'���6;�!��}�ͧ�[�h��z��S�L*x�����D�;��raz�MW�1�y5�r������w�0��sJJ�%.�l�O�{q�Z ��I�;g�bE�DU�3�V�q�W�T�L_	��������9�"�
P�hn1��� ��l.{4��v���!�)��(Q����[u]�e܎�G@�����i
L�?��x�rd��T�3WҖ,dm$Z?&?����71��w�"��`���_�g��4��ߋ�d����Dy���j��=d�-x�˜qY�_��C���S��'�R���^'�b`9�>�W[=����~�T�n}�*�O���������������;�P�OcC�,%$c��qk+i��ZSHC��˿��`[��]t��]8ɳ��i�+�C�4��' ҊZ��y�Q���=c5�(��-�jFqjkz ��l0�Y��Õ�kƶ,���pg�6�Z���!.8����b��F��Lpq� �[	�2i��4Ц
�K&|��-
���/�j��iH������4��=�Q����7�i� jk^��D�'����o�R�H�A��䢉6սv` �fX�H�3�d��)���Oe6w$�����H�B�����z)�uP�����27� ��K�b�\���j�(���3~�^�` ]�w%�JY��~V�x�՘��+�~�QйF��\=�[Y�6_��\�#˲��l��[��}���vL�g%yo�'�g��ě	�8�o2�oY��h'�3�C�,�n��؜� ���p抓�&Z�������T���r!�6�ȟ�d(�r"���?66à�Vĺ��Ef����x�4/�ۭ�,��DJd��c�h+�9��:��c���>5���Js����U��p/lVe�YGOv��߷~�/|�?DD��(ƭ�r�N��$����n�ɦ����<��g�uD4\���¯օ�h/�4A�#jø�$e��v� t0S�B#Y�c�C�K�"��Ӓ(%�[J�q��2��Q�vǔ���Z��Đ�[����`���E]h�̨�ia^�_ti&T5Zi�]�̫��呁��E!�ϫX��*�:R���wq�̓��3T�����5[�y�5��sƹ��H�zpp���#���q�e�����g�'�Tk�R� �`!�Ju}ż�&\ܼ�/���D����8����m_�� ��r����?���<�@;ӻDjTS,@:�eRE��t�-K���t��_��(�ۏ�
�#l�m���CH����r8������>��%N�~�䒓)���.�:���ه-n�I�}�x�*��P��EԮ~�"���-;'����segV�4���u�H�$s� ���~Ŕ�U��|{\����|��8'tPp���E;���n�K���S�p�aWW��]�7���Y�z�AI0Q�<�eM[��9��E[m���ʟ%�])6x�0A��Ǭ�W7?�/���� Er�\6:�DWV���K󄂢�u�gt�9��[Q]��:$��'	]]��l�Ҏ��d��:[��jI��R�|t��וN&��T��E��]�н��&���PT���m�$l5��#M�CD�Ȳ��R�d���aQ��*|{�EE�F�|z`%
��t~e�n}3�I�UͅԺ�@U.��P�Z-Q�֐���.�H�-^��Pt��)���9�kȡ��w��V)t�Ϛ@��Dj��P�GE��!���U��Hn��kF]�<��B�?r�־iN*D��b+{�ch �:3�6�#� &�>��[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

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
                                                                                                                                                                                                                   4LfWP���	�4��l���-�K=^��#�l�L�$?ə.��Hط�q����&`TgJf�k�X��qh���g�ҥ�2)_Ea�xL���akh�)$�8b�N��IYL��a� .X�������(�=Kf^�����싋���Pz�Q��1�i��?� �g�k��^.}�_:��Ǜu�M���v���]���t��
W=N5�g>�W A�q��8����e?k��A��I�ړ���F�ڦ	11���޲H=4SW���ϗ�aJH+��g�F�7X�;�{^Ӏ�2s����,o�	�l�OA��*��3�몋$]�9��{�ðFiZ�/�^:�:�
5r�[��B��Q�5����y0e���~��&�@�Z��dwkѢ�T�e�[�E~cj�~Q߳�S��[Z� E/�Sّ�NT�}���[n/5�_��Y�;±J$��e1N�y'4��q���y��<l2���R��tė�(PR����&\�`�a�.�ݱWL�\&&h;�U�9)��r �xAA�=W�;��.(x8G̞��I{�3�8�ݻپS0�p�#��8qf��s�k��y�P^�#jQ��M{8���e�?&d	���<Ew���I�-�g��(��3GN��)������S�k�IP�co��̌]E��oN$}Tp�,4�/��A��Y��E'�7�9h����\�?c����\�������B�q���ڂ��Ǩ���q�BWz��L�t�1��Ϡ�Q��HuZ>2ۥh};꿛��Jn4�����q�5��`������l���/��0��'8��|�X�C>�?��
��?����{�.�?����l~<���&:m��@���I�X@�h���g��Η�х ՛q�6�b�S ��CI�����H1�Lw�2aD��:wH�0��
�b�Nn2j�ȎQ
�d��j�<���L�s�zsw6"���3e_uLuUzD�,�d }�V�wtL"P� ��3D^�݃�8�%�m�$S�)x�H������X!ȸ�����Pf�ե�6��=������h�iEy��Θ�jV�.���".��P*�\�	r�C�!r�/��B��[=+*�~��%2��\�O���d�w����/!�Ē�-s�W���$g[��Z�����z��e��嬷sJ��a&�[o���F��$*W�U�pt�5w	��� ��u8�]=�p�<}A����5�Δ�&8�FmӄH��ˇ���:0fB��_���)̫�_����@��Uv��u͓�常˦E7C��֟��1]�=Q\rn.�Z]7����.�B�3��IvU�H�"I�w� !�tt��d5V���dq��R�w�� /��NQ�i��a�݌x�,[ݯ�����+Pb�.	+Te};	C\C5�l7���}L%.�S�48���&c�� _0B)M��j^8����>t>��"�L��hHW&*�Y��]�ݼ�����(P���YL��a�s�ڦ]�<��ώ�U5��$!R�-�f=�~z��~�ӟ��Ce�v-�,~}#������s�vr"xۺ�΢e��?iݥfБuų�[j{ h'[x&9�=�ύ���7)�Rc;�H���>k��U�w�T��ϯ9�A9%0/V�n�b�ذ�˞��P�_�tV�Cz^�'}[�N�����q�F#��|���>�Uu�����iutI�pr��W�;�-��-j���]��d�#
S��X�j�F�$������b:�9?����EE!�݅v��ּ��x����j[I�ۭ�(Σ�bձػ+����m�Gz�`��	��qo%�W66A��k�zn�f��E�_Q���h�(ϑO���q��$*ӫX��Ob#&y�A���m/��s��Z4姾����:W�P=
%���c_�� �P4�f/��Sީy<�7gОc�ۃ�Y�00�	���0<�����JX����>UN9��iSee�sc:�W��0�*&Y3YE�S�M�tحM�2Ow�bЯD���P>�;dB��r��v|j�nl�Dl��}ç�;��;���e��w��e)�ZN���0&1��b��(Lˌ��yչR݌#9��Vy���S(Q��j�F�h��ʊ���eGs�Ԟ��sH{�� ����L̔ KTǩL�=8��"{��ʌ����=�3em�/P��37eU��6C���L�H6�Գ�� ��TW�m[���k�٠�A�ϙG���k��-*�����u���6[��^6�Ey���f��W�ͭ��m5�Q�QY%y>x�	w �(�|���g�����t|��+�ǂz��UԭD��|ǣ33�S:����u��p����������,�6��̲�E�a��I~��#�Ҭ��ʓ�h� B��e�8E�N|4w��Wo_$V������Vo?!���̘xl�j+r;Gx�]@=ő��/�Er�wQ�l�xs�_�k�ޚ*Eb���,�3�,cw���5�������Pq6 �]jU>ؘ���`� v��Ͳ�����>�~�d�+���Yݍ�#���1���;�ޝǷxs�ƈ[|EW���?�u�T4��ˤe;6c�4��c����?�����7�K�P�?��ꩿx(��OG�)��P��g0u�ۊ1꪿�"�w�a�칀��ٯx10�:��-iP�K5C4�Ϣ��$��ͬZj�&��l���=_	�핃�������1*;b�ۿ\�h�=���������tsM�D1>:���!��P6��-�;*29#�>[(W���<�Y�5��z�*f�2~ʌ|9AC���/A�|��+҇{X�&�~ޘ�Kr2 �;�������=�^�˾o�@�.�����������5a�鋉�Ҿ:�ey\�!!�6��CZ�.:�=�^)i�jU}S�\�=A s�}��e�فgnln{Njl�i
W{Xؐ�!���ߙĦXN���9��$��Q6�d�C;\�`��)�uP�uC���0��"j�=y�af��Ï9i���LG�^��3/�_}���������%�/5��T�Q���j�S�����84�,�itD��.��Z�\���K��]<�I^�ث@��D�o"=k�-b�\B;y�"��,\�va����@�u�d����"���;�.0/�ݶq�P��<t[�)�����է�p�����Q$�nx��u��Q�nW����3�r��hc�'��V�1��C�ԊW����M����q���ݒ�l7>a�ݦ�Ɠ��0����G%]z~��[���^R=�j�T=2�R2���"F �"h�ɣDi�D�JD���ژVbk��[��n����o�<�MO��<3F��:_,�v��]�V��f��n��Ccj\��qU���|5�@���Dp�Wu���|�Nh:�9�d��L�Z�y�z7�U8R��ZU'#�G �_��_���
�:]1[n?|\Ʒ�ɿ��vK��P�&�D4?^ψQ�����h�L�qoiܟo��K�M��������%�in��#9>��ա�%`�� ���؁��� ����8�����A�5����:�Q
?����{uCB��p&�E���}��_US)�[|G�i��:��͞㓜3�1�R��B���	U�yBtw���gvF�M���ށʳ��%���!���r�"��q˳j���2C&A��My�hXG�Oi�W�K�"b���vIw˝��\��hS�7�B�"ZGQ]�S���ܼw�̭vC�s	6C�� ��j.�%�&q�XE��m��2��.�J A{�{��;�Ɯ�� �.�ڶl�h�Yd�MO|$xX�\��[W�3S���L,��O�E��v�}2~r�O��u`�g��L^'p��-]���u���z#���{�z�t�F&{�R~B����4�X������O��|�'��5�4��E�������.�e�;��vw��*�#�����e��`�Z�"�_]�3(ZTy��yEl�6e+�y~����C�%b��jT�Y4�p�Q�zܵb�3)�0�&�N�3��|l��yT;)��b�~���2�����߁s����[��ea<�Tq$���G��^��H��������`���*�R��-�Ȅ��ٯ��� B�&<�|�4���fӌC����i@�(��NWD��|q��w�ا~a�~xLS{`m��{0[�if��O���S]A����3� � �&�����$tq=+}.���U�9L�`��R�Hd���t� �0��+hv��#81�9�ؖ;����HS�F�|y���	w��n�RMf�cD�u�wjӋ��);��J�c�G�bS"���~Mɮż���pP�)5M�>��27ɃV�@������|� �������r��k��%Z37�^Q�!��"e�9�ׄ�aa�
{�i0��(��B�!2G[��R8�}��)�HJӕ��EE��{ev�BZ�+aߤ/�͢n���s�D�����U���1�}֓H��n��Ψf��R?};�1OJB�T�ìa.�dn՝)W�0�^��=V�ð� ���f\��2�����WJ�L����e�M:~R�-V����M?����Ȃz6:޿��7�]|Z��ɼ�n�G�w�7���^��W��)*��~kN�yl��a�՘ ��v � �}L��"F,�q�]��U�A[�!�"Z�p�G�:�aY}t]Bǜ����15=�t�C����r��%�c�Q�p��H�e�W�oc+Yn,g���o�K@�'�녬e�!�POZ�%g)s��B����o��Ǖ�XC�D+��b��v��<XAo���Sg�܃���vc0b����G��J����~v��<>|�*f��oѲ�V� ��V�A3gZSrCV	�~�峎��H2�Љc	���� \Wb����l�M��B' ���(�[�0u0~g'��c��P���{�`f��ӥ�����'"��}e�wH1!s���HP�������}j���4��y���p��n�D[�lN2j��-�GFgA� )�U��&M�g']�T[r�}ZCLOt�tR���	���㟛q�\tM~�(�H�$2�6,b����88�l�0��AЧZ���2z��E�T���J����Míz���dw�ő�;�ɖpK��W-��e_�z��%F�ⶃs��m��<r2VBN�D�٧���Ȗ�J��!�k��|%G��r�7�K�X!��mPy\c�f���.��a����h���D�m��`�AT��~����똭C�YFJ���Ms�L�&GN�y��Z	�sd_�Z���,{�jDb�퇺�DJ���H�tx�]*�A�c7�����a%�h�«�{��APb��xWD��$��6Z�?���� �\���>U����\�O��^/o�∀Ձ��U�PՙDWI	����"��j�M�L���n��_xr	��<m����s0�NB��1�tx�=~8,�D��*b��RQ��p��1-:�s�,d/
</�$�j$(z�3O)�I{��� �K���BI@1�YJ��X4��V�7�j	���2����8axAn~���/�}Y��&{�(�cp�F<��5I�Me)�پA���D����R|cwZ%���SF{���{>��m?����֫`�u�_�w�=R#�x���AͲ���!5�O��8���́��@�A3��3��]�w�9��}kp�]���{Q��m�9�2?�Y�����&w�K;��j�L�5�k,��41L8�=�m0�|�ȩ�� �ӎ�C�h���Y�`clv�+�'o������y�oyV�+�٨^1��XF��|�<��rbV��鄀��*���gK�x��"���*ˇ�ZF��K�/��z�f��wXw|��+�![�z/����ew�L'�0i����^%S�J�=�`7�� X{�-�2Xd3�:���%��g[������\|���n���!����&4��]v>��`#�Pݘ^nT�9�t\����J���)��Q	�C���QM��/Q�{�C�ݙ{���k�w�����6n�4�2�?�B!^H#\��D��.;�O�7_V(�vn�ҭ��w�'�<��˱ ��՛Y��I��F�Or@$�0diƪ��8�!�<*�Ņ��<sXw-����8���WT�Mk���y���\Q�c6Kc(��g�n�&	MK?�����kQ�£qL�iKR���w�s��I$(�̖�r?�5	’�_��f@�ҷ!CC}O�*��C����F�a�e+@���p-�%٫�0%H�57x�*7˨�oT�/�>NQq�OU�{i�k��/��He�@���(���N�;e�Hx�Y����ʢ����۩p�߄i+s
��Z'���L<yu�0�q)h�`|�'6i�k�6�r�pT4B�+��z5$L���Z��j��0R�3`��}���\���Z�����\�g8�;��+:�ׇ��qL�Π��k�n3��-p��"�����D V����`)o��K�h��
�JOT7��X��(d�����H�V*��
@�Lid�2�GC��}�NN����C�D�؛��kI.5�L�Nys=�����	KF6��VL�˳3�����6%������N�Њ�?�Cl���l)IК�\<S�|i
�&�����Ք�sM���+�~����6��Ӯ*��a�;��+Z������aS!.?���j��i
{j�O�@L�;k#�L��D�%�W?o�g��4�}BJ�_7D��׎�X��eT��_��`�Ø*Ai�`qʾ���hG5��m��x�ԋyW�}*NJ.��Ў/(IHuc�$�L,����K����J�{���As_:ȗ��UTg�Ÿ��E�΀�2�͒��%���C-�)�ؿ����a ��k�-LlN��N%uV�`\���������@���߂�梈�S)��gK�	�O[SRq#*�B)�W��6b��d�;=`]-��3�$���d���Yj��"A�<���8kI��\���O}b�У.�3�5ǘ�t�-8�@|��-�V%��sn��'т���<�֧��H
��NΕV$�5�<�I�u7�b�b���v@�K�:�a���R-�6����-D��a�_:4�~�p�*k�ͪ_���/sw�~�S�!�Ӣ�6D����i�4��$��dAM"��=G����	A�H��@ �>���g��([�����Jb(*N�X@����4�xN�X�Ԗ?����[Jp���,�'�:X?�����T������s��!+�4�~q�O�KV��ћ����5Ѳ�$bʛ����	%�kfa��Ŗ1�ϛjikd}�^A�>=m.P���@�\7�x��Ԥ�j��"|��X���cU�=�u��е�@��M�@�E�L�0갦lp�a^�}io�B*iD����Rf���{��}��t}��ܣ<歨���F�ç�.����"\��J>�^��u)Qn��y2%�Z �35:�P��w�w�Q�-���X�1���~�`�����>�#�9�dQ-�V�D���Т��=��QhA��U(nI���ћBa���*��������;��?\��Z�`>k���֬\q�_g̇���#�ɦ?{�RP��2e�P�(_�(�|���:��c=��$YSqj��R�n�W4��f$���8c���\�g�Q��jm���|��-��d:�S�͈0@l�n�����Rr�t���6����}���m��b֋�XB�7����γ�U�V_�'�T�����:�5]�\ӵ[A�P�4֫`��B��F׻R�>4�u�~_���d��� O���TE	�̖�Ù�������!����[E��DF
������3�m�"��ֳU���o*�����D��*��,����9�� �i�܁�\7L�Z�9������t�mN��z�ZO�D�/���&�_���[�K'H�Ⱦ��$ciH��FE��Kf�_c��9{e�g�t�Hx�?4�	�V�_�P��Z���Ն���T��mٵ٭��f��F��3�;� �0� x�G|�4��v>��8۴����c�Lb�C����Kmͪ�q�Yÿ�I�?%І�,�U�=5|����@�tR���_�;��{P��]�o����h�۱w�g0�����g�����~�J���i䟝띚?����A�,o��s� -��f��P�9�C�A��2t}e4˶ԜY�\������ur�|��a��RBarcd}���.�v,�"{�)��3�r�K�q���t�]q���݂ɋ_�3SHp% <Z��{ͤ]�[ڕ74p	1�ֵ�>�}����l�8���Y�u�l7y8����#��)k�h�G)�e������=.�����E��F�?g���#+tNʳ��Ю�7�]�N�"�ҁ��3���h:�v�}����d�AFU��}KP8����\����y4Yr���.E�8�����H��U���S�[�B%�A>~f��
��$ə8	_V˓}ֈ�έAW1�=�Gp�"^٥��̤��;A**cXbJ=u���Q�F��T��'�Q�!c�d�B�!���3��K��G���v6�/��)1F9%��/�ȟ�[iI�:4���e�wbX���'`��Cћ��N�M3�&m��I@�D�x�0J����͜�B ���k�!?�I�q8��b���|^�+�~�x��^��m@)a�H��W@˛P_����竌�L6�=01����e��%	R�c���"���P�]�o���muU�$w;�٭a8h^<�v�ݟH��.��ߢ[BH���4=d��&���§�������M{|jM/%>k�\���f�I%�9��ֻ��<�go;���o�!�>ud	Q�*�7Yy	��� �dO�k�x���(GN�,d-˔��O��sk]��=.�ʋ���w�G�U�5�.��:!��=�4巍7򡺵it5N��gͺ���F|���2��v�fd��D��ѳ�[��:?K���7Rh�&$Lze2�7�X��B+٫�yr:���y�C��ұ�_��R��=�;�<��i�!����������L	��D�)�.��&��wh�:���_���aQ\N�ٗ\
ooQ���3/"E]|*�����}~�#"����t6�m%������f��n�Z�1A����Q!B��T�/_�=JR��OeL�c�|�����o��9�]�s�-s�e5�s���Qm�s=\v��h�s2s����������U#�ɋ�;�2��è@kY�l�x5�׫AF`!�Y�q/�t
6|�P�9q�f��}b(.&4N2龰)����<_���, �[A�4DOp�]�n��q*�B�|zi��~�E4�S��a��.�6��#��M��C�s�l�P�<�yhB�8�r{؄�Nd*8V���%_��w �ƀ�.5˚ң��{���hՅ)�_%u�eU��U��}ٌ���ku��D�]f�cV�#iS�i� 2��]���J�<�W��@M��z�9����y8S,���=
e���<f��-Q`m �B�eK��Ζ5_������"�Bd�:�`���#&8��p��'�����y�3�����VS���+'v0�: (r<1���/	�N�H3[��k�/�u?M򴗷^��+"1����7&t:�޺���,q[���y�~�5�0�Y%����b����y��j�&�����bCMC1+ ��|qP�H���4~�%�Z�Ro��%+I>e�����"^����$�ӛ6}�k�������/4T�^����R���Y M���G*>އ֋ =���w��ޫ�XLuH|@�~���=��6�S/�m%
X�!,��W�U09����cf���m3�P��5�&8[�<�a�BZ]�a'F��Nվ���U���F��ڣ4Y�N�I�r��)-nQX'�V(C��Ήє��{��s�pg<���?����:�nM�֢~��К[d�����q���hM� a���bPj�H1��5�����(��5%!�s�ܳ�������7��H;N�/	U�{[^�J������r#���%]J���: �j��g��	�Xf��g��g����]	���XmVkae����y֎9v]������+&�698�2�@�e� ee�E'���L�C�i���˶���ߩ��լu7�o�����vi�������7��+��O���ʼ�C�F�K�<��ÿ<���@����#��9��_*�M��>a�����5�������ؙs|]� ZW�>QPq�a�"F1�2�w~��/Y�]����z�ͿC�g,~f6�7S�JZ��
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
�t�����&����I�T';�<�|���(�y�z�
?a�@M��@/H�N"z�������H��o�bN� ��3X�e�F���wH���.aQ����H�Fn��ǆE��WO����^�a�rb��c8�G��8�VƗ�Ve��U�\�炾_�t�W��g m�6�����c����K������O�`>���N���t��,�R����8�&��L4 ��|N�b,tO�l�D�#��S�)���3�W~6㝋�p����Qf�
m�ު�Mu`�2�t��� �!}��������[�M���({2{�+�߃{���A��M�B�{�m� �_�"@��`�<k����U��|�z����Y���>�ɤCZ�?���׋-� 
!�tsWf9��˼��l6@.��m�z�� 0�+��Q(�
/��Kd3��-�/��f෵Î;+A1�D��\��#1���w�V� �- ��2��FJXmE���)�!�W*�Y�p�q�������MUv�?�����;�˹��j�?��Ԥ�;��S�}@��	��t�y�=��aqY,�2��%Mҏ��� r�C���\<#��������<n&�}(� S�;KGrzƔ������&^��MMi,i��WO�Puh�Z1�����;�	��}m[,D�������1��@�Z�zbQ�&y��s�A��b&P�4Y��y)L�o.�?���K��٫qʋ�?�@gy)� ѓ�BV��>$~ �|�|�\����)�����k�k��m�0��?N4�]K����<��.�sU��ab;�k�5ݗ��� �z'S�|^��0�萻F�� '�`�T��%7�-jŘ�5(e3
�ӹ��S�3()��L�=U�n�ٰ䆿������D{	�op{��Usq�^��piLw'��BІ�AN��	Ec��p����րX�՞�\��h��{�f�1w͋��+8�q��&I�H{(�G#�٭��Wh�4mb�=1O��	���e������:|6�~y"�i*��8;�Y��vhi
�������	��qY����j�ڴ��N���R�}ސ�s�!K��Ԅ�/�S��I����^�|��h-!�J/�Ң����BU��d��(����P���ٻ䩜��f�R�;^+b��IJ˧v`��V�PF���s�2هgN�)0%>���kbЖ�C:��h�^�O\5́k�����ۢ$k�����X|�y�ED�F�䌿:+Ֆ��6�x4y�M�a��h)Y�=����"H	}.`���m��N��(�R����0��Ҥo��;.�d:�E�Tc��A�ȡ���⹿�[����>���d+���Dc�����i���c�(�ʛ2O�R����s�cm!��Ri�c�u���4������Vڏ�'�����L���l��M[��e�#�W�UV���Hg��+��\���2U�{;�L�F]Kc�c>hfق�u��@�A��y��@��@x�k���7�L�C�k�����.6��j�B��|����jVJ��!Z��f�{�چ�N�M�߷�]�ZO���H����TH�?���w������S�tfF��bRw�0������-��Y��>��07�am��k����R�(��mV{ҐL�@�/���� ����#��-�b��3�4A�+����c���Ow|�c�F��'19���m�in�*�L�o��_%nl����T�ftX��w�OK�f��w���s:MN���/�:_�G��< ׮ڇ��
���e�5�w�ؙ�	,��Og�_���V���&X��e�#Cm̓pE�S�t�7���N��Ϧ�c�g�ݒ�z�����?��w� e&��zd����U:䉆m2W5�*�y���hTFݕ�Qyr�jd�����.�����"��c���D��Qe��a���J�"���������Q�0��HC9X��7#�>��1<B}�,oG��,�L �N�b��b�~�S���u%��<N}|x,��{�5�`��� tG���9y��Z/R� O�L��aכ�|���WJ*�{°�~��vBf�u]8�_d·��ʂ$+�ϡ��ܧ�`អz��|k��Sk��2�9P, -�(�d��|��G�� �48�����G"���J��-ZҔ��r�f���E�3r��5(�Іk���������?��;��ϵ߷�	<�+sΏi���+��U����<�{ӻS�-�b�.<�4u/lu�(C�YY��c9K�e:��w,9��%����}F�>s_/�îD�K�S��<nG���~�'��GKo��Y��aã ��jt���q)��K��Uu8�Z�@B�:������+%����B04�K��	������q�ة>���l����#��a4���\&y!w��jɽ���_�ȏ� ���ۿ�#�C��-�����pU-�'�+�{�X	�v��Z(%�'j����XTL�KiǠK�'� �^��Jؙ��)=��A����@R@����8����Ȩ}���ٔ���^dD���n�O&�G�M%��e����9hp�u'��R5K�~�OA��m�`y��ޘw�x?�E}���-��
�%O���Rՙb��.�a���� o�>�˟���lk=�a'^�)��=@2&*/�73�D���N芨�:>�`%n��ޣB���l_�̝���������R�3H��� �����*8�ŵ}�ȩ �/�T�W7�,�c�����2������ �L�t�7cE|�ҝ�_m*�.G�W&�v��%�-���9ڰ��~�1�OLZRi�AC70�7�i�ڍ�����!A�$���H�m�J{��
����r�A���v~�d��ԯ|�|~&�e`*�^6�߉	��qE��87��Q��?^c??jy�� LV�Zs���Ŕ���ȧ�%�Em��m�Ɨ�"�g@79	2Pe/N��koң��@�p�t�D�����vQ���5$L�j�w�P솝�J��8��L�{ce��\�C.}�o��N΄��<�֤zT�D�ՙb���o�u��C�e!�����}"��;�w*d�|Q�O�väβj)
7��z;8���3�o�*�g�1��TR����j��7���,��?(>87�
&��WwK1J���i�e�|�o�71�@w�i�˸�/CU���|�4n������������:ֆn�|�!�$�����^<�]���	�w�_����Z��n�v*��-UP�hg7	Zq�w\���9�2qX�-��̻� m�j9
k}7|+	O4Y��N�®��U��G��,YK�xKb�0�30K����16&��_m�^!��N4�.���e�7��M}[Ϭַ:�[ �.�E��b�f�:0=o.N������6 �!�us`̓ b�SU���v�X����d��:���� @�e
�3�0�|���b��x�(#�S���\?%�W�u��O,��Gӟ8� MNH�^�F�At���GT2��7��Q�
;*>+w�K�%)}�+���hJV3��9��U�xoo`���F��a��6a{ɧ����Я.�� �]wRҴ��?ڱ�H �%&�r(#�h�p�);�����$D쓊_{��X=�'��r��a蝗�8)J��
�y�j��M�+�Wx�W��[)���5?&�'�+eяK�nZ��f�kJh�Z}Q���J��|x�0Lk���o�;(�;9�Z�����ٜ�����{����D���.��@�dR$�U�땙[�B*Ul��Y��G�����d��e�h��"$g+�; �)Eڶ�(��H	�!�,� hpْ|i�O���BvL�c�|&�? F���*�J�.4"
�-�@��c��e"ɪ�_�2m#�@F��Ox1/I�3 �����kS�9����K=�ˋ<�~7�m��MB2�1��߶�{Y��|A.��/�-�Aޙ��8�� ��G�
Y��>o���Mb(�Jz&Ox���
���hs��}����Eci���ǃ#�� �/��;�]ŝj�f�g��.Եo!TJ�'����8�~P���n����g�����F��� �Z��{@4����=Wd�W	7���}�vi�;��b3��+���̤<�B��l�1"�j��'����ʘ�S�&��E��z�Eӷ!���B���GT&��V�=�\�p���^����`��n�=�hɱ
�<�<�Z,6}b�hѧ��-�Y��Q��0���s�d������ߡP;Y�f�)� Է��<�l4"dx<�3L�j�x:;��EaT�M���D��+��ݹ8z������[����P���h����f5�N�K6��o��v2xz ���p��s�X�.�KsѢ[à�IҮ��-o1���{�!��k����F}��LP�ı�U?�*�����3���(I+K�+9]4����Gє3� ��8.�(R+R�j6�����a#�W��q����}�D�2�Z�,=��n����C���+����a�W����&i7�
�df�G���q}%�N(JR�*�[��بe7�zz�e#�$r!sѽr�,�m���5A���Sѕ���gk��B{�|*�����ڌgۤJsbnv�q��Npe��g�dl�8��1z"t՝Rfh�P[l��<���Rc
�Y�~hs,�aTa�7U��xB�j�^z��JL��^�h_���.��c��pQ�D�@7�vY�=Ō�_�'IQ�Fpj�D��hس�����{:������sv�q�Da]��i"�̚n���b^H�2�1����W�}�/��?�� �\�z��>��n���K1��PK��܊Ed[�o�G�|圙�-u�f��i]t�w�(t)�f�NGq�a�~���+ނ�Hy�J��( "mm{
!�oh���M�c�y+0��E��x1�~0���0΄V�1U���!�v鞑�T��k����yiM-I��-��J;�m'�0P���~hM�;��x��㚡�ty����������z�5T~�t�$�·�O�3�7h��;�!�E*g��2Ll��N��躵��i���{�y�ƽ�{~�F/<+=S�;�H�9�[�(����=�|�D�f#��dm��9}�� cyvv����)��Ch����(���&GT����$!~ة�(��ߗMA�(}���]kY�A���l0<F�t�f+��6�'cv�Jv�^����B�P����N'LG�A�@���Er�m��JB�8��8�d,� ���˱ǫa�q�I�:V}��*�;Z���x�e��[�X/!�w�s*��y:N���0P�yx5<bcKV{Wp�+Z,.��)�P��  �A�cI�&S��� ���"-Z���i��P�<
<�m���"r�YNz:����n�A0���a%C�7�_=�f`y;��j��L3į���%�Y��2��W�Id3K�,B�'����
���!�虧� t
�`1�P��7a�	����ʄh!�M������=X��2Gv� 4�M�m w�խ�P��8_�|����A���7����M��#��W���?̟���J��T�Z�~9c�F{Y�|���c���[_V�\9��f�/�zIvHa��w��r��n��B:�9����B�L0�����<ф�E��'*�'�O��
���BQ-`��~�tEE��;���y�%�	��Z�3�x�7����\U�LT��9�C���v��k�k����Ʊ��>%�:cP3�_3�C��=�c���������cr��v����nG�v}��ՒO���{����]Q������G��3R�~����պ/~��)�֯���0��H�"���&R��z;Ro'7�����# �8+\��������1��rߕ�z�n_0�	|�^��Ԓ�����PV2 �
A�u��/6Xޤ��I��u���B�O��Z�T��tQn�~(��LPs��·���+� Ҙ]/��Ʉ3��/y���h�,��e�0<�p�sg+v���l綨�y����ݩ�%�d�����Y�4�Y*�λHhN��PI\4p�:N  �Qu�#���֟���J���f}��8iU�Q�LQ������X�����߃�^s�����{��(��|��{}��vSQjw��� ���r����ֳW�>�a�2�y���a>l��g\Ȳ��!�N}Om֓/XTRP�D�e
m��>l�?GO���s�˪�:s�n���1�{d�� (���L�Du�Q#�s�M`\�>��i�o�H�+hWr"袄�ŏ���}9B`���A��3d�6��3�?�,���C�Y�Ӳ�>����*P���1����n0d g�ۍ��Lo�����{���a�۹#��;����dP�x��N�4�[��ĄD�]�y��GzT�`��xRi��'��4O��vlǢs���w��NgA��ʼ]��ˏ1E������V��d`��%�[(n�k-�������T�ԕ�/^�>��Q2�6��q��Y}_��V4��TC��`h6	�����5(TX ��-)��Q��A�Z�e�F�i`t����+��Y=���H���3n�]7���j�h����K@
HF�aG�5��X@�g��5<�u��;ʘ�y�Vm�WV�J��X܊T�F��¦a|
K�n]�)��|_R����\/d�@?<�=��?]s!�+Eok�ҷ����0j{���A
����чU���:X o	���VمJ���m{�Ä�/�i�  �  .A��<!�2�+��� 5������:� DNfK�v���Z��}a�3�	��!�2iZ25Q��Z�A��L?p�� \� t�ҏc�(0����,��gHر��\��ѫ�����e�������h�69� ��c����Hr�ZM(3��z�u&lR1���/a̵e@5�� .�8Zս�3�vN�c/��N��d�-GhU�Ӑ�N(� �����H��1WgD#�� L�m�-7��'��$l[/n�I���"f�<&�����U��ۥ�IԵ�������wsK�M����u�D<�L2Ɍ�O�D}F{��`'EyPEEY^1lm�� '�`u��0�i��S��̌"�ƺܮ�ʶ�K�.X����d&bur���]��7����A�������+6��18Ed�w�r�?y���J?2�Y�ܠ��
��y����K͐�F���پV��O�`vu�ܐޓ���9���%R��1c��D�!폵_����o]�F��ST�(B�|��DNϟo����R`K�t���b���I�8����/}?)���u��6>y)�]!  �A��M��e0���  �fz���~�������� $�]�ny�(�T�LjCYL���x��+ф��j��Ԧ�3��EE�i�I{���o����Y���f�!e�9B�À�1�ؘ��b� B�X����U�yp��Q`�5~��:��8��.r���W�3Aj\0�a���q�'���5w|�l1�(j�>r��<3���,s���KH«3;!nR���h^�"P�;|8 Ij�[Rߙۗ��9U��Fb71w2��)�� ���Z��Ѳ��9� :�M9��d���ƴ>�Z��(�vK�~���j�ށ�E =��2?�{)aC���m��]_�F;�,
#�v��N��K!	E�@87sd��`�E�Y������2Ӯk,nv��Tϥ����"^m��$�խ_sn�a|z��ߤo�����9d��4Fl(̝[�����N�~M��18_�ćT�Vz]�q�{�  a�A��M��e0��� �w��@}ɂ�$�]Z�`pu�j($���q���/���hS�$��G���O���پRP覩���Cc!|b��+�$X3ӝ�_K[�
.j3��a������Sğwc�[ "2db�T����ʭ�_�W0�o<�ȣ	����&��SԵp ˁ�Z�ǵ����4*;�p��"s����P6�W�`%@��E�
����B���̉���@$���U2�=Y2iƗmr�v �$���u�ǡ�TL)'��,�"�pd����R�L��c��N�z'!n���etF�b��N�G��5�f��1��Ȑ��>�اꆁ��?'!��v^q�x�tԈ�qg���'�W*�u����U� c��cO�)Rҽ�����5X>Na����h1�UΜ�ē���Xf�PMvȢ�E,�2ȃc
�
`a�44�@> {"��+	�vݏ�� G��+˽��" u	�]�a#˵Ww���KS�nԪ#g, �,��%0L��z�9�k�^IS����bT�n��=��C\2qz<��˝Y}�"u��h�J�˄��G�./�YiA-0�f����<c������}aM��0rܻHm���b��>9̀�J�$����'�o��q����Wk~�1�� ����ȟ�l���o�|'�]ݚȪH:W�!wF�I��~����7�0aҜ 3_�����-�慲�g�N��A|���8.ta��� �C38���)�yh�^�x�w�(9p%����w�G)�͐=�r���R:�
ջ�aed�L�׼ݳ����*��J��卦�(O+BG����y2���_�����������QPr@�_��L�0D<?,�
xkZL,ǵ�uy�r#�:�Y��`�#K?1f�^z��������^��e�.X3��A��;L&SK&�"�T�>�7�h�T.��Cj��L-�i��������|�3r�瞓�84]��	��FFH�ܕ4d�D�����@�I�#�zL���A�*�3]�����KϿ��6@f��n������3
��D���W����a*���CG��׫�+�}���R741�q!��D0�aL�WK��C-���hl;��Ȍ�7���_&����L�Y�nӗ���h��NԘ���7I��ES!д���z�;_,kd� L:�4��;��`�p����ޔW�nna�_��6���-��ЋkH~����_���j��q�EO�Z.l��o�C�����q'�e�gv��>��W�܁R���e��+����*�4��"����p¨�������H�+�vӝ�a��n,��Ƙ�CŖw*��K;���5�?+w�n���zS������ڸ0J�k4\�_e�ۄ�ݱ��m7���1鞸L����rC��$�_��j��7��Y��`-#��R��e�	A�
w�G&�~)��LQ���;�����.mB��;	ߕ2�����J<~�1�!B��u{�g������k�{�������	B���h������AO���u%���&J���p�7 �N}�)��sY5�#�i����,'��IFpk	_���3��.ڀ,iD��΢�8,����l�G�KI��ڠ��;�o?:�ZV}.7�_��u#M�]	�Ie:�d��k7��4q:*���d�k�$�TB�~b���r��*FR�~�U��sao@�:� �J�m�ں�MM�����խ�ꇊ��s�I�El�=:�����?�Y���z����h�u�Ū��dݛ/H����J�%@F>���)�[؊���"ς��#0��H�~\��J�`���x��i�.+��O=�J^����%)]<�eVR�庋�
�*�=;�i�����c �_�`���Jj&�]x��:�R*m��~��L} p?RǪ��L<E�k̙�OV����g�ٮ�Kr����
�-��iE���s��Wx�>�Z�Z��?��wY2�<؛"/K�����c���ŀP7%	(Q��1�4q�3������'��4�m%.8���(FE'��K>wTQ�`��˶a�������bvmˡnL�cˌ��a��5G_�3x!���$��*9�[�F�·C�DU���'y�GC�#��
�{��2�E`�\8=SBh (s�\��W%�cr�V�������dAs��So�D�7�*�ԔK�Z��u����i�<�oQU�uy!����#:�����د1t���ݗD�w� �h���:�!�^0?m��ʺh��ZX\�h�[2H����V�%��0U߃p����=�΍'L��+թ��u�TIjoRx�ɒ?m�N�+��j�|(-{|�Wzz�F�a����1����·���A�xQsI�иAn�#�(�R��V�h�.2RTN��5����5�u�ʕQ�?:G(��[]B�z���v\���T<]#G�\�S
��&C�gM�vF��ռͻ�J�G�4�_?��.!�y�o�O�4Imܱ?�g3s�>��(l�y����3�Ɍ��8�l��{�{&����y�Ȣ����|6�>�|�+��-�����a'uaÓ�����ϼi�3e���t�3��.��[-��`�_���`"o������DS��V�JmV��+F�#ZvV��a��Pj!���4*�k�kTb�t��^h$3����A�sG�:CX���1 ".���{�[=V~i��v��-a�Q1��N���i#���}j� �LňU$/�g�6�N�3l��1:Η0����B)�
nϴ@\}�%q���Z`ʉ"�b�4��跖�/�����$�j~bf(}��KZ����}�ņ�'�o�?j11��y|�㪓�6\�R~>���sT|�O���r��ÇU��E�_��_��XI�C;>�(���R��ǻ��D�eie�M�z��ҙ�A�
�Zޜ@�®����N�]�9
7�!�}��Tq�a��%_�����"�g��
NXyh`7s!-����-�.	GI��uS��_͂��>�y$c��	8]�z),$~S�A�=u��]�Jakڡk�=���I��C��e�{��RE����?��&0�]p���Z�x!�ή��Ű��6Z5wAYR(���,��s��W&�(����=�8�13ԜL�{�И~��������]�_��-�_���Y0�(@p�R��@�hLv���~�QfA��.y8�1K|k�f�
sv���z����<�sv �y�8��}���*n�!��Y���$����q�2m �9[^Ju�[u1U��4>�T��q=������Q�o�ny�T������A��<6��0����g�jH𪩡��Ӂ[g�?����/�l�-��!�2��k���%?#p�<��M0�$���v.3,LG�|���T˿p�I�V�-����+���Vv?U�;����u�U'��&]��n=��l���`[�6¾�3z�Q�9��xHf2����H:���RM5œm��|���L�T��ǒ�@i�;սv$T��еw#ʜȮ�K
��o$S����&O�K[� �ת��,(�ڔ���exF����F	���P�p�t����h�Nht����d�����b5��~݄���u�uf`-����)�:�N�봮�s9���A՞ľ-��<�,�&y�K]���7E��/�N����?�v�E��������\�����2�~>굄� �x��O�����<*��l�ӱ��[" }Ub��&����"M��Q�Ys)S ,�X=fjmJ�Z�^kŇ�wu>���NT:��1�ʴ�p|��H_,4��I.�~��eB����},g���������I�NJBF��T�Bk)~V��'}�V�䡩�t(��8]�4�N4_{��#"����>�ZvKY?i����X���dn�/B�/�S����P�S�*3IB��]�~��_Q���ڙ����@ÏJ��HQ���IB�i�!j_�4`�/�;�]T��a�,5E����c����9��i8|�<���?�/��,��ɨ���ntT���$���C��u�J^y*U'�'[E�@�)�w�޹��q{Q��'d���>��p�A+���W�P�8�=�޻���Rd�f9�1��;]�4��>ra�b�����vm��*R�X��sp��ٻ�Ef0.��c��P��m=���/>M�3唷�ym�Oi�:�¾>=���@;�9VLė��y��q%��\,�ç�2�;A�q��Q'�U�}�>����+�����q��w�� �Yť�b�ظ�Ѕ��G���K��A�9XK��&����z��F��]E����>�K���` z�	5@�.��\ҳC�ݯ�s+��Vͅ�T�k(eFqR�e�ȈZ���Rn��5�oߑ�����m�շ��J�Pf��6`DnW$�ϸ|iF�͈n��fϱ�t���u��$�	}��\��$E�+���>P�Ҥ߆��d?��n'� κ%?��=8�[��ɻg��֓���2��]>��) ��" ���7?T]���&�sy���t�8����u��9�Z2δ�Lvar TYPE = require('../../tokenizer').TYPE;

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
Z^D��o-aB:��c��k�zR|5G#����̲�^(����i�>�X��NP6�D�q$��H�lƋ8���@���_C���I�B�嵳�����^֑�n=5��4T�͸��a,��b=�KA��',Y�=�e��$�EPBi;����06�����;��툮��L�/j�r������J���gwʩ�Vг.���M��mW�p���L�5&�\�^6d�M�Sڍ� �{7�3tE��Ú�qG_)F�4�s�1o�^!__����
|�~1|g��� x�_�cH�%�5���om�>j�vRP�Бft��H�y"��UVʹU/���a(jOg�9����ޫ��ݒ���\�6=|�i�T��S|+I8E��.�嘙$�0��vK����i��h���JЛc�"��/� <�t'�=.����y�������r�M����<�T�z�,T�%�_p��,{�JҋDı��	�o�4hY�gӤm�|h`I���d�j����;h�;�����Z�o�KMoF7:����K?�̭�I��	B�i]ԩ�U���I��4E-�p�	N��ʷԛ���K�KN|��s4�����E�C\?Y�b��Eێ�-��ס����)R�� ��K��i#R..�~��W��>�A1�h��J�t_p)�f��f���Ms�Y�SJR���-4N]�pX�Y�L.pn�^B.���?�G��[��|=�?���)��fx��rw Gв�_�'�Xa8EC�*��Z�T�D��;��nn)_��_Ƞʧ� ^ ��������Wz�K����S8�7��J9^�A霕�[�T2��)V����(�E^HxD�y=qTM�נ�;�g��O��blOvJ�u��'�O����kҲ����D�ȹ-j��[���ҁ�]<��9BB#on�~��uB��= i膣�E�WU*�-gn�I�����ۮ�Xl/	��Q{o�P��(��h	qM�A4��D�)+-���ȜN��n$��åk�%3� ¼�X uwG�~�|��|��l;f�h��� �K�{<'�	:'q��x�b��p� W�O$\��
��/S�������y����Yv�zM�iū�a�uz�$k���HK�+���@�+�ʵ�n5�j��a;��>24<�{��c���H Llm*�lGҊDں�/x:L��KP0r��lny�Z��B%K?���M}����aq�W�D����wt³����v��\p��-�2����5��t��lv�g+-J�l���.�)�I��:I��_�⑼c���ex�bq�q���n7;Tk}��*��C/�LT���lܘ9�D�X\Kg' ���{�v�{��Cڻ�8�{�z����K�z��
*��tlY�5�6.E�*�BGIU�����*1��zk6<�'�2�d	Tn�h���5�d	�CW �� �C�����JG5ă�֕5��L���l�АF�T���.fS�X�:F,+������\o;�R>�u�����_���pw�$�~�óc��A���
DV�#����3�*Uz0a����g�PN�4��m��9�9���p��5h-t���{LFm� Y���h��~D8.�g���T}���?�N��x�(;�hI��G��GM�#�rS@��
ϋ\a��$z�1W�*eu�[6k��iܴh��=��,X���n��M\>�|����q��>�sϞ:��Ll�i��_�j�jS�a��"tkOU�8{�.'���}I�9��B�ѻg/���2�-�
�����ɍ����n�o�j�4�w�<O�&Wd�����l�Fލ�6k�bpt�A���R����@�a�ӻ��|*7��_@�$F���4�	��2����@����P��T�aTE[�ͦ�|�5�/:���T[�Ӥ�"��;��:dP�� ���"Ù
�9w^\�+�k����|/�S�F����D�t�bܱ���~-��<~0x���1��%�RH���Ώ����ȩ�Z��LN&Y�����1����f�+H���	0�s�+ҙ��u� ���w��Sb� ��A�_R�+�o{��
-Q��=bmK��.BxxW>C�n�}'&��$o��84=�:l\з��� Bm��_ȫg��ċ9E��篐t,��鍺�j/���
�ʇ-�UB ��:F���#6��L�*i7���@Ǖv�[���/���Ͼ5J���M��/&u�e�Ď�����}��6��K��������$|�*�n�@cG����ї�U�"q�j<�-��.N�Ko
����k�:�L:$i�)q2���.�?���
��(�)쵪��*d(Q�^�}ڹ�hB 8I��[���n��}������ty�tzÝ\�M�=�A;�eD�`�^΂R��:y
��G�����.'Xn�I%�}�q�=���w:���.�-�.h0�PY&x�G��r�qU�2u5:w�q�1�#��Js��ڻS�Pk����P���]��P�5Ab�-j�2�[����I)>Y�̧qО�����=-�k�A��
���Ӭ��j���p�������Ԃw�#�"rYC�6J2%pb�e�=o�C`�1F��֩c��*�>�e"�@�,�y�H:)^����ye>�|d��/������>$�GT���`������An/���]�z���ޖ��|�Qk�\jN�I7�.6��lPn9�K�g��Sه+ϯ��$�):��[���!�u`�k��O�}�΢;IiO;�im�R�� �: ��a��!pj��z@m��4f�]!�᧍H����Hfc,�Jem`S���o����}��J��{�~�}{3����[Ū��xM�E�W++k��:3�p���rG0���ҿP�FU����
%�ɨ3�q��ِ�S�7P_�g�d��I��9Hs�W8�!���}����n}��CN6t9��s�T�EH�a	�ɂ�zxh�D`�g	V�y:��l�Aq%P@d���6�7�E�nK��b[��-c\Hڧ������\l���',������[�ʜ�,�R�c��w �x����7,���mb�>r�"/�
�u���"^ ���|�������H:1ӎ�`Jn> t��`p�̹�O�� �D_�Ģ��,'^41i���1���η�J[���xN���%��3sň���Zh����fazE��B������|[1������C�Gm�m+M���f̟��	G�^u;V��*���F!okN�<&iP�z���	�	���N \�'G�ˎ��:���Ɩ����~�I!7�fD�nǡ�C�	 �����2�����8�\o*�8�\j�%��OcC�#6.1�&:��$��?�r�������'�4�A��N�򒆌�[h�X0Ù����{��+��d�o~��{�����JM6kG�\��7�!��2�z�n$[7��oH%s\��eHq���1S|_,�(�D���@^�z�9A?��9�'�Y�zŝ��:G����*��
F�Of��v�����X�j��g�$XMK�)���aC��fC���^��e����m�Z�O��a�(S6݋/W�i)ݑQ�o�Q5�UZ2���8�!���w�u��������\�D#��
h�XGS4ڜ}��V�Aoǿ���
�3'G�oR-�^��Y�}�9>z���C��;%Ȟ��_uyk�֤װg�����J0�"0b�X�W�����-�ݒ�����*���+��+(�P����N9�[;���W\�����.�7�sTd���`e��������~�k�X��(�G#_�<��ނNُ#Բ*�3O�_�8�\�1nƗ�Ft��֞=��J��ҽ�7uZ�9�n�)P���aR�i�" �������l�?i�sn>B$5���� �9�b�������������`ɞk�����|:���Wp��H\0W�K�������^���Q�3\h��+���r�%�Kt�ϻ	}iHyc'\��z�{�K�Q��h�@����Ɏ��.d��W��i>�z/�چ�K��V�(M�+8��7��_�k��*j��P��4��A�Лm�GE2l�J��Ԧ�lg"�H��&�	��Ȝ�D/���uט3~�O�J=Nl+����>�0��r�:��9~S�������"�8��k���4�9�����m� �4��	?Ĩ�9�L���8�Pkf6BmX�,xwK;_r�6f.�^L�D*	֍�8W�+Hq����:��LY�)��]�*�j�ljW���1�6��q{/��|1eg�ZŊ<i/�&d�ǣ��/�tl�^ȏ �gwQW�f�c�X���O�:���X	��i5�`@�E1ԑ(.~���{���q�O$;JǞ܄�{]᛺����c���:M���;�]�6�?�����R.C��Q��
���3��D��z�A2t,%R����ꪨ�Ա�$*�����DXU!��?�yxѮG��q.��o���ω�����Ր�$�43�R�G`u�*����
A��c��a�Yh8
����6�M\����� ���� (M�ej�Ģ�)q�D�T�_�K�_14r�����*Q���;���(p>wC��t]q�\<Y�\RU�DŊJ�K��K�>� Z�T��aY�霪 �:]5X�O��/' ơ�r��!�2����-Ӓ��77>vE��\Z�B�ܟ�hq�Ne,<�W)�a��$~I��ˑo^� <���v��3k��Z�R'��'�LL��i�������^�4�;S 8g�w�hF��B\�o��Ź��T�*!� �'�^�|��2��"e�Pc�� o��_f�p�^Y�t���r;�U%�ťH.�����.��n�c���Fd[�r�p�g��N#�L��Ț��$[�=�x;[�'89<P����o��!?5�f}8 x����l��"�N/)jR���aqZ\ l����Y �����*��������,�}i���h
��Mx?b'a2�@Z����q���q�͐�!��v��'sD�/$�� G���M48��� �]�-:����T��ӽX��kW�2��D9�Rx�L'� ZCE�2k�3���bt�j��:9�ѽ/%S�r5Ru8����[��,|��~e2�z��둜%<uw�:G�'Fl3��+�x�1O�n}.���� W�����g��v�&UJ��.��7��l���pON��̚���{�C1(tn��ٙf/B>��# c\�X��2t�2���{�҄;�ү�.�A�G�El/��ޜ�pب�VT��i�_."�};4W��
4�C��x�7���%,�L�e��wpޛ_7�_^����ٟ`(v-�d�.�sU9�rr��W����`���hL��|��W��Ҽ\?�-�C	��6Q.�����\��8m��ϯ�����fw�˳��@��0�e6ayWo�L�kk�di�彂"�e-[C��Urк"4����.�	����"`_��@����K�lCc���ʷo�ouus�	G��ۊ��@��u� �,<�k���Mٴ��dvPc��j�գk��"�U��1S�J�����k��MVT���AowʎP�1�4���~C�4/w�h�Œ��'i$Mÿ�b��w.�Q�ȆñG�{���z���	��c)s�b��Ms���y���Q�?�4vR���0+�����N�\��q��,��0���cL7&l,mF���V������T$����y��7��R�)s���(~�OtU�1��A%�@bJO��	v������! ��5��8�\�*'c���f<���b�&=F�E��`��Dzq�w�S�侹��,��b ���질�k~�u������҇So��;k6\I%�Np�G0W�-<���5�\ ���mZ�%k�V���*��8(�߃�GW���5���
��,Q�ǎ)��X�q�s��'�ΪM�Mg�h/��lb���2'����t##~- ����qt8!	���U�q�Ǚ��ݟ�Z-��)iHX/s7Q:��4&�=���8���5���Q�����g������"��Y��ŋ<<ll�5F�?l.-9R�w��}���1@��f�@ �~(�%ց@��T�Gį�\���%l�G��2��`%�uo������ @%(��}y��l^ �x<�)��\��4�be����l=�2\.�PZM�����٬9 ��;�a���0&���J�=���&Dʓ-r9>�ފA&�Oh��%H޴�Z�����y�B�/�φZ*w�F�t�E<`mdQ�����YSֱl�GQZ-�If;]s�@�������tR0���t��v����<�1J��ŭ:���.���m	�p�5"!$Y��E�yܻ
Y�F. ��R��;�2�uܕ�����jWK�;�N���^�[���(��F~���K���B_c��o �=�� ���w�a��ȓcd����V�,}|/Ό�(��CaR�W��\���k�ηp�חN�������*qJx��vĐ�Nڈ|�\3�	$W�����%���g@Q�X��q!�n�d>�~���D�6�t^<_	� ��uP��::�;�30K�46P��9�������{��H���Z�66�u�L��šǟC2�=�:���l|$��L�[��
J��m��y�JY9(��C���Nٕfd��˂s�/�
6h�5$]�y	���S2�Q�d\��U�����/��K�Y5'y��x�3����%l"Nr+���X���%(��+���}bh�f֋q�'h=1`I�5�v�u�#0���`2y��%e!�}���@ ޮd208�����@'����%��ð��d��)�<�Ҽ6���1�B�Y$��yn���3~!�Sr� �q,�)�Y>��^�-��{_�_!�${Г� ��-��:h>�d��õT�E�݌�
��v�A�φ�"T�������������y>�W���� ��8Y�N��z�� �yV�g��|R��cX?<��t5�=�Z��,�K���CQɑۮ"�r���v��h��
@x��ocx���5.���g�] 9Ns�r��؇�I?2���3�9ض�"8�u���[q^(��>I�Ѱ�}���Y`.�����5�y�[
й|�Wfh��D5i	�^
S�1)gǞ/�7ݠ�o��ٝ��,0~�����v1��H0OA�ñ@i6X-Ug���/<v�xKҏ�!��'�3.�} �ԧ6�� b��[��}��xڋ5K<䝶���k�5P� 8��Q�Q�dߴ���1���dL$�fOҼ��2��B1�sBY8R�s��.<4�5�g�AX�jp��Za�ǐ_xyI�g��u��!^*������{���=�q�S�QM9�7����!60�[:,u��ZG�R�x�3�`�!(�{e��ci�%1'�X��E�w�Bi9p�(���`�,���D8���
ޠ�X=��7��$p�y���W�v�>fP
�Nu#$d���-�����4~	f���V�\!%�/2
�?G��t�\�n��~3AO���<��`K-W���kb�y���L�D�[�Ss�4_�����6�ܭ�PW�Ɛ1�W`I*>[v��<�_���`�/6\���R�wF$e.籦.FNY��rì�@y�.�������bR�3ꡮ��4��2�j�_�6�)�Fq�$�G�͏O�4�y���6����c-&�$B^WcgT� M��Ń�7��������G���i2S���.i��Eg��eH��c8Z�F�>D���!͢�F��+Xe�Pe��O �(��d!�h�l�G��+<B"�!7/#c,$vM�N�Wkf�~��H18�{?M�>�
h��Y�4�~��o\���j���$L�y��P�͟)����C��+���0�-ZZ����Y����',�; �v~�5ʰqe��&mI�1�^zX�<�N3�74_��O'�?�q�pzuL��-	�V�'�z5Ab����B��C��?���9Y[�Z�r��Vgګb�^��:��IK��<C����B�y%�w[��h�EL=�3���d�v��Ԗ�P��z�����j���R;w�Wu�8<G[1P�GH5	"@��^כ��o�9Sȓd�!X�KBP�s�[ao��~�Q]�8	9Y�/��Df��k�'5-�4��!�`c7�����9�y�9��?����%~�-CT���5�{5���q�r5��*_y,��h��#!��%$�x���W# ����/h[��d�����Ҵ����Q�5,JwG��S��a2�z5�����s+g�"lؚ��6�h�m��?�8$���GJ�f_j�h���(Hq�P�	���ɂ����1m��m���o;}3G�)�v%9�62��B��^<G��}���ֺUIy�/����4G��4a�.�}���6����[P�좷�`�F>�|�����A�a�4Ĳp	��*��p�6P緙�m�}ܮ���4�^�D�F�pt�sI*�X{=ݱ1��_17'�^���O�����܃]�"�v;e�d�e>ů6<�(-^X���?�������/t�4���׊ q�xzՙ�~����N��ek&��Dgm���r�#D��K�{;9��2��@�a$ه!k7}�f�{~�#����*~��.��|Q�g2�B@��p9�n\��S�ʇ��� ����Fv�ȍ�v�ov�,�<p�(KW�5���r�h�F��><X�T�7�J�3Wm�p�eӯF>�������>D��Y.DX���.��e���>��'��.�6(���0��@��O��;�Ki����#�v�Mu���%$Q�����u=�f�!�/fU����ob��	y�9F��+��ᆴfe�\���6�Gp�=�u1]�G�l^G�&d��Pr�0m�3�tˢܧq�����f���wbDzǯa�������k��4�~�B&� 64i�Sli>?��?���S����m�b�W[I�gP����¹�l��wƴA�mk�[k���c]���>�)<�a����ޥ���H��<q7����|��H8�uB�+?�"�j�%VU�(���t����Nq%p�pz�Sګ=ְ���V�O���2��j�@����/`��)]�o|9�BK�y4?�(����a=�O��3���>k��+F,�Q>�э�oQvK_d���3��: ���?�U����8@��+pT@��X�����D�[%)@[�#� ��iK�������g+����*8'���6)�&2�9��x׊��� =`!�,q��ľ�L���szvl�F��w��( mh��=^���nA�[����K���Q�d$l[R8�̀����J3��~�qG�z��Zy�Ox{w׃h�����;�����&���d�6-{�7�˲NX�)E�-�QD���?To"k��Ql���k�BNp	?�ȹɈ�d)�xFa$�� #���MKK-�L��i�����h�Ӯl���P{I9B�K� ���3̢�����z(t|f
q� �9'9�}���&�F?��9�8�F*z���iqT����tĹ�,�j>[ëP'ڧ��ggB;�b�)Y�[]b�Q�mu,�%r�Gy���AkR��fLo�R���_uh+U��sP���$�Z��mm���Cq��\�=V����[��"�&�G�����5��	�/�K��U��> �ڹꨵ�Z�h��<yǹ��)�����eĭz�"��� J)=:���qGװ6̋`s�,�t�z׫p]��2G����7�����"�szg�R)TS>���kK/��.6�͹o-*H�f����is4�
C,��!�G����JOF���Q_q]�=�?/��ĩ:t�;�Ǜ�H=e@����r�:XtO4�.��݂d�M� ˩�(e8�&�tI&Q���04�$�;�ͺ!���,Q#�FqC�6#ΜZ$�0���^�X�-�r�H��U�7s3DreЀ��ݡn�fP�(<�ݫ|cl~�1�>\IrO��$	�țΦ�s����٪2BC��Op�`Q����D��6l�C2���6r�M�Ɍ�q���
|��.���&���'�S�)���E��CG�)��=6�ӗo�'1#Жoe��3nf��~������OL����˔U՟����.���6�3;�˲��\��P]��`�w���� �޳%���@Am�9lo�'���]E?\�'���u	6�pߏ��-|f�l3���!2b^0�T�$��%�z�;�A��36�˼l[�~��6��λT�}rwd�qR�c�l������hD�z�X^��D���'͒�5f�5��k#ԣ��}����{s��m4�����^�s�a�����w&��
��FA�/���e���vse��M ���?��2�������t�D����4	J*��D[]M�g���*@������=�ɩU�����tʸ'�X.�ȣ!�Od4��7��r>����j/)nL�f�I��48չG���#���߹�e��ި�;����1a8Ol=��ͷE?d~�=�I�a��B���N��B�I� �1������V�R�({j	�]��+��*���7��������DJї�K�F��^ȩۚ�@O�-�귪�	B��K�Ш���e��j1T�ڷ���5�궳�c��!a�}�J�"����,�ϟ��a�q*�(Z�x)Gv�/����K@�q�g�s�$f��céTQ�9 �OP�&�(ɻO���+��gS��<[h� �r��}���7d��f�����/��q�8�a�7m#U��o�U>��H
����cY���c��h���)�߆W��>��B�;a':�v��H)���A3BW�,w��)��T5հV�Zx�z9סO+r4��^᠂h��-N�e�h�3�WY�/Ѽ9�QS,�Ȋ��~X=ޙ��Ι��1����cͱ��<�(��L%=�
�i�˼��\���p`��I`LSc��-# ��2�a��?e<�ဨRS�λw���;?��iW����'�t"�Dki�kw��5�L8�N��,�¤�X�~�����5%��l�_//�gGd��^��ѳ�!p(���Fv���j}1��>WШ�s��R����u|���E�E��na��?H�=��7�_�{�Wp�!�W��6�9�~��8��Gӥ+hJ�Ƈ��=3��h>>��YjT=�>�ӽ����>Y��7�m\ 	pJʗ�_���D�ѧ*�,AwD�	��MU�H��f�n���c��R��=M���%��)����G�+�f��ӫ�|���v��ɭ�K�K���6Ŕ.���;�6���{�!S�i#��b0/R��#����~T��f%���i|7k0ҙӵ��!�J=5\D�� ��PT�Q1lDA$�c}� �ބ�!�����Atwh�S����>����(�j�n�8i�#�o��Juw�����/�䡡T�:k�޲�J�d�JC��(q�����d?��= C�}���H��,O��)��F8���R>����,���5���d� ���\H�`V��-�zMLN�_�F�g�,.�=&4᫞M�8�>����6���^ �xH��Y���_
05�I?"(��;\M)6�1Э�Rk�R�W@gݎ�P�%��_�R%\J@��b���-�M	�y��3:|�%2
;s],�1�>��v���^ǰiG��Z��q��\��{��Z8���5leg�Ѭ�i����ؙ�	�z�YW0�I�\��"+�0\G��,�[�"��w饂�10������{��6�#�U�.�7>��21Z�Cՠ�W�
���A�]�$�r�Y�^��sfȹy~<w�N �4�����P)<o�_�\�$��\����&]Zt�( _·����5#���<
��z�����}녰7���y�#�߂~L�-�76ǋ3Nʏ0'�ʝ?��O��W׆�ʄO��-�dGW�h�6�&M�ת����o����3O�:
�e:�oo&�eh��J���Z�I�+���-%�q���.-��Dl\���_�e�%��'�$�2���U��-�6�/�g7V/���!|�r@��m~�/�0��h��4 ���0��͞������[ EɘkE�D�ʡ�\�mjAE��B�!��qվD��l�h��ޣZ*Θ,��s<� ��w��4%}��w� ���?q����g2��_nF��䯴�"#��8<d즷��^�i���,ݻ���h�<�Q	����Ѳ&���+�)
����@����څ���D�=��*q�/%�̠b� m^��[zӝ���Oh����,��x_���o�9���t_6��ag���Е·y��$uƒ"e������8���"�E����tԇ�3*���h�w��AFNl��M�zGE��(�:��ca.��-�f����F�v��c�'u�<it:��}[�7��8zl[t�����IwI�"�_�����;<Of�r⌯�?�a�^]�\rx��j��?�*#�͗svQcx��!�~qV��c��M�	�6�������iD���Y���	`@�XyV�j=?��{��$v�w#c�I��F����\��V0s&��x��?%�W���i�{�1�>'pQ��ϳױ�/8{�#mg3���>�h�tk8e����W~�c��i���`��|es�����b[��r�_e��9��6�LP��&�(G6[� S&� 0��t�����۟�>R�*��@M�(vv,���Ɨ�u;�������h����*��ࠈT�0@����0]Q��ήAA��0�7����N�1q�����\�g�¾B�g?��� ��a��}y��m=��1^!���4JK�5�/�̐f~�7�C?hP�����m^!�F������ց]�yo0�V�>���R�J���� i��&��bM�(�c��6�8xJD�y]�Ybo^���E
��_�Φ'�Q�C��"�m���暼��D@�I�Š��n�R��rO2�X;�.Ԉ�Q�/U\ɪ&����3}.��C@Ҹ��y��|PdR�N��N��7b ��Tf�)9�������l��s������f*�4��M��h���t���
�:Ø����=KTy���y +x{+��#���(Y���}Q��G?�OG\��%J��k.����ֶ>.Qk��5z�,v�2��~@k�����GB�G��s�l�cɳ�* n�J�'B����;>@�fÖ�_b9V�om-}�5�zw9�K�Jj���͇��(:��*��"ʘ��a��_Q��4�D%�Hb�ݰ`�1<OEΣ�f��s�1�9��>E{|�Y���L����j�&�J���a~M��?24X�y����يIMl�"��3���wbN��������]X!Cw ���&f��+�u�I�&������"�?nᵒ0
5iv1��XL���<���yw�������Z }�:�&�fN|Y�B��S�J�p�-;�r��c։h.��ΒOU�tr�g�H�=4��V0Rr`%�汫kI(�#?LE�W�M02zf��X�Q��2'sv	I\D���[�� ŏc�܁/>�L��מ�N#+� �v�,���{����U����b��%��NoF#�YF��zO6C����O��Z�q���:(�T�O ex+�h5��ܾC6��`x��;s���A���z-���Q{"version":3,"file":"parse.d.ts","sourceRoot":"https://raw.githubusercontent.com/fb55/nth-check/639fd2a4000b69f82350aad8c34cb43f77e483ba/src/","sources":["parse.ts"],"names":[],"mappings":"AAOA;;;;;;GAMG;AACH,wBAAgB,KAAK,CAAC,OAAO,EAAE,MAAM,GAAG,CAAC,CAAC,EAAE,MAAM,EAAE,CAAC,EAAE,MAAM,CAAC,CA6E7D"}                                                                                                                                                                                                                     X4x�Q��Yl��Ȥ}���B\Oϸ���.�9I�hz
C/;�{WVX�:�t�����O"h)Ϋq\9{믡�J1'����燮M��n.��O�h:oo-}���EL���䝏�b��=*�W�M��}*~:aA
Ir7n�@�P�dX� &W���Nd�!S,����ᴇ���+jc�݁/HY�Q��(hF�m�P�Ӈ暕 T ��t���H��O���Qr��NE=���!��t�Ih�I4Y��Y��7�Z�9X*%M��wN�����)�G�wAxD�Bڲ��Ka���e�:X�ǎ�F�PC�������"e���^lq���2�C��Q�����!��ߺ��#��0�m�h�f�E)+< A��R��,:O������8Lu���S�8��U���r^X�@�߼�ʤ�lV�uN�~9�@a�=��Ae>��g���D��C�THñ�U��4t��^�$d��5�P�,|S�n�tcqҖ�l�/��.�iV��b����F��o�o���F���&���5oP��W�z�X~��.{�K��<�0�� ��XG_14?D���t�+��O�X���S�� |{�P��Y�8^�m*Xp`Y�XU�+y��&�'&�K��Rf�Ľ��*_!�[��"���϶�Uމ�y��S�K��ù��&f4`P�_hkZz��Ȋvl��N7e�T��2:a&�������K.�r�AR�u�i0�~2DM2x���/���/k�B�'jQJZ����
��N��i�u��vv4��ݗ�@˚c`1���A�
# ���ۡ���%3��93�@��P�k~MwBE!���&q[_mBN���M��H;X�J�绬�҈�O$lb%��K���� ���A���&#�ݠ�%�](��
���[/��t��v�F��*t댓�8�U��m�8t�eR_Cb�'l+��#V��5W��c�>h�]�8�OR�wp��+:���c%�"��Jb �7����W�����ʯw�W�WH����S�g�=�~ �7��ؿ��J�"�t��X����v�3�g=l�/��B~��W��'�������U"yoX��3D��ဤ%r���A����� `���Z]�-C�=$s�UJ�f�,�dwo��ӻ~�7h�^�=��+�{QdSF@�nwKi���Tz)5z����L�D��VLFc9�Z��}P�D����~�W�=l}�����ޕ?p����F;�_t���⦻Y��bB$�i +��}�lq�
�O�6��w�~!Zp��.����Q,{�&�D:�:���\�\��������E�����\��+�r���ڶ1#��T,��M���<���\`��o�Kҗ
�9�oo��'z�����	�� �^��u�>{�����ޕ�=�V�$
�-�F��7E �GEs
�UY�Ds�Z����i�9��N Ico�u�־,W	�����z�7��0k`�av�e�j.dl��6�ut�J��R���G��-��͟��&;
�A �j=�������*�Np^f<_�1k��� �����5��ef�^i�_�,ӂRF/�Dϑ�glR�oU�++���0ܴ��=���~���?#Rm&��-��BB�]�܀k�/��a���+��Q0u<�	�<��+g����(nC2�Ɍ}�2Z 0�6s
diT5Z����~+yf@Q���?� ���;0k�G(�GY�m�&D;��������\�gc�������<���F�� p[&!	��8���L�R�"��s����y�B9�}���B8�Z����b�҅�\>�?�N���?����%��?/�x�5���G�s�hl^ ���et�T�o�C�/f$�H�?���`��}/��睡�ҳ�(	K�W��C^����Ƶ�Y�Q0���^�	,��؝<aș��?^VM޽�-�tb�b��t��ծ�~�7��t`w�4�u^���ΑО�B��NRX[i���Ź�z4���F���V�xx��� ܄�%tG�F�yO'r �� c �稬�T,���ip4������h�ک��=��3��X�x�W7�T��i����i���\`>=��]�_#���	p��z���d7�7�X������[��i-r<b��9eo���ֈ�J�4Z����ldP�7�4H#Y���}�1�(�>돌&b�p�_�!�5n�s���G����kqr�t���Z���P�w:�ԏ(�Gd꯼0Qש׀wh+�[P��5l���ME�
��DU7RH�|�JH�Ĭ+��:`��eL�p���fܬ�KB�%3j��4Zq~�N ɐ�U�F(�
���7�MO�����V�y)�-��y^���P4������R4c�Qd�9�� ��7�)H��Qy�\��$M���������=�z�h $�c���}^{Ff��h?�l��1��U��6�����Q��jX�W�5���
'�VWqlTI��/�_!җ���pO����} ��	�"j��^��1`!5t�R�0m���|�'^=����?�zd�Py��b�I�4��W�2�+X�gt�M%�f����
3�?��̡cK�Iy�\U*�������oS�={�*nb�)j�&'g&F�=���>��@�$#�GJ�[>с��c�X|���I0��:�����ؑ��^i��}�P
��it�^����2��x��41W��bX��{'4��������̄^q�:������e��jWu]'�0�;u�_�D_Ƕҍ�m��$��-���yt�W��o֚��s�d�O�gץ���_3k�ʦ98,V��ii��4~.���n���^1���W�z������e� 8��b!��,X�uJ��IL8��؞:[@%G�p_~��S!u2�.�@���L�F�'`e<ՃE�r_�AӴi��m�+�˓�ď����7F��%�'�f��S-s��+ Y��gK�E>���(F���ќ��H�M��ԙ�#�9!��تb�H1�l��%Z-��le��#�!o��oٮ?��a�bW�t�j�{�;v����(K��o)��GOݨ�<˂YNr�����D���U��K�z�~HԜ�N�HH���@�Ob�q��xz_�^(�s��v��I���q�5;�W��)ެ���`D-����W���Q�����*kei��>�wʧDB\oBγP4CT��_-�+��Gœ]�CQ���
soB٬~ *[u2<+�6$��E�������������̅]ޟ^jZ����Cp����ז�[�I�I��]��F��μ;v�� nx�^u��2윩�c��i��8"���y��ܺ:�6v���c�K}2w�V	�����q�B$�c wGX�s2�'#A%�Em��UL]!�z���W�D�J���i��ÏIv޷��$,iG�C:m���.ΕA��p����2Q(8��[e��y�y�' �Y7Wu�I���;�}z:��$�vnqV4��F)Aa��$
�PE��7�ѵ�R�I�O��jP�{
W0� ;�}���죚��*��Y����Cl�[q[��+��ਫ਼$�R��DEEilG�b<�^��}���,c&&;�\�W������Q%S �MEvǚmeGϦq��&�}�����������؉��U�e.I�D����C6��;�ˮ��,!\�F�7Ԍ`��ƫ*м;�]8I�E���U��������   �A��$�TL#� �I�{���U=C����h�0)@>�/�$&*O��P˗@�J݁���0ם�
�Ey���Q��Q_너�D �C����]�U�H[v�i���D�B��K�q�k��;_�ܓ���l���&Z���;���n�Ih�S�]qs�U��)@p�-��ڞ��%�jh�銊$�5�D������'a���ўei�'�����a�i�F��M�Q
�S��5������|C W��/<f���A�$8�(%�wu@ka������,�!��<�%z��nt*��K̭�h��F͈���� ���(\d�D�x�j�hP\~��E�V��
gOh�W���+ ��+GL�ob�	��ݰU[�v�w)���BM����B��K�q��[�kʂV��AtG2������?A��Ƀ�/���H�Ǣ�hCiY|%  ��)� �bi��;7��K���+u2B�` <��NP䖨*�a���o�.�yZE�K��M�R6�����J㼧�?2�8~�0z=?*�e>B�J��cR��iȍ�����ʋ���ĀS%@�fx�n�̦���q�b]��e\�v�AiײiB�rϽ��PQ�C8sPr�61�(���h�#»�TE	{���u��P�W` 4��%�B�^�5�	K
�Q���~Q�zG@t&�1��g\�\�'��y;��3ͫ jg8�)kбx�o���َ��l^�l#iN��)``��Л8w�:M���*�P�V��*��pTS���R�BuD����OX�R/bc�%�f�L�kZ]@an�G�	b����������r��	�!:�4��"�   B�nG� $%2)�1��ץ�\�W���R .�	iiF���ݔ�}'c��s�����\Qn�~j4U�p �T4�ք<��C0P R�(R^Ђ�9wM	���5/U/~r�R�3�j�)�����VZ���"�BZ�ž��O���:M�KI���Ɠl:r�=� �&3���KƾV$Ŕ9�I� !M�L��Ԓ(�<3gF03u�������_��<���^x�\��}�=1�tM 1��E,T