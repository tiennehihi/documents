/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import {warmStrategyCache} from './warmStrategyCache';
import {registerRoute} from 'workbox-routing/registerRoute.js';
import {NetworkFirst} from 'workbox-strategies/NetworkFirst.js';
