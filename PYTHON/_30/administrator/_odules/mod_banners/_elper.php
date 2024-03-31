/* eslint-disable strict */

'use strict';

/* This plugin based on https://gist.github.com/Morhaus/333579c2a5b4db644bd5

 Original license:
 --------
 The MIT License (MIT)
 Copyright (c) 2015 Alexandre Kirszenberg
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 --------

 And it's NPM-ified version: https://github.com/dcousineau/force-case-sensitivity-webpack-plugin
 Author Daniel Cousineau indicated MIT license as well but did not include it

 The originals did not properly case-sensitize the entire path, however. This plugin resolves that issue.

 This plugin license, also MIT:
 --------
 The MIT License (MIT)
 Copyright (c) 2016 Michael Pratt
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 --------
 */

const path = require('path');

function CaseSensitivePathsPlugin(options) {
  this.options = options || {};
  this.logger = this.options.logger || console;
  this.pathCache = new Map();
  this.reset();
}

CaseSensitivePathsPlugin.prototype.reset = function() {
  this.pathCache = new Map();
  this.fsOperations = 0;
  this.primed = false;
};

CaseSensitivePathsPlugin.prototype.getFilenamesInDir = function(dir, callback) {
  const that = this;
  const fs = this.compiler.inputFileSystem;
  this.fsOperations += 1;

  if (this.pathCache.has(dir)) {
    callback(this.pathCache.get(dir));
    return;
  }
  if (this.options.debug) {
    this.logger.log('[CaseSensitivePathsPlugin] Reading directory', dir);
  }

  fs.readdir(dir, (err, files) => {
    if (err) {
      if (that.options.debug) {
        this.logger.log(
          '[CaseSensitivePathsPlugin] Failed to read directory',
          dir,
          err,
        );
      }
      callback([]);
      return;
    }

    callback(files.map((f) => (f.normalize ? f.normalize('NFC') : f)));
  });
};

// This function based on code found at http://stackoverflow.com/questions/27367261/check-if-file-exists-case-sensitive
// By Patrick McElhaney (No license indicated - Stack Overflow Answer)
// This version will return with the real name of any incorrectly-cased portion of the path, null otherwise.
CaseSensitiv