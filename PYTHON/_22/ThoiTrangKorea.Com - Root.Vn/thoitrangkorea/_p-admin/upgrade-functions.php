"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("ajv/dist/compile/codegen");
const TYPES = ["undefined", "string", "number", "object", "function", "boolean", "symbol"];
function getDef() {
    return {
        keyword: "typeof",
        schemaType: ["string", "array"],
        cod