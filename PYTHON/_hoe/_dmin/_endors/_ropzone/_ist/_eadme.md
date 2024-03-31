var test = require('tape');
var keys = require('object-keys');
var semver = require('semver');

var resolve = require('../');

var brokenNode = semver.satisfies(process.version, '11.11 - 11.13');

test('core modules', function (t) {
    t.test('isCore()', function (st) {
        st.ok(resolve.isCore('fs'));
        st.ok(resolve.isCore(