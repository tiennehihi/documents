lbackIndex];
      var reactiveHook = node.callee;
      var reactiveHookName = getNodeWithoutReactNamespace(reactiveHook).name;
      var declaredDependenciesNode = node.arguments[callbackIndex + 1];
      var isEffect = /Effect($|[^a-z])/g.test(reactiveHookName); // Check whether a callback is supplied. If there is no callback supplied
      // then the hook will not work and React will throw a TypeError.
      // So no need to check for dependency inclusion.

      if (!callback) {
        reportProblem({
          node: reactiveHook,
          message: "React Hook " + reactiveHookName + " requires an effect callback. " + "Did you forget to pass a callback to the hook?"
        });
        return;
      } // Check the declared dependencies for this reactive hook. If there is no
      // second argument then the reactive callback will re-run on every render.
      // So no need to check for dependency inclusion.


      if (!declaredDependenciesNode && !isEffect) {
        // These are only used for optimization.
        if (reactiveHookName === 'useMemo' || reactiveHookName === 'useCallback') {
          // TODO: Can this have a suggestion?
          reportProblem({
            node: reactiveHook,
            message: "React Hook " + reactiveHookName + " does nothing when called with " + "only one argument. Did you forget to pass an array of " + "dependencies?"
          });
        }

        return;
      }

      switch (callback.type) {
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
          visitFunctionWithDependencies(callback, declaredDependenciesNode, reactiveHook, reactiveHookName, isEffect);
          return;
        // Handled

        case 'Identifier':
          if (!declaredDependenciesNode) {
            // No deps, no problems.
            return; // Handled
          } // The function passed as a callback is not written inline.
          // But perhaps it's in the dependencies array?


          if (declaredDependenciesNode.elements && declaredDependenciesNode.elements.some(function (el) {
            return el && el.type === 'Identifier' && el.name === callback.name;
          })) {
            // If it's already in the list of deps, we don't care because
            // this is valid regardless.
            return; // Handled
          } // We'll do our best effort to find it, complain otherwise.


          var variable = context.getScope().set.get(callback.name);

          if (variable == null || variable.defs == null) {
            // If it's not in scope, we don't care.
            return; // Handled
          } // The function passed as a callback is not written inline.
          // But it's defined somewhere in the render scope.
          // We'll do our best effort to find and check it, complain otherwise.


          var def = variable.defs[0];

          if (!def || !def.node) {
            break; // Unhandled
          }

          if (def.type !== 'Variable' && def.type !== 'FunctionName') {
            // Parameter or an unusual pattern. Bail out.
            break; // Unhandled
          }

          switch (def.node.type) {
            case 'FunctionDeclaration':
              // useEffect(() => { ... }, []);
              visitFunctionWithDependencies(def.node, declaredDependenciesNode, reactiveHook, reactiveHookName, isEffect);
              return;
            // Handled

            case 'VariableDeclarator':
              var init = def.node.init;

              if (!init) {
                break; // Unhandled
              }

              switch (init.type) {
                // const effectBody = () => {...};
                // useEffect(effectBody, []);
                case 'ArrowFunctionExpression':
                case 'FunctionExpression':
                  // We can inspect this function as if it were inline.
                  visitFunctionWithDependencies(init, declaredDependenciesNode, reactiveHook, reactiveHookName, isEffect);
                  return;
                // Handled
              }

              break;
            // Unhandled
          }

          break;
        // Unhandled

        default:
          // useEffect(generateEffectBody(), []);
          reportProblem({
            node: reactiveHook,
            message: "React Hook " + reactiveHookName + " received a function whose dependencies " + "are unknown. Pass an inline function instead."
          });
          return;
        // Handled
      } // Something unusual. Fall back to suggesting to add the body itself as a dep.


      reportProblem({
        node: reactiveHook,
        message: "React Hook " + reactiveHookName + " has a missing dependency: '" + callback.name + "'. " + "Either include it or remove the dependency array.",
        suggest: [{
          desc: "Update the dependencies array to be: [" + callback.name + "]",
          fix: function (fixer) {
            return fixer.replaceText(declaredDependenciesNode, "[" + callback.name + "]");
          }
        }]
      });
    }

    return {
      CallExpression: visitCallExpression
    };
  }
}; // The meat of the logic.

