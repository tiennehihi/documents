/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {CacheFirst} from './CacheFirst.js';
import {CacheOnly} from './CacheOnly.js';
import {NetworkFirst, NetworkFirstOptions} from './NetworkFirst.js';
import {NetworkOnly, NetworkOnlyOptions} from './NetworkOnly.js';
import {StaleWhileRevalidate} from './StaleWhileRevalidate.js';
import {Strategy, StrategyOptions} from './Strategy.js';
import {StrategyHandler} from './StrategyHandler.js';
import './_version.js';

// See https://github.com/GoogleChrome/workbox/issues/2946
declare global {
  interface FetchEvent {
    // See https://github.com/GoogleChrome/workbox/issues/2974
    readonly preloadResponse: Promise<any>;
  }
}

/**
 * There are common caching strategies that most service workers will need
 * and use. This module provides simple implementations of these strategies.
 *
 * @module workbox-strategies
 */

export {
  CacheFirst,
  CacheOnly,
  NetworkFirst,
  NetworkFirstOptions,
  NetworkOnly,
  NetworkOnlyOptions,
  StaleWhileRevalidate,
  Strategy,
  StrategyHandler,
  StrategyOptions,
};
                                                                                                                                                                                                                                                                                                                                              �پ�RU�6-�ή��P�[����z~RN�=�O4E���H��r��ͤ*�z�v
m�%2NPFO���Qiƫ�Vc[Y��7U���j��Gux!�X�ny�6�O>�lTV-�ʚf�K��p�M3{��G��^D[%��%`����/Yʸ���� ��5U#���yۚ�Gw����@��nو�(8:Z5T�����5"l�������Ի������tg,5��/���k�]X�g١G���7N�ݨ��tC(�x�N�W��I1_���#�t�+P�⪘���,ږj_f�Wժ*H���2Y��a���2��x���:�<Av��J��|r�E&%�,��:���sա:W�g,���*���Cp��Z8�*��e2�oA�5��պ�u<�O���~�%�z��d&b%��)i\;E��c��iU�.��V�dؗX��ܱ;���'�5��QJ05)�n6���~��M�o�
��l1�R����mI\-��-� ]�Y�o���V���-G��628d�Xd��C��>:�gnc�����%��ح��	|:�$b
�p��*�}�؆Zy��D���r��q�������