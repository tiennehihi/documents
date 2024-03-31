'use strict';

const { visit } = require('../lib/xast.js');
const { inheritableAttrs, pathElems } = require('./_collections.js');

exports.type = 'visitor';
exports.name = 'moveElemsAttrsToGroup';
exports.active = true;
exports.description = 'Move common attributes of group children to the group';

/**
 * Move common attributes of group children to the group
 *
 * @example
 * <g attr1="val1">
 *     <g attr2="val2">
 *         text
 *     </g>
 *     <circle attr2="val2" attr3="val3"/>
 * </g>
 *              ⬇
 * <g attr1="val1" attr2="val2">
 *    