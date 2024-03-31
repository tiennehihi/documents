 RHS node or null.
     */
    function getRhsNode(ref, prevRhsNode) {
        /**
         * Checks whether the given node is in a loop or not.
         * @param node The node to check.
         * @returns `true` if the node is in a loop.
         */
        function isInLoop(node) {
            let currentNode = node;
            while (currentNode) {
                if (utils_1.ASTUtils.isFunction(currentNode)) {
                    break;
                }
                if (utils_1.ASTUtils.isLoop(currentNode)) {
                    return true;
                }
                currentNode = currentNode.parent;
            }
            return false;
        }
        const id = ref.identifier;
        const parent = id.parent;
        const grandparent = parent.parent;
        const refScope = ref.from.variableScope;
        const varScope = ref.resolved.scope.variableScope;
        const canBeUsedLater = refScope !== varScope || isInLoop(id);
        /*
         * Inherits the previous node if this reference is in the node.
         * This is for `a = a + a`-like code.
         */
        if (prevRhsNode && isInside(id, prevRhsNode)) {
            return prevRhsNode;
        }
        if (parent.type === utils_1.AST_NODE_TYPES.AssignmentExpression &&
            grandparent.type === utils_1.AST_NODE_TYPES.ExpressionStatement &&
            id === parent.left &&
            !canBeUsedLater) {
            return parent.right;
