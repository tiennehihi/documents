const util = require('./util')

let source
let parseState
let stack
let pos
let line
let column
let token
let key
let root

module.exports = function parse (text, reviver) {
    source = String(text)
    parseState = 'start'
    stack = []
    pos = 0
    line = 1
    column = 0
    token = undefined
    key = undefined
    root = undefined

    do {
        token = lex()

        // This code is unreachable.
        // if (!parseStates[parseState]) {
        //     throw invalidParseState()
        // }

        parseStates[parseState]()
    } while (token.type !== 'eof')

    if (typeof reviver === 'function') {
        return internalize({'': root}, '', reviver)
    }

    return root
}

function internalize (holder, name, reviver) {
    const value = holder[name]
    if (value != null && typeof value === 'object') {
        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                const key = String(i)
                const replacement = internalize(value, key, reviver)
                if (replacement === undefined) {
                    delete value[key]
                } else {
                    Object.defineProperty(value, key, {
                        value: replacement,
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    })
                }
            }
        } else {
            for (const key in value) {
                const replacement = internalize(value, key, reviver)
                if (replacement === undefined) {
                    delete value[key]
                } else {
                    Object.defineProperty(value, key, {
                        value: replacement,
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    })
                }
            }
        }
    }

    return reviver.call(holder, name, value)
}

let lexState
let buffer
let doubleQuote
let sign
let c

function lex () {
    lexState = 'default'
