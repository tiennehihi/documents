'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.remove = exports.print = void 0;

function _chalk() {
  const data = _interopRequireDefault(require('chalk'));

  _chalk = function () {
    return data;
  };

  return data;
}

var _clearLine = _interopRequireDefault(require('./clearLine'));

var _isInteractive = _interopRequireDefault(require('./isInteractive'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const print = stream => {
  if (_isInteractive.default) {
    stream.write(
      _chalk().default.bold.dim('Determining test suites to run...')
    );
  }
};

exports.print = print;

const remove = stream => {
  if (_isInteractive.default) {
    (0, _clearLine.default)(stream);
  }
};

exports.remove = remove;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              �Xw�LW�x*���Q�2#6��\tEs���%+�q_h/4�,0JUǅ��1�r�����\>���Q,V���Q�7���(�T+x�V'ՕU)�#!7��%-%�1)�.�.�+¤Lu]�4���Z��H��uCy-�_I>Uk�mG���of6�����+��(�
�����*�8���a�V����(MQF�f�Z�C8���΀��q�ф���K�o[�����3�_$�uv����8��#HWU3f�r/��/����)nGY ��>Q�;�����V͑״�����Q��V9η�L2h<L�����e��[���X!@=��Fjҵ��M�n}&Ĺ��������D�Q<c�)�t���&:s8��pBQWf�4�<m�$�^����KN��6u��f������ۧO��ן����)x���9���a�0|����%S�gm�!�n9�v������?��ҝ_M(��$�����f0�/t4��% ��{1���1jQ���M�*����;�Z�7A���&���J�l�����qm=�-ڝ_}Q�]��Iw�	i�n�L��.�Ť)2��NY�v�"����)��M2V�v_L̡<˝���/w�����0&�]�[�	�I~�.c�n~���.H��Nr�ʽ�W�ŸK����u31�����I/������mI<9�4P�K�T� s��"�"Y*�gы�ɄrF�)Ts_��%)?K��\��V�N��t�CB#ئHW�����*�%��<\���	�1v�"pw�$ɸ�q�1��-��d��,�rg�K$�,*�f��~'�_a���-�[�S��̬��H�ZU��/���c�U�&�+���w-A��J��^��J�^�!WXECS���O��/*�c鎎��s�*com���ǀD��î�&��Q�N��]CK�j�Y͈Ƚ�j���8�&��P9�b�ui����Y,jE�����I9�t�W�='-4M���ϵ�J"<��|jD �©���=�g��j�2C�}��?C׏���ʳ�nf�Ŕ�wJ�"�Y�?�Q����͐<���o�S���W&s\+�M��Ta������w�v�J����6ZN$x�a8������ �v�m7*��fk�~�*��-���Z�狂4!Jo�dj���X:��FX 5KwI7(Ц+e`w2ۜr��ta��Ye+���[������UϠŦ_-�k�{�1��Wa^(ʗ�Q�UX��Aɦ�L�(֒Ϲ���ϩ������/�߾�mˏ�i�:�ҁ0M-�i�=���|:�9s"P�B���A5������i~�=���|��GPX���9BE���}u6_��������<C�7�ӣ�Jr�t�]ɻǴ�(p�B�n�g�zquB����/ϗ���?���>���?^~>��`ŗ���