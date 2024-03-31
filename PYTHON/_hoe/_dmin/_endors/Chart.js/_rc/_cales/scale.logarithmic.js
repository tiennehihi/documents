{"version":3,"names":["_t","require","blockStatement","cloneNode","emptyStatement","expressionStatement","identifier","isStatement","isStringLiteral","stringLiteral","validate","populatePlaceholders","metadata","replacements","ast","placeholders","forEach","placeholder","hasOwnProperty","call","name","placeholderName","Error","Object","keys","key","placeholderNames","has","slice","reverse","applyReplacement","e","message","replacement","isDuplicate","Array","isArray","map","node","parent","index","resolve","type","undefined","items","splice"],"sources":["../src/populate.ts"],"sourcesContent":["import {\n  blockStatement,\n  cloneNode,\n  emptyStatement,\n  expressionStatement,\n  identifier,\n  isStatement,\n  isStringLiteral,\n  stringLiteral,\n  validate,\n} from \"@babel/types\";\nimport type * as t from \"@babel/types\";\n\nimport type { TemplateReplacements } from \"./options.ts\";\nimport type { Metadata, Placeholder } from \"./parse.ts\";\n\nexport default function populatePlaceholders(\n  metadata: Metadata,\n  replacements: TemplateReplacements,\n): t.File {\n  const ast = cloneNode(metadata.ast);\n\n  if (replacements) {\n    metadata.placeholders.forEach(placeholder => {\n      if (!Object.hasOwn(replacements, placeholder.name)) {\n        const placeholderName = placeholder.name;\n\n        throw new Error(\n          `Error: No substitution given for \"${placeholderName}\". If this is not meant to be a\n            placeholder you may want to consider passing one of the following options to @babel/template:\n            - { placeholderPattern: false, placeholderWhitelist: new Set(['${placeholderName}'])}\n            - { placeholderPattern: /^${placeholderName}$/ }`,\n        );\n      }\n    });\n    Object.keys(replacements).forEach(key => {\n      if (!metadata.placeholderNames.has(key)) {\n        throw new Error(`Unknown substitution \"${key}\" given`);\n      }\n    });\n  }\n\n  // Process in reverse order so AST mutation doesn't change indices that\n  // will be needed for later calls to `placeholder.resolve()`.\n  metadata.placeholders\n    .slice()\n    .reverse()\n    .forEach(placeholder => {\n      try {\n        applyReplacement(\n          placeholder,\n          ast,\n          (replacements && replacements[placeholder.name]) || null,\n        );\n      } catch (e) {\n        e.message = `@babel/template placeholder \"${placeholder.name}\": ${e.message}`;\n        throw e;\n      }\n    });\n\n  return ast;\n}\n\nfunction applyReplacement(\n  placeholder: Placeholder,\n  ast: t.File,\n  replacement: any,\n) {\n  // Track inserted nodes and clone them if they are inserted more than\n  // once to avoid injecting the same node multiple times.\n  if (placeholder.isDuplicate) {\n    if (Array.isArray(replacement)) {\n      replacement = replacement.map(node => cloneNode(node));\n    } else if (typeof replacement === \"object\") {\n      replacement = cloneNode(replacement);\n    }\n  }\n\n  const { parent, key, index } = placeholder.resolve(ast);\n\n  if (placeholder.type === \"string\") {\n    if (typeof replacement === \"string\") {\n      replacement = stringLiteral(replacement);\n    }\n    if (!replacement || !isStringLiteral(replacement)) {\n      throw new Error(\"Expected string substitution\");\n    }\n  } else if (placeholder.type === \"statement\") {\n    if (index === undefined) {\n      if (!replacement) {\n        replacement = emptyStatement();\n      } else if (Array.isArray(replacement)) {\n        replacement = blockStatement(replacement);\n      } else if (typeof replacement === \"string\") {\n        replacement = expressionStatement(identifier(replacement));\n      } else if (!isStatement(replacement)) {\n        replacement = expressionStatement(replacement);\n      }\n    } else {\n      if (replacement && !Array.isArray(replacement)) {\n        if (typeof replacement === \"string\") {\n          replacement = identifier(replacement);\n        }\n        if (!isStatement(replacement)) {\n          replacement = expressionStatement(replacement);\n        }\n      }\n    }\n  } else if (placeholder.type === \"param\") {\n    if (typeof replacement === \"string\") {\n      replacement = identifier(replacement);\n    }\n\n    if (index === undefined) throw new Error(\"Assertion failure.\");\n  } else {\n    if (typeof replacement === \"string\") {\n      replacement = identifier(replacement);\n    }\n    if (Array.isArray(replacement)) {\n      throw new Error(\"Cannot replace single expression with an array.\");\n    }\n  }\n\n  if (index === undefined) {\n    validate(parent, key, replacement);\n\n    (parent as any)[key] = replacement;\n  } else {\n    const items: Array<t.Node> = (parent as any)[key].slice();\n\n    if (placeholder.type === \"statement\" || placeholder.type === \"param\") {\n      if (replacement == null) {\n        items.splice(index, 1);\n      } else if (Array.isArray(replacement)) {\n        items.splice(index, 1, ...replacement);\n      } else {\n        items[index] = replacement;\n      }\n    } else {\n      items[index] = replacement;\n    }\n\n    validate(parent, key, items);\n    (parent as any)[key] = items;\n  }\n}\n"],"mappings":";;;;;;AAAA,IAAAA,EAAA,GAAAC,OAAA;AAUsB;EATpBC,cAAc;EACdC,SAAS;EACTC,cAAc;EACdC,mBAAmB;EACnBC,UAAU;EACVC,WAAW;EACXC,eAAe;EACfC,aAAa;EACbC;AAAQ,IAAAV,EAAA;AAOK,SAASW,oBAAoBA,CAC1CC,QAAkB,EAClBC,YAAkC,EAC1B;EACR,MAAMC,GAAG,GAAGX,SAAS,CAACS,QAAQ,CAACE,GAAG,CAAC;EAEnC,IAAID,YAAY,EAAE;IAChBD,QAAQ,CAACG,YAAY,CAACC,OAAO,CAACC,WAAW,IAAI;MAC3C,IAAI,CAACC,cAAA,CAAAC,IAAA,CAAcN,YAAY,EAAEI,WAAW,CAACG,IAAI,CAAC,EAAE;QAClD,MAAMC,eAAe,GAAGJ,WAAW,CAACG,IAAI;QAExC,MAAM,IAAIE,KAAK,CACZ,qCAAoCD,eAAgB;AAC/D;AACA,6EAA6EA,eAAgB;AAC7F,wCAAwCA,eAAgB,MAChD,CAAC;MACH;IACF,CAAC,CAAC;IACFE,MAAM,CAACC,IAAI,CAACX,YAAY,CAAC,CAACG,OAAO,CAACS,GAAG,IAAI;MACvC,IAAI,CAACb,QAAQ,CAACc,gBAAgB,CAACC,GAAG,CAACF,GAAG,CAAC,EAAE;QACvC,MAAM,IAAIH,KAAK,CAAE,yBAAwBG,GAAI,SAAQ,CAAC;MACxD;IACF,CAAC,CAAC;EACJ;EAIAb,QAAQ,CAACG,YAAY,CAClBa,KAAK,CAAC,CAAC,CACPC,OAAO,CAAC,CAAC,CACTb,OAAO,CAACC,WAAW,IAAI;IACtB,IAAI;MACFa,gBAAgB,CACdb,WAAW,EACXH,GAAG,EACFD,YAAY,IAAIA,YAAY,CAACI,WAAW,CAACG,IAAI,CAAC,IAAK,IACtD,CAAC;IACH,CAAC,CAAC,OAAOW,CAAC,EAAE;MACVA,CAAC,CAACC,OAAO,GAAI,gCAA+Bf,WAAW,CAACG,IAAK,MAAKW,CAAC,CAACC,OAAQ,EAAC;MAC7E,MAAMD,CAAC;IACT;EACF,CAAC,CAAC;EAEJ,OAAOjB,GAAG;AACZ;AAEA,SAASgB,gBAAgBA,CACvBb,WAAwB,EACxBH,GAAW,EACXmB,WAAgB,EAChB;EAGA,IAAIhB,WAAW,CAACiB,WAAW,EAAE;IAC3B,IAAIC,KAAK,CAACC,OAAO,CAACH,WAAW,CAAC,EAAE;MAC9BA,WAAW,GAAGA,WAAW,CAACI,GAAG,CAACC,IAAI,IAAInC,SAAS,CAACmC,IAAI,CAAC,CAAC;IACxD,CAAC,MAAM,IAAI,OAAOL,WAAW,KAAK,QAAQ,EAAE;MAC1CA,WAAW,GAAG9B,SAAS,CAAC8B,WAAW,CAAC;IACtC;EACF;EAEA,MAAM;IAAEM,MAAM;IAAEd,GAAG;IAAEe;EAAM,CAAC,GAAGvB,WAAW,CAACwB,OAAO,CAAC3B,GAAG,CAAC;EAEvD,IAAIG,WAAW,CAACyB,IAAI,KAAK,QAAQ,EAAE;IACjC,IAAI,OAAOT,WAAW,KAAK,QAAQ,EAAE;MACnCA,WAAW,GAAGxB,aAAa,CAACwB,WAAW,CAAC;IAC1C;IACA,IAAI,CAACA,WAAW,IAAI,CAACzB,eAAe,CAACyB,WAAW,CAAC,EAAE;MACjD,MAAM,IAAIX,KAAK,CAAC,8BAA8B,CAAC;IACjD;EACF,CAAC,MAAM,IAAIL,WAAW,CAACyB,IAAI,KAAK,WAAW,EAAE;IAC3C,IAAIF,KAAK,KAAKG,SAAS,EAAE;MACvB,IAAI,CAACV,WAAW,EAAE;QAChBA,WAAW,GAAG7B,cAAc,CAAC,CAAC;MAChC,CAAC,MAAM,IAAI+B,KAAK,CAACC,OAAO,CAACH,