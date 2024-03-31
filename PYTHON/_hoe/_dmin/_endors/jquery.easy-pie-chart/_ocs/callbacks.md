"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFindByQueryVariant = exports.WAIT_METHODS = exports.RULE_NAME = void 0;
const utils_1 = require("@typescript-eslint/utils");
const create_testing_library_rule_1 = require("../create-testing-library-rule");
const node_utils_1 = require("../node-utils");
exports.RULE_NAME = 'prefer-find-by';
exports.WAIT_METHODS = ['waitFor', 'waitForElement', 'wait'];
function getFindByQueryVariant(queryMethod) {
    return queryMethod.includes('All') ? 'findAllBy' : 'findBy';
}
exports.getFindByQueryVariant = getFindByQueryVariant;
function findRenderDefinitionDeclaration(scope, query) {
    var _a;
    if (!scope)