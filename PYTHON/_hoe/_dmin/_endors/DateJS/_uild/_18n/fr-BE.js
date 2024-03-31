                 parent.id.type === "Identifier" &&
                        startsWithUpperCase(parent.id.name)
                    );

                /*
                 * e.g.
                 *   var foo = function foo() { ... }.bind(obj);
                 *   (function foo() { ... }).call(obj);
                 *   (function foo() { ... }).apply(obj, []);
                 */
                case "MemberExpression":
                    if (
                        parent.object === currentNode &&
                        isSpecificMemberAccess(parent, null, bindOrCallOrApplyPattern)
                    ) {
                        const maybeCalleeNode = parent.parent.type === "ChainExpression"
                            ? parent.parent
                            : parent;

                        return !(
                            isCallee(maybeCalleeNode) &&
                            maybeCalleeNode.parent.arguments.length >= 1 &&
                            !isNullOrUndefined(maybeCalleeNode.parent.arguments[0])
                        );
                    }
                    return true;

                /*
                 * e.g.
                 *   Reflect.apply(function() {}, obj, []);
                 *   Array.from([], function() {}, obj);
                 *   list.forEach(function() {}, obj);
                 */
                case "CallExpression":
                    if (isReflectApply(parent.callee)) {
                        return (
                            parent.arguments.length !== 3 ||
                            parent.arguments[0] !== currentNode ||
                            isNullOrUndefined(parent.arguments[1])
                        );
                    }
                    if (isArrayFromMethod(parent.callee)) {
                        return (
                            parent.arguments.length !== 3 ||
                            parent.arguments[1] !== currentNode ||
                            isNullOrUndefined(parent.arguments[2])
                        );
                    }
                    if (isMethodWhichHasThisArg(parent.callee)) {
                        return (
                            parent.arguments.length !== 2 ||
                            parent.arguments[0] !== currentNode ||
                            isNullOrUndefined(parent.arguments[1])
                        );
                    }
                    return true;

                // Otherwise `this` is default.
                default:
                    return true;
            }
        }

        /* c8 ignore next */
        return true;
    },

    /**
     * Get the precedence level based on the node type
     * @param {ASTNode} node node to evaluate
     * @returns {int} precedence level
     * @private
     */
    getPrecedence(node) {
        switch (node.type) {
            case "SequenceExpression":
                return 0;

            case "AssignmentExpression":
            case "ArrowFunctionExpression":
            case "YieldExpression":
                return 1;

            case "ConditionalExpression":
                return 3;

            case "LogicalExpression":
                switch (node.operator) {
                    case "||":
                    case "??":
                        return 4;
                    case "&&":
                        return 5;

                    // no default
                }

                /* falls through */

            case "BinaryExpression":

                switch (node.operator) {
                    case "|":
                        return 6;
                    case "^":
                        return 7;
                    case "&":
                        return 8;
                    case "==":
                    case "!=":
                    case "===":
                    case "!==":
                        return 9;
                    case "<":
                    case "<=":
                    case ">":
                    case ">=":
                    case "in":
                    case "instanceof":
                        return 10;
                    case "<<":
                    case ">>":
                    case ">>>":
                        return 11;
                    case "+":
                    case "-":
                        return 12;
                    case "*":
                    case "/":
                    case "%":
                        return 13;
                    case "**":
                        return 15;

                    // no default
                }

                /* falls through */

            case "UnaryExpression":
            case "AwaitExpression":
                return 16;

            case "UpdateExpression":
                return 17;

            case "CallExpression":
            case "ChainExpression":
            case "ImportExpression":
                return 18;

            case "NewExpression":
                return 19;

            default:
                if (node.type in eslintVisitorKeys) {
                    return 20;
                }

                /*
                 * if the node is not a standard node that we know about, then assume it has the lowest precedence
                 * this will mean that rules will wrap unknown nodes in parentheses where applicable instead of
                 * unwrapping them and potentially changing the meaning of the code or introducing a syntax error.
                 */
                return -1;
        }
    },

    /**
     * Checks whether the given node is an empty block