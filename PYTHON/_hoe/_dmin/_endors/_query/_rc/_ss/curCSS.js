null, new Error('Matching for a tree with var() is not supported'));
        }

        if (useCommon) {
            result = matchAsTree$1(tokens, lexer.valueCommonSyntax, lexer);
        }

        if (!useCommon || !result.match) {
            result = matchAsTree$1(tokens, syntax.match, lexer);
            if (!result.match) {
                return buildMatchResult(
                    null,
                    new SyntaxMatchError$1(result.reason, syntax.syntax, value, result),
                    result.iterations
                );
            }
        }

        return buildMatchResult(result.match, null, result.iterations);
    }

    var Lexer = function(config, syntax, structure) {
        this.valueCommonSyntax = cssWideKeywords$1;
        this.syntax = syntax;
        this.generic = false;
        this.atrules = {};
        this.properties = {};
        this.types = {};
        this.structure = structure || getStructureFromConfig(config);

        if (config) {
            if (config.types) {
                for (var name in config.types) {
                    this.addType_(name, config.types[name]);
                }
            }

            if (config.generic) {
                this.generic = true;
                for (var name in generic) {
                    this.addType_(name, generic[name]);
                }
            }

            if (config.atrules) {
                for (var name in config.atrules) {
                    this.addAtrule_(name, config.atrules[name]);
                }
            }

            if (config.properties) {
                for (var name in config.properties) {
          