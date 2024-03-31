puted: true,
                    object: {
                        type: 'Identifier',
                        name: 'universe',
                        range: [0, 8],
                        loc: {
                            start: { line: 1, column: 0 },
                            end: { line: 1, column: 8 }
                        }
                    },
                    property: {
                        type: 'Literal',
                        value: 42,
                        raw: '42',
                        range: [9, 11],
                        loc: {
                            start: { line: 1, column: 9 },
                            end: { line: 1, column: 11 }
                        }
                    },
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                property: {
                    type: 'Identifier',
                    name: 'galaxies',
                    range: [13, 21],
                    loc: {
                        start: { line: 1, column: 13 },
                        end: { line: 1, column: 21 }
                    }
                },
                range: [0, 21],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 21 }
                }
            },
            range: [0, 21],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 21 }
            }
        },

        'universe(42).galaxies': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'universe',
                        range: [0, 8],
                        loc: {
                            start: { line: 1, column: 0 },
                            end: { line: 1, column: 8 }
                        }
                    },
                    'arguments': [{
                        type: 'Literal',
                        value: 42,
                        raw: '42',
                        range: [9, 11],
                        loc: {
                            start: { line: 1, column: 9 },
                            end: { line: 1, column: 11 }
                        }
                    }],
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                property: {
                    type: 'Identifier',
                    name: 'galaxies',
                    range: [13, 21],
                    loc: {
                        start: { line: 1, column: 13 },
                        end: { line: 1, column: 21 }
                    }
                },
                range: [0, 21],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 21 }
                }
            },
            range: [0, 21],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 21 }
            }
        },

        'universe(42).galaxies(14, 3, 77).milkyway': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'CallExpression',
                    callee: {
                        type: 'MemberExpression',
                        computed: false,
                        object: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'universe',
                                range: [0, 8],
                                loc: {
                                    start: { line: 1, column: 0 },
                                    end: { line: 1, column: 8 }
                                }
                            },
                            'arguments': [{
                                type: 'Literal',
                                value: 42,
                                raw: '42',
                                range: [9, 11],
                                loc: {
                                    start: { line: 1, column: 9 },
                                    end: { line: 1, column: 11 }
                                }
                            }],
                            range: [0, 12],
                            loc: {
                                start: { line: 1, column: 0 },
                                end: { line: 1, column: 12 }
                            }
                        },
                        property: {
                            type: 'Identifier',
                            name: 'galaxies',
                            range: [13, 21],
                            loc: {
                                start: { line: 1, column: 13 },
                                end: { line: 1, column: 21 }
                            }
                        },
                        range: [0, 21],
                        loc: {
                            start: { line: 1, column: 0 },
                            end: { line: 1, column: 21 }
                        }
                    },
                    'arguments': [{
                        type: 'Literal',
                        value: 14,
                        raw: '14',
                        range: [22, 24],
                        loc: {
                            start: { line: 1, column: 22 },
                            end: { line: 1, column: 24 }
                        }
                    }, {
                        type: 'Literal',
                        value: 3,
                        raw: '3',
                        range: [26, 27],
                        loc: {
                            start: { line: 1, column: 26 },
                            end: { line: 1, column: 27 }
                        }
                    }, {
                        type: 'Literal',
                        value: 77,
                        raw: '77',
                        range: [29, 31],
                        loc: {
                            start: { line: 1, column: 29 },
                            end: { line: 1, column: 31 }
                        }
                    }],
                    range: [0, 32],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 32 }
                    }
                },
                property: {
                    type: 'Identifier',
                    name: 'milkyway',
                    range: [33, 41],
                    loc: {
                        start: { line: 1, column: 33 },
                        end: { line: 1, column: 41 }
                    }
                },
                range: [0, 41],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 41 }
                }
            },
            range: [0, 41],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 41 }
            }
        },

        'earth.asia.Indonesia.prepareForElection(2014)': {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                        type: 'MemberExpression',
                        computed: false,
                        object: {
                            type: 'MemberExpression',
                            computed: false,
                            object: {
                                type: 'Identifier',
                                name: 'earth',
                                range: [0, 5],
                                loc: {
                                    start: { line: 1, column: 0 },
                                    end: { line: 1, column: 5 }
                                }
                            },
                            property: {
                                type: 'Identifier',
                                name: 'asia',
                                range: [6, 10],
                                loc: {
                                    start: { line: 1, column: 6 },
                                    end: { line: 1, column: 10 }
                                }
                            },
                            range: [0, 10],
                            loc: {
                                start: { line: 1, column: 0 },
                                end: { line: 1, column: 10 }
                            }
                        },
                        property: {
                            type: 'Identifier',
                            name: 'Indonesia',
                            range: [11, 20],
                            loc: {
                                start: { line: 1, column: 11 },
                                end: { line: 1, column: 20 }
                            }
                        },
                        range: [0, 20],
                        loc: {
                            start: { line: 1, column: 0 },
                            end: { line: 1, column: 20 }
                        }
                    },
                    property: {
                        type: 'Identifier',
                        name: 'prepareForElection',
                        range: [21, 39],
                        loc: {
                            start: { line: 1, column: 21 },
                            end: { line: 1, column: 39 }
                        }
                    },
                    range: [0, 39],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 39 }
                    }
                },
                'arguments': [{
                    type: 'Literal',
                    value: 2014,
                    raw: '2014',
                    range: [40, 44],
                    loc: {
                        start: { line: 1, column: 40 },
                        end: { line: 1, column: 44 }
                    }
                }],
                range: [0, 45],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 45 }
                }
            },
            range: [0, 45],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 45 }
            }
        },

        'universe.if': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 8],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 8 }
                    }
                },
                property: {
                    type: 'Identifier',
                    name: 'if',
                    range: [9, 11],
                    loc: {
                        start: { line: 1, column: 9 },
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

        'universe.true': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 8],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 8 }
                    }
                },
                property: {
                    type: 'Identifier',
                    name: 'true',
                    range: [9, 13],
                    loc: {
                        start: { line: 1, column: 9 },
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

        'universe.false': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 8],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 8 }
                    }
                },
                property: {
                    type: 'Identifier',
                    name: 'false',
                    range: [9, 14],
                    loc: {
                        start: { line: 1, column: 9 },
                        end: { line: 1, column: 14 }
                    }
                },
                range: [0, 14],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 14 }
                }
            },
            range: [0, 14],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 14 }
            }
        },

        'universe.null': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 8],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 8 }
                    }
                },
                property: {
                    type: 'Identifier',
                    name: 'null',
                    range: [9, 13],
                    loc: {
                        start: { line: 1, column: 9 },
                        end: { line: 1, column: 13 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
   