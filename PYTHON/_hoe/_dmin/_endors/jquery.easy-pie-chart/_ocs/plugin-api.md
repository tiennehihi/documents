 ((_c = node.parent) === null || _c === void 0 ? void 0 : _c.type) === utils_1.AST_NODE_TYPES.MethodDefinition) &&
                node.parent.kind === 'set';
            if (!isConstructor && !isSetAccessor && !node.returnType) {
                context.report({
                    node,
                    messageId: 'missingReturnType',
                });
            }
            checkParameters(node);
        }
        function checkFunctionExpression(node) {
            if (checkedFunctions.has(node)) {
                return;
            }
            checkedFunctions.add(node);
            if (isAllowedName(node.parent) ||
                (0, explicitReturnTypeUtils_1.isTypedFunctionExpression)(node, options) ||
                (0, explicitReturnTypeUtils_1.ancestorHasReturnType)(node)) {
                return;
            }
            (0, explicitReturnTypeUtils_1.checkFunctionExpressionReturnType)(node, options, sourceCode, loc => {
                context.report({
                    node,
                    loc,
                    messageId: 'missingReturnType',
                });
            });
            checkParameters(node);
    