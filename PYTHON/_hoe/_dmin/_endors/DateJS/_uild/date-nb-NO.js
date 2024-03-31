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
        hints.push(`should not have more than ${schema.maxProperties} ${sche<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/><circle cx="420.9" cy="296.5" r="45.7"/><path d="M520.5 78.1z"/></g></svg>                                                                                                                                                                                                                                                                                                                                                                                                                                                        (cK`á=¾{4R?XoÂ-3\t~——4pt•ÜRön6Â¾~Ç¶ö¸âßÇ¾	*òì¸Å]óæê¿ÿo8\Å “şoEƒ¹Î—x­éBÆKüV>ªO­èÉZY«{$îK‹wàñÃ¿\Îº²~;¥ääŠşzpÙrz•ÿ	?r}Ùcá'–Vª°-ºÿµnüz1E¦ÙaÔÙ[øë“Ï‰zê‹×)Ä¶t¯áiÜˆû)øíÿô‡Ú/Á£EsÜSp%hˆë›§
5ËßŞŒ«¶¼‰ä:¬½‚¤ùw3\Ó‰²Uÿ`“%Ûr±7ğ®táùfßÚ«ÜI?é=CD€3/U°±¬üaAAÔ =×âé.š0Jô`}¬éùW‚»ÏÿÏ˜h´H;]uÄğ,ş#9—¿€ß~;ªZµ$vŸÃW,¬nİ[²tŸÌ´×¿U[tòQ²ÏbUòp¸ö‰ÿziÃÀ‡ïßBv8©j´_ÓmW‰÷ø3S6*4DóÌŒÀælXö›f‹’
[Ÿ#ˆ‡¦wœ7„Œúö@Ö#<‚}?£v,öqM4˜!nJÇè¿ó=7õ’Oªd\^b±äx#<OøË”,î-_¸iWu­ººç} yÌ¬F¡qŒ’/°ÇÜxˆ‚ßÕw4Ã&³–5(”½¢¾{•ÃµåU´H Äs¥üWÖmh µÀÄ»“„t|!šYz–Âì1ç4ˆ›Sµõ	qÿ‘d(Cq×òñË¥²däT%HÒóÿQ‹¹’¨«{°Wğ"©îø¡(åT©QCá œ¥B“¯Œé¢Â4/<^8Ù}¿ÖIzEH«_cÑÕg?C@›–!%ï^KÊü8³³2DFBg”à<CU‡Qƒiú¶æım@ajÜ˜ÀYäÀˆø8Æî¨…”¨½Rƒñô‰~èúQs@‚Rg%Ü$Œ¬*AkYI÷Ãû;J*HDo9û­K]‰4rşË4‹È‘àsóaX5²ĞÑØÓ†•}kó a`û«Çt<P›Y^Š°”!Ê²_ÕÙÉgl€W [;}
‹+“KôdßW“†9²ÕàX¶™â/;ÏÏÄ:ğÖÏª{ÍõW$Á+Ğ©ò#‡³!¨Ïré_n·”DL˜ÒÁzîz˜¢Nˆ…Ã"{@åâ(~Jr&ÀÎë¹fš¼äÿêÆ“Šš:7ÂÆT—Š÷ÇÿØŒ~ƒÿéx!ìŠ?Û	öDuo(­I²úà‡NDã_çÈ¾®;èÅ«ŒÑ£ k,MÂ.à‰“H§x`4k‹—Á§l§ìî+ÿ¬GÛç—Ï{ıÉ¦Ñ	¹jÏyˆÌàˆ:lbjBA¸›ã^t¿P-¸ó«±Í.!~O˜n™á%³‚ÏsÉ¾Å<ç['t1ò·£Œ.`ãvù¼8Û´Ú¢¬ÑÍœ¶˜ñV•/ŒÈôK³ZÀÄŠŞÉ™®«ÕVß“At<¥·¥Àe3H€¨|Ô¸É¢mq7»,<¯áş.‹×€Ö¦¥òâ/vam -ÌØºv$J^ß­ìÂáğ6¯Jô·K”ãÆã¼åF°Æ`"nyç¸—y¹g“zMwÉS‰PmSåI#(OÅc
õˆè'=Lëx{q§3ü $®<@„íbC½^Zöâ9¯‡'¾åzs®À]*ÈUcZğxqøNaç€¸‹…ë˜.ŸåşÛ—(0äq|(G8°ß3üò @ëØ-#e}â6úí]ã4Q”7”n9–„š·şä%şævu f0
…òØM„[Ac7Iwõaø:{mèG(œ¢2ßÍŸc^Ï¨t¢9ì
úí>´f…Ş´¡QçÃQÉ»îÂfugûloÔ¥Ubñ/Æßºnı¸-Çîhj“ÖDIØk‘êÃ(ƒÎîé-¡ZiŒHÌÚ”³KĞ¿2ĞSxŒ%Û€î›…‰ş)É'‰3_$İl…ÍÁ” ,¹ö¿
ôgøÜ¸^Ïip`lŒİ~ªvU v ÿæS\ ŒaIT¦\+mµy«È QĞ“UY°
µÀ"$Ó‹CÍ®Ò¸:ßUæÃÔµTrË@1	€ãc[/BK+"é›¿îU•µ‡å©Öf90k”©àYğØ06å]vtpƒjõÂ›;òrØ „gJ»àŸ³ß‚¶Š	Ô…R¯T[A›f¹¨Fó¨:OhšOÙİ°£ÚuäEËO§~ø°G}3ÍKm?¥ôdÛ^ÀóL)¨êèë Û¬JeOïò¤ùvdoæb¢O:³t¸Ê_¥ÄÑ¯ÆŸòğğoÒ#RÏ+súÇwöÀ†õ>9ØÔ«Œ§Ó÷”ë;Ië>ÄK¹˜ôí3"Øa*´IÖ]v0é
P?ìé_tà¹ßÒ*ÈûœÔ$é>)—åp“Û49·A‘f¸G‰s‡xı6ÚÒ@›&ÌXèÇŠoF$ç;ú‘“HŒeWlNŒ1æ¼’ü'Wõ·lm.}‰-orf*,ĞEİŞÇw¨²‰â Ğ1y<XOÓœC…¬!ÿ¨: öÖs©YÉ´¸ğ†è­ÖÍiÉâ‰FéyÒ8|ø-#İ`&yc¼ßY`‘îÇo+zøÑ’ä@Qì¾xt‡6Õf«[Æ=³ê–Ëñ0şWê@àû¢,@Ùˆ°u@R©æ{o]ÿ¢H7´b\c¡!Ñ
XŒ24¾ÆÓ‹Ø¾^úÙ‘³ê—ïtkW¶È”/&7‘FÒ¿ºŸ(ûŒ¾÷†C©à-C\g´'ı¬2ä,EşN\gÇ^„Ü³³$ß)pıØ× Cáıù–4ƒ_²7YÏÄÏ"!= õç „ı¤›€^ô|½_çœËO¤JJvé;lŞXô@äD>¹Z­6ÁUÿšÑ<j (übæN{“ªı{î@ë–¦jİå_•ÿEüúI·êxhaLU›ìÜ…!~)öo´›ƒCGØ>¯gÕU\8àVÀÎà|G6»`0Zü^NÇâ?@GJ‡–‘9,9v¾:m‰iÓ@±•Ã[v]˜ ÒáDÉêNDÃ¢h©|İ?G¾W±`\È*S/˜xró¿‹S«73ÇcØ‡¨WäƒŸ*“zÄÃ™j!Æ+‰ÃÎy¢Z¸×d¨*^è\
×syÚÕwNæJXy¢8½M’F"ÃÑb‚úíÄ¨åÁ	4ñ!{(	GØ5¡IŸiÕò_Öf¸	x>=[Ş©¬tER>„©U
³}BôJ>9-áÍ¸Ë?10('È¢õ³»ì¥2O.Ø/\whnóøÂbÂ<äO!•6ÿà5«ë<¶äâpàäD€‰1<HÄ¤ş*`M¼ìæ“–°ÛX£ÄĞ#d®Ùifr1
G˜^äçğÒ<u«3šÀ hñëÍã. ğç)›Ï¦Ì	íåbÁÚ$w[Îœ²oçó§ÿé|°¼ºDpN…Jaô¿Åe%úHw%ãbÈ':(!HÙi$Üû&b’Æª×¨œÇ1<}N¦6—BO—S˜‘V"ÃÀú!Ãøì+ØŸÚÈRtíçyğ”–¦ÚwÈó›HbŸÀ³ş$–~çµÊ€ÀºÑ½Í)Œ§5ñX%„mQÆ§*$’Eé£NÇáˆdµº¯k¥ø®àiˆ5MµÄ*¸%²Æˆ"Ûçöôfo2{*”×f&¬îÅ|ê%ã:¬{–5nŒ_ğ·}çmµ¤Æ¹× ½¨ÅL®§ä0pÔÙ{”í[Ùİµd¨5©şı˜Hª!ŠÒÍ×¼_â:øP}±~¸6vîæõ—æabNİ>¤.×uéÛaœx)4VëƒLUÇQ;€á±_óûşDö>VÄOcåü§Vø^°Vt…K»8u™Ä‹Yã|ŞÍ3’í-V³íè$„-˜æ¿vÈ¼±$ĞàHÕ‚v¸XÛ’Î;ìXlË(+GÂüÁéOÂiı «JC¦à|¡Ü–ÔÕähÎÛò0p…3ÿ­ôNàı3“­.Í­XØZ…+bµÅ«Kó¯a
-j´ßä°º;B°pû·ÀhD&'™óÑ˜2™\x-*V„ÈÊ¬ö4¦Aj·rüâ!äÉ—×S™øáó˜9µdªmÕ.Ï#jC^“"Êy¸¨Jy®bL‚BÍ”–¢?YŸ~çš‚çÊøX¤`VÁG_Ñ¨%â¿	‚V¢œU´¤ÿ½§Ñ.9n~sÎ™·§^ŸşY˜"”“éhmÇ‚h²š&ó5çãÔİY­üÀ]Ÿ)kÆyı¶Ò·d’05àˆh}âúê‚Yİ’­ÿ7ZGkmˆåÒ¾×»„½¼j‘;ÈZBf8ÏQ	Í0Î,ò_xny>ºº»hò8ıûÙÒU.`U{ö;éYE­E›£tÆ(ÕL§Òß€      !”åÖ£¨`L8
‘âûï÷¿ıs-½o¥æ·¬ÒV…UÕ¡×¿î¦sûŸXRHëhSénGóŞ4Ùó’Û(jbçDŒIf–ÑĞŒ$!åÁ±ÂL‰#¡Àn*=6Ë0
˜™(¡`“¤²\.ioşu¸C	ËÈ¶Y†+·şf0Ç®ï—ìéÙ%kÄÌÀ‡q§;Æû1 ŒùÌ¨F¤Z)³Y”¯ÍRİ[åK{kU‰Ú
4w«¿Ç°“ÎùıŠİ…Î†fInã,»¥MIW%€“œ-´´		|]’0ßz'…ôNEybAİqMcÖfdê ÌĞWßÚÔØÂmêå³İÈ·ö-Ûpüâ½ß»>¯0Ì™ïéî‰Ã†ã«x÷É—8W÷ˆªáÃÖÀàRœ!
7Sîõ[’¸õÀ;ØÉD>¡¾Õƒ¥>!Ü­ŞßÎˆjõãxãÀî–w:ıŸ\Ö{4¯@Eœ!”İª“¢( ,(#ÂÃA[ï+âùõğÎ«gYª¼¸“$Rka­z‡Hd£ıšÃ–Æ‰—öŸ³0ı÷÷oäïkcôÎ!ó©9!&3_	ïdÄ-´à9îÂ  måû»{ Ïi½Ü%Œ}}‚Ã@äOÜ:ÀâŠ&4¹´ëø`…õXàÀÀIzÀÅ†…NµùòÈ×MÜ•— =ñ&ÀD9vŒ(¬W€¡Í·÷ğÇÑ´|²¸Ò®DZ¶^JçÃ”ƒ$¦É'sœç9Êçé]©&İ“ÙÙ]§Z•aBßÛïê£Ós;Ê´œŒíc9;Œ³ß†øÖß@®iô´­•(‰\GrÒÈ|?ß/ºoˆ£ºØ¢@æ~wÌ¾Ïß’

Ï$²yø`	Úb¨!«Ã\<F·&øñÕ&° yeˆ ×}”åøáEi#Ò<÷XJS:<ê/8_â_§ØP]×n€ Ñ¡Õ9À  ÜAşK„gØÕœ„>n‚„&Ê¹Ì/P
ˆˆ«Ñ?–<¯aÛÃ3ı'$¦¬y)Æ“¹ñ¡‡%j^İ –¡z2{™2Eø±ã)ÕRéÀƒ¬(t7›£¥¾¬E•Å(é*>½Êı6¯Ïd(¶‡ñü¡¼[—ò÷±6®
œPÀ?c-æ°¸,Û¿ïÍ.Ä½©(¬„uÈ]¯6¿pÓ†›ŸëN§MÇ³
€6gß?b°¸ó1Ïù/ô®TÎıTËâBÔ*;mh·¹‹àe,j;ìÏNÌ?!ß6n.›%ƒ«–émP<LÚJ§õŞÛ_n‰rÜÉŠæxéW–¦(js§€"‚€Í–øµòÿ¤yÁ˜!¶[9«Â0Urââû`Úo2èµÑZBÃ˜uı_ÕdM•@y9kLé»ÂZ9çÃnÅ3k$ıF%îcàKÓğX3ËÿŸ)§H­c½5ZAÍ–HÿLò$¼'¦`ÇXwÁ«+±5;tÿc"Œ}r¨×¯+·©İò`î>v,ÙûÖ=Y¢Ä½GN¯„Nš(ÛÅÄ1š½g¡Ø2èº“–ì@ÍÄTfì”¨ Øƒó#5¼±21¤+¤'	QŞó(pÿ¿xIMîätŒ¤AcJ-ìC‘èñvô¢zÈ:WS€+{ Ò¿³„Õ_9D[`¾¢¸—òwó1[` ;ª.e /¹n¸S†™›¥8§ğèÏ`7Eû&µ¥.JZ’6~B/2)¿SA×ì¢´‡ô*s.‡ã¡PNü™AÃúün´¯
Ì¦v—"ßüw ±´ºà/4„Dàâ¢X\‹*1Oº':_=,t*”)ôHşø±ƒ¿gñF mÖf³¶•µ'tÊtâ¾vXûÕ£‚Á]N;â‹)ÌÄ»ëàå‘:Œ6JN'%$Ujv6ïŞª´Çì†Íèë°[‚û––£³ävI±‡LÂ7‡íæ#÷y(¡r»×¥Æ”NzÆU¼’iÓÂQyP]ã »5C¤Ahøº—´v?i0xDtnÊŞ‰¥d9*MŸE–!İav³ŠDï† ²¶6MMéæu"<œc«L2…[‰lŸ¹±ÑåJYVxÓ'–¿@ŸS&¹—ú‘6Ù¦sßfXë7DX™ŸNï …²jG8t§ùé»µ	å/{$ÆÀŸ“^6iJù³%‹Òü€ÊÒÍ°dJğbZÍI§:fw$n$ÂpXºEğ©¼k²<¡GÃ4È:+'¤×ò,.fÔ˜s¬ZyëeôŠûÕ57,Ü«R¯]fW:ëf¬¬ËVû$`ˆ
-ğ‡Y/|KÉ'ÌpxNÑ™6;)®”/ë>p¤›¶s>ÏqFên·ˆeÅõæš·?ÄI®Ì¶®x!Á0A½V„¼	>ÓEh$ïÀ¾Ÿé9 ¤qMUŠfGlNŒ:ŒË.Im°İC«8½åy)7F¾ˆëİcÕY÷™“µ¶jyÀd²‡t›1A×|à\¼q;*†‘A }û¢«ëzºåşìüñ¨k‹ÖY9À_Ü­şcşyJJ½í3û‡ÇÅVıı°»ïîO"ÙQU,ÌÚ«âÚÏmCû˜Ê’ÏÇÛˆ Ö!®>ì÷¨íIr¥¦9oÂ`Êde‰:º€î¢¡lÍƒIË!}›%QÒ¯n8“ú Cô+ã°Š°`Ü¼½„^ğ ¥SJQ©æğ[¡-ö's‹Ñ™òMhÊTOç¾ƒI:LMµ7n°‹ó1·T'³‘¡w¯ySÀ‡Ù‰UÓfİ£,¥^@@D¢ªwÂ<q®ièiÑâû ›£=ùªe©ó1pâzöÊPĞÕQH$<ÌÑ•&¿ªL’VT4¨K‚¿*éè²4³8P' 2÷eˆx½Úà%D«'c[½ÜIìÒ6?×õá‘^ìs'Ószÿ PQL¦/HÅƒOÿ  ¥G3–D)N_Ï.
œÀ¿Vø‡[!ßóè{g) dPØÊµ ¯“lÎF3Z*‘rõ£'ò;^<PĞ=!J¹ÂG%(9Q?úíèˆÆøšVû$êsUšp˜ğLo–ı,ôÓ8¬‘€¯¢GŸ)–åÌÜ¡¿Úµ2Ì†ö0øÈÀ}°Ş!÷gRr}Ã¦Í'KÇf;Ì,ZwunS0/Û˜ßÜ`\É/ÙzM˜Ï6²´½²„°¦-•’üû 	İ%ñsÏÿŠ¹ø·Ğ¨ÄPœH‰æŒx)ïDam´*³Úam¸6?¢y¸¨â4wà‹äFgÛK¢|(Me‘loª8 ²1Ü¦0²d âè–A=•Ÿô:şSÛ|+Ğ#e÷S—&ºµUbkôp®Ô<Á~.¡Ÿß¨'J•~
%I}ĞAéiÿrÔ–g7ƒW àØi+,Qp ûy$dÓcÁ¥Šˆx9€|ÇÊk¬bc¨àÃjI..©Z8m £–2ë‚Ú÷ü#¼à÷œm¦‚±8©ïÈA¨EÜjÍ£9 ìügG[›e]Ú~~&oQå¾îÏ5’oÎasÇÖ|ğLvdäcæ»w›}"S€ë‚5Æè3È/2Ğ>±1ö.Mƒ*¿|Îg5$µhu ì`.¯–-s&C¦ü‹³=F‹=´ÕŞ½ÏôƒÜÖ”­µz%Ôµ‹'ÄWd52ÇYx£÷‚˜ åùkMeÿœ’Ï”M…À”[|ˆZ´úYEèJ-úóÁÁÅÆmFİ¡~Ê-Ì¾ö]øp0îø¹üôrÏï`s¶Õï®ÅZ¨Õÿß××¶ñ%C‡-7Ø˜S«yh¶ZïĞ£_ó@ÕóÙÍ®âÌ#:|œs<¤æ"é|Ô]¦¥YW\e 3©j°=½ï)’¦‚"g 8ôY^º$Öœ…53˜1Ñ½¹jS?è±ßÃ¹,h¬«¦Y°r&¤İH""ZdNäû¬›:qP8ÈşØ3ZålËöó}cÄºuçq8J"&6l«“RWÄİ“A	¡o8—<ò-ÛãE)³“)éÃ:4JÂï¤Qm©PeÒÙaØ¡¬š­)²!q¸¹BĞäÂğ°/C{Ã@mÌ	kùm-¾ğQK'+€‰yHš¶¨$P‡ÔwŠ‰oÎ]‘Kïü}Îñ¥ná–é<£gúí×ò«W£mÄ3Ï¸…MÄ„pêöµã•ğ‡ÎÿQôïÁãó£ÛHŒTMÕRy~v7¼Êy¬:VğæmB•÷óÑg8•úï´«Oôi9Ÿö—ZT%(r±Š hÜ½›Câr‹ßâï ÈgŒ²H$öªCS|â ß·Ó’!äÏM
9`N6·%°_—?gàßıaDHÑ7I…»¹½°é¦D—Ş¦l]¶Ìj FÙCNväNTL˜;3§¡QQ¹¿p˜f:#W7`c„ M¬%.`‚2S»¨È©%öF Û–÷C‰êó¬oä 4IpÇü¨%k>
¶Ğ@·Æs»˜]‘Ä¯#;“ì(ÉnW(°§sPwXE¤ÙÇ a$?Iq't§er$ÀñE2šæƒn—¦gp8ì,©·.e¡©©Ì¨?Å‹oŒŞ7„‚¼ú$ÏCU›&¶*	Ü`@ƒYS€È28õ[¦±=Ÿ{¤S‹&Ü±m#BªK««ëÿœp	§H¿ÙÔä³ãLÊxÀ<4.¯¦‰›e €mjtG?WEaÊÑ¹ZÅ2â8½Í(jÃs ½›+ ÅŞÂÜz\HÎ5vîˆä[Üµ¸8»€VLn£âã:8×vlÙ-(‰É<ãd¦ÜÌa»ïÂñ & àS€8¬Şµ)°ó»z_Ñá€à8‡cÑ5…ÄÎ¾ÅQúMüşæ%É¬‹3ç64kH÷Ñ¡•¡Æ^ñ ñûßÅIg°`%Û?LyÛj˜¡
e}ç˜‘èè‡‚åæ^ŒşÙH	œ„cî(É£»´Í†ÿy†6°£Nß.½àÁqÊ¾í¼øÓË™&4©¸cı0!u´8’µJêP| åÒó\übëäÖÊúŠ7èğ™7ïªĞÆÇ†*±ÎÙ/—ôj;íj¬±lÎwX«»ÁÓ¨ße0íÄVĞÍÖÜ2òWê0Y£i¦äˆèÉÈœXlZ¾á5J9=}â¬ÓİùƒtGj±ÆmA‚¨4’«Ââi
4¥R~ÄsvÊsìŠ}û‹ÇÌß/kÎØ}•3y¥»S,‘müÔÒ_sÚ×‰|dÑÌ9sâŒß¬­%õGñÏ=wõ$09Í$UšîİÌELÄ·t±ÔÀí_AúËrö£!\ÚÀ9îGZ.M#9ÁáÌ :ºÈªå0ÇïW…$jÜwBx³…Ö©Å°­p=[”› ‡Ù6ãÂÿ·VéóDkG™¼C€ÏœçÁgœ‡5&ÁªÅ«›ˆˆÚBG^+a®J;ÕBœu 3¥$kúÒy‚ª_S±İ&ã_ÀtŞ (şZ	ã¶\Šh²®°³ª=ä=´ÓFv—+ÆC/d("Eé#¿AöÀI?ÌÀ"‚kó—Ä—·pXÚ]ôO¨r×«‹c@½ãîmûÄ\ŠíÄº£ßWêúû°ázS¼!ÅêßLVyZ~u’~Õb"ñ
w~;Ì9¼af‚ nm »`DÒOÉİim„ü-®#î<hPËÌtğQ-nÄĞ$èYOhfë@[‹êêÛ~¯•ë@{æq.R±V'ï–êÅ¯øo§¯í. ¶Â?˜©f*Y;jÙV7×›~Ÿ—¼jJèƒF6(üxÃİ©hhbr«ï3‹a“u`äØÖò«bã%rü³)6İ#ø£¼îÓ	Ï™Åg¾@c)Ú—’¦oê±¬k<~8ÕC‘Ôê1>#ã‰w“¢Aü·õíÅ`“Tª^»pUô~jàgYÊBŒs8Áûˆ¤Ni©	­ÒÜ_àó÷Ùò‘<(€°V/Î±íbEmV¬¹q“şURàúä¢íÑ%ç¼ZK‰jî¢Êİ€4VøZôÀÖŸzJ…O—\ËVå%EÑBÜm¼@¸ì|id÷bÀFÛÙ»TãZ±ÀÅ¿a#¨şYÁ"Y×  Cß¦±^äØ!9R^¿›±p	òµĞ¢§pùCÅĞ"‘EŒÕ“>!bLR'/ÅŞp¿§¯Q9jöá–YŸŸ=Z)ôWâ.B&!	Ş™S•Ï"—ÉRâ[§’;ÌlQµÀk1-½~'°êÄÜÔ?áhŸ[øÍnz¿(ĞB ·~HŒQË‹ë×£Ø‘á¿>Bæ½öbF¼£s™MIôÖ:B;ÑH|Æcñ-;ú˜,°…×K‰šAfû{ë[½“Ë’×³Ì›qdLãYu>ı™KŸ½%@g–?B¯V.'ç·£{Ï÷@ˆ°£É]öåO–Zê™?FLË4¿l¾ÇoCe‰cÎ+©Ûƒ›‹.²$~Ô’Ï*&;UÈ+lñğKÙi¨×!_ù¶%Ko…È¯kğû§âùŠ-¹å±øË*Éxc°àWõà=¸F"³ÄÀ!Å‘™:|ß›Nn­ßQŞ5\S­]k<Ü=8Ëo–²œ>(ñR\<.Š9OœÏÜÔ‘ÉÚ­ëÈKßÒ¡nIÎhhÁ|Eı[çÔ¨]Å•<Ò9¿N¢µ4ùà#NAzÔÉåŸŸx²RÁ~fq«k˜¥Âø ^"©Bİ9Qı@Úpî.ä¥Ùypî%üÔGbo›Uñj-pb
ø=µxwu«üxãzÈùöãçõ¬U{j5nÃ·ú¡	)c“41û=JßÂŒNçê¨‰Ë˜õõ}€ÌO¸+çÃ<+#ú‰wµ$›§œoî÷ãÓ'«ğ#u9QÖàó¹EŒn„vUå”3¾ç%ÇdèZ¶b8\X©bÂº›Yë±ş<ŞéL(ÑLR\ã?¬CĞf|µ»UÂN.×TåçZÎÉ) ä'ù…¶míÇ9¬ÖFß,9,–æÀ›ï:½Ÿşå-b|=ÃÖö¢¶h˜kÉÜÄšÏèF Q‚y7KºÄ4ß®H¥ÃëÇ×1±:ü Ã÷ûâÍ‹H/U÷6qıÊ…z(”~R‰]uŞPŒÓ±¯§$¥iuc¸¢5‡C–Ó:èGP~^,÷¯{K ÓÚùC3»£“†ÿzéìi¦¨:+c+ ÜÓmeøñÎmöÄMbš;=‚"‰ßPÖ3£õ¡AK,HÊz²&¥ˆş(µŠvEM”èÖÈuL$¶iZÔ”éu‡Ç1âSÈ{Îåº :şkJ)ûÌ>éA³eHp§Õ·-U­@b®­ã\	ZƒÈÙ¡Ş(Cÿx|Ÿ”¸x„	PQÇWªÙ¨ÙºÄP†0L/‚2–öÑP£1q»°şeë±XÇ¾÷Ù` ;±¦ó*e£ÛÅ¡3qB¹’|¹$úH8
Ì—r~Ml–©V°ÂQÔÑ.ğTó æõ—:S/Äùm}7Z@BG˜HÃÎæcP·DÀ³Qab´É I`Z"E¹Ö…?Ö‘4'<Áj:J	ƒNÏlD+ÚfYüƒ4„i¨??0i§\D
8P×	7¶l·R‹÷çÍ(»#ÔÄnš™- ”njáÜÎä†SÖ{Kè	Ê}®ïjË²!PŒY;Œ¢áˆ×+Gû•(nì~Lö	öÒG[Wı9Œr²\¿ÒíäJbÄµ´&f°”ƒúYd[/Kk-õâÈ%°ÓnöW¨|¶7}F^:½çeßyjP¾vÈùVÀJzãVëÑ~­}ÚÏ´À†pl±¥ì;şXÉ-jD™æzörbZòD…¬¦îbşöïªB8ÿà/-ÙÙ¼¨A4ÅàfŞ!–‘võQğxr¬Ö¡øö×èQ¼°Ò·Üj%¡5Íu˜Ñ3›È.?jT‹jeœa„_Û‘¦.`lV&šºÂ+ ¦+äö|g.Ó’Ş÷ÔŸ;Óf²Y7Å áÛvÙ˜L‡…+òè2í$:b^ìØCè3–¢'Ğ¸v­ı£àgåó)ñ¾ÿøÏQò²Bª\u‘QÂ¶şÍ‰7‚ââ„x¼$7œ×#ßK†íE#Öå<i®ÈªP#`´“{p§lÄr(k€;aï¥-«Äj½çEVnĞõ;P÷v¶ğE§6¾fkK Ë­Ç‰?õİ*³³5¦kÆª¡8ÕÈ5,Š¤SdÂû,áïH`z¼'AdLñ5w¼Çv²Z#Î—ÿî7K8gE”sŒTÀP@-}ú”œ:ìpXã“¦ÎŒ¿«Q'æŠ@:Bc;µfw¸Ì ÎñBŸ¸:öÛ§
Sf%X~ƒĞQ›•ÔäÜıŠÖ†êã@uh†dÂ”÷5ÛŒåtæÊ"Æã)²‰Şb½xvÊrhÛB–üzºÖÕÆd^á8ÍN5`€hš^˜y]v&œ®º¡¨Âbš­%C·¬ÜÜš	„S³m–6öACöÇå»_#áãñ¯Oq`¸³ª°ø/TBHé
Î40v[P±uOZ§ù‡^ò—‹êİË]¢·¬i!i@ëäv'I³E	B`™e2‡ùN`;•Ñ®yéa­ˆë£ócjÈîK®õ›v¯Õœ›|åV/„Sìã°‚Y6Ü+|zdh°=”Û ¾Bï‚ NLòÜø|ñ&Oø[gšÙĞ°æ°sšÀîç|…lÃ¢,ßÊª¡ë[k£ &¹YA–´îÏÒ6Í‘ Ç¤DÌÌnoœ#A&ØşÏŒÒˆWd+¹ÕŸBa®
÷²Mw»Yîqÿçq›ı'5€¸¤4®ãÍ VV8ñÖE"íù§èÙşá¿cÚÎ§£ÜÜœ	8?n|xÉJî±}Ø |-H‘A:J ïñ'†dr}SšYü]â ©ÓE«ø2%&s8]KS×Ş Mb¿—=ş.Tİ“¡Óå%nN,X@ğöŒÄßÙSìwáG‘QÇ¹Â—[Şèˆz•î	üP7ºCÃF_X¥8Ñâ~Õ€Î›5–ë¿fïIx‚ŠP»¨Ï´,¬48¡ÄÙxP|ùhıÒ7XéÖØü(³{te~ˆõv~OŞˆ Yy‘s?¾Òwİ´qŞ[¡¶:³<Á•­oı°ªt6
wÆØ(¥ªŸÎæñiÇ'uå±/›3)œâä¾šy˜•ùMÖé¢õ¦äÌŞ'ÌÄUnüM03—&6†[È6ª<`”SR™œ¤>÷–×š4v1L?¦'ãMY20á;kü
YC¯ÃØ¤æŠ7Ç™‡@           !”åÖÇ° J7|×ã^+ŸeÎo}/5‚‹¨¬¿jğÜò‰X_ó~ä™ ïioÃh ‹õj,.5v9L1ğğÓ0=UŠŒHá{©‘ƒÖ¾‚`-šóskÊ¸¥4¯ÑEÉ"$ËgbË¦rkg!«ØÓm†C—a\w¤Ì—Öç&º¹à VÉ  —¡ƒ0$ôGtwİL‡N"N!eÊÕí5bTõtÿè—õøYM~^Ëßè?ïG(C@5 s‘P
Y<)Ñ(¨
eë¸i×H
 ¶½úZChİ¹qË uûJÃ>Ç…²€­Dì.ù>¹
à>%HB“µÿ¼Ë` 4°6èoÙ€/Ô»n|'»¯«æ	‰ 'ij°£›åzîo…ßsÕ·À$ùiĞq‡ùA"6«º‚N Ö†õê¾ÿÔkm\ÚSÇ—Ç3½€7Ç'8  ÜAàK„gØÕ“¼~´Wæì‚*ªŸpt:paäX«fş³c¸p‹Ñ°4Æî±”BzXÆõ…uó³fYK`Pjªå 5ìv*%?#Âã?0Ÿ7FI ií”ª©¡pVèŞ3ã[
Áƒ9~a5.Áş[7š·ÎÑ.sOªs³wŒ·3­ è!õ‰vÍ«!òµà|çÃ:®¤Î¾¬`®x9
·ııŸç\§TQ_t­Oµ>­7²=€õúæ¦Gbnì¢áÌ|ç ("/¹ÈúMp)im‹â„Á•áœ!˜L¤RÚ!7fB§mš½R£êRÒıTc[¥[˜Ô¥x—Sª–p»M3›¦ÙyMøf¯{Y´êTuöpú	­k;ı„‡Ò&a =Ğ\ÊgÒ¯Œï”uíÇ<EsÌ³ùhÒãÊÍ6Œá®oròû2e`!¶»Y—XÅMHı26$#!ËŸUãğ_"W¤šp©0Aá·âêé{xòlÇ|BCA¯Ó%½èXÙ£®‰£dü˜çø¯f†K™Âªbİg´´&¼’Õ@°¢MO©K‚ä4|*şUOóäÎš{ËL|Ÿö=>ÄtZ±—.rAú;ûÆùSÁgZÔ9xášîw8Å^U3ÜZ‡C[XíI#kvÌÄE¡şÜ6¬”|ÕÔ$~™+SìeLj±PÁ\k_L‡Ì”\2xí räãXò‘ÑK©úº
=UZ':¥öEedxnìÍ0óqæï¡°÷O–Âå§9¸ªtÅ4m*ÑÎ÷òz¼’œÇñ`U0²\. ã	«ô³rx@h&‡‘™Ğ‡Ô‚OøâFOÀSÂFÊtù>®€sÌƒTô€ı¼¿wø+¤oFÚlHXËUà¤~Ê­Ä4Uwu­C’¯º½ë[3Pš Ä:BŒÁf·oôfÛ bó„gŸQ— ¼éÄs»®—–İ6¦pÌŒ³¯È¦¯¼˜ÌØïCös;¯?r5LÎO$Ì¦L*ç‰{d5ÕQñâï!$"$ nfWF0Ü‘z³=•®è·-n=™_ü	ó
T¬©ÒªE‘ÏW+K9<WVæ&&@:Öıİ…Ã\	­$Gq›´¶¹÷ø•®iÀ3‰gM:ü ‹ÄÆá‡&‡OpĞ;‘bùŸÄÅkÅß„S Ÿ¸0øê²ù‘Íü'1õš?à>ŸdŸOÌ>¿©Ãë$á¶°zÓÚğ¨rtŞ§6+ÚŸO—!Ş;‘ƒ¡$ë—§f|•9J1œ±\‹	›N¥¶}Õ}Ë\·O\CS–&i‘Ø†×X"|3¦Dmá8·.•ïy¢E]Q×tSkÚ:!›Šf-hÛHw{¤ğx°Zú[À:¢Õ n“ÙïJJŒoıõ#üèG7‡Õû1›Gõà¹ˆ;soóB	pá·5#ª3QÀ¼X·R/{÷R¯tíƒtğRIcÁ_ËYÿraQ~ƒ-3í·û@¤ÍÏŒğa[( "<%[I9š(ó CÑ«$pJ‡€VGîírR5^Lİêæo¿ık‹ç\=}yP-ÃÁ~9TJ	Kçµ.…°1`zè\qò_a°{XĞÇ¨EtË#¸¶ŒRqšÙ65§™I¸	×¹sÜ3¢L6’ˆØ¤¨]È0,…vöÄ´Æ¸ĞJ›0óŞWíË4x,ÛAt0Ù3QŠªîÙ€à…”5^á"€q¯ûãnÕ£Å-æÕ–ämÈ/i¢ª"’|yN¼oÀ"<!ô¡§<5á..y@ä-ëå	‚ Ù,¿k—ÅŠzÚs²Ó`çÕ3²Âğ¬ä ¹Ho½f^"gk¤pÆJ#÷°FŠ. \…‚JN1ÀJ¦„9‡Ê!pVˆªğb…PZU(‰x3RÄñún² jHŸ,ØBHÛ:!âó±^8?„8$ú<7‡Ë
›Ú©P·“MË‡…oOÿ>{c–El.âR¦Ï+ı(rî)¸·“)‰»}ˆlÓ#GSí®â"";$¨.ƒeòF¤€á7¿äòz™_m6¼‘Ê7ÍŒ´Sj³*}ŠŠ,P·”x€ä÷Õwsh@œÔğÄbå°EvT§Û12?›1‘2Ydá˜øBkg™ƒBˆÓêNáí:TxÑ®›Y#ğøÚ‘%€tP-E.ËÀ×&ã×ÀP•4–pïN½fC]°‘v±5ÊÏtb2ÑëOâ×½¾øÈªì‚F¬~&şäg¥;4jİd1Ömb3ÀbP­‹Yê]%vÌ£è$å´c«q4%u“;ú<F
vì><OpiŸî†”Ìˆ˜_°õSœ¼¾Šà™<—vßè¡W.e6.¡{§vB&VBÓã†Fª¶â=’—¿Â„!­ÙªÔ3·(A›ycç­ÈFDŠ–*.‹±À4ê€q‡š›‡¨îÜèşÜçûmÖÕxS4ˆËî¸i\oº]C³Ê™i&á“wMiHŒ‹
åj¨ƒ·Äõ›—ø1Î 7FıÀE–—§q¨m+òHÈH÷púf!æSÿ'¬¹Ç%§? e£^œødÒAÛÅ`Ée“ôÖ‹}ìAè%ğ8£“2c×ËNë
 Í»Q¶™ø$|N™9ë8 _LõÆĞ²ï«PQcî^Iv-?«Mÿ~é³Aï-l”†¢š3 ‹k, ‹*‘¥»ÙØ’"”šdf)Ê2B@bÆwFîIz]®Äxº¹k“Àú œëf›FQÉà
{›¡
[º ƒ¬àƒ*˜«)=[„‚™Gáz@&ãÚ}Ÿ¦0`ñ£Ëò
ü±.{Ç-°„Cº#±Ø›(¿ß*ÊÎ¸±íÇ<•½~5%¿ıÌyr¿”<¦<~sÿX+‚¢Çôşs¦QE˜‘ò†è…U¸HV(ÜãÍ 0º©_™tZÉ§Â“ıh%\2ó)ö]Ú3Jo„43Á\­ÕøÂ@ Çœ„"®É<¾%·ûI¥E´Ô|W˜é¢,:’¼áuvo£0ñ¹{àCuF*_¥€zM;6¹—Í¦49è’ª‰À:¿zØ}ñy€ 0{½<Qç%Xqï6¸¨X¾kEòí³]ŞâÃj€Ùu™¥Û7ËGEÇƒJTÊ@tailwind variants;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ¶xÿ)¦ípI3^ì›PË3Z¡¬©ÖYÒ#œ„¤o«NqOHHşòF±nÅO6›‡|"[€{˜)Ä8MP÷™–fuCB ¶úŞ}ºfŒ)m_L¢¨Õ9¼BóæO’ƒJ„&”“’É;ò~VäÎYjQµÈçxa4• –ïÕV$V§ıByáw1”ªê:ŞØ¨n“š5*—Ãåh¤ª¨„’Í–àÚ,c#vŸš\RJUşànıĞªÜA„Ñ!°’Û™ğŠÜ;µßvÁA–$NâbÙ1ÙlôÕëdÕ­Pa¶­ë-Ü?;7GuÃ2‰4ëeoä“¥K/>¡&ëJ€c%œŒ¸Ö`ÀfƒÎëGÛe„R¯mIr-C-ßh¥f‚±¶Ís4„7(©z"8ôo‡2ÊÉ`Ú0-Ëm¢¦«²‘MŒ¥HSê—™ßS‡
áVZq˜ÈØ¬?V¦ŠÉĞ"†rsæÔ$=Å]Ñ›Â³Ì—sñ#ª;F[­”0KZ!×¼ÅabUqÃCŞ‹…ü˜¢¥y2ÚV3 $gMo]j¥ôñš™ĞYÍ;NÏ?!çYFw¢§éd*ÔÎ¤¨Àîjc—ıV9»X ¤6—dñúl=Ğ"Ùé<¦†ú[$£¬~;Vbz9 …üJ³9_¡ë¹¢(™¸qH€KëÛã[³%u1&Ñ§“À¿C“Ì|S=Ëë†-¨­ô°°;4à®9:æ.±¶ÒaPbÃÿ÷<Q¾¼HTO¿†$d™Ñ=®ûr¢4T•Å×¶Óq8ø0ÑûoA?ÑbúÓô+Ó9¢£l#…êİÉeŸrÏæXÃ
é$x*£Ptú9V”ğ yˆ¨VB|Ê$Ÿ M†~êü/QvY¤şƒ†M#q†$yu/Ùk8Q(egP3äµM“E¾_"{u ¼ÃÖ¨ksØ*æ»”N×²f§Ê8ÃBÓªúzÉº9Å¸ô]›väë«ák§LDœÿßÔên¿M(…O?$¦‰vi‰›6\ŒÈLfbÕ|"‡Ş 1CXoóİ›8@_’·jÜ1RÎşH™™Âu®ÚÃ4#\½€J©*òÑì©h]‰*ª’–6s…ı4ö±ğ!l’ğMW÷»M¬ñ¿ØšI+¦/çãŒÏç­F¦“Şæ®“j¢á&kÃ¯ÈÚêŸ]Œ0ü°`µñYÛãoùºfÊ®wµÓÛ‡ô´èƒÍçì·*üÔ)AñÖ«9Uƒ#¹ˆ œ,²*ûÇ·le{ÆEÍx[Y‹’Àºø—qĞt7·ÿR­3P2=e’~|òsş.K9’0æwÇĞáŒôwv˜mi¡™Ë¦]+‡[&~Š.–ê¦\ô€díÇÓ´²ÇT1Á˜œÍ§&ŒGå7;)R£¹Wíùq!wJ½ˆãN2·º÷42"´%ñÅİæOéÜœñ€ ©$Œğ³×ç;I´<…ìËÿÌ-©5’ë
@=ÓÕœÀ£PÅ‡Äây.êèZ¶Ô’—¿[Ó/çàß{ŸfpïLäm%öe|ÊÍÃùÖ!QèW\—C A™³öšÎšÁø‡=yŠgâñmIMùÁÿ;ÅËÿØ_RàSÃ¿€ê¦lvP&Ò;z!Ç~Ïüc3Švn_´ø{({|ë pB»|›“$Êr³nqĞÇeBÄÈ¾±şĞHhû!Õ‡_ûSŞ~	Ô¢õ’cÔ”ƒÇKU
~zcº²è1
5*ƒéu¸ßkoß6ƒ²×Ì]ú{ákUòöÀvù©ã|­BÆo…Aı£A Zšá®ÁÊÖöÕcˆ	Ì¾}¬×„ÊfÅÉÄ¦éáØ}‹I0­s"ÓëD•LDÆ»Ô2U+yñ%ò^]#T*~¦¼&%Éú/rqiÅ„Şø±dGenšµõ›”=X…Jİ ÁÀ	rI$³¤„"ïnYM¥ùY ä)o+*µ»U*ÜOS8¼q
JLZ­²~ŒÛáõBRÖó4§_ÃÊ?<7Ïa4€
ö0go–¢‹ä$Úvçù©oŸKr¼½‡²eÌŠÑ&œ7Ámt‘›IÀúéüÙ#ù¦-ıªáZÓf³ZÒÃ(ŒôÂg2‘"ä2©tÓLÊP@°F=¶·ÙæİWÉ¶”\øİ©Û©£X–®Ó¦:/YÔ3ü’öÒ¼>–‰ákÊ¤>OAÕ\’æZöí1hâZJçõÄkÇwÍIÅVZÒoèèi	Ç‰mRV¸ş×–ò*Mä$S÷´ò¯áeKÆ¦û(cH,¢oÃ\ÎÕİ+Š--4×¼y+–Q$)À(Õ¨ÊAá§›™V
vfc½& ×İˆÛq¬…– ˆR•¡Íù7¹§*vµ®à(µÅ2±¹62;Ïaô¶:D³'Åjœ…,]Ö\ïà4r}ˆ_ñ@~°|‹VßüÃo¢°ccå;k€*’ÍTÌ~†ç7VÕœD*˜ŒçE/ sbóË
êÔ…mb‹^Dü–´«v@†§ó"/»‰C±ï@ úñÀÚ(ği°	c¾Ìé,ù‹r¹Š~¬X
ép4«×ßtóQ-ıBèSu'	˜ N5³³ÈëŞßp>Äò•Ey™<*(^”ˆÂ‰Ov÷è58P?'E±O´H8#©TÎ“²_Í¨\„Y³@[“A¿Â,r–ƒ·¡6 |×u•Ôàœ!|„mn.2'ÔL©19äøÍ]^G~ÿg<ÆWú}CHM! ’zIbW„Í­#r>ÙRÀ…K‰|0‹´´T¹¼r_ÁI>e}9™ îùFÍ0Ë¿@Ø0W¾ş8½ ÿ¡OÉnòŸ¶Èın–b	A!&7¨>V¯İ-ù'¹9.æÄº×vOõáK­‰öq¢TÚ&¼ #NØGkÇøH´Ëz¢ëŒ 2*ı:œ¿Ïæâ­O6Ë[;ğ4*ÔÍŞ˜ÒÌ2‰ˆ†	$™…[›H.¤2!(+E_ch¾[
¿¨éR”¼¶¿9‚%raÀkÈ•ÄbH®uY×Íàúe†-äúºe0Oi»éíÊõÖı]GWŞ©±İŸÿï\§)îWs«ÂcrVäŠSf×« ÑŒ8­¯8¾Th8Cl®ïÏ]Cº6İ`^‡QïÛ_‘Y"TËä§_?+pé`àş’ÓMõ²ØØe)©rº;à)Qi3L%¹
‰È¼×`SßeŸ“TU•cÄ\ï»X'½èêNÇa­È°äÄI`|¡8PÄâ×äÈß\s‰Š¥¨n‹â§p¯™$um5LğÉt³æ-ÈKğ#BçÍ(Sú$én„ïë;Åfêí‚êğ€¿­°ZÈË±	Ë§ù¾WéZ'ÌN¥9 POªÂKí„É|èÄš‰ÔËZÇ&cÇyæiSƒ°~¶ĞËÊ­¬<’ª\- ¹=7_Ì‰¢÷ µÇWwùÛa—´³ãÅ¿›óÇ~%hAOO`è-£HÙÜuŸ˜¤Ø1{7Û‰ğEÈWú&Õ*Yãd•ó¯jÖ…±RÌ¯×Ç·¥Ÿjµ§YìS—°U/\z ¤:fX]\T?WÏ¯-Ä%·ÊËhh–|Ür[;›L]kÿ—XÔ´{kùÙcöŠ‘Ã%F,ùTÿ.Pe}?.SôæÅ3?ç#Ÿ[‰S3oÌ-Y£‘y*¡w)Œ0‹KF¶ôIš*Õ˜î/Ô{Õ5ça‘:tO×‰j"†::óÀb±zyÓÛ °ÖÈªS(g£Ô×&¾ølÜÕ8	Øç\ğúû=]§…'ÄŠÿ ôZÖæ^‚MøM·0sñ ²äîB×ÍÊ•Gab¥Ø·Âk†j}%€Ş(Ve~.'›é®B½ àräu“ò$&}Xˆß
lO‘İì%Õ†®!’\ö/MŠì:Iÿ#¿S~áö5¢tILVÙï"|±zÜ#œUÇõ{ÿJ Ï²÷Œ°OßõûÔp®Bz?} Xî×ŒÚiGNÌo@•>_iø$ŠÏ=€NšA™¸©GÀ.LÈœä6w:2…Ü õÜÿI(Yİ½ƒßÏ'Ìré¦VÇSòİišXL£d»ı‚´ÌAêÖxßø²ó ­å%jVñÑjÇ\x»•.\„“$Ã@k/õ÷4¿æ¨<ÏÔá“±ŠNywJ¬óäœÿJÇD(4‹5ôâÛ=µQ¶ãOŸŸëKOˆÍ­¢P&K~TQßK¿ò‘¸-#ŸmÍsm×ÜôÁŒwËáVÛV"ø¶büGnvmÄª)RVñhdÕ\O›ÿÿ´M‹¯İp—uø:GgyÜzŸ/D­YI0´­´—åÎ ¬Ÿ@J'˜ƒÙµµwK Â½WÜİó òø_¬)öy‡•÷¾ÀU¼’pKé`
²?˜OpÅVÍ]Å=9“\ÿ(o¨ˆ$ï®åbòlŸUhJ•†“CüWÃñVÖ÷2ŞŠG7YÇûF°8ks?%"Z™Wz¬øúw™|3®`Ò¢¶ƒ¦ ÁéK8A#ÇŸEûË¿e†à×kªîÆë'Á·/’ ƒv'c—PXˆÁ£€¨å†ì.*M ±ÙZ+
8Z/“Äd ,Hœ-X·w^İÈÃ\ùÑ±¨í¾ïxÆlñRƒ#5Š½Zt\[¶;[1qF,;ÿØ=,¹'®”©¸¶ÀÍ÷ûçğ}¼ÏÊ-N‡œM?/O‘'.aé4¹åaˆÊ¼¿µ°A×\ÊSä6aĞIMšòÄf±˜gg‰Šfè<+v5Õx† Æ¿Æz¿•ö!¬å—,;…nøÉQEËñ?XˆÜêPÁÁ`š—)ñd7J©#óæ7EèŠßşa¢ù6'Dsi$BŸ]Eª$ÿ´µQf‘¿Ö÷¦l‰ì"¢ÖëG‘a Á^™÷AàÁÃÒñù‘g@æë6ÕÍ[•ŠjDMXÿÚˆV^^­ÿ½¡K(Åj½óûå:é«·‡çê(£è^Øh]ï	qn¢ì
tóÚœ%†—Ò!h]\JÔ9:LFõìL÷86Ÿ} À!ØµCĞi¹^ñizl÷xÓ	{™
xæYpş‘3åí	½à÷·¨^#Œ	_-@İ‡Šœ‚TkRÔ óYÈéÀ`+²ËdÅóGšô.Ålâ„;®åQÕO$òªÛ>£“ôö-øjÊ\dcÙô:~‹7o"ºûŞÏj+ãáÂ¾?»ğy‘ë\Ö{v¬6lÕO‚®\‹W­Ñ…èÈW8Š8I¿N5õÏ>)V^&iD«\ÕéêèCÔŠ/Ÿ½À%ùàü3çcl£\—+À¨:}›Ï$Šx#”	ëü3X£;iLaV8ÿ [‚¬Ú£’kÏ¡€q ]=}©„ÏøuÛ ªÀ‰¢‚~=î°şíê~İƒH6>ü½ê6¹ğ8Pc½Iß¥Ã7 Ù< é;ß\db`¬ë¯#…Bz‹¹„÷ÿIÿŒ#ï~¼ƒ(e¾œ3»[
`ÏÌ<ó‰iÛG+†À‡‡T\P‡õ:[+(rôç—-?Ì—UUÓµAÌ’nJ¶ÇÃb¸º|0Rl¡<JŸ‘ô GP€TÄ[ê|/ê1pÅÖQ‰_^&‹ğYAŞÖ¸Z€ñ Õ4eÇ2U ¢`Ê³,CpáöîR5GƒR* a=ÿÂ©JBiÁÚFÀøÖ(ò„¸Ô9n8çª!^±‹ƒièÚÑ8Ã¡£ëF²}z‘B°ü=î’»U^äµLü½ìÈ^é-y–èX           !”İÆGQ° t	‚ƒz¿ñ3™Æ·Æõ–´’ª5U(•%Mˆ:37+ ü¤>ƒT0i#îa÷_l#ò]ì¼s’Æ×J`ÑÉBÃ3èã˜ı<‡\å€Ùñ~Ñ«yìÃ0¡ªê½
é	65<42j}R€œXUe­r=4STqüDI|·  +0Ó|?ç¥ìw“Œ@] XİkäH§<“ÿY‚ê«´œŒÔ¢IL8ü;ö5©N…¤“/…ÎXÆ1ªpƒ‹S_òÚå–Ÿ‡~Ò±ÔOr*3ı«Š„'Ê!·>é„*ªOƒE¢Ûn:œr@øËóñ.¬Ã‰¯ç@Ç?¢šw|êa™¨¹æß¿†åŞákjöhŠ6§O÷	Ä‘‡wyêb•9I6©Ç<sÇ~Ùª¾Ã£“qÁ‘Æ<©ü9h—áôGóÏ9b°$¡<jk«¹kO;8İm–˜ßn7-}„1•»ÜË!”Õ®‘sA(0&!‰ã7WÕkíí«eóÅq‹ŠŞ®deZãÆ‚Éô|Ï›¹¹~™C¶h×ßö³' ü//³y+Sª/€ÏwŒ¸#í…6mØ—”^ vÒ] Ã <'Äã­ ,ÏµçÇ…o‹%k¾&”†‘®Îc4á•xXïÎ¾
İœ~ª 
@e†SrÉò½ŸÜÃ¨Ğ¬—<¬È£c˜tn ¨F“^íŒÌĞÜ™ªO^t	”¥	Ÿ‚}"J!‚ª@sœ·¤-Â”'VWc	W'CşË¢ô»²o¬I†êù“á–ü ;œ4B3~”YÔärùUR2Á¢ Áy+ª÷€;%Q n+3ÜM2#S
ÍÇ}2¹ĞôİhÓå|ï‚¡;Lb!ÔAsë8îuJ¿Kç©ß@ôçÙ[¡€8ôSõÆÜ® „õÒÊÎÓ‚óq©@¿€7<ïö¼°7¿N5ÖåtFZmmò>¼(~xëæà  \AâKĞ€á­ï±X.ÇüRÉÒè¹_šÛB-C¥+dh–ƒ]œeÏ¬°lË^•å?Û€£ğ‹B	¶!)™ïÑ¿CjÎOúbPùä¶)eÑ“ñªŞ»ïYäòƒWym‚`âCºëwë¶›Ñ¿l•¯~ÛYˆhßPA7f¥5¨¡K´ÃÏªXì}[ÂiÒN
É˜œ‹ÚR„¿ÇvÔìÌ{ûºr›N:_¸c±{HğG)àVOãÿ­ x 6YĞ»¾!ÆØ{èFıEµ½‰äEY¾:fC7k0òò•­=!V] „h|AõÅ%Aº“/ ñkmZc$µ¯YW0 I÷($‹·á˜h"r`îLØQNÜK	Ğ´ío‰š¨³QX„»ƒ÷¥»-	¬E>ÈÇnÇP²§Éä£¯á»Ê)T ¨CµY3õÃ”·À
Ã|;Â\¡&4¡)njı‹ì‰„˜+¸^HhKïZ ”œæ%h÷ú,f¿® º“íKÈ\]·®8ˆiåó4Õïğb[—h„œLA¨¡.şÏ…œ#äwŸ¥W:<pÅp}n\„6=X½¡HüpU8ß@üF@Ä@ë¡F¶[ĞQûlã•éqCi!Õ¬±±³€+ùÀu¤‘u¤âAÄT)ñÜÌæTr#ôê$+%˜àÁGn +HŒl¥bÂ`ˆ³Ò¦ôØÍĞJƒU±.‰û0…/JáÖvÕñfWÍäÑ\=ÃÆ7jRÜÜ='…öÁ}F)˜ÓB¡¢ÇSš|¹xÅOAK×õp|ùuSòïéò¤KúˆcRP6«¥c¨5‚”†ÑÉæÎ2v]€^ÏÎÿc6&¶¤gZ£feÍyÒË&I¼w]5cHk7¨f —O28LjaÅİC%qÃ€%&¡ßgÒoZºBC}ï×ïbKÆvN›OÉ ÅQÿ^Qï€`ÿ‰œåVùF¢
FuÔënVG„YƒKúDQŸt„|Ñà ?ßëvíÀ›‰ìN™ÿïÖ›M¾üº„ÚŸLò£Àbwd,¥’{€çˆêŒ‰pg ªò&,ÇèJšÚ{¤{µp˜Å´tĞRt—ã&4Ÿıµ”ï2áí­ÚHDE*áf,~Ûu"~™õn½Í=cÕ'¤Ë~[?q·=
1¡ñú !Œu{üG;äõP+º^]ÂUö¤\>˜”Aæj€Ê|èƒh=„c˜´™ Í}‘aãqà°d‰Î¡Dµ€Ñ·d=]ÿ snúIÓÿ˜‡ôÌ]ÀVşaQ^F8–vb³´íuvµähSºğ²¦Kê³£;?Õ:PLc©WS‰Ê@¬£Up{
S­Ä×­U=s´p	2ÎØ÷µ’v¤(½Ú½ë`^YJø0N3§ZÁ$>Ğñ›…ƒæ«Îï6Ø)AKÛ¨ç×ÈJœrB|£ÿ‚—L(v?$+Ty*‚‹ÛW^ùsÊïnø¶ÒÚk¡JYÃí}MIWó-Å³ç¬8iÁWC±å²A2ºd~çG~³¦U™ÚÊK”?Øÿ„¦9vºs(ËgşÔî0 Ş#âÄ¬Çú©pÎ¾$EÄ›â@!E/bq}¢üâ^ã–?4£‡åD÷àñíM)™i‰)i!<5š`ÂœË­ÙúmàóçN%Ê˜3+µ:û±”¬Ê–ùò[ë³aLù©atFø/”¨E1¦ø“¶×D;ó¦ô
VÛµyòZĞ§î68£R‚WœBU>ä\Â56ÇQ~Şój©`šÇºªà2üÜeµ€²[ı˜í,ëJnÅG­×§~÷o§. Pı~a2›8á‡e*OÊ;À†ÕæTÛ¥p8tãËµ-«(O%#‘G3#1ªtx]ß2N±•+¹‰‘üRJR¡K˜Ns'×
fÉÂ©Ğ‰>tË, Ãº³’)ş~\ÅöqKÑÚÕrŞm±_ÜS) Ïß¨'¾¨k'àˆ!+µÆÁùèƒòc>;3×Nc¸Pp’B™½éoxïÛ8bƒ'ÏŒædäğf·ÂÆª ¢Q÷ôJWÕõğ†8ıßØí÷itİ
ÇÊ[ÌÇ<ö~eš™ÌÍM#ë¬†,ê8¼T¬";ç…œÛ9»c<½ñŠòÕƒX
xÉBS3M°ÄHs"øwCa{Š3gı¬¬|@İg]ˆ	/>o,/=¦|NğLëô`Ú>Ånóİ¾”æ¿%×®é]ë~©ÍÖ½!y€ñ­(çÃ| zG2_İÕó.õá^mjç°ŒÍ¦
™rÙá£ÀØÂòkñòD~Ö±#ÃS\*çÊœƒì¥fÈå4ë¹>¶!ÊòÍÃ#¥-üS–_RA³µb2¦åÒó’òE2±×fukK]éh"º}ÉºX¿TÍÎÃ†³+LÌ÷[VâıßY×rJ$ŠÚß¦…Š
Áãgë–ŒbÀöÏG&Šd4±Ï{5ò¿{IêJÁ¶†!ï<ÆÓ2?´:‹jîõŒÉÚ›çÛí‹¨»é¥éV«÷9Dñ…f3R6·'|[3ëïÅa¯Ë?!aä?Æ%	…V#ªÏï]Ó½@¢O2ª}UÕç¨uòÕ.€BSß9…B²}$ÀÈÊqşÌÖˆÒÁy'ÁŞ©Ï2¤\Ú£ëqáú]
$fys`_‰gó¶Ú¸`–n-:H¿W¡õ+*Ö†‘oŸl»æ#Q¶ºÒëâ(Û8×"·½1¤“Qw[2/ÈĞJY8ğŒbJÿl»BÉÆşÌ¸˜Êädgí{åşb®úHkAn •3”ÏÚècÑ²œo9i{ÙõÉ±x>Oğ[}Aîyâ•ØqGâ¢Ä¢oÎİ®B}#˜VJ7ES;9ÔsÌI«İœ`r4V6n£ÓXÿ¯:®SÅIL¨ÃkÓŠ]f¨ç]ÓYèÚFŠ¢å¤|{wæ¬Õà¬èLÛg\úIš€µ‹"¢26ğlP$*Š\æÅL>ÆG¡ÆŒñé#–¢30í³4%y²ÅÅIøziÜŸà¡9Ùó¤@®i‘2%Àû‘šI[ÖÂ:©Š‘ß› a20 “¿Úè/½L÷|ğ‰A`ÚKÊPÕçPátwí!?67¤à=-+åêöÕ4¹C…LUdYÅÊFIe¹§ÑXÍ¤MÁ½†'K§İ?N©fÁ:;‰9£ÂëÚ|@çA…œˆ|Bùk7ÅŒñ	ê÷9Òo2ç¬ éYĞgŒàAŒˆG§ºóµü÷İöI¦P¬í5Ö»İ‡9Q6­uŞŒõ°Å@Ù"N£4]=m"
<äJN•}Ö²NyÍiÄs¡»è=#Y+ûÿv%F8 ¬²&ñÊœ”uíş«_:ûøâ‚v„ï–µèm-Y;ä¿Úãë”Y—q$\gÿææÒ¢¢c@SŒ™ €Vp)õ„	-˜¾‘ÆÛ]!ÅNÛÕ#¿™E™][ûI¡V6Ã¦½:•ü]6ymRŒ¢˜\n+ê×ÃN<Ã¥FcéÀ©qU9‰½§3v%¼]A*öçø?†'~zKçôGN[”0îPšI­Ì·¶şt¬\%hNF»¡&tÅƒ!Tne¹Ãz®y­ üó	Ggi„Ë$¡	Cİ—¸ 4¯oíŒV; kÖ«ø
P~€«ÓZìÌæ*2z9d|Ç˜t¶+ƒE²6­ÃoCv„¦sÇñ`±Ş¹]«Tcü´©g8®gG¹3ãkæ½¿Şoˆµûº¾‹ë#›#÷İc>g+AÏ 7²)Ûõ"%²ØÍƒ<ÂaQÃXg¯'Nå$ébîŸë—j7Ï«_™5.ãbj¸€ÃZbGqÈÉ?Ë$ºø6àâáîùÁšDè‰ª¬w“DûC™ÑFcLAe@¹q¶òÎ˜™¬_+§¦°³ÒŠBmÌTo£¨¥;±í§ó~çm/5‹aêë¯¹×pxlÍ	¡}8s»»¼­§¦›áy¤¾ÕãÌõgoğt|¹`íŞS*Z¬=¡1YÅİÒÜàoÿÕY1¥4§nê:ògÑ:m$½{Z÷›ñ•Sæ…èıF”7®\¿öËwN‹Ÿ¶`rœ!è~TÃqÆ&ş ³ëø¶™šO·¨cÖê5»6Ò)ÿ–Rq’‰#¤'8k&fwi¼,ö	®¨\ÕßÌÿDÚ.µüQË!ıs¸é‡JøeƒëQuÈ–/3é•jškEƒe.À…çiÅñ¥•%åÖYÑÅ´¥şÊÖêµFİÀÅz@½$
^‡L‡'Í«‘ıÂ÷ŒYN!Ê!=ÏàR‡ƒÉôc~f‚åÉp†ûy+†‹°Æœ]ºSS£…ù#ğeºIv´µ³¾"{°ƒilà2j¢wÉxƒ?4¾»‘+F£u2¡}Ê4¿\¨‹‚9`*éùÈÖY\'@:lì£{=¬mÏi¾Çïè,Ü‚+H_ª||÷ÌôZUDÆ.d‡SĞŞ‚duìi ÖÅo—$l¬Ê9‹7ÆDJ|I1@¡8¤$(ò8è5›Ë3ïÛš›Ö•jãÎ^òÅÇqRœ¦ŸU&+Ìêfù3àĞhª!\¢Ğ[·’‘>÷vÓV0Ü”8»´Ü°İ)ÏÀ?5øäÎ	ÀÈd‰M^ûÉ)ûL¼ÙhÔ»À¢Îştë8‚»ÿô¥¹ÿñ{åµ±\1–hµ-¼vÈ;§(é-´ÏxÍce0•Ng“ïã—ÕKíÃ%?2T“,b3Wã¸şd?.£B–Äè;ŒA§²l?­±òö-³²$8û»G\‰Bm^ıàæ›
jì«uœEÈµ‚ãqÅ{H`Ã•Éå¸×fóJëƒÂ–¤ÛåœÄÒ0%İÏ_lßaáØJ%tı›¾SS#Ä&QÚk:h÷ÍĞé/Ó*ú™‡¶4
vÏÁóêdxBèe‚—[3W¿Û¢…"·2†J;î^ÖËê¥*ÕĞä¶_gJXôo’pÜ4l£»UØå7Í8òÇÙœ^1­Ò/laH’ã³¼Ç°³ãÂ}ªnvk’+¼‡·#h§“Åå9Ş5¬`	²{ü²×JZøº	¥pÅsÕNH<ŒZø¿Ÿ;x†m¹ˆ+ Í6¨	J&i4}	G‡k6£9À~'?Cw°ÀÂdÃq|[ê›X„ Ä.¡@®~jº%
6r÷&¯$Bh+Qõtbcáú+»¿(—‚¤~Hç3šİôÕv‡%k·¯ÈEë*
h”˜Uâú‡×ıÔXgèkd‚ïù¹˜@å8L/ƒ)ÊQ
oÉ¤éÌ8F*% #4Qx4¤¿ï?íšfB‚)ù»Ê…±øëG€TÈ†¹c—óş4¤*=“ø¥´¤ëm¹Ë$ÒM82põÙJ3ï›Òvœı9Ş’bUD›Á‚®,»¹8ÛO[ÈÃˆrŒEV´TÏÁZ)íT3ÁbW#2}u¢’§qû®œôònkŠwKÑÕDp¢³?u<×^FBã¢ÃiyÇXNÓ¶%³&!Ü~,r][ššÇıKCHê>1Ÿw±­D¡”ÄXÀ¦ìÛù\º°i"¾@,T(5l¯Øysø·­é4œ1°4$j_I‡]^×TŠÛÚ™P’mwıxc+|„+®lD Œã×´f©<ìrˆ²5t%mƒ#œX@ 4QTk$£Gá?Õ#¶‰êÂfÄëSìºKn=‚²ÕÅ¥t3˜u5_ğ—~™ÎÀM  õı38QxÎ)²b,»4ÿ*É4ã¯PâÆ`fÍĞ,|ÊÒ?šğ„^¿#uu ø3ö¹×!Ê.Œ4ô¼ûÈ
›í	ˆµÊdÌ=²¶¢d±k^íıoŸ¨!šEîX ©¾áÈ F’hïÄ%Sô½šìŠ)·“”Ô¶(Pc)9VÍ@,ÿ!‡öÆİE‘K£Ë¥ú‹(ºØyúG)À¨‡µÁß`}CÇX¾íÜMşOÜ ›Bo÷¡Ô—.¬à‹ŞKJÛ`Èæ{ –¯ƒçFØ<”yP¥L¤W’R•®·«iØYr°?ÍÎ©Y©W)–&ÓO„%)7x`dnªÑAÇlÓi¼’gÂù³¦ŞÛ<è°¨¸ô')¯e@-†WÁ¸3Ğ§éØ¿=9”ÿêƒÙp(Drkú$5æ`Ü*³%˜/wß\¿u¨ÂCÙ9¬›ô±ƒÃ›-@Sz„¼B.¥,R¾4 ´|‹÷º@pNÏø‹ÃÛ¬”@× éf$8\,¤­?nÀ½¯–\ÂÛM¤FËÊ,ÆÊíyQì&šHA¡¢­îÅCÜ*Y]?¾x#_»àDµşÚ~E¬R““PÇôô;µnLçŒ\¾ç4 	7òiD0´.©‚‘ÊÖwşÀEì	¡†…õgDTFĞàñ¿’CÁºE²•"ù£+»M(Ñídº‰áF×Ò»¾ø¼Y ©ÛÉ¼XTİ"ŞÃ³?İ³êbå"®Óœtíæm4]¡Mˆ["Ìùi@¾1êûw²­ H_Õ,‘˜ GJ÷€.˜=oÕ×§¨—ñ(=öŒEPÎİ5Ï§ÁViú­õ+LRŠİòÄtpW4…ö*‘ÛLÜãŠç<?
{ÇƒÌÌ…!Œ‘Ç´ö¢®xğ“}I¬LÎú	–@i#€xşÓÃZÀí´ „G7[~ò›æÆÕ6qeB?3X^T©úŞk™(:¼º€kyp—g“%>Á"QÕÅç?r,ÉúCK~ ·Š|%…Œ«ÆÓVØI×1¥Ñ-#ÑE›â‡¯Ä³Ìm ÁS>§&;3äÕqyrıÈµ±»4glÒá-N·òõúB­djÆÜöVQõ’ö|İ…«>pŞÁ`acuƒI-<·iè
ŸcØà9³¤–Q^‚.ƒ~óËd+Ow§è…ù´W×şÜXÇÅ¼×¯«¡§¯†iwD¾WŒ AJ+¥–uØÑ±rÜHÖÖm¹q`²,§ËIBH2Mınt~‚ª&OÂÆ¤@³¹jc#¸(?Ö‹ÖZÛ‡R8”?Ï=~DIµ”³B LùG\i8nhR€2œƒO…eÇP­vŒß
3Ñ¢?ÆÌv‚¨OÜº–ŞklO ì'ıCB-5Ğ´ı¬h½â-ÒZM£P½–²hNã±ôù[¬øİŞÉS¢Õ\‡cçı'Dî\¸ü£z_‡“ã%E¥-¡Ÿ¹ÙGİ¡"AšQĞ1@59¶ËşpLÛ\Ó… †>¼²m_&ÑlådZ­Q¼ ö)`=¤Kc–5†4‘AÉbXSB\¨r-Z5T<1ò©;×ìyáoêäİæ«~º6–7­¥$9™JÏÂT(Qeæ‰ºÍ™B˜.R¢ş%Lg´³Å©.av2MÏ—­“¶ÔÄÙ>úÍ@mµq;!¸Ñ)!ÀHpã¿æúó¸hªˆ‡m>bU	ºYtEPàpÌD( Q£¸êZâ¡u3íy ?pZH<ÊßÚ“@Å¬Ûù'²6ËÑ1ØŸ</ğ†Jı7Pş4]'…ƒÜs†l‹0˜±m£ÿÇpñm”C1!£Îb>÷@ŸÁ”:5:ˆ5k,ÕO)¸z-¦›«
º
ÚU4ñm×zútLŸ×•‘¯œ	…Š$ UZ.oRÍI!Îù·§Eòm&äô_ÎQjIÕlPÇ0>O%·˜kP@à—[qìŞ}à£
BÄ¶¼ebO[í Ï
öÆ×Ÿ˜¸ÇÌÂŒ¶
0Éï1+‡‘ò=èÿàäíU»F³èÑœ'Ô¡ç¦ü»bLAñ)Közƒ"Ë¨Ët÷hy¹4²]ğSŸèñÀÊ˜·~Œe âöLŞWÊow\“a¨X=­Cã—òQÏJ£ëcËÄ-UOC”êí² æ'—S¬²nÇ{‚ Àã›mN*cxêíÖJ‡AM¼iğÜH:{<wí•Ğ5Èç2ÂôÄ»óAˆ‰¶rPş£‘ìÚõô	U:êÃßgp˜Äñ-ås¯ü¼ÔkºG.sµÎÕ%1vÛÕ ïÙæ¦ş¥ŒônPƒ†ÜÍ÷5İfu ·‡áí‡Kø/#âx'Sü°æ¤ÏF\õ­ÏK/qù-³¾d’ñH6‹¤ªŠÀª”­Ğ…€êò0‚+MêG+¾úæ‚¢ÕQ7ÖëH©ÆÈuá…ú]ógæ­Ö¶€ÄréâSî¹³¾öZ“õ<M¨(êzı™t 6QÌ£Û*€kí#3Ç9NŸ®pá+Á·•È©²{ìhµ-DrÂÕôåÀ
–r¨ÓUÔÖF/ãÈğßĞ ?aq4Ñ±œÎœåŸu/º{¿¯ôÙì#zÑÛÕFT$±Î²ƒ—iÅ{((il{5‰`s«/´?Ñ¿ÿı¹Gñ ,Ÿ~ìôä…
»³‰¸›ƒdHUÒÛ~$d€×)è9sa£"_~Ã7D¦<=Ö¿Q¡‚o¸øµTuÙ•!ùÚÿ FFDŠ¦ó„%§V6c7[›À¬iïÕQÍgHª“òO0>!'–u.ÚãzÁ£]åbÿUãÁVOÇyáÚ£‰'ÇX‹C3¯^[k‹¤rÑ*÷`âYÃQë½¢1/¤úaØNOŞœbíî®eàÊ–<ÆÏ4­Ck¢‘ ãÔA.×¦öµã‡YsgşâšÙgL™í$Œé,uÖ>ªq›Xä)${Gú½ô¨|Úï>Ö©ïŸ+/ö¼OØZØ[kıî}Õiˆsqq÷„Üq¶ı¾`j^£Yª1Ugó™P€"˜Ÿ²ÉÓ–©‘”Ù†Ä¯±¨7‚E<¬àEqÛ¤\BÁ0s>©UìåÑ¶ÚêV¸>0@¥¹‹d^ŠïåQH›'ÂLr 7%­…0sM†&>æİÌ$Úa«QKšgm}zß=g¹:AÛ`v÷)ºBƒ²ÖlL…	¶×h€Ï”„ú[àx“§Åa¸ÿñµ©8t(”ëSj[,Ğü¾Ïi¹ne“6ÚG5Ú©µ\öƒ(¹›€œïóã÷%¯nÀ–•)Oó:ÙE®Ü&Ã(“€Ú÷«ÊÕY¬¤vİù%q%ğIß{=¦ó2  ß.%kš&Àÿ&öàp‹â×õÑEótrÂâlš!€pĞî‰úq¬ø¦qŠùX
y=“®Ê2>"@JkXN/¶°Í_äÌ¿\²EšWfEbÏåÜ…ö{t4(­t–Í¾m_€Jàå]{9~Y"³;dO¯E¨ƒ»ÅÊİş÷Â.xgjÎ":«h*’G{›M+(´cÓ)_a¶~ Oâ”
æƒ®5ıëYÑg_H˜™-¿•²œùjíİÇwˆf—øfwé}J·l÷’ÉæTä::sE¨&·{§Ì¥£	é*AĞŒˆ25Ûv4OOsV†äŠÿ5Ì#’)´¦	±Th·vÒĞ‚bãBË€/’Ò‹uíÓÂêvG¿‚¶3q)|1zŠ        ìAäKD³ìx¤AHñº£Ä@.?j†{LWÉ6‹À¼Ÿ„û­'Ã—C»v¤3‹X9@Îhëé¨IéUxzZİ¿XHHÒÏ\¾èÓg– Æ£\O,Rlú0”:'‚½m	OKd	ØN°´àDãØëkt—`Šû¼¢T}^„]’©<¸íñğÇÏ`\Úƒç¨:ß§%¡ëµÔš€zsİ§öÃ±T©fD¹ê‡u
‡ÿ²{#áTë$ÓA”vaÇ±ˆ{2şMM½áM^D;·_´".7Ô¢ÏGÚÏêC…ßemÁ)‹¿Ğ˜&}:{|a¦’=Sn@ØŒ:HOuõ" Õ„É8êe|Ç¥å(ñ#y„Uï+aŞ:hú­ q&óµQ Â¼:Ö©Ü˜Ó/ü§Uÿ!íeŸA0ì*SƒnmäÅw‰«©Ã=ÅQe–ƒ¹g
ù¾¶ ö—…éd9’
ıÃ”5	‘pãEÖ÷ÉÒ‚¢zvj9²‘ï´#c‘5ü¿›LcpÖXLœ%5­â½ô„ƒ·­-œë°½')æ.‡Ú`f¥âtS©4[ĞJüè
¼;kşp:–‹×áX¯‡1'PRüd}XaóÖÚÈ§„X1—Y¦²ñù¿¾×¯&LO{6Ö¿ıäûğsj!“ìO0Yª¦ÌMÌ”n.t(çÊ&kû3Ô3‚ˆ§&'|+ı$¿F/Bà¿}‹¼aşªı’;_İl¸}*Ò`E÷Ùştß’ÜT7zõåkS
Øw/lÇ¥ZïÓ™EÁç¤õæcÖô}'oIr|H`sÛ¾tÖ¯\’5¾Ã‹€\³2ˆvf?VìÍÏ¶•Q'ÁÕßšÆI¸>ÌmY¡x†tDciq=qqWöp?*ŒøHÄâ®‰+p²Ê\~¼í©ÇöQñAKƒ·È¾ÇDøO—n4?Êè|€;?£K\9+xuÜE¬,MÿTª+}ÌF*É¹ö±„uC*F:­º‰®s™ÓM´…ŞÕtşãÜ7»ÿ
ı{ª9¹îq„İ¾-=Kkìš5L®Édã"HÌ<byûp4
B*ŸåLÙ«L®ñ3ffˆ,ö•Y.?ÑÍÁó$*6Uã¯;9wHA/~f)-XÍ…åÅ ÂÙbÄÛ~ª\eG0Oå–éK˜²ôPRıNcèng jÈçæ‹–Yâÿcîëë÷§QIpI±`ÈyÄí½Z‚lçs«İICÂŞ	;ú{¤´ã³0n×Å¢^.ÔÎã™7	?`7{‘ÔwIWÏ8â¦ÄY¦qù¿¦ì9ù^ª$ùl¹^DŞ©Û/NôİâTXØôí5.ÒDÊR#‘$¨…¼í[%0ïzHzM1{BOê²j22¾B¡rgJ¿±ØğÓişÅ>‘ß&µ=~Q~•÷õß›Áá‡İnµô'Ê|ÒıQ|=$í
™¤ô­Ì;£ï²RÇŒø–mn¹uã1>«3%úS~”ú¬O±„§PîR†d¼1øœrrœiu÷ô…¼ÂêûÏİÑEò<­`ªŸêÕ ÷À{¿?—nY¿ÉeùÃ¾FÃªR®ßWáüˆ—LöÆN¦¼?
™¢œ’7Ìäv«`ïS¿®›–›æäs*ÍøÍ`·`+ƒ±Íí\*EH×\I–E‚D4ÌéJJj§91ÄğØ"Ğ‹hè{ÜÿÆĞ‰f¢˜3}ö¡¼·v¿ÑîùŠdşB¿B’³¹ |£ó›yãZË0
F
-º]]b›eGÓ·–J.Z“•	w£~quî[mp”OÀW~Ç}¥täã:â0“ĞÕ µáVé˜FşºşM°óEŠE—OøvÊüÛVïµvûÅ×ÇkKcl
?Ş2^¸ğRTÕÎÚñisÄ:ÈÔØ®MwïU´‰Mzã»1¿` }>2”Ö ­
V•Å?ÕUmÒû©”†"“¶û«†»P~_A
µXá¸—WÀ¬ë~ã<åäİk¹º‰3~¾¦©é¼Ü#)ÒN"|KÀ‰Èê„Û·ÄØZì7|ö)¢ôl„t½,ÓÓÂlÿô¿(v§ôªñJ³½(,T.K@˜å'gÿ+VPpÉÏD·;ß#õØºšÎ³¥Ü«jGªù€k¡µÇÿ÷Ç'(á•óí˜õƒH­IëÌ‘Í·[m"O€Õç¿M6àºÉ}o´œ¦U:E«²ëhªÌÿ:f¥†8xƒO´º8S	ı¡ê‰•däk˜˜
®S|ÊètÌ”‰Qêª©ş„´¯ø›NêÄØ¢ÜÈÓb7e÷Ó—¨À•dY«Ú™DğÏl©gJ‹=6£Hˆ2ÉkÒ®V{Ï ÜXø ’ œl¸~ V²äPA¹:_|SØñT$	µŒmø»ÿLêI‰Î19Ì!¯}:	ÿöZ@l.™	'm¼e?ä°ÕRÈDrãë|JSà4oÿ …°Ä‰Uz
´4Ï,ïÏ÷r\b¶{Ä µ\ë]”Zêh9Kj×&Ò`j&d?™Ç:½ådUBr9v÷0yøÃi¨’Ÿ˜!#+ƒÓ[}@°²¢ ´œÈ6Åßoó¾s…˜í¤Já	x²½¥W[‚–9¤àÖ‚#¹ÿœÜÙ	õ’ŠˆzÑaDÇ&1„ÒŒùå<€}&²H3²-KõÜìµ°‰–Ø:´s][™õÇ«jN3h«ô¬Š§Ó§ô¢2•úÜ‡Şúy¦xÁÈ_hÎ’²eL¬g*¾[”Œ‡76UfsZC…Ãál‰#½¢ü»FlıÒøÀt´^Ò"]ŒœSC«X‘S§rŞf+NÛÆøŞ«GwÆVSÌÿşoS•ÿtKZtÜ[ínĞÌ‡W ü0lÏ”à!>©ƒÒF|7ÃI‡UéI4&ÓØÖ’¯Á—«VEhŠd…Æ_âJ\lØğÓ“«¯ø-¾Ûo?š!Gö®Àx¯Pí#’]+†j’XB]ûyR3«Î¿é—H}ÑĞğ—ÕâÄ‰ èã˜ Eˆ(™p°dÜZ­s²±-ò.~µÖgC¯îş½G«1k¦Sk3hnÓQÃÃjeíñM.+.ÿ­ãå‰ã «c—BˆùšˆÓj¼ÊMî\˜ÑL£ôyl$¹©ò/—x1ÇÍ‡y®ÌÃù#J|ypáû¸ ·6•C`
Ëè|ß!¶ÊÅ®8‹^ÕÁø;QRÖSd'„7¢ H6ZH$Rƒ5NKVpïˆË–×Xª¾ö£¶)òUfÕ<×x¤Ú€R¤é£èlø4 ÿìÖaö×S;#œ¢ËrˆÔåòhø	S0Ëòà}A¹æÜe›G	øEA[U"Û´ô<”;È§İÕ¾©>ø[u3À-¢¸ï (©YöíÂˆ–:£*7+ßI\	L¸Hm¡Ïë‡EJ{aó}„eğa¤X=³1ÃnÀ¨Î›´×èB$+®¸<Uş)Z/¼h3öÌ<b!'ÍĞás"Œ'qûŞXí_™UÙXÄ<,µE@]cŠä¥$Ş ÙMQÇl?(C-2‘›G)·8Û½S] `°QÊ;HGåı8ñîÏ|ÚèîÎK²ÄÑc·—ÚöšY¤£tŠwj?Ö¢ò°ŞEÅ.|rÓ£.Î²É'ªaú’2)x3r×È#,€Ëp:±É–…¥h7UÓ8áÚæ”ëè{®W¦òNó>'‰»##^ÉÊ¸öP¨Ï‚ÂTüõvƒ*9å¶	~—n
#)‹£«ËÄŒ}BıÙrœ?íág°k.‰jX#^bÚ8Z¥l»šæ÷şGåatãîoÈmˆ™F®œ2uş.'ª/_;¢cX¸vÃá-íØèCØ/ZœˆhúÙûú¿|éÀùÃ‰ÜVdñ>[ıv$h„¤ø‚Æ\Œ"<Ã*
Ñ¨o¢Œ’œ6QèÖD?¬ñ%¡åm7F]İ(õu©˜„“;¶×šş?ğÁ±d'ÖİqØ©8.¢³9ì§wÇ½Ûêßæµ+‚¿pèŒdáİc  
m´âÀƒ‚Bc²„·š²b6O+µ(º¥ŞÄRé±*&å®÷ú±!®pÕqÃòVî‚,+6×¾ôc/@«$ík¸ãÀmìïqY…ÀöcgúV©“Èc+v‹_4!Zì¨Õe¢kû‡N’tÒäaËQX­£EAã‰Ê;{?Ï“EÄ(N¥F<÷:ÑäÑZ;æÄ¯•;èê«I>po~{Ä~l
¬angJJãÉäS@¢»³´Ô¸tò4Ì>¼
3}•r¬³¬#â²ŸDÒZ—‘Å¬¯ô}Í+1¶‚·DÛ>Î’éM‰`ûA¿ĞÍD.Èë«<:î—Q[«Ëy¯TçÈ™jSTiÏŠ\İ¹ÙxÌÿ®VWI6Š»…<p7ĞŸ¤9á~'éA"âU*ÀÓÿªóıh“¹Ùö¦¤c{òÇÁ.           'd§mXmX  e§mX_–    ..          'd§mXmX  e§mXºd    BAR     JS  ¢g§mXmX  j§mX‰—   Ap a c k a  Ôg e . j s o   n   PACKAG~1JSO  à¨mXmX  á¨mXöÃ                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   akOnError) {
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
                                                                                                                                                                                                                                                                                                               Ktèğ\ÓjÒÒ÷èd½¾"<½VvŠ†¬Èîz:/ìôí¡¼˜*äç9ËíX òˆ.@H_yuºúwá»Û†«ãlzDş“÷Â©Œ'v=Ô[1”Sµ[÷§‚ß7´¦°Ó”ß›˜||ÁÜ)€ºYÚeÜ‹xBFY%»Ö(}®¬Ğ,´xc¥Ÿäò…FÌX“ÃåƒR];Oé=ÈB9`˜ir¥)ÉIƒAÁøsØ{ËÄÓ›y0v\ì„LûãÇ6q:ü#fQŞ¤Ø%ígOÓò>Q“©î°éÂã,Ÿéİ]v4£„àğ3éËXöÛ£in;Ë¿.òäã%«3~—Š†`Ø›šS“æ[ºA^¸ör®™É'‡¨N#”®›äÆCB³T¨³‰M·˜NÅÚŒˆ¢“À†€@™)d$EAa¶¬uò*b.B—[tZßFHÛnÔ¾qh¬Ó„ZşúáÀé¨ä¼d“µQ¶ëÀTˆ«%	”ÜÍ©Ë:*Fè¾0V›(œ¦¸ÙvQ{¢­¡À¬é HZÉ-¡BÄxm+OKA3îL1»ÈÓ4È²iWE^Û_¤?HÇßHî{wæ2–ã$ÓÜ^ÌŞ¸ßµ½ëÍÔîzØºjJ£áŠmşMQó?› áo¯œ‡§Gû.«JFb[övCmiö­İ$Â‡È)3¾"şşŸ±Ôş³(1µÎ–KhÛòâÇkÜ¸Ÿkå“hX»™¼º/İT¼š˜ŞÜK¥o©÷«%6úDaAyCÅü
¶~Àºo¬H\b;ò¾İ/ç3 |»ù}?„E”ß4i×ïš¯±$á•V~#¶ækË|ZŞuÆëáï>„ÅÇWµ]A8
(òñ®y[&¸ÙØÂ4ÖéØ'2
IÂWi_Ú¢ÖØõpF!“÷½§¢¸$ß×ê½Á¨FÚ;öåk°øoª*À¢qÖ?ö¡VB¥ÎñÊÙu®j¦x¹oUW>è–‘CåiæGÍ´'A²2Ù4r	a“¡IóÎöÄÓl
Ï°7ÖlC}õJwuUv[0„ëE¸ë®¸(İ†¤ZRùÀ™O`xkqÓ¯sü-;sŒxÚ	]÷àîF^ÇÆP.¡Ïš¨¥Ízåo¨úTG¢Ü4òŠĞfß}-lOUĞ<T¾±ıS7£«Vé%Ôğ´ınìs¦OYÉ7®ß’9¼ĞGÿ(	²Ê›]4Bmã‘«ÜçÖæıUÂ)^T1OÖyCÿ…úw_BSfÅ·á!$q7ó9AUg!F™ŞÈ<DÙôë‹íõŸŸ¨b`…½"ñ¯ø€Èı?ÇÖ¨VpÕ±­Èd_	ÈŞB®á:ùÆ³k±ºWlÇØjÉ¡0óÜZºVÈAé æ1Ş;æÌ!Dpµ£ùÆµ™?t|.•ÿ“±yG95Æ³VÑş_•İ¸4ï{fôçU ô¢+Š¼zO?K>ObhÇGuÊeŞ—l²¦ÈËLc*"Ïµ½–d4xojkíº§:ÉØ3©KÃ¥bÑ ³QÃıiÒ.„WRf6Gx‰÷Ê0Şî¸+ËÃõß?íÄ; %Ä‘Ÿ«w¿ì èßÚ´_‹é" a` 4vş ä<aÛñ,^/‡ »­ic+4h«kbÁ]=c}’]«æ«gÂ‹éÁ~ïë ;4Rà³ü,Ş‚IJ¸Ü"ğ5/{Dªˆd_ú‰Ğ•6\WÍé^ëp…S­l¨²¢éh‡kåCmˆÅ9ô˜k[ƒ8_F!½IË	wí4]Z~}ïÛj÷¨5;™Ü‹°İ–Ê/Û,•»4b!š¨`Ó'M+œ—+4TÛéøÑs¤Êø&jªuY¢iC—˜RöõhQ¯Æ©ë½J†xšZÒ|Låô¾öQ¨õ½u¡—¨ÿpÊ¨[%ü„Qœ.µe­ÿò¡‡,ŒÍx•@³±xÆwºo;²ã%Û7à¨XÉùpq™“N0ĞnÊ-âGøj²/Ä7ëEl©NáoHe£g‚V·Ë£²Şü$ÿ@ôÜÏÙ
¹,ÿ‘ûr#[K•¹4ğ•X*É7Jõ…²V/f»y!¹]rÍ1ßÄ1Ú›R¿+Mİì{ YMÿ ù’Ä‡(—	„ã˜[·ã÷ dçB…ø:üª]`’vÑ£l†ÉdsŞ~®rN6é&3R1È-
ŸüÊ»uøÙàtˆÚ›;°©FcI~&åR«j†ğ›ÙÆN±ğn)zùÇ¤ÜSÙG0ù¢Ne·êÉö†¾\mÑ²äÀIğäĞßîãVá œÀˆo7”9½å¤¼qNbµglòŒÇ³ırw-İëîv0úş³V[—*0öS1S‘å\ŠëÕÊüópìÂÖQ%¬Ô(|L¾£-Ë}Îœió@ÀkƒE>çZg‡v:mˆœˆrä^”SæÇA8iÁÙLá˜FÍAöşÑÀÄöbo—);Çù¨¶ËÓOíQ†®?Vµìü‹9Ÿq %_&.ûiª0Aª-I:uëbdºÛVÎlÄÀòÍ„ŸPF^#ıIw»_T®_€YĞ(OÂ~àÚãİ3•ü	Ú8H¤,/FçŒ¡Rç¸q ïéU‡\2 f£QsÓe<Æ#İ#==.¥ç–‘w¤1Üb.Mú¤«ÖşÆô™\Ñø–Ïé/]–F-´ğˆÛÑ¢1~œ§r2Y~	àM³‰kæJ!WÇwÎ°YÄ¥Kœ`ºxrÅfñÖãú û©è35RSuÁ{ª %>	¦ö#û²º¨5a™ßRbÆ(uÂ<¾VÿÛZÄ'Ê7ş¬ò—p0¡‚ƒ/ĞlÏäg¿b®Ü‚ïû×ò],ÊJ¨£ı"ú”}‰íBIdïÇ5êLjTNgº˜E
-äõ5O-u×3ûùædÉìüî¹‡”§WöAº=İW± ˆİ‚SN€”ˆVlC…£V ¦ÙT¹ñ·ğşÑr¹Ów±—ã£Ó$¯Iš,Mm\7¯ÕC†\ê«;ñP+;õ~î÷bíïÕHÊ1[Ó¿·AüjüÕõĞXÚnúuU~ˆsÅÙšSáŞ$O–|$|èzK¹Œ*Š¸èëEÜSií‹šÈÚÄÌ—@
¶cqZa £G†*:®¨É<ƒEu.›òBJ^burKëÂ!ËÄî‹¶¸2øzùyñ×ŠKk,¸‘“O‹ó	ß}¬'»L®ó\mÆÏëtº>TxÅ:UñÈ1Í3êè?#3g9aïçj¾ôš˜¶ã¡¬ü¸mqÊ:…çKªá&·ÿÔJŞ	+Xó}FË”L(ŞC/ÁªİfCÉÔlœ÷B„+D…Ş¦¦jy†JTl‡‘»Ã¥z«:&3Ü0†gsªw›xûT7%S<u;ºa’?&Âğ¯ÂÃÕŞÙ^5­Æ7†N"iZvÙSÛüZÛg@õÀSc©dõâ1p´"Ú…°kìâ˜U³t› ØM‰+'FLdÀ‚<Ö}ÖËFo 9˜SÜcŸø2ñ!=LQ¥Ÿ¶ºãiÚe·TšÊ.ñ‡ìİ½Ù7±Üâñ˜„bäõó"‡NÃæT8x’Í„±€5({B{Zcg™Pğ#·rÕÖë²š3<åü¬á­A@õÒ»÷Óªsµƒ¤ò-(W;‡¹	…e1•^CôXjÃK‡İ—<8.ƒ¢A×0¦ŒÃXü¬¨1Ï? E{eU(w")û£-×(iiMeÒ²HGc¡c.Zı0É2>íùÛ¨­ˆøk«´Ş–/ØŒw#u¦±Ó>I†Õ°àòdw‹¢izâUåhÛŸ#˜+ÿ†ô{ü¿1¨zÔj‘eN"ÙÖƒ¸ùï~&$‹Ş¤*Ü³í{$[¶úúH,£ÌkÇ_P§k,˜¹q9øŞúî€JÈAô~¿[õ­¿káğşLsØÎ
qAÔS0"´(loS4ºì,@/Ä¶»ƒ5Ÿ'’µ‡0Ò‘ŒŞ1æìE$=TşN®-öœAãÀZ”8ùÌ‚_Æ¤@ùWÔÆÄ)•¥¦Æ¤>Oª ªªyxÇV
¦¯û/'Ïô¯ô5¬c ì\$”†š,ïÍæ•½Ïfï<MeÈÇ²ë×Gç^0ÌÑÖğ…gŸùª¯†U‚ÚpíÀim#ŠÈ…tîëVV¶’·OOßSÎı¢¤8Â´ LY˜£ˆÛQw³).Ìnó*¤ªpô¹ìòŠ‰“ó«ä0\•Ü³Â6~éş¹÷‘+”u$5Ì›PrúW¹2t<¾;N:ÄÊj—†F˜¯õÙˆÓ
qªèİ´‚Ÿû[øN6öğÅTÛÏ(¿¨eè‡Í%Uê>j_éñrÌÍn™ÈX¶úkF‡¢ò¹ïn;šzrÏbm—°¾l…æ’ø—­ÖU>êÿ¹'Äë¤I/¼¦ó|á’µÇÉE“"+úìU ·Ï í~÷òÁK+ù¡“Á‹İŠy{î;5û#ÎÛË´Â	sO¸¼Ñœ{Wüc;Î‡åwÍœYùà†æs3¤ÛùiÓ,½@í\Wvë›v^^I(Cxk¤ÓãdºdÂ´(€>§g§&'µ)8;!Óê¨¼V‹•â¿™
«ârˆÉ£Æé¤ Æáï¢tú^ùğÅ³šúMb‘±7£‘ÈC~cp\‘F±æ)ÂV÷#*šx!-‘Æ-k«§¬ñ.ûË°yÆ´E­Õâ$Hè!1»Å¹§†!Ş«¢ÊËY¢«È–Ö†f¾ã~,¤kF‚ ¸+Xf±¤.†õIZñmôÚôÊ3ª,¢Êç…zÇ­D-\InÅÁº´%°EÀıôF>“ÑØÄa{3šaW·¥cĞØš&‚Óåo½ì¿íhµxxjTÏwkøQ<17	ªpÈ·© ¸Â÷u#`¨¢»à¢Ï¤PèTYKbšEfÄıC,ñëéûéAÈú¤»oHsü¾¦¥[rNğ;)b-bÔ7F°Çw©eÔ±šìßz¡ÙÊH7b4£Óïâ;Ru»¬­ß”A–V*±i(,™şNLU>^3x| µî<ğ-ö¯ÁÂoiû¢5[8Í'¡”´Mc–©b©ÒW4²TnLg×Šfòá RÏu´i³Q%÷ğîÃ[±–dGe/lğX¨®_6˜ÄD=¾tœÛÛ¥öeı½-·¡-l8©˜ímêa½B¼4^¯NG$Ø
Î|¸¼ı0fCO0h‰Z¡¬NBşÖïşê<RZ'zÿöı!ÊË³Gj^Ã¼ëdVK‹W¸ºôÚ€ÆDù\F<8œ’ñ¯Ó(©èÀÖiâŸÚ€¶¯÷Y²À&@ú-ènlÛî³ªmŠ~İ¼&ºÇMşáŞEªáR£æÿÏPË®ƒ(Ú«óëSô7EŞ]‚É»Ï`š_ÇZ³W„y\‘ËŞæ—C¿Úä…J•öÃ'ùDÎıDúìfŞ3·ÊiÁ{ÑÙ>ZB5Û4±-äà2ô—òÒ\µ¾u!Ã¡F.Ûß0Û¨°ñm¸±	vWNxâø¯ÌAU‘§ @Aã
/W¿RƒÀpœÒMN«½¤í¬æ^’=®Æ´›UıCô—§Æï8‘>~à6ø,`ËRª£WĞÜz½Bè©ìã¡¦8ĞŞ«vƒ»fÏ¥Ã6“`í põ3#î"î3€ş¼á™­¨Ün¼³Şpz@+@ŒôËy`ùå“¦(¢`ÊO!%˜Õ^¹®ÏœèÁkå·ßs´…ğÙ ÛÒÍ„Eßfà}¦hKÚÍ8Yğ2ß;PñĞÄ[0¬JE˜K¨?£#yÄÛ6%ÄÜ¶@zìûÍ˜>
ÌÚCXO–÷Ÿğcç¿éVò7FLxïíVÂ¡ËKtÂ‹â'Qğ¨‘€ßv›¾ß
)‰DzÑn÷ aÏLË«h©?B¨Ø¨¥ˆ=åt;—MØ¼=ÆËKëx¨cOR
{!%¾ĞÊÊ:0Ëµ-ßN&ù_zP Oãg%U¤İ‰Ôb¦w4[ë}n©±@’Æ[b*0°ã"
(Ì·&±KÄ[ÈFz¿M¹Úí]†şÚ%’èèÏv”w;¢£Ø6çÔöóÑ‹{zøXıiÀ•{x¨9@Ê±`‚ĞÂ?J’i{›èº\²Xı,¡¦T†î|ğ»êhŞ¨ÎæÉ_é Ó  äş®Ê¼JeÈ¡ÜJé‡Ş/@,“#Ùú[Âş/¦ó'şnàÀ1Ş»/ÖÕg‹$ƒ<‘Næ<Ğ†Şe<Æ'(B&ékQBsJ^ E–Wt>÷§òêé6)ü1æG5y&»ê’c]ù/ŸÇl«)òÛ3#/)”cZ°L / eñH4u=[p<—}Lci0£R©?WapÚ¨dc¨®]ŸiuŸ÷ÌOq!ßt”u­U¾Á‰ÍŞ­Û.»(X‡Àï´Z+ÕÊ¥ßQ?#ì©Éq§ĞH(7Ù˜°îfÛn¢Mø‡ı©(*Ú»½ä¼Eëü}/¢±[õn|y"e©7@F¸r¨ÉìVs‚²öİ³ÿ·ø÷%Ñp¯Ş%Ì.ëJ¹=Î*„·™¹=ù	d'BØ¸›yã°íá»Ryù¬jA˜„‰û.TA@Áxw’ÜÔ2&í¢!ÿQ.øÖÚú>‹‰Í/**
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
          té.¹çXÄËä Ÿì U
8.×pß°Y>–«‘‡HŞ”É·°ºå'®ëú—ªh¦ø¬Qê5¸Ë]GÛàÇæÈ÷î 1Ñ%ş*`y1ì¬ş	U±î;S'î”‡e2“)"¢`½¹yFÛ,ƒ‘ûÀçHY1F|o×‚¨Û@ÀwúY¦¯Ó=/‹nA4¾­^¸€$v”g +p@óAÀ×³"Dq¸É!-Í^û&îÚhPø`b6W€-¹Êh¸³VæmSÌ¥hÙ÷z ]d«ğVEh>o˜Ii¹`»†íüi]‡Ì           !”ÕÆ!8˜Tƒ@¸ŒN÷¯]k™¿ŠßİİKnÓ57u*&G6"ğä\¯ë.š wİy_äÛ§ü.²rÛ¯Ë©$É¯QJ{pnf†•cvÉf€Zdw“D½*ÂwWJËøê„±F”ËˆD•Í	Ëx°¤ö²óÏÓ¨± ˆü ç‰2Ğ‘°¾¸­|«G­÷€[ºÉ8D@#¹…ÄW<Pç"ËÑ]«0ã^g-ÑÖg(³ßÖDnõ©š.	a|õ¤•gÏÆÑÏîÕ¦±´›ÉÀiÍÁéƒ® _àà^T_¯¯ÏÍ¹  l¢¯SµesƒÂX˜­Ó¹²s94ÜpÚ¾Ğ°¸
bçËíâ(EáUûºÚEe‹f'+[.×~–S|ĞÄvXgã„ı­…Sw¼öåÏÄõçÆ§»¬P\Ò¯º<÷™ôcÉK—‰$s\á!O‹ëëÙ3kex©”†šQÄ*‡š´:Ÿå#£Ú3T`¶€xìà!”å¾A`ÈØ4f…„bsSßÙGÍæœe¢“4ËÉQ*Ø	Á–²u'A~	ïÊ è@;e,?Êıòä+Z¥'k^ÏhÃ ·!ƒiNçmşà¥é·r„4“Î°ÛÓô4ãH~Â­b”a`Š·X–VÔ˜9›<Û¯G¸¸Ìj€/×û“^Xgã9ÿ›}4QCN&¡X@¨3ÅM6Ÿõá1˜4ç„K³‹.w&0ü!ƒ‹U!ˆ8Ë)C&mít £RˆÏcN”XP›
ÛäL­Ãëk!Ğsò_(r»F"rèöã Ğ¤WJµKy€0•Q €¶mìÎÕ{—Æ_¤şŠÚÀc!9üöÑ¥âä?Ñ“ ßş»°!U—ë.vÿÃü8 µ±”Á5öÍñ—¿3ÇùÄ’ğ.-ë~FğWBƒš|RÑ·•õS&ÙH¶³¼/Ã!2psJî‡&ÀH¼éPcÅçCŒ*÷“!”ÍÍƒBØ (Bõ”»ÆüÍõŞœUKªW*dDßœËŸ,äúËö·ñÁ/kvüv÷–ıÅzxâ
+ßvºãfÊG3me7ûT}Th‰èÛ)oóã¤O~ˆÑÉiĞtsmšz¼<d9ÁÄ8yûšÇÂa¾Ec¨Æ2ÎŒåºÅ:Ü’üã’Ülˆ0†·õ"K8ñ¨KPXQ…qTVh$ëæ—A÷:BÕ{s°3Zğª$a­[S9U¥ÀÁÂ¥±¸î{Š­2`2Õ½ëf÷ÚÁXñ¡N&£
-LOa÷"ş&èŸı:Ìg8 Á(D‘$<U€IıÄZO‰ÂA79ÄP!ÈŸ†€lë8@}3Uú>Î?,ã Fµıı=W}^ìëàë¦§áQsÏ9Q
º”Å–i
=é•ñãiÜß¨èBßëPj9ƒè+×€ PÃÑÒğ wà•¡uæqxGg}Ó£“"²8  ¼AòK„²²nZ
”œ®¸øÖÅnŒWl‹Ñü7<³¶Kè@°@ŞSutAwsdéSì_DJÄİ·ıçù ¸‹ªÀ,|gD­„‡ŸÛÎì¯¶“¤'ŞŸR¥—M£>³n!ñEö3üp’w;—b—® 6zÄ.¸äTIç2:# VY˜p÷UË‹Nîª€×‘?DÈ
¶„Œh)'a’–à¾˜¨F=^x"¼¶ 5ƒ¶X™íBÎ6mgEl-ıÍŠh˜Í1}VÏ=ÆØÁ_cù˜GGÒš] n·U_ù§-ãX=•L¹¨7Uf³“n—…,.¥;QÌ'Ş˜V/W†oü?ºAˆ_ñt<Š`ÎèĞ_Ù”í2Ğ–—"à=CçN)rêŒ‹4®ï“†9b¤Y3P•2Ïìort“ph¥#ß`ª„ˆ¯eŞ_	å×„­P¨µ)xÌ9ÚäímÂü}®¹ö~tí}bÏ¦mù¦	ğ.«9¹3N´•ûÛY’
+8M¼ÕKï	VÄä}Åè&«%ÓqAßWŞ¾&ŒÖŞå7èİ˜pæFYã I˜òÅ‹dÖ7?Gˆ ƒFRé!#[–
“±F¯œÕv'ôî´tÁøŠÇcQzÜ+ôWrÁ‹­ˆ-åH—'Ÿœ8ŸÒé÷âÌpê¢P} h/m[×hzW MhèÁqNÄ‰D¾”MdDôØÇ¢ŒÑ²Í³B}ù“Ÿ@|z³İa!&Qˆ2è”
ÿÁZ«ó1»¶õr»3üÌ0?òV¸e%s­+ıUšO½£¦"ÊHiÅpÔ­=í÷0şdæ‚óü¨»^1¨Æ™M^¢‹ê£b÷¼’ÿÌñ,O³\Ç¢¥!Iª†÷yö§ø³‘Çñ#k.†XàÀÅÜZ‘í­ØõŠ›aKOJ>¢º}§2…Úp´Ÿ’”ÿÿ¹Ü”€ÿÓiÇÖ”ğËq¤Låè6Ê8™O¾úÄxÁ]C&¢§˜m®*Åö6*o=ÕYšÂÉ£ÆXœĞÆ ááü™ãæë¹"²à{ælÃÙÓu
‰3ñ=·¤(ı~ßk*o¸›I½#†[\´àşlÌ‰˜ó,ËÚöƒI±B˜>úR£U³Yª{2ÙKxû„¬·ê|rÀ’[ÄÑÃI=0ÆÔéyõÚµ§„"Ó'óş“İv>a¯-€$’;i|"#·|wÚE(0B§RCjE0a6Z1E< Ñ²˜K£Ú…sãŞPMŸ‚ªˆ7¥ oŞ¦µ›2ç	M¥Ñ×è„&"R.zÛ·hìó¥8y%¦UÇ²öÿ{6=W¡hı¢Ò#^jŠ1Y`xÜ±Ô5Ê‡È+™çû-	Ÿˆ‡£¿ xr³F™Ë)6‚ÂKò³xNñDfÏüÚº¸dÆsQd[»2¯ƒèÿI¡›»¦ss*ı¨ró uºGŠhÚb'ì¹aeıÌÏõ”[½©úG]p÷j zŒ'u? ‚ÒgTAvA&ğ„‘sT|tà~RL×šÁ?:A$-¯ñ¤ãíœ&‚!8«”Ÿ^ÛŸuşĞvIz—%¤n™£a•ÒT­’UGñm_>¯py	Æf/éå[©±;o‰€:ûQĞ\Í‰=½Îõá;­L0Ü‡X
Ğ!MÛ—ÈzËŒMp‹F)u©ZÓ£¸Ÿ{ö‘¦_z@J©|DÿÉ¶§Æœy¿[ŞU©V~yhå{…Á—ö” j`Ö²÷*´s^[¯Ÿ“‘\Ä l‰)½éÜªÊzüQ¦¶ÆL€pô^«CÜ¤Cª©’”©•¥\|BLïòLV]ùş7Löº3nœSobEÕã¾Ê•)±Jğÿçvı©ôB±"âüO„K½7­ÓÎÜBYoG	¬§ÎÁ>ƒ8¬2W5:ySÙßM`æİ`€Çwab5}¼ÉŠîEÖÌKPŞ‘\Ç 
Õ–;”Î»áY	ENRr-,í®3¿>RáTÅ¸ó²C®AÁåÓbñ	CŒõ‰Uİ¢Õø&ÇÏ‰álá]ùêWˆ“éÍheÍşk|Æè†CnŒoq.>×NT·«‘'­ˆhÀYÈŒê5‹:Y¾~ÂF«ûk†Í¼…ÙÃ‰›ø9îº²çÿØNß»d{Àfí¸b0ä:c* ¿æxâmp™UÅkmnÜÛ F­OF»üŒÏu¡ôØ#rOg³)QÌ]€ú©©ü6wEj‹é?­?œÄT·Ğ©Ïıf,ø@ÃF¾äMéÙ½şÅ/#;õ®¦µ¿€×µ+†÷¯ñÍ3+(éÚYÅo.â™àùòGŠûµèzN°¼ºzK¡oOuı|%ë(øšü3ŞfÁ\ã?G®ÓÄ|’Í¬É)dvû¸+NPÒÕÀÿÕ„—££İ:0G2’y{¼È¯‹şÇ|ÿG>ó¸B©,l+v•¯PYÓ”T«İa]˜ü‰PvYù˜*õà¡ÈúG¾¨î›ê„Kó„ª‹­XµÇ79â¼|y º²“P»äB®x\5–Sàèékš÷•à¡®Ö¶û'§–ÆÉ,uüDvÅ‡ª¦ÛÃèrĞr7zÚ}İîÚ{ÚnïˆXº #¡U}vsk'úZ¬šäZ*Gí¼iItJıëVMåßİİ–#ª¥L™¸ÑN8Íj,%¶¡¦“ší¶+`=Ğ?ùqg7¥,Â=;<È–%Û!xçÍqå{¹¹ó=“ŠWKªºm‚¤TN0Ğß2ßøç(ó?¿&Gö€­¡.L]ÇÚ°€›÷Ò6Š›`Õ_ËmX	Ä`H×Æw>O0óA#ë÷cÕí‹?ëQHFÆÅ–zh£ i§„3ğ®‡ëÈÂÌDòò›^hkPSûÖÜ¥æ`ú§ØUÌM3Ï;„ÄC^|/êQŠ¶û¾Cl¤š6ƒŸÆXêC¿ĞåİÄÖÉQ7Â?a&,ÎD6fÓÿ:‹ğb~åƒT3p”¿ªbšã™‰*)ªÕ‚Gˆ¢ÍC$ùqù‡–Xy=,f°%&®* k7ÊÚ¤ËM@mV9®AØBXsˆi›÷®Gµ 
l®Ï­{õ}ÕÂÎjÊ9#»ÑÚÀÉD×î­ş³«ãÃùX™IDyÀ;.Ã'šç™†]ö­#CáàèF|jâX$ä*êÎRëm	éqÅ¯§ îÆÎı…èSÓâ?Ìæ”H‰Jš–àº¯t|Šn¥bbÛX¶„	tGŞôK¬“~V+İ´6ŞªLÆ]M”5q_Æ`§U´VÃx6œĞßñšeñÎÍ¬¼‘ˆ©ÂğD]	JŞ
qï²ªƒ<¡×i_Y]#6rææ ?r[$Iÿ‡¬j*ÈÅí_n1x&¼Âß)#ÒH¶eÂÏu'/ ZÚ¹<¼ëâ¡hÑ†mí åCšÈğO…»8Í#óyr¿¼,­ñĞ€9Ú†bæ¤€èV.ôŠ]Iu˜ŠL¶)ã«¸nù?@­N|`‰Óµ²&U¿,ˆ„ö¥qUÀîN9áP¢hv›îe(¥Pˆ0%p^ğ› ^Çå¼È‚Õ˜òÑÊK{bÀ#Êàî}Ql£ÿÇÊÀ0³‰1›ùî$IV%"ñŒĞôiŸÑR¸G„qíX±¨Üâa#Bâ§„$¸š¢tW”ØWïR(Òì{U{`Ÿ5ÖåN¸Æ|N±÷|ıÉ3(óô,±XböG™˜ üWxpZõåx&‚R=¸û]Q)Ô\ïDª"ó[ï§tæô[E¶BşÙÙ0òŒJâ–\%ß\˜;6¨êç„k~Âbù$[} ÓÃîŠáŒ9êÊb“ê§¾ÉÁÄä…àËvëÜîtŸqÃÓ>UNUXÄ|„€0ÓÔ*9°÷²kÊâä™! ¥š"™ó.k“Ûé¤ ˆÎ„Iá‰Vóİ|8dıêú i†ce›œ&‘W²|ì
hA!ŠÈ’ş2(•ÇÏd5*c}$¦6‹™öHY¼D³böè~”.Œø<º[KÆƒß2Ş©ÆUîê£ÎÀ@e Ñí);ö˜šb©{¯ÁI¢l*DV_¼úÏo›R¯Ğ÷™ÅtêÏœH‘>‘Õ½§@4“ Õê¹ÎÖM¿O"Eúê{¶}‘”`ê>	HEzô[½6Û+}Ê¶`ÎÎşB,AO&Ú@ê aó%bó¤–3ßŠNìå7L^eÖ£,JI¸3+JÜkC «a³+õY&â«@²äLaèÄİCÓpµ }DAÚR§–zQE™¦f<yÔØiaséñ–äœfŞ‚6%Xh4P@[PèQGÙ#yDŒ
×§\{r3ìA 5¢[9ç	ˆÙ§“¤‘)~³ d*…2îdÉùWR:gêàÀÑ>ŸáŒÍÛ$EğãºFb”ænİFJó2%	^#Ù?ˆÛíAú„zW¼‚^–¯}„İ?ŠG÷øÅO$|QïCã	¡uVi:²÷­Ã­U¥±²ÁOvŞówas-¡°¶R¨¶/Q^^k¯¹Àï~'«xn+
Ô<6Mm¨ûkú}
(æ÷wÌö
¢hš¤„*U"q~öC²íÎšáãzƒ†X“.óªÑHø«ìˆ¿XªıX]ƒ~‰€Š‰Û­š ¾Çå¢U+L÷hĞ¿İ‰]Ñà$‚Ëš'¨©Ñf{¿²gºG^É àYÃˆy8\‡­!K-ØŞjš¬wßÀ>ä¿vv%t!¯ø0ÃyôşünKë¤¿— 3@à e`óÎÜçÄ˜ 3"F	ğY›]ÏÚ€Ä×¸ÅÚ«°‡H+‰q³Gm©Hú¨ÁÀBª¨ëÙÛáN÷c4	œ¾©ä½õ»1oVÕã"«¯$á,°±ÌXƒú»uYµ*HDÒréa¯43¬í	¦Š:‘Æm¹Qù#²¾U¶;dºÉq•|$ş†t¶©—«D°V÷@&Â­ ,E¦Ğ&ÈEè–ml¼Êq\àÔŠj…õÿ
î¡¯‚F#YËC™K=ŠQ=0JòlŞÕ8¿K„©gLL¼f1D<^ßrŠÆc0p±ÈH$ÓÍÓ“T$ò]ã4æoı¦o÷„ã´ì$~[Ë´ú…Óƒ€K<Ï¸azûlO-Äè1mØùı4áÊ1óŸ;IŒ]Ç2»Õİäùr(«"–İrw<0SŸHnÓv®}ûLLó£ê¹1Á$'/ß:V,qØxÛÏÚ(K4ßu)Û¦¥"ç«  iÙp«'5È%ë Ay [—tØáÎG†®»X0fşu»d¼ì]ºyÚNGiàSæ–²ª ğÊ*²*jaŠ—jpy`ƒù‚ÏRJ¡•0nÚ­WÉâ" ÷^Fä+\D•â>Œ)&áÃº”ÄÑ.Á éƒØ<î“VÍİ‘x)âùeÌb± @*¿u|àOò–j˜'¡X™"¯cGLÖÅíOçİˆĞÜFG6ì5ÑÏ6Ø59ÇÇ³fÉ#ŞHí_hà§CÕ½hº›š¦'Û!½ö…†Å­õ×ÇS¶fªÂ65±ø(‡ äMö£,‘³(ßÀ2n>B¹
©sş”ëËõ÷¦£*/1 ê@Æ€t´ö«g—w4ÂÑá„=úõ LZh©ÆCË*lêÖÃ?“» ·PšL†f<íf7¬°$Z=ñoÌé7VŞÙÉ\½­…Y·	4'RK!Êˆ¤Ó&‡¨GCoº?Á‘¿,-ÁÎÃrˆL5,ÛqÃi6raNÁğÌU!Ã>)&q2[ôºeÊC
œÚsG$…×˜¹í5’2=	­o§íÔÃô›<Én²Xæibúƒ>e4«ğmÙ3Góš!™İgñª‡ÿ  Ãw–ã';Fí±&~lïÀ]áÿˆRÂY¶a›óè‹¹"râjeÉ®$R¡ğ¸è–g\t~â\’Äi!¨CÁwÍú„ELò-b	¿ ÈöxÊ*ÚŒËwkù2ûØfÕ8¦á¦ó\_7È#;ªX^bİ@Õ—ÚºÏ¯í•	A!Ò(ÖpR¯I ]ûzEYxû1'bŠŞÿ×àÍaü:¶ôaĞÀ¥7%}€:[ër˜½£ñe'çµéY§-“…PÉñS7N“ùêiÚy´Xé·¹Vâ¾P
vŞ©¯fxšfzË-W]æÏD5É ğ^LGUğ§[ÎÎÒèøäóüöõ¯c;teQ[ë
šÜ¬;Ó“Á—é…òÈ0EEÓºaI/`9¹è!C*-Ivrjº¹å‹÷ôÎ;Ïe¾2ıçĞ®%IóĞO”~dŞïº“—†@Ìdêtä.BØvåszàª—ãÀ_4!H¼UÄUÙçM<ØÆ†“‹1eD»ğğkì'‘÷Ô"–€úSªYÓqn_äñ5Æuu“uQ¨DI|¯4.ú.i©(öc²d5uèlh|$*Ğë!í3
SÜ÷^¡ZÊÆÉØQ±Ge¯D–+ëƒæS±ßØÑâ¤•¯H‚<}7¹}_òC|âü˜@ÅÄßsù
ùvÃäÂâ;…öñ@oş¡ ;™URÔãÙxQOwzÓŞá|ÊRW\åq÷
@ìêÔî™¿ĞLá'ò²\ñxÏu†(ßš¢°"z‘qÃ£,„½pèÌï«Ù"¿-§_§vø¡3wÑ†œõËõ«Š»^µ%Í¾„3mÃ}fyëº`ƒ®R‚ƒÓ)ª¿ò”§(8‚ùÉ2µ$ŠØx»3åÆ¥PıSGË;í3Şb@iŞ<E}Ï+â
éènÌÓOh“CôÉa}ıyÏh`Â‰ks‹¢ÔÁdìs7“Ä…N×·F©¹)g+ct½y89“=(˜0‹Z´øp4n3,D|N´LTØ¤¯Â¬MtZ'ÊW† L±sÔØjÜ
^j±B
gÓBøX…áWÃ¿üXó Õ9áÌ]16Üjš£ nó
8#¼‰râßæ(ÃSĞ›]¯&¶1Iù2g[!›	q86k?³«hŸ¦!mGÒÅÉ9±‡k;\RÜ&…ÀU)ßÍswÓQ|è·Ã¢qíïÆgoWs‘L¢M¥ õ‹Ÿ?ARVÄÎµ¿7kNM\ùéµƒ§‘î­ŸL\¼“ûEDxù«üÖ ÉÈİ	S!eÒ)N 8érÜ‘Š3k½	n-í1êD=,]ÜDh¦86d)×c]E«â1(&kì€Qšš%Æğ>Ã†ÌQÈépç³µ‘¬¹,¨¾DñH>{Á1Ø	  ‡
E.ph7©6ãÈ)—1c«çxÑ?å[ÄTB†X™}Â KÙ“µ‰Û¡ºãĞ§ÑŠÌÅ&0–9µMşÁêG¿é°ş¨FÖĞ,jiİà*ÈocæÎŸMËØRbç‹jãkd“&Wğ­ãiHŞ†ô€ğÓ·İ'shİfw/¾ƒXÃƒüK„µ³à::@r€.AÄˆ„¯ßsz²ÇqÉ7İÃ¤çõÀñiÔøäÀœ˜C¨=Cm[¡0^Œ&`U:—©FJ e.+²yƒîÌ‹¢§±»øuôğHšt	V‹êñnuÆbµñUıZ *Ÿ8"S›Íï‘NäJ×‘5œì½—¾¨IÍBÂr×ûäøA*ŒkcèL¢S¡İ#_nÔVWµ}@\	Êwg5jV¯y2"yMüÌhcA\Ùáèa±š˜ÿ:¿õ2†‹‹Hÿ†×*S1^à®V•z‡â·³¦zµ1àâµbW½Nwq%ójÀ(=LbR
ò«Îú‚e¬š·×§nï->F©LˆäŒì^¬#.!jÕ’yŞ·÷mó8I³5P!BX=ºX`½SxÀÉQÌd­[ÄyFùıRÉ¾İœÛ^D£zf,l›LŞ
„~:âN.ç¨ş"M'0–íJ=œ,[S”ÓŞQ£cîj¬,:­*òOjEäM¿ÆXœDhJ±IF¦tdFøç" ”ÉşPeÈ‘\ndöA o¿¼yYùE9‰ƒ.Î¥–ÍOHëß¸BÒR£åP?^oPì¦Œ=€¼$ÿëº{:Ìäƒ½’º/7Üš¹€[å’@DˆÀ£SÙ€§æ$	~Ş¹=¡kê‚¾PĞîÜ¼ÌŒş‹ãH:ÿ±7áJ,ÓoŒ’k“?ùµãó/˜ßeü~!¸¬&HB¯ÃùoŸnğCbÀ¦[DàÁttÔNLÆ’œP=
>O~ÊD%e¸Å AÃ­$q¬7ğdúß³°w8ãÀ?%Nô‡È¯O_$â}Ş½‚FŸ­VÜ|¼J%ñ#vßú–·'¼ˆ€f¤‘q4$&†ÂPXÁX±¢aßúSĞ÷,ƒ>åËV`Jó†¯×¶›yDI‹µWê‹Z¡SbÊ…Z7ÔÆcĞñ9ö‡ô€™0‰D)Óx—©éc]«Ôé%×Y©ş†ğ´ÓTÂ“)‹_ ïı9à{ÃN]ÒÍ„Õ¯^Jô"â~åÍZaLÖÈ&½æ@œ°ó=V¬Äêd9ÌhÿÿÙ$ÒúS'‰Ãy²Yİ}-‰ˆ7»_bÿÁS	îK‹¦¹¾ÖŸş!"Ó[9ÌM•šô	àüD®®²‚.ŸÌiş§9i¥`›qĞ)Àİ†Iâc’¸Wëò],8æ’™ñÓÛ~ñô«‘ı·±İµÓ‘VÍg‘“)şc¡JrÄsş€æîµlÜÖ,µxr‡íl7Ëm½–G_İêÅÿH|/f½V~¦Å¹~®2}•!…èV-?O;¤»8á*hÛÎ‡½i¶½-v‘†àÍİkÇFnŞCËfT; #İ<N®—´gØVÖ›dØC¿ŒÚÿmXêâqexï,[â‡fi£‚³°ìÂ†¶pßÕ%Gp    !”í´ƒe’XÜp+ÍñÇ3¿‹î¥ÊÚuŠ”‹ÌÔm”Û­Ñ¦ô¤5şSŠçÀ:]şâÃä)„D6&$ğî4ëğ3XIÜ6`SRf–P(Õ­Ÿhc‡ETd3V£
3–ïCñQ™ú_¨n¼uôy›€ÑÑ¢‹ÒàíñJ(SYã_âÂ“ˆŞ^TT¸Äqw<­ìÿõÑ¸¼œøTş“l÷7¤Ñ…V€@ø½?¾ÌQ¹(éÅÀNKŒ‚*u¤3TÅx¶½ôQã|v‘E*üàNEÌ ñ¥<¨)a= ›ıRÔC‹²àĞ<à çÁwµsöºxZË€¹;_(ÄY2ƒá ±Ò¿–· ¼4 /MfÇ‚‚é“B=º£uØ îp@ZmJÌ+?ÜSŒ&Ä"x·J8ç(¤(*”!Aê®XÕWµzãzº ^İİlw]Ÿ°¤"Ë%±o\.S`ç®*'4_±„İ|>}´Øğ  ¬AôK„²²nZ
•6-Y©Ã )°±d}Ø'‹ñäOUşëÄ…ğà…\Q«†ĞMXTŸ~Clj÷ ‘À@vh®çg^•ãQ?®ş“İï!‚iäºµË›\œÉ‹Êb*Ú
U-Hí)«à’’›‚Ìq¢XürjrÄ	áêj3z€ÄÃ!Ô¹ò2È ¢Ù!.^%Æšlv™|xå¸¤ÊS¢;<E•³—mQ3CaÊ‰E¸[ÿx½ìM)ç[€_İª†ĞÏ¦tå$P^µ†È3¡øÖêÄı3±ò˜q5ì0€€:6ñT<ïÿ›^tBÍaX·¨­­fM),a+d€©<Yd¹¼Ioª3ĞL–æ›Oƒ÷4ÄNs4”c8a~ìQ‘­TçÚÍ_~©/öğü ^ˆb:ÅĞÅøGaGAQõJœ•í#>õ67[æ¬¥Ù±!+Ü((•Ä•;Ö‡|ßê4“ÛA¶»ïV.Êlù
F+WZ´Æ{àøqäP2Ê`>³}dÛq…&Ê
¾i_Ï%xOH”òÖs:Lèñ(9`¯¬N‚¡Åì=¥à
ÉÚa10!¯ïc‹
[şYÏ[_ÜÕğ!È‰^ñìjŸ!Äšªkd¥d+C7Õ¬(
£f¨\ –ìà„ÔØ¼¯§xas•)<«'}÷	¢»âêšØÓóoH3r+½k£rgŒ<öÏËJ§j3Òoé38k¢ÒsH3œòÑ˜Èº÷Ú±º­0PFŠOù*0Ä½µæ¶Š‘( nó³:Qo^-f[ıêÎw¿	ĞfòøÂj|º®¦p*B.4¤È½y3,Ş¼®ƒ#g*Ç6UWGê†×oœé-íÖrƒP}+µéhÈ ³RoAu-rok§ÊHM şB´ÄÍçK?üÁ«Ê§ÌŒál»z#‰›¨©ş6—‡4‰ å#1¾ø¼“T’riÛsËıl §ñ	÷ùNb”sŞ ‘0hí6LM‡)²Ãz‚ä)©™İW=:æ‘€o~ïiÑh E<ük}l9†?îOT¸°ù`ZU2Ë­­~ƒrä‚#„Ï¢Uòš¾ãş×BÖµ5[”3UÇöA¦eê©” cU™ŠX·Ûis.øÉJƒí|ˆ0ç^å®°Y¥	€Øtª‚~\,Á+ı	%VàÕ?ğ0™bıõŠ¾¹÷@ªeRúŸM¾B4zç„“Ì²C	hŸ}¿h;%Ó„·ª0­vˆP£€,®w
•<l1¥­Y1®ÒJ}s÷Jt£i:0R¯ñ“V~ Õ _€ 2„„¢êÛ€*ÅZõ™$"©%MˆÓíığ%*œ¦¾Ù‡Ù	˜9çíÃŠe°çüd0ìJ›åìÙ]=R2¥¾ıÙZF˜Wä×IŒ8­„NôÅ:Cccì§yy‚àæº\+í¢^R‹½yPgŠÃ.âøã‘~~ñƒhÓ!ö–ñA@ÚõÜ~®×İÚd·u ë³}‡÷œ&´›g[&¦›×T\r*XĞs~6GF~#Î“]%D	4İz×d› ºBµ¸É¥?Š[]lâ©k5ütéàÕsGªæÇ„›’Ó¤¶¹ià"ú×îDk*Ã´I†ï!‘Q€6ÊjÜ+A¿ÜƒœÒÀB‰}gı4(Û
^

ûíğQŒEÿˆéÔYºSÂUpùyR¹ˆ++¸ëıÖ]Cä~&J×ÂÓXĞXÄ*{Ÿkù“‡&o½ŠÉİü‘BŸ®x"¹}
ZTÛ~BYj~g"y!&î·5,¿¡
G)¥f­ç!çIÊ‘ª¼fLÙŠöïÇ¼xòªX­×OÖE0pjÄ›˜¢èuâ÷Ò…‰J^2ÄMDV¢ zs@FEfÛc8Ì:VÜooDÿ >o;˜[û6dC «ÏQ¬ùá”à2äåByl‡ï*ğ2qØ+T6bzëi;5.ƒFQ¿9‘­‹Bjfi,ğ!"§:ÍôæPi\nõØŞ¦è/m TyŞå‰¾ »¸¸Ş™“)w.3(%D.áØ¹Ì‹G¾Û¶­vªFNÔœÌÏ?æöúÿí{~m§ç×feá¯ç(m„¡4Á—ñŠj	2IDƒ¹ )^ -F‘ìœ¸á»:;n)nu ï — K‚éAöĞšI3àØün¸)[ùqıŸ_»;5;Û©Òƒ†×Mz¼8‚Ë¼%Z»ß¯Q ,‡OîjñXØ{„t™üêh< ÿF‚aüÒÕJ´7?ËìgÃ!)>Nà­ZÈgÏÜ, åÙ¤`Ü/©e’ÏAAL•ÏõÏ™ÈYåY“›gèŞkj¾Ş‰ÜÎZ#£†¦§XbÛ\2<ÊœŞ;A@`]¬¸Ò©Q¡ÆZîfÔò. •†éyÃVÑ+ì±á¼^FÒøfœ»wíq´Í3q)“ƒº"e–Œ€Ş®oöã x³EOÀYÓûÊÄ<®I™1›lÇ÷‰şğ—ñì_û6¶ä³YØ?1<3=lÔ«ò_Œ»Çe29ó/¦D%™1¶gÖÆßÇÛßD¥sÖ7WØ¢Lk|bÆà´oÃòĞLöYù3¤šà$fÈ½3Á)g8–åµ sıÉ1ü(zÄ)[÷U>0OQw/gSÏä'}'{¿„Vg¿ı­×¢:bÂf¸a-#2ïÙ:ÚQT#Ô5}´®sVÒ9=+üG9îL¶$óĞ}­¤må”Vf5†ëìĞ»cøë|›oßN>xuY7¼i&]wX´Æ¼ªgä&3—H‰»€zAüI Dø¨Ì£–ÙšéçRWñô€òW?[ÜêÃ4íw)—w‚ĞS›,ä> (d£9v?Täé;ÁrÛã‹^°Òî°,øgx,÷Äìsï È˜j>DÛËZ}Ì9û"\ÁpLğ<£Ò¥Uö ŞMå (Jı§×ßÒ+,¶PšÓ^"PÆRúÑ¸V[Úb½Ö&¨Õs ÷‡«0wOJ¥y\¸#¹{&Æ/;»]¾ĞÑs;V‚{Ğë# †SêT;ùÃ¡`Ò¨¢—ƒÀ$…)|}¿ëGÍ"ãj‡kù±ïã¾b:‡şVïu³ıJ8sÓã"òc0ØL}Ÿ	rîcÅÆ°Ì?Ór`"÷(ÈFk;_?œá-òİÇv´E¯ÜûÅŞC}Ü‹ÆÓLÕR¶.Şë7),G@¿^:9ù÷•HÓõ„³ínï[/#Õ¹µ¤‡<Xl üa~ãµP¨Ï’+0k¹†.?oqJ”cÎGöÉê¡Àß1Ñœñ”h&àÕîB\÷Â€jµyâ:±*ò‹B4<K$ÎÚ#”ğéäL¾ß«¨îÖâm#•éó4“8½Áçgg·`«É•Ç_|ë¢vbyæéZE³GÌ®ˆí&¹ä•m‰–ëš 3‰õó2>}ÍfüA
¡-G{Õò
?õƒöÍ¢ÇR•õşïLcàëÂÆa°³ûì°RE€-é2³/88õiÁº[j!ç@ŒxŸ’Q.¿\»ŒØxÚ
…µ?êG›ÕÀıˆi–2`\NeÑìzÛîÎˆÔ(~­@&D1Òf°­qS#tøôØ“…sb©¥Ù^¨.r€ºµ°ñ7	FI8z…F‰0B™ˆrŠ/4U´ÏÕÔïÜFN”ÀŸ\[ì¡hï=ï©‘y8·>Ò‘É»Z>7© v-ŸRtZ'ùL”L_ïöm%êE%px¦®ˆ”«×Ïóª.j@¨CÌôÂfœ¤è¨îptE^L¢è(òäãéÀñÄıßf¶4ZšÔ3¶g;8šFôI‚ÖµGC·M±kI‡ŒùG­(ÕÌ™#R¡ÃÎË7À’ù¬{kÌGT@¿ÒùE.¤³ƒ|¬1¸¤Q¯WEÉPo©‡-]ØUb¾ŒR&+\òV3Ì©Àæ/ügğG°”²3Ëº ãşÌ7gkŞ9«†ÂÅô¿-¡9î,p0ˆ˜s¦¦Ó?^¿Şìuó­±}]ÄCùbá2B=ÀãjRY.{×çïÉn|C Ä€·ÉBıÙZ‡ßiÊ›úßÎÙVfâqQä*Kî°7ÿ9‘Êõu}bİE9rÇ˜häš5ÃU«›““íi‹R˜»Îù”jéFNÃNq½šm¾j!Å¬„¿Ç4ıá°"Ve ŸË]9az+RÅC=£hÓ¢TV¶uº1â ‡<0V–í5@e;†ZÆğ}Éó’}öòQörE‚-Ueµ61Î1:\TÅ¢¨Ø-ËÀkıš†CaB+¢±–s}D3ÏÎg:??\)'ÔÇ)FÀ^Â=É¢›j¤Â…Äİ9ZÜÉh¿,`~İfŞû·¢Òª]ÃrhßpãëiÓo»ƒZÂ¶Wûm
Ú`Ó¶M‡ñ È¶wäWÿ¸îÊ\tw˜_s†…·+ŞĞÃYé)âÎ%í7XDúùGÚ'3¥â¼÷ÿÂõBh@iĞÔ—¿÷¼ôe‘¥¹ 0vzÁêˆNŒSüŸö(¢Bñ…¯'9feà;î­ÇCS†z yŞŒl	ê‚€·3ç}Yà$w&ÿA¼pq{¸•]_ëK¢ÜŸ.b z$^cåø7+“ÃÅ$æÚêj·â¯Åtpr¶
—Ód¹iQ`ÅªÜ¢ ê¼k)™_~"ò;áÇÌê]p³išx¶ÊÏJrhõgpGä§(îE],Ópä·H¨Rğê¹X ¸l©õ¯³¯Æ1Î!’=1zœiğŸn—ÉˆIÿêÿÏy)DôüíŞ¨å5Pf”m…ŞcÍ´e´$ãİóÿ„­}I<¥ p¹¤³J/Já$âËNäX.\Šàº%NìPàô&98&{„-½ş®’?h\ŒfsÁ}zå†5ºqzĞ}‰'j,J·ñá•yxïVx§Öƒ‰¤’G¬¤‚ApßKå*ùwr„ ô}ä9Öé»MÚvò^ı/¨?>g'tèC68~ ˆ[kó$ gíô3Èî^Áy‚’Ä¸š¹—·†Š f®]Ò
8›ÆÙª#ÂIÉ¨W8;‹DÂ–°Ø7ÀÖ
JùõÖÅ>s’v‘Ò§áY¯îh<ª× ı½Ml+n]î÷ã—=ªÒPG\^éüç£y¶şDD«êû!`ğóq¾È9Eâæ]ó‹A¦7ÕüÑùñ\ñ,GÁwl‘ÈŠ©‚+Ú6ë_sùgR`9
”&ü¯µ>H	¢×å·f½„tèmØéãÂº5ò†Û­‡`?]¸ KCfè^ÿØMšÒÂ–ÀÜ:w‰\ûŞ«ÀÆIğqù¯Ó>ÉğŞwØÛğ5­Üã,§üe${û3Ê#|>±ãÿËGôÉ6”ÔñÙÑ0«ÛÕTEÉš—í³ÇÖKpZNJÎÑJR5À‡Û1^&õD Ë<ZÜ‡£Æ@F	d¥Ãò¬3Õš ÔêÓïFŸÑŸ„×½á†pt´¿ÌÛ<FÂŠî:µi°“Œ!oWìä@Ü]g–€fŒ¡|è!ûC]€ŸV§dHÍ–i(r…ÂğpFÔèCä<­Æ4ÃÎ3›@ØsVö€³3MÈ „˜~ÅäÕ„LK¬¢ ã¤Ü†|Èz¾6i‘÷¦}b¢£ãµó)—É·Ù÷œ ñå>6Ñ&C…­˜*ÄÈ –Á RÕĞéº‘|²ˆî¼›®¸Jd‘/<OA€ÂE®|­2ÿĞe™Y%ÏßÉ§l"²»È,Rs1)¨ä—Sº}r£©Õ‰2UâDƒ·dõ™i…yg•x³ÌD›;«+Y°¶ª3‚–d5˜»Vüqî“†Ê/êwr„‚Ü<8˜'ã¯9y+úB$HöÓ/ßËíÈnõFÊÒz A–y>gæ`$áYÿ{şEáœİÖyÔ¼wGlˆÓY»ªA–zF›¡+BmÕª•Î1J-hšHÎ‘&k½joÅÚb	–±CËN>K%Daçc¶f§R,˜ŞÌ«¢½ºÏâk0ˆ™Ç`ºË0’==¬(¬jeß.Äzé4Ä„®Yà2àwçGn·$ƒ—Ì|LîÁ(~¡ÉPÉöô‚JkÌá¤Nbb§"¢wjÑ3Ğ@0ü3¡ÌöÔ<O:¥èÕP]G7®åwÃ7ºÂ±±ÂèåzÕ#Äc¸zÿò’e3Ò \é>[Müs<úŞKn”Ìj˜p‰üÓï„…ëĞ^Èoå6­¡•MÇÎpv™¹Ïã[3$„gÑÚâ6)W©È„÷ ˆkª«¶¶èÜ5SßAµr\’‚7Ó@SÊæï˜ E³5¢Xß	ÍZãM£âEÜDuhÉ‰ğ¬ÛUŒxY‡W¶“ay3—~í¾H]ÿ$Uœcá(¼ùèş³<ñ³/Ù¿]R?OAŸÉ`Weã^xf·€yr0Ló•ñ™v1âOÀöÇÏ2Vî%*¢e¬ña²Ùìz‚.K&Èûö¸ü°àO^1\üEBVš!yU>îÕêJ¶·†<‘r¸VUãÇ®Vc‡w´İ¶Ì9˜Ge'æé“h]…
Ï¸jŠQÂèËÄ%¼~ëMJ4ic~—2İW9¶Hç(²B¼¨9ùüOO·½r£'ÑÒÉ^)]$ut‚·Ú§A˜Öó.;GÇDìÌû‚\K‹‡Tšë`R=İèV9ÊX2ö,×~;ısŞÿÍ(.t¦_w·rf‰ v.ìI¦íÄÅÕğ3mÈ2×ÓÓ$v°èEü¡ãVÔ¼e¼-pd6wQ‘ò‚ßğı>ôõ1wÙ0É1ñEÕ‹™dÎ*éÕ¢ü’Ş`h IÈáƒÜH{‹ãò<Ëû¢Z›°g
ËHĞã¤ÓF#í¬Òjü°l7Õ˜*/ñ…ÌrÙO=Èô
š·9(33îı?ÚO)ÃY=ÜlZàl®Ø¦†[wãW‘ù.$°t/ÉmÌºà©™Äf$ ü´ÿqãt'âªZ¼ui½İ÷ô²º7³ÖÕûaHö+
¬3Ó-KòÙÜïrØX/ûBlùU×nôkWô—¶d|ß¤eœ ¤8¡ÓÁKñh…ónÙJ’<€‚›ÑQINEsŸí°=‚‘¢É’üô_wü¹µsb ›êÿ~@Ü¦AÇ±dĞ§ãB?Ûˆ|­Şœ{ÎBÆˆ©âpˆx²-#Wó¿¹×ˆØ8°Ah7v¶è»l7ËøúÁfªÿ‘º—õº®A|p×~ò3¶$á®z­Ç¾1:ÈÓP…ïV®HÏâAÙ³#mš•[d‚)Œ½e—fœ½#×\šÙîÏš°[”Ÿ¡6uŞ5éD€ª¦Oí¶Pœ“Ê\!:Ìª‚P §§ø#0’3úÑI–ûâ#J9Jsë{±`Ûõ~s”ºR“+¥_KY^¨"ïÏòÿ™íÒY{ .ÕÌ›¢ÔüåeˆŠĞ¼it‹)T YÖìçY‡Ğ&»Ëí¾.*
ëpÚå:<‘ß•ÚšG–[“êİú+q½®¸³>ÁôÀ>ÆElVØk8Ö,½s5ğíùZ?* ¬SÌÅªN_üiÑZäı†üE/üÜa7¼)Û}›SÜìm©ºSwÖŠ
±Õâ’“ÏÀeƒ¹ò*w_¥Qö±6ÕUù·EvÎ¯÷˜¬áÄoü¤ÃMõR†2Cuu.L£¹ß¸j)` ñ¡ E#P—Öà d/O°peƒ‰f²Úf¥Ee£jCœ€Í“üYf¬µïŸnt[ùñ («šîùøˆ;ˆO®	‹%â4ç}©%¥áĞÁõæ-¥uö/³Ó‰ËöÈts¬—Í‚à^¾r/]—çÆøzm–Äæñï`6‰ÆÖĞ«ÿËxñˆ«&CçjÃZ§R²!ôÒ]§°6ÆŠlE?•¡€èAOíÕL7$>ÊîÒ’¡ø3D%Ù¯Ÿ éz`k²½oçŒIÛ'ÔrPŸ’%a:“·Ó!ßÉ[ÖR‡ĞÎ JJŒ,†Ÿwxç¸ĞUYˆ¾ËÍeÍ;ÚC]~Oçüm+i™QVĞ© Ÿ’
ñ—±ÀZl¤¼²9N¨–©œ|gŸCW+ê´à¯ÖÂ{3k¾Y	WlĞäóH»¨s„-b”!-›šĞé3,î Ù²¤®ú©«Ô• z>gª…ON^ñn±,D¶;H†_û9zS©««|q>›DRãçÆ{²ÁlŸ«AŸè?ˆÆXÇXÊVH;>Ğ°|zø1¥›Í^´†â)g²×häù_¸áo¹b’ó®z7ÇãÂv*öİŠŞşß™Í”7SÒÀö©ïLõ¯äZ,kÇ²bP,.Lv}­F—Û¯JñBò6ÏŠà'ÁT&Ü£éÎÒkJdEJÿè&mÌ3z‚"]PÁÈGø
Xµr)ÓWˆ†ŠÜ=Àå}4¤>Ip?å1*‡ÏÚ—(ìG¹œ•û¼'…)ŒzgÓJõiÁ®ÔsP«j9ÍhE"Êâ›29à->‡ğnŸ»&ÂË/T9cl÷U$ëïyGÇV<qXÖÛîãµV
[Ñ9ú¥i' ^´ {°'’Æ7ĞÊDP;Qo8Õl^Ğ1zµ1W¸µdÚz(WYíg;]°¸­‹øğEfbìEçNÑ­Üïú5ˆFz¦üì†I¬Xòµ)\v—gnhŠÙÕºã$YºÓfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
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