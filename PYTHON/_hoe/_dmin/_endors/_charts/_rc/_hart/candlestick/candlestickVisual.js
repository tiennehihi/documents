/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import './_version.js';

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;

/**
 * @return {boolean} Whether or not the current browser supports enabling
 * navigation preload.
 *
 * @memberof workbox-navigation-preload
 */
function isSupported(): boolean {
  return Boolean(self.registration && self.registration.navigationPreload);
}

export {isSupported};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                 �[b�_�#�.��i���N�Pi��A��%>��ο�������?w ���R1<��¼k	��{Nٍ�"���@y�T���@8����
1�X� "|�3�V���l�����9��n5�'e�]���]�[�Y�]i�H8��f�(o2m9�m�5����� �h��x�B?�A���Hu[�i,����Ɍ��m#z9鑚tl��e��N�I(���2���s�}��-��5�Q��|�:W �y���A�Y��P���F�1��%`�戄�����*�}Ԉ�2iQ5ߔ�X��;:V[���]�y{��|~�̩,������TX�;k{�1�ȲI�!�<ʠ��kp�;����ny��`��.