"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABSENCE_MATCHERS = exports.PRESENCE_MATCHERS = exports.ALL_RETURNING_NODES = exports.METHODS_RETURNING_NODES = exports.PROPERTIES_RETURNING_NODES = exports.LIBRARY_MODULES = exports.TESTING_FRAMEWORK_SETUP_HOOKS = exports.EVENTS_SIMULATORS = exports.DEBUG_UTILS = exports.ASYNC_UTILS = exports.ALL_QUERIES_COMBINATIONS = exports.ASYNC_QUERIES_COMBINATIONS = exports.SYNC_QUERIES_COMBINATIONS = exports.ALL_QUERIES_METHODS = exports.ALL_QUERIES_VARIANTS = exports.ASYNC_QUERIES_VARIANTS = exports.SYNC_QUERIES_VARIANTS = exports.getDocsUrl = exports.combineQueries = void 0;
__exportStar(require("./file-import"), exports);
__exportStar(require("./types"), exports);
const combineQueries = (variants, methods) => {
    const combinedQueries = [];
    variants.forEach((variant) => {
        const variantPrefix = variant.replace('By', '');
        methods.forEach((method) => {
            combinedQueries.push(`${variantPrefix}${method}`);
        });
    });
    return combinedQueries;
};
exports.combineQueries = combineQueries;
const getDocsUrl = (ruleName) => `https://github.com/testing-library/eslint-plugin-testing-library/tree/main/docs/rules/${ruleName}.md`;
exports.getDocsUrl = getDocsUrl;
const LIBRARY_MODULES = [
    '@testing-library/dom',
    '@testing-library/angular',
    '@testing-library/react',
    '@testing-library/preact',
    '@testing-library/vue',
    '@testing-library/svelte',
    '@marko/testing-library',
];
exports.LIBRARY_MODULES = LIBRARY_MODULES;
const SYNC_QUERIES_VARIANTS = ['getBy', 'getAllBy', 'queryBy', 'queryAllBy'];
exports.SYNC_QUERIES_VARIANTS = SYNC_QUERIES_VARIANTS;
const ASYNC_QUERIES_VARIANTS = ['fin