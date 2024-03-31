  .slice(0, -1)
                    // `BigInt` doesn't accept numeric separator
                    // and `bigint` property should not include numeric separator
                    .replace(/_/g, '');
                const value = typeof BigInt !== 'undefined' ? BigInt(bigint) : null;
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.Literal,
                    raw: rawValue,
                    value: value,
                    bigint: value == null ? bigint : String(value),
                    range,
                });
            }
            case SyntaxKind.RegularExpressionLiteral: {
                const pattern = node.text.slice(1, node.text.lastIndexOf('/'));
                const flags = node.text.slice(node.text.lastIndexOf('/') + 1);
                let regex = null;
                try {
                    regex = new RegExp(pattern, flags);
                }
                catch (exception) {
                    regex = null;
                }
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.Literal,
                    value: regex,
                    raw: node.text,
                    regex: {
                        pattern,
                        flags,
                    },
                });
            }
            case SyntaxKind.TrueKeyword:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.Literal,
                    value: true,
                    raw: 'true',
                });
            case SyntaxKind.FalseKeyword:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.Literal,
                    value: false,
                    raw: 'false',
                });
            case SyntaxKind.NullKeyword: {
                if (!version_check_1.typescriptVersionIsAtLeast['4.0'] && this.inTypeMode) {
                    // 4.0 started nesting null types inside a LiteralType node, but we still need to support pre-4.0
                    return this.createNode(node, {
                        type: ts_estree_1.AST_NODE_TYPES.TSNullKeyword,
                    });
                }
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.Literal,
                    value: null,
                    raw: 'null',
                });
            }
            case SyntaxKind.EmptyStatement:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.EmptyStatement,
                });
            case SyntaxKind.DebuggerStatement:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.DebuggerStatement,
                });
            // JSX
            case SyntaxKind.JsxElement:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.JSXElement,
                    openingElement: this.convertChild(node.openingElement),
                    closingElement: this.convertChild(node.closingElement),
                    children: node.children.map(el => this.convertChild(el)),
                });
            case SyntaxKind.JsxFragment:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.JSXFragment,
                    openingFragment: this.convertChild(node.openingFragment),
                    closingFragment: this.convertChild(node.closingFragment),
                    children: node.children.map(el => this.convertChild(el)),
                });
            case SyntaxKind.JsxSelfClosingElement: {
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.JSXElement,
                    /**
                     * Convert SyntaxKind.JsxSelfClosingElement to SyntaxKind.JsxOpeningElement,
                     * TypeScript does not seem to have the idea of openingElement when tag is self-closing
                     */
                    openingElement: this.createNode(node, {
                        type: ts_estree_1.AST_NODE_TYPES.JSXOpeningElement,
                        typeParameters: node.typeArguments
                            ? this.convertTypeArgumentsToTypeParameters(node.typeArguments, node)
                            : undefined,
                        selfClosing: true,
                        name: this.convertJSXTagName(node.tagName, node),
                        attributes: node.attributes.properties.map(el => this.convertChild(el)),
                        range: (0, node_utils_1.getRange)(node, this.ast),
                    }),
                    closingElement: null,
                    children: [],
                });
            }
            case SyntaxKind.JsxOpeningElement:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.JSXOpeningElement,
                    typeParameters: node.typeArguments
                        ? this.convertTypeArgumentsToTypeParameters(node.typeArguments, node)
                        : undefined,
                    selfClosing: false,
                    name: this.convertJSXTagName(node.tagName, node),
                    attributes: node.attributes.properties.map(el => this.convertChild(el)),
                });
            case SyntaxKind.JsxClosingElement:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.JSXClosingElement,
                    name: this.convertJSXTagName(node.tagName, node),
                });
            case SyntaxKind.JsxOpeningFragment:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.JSXOpeningFragment,
                });
            case SyntaxKind.JsxClosingFragment:
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.JSXClosingFragment,
                });
            case SyntaxKind.JsxExpression: {
                const expression = node.expression
                    ? this.convertChild(node.expression)
                    : this.createNode(node, {
                        type: ts_estree_1.AST_NODE_TYPES.JSXEmptyExpression,
                        range: [node.getStart(this.ast) + 1, node.getEnd() - 1],
                    });
                if (node.dotDotDotToken) {
                    return this.createNode(node, {
                        type: ts_estree_1.AST_NODE_TYPES.JSXSpreadChild,
                        expression,
                    });
                }
                else {
                    return this.createNode(node, {
                        type: ts_estree_1.AST_NODE_TYPES.JSXExpressionContainer,
                        expression,
                    });
                }
            }
            case SyntaxKind.JsxAttribute: {
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.JSXAttribute,
                    name: this.convertJSXNamespaceOrIdentifier(node.name),
                    value: this.convertChild(node.initializer),
                });
            }
            case SyntaxKind.JsxText: {
                const start = node.getFullStart();
                const end = node.getEnd();
                const text = this.ast.text.slice(start, end);
                return this.createNode(node, {
                    type: ts_estree_1.AST_NODE_TYPES.JSXText,
                    value: (0, node_utils_1.unescapeStringLiteralText)(text),
                    raw: text,
                    range: [start, end],
                });
            }
            case SyntaxKind