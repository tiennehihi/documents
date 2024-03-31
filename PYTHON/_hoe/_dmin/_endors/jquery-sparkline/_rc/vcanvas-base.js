 (!res[name]) {
                                res[name] = {};
                            }
                            if (src[key] && src[key][name]) {
                                mix(res[name], src[key][name], innerShape);
                            }
                        }
                    }
                    dest[key] = res;
                }
            }
        }
        return dest;
    }

    var mix_1 = function(dest, src) {
        return mix(dest, src, shape);
    };

    function assign(dest, src) {
        for (var key in src) {
            dest[key] = src[key];
        }

        return dest;
    }

    function createSyntax(config) {
        var parse = create(config);
        var walk = create$3(config);
        var generate = create$1(config);
        var convert = create$2(walk);

        var syntax = {
            List: List_1,
            SyntaxError: _SyntaxError,
            TokenStream: TokenStream_1,
            Lexer: Lexer_1,

            vendorPrefix: names.vendorPrefix,
            keyword: names.keyword,
            property: names.property,
            isCustomProperty: names.isCustomProperty,

            definitionSyntax: definitionSyntax,
            lexer: null,
            createLexer: function(config) {
                return new Lexer_1(config, syntax, syntax.lexer.structure);
            },

            tokenize: tokenizer,
            parse: parse,
            walk: walk,
            generate: generate,

            find: walk.find,
            findLast: walk.findLast,
            findAll: walk.findAll,

            clone: clone,
            fromPlainObject: convert.fromPlainObject,
            toPlainObject: convert.toPlainObject,

            createSyntax: function(config) {
                return createSyntax(mix_1({}, config));
            },
            fork: function(extension) {
                var base = mix_1({}, config); // copy of config
                return createSyntax(
                    typeof extension === 'function'
                        ? extension(base, assign)
                        : mix_1(base, extension)
                );
            }
        };

        syntax.lexer = new Lexer_1({
            generic: true,
            types: config.types,
            properties: config.properties,
            node: config.node
        }, syntax);

        return syntax;
    }
    var create_1 = function(config) {
        return createSyntax(mix_1({}, config));
    };

    var create$4 = {
    	create: create_1
    };

    var generic$1 = true;
    var types = {
    	"absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large",
    	"alpha-value": "<number>|<percentage>",
    	"angle-percentage": "<angle>|<percentage>",
    	"angular-color-hint": "<angle-percentage>",
    	"angular-color-stop": "<color>&&<color-stop-angle>?",
    	"angular-color-stop-list": "[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>",
    	"animateable-feature": "scroll-position|contents|<custom-ident>",
    	attachment: "scroll|fixed|local",
    	"attr()": "attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )",
    	"attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
    	"attr-modifier": "i|s",
    	"attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
    	"auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
    	"auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
    	"baseline-position": "[first|last]? baseline",
    	"basic-shape": "<inset()>|<circle()>|<ellipse()>|<polygon()>",
    	"bg-image": "none|<image>",
    	"bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
    	"bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
    	"bg-size": "[<length-percentage>|auto]{1,2}|cover|contain",
    	"blur()": "blur( <length> )",
    	"blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|dif