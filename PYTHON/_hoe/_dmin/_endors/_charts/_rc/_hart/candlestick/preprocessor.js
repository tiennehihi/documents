'use strict'

const fs = require('graceful-fs')
const path = require('path')
const copy = require('../copy').copy
const remove = require('../remove').remove
const mkdirp = require('../mkdirs').mkdirp
const pathExists = require('../path-exists').pathExists
const stat = require('../util/stat')

function move (src, dest, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  const overwrite = opts.overwrite || opts.clobber || fal