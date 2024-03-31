{"version":3,"names":["_checkInRHS","require","_setFunctionName","_toPropertyKey","applyDecs2301Factory","createAddInitializerMethod","initializers","decoratorFinishedRef","addInitializer","initializer","assertNotFinished","assertCallable","push","assertInstanceIfPrivate","has","target","TypeError","memberDec","dec","name","desc","kind","isStatic","isPrivate","value","hasPrivateBrand","kindStr","ctx","toPropertyKey","static","private","v","get","set","t","call","bind","access","fnName","Error","fn","hint","assertValidReturnValue","type","undefined","init","curryThis1","curryThis2","applyMemberDec","ret","base","decInfo","decs","prefix","setFunctionName","Object","getOwnPropertyDescriptor","newValue","i","length","newInit","instance","ownInitializers","originalInitializer","args","defineProperty","applyMemberDecs","Class","decInfos","instanceBrand","protoInitializers","staticInitializers","staticBrand","existingProtoNonFields","Map","existingStaticNonFields","Array","isArray","_","checkInRHS","prototype","existingNonFields","existingKind","pushInitializers","applyClassDecs","targetClass","classDecs","newClass","nextNewClass","applyDecs2301","memberDecs","e","c","exports","default"],"sources":["../../src/helpers/applyDecs2301.js"],"sourcesContent":["/* @minVersion 7.21.0 */\n\nimport checkInRHS from \"checkInRHS\";\nimport setFunctionName from \"setFunctionName\";\nimport toPropertyKey from \"toPropertyKey\";\n\n/**\n  Enums are used in this file, but not assigned to vars to avoid non-hoistable values\n\n  CONSTRUCTOR = 0;\n  PUBLIC = 1;\n  PRIVATE = 2;\n\n  FIELD = 0;\n  ACCESSOR = 1;\n  METHOD = 2;\n  GETTER = 3;\n  SETTER = 4;\n\n  STATIC = 5;\n\n  CLASS = 10; // only used in assertValidReturnValue\n*/\n\nfunction applyDecs2301Factory() {\n  function createAddInitializerMethod(initializers, decoratorFinishedRef) {\n    return function addInitializer(initializer) {\n      assertNotFinished(decoratorFinishedRef, \"addInitializer\");\n      assertCallable(initializer, \"An initializer\");\n      initializers.push(initializer);\n    };\n  }\n\n  function assertInstanceIfPrivate(has, target) {\n    if (!has(target)) {\n      throw new TypeError(\n        \"Attempted to access private element on non-instance\",\n      );\n    }\n  }\n\n  function memberDec(\n    dec,\n    name,\n    desc,\n    initializers,\n    kind,\n    isStatic,\n    isPrivate,\n    value,\n    hasPrivateBrand,\n  ) {\n    var kindStr;\n\n    switch (kind) {\n      case 1 /* ACCESSOR */:\n        kindStr = \"accessor\";\n        break;\n      case 2 /* METHOD */:\n        kindStr = \"method\";\n        break;\n      case 3 /* GETTER */:\n        kindStr = \"getter\";\n        break;\n      case 4 /* SETTER */:\n        kindStr = \"setter\";\n        break;\n      default:\n        kindStr = \"field\";\n    }\n\n    var ctx = {\n      kind: kindStr,\n      name: isPrivate ? \"#\" + name : toPropertyKey(name),\n      static: isStatic,\n      private: isPrivate,\n    };\n\n    var decoratorFinishedRef = { v: false };\n\n    if (kind !== 0 /* FIELD */) {\n      ctx.addInitializer = createAddInitializerMethod(\n        initializers,\n        decoratorFinishedRef,\n      );\n    }\n\n    var get, set;\n    if (!isPrivate && (kind === 0 /* FIELD */ || kind === 2) /* METHOD */) {\n      get = function (target) {\n        return target[name];\n      };\n      if (kind === 0 /* FIELD */) {\n        set = function (target, v) {\n          target[name] = v;\n        };\n      }\n    } else if (kind === 2 /* METHOD */) {\n      // Assert: isPrivate is true.\n      get = function (target) {\n        assertInstanceIfPrivate(hasPrivateBrand, target);\n        return desc.value;\n      };\n    } else {\n      // Assert: If kind === 0, then isPrivate is true.\n      var t = kind === 0 /* FIELD */ || kind === 1; /* ACCESSOR */\n      if (t || kind === 3 /* GETTER */) {\n        if (isPrivate) {\n          get = function (target) {\n            assertInstanceIfPrivate(hasPrivateBrand, target);\n            return desc.get.call(target);\n          };\n        } else {\n          get = function (target) {\n            return desc.get.call(target);\n          };\n        }\n      }\n      if (t || kind === 4 /* SETTER */) {\n        if (isPrivate) {\n          set = function (target, value) {\n            assertInstanceIfPrivate(hasPrivateBrand, target);\n            desc.set.call(target, value);\n          };\n        } else {\n          set = function (target, value) {\n            desc.set.call(target, value);\n          };\n        }\n      }\n    }\n    var has = isPrivate\n      ? hasPrivateBrand.bind()\n      : function (target) {\n          return name in target;\n        };\n    ctx.access =\n      get && set\n        ? { get: get, set: set, has: has }\n        : get\n          ? { get: get, has: has }\n          : { set: set, has: has };\n\n    try {\n      return dec(value, ctx);\n    } finally {\n      decoratorFinishedRef.v = true;\n    }\n  }\n\n  function assertNotFinished(decoratorFinishedRef, fnName) {\n    if (decoratorFinishedRef.v) {\n      throw new Error(\n        \"attempted to call \" + fnName + \" after decoration was finished\",\n      );\n    }\n  }\n\n  function assertCallable(fn, hint) {\n    if (typeof fn !== \"function\") {\n      throw new TypeError(hint + \" must be a function\");\n    }\n  }\n\n  function assertValidReturnValue(kind, value) {\n    var type = typeof value;\n\n    if (kind === 1 /* ACCESSOR */) {\n      if (type !== \"object\" || value === null) {\n        throw new TypeError(\n          \"accessor decorators must r