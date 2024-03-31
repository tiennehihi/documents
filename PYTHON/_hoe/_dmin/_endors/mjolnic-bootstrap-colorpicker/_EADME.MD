"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const equal = require("fast-deep-equal");
const SCALAR_TYPES = ["number", "integer", "string", "boolean", "null"];
function getDef() {
    return {
        keyword: "uniqueItemProperties",
        type: "array",
        schemaType: "array",
        compile(keys, parentSchema) {
            const scalar = getScalarKeys(keys, parentSchema);
            return (data) => {
                if (data.length <= 1)
                    return true;
                for (let k = 0; k < keys.length; k++) {
                    const key = keys[k];
                    if (scalar[k]) {
                        const hash = {};
                        for (const x of data) {
                            if (!x || typeof x != "object")
                                continue;
                            let p = x[key];
                            if (p && typeof p == "object")
                                continue;
                            if (typeof p == "string")
                                p = '"' + p;
                            if (hash[p])
                                return false;
                            hash[p]