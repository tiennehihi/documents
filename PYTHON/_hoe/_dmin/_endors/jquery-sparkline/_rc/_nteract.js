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
const scope_manager_1 = require("@typescript-eslint/scope-manager");
const utils_1 = require("@typescript-eslint/utils");
const util = __importStar(require("../util"));
const explicitReturnTypeUtils_1 = require("../util/explicitReturnTypeUtils");
exports.default = util.createRule({
    name: 'explicit-module-boundary-types',
    meta: {
        type: 'problem',
        docs: {
            description: "Require explicit return and argument types on exported functions' and classes' public class methods",
            recommended: false,
        },
        messages: {
            missingReturnType: 'Missing return type on function.',
            missingArgType: "Argument '{{name}}' should be typed.",
            missingArgTypeUnnamed: '{{type}} argument should be typed.',
            anyTypedArg: "Argument '{{name}}' should be typed with a non-any type.",
            anyTypedArgUnnamed: '{{type}} argument should be typed with a non-any type.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allowArgumentsExplicitlyTypedAsAny: {
                        description: 'Whether to ignore arguments that are explicitly typed as `any`.',
                        type: 'boolean',
                    },
                    allowDirectConstAssertionInArrowFunctions: {
                        description: [
                            'Whether to ignore return type annotations on body-less arrow functions that return an `as const` type assertion.',
                            'You must still type the parameters of the function.',
                        ].join('\n'),
                        type: 'boolean',
                    },
                    allowedNames: {
                        description: 'An array of function/method names that will not have their arguments or return values checked.',
                        items: {
                            type: 'string',
                        },
                        type: 'array',
                    },
                    allowHigherOrderFunctions: {
                        description: [
                            'Whether to ignore return type annotations on functions immediately returning another function expression.',
                            'You must still type the parameters of the function.',
                        ].join('\n'),
                        type: 'boolean',
                    },
                    allowTypedFunctionExpressions: {
                        description: 'Whether to ignore type annotations on the variable of a function expresion.',
                        type: 'boolean',
                    },
                    // DEPRECATED - To be removed in next major
                    shouldTrackReferences: {
                        type: 'boolean',
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    defaultOptions: [
        {
            allowArgumentsExplicitlyTypedAsAny: false,
            allowDirectConstAssertionInArrowFunctions: true,
            allowedNames: [],
            allowHigherOrderFunctions: true,
            allowTypedFunctionExpressions: true,
        },
    ],
    create(context, [options]) {
        const sourceCode = context.getSourceCode();
        // tracks all of the functions we've already checked
        const checkedFunctions = new Set();
        // tracks functions that were found whilst traversing
        const foundFunctions = [];
        // all nodes visited, avoids infinite recursion for cyclic references
        // (such as class member referring to itself)
        const alreadyVisited = new Set();
        /*
        # How the rule works:
    
        As the rule traverses the AST, it immediately checks every single function that it finds is exported.
        "exported" means that it is either directly exported, or that its name is exported.
    
        It also collects a list of every single function it finds on the way, but does not check them.
        After it's finished traversing the AST, it then iterates through the list of found functions, and checks to see if
        any of them are part of a higher-order function
        */
        return {
            ExportDefaultDeclaration(node) {
                checkNode(node.declaration);
            },
            'ExportNamedDeclaration:not([source])'(node) {
                if (node.declaration) {
                    checkNode(node.declaration);
                }
                else {
                    for (const specifier of node.specifiers) {
                        followReference(specifier.local);
                    }
                }
            },
            TSExportAssignment(node) {
                checkNode(node.expression);
            },
            'ArrowFunctionExpression, FunctionDeclaration, FunctionExpression'(node) {
                foundFunctions.push(node);
            },
            'Program:exit'() {
                for (const func of foundFunctions) {
                    if (isExportedHigherOrderFunction(func)) {
                        checkNode(func);
                    }
                }
            },
        };
        function checkParameters(node) {
            function checkParameter(param) {
                function report(namedMessageId, unnamedMessageId) {
                    if (param.type === utils_1.AST_NODE_TYPES.Identifier) {
                        context.report({
                            node: param,
                            messageId: namedMessageId,
                            data: { name: param.name },
                        });
                    }
                    else if (param.type === utils_1.AST_NODE_TYPES.ArrayPattern) {
                        context.report({
                            node: param,
                            messageId: unnamedMessageId,
                            data: { type: 'Array pattern' },
                        });
                    }
                    else if (param.type === utils_1.AST_NODE_TYPES.ObjectPattern) {
                        context.report({
                            node: param,
                            messageId: unnamedMessageId,
                            data: { type: 'Object pattern' },
                        });
                    }
                    else if (param.type === utils_1.AST_NODE_TYPES.RestElement) {
                        if (param.argument.type === utils_1.AST_NODE_TYPES.Identifier) {
                            context.report({
                                node: param,
                                messageId: namedMessageId,
                                data: { name: param.argument.name },
                            });
                        }
                        else {
                            context.report({
                                node: param,
                                messageId: unnamedMessageId,
                                data: { type: 'Rest' },
                            });
                        }
                    }
                }
                switch (param.type) {
                    case utils_1.AST_N