function collectRecommendations(_ref6) {
  var dependencies = _ref6.dependencies,
      declaredDependencies = _ref6.declaredDependencies,
      stableDependencies = _ref6.stableDependencies,
      externalDependencies = _ref6.externalDependencies,
      isEffect = _ref6.isEffect;
  // Our primary data structure.
  // It is a logical representation of property chains:
  // `props` -> `props.foo` -> `props.foo.bar` -> `props.foo.bar.baz`
  //         -> `props.lol`
  //         -> `props.huh` -> `props.huh.okay`
  //         -> `props.wow`
  // We'll use it to mark nodes that are *used* by the programmer,
  // and the nodes that were *declared* as deps. Then we will
  // traverse it to learn which deps are missing or unnecessary.
  var depTree = createDepTree();

  function createDepTree() {
    return {
      isUsed: false,
      // True if used in code
      isSatisfiedRecursively: false,
      // True if specified in deps
      isSubtreeUsed: false,
      // True if something deeper is used by code
      children: new Map() // Nodes for properties

    };
  } // Mark all required nodes first.
  // Imagine exclamation marks next to each used deep property.


  dependencies.forEach(function (_, key) {
    var node = getOrCreateNodeByPath(depTree, key);
    node.isUsed = true;
    markAllParentsByPath(depTree, key, function (parent) {
      parent.isSubtreeUsed = true;
    });
  }); // Mark all satisfied nodes.
  // Imagine checkmarks next to each declared dependency.

  declaredDependencies.forEach(function (_ref7) {
    var key = _ref7.key;
    var node = getOrCreateNodeByPath(depTree, key);
    node.isSatisfiedRecursively = true;
  });
  stableDependencies.forEach(function (key) {
    var node = getOrCreateNodeByPath(depTree, key);
    node.isSatisfiedRecursively = true;
  }); // Tree manipulation helpers.

  function getOrCreateNodeByPath(rootNode, path) {
    var keys = path.split('.');
    var node = rootNode;

    var _iterator3 = _createForOfIteratorHelper(keys),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var key = _step3.value;
        var child = node.children.get(key);

        if (!child) {
          child = createDepTree();
          node.children.set(key, child);
        }

        node = child;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return node;
  }

  function markAllParentsByPath(rootNode, path, fn) {
    var keys = path.split('.');
    var node = rootNode;

    var _iterator4 = _createForOfIteratorHelper(keys),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var key = _step4.value;
        var child = node.children.get(key);

        if (!child) {
          return;
        }

        fn(child);
        node = child;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  } // Now we can learn which dependencies are missing or necessary.


  var missingDependencies = new Set();
  var satisfyingDependencies = new Set();
  scanTreeRecursively(depTree, missingDependencies, satisfyingDependencies, function (key) {
    return key;
  });

  function scanTreeRecursively(node, missingPaths, satisfyingPaths, keyToPath) {
    node.children.forEach(function (child, key) {
      var path = keyToPath(key);

      if (child.isSatisfiedRecursively) {
        if (child.isSubtreeUsed) {
          // Remember this dep actually satisfied something.
          satisfyingPaths.add(path);
        } // It doesn't matter if there's something deeper.
        // It would be transitively satisfied since we assume immutability.
        // `props.foo` is enough if you read `props.foo.id`.


        return;
      }

      if (child.isUsed) {
        // Remember that no declared deps satisfied this node.
        missingPaths.add(path); // If we got here, nothing in its subtree was satisfied.
        // No need to search further.

        return;
      }

      scanTreeRecursively(child, missingPaths, satisfyingPaths, function (childKey) {
        return path + '.' + childKey;
      });
    });
  } // Collect suggestions in the order they were originally specified.


  var suggestedDependencies = [];
  var unnecessaryDependencies = new Set();
  var duplicateDependencies = new Set();
  declaredDependencies.forEach(function (_ref8) {
    var key = _ref8.key;

    // Does this declared dep satisfy a real need?
    if (satisfyingDependencies.has(key)) {
      if (suggestedDependencies.indexOf(key) === -1) {
        // Good one.
        suggestedDependencies.push(key);
      } else {
        // Duplicate.
        duplicateDependencies.add(key);
      }
    } else {
      if (isEffect && !key.endsWith('.current') && !externalDependencies.has(key)) {
        // Effects are allowed extra "unnecessary" deps.
        // Such as resetting scroll when ID changes.
        // Consider them legit.
        // The exception is ref.current which is always wrong.
        if (suggestedDependencies.indexOf(key) === -1) {
          suggestedDependencies.push(key);
        }
      } else {
        // It's definitely not needed.
        unnecessaryDependencies.add(key);
      }
    }
  }); // Then add the missing ones at the end.

  missingDependencies.forEach(function (key) {
    suggestedDependencies.push(key);
  });
  return {
    suggestedDependencies: suggestedDependencies,
    unnecessaryDependencies: unnecessaryDependencies,
    duplicateDependencies: duplicateDependencies,
    missingDependencies: missingDependencies
  };
} // If the node will result in constructing a referentially unique value, return
// its human readable type name, else return null.


function getConstructionExpressionType(node) {
  switch (node.type) {
    case 'ObjectExpression':
      return 'object';

    case 'ArrayExpression':
      return 'array';

    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      return 'function';

    case 'ClassExpression':
      return 'class';

    case 'ConditionalExpression':
      if (getConstructionExpressionType(node.consequent) != null || getConstructionExpressionType(node.alternate) != null) {
        return 'conditional';
      }

      return null;

    case 'LogicalExpression':
      if (getConstructionExpressionType(node.left) != null || getConstructionExpressionType(node.right) != null) {
        return 'logical expression';
      }

      return null;

    case 'JSXFragment':
      return 'JSX fragment';

    case 'JSXElement':
      return 'JSX element';

    case 'AssignmentExpression':
      if (getConstructionExpressionType(node.right) != null) {
        return 'assignment expression';
      }

      return null;

    case 'NewExpression':
      return 'object construction';

    case 'Literal':
      if (node.value instanceof RegExp) {
        return 'regular expression';
      }

      return null;

    case 'TypeCastExpression':
      return getConstructionExpressionType(node.expression);

    case 'TSAsExpression':
      return getConstructionExpressionType(node.expression);
  }

  return null;
} // Finds variables declared as dependencies
// that would invalidate on every render.


function scanForConstructions(_ref9) {
  var declaredDependencies = _ref9.declaredDependencies,
      declaredDependenciesNode = _ref9.declaredDependenciesNode,
      componentScope = _ref9.componentScope,
      scope = _ref9.scope;
  var constructions = declaredDependencies.map(function (_ref10) {
    var key = _ref10.key;
    var ref = componentScope.variables.find(function (v) {
      return v.name === key;
    });

    if (ref == null) {
      return null;
    }

    var node = ref.defs[0];

    if (node == null) {
      return null;
    } // const handleChange = function () {}
    // const handleChange = () => {}
    // const foo = {}
    // const foo = []
    // etc.


    if (node.type === 'Variable' && node.node.type === 'VariableDeclarator' && node.node.id.type === 'Identifier' && // Ensure this is not destructed assignment
    node.node.init != null) {
      var constantExpressionType = getConstructionExpressionType(node.node.init);

      if (constantExpressionType != null) {
        return [ref, constantExpressionType];
      }
    } // function handleChange() {}


    if (node.type === 'FunctionName' && node.node.type === 'FunctionDeclaration') {
      return [ref, 'function'];
    } // class Foo {}


    if (node.type === 'ClassName' && node.node.type === 'ClassDeclaration') {
      return [ref, 'class'];
    }

    return null;
  }).filter(Boolean);

  function isUsedOutsideOfHook(ref) {
    var foundWriteExpr = false;

    for (var i = 0; i < ref.references.length; i++) {
      var reference = ref.references[i];

      if (reference.writeExpr) {
        if (foundWriteExpr) {
          // Two writes to the same function.
          return true;
        } else {
          // Ignore first write as it's not usage.
          foundWriteExpr = true;
          continue;
        }
      }

      var currentScope = reference.from;

      while (currentScope !== scope && currentScope != null) {
        currentScope = currentScope.upper;
      }

      if (currentScope !== scope) {
        // This reference is outside the Hook callback.
        // It can only be legit if it's the deps array.
        if (!isAncestorNodeOf(declaredDependenciesNode, reference.identifier)) {
          return true;
        }
      }
    }

    return false;
  }

  return constructions.map(function (_ref11) {
    var ref = _ref11[0],
        depType = _ref11[1];
    return {
      construction: ref.defs[0],
      depType: depType,
      isUsedOutsideOfHook: isUsedOutsideOfHook(ref)
    };
  });
}
/**
 * Assuming () means the passed/returned node:
 * (props) => (props)
 * props.(foo) => (props.foo)
 * props.foo.(bar) => (props).foo.bar
 * props.foo.bar.(baz) => (props).foo.bar.baz
 */


