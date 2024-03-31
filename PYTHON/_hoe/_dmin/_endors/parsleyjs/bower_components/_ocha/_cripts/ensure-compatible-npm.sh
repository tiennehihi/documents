'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes empty attributes';

/**
 * Remove attributes with empty values.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if 