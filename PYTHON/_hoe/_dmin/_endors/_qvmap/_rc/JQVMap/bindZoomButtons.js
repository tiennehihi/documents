let Declaration = require('../declaration')
let utils = require('./grid-utils')

class GridArea extends Declaration {
  /**
   * Translate grid-area to separate -ms- prefixed properties
   */
  insert(decl, prefix, prefixes, result) {
 