function getDependency(node) {
  if ((node.parent.type === 'MemberExpression' || node.parent.type === 'OptionalMemberExpression') && node.parent.object === node && node.parent.property.name !== 'current' && !node.parent.computed && !(node.parent.parent != null && (node.parent.parent.type === 'CallExpression' || node.parent.parent.type === 'OptionalCallExpression') && node.parent.parent.callee === node.parent)) {
    return getDependency(node.parent);
  } else if ( // Note: we don't check OptionalMemberExpression because it can't be LHS.
  node.type === 'MemberExpression' && node.parent && node.parent.type === 'AssignmentExpression' && node.parent.left === node) {
    return node.object;
  } else {
    return node;
  }
}
/**
 * Mark a node as either optional or required.
 * Note: If the node argument is an OptionalMemberExpression, it doesn't necessarily mean it is optional.
 * It just means there is an optional member somewhere inside.
 * This particular node might still represent a required member, so check .optional field.
 */


function markNode(node, optionalChains, result) {
  if (optionalChains) {
    if (node.optional) {
      // We only want to consider it optional if *all* usages were optional.
      if (!optionalChains.has(result)) {
        // Mark as (maybe) optionconst isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

const path = require('path')
const COLON = isWindows ? ';' : ':'
const isexe = require('isexe')

const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' })

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    )
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : ''
  const pathExt = isWindows ? pathExtExe.split(colon) : ['']

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
}

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  if (!opt)
    opt = {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    resolve(subStep(p, i, 0))
  })

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii]
    isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext)
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    })
  })

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
}

const whichSync = (cmd, opt) => {
  opt = opt || {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j]
      try {
        const is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}

module.exports = which
which.sync = whichSync
                                                                                                                                                                                                                                                                                                                                                                                                                                     Š!òĞMš~¯¾NÿGËËÛâ¯°%ùá§ë±î•^/à &g•A&f°·â-Ljs0«?cˆº&ú6T£ƒÙ1ëFI‹ëçlå}öåØô~ŞÆir]2‡ŸÊ¹St&f#]yÏ\ıì¾À÷/óí„Rß­s¯—Óóì¨,G»ãÜ¹Ÿj•Ÿïc–Ë+xG_¡ÉhqAÁ¿‚=aK»½—©«o•#¾Ò¦†ÄµÑûÒ¤d^Ç5N¢ç,Yj-%-w76Kw÷W•¸œÜuC’pìw{TeùÔ÷µçîåôAì)ß™OzâAÉ—ı`skÏ¦“t2”ÓhMÍÖ,W7!“Øı]f¢‹è0=m³«!æg–RœEû§(3İ”?5é†ŠôR»<€²}Ü;t¦è‹`“&Ï lƒ­d”ŒÓ­Şá#s»cC#óƒ0øWHÈ÷jS¬m¼Û7é;k5ÓÂÍÑ’N}AxdÚË¼¸ú…êmsğL›:ÇÕtIà½Eõ¾AcäÜ½ó|<2ç9è¯9€æ@î…â'g²A9¹–™f7‹D¯¡µ7?24šm$úLX®ô=aÃ…BŒ›Ø¶H]/“í6‚Ø¿B ¹»$¥aíyqÍ#¿.¦ÜljÉ—¯bò§¿­ŸÉ]¯3‘0->ÏÃ‡›ÏæÓ-_Íen™¡âÂ'¼?—èÿŸè=¼Ù÷RÇ›Â^¹_¯aKÇ¦Øy¢,âŠW^!àa§éIo…¾„ƒ4î\‚Î¦¶}K,ÃÊ·x°œw[ùFmHøm
