var assert = require("assert"),
    sprintfjs = require("../src/sprintf.js"),
    sprintf = sprintfjs.sprintf,
    vsprintf = sprintfjs.vsprintf

describe("sprintfjs", function() {
    var pi = 3.141592653589793

    it("should return formated strings for simple placeholders", function() {
        assert.equal("%", sprintf("%%"))
        assert.equal("10", sprintf("%b", 2))
        assert.equal("A", sprintf("%c", 65))
        assert.equal("2", sprintf("%d", 2))
        assert.equal("2", sprintf("%i", 2))
        assert.equal