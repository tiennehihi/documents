"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configLoader = exports.loadConfig = void 0;
var TsConfigLoader2 = require("./tsconfig-loader");
var path = require("path");
var options_1 = require("./options");
function loadConfig(cwd) {
    if (cwd === void 0) { cwd = options_1.options.cwd; }
    return configLoader({ cwd: cwd });
}
exports.loadConfig = loadConfig;
function configLoader(_a) {
    var cwd = _a.cwd, explicitParams = _a.explicitParams, _b = _a.tsConfigLoader, tsConfigLoader = _b === void 0 ? TsConfigLoader2.tsConfigLoader : _b;
    if (explicitParams) {
        // tslint:disable-next-line:no-shadowed-variable
        var absoluteBaseUrl_1 = path.isAbsolute(explicitParams.baseUrl)
            ? explicitParams.baseUrl
            : path.join(cwd, explic