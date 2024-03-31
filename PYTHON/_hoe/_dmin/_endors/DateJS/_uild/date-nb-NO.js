h.get(\"arguments.0\") as NodePath<t.ThisExpression>,\n        );\n      } else if (isAssignment) {\n        // Replace not only the super.prop, but the whole assignment\n        superParentPath.replaceWith(call);\n      } else if (isTaggedTemplate) {\n        superProp.replaceWith(\n          callExpression(memberExpression(call, identifier(\"bind\"), false), [\n            thisExpression(),\n          ]),\n        );\n\n        thisPaths.push(\n          superProp.get(\"arguments.0\") as NodePath<t.ThisExpression>,\n        );\n      } else {\n        superProp.replaceWith(call);\n      }\n    });\n  }\n\n  // Convert all \"this\" references in the arrow to point at the alias.\n  let thisBinding: string | null;\n  if (thisPaths.length > 0 || !noNewArrows) {\n    thisBinding = getThisBinding(thisEnvFn, inConstructor);\n\n    if (\n      noNewArrows ||\n      // In subclass constructors, still need to rewrite because \"this\" can't be bound in spec mode\n      // because it might not have been initialized yet.\n      (inConstructor && hasSuperClass(thisEnvFn))\n    ) {\n      thisPaths.forEach(thisChild => {\n        const thisRef = thisChild.isJSX()\n          ? jsxIdentifier(thisBinding)\n          : identifier(thisBinding);\n\n        thisRef.loc = thisChild.node.loc;\n        thisChild.replaceWith(thisRef);\n      });\n\n      if (!noNewArrows) thisBinding = null;\n    }\n  }\n\n  return { thisBinding, fnPath };\n}\n\ntype LogicalOp = Parameters<typeof logicalExpression>[0];\ntype BinaryOp = Parameters<typeof binaryExpression>[0];\n\nfunction isLogicalOp(op: string): op is LogicalOp {\n  return LOGICAL_OPERATORS.includes(op);\n}\n\nfunction standardizeSuperProperty(\n  superProp: NodePath<t.MemberExpression>,\n):\n  | [NodePath<t.MemberExpression>]\n  | [NodePath<t.MemberExpression>, NodePath<t.MemberExpression>] {\n  if (\n    superProp.parentPath.isAssignmentExpression() &&\n    superProp.parentPath.node.operator !== \"=\"\n  ) {\n    const assignmentPath = superProp.parentPath;\n\n    const op = assignmentPath.node.operator.slice(0, -1) as\n      | LogicalOp\n      | BinaryOp;\n\n    const value = assignmentPath.node.right;\n\n    const isLogicalAssignment = isLogicalOp(op);\n\n    if (superProp.node.computed) {\n      // from: super[foo] **= 4;\n      // to:   super[tmp = foo] = super[tmp] ** 4;\n\n      // from: super[foo] ??= 4;\n      // to:   super[tmp = foo] ?? super[tmp] = 4;\n\n      const tmp = superProp.scope.generateDeclaredUidIdentifier(\"tmp\");\n\n      const object = superProp.node.object;\n      const property = superProp.node.property as t.Expression;\n\n      assignmentPath\n        .get(\"left\")\n        .replaceWith(\n          memberExpression(\n            object,\n            assignmentExpression(\"=\", tmp, property),\n            true /* computed */,\n          ),\n        );\n\n      assignmentPath\n        .get(\"right\")\n        .replaceWith(\n          rightExpression(\n            isLogicalAssignment ? \"=\" : op,\n            memberExpression(object, identifier(tmp.name), true /* computed */),\n            value,\n          ),\n        );\n    } else {\n      // from: super.foo **= 4;\n      // to:   super.foo = super.foo ** 4;\n\n      // from: super.foo ??= 4;\n      // to:   super.foo ?? super.foo = 4;\n\n      const object = superProp.node.object;\n      const property = superProp.node.property as t.Identifier;\n\n      assignmentPath\n        .get(\"left\")\n        .replaceWith(memberExpression(object, property));\n\n      assignmentPath\n        .get(\"right\")\n        .replaceWith(\n          rightExpression(\n            isLogicalAssignment ? \"=\" : op,\n            memberExpression(object, identifier(property.name)),\n            value,\n          ),\n        );\n    }\n\n    if (isLogicalAssignment) {\n      assignmentPath.replaceWith(\n        logicalExpression(\n          op,\n          assignmentPath.node.left as t.MemberExpression,\n          assignmentPath.node.right,\n        ),\n      );\n    } else {\n      assignmentPath.node.operator = \"=\";\n    }\n\n    return [\n      assignmentPath.get(\"left\") as NodePath<t.MemberExpression>,\n      assignmentPath.get(\"right\").get(\"left\"),\n    ];\n  } else if (superProp.parentPath.isUpdateExpression()) {\n    const updateExpr = superProp.parentPath;\n\n    const tmp = superProp.scope.generateDeclaredUidIdentifier(\"tmp\");\n    const computedKey = superProp.node.computed\n      ? superProp.scope.generateDeclaredUidIdentifier(\"prop\")\n      : null;\n\n    const parts: t.Expression[] = [\n      assignmentExpression(\n        \"=\",\n        tmp,\n        memberExpression(\n          superProp.node.object,\n          computedKey\n            ? assignmentExpression(\n                \"=\",\n                computedKey,\n                superProp.node.property as t.Expression,\n              )\n            : superProp.node.property,\n          superProp.node.computed,\n        ),\n      ),\n      assignmentExpression(\n        \"=\",\n        memberExpression(\n          superProp.node.object,\n          computedKey ? identifier(computedKey.name) : superProp.node.property,\n          superProp.node.computed,\n        ),\n        binaryExpression(\n          // map `++` to `+`, and `--` to `-`\n          superProp.parentPath.node.operator[0] as \"+\" | \"-\",\n          identifier(tmp.name),\n          numericLiteral(1),\n        ),\n      ),\n    ];\n\n    if (!superProp.parentPath.node.prefix) {\n      parts.push(identifier(tmp.name));\n    }\n\n    updateExpr.replaceWith(sequenceExpression(parts));\n\n    const left = updateExpr.get(\n      \"expressions.0.right\",\n    ) as NodePath<t.MemberExpression>;\n    const right = updateExpr.get(\n      \"expressions.1.left\",\n    ) as NodePath<t.MemberExpression>;\n    return [left, right];\n  }\n\n  return [superProp];\n\n  function rightExpression(\n    op: BinaryOp | \"=\",\n    left: t.MemberExpression,\n    right: t.Expression,\n  ) {\n    if (op === \"=\") {\n      return assignmentExpression(\"=\", left, right);\n    } else {\n      return binaryExpression(op, left, right);\n    }\n  }\n}\n\nfunction hasSuperClass(thisEnvFn: NodePath<t.Function>) {\n  return (\n    thisEnvFn.isClassMethod() &&\n    !!(thisEnvFn.parentPath.parentPath.node as t.Class).superClass\n  );\n}\n\nconst assignSuperThisVisitor = mergeVisitors<{\n  supers: WeakSet<t.CallExpression>;\n  thisBinding: string;\n}>([\n  {\n    CallExpression(child, { supers, thisBinding }) {\n      if (!child.get(\"callee\").isSuper()) return;\n      if (supers.has(child.node)) return;\n      supers.add(child.node);\n\n      child.replaceWithMultiple([\n        child.node,\n        assignmentExpression(\"=\", identifier(thisBinding), identifier(\"this\")),\n      ]);\n    },\n  },\n  environmentVisitor,\n]);\n\n// Create a binding that evaluates to the \"this\" of the given function.\nfunction getThisBinding(\n  thisEnvFn: NodePath<t.Function>,\n  inConstructor: boolean,\n) {\n  return getBinding(thisEnvFn, \"this\", thisBinding => {\n    if (!inConstructor || !hasSuperClass(thisEnvFn)) return thisExpression();\n\n    thisEnvFn.traverse(assignSuperThisVisitor, {\n      supers: new WeakSet(),\n      thisBinding,\n    });\n  });\n}\n\n// Create a binding for a function that will call \"super()\" with arguments passed through.\nfunction getSuperBinding(thisEnvFn: NodePath<t.Function>) {\n  return getBinding(thisEnvFn, \"supercall\", () => {\n    const argsBinding = thisEnvFn.scope.generateUidIdentifier(\"args\");\n    return arrowFunctionExpression(\n      [restElement(argsBinding)],\n      callExpression(_super(), [spreadElement(identifier(argsBinding.name))]),\n    );\n  });\n}\n\n// Create a binding for a function that will call \"super.foo\" or \"super[foo]\".\nfunction getSuperPropBinding(\n  thisEnvFn: NodePath<t.Function>,\n  isAssignment: boolean,\n  propName: string,\n) {\n  const op = isAssignment ? \"set\" : \"get\";\n\n  return getBinding(thisEnvFn, `superprop_${op}:${propName || \"\"}`, () => {\n    const argsList = [];\n\n    let fnBody;\n    if (propName) {\n      // () => super.foo\n      fnBody = memberExpression(_super(), identifier(propName));\n    } else {\n      const method = thisEnvFn.scope.generateUidIdentifier(\"prop\");\n      // (method) => super[method]\n      argsList.unshift(method);\n      fnBody = memberExpression(\n        _super(),\n        identifier(method.name),\n        true /* computed */,\n      );\n    }\n\n    if (isAssignment) {\n      const valueIdent = thisEnvFn.scope.generateUidIdentifier(\"value\");\n      argsList.push(valueIdent);\n\n      fnBody = assignmentExpression(\"=\", fnBody, identifier(valueIdent.name));\n    }\n\n    return arrowFunctionExpression(argsList, fnBody);\n  });\n}\n\nfunction getBinding(\n  thisEnvFn: NodePath,\n  key: string,\n  init: (name: string) => t.Expression,\n) {\n  const cacheKey = \"binding:\" + key;\n  let data: string | undefined = thisEnvFn.getData(cacheKey);\n  if (!data) {\n    const id = thisEnvFn.scope.generateUidIdentifier(key);\n    data = id.name;\n    thisEnvFn.setData(cacheKey, data);\n\n    thisEnvFn.scope.push({\n      id: id,\n      init: init(data),\n    });\n  }\n\n  return data;\n}\n\ntype ScopeInfo = {\n  thisPaths: NodePath<t.ThisExpression | t.JSXIdentifier>[];\n  superCalls: NodePath<t.CallExpression>[];\n  superProps: NodePath<t.MemberExpression>[];\n  argumentsPaths: NodePath<t.Identifier | t.JSXIdentifier>[];\n  newTargetPaths: NodePath<t.MetaProperty>[];\n};\n\nconst getScopeInformationVisitor = mergeVisitors<ScopeInfo>([\n  {\n    ThisExpression(child, { thisPaths }) {\n      thisPaths.push(child);\n    },\n    JSXIdentifier(child, { thisPaths }) {\n      if (child.node.name !== \"this\") return;\n      if (\n        !child.parentPath.isJSXMemberExpression({ object: child.node }) &&\n        !child.parentPath.isJSXOpeningElement({ name: child.node })\n      ) {\n        return;\n      }\n\n      thisPaths.push(child);\n    },\n    CallExpression(child, { superCalls }) {\n      if (child.get(\"callee\").isSuper()) superCalls.push(child);\n    },\n    MemberExpression(child, { superProps }) {\n      if (child.get(\"object\").isSuper()) superProps.push(child);\n    },\n    Identifier(child, { argumentsPaths }) {\n      if (!child.isReferencedIdentifier({ name: \"arguments\" })) return;\n\n      let curr = child.scope;\n      do {\n        if (curr.hasOwnBinding(\"arguments\")) {\n          curr.rename(\"arguments\");\n          return;\n        }\n        if (curr.path.isFunction() && !curr.path.isArrowFunctionExpression()) {\n          break;\n        }\n      } while ((curr = curr.parent));\n\n      argumentsPaths.push(child);\n    },\n    MetaProperty(child, { newTargetPaths }) {\n      if (!child.get(\"meta\").isIdentifier({ name: \"new\" })) return;\n      if (!child.get(\"property\").isIdentifier({ name: \"target\" })) return;\n\n      newTargetPaths.push(child);\n    },\n  },\n  environmentVisitor,\n]);\n\nfunction getScopeInformation(fnPath: NodePath) {\n  const thisPaths: ScopeInfo[\"thisPaths\"] = [];\n  const argumentsPaths: ScopeInfo[\"argumentsPaths\"] = [];\n  const newTargetPaths: ScopeInfo[\"newTargetPaths\"] = [];\n  const superProps: ScopeInfo[\"superProps\"] = [];\n  const superCalls: ScopeInfo[\"superCalls\"] = [];\n\n  fnPath.traverse(getScopeInformationVisitor, {\n    thisPaths,\n    argumentsPaths,\n    newTargetPaths,\n    superProps,\n    superCalls,\n  });\n\n  return {\n    thisPaths,\n    argumentsPaths,\n    newTargetPaths,\n    superProps,\n    superCalls,\n  };\n}\n"],"mappings":";;;;;;;;;AAEA,IAAAA,EAAA,GAAAC,OAAA;AA4BA,IAAAC,yBAAA,GAAAD,OAAA;AACA,IAAAE,mBAAA,GAAAF,OAAA;AACA,IAAAG,SAAA,GAAAH,OAAA;AAAwD;EA7BtDI,uBAAuB;EACvBC,oBAAoB;EACpBC,gBAAgB;EAChBC,cAAc;EACdC,cAAc;EACdC,qBAAqB;EACrBC,mBAAmB;EACnBC,UAAU;EACVC,YAAY;EACZC,aAAa;EACbC,iBAAiB;EACjBC,iBAAiB;EACjBC,gBAAgB;EAChBC,YAAY;EACZC,cAAc;EACdC,gBAAgB;EAChBC,WAAW;EACXC,eAAe;EACfC,kBAAkB;EAClBC,aAAa;EACbC,aAAa;EACbC,KAAK,EAAIC,MAAM;EACfC,cAAc;EACdC,YAAY;EACZC;AAAe,IAAA9B,EAAA;AAQV,SAAS+B,aAAaA,CAAA,EAAiB;EAC5C,IAAIC,GAAG;EACP,IAAI,IAAI,CAACC,kBAAkB,CAAC,CAAC,EAAE;IAC7BD,GAAG,GAAG,IAAI,CAACE,IAAI,CAACC,QAAQ;EAC1B,CAAC,MAAM,IAAI,IAAI,CAACC,UAAU,CAAC,CAAC,IAAI,IAAI,CAACC,QAAQ,CAAC,CAAC,EAAE;IAC/CL,GAAG,GAAG,IAAI,CAACE,IAAI,CAACF,GAAG;EACrB,CAAC,MAAM;IACL,MAAM,IAAIM,cAAc,CAAC,MAAM,CAAC;EAClC;EAGA,IAAI,CAAC,IAAI,CAACJ,IAAI,CAACK,QAAQ,EAAE;IACvB,IAAI1B,YAAY,CAACmB,GAAG,CAAC,EAAEA,GAAG,GAAGP,aAAa,CAACO,GAAG,CAACQ,IAAI,CAAC;EACtD;EAEA,OAAOR,GAAG;AACZ;AAEO,SAASS,WAAWA,CAAA,EAIzB;EACA,MAAMC,IAAI,GAAG,IAAI,CAACC,GAAG,CAAC,MAAM,CAAC;EAC7B,MAAMC,QAAQ,GAAGF,IAAI,CAACR,IAAI;EAE1B,IAAIW,KAAK,CAACC,OAAO,CAACJ,IAAI,CAAC,EAAE;IACvB,MAAM,IAAIK,KAAK,CAAC,+CAA+C,CAAC;EAClE;EACA,IAAI,CAACH,QAAQ,EAAE;IACb,MAAM,IAAIG,KAAK,CAAC,mCAAmC,CAAC;EACtD;EAEA,IAAIL,IAAI,CAACM,gBAAgB,CAAC,CAAC,EAAE;IAC3B,OAAOJ,QAAQ;EACjB;EAEA,MAAMK,UAA8B,GAAG,EAAE;EAEzC,IAAIC,UAAU,GAAG,MAAM;EACvB,IAAIlB,GAAG;EACP,IAAImB,OAAO;EACX,IAAIT,IAAI,CAACU,WAAW,CAAC,CAAC,EAAE;IACtBD,OAAO,GAAG,MAAM;IAChBnB,GAAG,GAAG,CAAC;IACPiB,UAAU,CAACI,IAAI,CAACX,IAAI,CAACR,IAAI,CAAC;EAC5B,CAAC,MAAM;IACLgB,UAAU,IAAI,SAAS;IACvB,IAAI,IAAI,CAACI,UAAU,CAAC,CAAC,EAAE;MACrBtB,GAAG,GAAG,UAAU;MAChBiB,UAAU,CAACI,IAAI,CAAC/B,eAAe,CAACoB,IAAI,CAACR,IAAoB,CAAC,CAAC;IAC7D,CAAC,MAAM;MACLF,GAAG,GAAG,YAAY;MAClBiB,UAAU,CAACI,IAAI,CAAC1C,mBAAmB,CAAC+B,IAAI,CAACR,IAAoB,CAAC,CAAC;IACjE;EACF;EAEA,IAAI,CAACA,IAAI,CAACQ,IAAI,GAAGlC,cAAc,CAACyC,UAAU,CAAC;EAC3C,MAAMM,UAAU,GAAG,IAAI,CAACZ,GAAG,CAACO,UAAU,CAAa;EACnDR,IAAI,CAACc,KAAK,CACRD,UAAU,EACVJ,OAAO,GAEHI,UAAU,CAACrB,IAAI,CAACiB,OAAO,CAAC,GACxBI,UAAU,CAACrB,IAAI,EACnBiB,OAAO,EACPnB,GACF,CAAC;EAED,OAAO,IAAI,CAACE,IAAI;AAClB;AAE+C;EAK7CuB,OAAO,CAACC,uBAAuB,GAAG,YAA0B;IAC1D,IAAI,CAAC,IAAI,CAACC,yBAAyB,CAAC,CAAC,EAAE;IAEvC,IAAI,CAACC,yBAAyB,CAAC,CAAC;EAClC,CAAC;AACH;AAQO,SAASC,yBAAyBA,CAAA,EAAiB;EACxD,IACE,CAAC,IAAI,CAACF,yBAAyB,CAAC,CAAC,IACjC,CAAC,IAAI,CAACG,oBAAoB,CAAC,CAAC,IAC5B,CAAC,IAAI,CAACC,qBAAqB,CAAC,CAAC,EAC7B;IACA,MAAM,IAAI,CAACC,mBAAmB,CAC5B,gDACF,CAAC;EACH;EAEAC,wBAAwB,CAAC,IAAI,CAAC;AAChC;AAEA,SAASC,OAAOA,CACdC,IAAiB,EACjBC,IAAO,EAC4C;EACnDD,IAAI,CAACjC,IAAI,CAACkC,IAAI,GAAGA,IAAI;AACvB;AAKO,SAASR,yBAAyBA,CAEvC;EACES,gBAAgB,GAAG,IAAI;EACvBC,wBAAwB,GAAGD,gBAAgB;EAC3CE,WAAW,GAGP,EAAAC,WAAA,KAAAA,WAAA,GAACC,SAAS,CAAC,CAAC,CAAC,qBAAZD,WAAA,CAAcE,aAAa;AAKlC,CAAC,GAAG,CAAC,CAAC,EAGN;EACA,IAAI,CAAC,IAAI,CAACf,yBAAyB,CAAC,CAAC,EAAE;IACrC,MAAO,IAAI,CAAcK,mBAAmB,CAC1C,6DACF,CAAC;EACH;EAEA,MAAM;IAAEW,WAAW;IAAEC,MAAM,EAAEC;EAAG,CAAC,GAAGZ,wBAAwB,CAC1D,IAAI,EACJM,WAAW,EACXF,gBAAgB,EAChBC,wBACF,CAAC;EAGDO,EAAE,CAACpC,WAAW,CAAC,CAAC;EAChByB,OAAO,CAACW,EAAE,EAAE,oBAAoB,CAAC;EAEjC,IAAI,CAACN,WAAW,EAAE;IAChB,MAAMO,YAAY,GAAGH,WAAW,GAC5B,IAAI,GACJE,EAAE,CAACE,KAAK,CAACC,qBAAqB,CAAC,cAAc,CAAC;IAClD,IAAIF,YAAY,EAAE;MAChBD,EAAE,CAACtB,UAAU,CAACwB,KAAK,CAAC1B,IAAI,CAAC;QACvB4B,EAAE,EAAEH,YAAY;QAChBI,IAAI,EAAE9D,gBAAgB,CAAC,EAAE;MAC3B,CAAC,CAAC;IACJ;IAEAyD,EAAE,CAAClC,GAAG,CAAC,MAAM,CAAC,CAACwC,gBAAgB,CAC7B,MAAM,EACNxE,mBAAmB,CACjBF,cAAc,CAAC,IAAI,CAAC2E,GAAG,CAACC,SAAS,CAAC,eAAe,CAAC,EAAE,CAClDzD,cAAc,CAAC,CAAC,EAChBkD,YAAY,GACRlE,UAAU,CAACkE,YAAY,CAACtC,IAAI,CAAC,GAC7B5B,UAAU,CAAC+D,WAAW,CAAC,CAC5B,CACH,CACF,CAAC;IAEDE,EAAE,CAACS,WAAW,CACZ7E,cAAc,CACZQ,gBAAgB,CAEd,IAAAsE,2BAAY,EAAC,IAAI,EAAE,IAAI,CAAC,IAAIV,EAAE,CAAC3C,IAAI,EACnCtB,UAAU,CAAC,MAAM,CACnB,CAAC,EACD,CAACkE,YAAY,GAAGlE,UAAU,CAACkE,YAAY,CAACtC,IAAI,CAAC,GAAGZ,cAAc,CAAC,CAAC,CAClE,CACF,CAAC;IAED,OAAOiD,EAAE,CAAClC,GAAG,CAAC,eAAe,CAAC;EAChC;EAEA,OAAOkC,EAAE;AACX;AAEA,MAAMW,oBAAoB,GAAG,IAAAC,eAAa,EAEvC,CACD;EACEC,cAAcA,CAACC,KAAK,EAAE;IAAEC;EAAc,CAAC,EAAE;IACvC,IAAI,CAACD,KAAK,CAAChD,GAAG,CAAC,QAAQ,CAAC,CAACkD,OAAO,CAAC,CAAC,EAAE;IACpCD,aAAa,CAACvC,IAAI,CAACsC,KAAK,CAAC;EAC3B;AACF,CAAC,EACDG,iCAAkB,CACnB,CAAC;AAUF,SAAS7B,wBAAwBA,CAC/BW,MAA4B,EAE5BL,WAA2B,GAAG,IAAI,EAClCF,gBAAgC,GAAG,IAAI,EACvCC,wBAAwC,GAAG,IAAI,EACQ;EACvD,IAAIyB,WAAW;EACf,IAAIC,SAA+B,GAAGpB,MAAM,CAACqB,UAAU,CAACC,CAAC,IAAI;IAC3D,IAAIA,CAAC,CAACvC,yBAAyB,CAAC,CAAC,EAAE;MAAA,IAAAwC,YAAA;MACjC,CAAAA,YAAA,GAAAJ,WAAW,YAAAI,YAAA,GAAXJ,WAAW,GAAKG,CAAC;MACjB,OAAO,KAAK;IACd;IACA,OACEA,CAAC,CAAC5C,UAAU,CAAC,CAAC,IACd4C,CAAC,CAACE,SAAS,CAAC,CAAC,IACbF,CAAC,CAACG,eAAe,CAAC;MAAEC,MAAM,EAAE;IAAM,CAAC,CAAC,IACpCJ,CAAC,CAACK,sBAAsB,CAAC;MAAED,MAAM,EAAE;IAAM,CAAC,CAAC;EAE/C,CAAC,CAAyB;EAC1B,MAAME,aAAa,GAAGR,SAAS,CAACS,aAAa,CAAC;I"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const {
  stringHints,
  numberHints
} = require("./util/hints");
/** @typedef {import("json-schema").JSONSchema6} JSONSchema6 */

