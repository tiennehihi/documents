'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @typedef {{ readonly [type: string]: ReadonlyArray<string> }} VisitorKeys
 */

/**
 * @type {VisitorKeys}
 */
const KEYS = {
    ArrayExpression: [
        "elements"
    ],
    ArrayPattern: [
        "elements"
    ],
    ArrowFunctionExpression: [
        "params",
        "body"
    ],
    AssignmentExpression: [
        "left",
        "right"
    ],
    AssignmentPattern: [
        "left",
        "right"
    ],
    AwaitExpression: [
        "argument"
    ],
    BinaryExpression: [
        "left",
        "right"
    ],
    BlockStatement: [
        "body"
    ],
    BreakStatement: [
        "label"
    ],
    CallExpression: [
        "callee",
        "arguments"
    ],
    CatchClause: [
        "param",
        "body"
    ],
    ChainExpression: [
        "expression"
    ],
    ClassBody: [
        "body"
    ],
    ClassDeclaration: [
        "id",
        "superClass",
        "body"
    ],
    ClassExpression: [
        "id",
        "superClass",
        "body"
    ],
    ConditionalExpression: [
        "test",
        "consequent",
        "alternate"
    ],
    ContinueStatement: [
        "label"
    ],
    DebuggerStatement: [],
    DoWhileStatement: [
        "body",
        "test"
    ],
    EmptyStatement: [],
    ExperimentalRestProperty: [
        "argument"
    ],
    ExperimentalSpreadProperty: [
        "argument"
    ],
    ExportAllDeclaration: [
        "exported",
        "source"
    ],
    ExportDefaultDeclaration: [
        "declaration"
    ],
    ExportNamedDeclaration: [
        "declaration",
        "specifiers",
        "source"
    ],
    ExportSpecifier: [
        "exported",
        "local"
    ],
    ExpressionStatement: [
        "expression"
    ],
    ForInStatement: [
        "left",
        "right",
        "body"
    ],
    ForOfStatement: [
        "left",
        "right",
        "body"
    ],
    ForStatement: [
        "init",
        "test",
        "update",
        "body"
    ],
    FunctionDeclaration: [
        "id",
        "params",
        "body"
    ],
    FunctionExpression: [
        "id",
        "params",
        "body"
    ],
    Identifier: [],
    IfStatement: [
     