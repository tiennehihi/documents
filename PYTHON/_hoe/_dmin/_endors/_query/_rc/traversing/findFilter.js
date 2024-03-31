getLocationRange: function(start, end, filename) {
            this.ensureLinesAndColumnsComputed();

            return {
                source: filename,
                start: {
                    offset: this.startOffset + start,
                    line: this.lines[start],
                    column: this.columns[start]
                },
                end: {
                    offset: this.startOffset + end,
                    line: this.lines[end],
                    column: this.columns[end]
                }
            };
        }
    };

    var OffsetToLocation_1 = OffsetToLocation;

    var TYPE$7 = tokenizer.TYPE;
    var WHITESPACE$2 = TYPE$7.WhiteSpace;
    var COMMENT$2 = TYPE$7.Comment;

    var sequence = function readSequence(recognizer) {
        var children = this.createList();
        var child = null;
        var context = {
            recognizer: recognizer,
            space: null,
            ignoreWS: false,
            ignoreWSAfter: false
        };

        this.scanner.skipSC();

        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case COMMENT$2:
                    this.scanner.next();
                    continue;

                case WHITESPACE$2:
                    if (context.ignoreWS) {
                        this.scanner.next();
                    } else {
                        context.space = this.WhiteSpace();
                    }
                    continue;
            }

            child = recognizer.getNode.call(this, context);

            if (child === undefined) {
                break;
            }

            if (context.space !== null) {
                children.push(context.space);
                context.space = null;
            }

            children.push(child);

            if (context.ignoreWSAfter) {
                context.ignoreWSAfter = false;
                context.ignoreWS = true;
            } else {
                context.ignoreWS = false;
            }
        }

        return children;
    };

    var { findWhiteSpaceStart: findWhiteSpaceStart$1, cmpStr: cmpStr$4 } = utils;

    var noop$2 = function() {};

    var TYPE$8 = _const.TYPE;
    var NAME$2 = _const.NAME;
    var WHITESPACE$3 = TYPE$8.WhiteSpace;
    var COMMENT$3 = TYPE$8.Comment;
    var IDENT$2 = TYPE$8.Ident;
    var FUNCTION = TYPE$8.Function;
    var URL = TYPE$8.Url;
    var HASH = TYPE$8.Hash;
    var PERCENTAGE = TYPE$8.Percentag