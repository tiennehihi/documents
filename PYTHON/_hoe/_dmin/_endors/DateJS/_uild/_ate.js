
            lineNumber: 1,
            column: 34,
            message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
        },

        'function hello() { \'use strict\'; 021; }': {
            index: 33,
            lineNumber: 1,
            column: 34,
            message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
        },

        'function hello() { \'use strict\'; ({ "\\1": 42 }); }': {
            index: 36,
            lineNumber: 1,
            column: 37,
            message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
        },

        'function hello() { \'use strict\'; ({ 021: 42 }); }': {
            index: 36,
            lineNumber: 1,
            column: 37,
            message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
        },

        'function hello() { "octal directive\\1"; "use strict"; }': {
            index: 19,
            lineNumber: 1,
            column: 20,
            message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
        },

        'function hello() { "octal directive\\1"; "octal directive\\2"; "use strict"; }': {
            index: 19,
            lineNumber: 1,
            column: 20,
            message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
        },

        'function hello() { "use strict"; function inner() { "octal directive\\1"; } }': {
            index: 52,
            lineNumber: 1,
            column: 53,
            message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
        },

        'function hello() { "use strict"; var implements; }': {
            index: 37,
            lineNumber: 1,
            column: 38,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function hello() { "use strict"; var interface; }': {
            index: 37,
            lineNumber: 1,
            column: 38,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function hello() { "use strict"; var package; }': {
            index: 37,
            lineNumber: 1,
            column: 38,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function hello() { "use strict"; var private; }': {
            index: 37,
            lineNumber: 1,
            column: 38,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function hello() { "use strict"; var protected; }': {
            index: 37,
            lineNumber: 1,
            column: 38,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function hello() { "use strict"; var public; }': {
            index: 37,
            lineNumber: 1,
            column: 38,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function hello() { "use strict"; var static; }': {
            index: 37,
            lineNumber: 1,
            column: 38,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function hello() { "use strict"; var yield; }': {
            index: 37,
            lineNumber: 1,
            column: 38,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function hello() { "use strict"; var let; }': {
            index: 37,
            lineNumber: 1,
            column: 38,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function hello(static) { "use strict"; }': {
            index: 15,
            lineNumber: 1,
            column: 16,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function static() { "use strict"; }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function eval(a) { "use strict"; }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Function name may not be eval or arguments in strict mode'
        },

        'function arguments(a) { "use strict"; }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Function name may not be eval or arguments in strict mode'
        },

        'var yield': {
            index: 4,
            lineNumber: 1,
            column: 5,
            message: 'Error: Line 1: Unexpected token yield'
        },

        'var let': {
            index: 4,
            lineNumber: 1,
            column: 5,
            message: 'Error: Line 1: Unexpected token let'
        },

        '"use strict"; function static() { }': {
            index: 23,
            lineNumber: 1,
            column: 24,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function a(t, t) { "use strict"; }': {
            index: 14,
            lineNumber: 1,
            column: 15,
            message: 'Error: Line 1: Strict mode function may not have duplicate parameter names'
        },

        'function a(eval) { "use strict"; }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Parameter name eval or arguments is not allowed in strict mode'
        },

        'function a(package) { "use strict"; }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        'function a() { "use strict"; function b(t, t) { }; }': {
            index: 43,
            lineNumber: 1,
            column: 44,
            message: 'Error: Line 1: Strict mode function may not have duplicate parameter names'
        },

        '(function a(t, t) { "use strict"; })': {
            index: 15,
            lineNumber: 1,
            column: 16,
            message: 'Error: Line 1: Strict mode function may not have duplicate parameter names'
        },

        'function a() { "use strict"; (function b(t, t) { }); }': {
            index: 44,
            lineNumber: 1,
            column: 45,
            message: 'Error: Line 1: Strict mode function may not have duplicate parameter names'
        },

        '(function a(eval) { "use strict"; })': {
            index: 12,
            lineNumber: 1,
            column: 13,
            message: 'Error: Line 1: Parameter name eval or arguments is not allowed in strict mode'
        },

        '(function a(package) { "use strict"; })': {
            index: 12,
            lineNumber: 1,
            column: 13,
            message: 'Error: Line 1: Use of future reserved word in strict mode'
        },

        '__proto__: __proto__: 42;': {
            index: 21,
            lineNumber: 1,
            column: 22,
            message: 'Error: Line 1: Label \'__proto__\' has already been declared'
        },

        '"use strict"; function t(__proto__, __proto__) { }': {
            index: 36,
            lineNumber: 1,
            column: 37,
            message: 'Error: Line 1: Strict mode function may not have duplicate parameter names'
        },

        '"use strict"; x = { __proto__: 42, __proto__: 43 }': {
            index: 48,
            lineNumber: 1,
            column: 49,
            message: 'Error: Line 1: Duplicate data property in object literal not allowed in strict mode'
        },

        '"use strict"; x = { get __proto__() { }, __proto__: 43 }': {
            index: 54,
            lineNumber: 1,
            column: 55,
            message: 'Error: Line 1: Object literal may not have data and accessor property with the same name'
        },

        'var': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'let': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'const': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Unexpected end of input'
        },

        '{ ;  ;  ': {
            index: 8,
            lineNumber: 1,
            column: 9,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'function t() { ;  ;  ': {
            index: 21,
            lineNumber: 1,
            column: 22,
            message: 'Error: Line 1: Unexpected end of input'
        }

    },

    'Tokenize': {
        'tokenize(/42/)': [
            {
                "type": "Identifier",
                "value": "tokenize",
                "range": [
                    0,
                    8
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 8
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "(",
                "range": [
                    8,
                    9
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 8
                    },
                    "end": {
                        "line": 1,
                        "column": 9
                    }
                }
            },
            {
                "type": "RegularExpression",
                "value": "/42/",
                "range": [
                    9,
                    13
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 9
                    },
                    "end": {
                        "line": 1,
                        "column": 13
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": ")",
                "range": [
                    13,
                    14
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 13
                    },
                    "end": {
                        "line": 1,
                        "column": 14
                    }
                }
            }
        ],

        'if (false) { /42/ }': [
            {
                "type": "Keyword",
                "value": "if",
                "range": [
                    0,
                    2
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 2
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "(",
                "range": [
                    3,
                    4
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 3
                    },
                    "end": {
                        "line": 1,
                        "column": 4
                    }
                }
            },
            {
                "type": "Boolean",
                "value": "false",
                "range": [
                    4,
                    9
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 4
                    },
                    "end": {
                        "line": 1,
                        "column": 9
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": ")",
                "range": [
                    9,
                    10
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 9
                    },
                    "end": {
                        "line": 1,
                        "column": 10
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "{",
                "range": [
                    11,
                    12
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 11
                    },
                    "end": {
                        "line": 1,
                        "column": 12
                    }
                }
            },
            {
                "type": "RegularExpression",
                "value": "/42/",
                "range": [
                    13,
                    17
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 13
                    },
                    "end": {
                        "line": 1,
                        "column": 17
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "}",
                "range": [
                    18,
                    19
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 18
                    },
                    "end": {
                        "line": 1,
                        "column": 19
                    }
                }
            }
        ],

        'with (false) /42/': [
            {
                "type": "Keyword",
                "value": "with",
                "range": [
                    0,
                    4
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 4
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "(",
                "range": [
                    5,
                    6
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 5
                    },
                    "end": {
                        "line": 1,
                        "column": 6
                    }
                }
            },
            {
                "type": "Boolean",
                "value": "false",
                "range": [
                    6,
                    11
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 6
                    },
                    "end": {
                        "line": 1,
                        "column": 11
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": ")",
                "range": [
                    11,
                    12
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 11
                    },
                    "end": {
                        "line": 1,
                        "column": 12
                    }
                }
            },
            {
                "type": "RegularExpression",
                "value": "/42/",
                "range": [
                    13,
                    17
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 13
                    },
                    "end": {
                        "line": 1,
                        "column": 17
                    }
                }
            }
        ],

        '(false) /42/': [
            {
                "type": "Punctuator",
                "value": "(",
                "range": [
                    0,
                    1
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 1
                    }
                }
            },
            {
                "type": "Boolean",
                "value": "false",
                "range": [
                    1,
                    6
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 1
                    },
                    "end": {
                        "line": 1,
                        "column": 6
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": ")",
                "range": [
                    6,
                    7
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 6
                    },
                    "end": {
                        "line": 1,
                        "column": 7
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "/",
                "range": [
                    8,
                    9
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 8
                    },
                    "end": {
                        "line": 1,
                        "column": 9
                    }
                }
            },
            {
                "type": "Numeric",
                "value": "42",
                "range": [
                    9,
                    11
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 9
                    },
                    "end": {
                        "line": 1,
                        "column": 11
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "/",
                "range": [
                    11,
                    12
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 11
                    },
                    "end": {
                        "line": 1,
                        "column": 12
                    }
                }
            }
        ],

        'function f(){} /42/': [
            {
                "type": "Keyword",
                "value": "function",
                "range": [
                    0,
                    8
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 8
                    }
                }
            },
            {
                "type": "Identifier",
                "value": "f",
                "range": [
                    9,
                    10
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 9
                    },
                    "end": {
                        "line": 1,
                        "column": 10
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "(",
                "range": [
                    10,
                    11
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 10
                    },
                    "end": {
                        "line": 1,
                        "column": 11
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": ")",
                "range": [
                    11,
                    12
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 11
                    },
                    "end": {
                        "line": 1,
                        "column": 12
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "{",
                "range": [
                    12,
                    13
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 12
                    },
                    "end": {
                        "line": 1,
                        "column": 13
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "}",
                "range": [
                    13,
                    14
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 13
                    },
                    "end": {
                        "line": 1,
                        "column": 14
                    }
                }
            },
            {
                "type": "RegularExpression",
                "value": "/42/",
                "range": [
                    15,
                    19
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 15
                    },
                    "end": {
                        "line": 1,
                        "column": 19
                    }
                }
            }
        ],

        'function(){} /42': [
            {
                "type": "Keyword",
                "value": "function",
                "range": [
                    0,
                    8
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 8
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "(",
                "range": [
                    8,
                    9
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 8
                    },
                    "end": {
                        "line": 1,
                        "column": 9
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": ")",
                "range": [
                    9,
                    10
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 9
                    },
                    "end": {
                        "line": 1,
                        "column": 10
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "{",
                "range": [
                    10,
                    11
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 10
                    },
                    "end": {
                        "line": 1,
                        "column": 11
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "}",
                "range": [
                    11,
                    12
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 11
                    },
                    "end": {
                        "line": 1,
                        "column": 12
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "/",
                "range": [
                    13,
                    14
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 13
                    },
                    "end": {
                        "line": 1,
                        "column": 14
                    }
                }
            },
            {
                "type": "Numeric",
                "value": "42",
                "range": [
                    14,
                    16
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 14
                    },
                    "end": {
                        "line": 1,
                        "column": 16
                    }
                }
            }
        ],

        '{} /42': [
            {
                "type": "Punctuator",
                "value": "{",
                "range": [
                    0,
                    1
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 1
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "}",
                "range": [
                    1,
                    2
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 1
                    },
                    "end": {
                        "line": 1,
                        "column": 2
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "/",
                "range": [
                    3,
                    4
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 3
                    },
                    "end": {
                        "line": 1,
                        "column": 4
                    }
                }
            },
            {
                "type": "Numeric",
                "value": "42",
                "range": [
                    4,
                    6
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 4
                    },
                    "end": {
                        "line": 1,
                        "column": 6
                    }
                }
            }
        ],

        '[function(){} /42]': [
            {
                "type": "Punctuator",
                "value": "[",
                "range": [
                    0,
                    1
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 1
                    }
                }
            },
            {
                "type": "Keyword",
                "value": "function",
                "range": [
                    1,
                    9
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 1
                    },
                    "end": {
                        "line": 1,
                        "column": 9
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "(",
                "range": [
                    9,
                    10
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 9
                    },
                    "end": {
                        "line": 1,
                        "column": 10
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": ")",
                "range": [
                    10,
                    11
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 10
                    },
                    "end": {
                        "line": 1,
                        "column": 11
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "{",
                "range": [
                    11,
                    12
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 11
                    },
                    "end": {
                        "line": 1,
                        "column": 12
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "}",
                "range": [
                    12,
                    13
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 12
                    },
                    "end": {
                        "line": 1,
                        "column": 13
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "/",
                "range": [
                    14,
                    15
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 14
                    },
                    "end": {
                        "line": 1,
                        "column": 15
                    }
                }
            },
            {
                "type": "Numeric",
                "value": "42",
                "range": [
                    15,
                    17
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 15
                    },
                    "end": {
                        "line": 1,
                        "column": 17
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "]",
                "range": [
                    17,
                    18
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 17
                    },
                    "end": {
                        "line": 1,
                        "column": 18
                    }
                }
            }
        ],

        ';function f(){} /42/': [
            {
                "type": "Punctuator",
                "value": ";",
                "range": [
                    0,
                    1
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 1
                    }
                }
            },
            {
                "type": "Keyword",
                "value": "function",
                "range": [
                    1,
                    9
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 1
                    },
                    "end": {
                        "line": 1,
                        "column": 9
                    }
                }
            },
            {
                "type": "Identifier",
                "value": "f",
                "range": [
                    10,
                    11
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 10
                    },
                    "end": {
                        "line": 1,
                        "column": 11
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "(",
                "range": [
                    11,
                    12
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 11
                    },
                    "end": {
                        "line": 1,
                        "column": 12
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": ")",
                "range": [
                    12,
                    13
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 12
                    },
                    "end": {
                        "line": 1,
                        "column": 13
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "{",
                "range": [
                    13,
                    14
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 13
                    },
                    "end": {
                        "line": 1,
                        "column": 14
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "}",
                "range": [
                    14,
                    15
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 14
                    },
                    "end": {
                        "line": 1,
                        "column": 15
                    }
                }
            },
            {
                "type": "RegularExpression",
                "value": "/42/",
                "range": [
                    16,
                    20
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 16
                    },
                    "end": {
                        "line": 1,
                        "column": 20
                    }
                }
            }
        ],

        'void /42/': [
            {
                "type": "Keyword",
                "value": "void",
                "range": [
                    0,
                    4
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 4
                    }
                }
            },
            {
                "type": "RegularExpression",
                "value": "/42/",
                "range": [
                    5,
                    9
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 5
                    },
                    "end": {
                        "line": 1,
                        "column": 9
                    }
                }
            }
        ],

        '/42/': [
            {
                "type": "RegularExpression",
                "value": "/42/",
                "range": [
                    0,
                    4
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 4
                    }
                }
            }
        ],

        'foo[/42]': [
            {
                "type": "Identifier",
                "value": "foo",
                "range": [
                    0,
                    3
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 3
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "[",
                "range": [
                    3,
                    4
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 3
                    },
                    "end": {
                        "line": 1,
                        "column": 4
                    }
                }
            }
        ],

        '[a] / b': [
            {
                "type": "Punctuator",
                "value": "[",
                "range": [
                    0,
                    1
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 1
                    }
                }
            },
            {
                "type": "Identifier",
                "value": "a",
                "range": [
                    1,
                    2
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 1
                    },
                    "end": {
                        "line": 1,
                        "column": 2
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "]",
                "range": [
                    2,
                    3
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 2
                    },
                    "end": {
                        "line": 1,
                        "column": 3
                    }
                }
            },
            {
                "type": "Punctuator",
                "value": "/",
                "range": [
                    4,
                    5
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 4
                    },
                    "end": {
                        "line": 1,
                        "column": 5
                    }
                }
            },
            {
                "type": "Identifier",
                "value": "b",
                "range": [
                    6,
                    7
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 6
                    },
                    "end": {
                        "line": 1,
                        "column": 7
                    }
                }
            }
        ],

        '': [],

        '/42': {
            tokenize: true,
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        },

        'foo[/42': {
            tokenize: true,
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        }

    },

    'API': {
        'parse()': {
            call: 'parse',
            args: [],
            result: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Identifier',
                        name: 'undefined'
                    }
                }]
            }
        },

        'parse(null)': {
            call: 'parse',
            args: [null],
            result: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: null,
                        raw: 'null'
                    }
                }]
            }
        },

        'parse(42)': {
            call: 'parse',
            args: [42],
            result: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: 42,
                        raw: '42'
                    }
                }]
            }
        },

        'parse(true)': {
            call: 'parse',
            args: [true],
            result: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: true,
                        raw: 'true'
                    }
                }]
            }
        },

        'parse(undefined)': {
            call: 'parse',
            args: [void 0],
            result: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Identifier',
                        name: 'undefined'
                    }
                }]
            }
        },

        'parse(new String("test"))': {
            call: 'parse',
            args: [new String('test')],
            result: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Identifier',
                        name: 'test'
                    }
                }]
            }
        },

        'parse(new Number(42))': {
            call: 'parse',
            args: [new Number(42)],
            result: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: 42,
                        raw: '42'
                    }
                }]
            }
        },

        'parse(new Boolean(true))': {
            call: 'parse',
            args: [new Boolean(true)],
            result: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: true,
                        raw: 'true'
                    }
                }]
            }
        },

        'Syntax': {
            property: 'Syntax',
            result: {
                AssignmentExpression: 'AssignmentExpression',
                ArrayExpression: 'ArrayExpression',
                BlockStatement: 'BlockStatement',
                BinaryExpression: 'BinaryExpression',
                BreakStatement: 'BreakStatement',
                CallExpression: 'CallExpression',
                CatchClause: 'CatchClause',
                ConditionalExpression: 'ConditionalExpression',
                ContinueStatement: 'ContinueStatement',
                DoWhileStatement: 'DoWhileStatement',
                DebuggerStatement: 'DebuggerStatement',
                EmptyStatement: 'EmptyStatement',
                ExpressionStatement: 'ExpressionStatement',
                ForStatement: 'ForStatement',
                ForInStatement: 'ForInStatement',
                FunctionDeclaration: 'FunctionDeclaration',
                FunctionExpression: 'FunctionExpression',
                Identifier: 'Identifier',
                IfStatement: 'IfStatement',
                Literal: 'Literal',
                LabeledStatement: 'LabeledStatement',
                LogicalExpression: 'LogicalExpression',
                MemberExpression: 'MemberExpression',
                NewExpression: 'NewExpression',
                ObjectExpression: 'ObjectExpression',
                Program: 'Program',
                Property: 'Property',
                ReturnStatement: 'ReturnStatement',
                SequenceExpression: 'SequenceExpression',
                SwitchStatement: 'SwitchStatement',
                SwitchCase: 'SwitchCase',
                ThisExpression: 'ThisExpression',
                ThrowStatement: 'ThrowStatement',
                TryStatement: 'TryStatement',
                UnaryExpression: 'UnaryExpression',
                UpdateExpression: 'UpdateExpression',
                VariableDeclaration: 'VariableDeclaration',
                VariableDeclarator: 'VariableDeclarator',
                WhileStatement: 'WhileStatement',
                WithStatement: 'WithStatement'
            }
        },

        'tokenize()': {
          call: 'tokenize',
          args: [],
          result: [{
            type: 'Identifier',
            value: 'undefined'
          }]
        },

        'tokenize(null)': {
          call: 'tokenize',
          args: [null],
          result: [{
            type: 'Null',
            value: 'null'
          }]
        },

        'tokenize(42)': {
          call: 'tokenize',
          args: [42],
          result: [{
            type: 'Numeric',
            value: '42'
          }]
        },

        'tokenize(true)': {
          call: 'tokenize',
          args: [true],
          result: [{
            type: 'Boolean',
            value: 'true'
          }]
        },

        'tokenize(undefined)': {
          call: 'tokenize',
          args: [void 0],
          result: [{
            type: 'Identifier',
            value: 'undefined'
          }]
        },

        'tokenize(new String("test"))': {
          call: 'tokenize',
          args: [new String('test')],
          result: [{
            type: 'Identifier',
            value: 'test'
          }]
        },

        'tokenize(new Number(42))': {
          call: 'tokenize',
          args: [new Number(42)],
          result: [{
            type: 'Numeric',
            value: '42'
          }]
        },

        'tokenize(new Boolean(true))': {
          call: 'tokenize',
          args: [new Boolean(true)],
          result: [{
            type: 'Boolean',
            value: 'true'
          }]
        }
    },

    'Tolerant parse': {
        'return': {
            type: 'Program',
            body: [{
                type: 'ReturnStatement',
                'argument': null,
                range: [0, 6],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 6 }
                }
            }],
            range: [0, 6],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 6 }
            },
            errors: [{
                index: 6,
                lineNumber: 1,
                column: 7,
                message: 'Error: Line 1: Illegal return statement'
            }]
        },

        '(function () { \'use strict\'; with (i); }())': {
            type: 'Program',
            body: [{
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
                                    raw: '\'use strict\'',
                                    range: [15, 27],
                                    loc: {
                                        start: { line: 1, column: 15 },
                                        end: { line: 1, column: 27 }
                                    }
                                },
                                range: [15, 28],
                                loc: {
                                    start: { line: 1, column: 15 },
                                    end: { line: 1, column: 28 }
                                }
                            }, {
                                type: 'WithStatement',
                                object: {
                                    type: 'Identifier',
                                    name: 'i',
                                    range: [35, 36],
                                    loc: {
                                        start: { line: 1, column: 35 },
                                        end: { line: 1, column: 36 }
                                    }
                                },
                                body: {
                                    type: 'EmptyStatement',
                                    range: [37, 38],
                                    loc: {
                                        start: { line: 1, column: 37 },
                                        end: { line: 1, column: 38 }
                                    }
                                },
                                range: [29, 38],
                                loc: {
                                    start: { line: 1, column: 29 },
                                    end: { line: 1, column: 38 }
                                }
                            }],
                            range: [13, 40],
                            loc: {
                                start: { line: 1, column: 13 },
                                end: { line: 1, column: 40 }
                            }
                        },
                        rest: null,
                        generator: false,
                        expression: false,
                        range: [1, 40],
                        loc: {
                            start: { line: 1, column: 1 },
                            end: { line: 1, column: 40 }
                        }
                    },
                    'arguments': [],
                    range: [1, 42],
                    loc: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 42 }
                    }
                },
                range: [0, 43],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 43 }
                }
            }],
            range: [0, 43],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 43 }
            },
            errors: [{
                index: 29,
                lineNumber: 1,
                column: 30,
                message: 'Error: Line 1: Strict mode code may not include a with statement'
            }]
        },

        '(function () { \'use strict\'; 021 }())': {
            type: 'Program',
            body: [{
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
                                    raw: '\'use strict\'',
                                    range: [15, 27],
                                    loc: {
                                        start: { line: 1, column: 15 },
                                        end: { line: 1, column: 27 }
                                    }
                                },
                                range: [15, 28],
                                loc: {
                                    start: { line: 1, column: 15 },
                                    end: { line: 1, column: 28 }
                                }
                            }, {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'Literal',
                                    value: 17,
                                    raw: "021",
                                    range: [29, 32],
                                    loc: {
                                        start: { line: 1, column: 29 },
                                        end: { line: 1, column: 32 }
                                    }
                                },
                                range: [29, 33],
                                loc: {
                                    start: { line: 1, column: 29 },
                                    end: { line: 1, column: 33 }
                                }
                            }],
                            range: [13, 34],
                            loc: {
                                start: { line: 1, column: 13 },
                                end: { line: 1, column: 34 }
                            }
                        },
                        rest: null,
                        generator: false,
                        expression: false,
                        range: [1, 34],
                        loc: {
                            start: { line: 1, column: 1 },
                            end: { line: 1, column: 34 }
                        }
                    },
                    'arguments': [],
                    range: [1, 36],
                    loc: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 36 }
                    }
                },
                range: [0, 37],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 37 }
                }
            }],
            range: [0, 37],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 37 }
            },
            errors: [{
                index: 29,
                lineNumber: 1,
                column: 30,
                message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
            }]
        },

        '"use strict"; delete x': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    argument: {
                        type: 'Identifier',
                        name: 'x',
                        range: [21, 22],
                        loc: {
                            start: { line: 1, column: 21 },
                            end: { line: 1, column: 22 }
                        }
                    },
                    prefix: true,
                    range: [14, 22],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 22 }
                    }
                },
                range: [14, 22],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 22 }
                }
            }],
            range: [0, 22],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 22 }
            },
            errors: [{
                index: 22,
                lineNumber: 1,
                column: 23,
                message: 'Error: Line 1: Delete of an unqualified identifier in strict mode.'
            }]
        },

        '"use strict"; try {} catch (eval) {}': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'TryStatement',
                block: {
                    type: 'BlockStatement',
                    body: [],
                    range: [18, 20],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 20 }
                    }
                },
                guardedHandlers: [],
                handlers: [{
                    type: 'CatchClause',
                    param: {
                        type: 'Identifier',
                        name: 'eval',
                        range: [28, 32],
                        loc: {
                            start: { line: 1, column: 28 },
                            end: { line: 1, column: 32 }
                        }
                    },
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [34, 36],
                        loc: {
                            start: { line: 1, column: 34 },
                            end: { line: 1, column: 36 }
                        }
                    },
                    range: [21, 36],
                    loc: {
                        start: { line: 1, column: 21 },
                        end: { line: 1, column: 36 }
                    }
                }],
                finalizer: null,
                range: [14, 36],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 36 }
                }
            }],
            range: [0, 36],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 36 }
            },
            errors: [{
                index: 32,
                lineNumber: 1,
                column: 33,
                message: 'Error: Line 1: Catch variable may not be eval or arguments in strict mode'
            }]
        },

        '"use strict"; try {} catch (arguments) {}': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'TryStatement',
                block: {
                    type: 'BlockStatement',
                    body: [],
                    range: [18, 20],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 20 }
                    }
                },
                guardedHandlers: [],
                handlers: [{
                    type: 'CatchClause',
                    param: {
                        type: 'Identifier',
                        name: 'arguments',
                        range: [28, 37],
                        loc: {
                            start: { line: 1, column: 28 },
                            end: { line: 1, column: 37 }
                        }
                    },
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [39, 41],
                        loc: {
                            start: { line: 1, column: 39 },
                            end: { line: 1, column: 41 }
                        }
                    },
                    range: [21, 41],
                    loc: {
                        start: { line: 1, column: 21 },
                        end: { line: 1, column: 41 }
                    }
                }],
                finalizer: null,
                range: [14, 41],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 41 }
                }
            }],
            range: [0, 41],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 41 }
            },
            errors: [{
                index: 37,
                lineNumber: 1,
                column: 38,
                message: 'Error: Line 1: Catch variable may not be eval or arguments in strict mode'
            }]
        },

        '"use strict"; var eval;': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'eval',
                        range: [18, 22],
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 22 }
                        }
                    },
                    init: null,
                    range: [18, 22],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 22 }
                    }
                }],
                kind: 'var',
                range: [14, 23],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 23 }
                }
            }],
            range: [0, 23],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 23 }
            },
            errors: [{
                index: 22,
                lineNumber: 1,
                column: 23,
                message: 'Error: Line 1: Variable name may not be eval or arguments in strict mode'
            }]
        },

        '"use strict"; var arguments;': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'arguments',
                        range: [18, 27],
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 27 }
                        }
                    },
                    init: null,
                    range: [18, 27],
                    loc: {
                        start: { line: 1, column: 18 },
                        end: { line: 1, column: 27 }
                    }
                }],
                kind: 'var',
                range: [14, 28],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 28 }
                }
            }],
            range: [0, 28],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 28 }
            },
            errors: [{
                index: 27,
                lineNumber: 1,
                column: 28,
                message: 'Error: Line 1: Variable name may not be eval or arguments in strict mode'
            }]
        },

        '"use strict"; eval = 0;': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'Identifier',
                        name: 'eval',
                        range: [14, 18],
                        loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 18 }
                        }
                    },
                    right: {
                        type: 'Literal',
                        value: 0,
                        raw: '0',
                        range: [21, 22],
                        loc: {
                            start: { line: 1, column: 21 },
                            end: { line: 1, column: 22 }
                        }
                    },
                    range: [14, 22],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 22 }
                    }
                },
                range: [14, 23],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 23 }
                }
            }],
            range: [0, 23],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 23 }
            },
            errors: [{
                index: 14,
                lineNumber: 1,
                column: 15,
                message: 'Error: Line 1: Assignment to eval or arguments is not allowed in strict mode'
            }]
        },

        '"use strict"; eval++;': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    argument: {
                        type: 'Identifier',
                        name: 'eval',
                        range: [14, 18],
                        loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 18 }
                        }
                    },
                    prefix: false,
                    range: [14, 20],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 20 }
                    }
                },
                range: [14, 21],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 21 }
                }
            }],
            range: [0, 21],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 21 }
            },
            errors: [{
                index: 18,
                lineNumber: 1,
                column: 19,
                message: 'Error: Line 1: Postfix increment/decrement may not have eval or arguments operand in strict mode'
            }]
        },

        '"use strict"; --eval;': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UpdateExpression',
                    operator: '--',
                    argument: {
                        type: 'Identifier',
                        name: 'eval',
                        range: [16, 20],
                        loc: {
                            start: { line: 1, column: 16 },
                            end: { line: 1, column: 20 }
                        }
                    },
                    prefix: true,
                    range: [14, 20],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 20 }
                    }
                },
                range: [14, 21],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 21 }
                }
            }],
            range: [0, 21],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 21 }
            },
            errors: [{
                index: 20,
                lineNumber: 1,
                column: 21,
                message: 'Error: Line 1: Prefix increment/decrement may not have eval or arguments operand in strict mode'
            }]
        },

        '"use strict"; arguments = 0;': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'Identifier',
                        name: 'arguments',
                        range: [14, 23],
                        loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 23 }
                        }
                    },
                    right: {
                        type: 'Literal',
                        value: 0,
                        raw: '0',
                        range: [26, 27],
                        loc: {
                            start: { line: 1, column: 26 },
                            end: { line: 1, column: 27 }
                        }
                    },
                    range: [14, 27],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 27 }
                    }
                },
                range: [14, 28],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 28 }
                }
            }],
            range: [0, 28],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 28 }
            },
            errors: [{
                index: 14,
                lineNumber: 1,
                column: 15,
                message: 'Error: Line 1: Assignment to eval or arguments is not allowed in strict mode'
            }]
        },

        '"use strict"; arguments--;': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UpdateExpression',
                    operator: '--',
                    argument: {
                        type: 'Identifier',
                        name: 'arguments',
                        range: [14, 23],
                        loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 23 }
                        }
                    },
                    prefix: false,
                    range: [14, 25],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 25 }
                    }
                },
                range: [14, 26],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 26 }
                }
            }],
            range: [0, 26],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 26 }
            },
            errors: [{
                index: 23,
                lineNumber: 1,
                column: 24,
                message: 'Error: Line 1: Postfix increment/decrement may not have eval or arguments operand in strict mode'
            }]
        },

        '"use strict"; ++arguments;': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    argument: {
                        type: 'Identifier',
                        name: 'arguments',
                        range: [16, 25],
                        loc: {
                            start: { line: 1, column: 16 },
                            end: { line: 1, column: 25 }
                        }
                    },
                    prefix: true,
                    range: [14, 25],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 25 }
                    }
                },
                range: [14, 26],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 26 }
                }
            }],
            range: [0, 26],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 26 }
            },
            errors: [{
                index: 25,
                lineNumber: 1,
                column: 26,
                message: 'Error: Line 1: Prefix increment/decrement may not have eval or arguments operand in strict mode'
            }]
        },


        '"use strict";x={y:1,y:1}': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [13, 14],
                        loc: {
                            start: { line: 1, column: 13 },
                            end: { line: 1, column: 14 }
                        }
                    },
                    right: {
                        type: 'ObjectExpression',
                        properties: [{
                            type: 'Property',
                            key: {
                                type: 'Identifier',
                                name: 'y',
                                range: [16, 17],
                                loc: {
                                    start: { line: 1, column: 16 },
                                    end: { line: 1, column: 17 }
                                }
                            },
                            value: {
                                type: 'Literal',
                                value: 1,
                                raw: '1',
                                range: [18, 19],
                                loc: {
                                    start: { line: 1, column: 18 },
                                    end: { line: 1, column: 19 }
                                }
                            },
                            kind: 'init',
                            range: [16, 19],
                            loc: {
                                start: { line: 1, column: 16 },
                                end: { line: 1, column: 19 }
                            }
                        }, {
                            type: 'Property',
                            key: {
                                type: 'Identifier',
                                name: 'y',
                                range: [20, 21],
                                loc: {
                                    start: { line: 1, column: 20 },
                                    end: { line: 1, column: 21 }
                                }
                            },
                            value: {
                                type: 'Literal',
                                value: 1,
                                raw: '1',
                                range: [22, 23],
                                loc: {
                                    start: { line: 1, column: 22 },
                                    end: { line: 1, column: 23 }
                                }
                            },
                            kind: 'init',
                            range: [20, 23],
                            loc: {
                                start: { line: 1, column: 20 },
                                end: { line: 1, column: 23 }
                            }
                        }],
                        range: [15, 24],
                        loc: {
                            start: { line: 1, column: 15 },
                            end: { line: 1, column: 24 }
                        }
                    },
                    range: [13, 24],
                    loc: {
                        start: { line: 1, column: 13 },
                        end: { line: 1, column: 24 }
                    }
                },
                range: [13, 24],
                loc: {
                    start: { line: 1, column: 13 },
                    end: { line: 1, column: 24 }
                }
            }],
            range: [0, 24],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 24 }
            },
            errors: [{
                index: 23,
                lineNumber: 1,
                column: 24,
                message: 'Error: Line 1: Duplicate data property in object literal not allowed in strict mode'
            }]
        },

        '"use strict"; function eval() {};': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'FunctionDeclaration',
                id: {
                    type: 'Identifier',
                    name: 'eval',
                    range: [23, 27],
                    loc: {
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 27 }
                    }
                },
                params: [],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [30, 32],
                    loc: {
                        start: { line: 1, column: 30 },
                        end: { line: 1, column: 32 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [14, 32],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 32 }
                }
            }, {
                type: 'EmptyStatement',
                range: [32, 33],
                loc: {
                    start: { line: 1, column: 32 },
                    end: { line: 1, column: 33 }
                }
            }],
            range: [0, 33],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 33 }
            },
            errors: [{
                index: 23,
                lineNumber: 1,
                column: 24,
                message: 'Error: Line 1: Function name may not be eval or arguments in strict mode'
            }]
        },

        '"use strict"; function arguments() {};': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'FunctionDeclaration',
                id: {
                    type: 'Identifier',
                    name: 'arguments',
                    range: [23, 32],
                    loc: {
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 32 }
                    }
                },
                params: [],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [35, 37],
                    loc: {
                        start: { line: 1, column: 35 },
                        end: { line: 1, column: 37 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [14, 37],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 37 }
                }
            }, {
                type: 'EmptyStatement',
                range: [37, 38],
                loc: {
                    start: { line: 1, column: 37 },
                    end: { line: 1, column: 38 }
                }
            }],
            range: [0, 38],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 38 }
            },
            errors: [{
                index: 23,
                lineNumber: 1,
                column: 24,
                message: 'Error: Line 1: Function name may not be eval or arguments in strict mode'
            }]
        },

        '"use strict"; function interface() {};': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'FunctionDeclaration',
                id: {
                    type: 'Identifier',
                    name: 'interface',
                    range: [23, 32],
                    loc: {
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 32 }
                    }
                },
                params: [],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [35, 37],
                    loc: {
                        start: { line: 1, column: 35 },
                        end: { line: 1, column: 37 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [14, 37],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 37 }
                }
            }, {
                type: 'EmptyStatement',
                range: [37, 38],
                loc: {
                    start: { line: 1, column: 37 },
                    end: { line: 1, column: 38 }
                }
            }],
            range: [0, 38],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 38 }
            },
            errors: [{
                index: 23,
                lineNumber: 1,
                column: 24,
                message: 'Error: Line 1: Use of future reserved word in strict mode'
            }]
        },

        '"use strict"; (function eval() {});': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'eval',
                        range: [24, 28],
                        loc: {
                            start: { line: 1, column: 24 },
                            end: { line: 1, column: 28 }
                        }
                    },
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [31, 33],
                        loc: {
                            start: { line: 1, column: 31 },
                            end: { line: 1, column: 33 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [15, 33],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 33 }
                    }
                },
                range: [14, 35],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 35 }
                }
            }],
            range: [0, 35],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 35 }
            },
            errors: [{
                index: 24,
                lineNumber: 1,
                column: 25,
                message: 'Error: Line 1: Function name may not be eval or arguments in strict mode'
            }]
        },

        '"use strict"; (function arguments() {});': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'arguments',
                        range: [24, 33],
                        loc: {
                            start: { line: 1, column: 24 },
                            end: { line: 1, column: 33 }
                        }
                    },
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [36, 38],
                        loc: {
                            start: { line: 1, column: 36 },
                            end: { line: 1, column: 38 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [15, 38],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 38 }
                    }
                },
                range: [14, 40],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 40 }
                }
            }],
            range: [0, 40],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 40 }
            },
            errors: [{
                index: 24,
                lineNumber: 1,
                column: 25,
                message: 'Error: Line 1: Function name may not be eval or arguments in strict mode'
            }]
        },

        '"use strict"; (function interface() {});': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'interface',
                        range: [24, 33],
                        loc: {
                            start: { line: 1, column: 24 },
                            end: { line: 1, column: 33 }
                        }
                    },
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [36, 38],
                        loc: {
                            start: { line: 1, column: 36 },
                            end: { line: 1, column: 38 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [15, 38],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 38 }
                    }
                },
                range: [14, 40],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 40 }
                }
            }],
            range: [0, 40],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 40 }
            },
            errors: [{
                index: 24,
                lineNumber: 1,
                column: 25,
                message: 'Error: Line 1: Use of future reserved word in strict mode'
            }]
        },

        '"use strict"; function f(eval) {};': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'FunctionDeclaration',
                id: {
                    type: 'Identifier',
                    name: 'f',
                    range: [23, 24],
                    loc: {
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 24 }
                    }
                },
                params: [{
                    type: 'Identifier',
                    name: 'eval',
                    range: [25, 29],
                    loc: {
                        start: { line: 1, column: 25 },
                        end: { line: 1, column: 29 }
                    }
                }],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [31, 33],
                    loc: {
                        start: { line: 1, column: 31 },
                        end: { line: 1, column: 33 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [14, 33],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 33 }
                }
            }, {
                type: 'EmptyStatement',
                range: [33, 34],
                loc: {
                    start: { line: 1, column: 33 },
                    end: { line: 1, column: 34 }
                }
            }],
            range: [0, 34],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 34 }
            },
            errors: [{
                index: 25,
                lineNumber: 1,
                column: 26,
                message: 'Error: Line 1: Parameter name eval or arguments is not allowed in strict mode'
            }]
        },

        '"use strict"; function f(arguments) {};': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'FunctionDeclaration',
                id: {
                    type: 'Identifier',
                    name: 'f',
                    range: [23, 24],
                    loc: {
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 24 }
                    }
                },
                params: [{
                    type: 'Identifier',
                    name: 'arguments',
                    range: [25, 34],
                    loc: {
                        start: { line: 1, column: 25 },
                        end: { line: 1, column: 34 }
                    }
                }],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [36, 38],
                    loc: {
                        start: { line: 1, column: 36 },
                        end: { line: 1, column: 38 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [14, 38],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 38 }
                }
            }, {
                type: 'EmptyStatement',
                range: [38, 39],
                loc: {
                    start: { line: 1, column: 38 },
                    end: { line: 1, column: 39 }
                }
            }],
            range: [0, 39],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 39 }
            },
            errors: [{
                index: 25,
                lineNumber: 1,
                column: 26,
                message: 'Error: Line 1: Parameter name eval or arguments is not allowed in strict mode'
            }]
        },

        '"use strict"; function f(foo,  foo) {};': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'FunctionDeclaration',
                id: {
                    type: 'Identifier',
                    name: 'f',
                    range: [23, 24],
                    loc: {
                        start: { line: 1, column: 23 },
                        end: { line: 1, column: 24 }
                    }
                },
                params: [{
                    type: 'Identifier',
                    name: 'foo',
                    range: [25, 28],
                    loc: {
                        start: { line: 1, column: 25 },
                        end: { line: 1, column: 28 }
                    }
                }, {
                    type: 'Identifier',
                    name: 'foo',
                    range: [31, 34],
                    loc: {
                        start: { line: 1, column: 31 },
                        end: { line: 1, column: 34 }
                    }
                }],
                defaults: [],
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [36, 38],
                    loc: {
                        start: { line: 1, column: 36 },
                        end: { line: 1, column: 38 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [14, 38],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 38 }
                }
            }, {
                type: 'EmptyStatement',
                range: [38, 39],
                loc: {
                    start: { line: 1, column: 38 },
                    end: { line: 1, column: 39 }
                }
            }],
            range: [0, 39],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 39 }
            },
            errors: [{
                index: 31,
                lineNumber: 1,
                column: 32,
                message: 'Error: Line 1: Strict mode function may not have duplicate parameter names'
            }]
        },

        '"use strict"; (function f(eval) {});': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'f',
                        range: [24, 25],
                        loc: {
                            start: { line: 1, column: 24 },
                            end: { line: 1, column: 25 }
                        }
                    },
                    params: [{
                        type: 'Identifier',
                        name: 'eval',
                        range: [26, 30],
                        loc: {
                            start: { line: 1, column: 26 },
                            end: { line: 1, column: 30 }
                        }
                    }],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [32, 34],
                        loc: {
                            start: { line: 1, column: 32 },
                            end: { line: 1, column: 34 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [15, 34],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 34 }
                    }
                },
                range: [14, 36],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 36 }
                }
            }],
            range: [0, 36],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 36 }
            },
            errors: [{
                index: 26,
                lineNumber: 1,
                column: 27,
                message: 'Error: Line 1: Parameter name eval or arguments is not allowed in strict mode'
            }]
        },


        '"use strict"; (function f(arguments) {});': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'f',
                        range: [24, 25],
                        loc: {
                            start: { line: 1, column: 24 },
                            end: { line: 1, column: 25 }
                        }
                    },
                    params: [{
                        type: 'Identifier',
                        name: 'arguments',
                        range: [26, 35],
                        loc: {
                            start: { line: 1, column: 26 },
                            end: { line: 1, column: 35 }
                        }
                    }],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [37, 39],
                        loc: {
                            start: { line: 1, column: 37 },
                            end: { line: 1, column: 39 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [15, 39],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 39 }
                    }
                },
                range: [14, 41],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 41 }
                }
            }],
            range: [0, 41],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 41 }
            },
            errors: [{
                index: 26,
                lineNumber: 1,
                column: 27,
                message: 'Error: Line 1: Parameter name eval or arguments is not allowed in strict mode'
            }]
        },

        '"use strict"; (function f(foo,  foo) {});': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'f',
                        range: [24, 25],
                        loc: {
                            start: { line: 1, column: 24 },
                            end: { line: 1, column: 25 }
                        }
                    },
                    params: [{
                        type: 'Identifier',
                        name: 'foo',
                        range: [26, 29],
                        loc: {
                            start: { line: 1, column: 26 },
                            end: { line: 1, column: 29 }
                        }
                    }, {
                        type: 'Identifier',
                        name: 'foo',
                        range: [32, 35],
                        loc: {
                            start: { line: 1, column: 32 },
                            end: { line: 1, column: 35 }
                        }
                    }],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: [],
                        range: [37, 39],
                        loc: {
                            start: { line: 1, column: 37 },
                            end: { line: 1, column: 39 }
                        }
                    },
                    rest: null,
                    generator: false,
                    expression: false,
                    range: [15, 39],
                    loc: {
                        start: { line: 1, column: 15 },
                        end: { line: 1, column: 39 }
                    }
                },
                range: [14, 41],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 41 }
                }
            }],
            range: [0, 41],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 41 }
            },
            errors: [{
                index: 32,
                lineNumber: 1,
                column: 33,
                message: 'Error: Line 1: Strict mode function may not have duplicate parameter names'
            }]
        },

        '"use strict"; x = { set f(eval) {} }' : {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [14, 15],
                        loc: {
                            start: { line: 1, column: 14 },
                            end: { line: 1, column: 15 }
                        }
                    },
                    right: {
                        type: 'ObjectExpression',
                        properties: [{
                            type: 'Property',
                            key: {
                                type: 'Identifier',
                                name: 'f',
                                range: [24, 25],
                                loc: {
                                    start: { line: 1, column: 24 },
                                    end: { line: 1, column: 25 }
                                }
                            },
                            value : {
                                type: 'FunctionExpression',
                                id: null,
                                params: [{
                                    type: 'Identifier',
                                    name: 'eval',
                                    range: [26, 30],
                                    loc: {
                                        start: { line: 1, column: 26 },
                                        end: { line: 1, column: 30 }
                                    }
                                }],
                                defaults: [],
                                body: {
                                    type: 'BlockStatement',
                                    body: [],
                                    range: [32, 34],
                                    loc: {
                                        start: { line: 1, column: 32 },
                                        end: { line: 1, column: 34 }
                                    }
                                },
                                rest: null,
                                generator: false,
                                expression: false,
                                range: [32, 34],
                                loc: {
                                    start: { line: 1, column: 32 },
                                    end: { line: 1, column: 34 }
                                }
                            },
                            kind: 'set',
                            range: [20, 34],
                            loc: {
                                start: { line: 1, column: 20 },
                                end: { line: 1, column: 34 }
                            }
                        }],
                        range: [18, 36],
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 36 }
                        }
                    },
                    range: [14, 36],
                    loc: {
                        start: { line: 1, column: 14 },
                        end: { line: 1, column: 36 }
                    }
                },
                range: [14, 36],
                loc: {
                    start: { line: 1, column: 14 },
                    end: { line: 1, column: 36 }
                }
            }],
            range: [0, 36],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 36 }
            },
            errors: [{
                index: 26,
                lineNumber: 1,
                column: 27,
                message: 'Error: Line 1: Parameter name eval or arguments is not allowed in strict mode'
            }]
        },

        'function hello() { "octal directive\\1"; "use strict"; }': {
            type: 'Program',
            body: [{
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
                            type: 'Literal',
                            value: 'octal directive\u0001',
                            raw: '"octal directive\\1"',
                            range: [19, 38],
                            loc: {
                                start: { line: 1, column: 19 },
                                end: { line: 1, column: 38 }
                            }
                        },
                        range: [19, 39],
                        loc: {
                            start: { line: 1, column: 19 },
                            end: { line: 1, column: 39 }
                        }
                    }, {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'Literal',
                            value: 'use strict',
                            raw: '"use strict"',
                            range: [40, 52],
                            loc: {
                                start: { line: 1, column: 40 },
                                end: { line: 1, column: 52 }
                            }
                        },
                        range: [40, 53],
                        loc: {
                            start: { line: 1, column: 40 },
                            end: { line: 1, column: 53 }
                        }
                    }],
                    range: [17, 55],
                    loc: {
                        start: { line: 1, column: 17 },
                        end: { line: 1, column: 55 }
                    }
                },
                rest: null,
                generator: false,
                expression: false,
                range: [0, 55],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 55 }
                }
            }],
            range: [0, 55],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 55 }
            },
            errors: [{
                index: 19,
                lineNumber: 1,
                column: 20,
                message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
            }]
        },

        '"\\1"; \'use strict\';': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: '\u0001',
                    raw: '"\\1"',
                    range: [0, 4],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 4 }
                    }
                },
                range: [0, 5],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 5 }
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '\'use strict\'',
                    range: [6, 18],
                    loc: {
                        start: { line: 1, column: 6 },
                        end: { line: 1, column: 18 }
                    }
                },
                range: [6, 19],
                loc: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 19 }
                }
            }],
            range: [0, 19],
            loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 19 }
            },
            errors: [{
                index: 0,
                lineNumber: 1,
                column: 1,
                message: 'Error: Line 1: Octal literals are not allowed in strict mode.'
            }]
        },

        '"use strict"; var x = { 014: 3}': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                    raw: '"use strict"',
                    range: [0, 12],
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 12 }
                    }
                },
                range: [0, 13],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 13 }
                }
            }, {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x',
                        range: [18, 19],
                        loc: {
                            start: { line: 1, column: 18 },
                            end: { line: 1, column: 19 }
                        }
                    },
                    init: {
                        type: 'ObjectExpression',
                        properties: [{
                            type: 'Property',
                            key: {
                                type: 'Literal',
                                value: 12,
                                raw: '014',
                                range: [24, 27],
                                loc: {
                                    start: { line: 1, column: 24 },
                                    end: { line: 1, column: 27 }
                                }
                            },
                            value: {
                                type: 'Literal',
                                value: 3,
                                raw: '3',
                                range: [29, 30],
                                loc: {
                                    start: { line: 1, column: 29 },
                                    end: { line: 1, column: 30 }
                                }
                            },
                            kind: 'init',
                            range: [24, 30],
                            loc: {
                                start: { line: 1, column: 24 },
                                end: { line: 1, column: 30 }
                            }
                        }],
                        range: [22, 31],
                        loc: {
                            start: { li