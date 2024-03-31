0.3.24
======
  * Remove excess file from npm package

0.3.23
======
  * Fix `uuid` usage

0.3.22
======
  * Update `uuid`

0.3.21
======
  * Update `faye-websocket` and `websocket-driver` to address DDoS vulnerability #275

0.3.20
======
  * Updated `node-uuid` and `coffeescript`
  * Exclude `examples`, `tests`, and `Makefile` from npm package
  * Update examples to use latest jQuery and sockjs-client #271
  * Don't call `res.end` in `writeHead` #266
  * Pin `websocket-driver` as later versions cause some tests from `sockjs-protocol` to fail

0.3.19
======

  * Update `node-uuid` version #224
  * Add `disable_cors` option to prevent CORS headers from being added to responses #218
  * Add `dnt` header to whitelist #212
  * Add `x-forwarded-host` and `x-forwarded-port` headers to whitelist #208
  * Update `sockjs_url` default to latest 1.x target #223
  * Updated hapi.js example #216

0.3.18
======

  * Change to using `res.statusCode` instead of manual parsing of `res._header` #213
  * Update sockjs-protocol filename in README #203

0.3.17
======

  * Fix usage of undefined `session` in `heartbeat_timeout` #179

0.3.16
======

  * Fix CORS response for null origin #177
  * Add websocket ping-pong and close if no response #129, #162, #169
  * Update sockjs-client version in examples #182
  * Add koa example #180
  * Disable raw websocket endpoint when websocket = false #183
  * Upgrade to faye-websocket 0.10.0 and use proper close code
  * When connection is aborted, don't delay the teardown
  * Forward additional headers #188
  * Add `no-transform` to Cache-Control headers #189
  * Update documentation about heartbeats #192


0.3.15
======

  * Remove usage of naked '@' function params to be compatible with coffeescript 1.9.0 #175

0.3.14
======

  * Re-publish to npm because of build issue in 0.3.13

0.3.13
======

  * Upgrade faye-websocket to 0.9.3 to fix #171

0.3.12
======

 * Allow Faye socket constructor options to be passed with
   faye_server_options option to createServer
 * Fix websocket bad json tests
 * Upgrade Faye to allow 0.9.*

0.3.11
======

 * #133 -  only delay disconnect on non-websocket transports
 * Upgrade Faye to 0.8.0

0.3.10
======

 * #168 - Add CORS headers for eventsource
 * #158 - schedule heartbeat timer even if send_buffer is not empty
 * #96 - remove rbytes dependency
 * #83 - update documentation for prefix
 * #163 - add protection to JSON for SWF exploit
 * #104 - delete unused parameters in code
 * #106 - update CDN urls
 * #79 - Don't remove stream listeners until after end so 'close' event is heard
 * Get rid of need for _sockjs_onload global variable
 * Use Faye for websocket request validation
 * Upgrade Faye to 0.7.3
 * Upgrade node-uuid to 1.4.1

0.3.9
=====

 * #130 - Set Vary: Origin on CORS requests
 * Upgrade Faye to 0.7.2 from 0.7.0


0.3.8
=====

 * #118 - Allow servers to specify a base URL in /info
 * #131 - Don't look up session id undefined
 * #124 - Small grammar updates for ReadMe
 * Upgrade Faye to 0.7.0 from 0.4.0

0.3.7
=====

 * Expose "protocol" on raw websocket connection instance, correctly

0.3.6
=====

 * When the server closes a connection, make sure the send buffer still
   gets flushed.
 * Expose "protocol" on raw websocket connection instance
 * #105, #109, #113 - expose 'host', 'user-agent', and 'accept-language'
   headers
 * Serve SockJS over https CDN by default
 * Upgrade Faye to 0.4.4 from 0.4.0

0.3.5
=====

 * #103 - connection.protocol might have been empty on some rare
   occasions.
 * #99 - faye-websocket was leaking sockets in "closed" state
   when dealing with rfc websockets


0.3.4
=====

 * #73 - apparently 'package' is a reserved keyword (use 'pkg' instead)
 * #93 - Coffescript can leak a variable when the same name is used
   in catch statement. Let's always use 'x' as the variable in catch.
 * #76 - decorateConnection could throw an error if remote connection
   was closed before setup was complete
 * #90 - Fix "TypeError: 'addListener'" exception (via @pl).
 * remove 'optionalDependencies' section from package.json,
   'rbytes' was always optional.
 * #91 - Fix rare null exception.


0.3.3
=====

 * sockjs/sockjs-protocol#56, #88 Fix for iOS 6 caching POSTs


0.3.1
=====

 * #58 - websocket transport emitted an array instead of a string
   during onmessage event.
 * Running under node.js 0.7 caused infinite recursion (Stephan Kochen)
 * #59 - restrict characters allowed in callback parameter
 * Updated readme - rbytes package is optional
 * Updated readme WRT deployments on heroku
 * Add minimalistic license block to every source file.


0.3.0
=====

 * Sending JSESSIONID cookie is now *disabled* by default.
 * sockjs/sockjs-protocol#46 - introduce new service
   required for protocol tests "/cookie_needed_echo"
 * Initial work towards better integration with
   "connect" (Stephan Kochen). See discusion:
       https://github.com/senchalabs/connect/pull/506
 * More documentation about the Cookie and Origin headers.
 * #51 - expose "readyState" on connection instance
 * #53 - expose "protocol" on connection instance
 * #52 - Some protocols may not emit 'close' event with IE.
 * sockjs/sockjs-client#49 - Support 'null' origin - aka: allow SockJS
   client to be served from file:// paths.


0.2.1
=====

 * Bumped "faye-websocket" dependency to 0.4. Updated
   code to take advantage of introduced c