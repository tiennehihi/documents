                 value: parse_1(syntax)
                            });

                            return descriptor.syntax;
                        }
                    });
                } else {
                    descriptor.syntax = syntax;
                }

                // lazy graph build on first access
                Object.defineProperty(descriptor, 'match', {
                    get: function() {
                        Object.defineProperty(descriptor, 'match', {
                            value: buildMatchGraph$1(descriptor.syntax, ref)
                        });

                        return descriptor.match;
                    }
                });
            }

            return descriptor;
        },
        addProperty_: function(name, syntax) {
            this.properties[name] = this.createDescriptor(syntax, 'Property', name);
        },
        addType_: function(name, syntax) {
            this.types[name] = this.createDescriptor(syntax, 'Type', name);

            if (syntax === generic['-ms-legacy-expression']) {
                this.valueCommonSyntax = cssWideKeywordsWithExpression;
            }
        },

        matchDeclaration: function(node) {
            if (node.type !== 'Declaration') {
                return buildMatchResult(null, new Error('Not a Declaration node'));
            }

            return this.matchProperty(node.property, node.value);
        },
        matchProperty: function(propertyName, value) {
            var property = names.property(propertyName);

            // don't match syntax for a custom property
            if (property.custom) {
                return buildMatchResult(null, new Error('Lexer matching doesn\'t applicable for custom properties'));
            }

            var propertySyntax = property.vendor
                ? this.getProperty(property.name) || this.getProperty(property.basename)
                : this.getProperty(property.name);

            if (!propertySyntax) {
                return buildMatchResult(null, new SyntaxReferenceError$1('Unknown property', propertyName));
            }

            return matchSyntax(this, propertySyntax, value, true);
        },
        matchType: function(typeName, value) {
            var typeSyntax = this.getType(typeName);

            if (!typeSyntax) {
                return buildMatchResult(null, new SyntaxReferenceError$1('Unknown type', typeName));
            }

            return matchSyntax(this, typeSyntax, value, false);
        },
        match: function(syntax, value) {
            if (typeof syntax !== 'string' && (!syntax || !syntax.type)) {
                return buildMatchResult(null, new SyntaxReferenceError$1('Bad syntax'));
            }

            if (typeof syntax === 'string' || !syntax.match) {
                syntax = this.createDescriptor(syntax, 'Type', 'anonymous');
            }

            return matchSyntax(this, syntax, value, false);
        },

        findValueFragments: function(propertyName, value, type, name) {
            return search.matchFragments(this, value, this.matchProperty(propertyName, value), type, name);
        },
        findDeclarationValueFragments: function(declaration, type, name) {
            return search.matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name);
        },
        findAllFragments: function(ast, type, name) {
            var result = [];

            this.syntax.walk(ast, {
                visit: 'Declaration',
                enter: function(declaration) {
                    result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name));
                }.bind(this)
            });

            return result;
        },

        getProperty: function(name) {
            return this.properties.hasOwnProperty(name) ? this.properties[name] : null;
        },
        getType: function(name) {
            return this.types.hasOwnProperty(name) ? this.types[name] : null;
        },

        validate: function() {
            function validate(syntax, name, broken, descriptor) {
                if (broken.hasOwnProperty(name)) {
                    return broken[name];
                }

                broken[name] = false;
                if (descriptor.syntax !== null) {
                    walk(descriptor.syntax, function(node) {
                        if (node.type !== 'Type' && node.type !== 'Property') {
                            r