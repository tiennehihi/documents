ierarchyFacts & 131072 /* CapturedLexicalThis */);
    for (let i = body.statements.length - 1; i > 0; i--) {
      const statement = body.statements[i];
      if (isReturnStatement(statement) && statement.expression && isCapturedThis(statement.expression)) {
        const preceding = body.statements[i - 1];
        let expression;
        if (isExpressionStatement(preceding) && isThisCapturingTransfor