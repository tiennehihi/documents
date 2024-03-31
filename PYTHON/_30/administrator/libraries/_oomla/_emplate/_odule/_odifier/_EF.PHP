/*!
 * global-prefix <https://github.com/jonschlinkert/global-prefix>
 *
 * Copyright (c) 2015-present Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const ini = require('ini');
let prefix;

const getPrefix = () => {
  if (process.env.PREFIX) return process.env.PREFIX;
  if (prefix) return prefix;

  // Start by checking if the global prefix is set by the user
  let home = os.homedir();

  // os.homedir() returns undefined if $HOME is not set; path.resolve requires strings
  if (home) {
    prefix = tryConfigPath(path.resolve(home, '.npmrc'));
  }

  if (prefix) {
    return prefix;
  }

  // Otherwise find the path of npm
  let npm = tryNpmPath();
  if (npm) {
    // Check the built-in npm config file
    prefix = tryConfigPath(path.resolve(npm, '..', '..', 'npmrc'));

    if (prefix) {
      // Now the global npm config can also be checked.
      prefix = tr