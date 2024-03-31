    },
        parse: function() {
            var start = this.scanner.tokenStart;

            // TODO: check value is an ident
            this.eat(HASH$3);

            return {
                type: 'IdSelector',
                loc: this.getLocation(start, this.scanner.tokenStart),
                name: this.scanner.substrToCursor(start + 1)
            };
        },
        generate: function(node) {
            this.chunk('#');
            this.chunk(node.name);
        }
    };

    var TYPE$q = tokenizer.TYPE;

    var IDENT$9 = TYPE$q.Ident;
    var NUMBER$4 = TYPE$q.Number;
    var DIMENSION$4 = TYPE$q.Dimension