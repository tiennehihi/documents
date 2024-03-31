ualsEqualsToken */:
      case 38 /* ExclamationEqualsEqualsToken */:
        return isNarrowableOperand(expr.left) || isNarrowableOperand(expr.right) || isNarrowingTypeofOperands(expr.right, expr.left) || isNarrowingTypeofOperands(expr.left, expr.right) || (isBooleanLiteral(expr.right) && isNarrowingExpression(expr.left) || isBooleanLiteral(expr.left) && isNarrowingExpression(expr.right));
      case 104 /* InstanceOfKeyword */:
        return isNarrowableOperand(expr.left);
      case 103 /* InKeyword */:
        return isNarrowingExpression(expr.right);
      case 28 /* CommaToken */:
        return isNarrowingExpression(expr.right);
    }
    return false;
  }
  function isNarrowableOperand(expr) {
    switch (expr.kind) {
      case 217 /* ParenthesizedExpression */:
        return isNarrowableOperand(expr.expression);
      case 226 /* BinaryExpression */:
        switch (expr.operatorToken.kind) {
          case 64 /* EqualsToken */:
            return isNarrowableOperand(expr.left);
          case 28 /* CommaToken */:
            return isNarrowableOperand(expr.right);
        }
    }
    return containsNarrowableReference(expr);
  }
  function createBranchLabel() {
    return initFlowNode({ flags: 4 /* BranchLabel */, antecedents: void 0 });
  }
  function createLoopLabel() {
    return initFlowNode({ flags: 8 /* LoopLabel */, antecedents: void 0 });
  }
  function createReduceLabel(target, antecedents, antecedent) {
    return initFlowNode({ flags: 1024 /* ReduceLabel */, target, antecedents, antecedent });
  }
  function setFlowNodeReferenced(flow) {
    flow.flags |= flow.flags & 2048 /* Referenced */ ? 4096 /* Shared */ : 2048 /* Referenced */;
  }
  function addAntecedent(label, antecedent) {
    if (!(antecedent.flags & 1 /* Unreachable */) && !contains(label.antecedents, antecedent)) {
      (label.antecedents || (label.antecedents = [])).push(antecedent);
      setFlowNodeReferenced(antecedent);
    }
  }
  function createFlowCondition(flags, antecedent, expression) {
    if (antecedent.flags & 1 /* Unreachable */) {
      return antecedent;
    }
    if (!expression) {
      return flags & 32 /* TrueCondition */ ? antecedent : unreachableFlow;
    }
    if ((expression.kind === 112 /* TrueKeyword */ && flags & 64 /* FalseCondition */ || expression.kind === 97 /* FalseKeyword */ && flags & 32 /* TrueCondition */) && !isExpressionOfOptionalChainRoot(expression) && !isNullishCoalesce(expression.parent)) {
      return unreachableFlow;
    }
    if (!isNarrowingExpression(expression)) {
      return antecedent;
    }
    setFlowNodeReferenced(antecedent);
    return initFlowNode({ flags, antecedent, node: expression });
  }
  function createFlowSwitchClause(antecedent, switchStatement, clauseStart, clauseEnd) {
    setFlowNodeReferenced(antecedent);
    return initFlowNode({ flags: 128 /* SwitchClause */, antecedent, switchStatement, clauseStart, clauseEnd });
  }
  function createFlowMutation(flags, antecedent, node) {
    setFlowNodeReferenced(antecedent);
    const result = initFlowNode({ flags, antecedent, node });
    if (currentExceptionTarget) {
      addAntecedent(currentExceptionTarget, result);
    }
    return result;
  }
  function createFlowCall(antecedent, node) {
    setFlowNodeReferenced(antecedent);
    return initFlowNode({ flags: 512 /* Call */, antecedent, node });
  }
  function finishFlowLabel(flow) {
    const antecedents = flow.antecedents;
    if (!antecedents) {
      return unreachableFlow;
    }
    if (antecedents.length === 1) {
      return antecedents[0];
    }
    return flow;
  }
  function isStatementCondition(node) {
    const parent2 = node.parent;
    switch (parent2.kind) {
      case 245 /* IfStatement */:
      case 247 /* WhileStatement */:
      case 246 /* DoStatement */:
        return parent2.expression === node;
      case 248 /* ForStatement */:
      case 227 /* ConditionalExpression */:
        return parent2.condition === node;
    }
    return false;
  }
  function isLogicalExpression(node) {
    while (true) {
      if (node.kind === 217 /* ParenthesizedExpression */) {
        node = node.expression;
      } else if (node.kind === 224 /* PrefixUnaryExpression */ && node.operator === 54 /* ExclamationToken */) {
        node = node.operand;
      } else {
        return isLogicalOrCoalescingBinaryExpression(node);
      }
    }
  }
  function isLogicalAssignmentExpression(node) {
    return isLogicalOrCoalescingAssignmentExpression(skipParentheses(node));
  }
  function isTopLevelLogicalExpression(node) {
    while (isParenthesizedExpression(node.parent) || isPrefixUnaryExpression(node.parent) && node.parent.operator === 54 /* ExclamationToken */) {
      node = node.parent;
    }
    return !isStatementCondition(node) && !isLogicalExpression(node.parent) && !(isOptionalChain(node.parent) && node.parent.expression === node);
  }
  function doWithConditionalBranches(action, value, trueTarget, falseTarget) {
    const savedTrueTarget = currentTrueTarget;
    const savedFalseTarget = currentFalseTarget;
    currentTrueTarget = trueTarget;
    currentFalseTarget = falseTarget;
    action(value);
    currentTrueTarget = savedTrueTarget;
    currentFalseTarget = savedFalseTarget;
  }
  function bindCondition(node, trueTarget, falseTarget) {
    doWithConditionalBranches(bind, node, trueTarget, falseTarget);
    if (!node || !isLogicalAssignmentExpression(node) && !isLogicalExpression(node) && !(isOptionalChain(node) && isOutermostOptionalChain(node))) {
      addAntecedent(trueTarget, createFlowCondition(32 /* TrueCondition */, currentFlow, node));
      addAntecedent(falseTarget, createFlowCondition(64 /* FalseCondition */, currentFlow, node));
    }
  }
  function bindIterativeStatement(node, breakTarget, continueTarget) {
    const saveBreakTarget = currentBreakTarget;
    const saveContinueTarget = currentContinueTarget;
    currentBreakTarget = breakTarget;
    currentContinueTarget = continueTarget;
    bind(node);
    currentBreakTarget = saveBreakTarget;
    currentContinueTarget = saveContinueTarget;
  }
  function setContinueTarget(node, target) {
    let label = activeLabelList;
    while (label && node.parent.kind === 256 /* LabeledStatement */) {
      label.continueTarget = target;
      label = label.next;
      node = node.parent;
    }
    return target;
  }
  function bindWhileStatement(node) {
    const preWhileLabel = setContinueTarget(node, createLoopLabel());
    const preBodyLabel = createBranchLabel();
    const postWhileLabel = createBranchLabel();
    addAntecedent(preWhileLabel, currentFlow);
    currentFlow = preWhileLabel;
    bindCondition(node.expression, preBodyLabel, postWhileLabel);
    currentFlow = finishFlowLabel(preBodyLabel);
    bindIterativeStatement(node.statement, postWhileLabel, preWhileLabel);
    addAntecedent(preWhileLabel, currentFlow);
    currentFlow = finishFlowLabel(postWhileLabel);
  }
  function bindDoStatement(node) {
    const preDoLabel = createLoopLabel();
    const preConditionLabel = setContinueTarget(node, createBranchLabel());
    const postDoLabel = createBranchLabel();
    addAntecedent(preDoLabel, currentFlow);
    currentFlow = preDoLabel;
    bindIterativeStatement(node.statement, postDoLabel, preConditionLabel);
    addAntecedent(preConditionLabel, currentFlow);
    currentFlow = finishFlowLabel(preConditionLabel);
    bindCondition(node.expression, preDoLabel, postDoLabel);
    currentFlow = finishFlowLabel(postDoLabel);
  }
  function bindForStatement(node) {
    const preLoopLabel = setContinueTarget(node, createLoopLabel());
    const preBodyLabel = createBranchLabel();
    const postLoopLabel = createBranchLabel();
    bind(node.initializer);
    addAntecedent(preLoopLabel, currentFlow);
    currentFlow = preLoopLabel;
    bindCondition(node.condition, preBodyLabel, postLoopLabel);
    currentFlow = finishFlowLabel(preBodyLabel);
    bindIterativeStatement(node.statement, postLoopLabel, preLoopLabel);
    bind(node.incrementor);
    addAntecedent(preLoopLabel, currentFlow);
    currentFlow = finishFlowLabel(postLoopLabel);
  }
  function bindForInOrForOfStatement(node) {
    const preLoopLabel = setContinueTarget(node, createLoopLabel());
    const postLoopLabel = createBranchLabel();
    bind(node.expression);
    addAntecedent(preLoopLabel, currentFlow);
    currentFlow = preLoopLabel;
    if (node.kind === 250 /* ForOfStatement */) {
      bind(node.awaitModifier);
    }
    addAntecedent(postLoopLabel, currentFlow);
    bind(node.initializer);
    if (node.initializer.kind !== 261 /* VariableDeclarationList */) {
      bindAssignmentTargetFlow(node.initializer);
    }
    bindIterativeStatement(node.statement, postLoopLabel, preLoopLabel);
    addAntecedent(preLoopLabel, currentFlow);
    currentFlow = finishFlowLabel(postLoopLabel);
  }
  function bindIfStatement(node) {
    const thenLabel = createBranchLabel();
    const elseLabel = createBranchLabel();
    const postIfLabel = createBranchLabel();
    bindCondition(node.expression, thenLabel, elseLabel);
    currentFlow = finishFlowLabel(thenLabel);
    bind(node.thenStatement);
    addAntecedent(postIfLabel, currentFlow);
    currentFlow = finishFlowLabel(elseLabel);
    bind(node.elseStatement);
    addAntecedent(postIfLabel, currentFlow);
    currentFlow = finishFlowLabel(postIfLabel);
  }
  function bindReturnOrThrow(node) {
    bind(node.expression);
    if (node.kind === 253 /* ReturnStatement */) {
      hasExplicitReturn = true;
      if (currentReturnTarget) {
        addAntecedent(currentReturnTarget, currentFlow);
      }
    }
    currentFlow = unreachableFlow;
  }
  function findActiveLabel(name) {
    for (let label = activeLabelList; label; label = label.next) {
      if (label.name === name) {
        return label;
      }
    }
    return void 0;
  }
  function bindBreakOrContinueFlow(node, breakTarget, continueTarget) {
    const flowLabel = node.kind === 252 /* BreakStatement */ ? breakTarget : continueTarget;
    if (flowLabel) {
      addAntecedent(flowLabel, currentFlow);
      currentFlow = unreachableFlow;
    }
  }
  function bindBreakOrContinueStatement(node) {
    bind(node.label);
    if (node.label) {
      const activeLabel = findActiveLabel(node.label.escapedText);
      if (activeLabel) {
        activeLabel.referenced = true;
        bindBreakOrContinueFlow(node, activeLabel.breakTarget, activeLabel.continueTarget);
      }
    } else {
      bindBreakOrContinueFlow(node, currentBreakTarget, currentContinueTarget);
    }
  }
  function bindTryStatement(node) {
    const saveReturnTarget = currentReturnTarget;
    const saveExceptionTarget = currentExceptionTarget;
    const normalExitLabel = createBranchLabel();
    const returnLabel = createBranchLabel();
    let exceptionLabel = createBranchLabel();
    if (node.finallyBlock) {
      currentReturnTarget = returnLabel;
    }
    addAntecedent(exceptionLabel, currentFlow);
    currentExceptionTarget = exceptionLabel;
    bind(node.tryBlock);
    addAntecedent(normalExitLabel, currentFlow);
    if (node.catchClause) {
      currentFlow = finishFlowLabel(exceptionLabel);
      exceptionLabel = createBranchLabel();
      addAntecedent(exceptionLabel, currentFlow);
      currentExceptionTarget = exceptionLabel;
      bind(node.catchClause);
      addAntecedent(normalExitLabel, currentFlow);
    }
    currentReturnTarget = saveReturnTarget;
    currentExceptionTarget = saveExceptionTarget;
    if (node.finallyBlock) {
      const finallyLabel = createBranchLabel();
      finallyLabel.antecedents = concatenate(concatenate(normalExitLabel.antecedents, exceptionLabel.antecedents), returnLabel.antecedents);
      currentFlow = finallyLabel;
      bind(node.finallyBlock);
      if (currentFlow.flags & 1 /* Unreachable */) {
        currentFlow = unreachableFlow;
      } else {
        if (currentReturnTarget && returnLabel.antecedents) {
          addAntecedent(currentReturnTarget, createReduceLabel(finallyLabel, returnLabel.antecedents, currentFlow));
        }
        if (currentExceptionTarget && exceptionLabel.antecedents) {
          addAntecedent(currentExceptionTarget, createReduceLabel(finallyLabel, exceptionLabel.antecedents, currentFlow));
        }
        currentFlow = normalExitLabel.antecedents ? createReduceLabel(finallyLabel, normalExitLabel.antecedents, currentFlow) : unreachableFlow;
      }
    } else {
      currentFlow = finishFlowLabel(normalExitLabel);
    }
  }
  function bindSwitchStatement(node) {
    const postSwitchLabel = createBranchLabel();
    bind(node.expression);
    const saveBreakTarget = currentBreakTarget;
    const savePreSwitchCaseFlow = preSwitchCaseFlow;
    currentBreakTarget = postSwitchLabel;
    preSwitchCaseFlow = currentFlow;
    bind(node.caseBlock);
    addAntecedent(postSwitchLabel, currentFlow);
    const hasDefault = forEach(node.caseBlock.clauses, (c) => c.kind === 297 /* DefaultClause */);
    node.possiblyExhaustive = !hasDefault && !postSwitchLabel.antecedents;
    if (!hasDefault) {
      addAntecedent(postSwitchLabel, createFlowSwitchClause(preSwitchCaseFlow, node, 0, 0));
    }
    currentBreakTarget = saveBreakTarget;
    preSwitchCaseFlow = savePreSwitchCaseFlow;
    currentFlow = finishFlowLabel(postSwitchLabel);
  }
  function bindCaseBlock(node) {
    const clauses = node.clauses;
    const isNarrowingSwitch = node.parent.expression.kind === 112 /* TrueKeyword */ || isNarrowingExpression(node.parent.expression);
    let fallthroughFlow = unreachableFlow;
    for (let i = 0; i < clauses.length; i++) {
      const clauseStart = i;
      while (!clauses[i].statements.length && i + 1 < clauses.length) {
        if (fallthroughFlow === unreachableFlow) {
          currentFlow = preSwitchCaseFlow;
        }
        bind(clauses[i]);
        i++;
      }
      const preCaseLabel = createBranchLabel();
      addAntecedent(preCaseLabel, isNarrowingSwitch ? createFlowSwitchClause(preSwitchCaseFlow, node.parent, clauseStart, i + 1) : preSwitchCaseFlow);
      addAntecedent(preCaseLabel, fallthroughFlow);
      currentFlow = finishFlowLabel(preCaseLabel);
      const clause = clauses[i];
      bind(clause);
      fallthroughFlow = currentFlow;
      if (!(currentFlow.flags & 1 /* Unreachable */) && i !== clauses.length - 1 && options.noFallthroughCasesInSwitch) {
        clause.fallthroughFlowNode = currentFlow;
      }
    }
  }
  function bindCaseClause(node) {
    const saveCurrentFlow = currentFlow;
    currentFlow = preSwitchCaseFlow;
    bind(node.expression);
    currentFlow = saveCurrentFlow;
    bindEach(node.statements);
  }
  function bindExpressionStatement(node) {
    bind(node.expression);
    maybeBindExpressionFlowIfCall(node.expression);
  }
  function maybeBindExpressionFlowIfCall(node) {
    if (node.kind === 213 /* CallExpression */) {
      const call = node;
      if (call.expression.kind !== 108 /* SuperKeyword */ && isDottedName(call.expression)) {
        currentFlow = createFlowCall(currentFlow, call);
      }
    }
  }
  function bindLabeledStatement(node) {
    const postStatementLabel = createBranchLabel();
    activeLabelList = {
      next: activeLabelList,
      name: node.label.escapedText,
      breakTarget: postStatementLabel,
      continueTarget: void 0,
      referenced: false
    };
    bind(node.label);
    bind(node.statement);
    if (!activeLabelList.referenced && !options.allowUnusedLabels) {
      errorOrSuggestionOnNode(unusedLabelIsError(options), node.label, Diagnostics.Unused_label);
    }
    activeLabelList = activeLabelList.next;
    addAntecedent(postStatementLabel, currentFlow);
    currentFlow = finishFlowLabel(postStatementLabel);
  }
  function bindDestructuringTargetFlow(node) {
    if (node.kind === 226 /* BinaryExpression */ && node.operatorToken.kind === 64 /* EqualsToken */) {
      bindAssignmentTargetFlow(node.left);
    } else {
      bindAssignmentTargetFlow(node);
    }
  }
  function bindAssignmentTargetFlow(node) {
    if (isNarrowableReference(node)) {
      currentFlow = createFlowMutation(16 /* Assignment */, currentFlow, node);
    } else if (node.kind === 209 /* ArrayLiteralExpression */) {
      for (const e of node.elements) {
        if (e.kind === 230 /* SpreadElement */) {
          bindAssignmentTargetFlow(e.expression);
        } else {
          bindDestructuringTargetFlow(e);
        }
      }
    } else if (node.kind === 210 /* ObjectLiteralExpression */) {
      for (const p of node.properties) {
        if (p.kind === 303 /* PropertyAssignment */) {
          bindDestructuringTargetFlow(p.initializer);
        } else if (p.kind === 304 /* ShorthandPropertyAssignment */) {
          bindAssignmentTargetFlow(p.name);
        } else if (p.kind === 305 /* SpreadAssignment */) {
          bindAssignmentTargetFlow(p.expression);
        }
      }
    }
  }
  function bindLogicalLikeExpression(node, trueTarget, falseTarget) {
    const preRightLabel = createBranchLabel();
    if (node.operatorToken.kind === 56 /* AmpersandAmpersandToken */ || node.operatorToken.kind === 77 /* AmpersandAmpersandEqualsToken */) {
      bindCondition(node.left, preRightLabel, falseTarget);
    } else {
      bindCondition(node.left, trueTarget, preRightLabel);
    }
    currentFlow = finishFlowLabel(preRightLabel);
    bind(node.operatorToken);
    if (isLogicalOrCoalescingAssignmentOperator(node.operatorToken.kind)) {
      doWithConditionalBranches(bind, node.right, trueTarget, falseTarget);
      bindAssignmentTargetFlow(node.left);
      addAntecedent(trueTarget, createFlowCondition(32 /* TrueCondition */, currentFlow, node));
      addAntecedent(falseTarget, createFlowCondition(64 /* FalseCondition */, currentFlow, node));
    } else {
      bindCondition(node.right, trueTarget, falseTarget);
    }
  }
  function bindPrefixUnaryExpressionFlow(node) {
    if (node.operator === 54 /* ExclamationToken */) {
      const saveTrueTarget = currentTrueTarget;
      currentTrueTarget = currentFalseTarget;
      currentFalseTarget = saveTrueTarget;
      bindEachChild(node);
      currentFalseTarget = currentTrueTarget;
      currentTrueTarget = saveTrueTarget;
    } else {
      bindEachChild(node);
      if (node.operator === 46 /* PlusPlusToken */ || node.operator === 47 /* MinusMinusToken */) {
        bindAssignmentTargetFlow(node.operand);
      }
    }
  }
  function bindPostfixUnaryExpressionFlow(node) {
    bindEachChild(node);
    if (node.operator === 46 /* PlusPlusToken */ || node.operator === 47 /* MinusMinusToken */) {
      bindAssignmentTargetFlow(node.operand);
    }
  }
  function bindDestructuringAssignmentFlow(node) {
    if (inAssignmentPattern) {
      inAssignmentPattern = false;
      bind(node.operatorToken);
      bind(node.right);
      inAssignmentPattern = true;
      bind(node.left);
    } else {
      inAssignmentPattern = true;
      bind(node.left);
      inAssignmentPattern = false;
      bind(node.operatorToken);
      bind(node.right);
    }
    bindAssignmentTargetFlow(node.left);
  }
  function createBindBinaryExpressionFlow() {
    return createBinaryExpressionTrampoline(
      onEnter,
      onLeft,
      onOperator,
      onRight,
      onExit,
      /*foldState*/
      void 0
    );
    function onEnter(node, state) {
      if (state) {
        state.stackIndex++;
        setParent(node, parent);
        const saveInStrictMode = inStrictMode;
        bindWorker(node);
        const saveParent = parent;
        parent = node;
        state.skip = false;
        state.inStrictModeStack[state.stackIndex] = saveInStrictMode;
        state.parentStack[state.stackIndex] = saveParent;
      } else {
        state = {
          stackIndex: 0,
          skip: false,
          inStrictModeStack: [void 0],
          parentStack: [void 0]
        };
      }
      const operator = node.operatorToken.kind;
      if (isLogicalOrCoalescingBinaryOperator(operator) || isLogicalOrCoalescingAssignmentOperator(operator)) {
        if (isTopLevelLogicalExpression(node)) {
          const postExpressionLabel = createBranchLabel();
          bindLogicalLikeExpression(node, postExpressionLabel, postExpressionLabel);
          currentFlow = finishFlowLabel(postExpressionLabel);
        } else {
          bindLogicalLikeExpression(node, currentTrueTarget, currentFalseTarget);
        }
        state.skip = true;
      }
      return state;
    }
    function onLeft(left, state, node) {
      if (!state.skip) {
        const maybeBound = maybeBind2(left);
        if (node.operatorToken.kind === 28 /* CommaToken */) {
          maybeBindExpressionFlowIfCall(left);
        }
        return maybeBound;
      }
    }
    function onOperator(operatorToken, state, _node) {
      if (!state.skip) {
        bind(operatorToken);
      }
    }
    function onRight(right, state, node) {
      if (!state.skip) {
        const maybeBound = maybeBind2(right);
        if (node.operatorToken.kind === 28 /* CommaToken */) {
          maybeBindExpressionFlowIfCall(right);
        }
        return maybeBound;
      }
    }
    function onExit(node, state) {
      if (!state.skip) {
        const operator = node.operatorToken.kind;
        if (isAssignmentOperator(operator) && !isAssignmentTarget(node)) {
          bindAssignmentTargetFlow(node.left);
          if (operator === 64 /* EqualsToken */ && node.left.kind === 212 /* ElementAccessExpression */) {
            const elementAccess = node.left;
            if (isNarrowableOperand(elementAccess.expression)) {
              currentFlow = createFlowMutation(256 /* ArrayMutation */, currentFlow, node);
            }
          }
        }
      }
      const savedInStrictMode = state.inStrictModeStack[state.stackIndex];
      const savedParent = state.parentStack[state.stackIndex];
      if (savedInStrictMode !== void 0) {
        inStrictMode = savedInStrictMode;
      }
      if (savedParent !== void 0) {
        parent = savedParent;
      }
      state.skip = false;
      state.stackIndex--;
    }
    function maybeBind2(node) {
      if (node && isBinaryExpression(node) && !isDestructuringAssignment(node)) {
        return node;
      }
      bind(node);
    }
  }
  function bindDeleteExpressionFlow(node) {
    bindEachChild(node);
    if (node.expression.kind === 211 /* PropertyAccessExpression */) {
      bindAssignmentTargetFlow(node.expression);
    }
  }
  function bindConditionalExpressionFlow(node) {
    const trueLabel = createBranchLabel();
    const falseLabel = createBranchLabel();
    const postExpressionLabel = createBranchLabel();
    bindCondition(node.condition, trueLabel, falseLabel);
    currentFlow = finishFlowLabel(trueLabel);
    bind(node.questionToken);
    bind(node.whenTrue);
    addAntecedent(postExpressionLabel, currentFlow);
    currentFlow = finishFlowLabel(falseLabel);
    bind(node.colonToken);
    bind(node.whenFalse);
    addAntecedent(postExpressionLabel, currentFlow);
    currentFlow = finishFlowLabel(postExpressionLabel);
  }
  function bindInitializedVariableFlow(node) {
    const name = !isOmittedExpression(node) ? node.name : void 0;
    if (isBindingPattern(name)) {
      for (const child of name.elements) {
        bindInitializedVariableFlow(child);
      }
    } else {
      currentFlow = createFlowMutation(16 /* Assignment */, currentFlow, node);
    }
  }
  function bindVariableDeclarationFlow(node) {
    bindEachChild(node);
    if (node.initializer || isForInOrOfStatement(node.parent.parent)) {
      bindInitializedVariableFlow(node);
    }
  }
  function bindBindingElementFlow(node) {
    bind(node.dotDotDotToken);
    bind(node.propertyName);
    bindInitializer(node.initializer);
    bind(node.name);
  }
  function bindParameterFlow(node) {
    bindEach(node.modifiers);
    bind(node.dotDotDotToken);
    bind(node.questionToken);
    bind(node.type);
    bindInitializer(node.initializer);
    bind(node.name);
  }
  function bindInitializer(node) {
    if (!node) {
      return;
    }
    const entryFlow = currentFlow;
    bind(node);
    if (entryFlow === unreachableFlow || entryFlow === currentFlow) {
      return;
    }
    const exitFlow = createBranchLabel();
    addAntecedent(exitFlow, entryFlow);
    addAntecedent(exitFlow, currentFlow);
    currentFlow = finishFlowLabel(exitFlow);
  }
  function bindJSDocTypeAlias(node) {
    bind(node.tagName);
    if (node.kind !== 347 /* JSDocEnumTag */ && node.fullName) {
      setParent(node.fullName, node);
      setParentRecursive(
        node.fullName,
        /*incremental*/
        false
      );
    }
    if (typeof node.comment !== "string") {
      bindEach(node.comment);
    }
  }
  function bindJSDocClassTag(node) {
    bindEachChild(node);
    const host = getHostSignatureFromJSDoc(node);
    if (host && host.kind !== 174 /* MethodDeclaration */) {
      addDeclarationToSymbol(host.symbol, host, 32 /* Class */);
    }
  }
  function bindOptionalExpression(node, trueTarget, falseTarget) {
    doWithConditionalBranches(bind, node, trueTarget, falseTarget);
    if (!isOptionalChain(node) || isOutermostOptionalChain(node)) {
      addAntecedent(trueTarget, createFlowCondition(32 /* TrueCondition */, currentFlow, node));
      addAntecedent(falseTarget, createFlowCondition(64 /* FalseCondition */, currentFlow, node));
    }
  }
  function bindOptionalChainRest(node) {
    switch (node.kind) {
      case 211 /* PropertyAccessExpression */:
        bind(node.questionDotToken);
        bind(node.name);
        break;
      case 212 /* ElementAccessExpression */:
        bind(node.questionDotToken);
        bind(node.argumentExpression);
        break;
      case 213 /* CallExpression */:
        bind(node.questionDotToken);
        bindEach(node.typeArguments);
        bindEach(node.arguments);
        break;
    }
  }
  function bindOptionalChain(node, trueTarget, falseTarget) {
    const preChainLabel = isOptionalChainRoot(node) ? createBranchLabel() : void 0;
    bindOptionalExpression(node.expression, preChainLabel || trueTarget, falseTarget);
    if (preChainLabel) {
      currentFlow = finishFlowLabel(preChainLabel);
    }
    doWithConditionalBranches(bindOptionalChainRest, node, trueTarget, falseTarget);
    if (isOutermostOptionalChain(node)) {
      addAntecedent(trueTarget, createFlowCondition(32 /* TrueCondition */, currentFlow, node));
      addAntecedent(falseTarget, createFlowCondition(64 /* FalseCondition */, currentFlow, node));
    }
  }
  function bindOptionalChainFlow(node) {
    if (isTopLevelLogicalExpression(node)) {
      const postExpressionLabel = createBranchLabel();
      bindOptionalChain(node, postExpressionLabel, postExpressionLabel);
      currentFlow = finishFlowLabel(postExpressionLabel);
    } else {
      bindOptionalChain(node, currentTrueTarget, currentFalseTarget);
    }
  }
  function bindNonNullExpressionFlow(node) {
    if (isOptionalChain(node)) {
      bindOptionalChainFlow(node);
    } else {
      bindEachChild(node);
    }
  }
  function bindAccessExpressionFlow(node) {
    if (isOptionalChain(node)) {
      bindOptionalChainFlow(node);
    } else {
      bindEachChild(node);
    }
  }
  function bindCallExpressionFlow(node) {
    if (isOptionalChain(node)) {
      bindOptionalChainFlow(node);
    } else {
      const expr = skipParentheses(node.expression);
      if (expr.kind === 218 /* FunctionExpression */ || expr.kind === 219 /* ArrowFunction */) {
        bindEach(node.typeArguments);
        bindEach(node.arguments);
        bind(node.expression);
      } else {
        bindEachChild(node);
        if (node.expression.kind === 108 /* SuperKeyword */) {
          currentFlow = createFlowCall(currentFlow, node);
        }
      }
    }
    if (node.expression.kind === 211 /* PropertyAccessExpression */) {
      const propertyAccess = node.expression;
      if (isIdentifier(propertyAccess.name) && isNarrowableOperand(propertyAccess.expression) && isPushOrUnshiftIdentifier(propertyAccess.name)) {
        currentFlow = createFlowMutation(256 /* ArrayMutation */, currentFlow, node);
      }
    }
  }
  function addToContainerChain(next) {
    if (lastContainer) {
      lastContainer.nextContainer = next;
    }
    lastContainer = next;
  }
  function declareSymbolAndAddToSymbolTable(node, symbolFlags, symbolExcludes) {
    switch (container.kind) {
      case 267 /* ModuleDeclaration */:
        return declareModuleMember(node, symbolFlags, symbolExcludes);
      case 312 /* SourceFile */:
        return declareSourceFileMember(node, symbolFlags, symbolExcludes);
      case 231 /* ClassExpression */:
      case 263 /* ClassDeclaration */:
        return declareClassMember(node, symbolFlags, symbolExcludes);
      case 266 /* EnumDeclaration */:
        return declareSymbol(container.symbol.exports, container.symbol, node, symbolFlags, symbolExcludes);
      case 187 /* TypeLiteral */:
      case 329 /* JSDocTypeLiteral */:
      case 210 /* ObjectLiteralExpression */:
      case 264 /* InterfaceDeclaration */:
      case 292 /* JsxAttributes */:
        return declareSymbol(container.symbol.members, container.symbol, node, symbolFlags, symbolExcludes);
      case 184 /* FunctionType */:
      case 185 /* ConstructorType */:
      case 179 /* CallSignature */:
      case 180 /* ConstructSignature */:
      case 330 /* JSDocSignature */:
      case 181 /* IndexSignature */:
      case 174 /* MethodDeclaration */:
      case 173 /* MethodSignature */:
      case 176 /* Constructor */:
      case 177 /* GetAccessor */:
      case 178 /* SetAccessor */:
      case 262 /* FunctionDeclaration */:
      case 218 /* FunctionExpression */:
      case 219 /* ArrowFunction */:
      case 324 /* JSDocFunctionType */:
      case 175 /* ClassStaticBlockDeclaration */:
      case 265 /* TypeAliasDeclaration */:
      case 200 /* MappedType */:
        if (container.locals)
          Debug.assertNode(container, canHaveLocals);
        return declareSymbol(
          container.locals,
          /*parent*/
          void 0,
          node,
          symbolFlags,
          symbolExcludes
        );
    }
  }
  function declareClassMember(node, symbolFlags, symbolExcludes) {
    return isStatic(node) ? declareSymbol(container.symbol.exports, container.symbol, node, symbolFlags, symbolExcludes) : declareSymbol(container.symbol.members, container.symbol, node, symbolFlags, symbolExcludes);
  }
  function declareSourceFileMember(node, symbolFlags, symbolExcludes) {
    return isExternalModule(file) ? declareModuleMember(node, symbolFlags, symbolExcludes) : declareSymbol(
      file.locals,
      /*parent*/
      void 0,
      node,
      symbolFlags,
      symbolExcludes
    );
  }
  function hasExportDeclarations(node) {
    const body = isSourceFile(node) ? node : tryCast(node.body, isModuleBlock);
    return !!body && body.statements.some((s) => isExportDeclaration(s) || isExportAssignment(s));
  }
  function setExportContextFlag(node) {
    if (node.flags & 33554432 /* Ambient */ && !hasExportDeclarations(node)) {
      node.flags |= 128 /* ExportContext */;
    } else {
      node.flags &= ~128 /* ExportContext */;
    }
  }
  function bindModuleDeclaration(node) {
    setExportContextFlag(node);
    if (isAmbientModule(node)) {
      if (hasSyntacticModifier(node, 32 /* Export */)) {
        errorOnFirstToken(node, Diagnostics.export_modifier_cannot_be_applied_to_ambient_modules_and_module_augmentations_since_they_are_always_visible);
      }
      if (isModuleAugmentationExternal(node)) {
        declareModuleSymbol(node);
      } else {
        let pattern;
        if (node.name.kind === 11 /* StringLiteral */) {
          const { text } = node.name;
          pattern = tryParsePattern(text);
          if (pattern === void 0) {
            errorOnFirstToken(node.name, Diagnostics.Pattern_0_can_have_at_most_one_Asterisk_character, text);
          }
        }
        const symbol = declareSymbolAndAddToSymbolTable(node, 512 /* ValueModule */, 110735 /* ValueModuleExcludes */);
        file.patternAmbientModules = append(file.patternAmbientModules, pattern && !isString(pattern) ? { pattern, symbol } : void 0);
      }
    } else {
      const state = declareModuleSymbol(node);
      if (state !== 0 /* NonInstantiated */) {
        const { symbol } = node;
        symbol.constEnumOnlyModule = !(symbol.flags & (16 /* Function */ | 32 /* Class */ | 256 /* RegularEnum */)) && state === 2 /* ConstEnumOnly */ && symbol.constEnumOnlyModule !== false;
      }
    }
  }
  function declareModuleSymbol(node) {
    const state = getModuleInstanceState(node);
    const instantiated = state !== 0 /* NonInstantiated */;
    declareSymbolAndAddToSymbolTable(
      node,
      instantiated ? 512 /* ValueModule */ : 1024 /* NamespaceModule */,
      instantiated ? 110735 /* ValueModuleExcludes */ : 0 /* NamespaceModuleExcludes */
    );
    return state;
  }
  function bindFunctionOrConstructorType(node) {
    const symbol = createSymbol(131072 /* Signature */, getDeclarationName(node));
    addDeclarationToSymbol(symbol, node, 131072 /* Signature */);
    const typeLiteralSymbol = createSymbol(2048 /* TypeLiteral */, "__type" /* Type */);
    addDeclarationToSymbol(typeLiteralSymbol, node, 2048 /* TypeLiteral */);
    typeLiteralSymbol.members = createSymbolTable();
    typeLiteralSymbol.members.set(symbol.escapedName, symbol);
  }
  function bindObjectLiteralExpression(node) {
    return bindAnonymousDeclaration(node, 4096 /* ObjectLiteral */, "__object" /* Object */);
  }
  function bindJsxAttributes(node) {
    return bindAnonymousDeclaration(node, 4096 /* ObjectLiteral */, "__jsxAttributes" /* JSXAttributes */);
  }
  function bindJsxAttribute(node, symbolFlags, symbolExcludes) {
    return declareSymbolAndAddToSymbolTable(node, symbolFlags, symbolExcludes);
  }
  function bindAnonymousDeclaration(node, symbolFlags, name) {
    const symbol = createSymbol(symbolFlags, name);
    if (symbolFlags & (8 /* EnumMember */ | 106500 /* ClassMember */)) {
      symbol.parent = container.symbol;
    }
    addDeclarationToSymbol(symbol, node, symbolFlags);
    return symbol;
  }
  function bindBlockScopedDeclaration(node, symbolFlags, symbolExcludes) {
    switch (blockScopeContainer.kind) {
      case 267 /* ModuleDeclaration */:
        declareModuleMember(node, symbolFlags, symbolExcludes);
        break;
      case 312 /* SourceFile */:
        if (isExternalOrCommonJsModule(container)) {
          declareModuleMember(node, symbolFlags, symbolExcludes);
          break;
        }
      default:
        Debug.assertNode(blockScopeContainer, canHaveLocals);
        if (!blockScopeContainer.locals) {
          blockScopeContainer.locals = createSymbolTable();
          addToContainerChain(blockScopeContainer);
        }
        declareSymbol(
          blockScopeContainer.locals,
          /*parent*/
          void 0,
          node,
          symbolFlags,
          symbolExcludes
        );
    }
  }
  function delayedBindJSDocTypedefTag() {
    if (!delayedTypeAliases) {
      return;
    }
    const saveContainer = container;
    const saveLastContainer = lastContainer;
    const saveBlockScopeContainer = blockScopeContainer;
    const saveParent = parent;
    const saveCurrentFlow = currentFlow;
    for (const typeAlias of delayedTypeAliases) {
      const host = typeAlias.parent.parent;
      container = getEnclosingContainer(host) || file;
      blockScopeContainer = getEnclosingBlockScopeContainer(host) || file;
      currentFlow = initFlowNode({ flags: 2 /* Start */ });
      parent = typeAlias;
      bind(typeAlias.typeExpression);
      const declName = getNameOfDeclaration(typeAlias);
      if ((isJSDocEnumTag(typeAlias) || !typeAlias.fullName) && declName && isPropertyAccessEntityNameExpression(declName.parent)) {
        const isTopLevel = isTopLevelNamespaceAssignment(declName.parent);
        if (isTopLevel) {
          bindPotentiallyMissingNamespaces(
            file.symbol,
            declName.parent,
            isTopLevel,
            !!findAncestor(declName, (d) => isPropertyAccessExpression(d) && d.name.escapedText === "prototype"),
            /*containerIsClass*/
            false
          );
          const oldContainer = container;
          switch (getAssignmentDeclarationPropertyAccessKind(declName.parent)) {
            case 1 /* ExportsProperty */:
            case 2 /* ModuleExports */:
              if (!isExternalOrCommonJsModule(file)) {
                container = void 0;
              } else {
                container = file;
              }
              break;
            case 4 /* ThisProperty */:
              container = declName.parent.expression;
              break;
            case 3 /* PrototypeProperty */:
              container = declName.parent.expression.name;
              break;
            case 5 /* Property */:
              container = isExportsOrModuleExportsOrAlias(file, declName.parent.expression) ? file : isPropertyAccessExpression(declName.parent.expression) ? declName.parent.expression.name : declName.parent.expression;
              break;
            case 0 /* None */:
              return Debug.fail("Shouldn't have detected typedef or enum on non-assignment declaration");
          }
          if (container) {
            declareModuleMember(typeAlias, 524288 /* TypeAlias */, 788968 /* TypeAliasExcludes */);
          }
          container = oldContainer;
        }
      } else if (isJSDocEnumTag(typeAlias) || !typeAlias.fullName || typeAlias.fullName.kind === 80 /* Identifier */) {
        parent = typeAlias.parent;
        bindBlockScopedDeclaration(typeAlias, 524288 /* TypeAlias */, 788968 /* TypeAliasExcludes */);
      } else {
        bind(typeAlias.fullName);
      }
    }
    container = saveContainer;
    lastContainer = saveLastContainer;
    blockScopeContainer = saveBlockScopeContainer;
    parent = saveParent;
    currentFlow = saveCurrentFlow;
  }
  function checkContextualIdentifier(node) {
    if (!file.parseDiagnostics.length && !(node.flags & 33554432 /* Ambient */) && !(node.flags & 16777216 /* JSDoc */) && !isIdentifierName(node)) {
      const originalKeywordKind = identifierToKeywordKind(node);
      if (originalKeywordKind === void 0) {
        return;
      }
      if (inStrictMode && originalKeywordKind >= 119 /* FirstFutureReservedWord */ && originalKeywordKind <= 127 /* LastFutureReservedWord */) {
        file.bindDiagnostics.push(createDiagnosticForNode2(node, getStrictModeIdentifierMessage(node), declarationNameToString(node)));
      } else if (originalKeywordKind === 135 /* AwaitKeyword */) {
        if (isExternalModule(file) && isInTopLevelContext(node)) {
          file.bindDiagnostics.push(createDiagnosticForNode2(node, Diagnostics.Identifier_expected_0_is_a_reserved_word_at_the_top_level_of_a_module, declarationNameToString(node)));
        } else if (node.flags & 65536 /* AwaitContext */) {
          file.bindDiagnostics.push(createDiagnosticForNode2(node, Diagnostics.Identifier_expected_0_is_a_reserved_word_that_cannot_be_used_here, declarationNameToString(node)));
        }
      } else if (originalKeywordKind === 127 /* YieldKeyword */ && node.flags & 16384 /* YieldContext */) {
        file.bindDiagnostics.push(createDiagnosticForNode2(node, Diagnostics.Identifier_expected_0_is_a_reserved_word_that_cannot_be_used_here, declarationNameToString(node)));
      }
    }
  }
  function getStrictModeIdentifierMessage(node) {
    if (getContainingClass(node)) {
      return Diagnostics.Identifier_expected_0_is_a_reserved_word_in_strict_mode_Class_definitions_are_automatically_in_strict_mode;
    }
    if (file.externalModuleIndicator) {
      return Diagnostics.Identifier_expected_0_is_a_reserved_word_in_strict_mode_Modules_are_automatically_in_strict_mode;
    }
    return Diagnostics.Identifier_expected_0_is_a_reserved_word_in_strict_mode;
  }
  function checkPrivateIdentifier(node) {
    if (node.escapedText === "#constructor") {
      if (!file.parseDiagnostics.length) {
        file.bindDiagnostics.push(createDiagnosticForNode2(node, Diagnostics.constructor_is_a_reserved_word, declarationNameToString(node)));
      }
    }
  }
  function checkStrictModeBinaryExpression(node) {
    if (inStrictMode && isLeftHandSideExpression(node.left) && isAssignmentOperator(node.operatorToken.kind)) {
      checkStrictModeEvalOrArguments(node, node.left);
    }
  }
  function checkStrictModeCatchClause(node) {
    if (inStrictMode && node.variableDeclaration) {
      checkStrictModeEvalOrArguments(node, node.variableDeclaration.name);
    }
  }
  function checkStrictModeDeleteExpression(node) {
    if (inStrictMode && node.expression.kind === 80 /* Identifier */) {
      const span = getErrorSpanForNode(file, node.expression);
      file.bindDiagnostics.push(createFileDiagnostic(file, span.start, span.length, Diagnostics.delete_cannot_be_called_on_an_identifier_in_strict_mode));
    }
  }
  function isEvalOrArgumentsIdentifier(node) {
    return isIdentifier(node) && (node.escapedText === "eval" || node.escapedText === "arguments");
  }
  function checkStrictModeEvalOrArguments(contextNode, name) {
    if (name && name.kind === 80 /* Identifier */) {
      const identifier = name;
      if (isEvalOrArgumentsIdentifier(identifier)) {
        const span = getErrorSpanForNode(file, name);
        file.bindDiagnostics.push(createFileDiagnostic(file, span.start, span.length, getStrictModeEvalOrArgumentsMessage(contextNode), idText(identifier)));
      }
    }
  }
  function getStrictModeEvalOrArgumentsMessage(node) {
    if (getContainingClass(node)) {
      return Diagnostics.Code_contained_in_a_class_is_evaluated_in_JavaScript_s_strict_mode_which_does_not_allow_this_use_of_0_For_more_information_see_https_Colon_Slash_Slashdeveloper_mozilla_org_Slashen_US_Slashdocs_SlashWeb_SlashJavaScript_SlashReference_SlashStrict_mode;
    }
    if (file.externalModuleIndicator) {
      return Diagnostics.Invalid_use_of_0_Modules_are_automatically_in_strict_mode;
    }
    return Diagnostics.Invalid_use_of_0_in_strict_mode;
  }
  function checkStrictModeFunctionName(node) {
    if (inStrictMode) {
      checkStrictModeEvalOrArguments(node, node.name);
    }
  }
  function getStrictModeBlockScopeFunctionDeclarationMessage(node) {
    if (getContainingClass(node)) {
      return Diagnostics.Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Class_definitions_are_automatically_in_strict_mode;
    }
    if (file.externalModuleIndicator) {
      return Diagnostics.Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Modules_are_automatically_in_strict_mode;
    }
    return Diagnostics.Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5;
  }
  function checkStrictModeFunctionDeclaration(node) {
    if (languageVersion < 2 /* ES2015 */) {
      if (blockScopeContainer.kind !== 312 /* SourceFile */ && blockScopeContainer.kind !== 267 /* ModuleDeclaration */ && !isFunctionLikeOrClassStaticBlockDeclaration(blockScopeContainer)) {
        const errorSpan = getErrorSpanForNode(file, node);
        file.bindDiagnostics.push(createFileDiagnostic(file, errorSpan.start, errorSpan.length, getStrictModeBlockScopeFunctionDeclarationMessage(node)));
      }
    }
  }
  function checkStrictModePostfixUnaryExpression(node) {
    if (inStrictMode) {
      checkStrictModeEvalOrArguments(node, node.operand);
    }
  }
  function checkStrictModePrefixUnaryExpression(node) {
    if (inStrictMode) {
      if (node.operator === 46 /* PlusPlusToken */ || node.operator === 47 /* MinusMinusToken */) {
        checkStrictModeEvalOrArguments(node, node.operand);
      }
    }
  }
  function checkStrictModeWithStatement(node) {
    if (inStrictMode) {
      errorOnFirstToken(node, Diagnostics.with_statements_are_not_allowed_in_strict_mode);
    }
  }
  function checkStrictModeLabeledStatement(node) {
    if (inStrictMode && getEmitScriptTarget(options) >= 2 /* ES2015 */) {
      if (isDeclarationStatement(node.statement) || isVariableStatement(node.statement)) {
        errorOnFirstToken(node.label, Diagnostics.A_label_is_not_allowed_here);
      }
    }
  }
  function errorOnFirstToken(node, message, ...args) {
    const span = getSpanOfTokenAtPosition(file, node.pos);
    file.bindDiagnostics.push(createFileDiagnostic(file, span.start, span.length, message, ...args));
  }
  function errorOrSuggestionOnNode(isError, node, message) {
    errorOrSuggestionOnRange(isError, node, node, message);
  }
  function errorOrSuggestionOnRange(isError, startNode, endNode, message) {
    addErrorOrSuggestionDiagnostic(isError, { pos: getTokenPosOfNode(startNode, file), end: endNode.end }, message);
  }
  function addErrorOrSuggestionDiagnostic(isError, range, message) {
    const diag2 = createFileDiagnostic(file, range.pos, range.end - range.pos, message);
    if (isError) {
      file.bindDiagnostics.push(diag2);
    } else {
      file.bindSuggestionDiagnostics = append(file.bindSuggestionDiagnostics, { ...diag2, category: 2 /* Suggestion */ });
    }
  }
  function bind(node) {
    if (!node) {
      return;
    }
    setParent(node, parent);
    if (tracing)
      node.tracingPath = file.path;
    const saveInStrictMode = inStrictMode;
    bindWorker(node);
    if (node.kind > 165 /* LastToken */) {
      const saveParent = parent;
      parent = node;
      const containerFlags = getContainerFlags(node);
      if (containerFlags === 0 /* None */) {
        bindChildren(node);
      } else {
        bindContainer(node, containerFlags);
      }
      parent = saveParent;
    } else {
      const saveParent = parent;
      if (node.kind === 1 /* EndOfFileToken */)
        parent = node;
      bindJSDoc(node);
      parent = saveParent;
    }
    inStrictMode = saveInStrictMode;
  }
  function bindJSDoc(node) {
    if (hasJSDocNodes(node)) {
      if (isInJSFile(node)) {
        for (const j of node.jsDoc) {
          bind(j);
        }
      } else {
        for (const j of node.jsDoc) {
          setParent(j, node);
          setParentRecursive(
            j,
            /*incremental*/
            false
          );
        }
      }
    }
  }
  function updateStrictModeStatementList(statements) {
    if (!inStrictMode) {
      for (const statement of statements) {
        if (!isPrologueDirective(statement)) {
          return;
        }
        if (isUseStrictPrologueDirective(statement)) {
          inStrictMode = true;
          return;
        }
      }
    }
  }
  function isUseStrictPrologueDirective(node) {
    const nodeText = getSourceTextOfNodeFromSourceFile(file, node.expression);
    return nodeText === '"use strict"' || nodeText === "'use strict'";
  }
  function bindWorker(node) {
    switch (node.kind) {
      case 80 /* Identifier */:
        if (node.flags & 4096 /* IdentifierIsInJSDocNamespace */) {
          let parentNode = node.parent;
          while (parentNode && !isJSDocTypeAlias(parentNode)) {
            parentNode = parentNode.parent;
          }
          bindBlockScopedDeclaration(parentNode, 524288 /* TypeAlias */, 788968 /* TypeAliasExcludes */);
          break;
        }
      case 110 /* ThisKeyword */:
        if (currentFlow && (isExpression(node) || parent.kind === 304 /* ShorthandPropertyAssignment */)) {
          node.flowNode = currentFlow;
        }
        return checkContextualIdentifier(node);
      case 166 /* QualifiedName */:
        if (currentFlow && isPartOfTypeQuery(node)) {
          node.flowNode = currentFlow;
        }
        break;
      case 236 /* MetaProperty */:
      case 108 /* SuperKeyword */:
        node.flowNode = currentFlow;
        break;
      case 81 /* PrivateIdentifier */:
        return checkPrivateIdentifier(node);
      case 211 /* PropertyAccessExpression */:
      case 212 /* ElementAccessExpression */:
        const expr = node;
        if (currentFlow && isNarrowableReference(expr)) {
          expr.flowNode = currentFlow;
        }
        if (isSpecialPropertyDeclaration(expr)) {
          bindSpecialPropertyDeclaration(expr);
        }
        if (isInJSFile(expr) && file.commonJsModuleIndicator && isModuleExportsAccessExpression(expr) && !lookupSymbolForName(blockScopeContainer, "module")) {
          declareSymbol(
            file.locals,
            /*parent*/
            void 0,
            expr.expression,
            1 /* FunctionScopedVariable */ | 134217728 /* ModuleExports */,
            111550 /* FunctionScopedVariableExcludes */
          );
        }
        break;
      case 226 /* BinaryExpression */:
        const specialKind = getAssignmentDeclarationKind(node);
        switch (specialKind) {
          case 1 /* ExportsProperty */:
            bindExportsPropertyAssignment(node);
            break;
          case 2 /* ModuleExports */:
            bindModuleExportsAssignment(node);
            break;
          case 3 /* PrototypeProperty */:
            bindPrototypePropertyAssignment(node.left, node);
            break;
          case 6 /* Prototype */:
            bindPrototypeAssignment(node);
            break;
          case 4 /* ThisProperty */:
            bindThisPropertyAssignment(node);
            break;
          case 5 /* Property */:
            const expression = node.left.expression;
            if (isInJSFile(node) && isIdentifier(expression)) {
              const symbol = lookupSymbolForName(blockScopeContainer, expression.escapedText);
              if (isThisInitializedDeclaration(symbol == null ? void 0 : symbol.valueDeclaration)) {
                bindThisPropertyAssignment(node);
                break;
              }
            }
            bindSpecialPropertyAssignment(node);
            break;
          case 0 /* None */:
            break;
          default:
            Debug.fail("Unknown binary expression special property assignment kind");
        }
        return checkStrictModeBinaryExpression(node);
      case 299 /* CatchClause */:
        return checkStrictModeCatchClause(node);
      case 220 /* DeleteExpression */:
        return checkStrictModeDeleteExpression(node);
      case 225 /* PostfixUnaryExpression */:
        return checkStrictModePostfixUnaryExpression(node);
      case 224 /* PrefixUnaryExpression */:
        return checkStrictModePrefixUnaryExpression(node);
      case 254 /* WithStatement */:
        return checkStrictModeWithStatement(node);
      case 256 /* LabeledStatement */:
        return checkStrictModeLabeledStatement(node);
      case 197 /* ThisType */:
        seenThisKeyword = true;
        return;
      case 182 /* TypePredicate */:
        break;
      case 168 /* TypeParameter */:
        return bindTypeParameter(node);
      case 169 /* Parameter */:
        return bindParameter(node);
      case 260 /* VariableDeclaration */:
        return bindVariableDeclarationOrBindingElement(node);
      case 208 /* BindingElement */:
        node.flowNode = currentFlow;
        return bindVariableDeclarationOrBindingElement(node);
      case 172 /* PropertyDeclaration */:
      case 171 /* PropertySignature */:
        return bindPropertyWorker(node);
      case 303 /* PropertyAssignment */:
      case 304 /* ShorthandPropertyAssignment */:
        return bindPropertyOrMethodOrAccessor(node, 4 /* Property */, 0 /* PropertyExcludes */);
      case 306 /* EnumMember */:
        return bindPropertyOrMethodOrAccessor(node, 8 /* EnumMember */, 900095 /* EnumMemberExcludes */);
      case 179 /* CallSignature */:
      case 180 /* ConstructSignature */:
      case 181 /* IndexSignature */:
        return declareSymbolAndAddToSymbolTable(node, 131072 /* Signature */, 0 /* None */);
      case 174 /* MethodDeclaration */:
      case 173 /* MethodSignature */:
        return bindPropertyOrMethodOrAccessor(node, 8192 /* Method */ | (node.questionToken ? 16777216 /* Optional */ : 0 /* None */), isObjectLiteralMethod(node) ? 0 /* PropertyExcludes */ : 103359 /* MethodExcludes */);
      case 262 /* FunctionDeclaration */:
        return bindFunctionDeclaration(node);
      case 176 /* Constructor */:
        return declareSymbolAndAddToSymbolTable(
          node,
          16384 /* Constructor */,
          /*symbolExcludes:*/
          0 /* None */
        );
      case 177 /* GetAccessor */:
        return bindPropertyOrMethodOrAccessor(node, 32768 /* GetAccessor */, 46015 /* GetAccessorExcludes */);
      case 178 /* SetAccessor */:
        return bindPropertyOrMethodOrAccessor(node, 65536 /* SetAccessor */, 78783 /* SetAccessorExcludes */);
      case 184 /* FunctionType */:
      case 324 /* JSDocFunctionType */:
      case 330 /* JSDocSignature */:
      case 185 /* ConstructorType */:
        return bindFunctionOrConstructorType(node);
      case 187 /* TypeLiteral */:
      case 329 /* JSDocTypeLiteral */:
      case 200 /* MappedType */:
        return bindAnonymousTypeWorker(node);
      case 339 /* JSDocClassTag */:
        return bindJSDocClassTag(node);
      case 210 /* ObjectLiteralExpression */:
        return bindObjectLiteralExpression(node);
      case 218 /* FunctionExpression */:
      case 219 /* ArrowFunction */:
        return bindFunctionExpression(node);
      case 213 /* CallExpression */:
        const assignmentKind = getAssignmentDeclarationKind(node);
        switch (assignmentKind) {
          case 7 /* ObjectDefinePropertyValue */:
            return bindObjectDefinePropertyAssignment(node);
          case 8 /* ObjectDefinePropertyExports */:
            return bindObjectDefinePropertyExport(node);
          case 9 /* ObjectDefinePrototypeProperty */:
            return bindObjectDefinePrototypeProperty(node);
          case 0 /* None */:
            break;
          default:
            return Debug.fail("Unknown call expression assignment declaration kind");
        }
        if (isInJSFile(node)) {
          bindCallExpression(node);
        }
        break;
      case 231 /* ClassExpression */:
      case 263 /* ClassDeclaration */:
        inStrictMode = true;
        return bindClassLikeDeclaration(node);
      case 264 /* InterfaceDeclaration */:
        return bindBlockScopedDeclaration(node, 64 /* Interface */, 788872 /* InterfaceExcludes */);
      case 265 /* TypeAliasDeclaration */:
        return bindBlockScopedDeclaration(node, 524288 /* TypeAlias */, 788968 /* TypeAliasExcludes */);
      case 266 /* EnumDeclaration */:
        return bindEnumDeclaration(node);
      case 267 /* ModuleDeclaration */:
        return bindModuleDeclaration(node);
      case 292 /* JsxAttributes */:
        return bindJsxAttributes(node);
      case 291 /* JsxAttribute */:
        return bindJsxAttribute(node, 4 /* Property */, 0 /* PropertyExcludes */);
      case 271 /* ImportEqualsDeclaration */:
      case 274 /* NamespaceImport */:
      case 276 /* ImportSpecifier */:
      case 281 /* ExportSpecifier */:
        return declareSymbolAndAddToSymbolTable(node, 2097152 /* Alias */, 2097152 /* AliasExcludes */);
      case 270 /* NamespaceExportDeclaration */:
        return bindNamespaceExportDeclaration(node);
      case 273 /* ImportClause */:
        return bindImportClause(node);
      case 278 /* ExportDeclaration */:
        return bindExportDeclaration(node);
      case 277 /* ExportAssignment */:
        return bindExportAssignment(node);
      case 312 /* SourceFile */:
        updateStrictModeStatementList(node.statements);
        return bindSourceFileIfExternalModule();
      case 241 /* Block */:
        if (!isFunctionLikeOrClassStaticBlockDeclaration(node.parent)) {
          return;
        }
      case 268 /* ModuleBlock */:
        return updateStrictModeStatementList(node.statements);
      case 348 /* JSDocParameterTag */:
        if (node.parent.kind === 330 /* JSDocSignature */) {
          return bindParameter(node);
        }
        if (node.parent.kind !== 329 /* JSDocTypeLiteral */) {
          break;
        }
      case 355 /* JSDocPropertyTag */:
        const propTag = node;
        const flags = propTag.isBracketed || propTag.typeExpression && propTag.typeExpression.type.kind === 323 /* JSDocOptionalType */ ? 4 /* Property */ | 16777216 /* Optional */ : 4 /* Property */;
        return declareSymbolAndAddToSymbolTable(propTag, flags, 0 /* PropertyExcludes */);
      case 353 /* JSDocTypedefTag */:
      case 345 /* JSDocCallbackTag */:
      case 347 /* JSDocEnumTag */:
        return (delayedTypeAliases || (delayedTypeAliases = [])).push(node);
      case 346 /* JSDocOverloadTag */:
        return bind(node.typeExpression);
    }
  }
  function bindPropertyWorker(node) {
    const isAutoAccessor = isAutoAccessorPropertyDeclaration(node);
    const includes = isAutoAccessor ? 98304 /* Accessor */ : 4 /* Property */;
    const excludes = isAutoAccessor ? 13247 /* AccessorExcludes */ : 0 /* PropertyExcludes */;
    return bindPropertyOrMethodOrAccessor(node, includes | (node.questionToken ? 16777216 /* Optional */ : 0 /* None */), excludes);
  }
  function bindAnonymousTypeWorker(node) {
    return bindAnonymousDeclaration(node, 2048 /* TypeLiteral */, "__type" /* Type */);
  }
  function bindSourceFileIfExternalModule() {
    setExportContextFlag(file);
    if (isExternalModule(file)) {
      bindSourceFileAsExternalModule();
    } else if (isJsonSourceFile(file)) {
      bindSourceFileAsExternalModule();
      const originalSymbol = file.symbol;
      declareSymbol(file.symbol.exports, file.symbol, file, 4 /* Property */, -1 /* All */);
      file.symbol = originalSymbol;
    }
  }
  function bindSourceFileAsExternalModule() {
    bindAnonymousDeclaration(file, 512 /* ValueModule */, `"${removeFileExtension(file.fileName)}"`);
  }
  function bindExportAssignment(node) {
    if (!container.symbol || !container.symbol.exports) {
      bindAnonymousDeclaration(node, 111551 /* Value */, getDeclarationName(node));
    } else {
      const flags = exportAssignmentIsAlias(node) ? 2097152 /* Alias */ : 4 /* Property */;
      const symbol = declareSymbol(container.symbol.exports, container.symbol, node, flags, -1 /* All */);
      if (node.isExportEquals) {
        setValueDeclaration(symbol, node);
      }
    }
  }
  function bindNamespaceExportDeclaration(node) {
    if (some(node.modifiers)) {
      file.bindDiagnostics.push(createDiagnosticForNode2(node, Diagnostics.Modifiers_cannot_appear_here));
    }
    const diag2 = !isSourceFile(node.parent) ? Diagnostics.Global_module_exports_may_only_appear_at_top_level : !isExternalModule(node.parent) ? Diagnostics.Global_module_exports_may_only_appear_in_module_files : !node.parent.isDeclarationFile ? Diagnostics.Global_module_exports_may_only_appear_in_declaration_files : void 0;
    if (diag2) {
      file.bindDiagnostics.push(createDiagnosticForNode2(node, diag2));
    } else {
      file.symbol.globalExports = file.symbol.globalExports || createSymbolTable();
      declareSymbol(file.symbol.globalExports, file.symbol, node, 2097152 /* Alias */, 2097152 /* AliasExcludes */);
    }
  }
  function bindExportDeclaration(node) {
    if (!container.symbol || !container.symbol.exports) {
      bindAnonymousDeclaration(node, 8388608 /* ExportStar */, getDeclarationName(node));
    } else if (!node.exportClause) {
      declareSymbol(container.symbol.exports, container.symbol, node, 8388608 /* ExportStar */, 0 /* None */);
    } else if (isNamespaceExport(node.exportClause)) {
      setParent(node.exportClause, node);
      declareSymbol(container.symbol.exports, container.symbol, node.exportClause, 2097152 /* Alias */, 2097152 /* AliasExcludes */);
    }
  }
  function bindImportClause(node) {
    if (node.name) {
      declareSymbolAndAddToSymbolTable(node, 2097152 /* Alias */, 2097152 /* AliasExcludes */);
    }
  }
  function setCommonJsModuleIndicator(node) {
    if (file.externalModuleIndicator && file.externalModuleIndicator !== true) {
      return false;
    }
    if (!file.commonJsModuleIndicator) {
      file.commonJsModuleIndicator = node;
      if (!file.externalModuleIndicator) {
        bindSourceFileAsExternalModule();
      }
    }
    return true;
  }
  function bindObjectDefinePropertyExport(node) {
    if (!setCommonJsModuleIndicator(node)) {
      return;
    }
    const symbol = forEachIdentifierInEntityName(
      node.arguments[0],
      /*parent*/
      void 0,
      (id, symbol2) => {
        if (symbol2) {
          addDeclarationToSymbol(symbol2, id, 1536 /* Module */ | 67108864 /* Assignment */);
        }
        return symbol2;
      }
    );
    if (symbol) {
      const flags = 4 /* Property */ | 1048576 /* ExportValue */;
      declareSymbol(symbol.exports, symbol, node, flags, 0 /* None */);
    }
  }
  function bindExportsPropertyAssignment(node) {
    if (!setCommonJsModuleIndicator(node)) {
      return;
    }
    const symbol = forEachIdentifierInEntityName(
      node.left.expression,
      /*parent*/
      void 0,
      (id, symbol2) => {
        if (symbol2) {
          addDeclarationToSymbol(symbol2, id, 1536 /* Module */ | 67108864 /* Assignment */);
        }
        return symbol2;
      }
    );
    if (symbol) {
      const isAlias = isAliasableExpression(node.right) && (isExportsIdentifier(node.left.expression) || isModuleExportsAccessExpression(node.left.expression));
      const flags = isAlias ? 2097152 /* Alias */ : 4 /* Property */ | 1048576 /* ExportValue */;
      setParent(node.left, node);
      declareSymbol(symbol.exports, symbol, node.left, flags, 0 /* None */);
    }
  }
  function bindModuleExportsAssignment(node) {
    if (!setCommonJsModuleIndicator(node)) {
      return;
    }
    const assignedExpression = getRightMostAssignedExpression(node.right);
    if (isEmptyObjectLiteral(assignedExpression) || container === file && isExportsOrModuleExportsOrAlias(file, assignedExpression)) {
      return;
    }
    if (isObjectLiteralExpression(assignedExpression) && every(assignedExpression.properties, isShorthandPropertyAssignment)) {
      forEach(assignedExpression.properties, bindExportAssignedObjectMemberAlias);
      return;
    }
    const flags = exportAssignmentIsAlias(node) ? 2097152 /* Alias */ : 4 /* Property */ | 1048576 /* ExportValue */ | 512 /* ValueModule */;
    const symbol = declareSymbol(file.symbol.exports, file.symbol, node, flags | 67108864 /* Assignment */, 0 /* None */);
    setValueDeclaration(symbol, node);
  }
  function bindExportAssignedObjectMemberAlias(node) {
    declareSymbol(file.symbol.exports, file.symbol, node, 2097152 /* Alias */ | 67108864 /* Assignment */, 0 /* None */);
  }
  function bindThisPropertyAssignment(node) {
    Debug.assert(isInJSFile(node));
    const hasPrivateIdentifier = isBinaryExpression(node) && isPropertyAccessExpression(node.left) && isPrivateIdentifier(node.left.name) || isPropertyAccessExpression(node) && isPrivateIdentifier(node.name);
    if (hasPrivateIdentifier) {
      return;
    }
    const thisContainer = getThisContainer(
      node,
      /*includeArrowFunctions*/
      false,
      /*includeClassComputedPropertyName*/
      false
    );
    switch (thisContainer.kind) {
      case 262 /* FunctionDeclaration */:
      case 218 /* FunctionExpression */:
        let constructorSymbol = thisContainer.symbol;
        if (isBinaryExpression(thisContainer.parent) && thisContainer.parent.operatorToken.kind === 64 /* EqualsToken */) {
          const l = thisContainer.parent.left;
          if (isBindableStaticAccessExpression(l) && isPrototypeAccess(l.expression)) {
            constructorSymbol = lookupSymbolForPropertyAccess(l.expression.expression, thisParentContainer);
          }
        }
        if (constructorSymbol && constructorSymbol.valueDeclaration) {
          constructorSymbol.members = constructorSymbol.members || createSymbolTable();
          if (hasDynamicName(node)) {
            bindDynamicallyNamedThisPropertyAssignment(node, constructorSymbol, constructorSymbol.members);
          } else {
            declareSymbol(constructorSymbol.members, constructorSymbol, node, 4 /* Property */ | 67108864 /* Assignment */, 0 /* PropertyExcludes */ & ~4 /* Property */);
          }
          addDeclarationToSymbol(constructorSymbol, constructorSymbol.valueDeclaration, 32 /* Class */);
        }
        break;
      case 176 /* Constructor */:
      case 172 /* PropertyDeclaration */:
      case 174 /* MethodDeclaration */:
      case 177 /* GetAccessor */:
      case 178 /* SetAccessor */:
      case 175 /* ClassStaticBlockDeclaration */:
        const containingClass = thisContainer.parent;
        const symbolTable = isStatic(thisContainer) ? containingClass.symbol.exports : containingClass.symbol.members;
        if (hasDynamicName(node)) {
          bindDynamicallyNamedThisPropertyAssignment(node, containingClass.symbol, symbolTable);
        } else {
          declareSymbol(
            symbolTable,
            containingClass.symbol,
            node,
            4 /* Property */ | 67108864 /* Assignment */,
            0 /* None */,
            /*isReplaceableByMethod*/
            true
          );
        }
        break;
      case 312 /* SourceFile */:
        if (hasDynamicName(node)) {
          break;
        } else if (thisContainer.commonJsModuleIndicator) {
          declareSymbol(thisContainer.symbol.exports, thisContainer.symbol, node, 4 /* Property */ | 1048576 /* ExportValue */, 0 /* None */);
        } else {
          declareSymbolAndAddToSymbolTable(node, 1 /* FunctionScopedVariable */, 111550 /* FunctionScopedVariableExcludes */);
        }
        break;
      case 267 /* ModuleDeclaration */:
        break;
      default:
        Debug.failBadSyntaxKind(thisContainer);
    }
  }
  function bindDynamicallyNamedThisPropertyAssignment(node, symbol, symbolTable) {
    declareSymbol(
      symbolTable,
      symbol,
      node,
      4 /* Property */,
      0 /* None */,
      /*isReplaceableByMethod*/
      true,
      /*isComputedName*/
      true
    );
    addLateBoundAssignmentDeclarationToSymbol(node, symbol);
  }
  function addLateBoundAssignmentDeclarationToSymbol(node, symbol) {
    if (symbol) {
      (symbol.assignmentDeclarationMembers || (symbol.assignmentDeclarationMembers = /* @__PURE__ */ new Map())).set(getNodeId(node), node);
    }
  }
  function bindSpecialPropertyDeclaration(node) {
    if (node.expression.kind === 110 /* ThisKeyword */) {
      bindThisPropertyAssignment(node);
    } else if (isBindableStaticAccessExpression(node) && node.parent.parent.kind === 312 /* SourceFile */) {
      if (isPrototypeAccess(node.expression)) {
        bindPrototypePropertyAssignment(node, node.parent);
      } else {
        bindStaticPropertyAssignment(node);
      }
    }
  }
  function bindPrototypeAssignment(node) {
    setParent(node.left, node);
    setParent(node.right, node);
    bindPropertyAssignment(
      node.left.expression,
      node.left,
      /*isPrototypeProperty*/
      false,
      /*containerIsClass*/
      true
    );
  }
  function bindObjectDefinePrototypeProperty(node) {
    const namespaceSymbol = lookupSymbolForPropertyAccess(node.arguments[0].expression);
    if (namespaceSymbol && namespaceSymbol.valueDeclaration) {
      addDeclarationToSymbol(namespaceSymbol, namespaceSymbol.valueDeclaration, 32 /* Class */);
    }
    bindPotentiallyNewExpandoMemberToNamespace(
      node,
      namespaceSymbol,
      /*isPrototypeProperty*/
      true
    );
  }
  function bindPrototypePropertyAssignment(lhs, parent2) {
    const classPrototype = lhs.expression;
    const constructorFunction = classPrototype.expression;
    setParent(constructorFunction, classPrototype);
    setParent(classPrototype, lhs);
    setParent(lhs, parent2);
    bindPropertyAssignment(
      constructorFunction,
      lhs,
      /*isPrototypeProperty*/
      true,
      /*containerIsClass*/
      true
    );
  }
  function bindObjectDefinePropertyAssignment(node) {
    let namespaceSymbol = lookupSymbolForPropertyAccess(node.arguments[0]);
    const isToplevel = node.parent.parent.kind === 312 /* SourceFile */;
    namespaceSymbol = bindPotentiallyMissingNamespaces(
      namespaceSymbol,
      node.arguments[0],
      isToplevel,
      /*isPrototypeProperty*/
      false,
      /*containerIsClass*/
      false
    );
    bindPotentiallyNewExpandoMemberToNamespace(
      node,
      namespaceSymbol,
      /*isPrototypeProperty*/
      false
    );
  }
  function bindSpecialPropertyAssignment(node) {
    var _a;
    const parentSymbol = lookupSymbolForPropertyAccess(node.left.expression, blockScopeContainer) || lookupSymbolForPropertyAccess(node.left.expression, container);
    if (!isInJSFile(node) && !isFunctionSymbol(parentSymbol)) {
      return;
    }
    const rootExpr = getLeftmostAccessExpression(node.left);
    if (isIdentifier(rootExpr) && ((_a = lookupSymbolForName(container, rootExpr.escapedText)) == null ? void 0 : _a.flags) & 2097152 /* Alias */) {
      return;
    }
    setParent(node.left, node);
    setParent(node.right, node);
    if (isIdentifier(node.left.expression) && container === file && isExportsOrModuleExportsOrAlias(file, node.left.expression)) {
      bindExportsPropertyAssignment(node);
    } else if (hasDynamicName(node)) {
      bindAnonymousDeclaration(node, 4 /* Property */ | 67108864 /* Assignment */, "__computed" /* Computed */);
      const sym = bindPotentiallyMissingNamespaces(
        parentSymbol,
        node.left.expression,
        isTopLevelNamespaceAssignment(node.left),
        /*isPrototypeProperty*/
        false,
        /*containerIsClass*/
        false
      );
      addLateBoundAssignmentDeclarationToSymbol(node, sym);
    } else {
      bindStaticPropertyAssignment(cast(node.left, isBindableStaticNameExpression));
    }
  }
  function bindStaticPropertyAssignment(node) {
    Debug.assert(!isIdentifier(node));
    setParent(node.expression, node);
    bindPropertyAssignment(
      node.expression,
      node,
      /*isPrototypeProperty*/
      false,
      /*containerIsClass*/
      false
    );
  }
  function bindPotentiallyMissingNamespaces(namespaceSymbol, entityName, isToplevel, isPrototypeProperty, containerIsClass) {
    if ((namespaceSymbol == null ? void 0 : namespaceSymbol.flags) & 2097152 /* Alias */) {
      return namespaceSymbol;
    }
    if (isToplevel && !isPrototypeProperty) {
      const flags = 1536 /* Module */ | 67108864 /* Assignment */;
      const excludeFlags = 110735 /* ValueModuleExcludes */ & ~67108864 /* Assignment */;
      namespaceSymbol = forEachIdentifierInEntityName(entityName, namespaceSymbol, (id, symbol, parent2) => {
        if (symbol) {
          addDeclarationToSymbol(symbol, id, flags);
          return symbol;
        } else {
          const table = parent2 ? parent2.exports : file.jsGlobalAugmentations || (file.jsGlobalAugmentations = createSymbolTable());
          return declareSymbol(table, parent2, id, flags, excludeFlags);
        }
      });
    }
    if (containerIsClass && namespaceSymbol && namespaceSymbol.valueDeclaration) {
      addDeclarationToSymbol(namespaceSymbol, namespaceSymbol.valueDeclaration, 32 /* Class */);
    }
    return namespaceSymbol;
  }
  function bindPotentiallyNewExpandoMemberToNamespace(declaration, namespaceSymbol, isPrototypeProperty) {
    if (!namespaceSymbol || !isExpandoSymbol(namespaceSymbol)) {
      return;
    }
    const symbolTable = isPrototypeProperty ? namespaceSymbol.members || (namespaceSymbol.members = createSymbolTable()) : namespaceSymbol.exports || (namespaceSymbol.exports = createSymbolTable());
    let includes = 0 /* None */;
    let excludes = 0 /* None */;
    if (isFunctionLikeDeclaration(getAssignedExpandoInitializer(declaration))) {
      includes = 8192 /* Method */;
      excludes = 103359 /* MethodExcludes */;
    } else if (isCallExpression(declaration) && isBindableObjectDefinePropertyCall(declaration)) {
      if (some(declaration.arguments[2].properties, (p) => {
        const id = getNameOfDeclaration(p);
        return !!id && isIdentifier(id) && idText(id) === "set";
      })) {
        includes |= 65536 /* SetAccessor */ | 4 /* Property */;
        excludes |= 78783 /* SetAccessorExcludes */;
      }
      if (some(declaration.arguments[2].properties, (p) => {
        const id = getNameOfDeclaration(p);
        return !!id && isIdentifier(id) && idText(id) === "get";
      })) {
        includes |= 32768 /* GetAccessor */ | 4 /* Property */;
        excludes |= 46015 /* GetAccessorExcludes */;
      }
    }
    if (includes === 0 /* None */) {
      includes = 4 /* Property */;
      excludes = 0 /* PropertyExcludes */;
    }
    declareSymbol(symbolTable, namespaceSymbol, declaration, includes | 67108864 /* Assignment */, excludes & ~67108864 /* Assignment */);
  }
  function isTopLevelNamespaceAssignment(propertyAccess) {
    return isBinaryExpression(propertyAccess.parent) ? getParentOfBinaryExpression(propertyAccess.parent).parent.kind === 312 /* SourceFile */ : propertyAccess.parent.parent.kind === 312 /* SourceFile */;
  }
  function bindPropertyAssignment(name, propertyAccess, isPrototypeProperty, containerIsClass) {
    let namespaceSymbol = lookupSymbolForPropertyAccess(name, blockScopeContainer) || lookupSymbolForPropertyAccess(name, container);
    const isToplevel = isTopLevelNamespaceAssignment(propertyAccess);
    namespaceSymbol = bindPotentiallyMissingNamespaces(namespaceSymbol, propertyAccess.expression, isToplevel, isPrototypeProperty, containerIsClass);
    bindPotentiallyNewExpandoMemberToNamespace(propertyAccess, namespaceSymbol, isPrototypeProperty);
  }
  function isExpandoSymbol(symbol) {
    if (symbol.flags & (16 /* Function */ | 32 /* Class */ | 1024 /* NamespaceModule */)) {
      return true;
    }
    const node = symbol.valueDeclaration;
    if (node && isCallExpression(node)) {
      return !!getAssignedExpandoInitializer(node);
    }
    let init = !node ? void 0 : isVariableDeclaration(node) ? node.initializer : isBinaryExpression(node) ? node.right : isPropertyAccessExpression(node) && isBinaryExpression(node.parent) ? node.parent.right : void 0;
    init = init && getRightMostAssignedExpression(init);
    if (init) {
      const isPrototypeAssignment = isPrototypeAccess(isVariableDeclaration(node) ? node.name : isBinaryExpression(node) ? node.left : node);
      return !!getExpandoInitializer(isBinaryExpression(init) && (init.operatorToken.kind === 57 /* BarBarToken */ || init.operatorToken.kind === 61 /* QuestionQuestionToken */) ? init.right : init, isPrototypeAssignment);
    }
    return false;
  }
  function getParentOfBinaryExpression(expr) {
    while (isBinaryExpression(expr.parent)) {
      expr = expr.parent;
    }
    return expr.parent;
  }
  function lookupSymbolForPropertyAccess(node, lookupContainer = container) {
    if (isIdentifier(node)) {
      return lookupSymbolForName(lookupContainer, node.escapedText);
    } else {
      const symbol = lookupSymbolForPropertyAccess(node.expression);
      return symbol && symbol.exports && symbol.exports.get(getElementOrPropertyAccessName(node));
    }
  }
  function forEachIdentifierInEntityName(e, parent2, action) {
    if (isExportsOrModuleExportsOrAlias(file, e)) {
      return file.symbol;
    } else if (isIdentifier(e)) {
      return action(e, lookupSymbolForPropertyAccess(e), parent2);
    } else {
      const s = forEachIdentifierInEntityName(e.expression, parent2, action);
      const name = getNameOrArgument(e);
      if (isPrivateIdentifier(name)) {
        Debug.fail("unexpected PrivateIdentifier");
      }
      return action(name, s && s.exports && s.exports.get(getElementOrPropertyAccessName(e)), s);
    }
  }
  function bindCallExpression(node) {
    if (!file.commonJsModuleIndicator && isRequireCall(
      node,
      /*requireStringLiteralLikeArgument*/
      false
    )) {
      setCommonJsModuleIndicator(node);
    }
  }
  function bindClassLikeDeclaration(node) {
    if (node.kind === 263 /* ClassDeclaration */) {
      bindBlockScopedDeclaration(node, 32 /* Class */, 899503 /* ClassExcludes */);
    } else {
      const bindingName = node.name ? node.name.escapedText : "__class" /* Class */;
      bindAnonymousDeclaration(node, 32 /* Class */, bindingName);
      if (node.name) {
        classifiableNames.add(node.name.escapedText);
      }
    }
    const { symbol } = node;
    const prototypeSymbol = createSymbol(4 /* Property */ | 4194304 /* Prototype */, "prototype");
    const symbolExport = symbol.exports.get(prototypeSymbol.escapedName);
    if (symbolExport) {
      if (node.name) {
        setParent(node.name, node);
      }
      file.bindDiagnostics.push(createDiagnosticForNode2(symbolExport.declarations[0], Diagnostics.Duplicate_identifier_0, symbolName(prototypeSymbol)));
    }
    symbol.exports.set(prototypeSymbol.escapedName, prototypeSymbol);
    prototypeSymbol.parent = symbol;
  }
  function bindEnumDeclaration(node) {
    return isEnumConst(node) ? bindBlockScopedDeclaration(node, 128 /* ConstEnum */, 899967 /* ConstEnumExcludes */) : bindBlockScopedDeclaration(node, 256 /* RegularEnum */, 899327 /* RegularEnumExcludes */);
  }
  function bindVariableDeclarationOrBindingElement(node) {
    if (inStrictMode) {
      checkStrictModeEvalOrArguments(node, node.name);
    }
    if (!isBindingPattern(node.name)) {
      const possibleVariableDecl = node.kind === 260 /* VariableDeclaration */ ? node : node.parent.parent;
      if (isInJSFile(node) && isVariableDeclarationInitializedToBareOrAccessedRequire(possibleVariableDecl) && !getJSDocTypeTag(node) && !(getCombinedModifierFlags(node) & 32 /* Export */)) {
        declareSymbolAndAddToSymbolTable(node, 2097152 /* Alias */, 2097152 /* AliasExcludes */);
      } else if (isBlockOrCatchScoped(node)) {
        bindBlockScopedDeclaration(node, 2 /* BlockScopedVariable */, 111551 /* BlockScopedVariableExcludes */);
      } else if (isParameterDeclaration(node)) {
        declareSymbolAndAddToSymbolTable(node, 1 /* FunctionScopedVariable */, 111551 /* ParameterExcludes */);
      } else {
        declareSymbolAndAddToSymbolTable(node, 1 /* FunctionScopedVariable */, 111550 /* FunctionScopedVariableExcludes */);
      }
    }
  }
  function bindParameter(node) {
    if (node.kind === 348 /* JSDocParameterTag */ && container.kind !== 330 /* JSDocSignature */) {
      return;
    }
    if (inStrictMode && !(node.flags & 33554432 /* Ambient */)) {
      checkStrictModeEvalOrArguments(node, node.name);
    }
    if (isBindingPattern(node.name)) {
      bindAnonymousDeclaration(node, 1 /* FunctionScopedVariable */, "__" + node.parent.parameters.indexOf(node));
    } else {
      declareSymbolAndAddToSymbolTable(node, 1 /* FunctionScopedVariable */, 111551 /* ParameterExcludes */);
    }
    if (isParameterPropertyDeclaration(node, node.parent)) {
      const classDeclaration = node.parent.parent;
      declareSymbol(classDeclaration.symbol.members, classDeclaration.symbol, node, 4 /* Property */ | (node.questionToken ? 16777216 /* Optional */ : 0 /* None */), 0 /* PropertyExcludes */);
    }
  }
  function bindFunctionDeclaration(node) {
    if (!file.isDeclarationFile && !(node.flags & 33554432 /* Ambient */)) {
      if (isAsyncFunction(node)) {
        emitFlags |= 4096 /* HasAsyncFunctions */;
      }
    }
    checkStrictModeFunctionName(node);
    if (inStrictMode) {
      checkStrictModeFunctionDeclaration(node);
      bindBlockScopedDeclaration(node, 16 /* Function */, 110991 /* FunctionExcludes */);
    } else {
      declareSymbolAndAddToSymbolTable(node, 16 /* Function */, 110991 /* FunctionExcludes */);
    }
  }
  function bindFunctionExpression(node) {
    if (!file.isDeclarationFile && !(node.flags & 33554432 /* Ambient */)) {
      if (isAsyncFunction(node)) {
        emitFlags |= 4096 /* HasAsyncFunctions */;
      }
    }
    if (currentFlow) {
      node.flowNode = currentFlow;
    }
    checkStrictModeFunctionName(node);
    const bindingName = node.name ? node.name.escapedText : "__function" /* Function */;
    return bindAnonymousDeclaration(node, 16 /* Function */, bindingName);
  }
  function bindPropertyOrMethodOrAccessor(node, symbolFlags, symbolExcludes) {
    if (!file.isDeclarationFile && !(node.flags & 33554432 /* Ambient */) && isAsyncFunction(node)) {
      emitFlags |= 4096 /* HasAsyncFunctions */;
    }
    if (currentFlow && isObjectLiteralOrClassExpressionMethodOrAccessor(node)) {
      node.flowNode = currentFlow;
    }
    return hasDynamicName(node) ? bindAnonymousDeclaration(node, symbolFlags, "__computed" /* Computed */) : declareSymbolAndAddToSymbolTable(node, symbolFlags, symbolExcludes);
  }
  function getInferTypeContainer(node) {
    const extendsType = findAncestor(node, (n) => n.parent && isConditionalTypeNode(n.parent) && n.parent.extendsType === n);
    return extendsType && extendsType.parent;
  }
  function bindTypeParameter(node) {
    if (isJSDocTemplateTag(node.parent)) {
      const container2 = getEffectiveContainerForJSDocTemplateTag(node.parent);
      if (container2) {
        Debug.assertNode(container2, canHaveLocals);
        container2.locals ?? (container2.locals = createSymbolTable());
        declareSymbol(
          container2.locals,
          /*parent*/
          void 0,
          node,
          262144 /* TypeParameter */,
          526824 /* TypeParameterExcludes */
        );
      } else {
        declareSymbolAndAddToSymbolTable(node, 262144 /* TypeParameter */, 526824 /* TypeParameterExcludes */);
      }
    } else if (node.parent.kind === 195 /* InferType */) {
      const container2 = getInferTypeContainer(node.parent);
      if (container2) {
        Debug.assertNode(container2, canHaveLocals);
        container2.local{"version":3,"file":"ast-converter.d.ts","sourceRoot":"","sources":["../src/ast-converter.ts"],"names":[],"mappings":"AAAA,OAAO,KAAK,EAAE,UAAU,EAAE,MAAM,YAAY,CAAC;AAE7C,OAAO,KAAK,EAAE,OAAO,EAAE,MAAM,WAAW,CAAC;AAIzC,OAAO,KAAK,EAAE,aAAa,EAAE,MAAM,iBAAiB,CAAC;AAErD,OAAO,KAAK,EAAE,QAAQ,EAAE,MAAM,aAAa,CAAC;AAE5C,wBAAgB,YAAY,CAC1B,GAAG,EAAE,UAAU,EACf,aAAa,EAAE,aAAa,EAC5B,sBAAsB,EAAE,OAAO,GAC9B;IAAE,MAAM,EAAE,QAAQ,CAAC,OAAO,CAAC;IAAC,OAAO,EAAE,OAAO,CAAA;CAAE,CAyDhD"}                                                ��RMtv`y�z��+Fmn\b_��['I,�T%� �,^5�{c��6�5�F:,_|\Z~���g����U�(f/̫1�5��[�:�H%i��W�`�vb�ҹ�*ؔ�%��vaRx�4�<�U�$��qd\�������UH��[�5��88tQg�2�zeH3zd��yϙ^�YF���1p铭uTw
��-ϖ,S)��於'�g_W�-�d1�E�v�$t����uaP9�kDl�,���� �8Sh��t�x��>����?�m�k�P
������po�S�D�P[ߕm�7�le.���+�����>��"i�]��	���M����ك���z����E��jM�d�5��Qp+��]��|X��ek������4FvO���s�!Õ$!������&�A���rIC���lH�NxZ���z�ad�hÆ�	$z��.�A���b�1�)��hӂek�lz2�Tx`��p�E�j/&C ���X$sԇE�Ѣ������ܐSͨ��Ȩ�ҵɕ��6_(."���3]�{��ls%����S�-m�̣`p� 3�+���#G��T���/���rO?����~��&���Ӑ�S�ٲs�\�Z���o?n�#�n�3����84��4M��®ڿ��E �@�W�e��kT�|v�Ǽ O��z��:8�-5  誁�B�X�| 5fo��H@�e�3Fc�[h����9�e_��g��J�#t�.�{t&	�Wv� ���5�ߍ$�E�]Ϙ�41*���ë*W����V�vɣ"��n��354��r��V��*M~�3�� �PH��%[-�:�R̳���RJ�'��I[�O��P�����7���&J�"M�cB=A,|��q{�s�T��:�@�OT}Y+]�}&R�hHM �������ڢ��I��O���ܝ����ǜ��dTo>!z/��o��i +Baʮ MN�[���2mUU���Ƥ 8^�|Alܣ~/������㔼�&�t�j��k#h���#
�lɒl�V%���l%(ܖ�>��f�i��Ҍ��JH���?�p�H?J)ǂ:?�+=��VPw���fe��H�6p	`�wg���m�ӫ7=�l7�Y�p�mN���� B"|�,L(��"��*6��`�w��VĨ��-���x��A5�3�Վ�r*Α������ܺ5��r����p1��Kѭb�Ҳoc���grlo`�@lN�86\�������x��l�#���悲�����_Ǜ�;��Ņ;nk2��P��	j�u92>�,rapӴ$�Tj��$�*Cȃ�+��pТ��\ �XZ�]=_"�]����m ���EYE<I`y�'M �	T;nQ��Z�^����)�u������u�牎H��XBS����rT��#��^#o!0 ~�I�^}.��-LSf$V����������xI�(��zF�g��M�B���W|ti�h�`i�-�K��������/'P�/�� l+=10���|���?�L�K,�ɛ%Ν4;|�6�J3�  �Q�Ez�P�"vj*=�X���?�
�!���(��¾.<���I]� G�ً{d���mL#3Vw-j+�H�N�0R��ςd�WA�Y萡��n���0�
��-�Տy��`r_�@�9�+�*T��}��d������:&)Ͽh��ܦn�x8�}*e�NyIL��Zh?ե34�(�/���:�ґ�`H0)���X-�u�U�A�=���2��d���v�y��Pr��b�#�+g�g����������_'8:�liӾ/|�����f:���/G��W�q.E��q��$�AG�>��8�+[�Q6�|�6	`DŞܢ:P¬*��x�	�����~�g�s	�Q�d�\��S7.Ժ�Won<�
�k�a�:�ٞ{05q7U�V�FY\k�Z�Q-��b���g��U����UZ��`�T�1})&��#���s��p�B�tB��b�����O`pM�Ek .�,}+�,��a��0�k�ʁ\6�%o�ӕ�>�-p]ӹ-펺Ө��h?��鱩R���5�Z��W����l�U�����̭J��]��FuqC����bY�B�/s�)��l(I@�7��/��LE����"B}�ۑH����GY��(��E��4@�;�!C�Qga�o͐ʱş|�zꑙ��^?��~q:P��u�s��3�@p&�%�p�[���$6���v_	֨|zȮ�����K��2mk0���׶OE����3	��D/��U�����k1H�w�Y
g��<�pbS����Z�b��%��7{�Z�f"��u�I������k�f���7���(� c��2s0�
��ڙ�P��N�Q$�����I9�3$��Ҙ�����5}[�*�&����� `(�W'Fb�|u��6,L�M6�ZeI���J#32�=�`���$ t;I�Si0,QeFT1��ic��å�'�!5�,�W���Uh[Y�"�'_�W�0��o����)'�P������A�����f3�Z/�c�P'.2��E'mA�j1��d�a`�" �I6���a_İ����� X��o (��Чdu49د�T{��LCp��ak\��I�5���'�Ő�P��Cݨ��t���G�&�}�^8��Ћ�i�O�.Ế�s�;(qְ���ر�U�'y#7�����!K�k��FnB9#Y�&r��XU;:}R��f1��LH�g��ꙻm�,�*��p��[V�SR��6U�iX��C�O���\�W
J�	��_�.����u`'+����UJ�w��]�����	�/��;�Y��p��,'2�_��IUI���5rC�hE�'��v�#גK0�®^�"��BAǭ#��ͺ�I�僛�⅓8	F0Q0����Vm+��Z����f(q5ͼ���[��+���<�+0^��j�6A�F�Ot�גn�:t�/#d.�,�z5�n������'�
\����XS!��2I��݇9�=ɮ������~pA��c4Cfdb�������\=*�k�㣱AE1V��1�o��.��I�'����x	�2"jI��������7�Z����b����,_� N���~hrc��!�)�>�P��\z�Y��K�
 �F��у�)F�R)��,٩�1�3	1--�"���%e�8� ��������®n��L�筬�:;7�"��5Ko�?����G�o�z&$�k
�����/@�����i�.���̲聘�Ǐq���Ţ���q}	�~H��ߢ� �b�WX�t|8g�+{iò ��s(��6���o��T("���ˡ��L� N��b`b�����Ė
O΋-�֏��=�g;a���&H�A��z��Xng�y�>���Xp����c��M��_����ź���M,��E-
qۥ��E,�i���+d�+�F��0j"��%ǔ!�Š��0�Rl�dy��v�	жW�� t�1��2�W����+�_J&!�c0rI�9g���+��ͼ6Ɲp�������*�un��*&�
1T����.a�o�$�� �0)�2�|�;Yg�}K��j)b������P��X�2�R��p^��\�Ck{�sst����|��}�I��ua�ĺ-��	�v��]�B�� �����#�\D�����)�$xc�t�|�k`�+Q���m�P�A�J�X�~U3.Q�D�L]����89�
#���l�[�l�X� fq31���@#%�¾�c�cǮ��KV��K̮2Zv����k�yi�9c�aH�}gxY�s��Z�HӾ=J����!�bo�`�F�9~rIik/z��hӧ��ۄW'|/��٫*nh�3#��WI��d���ɟ�ߦ���˸C����{FU�bC��4<BX��+h���/��5P��z�Usi�h�����mO��nv��U	�t�J+�V ��v
DɄ�OY�56�R�ˀ~��43.$��p'�x�5�lGڂ�ǎ����C����
w׌7��i��0Ņ������`f��ی�Ƌ �tq9$a��|� ��Q_�Y*�Hm���_��w��)�&�5Z�'�`����>|�ࢊ�{��B�F�8�����gM%��a�HÈِ�"G�Y���x0F�gH1�W���Qį���4H�uC�Wi�+R�N�Ʒ�<m�� tYԝ���BCJ�Ɔ߆&�!�)3�.xgi�%��B���3�W"RVD�F4�&�/.��0�P_VWA��|��_�e�'M;L<�}`����@,C#�(@١f�do��s��B�\t��%�Ԉ,Q��3B��o��TqL
��,3�L�岂(M6e�Ч�+���� �7cE������@U劆4>�̪�s��" �0���NJ�U��1�_qo��Anch�ۣ�R�(�O1��Wi��t?�z�����@�A���mq�r����8�u,�Z��T� ���+vd�Q[k�+J��O�:f)�f�_1�Z�\�ш���8�&�����_51��n4+�P�E�"�b�*-Sk�5�� ��a����a�]��3�z4��A+�Ī�|��T���әi��B@���2ZC�� X������(�XJ�f0��K�܈����b���aͲ~w �ӝI�!(ӕ�g�:2�ɹP��u44MN�t�Sx�Wm��WnŪX֗�r	!Q�<���,��0օ%%dg��'��ǝ��+�3b���cΩ;������$!��Fx�����]ǺD�؋�&����k�����b
^ ��������H��c�E<# ��	�� D*�f�^�p&ľ�?}u�W��Ȍ��q��9�)\����S����p\��y��EE?�0�,}ɛd#~���<��UhzUx�C�Gy��a�fF�_1���N����y?c�=����D��;�w����3���K���� ���X���d��*���&$�Y���|W���(}2x�.~�~��~��d#Ma�.�
��:�<��|S���1��{u�����N��(ō9S��#���ԧ{�ɠ��8��^�G�H%2���k^V��tw����l���H׼��7?��ni[�u������g�W��~[�	�p|5k��EMLT�ZEV�Y��\�UL_��aw�x9lLDyT��zPW�,���X�;&�%ɪ�9�In��#�*����HK\�$��}%{>�I�������ak�`����xE�RJ�T�G�u1<T����5�Y�������/d�����u򮍥">G�d!�7q&������Jt��菵�tu�M�9�l�̇��'�N}6���䫔�������^�]<�cEH�\����8#֙4��t~�<��܋����:a�ۅ_����Y��I$i)��m�-���?{#��e4���������K5�[�{�|6�x;�'\%�������^A�B �Ad׹E�37��m��:�ן5፥L:�\�*����]�E�wm�D0m��7$X��ȬaV�io����5�y.��((�_��|������9�w�dH=�c ��ݬ|HL?�ʠ�;�T�������8RzEO�'"]������}���&�.
��C;�1���?x�Pc;�&'H �Ӣ��  �`!�G�����;y�.��S|���R2~��u�S�x^Q�{�?���[w����&�#� 6��c�$�K�,V��I�ߜ�f�'��*2�zFK��a$��Ճ��%}i4���[����_���[�#��G��jDL�=�IW/�5	L$�sJOa���"����Y�/N�_%� ��B�Z��Bg^jm�uW;�Q���|��m��S�ͫ]�%P ��
CA�ߴ�]�f(V���a�N�t)�?�{�f�)��p֖�W(�v ��՜y�0���uo��c��KJ����M�I�����^��R7�~���+!'���c�f^����g4��y��Q!��	~�^a?�n`�<���e�!O�L���y�C�@~��?h�n�x1{-��]�_�}�n��q� ��-ң�H�Ik�iu7�1�R~\h�V�U�	Z�6%����;!˙�-Oh�k�fLeAt���Gh &��㋄��㬗F���ߴ�YFĈ��"3��r���HM����GG�]�ލ��=��A�&](G���1�g'k�d&��	i�S��s����~�ō��T�/���Hy�9�ߏ{�f�Ч�,�R�fT��G���3L/� V��jq��.���m A�0 �
�<B	9����Q�B�j@��i,+>É\�Dte�����a�g}˛�_�C�֫��+�me-A�	|,b�Ì�mm���[^_uzL��w;0��dY}���'(> "�}Oཱི̀�'ȋ`4��s��FW}�,��$�,��4<vZ8�W:J|ڗ���W��v���F�Z�ݥ5j7p��� ���mw���ɸ�"�v�9�P�ڥ��@VἺ��8�j��O���_ �|:*�����o �n��JC7�=�sf*毯���_B�C��>�Q����HN�Ѭi�wؠ�XK�a��c5�� �>,/�r��5�a�HJ_�[���s��B�WK�7f�{.��6Ǭr_4گ]|,3[D�G$-A.D���۞����c��ѕŪ^�s�(k�X���_qI������ OA9���5�;����lҭgI�v��7�߿h��7��!Z�h��@�ىI�_�9��Vr%�Xf��G�:�նX�H�����ڗ��P�04s<�b[�R�k�<G'�I��Ȧ*�e��XLuh�f��όǢl�M��I���0��~yL]���(��|S�%�N^���%�u+>�N H���]��}1�VV�S�mͫh"���Ζ�$@H�@�ї+}�Y���5����Y%�8i̙�$ZC٤�fO���ꕁ�L���1j����һ�6&-���!��`��ǘ �ט�C�nxw���;����EK�y���R��y���͊��\�^�}����$�4�����7L��`���,�7��SZg���|�ZB�B�sG�i���]Hģ��^S�M���;S�?B���l�2�{��+�&�ٺ_�����g�I�s�JJ�:����*䶼4�DgFT�r",�Jh�nT�,J����j��㭄�A|�g{���J-�6���и�;	��Ud/\[�6P������p)i�U-��Ev��9~\˹����>ʗ��Y
@��,��S��u/��������gr��_�1��vq\v���i���tI�|�*��O[�]G��*�B�I&1bdϩ��L&���LG��g�:̈́�8!Bc8(���w	O��t[0��� 0zCmSHti�J<z��H��FӴg �s�=gA8�l�y��"�gh�F��`Ѧ�U�S�=
eƉQ��l0o�8}H����,O������v�ZP���X�^Ώ��9-%���qL�P�u��7.���o��>�j��*�@D!%r!�؞Y���?�փ�՟s��Q7���	�L ��y hZX�{�m�{�ӳJ��7�Im�%��G����z|�O��n�����Ym��S�Ó��C�&ъ��Vy�H��4*�ߦZ�4Gȃ�`��o��Y�Rƕ��]�B��g��>>�_	w�t�^5?�o�ls�dO��׭�����6��<�~zE�OS<LXk.��
;xk�z��{8��y�pQ՜N���}��7��<�0ȑ�W�۰g�C�	2B��1��S`����P��`�E�G(��B�� ^V��?��:ru����64��@��Ļn��U0��϶vΛuk�&x\}��m7�+iϽv�����4�e�,�Lg7}u�**�wz	&�\�l��-���8�����;y��Vn-����j��:�����������ߚ�� �9���n�8�5��A1�aK�2�Lu�w�J���J����x�Uu�N|^���I�0�P�`Ԅ��fw�u��ǎ���U��)��s'Y��-��/fD}Wű�vV����Y�ڠ��/��A�+����i���������Cw�ֽ�P���K{�u�yc����W������	ܞ���<�C�qEK����U9g�l�RV�eb@�4FL��"�|����	ݯ@(�|�%�-�ET����k4����ħL����z�oO&���!q2 ����D��m ��Ƶ��x8��=3΋��<{ �ۡ�x�K5|����	4���lw8[�t�['�2/��̘d�ц��O�/�i��W:�Ã���O��#�![⋸s�L?�VJ�$��dX"sb���G�c������.���=x�C�U]��ӝ4O�M\L�EMq�I��W�+ ��9b>�xⶒ���-&pU/-����������چ�[.4o�tzϮ�LR�+� �G˽63�>	���9����#��� �5�!3�r�-��]6E^�T�>�!ip�l���`KYsP�S�,0����K�=��욖J�� U闁EtL�va^�[ļ�W%r
EȤ~�:�h2�1�"�P�i�r���;'[�܀o�a��H&C՚ב#�Ci�\��V�Jg�a=��H���!T X�َ.�/%��<rRDo�8fkf��1�&�_���I�!HO�[�JdBg��7�S�G��[u�Ku�Aܼt����p���]�;�VڪV�11������	��('M�����Q���5�������h�˱�;��i��G>c4�
���lYO���&�i�ڬ�]��6���!)��r��Țm#�l��^Y�pB`�ǟ
i��Đ%�}��&Ԁ��{�#=e=�w���OD�z��m�Ȝ�OB�4A�k�����i��q6� ��I֏kӂ�Ly���R�:��v��UFQ����9��B�rY��H�Ν�
d��fI�<�m*��<���y#AΥ��4���˕�U�_T�w_�o�͌��_}_F1Ҵ|�xQ'�50���
�4*�}Q_����P<��0Ht<$���`���b?����{� B�M����� �Ͱ�.��|�;v}sH�|��t��]��[[\�:8�[�|�5c�d��S!���9�s�i���G=;Ե;�H�-N��nxq�A=[�tC��v7@�E�׏�K!Pz*�?�a�g�Qe{jkZ�*���~��
����X��֧�pP��#��� l>��/᳻�T�˥���G�%t���`$Bi�i������"�gy�J7�8?�e�꘏�#u�=�*��J���sp(��C��q���%&Ϧn%���l�_�KW�=��}&�]���ʳ�^')�	˫����:F.�k�%���G#זEGf�3l��Q��t����y��B�l���K� i!�D��F�>��g@g��'�A�T�i��eE�ϨJ�엸"?��& �X|{	�It�����~ƾ�Y*5���pܜFʙ������f�R<�����5?L�M�֖���m�(���,�R�t���m�}�y:@/�&��7�yeN/�����[���P_H6�-*%(�4=_�b����L��g�r� $��]�@�D�f�BPZUa�:$K5�z�����N	��T��!�;����Ɖ��Ý�A)��&�Ai2K/�y���E��G֮���3��i_lt���o�������i#�'��7L`�����鈓K\}H������ �J�`8�?��J �����*�F�a)z����� Ow�B�g��Z��4����x&�ǂЈ �ZF�FR�PG�X��Zo����5�b�`�h.+��uh�I�r�Z�yJ�^2�.����
��Z�bL��F�?B� �>��[T%	P�F�h��;�Ȩ�`hX'7�,R�74�� �e���l�3�1�L�D̰�P�U��2���	�Z����d�{r��e`ڗI5�R��K@�}WAXP2�QZs[
eK
>ė��-N��ަ����a+�bk$e+48Dj�%2}����2@w;�곷�j�v���j�޺�R� %�^W��jW�'���~�=E�̘|�)����TޠT��0B��t4O�3�u_��
�`��W��3IL�o����:_�<��[]�L�Ӧ�/�5=H�|Y��i�%��ʏO���y���ܢ�����J9���#,�T�Z	FŬ����n*���"
�{t!kw����cQ`����[C��Ҧ}y������XP�"����#}j$�+�k�Я��TԤH��� �̅��O�~�� ��O��,j^������\��A��	���0|<�_?+�o�Ro1q�<� ��)-դK=~;)Cn�vug��*�[lTt�ᕃߟ!%��c��s�R>���Pf7=1�`4+YF�OJ�~�iƧ��q������&��b�wI���/�]�X��W�Ќz�!`�j�?s���Q���}�+=}JŔ���Ϙ�b2ʳ���r��T�����~��z�xE;� (`��d$�dAi�KP��]v����h�)��������6'iUY8�k�_��]�����A�AT�iF�������(�b0�E�������m?���`L	ʎ]gϵ}IO�--ЈCK�"���,�uLQ?:ߚWI5�|(U���wb'l�y4r��T�1��*�s���i�y!�])�r��#d�)x�~��$8�/J!�9�:�����~NRH��g��̔:�Wۏ~�n���L��b����W�&�]C _mԎ*��悐K�E��)�g����p�C��d�\@���N�D��'����v�����m�J�w�+j���v�{X�-y�6}�(T.T���~�Ԑ�{yIH� h��؄u ���x�f�F0G�"��C!�U��@%[1Hق�"��C%02^@�G@u`C��gc����o	�7�ₖG���y�&�r�i�/�Z��@��~U��Ox$���&��FbG�J�䶆�m������.�A�̠���ж ��@1�t����B���).�ŝXXR'<+���h�٥���e��Ӂ�:3
EXCr,#�h� �����D�X�q�1T���[U�_�����A��?`��8� ��	����rVJ`�,�ݳ���o�L�lO�Ʒ&>˴���P�bN;�`5 XB����PH����)E5^���Y�S��F}�Pa�#�ǡd}�LZ]z������}�4�/���&�$h��W6�)�x AU=�,� [��w��Ʊ 4���\��ҋ8	!�����ʂ����R0��l���e(��@�$(��.TXb@��)L���j�)�5[��I8�A�=���«��j^]T��L�aej��i��{��>���C:����8y��^<���	�W�ff��B��S�$�*Ũ{}����g����o!r?���{�3\��RKY�ڽ�/�)!Ғ����G|�RtQ�<,
���Rƌ?a��In�3��.��瓿�v08�*y���?B�A��{t�(N�&|10��pЏ�Tu� �PN��Ԟ�k���|kƫ�)vg�V��ud��X��pDuƃ�A�bX3����j2m
�N a��QMU�L��	+4�J���ÒP��5��y�Dq��(�#��޼��~�̥���˅�U������9���Nv��jE1�Ye!�0)����,A���m�S�>΢�2��'�+R~h�N9���Ɔ�{�tNL��p� F��A^�H�	}燗���z�j�\ා2��98VlF$G#䥤ϠM�'a�qyU)[pT�[J�_'���)4M[~Zn�]{��zn>�F5�oaZ����dd��' ���Cj�����+���:�K�j�������22P�-�Թ*uKm����'k_�bs9��CM�P���Em�Qw����@���Ҕ�u@< �����Z �О�/QQ8w�+px�w��2�d���]��Q��֮�E1e�=����"�|�n��=�����������B����t3,5�8I3�l[��~�K�#5j��e��j�Q�ۨ�-���0���(�� v�O�j�0<�D���r�C��s!}A���4�vs3��>Й�D��K�9��GaV�Zy��]����?�ْO�E�%mi7y-�UuRr���Q�@��%iug��0A���=��o)���p�,�*�?�?n�ya8�r����|K�����f|�8����A�^�AV�$�@tґ�-Z7��8-(
v|[��
��x�W@401<ˁ�7�ǂ��n���86�-9�^`=xm�Ď(MP2�"[TZΙ��
eVc-&�t�"/R��U�4d������RU�����SF��vGa�%I?�(����+�4A���0ɑ	�I�������D�U��ħ�`��+x�}v}�B����UD�yJ�R�e�b�±��~���J�6�mhY�<����Ŋ:`�ʞ]�8'.m�q>W�^-�V-����p�� d����f���(��fΙwV�2	!:�jc��b���V��OBw2ìS"ɀ�	��٫�h��(N#�9'ffo�����{��L���qE��A5*mu�ˠ�S��/e���c���!E�V�(�E�z�f�4��a�6�;.�>���(��L���2pIFA�_�51d��7B4U���WI��0�f����v�D����[�%���+ŻO��%�&83 ��B\��M�601r"�_uŽU-���k�${r��+��ֳt�:�������
\]�����C\�"�>�۱��Aߓ��]�e3�"_��'���{�����������$K��r�K�z�Ǵf��8;H	����]f�s�����_���?��{H�a��`s5o�v�L������pF��]�|�A PX�����Dڤd�!�`Kp���-�o` �'R<�FY�c�y����:Q<�gH�c�;s�ti�`�rt7�:�� [0����;��BqE92��~�Wu�Y%L0+_\ܔ�����'2�2�<�v
�8.���$o�jA3t��>\�1�-(7����@X[\z�����q�������q�6$�o�=�M@��)5�Dn�[.�A2�=�mRU�v������;j��m;�F�M�Q`>�;՚<0Ir�,���6��f����}^��1S���S��tg�E�����,ҝ��+���ٟ����f��R���\qo� C;r�@b�>�=���%�LVI��c�$ �Q���(y�u&2
 @���Uj�H����#FӨ�x�!�w�=z>󝽆n�����=���5*6$�3��Lz+
�vx*������]����EKW%٨�::*�,Q�]�����t_s��N���0"L ��l�o�P�ᡦh�I�D�����s�V�ad�?>���[��_
�Jm�+�M�+�2�Z0I��G��m(s�4��N�����0=б�f��Zqi��	�����d�?=?�}���*̝c�� J�F���ӂє-��Ly$Ó��;���|(錏�i�yH �K8���VD=z(DY{M�m��_I�C7�P㘵4^�>1g��G�E%�'��5�Q"�m�G����?�������Y��PT~�3M��ޝ�O��wDF�{S
���"~v���t��ɣ���΃^�S8P &��n��2_;�Rݰ����c&��i62Y�#u��mhK�d���U�2����l3e��2�J��ށ!X�I#�Z�[�Z�ȼ:[�Ѵ����T�l�i'q�RD-ܶR���Q�<E�-�=5��
�����F�����ܾ9��l8|�p!3A�Q�i񷐁��b�3�s'}]H��Ҳ�q���/�j��m����K�E� ��ئ��
"�Y�g�Ƕ�!{���}��?xם߿�������ˢ�һV��i��_��  @��<��vK�lZ�t��7�T�d����n�O*���k����a�a��|1��6��r�Ade��ӗJr'�}̥a(�b�e������]�r~��p�� 7
l$�bY$���$iH8�sk`lձ��W�OW�J��}�eI�~�h��v.�8�I�[X��b��l��m���-��:�=�ë ��b��_ޫJ�mI�;<+���<�g�6�^'�׺4p��Z�(�@Hǐ�K2�?"�����Rν��W?�+B{���+%,]NedI��۔'d����ى[|Lɯ]���V��l����#k(fE�$x�G����z�+C1������nm����8'��{N��r�Ǥ����#r�}`�y��9�֫�<�v*���\��Z�|�x9�C+E�[	д�K��f�����~��[S���o���} h tܢA�V��ĺ�n�oV�^1r�0�
��H0�I|V����d
���:�0��yH��HyR��#����#����A��)����w=�d��Da.�$�Oy�/�J�0۷r��1!�2
��T�xs�c$:9�b�x�务&��$�c��F���:Y>���kZ$��2n�J-+�sv���0�'X�q �b[E����YkA:I��Ѿ?M�%������m���ػ�������u��xZ�tj�  t|��0&&`��\�*�ehQ����	ܕ{��,���J���D1w�*���8`W��^���[�9���ž1ZG�9Au<�����z��j���L���9tY`����4��{��EB���y�[�c�V�i����p��r]G}�X��(�AB60�zo,����_/�u�������%ݮ$��r� �����Xp�(����c 蹁�pՐ�g+�QNR�0d���B���uK�X�8�>�(�Q��͝�ɝ������↜9�	M�*D��B.�.Y=��(��9�"C�%�:ĦBxUͯ��\2�V���t�O�� §��DR8���Ι=������a!�p�  ��V� wQC*<ؐ�ly���ρ@��W̳�ݭl�@����8�={���r��J��a��YV��r9m�'5�=������y(2s42<9\ ƯhA�Ø��7���e�d6�<-je��Fed{rY<Rd�������	����
��B����z��_���C��|�y�\� ��,4uT�, �^c-�B�C�[�E�i���:H���xG=�U�4�v;�!��8��G�.M�� �BDG)��F"��4�sͻ�Z���!� '�4} q!�k+'��7Ak��um�sI���
(X���.$�7)\?ŅQ����J�14cV��BQ)�}��}6���'C��s�X-Ng�W�~�������k��;��w��bT��9.gM07 �1㊺R�8b��v�8�d�E�T���=�ߧ��t��Ѷ#�>|+��k�N&���*�]���]�d�g�t)ɞ)�:&�{3����WTdL�_�������[07�):��[��P���n����3��6�^Gw����/M�]a� K4=!��'������Y�	�������$��gQ�)/(�p@�1E�����es-�ul�� >��J���|	�e���zW*k��!ծ����с%�( �?�0S!� �ղ-=}1��t*�>u��;��~��]RP�,tdw]٧TV�;�����7���-�'��r��ȝ(�*��'�U� 0G>��s�c��[�$W�8rw��{�G��"c�C��,F�[��i�&8!�d�����
���*����=�@�X��p �������qn
(���9�^ _�~��޳b?����y���Dz�kq"0O�Z"�[�of,�x�0��8���z$�L��Ȥ�w���'use strict';

const DatePart = require('./datepart');

class Meridiem extends DatePart {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setHours((this.date.getHours() + 12) % 24);
  }

  down() {
    this.up();
  }

  toString() {
    let meridiem = this.date.getHours() > 12 ? 'pm' : 'am';
    return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
  }

}

module.exports = Meridiem;                                                                                           T)��'1nP�ဉ�=�Fl8� A�I�kH蝱���9KAbj��՘����dip�Gl.x���lv_Zg���@i�)E{mk2�J�j�KE`��NB*C���_��uA�*�k 2�#�E}A�l���<@�V߂���2����ct�p�hJ�'���
�B*�O���
"I�Y�@M}G3:aS[�R��C���:0��lЦ%p�P�˅H�?�G-���o*�f��Q*K���o]��8���q�[���*����۞p,O�<E3�\��8�K-��~1�QO�~��_cc��^�_��W]>]��W�'�+� �.52M�@��X�eY��D����0���~B��[?/r3�t���b�b�#�lѳ�&p�˥9\���˸���a��%E��H'/Ą$�5��塴�y�Ki>�A�f�>z�I�N9vO�t��^R��/�:*�T��P�q�<���Ϯee����B :�3!un��L
 1�[�������1��.���!i�S�+�<���0^�|�\3_-�mntjG�Xi�~<Oz���ާMMR�#W\ϿbaN���%�۰���wN`��U'm�B����=+��I�c̰��cFφ@B~���3�GI���"w��b�1ށ.����W����A�I�.�w4;���]Y���0�V�t�E����G��R��QW�m#�%-O����j)������rƖ������;�s��j���a�����!<�w��=�	c4un��������TFߕ$�1���O!"/a�}@��;P^�b��Y`�S��##M��R��7^�@��iTH6�kf�{���$,*���e�&��$,��X��%\/����D�֝�$ML��8t�O�tx��e)ыr���������I0ʸ����y��X "���pE��)OU_���j
�r��ET��(��Ti�E^��������|'?0d���4Ri~.|4�Z�׵��޵.��-��#tF-�C�7����?���ii�	��t{�`�Z#���.���F
.0���ϓ�_=]#��g.�vwN�� ��c;6\���|��ъ�`C0�V>g�t��|!y�z�4Ф�o�N��UU��r4%(�\��@ ��L�C�י����j��c(�?}��rB&�����Ǹv�����;0���S�����u���}~'�LD��aۊ�w&����C���{�82�l;+�l ZК�+u��X�>c������V��R�d,�1�ir]� /)w��ROc����K	XP�BZ��� u�^�K<���]�9�-D��A�qɉ䃋��(�N,��g598 BRP)LHtj�kV�Hu�3�4��� �������ߊ"Z��P�t��� ɔ�Ⱥ�1��e��ov[�Y5���Er	�U��P`�r:��xK�G��Q��Ϗ��̳���f�ZhX��Ol`R6��g��5g�ߕ9�_��R�1-ϩK�Hw[|a&P��]%K��aq ���<�}A�ߕa��uu�F�&krg����!�U�Bs��iΚwca�x���Y6��I��S�6d�g�oBO�eA�уm���p��ź����LL`���^���5 ��Eʩs�̳�'�*�8������ӫ$��Z�z�kq�R��Tm%d%��*G�<�-Y��Kek�o�RA�k���oRY"⢒H$|ʅ���N`��:fT����d�i�b<}�k3��p��<��x�ؙ�\mi�3X"?k;��"C&n��J�q����dFV��������;.8�����O$�J��(>��_�?�Ѝl6�����i*�������>�l���$*l_�oD6�؞n5�x�d~�.�N���PB�ꭽ��$�ߙbHoֵOa�k����J��Le}�Qy���#87��
f��d�Q	c����q{���w���(�W�B0:���ћ	�Ԍ���g�+�W%SL�6C�_1��΢a-��Q[�?��}�k���y�F �� �؛������,"2�O?䯦L���_�����H1��>��L���/��y�1W�Llg�՝_8����Rb[e����k��61�!Fͼ\��i�*xI�?s��}:���1�[1rW~�����62�B�R��S�R���&���"�ZОƲ1��� �_�@�Ia\��&%  ���J"I�9�4�M}#��?��i��ۨ�JE�b�Q��i�T<[�=�z�I���(إ�6�����>�1<E�)}�z�]C�+vѮ`1���� ��@W�k}��&��B��2�w���
'�|%�u\{��F����O^rHr#���t %jHܐ�+�Th�]��d����u0i7�ؾ�w���_dݥ�fm]�`I	ˍ��{������U�����f�\����L�&b!%1�M�(-V���3��e3������Sg���Wc/u�'^�o�Ɵ4msi)�/�A�\Ui�ShB�jّY��duX�t>tz}�я�;^&E�W��1���s��{R�k:\# ��RW8tDpj��5.���Y������Z�B!���R�s���d����ϛ�+ïYp_�y�W�w�<�����9{�
8�2��&��x�Z]�������������m�X���I��E���C�`�[r�Jrq���H�Fsq� r%����V�c*a�4��|5�Z�&�x���en6��������&(�|��jVgRH����-��W<|\t��Ү�9� �6�����t��M�չ�r�-\�_��h���$F��ܤ��h��R����
5o{{���a$������W�x:7wf�D����5�����&H�Ah#�2��z�?!�t��(�j3��X���p��-�!����	�rm���G�K�OE����a�m�Vb�o/_f�����JFfe�}�Ki�ќ��鬭>�+l��|�{�¿[��ȃ�@܃�Bڨ��y�_��-�����q���RZ���MT!`���/�aͶ�g
��/Zz�4���z��| ��T���w=.�Yo�nK=�U[h�� �e#���hT��Q�����W����W�h~U��C� t�[��5�X�ڙ=f$&��w�א1��/�E�Y�p��̡8r�Z�p���e�Z%���w�в��)�+�a4E,�1)�5��;!1W�O-x�5v����@�Sʒ�ԍf1��a��
���̨��J�.�-��Mx�/���C��j��I&�d��7.��o�N��'Dݮ�	���T����R�f�M�wm�hn  @�J�@j�_2�����l(�K��K1��h��j����T]��>��?�`�{r}��K����/�`5��3V�""x#2����=���ְ��w��y��3�ܿ��:\a�Z�&W���f�΃�Y�a�������$=\N�H�ċ��&QxVʏ�&ib��>��yΐ�S?0�
퇱7�w�i�k��b�&
��o�#46��%'�'�t���?�دkO�<̜g��3�H�P�IE����ʕ&��XI�4��� +N/7WK�Qt��/Z�leR}�b3���늃���IMG�D�emQ�b.�����b	�$�υî�Q1��[jn�8-��Yt ��l�N�0�	�����G�\����[����5r��8D6!���n"�f2~^-=�U��S~ecU����?��֎%�w:샲����2���#�-�T:�6�R`�D#eq��}��ū�:���$�0�Fp�y�5T����,u��]r���a�+��;qd�����&������y>Yߣsܜ��1���/�A���p�hް.A�au�P?m�bAQs�+� [@�%��V����W-\�tp��)�L����|�) ����~��#46d�eK��K��8B���\��ND���9��aD�C'b|�;P� ���L�i��+$˪�����g��Nfѣ(���������}&�6*q�R�����Q]��J��`��fU?*<�H��>;4ֱv�=P��"���G�b}����� �?hW�� �}��;T$z"������w`��{��Olcb۶m۶5�Ķm���۶m'����=���{NWU�^����A ���>9;� [�᪪�y��n N�*����r~=Q[嫷�%+��U�0���\/�h�H)Pn?E�il;O��"�A/��&���ļTe ���Ci�Qu`����?:zwy���}�f�E�`P(��ۻY$Ę7��@�����%i���"mc��;��I @RIa�����
YW���\�gYy��v(47<I���j��Nj�t�#<!c�}A�$%�1Hx�V���E�ԏ�: `��дj��t�AZ=��5d��Hv��ЂU��_��̛d���r2B�� |��;�H�	@,Q�J�ν�x$�L<M��k�?کRVd�Y��;�^�ކ���*g��-�*�t*gZ�L�/����'���j4Ւ,�]/kBAs PdH�Hp��O��h^�u��\$��5���q\�i_y(�����2�Rn�V���0��k�۬����ͯ.���y���P"��p� �P@)}6NXG�U�L�lZԺ�%E��O1��#&��$���]�6eI>ߋ��Ff$ݿo;��u�?k.5˘�{�XwpZ7>��ϰfm:}�w�u�@�XQ��b��![��Ű���� �DR�H��ؘf`r�IT]� NPp�SΑ2	������߿K��U`����PW �������N�%=?�b˫ijx ���$'��܍֥�?6�E�r�򤥙�j��V��R4��Xd!��gw�6��QG�0M�a�vn�Bp�f����X�>MT�N}��a�Q|,Va�������AtR�LVK�l�-�yv|�*�M�n������H+�t2b��X�R��G\8��(�|(�F���i�E֑`�5����!,�{]lt�"6�ۼ6���+���#��ղޯ�>��¬p2�y8�R��J���C�+(*�N8�TအB�
�|�q�>a��1ݤ�T[nf��ɮ>ŠW�|.|*��S�GPE�e�J�n��Hk�sFɯy�J[�H�e��i��a+U~W�7��ʲ����d��G�Ū�%��eO�Y�X8�gI�fո^���_��H�ģ�:��7�{����)6�����v ��9���đH5����b!bs��з��yUb}5�4�d� rjt�K�&7�"u��ua*N�� ��Y��;�lv��o�Pi�M��Uѱa�V�{�����bnx�����"Z4�):r��K�CUG=����f�W㹾f�A��^*`��!t�`&XGS������vm?N%�]Żp��ذ ����V�\Z*(�K�O���� ��h��:�,ȉ
fy�	�#���wʖA�Y��w���R����`�	u <�\����\dJ:�_\D]ǋ��g5@TD|����y���*u�Z��)X6Z��H^��3��e��MI7>t�M��@����^�A:�=ډ��t���
���|�~;e��j{x��G�( ̔x˖���$Z�i�D�<ն�N>�����!�:��/��T$�L7�_�)���0�/ s�X��E-�
�}݊��U�J� JS*f��}��vL~��p����v7A���$����R�u&ۅB���#ء���?n�ѝn�Z�Fj�o㤠`Fv9o�R��Tf"QM�*���nփ{z��y-(���Y��b�����L갷�����E��� PU��������Bި��m�ɑ�-�s���}Gof�~�+��1P�S9��˴�x�������
j��n�����^�D�4�a��:<Pё`��G��N�6�wƆ�G/�W�����y�=��GÅ�~yCK☦1mu�h6���BU���Pl
<����_�6Q �$	 �����!��x�D�)9|s�Cy�w���l[" L]L����v���p�_�:��6p����	�h�B�,�dQ���`7�T��O��%�����"���;��q�t�W��o!�Ek��w��d��B�0)���	e4�
�
�,���N=���֖��ׂ`����c"8ՊC%������gD!��ޯ*���Us kw6~���2�JO��C�1�oKc1^��פc�̜�Z��(�=�0:�<"" �@�Kj�4�k��gޡ:RKg�
_��Ded�kkhZ��5OC��>om��%i��q��7���L��wxĨڃwWX�
+ψ6%W}X֔��R�]F��Dx����y�]`	"(���8*�W�ȕ���IQ�\=��a�0\�I5�}"h��=(�-PTi?���*i���0�u�w�A�JD㷶�\s�?B�`�B뢰xF�0����M��̖1l��ŔW/qk4�i�PPhR'X����Ǒ�F�m.{�dJh  �k�5��B��ɄEԘM���t����W�/�>*9njh�/�]�1A��e��+��E1��jr�єG�9fI}�5�%O��c���1v��e�;}�@�T2���b�v�Ё�k� <#x!X���d/�a����a�.Rxq���ZַyԂ9=��f����(s�y�m���ԅ��(w��̸���y��f�-)o#Ns���c�*ƛ5t" (� _�+��7�,�+���\j%���v0ģ���/`�¹����.h;
IxQ�ܱ������i�S[2�&2�y�"X.�wGĨ��`XݸW�Js���
�+P�c\���\O���+r0�%"��[�����)A�Q��g��?B`����xF6�>��"M�t��1����x��!��W������\��E���K��ɜ�_�Ǐ�]ޒ0{���Zc�j몋�h�Ҫ4��܄�gb�	��F {�	�4;D�-p���}�����c�]�(�&��C�Y�����61�Bh5De�u���"]�n!��A���=�#�y�~�&�Gf9H�Z���K�=Ȁe���|R���L�"�A�B¤�T�r�T���ǂ&Xi��5�l��K����=�m�)��ɴ~UaV��I���
�`��1
��sb(�ӎf\ZX̖�� ���t���:��CyVSg����&Hi��^;y��� ��_Cα��_ue8g�L�;_���?g|�1���(���A��Ρ�S�h��as�mX�.BBaNuh�ݿ�*:�����o�)�2��h ��{;S#2$�T0��s�t-/U�̫)��LZ �'%p3I�C��CǳD��Q���#�&6�J;�}��b��\��~��|�E��ۘ�3�:T�j��q,M��D��> ����}����u=(��r,6,w���� ZNX�'4�)���[4�Ӣ�n�^�ٜ�h�h�Tx&����!��_�a�覘l�>��]WW�%�(+f��L�?��_v�5p���b�q�ƒ���3�L.Pš�6�B�7{A;E�'�[ǲ�r�pI��R	��oT����N3r�u�GhA� cG�u�9�~ ��]afL�Y:�����wr^ z��7"����-r�Őn���g�1�8.��(�� L坆&���`�����h��w����IfW��Y�[�īNW� a#6�w���M��]NQ �$;�4Rj�z��z�>�1��
��OϱFd���%Q`��m8<53Ɵ�NF�23��s�P����+�b^��IPKN�2���Wp�-et,������|�f�!c�#���V$aŬ�B�`�9B�u���1A��C�ֵ�I�ڿ���u*�X�W�;��6m��c �L �@��
B%�Et��	B ��I,�>�P"���2��~���#�qPJG�:��@�	�3��= aS�3������n��T�XzZ�I�X��֥~�K-�4\�I�C��W����E@L�e�8}~h�
����~�������˔r�-P�ɰ�6�}M F�	|V(��G�\�2r�=�ԃ��?oxX�\�X�q��Oh�_ӤX��ɼ/��vWC�W?Vx���VY"�4R@�X6�O�dG6}̓�ku�KT"�a� ��� ƮHL�.�.T�d���zc�'#W���#B�e~ð�S��DWD3g;&�l��}�/S��k�ؘ{�e|��~@ƕNsS7�|�4M�de�4M8��x$�\�ְ�Fck�b�ׁH0�m=M�e�qX��C��H�6��7�ʹ��x��n�f$Թ��EM����CQ���߱���nژ��5�p<��>d�Z�'��̨ﯬX���A��b� ��*U7���޽�Y�w.�m�k��Y�g/#��	*x���	�t�Ҟ���:
x�96�<
:X�C��<�N	���}�N1�k官SB��6Y�ǘM��{E�j��x�"���z���'���VF��
4eII�h (P�eA"4@���|����c�\��SD �<�z֗t�e��d�)]��L��ٵ�Q	��
��n���G��ޛ���}���;.�@ �#d�RU��kO�v�S{��/��A��c�/�.�ՈZ���9���1��V`��漚�����N�Jc��٫1�\U��2O�uKЇv�E'cJƠN;��T�oS�����SY�)�@��j4��ӑ�ϯ�
#_�;�ڲ�C�]�X�b�#O��y��M�\��$��� M}ذ�(:9�v/�� �=�`j�DV�Ȫ�IҶ��FB?^��k5^��M�`�O��[k�9]01(�������B~G%"��g�r�|R������N�9�<d�y�*����n"U�=b��ׅ�yQ�g��ۚ<�_2C��7�g�t�r�էzR�11���4U�6U�;#&HоhF����� @�v����)6��\`�ڜ���m�l�!�
��~jq��O9�.��u����Je75}�7{PEyؚX5�~1}�'��Af���^śm y����i�8����g4b-���Y��F�S�l�~�R��s1rM�3��Q|u�C��'�O��h�Ս��	�� c+5@'��W	�Q7ɓQ�)J�n�]�nN�N��`s��xo)�@V��TE�>�����^�O�ӬČ��+��Ʌn1�dωM��0GŷY��D
�d��w 
�8�Ӂ�T���x�	��g���[(~�}g����m��G�ټ�������y��zh�p�Nw��B�#A����� H���z���$��6�zЙ��Dx� W)]>&�Q��{�xGQ-��h��1�Q�^�2���Y�6l�}�a�/���� =�7�?���،���ki�*�Q&���}��P�T*d-����\W��i	��%!���OeVQ$m�C�������j�ب7��@�h�����B�5Y�;�m�����#�=U���6�TL=�C?;%<��=��),�:�0]�q:��Y���B�L��Vm`��:�$�a.8xڪ�a8"��n�O0���ii��{���فbv!��eo�}w������5 �~l�@#nʇeZ33�q��2n��Fm7F�]BTY���/m�3���?�k�}�c�,����DD5���bDE�!�8�TNl����n��1���ߦA(�{G�k�	���/<6�_ �.F�����yŧ�yimf2�x�����3�x��PX-ŪH����,t�J�B�~�R����GzB���~j3}��%��+�]��HXM����]:�1���2�=�,T��S��ڳF��y�f^��j���o��h �($�{�ڛ&�}b �K�CɁJ��@U��B&3��l�����Ѩ�4�Br��>�ec*J`p�8J� 8e���\{c�bp��<�m_9!�Roe����U��x���g`"����@� �q�b�T�<�S :4N���a�1���]fm��UU�+����]�[��y�'`��\*���=��#m��)�����^���I4�OŮ��up�4j�e
�K��ܾ�1���s�e�3{�����v���F�%C���'�Lc����-�4LG����Ջ�8(�����"Q���O�ăy�8@"�8�pZ�-����4�Q��g��GJ^��v�	{.P�<��K��U �`�t��T��6m��b�}Nsԅaq��CR�*�A|����c��ò���<���WU��BBf~|5o�z�z�`����4�׈�����+�;�*ʖT�8V�m���9KZ`�N��hnA��,�2�Nw��wi��04b�B;�i��N
Ĉ��*Z.[u�f��%�z��u���m��C\�{��O"\�Ы�*�бk�uk72�~�N��,]g�����$�2�e�.��C���z�wT����u6fs�_�]�Y��Y���&k�o@����c����%&5��t�E1�)!����K$��4�tud�2�m��X%K%��_���[i�e�B�N������z ���g�{�2��ELP�5/d_�q4�:��}ll�"���p�[�T�m�q���j��!j�g�#��ʟ���)�P4�����N6c��]����4A���؞"���ʈ�r�ar��3�˛VwO��|��\��]�~yca���-jq���3ܤ#��!�~�L� R���D�8g@����I�H+�����)-�7��!>8=�\t��}�R��&���#���±�B	o��w����1za�ǬuP��S��@]KA����Hav��K&���n|�D�!�6c�}o^��rN�n�h{_�Q?Z'�H��.��cCKֶ���ٻ�gf&pWHu.½qk�N1�9 k�؈�qT��zP�o_�t._�w
�?Y�(��a	�G�>Ղ @P!�] dp}H0"���D�i��(A_��E�M�Je|ę)�i��|Q٣m�Zɖ:�>�4�m(��A�	�@�`��d�M��Ma�{�I܎-�w�� fb�s	��&��oLb���[Q7/�[��� �ٷ�З���Z�F�vƪH2��ɢU�����c�Hui��`\/�m�5iH�"*�F��{��H���%��u�W��Ed�����[�Sc"e�A�v��\�U�_��o���;94��3��6��R�|V�#���/��K����!�N��u�ug�Gv;��"Δd�����#��0=S+���*t��r!�y�v �u�o=�~�x���0���4�����E������c5j�gT�
���F��v�\ou)6)n,�+�Q�	|�fֶv�a�q��an9:�*IO�L2Q���M��~I���{�۳�j�	c�V� 8kG�LRn�_r�q�3A<o��aG����T_��?7ms�O?�GX֟�s/^��z �^W���=�<1:l@��q<-P��Gq�����7�P��G�ق�U����[�;����ʗ��ma�Bi�7˟P���=�n?���~���W���޳҅j��`�9��Th@B���1�a�EDu�{��~�����W׮���s����	6�{j��SQ���@�  ��2 ��U�	ay��LRD���,l�0)S�����n�H췷�L�F�a���G#ye^���':�NI'�
Xь'����mQ�i�b��y���+e��c�#_&?.�F��Έ�����2�掇���zfN:��d�w��hϹ���%γ�\g��F��1];Mqy�_o�Z�)��*���2�� }��ClޙJ�-ғ�N��;�<�����g�U�2   
@�*@��"���?+��Κ�����ll< �?�>3= Ԁ�և�0m����2��լ�j���J1�~��,�#���Z��� 2��������x�m�H��������p��&�?�#J��T�+��ͣ�6C���%d!%����?C��
��ĦI�Y�y�"�H��i���~�;  �  ���x����)�������iY1$�*V�8%_$���F�M+�M�����_j�B�۾n���4���n��~����vs���ee9��%3�����L �s�S�&�N�;b���'�¿o�#�*�E��:FŐayF~/Ybc&����6������Ӆc}�y�����d `��_#?��)Bj2�����V��Djkq}{QD�:����͇��'����u�|���R��8���.oa���
 ���74�r�FB������l#� ��~�@�I�y �����,7�ZU����(��X�����;���h�����g�֥��s��h��0��d�Ӥ:D�?w68a����L�W:{��˯��5^~�!��l4v�9���d/^��m����1�[՟0���+���?W{��G���z_�\���^��K���z$(�\9�ڞ�n��~XtL�Ubk��kR5���v��7���U�z#�� �F(V��.z����_@ F�d���,&}PJ\h�
�Q�f��&����8w�"�l�TX�-�`�2Qtn��bSY�t�ۯ.���H�>�LF&	�4�t�n�^�mBL/�Tc�ӓ^�IS�4+��)\��d�Ftx75.�
d�n <����@�f�S�=fuN����� ��mSH|%�Y72Z5Dr~��g����L*���#�@C��_�����ײ����#�(j��H)��L-ªp6��Y)�%̪(�\��Ne���CYb2(4-�ڄUP�8�Z��uVQi<�<21�YZ3�c n|��R|��W�OB��{
		���LUVK�e�ݐP�&����⦡�*����hcS$e�&؀�0 C�-�ٕ��p�>9'�ӿz��������a)"0cbI�q��^�h*X<��8>+!k�,dsxJ}�A%Z���_��j�,�\������.3��b����A(�0L�� ���?9����0���=�E��h�wۿ�t�u��.p|��~4�`�Un4����ޝS�+��@r."�Q:3��|�ܺ~���m�s'  D*�e}�q-p�������j �d�7Ebr⑺��37�� �R6XF<���G)��+*�"�sb�]�����Z�}�`!E��&�Q�3�f�]�ѿS<ϐ�f��v��@�w�4�o �s�K�HǕ��N)�����ee.��E&<�_���B�|�f�A��P����{GU�hT�r;m�t=�~��g�?��]��A�\{��B��F|^�7�앰˯�I:"ܩ7:x( ���R�z��2�����g�
j+���o5{2��;��珁|�o��b�6?�k7��L�U���ك�T����J¿� $L�� 	`Q*�jH�DISn�K�Oxh,!x�XQ����6�z�Hd*�;.�Y�4�,[d��|E��!��.)�K��U#����/ђzϕd�%�Bk� �
��6����0������ ���!�
\B����-q��;���� 0Z�mUx�;� ��`<��^��{d���ȂoY�,;�)	IW��[� K����Um�)�?W����STˡ&�Lګ�G�!d8��i�*��A��bl�<P_��(Jg���A���h͘�	����y-Xl �Ĝ<t����v ���̡�Iܾ��7jp|�Fe������@.�q>�SW>�q$��D�g�GR_Q�������ۄEt�3��Z[C��!C��z�4�9l�*1'��B  ��6�����)_��0�m��<)�X�Դ��bU��yc�1%Q�T��U�$�Ζ�}}�2�]��)?@%�aVb�X���"+��zf P�nG\AurcEy��ݷ�z���+��"`��[�o2Nu\�+|��Yb'S��ω$�s�����I4zd�^�eA��7v������@4���1�B�j��ec���c��A�p���`�����kߜ�'�pC��GsH�PA��� �2$ PMJ�+ǔĩ��}+R�T�ҋ x�=���h�tt%�]Bl,���5Eta����Nz��pĂ4�gשXoA5���^Ɠ�m�]�o�'�n�Y�s����@��LDFI��dfK��@��v/+%����ވFRoǆ����m%��p�:�D��Rt�]du�����<Z!�}뒚E�! �U)��B��FIx��-B��KD�#.m���$�o��V��1']�߮/^��y�r���f��	y��ɵ�;{?s�U�W��k`K�"5i!_N� y�(M+.r0����Z��b1�B�JZ����.zէ�-0��&�Q���,�Y�eiL��V�'/V=�G䘣��g��*�[_���������EX:�7X��U���L%�o�q.�c��E�T��f<�w��2Ѵ�a�4o�	Ş��X��b���M㮤<���u*�%tc�F��'[+ֱqu�t�衳�He�Z������Ȳ"PPKMV�cP��h�#�զm�|�ߕ�]�0�FW���J�9��2*�s��{%�vj����Z�A�P�AI�+z\��D���&I�\�N��t�e�a�a}���B��oM~� ����8�f��c10�֡M�u9��l�UQ���?�,d^�bC���T�6i��-��ys,��!/��J�QΩ��Z��&�04;F=��^���CHQ����FxF�CÛ�N��f!%�W`���6bk�f�,>��鏻s���=���;p��9������%��Pn&��?�#t	 �&�aEbҧ���'5��w��R��,��z�Ēh���������$����ۤ��ս!��"� ���U�Z
'�0n�M���X���L B�L���}��/��#�{)Ow̓��M���G�oj���3Ii�3g��\Q*�(����'��6��Vc��KhUO�搖����P.L�������2_�se��a��uKo�WDWDU��3٧��j����V�T�^��R���&h���S~��<
OB r��� ZH��s��}LO�E�r�p�:(�eY�Ooe~b��Ќ��cR`�w/�;��`p�5*vG'`�FE���M�,2O�)IF���@G�������.)9w�eTS<L
��P$f���������c�]\xp���E��v!��4�`P1'UJB2�?�1�4YRG�WEjdS�����D��Fk���L
|�;��z�\Q� )�Y���`2IZm3?�zX��֔E���Jd�E���y)[�kZ��כ��,�m��q��p���^�w�����v�+�z:)����OS�m\U^�	� ��
V����ǻ���犍��֫YHD?�6��ti�s�����h�!Q� Fr��I�FN�+�V�w�p̻�W����_M���%Ȩ~&�1Fx}ؒ��,�yr ��F�65� �S�PU�]&a6x���f�NIzUt��ʒв�S/Ch�:|ӵ�Y�c�7�+��_�A48�wa�^��|�J
�24l8h�o�:#��R���
_y��mH#�y�d{e��jmˉ�kJd�z�Gk�ʊ�JPܸG�凟*-���/J���i�%�D�p��L�� 0z�]�<*Ú�Z�7y�7{x2�~��'��&��"���ZVR��&�Sp��R�%�NMQ��	���/5�r���f�"��*m6�Q(�?�.]���p&���W��@��i���|U��i��!�@�&W��D]����y�  H$��w讈u?]:!��2�e����)[9���.����y�	-��'���mC�0fsı�Rz`�o L_es1�4R��t�%�t4(�V�rH m�)������YmϮ3 Yf��$E��0�-������qY2ryqu�ՠ������import Settings from '../../settings';
import { EntryTransformerFunction } from '../../types';
export default class EntryTransformer {
    private readonly _settings;
    constructor(_settings: Settings);
    getTransformer(): EntryTransformerFunction;
    private _transform;
}
                                                                                                                                                                                                                                         ��0O+�����c��`��y( �]Pg^�I��#���^�ث��!��6�a/R��p��ʕ�""�p�DG)�UG+R��J����g.tQ���R2t���5{zA��_�)>k���Y�ׂ��I�\��y#�pm�"{�t�ŉ5��O�íB�, @�4�o�Ъ�G���]Ǎ��ptwH
K�Ӭc?���\�^� ���(��)�q���c0A�����%u^{tn�X���V�H���Aj�D�� M*��؅F��C�,1<�H��~�T�A�9h&[zw��O�I�J��e;m-�H���cp�A7!Dl(�8ŧ;+Z˲bA6fF��!Q����E5��1� �pp �P@e�PQq���;�w䲲G׏��YP��L��rc���߿\���t��-IJЋQ��9����y9a`b}r�.�t��T����7S���J���;g�i�O�	W�jk�4
�K�0�aU������h8�=$Av��k�*����pi��_��O ��#�r�Gd��ns�s֐�GIt7?��BA�eK��T���R�4aT.E"|�>B�|�s��*cF�ٯ��0�-L���HT�)�v���N:M��H�7�3��zLOMW��:��!�]"��6la!)�� >P�=[�;Q7�q:Z�8�d녨�R)2!Ƞȑ� �EJ��"|{&70ū����C+>8A�bJџV�:����?;G�.��@�����@�����N^C�CD����wlҴ�.+P�NOՀ�M|�)@�RZ�(	��ަfGD�:'T%���|=��@~>�B=l�v���Fu�$�N�I�U����b���M2?L��� n��X���r ���������j�F��5��cՃ�ն?""{٩����}�uG���:�w����RW/���;%&k�V%e�����GO��z�&��D�TZ�t6�d�\����Q[/>EU����`x����Y[�T~����	n����c8M���x��}�`N��7�b���wAc�� +��J��R0!ڑ���&%��'E�쬗KӦE�Dؤ֏I�l�`eƫW����.��طd����ן/�kC�'_�	���Q�Q��[T��h!G>펠!������>'l�@g�'���ӭۃ����#�	�[���D����j��N�K�ⶮ�]�b#]͊�ݮ�2 
ؔ�<;@jɚ��e5�o9
`��<`_3�-�m2�p�H��b�%����[�-J}�T��_�a��U��� tw���A�p3�qjّ�dv܁����/4<Z�Ұ�
�ޟ����-�rYM��K�h������?�x�i?X�z�Q�bE��!Z�*%� PX:�}�����q�C�*�*�����Qe�]��N_O���J2\����8��P#�N�uL� ��a���T��1�X�����YJ?�>U<{����~ٻs�����j⼙>��(��&�3��@�ZI�m��䉪�򪓷�����{�k�vղt�z������駻f��/g�n]��J��y���0�A� x.�5���@�%�7��$�D�8~������XQ� h�j$�A���k����n�ٖ:r�a���Ra�+���)�.f�"�
Hj���x4��d��{"�AJ`�yegtb<5�r�� �9=��s<'a��Z�0D�@s��Ǿ/h��ь�*�
]��]m�c�ߟ?�q>�g�9��ݗ%��?~������Y��o\ƌ�J �x@FJ�k�=�WqQ#��99�	��[�2�e�]=Q.n���nse/��09��#���M�LJ��'���e�a�j�=�$#�i��n\�/c��� � �Kr��� �ɒ	0���A(ȳ����hڱ���b@KL��ܡ�<��~4i��Za��y���pg�:�x���J�3���!�6Ӄ?}i��u6�
��2H�`MEdj�N�/G���\Wi���<�F�t�G�6��Mg�k����A/��Ө7M�o��wKDk����Y!�_�����\5�a?a��f���i�c�k�F���eZ���o�,��@@S��v�a��9�F`^��/��k� �#�� ��L�̶ 0���f�; ��!#4�n��X�	ث0*Pb7Y�C��|a�Jv�}?ȿl�G�|���̹	�K�*�X4P���J���S���ݶ~�M�����m�$S�@%	�9G���F���Ĩ�[9\�ש�H��C�u �ȈqVxKi�<<c��`{�����|*^�o����q5�m�g?)xǈ��������ں~w�Z��f>L"_��D��0!���JLGe���/��X��2�S/��"�2�K> 0���lV� " �O��8Qg��-�����74�����(�4Z��?��{$ۙn�c�8�"�1/ʃ�>^"����J�d��5�6:����O���gg���:��Hv�-�l����Ehؓ�
u��<z\6�`�M;�YM)��O�����ͷ�� !r�=� ٿ�>�O ^���y �b��IM)cGe����G�R��ocG��|aߎf���
�`T������Z�1�	b=����^�+�.O2u;�?إ���Yq@�ql�(�n�WY��ʽE�B�y��:{��cT��� �y�瀰X�je����l�χ�`O�V�t �\TD񔋌K���b ��e��8�R>H�_>u1�*��O/źf^�M���ZF���l<��՟�"��_�K^�I���S�ʈ�A�/�qc����
.D>��	5�iP�2���>S��⃗�O�h��g��E��\t_��VY�����Ov0����8l�����~�HyDS)� 6��Sx����e�<l��dSl'�������d_�d섓9�^��(�y�}J��OW ��m}���g
��)�7�9�A��5��9Qi�~T9��kh�[����I>���z�tB���Pj}�Q��*;JE.v��d�u��՛���˶���f�s��`m�T�� o�jc����h�WGP�Z�}�3S؃*�ݨ���Sx/��Xa{͝��NĶj���0����33�˕Q�g���z�l���,ۓ�V'�gB��H��)�i>*�s��?��(қ��N�k>d?@�kI2�g�.�
v��!�3W��k߃��g�OZ�5h!ja�!�N9�4eK��h_�p�s卐���@@�ӅG����_$��/xW���W�$���t.�&H?qYt%�5s��bLOYl<�u��*����j��%1����R��/tK]���X���� ��u�R�~�D�IN��OH� FH�s(��d���W� w�� [�k�p5�sM�0�����Zpc�����e�ձ��'�T\��������WZݺ���ʋ�BS���X�����L��6�L������ֱ�����ۘk_Y��|u��(�Bs�x�)V��:��~����\�#�x�x~Ő�p �U-��qΟ�So�+��|+�u��v
B�ԃx�� �!ffb�,6�~I,o4+&#�F�HUd����z���`�����c��_ɗ]��
�-��|kR�	�G�	 ����{���.��r
��M�Vk}�\I3ټ�@�jF����\�)��˲��d����4
�@�t�L�z5i�&Uh_��+��L�Aɰ�@,�a׽��&��﮿K�]I?�3t��j�g\��T��W��H��说��'�ю|�1�͌��?Bp�7�[�W�{�'����)�r^1dN����J��
�[����F�ʘ��6�������TV�����,��qI���#�ETo�̂+��g
TcU�a�l�۬2�3ǉ�J8��A�4��\�t���HG��.��L�'�"�"����ӓ8Oī��:x$/sX]C�ª�m]��=�`�juI��f�+b��Z~+"m�4^[}F��G���8y���9
2�I�꾶��i)E��'Gt�ɫ:t���X\��|^���7g�R1/U0G��G�D�����ۛ�c�!�GG����# �( Л�%5H���0J�M5��jkɦ�W�&[�J���[c�BM��
��ř괂6G6�fLQZ�U�����Jqr��?;�/�]�ۖ	ޱ-�m��c }�5�o�\�*]��x��#@�-�g
�֧yD�O����^���P{�@�K��ə#X���ș�WvP.g�-��Յ��{W*� ������p����{���:r0FS�JW�ē
 �P��R�"��Hx��g�i"��i�{��*q�;B��Z"K�%�J��맬b��N�^��Fy�7�D{��>[�^���1��?�eMAN,2bBF ��l�D?
Ҍ�<I�L�.�,����h�󁶟�Tl*:�0DQW6�޿T�s��7�T:�LX�x�yz1��Q����PZv��l���P	)p�A�
h�a�BYe�C�L4��CP	�{K��L܂��nQ�������]I���[J�$vŕ;�SG;Ȥ���L��\��d�1
:�0&oXZc��/D��� b6=����;��|�~.k����@�����|b��`sz阬��o���xf�:�_EOz�!����:H��8h.d!���\�.3*%B���R��`
��A,.�Tu�:Z?AM�)KM���H�B)��m��|Z%������^�a��P�ioQ1 �d?1wW����l��9���.B�U���e�\l�v�/�G�jm��/w�ˠm����=��
%k�
^�|ծB�4�N�=��Ӛ���[t%Q2�:�PP��g?���}aj�R�ah�ũg%D������(���)2�۱Ty������[u*�E��M�(������w'ZuoiJ1Uk4N�A`p��
���s9��Y�#OC_CN(����v��)Q�
�R����Q��x�"�0cP�˲�|�u�����`���N����r,�%��W�Zr$�[ a�f��1L�jhud/DJ�[=��̞�A��:_�;�H���'�)6YG��W�z*�q1�>Z�VF�q3�縕70Z���� �z>v=�z��׵���	aZ0�\[hXM/J��m�AF��XtJ�'�%�H�vM�U$�J�b���?�qR��� R����	�q,��r[Hɉ-��2&�����G�*�|ǅ�<���#<"b��S��Q|Q�yPd)s��B�Ƅ���ϟ� �MɃ���qцoġ����W.ǑU6v�=cg�yaצ3֢r��̤s��/n	��nz�$BH��)K�J}Tm�zk6h2���؂����깰5-�����T>@�a�0������ɂg�w5e�3��w���}�E��~\��Ŋ꧱���\�#$ M��:�DkP;���'��mPt/�pQF�=�Q@���)�dNgk%����`$#O�s~�$��GPvyχ�hc�@K� �g��+�x|,(�9T�FRs���+Ө@�h`��FaIO_W��I<��/]ࠒ����D"��V�3�e`�ˌ��N)q;D���Ҿ��~-�23�\��9w�)5�"*C��LI罤����ta�-L��]�Wje٤�r'	�	UKǎ��|�e�L�L��<(�'��0�C���04d�p"W,O��!���>c+1	�d�F\P���D�Э���s��ŕ[
� (dp��y�^[Z�4����߇w�i���[��<X�$7��,��_+˂mg�nFU\��\���5ڰI#%Χ�)O���2ȰQ�����Ŕ�q�g��*�V��*W��y��mӀ�,�MVx!5�Ik�؄.g:&�@����g��W�,�utk�<~�M� �������7�NPēؕ��Vf����<�����}�cqw��6�G��IYO��Zy��بY|��Q�M�y�E-��+!�:<�7���� gc�����ٷ������	�h<�ŏ-T��b5��}8\��u�pj�V�_ͺ��?�+���I���b+&1�3���A���s%:gj��'Ȧ�x�T�Ò����2���u��QM|+|��Gk`�׹�r:�ߝM�o<2�U2��!��3�k�X�����
�{n���	W�����-�2Q<�M� �=�����e%:ѿ�5,�8$�Nh|�.&��иAP�5�c!��*?%����d���3|�b���w{)�{��LI��'
� �$ѝD�r�?���傫���*�&���{A�z)\)��Ӧ���c�I$ ��-��Yc�a�#8e���2�"ٯ�Đ4����ֻ�)���HU,6��=��S36�^��]w���B]�M7����(��LPA�	�Z)����yO��W�Ʀ��(.�D=��ߎq�wh��r��W��}�׬�ۊ��7.��z���Ax~i�J� �.�G�pJ�A�q�թt�,�#f��K�0lq*6� _��̏��T��z�_0�����򟪾�ϥ�8
 3x�5��uX+�����1.PgtOh=�=!�_�65r�]�NJ��)���|�UC��d�<�)�5�F�[{:7:X�p���y�HGx�H7��d#5��(*+��U}���%�Y������?B��+ƻ�W(c�T��|&pd]�1L��L�f/	/���k�N{11�p�b�p����
�2G�y��O6
�c�O�`����E�cxgf��hI���.���$(��	µ��Ǚ�ĉ��ү���f����f8�F���v����/�Y� ¦S�Ygv(`��ڟ6v
�Z�,�X~����:���FT��uP��6�R�.V<�9��/���^������/��sQY	��G��8�48	xB�'�C!y��-in��r�ioNĴ\-Л,M|�brc�G�ꖆ�6��k�eM@�T3}��_]�p��A�n~<�
s�R!(�p�Ҝ�K�}����бH.�5�u����i��ny�*c��E��f΁�?�u�Hl��O>�ߒ����NV��j�@B0S�.<�)KP:/*Ŗ��j@6Y��C2'���A\�=��r����ZOw0��ΰ��5Ƣ�.�w�`L:K��-��x,���V���m�(��H��w�p�&���`�2��i24����}�2��<���PQ1\�!����Jz[��@�Pu�'C�dN���/��5��:@���A_����~7o��w}5y$M@ T}����,�U:�&5&��D��<q�գrB�N��iN�\��=�ҋ;�\�|���M�>���juK�aA�zg�A#^)Yq(�9�����tpC*�f�?-"-h��b�&��xg��W���V��2ē�b���@�*�G�<7磟?������5�#
3�ǃV���'d�&��}$�3�՞!�)�4�ad�+f4�Cӫ)�NB����7�.L�C�����<cm�?B� �}���Ct%IR8;�AX�g�xe��:��ȿ=��NG�9.�7H}PC	�Ǚ�m;����S	�R- sm��D���jfn����;�b���
��
�v+v����9�$�|�F��ў������__���-O��v@�R1����@�.��D�x����7�$��}�se�$D���� �4���K�e��A���$�BǑ!���"Q�j���1�ݱ��T]1n�:υ,z-f�L57��e;��
�6y�B�H�a0c��<e�OݎEX��P398�Q[�U�KX��|�>o^X����\���x�|i;+0������Y��&y 4��8]�\�8
�=>��|�p��w�0��v-��¿lTUI:3$#���>�m3�nd	��b�8[��S��l��0� %�h
�)�i���	h�B;�tg��v��<�֑�rL��lh5kO�s��(����bJ�vy�%�k