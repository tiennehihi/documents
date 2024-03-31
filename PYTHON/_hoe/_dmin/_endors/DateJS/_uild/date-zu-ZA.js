 start: { line: 1, column: 15 },
                            end: { line: 1, column: 18 }
                        }
                    },
                    range: [9, 18],
                    loc: {
                        start: { line: 1, column: 9 },
                        end: { line: 1, column: 18 }
                    }
                },
                range: [9, 18],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 18 }
                }
            },
            range: [0, 18],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 18 }
            }
        },

        'with (x) foo = bar;': {
            type: 'WithStatement',
            object: {
                type: 'Identifier',
                name: 'x',
                range: [6, 7],
                loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
                }
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'Identifier',
                        name: 'foo',
                        range: [9, 12],
                        loc: {
                            start: { line: 1, column: 9 },
                            end: { line: 1, column: 12 }
                        }
                    },
                    right: {
                        type: 'Identifier',
                        name: 'bar',
                        range: [15, 18],
                        loc: {
                            start: { line: 1, column: 15 },
                            end: { line: 1, column: 18 }
                        }
                    },
                    range: [9, 18],
                    loc: {
                        start: { line: 1, column: 9 },
                        end: { line: 1, column: 18 }
                    }
                },
                range: [9, 19],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 19 }
                }
            },
            range: [0, 19],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 19 }
            }
        },

        'with (x) { foo = bar }': {
            type: 'WithStatement',
            object: {
                type: 'Identifier',
                name: 'x',
                range: [6, 7],
                loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
                }
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                            type: 'Identifier',
                            name: 'foo',
                            range: [11, 14],
                            loc: {
                                start: { line: 1, column: 11 },
                                end: { line: 1, column: 14 }
                            }
                        },
                        right: {
                            type: 'Identifier',
                            name: 'bar',
                            range: [17, 20],
                            loc: {
                                start: { line: 1, column: 17 },
                                end: { line: 1, column: 20 }
                            }
                        },
                        range: [11, 20],
                        loc: {
                            start: { line: 1, column: 11 },
                            end: { line: 1, column: 20 }
                        }
                    },
                    range: [11, 21],
                    loc: {
                        start: { line: 1, column: 11 },
                        end: { line: 1, column: 21 }
                    }
                }],
                range: [9, 22],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 22 }
                }
            },
            range: [0, 22],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 22 }
            }
        }

    },

    'switch statement': {

        'switch (x) {}': {
            type: 'SwitchStatement',
            discriminant: {
                type: 'Identifier',
                name: 'x',
                range: [8, 9],
                loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 9 }
                }
            },
            cases:[],
            range: [0, 13],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 13 }
            }
        },

        'switch (answer) { case 42: hi(); break; }': {
            type: 'SwitchStatement',
            discriminant: {
                type: 'Identifier',
                name: 'answer',
                range: [8, 14],
                loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 14 }
                }
            },
            cases: [{
                type: 'SwitchCase',
                test: {
                    type: 'Literal',
                    value: 42,
                    raw: '42',
                    range: [23, 25],
                    loc: {
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 25 }
                    }
                },
                consequent: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'hi',
                            range: [27, 29],
                            loc: {
                                start: { line: 1, column: 27 },
                                end: { line: 1, column: 29 }
                            }
                        },
                        'arguments': [],
                        range: [27, 31],
                        loc: {
                            start: { line: 1, column: 27 },
                            end: { line: 1, column: 31 }
                        }
                    },
                    range: [27, 32],
                    loc: {
                        start: { line: 1, column: 27 },
                        end: { line: 1, column: 32 }
                    }
                }, {
                    type: 'BreakStatement',
                    label: null,
                    range: [33, 39],
                    loc: {
                        start: { line: 1, column: 33 },
                        end: { line: 1, column: 39 }
                    }
                }],
                range: [18, 39],
                loc: {
                    start: { line: 1, column: 18 },
                    end: { line: 1, column: 39 }
                }
            }],
            range: [0, 41],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 41 }
            }
        },

        'switch (answer) { case 42: hi(); break; default: break }': {
            type: 'SwitchStatement',
            discriminant: {
                type: 'Identifier',
                name: 'answer',
                range: [8, 14],
                loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 14 }
                }
            },
            cases: [{
                type: 'SwitchCase',
                test: {
                    type: 'Literal',
                    value: 42,
                    raw: '42',
                    range: [23, 25],
                    loc: {
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 25 }
                    }
                },
                consequent: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'hi',
                            range: [27, 29],
                            loc: {
                                start: { line: 1, column: 27 },
                                end: { line: 1, column: 29 }
                            }
                        },
                        'arguments': [],
                        range: [27, 31],
                        loc: {
                            start: { line: 1, column: 27 },
                            end: { line: 1, column: 31 }
                        }
                    },
                    range: [27, 32],
                    loc: {
                        start: { line: 1, column: 27 },
                        end: { line: 1, column: 32 }
                    }
                }, {
                    type: 'BreakStatement',
                    label: null,
                    range: [33, 39],
                    loc: {
                        start: { line: 1, column: 33 },
                        end: { line: 1, column: 39 }
                    }
                }],
                range: [18, 39],
                loc: {
                    start: { line: 1, column: 18 },
                    end: { line: 1, column: 39 }
                }
            }, {
                type: 'SwitchCase',
                test: null,
                consequent: [{
                    type: 'BreakStatement',
                    label: null,
                    range: [49, 55],
                    loc: {
                        start: { line: 1, column: 49 },
                        end: { line: 1, column: 55 }
                    }
                }],
                range: [40, 55],
                loc: {
                    start: { line: 1, column: 40 },
                    end: { line: 1, column: 55 }
                }
            }],
            range: [0, 56],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 56 }
            }
        }

    },

    'Labelled Statements': {

        'start: for (;;) break start': {
            type: 'LabeledStatement',
            label: {
                type: 'Identifier',
                name: 'start',
                range: [0, 5],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 5 }
                }
            },
            body: {
                type: 'ForStatement',
                init: null,
                test: null,
                update: null,
                body: {
                    type: 'BreakStatement',
                    label: {
                        type: 'Identifier',
                        name: 'start',
                        range: [22, 27],
                        loc: {
                            start: { line: 1, column: 22 },
                            end: { line: 1, column: 27 }
                        }
                    },
                    range: [16, 27],
                    loc: {
                        start: { line: 1, column: 16 },
                        end: { line: 1, column: 27 }
                    }
                },
                range: [7, 27],
                loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 27 }
                }
            },
            range: [0, 27],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 27 }
            }
        },

        'start: while (true) break start': {
            type: 'LabeledStatement',
            label: {
                type: 'Identifier',
                name: 'start',
                range: [0, 5],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 5 }
                }
            },
            body: {
                type: 'WhileStatement',
                test: {
                    type: 'Literal',
                    value: true,
                    raw: 'true',
                    range: [14, 18],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 18 }
                    }
                },
                body: {
                    type: 'BreakStatement',
                    label: {
                        type: 'Identifier',
                        name: 'start',
                        range: [26, 31],
                        loc: {
                            start: { line: 1, column: 26 },
                            end: { line: 1, column: 31 }
                        }
                    },
                    range: [20, 31],
                    loc: {
                        start: { line: 1, column: 20 },
                        end: { line: 1, column: 31 }
                    }
                },
                range: [7, 31],
                loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 31 }
                }
            },
            range: [0, 31],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 31 }
            }
        },

        '__proto__: test': {
            type: 'LabeledStatement',
            label: {
                type: 'Identifier',
                name: '__proto__',
                range: [0, 9],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 9 }
                }
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'test',
                    range: [11, 15],
                    loc: {
                        start: { line: 1, column: 11 },
                        end: { line: 1, column: 15 }
                    }
                },
                range: [11, 15],
                loc: {
                    start: { line: 1, column: 11 },
                    end: { line: 1, column: 15 }
                }
            },
            range: [0, 15],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 15 }
            }
        }

    },

    'throw statement': {

        'throw x;': {
            type: 'ThrowStatement',
            argument: {
                type: 'Identifier',
                name: 'x',
                range: [6, 7],
                loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
                }
            },
            range: [0, 8],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 8 }
            }
        },

        'throw x * y': {
            type: 'ThrowStatement',
            argument: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [6, 7],
                    loc: {
                        start: { line: 1, column: 6 },
                        end: { line: 1, column: 7 }
                    }
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [10, 11],
                    loc: {
                        start: { line: 1, column: 10 },
                        end: { line: 1, column: 11 }
                    }
                },
                range: [6, 11],
                loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 11 }
                }
            },
            range: [0, 11],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 11 }
            }
        },

        'throw { message: "Error" }': {
            type: 'ThrowStatement',
            argument: {
                type: 'ObjectExpression',
                properties: [{
                    type: 'Property',
                    key: {
                        type: 'Identifier',
                        name: 'message',
                        range: [8, 15],
                        loc: {
                            start: { line: 1, column: 8 },
                            end: { line: 1, column: 15 }
                        }
                    },
                    value: {
                        type: 'Literal',
                        value: 'Error',
                        raw: '"Error"',
                        range: [17, 24],
                        loc: {
                            start: { line: 1, column: 17 },
                            end: { line: 1, column: 24 }
                        }
                    },
                    kind: 'init',
                    range: [8, 24],
                    loc: {
                        start: { line: 1, column: 8 },
                        end: { line: 1, column: 24 }
                    }
                }],
                range: [6, 26],
                loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 26 }
                }
            },
            range: [0, 26],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 26 }
            }
        }

    },

    'try statement': {

        'try { } catch (e) { }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: [],
                range: [4, 7],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 7 }
                }
            },
            guardedHandlers: [],
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'e',
                    range: [15, 16],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 16 }
                    }
                },
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [18, 21],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 21 }
                    }
                },
                range: [8, 21],
                loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 21 }
                }
            }],
            finalizer: null,
            range: [0, 21],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 21 }
            }
        },

        'try { } catch (eval) { }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: [],
                range: [4, 7],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 7 }
                }
            },
            guardedHandlers: [],
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'eval',
                    range: [15, 19],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 19 }
                    }
                },
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [21, 24],
                    loc: {
                        start: { line: 1, column: 21 },
                        end: { line: 1, column: 24 }
                    }
                },
                range: [8, 24],
                loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 24 }
                }
            }],
            finalizer: null,
            range: [0, 24],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 24 }
            }
        },

        'try { } catch (arguments) { }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: [],
                range: [4, 7],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 7 }
                }
            },
            guardedHandlers: [],
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'arguments',
                    range: [15, 24],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 24 }
                    }
                },
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [26, 29],
                    loc: {
                        start: { line: 1, column: 26 },
                        end: { line: 1, column: 29 }
                    }
                },
                range: [8, 29],
                loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 29 }
                }
            }],
            finalizer: null,
            range: [0, 29],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 29 }
            }
        },

        'try { } catch (e) { say(e) }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: [],
                range: [4, 7],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 7 }
                }
            },
            guardedHandlers: [],
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'e',
                    range: [15, 16],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 16 }
                    }
                },
                body: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'say',
                                range: [20, 23],
                                loc: {
                                    start: { line: 1, column: 20 },
                                    end: { line: 1, column: 23 }
                                }
                            },
                            'arguments': [{
                                type: 'Identifier',
                                name: 'e',
                                range: [24, 25],
                                loc: {
                                    start: { line: 1, column: 24 },
                                    end: { line: 1, column: 25 }
                                }
                            }],
                            range: [20, 26],
                            loc: {
                                start: { line: 1, column: 20 },
                                end: { line: 1, column: 26 }
                            }
                        },
                        range: [20, 27],
                        loc: {
                            start: { line: 1, column: 20 },
                            end: { line: 1, column: 27 }
                        }
                    }],
                    range: [18, 28],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 28 }
                    }
                },
                range: [8, 28],
                loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 28 }
                }
            }],
            finalizer: null,
            range: [0, 28],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 28 }
            }
        },

        'try { } finally { cleanup(stuff) }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: [],
                range: [4, 7],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 7 }
                }
            },
            guardedHandlers: [],
            handlers: [],
            finalizer: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'cleanup',
                            range: [18, 25],
                            loc: {
                                start: { line: 1, column: 18 },
                                end: { line: 1, column: 25 }
                            }
                        },
                        'arguments': [{
                            type: 'Identifier',
                            name: 'stuff',
                            range: [26, 31],
                            loc: {
                                start: { line: 1, column: 26 },
                                end: { line: 1, column: 31 }
                            }
                        }],
                        range: [18, 32],
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 32 }
                        }
                    },
                    range: [18, 33],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 33 }
                    }
                }],
                range: [16, 34],
                loc: {
                    start: { line: 1, column: 16 },
                    end: { line: 1, column: 34 }
                }
            },
            range: [0, 34],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 34 }
            }
        },

        'try { doThat(); } catch (e) { say(e) }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'doThat',
                            range: [6, 12],
                            loc: {
                                start: { line: 1, column: 6 },
                                end: { line: 1, column: 12 }
                            }
                        },
                        'arguments': [],
                        range: [6, 14],
                        loc: {
                            start: { line: 1, column: 6 },
                            end: { line: 1, column: 14 }
                        }
                    },
                    range: [6, 15],
                    loc: {
                        start: { line: 1, column: 6 },
                        end: { line: 1, column: 15 }
                    }
                }],
                range: [4, 17],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 17 }
                }
            },
            guardedHandlers: [],
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'e',
                    range: [25, 26],
                    loc: {
                        start: { line: 1, column: 25 },
                        end: { line: 1, column: 26 }
                    }
                },
                body: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'say',
                                range: [30, 33],
                                loc: {
                                    start: { line: 1, column: 30 },
                                    end: { line: 1, column: 33 }
                                }
                            },
                            'arguments': [{
                                type: 'Identifier',
                                name: 'e',
                                range: [34, 35],
                                loc: {
                                    start: { line: 1, column: 34 },
                                    end: { line: 1, column: 35 }
                                }
                            }],
                            range: [30, 36],
                            loc: {
                                start: { line: 1, column: 30 },
                                end: { line: 1, column: 36 }
                            }
                        },
                        range: [30, 37],
                        loc: {
                            start: { line: 1, column: 30 },
                            end: { line: 1, column: 37 }
                        }
                    }],
                    range: [28, 38],
                    loc: {
                        start: { line: 1, column: 28 },
                        end: { line: 1, column: 38 }
                    }
                },
                range: [18, 38],
                loc: {
                    start: { line: 1, column: 18 },
                    end: { line: 1, column: 38 }
                }
            }],
            finalizer: null,
            range: [0, 38],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 38 }
            }
        },

        'try { doThat(); } catch (e) { say(e) } finally { cleanup(stuff) }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'doThat',
                            range: [6, 12],
                            loc: {
                                start: { line: 1, column: 6 },
                                end: { line: 1, column: 12 }
                            }
                        },
                        'arguments': [],
                        range: [6, 14],
                        loc: {
                            start: { line: 1, column: 6 },
                            end: { line: 1, column: 14 }
                        }
                    },
                    range: [6, 15],
                    loc: {
                        start: { line: 1, column: 6 },
                        end: { line: 1, column: 15 }
                    }
                }],
                range: [4, 17],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 17 }
                }
            },
            guardedHandlers: [],
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'e',
                    range: [25, 26],
                    loc: {
                        start: { line: 1, column: 25 },
                        end: { line: 1, column: 26 }
                    }
                },
                body: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'say',
                                range: [30, 33],
                                loc: {
                                    start: { line: 1, column: 30 },
                                    end: { line: 1, column: 33 }
                                }
                            },
                            'arguments': [{
                                type: 'Identifier',
                                name: 'e',
                                range: [34, 35],
                                loc: {
                                    start: { line: 1, column: 34 },
                                    end: { line: 1, column: 35 }
                                }
                            }],
                            range: [30, 36],
                            loc: {
                                start: { line: 1, column: 30 },
                                end: { line: 1, column: 36 }
                            }
                        },
                        range: [30, 37],
                        loc: {
                            start: { line: 1, column: 30 },
                            end: { line: 1, column: 37 }
                        }
                    }],
                    range: [28, 38],
                    loc: {
                        start: { line: 1, column: 28 },
                        end: { line: 1, column: 38 }
                    }
                },
                range: [18, 38],
                loc: {
                    start: { line: 1, column: 18 },
                    end: { line: 1, column: 38 }
                }
            }],
            finalizer: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'cleanup',
                            range: [49, 56],
                            loc: {
                                start: { line: 1, column: 49 },
                                end: { line: 1, column: 56 }
                            }
                        },
                        'arguments': [{
                            type: 'Identifier',
                            name: 'stuff',
                            range: [57, 62],
                            loc: {
                                start: { line: 1, column: 57 },
                                end: { line: 1, column: 62 }
                            }
                        }],
                        range: [49, 63],
                        loc: {
                            start: { line: 1, column: 49 },
                            end: { line: 1, column: 63 }
                        }
                    },
                    range: [49, 64],
                    loc: {
                        start: { line: 1, column: 49 },
                        end: { line: 1, column: 64 }
                    }
                }],
                range: [47, 65],
                loc: {
                    start: { line: 1, column: 47 },
                    end: { line: 1, column: 65 }
                }
            },
            range: [0, 65],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 65 }
            }
        }

    },

    'debugger statement': {

        'debugger;': {
            type: 'DebuggerStatement',
            range: [0, 9],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 9 }
            }
        }

    },

    'Function Definition': {

        'function hello() { sayHi(); }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'hello',
                range: [9, 14],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 14 }
                }
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'sayHi',
                            range: [19, 24],
                            loc: {
                                start: { line: 1, column: 19 },
                                end: { line: 1, column: 24 }
                            }
                        },
                        'arguments': [],
                        range: [19, 26],
                        loc: {
                            start: { line: 1, column: 19 },
                            end: { line: 1, column: 26 }
                        }
                    },
                    range: [19, 27],
                    loc: {
                        start: { line: 1, column: 19 },
                        end: { line: 1, column: 27 }
                    }
                }],
                range: [17, 29],
                loc: {
                    start: { line: 1, column: 17 },
                    end: { line: 1, column: 29 }
                }
            },
            rest: null,
            generator: false,
            expression: false,
            range: [0, 29],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 29 }
            }
        },

        'function eval() { }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'eval',
                range: [9, 13],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 13 }
                }
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [],
                range: [16, 19],
                loc: {
                    start: { line: 1, column: 16 },
                    end: { line: 1, column: 19 }
                }
            },
            rest: null,
            generator: false,
            expression: false,
            range: [0, 19],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 19 }
            }
        },

        'function arguments() { }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'arguments',
                range: [9, 18],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 18 }
                }
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [],
                range: [21, 24],
                loc: {
                    start: { line: 1, column: 21 },
                    end: { line: 1, column: 24 }
                }
            },
            rest: null,
            generator: false,
            expression: false,
            range: [0, 24],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 24 }
            }
        },

        'function test(t, t) { }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'test',
                range: [9, 13],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 13 }
                }
            },
            params: [{
                type: 'Identifier',
                name: 't',
                range: [14, 15],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 15 }
                }
            }, {
                type: 'Identifier',
                name: 't',
                range: [17, 18],
                loc: {
                    start: { line: 1, column: 17 },
                    end: { line: 1, column: 18 }
                }
            }],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [],
                range: [20, 23],
                loc: {
                    start: { line: 1, column: 20 },
                    end: { line: 1, column: 23 }
                }
            },
            rest: null,
            generator: false,
            expression: false,
            range: [0, 23],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 23 }
            }
        },

        '(function test(t, t) { })': {
            type: 'ExpressionStatement',
            expression: {
                type: 'FunctionExpression',
                id: {
                    type: 'Identifier',
                    name: 'test',
                    range: [10, 14],
                    loc: {
                        start: { line: 1, column: 10 },
                        end: { line: 1, column: 14 }
                    }
                },
                params: [{
                    type: 'Identifier',
                    name: 't',
                    range: [15, 16],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 16 }
                    }
                }, {
                    type: 'Identifier',
                    name: 't',
                    range: [18, 19],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 19 }
                    }
                }],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [21, 24],
                    loc: {
                        start: { line: 1, column: 21 },
                        end: { line: 1, column: 24 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [1, 24],
                loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 1, column: 24 }
                }
            },
            range: [0, 25],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 25 }
            }
        },

        'function eval() { function inner() { "use strict" } }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'eval',
                range: [9, 13],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 13 }
                }
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'FunctionDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'inner',
                        range: [27, 32],
                        loc: {
                            start: { line: 1, column: 27 },
                            end: { line: 1, column: 32 }
                        }
                    },
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [{
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'Literal',
                                value: 'use strict',
                                raw: '\"use strict\"',
                                range: [37, 49],
                                loc: {
                                    start: { line: 1, column: 37 },
                                    end: { line: 1, column: 49 }
                                }
                            },
                            range: [37, 50],
                            loc: {
                                start: { line: 1, column: 37 },
                                end: { line: 1, column: 50 }
                            }
                        }],
                        range: [35, 51],
                        loc: {
                            start: { line: 1, column: 35 },
                            end: { line: 1, column: 51 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [18, 51],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 51 }
                    }
                }],
                range: [16, 53],
                loc: {
                    start: { line: 1, column: 16 },
                    end: { line: 1, column: 53 }
                }
            },
            rest: null,
            generator: false,
            expression: false,
            range: [0, 53],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 53 }
            }
        },

        'function hello(a) { sayHi(); }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'hello',
                range: [9, 14],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 14 }
                }
            },
            params: [{
                type: 'Identifier',
                name: 'a',
                range: [15, 16],
                loc: {
                    start: { line: 1, column: 15 },
                    end: { line: 1, column: 16 }
                }
            }],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'sayHi',
                            range: [20, 25],
                            loc: {
                                start: { line: 1, column: 20 },
                                end: { line: 1, column: 25 }
                            }
                        },
                        'arguments': [],
                        range: [20, 27],
                        loc: {
                            start: { line: 1, column: 20 },
                            end: { line: 1, column: 27 }
                        }
                    },
                    range: [20, 28],
                    loc: {
                        start: { line: 1, column: 20 },
                        end: { line: 1, column: 28 }
                    }
                }],
                range: [18, 30],
                loc: {
                    start: { line: 1, column: 18 },
                    end: { line: 1, column: 30 }
                }
            },
            rest: null,
            generator: false,
            expression: false,
            range: [0, 30],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 30 }
            }
        },

        'function hello(a, b) { sayHi(); }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'hello',
                range: [9, 14],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 14 }
                }
            },
            params: [{
                type: 'Identifier',
                name: 'a',
                range: [15, 16],
                loc: {
                    start: { line: 1, column: 15 },
                    end: { line: 1, column: 16 }
                }
            }, {
                type: 'Identifier',
                name: 'b',
                range: [18, 19],
                loc: {
                    start: { line: 1, column: 18 },
                    end: { line: 1, column: 19 }
                }
            }],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'sayHi',
                            range: [23, 28],
                            loc: {
                                start: { line: 1, column: 23 },
                                end: { line: 1, column: 28 }
                            }
                        },
                        'arguments': [],
                        range: [23, 30],
                        loc: {
                            start: { line: 1, column: 23 },
                            end: { line: 1, column: 30 }
                        }
                    },
                    range: [23, 31],
                    loc: {
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 31 }
                    }
                }],
                range: [21, 33],
                loc: {
                    start: { line: 1, column: 21 },
                    end: { line: 1, column: 33 }
                }
            },
            rest: null,
            generator: false,
            expression: false,
            range: [0, 33],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 33 }
            }
        },

        'var hi = function() { sayHi() };': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'hi',
                    range: [4, 6],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 6 }
                    }
                },
                init: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [{
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'sayHi',
                                    range: [22, 27],
                                    loc: {
                                        start: { line: 1, column: 22 },
                                        end: { line: 1, column: 27 }
                                    }
                                },
                                'arguments': [],
                                range: [22, 29],
                                loc: {
                                    start: { line: 1, column: 22 },
                                    end: { line: 1, column: 29 }
                                }
                            },
                            range: [22, 30],
                            loc: {
                                start: { line: 1, column: 22 },
                                end: { line: 1, column: 30 }
                            }
                        }],
                        range: [20, 31],
                        loc: {
                            start: { line: 1, column: 20 },
                            end: { line: 1, column: 31 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [9, 31],
                    loc: {
                        start: { line: 1, column: 9 },
                        end: { line: 1, column: 31 }
                    }
                },
                range: [4, 31],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 31 }
                }
            }],
            kind: 'var',
            range: [0, 32],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 32 }
            }
        },

        'var hi = function eval() { };': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'hi',
                    range: [4, 6],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 6 }
                    }
                },
                init: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'eval',
                        range: [18, 22],
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 22 }
                        }
                    },
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [25, 28],
                        loc: {
                            start: { line: 1, column: 25 },
                            end: { line: 1, column: 28 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [9, 28],
                    loc: {
                        start: { line: 1, column: 9 },
                        end: { line: 1, column: 28 }
                    }
                },
                range: [4, 28],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 28 }
                }
            }],
            kind: 'var',
            range: [0, 29],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 29 }
            }
        },

        'var hi = function arguments() { };': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'hi',
                    range: [4, 6],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 6 }
                    }
                },
                init: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'arguments',
                        range: [18, 27],
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 27 }
                        }
                    },
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [30, 33],
                        loc: {
                            start: { line: 1, column: 30 },
                            end: { line: 1, column: 33 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [9, 33],
                    loc: {
                        start: { line: 1, column: 9 },
                        end: { line: 1, column: 33 }
                    }
                },
                range: [4, 33],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 33 }
                }
            }],
            kind: 'var',
            range: [0, 34],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 34 }
            }
        },

        'var hello = function hi() { sayHi() };': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'hello',
                    range: [4, 9],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 9 }
                    }
                },
                init: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'hi',
                        range: [21, 23],
                        loc: {
                            start: { line: 1, column: 21 },
                            end: { line: 1, column: 23 }
                        }
                    },
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [{
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'sayHi',
                                    range: [28, 33],
                                    loc: {
                                        start: { line: 1, column: 28 },
                                        end: { line: 1, column: 33 }
                                    }
                                },
                                'arguments': [],
                                range: [28, 35],
                                loc: {
                                    start: { line: 1, column: 28 },
                                    end: { line: 1, column: 35 }
                                }
                            },
                            range: [28, 36],
                            loc: {
                                start: { line: 1, column: 28 },
                                end: { line: 1, column: 36 }
                            }
                        }],
                        range: [26, 37],
                        loc: {
                            start: { line: 1, column: 26 },
                            end: { line: 1, column: 37 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [12, 37],
                    loc: {
                        start: { line: 1, column: 12 },
                        end: { line: 1, column: 37 }
                    }
                },
                range: [4, 37],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 37 }
                }
            }],
            kind: 'var',
            range: [0, 38],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 38 }
            }
        },

        '(function(){})': {
            type: 'ExpressionStatement',
            expression: {
                type: 'FunctionExpression',
                id: null,
                params: [],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [11, 13],
                    loc: {
                        start: { line: 1, column: 11 },
                        end: { line: 1, column: 13 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [1, 13],
                loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 1, column: 13 }
                }
            },
            range: [0, 14],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 14 }
            }
        },

        'function universe(__proto__) { }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'universe',
                range: [9, 17],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 17 }
                }
            },
            params: [{
                type: 'Identifier',
                name: '__proto__',
                range: [18, 27],
                loc: {
                    start: { line: 1, column: 18 },
                    end: { line: 1, column: 27 }
                }
            }],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [],
                range: [29, 32],
                loc: {
                    start: { line: 1, column: 29 },
                    end: { line: 1, column: 32 }
                }
            },
            rest: null,
            generator: false,
            expression: false,
            range: [0, 32],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 32 }
            }
        },

        'function test() { "use strict" + 42; }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'test',
                range: [9, 13],
                loc: {
                    start: { line: 1, column: 9 },
                    end: { line: 1, column: 13 }
                }
            },
            params: [],
            defaults: [],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: {
                            type: 'Literal',
                            value: 'use strict',
                            raw: '"use strict"',
                            range: [18, 30],
                            loc: {
                                start: { line: 1, column: 18 },
                                end: { line: 1, column: 30 }
                            }
                        },
                        right: {
                            type: 'Literal',
                            value: 42,
                            raw: '42',
                            range: [33, 35],
                            loc: {
                                start: { line: 1, column: 33 },
                                end: { line: 1, column: 35 }
                            }
                        },
                        range: [18, 35],
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 35 }
                        }
                    },
                    range: [18, 36],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 36 }
                    }
                }],
                range: [16, 38],
                loc: {
                    start: { line: 1, column: 16 },
                    end: { line: 1, column: 38 }
                }
            },
            rest: null,
            generator: false,
            expression: false,
            range: [0, 38],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 38 }
            }
        }

    },

    'Automatic semicolon insertion': {

        '{ x\n++y }': {
            type: 'BlockStatement',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'x',
                    range: [2, 3],
                    loc: {
                        start: { line: 1, column: 2 },
                        end: { line: 1, column: 3 }
                    }
                },
                range: [2, 4],
                loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 2, column: 0 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    argument: {
                        type: 'Identifier',
                        name: 'y',
                        range: [6, 7],
                        loc: {
                            start: { line: 2, column: 2 },
                            end: { line: 2, column: 3 }
                        }
                    },
                    prefix: true,
                    range: [4, 7],
                    loc: {
                        start: { line: 2, column: 0 },
                        end: { line: 2, column: 3 }
                    }
                },
                range: [4, 8],
                loc: {
                    start: { line: 2, column: 0 },
                    end: { line: 2, column: 4 }
                }
            }],
            range: [0, 9],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 5 }
            }
        },

        '{ x\n--y }': {
            type: 'BlockStatement',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'x',
                    range: [2, 3],
                    loc: {
                        start: { line: 1, column: 2 },
                        end: { line: 1, column: 3 }
                    }
                },
                range: [2, 4],
                loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 2, column: 0 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UpdateExpression',
                    operator: '--',
                    argument: {
                        type: 'Identifier',
                        name: 'y',
                        range: [6, 7],
                        loc: {
                            start: { line: 2, column: 2 },
                            end: { line: 2, column: 3 }
                        }
                    },
                    prefix: true,
                    range: [4, 7],
                    loc: {
                        start: { line: 2, column: 0 },
                        end: { line: 2, column: 3 }
                    }
                },
                range: [4, 8],
                loc: {
                    start: { line: 2, column: 0 },
                    end: { line: 2, column: 4 }
                }
            }],
            range: [0, 9],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 5 }
            }
        },

        'var x /* comment */;': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'x',
                    range: [4, 5],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 5 }
                    }
                },
                init: null,
                range: [4, 5],
                loc: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
                }
            }],
            kind: 'var',
            range: [0, 20],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 20 }
            }
        },

        '{ var x = 14, y = 3\nz; }': {
            type: 'BlockStatement',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x',
                        range: [6, 7],
                        loc: {
                            start: { line: 1, column: 6 },
                            end: { line: 1, column: 7 }
                        }
                    },
                    init: {
                        type: 'Literal',
                        value: 14,
                        raw: '14',
                        range: [10, 12],
                        loc: {
                            start: { line: 1, column: 10 },
                            end: { line: 1, column: 12 }
                        }
                    },
                    range: [6, 12],
                    loc: {
                        start: { line: 1, column: 6 },
                        end: { line: 1, column: 12 }
                    }
                }, {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'y',
                        range: [14, 15],
                        loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 15 }
                        }
                    },
                    init: {
                        type: 'Literal',
                        value: 3,
                        raw: '3',
                        range: [18, 19],
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 19 }
                        }
                    },
                    range: [14, 19],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 19 }
                    }
                }],
                kind: 'var',
                range: [2, 20],
                loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 2, column: 0 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'z',
                    range: [20, 21],
                    loc: {
                        start: { line: 2, column: 0 },
                        end: { line: 2, column: 1 }
                    }
                },
                range: [20, 22],
                loc: {
                    start: { line: 2, column: 0 },
                    end: { line: 2, column: 2 }
                }
            }],
            range: [0, 24],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 4 }
            }
        },

        'while (true) { continue\nthere; }': {
            type: 'WhileStatement',
            test: {
                type: 'Literal',
                value: true,
                raw: 'true',
                range: [7, 11],
                loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 11 }
                }
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ContinueStatement',
                    label: null,
                    range: [15, 23],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 23 }
                    }
                }, {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Identifier',
                        name: 'there',
                        range: [24, 29],
                        loc: {
                            start: { line: 2, column: 0 },
                            end: { line: 2, column: 5 }
                        }
                    },
                    range: [24, 30],
                    loc: {
                        start: { line: 2, column: 0 },
                        end: { line: 2, column: 6 }
                    }
                }],
                range: [13, 32],
                loc: {
                    start: { line: 1, column: 13 },
                    end: { line: 2, column: 8 }
                }
            },
            range: [0, 32],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 8 }
            }
        },

        'while (true) { continue // Comment\nthere; }': {
            type: 'WhileStatement',
            test: {
                type: 'Literal',
                value: true,
                raw: 'true',
                range: [7, 11],
                loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 11 }
                }
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ContinueStatement',
                    label: null,
                    range: [15, 23],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 23 }
                    }
                }, {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Identifier',
                        name: 'there',
                        range: [35, 40],
                        loc: {
                            start: { line: 2, column: 0 },
                            end: { line: 2, column: 5 }
                        }
                    },
                    range: [35, 41],
                    loc: {
                        start: { line: 2, column: 0 },
                        end: { line: 2, column: 6 }
                    }
                }],
                range: [13, 43],
                loc: {
                    start: { line: 1, column: 13 },
                    end: { line: 2, column: 8 }
                }
            },
            range: [0, 43],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 8 }
            }
        },

        'while (true) { continue /* Multiline\nComment */there; }': {
            type: 'WhileStatement',
            test: {
                type: 'Literal',
                value: true,
                raw: 'true',
                range: [7, 11],
                loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 11 }
                }
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ContinueStatement',
                    label: null,
                    range: [15, 23],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 23 }
                    }
                }, {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Identifier',
                        name: 'there',
                        range: [47, 52],
                        loc: {
                            start: { line: 2, column: 10 },
                            end: { line: 2, column: 15 }
                        }
                    },
                    range: [47, 53],
                    loc: {
                        start: { line: 2, column: 10 },
                        end: { line: 2, column: 16 }
                    }
                }],
                range: [13, 55],
                loc: {
                    start: { line: 1, column: 13 },
                    end: { line: 2, column: 18 }
                }
            },
            range: [0, 55],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 18 }
            }
        },

        'while (true) { break\nthere; }': {
            type: 'WhileStatement',
            test: {
                type: 'Literal',
                value: true,
                raw: 'true',
                range: [7, 11],
                loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 11 }
                }
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'BreakStatement',
                    label: null,
                    range: [15, 20],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 20 }
                    }
                }, {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Identifier',
                        name: 'there',
                        range: [21, 26],
                        loc: {
                            start: { line: 2, column: 0 },
                            end: { line: 2, column: 5 }
                        }
                    },
                    range: [21, 27],
                    loc: {
                        start: { line: 2, column: 0 },
                        end: { line: 2, column: 6 }
                    }
                }],
                range: [13, 29],
                loc: {
                    start: { line: 1, column: 13 },
                    end: { line: 2, column: 8 }
                }
            },
            range: [0, 29],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 8 }
            }
        },

        'while (true) { break // Comment\nthere; }': {
            type: 'WhileStatement',
            test: {
                type: 'Literal',
                value: true,
                raw: 'true',
                range: [7, 11],
                loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 11 }
                }
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'BreakStatement',
                    label: null,
                    range: [15, 20],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 20 }
                    }
                }, {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Identifier',
                        name: 'there',
                        range: [32, 37],
                        loc: {
                            start: { line: 2, column: 0 },
                            end: { line: 2, column: 5 }
                        }
                    },
                    range: [32, 38],
                    loc: {
                        start: { line: 2, column: 0 },
                        end: { line: 2, column: 6 }
                    }
                }],
                range: [13, 40],
                loc: {
                    start: { line: 1, column: 13 },
                    end: { line: 2, column: 8 }
                }
            },
            range: [0, 40],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 8 }
            }
        },

        'while (true) { break /* Multiline\nComment */there; }': {
            type: 'WhileStatement',
            test: {
                type: 'Literal',
                value: true,
                raw: 'true',
                range: [7, 11],
                loc: {
                    start: { line: 1, column: 7 },
                    end: { line: 1, column: 11 }
                }
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'BreakStatement',
                    label: null,
                    range: [15, 20],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 20 }
                    }
                }, {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Identifier',
                        name: 'there',
                        range: [44, 49],
                        loc: {
                            start: { line: 2, column: 10 },
                            end: { line: 2, column: 15 }
                        }
                    },
                    range: [44, 50],
                    loc: {
                        start: { line: 2, column: 10 },
                        end: { line: 2, column: 16 }
                    }
                }],
                range: [13, 52],
                loc: {
                    start: { line: 1, column: 13 },
                    end: { line: 2, column: 18 }
                }
            },
            range: [0, 52],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 18 }
            }
        },

        '(function(){ return\nx; })': {
            type: 'ExpressionStatement',
            expression: {
                type: 'FunctionExpression',
                id: null,
                params: [],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [
                        {
                            type: 'ReturnStatement',
                            argument: null,
                            range: [13, 19],
                            loc: {
                                start: { line: 1, column: 13 },
                                end: { line: 1, column: 19 }
                            }
                        },
                        {
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'Identifier',
                                name: 'x',
                                range: [20, 21],
                                loc: {
                                    start: { line: 2, column: 0 },
                                    end: { line: 2, column: 1 }
                                }
                            },
                            range: [20, 22],
                            loc: {
                                start: { line: 2, column: 0 },
                                end: { line: 2, column: 2 }
                            }
                        }
                    ],
                    range: [11, 24],
                    loc: {
                        start: { line: 1, column: 11 },
                        end: { line: 2, column: 4 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [1, 24],
                loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 2, column: 4 }
                }
            },
            range: [0, 25],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 5 }
            }
        },

        '(function(){ return // Comment\nx; })': {
            type: 'ExpressionStatement',
            expression: {
                type: 'FunctionExpression',
                id: null,
                params: [],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [
                        {
                            type: 'ReturnStatement',
                            argument: null,
                            range: [13, 19],
                            loc: {
                                start: { line: 1, column: 13 },
                                end: { line: 1, column: 19 }
                            }
                        },
                        {
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'Identifier',
                                name: 'x',
                                range: [31, 32],
                                loc: {
                                    start: { line: 2, column: 0 },
                                    end: { line: 2, column: 1 }
                                }
                            },
                            range: [31, 33],
                            loc: {
                                start: { line: 2, column: 0 },
                                end: { line: 2, column: 2 }
                            }
                        }
                    ],
                    range: [11, 35],
                    loc: {
                        start: { line: 1, column: 11 },
                        end: { line: 2, column: 4 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [1, 35],
                loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 2, column: 4 }
                }
            },
            range: [0, 36],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 5 }
            }
        },

        '(function(){ return/* Multiline\nComment */x; })': {
            type: 'ExpressionStatement',
            expression: {
                type: 'FunctionExpression',
                id: null,
                params: [],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [
                        {
                            type: 'ReturnStatement',
                            argument: null,
                            range: [13, 19],
                            loc: {
                                start: { line: 1, column: 13 },
                                end: { line: 1, column: 19 }
                            }
                        },
                        {
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'Identifier',
                                name: 'x',
                                range: [42, 43],
                                loc: {
                                    start: { line: 2, column: 10 },
                                    end: { line: 2, column: 11 }
                                }
                            },
                            range: [42, 44],
                            loc: {
                                start: { line: 2, column: 10 },
                                end: { line: 2, column: 12 }
                            }
                        }
                    ],
                    range: [11, 46],
                    loc: {
                        start: { line: 1, column: 11 },
                        end: { line: 2, column: 14 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [1, 46],
                loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 2, column: 14 }
                }
            },
            range: [0, 47],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 15 }
            }
        },

        '{ throw error\nerror; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ThrowStatement',
                argument: {
                    type: 'Identifier',
                    name: 'error',
                    range: [8, 13],
                    loc: {
                        start: { line: 1, column: 8 },
                        end: { line: 1, column: 13 }
                    }
                },
                range: [2, 14],
                loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 2, column: 0 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'error',
                    range: [14, 19],
                    loc: {
                        start: { line: 2, column: 0 },
                        end: { line: 2, column: 5 }
                    }
                },
                range: [14, 20],
                loc: {
                    start: { line: 2, column: 0 },
                    end: { line: 2, column: 6 }
                }
            }],
            range: [0, 22],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 8 }
            }
        },

        '{ throw error// Comment\nerror; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ThrowStatement',
                argument: {
                    type: 'Identifier',
                    name: 'error',
                    range: [8, 13],
                    loc: {
                        start: { line: 1, column: 8 },
                        end: { line: 1, column: 13 }
                    }
                },
                range: [2, 24],
                loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 2, column: 0 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'error',
                    range: [24, 29],
                    loc: {
                        start: { line: 2, column: 0 },
                        end: { line: 2, column: 5 }
                    }
                },
                range: [24, 30],
                loc: {
                    start: { line: 2, column: 0 },
                    end: { line: 2, column: 6 }
                }
            }],
            range: [0, 32],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 8 }
            }
        },

        '{ throw error/* Multiline\nComment */error; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ThrowStatement',
                argument: {
                    type: 'Identifier',
                    name: 'error',
                    range: [8, 13],
                    loc: {
                        start: { line: 1, column: 8 },
                        end: { line: 1, column: 13 }
                    }
                },
                range: [2, 36],
                loc: {
                    start: { line: 1, column: 2 },
                    end: { line: 2, column: 10 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'error',
                    range: [36, 41],
                    loc: {
                        start: { line: 2, column: 10 },
                        end: { line: 2, column: 15 }
                    }
                },
                range: [36, 42],
                loc: {
                    start: { line: 2, column: 10 },
                    end: { line: 2, column: 16 }
                }
            }],
            range: [0, 44],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 2, column: 18 }
            }
        }

    },

    'Directive Prolog': {

        '(function () { \'use\\x20strict\'; with (i); }())': {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [{
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'Literal',
                                value: 'use strict',
                                raw: '\'use\\x20strict\'',
                                range: [15, 30],
                                loc: {
                                    start: { line: 1, column: 15 },
                                    end: { line: 1, column: 30 }
                                }
                            },
                            range: [15, 31],
                            loc: {
                                start: { line: 1, column: 15 },
                                end: { line: 1, column: 31 }
                            }
                        }, {
                            type: 'WithStatement',
                            object: {
                                type: 'Identifier',
                                name: 'i',
                                range: [38, 39],
                                loc: {
                                    start: { line: 1, column: 38 },
                                    end: { line: 1, column: 39 }
                                }
                            },
                            body: {
                                type: 'EmptyStatement',
                                range: [40, 41],
                                loc: {
                                    start: { line: 1, column: 40 },
                                    end: { line: 1, column: 41 }
                                }
                            },
                            range: [32, 41],
                            loc: {
                                start: { line: 1, column: 32 },
                                end: { line: 1, column: 41 }
                            }
                        }],
                        range: [13, 43],
                        loc: {
                            start: { line: 1, column: 13 },
                            end: { line: 1, column: 43 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [1, 43],
                    loc: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 43 }
                    }
                },
                'arguments': [],
                range: [1, 45],
                loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 1, column: 45 }
                }
            },
            range: [0, 46],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 46 }
            }
        },

        '(function () { \'use\\nstrict\'; with (i); }())': {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [{
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'Literal',
                                value: 'use\nstrict',
                                raw: '\'use\\nstrict\'',
                                range: [15, 28],
                                loc: {
                                    start: { line: 1, column: 15 },
                                    end: { line: 1, column: 28 }
                                }
                            },
                            range: [15, 29],
                            loc: {
                                start: { line: 1, column: 15 },
                                end: { line: 1, column: 29 }
                            }
                        }, {
                            type: 'WithStatement',
                            object: {
                                type: 'Identifier',
                                name: 'i',
                                range: [36, 37],
                                loc: {
                                    start: { line: 1, column: 36 },
                                    end: { line: 1, column: 37 }
                                }
                            },
                            body: {
                                type: 'EmptyStatement',
                                range: [38, 39],
                                loc: {
                                    start: { line: 1, column: 38 },
                                    end: { line: 1, column: 39 }
                                }
                            },
                            range: [30, 39],
                            loc: {
                                start: { line: 1, column: 30 },
                                end: { line: 1, column: 39 }
                            }
                        }],
                        range: [13, 41],
                        loc: {
                            start: { line: 1, column: 13 },
                            end: { line: 1, column: 41 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [1, 41],
                    loc: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 41 }
                    }
                },
                'arguments': [],
                range: [1, 43],
                loc: {
                    start: { line: 1, column: 1 },
                    end: { line: 1, column: 43 }
                }
            },
            range: [0, 44],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 44 }
            }
        }

    },

    'Whitespace': {

        'new\x20\x09\x0B\x0C\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\uFEFFa': {
            type: 'ExpressionStatement',
            expression: {
                type: 'NewExpression',
                callee: {
                    type: 'Identifier',
                    name: 'a',
                    range: [25, 26],
                    loc: {
                        start: {line: 1, column: 25},
                        end: {line: 1, column: 26}
                    }
                },
                arguments: [],
                range: [0, 26],
                loc: {
                    start: {line: 1, column: 0},
                    end: {line: 1, column: 26}
                }
            },
            range: [0, 26],
            loc: {
                start: {line: 1, column: 0},
                end: {line: 1, column: 26}
            }
        },

        '{0\x0A1\x0D2\u20283\u20294}': {
            type: 'BlockStatement',
            body: [
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: 0,
                        raw: '0',
                        range: [1, 2],
                        loc: {
                            start: {line: 1, column: 1},
                            end: {line: 1, column: 2}
                        }
                    },
                    range: [1, 3],
                    loc: {
                        start: {line: 1, column: 1},
                        end: {line: 2, column: 0}
                    }
                },
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: 1,
                        raw: '1',
                        range: [3, 4],
                        loc: {
                            start: {line: 2, column: 0},
                            end: {line: 2, column: 1}
                        }
                    },
                    range: [3, 5],
                    loc: {
                        start: {line: 2, column: 0},
                        end: {line: 3, column: 0}
                    }
                },
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: 2,
                        raw: '2',
                        range: [5, 6],
                        loc: {
                            start: {line: 3, column: 0},
                            end: {line: 3, column: 1}
                        }
                    },
                    range: [5, 7],
                    loc: {
                        start: {line: 3, column: 0},
                        end: {line: 4, column: 0}
                    }
                },
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: 3,
                        raw: '3',
                        range: [7, 8],
                        loc: {
                            start: {line: 4, column: 0},
                            end: {line: 4, column: 1}
                        }
                    },
                    range: [7, 9],
                    loc: {
                        start: {line: 4, column: 0},
                        end: {line: 5, column: 0}
                    }
                },
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: 4,
                        raw: '4',
                        range: [9, 10],
                        loc: {
                            start: {line: 5, column: 0},
                            end: {line: 5, column: 1}
                        }
                    },
                    range: [9, 10],
                    loc: {
                        start: {line: 5, column: 0},
                        end: {line: 5, column: 1}
                    }
                }
            ],
            range: [0, 11],
            loc: {
                start: {line: 1, column: 0},
                end: {line: 5, column: 2}
            }
        }

    },

    'Source elements': {

        '': {
            type: 'Program',
            body: [],
            range: [0, 0],
            loc: {
                start: { line: 0, column: 0 },
                end: { line: 0, column: 0 }
            },
            tokens: []
        }
    },

    'Source option': {
        'x + y - z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '-',
                left: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 1],
                        loc: {
                            start: { line: 1, column: 0 },
                            end: { line: 1, column: 1 },
                            source: '42.js'
                        }
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 5],
                        loc: {
                            start: { line: 1, column: 4 },
                            end: { line: 1, column: 5 },
                            source: '42.js'
                        }
                    },
                    range: [0, 5],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 5 },
                        source: '42.js'
                    }
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 9],
                    loc: {
                        start: { line: 1, column: 8 },
                        end: { line: 1, column: 9 },
                        source: '42.js'
                    }
                },
                range: [0, 9],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 9 },
                    source: '42.js'
                }
            },
            range: [0, 9],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 9 },
                source: '42.js'
            }
        },

        'a + (b < (c * d)) + e': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'Identifier',
                        name: 'a',
                        range: [0, 1],
                        loc: {
                            start: { line: 1, column: 0 },
                            end: { line: 1, column: 1 },
                            source: '42.js'
                        }
                    },
                    right: {
                        type: 'BinaryExpression',
                        operator: '<',
                        left: {
                            type: 'Identifier',
                            name: 'b',
                            range: [5, 6],
                            loc: {
                                start: { line: 1, column: 5 },
                                end: { line: 1, column: 6 },
                                source: '42.js'
                            }
                        },
                        right: {
                            type: 'BinaryExpression',
                            operator: '*',
                            left: {
                                type: 'Identifier',
                                name: 'c',
                                range: [10, 11],
                                loc: {
                                    start: { line: 1, column: 10 },
                                    end: { line: 1, column: 11 },
                                    source: '42.js'
                                }
                            },
                            right: {
                                type: 'Identifier',
                                name: 'd',
                                range: [14, 15],
                                loc: {
                                    start: { line: 1, column: 14 },
                                    end: { line: 1, column: 15 },
                                    source: '42.js'
                                }
                            },
                            range: [10, 15],
                            loc: {
                                start: { line: 1, column: 10 },
                                end: { line: 1, column: 15 },
                                source: '42.js'
                            }
                        },
                        range: [5, 16],
                        loc: {
                            start: { line: 1, column: 5 },
                            end: { line: 1, column: 16 },
                            source: '42.js'
                        }
                    },
                    range: [0, 17],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 17 },
                        source: '42.js'
                    }
                },
                right: {
                    type: 'Identifier',
                    name: 'e',
                    range: [20, 21],
                    loc: {
                        start: { line: 1, column: 20 },
                        end: { line: 1, column: 21 },
                        source: '42.js'
                    }
                },
                range: [0, 21],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 21 },
                    source: '42.js'
                }
            },
            range: [0, 21],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 21 },
                source: '42.js'
            }
        }

    },


    'Invalid syntax': {

        '{': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected end of input'
        },

        '}': {
            index: 0,
            lineNumber: 1,
            column: 1,
            message: 'Error: Line 1: Unexpected token }'
        },

        '3ea': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '3in []': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '3e': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '3e+': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '3e-': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '3x': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '3x0': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '0x': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '09': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '018': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '01a': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '3in[]': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '0x3in[]': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '"Hello\nWorld"': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'x\\': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'x\\u005c': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'x\\u002a': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'var x = /(s/g': {
            index: 13,
            lineNumber: 1,
            column: 14,
            message: 'Error: Line 1: Invalid regular expression'
        },

        'a\\u': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '\\ua': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '/': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        },

        '/test': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        },

        '/test\n/': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        },

        'var x = /[a-z]/\\ux': {
            index: 17,
            lineNumber: 1,
            column: 18,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'var x = /[a-z\n]/\\ux': {
            index: 14,
            lineNumber: 1,
            column: 15,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        },

        'var x = /[a-z]/\\\\ux': {
            index: 16,
            lineNumber: 1,
            column: 17,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'var x = /[P QR]/\\\\u0067': {
            index: 17,
            lineNumber: 1,
            column: 18,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '3 = 4': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        'func() = 4': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        '(1 + 1) = 10': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        '1++': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        '1--': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        '++1': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        '--1': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        'for((1 + 1) in list) process(x);': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Invalid left-hand side in for-in'
        },

        '[': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected end of input'
        },

        '[,': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected end of input'
        },

        '1 + {': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Unexpected end of input'
        },

        '1 + { t:t ': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Unexpected end of input'
        },

        '1 + { t:t,': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'var x = /\n/': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        },

        'var x = "\n': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'var if = 42': {
            index: 4,
            lineNumber: 1,
            column: 5,
            message: 'Error: Line 1: Unexpected token if'
        },

        'i #= 42': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'i + 2 = 42': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        '+i = 42': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        '1 + (': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Unexpected end of input'
        },

        '\n\n\n{': {
            index: 4,
            lineNumber: 4,
            column: 2,
            message: 'Error: Line 4: Unexpected end of input'
        },

        '\n/* Some multiline\ncomment */\n)': {
            index: 30,
            lineNumber: 4,
            column: 1,
            message: 'Error: Line 4: Unexpected token )'
        },

        '{ set 1 }': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Unexpected number'
        },

        '{ get 2 }': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Unexpected number'
        },

        '({ set: s(if) { } })': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Unexpected token if'
        },

        '({ set s(.) { } })': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token .'
        },

        '({ set s() { } })': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token )'
        },

        '({ set: s() { } })': {
            index: 12,
            lineNumber: 1,
            column: 13,
            message: 'Error: Line 1: Unexpected token {'
        },

        '({ set: s(a, b) { } })': {
            index: 16,
            lineNumber: 1,
            column: 17,
            message: 'Error: Line 1: Unexpected token {'
        },

        '({ get: g(d) { } })': {
            index: 13,
            lineNumber: 1,
            column: 14,
            message: 'Error: Line 1: Unexpected token {'
        },

        '({ get i() { }, i: 42 })': {
            index: 21,
            lineNumber: 1,
            column: 22,
            message: 'Error: Line 1: Object literal may not have data and accessor property with the same name'
        },

        '({ i: 42, get i() { } })': {
            index: 21,
            lineNumber: 1,
            column: 22,
            message: 'Error: Line 1: Object literal may not have data and accessor property with the same name'
        },

        '({ set i(x) { }, i: 42 })': {
            index: 22,
            lineNumber: 1,
            column: 23,
            message: 'Error: Line 1: Object literal may not have data and accessor property with the same name'
        },

        '({ i: 42, set i(x) { } })': {
            index: 22,
            lineNumber: 1,
            column: 23,
            message: 'Error: Line 1: Object literal may not have data and accessor property with the same name'
        },

        '({ get i() { }, get i() { } })': {
            index: 27,
            lineNumber: 1,
            column: 28,
            message: 'Error: Line 1: Object literal may not have multiple get/set accessors with the same name'
        },

        '({ set i(x) { }, set i(x) { } })': {
            index: 29,
            lineNumber: 1,
            column: 30,
            message: 'Error: Line 1: Object literal may not have multiple get/set accessors with the same name'
        },

        'function t(if) { }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Unexpected token if'
        },

        'function t(true) { }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Unexpected token true'
        },

        'function t(false) { }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Unexpected token false'
        },

        'function t(null) { }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Unexpected token null'
        },

        'function null() { }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token null'
        },

        'function true() { }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token true'
        },

        'function false() { }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token false'
        },

        'function if() { }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token if'
        },

        'a b;': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected identifier'
        },

        'if.a;': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token .'
        },

        'a if;': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token if'
        },

        'a class;': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected reserved word'
        },

        'break\n': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Illegal break statement'
        },

        'break 1;': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Unexpected number'
        },

        'continue\n': {
            index: 8,
            lineNumber: 1,
            column: 9,
            message: 'Error: Line 1: Illegal continue statement'
        },

        'continue 2;': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected number'
        },

        'throw': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'throw;': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Unexpected token ;'
        },

        'throw\n': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Illegal newline after throw'
        },

        'for (var i, i2 in {});': {
            index: 15,
            lineNumber: 1,
            column: 16,
            message: 'Error: Line 1: Unexpected token in'
        },

        'for ((i in {}));': {
            index: 14,
            lineNumber: 1,
            column: 15,
            message: 'Error: Line 1: Unexpected token )'
        },

        'for (i + 1 in {});': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Invalid left-hand side in for-in'
        },

        'for (+i in {});': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Invalid left-hand side in for-in'
        },

        'if(false)': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'if(false) doThis(); else': {
            index: 24,
            lineNumber: 1,
            column: 25,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'do': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'while(false)': {
            index: 12,
            lineNumber: 1,
            column: 13,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'for(;;)': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'with(x)': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'try { }': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Missing catch or finally after try'
        },

        'try {} catch (42) {} ': {
            index: 14,
            lineNumber: 1,
            column: 15,
            message: 'Error: Line 1: Unexpected number'
        },

        'try {} catch (answer()) {} ': {
            index: 20,
            lineNumber: 1,
            column: 21,
            message: 'Error: Line 1: Unexpected token ('
        },

        'try {} catch (-x) {} ': {
            index: 14,
            lineNumber: 1,
            column: 15,
            message: 'Error: Line 1: Unexpected token -'
        },


        '\u203F = 10': {
            index: 0,
            lineNumber: 1,
            column: 1,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'const x = 12, y;': {
            index: 15,
            lineNumber: 1,
            column: 16,
            message: 'Error: Line 1: Unexpected token ;'
        },

        'const x, y = 12;': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected token ,'
        },

        'const x;': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected token ;'
        },

        'if(true) let a = 1;': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token let'
        },

        'if(true) const a = 1;': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token const'
        },

        'switch (c) { default: default: }': {
            index: 30,
            lineNumber: 1,
            column: 31,
            message: 'Error: Line 1: More than one default clause in switch statement'
        },

        'new X()."s"': {
            index: 8,
            lineNumber: 1,
            column: 9,
            message: 'Error: Line 1: Unexpected string'
        },

        '/*': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '/*\n\n\n': {
            index: 5,
            lineNumber: 4,
            column: 1,
            message: 'Error: Line 4: Unexpected token ILLEGAL'
        },

        '/**': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '/*\n\n*': {
            index: 5,
            lineNumber: 3,
            column: 2,
            message: 'Error: Line 3: Unexpected token ILLEGAL'
        },

        '/*hello': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '/*hello  *': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '\n]': {
            index: 1,
            lineNumber: 2,
            column: 1,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '\r]': {
            index: 1,
            lineNumber: 2,
            column: 1,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '\r\n]': {
            index: 2,
            lineNumber: 2,
            column: 1,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '\n\r]': {
            index: 2,
            lineNumber: 3,
            column: 1,
            message: 'Error: Line 3: Unexpected token ]'
        },

        '//\r\n]': {
            index: 4,
            lineNumber: 2,
            column: 1,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '//\n\r]': {
            index: 4,
            lineNumber: 3,
            column: 1,
            message: 'Error: Line 3: Unexpected token ]'
        },

        '/a\\\n/': {
            index: 4,
            lineNumber: 1,
            column: 5,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        },

        '//\r \n]': {
            index: 5,
            lineNumber: 3,
            column: 1,
            message: 'Error: Line 3: Unexpected token ]'
        },

        '/*\r\n*/]': {
            index: 6,
            lineNumber: 2,
            column: 3,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '/*\n\r*/]': {
            index: 6,
            lineNumber: 3,
            column: 3,
            message: 'Error: Line 3: Unexpected token ]'
        },

        '/*\r \n*/]': {
            index: 7,
            lineNumber: 3,
            column: 3,
            message: 'Error: Line 3: Unexpected token ]'
        },

        '\\\\': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '\\u005c': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },


        '\\x': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '\\u0000': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '\u200C = []': {
            index: 0,
            lineNumber: 1,
            column: 1,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '\u200D = []': {
            index: 0,
            lineNumber: 1,
            column: 1,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '"\\': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '"\\u': {
            index: 3,
            lineNumber: 1,
            column: 4,
            