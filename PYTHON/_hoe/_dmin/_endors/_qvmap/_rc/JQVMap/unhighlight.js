'use strict';

exports.type = 'perItem';

exports.active = false;

exports.params = {
    delim: '__',
    prefixIds: true,
    prefixClassNames: true,
};

exports.description = 'prefix IDs';


var path = require('path'),
    csstree = 