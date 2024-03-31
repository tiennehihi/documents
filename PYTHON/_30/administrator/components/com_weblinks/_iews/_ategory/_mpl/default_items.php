#!/usr/bin/env node

/*
  @license
	Rollup.js v2.79.1
	Thu, 22 Sep 2022 04:55:29 GMT - commit 69ff4181e701a0fe0026d0ba147f31bc86beffa8

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const process$1 = require('process');
const rollup = require('../shared/rollup.js');
const require$$2 = require('util');
const require$$0$1 = require('fs');
const require$$0 = require('path');
const mergeOptions = require('../shared/mergeOptions.js');
const loadConfigFile_js = require('../shared/loadConfigFile.js');
require('perf_hooks');
require('crypto');
require('events');
require('url');
require('tty');

const help = "rollup version __VERSION__\n=====================================\n\nUsage: rollup [options] <entry file>\n\nBasic options:\n\n-c, --config <filename>     Use this config file (if argument is used but value\n                              is unspecified, defaults to rollup.config.js)\n-d, --dir <dirname>         Directory for chunks (if absent, prints to stdout)\n-e, --external <ids>        Comma-separate list of module IDs to exclude\n-f, --format <format>       Type of output (amd, cjs, es, iife, umd, system)\n-g, --globals <pairs>       Comma-separate list of `moduleID:Global` pairs\n-h, --help                  Show this help message\n-i, --input <filename>      Input (alternative to <entry file>)\n-m, --sourcemap             Generate sourcemap (`-m inline` for inline map)\n-n, --name <name>           Name for UMD export\n-o, --file <output>         Single output file (if absent, prints to stdout)\n-p, --plugin <plugin>       Use the plugin specified (may be repeated)\n-v, --version               Show version number\n-w, --watch                 Watch files in bundle and rebuild on changes\n--amd.id <id>               ID for AMD module (default is anonymous)\n--amd.autoId                Generate the AMD ID based off the chunk name\n--amd.basePath <prefix>     Path to prepend to auto generated AMD ID\n--amd.define <name>         Function to use in place of `define`\n--amd.forceJsExtensionForImports Use `.js` extension in AMD imports\n--assetFileNames <pattern>  Name pattern for emitted assets\n--banner <text>             Code to insert at top of bundle (outside wrapper)\n--chunkFileNames <pattern>  Name pattern for emitted secondary chunks\n--compact                   Minify wrapper code\n--context <variable>        Specify top-level `this` value\n--entryFileNames <pattern>  Name pattern for 