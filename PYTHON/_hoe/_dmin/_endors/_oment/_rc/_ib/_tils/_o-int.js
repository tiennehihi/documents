var _cb = require('./_cb.js');
var _getLength = require('./_getLength.js');

// Internal function to generate `_.findIndex` and `_.findLastIndex`.
function createPredicateIndexFinder(dir) {
  return function(array, predicate, context) {
    predicate = _cb(predicate, context);
    