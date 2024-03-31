getMemberReturnExpressionWhenCalled(literalBooleanMembers, path[0]);
        }
        return UNKNOWN_EXPRESSION;
    }
    hasEffectsOnInteractionAtPath(path, interaction, context) {
        if (interaction.type === INTERACTION_ACCESSED) {
            return path.length > 1;
        }
        if (interaction.type === INTERACTION_CALLED && path.length === 1) {
            return hasMemberEffectWhenCalled(literalBooleanMembers, path[0], interaction, context);
        }
        return true;
    }
})();
const returnsBoolean = {
    value: {
        hasEffectsWhenCalled: null,
        returns: UNKNOWN_LITERAL_BOOLEAN
    }
};
const UNKNOWN_LITERAL_NUMBER = new (class UnknownNumber extends ExpressionEntity {
    getReturnExpressionWhenCalledAtPath(path) {
        if (path.length === 1) {
            return getMemberReturnExpressionWhenCalled(literalNumberMembers, path[0]);
        }
        return UNKNOWN_EXPRESSION;
    }
    hasEffectsOnInteractionAtPath(path, interaction, context) {
        if (interaction.type === INTERACTION_ACCESSED) {
            return path.length > 1;
        }
        if (interaction.type === INTERACTION_CALLED && path.length === 1) {
            return hasMemberEffectWhenCalled(literalNumberMembers, path[0], interaction, context);
        }
        return true;
    }
})();
const returnsNumber = {
    value: {
        hasEffectsWhenCalled: null,
        returns: UNKNOWN_LITERAL_NUMBER
    }
};
const UNKNOWN_LITERAL_STRING = new (class UnknownString extends ExpressionEntity {
    getReturnExpressionWhenCalledAtPath(path) {
        if (path.length === 1) {
            return getMemberReturnExpressionWhenCalled(literalStringMembers, path[0]);
        }
        return UNKNOWN_EXPRESSION;
    }
    hasEffectsOnInteractionAtPath(path, interaction, context) {
        if (interaction.type === INTERACTION_ACCESSED) {
            return path.length > 1;
        }
        if (interaction.type === INTERACTION_CALLED && path.length === 1) {
            return hasMemberEffectWhenCalled(literalStringMembers, path[0], interaction, context);
        }
        return true;
    }
})();
const returnsString = {
    value: {
        hasEffectsWhenCalled: null,
        returns: UNKNOWN_LITERAL_STRING
    }
};
const stringReplace = {
    value: {
        hasEffectsWhenCalled({ args }, context) {
            const arg1 = args[1];
            return (args.length < 2 ||
                (typeof arg1.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, {
                    deoptimizeCache() { }
                }) === 'symbol' &&
                    arg1.hasEffectsOnInteractionAtPath(EMPTY_PATH, NODE_INTERACTION_UNKNOWN_CALL, context)));
        },
        returns: UNKNOWN_LITERAL_STRING
    }
};
const objectMembers = assembleMemberDescriptions({
    hasOwnProperty: returnsBoolean,
    isPrototypeOf: returnsBoolean,
    propertyIsEnumerable: returnsBoolean,
    toLocaleString: returnsString,
    toString: returnsString,
    valueOf: returnsUnknown
});
const literalBooleanMembers = assembleMemberDescriptions({
    valueOf: returnsBoolean
}, objectMembers);
const literalNumberMembers = assembleMemberDescriptions({
    toExponential: returnsString,
    toFixed: returnsString,
    toLocaleString: returnsString,
    toPrecision: returnsString,
    valueOf: returnsNumber
}, objectMembers);
const literalStringMembers = assembleMemberDescriptions({
    anchor: returnsString,
    at: returnsUnknown,
    big: returnsString,
    blink: returnsString,
    bold: returnsString,
    charAt: returnsString,
    charCodeAt: returnsNumber,
    codePointAt: returnsUnknown,
    concat: returnsString,
    endsWith: returnsBoolean,
    fixed: returnsString,
    fontcolor: returnsString,
    fontsize: returnsString,
    includes: returnsBoolean,
    indexOf: returnsNumber,
    italics: returnsString,
    lastIndexOf: returnsNumber,
    link: returnsString,
    localeCompare: returnsNumber,
    match: returnsUnknown,
    matchAll: returnsUnknown,
    normalize: returnsString,
    padEnd: returnsString,
    padStart: returnsString,
    repeat: returnsString,
    replace: stringReplace,
    replaceAll: stringReplace,
    search: returnsNumber,
    slice: returnsString,
    small: returnsString,
    split: returnsUnknown,
    startsWith: returnsBoolean,
    strike: returnsString,
    sub: returnsString,
    substr: returnsString,
    substring: returnsString,
    sup: returnsString,
    toLocaleLowerCase: returnsString,
    toLocaleUpperCase: returnsString,
    toLowerCase: returnsString,
    toString: returnsString,
    toUpperCase: returnsString,
    trim: returnsString,
    trimEnd: returnsString,
    trimLeft: returnsString,
    trimRight: returnsString,
    trimStart: returnsString,
    valueOf: returnsString
}, objectMembers);
function getLiteralMembersForValue(value) {
    switch (typeof value) {
        case 'boolean':
            return literalBooleanMembers;
        case 'number':
            return literalNumberMembers;
        case 'string':
            return literalStringMembers;
    }
    return Object.create(null);
}
function hasMemberEffectWhenCalled(members, memberName, interaction, context) {
    var _a, _b;
    if (typeof memberName !== 'string' || !members[memberName]) {
        return true;
    }
    return ((_b = (_a = members[memberName]).hasEffectsWhenCalled) === null || _b === void 0 ? void 0 : _b.call(_a, interaction, context)) || false;
}
function getMemberReturnExpressionWhenCalled(members, memberName) {
    if (typeof memberName !== 'string' || !members[memberName])
        return UNKNOWN_EXPRESSION;
    return members[memberName].returns;
}