/** @typedef {import("json-schema").JSONSchema7} JSONSchema7 */

/** @typedef {import("./validate").Schema} Schema */

/** @typedef {import("./validate").ValidationErrorConfiguration} ValidationErrorConfiguration */

/** @typedef {import("./validate").PostFormatter} PostFormatter */

/** @typedef {import("./validate").SchemaUtilErrorObject} SchemaUtilErrorObject */

/** @enum {number} */


const SPECIFICITY = {
  type: 1,
  not: 1,
  oneOf: 1,
  anyOf: 1,
  if: 1,
  enum: 1,
  const: 1,
  instanceof: 1,
  required: 2,
  pattern: 2,
  patternRequired: 2,
  format: 2,
  formatMinimum: 2,
  formatMaximum: 2,
  minimum: 2,
  exclusiveMinimum: 2,
  maximum: 2,
  exclusiveMaximum: 2,
  multipleOf: 2,
  uniqueItems: 2,
  contains: 2,
  minLength: 2,
  maxLength: 2,
  minItems: 2,
  maxItems: 2,
  minProperties: 2,
  maxProperties: 2,
  dependencies: 2,
  propertyNames: 2,
  additionalItems: 2,
  additionalProperties: 2,
  absolutePath: 2
};
/**
 *
 * @param {Array<SchemaUtilErrorObject>} array
 * @param {(item: SchemaUtilErrorObject) => number} fn
 * @returns {Array<SchemaUtilErrorObject>}
 */

function filterMax(array, fn) {
  const evaluatedMax = array.reduce((max, item) => Math.max(max, fn(item)), 0);
  return array.filter(item => fn(item) === evaluatedMax);
}
/**
 *
 * @param {Array<SchemaUtilErrorObject>} children
 * @returns {Array<SchemaUtilErrorObject>}
 */


function filterChildren(children) {
  let newChildren = children;
  newChildren = filterMax(newChildren,
  /**
   *
   * @param {SchemaUtilErrorObject} error
   * @returns {number}
   */
  error => error.dataPath ? error.dataPath.length : 0);
  newChildren = filterMax(newChildren,
  /**
   * @param {SchemaUtilErrorObject} error
   * @returns {number}
   */
  error => SPECIFICITY[
  /** @type {keyof typeof SPECIFICITY} */
  error.keyword] || 2);
  return newChildren;
}
/**
 * Find all children errors
 * @param {Array<SchemaUtilErrorObject>} children
 * @param {Array<string>} schemaPaths
 * @return {number} returns index of first child
 */


function findAllChildren(children, schemaPaths) {
  let i = children.length - 1;

  const predicate =
  /**
   * @param {string} schemaPath
   * @returns {boolean}
   */
  schemaPath => children[i].schemaPath.indexOf(schemaPath) !== 0;

  while (i > -1 && !schemaPaths.every(predicate)) {
    if (children[i].keyword === "anyOf" || children[i].keyword === "oneOf") {
      const refs = extractRefs(children[i]);
      const childrenStart = findAllChildren(children.slice(0, i), refs.concat(children[i].schemaPath));
      i = childrenStart - 1;
    } else {
      i -= 1;
    }
  }

  return i + 1;
}
/**
 * Extracts all refs from schema
 * @param {SchemaUtilErrorObject} error
 * @return {Array<string>}
 */


function extractRefs(error) {
  const {
    schema
  } = error;

  if (!Array.isArray(schema)) {
    return [];
  }

  return schema.map(({
    $ref
  }) => $ref).filter(s => s);
}
/**
 * Groups children by their first level parent (assuming that error is root)
 * @param {Array<SchemaUtilErrorObject>} children
 * @return {Array<SchemaUtilErrorObject>}
 */


function groupChildrenByFirstChild(children) {
  const result = [];
  let i = children.length - 1;

  while (i > 0) {
    const child = children[i];

    if (child.keyword === "anyOf" || child.keyword === "oneOf") {
      const refs = extractRefs(child);
      const childrenStart = findAllChildren(children.slice(0, i), refs.concat(child.schemaPath));

      if (childrenStart !== i) {
        result.push(Object.assign({}, child, {
          children: children.slice(childrenStart, i)
        }));
        i = childrenStart;
      } else {
        result.push(child);
      }
    } else {
      result.push(child);
    }

    i -= 1;
  }

  if (i === 0) {
    result.push(children[i]);
  }

  return result.reverse();
}
/**
 * @param {string} str
 * @param {string} prefix
 * @returns {string}
 */


function indent(str, prefix) {
  return str.replace(/\n(?!$)/g, `\n${prefix}`);
}
/**
 * @param {Schema} schema
 * @returns {schema is (Schema & {not: Schema})}
 */


function hasNotInSchema(schema) {
  return !!schema.not;
}
/**
 * @param {Schema} schema
 * @return {Schema}
 */


function findFirstTypedSchema(schema) {
  if (hasNotInSchema(schema)) {
    return findFirstTypedSchema(schema.not);
  }

  return schema;
}
/**
 * @param {Schema} schema
 * @return {boolean}
 */


function canApplyNot(schema) {
  const typedSchema = findFirstTypedSchema(schema);
  return likeNumber(typedSchema) || likeInteger(typedSchema) || likeString(typedSchema) || likeNull(typedSchema) || likeBoolean(typedSchema);
}
/**
 * @param {any} maybeObj
 * @returns {boolean}
 */


