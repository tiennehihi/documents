'use strict';
/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
const path = require('path');
const { escape } = require('html-escaper');
const { ReportBase } = require('istanbul-lib-report');

class CoberturaReport extends ReportBase {
    constructor(opts) {
        super();

        opts = opts || {};

        this.cw = null;
        this.xml = null;
        this.timestamp = opts.timestamp || Date.now().toString();
        this.projectRoot = opts.projectRoot || process.cwd();
        this.file = opts.file || 'cobertura-coverage.xml';
    }

    onStart(root, context) {
        this.cw = 