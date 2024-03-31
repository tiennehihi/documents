"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const code_1 = require("../code");
const additionalItems_1 = require("./additionalItems");
const error = {
    message: ({ params: { len } }) => (0, codegen_1.str) `must NOT have more than ${len} items`,
    params: ({ params: { len } }) => (0, codegen_1._) `{limit: ${len}}`,
};
const def = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"]