function isObject(maybeObj) {
  return typeof maybeObj === "object" && maybeObj !== null;
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeNumber(schema) {
  return schema.type === "number" || typeof schema.minimum !== "undefined" || typeof schema.exclusiveMinimum !== "undefined" || typeof schema.maximum !== "undefined" || typeof schema.exclusiveMaximum !== "undefined" || typeof schema.multipleOf !== "undefined";
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeInteger(schema) {
  return schema.type === "integer" || typeof schema.minimum !== "undefined" || typeof schema.exclusiveMinimum !== "undefined" || typeof schema.maximum !== "undefined" || typeof schema.exclusiveMaximum !== "undefined" || typeof schema.multipleOf !== "undefined";
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeString(schema) {
  return schema.type === "string" || typeof schema.minLength !== "undefined" || typeof schema.maxLength !== "undefined" || typeof schema.pattern !== "undefined" || typeof schema.format !== "undefined" || typeof schema.formatMinimum !== "undefined" || typeof schema.formatMaximum !== "undefined";
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeBoolean(schema) {
  return schema.type === "boolean";
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeArray(schema) {
  return schema.type === "array" || typeof schema.minItems === "number" || typeof schema.maxItems === "number" || typeof schema.uniqueItems !== "undefined" || typeof schema.items !== "undefined" || typeof schema.additionalItems !== "undefined" || typeof schema.contains !== "undefined";
}
/**
 * @param {Schema & {patternRequired?: Array<string>}} schema
 * @returns {boolean}
 */


function likeObject(schema) {
  return schema.type === "object" || typeof schema.minProperties !== "undefined" || typeof schema.maxProperties !== "undefined" || typeof schema.required !== "undefined" || typeof schema.properties !== "undefined" || typeof schema.patternProperties !== "undefined" || typeof schema.additionalProperties !== "undefined" || typeof schema.dependencies !== "undefined" || typeof schema.propertyNames !== "undefined" || typeof schema.patternRequired !== "undefined";
}
/**
 * @param {Schema} schema
 * @returns {boolean}
 */


function likeNull(schema) {
  return schema.type === "null";
}
/**
 * @param {string} type
 * @returns {string}
 */


function getArticle(type) {
  if (/^[aeiou]/i.test(type)) {
    return "an";
  }

  return "a";
}
/**
 * @param {Schema=} schema
 * @returns {string}
 */


function getSchemaNonTypes(schema) {
  if (!schema) {
    return "";
  }

  if (!schema.type) {
    if (likeNumber(schema) || likeInteger(schema)) {
      return " | should be any non-number";
    }

    if (likeString(schema)) {
      return " | should be any non-string";
    }

    if (likeArray(schema)) {
      return " | should be any non-array";
    }

    if (likeObject(schema)) {
      return " | should be any non-object";
    }
  }

  return "";
}
/**
 * @param {Array<string>} hints
 * @returns {string}
 */


function formatHints(hints) {
  return hints.length > 0 ? `(${hints.join(", ")})` : "";
}
/**
 * @param {Schema} schema
 * @param {boolean} logic
 * @returns {string[]}
 */


function getHints(schema, logic) {
  if (likeNumber(schema) || likeInteger(schema)) {
    return numberHints(schema, logic);
  } else if (likeString(schema)) {
    return stringHints(schema, logic);
  }

  return [];
}

class ValidationError extends Error {
  /**
   * @param {Array<SchemaUtilErrorObject>} errors
   * @param {Schema} schema
   * @param {ValidationErrorConfiguration} configuration
   */
  constructor(errors, schema, configuration = {}) {
    super();
    /** @type {string} */

    this.name = "ValidationError";
    /** @type {Array<SchemaUtilErrorObject>} */

    this.errors = errors;
    /** @type {Schema} */

    this.schema = schema;
    let headerNameFromSchema;
    let baseDataPathFromSchema;

    if (schema.title && (!configuration.name || !configuration.baseDataPath)) {
      const splittedTitleFromSchema = schema.title.match(/^(.+) (.+)$/);

      if (splittedTitleFromSchema) {
        if (!configuration.name) {
          [, headerNameFromSchema] = splittedTitleFromSchema;
        }

        if (!configuration.baseDataPath) {
          [,, baseDataPathFromSchema] = splittedTitleFromSchema;
        }
      }
    }
    /** @type {string} */


    this.headerName = configuration.name || headerNameFromSchema || "Object";
    /** @type {string} */

    this.baseDataPath = configuration.baseDataPath || baseDataPathFromSchema || "configuration";
    /** @type {PostFormatter | null} */

    this.postFormatter = configuration.postFormatter || null;
    const header = `Invalid ${this.baseDataPath} object. ${this.headerName} has been initialized using ${getArticle(this.baseDataPath)} ${this.baseDataPath} object that does not match the API schema.\n`;
    /** @type {string} */

    this.message = `${header}${this.formatValidationErrors(errors)}`;
    Error.captureStackTrace(this, this.constructor);
  }
  /**
   * @param {string} path
   * @returns {Schema}
   */


  getSchemaPart(path) {
    const newPath = path.split("/");
    let schemaPart = this.schema;

    for (let i = 1; i < newPath.length; i++) {
      const inner = schemaPart[
      /** @type {keyof Schema} */
      newPath[i]];

      if (!inner) {
        break;
      }

      schemaPart = inner;
    }

    return schemaPart;
  }
  /**
   * @param {Schema} schema
   * @param {boolean} logic
   * @param {Array<Object>} prevSchemas
   * @returns {string}
   */


  formatSchema(schema, logic = true, prevSchemas = []) {
    let newLogic = logic;

    const formatInnerSchema =
    /**
     *
     * @param {Object} innerSchema
     * @param {boolean=} addSelf
     * @returns {string}
     */
    (innerSchema, addSelf) => {
      if (!addSelf) {
        return this.formatSchema(innerSchema, newLogic, prevSchemas);
      }

      if (prevSchemas.includes(innerSchema)) {
        return "(recursive)";
      }

      return this.formatSchema(innerSchema, newLogic, prevSchemas.concat(schema));
    };

    if (hasNotInSchema(schema) && !likeObject(schema)) {
      if (canApplyNot(schema.not)) {
        newLogic = !logic;
        return formatInnerSchema(schema.not);
      }

      const needApplyLogicHere = !schema.not.not;
      const prefix = logic ? "" : "non ";
      newLogic = !logic;
      return needApplyLogicHere ? prefix + formatInnerSchema(schema.not) : formatInnerSchema(schema.not);
    }

    if (
    /** @type {Schema & {instanceof: string | Array<string>}} */
    schema.instanceof) {
      const {
        instanceof: value
      } =
      /** @type {Schema & {instanceof: string | Array<string>}} */
      schema;
      const values = !Array.isArray(value) ? [value] : value;
      return values.map(
      /**
       * @param {string} item
       * @returns {string}
       */
      item => item === "Function" ? "function" : item).join(" | ");
    }

    if (schema.enum) {
      const enumValues =
      /** @type {Array<any>} */
      schema.enum.map(item => {
        if (item === null && schema.undefinedAsNull) {
          return `${JSON.stringify(item)} | undefined`;
        }

        return JSON.stringify(item);
      }).join(" | ");
      return `${enumValues}`;
    }

    if (typeof schema.const !== "undefined") {
      return JSON.stringify(schema.const);
    }

    if (schema.oneOf) {
      return (
        /** @type {Array<Schema>} */
        schema.oneOf.map(item => formatInnerSchema(item, true)).join(" | ")
      );
    }

    if (schema.anyOf) {
      return (
        /** @type {Array<Schema>} */
        schema.anyOf.map(item => formatInnerSchema(item, true)).join(" | ")
      );
    }

    if (schema.allOf) {
      return (
        /** @type {Array<Schema>} */
        schema.allOf.map(item => formatInnerSchema(item, true)).join(" & ")
      );
    }

    if (
    /** @type {JSONSchema7} */
    schema.if) {
      const {
        if: ifValue,
        then: thenValue,
        else: elseValue
      } =
      /** @type {JSONSchema7} */
      schema;
      return `${ifValue ? `if ${formatInnerSchema(ifValue)}` : ""}${thenValue ? ` then ${formatInnerSchema(thenValue)}` : ""}${elseValue ? ` else ${formatInnerSchema(elseValue)}` : ""}`;
    }

    if (schema.$ref) {
      return formatInnerSchema(this.getSchemaPart(schema.$ref), true);
    }

    if (likeNumber(schema) || likeInteger(schema)) {
      const [type, ...hints] = getHints(schema, logic);
      const str = `${type}${hints.length > 0 ? ` ${formatHints(hints)}` : ""}`;
      return logic ? str : hints.length > 0 ? `non-${type} | ${str}` : `non-${type}`;
    }

    if (likeString(schema)) {
      const [type, ...hints] = getHints(schema, logic);
      const str = `${type}${hints.length > 0 ? ` ${formatHints(hints)}` : ""}`;
      return logic ? str : str === "string" ? "non-string" : `non-string | ${str}`;
    }

    if (likeBoolean(schema)) {
      return `${logic ? "" : "non-"}boolean`;
    }

    if (likeArray(schema)) {
      // not logic already applied in formatValidationError
      newLogic = true;
      const hints = [];

      if (typeof schema.minItems === "number") {
        hints.push(`should not have fewer than ${schema.minItems} item${schema.minItems > 1 ? "s" : ""}`);
      }

      if (typeof schema.maxItems === "number") {
        hints.push(`should not have more than ${schema.maxItems} item${schema.maxItems > 1 ? "s" : ""}`);
      }

      if (schema.uniqueItems) {
        hints.push("should not have duplicate items");
      }

      const hasAdditionalItems = typeof schema.additionalItems === "undefined" || Boolean(schema.additionalItems);
      let items = "";

      if (schema.items) {
        if (Array.isArray(schema.items) && schema.items.length > 0) {
          items = `${
          /** @type {Array<Schema>} */
          schema.items.map(item => formatInnerSchema(item)).join(", ")}`;

          if (hasAdditionalItems) {
            if (schema.additionalItems && isObject(schema.additionalItems) && Object.keys(schema.additionalItems).length > 0) {
              hints.push(`additional items should be ${formatInnerSchema(schema.additionalItems)}`);
            }
          }
        } else if (schema.items && Object.keys(schema.items).length > 0) {
          // "additionalItems" is ignored
          items = `${formatInnerSchema(schema.items)}`;
        } else {
          // Fallback for empty `items` value
          items = "any";
        }
      } else {
        // "additionalItems" is ignored
        items = "any";
      }

      if (schema.contains && Object.keys(schema.contains).length > 0) {
        hints.push(`should contains at least one ${this.formatSchema(schema.contains)} item`);
      }

      return `[${items}${hasAdditionalItems ? ", ..." : ""}]${hints.length > 0 ? ` (${hints.join(", ")})` : ""}`;
    }

    if (likeObject(schema)) {
      // not logic already applied in formatValidationError
      newLogic = true;
      const hints = [];

      if (typeof schema.minProperties === "number") {
        hints.push(`should not have fewer than ${schema.minProperties} ${schema.minProperties > 1 ? "properties" : "property"}`);
      }

      if (typeof schema.maxProperties === "number") {
        hints.push(`should not have more than ${schema.maxProperties} ${sche<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/><circle cx="420.9" cy="296.5" r="45.7"/><path d="M520.5 78.1z"/></g></svg>                                                                                                                                                                                                                                                                                                                                                                                                                                                        (cK`�=��{4R?Xo�-3\t~��4pt��R�n6¾~Ƕ����Ǿ	*���]����o8\Š��o�E���Ηx��B�K�V>�O���Z�Y�{$�K�w��ÿ\κ�~;����zp�rz��	?r}�c�'��V��-���n�z1E��a��[��ωz��)Ķt���i܈�)�����/����Es�Sp%h�뛧
5��ތ�����:�����w3\Ӊ�U��`�%�r�7�t��f�ګ�I?�=CD�3/U����aAAԠ=���.�0J�`}���W����Ϙh�H;]u��,�#9����~;�Z�$v��W,�n�[�t�̴׿U[t�Q��bU�p����zi�����Bv8�j�_�mW���3S6*4D�����lX��f��
[��#���w�7����@�#<�}?�v,�qM4�!�nJ���=7��O�d\^b��x#<O�˔,�-_�iWu����} y̬�F�q��/���x����w4�&��5(����{�õ�U�H��s��W�mh ��Ļ��t|!�Yz���1�4��S��	q��d�(�Cq���˥�d�T%H���Q�����{�W�"����(�T�QC� ��B�������4/<^8�}��IzEH�_c��g?C@���!%�^K��8���2DFBg��<CU�Q�i����m@ajܘ�Y����8�����R����~��Qs@�Rg%�$��*AkYI���;J*HDo9��K]�4r��4�ȑ�s�aX5�������}k�a`���t<P�Y^���!ʲ_���gl�W�[;}
�+�K�d�W��9���X���/;���:��Ϫ{��W$�+Щ�#��!��r�_n��DL���z�z��N���"{@��(~Jr&���f�����Ɠ��:7��T�����،~���x!�?�	�Duo(�I����ND�_�Ⱦ�;�ū��� �k,M�.���H�x`4k����l���+��G���{�ɦ�	�j�y����:lbjBA���^t�P-����.!~O�n��%���sɾ�<�['t1����.`�v��8۴ڢ��͜���V�/���K�Z�Ċ�ə���V���At<�����e3H��|Ըɢmq�7�,<���.�׀֦���/vam -�غv$�J^߭����6�J��K�����F��`"ny縗y�g�zMw�S��PmS�I#(O�c
���'=L�x{q�3� $�<@��bC�^Z��9��'��zs��]*�UcZ�xq�Na瀸���.���ہ�(�0�q|(G8��3�� @��-#e}�6��]�4Q�7�n9������%��vu�f0
���M�[Ac7Iw�a�:{m�G(��2���c^Ϩt�9�
��>�f�޴�Q��Qɻ��fug�loԥUb��/���n���-��hj��DI�k���(����-�Zi�H�ڔ�Kп2�Sx��%ۀ��)�'�3_$�l���� ,���
�g�ܸ^�ip`l��~�vU v ���S\��aIT�\+m�y�Ȟ� QГUY�
��"$�ӋCͮҸ:�U��Ե�Tr�@1	��c[/BK+"遛��U������f90k���Y��06�]vtp�j�;�r� �gJ��������	ԅR�T[A�f��F�:Oh�O�����u�E�O�~���G}3�Km?��d�^��L)����۬JeO���vdo�b�O:�t��_��ѯƟ���o�#R��+s��w����>9�ԫ������;I�>�K����3"�a*�I֞]v0��
P?��_t����*����$�>)��p��49�A�f��G�s�x�6��@�&�X�ǊoF$�;���H�eWlN�1漒�'W��lm.}�-orf*,�E���w�����1y<XOӜC��!��:���s�Yɴ������iɎ�F�y�8|�-#�`&yc��Y`���o+z�ђ�@Q�xt�6�f�[�=����0�W�@���,@و�u@R���{o]��H7�b\c�!�
X�24��Ӌؾ^�ّ���tkW�Ȕ/&7�Fҿ��(�����C��-C\g�'��2�,E�N�\g�^�ܳ�$�)p���נC����4�_�7Y���"!= ��������^�|�_��O�JJv�;l�X�@�D>�Z�6�U���<j (�b�N{���{�@떦j��_��E��I��xhaL�U��܏�!~)�o���CG�>�g�U\8�V�Ν�|G6�`0Z�^N��?@GJ���9,9v�:m�i�@����[v]�� ��D��NDâh�|�?G�W�`\�*S/�xr󿋁S�73�c؇�W���*�z�Ùj!�+���y�Z�׍d�*^�\
�sy��wN�JXy�8�M�F"��b���ā���	4�!{(	G�5�I�i��_�f�	x>=[ީ�tER>��U
�}B�J>�9-�͸�?10('Ȣ����2O.�/\whn��b�<��O!�6��5��<���p��D��1<HĤ�*`M��擖��X���#d��ifr1
G�^����<u�3�� �h����. ��)�Ϧ��	��b��$w[Μ�o����|���DpN�Ja��Łe%�Hw%�b�':(!H�i$��&b�ƪר��1<}N�6�BO�S��V"���!���+؟��Rt��y�����w��Hb����$�~�ʀ���ѽ�)��5�X%�m�QƧ*$�E�N��d���k������i�5M��*�%�ƈ"����fo2{*��f&���|�%�:�{�5n�_�}�m��ƹ� ���L���0p��{��[�ݵd�5����H�!���׼_�:�P}�~�6v�����abN�>�.�u��a�x)4V�LU�Q;��_���D�>V�Oc���V�^�Vt�K�8u�ċY�|��͝3��-V���$�-���v���$��HՂv�Xے�;�Xl�(+G����O�i���JC��|��ܖ����h���0p�3���N��3��.ͭX�Z�+b�ūK�a
-j��䰺;B�p���hD&'��ј2�\x-*V��ʬ�4��Aj�r��!�ɗ�S����9�d�m�.�#jC^�"�y��Jy�bL��B͔��?Y�~皂�ʝ��X�`V�G_Ѩ%�	�V��U������.9n~sΙ��^��Y�"���hmǂh��&�5����Y���]�)k�y��ҷd�05��h}���Y����7ZGk�m��Ҿ׻���j�;�ZBf8�Q	�0�,�_xny>����h�8����U.`U�{�;�YE�E��t�(�L��߀      !������`L8
�������s-�o�淬�V�U���׿�s��XRH�hS�nG��4����(jb�D����If��Ќ�$!����L�#��n*=6�0
��(��`���\.io�u�C	�ȶY�+��f0Ǯ����%k����q�;��1 ��̨F�Z�)�Y���R�[�K{kU��
4w��ǰ������݅ΆfIn�,��MIW%���-��		�|]�0�z'��NEybA�qMc�fd���W�����m�吳�ȷ�-�p��߻>�0̙���Æ�x�ɗ8W��������R�!
7S���[����;��D>��Ճ�>!ܭ��Έj��x���w:��\�{4�@E�!�ݪ��(�,(#��A[�+����Ϋ�gY����$Rka�z�Hd���ÖƉ����0���o��kc��!�9!&3_	�d�-��9�� �m���{��i��%�}}��@�O�:���&4����`��X���Iz�ņ�N�����Mܕ�� ��=�&�D9v�(�W��ͷ���Ѵ|��ҮDZ�^J�Ô�$��'s��9���]�&ݓ��]�Z�aB�����s;ʴ����c9;��߆��֎�@�i����(��\Gr��|?�/�o���آ@�~w̾�ߒ

�$�y�`	�b�!��\<F�&���&� y�e� �}����Ei#Ґ<�XJS�:<�/8_�_��P]�n� ѡ�9�  �A�K�g�՜�>n��&ʹ�/P
�����?�<�a��3�'$��y)Ɠ��%j^ݠ��z2{�2E����)�R�����(t7�����E�ŝ(�*>���6��d(������[����6�
�P�?c-氍�,ۿ��.Ľ��(��u�]�6�pӆ���N�Mǳ
�6g�?b���1��/��T��T��B�*;mh����e,j;��N�?!�6n.�%�����mP<L�J���۞_n�r�Ɋ�x�W��(js��"��͖������y��!�[9��0Ur���`�o2��ZB��u�_�dM�@y9kL��Z9��n�3k$�F%��c�K��X3���)�H��c�5ZA͖H�L�$�'�`�Xw��+�5;t��c"�}r���+����`�>v,���=Y��ĽGN��N�(���1��g��2躓��@���Tf�씨�؃�#5��21�+�'	Q��(p��xIM��t��A�cJ-�C���v��z�:WS��+{�ҿ���_9D[`�����w�1[` ;�.e /�n�S����8�����`7E�&��.JZ�6~B/2)�SA�좴��*s.��PN��A���n��
̦v�"��w ����/4��D���X\�*1O�':_=,t*�)�H�����g�F m�f����'t�t�vX�գ��]N;�)�Ļ���:�6JN'%$Ujv6����������[��������vI���L�7���#�y(�r���ƔNz�U��i��QyP]� �5C�Ah�����v?�i0xDtn�މ�d9*M�E�!�av��D�����6MM��u"<�c�L2�[�l������JYVx�'��@�S&������6٦s�fX�7DX��N�jG8t��黵	�/{$����^6iJ��%�ҝ����ͰdJ�bZ�I�:fw$n$�pX�E�k�<�G�4�:+'���,.fԘs�Zy�e����57,ܫR�]fW:�f���V�$`�
-��Y/|K�'�pxN��6�;)��/�>p���s>�qF�n��e�����?�I��̶�x��!�0A��V��	>�Eh$�����9 �qMU�fGlN�:��.Im��C�8��y)7F�����c�Y�����jy�d��t�1A�|�\�q;*��A }����z������k��Y9�_ܭ�c�yJJ��3����V������O"�QU,������mC������ǎۈ �!�>����Ir���9o�`�de�:��l̓I�!}�%Q��n8�� �C�+㰊��`ܼ��^� �SJQ���[�-�'s�љ�Mh��TO羃I:LM�7n���1�T'���w�yS��ىU�fݣ,�^@@D��w�<�q�i�i��� ��=��e��1p�z��P��QH$<�ѕ&��L�VT4�K��*��4�8P' 2�e�x����%D�'c[��I��6?����^�s'�sz���PQL�/HŃO�� �G3�D)N_�.
���V��[!���{g) dP�ʵ���l�F3Z*�r��'�;^<P�=!J��G%(9Q?������V�$�sU�p��Lo��,��8�����G�)���ܡ�ڵ2���0���}��!�gRr}æ�'K�f;�,ZwunS0/�ۘ��`\�/�zM��6��������-����� 	�%�s������Ш�P�H��x)�Dam�*���am�6?�y���4w���Fg�K�|(Me�lo�8 �1ܦ0�d ���A=���:�S�|+�#e�S�&��Ubk�p��<��~�.����'J�~
%I}�A�i�rԖg7�W���i+,Qp �y$d�c����x�9�|��k�bc���jI..�Z8m ���2����#������m����8���A�E�jͣ9���gG[��e�]�~~&oQ���5�o�as��|�Lvd�c�w�}"S��5��3�/2�>�1�.M�*�|�g5$�hu��`.��-s&�C����=F�=��޽���֔��z%Ե�'��Wd52�Yx���� ��kMe���ρ�M���[|�Z��YE�J-������mFݡ~�-̾�]�p0�����r��`s����Z���ߎ�׶�%C��-7؝�S�yh�Z�У_�@���ͮ��#:|�s<��"�|�]��YW\e�3�j�=��)����"g 8�Y�^�$֜�53�1ѽ�jS?��ù,h���Y�r&���H""ZdN����:qP8���3Z�l���}cĺu�q8J"&6l��RW�ݓA	�o8�<�-��E)��)��:4J��Qm�Pe����aء���)�!q��B����/C{�@m�	k�m-��QK'+��yH���$P��w��o�]�K��}��n���<�g����W�m�3ϸ�MĄp��������Q������H�TM�Ry~v7���y�:V��mB����g8���O�i9���ZT%(r���hܽ�C�r���� �g��H$��CS|� ߷Ӓ!��M
9`N6�%�_�?g���aDH�7I�������D�ަl]��j F�CNv�NTL�;3��QQ��p�f:#W7`c��M�%.`�2S��ȩ%�F� ۖ�C���o�4Ip���%k>
��@��Ɛs��]�į#;��(�nW(���sPwXE��� a$?Iq't�er$��E2���n��gp8�,��.e���̨?ŋo��7����$�CU�&�*	�`@�YS��28�[��=�{�S�&ܱm#B�K������p	�H�����L�x�<4.����e �mjtG?WEa�ѹZ�2�8��(j�s ��+�����z\H�5v�[ܵ���8��VLn���:8�vl�-(��<�d���a����� & �S�8�޵)��z_���8�c�5��ξ�Q�M���%ɬ�3�64kH�ѡ���^� ����Ig�`%�?Ly�j��
e}瘑�臂��^���H	��c��(ɣ��͆��y�6��N�.���qʾ���˙&4��c�0!u��8��J�P| ���\�b������7���7���ǆ*�Ν�/��j;�j��l�w�X���Ө�e0��V����2�W�0Y�i�����ȜXlZ��5J9=}�����tGj��mA��4����i
4�R~�sv�s�}��ǁ��/k��}�3y��S,�m���_�s�׉|d��9s�߬�%�G��=w�$09�$U���̎EL�ķt�ԝ���_A��r��!\��9�GZ.M#9��� �:�Ȫ�0��W�$j�wBx��֩Ű�p=[�����6����V��DkG��C�Ϝ��g��5&��ū�����BG^+a�J;�B�u�3�$k��y��_S��&�_�t� (�Z	�\�h�����=䍏=��Fv�+�C/d("E�#�A��I?��"�k�ė�pX��]�O�r׫�c@���m��\��ĺ��W������zS�!���LVyZ~u�~�b"�
w~;�9�af� nm �`D�O��im��-�#�<hPˁ�t�Q-n��$�YOhf�@[����~���@{�q.R�V'��ů�o���.���?��f*Y;j�V7��~���jJ�F6(�x�ݩhhbr��3�a�u�`����b�%r��)6�#�����	ϙ�g�@c)ڗ��o걬k<~8�C���1>#�w��A�����`�T��^�pU�~j�gY�B�s8�����Ni�	���_�����<(���V/α�bEmV��q��UR�����%�Z�K�j��݀4V�Z��֟zJ�O�\��V�%E�B�m�@��|id�b�F�ِ�T�Z��ſa#��Y�"Y�  Cߦ�^��!9R^���p	�Т�p�C��"�E�Փ>!bLR'/��p���Q�9j��Y��=Z)�W�.B&!	ލ�S��"��R�[��;�lQ��k1-�~'�����?�h�[��nz�(�B �~H�Qˋ���ؑ��>B��bF��s�MI��:B;�H|Ɛc�-;��,���K��Af�{�[����׳̛�qdL�Yu>��K��%@g�?B�V.�'緣{��@����]��O�Z�?FL�4�l��oCe�c�+�ۃ��.�$~Ԓ�*&;U�+l��K�i��!_��%Ko����k�������-�����*�xc��W��=��F"���!ő�:|ߛ�Nn��Q�5\S�]k<�=8�o���>(�R\<.�9O���ԑ�ڭ��K�ҡnI�hh�|E�[�Ԩ]��<�9�N��4��#NA�z��域x�R��~fq�k������^"�B�9Q�@�p�.��yp�%�ԐGbo�U�j-pb
�=�xwu��x�z�������U{j5n÷��	)c�41�=J�N�ꨉ˘��}��O�+��<+#��w�$���o����'���#u9Q���E�n��vU�3��%�d�Z�b8\X�bº�Y��<��L(�LR\�?�C�f|��U�N.�T��Z��) �'���m��9��F�,9,�����:����-b|=�����h�k��Ě��F Q�y7K��4߮H�����1�:� ����͋H/U�6q�ʅz(�~R�]u�P�ӱ��$�iuc��5�C��:�GP~^,��{K����C3�����z��i��:+c+ ��me���m��Mb�;=�"��P�3���AK,H�z�&���(��vEM�����uL$�iZԔ�u��1��S�{��� :�kJ)��>�A�eHp�Ր�-U�@�b���\	Z��١�(C�x|���x��	PQ�W�٨ٺ�P�0L/�2���P�1q���e��X����` ;���*e��š3qB��|�$�H8
̗r~Ml��V��Qԏ�.�T� ���:S/��m}7Z@BG�H���cP�D��Q�ab�� I`Z"E�օ?֑4'<�j:J	�N�lD+�fY��4�i�??0i�\D
8P�	7�l�R����(�#��n��-��nj����S�{K�	�}��j˲!P�Y;����+G��(n�~L�	��G[W�9�r�\����Jbĵ�&f����Yd[/Kk-���%��n�W�|�7}F^:��e�yjP��v��V�Jz�V��~�}�����p�l���;�X��-jD��z�rbZ�D����b��搜�B8��/-�ټ�A4Ł�f�!��v�Q�xr�֡����Q��ҷ�j%�5�u��3��.?jT�je�a�_ۑ�.`lV&���+ �+��|g.�����ԟ;ӎf�Y7Ł ��v٘L��+��2�$:b^��C�3��'иv�����g��)����Q�B�\u�Q¶�͉7���x�$7��#�K��E#��<i��ȪP#`��{p�l�r(k�;a�-��j��EVn��;P�v��E�6�fkK ˭ǉ?��*��5�kƪ�8��5,��Sd��,��H`z�'AdL�5w��v�Z#Η��7K8gE�s�T�P@-}���:�pX���Ό��Q'�@�:Bc;�fw�� ��B��:�ۧ
Sf%X~�ЍQ�������ֆ��@uh�d�5ی�t��"��)���b�xv��rh�B��z����d^�8�N5`�h�^�y]v&������b��%C���ܚ	�S�m��6�AC���_#���Oq`�����/T�BH�
�40v[P�uOZ���^����]����i!i@��v'I�E	B`�e2��N`;�Ѯy�a����cj��K���v�՜�|�V/�S�㰂Y6�+|zdh�=�� �BNL���|�&O�[g��а�s����|�lâ,ߞʪ��[k��&�YA�����6͑ ǤD��no��#A&��ό҈�W�d+��՟Ba�
��Mw��Y�q��q��'5���4��� VV8��E"�������c�Χ��ܜ	�8?n|x�J�}� |-H�A�:�J���'�dr}S�Y�]� ��E��2%&s8]KS�� Mb��=�.Tݓ���%nN,X@������S�w�G�Qǹ���[��z��	�P7�C�F_X�8��~ՀΛ�5��f�Ix��P��ϴ,�48���xP|�h��7X����(�{te~��v~Oވ�Yy�s?��w��q�[��:���<����o���t6
w�Ə�(������i�'u�/���3)��侚y���M�������'��Un��M03�&6�[�6�<`�SR���>��ך4v1L?�'�MY20�;k�
YC��ؤ��7Ǚ�@           !���ǁ��J7�|��^+�e�o}/5�����j���X_��~� �io�h ��j,.5v9L1���0=U��H��{���־�`-���skʸ�4��E�"$�gb˦rkg!���m�C�a\w�̗��&��� V�  ���0$�Gt�w�L��N"N!e���5bT�t�����YM~^���?�G�(C@5 s�P
Y<)�(�
e�i�H
 ���ZCh�ݹq� u�J�>������D�.�>�
�>%H�B�����`�4�6�oـ/Իn�|'����	� 'ij����z�o�ߍsշ�$��i�q��A"6���N�ֆ�ꎾ��km\�SǗ�3��7�'8  �A�K�g�Փ�~��W��*��pt:pa�X�f��c�p�Ѱ4�BzX���u�fYK`Pj��5�v*%?#��?0�7FI��i픪��pV��3�[
��9~a5.��[7����.sO�s��w��3� �!��vͫ!��|��:��ξ�`�x9
�����\�TQ_t�O�>�7�=����Gbn���|� ("/���Mp)im�����!�L�R�!7fB�m��R��R��Tc[�[�ԥx�S���p�M3���yM�f�{Y��Tu�p�	�k;����&a =�\�gү��u���<Es̳�h����6�ၮor��2e`!��Y�X��MH�26$#!˟U��_"W��p�0A����{x�l�|BCA��%��X�����d�����f�K�ªb�g��&���@��MO�K��4|*�UO��Κ{�L|��=>�t�Z��.rA�;���S�gZ�9x��w8�^U3�Z�C[X�I#kv��E���6���|��$~�+S�eLj�P�\k_L�̔\2x� r��X��K����
=UZ':��Eedxn��0�q��O���9���t�4m*����z�����`U0�\. �	���rx@h&���Н�Ԃ�O��FO�S�F�t�>��s̃T����w�+�oF�lHX�U���~ʭ�4Uw�u�C�����[3P���:B��f�o�f� b�g�Q� ���s�����6�p����Ȧ������C�s;�?r5L�O$̦L�*�{d5�Q���!$"$�nfWF0ܑz�=���-n=�_�	�
T��ҪE��W+K9<W�V�&&@�:��݅�\	�$Gq��������i�3�gM:������&�Op�;�b�����k�߄S ��0������'1���?��>��d�O�>����$ᶰz�ڍ��rtާ6+ڟO�!�;���$뗧f|�9J1���\�	�N��}�}�\��O\CS�&i�؆�X"|3�Dm�8�.���y�E]Q�tSk�:!��f-h�Hw{��x�Z�[�:�� n����JJ��o���#��G7���1�G�่;so�B	p�5#�3Q��X�R/{�R�t�t�RIc�_��Y�raQ~�-3��@��ϝ��a[( "<%[I9�(� Cѫ$pJ��VG��rR5^�L���o��k��\=}yP-��~9TJ	K�.��1`z�\q�_a�{X�ǨEt�#����Rq��65��I�	��s�3�L6��ؤ�]�0,�v�ĴƸ�J�0��W��4x,�At0�3Q���ف����5^�"�q���nգ�-�Ֆ�m�/i��"�|yN�o�"<!���<5�..y@�-��	���,�k�Ŋz�s��`��3���䠹Ho�f�^"gk�p�J#��F�. \��JN1�J��9��!pV���b�PZU(�x3R���n� �jH�,�BHێ:!��^8?�8$�<7��
�کP��Mˇ�oO�>{c�El.�R��+�(r�)���)��}�l�#GS��"";$�.�e�F���7���z�_m6���7���Sj�*}��,P��x����wsh@����b�EvT��12?�1�2Yd��Bkg��B����N��:TxѮ�Y#��ڑ%�tP-E.���&���P�4�p�N�fC]��v�5ʞ�tb2��O�׽�����F�~&��g�;4j�d1�mb3�bP��Y�]%v���$�c�q4%u�;�<F
v�><Opi��̈�_��S������<�v��W.e6.�{�vB&VB���F���=���!�٪�3�(A�yc��FD���*.���4��q������������m�ՎxS4���i\o�]C�ʙi&��wMiH��
�j��������1Π7F��E���q�m+�H�H�p��f!�S�'���%�?�e�^��d�A��`�e��֋}�A�%�8��2c��N�
�ͻQ���$|N�9�8 _L�����PQc�^Iv-?�M�~�A�-l����3 �k,��*����ؒ"��df)�2B@b�wF�I�z]��x��k��� ���f�FQ��
{��
[������*��)=[���G�z@&��}��0�`���
��.{�-��C�#�؛(��*�θ���<���~5%���yr���<�<~s�X+�����s�QE����U�HV(��� 0��_��tZ����h%\2�)�]�3Jo�43�\����@ ǜ�"��<�%��I�E��|W��,:����uvo�0�{��CuF*_��zM;6��ͦ49蒪��:�z�}�y�� 0{�<Q�%Xq�6��X�kE��]���j��u���7�GE��JT�@tailwind variants;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            �x�)��pI3��^�P�3Z����Y�#���o�NqOHH��F���n�O6��|"[�{�)�8MP���fuCB����}�f�)�m_L���9�B��O��J�&����;�~V��YjQ�ȝ�xa4�����V$V��By�w1���:�بn��5*���h�����͖��,c#v��\RJU��n�Ъ�A��!��ۙ���;��v�A�$N�b�1�l���d՝�Pa���-�?;7Gu�2�4�eo䓥K/>�&�J�c%����`�f���G�e�R�mIr-C-�h�f����s4�7(�z"8�o�2��`�0-�m������M��HSꗙ�S�
�VZq��ج?V����"�rs��$=�]ћ³̗�s�#�;F[��0KZ!���abUq�Cދ�����y2��V3�$gMo]j����Y�;N�?!�YFw���d*�Τ���jc��V9�X �6�d��l=�"��<���[$��~;Vbz9 ��J�9_�빢(��qH�K���[�%u1&ѧ���C��|S=��-�����;4��9:�.���aPb���<Q��HTO��$d��=��r�4T��׶�q8�0��oA?�b���+�9��l#�����e�rϞ�X�
�$x*�Pt�9V�� y��VB|�$��M�~��/QvY����M#q�$yu/�k8Q(egP3�M�E�_"��{u ��֨ks�*滔Nײf��8�BӪ�zɺ9Ÿ�]�v���k�LD�����n�M(�O?$��vi��6\��Lfb�|"�� 1CXo���8@_��j�1R��H���u���4#\��J�*���h]�*���6s��4���!l���MW��M��ؚI+�/�����F���殓j��&kï���]�0��`��Y��o��f��w�Ӎۇ������*��)A���9U�#�� �,�*�Ƿle{�E�x[�Y������q�t7��R�3P2=e�~|�s�.K9�0�w����wv�mi��˦]+�[&~�.��\��d������T1����ͧ&�G�7;)R��W��q!wJ���N2���42"�%����O�ܜ�񀠩$����;I�<�����-�5��
@=�՜��PŇ��y.��Z�����[�/���{�fp�L�m%�e|�����!Q�W\�C�A����Κ���=y�g��mIM����;����_R�Sÿ��lvP&�;z!�~��c�3�vn_��{({|�pB�|��$�r�nq��eB�Ⱦ���Hh�!Շ_�S�~	Ԣ��cԔ��KU
~zc���1
5*��u��ko�6����]�{�kU���v���|�B�o�A��A�Z��������c�	̾}�ׄ�fŏ�Ħ���}�I0�s"��D�LDƻ�2U+y�%�^]#T*~��&%��/rqiń���dGen�����=X�J� ��	rI$���"�nYM��Y �)o+*���U*�OS8�q
JLZ��~����BR��4�_��?<7�a4�
�0go����$�v���o�Kr����e���&�7�mt��I�����#��-���Z�f�Z��(���g2�"�2�t�L�P@�F=�����Wɶ�\�ݩ���X���Ӧ:/Y�3���Ҽ>���k��>OA�\��Z��1h�ZJ��Ďk�w�I�VZҐo��i	ǉmRV��ז�*M�$S����eK�����(cH,�o�\���+�--4׼�y+�Q$)�(ը�A����V
vfc�&��݈�q��� �R��͐�7��*v���(��2���62;�a􎎶:�D�'Łj��,]�\��4r}�_�@~�|�V���o���cc�;k��*��T�~��7V՜D*���E/ sb��
�ԅmb�^D����v@�����"/��C��@ ����(�i�	c���,��r��~�X
�p4���t�Q-�B�Su'	� N5�������p>���Ey�<*(^��Ov��58P?'E�O�H8#�TΓ�_͝�\�Y�@[�A��,r����6 |�u����!|�mn.2'ԝL�19���]^G~�g<�W�}CHM!���zIbW�͐�#r>�R��K�|0���T��r_�I>e}9�� ���F�0˿@�0W���8����O�n���n�b	�A!&7��>V��-�'�9.�ĺ�vO��K���q�T�&� #N�Gk��H��z�� 2*�:�����O6�[;�4*��ޘ�̝�2���	$��[�H.�2!(+E_ch�[
���R����9�%ra�kȕ�bH�uY����e�-����e0Oi���������]GWީ�ݟ��\�)�Ws��crV�Sf׫ ь8��8�Th8Cl���]C�6�`^�Q��_�Y"T�䐧_?+p�`����M����e)�r�;�)Qi�3L%��
�ȼ�`S�e��TU�c�\��X'���N�a�����I`|�8�P������\s����n���p��$um5�L��t��-�K�#B��(S�$�n���;�f��������Z�˱	����W�Z'�N�9 PO��K���|�Ě���Z�&c�y�iS��~���ʭ�<��\- �=7_̉�� ��Ww��a���������~%hAOO`�-�H��u����1{7ۉ�E�W�&�*Y�d��jօ���R̯��Ƿ��j��Y�S��U/\z �:fX]\T?W��-�%���hh�|�r[;�L]k��X��{k��c���Ï%F,�T�.Pe}?.S����3?�#�[�S3o��-Y��y*�w)�0�KF��I�*՘�/ԁ{�5�a��:tO׉j"�::��b�zy�۠��ȪS(g���&��l��8	��\���=]��'Ċ� �Z��^��M�M�0s���B��ʕGab�ط�k�j}%��(Ve~.'��B� �r�u��$&}X��
lO���%Ն�!�\�/M��:I�#�S~����5�tILV��"|�z�#�U��{�J ϲ���O����p�Bz?�}�X�׌�iGN�o@�>_i�$��=�N�A���G�.LȜ�6w:2�� ���I(Yݽ�ߐ�'�r��V�S��i�XL�d�����A��x�������%jV��j�\x��.\��$�@�k/��4��<��ᓱ��NywJ����J�D(4�5���=�Q��O���KO�ͭ�P&K~TQ�K��-#�m�sm�����w��V�V"��b�GnvmĪ)RV�hd՞\O����M���p�u�:Ggy�z�/D�YI0�����Ν���@J'���ٵ�w�K �W�����_�)�y�����U��pK�`
�?�Op�V�]�=9�\�(o��$��b�l�UhJ���C�W��V��2ފG7Y��F�8ks?�%"Z�Wz���w�|3�`Ң��� ��K8A#ǟE��˿e���k����'��/� �v'c�PX�������.*M ��Z+
8�Z/��d ,H�-X�w^ݍ��\�ѱ���x�l�R�#�5��Zt\[�;[1qF,;��=,�'�����������}���-N��M?/O�'.a�4��a�ʼ���A�\�S�6a�IM��Ďf��gg��f�<+v5�x�����z���!��,;�n��QE��?X���P��`��)�d7J�#��7E���a���6'Dsi$B�]E�$���Qf������l��"���G�a� �^���A�������g@��6��[��jDMX�ڈV^^�����K(�j����:�������(��^�h]�	qn��
t�ڜ%���!h]\J�9:LF��L�8�6�}��!صC�i��^�izl�x��	�{�
x�Yp��3��	�����^#�	_-@݇���TkR� �Y���`+��d��G��.�l⁄;��Q�O$���>����-�j�\dc��:~�7o"����j+��¾?��y��\�{v�6l�O��\�W�х��W8�8I�N5��>)V^&iD��\����CԊ/���%���3�cl�\�+��:}��$�x#�	��3X�;iLaV8� [��ڣ�kϡ�q ]=}����u� �����~=����~݃H6>���6��8Pc�Iߥ�7��<��;�\db`��#�Bz�����I��#�~��(e��3�[
`��<�i�G+������T\P��:[+(r��-?̗UUӵA��nJ���b��|0Rl�<J��� GP�T�[�|/�1p��Q�_^&��YA�ָZ���4e�2U �`ʳ,C�p���R5G�R* a=�©JBi��F����(����9n8�!^���i���8á��F�}z�B��=�U^�L����^�-y��X           !���GQ��t	��z��3�Ʒ������5U(�%M�:37+����>�T0i#�a��_l#�]�s���J`��B�3���<�\���~ѫy��0���
�	65�<42j}R��XUe�r=4STq�DI|� �+0�|?��w��@] �X�k�H�<��Y�������IL8��;�5�N���/��X�1�p��S�_������~ұ�Or*3����'�!�>�*�O�E��n:�r@����.�É��@�?��w|�a����߿����kj�h�6�O�	���wy�b�9I6��<s�~٪�ã�q���<��9h���G��9b�$�<jk���kO;8�m���n7-}�1����!�ծ�sA(0&!��7W�k��e��q��ޮdeZ�Ƃ��|ϛ��~�C�h����'���//��y+S�/��w��#�6mؗ�^ v�]�à<'�� ,ϵ�ǅo�%k�&�����c4�xX�ξ
��~��
@e�Sr���èЬ�<�ȣc�tn �F�^���ܙ�O^t	��	��}"J!��@s���-�'VWc	W'�C�ˢ���o�I������� ;�4B3~�Y��r�UR2�� �y+���;%Q n+3�M2#S�
͍�}2����h��|;Lb!�As�8�uJ�K��@���[��8�S��ܮ �����ӂ�q��@��7�<����7��N5��tF�Zmm�>�(~x���  \A�KЀ��X.��R���_��B-C�+dh��]�eϬ�l�^��?������B	�!)��ѿCj�O�bP���)e�ѓ�޻�Y��Wym�`�C��w붛с�l��~�Y�h�P�A7f�5��K��ϪX�}[�i�N
ɘ���R���v���{��r�N:_�c�{H�G)�VO���� x��6Yл�!��{�F�E����EY�:fC7k0��=!V] �h|A��%A��/��kmZc$��YW0 I�($���h"r`�L�QN�K	д�o����QX������-	�E>�ǐn�P���䣯��)T��C�Y3�Ô��
��|;�\�&4�)nj�����+��^HhK�Z ���%h��,f�� ���K�\]��8�i��4���b[�h��LA��.�υ�#�w��W:<p�p}n\�6=X��H�pU8�@�F@�@�F�[�Q�l���qCi!լ����+��u��u��A�T)���̏�Tr#��$+%���Gn�+H�l��b�`��Ҧ����J�U�.���0�/J��v��f�W���\=Ï�7jR�ܞ='���}F)��B���S�|�x�OAK��p|�uS����K��cRP6��c�5�������2v]�^���c6&��gZ�fe�y��&I�w�]5cHk7�f �O28�Lja��C%qÀ%&���g�oZ�BC}���bK�v��N�Oɠ�Q�^Q�`����V�F�
FuԞ�nVG�Y�K�DQ�t�|�� ?��v�����N���֛M����ڟL��bwd,��{��ꌉpg ��&,��J��{�{�p�Ŵt�Rt��&4�����2���HDE*�f,~��u"~��n��=c�'��~[�?q�=
1��� !�u{�G�;��P+�^]�U��\>��A�j��|�h=�c�����}�a�q���d�ΡD��ѷd=]� s�n�I������]�V�aQ^F8�vb���uv��hS�𲝦K곣;?�:PLc�WS��@��Up{
S��׭U=s�p	2�����v�(�ڽ�`^YJ�0N3�Z�$>��񛎅����6�)AKۨ���J�rB|����L(v?$+Ty*���W^�s��n����k�JY��}MIW�-���8i�WC��A2�d~�G~��U���K�?�����9v�s(�g���0��#�Ĭ���pξ$Eě��@!E/bq}���^�?4���D����M)�i���)i!<5�`��˭��m���N%ʘ3+�:����ʖ��[볎aL��atF�/��E1�����D;��
V۵y�ZЧ�68�R�W��BU>�\�56�Q~��j�`�Ǻ��2��e���[���,�Jn�G�ק~�o�.�P�~a2�8�e*O�;����Tۥp8t���-�(O%#�G3#1�tx]�2N��+����RJR�K�Ns'�
f�©Љ>t�,�ú��)�~\��qK���r�m�_�S) �ߨ'��k'��!+������c>;3�Nc�Pp�B���ox��8b�'ό�d��f��ƪ �Q��JW�����8�����it�
��[��<�~e����M#묆,�8�T��";�煜�9�c<���ՃX
xɐBS3M��Hs"�wCa{�3g���|@�g]�	/>o,/=�|N�L��`�>Şn�ݾ��%׮�]�~��ֽ!y���(��|�zG2_���.��^mj簌ͦ
�r�������k��D~ֱ#�S\*�ʜ��f��4�>�!���Ð#�-�S�_RA��b2�������E2��fukK]�h"��}ɺX�T���Æ�+L��[V���Y�rJ$��ߦ���
��g떌b���G&�d4��{5���{I�J���!�<��2?��:��j����ڛ��틨���V��9D�f3R6�'|[3���a��?!a�?�%	�V#���]���@�O2�}U��u��.�BS�9�B�}$���q������y'�ީ�2�\ڣ�q��]
$fys`_�g���`�n-:H�W��+*ֆ�o�l��#Q�����(�8�"��1��Qw[2/��JY8��bJ�l�B��������dg�{��b��HkAn��3����cѲ�o9i{��ɱx>O�[}A�y��qG�Ģo�ݮB}#�VJ7ES;9�s�I�ݜ`r4V6n��X��:�S�IL��kӊ]f��]�Y��F����|{w����L�g\�I����"�26�lP$*��\��L>�G�ƌ��#��30�4%y���I�ziܟ����9��@�i�2%����I[��:�������a20�����/�L�|��A`�K�P��P�tw�!?67���=-+�����4�C�LUdY��FIe���X��M���'K��?N�f�:;�9����|@�A���|B�k7Ō��	��9�o2笠�Y�g��A��G�������I�P��5ֻ݇9Q6�uތ���@�"N�4]=m"
<�JN�}ֲNy�i�s���=#Y+��v%F8 ���&��ʜ�u���_:���v��m-Y;����Y��q$\g���Ң�c@S�� �Vp)��	-������]!�N��#��E�][�I�V6æ�:��]6ymR���\n+���N<åFc���qU9���3v%�]A*���?�'~zK��GN[�0�P��I�̷��t�\%hNF��&tŃ!Tne��z�y� ��	Ggi��$�	Cݗ� 4�o�V;�k֫�
P~���Z���*2z9d|ǘt�+�E��6��oCv��s��`�޹]�Tc���g8�gG�3�k潿�o�������#�#����c>g+AϠ7�)��"%��̓<�aQ�Xg�'N�$�b��j7��_�5.�bj���ZbGq��?�$��6���������D艪�w�D��C��FcLAe@�q��Θ��_+����ҊBm�To���;���~�m�/5�a�믹�px�l�	�}8s��������y������go�t|�`��S*Z�=�1Y�����o��Y1�4�n�:�g�:m$�{�Z���S���F�7�\���wN����`r�!�~T�q�&� ������O��c��5�6�)��Rq��#�'8k&fwi�,�	��\����D�.��Q�!�s��J�e��QuȖ/3��j�kE�e.���i���%��Y�Ŵ�����F���z@�$
^�L�'ͫ�����YN!�!=��R����c~f���p��y+����Ɯ]�SS���#�e�Iv����"{���il�2j�w�x��?4���+F�u2�}�4�\���9`*����Y\'@:l�{�=�m�i����,��+H_�||����ZUD�.d�S�ނdu�i���o��$l��9�7�DJ|I1@�8�$(�8�5��3�ۚ���j��^���qR���U&+��f�3��h�!\����[���>�v�V0ܔ8��ܰ�)��?5���	��d�M^��)�L��hԻ����t�8��������{嵱\1�h�-�v�;�(�-��x͝ce0��Ng�����K��%?2T�,b3W��d?.�B���;�A��l?����-��$8��G\�Bm^���
�j�u�E����q�{H`�����f�J�������0%��_�l�a��J%t���SS#��&Q�k:h����/Ӂ*����4
v����dxB�e��[3W�ۢ�"�2�J;�^����*���_gJX�o�p�4l��U��7�8��ٜ^1��/l�aH����ǰ���}�nvk�+���#h����9�5�`	�{���J�Z��	�p�s�NH<�Z���;x�m��+ �6�	J&i4}	G�k6��9�~'?Cw����d�q|[�X����.�@�~j�%
6r�&�$Bh+Q�tbc��+��(���~H�3����v�%k���E�*
h��U������Xg�kd�����@�8L/�)�Q
oɤ��8F*% #4Qx4���?�fB�)��ʅ���G�TȆ�c���4�*=������m��$�M82p��J3���v��9ޒbUD����,��8�O[�Èr�EV�T��Z)�T3�bW#2�}u����q������nk�wK��Dp��?u<�^F�B��iy�XNӶ%�&!ܐ~,r][����KCH�>1�w��D���X������\��i"�@,T(5l���ys����4�1�4$j_I�]^�T��ڙP�mw�xc+|�+�l�D ��״f�<�r��5t%m�#�X@ �4QTk$�G�?�#�����f��S�Kn=���ťt3�u5_�~���M����38Qx�)�b,�4�*�4�P��`f��,|��?����^�#uu��3���!�.�4����
��	���d�=���d�k^��o��!�E�X ���ȠF�h��%S����)�����(Pc)9V�@,�!����E�K�˥��(��y�G)������`}C�X���M�O� �Bo��ԗ.����KJ�`��{ ����F�<�y�P�L�W�R������i�Yr�?�ΩY�W)�&�O��%)7x`d�n��A�l�i��g������<莰���')�e@-�W��3Ч�ؿ=9����p(Drk�$5�`�*�%�/w�\�u��C�9�����Û-@Sz��B.�,R��4��|���@pN�������@נ�f�$8\,��?n����\��M�F��,���yQ�&�HA������C�*Y]?�x#_��D���~E�R���P���;�nL�\��4 	7�iD0�.�����w��E�	�����gDTF���C��E��"��+�M(��d���F�һ���Y�����XT�"�ó?ݳ�b�"�Ӝt��m4]�M�["��i@�1��w���H_�,����GJ��.��=o�ק���(=��EP��5ϧ�Vi���+LR����tpW4��*��L���<?
{�ǃ�̅!��Ǵ���x�}I�L��	�@i#�x���Z�����G7[~����6qeB?3X^T���k�(:���kyp��g�%>�"Q���?r,��CK~ ��|%�����V��I�1��-#�E�⇯ĳ�m �S>�&;3��qyr�����4gl��-N����B�dj���VQ���|݅�>p��`acu��I-<�i��
�c��9���Q^�.�~��d+Ow�����W����X�żׯ�����iwD�W��AJ+��u���r�H��m�q`�,��IBH2M�nt~��&O�Ƥ@��jc#�(?֋�ZۇR8�?�=~DI����B�L�G\i8nhR�2��O�e��P�v��
3Ѣ?��v��O����klO �'�CB-5д��h��-�ZM�P����hN����[�����S��\�c��'D�\����z_���%E��-����G��"A�Q�1@�5�9���pL�\Ӆ��>��m_&�l�dZ�Q� �)`=��Kc�5�4�A�bXSB\�r-Z5T<1��;��y�o����~�6�7��$9��J��T(Qe扺���B�.R��%Lg��ũ.av2Mρ�������>��@m�q;!��)!�Hp�����h���m>bU	�YtEP�p�D(�Q���Z�u3�y ?pZH<��ړ@Ŭ��'�6��1؟</��J�7P�4]'���s�l�0��m���p�m�C1!��b>�@���:5:�5k,�O)�z-����
�
�U4�m�z�tL�׎����	��$ UZ.oR�I!�����E�m&��_ΞQjI�lP�0>O%��k�P@���[q��}�
BĶ�ebO[� �
��ן������
�0Ɏ�1+���=������U�F��ќ'ԡ���bLA�)K�z�"˨�t�hy�4�]��S����ʘ�~�e� ��L�W�ow\�a�X=�C��Q�J��cː�-UOC��� �'�S���n�{����mN*cx���J�AM��i��H:{<w���5��2��Ļ�A���rP�������	U:���gp���-�s����k�G.s���%1v�� �������nP�����5�fu ����K�/#�x�'S����F\���K/q�-���d���H6���������Ѕ���0�+M�G+��悢�Q7��H���u��]�g�����r��S��Z��<M�(�z��t 6Q̞��*�k�#3�9N��p�+���ȩ�{�h�-Dr�����
�r��U��F/����� ?aq4ѱ�Μ�u/�{������#z���FT$�β��i�{((il{5�`s�/�?ѿ���G� ,�~���
������d�HU��~$d��)�9s�a�"_~�7D�<=֐�Q��o���Tuٕ!�����FFD���%�V6c7[���i��Q�gH���O0>!'�u.��z��]�b�U��VO�y�ڣ�'�X�C3�^[k����r�*�`�Y�Q뽢�1/��a�NOޜb��e�ʖ<��4�Ck�����A.�����Ysg����gL��$��,u�>�q�X�)${G�����|��>֩�+/��O�Z�[k��}�i�sqq���q���`j^�Y�1Ug�P�"�����Ӗ���نį��7�E<��Eqۤ\B�0s�>�U����ڞ�V�>0@���d^���QH��'�Lr 7%��0sM�&>���$�a�QK�gm}z�=g�:A��`v�)�B���lL�	��h�ϔ��[�x���a���8t(��Sj[,����i�ne�6��G5ک�\��(��������%�n���)O�:�E��&�(��������Y��v��%q%�I�{=���2� �.�%�k�&��&����p�����E�tr��l�!�p���q���q��X
y=���2>"@JkXN/���_���\��E�WfEb��܅��{t4(��t�;m_�J��]{9~Y�"�;dO�E���������.xgj�":�h*�G{�M+(�c�)_a�~ O�
��5��Y�g_H��-�����j���w�f��fw�}J�l����T�::sE�&�{�̥�	�*AЌ�25�v��4OOsV���5��#�)��	�Th�v�Ђb�Bˀ/�ҋu����vG���3�q)|1z�        �A�KD��x�AH��@.?j�{L�W�6�������'×C�v�3�X9@�h���I�UxzZݿXHH��\���g� ƣ\O,Rl�0�:'��m	OKd	�N���D���kt�`����T�}^�]��<������`\ڃ��:ߧ%��Ԛ�zsݧ�ñT�fD��u
���{#�T�$�A�vaǱ�{2�MM��M^D;�_�".7Ԣ��G���C��em�)��И&}:{|a��=Sn@،:HOu�"�Մ�8�e|ǥ�(�#y�U�+a�:h���q&�Q �¼:֩ܘ�/��U�!�e�A0�*S�nm��w����=�Qe���g
��� �����d9�
�Ô5	�p�E���҂�zvj9���#c�5����Lcp�XL�%�5���􄃷�-���')�.��`f��tS�4[�J��
�;k�p:����X��1'PR�d}Xa���ȧ�X1�Y�������ׯ&LO{6ֿ����sj!��O0Y���M��n.t(��&k�3�3���&'|+�$�F/B�}��a����;_�l�}*�`E���tߒ�T7z��kS
�w/lǥZ�Ӑ�E��珤��c��}'oIr|H`s��t��\�5�Ë�\�2�vf?V��϶�Q'��ߚ�I��>�mY�x�tDciq=qqW�p?*��H�⮉+p��\~����Q�AK���Ⱦ�D�O�n4?��|�;?�K\9+xu�E�,M�T�+}�F*ɹ���uC*F:�����s��M����t���7��
�{�9��q�ݾ-=Kk�5L��d�"H�<by�p4
B*��L��L��3ff�,���Y.?����$*6U�;9w�HA/~f)-Xͅ�� ��b��~�\eG0O��K���PR�N�c�ng�j��拖Y��c�����QIpI�`�y��Z�l�s��IC��	;�{���0n�Ţ^.���7	?`7{��wIW�8��Y�q����9�^�$�l�^Dީ�/N���TX���5.�DʏR#�$����[%0�zHzM1{BO��j22�B�rgJ�����i��>��&�=�~Q~���ߛ���n��'�|��Q|=$�
�����;���Rǌ��mn�u�1>�3%�S~���O���P�R�d�1��rr�iu�������ݎ�E�<�`���ՠ��{�?�nY��e���FêR��W����L��N��?
����7���v�`�S�������s*���`�`+����\*EH�\I�E�D4��JJj�91����"Ћh�{���Љf��3}����v�����d�B�B��� |��y��Z�0
F
-�]]b�eGӷ�J.Z��	w�~qu�[mp�O�W~�}�t��:�0��� ��V�F���M��E�E��O�v���V�v������kK�cl
?�2^��RT����is�:��خMw�U��Mz�1�`��}>2��� �
V�Ő?�Um�����"������P~_A
�XḗW���~�<���k���3~�����#)�N�"|K����۷��Z�7|��)��l�t�,���l����(v����J��(,T.K@��'g��+VPp��D�;�#�غ�γ�ܫjG���k��ǎ���'(������H�I�̑ͷ[m"O���M6��}o���U:E���h���:f��8x�O��8S	��ꉕd�k���
�S|��t̔�Qꪩ�������N��آ���b7e�ӗ���dY�ڙD��Ϟl�gJ�=6�H�2�kҮV{Ϡ�X��� �l�~�V��PA�:_|S��T$	��m����L�I��19�!�}:	��Z@l.�	'm�e?���R�Dr��|JS�4o����ĉUz
�4�,���r\b�{Ġ�\�]��Z�h9Kj�&�`j&d?��:��dUBr9v�0y��i�����!#+��[}@��� ���6��o�s���J�	x���W[��9��ւ#�����	����z�aD�&1�Ҍ��<�}�&�H3�-K��������:��s][����jN3h�����ӧ��2������y�x��_hΒ�eL�g*�[���76UfsZC���l��#����Fl����t�^�"]��SC��X�S�r�f+N���ޫGw�VS̏��o�S��tKZt��[�n�̇W��0l���!>���F|7�I�U�I4&��֒����VEh�d��_�J\l��ӓ���-��o?�!G���x�P�#�]+�j�XB]�yR3�ο��H}�����ĉ �㘠E�(�p�d�Z�s��-�.~���gC����G�1k�Sk3hn�Q��je��M.+.����� �c��B�����j��M�\��L��yl$����/�x1�͎�y����#J|yp������6�C`
��|�!��Ů8�^���;QR�Sd'�7� H6ZH$R�5N�KVp����םX�����)�Uf�<�x�ڀR���l�4 ���a��S;#���r����h�	S0����}A���e�G	��EA[U"���<�;ȧ�վ�>�[u3�-��� (�Y����:�*7+�I\	L�Hm���EJ{a�}�e��a�X=�1�n��Λ���B$+��<U�)Z/�h3��<b!'�О�s"�'q��X�_�U�X�<,�E@]c�䥞$� �MQ�l?(C-2��G)�8۽S]�`�Q�;HG��8���|����K����c�����Y��t�wj?֢���E�.|rӣ.β�'�a��2)x3r��#,��p:��ɖ��h7�U�8�����{�W��N�>'��#�#^�ʸ�P�ς�T��v�*9叶	~�n
#)����Č}B��r�?��g�k.�jX#^b�8Z�l�����G�at��o�m��F��2u��.'�/_;�cX�v��-���C�/Z��h�����|���É��Vd�>�[�v$h�������\�"<�*
Ѩo����6Q��D�?��%��m7F]�(�u����;�ך�?���d'��q�ة8.��9�w������+��p�d��c  
m�����Bc������b6O+�(����R�*&坮���!�p�q��V�,+6���c/@�$�k���m��qY���cg�V���c+v�_4!Z��e��k��N�t��a�QX���EA��;{?ϓE�(N�F<�:���Z;�į�;��I>po~{�~l
�angJJ���S@����Ըt�4�>�
3}�r���#ⲟD�Z��Ŭ��}�+1����D�>���M�`��A���D.����<:�Q[��y�T�șjSTiϊ\���x���VWI6���<p7П�9��~'�A"�U*������h������c{���.           'd�mXmX  e�mX_�    ..          'd�mXmX  e�mX�d    BAR     JS  �g�mXmX  j�mX��   Ap a c k a  �g e . j s o   n   PACKAG~1JSO  �mXmX  �mX��                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   akOnError) {
        out += ' if (' + ($valid) + ') { ';
      }
    } else {
      out += ' if (!' + (__callValidate) + ') { if (vErrors === null) vErrors = ' + ($refCode) + '.errors; else vErrors = vErrors.concat(' + ($refCode) + '.errors); errors = vErrors.length; } ';
      if ($breakOnError) {
        out += ' else { ';
      }
    }
  }
  return out;
}

},{}],36:[function(require,module,exports){
'use strict';
module.exports = function generate_required(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $vSchema = 'schema' + $lvl;
  if (!$isData) {
    if ($schema.length < it.opts.loopRequired && it.schema.properties && Object.keys(it.schema.properties).length) {
      var $required = [];
      var arr1 = $schema;
      if (arr1) {
        var $property, i1 = -1,
          l1 = arr1.length - 1;
        while (i1 < l1) {
          $property = arr1[i1 += 1];
          var $propertySch = it.schema.properties[$property];
          if (!($propertySch && (it.opts.strictKeywords ? (typeof $propertySch == 'object' && Object.keys($propertySch).length > 0) || $propertySch === false : it.util.schemaHasRules($propertySch, it.RULES.all)))) {
            $required[$required.length] = $property;
          }
        }
      }
    } else {
      var $required = $schema;
    }
  }
  if ($isData || $required.length) {
    var $currentErrorPath = it.errorPath,
      $loopRequired = $isData || $required.length >= it.opts.loopRequired,
      $ownProperties = it.opts.ownProperties;
    if ($breakOnError) {
      out += ' var missing' + ($lvl) + '; ';
      if ($loopRequired) {
        if (!$isData) {
          out += ' var ' + ($vSchema) + ' = validate.schema' + ($schemaPath) + '; ';
        }
        var $i = 'i' + $lvl,
          $propertyPath = 'schema' + $lvl + '[' + $i + ']',
          $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.util.getPathExpr($currentErrorPath, $propertyPath, it.opts.jsonPointers);
        }
        out += ' var ' + ($valid) + ' = true; ';
        if ($isData) {
          out += ' if (schema' + ($lvl) + ' === undefined) ' + ($valid) + ' = true; else if (!Array.isArray(schema' + ($lvl) + ')) ' + ($valid) + ' = false; else {';
        }
        out += ' for (var ' + ($i) + ' = 0; ' + ($i) + ' < ' + ($vSchema) + '.length; ' + ($i) + '++) { ' + ($valid) + ' = ' + ($data) + '[' + ($vSchema) + '[' + ($i) + ']] !== undefined ';
        if ($ownProperties) {
          out += ' &&   Object.prototype.hasOwnProperty.call(' + ($data) + ', ' + ($vSchema) + '[' + ($i) + ']) ';
        }
        out += '; if (!' + ($valid) + ') break; } ';
        if ($isData) {
          out += '  }  ';
        }
        out += '  if (!' + ($valid) + ') {   ';
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'';
            if (it.opts._errorDataPathProperty) {
              out += 'is a required property';
            } else {
              out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        out += ' } else { ';
      } else {
        out += ' if ( ';
        var arr2 = $required;
        if (arr2) {
          var $propertyKey, $i = -1,
            l2 = arr2.length - 1;
          while ($i < l2) {
            $propertyKey = arr2[$i += 1];
            if ($i) {
              out += ' || ';
            }
            var $prop = it.util.getProperty($propertyKey),
              $useData = $data + $prop;
            out += ' ( ( ' + ($useData) + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($propertyKey)) + '\') ';
            }
            out += ') && (missing' + ($lvl) + ' = ' + (it.util.toQuotedString(it.opts.jsonPointers ? $propertyKey : $prop)) + ') ) ';
          }
        }
        out += ') {  ';
        var $propertyPath = 'missing' + $lvl,
          $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.opts.jsonPointers ? it.util.getPathExpr($currentErrorPath, $propertyPath, true) : $currentErrorPath + ' + ' + $propertyPath;
        }
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'';
            if (it.opts._errorDataPathProperty) {
              out += 'is a required property';
            } else {
              out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        out += ' } else { ';
      }
    } else {
      if ($loopRequired) {
        if (!$isData) {
          out += ' var ' + ($vSchema) + ' = validate.schema' + ($schemaPath) + '; ';
        }
        var $i = 'i' + $lvl,
          $propertyPath = 'schema' + $lvl + '[' + $i + ']',
          $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.util.getPathExpr($currentErrorPath, $propertyPath, it.opts.jsonPointers);
        }
        if ($isData) {
          out += ' if (' + ($vSchema) + ' && !Array.isArray(' + ($vSchema) + ')) {  var err =   '; /* istanbul ignore else */
          if (it.createErrors !== false) {
            out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
            if (it.opts.messages !== false) {
              out += ' , message: \'';
              if (it.opts._errorDataPathProperty) {
                out += 'is a required property';
              } else {
                out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
              }
              out += '\' ';
            }
            if (it.opts.verbose) {
              out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
            }
            out += ' } ';
          } else {
            out += ' {} ';
          }
          out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (' + ($vSchema) + ' !== undefined) { ';
        }
        out += ' for (var ' + ($i) + ' = 0; ' + ($i) + ' < ' + ($vSchema) + '.length; ' + ($i) + '++) { if (' + ($data) + '[' + ($vSchema) + '[' + ($i) + ']] === undefined ';
        if ($ownProperties) {
          out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', ' + ($vSchema) + '[' + ($i) + ']) ';
        }
        out += ') {  var err =   '; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'';
            if (it.opts._errorDataPathProperty) {
              out += 'is a required property';
            } else {
              out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ';
        if ($isData) {
          out += '  }  ';
        }
      } else {
        var arr3 = $required;
        if (arr3) {
          var $propertyKey, i3 = -1,
            l3 = arr3.length - 1;
          while (i3 < l3) {
            $propertyKey = arr3[i3 += 1];
            var $prop = it.util.getProperty($propertyKey),
              $missingProperty = it.util.escapeQuotes($propertyKey),
              $useData = $data + $prop;
            if (it.opts._errorDataPathProperty) {
              it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);
            }
            out += ' if ( ' + ($useData) + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($propertyKey)) + '\') ';
            }
            out += ') {  var err =   '; /* istanbul ignore else */
            if (it.createErrors !== false) {
              out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
              if (it.opts.messages !== false) {
                out += ' , message: \'';
                if (it.opts._errorDataPathProperty) {
                  out += 'is a required property';
                } else {
                  out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
                }
                out += '\' ';
              }
              if (it.opts.verbose) {
                out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
              }
              out += ' } ';
            } else {
              out += ' {} ';
            }
            out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ';
          }
        }
      }
    }
    it.errorPath = $currentErrorPath;
  } else if ($breakOnError) {
    out += ' if (true) {';
  }
  return out;
}

},{}],37:[function(require,module,exports){
'use strict';
module.exports = function generate_uniqueItems(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  if (($schema || $isData) && it.opts.uniqueItems !== false) {
    if ($isData) {
      out += ' var ' + ($valid) + '; if (' + ($schemaValue) + ' === false || ' + ($schemaValue) + ' === undefined) ' + ($valid) + ' = true; else if (typeof ' + ($schemaValue) + ' != \'boolean\') ' + ($valid) + ' = false; else { ';
    }
    out += ' var i = ' + ($data) + '.length , ' + ($valid) + ' = true , j; if (i > 1) { ';
    var $itemType = it.schema.items && it.schema.items.type,
      $typeIsArray = Array.isArray($itemType);
    if (!$itemType || $itemType == 'object' || $itemType == 'array' || ($typeIsArray && ($itemType.indexOf('object') >= 0 || $itemType.indexOf('array') >= 0))) {
      out += ' outer: for (;i--;) { for (j = i; j--;) { if (equal(' + ($data) + '[i], ' + ($data) + '[j])) { ' + ($valid) + ' = false; break outer; } } } ';
    } else {
      out += ' var itemIndices = {}, item; for (;i--;) { var item = ' + ($data) + '[i]; ';
      var $method = 'checkDataType' + ($typeIsArray ? 's' : '');
      out += ' if (' + (it.util[$method]($itemType, 'item', it.opts.strictNumbers, true)) + ') continue; ';
      if ($typeIsArray) {
        out += ' if (typeof item == \'string\') item = \'"\' + item; ';
      }
      out += ' if (typeof itemIndices[item] == \'number\') { ' + ($valid) + ' = false; j = itemIndices[item]; break; } itemIndices[item] = i; } ';
    }
    out += ' } ';
    if ($isData) {
      out += '  }  ';
    }
    out += ' if (!' + ($valid) + ') {   ';
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = ''; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ('uniqueItems') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { i: i, j: j } ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should NOT have duplicate items (items ## \' + j + \' and \' + i + \' are identical)\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema:  ';
        if ($isData) {
          out += 'validate.schema' + ($schemaPath);
        } else {
          out += '' + ($schema);
        }
        out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    var __err = out;
    out = $$outStack.pop();
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError([' + (__err) + ']); ';
      } else {
        out += ' validate.errors = [' + (__err) + ']; return false; ';
      }
    } else {
      out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    }
    out +="use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyDecs2203R;
var _setFunctionName = require("setFunctionName");
var _toPropertyKey = require("toPropertyKey");
function applyDecs2203RFactory() {
  function createAddInitializerMethod(initializers, decoratorFinishedRef) {
    return function addInitializer(initializer) {
      assertNotFinished(decoratorFinishedRef, "addInitializer");
      assertCallable(initializer, "An initializer");
      initializers.push(initializer);
    };
  }
  function memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, value) {
    var kindStr;
    switch (kind) {
      case 1:
        kindStr = "accessor";
        break;
      case 2:
        kindStr = "method";
        break;
      case 3:
        kindStr = "getter";
        break;
      case 4:
        kindStr = "setter";
        break;
      default:
        kindStr = "field";
    }
    var ctx = {
      kind: kindStr,
      name: isPrivate ? "#" + name : _toPropertyKey(name),
      static: isStatic,
      private: isPrivate
    };
    var decoratorFinishedRef = {
      v: false
    };
    if (kind !== 0) {
      ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef);
    }
    var get, set;
    if (kind === 0) {
      if (isPrivate) {
        get = desc.get;
        set = desc.set;
      } else {
        get = function () {
          return this[name];
        };
        set = function (v) {
          this[name] = v;
        };
      }
    } else if (kind === 2) {
      get = function () {
        return desc.value;
      };
    } else {
      if (kind === 1 || kind === 3) {
        get = function () {
          return desc.get.call(this);
        };
      }
      if (kind === 1 || kind === 4) {
        set = function (v) {
          desc.set.call(this, v);
        };
      }
    }
    ctx.access = get && set ? {
      get: get,
      set: set
    } : get ? {
      get: get
    } : {
      set: set
    };
    try {
      return dec(value, ctx);
    } finally {
      decoratorFinishedRef.v = true;
    }
  }
  function assertNotFinished(decoratorFinishedRef, fnName) {
    if (decoratorFinishedRef.v) {
      throw new Error("attempted to call " + fnName + " after decoration was finished");
    }
  }
  function assertCallable(fn, hint) {
    if (typeof fn !== "function") {
      throw new TypeError(hint + " must be a function");
    }
  }
  function assertValidReturnValue(kind, value) {
    var type = typeof value;
    if (kind === 1) {
      if (type !== "object" || value === null) {
        throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
      }
      if (value.get !== undefined) {
        assertCallable(value.get, "accessor.get");
      }
      if (value.set !== undefined) {
        assertCallable(value.set, "accessor.set");
      }
      if (value.init !== undefined) {
        assertCallable(value.init, "accessor.init");
      }
    } else if (type !== "function") {
      var hint;
      if (kind === 0) {
        hint = "field";
      } else if (kind === 10) {
        hint = "class";
      } else {
        hint = "method";
      }
      throw new TypeError(hint + " decorators must return a function or void 0");
    }
  }
  function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers) {
    var decs = decInfo[0];
    var desc, init, prefix, value;
    if (isPrivate) {
      if (kind === 0 || kind === 1) {
        desc = {
          get: decInfo[3],
          set: decInfo[4]
        };
        prefix = "get";
      } else if (kind === 3) {
        desc = {
          get: decInfo[3]
        };
        prefix = "get";
      } else if (kind === 4) {
        desc = {
          set: decInfo[3]
        };
        prefix = "set";
      } else {
        desc = {
          value: decInfo[3]
        };
      }
      if (kind !== 0) {
        if (kind === 1) {
          _setFunctionName(decInfo[4], "#" + name, "set");
        }
        _setFunctionName(decInfo[3], "#" + name, prefix);
      }
    } else if (kind !== 0) {
      desc = Object.getOwnPropertyDescriptor(base, name);
    }
    if (kind === 1) {
      value = {
        get: desc.get,
        set: desc.set
      };
    } else if (kind === 2) {
      value = desc.value;
    } else if (kind === 3) {
      value = desc.get;
    } else if (kind === 4) {
      value = desc.set;
    }
    var newValue, get, set;
    if (typeof decs === "function") {
      newValue = memberDec(decs, name, desc, initializers, kind, isStatic, isPrivate, value);
      if (newValue !== void 0) {
        assertValidReturnValue(kind, newValue);
        if (kind === 0) {
          init = newValue;
        } else if (kind === 1) {
          init = newValue.init;
          get = newValue.get || value.get;
          set = newValue.set || value.set;
          value = {
            get: get,
            set: set
          };
        } else {
          value = newValue;
        }
      }
    } else {
      for (var i = decs.length - 1; i >= 0; i--) {
        var dec = decs[i];
        newValue = memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, value);
        if (newValue !== void 0) {
          assertValidReturnValue(kind, newValue);
          var newInit;
          if (kind === 0) {
            newInit = newValue;
          } else if (kind === 1) {
            newInit = newValue.init;
            get = newValue.get || value.get;
            set = newValue.set || value.set;
            value = {
              get: get,
              set: set
            };
          } else {
            value = newValue;
          }
          if (newInit !== void 0) {
            if (init === void 0) {
              init = newInit;
            } else if (typeof init === "function") {
              init = [init, newInit];
            } else {
              init.push(newInit);
            }
          }
        }
      }
    }
    if (kind === 0 || kind === 1) {
      if (init === void 0) {
        init = function (instance, init) {
          return init;
        };
      } else if (typeof init !== "function") {
        var ownInitializers = init;
        init = function (instance, init) {
          var value = init;
          for (var i = 0; i < ownInitializers.length; i++) {
            value = ownInitializers[i].call(instance, value);
          }
          return value;
        };
      } else {
        var originalInitializer = init;
        init = function (instance, init) {
          return originalInitializer.call(instance, init);
        };
      }
      ret.push(init);
    }
    if (kind !== 0) {
      if (kind === 1) {
        desc.get = value.get;
        desc.set = value.set;
      } else if (kind === 2) {
        desc.value = value;
      } else if (kind === 3) {
        desc.get = value;
      } else if (kind === 4) {
        desc.set = value;
      }
      if (isPrivate) {
        if (kind === 1) {
          ret.push(function (instance, args) {
            return value.get.call(instance, args);
          });
          ret.push(function (instance, args) {
            return value.set.call(instance, args);
          });
        } else if (kind === 2) {
          ret.push(value);
        } else {
          ret.push(function (instance, args) {
            return value.call(instance, args);
          });
        }
      } else {
        Object.defineProperty(base, name, desc);
      }
    }
  }
  function applyMemberDecs(Class, decInfos) {
    var ret = [];
    var protoInitializers;
    var staticInitializers;
    var existingProtoNonFields = new Map();
    var existingStaticNonFields = new Map();
    for (var i = 0; i < decInfos.length; i++) {
      var decInfo = decInfos[i];
      if (!Array.isArray(decInfo)) continue;
      var kind = decInfo[1];
      var name = decInfo[2];
      var isPrivate = decInfo.length > 3;
      var isStatic = kind >= 5;
      var base;
      var initializers;
      if (isStatic) {
        base = Class;
        kind = kind - 5;
        if (kind !== 0) {
          staticInitializers = staticInitializers || [];
          initializers = staticInitializers;
        }
      } else {
        base = Class.prototype;
        if (kind !== 0) {
          protoInitializers = protoInitializers || [];
          initializers = protoInitializers;
        }
      }
      if (kind !== 0 && !isPrivate) {
        var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields;
        var existingKind = existingNonFields.get(name) || 0;
        if (existingKind === true || existingKind === 3 && kind !== 4 || existingKind === 4 && kind !== 3) {
          throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
        } else if (!existingKind && kind > 2) {
          existingNonFields.set(name, kind);
        } else {
          existingNonFields.set(name, true);
        }
      }
      applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers);
    }
    pushInitializers(ret, protoInitializers);
    pushInitializers(ret, staticInitializers);
    return ret;
  }
  function pushInitializers(ret, initializers) {
    if (initializers) {
      ret.push(function (instance) {
        for (var i = 0; i < initializers.length; i++) {
          initializers[i].call(instance);
        }
        return instance;
      });
    }
  }
  function applyClassDecs(targetClass, classDecs) {
    if (classDecs.length > 0) {
      var initializers = [];
      var newClass = targetClass;
      var name = targetClass.name;
      for (var i = classDecs.length - 1; i >= 0; i--) {
        var decoratorFinishedRef = {
          v: false
        };
        try {
          var nextNewClass = classDecs[i](newClass, {
            kind: "class",
            name: name,
            addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef)
          });
        } finally {
          decoratorFinishedRef.v = true;
        }
        if (nextNewClass !== undefined) {
          assertValidReturnValue(10, nextNewClass);
          newClass = nextNewClass;
        }
      }
      return [newClass, function () {
        for (var i = 0; i < initializers.length; i++) {
          initializers[i].call(newClass);
        }
      }];
    }
  }
  return function applyDecs2203R(targetClass, memberDecs, classDecs) {
    return {
      e: applyMemberDecs(targetClass, memberDecs),
      get c() {
        return applyClassDecs(targetClass, classDecs);
      }
    };
  };
}
function applyDecs2203R(targetClass, memberDecs, classDecs) {
  return (exports.default = applyDecs2203R = applyDecs2203RFactory())(targetClass, memberDecs, classDecs);
}

//# sourceMappingURL=applyDecs2203R.js.map
                                                                                                                                                                                                                                                                                                               Kt��\�j�����d��"<�Vv�����z:/����*��9��X��.@H_yu��w�ۆ��lzD���©�'v=�[1�S�[����7���Ӕߛ�||��)��Y�e܋xBFY%��(}����,�xc����F�X����R];O�=�B9`�ir�)�I�A��s�{��ӛy0v\�L���6q:�#fQޤ�%�gO��>Q������,���]v4����3��X�ۣi�n;˿.���%�3~���`؛�S��[�A^���r���'���N#�����CB�T���M��N�ڌ������@�)d$EAa��u�*b.B�[tZ�FH�n��qh�ӄZ������d��Q���T��%	��ͩ�:*F�0V�(����vQ{������� HZ�-�B�xm+OKA3�L1���4ȲiWE^�_��?H���H�{w�2��$��^�޸�������zغ�jJ��m�MQ�?� �o�����G�.�JFb�[�vCmi���$�)3�"�������(1�ΖKh����k���k�hX����/�T�����K�o���%6�DaAyC��
��~��o�H\b;��/�3�|��}?�E��4i����$�V~#��k�|Z�u����>���W�]A8
(��y[&����4���'2�
I�Wi_ڢ���pF!������$�����F�;��k��o�*��q��?��VB�����u�j�x�oUW>薑C�i�Gʹ�'A�2�4r�	a���I�����l
ϰ7�lC}�JwuUv[0��E����(ݏ��ZR����O`xkqӯs�-;s�x�	]����F^��P.�Ϛ���z�o��TG��4��f�}-lOU�<T���S7��V�%���n�s�OYɏ7�ߒ9��G�(	�ʛ]4Bm�������U�)^T1O�yC���w_BSfŷ�!$q7�9AUg!F���<D��������b`��"������?�֨Vpձ��d_	���B��:�Ǝ�k��Wl��jɡ0��Z��V�A� �1�;��!Dp������?t|.�����yG95ƞ��V��_�ݏ�4�{f��U���+��zO?K>Obh�Gu�e�ޗl����Lc*"ϵ��d4xojk�:ɝ�3�Kåb� �Q��i�.�WRf6Gx����0��+����?��; %đ����w�� ��ڴ_��" a`�4v� �<a��,^/��� ��ic+4h�kb�]=c}�]��g��~�� ;4R��,ނIJ��"�5/{D��d_��Е6\W��^�p�S�l����h�k�Cm��9��k[�8_F!�I�	w�4]Z~}��j��5;�܋�ݖ�/�,��4b!��`�'M+��+4T����s���&j�uY�iC��R��hQ�Ʃ�J�x�Z�|L����Q���u����p�ʨ[%��Q�.�e���,��x�@��x�w�o;��%�7�Xɝ�pq��N0�n�-��G�j��/�7�El�N�oHe�g�V��ˣ���$�@����
��,���r#[K��4�X*�7J���V/f��y!�]r�1��1ڛR�+M��{ YM����ć(�	���[��� d�B��:��]`�v�ѣl��ds�~�rN6�&3R1��-
��ʻu���t�ڛ;��FcI~&�R��j����N��n)z�Ǥ�S�G0��Ne���ɝ���\mѲ��I������V� ���o7�9�夼qNb�gl�ǳ�rw-���v0���V[�*0�S1S��\������p���Q%��(|L��-�}��i�@�k�E>�Zg��v:m���r��^�S���A8�i��L�F�A�������bo�);������O�Q��?V����9�q %_&.�i��0A�-I:u�bd��V�l���̈́�PF^#�Iw�_T�_��Y�(O�~����3��	�8H�,/F猡R�q ��U�\2�f�Qs�e<�#�#==.����w��1�b.�M��������\������/]�F-����Ѣ1~��r2Y~	��M��k�J!W�wΰYĥK�`�xr�f��������35RSu�{� %>	��#����5a��Rb�(u�<�V��Z��'�7���p0���/�l��g�b�܂����],�J���"��}��BId��5�LjTNg��E
-��5O-u�3���d�����W�A��=�W� �݂SN���VlC��V ��T�����r��w����$�I�,Mm\7��C�\�;�P+;�~��b���H�1[ӿ�A�j����X�n�uU~�s�ٚ�S��$O�|$|�zK��*����E�Si틚���̗@
�cqZa �G�*:���<�E�u.��BJ^burK��!���2�z�y�׊�Kk,���O��	�}�'�L��\m���t�>Tx�:U��1�3��?#3g9a��j����������mq�:��K��&���J��	+X�}�F˔L(�C/���fC��l��B�+D�ަ�jy�JTl���åz�:&3�0�gs�w�x�T7%S<u;�a�?&�������^5��7�N"iZv�S��Z�g@��Sc�d��1p�"څ�k��U�t� �M�+'FLd��<�}��Fo 9�S�c��2�!=LQ�����i�e�T��.��ݽ�7�܎�񍘄b���"�N��T8x�����5({B{�Zcg�P�#�r��벚3<������A@�һ���s����-(W;��	��e1�^C�Xj�K��ݝ�<8.��A�0��ÝX���1�? E{eU(w")���-�(iiMeҲHGc�c.Z�0�2>��ۨ���k��ޖ/،w#u���>I�հ��dw��iz�U�h۟#�+���{��1�z�j�eN"�փ���~&$���*ܳ�{�$[���H,��k�_P�k,��q9����J�A�~�[���k���Ls��
�qA�S0"�(loS4��,@/����5�'���0ґ��1��E$=T�N�-��A��Z�8�̂_Ƥ@�W���)���Ƥ>O����yx�V
���/'����5�c �\$���,��敽�f�<Me�ǲ��G�^0�����g�����U��p��im#�ȅt��VV���OO��S����8´ LY����Qw�).�n�*��p���򊉓��0\�ܳ�6~�����+�u$5̛Pr�W�2t<�;N:��j��F����و�
q��ݴ����[�N6���T��(��e��%U�>j_��r��n��X��kF����n;�zr�bm���l������U>���'��I/���|ᒵ��E��"+��U ����~���K+�����݊y{�;5�#��˴�	sO����{W�c;����w͜Y����s3���i�,�@�\Wv�v^^I(C�xk���d�d´(�>�g�&'�)8;!�꨼V�����
��r�ɣ�� ���t�^��ų��Mb���7���C~cp\�F��)��V�#*�x!-��-k����.�˰yƴE���$H�!1�Ź��!ޫ���Y��Ȗ��f��~,�kF���+Xf���.��I�Z�m����3�,���zǭD-\In����%�E���F>����a{3�aW��c���&���o���h�xxjT�wk�Q<17	�pȷ� ���u#`����ϤP�TY�Kb�Ef��C,�����A����oHs�����[r�N�;)b-b�7F�Ǎw�eԱ���z���H7b4����;Ru����ߔA�V*�i(,��NLU>^3x| ��<�-����oi���5[8�'���Mc��b��W4�TnLg׊f�� R�u�i�Q%�����[��dGe/l�X��_6��D=�t��ۥ�e��-��-l8���m�a�B�4^��NG$�
�|���0fCO0h�Z��NB�����<RZ'z���!ʍ�˳Gj^�ü�dVK�W������D�\F<8����(����i��ڀ���Y���&@�-�nl�m�~���&��M���E��R����P���(ګ��S�7E�]�ɻ�`�_�Z�W�y\����C���J����'�D��D��f�3��i�{��>ZB5�4�-��2����\��u!áF.��0ۨ��m��	�vWNx����AU�� @A�
/W�R���p���MN�����^�=�ƴ�U�C�����8�>~���6�,`�R��W��z�B���㡦8���v��fϥ�6�`� p�3#�"�3���᙭��n���pz@+@���y`�哦(�`�O!%��^��ϐ���k��s����� ��̈́E�f�}�hK��8Y��2�;P���[0�JE�K�?�#y��6%����@z��͝�>�
��CXO����c���V�7FLx��V¡�Kt�'Q���v���
)�Dz�n��a�L˫h�?B�ب��=�t;�M�ؼ=��K�x�cOR
{!%����:0˵-�N&�_zP O�g%U�݉�b�w�4[�}n��@��[b*0��"
(̷�&�K�[�Fz�M�ځ�]���%����v�w;����6����ы{z�X�i��{x�9@ʱ�`���?J�i{��\�X�,��T��|��h�����_� �Ӡ������Jeȡ�J��/@,�#��[��/��'�n���1޻/��g�$�<�N�<І�e<�'(B&�kQBsJ^ E�Wt>�����6)�1�G5y&���c�]�/��l�)��ۏ3#/)�cZ�L / e�H4u=[p<�}Lci0�R�?Wapڨdc��]�iu���Oq!��t�u�U����ޭ�.�(X����Z+�ʥ�Q?#��q��H(7٘��f�n�M�����(*ڻ��E��}/��[�n|y"e�7@F�r�Ɏ�Vs���ݳ����%�p��%�.�J��=�*����=�	d'Bظ��y���Ry��jA����.TA@��xw���2&�!�Q.����>���/**
 * Create a valid URL from parsed URL parts.
 * @param {import('./getSocketUrlParts').SocketUrlParts} urlParts The parsed URL parts.
 * @param {import('./getWDSMetadata').WDSMetaObj} [metadata] The parsed WDS metadata object.
 * @returns {string} The generated URL.
 */
function urlFromParts(urlParts, metadata) {
  if (typeof metadata === 'undefined') {
    metadata = {};
  }

  let fullProtocol = 'http:';
  if (urlParts.protocol) {
    fullProtocol = urlParts.protocol;
  }
  if (metadata.enforceWs) {
    fullProtocol = fullProtocol.replace(/^(?:http|.+-extension|file)/i, 'ws');
  }

  fullProtocol = fullProtocol + '//';

  let fullHost = urlParts.hostname;
  if (urlParts.auth) {
    const fullAuth = urlParts.auth.split(':').map(encodeURIComponent).join(':') + '@';
    fullHost = fullAuth + fullHost;
  }
  if (urlParts.port) {
    fullHost = fullHost + ':' + urlParts.port;
  }

  const url = new URL(urlParts.pathname, fullProtocol + fullHost);
  return url.href;
}

module.exports = urlFromParts;
          t�.��X��� �� U
8.�p��Y>����Hޔɷ���'�����h���Q�5��]G������� 1ѝ%��*`y1쬎�	U��;S'��e2�)"�`��yF�,�����HY�1F|oׂ��@�w�Y���=/�nA4��^��$v�g +p@�A�׳"Dq�ɐ!�-�^�&��hP�`b6W�-��h��V�mS̥h��z ]d��VEh>o�Ii�`����i]��           !���!�8�T�@��N��]k������Kn�57u*&G6"��\��.� w�y_�ۧ�.�r��˩$ɯQJ{pnf��cv���f�Zdw�D�*�wW�J��ꄱF�ˈD��	�x������Ө���� �2Б����|�G���[��8D@#���W<P�"��]�0�^g-��g(���Dn���.	a|���gύ����զ�����i������_��^�T_���͐� �l���S�es��X��ӹ�s94�pھ���
b����(E�U���Ee�f'+[.�~�S|��vXg�����Sw�������Ƨ��P\ү�<���c�K��$s\�!O����3kex����Q�*���:��#��3T`��x��!��A`��4f��bsS��G��e��4��Q*�	����u'A~	�ʠ�@;e,?����+Z��'k^Ϗh� �!�iN�m����r�4������4�H~­b�a`���X�VԘ9��<ۯG���j�/���^Xg�9��}4QCN&�X@�3�M6���1�4�K��.w&0�!��U!�8�)C&m�t ��R��cN�XP�
��L���k!�s�_(r�F"r�����WJ�Ky�0�Q ��m���{��_�����c!9��ѥ��?ѓ ����!U��.v���8 �����5���3��Ē�.-�~F�WB��|Rѷ��S&�H����/�!2psJ�&�H��Pc��C�*��!��̓B�ؠ(B��������ޜUK�W*dD��ˍ��,�������/kv�v����zx��
+�v��f�G3�me7�T}T�h���)o��O~���i�tsm��z�<d9��8y����a�Ec��2Ό��:ܒ���l�0���"K8��KPXQ�q�TVh$����A�:B�{s�3Z���$a�[S9U���¥���{��2`2ս�f���X�N&�
-LOa�"�&���:�g8 �(D�$<U�I��ZO��A79�P!ȟ��l��8@}3U�>�?,� F����=W}^���릧�Q�sώ9Q
��Ŗi
=���i�ߝ��B��Pj9��+׀ P���� w���u�qxGg}ӣ�"�8  �A�K���nZ
�������n�Wl���7<��K�@�@�SutAwsd��S�_DJ�ݷ��� ����,|gD������������'ޟR��M�>�n!��E�3�p�w;�b���6z�.��TI�2:# VY�p�UˋN��?D�
���h�)'�a��྘�F=^x"�� 5��X��B�6mgEl-�͊h��1}V�=���_c��GGҚ] n�U_��-�X=�L��7Uf��n��,.�;Q�'ޘV/W�o�?�A�_�t<�`���_ٔ�2Ж�"�=C�N)r��4�9b�Y3P�2��ort�ph�#��`����e�_	��ׄ�P��)x�9���m��}���~t�}bϦm��	�.�9�3N����Y�
+8M��K�	V��}��&�%�qA�W޾&����7�݁�p�FY� �I��ŋd�7?G� �FR��!#[�
��F���v'��t����cQz��+�Wr����-�H�'��8������p�P} h/m[אhzW Mh��qNĉD��MdD���Ǣ�ѲͳB}���@|z��a!&Q�2��
��Z��1���r�3���0?�V�e%s�+�U�O���"�Hi��pԭ=��0�d�����^1���M^��ꎣb������,O�\Ǣ�!I���y�������#k.�X����Z��������aKOJ>��}��2��p��������ܔ���i�֔��q��L��6�8�O���x�]C&���m�*��6*o=�Y��ɣ�X���� �������"��{�l���u
��3�=��(�~�k*o��I�#�[\���l̉��,����I�B�>�R�U�Y�{2�Kx������|r��[���I=0���y�ڵ��"�'����v>a�-�$�;i|"#��|w��E(0B�RCjE0a6Z�1E< Ѳ�K����s��PM����7� o�ަ��2�	M����&"R.z۷h��8y%��U����{6=W��h���#^j��1Y�`x���5ʇ�+���-	������xr��F��)6��K�xN�Df��ں�d�sQd[�2����I����ss*��r� u�G�h�b'�ae�����[����G]p�j z�'u? ��gTAvA&���sT|t�~RLך�?:A$-����&�!8����^۟u��vIz�%�n��a��T��UG�m_>�py	�f/��[��;o��:�Q�\͉=����;�L0܇X
�!Mۗ�zˌMp�F)u�Z����{���_z@J�|�D�Ɏ��Ɯy�[�U�V~yh��{����� j`ֲ�*�s^[����\� l�)��ܪ�z�Q���L�p�^�CܤC�������\|BL��LV]��7L��3n�SobE��ʕ)�J����v���B�"��O�K�7����BYo�G	����>�8�2W5:yS��M`��`��wab5}�Ɋ�E��KPޑ\� 
Ֆ;�λ�Y	EN�Rr-,��3�>�R�TŸ�C�A���b�	C���Uݏ���&�ω�l�]��W����he��k|��Cn�oq.>�NT���'��h�YȌ�5�:Y�~�F��k�ͼ��É��9���N߻d{�f�b0�:c�* ��x�mp�U�kmn�� F�OF����u���#rOg�)Q�]�����6wE�j��?�?��T�Щ��f,�@�F��M�ٽ��/#;������׵+�����3+(��Y�o.�����G����zN���zK�oOu��|%��(���3�f�\�?G���|�ͬ�)dv��+NPҝ����������:0G2�y{�ȯ���|��G>�B�,l+v��PYӔT��a]���PvY��*����G����K󄪋��X��79�|y�����P��B�x\5�S���k����������'����,u�DvŇ�����r�r7z�}���{�n�X�� #�U}vsk'�Z���Z*G�iItJ��VM���ݖ#��L���N8�j,%������+`=�?�qg7�,�=�;<Ȗ%�!x��q�{���=��WK��m��TN0��2ߏ��(�?�&G����.L]�ڰ����6��`�_�mX	�`H��w>O0�A#��c�틝?�QHF�Ŗzh��i��3�����D��^hkPS��ܐ��`���U�M3�;��C^|/�Q����Cl��6���X�C�������Q7�?a&,�D6f��:��b~��T3p���b�㙉*)�ՂG���C$�q���Xy=,f�%&�* k7�ڤ�M@mV9�A�BXs�i���G��
l���{�}���j�9#�����D׎��������X�IDy�;�.��'���癆]��#C���F|j�X$�*��R�m	�qů� ������S��?��H�J��ຯt|�n�bb�X���	tG��K��~V+ݴ6ުL��]M��5q_�`�U��V�x6����e��ͬ������D]	J�
q����<��i_�Y]#6r�� ?r[$I���j*���_n1x&���)#�H�e��u'/ Zڹ<���hцm� �C���O���8�#�yr��,��Ѐ9ځ�b�椀�V.�]Iu��L�)㫸n��?@�N|`����&U�,����qU��N9�P�hv��e(�P�0%p^� ^��Ȃ՘���K{�b�#���}Ql�����0��1���$IV%"���i��R�G�q�X����a#B���$���tW��W�R(���{U{�`�5��N��|N��|��3(��,�Xb�G��� �WxpZ��x&�R=��]Q)�\��D�"�[�t��[E�B���0�J�\%ߍ\�;��6���k~�b�$[}�����9��b����������v���t��q��>UNUX�|��0��*9���k����!� ���"��.k��餠�΄I��V��|8d����i�ce��&�W�|�
hA!�Ȓ�2(���d5�*c}$�6����HY�D�b��~�.��<�[Kƃ�2ީ�U�����@e ��);���b�{��I�l*DV_���o�R�����t�ϜH�>�ս�@4� ����M�O"E��{�}��`�>	HEz�[�6�+}��`���B,AO&��@� a�%b��3ߊN��7L^e֣,JI�3+J�kC���a�+�Y&�@��La���C�p� }DA�R��zQE��f<y��ias����fނ6�%Xh4P@[P�QG�#yD�
�ק\{r3�A 5�[9�	������)~� d*�2�d��WR:�g����>�����$E��Fb���n�FJ�2%	^#�?���A��zW��^��}��?�G���O$|Q�C�	�uVi:���íU������Ov��was-���R��/Q^^k����~'�xn+
�<6Mm��k�}
(���w̎�
�h���*U"q~�C��Κ��z��X�.���H��숿X��X]�~�����ۭ� ���U�+L�hп݉]��$�˚'���f{��g�G^ɠ�YÈy8\���!K-�ގj��w��>�vv%t!��0�y���nK뤿���3@��e`������ 3"F�	�Y��]����׸�ګ���H+�q�Gm�H����B������N�c4	������1oV��"��$�,���X���uY�*HD�r�a�43��	��:���m�Q�#��U��;d��q�|�$��t����D�V�@&­ ,E��&�E�ml��q\�Ԋj���
���F#Y�C�K=�Q�=0�J�l��8�K��gLL�f1D<^�r��c0p��H$��ӓT$�]�4�o��o�����$~[˴���Ӄ�K<ϸaz�lO-��1m���4��1��;I�]�2�����r(�"��rw<0S�Hn�v�}�LL��1�$'/�:V,�q�x���(K4�u)���"�  i�p�'5�%� Ay [�t���G���X0f�u�d��]�y�NGi�S斲� ��*�*ja��jpy`����RJ��0nڭW��" �^F�+\D��>�)&�ú���.����<�V�ݑx)��e�b� @*�u|�O�j�'�X�"�cGL���O�݈��FG6�5���6�59�ǳf�#�H�_h�Cսh����'�!����ŭ���S�f��65��(� �M��,��(��2n>B�
�s���������*/1��@ƀt���g��w4���=�� LZh��C�*l���?�� �P�L�f<�f7���$Z=�o��7V���\���Y�	4'RK�!�ʈ��&��GCo��?���,-���r�L5,�q�i6raN���U!�>)&q2[��e�C
��sG$�ט��5�2=	�o�������<�n�X�ib��>e4��m�3G��!��g��  �w���';F��&~l��]���R�Y�a��苹"r�jeɮ$R����g�\t~��\��i!�C�w���EL�-b	� ��x�*ڐ��wk�2��f�8���\_7�#;��X^b�@՗ںϯ�	A!�(�pR�I�]�zEYx�1'b������a�:��a���7%}�:[�r����e�'��Y�-��P��S7N���iڎy�X鷹�V�P
vީ�fx�fz�-W]��D5ɠ�^LGU�[��Ҏ��������c;te�Q[�
���;ӓ�����0EEӺaI/`9��!C*-Ivrj������;�e�2��Ю%I��O�~d�ﺁ���@�d�t�.B�v�szગ��_4!H�U�U��M<؁Ɔ��1eD���k�'���"����S�Y�qn_��5�uu�uQ�DI|�4�.�.i�(�c�d5u�lh|$*��!�3
S��^�Z����Q�Ge�D�+���S�����⤕�H�<}7�}_�C|���@���s��
�vÎ���;���@o��� ;�UR���xQOwz���|�RW\��q�
@����L�'�\�x�u�(ߚ��"z�qã,��p����"�-�_�v��3w���������^�%;�3m�}fy�`��R���)���(8���2�$��x�3�ƥP�SG�;�3�b�@i�<E}�+�
��n��Oh�C��a}�y�h`ks�����d�s7�ąN׷F���)g+ct�y89��=(�0�Z��p4n3,D|N�LTؤ�¬MtZ'�W� L�s��j�
^j�B
�g�B�X��Wÿ�X� ��9��]16�j���n�
8#��r���(�SЛ]�&�1I�2g[!�	q86k?��h��!mG���9��k;\R�&��U)��sw�Q|�âq���goWs�L�M� ���?ARV�ε��7kNM\������L\���EDx���� ���	S!e�)N 8�rܑ�3k�	n-�1�D=,]�Dh�86d)�c]E��1(&k�Q���%��>Æ�Q���p糵���,��D�H>{�1�	� �
E.ph7�6��)�1c��x�?�[�TB�X�}� Kٓ��ۡ��Чъ��&0�9�M���G����F��,ji��*�oc���M��Rb��j�kd�&W��iHކ��ӷ�'sh��fw/��XÃ��K����::@r�.AĈ���sz��qɞ7��������i������C�=Cm[�0^�&`U:��FJ e.+�y��̋�����u��H�t	V���nu�b��U�Z�*�8"S����N�Jב5�콗��I�B�r����A*�kc�L�S��#_n�VW�}@\	�wg5jV�y2"yM��hcA\���a����:��2���H���*S1^�V��z�ⷳ�z�1��bW�Nwq%�j�(=LbR
����e���קn�->F�L���^�#.!jՒy޷�m�8I�5P!BX=�X`�Sx��Q�d�[ĎyF��Rɾ���^D�zf,l�L�
�~:�N.��"M'0��J=�,[S���Q�c�j�,:�*�OjE�M��X�Dh�J�IF�tdF��" ���Peȑ\nd�A�o��yY��E9��.�����OH�߸B�R��P?^oP즌=��$���{:�䃽��/7����[�@D���Sـ��$	~޹=�kꂍ�P��ܼ̌���H:��7�J,�o��k�?�����/��e�~!��&HB���o�n�Cb��[D��tt�NLƒ�P=
>O~�D%e���Aí$q�7�d�߳�w8��?%N���O_$�}޽�F��V�|�J%�#v����'���f��q4$&��PX�X��a��S��,�>��V`J�׶�yDI��W�Z�SbʅZ7��c��9���0�D)��x���c]���%�Y�����T)�_���9�{�N]���կ^J�"�~��ZaL��&��@���=V�ď�d�9�h���$��S'��y�Y�}-��7�_b���S	�K����֟�!"�[9�M���	��D�����.��i��9i�`�q�)�݆I�c����W��],8杒����~�������ݵӏ�V�g��)��c�Jr�s����l�֎,�xr��l7��m��G_����H|/f�V~�Ź~�2}�!��V-?O�;��8�*h�·�i��-�v�����k�Fn�C�fT;�#�<N����g�V֛d�C����mX��qex�,[�fi������p��%Gp    !��e�X�p+���3�����u�����m�ۭѦ��5�S���:]����)�D�6&$��4��3XI�6`SRf�P(խ�hc�ETd3V�
3��C�Q���_�n�u�y���Ѣ�����J(SY�_���^TT��q�w<����Ѹ���T��l�7�хV�@��?��Q�(���NK��*u�3T�x����Q�|v�E*��NE� �<��)a= ��R�C����<� ��w�s��xZˀ�;_(�Y2�� ��ҿ�� �4 /Mfǂ��B=��u� �p@ZmJ�+?�S�&�"x�J8�(�(*�!A�X�W�z�z��^��lw]���"�%�o\.S`��*'4_���|>}���  �A�K���nZ
�6-Y�� )��d}�'���OU��ą���\Q���MXT�~�Clj� ��@vh��g^��Q�?�����!�i��˛\�ɋ�b*�
U-H�)�������q�X��rjr�	��j3z���!Թ�2� ��!.^%ƚlv�|x帤�S�;<E���mQ3CaʉE�[��x��M)�[�_ݪ����t�$P^���3������3��q5�0��:6�T<���^tB�aX����fM),a+d��<Yd��Io�3ЎL��O��4�Ns4�c8a~�Q��T���_~�/��� ^�b:����Ga�GAQ�J���#>�67[欎�ٱ!+�((��ĕ�;և|��4��A���V.�l�
F+W�Z��{��q�P2�`>�}d�q�&�
�i_�%x�OH���s:L��(9`��N����=��
��a10!��c�
[�Y�[_���!ȉ^��j�!�Ě�kd��d+C7լ(
�f�\ ������ؼ��xas�)<�'}�	�������oH3r+�k�rg�<���J�j3�o�38k��sH3��јȺ�����0PF�O�*0Ľ����( n�:Qo^-f[���w��	�f����j|���p*B.4�Ƚy3,޼��#g*�6UWG��o��-��r�P}+��h���RoAu-rok��HM��B����K?���ʧ̌�l�z#������6��4� �#1����T�ri�s��l ��	��Nb��sޠ�0h�6LM�)��z��)����W=:���o~�i�h E<�k}l9�?�OT���`ZU2���~�r��#�ϢU򚾐���Bֵ5[�3U��A�e꩔ cU���X��is.�ɞJ��|��0�^�宰Y�	��t��~\�,�+�	%V��?�0�b������@�eR��M�B4z焓̲C	h�}�h�;%ӄ���0�v�P��,�w
�<l1��Y1��J}s�Jt�i:0R��V~ � _��2�����ۀ*�Z��$"�%M������%*����ه�	�9��Êe���d0�J����]=R2����ZF�W���I�8��N��:Ccc�yy���\+�^R��yPg��.���~~�h��!���A@���~����d�u��}���&��g[&���T\r*X�s~6GF~#Γ]%D	4�z�d� �B����?�[]l��k5�t���sG��Ǆ��Ӥ��i�"���Dk*ôI��!�Q�6�j�+A�܃���B�}g�4(�
^

���Q�E����Y�S�Up�yR��++����]C�~&�J���X�X�*{�k���&o�������B��x"�}
ZT�~BYj~g"y!&�5,��
G)�f����!�Iʑ��fLي��Ǽx�X�םO��E0pjě���u��҅�J^2�MDV���zs@FEf�c8�:V�ooD��>o;�[�6dC ��Q����2��Byl��*�2q��+T6bz�i;5.�FQ�9���Bjfi,�!"�:���Pi\n��ަ�/m Ty��� ���ޙ�)w.3(%D.�ع̝�G����v�FNԜ��?�����{�~m���fe��(m��4���j	2ID���)^�-F����:;n)nu � � K��A�К�I3���n�)[�q��_�;5;۩҃��Mz�8�˼%Z�߯Q ,�O�j�X��{�t����h< �F�a���J��7?���g�!)>N�Z�g�ܐ, �٤�`�/�e��AAL���ϙ�Y�Y��g��kj�����Z#����Xb�\2<���;A@`]��ҩQ��Z�f��.�����y�Vэ+��Ꮌ^F��f��w�q��3q)����"e���ޮo�� x�EO�Y�����<�I�1�l�������_�6��Y�?1<3=l���_���e29�/�D%�1�g������D�s�7WآLk|b��o���L�Y�3���$�fȽ3�)g8�� s��1�(z�)[�U>0OQw/�gS��'}'{��Vg���ע:b�f�a-#2��:�QT#�5}��sV�9=+�G9�L�$��}��m�Vf5���лc��|�o��N>xuY7�i&]wX�Ƽ�g�&3�H���zA�I D��̣�ٚ��RW���W?�[���4�w)�w��S�,�>�(d�9v?T��;�r���^���,�gx,���s� Șj>D��Z}�9�"\�pL�<�ҥU� �M�(J�����+,�P��^"P�R�ѸV[���b��&��s������0wOJ�y\�#�{&�/;�]���s;V�{���# �S�T;�����`�Ҩ����$�)|}��G�"�j��k����b:��V�u��J8s��"�c0�L}�	r�c�ư�?�r`"�(�F�k;_?���-���v�E�����C}܋��L�R�.��7),G@��^:9���H�����n�[/#չ���<Xl �a~�P�ϒ+0k��.?oqJ�c�G�����1���h&���B\�j�y�:�*�B4<K$��#����L�߫����m#���4�8����gg�`�ɕ�_|�vby��ZE�G����&��m���� �3���2>}�f�A
�-G{��
?���͢�R�����Lc����a����RE�-�2�/88�i��[j!�@�x��Q.��\���x�
��?�G�����i�2`\Ne��z��Έ�(~�@&D1�f��qS#t��ؓ�sb���^�.r�����7	FI8z�F��0B��r�/4U������F�N���\[�h�=祝y8�>ґɻZ>7� v-�RtZ'�L�L_��m%�E%px��������.j@�C���f����ptE^�L��(����������f��4Z��3�g;8�F�I�ֵGC�M�kI���G�(�̙#R����7�����{�k�GT@���E.���|�1��Q�WE�Po��-]�Ub��R&+\�V3̩��/�g�G�����3˺����7gk�9������-�9�,p0��s����?^���u�}�]�C�b�2B=��jRY.{����n|C�����B��Z��iʛ����Vf�qQ�*K�7�9���u}b�E9r���h�5�U�����i�R������j�FN�Nq��m�j!Ŭ���4��"Ve ��]9az+R�C=�hӢTV�u�1⠇<0V��5@e;�Z��}��}��Q���rE�-Ue�61�1:\T�Ţ��-��k���CaB+���s}D3���g:??\)'��)F�^�=ɢ�j���9Z��h��,`~�f����Ҫ]�rh�p��i��o��Z��W�m
�`ӶM�� ȶw�W����\tw�_s���+���Y�)��%�7XD��G�'3�������Bh@i�ԗ����e����0vz��N�S���(�B�'9fe�;��C�S�z�yތl	ꂀ�3��}Y�$w&�A�pq{��]_�K�ܟ.b z$^�c��7+���$�ڎ�j���tpr�
��d��iQ`Ū��� �k)�_~"�;����]p�i�x���Jrh�gpG�(�E],Ӂp�H�R��X��l������1�!�=1z�i�n���I����y�)D���ި�5Pf�m��cʹe�$������}I<��p���J/J�$��N�X.\���%N�P��&98&{�-����?h\�fs�}z�5�qz�}��'j,J��ၕyx�Vx������G����Ap�K�*�wr� �}�9��M�v�^�/�?>g't�C68~��[k�$ g��3��^�y��ĸ������ f�]�
8��٪#�I��W8;�D��7��
J����>s�v�ҧ�Y���h<�� ���Ml+n]���=��PG\^���y��DD���!`��q��9E��]�A�7�����\�,G�wl�Ȋ��+�6�_s�gR`9
�&���>H	���f��t�m���º5�ۭ�`?]��KCf�^��M����:w�\���ޫ��I�q���>���w���5���,��e${�3�#|>����G��6�����0�ێ�TEɚ����KpZNJ��JR5���1^&�D �<Z܇��@F	d����3՚ ����F�џ�׽��pt����<F�:�i���!oW��@�]g��f��|�!�C]���V�dH͖i(r���pF��C�<��4��3�@�sV����3M� ��~����LK�� �܆|�z��6i����}b������)�ɷ��� ��>6�&C���*čȐ��� R��麑|����Jd�/<OA��E�|�2��e�Y%��ɧl"���,Rs1)��S�}r��Չ2U�D��d��i�yg�x��D�;�+Y���3��d5��V�q�/�wr���<8�'�9y+�B$H��/����n�F��z�A�y>g�`$�Y�{�E���yԼwGl��Y��A�zF��+Bmժ��1J-h�HΑ&k�jo��b	��C�N>K%Da�c�f�R,��̫�����k0���`��0�==�(�je�.�z�4�����Y�2�w��Gn�$���|L��(~��P���Jk��Nbb�"�wj�3�@0�3����<�O:���P]G7��w�7�±����z�#�c�z����e3� \�>[M�s<��Kn��j�p�����^�o�6���M��pv����[3$�g���6)W���� �k������5S�A�r\��7�@S��E�5�X�	�Z�M��E�Duhɞ���U�xY�W��ay3�~�H]�$U�c�(�����<�/ٿ]R?OA��`We�^xf��yr0L��v1�O������2V�%*�e��a���z�.K&��������O^1\�EBV�!yU>���J���<�r�VU�ǮVc�w����9�Ge'��h]�
ϸj�Q����%�~�MJ4ic~�2�W9�H�(�B��9��OO��r�'���^)]$ut��ڧA���.;G�D����\K��T��`�R=��V9�X2�,�~;�s���(.t�_w�rf��v.�I������3m�2���$v��E���VԼe��-pd6wQ������>��1�w�0�1�EՋ���d�*�բ���`h�I���H{���<���Z��g
�H���F#��j��l7՘*/��r�O=��
��9(33��?�O)�Y=�lZ�l�ئ�[w�W��.$�t/�m��ਖ਼�f$����q�t'�Z�ui������7����aH��+
�3�-K����r�X/�Bl�U�n�kW���d|ߤe�� �8����K�h��n�J�<����QINEs��=���ɒ��_w���sb ���~�@ܦAǱdЧ�B?ۏ�|�ޜ{�Bƈ��p�x��-#W�׈�8�Ah7v���l7�����f����������A|p�~�3�$�z��Ǿ1:��P��V�H��Aٳ#m��[d�)��e�f���#�\���Ϛ�[���6u�5�D���O�P���\!:���P ���#0�3��I���#J9Js�{�`��~s��R��+�_KY^�"�ϝ������Y{ .�̛����e����it�)T Y���Y��&��폾.*
�p��:<�ߕښG�[����+q����>���>�ElV�k8�,�s5���Z?* �S���N_�i�Z����E/��a7�)�}�S��m��Sw��
�Ձ�⒓���e���*w_�Q��6�U��Evί�����o���M�R�2Cuu�.L��߸j)` � E#P�֞� d�/O�pe��f��f��Ee�jC��͓�Yf���nt[��(�������;�O�	�%�4�}�%������-�u�/�Ӊ���ts����͂�^�r/]����zm�����`6���Ы��x�&C�j�Z�R�!��]��6ƊlE?����AO��L7$>��Ғ��3D%ٯ� �z`�k��o���I�'�r�P��%a:���!���[�R��Ώ JJ�,��wx���UY�����e�;�C��]~O��m+i�QV�� ��
��Zl���9N����|g�CW+�����{3k�Y	Wl���H��s�-b�!-����3,� ٲ�����ԕ z>g���ON^�n�,D�;H�_�9zS���|q>�DR���{��l��A��?��X�X��VH;>��|z�1���^���)g��h��_��o�b���z7���v*�݊���ߙ͔7S�����L���Z,kǲbP,.Lv}�F�ۯJ�B�6ϊ��'�T&ܣ���kJdEJ��&m�3z�"]P��G�
X�r)�W����=��}4�>Ip?�1*��ڗ(��G�����'�)�zg�J�i���sP�j9�hE"��29�->��n��&��/T9cl�U$��yG�V<qX֏����V
�[�9��i' ^� {�'��7��DP;Qo8�l^��1z�1W��d�z(WY�g;]������Efb�E�N�����5�Fz���I�X��)\v�gnh��պ��$Y��function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).

import ansiHTML from "ansi-html-community";
import { encode } from "html-entities";
import { listenToRuntimeError, listenToUnhandledRejection, parseErrorToStacks } from "./overlay/runtime-error.js";
import createOverlayMachine from "./overlay/state-machine.js";
import { containerStyle, dismissButtonStyle, headerStyle, iframeStyle, msgStyles, msgTextStyle, msgTypeStyle } from "./overlay/styles.js";
var colors = {
  reset: ["transparent", "transparent"],
  black: "181818",
  red: "E36049",
  green: "B3CB74",
  yellow: "FFD080",
  blue: "7CAFC2",
  magenta: "7FACCA",
  cyan: "C3C2EF",
  lightgrey: "EBE7E3",
  darkgrey: "6D7891"
};
ansiHTML.setColors(colors);

/**
 * @param {string} type
 * @param {string  | { file?: string, moduleName?: string, loc?: string, message?: string; stack?: string[] }} item
 * @returns {{ header: string, body: string }}
 */
function formatProblem(type, item) {
  var header = type === "warning" ? "WARNING" : "ERROR";
  var body = "";
  if (typeof item === "string") {
    body += item;
  } else {
    var file = item.file || "";
    // eslint-disable-next-line no-nested-ternary
    var moduleName = item.moduleName ? item.moduleName.indexOf("!") !== -1 ? "".concat(item.moduleName.replace(/^(\s|\S)*!/, ""), " (").concat(item.moduleName, ")") : "".concat(item.moduleName) : "";
    var loc = item.loc;
    header += "".concat(moduleName || file ? " in ".concat(moduleName ? "".concat(moduleName).concat(file ? " (".concat(file, ")") : "") : file).concat(loc ? " ".concat(loc) : "") : "");
    body += item.message || "";
  }
  if (Array.isArray(item.stack)) {
    item.stack.forEach(function (stack) {
      if (typeof stack === "string") {
        body += "\r\n".concat(stack);
      }
    });
  }
  return {
    header: header,
    body: body
  };
}

/**
 * @typedef {Object} CreateOverlayOptions
 * @property {string | null} trustedTypesPolicyName
 * @property {boolean | (error: Error) => void} [catchRuntimeError]
 */

/**
 *
 * @param {CreateOverlayOptions} options
 */
var createOverlay = function createOverlay(options) {
  /** @type {HTMLIFrameElement | null | undefined} */
  var iframeContainerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var containerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var headerElement;
  /** @type {Array<(element: HTMLDivElement) => void>} */
  var onLoadQueue = [];
  /** @type {TrustedTypePolicy | undefined} */
  var overlayTrustedTypesPolicy;

  /**
   *
   * @param {HTMLElement} element
   * @param {CSSStyleDeclaration} style
   */
  function applyStyle(element, style) {
    Object.keys(style).forEach(function (prop) {
      element.style[prop] = style[prop];
    });
  }

  /**
   * @param {string | null} trustedTypesPolicyName
   */
  function createContainer(