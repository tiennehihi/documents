: 22 },
                            end: { line: 1, column: 44 }
                        }
                    },
                    range: [18, 44],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 44 }
                    }
                }],
                kind: 'var',
                range: [14, 44],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 44 }
                }
            }],
            range: [0, 44],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 44 }
            },
            errors: [{
                index: 42,
                lineNumber: 1,
                column: 43,
                message: 'Error: Line 1: Object literal may not have data and accessor property with the same name'
            }]


        },

        '({ set s() { } })': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'ObjectExpression',
                    properties: [{
                        type: 'Property',
                        key: {
                            type: 'Identifier',
                            name: 's',
                            range: [7, 8],
                            loc: {
                                start: { line: 1, column: 7 },
                                end: { line: 1, column: 8 }
                            }
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            defaults: [],
                            body: {
                                type: 'BlockStatement',
                                body: [],
                                range: [11, 14],
                                loc: {
                                    start: { line: 1, column: 11 },
                                    end: { line: 1, column: 14 }
                                }
                            },
                            rest: null,
                            generator: false,
                            expression: false,
                            range: [11, 14],
                            loc: {
                                start: { line: 1, column: 11 },
                                end: { line: 1, column: 14 }
                            }
                        },
                        kind: 'set',
                        range: [3, 14],
                        loc: {
                            start: { line: 1, column: 3 },
                            end: { line: 1, column: 14 }
                        }
                    }],
                    range: [1, 16],
                    loc: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 16 }
                    }
                },
                range: [0, 17],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 17 }
                }
            }],
            range: [0, 17],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 17 }
            },
            errors: [{
                index: 9,
                lineNumber: 1,
                column: 10,
                message: 'Error: Line 1: Unexpected token )'
            }]
        },

        'foo("bar") = baz': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'foo',
                            range: [0, 3],
                            loc: {
                                start: { line: 1, column: 0 },
                                end: { line: 1, column: 3 }
                            }
                        },
                        'arguments': [{
                            type: 'Literal',
                            value: 'bar',
                            raw: '"bar"',
                            range: [4, 9],
                            loc: {
                                start: { line: 1, column: 4 },
                                end: { line: 1, column: 9 }
                            }
                        }],
                        range: [0, 10],
                        loc: {
                            start: { line: 1, column: 0 },
                            end: { line: 1, column: 10 }
                        }
                    },
                    right: {
                        type: 'Identifier',
                        name: 'baz',
                        range: [13, 16],
                        loc: {
                            start: { line: 1, column: 13 },
                            end: { line: 1, column: 16 }
                        }
                    },
                    range: [0, 16],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 16 }
                    }
                },
        