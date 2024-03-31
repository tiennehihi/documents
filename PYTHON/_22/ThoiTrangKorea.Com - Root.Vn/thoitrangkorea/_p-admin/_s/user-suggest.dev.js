"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared = (root) => {
    const sch = {
        nullable: { type: "boolean" },
        metadata: {
            optionalProperties: {
                union: { elements: { ref: "schema" } },
            },
            additionalProperties: true,
        },
    };
    if (root)
        sch.definitions = { values: { ref: "schema" } };
    return sch;
};
const emptyForm = (root) => ({
    optionalProperties: shared(root),
});
const refForm = (root) => ({
    properties: {
        ref: