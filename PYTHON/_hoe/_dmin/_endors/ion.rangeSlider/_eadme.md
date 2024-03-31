      tokenizer.error('Expect a keyword');
        }

        return tokenizer.substringToPos(end);
    }

    function scanNumber(tokenizer) {
        var end = tokenizer.pos;

        for (; end < tokenizer.str.length; end++) {
            var code = tokenizer.str.charCodeAt(end);
            if (code < 48 || code > 57) {
                break;
            }
        }

        if (tokenizer.pos === end) {
            tokenizer.error('Expect a number');
        }

        return tokenizer.substringToPos(end);
    }

    function scanString(tokenizer) {
        var end = tokenizer.str.indexOf('\'', tokenizer.pos + 1);

        if (end === -1) {
            tokenizer.pos = tokenizer.str.length;
            tokenizer.error('Expect an apostrophe');
        }

        return tokenizer.substringToPos(end + 1);
    }

    function readMultiplierRange(tokenizer) {
        var min = null;
        var max = null;

        tokenizer.eat(LEFTCURLYBRACKET);

        min = scanNumber(tokenizer);

        if (tokenizer.charCode() === COMMA) {
            tokenizer.pos++;
            if (tokenizer.charCode() !== RIGHTCURLYBRACKET) {
                max = scanNumber(tokenizer);
            }
        } else {
            max = min;
        }

        tokenizer.eat(RIGHTCURLYBRACKET);

        return {
            min: Number(min),
            max: max ? Number(max) : 0
        };
    }

    function readMultiplier(tokenizer) {
        var range = null;
        var comma = false;

        switch (tokenizer.charCode()) {
            case ASTERISK:
                tokenizer.pos++;

                range = {
                    min: 0,
                    max: 0
                };

                break;

            case PLUSSIGN$2:
                tokenizer.pos++;

                range = {
                    min: 1,
                    max: 0
                };

                break;

            case QUESTIONMARK$1:
                tokenizer.pos++;

                range = {
                    min: 0,
                    max: 1
                };

                break;

            case NUMBERSIGN:
                tokenizer.pos++;

                comma = true;

                if (tokenizer.charCode() === LEFTCURLYBRACKET) {
                    range = readMultiplierRange(tokenizer);
                } else {
                    range = {
                        min: 1,
                        max: 0
                    };
                }

                break;

            case LEFTCURLYBRACKET:
                range = readMultiplierRange(tokenizer);
                break;

            default:
                return null;
        }

        return {
            type: 'Multiplier',
            comma: comma,
            min: range.min,
            max: range.max,
            term: null
        };
    }

    function maybeMultiplied(tokenizer, node) {
        var multiplier = readMultiplier(tokenizer);

        if (multiplier !== null) {
            multiplier.term = node;
            return multiplier;
        }

        return node;
    }

    function maybeToken(tokenizer) {
        var ch = tokenizer.peek();

        if (ch === '') {
            return null;
        }

        return {
            type: 'Token',
            value: ch
        };
    }

    function readProperty(tokenizer) {
        var name;

        tokenizer.eat(LESSTHANSIGN);
        tokenizer.eat(APOSTROPHE);

        name = scanWord(tokenizer);

        tokenizer.eat(APOSTROPHE);
        tokenizer.eat(GREATERTHANSIGN);

        return maybeMultiplied(tokenizer, {
            type: 'Property',
            name: name
        });
    }

    // https://drafts.csswg.org/css-values-3/#numeric-ranges
    // 4.1. Range Restrictions and Range Definition Notation
    //
    // Range restrictions can be annotated in the numeric type notation using CSS bracketed
    // range notation—[min,max]—within the angle brackets, after the identifying keyword,
    // indicating a closed range between (and including) min and max.
    // For example, <integer [0, 10]> indicates an integer between 0 and 10, inclusive.
    function readTypeRange(tokenizer) {
        // use null for Infinity to make AST format JSON serializable/deserializable
        var min = null; // -Infinity
        var max = null; // Infinity
        var sign = 1;

        tokenizer.eat(LEFTSQUAREBRACKET);

        if (tokenizer.charCode() === HYPERMINUS) {
            tokenizer.peek();
            sign = -1;
        }

        if (sign == -1 && tokenizer.charCode() === INFINITY) {
            tokenizer.peek();
        } else {
            min = sign * Number(scanNumber(tokenizer));
        }

        scanSpaces(tokenizer);
        tokenizer.eat(COMMA);
        scanSpaces(tokenizer);

        if (tokenizer.charCode() === INFINITY) {
            tokenizer.peek();
        } else {
            sign = 1;

            if (tokenizer.charCode() === HYPERMINUS) {
                tokenizer.peek();
                sign = -1;
            }

            max = sign * Number(scanNumber(tokenizer));
        }

        tokenizer.eat(RIGHTSQUAREBRACKET);

        // If no range is indicated, either by using the bracketed range notation
        // or in the property description, then [−∞,∞] is assumed.
        if (min === null && max === null) {
            return null;
        }

        return {
            type: 'Range',
            min: min,
            max: max
        };
    }

    function readType(tokenizer) {
        var name;
        var opts = null;

        tokenizer.eat(LESSTHANSIGN);
        name = scanWord(tokenizer);

        if (tokenizer.charCode() === LEFTPARENTHESIS &&
            tokenizer.nextCharCode() === RIGHTPARENTHESIS) {
            tokenizer.pos += 2;
            name += '()';
        }

        if (tokenizer.charCodeAt(tokenizer.findWsEnd(tokenizer.pos)) === LEFTSQUAREBRACKET) {
            scanSpaces(tokenizer);
            opts = readTypeRange(tokenizer);
        }

        tokenizer.eat(GREATERTHANSIGN);

        return maybeMultiplied(tokenizer, {
            type: 'Type',
            name: name,
            opts: opts
        });
    }

    function readKeywordOrFunction(tokenizer) {
        var name;

        name = scanWord(tokenizer);

        if (tokenizer.charCode() === LEFTPARENTHESIS) {
            tokenizer.pos++;

            return {
                type: 'Function',
                name: name
            };
        }

        return maybeMultiplied(tokenizer, {
            type: 'Keyword',
            name: name
        });
    }

    function regroupTerms(terms, combinators) {
        function createGroup(terms, combinator) {
            return {
                type: 'Group',
                terms: terms,
                combinator: combinator,
                disallowEmpty: false,
                explicit: false
            };
        }

        combinators = Object.keys(combinators).sort(function(a, b) {
            return COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b];
        });

        while (combinators.length > 0) {
            var combinator = combinators.shift();
            for (var i = 0, subgroupStart = 0; i < terms.length; i++) {
                var term = terms[i];
                if (term.type === 'Combinator') {
                    if (term.value === combinator) {
                        if (subgroupStart === -1) {
                            subgroupStart = i - 1;
                        }
                        terms.splice(i, 1);
                        i--;
                    } else {
                        if (subgroupStart !== -1 && i - subgroupStart > 1) {
                            terms.splice(
                                subgroupStart,
                                i - subgroupStart,
                                createGroup(terms.slice(subgroupStart, i), combinator)
                            );
                            i = subgroupStart + 1;
                        }
                        subgroupStart = -1;
                    }
                }
            }

            if (subgroupStart !== -1 && combinators.length) {
                terms.splice(
                    subgroupStart,
                    i - subgroupStart,
                    createGroup(terms.slice(subgroupStart, i), combinator)
                );
            }
        }

        return combinator;
    }

    function readImplicitGroup(tokenizer) {
        var terms = [];
        var combinators = {};
        var token;
        var prevToken = null;
        var prevTokenPos = tokenizer.pos;

        while (token = peek(tokenizer)) {
            if (token.type !== 'Spaces') {
                if (token.type === 'Combinator') {
                    // check for combinator in group beginning and double combinator sequence
                    if (prevToken === null || prevToken.type === 'Combinator') {
                        tokenizer.pos = prevTokenPos;
                        tokenizer.error('Unexpected combinator');
                    }

                    combinators[token.value] = true;
                } else if (prevToken !== null && prevToken.type !== 'Combinator') {
                    combinators[' '] = true;  // a b
                    terms.push({
                        type: 'Combinator',
                        value: ' '
                    });
                }

                terms.push(token);
                prevToken = token;
                prevTokenPos = tokenizer.pos;
            }
        }

        // check for combinator in group ending
        if (prevToken !== null && prevToken.type === 'Combinator') {
            tokenizer.pos -= prevTokenPos;
            tokenizer.error('Unexpected combinator');
        }

        return {
            type: 'Group',
            terms: terms,
            combinator: regroupTerms(terms, combinators) || ' ',
            disallowEmpty: false,
            explicit: false
        };
    }

    function readGroup(tokenizer) {
        var result;

        tokenizer.eat(LEFTSQUAREBRACKET);
        result = readImplicitGroup(tokenizer);
        tokenizer.eat(RIGHTSQUAREBRACKET);

        result.explicit = true;

        if (tokenizer.charCode() === EXCLAMATIONMARK) {
            tokenizer.pos++;
            result.disallowEmpty = true;
        }

        return result;
    }

    function peek(tokenizer) {
        var code = tokenizer.charCode();

        if (code < 128 && NAME_CHAR[code] === 1) {
            return readKeywordOrFunction(tokenizer);
        }

        switch (code) {
            case RIGHTSQUAREBRACKET:
                // don't eat, stop scan a group
                break;

            case LEFTSQUAREBRACKET:
                return maybeMultiplied(tokenizer, readGroup(tokenizer));

            case LESSTHANSIGN:
                return tokenizer.nextCharCode() === APOSTROPHE
                    ? readProperty(tokenizer)
                    : readType(tokenizer);

            case VERTICALLINE:
                return {
                    type: 'Combinator',
                    value: tokenizer.substringToPos(
                        tokenizer.nextCharCode() === VERTICALLINE
                            ? tokenizer.pos + 2
                            : tokenizer.pos + 1
                    )
                };

            case AMPERSAND:
                tokenizer.pos++;
                tokenizer.eat(AMPERSAND);

                return {
                    type: 'Combinator',
                    value: '&&'
                };

            case COMMA:
                tokenizer.pos++;
                return {
                    type: 'Comma'
                };

            case APOSTROPHE:
                return maybeMultiplied(tokenizer, {
                    type: 'String',
                    value: scanString(tokenizer)
                });

            case SPACE$1:
            case TAB$1:
            case N$2:
            case R$1:
            case F$1:
                return {
                    type: 'Spaces',
                    value: scanSpaces(tokenizer)
                };

            case COMMERCIALAT:
                code = tokenizer.nextCharCode();

                if (code < 128 && NAME_CHAR[code] === 1) {
                    tokenizer.pos++;
                    return {
                        type: 'AtKeyword',
                        name: scanWord(tokenizer)
                    };
                }

                return maybeToken(tokenizer);

            case ASTERISK:
            case PLUSSIGN$2:
            case QUESTIONMARK$1:
            case NUMBERSIGN:
            case EXCLAMATIONMARK:
                // prohibited tokens (used as a multiplier start)
                break;

            case LEFTCURLYBRACKET:
                // LEFTCURLYBRACKET is allowed since mdn/data uses it w/o quoting
                // check next char isn't a number, because it's likely a disjoined multiplier
                code = tokenizer.nextCharCode();

                if (code < 48 || code > 57) {
                    return maybeToken(tokenizer);
                }

                break;

            default:
                return maybeToken(tokenizer);
        }
    }

    function parse(source) {
        var tokenizer = new tokenizer$1(source);
        var result = readImplicitGroup(tokenizer);

        if (tokenizer.pos !== source.length) {
            tokenizer.error('Unexpected input');
        }

        // reduce redundant groups with single group term
        if (result.terms.length === 1 && result.terms[0].type === 'Group') {
            result = result.terms[0];
        }

        return result;
    }

    // warm up parse to elimitate code branches that never execute
    // fix soft deoptimizations (insufficient type feedback)
    parse('[a&&<b>#|<\'c\'>*||e() f{2} /,(% g#{1,2} h{2,})]!');

    var parse_1 = parse;

    var noop$1 = function() {};

    function ensureFunction(value) {
        return typeof value === 'function' ? value : noop$1;
    }

    var walk = function(node, options, context) {
        function walk(node) {
            enter.call(context, node);

            switch (node.type) {
                case 'Group':
                    node.terms.forEach(walk);
                    break;

                case 'Multiplier':
                    walk(node.term);
                    break;

                case 'Type':
                case 'Property':
                case 'Keyword':
                case 'AtKeyword':
                case 'Function':
                case 'String':
                case 'Token':
                case 'Comma':
                    break;

                default:
                    throw new Error('Unknown type: ' + node.type);
            }

            leave.call(context, node);
        }

        var enter = noop$1;
        var leave = noop$1;

        if (typeof options === 'function') {
            enter = options;
        } else if (options) {
            enter = ensureFunction(options.enter);
            leave = ensureFunction(options.leave);
        }

        if (enter === noop$1 && leave === noop$1) {
            throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
        }

        walk(node);
    };

    var tokenStream = new TokenStream_1();
    var astToTokens = {
        decorator: function(handlers) {
            var curNode = null;
            var prev = { len: 0, node: null };
            var nodes = [prev];
            var buffer = '';

            return {
                children: handlers.children,
                node: function(node) {
                    var tmp = curNode;
                    curNode = node;
                    handlers.node.call(this, node);
                    curNode = tmp;
                },
                chunk: function(chunk) {
                    buffer += chunk;
                    if (prev.node !== curNode) {
                        nodes.push({
                            len: chunk.length,
                            node: curNode
                        });
                    } else {
                        prev.len += chunk.length;
                    }
                },
                result: function() {
                    return prepareTokens(buffer, nodes);
           /*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import '../_version.js';

/**
 * This is a utility method that determines whether the current browser supports
 * the features required to create streamed responses. Currently, it checks if
 * [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream)
 * is available.
 *
 * @private
 * @param {HeadersInit} [headersInit] If there's no `Content-Type` specified,
 * `'text/html'` will be used by default.
 * @return {boolean} `true`, if the current browser meets the requirements for
 * streaming responses, and `false` otherwise.
 *
 * @memberof workbox-streams
 */
function createHeaders(headersInit = {}): Headers {
  // See https://github.com/GoogleChrome/workbox/issues/1461
  const headers = new Headers(headersInit);
  if (!headers.has('content-type')) {
    headers.set('content-type', 'text/html');
  }
  return headers;
}

export {createHea