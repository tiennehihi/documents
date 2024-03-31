/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import './_version.js';
// * * * IMPORTANT! * * *
// ------------------------------------------------------------------------- //
// jdsoc type definitions cannot be declared above TypeScript definitions or
// they'll be stripped from the built `.js` files, and they'll only be in the
// `d.ts` files, which aren't read by the jsdoc generator. As a result we
// have to put declare them below.
/**
 * The "match" callback is used to determine if a `Route` should apply for a
 * particular URL. When matching occurs in response to a fetch event from the
 * client, the `event` object is supplied in addition to the `url`, `request`,
 * and `sameOrigin` value. However, since the match callback can be invoked
 * outside of a fetch event, matching logic should not assume the `event`
 * object will always be available.
 *
 * If the match callback returns a truthy value, the m