// AST walker module for Mozilla Parser API compatible trees

function skipThrough(node, st, c) { c(node, st); }
function ignore(_node, _st, _c) {}

// Node walkers.

var base$1 = {};

base$1.Program = base$1.BlockStatement = base$1.StaticBlock = function (node, st, c) {
  for (var i = 0, list = node.body; i < list.length; i += 1)
    {
    var stmt = list[i];

    c(stmt, st, "Statement");
  }
};
base$1.Statement = skipThrough;
base$1.EmptyStatement = ignore;
base$1.ExpressionStatement = base$1.ParenthesizedExpression = base$1.ChainExpression =
  function (node, st, c) { return c(node.expression, st, "Expression"); };
base$1.IfStatement = function (node, st, c) {
  c(node.test, st, "Expression");
  c(node.consequent, st, "Statement");
  if (node.alternate) { c(node.alternate, st, "Statement"); }
};
base$1.LabeledStatement = function (node, st, c) { return c(node.body, st, "Statement"); };
base$1.BreakStatement = base$1.ContinueStatement = ignore;
base$1.WithStatement = function (node, st, c) {
  c(node.object, st, "Expression");
  c(node.body, st, "Statement");
};
base$1.SwitchStatement = function (node, st, c) {
  c(node.discriminant, st, "Expression");
  for (var i$1 = 0, list$1 = node.cases; i$1 < list$1.length; i$1 += 1) {
    var cs = list$1[i$1];

    if (cs.test) { c(cs.test, st, "Expression"); }
    for (var i = 0, list = cs.consequent; i < list.length; i += 1)
      {
      var cons = list[i];

      c(cons, st, "Statement");
    }
  }
};
base$1.SwitchCase = function (node, st, c) {
  if (node.test) { c(node.test, st, "Expression"); }
  for (var i = 0, list = node.consequent; i < list.length; i += 1)
    {
    var cons = list[i];

    c(cons, st, "Statement");
  }
};
base$1.ReturnStatement = base$1.YieldExpression = base$1.AwaitExpression = function (node, st, c) {
  if (node.argument) { c(node.argument, st, "Expression"); }
};
base$1.ThrowStatement = base$1.SpreadElement =
  function (node, st, c) { return c(node.argument, st, "Expression"); };
base$1.TryStatement = function (node, st, c) {
  c(node.block, st, "Statement");
  if (node.handler) { c(node.handler, st); }
  if (node.finalizer) { c(node.finalizer, st, "Statement"); }
};
base$1.CatchClause = function (node, st, c) {
  if (node.param) { c(node.param, st, "Pattern"); }
  c(node.body, st, "Statement");
};
base$1.WhileStatement = base$1.DoWhileStatement = function (node, st, c) {
  c(node.test, st, "Expression");
  c(node.body, st, "Statement");
};
base$1.ForStatement = function (node, st, c) {
  if (node.init) { c(node.init, st, "ForInit"); }
  if (node.test) { c(node.test, st, "Expression"); }
  if (node.update) { c(node.update, st, "Expression"); }
  c(node.body, st, "Statement");
};
base$1.ForInStatement = base$1.ForOfStatement = function (node, st, c) {
  c(node.left, st, "ForInit");
  c(node.right, st, "Expression");
  c(node.body, st, "Statement");
};
base$1.ForInit = function (node, st, c) {
  if (node.type === "VariableDeclaration") { c(node, st); }
  else { c(node, st, "Expression"); }
};
base$1.DebuggerStatement = ignore;

base$1.FunctionDeclaration = function (node, st, c) { return c(node, st, "Function"); };
base$1.VariableDeclaration = function (node, st, c) {
  for (var i = 0, list = node.declarations; i < list.length; i += 1)
    {
    var decl = list[i];

    c(decl, st);
  }
};
base$1.VariableDeclarator = function (node, st, c) {
  c(node.id, st, "Pattern");
  if (node.init) { c(node.init, st, "Expression"); }
};

base$1.Function = function (node, st, c) {
  if (node.id) { c(node.id, st, "Pattern"); }
  for (var i = 0, list = node.params; i < list.length; i += 1)
    {
    var param = list[i];

    c(param, st, "Pattern");
  }
  c(node.body, st, node.expression ? "Expression" : "Statement");
};

base$1.Pattern = function (node, st, c) {
  if (node.type === "Identifier")
    { c(node, st, "VariablePattern"); }
  else if (node.type === "MemberExpression")
    { c(node, st, "MemberPattern"); }
  else
    { c(node, st); }
};
base$1.VariablePattern = ignore;
base$1.MemberPattern = skipThrough;
base$1.RestElement = function (node, st, c) { return c(node.argument, st, "Pattern"); };
base$1.ArrayPattern = function (node, st, c) {
  for (var i = 0, list = node.elements; i < list.length; i += 1) {
    var elt = list[i];

    if (elt) { c(elt, st, "Pattern"); }
  }
};
base$1.ObjectPattern = function (node, 