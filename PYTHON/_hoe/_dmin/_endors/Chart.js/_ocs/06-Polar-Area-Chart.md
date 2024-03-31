/*! ../iframe */ "./node_modules/sockjs-client/lib/transport/iframe.js"),
  objectUtils = __webpack_require__(/*! ../../utils/object */ "./node_modules/sockjs-client/lib/utils/object.js");
module.exports = function (transport) {
  function IframeWrapTransport(transUrl, baseUrl) {
    IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
  }
  inherits(IframeWrapTransport, IframeTransport);
  IframeWrapTransport.enabled = function (url, info) {
    if (!__webpack_require__.g.document) {
      return false;
    }
    var iframeInfo = objectUtils.extend({}, info);
    iframeInfo.sameOrigin = true;
    return transport.enabled(iframeInfo) && IframeTransport.enabled();
  };
  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
  IframeWrapTransport.needBody = true;
  IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

  IframeWrapTransport.facadeTransport = transport;
  return IframeWrapTransport;
};

/***/ }),

/***/ "./node_modules/sockjs-client/lib/transport/lib/polling.js":
/*!*****************************************************************!*\
  !*** ./node_modules/sockjs-client/lib/transport/lib/polling.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js"),
  EventEmitter = (__webpack_require__(/*! events */ "./node_modules/sockjs-client/lib/event/emitter.js").EventEmitter);
var debug = function debug() {};
if (true) {
  debug = __webpack_require__(/*! debug */ "./node_modules/sockjs-client/node_modules/debug/src/browser.js")('sockjs-client:polling');
}
function Polling(Receiver, receiveUrl, AjaxObject) {
  debug(receiveUrl);
  EventEmitter.call(this);
  this.Receiver = Receiver;
  this.receiveUrl = receiveUrl;
  this.AjaxObject = AjaxObject;
  this._scheduleReceiver();
}
inherits(Polling, EventEmitter);
Polling.prototype._scheduleReceiver = function () {
  debug('_scheduleReceiver');
  var self = this;
  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);
  poll.on('message', function (msg) {
    debug('message', msg);
    self.emit('message', msg);
  });
  poll.once('close', function (code, reason) {
    debug('close', code, reason, self.pollIsClosing);
    self.poll = poll = null;
    if (!self.pollIsClosing) {
      if (reason === 'network') {
        self._scheduleReceiver();
      } else {
        self.emit('close', code || 1006, reason);
        self.removeAllListeners();
      }
    }
  });
};
Polling.prototype.abort = function () {
  debug('abort');
  this.removeAllListeners();
  this.pollIsClosing = true;
  if (this.poll) {
    this.poll.abort();
  }
};
module.exports = Polling;

/***/ }),

/***/ "./node_modules/sockjs-client/lib/transport/lib/sender-receiver.js":
/*!*************************************************************************!*\
  !*** ./node_modules/sockjs-client/lib/transport/lib/sender-receiver.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js"),
  urlUtils = __webpack_require__(/*! ../../utils/url */ "./node_modules/sockjs-client/lib/utils/url.js"),
  BufferedSender = __webpack_require__(/*! ./buffered-sender */ "./node_modules/sockjs-client/lib/transport/lib/buffered-sender.js"),
  Polling = __webpack_require__(/*! ./polling */ "./node_modules/sockjs-client/lib/transport/lib/polling.js");
var debug = function debug() {};
if (true) {
  debug = __webpack_require__(/*! debug */ "./node_modules/sockjs-client/node_modules/debug/src/browser.js")('sockjs-client