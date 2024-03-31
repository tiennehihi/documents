/**
 * class HelpFormatter
 *
 * Formatter for generating usage messages and argument help strings. Only the
 * name of this class is considered a public API. All the methods provided by
 * the class are considered an implementation detail.
 *
 * Do not call in your code, use this class only for inherits your own forvatter
 *
 * ToDo add [additonal formatters][1]
 *
 * [1]:http://docs.python.org/dev/library/argparse.html#formatter-class
 **/
'use strict';

var sprintf = require('sprintf-js').sprintf;

// Constants
var c = require('../const');

var $$ = require('../utils');


/*:nodoc:* internal
 * new Support(parent, heding)
 * - parent (object): parent section
 * - heading (string): header string
 *
 **/
function Section(parent, heading) {
  this._parent = parent;
  this._heading = heading;
  this._items = [];
}

/*:nodoc:* internal
 * Section#addItem(callback) -> Void
 * - callback (array): tupl