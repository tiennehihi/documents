"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_NAME = void 0;
const create_testing_library_rule_1 = require("../create-testing-library-rule");
const node_utils_1 = require("../node-utils");
exports.RULE_NAME = 'prefer-query-by-disappearance';
exports.default = (0, create_testing_library_rule_1.createTestingLibraryRule)({
    name: exports.RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Suggest using `queryBy*` queries when waiting for disappearance',
            recommendedConfig: {
                dom: 'error',
                angular: 'error',
                react: 'error',
