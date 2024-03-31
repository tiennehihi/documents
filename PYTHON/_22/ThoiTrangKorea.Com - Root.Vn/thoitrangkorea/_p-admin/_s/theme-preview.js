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
        ref: { type: "string" },
    },
    optionalProperties: shared(root),
});
const typeForm = (root) => ({
    properties: {
        type: {
            enum: [
                "boolean",
                "timestamp",
                "string",
                "float32",
                "float64",
                "int8",
                "uint8",
                "int16",
                "uint16",
                "int32",
                "uint32",
            ],
        },
    },
    optionalProperties: shared(root),
});
const enumForm = (root) => ({
    properties: {
        enum: { elements: { type: "string" } },
    },
    optionalProperties: shared(root),
});
const elementsForm = (root) => ({
    properties: {
        elements: { ref: "schema" },
    },
    optionalProperties: shared(root),
});
const propertiesForm = (root)