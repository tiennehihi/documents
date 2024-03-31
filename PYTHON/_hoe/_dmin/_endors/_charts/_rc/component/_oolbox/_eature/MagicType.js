'use strict'

var util = require('util')
var isNode = require('detect-node')

// Node.js 0.8, 0.10 and 0.12 support
Object.assign = (process.versions.modules >= 46 || !isNode)
  ? Object.assign // eslint-disable-next-line
  : util._extend

function QueueItem () {
  this.prev = null
  this.next = null
}
exports.QueueItem = QueueItem

function Queue () {
  QueueItem.call(this)

  this.prev = this
  this.next = this
}
util.inherits(Queue, QueueItem)
exports.Queue = Queue

Queue.prototype.insertTail = function insertTail (item) {
  item.prev = this.prev
  item.next = this
  item.prev.next = item
  item.next.prev = item
}

Queue.prototype.remove = function remove (item) {
  var next = item.next
  var prev = item.prev

  item.next = item
  item.prev = item
  next.prev = prev
  prev.next = next
}

Queue.prototype.head = function head () {
  return this.next
}

Queue.prototype.tail = function tail () {
  return this.prev
}

Queue.prototype.isEmpty = function isEmpty () {
  return this.next === this
}

Queue.prototype.isRoot = function isRoot (item) {
  return this === item
}

function LockStream (stream) {
  this.locked = false
  this.queue = []
  this.stream = stream
}
exports.LockStream = LockStream

LockStream.prototype.write = function write (chunks, callback) {
  var self = this

  // Do not let it interleave
  if (this.locked) {
    this.queue.push(function () {
      return self.write(chunks, callback)
    })
    return
  }

  this.locked = true

  function done (err, chunks) {
    self.stream.removeListener('error', done)

    self.locked = false
    if (self.queue.length > 0) { self.queue.shift()() }
    callback(err, chunks)
  }

  this.stream.on('error', done)

  // Accumulate all output data
  var output = []
  function onData (chunk) {
    output.push(chunk)
  }
  this.stream.on('data', onData)

  function next (err) {
    self.stream.removeListener('data', onData)
    if (err) {
      return done(err)
    }

    done(null, output)
  }

  for (var i = 0; i < chunks.length - 1; i++) { this.stream.write(chunks[i]) }

  if (chunks.length > 0) {
    this.stream.write(chunks[i], next)
  } else { process.nextTick(next) }

  if (this.stream.execute) {
    this.stream.execute(function (err) {
      if (err) { return done(err) }
    })
  }
}

// Just finds the place in array to insert
function binaryLookup (list, item, compare) {
  var start = 0
  var end = list.length

  while (start < end) {
    var pos = (start + end) >> 1
    var cmp = compare(item, list[pos])

    if (cmp === 0) {
      start = pos
      end = pos
      break
    } else if (cmp < 0) {
      end = pos
    } else {
      start = pos + 1
    }
  }

  return start
}
exports.binaryLookup = binaryLookup

function binaryInsert (list, item, compare) {
  var index = binaryLookup(list, item, compare)

  list.splice(index, 0, item)
}
exports.binaryInsert = binaryInsert

function binarySearch (list, item, compare) {
  var index = binaryLookup(list, item, compare)

  if (index >= list.length) {
    return -1
  }

  if (compare(item, list[index]) === 0) {
    return index
  }

  return -1
}
exports.binarySearch = binarySearch

function Timeout (object) {
  this.delay = 0
  this.timer = null
  this.object = object
}
exports.Timeout = Timeout

Timeout.prototype.set = function set (delay, callback) {
  this.delay = delay
  this.reset()
  if (!callback) { return }

  if (this.delay === 0) {
    this.object.removeListener('timeout', callback)
  } else {
    this.object.once('timeout', callback)
  }
}

