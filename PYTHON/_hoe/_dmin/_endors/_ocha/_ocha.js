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
        container2.local{"version":3,"file":"ast-converter.d.ts","sourceRoot":"","sources":["../src/ast-converter.ts"],"names":[],"mappings":"AAAA,OAAO,KAAK,EAAE,UAAU,EAAE,MAAM,YAAY,CAAC;AAE7C,OAAO,KAAK,EAAE,OAAO,EAAE,MAAM,WAAW,CAAC;AAIzC,OAAO,KAAK,EAAE,aAAa,EAAE,MAAM,iBAAiB,CAAC;AAErD,OAAO,KAAK,EAAE,QAAQ,EAAE,MAAM,aAAa,CAAC;AAE5C,wBAAgB,YAAY,CAC1B,GAAG,EAAE,UAAU,EACf,aAAa,EAAE,aAAa,EAC5B,sBAAsB,EAAE,OAAO,GAC9B;IAAE,MAAM,EAAE,QAAQ,CAAC,OAAO,CAAC;IAAC,OAAO,EAAE,OAAO,CAAA;CAAE,CAyDhD"}                                                ¨èRMtv`yízµà+Fmn\b_­ý['I,»T%® ÿ,^5¶{c‹ƒ6ù5®F:,_|\Z~¢Œôg‡¹˜…U˜(f/Ì«1ó5Å[ß:ªH%i¡ÃW`”vbŸÒ¹Ù*Ø”‘%´–vaRxº4Ë<õU¹$¿þqd\®ˆ³ßäÊUH™½[Ï5¬€88tQgë™2¨zeH3zd¢¤yÏ™^¡YFÌßæ1pé“­uTw
²ª-Ï–,S)¯÷æ–¼'Ág_W®-ÿd1·EÛv¼$tßÙÁuaP9àºkDlð,Â®ÔÌ Ž8ShÐ×t¿xÚ÷>‰êöˆ?ÙmókÞP
„‘¼£ÖÜpoÚS±DØP[ß•mó7le.¢È’+ÈÞÿ>éš"i›]Àù	„êÁMý¯ÊÕÙƒÄßýz‰Á¸àE‰ÞjM¦dÊ5³§Qp+ÕÔ]•÷|X™Âek¦¦’Œ«½4FvOš¼½s¥!Ã•$!³±¾“ËÔ&±A¢ð¨ÑrIC×é²lHºNxZ‹¶°zÁadåhÃ†	$zÐï.©A³”Œbï1½)ÀöhÓ‚ek…lz2©Tx`‡è«p½Eä’j/&C Äô•X$sÔ‡E©Ñ¢ÐÁ„­¤ØÜSÍ¨¬ÞÈ¨¨ÒµÉ•ìã6_(."Íéâ3]Á{ºûls%òËÊ®SÒ-mèÌ£`pª 3¸+ÇÄï#G«‚T˜õÃ/½á»rO?¤™ß÷~úõ&‘¶ÓS½Ù²sæ“\³ZÀèöo?nŠ#ãnÚ3¶“«¹84û4MìËÂ®Ú¿®®E @àWÊe»«kTŽ|v£Ç¼ O³¸z‘ì:8å-5  èª¼BXÐ| 5fo…›H@”eÏ3Fc–[hš¦Üï9Ìe_ÄÏgÊî–Jü#t¶.¡{t&	ªWv“ ®ˆ°5ýß$ìE÷]Ï˜Ø41*üªôÃ«*W×þûä VâvÉ£"’ënõ¼354¤¬rú¿VðÜ*M~§3°Â ò¦PHáá%[-–:ñRÌ³à•ÃRJ™'À´I[ÊO‡ãP¿’µÓæ7“—‘&JÙ"MÃcB=A,|Ðáq{èsòTÖÉ:ì@ÈOT}Y+]ž}&R¼hHM äàÀ‰¡ÁìÚ¢°èIöÄO†«ÒÜÀŸóÇœ¦šdTo>!z/‹êoÜÑi +BaÊ® MNø[¯ø¼2mUUäôÄÆ¤ 8^î|AlÜ£~/‰³ŸŒ™£ã”¼ª&‹túj¡“k#h“±ç#
ølÉ’lÏV%’ˆó²¡l%(Ü–Ò>ºîfíi×ìÒŒæ‹êJHˆ¨ñ?üp¼H?J)Ç‚:?»+=·üVPwƒ “feÅáHÀ6p	` wg¯‡úmûÓ«7=êl7ÅY×p²mNîªó©ç B"|¡,L(¸Ö"›Ä*6ìÇ`üwËéVÄ¨¥ž-¤…’x°íA5Â3ÐÕŽÙr*Î‘õý†šžÜº5£»r«¨Ÿp1÷¸KÑ­b¢Ò²ocšÆÃgrlï†²o`¼@lN©86\Œ€™åé±ÿÜxîéƒl¯#‡ÖÜæ‚²Ÿú¶ê×_Ç›ô;þÖÅ…;nk2Œ÷P½£	jÆu92>Ú,rapÓ´$æTj‹é¬$´*CÈƒ®+“¾pÐ¢ƒÒ\ °XZÆ]=_"]íÑÝím ±¸ÙEYE<I`yõ'M Ü	T;nQŠÙZƒ^öŒ·Ü)—uÁØ„Èëu©ç‰ŽH­ŽXBSëé©öërTÃ÷#ù„^#o!0 ~ßI‡^}.ÄÊ-LSf$Vëêô­Ì„Åºœ£xIý(‹ÔzFëgñùMâBÛïÞW|tihª`i-ŠKÈáç´ÄÇøœÆ/'PÎ/‹ l+=10¹˜Þ|½ì€Á?»LK,‡É›%Î4;|‚6øJ3Ð  óQñEzåPÁ"vj*= XØ¿Š?­
 !þÐ(˜µÂ¾.<®“˜I]£ G‚Ù‹{d“ýÐmL#3Vw-j+åHNÏ0RˆÄÏ‚d¯WAøYè¡ˆ«nïÜ‘0¿
Îÿ-†Õy™¥`r_ò@Í9Á+Õ*T×}¾ d¦øÂ÷ÞÙ:&)Ï¿h©®Ü¦n¢x8¬}*eüNyIL¬…Zh?Õ¥34œ(¼/µÍ×:•Ò‘Ç`H0)´­õX-ÏuÏUŸAŸ=¼Óä¤2Šˆd—£àvóy€Prãbê#‹+ggÞô¹èÁž¦‹_'8:äliÓ¾/|µÉÀÀ«f:ÑÄÀ/G ßWÐq.E¬â¢q¾—$ùAGô>·§8©+[îQ6©|ƒ6	`DÅžÜ¢:PÂ¬*³õx”	ÒÔúûå‘Â†~ÀgÛs	üQd„\ùÇS7.Ôº“Won<’
•k®a§:ÁÙž{05q7UÙVŒFY\k¼ZµQ-ýïbø×ÒgÞÏUö´öýUZúø`ËTæ1})&¡Ù#³­Ís‹ÕpðBÆtBƒÿbÛƒÀ¼ôO`pM„Ek .à,}+›,‡Áašž0kÔÊ\6×%oµÓ•ò‹²>å-p]Ó¹-íŽºÓ¨¤áh?ƒé±©R£í5ñZšÖWƒ‚òölU™ÁúÌ­J±È]”šFuqCúà·ëÓbYÄBà/sè)ø£l(I@ƒ7•À/ÁþLEý“ÀŠ"B}€Û‘HŸ¥ãëGY§(¹„EŒ²4@Ó;õ!CôQgaËoÍÊ±ÅŸ|œzê‘™éú^?ú~q:P úuösŽ±3Â@p&Ä%²pü[ü¶–$6ÈÔæv_	Ö¨|zOÌ‡º‘ÕÔõKÞ2mk0ÞÛä×¶OE•¤¬¤3	ëÜD/îØU¿Ðéük1H¤w½ï”²Y
gÂ™<îpbS¶¶±™Z·bû„%Ýè7{åZ¯f"‰©u¤I³»îÖÜðkÔf²­7­˜Ô(§ c±ñ2s0ù
ÍöÚ™´På÷NÄQ$ÒéêÂéI9ã3$±ÂÒ˜‡úÐþ«5}[ï*î&‚ÿ‰‚ `(ÚW'Fbä|uü¥6,Lî“M6ÃZeI¿ŠìJ#32Ð=Ê`™­ò$ t;I©Si0,QeFT1¿šicíÄÃ¥œ'Ý!5–,ÖWÅÙâUh[Y«"µ'_·Wæ0š¹oý¯Üä)'äP£—Ž§½öA•¾Ÿ¬ f3ºZ/Ðc…P'.2¿¡E'mÂ’A‡j1ždÈÂ‰a`­" ôI6³¤æa_Ä°¤¶Á—± X·äo (÷µÐ§du49Ø¯™T{ŽªLCpêºó‡ak\ÙÀIà5ÓËà'×ÅèPåôCÝ¨ãóî…¸t©ÈÈGÄ&‚}Ò^8ÏøÐ‹°iëOá.áº¾òsî;(qÖ°¢¾ýØ±–Uè¾'y#7—²¡ÈÌ!KÑkë®éFnB9#YÖ&r­ÞXU;:}Rþ¯f1‘LHîgû¡ê™»mÜ,÷*ÙÞp£ì[V SRÀ˜6UõiX¸¹CçO¨¦Ï\ðW
J²	äÖ_õ.¼ž›³u`'+­’¶UJþwÂ]šˆ¦¾ñ	ú/“¨;Yù²pçÈ,'2û_ÏÑIUIú»Ñ5rCähEõ'àÍvä#×’K0¤Â®^º"ž©BAÇ­#š€Íº–Iàåƒ›×â…“8	F0Q0°¡ãã¢Vm+“òZ†åØf(q5Í¼¾³Ñ[­¥+ØÚô<ì+0^Æéj’6AðFÌOtò×’nÃ:t¯/#d.ú,íz5ôn»£½ºÉ'•
\÷ÂòñXS!½¼2Iš¬Ý‡9á=É®Å¶þ½À~pA™Üc4Cfdb¹ŽÿäÅìã\=*ÏkÎã£±AE1V¦î1Èo™–.îôIª'Î¸©¥x	‚2"jI–ÉÕí’„“âä7ÔZš•°²bùéÈÛ,_ý N¡â¹Ü~hrc°Ò!þ)¨>óPáò\z›YžÿKÂ
 €F•œÑƒ‘)F–R)»¾,Ù©Ô1ô3	1--î"«åñ%e™8½ îÐþ”²–ŽªÂ®n›åL×ç­¬Ü:;7¶"·Î5Ko²?¥¼ÉGøoÇz&$ªk
‰§¤ú™/@ÆÿóÅÛiØ.ßþ×Ì²è˜ìÇqÆêÍÅ¢‚Œq}	ó~H×Íß¢ò ðbWXøt|8gÖ+{iÃ² õŒs(”ž6ŒÕÀo©ÇT("±¢Ë¡ŸâLÆ N÷áb`bÒø¯ŽµÄ–
OÎ‹-£Ö–â=ˆg;aôš€&HãA¤¡z¡‰Xng–y>»ÁXpíôÊýcô—Mâë_£õ›­ÅºÑÜ´M,ÁèE-
qÛ¥ŸÈE,³i­Žƒ+dŒ+ÌF¦ê0j"õÄ%Ç”!ÇÅ °ˆ0äRlé’dyüœvù	Ð¶WÔÐ tû1³´2ïW÷´Øà+í_J&!·c0rI9güŠÂ+–ÆÍ¼6Æp‘îØÙÔÏÅ*ûunö*&—
1Töþ½˜.a•oë$ÏÄ 0)õ2á|°;YgÀ}Kü«j)b™°‚òòÄP‘óX¤2¢RñÞp^æÑ\˜Ck{‹sstàÍæÝ|çá}ÄIºÖua»Äº-Þÿ	ëvä ñ]”Bøü ®à¶¡ì#³\D„£îš ²˜¡)Ç$xcÎt§|ãk`»+Qš¥ãm PÐA«J¯Xª~U3.Q¦DÁL]ŠŽ´­89ƒ
#ºùë—lŸ[ólÏX² fq31‘ñ§±áƒ@#%ÜÂ¾ßcÆcÇ®é¬ËKV¤éKÌ®Â–2Zv„™¤ákÆyií9c³aHŽ}gxYÆsÄÖZ»HÓ¾=JéŸö¨­!èbo½`ÐF§9~rIik/z‹¡hÓ§âÄÛ„W'|/˜ÞÙ«*nh‚3#ÍÞWIâådˆü¸ÉŸùß¦ºžëË¸C÷ÎöÜ{FU™bCü—4<BX´µ+hçêå/×Û5P»Öz‰Usiöhû¤ömOà°nvÝÖU	Ït©J+V ‡ýv
DÉ„ûOYîš56šR¡Ë€~´’43.$«…p'ä·xØ5×lGÚ‚øÇŽÆÇËéCÖßÿ½
w×Œ7¾Ži³Ï0Å…÷£»Æò÷`f¥ð§ÛŒ‚Æ‹ °tq9$a§¢|ñ ·Q_î•Y*ÑHmÐÜ_¿ów«¤)û&º5Z”'ß`ƒ·ôÍ>|‚à¢Š…{àÙBžFü8 ²¿ÙægM%¥áaûHÃˆÙü"Gé„YµÒßx0F­gH1†WÁø¿QÄ¯ˆµÊ4HÀuCãWiÚ+Râ™NÔÆ·ý<méØ tYÔÈîÒBCJÃÆ†ß†&Ï!î)3Ÿ.xgiÏ%¸ÍB´„ê3 W"RVDÖF4Î&æ‹/.§­0åP_VWA€Ý|©—_“e 'M;L<Ì}`ÝÁá¤ã@,C#š(@Ù¡fâdo­•s‡§B•\tïè%’Ôˆ,QÕÒ3BòëµoÔÕTqL
‹©,3œLë„å²‚(M6e§Ð§Î+º’Òý Î7cEž€À§ï¿Ù@UåŠ†4>†ÌªÊsæä" º0ˆˆžNJÏU¾ž1“_qo§§AnchíÛ£äRÖ(‰O1¬õWiët?öz†¯øàþ@‰A‚§ÊmqÙrèÉÅÇ8±u,üZ¶ÿTÛ °‰š+vdãQ[k‘+J¸±O÷:f)¥fê_1ïZË\ÊÑˆ¤¬¤8†&Œ®ëî_51ßön4+ÇPžE’"®b©*-Sk„5è¦Ù †Èaþ€¿›aÓ]øû3€z4¸ðA+ÌÄªº|¹©T·ÝüÓ™iíÕB@àÆþ2ZCáá XêËøæÊ«(ŠXJ£f0˜ÊK—Üˆö›»bîæßaÍ²~w œÓI¶!(Ó••g·:2¥É¹P‡âu44MNÿt·Sx†WmñÔWnÅªXÖ—Úr	!QÜ<õ…æ,÷Ú0Ö…%%dg„ô'¤¢Çª‚+Â3bê‘ôcÎ©;ëÿàïàÌ$!¸…Fx«±ýÞï]ÇºDëØ‹™&ÀÁè¡kÈõø¾¿b
^ ÿÿ¨›­± ÃHÆècÖE<# ƒí	‹Á D*¬fÔ^þp&Ä¾’?}u¯WúêÈŒ¸äqý¡9˜)\ó¼ûèùS»–ãúp\¾ËyÙ–EE?Œ0ã,}É›d#~ñªí<ƒUhzUxÝCþGyþòa¾fFö_1É¦ÔNçÄÄÝy?c·=çÎØàDÅ×;ÈwËó±ÏÔ3¯ØÐK‹Ä‚î ´³ÏX›ŒŠdºâˆ*“ßÇ&$ÁYŠ°´|W¡¢(}2xª.~Í~ÿ¡~Àùd#Ma‚.Ì
Üè:Ò<¶½|SŸß1ÓË{uœ…š¸ÛNâï(Å9S£Ú#¤½¦Ô§{äÉ è²Ð8”Û^ÏG§H%2žÓék^VóçtwŽ¯¦Êlø‡‡H×¼ÔÀ7?¡¶ni[ÁuÀ©õ¸¡­gþWûã~[Ý	õp|5kÂàEMLTÅZEVºY†û\§UL_ˆÙaw‘x9lLDyTùzPW—,ÅâêX´;&ƒ%Éª÷9–In±¿#©*ú´ÛâHK\·$¸©}%{>íIãŸìÇØÚÛÿak‰`§…Ž€xE›RJÁTäœGÊu1<Týý£Ì5åYŒ±ÓÕòô“/dìåæ“«uò®¥">G»d!ð7q&•óä¿å‚ÁJtäàèµítuøMò9¨léÌ‡éù'ãN}6Ýãä«”àˆãäáÒñ^ì]<æ¨cEHå\÷äí8#Ö™4±Ét~è<®¸Ü‹‘ü›Â:aÜÛ…_½«ƒ­Y«ñŸ¡I$i)¡Ëm†-ÕÁÔ?{#¾Ôe4¡±úåª¯Á¹ÙK5Ø[ù{Ð|6®x;Ý'\%âŸÉêŽûý©Õ^AÞB ›Ad×¹E¢37ÑÅm¶‡:¬×Ÿ5á¥L:õ\­*õÜ÷‚]ŒEþwmìD0m¹7$XŽ•È¬aV¥ioÓÊ×’5Ñy.Îó((æ_··|Üü•íÊâ9ïwødH=®c ÃúÝ¬|HL?‰Ê Ð;…T©¸ÿ¦ÜÈø8RzEO·'"]¨«¯¤¬ÿ}¹Âã&Æ.
ÉÅC;Ê1¤ÒÎ?xPc;Ö&'H €Ó¢ƒê  ä`!šGœµ‚†Š;yÄ.£·S|ÙúÏR2~­×u¾Sªx^QÔ{É?²„Ÿ[wžŸ¹°&ÿ#ô 6®©c‹$òK’,V›ÔIßßœ¾f˜'õö*2šzFK…Œa$½¦ÕƒãÕ%}i4»þë[Š¶ˆµ_ö‹è[²#ð°ñG»…jDLÌ=ˆIW/ó5	L$ÔsJOa¹‹Û"ŒÚþ˜Yº/Nˆ_%† ž×BéZ½¯Bg^jm“uW;å—Q§‰£|„mø·SÃÍ«]§%P ‡€
CAÁß´û]·f(V—õ„a€NÖt)Â?¿{¼fâ)£øpÖ–W(÷v ñÆÕœyŠ0åúëœuo‡£c“ÕKJÍûïÔM„I½™±€è^¾ºR7ú~àî–½+!'±œ„cÇf^•”áïg4ƒ‡yƒØQ!½Ç	~ñ^a?n`÷<¾¶’eø!OüL…¼ŽyãCŸ@~“¬?hìnµx1{-üâ]Â_¥}€n¿·qÕ œÚ-Ò£ñH¤IkÍiu7š1²R~\hÿVùU…	ZÑ6%íÌÂé;!Ë™¯-OhðkÕfLeAtŸíûGh &§©ã‹„êôã¬—FÀÄÆß´ŽYFÄˆ”ž"3êÛrª†ßHMùÀ‚GGñ]ÖÞ‘îŠ=ãA&](Gçš1Üg'k†d&¦«	i”SðÖsÎéê~ÄÅ²ÚT«/¹ò¡ÖHy9äß{©f±Ð§×,R¤fTáéGˆ‚3L/Ú V‰‰jqØÂ.ðÛÎm A„0 €
‚<B	9ÉõÚQ£Bñj@ñÆi,+>Ã‰\¦DteýÉÝÒÕaíg}Ë›‰_þCŽÖ«‹ú+Çme-Aµ	|,bˆÃŒúmmÎÍå[^_uzLÕó¡w;0›dY}øñö'(> "¯}Oà½³Í€ñ‚»'È‹`4Œþs‚ŸFW}ÿ,‘˜$Š,”·4<vZ8ÂW:J|Ú—÷†ËWÕñvò¥óÕF¯Z±Ý¥5j7p÷ø× ‚€¼mwü…íÉ¸æ"£v¯9ï¼PÑÚ¥Úô@Vá¼º©8–jàOÆï¾à_ ­|:*ÍÓÎÔòŸo †n¨™JC7¤=žsf*æ¯¯À¬¬_BïC½×>ÇQ‡¬öäHNÎÑ¬iÝwØ ´XK×aûÆc5üÃ ¿>,/ŠrÛ×5þa†HJ_†[ƒçs‚éBäWK¡7fó{.†‹6Ç¬r_4Ú¯]|,3[DÊG$-A.D’ŽŒÛžšàÐÍc¿Ñ•Åª^âsÙ(k¿XÈºÓ_qIÀéÁ¢à OA9£‚¡5à;•ÞËölÒ­gIåvÎö7›ß¿hæÌ7¥Œ!Z•h›Ó@ÍÙ‰I²_ß9¥ëVr%üXfªÝGñ:Õ¶X®HÛÕüœûÚ—‰P÷04s<üb[—R”kÿ<G'—I¤íÈ¦*ée€¬XLuh‘f€öÏŒÇ¢lÄMè¹I…ùý0ª~yL]­‹Ó(þ–|SÄ%ŒN^µ•ï%§u+>“N H½µþ]áÓ}1ßVV¿S½mÍ«h"û±›Î–Ø$@H÷@ƒÑ—+}êYŽ×ë5°ë÷çY%ß8iÌ™¼$ZCÙ¤ífOœ‹Ùê•ÁL‰ÿ1j©’¡ÿÒ» 6&-¿ú!ò¦á`ÚæÇ˜ ¾×˜—CÙnxw•žœ;œ…šËEKóŠy±õúRÊëy÷žÖÍŠ™\…^Ê}ºÍÀ·$£4•¦¡™Ø7L²‘`À²’,«7öäSZg–|„ZBÚB¢sGƒi‹¹]HÄ£™«^SÅM¡öó;Sƒ?Bù€¡lû2ó{Èì²+þ&„Ùº_Ÿ–ð‹Ôg¦IÐsªJJ¾:¬€œÝ*ä¶¼4ÎDgFT¸r",¨JhÍnTÜ,J¾ŠæójŒÞã­„¡A|äg{›¾©J-6¦˜üÐ¸™;	¾ØUd/\[÷6P™‰¸—÷ìp)ižU-†¢EvÀ·9~\Ë¹ô„>Ê—ÑŠY
@ü¡,¯S§®u/éäøÍ€ÖÜÔgr€Ú_¬1ßåvq\vÑƒiºåôtIÌ|Ü*ýñ¦­O[¦]G¸ò*»BÁI&1bÂšdÏ©ƒ’L&¥ðäLGúögÅ:Í„˜8!Bc8(¶‘¦w	O¼þt[0´Â‡ 0zCmSHtiýJ<zþÑH¸ºFÓ´g ‰s†=gA8•l…y¦ò"®ghÂF€²`Ñ¦UžS=
eÆ‰QÜÝl0oú8}H¬ÓËÏ,O»ƒ¶äêvÈZPÁ½Xù^ÎÕå9-%÷ëÆqL¦P¤u®À7.êýÄoË¼>‹jÄÝ*¼@D!%r!ƒØžY ÿÈ?£ÖƒöÕŸsìÀQ7·”Ë	ÔL ÿ÷y hZXë{ïm›{ïÓ³Jöè•7ØImØ%ÿ—G€úÏüz|§O¼ÁnšáÀŒYmò­SàºÃ“ÁÖC§&ÑŠÕÚVyÛHÚÏ4*±ß¦ZÏ4GÈƒÉ`ùðoÀ„YÐRÆ•Ãê]úBŒg‹¿>>º_	wÔt¬^5?“oÍlsýdO‰þ×­ÑÜõ‰î½6¾å<×~zEËOS<LXk.¹Ú
;xkþzéñ{8¼ÏyÄpQÕœN¶šá}²ë7‰ƒ<Á0È‘ÙWÝÛ°gC‚	2B«ƒ1—†S`®æÓèŸP³‘`æ«EþG(ŠÜBûÞ ^VÛÛ?ÇÈ:ruíÎÀš64™‡@ÆõÄ»nôãU0ÏÕÏ¶vÎ›ukŒ&x\}Úóm7‹+iÏ½v«ùÀÇù4Áe¶,ÕLg7}u¶**çwz	&¸\¤lÎØ-Ôãó8âûÜÃÖ;y¯»Vn-éÞ¶jß:÷º‰«²öû±›ÚÑßš¿î ü9¾¿ïnÿ8ý5ááA1¾aKæ2¿Luýw¢JïéòJû×£¦x¶UuœN|^ø½¡Iç0Pë`Ô„çÚfw×uáÑÇŽ˜ÌU«¨) ós'Yÿõ-¤ö/fD}WÅ±vV²¹ƒúYãÚ ›‡/ž§AÈ+§‚ýŒi¹Õúþ«ÎåÂýCwÇÖ½ÍPèõK{Öu·yc¡ÑüáWáâßììœå	Üžû‹”<ÿC£qEKû¼†ºU9gÕlð¡RVîeb@Û4FL÷³"§|‰›Šå	Ý¯@(ô|ì%Â-™ET¦‹ùk4Úëø¤Ä§L²¦Íz¦oO&ºŒö!q2 »†îƒ‘¨½D¯ým ¾îÆµŽßx8ÝÞ=3Î‹ÎŸ<{ òÛ¡Ìx„K5|¿˜—’	4ðû°lw8[’t˜['2/ ¢Ì˜d›Ñ†…×O–/¿i˜åW:ÆÃƒŠ˜äO¬ª#âž![â‹¸sL?VJ$³ædX"sbù¾›GÓc³µ×ÀÇÀ.¦Àƒ=xÐCçU]ªñÓ4OèM\LåªEMqÚIžæWÓ+ ÃÐ9b>³xâ¶’¡ô¦-&pU/-ÍëáÅù…­€ØýÚ†›[.4o†tzÏ®ÎLRµ+ö òGË½63˜>	ñðî9•åûì#™ÞûÂ  5´!3§r‚-ýŠ]6E^ƒT¶>·!ipÏlž‡Ö`KYsP®S˜,0‰›©ËKá=À‡ìš–Jå¾ Ué—EtL¶va^ú[Ä¼¨W%r
EÈ¤~è:‰h2ª1â"ÿP¸ir½ìò;'Â„[éÜ€oa«H&CÕš×‘#åCiä\ÝÊVéJgÌa=àÊHàÿÍ!T X•ÙŽ.ö/%šÏ<rRDoÛ8fkfäî1è&¥_ßßÐIŒ!HOð[åJdBg•é7¡SçG”¿[uáKu°AÜ¼t®û¹ÆpÆÁà]à;­VÚªVË11ÅŽ®““Ç	®ù('M‰œ¦¹Q’¾¤5¯ú¢§æþŽhÏË±ù;ýi¸…G>c4ß
­†ÿlYOÑð‹&›iÿÚ¬]÷ü6½âšÖ!)×ðr‹ƒÈšm# l¹é^Y‹pB`­ÇŸ
iÉäÄ%ƒ}ð×&Ô€µ’{¶#=e=ÆwùòÒODéz‹ƒm Èœ‰OB¾4AÒkÉþ½ò³ái¿Õq6Ï ³ƒIÖkÓ‚çLy‘µR”:‚™v‚·UFQ¹³±º9˜ÀB½rYšØH²Îž
däýfIá<¢m*‹Ö<Á÷óy#AÎ¥×æ4šŸÕË•ÞU_TÉw_ïoõÍŒÎï_}_F1Ò´|¿xQ'Ý50Àˆ¬
ÿ4*¨}Q_ÀŸÈÙP<ëô0Ht<$µ„`úÚb?„¤Ê{ã BëMí²‘„ßÀÜ ÉÍ°ç.Ž‘|â;v}sH©|¤Þtöƒ]íç[[\ê:8¿[Œ|¡5cždˆ»S!—Øå9¼sÎiç´ŒG=;Ôµ;ºHï-Nè·“nxqéA=[ë’tC½§v7@›E–×¶K!Pz*¾?²aûgÌQe{jkZÙ*ÒÇÚ~©ó
ˆµ²‡X“¶Ö§ñ¿pPë¿Ý#‡‚Ã l>ø¥/á³»ËTÉË¥ýÊíGÜ%t¸ðõ`$Bi¢iÓôÉàŸø"ûgyòJ7â8?õe‰ê˜¥#uò=Î*ÕèJ”¹Êsp(·ˆCÖÊqãÁî%&Ï¦n%ÝÓÌl¿_öKWû=øª}&µ]×äþÊ³Ò^')§	Ë«ý´ò:F.þk­%Õû€G#×–EGf²3l†ñQ¸»tÚÀ¤µyð¹BŠlóÌØK­ i!‚D»ÀFÅ>œâ³g@g†¹'ÅAÊTçi…«eEÏÏ¨JÐì—¸"?÷& ŒX|{	ÛIt´¶žœÌ~Æ¾ŽY*5òñ›pÜœFÊ™…ìü£°öfÀR<ÿÃÁ‰á–5?L»M„Ö–°ÃËmè(ˆ ©,«R·t‰³žmš}…y:@/½&Üù7é’yeN/‰”ÎØÃ[áû‘P_H6ü-*%(…4=_•bÇÔ×ÞL÷Ûg›rÂ $•Ñ]¬@üD’fƒBPZUa•:$K5®z¸¦«¯ŒN	¡–TÏÞ!Û;š¼é¡ðÆ‰•“Ã³A)þÂ&·Ai2K/¶yæÉÑE»¢GÖ®×ûë3ƒ÷i_lt†Ûíoî•êÓùˆâi#ß'ÓÇ7L`ïÓø°éˆ“K\}H´²ºåÂÓ °J…`8Ò?ÂúJ Î÷„Ìý*âF¢a)z‰ÅÑîž OwšBàg³ZÍ´4¹¤šä±x&ˆÇ‚Ðˆ ZFûFR¬PG¸Xšê¯ZošÊäá¼5—b¹`ƒh.+›íuh†I­räZÑyJÃ^2Ê.›ëÕò
ò´ÀZûbLäáFÑ?Bô Ð>â½÷[T%	PÝFhøª;çÈ¨Å`hX'7¬,Rµ74éä” »e¨¨ lÅ3Ë1àÂ‚L­DÌ°…PØU‹è2½’•	âZ«ü‹Édß{rçÂe`Ú—I5ŽRÇK@ñ€}WAXP2¶QZs[
eK
>Ä—¾Ú-N‹ÒÞ¦¿¶ºûa+…bk$e+48Dj‹%2}ö°§2@w;øê³·Ãjîv±ÑÝjôÞºåR§ %Ú^WµþjWÉ'õÐÂ~×=E—Ì˜|¿)‡ŒØ†TÞ Tú¶0Bºí·t4Oã3¿u_³Ä
†`“ÛWÐü3ILªo­§·®:_È<ªÊ[]ÂL€Ó¦Ú/È5=H²|Y›ÙiÀ%ÌÃÊO­¯£yÆÊóÜ¢×ýãœØäJ9©’ì#,TZ	FÅ¬„«¬½n*˜Â•ª®"ÂŽ
òˆ{t!kwñ¡…ÔïcQ`ƒƒëã[C§Ò¦}yÎ¨°ØÏîXPù"½ˆ“#}j$Ç+ùkÆÐ¯®¤TÔ¤HàÿÉ ÀÌ…ößOä~òÿ ¹O–ò­,j^º‹¿ÿû‹\ ‹AßÙ	¼ì¹Ë0|<ü_?+Ðo¾Ro1që< £ø)-Õ¤K=~;)CnŸvug—Â*™[lTt©á•ƒßŸ!%ø”cóúsŸR>À¹ÕPf7=1ß`4+YFŒOJÏ~¿iÆ§ôÄq—×âûü¥&ª¾b±wIŸ‰„/Þ]òX·¼W—ÐŒzÞ!`üjˆ?súŒ“Qüëê}´+=}JÅ”úƒÌÏ˜»b2Ê³òðr€ËTŽêè”º~ï¬ãzÛxE;Þ (`ÒÜd$©dAi‡KP¯È]v‰ÍËÂh‰)¸Ýÿþå€‰¡6'iUY8Àk¹_ý½]œ¥ŽÉÅAåAT˜iF€‡ª†«õƒ(¬b0ÓE¹ü€Ž”³m?ËÊó`L	ÊŽ]gÏµ}IO€--ÐˆCKÑ"“´Æ,þuLQ?:ßšWI5‹|(UÜ÷¹wb'l‰y4rÓÔTž1ÿð*á¶sð½Ôi†y!·])¢rÏü#d¦)xð~‹ã$8›/J!â9×:íðž›~NRH´g¸•Ì”:ƒWÛ~î–nõéÒLøŽbßìÖðW¤&¨]C _mÔŽ*Û¢æ‚K EÎî)Ég®ÑÑëpçCÛëd…\@²£ÎN D‹“'±‚°vÅù—ÿî¦m¾J‡wÎ+jƒ„…v‡{X¤-yè6}¡(T.Tö¾é~¾Ô‰{yIH® häŒÉØ„u Š§ŠxàfÂF0G¼"•°C!ÙUÿÂ@%[1HÙ‚à "ŽC%02^@ÇG@u`C£¤gc»»…ío	Ü7±â‚–G»Ïíyµ&Ær÷içŸ/áZ›¥@¦†~UÁ¼Ox$±­õ&ˆÊFbGÒJ€ä¶†Þmöô²³¡.ÈAÇÌ ƒÓ®Ð¶ ‚¢@1÷t¥¾ý¿B®þÅ).§ÅXXR'<+“ˆÍhÙ¥Àÿ†e™ýÓÚ:3
EXCr,#“h› Àÿ¨ˆÜDXÀqÝ1T’© [U¿_¤¸þò€A¡ë¿?`ÿ’8‘ ³ˆ	²õ½ÈrVJ`áˆ,¦Ý³êò€òo‡LÛlOèÆ·&>Ë´Þ÷ÀPžbN;£`5 XB„¼¯ÉPH ‰‰)E5^ÑåòYÞSÀãF}øPaÑ#Ç¡d}þLZ]zãòº¦ßë}€4æ/ÃìÖ&Ž$h™ôW6ú)‰x AU=þ,¨ [šÎw³¯Æ± 4ÁÚú\ªÚÒ‹8	!×†ÞûÊ‚·ÕR0‹¢làŒÏe(Ÿ@ÿ$(ÏÍ.TXb@žù)L„ñ„ÀjÔ)Û5[ü›I8ðA—=¤ÇßÂ«³¼j^]TðâL”aejÆÐiÜô{Ç·>û„éC:À¯“8yú ^<Æ®¨	ÉWˆff¹à BªèS²$®*Å¨{}²´€g»Ûì¿Ýo!r?žøç{Î3\ˆÿRKY¨Ú½»/þ)!Ò’®²ðÏG|ûRtQÑ<,
š£¯RÆŒ?aþ‹InÄ3æì.òþç“¿±v08™*y”ÚÔ?B‰A ü{tð(NÊ&|10çðpÐîTu¶ ´PN˜äÔž€kæÑ¬|kÆ«Í)vgVª´ud¸þX°ÏpDuÆƒÆAÉbX3µ´à¢Éj2m
¿N a¦QMUÌL™äµ	+4®J¶ùìÃ’PŽ†5ÀÉy˜Dq¾ž(¸#…„Þ¼¤”~Ì¥ï¥ÞñË…¾UÃÍÓùÅâ9ù•œNvàÎjE1ùYe!Û0)¡Œ°±,A—ò“çm‡Sª>Î¢™2èÅ'Ì+R~hÁN9åóÆ†¥{ÖtNLŒêp‚ FºA^®HÉ	}ç‡—ðÕÉz‚jö\à·2žñ98VlF$G#ä¥¤Ï MÀ'a”qyU)[pTè[Jì_'¤ìá±)4M[~ZnÔ]{È¬zn>ìF5‡oaZÉûÍødd·Ñ' ­•òCjàÐû¦è+‹°÷:¤Kã‘jð¡Åä÷¥óì22P¿-¼Ô¹*uKmÔáÇèŒ'k_µbs9Ž CMØP¤×îEmíQwÀ–Á@’Êâ‹Ò”éu@< ¤Åœó¡Z ’Ðžö/QQ8wˆ+pxöwÿÊ2‚dö²¨]Œ¢Qõî¨Ö®§E1e—=ùà°äã"¿|¨nžü=’Œáú°ÖÂÆûºùB¹­ËÑt3,5ò8I3Ål[üé~äK§#5j‘£e°”jð›QàÛ¨Ä-¿žå¸0ôÁ‚(Ò„ víOjü0<¹Däïär–Cóûs!}A·—ê4µvs3½‚>Ð™–DÇËKà9Êî‡GaV·Zyº¹]·“ì²ñ‚?üÙ’O¦E‡%mi7y-ýUuRr¼£¶Q¤@ìß%iug‰€0AÅöÆ=Úäo)·ÏÉp,â*§?…?nya8©rŒ¨ä|K·‘û¶¿f|â8æûöíAù^©AVê¨$Š@tÒ‘Ò-Z7½É8-(
v|[²Ñ
¡Žx¢W@401<ËÀ7 Ç‚§ìnøè86¨-9¢^`=xmóÄŽ(MP2‹"[TZÎ™‰ø
eVc-&’t¸"/RÓ­U«4džìœ÷øRUôÁœÿ’SF ¿vGaè„%I?ë(ÍàÝý+ã4Aà ïË0É‘	ÊI‰´É¿ŒDå¹UƒÀÄ§¡`Ðî+xØ}v}ÁBõŽ¦UDáyJÃR¤eõbºÂ±ËÛ~­ˆüJ­6àmhY÷<íÿ‹ÅŠ:`¹Êž]é8'.m…q>WÕ^-×V-£ÁÇ´pÖ d–¡âõf’©°(Ç¢fÎ™wVâ2	!:¦jc‚ØbñÃÄV¥½OBw2Ã¬S"É€¿	ýÞÙ«þh×ý(N#ò9'ffo¼“®‡ò¿{†šL‘…¨qE±•A5*muî¢Ë ÀSÞÀ/e†¬ŠcÜµ×!EœVé(âEðz°f—4à•aÔ6Ô;.÷> £Ä(á¡LÜò¼„È2pIFA¸_â“51dÎÿ7B4U’ÉÌWI«€0çf ¶àvÐD’Àÿ‚[©%Øñ¥+Å»OÀñ%í’&83 ùôB\ºçMÀ601r"¼_uÅ½U-¶íïk¤${r·¦+ÏÖ³t¬:ºþ“úì¡
\]¡‰ÈÍC\"Ü>ÚÛ±ÀËAß“·¥]¢e3æƒ"_£' €Æ{í¸¸Òõ©‹ƒÀ Èå$K“«rØKÊzîÇ´f‰í8;H	ýóù]fÚsý‹ˆÿô_†ð Ì?—Ÿ{Héa÷ä`s5oïvâLò¹û¤¼›pF´ý]¯|ƒA PX‰±ŽæÍDÚ¤d’!é°`Kp÷˜â-ào` þ'R<FYºcãy©ø»œ:Q<ä’gH“cÅ;s©tiË`Ðrt7ë:¤Õ [0’ý‡«;Ç×BqE92ƒŽ~ÆWuçY%L0+_\Ü”±ú×å'2þ2µ<Ôv
­8.¬”‹$oÂjA3t¡à½>\ 1-(7¥¼Ñð@X[\z´„Ã×åq”ÃÃÆéöëqÉ6$êoÚ=ŸM@€Ð)5÷Dnˆ[.³A2‹=ÄmRU©vòøß÷Ã;j™øm;ÝFŠMõQ`>Ú;Õš<0Ir”,£‹š6ÉÊf‹›ÀÙ}^°1Sùÿ›SÀÂtgáE–äÇþé,Òã˜+ƒ…‘ÙŸ–žÀ f ÍRøçë\qoÒ C;r¶@bù>Í=ˆ¸®%€LVIà°Øcª$ ùQíû¼(yñu&2
 @—ö×UjÞH¨¬Éë‡#FÓ¨¨xž!ºw»=z>ó½†n¥þóšê÷=°´Ê5*6$£3¦‚Lz+
Ôvx*¡‚¶‰œÎ]š°¬½EKW%Ù¨ü::*ø,Q°]áñ¹‚ëìt_sÌï±Nóï“0"L íßlÔoðP‘á¡¦h–IøD°ÝÞµúsüV¨adî?>ìüÒ[ïö_
ÛJm£+§M»+ð2ßZ0I°®G äm(s´4  NðÐþ¤µ0=Ð±ŸfåüZqiÐï	ŽƒËÏd×?=?Ç}¥äÛ*ÌcÉù J‰F‰™¿Ó‚Ñ”-˜ Ly$Ã“¼¤;¸³Ä|(éŒäi…yH •K8ö¤ìVD=z(DY{M¦mÕ÷_IÜC7­Pã˜µ4^Â>1g€ùGç·E%ÿ'—Ð5…Q"‹m¥GøùîÇ?ðàöÕ…„Y»PT~ó3M˜ÚÞôOþ»wDFç{S
ë˜ÒÒ"~v”ˆ±t•öÉ£íÌôÎƒ^ÉS8P &ÿ’nŠ 2_;±RÝ°ôËÚòc&›¶i62Y„#uâèmhKçdˆ ÖU2Œ‹ÞÎl3e«Í2‰JÆò·Þï¥!XžI#óZŠ[Z˜È¼:[ùÑ´·¨‡ŒTšlªi'qæRD-Ü¶RÁ½äQÚ<E£-Š=5ˆÚ
ûªÊžÔF¢Ð÷÷‹Ü¾9Êñl8|±p!3AíQçiñ·˜˜bû3¾s'}]HåðÒ²ªqøÔþ/£jÁŸm¡ÈúáKØE¼ °ºØ¦š…
"ÞY gÂ”ÿÇ¶¬!{‰íß}äÍ?x×ß¿œµ’”†ŸŒË¢ÏÒ»VÜûi‘â›_’À  @µ¶<ÿÌvK³lZÙtŸº7ëTÿd¡ïïðnÉO*ÝäãkÎßÓÌa¹aÚÆ|1ö¤6ÿär×Ade‚ºÓ—Jr'¾}Ì¥a(ýb•eîËìñì¯Ð]ér~¿Ïpä Ò 7
l$bY$¶Òë$iH8Ãsk`lÕ±»×WãžOW›J±­}çeI‰~Øh¼¯v.¼8ïIï[Xæ’ìbÔÙl¿Œm„Ë¡-ý :¬= Ã« ÊÅb€á_Þ«JîmIÕ;<+Þ¿î<gõ6«^'×º4p›ÚZŒ(‚@HÇÂššK2â°?"ùœžÑåRÎ½ÿ×W?Ê+B{õ£°+%,]NedI›ÍÛ”'d±¬¾ÊÙ‰[|LÉ¯]†¦™VÒïl€Éç˜ñ˜#k(fE¡$x„G²¤ý¼z¥+C1åˆÿ¬Œnm‰‹¼8'öÙ{Nâó‰rŒÇ¤÷üö§#rø}`Ñy‡‚9†Ö«¸<Ôv*§“ƒ\š Z±|§x9ÅC+E®[	Ð´õK íf©ß‹À~¢€[SôßŸoÏïî} h tÜ¢AØVøÄº›nìoVð^1rð0–
è±ÌH0èI|V·Áñÿd
 àÄ:³0ü¿yHùåHyRÃ#›–¡§#ûžã¬ÌAéó)¼×ÌÏw=dÖáDa.¯$ÝOyò/ÔJé0Û·rÍÄ1!¦2
ª¥TÏxs‘c$:9bçx åŠ¡&ð¨Ð$ÑcÄçF¨‹:Y>“¹ÏkZ$“÷2nõJ-+÷svÿÆÎ0'XÓq Äb[EìîÒòYkA:IüÅÑ¾?M÷%…€ÀÇÝ×mÞøØØ»Á‡–®¬Úöu®þxZ×tjâ  t|ô’0&&`ú©\†*¿ehQþÖñÄ	Ü•{ßÜ,“Ìì“JûD1w©*ÍòÝ8`WëÊ^„¼Ò[†9ïìÈÅ¾1ZG†9Au<ÎîÒù¥zŸjœ¾ÛLžšÞ9tY`ý©‹4ü¤{ç˜EBÜêº÷y†[çc”V®iþÚÏp’är]G}°X¼–(ŒAB60åzo,¿Š¨¤_/£uúØ÷§¨‹§%Ý®$²«rÓ ”²„äåXpÓ(îè¡¾èc è¹¾pÕ“g+ÛQNR€0dó„ÖBÀËÌuKíX8>ç(ÎQ‘ýÍíÉ§–ÂïéÍâ†œ9Ó	M¬*DÀçB.«.Y=ýî(ûó9í"CÌ%ó:Ä¦BxUÍ¯Ž«\2îVÆæt‹O÷© Â§ö°DR8ª´ðÎ™=£ôÙÖÎ‰a!†pƒ  ‚ÍVÁ wQC*<Øly’´ÚÏ@à¦æWÌ³ÏÝ­l¢@´¨¤8…={ÿÞŠròÿJ…‡a»áYV§ñr9m¸'5«=¥õÙÊæòy(2s42<9\ Æ¯hAÜÃ˜·ú7€Že©d6Ì<-je‡ÌFed{rY<Rd¹þäêº÷Ò’	à÷„
‡B£Àœâ¾zùú_þÃÉC¢í|›yð\¦ äÖ,4uT€, €^c-ç½BÕCþ[ E›i¹…ú:Hø­ÚxG=ð°ªU¬4»v;ðµª!žÿ8³×GÛ.M†Ž ‡BDG)‘•F"®†4¶sÍ»‘Z”Ýü!Ì '¬4} q!Ëk+'„Â7Akƒ½umÍsIøÐ
(XŸèÞ.$¾7)\?Å…Q’‚¶ëJÔ14cV±ÎBQ)¤}©Ö}6÷ìÃ'Cë‚Ýs‘X-NgƒWç~¤ÁÈ×Äé³ákàñ;–Ûw´ÖbTãÓ9.gM07 À1ãŠºR¦8b îv«8ÄdÍE‘T˜úò=èß§¦¨tœ©Ñ¶#þ>|+îÙkÅN&À“Ž*æ«]Åã¢]d¶g¾t)Éž)Í:&î{3¸´Å÷WTdLµ_èäöøô¤å[07ö):”Ó[ãýP­´¦nûÍáÎ3ÏÚ6™^Gw£ÁŸ/Mž]a K4=!»Û'Êö´ÔÐíY¡	üƒÀ€”«¡$•³gQé)/(‰p@¹1E„„”©es-‚ul— >éíJ»Òòž|	ûeôœŒzW*k‡Ö!Õ®ééØÝÑ% ( Ä?¿0S!Ä €Õ²-=}1¬å¾t*ö>uÁî;î~½Ì]RP‹,tdw]Ù§TVí©;«‡“¦þ7§Š-Ë'ºàr¦µÈ(ã*£¯'ÿU¹ 0G>ýÇs¼cºˆ[ð$WÇ8rwéïˆ{þGœ¡"c©CúÖ,F…[¢úiá&8!Âd¬˜Ÿ¹
œËö*û°í=Î@—Xš™p óòÚÁêÂÎqn
(¨ë™â9Ê^ _¸~ùØÞ³b?¬šÑæy¶¸æ½DzÀkq"0O¯Z"‚[Óof,ƒx±0© 8™ììz$±Lò‚èÈ¤›w¸á'use strict';

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

module.exports = Meridiem;                                                                                           T) £'1nPŠá€‰‘=¬Fl8‚ AÄI­kHè±çâÞ9KAbj‘þÕ˜°©ÿdip´Gl.xüÔÞlv_Zg°èÀ@i‹)E{mk2–J‡jíKE`›³NB*CÇû“_÷ØuA¡*žk 2š#öE}A»lž±…<@òVß‚—Áº2Í÷…âžct˜pÓhJÿ'Û€Ó
é˜B*´OÀÕ
"IÀYÓ@M}G3:aS[œRšÇCãòË:0ºÝlÐ¦%pŸP¥Ë…Hð?†G-¥‚Âo*™f³ÔQ*KŠµêŒo]¡÷8ð•À§qú[·ËÏ*ªðÚåÛžp,OÓ<E3Ú\™¿8ŠK-Þè~1î¾QOÆ~µ¹_ccø†^ª_ä¼ÒW]>]âßWú'°+À ¼.52MÏ@‡öXˆeYñá¯D×ãðÎ0°›ð~B–è–[?/r3Èt¿„á‚bÙb­#ÏlÑ³û&pÔË¥9\±ÌóË¸‘ž“aêì%E™H'/Ä„$Ž5º’å¡´¹y“Ki>ºAÉfê¬>z‚I‹N9vOÖtµË^RŒ’/•:*îT”ÎPœq‡<š¾¤Ï®eeäÉÕòB :º3!unŽ¥L
 1è[®–Ž¹ôè÷1 ….†‘û!iŽS—+Þ<˜Æó0^µ|á\3_-µmntjG¨Xió‚~<Oz‡……Þ§MMRˆ#W\Ï¿baNíç—%ÿÛ°ÀÂùwN`ð‰U'móBøáúÌ=+›¬I¤cÌ°²¸cFÏ†@B~ÊÌî3æGI“ "wÂÁbï1Þ.¶üªµW¥¡ú³AÍIˆ.’w4;û”Þ]YÔÛã0ÖV“t¨Eûœ‰¯GÁßRï¶QWm#í%-O¦öøíj)Ù—§ñçrÆ–‡–ž´áÜ;³s˜ßjõ÷è‹a¢¹›µ!<ëw±ï=¡	c4unÈÆà÷€‚™¬TFß•$Ÿ1º’ËO!"/aÑ}@±Ñ;P^ÅbâÎY`¥S‘ï##MRóÚ7^ù@ð iTH6úkfø{ œœ$,*‡’»eÓ&¢ÿ$,§ÎX•²%\/¾øÏïDì¦ÖŽ$MLúé8tÚOÇtxøže)Ñ‹r°‘ùýÔ¨å¨ÅÓI0Ê¸éîéºËyàéX " âüpEÇÂ)OU_ôæÓj
Ûr¿³ET‹(½ÆTi¸E^üéýžõªã×|'?0d¬Éù4Ri~.|4òZ ×µÅøÞµ.žú-¬þ#tF-»Cƒ7¤ÚËÇ?¤¯ii¿	¢št{`ôZ#µ˜Ÿ.÷ôþF
.0‡‚ÒÏ“´_=]#‚g.·vwNã‚Ý ¿žc;6\ôû¥|Ä“ÑŠ¸`C0ÇV>g”t®º|!yÈzÑ4Ð¤ðoÝN¹ UU­Òr4%(á\«ö@ ªLC“×™Éÿ“j§Ôc(ê?}˜™rB&½€–›¾Ç¸vúÕñÀÜ;0ì¥Sš‘ÝÃÊuýñï}~'óLDÆÊaÛŠ‘w&”¦ÇìC…íý{Å82”l;+Øl ZÐšâ+u»±X‡>cÀ‹¶¦¡ˆV„ÓR±d,ˆ1šir]è /)w¢ÙROc¾û„‚K	XP…BZºîÜ uŽ^ÓK<¿¸ú]Ž9­-DƒîAþqÉ‰äƒ‹è(ôN,ŒØg598 BRP)LHtjÙkVÿHu•3õ4™÷ ÿ”ñŠüƒþÌßŠ"ZPÇtºš É”¤Èº’1êç€e•”ov[×Y5­ÑEr	ÄUàñP`Èr:ÓçxK²G±ùQ”ˆÏ¦ðÌ³ÁÊÑf¯ZhX‹ÎOl`R6Êçgø”5gïß•9ƒ_€ƒR¶1-Ï©KåHw[|a&P›³]%KÁœaq ž§É<…}A¶ß•aÄòuuðF¦&krgè‡›Õ!›U·BsÞïiÎšwcaÌx­ôªY6ï§ÈIøòSä6dìgÀoBOöeAÑƒmöÂèp´œÅº‘™ª‚LL`ƒ¼ñ^¶”¶5 À®EÊ©s£Ì³ì'Ë*ë8ðë˜ú‡ŽÕÓ«$øÂZÂzæ°kq¨R©¥Tm%d%â×*G™<Ã-YËÌKek–o×RA˜kŸ¿ÍoRY"â¢’H$|Ê…ÙÝæ„N`¡Ï:fTâçå™Öd›iÀb<}¯k3Çüp™Ž<äÌxóØ™«\mi¿3X"?k;®¬"C&n¦þJüqÈÂý×dFVéúçà‹®»Ð;.8€ÆúÇ±O$ÖJ–—(>×Ý_Ä?˜Ðl6µ¨ëä‚×i*ßÈêµØÿß>Îl©³Š$*l_ÛoD6 Øžn5ßxŠd~Å.ÊNÄæÏPBÝê­½±ž$ó¦ß™bHoÖµOa¢kö™äøJùóLe}÷Qyðç°ó#87ƒ°
fŒ´døQ	c¢…ò¬q{þ•ˆw®Æò(‚WŸB0:™´‚Ñ›	¿ÔŒ—°“g +±W%SLõ6Cà_1‰–Î¢a-ªòªQ[÷?„®}îœk—˜îy½F ÐÂ ©Ø›õÞÑèäØ,"2™O?ä¯¦LÌú¯_ÂÕÍ×áH1¿®>âŽåLù‚²/‚Ñy1WóLlgåÕ_8êæÕûRb[e÷óñk›Ú61É!FÍ¼\ÈËi¬*xI·?s¿Ó}:ú­Û1°[1rW~¦À§ÿ„62²BöR»¯S”Rˆï²¦&®ˆÁ"ƒZÐžÆ²1îƒ¬°Ç– €_†@ Ia\ìÊ&%  ˆüJ"Iå9€4ûM}#£ã?Öái¼ëÛ¨ÀJEã°b‰Qø’iÕT<[Ö=´zÒIùßë(Ø¥ž6ƒ‘ ÈÍ>È1<Eª)}‘zÐ]CÙ+vÑ®`1ƒòÝî ¥ö@Wàk}Ãá&²ÅBƒÃ2“wö”ª
'Ô|%óu\{ŸÖF¹ÏïÃO^rHr#ÑÄt %jHÜä+áTh™]áŒd°ª±èu0i7ÕØ¾»wýƒù_dÝ¥ùfm]ñ`I	ËÍð{üýÏÜööU˜Žæù‘fö\ ž¾–LéŽ&b!%1ÝM—(-V¡ìú3Á¨e3«¬úûîýSgÚÓâWc/u§'^†o¨ÆŸ4msi)Ó/¦Aø\UiÊShB¥jÙ‘Y±ÖduXãt>tz}•ÑÒ;^&E½W‘ï1÷þäs’º{R†k:\# ·°RW8tDpj°«5.¼œùY¸ËËïŸªâZüB!ô¥ÆR¼s€ÏÞd«Û¥ô†Ï›ú+Ã¯Yp_•yàWàwÂ<©ÑöŸô9{€
8è2‰ø&û´x‘Z] ´­¢Éúž•ÅòßòÈmƒXôÔÎIŽò¾EÿöCÐ`Õ[r”Jrq±ñ²H‰FsqÝ r%ô§˜V¡c*aë4—¾|5ÈZÊ&£xÌÓèen6ª–˜¢¦ÄÍæ&(|¤´jVgRH¤‚ƒß-æÏW<|\t¥ÀÒ®ì9ù Ø6ë³÷ËôtöìMÇÕ¹Ár–-\¥_†÷h¤ûíµ$F§ñÜ¤ÜÚhëãR¤‘²å
5o{{µ¬ža$ñçêõ­‹Wßx:7wf«D‹†²5ýù¥¼ò&HÒAh#ì2ÊÈzô?!¾t²â(¢j3üÙXÔþëŒp€­-¤!ƒ‚«Ž	Ærm¥§“G¹K¢OEôº‰¼aôm´Vb´o/_föš²âÛJFfe¼}çKiéÑœ¢ð–€é¬­>ë+l§„|º{êÂ¿[‡êªÈƒÌ@ÜƒŠBÚ¨ ¹y¥_®â—-¯Íìäñq‘¤…RZ¢‡²MT!`ˆ…â/ŒaÍ¶’g
Èù/Zz”4µÚz¦ê| ‹²Téøòw=.‹YoˆnK=ïU[hœÈ Ðe#û©ŠhT£¡Q‰ðÿ‚õWƒÀä´W‘h~UÅÊCå të[×Õ5‹XÚ™=f$&žÊwÜ×1»À/™EìYëp›—Ì¡8rËZÐp©¢ðe²Z%ÍôÊw¶Ð²û×)å+Àa4E,„1) 5»³;!1W±O-x¥5v¸Ïñ©ê¤@ßSÊ’²Ôf1œ‘a‹Ó
Ûä¢ÊÌ¨úŽJ¿.™-’ÌMxë/À‹C¤æjßI&Íd¢7.ÅÏoõNÂÃ'DÝ®‰	ÿ×ëTñú”ôR‘fÿM»wmØhn  @ƒJ@j“_2òñ¤ž‚³Âžl(ùK›ÓK1Ùúh“Ájƒ¯èæT]¯ž>·æ?Â`ÿ{r}©ŸKàø„œ/ý`5¤ 3VÕ""x#2Ž³êÖ=¡ÓþÖ°ª¹wŒŽy³Þ3ÑÜ¿ÊÛ:\a¨Zð&WˆýÞf•ÎƒéY™aš”¯¯ÜÿÎ$=\N›HóÄ‹üâ&QxVÊ‚&ibÕ>ŒÖyÎS?0¸
í‡±7˜wµiƒk©ùb¸&
€üoü#46©©%'Ï'¬tËçÏ?¢Ø¯kO<ÌœgÏü3‹HÿPžIE¬¥–¬Ê•&õ×XIª4ö¨ø +N/7WK¨QtØ„/Z leR}ìb3û×èëŠƒÌ÷ÃIMGÔD£emQÈb.ýØÃëœb	Ç$ÂÏ…Ã®ç¡Q1Ôé†[jná8-ûð£Yt à„lÒNá0£	à„ö‡ÆGë€\·õ¨¢[ÆÔÆè5rõ™8D6!‹õÊn"ùf2~^-=ÚU™ÈS~ecU³¤«Ñ?°§ÖŽ%Òw:ìƒ²³’ðè2¥óÃ#Ô-¿T:ï6ÍR`“D#eq¸©}ÎÄÅ«œ:¸ðÐ$³0ŽFpŽyã‹5T™ªíï,u½Ö]r¸»œa¡+ë;qd¬ÔÛçû&¾æ÷Æˆy>Yß£sÜœô•1“Æñ/¹AÈÁàpÄhÞ°.A²auÌP?m¶bAQsÓ+Ç [@É%´ïV…ÓèW-\¨tp›¬)ÛLø°Ü÷|Ï) —˜“¦~×þ#46d¨eKþKÝÇ8BáÅÔ\žüNDßÎé9ÚÚaDúC'b|ð;PŒ ÕÔ‡Lîi¤”+$Ëª»‘Š žg¬§NfÑ£(À’Ê©ø‚ŸŠ}&6*qÏRÕùÚå²”Q]®çJÀÄ`ùfU?*<ÄH—±>;4Ö±vÊ=P«Ó"ì¥ëŒGØb}¦‚°§“ É?hWÛÜ Œ}¡à;T$z"°‡¼ÿ§w`¯¤{¾¿OlcbÛ¶mÛ¶5ÁÄ¶mÛÉÄÛ¶m'žçžïï=çôÕ{NWUï^«ŠàÚA Üõƒ>9;¨ [©áªªóyŒºn Nõ*¼ºér~=Q[å«··%+¬ŠUÀ0Êø¬\/ùhôH)Pn?E–il;OŸˆ"ÍA/àì&’‰ÎÄ¼Te ‹¯ñ’CiñQu`Þø‡—?:zwyáòí}ñf‘EÆ`P(»Û»Y$Ä˜7ù”@×ßÏÎÓ%ièÈã¿"mcÂý;êËI @RIa¦®‡´
YWö°\ gYy„Žv(47<I­¡ÝjûšNjítõ#<!c²}A¬$%·1HxçV£«ƒEÇÔ„: `Úë—Ð´jÐÙtüAZ=–¶5dŒHv°Ð‚UÊò_«ÐÌ›d¨› r2BóÌ | Ü;ÜHƒ	@,Q¡JÝÎ½õx$ñL<MÄ˜k™?Ú©RVd‡Yñ¥Ý;˜^©Þ†ÜÖÉ*gÔÚ-ß*™t*gZðLê/”ÇâÙ'¥½âj4Õ’,•]/kBAs PdHÐHpüÐO®ƒh^æuäÒ\$¼í¥5Ïq\èi_y(‘Žì³üù2øRn÷VÁª¤0‡k‰Û¬¥õ›ÛÍ¯.ú¬§y´âÒP"§âµp¶ ÀP@)}6NXG•UšL×lZÔº%EöìO1¾ä#&®½$ÔÏþ]›6eI>ß‹ö¥Ff$Ý¿o;ö¿u§?k.5Ë˜Ï{þXwpZ7>Ê¢Ï°fm:}±wõu…@×XQ±÷bŒ±![¼´UÌ‹µ‚™à¨ õDR˜HéèØ˜f`rÎIT]Ð NPp¤SÎ‘2	ë¾›ó©‰ïþß¿KÀU`î¿ýåöPW ˜¹æÆù‰NÔ%=?‰bË«ijx ýï$'ßïÜÖ¥š?6àEÅr°ò¤¥™•j¬V±ÕR4¢ Xd!˜‰gwæ6¦QGÂ0MÒa¤vnBp€f¼„ãXê>MTN}åâa©Q|,Va°öŠŽüî²AtRìLVK™Â„l½-…yv|¡*øM¸nÚõ¢þÀŒH+t2b…ÁXÖRîî°G\8°¡(¼|(žF½ƒâiÕEÖ‘`Ú5ô×“Ë!,»{]ltÇ"6âÛ¼6±¢º+„óé#™ËÕ²Þ¯†>ÙÂ¬p2–y8¯RßìJ”‡éCå+(*ûN8ÐTá€¡B¹
ˆ|ìqý>a—Ö1Ý¤ÕT[nfŒÓÉ®>Å Wó|.|*æÃS€GPE‰eËJ”núîœHkösFÉ¯y«J[®H©eíÆi¿”a+U~WÔ7í£¹ÊÊ²õ¢è°àµd¢GÅªŒ%Ž½eO³Y™X8¨gIfÕ¸^…‚ß_À§HøÄ£„:º7æ{€¬˜êž)6ÀŒ¶¸ëv Ž¡9ƒ°à¦Ä‘H5£ŽñÀb!bsääÐ·áºë©yUb}54®d¾ rjtæKø&7·"uôúua*N“¥ üóYï®;±lvÕÀoïPiûMŸÝUÑ±aòVÛ{˜ª½éûbnx¼¼Ž‚ø"Z4˜):r¦æKýCUG=áËû­fñWã¹¾f—A¾‹^*`¨¹!t—`&XGSî‡ƒê»¯åývm?N%þ]Å»p®”Ø° Åö†”V½\Z*(ÀK½O ³ëð­ ¬Øh”Ë:×,È‰
fy˜	éª#ŸÏëwÊ–AªY×ùwÿ„•R½½¡©`Ø	u <â\íÝÊ\dJ:”_\D]Ç‹ÖÍg5@TD|Î§ÇyÈÖ*uÐZ¼«)X6ZòüH^ð•É3§ðe«­MI7>t¨M“Ê@õú¨†^ãA:õ=Ú‰¦„t‰ô
ÿíÊ|ˆ~;e†ýj{xïúGÈ( Ì”xË–õÎâ$Zi¸D<Õ¶†N>²•®öó!ž:¥’/ÊëT$ûL7¢_×)ñ³ø¤0 / sçXãÛE-Ç
Ò}ÝŠç¢ÖU°J³ JS*füÝ}ÔèvL~Ìúp÷Ýúâ‹v7AƒÇ$ŒàîœßRÒu&Û…Bõå›«#Ø¡¾‰½?n÷ÑnÛZÖFj£oã¤ `Fv9oÓRÁ¶Tf"QM¢*— ñnÖƒ{zîçy-(²µ‡YšÃb¾Ÿ ‹ÓLê°·üŒ‡¿ØE«½ PUÃù‚¯ÑÊóBÞ¨ëÁmßÉ‘Ù-Ís©Í×}GofÜ~¨+Íã1PªS9µÿË´Èxº‰˜´ŒÖÂ
jÊÕn¸¬Žè¡†^–DË4Ÿa‡:<PÑ‘`¦Gî¹å‡N´6¾wÆ†úG/¢Wµ»ð„yò=—ì˜GÃ…±~yCKâ˜¦1muòh6£ÅêBU”©¸Pl
<¶˜Š_Æ6Q Ë$	 ¶ŒÏðí©!­ëxÙDº)9|s§Cy†wŸýïl[" L]Lç÷ÎÁv“Ÿïp¡_ß:¦¦6p¡™Îì	ÎhºBÙ,¦dQÞÿá`7íªTˆíO‚Å%­¾ú÷ø"š£û;Á³qãt”W£×o!EkÊ°wÄådÞøB½0)±ª½	e4¤
ù
Ú,‚é”ÉN=³ìžÀÖ–¶Á×‚`£Ïî¸c"8ÕŠC%¿òþÄÔægD!ìßÞ¯*ÖÑ¾Us kw6~ú¥è2…JOâÌCé1õoKc1^¶±×¤cñ©Ìœ±ZèÒ(È=µ0:Ò<"" ß@¬Kjí4•kÒgÞ¡:RKg¹
_†ŸDedþkkhZÀï5OCà›>om¸ä§%i—·qøï7³ŠãLÓãwxÄ¨ÚƒwWXÕ
+Ïˆ6%W}XÖ”öâRù]FÞâDxÆìâÇy›]`	"(Ÿ–Õ8*W‚È•¤þìIQƒ\=ÖÓa¶0\åI5ê}"h°Å=(Â-PTi?‹º•*i¡ÅÂ0ƒuÜwëA·JDã·¶Ý\sÉ?B”`¬Bë¢°xFŽ0´üü¥MðÎÌ–1lŠÅ”W/qk4ùiüPPhR'Xú„²Ç‘»FÖm.{€dJh  ük‚5‚´Bð‡É„EÔ˜Mõ†Ût¹ ŒWö/¡>*9njhè/ô…]•1Aùøeùà³+•àE1Èòjr”Ñ”Gò9fI}Î5¢%O¹cûù¨1v¥³eã;}±@ôT2£¤éb†vóÐ¼k£ <#x!Xö·Ùd/–aÜ‡æa¼.RxqšíÊZÖ·yÔ‚9=ÇÈfÿ›¿(s”yëmÌÕõÔ…«¿(w¥ýÌ¸†îÒy•çfÎ-)o#Ns¢†Ôc¶*Æ›5t" (ö _À+ Õ7µ,‹+¿éÿ\j%Ýÿ–v0Ä£•å/`õÂ¹÷‚†¸.h;
IxQîÜ±•âÌïú‘i S[2Ó&2Ûy‘"X.’wGÄ¨´„`XÝ¸W¡Jsõ¥—
ˆ+Pªc\ëƒÍì\Ožüñ+r0½%"ûÞ[¦µÛ²ì)AQ øgŒñ?B`èüë‡ôxF6Ð>òü"Mðt—Ö1ÌÒÂáxµì!•¨W“ƒ•Áþ\·ËE™æúK›ÍÉœ¬_ÙÇô]Þ’0{ëÆçZc jëª‹ hÑÒª4Öò¨Ü„Ðgbà	°©F {¦	Ä4;D£-pƒ¦·}ö¡±‹«c’]Ë(Ø&à·C»Yïû©Á61ýBh5Deåu±Ðô‹ž"]Ûn!²âA’ù±=Õ#­yä¡~À&·Gf9H€ZãÿßKð=È€eÆ“‘|R¨ÊñLƒ"æºA´BÂ¤£T°rüT´ýÓÇ‚&Xi‘ö5€lïñK„³Îö=µmµ)¬É´~UaV¶–Iˆ¼²
ô`³ô1
ÿåsb(ÓŽf\ZXÌ–€‚ €ì‡tá«Ž:­ÅCyVSg¨¢&Hi¶^;y—äØ ñê_CÎ±Å_ue8gìŠLå;_ôø–?g|é—1ÕæË(þ€£Aè¼ýÎ¡Sžh¿úasëmX’.BBaNuh—Ý¿’*:‹Ž‹’ào®)Ñ2óÏh  Ñ{;S#2$ŸT0—ƒsÊt-/Uê·Ì«)‰õLZ ²'%p3IüC…íCÇ³DƒèQÀ²û#§&6±J;Ü}«øb‰Ï\Žî~éØ|šE±ÜÛ˜Ê3À:T–j¬q,M’÷D‹> Ž‚öæ}–ý½¥u=(œér,6,w«±ã‡É ZNXï'4‡)æßÇ[4ŠÓ¢În÷^ŽÙœÐhØhîTx&±õ¼”!÷Ç_ƒaïè¦˜lâ>ò†]WWµ%Ç(+fÚîL„?Ìú_vœ5p¬ÊíbæqÅÆ’À«©3áL.PÅ¡ô6âBö7{A;EÖ'²[Ç²ë•rð”pIè·íR	ÓÓoT§­¯„N3ruñGhAŽ cGÙuÂ9É~ þ¡]afLŠY:û©ªÍÉwr^ z´7"ùóŠœø-rˆÅnåßÑgþ1ìŸ8.×ì(Àñ Lå†&ƒ®±`ºËýàhùåw®¡¡ÎIfW®ÃYá[”Ä«NW§ a#6©wþëôM‘ä]NQ  $;ð4RjÕzÆäz°>Ö1äÂ
‰µOÏ±Fd®  %Q`¬þm8<53ÆŸ¡NFç23Öês¸P’¤•Ý+Åb^–‰IPKNò2þ÷”Wpˆ-et,¸ö¥˜ž›|Ùf°!cŠ#¾ÉÝV$aÅ¬£B€`‹9B˜uµòð1AÞÛCøÖµÕI´Ú¿íÿ¤u*X¶Wº;üü6mþÝc ¡L ä@­ã
B%œEtÐÀ	B ¤’I,¯>¹P"¡°2‰ë~–Öé†#®qPJGß:€©@þ	¹3¹Ï= aSœ3Œë¼Šµ¡näÙTˆXzZ‚Iî«XîðÖ¥~„K-Õ4\ÄI¡C•ÈW¸™ÞüE@L¡eù8}~hÝ
–ƒ¿~º‚òÖþ¬Ë”r¢-P¿É°æ6†}M FÇ	|V(èG®\Ï2r©=äÔƒØÒ?oxX¹\ÏXÉqÏñOh‚_Ó¤X­ÜÉ¼/¤´vWCþW?VxòðäVY"þ4R@§X6•Oè˜dG6}ÍƒàkuËKT"îaÜ ±¸è Æ®HL–.È.TÔd©›ôzcÚ'#W»öª#Bïœe~Ã°¼Sâ½ÍDWD3g;&®l€È}ó/SåâkõØ˜{e|·‡~@Æ•NsS7Û|¿4M‰de…4M8¢šx$ð\èÖ°íµ±Fck…b×H0Úm=MœeëqX²ÌC˜íH®6ù7üÍ´›©x·ónÀf$Ô¹èäEMâ…ú‘£CQ«ÿìß±û¾ønÚ˜úã5âœp<—Œ>döZ«'½Ì¨ï¯¬X¨»·Aè¯¾b‘ çÚ*U7ìñ”ÖÞ½ÀYàw.ömšk£ßYÝg/#²	*x§¢¬	·täÒž–š×:
x©96í<
:Xâ‰C–£<îN	…ª›}›N1Žkå®˜SB­ù6Y±Ç˜M¤à{EäjóöxÆ"ðûåz¥º§'÷¬ªVFý‡
4eIIh (PƒeA"4@”¤|«ÏòÓcÄ\êƒSD Á<úzÖ—tÜe—™d°)]ÎðLÒýÙµ÷Q	±ó
½çn«ïÿGÈöÞ›£ÁŸ}±îû;.@ ¯#d¶RUÁûkOñv·S{–å/âÔA…ñ’‹c/¾.§ÕˆZ´äü9¡•º1“ÁV`ÁÜæ¼šéú¡»ªNÎJc¦³Ù«1ê\U÷ò2î§“O‹uKÐ‡vîE'cJÆ N;»³TŸoSýÆôòSY‡)é¿@—·j4àÓ‘‹Ï¯š
#_Õ;ÚÚ²±C]îX’bå¦#O°¹yåëM\Âõ$‡¹€ M}Ø°ë™(:9žv/ÂŒ¬ ã=þ`jžDVÞÈªªIÒ¶¶£FB?^øÑk5^³ÎMƒ`¨O­°[kÔ9]01(ÒÆþùßú¹B~G%"ºµg€r|RÐÎñƒò›ÈN¡9<dÒyü*®¡³În"U×=bËñ¬×…ÚyQúg½ÀÛš<¦_2C·¦7¿g´târ£Õ§zRã11˜Äè4U°6UÍ;#&HÐ¾hF¼ÄÎÈÿ @Óv¬ÏÐ”)6»ù\`õÚœíþ»m‰l§!˜
¨š~jq‰èO9Ü.®•u¨ÔâÁJe75}ù7{PEyØšX5óˆ~1}Ô'õšAf…ªï¨^Å›m y©„×iá8ÈÓþ¼g4b-Ü½éY©·F™Sêl~ÆRÎÜs1rMÕ3ðÙQ|u§C³ä'çOó™õhÍÕÀù	åã c+5@'ÌØW	„Q7É“Q®)J‹nð]¯nN®N©ã`sêËxo)æ@V…TE¸>þœ¿¢ä²^€OÓÓ¬ÄŒâÒ+êþÉ…n1ÚdÏ‰Më¸Ý0GÅ·YÖßD
ƒdƒ¼w 
Ù8‰ÓŸT€Èx”	€äŒg¡ÛÕ[(~Ç}gÐäÑÒmæå§GÞÙ¼Ùüå÷ïÛçyŸÍzhñpNwúæB‡#A•åßêÛ H”‰¨z¡£æ$²û6±zÐ™ïõDx– W)]>&ÊQ¢Ö{ñxGQ-Âñhšó1¿Qãˆ^ß2¢¸Y6lü}Åa–/£†þç‘ = 7Ø?Æ“£ØŒæ•kió*¯Q&øÐ}äÊPÙT*d-÷£åð\Wÿi	Àá%!¶»ÓOeVQ$mÕC·î»êìÀÿjÂØ¨7îú@Æh¥‘†€ÓBö5Y·;ùmé¿åøõ¸#ï=Uçþ‡6ÑTL=ÕC?;%<ÓÌ=ù),Ê:ô0]ýq:µ²Y›—¯BLŽ–Vm`‰Ù:õ$ƒa.8xÚª…a8"àìnä£O0¾áöiiø½{ŽüíÙbv!°¼eo½}wóêÀù­Ä5 Å~lœ@#nÊ‡eZ33ÉqŒ«2nÈÂFm7F€]BTYÖØö/m3œ¨õ?õkÒ}ïc³,ïÿˆ„DD5·­bDEÑ!’8’TNl§ïþén¢Ž1ŽšÂß¦A(ë{Gåk×	ö•ù/<6Ž_ ‹.F¹«­×yÅ§æ¾yimf2ÊxÓêˆÁÉ3Þxí„PX-ÅªH­û©¶,t½JòBª~áR“œÒíGzB§ªÌ~j3}¯ÿ%€+í¾]ÐóHXMêð˜À]:Ê1÷ã‘2œ=Á,T·ƒSÚÚ³Fº›y²f^ÙôjÚÉoÀh °($¾{âÚ›&’}b ÐKˆCÉJ–²@U¹ØB&3·”l·àÎ¼Ñ¨¬4ˆBr¹Ô>íšec*J`pÛ8Jô 8e¼–õ\{cÈbpôø<–m_9!äRoeö­¨ÍUˆƒxÔÐág`"¼ºÈç@˜ áq™bÐTÇ<–S :4Nôôƒàa¶1µûÎ]fm‰ÜUUß+ý´þÀ]—[àð»y‰'`¶ò\*¿¬‚=ÉÀ#mÇé)˜¹Œ™^ò°þ½I4àOÅ®€ÞupÃ4jÉe
ŠKô­Ü¾1«»Ïs÷eä3{ö‰ÿ·ÇvóÜÀF­%CÎëû'—LcÔóæì-¦4LG‘Ž¢’Õ‹­8(„ÞúôÊ"QŽ˜ùOËÄƒy¡8@"Ô8œpZ¨-û…¸è4øQ¼ªgÅ×GJ^àøv†	{.PÉ<ÂÔKöÿU À`Ät¥¯Tæ„Ã6møƒbô}NsÔ…aqžCR“*ÇA|‘’À™c¡Ã²ì¯ö—<ÐÁ‘WUÄäBBf~|5oÿz¢zæ`°Áù›4¼×ˆÑøŠÐæ¨+Û;ò*Ê–T©8Vm¥¼9KZ`ôNø³hnAæé, 2 NwŠ¢wiáë04b¡B;°i¨™N
ÄˆûÐ*Z.[uófäÎ%åzª·uôµÏmÿ¥C\à{üÜO"\—Ð«€*‘Ð±kêuk72å­~•N¡¶,]gÓØÊÍù$ö2³eÉ.ÆÆC»‚ŸzˆwT‚º´Çu6fsË_¤]ñYŒ¨YŽÜú&ko@ÍÉ‰ÞcÇ‰ã¡î%&5µ·t¬E1ô)!‘ÄÂðK$–ç4ðtudÓ2±m­¾X%K%õã_à¾Àâ[iõe‰BNƒ”¶Üßìz ¸ÿgÛ{î2ôÔELPŽ5/d_­q4Ë:­…}ll„"µ«Žp†[¡Tmä˜q‹‹”j–§!j–g—#óôÊŸéþÿ)ÀP4¶ßÎÑæ„N6cù†]°ùË4AÀ³ëØž"µ¦«Êˆrãar§Í3¤Ë›VwOãý|æÔ\€™]¬~ycaôË-jq¹åì±3Ü¤#‚…!€~ªLø R¤ÜÅD›8g@§íÕì±IüH+¦¢ù‹ð)-ð7¹Ù!>8=‡\tÐÔ}ÜRÇí½&ðøä#£À‹Â±áB	o¬€w ‘™×1za—Ç¬uP¨ƒS¯Ü@]KAæá²óüHavûçK&šá²Ðn|µD±!¹6c½}o^·ºrNín¨h{_Q?Z'‘Hêê’.–•cCKÖ¶§ ÕÙ»Ïgf&pWHu.Â½qk¶N1Ù9 k²ØˆÑqT¬ÉzPüo_¬t._€w
é?Yß(¾ëa	¿GÄ>Õ‚ @P!ú] dp}H0"‘¾ÜDäiáö(A_„ÈEÁMÓJe|Ä™) iúã˜|QÙ£m‰ZÉ–:¥>ž4³m(œ™A	ÿ@ã`ÚÄd¶Mª˜Maù{¯IÜŽ-þw´½ fb²s	ÏË&úáoLbëÎí[Q7/ˆ[ûô› €Ù·ÐÐ—³þæZ„FÎvÆªH2©ËÉ¢UýòÁ¯ºc¯Hui…—`\/°m´5iHí”"*ÌFŽê{üúH¦œž%¡ uªWÚEdþ†“å[‹Sc"eÖA•v‚Â\á¿Uþ_Öèoª„¦;94è„ê3«‰6Ñ¹RÅ|Vé#¾ðË/¶åK¢žÃ!çN‚ÒuÇug¤Gv;Öå"Î”dáö»è‰ã#ÍÔ0=S+«¾*t£Îr!•yôv ªuÖo=ü~‡x…þ«0«ˆ„4ƒÝÿ»øE”ÐýÁŸ©c5j»gTð
ƒ†šFàöv·\ou)6)n,è¤+æQ”	|žfÖ¶vïaÀqùƒan9:€*IOL2Q–ª¢Mðß~Iì‘Ý{ÌÛ³¯jû	c¡VÏ 8kGÃLRnÌ_rôqî£3A<oñaGãòü¥T_Œž?7ms’O?ÄGXÖŸ­s/^Ëþz ã¡^W¾¾³=é<1:l@°öq<-Pé×Gqøõ“±Ç7âP¼½GìÙ‚…U‚àÛÐ[·;Ÿ´äïŸÊ—èòma´Biú7ËŸP½ìñ›=¬n?ÿº¾~ûòßWŽþÞ³Ò…j½±`­9éñTh@Báö¡1òaáEDuñ{‹‰~‚ø‘ÄW×®Š¨øs…¤§ô	6å{jõ±SQ¡Óï@Ç  €†2 ÝøUÇ	ayŸàLRD—‚£,lÐ0)Séì²†¬nÈHì··‡LëFÍažšéG#ye^Ž¶ô':ÐNI'Ö
XÑŒ'×ÊÞÑmQãi˜bºŽy¶îù+eúËc­#_&?.ÖF™­Îˆ—¹ââï2¹æŽ‡¦ÂÃzfN:Š‰dÄwºæhÏ¹œÉß%Î³‰\gœÝFîÔ1];Mqy±_oîZ£)–ñ*ñ·çâ2¾‚ }ÕËClÞ™J»-Ò“„Nºø;ï<Îæð„ÀgàU€2   
@¶*@¶¹"©ªý?+ø„Îšºñ¨ ˆll< ?Ý>3= Ô€¥Ö‡©0mÞ‡¿—2²çÕ¬Šj›ØíJ1Ó~¢ä,•#Áº‘ZÍø 2ý›½øöÏx›m÷H¼öáòýðæäp¿±&»?ø#Jº²T‘+™ÁÍ£¢6CŠÂÅ%d!%’¡©Î?C¥­
¯ò‹ŒÄ¦I–Yày•"©HÔã—i‰ËÄ~;  “  ‡ŒÕx‘ýõù)˜“é¾ÝëiY1$Ô*Vä8%_$Á´­F®M+ÅMÁ˜Ð©_j«BøÛ¾n­¢Á4ñ®ÚénûÊ~ÓðÐðvsï÷ûee9±À%3ÿ××Ê‘L ¬s£S±&¨N‡;bñ´ê'¹Â¿o#É*°EÆä:FÅayF~/Ybc&Á˜ö³6Š¡áåÓ…c}ûy¾·°°Œd `€¹_#?¤Å)Bj2˜¢›Vó«¢Djkq}{QDŒ:ÌôËàÍ‡¼ø'¬„ü±u×|«Š’RŒÇ8Á¿.oaôÿý
 ÃÇÓ74€rðFBâÐïÝéÈl#† ¯ç~”@IñŒ§y ‡•ª—Á,7ùZUÁûÀÅ(Ð“X¢æŸ×Çý;¬äßhõãÐþ­gÂÖ¥ËïsÒh Ä0õ·dïÓ¤:DÖ?w68aùþ…õL‹W:{¹ýË¯ÂÈ5^~!Ñül4vû9Á÷Äd/^©üm—©¦õ1„[ÕŸ0•»¤+¾ºƒ?W{¹ë§GöœÛz_–\÷ûÿ^É÷K¸ŽÏz$(\9öÚž®nÝÓ~XtL¬Ubk­kR5±Ùâv„À7ºµÐUšz#ƒƒ F(V¡ß.zÏø‹_@ FªdâæÓ,&}PJ\hí¿
½QËf”‹&’’žæ·8w»"»l÷TX•-¬`‘2Qtn§­bSY§tªÛ¯.‡Ž¥Há>·LF&	Ú4„tÖnâ^»mBL/ØTcëÓ“^ÎISË4+÷‘)\ÔádÔFtx75.‘
dˆn <Ä€¦˜@‰fSÐ=fuNŒÏö¡ì °³mSH|%úY72Z5Dr~÷ðg¡©ˆëL*¦ûË#É@CÕÞ_åßÍù©×²Àô¶#à(j²€H)¦žL-Âªp6œÙY)Ç%Ìª(Î\ÆÐNeÿäÎCYb2(4-ƒÚ„UP 8™ZþøuVQi<¨<21å²YZ3c n|ßïR|ŽW°OBžà¨{
		“ª˜LUVKæeÉÝP‰&êü÷èâ¦¡*çÓÏÖhcS$e”&Ø€ý0 C­-ÅÙ•ÈÊpÄ>9'Ó¿züµÀ•–”a)"0cbIšq«Ö^…h*X<ÕØ8>+!kÒ,dsxJ}–A%Zü´©_îÂj›,Ã\óìÓáîË.3áÚbŠ®âÔA(†0LÇ´ ü””?9ÝÙÇ¨0¥õ¿=œE®íh¾wÛ¿¥t¸uè É.p|íÊ~4–`ÚUn4‚üºöÞSó+­“@r."ºQ:3Ÿ‹|îÜº~Ôõðm«s'  D*Še}q-pìø¦ñ×þj ÓdÐ7Ebrâ‘ºôå37‰­ ºR6XF<áÒõG)±ã+*È"Ïsb¤]ÂþñôZ‚}°`!EçÒ&èQÉ3Ûf¹]óÑ¿S<Ï¤f„Žv§ï@šw‡4óo ¸sŸKHÇ•ù²N)¼·“Êee.’ŸE&<›_¦…ƒB|€fþA™ñPƒäÍÁ{GU¹hT™r;m¤t=±~ý§g”?›—]ÔÃA¬\{ŽÛBêF|^Â7…ì•°Ë¯ÔI:"Ü©7:x( ®ÎÈR°zø¹2ö»Âöög†
j+±õo5{2÷×;ÉÝç|¤oòbž6?k7ÅïLêUžöé‡Ùƒ™T«º¼ªJÂ¿® $L‘ 	`Q*èjHúDISn²K¡Oxh,!xŠXQƒóŠ”Àó¦6øz‘Hd*à;.°Y‘4þ,[dØÎ|E ”!ëØ.)„K¥—U#üüü‰/Ñ’zÏ•dÜ%ð­Bk’ 
µ²6ý®Øþ0ü¥ÇÝîó òëµÛ!¢
\B“Á-qÏÕ;›è¡‰ 0Z‘mUxì;¾ Þ„`<ø³^÷ò{däºÏûÈ‚oYþ,;ª)	IWÿÇ[Ž K„ý¤¿Um…)ö?W×ÍÐßSTË¡&ÊLÚ«ÀG«!d8¯ã¿iÂ*©«Aò®Ûblë†<P_¿Œ(Jgñÿ…A¿‘ŽhÍ˜ô	–—ÁÁy-Xl ¸Äœ<t˜º¾ƒv µ˜ì¯Ì¡ÑIÜ¾þ€7jp|âFe¸¤ÂŽ‹ý@.–q>íSW>Ñq$ÍÊDâgÇGR_Q‡ú±¾ÑðÛ„Etá3®æZ[Cáò!C¢z¼4Ž9lã*1'¢‡B  ¨Ÿ6ßïìÎ—)_áÝ0µmÅÇ<)’XúÔ´’ÑbU¼Ñyc¼1%QšTõÑU„$ñ¶Î–´}}Ñ2ø]–·)?@%ÄaVbËX“œ"+ùÉzf P¥nG\AurcEyàŒÝ·Ãz÷äî+°Ô"`Ìú[Øo2Nu\¬+|¨¾Yb'S©ŠÏ‰$œs¢‡à÷øI4zdˆ^©eA¦7v£ûóýÐÀ@4ôÏ÷1ç¤Bôjùƒec®cÈìAìp®ïÃ`˜¾³œ›kßœ‚'¢pCÁÎGsHÁPAù“‹ Ð2$ PMJú+Ç”Ä©…Ú}+R¼TîÒ‹ xé¹=±À½hÇtt%…]Bl,Ô†—5EtaÍø¥NzçópÄ‚4ÃgÂŠ×©XoA5Ê÷Þ^Æ“™mƒ]¢o‰'än‚YÄsŒœÄè@‰¡LDFI¤ôdfK—‹@¼èv/+%‹ÁåÞˆFRoÇ†ž‰ §m%ÔÄpå”:ãD³ŠRtä]du ÑÕÓ<Z!¥}ë’šEÅ! éU)…¶BµŽFIx‰Œ-BÝÉKD÷#.m£à$òoÊžVñÁ1']ôß®/^çðyúrœ¬»fåÝ	yÇÇÉµà©;{?s³UžW†’k`Kä"5i!_NÄ y¤(M+.r0£Ý²ØZ‚¹b1ËB’JZð‘¶îÀ.zÕ§Ý-0Èð™&®QŠŠ¸,ÐY’eiL¨½VÇ'/V=­Gä˜£Èþg€Ù*é[_áô©‹òÆñ‹ÁEX:‡7X‚¸UýàµöL%³oÎq.ðc”E…TÆÛf<Ïw‚ð2Ñ´¹a¯4oª	Åž´–XÉÂb ¤ˆMã®¤<ÿô¤u*š%tcÊF›×'[+Ö±quóŽt¸è¡³¦HeÍZäÌ¾–ÍÈ²"PPKMV²cPûhë#íÕ¦m¦|–ß•å]ø0ÃFW¦³ÁJÙ9’Ë2*«sææ{%ávj©ÎÂÃZ¯A¯PÞAI+z\ÄØDÿ“„&I—\ÝN²‰teøaïa}´¥ÇB—ˆoM~• €ªæƒÞ8·f‹µc10›Ö¡M u9èªl‰UQ¡Ùè?­,d^šbCÓùÝT½6iÕî-üÜys,Úþ!/ÂØJ°QÎ©³°ZÅ—&¶04;F=†·^Œï CHQ÷‘…í…FxFÆCÃ›ŒNâ¸åf!%ÌW`Š¬ñ“6bk¤fÒ,>³é»sˆ¡Ê=¡˜ê;pµù9Ðà×þ†Ê%›ÜPn&šÉ?ý#t	 ƒ&ÖaEbÒ§˜Œç'5Ów¬ÁRè÷,¾¶zÄÄ’î‹héøç³ÐññÑ´¸$¾õÐéÛ¤ÝíÕ½!¬ï"‰ Àÿ¼UäƒZ
'õ0nûM´¢ã´X…º³L BžLÞóÒ}”Í/íï#³{)OwÌ“«ÏM­ññGëojî÷×3Iiý3gŠ\Q*«(›Ô˜†'Ø6‰‰VcÌÃKhUOêæ–«Ë×ßP.LŸªÜø„»è2_‰se¤çµaæÝuKo£WDWDU»Ð3Ù§ùæj˜ªøçV‰Tý^·¤R×ü&h·ªœS~Åú<
OB r€Àž ZH¢Ös Ò}LOõE¾rÌpð:(òeYOoe~báúÐŒ·ÒcR`úw/¨;ç`p¡5*vG'`ßFE¬‚ÉM ,2O–)IF²¿×@GÎÝþ«ª°.)9w‹eTS<L
çÄP$fÂ—ƒÖÛ«ÿäÖÏõcñ]\xpÆèÍEŸÞv!Òú4Ö`P1'UJB2ò?£1€4YRGùWEjdSûßô¡åD¯òŒFkÊÈ²L
|¦;óÐzâ\Q€ )áYõ¹`2IZm3?·zXÌÉÖ”EÑÏàJdúEû…õy)[ªkZ‡Š×›­ß,Þm¾Àqû¨p—ÛÌ^àwíø²½Ív…+óz:)¬»µèOSžm\U^°	‡ ìÛ
V™”ÉÎÇ»ÀøÉçŠ’»Ö«YHD?¥6±ˆti‹sÏÝ£‡‚h¶!Qé FrˆüI¯FN‰+”VÕwpÌ»öW¨ßâÉ_MªÑä­%È¨~&ñ1Fx}Ø’¼²,µyr ˜†FÏ65Å ƒSÞPUÙ]&a6x©žÖfÇNIzUt·¹Ê’Ð²ÞS/Chò:|ÓµíYøcÛ7¼+ú´_¹A48âwa¤^§Ö|ÌJ
ì24l8h¥oð:#˜¾R™è
_y¤ômH#¢y¡d{eš”jmË‰¤kJd³zèGkÉÊŠ¼JPÜ¸Gãå‡Ÿ*-¶‡©/Jæö³iÆ%–DôpÎÿL’× 0zº]ë<*ÃšèZ¾7yº7{x2§~œ§'˜µ&Ž²"èžùZVR³’&ÚSp³ìR„%åNMQµš	äàœ/5ïr½½Ñf›"¸ƒ*m6ÔQ(´?ç.]ÌØÒp&±ùÜW¥‚@ÝÆi¥Çå|Uï›îi—ß!Š@·&WÕÆD]…¨«ýyØ  H$Œwè®ˆu?]:!¤•2£e©™®î)[9éŒà.‹úïÀyî	-»¦'Õ¤žmCê„0fsÄ±ÝRz`ïo L_es1Ì4Â•RÝüt¹%Žt4(ÄV‚rH m¯)¹˜ßîÐŒYmÏ®3 YfŒÖ$E¹Û0Ù-þ‘·‰ëìqY2ryqu¶Õ ¶Êÿý¹¹import Settings from '../../settings';
import { EntryTransformerFunction } from '../../types';
export default class EntryTransformer {
    private readonly _settings;
    constructor(_settings: Settings);
    getTransformer(): EntryTransformerFunction;
    private _transform;
}
                                                                                                                                                                                                                                         °û0O+±‹ú—½c£€`”ýy( Ì]Pg^ÄIëè#‡ïÐ^ÉØ«¼Ä!Ð³6åa/R´èp¨ôÊ•€""äp¢DG)‹UG+R£™Jõ•¤g.tQ™‘ËR2t»‡ë5{zA‘â_›)>k†»—Y‚×‚Ä”I³\ˆ±y#½pm‚"{¨tšÅ‰5ÅOÉÃ­Bˆ, @†4o’ÐªÉG…¸]Ç©£ptwH
KËÓ¬c?±ö´\ß^ï ¥Á¸(öÆ) q®ÀÅc0AŒû¬‹%u^{tnÂX¨‘¤V¾H©ù½AjàD”ö M*íìØ…FöŒC,1<èH“ç~âTÎA 9h&[zwŒ–O·I·JûÚe;m-°H«ÐcpÓA7!Dl(±8Å§;+ZË²bA6fFü“!Q•¤èâE5Ê÷1ì –pp ‚P@eôPQq¨ÝÕ;¯wä²²G×¾ËYPÄÈL¡¶rc¤¢Ûß¿\ªåÉtÍ-IJÐ‹QŸý9¢œÆây9a`b}r×.¢tÇT¦áˆÿ7Sà€úJª»‚;g²iÇOê	WâjkÇ4
âKŸ0šaU§¼ ¡–­h8À=$Av‚ék—*éô¥êpi»—_š»O …Ÿ#†rÉGdÕÅnsÁsÖÁGIt7?¢ÊBA–eKÄÀT•…R4aT.E"|á>BÝ|ýsï…*cFðÙ¯ÉÀ0¢-LÄÀ–HTÓ)¢vß ¬N:M‘ÅH‚7Ë3¶•zLOMWˆó¡:Éü!…]"Ûº6la!)Œ† >Pê=[÷;Q7¡q:Zé8Çdë…¨ýR)2!È È‘ô €EJŒ…"|{&70Å«¸‡šÂC+>8A°bJÑŸVç:ŽÚ„?;Gæ.ªÂ@ÔÜ‘Çõ@ø²£äØN^C•CD¥Ôð«áŽwlÒ´é.+P‚NOÕ€éžM|Á)@êRZã”(	ÛÑÞ¦fGDÈ:'T%›‰”|=‘ê@~>ßB=lÂvú»ŽFu”$ÒN¾I’U®¶‘ˆbÞØéM2?LÌÔÀ nð™ÜX©ôçr  çôÿÆåÎ‹ÓjñFÀ«5ÛÂcÕƒ¥Õ¶?""{Ù©¦þ’à}¯uG‘±¢:Êw‚²…RW/´Å;%&kÏV%eÉô„µ¦GOæz&í‹ÈDÒTZët6àdý\ÝñÔËQ[/>EU×ÚÔò`xÉÆâÅY[‡T~åòÞß	n¬ƒ¤óc8MÐ¸x‚Ñ}è¦`N²´7¡b“¤¡wAcÜØ +ˆÒJøáR0!Ú‘³”Ž&%ú¡'Eúì¬—KÓ¦EòDØ¤ÖIâ„lú`eÆ«WÏÏôü.ÂÄØ·dãÀé×Ÿ/ÌkC¬'_£	´ÌQÀQéï[T€ôh!G>íŽ !ù¾‡Ãý>'lŒ@g´'ÿÃÓ­ÛƒŽÛ÷Ï#ö	˜[¦åïDý©÷µjíòNàKÓâ¶®¥]–b#]ÍŠ¶Ý®ã2 
Ø”¯<;@jÉš ªe5†o9
`ïæ<`_3Î-Ÿm2Åp£H–¬bð%ýà˜ž[—-J}“T™¹_‡a‹‚UÿÐ twÛø·Açp3âqjÙ‘²dvÜ¶Žéú/4<ZØÒ°¦
åÞŸÁþ‰äŠ-žrYMž§K¬h¤ÒÝÇÉ¯?þxã°i?X¦z÷QýbEøÜ!Zó*%„ PX:û}¿üøþŠqãCË*Ã*Þý¢ËÕQeÜ]èëN_Oóæ’ÉJ2\ùóÖ»8ü¼P#ÛNÀuLü  üaüÏ¯T­Ÿ1—XºŸÓÔÄYJ?Á>U<{¦ðÉã~Ù»s¡‹áÎÇjâ¼™>™™(&¥3†€@¦ZI½m³Ùä‰ªðòª“·ÈðÏüä{ák®vÕ²tŸz˜œ›ãè‰é§»f·‚/gÀn]ÀáJ²ÕyÐÍõ0„A  x.µ5¥ñý@ò%œ7ÑÛ$³DÝ8~·œ÷ÐìºXQÚ hæj$¤AµÐ«kÁÄþ„n—Ù–:r‹aÁÅÃRaÔ+‰à¸ñ)§.fü"ˆ
HjÆæñx4ƒ¢d±ˆ{"‰AJ`€yegtb<5³r¹ °9=Ýýs<'a“®Z˜0D„@s÷òÇ¾/hÆîÑŒ‚*â
]ùê]mþcƒßŸ?q>üg‡9·åÝ—%·ù?~ÙËõü‚ÿYù¦o\ÆŒŠJ Ñx@FJˆk‰=¸WqQ#€99±	äé[ã2eÁ]=Q.n¹½‰nse/­09©ç#¿ðíMÈLJë÷'Ôûôeê¯ÂšaÃjû=Ÿ$#²i²…n\Å/c…¹ ¬ €Krò¸‚Á‚ ¢É’	0›±¡A(È³µ¥†ÀhÚ±ð‹ªb@KLªåÜ¡÷<»”~4iéŽéZaÂèy•¥ÀpgË:³xŒ¹J÷3Š¦Â!Ê6Óƒ?}i™¯u6¶
± 2Hé`MEdjäNÕ/GšÅ\Wi”–¥<ÚFõt˜G¦6ÑòMgøk°‹‘—A/Š‹Ó¨7Mâo÷ÇwKDkÐ÷–ëY!á_çýž¾õ\5ë•a?aîýfÃüýi³cãkúF´ƒîeZµÏão•,÷‚@@SþËvÿa¨ñ 9êF`^ðü/€£k¬ ú#›å ÜëLýÌ¶ 0®Æêf¦; —ì!#4¼n“”XÁ	Ø«0*Pb7YèC«ç|aüJvˆ}?È¿l²Gß|“–¸Ì¹	¢KØ*¶X4PÁù…Jæõ•S±¶òÝ¶~áM¸›ÆîÕm®$Sæ@%	ë‹9Gô¥êFý’ÛÄ¨›[9\˜×©¨HÏˆCÊu ¯ÈˆqVxKiÞ<<cÒ×`{‹—ªÅê¡|*^©o¿ï¾ø‘q5ŸmÍg?)xÇˆÈþ‹ñþèÜÚº~w†Z‚f>L"_±˜D¶€0!•®ÃJLGeš‡€/¥æX†á2ýS/øÞ"Æ2ðK> 0 –¾lVç " µO£É8Qg‰’-¬†¼à†74Š²·Óè(å4ZáÝ?ö­{$Û™nÜcƒ8ç"Â1/Êƒ«>^"¢âÙÎJæd½ˆ5þ6:˜¤òòŠOðœúãggñÉß:»ØHv“-ÓlÕàöúEhØ“êƒ
uùð<z\6“`½M;ÐYM)—”OÑ„Œ øÍ·Ì÷ !rÕ=£ Ù¿ª>ÝO ^Éö¦y ºb²îIM)cGeãÐ‹G¸R•ÀocGœÖ|aßŽf ©š
 `T´á”« ×ÕZî²1„	b=õøè“^œ+“.O2u;ê?Ø¥Áû´Yq@ÂqlÞ(ín“WYœãÊ½EŸB˜y‹œ:{ú›cTÍÚô âyùç€°Xžje½¹ü”lì¢Ï‡§`O VÞt Ÿ\TDñ”‹ŒK¹ÄŠb úîeÍÂ8©R>H·_>u1Ÿ*ÀÏO/Åºf^á›M¹ûâZF¯£¦l<ÒÒÕŸï…‡¾"âÅ_õK^¹I©«ÆS¯ÊˆÇA–/ŠqcžËâô
.D>•Ã	5šiP”2·†ñ>S¶¾âƒ—…OÞh£ægš‚EÈç\t_ŸúVYØ«³ˆçOv0‘ÎÞû8l‘¸Šïß~ÈHyDS)ò 6»ŒSx†Ä§‹e²<lÀádSl'ƒ–“¢²‹Šd_²dì„“9ú^òÄ(þy‡}JêüOW ªµm}Ž¦¤g
·Ë)÷7Û9¼Aºß5Þ9Qi–~T9“Škhœ[©¶ŸÿI>§²Óz›tB™òÏPj}ŽQ–à*;JE.vý®dòuùÚÕ›ÀŸË¶¶‰›f–s™é`müT½ö o”jcŽú¡ŠhåWGPâZ±}º3SØƒ*ÆÝ¨®×øSx/³ŠXa{Í¹NÄ¶jÔýÁ0³¤’ù33ˆË•Qúg­ Ÿzl´ê,Û“´V'ŽgB€žHÖÌ)§i>*«s½¨?ºÖ(Ò›¶œNðk>d?@—kI2”gŽ.¯
vêõ!—3Wä‡‚kßƒÎÅgÃOZ·5h!ja©!ðN9é4eK…ç…h_’pÎså‰åç@@™Ó…Gä×Ëœ_$ôù/xWÚÎÛW®$æ¥ÁŸt.·&H?qYt%À5sŸ·bLOYl<ÞuÞÙ*÷ÈõÊj÷ç%1ÿÔû»RŒ©/tK]ÛÀ¥X•ÁÐŸ ¹èuÔR•~äDINƒÿOH‚ FH¥s(‡ãdºÙÃWÔ wâÚ [è‡kßp5¸sM®0¨ ¾íåZpc¾§´ŽÃeñ®Õ±…õ'ýT\à€×Åßî¾ÜÇWZÝº©„Ê‹éBSÙÄÈX²®ÜÆûL¿¼6¬L½ã°ŠÖ±ª¥íååÛ˜k_Y†ƒ|u¦ˆ(†BsäxÐ)Vì:Ä£~½àÌÊ\Ü#x¸x~Å•p ÖU-ê÷qÎŸ¤So¢+Òæ|+‘u¬‘v
BïÔƒxÖä  !ffb–,6è~I,o4+&#‘FâHUdŒËÎÉzÊö÷`ëÛ¿¥ìcú¬_É—]…—
Â-¥ˆ|kR­	¡G¼	 Íñ¨è{½‚î.òár
ÿûM´Vk}à\I3Ù¼ß@‰jF±ˆ„é\)Ž¼Ë²“ádžÙêÅ4
É@¨t¯L«z5iñ&Uh_€ô+°®LÉAÉ°ß@,Öa×½Éí&Òßï®¿KÈ]I?Ö3t„¨j£g\¤ÎT¿±WæŒüHø©è¯´ÐÀ'ÑÑŽ|ù1ÕÍŒ™ö?Bp 7¢[ÆW¨{ú'›±ü¡)ðr^1dNûžôÿJ›ƒ
µ[‘ô™ÖFëµÊ˜¹ÿ6‰µðü“êTV­…«³Ú,ÛÉqI¨ƒÝ#úETo®Ì‚+…’g
TcU–aël³Û¬2€3Ç‰¤J8¡A§4»“\“tñ¦®øëµHGü».½÷LÄ'"–"­ë·æûÓ“8OÄ«Öé:x$/sX]CñÂªÙm]ì…Í=§`÷juI›ƒfõ+bçäZ~+"mú4^[}F¹¸G‘îÉ8yº¿£9
2èI¼ê¾¶®Úi)EÚÿ'Gt¸É«:tÏÐX\ó§¼|^”¥¥7gºR1/U0GÁG¨Dòð¡’Û›Ûcä! GGÎóýŒ# Û( Ð›È%5Hž‹‰0JÆM5‹ÜjkÉ¦«WÔ&[íJÓÊÞ[cÂBMÆë
º³Å™ê´‚6G6¡fLQZëUñâýã¸ùJqr«¨?;õ/¿]µÛ–	Þ±-”mˆ´c }†5·oÍ\‰*]öêx´ü#@²- g
‡Ö§yDËOâ«×å^ ¢ŸP{ô‚@ÅK¥˜É™#X“¹¥È™¬WvP.gî¶µž-¦îÕ…±Ë{W*Š Ñæ¸ûõâ»p÷·Å{õø:r0FSÕJW™Ä“
 €PŒÔRø"„ÜHxãÓg¤i"è·i´{‘Í*q;BÅZ"Kø%ËJ¯ûë§¬bÁÈNô‹^ÅóFyè7ÚD{§‘>[œ^÷ 1ªÓ?§eMAN,2bBF ˆ€l‚D?
ÒŒ¤<IšL­.þ,ýÒ‹ýh„ó¶ŸôTl*:†0DQW6ÌÞ¿TÇs¶¡7«T:ÜLXÀxÔyz1Ãó®Qþ“ü¹PZv“Él±•€P	)põA•
h¡aûBYeåC„L4íŸCP	Ž{Kè¬LÜ‚ý‚nQ¥ºÈØ­Žê]Iž™ã[JŸ$vÅ•;‹SG;È¤¡ˆªL¸ð\©ÓdÈ1
:°0&oXZc¤‡/Dšò b6=­þîàÂ•;ßã|Õ~.k³ò„ð@ó‰¶á±îÔÌ|bøÃ`szé˜¬û•oÚ¦¨xfæ:Ê_EOzå!‡þÀ¢:H–ª8h.d!ÇÔ­\‚.3*%B²ì…Rûº`
†þA,.áTuù:Z?AMâ¬)KM¹»”HøB)ãém…¶|Z%°‘«¾øÚ^¶a¾‹P­ioQ1 €d?1wWöŒüÒlÊÁ9µ†‚.B±U‰¤eÄ\l÷vù/­GÝjmöª/w®Ë m¢ùåœ=³ç
%kä
^†|Õ®B¸4ÛN‡=¿ÿÓšåºËÓ[t%Q2:¬PP ’g?ìÈð}ajñ½RÆahâÅ©g%Dƒ’é°êùŠ(‹™÷)2íÛ±Ty¶äÍæ¹[u*·E±òM£(ÎÍ÷¥ÞÈw'ZuoiJ1Uk4NÀA`p‘’
ÈÃœs9½ôYÌ#OC_CN(Šû¼•v¤’)Qö
ßRü¢Ÿ›QÏïx§"‚0cPºË²¬|Ûu†¿¶ó¨`©ó ‡Nîàÿ‹r, %è†çWØZr$Ù[ a°fºÎ1Ljhud/DJì[=ÞÄÌžºAÖñ:_¹;´H¨¢°'ð)6YG•ÐWåz*ûq1Ë>Z‡VFq3¿ç¸•70Z˜¨¡È ‰z>v=Äzõ×µ­˜ú	aZ0¼\[hXM/J¯“mÇAFÐøXtJâ'ôŒ%˜HÑvMµU$ J³bþ¢’?ÙqR»ÚÍ RôØâ×	âq,ðàr[HÉ‰-»¯2&Ì¨ûÃØGè»*—|Ç…·<úÜ©#<"bªœSóQ|Q‘yPd)s„’BŸÆ„½ûÞÏŸŠ ‰MÉƒ¢ÚÕqÑ†oÄ¡‡œ»«W.Ç‘U6v¨=cgÈya×¦3Ö¢r®êÌ¤sêÅ/n	ýÔnzæ$BH‚ä)KíJ}Tm¿zk6h2¼¾ŽØ‚¤Ïõê¹°5-‹Š¹”¡T>@ˆaƒ0ƒØÇîÙÍÉ‚gæw5eË3•šw½Â}äEŽ­~\öØÅŠê§±ÏäÈ\ÿ#$ M¤Ý:„DkP;ŠÎá'±€mPt/pQF¬=úQ@•Îž)ªdNgk%º˜žÚ`$#Oƒs~à$–GPvyÏ‡Ùhc­@Kêˆ îgÊô+õx|,(å9TFRs¬ÊÝ+Ó¨@äh`¯‹FaIO_WðëI<Õê/]à ’ö±±’D"¤V¹3Œe`¾ËŒ˜«N)q;D¿ÔÂÒ¾²ê~-ý23³\„¯9Â‹w°)5”"*CšLIç½¤®ªèèta¡-Lúå]¯WjeÙ¤›r'	€	UKÇŽ‹ö|ÄeËL¨LËÝ<(ó—'Ø•0øCÓÍã04d©p"W,Ožæ!½‡>c+1	Þd²F\PŽ÷ŸDËÐ­Áš¦s¦Å•[
“ (dp“yã”^[ZŸ4½ÊÞ¡ß‡w×i˜¯Ö[Á<X±$7å¥°,š‰_+Ë‚mgÛnFU\åÕ\ÂÄ5Ú°I#%Î§Ë)Oª¹ã2È°Qæ˜¢µõÅ”êqíg±ä*‰V–Ç*WÈ×yÿªmÓ€ ,ŒMVx!5ˆIk£Ø„.g:&Ë@ñöêÁgÝøWì,·utkÍ<~ÊMá ¸½ãþŒ÷âƒ7ÉNPÄ“Ø•°¬Vf¾£žý<–ù—ëÐ}ƒcqw¨›6²GûíIYO³øZyîžÚØ¨Y|„ÑQáMÇy¥E-§»+!Û:<î«7šÎäÂ gc»ƒÜßˆÙ·½Àïì×	úh<€Å-T„b5Ñé}8\º£uÈpjÄVæ_Íºú‘?‘+«ø‹I¿ø¸b+&1…3¤à‰Aà´Éìs%:gjªä‚'È¦‚xúT£Ã’º†é×2ŸîÞu×è¡QM|+|šîGk`¹×¹±r:îßMÁo<2ÜU2ÅË!¬å3—kòšXŸ²Ê×Â
¿{n¿Åë	W¿ô‚Éè·-¢2Q<ÄM… ²=ùš‘‘e%:Ñ¿‘5, 8$àNh|á.&ÉÙÐ¸APæ5òc!¦’*?%š¯‰‘d½µñ3|Äb„‹àw{)ò{™ûLIÔþ'
þ Ý$ÑDÂr’?¹ôâå‚«ù°š*©&Œªµ{AÀz)\)ÿåÓ¦µ…ýcÕI$ Þ-‘àYcöa‚#8eÆ™ê2‚"Ù¯ÿÄ4Ûƒ‚Ö»–)…ñÇHU,6ö†=‡¾S36Î^üž]w÷ÈB]©M7¥šðÆ(ÚÓLPA¹	ÐZ)†ª‘yOÞç“W„Æ¦—‰(.”D=ÛÐßŽq‡whóÿr£âWÞä}©×¬ØÛŠ²í7.ÛŸz¨žíAx~i­J“ ü.ôGpJ†AðŸqÒÕ©t»,ê#fèÈK—0lq*6£ _½îºÌÀÅTºËz–_0•ú±çßòŸª¾†Ï¥Ÿ8
 3x‰5ŠêuX+™…¯Êè°1.PgtOh=´=!Ø_û65râ‚]žNJµ‹)£±‹|‡UCµ¢dÍ<ê)Ò5øFü[{:7:XðpÀÍûyõHGx¼H7‹•d#5ëã(*+¹„U}™ þ%·Y±Šš“ÿË?BÉ +Æ»çW(c²T“â|&pd]Î1LÒÂLñµf/	/™íÉk½N{11 pb¬p•òÕÏ
¯2G¨yñÛO6
ÓcöOê`€„õæ§E£cxgfßÒhIŒŸæ.âõ$(¬î	Âµ‚æÇ™´Ä‰µ’Ò¯’®žfÁº¤äf8âFÞøúvÎþåæ“/¾Yô Â¦SþYgv(`­‡ÚŸ6v
ÑZ²,X~˜€ºì²:áèÙFT¥¿uP‘÷6âR¨.V<ð®9¾Ù/–ÿ¤^ËƒæõÀÉ/ÑäsQY	¯ÂGïÐ8–48	xBô'ÂC!yœ-inÁ°rÖioNÄ´\-Ð›,M|²brc•GÖê–†ô6»ËkµeM@ƒT3}µÒ_]¾pïõAìn~<×
s¯R!(àp×Òœ‚Kö}¶éð„Ð±H.ì±5ŠuÁž± i‡ënyÏ*c­½E¨­fÎî?×u¿HlÄO>çß’ÀëÅúNV¶jí•@B0Sù.<ú)KP:/*Å–÷„j@6YÿËC2'—¹üA\°=¬î’rý‚Œ×ZOw0ÎÉÎ°Êô5Æ¢.ˆwÒ`L:K®à-½ùx,à«ÍVïýámò(¶ýHÅêw¹pÞ&žšŒ`º2à˜i24Ñ§úâ}‘2Ãæ<…‰‚PQ1\‡!š”ÒüJz[ª¦@îPuÜ'C÷dN‰¤£/ŒÌ5÷å:@‡ËÐA_ÆäêÂ~7oç—×w}5y$M@ T}àì”¸,ð»U:Ž&5&ÝâDÕ²<qáÕ£rBåN¸“iNÉ\ÕÎ=ËÒ‹;³\å|€À—MÄ>“ØåjuKôaA zg°A#^)Yq(­9ÊþèþŸtpC*Èf§?-"-h“œbú&ìžÚxg§ÖWªéÆVã2Ä“™bÕÇë¸@—*šG <7ç£Ÿ?ðíËú¹÷5Ì#
3¼ÇƒVšÇ'd£&´Û}$Â3ãÕž!…)Ó4ùad+f4šCÓ«)NBäÊÿ»7ú.L£CúÇêÂ„œ<cmÕ?B£ Ð}þíóCt%IR8;¾AX±gÇxe©ú:·ûÈ¿=‚­NGÌ9.7H}PC	çÇ™–m;´ú÷ÈS	âR- smÁãD°óÒjfnÒàÁý;ábõõ
òø
»v+vŽœ½£9Œ$È|ãFûÑž§Üù‰ê³ø__»À¯-O›òv@…R1Œ‡Êñ@î„.ýD¤xæïúóš7·$öò}áseý$Dú†À¤ ×4¡õ®KœeÑóAýÔí$BÇ‘!¬»Â"Q¨j†ìß1©Ý±š¢T]1n’:Ï…,z-f®L57èe;Ïó‹¢
‡6yçB˜HÚa0cŒâž<e¬OÝŽEXœØP398ÞQ[ÃUÅKXóï‘‰ñ|§>o^XÅ¡‘È\ÕÏÈxÅ|i;+0º†À§«ÊY”½&y 4‚ê8]Æ\à8
ü=>ÍÇ|ÄpÑÄwœ0·’v-ÒßÂ¿lTUI:3$#¡ÛÕ>«m3£nd	’î‘bÄ8[ÒòSäêlËÇ0µ %¯h
å¶)ƒiÁÇÿ	hðB;ç‡tg¢›vüÁ<ˆÖ‘ÖrLÕýlh5kO±s›ö(Ð×á•ÆbJ™vyÉ%ík