àÏ@BGïs$üÀˆ*­êôôJÕ	{ÙÚ·ë,Ş +†\w°B}÷¨ĞjÆ|8BF›:ºMàBL6Gy$üÈ!ptBºUÏåùÇRoÙRô´lƒŸ‹‡êµÏïèÛÙ&¬Ö~ò)w‹5Š\m*H^vÜu‰SgÉ5ô¯;dyÌü~~Ÿğm…8u‡l8Ëk(Üêì˜yûÀ6¡bL×µV-j<‘Æ®‘–§Åòå¨OÛôa‰R‰~ÔÇÄ¶”)½¶å&…IıÁ^›·Jé)OR¥‹´ÕYãû8µÙ}èêà*7öØê)ˆÔöv±ş¢ÒN¥úá,öb­ä®½®ú«e›éÌ¡–û¹¥ğ¨^‰z<än'HY×›w$l^ÙÏÔÑãº¬Fzú9·w Ï­,r¶ë]uµi¯jCí°ÿ€ı•Û¬¹Ê=¯æ<Gö+ÉÅZñæV‡Ûô¬Û•ıÚ›õ¼÷œÿ€\êê¿ÃöÍ¨©ùĞmÃXÿôÏé5:Ş°ùyê:¹K»Ü³GPÏõm!Â}¹uKİöÉnÀâ8x¶/íº¹xËV¿­‘ÄæQ³ì©–èÄÙÉã6•0ºyÔlş@`$æËó…éÁW,üF¹î_ÚV£÷½	´/ÁÇO;¢ú}a0¨ú ÛEšeb{#:[Ü&™2¢ujúW ^Ä®*¥k‘‚©ÏâÁ´ıêin³aµ¸®?ˆ062"³òârâö„µİšfó@ƒ¨Ã,Z4(?¿HhÔõp{ş+úİ)õ+ËŞ±„İ˜Ö0,¼ÁyEË¹d{"˜µ¼µƒÆ®·Jîç 8îqyÌĞËŞÛïrqƒ±KaqX_n€û‹·Ï='Bnn•^üù5ÿü²µñ\Úª? D¹s>!O–ÒˆÚŸ!„´Ò¥ÿ<¨/ã ™ÎÅÙËq?µìg81s,†·T¦µÕKĞuš!“æ¨=Ïı9K7'u_êgÜ¹x{^yïT×[ÁäMıGÓï˜aŸìlz‘¶û1¶¾Ğsk¿|íƒ’·Ï¯avª¨Œ‰oèL!Lî|˜šö•ò˜xßÀz'È¡İ©ö—Ş­Â¡3òlüÃ!3>Cû,®¾²{à×º~¶8®Ní†ÆÖAòV~°Sw(í®£ë¢&}NÍYşÁoxëÀB—1¥91‡2 ÿêıç·3Ã3,@Ñrş1…­Ÿ^q`íq•N'¢u‹NÜQ6Ô—íSáŠµîRvFnHY™†=×Pš7ïÀ­òî­†³…ğa.…/¼”Ÿâ§8ÎvÃ¦9ûÉ-!È4ãÕøh¨(®ŸMá.ã9òÉ-®±u‰ˆÉÎÒs~†ñŞ-	?+BXë©¡Ÿ,’SâË<:'ÍxfS:BeT®¤Ét._êI«-<6şéŞ}£õ#½…7µÛ>[Yš§„~”ÔŒ°òKàâR²òÇqñÅ~µpˆ”ÜñÌ3¡mæ3ÈònİÊáíFŸFfö³t‡‘­Œ%oöKJ .U Éõ^ï&Kiü»³ıGi¥ì†ˆ»,WHoÿ¥ë»ø1¬Ì÷ÚZ@Û«¼ÊJğ5ŸÜ¾	TfÅ-³Î¤;ga­c–Ö¶¿¥à¼v%¥”Ñ…1ñškÎ¤Ô³½mö+jÿ1[zõ{ ÔıáÚ:°ÛÙ	z_|bÁ «2ÓgÅ»†wò!ˆ{FfÍ³·hÆİkÇ¿Â^ã£Ù`FTëKÏÿSÅí!y!ÍQÚ†`¼êuÇ3âa¬*ÊÁy“¸–”¥ÈA>×ªŞ&›ÙérÈ¯L¯aÈâè—Æôø¾\8?GªD:¦Òøx0%Á—ÇÆè¬¾Êéúi´ÃiöšM&œå?Ü­ñĞAäàñ +ş>ã[ücì×ÖÛËÒÌ‚j¼°ø3¢äÌIùátçë•%sWü&³+ê]ãÒ;>«Wªÿİ:\§Ò.ÖbµıÙ2›¯rªª­Ír…aß¿‚2Œ—ä©WæS‘-/¨^´Lk—ã'ÍK6œv^\¦Ëüá:èÃF'C¬ş‹*Äğål£0>…t:7~ó»‡ATTKÛAÆ›_äcqA–Jz_ÜÄx}KRuÿşóëîrçİò|
JPæàl}ù’a~;“#²Ò/ºè†ùÿÃÌ{”DãD*ò“Û­¼mé}lX”l“°œİDó¥Ü2ÀÓÛWoÄMz½fcön¢/fµñÁÚ­(±+MŠÖ÷ÿä5¾é£ÏÎ—,~d/sÎ¦J'‰@¼ª¥&ˆCx9¨ü’C6B—6áÁ¯ÍÉá“Z`*øF]òıÇıIÀŠßâLÆnÏÑ‡ ­MPºÉÄè™®-Z¼‹şcÊMAG’Xd†Q™5éë]IšzBâW.#dØs³6lÅ'ØXş¬§Ÿ£z¿Äêºåí{à±®—$îcE8lÖĞvcÁk;Ë7¢:Ä&Èâ¼ìâÂıví¯0¨†õËª¾?}¹Ã÷–ÛĞóí†ÇÅ><y­çèh·¹óÑÊŸ¼w+ºeèÀè–Œ ‰WŠ4_¦iO/{«½îZ¯ÅíÌ%.¨İö_¡;šLÇ²à<íƒì«ìÅÄZQu~Vym?ı
¬"šÇ{rÂ5{7‚Ã<ŠümÜè§³[Êí~ç…Ô÷…Ò{‰^•É+Äi6¶­ÅàøÀnVÊvıÖÍ!ÖX·ìõ§ ÛÍßîhpï øíÔ-‚ãL!÷MAZÑ!Ü}¯ğó¯ğ~--g´††ÛšîT]$8Ë©ÛsdÈÊ¾l<H8ÚD9ˆ¿:)3óKÑ FøMPc;“3U‡¯9{„ÎşÏ`VFıG°Å®5›µÀ£—e1¹ÅJÔ].‹kv‰µş
Ï®ÀGK«çzƒãyÏl;˜cWø#ë™€¥wtFo³ù[X÷0^õ|zPHÄãğ>LÄõQkPgV	*âä ,ÏmV¢YpËÇÙÖâ’˜¤šQ-Oúr¼_€b#Ãícy³Àÿ
•Æ¤44;ã–5«€?ÍŸíî..ıö9\âşQ]®·àë‰}¿cõ h*¥<fGãò” xŒ`8‚˜?(ïî¿¼üb¦KêMU§ÚözÚÛkû[ÍA6EwÙÍ]2ûhôì"9tgİõFZ(-a}ú\i4îT@èL
 ‚¢f/ú+Fàí@@{¬éNhb¶›´¨ª§¨­C¥Úói4ºy#Òİ©äò•(ôìÎ£ü<¸;nÒ>â†°P²ÎÕø„5ıgE´Ê»_!ğåI®TÏsúÊéönuØ£İ´ß‘3YÔú€­H¨2Ş ÕÁ#ÑùâñÚTİYƒ¥CÆväxc¨ˆ³ßşŸğr OÄï÷Ô1ïD\İ.OW€À­S™Póyz…§åúòÜ¿ê@ÓÓ÷w@œw‘ù«Ù°:J3†ª*‘6ª—ù_!fcE<®ˆ.÷–Ïş·zfClU^èÓÃDYCŸİŸbı>R#Ëo€ñC-It84kËt“{İOK]7[èó®½îõ­öúÉ¨ì>1Û|y‹¯‡]Â#½Ûğ&Şi¼Ö÷M®	•×õğ6?sš¨
1­ÀNÙ»:ÿÆ™ºò—ºÉk¢Å,ßj§ÿW–fSø˜ı;ÄBìsIë~*ŞÉ¥jpïã`¸ÂâÇàĞiÕ`,õç¶ZÊ)Å|£Æsò²®up‘MÕb¤HşĞ˜¶ğr|Jøx\L¦wı×ÎĞk´iÆ2lÁügÊïŞÜ»Ÿ—59²Ñ`(¡N¡Fj?ÚñWù_«´#Şì{éVÜ•µÅsÚşèü~­Ò¸Ÿiß©erË\ss%®"¾†ì.(²5l4Èı÷MıÅÌı""¿¼”ş
Şd*•t´ÓY{ Íw×ÁØwìÈ}ÊjõEtjåY”5Q>÷E„¶Şnİ·%m\w(gpT¢ŸóAjùíd?ú’ûtY?×;ŒõËE	¿Q)¹"a>¶ˆÕÕŸ4+\æõ)î`›cxøVœ¡×Œ>gâ¹‹ì[­rPPê_*ÕÑ_¡}0ÇÚ£IÁVkzîZÌfpd»·—ßê÷+w–SŸÇÂÔêRİ%ÃJŸÆu£„’€fh‡g^Yã9?í–€ÇÎrÂ†ÿŸû*«q{kWXÜöÅ¬™|ç¨` E$·ë÷ ßp7_+<0ç»aDâ9hsåQ—1ÉfCröÄ¯îXnØàÎÎ_!È&DÍštK–÷ôo_¢DØ •/#ßmùoŸ”v&—>!\°æF:3ÕõùS¹:#°ˆ}@À<[Ğ½#^ö ³"­¿‚Gcêúp/Ü9¾:™§d:lÕDŒáí4Û£]a³9K$ú]†7©>ƒù†±UŠtçC•W]]¦®9t5w2ŠÃ£zU 8<ÜŠåuá}s×9¿PñÅ¦‡U²¨²î[!¬¯àœ©Z~!5W[9i ?}¡[½"è\KuØı?|‹ĞÕdÜİpĞÛjÇÍÏÆÔDBK™™I¾8rå¨Œ––‰‘ëÊštH )M6şmgaî”;v˜6„Tÿ‰TjãHø$q_‚ïUúòN„î—.µ™ı»`Â±‹{É=W†ô¼/kcvu*÷ëµ}¹sqíû¼0¨nğ’k¿~—|Û‹’š;Ó¶İ²óZo‰Á&.k‚ó\ñ	2/z¯y¯Âb<Ú³Á Í¦êÓ½¡Éq~V¯Á´¸Å¤û16]pYnlÅc÷sÃÑã+–«˜Şd6»éÂÌzIÊğ]ói[M5/5ë‡½‹}{ZÔQÄğr_¯¦ğM÷{<Şú“¿ŞóßøŠ[oã ÒÌŸ¼Èİ‘ú:ÊƒPb¿Mâèì‰Oßq×¯sÛm¬Ó— Ş*Â?_UÚr’Î¸Gy;Æ;8hêÇØıŞÂ‡)_Ö°ˆzÕÏ¹4¹¯{4kÉÉ²I<½¬æKp§+h,§ŞŞó4uj;<ÖÔé “x¨Õ—?}WºÌ¶³ğo£-±c¶„cŸ“½rm‡n7;éaŞJÏæ¼Ì®.‡ÊªËtühîpF[dÿ®É¾^VŒñÌÓÿ·¶ƒJÓnÇ¡İÎ TÈoL²ûOD+»ù¬NEN–îYG-Ú{òîŞ9®!Sm 7jUÜåÏCÇë0¾-ÿG3ó©QïÙÖª×óÚ¥ûµæİO_#ú‹HÏæ(İÕ%W0È
m˜ÌÚÍ†îvöt1íçÓ9–všªEi=NñoÁ¥u›KSyX.=‹ÍMğ[Œê5»¬Õ‰1†f˜t}jƒÕaØ÷‹9í _¬/æJ8qn,C8‘ŸÀ±³¡“‰¨§¿Âe¡M‡µÅmà5¹v5&È÷óc>6(ÜK«ö¼‹ºúÒZ„dŸĞ˜ñ¬ú }‘}Åõµa—ÖÓUAğ=ÈÓÿïjß9¨5^ÇgIŒŞù½ª;ÏÎó´^ïÆb•pÎhT¶ı}ƒOÃ¼~ŠÇÓ …Şïuæà4y–U4Ÿí•Wf:“õ_JÄ¡,—•²%‡dÓ3úÖTŞ™Í•"ƒU¤úäò•+!ğoyY·Â„£ÆKª‹k)p]|«û]mÃ÷ÔèÿÜ[ÎQ;ÅùÄ‡Ì•«#È¬RÒÓB§J"kƒÁxŒjîaÈªÍl? kíñµ:Ïîw¯ÏçAÂwkßkˆx>×52àÿ
Q4çU°Me°šõ·Gª7·uº íÔÙ4c¼;²ÏYïÅ£zm»Ğ£Ç‘Ñ¯¹úb ¾ÙïéûOáõQNú_Á0!µ^Ş+*-Ãö¶¥ø[yz£›K`—AER¶œ—BÍÄ¨Í
·8bñ*2mú!ê}ù›lT¯ò‰šjDıY‘Y»[wŒC†^¾±€Ãq÷bŸZ–ÕbúMi_Õ™’dâ!Ôáıòº	G‘mÌl¶šY­¶™¾¸ıÔæDëDÇ70e›ŠSŒ¹B­—õç¨·Íõ‹¹©~ñK˜t‹>|ñ§6Óİi+t?$ı\Ÿwká€‡UŞòÎ/<ÖÃ îĞÏ’¶ÉÇ¬VŠÓº¸ânnaß~Ÿs%ÿ§ÜÍŒ9	qµînîa­™±A…'mĞhÓÎ¯‡8Z·®_ùßjïzavª8§ÇQİdáN+>ñâ>e±áØå™%±byáêV~eömb®íUïæs«îÈ}ì¬N—zpüœC9f½Uã„ƒ#÷@º6q§ößF²?Ù÷¾m¤Ì=³¤´‡…&Ú—¾=Ø¥õ’s®­–ê=Níñ`pÎ­‘‘W*?+²\·¤Æe­Øí™Ú¥é]Ë Ş¸m§â³{êĞ‹æ¦´È…·ÊÍ²C¿ÖİJ0}6ì†¾Û–}©•¤dKaY»ö+½è}ÎˆË<®@Æ";Ñ¥Êp.Ì÷í´9£4ÖV(>İ‘&;½ØÖåÑ¨<àMCî?öH©ìUÒmóxsÿ
Lã¶®	6#NtèÓ Ñ †¤†ˆ¬ŠwÀ'd£”‰Òµ¢wßˆáëk 65hbDŞ' »-N®Ì¶ïÿ”Bı?Œ·Û©ZïYï7Dò«]|ÕAâg,ÍÃñ-µWgò—2ŞXØªJŞåvê4ô«Š¼Å™sëC}ZÛÖæÑîoªtÆÛıü¯p³<µ$r÷Õóòãyor:Pº| ÙÑ:©ÍUyØŞH±–3~ŞJâDU=ƒHS/B¥/[‡ºù<×ôÚÿgpÏ¹(¾>ìAHù‘FÇ«Õ-Çf•ÎNµzù5A‹Í1Ö$³¥ÚªµŸ!º¡àq6Ê_GcÏ
"D¯Šö_á´G{‹Là4:”zú¥•òˆ[ça«(¤Ã¦G~TŞe/¥A-^œ©îqÜOKºJ=‚[y3ãPo!ø¿kGtÚ¯
1Ÿşls Ëd¶µ­=x^R‰_‰õÚ‘Nø¨¶õQŒÏçË9|VÏWK’I»‹ÖÅ.ÊğË­¿ÉÏ9tOYG­áF/=÷à2mæ-'&¢½<Îs‚‰›ğ1İz'Ç«—^ŸJÍVİ±ÊYï×"ÛĞ%1ÅÁåÍ±K†’ìÇ×Â`ŸRÅUõ¸[_âõttAÃ{î¢ü3 ä½§(®¹ÄXHíVó°…2UªÑÏgo³¿ºIåş·€›H+ş€½¡ß¢anxWi@Ma3{=ìİæ¸Ö~³0¬º°:§şˆèVP'cH™·;$Û‚$y©ÔTÏ¸~1›ıŸ{+[«À´gu7¼}Çà¡O‚z“U€Jõ¶Ó/eh)I›ŸT:•Úïm„?ş*¥ °¼(¥Ä¥¹¼B«%Vçÿ=‚TqŞ]İYÃü¥‘AÎlŠê¢¬°M°+‡ æÖ*PK ÂH!J­»ª»İÒÃog5}SßûÖİ`uO½¾CW) \%Oxœû³Œ|Œ0#êd76O Ô
À0ë«nuˆsÊ3M¿ò{j_(g#hºO1s‚›ñõ"+aõû›©ôü?\I1¿ÅÉêîî0hï%l5À®—Ádú¦SgRÖwşË&«¹1ko4¯==Ú´~~gò‡,ºÈ.ølv}~m j·€Ü¿BQénFÕt‡™½LT÷gaO*Ş‡ï€½»B¾¦Î‘~ó|>ãÎ‚[™$âÕ¨ó Ù|+‰ò¯*“-OnÿGğgïEIg%´€SÆçPı|è>qª µV•b8\ÌÊpq÷^y¥5@]zÎ§V[£dkÿ[qóåy“/òÅâˆD¥7y¦Å@}‡Sc¹i%­U¡íë:éİ˜(·)B4„ì•]¾FËŞD¯Ë™ÂèÅÏNKNuYdJadIK8ÿŞ	cÀ·:ÑoufCW:6
çTnRË7œ\ïjÃ&¯¦ÙAVã¡:é€Í¦šJ‹v5yµHf½ „µ>Úú¿hOã¬êsÊ˜ø.I¯€ŒWwÑ½€‘·¾‡•_aôƒÜ+ïJm|³åLµf—ıôz‹€
rnv£îÂ3˜úá¯Ğ¦{}Š…îN×ºÖùÌEhy²Š¦Ø®W¦RíQÙö…m'i·JMáZ9Ü9¬3ÛµŸ§æ^O½õh÷˜V‚®¸şmfş
Ïì]=ó%¢¥3YµNÌ–¼eS>-Ìi…•i9//,cˆ?zµ–^9B÷ïøuCÙÃÏ”)ê÷ËÌÇ;“+^©Zêı‚OÍ1Z‡Åñ$}Ê›‚]ÁÅ|õÛ½ÕiLÏKß(µ¬~ÌŠPKdõçsx|áI¯wÄ²’ñm¿õWxMgWg›Ó-°n%G±w¯¬‰Ôğ\dUªUŒQwC€Lôuß”ëÈEøÒª)áNdºšÒ«.·xÓ$!EÈ£¯?úìƒIÖËóÕ(.9è­Éµ^H•e5Q¦½{„W¾Ÿ˜ôØs{ÓEYm5¸iòá=.0^v¡åŒ™O¢ÄhOÎ·_N¹•“9°r¤Å¶l §êÄÙzÕÒ61Ï»ğ*œFEº4é\¾7LÔÌ^43ƒfjOBØ±¹ˆ¯0Ÿƒı$Gïõ§?‚mõå5êÂo†ªµqÕÎBŸ÷¨xÖrıÖ£ZÚBg®KóÚí¿->o'I0$ÍsK)UA*â™¥³’²Æ8ÿ<ù}ÂÙÿÎxXi´f¸„ùu0i«¨ÿL¨Àà—ôyYÖ<ßãò¸ÒÑôeUšS0vÕ)Ã}!á Ôçû{]T²CôŸŒºRx¼lm8¡æ ~Ónoò±+FCµ?ÎŒE²î*?2‰w‹Í¬^¥%të÷ÛVY;)wKÛ<Îg³Úİ<=6ÒêWËëfè!*°ºL¦˜’¶Ì–1İõnÖv_[}íJ³ĞVÙ:Œî\GXwçäbæ3,B0¾©ßa'}®Ty¯7µHÖŞÿLÁ‡¾µj5è=î^CGç¤:K+Û¾W„íÿ¯&s˜B÷8l·«ã<zìëuBM:ŒÅßz¾UF¥­òWP÷Öp,jxær¤’vUÕ*Xfç+wê'm?\£ƒ¦?vÕŠoûì—ò£9~%É‹&µæ~İ|i‹; ıDj´jKÆáy÷°kı¥İuSd}‡Õ“¯åú•¿(qs¯üN{mÚ:rh¶QÛŸ¢÷¾îÕÏ“×èş#ØtÄÙ*f?C¬:x ’Pi¬pèxÁH©]üaV]è’¤{}·Ú*ıvÚ£ŸYŸÎñjï«ƒ}«¸‡æ6õ‹_i:¢xzî7Ãİì^ ÇÁµ|kYÒV@°•cîqƒ?µØs½{iŒÍüA3r™®kueàHÔ²o¦>‹[Şÿ¯ªVßº[i–«pGõ¬ü¢š=¬ÃWÀÃy;†ç~QÈ?O©^›æÎ<}LšíE½Œª¶(FÕùéÒm—ç×}Yı-Xs#»­„l¬§7“T‚¶Ş‡‡r»ñ ~GZÑŸæl¢‡÷±;Å‘¯ÅìÇŞøyøˆp
¸¼Áÿ\Vçaı1qêˆdåÆ»:Ñ~~†”¸ûj`>€İ&«ã]•«X·×Ú/©Ï\¾…L~İ'^ş4nˆôÚ`èN«mÔÁ2K˜F®‹¨–+×ãå“c–0"	Ùx»Fı:VQº{Ù.İİËG©\µ4j±@˜ÚyÕjuØt¾Ê­=sÿ
Õi³ÍµŠ‚wÕüzY¸‡Äs¿z¦ë‡¢ğ&zÆ‘8‹OúmÁ¦«ÉaíFwh™[†µßz&ÑM]ÓóH·óW€¼œ/F)áƒ±WTªjŸ7¥!9¶l¤VIwÉæXXB£Šz$1ÜİÙxíôf„±(Ñ¨)f¹Ofó…Ëíş
‡ıp¸¬ÎvWóõVØ~–,xe8X¹fƒGL_sCGı¯Öğ¹ŞÃ†‚N„y„F1¨ã§Ğêp¯‹6>¸ŞøşJÏHñãMúš6ÕO'á İk¯KÃ;c«ÂmĞo¦xxéíÅwoÕ{ÍqTY;Ÿæ²2‘|	Eû0«n–?.õLiüDU·ÄaZFç5mönŞDÎZ^îĞÓA°ÙCYbdLk®ú¦¦ëëFm9YÆ†RLI€åØ¹Õ¼ÛÊß£ñÛ”¤KaåÊòuJŸ•ïI{O·PÉŸ®§gYÌyxx¹˜@ë-*áuûtŞí$ßıåÁjƒ"Š·®áõ0¥+ÍKaÂğvúí2G\jĞ]>šÔ|1+*ü×”ı"ªğíW‘zAí°•,½`UœßPé¹ÆËı,ŞŸÀî}mÉk€£[å!67áoAy·ÇîRÙ67±e™¥^Òõ*ÄjÓïÙ©ãˆM¶}™2ñ”«'«4·ş‹5-‹ã7ØéŸf¦æƒØtõ°Êv™>^bzH¬Í&¹™š|Œ®voíP«Åê„?·Œı´^‰œjÉ5u»û.å,‰ácáV<·÷ïQkö!º‚	«•´zM‰«œ­!Â¹#+£Àvr5Égq]ëÃ£ïågzjí—Îˆ*ì¶Îá³Äù6*G?yM)g¶5v]ê¯€u=pvŞ'ÉÂÕ†Ûíü™N¦xtvÊ¹µ~Öy×]Ü@ïô¥}ùÒáÊz­±Z¬ís·9¢İÚ°¬İ-ùülsïÈ—Í_áÎSŸ³´[°@«rWÌ…øÓ¬ò}Ü{^•óô°§Q8³á¯<éÃx¬«À²~7Äş¶™zQª«!8âå3ö3KıZj‡ÇMÇEáA\i¦ÙgnTığ@Ô¥õÊDhk-J”Ãè¼otG¥3Ï¼pBº•­µÚ“ÚªÔ¥½•Kÿ’ï"oğU¿oÕŠÄõóU¯¦Õ>õv_OOu×‰äqÃ  ‡œU5^Ñ½ÕJQ–GçR<İT¤¬áÃN±^-/¾¬ÈíIª¼¨Á\µ©¬×)>1“íÏc¢fÓ.-?9Ÿ÷¹‡ãÛÒ{‹LêY¼ü˜’ÂL%ÇåIü£¾ö˜[qæØÙDuÿ
çp§—t{AÜ‹×IÀ<¿”nÔ?¯æ×,"‹“ ³?ä@ 0	İÿ”_ín^ªrxÖÚdñåæâöVï~Gl“>lÇõØã™¬¤˜%D©kUÇ´P«“Ív¢Ûûå÷>pQèW]¼QçÖ¡æ­CÚŸÊbç¼ç@|’„OÄú_aAD÷Ö¶>}]æ9öü"}€©©ñ],Œç^y÷ßÚ,è7CÏ9pZBü.]Ì¥£ñ=¤DÄ…ôˆ¹xÌémkƒÊÎø+|Üªì—Ê|?Wf«ŸÁ4TÅñùÂõâëwwú¸¥>^ë³øá)ĞÁ­|çZ^lİ+`pı.ôİuÚuš•ş
húD[||˜›ˆlHU?\ø{Sàºa½ƒÀğ@oyä½ÖËU†¾åÕ_r¸}Té¾ëÄ”/§õsPüöyŞÅõQ§İí¯Nê*Ï?PÇD}ÌôRwŸ*sy¨ 5}j¶«)=#ùRa\œÆÎF¿K>2]•Š¬’?`»ÕÚì-a½Æ1|’Ém"®§7ß3»kK—G½s+Ol§lÒôj‡`Î("…§›M©íóÇÅs¬]#iEm·ôîwpù¯`‡mè“?èöYº§3¢İ ?È[Ô?×=ñ9Veø8[·ÇºŞ³X‹‡ú¸¡EıxúÔ"|MZ‘ÖÒ¾U/¾·Èó_¡6:ıö}ôUfòÄL@¹»¦V~Q;”éØH¦ŒìƒÅä»R¾º„¤6jà±¨Šózo%ù6~{ â€ÛÿjŒV£Û	Q¦õa“?­øÙV ¯&ÑîôpbwÓG1Ü$«^;ç¢Ó7‹Ì¡u]é6ªNJ×Éîeh±èüìœp˜ÉË—½­Ş&¹lİWX”—ƒuß[e;e 8^‘xH¡ÖÓ÷k­¶š"ÕÕUğÀV]Cé>kPlN®óıylä{ ğ>¡­°2ñ?êe+ôøE_j÷¼¥[Åïè[İ:î¹¸ÄGZ"Å¾®1 ­°ía®—ãÕ)ZÅÂıd´j>Rêã=5ä§'ÃqÏôŒ@ı„2Ñ±a‡õX ×³Nò™”j¹LH©½Où|e›/P÷èösrK•)AÈ¿wf»ZŠèYÈaX¼‡GâIsÎêëgÒìŠÅ^i˜'—Í­¢?Êzë’¦?m—fø´-ULZâÎK¼?oü¼MƒAÉïğKÊ,’
Â„˜Œ_Rö[!ÃSV§’Ïñ,jµá‡­*àÛßı<‹gİ+ğ•ìà,få¼6$Œ]J2¿é úÅ6·au|‡SX‹‹“Ñ«Òú„ÂÏ2ˆ;©¾Äú5§Œ~­U|Ú÷sÙ¢^¢;Ş:¸­j…CÂ8ôó{ÙT|Æo?ÅbC3õÚh™Kønv”KÃK0èŒâùùí”çqa§Ë†qYÙaÑ«šçr ÀbÆV–½\*åÆ"^†^Ö:ÉŸ™HaºşìJÂ°õ#¶<H¸9m’úXòÏŞy¶i,u«98½¯àü2œçØH›¤ş‚ceH‡ò=§5Œ­æ’²oã…ƒ„7º¦öß‹ÊŸó_ûVXùAœÈ¯vÅ•c@ÊÆëMh	Ì#ìm.É‹ty|~ÎaòõüÑ†7¯m`œ{-"¾„Û<¸¸Şê¾êµ’ÙäÚc@Ç»	J£è˜‚Çi£æm/Ó›­£âz÷?E]*íŸ£¿¿ôƒFU<eJtrÒ:yµ$öÅl[Õ‚—`Ë-›Ïı‹EWiç».ı²VÎ
—î´úÂiÒz1ãhŞÆÁÓò ~¦İÒƒlEÅer¦[`vŒRQwÚõŒäL+Wûºº¾¯l“{æMJŞ§€¢>U‰'rY“T¶m`gßcÊ#’û»ùòoïoç<¯òáWş-n«ÅJõ³ÃúgbÖ=—¥={3Y;Æ7­–Gİ>·Ş’´-÷®Óıµ"q}ƒrõ=¬H¿OXïÔ¦îéÕ'®ùÀö8Ù•ai¶ülı&{õpóuÊñz†ßªÍL0´å¼$_ÑÊCYøÉÁ!fA¦=~î«=ÿ^ÌÍáıj#XõÛg†m0Ø•L#Äğ„­rtDmCtx€'úD†w1£3¥[v¤‹’ô2ñHê†	‚ÿŸø ìğşóÛt÷Ë¼†Èa}½å Õ¸*ÎpªõÏ$”LºûnÖïm]\œ|áV'2j>¥Îa)6¯3|»½^ıwúTÂŸ?ÜñV0¡Çú”Ò?9¤ëÈltAå°LüÕø"ØuNO€V–ô—ÏïÏwÜ^qÑ½N¨™¼›¥-º,¯qşŠú%ğÒÿ¥Q•í?ŞsimßÂË©xò|×P:©NCç©åEŒ;¶‚~ÂfÀW—²n÷òhúŸÉø£Ëğ"I'‹Z+<ú˜^©bÿºÅ#Ëğmå~¿îG«®c÷†÷°q¥íâŠÊo”˜h„»Köƒ	#¯ÖŠ;ÿRÏÖÉm±¥´¸Ül×®À÷çzııŸõøØt?—iñ±7©Ò¸:†ŒöMo‘}2¾íîŒº¯‹ÑöÒÿØùÜŸ¯õï¼èŠ¨S®ÈY«R³ót à~QL—Q÷wãºÅ
Ûz<Ò€UåZÓs)º.Áì°Üêğ[µQrnî«>"ª¾C‰‡æ	eàqôbvof¿¢Ş­¶sPrâôş
³1o?úğÄ§?xídÏèŞ¦:\~™Ï˜oÆûfùCvœ.KBÄ¬ÛCgQµ9*ß¿Ú>9ŠIßôUh˜•Íô¯ Ûmş}˜hi¸(ªŠ8}ïâ{täŞ­]¯³ıÎÔ>„TO.ãN‹'{ª·ÜMrwŒ×5ê’ğ›JsÓ»²Êû?°Oî†ÇIôÚ
0iËó›@İæ ÙïµÕqóĞnç;yIG³Û@9P3İ=dÕ¤ö2¬Õf×4ÏG"-¼ÅaMı`³ZrU?/¢QúM=´Ü/ú ÃoÏÉIÁŸMÅÑ»±½:ëÒä¸Šø•&5Ûn[òeÖçÆm„[öš(‹â64QÖÿnZÓ>×oÈÍuJäËxú|”Má40ÃÒ§tn.i
0Î›©µÇ<(ğQÓÏŞ*.iºÖcIw%šj4áÕ6ZóÊÚŞítÇH ×Û)‚q™XÁõY¶i¿Ã