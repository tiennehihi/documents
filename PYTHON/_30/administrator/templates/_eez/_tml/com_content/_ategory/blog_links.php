"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRangeDef(keyword) {
    return () => ({
        keyword,
        type: "number",
        schemaType: "array",
        macro: function ([min, max]) {
            validateRangeSchema(min, max);
            return keyword === "range"
                ? { minimum: min, maximum: max }
                : { exclusiveMinimum: min, exclusiveMaximum: max };
        },
   