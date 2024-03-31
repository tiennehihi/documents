                   type: utils_1.AST_NODE_TYPES.MemberExpression,
                    object: node.left,
                    property: node.right,
                    // location data
                    parent: node.parent,
                    range: node.range,
                    loc: node.loc,
                    optional: false,
                    computed: false,
                });
            },
            TSTupleType(node) {
                // transform it to an ArrayExpression
                return rules['ArrayExpression, ArrayPattern']({
                    type: utils_1.AST_NODE_TYPES.ArrayExpression,
                    elements: node.elementTypes,
                    // location data
                    parent: node.parent,
                    range: node.range,
                    loc: node.loc,
                });
            },
            TSTypeParameterDeclaration(node) {
                if (!node.params.length) {
                    retur