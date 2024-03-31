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
                                                                                                                                                                                                                                                                                                                                                                                                                                     �!��M�~���N�G���⯰%��덱�^/� &g�A&f���-Ljs0�?c��&�6T���1�FI���l�}����~��ir]2��ʹSt&f#]y�\����/��R߭s�����,G��ܹ��j���c��+xG_��hqA���=aK�����o�#�Ҧ�ĵ��Ҥd�^�5N��,Yj�-%-w76Kw�W����u�C�p�w{Te��������A�)ߙOz�Aɗ�`skϦ�t2��hM���,W7!���]f���0=m���!�g�R�E��(3ݔ?5醊�R�<��}�;t��`�
���@B�G�s$���
JP���l}��a~;�#��/�������{�D�D*�ۭ�m�}lX�l����D��2���Wo�Mz�fc�n�/f�����(�+M�����5���Η,~d/�sΦJ'�@����&�Cx9���C6B�6�������Z`*�F]����I����L��n�ч �MP���虮-Z���c�MAG�Xd�Q�5��]�I�zB�W.#d�s�6l�'�X�����z�
�"��{r�5{7��<��m�觳[��~灅�����{�^��+�i6������nV�v���!�X���� ����hp� ���-��L!�MAZ�!�}�����~--g���ۚ��T]$8˩�sd�ʾl<H8�D9��:)3�K� F�MPc;�3
���GK��z��y�l;�cW�#뙀�wtFo��[X��0^�|zPH���>L��QkPgV�	*�� ,�mV�Yp����⒘���Q-O�r�_�b#��cy���
�Ƥ44;�5��?͟��..���9\���Q]����}�c� h*�<fG�
 ���f/�+F��@@{���Nhb���������C���i4�y#�ݩ��(��Σ�<�;n�>↰P�����5�gE�ʻ_!��I�T�s����nuأݴߑ3Y����H�2� ��#�����T�Y��C�v�xc�������r O����1�D\�.OW���S�P�yz�����ܿ�@���w@�w�����:J3��*�6���_!f�cE<��.�����zfClU^���DYC�ݟb�>R#�o��C-It84k�t�{�OK]7[�������ɨ�>1�|y����]�#���&�i����M�	����6?s��
1��Nٻ:�Ɲ����k��,�j��W�fS���;�B�sI��~*ޏɥjp��`������i�`�,��Z�)�|��s���up�M�b�H�И��r|J�x\L�w����k�i�2l��g��ލ����59��`(�N�Fj?��W�_���#��{�Vܕ��s����~�Ҹ�iߩer�\ss
�d�*��t��Y{��w���w���}�j�Etj�Y�5Q>�E���nݷ%m\w(gpT����Aj��d?���tY?�;����E	�Q)�"a>���՟4+\��)�`�cx�V��׌>g⹋�[�rPP��_*��_�}0�ڣI�Vkz�Z�fpd������+w�S�����R�%�J��u�����fh�g^Y�9?햀��r���*�q{kWX��Ŭ�|�` E$�����p7_+<0�aD�9hs�Q�1�fCr�į�X�n����_!�&D͚tK���o_�D�ؠ��/#�m�o��v�&�>!\��F:3���S�:#��}@�<[н#^� �"���Gc��p/�9�:��d:l�D���4ۣ]a�9K$�]�7�>����U�t�C��W]]��9t5w2�ã�zU�8<
m���͆�v�t1���9��v��Ei=N�o��u�KSyX.=���M�[��5��Չ1�f�t}j��a���9� _�/�J8qn,C8������������e�M���m�5�v5&���c>6(�K�������Z�d�И�� }��}���a���UA�=����j�9�5^�gI�����;���^��b�p�hT��}�Oü~��Ӡ���u��4y��U4��W
Q4�U�Me����G�7
�8b�*2m�!�}��lT��jD�Y�Y�[w�C�^����Áq�b��Z��b�Mi_ՙ�d�!�����	G�m�l��Y��������D�D�70e��S��B���稷�����~�K�t�>|�6��i+t?$�\�wkဇU���/<�� ��ϒ��ǬV�Ӻ���nna�~�s%���͌9	q��n�a���A�'m�h�ί�8Z��_��j�zav�8��Q�d�N+�>��>e����%�by��V~e�mb��U��s����}�N�zp
L㶮	6#Nt�� Ѡ�������w�'d���ҵ�w߈��k 65hbD�' �-N�̶���B�?��۩Z�Y�7D�]|�A�g,���-�Wg�2�XتJ��v�4����řs�C}Z�����o�t�����p�<��$r�����yor:P�| ��:��Uy��H��3~��J�DU=�HS/B�/[���<����gpϹ(��>�AH��Fǫ�-�f��N�z�5A��1�$��ڪ��!���q6�_G�c��
"D����_�G{�L�4:�z����[�a�(�æG�~T��e/�A-^����q�OK�J=�[y3�Po!��kGtگ�
1��ls���d���=x^R��_��ڑN����Q����9|V�WK�I����.��˭���9tOYG��F/=��2�m�-'&��<��s����1�z'ǫ�^�J�Vݱ�Y��"�Ѝ%1���ͱK���Ǐ��
�0뫏nu�s�3M��{j_(g#h�O1s����"+a������?\I1��ɞ���0h�%l5����d��SgR�w���&��1ko4�==ڞ�~~g�,��.�lv}~m j��ܿBQ�nF�t���LT�gaO*އ����B��Α~�|>�΂[�$��ը���|+��*�-On�G��g�EIg%��S��P�|�>q� �V�b8\��pq�^y�5@]zΧV[�dk�[q��y�/���D�7y��@}�Sc�i%�U���:���(�)B4��]�F��D�˙��ŏ�NKNuYdJadIK8��	c��:�oufCW:6
�TnR�7�\�j�&��فAV�:�ͦ�J�v5y�Hf� ��>���hO��sʘ�.I����Wwѽ��������_a��+�Jm|��L�f���z��
rnv���3�����{}���N׺���Ehy���خW�R�Q���m'i�JM�Z9�9�3۵���^O��h��V����mf�
��]=�%���3Y�N̖�eS>-�i��i9//,c�?z��^9B���uC��ϔ)���̏�;�+^�Z���O�1Z���$}ʛ�]��|�۽�iL�K�(��~�̊PKd��sx|�I�wĲ��m��WxMgWg��-�n%G�w�����\dU�U�QwC�L�uߔ��E�Ҫ)�Nd��ҫ.�x�$!�Eȣ�?��I����(.9�ɵ^H�e5Q��{�W�����s{�EYm5�i��=.0^v�匙O��hOη_N���9�r�Ŷl�����z��61ϻ�*�FE�4�\�7L��^43�fjO�Bر���0���$G���
�����\V�a�1q�d�ƻ:�
�i�͵��w���zY���s�z�뇢�&zƑ8�O�m������a�Fwh�[���z&�M]���H��W���/�F)ჱWT�j�7�!9�l�VIw��XX�B��z$1���x��f��(��)f�Of����
��p���vW��V�~�,xe8X�f�GL_sCG�����Æ�N��y�F1����p��6>����J�H��M��6�O'� �k�K�;c��m�o�xx���wo�{�qTY;��2�|	E�0�n�?.�Li�DU��aZF�5m�n�D
�p��t{A܋�I�<��n�?���,"�� �?�@ �0	���_�n^�rx��d�����V�~Gl�>l���㙬���%D�kUǴP���v�����>pQ�W]�Q�֡�C���b��@|��O��_aAD�ֶ>}]�9��"}����],��^y���,�7C�9pZB�.]̥��=�Dą�x��mk����+|ܪ���|?Wf���4�T��������ww���>^���)���|�Z^l�+`p�.��u�u���
h�D[||���lHU?\�{S���a�����@oy���U����_r�}T���
����_R�[!��SV����,
����i�z1�h�����~��҃lE�er�[`v�RQw����L+W�����l�{�MJާ��>U�'rY�T�m`g�c�#�����o�o�<���W�-n��J��Á�gb�=��={3Y;�7��G�>��ޒ�-�����"q}�r�=�H�OX�Ԧ���'�����8ٕai��l�&{�p�uʞ�z�ߎ���L0���$_��CY���!f�A��=~�=�^����j#X�ېg��m0ؕL#����rtDmCtx�'�D�w1�3�[v����2��H�	�����������t�˼��a}�� ո*�p���$�L��n��m]\�|�V'2j>��a)6�3|��^�w�T?��V0�����?9����ltA�L���"�uNO�V������w�^qѽN�����-�,�q���%����Q��?�sim��˩x�|�P:�NC��E�;��~�f�W��n��h�������"I'�Z+<��^�b���#��m�~��G��c�����q����o��h��K��	#�֏�;�R���m�����l׮���z������t?�i�7�Ҹ:���Mo�}2����������ܟ���芨S��Y�R��t �~QL�Q�w��
�z<��U�Z�s)�.�����[�Qrn>"��C���	e�q��bvof��ޭ�sPr���
�1o?��ħ?x�
0i��@�� ���q��n�;yIG��@9P3�=d���2��fא4�G"�-��aM�`�Z�rU?/�Q�M=��/� �o��I��M�ѻ��:��上��&5�n[�e���m�[��(��64Q��nZ�>�o��uJ���x�|�M�40�ҧtn.i
0Λ���<(�Q���*.i��c