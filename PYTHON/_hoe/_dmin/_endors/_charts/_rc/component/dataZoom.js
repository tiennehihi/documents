/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import {registerRoute} from 'workbox-routing/registerRoute.js';
import {StaleWhileRevalidate} from 'workbox-strategies/StaleWhileRevalidate.js';
import {CacheFirst} from 'workbox-strategies/CacheFirst.js';
import {CacheableResponsePlugin} from 'workbox-cacheable-respons