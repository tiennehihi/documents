"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importAssertions = importAssertions;
var _acorn = _interopRequireWildcard(require("acorn"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const leftCurlyBrace = "{".charCodeAt(0);
const space = " ".charCodeAt(0);
const keyword = "assert";
const FUNC_STATEMENT = 1,
  FUNC_HANGING_STATEMENT = 2,
  FUNC_NULLABLE_ID = 4;
function importAssertions(Parser) {
  // Use supplied version acorn version if present, to avoid
  // reference mismatches due to different acorn versions. This
  // allows this plugin to be used with Rollup which supplies
  // its own internal version of acorn and thereby sidesteps
  // the packag