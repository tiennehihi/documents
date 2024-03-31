elector,
        Combinator: Combinator,
        Comment: Comment,
        Declaration: Declaration,
        DeclarationList: DeclarationList,
        Dimension: Dimension,
        Function: _Function,
        Hash: Hash,
        Identifier: Identifier,
        IdSelector: IdSelector,
        MediaFeature: MediaFeature,
        MediaQuery: MediaQuery,
        MediaQueryList: MediaQueryList,
        Nth: Nth,
        Number: _Number,
        Operator: Operator,
        Parentheses: Parentheses,
        Percentage: Percentage,
        PseudoClassSelector: PseudoClassSelector,
        PseudoElementSelector: PseudoElementSelector,
        Ratio: Ratio,
        Raw: Raw,
        Rule: Rule,
        Selector: Selector,
        SelectorList: SelectorList,
        String: _String,
        StyleSheet: StyleSheet,
        TypeSelector: TypeSelector,
        UnicodeRange: UnicodeRange,
        Url: Url,
        Value: Value,
        WhiteSpace: WhiteSpace$1
    };

    var lexer = {
        generic: true,
        types: data.types,
        atrules: data.atrules,
        properties: data.properties,
        node: node
    };

    var cmpChar$5 = tokenizer.cmpChar;
    var cmpStr$6 = tokenizer.cmpStr;
    var TYPE$D = tokenizer.TYPE;

    var IDENT$f = TYPE$D.Ident;
    var STRING$2 = TYPE$D.String;
    var NUMBER$8 = TYPE$D.Number;
    var FUNCTION$4 = TYPE$D.Function;
    var URL$2 = TYPE$D.Url;
    var HASH$4 = TYPE$D.Hash;
    var DIMENSION$6 = TYPE$D.Dimension;
    var PERCENTAGE$2 = TYPE$D.Percentage;
    var LEFTPARENTHESIS$5 = TYPE$D.LeftParenthesis;
    var LEFTSQUAREBRACKET$3 = TYPE$D.LeftSquareBracket;
    var COMMA$3 = TYPE$D.Comma;
    var DELIM$5 = TYPE$D.Delim;
    var NUMBERSIGN$3 = 0x0023;  // U+0023 NUMBER SIGN (#)
    var ASTERISK$5 = 0x002A;    // U+002A ASTERISK (*)
    var PLUSSIGN$7 = 0x002B;    // U+002B PLUS SIGN (+)
    var HYPHENMINUS$5 = 0x002D; // U+002D HYPHEN-MINUS (-)
    var SOLIDUS$4 = 0x002F;     // U+002F SOLIDUS (/)
    var U$2 = 0x0075;           // U+0075 LATIN SMALL LETTER U (u)

    var _default = function defaultRecognizer(context) {
        switch (this.scanner.tokenType) {
            case HASH$4:
                return this.Hash();

            case COMMA$3:
                context.space = null;
                context.ignoreWSAfter = true;
                return this.Operator();

            case LEFTPARENTHESIS$5:
                return this.Parentheses(this.readSequence, context.recognizer);

            case LEFTSQUAREBRACKET$3:
                return this.Brackets(this.readSequence, context.recognizer);

            case STRING$2:
                return this.String();

            case DIMENSION$6:
                return this.Dimension();

            case PERCENTAGE$2:
                return this.Percentage();

            case NUMBER$8:
                return this.Number();

            case FUNCTION$4:
                return cmpStr$6(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, 'url(')
                    ? this.Url()
                    : this.Function(this.readSequence, context.recognizer);

            case URL$2:
                return this.Url();

            case IDENT$f:
                // check for unicode range, it should start with u+ or U+
                if (cmpChar$5(this