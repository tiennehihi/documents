require__.g.document.getElementsByTagName('head')[0];
  head.insertBefore(script, head.firstChild);
  if (script2) {
    head.insertBefore(script2, head.firstChild);
  }
};
module.exports = JsonpReceiver;

/***/ }),

/***/ "./node_modules/sockjs-client/lib/transport/receiver/xhr.js":
/*!******************************************************************!*\
  !*** ./node_modules/sockjs-client/lib/transport/receiver/xhr.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js"),
  EventEmitter = (__webpack_require__(/*! events