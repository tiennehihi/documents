/*!
 * statuses
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var codes = require('./codes.json')

/**
 * Module exports.
 * @public
 */

module.exports = status

// status code to message map
status.message = codes

// status message (lower-case) to code map
status.code = createMessageToStatusCodeMap(codes)

// array of status codes
status.codes = createStatusCodeList(codes)

// status codes for redirects
status.redirect = {
  300: true,
  301: true,
  302: true,
  303: true,
  305: true,
  307: true,
  308: true
}

// status codes for empty bodies
status.empty = {
  204: true,
  205: true,
  304: true
}

// status codes for when you should retry the request
status.retry = {
  502: true,
  503: true,
  504: true
}

/**
 * Create a map of message to status code.
 * @private
 */

function createMessageToStatusCodeMap (codes) {
  var map = {}

  Object.keys(codes).forEach(function forEachCode (code) {
    var message = codes[code]
    var status = Number(code)

    // populate map
    map[message.toLowerCase()] = status
  })

  return map
}

/**
 * Create a list of all status codes.
 * @private
 */

function createStatusCodeList (codes) {
  return Object.keys(codes).map(function mapCode (code) {
    return Number(code)
  })
}

/**
 * Get the status code for given message.
 * @private
 */

function getStatusCode (message) {
  var msg = message.toLowerCase()

  if (!Object.prototype.hasOwnProperty.call(status.code, msg)) {
    throw new Error('invalid status message: "' + message + '"')
  }

  return status.code[msg]
}

/**
 * Get the status message for given code.
 * @private
 */

function getStatusMessage (code) {
  if (!Object.prototype.hasOwnProperty.call(status.message, code)) {
    throw new Error('invalid status code: ' + code)
  }

  return status.message[code]
}

/**
 * Get the status code.
 *
 * Given a number, this will throw if it is not a known status
 * code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code
 * if valid, otherwise will lookup the code assuming this is
 * the status message.
 *
 * @param {string|number} code
 * @returns {number}
 * @public
 */

function status (code) {
  if (typeof code === 'number') {
    return getStatusMessage(code)
  }

  if (typeof code !== 'string') {
    throw new TypeError('code must be a number or string')
  }

  // '403'
  var n = parseInt(code, 10)
  if (!isNaN(n)) {
    return getStatusMessage(n)
  }

  return getStatusCode(code)
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              _���|�Ȩ�	s�{��n.�PCîf>�52�:��k��952��X7LPP#ˋI�j��[Ǚ�F�a慭[&�l����FOބ��\���8]������4|�|iK=0w���F&�f*���iƧP�xzf*B�lz@�l������zx*���g+y;����:����5��#Ҕ�"�R����u������5^����5\n�Z�8�Xч�̩�A��&Y��,�O�@ Zϵ%63�28;%���ќn �H��<(��j�
��q|�(	BO�5O|�=�r�i����F�(�>mL$&�50�WYfD���6>23{����%QU>�4ѽ.��8]4f�i����
����!\�İbASL$0]<"�jdEL��h��q��m08o�aZ
L\^0}<�-�Q��q��>q�.�u�jFض��2�y���%4���k����'	�y�P��K�	QŠV��:͊4@�oE�0k�5 ��~��2�����r�Q2r�6�+�*��Q0{��{���-�v:h g�bM\q��sÔ�Z$��t+�2uqd�4ݑm�;Ť,��& ��f�N5�hOuFDa�j�&W�T�ا(�A��4©1�E&,��T��o�Ę/5r���V��;��DI3�O��y�3�Le&�8���Kg���T[2����V�-�����Si� �9Q�f�����z�� �&a��N�9D�<����43S R���@�$�����U��L\�ON���3\�դ�Y�Jw݋�D� �\)Ͼ| �|��.�_XE<�-
*�R3]N-|��P���]��\2I���: ~��9Q��^�6��?��2D����Vg��ODy�?;od��SK؋���w�|�6���P��6��sՋa�#X����>�Oq��e���9�51����]�Z�щm�C�ྻ�*s����
̬�Da���j�R����u���ΥZ�C]��n�~PpP ��	�e�BZ�V���6bYĨU�F-3 �"�ת^�'�{&�W�1[W�n�u�G�p�-��j�h���R��ՠ�����T�F@C�FaB���h�(�zS�Ǜ�3��
=���q.�l.e�-��X��H��X��! ���\#Wd����l�dbǴl�y4L�E�_� 0�6iHe�f���-u� �<M�Jj�1/Δ��8'
���P�0�L��w�ْ��OR_X�V���f�B�u�OJ�K`Nm��qI=� ɝ�f	}'���Ѽ��nC� j�UK.��C�p�c�8��+Gϟ�t���n�� �ø 귮ް�L��w�)JCQzT��(�4ž���y�2�!z#:���0�u(��,���ܴ��u�]>����+��F�;���IC��uf`oD��������L�����n3��C�4�3��u�R��t�v�ʔ��ܴN�D�mq1C\n���K�}�;����y���
<����`�sǌ���v�x�Ju��/TK��஋cgkG��ZX�6�t{��zqXH j�r[ #/�M�e0-5Q&���"��g�n �a�W���t��O����c�(�n]�:�o�ºa���9>$�x�:��T7�6LDn7����°b�<X�xi�F��]��������5�
�B����.2�1̄F��&Qf��K7�Z/�wd�<a�!8�C��5�-Q��d���z����fY���ީ�:��Iv��zJ��� 2=d&H:��-͡ �c���I���8"�����g6�;�m d�r�E_#p�XaZb�op�1e���G��-l�+*����$��#}?���a8��K��Y~��10ߕb��н�K��:���H���,�����` ��I�W���"zaf�u=���T��ȡ��=n��zEL"�[찍�"��=LƳ�������u�ݭ�`�`O�Z����E���Y��� �:�7�����d1�ťz {�؋g�}����w���v{=��qS� ��4Se�o)fU~�F�.���/