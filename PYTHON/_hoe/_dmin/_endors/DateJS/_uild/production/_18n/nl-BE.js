"use strict";
/*--------------------------------------------------------------------------

@sinclair/typebox/conditional

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Structural = exports.StructuralResult = void 0;
const Types = require("../typebox");
const guard_1 = require("../guard");
// --------------------------------------------------------------------------
// StructuralResult
// --------------------------------------------------------------------------
var StructuralResult;
(function (StructuralResult) {
    StructuralResult[StructuralResult["Union"] = 0] = "Union";
    StructuralResult[StructuralResult["True"] = 1] = "True";
    StructuralResult[StructuralResult["False"] = 2] = "False";
})(StructuralResult = exports.StructuralResult || (exports.StructuralResult = {}));
// --------------------------------------------------------------------------
// Structural
// --------------------------------------------------------------------------
/** Performs structural equivalence checks against TypeBox types. */
var Structural;
(function (Structural) {
    const referenceMap = new Map();
    // ------------------------------------------------------------------------
    // Rules
    // ------------------------------------------------------------------------
    function AnyOrUnknownRule(right) {
        // https://github.com/microsoft/TypeScript/issues/40049
        if (right[Types.Kind] === 'Union' && right.anyOf.some((schema) => schema[Types.Kind] === 'Any' || schema[Types.Kind] === 'Unknown'))
            return true;
        if (right[Types.Kind] === 'Unknown')
            return true;
        if (right[Types.Kind] === 'Any')
            return true;
        return false;
    }
    function ObjectRightRule(left, right) {
        // type A = boolean extends {}     ? 1 : 2 // additionalProperties: false
        // type B = boolean extends object ? 1 : 2 // additionalProperties: true
        const additionalProperties = right.additionalProperties;
        const propertyLength = globalThis.Object.keys(right.properties).length;
        return additionalProperties === false && propertyLength === 0;
    }
    function UnionRightRule(left, right) {
        const result = right.anyOf.some((right) => Visit(left, right) !== StructuralResult.False);
        return result ? StructuralResult.True : StructuralResult.False;
    }
    // ------------------------------------------------------------------------
    // Records
    // ------------------------------------------------------------------------
    function RecordPattern(schema) {
        return globalThis.Object.keys(schema.patternProperties)[0];
    }
    function RecordNumberOrStringKey(schema) {
        const pattern = RecordPattern(schema);
        return pattern === '^.*$' || pattern === '^(0|[1-9][0-9]*)$';
    }
    function RecordValue(schema) {
        const pattern = RecordPattern(schema);
        return schema.patternProperties[pattern];
    }
    function RecordKey(schema) {
        const pattern = RecordPattern(schema);
        if (pattern === '^.*$') {
            return Types.Type.String();
        }
        else if (pattern === '^(0|[1-9][0-9]*)$') {
            return Types.Type.Number();
        }
        else {
            const keys = pattern.slice(1, pattern.length - 1).split('|');
            const schemas = keys.map((key) => (isNaN(+key) ? Types.Type.Literal(key) : Types.Type.Literal(parseFloat(key))));
            return Types.Type.Union(schemas);
        }
    }
    function PropertyMap(schema) {
        const comparable = new Map();
        if (guard_1.TypeGuard.TRecord(schema)) {
            const propertyPattern = RecordPattern(schema);
            if (propertyPattern === '^.*$' || propertyPattern === '^(0|[1-9][0-9]*)$')
                throw Error('Cannot extract record properties without property constraints');
            const propertySchema = schema.patternProperties[propertyPattern];
            const propertyKeys = propertyPattern.slice(1, propertyPattern.length - 1).split('|');
            propertyKeys.forEach((propertyKey) => {
                comparable.set(propertyKey, propertySchema);
            });
  