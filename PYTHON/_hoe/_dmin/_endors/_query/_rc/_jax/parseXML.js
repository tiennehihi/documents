let list = require('postcss').list

let flexSpec = require('./flex-spec')
let Declaration = require('../declaration')

class Flex extends Declaration {
  /**
   * Return property name by final spec
   */
  normalize() {
    return 'flex'
  }

  /**
   * Change property name for 2009 spec
   */
  prefixed(prop, prefix) {
    let spec
    ;[spec, prefix] = flexSpec(prefix)
    if (spec === 2009) {
      return prefix + 'box-flex'
    }
    return super.prefixed(prop, prefix)
  