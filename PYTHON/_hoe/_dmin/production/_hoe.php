              }
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [{
                        type: 'Literal',
                        value: 42,
                        raw: '42',
                        range: [6, 8],
                        loc: {
                            start: { line: 1, column: 6 },
                            end: { line: 1, column: 8 }
                        }
                    }],
                    range: [4, 11],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 11 }
                    }
                },
                range: [0, 11],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 11 }
                }
            },
            range: [0, 11],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 11 }
            }
        },

        'x = [ ,, 42 ]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 1],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 1 }
                    }
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [
                        null,
                        null,
                        {
                            type: 'Literal',
                            value: 42,
                            raw: '42',
                            range: [9, 11],
                            loc: {
                                start: { line: 1, column: 9 },
                                end: { line: 1, column: 11 }
                            }
                        }],
                    range: [4, 13],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 13 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            },
            range: [0, 13],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 13 }
            }
        },

        'x = [ 1, 2, 3, ]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 1],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 1 }
                    }
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [{
                        type: 'Literal',
                        value: 1,
                        raw: '1',
                        range: [6, 7],
                        loc: {
                            start: { line: 1, column: 6 },
                            end: { line: 1, column: 7 }
                        }
                    }, {
                        type: 'Literal',
                        value: 2,
                        raw: '2',
                        range: [9, 10],
                        loc: {
                            start: { line: 1, column: 9 },
                            end: { line: 1, column: 10 }
                        }
                    }, {
                        type: 'Literal',
                        value: 3,
                        raw: '3',
                        range: [12, 13],
                        loc: {
                            start: { line: 1, column: 12 },
                            end: { line: 1, column: 13 }
                        }
                    }],
                    range: [4, 16],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 16 }
                    }
                },
                range: [0, 16],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 16 }
                }
            },
            range: [0, 16],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 16 }
            }
        },

        'x = [ 1, 2,, 3, ]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 1],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 1 }
                    }
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [{
                        type: 'Literal',
                        value: 1,
                        raw: '1',
                        range: [6, 7],
                        loc: {
                            start: { line: 1, column: 6 },
                            end: { line: 1, column: 7 }
                        }
                    }, {
                        type: 'Literal',
                        value: 2,
                        raw: '2',
                        range: [9, 10],
                        loc: {
                            start: { line: 1, column: 9 },
                            end: { line: 1, column: 10 }
                        }
                    }, null, {
                        type: 'Literal',
                        value: 3,
                        raw: '3',
                        range: [13, 14],
                        loc: {
                            start: { line: 1, column: 13 },
                            end: { line: 1, column: 14 }
                        }
                    }],
                    range: [4, 17],
                    loc: {
                        start: { line: 1, column: 4 },
                        end: { line: 1, column: 17 }
                    }
                },
                range: [0, 17],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 17 }
                }
            },
            range: [0, 17],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 17 }
            }
        },

        '日本語 = []': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: '日本語',
                    range: [0, 3],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 3 }
                    }
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [],
                    range: [6, 8],
                    loc: {
                        start: { line: 1, column: 6 },
                        end: { line: 1, column: 8 }
                    }
                },
                range: [0, 8],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 8 }
                }
            },
            range: [0, 8],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 8 }
            }
        },

        'T\u203F = []': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'T\u203F',
                    range: [0, 2],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 2 }
                    }
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [],
                    range: [5, 7],
                    loc: {
                        start: { line: 1, column: 5 },
                        end: { line: 1, column: 7 }
                    }
                },
                range: [0, 7],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 7 }
                }
            },
            range: [0, 7],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 7 }
            }
        },

        'T\u200C = []': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'T\u200C',
                    range: [0, 2],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 2 }
                    }
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [],
                    range: [5, 7],
                    loc: {
                        start: { line: 1, column: 5 },
                        end: { line: 1, column: 7 }
                    }
                },
                range: [0, 7],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 7 }
                }
            },
            range: [0, 7],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 7 }
            }
        },

        'T\u200D = []': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'T\u200D',
                    range: [0, 2],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 2 }
                    }
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [],
                    range: [5, 7],
                    loc: {
                        start: { line: 1, column: 5 },
                        end: { line: 1, column: 7 }
                    }
                },
                range: [0, 7],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 7 }
                }
            },
            range: [0, 7],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 7 }
            }
        },

        '\u2163\u2161 = []': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: '\u2163\u2161',
                    range: [0, 2],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 2 }
                    }
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [],
                    range: [5, 7],
                    loc: {
                        start: { line: 1, column: 5 },
                        end: { line: 1, column: 7 }
                    }
                },
                range: [0, 7],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 7 }
                }
            },
            range: [0, 7],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 7 }
            }
        },

        '\u2163\u2161\u200A=\u2009[]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: '\u2163\u2161',
                    range: [0, 2],
                    loc: {
                        start: { line: 1, column: 0 },
  