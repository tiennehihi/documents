/* jshint quotmark: false */
'use strict';

var FS = require('fs'),
    PATH = require('path'),
    chalk = require('chalk'),
    mkdirp = require('mkdirp'),
    promisify = require('util.promisify'),
    readdir = promisify(FS.readdir),
    readFile = promisify(FS.