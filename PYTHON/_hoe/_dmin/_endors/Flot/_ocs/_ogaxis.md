 const queue = [];
    while (true) {
        switch (node.kind) {
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.AwaitExpression:
            case ts.SyntaxKind.YieldExpression:
            case ts.SyntaxKind.DeleteExpression:
                return true;
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.AsExpression:
            case ts.SyntaxKind.ParenthesizedExpression:
            case ts.SyntaxKind.NonNullExpression:
            case ts.SyntaxKind.VoidExpression:
            case ts.SyntaxKind.TypeOfExpression:
            case ts.SyntaxKind.PropertyAccessExpression:
            case ts.SyntaxKind.SpreadElement:
            case ts.SyntaxKind.PartiallyEmittedExpression:
                node = node.expression;
                continue;
       