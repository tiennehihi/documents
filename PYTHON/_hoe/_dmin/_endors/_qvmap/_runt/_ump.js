'use strict';

var directives = require('../doc/directives.js');
var Document = require('../doc/Document.js');
var errors = require('../errors.js');
var identity = require('../nodes/identity.js');
var composeDoc = require('./compose-doc.js');
var resolveEnd = require('./resolve-end.js');

function getErrorPos(src) {
    if (typeof src === 'number')
        return [src, src + 1];
   