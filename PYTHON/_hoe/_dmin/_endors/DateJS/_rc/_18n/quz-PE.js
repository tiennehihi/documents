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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const typescript_1 = require("typescript");
const util = __importStar(require("../util"));
exports.default = util.createRule({
    name: 'consistent-type-exports',
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce consistent usage of type exports',
            recommended: false,
            requiresTypeChecking: true,
        },
        messages: {
            typeOverValue: 'All exports in the declaration are only used as types. Use `export type`.',
            singleExportIsType: 'Type export {{exportNames}} is not a value and should be exported using `export type`.',
            multipleExportsAreTypes: 'Type exports {{exportNames}} are not values and should be exported using `export type`.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    fixMixedExportsWithInlineTypeSpecifier: {
                        type: 'boolean',
                    },
                },
                additionalProperties: false,
            },
        ],
        fixable: 'code',
    },
    defaultOptions: [
        {
            fixMixedExportsWithInlineTypeSpecifier: false,
        },
    ],
    create(context, [{ fixMixedExportsWithInlineTypeSpecifier }]) {
        const sourceCode = context.getSourceCode();
        const sourceExportsMap = {};
        const parserServices = util.getParserServices(context);
        return {
            ExportNamedDeclaration(node) {
                var _a;
                // Coerce the source into a string for use as a lookup entry.
                const source = (_a = getSourceFromExport(node)) !== null && _a !== void 0 ? _a : 'undefined';
                const sourceExports = (sourceExportsMap[source] || (sourceExportsMap[source] = {
                    source,
                    reportValueExports: [],
                    typeOnlyNamedExport: null,
                    valueOnlyNamedExport: null,
                }));
                // Cache the first encountered exports for the package. We will need to come
                // back to these later when fixing the problems.
                if (node.exportKind === 'type') {
                    if (sourceExports.typeOnlyNamedExport == null) {
                        // The export is a type export
                        sourceExports.typeOnlyNamedExport = node;
                    }
                }
                else if (sourceExports.valueOnlyNamedExport == null) {
                    // The export is a value export
                    sourceExports.valueOnlyNamedExport = node;
                }
                // Next for the current export, we will separate type/value specifiers.
                const typeBasedSpecifiers = [];
                const inlineTypeSpecifiers = [];
                const valueSpecifiers = [];
                // Note: it is valid to export values as types. We will avoid reporting errors
                // when this is encountered.
                if (node.exportKind !== 'type') {
                    for (const specifier of node.specifiers) {
                        if (specifier.exportKind === 'type') {
                            inlineTypeSpecifiers.push(specifier);
                            continue;
                        }
                        const isTypeBased = isSpecifierTypeBased(parserServices, specifier);
                        if (isTypeBased === true) {
                            typeBasedSpecifiers.push(specifier);
                        }
                        else if (isTypeBased === false) {
                            // When isTypeBased is undefined, we should avoid reporting them.
                            valueSpecifiers.push(specifier);
                        }
                    }
                }
                if ((node.exportKind === 'value' && typeBasedSpecifiers.length) ||
                    (node.exportKind === 'type' && valueSpecifiers.length)) {
                    sourceExports.reportValueExports.push({
                        node,
                        typeBasedSpecifiers,
                        valueSpecifiers,
                        inlineTypeSpecifiers,
                    });
                }
            },
            'Program:exit'() {
                for (const sourceExports of Object.values(sourceExportsMap)) {
                    // If this export has no issues, move on.
                    if (sourceExports.reportValueExports.length === 0) {
                        continue;