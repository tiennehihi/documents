'use strict';

var fs = require('fs');
var homedir = require('../lib/homedir');
var path = require('path');

var test = require('tape');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var mv = require('mv');
var copyDir = require('copy-dir');
var tmp = require('tmp');

var HOME = homedir();

var hnm = path.join(HOME, '.node_modules');
var hnl = path.join(HOME, '.node_libraries');

var resolve = require('../async');

function makeDir(t, dir, cb) {
    mkdirp(dir, function (err) {
        if (err) {
            cb(err);
        } else {
            t.teardown(function cleanup() {
                rimraf.sync(dir);
            });
            cb();
        }
    });
}

function makeTempDir(t, dir, cb) {
    if (fs.existsSync(dir)) {
        var tmpResult = tmp.dirSync();
        t.teardown(tmpResult.removeCallback);
        var backup = path.join(tmpResult.name, path.basename(dir));
        mv(dir, backup, function (err) {
            if (err) {
                cb(err);
            } else {
                t.teardown(function () {
                    mv(backup, dir, cb);
                });
                makeDir(t, dir, cb);
            }
        });
    } else {
        makeDir(t, dir, cb);
    }
}

test('homedir module paths', function (t) {
    t.plan(7);

    makeTempDir(t, hnm, function (err) {
        t.error(err, 'no error with HNM temp dir');
        if (err) {
            return t.end();
        }

        var bazHNMDir = path.join(hnm, 'baz');
        var dotMainDir = path.join(hnm, 'dot_main');
        copyDir.sync(path.join(__dirname, 'resolver/baz'), bazHNMDir);
        copyDir.sync(path.join(__dirname, 'resolver/dot_main'), dotMainDir);

        var bazPkg = { name: 'baz', main: 'quux.js' };
        var dotMainPkg = { main: 'index' };

        var bazHNMmain = path.join(bazHNMDir, 'quux.js');
        t.equal(require.resolve('baz'), bazHNMmain, 'sanity check: requir