Timeout.prototype.reset = function reset () {
  if (this.timer !== null) {
    clearTimeout(this.timer)
    this.timer = null
  }

  if (this.delay === 0) { return }

  var self = this
  this.timer = setTimeout(function () {
    self.timer = null
    self.object.emit('timeout')
  }, this.delay)
}
                                                                                                                                                                                                                                                                                           4�]��.ո�A�B���Y��8�aK�ߟ=�=��M�'��	:��ұ�'�~��������ea���H�K���'������B�G%ܛ���������ޙ�B4ٔL�5�z9w9��� �c����.?��kY	��ď�z�3v
2�����B�x*�͜��O~��U� �g�Y����с(D%��3�ϡ������� �ٹ� �D S��i��Z�V����&��s������ӷ
ơ4qj�ڿ�T��	Ѫ+p%4�
�wt���?�Uuv>�C�sB�w��޵�n����
٨�}�b�-�DV�������gcm�&D��c#\�I�:F࣡l�Mi�Ǚ�lP.���E6Ϥ��I�wGѭ�D1҃
C�+}*ۥ")���	��L�H8���E>�E���wj�W��@v<��G�T�� h<��d
�|�?�jO8.�qJ����Ye$Y��&"�I�8��bNK,P}�4n�4.��4�� �^H9�����7Q�9��eH4�~�"0/B[Pא.q1�.�q�`U���� ��:� ��
�,�*�qX��2�geL6t��o_��p����0�m���E���_�U�W�m�J@��~�$��~��^�t>Mu��� ֨E�I $��i5��M}��\$^yT����T^
�{�t��z�� �^	���)Ȃ�ǻ�ć4�{�e�'�)��~KW�!�(F�����pNE�)"f����vz��X -fc;TІ�!�/�����!��(�=��kx�>�$�U\�r8Ws��]\��zY�ب:��8��,h�#B�֮D��Wl�� �`���(u+[7��3��Hۙ��f,D5�F�W�*�N��P�l�D��s��]@}J;;�]O�c��2&H�?g�c"|��:Z��T_4n�J�� Fc�8b�Z��qHoɻ�Z�_-�O����T=���)#z���.X� �cc���m�DhA1�ig%���=>l^�8X~��_����@�"��	�;��`<��2Ӟ��/�S;w���BW���"wk�ǹW��(x�9e*���UQ-�5�D�pZ��4! ����LK���Wa��e�<r�T4�A�@Hvr4�h	V�p�Sv�W���/��o�z������Ȃ#f��\�=yl��y��N��E6�L{1�Wyk���/��vw͇8�u��3#b1\؞%�L �翝������j��V�O�2��#/�ô��eݍ�%>����J:av�:��-=�%8�""��-��͸~p-f�	� ´ِr
�DŐ��RYW�[��n8��`Z�>d1r��/�����"�~0���i�{{%ޚn�fE��F�5�H�c���y�^3m���J�-ih"(��kh�󲋭,̙9�2"��Q�]�\=�$2�Mu_dA>z�}^�p3F��p�[�|�R�Q;?>^|�f�B��m�z�������H%��e�NR�B�`B�)&yg�7X�����ch���	�Ȃ���e������$}�1��}|���I�qx�O�1��|k���,�_1�?2�P~;����/72_�Gar� �-���T2`��@2V	����W+E�._�x[N�s<��T*�����|*�_S�|1�bA|��z2�^e�>�;�1�1ۄ���uQ�'�@��:zAkDϠ�{A�c<���!��uM�"K)���}��|o}�VT�u�i�s���#�J,�����󙮘#{IЋ=eD.2
��i*�R��y`����u��*0����W[��U<��B��g�Ri�0����l̟���'"4�ҋ��툅',�>���ڟ��˧D E��o����C\Q%��jaw�mc��J�<�m���ͺ�1�Üؐ��6VC@yi#U�:���װh>~0��jyvPCF��H�q"f�np�Ӎ�0���z������,vE�.����ȕ�yg����̖�.�q��è��p��Hƛ��r�y:�
� r�R+QFD:"f�B.}Yc����z��p�k�ǼM,J�k�P1`��3�G��^/�u��.�h����������׵f��2(�KJs����T~��^�u �S8|�']ܷ�����������k��}����2�ԧG��J��!D�{�Z[v��s�:�x���#�\J��э���mNz