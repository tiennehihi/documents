wChild)) {
        if (key !== null) {
          return null;
        }

        return updateFragment(returnFiber, oldFiber, newChild, lanes, null);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType(returnFiber);
      }
    }

    return null;
  }

  function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
    if (typeof newChild === 'string' && newChild !== '' || typeof newChild === 'number') {
      // Text nodes don't have keys, so we neither have to check the old nor
      // new node for the key. If both are text nodes, they match.
      var matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, '' + newChild, lanes);
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            var _matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;

            return updateElement(returnFiber, _matchedFiber, newChild, lanes);
          }

        case REACT_PORTAL_TYPE:
          {
            var _matchedFiber2 = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;

            return updatePortal(returnFiber, _matchedFiber2, newChild, lanes);
          }

        case REACT_LAZY_TYPE:
          var payload = newChild._payload;
          var init = newChild._init;
          return updateFromMap(existingChildren, returnFiber, newIdx, init(payload), lanes);
      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        var _matchedFiber3 = existingChildren.get(newIdx) || null;

        return updateFragment(returnFiber, _matchedFiber3, newChild, lanes, null);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType(returnFiber);
      }
    }

    return null;
  }
  /**
   * Warns if there is a duplicate or missing key
   */


  function warnOnInvalidKey(child, knownKeys, returnFiber) {
    {
      if (typeof child !== 'object' || child === null) {
        return knownKeys;
      }

      switch (child.$$typeof) {
        case REACT_ELEMENT_TYPE:
        case REACT_PORTAL_TYPE:
          warnForMissingKey(child, returnFiber);
          var key = child.key;

          if (typeof key !== 'string') {
            break;
          }

          if (knownKeys === null) {
            knownKeys = new Set();
            knownKeys.add(key);
            break;
          }

          if (!knownKeys.has(key)) {
            knownKeys.add(key);
            break;
          }

          error('Encountered two children with the same key, `%s`. ' + 'Keys should be unique so that components maintain their identity ' + 'across updates. Non-unique keys may cause children to be ' + 'duplicated and/or omitted — the behavior is unsupported and ' + 'could change in a future version.', key);

          break;

        case REACT_LAZY_TYPE:
          var payload = child._payload;
          var init = child._init;
          warnOnInvalidKey(init(payload), knownKeys, returnFiber);
          break;
      }
    }

    return knownKeys;
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
    // This algorithm can't optimize by searching from both ends since we
    // don't have backpointers on fibers. I'm trying to see how far we can get
    // with that model. If it ends up not being worth the tradeoffs, we can
    // add it later.
    // Even with a two ended optimization, we'd want to optimize for the case
    // where there are few changes and brute force the comparison instead of
    // going for the Map. It'd like to explore hitting that path first in
    // forward-only mode and only go for the Map once we notice that we need
    // lots of look ahead. This doesn't handle reversal as well as two ended
    // search but that's unusual. Besides, for the two ended optimization to
    // work on Iterables, we'd need to copy the whole set.
    // In this first iteration, we'll just live with hitting the bad case
    // (adding everything to a Map) in for every insert/move.
    // If you change this code, also update reconcileChildrenIterator() which
    // uses the same algorithm.
    {
      // First, validate keys.
      var knownKeys = null;

      for (var i = 0; i < newChildren.length; i++) {
        var child = newChildren[i];
        knownKeys = warnOnInvalidKey(child, knownKeys, returnFiber);
      }
    }

    var resultingFirstChild = null;
    var previousNewFiber = null;
    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;

    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

      var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);

      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }

        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);

      if (getIsHydrating()) {
        var numberOfForks = newIdx;
        pushTreeFork(returnFiber, numberOfForks);
      }

      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
        var _newFiber = createChild(returnFiber, newChildren[newIdx], lanes);

        if (_newFiber === null) {
          continue;
        }

        lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = _newFiber;
        } else {
          previousNewFiber.sibling = _newFiber;
        }

        previousNewFiber = _newFiber;
      }

      if (getIsHydrating()) {
        var _numberOfForks = newIdx;
        pushTreeFork(returnFiber, _numberOfForks);
      }

      return resultingFirstChild;
    } // Add all children to a key map for quick lookups.


    var existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

    for (; newIdx < newChildren.length; newIdx++) {
      var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);

      if (_newFiber2 !== null) {
        if (shouldTrackSideEffects) {
          if (_newFiber2.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(_newFiber2.key === null ? newIdx : _newFiber2.key);
          }
        }

        lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = _newFiber2;
        } else {
          previousNewFiber.sibling = _newFiber2;
        }

        previousNewFiber = _newFiber2;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(function (child) {
        return deleteChild(returnFiber, child);
      });
    }

    if (getIsHydrating()) {
      var _numberOfForks2 = newIdx;
      pushTreeFork(returnFiber, _numberOfForks2);
    }

    return resultingFirstChild;
  }

  function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildrenIterable, lanes) {
    // This is the same implementation as reconcileChildrenArray(),
    // but using the iterator instead.
    var iteratorFn = getIteratorFn(newChildrenIterable);

    if (typeof iteratorFn !== 'function') {
      throw new Error('An object is not an iterable. This error is likely caused by a bug in ' + 'React. Please file an issue.');
    }

    {
      // We don't support rendering Generators because it's a mutation.
      // See https://github.com/facebook/react/issues/12995
      if (typeof Symbol === 'function' && // $FlowFixMe Flow doesn't know about toStringTag
      newChildrenIterable[Symbol.toStringTag] === 'Generator') {
        if (!didWarnAboutGenerators) {
          error('Using Generators as children is unsupported and will likely yield ' + 'unexpected results because enumerating a generator mutates it. ' + 'You may convert it to an array with `Array.from()` or the ' + '`[...spread]` operator before rendering. Keep in mind ' + 'you might need to polyfill these features for older browsers.');
        }

        didWarnAboutGenerators = true;
      } // Warn about using Maps as children


      if (newChildrenIterable.entries === iteratorFn) {
        if (!didWarnAboutMaps) {
          error('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
        }

        didWarnAboutMaps = true;
      } // First, validate keys.
      // We'll get a different iterator later for the main pass.


      var _newChildren = iteratorFn.call(newChildrenIterable);

      if (_newChildren) {
        var knownKeys = null;

        var _step = _newChildren.next();

        for (; !_step.done; _step = _newChildren.next()) {
          var child = _step.value;
          knownKeys = warnOnInvalidKey(child, knownKeys, returnFiber);
        }
      }
    }

    var newChildren = iteratorFn.call(newChildrenIterable);

    if (newChildren == null) {
      throw new Error('An iterable object provided no iterator.');
    }

    var resultingFirstChild = null;
    var previousNewFiber = null;
    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;
    var step = newChildren.next();

    for (; oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

      var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);

      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }

        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (step.done) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);

      if (getIsHydrating()) {
        var numberOfForks = newIdx;
        pushTreeFork(returnFiber, numberOfForks);
      }

      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; !step.done; newIdx++, step = newChildren.next()) {
        var _newFiber3 = createChild(returnFiber, step.value, lanes);

        if (_newFiber3 === null) {
          continue;
        }

        lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = _newFiber3;
        } else {
          previousNewFiber.sibling = _newFiber3;
        }

        previousNewFiber = _newFiber3;
      }

      if (getIsHydrating()) {
        var _numberOfForks3 = newIdx;
        pushTreeFork(returnFiber, _numberOfForks3);
      }

      return resultingFirstChild;
    } // Add all children to a key map for quick lookups.


    var existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

    for (; !step.done; newIdx++, step = newChildren.next()) {
      var _newFiber4 = updateFromMap(existingChildren, returnFiber, newIdx, step.value, lanes);

      if (_newFiber4 !== null) {
        if (shouldTrackSideEffects) {
          if (_newFiber4.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(_newFiber4.key === null ? newIdx : _newFiber4.key);
          }
        }

        lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = _newFiber4;
        } else {
          previousNewFiber.sibling = _newFiber4;
        }

        previousNewFiber = _newFiber4;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(function (child) {
        return deleteChild(returnFiber, child);
      });
    }

    if (getIsHydrating()) {
      var _numberOfForks4 = newIdx;
      pushTreeFork(returnFiber, _numberOfForks4);
    }

    return resultingFirstChild;
  }

  function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, lanes) {
    // There's no need to check for keys on text nodes since we don't have a
    // way to define them.
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      // We already have an existing node so let's just update it and delete
      // the rest.
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
      var existing = useFiber(currentFirstChild, textContent);
      existing.return = returnFiber;
      return existing;
    } // The existing first child is not a text node so we need to create one
    // and delete the existing ones.


    deleteRemainingChildren(returnFiber, currentFirstChild);
    var created = createFiberFromText(textContent, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element, lanes) {
    var key = element.key;
    var child = currentFirstChild;

    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        var elementType = element.type;

        if (elementType === REACT_FRAGMENT_TYPE) {
          if (child.tag === Fragment) {
            deleteRemainingChildren(returnFiber, child.sibling);
            var existing = useFiber(child, element.props.children);
            existing.return = returnFiber;

            {
              existing._debugSource = element._source;
              existing._debugOwner = element._owner;
            }

            return existing;
          }
        } else {
          if (child.elementType === elementType || ( // Keep this check inline so it only runs on the false path:
           isCompatibleFamilyForHotReloading(child, element) ) || // Lazy types should reconcile their resolved type.
          // We need to do this after the Hot Reloading check above,
          // because hot reloading has different semantics than prod because
          // it doesn't resuspend. So we can't let the call below suspend.
          typeof elementType === 'object' && elementType !== null && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === child.type) {
            deleteRemainingChildren(returnFiber, child.sibling);

            var _existing = useFiber(child, element.props);

            _existing.ref = coerceRef(returnFiber, child, element);
            _existing.return = returnFiber;

            {
              _existing._debugSource = element._source;
              _existing._debugOwner = element._owner;
            }

            return _existing;
          }
        } // Didn't match.


        deleteRemainingChildren(returnFiber, child);
        break;
      } else {
        deleteChild(returnFiber, child);
      }

      child = child.sibling;
    }

    if (element.type === REACT_FRAGMENT_TYPE) {
      var created = createFiberFromFragment(element.props.children, returnFiber.mode, lanes, element.key);
      created.return = returnFiber;
      return created;
    } else {
      var _created4 = createFiberFromElement(element, returnFiber.mode, lanes);

      _created4.ref = coerceRef(returnFiber, currentFirstChild, element);
      _created4.return = returnFiber;
      return _created4;
    }
  }

  function reconcileSinglePortal(returnFiber, currentFirstChild, portal, lanes) {
    var key = portal.key;
    var child = currentFirstChild;

    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        if (child.tag === HostPortal && child.stateNode.containerInfo === portal.containerInfo && child.stateNode.implementation === portal.implementation) {
          deleteRemainingChildren(returnFiber, child.sibling);
          var existing = useFiber(child, portal.children || []);
          existing.return = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }

      child = child.sibling;
    }

    var created = createFiberFromPortal(portal, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  } // This API will tag the children with the side-effect of the reconciliation
  // itself. They will be added to the side-effect list as we pass through the
  // children and the parent.


  function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.
    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    var isUnkeyedTopLevelFragment = typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null;

    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    } // Handle object types


    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));

        case REACT_PORTAL_TYPE:
          return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes));

        case REACT_LAZY_TYPE:
          var payload = newChild._payload;
          var init = newChild._init; // TODO: This function is supposed to be non-recursive.

          return reconcileChildFibers(returnFiber, currentFirstChild, init(payload), lanes);
      }

      if (isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
      }

      if (getIteratorFn(newChild)) {
        return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    if (typeof newChild === 'string' && newChild !== '' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, lanes));
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType(returnFiber);
      }
    } // Remaining cases are all treated as empty.


    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }

  return reconcileChildFibers;
}

var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);
function cloneChildFibers(current, workInProgress) {
  if (current !== null && workInProgress.child !== current.child) {
    throw new Error('Resuming work not yet implemented.');
  }

  if (workInProgress.child === null) {
    return;
  }

  var currentChild = workInProgress.child;
  var newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
  workInProgress.child = newChild;
  newChild.return = workInProgress;

  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps);
    newChild.return = workInProgress;
  }

  newChild.sibling = null;
} // Reset a workInProgress child set to prepare it for a second pass.

function resetChildFibers(workInProgress, lanes) {
  var child = workInProgress.child;

  while (child !== null) {
    resetWorkInProgress(child, lanes);
    child = child.sibling;
  }
}

var NO_CONTEXT = {};
var contextStackCursor$1 = createCursor(NO_CONTEXT);
var contextFiberStackCursor = createCursor(NO_CONTEXT);
var rootInstanceStackCursor = createCursor(NO_CONTEXT);

function requiredContext(c) {
  if (c === NO_CONTEXT) {
    throw new Error('Expected host context to exist. This error is likely caused by a bug ' + 'in React. Please file an issue.');
  }

  return c;
}

function getRootHostContainer() {
  var rootInstance = requiredContext(rootInstanceStackCursor.current);
  return rootInstance;
}

function pushHostContainer(fiber, nextRootInstance) {
  // Push current root instance onto the stack;
  // This allows us to reset root when portals are popped.
  push(rootInstanceStackCursor, nextRootInstance, fiber); // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.

  push(contextFiberStackCursor, fiber, fiber); // Finally, we need to push the host context to the stack.
  // However, we can't just call getRootHostContext() and push it because
  // we'd have a different number of entries on the stack depending on
  // whether getRootHostContext() throws somewhere in renderer code or not.
  // So we push an empty value first. This lets us safely unwind on errors.

  push(contextStackCursor$1, NO_CONTEXT, fiber);
  var nextRootContext = getRootHostContext(nextRootInstance); // Now that we know this function doesn't throw, replace it.

  pop(contextStackCursor$1, fiber);
  push(contextStackCursor$1, nextRootContext, fiber);
}

function popHostContainer(fiber) {
  pop(contextStackCursor$1, fiber);
  pop(contextFiberStackCursor, fiber);
  pop(rootInstanceStackCursor, fiber);
}

function getHostContext() {
  var context = requiredContext(contextStackCursor$1.current);
  return context;
}

function pushHostContext(fiber) {
  var rootInstance = requiredContext(rootInstanceStackCursor.current);
  var context = requiredContext(contextStackCursor$1.current);
  var nextContext = getChildHostContext(context, fiber.type); // Don't push this Fiber's context unless it's unique.

  if (context === nextContext) {
    return;
  } // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.


  push(contextFiberStackCursor, fiber, fiber);
  push(contextStackCursor$1, nextContext, fiber);
}

function popHostContext(fiber) {
  // Do not pop unless this Fiber provided the current context.
  // pushHostContext() only pushes Fibers that provide unique contexts.
  if (contextFiberStackCursor.current !== fiber) {
    return;
  }

  pop(contextStackCursor$1, fiber);
  pop(contextFiberStackCursor, fiber);
}

var DefaultSuspenseContext = 0; // The Suspense Context is split into two parts. The lower bits is
// inherited deeply down the subtree. The upper bits only affect
// this immediate suspense boundary and gets reset each new
// boundary or suspense list.

var SubtreeSuspenseContextMask = 1; // Subtree Flags:
// InvisibleParentSuspenseContext indicates that one of our parent Suspense
// boundaries is not currently showing visible main content.
// Either because it is already showing a fallback or is not mounted at all.
// We can use this to determine if it is desirable to trigger a fallback at
// the parent. If not, then we might need to trigger undesirable boundaries
// and/or suspend the commit to avoid hiding the parent content.

var InvisibleParentSuspenseContext = 1; // Shallow Flags:
// ForceSuspenseFallback can be used by SuspenseList to force newly added
// items into their fallback state during one of the render passes.

var ForceSuspenseFallback = 2;
var suspenseStackCursor = createCursor(DefaultSuspenseContext);
function hasSuspenseContext(parentContext, flag) {
  return (parentContext & flag) !== 0;
}
function setDefaultShallowSuspenseContext(parentContext) {
  return parentContext & SubtreeSuspenseContextMask;
}
function setShallowSuspenseContext(parentContext, shallowContext) {
  return parentContext & SubtreeSuspenseContextMask | shallowContext;
}
function addSubtreeSuspenseContext(parentContext, subtreeContext) {
  return parentContext | subtreeContext;
}
function pushSuspenseContext(fiber, newContext) {
  push(suspenseStackCursor, newContext, fiber);
}
function popSuspenseContext(fiber) {
  pop(suspenseStackCursor, fiber);
}

function shouldCaptureSuspense(workInProgress, hasInvisibleParent) {
  // If it was the primary children that just suspended, capture and render the
  // fallback. Otherwise, don't capture and bubble to the next boundary.
  var nextState = workInProgress.memoizedState;

  if (nextState !== null) {
    if (nextState.dehydrated !== null) {
      // A dehydrated boundary always captures.
      return true;
    }

    return false;
  }

  var props = workInProgress.memoizedProps; // Regular boundaries always capture.

  {
    return true;
  } // If it's a boundary we should avoid, then we prefer to bubble up to the
}
function findFirstSuspended(row) {
  var node = row;

  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      var state = node.memoizedState;

      if (state !== null) {
        var dehydrated = state.dehydrated;

        if (dehydrated === null || isSuspenseInstancePending(dehydrated) || isSuspenseInstanceFallback(dehydrated)) {
          return node;
        }
      }
    } else if (node.tag === SuspenseListComponent && // revealOrder undefined can't be trusted because it don't
    // keep track of whether it suspended or not.
    node.memoizedProps.revealOrder !== undefined) {
      var didSuspend = (node.flags & DidCapture) !== NoFlags;

      if (didSuspend) {
        return node;
      }
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === row) {
      return null;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === row) {
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }

  return null;
}

var NoFlags$1 =
/*   */
0; // Represents whether effect should fire.

var HasEffect =
/* */
1; // Represents the phase in which the effect (not the clean-up) fires.

var Insertion =
/*  */
2;
var Layout =
/*    */
4;
var Passive$1 =
/*   */
8;

// and should be reset before starting a new render.
// This tracks which mutable sources need to be reset after a render.

var workInProgressSources = [];
function resetWorkInProgressVersions() {
  for (var i = 0; i < workInProgressSources.length; i++) {
    var mutableSource = workInProgressSources[i];

    {
      mutableSource._workInProgressVersionPrimary = null;
    }
  }

  workInProgressSources.length = 0;
}
// This ensures that the version used for server rendering matches the one
// that is eventually read during hydration.
// If they don't match there's a potential tear and a full deopt render is required.

function registerMutableSourceForHydration(root, mutableSource) {
  var getVersion = mutableSource._getVersion;
  var version = getVersion(mutableSource._source); // TODO Clear this data once all pending hydration work is finished.
  // Retaining it forever may interfere with GC.

  if (root.mutableSourceEagerHydrationData == null) {
    root.mutableSourceEagerHydrationData = [mutableSource, version];
  } else {
    root.mutableSourceEagerHydrationData.push(mutableSource, version);
  }
}

var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher,
    ReactCurrentBatchConfig$2 = ReactSharedInternals.ReactCurrentBatchConfig;
var didWarnAboutMismatchedHooksForComponent;
var didWarnUncachedGetSnapshot;

{
  didWarnAboutMismatchedHooksForComponent = new Set();
}

// These are set right before calling the component.
var renderLanes = NoLanes; // The work-in-progress fiber. I've named it differently to distinguish it from
// the work-in-progress hook.

var currentlyRenderingFiber$1 = null; // Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.

var currentHook = null;
var workInProgressHook = null; // Whether an update was scheduled at any point during the render phase. This
// does not get reset if we do another render pass; only when we're completely
// finished evaluating this component. This is an optimization so we know
// whether we need to clear render phase updates after a throw.

var didScheduleRenderPhaseUpdate = false; // Where an update was scheduled only during the current render pass. This
// gets reset after each attempt.
// TODO: Maybe there's some way to consolidate this with
// `didScheduleRenderPhaseUpdate`. Or with `numberOfReRenders`.

var didScheduleRenderPhaseUpdateDuringThisPass = false; // Counts the number of useId hooks in this component.

var localIdCounter = 0;of your custom utility file from where you re-export everything from the Testing Library package, or `"off"` to switch related Aggressive Reporting mechanism off. Relates to [Aggressive Imports Reporting](docs/migration-guides/v4.md#imports).

```js
// .eslintrc.js
module.exports = {
	settings: {
		'testing-library/utils-module': 'my-custom-test-utility-file',
	},
};
```

[You can find more details about the `utils-module` setting here](docs/migration-guides/v4.md#testing-libraryutils-module).

### `testing-library/custom-renders`

A list of function names that are valid as Testing Library custom renders, or `"off"` to switch related Aggressive Reporting mechanism off. Relates to [Aggressive Renders Reporting](docs/migration-guides/v4.md#renders).

```js
// .eslintrc.js
module.exports = {
	settings: {
		'testing-library/custom-renders': ['display', 'renderWithProviders'],
	},
};
```

[You can find more details about the `custom-renders` setting here](docs/migration-guides/v4.md#testing-librarycustom-renders).

### `testing-library/custom-queries`

A list of query names/patterns that are valid as Testing Library custom queries, or `"off"` to switch related Aggressive Reporting mechanism off. Relates to [Aggressive Reporting - Queries](docs/migration-guides/v4.md#queries)

```js
// .eslintrc.js
module.exports = {
	settings: {
		'testing-library/custom-queries': ['ByIcon', 'getByComplexText'],
	},
};
```

[You can find more details about the `custom-queries` setting here](docs/migration-guides/v4.md#testing-librarycustom-queries).

### Switching all Aggressive Reporting mechanisms off

Since each Shared Setting is related to one Aggressive Reporting mechanism, and they accept `"off"` to opt out of that mechanism, you can switch the entire feature off by doing:

```js
// .eslintrc.js
module.exports = {
	settings: {
		'testing-library/utils-module': 'off',
		'testing-library/custom-renders': 'off',
		'testing-library/custom-queries': 'off',
	},
};
```

## Troubleshooting

### Errors reported in non-testing files

If you find ESLint errors related to `eslint-plugin-testing-library` in files other than testing, this could be caused by [Aggressive Reporting](#aggressive-reporting).

You can avoid this by:

1. [running `eslint-plugin-testing-library` only against testing files](#run-the-plugin-only-against-test-files)
2. [limiting the scope of Aggressive Reporting through Shared Settings](#shared-settings)
3. [switching Aggressive Reporting feature off](#switching-all-aggressive-reporting-mechanisms-off)

If you think the error you are getting is not related to this at all, please [fill a new issue](https://github.com/testing-library/eslint-plugin-testing-library/issues/new/choose) with as many details as possible.

### False positives in testing files

If you are getting false positive ESLint errors in your testing files, this could be caused by [Aggressive Reporting](#aggressive-reporting).

You can avoid this by:

1. [limiting the scope of Aggressive Reporting through Shared Settings](#shared-settings)
2. [switching Aggressive Reporting feature off](#switching-all-aggressive-reporting-mechanisms-off)

If you think the error you are getting is not related to this at all, please [fill a new issue](https://github.com/testing-library/eslint-plugin-testing-library/issues/new/choose) with as many details as possible.

## Other documentation

- [Semantic Versioning Policy](/docs/semantic-versioning-policy.md)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://mario.dev"><img src="https://avatars1.githubusercontent.com/u/2677072?v=4?s=100" width="100px;" alt="Mario Beltrán Alarcón"/><br /><sub><b>Mario Beltrán Alarcón</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Belco90" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Belco90" title="Documentation">📖</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/pulls?q=is%3Apr+reviewed-by%3ABelco90" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Belco90" title="Tests">⚠️</a> <a href="#infra-Belco90" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3ABelco90" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://thomlom.dev"><img src="https://avatars3.githubusercontent.com/u/16003285?v=4?s=100" width="100px;" alt="Thomas Lombart"/><br /><sub><b>Thomas Lombart</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=thomlom" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=thomlom" title="Documentation">📖</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/pulls?q=is%3Apr+reviewed-by%3Athomlom" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=thomlom" title="Tests">⚠️</a> <a href="#infra-thomlom" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/benmonro"><img src="https://avatars3.githubusercontent.com/u/399236?v=4?s=100" width="100px;" alt="Ben Monro"/><br /><sub><b>Ben Monro</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=benmonro" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=benmonro" title="Documentation">📖</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=benmonro" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://emmenko.org/"><img src="https://avatars2.githubusercontent.com/u/1110551?v=4?s=100" width="100px;" alt="Nicola Molinari"/><br /><sub><b>Nicola Molinari</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=emmenko" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=emmenko" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=emmenko" title="Documentation">📖</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/pulls?q=is%3Apr+reviewed-by%3Aemmenko" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://aarongarciah.com"><img src="https://avatars0.githubusercontent.com/u/7225802?v=4?s=100" width="100px;" alt="Aarón García Hervás"/><br /><sub><b>Aarón García Hervás</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=aarongarciah" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.matej.snuderl.si/"><img src="https://avatars3.githubusercontent.com/u/8524109?v=4?s=100" width="100px;" alt="Matej Šnuderl"/><br /><sub><b>Matej Šnuderl</b></sub></a><br /><a href="#ideas-Meemaw" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Meemaw" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://afontcu.dev"><img src="https://avatars0.githubusercontent.com/u/9197791?v=4?s=100" width="100px;" alt="Adrià Fontcuberta"/><br /><sub><b>Adrià Fontcuberta</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=afontcu" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=afontcu" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jonaldinger"><img src="https://avatars1.githubusercontent.com/u/663362?v=4?s=100" width="100px;" alt="Jon Aldinger"/><br /><sub><b>Jon Aldinger</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=jonaldinger" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.thomasknickman.com"><img src="https://avatars1.githubusercontent.com/u/2933988?v=4?s=100" width="100px;" alt="Thomas Knickman"/><br /><sub><b>Thomas Knickman</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=tknickman" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=tknickman" title="Documentation">📖</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=tknickman" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://exercism.io/profiles/wolverineks/619ce225090a43cb891d2edcbbf50401"><img src="https://avatars2.githubusercontent.com/u/8462274?v=4?s=100" width="100px;" alt="Kevin Sullivan"/><br /><sub><b>Kevin Sullivan</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=wolverineks" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://kubajastrz.com"><img src="https://avatars0.githubusercontent.com/u/6443113?v=4?s=100" width="100px;" alt="Jakub Jastrzębski"/><br /><sub><b>Jakub Jastrzębski</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=KubaJastrz" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=KubaJastrz" title="Documentation">📖</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=KubaJastrz" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://arvigeus.github.com"><img src="https://avatars2.githubusercontent.com/u/4872470?v=4?s=100" width="100px;" alt="Nikolay Stoynov"/><br /><sub><b>Nikolay Stoynov</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=arvigeus" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://marudor.de"><img src="https://avatars0.githubusercontent.com/u/1881725?v=4?s=100" width="100px;" alt="marudor"/><br /><sub><b>marudor</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=marudor" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=marudor" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://timdeschryver.dev"><img src="https://avatars1.githubusercontent.com/u/28659384?v=4?s=100" width="100px;" alt="Tim Deschryver"/><br /><sub><b>Tim Deschryver</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=timdeschryver" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=timdeschryver" title="Documentation">📖</a> <a href="#ideas-timdeschryver" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/pulls?q=is%3Apr+reviewed-by%3Atimdeschryver" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=timdeschryver" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Atimdeschryver" title="Bug reports">🐛</a> <a href="#infra-timdeschryver" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#platform-timdeschryver" title="Packaging/porting to new platform">📦</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://tdeekens.name"><img src="https://avatars3.githubusercontent.com/u/1877073?v=4?s=100" width="100px;" alt="Tobias Deekens"/><br /><sub><b>Tobias Deekens</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Atdeekens" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/victorandcode"><img src="https://avatars0.githubusercontent.com/u/18427801?v=4?s=100" width="100px;" alt="Victor Cordova"/><br /><sub><b>Victor Cordova</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=victorandcode" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=victorandcode" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Avictorandcode" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dmitry-lobanov"><img src="https://avatars0.githubusercontent.com/u/7376755?v=4?s=100" width="100px;" alt="Dmitry Lobanov"/><br /><sub><b>Dmitry Lobanov</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=dmitry-lobanov" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=dmitry-lobanov" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://kentcdodds.com"><img src="https://avatars0.githubusercontent.com/u/1500684?v=4?s=100" width="100px;" alt="Kent C. Dodds"/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Akentcdodds" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/gndelia"><img src="https://avatars1.githubusercontent.com/u/352474?v=4?s=100" width="100px;" alt="Gonzalo D'Elia"/><br /><sub><b>Gonzalo D'Elia</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=gndelia" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=gndelia" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=gndelia" title="Documentation">📖</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/pulls?q=is%3Apr+reviewed-by%3Agndelia" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jmcriffey"><img src="https://avatars0.githubusercontent.com/u/2831294?v=4?s=100" width="100px;" alt="Jeff Rifwald"/><br /><sub><b>Jeff Rifwald</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=jmcriffey" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://blog.lourenci.com/"><img src="https://avatars3.githubusercontent.com/u/2339362?v=4?s=100" width="100px;" alt="Leandro Lourenci"/><br /><sub><b>Leandro Lourenci</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Alourenci" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=lourenci" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=lourenci" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://xxxl.digital/"><img src="https://avatars2.githubusercontent.com/u/42043025?v=4?s=100" width="100px;" alt="Miguel Er.`));
                    }
                    return newSourcePath;
                }
                return sourcePath;
            })
                .map(normalize);
            timeEnd('sourcemap', 2);
        }
        if (!options.compact && code[code.length - 1] !== '\n')
            code += '\n';
        return { code, map };
    }
    addDependenciesToChunk(moduleDependencies, chunkDependencies) {
        for (const module of moduleDependencies) {
            if (module instanceof Module) {
                const chunk = this.chunkByModule.get(module);
                if (chunk && chunk !== this) {
                    chunkDependencies.add(chunk);
                }
            }
            else {
                chunkDependencies.add(module);
            }
        }
    }
    addNecessaryImportsForFacades() {
        for (const [module, variables] of this.includedReexportsByModule) {
            if (this.includedNamespaces.has(module)) {
                for (const variable of variables) {
                    this.imports.add(variable);
                }
            }
        }
    }
    assignFacadeName({ fileName, name }, facadedModule) {
        if (fileName) {
            this.fileName = fileName;
        }
        else {
            this.name = this.outputOptions.sanitizeFileName(name || getChunkNameFromModule(facadedModule));
        }
    }
    checkCircularDependencyImport(variable, importingModule) {
        const variableModule = variable.module;
        if (variableModule instanceof Module) {
            const exportChunk = this.chunkByModule.get(variableModule);
            let alternativeReexportModule;
            do {
                alternativeReexportModule = importingModule.alternativeReexportModules.get(variable);
                if (alternativeReexportModule) {
                    const exportingChunk = this.chunkByModule.get(alternativeReexportModule);
                    if (exportingChunk && exportingChunk !== exportChunk) {
                        this.inputOptions.onwarn(errCyclicCrossChunkReexport(variableModule.getExportNamesByVariable().get(variable)[0], variableModule.id, alternativeReexportModule.id, importingModule.id));
                    }
                    importingModule = alternativeReexportModule;
                }
            } while (alternativeReexportModule);
        }
    }
    computeContentHashWithDependencies(addons, options, bundle) {
        const hash = createHash();
        hash.update([addons.intro, addons.outro, addons.banner, addons.footer].join(':'));
        hash.update(options.format);
        const dependenciesForHashing = new Set([this]);
        for (const current of dependenciesForHashing) {
            if (current instanceof ExternalModule) {
                hash.update(`:${current.renderPath}`);
            }
            else {
                hash.update(current.getRenderedHash());
                hash.update(current.generateId(addons, options, bundle, false));
            }
            if (current instanceof ExternalModule)
                continue;
            for (const dependency of [...current.dependencies, ...current.dynamicDependencies]) {
                dependenciesForHashing.add(dependency);
            }
        }
        return hash.digest('hex').substr(0, 8);
    }
    ensureReexportsAreAvailableForModule(module) {
        const includedReexports = [];
        const map = module.getExportNamesByVariable();
        for (const exportedVariable of map.keys()) {
            const isSynthetic = exportedVariable instanceof SyntheticNamedExportVariable;
            const importedVariable = isSynthetic
                ? exportedVariable.getBaseVariable()
                : exportedVariable;
            if (!(importedVariable instanceof NamespaceVariable && this.outputOptions.preserveModules)) {
                this.checkCircularDependencyImport(importedVariable, module);
                const exportingModule = importedVariable.module;
                if (exportingModule instanceof Module) {
                    const chunk = this.chunkByModule.get(exportingModule);
                    if (chunk && chunk !== this) {
                        chunk.exports.add(importedVariable);
                        includedReexports.push(importedVariable);
                        if (isSynthetic) {
                            this.imports.add(importedVariable);
                        }
                    }
                }
            }
        }
        if (includedReexports.length) {
            this.includedReexportsByModule.set(module, includedReexports);
        }
    }
    finaliseDynamicImports(options, snippets) {
        const stripKnownJsExtensions = options.format === 'amd' && !options.amd.forceJsExtensionForImports;
        for (const [module, code] of this.renderedModuleSources) {
            for (const { node, resolution } of module.dynamicImports) {
                const chunk = this.chunkByModule.get(resolution);
                const facadeChunk = this.facadeChunkByModule.get(resolution);
                if (!resolution || !node.included || chunk === this) {
                    continue;
                }
                const renderedResolution = resolution instanceof Module
                    ? `'${escapeId(getImportPath(this.id, (facadeChunk || chunk).id, stripKnownJsExtensions, true))}'`
                    : resolution instanceof ExternalModule
                        ? `'${escapeId(resolution.renormalizeRenderPath
                            ? getImportPath(this.id, resolution.renderPath, stripKnownJsExtensions, false)
                            : resolution.renderPath)}'`
                        : resolution;
                node.renderFinalResolution(code, renderedResolution, resolution instanceof Module &&
                    !(facadeChunk === null || facadeChunk === void 0 ? void 0 : facadeChunk.strictFacade) &&
                    chunk.exportNamesByVariable.get(resolution.namespace)[0], snippets);
            }
        }
    }
    finaliseImportMetas(format, snippets) {
        for (const [module, code] of this.renderedModuleSources) {
            for (const importMeta of module.importMetas) {
                importMeta.renderFinalMechanism(code, this.id, format, snippets, this.pluginDriver);
            }
        }
    }
    generateVariableName() {
        if (this.manualChunkAlias) {
            return this.manualChunkAlias;
        }
        const moduleForNaming = this.entryModules[0] ||
            this.implicitEntryModules[0] ||
            this.dynamicEntryModules[0] ||
            this.orderedModules[this.orderedModules.length - 1];
        if (moduleForNaming) {
            return getChunkNameFromModule(moduleForNaming);
        }
        return 'chunk';
    }
    getChunkDependencyDeclarations(options, getPropertyAccess) {
        const importSpecifiers = this.getImportSpecifiers(getPropertyAccess);
        const reexportSpecifiers = this.getReexportSpecifiers();
        const dependencyDeclaration = new Map();
        for (const dep of this.dependencies) {
            const imports = importSpecifiers.get(dep) || null;
            const reexports = reexportSpecifiers.get(dep) || null;
            const namedExportsMode = dep instanceof ExternalModule || dep.exportMode !== 'default';
            dependencyDeclaration.set(dep, {
                defaultVariableName: dep.defaultVariableName,
                globalName: (dep instanceof ExternalModule &&
                    (options.format === 'umd' || options.format === 'iife') &&
                    getGlobalName(dep, options.globals, (imports || reexports) !== null, this.inputOptions.onwarn)),
                id: undefined,
                imports,
                isChunk: dep instanceof Chunk,
                name: dep.variableName,
                namedExportsMode,
                namespaceVariableName: dep.namespaceVariableName,
                reexports
            });
        }
        return dependencyDeclaration;
    }
    getChunkExportDeclarations(format, getPropertyAccess) {
        const exports = [];
        for (const exportName of this.getExportNames()) {
            if (exportName[0] === '*')
                continue;
            const variable = this.exportsByName.get(exportName);
            if (!(variable instanceof SyntheticNamedExportVariable)) {
                const module = variable.module;
                if (module && this.chunkByModule.get(module) !== this)
                    continue;
            }
            let expression = null;
            let hoisted = false;
            let local = variable.getName(getPropertyAccess);
            if (variable instanceof LocalVariable) {
                for (const declaration of variable.declarations) {
                    if (declaration.parent instanceof FunctionDeclaration ||
                        (declaration instanceof ExportDefaultDeclaration &&
                            declaration.declaration instanceof FunctionDeclaration)) {
                        hoisted = true;
                        break;
                    }
                }
            }
            else if (variable instanceof SyntheticNamedExportVariable) {
                expression = local;
                if (format === 'es') {
                    local = variable.renderName;
                }
            }
            exports.push({
                exported: exportName,
                expression,
                hoisted,
                local
            });
        }
        return exports;
    }
    getDependenciesToBeDeconflicted(addNonNamespacesAndInteropHelpers, addDependenciesWithoutBindings, interop) {
        const dependencies = new Set();
        const deconflictedDefault = new Set();
        const deconflictedNamespace = new Set();
        for (const variable of [...this.exportNamesByVariable.keys(), ...this.imports]) {
            if (addNonNamespacesAndInteropHelpers || variable.isNamespace) {
                const module = variable.module;
                if (module instanceof ExternalModule) {
                    dependencies.add(module);
                    if (addNonNamespacesAndInteropHelpers) {
                        if (variable.name === 'default') {
                            if (defaultInteropHelpersByInteropType[String(interop(module.id))]) {
                                deconflictedDefault.add(module);
                            }
                        }
                        else if (variable.name === '*') {
                            if (namespaceInteropHelpersByInteropType[String(interop(module.id))]) {
                                deconflictedNamespace.add(module);
                            }
                        }
                    }
                }
                else {
                    const chunk = this.chunkByModule.get(module);
                    if (chunk !== this) {
                        dependencies.add(chunk);
                        if (addNonNamespacesAndInteropHelpers &&
                            chunk.exportMode === 'default' &&
                            variable.isNamespace) {
                            deconflictedNamespace.add(chunk);
                        }
                    }
                }
            }
        }
        if (addDependenciesWithoutBindings) {
            for (const dependency of this.dependencies) {
                dependencies.add(dependency);
            }
        }
        return { deconflictedDefault, deconflictedNamespace, dependencies };
    }
    getFallbackChunkName() {
        if (this.manualChunkAlias) {
            return this.manualChunkAlias;
        }
        if (this.dynamicName) {
            return this.dynamicName;
        }
        if (this.fileName) {
            return getAliasName(this.fileName);
        }
        return getAliasName(this.orderedModules[this.orderedModules.length - 1].id);
    }
    getImportSpecifiers(getPropertyAccess) {
        const { interop } = this.outputOptions;
        const importsByDependency = new Map();
        for (const variable of this.imports) {
            const module = variable.module;
            let dependency;
            let imported;
            if (module instanceof ExternalModule) {
                dependency = module;
                imported = variable.name;
                if (imported !== 'default' && imported !== '*' && interop(module.id) === 'defaultOnly') {
                    return error(errUnexpectedNamedImport(module.id, imported, false));
                }
            }
            else {
                dependency = this.chunkByModule.get(module);
                imported = dependency.getVariableExportName(variable);
            }
            getOrCreate(importsByDependency, dependency, () => []).push({
                imported,
                local: variable.getName(getPropertyAccess)
            });
        }
        return importsByDependency;
    }
    getImportedBindingsPerDependency() {
        const importSpecifiers = {};
        for (const [dependency, declaration] of this.renderedDependencies) {
            const specifiers = new Set();
            if (declaration.imports) {
                for (const { imported } of declaration.imports) {
                    specifiers.add(imported);
                }
            }
            if (declaration.reexports) {
                for (const { imported } of declaration.reexports) {
                    specifiers.add(imported);
                }
            }
            importSpecifiers[dependency.id] = [...specifiers];
        }
        return importSpecifiers;
    }
    getReexportSpecifiers() {
        const { externalLiveBindings, interop } = this.outputOptions;
        const reexportSpecifiers = new Map();
        for (let exportName of this.getExportNames()) {
            let dependency;
            let imported;
            let needsLiveBinding = false;
            if (exportName[0] === '*') {
                const id = exportName.substring(1);
                if (interop(id) === 'defaultOnly') {
                    this.inputOptions.onwarn(errUnexpectedNamespaceReexport(id));
                }
                needsLiveBinding = externalLiveBindings;
                dependency = this.modulesById.get(id);
                imported = exportName = '*';
            }
            else {
                const variable = this.exportsByName.get(exportName);
                if (variable instanceof SyntheticNamedExportVariable)
                    continue;
                const module = variable.module;
                if (module instanceof Module) {
                    dependency = this.chunkByModule.get(module);
                    if (dependency === this)
                        continue;
                    imported = dependency.getVariableExportName(variable);
                    needsLiveBinding = variable.isReassigned;
                }
                else {
                    dependency = module;
                    imported = variable.name;
                    if (imported !== 'default' && imported !== '*' && interop(module.id) === 'defaultOnly') {
                        return error(errUnexpectedNamedImport(module.id, imported, true));
                    }
                    needsLiveBinding =
                        externalLiveBindings &&
                            (imported !== 'default' || isDefaultAProperty(String(interop(module.id)), true));
                }
            }
            getOrCreate(reexportSpecifiers, dependency, () => []).push({
                imported,
                needsLiveBinding,
                reexported: exportName
            });
        }
        return reexportSpecifiers;
    }
    getReferencedFiles() {
        const referencedFiles = [];
        for (const module of this.orderedModules) {
            for (const meta of module.importMetas) {
                const fileName = meta.getReferencedFileName(this.pluginDriver);
                if (fileName) {
                    referencedFiles.push(fileName);
                }
            }
        }
        return referencedFiles;
    }
    inlineChunkDependencies(chunk) {
        for (const dep of chunk.dependencies) {
            if (this.dependencies.has(dep))
                continue;
            this.dependencies.add(dep);
            if (dep instanceof Chunk) {
                this.inlineChunkDependencies(dep);
            }
        }
    }
    prepareModulesForRendering(snippets) {
        var _a;
        const accessedGlobalsByScope = this.accessedGlobalsByScope;
        for (const module of this.orderedModules) {
            for (const { node, resolution } of module.dynamicImports) {
                if (node.included) {
                    if (resolution instanceof Module) {
                        const chunk = this.chunkByModule.get(resolution);
                        if (chunk === this) {
                            node.setInternalResolution(resolution.namespace);
                        }
                        else {
                            node.setExternalResolution(((_a = this.facadeChunkByModule.get(resolution)) === null || _a === void 0 ? void 0 : _a.exportMode) || chunk.exportMode, resolution, this.outputOptions, snippets, this.pluginDriver, accessedGlobalsByScope);
                        }
                    }
                    else {
                        node.setExternalResolution('external', resolution, this.outputOptions, snippets, this.pluginDriver, accessedGlobalsByScope);
                    }
                }
            }
            for (const importMeta of module.importMetas) {
                importMeta.addAccessedGlobals(this.outputOptions.format, accessedGlobalsByScope);
            }
            if (this.includedNamespaces.has(module) && !this.outputOptions.preserveModules) {
                module.namespace.prepare(accessedGlobalsByScope);
            }
        }
    }
    setExternalRenderPaths(options, inputBase) {
        for (const dependency of [...this.dependencies, ...this.dynamicDependencies]) {
            if (dependency instanceof ExternalModule) {
                dependency.setRenderPath(options, inputBase);
            }
        }
    }
    setIdentifierRenderResolutions({ format, interop, namespaceToStringTag }) {
        const syntheticExports = new Set();
        for (const exportName of this.getExportNames()) {
            const exportVariable = this.exportsByName.get(exportName);
            if (format !== 'es' &&
                format !== 'system' &&
                exportVariable.isReassigned &&
                !exportVariable.isId) {
                exportVariable.setRenderNames('exports', exportName);
            }
            else if (exportVariable instanceof SyntheticNamedExportVariable) {
                syntheticExports.add(exportVariable);
            }
            else {
                exportVariable.setRenderNames(null, null);
            }
        }
        for (const module of this.orderedModules) {
            if (module.needsExportShim) {
                this.needsExportsShim = true;
                break;
            }
        }
        const usedNames = new Set(['Object', 'Promise']);
        if (this.needsExportsShim) {
            usedNames.add(MISSING_EXPORT_SHIM_VARIABLE);
        }
        if (namespaceToStringTag) {
            usedNames.add('Symbol');
        }
        switch (format) {
            case 'system':
                usedNames.add('module').add('exports');
                break;
            case 'es':
                break;
            case 'cjs':
                usedNames.add('module').add('require').add('__filename').add('__dirname');
            // fallthrough
            default:
                usedNames.add('exports');
                for (const helper of HELPER_NAMES) {
                    usedNames.add(helper);
                }
        }
        deconflictChunk(this.orderedModules, this.getDependenciesToBeDeconflicted(format !== 'es' && format !== 'system', format === 'amd' || format === 'umd' || format === 'iife', interop), this.imports, usedNames, format, interop, this.outputOptions.preserveModules, this.outputOptions.externalLiveBindings, this.chunkByModule, syntheticExports, this.exportNamesByVariable, this.accessedGlobalsByScope, this.includedNamespaces);
    }
    setUpChunkImportsAndExportsForModule(module) {
        const moduleImports = new Set(module.includedImports);
        // when we are not preserving modules, we need to make all namespace variables available for
        // rendering the namespace object
        if (!this.outputOptions.preserveModules) {
            if (this.includedNamespaces.has(module)) {
                const memberVariables = module.namespace.getMemberVariables();
                for (const variable of Object.values(memberVariables)) {
                    moduleImports.add(variable);
                }
            }
        }
        for (let variable of moduleImports) {
            if (variable instanceof ExportDefaultVariable) {
                variable = variable.getOriginalVariable();
            }
            if (variable instanceof SyntheticNamedExportVariable) {
                variable = variable.getBaseVariable();
            }
            const chunk = this.chunkByModule.get(variable.module);
            if (chunk !== this) {
                this.imports.add(variable);
                if (!(variable instanceof NamespaceVariable && this.outputOptions.preserveModules) &&
                    variable.module instanceof Module) {
                    chunk.exports.add(variable);
                    this.checkCircularDependencyImport(variable, module);
                }
            }
        }
        if (this.includedNamespaces.has(module) ||
            (module.info.isEntry && module.preserveSignature !== false) ||
            module.includedDynamicImporters.some(importer => this.chunkByModule.get(importer) !== this)) {
            this.ensureReexportsAreAvailableForModule(module);
        }
        for (const { node, resolution } of module.dynamicImports) {
            if (node.included &&
                resolution instanceof Module &&
                this.chunkByModule.get(resolution) === this &&
                !this.includedNamespaces.has(resolution)) {
                this.includedNamespaces.add(resolution);
                this.ensureReexportsAreAvailableForModule(resolution);
            }
        }
    }
}
function getChunkNameFromModule(module) {
    var _a, _b, _c, _d;
    return ((_d = (_b = (_a = module.chunkNames.find(({ isUserDefined }) => isUserDefined)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = module.chunkNames[0]) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : getAliasName(module.id));
}
const QUERY_HASH_REGEX = /[?#]/;

const concatSep = (out, next) => (next ? `${out}\n${next}` : out);
const concatDblSep = (out, next) => (next ? `${out}\n\n${next}` : out);
async function createAddons(options, outputPluginDriver) {
    try {
        let [banner, footer, intro, outro] = await Promise.all([
            outputPluginDriver.hookReduceValue('banner', options.banner(), [], concatSep),
            outputPluginDriver.hookReduceValue('footer', options.footer(), [], concatSep),
            outputPluginDriver.hookReduceValue('intro', options.intro(), [], concatDblSep),
            outputPluginDriver.hookReduceValue('outro', options.outro(), [], concatDblSep)
        ]);
        if (intro)
            intro += '\n\n';
        if (outro)
            outro = `\n\n${outro}`;
        if (banner.length)
            banner += '\n';
        if (footer.length)
            footer = '\n' + footer;
        return { banner, footer, intro, outro };
    }
    catch (err) {
        return error({
            code: 'ADDON_ERROR',
            message: `Could not retrieve ${err.hook}. Check configuration of plugin ${err.plugin}.
\tError Message: ${err.message}`
        });
    }
}

function getChunkAssignments(entryModules, manualChunkAliasByEntry) {
    const chunkDefinitions = [];
    const modulesInManualChunks = new Set(manualChunkAliasByEntry.keys());
    const manualChunkModulesByAlias = Object.create(null);
    for (const [entry, alias] of manualChunkAliasByEntry) {
        const chunkModules = (manualChunkModulesByAlias[alias] =
            manualChunkModulesByAlias[alias] || []);
        addStaticDependenciesToManualChunk(entry, chunkModules, modulesInManualChunks);
    }
    for (const [alias, modules] of Object.entries(manualChunkModulesByAlias)) {
        chunkDefinitions.push({ alias, modules });
    }
    const assignedEntryPointsByModule = new Map();
    const { dependentEntryPointsByModule, dynamicEntryModules } = analyzeModuleGraph(entryModules);
    const dynamicallyDependentEntryPointsByDynamicEntry = getDynamicDependentEntryPoints(dependentEntryPointsByModule, dynamicEntryModules);
    const staticEntries = new Set(entryModules);
    function assignEntryToStaticDependencies(entry, dynamicDependentEntryPoints) {
        const modulesToHandle = new Set([entry]);
        for (const module of modulesToHandle) {
            const assignedEntryPoints = getOrCreate(assignedEntryPointsByModule, module, () => new Set());
            if (dynamicDependentEntryPoints &&
                areEntryPointsContainedOrDynamicallyDependent(dynamicDependentEntryPoints, dependentEntryPointsByModule.get(module))) {
                continue;
            }
            else {
                assignedEntryPoints.add(entry);
            }
            for (const dependency of module.getDependenciesToBeIncluded()) {
                if (!(dependency instanceof ExternalModule || modulesInManualChunks.has(dependency))) {
                    modulesToHandle.add(dependency);
                }
            }
        }
    }
    function areEntryPointsContainedOrDynamicallyDependent(entryPoints, containedIn) {
        const entriesToCheck = new Set(entryPoints);
        for (const entry of entriesToCheck) {
            if (!containedIn.has(entry)) {
                if (staticEntries.has(entry))
                    return false;
                const dynamicallyDependentEntryPoints = dynamicallyDependentEntryPointsByDynamicEntry.get(entry);
                for (const dependentEntry of dynamicallyDependentEntryPoints) {
                    entriesToCheck.add(dependentEntry);
                }
            }
        }
        return true;
    }
    for (const entry of entryModules) {
        if (!modulesInManualChunks.has(entry)) {
            assignEntryToStaticDependencies(entry, null);
        }
    }
    for (const entry of dynamicEntryModules) {
        if (!modulesInManualChunks.has(entry)) {
            assignEntryToStaticDependencies(entry, dynamicallyDependentEntryPointsByDynamicEntry.get(entry));
        }
    }
    chunkDefinitions.push(...createChunks([...entryModules, ...dynamicEntryModules], assignedEntryPointsByModule));
    return chunkDefinitions;
}
function addStaticDependenciesToManualChunk(entry, manualChunkModules, modulesInManualChunks) {
    const modulesToHandle = new Set([entry]);
    for (const module of modulesToHandle) {
        modulesInManualChunks.add(module);
        manualChunkModules.push(module);
        for (const dependency of module.dependencies) {
            if (!(dependency instanceof ExternalModule || modulesInManualChunks.has(dependency))) {
                modulesToHandle.add(dependency);
            }
        }
    }
}
function analyzeModuleGraph(entryModules) {
    const dynamicEntryModules = new Set();
    const dependentEntryPointsByModule = new Map();
    const entriesToHandle = new Set(entryModules);
    for (const currentEntry of entriesToHandle) {
        const modulesToHandle = new Set([currentEntry]);
        for (const module of modulesToHandle) {
            getOrCreate(dependentEntryPointsByModule, module, () => new Set()).add(currentEntry);
            for (const dependency of module.getDependenciesToBeIncluded()) {
                if (!(dependency instanceof ExternalModule)) {
                    modulesToHandle.add(dependency);
                }
            }
            for (const { resolution } of module.dynamicImports) {
                if (resolution instanceof Module && resolution.includedDynamicImporters.length > 0) {
                    dynamicEntryModules.add(resolution);
                    entriesToHandle.add(resolution);
                }
            }
            for (const dependency of module.implicitlyLoadedBefore) {
                dynamicEntryModules.add(dependency);
                entriesToHandle.add(dependency);
            }
        }
    }
    return { dependentEntryPointsByModule, dynamicEntryModules };
}
function getDynamicDependentEntryPoints(dependentEntryPointsByModule, dynamicEntryModules) {
    const dynamicallyDependentEntryPointsByDynamicEntry = new Map();
    for (const dynamicEntry of dynamicEntryModules) {
        const dynamicDependentEntryPoints = getOrCreate(dynamicallyDependentEntryPointsByDynamicEntry, dynamicEntry, () => new Set());
        for (const importer of [
            ...dynamicEntry.includedDynamicImporters,
            ...dynamicEntry.implicitlyLoadedAfter
        ]) {
            for (const entryPoint of dependentEntryPointsByModule.get(importer)) {
                dynamicDependentEntryPoints.add(entryPoint);
            }
        }
    }
    return dynamicallyDependentEntryPointsByDynamicEntry;
}
function createChunks(allEntryPoints, assignedEntryPointsByModule) {
    const chunkModules = Object.create(null);
    for (const [module, assignedEntryPoints] of assignedEntryPointsByModule) {
        let chunkSignature = '';
        for (const entry of allEntryPoints) {
            chunkSignature += assignedEntryPoints.has(entry) ? 'X' : '_';
        }
        const chunk = chunkModules[chunkSignature];
        if (chunk) {
            chunk.push(module);
        }
        else {
            chunkModules[chunkSignature] = [module];
        }
    }
    return Object.values(chunkModules).map(modules => ({
        alias: null,
        modules
    }));
}

// ported from https://github.com/substack/node-commondir
function commondir(files) {
    if (files.length === 0)
        return '/';
    if (files.length === 1)
        return require$$0.dirname(files[0]);
    const commonSegments = files.slice(1).reduce((commonSegments, file) => {
        const pathSegements = file.split(/\/+|\\+/);
        let i;
        for (i = 0; commonSegments[i] === pathSegements[i] &&
            i < Math.min(commonSegments.length, pathSegements.length); i++)
            ;
        return commonSegments.slice(0, i);
    }, files[0].split(/\/+|\\+/));
    // Windows correctly handles paths with forward-slashes
    return commonSegments.length > 1 ? commonSegments.join('/') : '/';
}

const compareExecIndex = (unitA, unitB) => unitA.execIndex > unitB.execIndex ? 1 : -1;
function sortByExecutionOrder(units) {
    units.sort(compareExecIndex);
}
function analyseModuleExecution(entryModules) {
    let nextExecIndex = 0;
    const cyclePaths = [];
    const analysedModules = new Set();
    const dynamicImports = new Set();
    const parents = new Map();
    const orderedModules = [];
    const analyseModule = (module) => {
        if (module instanceof Module) {
            for (const dependency of module.dependencies) {
                if (parents.has(dependency)) {
                    if (!analysedModules.has(dependency)) {
                        cyclePaths.push(getCyclePath(dependency, module, parents));
                    }
                    continue;
                }
                parents.set(dependency, module);
                analyseModule(dependency);
            }
            for (const dependency of module.implicitlyLoadedBefore) {
                dynamicImports.add(dependency);
            }
            for (const { resolution } of module.dynamicImports) {
                if (resolution instanceof Module) {
                    dynamicImports.add(resolution);
                }
            }
            orderedModules.push(module);
        }
        module.execIndex = nextExecIndex++;
        analysedModules.add(module);
    };
    for (const curEntry of entryModules) {
        if (!parents.has(curEntry)) {
            parents.set(curEntry, null);
            analyseModule(curEntry);
        }
    }
    for (const curEntry of dynamicImports) {
        if (!parents.has(curEntry)) {
            parents.set(curEntry, null);
            analyseModule(curEntry);
        }
    }
    return { cyclePaths, orderedModules };
}
function getCyclePath(module, parent, parents) {
    const cycleSymbol = Symbol(module.id);
    const path = [relativeId(module.id)];
    let nextModule = parent;
    module.cycles.add(cycleSymbol);
    while (nextModule !== module) {
        nextModule.cycles.add(cycleSymbol);
        path.push(relativeId(nextModule.id));
        nextModule = parents.get(nextModule);
    }
    path.push(path[0]);
    path.reverse();
    return path;
}

function getGenerateCodeSnippets({ compact, generatedCode: { arrowFunctions, constBindings, objectShorthand, reservedNamesAsProps } }) {
    const { _, n, s } = compact ? { _: '', n: '', s: '' } : { _: ' ', n: '\n', s: ';' };
    const cnst = constBindings ? 'const' : 'var';
    const getNonArrowFunctionIntro = (params, { isAsync, name }) => `${isAsync ? `async ` : ''}function${name ? ` ${name}` : ''}${_}(${params.join(`,${_}`)})${_}`;
    const getFunctionIntro = arrowFunctions
        ? (params, { isAsync, name }) => {
            const singleParam = params.length === 1;
            const asyncString = isAsync ? `async${singleParam ? ' ' : _}` : '';
            return `${name ? `${cnst} ${name}${_}=${_}` : ''}${asyncString}${singleParam ? params[0] : `(${params.join(`,${_}`)})`}${_}=>${_}`;
        }
        : getNonArrowFunctionIntro;
    const getDirectReturnFunction = (params, { functionReturn, lineBreakIndent, name }) => [
        `${getFunctionIntro(params, {
            isAsync: false,
            name
        })}${arrowFunctions
            ? lineBreakIndent
                ? `${n}${lineBreakIndent.base}${lineBreakIndent.t}`
                : ''
            : `{${lineBreakIndent ? `${n}${lineBreakIndent.base}${lineBreakIndent.t}` : _}${functionReturn ? 'return ' : ''}`}`,
        arrowFunctions
            ? `${name ? ';' : ''}${lineBreakIndent ? `${n}${lineBreakIndent.base}` : ''}`
            : `${s}${lineBreakIndent ? `${n}${lineBreakIndent.base}` : _}}`
    ];
    const isValidPropName = reservedNamesAsProps
        ? (name) => validPropName.test(name)
        : (name) => !RESERVED_NAMES$1.has(name) && validPropName.test(name);
    return {
        _,
        cnst,
        getDirectReturnFunction,
        getDirectReturnIifeLeft: (params, returned, { needsArrowReturnParens, needsWrappedFunction }) => {
            const [left, right] = getDirectReturnFunction(params, {
                functionReturn: true,
                lineBreakIndent: null,
                name: null
            });
            return `${wrapIfNeeded(`${left}${wrapIfNeeded(returned, arrowFunctions && needsArrowReturnParens)}${right}`, arrowFunctions || needsWrappedFunction)}(`;
        },
        getFunctionIntro,
        getNonArrowFunctionIntro,
        getObject(fields, { lineBreakIndent }) {
            const prefix = lineBreakIndent ? `${n}${lineBreakIndent.base}${lineBreakIndent.t}` : _;
            return `{${fields
                .map(([key, value]) => {
                if (key === null)
                    return `${prefix}${value}`;
                const needsQuotes = !isValidPropName(key);
                return key === value && objectShorthand && !needsQuotes
                    ? prefix + key
                    : `${prefix}${needsQuotes ? `'${key}'` : key}:${_}${value}`;
            })
                .join(`,`)}${fields.length === 0 ? '' : lineBreakIndent ? `${n}${lineBreakIndent.base}` : _}}`;
        },
        getPropertyAccess: (name) => isValidPropName(name) ? `.${name}` : `[${JSON.stringify(name)}]`,
        n,
        s
    };
}
const wrapIfNeeded = (code, needsParens) => needsParens ? `(${code})` : code;
const validPropName = /^(?!\d)[\w$]+$/;

class Bundle {
    constructor(outputOptions, unsetOptions, inputOptions, pluginDriver, graph) {
        this.outputOptions = outputOptions;
        this.unsetOptions = unsetOptions;
        this.inputOptions = inputOptions;
        this.pluginDriver = pluginDriver;
        this.graph = graph;
        this.facadeChunkByModule = new Map();
        this.includedNamespaces = new Set();
    }
    async generate(isWrite) {
        timeStart('GENERATE', 1);
        const outputBundleBase = Object.create(null);
        const outputBundle = getOutputBundle(outputBundleBase);
        this.pluginDriver.setOutputBundle(outputBundle, this.outputOptions, this.facadeChunkByModule);
        try {
            await this.pluginDriver.hookParallel('renderStart', [this.outputOptions, this.inputOptions]);
            timeStart('generate chunks', 2);
            const chunks = await this.generateChunks();
            if (chunks.length > 1) {
                validateOptionsForMultiChunkOutput(this.outputOptions, this.inputOptions.onwarn);
            }
            const inputBase = commondir(getAbsoluteEntryModulePaths(chunks));
            timeEnd('generate chunks', 2);
            timeStart('render modules', 2);
            // We need to create addons before prerender because at the moment, there
            // can be no async code between prerender and render due to internal state
            const addons = await createAddons(this.outputOptions, this.pluginDriver);
            const snippets = getGenerateCodeSnippets(this.outputOptions);
            this.prerenderChunks(chunks, inputBase, snippets);
            timeEnd('render modules', 2);
            await this.addFinalizedChunksToBundle(chunks, inputBase, addons, outputBundle, snippets);
        }
        catch (err) {
            await this.pluginDriver.hookParallel('renderError', [err]);
            throw err;
        }
        await this.pluginDriver.hookSeq('generateBundle', [
            this.outputOptions,
            outputBundle,
            isWrite
        ]);
        this.finaliseAssets(outputBundle);
        timeEnd('GENERATE', 1);
        return outputBundleBase;
    }
    async addFinalizedChunksToBundle(chunks, inputBase, addons, bundle, snippets) {
        this.assignChunkIds(chunks, inputBase, addons, bundle);
        for (const chunk of chunks) {
            bundle[chunk.id] = chunk.getChunkInfoWithFileNames();
        }
        await Promise.all(chunks.map(async (chunk) => {
            const outputChunk = bundle[chunk.id];
            Object.assign(outputChunk, await chunk.render(this.outputOptions, addons, outputChunk, snippets));
        }));
    }
    async addManualChunks(manualChunks) {
        const manualChunkAliasByEntry = new Map();
        const chunkEntries = await Promise.all(Object.entries(manualChunks).map(async ([alias, files]) => ({
            alias,
            entries: await this.graph.moduleLoader.addAdditionalModules(files)
        })));
        for (const { alias, entries } of chunkEntries) {
            for (const entry of entries) {
                addModuleToManualChunk(alias, entry, manualChunkAliasByEntry);
            }
        }
        return manualChunkAliasByEntry;
    }
    assignChunkIds(chunks, inputBase, addons, bundle) {
        const entryChunks = [];
        const otherChunks = [];
        for (const chunk of chunks) {
            (chunk.facadeModule && chunk.facadeModule.isUserDefinedEntryPoint
                ? entryChunks
                : otherChunks).push(chunk);
        }
        // make sure entry chunk names take precedence with regard to deconflicting
        const chunksForNaming = entryChunks.concat(otherChunks);
        for (const chunk of chunksForNaming) {
            if (this.outputOptions.file) {
                chunk.id = require$$0.basename(this.outputOptions.file);
            }
            else if (this.outputOptions.preserveModules) {
                chunk.id = chunk.generateIdPreserveModules(inputBase, this.outputOptions, bundle, this.unsetOptions);
            }
            else {
                chunk.id = chunk.generateId(addons, this.outputOptions, bundle, true);
            }
            bundle[chunk.id] = FILE_PLACEHOLDER;
        }
    }
    assignManualChunks(getManualChunk) {
        const manualChunkAliasesWithEntry = [];
        const manualChunksApi = {
            getModuleIds: () => this.graph.modulesById.keys(),
            getModuleInfo: this.graph.getModuleInfo
        };
        for (const module of this.graph.modulesById.values()) {
            if (module instanceof Module) {
                const manualChunkAlias = getManualChunk(module.id, manualChunksApi);
                if (typeof manualChunkAlias === 'string') {
                    manualChunkAliasesWithEntry.push([manualChunkAlias, module]);
                }
            }
        }
        manualChunkAliasesWithEntry.sort(([aliasA], [aliasB]) => aliasA > aliasB ? 1 : aliasA < aliasB ? -1 : 0);
        const manualChunkAliasByEntry = new Map();
        for (const [alias, module] of manualChunkAliasesWithEntry) {
            addModuleToManualChunk(alias, module, manualChunkAliasByEntry);
        }
        return manualChunkAliasByEntry;
    }
    finaliseAssets(outputBundle) {
        for (const file of Object.values(outputBundle)) {
            if (!file.type) {
                warnDeprecation('A plugin is directly adding properties to the bundle object in the "generateBundle" hook. This is deprecated and will be removed in a future Rollup version, please use "this.emitFile" instead.', true, this.inputOptions);
                file.type = 'asset';
            }
            if (this.outputOptions.validate && 'code' in file) {
                try {
                    this.graph.contextParse(file.code, {
                        allowHashBang: true,
                        ecmaVersion: 'latest'
                    });
                }
                catch (err) {
                    this.inputOptions.onwarn(errChunkInvalid(file, err));
                }
            }
        }
        this.pluginDriver.finaliseAssets();
    }
    async generateChunks() {
        const { manualChunks } = this.outputOptions;
        const manualChunkAliasByEntry = typeof manualChunks === 'object'
            ? await this.addManualChunks(manualChunks)
            : this.assignManualChunks(manualChunks);
        const chunks = [];
        const chunkByModule = new Map();
        for (const { alias, modules } of this.outputOptions.inlineDynamicImports
            ? [{ alias: null, modules: getIncludedModules(this.graph.modulesById) }]
            : this.outputOptions.preserveModules
                ? getIncludedModules(this.graph.modulesById).map(module => ({
                    alias: null,
                    modules: [module]
                }))
                : getChunkAssignments(this.graph.entryModules, manualChunkAliasByEntry)) {
            sortByExecutionOrder(modules);
            const chunk = new Chunk(modules, this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.graph.modulesById, chunkByModule, this.facadeChunkByModule, this.includedNamespaces, alias);
            chunks.push(chunk);
            for (const module of modules) {
                chunkByModule.set(module, chunk);
            }
        }
        for (const chunk of chunks) {
            chunk.link();
        }
        const facades = [];
        for (const chunk of chunks) {
            facades.push(...chunk.generateFacades());
        }
        return [...chunks, ...facades];
    }
    prerenderChunks(chunks, inputBase, snippets) {
        for (const chunk of chunks) {
            chunk.generateExports();
        }
        for (const chunk of chunks) {
            chunk.preRender(this.outputOptions, inputBase, snippets);
        }
    }
}
function getAbsoluteEntryModulePaths(chunks) {
    const absoluteEntryModulePaths = [];
    for (const chunk of chunks) {
        for (const entryModule of chunk.entryModules) {
            if (isAbsolute(entryModule.id)) {
                absoluteEntryModulePaths.push(entryModule.id);
            }
        }
    }
    return absoluteEntryModulePaths;
}
function validateOptionsForMultiChunkOutput(outputOptions, onWarn) {
    if (outputOptions.format === 'umd' || outputOptions.format === 'iife')
        return error(errInvalidOption('output.format', 'outputformat', 'UMD and IIFE output formats are not supported for code-splitting builds', outputOptions.format));
    if (typeof outputOptions.file === 'string')
        return error(errInvalidOption('output.file', 'outputdir', 'when building multiple chunks, the "output.dir" option must be used, not "output.file". To inline dynamic imports, set the "inlineDynamicImports" option'));
    if (outputOptions.sourcemapFile)
        return error(errInvalidOption('output.sourcemapFile', 'outputsourcemapfile', '"output.sourcemapFile" is only supported for single-file builds'));
    if (!outputOptions.amd.autoId && outputOptions.amd.id)
        onWarn(errInvalidOption('output.amd.id', 'outputamd', 'this option is only properly supported for single-file builds. Use "output.amd.autoId" and "output.amd.basePath" instead'));
}
function getIncludedModules(modulesById) {
    return [...modulesById.values()].filter((module) => module instanceof Module &&
        (module.isIncluded() || module.info.isEntry || module.includedDynamicImporters.length > 0));
}
function addModuleToManualChunk(alias, module, manualChunkAliasByEntry) {
    const existingAlias = manualChunkAliasByEntry.get(module);
    if (typeof existingAlias === 'string' && existingAlias !== alias) {
        return error(errCannotAssignModuleToChunk(module.id, alias, existingAlias));
    }
    manualChunkAliasByEntry.set(module, alias);
}

// This file was generated. Do not modify manually!
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 357, 0, 62, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];

// This file was generated. Do not modify manually!
var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1070, 4050, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 46, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 482, 44, 11, 6, 17, 0, 322, 29, 19, 43, 1269, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4152, 8, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938];

// This file was generated. Do not modify manually!
var nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";

// This file was generated. Do not modify manually!
var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";

// These are a run-length and offset encoded representation of the

// Reserved word lists for various dialects of the language

var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};

// And the keywords

var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

var keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};

var keywordRelationalOperator = /^in(stanceof)?$/;

// ## Character categories

var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

// This has a complexity linear to the value of the code. The
// assumption is that looking up astral identifier characters is
// rare.
function isInAstralSet(code, set) {
  var pos = 0x10000;
  for (var i = 0; i < set.length; i += 2) {
    pos += set[i];
    if (pos > code) { return false }
    pos += set[i + 1];
    if (pos >= code) { return true }
  }
}

// Test whether a given character code starts an identifier.

function isIdentifierStart(code, astral) {
  if (code < 65) { return code === 36 }
  if (code < 91) { return true }
  if (code < 97) { return code === 95 }
  if (code < 123) { return true }
  if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code)) }
  if (astral === false) { return false }
  return isInAstralSet(code, astralIdentifierStartCodes)
}

// Test whether a given character is part of an identifier.

function isIdentifierChar(code, astral) {
  if (code < 48) { return code === 36 }
  if (code < 58) { return true }
  if (code < 65) { return false }
  if (code < 91) { return true }
  if (code < 97) { return code === 95 }
  if (code < 123) { return true }
  if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code)) }
  if (astral === false) { return false }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)
}

// ## Token types

// The assignment of fine-grained, information-carrying type objects
// allows the tokenizer to store the information it has about a
// token in a way that is very cheap for the parser to look up.

// All token type variables start with an underscore, to make them
// easy to recognize.

// The `beforeExpr` property is used to disambiguate between regular
// expressions and divisions. It is set on all token types that can
// be followed by an expression (thus, a slash after them would be a
// regular expression).
//
// The `startsExpr` property is used to check if the token ends a
// `yield` expression. It is set on all token types that either can
// directly start an expression (like a quotation mark) or can
// continue an expression (like the body of a string).
//
// `isLoop` marks a keyword as starting a loop, which is important
// to know when parsing a label, in order to allow or disallow
// continue jumps to that label.

var TokenType = function TokenType(label, conf) {
  if ( conf === void 0 ) conf = {};

  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
};

function binop(name, prec) {
  return new TokenType(name, {beforeExpr: true, binop: prec})
}
var beforeExpr = {beforeExpr: true}, startsExpr = {startsExpr: true};

// Map keyword names to token types.

var keywords = {};

// Succinct definitions of keyword token types
function kw(name, options) {
  if ( options === void 0 ) options = {};

  options.keyword = name;
  return keywords[name] = new TokenType(name, options)
}

var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),

  // Punctuation token types.
  bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),

  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.

  eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
  assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
  incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
  prefix: new TokenType("!/~", {beforeExpr: true, prefix: true, startsExpr: true}),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", {beforeExpr: true}),
  coalesce: binop("??", 1),

  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", {isLoop: true, beforeExpr: true}),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", {isLoop: true}),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", {isLoop: true}),
  _with: kw("with"),
  _new: kw("new", {beforeExpr: true, startsExpr: true}),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", {beforeExpr: true, binop: 7}),
  _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
  _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
  _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
  _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
};

// Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.

var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");

function isNewLine(code) {
  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029
}

function nextLineBreak(code, from, end) {
  if ( end === void 0 ) end = code.length;

  for (var i = from; i < end; i++) {
    var next = code.charCodeAt(i);
    if (isNewLine(next))
      { return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10 ? i + 2 : i + 1 }
  }
  return -1
}

var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;

var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;

var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString = ref.toString;

var hasOwn = Object.hasOwn || (function (obj, propName) { return (
  hasOwnProperty.call(obj, propName)
); });

var isArray = Array.isArray || (function (obj) { return (
  toString.call(obj) === "[object Array]"
); });

function wordsRegexp(words) {
  return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$")
}

function codePointToString(code) {
  // UTF-16 Decoding
  if (code <= 0xFFFF) { return String.fromCharCode(code) }
  code -= 0x10000;
  return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
}

var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;

// These are used when `options.locations` is on, for the
// `startLoc` and `endLoc` properties.

var Position = function Position(line, col) {
  this.line = line;
  this.column = col;
};

Position.prototype.offset = function offset (n) {
  return new Position(this.line, this.column + n)
};

var SourceLocation = function SourceLocation(p, start, end) {
  this.start = start;
  this.end = end;
  if (p.sourceFile !== null) { this.source = p.sourceFile; }
};

// The `getLineInfo` function is mostly useful when the
// `locations` option is off (for performance reasons) and you
// want to find the line/column position for a given character
// offset. `input` should be the code string that the offset refers
// into.

function getLineInfo(input, offset) {
  for (var line = 1, cur = 0;;) {
    var nextBreak = nextLineBreak(input, cur, offset);
    if (nextBreak < 0) { return new Position(line, offset - cur) }
    ++line;
    cur = nextBreak;
  }
}

// A second argument must be given to configure the parser process.
// These options are recognized (only `ecmaVersion` is required):

var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), or `"latest"` (the
  // latest version the library supports). This influences support
  // for strict mode, the set of reserved words, and support for
  // new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called
  // when a semicolon is automatically inserted. It will be passed
  // the position of the comma as an offset, and if `locations` is
  // enabled, it is given the location as a `{line, column}` object
  // as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: false,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: false,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file
  // is allowed and treated as a line comment.
  allowHashBang: false,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: false,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: false,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: false
};

// Interpret and default an options object

var warnedAboutEcmaVersion = false;

function getOptions(opts) {
  var options = {};

  for (var opt in defaultOptions)
    { options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt]; }

  if (options.ecmaVersion === "latest") {
    options.ecmaVersion = 1e8;
  } else if (options.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options.ecmaVersion = 11;
  } else if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }

  if (options.allowReserved == null)
    { options.allowReserved = options.ecmaVersion < 5; }

  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function (token) { return tokens.push(token); };
  }
  if (isArray(options.onComment))
    { options.onComment = pushComment(options, options.onComment); }

  return options
}

function pushComment(options, array) {
  return function(block, text, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text,
      start: start,
      end: end
    };
    if (options.locations)
      { comment.loc = new SourceLocation(this, startLoc, endLoc); }
    if (options.ranges)
      { comment.range = [start, end]; }
    array.push(comment);
  }
}

// Each scope gets a bitset that may contain these flags
var
    SCOPE_TOP = 1,
    SCOPE_FUNCTION = 2,
    SCOPE_ASYNC = 4,
    SCOPE_GENERATOR = 8,
    SCOPE_ARROW = 16,
    SCOPE_SIMPLE_CATCH = 32,
    SCOPE_SUPER = 64,
    SCOPE_DIRECT_SUPER = 128,
    SCOPE_CLASS_STATIC_BLOCK = 256,
    SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;

function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0)
}

// Used in checkLVal* and declareName to determine the type of a binding
var
    BIND_NONE = 0, // Not a binding
    BIND_VAR = 1, // Var-style binding
    BIND_LEXICAL = 2, // Let- or const-style binding
    BIND_FUNCTION = 3, // Function declaration
    BIND_SIMPLE_CATCH = 4, // Simple (identifier pattern) catch binding
    BIND_OUTSIDE = 5; // Special case for function names as bound inside the function

var Parser = function Parser(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
  var reserved = "";
  if (options.allowReserved !== true) {
    reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
    if (options.sourceType === "module") { reserved += " await"; }
  }
  this.reservedWords = wordsRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);

  // Used to signal to callers of `readWord1` whether the word
  // contained any escape sequences. This is needed because words with
  // escape sequences must not be interpreted as keywords.
  this.containsEsc = false;

  // Set up token state

  // The current position of the tokenizer in the input.
  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }

  // Properties of the current token:
  // Its type
  this.type = types$1.eof;
  // For tokens that include more information than their type, the value
  this.value = null;
  // Its start and end offset
  this.start = this.end = this.pos;
  // And, if locations are used, the {line, column} object
  // corresponding to those offsets
  this.startLoc = this.endLoc = this.curPosition();

  // Position information for the previous token
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;

  // The context stack is used to superficially track syntactic
  // context to predict whether a regular expression is allowed in a
  // given position.
  this.context = this.initialContext();
  this.exprAllowed = true;

  // Figure out if it's a module code.
  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);

  // Used to signify the start of a potential arrow function
  this.potentialArrowAt = -1;
  this.potentialArrowInForAwait = false;

  // Positions to delayed-check that yield/await does not exist in default parameters.
  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  // Labels in scope.
  this.labels = [];
  // Thus-far undefined exports.
  this.undefinedExports = Object.create(null);

  // If enabled, skip leading hashbang line.
  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!")
    { this.skipLineComment(2); }

  // Scope tracking for duplicate variable names (see scope.js)
  this.scopeStack = [];
  this.enterScope(SCOPE_TOP);

  // For RegExp validation
  this.regexpState = null;

  // The stack of private names.
  // Each element has two properties: 'declared' and 'used'.
  // When it exited from the outermost class definition, all used private names must be declared.
  this.privateNameStack = [];
};

var prototypeAccessors = { inFunction: { configurable: true },inGenerator: { configurable: true },inAsync: { configurable: true },canAwait: { configurable: true },allowSuper: { configurable: true },allowDirectSuper: { configurable: true },treatFunctionsAsVar: { configurable: true },allowNewDotTarget: { configurable: true },inClassStaticBlock: { configurable: true } };

Parser.prototype.parse = function parse () {
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node)
};

prototypeAccessors.inFunction.get = function () { return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0 };

prototypeAccessors.inGenerator.get = function () { return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit };

prototypeAccessors.inAsync.get = function () { return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit };

prototypeAccessors.canAwait.get = function () {
  for (var i = this.scopeStack.length - 1; i >= 0; i--) {
    var scope = this.scopeStack[i];
    if (scope.inClassFieldInit || scope.flags & SCOPE_CLASS_STATIC_BLOCK) { return false }
    if (scope.flags & SCOPE_FUNCTION) { return (scope.flags & SCOPE_ASYNC) > 0 }
  }
  return (this.inModule && this.options.ecmaVersion >= 13) || this.options.allowAwaitOutsideFunction
};

prototypeAccessors.allowSuper.get = function () {
  var ref = this.currentThisScope();
    var flags = ref.flags;
    var inClassFieldInit = ref.inClassFieldInit;
  return (flags & SCOPE_SUPER) > 0 || inClassFieldInit || this.options.allowSuperOutsideMethod
};

prototypeAccessors.allowDirectSuper.get = function () { return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0 };

prototypeAccessors.treatFunctionsAsVar.get = function () { return this.treatFunctionsAsVarInScope(this.currentScope()) };

prototypeAccessors.allowNewDotTarget.get = function () {
  var ref = this.currentThisScope();
    var flags = ref.flags;
    var inClassFieldInit = ref.inClassFieldInit;
  return (flags & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || inClassFieldInit
};

prototypeAccessors.inClassStaticBlock.get = function () {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0
};

Parser.extend = function extend () {
    var plugins = [], len = arguments.length;
    while ( len-- ) plugins[ len ] = arguments[ len ];

  var cls = this;
  for (var i = 0; i < plugins.length; i++) { cls = plugins[i](cls); }
  return cls
};

Parser.parse = function parse (input, options) {
  return new this(options, input).parse()
};

Parser.parseExpressionAt = function parseExpressionAt (input, pos, options) {
  var parser = new this(options, input, pos);
  parser.nextToken();
  return parser.parseExpression()
};

Parser.tokenizer = function tokenizer (input, options) {
  return new this(options, input)
};

Object.defineProperties( Parser.prototype, prototypeAccessors );

var pp$9 = Parser.prototype;

// ## Parser utilities

var literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
pp$9.strictDirective = function(start) {
  if (this.options.ecmaVersion < 5) { return false }
  for (;;) {
    // Try to find string literal.
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start));
    if (!match) { return false }
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
      var next = this.input.charAt(end);
      return next === ";" || next === "}" ||
        (lineBreak.test(spaceAfter[0]) &&
         !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "="))
    }
    start += match[0].length;

    // Skip semicolon, if any.
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    if (this.input[start] === ";")
      { start++; }
  }
};

// Predicate that tests whether the next token is of the given
// type, and if yes, consumes it as a side effect.

pp$9.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true
  } else {
    return false
  }
};

// Tests whether parsed token is a contextual keyword.

pp$9.isContextual = function(name) {
  return this.type === types$1.name && this.value === name && !this.containsEsc
};

// Consumes contextual keyword if possible.

pp$9.eatContextual = function(name) {
  if (!this.isContextual(name)) { return false }
  this.next();
  return true
};

// Asserts that following token is given contextual keyword.

pp$9.expectContextual = function(name) {
  if (!this.eatContextual(name)) { this.unexpected(); }
};

// Test whether a semicolon can be inserted at the current position.

pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof ||
    this.type === types$1.braceR ||
    lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
};

pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon)
      { this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc); }
    return true
  }
};

// Consume a semicolon, or, failing that, see if we are allowed to
// pretend that there is a semicolon at this position.

pp$9.semicolon = function() {
  if (!this.eat(types$1.semi) && !this.insertSemicolon()) { this.unexpected(); }
};

pp$9.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    if (this.options.onTrailingComma)
      { this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc); }
    if (!notNext)
      { this.next(); }
    return true
  }
};

// Expect a token of a given type. If found, consume it, otherwise,
// raise an unexpected token error.

pp$9.expect = function(type) {
  this.eat(type) || this.unexpected();
};

// Raise an unexpected token error.

pp$9.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};

var DestructuringErrors = function DestructuringErrors() {
  this.shorthandAssign =
  this.trailingComma =
  this.parenthesizedAssign =
  this.parenthesizedBind =
  this.doubleProto =
    -1;
};

pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) { return }
  if (refDestructuringErrors.trailingComma > -1)
    { this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element"); }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) { this.raiseRecoverable(parens, "Parenthesized pattern"); }
};

pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) { return false }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) { return shorthandAssign >= 0 || doubleProto >= 0 }
  if (shorthandAssign >= 0)
    { this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns"); }
  if (doubleProto >= 0)
    { this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property"); }
};

pp$9.checkYieldAwaitInDefaultParams = function() {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos))
    { this.raise(this.yieldPos, "Yield expression cannot be a default value"); }
  if (this.awaitPos)
    { this.raise(this.awaitPos, "Await expression cannot be a default value"); }
};

pp$9.isSimpleAssignTarget = function(expr) {
  if (expr.type === "ParenthesizedExpression")
    { return this.isSimpleAssignTarget(expr.expression) }
  return expr.type === "Identifier" || expr.type === "MemberExpression"
};

var pp$8 = Parser.prototype;

// ### Statement parsing

// Parse a program. Initializes the parser, reads any number of
// statements, and wraps them in a Program node.  Optionally takes a
// `program` argument.  If present, the statements will be appended
// to its body instead of creating a new node.

pp$8.parseTopLevel = function(node) {
  var exports = Object.create(null);
  if (!node.body) { node.body = []; }
  while (this.type !== types$1.eof) {
    var stmt = this.parseStatement(null, true, exports);
    node.body.push(stmt);
  }
  if (this.inModule)
    { for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1)
      {
        var name = list[i];

        this.raiseRecoverable(this.undefinedExports[name].start, ("Export '" + name + "' is not defined"));
      } }
  this.adaptDirectivePrologue(node.body);
  this.next();
  node.sourceType = this.options.sourceType;
  return this.finishNode(node, "Program")
};

var loopLabel = {kind: "loop"}, switchLabel = {kind: "switch"};

pp$8.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) { return false }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
  // For ambiguous cases, determine if a LexicalDeclaration (or only a
  // Statement) is allowed here. If context is not empty then only a Statement
  // is allowed. However, `let [` is an explicit negative lookahead for
  // ExpressionStatement, so special-case it first.
  if (nextCh === 91 || nextCh === 92 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true } // '[', '/', astral
  if (context) { return false }

  if (nextCh === 123) { return true } // '{'
  if (isIdentifierStart(nextCh, true)) {
    var pos = next + 1;
    while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) { ++pos; }
    if (nextCh === 92 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true }
    var ident = this.input.slice(next, pos);
    if (!keywordRelationalOperator.test(ident)) { return true }
  }
  return false
};

// check 'async [no LineTerminator here] function'
// - 'async /*foo*/ function' is OK.
// - 'async /*\n*/ function' is invalid.
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
    { return false }

  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, after;
  return !lineBreak.test(this.input.slice(this.pos, next)) &&
    this.input.slice(next, next + 8) === "function" &&
    (next + 8 === this.input.length ||
     !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 0xd7ff && after < 0xdc00))
};

// Parse a single statement.
//
// If expecting a statement and finding a slash operator, parse a
// regular expression literal. This is to handle cases like
// `if (foo) /blah/.exec(foo)`, where looking at the previous token
// does not help.

pp$8.parseStatement = function(context, topLevel, exports) {
  var starttype = this.type, node = this.startNode(), kind;

  if (this.isLet(context)) {
    starttype = types$1._var;
    kind = "let";
  }

  // Most types of statements are recognized by the keyword they
  // start with. Many are trivial to parse, some require a bit of
  // complexity.

  switch (starttype) {
  case types$1._break: case types$1._continue: return this.parseBreakContinueStatement(node, starttype.keyword)
  case types$1._debugger: return this.parseDebuggerStatement(node)
  case types$1._do: return this.parseDoStatement(node)
  case types$1._for: return this.parseForStatement(node)
  case types$1._function:
    // Function as sole body of either an if statement or a labeled statement
    // works, but not when it is part of a labeled statement that is the sole
    // body of an if statement.
    if ((context && (this.strict || context !== "if" && context !== "label")) && this.options.ecmaVersion >= 6) { this.unexpected(); }
    return this.parseFunctionStatement(node, false, !context)
  case types$1._class:
    if (context) { this.unexpected(); }
    return this.parseClass(node, true)
  case types$1._if: return this.parseIfStatement(node)
  case types$1._return: return this.parseReturnStatement(node)
  case types$1._switch: return this.parseSwitchStatement(node)
  case types$1._throw: return this.parseThrowStatement(node)
  case types$1._try: return this.parseTryStatement(node)
  case types$1._const: case types$1._var:
    kind = kind || this.value;
    if (context && kind !== "var") { this.unexpected(); }
    return this.parseVarStatement(node, kind)
  case types$1._while: return this.parseWhileStatement(node)
  case types$1._with: return this.parseWithStatement(node)
  case types$1.braceL: return this.parseBlock(true, node)
  case types$1.semi: return this.parseEmptyStatement(node)
  case types$1._export:
  case types$1._import:
    if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input);
      var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
      if (nextCh === 40 || nextCh === 46) // '(' or '.'
        { return this.parseExpressionStatement(node, this.parseExpression()) }
    }

    if (!this.options.allowImportExportEverywhere) {
      if (!topLevel)
        { this.raise(this.start, "'import' and 'export' may only appear at the top level"); }
      if (!this.inModule)
        { this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'"); }
    }
    return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports)

    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
  default:
    if (this.isAsyncFunction()) {
      if (context) { this.unexpected(); }
      this.next();
      return this.parseFunctionStatement(node, true, !context)
    }

    var maybeName = this.value, expr = this.parseExpression();
    if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon))
      { return this.parseLabeledStatement(node, maybeName, expr, context) }
    else { return this.parseExpressionStatement(node, expr) }
  }
};

pp$8.parseBreakContinueStatement = function(node, keyword) {
  var isBreak = keyword === "break";
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) { node.label = null; }
  else if (this.type !== types$1.name) { this.unexpected(); }
  else {
    node.label = this.parseIdent();
    this.semicolon();
  }

  // Verify that there is an actual destination to break or
  // continue to.
  var i = 0;
  for (; i < this.labels.length; ++i) {
    var lab = this.labels[i];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) { break }
      if (node.label && isBreak) { break }
    }
  }
  if (i === this.labels.length) { this.raise(node.start, "Unsyntactic " + keyword); }
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement")
};

pp$8.parseDebuggerStatement = function(node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement")
};

pp$8.parseDoStatement = function(node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types$1._while);
  node.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6)
    { this.eat(types$1.semi); }
  else
    { this.semicolon(); }
  return this.finishNode(node, "DoWhileStatement")
};

// Disambiguating between a `for` and a `for`/`in` or `for`/`of`
// loop is non-trivial. Basically, we have to parse the init `var`
// statement or expression, disallowing the `in` operator (see
// the second parameter to `parseExpression`), and then check
// whether the next token is `in` or `of`. When there is no init
// part (semicolon immediately after the opening parenthesis), it
// is a regular `for` loop.

pp$8.parseForStatement = function(node) {
  this.next();
  var awaitAt = (this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await")) ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types$1.parenL);
  if (this.type === types$1.semi) {
    if (awaitAt > -1) { this.unexpected(awaitAt); }
    return this.parseFor(node, null)
  }
  var isLet = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    if ((this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types$1._in) {
          if (awaitAt > -1) { this.unexpected(awaitAt); }
        } else { node.await = awaitAt > -1; }
      }
      return this.parseForIn(node, init$1)
    }
    if (awaitAt > -1) { this.unexpected(awaitAt); }
    return this.parseFor(node, init$1)
  }
  var startsWithLet = this.isContextual("let"), isForOf = false;
  var refDestructuringErrors = new DestructuringErrors;
  var init = this.parseExpression(awaitAt > -1 ? "await" : true, refDestructuringErrors);
  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
    if (this.options.ecmaVersion >= 9) {
      if (this.type === types$1._in) {
        if (awaitAt > -1) { this.unexpected(awaitAt); }
      } else { node.await = awaitAt > -1; }
    }
    if (startsWithLet && isForOf) { this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'."); }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLValPattern(init);
    return this.parseForIn(node, init)
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) { this.unexpected(awaitAt); }
  return this.parseFor(node, init)
};

pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync)
};

pp$8.parseIfStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  // allow function declarations in branches, but only in non-strict mode
  node.consequent = this.parseStatement("if");
  node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
  return this.finishNode(node, "IfStatement")
};

pp$8.parseReturnStatement = function(node) {
  if (!this.inFunction && !this.options.allowReturnOutsideFunction)
    { this.raise(this.start, "'return' outside of function"); }
  this.next();

  // In `return` (and `break`/`continue`), the keywords with
  // optional arguments, we eagerly look for a semicolon or the
  // possibility to insert one.

  if (this.eat(types$1.semi) || this.insertSemicolon()) { node.argument = null; }
  else { node.argument = this.parseExpression(); this.semicolon(); }
  return this.finishNode(node, "ReturnStatement")
};

pp$8.parseSwitchStatement = function(node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types$1.braceL);
  this.labels.push(switchLabel);
  this.enterScope(0);

  // Statements under must be grouped (by label) in SwitchCase
  // nodes. `cur` is used to keep the node that we are currently
  // adding statements to.

  var cur;
  for (var sawDefault = false; this.type !== types$1.braceR;) {
    if (this.type === types$1._case || this.type === types$1._default) {
      var isCase = this.type === types$1._case;
      if (cur) { this.finishNode(cur, "SwitchCase"); }
      node.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) { this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"); }
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types$1.colon);
    } else {
      if (!cur) { this.unexpected(); }
      cur.consequent.push(this.parseStatement(null));
    }
  }
  this.exitScope();
  if (cur) { this.finishNode(cur, "SwitchCase"); }
  this.next(); // Closing brace
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement")
};

pp$8.parseThrowStatement = function(node) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))
    { this.raise(this.lastTokEnd, "Illegal newline after throw"); }
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement")
};

// Reused empty array added for node fields that are always empty.

var empty$1 = [];

pp$8.parseTryStatement = function(node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types$1._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types$1.parenL)) {
      clause.param = this.parseBindingAtom();
      var simple = clause.param.type === "Identifier";
      this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
      this.checkLValPattern(clause.param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
      this.expect(types$1.parenR);
    } else {
      if (this.options.ecmaVersion < 10) { this.unexpected(); }
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
  if (!node.handler && !node.finalizer)
    { this.raise(node.start, "Missing catch or finally clause"); }
  return this.finishNode(node, "TryStatement")
};

pp$8.parseVarStatement = function(node, kind) {
  this.next();
  this.parseVar(node, false, kind);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration")
};

pp$8.parseWhileStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node, "WhileStatement")
};

pp$8.parseWithStatement = function(node) {
  if (this.strict) { this.raise(this.start, "'with' in strict mode"); }
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement("with");
  return this.finishNode(node, "WithStatement")
};

pp$8.parseEmptyStatement = function(node) {
  this.next();
  return this.finishNode(node, "EmptyStatement")
};

pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
  for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1)
    {
    var label = list[i$1];

    if (label.name === maybeName)
      { this.raise(expr.start, "Label '" + maybeName + "' is already declared");
  } }
  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
  for (var i = this.labels.length - 1; i >= 0; i--) {
    var label$1 = this.labels[i];
    if (label$1.statementStart === node.start) {
      // Update information about previous labels on this node
      label$1.statementStart = this.start;
      label$1.kind = kind;
    } else { break }
  }
  this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
  node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement")
};

pp$8.parseExpressionStatement = function(node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement")
};

// Parse a semicolon-enclosed block of statements, handling `"use
// strict"` declarations when `allowStrict` is true (used for
// function bodies).

pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
  if ( createNewLexicalScope === void 0 ) createNewLexicalScope = true;
  if ( node === void 0 ) node = this.startNode();

  node.body = [];
  this.expect(types$1.braceL);
  if (createNewLexicalScope) { this.enterScope(0); }
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  if (exitStrict) { this.strict = false; }
  this.next();
  if (createNewLexicalScope) { this.exitScope(); }
  return this.finishNode(node, "BlockStatement")
};

// Parse a regular `for` loop. The disambiguation code in
// `parseStatement` will already have parsed the init statement or
// expression.

pp$8.parseFor = function(node, init) {
  node.init = init;
  this.expect(types$1.semi);
  node.test = this.type === types$1.semi ? null : this.parseExpression();
  this.expect(types$1.semi);
  node.update = this.type === types$1.parenR ? null : this.parseExpression();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, "ForStatement")
};

// Parse a `for`/`in` and `for`/`of` loop, which are almost
// same from parser's perspective.

pp$8.parseForIn = function(node, init) {
  var isForIn = this.type === types$1._in;
  this.next();

  if (
    init.type === "VariableDeclaration" &&
    init.declarations[0].init != null &&
    (
      !isForIn ||
      this.options.ecmaVersion < 8 ||
      this.strict ||
      init.kind !== "var" ||
      init.declarations[0].id.type !== "Identifier"
    )
  ) {
    this.raise(
      init.start,
      ((isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer")
    );
  }
  node.left = init;
  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement")
};

// Parse a list of variable declarations.

pp$8.parseVar = function(node, isFor, kind) {
  node.declarations = [];
  node.kind = kind;
  for (;;) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    if (this.eat(types$1.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (kind === "const" && !(this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of")))) {
      this.unexpected();
    } else if (decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types$1.comma)) { break }
  }
  return node
};

pp$8.parseVarId = function(decl, kind) {
  decl.id = this.parseBindingAtom();
  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};

var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;

// Parse a function declaration or literal (depending on the
// `statement & FUNC_STATEMENT`).

// Remove `allowExpressionBody` for 7.0.0, as it is only called with false
pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    if (this.type === types$1.star && (statement & FUNC_HANGING_STATEMENT))
      { this.unexpected(); }
    node.generator = this.eat(types$1.star);
  }
  if (this.options.ecmaVersion >= 8)
    { node.async = !!isAsync; }

  if (statement & FUNC_STATEMENT) {
    node.id = (statement & FUNC_NULLABLE_ID) && this.type !== types$1.name ? null : this.parseIdent();
    if (node.id && !(statement & FUNC_HANGING_STATEMENT))
      // If it is a regular function declaration in sloppy mode, then it is
      // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding
      // mode depends on properties of the current scope (see
      // treatFunctionsAsVar).
      { this.checkLValSimple(node.id, (this.strict || node.generator || node.async) ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION); }
  }

  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node.async, node.generator));

  if (!(statement & FUNC_STATEMENT))
    { node.id = this.type === types$1.name ? this.parseIdent() : null; }

  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody, false, forInit);

  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, (statement & FUNC_STATEMENT) ? "FunctionDeclaration" : "FunctionExpression")
};

pp$8.parseFunctionParams = function(node) {
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};

// Parse a class declaration or literal (depending on the
// `isStatement` parameter).

pp$8.parseClass = function(node, isStatement) {
  this.next();

  // ecma-262 14.6 Class Definitions
  // A class definition is always strict mode code.
  var oldStrict = this.strict;
  this.strict = true;

  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var privateNameMap = this.enterClassBody();
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types$1.braceL);
  while (this.type !== types$1.braceR) {
    var element = this.parseClassElement(node.superClass !== null);
    if (element) {
      classBody.body.push(element);
      if (element.type === "MethodDefinition" && element.kind === "constructor") {
        if (hadConstructor) { this.raise(element.start, "Duplicate constructor in the same class"); }
        hadConstructor = true;
      } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
        this.raiseRecoverable(element.key.start, ("Identifier '#" + (element.key.name) + "' has already been declared"));
      }
    }
  }
  this.strict = oldStrict;
  this.next();
  node.body = this.finishNode(classBody, "ClassBody");
  this.exitClassBody();
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression")
};

pp$8.parseClassElement = function(constructorAllowsSuper) {
  if (this.eat(types$1.semi)) { return null }

  var ecmaVersion = this.options.ecmaVersion;
  var node = this.startNode();
  var keyName = "";
  var isGenerator = false;
  var isAsync = false;
  var kind = "method";
  var isStatic = false;

  if (this.eatContextual("static")) {
    // Parse static init block
    if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
      this.parseClassStaticBlock(node);
      return node
    }
    if (this.isClassElementNameStart() || this.type === types$1.star) {
      isStatic = true;
    } else {
      keyName = "static";
    }
  }
  node.static = isStatic;
  if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) {
    if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
      isAsync = true;
    } else {
      keyName = "async";
    }
  }
  if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(types$1.star)) {
    isGenerator = true;
  }
  if (!keyName && !isAsync && !isGenerator) {
    var lastValue = this.value;
    if (this.eatContextual("get") || this.eatContextual("set")) {
      if (this.isClassElementNameStart()) {
        kind = lastValue;
      } else {
        keyName = lastValue;
      }
    }
  }

  // Parse element name
  if (keyName) {
    // 'async', 'get', 'set', or 'static' were not a keyword contextually.
    // The last token is any of those. Make it the element name.
    node.computed = false;
    node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
    node.key.name = keyName;
    this.finishNode(node.key, "Identifier");
  } else {
    this.parseClassElementName(node);
  }

  // Parse element value
  if (ecmaVersion < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
    var isConstructor = !node.static && checkKeyName(node, "constructor");
    var allowsDirectSuper = isConstructor && constructorAllowsSuper;
    // Couldn't move this check into the 'parseClassMethod' method for backward compatibility.
    if (isConstructor && kind !== "method") { this.raise(node.key.start, "Constructor can't have get/set modifier"); }
    node.kind = isConstructor ? "constructor" : kind;
    this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
  } else {
    this.parseClassField(node);
  }

  return node
};

pp$8.isClassElementNameStart = function() {
  return (
    this.type === types$1.name ||
    this.type === types$1.privateId ||
    this.type === types$1.num ||
    this.type === types$1.string ||
    this.type === types$1.bracketL ||
    this.type.keyword
  )
};

pp$8.parseClassElementName = function(element) {
  if (this.type === types$1.privateId) {
    if (this.value === "constructor") {
      this.raise(this.start, "Classes can't have an element named '#constructor'");
    }
    element.computed = false;
    element.key = this.parsePrivateIdent();
  } else {
    this.parsePropertyName(element);
  }
};

pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
  // Check key and flags
  var key = method.key;
  if (method.kind === "constructor") {
    if (isGenerator) { this.raise(key.start, "Constructor can't be a generator"); }
    if (isAsync) { this.raise(key.start, "Constructor can't be an async method"); }
  } else if (method.static && checkKeyName(method, "prototype")) {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }

  // Parse value
  var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);

  // Check value
  if (method.kind === "get" && value.params.length !== 0)
    { this.raiseRecoverable(value.start, "getter should have no params"); }
  if (method.kind === "set" && value.params.length !== 1)
    { this.raiseRecoverable(value.start, "setter should have exactly one param"); }
  if (method.kind === "set" && value.params[0].type === "RestElement")
    { this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params"); }

  return this.finishNode(method, "MethodDefinition")
};

pp$8.parseClassField = function(field) {
  if (checkKeyName(field, "constructor")) {
    this.raise(field.key.start, "Classes can't have a field named 'constructor'");
  } else if (field.static && checkKeyName(field, "prototype")) {
    this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
  }

  if (this.eat(types$1.eq)) {
    // To raise SyntaxError if 'arguments' exists in the initializer.
    var scope = this.currentThisScope();
    var inClassFieldInit = scope.inClassFieldInit;
    scope.inClassFieldInit = true;
    field.value = this.parseMaybeAssign();
    scope.inClassFieldInit = inClassFieldInit;
  } else {
    field.value = null;
  }
  this.semicolon();

  return this.finishNode(field, "PropertyDefinition")
};

pp$8.parseClassStaticBlock = function(node) {
  node.body = [];

  var oldLabels = this.labels;
  this.labels = [];
  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  this.next();
  this.exitScope();
  this.labels = oldLabels;

  return this.finishNode(node, "StaticBlock")
};

pp$8.parseClassId = function(node, isStatement) {
  if (this.type === types$1.name) {
    node.id = this.parseIdent();
    if (isStatement)
      { this.checkLValSimple(node.id, BIND_LEXICAL, false); }
  } else {
    if (isStatement === true)
      { this.unexpected(); }
    node.id = null;
  }
};

pp$8.parseClassSuper = function(node) {
  node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(false) : null;
};

pp$8.enterClassBody = function() {
  var element = {declared: Object.create(null), used: []};
  this.privateNameStack.push(element);
  return element.declared
};

pp$8.exitClassBody = function() {
  var ref = this.privateNameStack.pop();
  var declared = ref.declared;
  var used = ref.used;
  var len = this.privateNameStack.length;
  var parent = len === 0 ? null : this.privateNameStack[len - 1];
  for (var i = 0; i < used.length; ++i) {
    var id = used[i];
    if (!hasOwn(declared, id.name)) {
      if (parent) {
        parent.used.push(id);
      } else {
        this.raiseRecoverable(id.start, ("Private field '#" + (id.name) + "' must be declared in an enclosing class"));
      }
    }
  }
};

function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name;
  var curr = privateNameMap[name];

  var next = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
    next = (element.static ? "s" : "i") + element.kind;
  }

  // `class { get #a(){}; static set #a(_){} }` is also conflict.
  if (
    curr === "iget" && next === "iset" ||
    curr === "iset" && next === "iget" ||
    curr === "sget" && next === "sset" ||
    curr === "sset" && next === "sget"
  ) {
    privateNameMap[name] = "true";
    return false
  } else if (!curr) {
    privateNameMap[name] = next;
    return false
  } else {
    return true
  }
}

function checkKeyName(node, name) {
  var computed = node.computed;
  var key = node.key;
  return !computed && (
    key.type === "Identifier" && key.name === name ||
    key.type === "Literal" && key.value === name
  )
}

// Parses module export declaration.

pp$8.parseExport = function(node, exports) {
  this.next();
  // export * from '...'
  if (this.eat(types$1.star)) {
    if (this.options.ecmaVersion >= 11) {
      if (this.eatContextual("as")) {
        node.exported = this.parseModuleExportName();
        this.checkExport(exports, node.exported, this.lastTokStart);
      } else {
        node.exported = null;
      }
    }
    this.expectContextual("from");
    if (this.type !== types$1.string) { this.unexpected(); }
    node.source = this.parseExprAtom();
    this.semicolon();
    return this.finishNode(node, "ExportAllDeclaration")
  }
  if (this.eat(types$1._default)) { // export default ...
    this.checkExport(exports, "default", this.lastTokStart);
    var isAsync;
    if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
      var fNode = this.startNode();
      this.next();
      if (isAsync) { this.next(); }
      node.declaration = this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
    } else if (this.type === types$1._class) {
      var cNode = this.startNode();
      node.declaration = this.parseClass(cNode, "nullableID");
    } else {
      node.declaration = this.parseMaybeAssign();
      this.semicolon();
    }
    return this.finishNode(node, "ExportDefaultDeclaration")
  }
  // export var|const|let|function|class ...
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseStatement(null);
    if (node.declaration.type === "VariableDeclaration")
      { this.checkVariableExport(exports, node.declaration.declarations); }
    else
      { this.checkExport(exports, node.declaration.id, node.declaration.id.start); }
    node.specifiers = [];
    node.source = null;
  } else { // export { x, y as z } [from '...']
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports);
    if (this.eatContextual("from")) {
      if (this.type !== types$1.string) { this.unexpected(); }
      node.source = this.parseExprAtom();
    } else {
      for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
        // check for keywords used as local names
        var spec = list[i];

        this.checkUnreserved(spec.local);
        // check if export is defined
        this.checkLocalExport(spec.local);

        if (spec.local.type === "Literal") {
          this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
        }
      }

      node.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration")
};

pp$8.checkExport = function(exports, name, pos) {
  if (!exports) { return }
  if (typeof name !== "string")
    { name = name.type === "Identifier" ? name.name : name.value; }
  if (hasOwn(exports, name))
    { this.raiseRecoverable(pos, "Duplicate export '" + name + "'"); }
  exports[name] = true;
};

pp$8.checkPatternExport = function(exports, pat) {
  var type = pat.type;
  if (type === "Identifier")
    { this.checkExport(exports, pat, pat.start); }
  else if (type === "ObjectPattern")
    { for (var i = 0, list = pat.properties; i < list.length; i += 1)
      {
        var prop = list[i];

        this.checkPatternExport(exports, prop);
      } }
  else if (type === "ArrayPattern")
    { for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
      var elt = list$1[i$1];

        if (elt) { this.checkPatternExport(exports, elt); }
    } }
  else if (type === "Property")
    { this.checkPatternExport(exports, pat.value); }
  else if (type === "AssignmentPattern")
    { this.checkPatternExport(exports, pat.left); }
  else if (type === "RestElement")
    { this.checkPatternExport(exports, pat.argument); }
  else if (type === "ParenthesizedExpression")
    { this.checkPatternExport(exports, pat.expression); }
};

pp$8.checkVariableExport = function(exports, decls) {
  if (!exports) { return }
  for (var i = 0, list = decls; i < list.length; i += 1)
    {
    var decl = list[i];

    this.checkPatternExport(exports, decl.id);
  }
};

pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" ||
    this.type.keyword === "const" ||
    this.type.keyword === "class" ||
    this.type.keyword === "function" ||
    this.isLet() ||
    this.isAsyncFunction()
};

// Parses a comma-separated list of module exports.

pp$8.parseExportSpecifiers = function(exports) {
  var nodes = [], first = true;
  // export { x, y as z } [from '...']
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) { break }
    } else { first = false; }

    var node = this.startNode();
    node.local = this.parseModuleExportName();
    node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
    this.checkExport(
      exports,
      node.exported,
      node.exported.start
    );
    nodes.push(this.finishNode(node, "ExportSpecifier"));
  }
  return nodes
};

// Parses import declaration.

pp$8.parseImport = function(node) {
  this.next();
  // import '...'
  if (this.type === types$1.string) {
    node.specifiers = empty$1;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration")
};

// Parses a comma-separated list of module imports.

pp$8.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types$1.name) {
    // import defaultObj, { x, y as z } from '...'
    var node = this.startNode();
    node.local = this.parseIdent();
    this.checkLValSimple(node.local, BIND_LEXICAL);
    nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
    if (!this.eat(types$1.comma)) { return nodes }
  }
  if (this.type === types$1.star) {
    var node$1 = this.startNode();
    this.next();
    this.expectContextual("as");
    node$1.local = this.parseIdent();
    this.checkLValSimple(node$1.local, BIND_LEXICAL);
    nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
    return nodes
  }
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) { break }
    } else { first = false; }

    var node$2 = this.startNode();
    node$2.imported = this.parseModuleExportName();
    if (this.eatContextual("as")) {
      node$2.local = this.parseIdent();
    } else {
      this.checkUnreserved(node$2.imported);
      node$2.local = node$2.imported;
    }
    this.checkLValSimple(node$2.local, BIND_LEXICAL);
    nodes.push(this.finishNode(node$2, "ImportSpecifier"));
  }
  return nodes
};

pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var stringLiteral = this.parseLiteral(this.value);
    if (loneSurrogate.test(stringLiteral.value)) {
      this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
    }
    return stringLiteral
  }
  return this.parseIdent(true)
};

// Set `ExpressionStatement#directive` property for directive prologues.
pp$8.adaptDirectivePrologue = function(statements) {
  for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
    statements[i].directive = statements[i].expression.raw.slice(1, -1);
  }
};
pp$8.isDirectiveCandidate = function(statement) {
  return (
    statement.type === "ExpressionStatement" &&
    statement.expression.type === "Literal" &&
    typeof statement.expression.value === "string" &&
    // Reject parenthesized strings.
    (this.input[statement.start] === "\"" || this.input[statement.start] === "'")
  )
};

var pp$7 = Parser.prototype;

// Convert existing expression atom to assignable pattern
// if possible.

pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node) {
    switch (node.type) {
    case "Identifier":
      if (this.inAsync && node.name === "await")
        { this.raise(node.start, "Cannot use 'await' as identifier inside an async function"); }
      break

    case "ObjectPattern":
    case "ArrayPattern":
    case "AssignmentPattern":
    case "RestElement":
      break

    case "ObjectExpression":
      node.type = "ObjectPattern";
      if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
      for (var i = 0, list = node.properties; i < list.length; i += 1) {
        var prop = list[i];

      this.toAssignable(prop, isBinding);
        // Early error:
        //   AssignmentRestProperty[Yield, Await] :
        //     `...` DestructuringAssignmentTarget[Yield, Await]
        //
        //   It is a Syntax Error if |DestructuringAssignmentTarget| is an |ArrayLiteral| or an |ObjectLiteral|.
        if (
          prop.type === "RestElement" &&
          (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")
        ) {
          this.raise(prop.argument.start, "Unexpected token");
        }
      }
      break

    case "Property":
      // AssignmentProperty has type === "Property"
      if (node.kind !== "init") { this.raise(node.key.start, "Object pattern can't contain getter or setter"); }
      this.toAssignable(node.value, isBinding);
      break

    case "ArrayExpression":
      node.type = "ArrayPattern";
      if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
      this.toAssignableList(node.elements, isBinding);
      break

    case "SpreadElement":
      node.type = "RestElement";
      this.toAssignable(node.argument, isBinding);
      if (node.argument.type === "AssignmentPattern")
        { this.raise(node.argument.start, "Rest elements cannot have a default value"); }
      break

    case "AssignmentExpression":
      if (node.operator !== "=") { this.raise(node.left.end, "Only '=' operator can be used for specifying default value."); }
      node.type = "AssignmentPattern";
      delete node.operator;
      this.toAssignable(node.left, isBinding);
      break

    case "ParenthesizedExpression":
      this.toAssignable(node.expression, isBinding, refDestructuringErrors);
      break

    case "ChainExpression":
      this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
      break

    case "MemberExpression":
      if (!isBinding) { break }

    default:
      this.raise(node.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
  return node
};

// Convert list of expression atoms to binding list.

pp$7.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i = 0; i < end; i++) {
    var elt = exprList[i];
    if (elt) { this.toAssignable(elt, isBinding); }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier")
      { this.unexpected(last.argument.start); }
  }
  return exprList
};

// Parses spread element.

pp$7.parseSpread = function(refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement")
};

pp$7.parseRestBinding = function() {
  var node = this.startNode();
  this.next();

  // RestElement inside of a function parameter must be an identifier
  if (this.options.ecmaVersion === 6 && this.type !== types$1.name)
    { this.unexpected(); }

  node.argument = this.parseBindingAtom();

  return this.finishNode(node, "RestElement")
};

// Parses lvalue (assignable) atom.

pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
    case types$1.bracketL:
      var node = this.startNode();
      this.next();
      node.elements = this.parseBindingList(types$1.bracketR, true, true);
      return this.finishNode(node, "ArrayPattern")

    case types$1.braceL:
      return this.parseObj(true)
    }
  }
  return this.parseIdent()
};

pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (first) { first = false; }
    else { this.expect(types$1.comma); }
    if (allowEmpty && this.type === types$1.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break
    } else if (this.type === types$1.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      if (this.type === types$1.comma) { this.raise(this.start, "Comma is not permitted after the rest element"); }
      this.expect(close);
      break
    } else {
      var elem = this.parseMaybeDefault(this.start, this.startLoc);
      this.parseBindingListItem(elem);
      elts.push(elem);
    }
  }
  return elts
};

pp$7.parseBindingListItem = function(param) {
  return param
};

// Parses assignment pattern around given atom if possible.

pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) { return left }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern")
};

// The following three functions all verify that a node is an lvalue —
// something that can be bound, or assigned to. In order to do so, they perform
// a variety of checks:
//
// - Check that none of the bound/assigned-to identifiers are reserved words.
// - Record name declarations for bindings in the appropriate scope.
// - Check duplicate argument names, if checkClashes is set.
//
// If a complex binding pattern is encountered (e.g., object and array
// destructuring), the entire pattern is recursively checked.
//
// There are three versions of checkLVal*() appropriate for different
// circumstances:
//
// - checkLValSimple() shall be used if the syntactic construct supports
//   nothing other than identifiers and member expressions. Parenthesized
//   expressions are also correctly handled. This is generally appropriate for
//   constructs for which the spec says
//
//   > It is a Syntax Error if AssignmentTargetType of [the production] is not
//   > simple.
//
//   It is also appropriate for checking if an identifier is valid and not
//   defined elsewhere, like import declarations or function/class identifiers.
//
//   Examples where this is used include:
//     a += …;
//     import a from '…';
//   where a is the node to be checked.
//
// - checkLValPattern() shall be used if the syntactic construct supports
//   anything checkLValSimple() supports, as well as object and array
//   destructuring patterns. This is generally appropriate for constructs for
//   which the spec says
//
//   > It is a Syntax Error if [the production] is neither an ObjectLiteral nor
//   > an ArrayLiteral and AssignmentTargetType of [the production] is not
//   > simple.
//
//   Examples where this is used include:
//     (a = …);
//     const a = …;
//     try { … } catch (a) { … }
//   where a is the node to be checked.
//
// - checkLValInnerPattern() shall be used if the syntactic construct supports
//   anything checkLValPattern() supports, as well as default assignment
//   patterns, rest elements, and other constructs that may appear within an
//   object or array destructuring pattern.
//
//   As a special case, function parameters also use checkLValInnerPattern(),
//   as they also support defaults and rest constructs.
//
// These functions deliberately support both assignment and binding constructs,
// as the logic for both is exceedingly similar. If the node is the target of
// an assignment, then bindingType should be set to BIND_NONE. Otherwise, it
// should be set to the appropriate BIND_* constant, like BIND_VAR or
// BIND_LEXICAL.
//
// If the function is called with a non-BIND_NONE bindingType, then
// additionally a checkClashes object may be specified to allow checking for
// duplicate argument names. checkClashes is ignored if the provided construct
// is an assignment (i.e., bindingType is BIND_NONE).

pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
  if ( bindingType === void 0 ) bindingType = BIND_NONE;

  var isBind = bindingType !== BIND_NONE;

  switch (expr.type) {
  case "Identifier":
    if (this.strict && this.reservedWordsStrictBind.test(expr.name))
      { this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode"); }
    if (isBind) {
      if (bindingType === BIND_LEXICAL && expr.name === "let")
        { this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name"); }
      if (checkClashes) {
        if (hasOwn(checkClashes, expr.name))
          { this.raiseRecoverable(expr.start, "Argument name clash"); }
        checkClashes[expr.name] = true;
      }
      if (bindingType !== BIND_OUTSIDE) { this.declareName(expr.name, bindingType, expr.start); }
    }
    break

  case "ChainExpression":
    this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
    break

  case "MemberExpression":
    if (isBind) { this.raiseRecoverable(expr.start, "Binding member expression"); }
    break

  case "ParenthesizedExpression":
    if (isBind) { this.raiseRecoverable(expr.start, "Binding parenthesized expression"); }
    return this.checkLValSimple(expr.expression, bindingType, checkClashes)

  default:
    this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
  }
};

pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
  if ( bindingType === void 0 ) bindingType = BIND_NONE;

  switch (expr.type) {
  case "ObjectPattern":
    for (var i = 0, list = expr.properties; i < list.length; i += 1) {
      var prop = list[i];

    this.checkLValInnerPattern(prop, bindingType, checkClashes);
    }
    break

  case "ArrayPattern":
    for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
      var elem = list$1[i$1];

    if (elem) { this.checkLValInnerPattern(elem, bindingType, checkClashes); }
    }
    break

  default:
    this.checkLValSimple(expr, bindingType, checkClashes);
  }
};

pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
  if ( bindingType === void 0 ) bindingType = BIND_NONE;

  switch (expr.type) {
  case "Property":
    // AssignmentProperty has type === "Property"
    this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
    break

  case "AssignmentPattern":
    this.checkLValPattern(expr.left, bindingType, checkClashes);
    break

  case "RestElement":
    this.checkLValPattern(expr.argument, bindingType, checkClashes);
    break

  default:
    this.checkLValPattern(expr, bindingType, checkClashes);
  }
};

// The algorithm used to determine whether a regexp can appear at a

var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};

var types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function (p) { return p.tryReadTemplateToken(); }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};

var pp$6 = Parser.prototype;

pp$6.initialContext = function() {
  return [types.b_stat]
};

pp$6.curContext = function() {
  return this.context[this.context.length - 1]
};

pp$6.braceIsBlock = function(prevType) {
  var parent = this.curContext();
  if (parent === types.f_expr || parent === types.f_stat)
    { return true }
  if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr))
    { return !parent.isExpr }

  // The check for `tt.name && exprAllowed` detects whether we are
  // after a `yield` or `of` construct. See the `updateContext` for
  // `tt.name`.
  if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed)
    { return lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) }
  if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow)
    { return true }
  if (prevType === types$1.braceL)
    { return parent === types.b_stat }
  if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name)
    { return false }
  return !this.exprAllowed
};

pp$6.inGeneratorContext = function() {
  for (var i = this.context.length - 1; i >= 1; i--) {
    var context = this.context[i];
    if (context.token === "function")
      { return context.generator }
  }
  return false
};

pp$6.updateContext = function(prevType) {
  var update, type = this.type;
  if (type.keyword && prevType === types$1.dot)
    { this.exprAllowed = false; }
  else if (update = type.updateContext)
    { update.call(this, prevType); }
  else
    { this.exprAllowed = type.beforeExpr; }
};

// Used to handle egde case when token context could not be inferred correctly in tokenize phase
pp$6.overrideContext = function(tokenCtx) {
  if (this.curContext() !== tokenCtx) {
    this.context[this.context.length - 1] = tokenCtx;
  }
};

// Token-specific context update code

types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return
  }
  var out = this.context.pop();
  if (out === types.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};

types$1.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.exprAllowed = true;
};

types$1.dollarBraceL.updateContext = function() {
  this.context.push(types.b_tmpl);
  this.exprAllowed = true;
};

types$1.parenL.updateContext = function(prevType) {
  var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
  this.context.push(statementParens ? types.p_stat : types.p_expr);
  this.exprAllowed = true;
};

types$1.incDec.updateContext = function() {
  // tokExprAllowed stays unchanged
};

types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
  if (prevType.beforeExpr && prevType !== types$1._else &&
      !(prevType === types$1.semi && this.curContext() !== types.p_stat) &&
      !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) &&
      !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat))
    { this.context.push(types.f_expr); }
  else
    { this.context.push(types.f_stat); }
  this.exprAllowed = false;
};

types$1.backQuote.updateContext = function() {
  if (this.curContext() === types.q_tmpl)
    { this.context.pop(); }
  else
    { this.context.push(types.q_tmpl); }
  this.exprAllowed = false;
};

types$1.star.updateContext = function(prevType) {
  if (prevType === types$1._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types.f_expr)
      { this.context[index] = types.f_expr_gen; }
    else
      { this.context[index] = types.f_gen; }
  }
  this.exprAllowed = true;
};

types$1.name.updateContext = function(prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
    if (this.value === "of" && !this.exprAllowed ||
        this.value === "yield" && this.inGeneratorContext())
      { allowed = true; }
  }
  this.exprAllowed = allowed;
};

// A recursive descent parser operates by defining functions for all

var pp$5 = Parser.prototype;

// Check if property name clashes with already added.
// Object/class getters and setters are not allowed to clash —
// either with each other or with an init property — and in
// strict mode, init properties are also not allowed to be repeated.

pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement")
    { return }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
    { return }
  var key = prop.key;
  var name;
  switch (key.type) {
  case "Identifier": name = key.name; break
  case "Literal": name = String(key.value); break
  default: return
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors) {
          if (refDestructuringErrors.doubleProto < 0) {
            refDestructuringErrors.doubleProto = key.start;
          }
        } else {
          this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        }
      }
      propHash.proto = true;
    }
    return
  }
  name = "$" + name;
  var other = propHash[name];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition)
      { this.raiseRecoverable(key.start, "Redefinition of property"); }
  } else {
    other = propHash[name] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};

// ### Expression parsing

// These nest, from the most general expression type at the top to
// 'atomic', nondivisible expression types at the bottom. Most of
// the functions will simply let the function(s) below them parse,
// and, *if* the syntactic construct they handle is present, wrap
// the AST node that the inner parser gave them in another node.

// Parse a full expression. The optional arguments are used to
// forbid the `in` operator (in for loops initalization expressions)
// and provide reference for storing '=' operator inside shorthand
// property assignment in contexts where both object expression
// and object pattern might appear (so it's possible to raise
// delayed syntax error at correct position).

pp$5.parseExpression = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
  if (this.type === types$1.comma) {
    var node = this.startNodeAt(startPos, startLoc);
    node.expressions = [expr];
    while (this.eat(types$1.comma)) { node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors)); }
    return this.finishNode(node, "SequenceExpression")
  }
  return expr
};

// Parse an assignment expression. This includes applications of
// operators like `+=`.

pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) { return this.parseYield(forInit) }
    // The tokenizer will assume an expression is allowed after
    // `yield`, but this isn't that kind of yield
    else { this.exprAllowed = false; }
  }

  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    oldDoubleProto = refDestructuringErrors.doubleProto;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors;
    ownDestructuringErrors = true;
  }

  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types$1.parenL || this.type === types$1.name) {
    this.potentialArrowAt = this.start;
    this.potentialArrowInForAwait = forInit === "await";
  }
  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
  if (afterLeftParse) { left = afterLeftParse.call(this, left, startPos, startLoc); }
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    if (this.type === types$1.eq)
      { left = this.toAssignable(left, false, refDestructuringErrors); }
    if (!ownDestructuringErrors) {
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
    }
    if (refDestructuringErrors.shorthandAssign >= left.start)
      { refDestructuringErrors.shorthandAssign = -1; } // reset because shorthand default was used correctly
    if (this.type === types$1.eq)
      { this.checkLValPattern(left); }
    else
      { this.checkLValSimple(left); }
    node.left = left;
    this.next();
    node.right = this.parseMaybeAssign(forInit);
    if (oldDoubleProto > -1) { refDestructuringErrors.doubleProto = oldDoubleProto; }
    return this.finishNode(node, "AssignmentExpression")
  } else {
    if (ownDestructuringErrors) { this.checkExpressionErrors(refDestructuringErrors, true); }
  }
  if (oldParenAssign > -1) { refDestructuringErrors.parenthesizedAssign = oldParenAssign; }
  if (oldTrailingComma > -1) { refDestructuringErrors.trailingComma = oldTrailingComma; }
  return left
};

// Parse a ternary conditional (`?:`) operator.

pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprOps(forInit, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
  if (this.eat(types$1.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types$1.colon);
    node.alternate = this.parseMaybeAssign(forInit);
    return this.finishNode(node, "ConditionalExpression")
  }
  return expr
};

// Start the precedence parser.

pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
  if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit)
};

// Parse binary operators with the operator precedence parsing
// algorithm. `left` is the left-hand side of the operator.
// `minPrec` provides context that allows the function to stop and
// defer further parser to one of its callers when it encounters an
// operator that has a lower precedence than the set it is parsing.

pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
  var prec = this.type.binop;
  if (prec != null && (!forInit || this.type !== types$1._in)) {
    if (prec > minPrec) {
      var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
      var coalesce = this.type === types$1.coalesce;
      if (coalesce) {
        // Handle the precedence of `tt.coalesce` as equal to the range of logical expressions.
        // In other words, `node.right` shouldn't contain logical expressions in order to check the mixed error.
        prec = types$1.logicalAND.binop;
      }
      var op = this.value;
      this.next();
      var startPos = this.start, startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
      var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
      if ((logical && this.type === types$1.coalesce) || (coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND))) {
        this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
      }
      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit)
    }
  }
  return left
};

pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
  if (right.type === "PrivateIdentifier") { this.raise(right.start, "Private identifier can only be left side of binary expression"); }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression")
};

// Parse unary operators, both prefix and postfix.

pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
  var startPos = this.start, startLoc = this.startLoc, expr;
  if (this.isContextual("await") && this.canAwait) {
    expr = this.parseAwait(forInit);
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(), update = this.type === types$1.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true, update, forInit);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update) { this.checkLValSimple(node.argument); }
    else if (this.strict && node.operator === "delete" &&
             node.argument.type === "Identifier")
      { this.raiseRecoverable(node.start, "Deleting local variable in strict mode"); }
    else if (node.operator === "delete" && isPrivateFieldAccess(node.argument))
      { this.raiseRecoverable(node.start, "Private fields can not be deleted"); }
    else { sawUnary = true; }
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else if (!sawUnary && this.type === types$1.privateId) {
    if (forInit || this.privateNameStack.length === 0) { this.unexpected(); }
    expr = this.parsePrivateIdent();
    // only could be private fields in 'in', such as #x in obj
    if (this.type !== types$1._in) { this.unexpected(); }
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLValSimple(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }

  if (!incDec && this.eat(types$1.starstar)) {
    if (sawUnary)
      { this.unexpected(this.lastTokStart); }
    else
      { return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false) }
  } else {
    return expr
  }
};

function isPrivateFieldAccess(node) {
  return (
    node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" ||
    node.type === "ChainExpression" && isPrivateFieldAccess(node.expression)
  )
}

// Parse call, dot, and `[]`-subscript expressions.

pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors, forInit);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
    { return expr }
  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) { refDestructuringErrors.parenthesizedAssign = -1; }
    if (refDestructuringErrors.parenthesizedBind >= result.start) { refDestructuringErrors.parenthesizedBind = -1; }
    if (refDestructuringErrors.trailingComma >= result.start) { refDestructuringErrors.trailingComma = -1; }
  }
  return result
};

pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" &&
      this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 &&
      this.potentialArrowAt === base.start;
  var optionalChained = false;

  while (true) {
    var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);

    if (element.optional) { optionalChained = true; }
    if (element === base || element.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element;
        element = this.finishNode(chainNode, "ChainExpression");
      }
      return element
    }

    base = element;
  }
};

pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
  var optionalSupported = this.options.ecmaVersion >= 11;
  var optional = optionalSupported && this.eat(types$1.questionDot);
  if (noCalls && optional) { this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions"); }

  var computed = this.eat(types$1.bracketL);
  if (computed || (optional && this.type !== types$1.parenL && this.type !== types$1.backQuote) || this.eat(types$1.dot)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.object = base;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(types$1.bracketR);
    } else if (this.type === types$1.privateId && base.type !== "Super") {
      node.property = this.parsePrivateIdent();
    } else {
      node.property = this.parseIdent(this.options.allowReserved !== "never");
    }
    node.computed = !!computed;
    if (optionalSupported) {
      node.optional = optional;
    }
    base = this.finishNode(node, "MemberExpression");
  } else if (!noCalls && this.eat(types$1.parenL)) {
    var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && !this.canInsertSemicolon() && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      if (this.awaitIdentPos > 0)
        { this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"); }
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit)
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base;
    node$1.arguments = exprList;
    if (optionalSupported) {
      node$1.optional = optional;
    }
    base = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    if (optional || optionalChained) {
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    }
    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base;
    node$2.quasi = this.parseTemplate({isTagged: true});
    base = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base
};

// Parse an atomic expression — either a single token that is an
// expression, an expression started by a keyword like `function` or
// `new`, or an expression wrapped in punctuation like `()`, `[]`,
// or `{}`.

pp$5.parseExprAtom = function(refDestructuringErrors, forInit) {
  // If a division operator appears in an expression position, the
  // tokenizer got confused, and we force it to read a regexp instead.
  if (this.type === types$1.slash) { this.readRegexp(); }

  var node, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
  case types$1._super:
    if (!this.allowSuper)
      { this.raise(this.start, "'super' keyword outside a method"); }
    node = this.startNode();
    this.next();
    if (this.type === types$1.parenL && !this.allowDirectSuper)
      { this.raise(node.start, "super() call outside constructor of a subclass"); }
    // The `super` keyword can appear at below:
    // SuperProperty:
    //     super [ Expression ]
    //     super . IdentifierName
    // SuperCall:
    //     super ( Arguments )
    if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL)
      { this.unexpected(); }
    return this.finishNode(node, "Super")

  case types$1._this:
    node = this.startNode();
    this.next();
    return this.finishNode(node, "ThisExpression")

  case types$1.name:
    var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
    var id = this.parseIdent(false);
    if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
      this.overrideContext(types.f_expr);
      return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit)
    }
    if (canBeArrow && !this.canInsertSemicolon()) {
      if (this.eat(types$1.arrow))
        { return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit) }
      if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc &&
          (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
        id = this.parseIdent(false);
        if (this.canInsertSemicolon() || !this.eat(types$1.arrow))
          { this.unexpected(); }
        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit)
      }
    }
    return id

  case types$1.regexp:
    var value = this.value;
    node = this.parseLiteral(value.value);
    node.regex = {pattern: value.pattern, flags: value.flags};
    return node

  case types$1.num: case types$1.string:
    return this.parseLiteral(this.value)

  case types$1._null: case types$1._true: case types$1._false:
    node = this.startNode();
    node.value = this.type === types$1._null ? null : this.type === types$1._true;
    node.raw = this.type.keyword;
    this.next();
    return this.finishNode(node, "Literal")

  case types$1.parenL:
    var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
    if (refDestructuringErrors) {
      if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))
        { refDestructuringErrors.parenthesizedAssign = start; }
      if (refDestructuringErrors.parenthesizedBind < 0)
        { refDestructuringErrors.parenthesizedBind = start; }
    }
    return expr

  case types$1.bracketL:
    node = this.startNode();
    this.next();
    node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
    return this.finishNode(node, "ArrayExpression")

  case types$1.braceL:
    this.overrideContext(types.b_expr);
    return this.parseObj(false, refDestructuringErrors)

  case types$1._function:
    node = this.startNode();
    this.next();
    return this.parseFunction(node, 0)

  case types$1._class:
    return this.parseClass(this.startNode(), false)

  case types$1._new:
    return this.parseNew()

  case types$1.backQuote:
    return this.parseTemplate()

  case types$1._import:
    if (this.options.ecmaVersion >= 11) {
      return this.parseExprImport()
    } else {
      return this.unexpected()
    }

  default:
    this.unexpected();
  }
};

pp$5.parseExprImport = function() {
  var node = this.startNode();

  // Consume `import` as an identifier for `import.meta`.
  // Because `this.parseIdent(true)` doesn't check escape sequences, it needs the check of `this.containsEsc`.
  if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword import"); }
  var meta = this.parseIdent(true);

  switch (this.type) {
  case types$1.parenL:
    return this.parseDynamicImport(node)
  case types$1.dot:
    node.meta = meta;
    return this.parseImportMeta(node)
  default:
    this.unexpected();
  }
};

pp$5.parseDynamicImport = function(node) {
  this.next(); // skip `(`

  // Parse node.source.
  node.source = this.parseMaybeAssign();

  // Verify ending.
  if (!this.eat(types$1.parenR)) {
    var errorPos = this.start;
    if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
      this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
    } else {
      this.unexpected(errorPos);
    }
  }

  return this.finishNode(node, "ImportExpression")
};

pp$5.parseImportMeta = function(node) {
  this.next(); // skip `.`

  var containsEsc = this.containsEsc;
  node.property = this.parseIdent(true);

  if (node.property.name !== "meta")
    { this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'"); }
  if (containsEsc)
    { this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters"); }
  if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere)
    { this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module"); }

  return this.finishNode(node, "MetaProperty")
};

pp$5.parseLiteral = function(value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  if (node.raw.charCodeAt(node.raw.length - 1) === 110) { node.bigint = node.raw.slice(0, -1).replace(/_/g, ""); }
  this.next();
  return this.finishNode(node, "Literal")
};

pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var val = this.parseExpression();
  this.expect(types$1.parenR);
  return val
};

pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();

    var innerStartPos = this.start, innerStartLoc = this.startLoc;
    var exprList = [], first = true, lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    // Do not save awaitIdentPos to allow checking awaits nested in parameters
    while (this.type !== types$1.parenR) {
      first ? first = false : this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
        lastIsComma = true;
        break
      } else if (this.type === types$1.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        if (this.type === types$1.comma) { this.raise(this.start, "Comma is not permitted after the rest element"); }
        break
      } else {
        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
      }
    }
    var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
    this.expect(types$1.parenR);

    if (canBeArrow && !this.canInsertSemicolon() && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList, forInit)
    }

    if (!exprList.length || lastIsComma) { this.unexpected(this.lastTokStart); }
    if (spreadStart) { this.unexpected(spreadStart); }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;

    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }

  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression")
  } else {
    return val
  }
};

pp$5.parseParenItem = function(item) {
  return item
};

pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit)
};

// New's precedence is slightly tricky. It must allow its argument to
// be a `[]` or dot subscript expression, but not a call — at least,
// not without wrapping it in parentheses. Thus, it uses the noCalls
// argument to parseSubscripts to prevent it from consuming the
// argument list.

var empty = [];

pp$5.parseNew = function() {
  if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword new"); }
  var node = this.startNode();
  var meta = this.parseIdent(true);
  if (this.options.ecmaVersion >= 6 && this.eat(types$1.dot)) {
    node.meta = meta;
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    if (node.property.name !== "target")
      { this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'"); }
    if (containsEsc)
      { this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters"); }
    if (!this.allowNewDotTarget)
      { this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block"); }
    return this.finishNode(node, "MetaProperty")
  }
  var startPos = this.start, startLoc = this.startLoc, isImport = this.type === types$1._import;
  node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true, false);
  if (isImport && node.callee.type === "ImportExpression") {
    this.raise(startPos, "Cannot use new with import()");
  }
  if (this.eat(types$1.parenL)) { node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false); }
  else { node.arguments = empty; }
  return this.finishNode(node, "NewExpression")
};

// Parse template expression.

pp$5.parseTemplateElement = function(ref) {
  var isTagged = ref.isTagged;

  var elem = this.startNode();
  if (this.type === types$1.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value,
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types$1.backQuote;
  return this.finishNode(elem, "TemplateElement")
};

pp$5.parseTemplate = function(ref) {
  if ( ref === void 0 ) ref = {};
  var isTagged = ref.isTagged; if ( isTagged === void 0 ) isTagged = false;

  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({isTagged: isTagged});
  node.quasis = [curElt];
  while (!curElt.tail) {
    if (this.type === types$1.eof) { this.raise(this.pos, "Unterminated template literal"); }
    this.expect(types$1.dollarBraceL);
    node.expressions.push(this.parseExpression());
    this.expect(types$1.braceR);
    node.quasis.push(curElt = this.parseTemplateElement({isTagged: isTagged}));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral")
};

pp$5.isAsyncProp = function(prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" &&
    (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || (this.options.ecmaVersion >= 9 && this.type === types$1.star)) &&
    !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
};

// Parse an object literal or binding pattern.

pp$5.parseObj = function(isPattern, refDestructuringErrors) {
  var node = this.startNode(), first = true, propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) { break }
    } else { first = false; }

    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) { this.checkPropClash(prop, propHash, refDestructuringErrors); }
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
};

pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
  var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types$1.comma) {
        this.raise(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement")
    }
    // To disallow parenthesized identifier via `this.toAssignable()`.
    if (this.type === types$1.parenL && refDestructuringErrors) {
      if (refDestructuringErrors.parenthesizedAssign < 0) {
        refDestructuringErrors.parenthesizedAssign = this.start;
      }
      if (refDestructuringErrors.parenthesizedBind < 0) {
        refDestructuringErrors.parenthesizedBind = this.start;
      }
    }
    // Parse argument.
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    // To disallow trailing comma via `this.toAssignable()`.
    if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    // Finish
    return this.finishNode(prop, "SpreadElement")
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern)
      { isGenerator = this.eat(types$1.star); }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
    this.parsePropertyName(prop, refDestructuringErrors);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property")
};

pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator || isAsync) && this.type === types$1.colon)
    { this.unexpected(); }

  if (this.eat(types$1.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
    if (isPattern) { this.unexpected(); }
    prop.kind = "init";
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
  } else if (!isPattern && !containsEsc &&
             this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
             (prop.key.name === "get" || prop.key.name === "set") &&
             (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
    if (isGenerator || isAsync) { this.unexpected(); }
    prop.kind = prop.key.name;
    this.parsePropertyName(prop);
    prop.value = this.parseMethod(false);
    var paramCount = prop.kind === "get" ? 0 : 1;
    if (prop.value.params.length !== paramCount) {
      var start = prop.value.start;
      if (prop.kind === "get")
        { this.raiseRecoverable(start, "getter should have no params"); }
      else
        { this.raiseRecoverable(start, "setter should have exactly one param"); }
    } else {
      if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
        { this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params"); }
    }
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator || isAsync) { this.unexpected(); }
    this.checkUnreserved(prop.key);
    if (prop.key.name === "await" && !this.awaitIdentPos)
      { this.awaitIdentPos = startPos; }
    prop.kind = "init";
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else if (this.type === types$1.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0)
        { refDestructuringErrors.shorthandAssign = this.start; }
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else {
      prop.value = this.copyNode(prop.key);
    }
    prop.shorthand = true;
  } else { this.unexpected(); }
};

pp$5.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types$1.bracketR);
      return prop.key
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never")
};

// Initialize empty function node.

pp$5.initFunction = function(node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) { node.generator = node.expression = false; }
  if (this.options.ecmaVersion >= 8) { node.async = false; }
};

// Parse object or class method.

pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

  this.initFunction(node);
  if (this.options.ecmaVersion >= 6)
    { node.generator = isGenerator; }
  if (this.options.ecmaVersion >= 8)
    { node.async = !!isAsync; }

  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));

  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false, true, false);

  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "FunctionExpression")
};

// Parse arrow function expression with given parameters.

pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) { node.async = !!isAsync; }

  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;

  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true, false, forInit);

  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "ArrowFunctionExpression")
};

// Parse function body and check parameters.

pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
  var isExpression = isArrowFunction && this.type !== types$1.braceL;
  var oldStrict = this.strict, useStrict = false;

  if (isExpression) {
    node.body = this.parseMaybeAssign(forInit);
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      // If this is a strict mode function, verify that argument names
      // are not repeated, and it does not try to bind the words `eval`
      // or `arguments`.
      if (useStrict && nonSimple)
        { this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list"); }
    }
    // Start a new scope with regard to labels and the `inFunction`
    // flag (restore them to their old value afterwards).
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) { this.strict = true; }

    // Add the params to varDeclaredNames to ensure that an error is thrown
    // if a let/const declaration in the function clashes with one of the params.
    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
    // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'
    if (this.strict && node.id) { this.checkLValSimple(node.id, BIND_OUTSIDE); }
    node.body = this.parseBlock(false, undefined, useStrict && !oldStrict);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};

pp$5.isSimpleParamList = function(params) {
  for (var i = 0, list = params; i < list.length; i += 1)
    {
    var param = list[i];

    if (param.type !== "Identifier") { return false
  } }
  return true
};

// Checks function params for various disallowed patterns such as using "eval"
// or "arguments" and duplicate parameters.

pp$5.checkParams = function(node, allowDuplicates) {
  var nameHash = Object.create(null);
  for (var i = 0, list = node.params; i < list.length; i += 1)
    {
    var param = list[i];

    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
  }
};

// Parses a comma-separated list of expressions, and returns them as
// an array. `close` is the token type that ends the list, and
// `allowEmpty` can be turned on to allow subsequent commas with
// nothing in between them to be parsed as `null` (which is needed
// for array literals).

pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) { break }
    } else { first = false; }

    var elt = (void 0);
    if (allowEmpty && this.type === types$1.comma)
      { elt = null; }
    else if (this.type === types$1.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0)
        { refDestructuringErrors.trailingComma = this.start; }
    } else {
      elt = this.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts
};

pp$5.checkUnreserved = function(ref) {
  var start = ref.start;
  var end = ref.end;
  var name = ref.name;

  if (this.inGenerator && name === "yield")
    { this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator"); }
  if (this.inAsync && name === "await")
    { this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function"); }
  if (this.currentThisScope().inClassFieldInit && name === "arguments")
    { this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer"); }
  if (this.inClassStaticBlock && (name === "arguments" || name === "await"))
    { this.raise(start, ("Cannot use " + name + " in class static initialization block")); }
  if (this.keywords.test(name))
    { this.raise(start, ("Unexpected keyword '" + name + "'")); }
  if (this.options.ecmaVersion < 6 &&
    this.input.slice(start, end).indexOf("\\") !== -1) { return }
  var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re.test(name)) {
    if (!this.inAsync && name === "await")
      { this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function"); }
    this.raiseRecoverable(start, ("The keyword '" + name + "' is reserved"));
  }
};

// Parse the next token as an identifier. If `liberal` is true (used
// when parsing properties), it will also convert keywords into
// identifiers.

pp$5.parseIdent = function(liberal, isBinding) {
  var node = this.startNode();
  if (this.type === types$1.name) {
    node.name = this.value;
  } else if (this.type.keyword) {
    node.name = this.type.keyword;

    // To fix https://github.com/acornjs/acorn/issues/575
    // `class` and `function` keywords push new context into this.context.
    // But there is no chance to pop the context if the keyword is consumed as an identifier such as a property name.
    // If the previous token is a dot, this does not apply because the context-managing code already ignored the keyword
    if ((node.name === "class" || node.name === "function") &&
        (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
  } else {
    this.unexpected();
  }
  this.next(!!liberal);
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
    if (node.name === "await" && !this.awaitIdentPos)
      { this.awaitIdentPos = node.start; }
  }
  return node
};

pp$5.parsePrivateIdent = function() {
  var node = this.startNode();
  if (this.type === types$1.privateId) {
    node.name = this.value;
  } else {
    this.unexpected();
  }
  this.next();
  this.finishNode(node, "PrivateIdentifier");

  // For validating existence
  if (this.privateNameStack.length === 0) {
    this.raise(node.start, ("Private field '#" + (node.name) + "' must be declared in an enclosing class"));
  } else {
    this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
  }

  return node
};

// Parses yield expression inside generator.

pp$5.parseYield = function(forInit) {
  if (!this.yieldPos) { this.yieldPos = this.start; }

  var node = this.startNode();
  this.next();
  if (this.type === types$1.semi || this.canInsertSemicolon() || (this.type !== types$1.star && !this.type.startsExpr)) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types$1.star);
    node.argument = this.parseMaybeAssign(forInit);
  }
  return this.finishNode(node, "YieldExpression")
};

pp$5.parseAwait = function(forInit) {
  if (!this.awaitPos) { this.awaitPos = this.start; }

  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, true, false, forInit);
  return this.finishNode(node, "AwaitExpression")
};

var pp$4 = Parser.prototype;

// This function is used to raise exceptions on parse errors. It
// takes an offset integer (into the current `input`) to indicate
// the location of the error, attaches the position to the end
// of the error message, and then raises a `SyntaxError` with that
// message.

pp$4.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  var err = new SyntaxError(message);
  err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
  throw err
};

pp$4.raiseRecoverable = pp$4.raise;

pp$4.curPosition = function() {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart)
  }
};

var pp$3 = Parser.prototype;

var Scope = function Scope(flags) {
  this.flags = flags;
  // A list of var-declared names in the current lexical scope
  this.var = [];
  // A list of lexically-declared names in the current lexical scope
  this.lexical = [];
  // A list of lexically-declared FunctionDeclaration names in the current lexical scope
  this.functions = [];
  // A switch to disallow the identifier reference 'arguments'
  this.inClassFieldInit = false;
};

// The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.

pp$3.enterScope = function(flags) {
  this.scopeStack.push(new Scope(flags));
};

pp$3.exitScope = function() {
  this.scopeStack.pop();
};

// The spec says:
// > At the top level of a function, or script, function declarations are
// > treated like var declarations rather than like lexical declarations.
pp$3.treatFunctionsAsVarInScope = function(scope) {
  return (scope.flags & SCOPE_FUNCTION) || !this.inModule && (scope.flags & SCOPE_TOP)
};

pp$3.declareName = function(name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
    scope.lexical.push(name);
    if (this.inModule && (scope.flags & SCOPE_TOP))
      { delete this.undefinedExports[name]; }
  } else if (bindingType === BIND_SIMPLE_CATCH) {
    var scope$1 = this.currentScope();
    scope$1.lexical.push(name);
  } else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    if (this.treatFunctionsAsVar)
      { redeclared = scope$2.lexical.indexOf(name) > -1; }
    else
      { redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1; }
    scope$2.functions.push(name);
  } else {
    for (var i = this.scopeStack.length - 1; i >= 0; --i) {
      var scope$3 = this.scopeStack[i];
      if (scope$3.lexical.indexOf(name) > -1 && !((scope$3.flags & SCOPE_SIMPLE_CATCH) && scope$3.lexical[0] === name) ||
          !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
        redeclared = true;
        break
      }
      scope$3.var.push(name);
      if (this.inModule && (scope$3.flags & SCOPE_TOP))
        { delete this.undefinedExports[name]; }
      if (scope$3.flags & SCOPE_VAR) { break }
    }
  }
  if (redeclared) { this.raiseRecoverable(pos, ("Identifier '" + name + "' has already been declared")); }
};

pp$3.checkLocalExport = function(id) {
  // scope.functions must be empty as Module code is always strict.
  if (this.scopeStack[0].lexical.indexOf(id.name) === -1 &&
      this.scopeStack[0].var.indexOf(id.name) === -1) {
    this.undefinedExports[id.name] = id;
  }
};

pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1]
};

pp$3.currentVarScope = function() {
  for (var i = this.scopeStack.length - 1;; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & SCOPE_VAR) { return scope }
  }
};

// Could be useful for `this`, `new.target`, `super()`, `super.property`, and `super[property]`.
pp$3.currentThisScope = function() {
  for (var i = this.scopeStack.length - 1;; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) { return scope }
  }
};

var Node = function Node(parser, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser.options.locations)
    { this.loc = new SourceLocation(parser, loc); }
  if (parser.options.directSourceFile)
    { this.sourceFile = parser.options.directSourceFile; }
  if (parser.options.ranges)
    { this.range = [pos, 0]; }
};

// Start an AST node, attaching a start offset.

var pp$2 = Parser.prototype;

pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc)
};

pp$2.startNodeAt = function(pos, loc) {
  return new Node(this, pos, loc)
};

// Finish an AST node, adding `type` and `end` properties.

function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations)
    { node.loc.end = loc; }
  if (this.options.ranges)
    { node.range[1] = pos; }
  return node
}

pp$2.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)
};

// Finish node at given position

pp$2.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc)
};

pp$2.copyNode = function(node) {
  var newNode = new Node(this, node.start, this.startLoc);
  for (var prop in node) { newNode[prop] = node[prop]; }
  return newNode
};

// This file contains Unicode properties extracted from the ECMAScript
// specification. The lists are extracted like so:
// $$('#table-binary-unicode-properties > figure > table > tbody > tr > td:nth-child(1) code').map(el => el.innerText)

// #table-binary-unicode-properties
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
var ecma13BinaryProperties = ecma12BinaryProperties;
var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties
};

// #table-unicode-general-category-values
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";

// #table-unicode-script-values
var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues
};

var data = {};
function buildUnicodeData(ecmaVersion) {
  var d = data[ecmaVersion] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
    }
  };
  d.nonBinary.Script_Extensions = d.nonBinary.Script;

  d.nonBinary.gc = d.nonBinary.General_Category;
  d.nonBinary.sc = d.nonBinary.Script;
  d.nonBinary.scx = d.nonBinary.Script_Extensions;
}

for (var i = 0, list = [9, 10, 11, 12, 13]; i < list.length; i += 1) {
  var ecmaVersion = list[i];

  buildUnicodeData(ecmaVersion);
}

var pp$1 = Parser.prototype;

var RegExpValidationState = function RegExpValidationState(parser) {
  this.parser = parser;
  this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "");
  this.unicodeProperties = data[parser.options.ecmaVersion >= 13 ? 13 : parser.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = [];
  this.backReferenceNames = [];
};

RegExpValidationState.prototype.reset = function reset (start, pattern, flags) {
  var unicode = flags.indexOf("u") !== -1;
  this.start = start | 0;
  this.source = pattern + "";
  this.flags = flags;
  this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
  this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
};

RegExpValidationState.prototype.raise = function raise (message) {
  this.parser.raiseRecoverable(this.start, ("Invalid regular expression: /" + (this.source) + "/: " + message));
};

// If u flag is given, this returns the code point at the index (it combines a surrogate pair).
// Otherwise, this returns the code unit of the index (can be a part of a surrogate pair).
RegExpValidationState.prototype.at = function at (i, forceU) {
    if ( forceU === void 0 ) forceU = false;

  var s = this.source;
  var l = s.length;
  if (i >= l) {
    return -1
  }
  var c = s.charCodeAt(i);
  if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
    return c
  }
  var next = s.charCodeAt(i + 1);
  return next >= 0xDC00 && next <= 0xDFFF ? (c << 10) + next - 0x35FDC00 : c
};

RegExpValidationState.prototype.nextIndex = function nextIndex (i, forceU) {
    if ( forceU === void 0 ) forceU = false;

  var s = this.source;
  var l = s.length;
  if (i >= l) {
    return l
  }
  var c = s.charCodeAt(i), next;
  if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l ||
      (next = s.charCodeAt(i + 1)) < 0xDC00 || next > 0xDFFF) {
    return i + 1
  }
  return i + 2
};

RegExpValidationState.prototype.current = function current (forceU) {
    if ( forceU === void 0 ) forceU = false;

  return this.at(this.pos, forceU)
};

RegExpValidationState.prototype.lookahead = function lookahead (forceU) {
    if ( forceU === void 0 ) forceU = false;

  return this.at(this.nextIndex(this.pos, forceU), forceU)
};

RegExpValidationState.prototype.advance = function advance (forceU) {
    if ( forceU === void 0 ) forceU = false;

  this.pos = this.nextIndex(this.pos, forceU);
};

RegExpValidationState.prototype.eat = function eat (ch, forceU) {
    if ( forceU === void 0 ) forceU = false;

  if (this.current(forceU) === ch) {
    this.advance(forceU);
    return true
  }
  return false
};

/**
 * Validate the flags part of a given RegExpLiteral.
 *
 * @param {RegExpValidationState} state The state to validate RegExp.
 * @returns {void}
 */
pp$1.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags;
  var flags = state.flags;

  for (var i = 0; i < flags.length; i++) {
    var flag = flags.charAt(i);
    if (validFlags.indexOf(flag) === -1) {
      this.raise(state.start, "Invalid regular expression flag");
    }
    if (flags.indexOf(flag, i + 1) > -1) {
      this.raise(state.start, "Duplicate regular expression flag");
    }
  }
};

/**
 * Validate the pattern part of a given RegExpLiteral.
 *
 * @param {RegExpValidationState} state The state to validate RegExp.
 * @returns {void}
 */
pp$1.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);

  // The goal symbol for the parse is |Pattern[~U, ~N]|. If the result of
  // parsing contains a |GroupName|, reparse with the goal symbol
  // |Pattern[~U, +N]| and use this result instead. Throw a *SyntaxError*
  // exception if _P_ did not conform to the grammar, if any elements of _P_
  // were not matched by the parse, or if any Early Error conditions exist.
  if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Pattern
pp$1.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames.length = 0;
  state.backReferenceNames.length = 0;

  this.regexp_disjunction(state);

  if (state.pos !== state.source.length) {
    // Make the same messages as V8.
    if (state.eat(0x29 /* ) */)) {
      state.raise("Unmatched ')'");
    }
    if (state.eat(0x5D /* ] */) || state.eat(0x7D /* } */)) {
      state.raise("Lone quantifier brackets");
    }
  }
  if (state.maxBackReference > state.numCapturingParens) {
    state.raise("Invalid escape");
  }
  for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
    var name = list[i];

    if (state.groupNames.indexOf(name) === -1) {
      state.raise("Invalid named capture referenced");
    }
  }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Disjunction
pp$1.regexp_disjunction = function(state) {
  this.regexp_alternative(state);
  while (state.eat(0x7C /* | */)) {
    this.regexp_alternative(state);
  }

  // Make the same message as V8.
  if (this.regexp_eatQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  if (state.eat(0x7B /* { */)) {
    state.raise("Lone quantifier brackets");
  }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Alternative
pp$1.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state))
    { }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Term
pp$1.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    // Handle `QuantifiableAssertion Quantifier` alternative.
    // `state.lastAssertionIsQuantifiable` is true if the last eaten Assertion
    // is a QuantifiableAssertion.
    if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
      // Make the same message as V8.
      if (state.switchU) {
        state.raise("Invalid quantifier");
      }
    }
    return true
  }

  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true
  }

  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Assertion
pp$1.regexp_eatAssertion = function(state) {
  var start = state.pos;
  state.lastAssertionIsQuantifiable = false;

  // ^, $
  if (state.eat(0x5E /* ^ */) || state.eat(0x24 /* $ */)) {
    return true
  }

  // \b \B
  if (state.eat(0x5C /* \ */)) {
    if (state.eat(0x42 /* B */) || state.eat(0x62 /* b */)) {
      return true
    }
    state.pos = start;
  }

  // Lookahead / Lookbehind
  if (state.eat(0x28 /* ( */) && state.eat(0x3F /* ? */)) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) {
      lookbehind = state.eat(0x3C /* < */);
    }
    if (state.eat(0x3D /* = */) || state.eat(0x21 /* ! */)) {
      this.regexp_disjunction(state);
      if (!state.eat(0x29 /* ) */)) {
        state.raise("Unterminated group");
      }
      state.lastAssertionIsQuantifiable = !lookbehind;
      return true
    }
  }

  state.pos = start;
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Quantifier
pp$1.regexp_eatQuantifier = function(state, noError) {
  if ( noError === void 0 ) noError = false;

  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(0x3F /* ? */);
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-QuantifierPrefix
pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
  return (
    state.eat(0x2A /* * */) ||
    state.eat(0x2B /* + */) ||
    state.eat(0x3F /* ? */) ||
    this.regexp_eatBracedQuantifier(state, noError)
  )
};
pp$1.regexp_eatBracedQuantifier = function(state, noError) {
  var start = state.pos;
  if (state.eat(0x7B /* { */)) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(0x2C /* , */) && this.regexp_eatDecimalDigits(state)) {
        max = state.lastIntValue;
      }
      if (state.eat(0x7D /* } */)) {
        // SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-term
        if (max !== -1 && max < min && !noError) {
          state.raise("numbers out of order in {} quantifier");
        }
        return true
      }
    }
    if (state.switchU && !noError) {
      state.raise("Incomplete quantifier");
    }
    state.pos = start;
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Atom
pp$1.regexp_eatAtom = function(state) {
  return (
    this.regexp_eatPatternCharacters(state) ||
    state.eat(0x2E /* . */) ||
    this.regexp_eatReverseSolidusAtomEscape(state) ||
    this.regexp_eatCharacterClass(state) ||
    this.regexp_eatUncapturingGroup(state) ||
    this.regexp_eatCapturingGroup(state)
  )
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start = state.pos;
  if (state.eat(0x5C /* \ */)) {
    if (this.regexp_eatAtomEscape(state)) {
      return true
    }
    state.pos = start;
  }
  return false
};
pp$1.regexp_eatUncapturingGroup = function(state) {
  var start = state.pos;
  if (state.eat(0x28 /* ( */)) {
    if (state.eat(0x3F /* ? */) && state.eat(0x3A /* : */)) {
      this.regexp_disjunction(state);
      if (state.eat(0x29 /* ) */)) {
        return true
      }
      state.raise("Unterminated group");
    }
    state.pos = start;
  }
  return false
};
pp$1.regexp_eatCapturingGroup = function(state) {
  if (state.eat(0x28 /* ( */)) {
    if (this.options.ecmaVersion >= 9) {
      this.regexp_groupSpecifier(state);
    } else if (state.current() === 0x3F /* ? */) {
      state.raise("Invalid group");
    }
    this.regexp_disjunction(state);
    if (state.eat(0x29 /* ) */)) {
      state.numCapturingParens += 1;
      return true
    }
    state.raise("Unterminated group");
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedAtom
pp$1.regexp_eatExtendedAtom = function(state) {
  return (
    state.eat(0x2E /* . */) ||
    this.regexp_eatReverseSolidusAtomEscape(state) ||
    this.regexp_eatCharacterClass(state) ||
    this.regexp_eatUncapturingGroup(state) ||
    this.regexp_eatCapturingGroup(state) ||
    this.regexp_eatInvalidBracedQuantifier(state) ||
    this.regexp_eatExtendedPatternCharacter(state)
  )
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-InvalidBracedQuantifier
pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
  if (this.regexp_eatBracedQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-SyntaxCharacter
pp$1.regexp_eatSyntaxCharacter = function(state) {
  var ch = state.current();
  if (isSyntaxCharacter(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true
  }
  return false
};
function isSyntaxCharacter(ch) {
  return (
    ch === 0x24 /* $ */ ||
    ch >= 0x28 /* ( */ && ch <= 0x2B /* + */ ||
    ch === 0x2E /* . */ ||
    ch === 0x3F /* ? */ ||
    ch >= 0x5B /* [ */ && ch <= 0x5E /* ^ */ ||
    ch >= 0x7B /* { */ && ch <= 0x7D /* } */
  )
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-PatternCharacter
// But eat eager.
pp$1.regexp_eatPatternCharacters = function(state) {
  var start = state.pos;
  var ch = 0;
  while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
    state.advance();
  }
  return state.pos !== start
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedPatternCharacter
pp$1.regexp_eatExtendedPatternCharacter = function(state) {
  var ch = state.current();
  if (
    ch !== -1 &&
    ch !== 0x24 /* $ */ &&
    !(ch >= 0x28 /* ( */ && ch <= 0x2B /* + */) &&
    ch !== 0x2E /* . */ &&
    ch !== 0x3F /* ? */ &&
    ch !== 0x5B /* [ */ &&
    ch !== 0x5E /* ^ */ &&
    ch !== 0x7C /* | */
  ) {
    state.advance();
    return true
  }
  return false
};

// GroupSpecifier ::
//   [empty]
//   `?` GroupName
pp$1.regexp_groupSpecifier = function(state) {
  if (state.eat(0x3F /* ? */)) {
    if (this.regexp_eatGroupName(state)) {
      if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
        state.raise("Duplicate capture group name");
      }
      state.groupNames.push(state.lastStringValue);
      return
    }
    state.raise("Invalid group");
  }
};

// GroupName ::
//   `<` RegExpIdentifierName `>`
// Note: this updates `state.lastStringValue` property with the eaten name.
pp$1.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(0x3C /* < */)) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E /* > */)) {
      return true
    }
    state.raise("Invalid capture group name");
  }
  return false
};

// RegExpIdentifierName ::
//   RegExpIdentifierStart
//   RegExpIdentifierName RegExpIdentifierPart
// Note: this updates `state.lastStringValue` property with the eaten name.
pp$1.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
    }
    return true
  }
  return false
};

// RegExpIdentifierStart ::
//   UnicodeIDStart
//   `$`
//   `_`
//   `\` RegExpUnicodeEscapeSequence[+U]
pp$1.regexp_eatRegExpIdentifierStart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);

  if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierStart(ch)) {
    state.lastIntValue = ch;
    return true
  }

  state.pos = start;
  return false
};
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */
}

// RegExpIdentifierPart ::
//   UnicodeIDContinue
//   `$`
//   `_`
//   `\` RegExpUnicodeEscapeSequence[+U]
//   <ZWNJ>
//   <ZWJ>
pp$1.regexp_eatRegExpIdentifierPart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);

  if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierPart(ch)) {
    state.lastIntValue = ch;
    return true
  }

  state.pos = start;
  return false
};
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */ || ch === 0x200C /* <ZWNJ> */ || ch === 0x200D /* <ZWJ> */
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-AtomEscape
pp$1.regexp_eatAtomEscape = function(state) {
  if (
    this.regexp_eatBackReference(state) ||
    this.regexp_eatCharacterClassEscape(state) ||
    this.regexp_eatCharacterEscape(state) ||
    (state.switchN && this.regexp_eatKGroupName(state))
  ) {
    return true
  }
  if (state.switchU) {
    // Make the same message as V8.
    if (state.current() === 0x63 /* c */) {
      state.raise("Invalid unicode escape");
    }
    state.raise("Invalid escape");
  }
  return false
};
pp$1.regexp_eatBackReference = function(state) {
  var start = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n = state.lastIntValue;
    if (state.switchU) {
      // For SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-atomescape
      if (n > state.maxBackReference) {
        state.maxBackReference = n;
      }
      return true
    }
    if (n <= state.numCapturingParens) {
      return true
    }
    state.pos = start;
  }
  return false
};
pp$1.regexp_eatKGroupName = function(state) {
  if (state.eat(0x6B /* k */)) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true
    }
    state.raise("Invalid named reference");
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-CharacterEscape
pp$1.regexp_eatCharacterEscape = function(state) {
  return (
    this.regexp_eatControlEscape(state) ||
    this.regexp_eatCControlLetter(state) ||
    this.regexp_eatZero(state) ||
    this.regexp_eatHexEscapeSequence(state) ||
    this.regexp_eatRegExpUnicodeEscapeSequence(state, false) ||
    (!state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state)) ||
    this.regexp_eatIdentityEscape(state)
  )
};
pp$1.regexp_eatCControlLetter = function(state) {
  var start = state.pos;
  if (state.eat(0x63 /* c */)) {
    if (this.regexp_eatControlLetter(state)) {
      return true
    }
    state.pos = start;
  }
  return false
};
pp$1.regexp_eatZero = function(state) {
  if (state.current() === 0x30 /* 0 */ && !isDecimalDigit(state.lookahead())) {
    state.lastIntValue = 0;
    state.advance();
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-ControlEscape
pp$1.regexp_eatControlEscape = function(state) {
  var ch = state.current();
  if (ch === 0x74 /* t */) {
    state.lastIntValue = 0x09; /* \t */
    state.advance();
    return true
  }
  if (ch === 0x6E /* n */) {
    state.lastIntValue = 0x0A; /* \n */
    state.advance();
    return true
  }
  if (ch === 0x76 /* v */) {
    state.lastIntValue = 0x0B; /* \v */
    state.advance();
    return true
  }
  if (ch === 0x66 /* f */) {
    state.lastIntValue = 0x0C; /* \f */
    state.advance();
    return true
  }
  if (ch === 0x72 /* r */) {
    state.lastIntValue = 0x0D; /* \r */
    state.advance();
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-ControlLetter
pp$1.regexp_eatControlLetter = function(state) {
  var ch = state.current();
  if (isControlLetter(ch)) {
    state.lastIntValue = ch % 0x20;
    state.advance();
    return true
  }
  return false
};
function isControlLetter(ch) {
  return (
    (ch >= 0x41 /* A */ && ch <= 0x5A /* Z */) ||
    (ch >= 0x61 /* a */ && ch <= 0x7A /* z */)
  )
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-RegExpUnicodeEscapeSequence
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if ( forceU === void 0 ) forceU = false;

  var start = state.pos;
  var switchU = forceU || state.switchU;

  if (state.eat(0x75 /* u */)) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 0xD800 && lead <= 0xDBFF) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(0x5C /* \ */) && state.eat(0x75 /* u */) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 0xDC00 && trail <= 0xDFFF) {
            state.lastIntValue = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
            return true
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true
    }
    if (
      switchU &&
      state.eat(0x7B /* { */) &&
      this.regexp_eatHexDigits(state) &&
      state.eat(0x7D /* } */) &&
      isValidUnicode(state.lastIntValue)
    ) {
      return true
    }
    if (switchU) {
      state.raise("Invalid unicode escape");
    }
    state.pos = start;
  }

  return false
};
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 0x10FFFF
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-IdentityEscape
pp$1.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) {
      return true
    }
    if (state.eat(0x2F /* / */)) {
      state.lastIntValue = 0x2F; /* / */
      return true
    }
    return false
  }

  var ch = state.current();
  if (ch !== 0x63 /* c */ && (!state.switchN || ch !== 0x6B /* k */)) {
    state.lastIntValue = ch;
    state.advance();
    return true
  }

  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape
pp$1.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch = state.current();
  if (ch >= 0x31 /* 1 */ && ch <= 0x39 /* 9 */) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
      state.advance();
    } while ((ch = state.current()) >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */)
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClassEscape
pp$1.regexp_eatCharacterClassEscape = function(state) {
  var ch = state.current();

  if (isCharacterClassEscape(ch)) {
    state.lastIntValue = -1;
    state.advance();
    return true
  }

  if (
    state.switchU &&
    this.options.ecmaVersion >= 9 &&
    (ch === 0x50 /* P */ || ch === 0x70 /* p */)
  ) {
    state.lastIntValue = -1;
    state.advance();
    if (
      state.eat(0x7B /* { */) &&
      this.regexp_eatUnicodePropertyValueExpression(state) &&
      state.eat(0x7D /* } */)
    ) {
      return true
    }
    state.raise("Invalid property name");
  }

  return false
};
function isCharacterClassEscape(ch) {
  return (
    ch === 0x64 /* d */ ||
    ch === 0x44 /* D */ ||
    ch === 0x73 /* s */ ||
    ch === 0x53 /* S */ ||
    ch === 0x77 /* w */ ||
    ch === 0x57 /* W */
  )
}

// UnicodePropertyValueExpression ::
//   UnicodePropertyName `=` UnicodePropertyValue
//   LoneUnicodePropertyNameOrValue
pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start = state.pos;

  // UnicodePropertyName `=` UnicodePropertyValue
  if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D /* = */)) {
    var name = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
      return true
    }
  }
  state.pos = start;

  // LoneUnicodePropertyNameOrValue
  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
    return true
  }
  return false
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
  if (!hasOwn(state.unicodeProperties.nonBinary, name))
    { state.raise("Invalid property name"); }
  if (!state.unicodeProperties.nonBinary[name].test(value))
    { state.raise("Invalid property value"); }
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (!state.unicodeProperties.binary.test(nameOrValue))
    { state.raise("Invalid property name"); }
};

// UnicodePropertyName ::
//   UnicodePropertyNameCharacters
pp$1.regexp_eatUnicodePropertyName = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== ""
};
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 0x5F /* _ */
}

// UnicodePropertyValue ::
//   UnicodePropertyValueCharacters
pp$1.regexp_eatUnicodePropertyValue = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== ""
};
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch)
}

// LoneUnicodePropertyNameOrValue ::
//   UnicodePropertyValueCharacters
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state)
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClass
pp$1.regexp_eatCharacterClass = function(state) {
  if (state.eat(0x5B /* [ */)) {
    state.eat(0x5E /* ^ */);
    this.regexp_classRanges(state);
    if (state.eat(0x5D /* ] */)) {
      return true
    }
    // Unreachable since it threw "unterminated regular expression" error before.
    state.raise("Unterminated character class");
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-ClassRanges
// https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRanges
// https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRangesNoDash
pp$1.regexp_classRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(0x2D /* - */) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      if (state.switchU && (left === -1 || right === -1)) {
        state.raise("Invalid character class");
      }
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
    }
  }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom
// https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash
pp$1.regexp_eatClassAtom = function(state) {
  var start = state.pos;

  if (state.eat(0x5C /* \ */)) {
    if (this.regexp_eatClassEscape(state)) {
      return true
    }
    if (state.switchU) {
      // Make the same message as V8.
      var ch$1 = state.current();
      if (ch$1 === 0x63 /* c */ || isOctalDigit(ch$1)) {
        state.raise("Invalid class escape");
      }
      state.raise("Invalid escape");
    }
    state.pos = start;
  }

  var ch = state.current();
  if (ch !== 0x5D /* ] */) {
    state.lastIntValue = ch;
    state.advance();
    return true
  }

  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassEscape
pp$1.regexp_eatClassEscape = function(state) {
  var start = state.pos;

  if (state.eat(0x62 /* b */)) {
    state.lastIntValue = 0x08; /* <BS> */
    return true
  }

  if (state.switchU && state.eat(0x2D /* - */)) {
    state.lastIntValue = 0x2D; /* - */
    return true
  }

  if (!state.switchU && state.eat(0x63 /* c */)) {
    if (this.regexp_eatClassControlLetter(state)) {
      return true
    }
    state.pos = start;
  }

  return (
    this.regexp_eatCharacterClassEscape(state) ||
    this.regexp_eatCharacterEscape(state)
  )
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassControlLetter
pp$1.regexp_eatClassControlLetter = function(state) {
  var ch = state.current();
  if (isDecimalDigit(ch) || ch === 0x5F /* _ */) {
    state.lastIntValue = ch % 0x20;
    state.advance();
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
pp$1.regexp_eatHexEscapeSequence = function(state) {
  var start = state.pos;
  if (state.eat(0x78 /* x */)) {
    if (this.regexp_eatFixedHexDigits(state, 2)) {
      return true
    }
    if (state.switchU) {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalDigits
pp$1.regexp_eatDecimalDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit(ch = state.current())) {
    state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
    state.advance();
  }
  return state.pos !== start
};
function isDecimalDigit(ch) {
  return ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigits
pp$1.regexp_eatHexDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isHexDigit(ch = state.current())) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return state.pos !== start
};
function isHexDigit(ch) {
  return (
    (ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */) ||
    (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) ||
    (ch >= 0x61 /* a */ && ch <= 0x66 /* f */)
  )
}
function hexToInt(ch) {
  if (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) {
    return 10 + (ch - 0x41 /* A */)
  }
  if (ch >= 0x61 /* a */ && ch <= 0x66 /* f */) {
    return 10 + (ch - 0x61 /* a */)
  }
  return ch - 0x30 /* 0 */
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-LegacyOctalEscapeSequence
// Allows only 0-377(octal) i.e. 0-255(decimal).
pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
        state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
      } else {
        state.lastIntValue = n1 * 8 + n2;
      }
    } else {
      state.lastIntValue = n1;
    }
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-OctalDigit
pp$1.regexp_eatOctalDigit = function(state) {
  var ch = state.current();
  if (isOctalDigit(ch)) {
    state.lastIntValue = ch - 0x30; /* 0 */
    state.advance();
    return true
  }
  state.lastIntValue = 0;
  return false
};
function isOctalDigit(ch) {
  return ch >= 0x30 /* 0 */ && ch <= 0x37 /* 7 */
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-Hex4Digits
// https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigit
// And HexDigit HexDigit in https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
pp$1.regexp_eatFixedHexDigits = function(state, length) {
  var start = state.pos;
  state.lastIntValue = 0;
  for (var i = 0; i < length; ++i) {
    var ch = state.current();
    if (!isHexDigit(ch)) {
      state.pos = start;
      return false
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return true
};

// Object type used to represent tokens. Note that normally, tokens
// simply exist as properties on the parser object. This is only
// used for the onToken callback and the external tokenizer.

var Token = function Token(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations)
    { this.loc = new SourceLocation(p, p.startLoc, p.endLoc); }
  if (p.options.ranges)
    { this.range = [p.start, p.end]; }
};

// ## Tokenizer

var pp = Parser.prototype;

// Move to the next token

pp.next = function(ignoreEscapeSequenceInKeyword) {
  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc)
    { this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword); }
  if (this.options.onToken)
    { this.options.onToken(new Token(this)); }

  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};

pp.getToken = function() {
  this.next();
  return new Token(this)
};

// If we're in an ES6 environment, make parsers iterable
if (typeof Symbol !== "undefined")
  { pp[Symbol.iterator] = function() {
    var this$1$1 = this;

    return {
      next: function () {
        var token = this$1$1.getToken();
        return {
          done: token.type === types$1.eof,
          value: token
        }
      }
    }
  }; }

// Toggle strict mode. Re-reads the next number or string to please
// pedantic tests (`"use strict"; 010;` should fail).

// Read a single token, updating the parser object's token-related
// properties.

pp.nextToken = function() {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) { this.skipSpace(); }

  this.start = this.pos;
  if (this.options.locations) { this.startLoc = this.curPosition(); }
  if (this.pos >= this.input.length) { return this.finishToken(types$1.eof) }

  if (curContext.override) { return curContext.override(this) }
  else { this.readToken(this.fullCharCodeAtPos()); }
};

pp.readToken = function(code) {
  // Identifier or keyword. '\uXXXX' sequences are allowed in
  // identifiers, so '\' also dispatches to that.
  if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */)
    { return this.readWord() }

  return this.getTokenFromCode(code)
};

pp.fullCharCodeAtPos = function() {
  var code = this.input.charCodeAt(this.pos);
  if (code <= 0xd7ff || code >= 0xdc00) { return code }
  var next = this.input.charCodeAt(this.pos + 1);
  return next <= 0xdbff || next >= 0xe000 ? code : (code << 10) + next - 0x35fdc00
};

pp.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition();
  var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) { this.raise(this.pos - 2, "Unterminated comment"); }
  this.pos = end + 2;
  if (this.options.locations) {
    for (var nextBreak = (void 0), pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1;) {
      ++this.curLine;
      pos = this.lineStart = nextBreak;
    }
  }
  if (this.options.onComment)
    { this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                           startLoc, this.curPosition()); }
};

pp.skipLineComment = function(startSkip) {
  var start = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch)) {
    ch = this.input.charCodeAt(++this.pos);
  }
  if (this.options.onComment)
    { this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos,
                           startLoc, this.curPosition()); }
};

// Called at the start of the parse and after every token. Skips
// whitespace and comments, and.

pp.skipSpace = function() {
  loop: while (this.pos < this.input.length) {
    var ch = this.input.charCodeAt(this.pos);
    switch (ch) {
    case 32: case 160: // ' '
      ++this.pos;
      break
    case 13:
      if (this.input.charCodeAt(this.pos + 1) === 10) {
        ++this.pos;
      }
    case 10: case 8232: case 8233:
      ++this.pos;
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      break
    case 47: // '/'
      switch (this.input.charCodeAt(this.pos + 1)) {
      case 42: // '*'
        this.skipBlockComment();
        break
      case 47:
        this.skipLineComment(2);
        break
      default:
        break loop
      }
      break
    default:
      if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
        ++this.pos;
      } else {
        break loop
      }
    }
  }
};

// Called at the end of every token. Sets `end`, `val`, and
// maintains `context` and `exprAllowed`, and skips the space after
// the token, so that the next one's `start` will point at the
// right position.

pp.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) { this.endLoc = this.curPosition(); }
  var prevType = this.type;
  this.type = type;
  this.value = val;

  this.updateContext(prevType);
};

// ### Token reading

// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.
//
pp.readToken_dot = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next >= 48 && next <= 57) { return this.readNumber(true) }
  var next2 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
    this.pos += 3;
    return this.finishToken(types$1.ellipsis)
  } else {
    ++this.pos;
    return this.finishToken(types$1.dot)
  }
};

pp.readToken_slash = function() { // '/'
  var next = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) { ++this.pos; return this.readRegexp() }
  if (next === 61) { return this.finishOp(types$1.assign, 2) }
  return this.finishOp(types$1.slash, 1)
};

pp.readToken_mult_modulo_exp = function(code) { // '%*'
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code === 42 ? types$1.star : types$1.modulo;

  // exponentiation operator ** and **=
  if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
    ++size;
    tokentype = types$1.starstar;
    next = this.input.charCodeAt(this.pos + 2);
  }

  if (next === 61) { return this.finishOp(types$1.assign, size + 1) }
  return this.finishOp(tokentype, size)
};

pp.readToken_pipe_amp = function(code) { // '|&'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (this.options.ecmaVersion >= 12) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 === 61) { return this.finishOp(types$1.assign, 3) }
    }
    return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2)
  }
  if (next === 61) { return this.finishOp(types$1.assign, 2) }
  return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1)
};

pp.readToken_caret = function() { // '^'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) { return this.finishOp(types$1.assign, 2) }
  return this.finishOp(types$1.bitwiseXOR, 1)
};

pp.readToken_plus_min = function(code) { // '+-'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 &&
        (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      // A `-->` line comment
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken()
    }
    return this.finishOp(types$1.incDec, 2)
  }
  if (next === 61) { return this.finishOp(types$1.assign, 2) }
  return this.finishOp(types$1.plusMin, 1)
};

pp.readToken_lt_gt = function(code) { // '<>'
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next === code) {
    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) { return this.finishOp(types$1.assign, size + 1) }
    return this.finishOp(types$1.bitShift, size)
  }
  if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 &&
      this.input.charCodeAt(this.pos + 3) === 45) {
    // `<!--`, an XML-style comment that should be interpreted as a line comment
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken()
  }
  if (next === 61) { size = 2; }
  return this.finishOp(types$1.relational, size)
};

pp.readToken_eq_excl = function(code) { // '=!'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) { return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) }
  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { // '=>'
    this.pos += 2;
    return this.finishToken(types$1.arrow)
  }
  return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1)
};

pp.readToken_question = function() { // '?'
  var ecmaVersion = this.options.ecmaVersion;
  if (ecmaVersion >= 11) {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 46) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 < 48 || next2 > 57) { return this.finishOp(types$1.questionDot, 2) }
    }
    if (next === 63) {
      if (ecmaVersion >= 12) {
        var next2$1 = this.input.charCodeAt(this.pos + 2);
        if (next2$1 === 61) { return this.finishOp(types$1.assign, 3) }
      }
      return this.finishOp(types$1.coalesce, 2)
    }
  }
  return this.finishOp(types$1.question, 1)
};

pp.readToken_numberSign = function() { // '#'
  var ecmaVersion = this.options.ecmaVersion;
  var code = 35; // '#'
  if (ecmaVersion >= 13) {
    ++this.pos;
    code = this.fullCharCodeAtPos();
    if (isIdentifierStart(code, true) || code === 92 /* '\' */) {
      return this.finishToken(types$1.privateId, this.readWord1())
    }
  }

  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};

pp.getTokenFromCode = function(code) {
  switch (code) {
  // The interpretation of a dot depends on whether it is followed
  // by a digit or another two dots.
  case 46: // '.'
    return this.readToken_dot()

  // Punctuation tokens.
  case 40: ++this.pos; return this.finishToken(types$1.parenL)
  case 41: ++this.pos; return this.finishToken(types$1.parenR)
  case 59: ++this.pos; return this.finishToken(types$1.semi)
  case 44: ++this.pos; return this.finishToken(types$1.comma)
  case 91: ++this.pos; return this.finishToken(types$1.bracketL)
  case 93: ++this.pos; return this.finishToken(types$1.bracketR)
  case 123: ++this.pos; return this.finishToken(types$1.braceL)
  case 125: ++this.pos; return this.finishToken(types$1.braceR)
  case 58: ++this.pos; return this.finishToken(types$1.colon)

  case 96: // '`'
    if (this.options.ecmaVersion < 6) { break }
    ++this.pos;
    return this.finishToken(types$1.backQuote)

  case 48: // '0'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 120 || next === 88) { return this.readRadixNumber(16) } // '0x', '0X' - hex number
    if (this.options.ecmaVersion >= 6) {
      if (next === 111 || next === 79) { return this.readRadixNumber(8) } // '0o', '0O' - octal number
      if (next === 98 || next === 66) { return this.readRadixNumber(2) } // '0b', '0B' - binary number
    }

  // Anything else beginning with a digit is an integer, octal
  // number, or float.
  case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
    return this.readNumber(false)

  // Quotes produce strings.
  case 34: case 39: // '"', "'"
    return this.readString(code)

  // Operators are parsed inline in tiny state machines. '=' (61) is
  // often referred to. `finishOp` simply skips the amount of
  // characters it is given as second argument, and returns a token
  // of the type given by its first argument.
  case 47: // '/'
    return this.readToken_slash()

  case 37: case 42: // '%*'
    return this.readToken_mult_modulo_exp(code)

  case 124: case 38: // '|&'
    return this.readToken_pipe_amp(code)

  case 94: // '^'
    return this.readToken_caret()

  case 43: case 45: // '+-'
    return this.readToken_plus_min(code)

  case 60: case 62: // '<>'
    return this.readToken_lt_gt(code)

  case 61: case 33: // '=!'
    return this.readToken_eq_excl(code)

  case 63: // '?'
    return this.readToken_question()

  case 126: // '~'
    return this.finishOp(types$1.prefix, 1)

  case 35: // '#'
    return this.readToken_numberSign()
  }

  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};

pp.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str)
};

pp.readRegexp = function() {
  var escaped, inClass, start = this.pos;
  for (;;) {
    if (this.pos >= this.input.length) { this.raise(start, "Unterminated regular expression"); }
    var ch = this.input.charAt(this.pos);
    if (lineBreak.test(ch)) { this.raise(start, "Unterminated regular expression"); }
    if (!escaped) {
      if (ch === "[") { inClass = true; }
      else if (ch === "]" && inClass) { inClass = false; }
      else if (ch === "/" && !inClass) { break }
      escaped = ch === "\\";
    } else { escaped = false; }
    ++this.pos;
  }
  var pattern = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var flags = this.readWord1();
  if (this.containsEsc) { this.unexpected(flagsStart); }

  // Validate pattern
  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);

  // Create Literal#value property value.
  var value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch (e) {
    // ESTree requires null if it failed to instantiate RegExp object.
    // https://github.com/estree/estree/blob/a27003adf4fd7bfad44de9cef372a2eacd527b1c/es5.md#regexpliteral
  }

  return this.finishToken(types$1.regexp, {pattern: pattern, flags: flags, value: value})
};

// Read an integer in the given radix. Return null if zero digits
// were read, the integer value otherwise. When `len` is given, this
// will return `null` unless the integer has exactly `len` digits.

pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  // `len` is used for character escape sequences. In that case, disallow separators.
  var allowSeparators = this.options.ecmaVersion >= 12 && len === undefined;

  // `maybeLegacyOctalNumericLiteral` is true if it doesn't have prefix (0x,0o,0b)
  // and isn't fraction part nor exponent part. In that case, if the first digit
  // is zero then disallow separators.
  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;

  var start = this.pos, total = 0, lastCode = 0;
  for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
    var code = this.input.charCodeAt(this.pos), val = (void 0);

    if (allowSeparators && code === 95) {
      if (isLegacyOctalNumericLiteral) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"); }
      if (lastCode === 95) { this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"); }
      if (i === 0) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"); }
      lastCode = code;
      continue
    }

    if (code >= 97) { val = code - 97 + 10; } // a
    else if (code >= 65) { val = code - 65 + 10; } // A
    else if (code >= 48 && code <= 57) { val = code - 48; } // 0-9
    else { val = Infinity; }
    if (val >= radix) { break }
    lastCode = code;
    total = total * radix + val;
  }

  if (allowSeparators && lastCode === 95) { this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"); }
  if (this.pos === start || len != null && this.pos - start !== len) { return null }

  return total
};

function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8)
  }

  // `parseFloat(value)` stops parsing at the first numeric separator then returns a wrong value.
  return parseFloat(str.replace(/_/g, ""))
}

function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null
  }

  // `BigInt(value)` throws syntax error if the string contains numeric separators.
  return BigInt(str.replace(/_/g, ""))
}

pp.readRadixNumber = function(radix) {
  var start = this.pos;
  this.pos += 2; // 0x
  var val = this.readInt(radix);
  if (val == null) { this.raise(this.start + 2, "Expected number in radix " + radix); }
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
  } else if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
  return this.finishToken(types$1.num, val)
};

// Read an integer, octal integer, or floating-point number.

pp.readNumber = function(startsWithDot) {
  var start = this.pos;
  if (!startsWithDot && this.readInt(10, undefined, true) === null) { this.raise(start, "Invalid number"); }
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  if (octal && this.strict) { this.raise(start, "Invalid number"); }
  var next = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
    if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
    return this.finishToken(types$1.num, val$1)
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) { octal = false; }
  if (next === 46 && !octal) { // '.'
    ++this.pos;
    this.readInt(10);
    next = this.input.charCodeAt(this.pos);
  }
  if ((next === 69 || next === 101) && !octal) { // 'eE'
    next = this.input.charCodeAt(++this.pos);
    if (next === 43 || next === 45) { ++this.pos; } // '+-'
    if (this.readInt(10) === null) { this.raise(start, "Invalid number"); }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }

  var val = stringToNumber(this.input.slice(start, this.pos), octal);
  return this.finishToken(types$1.num, val)
};

// Read a string value, interpreting backslash-escapes.

pp.readCodePoint = function() {
  var ch = this.input.charCodeAt(this.pos), code;

  if (ch === 123) { // '{'
    if (this.options.ecmaVersion < 6) { this.unexpected(); }
    var codePos = ++this.pos;
    code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code > 0x10FFFF) { this.invalidStringToken(codePos, "Code point out of bounds"); }
  } else {
    code = this.readHexChar(4);
  }
  return code
};

pp.readString = function(quote) {
  var out = "", chunkStart = ++this.pos;
  for (;;) {
    if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated string constant"); }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === quote) { break }
    if (ch === 92) { // '\'
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else if (ch === 0x2028 || ch === 0x2029) {
      if (this.options.ecmaVersion < 10) { this.raise(this.start, "Unterminated string constant"); }
      ++this.pos;
      if (this.options.locations) {
        this.curLine++;
        this.lineStart = this.pos;
      }
    } else {
      if (isNewLine(ch)) { this.raise(this.start, "Unterminated string constant"); }
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types$1.string, out)
};

// Reads template string tokens.

var INVALID_TEMPLATE_ESCAPE_ERROR = {};

pp.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err
    }
  }

  this.inTemplateElement = false;
};

pp.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR
  } else {
    this.raise(position, message);
  }
};

pp.readTmplToken = function() {
  var out = "", chunkStart = this.pos;
  for (;;) {
    if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated template"); }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) { // '`', '${'
      if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
        if (ch === 36) {
          this.pos += 2;
          return this.finishToken(types$1.dollarBraceL)
        } else {
          ++this.pos;
          return this.finishToken(types$1.backQuote)
        }
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types$1.template, out)
    }
    if (ch === 92) { // '\'
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch) {
      case 13:
        if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; }
      case 10:
        out += "\n";
        break
      default:
        out += String.fromCharCode(ch);
        break
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else {
      ++this.pos;
    }
  }
};

// Reads a template token to search for the end, without validating any escape sequences
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++) {
    switch (this.input[this.pos]) {
    case "\\":
      ++this.pos;
      break

    case "$":
      if (this.input[this.pos + 1] !== "{") {
        break
      }

    // falls through
    case "`":
      return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos))

    // no default
    }
  }
  this.raise(this.start, "Unterminated template");
};

// Used to read escaped characters

pp.readEscapedChar = function(inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
  case 110: return "\n" // 'n' -> '\n'
  case 114: return "\r" // 'r' -> '\r'
  case 120: return String.fromCharCode(this.readHexChar(2)) // 'x'
  case 117: return codePointToString(this.readCodePoint()) // 'u'
  case 116: return "\t" // 't' -> '\t'
  case 98: return "\b" // 'b' -> '\b'
  case 118: return "\u000b" // 'v' -> '\u000b'
  case 102: return "\f" // 'f' -> '\f'
  case 13: if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; } // '\r\n'
  case 10: // ' \n'
    if (this.options.locations) { this.lineStart = this.pos; ++this.curLine; }
    return ""
  case 56:
  case 57:
    if (this.strict) {
      this.invalidStringToken(
        this.pos - 1,
        "Invalid escape sequence"
      );
    }
    if (inTemplate) {
      var codePos = this.pos - 1;

      this.invalidStringToken(
        codePos,
        "Invalid escape sequence in template string"
      );

      return null
    }
  default:
    if (ch >= 48 && ch <= 55) {
      var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
      var octal = parseInt(octalStr, 8);
      if (octal > 255) {
        octalStr = octalStr.slice(0, -1);
        octal = parseInt(octalStr, 8);
      }
      this.pos += octalStr.length - 1;
      ch = this.input.charCodeAt(this.pos);
      if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
        this.invalidStringToken(
          this.pos - 1 - octalStr.length,
          inTemplate
            ? "Octal literal in template string"
            : "Octal literal in strict mode"
        );
      }
      return String.fromCharCode(octal)
    }
    if (isNewLine(ch)) {
      // Unicode new line characters after \ get removed from output in both
      // template literals and strings
      return ""
    }
    return String.fromCharCode(ch)
  }
};

// Used to read character escape sequences ('\x', '\u', '\U').

pp.readHexChar = function(len) {
  var codePos = this.pos;
  var n = this.readInt(16, len);
  if (n === null) { this.invalidStringToken(codePos, "Bad character escape sequence"); }
  return n
};

// Read an identifier, and return it as a string. Sets `this.containsEsc`
// to whether the word contained a '\u' escape.
//
// Incrementally adds only escaped chars, adding other chunks as-is
// as a micro-optimization.

pp.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) {
      this.pos += ch <= 0xffff ? 1 : 2;
    } else if (ch === 92) { // "\"
      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      if (this.input.charCodeAt(++this.pos) !== 117) // "u"
        { this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"); }
      ++this.pos;
      var esc = this.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral))
        { this.invalidStringToken(escStart, "Invalid Unicode escape"); }
      word += codePointToString(esc);
      chunkStart = this.pos;
    } else {
      break
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos)
};

// Read an identifier or keyword token. Will check for reserved
// words when necessary.

pp.readWord = function() {
  var word = this.readWord1();
  var type = types$1.name;
  if (this.keywords.test(word)) {
    type = keywords[word];
  }
  return this.finishToken(type, word)
};

// Acorn is a tiny, fast JavaScript parser written in JavaScript.

var version = "8.7.1";

Parser.acorn = {
  Parser: Parser,
  version: version,
  defaultOptions: defaultOptions,
  Position: Position,
  SourceLocation: SourceLocation,
  getLineInfo: getLineInfo,
  Node: Node,
  TokenType: TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext: TokContext,
  tokContexts: types,
  isIdentifierChar: isIdentifierChar,
  isIdentifierStart: isIdentifierStart,
  Token: Token,
  isNewLine: isNewLine,
  lineBreak: lineBreak,
  lineBreakG: lineBreakG,
  nonASCIIwhitespace: nonASCIIwhitespace
};

function resolveIdViaPlugins(source, importer, pluginDriver, moduleLoaderResolveId, skip, customOptions, isEntry) {
    let skipped = null;
    let replaceContext = null;
    if (skip) {
        skipped = new Set();
        for (const skippedCall of skip) {
            if (source === skippedCall.source && importer === skippedCall.importer) {
                skipped.add(skippedCall.plugin);
            }
        }
        replaceContext = (pluginContext, plugin) => ({
            ...pluginContext,
            resolve: (source, importer, { custom, isEntry, skipSelf } = BLANK) => {
                return moduleLoaderResolveId(source, importer, custom, isEntry, skipSelf ? [...skip, { importer, plugin, source }] : skip);
            }
        });
    }
    return pluginDriver.hookFirst('resolveId', [source, importer, { custom: customOptions, isEntry }], replaceContext, skipped);
}

async function resolveId(source, importer, preserveSymlinks, pluginDriver, moduleLoaderResolveId, skip, customOptions, isEntry) {
    const pluginResult = await resolveIdViaPlugins(source, importer, pluginDriver, moduleLoaderResolveId, skip, customOptions, isEntry);
    if (pluginResult != null)
        return pluginResult;
    // external modules (non-entry modules that start with neither '.' or '/')
    // are skipped at this stage.
    if (importer !== undefined && !isAbsolute(source) && source[0] !== '.')
        return null;
    // `resolve` processes paths from right to left, prepending them until an
    // absolute path is created. Absolute importees therefore shortcircuit the
    // resolve call and require no special handing on our part.
    // See https://nodejs.org/api/path.html#path_path_resolve_paths
    return addJsExtensionIfNecessary(importer ? require$$0.resolve(require$$0.dirname(importer), source) : require$$0.resolve(source), preserveSymlinks);
}
async function addJsExtensionIfNecessary(file, preserveSymlinks) {
    var _a, _b;
    return ((_b = (_a = (await findFile(file, preserveSymlinks))) !== null && _a !== void 0 ? _a : (await findFile(file + '.mjs', preserveSymlinks))) !== null && _b !== void 0 ? _b : (await findFile(file + '.js', preserveSymlinks)));
}
async function findFile(file, preserveSymlinks) {
    try {
        const stats = await require$$0$1.promises.lstat(file);
        if (!preserveSymlinks && stats.isSymbolicLink())
            return await findFile(await require$$0$1.promises.realpath(file), preserveSymlinks);
        if ((preserveSymlinks && stats.isSymbolicLink()) || stats.isFile()) {
            // check case
            const name = require$$0.basename(file);
            const files = await require$$0$1.promises.readdir(require$$0.dirname(file));
            if (files.includes(name))
                return file;
        }
    }
    catch (_a) {
        // suppress
    }
}

const ANONYMOUS_PLUGIN_PREFIX = 'at position ';
const ANONYMOUS_OUTPUT_PLUGIN_PREFIX = 'at output position ';
function throwPluginError(err, plugin, { hook, id } = {}) {
    if (typeof err === 'string')
        err = { message: err };
    if (err.code && err.code !== Errors.PLUGIN_ERROR) {
        err.pluginCode = err.code;
    }
    err.code = Errors.PLUGIN_ERROR;
    err.plugin = plugin;
    if (hook) {
        err.hook = hook;
    }
    if (id) {
        err.id = id;
    }
    return error(err);
}
const deprecatedHooks = [
    { active: true, deprecated: 'resolveAssetUrl', replacement: 'resolveFileUrl' }
];
function warnDeprecatedHooks(plugins, options) {
    for (const { active, deprecated, replacement } of deprecatedHooks) {
        for (const plugin of plugins) {
            if (deprecated in plugin) {
                warnDeprecation({
                    message: `The "${deprecated}" hook used by plugin ${plugin.name} is deprecated. The "${replacement}" hook should be used instead.`,
                    plugin: plugin.name
                }, active, options);
            }
        }
    }
}

function createPluginCache(cache) {
    return {
        delete(id) {
            return delete cache[id];
        },
        get(id) {
            const item = cache[id];
            if (!item)
                return undefined;
            item[0] = 0;
            return item[1];
        },
        has(id) {
            const item = cache[id];
            if (!item)
                return false;
            item[0] = 0;
            return true;
        },
        set(id, value) {
            cache[id] = [0, value];
        }
    };
}
function getTrackedPluginCache(pluginCache, onUse) {
    return {
        delete(id) {
            onUse();
            return pluginCache.delete(id);
        },
        get(id) {
            onUse();
            return pluginCache.get(id);
        },
        has(id) {
            onUse();
            return pluginCache.has(id);
        },
        set(id, value) {
            onUse();
            return pluginCache.set(id, value);
        }
    };
}
const NO_CACHE = {
    delete() {
        return false;
    },
    get() {
        return undefined;
    },
    has() {
        return false;
    },
    set() { }
};
function uncacheablePluginError(pluginName) {
    if (pluginName.startsWith(ANONYMOUS_PLUGIN_PREFIX) ||
        pluginName.startsWith(ANONYMOUS_OUTPUT_PLUGIN_PREFIX)) {
        return error({
            code: 'ANONYMOUS_PLUGIN_CACHE',
            message: 'A plugin is trying to use the Rollup cache but is not declaring a plugin name or cacheKey.'
        });
    }
    return error({
        code: 'DUPLICATE_PLUGIN_NAME',
        message: `The plugin name ${pluginName} is being used twice in the same build. Plugin names must be distinct or provide a cacheKey (please post an issue to the plugin if you are a plugin user).`
    });
}
function getCacheForUncacheablePlugin(pluginName) {
    return {
        delete() {
            return uncacheablePluginError(pluginName);
        },
        get() {
            return uncacheablePluginError(pluginName);
        },
        has() {
            return uncacheablePluginError(pluginName);
        },
        set() {
            return uncacheablePluginError(pluginName);
        }
    };
}

async function transform(source, module, pluginDriver, warn) {
    const id = module.id;
    const sourcemapChain = [];
    let originalSourcemap = source.map === null ? null : decodedSourcemap(source.map);
    const originalCode = source.code;
    let ast = source.ast;
    const transformDependencies = [];
    const emittedFiles = [];
    let customTransformCache = false;
    const useCustomTransformCache = () => (customTransformCache = true);
    let pluginName = '';
    const curSource = source.code;
    function transformReducer(previousCode, result, plugin) {
        let code;
        let map;
        if (typeof result === 'string') {
            code = result;
        }
        else if (result && typeof result === 'object') {
            module.updateOptions(result);
            if (result.code == null) {
                if (result.map || result.ast) {
                    warn(errNoTransformMapOrAstWithoutCode(plugin.name));
                }
                return previousCode;
            }
            ({ code, map, ast } = result);
        }
        else {
            return previousCode;
        }
        // strict null check allows 'null' maps to not be pushed to the chain,
        // while 'undefined' gets the missing map warning
        if (map !== null) {
            sourcemapChain.push(decodedSourcemap(typeof map === 'string' ? JSON.parse(map) : map) || {
                missing: true,
                plugin: plugin.name
            });
        }
        return code;
    }
    let code;
    try {
        code = await pluginDriver.hookReduceArg0('transform', [curSource, id], transformReducer, (pluginContext, plugin) => {
            pluginName = plugin.name;
            return {
                ...pluginContext,
                addWatchFile(id) {
                    transformDependencies.push(id);
                    pluginContext.addWatchFile(id);
                },
                cache: customTransformCache
                    ? pluginContext.cache
                    : getTrackedPluginCache(pluginContext.cache, useCustomTransformCache),
                emitAsset(name, source) {
                    emittedFiles.push({ name, source, type: 'asset' });
                    return pluginContext.emitAsset(name, source);
                },
                emitChunk(id, options) {
                    emittedFiles.push({ id, name: options && options.name, type: 'chunk' });
                    return pluginContext.emitChunk(id, options);
                },
                emitFile(emittedFile) {
                    emittedFiles.push(emittedFile);
                    return pluginDriver.emitFile(emittedFile);
                },
                error(err, pos) {
                    if (typeof err === 'string')
                        err = { message: err };
                    if (pos)
                        augmentCodeLocation(err, pos, curSource, id);
                    err.id = id;
                    err.hook = 'transform';
                    return pluginContext.error(err);
                },
                getCombinedSourcemap() {
                    const combinedMap = collapseSourcemap(id, originalCode, originalSourcemap, sourcemapChain, warn);
                    if (!combinedMap) {
                        const magicString = new MagicString(originalCode);
                        return magicString.generateMap({ hires: true, includeContent: true, source: id });
                    }
                    if (originalSourcemap !== combinedMap) {
                        originalSourcemap = combinedMap;
                        sourcemapChain.length = 0;
                    }
                    return new SourceMap({
                        ...combinedMap,
                        file: null,
                        sourcesContent: combinedMap.sourcesContent
                    });
                },
                setAssetSource() {
                    return this.error({
                        code: 'INVALID_SETASSETSOURCE',
                        message: `setAssetSource cannot be called in transform for caching reasons. Use emitFile with a source, or call setAssetSource in another hook.`
                    });
                },
                warn(warning, pos) {
                    if (typeof warning === 'string')
                        warning = { message: warning };
                    if (pos)
                        augmentCodeLocation(warning, pos, curSource, id);
                    warning.id = id;
                    warning.hook = 'transform';
                    pluginContext.warn(warning);
                }
            };
        });
    }
    catch (err) {
        throwPluginError(err, pluginName, { hook: 'transform', id });
    }
    if (!customTransformCache) {
        // files emitted by a transform hook need to be emitted again if the hook is skipped
        if (emittedFiles.length)
            module.transformFiles = emittedFiles;
    }
    return {
        ast,
        code,
        customTransformCache,
        originalCode,
        originalSourcemap,
        sourcemapChain,
        transformDependencies
    };
}

const RESOLVE_DEPENDENCIES = 'resolveDependencies';
class ModuleLoader {
    constructor(graph, modulesById, options, pluginDriver) {
        this.graph = graph;
        this.modulesById = modulesById;
        this.options = options;
        this.pluginDriver = pluginDriver;
        this.implicitEntryModules = new Set();
        this.indexedEntryModules = [];
        this.latestLoadModulesPromise = Promise.resolve();
        this.moduleLoadPromises = new Map();
        this.modulesWithLoadedDependencies = new Set();
        this.nextChunkNamePriority = 0;
        this.nextEntryModuleIndex = 0;
        this.resolveId = async (source, importer, customOptions, isEntry, skip = null) => {
            return this.getResolvedIdWithDefaults(this.getNormalizedResolvedIdWithoutDefaults(this.options.external(source, importer, false)
                ? false
                : await resolveId(source, importer, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, skip, customOptions, typeof isEntry === 'boolean' ? isEntry : !importer), importer, source));
        };
        this.hasModuleSideEffects = options.treeshake
            ? options.treeshake.moduleSideEffects
            : () => true;
    }
    async addAdditionalModules(unresolvedModules) {
        const result = this.extendLoadModulesPromise(Promise.all(unresolvedModules.map(id => this.loadEntryModule(id, false, undefined, null))));
        await this.awaitLoadModulesPromise();
        return result;
    }
    async addEntryModules(unresolvedEntryModules, isUserDefined) {
        const firstEntryModuleIndex = this.nextEntryModuleIndex;
        this.nextEntryModuleIndex += unresolvedEntryModules.length;
        const firstChunkNamePriority = this.nextChunkNamePriority;
        this.nextChunkNamePriority += unresolvedEntryModules.length;
        const newEntryModules = await this.extendLoadModulesPromise(Promise.all(unresolvedEntryModules.map(({ id, importer }) => this.loadEntryModule(id, true, importer, null))).then(entryModules => {
            for (let index = 0; index < entryModules.length; index++) {
                const entryModule = entryModules[index];
                entryModule.isUserDefinedEntryPoint =
                    entryModule.isUserDefinedEntryPoint || isUserDefined;
                addChunkNamesToModule(entryModule, unresolvedEntryModules[index], isUserDefined, firstChunkNamePriority + index);
                const existingIndexedModule = this.indexedEntryModules.find(indexedModule => indexedModule.module === entryModule);
                if (!existingIndexedModule) {
                    this.indexedEntryModules.push({
                        index: firstEntryModuleIndex + index,
                        module: entryModule
                    });
                }
                else {
                    existingIndexedModule.index = Math.min(existingIndexedModule.index, firstEntryModuleIndex + index);
                }
            }
            this.indexedEntryModules.sort(({ index: indexA }, { index: indexB }) => indexA > indexB ? 1 : -1);
            return entryModules;
        }));
        await this.awaitLoadModulesPromise();
        return {
            entryModules: this.indexedEntryModules.map(({ module }) => module),
            implicitEntryModules: [...this.implicitEntryModules],
            newEntryModules
        };
    }
    async emitChunk({ fileName, id, importer, name, implicitlyLoadedAfterOneOf, preserveSignature }) {
        const unresolvedModule = {
            fileName: fileName || null,
            id,
            importer,
            name: name || null
        };
        const module = implicitlyLoadedAfterOneOf
            ? await this.addEntryWithImplicitDependants(unresolvedModule, implicitlyLoadedAfterOneOf)
            : (await this.addEntryModules([unresolvedModule], false)).newEntryModules[0];
        if (preserveSignature != null) {
            module.preserveSignature = preserveSignature;
        }
        return module;
    }
    async preloadModule(resolvedId) {
        const module = await this.fetchModule(this.getResolvedIdWithDefaults(resolvedId), undefined, false, resolvedId.resolveDependencies ? RESOLVE_DEPENDENCIES : true);
        return module.info;
    }
    addEntryWithImplicitDependants(unresolvedModule, implicitlyLoadedAfter) {
        const chunkNamePriority = this.nextChunkNamePriority++;
        return this.extendLoadModulesPromise(this.loadEntryModule(unresolvedModule.id, false, unresolvedModule.importer, null).then(async (entryModule) => {
            addChunkNamesToModule(entryModule, unresolvedModule, false, chunkNamePriority);
            if (!entryModule.info.isEntry) {
                this.implicitEntryModules.add(entryModule);
                const implicitlyLoadedAfterModules = await Promise.all(implicitlyLoadedAfter.map(id => this.loadEntryModule(id, false, unresolvedModule.importer, entryModule.id)));
                for (const module of implicitlyLoadedAfterModules) {
                    entryModule.implicitlyLoadedAfter.add(module);
                }
                for (const dependant of entryModule.implicitlyLoadedAfter) {
                    dependant.implicitlyLoadedBefore.add(entryModule);
                }
            }
            return entryModule;
        }));
    }
    async addModuleSource(id, importer, module) {
        timeStart('load modules', 3);
        let source;
        try {
            source = await this.graph.fileOperationQueue.run(async () => { var _a; return (_a = (await this.pluginDriver.hookFirst('load', [id]))) !== null && _a !== void 0 ? _a : (await require$$0$1.promises.readFile(id, 'utf8')); });
        }
        catch (err) {
            timeEnd('load modules', 3);
            let msg = `Could not load ${id}`;
            if (importer)
                msg += ` (imported by ${relativeId(importer)})`;
            msg += `: ${err.message}`;
            err.message = msg;
            throw err;
        }
        timeEnd('load modules', 3);
        const sourceDescription = typeof source === 'string'
            ? { code: source }
            : source != null && typeof source === 'object' && typeof source.code === 'string'
                ? source
                : error(errBadLoader(id));
        const cachedModule = this.graph.cachedModules.get(id);
        if (cachedModule &&
            !cachedModule.customTransformCache &&
            cachedModule.originalCode === sourceDescription.code &&
            !(await this.pluginDriver.hookFirst('shouldTransformCachedModule', [
                {
                    ast: cachedModule.ast,
                    code: cachedModule.code,
                    id: cachedModule.id,
                    meta: cachedModule.meta,
                    moduleSideEffects: cachedModule.moduleSideEffects,
                    resolvedSources: cachedModule.resolvedIds,
                    syntheticNamedExports: cachedModule.syntheticNamedExports
                }
            ]))) {
            if (cachedModule.transformFiles) {
                for (const emittedFile of cachedModule.transformFiles)
                    this.pluginDriver.emitFile(emittedFile);
            }
            module.setSource(cachedModule);
        }
        else {
            module.updateOptions(sourceDescription);
            module.setSource(await transform(sourceDescription, module, this.pluginDriver, this.options.onwarn));
        }
    }
    async awaitLoadModulesPromise() {
        let startingPromise;
        do {
            startingPromise = this.latestLoadModulesPromise;
            await startingPromise;
        } while (startingPromise !== this.latestLoadModulesPromise);
    }
    extendLoadModulesPromise(loadNewModulesPromise) {
        this.latestLoadModulesPromise = Promise.all([
            loadNewModulesPromise,
            this.latestLoadModulesPromise
        ]);
        this.latestLoadModulesPromise.catch(() => {
            /* Avoid unhandled Promise rejections */
        });
        return loadNewModulesPromise;
    }
    async fetchDynamicDependencies(module, resolveDynamicImportPromises) {
        const dependencies = await Promise.all(resolveDynamicImportPromises.map(resolveDynamicImportPromise => resolveDynamicImportPromise.then(async ([dynamicImport, resolvedId]) => {
            if (resolvedId === null)
                return null;
            if (typeof resolvedId === 'string') {
                dynamicImport.resolution = resolvedId;
                return null;
            }
            return (dynamicImport.resolution = await this.fetchResolvedDependency(relativeId(resolvedId.id), module.id, resolvedId));
        })));
        for (const dependency of dependencies) {
            if (dependency) {
                module.dynamicDependencies.add(dependency);
                dependency.dynamicImporters.push(module.id);
            }
        }
    }
    // If this is a preload, then this method always waits for the dependencies of the module to be resolved.
    // Otherwise if the module does not exist, it waits for the module and all its dependencies to be loaded.
    // Otherwise it returns immediately.
    async fetchModule({ id, meta, moduleSideEffects, syntheticNamedExports }, importer, isEntry, isPreload) {
        const existingModule = this.modulesById.get(id);
        if (existingModule instanceof Module) {
            await this.handleExistingModule(existingModule, isEntry, isPreload);
            return existingModule;
        }
        const module = new Module(this.graph, id, this.options, isEntry, moduleSideEffects, syntheticNamedExports, meta);
        this.modulesById.set(id, module);
        this.graph.watchFiles[id] = true;
        const loadPromise = this.addModuleSource(id, importer, module).then(() => [
            this.getResolveStaticDependencyPromises(module),
            this.getResolveDynamicImportPromises(module),
            loadAndResolveDependenciesPromise
        ]);
        const loadAndResolveDependenciesPromise = waitForDependencyResolution(loadPromise).then(() => this.pluginDriver.hookParallel('moduleParsed', [module.info]));
        loadAndResolveDependenciesPromise.catch(() => {
            /* avoid unhandled promise rejections */
        });
        this.moduleLoadPromises.set(module, loadPromise);
        const resolveDependencyPromises = await loadPromise;
        if (!isPreload) {
            await this.fetchModuleDependencies(module, ...resolveDependencyPromises);
        }
        else if (isPreload === RESOLVE_DEPENDENCIES) {
            await loadAndResolveDependenciesPromise;
        }
        return module;
    }
    async fetchModuleDependencies(module, resolveStaticDependencyPromises, resolveDynamicDependencyPromises, loadAndResolveDependenciesPromise) {
        if (this.modulesWithLoadedDependencies.has(module)) {
            return;
        }
        this.modulesWithLoadedDependencies.add(module);
        await Promise.all([
            this.fetchStaticDependencies(module, resolveStaticDependencyPromises),
            this.fetchDynamicDependencies(module, resolveDynamicDependencyPromises)
        ]);
        module.linkImports();
        // To handle errors when resolving dependencies or in moduleParsed
        await loadAndResolveDependenciesPromise;
    }
    fetchResolvedDependency(source, importer, resolvedId) {
        if (resolvedId.external) {
            const { external, id, moduleSideEffects, meta } = resolvedId;
            if (!this.modulesById.has(id)) {
                this.modulesById.set(id, new ExternalModule(this.options, id, moduleSideEffects, meta, external !== 'absolute' && isAbsolute(id)));
            }
            const externalModule = this.modulesById.get(id);
            if (!(externalModule instanceof ExternalModule)) {
                return error(errInternalIdCannotBeExternal(source, importer));
            }
            return Promise.resolve(externalModule);
        }
        return this.fetchModule(resolvedId, importer, false, false);
    }
    async fetchStaticDependencies(module, resolveStaticDependencyPromises) {
        for (const dependency of await Promise.all(resolveStaticDependencyPromises.map(resolveStaticDependencyPromise => resolveStaticDependencyPromise.then(([source, resolvedId]) => this.fetchResolvedDependency(source, module.id, resolvedId))))) {
            module.dependencies.add(dependency);
            dependency.importers.push(module.id);
        }
        if (!this.options.treeshake || module.info.moduleSideEffects === 'no-treeshake') {
            for (const dependency of module.dependencies) {
                if (dependency instanceof Module) {
                    dependency.importedFromNotTreeshaken = true;
                }
            }
        }
    }
    getNormalizedResolvedIdWithoutDefaults(resolveIdResult, importer, source) {
        const { makeAbsoluteExternalsRelative } = this.options;
        if (resolveIdResult) {
            if (typeof resolveIdResult === 'object') {
                const external = resolveIdResult.external || this.options.external(resolveIdResult.id, importer, true);
                return {
                    ...resolveIdResult,
                    external: external &&
                        (external === 'relative' ||
                            !isAbsolute(resolveIdResult.id) ||
                            (external === true &&
                                isNotAbsoluteExternal(resolveIdResult.id, source, makeAbsoluteExternalsRelative)) ||
                            'absolute')
                };
            }
            const external = this.options.external(resolveIdResult, importer, true);
            return {
                external: external &&
                    (isNotAbsoluteExternal(resolveIdResult, source, makeAbsoluteExternalsRelative) ||
                        'absolute'),
                id: external && makeAbsoluteExternalsRelative
                    ? normalizeRelativeExternalId(resolveIdResult, importer)
                    : resolveIdResult
            };
        }
        const id = makeAbsoluteExternalsRelative
            ? normalizeRelativeExternalId(source, importer)
            : source;
        if (resolveIdResult !== false && !this.options.external(id, importer, true)) {
            return null;
        }
        return {
            external: isNotAbsoluteExternal(id, source, makeAbsoluteExternalsRelative) || 'absolute',
            id
        };
    }
    getResolveDynamicImportPromises(module) {
        return module.dynamicImports.map(async (dynamicImport) => {
            const resolvedId = await this.resolveDynamicImport(module, typeof dynamicImport.argument === 'string'
                ? dynamicImport.argument
                : dynamicImport.argument.esTreeNode, module.id);
            if (resolvedId && typeof resolvedId === 'object') {
                dynamicImport.id = resolvedId.id;
            }
            return [dynamicImport, resolvedId];
        });
    }
    getResolveStaticDependencyPromises(module) {
        return Array.from(module.sources, async (source) => [
            source,
            (module.resolvedIds[source] =
                module.resolvedIds[source] ||
                    this.handleResolveId(await this.resolveId(source, module.id, EMPTY_OBJECT, false), source, module.id))
        ]);
    }
    getResolvedIdWithDefaults(resolvedId) {
        var _a, _b;
        if (!resolvedId) {
            return null;
        }
        const external = resolvedId.external || false;
        return {
            external,
            id: resolvedId.id,
            meta: resolvedId.meta || {},
            moduleSideEffects: (_a = resolvedId.moduleSideEffects) !== null && _a !== void 0 ? _a : this.hasModuleSideEffects(resolvedId.id, !!external),
            syntheticNamedExports: (_b = resolvedId.syntheticNamedExports) !== null && _b !== void 0 ? _b : false
        };
    }
    async handleExistingModule(module, isEntry, isPreload) {
        const loadPromise = this.moduleLoadPromises.get(module);
        if (isPreload) {
            return isPreload === RESOLVE_DEPENDENCIES
                ? waitForDependencyResolution(loadPromise)
                : loadPromise;
        }
        if (isEntry) {
            module.info.isEntry = true;
            this.implicitEntryModules.delete(module);
            for (const dependant of module.implicitlyLoadedAfter) {
                dependant.implicitlyLoadedBefore.delete(module);
            }
            module.implicitlyLoadedAfter.clear();
        }
        return this.fetchModuleDependencies(module, ...(await loadPromise));
    }
    handleResolveId(resolvedId, source, importer) {
        if (resolvedId === null) {
            if (isRelative(source)) {
                return error(errUnresolvedImport(source, importer));
            }
            this.options.onwarn(errUnresolvedImportTreatedAsExternal(source, importer));
            return {
                external: true,
                id: source,
                meta: {},
                moduleSideEffects: this.hasModuleSideEffects(source, true),
                syntheticNamedExports: false
            };
        }
        else if (resolvedId.external && resolvedId.syntheticNamedExports) {
            this.options.onwarn(errExternalSyntheticExports(source, importer));
        }
        return resolvedId;
    }
    async loadEntryModule(unresolvedId, isEntry, importer, implicitlyLoadedBefore) {
        const resolveIdResult = await resolveId(unresolvedId, importer, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, null, EMPTY_OBJECT, true);
        if (resolveIdResult == null) {
            return error(implicitlyLoadedBefore === null
                ? errUnresolvedEntry(unresolvedId)
                : errUnresolvedImplicitDependant(unresolvedId, implicitlyLoadedBefore));
        }
        if (resolveIdResult === false ||
            (typeof resolveIdResult === 'object' && resolveIdResult.external)) {
            return error(implicitlyLoadedBefore === null
                ? errEntryCannotBeExternal(unresolvedId)
                : errImplicitDependantCannotBeExternal(unresolvedId, implicitlyLoadedBefore));
        }
        return this.fetchModule(this.getResolvedIdWithDefaults(typeof resolveIdResult === 'object'
            ? resolveIdResult
            : { id: resolveIdResult }), undefined, isEntry, false);
    }
    async resolveDynamicImport(module, specifier, importer) {
        var _a;
        var _b;
        const resolution = await this.pluginDriver.hookFirst('resolveDynamicImport', [
            specifier,
            importer
        ]);
        if (typeof specifier !== 'string') {
            if (typeof resolution === 'string') {
                return resolution;
            }
            if (!resolution) {
                return null;
            }
            return {
                external: false,
                moduleSideEffects: true,
                ...resolution
            };
        }
        if (resolution == null) {
            return ((_a = (_b = module.resolvedIds)[specifier]) !== null && _a !== void 0 ? _a : (_b[specifier] = this.handleResolveId(await this.resolveId(specifier, module.id, EMPTY_OBJECT, false), specifier, module.id)));
        }
        return this.handleResolveId(this.getResolvedIdWithDefaults(this.getNormalizedResolvedIdWithoutDefaults(resolution, importer, specifier)), specifier, importer);
    }
}
function normalizeRelativeExternalId(source, importer) {
    return isRelative(source)
        ? importer
            ? require$$0.resolve(importer, '..', source)
            : require$$0.resolve(source)
        : source;
}
function addChunkNamesToModule(module, { fileName, name }, isUserDefined, priority) {
    var _a;
    if (fileName !== null) {
        module.chunkFileNames.add(fileName);
    }
    else if (name !== null) {
        // Always keep chunkNames sorted by priority
        let namePosition = 0;
        while (((_a = module.chunkNames[namePosition]) === null || _a === void 0 ? void 0 : _a.priority) < priority)
            namePosition++;
        module.chunkNames.splice(namePosition, 0, { isUserDefined, name, priority });
    }
}
function isNotAbsoluteExternal(id, source, makeAbsoluteExternalsRelative) {
    return (makeAbsoluteExternalsRelative === true ||
        (makeAbsoluteExternalsRelative === 'ifRelativeSource' && isRelative(source)) ||
        !isAbsolute(id));
}
async function waitForDependencyResolution(loadPromise) {
    const [resolveStaticDependencyPromises, resolveDynamicImportPromises] = await loadPromise;
    return Promise.all([...resolveStaticDependencyPromises, ...resolveDynamicImportPromises]);
}

class GlobalScope extends Scope$1 {
    constructor() {
        super();
        this.parent = null;
        this.variables.set('undefined', new UndefinedVariable());
    }
    findVariable(name) {
        let variable = this.variables.get(name);
        if (!variable) {
            variable = new GlobalVariable(name);
            this.variables.set(name, variable);
        }
        return variable;
    }
}

function generateAssetFileName(name, source, outputOptions, bundle) {
    const emittedName = outputOptions.sanitizeFileName(name || 'asset');
    return makeUnique(renderNamePattern(typeof outputOptions.assetFileNames === 'function'
        ? outputOptions.assetFileNames({ name, source, type: 'asset' })
        : outputOptions.assetFileNames, 'output.assetFileNames', {
        ext: () => require$$0.extname(emittedName).substring(1),
        extname: () => require$$0.extname(emittedName),
        hash() {
            return createHash()
                .update(emittedName)
                .update(':')
                .update(source)
                .digest('hex')
                .substring(0, 8);
        },
        name: () => emittedName.substring(0, emittedName.length - require$$0.extname(emittedName).length)
    }), bundle);
}
function reserveFileNameInBundle(fileName, bundle, warn) {
    const lowercaseFileName = fileName.toLowerCase();
    if (bundle[lowercaseBundleKeys].has(lowercaseFileName)) {
        warn(errFileNameConflict(fileName));
    }
    else {
        bundle[fileName] = FILE_PLACEHOLDER;
    }
}
function hasValidType(emittedFile) {
    return Boolean(emittedFile &&
        (emittedFile.type === 'asset' ||
            emittedFile.type === 'chunk'));
}
function hasValidName(emittedFile) {
    const validatedName = emittedFile.fileName || emittedFile.name;
    return !validatedName || (typeof validatedName === 'string' && !isPathFragment(validatedName));
}
function getValidSource(source, emittedFile, fileReferenceId) {
    if (!(typeof source === 'string' || source instanceof Uint8Array)) {
        const assetName = emittedFile.fileName || emittedFile.name || fileReferenceId;
        return error(errFailedValidation(`Could not set source for ${typeof assetName === 'string' ? `asset "${assetName}"` : 'unnamed asset'}, asset source needs to be a string, Uint8Array or Buffer.`));
    }
    return source;
}
function getAssetFileName(file, referenceId) {
    if (typeof file.fileName !== 'string') {
        return error(errAssetNotFinalisedForFileName(file.name || referenceId));
    }
    return file.fileName;
}
function getChunkFileName(file, facadeChunkByModule) {
    var _a;
    const fileName = file.fileName || (file.module && ((_a = facadeChunkByModule === null || facadeChunkByModule === void 0 ? void 0 : facadeChunkByModule.get(file.module)) === null || _a === void 0 ? void 0 : _a.id));
    if (!fileName)
        return error(errChunkNotGeneratedForFileName(file.fileName || file.name));
    return fileName;
}
class FileEmitter {
    constructor(graph, options, baseFileEmitter) {
        this.graph = graph;
        this.options = options;
        this.bundle = null;
        this.facadeChunkByModule = null;
        this.outputOptions = null;
        this.assertAssetsFinalized = () => {
            for (const [referenceId, emittedFile] of this.filesByReferenceId) {
                if (emittedFile.type === 'asset' && typeof emittedFile.fileName !== 'string')
                    return error(errNoAssetSourceSet(emittedFile.name || referenceId));
            }
        };
        this.emitFile = (emittedFile) => {
            if (!hasValidType(emittedFile)) {
                return error(errFailedValidation(`Emitted files must be of type "asset" or "chunk", received "${emittedFile && emittedFile.type}".`));
            }
            if (!hasValidName(emittedFile)) {
                return error(errFailedValidation(`The "fileName" or "name" properties of emitted files must be strings that are neither absolute nor relative paths, received "${emittedFile.fileName || emittedFile.name}".`));
            }
            if (emittedFile.type === 'chunk') {
                return this.emitChunk(emittedFile);
            }
            return this.emitAsset(emittedFile);
        };
        this.getFileName = (fileReferenceId) => {
            const emittedFile = this.filesByReferenceId.get(fileReferenceId);
            if (!emittedFile)
                return error(errFileReferenceIdNotFoundForFilename(fileReferenceId));
            if (emittedFile.type === 'chunk') {
                return getChunkFileName(emittedFile, this.facadeChunkByModule);
            }
            return getAssetFileName(emittedFile, fileReferenceId);
        };
        this.setAssetSource = (referenceId, requestedSource) => {
            const consumedFile = this.filesByReferenceId.get(referenceId);
            if (!consumedFile)
                return error(errAssetReferenceIdNotFoundForSetSource(referenceId));
            if (consumedFile.type !== 'asset') {
                return error(errFailedValidation(`Asset sources can only be set for emitted assets but "${referenceId}" is an emitted chunk.`));
            }
            if (consumedFile.source !== undefined) {
                return error(errAssetSourceAlreadySet(consumedFile.name || referenceId));
            }
            const source = getValidSource(requestedSource, consumedFile, referenceId);
            if (this.bundle) {
                this.finalizeAsset(consumedFile, source, referenceId, this.bundle);
            }
            else {
                consumedFile.source = source;
            }
        };
        this.setOutputBundle = (bundle, outputOptions, facadeChunkByModule) => {
            this.outputOptions = outputOptions;
            this.bundle = bundle;
            this.facadeChunkByModule = facadeChunkByModule;
            for (const { fileName } of this.filesByReferenceId.values()) {
                if (fileName) {
                    reserveFileNameInBundle(fileName, bundle, this.options.onwarn);
                }
            }
            for (const [referenceId, consumedFile] of this.filesByReferenceId) {
                if (consumedFile.type === 'asset' && consumedFile.source !== undefined) {
                    this.finalizeAsset(consumedFile, consumedFile.source, referenceId, bundle);
                }
            }
        };
        this.filesByReferenceId = baseFileEmitter
            ? new Map(baseFileEmitter.filesByReferenceId)
            : new Map();
    }
    assignReferenceId(file, idBase) {
        let referenceId;
        do {
            referenceId = createHash()
                .update(referenceId || idBase)
                .digest('hex')
                .substring(0, 8);
        } while (this.filesByReferenceId.has(referenceId));
        this.filesByReferenceId.set(referenceId, file);
        return referenceId;
    }
    emitAsset(emittedAsset) {
        const source = typeof emittedAsset.source !== 'undefined'
            ? getValidSource(emittedAsset.source, emittedAsset, null)
            : undefined;
        const consumedAsset = {
            fileName: emittedAsset.fileName,
            name: emittedAsset.name,
            source,
            type: 'asset'
        };
        const referenceId = this.assignReferenceId(consumedAsset, emittedAsset.fileName || emittedAsset.name || emittedAsset.type);
        if (this.bundle) {
            if (emittedAsset.fileName) {
                reserveFileNameInBundle(emittedAsset.fileName, this.bundle, this.options.onwarn);
            }
            if (source !== undefined) {
                this.finalizeAsset(consumedAsset, source, referenceId, this.bundle);
            }
        }
        return referenceId;
    }
    emitChunk(emittedChunk) {
        if (this.graph.phase > BuildPhase.LOAD_AND_PARSE) {
            return error(errInvalidRollupPhaseForChunkEmission());
        }
        if (typeof emittedChunk.id !== 'string') {
            return error(errFailedValidation(`Emitted chunks need to have a valid string id, received "${emittedChunk.id}"`));
        }
        const consumedChunk = {
            fileName: emittedChunk.fileName,
            module: null,
            name: emittedChunk.name || emittedChunk.id,
            type: 'chunk'
        };
        this.graph.moduleLoader
            .emitChunk(emittedChunk)
            .then(module => (consumedChunk.module = module))
            .catch(() => {
            // Avoid unhandled Promise rejection as the error will be thrown later
            // once module loading has finished
        });
        return this.assignReferenceId(consumedChunk, emittedChunk.id);
    }
    finalizeAsset(consumedFile, source, referenceId, bundle) {
        const fileName = consumedFile.fileName ||
            findExistingAssetFileNameWithSource(bundle, source) ||
            generateAssetFileName(consumedFile.name, source, this.outputOptions, bundle);
        // We must not modify the original assets to avoid interaction between outputs
        const assetWithFileName = { ...consumedFile, fileName, source };
        this.filesByReferenceId.set(referenceId, assetWithFileName);
        const { options } = this;
        bundle[fileName] = {
            fileName,
            get isAsset() {
                warnDeprecation('Accessing "isAsset" on files in the bundle is deprecated, please use "type === \'asset\'" instead', true, options);
                return true;
            },
            name: consumedFile.name,
            source,
            type: 'asset'
        };
    }
}
// TODO This can lead to a performance problem when many assets are emitted.
//  Instead, we should only deduplicate string assets and use their sources as
//  object keys for better performance.
function findExistingAssetFileNameWithSource(bundle, source) {
    for (const [fileName, outputFile] of Object.entries(bundle)) {
        if (outputFile.type === 'asset' && areSourcesEqual(source, outputFile.source))
            return fileName;
    }
    return null;
}
function areSourcesEqual(sourceA, sourceB) {
    if (typeof sourceA === 'string') {
        return sourceA === sourceB;
    }
    if (typeof sourceB === 'string') {
        return false;
    }
    if ('equals' in sourceA) {
        return sourceA.equals(sourceB);
    }
    if (sourceA.length !== sourceB.length) {
        return false;
    }
    for (let index = 0; index < sourceA.length; index++) {
        if (sourceA[index] !== sourceB[index]) {
            return false;
        }
    }
    return true;
}

function getDeprecatedContextHandler(handler, handlerName, newHandlerName, pluginName, activeDeprecation, options) {
    let deprecationWarningShown = false;
    return ((...args) => {
        if (!deprecationWarningShown) {
            deprecationWarningShown = true;
            warnDeprecation({
                message: `The "this.${handlerName}" plugin context function used by plugin ${pluginName} is deprecated. The "this.${newHandlerName}" plugin context function should be used instead.`,
                plugin: pluginName
            }, activeDeprecation, options);
        }
        return handler(...args);
    });
}
function getPluginContext(plugin, pluginCache, graph, options, fileEmitter, existingPluginNames) {
    let cacheable = true;
    if (typeof plugin.cacheKey !== 'string') {
        if (plugin.name.startsWith(ANONYMOUS_PLUGIN_PREFIX) ||
            plugin.name.startsWith(ANONYMOUS_OUTPUT_PLUGIN_PREFIX) ||
            existingPluginNames.has(plugin.name)) {
            cacheable = false;
        }
        else {
            existingPluginNames.add(plugin.name);
        }
    }
    let cacheInstance;
    if (!pluginCache) {
        cacheInstance = NO_CACHE;
    }
    else if (cacheable) {
        const cacheKey = plugin.cacheKey || plugin.name;
        cacheInstance = createPluginCache(pluginCache[cacheKey] || (pluginCache[cacheKey] = Object.create(null)));
    }
    else {
        cacheInstance = getCacheForUncacheablePlugin(plugin.name);
    }
    return {
        addWatchFile(id) {
            if (graph.phase >= BuildPhase.GENERATE) {
                return this.error(errInvalidRollupPhaseForAddWatchFile());
            }
            graph.watchFiles[id] = true;
        },
        cache: cacheInstance,
        emitAsset: getDeprecatedContextHandler((name, source) => fileEmitter.emitFile({ name, source, type: 'asset' }), 'emitAsset', 'emitFile', plugin.name, true, options),
        emitChunk: getDeprecatedContextHandler((id, options) => fileEmitter.emitFile({ id, name: options && options.name, type: 'chunk' }), 'emitChunk', 'emitFile', plugin.name, true, options),
        emitFile: fileEmitter.emitFile.bind(fileEmitter),
        error(err) {
            return throwPluginError(err, plugin.name);
        },
        getAssetFileName: getDeprecatedContextHandler(fileEmitter.getFileName, 'getAssetFileName', 'getFileName', plugin.name, true, options),
        getChunkFileName: getDeprecatedContextHandler(fileEmitter.getFileName, 'getChunkFileName', 'getFileName', plugin.name, true, options),
        getFileName: fileEmitter.getFileName,
        getModuleIds: () => graph.modulesById.keys(),
        getModuleInfo: graph.getModuleInfo,
        getWatchFiles: () => Object.keys(graph.watchFiles),
        isExternal: getDeprecatedContextHandler((id, parentId, isResolved = false) => options.external(id, parentId, isResolved), 'isExternal', 'resolve', plugin.name, true, options),
        load(resolvedId) {
            return graph.moduleLoader.preloadModule(resolvedId);
        },
        meta: {
            rollupVersion: version$1,
            watchMode: graph.watchMode
        },
        get moduleIds() {
            function* wrappedModuleIds() {
                // We are wrapping this in a generator to only show the message once we are actually iterating
                warnDeprecation({
                    message: `Accessing "this.moduleIds" on the plugin context by plugin ${plugin.name} is deprecated. The "this.getModuleIds" plugin context function should be used instead.`,
                    plugin: plugin.name
                }, false, options);
                yield* moduleIds;
            }
            const moduleIds = graph.modulesById.keys();
            return wrappedModuleIds();
        },
        parse: graph.contextParse.bind(graph),
        resolve(source, importer, { custom, isEntry, skipSelf } = BLANK) {
            return graph.moduleLoader.resolveId(source, importer, custom, isEntry, skipSelf ? [{ importer, plugin, source }] : null);
        },
        resolveId: getDeprecatedContextHandler((source, importer) => graph.moduleLoader
            .resolveId(source, importer, BLANK, undefined)
            .then(resolveId => resolveId && resolveId.id), 'resolveId', 'resolve', plugin.name, true, options),
        setAssetSource: fileEmitter.setAssetSource,
        warn(warning) {
            if (typeof warning === 'string')
                warning = { message: warning };
            if (warning.code)
                warning.pluginCode = warning.code;
            warning.code = 'PLUGIN_WARNING';
            warning.plugin = plugin.name;
            options.onwarn(warning);
        }
    };
}

// This will make sure no input hook is omitted
const inputHookNames = {
    buildEnd: 1,
    buildStart: 1,
    closeBundle: 1,
    closeWatcher: 1,
    load: 1,
    moduleParsed: 1,
    options: 1,
    resolveDynamicImport: 1,
    resolveId: 1,
    shouldTransformCachedModule: 1,
    transform: 1,
    watchChange: 1
};
const inputHooks = Object.keys(inputHookNames);
class PluginDriver {
    constructor(graph, options, userPlugins, pluginCache, basePluginDriver) {
        this.graph = graph;
        this.options = options;
        this.pluginCache = pluginCache;
        this.sortedPlugins = new Map();
        this.unfulfilledActions = new Set();
        warnDeprecatedHooks(userPlugins, options);
        this.fileEmitter = new FileEmitter(graph, options, basePluginDriver && basePluginDriver.fileEmitter);
        this.emitFile = this.fileEmitter.emitFile.bind(this.fileEmitter);
        this.getFileName = this.fileEmitter.getFileName.bind(this.fileEmitter);
        this.finaliseAssets = this.fileEmitter.assertAssetsFinalized.bind(this.fileEmitter);
        this.setOutputBundle = this.fileEmitter.setOutputBundle.bind(this.fileEmitter);
        this.plugins = userPlugins.concat(basePluginDriver ? basePluginDriver.plugins : []);
        const existingPluginNames = new Set();
        this.pluginContexts = new Map(this.plugins.map(plugin => [
            plugin,
            getPluginContext(plugin, pluginCache, graph, options, this.fileEmitter, existingPluginNames)
        ]));
        if (basePluginDriver) {
            for (const plugin of userPlugins) {
                for (const hook of inputHooks) {
                    if (hook in plugin) {
                        options.onwarn(errInputHookInOutputPlugin(plugin.name, hook));
                    }
                }
            }
        }
    }
    createOutputPluginDriver(plugins) {
        return new PluginDriver(this.graph, this.options, plugins, this.pluginCache, this);
    }
    getUnfulfilledHookActions() {
        return this.unfulfilledActions;
    }
    // chains, first non-null result stops and returns
    hookFirst(hookName, args, replaceContext, skipped) {
        let promise = Promise.resolve(null);
        for (const plugin of this.getSortedPlugins(hookName)) {
            if (skipped && skipped.has(plugin))
                continue;
            promise = promise.then(result => {
                if (result != null)
                    return result;
                return this.runHook(hookName, args, plugin, replaceContext);
            });
        }
        return promise;
    }
    // chains synchronously, first non-null result stops and returns
    hookFirstSync(hookName, args, replaceContext) {
        for (const plugin of this.getSortedPlugins(hookName)) {
            const result = this.runHookSync(hookName, args, plugin, replaceContext);
            if (result != null)
                return result;
        }
        return null;
    }
    // parallel, ignores returns
    async hookParallel(hookName, args, replaceContext) {
        const parallelPromises = [];
        for (const plugin of this.getSortedPlugins(hookName)) {
            if (plugin[hookName].sequential) {
                await Promise.all(parallelPromises);
                parallelPromises.length = 0;
                await this.runHook(hookName, args, plugin, replaceContext);
            }
            else {
                parallelPromises.push(this.runHook(hookName, args, plugin, replaceContext));
            }
        }
        await Promise.all(parallelPromises);
    }
    // chains, reduces returned value, handling the reduced value as the first hook argument
    hookReduceArg0(hookName, [arg0, ...rest], reduce, replaceContext) {
        let promise = Promise.resolve(arg0);
        for (const plugin of this.getSortedPlugins(hookName)) {
            promise = promise.then(arg0 => this.runHook(hookName, [arg0, ...rest], plugin, replaceContext).then(result => reduce.call(this.pluginContexts.get(plugin), arg0, result, plugin)));
        }
        return promise;
    }
    // chains synchronously, reduces returned value, handling the reduced value as the first hook argument
    hookReduceArg0Sync(hookName, [arg0, ...rest], reduce, replaceContext) {
        for (const plugin of this.getSortedPlugins(hookName)) {
            const args = [arg0, ...rest];
            const result = this.runHookSync(hookName, args, plugin, replaceContext);
            arg0 = reduce.call(this.pluginContexts.get(plugin), arg0, result, plugin);
        }
        return arg0;
    }
    // chains, reduces returned value to type string, handling the reduced value separately. permits hooks as values.
    async hookReduceValue(hookName, initialValue, args, reducer) {
        const results = [];
        const parallelResults = [];
        for (const plugin of this.getSortedPlugins(hookName, validateAddonPluginHandler)) {
            if (plugin[hookName].sequential) {
                results.push(...(await Promise.all(parallelResults)));
                parallelResults.length = 0;
                results.push(await this.runHook(hookName, args, plugin));
            }
            else {
                parallelResults.push(this.runHook(hookName, args, plugin));
            }
        }
        results.push(...(await Promise.all(parallelResults)));
        return results.reduce(reducer, await initialValue);
    }
    // chains synchronously, reduces returned value to type T, handling the reduced value separately. permits hooks as values.
    hookReduceValueSync(hookName, initialValue, args, reduce, replaceContext) {
        let acc = initialValue;
        for (const plugin of this.getSortedPlugins(hookName)) {
            const result = this.runHookSync(hookName, args, plugin, replaceContext);
            acc = reduce.call(this.pluginContexts.get(plugin), acc, result, plugin);
        }
        return acc;
    }
    // chains, ignores returns
    hookSeq(hookName, args, replaceContext) {
        let promise = Promise.resolve();
        for (const plugin of this.getSortedPlugins(hookName)) {
            promise = promise.then(() => this.runHook(hookName, args, plugin, replaceContext));
        }
        return promise.then(noReturn);
    }
    getSortedPlugins(hookName, validateHandler) {
        return getOrCreate(this.sortedPlugins, hookName, () => getSortedValidatedPlugins(hookName, this.plugins, validateHandler));
    }
    // Implementation signature
    runHook(hookName, args, plugin, replaceContext) {
        // We always filter for plugins that support the hook before running it
        const hook = plugin[hookName];
        const handler = typeof hook === 'object' ? hook.handler : hook;
        let context = this.pluginContexts.get(plugin);
        if (replaceContext) {
            context = replaceContext(context, plugin);
        }
        let action = null;
        return Promise.resolve()
            .then(() => {
            if (typeof handler !== 'function') {
                return handler;
            }
            // eslint-disable-next-line @typescript-eslint/ban-types
            const hookResult = handler.apply(context, args);
            if (!(hookResult === null || hookResult === void 0 ? void 0 : hookResult.then)) {
                // short circuit for non-thenables and non-Promises
                return hookResult;
            }
            // Track pending hook actions to properly error out when
            // unfulfilled promises cause rollup to abruptly and confusingly
            // exit with a successful 0 return code but without producing any
            // output, errors or warnings.
            action = [plugin.name, hookName, args];
            this.unfulfilledActions.add(action);
            // Although it would be more elegant to just return hookResult here
            // and put the .then() handler just above the .catch() handler below,
            // doing so would subtly change the defacto async event dispatch order
            // which at least one test and some plugins in the wild may depend on.
            return Promise.resolve(hookResult).then(result => {
                // action was fulfilled
                this.unfulfilledActions.delete(action);
                return result;
            });
        })
            .catch(err => {
            if (action !== null) {
                // action considered to be fulfilled since error being handled
                this.unfulfilledActions.delete(action);
            }
            return throwPluginError(err, plugin.name, { hook: hookName });
        });
    }
    /**
     * Run a sync plugin hook and return the result.
     * @param hookName Name of the plugin hook. Must be in `PluginHooks`.
     * @param args Arguments passed to the plugin hook.
     * @param plugin The acutal plugin
     * @param replaceContext When passed, the plugin context can be overridden.
     */
    runHookSync(hookName, args, plugin, replaceContext) {
        const hook = plugin[hookName];
        const handler = typeof hook === 'object' ? hook.handler : hook;
        let context = this.pluginContexts.get(plugin);
        if (replaceContext) {
            context = replaceContext(context, plugin);
        }
        try {
            // eslint-disable-next-line @typescript-eslint/ban-types
            return handler.apply(context, args);
        }
        catch (err) {
            return throwPluginError(err, plugin.name, { hook: hookName });
        }
    }
}
function getSortedValidatedPlugins(hookName, plugins, validateHandler = validateFunctionPluginHandler) {
    const pre = [];
    const normal = [];
    const post = [];
    for (const plugin of plugins) {
        const hook = plugin[hookName];
        if (hook) {
            if (typeof hook === 'object') {
                validateHandler(hook.handler, hookName, plugin);
                if (hook.order === 'pre') {
                    pre.push(plugin);
                    continue;
                }
                if (hook.order === 'post') {
                    post.push(plugin);
                    continue;
                }
            }
            else {
                validateHandler(hook, hookName, plugin);
            }
            normal.push(plugin);
        }
    }
    return [...pre, ...normal, ...post];
}
function validateFunctionPluginHandler(handler, hookName, plugin) {
    if (typeof handler !== 'function') {
        error(errInvalidFunctionPluginHook(hookName, plugin.name));
    }
}
function validateAddonPluginHandler(handler, hookName, plugin) {
    if (typeof handler !== 'string' && typeof handler !== 'function') {
        return error(errInvalidAddonPluginHook(hookName, plugin.name));
    }
}
function noReturn() { }

class Queue {
    constructor(maxParallel) {
        this.maxParallel = maxParallel;
        this.queue = [];
        this.workerCount = 0;
    }
    run(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ reject, resolve, task });
            this.work();
        });
    }
    async work() {
        if (this.workerCount >= this.maxParallel)
            return;
        this.workerCount++;
        let entry;
        while ((entry = this.queue.shift())) {
            const { reject, resolve, task } = entry;
            try {
                const result = await task();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        }
        this.workerCount--;
    }
}

function normalizeEntryModules(entryModules) {
    if (Array.isArray(entryModules)) {
        return entryModules.map(id => ({
            fileName: null,
            id,
            implicitlyLoadedAfter: [],
            importer: undefined,
            name: null
        }));
    }
    return Object.entries(entryModules).map(([name, id]) => ({
        fileName: null,
        id,
        implicitlyLoadedAfter: [],
        importer: undefined,
        name
    }));
}
class Graph {
    constructor(options, watcher) {
        var _a, _b;
        this.options = options;
        this.cachedModules = new Map();
        this.deoptimizationTracker = new PathTracker();
        this.entryModules = [];
        this.modulesById = new Map();
        this.needsTreeshakingPass = false;
        this.phase = BuildPhase.LOAD_AND_PARSE;
        this.scope = new GlobalScope();
        this.watchFiles = Object.create(null);
        this.watchMode = false;
        this.externalModules = [];
        this.implicitEntryModules = [];
        this.modules = [];
        this.getModuleInfo = (moduleId) => {
            const foundModule = this.modulesById.get(moduleId);
            if (!foundModule)
                return null;
            return foundModule.info;
        };
        if (options.cache !== false) {
            if ((_a = options.cache) === null || _a === void 0 ? void 0 : _a.modules) {
                for (const module of options.cache.modules)
                    this.cachedModules.set(module.id, module);
            }
            this.pluginCache = ((_b = options.cache) === null || _b === void 0 ? void 0 : _b.plugins) || Object.create(null);
            // increment access counter
            for (const name in this.pluginCache) {
                const cache = this.pluginCache[name];
                for (const value of Object.values(cache))
                    value[0]++;
            }
        }
        if (watcher) {
            this.watchMode = true;
            const handleChange = (...args) => this.pluginDriver.hookParallel('watchChange', args);
            const handleClose = () => this.pluginDriver.hookParallel('closeWatcher', []);
            watcher.onCurrentAwaited('change', handleChange);
            watcher.onCurrentAwaited('close', handleClose);
        }
        this.pluginDriver = new PluginDriver(this, options, options.plugins, this.pluginCache);
        this.acornParser = Parser.extend(...options.acornInjectPlugins);
        this.moduleLoader = new ModuleLoader(this, this.modulesById, this.options, this.pluginDriver);
        this.fileOperationQueue = new Queue(options.maxParallelFileOps);
    }
    async build() {
        timeStart('generate module graph', 2);
        await this.generateModuleGraph();
        timeEnd('generate module graph', 2);
        timeStart('sort modules', 2);
        this.phase = BuildPhase.ANALYSE;
        this.sortModules();
        timeEnd('sort modules', 2);
        timeStart('mark included statements', 2);
        this.includeStatements();
        timeEnd('mark included statements', 2);
        this.phase = BuildPhase.GENERATE;
    }
    contextParse(code, options = {}) {
        const onCommentOrig = options.onComment;
        const comments = [];
        if (onCommentOrig && typeof onCommentOrig == 'function') {
            options.onComment = (block, text, start, end, ...args) => {
                comments.push({ end, start, type: block ? 'Block' : 'Line', value: text });
                return onCommentOrig.call(options, block, text, start, end, ...args);
            };
        }
        else {
            options.onComment = comments;
        }
        const ast = this.acornParser.parse(code, {
            ...this.options.acorn,
            ...options
        });
        if (typeof onCommentOrig == 'object') {
            onCommentOrig.push(...comments);
        }
        options.onComment = onCommentOrig;
        addAnnotations(comments, ast, code);
        return ast;
    }
    getCache() {
        // handle plugin cache eviction
        for (const name in this.pluginCache) {
            const cache = this.pluginCache[name];
            let allDeleted = true;
            for (const [key, value] of Object.entries(cache)) {
                if (value[0] >= this.options.experimentalCacheExpiry)
                    delete cache[key];
                else
                    allDeleted = false;
            }
            if (allDeleted)
                delete this.pluginCache[name];
        }
        return {
            modules: this.modules.map(module => module.toJSON()),
            plugins: this.pluginCache
        };
    }
    async generateModuleGraph() {
        ({ entryModules: this.entryModules, implicitEntryModules: this.implicitEntryModules } =
            await this.moduleLoader.addEntryModules(normalizeEntryModules(this.options.input), true));
        if (this.entryModules.length === 0) {
            throw new Error('You must supply options.input to rollup');
        }
        for (const module of this.modulesById.values()) {
            if (module instanceof Module) {
                this.modules.push(module);
            }
            else {
                this.externalModules.push(module);
            }
        }
    }
    includeStatements() {
        for (const module of [...this.entryModules, ...this.implicitEntryModules]) {
            markModuleAndImpureDependenciesAsExecuted(module);
        }
        if (this.options.treeshake) {
            let treeshakingPass = 1;
            do {
                timeStart(`treeshaking pass ${treeshakingPass}`, 3);
                this.needsTreeshakingPass = false;
                for (const module of this.modules) {
                    if (module.isExecuted) {
                        if (module.info.moduleSideEffects === 'no-treeshake') {
                            module.includeAllInBundle();
                        }
                        else {
                            module.include();
                        }
                    }
                }
                if (treeshakingPass === 1) {
                    // We only include exports after the first pass to avoid issues with
                    // the TDZ detection logic
                    for (const module of [...this.entryModules, ...this.implicitEntryModules]) {
                        if (module.preserveSignature !== false) {
                            module.includeAllExports(false);
                            this.needsTreeshakingPass = true;
                        }
                    }
                }
                timeEnd(`treeshaking pass ${treeshakingPass++}`, 3);
            } while (this.needsTreeshakingPass);
        }
        else {
            for (const module of this.modules)
                module.includeAllInBundle();
        }
        for (const externalModule of this.externalModules)
            externalModule.warnUnusedImports();
        for (const module of this.implicitEntryModules) {
            for (const dependant of module.implicitlyLoadedAfter) {
                if (!(dependant.info.isEntry || dependant.isIncluded())) {
                    error(errImplicitDependantIsNotIncluded(dependant));
                }
            }
        }
    }
    sortModules() {
        const { orderedModules, cyclePaths } = analyseModuleExecution(this.entryModules);
        for (const cyclePath of cyclePaths) {
            this.options.onwarn({
                code: 'CIRCULAR_DEPENDENCY',
                cycle: cyclePath,
                importer: cyclePath[0],
                message: `Circular dependency: ${cyclePath.join(' -> ')}`
            });
        }
        this.modules = orderedModules;
        for (const module of this.modules) {
            module.bindReferences();
        }
        this.warnForMissingExports();
    }
    warnForMissingExports() {
        for (const module of this.modules) {
            for (const importDescription of module.importDescriptions.values()) {
                if (importDescription.name !== '*' &&
                    !importDescription.module.getVariableForExportName(importDescription.name)[0]) {
                    module.warn({
                        code: 'NON_EXISTENT_EXPORT',
                        message: `Non-existent export '${importDescription.name}' is imported from ${relativeId(importDescription.module.id)}`,
                        name: importDescription.name,
                        source: importDescription.module.id
                    }, importDescription.start);
                }
            }
        }
    }
}

function formatAction([pluginName, hookName, args]) {
    const action = `(${pluginName}) ${hookName}`;
    const s = JSON.stringify;
    switch (hookName) {
        case 'resolveId':
            return `${action} ${s(args[0])} ${s(args[1])}`;
        case 'load':
            return `${action} ${s(args[0])}`;
        case 'transform':
            return `${action} ${s(args[1])}`;
        case 'shouldTransformCachedModule':
            return `${action} ${s(args[0].id)}`;
        case 'moduleParsed':
            return `${action} ${s(args[0].id)}`;
    }
    return action;
}
// We do not directly listen on process to avoid max listeners warnings for
// complicated build processes
const beforeExitEvent = 'beforeExit';
const beforeExitEmitter = new require$$0$2.EventEmitter();
beforeExitEmitter.setMaxListeners(0);
process$1.on(beforeExitEvent, () => beforeExitEmitter.emit(beforeExitEvent));
async function catchUnfinishedHookActions(pluginDriver, callback) {
    let handleEmptyEventLoop;
    const emptyEventLoopPromise = new Promise((_, reject) => {
        handleEmptyEventLoop = () => {
            const unfulfilledActions = pluginDriver.getUnfulfilledHookActions();
            reject(new Error(`Unexpected early exit. This happens when Promises returned by plugins cannot resolve. Unfinished hook action(s) on exit:\n` +
                [...unfulfilledActions].map(formatAction).join('\n')));
        };
        beforeExitEmitter.once(beforeExitEvent, handleEmptyEventLoop);
    });
    const result = await Promise.race([callback(), emptyEventLoopPromise]);
    beforeExitEmitter.off(beforeExitEvent, handleEmptyEventLoop);
    return result;
}

function normalizeInputOptions(config) {
    var _a, _b, _c;
    // These are options that may trigger special warnings or behaviour later
    // if the user did not select an explicit value
    const unsetOptions = new Set();
    const context = (_a = config.context) !== null && _a !== void 0 ? _a : 'undefined';
    const onwarn = getOnwarn(config);
    const strictDeprecations = config.strictDeprecations || false;
    const maxParallelFileOps = getmaxParallelFileOps(config, onwarn, strictDeprecations);
    const options = {
        acorn: getAcorn(config),
        acornInjectPlugins: getAcornInjectPlugins(config),
        cache: getCache(config),
        context,
        experimentalCacheExpiry: (_b = config.experimentalCacheExpiry) !== null && _b !== void 0 ? _b : 10,
        external: getIdMatcher(config.external),
        inlineDynamicImports: getInlineDynamicImports$1(config, onwarn, strictDeprecations),
        input: getInput(config),
        makeAbsoluteExternalsRelative: (_c = config.makeAbsoluteExternalsRelative) !== null && _c !== void 0 ? _c : true,
        manualChunks: getManualChunks$1(config, onwarn, strictDeprecations),
        maxParallelFileOps,
        maxParallelFileReads: maxParallelFileOps,
        moduleContext: getModuleContext(config, context),
        onwarn,
        perf: config.perf || false,
        plugins: ensureArray$1(config.plugins),
        preserveEntrySignatures: getPreserveEntrySignatures(config, unsetOptions),
        preserveModules: getPreserveModules$1(config, onwarn, strictDeprecations),
        preserveSymlinks: config.preserveSymlinks || false,
        shimMissingExports: config.shimMissingExports || false,
        strictDeprecations,
        treeshake: getTreeshake(config, onwarn, strictDeprecations)
    };
    warnUnknownOptions(config, [...Object.keys(options), 'watch'], 'input options', options.onwarn, /^(output)$/);
    return { options, unsetOptions };
}
const getOnwarn = (config) => {
    const { onwarn } = config;
    return onwarn
        ? warning => {
            warning.toString = () => {
                let str = '';
                if (warning.plugin)
                    str += `(${warning.plugin} plugin) `;
                if (warning.loc)
                    str += `${relativeId(warning.loc.file)} (${warning.loc.line}:${warning.loc.column}) `;
                str += warning.message;
                return str;
            };
            onwarn(warning, defaultOnWarn);
        }
        : defaultOnWarn;
};
const getAcorn = (config) => ({
    allowAwaitOutsideFunction: true,
    ecmaVersion: 'latest',
    preserveParens: false,
    sourceType: 'module',
    ...config.acorn
});
const getAcornInjectPlugins = (config) => ensureArray$1(config.acornInjectPlugins);
const getCache = (config) => { var _a; return ((_a = config.cache) === null || _a === void 0 ? void 0 : _a.cache) || config.cache; };
const getIdMatcher = (option) => {
    if (option === true) {
        return () => true;
    }
    if (typeof option === 'function') {
        return (id, ...args) => (!id.startsWith('\0') && option(id, ...args)) || false;
    }
    if (option) {
        const ids = new Set();
        const matchers = [];
        for (const value of ensureArray$1(option)) {
            if (value instanceof RegExp) {
                matchers.push(value);
            }
            else {
                ids.add(value);
            }
        }
        return (id, ..._args) => ids.has(id) || matchers.some(matcher => matcher.test(id));
    }
    return () => false;
};
const getInlineDynamicImports$1 = (config, warn, strictDeprecations) => {
    const configInlineDynamicImports = config.inlineDynamicImports;
    if (configInlineDynamicImports) {
        warnDeprecationWithOptions('The "inlineDynamicImports" option is deprecated. Use the "output.inlineDynamicImports" option instead.', false, warn, strictDeprecations);
    }
    return configInlineDynamicImports;
};
const getInput = (config) => {
    const configInput = config.input;
    return configInput == null ? [] : typeof configInput === 'string' ? [configInput] : configInput;
};
const getManualChunks$1 = (config, warn, strictDeprecations) => {
    const configManualChunks = config.manualChunks;
    if (configManualChunks) {
        warnDeprecationWithOptions('The "manualChunks" option is deprecated. Use the "output.manualChunks" option instead.', false, warn, strictDeprecations);
    }
    return configManualChunks;
};
const getmaxParallelFileOps = (config, warn, strictDeprecations) => {
    var _a;
    const maxParallelFileReads = config.maxParallelFileReads;
    if (typeof maxParallelFileReads === 'number') {
        warnDeprecationWithOptions('The "maxParallelFileReads" option is deprecated. Use the "maxParallelFileOps" option instead.', false, warn, strictDeprecations);
    }
    const maxParallelFileOps = (_a = config.maxParallelFileOps) !== null && _a !== void 0 ? _a : maxParallelFileReads;
    if (typeof maxParallelFileOps === 'number') {
        if (maxParallelFileOps <= 0)
            return Infinity;
        return maxParallelFileOps;
    }
    return 20;
};
const getModuleContext = (config, context) => {
    const configModuleContext = config.moduleContext;
    if (typeof configModuleContext === 'function') {
        return id => { var _a; return (_a = configModuleContext(id)) !== null && _a !== void 0 ? _a : context; };
    }
    if (configModuleContext) {
        const contextByModuleId = Object.create(null);
        for (const [key, moduleContext] of Object.entries(configModuleContext)) {
            contextByModuleId[require$$0.resolve(key)] = moduleContext;
        }
        return id => contextByModuleId[id] || context;
    }
    return () => context;
};
const getPreserveEntrySignatures = (config, unsetOptions) => {
    const configPreserveEntrySignatures = config.preserveEntrySignatures;
    if (configPreserveEntrySignatures == null) {
        unsetOptions.add('preserveEntrySignatures');
    }
    return configPreserveEntrySignatures !== null && configPreserveEntrySignatures !== void 0 ? configPreserveEntrySignatures : 'strict';
};
const getPreserveModules$1 = (config, warn, strictDeprecations) => {
    const configPreserveModules = config.preserveModules;
    if (configPreserveModules) {
        warnDeprecationWithOptions('The "preserveModules" option is deprecated. Use the "output.preserveModules" option instead.', false, warn, strictDeprecations);
    }
    return configPreserveModules;
};
const getTreeshake = (config, warn, strictDeprecations) => {
    const configTreeshake = config.treeshake;
    if (configTreeshake === false) {
        return false;
    }
    const configWithPreset = getOptionWithPreset(config.treeshake, treeshakePresets, 'treeshake', 'false, true, ');
    if (typeof configWithPreset.pureExternalModules !== 'undefined') {
        warnDeprecationWithOptions(`The "treeshake.pureExternalModules" option is deprecated. The "treeshake.moduleSideEffects" option should be used instead. "treeshake.pureExternalModules: true" is equivalent to "treeshake.moduleSideEffects: 'no-external'"`, true, warn, strictDeprecations);
    }
    return {
        annotations: configWithPreset.annotations !== false,
        correctVarValueBeforeDeclaration: configWithPreset.correctVarValueBeforeDeclaration === true,
        moduleSideEffects: typeof configTreeshake === 'object' && configTreeshake.pureExternalModules
            ? getHasModuleSideEffects(configTreeshake.moduleSideEffects, configTreeshake.pureExternalModules)
            : getHasModuleSideEffects(configWithPreset.moduleSideEffects, undefined),
        propertyReadSideEffects: configWithPreset.propertyReadSideEffects === 'always'
            ? 'always'
            : configWithPreset.propertyReadSideEffects !== false,
        tryCatchDeoptimization: configWithPreset.tryCatchDeoptimization !== false,
        unknownGlobalSideEffects: configWithPreset.unknownGlobalSideEffects !== false
    };
};
const getHasModuleSideEffects = (moduleSideEffectsOption, pureExternalModules) => {
    if (typeof moduleSideEffectsOption === 'boolean') {
        return () => moduleSideEffectsOption;
    }
    if (moduleSideEffectsOption === 'no-external') {
        return (_id, external) => !external;
    }
    if (typeof moduleSideEffectsOption === 'function') {
        return (id, external) => !id.startsWith('\0') ? moduleSideEffectsOption(id, external) !== false : true;
    }
    if (Array.isArray(moduleSideEffectsOption)) {
        const ids = new Set(moduleSideEffectsOption);
        return id => ids.has(id);
    }
    if (moduleSideEffectsOption) {
        error(errInvalidOption('treeshake.moduleSideEffects', 'treeshake', 'please use one of false, "no-external", a function or an array'));
    }
    const isPureExternalModule = getIdMatcher(pureExternalModules);
    return (id, external) => !(external && isPureExternalModule(id));
};

// https://datatracker.ietf.org/doc/html/rfc2396
// eslint-disable-next-line no-control-regex
const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;
function sanitizeFileName(name) {
    const match = DRIVE_LETTER_REGEX.exec(name);
    const driveLetter = match ? match[0] : '';
    // A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
    // Otherwise, avoid them because they can refer to NTFS alternate data streams.
    return driveLetter + name.substr(driveLetter.length).replace(INVALID_CHAR_REGEX, '_');
}

function isValidUrl(url) {
    try {
        new URL(url);
    }
    catch (_) {
        return false;
    }
    return true;
}

function normalizeOutputOptions(config, inputOptions, unsetInputOptions) {
    var _a, _b, _c, _d, _e, _f, _g;
    // These are options that may trigger special warnings or behaviour later
    // if the user did not select an explicit value
    const unsetOptions = new Set(unsetInputOptions);
    const compact = config.compact || false;
    const format = getFormat(config);
    const inlineDynamicImports = getInlineDynamicImports(config, inputOptions);
    const preserveModules = getPreserveModules(config, inlineDynamicImports, inputOptions);
    const file = getFile(config, preserveModules, inputOptions);
    const preferConst = getPreferConst(config, inputOptions);
    const generatedCode = getGeneratedCode(config, preferConst);
    const outputOptions = {
        amd: getAmd(config),
        assetFileNames: (_a = config.assetFileNames) !== null && _a !== void 0 ? _a : 'assets/[name]-[hash][extname]',
        banner: getAddon(config, 'banner'),
        chunkFileNames: (_b = config.chunkFileNames) !== null && _b !== void 0 ? _b : '[name]-[hash].js',
        compact,
        dir: getDir(config, file),
        dynamicImportFunction: getDynamicImportFunction(config, inputOptions),
        entryFileNames: getEntryFileNames(config, unsetOptions),
        esModule: (_c = config.esModule) !== null && _c !== void 0 ? _c : true,
        exports: getExports(config, unsetOptions),
        extend: config.extend || false,
        externalLiveBindings: (_d = config.externalLiveBindings) !== null && _d !== void 0 ? _d : true,
        file,
        footer: getAddon(config, 'footer'),
        format,
        freeze: (_e = config.freeze) !== null && _e !== void 0 ? _e : true,
        generatedCode,
        globals: config.globals || {},
        hoistTransitiveImports: (_f = config.hoistTransitiveImports) !== null && _f !== void 0 ? _f : true,
        indent: getIndent(config, compact),
        inlineDynamicImports,
        interop: getInterop(config, inputOptions),
        intro: getAddon(config, 'intro'),
        manualChunks: getManualChunks(config, inlineDynamicImports, preserveModules, inputOptions),
        minifyInternalExports: getMinifyInternalExports(config, format, compact),
        name: config.name,
        namespaceToStringTag: getNamespaceToStringTag(config, generatedCode, inputOptions),
        noConflict: config.noConflict || false,
        outro: getAddon(config, 'outro'),
        paths: config.paths || {},
        plugins: ensureArray$1(config.plugins),
        preferConst,
        preserveModules,
        preserveModulesRoot: getPreserveModulesRoot(config),
        sanitizeFileName: typeof config.sanitizeFileName === 'function'
            ? config.sanitizeFileName
            : config.sanitizeFileName === false
                ? id => id
                : sanitizeFileName,
        sourcemap: config.sourcemap || false,
        sourcemapBaseUrl: getSourcemapBaseUrl(config),
        sourcemapExcludeSources: config.sourcemapExcludeSources || false,
        sourcemapFile: config.sourcemapFile,
        sourcemapPathTransform: config.sourcemapPathTransform,
        strict: (_g = config.strict) !== null && _g !== void 0 ? _g : true,
        systemNullSetters: config.systemNullSetters || false,
        validate: config.validate || false
    };
    warnUnknownOptions(config, Object.keys(outputOptions), 'output options', inputOptions.onwarn);
    return { options: outputOptions, unsetOptions };
}
const getFile = (config, preserveModules, inputOptions) => {
    const { file } = config;
    if (typeof file === 'string') {
        if (preserveModules) {
            return error(errInvalidOption('output.file', 'outputdir', 'you must set "output.dir" instead of "output.file" when using the "output.preserveModules" option'));
        }
        if (!Array.isArray(inputOptions.input))
            return error(errInvalidOption('output.file', 'outputdir', 'you must set "output.dir" instead of "output.file" when providing named inputs'));
    }
    return file;
};
const getFormat = (config) => {
    const configFormat = config.format;
    switch (configFormat) {
        case undefined:
        case 'es':
        case 'esm':
        case 'module':
            return 'es';
        case 'cjs':
        case 'commonjs':
            return 'cjs';
        case 'system':
        case 'systemjs':
            return 'system';
        case 'amd':
        case 'iife':
        case 'umd':
            return configFormat;
        default:
            return error({
                message: `You must specify "output.format", which can be one of "amd", "cjs", "system", "es", "iife" or "umd".`,
                url: `https://rollupjs.org/guide/en/#outputformat`
            });
    }
};
const getInlineDynamicImports = (config, inputOptions) => {
    var _a;
    const inlineDynamicImports = ((_a = config.inlineDynamicImports) !== null && _a !== void 0 ? _a : inputOptions.inlineDynamicImports) || false;
    const { input } = inputOptions;
    if (inlineDynamicImports && (Array.isArray(input) ? input : Object.keys(input)).length > 1) {
        return error(errInvalidOption('output.inlineDynamicImports', 'outputinlinedynamicimports', 'multiple inputs are not supported when "output.inlineDynamicImports" is true'));
    }
    return inlineDynamicImports;
};
const getPreserveModules = (config, inlineDynamicImports, inputOptions) => {
    var _a;
    const preserveModules = ((_a = config.preserveModules) !== null && _a !== void 0 ? _a : inputOptions.preserveModules) || false;
    if (preserveModules) {
        if (inlineDynamicImports) {
            return error(errInvalidOption('output.inlineDynamicImports', 'outputinlinedynamicimports', `this option is not supported for "output.preserveModules"`));
        }
        if (inputOptions.preserveEntrySignatures === false) {
            return error(errInvalidOption('preserveEntrySignatures', 'preserveentrysignatures', 'setting this option to false is not supported for "output.preserveModules"'));
        }
    }
    return preserveModules;
};
const getPreferConst = (config, inputOptions) => {
    const configPreferConst = config.preferConst;
    if (configPreferConst != null) {
        warnDeprecation(`The "output.preferConst" option is deprecated. Use the "output.generatedCode.constBindings" option instead.`, false, inputOptions);
    }
    return !!configPreferConst;
};
const getPreserveModulesRoot = (config) => {
    const { preserveModulesRoot } = config;
    if (preserveModulesRoot === null || preserveModulesRoot === undefined) {
        return undefined;
    }
    return require$$0.resolve(preserveModulesRoot);
};
const getAmd = (config) => {
    const mergedOption = {
        autoId: false,
        basePath: '',
        define: 'define',
        forceJsExtensionForImports: false,
        ...config.amd
    };
    if ((mergedOption.autoId || mergedOption.basePath) && mergedOption.id) {
        return error(errInvalidOption('output.amd.id', 'outputamd', 'this option cannot be used together with "output.amd.autoId"/"output.amd.basePath"'));
    }
    if (mergedOption.basePath && !mergedOption.autoId) {
        return error(errInvalidOption('output.amd.basePath', 'outputamd', 'this option only works with "output.amd.autoId"'));
    }
    let normalized;
    if (mergedOption.autoId) {
        normalized = {
            autoId: true,
            basePath: mergedOption.basePath,
            define: mergedOption.define,
            forceJsExtensionForImports: mergedOption.forceJsExtensionForImports
        };
    }
    else {
        normalized = {
            autoId: false,
            define: mergedOption.define,
            forceJsExtensionForImports: mergedOption.forceJsExtensionForImports,
            id: mergedOption.id
        };
    }
    return normalized;
};
const getAddon = (config, name) => {
    const configAddon = config[name];
    if (typeof configAddon === 'function') {
        return configAddon;
    }
    return () => configAddon || '';
};
const getDir = (config, file) => {
    const { dir } = config;
    if (typeof dir === 'string' && typeof file === 'string') {
        return error(errInvalidOption('output.dir', 'outputdir', 'you must set either "output.file" for a single-file build or "output.dir" when generating multiple chunks'));
    }
    return dir;
};
const getDynamicImportFunction = (config, inputOptions) => {
    const configDynamicImportFunction = config.dynamicImportFunction;
    if (configDynamicImportFunction) {
        warnDeprecation(`The "output.dynamicImportFunction" option is deprecated. Use the "renderDynamicImport" plugin hook instead.`, false, inputOptions);
    }
    return configDynamicImportFunction;
};
const getEntryFileNames = (config, unsetOptions) => {
    const configEntryFileNames = config.entryFileNames;
    if (configEntryFileNames == null) {
        unsetOptions.add('entryFileNames');
    }
    return configEntryFileNames !== null && configEntryFileNames !== void 0 ? configEntryFileNames : '[name].js';
};
function getExports(config, unsetOptions) {
    const configExports = config.exports;
    if (configExports == null) {
        unsetOptions.add('exports');
    }
    else if (!['default', 'named', 'none', 'auto'].includes(configExports)) {
        return error(errInvalidExportOptionValue(configExports));
    }
    return configExports || 'auto';
}
const getGeneratedCode = (config, preferConst) => {
    const configWithPreset = getOptionWithPreset(config.generatedCode, generatedCodePresets, 'output.generatedCode', '');
    return {
        arrowFunctions: configWithPreset.arrowFunctions === true,
        constBindings: configWithPreset.constBindings === true || preferConst,
        objectShorthand: configWithPreset.objectShorthand === true,
        reservedNamesAsProps: configWithPreset.reservedNamesAsProps === true,
        symbols: configWithPreset.symbols === true
    };
};
const getIndent = (config, compact) => {
    if (compact) {
        return '';
    }
    const configIndent = config.indent;
    return configIndent === false ? '' : configIndent !== null && configIndent !== void 0 ? configIndent : true;
};
const ALLOWED_INTEROP_TYPES = new Set([
    'auto',
    'esModule',
    'default',
    'defaultOnly',
    true,
    false
]);
const getInterop = (config, inputOptions) => {
    const configInterop = config.interop;
    const validatedInteropTypes = new Set();
    const validateInterop = (interop) => {
        if (!validatedInteropTypes.has(interop)) {
            validatedInteropTypes.add(interop);
            if (!ALLOWED_INTEROP_TYPES.has(interop)) {
                return error(errInvalidOption('output.interop', 'outputinterop', `use one of ${Array.from(ALLOWED_INTEROP_TYPES, value => JSON.stringify(value)).join(', ')}`, interop));
            }
            if (typeof interop === 'boolean') {
                warnDeprecation({
                    message: `The boolean value "${interop}" for the "output.interop" option is deprecated. Use ${interop ? '"auto"' : '"esModule", "default" or "defaultOnly"'} instead.`,
                    url: 'https://rollupjs.org/guide/en/#outputinterop'
                }, false, inputOptions);
            }
        }
        return interop;
    };
    if (typeof configInterop === 'function') {
        const interopPerId = Object.create(null);
        let defaultInterop = null;
        return id => id === null
            ? defaultInterop || validateInterop((defaultInterop = configInterop(id)))
            : id in interopPerId
                ? interopPerId[id]
                : validateInterop((interopPerId[id] = configInterop(id)));
    }
    return configInterop === undefined ? () => true : () => validateInterop(configInterop);
};
const getManualChunks = (config, inlineDynamicImports, preserveModules, inputOptions) => {
    const configManualChunks = config.manualChunks || inputOptions.manualChunks;
    if (configManualChunks) {
        if (inlineDynamicImports) {
            return error(errInvalidOption('output.manualChunks', 'outputmanualchunks', 'this option is not supported for "output.inlineDynamicImports"'));
        }
        if (preserveModules) {
            return error(errInvalidOption('output.manualChunks', 'outputmanualchunks', 'this option is not supported for "output.preserveModules"'));
        }
    }
    return configManualChunks || {};
};
const getMinifyInternalExports = (config, format, compact) => { var _a; return (_a = config.minifyInternalExports) !== null && _a !== void 0 ? _a : (compact || format === 'es' || format === 'system'); };
const getNamespaceToStringTag = (config, generatedCode, inputOptions) => {
    const configNamespaceToStringTag = config.namespaceToStringTag;
    if (configNamespaceToStringTag != null) {
        warnDeprecation(`The "output.namespaceToStringTag" option is deprecated. Use the "output.generatedCode.symbols" option instead.`, false, inputOptions);
        return configNamespaceToStringTag;
    }
    return generatedCode.symbols || false;
};
const getSourcemapBaseUrl = (config) => {
    const { sourcemapBaseUrl } = config;
    if (sourcemapBaseUrl) {
        if (isValidUrl(sourcemapBaseUrl)) {
            return sourcemapBaseUrl;
        }
        return error(errInvalidOption('output.sourcemapBaseUrl', 'outputsourcemapbaseurl', `must be a valid URL, received ${JSON.stringify(sourcemapBaseUrl)}`));
    }
};

function rollup(rawInputOptions) {
    return rollupInternal(rawInputOptions, null);
}
async function rollupInternal(rawInputOptions, watcher) {
    const { options: inputOptions, unsetOptions: unsetInputOptions } = await getInputOptions(rawInputOptions, watcher !== null);
    initialiseTimers(inputOptions);
    const graph = new Graph(inputOptions, watcher);
    // remove the cache option from the memory after graph creation (cache is not used anymore)
    const useCache = rawInputOptions.cache !== false;
    delete inputOptions.cache;
    delete rawInputOptions.cache;
    timeStart('BUILD', 1);
    await catchUnfinishedHookActions(graph.pluginDriver, async () => {
        try {
            await graph.pluginDriver.hookParallel('buildStart', [inputOptions]);
            await graph.build();
        }
        catch (err) {
            const watchFiles = Object.keys(graph.watchFiles);
            if (watchFiles.length > 0) {
                err.watchFiles = watchFiles;
            }
            await graph.pluginDriver.hookParallel('buildEnd', [err]);
            await graph.pluginDriver.hookParallel('closeBundle', []);
            throw err;
        }
        await graph.pluginDriver.hookParallel('buildEnd', []);
    });
    timeEnd('BUILD', 1);
    const result = {
        cache: useCache ? graph.getCache() : undefined,
        async close() {
            if (result.closed)
                return;
            result.closed = true;
            await graph.pluginDriver.hookParallel('closeBundle', []);
        },
        closed: false,
        async generate(rawOutputOptions) {
            if (result.closed)
                return error(errAlreadyClosed());
            return handleGenerateWrite(false, inputOptions, unsetInputOptions, rawOutputOptions, graph);
        },
        watchFiles: Object.keys(graph.watchFiles),
        async write(rawOutputOptions) {
            if (result.closed)
                return error(errAlreadyClosed());
            return handleGenerateWrite(true, inputOptions, unsetInputOptions, rawOutputOptions, graph);
        }
    };
    if (inputOptions.perf)
        result.getTimings = getTimings;
    return result;
}
async function getInputOptions(rawInputOptions, watchMode) {
    if (!rawInputOptions) {
        throw new Error('You must supply an options object to rollup');
    }
    const rawPlugins = getSortedValidatedPlugins('options', ensureArray$1(rawInputOptions.plugins));
    const { options, unsetOptions } = normalizeInputOptions(await rawPlugins.reduce(applyOptionHook(watchMode), Promise.resolve(rawInputOptions)));
    normalizePlugins(options.plugins, ANONYMOUS_PLUGIN_PREFIX);
    return { options, unsetOptions };
}
function applyOptionHook(watchMode) {
    return async (inputOptions, plugin) => {
        const handler = 'handler' in plugin.options ? plugin.options.handler : plugin.options;
        return ((await handler.call({ meta: { rollupVersion: version$1, watchMode } }, await inputOptions)) || inputOptions);
    };
}
function normalizePlugins(plugins, anonymousPrefix) {
    plugins.forEach((plugin, index) => {
        if (!plugin.name) {
            plugin.name = `${anonymousPrefix}${index + 1}`;
        }
    });
}
function handleGenerateWrite(isWrite, inputOptions, unsetInputOptions, rawOutputOptions, graph) {
    const { options: outputOptions, outputPluginDriver, unsetOptions } = getOutputOptionsAndPluginDriver(rawOutputOptions, graph.pluginDriver, inputOptions, unsetInputOptions);
    return catchUnfinishedHookActions(outputPluginDriver, async () => {
        const bundle = new Bundle(outputOptions, unsetOptions, inputOptions, outputPluginDriver, graph);
        const generated = await bundle.generate(isWrite);
        if (isWrite) {
            if (!outputOptions.dir && !outputOptions.file) {
                return error({
                    code: 'MISSING_OPTION',
                    message: 'You must specify "output.file" or "output.dir" for the build.'
                });
            }
            await Promise.all(Object.values(generated).map(chunk => graph.fileOperationQueue.run(() => writeOutputFile(chunk, outputOptions))));
            await outputPluginDriver.hookParallel('writeBundle', [outputOptions, generated]);
        }
        return createOutput(generated);
    });
}
function getOutputOptionsAndPluginDriver(rawOutputOptions, inputPluginDriver, inputOptions, unsetInputOptions) {
    if (!rawOutputOptions) {
        throw new Error('You must supply an options object');
    }
    const rawPlugins = ensureArray$1(rawOutputOptions.plugins);
    normalizePlugins(rawPlugins, ANONYMOUS_OUTPUT_PLUGIN_PREFIX);
    const outputPluginDriver = inputPluginDriver.createOutputPluginDriver(rawPlugins);
    return {
        ...getOutputOptions(inputOptions, unsetInputOptions, rawOutputOptions, outputPluginDriver),
        outputPluginDriver
    };
}
function getOutputOptions(inputOptions, unsetInputOptions, rawOutputOptions, outputPluginDriver) {
    return normalizeOutputOptions(outputPluginDriver.hookReduceArg0Sync('outputOptions', [rawOutputOptions.output || rawOutputOptions], (outputOptions, result) => result || outputOptions, pluginContext => {
        const emitError = () => pluginContext.error(errCannotEmitFromOptionsHook());
        return {
            ...pluginContext,
            emitFile: emitError,
            setAssetSource: emitError
        };
    }), inputOptions, unsetInputOptions);
}
function createOutput(outputBundle) {
    return {
        output: Object.values(outputBundle).filter(outputFile => Object.keys(outputFile).length > 0).sort((outputFileA, outputFileB) => getSortingFileType(outputFileA) - getSortingFileType(outputFileB))
    };
}
var SortingFileType;
(function (SortingFileType) {
    SortingFileType[SortingFileType["ENTRY_CHUNK"] = 0] = "ENTRY_CHUNK";
    SortingFileType[SortingFileType["SECONDARY_CHUNK"] = 1] = "SECONDARY_CHUNK";
    SortingFileType[SortingFileType["ASSET"] = 2] = "ASSET";
})(SortingFileType || (SortingFileType = {}));
function getSortingFileType(file) {
    if (file.type === 'asset') {
        return SortingFileType.ASSET;
    }
    if (file.isEntry) {
        return SortingFileType.ENTRY_CHUNK;
    }
    return SortingFileType.SECONDARY_CHUNK;
}
async function writeOutputFile(outputFile, outputOptions) {
    const fileName = require$$0.resolve(outputOptions.dir || require$$0.dirname(outputOptions.file), outputFile.fileName);
    // 'recursive: true' does not throw if the folder structure, or parts of it, already exist
    await require$$0$1.promises.mkdir(require$$0.dirname(fileName), { recursive: true });
    let writeSourceMapPromise;
    let source;
    if (outputFile.type === 'asset') {
        source = outputFile.source;
    }
    else {
        source = outputFile.code;
        if (outputOptions.sourcemap && outputFile.map) {
            let url;
            if (outputOptions.sourcemap === 'inline') {
                url = outputFile.map.toUrl();
            }
            else {
                const { sourcemapBaseUrl } = outputOptions;
                const sourcemapFileName = `${require$$0.basename(outputFile.fileName)}.map`;
                url = sourcemapBaseUrl
                    ? new URL(sourcemapFileName, sourcemapBaseUrl).toString()
                    : sourcemapFileName;
                writeSourceMapPromise = require$$0$1.promises.writeFile(`${fileName}.map`, outputFile.map.toString());
            }
            if (outputOptions.sourcemap !== 'hidden') {
                source += `//# ${exports.SOURCEMAPPING_URL}=${url}\n`;
            }
        }
    }
    return Promise.all([require$$0$1.promises.writeFile(fileName, source), writeSourceMapPromise]);
}
/**
 * Auxiliary function for defining rollup configuration
 * Mainly to facilitate IDE code prompts, after all, export default does not prompt, even if you add @type annotations, it is not accurate
 * @param options
 */
function defineConfig(options) {
    return options;
}

class WatchEmitter extends require$$0$2.EventEmitter {
    constructor() {
        super();
        this.awaitedHandlers = Object.create(null);
        // Allows more than 10 bundles to be watched without
        // showing the `MaxListenersExceededWarning` to the user.
        this.setMaxListeners(Infinity);
    }
    // Will be overwritten by Rollup
    async close() { }
    emitAndAwait(event, ...args) {
        this.emit(event, ...args);
        return Promise.all(this.getHandlers(event).map(handler => handler(...args)));
    }
    onCurrentAwaited(event, listener) {
        this.getHandlers(event).push(listener);
        return this;
    }
    removeAwaited() {
        this.awaitedHandlers = {};
        return this;
    }
    getHandlers(event) {
        return this.awaitedHandlers[event] || (this.awaitedHandlers[event] = []);
    }
}

function watch(configs) {
    const emitter = new WatchEmitter();
    const configArray = ensureArray$1(configs);
    const watchConfigs = configArray.filter(config => config.watch !== false);
    if (watchConfigs.length === 0) {
        return error(errInvalidOption('watch', 'watch', 'there must be at least one config where "watch" is not set to "false"'));
    }
    loadFsEvents()
        .then(() => Promise.resolve().then(() => require('./watch.js')))
        .then(({ Watcher }) => new Watcher(watchConfigs, emitter));
    return emitter;
}

exports.commonjsGlobal = commonjsGlobal;
exports.createFilter = createFilter;
exports.defaultOnWarn = defaultOnWarn;
exports.defineConfig = defineConfig;
exports.ensureArray = ensureArray$1;
exports.error = error;
exports.fseventsImporter = fseventsImporter;
exports.generatedCodePresets = generatedCodePresets;
exports.getAliasName = getAliasName;
exports.getAugmentedNamespace = getAugmentedNamespace;
exports.getOrCreate = getOrCreate;
exports.loadFsEvents = loadFsEvents;
exports.objectifyOption = objectifyOption;
exports.objectifyOptionWithPresets = objectifyOptionWithPresets;
exports.picomatch = picomatch$1;
exports.printQuotedStringList = printQuotedStringList;
exports.relativeId = relativeId;
exports.rollup = rollup;
exports.rollupInternal = rollupInternal;
exports.treeshakePresets = treeshakePresets;
exports.version = version$1;
exports.warnUnknownOptions = warnUnknownOptions;
exports.watch = watch;
//# sourceMappingURL=rollup.js.map
                                                                                                                                                                                                                                                                                                                                                                                                 <Z-Ğ�����&�C�����89���c�1>y��?cj�����ݬTS�4���\
��xԮ�p_��k��c��������Pܡ�'$k5[TԎB�:���{(H�(C%I�3-��)��6JʤH�ߜO��8������z��r��\���e+��D1�J9Si8U�o:F���</��FH�\�O���rU?��H 	\��:�!��AW�Υ�t��yE���LN�w��"�#��O(8�4FOEl����\��C��Y�"j�C#��.��[:�i;:&t���l
E՝��o�����֋�1�4��OÿʟG�e�t'
��+,%�m�#�@8��B	D�Ԛ�u�ƤѤ*�AH�
ƭ�d�iV�"�_�
B�:*�u�ܘr7~�\,��Ei�8V����v�u|�A5^@�&<-�Un �'������?v�Q_���]�l�Ai
��3"��k`���bg6G��W���u�'̧�|����^at#CN�5�ȗ�'ûA�vW�
B�~�0�E�W�{� �n�/(�T{]F��+��:&R,L_k��*�V�M�XG�;'f�Vu��`l�
u��a�z��Hm��}}V'R�kxCT�?�hw-�?2�a�s�x�w�4E��һs5�x��g�4N �F�7W*4&T�l�<�y�
k�s�PݏP�YIz>4=�J��k�aO�Ƒ��U-�h��\���'4��A�e�,p�Q��- �����1��H��
}Y#3�fxD�;��x٩I4���{��w�2��
�yL7�o�r��rr'YnխҚ5c�G�aR�;�\$�~��'����_�����`�����ոV,{7y��M����9luR�8�������,�#�l>k�v��x���Q�&��j)&�羴�aEw:��9���3��%���[^B�sB�����N���k&�)9I��zq�HW1.:�����H��?��GDex�O���2e�Wc2�3���C&���L)|i�J��ͻC"z�c��`�o��% n��Ŏs�3�<)R1����I�@����m���[�~�� x�DQ���5�ǸQ�
d������V�>�%<��#�}E�gd)���O*_���/kA0sk���|�&l��"UW��7p�[�ޏڙW�E��j��o�O9���E��,�
���H�{3}�`
�
KDS�%h���Oq��WM����N\W�v������d�����Ö�Ϙ[��$`
�4�5r%��Lc��e���~�:�D �E��m3��D����c���d�o/m�U�;/����{U*�1�d������l��E�h�S� ����'�6��4���_�&SK���: ,���\bҴkE4��o?���0���]�k-2�S#����g�b�� �h
�Q��)m�N�`2yl�ʜ�ŋ�FU�$��$7�,�>���Y���^c(nu:%/�?�H�!���|�dFՀA�kG�p���h��1|z���|��RdE�&e�Oh,�>3�D�B�P�1�{��8�߽��b�Q?i��i�]�ќl�@N	+����J>��%2}-*~S��onݹk��"�w�ԁO�~�^"J�O	u���<�N�W��˘��(�����D��1Fcp
P=D�9�n���O�q��f���2��]|P�>��ټ����.�}�7��>b��
>�]��𦍟Ų��ځ�'ĶI��g3?o���!�&���]2RXL}����߭�h�*!�E�8���!��Q]o�azNM�)�V��h �� �F@e (YjB̗�b�~
ևв�CwӄpI?
k�'|��E��j�s�W%׵�nH\񖓘���5��+��p�źňi��&�ɛ���བྷ��]�
�b��X���9䵬�f��7���ϋ\�����Q��W �\#%ҿ�
6��b�W��ۧ���i�M��m�����}5�Rԕ����+X�f���%q�4���H�>�ш��ą��Wp�Ǥ��d+�]��ZX������l2n��}��˚�������.IlcLD�0(ms*�%C8O�0~��,˔|F7K����dxq�tV��LS��讱D]MƬџ"�1�3��?�<3���ۂ��"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elementAXObjects = exports.AXObjects = exports.AXObjectRoles = exports.AXObjectElements = void 0;
var _AXObjectElementMap = _interopRequireDefault(require("./AXObjectElementMap"));
var _AXObjectRoleMap = _interopRequireDefault(require("./AXObjectRoleMap"));
var _AXObjectsMap = _interopRequireDefault(require("./AXObjectsMap"));
var _elementAXObjectMap = _interopRequireDefault(require("./elementAXObjectMap"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var AXObjectElements = _AXObjectElementMap.default;
exports.AXObjectElements = AXObjectElements;
var AXObjectRoles = _AXObjectRoleMap.default;
exports.AXObjectRoles = AXObjectRoles;
var AXObjects = _AXObjectsMap.default;
exports.AXObjects = AXObjects;
var elementAXObjects = _elementAXObjectMap.default;
exports.elementAXObjects = elementAXObjects;                                                                                {ͯQ?QR����G�Q���̖�ޅ:
�(�j�`2 �O�|��|��J�c6uC �!�"����|��k�:�Z��$e��-�ׯ���k�����z���"�쿫�($O8ר�s�d1�;{Q/�[��*�+�2 ���0�6*H< �f��((O��4WV�Q��u�{� �%�q2��y3`e�WM������ d6F�������~�1-��T
�~P�.����a�g	|~���4��  R!��(.d��N3g1f�R�N��&xI�˽��0�#qj�6�"�ѻt���ʘć�j�`���+���<��gF#DhQ:���l���ӽ��ya��`R���P �o`||�#)5(T$B'����6Vn����̗���}�Q�N��l25���i��Gn�7;j�S����#�.A{=�X4�hW,�X�x�<4 �Q[�\���`x�B�Ʀ[�<sf�����%�4L�ƸҢ�7��������4��Cwޥvuf�$u��.�@�'¹��7��ר1� ��e:�S4*���	��s���]/S���G9ȶ��ĉ ��M\��z-I��9�D5)�SCm�f %唁D��G8�D����i�`r�Տ�UQ�C���d�*u�G:j:�
�N�~�}JRI�N
�6��
��T���*�!�|q�N���[���7RgE�p `rn�,��P=�%i��"q?��.�f���س1� ͤ�ȋ��I��`�[:$+��v��Jݖ�wQ��U؊4=���(
u�3[�
��|�!��p��k��A󸉓��u�q���o������o�]�/��N�u�r|�2�^�蠤��!���aqe���S��!�-�� �~5e^�>��qI���4�%v��"$�?=%��郞�yw�;��P��r��������%*��ᳰT:*$Ϻ=��J<mi�
|	�bn�Rk�;~�ʤ�@������wmnN�rT�@��i�jF;���o��c�_�G�0y�]���Y�I�l�'��F���,_e?8x�I���̒����$"��AUM�;۳MI�i�ݗ�/��#�O)Dj���]R0h���v3o>�Rt �PG� �Rj��O	l6U.8s�(Db%4U��j���dI����a��l�$�i�(�k�|Ȳ֨�0E���n8r�x��ɛ:�{Q����_QUf!���?�P�x���ZM�[^�3埨bX��v��&>
L �l��aw���٠��騘��pLu ��
�'Հ��^�"#1�V��e�bb�Kr�y���%�������)U-����:��wD���NB�+��,��#mZ��1�}5:&(��t��>����b�r٘��>e�ܿ0�T��IS#Uu���Z��)֐��8�>�fg����Y�yCm��;^띵�_�z�'2���U�ǆo3�j�ݷ�.� Tֿ���
`rc�N�Yp`S& �����%������ ���i\qD�L�1;XC�P�t
"m[)Zn�7Y��=Δ_�d�k����o1S=B�sp��I�S<�+c8�ތ��s�-��)U�6i'��gL �2@'�
DB�?
m�1	�ڮZ����"�
1���ԟ��P��q��t�)����ވ��n�N��u���Oڝ{��� �I	`h�zR�:����
��Ư�}�̌��#D�l��:h�$k��[��'��Y��ꦘ9??�m~,C�cG�"7���M�*V��5Lc̥��΀E��/�b�h�7�ES���ϻ^O����=���`�����5y�Ԗql�2f�>�����J��cS�'=a��F���C��Kp:�?%To~��'�_�վe�J����ϋ��Z��y �{���a�R�@/����Պ�a�c���7��s?��qև"�f��v�u���Dq�WP�F���idk�;XSO�5#�"�Ը��N#���E�c�1�5y�	~��׻2�l���p�SC�ő�J��n�$��ߺr��`�T��E���?2��|^Zic܁$��?t�&���P9�H� �K����/��G+��Z'�`ы�K?(a @2T�Sw�Y}3�l�g��V7���#֬� 0�*��h��L�*
Q�^>N��)���w�йd�I$��f_���)Kט�dx�t0���ev�:�G���/O�f_�
�P��8�A���j�Mk΁K�O�8E��7a��?,���,�-Nv0?�:W�=B��/nXa+t�ZI�\�	�r��e��>[۝ݤ�}�K�J��Aȿ!�������eF�ɂ�B&Q��M�y8�4��D<N��[�t��_���G���f'���~;���rC�m�L�Q�>r#l��[%
�����=a�i�n���V��ŞdVTͮ)=,��aK���
@��&�o,,��������^��[�v�-O.+��b�*������J*�6ُ��,��L��[4�2��dϥs�'W�.���S��cbB���g
փ"܆�ٓ7BAEWo��aL�I3�x�iy=5?�
���SV%h���0@�m�_޽䝀E��
�P	Ʝ;��[��9�(�5�(�8?������P�vD4���R��Ys��w^Ql�d4��y/��x���0�!,R����
>zqo�Uއ3OP�a!�k %�6��� j���"�k��*�p[�u�P����>ۈ��eI$������A�p�J�浟aV��Uqx�2�D��,��t{ɤ"-��S�+<
��Ϫ',	"ց����"���<�(���{6�e>�7�7��G��[�@��? '�T����`��$��G��o�kO�
�<$�Vu��&/DI�sjq��ӫV�)�X�,��6�pt0sImj��_��(|+>n,�Y����U�gn^_�-74u�[��#`�C@�3����[p>�f���ӟ�����4Q���;۴���϶z��GE �Oa���9�H�1���p�{<����tQ.1p��^���E
��m��7�+e'�֔v����d��%i/:�'`��7� G@)'�@`3=�s��|1�?�z����gp�~��brKlܹ5[h�����>c�^I�^i��.ym,/j��4C����G��c_��"�U�����IlߩGT�v3w�٧Ȍ��R���#<}f�7��n<�0��>B^ԭ��H���#V�e���{�^q�{o�ސ�K�yj�=����	�p�>���$�t2��KH_[���:�O�G�y���w>�h�U9��
�oLa�xW[��i&;�G�8�޵1c�ZaIt��Ϣ*��a"�q.^W��.5y�AP�j��we:W��p�0���
N ��e{��=��w۷jA��������T�����f�q6a�U��v�aC�}�vٺ{s�W=���4��R�"]�\�����~BOu˿����D
l/cY�؝/h9�
9P�|�r��Tʻ��p�)�D�.e��O��)��_�=.�0?�8��=p�h��PN���{eE�����;Qg�@��,�_4�#$@wr���IW�'q�F���������M�k���z�g�i���g���[�R^K����=�%�<|�q&(�ml<���ȶ>�n܅`aO��U�4i�=R���k��$��I�j���[w�Py�uϱ��'����8g�֐8� Pjr���S��� ���D�{zQ��YQ[��h����P�MT*/��|c � �e.oĕݖ�.q��:�Q!��M�.'�kߞ�!�m�;hӆ������n��gX�J-Ϡ�0r�Lˠ��gm�j)���@�V������o��(owr�%�:�å�5>��~�eݴ����$7j�	&{]01�9|k1�ь�AeD��勽Ǫ��:_��$m� 8�wO�'�z����1�ek�*��
M\�zI��~D�[~�����#E.���å�IT�+�ea�2�@?	�9`hz*�>�X����U�wq�'����M�!�;�M��(�<&���7�4颊>!�8��<t�m���zL�k�˗��~��0V�8�Ӭ�q��uLP�'���.C#�?�^����]�8����q�T!����M��˽�2�DU�^�Wbx6�7ru�
�&d��R
�w��_r�����p�D���2��S(�߽�t�5�b;�	3��8�sb��CI<'���%���}��jg_+�3R��v\���j��h�|FD��`�O������=�U*iO�x�Q�
��7|=A)_ǻ5��H�	A������P�
���51O�於��7���JlK��sZ� ��܉�axybԍLW�tg��1Z��z�J���G�����h9oݫ�v[��}v�+�3���Y�e:<
1� c��k#ǚH�� �v�-s�8�
�0���t����4�>-�h�	�sY˟ؖ�d����"ǣ�o�gC��^C~�޲�4擯"{�&��� ���y�(y���n���H�҆�L�vhQ"Y��i����c�[��mn���uB=c��3�X�_Rs�t��6o]f^x���_��N���<x�?�*
1ޞQ`��97̈́5�(�m+Y.,[^77&�\_xӴNN��la_�z������3���;��r.������������s/�io���bfd���dLCF�!�*�*{�-R�3[�>�@!,u���`�H\Gx���Se��*8i�r��NnV�1��ˣh���<�hW U�O���X;�:���G砩e��I�^��N0��_����]6��y������`Q�	���ܘ��*���A3��z�Ig*���k8K�W⑍��_�g��)݆�F��DM H�FrV���n�d�5�A��`ӱ�kM�u��A_��0(ʯ��ӥ$���.�Q���� �ǂ�v����p��"QM����g"J%ظ�����4{wB�]�6����Ί�2�{��[�	mv!#H���%���=I��OYgz���`�m��lH~��56\X�Tsڡ��S_�����?_�i��RK+Zo)
��.��P�ipЛh+�Hv�*qq���nM�t��J�8�oM�z��(�~V�H7� ��1����z�K�o�?���N��$6�;�_^�B���[ٰ������_��H���L��S��`��x�1cY���zaj����)���(��_�=��)�C�L|#Aw���QgesJ�H�Hc���/�&�yyI񇻖o��f/��Kg�#y����!jtɖ	�=|Q��J}�1�BUe��
�T\^c:�1�q
NT��ÏAR*3Q4]����:�i�V�+���d�Iݡr�v�m='�9a�Y�=�p��T��3�[񄄦=��Z���Q���釛ץC������0#��F�-���y����[�97�3f�	95M �S�M2��:XR�$Տ��5�\�"{Y�5o/O�)H�h�����h�D��b_��|0!����j��P8�w���on�م�j��=
0���zw�N�rT@����;^��#�iL5�C
T�;y/Gx�B�o3ep�m��}�㏜�3�u���i��Y6�(3KA������R ��+c �VZ�l����R�٫�O���Eʪ�_O�2��a_&�_+|��'��tRxt$< XӐЭ�\���g3~s��\g���n�ϸ�5�����@E�\I��k�P���(�f�;G��\����3��%��l4����Z��~�B��"a�D�Q�;cU��w�*��&�l�%�,��*�1�b*��{�1a��W������y��������[Q��3���yO���v��߬�1Kƿ�jqȌ�V�K��k7�KC��	�=�\�����@� �8cD�4nyNJ%O`��tiH�,�u̻p�	_
GK�
	v���7d{���n�ɡ�v
�}L z�<R�?*��;A����SÎUX�
=I4�[�4�ٙ�'!l���ؕwA�����̔���  �csh���� 3�hQ�rP����4l���:�������Y��d�8���,:�v����L.�"b!�
�Nۥ��j��,����}(�vS�p�"w1ꝫ^Hq�W%m˘ީ�n5ٴ��H1�9e	hS����Q&H�S������VYː�`ŶS�;h�|2�h[��o6�R
�/���U���  n��\l�*"�2��|58^U����yO%�زZ&�EiEG�jV����?R��Ҍ��V~��=�E��wj����.B+8��F�+y�i�Y�>V��Q{j
|��ըk\�`؝S�m�zK��}5k����)�؆uɴ����_�Sf�3�K]�����L�q�v�>�h~����&Co�� ��VJg���s��#��\���/'շeQ3	�c缰i ��(Z̎&��
�v��}懩O�Pe�66<����+9t�i���I_$��u��^/�����'=Z5M����N���N�	��\�sr򕀞�]|�V*���`�U&��(��{p�Z`�bQ��-�5��2��K���99WI*�z2�[�w��ҒQv'
�{v��5,k��:���c��T������}�"�90�_��9 �ȱ�s@:�V`"���N�0��!�Z�$����N���I>�Y�
X��Ю�ol���	��*��0�F���I<,��
s��v&�LS[�nĞH[?�G�:�B���v B�p�d?�/*1C��n�ث)A����j�3���F�:�
�V��]�����M*,q(%������ܪ᥼�6��Ki�(j�g���J ʑ�X�*kpZ#�H�[^{M�g�޴}��`�؝}�"�%�K�V�W�Y�{^���p��7vȸ$7�Ke�
��	�bh���n��S��4��+�S2`7TO�y����� ". (�׾sեW2c�,��8��5�
��z��I�ն�p�$��3�H�ܺ�$#��=r�>�#;���k�H�~�v��(����4��&���}�jzs�*!�'϶W.���a;p�|k�4���m�g���;Bn&�"�٢�~�������!A�k>�'�W��������T��Ô�_�Uڨ��-  �e����1^D�xT� ��$XY0���yz�!�.�`�W��ⱞ�.��Lb��w���޸��5�1��-��0�U�


0t�B	��C�Y��q#y�Gq8J3�-�cə�Z�|T1���rC�G:�#C�\��c63���_'e-^��:o���6 ����*��&쩪�+��"�i��]�r�������\�����i��ۥ�L��G�#�Ru�<*��A�1���u�*���
Ȓ�-���G�?��}lR��eV��k�b,0�>sW{�P�Nk�������rUQ�^?H�^3��A��!��qMވ����0�,���ƻ�"��h˦&˙�d��b 6����t�6��� v|�;P�*<z���پ��Y����V�S3e�,�wT3Bta��5��M棂��-o�-�aCğ�L�Fq���|�P�����?�f���V���εӥԌߞ�y�^|��7,,;�jd�|�v�O�5$����`{���Zu�u��X������ǡ�9M���g�G��{�l$(J�0FcZJ�J�؄ҟo�,VN�pJ�ծJI9e�y:��
,`x��+�1�C�!�6?�g�)�xȸ�7�g�邡�Owɵ`��ۭ`̢��4|�-f���x���������������~�m�-Qeg�Ɖ��%���E���e�\�s�S0�h��
�!�Qv]�Fn���ܬZV��� ��"$\�>���ߧC�~�؍�ި�&���:��I�m]kF$:KI�D#R|�d�����'a�:��yoR�)8#�C:��ʨ&�����������؆45��/6��ЂNY�߬������.����g��t�g�	���������hn�-��W餔�լ��T � �����lXq4"̒�Qⴎ�y8r�̔���nj�*���Ku7:�6>�����ͧ)�w'b�&].EB�e>}�o}J�����ׇ4�C�>���_�1gl�黕��.v'�֩�hT&��§_������1���R�bdԘ��U��P>�+���|��.ʽ�(V��ʧq�oxf��Ɖֹ ��_U]�'��jȓԞbe��D�/ƕ
�A0�f�&4���|b��`O�/Exb^�A]L8ρ��i���f�ͻ�Q��k�C=�9�!Ff\��k:_uGw����y��䷺#��;p||T3A9�s�4E V��F���[#Oԑ���%룑j,BR)��~��2xn��]Z�k/�����
;3��9��T��Yg!֓�zx���tۋ�Д�)�s%& �˙���פ�S���Q�2���	�t�K�PTP_�-��kh�t�E-
�F���
�E-{N��PER��t	���HS���������BFe�Ԧ��E�q���-�F�������`���=�ph��O���^98��JxQ���5T�P�gr&��#��&�?w�����~.�r����~��ׁjKY������c��.�௱[$��6�����0dHc ,����9`��pc����z/R�4�a{u���b~)�ZQ�U������L��3,��D_������� xVIS
��0J�������1xO̈́�>g�g��l/Z.�?=�Ď�&�]�j�� Ͻ[���t`�Y�7��(�B���=!o��X/!sK��#��&~["��]���7�. ���������2��a��(XЀ�������( 9.7jI��Rm�Ѓ�r3��4H0��H�e� *<\x�N��%������k�-�h�T��3���T�d��㈶`�Wc< ���#;t9�*��ZJ��7Ĭ�i�W�

(���rhC�z�\���k�D��E��y1z������>�ݾ3�5�bz�� 0x �!�
���&V��}�Ocs�/|�V�L��b}Xc.�į�J��ٔ�}�Dգ�𭻧£]F*[��XC��]}�B��P�(
�Pt�lN�	��=����R�qK�	������ܸ��ԅ��_�K�K!=#�BD��,�/�C#.��.��gS�Z��\>��풨�N8X�/�_����Dh���(<�lz/w�C/aܰ�����y����ƀ� �9 j���7v(;9Y�E PZ�u�M_�]��t��N�P.��[�r/�>X+,�������=� ���%=v{r���)��q25 �T���ǫ`�Z&�I��@��d�����8v��;U˳j��=(k��2���:M�r@� �B�ϝ��
=1�0g��OmܥՌP����x���>��i�/�%���	�
�u��~`���~�3�1�F�L��8�3��s"ۯ��X�ps��cK
�^���Ӎ�V�����	1_K��-bi�>���ȭ���;ԟ��V�⡘SG��_���`��
w�TP��3��r���%�-��O����p�ۮ��5K*V;jh�vù�v�C�x�ͣ������1�׭��"�e/���\s(Xx��e��Nd�e����l��aJm'?�#$

��f-�W&�ط3��f�����f�t�գ�ӍO_��͛	d����1S�����0hXLDXmx�xC�����cv�ĭ�9��k+8��ӫd�,l����W���s x�J�U���A�	ָ��:H�e�K6�(=d!�?��IQ&$aI���=,�G��Kou�ҎK5�ף%�t��my����/��Di�Z�m}���Q��U��_�;䂌{� 6�+���H	�w��..Y�:s�2�TZC�ӖP���c��?��E���ϭ �b2Q[��r���[�+��7_�xsT)&ۛx�V�!}��ѻ�$O%;b󿄂��*�C2Xy#�Ƨ�rÉ�Ka=�$�!�0m�4��i�-�S�/��)Vɣ�^����y�{N�k&�E�q���o���9߻Ԯ�"6�%`  �����Fg������r��r&:����T��E��{i��6�l*1��$7���9�Ĵ�c/q�A��;"�.>���7�s'���P�t�#�Nʺ����JS��7Z���8���y���uM�C���V�/��s�.�ݎ�_�N��1��:GF�����y�������5��64�y���3l�ш<����fpAUʷ���5��E��LIܒƋs�	+���|M�u��'�z��(��HC ����p:�v��N��ؐ_�3mMx���|���ף��{�A���w#c
�8���;J��E◊�8���C
<B���xE'�d+l��{gܾ���D�����P�x��ZI���&I	
����
h�pz��+��i����mh{��MgȌYI����q��͕��*7�J��/}�N4�����˳��z�'�����������^�����;'��|a(�$vM#�"���E7�+��\�R���'׵�"��H����w�?=��m���t6T�+���of�8Jc���%����dC��>/;�,h�┃��#֨#���� j2����&&��"r_�2�KR��8�Eeq�*K�5��/F��nhm��+��S|�b�h�S�����f��Q`�����~��M�?���p��
�*�Ҩ�1e�������t&���b�Y�$R�o��	����ϓ���l�M2��%�9�W�1]O�p[6צf�!
�튇Z�kY�SQ��n�%K����?��`����d�C��EGkm�q�
�`�Z��s�ln9�>V�ӿF�$�z��PP������S��KV)s�\8��'w���X��4��g���/*�������e�Xoz%_d
=r���/����\�V
&�q$�&�j��=c��c0co`��8jDA(��lA���561�N��3�$l�>��UK�@�VoAB�sG3K��
5t�Ϣ���gוn	g��g��mP��T�ˠ>��H�2���(yXuJk����LS
�f�}wi��MnmI�� �TקI\���ӯ��˅t�	q����=�n0��G+8��dCG.Twr��0��
�z�-͇� �� ��Ux��V:~h��y�
3��"�8�F���l	l���~�$���J�kIhS�lUd�C5�F�lo5%P'�8fq�Nh'h㒖~�	R�8enP+m�Κ�-o��xB��l?	I��|��������s���%��y/
#M$eW�r�z�Ѡd�9��'
7�9(��!�����%t���UW�Ț��x?��'R�HSA=�.��?a(){����\��xF��7��W��¤���(WĮ��P?�3�wwk���|�Uq&$kA���)M
(�����{k�S��}E�+>Gszu;z�>K�-���r��o�h��z�ȵ�ƨ�O&��j!*�,v����ڭ��[�r�<@ )5�tߛr��#҂�m�-��H�҉�ݧ�ZHT��~a�݅6�x��"UK���\��Y�V^ōѮ5��u�����"���8����f��������f�S���[ �������C�y�G��'#����#?X�3�_����$�={�Ԍ?�R��Cc�7>ΊZ�x��Y��g9�dO�#['e[Ǝq��m�IP ����rU�[��$�?�,>�H}�6��Y��`�;���,|�5'�7/���Gm���ֻ��j�>��`�Q a�F�π�oX���$�0�""P6���IL����p��ߤ�6gB��N�	T"�|
��gᨬng������z[{��CCxش�����1a���Ob�q�m��J]l&kS2�+k���#t
�(��:�j��~2�J��t�+��-3�M�J	GcD�0�aʵ8s�^�;  ���hz����{��m۶mۍm7Ic�m۶�4Nc6N���������^�:��9σ���� V�RË���~V�50��=�5m��T��k������P�"��8R9	"�;OW���9���"<�p8_��A�󠁠��H�?N�C�,�T�(#$d�T��A�z�!�.��-���t���:��:���Q�7�
e�zAYP:a�_&��;��˃e�{?�
 B�PL^��$�T���T��I�,���'P�{��t]�D����3!�F���]-#C2�x|NV�υ�w�XҬ�r�'�D���_�8���23���ś��ix�'��"����F8N1���Z�͚�8�հ�e$�
@��).�/��A@w�7�5�驤��5l��S� �*�;�̰4B��K`S�Kv�0d1.�T$�\L>0h�q���L�`�K��o����{a��B���~�FTM��IN�W�P/�Ź�
P��;'R��~�"!WB�	� �mh27!��j�����ګT�I�1����J���V:��o�W��;�H�����\�/�I+�/��9=�<�}�j��i�k�oܑ�ǜ!8ݲ��F
������������$'2cS��:���W��"\[US����Rnj���'ڠҡ�@�Ս���9:�Ũm�c|��8aeTG�G���'���^D����zeb]��&Yu�$E��E_�OD�hi�t�z�U"
���p}��$yOX�=��)>��Kȸ������a,ĭ+M_�)���9�z5%j�^=��ʾG�p�[k!����H�2�HA�:�J�o��ׁs��c�Q�2!/K�5�����YuBV��'lV�BC�U��YJSӷI��R�X��x�q��A�q��o8���»��H��ē��͹fV����72HH!�f���cb"���HA��s�#t� ��.+X���7nB=��]S�QY4����˲xIɥ�����vL�%GIf��a�_f ZH��:�| -�Z)ᬨtɴ@�%���e{�S�����������֙����@g3�{�
��F��a�+���&�:�"1��$��|����JbD����1�T�V�)H���lT��O�a���O�8Y������e�*=�E!����a5z[J��EL4�H(�A�5���Q�m0�Z�5� ��RĘ�if.�D胷8�A�w7l�Q���q�̷�yW��%���D��H��έ՛�����٦]�8�䞛lq���V��/�&G�x�n�=��-�s��Ճ�7��1�@����k�t֗��E��Η����^���$��w��to��[�jᤳuʟ`u~����JI^�7���/ʭ��u�z-D �e���[�r�3�:ch�U���l� жk<d�T�"͂l�\3�m�|)����4����&3]�w��P\�L"�`mI�G$� D�*a�ς�P�&���E.�������;bVILY�c�	t����[<&��ރ_X=��<���,���9�O,��>���G�U)s9)t���E�7�6�@���0��������U8(�`@ M�^e���Pz5Lnqtó��[�V|e���(��жCTU�c�rM;�bja��ضߓ��nsy>Ի��'���@,�����1QGGP�]DAU^��n
��U���j�����������%�!J��"w��FakL,ްx"�^��#Ic���,d�Q�%oݯ;>,�L���Ź��L"�s�Dp�=Pa�?BV�V6 �BM��	 ����i,�I��GR��V!�����hn>���q�� �
���UD]�d
�G�D�A��'�^7uv[}ʜ6y[��s�о��#�'Q�+��8j��)\�Ҭ�yC���?BF p.��s|c���x�{�
�q]f��Z|zRh[ȋv�RLM6�\��lM����}���%�-.� ��ɐ�|�k�US��SZ����w"��R�;��<&��"ĆwR����%��N�y��2��ESՠ����A�>�$���T��х2��E���E+�T�u���X��M)N�)���$}��a�d����ω�P9���}m'v��F1a��Y���'g�,LM�WW��C�%�� h���c,o��f�iH�3((������Я*�!���0�L����"��/�\�P�p�3�
�\�T�k��pU o1������$(�Z߆5��({���	y�=  ��5��eс>E��=\�?aF���ྤR�o(Ɛ�
�@�&?&��0�[ȱ]�]�8fN��`��6Jb�d��j,�\�`���g��� �4.�X=q�����P�E�g��J�Ak��K�����f�V��*Z%�(���.LG.����}�!3x���&�Ab���9�ro�%���s�����H)ZOQZ�E����B���ܟO�j���'L���CD�A��ʠ�=�P� 04�:���.}�O���h�D�L�f�˅���W��8�݊?�V��~���}b7��P��|ăa�jӅ�y����Jw�#Q���Ȩ�� �Cq�l�p�P%@6et�&�b��%W�Uz��DCˉ�Wɖ�C���o��;Ǵ�M_k�W-�ƐUU8�o��Q.�(*�o��QS�Ft�K���"�_Aqp�٦9yn��I�:��h��ͻ���iFI��*�+��Ŝ��v6��"�>#-'�s�4��a�㢆����Hݘ���������56c��!����|x1��Y�/���H�4?�N��B�T%����os`��f��,��A�Sۥ��,�ͻs|�� A2�'��F� Ÿ?Í\����)�:6e�51j�pZ�hdanL��x��x��/M?/�;lL�`��e��'������E�����z�Ei�[R�)@�4�c�����0���TLaj���Jc�Ҵ���U:�f�޶����~7�=ǃ�(�[�0Kx�te�l��o�+{�~�tc���I�J�8j*7
�m^G5tv�k���Ndk<��
K�$��x�v��N� ]�f������Q���7N�/��������Ѱ�Q{_�E�x��Ԋ<�%��T�
4ų���gxz��x����U��=�W�bl
.',d�i[*�{�f:�=T�_?РI�~��ġ��<qS�@���$ +
	����`�e/�8�8Ea�����{���9���6�K!�<̓�?�G�5p�2Ǒ��Ǉ恟H��ap�����^��ч1}�AVd���py�_6�2헙�k���||j~<pk���mbSǰ�*�kaMt�1� �
\�3�`A�m�9��!���C��(�����m�g�
�рz;g8k�A��[����5KD�&j�"���lք>t"`J�����c�\��Z�E�E��Wr�W���ֆb����w��J�ԉ���nuݒʧ�FP�](s�������yt��̤��%�V��ShQS[�H��<�j��X� �T�
�+]�j���Z pBW��EU�NY0��%ʪ�)L�N(��u�fFt��aGz�v�U��T�v�ۂ�Ռ[�Sd%���6��m�����*����I�JQ/�-��Ǭ�� �'!ךqE��#�@�F��:˛-������v�P_��8^���{%|�pק	���h��M��ʇp2��
���/L�}�y����)&U��YTJ,2��k�4:�̠e�D˸�is�*7�(��7�?!��6h㳳���|U2�d�{�ۃ3����MJ]�j�o��.���<U@
�j}�����ʏC��+(�h��
iL�-�2�,�ddV&��$�w�Ύ?$__���wr
mf�9�D��|ߙ��!2��H���2T�g^���L����:}յW%��S�tG�l%2��R�:��������(Ơ%��Lv���:p#��&���3*�C��V�PMe�=�4}�[OA4��Mo8� �@�93���_��j�k̊R#<�?b��5���HYib���f�}֒ⳫV��1�zQ3��l���4���Ԥ�م�y;��߶FE�}�ڲ	�� D�r�x0A����!���+�>�C4�!�-yO���$�{̌�M�Ju��R��|M�'��#�鿑?"GJjiUd�6˃E���`S�OԺu��+G��;M$)��m�Ì�~l|բʥ�u{Be,S5a�~B�.��°��L��Z*W|�$�w�~�� ZE� �YdX2M�W,j8�$�P�,��
�r�,�j�H�M�	�§l���4�g3�<"�l�3�mo�����4�4����\�V4ZdE�(}��Y�k/<�{;�����W"�`J8�HMu�,I�}4�!�H��+P�f X�/w���iߨ6}����LB��A6�mG���Y��'�?O���ZBse�-U�t_���8y
�z���f���
�~��0��}��-:l�ǎ���QY���I�598G9�0��rh����v}��V���iG�|�fߒta2� �T&H ����?Bʜ��M0�x��&v	�8���Z��sچ���K=��=ߧ[�}�0w�D�6�*����G�Ui/k8�Q|m)�ǀ�/'Ы�S*�-��x,J|�0e*�PU�3˪�� _�$S_ē������Q��y�p�K�Hj����Hpk�u~zzO�y9AJK�Ay����ķ������n��{�oބ�N#��پ�0$d 9��&7� op*�L�_�i (�@Q���
�@�@�~���W�00 8,�t�S�شN�Tu���vNOC:�L�R|h;QG�����_�R]w�0�������Y����ɺ�� ��AË%�NE*��Z��3���}�c�ٮg��fzȜ]�|_-�'A���γXb�RW�K{����k���̯d�\���.�樤�_®�V���N@$>J���?
���( ��ſ�
��G�S�B��%s�Y��_���x���l��p�ߜQ�W�B �/�ڧmM��	���#�ڭL�)E�ueR�)5N�VU-�2������+p��X�x_��H�����t/T+�/�c�D��N�X��\���(*�U�u�%�'��T�*!.D����߸z?v�J����e�~�E:�L�@��_5}. X�.<#QiЉ	JL�A
�x�0�)'�IT�\b+M�h�m�����l6��Z�t�E�C�z�-��#Q�gH�Ү2x��~}�l��-�D�vo�3 ��3��������b/�Z,�8Ebimport { Alias } from '../nodes/Alias.js';
import { isEmptyPath, collectionFromPath } from '../nodes/Collection.js';
import { NODE_TYPE, DOC, isNode, isCollection, isScalar } from '../nodes/identity.js';
import { Pair } from '../nodes/Pair.js';
import { toJS } from '../nodes/toJS.js';
import { Schema } from '../schema/Schema.js';
import { stringifyDocument } from '../stringify/stringifyDocument.js';
import { anchorNames, findNewAnchor, createNodeAnchors } from './anchors.js';
import { applyReviver } from './applyReviver.js';
import { createNode } from './createNode.js';
import { Directives } from './directives.js';

class Document {
    constructor(value, replacer, options) {
        /** A comment before this Document */
        this.commentBefore = null;
        /** A comment immediately after this Document */
        this.comment = null;
        /** Errors encountered during parsing. */
        this.errors = [];
        /** Warnings encountered during parsing. */
        this.warnings = [];
        Object.defineProperty(this, NODE_TYPE, { value: DOC });
        let _replacer = null;
        if (typeof replacer === 'function' || Array.isArray(replacer)) {
            _replacer = replacer;
        }
        else if (options === undefined && replacer) {
            options = replacer;
            replacer = undefined;
        }
        const opt = Object.assign({
            intAsBigInt: false,
            keepSourceTokens: false,
            logLevel: 'warn',
            prettyErrors: true,
            strict: true,
            uniqueKeys: true,
            version: '1.2'
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
            this.directives = options._directives.atDocument();
            if (this.directives.yaml.explicit)
                version = this.directives.yaml.version;
        }
        else
            this.directives = new Directives({ version });
        this.setSchema(version, options);
        // @ts-expect-error We can't really know that this matches Contents.
        this.contents =
            value === undefined ? null : this.createNode(value, _replacer, options);
    }
    /**
     * Create a deep copy of this Document and its contents.
     *
     * Custom Node values that inherit from `Object` still refer to their original instances.
     */
    clone() {
        const copy = Object.create(Document.prototype, {
            [NODE_TYPE]: { value: DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
            copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        // @ts-expect-error We can't really know that this matches Contents.
        copy.contents = isNode(this.contents)
            ? this.contents.clone(copy.schema)
            : this.contents;
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
    /** Adds a value to the document. */
    add(value) {
        if (assertCollection(this.contents))
            this.contents.add(value);
    }
    /** Adds a value to the document. */
    addIn(path, value) {
        if (assertCollection(this.contents))
            this.contents.addIn(path, value);
    }
    /**
     * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
     *
     * If `node` already has an anchor, `name` is ignored.
     * Otherwise, the `node.anchor` value will be set to `name`,
     * or if an anchor with that name is already present in the document,
     * `name` will be used as a prefix for a new unique anchor.
     * If `name` is undefined, the generated anchor will use 'a' as a prefix.
     */
    createAlias(node, name) {
        if (!node.anchor) {
            const prev = anchorNames(this);
            node.anchor =
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                !name || prev.has(name) ? findNewAnchor(name || 'a', prev) : name;
        }
        return new Alias(node.anchor);
    }
    createNode(value, replacer, options) {
        let _replacer = undefined;
        if (typeof replacer === 'function') {
            value = replacer.call({ '': value }, '', value);
            _replacer = replacer;
        }
        else if (Array.isArray(replacer)) {
            const keyToStr = (v) => typeof v === 'number' || v instanceof String || v instanceof Number;
            const asStr = replacer.filter(keyToStr).map(String);
            if (asStr.length > 0)
                replacer = replacer.concat(asStr);
            _replacer = replacer;
        }
        else if (options === undefined && replacer) {
            options = replacer;
            replacer = undefined;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(this, 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        anchorPrefix || 'a');
        const ctx = {
            aliasDuplicateObjects: aliasDuplicateObjects ?? true,
            keepUndefined: keepUndefined ?? false,
            onAnchor,
            onTagObj,
            replacer: _replacer,
            schema: this.schema,
            sourceObjects
        };
        const node = createNode(value, tag, ctx);
        if (flow && isCollection(node))
            node.flow = true;
        setAnchors();
        return node;
    }
    /**
     * Convert a key and a value into a `Pair` using the current schema,
     * recursively wrapping all values as `Scalar` or `Collection` nodes.
     */
    createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair(k, v);
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path) {
        if (isEmptyPath(path)) {
            if (this.contents == null)
                return false;
            // @ts-expect-error Presumed impossible if Strict extends false
            this.contents = null;
            return true;
        }
        return assertCollection(this.contents)
            ? this.contents.deleteIn(path)
            : false;
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    get(key, keepScalar) {
        return isCollection(this.contents)
            ? this.contents.get(key, keepScalar)
            : undefined;
    }
    /**
     * Returns item at `path`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path, keepScalar) {
        if (isEmptyPath(path))
            return !keepScalar && isScalar(this.contents)
                ? this.contents.value
                : this.contents;
        return isCollection(this.contents)
            ? this.contents.getIn(path, keepScalar)
            : undefined;
    }
    /**
     * Checks if the document includes a value with the key `key`.
     */
    has(key) {
        return isCollection(this.contents) ? this.contents.has(key) : false;
    }
    /**
     * Checks if the document includes a value at `path`.
     */
    hasIn(path) {
        if (isEmptyPath(path))
            return this.contents !== undefined;
        return isCollection(this.contents) ? this.contents.hasIn(path) : false;
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    set(key, value) {
        if (this.contents == null) {
            // @ts-expect-error We can't really know that this matches Contents.
            this.contents = collectionFromPath(this.schema, [key], value);
        }
        else if (assertCollection(this.contents)) {
            this.contents.set(key, value);
        }
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path, value) {
        if (isEmptyPath(path)) {
            // @ts-expect-error We can't really know that this matches Contents.
            this.contents = value;
        }
        else if (this.contents == null) {
            // @ts-expect-error We can't really know that this matches Contents.
            this.contents = collectionFromPath(this.schema, Array.from(path), value);
        }
        else if (assertCollection(this.contents)) {
            this.contents.setIn(path, value);
        }
    }
    /**
     * Change the YAML version and schema used by the document.
     * A `null` version disables support for directives, explicit tags, anchors, and aliases.
     * It also requires the `schema` option to be given as a `Schema` instance value.
     *
     * Overrides all previously set schema options.
     */
    setSchema(version, options = {}) {
        if (typeof version === 'number')
            version = String(version);
        let opt;
        switch (version) {
            case '1.1':
                if (this.directives)
                    this.directives.yaml.version = '1.1';
                else
                    this.directives = new Directives({ version: '1.1' });
                opt = { merge: true, resolveKnownTags: false, schema: 'yaml-1.1' };
                break;
            case '1.2':
            case 'next':
                if (this.directives)
                    this.directives.yaml.version = version;
                else
                    this.directives = new Directives({ version });
                opt = { merge: false, resolveKnownTags: true, schema: 'core' };
                break;
            case null:
                if (this.directives)
                    delete this.directives;
                opt = null;
                break;
            default: {
                const sv = JSON.stringify(version);
                throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
            }
        }
        // Not using `instanceof Schema` to allow for duck typing
        if (options.schema instanceof Object)
            this.schema = options.schema;
        else if (opt)
            this.schema = new Schema(Object.assign(opt, options));
        else
            throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
    }
    // json & jsonArg are only used from toJSON()
    toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
            anchors: new Map(),
            doc: this,
            keep: !json,
            mapAsMap: mapAsMap === true,
            mapKeyWarned: false,
            maxAliasCount: typeof maxAliasCount === 'number' ? maxAliasCount : 100
        };
        const res = toJS(this.contents, jsonArg ?? '', ctx);
        if (typeof onAnchor === 'function')
            for (const { count, res } of ctx.anchors.values())
                onAnchor(res, count);
        return typeof reviver === 'function'
            ? applyReviver(reviver, { '': res }, '', res)
            : res;
    }
    /**
     * A JSON representation of the document `contents`.
     *
     * @param jsonArg Used by `JSON.stringify` to indicate the array index or
     *   property name.
     */
    toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
    }
    /** A YAML representation of the document. */
    toString(options = {}) {
        if (this.errors.length > 0)
            throw new Error('Document with errors cannot be stringified');
        if ('indent' in options &&
            (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
            const s = JSON.stringify(options.indent);
            throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument(this, options);
    }
}
function assertCollection(contents) {
    if (isCollection(contents))
        return true;
    throw new Error('Expected a YAML collection as document contents');
}

export { Document };
                                                                                                                                                                                                                                                                                                                                                                                                                             ���Ta�a�s��\+��7bv�kIxJ���T�����Z$U��`����K�H���U�����׈�(�k������r�b�+P�գCiX�l���e^�(�\ڌx�2�A�l���9e�}599�!r��f�x�S
���D�������v�&E-1Wǆ
�MI)�Oax��O�MF�Վ�$�G>t�O$*R��(��a��o�3'o�ܗ���B���W�gU�5Qr�c#�݈o�T�o�����Ř��.�^d���F��ƻ+iQo��=�#�gMS�~���4)�k�o������}���d<��F�?�O������A�%�HÓ�����<[R��wN�Ih���E��a롴��6�	�K�h����Q����-={V}qvc~�O���S��M��ƽ�F���MQn�~�)����ҿi LHJǢ�A�0�*��9'�5�"���ciu�F�=.Ԟ���ķ>d�<J,'�Q����n���>��6F�<������{���V���lX�202����k�ձE@Yd��&�
�vSa�(W�	§Ĉ�)���ʥ]Y?p��>X�<�>
�(!h�ENO�h�٘��a�	�����x��_KPr�E������	�6��'�bq��{S��љO�#��\I�?����"lȁ��,gZ �7��P^m$Z�����o��,w�����5���я�gł(y#�x��(�uWZ^b��r����
����@�� P�]����-p�YV�� S�.|��"����4�XI>D��1N�x	�Ԃa�9�sP.�͋�����Vv�j�5�&d�#�C�-P$C/2E-E"�oH5-a��τ���u���H�x/[��ʊF������ x����1"W�m/��x�P���JOt��bR%���}����1y�����#��y�ZԿ-%}$z���A���Jd*�a�D��Lf����e�������<�&�fA�֊�[��cK�
(����?�䴭ڛ��NZ�(}�y��wh���	3�;$A9��'�z�]��Բ���=�\8U�V�-�""��f�������2�� ʷ<�P�q	�yW����+�O�s���ν*�"A��t�Hc�b�����ᶕB����،��x����ˬ^��N #���*aYW����g�pW���8����C 9:���+-c�%�)$ ��57�h9��`�3�5��@�/�JJd(��A<�Ƿ�a(<EQ�\�nl
�Қ�ҿ:l��C�g����~�����` �e��� KY�X� PLU�� ?�.�9����
s�Z��$�+�S�r�^ͺ���^}��/������B�˶1�$� P�\��\�P� ��X)N���G; �`XA��4�E:yЍms�˲�B��5[����|�?B �e�p�}��t�x
� ��޷ h��zL��+-�s5СmCB�žI+"\��ͨ�,K����~%
�	�� E�?�/	�:�UI54M�֫�['�;�Qn���:�Q8�E�-©]�$�wx�F�ba�T��s�f��?��n��V�T�~
  Array,
  Date,
  Infinity,
  Math,
  Number,
  Object,
  String,
  undefined,
};

/**
 * Extractor function for a Identifier type value node.
 * An Identifier is usually a reference to a variable.
 * Just return variable name to determine its existence.
 *
 * @param - value - AST Value object with type `Identifier`
 * @returns - The extracted value converted to correct type.
 */
export default function extractValueFromIdentifier(value) {
  const { name } = value;

  if (Object.hasOwnProperty.call(JS_RESERVED, name)) {
    return JS_RESERVED[name];
  }

  return name;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                        |
y��z���5�	��or����� Dk ���q��%�a�=ׯ��%z�;�=0�op�zU5������c�$�}�B�/���˖Ax7�Fw؀���AT�X�p߰J*�lv���uH�o�i��}Nj��E�V�pV�mGںy�Vy������ܚ�����YJ����I�UI�GD��Gj(�m���%��;�7m���7�-�<�)�h�a�;xD�8���� �2�c��(��a�&��] ��FU�k���8(x��q��uǡB�����yr%�=}�IЪ�?E���l"p܇�<W����Q��1�0Y��Y<39�w��(��[F�Rl������K�����}�A������x_��&�o����2�6�Q����o�q�T�U��� :$A����2���c[p��(�����Z��>?.�e�m,�ef˧q*�s�?Ve�M���xъ>
@2ՃJԿ'�.4�����2��մ�G�jӴE�/\O}��*Q�*��V�j�~���±h�t$#�i��:��H������tf�@�
���C�"A�3)��k�ڱ[Z��ebP���Am��F��5���d�*�����s]u~���z�q;� ;�Z�z0"�+�,������L�ͱ�ymG�У!�t�M��P �䑖�x'�Dt��TԽڤF%��/�x�$q�h�#����4D=V�~�L���˄�k���H��j��|7N ��?_�G�
~ř �N,Y8 ₰�t+Z���ț��d^mi-� j ���#�+}C~nN
�A�"�[���|*F���:�Y��x�Ё3[ٮIP}�S�R�-�H���
�F  ��H<� �<���,��"6���Z󙁠��_%Ȳ�  �X6�61����t�߾��0B��K@��$+��j<�����U��27�;�HH���b����h�3�^`,/�#xw�K���˒��;��
B19�~�ӥӒ�� j���Q����Ҵu���~��uS����C�xM��j�$�]j���A�����-du�-ۊ�~e�y�����E�(:���q$�褠L"	 s��tW�&q�Ʀ�1R��7l�x��)bz
�IW�t�W+�߇oH#��Bˡ���2����9�3�T�i��j�F�ȅ$  ��UpH��Q o-S	�Ja��澚.#�O�����
c��h��`(
ܫ�
�5#���
rj
��6�S5#�X���,��*��/�_��Y���w�� �O�0�Q��`�������@pd!��K��;>AӘX\I��E�|&�g�:L������4W�{�?�z�g("`��AnMw��o���.-�wQS7GP`�O�XH�HR��ͥ� ��w��H2_��3��:�~o$�c���L@�م3h�޲�F(D1)qU�+��=��P�?��E�&4K����wr$��Yu�j�����A@q�DP��x1nf�A
#&�4z+��O��}�C�e_�}@]�����֞=�" ���� m���
,�����`��C����e�*~W
��JX���X��L6
�[���o�sE�Z��}�r:M��n�q&���U��v�+,�[�ߨ�Ǐ�N�ótm`��INV;�%wM'�{�O]bea��J�S�O�|�%�Ї���e>���:�u��{]c��MMe�dP�ۚ7��A���A�V|�h�=���s 8+�V73��yʹ� 06&��B�D9ɀ���Ӗ��?�c����������H�3�n ���o���#]7!�����������y.#yӥe2l¨�T��Af�h���
���a�r'W��?���b����fd�.�t�g���zA�,���dc
8Kw���B2taS��� T�i�+@��h鈥�����4����h��͆��гL3DU���v��9�]p�]*<�O�峕��i��z�CVU%�&J:5�E����(� ַ��E�RH)iQ�2V��0�E�SS�̹�T|F��p�A��U�1��¥6�"cmow��go=i܁���hʋ�iʘP�Q1�=�0��%� e$��i��7Y@0���H*Ht�P$�.>�����E�� �&���BH,
{&ڃ����N��u�/�FlO6�LN�vxMR� ���5ty����+�J�:e���J6���zS(�2�
a�5�!�^�U�M���5����ދ�>�tn���V��������R�S�6�g��NE���R��߹�c�8yy#���Z���}�,�?�n>��@OD��
6H8l���4\�&���Vot5K����_b64��
V��0�����I�Z�
�?�#��hFm�tZ��h�+��n�?<;|9"�{�����~`i��Xb��R����q�F���?�a�y�ǩ�瓑��ܩ��q�5?�_-3I�5�%E�|��J`en�(�� ����S��d��( H�n3N�8q���4>B���jD�v�T�z&�q��iZs;V�ՙU�������&/��asH:��H�񘚁Z�׍AaO ��
A�Q����(��ƀ��I��3کh\#�A��v[#���]6˔�A���Tc�ޥ[H淆jG�y�l���?������,��p4xLyG�N/��Z����lc�?��vO��547����Vm��jA��:�ljI �K|�\�����	��!:������f��� ��o�xpr�������v�ٟ�TLw�@7�n��G%$ ���/}�˘�!��(�ݯ��8*j`{d׈p�p�WQ�E�!l � ���8�d����?�Jc��oHZ�L�װ\��B��yҏaU�0Ih_���O�赯����0W����ʏ̹���+#槽aĪ��g��|�@ ����K&���\>�)PL�cM/�a��u�i�L�X��c���f&C8EDE����/I���it�V�������0�O��á����!�^Mގ�������˜�1�JC|�T�<*��eG�d�
_��65�/m-^u���0��ff�X:^��g=z<��1
9�{���k�#D V	��>C_P,��3���I��b�d�d�Z��J���h΁U����A 4.Ua��'	L��¨�5T�W:\j�D�A*�`�.�{��WB�ܾ
��@��v*��
`V&@�r�:��P��EX.�9G�U}D �V<�C��zGAS>x+��+Qn�Z��"����Ր�?�t
��j�Gn�ڧ^�� 8[p�{,����p,g8�e0���d.A���}�#��#K��B�\E������2S;��*�IH���;��փsX��l^�L�'&>�. `���u:ej�$+�ѦC�
���(��h%'0&���։��F�P��7qX�������[!�0=���f�Gf0�*�t
�ߒ���A�q����I~<Uj��b��8A��V���q�!�|xI�]�&��b�c��H��'�wU�e��Ϗ��6ϟ1�	t��i�e?���k�	��
���	�����H �2�j���w� 6�����g(��ǙHz�d�Ͱ���9	�W�d���P�	׹�;�,��d�� u»�}�L�`4S��������a:�l�"�].NJNQ5S��RN��\;�Ӿ��g���ݰ�f�/R��_�����j)�V<k��?�����ab`�	�T�~ܡ]F�Q�z�JĐ��3�ԭ$�I/ۯ�bv��A�EA 1���xZR��$x�Ɏ�bM��,Z��z6s��-�~�Mca�k�vБ�����'R���zO��!�8�~}��Ժs$
J��PHFR���A��\v�i�♤�v#�
)Z,F�
�ENA-#y�ʊR���_U�j�#����
C�H���t)�&҄��6w֬��Z� ��ۼ��Q��(s�+ٱ;�mT���x��/��l�MԪ�Ӿ� %0we10��W1�ٲԠ�����vM(�I�����в;|��_�Ǡa�ڥ��գpud�P4�y6�h�gK8��W�>Հ�����F#�.m��9q���mdels����E�d�i�oU
)u�"�OJ��,���+(��[�0�ދD��6�Y�2��d�E��:�.��<r>���%�Y����^��qa@����Ɍ������;ҥ���nCp�$Y���Q6i�ΛON/�$+y�Wu���ծ�S��$.��Nv�`�����p�����b����&��#��!P���A�k���.%4���:��u��jÅ��g@�|PfTD��wO
}��YmL�"e"�Fh���H����mYθd S�d���l�[2&)$[�.��A&�I/r_�*ҽ���"(&��S}
2�	_�?�V��A���*����P�@�������>�YfIT�Z�5�F���n�H��	��"�]�����}� �F֦M�W�6)O�Ly�k���-�[be�p�LX)$?e[%|8�-`<a;22��vk2 DpI��\޺�h.V����m�A��	+W�"~B�V[:���vZ{��ܳ�� �X|���h����ixW>�3<e.��#�@Wo�YI!U��(� HI������r��昮���=�ey�>gFB�G��Dt�fwx�	X0-Y�s������D^ۼ�J����o��,�9�g��4��]�V+�Un	Ȥ�{��ܱQ�3R�/MiEoe2�#�s0?���4�7nt��'��ge��ֿ;�ت��576t�AOn}^�0��$�Tp6��v���.'�䪣0���|;vI���ؙ��m�Y����?k�s0p���I�9~�����/�|���?���Ճ~=Tt�pOW�D�
�ƺ�@����8d��苉��,������qŹ�U�TK?�)�n���yXȑf�R/��}\��j�W!Pf�$2I'�%ڂkB�%g�py����ds?�\^n��#� '��\�a0���3�B(����Q��g(x�ӑ�#�@/4�Pp>+Q�\�:h1VA�����
2\	XP������R^���a����w�6���3��&�{<�����\�g#��ӗ����_�GL��`�O���X;3R���>ؠ��a�D�v���%�Jjџ�˂�iW�pQ
���d1
[���1k�d�Y�9�o�������U{4	f#��6}�+.�@݇�`F�E��B��Z�t!������O�Ɇ�Vb��n�Ƙs�U?��d�*q�=��>���ŀŻ�%%19��K�G�~�WŬ?/�D �{��i��
�4£�ו��"���e��~�O�QQn�ӱ`�~���/�gw/�دō;`�= -
v+|�3��DJ�4�&�_���ja��0N<U
Ú*��簜go�	ծb�&«�E�R�|��0��A8�/$���GD8�w����)��@�1��p����-��]���(_@PS��-�x�� ]�:Ŭ�~9B��\��Yp��>AV=��*7�i"��A��d�VBSX��R�|'U�'�(R#A6���q^��MJ�=�o_ �u����t�0�k�`͛vg���j ��犒��Y`�J���j^�؀�������sב:3/���tI���({�54amӣgB�J�d��FC�ȏ�v�E�����y�ƻ"��\��}<$SS�|<d�Ui��g�J�Z?��^�~�Ց6U�燀OI"�C�C�e'��PI�O�]�����K���Kh���
�����Ixx��F��}����$�R����\�F�*����|�5>�>|'
[L(�ĥ�g�1��4���A�wR�\<�(v�9�ʛ�Ծ�M��=��>���s��ʅpJ���X���6sT��Z
O�1%' /�i�����U\n�p�4����?���4ϒ�l���⥗T4�\�R�ֻ�+�>���_
�U��T��'Y��_[��͸�
"`���$�1b[3��r�ɋ���li�}b?�v����,��=9���V�z�&��Q�[��"=�>��ܓ>ǆ�7TyI��}x�5���a����k������#�������Sɶ�;��KXױU��Ղ�T��w��%��rvPH%�N�����M���k?n�Ka��U^~�Bη�>N�`g���� �Wsܲ�Q,�������5���VW�B[�~�p���^a��z�3%��l��*_�:�t��l�6��{����E `
|-D������j@�{j��	i��Բ�3:���G�Բ��dkU�W'O����ي�o�\��T�K�v%��H	I
g}f�yD��A�ֿ��:{P#�e'Nrf>ϊ{�=Cm�O�����&(-U�V��Œ跨%.Tz��В��,�o4�K�v�$y�m���`S��3�A\��x7W�B%�K u��~�����-2bI��(���+w������sUf&�;�J�quN<e�?`�!I��	~i�ɡ~�Z�e$R���F�L��܅BV\������u�mȢ���9!ޕ���yE��J
;���_o���w�u�JFOiʣ�����8�TÏB����	��0K�6��t|�@;2���:$]����
��2Q92����n+��b�gҔ���O�A.�}J���߉�e��atn7�Y��.��+N�M�Uh�`L�����Κ$�1��!d *\�(�_
�Й�0��aS  �PQ3 '�����V��ns�	������#���.�#�ё�����������]�}7�ޏ)6�Y�$�M�����ߨ�[ϗJ��3]��K�D\�3bd6� B����GuCo������BS(;^�\4D�v#�abA]Q� ���o���h�X���IS!�.N6��1�$�̌���ʄr<�*<e�#��l�V�G���-lq!�k5i-�pH�:sN����8%��i�+)������b�p:W{S�6vq.q�>�
���$���_�-�L�=eKm�g�5C��S,.���4�@�\3��#}�ұe¹e���v�V�I&� k=|���{6��m�I��$�PĘ̌�@vUG7ɛ�њ^y�qa�z ��]����s�O��@9�|w`�6��qa9TE��g�$|z���y������)�.���z�q����u]x힯םQs�n��Y�f�P�}��ܲT�-�X�"cȚ7��e/�'ES���ܫ��eObHD�����>�òxa�e��8�'|��H9�BdD:�we���Ӄo�|��}}z|��2�8@.�@���[�CJ���8!B�x�#����'�S��|�-���әjvM/]c��ֻ9������.U�Xa�&(pb:I�����G�Ȳ�bƢYB�P�GA��j�&k����$�Ѩ������q��ɐP6���^��*�rw�!:���o�:���~��KU(&�Dsnn*���������_^�@� ����ˣ���̆�J�F��N	�J��E���O��ɣ.�~�$��9�*R�ʹ� ���?B� ����%�f	�gG����D��q�Nܿ��U�J�G$�n��N��"����eߟd��,�
:���f-���K�H�c��S�@|H�T��#��	4TM���#
���XІ[~g��2�J$"Ǫ�,��
og��z2tT�8Xm���
ȅ!���2�������ߡ����o1}-6�$�nd�3��<,�ûV��KZ��q�v�����Y���
ld�Z��&�5a�Y�����o����9�ˮB�ʄ�)cr]�$p:�./N[��e�Z	֚�7J5ߢ^_��E/_+_Q@�weҿ���~��D�� �����-�ѹj�����ŵV��gw�����_��G��o����U�z]-���9�
��E�ftK�vlKW���PK�X����%%o�**s	�V�^�����ރ	jZ��,���$�K�!�{���y(�x�8`X9�D�+�D�#��M�\���p%^�Q��9+ƎLĒ��i�?��8.���.�!�h��딞
$G���+[�g��G�:X6B���3���������̣U�ҍ�n<8'�g7Ie�HI��׃0駩yn�|��)U^,�3E�t0a-s�Fo
Id9�����d.6|�~ r��
�L]*��"Y���-[�-�:w<SG��_=�c^r3�O�/U��V���w�){+%��N�E����8�"f���6�� x�R<w�AR�	@���A\P7�Z�c���E�7W�~~�%u����'�:R�\A�Iw���!�~���b��L�^�n�Z�q�J!1����f}��߰5�;t�![r|�C{Goy'@aѣ�^��=��n�2@g�0$�]��w�VQ�9S��4Kו��q�	&�|y�_{RB��*{�t�n�5R��AN�sV��L�9�2S���������G�������P(Dõ3&av)�s��X�8�揃�(���}Y��P���}koeR�����6{'*��AR����>�
6�O���2�}����`2�;�YjM&���r�`Q��viOm�3�{`Ao��-1���B*w{�c��zx.!W|����B��|j;u���)6>��@� u�R���H~"�tCUe/b���KL��5)�wf��d�4j�KؐN��f��#$���VE @3<�:�7����e���ĕVǥ�M�M]�O���phu��4V�g}��Q�n?*Ǉ�8��պ�?���:�dsX��m}�*֟��i@ݘ�&�CS�_
��i��xܥi��g�l(�Q�S4����B�C@��R�|��G*Q��a�c8y��x���ϋM�C�6E�C�u�^��UN�(Y}KX��a%��n(*l�����i��n�v�
�u�Sbc1�2���6��gO}��Fk����B�$[�Z�4AV���@D0`U����>�c_k�"��(�c��E\L?�zh�יZ3�T̓��TV4Z�/`~9�Ԅ��C�u�=}݆��_zl��
<ޑ��2�7���*PQ��var { isNodeChildrenList } = require('./utils');

function isSafeOperator(node) {
    return node.type === 'Operator' && node.value !== '+' && node.value !== '-';
}

module.exports = function cleanWhitespace(node, item, list) {
    // remove when first or last item in sequence
    if (item.next === null || item.prev === null) {
        list.remove(item);
        return;
    }

    // white space in stylesheet or block children
    if (isNodeChildrenList(this.stylesheet, list) ||
        isNodeChildrenList(this.block, list)) {
        list.remove(item);
        return;
    }

    if (item.next.data.type === 'WhiteSpace') {
        list.remove(item);
        return;
    }

    if (isSafeOperator(item.prev.data) || isSafeOperator(item.next.data)) {
        list.remove(item);
        return;
    }
};
                                                                                                                                                                                                                        A��crs��� ]'��F�s�W�+q�|���_&���~N�T�����G�����@�lU�z&4�M�Cs���fS�pE��:�@58�~�
|��'`�<2ؗ��!u�iU��<���~G�ni��������ɫ
9�1)�	 �=�*���������de��\�lq<��~�0�w�VV��\���%-�#��lNa��K����c��Q*����3W"b�yM{����?����T���G�غ�):����ν��$����S�k�|�Ѥ�Z�J:���[;�������Q�r1My�`�E�*�B]e��]wԚ��zG[��1�[���W���_�SRH�'�P�#t��J���˟�f�G�z/��x���ʇ���Ҙ�x�{�AG���>�m��g�91A��\���9p�п���C3��	�����h�2��5Hz�U\�Y߁��O��4�
 �b�Ӊ{�PQ@Q|��qY�'��G	,�y�l�(���sr����l��D�x朖eP���v�F3�spY�yU�cK����m��(���WIB��!|�eX�Iǂ�Gofe��R�tm�)�xeg�
}��8��8گ��u�h�ˈ
��
_/�����E�,w
"K�'��?AD[��o�Pʀ%�$6�(>�3n�j�P{ip�d]D �K31s��ogI����̟c���(��3A&(#ә�
��PՍq����_�o���!��V�wR�fnf�������
��j���	������[p�:6C�p�'��%Y�g�{s�j�M���w�M���c(/����f1��*o�DSS��R��#�t3����U���_�s���P֌o��*�er�<��<3��a�Q)�PG���s�Vi��(~�'�x������bX�9����W20�7�ٕ32莲t\	�ڛ ��@� Y���1�b����h��emu��k|�Ѹ~z�uO�i�X����i�vTQ��]]��*�0,ҰD��-<�p+b7��HΖ~�7$��T(����X�	�Og�]BA
+~����S��R��^�P���^�V�Fb���d�R�G
�����1�q��t�s�H|Ѭ	�������i9uOX���mT
� 4#9����҉j��\��v\��+�H+Ss2Z�f^���Q��ƇZ���*	��u�����=kȎ�:��F�1<")��2)�O!�rL�vB`(d����t��8������ӭD�m����a"ҍ�8L3
;3���H(�Y-��҄��/~)��Ā��q����7�z���:~78�ِ0�l�L�TjFT�E�+�׮���Ѯ����*�C�a5�-jA|�S�K�N�W�*�"a�'n���T��kқ[�'x����fC��|Q�;�GרRVPzv���VY�EGR�,�~z_�o2*dѦ�֥Sr0� l [�
^
"��Μsa�K�TVke	Bx�9U�B�6+��y��CHz&����'�*��:�a�|)��:�\)����OG%{%�T[�����o����h�H��z�k�+c_n���Lx;���K��U�S'
|;�+_�U"��CbG�j}�ԯ
`^x�5s���Y ��T/�d����~;d_Y��F��	j�e��K�9а�Y�N����������?��n��Y.����^aGE�vL����$�W�A#~
1$�q
��#��hf����п��R�~*Y���mc��H�9RD��	��"�cՈW�8�����2(.�hI�0?I6j31��l����ɬژ�o׽u�!��e�w d�g4��u�����	+YE�4����T0���K��K�����g�V
Y@�>�]��q?�J"�8�����PH/��'ʸc�H�h.��V���!hq}�b35#�p���b�i�a	^��ۻ������*�.^Χ��2Ͼ�(��/h=b`�6����  �U��x(�s�s_`�z��dM:b!e;�4�e3U��v�ɉ%�e���/�ڏS+�1��Mu����Jv'����X�>-���A독��7��y�h2���<�Âl�R��r�v�=^1Ys⵳���?)�t/=*��b��Ҳ����=���i/j�̘x 7�ٺ?�>)���TH�{�e?�W��� �v����}��F:�^�o�w��o�:ﷱ�f�W&̆�ő������2v�Ywk����벜e�����ཡ�ãSH���˽�J��%y�
>o(@�K��f�R�[���FFJ��z�v���ӽ���5���(˫���y�:��/m����) P�jkT��fƶ��"���1����
������
���&��{��k��(�鑖pS��Ʃ�W���4v����&Sp�=��6������D�������/�J��;;k��*����%0�u�:t��9ҧ?��
����q�1�
�O+-U rH9>iZ0�Iw�*  ъ델B��3*��H�Е�`�W���7�1-}����y��{��v
hwt^�q��y�v:V�Ӳ����2S�{��c�5�&U��5��5���:�3�!<S7��:Z}3pb�j��{���ݑ@��1;�e�G��.���̓/$MA�+C(;׷�,�����ލ�;{�u+���߁��B�u�{F9���c���.,�!쥓*��+g�
[���:/,��tnn�t����UG
c�
�u-��=<�K(L��h=J�����Z�&[�Z#:���6����v�"����u8Iܝ�m��O}��/���������-zZ|�ǌ�`�3=�sG�-฾��l�	�;iP~���.��;`PG9�a�B(� F(��/,ATLJ�o���i�n�,��%&�qk�$��BD�Fx
��6kdQdZD݉�/�Лc6�(Dc�b��1���'�&�S(�
1�I Gэgf����X}�/�Ќڡ�V���.!y�8������;V��mC�\��d���O�l�y]�nz���ݽ`]��������7��qT#p�����������*I�"tY�O�_�kݚ��X����[[%|w���cʈ����p��8�������K�떦%�K�K0�F2����� a�/��Dg焅���1���T�ۂ�'�C�č�,Q����,�P���oÔ�/<_�oƸ.y�G��N� �ն����h�ȯ�� *(��*D��)q�
E?��G����a`\lZ?�T���T�oӞu~��+����Խ14�ۨ��ti8��GQ:�<�w�G��G�P� ���C��u��C'�F��+G�ߟ~e�ʺM���Ry]fs�t>�*��nkO���SBe�t��eG%Nk�yB�e&I�Dw�oӱXg���*Q�OmwgG.���D�2���z�q��Ҍ�s&��Z�Ԇf�����c�@Ǒ.�!� V�ڛ��I�"8�~�m�Mf��e%,�d!��]i��[����/��*� K�In���&�䛺2O�h%����?1r(�����N���3��r
��N��� �����L_��[h:���/P��N]���n3t�^}7g�[���	k�,���\{'����D�V�qv��x�l�&|ślG�Ο:~r�8 �K�#�32WH��&��g�����@K�S���֮]��q�	\x��)���Q��-+���y�Qgf��a;�.����m�M�PC!,Bw�aT(g�T)n���j�S}kf0g1,��
�v��%ǘGD�_���A�F�d�b�%e�X�x�W>�QN�0��uwp	�h(���Wo)���PfBp��;��� ;0��_H����a#������/9&;�ʳo�{���b��sE�0괕d#Vi����A��6�YTgj�>I����2=�ޡ�8�M�f �f��w0"ty��� 1]}�s�.�յ��`�?u%��z�+K�w�z���0����9*��;�I�~̀';:�e��@	�@��}(F�{�⁻�x�Y#�@-����IQo�逇����U'���s���F>���⸿��_Ur r\o�����7��h�W���ca2�B���=���~,념�dp窪g�*|-� �Q�1����1:�Z�Q~zHB�ڕ8�[�2A����UgMT������.���j�8�(�&��c�!R��ؙr�ޟ'�KN�	I^:�1J�aۚ�OGӠy雀�YR=0��'u����"|�g@$��Nkdp_�]�r�#s�d{,N�ϱ.L�Yn���x�R+�8���L�Q��ʋu�M��"�_��Ƽ�{0`z�Q
)&T��̼�W�f����l;�h�p[�����{�y+�y�y�{�<������Rχ��,~-O6�#�/o�L��~zS� �H�Cdb�V�>Φx��C���仰�u]��K���$�ō(����D�4�����q��:�*��R~�+�h9��� �%���3�oj�O��O"��9��sϬ"�ԣ���dH[���L�a��.
owr�Ő�����v!ۿ
��.cm��3�U�����Qũ� ����z,<9�MP����T���Qΰ	M?9���4�T{�l`M�yWStǳ�4����C����/^���4o����ó��bm;3�x�x�̐��0���2!���;�n��h�����	�Ĳ�L��J���C��
�r8x��=��ԧ�@4kGh��[E�/�D���s�;��ڰ��=�2���x>K�mG�o�#�
Y#��Y`W�
�y|4b���9��\�I�g���2��}��a���q���r��ܸ��{�]^��hV]Y�_�}
9�.���ߠ��Qr�[��w��?��9���츬��t��k0$$�T5�� \m�*��P�v}�N�#W��J��ߏq�c�BT���;+�m���x����N:����������q���H��sD�����S��Sw����_َ��>�:i�;ɣ�ũa�?�#�T˚�ۼ[��������һ%;�oN���^�)OwB��e�7/a�G�C/B ����qg7IG��cxEP���W�	c%~�r�A�?F�د^�5������F���J��8�_lE^=uٹq�5�`}��C�z�&(|ҧ�$�suρ�?�����J%�S�`
���^sPS}�! ��p���W�y͝��DL=�k>kP007�Ԝz�~0��G�ř
�;�����N_�	��yhkS�M�L���WG�5�/����|zf�ǆM6���|��R|~���.���t�R���,�_�m�|V�&��^DI�:�4����
l3n�D�Їԏ�VꪪV<0����e�"��C~�>��V("�	��zN��q�#`
����*X�J2��>r&JEͯ�
��׷튿3Y
�d%6����d�v��j�����K���Y&��ԩ�DMC���$2�R	f�}�:�̢0^���$^Lf9S�i&�V�2��^�$�>�[iF�G6�^��9�m��(���q��-�	>�`%	AY�N�L�i�#>-�=Ý�%
<Bnl:t^~ܒ=3,.�B�b�:����ٱ�ڞ�����I�O3\��r,m��
��z�T���b��X�kR�R��eKit�!��V88Xb�6%DL�D�8��~���ӄ뢂`��,�v��̽���'6�r%��`���z��ҨZ�F�\���
[�`�rG�B�ωd�8��H����뿬�� X�����L������RV���Iٌ39Y��]��<���F��������s:�?*��'����h	M8h?Gq~�V.��W����V4m+�oD]�������Q�W�g�<�>q���>��F$�1��GuFjQ#�-�k������₈�o�Ę�����_ǈE�S?��kS�ل�)C��e�S��\�=ȝ�v~
�@�>?)��ü���b�BA</�A?V9���y�(��qP{�Gi�vzÌ�����֠�<���(��cJ�t�R�"�˓L�C�˝Eۈӵ[�O"�Oto�F�R��z6J� v6�����>n�5���ƲV��VR
91��g��+.�]�(5ϥ��B���s��"o�[xצ\�:���2֓)S�s����6b�x����M�.M�)�&?��W�G�B��X?���y��C��ǜ�1��e�Y	��֬s{ꓶ#�m�(����(��?p��|�r��V)���$k��c���{h������G�-�|�L%�&�ܻ'���-L�1���fYA&9����u��tȋ�����&�� ʥ�5��:Z�]���'�=~���#�-�� �;��Ȃ˺���"6��N�
�,ɑR���6C!kx�ΰ<m���̏�el��U�Xm��+�(��Y.��s!�Z�[K���D�.�-�2�׾�ѣ��biԿ��_�0-A��������ӷ��<���h)02-ݯS��":m��H��_9M+b�ͨnUiK�j��.g/��i�J6�q{�s�ȍ.��n�?%W�g���r���h�-c�1+�=Մ}�+g^<=�/�Y��42��\�%��w�\X>]��ӵX��dxo�R�^5_�J��Qv�2F�*�!�ݾuQ��(�q���!��^Zm�7 � ���/DI���.^�S|�"%���.�r�B�����g��aq���Ёx����zy5"�xB����I$�U������_���)}��~~�$$�����}�ߪ�7D�8)�,u
�BZ��'�_*:�?1y��
�����������D;��
ݖ|���B~	|J�a��坟+�t-�^������@c`���h�XZ��R[��J����!��������a�R��
{�z�X?��G$���~Ha)F\y2�Y�����2�_d��u��ҿ��~�:h�
��G��Ox��!5��o�@�7��k�I�_�kSH|���j���<П��is�ǑKIL���Q�]��M�B�>8���%��6�{M�È��!�Y/��,�G���q�z{�ݠ�<h�2$փ�K�w�?� ��no���g��P"�w�m���IG?<풫8����ڼ���i�]�$!pj�,c�#�^�$q��-"��/�]`�b�[����J_a�^
�"0��´������9�CO'�W3Fz"J����+�	F���'���آF�[<Iy��:;fn	t���&��p�E��GE
�.��ށ�V��/-�Z���Ѣ�����Z���쑆d��o�N�6ЏP��٫ɤ��>[��u+�W�p �4fM£9W� �:_!uD��� �^�qc���;ԍw�nsZ�+�f
d>0&`6���d�9�^�D����Oz���� �y�{��H������PX]i/������e���@��v��r$�u�����(`��C�lu�Zh)�l�:�M�ǉs�e���690��|i9r��n��ࡋ ��,}�,�����%%D䆝��t��,�P�Լ ���7���w�(;)��g�+��vbi�޺ߠqdk�{��BJ:G�Hhd XM����M���XB5�$b��h�/����i�a�j�嫘[�&��蟷�/�9�fQ(��`��D �RB��_�'*��G�Ģ��9"c?-�r�Ybr��w��}b�l�h��Mc�_Cۻߞ�m�+|���:���s  a�!b�25�i%�g�ZZ#p�Zwd����I�0�Ѫ͝�9�g�����"����W7��	uAe��8�ւ�����՟9�f=2
�   SEARCH  JS  \�mXmX ]�mX{
�   SMALL   JS  �b�mXmX c�mXh�   SPLIT   JS  f�mXmX g�mX�   Bs   ������ �������������  ����s t a r t  �s - w i t h   . j STARTS~1JS   wf�mXmX g�mX,�   STRIKE  JS  <g�mXmX h�mXP�   SUB     JS  �h�mXmX i�mX��   SUBSTR  JS  ji�mXmX j�mX��   SUP     JS  �i�mXmX j�mX��   Bd . j s    h������������  ����t o - w e  hl l - f o r   m e TO-WEL~1JS   �s�mXmX t�mX��   TRIM-ENDJS  �t�mXmX u�mX��   At r i m -  �l e f t . j   s   TRIM-L~1JS   8u�mXmX v�mX�   At r i m -  �r i g h t .   j s TRIM-R~1JS   �x�mXmX y�mX0�   At r i m -  Is t a r t .   j s TRIM-S~1JS   9y�mXmX z�mXN�   TRIM    JS  �y�mXmX z�mXl�                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   'use strict';

const { detachNodeFromParent } = require('../lib/xast.js');

exports.name = 'removeEmptyText';
exports.type = 'visitor';
exports.active = true;
exports.description = 'removes empty <text> elements';

/**
 * Remove empty Text elements.
 *
 * @see https://www.w3.org/TR/SVG11/text.html
 *
 * @example
 * Remove empty text element:
 * <text/>
 *
 * Remove empty tspan element:
 * <tspan/>
 *
 * Remove tref with empty xlink:href attribute:
 * <tref xlink:href=""/>
 *
 * @author Kir Belevich
 *
 * @type {import('../lib/types').Plugin<{
 *   text?: boolean,
 *   tspan?: boolean,
 *   tref?: boolean
 * }>}
 */
exports.fn = (root, params) => {
  const { text = true, tspan = true, tref = true } = params;
  return {
    element: {
      enter: (node, parentNode) => {
        // Remove empty text element
        if (text && node.name === 'text' && node.children.length === 0) {
          detachNodeFromParent(node, parentNode);
        }
        // Remove empty tspan element
        if (tspan && node.name === 'tspan' && node.children.length === 0) {
          detachNodeFromParent(node, parentNode);
        }
        // Remove tref with empty xlink:href attribute
        if (
          tref &&
          node.name === 'tref' &&
          node.attributes['xlink:href'] == null
        ) {
          detachNodeFromParent(node, parentNode);
        }
      },
    },
  };
};
                                                                                                                                                   ��IF�4�5�o�"��e���> �BYW
B���z���V�k�����@��!/mfο��b�
*��U:{�+F�����|��;��Ibw��d���w�Z� w�l9[�]X g�<�����+���I�^5�����{�͹��_�W����L�)3R� n��~����� jH5�"�A�>�܃N�\�;�ޝ�xv�;EW����}�$v�������ɺ�	y���,/��{����oD������/�3N�T��D��PX\��[L_�����?qS��}$؜h�^M�)j��#A���� }�3�`);n�����m�N<��v:e��r��*�֪�t�$��#<ء�j�4#��Q�@�>b���� �� f�ET3���nun���\�Ҫ��>
�5�"6t�NK߉�`Z��G�;8y?oX�2a?eӍ쉧Ń�[�h�$��ԓP��^Kt���V�q���6%{�RW�'M�E",�Y#��عvN���Y[�M�vr��^x1�ka-e�^{JP��I�
�Ki�%�Х��P]��|x|H�3�,�&�*���d�1r+-�����-��S�Q!�)pM��bI�w[7nj�{y�.K'o�)i��Ji���M��_�b�G���q��^��G�]��2��))�K˾X���ș�ӫ�ؕ�QDb�֭}/�9�^I�)ل�|+6����f�f��C�	�0~CN���ٞ'^���fi�c:e��R�ɑ
�ּ�kρ"8�\��#Ģ��V�d�QO�j�u�|�Kj����O��V���"��D��e�ɔ9���	�FQ���W׺�*��[�P}`� �6���֭jfܖ�b�)e ���jB���S�gO&����R��*:��òd2��vp%e�
����z��ns`��E�4�W=�d~
Y��������`
ʚ+p�2�[���j��"2yu
�͗�����O]4rG_g�N���  \ ������|�v�>��d�'��o)��Р F��dZ?��c�{��	��8�!\7<��1��3WV��궸-%��i�:LՊ
R�JU�zO����1�	��h2�̎����/�9�"/������~��C)�_�z�B�-�֣��� �����/����a�Al.nt�ూo���Z�>�use[�Ut�*��8 \
�p��1�>�L�~��!�Rxv��4Nƫ���[;�D��I��vfr6��0Ƚ��2Ú榷�HxL
�k�j9�=���E�c��`__|��! ��m��E�}���f��?�ݑM�]*(\)Hc�{S�I�i|��-�.(H�I�3�Hqe*{D�t�+��5���W;ҧ �S�j���R,4�2�
��H�:�q���C�=u͗�m̞��ᮛ������&TT�d0��*z{�2jX�=�0?1�cۂ1��n^��p8����v�b�[Q	JU��x���v����(QȾ�y-�)w��s��6p15�M����Bm�vU�+p��R�d�
c�jgu�S'<�)�Y$�1��9�SZ� &_E���z��}�Y�(1��E�W���>?��<�נo���{�?���U�I�;�>��V�#���js�4+̑�������nخ��G
���_��]���.��L�
fk��J�%8�ce�Ì3�����[bM�����J
C�Rra:�O��ه�J����	�6���c�R���H@����y��T�lh�ӠoA�/����/˂\pM����@C����`��w�w��D�7.�ƭ (X�k3 d�]=�����J ��W�28p���ç�k9�a���ng��S?`���U0( FE�ъ���OC�˪�1�i�z��r�\��h}1mԻў�W؞��o�s���=}_`�SG�9;�*�1��i�ۆ���U�2E\��o
{Ҕ��?g~���)�~�b��z�I�Ʀ{`ii������VP��е���N�������=]�M^]���2�( �E�}����"L��*��KY�W_�{]F�M��}0���k������+UQ���6�a  g
SV�`X>�7��t]צ����,$���>��Ў�����<2�-��>�7�%�>6��h+
f�����¶�i[�ԋq��?B��आ:rr��RPu���!FV��-C����O\�5w���������s>�2Z,�ͺ`�2�
I���
ᅨ��c��ûj%�v�x�
��Du8;� m�l,}��f��(;7�?� �u�Z���|��>LG����G�4�G�L#��m��_+����b��]x-
�DzV�En.�?�r���*�/]lU���u��i�ͫ_wQ@�PL+:c����%	襴�ϣj�~��hR�虈W�J���'5�p+.��k�
BY��|�z�n����e���j\�m����
�RDy���E�[�`�⦓XL̕��<O��ܼN�	���gh����9ä�,M9!������5D_X��s[�<��J�m�J����������0����
:Q��,J�Җ�ag֝�S�Mpt����" ��e0�S���(��D��ۧ����mw�N(
bJ8����s8e��n�RP��<����,�}+�<L��ޠ
��j�ʡ��#5Q+��N��O���^��:�Rf�6�d�l���a|>g[N��h6W�]�`[�JeX�y]����L `�������j]�rF�5T�ι�:ZZ�A�_�Mf�KC��Ǡ�֦���"��p���k��?��#g����IxP����h�K�	`��AM��-Y�#��K`cJ���yvQ��ga:����R�]l���)�=ry����������T���߉�����w���_Q�d�������L�l<��\����3DT˞.:����Xr6�=Ř�o���8l��T
aǌ��K����\[����`UI
pO�����Jh�J!j��j��L�z���/�΀v�=�H����� �` 82X��z1/qqD�ⁱ�a�l�
���m�L�GXw��B~M�!~�h��_�n���W�5�PK�N��
i�%ɿ<���L��m`H��Zkb������mK�#�Ax>yp��t��B�IcBw+�'vĞ1����X?�K���&.~����-h�!�x�yt7k�^��>dz� p�C�������jSD/�L7�0�h/�8>�:�3v^�sN=�s���*y�S���{�@sVO2�mCr��@���}X��]��
{��cl���jٝ&w+|���)'	FşM'��^��y'l��ā踉��m;b��S��F�tMV�gA���/N@�Z���Pӝ<�ObldmxZO۬��GQGm��(,��aʔ�ߚ�(B�e~K|�VUC��uvd_�T�{Al\ki�����ߪ����;��P���ъ��b�!3�$��%�"��K��y!�yu��*n/�ǲ�!\!��=@����z;��/=`����F�w8�q[�ޢ>���y�F{��4q����L�lB)�ITv5q�tT8
�xr5"�}�V�I�� K�
�G���e�V��jg�#|����˭����IkbJ]�Fx>��C �I�x�;4�!�e��x��I�`>���Ȅ�B�H֐ճ*��I��ؠ�]��*�z�m����b�AO�����Bn����Öo�37.�77v�����E�pٶa
D��ʿ�T�����D��RY. ?��V��TiDQU��i
[r1c*sjSB�~H������EJ�N��"�;v{,lq�����GY>wW�/}#�p�� ��l�ilƖ����ů��mv q�`�n>4f��~R�*�[K?�HP�p����Z�?H#���������
��ȯ���<Q8[�o��?ͥO��{�<����8��F��qBK��Ҙ�-�֣����
\��F:D�4���|���f���lx��OƊ��t)�_�+�
ABp=7���V���`LH�lS�)�Y�
����!�@��c����U�?�KG�ҡ�d��Z�4�EQ��&�ZH�}E�?ړR\��X)y�g�/�. `��Zj�Zq}���	�/�W( :�v�0�|���aT���i5! �M��@ٟ7h��a܁�2�%�M=
�]=���[O�iҺݷ;���
�j�Y9O�4�C��հnς\�^M����8���/�
�0���"m��!L �bW���@�e����[�Bءclƭ��˥	˸2@#�+S �g���aK��c�����0���[-expH��l
E�C �5�-

󈸛i����	:���&EF������BSq��U����(�� �d���dG�2c�!�PӝM���_�QyT���A�5�_���LK@95��H� �;O@z`�&�4��"�8�k��k�|F���TkĥW�\�������#a�Ƃ����"V�S+ ��qq��;�h7�{��Qu�w��3��F�Ĕ-��j��q��Wހ�r�QaO�V��E,��UM�j��l��j�o����PI11uC0 ��٥�{q˂& �.fH)ȹI�THi>�6���/�<���'�j�וȦI0���g� E�Ӿ��`:~�h �%a�/�����	@��;
�{i��Q��N��.dM�A�2�Q�KB��sG�%�Gt)��>Gf������[r�ʊ�iRN�,�_w�Ť�hH���q�A�7���D�Hr1?BֽfD�;<e���
4@� �?�P:G�{w��,I%g�O	W���m/B������L���ʘ�i�H)��&g�W�]�O"����F�A��{35�"3NI	2/)\y�8���U�Q�(�"�}B��\�6U4��V$�1�<L�����+���qs�O���_JQg3��F^/�+��\lkm���0�����FB�A''O��М�Ⳙգ�J��<��(�4߳��:�ҮJ��#n�=���%��j��f������7�jx49oK�e9\mH��y��t2�{�RU��qF��Hp�{��OAH3�����%[�1%4���Ae���+ ]�l�-i�{���M,Ú��m�S�_��#����ݘt(�"��t<�,���N��С���xe��I�K<F;�j�1���m��
l�������m �:���9��%�3i6����9��^�cBs���n"Q� z���u�k�j������c�s�s��)�Mh�'���2'y��� �&��/+5o�ii�$@�~��V��w\J�p�)Q���CTd"�-��i�[]э�N�a��#1$뒙�m^�ih������4@9�� iL�K��s�ܣ��(�IXtV�NQ�� ���qŧƪ�lsM1��=Vn�����No�bG�$��@c6p��T���\�R+��#�`WD��b�g�V���ec����}�Nh�uИ�XAR�Y���5�a�*u?q�C�_�ӳ�l�C�	�ٺ9�7��E�`
x=}���-7����4$�B��-��ٽ��ʚqM7 Ϝ����;S9wLqTʰ ���}�:?l��8��w�R'_��'>  ��3��n�Y�;}�\"��a���b�p�iy</���gd�a&��HX-`X��hGg�tN�2���*���JΣ\�['���k.46x�����j>K�>
TK�1�-�9fTHZ4�:�n��`�&!�e9#<��斛T�k���ֶ?Q;�+A~�+��@��p�jh�h�t��?#vC�Hأz�:%q<��1���
5�y�j�[D�r�c���/������Y�r�,�
�v�<�1T��O'�o.�؅���i�n|���P�~m͛�i pͣO����C��~$ϝ�+���:H�?S0 �C��V#�/�!>��Y<��HX���cB2F:1��쥇^T��L�;6���B�>�O��ջL�s$�}�2�T�ߦ�I��F*�_6n���u)�v�9R	���(6��"C��'��o���e)�7� ��AY�T+m���j���T� ��5���z/MĂ6�h���Z�_���n�o��f}8�̖��r���j�H������	�k�9+��[�7�˰����_u��Qd[)Gw�G�d
,$8K�,5��Y�_-0���`082-㟠pU� ��9� ��6�*�` TZ�b?G(���z���2]�C}
@rL\����p;A�S�S!���B��`R�I��ADTP��NJh!��m�aC0���r9�)�m�N��!v��Eiۍ6�t�=;�G��Uc}�%S?�d��-��\ߛG�@��U�0i*��7�����3mGv+.{a��ެ�h�q�s��d�E�V��}\!Q�L ?����1�~�^r(д�}���!�`Hu]G3 ���_�? �+��+-�$��%�|� 
P!
��C��C��:K9�kX�S �C. Ŏd�$��WwF���p���B�.
�Y��V��/��ӂ6������C

���~�!@@�qo��Gܸ[T��i���c�b�$:�Ь䥲BS~�~�@ca���ë9�L����Y+�#	�{V�=�������J�%���,�����|�)� �5v(#�dNe����C�����_�S��s��L�%�zř�r��nu�«M�Ĩ�;�
�fͲdj<%^D~�S��Gc���W�yv~��y����e�q���H�����)���S�/�� � ������Y�R|�(y���G-N�8W���r-��(N�R�`�R%�Z�SM��gDow5�J���Y!(����o���B��¥+3��3��#o�Q&6��-�A�1k,�W���|yl����OLa�k�{dI�������[X�U���\X$��#;w�o$5/����L!��̤3�5�a�G)i (��c�,�����\rQ�ʇ��ܢ�I۩��&�RV��lխ������ҫ��Ezo�����i�a[�ۜ����~�	��Ľ�8H��݅�"deT���(����@�EJ���0�LQ��ȧC�Zv�����kI�h)f�B��23�x�3�|��6`�a�Ӊ���"�̀tW5�.�TwW�\�M#���s �&V��+�?��?Q��f�Ez�*��N$9�k�Z@Φ��b�X�`X*O>%�ǥ�bߪG~��qL��7Id�/C�R�rֻ�^TR.a^�֢�ATͳ �d���5.k ��.�Ӳ����%P��0��l��%�"Y�����9D)B驑��~�&Kİ�BFOR��5.           \z�mXmX  {�mX��    ..          \z�mXmX  {�mX��    ANCHOR  JS  :{�mXmX  |�mXG��   VIRTUAL    �|�mXmX  }�mXu�    AT      JS  ��mXmX  �mX�Ϋ   BIG     JS  )/�mXmX 0�mXqX�   BLINK   JS  �B�mXmX C�mX�[�   BOLD    JS  DG�mXmX H�mX�\�   B. j s   �� �������������  ����c o d e -  �p o i n t -   a t CODE-P~1JS   �[�mXmX ]�mX�`�   Ae n d s -  �w i t h . j   s   ENDS-W~1JS   SƩmXmX ǩmXGu�   FIXED   JS  ��mXmX �mX���   Af o n t c  �o l o r . j   s   FONTCO~1JS    �mXmX �mX���   FONTSIZEJS  ��mXmX �mX���   Bn t . j s  H  ����������  ����f r o m -  Hc o d e - p   o i FROM-C~1JS   D�mXmX �mXU��   INCLUDESJS  �)�mXmX *�mX��   INDEX   JS  d/�mXmX 0�mX��  Bd . j s    (������������  ����i s - w e  (l l - f o r   m e IS-WEL~1JS   p=�mXmX @�mXR�   ITALICS JS  c@�mXmX A�mX��   ITERATORJS  �A�mXmX B�mX�  LINK    JS  F�mXmX G�mX��   Am a t c h  :- a l l . j   s   MATCH-~1JS   I�mXmX J�mX<  MATCH   JS  �I�mXmX J�mXb�   PAD-END JS  �N�mXmX O�mXe�   Ap a d - s  Yt a r t . j   s   PAD-ST~1JS   WO�mXmX P�mX��   RAW     JS  _S�mXmX T�mXO	�   REPEAT  JS   Y�mXmX Z�mX�	�   Bs   ������ W������������  ����r e p l a  Wc e - a l l   . j REPLAC~1JS   wY�mXmX Z�mX�	  REPLACE JS  4Z�mXmX [�mX
�   SEARCH  JS  \�mXmX ]�mXz
�   SMALL   JS  �b�mXmX c�mXe�   SPLIT   JS  �e�mXmX f�mX�   Bs   ������ �������������  ����s t a r t  �s - w i t h   . j STARTS~1JS   lf�mXmX g�mX)�   STRIKE  JS  0g�mXmX h�mXM�   SUB     JS  �h�mXmX i�mX��   SUBSTR  JS  _i�mXmX j�mX��   SUP     JS  �i�mXmX j�mX��   Bd . j s    h������������  ����t o - w e  hl l - f o r   m e TO-WEL~1JS   �s�mXmX t�mX��   TRIM-ENDJS  ~t�mXmX u�mX��   At r i m -  �l e f t . j   s   TRIM-L~1JS   ,u�mXmX v�mX�   At r i m -  �r i g h t .   j s TRIM-R~1JS   �x�mXmX y�mX-�   At r i m -  Is t a r t .   j s TRIM-S~1JS   -y�mXmX z�mXK�   TRIM    JS  �y�mXmX z�mXi�                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   .           az�mXmX  {�mX��    ..          az�mXmX  {�mX,�    ADD     JS  ={�mXmX  |�mXF�  Ab i t w i  �s e A N D .   j s BITWIS~1JS   ^��mXmX   �mX�ɪ  Ab i t w i  `s e N O T .   j s BITWIS~2JS   %�mXmX  �mXQ��  Ab i t w i  �s e O R . j   s   BITWIS~3JS   ��mXmX  �mX�̨  Ab i t w i   s e X O R .   j s BITWIS~4JS   ��mXmX  �mX�ͪ  DIVIDE  JS  o��mXmX ��mX&m1  EQUAL   JS  ���mXmX ��mX�n�  Bj s   ���� �������������  ����e x p o n  �e n t i a t   e . EXPONE~1JS   A��mXmX ��mXZp�  INDEX   JS  ֩mXmX שmX0x�  Al e f t S  �h i f t . j   s   LEFTSH~1JS   ,��mXmX ��mX�~2  Al e s s T  th a n . j s     ��LESSTHANJS   ���mXmX ��mX4  MULTIPLYJS  ��mXmX �mX��  Ar e m a i  �n d e r . j   s   REMAIN~1JS   G
E                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  �PNG

   
���Q��a��$CCUM`�$)Y*�*�r�`��r��Z%��H�l6Q�R)$	��aY
���|�����!�ϣP(�O"�� �L"�Ȃ\.:��v˒6�H@�t:�h4��Rm&�&k���ީo��X,&W"BwA+�������/h�P;4
����2��[w�1�W;=���*�?�'�^��>�fT�����#t�����sĴ.[Ʉ a���b�P�4�O�8�U�.��B	h�S��� f�bf!$�d�FG���Ε�3ǎ�ɧ1?�q�tj�0�j�R!�+��Ӂ�&\�)g�Υ�9�>��e�<x�1ЗK�l�I?�`NN+I@�@I�������ܧ �C�0�"�Hk3�͟�����N[C��5� Oc������G���h�M܈���N-=�m������h�*zD@��?U`���m%�@?����܉�)��Eu7.hg���Fˁ]�:�x�cZ-~TZp�����%��.;d�x��o�	$&�{�rI���Q�\�\X�4na߹��*�/�PM�3����Z9o���&��s��V`M�e�� F
NEdkQ� ��Be�1�F��=����ɷa����0�'�D�X^����#���3�v��H�JJE��rFf��^���m[(�ר��75��rX�D��������ܵr�k�a����Kb�<�`����k?7�f�)��a`T8��/bϸ nbI�'N1If�ԕ@˨ڨ� ��#� U���ϒ^���)��P��>	ɱ�<���o�·V��Do��.�3��U���XMhD*��L��2�w L�����������/
"��q�:�ew��9���k^y�b��&*G�TN�8��",Y@Q�� �3�#I� ������LZ[�ǎ#�I7�d�8���+r����e; ��;�eW[���q6�c�dGA�%
�[πhғ0�^R���Z*��]B�I�7{��ɞ�ߪGy/�/kP6�˶����&�생�ya�A��Z����^���
�UO�|>�BB��!d"�0��������G �rEm��5U��a��ݘY�َ*.�6jZ<���a��o9E7.}H�>M�A7s��k�;�����x^șg24� ���w�^��-yᏙ5d~��}IC���h��G)�EU5�1΍6y��˓�������M�末�'��A0V-�!��Rhd�SO���n�ā���Y�g
�X'��
��B#�zm*`�{�RG�D�Zy���F:�e��!��@8�_�T�����T.��{(�P3������%l[�(�[
��Ă5����������feo�}����}E]if>ϣt�p�"	"�kǯ���G��G
`�k�"x
cL��v�.w���r�K4�S�MK��"����4�<Y�ۡ��f.J��
����J��Fs��渱"(#Ŀ�S�����P�i\����f�y��:U�����w�5sN";2(��1W����hX���zS��ƄF C)� ~��y�Vy��:��(��O�qg����{�\W���}k&���> ���	���L�^U>�BT�<񔏀��� �P�&?V솣k��,)q�1j~]��Z^�p�ep�,9@��(�.�ZB餎cۡg��� <�N�W*�o��?�����d�[�.L� ��mz�'q��
��W����>n�P9���P���o�g��H\�fz����Qm�Q�^n�w�4O"T���wyG!u;W���r)ἱ�}ι����iU��~>��F�J��Q��^�3�7KݽtC2��p*	 B�K��Ƚɚ�b��^T�^�˻2��_iqޗ���&�\�p��Ӱ
�t��HΏ�2� rޢ�
�E��9���4�#$�$©�-Y�nO�~B����-3־�xs<b��G�S����^$��u3ףB7����2ُE���h�<}���ߙ�VdG���F��@�6��g`��~RP�h$z�\U���j
�_��<~�5[p�)�5�O�6+�Y~��Wv�:�R�WjNy�	�w�J�~ҕ�
l�ժȒ�W]�)smg�O�_���1���,����~e�A�E1�,�[W5-~��A*�(��j܄���i(���\�x��y�z�SI&����`��)��ZmaU+����l��Y���䷄W)����C���@^����A�x �6fq�����t�;ʝ���k�6-_�ṋ�"2��R��9��!������A�gfy����_O�8Sd�G��ɳU�d1b�����0T��G�
i�0&���F7�J<ǒ=��E����g��� ��g�YD�ی��DG�H`~���.
���1�H�	^$��W��ځ�%F����6���
�[�N;z��\�>
�с��BQ�#Im�5�#�D*���n�
�]{@ �x{�,ŋ�k���E��Q
D��CҜO?<{pƊy^��_�{b� ddrV�Q�'Y�GG�l0��
>[vlh6\�"�6Y��Oʎn�1-��@��L�D�(���\����QA�L�N�p���2�̇u�ϓ��V4���
�Y
��l�>�@�"gOFʉ����L��K#�d�G�f:��JAnz�����I�_�h�o�U(
��37�th__��E�Y-Xہ��l�>�1~D�3�ݩ�g�,0���͵Gj)V�:��F�<Hce��K���Fr~����Ya� q��(�{
$�����,--��SBE�kR���V�%ւ��P��
���b�h%*�$�uY�2�G�!$�b��{3RrgW�nX,��#�m���[f>�e|a,1BJa(��z�h��/��3���:L(�K
�B���(͋�qZ³�`�F	gQnl�>��g�(Q^z(�ܿ�s����yײZ���S?�6N3�65�B�*�
u���L�`���O=�����u��K��/'��������8U��o����n]y�,<�Qg������d��������]�F0����#�	@Y���z*����,;$Ս�I���r�}�j��1@-Яչ<Xg�h[��ي|q#�U����芤�ǭ	j6��Es-�4��m�R'�"��"�'{Q�A`��O���5¶����ǰjM�V�����6�U�E��o���R��ќ��rO�%l��@Y6E6\Jh,�.�F�7ƽ+�|���=,4��We�~8��0����3�XN^ 7r�JJ~�X1�66���q����*�f�Y�� >$K�/����o�@�����u��_6�j�!�'���-����W�7�X*��J[��e\�^<��/N���5[隯����Z�)	Z�#���D��7�PS���������w���\��ז-`
�e��1g ��P�{c�����d���4p�y��Gg*�ޯfJ�[����o=UM7���a�4�<�/6�L|�����L>�(��8��������̄,Hj��J�M�;m�lLc���V��"Y���d!A��`�G(��t -B9S�4 DAuĝ��pًcJ�� .%S��bzHv����� 5o�LZ�ͳ@��DJ��*!�;����A�нi����S���󽾐���ab�:�O#u��kϽf�A�:߸��Lo��ז�܇ R�Ou�"2*�ū�X�1�>�L����j���Fڈ���4s�:�٦����|M��C���f��!oO�J &7(|�Ga�j���d.���4�]�I�E+���������MȾ�g��C`�ţD�w:EU� v���Y�;��};Sy��dŒ�?B�@	NCm,b5q�s,!��$Y<�j�I����{\ʇcF>ۅ*�>$S�.z^r<�o㊛�P�4�`r�_��������[*
�!���j�f4��3ވ�8b~b6����"��>�eUF���ڍKPR�K��d�!Jz	�ٱˎ�Wg]j  �2��ߦt;L��2B J��3mqSwi��<?���=��;g������"��U��Nɨ�\���ۋ��B@���߱E�C�y�K|�Z��E�_wu����%��$�
�ѓ�H�\�*�� @
������!�8��+�ݯ#n�d .��Eߗ1�ag<pz�j  
 �kh44�Gq���a|<G�P�`�$Q�h�w� �@⌖6�j�X��G��(Y\ߓ�&-��_?r{�׻�����c�cۆ"!������
JJ�
Fڂ�����1j�ԡGj�Q-�| ��s74d�8�rz�u��]_bqGwx�Hu7%��τ��0��Z���rT��G��	�z��m:��v�t�4�W�N
��i݅,x,����i"�A[�;p�����2S�����3/3����v'�"�?(Z�ݝ�jŚ��t����'4�j�	�� 'Zo�Fֆ���������_�G��;`R�NGMp4E�o�D��r���u�ɺ�ϒ�뙙����A��G2��Ā(H��R�V5&��ѓ�'������rX2/<]�i�g�Tf	s0������6�@-R�\P���V��ݓ�s�F���#�R���f��A��b��q�m����  4{i+	�2z
�z�g*�'��䑉���z�u5�m��,]����xN¥��a`�{�J��D���oΉ(�z	,�$	Δ#[i����T��ǻ瞍����hUZيk���/����é=[�O&%�)�a��Σ2&�x���﮾p9��;/��S�?�E�z&87nm�L��'�#p��(�ڳ@���f��� �y����e�A�cٰ2gȲI��|��)��i��B,C-C.���K�$����ЫJe���̧��%���)�1�H����99�d?��S�@�Ჴ�g���.�ob�P�0*˺��c�/s��{>{H.�`�ճ-���)ˬ·Q�=�<+_���A�$'�& �X�.���~#���
�?��^nG�<��֍V��|�B:q��-��V��Ď
$&Ԥ��"F�
]�N�O���2��D�t��r�u�|���.c;���J�R�ڕ�!���B�j
�2��C(ǡ�}ff�l}i�4{����{����ׯ���Mw�קg9��c�����^�ݵ-[�������n��ZF�2_v� ���:� -c�u��O�?��B����1g\�΁�C�P���)�R��(���9�l�/|��i���jS�x��'`��q��A(&uȲN�#)(-\�84�V/�wڌq�~�V����o_N�W���18�?#�f��JBQ�}4�����yI��
Wq�|bMv���ksM\��jmyM��M��U�{�
�3���a}kuځ�j�\y���F#�j�~��v��FSG�ǋw��	{�Y�
���PH��ZPӸVR�f�K�I8mS����\
�Q����a�Z0I���	R�C����vf���R.
g�`�c�_�G���Msf�M0I�� ��������_-݇���t��V�.�k�O�����J�<z*RY���k�ҫ?�W��ǁ,%M��zq�00
Bbq�&ֈPMa|
��\����0�����U��/�y.t�cH�����g���Y���kښvrg�������C���-�xA��q��z��@H�qI崂�1˞���s�X�@�b���2�1������� B���=
��0�dC9cB���V(D���z�N�}
��gl=��w�3�Г��}��ԡ}�/4�=f�C�d%Ź� ���N�g0u���z��;A�n6-�R\bw�sQF�*�';%�ɰ��7�7_Х��+Vi�Q
1x�{}q�y ^UZ�lt��|��\���A�OJ  BB��U��)�8�%'=�

����Gv<b�nڲ)+���]���T�f��p�˘,1�)dR�#��F��t��f�W�R��$�u@��Ӎ������LE�sܪB  p�
HQ���c����^"��{��vu{'vMR������Uoz
- "P?�d�E��mB�;Ʊ�cdy���=!��X�T�F�ے�2
۲Se���v��6�
`L�67����N0�K4LQh��SH t8) �$z�Ә#6����LCa�o�i�5�[�D�bi���Y�� ʉ�]�i<4Cf*	~�Kmͽhq�X���.�t��Sx9��8�+��n�1����"�N5E���*-d߉e�7;�x�_������Ra��t�61mU:oVtz�1�*�_ �ZY#q�+Ҋu|
`"�,�-'7�?@�6_�lz�Z���µބ�Y�� ����/0�D�������˪� 8
m��G�v�3�#�I�����/%w�Yi,�*���%��׾Hp��YF䄍9�7�_���D ��ʛe ݹ�2.M�2!:�΄�#53
�#3��,����5 ��711z��ͽ��~/&��z���"|��[���I>mH�Ն�#ҫ���O��ճE���Q��]��6�Dę�_��l#>�f�.	�Zĉ'&F�֗�%n~��h�=���;�l#��t�G� �SN�	��Qp(�;eh ���<H+��&���s�$�9�b�w�9�w�=}F��2f
GPd��[?��#-G!���E���5�~E�fpᬆ��	�Ŧ�U�0�(���_�L)� ٣��rT0�myu�.N�L��H%F�w&o�EW�˅������ז���c�L��ks�ǘ�.�3��ңV������麗�
�����Y4��o�MW
�,?����K����$� �a @6 ڠ�!������ʚ�	�ٛo�uY��oI��x�B�tЂrd77�۹T
�B�?���!���cC2.˾����#�i���¤�����C_��M�����6^��g���"FD��dJ��(a_
���M��q��Q���Rƥ_0�%�@r�	��A�=�P@��!���<,��[c*A� �s�pm� Ջ�V�?w���,��L��_r�D���`�s�g�K$cN�V`�������N��l��m�+�5( I�P� ]�uZ��k�zEa1|Vk.j�	[�HZ%9��6G���ZK0��2���|�J��,^�A%����l"�5J橘I�E�Q94L��Y�a��,�Ɇ��G�
s�;�.�:T=�M�.%M=_@�u]?���M���""����Y�]��pEw�n�nd�n�NWAOx)83b���2��4����~�C�%��T��-L@��<$�T)���`#�%��$]��E�aL�Q�-e^�%��fvO:�B���y֕'M}��`f�CB"7�?y���l�1P��76�����E�/ �F����module.exports = require('./lib').hasProp; // eslint-disable-line import/no-unresolved
                                                                                                                                                                                                                                                                                                                                                                                                                                         k�njM?4F��� li s�W����&〙�k)�C.�������7��RN���#L��4�&T�"u�s`�F���3+�:bm�^�>�#����b7\�R[��쇅����:x�9] �9�f�Y�t�<
҄�Ø%��	�ד��3�� ��
ŕ�.q���)[�8�Lw�=�Zn!��h���j�)](�i��̥�h,����������ŤK%*!�T�ZNi)����{�{�vgݎ*Bw���)���~����;�vKI�G�PYS�Y�w�8�2K4܉�sЗYN��V
Nr�f\!?�=$����2�K�<��odi�~�3��Ҡ�p^���<��sS�&?�^���
��X�C?4��b ;�P���aKl{f�t��q}�U_�&)s�s+��Pf��gQu���.'�>|9��5�f�f��͇��-�H*���Q ���(%��&)+"����u���m $!��<&��},�8���kx���O�?q^��˛R�!x�21ҳ�fcK�Mw�����}��^jPß>U9/�|��g^ޙm��c޾�l1Ɠ��Rޡ��=�D�I5,��f������M�~
������Bǽ1%�_g�wc���N݋�_�v�f8�l��� 0�D�����Ͱ��5�U�9|��Q�Y��jF��p,��BPlBl}IeMv�9��T�%���:�J�����
� ��V�=��<8$�8ME}K�2�O��
���u�ŭ�:O�
K�1u	[-�W��╾��:�H�t����]�������G��>�� _�U�F�R8(���e��U��3��-�T ����������Xx 2V�ux�����CD=�;����\����j�����3�U^є-{�RI��M% .  F�Zᣀ$Ϻe���V�ܫ��А&�L�0):�F�ƣ���j#��n��C'�ۚ�ڭ�+)��$$R����_���������;���fOU����	���|�u!2-�� �8�D�"� ��;���^�X���~�_m���b3����;�R��b�)���p3�@4<K?�/	�y�K֢�ˍ[��Qg&y�'D���F.��t
��D��G�v��'��b�i� ��Vޟ֑�LD�T� �{H͜�3�ت0/h�A��O�'��+�>(`���hEL�.��!�v�=����(�5�k&�Fkn�����8��Q"hpE7G�iCgҫ���P- R�v]�UUH�����*K
�������#�z�^��i2��ꕚnȍp[/E��0_;k_�����
&��exą�U�
��.=�|���,Q�UX�#�/G�:�������g��Zk�%��z�v<��V}}b�`z�
d01��B"�y`-�_��=��q�%�=ډ�W���L�yb�C�L�@�0E1��?c�ݽ��Iu��a��%���R���p�����"N�s��_3�H�0�i��2I��
DA�d4��>x�C)^Z
ɗ��Y�pmѪg�8�h]P�:MmZ3��&��d�g�:���F!.��/ξQƱV���p��= P4(Q�Z�iR�˯�������X�D���P
Gj3�=Ǔ�����DԢ�
47��X�[�<�h
�E<�ǟ�  ��*9T���D�^�I� �.�w�R/kq�H
9�wmxX�tFz˳�����D:�m�}��h�����II�Y���*
�`Mu-��=��/X��B��}[
\�A&��Q���٦��r]6�kA�%D���A6v��<���Ҳ����5P_w�L���p���5d���k�rJɉ��O87;������ .�n���ɒ��
�!��y��_X��T>a��`3l|j�*�+�-�³���#[�n���p��+��d;|Ei�14_�Խḱf"�H5�QV+F6��SX�DC��C�@7��W��|��H4�t>Vιy#���J����%�N����TbC�47B4�lƬn̐�Vh�B�S4�E�i#�5Q]G�
�(X�����j�ǜ�+-5^� �@����n��j^]���V��T,"���jkT�/  �=a�
��p	�S&��yƔ����A�'gg��4FW�8d��
Q����/,<�|�D� �a�#���̢��D��[������W�=��_:�.�pÛ�J���
�U�/�A�L�u��k������$��B�	���)�����R+�p�!�G������ �]e��ꗑ��mLn��ȯ+��ȃR��6J�ٛ�Dƭ)?0
2Q|7#K�֦ppKoJH],�3�l�ǖ�Mk~��.�u�;������vkU��慖Y��NG�܍Z֮�}�S��'ҋ��
�-f��+�6-j.D�⢰.xҦ��X�?
�� X8$ ���=u�RPy�셼Ϻ���FRf126��+b#�Ƽ�1썑k�y�����Y����L��c�B��Ғ�,$�6�Tb���!N��@RyB�"3��F2�\�\
E2ݦt�~Ի:�o�f-	��r������h0�A�D��w_�!erw��n�����3J:�qQa4�WC��^m ř��`���_G�M"��
�SJ�b}3�FJi�(�Ѹ(c4��$@Y74
+�(ȓ�de�� M϶��,��6z�UB#X �B?l�˥�ZE{�oN�x������6F�a�Q��h @���ʡh�ܮ�J�i����iQXc_��e�Dl�������zDA���DD<���>�O������hE7Z9nJ����OQF�_�Owt�X¢�^n�DT��^j��I��{���hV�	=!�����?�P
��*2�+�%��ux*$�4z?�
�`�p=�SR�� ���$T���}�D
���`-����.f�un͡��j[(DOY�8t6�B �Y�Um��A����s�9��ŵ��0�EP�7�ؕ��*^<�xD���4��|�
r�~�F0�n8Z�:������K�;��"��
,k�a#A�B%L7���}/Lk�T��E����ƌ_A�K�����s6R.Rm�o�C�>��a ��lN`~�A @=���h1&
�/�4xZpl�d�޸��,gh.d&�p�H!(ph�kБ��f��v�9�7Xg�0{wƯ�N�X��4��)+JlJ����0�5������T>��0�("��xPT��a�
�L¢]Ym4O�!L���HiZ�D1��w��h*�T��4b� �dY(+�
#с�	�o���N�T釲�*DW�~%��nkDps�������"�Ŗ\v����=�W�C-xo��Vfm����oHfuHy�z9(_oA2���>E���T�'�z�X��d)���
����ՙ�'9��NAϰ��8 Xɗl#[�7}Jw;͝�\�\� �����/��Ze�e��S�$#�)[�r5\b�l�o���}k���q�+��i
7U �� h��h�8���2|(,�e,��@ �����.e�P�>	]s������v��Y���b��p�E���qBVL0��;�./���l�������Hk���'����9,�v�R�VF���*�7����I��^��S�T/�	.��I�ٖM�펔F�EC�A.$����TA̋��Xr4�+{������t:�� �����"F���p�h1MQ���L�d� V7����$����2aa��R֝��h�?B�q����ٴ�2�]
�����z�%rv���@�
�K�=�n�I�y(�!�gH�<{~�'k_�q��~���H�[�4��BɼW���-���A�W�ZY��Ҏh���ی���O,�%ij��D?td̻=���s���{�0y6Xӟ4�S7t�ᕘ�N>d���ԩ9�7�tAt���������k���:?)_[q�-ꎚd�fi� ��Z�r�`D#�ӯ�p�G&������f�P�ߒ���{�c��F��3�YB�u��4�����D�ᗯ_�#Z�T��($�جc��%�+-ģ���_��4�2d'T�z%$l4�ˣ�򋱂���(�L�'�Wj��8;%0M�����GhK>$"}/����{	�e� Z��U�P����%�n���,P�Z5�*�Uq��\�� X*�kKT����< �$�T�, �������ܲ���
�0�l���/�v�#@�l���!-G��Ƈ>�nw>QHͻ4���i11(h&���s�k�Q���=j�)M�4�%AR�� V�1��l��6���X�6L���;,N�$WI�pC��0[��>/4p���|��7Z�`Oe��v�t�+8�Xe����.��P �^sc8�J�������(l2���x��`ƚ�h�� 
KE�F�ֶAw� �ףJY��>�!4�݀y��ՅcF��`���n(���HS֍����1��ji�����YΛ����kҶ��O���i����:Vr�3����G���mҁR'�
�{�t A�*h1C��p��A&�9m=RZS��ӿ���5�����"4��Q��J�vד�>�K��W�I���#�ٸ�'
��۷�M^Ygx�����r�f>���ƞ�9
���H���@���L�ֽ�~��	�j   ��3��@rL(G\�4��P�WI8q2�߲��F@��h,�`��Pl�������� D�lB�3A�>�S��n>?�]|PJ(\e˥֗T�T$g�ڕ���ef
(�M�@��ظ�<���%��hGm<r�%O�|_�U�BH����I4
����q�§�\��!).g,���%������G^�
*C"7(F�B謏D]x �éI'K��bM"L����?��)�R�e��0劍���%�s5aGa��T/�#x�B*d<���I�<��B�=�"a[Q���D'y���if�}�/�l\&th�Ý}+��B�ha���`LYh|o5��0�����Ř�!�������	~����'bm�:o_ovh�X��{��<8t�d�#ڋ�)���+&�!	�*�=��j6�(D- T���%�F����N�ĉ�U�ړ������A�[*$al��!Q p�QW個BAq��(0�Ӿ�^�Z8�n$<�̙�)'�Ԓ$]�W5�w�I3]c
R�9�i��(fW�������Hc�9�j��w��[]r��3p*>$������)LZ�)QG�zU`FJWu�Z� 	�"A
3&6�&�-{��*���@�'�}K���
�Ԕ���$|g���:;�ˌ��OK0����D
E��� `MV�r����X;b����'�!�ф��v,��0���e�B$4��rH�p�b
-�"|8!��8 ���<��=�`R�9�� T�5�p�_�}U
r(
 H����^٨0����,{������wU��i2�+>ȡH$�b�@fyS!g��͆2�C��kb�`��d\~6��R�29�Fl��.g=���ݹ�,�Q-,L�d�7����ǲ��[;9\K�¥>��=׋�=�t�o��Â��g�m�Z�H}!�L�ާ`�jvs��/��(�g��+�4A���Z�2��m��z���=_����~٢AR�
1쿩a���	V��U[vQ��`YEWb��=Mι|?6���W�N~N��d�7߾hI2�����B8����h2����3�S�Ӝ��!��b���B���_��6�����xq�C�-2 )���Ҝ�B�1�k�N�"S�-YO�&��M�+�P��;W��Ӣ<дapZ�'�1�@���S�g|�Jv	�V��sS!P��|YR���X��s�5�<���ȸ��,��x[���14
ėy oN�h Q��s�
A��Rf�ԏ�
)\��!����z����3�FY��x��<�Ɲ�"�&O���Wn3UtDb��}5���{��,�Z��"�A��sz�V�\S�TI���̦��ݶ�*Ͽ�4��P�4��x�> pH~�� �^H/Hm�(P�ZVl3��đ?�����E01L,�Ll"\6G�8���D*����G��HH��٩�nzG0Tc1� ������m��BuF����N��Z��dz��O���d8-�k�2_*h~(6w�
��,	��t�:(�h�'�(�D+8�����j�3B�d��s��p��a�����Rx�t�!�9X]Qy�$��{���K))��aW�Q����h�%�[��i����}�/ ~�������IA��\���_w��
���T�a���q��`Fjo3�hLv�	fŻZ[;O���8�b����l�9��De��E2�q��ޛ��C�D C���m�[ꡘe�.�M�P/���`���/Ͻ�^�l�
�KY��?/����_1ٴV�Ƕ`j�cX�-6 �(�3w��A#]ݹ9_�x��N��\������&�v�>��D]����1�{A��lU���u�<�L�#+Ri���p;��?�5�}��q�l�D�
8�x��Bvkל�6���G��W> @��� �}�o	��\�����ؐvT05G�бe<�;��o]�wMd�,b��WZ}�%����H�m�%�cV�V��SA�&�ę��[$S4H�"Ĵ��
"�~+n���!yB(�d� {�m
���ԘQܰS��[^�N
��_p
䨪�HQ��Ԕ#�.��e�s$�U�e�Q'Au��ˣ������H��cq��4���=i�  ���� U�� '���F6D}0^����ձ���)�}4Eh.�/�	�SOqޖv����Oũ���R���g"Rې9��ɼ�J��<頎�+�K�#A���ڤZc(.[��Ʉ���%�Ťw���y���1�r��� �N����v�T�F���W�G�
Q�E��׹i?Q��Bn͛j1GB_[n�CK�2V� ��[�z���?�3q�iV�@�w��a[�xW�,5W��T��
wg���¹`qh1�F^t�����@s>Ў�17 ���Sj�����y	�n�����������$8�� �ޗk[�+�����6M���� d*�9*˾���O`Rʞ����ß8��{�6���DY�2�p�.�EhKL�w�$���4�.H�Ŭ�H��u�(���I������ܻ2�G�=��݅����!<Ei/��L���ǘ� -T��>��ӄ �xZ�u����53
��%T.�r�-��GK	ѝ��yR����;o�Eۚg>yq�>��C����t1�%Z�-M�h���=v:�  D�۝�)�6ɤ�p�W���������a���{
�"UW����6e!�ٔ&�l��r<��1zn�?�n|n�O�3x�C����KtWm�wB�뿩
�xbEq��M�� �l��OC����5e)�q�d�@�]�{�v��]3넃T��5�vCՒp_�ч�,t���'j�,B7�}��E�@ 28�ė��q�����T޻ɔF�T^�N�-��ϒ��"6qR��(�FD�IR��t�l2t��Pbi���,u��!�ܠ���G$��v� �h�MW$|6�7� |d�k˘E1��0x]��Z�������(.Lor���9����Ʋ��'�ʨ�p|N(9�v~�.��҈��2ӻ5���`�F����6i����J���J�o
�����P��)6'� �&XГ��Y\�����r�d�n��q!�۷��L�ڀp���[����%K��s��K��).@�Q���9�kMт��MS�8�Ǥ"4�tVѐ)�/��|ٙ��|a�н!ӶL��Ed�N�x^1�2#3'6���O��+��IKp';�m�}��B
aj'04!����	Z�!.L��D4خ������5pM+�/]:s����L�� ��'�W'��c�£�8�E4^DLx�
9�μ��!AM��)��S�- #ͷu#��	
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;
                                                        ���Y�_�o��/�ל���>���}�:u�E���e�n�K��! h�P�� L��~	�iU�X@} r�h�΁������4�{�0�X&����+?��
�X��*���,�y4�O^T��� F��&R�7��ي]QS/��Γ���� �������Yk;�RhK>�CucC��S��r�n)s�׌ҩ׻ϧF��
�^�>"����8����>����6v��Ğ�i<�5���.����}K�Gh# �XG�� ��Bh�!be�� #D�M�� z�)����rq� (b�ya�F��~���~.j��A��Ia'Ҁb�� 3~�r9 �1��]hs�>��t���P��i\5��b��lY��X�{B
F�iMF^����d0�s��O'��D���r����[ 3��&`aI24Qō��J�v��m�z:@.�J�~ց�%_MX9���o�_��.��<����kۚ��\[��>N�8y�ؗ
���0��V�h����0�I-���GW}�^�Ib]��5�N����c�
��[�4�7���u�W�q�8�}����_�t�����+1k��tI�j�yW��w6�ET)�﯋B+�C`�����(ة�d�����Fo窊l��#� �-�.F�(,?NO! ��l�}4@�縏��)8���=I��{Pc?7��WӼ�q����QE����aS���.K�r��D�/�>o�FC7d�H����⚎� ��~�sc8��F�,��
T_�o�˔Ў�;���r1�����5տ������k�ܞ������v�q?  �(�9!��wXD��#�!R�е.�V%n��hs�5�/���DZխ������̳���1��T��6A�7I灔�G�ͺ���Z#��ܙ���s��Hq�G�5���x;8��?\0�d�d��+�� _<`,#Ӿ�~�����hTSr�V�d`�&M�ǭ��-[��Y�� "@p����T�1�+��#�ҁ�)ܔ��֧2��	�����EUh��)ݐ��-�T\���
A�!5	��s����B��G����쯡��#���B0���B��{���Zkʃ��sf/�]$�5���?�Z�ؘ��>�� H�� �/��F���Hʯ�I/�9'�#ʣq��vM�,��f��½چp��_�": �m}�#z/���z"�)�	�L)R>=�elV�U�j�c���oeVjU\�ӷ =��w��e�z���/g�~�o-A����Y�I��U�Z T�皌�q�,��M���H4���e�8�ߞ F���%����h�ȃ{i�&�3�2���TG�٣Xܓ��r4?�;t$�%�����&��s~��92�ht�Jݣ�h+�w�ٛ2�ս��FѤk5�����M��b���a�{4�u�3\��;��B�t�]=�cTV� �7��A~�7��n�ͷ�"��`t�TY�Jn�����fi
�Ut,yI�������2&	}{���*�5���������W��%K��P:���Db6WBɋ���]�
3��n�1�a;�Љ�����j#4?T��ĝK�z%\`�P�b���4� ,�@dļ���n|#P?�i7�.��Kli"���	�c�1�����t`�hN��*5�
]��H�|���
�|�)#�{���YJm��Γ,H�~�%�%K�+�]PR~�&�O��WT� ���[��hq�iݬ��3i-F��g(g]��w��:�����Ѝ���_*)P���??������EJ�xh���([�+��pquǍ����<Z���(�N�W�����`�2�������	'���EV#Y�$�diL��o��,�GK��C��q�_c[����kх8�3�������ˈ�����o/�
�9�E��Z½�ҧ�nT�D����Y��q�˝���~X�.J�_���2p�	�kJ�_hX��E0�V��'��in��<�Ϣ�ٍ�Z~�T1K��[5ҽI����f�M�m��0���!�/�37��#DY�}��jsr��֝#t(�Ӝc�4���]���哌�L��a���V���~t�|�?g��4�kKE���Z�`o�ќ�r'�Z���,m&O�7��l��~P�~�v^��#� ��]3�D����l�Q�7�5@�1�<a�V�Q��톆�<�ߒa~Y'�s�\�M�+�����ץ���Dk����+w-�=#���ɋ*�t�Xs�XI8A_�Z���[E��8u�	5�f��,�[�4j�
j�P�B_�h�*��5
�*ZŨ�o��r��N8i�bQj��V_�(��1k�Q�����X�G��<0�:�<5�c����#7�?����'�����.��{��]9�-��b�I=�Gb��%��uIv�9�_�1��^E��:�ĝ���5�#��_�W{����"���� +4�(�a{:�۶S
�u�caV=e�%a���I_��.��G~�3�{�#|�Kbt���%20yE�G�= ���c}ƈ&oA�(`R���l� !�k{�X������zՙU��!:ς?�d��<��e���Y@JC�s�4|����k�yV����{��u�ݟ
D��0R�`�
=�,��uS��z�ˣ_�x����0UX���-��|�^�<��ŖK�ntR�w��	���s]~գF	���#u��~��
�n��|:�tu����5��0��с��, �@q�	���c�H�onDk�6�z)�hn���8�c�uz���M�i�����dėԣ3�LT�Ƞ�!^
E%������S-��4�"�41�ݺ��Z�nN��΋�g4;�Y��
��r�h�ꏺt�.�˦٘��0Vc;��jT}���oF���^w}��'����6k+�N�9�L �z�����%*� ;�aAa���������U��VE_� ��!���i�a��Tj��#�L�D����µ
s�]��&��B���� �f�cAGò�E2۽��H��Qi�F���J|u�ٯ2;��WmV�߉��\���g�m�d�ȕ2|�rD�0q�O  ����+K��cQP�fo�v�^6��=�\���A����Q6 [w퀊�E�� ���=��޲Z@b Tm��J�%���h�/��SHq�) �Ch�`b�&$R,A2�%\
�o��B�I��pC�
�>��Q����]D0"hĊ�W�Vr~&ˎsZ����I~c��ﾂ��}�{Y5��H�� 
��� ]@ m�� ��O�AXRmmq�	�G�/i9��<�2Zlw��>0O/��̔:_�?�ރ��xzdP	h�0 ��[������dr����5m�'�
�X�*Td
���|�L9 
ar��ZL�r�����c`+E�A��HA�/�"���j/�T�(�7�}V�*��(o���-44�I��{�HQD(����~�(�p]��09.n����[g@g9���W�'��c���4Z�b�H��ߖ�q5PƐ*Ta��	�.y3�Tߝ�HX��3�#~�t�]���賈U0'~GqFϣ	آ��x$��Е�ǽ;RN�����:\kHg
ۉo���ᱠI�O)��`I����ų�;�����>��޾�u%�W�Z���/c���,eԱ ���
X3��vX
��d����}'��5=���C������#�U:�].�Bc���7��,֟ �P78�EK�,e&&Q�`����}�(unpx�b����Κ��_#x�J����mV6/���r���Z d`�H�9�~���ϢOGqrd�&��wc��M�3�l�E"ːp��<&kh'����g�c�1RI���r�A9�3�}L���QM�]Y6�!?�\ߟ�#�:���'�� '4��.��H���!�8�+"W�?�������7HJ2O	 ��Hl_�A�9����7t�e�SsJ"<��wV	m���?���R^~F��ngu��*}���j���[��r�����鼗_"����o�����7#+��.�hͭx�3^�㓆꼊,�"q �&��%����w�������Py���^�k��|{1���Z�����Ь`��`ph��"6*4��6����.�$$���_��-�n�L�]b�lJd� =�k8y=�TM��R��é��@�m�lL<.�Vy)�2?˰P�AѸ_�3+w	\,��Dy.���p^ddÃ�p8,Np��֐{d�A�r��^�'��9�?���������]���b��Y�v4
G������'�C��U��+>%6\���y�?B��azZr���jӾ�ű���R�Di���_�t�'�%5��  G#)@MW��~m	u�J`����T���]w@Ue�/�b�ʃȳ�i2	=���9F�N��m���mD���
I�KSit����j>�|�����8>;�qd53�^ĸ2��1���'C VZ���A���_W����!�P��o����8��תt���Zc����vࡋ���8�G_�6��Z�4LanM�N�ly!~���ܽx�֒���#�=*��u��#G�r�{?M�3�F��0ͦ�6t?y�^G��#{�?�"��R��:�\�@臘?�R� %�ٳ�^Q>W@u�MJ��։*v�kd��G� ����AL�[�M���|�t��4�}�Q�-e��xdg�d{�����,ZHtۮnt���9�I������L�|���IR
��ceF�ó.�D[�h�QB��'�B�85#5��oY���ُ���/卾QhYDq�a}�鷘�5��T��xD.��E����7!c��-�w�-�ni�ȏ�c��~z�E*���F2I�]:k?��^v���4���a_�dj/���IՂ:>���%�j��!w�ۘͣ��
��}�I,�y��)!qn�(\~������W��7b�j�k�Ͼ�T��W���$  
�:^+��t��� ���	u�bF�bݙ��A��e6�E�x�4�~vuZ��y�r�':ɥ����b�
k�,P  *���N��+�� ?Z�}A���+[��v$	�(��p��v|ɺn1s����35�SAZ^Su�$����<��?�ڇ�t�� �@�ث��0 �FZ\?��t�q��9�k�P��"���C�!]P���#��+-�#��d�{�#rFC6G��m��qW��aK�9JI���d�p�����A�ؼ_�(	���g����c��������ضm'�m�Ic7V�&�ƶm۶��jl'M�}������=����{�̙S��jJ���6��շ���5ץ���Z����ǩ�U
df���0雿�.�t%���W0�8$����B��鷈*���x���7���p��*��B�t�O�Xr�sC����F��n�+�H*�
�։�	@�P!�$��M��f=���P?�6�O*H�#5�q8���\   ���%C���g@�C�PHR�{����v�\H� ��3���։#�gʲ�W�%�������p�h8Qy������j-���%�@A�ddA&$���e�a�"I�h�zX��S����9�[���t-���������_�+vY-(evU]-��;���<�^E��OnR*~�ׇ���Ȃ5���e:�� 1�	u�ő���sq�L)��u��G�� ��x"�;�s0X9_��P��L�'.�3����������� �1@�HC8#���`ӑ[��N�&4�u%+�_���+/
d�GR.<��kH��e@*�q��y�](�T�ڽ�NUM���l>�αH[t8�6�����m���������&٨M

��x���S,)˪B���5�.a���/p�\���
��#
4�	�.�ʪ�C�e��O�ɄT�[eO/2|J�5aj�Y���s<`%��^0��9�F�����2�WM�Jvb�=�=�ن9U�*L�]䖉� 1�|��}�a�YõV�X�a�Sz�ٍ�cy&򺸦U
K�j���F�_� u�{����
�d$޺;&b�`�_�#͕9��;����z�e���j��A�SM������g�u�|e�Yf0Q�>Fя?�L��]�UU�%9�9�«;�m�1��)0d������� fX��~~��q72Z���߸p���O��B���ӏ.�c��}���Ҟm�<`0�[��گ*Sv�N��i&��	u<�/�7�[6qY�$#4�����?��������=��
�̶zJ�1�1k��/+O�jC�o�=�^ޞK�N'Wﻯ�7&&��ep��6� ~ji:|���iT����(2�7(�@����H�l�H���
����H�q�a�r�q�[��_)�y�\o�g�M�=}�*���������&��;)�Bk?�趟ɩы߱�8
#0��^��+YB������E���0&3�y5�'��n2q��ß�\���
���Y���1��1f�P�T����,t-u�̡W��o��m/i�[�'5��b�ə_��
��͗�n�'�N5V�/�ɜ_�!���@̧t�ù\���:?�z�Ϛ��I8��?�̆飲���3���W=�E���]�m�}�����O���g��@?�,rIw4+	�iJ6�:����j*��Z�u������}E�;4��R�����!͝���FDC��yGA��I!Z̖r��WY͍���@�h�n�DҔ]_��Q��c'&̘n�;��ƒ��R�0S<w��M�J��ƶ�-|D�mN&X�	rj�]0m�D0k�?�=hE[� +�b�з+'KD��N���U��h\zPM�<U�V�X���o�V��G�Y@?�}'5���l���R�s�rV-�����:��\��e�i�j��#�U�f?w�ic�Ij��d�����Yh����Z-~�Ȑ+�O ��ř�~������j�6��ּV����fs&�< .��Jb�w집ZB��Z����� ����{���G#_��G^4�>�`p����,����)�X�)4J����̎�8�jx��p� �
��x������P��@逓�D�] P°H,�2�|Z��]in����PB;'B�c<`-���Ǵ�V�Dpng'�~H�R�����Y�3}��������'�M��&S�N��1�Ƞ¸�����?1��ێDx�_�ۋTiy�}�C�<����Qhn=rOI���A���}J�45�[!�%�Rʗ��O�J��r
�t��5G�sհ�2blF�u++v��rl��b;���D�H�U�}cS?ͣQ��+�����V��?�ӿ�-��H�q��j���(=K��K�񢺄M�0���R��jJ�CSIg���b�
%��r���w���9 	(8c�XL�LA5ab"Z���*���E@�w�Ր�e
�=�7�J7`	�z�(k��Jh���/�p�E>Z�0�&�xif�iJ�OX�Yx-<�4��i���/Ѫ\p�p'0�,(�&5'#��p+�u���A��I�X�U�X�W��4/�v�)�l
[_��X�������I���h
Kc ��H���K��,.Kfj��Gw!
L_]a���#[\�5lHGX�]@#�w�]~�E�H�E'3�Q)��pbѩf2�s�� �`Ќ��Dp���h�8�S�(V����7R�ۏ  Q�9��[�K[��)��x"6�Џ�B��]^;=��ц�RR�?\oݻ=�}��eՒs�U&"�Ϟе�xg����l0��0]���>Ƭy�7��]1�u��T����Q* u���XQ����?�x�+'�S�����lXU�Ғ�����pЃ�JK�i�D��Y�~�eKM5/q�L�Y�0�+e�%��f��h'�u�u>�)��e�i6fol�
��C��N	�:�N�����tF�ա���ױo�=/�`G-*	\'�]5����c��s{�Tv�~��2��5E	�3��������x��9��Z��_�$i�~���1óՍ��ءp=�+���\��gpg{��ag��@F`n����I�����%|�G��Rp�5�k����_Ȩ��'��~:�rgem�����ϸ ~���t�^?[7Tϸ�Huv����z���3OC��$���H1��64\�;�YYn�=+��n�*!9�I{h}P2㇑�ڮ�Q�3S�lW�����	8(D!-E�F�)��d�
��f�?�Ub�ļ⢘3��d2	��
[�'+� ��w$�N�2�LS'Pw�����lQ�}��b�ؕe(	�l�ɷ&O�#E��xk8�Լ�'$"(�9\q/����Y�]''���-<�z������gd �/��<Ε��$rP��W1�

const color = require('kleur');
const { cursor } = require('sisteransi');
const Prompt = require('./prompt');
const { clear, figures, style, wrap, entriesToDisplay } = require('../util');

/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class MultiselectPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = opts.cursor || 0;
    this.scrollIndex = opts.cursor || 0;
    this.hint = opts.hint || '';
    this.warn = opts.warn || '- This option is disabled -';
    this.minSelected = opts.min;
    this.showMinError = false;
    this.maxChoices = opts.max;
    this.instructions = opts.instructions;
    this.optionsPerPage = opts.optionsPerPage || 10;
    this.value = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string')
        ch = {title: ch, value: idx};
      return {
        title: ch && (ch.title || ch.value || ch),
        description: ch && ch.description,
        value: ch && (ch.value === undefined ? idx : ch.value),
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.clear = clear('', this.out.columns);
    if (!opts.overrideRender) {
      this.render();
    }
  }

  reset() {
    this.value.map(v => !v.selected);
    this.cursor = 0;
    this.fire();
    this.render();
  }

  selected() {
    return this.value.filter(v => v.selected);
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    const selected = this.value
      .filter(e => e.selected);
    if (this.minSelected && selected.length < this.minSelected) {
      this.showMinError = true;
      this.render();
    } else {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length - 1;
    this.render();
  }
  next() {
    this.cursor = (this.cursor + 1) % this.value.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.value.length - 1;
    } else {
      this.cursor--;
    }
    this.render();
  }

  down() {
    if (this.cursor === this.value.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }
    this.render();
  }

  left() {
    this.value[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.value[this.cursor].selected = true;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.value[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  toggleAll() {
    if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
      return this.bell();
    }

    const newSelected = !this.value[this.cursor].selected;
    this.value.filter(v => !v.disabled).forEach(v => v.selected = newSelected);
    this.render();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else if (c === 'a') {
      this.toggleAll();
    } else {
      return this.bell();
    }
  }

  renderInstructions() {
    if (this.instructions === undefined || this.instructions) {
      if (typeof this.instructions === 'string') {
        return this.instructions;
      }
      return '\nInstructions:\n'
        + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n`
        + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n`
        + (this.maxChoices === undefined ? `    a: Toggle all\n` : '')
        + `    enter/return: Complete answer`;
    }
    return '';
  }

  renderOption(cursor, v, i, arrowIndicator) {
    const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + ' ' + arrowIndicator + ' ';
    let title, desc;

    if (v.disabled) {
      title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
    } else {
      title = cursor === i ? color.cyan().underline(v.title) : v.title;
      if (cursor === i && v.description) {
        desc = ` - ${v.description}`;
        if (prefix.length + title.length + desc.length >= this.out.columns
          || v.description.split(/\r?\n/).length > 1) {
          desc = '\n' + wrap(v.description, { margin: prefix.length, width: this.out.columns });
        }
      }
    }

    return prefix + title + color.gray(desc || '');
  }

  // shared with autocompleteMultiselect
  paginateOptions(options) {
    if (options.length === 0) {
      return color.red('No matches for this query.');
    }

    let { startIndex, endIndex } = entriesToDisplay(this.cursor, options.length, this.optionsPerPage);
    let prefix, styledOptions = [];

    for (let i = startIndex; i < endIndex; i++) {
      if (i === startIndex && startIndex > 0) {
        prefix = figures.arrowUp;
      } else if (i === endIndex - 1 && endIndex < options.length) {
        prefix = figures.arrowDown;
      } else {
        prefix = ' ';
      }
      styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
    }

    return '\n' + styledOptions.join('\n');
  }

  // shared with autocomleteMultiselect
  renderOptions(options) {
    if (!this.done) {
      return this.paginateOptions(options);
    }
    return '';
  }

  renderDoneOrInstructions() {
    if (this.done) {
      return this.value
        .filter(e => e.selected)
        .map(v => v.title)
        .join(', ');
    }

    const output = [color.gray(this.hint), this.renderInstructions()];

    if (this.value[this.cursor].disabled) {
      output.push(color.yellow(this.warn));
    }
    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    super.render();

    // print prompt
    let prompt = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(false),
      this.renderDoneOrInstructions()
    ].join(' ');
    if (this.showMinError) {
      prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
      this.showMinError = false;
    }
    prompt += this.renderOptions(this.value);

    this.out.write(this.clear + prompt);
    this.clear = clear(prompt, this.out.columns);
  }
}

module.exports = MultiselectPrompt;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           =m��;�V�lK��n����E1���g��r2��P���� �����HR�]Ba��Z�Z��������Z�v�R)s�1[����*�!��Y �_JR����i綹����`��P?!u�L(���H��[��Y �!��\;yD1�QZF�?��a�5b�]?�������+�m3�yi|�geߪ�)��D|�҄

m��$D��*ֿE���wڹ��lM,U��.W��f&�U�D-�_aj��d���rhpI�R\�BU5a�%t/苐�s�ȍ�+"i<��D��+qǰ^~�{�� ɪ�����)ٹbz,��������rݚ>��T޷4{(��?��R��c�q�)�]i'V�����
��:����p�. ���^�n�13��O])UJTH�s����ZK�z����e������9�p���\���橺�uE�=ʤ7bM�v���U@�uS��e9G�EA����!<eq�YI	X3U�����|��yeE=�|�F��m�FKS�m��;�{~9r���
|&���n�;�����=���ƀo�H@�+���ɉ ���5fӡ�',��T�JJ��X�=�4"����������_3T�+	2D��ƭI~�-(�W<����C	�$`22G"'�wE���b�m:���\�?~�FuWqd㻞��c74�X![W۪�J%�a��x���]�&���න�~z�}{�D�����$`D4�����g^���t���g�B
��QR���e���h.y�#��=S�)n:�Z�s��� ̓~�/v��e�Q�w)��i䊰��O�W��I�(��� �|�I�F�B�?Gn<ռ������O���1���m(����x���ߜ�Yϙye��h�[c��B%�̜�Nn/hWz����ӭZ�Qe�H6@V��DY
���og.r�������˰��C���CR�&ʄNƢ,3=���:)!ف�K���+7%�??r"W��Ӗ�{���%��%jP�"�,���)Lz���h�ރ��ʤ1�ShzV���54����m�1ŋc�B萘F\���Бj��K~�.[���:k(�|�/�ҹph�'+�;�͚���iXq_f��`VJ�'�����Q�HFM��K�IscD;J�V�C�a�=��X�و%�����L����i,.$r(p���%z�����%��q��V\��0@e%6���w�g�f���JP�	�GRQ_[��+���IxH�gn>�LP����;�Cx�rCfa��������%�{���ն�@^�"�'μ��j�ۧ����8O�%-8���i[B�bz�c?�so������rV�l\��+
Wa�Vl��W��Vd�d[�g�c�82�p3|1: t;�lY<.!6b��������������b�.��}�գ)�wyYK�5��Sz,o�t��,����McT[���
,�0�����xMghz�?'�rd?G"*q�� �����3.]R0���*M�<b�7�O���ײ]q̷��e����iZG |oRD�#,hA�QB������C���ɤ��e�nȟ�<G*a6����L��7�=�:�/l�L`�?��8�0���S*'���]�wē���ʅ�������+��K��j4 =/�"ǫ��ذ

�'�?�4�S�^E�l�͈&]\���cla����_L \0��cZ�I�`�k��-�	��{}^��ƖF�}���g���,/�(��V,!�ln	�wo�"�G�\rXeG��\@��O�������o.���%�Kz�/?(�9D��9�Z����`�N�2d(��nb��E���l�r�J�����B1������6iJ!'�ѯ��B"Q�]Ƌ��d��G"���f�
@�bn&�k����fn舎b��͓��^,-m��f�y]�ª���Br�F����A���*p��@�,"+A�.�DB���l#�`��LW�~~%V=����g���O� ���cW�-�{���k	�b��r�TS�)��pE�q*�@�*Zs�J>�7~�Q��dI�[����`���
\������t
=h���m^�,칛5;Ƞ��k �x�c�Kõd|欺����C)cu_E���efZ���(72i}��djP.._ET�~	�]E�*x�fF"�� �X�B�oJ��2�ɾVz�%٣(��"6dm��e{�s��B�Z:lF>�%q0щ��w�G�$�������1Ec>����������+�M]5"	�u��f����;���~����K��P�c=�OQ���r�u���pٹ�B��(\�
����MM�\��R�����?B� �%���%���P�~ �R�y5[E����d���o�@_�h8���ՊK�pJI�l�4r�'���v`�K�a9~�7%�9ϰ�7g���s�����
��L=�D�K.QD��&�?ODS��gQ��cح�@Aݏ�~nB@�ī>��u⢐�٘"�����"�lk�7�.�24~s����y���p����WN,/G�\�Q����bsP��GƖ,��G�h��o(���׷�oW�8m�w�����u)��fb�Ҍ��x �hD)�T|����>V��}�ަVP�	�옭��Y-�#� V3�(� Z�U��T ���4�-+;$�Z�D~K�Z=X�L��C�6K6�i�����L×~3�#�d<,�ߤ���;�.�2��㏊�%fgL�d#�@��7���X��	*-���.%����"�7�HzRN���G-9�?�<j.8J1�-���S��Q�H��F�}Y$��P�gi�Lg
'�E���(Ǜ��	|���Xc�	��:��J8�k���+�Y�u:]�OB��:�X�_��w~p9A �f>�_�<��-Iqo�'��z !�
[#�׷���C2��i���kY�7����V2j+���l��f���8��6yn�n\Hh��11~ހ�~���amo��|��b%
�R{Z�xĤO����
�ss����3����Ic�*vے�V�M��BuvZ�5�^r�Q��� q��a-A@i�z'� ��k&A� b����������P��+#������Yf�����m�)����f��%=��xͯ`�/Eg\]�$3�m,�-�+s���b�n�,�Λ7�<�R���M�~�m�%М<�Z|��5��fg ���J#���@Ic�k�5�iNrݶ:XS�@Fh�V'�L��V{û�e�t�m�.b��CkX��f)�թ��x{�_�^�
��ݢ�T1�a~ o�����PW�u!��e��4<�,��_k.	��?��� ���Z��E���k���r�u��&Q��/�v���&�вIԹ�Fn�+��'�(r�����Vd4��B*-Mu��Nr1=X8�)���>�wP4��1�@����[�ç�������.�T@�!�9Sa��Y�pk��Z�k�� ӘtYD5%�Må�-���� ԑ���3X_&�n�y�cP���P����t���¸Ș�=�X|��;�:L����,��J�m�N�;n���@@��4�8K�[J)G��~kβ�A�6�h�m�*��`��ut��e��d��_}e9ͽ�(��-�N4���Ǻ�jL�/��mT��&�Mud��Ħ)�E�8�	�L6��O��s+	�(��B�&y�$P0�
/�����t�e�*
^��ڱ(��
*$ �|0���5����?f������LI�C�刊��i�eǃ�GH�'p�$���ϡz�%�4I�<ڑpi�{-����x��P> �Xۜ�CT���Y(L	�ˠ�X=�6���.W��*���z�×�,����׽� ��Z��5.�7E3JVK�!��B*������iX�^O���)���� >��P�$4�����V�-�Р����W��)�XJ�z!��T����0ж���*�U����'�Iyw�O�][m4�ao�{�A�8ү�ۉ�V���o	���{�d� ����WV�W
ȫe�6Mc�)��	�$�<EpM3�z0F7�!5��{y##_�ɺ)\Y'R��
Gk[�K朎B��ߵ^�� ���Sb@�0+��Q��ѣ��0�����,�?�ԛ�gԲQ�*��{�a�4�]�E��'�3���Z �h��!V~UU��sA��HE/&!����Gmx�'v��3T<
W8�,�4�
�[��As��݁����%����L��J��AG<��6�n�~)C3��-����od��wTk`����y?��7`�G �
 E���&
���p�W�Oݕy�7dd��j�n���I���ȴ;O�wU�W>$��ϙ:�r�Y�I.�H��G��n�[V�)$���*Yo>F`�CP��߳����T#�C��$)��-`5�O%JԵ{�)����6��ʥU
.��<?<�~�߅K;U�ʛ@#CCӰ�2x]�0\���";c(�����bN,Ȑ��:9�5�*?�'�˦�Đ�k#�GcvƳr��� H����4����S�u��pb���097��/M����7^�0E,L;y�j��������\��-6JQ-�j��&�כ;x`>$���+� Y�>p�Ur>�<5 ��zpm[��(3�7�:4��e�PC3�\��*`�C�F�G��  b��B�%��OI@Vލ�X�� �O�f`3���Ikat���~i���+9X�=r��t��Զt�7\ɽk�C��� "d����g�X��TfH��@~6R`�ґ���i�����Yo紆���d����s�H��u��~�D�9��/\в����D�+�٧�"U04!���-�~��ޭ�l������@��5`�v�yD% �4��`� 04��\���[�D������1�6כ�(����l�d �9�L���L6��|�o�~,�����`�RQ�uh����R��q��"j~3�����w
�����)�;?�?��y��g��Z5�Ò��h��-	
�̾�d%�����F��G�2M]���F���t�ċN���WS:�O`�����G���e�G�)����EɉW�<�+�i+�C0�MS�˼��~&��Dx�=懦�
|�ҏ(��Q�p5`L	){�I���O�!�����
<	dw���`��c��F����f�����ۿ��_������9�ZZ�� �h�ɲr@6r�uG #�����
~��~Kǅ�EN��`�H���s%����|ӑ����[�&��gS5'���+��� �tƊ �~  ���T�X���Q��+�W���\���G+n�t�4�J���QH�Ոb��L����N��%=
@�����V�k��® �ha���ã�~S��e���(XqpPqVeAI-�dNVU�":lU�3�+�
x(�>��/�g����z��.]_Hq҅���T~�����-�rd� ��  2��/)T
��VTu���,��hS��zO*�
��ˋr��*����>0�ס�]Z����T�窡����k�b+��QLbm��S���`UZE������70�	[_�ҍ�q��Q�،��1|� �Q'�l� �@ أ�����F+_P�{A�S���z(J�j��	d�_hY�N."��b�~�X�k�;U��ݍ�=�2Pg|u��0~ �|�a�O$�O��/"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const paramsLocation = params => {
  const [first] = params;
  const last = params[params.length - 1];
  return {
    start: first.loc.start,
    end: last.loc.end
  };
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'Enforce valid `describe()` callback',
      recommended: 'error'
    },
    messages: {
      nameAndCallback: 'Describe requires name and callback arguments',
      secondArgumentMustBeFunction: 'Second argument must be function',
      noAsyncDescribeCallback: 'No async describe callback',
      unexpectedDescribeArgument: 'Unexpected argument(s) in describe callback',
      unexpectedReturnInDescribe: 'Unexpected return statement in describe callback'
    },
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isDescribeCall)(node)) {
          return;
        }

        if (node.arguments.length < 1) {
          return context.report({
            messageId: 'nameAndCallback',
            loc: node.loc
          });
        }

        const [, callback] = node.arguments;

        if (!callback) {
          context.report({
            messageId: 'nameAndCallback',
            loc: paramsLocation(node.arguments)
          });
          return;
        }

        if (!(0, _utils.isFunction)(callback)) {
          context.report({
            messageId: 'secondArgumentMustBeFunction',
            loc: paramsLocation(node.arguments)
          });
          return;
        }

        if (callback.async) {
          context.report({
            messageId: 'noAsyncDescribeCallback',
            node: callback
          });
        }

        if (!(0, _utils.getNodeName)(node).endsWith('each') && callback.params.length) {
          context.report({
            messageId: 'unexpectedDescribeArgument',
            loc: paramsLocation(callback.params)
          });
        }

        if (callback.body.type === _experimentalUtils.AST_NODE_TYPES.CallExpression) {
          context.report({
            messageId: 'unexpectedReturnInDescribe',
            node: callback
          });
        }

        if (callback.body.type === _experimentalUtils.AST_NODE_TYPES.BlockStatement) {
          callback.body.body.forEach(node => {
            if (node.type === _experimentalUtils.AST_NODE_TYPES.ReturnStatement) {
              context.report({
                messageId: 'unexpectedReturnInDescribe',
                node
              });
            }
          });
        }
      }

    };
  }

});

exports.default = _default;                                                                                                                                                                                                      ]�>�
�����@����mZ�u��G�Gyo�/+����y���FBAZ����U���k���/�P�"$�t��#���z�IX b�)O�����[DZ鰱�]�dq�A	l{�G��`	R����uV��0������������tƑ�1�#����+Y��[��s�R���p�oP\ϝ����R3�FF��%��	imWr�z�a�a��ۤ�) �\O���t�޼�j��*K �he��\؟e�'��
�Lr[;U��2B,P��Sue�P�L��2$�{�(}�/��T�;sv�7�h�qK�>������4� O����Wt��0T�(���]������Y����������s�$b-7P�춹 {cGe]�}��}$�*���?Tp�%��{�=*��[�������CTs,�h!s���\�9o~;}����'����
U�
T���%/�uuc�ג��8�~�'6�%���w��ntM٤���<�Zd̀;6؊4����%�[�*~㙎\��P����`�ߐS��E$LgU�.|!���uzՂ
V,W���7/&��?-�Ϧ    ����ٚ�jRZ,��GG��#FE(�%o;I����DJ��O�nACT�:��H�I��/�jkte��Ƕ)|:�
u�|x$��}�}���T# �0�)�IS!�i�l���|u�t�����Ti{�b"�Rs��N%�(���{bQ�V���?�-��I��n\�kU'C��֝�c���B�_�G�$���wv���2s��T1~��Mi :˞8,�,��Q��V��4?.�i�φE������������N��9[���
58e���7d)����z���J�Hvo��E���n���d ��3�B�*��+&��{�|���K��l�@��x��*�ԯ��׿���M�&pZx���m��W�JFk-RpO�ʦ�
���[���v��v����a/���B�7R{�@��Q(W2f��n'��eА�M�m�;x�B�0)y�4p'�o�`��u�.t�PSNk�˲�+s�z���f37���]�_Zx��X>�Y�"��K·�./���n�!\�쒲ImC$-  @�Ӄ��H��~�4��'��\���)ʬ�L0��Av'ʰ�Fܡ���S)R����MD��@}&F��}���O��~������� #��7��+��p��8�K!X��i�������c^�����,?�<�� �W�e��X�]�NDӑ�tH$I��_���4^�R��V��%�Uw[�r¨}1����lHr�YAa1�#�In�5PЮ�3��,\���	�
�5$�휧��58k��ǫ�'f�?N���W�2A�sT) �?-���O!��$"����o�����U�!^4*�&mF<�.�f����f7���uE�b�i����5N��8B���Y�?/w����A�%jE�dy��m��-[;@���;$⼬02�[3Ko��b=y_���L���M�������P(�G�[_Dj��ABή�|VϥF�Tw2��P��o+]����J}6�߄㏉�`���1���g�NDc�N�Կ���g�1| $GՅ�O�^�hLə�ٰoϽ@�^ ��*`2�)�v��Y@Nؼ������ �Aw�u�N~6/���&�
��H�"��w�v��#� /K�"ؙ���l�g����'f��2��.��zas��[]�܆����Ԝ�'�J�ʎ�,Br�Ǒȇ��n�i�~V��a��\p��M��Go�w���x��jx�?p�g)(���a�$����]ȼA:�s��K�ɳ��C�ҿwD���e�K�:杈
Մs��X��O9f���0*�u��ó�Zr`%VXG�tJ�u"*����U@�NE��ns�^-yT�gt5Z����&td�:%5�B��TO�m���A���;l�,r{�R:�rB�6����%Pqfc0�=�O�A�!����-Y��/X+Gs TN��մ" ��{;������-"��2ڒԕ亴�,��o�O���Y�|l���6���U����cq�	�˻�栮�Q9�d�;m�nr�{x��J��֎9�r�8!�>�8r�	�]�OÚ�IRȬ��޿ƽ�`kDRI@�����)|�dq]�i�е��%8��b��:�X5eO;x�I�:cV��c�b�D
�n��Y��,�b��GT�₮�T�U~D�|96\� �L,�K��N
���a  V�Sx1/����Dª��9�i�,ҟ�e�`�ȧ������"����c8
�����r]?���{�}%�t}/4������?r|C�{P��B����=�^h���v�Vj���7ps��LLdI���5z%�P�Ī�n���	1��HS#d���"xQt�L��*K.�.�g����|A_�X�;$7?�A �ç"�,�?�FF ��>Jq�t˺D7�B�61�`�G�
F���c���ZG������_�\f�yUM0R��H����r8�Fw����
~���T�c��b�N��x�"����`���鴲�T�����e��r O"ē�_s�}��=ڵ؇:X�t6ce0n8�aP�fPKTЗ0��#d2R�V>�ۖ�H*.('�촒����O�J��̉�Å�۶�d�I���r���K뗍!5� ��;[z�mi>W��H�KyN�UҰ�2�߲��<��ߏDɿ�(_ ��`��@���)�6���s��t�Lz�)���J�1ޱl�V�=�qn~���������J���x���<.��H�7Q[����(H��A�c�y��[�� @b�������}q����kNg�� lH_oI/H�AW���55�Ǫ��g�i4M�#�fzQ�*Sa��!�"ސ�1�0F V��ŭ���쭹�d���Hv� 	��_��$�jha��,�Ƣ��ߣ��7,�԰���r���hJ�\e�L�vnԹ�>3~�w?��$��&��?�r����M���)���}~���ㅉ�p4S�;Nq��<�w���=1~-~��v�J�I��+9ѹ�����FBke"� P�m��ų�I���>J��w�e��qPT�3�_��	�~|[�����P湲i{:�����
n��i�-{�H��O��-���p���+��oL��或�`"��Rp3��r#$�He��~4ge���?���9�H�y�8ܘr\r���]0F0	��t?���ަ�Z�\�cR�q�����cx
�h���"���"�Fa�wI .v�Àh��7�>Zp �����.g��5ߎd-J�)]áGaY�$z���e�E��R�p
�b�������ۄ2Đ/�a>�
.������̝�i��;Hɖ�F|A@�{���3U���r�2C��T� �+T�8��j�����10]yҲ	�S|�A ��=�������ㄨ��=���dG&���Oo��r���µ�0Vԇ�'�Zn��i�+$���a������P0���)��5�7��X<  ��T'8�3��OV�}0r���:z���y.y{p��p�۔��n�@�r
�zX���"sD���F/"��U��������0iǋ�=*���T��9
 �9�	'sцj���Z-�M�N���/
�ؗ�Me���J��^t�a�[��F�hv�A\�;}U�A<�	��̅Q���>0���
3DHn��ø�o�?�5�%�����[u��6�0!U���S$M+A}��0�1)~�C�@���0��+�K ��BDC�#HI�R����H���e����Qt)�-4S��Vx��1��$�9>���(�]a���$n����d�z @�����[�g�	Q�+V�p� ��s��pJeZ�
�v׊(O�d2+�������bMN�׆ʼ�S3�YV�3�fdq��Q���v�$���.K�NU��v�Jj�)r�C���y��s��6���c�^��{�&+!�$�J����_��-�e���<��r5��w@^�w�v=�k�u1y�g	B�h��S~����xf�:3�}��%zE�z�{^�	2�PL�Kn3h��� I�A~�
'�+ei#�NY-K��<Jm��
e%�ڊN;���H��D�1��Ʉ fc��Mʪ��Ȓ���HTݽ����/����<�)�� -�O���\C¬7�>�Q<�|���U��e�l?ǫ���E�
G�`k�j�,�7�Vě��.d�]�@�~b���X�"yB/���h5��f	��da�ӌ�걖��X����?V
���b���'n�Rq�2 
���9i�ޖ-��?���`}�|�X4����� ���d8�Ǟ���w'��:�.K"���aܺ����f��$�I�S�$���G9����� 
���:����r��r�z�>�@ܥ�9aY=��s8x��]��(��=MA�k��V�R��^M�,��w�E[Z��ʪ�IB�򡴷���ku7��~!˜O���}�������)���ʪ@�9�R	�q�����v��x�Ӟ�M���� �����1��fra##l$" Ev�.�<]g�0���Ç��3G���k��o6����^
HRu��Gw��.�t�X?Hc��-���wg����INy����q�( �AĘ|N��!<|���c��'��:Rԁ��ݙ�>��{�ooT�y75�!�*�EM��D�������V)#hϣ���_et�tJ�W���*VW�\�=1@C�S�͐=��V��FTb}��G�,�sx���7�m�l�&�m���6il۶٦Q۶�X��}�~�����5�|Fgw��.��͑]�Q��
�u�J�=���1�4.�j��PX
.����eJ�o��q�ף_f��s���`��ӗ�iߏo�9[o��-8�}��o��� 4,|:���Z��n����@��?B� �������:���4���t��L mݏ�t�g��[�t�,,�UY�ՠD�.l[������|����L�	9��y��:iO'w|e���5L(wP�U]���&��h��f��B����F�<��ˌ���b����'�}�x;�@7�D>�,N����n�6I��p_%
�G�3s���2�˓��$��˸��q��+$'��#H�:+7x�rV�i��
�;�o��5����)f�t����~��~��Ķ�a �{T��ab�� �&��Z�VV��-g�1��Esu�>������_K�2���o��GHz�r&��qk��r�lŌ����;��q���l�~ ���������eM�e���u�\f��aN��p�1*3-��^5#���ɑO^��S֨���ڍ�ǅ �_ь����o���?�BvL����'F�\Q��>n��\&��$vx$��t2¯
 j#c��);Nv��V�
��*7��3S��d&a����O��
B�c2�9�&�X�0ƅ��0�����|u�o�Ŝ
�[�����e���v
��@�䦜�P�9?�������މU�7hp~~��`�I1�KQ�#�
oKjy,�3��x�3˥���Iɢ�s���h��~ i'��^�]�B���N!�E'��,d����A�E�X=nB�}��*0g��+�+
t��9���G�{yy~
��9u_8���t����Vg$��ƻچ6ű-dv�[H�V1ym:�����|�a�V���DdJ㉖%I$+��JEt��1��X�#}���9sU����=�J��}I���J�ˈ��v
��~��P�a��q�5X"�o.4�ڡ	 Ȕ0)0H�_c�
Ɉ�n�teN�����E�M��s�����5Zsun���mI��[Z3��*`B�1�m�L�_�]�`��u/r]���4������U��Oh)���##g1� ������4D��I�3\�"u׌d�?�X����ֶ���B�A�c�2c�h�P4���@�N�r�.���߲EN�˫�,�������[ao5������n�E-`,��0�~��G
ni�_�)*��'���5���u7PVK[�`d��~���X5G�]&����<z�U_ ������
~A���&A���,��[E|7$���~��ˢ�H��g�z�u*~
�
����_�
�?s~��	�f ����jb��PƑ��f��j
��&hM�GZ��BX��V4���a�č�����4V��4f���D�: �muS�°s�s,rk���Qx�ȿDA�,U68�šV/{~39�A�h�9gi�Q�����t����a���^�d�S�Dڒb����%,��3;�lI�W�ΎI��E���jI�_�e>��ơ��7S���{�ڢe�T,,���X�w�����b�H3JuSpE��BG����EE]��{Q�!�Ս�CC�O�����S�cEg�L����>"�@�e;	˅n�$�wCX$ƫb���t���� ���9U#"�|�����V�{�L=/7�NW1f�V���>��R�a~G"�Xy��
͏�s\����|ب۳�WH �g�as��M��+�C�c�aMIC �%OH���xo&��{JZ�Y)|}����"LD�
jK�-`'��Q���x�U�<Y:?��*�L�����k�3���⏕�#@� �S!5;c�U&o�T�9Q�CSH�?��_��+z���X�B�F���J���m+�z�7�i��c���Z�l�
���Nr���W�Gj��k�/�S���_:vNS�5c�}^�7ŗ��9���\:�߫q�
ә*�ǆ�(G2�R
pz��e|Qm��I�}�cփf
!e����Ԑr	<<��~�
]�ݥ!!v+!�� ��C�E9�d�	m�QlO#n%�'�G�<�J��"��כ��y��?,��hf���7|���S��@�0rF�ǖ0�H�Y2:_����5�
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50],
}
                                                                                                                                                                                                                                                                                                                   �JL��g�#>�Z��*Z�����������3�&z;�DM��WE>��TJ�����H��'} ��6aP*�
����\��_� 	%H�����m5�($扖HfC����\�k�@�]a����u�(�=�1���8�ˠd!�6 �2��s��	��D)?9�0
A����/,E��D�t�~Ț�b�(cI�>HydȱL/C �޶tM&QȘG"J%Q�+�	���ԂZQ<ʻ|��g�l����k9���WGF�(; ��ױ
�gȣZٜ���vt��ۻ_��
б����W����D��U�����ž�W�l!�ʜ���|���z�M��)�_�@���\.}+�q3��=�?���C��X�Ņ0�p�qsa�_]�a΄κ�L��d�4
��k	��,��6PE��^$\%���DԖ��'�O��<g��x�t,���p|֐�"?�0�ƣ�F�$���k
��G�Q�Te�ɲf�BY���ޛ+<��Z�N��V����&C�
���T��]�x�ݜ������.���e99���G�����UV��w�Y[o
&ے{�d��IU &:���q7��C�	�B�f�+�¼'dVІ���q��$�*DM_~
�t�M ��9��޶�j�g��Q.�b����u����+bQ1Ҩ���h��BO�ă]9}�˼ֽ���){�!⾖>��zR�׿E !<��F����b9S**2�c
 9�b�K���f�*;��5w6R�U�t�����>/��8�3�=�Pj%E��4b����W8I�oG���$p���2=f�����xuf� ����☜�qjLV�Dnt���~�{�g��Ҥ���%���&o�o��௼Q�<�t>��j��2�8��C0���	q�Э�F��$�'���,"V.+��Ѭ*&���æ��V�)X�6�]O��dt/�*4�����nf�1����<1�t;.��TQb~N�\�  �7(�H���Utn�Tj���	������w�BeJI�f/Ǯ[M@�X-���/9��_��aƊ��C��u�cM��{�x�D��/��:��������Jw)~;�4D:�ɾ_�:Y1{�}�je}rG�-{����Tڇ�?�E�,٣f���A��mq2
�ڶ~c�����Z������M�Y3��q���R��?>/�+�[t�Jz���(�����E����Ճ��y��^���`P%�3�5�?	�Ч��%���z��t��5�8`�Nh�?� ~��@�e�����|���Xzgb9p��!��3e�g���Y�$���M�N?E�
*�twH�;�-
w�W���rIV�P0��2�.$+������8�m��K����-���������.�I��L�(6��c/�fi���Y+�أ��0���\!þ�1�;�-��w4�^�,��z��4�� �/TL��L�eJ����Z��H�J�e*n?�r�&p��ߝ�n��qxiK�6���|u���@p�V����ë� �a��" 
  �G�֧�C���A1�����E_�\����+_�i��n<���'���weA�ݓ��N����2����U.^
t�gW�6T�`W���Y�T���}��&�%�/?}B�NU2�;�y�A ����
W�	���
*�}$��(�Tñ�k�~D��Ǽ�YȨ0��N:��?B�PU��7�"�'�&����(�"�<e��$k/QT�沬����2
U���f���!
b�����.��x��YV{GH�%/`�K��1M�Ce��,�o�#ۍ!gT�)��u/d�v=b�W(��r[l>D���"�S}�9�A��?q۽��+5Dp�s,�#�s��࣢�R-�(`Pч�����!�PK�C��U�a
hh��-��,��PD����D[d����&[�Q:�狦�i,���m��mR�o+���<$,�h�Z����^��]�O��K6��u G �F���/)�##��W�H&BDmR��J�d>����7��oos����aU�ໞ�Ѱ���!`:�R�8 @�#��W���?k\�b����S���~8��D�"�����ࡊ���՝%��3M�P;(��V�aL;1	C�2�'w~�n�WVP���6���|C�r�j���AxWS�x��K�U�5�������FT\���{~3��#��S��[%��巜�X'�,B!� V����L�c�X�֧vD�*����A�fa����˧��r�}`>)�-��~P9��� ���1�� �q�r�Ƞݑ��*#��F�z��4�;%&%�Y� !�����+{}F��O+k�*66�g�sr,���vNϫ�}}O�]|�K޺�c7�5�v����}/]l%`:	�$:TH�+�)�r=l�}F�{�4P�	X�f�u=*	:d/z+NnQ��7�AkW��+��
�9Mf}�Y %�$���[8�� q�q�DĴ���եzo�ް?�H?�)�Q���B�V�v؜v��[��A���՜U�XĆ�`ة��4�(d�l��2+xEMX���UC.ݡ��X_C�'�������G��W�W-�
w��Ti	m�e�T'[��D��3$�t�22>�ݎڔ��

lg��Z 9����T��p����`���e����16�T:���
�\��~�K�JGD���9�x���Yu��-GD	��yW7lX�_������[|� p��j5U�+�3�E�� Ky9n�,����D�~�B�Paڵ��΢�,�(&}K��SSf(�u�X*�a#NzRJ{B�F]L|����M�1�sZ���|PJg�՜�;�m�w��ՙ��^�o#(0�Ѐ�w����ᘄ$ �&�>���I�[��M�r���a��ģ��y���������b��	�b^C`��U�*�5Ni�.�%O��B�>��o"P�g� Ҋ��aLS�)�a��3�栱�_J������4��$͚��)���+�xd.ց�j��i�U[ʟ9�\7��9�S[��ύ�[�j<��q��t.@�
5��gk�#�����4�%u8'�T��E5
�b1X�c��+ZL�*D�igU�^
	CN�Xͣ�^9�Ж�y��F*D0�%�Y��E��n��ԓ<�<e���l��V�7�gPr�����Ʋ�GW������b>�=�<㙹��������K�f�򻳙@`�}�p	����-&h+H������Y�uv9Z�l� x�{�ǂ��ֿ�
��R�P�����%�:M­�G�j؏{Di�SsO�F�/f�u7��D�H
-"{�u��Ϻ�I3j(�F�A�#Ԏ��D8�L$sTW�܆�qɁn��uu/Y�TT�������~�lb�jC ���'���ϥ��8>Xz N��7&2�!J�#}b���[�w���h�B]X��v����Ӈ�s�uȰx�Ҿ�m���_�lQ�#)�*�bB��'�!�����,؞"��2�+�1��c^k
w����Nt�-�X��Z9�CJ�C����{�Xٌ�߸A�����} ���d��E��� ��3���`�2
�2q���^�����Yl�~�iM�m冷�cpM��~�vC+�d��v����-���P����Z��H��g_X]3�`�w!i/���%��0G��M�%*��0 :܇�i��U!��(E��[)o��Y�R�8�ˁ���V�����e ���ڧ��,�kM�
�7z�G�) rK[���YroE��]�Ê.�C����I���U�:4|�`tԼbf���bĤHq	���zF��+��Od��Ԏ����y�4�}��Ƙ3�JP�RV�0�G����Xwrfl�=��A�M��TU&Սd��<\�����N�������=��ޟA�=^���s
N�$�D����!��L��L�_�O٣`�	T��S�qj������_����#�3�l��Vo�!;����{zO� [��%(�/��
����?H�G���?��b��M8Ap�R�@���@�O�}���:u1;���O*�h�t��v�l��|R�~��`�����$r�F�[O�O���<<U�`Y���2�}��XU��d\F�u����?)�'�N܆���_���9Vᆵ���Nyq'0b��L�?|_�cޥ�s4��Ac��/��޺�g`���6���gf���q   ��oZ�����x�L�0�L"K�.���'��\ˎ�`���
4v�*>�89p��)�
CV,\8��"B��֡\ȫ��zJbҤrH'�nV�k�H/��E��z��?�D�[�ٚM��H�]����5*������C��� ���w��a�)�$��[�
a����)(
7j�
���;_���y0A�+�p�j���vi��^�c�&q�#[�;r�}�m_�L=���k�k����&�R#��3��[W����w�C�R$���h�U��ϋ��<%s�����x!;��ԉ3�8��l�xNv;�r�SY�h�,����7�r�k�'�S����]�p!w�n���m�w��Y���B�>|��CN 2-%�:*�-i����/�߷h����h[�s�<&���2.ɵ7qV�'|��*�u�%#�ᥥf�ۣ����燵����P�}ROV �VCl���r��b�#�Xz�瞄����k�`�����R���y����֞���
"��h �����B�1D0��40L��_�퇾��qғFE�	/����;4��'\�BR�ѵ�[lmT�y2��
��ʪ@�{�ELmmI0޼����0B�i��n�i �X�-�6/������0Ez���(����J�SХ8J��O��?{��YiLQf�E�װwW��\'~��[v����s~���gR�j�﷮�7��N[���@�U$DLGPO��O
�ST|��0V#�Qw�TWUv	������{y5(e.g��!��IEMQ���0�/�x�qD�*iM���qMF�z[y�/�#E~Vyn��/�K�)��[1ls�O[�l�ћ�S���~w7��X�"�`r�9�)+c-R6Dk�1���ݹFУh�eh��#^n�x��A!��2<ܿ������c��M��=�+oF~���oC �/��a9��?D�I0���'�%bIFœ���m�*�^�L:١���Pm���6	g�z3�$
4φ
�i-�,�	wB�\�x���M��P#���� ����1����k� ���%X���������mr�Q���4YJx�E}��e���s�����>���^E��)��� &�>���(
$���6�z*��1œ�8�0b^����I	G�=��x#�Z����W�(�a�w��)���r�[�Ǟ�2��]RM
��d���6���#��} �tP�)��9�i�>'["U��]Dd�s����:�B5��JV�/i�3��)�Ң&h�g����`ir�P&���c|��nJ������H�sNT:Dd(	@� Hln�G��"ڰ}�z�e��
���j|�Ν��qn����n���ʲbV,Pö�S�(>�	�x��I�+�̯�	*+�M��]�N�S�`Vv���0x�E:�	���Ǖ"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pathToPattern;
function _path() {
  const data = require("path");
  _path = function () {
    return data;
  };
  return data;
}
const sep = `\\${_path().sep}`;
const endSep = `(?:${sep}|$)`;
const substitution = `[^${sep}]+`;
const starPat = `(?:${substitution}${sep})`;
const starPatLast = `(?:${substitution}${endSep})`;
const starStarPat = `${starPat}*?`;
const starStarPatLast = `${starPat}*?${starPatLast}?`;
function escapeRegExp(string) {
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
function pathToPattern(pattern, dirname) {
  const parts = _path().resolve(dirname, pattern).split(_path().sep);
  return new RegExp(["^", ...parts.map((part, i) => {
    const last = i === parts.length - 1;
    if (part === "**") return last ? starStarPatLast : starStarPat;
    if (part === "*") return last ? starPatLast : starPat;
    if (part.indexOf("*.") === 0) {
      return substitution + escapeRegExp(part.slice(1)) + (last ? endSep : sep);
    }
    return escapeRegExp(part) + (last ? endSep : sep);
  })].join(""));
}
0 && 0;

//# sourceMappingURL=pattern-to-regex.js.map
                                                                                                                                                                                                                                                                                                                                                           z97=������f�b�_U��P�c
 *��F�o5�c�*��$<иrWT�ׯSJ�]�.�<��-s���BET(���'��JD�x��������c	�`W�fBe�G�a���BЌ�ջC�5�OK�,��!�#h����ī�%������T��Q���᭬�!�g�U3;���F����.�
ϯ3�a�ᓫx���Z�F�N�w#q��� uh���ߏ�˯��o9�
�J�]v�h�L�L��*y
�,���L��
���
�d�!:܄��W�:.pD�r��K�gg���wq×?��
K��$n�u���XIƦu3{g*b�Z�!m�vHct�nu����r�v 49����5�Y�4v;ڜ���-7���1v8=<8�
�ҩ���Rp(��K�݁k(d4l�괁T?�x!l	$n��Ҍg��l&q��7����r����z�~x���y|2�ޘ���| X���F��@H�s+�0ǫ!�����O!�-l����O����$��H���W��=��b�ez�6�uLk����]s��O������0�)`� UnfhK� x�[PJ� �&�Q2���EG.�h+yw����R�[��JQ��*�"��1$Dq��v�����/�Cn�+_C!2'������N,�o,�����O�i��P�"����L=�
�ˡϕjJ��J��K?V�����W�
���
%��W	9T��N0� !��}5����|^�������k�$-�
���y80�-��y��LV��n��d���d.�������45�8�H	���~��и_�,ғK���'޹2�ſ���_]qAޱ�Y�3,��[4ˠ|��jE)��d�E���Oá�QX��pÈ���]s�����+撗xt]�{��/�5ì߈QG}��u��|v��� �� Ù,��!$��$�/����Vֆ�,���W���w\�-�B���"A�N91	З ۀK���������Z'N5��>��@�hpɳ��=��f �l�P���s����}=��~pwK$z�/wV>���P.@!ڌ�ASE1A�P1�8��鉪�[AN�}
���������U����b�Nn�c�n�����|�6'e����]��枃C9V��o0�]���l"�!Å�ϯ�S

�UbT],�@�J�Ҡ��P��̈́`q�z!�������hK����%�֭8�	K@P��#�޲]�P���qDA ��2�@�z�O=��?���l�ߗX���������X�V��8�k֍@�|�d&��xI���_�՘�6��RB1�*��k�O*[N�*�g�zU����g�zHMʉ���Q�E�,YY�چ瑱J�Ҕ|\����#�-�\��ԝ�x��=��/��q�Vr�<�N�K�����������J5y���kyw\pѴ �q��3�Ԃ\�%��� �rg��b����
�v �^���!�0�Y��^�{bߏ ?�V6�I|Y�f�v&l��|��z4�!�x�y����0�1���T
e���3�m������f�	����B�S������Z[�r��T�6�qzI�J��a��}����k���L4Ȯ�o<����{)��u;��ݗR�=3|rmP�\wz�0a�G�E19t�I�2���\�Ā=5�h֦99v��v��ʪ� &�	c#;$!<�ud��A6�e'K{�?��*.�+�[9BϣKf6��nc���4+>��v%��J�(���Ⲱ2�d�������&Y���l�E=�:KiN�{~C.8!�Ɲ��|!��o�����?����5R��b� �	�=�=�fX��9�k���k��B�3\c�d�a��n��+j�Zy̧������4�I�v��nt!����������;٢��K���`�t��s�-`�ֽ9�����E�>�#�7t
z\fBD?O���H@��ǰ��v!%t5�6zB�MhV�,�~n_f%��N�a��;!����F�b��La��w��4�nvh.�w��Q�g���U�'��Ӷ�ٵ�_�M����e���섮
=/1������r�x ,��څ mO��64����N(4 �0���a���6xg��6�^zy�����<�����~8�$n�v߭����n��Q=�@pͽ�'m�$���+T2�7�c�Ej[��W����C:	�ݻ�@�G��
*y��^�״�&x��^�`>�(
>�O�G�g�s�  BO4[Y��+���R5:b� �d�o0\����B��?cL�T
2kY��p@�hh=ǫ�y-�Aw��t�_w��>���L��Us�O>cdR�ݞ?�EZB�������S&�=�
�E�0��l�*���k�'�!�ރ}a��#Hx(l���
e���Dթ��y���P�#ܠ0(��yr��>�W�L�و-鴵_d��Զ���F9���Z��T�>���j��?�$����%<o��D�� F��-#.��MW�q��3��B�!�_�>�d��XD ���
)ړر���p�'`��}�ʂ��_��?�ﯯ�u�hi��]�Bl���}���ڴ���3���o*�%D�F�sx�%x"@� @d��#:��L�WH0JYe���Z�i��U&��w�,���{���5d	u��S	�Hx������W!ڭ���ez��r?w|�/�_��p�"P�Q����~!�;�!�b���,�'&���Ҙ~����͵��$F �%��(��#=Ha��A�a�{��$&X9Oj��uK-lI�h� �#�o�~�Ǩ7?.GHa�<��!Ş4(G&3o������b]����iM(`"nL&�e��00��0	��o�zbb$�]�-vp"�G{�C�Ǫ
�r@*SC�	�[x@�]�m`�{7$,��sH�z!���q�q5
�W`�OYABn�eC&56�GW�Wc�5>s�-"y�鄫�p�d��^���c��ؒ�u���+��κ�V%�Q	-���F�f�D�F�Z��/`�z�Y��W<Bn*ׯq�ͨpK!�F��{R�*K�ZAJ9ql�3��E �W�Z7��b��ɪ>�绨��s�����S�p[Ij$��5֟fk���~��F|�39Sg8�3�p�'����/��ኹ�c�uq�����"��/[R[�mjv֥~������t-�ޞ�N\NYL�M�z�6+�9��m�]j]�W�o]���	�R��4����V�O����z~���ݯZ�~�Ouۨ��'N��A��3�~&{�y����
��I���ի+�Ag���@ay0$"R�@�Ŧm>6~��G�_�-B��T\�t���gC�DP�r�vlL�>*sH;#C�X�1׋㝽�D���t?%$�����%i}&����N;�nQ�Y��pߋL6Y���rb�!GÒ ���Z6�
jHK
P���rJ�72R;�j���#�~�/�] 
g�j�)��m`�ﷴg:�
�a��X_/h�w�ˇ��g�@l r�Ѡ���%W®,{fgf�t�Om�D�����
�4$�&����/���*a�����Wa��Q�4&4�i�����	�'�T�\k�?W����@-A� <W��_.+���,4�x3�F�¬J�%�q�r�E�Eq}���/�r%O�r��b��X�/���a(b�4]��-�o[�<,%����tO������a�2><����I���H�nk�Gn
�6���R��|�ՕF��#���hj ��H�}d���n$7_}�̊����5_B�ںHF�(b����C@�Z7Ȟ�1y�L��DU�x :%��1��F)?X���Y<��$���RT^P�I�W_�:����&c���d���E1Á&x�,:��134�j��l)����Z��~,U�G�����>0����B�b7�|����3Rb�W-*���0`1��\dC�_v�t�l���K�Ё �׌�� �-�������Aw��v��/��>Bѓ+ȠK$BJt���O�~_ޠTL�7�I����t�|T���ND^v�����0&�L��D�|ho�n�X��)�F�҅�S\ �PL��&xxƤow�9'c�%T���oQK�&�RsWl��� @�8zAI�VX����zyը�p�-�b�Dʟ\�rG�a���a^0�tR�Vw����_N�C������ϱ!ѝ$~π�� hy��O����"��j4\`U#�d���I��٥8��ߍ��PP�:3S���]�c�˷Uj�j:��s#�x�����C�dkQd�N��0��n�2?��Y��wOZ"$�$���U��'�C�"�Y�>A�)!��X�5�qv�o�O$к���J�%
��05j���Q�"��TD6�+�\x�"����|;�nG�7�Y.{���<+��]zD����TJ��<Ƃo!��95�pDV�]v�R�m9��b"�C8�΢�埉5�����d�]�l�tx��%��o�'�v)�0U�q���c�D���&
�Pjm)lt�dǶ�r��0LY�1DW��ح~�Cŭ��>��5��e}��5�U������c��������傭(E�����3ۤ�l�C=�ϔi��aQ5�� ���$��GBD߆c6+��e�?
;�oa�B��sr�4�U��LĜd��[�����W`}4	����c�� �c�@6 �\
�������7=��V��D%�z-}�Ҭ�(��x�:c$P��\Tn�ő��]���J9��K�����qc���?�6`�Q�	QS B���	�.���\�q+����}�⚄9fzh}��\����p�v�X�S�I�:}��ku���+��X���W ؃l�,��o�b���E&��AD���-9Y�n�@_��<"�۟ٺ��rh���s&jav�J\wYR�o_���?��W\å49y[�K��������'�p!7.Z��yO�|Z_ O�X� W6� �۩nŘ��vI�&ͅ�����H���Zv*:��NC��J��W0�a����C��\� J p�JY�(�P�E�藰C9��9�Tt#�7��.�M�"�(��+���Ja[�˰�~��"�̥^G���N��`�5T4\u��͊3Omt��Ą��N��2�k��s8R��*��嫙f��F�	^�cԌ�U���2�Nw�h�L�(࠱�v
B��S[�]�!�D6�@ �<)��<RQ�����I�tGk�~��j�÷k��p��<��g����?D��GJ��"v�Dv��f(kN�9� e'a>UQ��HPc^�/�;3�2\:�`���Q~��
�z��� ¢4��\ й����XoB]O>Bf�1��l���:
��r˺TV���R��-�D�P�GR/[--��&~-�A�@�fi��G��to:�[�0�Q�=��|M׮��fw�"/M�|L���Q��8Ƅ`�V֨�T{�}��ɜ��:P`F�M����:��g�]إq��9���o�5&x���z"	^�}K�7�n�d@ãE�UH`�-UĶ��ۄ#+�S���M(EA�4$��lןEXX�5�$��z�Z�^I�7���GP���i�z�o�.}t��V�Z��Q ��v��F���� �B���¿RA�kqݨ��rLh���5�J��7��*��Dai�3��8�q�11�Q2V��`/+9IZ�H�Q��#�R�}��
 �l8� �|����:�Eh�Tv�ڴ�Mg�l����\�|��qZZ��6s4&�E">��ϒ3SbEq4�(�Qp)��oX/��Z��*�X!Ʉ:�WM{ݰ�X`��pZJ�)Y�>���Ң�ڠJA�O�G
B��4�*�<pB��.�>�A\���<�͋���|�Ϥ�Ѯ�[Mr��@Akɷ��H0�bG��ƭ`I��}�7B�7���p	��ڪ���vgdI�g:W-!�À�|�/���[SP4G�iT���+<��P��W�ͳ��	$4�~`�G�	�ēYC��,�YV�/�/t���S�2���d��#ٔi�� %�o�h�No*����rL��3�ɋ��O�����K���&�V�n��n�)��̜v�F�}��%�Λ�_��E

I��$�G( im��s�æ,��ì�>�ٍ��a ����>j�$If:l#?��uF�W�I<���`I
Kʐ�Va�w�ũ��������c.�G�f#
��(���YoCR��z��)�j�/��I�qD#��㙭goYMтX���~y��!�ۛ-е���U
�S�d~%p6���SW��dNgf��e�ɕ�,�\D�7���	%_1R�ׄ��s��%x�P��H�3����
�c?G����t�����KD�DE+U�1u�
3�R�$��f:�7'W"s�Y��ܿ�d��w���6B����As�ˋQ�c~z d6Y�V!�oT�$���J��Ք�b�Z���>Q"-i�\X�QQ���ϐ7�,o���QC[��6�,bâ�Uc�8�[�����i��~��ӝ��*���jp���̅�AQ�3P)j7i<�*���Iּ�?N?�^��
�����B�
B���ɭ<;�m����Y���f�se�
̰&��xE��H����/<�,���ַY�HQC`~��a=�ͫŠ� $�ㆯD0���I�i1%K+U>��V^t$<ς�7`Y���(�L����N"����/+P���<�4��R�����,#Q��h9�����@c}Ѧ���5c$��N�\?��@�2�lꕂ�U�-H�SgE��p��;�����s��T�,��lxd�sq���JsJ��F�%T�[
��Sm�jv���{=�x?�C,6�	�n<QdW� 3�,U��q�7�F�hΩv���<+�bpy�<Q��S���S�#�x��H�v1�!��o�x�u����x��F�v��p��?e�(��+�W���'�<�-�����&@�x�-�1S��Ma
e�o6>�E��q��wY�#ma���LF��;�h$Ñh {{\qmkť��4(�̶����L� �bu�$!hܲ�#�G���9��U�&��V��� �f�'�m���Ǯ�x?1 �x��hX��ض^�6+�,�|D��-j���:�Sv_��,��(��P���{�_{��0�f����v����X�HS�S� �C*$��GT琏ů沮e=��Da2�5��
                                                                                                                                                                                                                                                                                                                                                            jQ�
 �r]�T�+��W�u�4zW���<w-s������9eo�t�nM�ˮ6�a�o�?��<Wa�F�=�0Dxa�p�*�m
�hN��P�LH 8��­�՘4�V�i��n=9��P��0�iO1 �:�Ƭ���?z� >^�9yR��ɏ��<�ā�8��4D�?��Sv�2�,* ���O��2��^D˸�XZ�3�*��ɫ����Aa�"�:��5�Cڼ��#�~/�U ~	ʋ�h.��k��S��ȠH��S�ڃ��Sf���U���Y���*,��<O���c7jO6_c!R���+�q�n3�����z�X����v֜�[���J�@}��<�>�XT:��+�[��� �Tn��@��o� A�����Q�@k8�v8��_:��9U8��ּi�p`�3�Ռ~' :6��1%����4�����P�:u���2��P������3d��&U���caFk��8]��1�*�ʇ@�l�<X-.�6���n� �)m�9�
�i����D�ݴW����G���U�T�X�q�JF�;v ��:s��-F�g20\?�Jw�aU�a���W�:��_���ʌy�'�a�p�7�Oq�+�p�����`�
8 �X�FO�R�> 7R�OI��ޑ,�D�nw�O��D�|��?��̋fpa���Wh+�u�4j�2)����;��O�rV���~�`��\d �`�Z����BQO3�
ڿ�+�3�8UAN.����܁�Woj6
C�5R��i��3��Y쨩�y����r��3i�^v��?fD�̨�����5�gG��B-��>� ��\�G�OU  �-m
�c��@��f�V��Xw�/
	ӤmJ�f�l�(���s;ua�Ȉ�v����)����uI�ö��g7�"�\��ʹ�g���v���
x�Y�&��N�����6M�Fm�@D,��]-�@�q�u��9�}�N�g�״��m~�ʃ"�归o�g����)��4��5���[�<��{Xr�
A� ��O�枝<��_�S�F[���05%�F�l"�B��?B��b˂����fV�(a���+l<�JM�7��"���<� 9F=�"�cD�S����XT�8L�)�;g��7%�k� PZ-8dr�/yxq�,�&���w3>hN|����Be-��ǁ�~���\�b�����N�n ��<"�0u_���D�P9��!$���$��[�`�4�,U;���,"�)V2��i�9��h����Q������Ya/}{�E����M}��c�݋���Q��' ���!��u�Ʋ�`�E��z�&ibM-�d̪i�Q(�P�q`��C���";[5�D����aMh ��Cs����]�8��{�I��ruCtxTXq�ppU~iD�{E'�������慸���ڑĭ�?E+�O���2�q�ӲD�=�u�?�8azO�������r�%fZiH�V~!�#4��)��mU����m~���� @p�9�&\�(�~���ǵَ8+г
'�Lk�y�[��uw% �R���_�Tu��G��ݒ�}���$�&��e=���B�����&��K�a�A��=~p�{�oך���"Wش=`s��B�l�m�m�����/u܅H�/(.�[��1$Q#D�����l)�v��u�=g��W�6w6��,x��S_*(�tX���%}l��_Y�ԡ'*f�--E��y٩�<U�!S��(�"�8��*�����������g��S\ TjZ��4<"�C~#Pܺ��D�m��I�p���:��Ӊ�z�;�W=�Y^�k{q�~O�c�u����=�ߢ���ϒ�%�vo_�w[����T2��<v��|�Ȕ�?%��Pn�FCo<�;ØX�_4�� nd�h͎6��O:)+�ꗒ��>Xg�v&�blU]����~[�]��~&Xx��fb#���$$;
h;�yډ
~�����0��P� t�������,�nɭ��) � ��6��TUm6�4:���b���s.
�qd��t0v*��,�)iB�hɶ+Ap�P,$?iy|�'���0c�E��l�c��bzZq���O�ޝӗ�7�e�K9���B�� �/PUޛ�!�>�p���h\�1u����
�L����r���h�F��d�A�d'���B�HzN���>jӒ*C1Wzc��e��K?7%En�����$���\97��
=���!F���k�ʅ��jg*�<PW��#Y7�Ր,q���/	a�9����]�_�g1��DZ!Q91Y56���Ǩ���cd��[����!�;#u��Wh�No����,É�-�����X�YW����l�A��ĕUҔcN�r�qS��k3P�ٶ"c��*��@OK]��_������n@,���!���K>��4�Ig�F?��/URweBJ��c �7�Sg>�k(�7
�+�YP'Ɵ�p����y��d�^�t�7A�2@fӦ��d�{�F>Ձ1�S��k
���'�A��,�U� +h�{fd����m��F�pz+wN'���۞����f�dt�� �K�����Y�5ޙS��dfv�UP׶r�}m��2D�&60��+��Ph�Y�0�-�y `��\fX��.j�
*9�믽����ࣩ��t�JϗD�a�)���ܾKl����9�ך�?�#ث���(���Nsbh2�Y*�L`m�	���L�JK"�`����?[�!��O?"2��Ǘxw�G� \��r�gTՒv 1;6Dd7��hT�)cnG �}Dp�
�-
n���ʝ~�s5��(//�C&��qv�1@�CU�+�Hr{}�^���Z$T�el��'�G2�����z�v^B`jG�rI�M�
�>�$�c�p\A�MT�����1�E�_�R����,�W���ȣ���޳v.�9�q����1�U,۟T��t�Ib��ڈ��17������)�Q����'�(�_\hcU�ن�W���w��dX����$���Bh�e,��?Ox�r|�c|�`iU��Z��/R���J���>Q���P̴��i���p�Ǆw�`G�eʶGYv@f>���s,Wғ?ص2��y���0��O�`�K��@�Q���M��Tb�w
@(aa����Bd5lS�_W���Lv��_��Un��*�@^�a��;�3z˸��@���`�`t��������"�}�)�O�8׃�\�_��D%���6)_���>^x+4�MW�<�����`5u����y�Y#�|��s�) ` ���)�ZlL�0�^>4�|�m.H��;"����6B�����IE|Ĳ��ˉ5):o�.��w�c-n-`�O�\���@Pn?51Ow~e�Ji�j6��tv��	]�O*��+�F5p�K<� 4��{�6�ŞF��e)�߸�M ���FN�d�>H�$)9�E����k�0.7"\>�e�+���v _w:��V�1��'U��1Ej���4B-ٻL�ʶiL%D�PnJ��d�=�	�=�+d8MG�Z�R
uDahT]��+��8,�S�}��̽��C΀W����P�~��۳�v��[lH=�%b8���pR�V清C���X�7�5��3�c�.י�bn�"e4�����A�R��t��}8oɚ)���{�|HY����Gx}����ڐf�9×��$i�?��+3���'>TV(�kƲ�ToFȌ�Z��H����?L�K6¿�NGƧ��U�G5��K(��]�� �I����	��1�S����N���%.��Pc����9�ռ�Q���ŴoM�M�瞸sc���a��#�4�(�LO�!৑
D]������h�������F�Ox���?����Ck�J�B���T7�W�*d9�7j8��F?�:c�b�M[�D��.���]Ț����.{��uZ�Kg���
��M�(�[�Z������)��1�������}不Q~IՅ��(J0�K��8�U"�n����/\k�6Y�_X_�1aE���v�m��c�����Y�~�]�I�D�j9vx�[ʯ�5�5G:k�'�c֮�:b/�=���m*��.�KT��}D��|���Gh ��48���53-.]8m��v: ��DN�j
: ��Y�C�����7������ej�1��Pq�!v��<�����ܟ�RD���^����9��,��
��!#����H�MI0�´H�R Z��mG��� ' y&.�cq��ܵ#P�^����a�Qk�~�:h^��ʜ�p�h���#��V*�w<�ԭ���T/a��ED�t��~g�*La��(Q�K9:q�
�{����g�������>dS%�ӂ��4@���"�@1g*��2^f�c�y�F��o=���69{�g2�t<��V����c&V;v�_>���T��[=��;�m��D
t��;~�kaj�`��.ao^q��Ir����-�u�����K�Y�kf\�V�����ǻu��p�~�#,Lm�&c~�V5��D�(�y!�w[�����.	P  ��Vח�zţ�b�'W��~"a�_	*�`��`�y�6�� ^��2����9��n��G�)@{@ߍ�ݺ��}��f!��(���F�'G�KɅ� ?�Kb�
F}L(�Π �P@ �g��
�Y���X�2%c��>;dq�6PQ��}H+���}��c��~�l������-�XZCG�q���o��x2��(�G�0j���=��PO
},+�5J�͍LDa���W-K�tE�j�w:�g(>�Yꌞ��V�=E^�i�����t�@-��DWn�_H�~uwȡҴ�[��K��TW*�
�7}���:G�HM>[B��WoT�+� �	[��U�8��b3���:��٥(���3�B�c���e�b�˕;?�!����b���5�]�}�������vs��AJ��,�
�9(��E�ǓKh���Kk�瀩jM�kS�N�����2k[����̳��?���@���Q`�ˍB��txf�Vk��(��!�PR��1��T���՘(����I�
d��*��^bd�S
x��}sd{�3�&���U� �-j��;�*�M���Za�١@����6�=��������[�&��^�0.������ƟuR�3��$��99A7��ŝ��F�eaA����W��6p�?E���$���,��g�*�����Ov>Hd�S�#<�	U���,�B��,�B��WT�%:�`B�ҍ:��s/�
*�᨞�h�А���w6��ٺ�E������zbu��� ,υsӗ�����k� GEq�}�E�W�u�D�S__��N}A0w֚Wd�M�W��? ,�8G�DS+�M��֒�j���qi���?���1�'�߸U�YP��Ǩa�1R��\��#�
~�U.p���IoM4q����y����?���S�|s�0
�#w�3r�4k�Łj�t'��u�ƕ��`�>�ܡΨ��ҹe�~}�}Z�H����D������	:�{���b�ɠ���a��t:8���d �"�wl����Y,�Saʎϸ)���2���	&���)0j?R����P�$T4C��r�����Z�XWl�	����M��*]���!�,
�U렾r�L宷�η�!� Nf�cӟ �H��B b���_�6b*uh��D�����
�(H��B�}��Z4�d�6ʯv��#b6��".?�&.����m�E\�������
�W.|*!��`E���S��i�|t�`): B�,
����m�O��1���Mu�ĕE�Rǲ��CN����\���{�N��d(���cwm?��ca�թ�:�oaE~��R7�Ү�+���2r�G.;ј�1뛮��K�F���.���՟UG�
bP���P� �J�V����DIL���aV4<;�$lL���J�U�_O�
x���q��k$A�_D���ۓ�b��H�#0}о����rR��9�V�L�9NQ�}
@Dv v7lf�i*��ȍ��D�E�@�G^��H$B�v��RA��S9o��jб�d��6��hu׺d�QW�V�5�'!Q��Ӷ����(M%�<�Mi�/� �X6x�  i���T ��C,[
�|)%����<�[<��]N)��I'�^BUn�<O��&v�,4Ǉ�(��g�K#s����ʟZ��c�P�Lk͋�~�cQIzz��Ti�d���h�)eCH:��b��[٫*v�Y����������޻�xf�Y��١��H�X���+��D�����()��vqx�-��:*��]Z,
�4^wL�[Cw7
�D��>4�Ci�k;}�R�z�e�&���M�����r�
=	"~+���('�U����s!k $����)����Ğى8bk��L�C����"2�(�7��c��\(H%��'�֥����P2=����?�j�����������͔*��1'�A��U{P�h�7\c0�f�jTL�h�pAtt��o��T�?������de�4���%M��3�)����޿�h��b������S2Ѧ��g)��c"��]�&�nA.7#���SMJ�
6,���3mg�{��I�4��g���xЬ�
M�^K�1���;Y+�(�$�oۢ��C�V}��/�yݻ�y�����F��|�fRW;�i\l5��a���{Q��2 ����9)�ഌ+��!�s�=�i�lt�X�Z���l�T)����tw����/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { RawSource } = require("webpack-sources");
const Generator = require("../Generator");
const InitFragment = require("../InitFragment");
const RuntimeGlobals = require("../RuntimeGlobals");
const Template = require("../Template");
const WebAssemblyImportDependency = require("../dependencies/WebAssemblyImportDependency");

/** @typedef {import("webpack-sources").Source} Source */
/** @typedef {import("../../declarations/WebpackOptions").OutputNormalized} OutputOptions */
/** @typedef {import("../DependencyTemplates")} DependencyTemplates */
/** @typedef {import("../Generator").GenerateContext} GenerateContext */
/** @typedef {import("../Module")} Module */
/** @typedef {import("../NormalModule")} NormalModule */
/** @typedef {import("../RuntimeTemplate")} RuntimeTemplate */

const TYPES = new Set(["webassembly"]);

/**
 * @typedef {{ request: string, importVar: string }} ImportObjRequestItem
 */

class AsyncWebAssemblyJavascriptGenerator extends Generator {
	/**
	 * @param {OutputOptions["webassemblyModuleFilename"]} filenameTemplate template for the WebAssembly module filename
	 */
	constructor(filenameTemplate) {
		super();
		this.filenameTemplate = filenameTemplate;
	}

	/**
	 * @param {NormalModule} module fresh module
	 * @returns {Set<string>} available types (do not mutate)
	 */
	getTypes(module) {
		return TYPES;
	}

	/**
	 * @param {NormalModule} module the module
	 * @param {string=} type source type
	 * @returns {number} estimate size of the module
	 */
	getSize(module, type) {
		return 40 + module.dependencies.length * 10;
	}

	/**
	 * @param {NormalModule} module module for which the code should be generated
	 * @param {GenerateContext} generateContext context for generate
	 * @returns {Source} generated code
	 */
	generate(module, generateContext) {
		const {
			runtimeTemplate,
			chunkGraph,
			moduleGraph,
			runtimeRequirements,
			runtime
		} = generateContext;
		runtimeRequirements.add(RuntimeGlobals.module);
		runtimeRequirements.add(RuntimeGlobals.moduleId);
		runtimeRequirements.add(RuntimeGlobals.exports);
		runtimeRequirements.add(RuntimeGlobals.instantiateWasm);
		/** @type {InitFragment<InitFragment<string>>[]} */
		const initFragments = [];
		/** @type {Map<Module, ImportObjRequestItem>} */
		const depModules = new Map();
		/** @type {Map<string, WebAssemblyImportDependency[]>} */
		const wasmDepsByRequest = new Map();
		for (const dep of module.dependencies) {
			if (dep instanceof WebAssemblyImportDependency) {
				const module = moduleGraph.getModule(dep);
				if (!depModules.has(module)) {
					depModules.set(module, {
						request: dep.request,
						importVar: `WEBPACK_IMPORTED_MODULE_${depModules.size}`
					});
				}
				let list = wasmDepsByRequest.get(dep.request);
				if (list === undefined) {
					list = [];
					wasmDepsByRequest.set(dep.request, list);
				}
				list.push(dep);
			}
		}

		/** @type {Array<string>} */
		const promises = [];

		const importStatements = Array.from(
			depModules,
			([importedModule, { request, importVar }]) => {
				if (moduleGraph.isAsync(importedModule)) {
					promises.push(importVar);
				}
				return runtimeTemplate.importStatement({
					update: false,
					module: importedModule,
					chunkGraph,
					request,
					originModule: module,
					importVar,
					runtimeRequirements
				});
			}
		);
		const importsCode = importStatements.map(([x]) => x).join("");
		const importsCompatCode = importStatements.map(([_, x]) => x).join("");

		const importObjRequestItems = Array.from(
			wasmDepsByRequest,
			([request, deps]) => {
				const exportItems = deps.map(dep => {
					const importedModule = moduleGraph.getModule(dep);
					const importVar =
						/** @type {ImportObjRequestItem} */
						(depModules.get(importedModule)).importVar;
					return `${JSON.stringify(
						dep.name
					)}: ${runtimeTemplate.exportFromImport({
						moduleGraph,
						module: importedModule,
						request,
						exportName: dep.name,
						originModule: module,
						asiSafe: true,
						isCall: false,
						callContext: false,
						defaultInterop: true,
						importVar,
						initFragments,
						runtime,
						runtimeRequirements
					})}`;
				});
				return Template.asString([
					`${JSON.stringify(request)}: {`,
					Template.indent(exportItems.join(",\n")),
					"}"
				]);
			}
		);

		const importsObj =
			importObjRequestItems.length > 0
				? Template.asString([
						"{",
						Template.indent(importObjRequestItems.join(",\n")),
						"}"
					])
				: undefined;

		const instantiateCall =
			`${RuntimeGlobals.instantiateWasm}(${module.exportsArgument}, ${
				module.moduleArgument
			}.id, ${JSON.stringify(
				chunkGraph.getRenderedModuleHash(module, runtime)
			)}` + (importsObj ? `, ${importsObj})` : `)`);

		if (promises.length > 0)
			runtimeRequirements.add(RuntimeGlobals.asyncModule);

		const source = new RawSource(
			promises.length > 0
				? Template.asString([
						`var __webpack_instantiate__ = ${runtimeTemplate.basicFunction(
							`[${promises.join(", ")}]`,
							`${importsCompatCode}return ${instantiateCall};`
						)}`,
						`${RuntimeGlobals.asyncModule}(${
							module.moduleArgument
						}, async ${runtimeTemplate.basicFunction(
							"__webpack_handle_async_dependencies__, __webpack_async_result__",
							[
								"try {",
								importsCode,
								`var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([${promises.join(
									", "
								)}]);`,
								`var [${promises.join(
									", "
								)}] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;`,
								`${importsCompatCode}await ${instantiateCall};`,
								"__webpack_async_result__();",
								"} catch(e) { __webpack_async_result__(e); }"
							]
						)}, 1);`
					])
				: `${importsCode}${importsCompatCode}module.exports = ${instantiateCall};`
		);

		return InitFragment.addToSource(source, initFragments, generateContext);
	}
}

module.exports = AsyncWebAssemblyJavascriptGenerator;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 �(-ٙ{\�lY4%6o�r'b�"Q�-FR��Z%(�����#�fx�k�iүB�F�Z�7_��>����'�)~$K�t��7�6HCL�T��c�8��S� �):p"U�.wr�-ʇ�Ӫ�4�X#�~��"�S�4Dث�������6���v�N��\OO�,L0������F�L���k��v:�+Л��s"݌Ȫr'7[�3�9!Y�[)ݶ�Ϊ]��^4�M��Y_�ׇ����5�_c�in�>�r5�~�*�Fiô�-��cʻd�E�9�����PF�#�����9:
�C!7��A�}�7�����c�FY�����+�m����k �T��N�*$���{s���
ǻ�A�Py�6[���G�� ���1�B�@Iv�&e�ֵD+v�Q^�_;\T��\-d(��#q.�b�F,d���K&n�\Ɨ,��{�}1�[|��x����
�) R�{s���B:�0�=�*�a��IL����&��gaأE�����=���������=���ԏC� �wB�����W�TڍT����v7�w��[�-���z碿��������CQ�5�y,m�oXi�aK��j�d�eF��K��P{ZC��{�����S1'Z^'���k
&�P�$
5׊�(� ����'��R׌��%�*�OM+�+�;�9���ʱe�&�����4��R)"(��`�ە5/�i~���w��P�W�H��-���&��u
4�+�PC�W����֍�v|�*��B��֒��Ii�S4�;6@�$/�M���ֻ�
*=E�T�_�4 �U���j�5.l��=^���P�n��+NA���9-�+ r
?��!��-YE��e-o&�at�zMd|�=�/��G����9���Q�xy�A���g��5��?�6��MҬ��s����p�
 bݏ'=Yf>9E�W\m��N���1u>���5�K"-��"ݮ�	"ڟ��k���,2����-p�'M�l
l ���%����Ŧ���Y��J�KG�"����<�j�k�L>٤�Dw�5�K�A�o'�� ��]�2)K
,� 83�Wu\P'Ze�A�6����M��)�iF��/��1��w����zdj0��x�A	-  �Er%%p�A�kR�⩬���c[�,Ͼ~�D�>/����*�3�F��d:mK+��!5�4ѩ�Xn�rN PR��0�3[+�絣Ba��
�
����
vF�\��ZP(��3�h�حO��o%�ed��&%
�����A(D�POW/q�kvn���F�/�"�X�$ �R#G���/�mD���Wˏ]q�ݥ����5�������"9�ߍ@�R���=���'�r��;Z�s�� f��� ��-��(�\ �A=�J��@z�Q̗!��(҅�9I7��e2!Zx袄�U\F������|��PLh��A��13���s)-�u���:%����[e��b_������6i��I☏��n��7I�W������2���GJ�dB�`��L�@F��۷l.������f����Ѡx�i�	�!�*ki��|�����G� ��'�iygA��7?���;��ݼθ�����۔y�7��{ǈ3U���J������O��y�sBB�4��AӚ���� a��|�!\�AB42㛺q�U���V�����/�����5����w`���! ��  �c���ZE�4��0覼�zw|���BMިs�ε��Vb���Q��a⾃l(F�c�/;Ն�s7�@'�tL&�Z�EJ G�[8�݇cG��[�x����E�?�kb|��K�*�dF~��-^xᯛ��}%�3�i��K�]���aT}���Y^��<����+����W�Mx��]���9��{�7��C�C��78��M�+��\��rV�����$��\�W��T&�<P�4Q��!��XZ���JEc�1��ȶ=��6�B�)�,���v�	�7��x�m�.��;"8��w�
w���)#>�����S<T"	
cr�74q��V��-e�ZO�
\<�6b�L�,�;�2S�-Z�%�P�Y��Z�H{F��
D�w�V�iK��
�u���k�N:@R����'H�l�B�����Ѝ"O��*x����R��P�]�ޗ�Y�H�W�m
R_M76w�!A�K$���E"P� )���t�0JUD���g�vQ\�D�{r�a_c�2�a̘��_,Ɂ}���V�2i�M��[,+���Rd�rUNC�wA���{��B+ӠJ\���㏈㪥c�> �b`	A�Ԅ�!�4}9����s���	ȗq�Z�]B��(_y��!P"+�Z�r����u�A��*��� �@�^��<�k,	��_����홡r�Wܼ��I5	:>�7l
�}�s<��E���RM6T
�)x
M%�T!�Q@c�/���~�+.��يS�o��=���5\�+O��@�6)R�/���ǘM���E#�0�4cj;ó���-��5��HF2G�0�����O��$'��
��D�.6�;V��x��ql�f5���+=MW!l�Pl|���tU�esvK=B$t�)�	�����?�=�_>7kQ����݄-ɡ�N�}i9�`-�v2|3y�3�~�6z��e���ā���b  F�J��,cPgV�U��M�5r�X����M�mɗ�Cpf�-��_$1z�Z��o�{u��9δ6�b���k�B��Rk������r5yh`�D�T
e�aZU�˹���Ѯ1ufn�&i� ��~գ
^��<U���*2*�&��vD��]�Kck��=�������'[\�q�xɘ��$C�������6(�ʗ�f6K�=p)�G��]�s�
�g���X q8�J B	�"��}d��T�:.��(8��ы�N�~+�Ԓ���26L=C7��N��Ç�z��*Y
e�g�G��6�G�hz-����}�u.�D��2� �wu�T�_9�a��kf��V�ݬ�.pR�Qr-U���`�y�趵����ʴ6�盜�n���wO諞�2�^\]�W�ܥ���J0�r�6�����4����J�zqaiWU=司(H,�_c�5ʩX>ɦ}��W��6��]oF$�2� ��r��XJ7-i�̤`�@��k{�o���P��i���˘M�����+X?����"d9<_&�<�A�z������K *X  OMB��LJ�Ø�O��Mג�������u6\���Fu���m���
���t?��2�6��-X�2;�b6ֱ�V�_m���������6}[�b�g^2������~1��*/�N�Ң����웳�ֵ[��3ƒ����[x�Iz�R��D�q�k]��P��ao�4�p���ʨ2��[�`�-���o����=aRq�|�D��9��ul))��@����Fu�E}��Х�7\��6(�l�l�ʓ���Ѱ����kk��J+td	�H���k�_56&���0	#/�
>�(�]TX�bJ;Q�� ����\   F�b� �з��|�����ǸۜZҢ�� ����U鯒c3�W�"Ң�NP�л��{�[�U}sl78�����W΀ئO�wS�U �t�͠Zp��n	l3�Fw�)��Y���!���l^\`0kY\��+�����07�Pؖ��ͳ�M���kȅ![��5�d�T{h�9�y/F����h���q�0c�-�Ϩ$������@�D]���J 4�� D�0�4s0�и+HkVn��K��u�,���~`pdd#r&��z�P�"Ō�U�{AO�M�O����m����������rf���Y���+k+)L\��K�4��Oj��R�U� ��r-§����1S-�#݊K$���l���_$Kf�j�b�5�X�a���9*k��$��w\�%6A�/d�_K�-$�c[`�0���ٞX��$?����z`r-,���,E�*)���k)ӹR�E������C�GR����ڀ@����0:@ X4tyj�P�\((C��$N��G�>���!^]-Yx�}�J�/�39[cz��@�l���Zl~歫��õD7��H���
aΏO�_�Y�u�f�W
͟%Ly{����?���N���e��@�`���ش����wi:��ɸ�୑Q��ֵi���X�V�����	W��yP����EX(3r�ШD?Q_��@���W��&y��J���($
	/N��;�F:>7Tp��ǣ�S}Q�f'�d�Y��(O$.��G'U�[�?k}�ED��P϶_%����c����K��j
4i���G�(����� ����-q&q+��h:�ڪ�^.1O�ޢ�Z9l��K����l9rh3 6 �����<��L��t2[�^8&L�fh>�N�R�*:���҇È�-K����m����CWI��1�!�=Z�
+���w�\0�=�\_Kw-Ҕ8]�*�0�� �F׎ښM-z����>�����Rs�޽_0g?ln�a��I<���ղ��4[#���n�	x�c�H(a鑯�4p畞K;�8���5���[pH��ap��e9��i4yPL���B�Y��B
�	�9T	F��S����rWm�
         * @property {string | string[] | WatchFiles | Array<string | WatchFiles>} [watchFiles]
         * @property {boolean | string | Static | Array<string | Static>} [static]
         * @property {boolean | ServerOptions} [https]
         * @property {boolean} [http2]
         * @property {"http" | "https" | "spdy" | string | ServerConfiguration} [server]
         * @property {boolean | "sockjs" | "ws" | string | WebSocketServerConfiguration} [webSocketServer]
         * @property {ProxyConfigMap | ProxyConfigArrayItem | ProxyConfigArray} [proxy]
         * @property {boolean | string | Open | Array<string | Open>} [open]
         * @property {boolean} [setupExitSignals]
         * @property {boolean | ClientConfiguration} [client]
         * @property {Headers | ((req: Request, res: Response, context: DevMiddlewareContext<Request, Response>) => Headers)} [headers]
         * @property {(devServer: Server) => void} [onAfterSetupMiddleware]
         * @property {(devServer: Server) => void} [onBeforeSetupMiddleware]
         * @property {(devServer: Server) => void} [onListening]
         * @property {(middlewares: Middleware[], devServer: Server) => Middleware[]} [setupMiddlewares]
         */
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      bonjour: {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      client: {
        configs: {
          description: string;
          negatedDescription: string;
          multiple: boolean;
          path: string;
          type: string;
          values: boolean[];
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "client-logging": {
        configs: {
          type: string;
          values: string[];
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-overlay": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-overlay-errors": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          /**
           * @typedef {Object} ServerConfiguration
           * @property {"http" | "https" | "spdy" | string} [type]
           * @property {ServerOptions} [options]
           */
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        /**
         * @typedef {(import("ws").WebSocket | import("sockjs").Connection & { send: import("ws").WebSocket["send"], terminate: import("ws").WebSocket["terminate"], ping: import("ws").WebSocket["ping"] }) & { isAlive?: boolean }} ClientConnection
         */
        /**
         * @typedef {import("ws").WebSocketServer | import("sockjs").Server & { close: import("ws").WebSocketServer["close"] }} WebSocketServer
         */
        /**
         * @typedef {{ implementation: WebSocketServer, clients: ClientConnection[] }} WebSocketServerImplementation
         */
        /**
         * @callback ByPass
         * @param {Request} req
         * @param {Response} res
         * @param {ProxyConfigArrayItem} proxyConfig
         */
        /**
         * @typedef {{ path?: HttpProxyMiddlewareOptionsFilter | undefined, context?: HttpProxyMiddlewareOptionsFilter | undefined } & { bypass?: ByPass } & HttpProxyMiddlewareOptions } ProxyConfigArrayItem
         */
        /**
         * @typedef {(ProxyConfigArrayItem | ((req?: Request | undefined, res?: Response | undefined, next?: NextFunction | undefined) => ProxyConfigArrayItem))[]} ProxyConfigArray
         */
        /**
         * @typedef {{ [url: string]: string | ProxyConfigArrayItem }} ProxyConfigMap
         */
        /**
         * @typedef {Object} OpenApp
         * @property {string} [name]
         * @property {string[]} [arguments]
         */
        /**
         * @typedef {Object} Open
         * @property {string | string[] | OpenApp} [app]
         * @property {string | string[]} [target]
         */
        /**
         * @typedef {Object} NormalizedOpen
         * @property {string} target
         * @property {import("open").Options} options
         */
        /**
         * @typedef {Object} WebSocketURL
         * @property {string} [hostname]
         * @property {string} [password]
         * @property {string} [pathname]
         * @property {number | string} [port]
         * @property {string} [protocol]
         * @property {string} [username]
         */
        /**
         * @typedef {boolean | ((error: Error) => void)} OverlayMessageOptions
         */
        /**
         * @typedef {Object} ClientConfiguration
         * @property {"log" | "info" | "warn" | "error" | "none" | "verbose"} [logging]
         * @property {boolean  | { warnings?: OverlayMessageOptions, errors?: OverlayMessageOptions, runtimeErrors?: OverlayMessageOptions }} [overlay]
         * @property {boolean} [progress]
         * @property {boolean | number} [reconnect]
         * @property {"ws" | "sockjs" | string} [webSocketTransport]
         * @property {string | WebSocketURL} [webSocketURL]
         */
        /**
         * @typedef {Array<{ key: string; value: string }> | Record<string, string | string[]>} Headers
         */
        /**
         * @typedef {{ name?: string, path?: string, middleware: ExpressRequestHandler | ExpressErrorRequestHandler } | ExpressRequestHandler | ExpressErrorRequestHandler} Middleware
         */
        /**
         * @typedef {Object} Configuration
         * @property {boolean | string} [ipc]
         * @property {Host} [host]
         * @property {Port} [port]
         * @property {boolean | "only"} [hot]
         * @property {boolean} [liveReload]
         * @property {DevMiddlewareOptions<Request, Response>} [devMiddleware]
         * @property {boolean} [compress]
         * @property {boolean} [magicHtml]
         * @property {"auto" | "all" | string | string[]} [allowedHosts]
         * @property {boolean | ConnectHistoryApiFallbackOptions} [historyApiFallback]
         * @property {boolean | Record<string, never> | BonjourOptions} [bonjour]
         * @property {string | string[] | WatchFiles | Array<string | WatchFiles>} [watchFiles]
         * @property {boolean | string | Static | Array<string | Static>} [static]
         * @property {boolean | ServerOptions} [https]
         * @property {boolean} [http2]
         * @property {"http" | "https" | "spdy" | string | ServerConfiguration} [server]
         * @property {boolean | "sockjs" | "ws" | string | WebSocketServerConfiguration} [webSocketServer]
         * @property {ProxyConfigMap | ProxyConfigArrayItem | ProxyConfigArray} [proxy]
         * @property {boolean | string | Open | Array<string | Open>} [open]
         * @property {boolean} [setupExitSignals]
         * @property {boolean | ClientConfiguration} [client]
         * @property {Headers | ((req: Request, res: Response, context: DevMiddlewareContext<Request, Response>) => Headers)} [headers]
         * @property {(devServer: Server) => void} [onAfterSetupMiddleware]
         * @property {(devServer: Server) => void} [onBeforeSetupMiddleware]
         * @property {(devServer: Server) => void} [onListening]
         * @property {(middlewares: Middleware[], devServer: Server) => Middleware[]} [setupMiddlewares]
         */
        multiple: boolean;
      };
      "client-overlay-trusted-types-policy-name": {
        configs: {
          description: string;
          multiple: boolean;
          /**
           * @typedef {import("ws").WebSocketServer | import("sockjs").Server & { close: import("ws").WebSocketServer["close"] }} WebSocketServer
           */
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "client-overlay-warnings": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-overlay-runtime-errors": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-progress": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-reconnect": {
        configs: (
          | {
              type: string;
              multiple: boolean;
              description: string;
              negatedDescription: string;
              path: string;
            }
          | {
              type: string;
              multiple: boolean;
              description: string;
              path: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-web-socket-transport": {
        configs: (
          | {
              type: string;
              values: string[];
              multiple: boolean;
              description: string;
              path: string;
            }
          | {
              type: string;
              multiple: boolean;
              description: string;
              path: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-web-socket-url": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-web-socket-url-hostname": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        /** @type {T} */ multiple: boolean;
      };
      "client-web-socket-url-password": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-web-socket-url-pathname": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-web-socket-url-port": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "client-web-socket-url-protocol": {
        configs: (
          | {
              description: string;
              multiple: boolean;
              path: string;
              type: string;
              values: string[];
            }
          | {
              description: string;
              /**
               * @private
               * @type {RequestHandler[]}
               */
              multiple: boolean;
              path: string;
              type: string;
              /**
               * @type {Socket[]}
               */
            }
        )[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "client-web-socket-url-username": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      compress: {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "history-api-fallback": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      host: {
        configs: (
          | {
              description: string;
              multiple: boolean;
              path: string;
              type: string;
              values: string[];
            }
          | {
              description: string;
              multiple: boolean;
              path: string;
              type: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      hot: {
        configs: (
          | {
              type: string;
              multiple: boolean;
              description: string;
              negatedDescription: string;
              path: string;
            }
          | {
              type: string;
              values: string[];
              multiple: boolean;
              description: string;
              path: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      http2: {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      https: {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      /**
       * @type {string | undefined}
       */
      "https-ca": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "https-ca-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "https-cacert": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "https-cacert-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "https-cert": {
        configs: {
          type: string;
          multiple: boolean;
          /** @type {ClientConfiguration} */ description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "https-cert-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: st   },
      "incomplete": "Não foi possível determinar se o elemento tem um filho que seja um 'title'"
    },
    "caption-faked": {
      "pass": "A primeira linha de uma tabela não é usada como legenda",
      "fail": "O primeiro elemento da tabela deve ser um <caption> em vez de uma célula da tabela"
    },
    "html5-scope": {
      "pass": "O atributo 'scope' só é utilizado em elementos de cabeçalho de tabela (<th>)",
      "fail": "No HTML 5, os atributos 'scope' só devem ser utilizados em elementos de cabeçalho de tabela (<th>)"
    },
    "same-caption-summary": {
      "pass": "O conteúdo do atributo 'summary' e <caption> não estão duplicados",
      "fail": "O conteúdo do atributo 'summary' e <caption> são idênticos"
    },
    "scope-value": {
      "pass": "O atributo 'scope' é usado corretamente",
      "fail": "O valor do atributo 'scope' pode ser apenas 'row' ou 'col'"
    },
    "td-has-header": {
      "pass": "Todos as células de dados não vazias possuem cabeçalhos",
      "fail": "Algumas células de dados não vazias não possuem cabeçalho"
    },
    "td-headers-attr": {
      "pass": "O atributo 'headers' é usado exclusivamente para referenciar outras células da tabela",
      "incomplete": "O atributo 'headers' está vazio",
      "fail": "O atributo 'headers' não é usado exclusivamente para referenciar outras células da tabela"
    },
    "th-has-data-cells": {
      "pass": "Todas as células de cabeçalho da tabela se referem a células de dados",
      "fail": "Nem todas as células de cabeçalho da tabela se referem a células de dados",
      "incomplete": "Células de dados da tabela estão ausentes ou vazias"
    },
    "hidden-content": {
      "pass": "Todo o conteúdo da página foi analisado.",
      "fail": "Houve problemas ao analisar o conteúdo desta página.",
      "incomplete": "Existe conteúdo oculto na página que não foi analisado. Será preciso provocar a exibição deste conteúdo para poder analisá-lo."
    }
  },
  "failureSummaries": {
    "any": {
      "failureMessage": "Corrija qualquer um dos itens a seguir:{{~it:value}}\n  {{=value.split('\\n').join('\\n  ')}}{{~}}"
    },
    "none": {
      "failureMessage": "Corrija todos os itens a seguir:{{~it:value}}\n  {{=value.split('\\n').join('\\n  ')}}{{~}}"
    }
  },
  "incompleteFallbackMessage": "Corrija todos os itens a seguir:{{~it:value}}\n  {{=value.split('\\n').join('\\n  ')}}{{~}}"
}
                                                                                                �*)�i�\�||=�g�&j�/���-x�$C����@A��e*��-�B\�p��d���V�؝@G�X��� hkj	��ZB�Y�#-&�Բ������) �/v�)����Q�!���[��xY�yFS7��xL��P���`�ޠ�Ud��
	5  S�.ud1�;(�3�t�맂�x�ڭǝmwO����b���;�-�O����%T���Uw�� J�)W
��H�*P��~�d��W���v����kbfÈ(��p�u�4&&&�rG^U+j�T�燔�=��m>1Wy��Y����Z���<����?��s�ky��pS��3tG_�����dE��TnjD�|��֓���=���4q�Be.ӊd�Q0�VEnͰ�.s���(�H��u],�8Lr��F.E�m<�j�����/t����g�q�+I�bMzr�(T��r��c5�D1�5���&5��G0 �����&�n~W֣B���3x9��Ә]��d�7��yl�@:J-��uLz���������u O/��v�����[��f�'�qrږ��)����@
фI�:�	���A&��nפN�9�'/���"��a,p���I6>���p�	("��́�#Ky��ȧ����sk\�ş��Mr�Ƒ�h����]_����!\�\ �xl9z��u�?e�<媥���F���$M���C ����-���A�T,�Dbe��Y�����?q�&��!���=��Ya�{SP��IJ����T���o�>��3��X^ꦬ�'�"f4��,�F1EN������:$�/:��_����`�"O4��hZkU�����2�>�vL#uxӚ��f��@
 �  $L=��Q���Oe4B�\2�H�n��R
"�	�L�
v������7�o�+xG�4T��+�>b���Q��>���궄>x��I���|�N("$�?����1�a�ǜ��iTK�K��o/%fʳ�:?�z������5 `	 hm,��a5���<,��W­8/fb�|�}��=`�!�I�;�OA�\�L���x)�P�J���k���� J륲[@Ԩ��9��f�i�U�%��q�eD}�HC`�=�L(I����a	�B<�Si��J�B���Ȍ�Z�\3���r�Y�C׺<�(��mOB�
q�{�04r2
�����R�]�Bl��5Z[�.�ƷDp�v��~�/!��"""�h�U]7V9��i/��W�k(�� g �v���R+��J�����1�oё5̓�����MB2d?���M�;R���E��b7�K�˗\�چ=l�~\XE�6�h>�`:�
���/������Q'9:��'�b�,N�F��%�^v/�E�v������ŏ�V#�!9ŧ�it���.!d�  ��I�Z���}Wr{Yb)�d��(:�\��b�2��r���\oL�������F�Vg]���[9m}}�Ѡ6�r��q���Ӈ� ��48�`M1���+��M	uo�	dKf���1�����3?"�k��ZlDt�V	�����#2Jk�� 6�����U�kW��ۛ �SS��l4\b髓�v���&2��E�:FC�z#K����844�s9��!c��:
P ����n�4��s�o	.��!�pL�؄�Ä�w
��A��F�I~h�w����i.�����S;=7�����F O���a�;�T�/~|Yv2�i�C_��D�u0F~�8RZZu���)�y�	a-�aA?ǥ0n?鸇�G67��Ig�r��I,Ys֒]��,)ʵ�z�@
6�K�E�y���WW�h:�D�9����� PJ��rު�w�7���6lH�G�y���0��-�&��`�F��+��Jnި5�æ2֠��4.+��-봛��r%��5:"����`<�:���[�|�6�;1���VY5#�`+�)ɨ���!
R�S.�D��C���^�A�U��"Δd7^"{��ܙ�w�}��үr�����ߥ������E?H��"�ۏ�ťQ�W�^�%�#F���1����[X`
T?���|��
YE>�LY� D�Hy�.�7=7io-K���WU�` @H��8 �p�e�0��9�C�KK�IƷ0Ϧ������OքI'��5��5�ҥ�p����O>B�{J������� ��i�:��Ýf�J>���8��9��3�f����8I��F�~�����E�*��Z�[��g?,�F�5--��+�Ii���UP	���z@B��`cû�)�5�����yU"�7����;�%i���a^���<��F���߇rҴP��K�D %@m���Z$!s#-IV��S;ܷ�o�H���O��B�O��MYN��S�x�r�ȿb���P]�<�M�n�aH��J��1����.7
 �nk�*j}�sL/��=e&
ܴ��6��1�B�Rir�����;�L{V��0ް�g?ϕ�@_jXn�ѱ|�P�%]E����9�0G�+�Z;��T+<0^��d �aP��"��xfR���c=�a�a�˜���IOE�eN��+N6k:���d����Z�E��
�e{�dJ�}��{y�o}��}A�!�(��T����p��L�H�o\N�������&��9�$x,r��J�.���TXb�+�v_y6=I�a���|�R��X��w�Q^|Q�OH�Tzk�u_Œ���4���\�Av�����{X��V��{��k��y>p#�K�  ���RU�������A���M OHJE����$��7��>h>��8�|�]�6>*��Ȼ7��	�C��rB��*$:��|�s��v�Ԍ�| ��5�0EBfY��\|r�n.�gĊ�*��o٫.��a!S̺���s'{��0�6�+�#�� ��ۆ����@о�M��t���Qo��{Ѽ�p> �� ���V��5���<��������#k0���!���<����p�,;��6HX�C7���r�;c�;���7�d�C�b��)�TLL!TiJ�btj�G����>��'P�߷����o�|�O��V����;�e0��]�O�Rb���<-�l���M��Z. LUX�����
����
�D�\��^X+���1���C�	��%8}��<�E���O�A��[���EO2�ʬ��,�,��P�줯�,�0/B�(��b����������&׹�L�ȓ���٪	z�%yJ}w~�G4�ڦ:�
Ă���=Rh��M$����4e�^�H�'q�U�W5	�o8v�E����M��V�OCNf8_s�����<u4Jg2���+lX�'�0vJ�}�a��H���~��\��p9Qy�I3
<�(��Nf���m�����Y �ʦ�5��K��q���������]�����cㄵ���aB(Aj�s��E���n���&;DW��2��=�S�!����w :n� UbG�6g]v�ԋ%�}ʫZ����|�J,@�����,u �A�'�vA&O�4lP<��U�����k0�|k�]�������`爛�K!qI��_��U�/��vu��r\���邱P���x>B��
�>\��e$���s^a����Q�	��H^/�v�bF�1h(�듄Ʃ��P&��������F8	  �t�s�f����F��A�=@�pN

�kв��:H�L�&Y�,��W�d������sFp፭�S�>Ц$/ߧ�����;�|�z���A��8�e��f��}Hʋ�a��!��!�	}6s��6���(X��*$#��E��6"���4�ƀi=�@4t��"LĴ)��N+��]F-'���1Gj�
mKI.��;J�9r�������j�4�J��x"�ך���gq۫�Ŀ5�����C��%���H��9����<+���p_(Os�Z$�NN�*I�wy�b)Z���)ZV'�{,4�,s�|�?w΋}��_v��$6[g��%EL�A/f~dў������?D\Uj�*�MJ�$$��*�<N�&�����G���!��c��9Y�JACh�>$�J�,.�{�G�rz���a�K���S���m���Q��Åa C�Fqm���a�5b�9h����n�w���4Z�^���04<(*�J���O��X3Z����,��+!=y%i�ZI�P�u
#F��?*����)h-�@��ǇEP0UM-Ux�{�� 9D_S-�e�H�[� �����*5AE\���p|Ki��Bi(�S�QVÇ󢘥D* �\���,��4���J4� �	
����p`�A
°�fT�I���t��D|��E�?|ǵ�\��Lo6ҹF�?����L2���^���m�����3
��-Q�J�.`(⮨�`�6�`��t�����*vrnɭ3k:ɭLi1�)�k��b��#4�ŧ)��lz�y�O�#��T�	 �JO�7p�X�{CB�6��W�$#i��
�F
EƆ���'J��3oWjדe����?��A�4�ʡD�DTG�a�0���E��t�A�����FW�)Cmq�.-���u�_X����eC�v9�{[�Q�Ԫ�0������+6,�Bm'���P�W�_�dD��^&^���	>!LN���UzRJ#J!̩-֚�:��5[R�(�ARq�Rc�t&M�ʲ�sxӣ�R1�$�,��vSSc�:#�q�F/c}�88��7��G�nӴ�vw��x��n�G� Ej��a
 �����|��S`�ak_� :>�z���d��s����;统��O/l�!N��~i�� � �TWad�F����|7k��i�̨�� �E[Y��ձY5j�(Z���u#����5^`�F�_꼼������:꟎�&-k�t.�tm>�:�S���w�~;��=[����s~1]�a�~ٶ�E2�`�,!3�\r(� R	�rJ����΋׆��m�$�frVv����hO�0
�_��=�U8���~x�c{O�H@ؓ���Y�K�����p�A[�>��^f�\"9S��w�~��s�K<�Jʃ( � |��6l�{db��4��{u����K*��W��4+X�(ߗ��_3]^}�q^�����K�/�_ �  �T�dt��I�w8�{�[Ɩ[�zBɠYr(FC����(�&4����һI��Rb�~�H!�;��<O�W_{m����p\�s�,+���HQ��K�Ҳ�{�&��(H
�2@�K���y�"o�J���^�U�t�!�B�Eh�'2�F����$�`Q�ڲp�**ֲ��a���ݵ
y5��ʠ��oZYR)�w�C��>�*�*��?E���$�����*@�A\ !Z:�h��
ݿ�X�r�H����3�(��<�{|P
 ��՚�a`V���7>���з���ǧ7�$F�Ӽ�D<���[KO08���/9�@�"�#dXAE�)"�jGՒC)�`��4��~�\�,���d�{ IRU0�e9��z���q��L�^�jT*%r r>
�{�S+R�
�M��)
�nZ�\���Z�u�SiǥR(uIQ�Y@��k��y��1�Q����}�>~��k$*q[&	oޛ�Ԡ#0�^pò>���v�.BS�B���o7*�����%���%)�C� ���O�����,`Հb̆���� �����b��NT���U:�u�<&���,��'�7M/�\o����ș5fRY�4�4���?B���Jz���J*Tp�FcͰ;���
:�g�e����y�!vSy�e�7����HJ�3UL���{4���ꆻQQe��^��p�$7�m�1�W�y�ŁiW���5�[�+��G�л���r�V : ��ы�Zrٹ�Q����v��-�K,t3hv6�"L�F�)?�_$p~#�eL��������d��_��L ^����'�}
��,�Y k��76tPd��pᰬ��/D�����M��,��;;�V���'h�93���T+f�y�������Y����n�M$�I�p�{��CK�S`,bn�8O�r�T��y����셐v���@���U̐�5��J�	�V	�	��U�]�/%�D�n	�X�P�y�6U��O�BR8޾ɢ
����d/7��)nm�<��qc�p������V�в��2�â8D6k����\ pL|��Vg����Hd2��&����\Ej	S��_�8����K���i�y%��W�>;a�K���dV	Y���x�ɦ��5�B�5���a<S5J6�^���L��-Q�5�<q��7���!���a������+�l�Se`ph���Tg�7ᒨ�n����|��t��[��I{b�Ӏ��q/�r W?�рf�|�(BH����G��$ 0�=����*�J%��Q1!�Br�x�=M�t��3]��M�������RRR֣&����u�#�fZ�%`(R�iW�9	ͳ�j���l;lP��r��^�?��vye�F4e��^��
n{�� �g*��ޢD�2��Ű8\�?[J��#U��w�R��@'Y< ���I_}Jx.�i��r�8�&V)6^�M��z�aY7{�	)�z��k�B��p2Ӭj��-�bjyRtb���q6�t�t	�WV�[ɂ_���8a�l�e}��G��j@VQl�]�-�!�Z�Y ��z�:�%2><��]��6BWI�'6�˴aE���p!�$�6�C���ށ$�����G��蛆���lQ
���l��R&���̘8D,dFc��ϣ�B��F��НXDY���i��v�>xrUT	���
������9�lx�3�dƔ�\k{JŚ?���20Λ�<��8Ȇ�/�e������.��.�:Bo�/4������!)#RZEm���?�E��x����P�'\0�?ܸlaj(�ID��XcP���S����#t������#�۞���|*�?�IN-x������y��(���Ԅ�s抮��h`	�5BG��>i�K�\�灦n�eVJn�ڨ�Wxp�Y�s��LD��Yy��W:?t|A� k�D�w(n-B�B
�=sl)��e�7�Y�.&R���Y��������grM���X��b�V�R]5���9x�vzz����Ijє���E�9����}�O�C#��x�Xj�`K�o2��wEfS�IY�ch:�5�>��­�1�oy�bjPV��v�b��9�PÍ>P���A.�O,�&����r`A�����f�	�4s�̧��a�����u��G�nYN>�
�[X�J��Y�j���gIFǖ�ؾ J=l1�JH҉�+B29�%���sB�s����-؄����[�b�b&̝P�zdX�V�F�$>�.�T�F�!��]#�p����O�V\1,����$����q�F.qK�c�3䠬���g*!]G�;�q���O�0l��m��p-�QT�'����AS��',�3f�P�����ۂ߳��.C��S�@�-�l*��5�=̒�~xG�wn������k�Ze�84Z�N�+DJ�H��I9���������9;cd1��E4�F[Vdj@8P�><ay9��+��6�_b#���>��_KP�Q�����f�F�~@@���j��@��Z|R͓����<k�lf)�C���&@�\�h�0VVi��*�SW��a�iF��*��p`��BL�F�"�U*29�]��7&�O�Eg�5��$i�L{V��\R�n0f��E/�|{-iyߩ+.ަ�:�� ��L$!�δ/��~D}WI$VZ�;���%*�[�V.kF���N�	A��5\�Z�1�����7�b��ʻ=��!-g=�P5�$y���_�x�f�ɍ(L��A�-_1��V���O*� ��A��{D���0��tIc��AV�%�p��@ dB"V��Q����bJ�C�������������8%�i?�QP9S�>�BV9�L��J�6D�;qv��l�D�hL���d_Q��Y��Js��-e��u�K �~ k{�ȸ���	�Q�� $��W�|��A I�.z
?��ES�O��.,��q�t&�r�c\]�-�����`�Ͱ�|�:M�e�H�K��>�^@�8@5� �㉪8��L0=�<9��� i}�z�H7bw~<c��_�M��^�=��P�MO ���]��L?�q=Q'��7��=Ғk�Vx�~���}��	�`A@�t�t層c�j	��	�F����4�c
�վF��V�D�W�֩����n�W�"4�nҤ��3����M��=?�l!�����i�s,��w�����UiR'��!�d���N*�f5Mܶ��8�^̽_=��=����n[)��شg�)�}گ[����|�����l*OG���H���(��Ӵ��f���������>�FLB0,����l��ON�w5Wc<��`�6/7�4�_��1���SH��"�`Rp�`|ˌ+��7cP�(_%GR�J���$�B���[|���g�>����2����,��5/_m�o3
|�g�ڇ�T�$4k�b��YKIQ���"use strict";
// THIS CODE WAS AUTOMATICALLY GENERATED
// DO NOT EDIT THIS CODE BY HAND
// RUN THE FOLLOWING COMMAND FROM THE WORKSPACE ROOT TO REGENERATE:
// npx nx generate-lib @typescript-eslint/scope-manager
Object.defineProperty(exports, "__esModule", { value: true });
exports.es2019_array = void 0;
const base_config_1 = require("./base-config");
exports.es2019_array = {
    FlatArray: base_config_1.TYPE,
    ReadonlyArray: base_config_1.TYPE,
    Array: base_config_1.TYPE,
};
//# sourceMappingURL=es2019.array.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 N�
���=�M}޹������#��>E(!���3� n�_��`J�A�FG���Q}(��D���"��
��*r��ۤ�o���)�=N.�m���*�*Tdx@�R�\�Ks���a����D� ����2�oذ��0b)��Y14��S@�� �A:��¹���x،
X0�e.R0�\��M:�{��i�O(�|�>�G��ȏO$�\�����
1��e�
���E�,o�H��/�ϔڡ�a�Sž*҈��S �-X�C�KE�K;+�3~��� ��ac]��ؼ���ZխG8wj�����oM�j.PJ�����/@�a�]��da���b��\#�E��u7��'j�O5�U��h�i�s��F�镙�R9�o�l/�l�g�ic�|�By���셚��K����y_u�F�·(�������3�N-�UO|�"�页i��"k6Z"|떀�%jG3�0Zت
��~��S�\۲go���d�Fy�Xӵ�A�=˷%�����D����/�1�p���c�j!�*]��V ��0�
���d.q�J��,+��"�Q�^�P���TL�����	+(x�`]���˝&Nf�8)	^�H�L����>��k���ʯ�պ����2l�_xI��Ux�(�e@�@\ʸ��$���3�8��9�*���������CX�Ua���6�A���W��:�PB^���|l���l�0«�W�b��d9�ϡ����5���Vb���H�m�N�I��c7G��S�̿b�i�ȯ�ԙ� D������[C�kv櫏��^m��/�)���,T���ym�Η��]���W�c;�{X�t*��8 �M5�EgȌk����2�>����|o+i�J*��6e���yW6�CR3W�@��.Q����C��Yd4�����C%��J������0y7���.�� #�.;�b[���Y�iX,!j���'�iO`B�H��mhD�3�e�堊kz>���ʞ�/�\�ct@7��'�}�监�������n����������Wt�*�˹�7���u�b�`(q�SW�s��=
�(�"��i�r�& �F�����L������QYm��t��O�1��c����b%y����}�nG}��)b9���%�o�;��ϲ���«�n�Q��� ��>pUL�pЖKb���`.���
���K C'�� r0`q"�~���Tm��Ӄ'��Unq�M7�FĊ6���K<Fg�ݠSR�j�z��T"h�
q��l���_뤍Y��I��zØ�`���dV@2��Z\�Smv_QUaȢ?t��$Ǭޢ����p[:��|������'7��^�>w葖n��e>� n����_X��3�c!����o��x���4gq���0�YULe}�Br���|��S�W{
>��b[6P�
W�.�0)��ğӤ��儑����a��Gz�6mI��Dhج�x�$��ξ�m�foY9���jn��K%�g��ЂqI8���P�������V,�e��uD���lj��`:
�
E��^�E!�á٫M�QL`��廔_J	���UNQe�n5�kTLCW��2E�bu��T �9oe��1�0Z
�F�L���'�ou1U��Cgψ���g��� ����x�%��dVFbHJ��	wLR�"Ձvة��S��t�����Kr�m4�Z�t_�ˡ�C��%8��h���,h�����D�m�z����ScU(�b�T�)������z�������n�XnX*�4.VX.��2�kG|ЅOjvBc`	N�͜"��Y>S�&Z����JqX�rT�FҕLR�W1���3�=8�2 $  A;`k+S�Gݹn�P�L,�>�0�Ah�GB���0aB��KTH�1cʏ
٫T��-��x5���:����d��S��h��k�V�#���='���-4��� �*�h� c*����)����4���;�>f;�k=�����'�K��g�n ��)��\�ji�:
7E-X�4�����9�̧)j�
��#�
"�."lv
�#��]OEҚ���0*tiq$ 3:)��8a�9G�mC�*�T�?a
��@ cS������>��<�w�%S^,De�g0/��3sJ�$�H��տz7.���F:����J�T�O�֔c
Rk�}�n?cQp�v�����~0����22ݍ��� �WdZr�Z��AbF���p5
�d��9���x� �E!U܀7�7ܔ>ʀ]���W�;,8���AF�A��$#n:�o���i#�J�z��%X@�@���f�>##cK�""� J�<��s�g��9�-͔b�x�����[��Wz*��)�p��'�6
���l��Q<
V�&�zA��{
��c�n��K��?��̢��?v��'6Oc�e�<-q���:,�ґA��`T��N�n�*��lL?��"��eqnD�ҟ�OtpYʐ���&������=�1򮝡OJ��I���\�����Ϛ�"���5[��&-OMU���(R��':��y$���{'�ݴ�V��S��AY�n*O�,b����Q�PX�cx���V��V�����L����?���'�����c�J�G����&����ڊ�*P($�b��������ȥ
ڿ78�*Q��&�z9c:�s�F��EK]�7�o�(f @j�hb�D;�)�o��>S�x�l&���G[�4���K�&�Q��W7�p*Q� �ݚ^H��Wk,�tli���k�ώ�2�:��$�)T�����1�a���
	�����k��D֨�Z��@b����+�\�x5';�H62U�O$¸��{�TYG�峗��1����7Mb�9��фF9*���|~uD�<�H��KBi~XBe���!݋F�^m��H��4�N��[/KѤ0\(f���U��K+������ثݭ�;Ҹ̖��s��G�O]o��L#���8\%��\�T3H�ӥshV�i�
��:��9$��t�|%�a^��ͬĥ?>xy���3U,�{{��,�d��E͢Q�ĤȈ�����O,wŬl��G7�������Ĥ͑��r �M�?/��WC\D#�?��(�r���V��q`����e���Ȭ��Ѷ��!G��M]i@�i�q��x5��U��6���+����z�Kyۻ-���j��(�H|<*<���d�8� @P �B2��U���B�,�?$�H�1�"��>�X;���lWe�-B:��ƹ��uOч��5��e��> Plz�ǘ��&[
ǈȷ0�ꏁy��T�7�e<�
�%m��C 8JsS �<�6o�'�`����Vם���2ȿ��P����	����� �xw����H��ݢ��AA�r$E��)�p�!f|���Li�#ԧa2�]'���C��C���˭G�S��W�1��$#��rf��@s�ѳ�K�ei�;�[�y! �٣�������<��Zb%��ɹ=g,��m�M�@Zu�-0�Em����1���h[w���j�kQ~���~�ƽ�Tzy�����]�K��zf.�I�)��,+1ݬ����� �r�U�I�Og*�V�s����:u�?�\@q�MN��Gql���"���������A$��50�(b�F+�&r^���6Y��Qʣ����?��oKp�;
�S�T}��~���w�u��Q���h����zm�C�^�S��+�W����/>�Ү`u����x9l�46#���%�s)9ԟ�b��#������s�
S��qΠ�wL\�G���@0���F�$ ���o�K�3|+:����i�����J��#�՘uXi�\P�K�R��@4� ��ob�o �����]��i^c�Lj�Z
5� ��PD�)DE	��)AJ0^�8��3f��k/)>4Z�R��d����G�⇝8�i�~*9�&F�f���稍X���r�(w���-�&���/�=7f:?
���zf���a$�1�/B���	�%���׸4c�X ����U���O:���5]�~�Y��8k� �"A��-gۢ�Ν"T�֋q�IY��@��DѴ��Gp��	o���}�ܐ ^+�|�F*��S���M�Qm(<b2�����BB�ji�2�9i�N�����_�vٓ0���k�z�v��/�zpH�"wZ
�"sy��1gf�H3ǌ�7f���fXCT֙�$q��Ft-C�����o�u��ZM��\4�<*��R	~M�r��	@��{b�l�5Ѵ��K��w��u���$�%)�����Rl��zSĒRK�pv[Odw��_��)�FO���>��K�u��b���i:���i���j.{�R�pi�qo�f�u�od6_f��Zy��2����q&�KM���C�i�Gp�U�x���j����iԥ3	�
ֳb���uyd��D�V����
`���"�@��%iS e&��\n���GMaz��Җ��	\��b~פ�f[[���z����:�p��������	��p�w�ٯȀ�i��O�*:�-�zq��!���7
\�n�Z�Ǟ�i�}�S�V�����	n�p��LSB��#���?x��WV֕��%��*=����,st�|�W���E�9�M����v ���g�c�>�����l���1Y��0���r=.v��O���)��J���� ���P�N�=ꦾE������%�:���6sS��W���"X�݉UJ @F1ER<=�N
.)�}@ z�������Ff�?���M�e�7���;9=a���& ��%H{�әv���i���wK:�:���Wc-2�ȚH2r֓"��%V�#�"�����rX~�����l���A�V��K ~�k�r�����/���Z�2�9�v�����ڟa8�7@I7�0��<,�@��|IqM��.�fRY�	�ȓw����Td��
����8��C5 �_�3����:sZM:�2Cp'ӷ|4�7ZF�4{�;b �O�A���Ė��V�g�J��޿%#-�@��J=�ǘ�N��mh9'�U v���i��Ȁ.���L�|l&�rG�@����P)��x<�n!���13�Vj�8�<?���,�ߢ�S��f���,�$��.��e���Q�X|NT�@b��=e�;`����(;�#d婥���w#W�'+@����g)�Ң򉄑�[�+�Lv�$�}-E�${�aľM2�ϗps�a�W;��u�X�jiӥ-��i��m��턡�7��3�n�P��28��M��/�-��f��	��-t�i#�gN�����Ҿ�5�T�S� ?K�Y�]Ճ�= �����~"H�+ }X�
��_�_�$���2���J2=.�>yA��iLx�Y���g��Č_�޷�_y�5���l��dc?�W�>\ 
�	�'@ϢG�#6��y�ǯx3���n���bqm�%�� -"���@/��c�[�����Z@=�`�~~Fܣ:/�"?yW��W<�ܭ�I����^�,���-c�WE
�����@�c^��G	��=�[\�&ʽ��i�
����~�39~�dPg"��v�]P"k�+	{Nn�9���2兏�Ac t��W�pzg�\��sS��5���{��1��%��`Ր�_�V��F[�����G��/�2)JΊ���3v�K��/q�-�������czO�t�&%�{�ĸG������VC�~_^/=P;�gt[OG����
��(���v�8�o���s^�X�?O��X̴���*!�p�ώ	��#��d�Hq��R�JQ���Oȍǉ�:,@uM�=xe�/��6r�[+#'����B0o�sWhN�m;_���������R��QEw�I˭��aZx�x?&D#!�ŏ1�6�P�����ҳ��� ����n����G�z��0��R6)d���q)��T�u�0!(+���oe����c��|A&��>dYv_"D �e�䎖�-j�܃0�q��+V<H��u�W��4����N�е|��F��rk�t�k?��q�;(R���+4�矔�M'�R�8�?4~�u�cO��p�  ���ߕ�e�@�:WXiͣ�������ipWѐe�Xit-v�cq�*I��W]����*�zi���N�ʲ5��+$֒�q�§�A����tW��\�%�
P�	�B���x>��)g�U'�d��u� �##N���W�^�Ľ�y�	V8v�	��^4�q\P���o�2��ơu���Tj�!���Xs&A ��������.��5xk:8o�����qnXIp��t(����[Psʙ����_#j�J����
<��Zh�E��[�äV51lJ�] �7�5,!W/���@VJ	|�@ℤ��lu�u���"���Ԣ����j[��:�F��X0AE,���+S�����ʤwƑP�|AsO���Gvy]��	-�yՑH+��IJM��9��2b���]4��>?Hh��[����s�S`� ��!,)��8
J�
�PQ  $��lr �~\/c�&V%[#k����ah�O-��l%pqb2A��f�I~�#�A���|a�W�R�p���z.�*�T����Ɵ�A�)����J�'��`$�
��
�e	D}Uf��q?���"�`���,m�d�T�1���.��?�"i�F��<�� ��X���x��:k&�x� ���p���_ ��������#������<U�*D�kj�8_��)����	����}:[:�}�����gx���`�<�o<���n��h����ia`#9�-8�}%� X�q�*J�yg����');+���]�2�K�8cy�y6��/�^��T+n4���s?g�[s'1���u T���0��bA<�I4�$�{E�ՠP��0��_��)�竦k)W t����\¨��SoZ�JP�y�ޓ���CݑRޥ
��D&������:�g$^Y���%АYE/��-<���{�K��6�ܖ��$=�M�g�
&�Rq�X�6eX}(�cW��b�+eR�G|	P�Љ��0��TAU@�k~E�Y9T��4�lS�(����΄���@��Z�M*���4kK�������e\��������P���VT9�1����
�k��7H7�8lP�҂���)E�jVv�qR�w 8�#����	�?i*�o����M7'v���m�V���JZ�$Ŷ,Ҫ��GN=��Z`�]���$/URn��>C��B��$ى�v�)^����=$�������٫� �]��MD��$e��	���ǹ�B>!NB���+�*_�wl\�LrX6 鉉1�`,5�Y
��F�\�P�)OmtS��l&V�cŀMKt�%��K�ԡ���iM�����r&y���Zw�k��T���"�~�p7��I�(G���߄������Yx �ax1���[�����$|*'`~$�~�Oa��`$�!Њ�����72(T "GI��l���^��A%��HVx (���@R7 �(�����F��N<���HG�Y1���X�� b��3b{�1����7v�W�X��¨$��t˻�6�o	_cy
�/���`��;*+�Л	3|
ݱ�mB��Ct`�K����%��xr�gk�P�������8�4K�(�$���@+�1k�B5jr�����Hո�&XZ�\ލ�A��'���Q��L
w�9��F2s����\?�+�xϰ������"�C&����
�i�Q1z(s�v1�%7���{�6�u��);����#ZQ����{9j�p;�FZ��&\ǘV�J���eO��,FΧR����y�
���}>��@<@!��D��G��t�<A^��4�����v�~��Q�^�"�1չ�s�$�e1T4�����8�
V+7��#�%
�r���-�ˆ�&�:y�]���4��2:T�\���hUE�k.��&�H�ЄE��uA�G�X�@.?��/���� ��J��n��s�Ǐ���mq�l�FՄ{����Ot~�6y�2��p���$?IU���dr�a=:�Q��uT���/���y5w���B��{��T�~�3���tϏ����	����>��8J( Pk�e*e	d�R�)���?�N���0���h6"_�V�͜��b:ͧI�aG�4��;�M��GמI>��i�8�8(a@��P��k_�S߻��v�9��&�"&�OIr2Ku';z5�.�\�ӑ��@i?[�3z�=?�~7�c�^ IwR��z�][�[���lJ�B����Lɔ>��:9���!��y����&]t���'Z4'���i,O�f���M����|-�� .������k�O�&|��'����7�F�{n�O�GO5�	���S�;�н�z�6Rk��v�]�W����� �Jt���iP��QgC�փ�+�����)�$[�|����i��b��g�f [u6���v�\����b9������j�X.v�Ík�k�Lr���.��c�B#P�,
�M��*��>�.�_�`�wM���c�`�[N���k�
>��LM�	�ۻ׉��y7F́�x* ����#��F�����`F�V�@�����L���UAٹ(�YL�弨a����:jz����wj3UqGRf�"`Ҕ�2,�-��
 n�	�]%�QAS�/�)����E��_���DO1N�>����U����X�����`��}��Q���PV8Q���c�uG4�L�2�e����m�u��ެ%Ȟj4�vZռ$��ܩ�4���j�P[OBbc1�Ҕ��c9T��I%{v�KO�9�J�|3��;zi;K��P�糸5����<q/x�h0��P�(d�7��XL�Y)���S�q�M�ظ�`��<̦R�m����8��c��!�v~�e�U3���e�ߺ�ß�l�Nq�����_�zI%�YtL�ub��?����j=^�8(Df�����	ӑP��"�I5�����k{%P ��z��\@Q_e��~~z����$��� �	�Jѕ���p=0�ހ�~c�({O�u��Ҩ?�I�5?e�Z��&m�(4(Xx��5�#�#�b##�q3��|-�7)�Je<c:�� D0���uy�+�ѫm�n3�vm��gB��a!CX������r�&��M�㒦1��hp����bo�h��ӄ����\��B���"��/O2�F��L�|�� �Q�^�����J���>e�$P�)VƠ��9l}Wh!a����N�3�#��;�'+u'�УLo'<�x�/�'�^}*GG�Kw�-�B�import { Strategy, StrategyOptions } from './Strategy.js';
import { StrategyHandler } from './StrategyHandler.js';
import './_version.js';
interface NetworkOnlyOptions extends Omit<StrategyOptions, 'cacheName' | 'matchOptions'> {
    networkTimeoutSeconds?: number;
}
/**
 * An implementation of a
 * [network-only](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-only)
 * request strategy.
 *
 * This class is useful if you want to take advantage of any
 * [Workbox plugins](https://developer.chrome.com/docs/workbox/using-plugins/).
 *
 * If the network request fails, this will throw a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */
declare class NetworkOnly extends Strategy {
    private readonly _networkTimeoutSeconds;
    /**
     * @param {Object} [options]
     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
     * `fetch()` requests made by this strategy.
     * @param {number} [options.networkTimeoutSeconds] If set, any network requests
     * that fail to respond within the timeout will result in a network error.
     */
    constructor(options?: NetworkOnlyOptions);
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */
    _handle(request: Request, handler: StrategyHandler): Promise<Response>;
}
export { NetworkOnly, NetworkOnlyOptions };
                                                                                                    'J���o+kA}��xa���|��#j��uQN'z���<�Db��_�mz�
�#ZZJ�#�K�cL�]�0�d��-1�4���C�k��!c8���uQh�[SZ"�8"�0�`�r'
����₦i��¯1a����� ]����9<���D��6���P�큢����*��x+�%'�=E�+��Le}�TrS��s�
�/�<FQ��&L_�)Q�?�S��*�ڠ��̔��I!iC�Ӏ�r|�w
J'���h����Hh��k���8�?�����[h���X�/g��|�A���f���K{���x�N!F ��Ϣ15#��`�{Ћ��1O�PS�EZ� C8L͖&Ŗl�:��I4�
X��m�[�<~�jV�D�O�<eMgmd:I��~�P��%յ�5_��NB��.���˪(����6I�.�⇷H6:g4YہiW����Ǉ����3@`��H���c���o|F4;��o|*��ʜN�
�=կ����)���<@����et����G����� ��S�*
��s��G���Ca�t�zJ�ƆPt5����+�mSRe�L�0ԗuc%M�a���3�l��w�6�����.�ڪ|iQ������TH�=�%Sf�Z/���	�pT�d��=f�тbq���cZ�#P ���X����2j��n�u������\�^ ���,
Uh�5�Ϯ"gĄ!�@C��Z�i�r<0\P��J�Z��먬�����N��Gh!�<�[���$b�+@.��go[Q�0����D	σ�O=|��ƕ��c:�[W.{ܞ�/����)�>�"W���o�5��+7�[9�05&1��j������$6�#��F���]WTn���0 d�d��I>���ݾ�6I���yG3�U1 :8O"����+u��[�!OYnJ����"-���KlV,���SG;&?S��+*��eSz ���m!��.vіn@�p�ep���X��w&y�ľ����b'����?�|-�
���\ԛ*�^�h��3�4�m>��L��I7��6,4٪@X@$o���a~���~`���j�Qe��e񅻙�	\��Џ@(}-]�3���鯬��(���
�Ы���C�}�I��nqҜ��]g��DP�8%x�!��
=AC��b��������W������(O�c+�/Ł�D+S�*}�w����|j����b��E
a��0A���l��ev�8Qu&�r�G#uZ<��S��P��U+�&�u�~��W�^/�7S�<��0OO�.Y�~#�T��@��c�a�OQJ'�2e��r�w8�57��J'V���7!.�	�A�b:4��]������`pٿq���W�*ѩ�fb^Y>o�[����B��U�{�\^�����F��Ѕ.8�
)
���ď5�+�}jذ��_�Q��I��[W�Nmd�:��o�鼂N	�����o���Y���u,�sR��deݚ>�T��]���;xI6\��k]E���0)�� ��{�`@ ��m"�Y��4��AR�y���c���<�aJe18����i�>�5
o!�IG����ߕ(Xs|�1��ҞxTr��k"�'UĶ�4�T��.["�9*�J�}�:�㢚kE3"��C��%}VfN������AN�ȃSv�y�Lk��cV�P�����'�N�Sn-�_��=+v�ڽ�dWK ���B���>x�3^�����mF#ħ�_��o��D�FG,#���K��o���w�P �y�wPX�j$����>e�A�d��n��!�S#��	�o~���a�kV	1�`ת3oV���4���x���N۲��xI	�sR����(�t�$��Y�QG�,�)���Q�{�pY��ɸ�Ki���/]�5$�u���qH�����R�b��q��t��� �A ֺ2:d��e���S�������}�g#������h�|IS��	k��o^SK��G���^o� 4�Gs &���0����XC}���tQ��Yk�����$G������xRH��ۻh3{��;w���z�
Qݵ��\N}�����mZ}H�U~�g��7�J&C���a^�P�ߕ�$ԁ�=2���!A���'VCK;W(̺o��2�ˠ��|�R�6�r֛*&涡�>r|wAZ��/���ӾЇE�A�Q��v�v �]����Ǟ�9)
'�0��L��/kkԱ���\E����z���I�`��^��od w��Glm  �<��^2���T�ֈ쓹��rH�s��=U��Z\E��Qs#{)��4(#/����dj�,���,����0��N첬"++;�_���j�T}���pP����]�3�D��-��,4�m:�A��׫A���uS����=�u&B�ǲ��9���!��W�`�+������]�5�ouO��X�L(�
9��dVf7{�|�}Z���/���<�)*���")����c�!��4��4p�e.9T�Cf4u��]�����Q3BMRg���4�;5�2����ٴ6ȑ�E�|��MS�3����
���o��Z�esh�7>ڔ��S�1%��a{�:M��H*�@}��"_A��Va�� `�#wD8�"�r�(�J�o�cS��x��� !y������}9WD�����?3�H�ܖ俄�;��q��JP����3�@�^tC��#������T����E��s�a���%�LMN�u���2SF��3��
��}�����E��'-)h�B<�Ģ�e�_N`��
��o��~��w��H�A&y7n����&�;�ب�����P.���w��~�I�n����]�l�w�@�?�w�c�3��0 @�),XՠN���e��j�sO�w4M�WV��N�%��7k� �Q"���\�7E��r����RH�m���u�/��y�������^��'V�@��iƟJ�_�#yQ�m�3݂�S�/�~��mN�}WABB2��a��q.D� �HA�SBJӀ#�>4Φ]�@�4���B�I�;�����a�W���|��a\���W`��]����
�՝���8R.hF���N�QZ��Ƨό�t��"��g�_�OD��n� �y� >!�JC��c�3��i0���OC��-�����j	��]����5������P����G�ҩE�5�p=���(>���K_��|�Q�/��S
��,S5�����V�F<�W�N�A6Yy&Uw���9�j�4�Z����bY������ �6�@�����t��ڐ�Q�:�y:ʳ�cE�� ��2)Z�z�}�2��f	����Xp~��YUq����4.�[�`����^�ʺY�9N(�
2&a���9I�#a^y�(> ��c؀x�+n���wV'�8�;��p�T�X�q�5��獠%��u>V�H�.�F��z�&�l`�k٨mA|3� L����9	g�-r���뗻�7�b��6c,F�J�7�ւ�w�p��1�Z��5Z����RhhUB3q�Tg��Q�Z���c����$ͥ>"X�I\q��8��G�YQ����	��{-�����]��@���/��`Ĵu��
��Ѱ���	/�$�nrun7��LMtv����ep�rj_Q��upH}9���e.�%sI� |���?�jLkW�8(�˨�ҸA{)Z����B�ߞ�����XZRֲ|,I�x�
�-A,��ƍ�o��g�
�"�vj퐹�f.�;x��o�7���' ����Ocx��o��R��uZTw
,���#-w�#��i'~�^�>�>-9�����:�Xu����h���b���5Wj
��F���q'�
	 T"%����4���|^�Y� ��0)���Q�C1M�p�ǐ�����\Ƿ�[4��������G6� ��0^��*��`!�j2��Ə���a_�ugX�>�Uj?~�W�T�t�p+��^����pf��6zئ�1���t6�~�X}�G�����y]�K���i{�c&T	vۈ�o�����n�A�)�q�
8Y��D�������5oԻ�E�);5u���_�	m�;f 8�˱]��"��5��;������Zh;��F#�E��)�lHE���W���kS[s��F���W|����������";�r%X( �b�/YЍ��x�L��yٜ<�R$��d޴<�d�IM\�l�u�k��&͍��
׷�6,͓���b��l��}&Uo���z�e.�'t�eA?^`�h�+��.� �c�̛P`i�M�u� l`��!^�M?�_%����RJ&�����(h�}���)+���d��֭��:�݌���X8Ș �����u�Ŀ�,qj,*�xWH��H�m�3hL�W.��=�Jʛ]9R��0�b���凯E~س!:�����i0�����1v�����ѐ?
-��T�� �'Ʀp<�4W^�䌮���ҪvPL�ʥ�H`��&Q����YA0�0��a�O:r{�w�_�
:�n�oM�b{����-��
�B���ڄk3}3Mg��A���DX���.I���g}F�$�U�?�ʲhM�8;H�ZW{��8� �ٌEJ�b����^.vO���c�q�[-���7a$@��,��y��JS�\���8Bτ|d���e�!ץ��L��Ú�녏�<=L�V�l&�R���fֿ��2� ��`�\� i�ѥM/ ��{R��HєȽx��J�Ԁ(�c
5J�����q���9Hf�w�R�[��;�>���}���J[m
MեsP�
C�
)��	j��E��=C�a�9�~��[��7G" .R�2�j�i�
���}?�Ņ��
��Y�N�+�Q��%C�s��J��P�W��h!�}5��WҨ��֠��W��%ʂ'ȁ/�w��e45�N��'
�(>*6{53KIJ�l��U:��L�,9d�\O���Z���C`kGbˇ5Ϊl[����	��r�&��9`�9�#]r�vfU&I[�H��/�G娂�ZRG@%.�������4`QøA����令@-���Jq�9����� ZAku��Tn���G�y�[x#�Z��Y�d�]Y���.y��D�~�qq�� :j��?3���#H�c=�c"6ac�y�$�<�8�A'�Ҥh�j��c�9y��/6I��kaMq�E$�b�En�5�˚���7�4A�Y�|�M/�
YA���4R����{�����2ϡ�}�B�?��B0q}�æ�ڨ)DY�Yډp1��YAڰi��*G���+���jթTb�&���1��#��K��1��d��������s{�q��h�!|0/��m�qIKb��7���a�cCY����0&2�H\mR.�+��W񮴪���Ϫ�N�j���ݑ�3c˩������RZ��!�����/\��/��;^6���� �Pt�m����a�&�-���?
�$�8ԕ�hv�bW�~�󇿢� MR�SQ�8T��445�K�/�|[����O��V�<�������H�����"+%�l>���x`�t�+O���w�O�SE�p+X���2�־_�D�-(;V�]�7v��
�oV�/�*-VNJ��YO JKK]��j�0 �\EoĄ�6��ҺEa�$��sȒ]8�O�Ǘ��H.�N�%5M�<�ء�3:۸��-�g������_����8ǲXO"�2.<D�~>d��M2��A��!,����>�����iV��o*�9�I�f,Vzs� @q�u�߾���`�S\�ݛ�g�Z8.��Q�<E[�|�L��VR�'E�H��G��M|��D���H + �CI��i�5�a*���7����Մ�}YCu43�_�a��ނՐ�'X�Ѽ6s��M�U档��8�L�9c�.<�Yg{}.	-��t�N�4����X��;�t"��6��٨��Hei��F�"�x�rw�2{�NHa�Օ--�z�y}�)B�;�G���V��ƅ��柖���JۊgC�  1��Lu�a�Lq�˴��T�K��Śγ��/�W�
'U�Jj\��.��ݫ�`!����x�;��02�L-2���$��4�D��'�e�_+��\��/!�B�H$+VH+��,ǈL�I���c��+ٚ�Irb۶m۶m[����m��db۞؜�����~���^�v�Z������RW�*K���L4j}�o~x��:������J��$��L Q٣N?#e��B�`;Q�҂j�祭��磧(.�M<� �߆�A������lo���A��7��Iᡣ��g�Ε�A�a�l��i�A��r�F2ڶ��]��5!���=�������ǌIilhq�>gh�_�F�.c�������i���������ɷE\�Y����"( @�������w�%�}2�q���V$�z,��m��#_&��U��kC�PAڷ՘�{|��
�2� F��Qo-	�ΘInO웣���3��
�d,0�5� ��l�)޳6�p�(>�ɼ"����(Q�����籥TĊ%6<�Fh%.yU�#�&��[I��t�p�%#���yr|E����9{��	8���G8����4"�+<�ku�5�'����]��h�{��D���?�� +Ʀ	�~�$-@.�]Oa0�������o�=��@�R.*��.��u�֮95��]?5��	�l����)��`@��ɥ��F
�Dٞ��Y�w���7���H���*B<�W=�
����PQ��� _,q�Ok�,��N�b��0UG�%<�-�*�7���$�l���aw`D� ��]�z�a����h2���e��#^Ȥ���]{���x<��L�X��$F���F���v�Ҹ�v���
(z�Ҹ!I��ဟ�J�"�8[>N�p.9�(�y؍{ؚ�*,$��_�Ŀ
R@��f��N�����`� �Aj0=#�+����i�TC�{�����������r|�����U�u�h��/���%~ԍ�u@���
������B����p:$@���i�pC�h&ᢼ�IYBL�\�a~���z�� @
r�^�#����ɮ������#<;D�i���ැ�6v��@HO�גY�-bK��[C��0�e���綩��k=��������?� ��~�Q��N�`7�����nw#^zLl��U��o��K�Ika�31�����1s���b�6n �}��w��H)@%U.x�#�@���|��=%�=?���5nLn������r�`�?�s�֌e�8<��?�4�SWw��L�����7VkK�
���P�Q�"M"w:4��aJ���О��.&����R��u�-n�G+(4�iLn�^�e�cJQ t>H'n=Fb
%JB���'�Ћd�aL�Hi�ΪR��H���E&`���_%�*. ����AE� �HX�E���I٣����(P�M��eU�$�5�1�����)c~��r����5�4]�d_iA�U�����ě�.��)�f���C+Α���s~����u{�����8�O��H-qK����CY��-����6(E��r�
up���}F����I��J��Z�� �M�RņQ1�TVF��v����H�C��������Ŝ�~�7+�0��5����\	&c��a��ѓ���0���a'Mέ����<^_]<�`rj��@��La?�CgK���MDL��i(g��t<� t*��i��/�`-Ѥo?���Vl�MgF�����<I�N.��km|�[��=_]K!d��P6�&���#<
	��������^�8	�Ef�V��x�^g�c%��B���Z;�`�X-�?���?��w	f�!��aԾ�P�D׊Z�Ӣ֘�D���u�pDA� H(�I�9�qڵp4�L^eM�Y)��\"�X)~_�h��]4捚���������Y(�-g�W��{�5
��QB��j�����I!��|n�!%ڗ���u'YH))[������R���q���Gt&	�U���������B��d��'g�ڛ^"��Ip@GC��8&x��H�d�&�#�D9r-m'�ܗ�H�f�?U[ReOa� PV�o��8D����	ƢHqN�`("��'u�f4D��]RL�怒	�jlf���dE>9
�x�$dVvN1Ƴ����ڟ��K��I�پJd�q	y�b 	D���0�"i9�<�0*�8E���� �=a�r�K~nJ���c7[���tA�������H��4P`T@�(�C*׊��}Ԣj�)E��F�M�?�K�|!�pk"�q(BE��m�}Ge�O&vn���{ƩT"c�=�e���}}W��z�� ���#�Hsߘ�{�_rb�r;qZ��?7�c��J��)����z[i��o�][��?�V_�g7��Eӫ�_N�'8��D�p�-��q ` ��Y �}7�,���V���1p;�%�`�`��x=����>���V6�T3e��]�a�-�#�}5O^{JVJ�u,�l����p�����^
����"���P7�&��b����� ����'�Ħ��?UQH0�!k�oe)�)���N.�"i  �v�1���fAv3P	䖁[�#�g0$�A����Z�]>����њ���cV���S���?� ����Nc�Ԧ����2�
�=@K�S�Z 0=��\w��"���B������/�cq�_'�i8���K=�F
{M�X�^Ob��5~�~r�R��q6<m���G����,0�Q�.������P�fYb9Ѣ��R�2��"Y�%f���o�f�QYݹU*�-���><�h!�^F2I��r�	L��ljR����'T�+�������{��>�_/L��u�o�o�S���vۗD�`;�t-�ѕ��>�S�<�K�w���








 function getJSXPragmaInfo(options) {
  const [base, suffix] = splitPragma(options.jsxPragma || "React.createElement");
  const [fragmentBase, fragmentSuffix] = splitPragma(options.jsxFragmentPragma || "React.Fragment");
  return {base, suffix, fragmentBase, fragmentSuffix};
} exports.default = getJSXPragmaInfo;

function splitPragma(pragma) {
  let dotIndex = pragma.indexOf(".");
  if (dotIndex === -1) {
    dotIndex = pragma.length;
  }
  return [pragma.slice(0, dotIndex), pragma.slice(dotIndex)];
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                   ��Xk緙�m��&$i�_g.Ej)&�4�U(��� �t p� �tpB+ȇ��1%X�֙�I2��H#n��RGq�D����u������O�Ǡwx�'F�z��W��~�$1x�`���A�mW���^��#W��W�S��艅E@�ks�,���OwTy����eo}����YX�CHY2F����W�����Gy�J�H�^&-�HtrǱ�h߇QC[�bK>�O�N^B��ï[Zo�\��,��C���U �Y��L��BB�_� xR�I�U�L2�c�Yi42ؼ�(C "��f�铨���]�s�Mż��(Nvu������{!����L8�2f�@cb*,R�Ν�
 0]p��̠����_���Kaƅ|����pz���(_��I�K
d�HL�<^ #9/p����(��;>��&�YS������\����c�V_tF���[�ޭKk�u��g�ւ&����@�0]�
��.�
x�I�a�6ؾ.M�wp)jh0��}Uh27��~��*���'��%��=�y�]�l�T�9lf�l��z��X�Azz�'��G9��>�Ei�ҍ��L,�������WtNC� ��@��]���/y��@$�u�[/����y ��A�k��j����y��_��8#�i�1��r��$xc"b��hg¶z�c��r��V%A@+<��$��N}"Ǵ�x9#�ʖ�*Y�Z��C#�A'�+D���!}K�*ý��Ȗw���*�r��t<U���+��Q�9 #�,w�UTY,��������`q���ڞ���ݴ>��]�U�JOA_G���t���R��.$�C�k�'
��
������z�*y�!:*�[��.�����w�)qL�  K&�(X�g�kT�**R=xi]�Y7�8�G"	SO{x柹�6&���c֑��E|%���;�8&��V�xV4��)�m��)X|5���:z�D\l{�EY�D&*6+��������`�X���Δ�9�/��H_㍛)�I�C`i�b) ?��sp4 %U�J��FLWv�Rڳ����$�����D
��H��$ 8S���oZn���O�
Ǯ�n~O�QίW$�6�m>��HY�0��Ys��umR��o�4���G�v�ūj�!�&Y���ސ��i5읶�^����;g�2���+�̺6��T��&.��Σ�����A
��&_F�/H΃xN���.r��Z����qM�Ty��ش��r�y��ޞNz����"UvN�=bف���aP�Ab��P/I`9L�����R��}=*Xk�%�(��`5�����<$Y�DYG���H�c�JfI�ώ�^���$��n�o�[hBD��}�O�%��Aa�
�.��o��p
��j�k�$������u�y-���ђTtsaOd/���3��oδ�޾��{�5��34R��ߖ4�ض��
�&�(�ՖAX�	��@&�CX7-Hy}A�oH��6q�"��?� ����z2 L8R�,ܯ�"��.��V��V[!q���MQ� ��?��W0�/k��C��I\�ry��Ĳ�@�&�4�,wr�|Q,"�$>a6UK
1�i�f��q��&+O�'���TQ<J�!��I��v����tU/EϲpA!�B�����%�����D�'x�CY�a�3���x��˧�t�S�ϩty��p��wtET��S�K�	H�Ⱦsܬ�:e(~���^^�vk�v�z5�;Tvr�kݤ	f�7��i�B!�%�?��C9�P�a&Ջ�;����g���U���a4Rn��%-���-��w��"Z[	 4 0��I���x�Mst�V�m���00?�f4|p�!� &r��=#8*O�uz(�����/�	��7=�(]J�/J�j�iR��˖���>gV�S�A1�zx�/k�	�9���j�U���bJu�
��-�	�H\��~�K< ���-��Ôh �V�ǰ��N�@�]��<�|&6����^����Ty|�����(�/�IVf����=b�.jE���]_�$U$z$tl^\�kQ<��PN���c���� ���Qc%�8hj��NF��k���04���T���
�tӑe�H[��!}��p\+�	�(<��� }�Q���$AY&������˯��9CzkA �&Y�d��zBC?'ťf�=1�*���)�*ˣU0�et�}lKD�F ����vD�Ŀ�!7E ~�`�*�s-N�)��$%M�pCI��#_��X�}
A�c��WwN�l�l�_n�*��lXVԅ/ۮ��#B
8u�|�����v�T�bH�f�v�HV���S���HyV,6OxQ��=F2k����=���
��u:�<�>���͞�����#����:|��#�NI��\^-��ؾ-I�u�-)��켿�1m@ �Ӯh�N�\��r��Z��gm��v��dDFv?8�6-���&oZ���cY�����ԏ�$����a��|��ʷG5}���m;z��Om[�A��/zy��
-ۧ����[�f�ne{lO�=i����F{�9��iQ�`s�P��5��G��d��x��;��cb��[�T��U�)��	��	W�T���]�Sa]�,Z�F9������ �1ӝn92~�\DV�ag��	�|��Xl��ߠ��r�j���������{��Se�=�W�{K�/�n6�]I)��M�Ε��ʦ0��O<( +
'St6����(*��!��櫚�I�0�N1�&$~yN	!o;�s}^�s�&M	>���{Ã?����+9[�bQf׹�v�G���F��L��R�7ɉN#%�PV-V�HBI[.om��P9����Q]3̭H�/ê���;;m�S��u�J�m�s|3��!=$KdW�R�	�Nw����zC3�q^;�f���dUKs�������є{�+��t^�g�x�XH���T<!x��0ڑ'�Q 4��S��]�o?�H�k�G��ꂦh~'*B��V��΍�(�C
��Q�\����E˗r_�L���v��j%8n:��S"PTr�^��IC;���k47�
[eO�_�"F���JoG4"E�tA�m�1��'�Fڝ���cvl�_����'�k
�ڥ[ ��]b��V$�BU����)���4��[*~�����Yz���C4��	�TFr���
� a�������8�Ȳ3����U�]9�o/�I��h��?��ՀRr�3ky[5�$[/�9�u�>s8#F����m� X%"�*��oe�-5�Xƣ��F�2/����Sm#�Z+#����!t�C��搰��We>e%�^�i#�+�s�S�߲�r1��+�&�pI��x�鋱?<vs>
������P烜WB,!���Y�:�v�� ���y�c��S�m���%��,���J���d�Цq��A?S�R'ڟ�S�R�k����8��'��D(-%rK𷒬����(tm���&g��bg�{2�L� E��=�����6��z��T  @���q�n]\���d�� f�Lu�x5�V�9�:<YكD�(Be1��:}��w�D�KK�S�l�:�T�޺��V��*R�� ��V�%���c���#���Ƴ�_�ZU����ZU���ir�Q�U�u��Iu�E�����<08`Ѫ��h���*%L�ǍD�z�����  �Uv�1�d���Cy�,j�۱����񀸮i(VvT��[r��lK|@����E�X}�������y�o��qP��䔑^bj���|M����+��&����>kaM�-����\�)?뢠�r�׭,x#��Q�Z�e~���CdM�e�ۉ�'����" �
�O><𠐽j&Xی���3H2�[��`Y���JJ�"���ߖ��ɬ�;��$��<<'���o������K<�|s�����,�j��2�y3���؛�zJ��`���B�%���[1�"g�$�T�Qv`5���r��)@i#=}���iAr���1��RWY�$�N�8{��Q����Ǵ�Ţ�ۯ?��{y�lq{!N�$Ha�i�ٸ|�?p�m[�� �WM���H��6�D&�Hk��k3"R�@@o}+�R�(|l^n "���6���yՊ�b��rQf����P3�L�E�Ӥ��pZ��5Ȗܨ�\r��|-g�}�N���:���b��td��xWT�-�O�J[x�)�@��?����
M���0�e)x]��j��b�ɡ���d�&���V&I�se�qk�/L�Ë$�D��88�$U�йF*V7��q�c'$�2W��|,zFh�Fv��,~]��K�@�f�T�ʝ��nf�����*vA��W`2�k�T��Lr}xZ��OS�
�W�-!����9��\GU#�W����W�������W�V�)v��΀�s w�	�6|��K@&�M
�h��:�G��=~�z�Eu*-.ΑmV�$�?�{J�@2,�kn�qՒ����Rf�4�&�Tf)Q�%�7�`	����+SG榘v��qv� �4x!	P� ,�<H�n��
\���,�1L�+��u�|��1uh� ���-V�X�ög�zM{�O^X&W
4;:�q��t���У�2]3������;I�=��J��t���X;��	��g�Y�KS�+q��|�9�ru�RS2V�D�`0�Cx�� ��t���Bi���ob���pG
�����|kЇ��'�&�D���H6��a�6#P~ �`�sI��N㮥�'j3����b��2�J���*�L�ּB�@���1����˓K�?�� ��ti�8���sYɩ��=�X��I�n&����h!PG��~�~T�9�Ll��4�U�c��-�(�C��ǁ�P�X�$_'�������k����ԃD����C>��
KT��'
)omq[���b��9�!c�$��QB��d<��[��/)���!�����$�B�vt q&�sbF'8[6�TP]�_�P��:��Z����+��N����V��&��]�@!��'����Dd��p�C'B���Hγ���;BЂHî$�
g㯂��j����n�J�ߤ�����5|�V�LĈ��)�y�~S�߇Y	.�	XH���t.�T��g��H�8(��EV=�͔�u���[z�"҄k��+j�{�/�:%�Z�]�6k���q��7��
�?l_,�6�:�Q{�0�oo��]C�N���G6`g,w��KV��	6��k�E[
M��Y��.����is�~:z��ܤ�M��&N���?&�7���H������J�R�T+
��#�O��Nf�yz�ד|-<�CW�Xw�ܙ��k��qۊ�o��d[�
�k{����<L� ��L�;bq�U��Q`�{ߚ&���rʍ���z�\�<עh!�C~s�ጎ�
�h����� �Ƒ��@
�P�Rpv���7V*�J��&�:(E��΃��O�D�� �F*�fs��6�#�n�-�!�:���� �.���˜�8x���-d�iLAF�fS�y��&�8J��Lہ}<8��LF��I��F%��LsP�^qu�|@#�j~�� �9�?w��l�~c���\GE*��`k�^=�������B����k�2��r�R���T�`��Y(?ڼ5jv�w�/uw��WK��g`Qg��y�1���\�ûA$1��z"S�P�"c��*��{�"���%��:�ԗ�Q%��3���Ϙ���T,Ѻw����Q�����|��`�̘��}�lQ�BX�۹�x;���"�$粵���� b�����գr`�28�D��fZM��V�`�t\tJ�<�L��վef�����m��{9J��4\����FUGMF�V_0�W5���������	�j�D8���:~�/�RK #��8�:xŒRD��^�W&���FjA�:��Ws���l��
���/��>N�S6�������p�u�ɦ;
Ӹ(��~"Vv��<)-�����M7����6�0����XQ�U�Y�pv������T��YL��'8��C���NUǈL�؟"�N_C��������~B�QJ`�R�ǣ1è.;
�ף��0V[��ْQNM:���ц��S�<6�s�[��Q�h�U���k�j
Q���K?�3�Q�蜶�Wp�Ӏ����f<�n��ܩC�h�~�%�>E�X,���~uO���39Lp��Zv�(�j����y�t���i�]/�'�bQ�Y�A�1!�+ԅA�0�,�5�-n����G*[���֦��òV]J-�QT���G����S<��������=�/ﻞ^wR�˲�_zͤ�� ?PT�
�6:B�0zff�����x[ʬ��d�֋�p Z�I�+�T�5�bX�o�7�G��|tP��٫��Vv���Q�g�U���	��* �`�5�+q��/��.gsu�­��Zuŧ�l;���r{�
OE+B�C����������8��C!?Qd��ì 9j��%�\���a|4J0�o���8���(`X��-~!�2�Q�^��#�ËTfeQd��Śu�Kj�P���g���bY6d�!�$P��.NJ���cj��C_�2oF t������@Y��,��7㤩
2�1{��JD*+Ѓ�	2����(W��|M��t��О;�g�.�~�x��^Y�#>��CQ���A#m	/��Xς�ōLO0��,s��|�
���dBKg����=kb���P�1�{�"��H��L.��CK�JKv/��H�G����X��j����&a��NSo��]">����@{��S'�^���Lݵ6I���?��Q^Eg)5T�'�C_c��p��N�N�Ͷ�8�b4&��S��:L����˟����;wD�FK�D,�k��cM��nl�y1�k�OX�
X���m�|����Lw5I0�z�f���8�w�*��擱W�ޘ
����d��|S}|�������1�E ���˕J�j�N4������+�Sg&�ɛ��H�D���c!}?��
	��K/f��3�y��Ȉe���f�C����"��K�A��l"�����
�*!���"�(N�f:�>`��9<�*����+.��˳��V��38U_W���)�R�l_ӃC�	��qS��Y=�h�Ư�,i�[�๩�ɒmMX`^��j���L��Ht������.�%�<u�s�J���ް
�OFp��]Ӎc�ˌ�w5�̀���^i�j
��0c�2�W����TT����s7�}�.�*���*X0
��DK�V���*�V��xʬ:���hذG��E0�!��!fq7�b|:�h����$��k�W4��4�s
	�
\���ȪNq�!�uÓ�ظ�|��Wr1�� ���su�.oh`����P��7�e���hb���y�5}����W�A
/**
 * @param type Type being checked by name.
 * @param allowAny Whether to consider `any` and `unknown` to match.
 * @param allowedNames Symbol names checking on the type.
 * @param matchAnyInstead Whether to instead just check if any parts match, rather than all parts.
 * @returns Whether the type is, extends, or contains the allowed names (or all matches the allowed names, if mustMatchAll is true).
 */
export declare function containsAllTypesByName(type: ts.Type, allowAny: boolean, allowedNames: Set<string>, matchAnyInstead?: boolean): boolean;
//# sourceMappingURL=containsAllTypesByName.d.ts.map
                                                                                                                                                                                                                                                                                                                                                                                    �b �)�16�`�P�����LM\�JY�Ȩ�t�T���DQb�@���Oῒ�Xh�4@  ����	f�_�X�F�CK��O���sVW��&�~lw�֚Z���Y->"�Gq����	��T��Za?n�EB���d��lYD'1X�Z�L����!�ɣ��;'�����3/Ϭ�����N�����R]�1���Mu�8���� �}a���B �T�Z�U�������ͬ�кӟj⮈>baڧ�6����M�s�s!��&�)��U�g��:�� ���%^�����n�y�e]~!�O�$�o^�d�\����9��zi�'��$[d��f����	�tI�u���ߨ��Pレ~��Ia�7�+]�����h<�
a,g@�3��e<�s����9ǆZj�Y��~��y�����L�ś+py�5�ӤOQ߱A�3���x��ǽ\9Ccr|��}�	�0i�T���pI�$�(��1�� �bY@Ɯ�GX$�*f�7�����L���ê�C�	2�����ߥ�\*9p�o)X$��}��8rZ�Y�}���qY2�~�;�����11��iLcUS��Y�Sf�B4}�:sx��~�Ra ��XՁ�D[S:� -�<�>ˇRl���9�}b�J.�M�y�*�ƈ3�D����'Jg���p
�R�Ox�&0�BK�,�� �5-B��P�NZ;Gv�HW�\����p~�����ME�müs��
��+ydH `L�f���S��$b!N�x�(��
��dTB�e��&Q���g��GFB��EEHS�T�V��`�I�|���1
� Cm�'��8 p2��0`&;H�;���Hl�]��w!M�P��G���^�y�~R:��.����o>}���n
��e���ja����NUb-�
j�    d��0 2<R�t����@A6Q�j\ ��.\pWЗ��H��eN�J�,���tZ�6��I ĝ�`-B
�b�ªԃ�z܅k ����侍*�.Q�v������5У���y=�i��H��ʻ
D�[���Ad��'�4a1xOӴE�Vn>d�mk�D��緦�,֊.9vuf�%G�Ќ{�p�q��ڢ�2M�!Rv��E��xI���ql���c��~o�S��X/�C�^��_��Fϯ�p��7.�����c僮�
�{Qp�| �&�7�j��
�˅���qN[�:Ye��sib�)�ʀ2�"J����8�B�@Og��f䌀Ђ �ˋ�xP%vRCC��yr[�L��K��kΣ�3YGr�d�	B�g4t�_Qp{��7��\*4��5ѕ�@Ɵ-Ssӯ�L�o����6�S<JG�↭ t"C���(��ø�T����TÝ�B�LK�ɬoc�k��im�	��X��8ّ��D~8�4Db�؄T����{P�r�!�s��tڀ.+" ���L�mڄ����t/%��=��y����Ч��I�Wϴq7¡�¹��c�7�Q¯���m00�X�x��z�',Vr��2������.�6��eT�61L��ټ�ty�O��0d�&W�d:��U��J��O�)�\-8yt��v3m��Q1]�L�3W�[K��j��%��.$����aF��<�e0[��1,A`d��d��єb?����%
��b�E�6�]|ɡ� 
���-�u�J��rO_��'��6�Ȅ1�';)�&C�_j�4��i�@\3�b�[�v�֌�:�~���/�h6��u�`(Ib^�ܬ;	�2vL7F�~�w��r�T8�A�%A�"$��v�����x�}e>�Զ� �� i����X�� ���a*��J�� 6xr��E"g���k�k?�
sEn��� ��_s���wa��R�e��u"P��um�>�T�x���
1`�\�I�ȳ>�pb�`-�&��]���颰|a�	e;~V��A�K�pP`�@��WLc����$���ˑ+�n���7�S�Uڞ;!���3�N�`ٷ����U�4�ce(���5}حc���\G�	��;��2sM�G�wu"����@m�MLT��c �^) x����2����u��g�T�۫«bء-��_��$�̛�`,$�hv�n���Y�� An��<D�w{�7`�=�2��%�åF�q���as�s(I��X�SS�|~��O�=a74���{<����}�*ͯ�6	�����ź �x�5�~j�3ȸݩ�
��@�J4�H���%l�[l�l��9H
5*m�hY���I`�!(��8��`�HK��R�c��LGfY0D2qE������[�3L酲M�Zx�KI(�<±J�K��g��bV��o�eU���M#õ���`��4�&N���<\����R#C.�͕�/����(,��"��z�UR'�yb�<�����4t�a����zL&�K?LH\E����K�H|�y]'��0�g�EQ�L(�9��D;���R�5����*,����F��
�*K������  ��q�W0E#�ȈA
�^��o���'�b�4�bA�?�F5����~�����.�Ư��Hsq�Fh2\4(\��& �A^f�j\��y�?"��t�?��E58����x�N���x�/]�?�D�������AUr�rls����_:H?���&��J����1��
g�@k����H���q��O(
e9h�`�E��<�Nb�MG`�����A������� �\c�槗��
\<���,�ə_e�0a���"^�x�{s��:8�R|��Z��� �gP�~��J���B�n�S&WIAW��<VW�rk�9Zڕ���1�.)(��l��Lq�-Y_X��!�v���"�<�O�|I|_��J��|[)#-�K$��mxW(���V�E���K�6W���w\��8�L��C1[+{�C��1�a�k��K�@�F��Ο+b����oz��1HCE<�՞��/��8i9SiOK�aE��Q}�F�H�M��ۏ���ބ���K:?��ӕ��Jj��X�}6ɪ#�;��&���i
�Ar<��Ȣ��Є	U1b����?l��28�mr��-��)�)�q"kB�"|��oa%�?W�Vc��I�e�FW��	�|y��R'5�jY�5Ux����(�mA�I�Ek%!�'����[���ӌ@�4j��WOf��T&HƩ��z>	�veY'J�󈞚-c���F���:b0 ��3Z�ָK:OU�w���+9�4]�Ѩ�j��N�����'�\�;a<޶��U����ƛ�4�i��ZTR��{���WK1�u6h7�PpV��R瑶{�n�Ĕ|[2�-Y:��/G钐��!Y0�h�Z4����X�!�H�'�J|�A�^�WU��i��� (� �b�E�"2R�Oty/Ӵ�v�n�� ]����%��gK�;趚M9��B,���1�m�d��~�5��6dN��#���y�	
�=��[P�����L6Yl0�S�[	y�qv��T���'�sn	\)��R��qV�`6ʧ����7~��W<��$�����ā  ��dH�L��T��Q��D�r`m������єG�lH���,{���������.\���t��:�6��?��1˨�SHD�B`��'�TZ���#Ʃx��UePs�G���h#i)���g�s�h��-2��E9΂�z�ĄJ'�˪���>���C�h�����X�Ù�h��bh�[�ϼ(J�'���z���7�>=����\sQ��+h�q��x�C̿���
`���4��E�Ao�z����s��}�x�(B^R�
I̬������zU�qĀ�s8妤J�^;V�� �v�� ,�EX�ls8�eã�U�P	����a
�
����g���%��J&���>���m��#C@#��Y�16#�iY�xd�C��[��g��� ��,�o���!��e2�3�FG�ѻĖu�t��`��3ܠ�����x�L��u�9���'U,^[�M�O�[d���_��י�ڛ>�~�-SU���i�����>q���0.re1���"Ɯ���(tR�Fd������'�'��+/�q�SVƫ7�'d 	
  9zx�8��� �3O[�P�t�tU��
"��/�9+U��e��cm��V�Xoj�����?���'<ثs�*�ho����T�@>�`�BQ5L%�XN5�9��$�I�G���|1.��W�M9���Ǘ̺�-�*�4s���N<������?�fl��Zn^H�����T�X��m���[,vR����bm�QG��eK��]��ܧN[��1zVk2�R�Nd���ѯ�5�(Aч`������Mr��g'���w�@+ ,  R2�\�[���b���MuF�}?Kis6������ݲf���-�q�7��G
�d`�>�(�k5��K��i�`��ٓJ*�w��RZ��
�=����7�.cp�ɋ����E{��2 !
VYe�=�!�E��a;W��Y�c�)#u/��Ť�e��6h#؟�3��MC-�%��D�*�{Qt�>]�z �yJI�mg��|�T�Hꅀ�0C��X�a�&���t�,-�6��r�J�W�p8�u�w�xl�(]V�:��^ӔT��0���@ =p 0,���8N
�CYJ�q���	Z�k�j�|��VR�lr}09m~��,�ıq@���V�����#�1����/j�K�wR�QH��z
���h���4,���
K�3H�01$;���/ϘT��� �?��f����
!j�	�M�to�J���b
��tM��R9�V��E�˛��ճ�.+��B��:�$)Q��nyB�P�D�A�1� ���UJ]�͑*���a�W#��oC(�똃����rI]>��ՕI�/e���X#𤋮:WQ����e�C.��AC�[��(�~�����ђe뀝�����.�aN'��+~��lC�W`��{E�lc�W��[��O3�ᙱܭO�J���ՒN�?;`*�����wm����4X��pl�.:�]L�(��$D��
	k�+��L���(��"��R�zB9|����lU�� �RbY��p�M��YUΒ5��7Tڻ\�.I��b�uN�)	2*�+�%�.]�+���������,x �	*e�4-�Z%_��Y3�N����!w&,�y  ��x5���!�d��f��wq�$�T�S�i�]��̚�V���"��}�'�7j�鑾�r�U�-Vy�/Tɟ��T?=�g��� ,`/��r�~�)���
5�5�x:��Sm@�8X�v0�qZ�oJ��9�S���Rce�q��a-�{|��i��D�Wjߤ �`$����� Ce��%�3��Х���+�']Ҩ�U4c�d=; �/s]^ZO�.����*��c
y�*��I�\6�k�<
Jq��槥wѰ��6%�C��6f Q�ζ�L'թ����>u�<G�AAŁ���!'������BQ�K��[��f�96Qq�mZ ���j[�,�
�!
~�t��e3$٣$C�����|��f�vxo�^�A��e�Z
����4O	������29��D)մy�������*��W�OW�MU�I�_tV�w�Ia��t�(���
ͱd�%��@^���Z�R�����Dtʻ�L�b��Xl��3.V"�H=�h�.K��.Ԕ���I�]��\8[����Ú�T��)�բ`({a9��X�!
������K.N�x��Ȥ{��s����o&�A���@H�������*_�0��l��4��)�M�R�������/���t��6#}�����HK=�F,��(�V�>as�x{(.)[S�4l"�JZ"�Z��(��O����{ؕI[t�`��a�.�r
�Ԧd������+nG�����%@�� fu{�,)ȟ�&�`�n+f]h�-cW��6�{��Wq�G+��
��:���P2uG�c��ib�rW����P��;dA�'
t �D�r ��4r���z�q�⓯�L*��	k6��dY9���h��@|Rg�Ҝa�j�i
I ry]�L�B1�@�Cuh�eZ���'��[C'����X�����c4�hq���5ŝ��]I�]��6�������{��2=�� X�ꑡ볥!��������^m���SN��	�aY,{�s���'J,1
��>[����/B;AD���g�:v�r��q+Φҥ���ԗ���$��mW3����׷k�[J�9��4��\Ld�
;�,�A@ߧDլp<*�����c�vN�B��k����#8�7>՚��L�}�z�I_�2�ټ�x�InV�d���Ha��\�
���=$?�3�L�1
7�P�
;�@F]��.q�"e�ǋ�
����b���[p+Mi��i���I���?�Z7�Eh3ǰwc�_��%�E!�[L�T��w�cm)�
�;Ҙ%� ��X��3�d�T`�������X:����a`�����.����FD��n�����F�Aa�����?X�:{��+�W�(���q� �l$����J�SRbH#�1k�99m=�4�
$=͑�[)W�����X�P�����_��'w�ٸ{F�gՔH. ���Z����X"�R1��۸ʎ9�*�Z��O�dHW٥c^'Q�t�F��ĨN���'������6��'4r�竑��A������PC������F��]��Z�AW��x�>G����jB7�k�#+�����4��}�}��X������I@�T�c�I��mb��C?*�s3S�˛aU�=�Q��h9V�y����ީ�-H]���v@H�jNz0pw ��(�C�L�~P"_C]L��zv�1W|
�����O����n}X�����5m8f�y���'�sZ���9�:�3-�a2�9��7ol��o��y�yND�;3� u,s	�ՠ@���+��m~����
Z�%�'�"#xa�R�L��6-�0c�F�z�YD'�3�
��#��g����Lr�$�.l���^l�D㖭�|���N�6�GZp�S��#���C�Xea��(�1�:g��Y5�42-�`�}ʒ#��$]�����_�2�k��|�3���6����ïjq�v	��2�"�X�{������1s@ �(����$�Kc��.���4*>����r��)�Y�Q^�^֬}v���İ}����u�?D���4{w�����ڷ�z�G����pg��a���3�~���;
�fRlئL"N��u�����4��F�t�~
m.��X��ϲi�^�^U�j���O���]���*N�j�sO+��n ���α�k��
����߱��Hp�r�_��
d�b�DB���f���`>����%�w�va�
���v��c�b��p3��4�#��*�h��Z*Z ��y��ȿ�C�ܓ�@�sǾ����{�J�s����s�ϛ�[ҟ]�S?=�;V��Ϊё��}��B�W>FPK���Z~�����c^�&,�YD�����m�ՒB&�$���$������.��X=5丏P/)--����3�����s�:�O#^KK���Z�"hź�5}�J�X�%����Ԝ��A˵���P5��� %���H��Q�ߗ�ɨD� V ���pP���w����p��QRш�g^X'��y?V���?� ����0lF�(:ҬeL�"\5�U>M�?�ƥ�)s�%��B7w��R�M�6E���"_+
 /������A������8�Tq.[�83Gw�%V��LK��x�b��<Ondr���ɜ�>K�T8ٮ����Kw�d�2��bE��P��d`�/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
import { SnapshotStateType } from 'jest-snapshot';
import type { Plugin } from 'pretty-format';
export declare type SetupOptions = {
    config: Config.ProjectConfig;
    globalConfig: Config.GlobalConfig;
    localRequire: (moduleName: string) => Plugin;
    testPath: Config.Path;
};
export default function setupJestGlobals({ config, globalConfig, localRequire, testPath, }: SetupOptions): Promise<SnapshotStateType>;
                                                                                                                                                                                                                                                                                                                                                              �hI�j��@�t�D,pl$�0���%��Ũ��Pi}�����;���u+�7��� Q��+E��}��E�	�{�b%SH��(o.ᏹ�ƞE���VE0f���±9�^�Oڒ���>k���h�}��[Y(� @
s�f�MST�w�D@"�� ؂�ig����0g0!�z���
f~NF��}�	^�p>��W�z�v6~�V1 ��.,}�?B� ��PW�=%D�I�;����Zp4)v��#:�t?o��aO���-�no�o1�Nw���� p�V�4��>z�'S������v�z�7�L(��=)��(���L�fX�?�����&���:'��ZC綣�dJcN�d�`(b��
��=�U��Lh�N�V��dhF��S�I��~(�����N\s+��ܯ34��_��NL���cy�A�X �2�״v������t���ñ%?=ze��������҇	�F-8-3h��� �@..�n��=��$�O�����a�㚝�c���n�l������E�1�P]R?���.
�!OWOJ�E��w�E��
̾%�:Ja�vKD]���T|7zl7��$�E�&4�Ik��M��"��K�y�d]�����V:�*�J�}L�ȡ2�WY`�Q�|c�ն���6$��hݧmM��tj�T�(�d��7����mΛ7Vn�5�ܸ�m,�[
�>^��EJ��~YR���b��K��~`��{�J�O#n2�u����C�C��U�W��
$ڸ.���d���,���\��)�?��t�|(����gKw	�4s{B�j��P=���D?:�]�/7�)
�3�^�]oU¿?�Ռ1�w� �|���:�S���X
b�kZ(Vd�q��L����Z��R��W:[%ef�y�>���8[I��թ¦���`�eI���X?�^.Άy��ռ����1e�D�ns�l��e���_	��N��Ç���m[f���Ah! �B�/�FX��g�	�[�*j�wz��]�#w���!$4N&�C�����/[�7lV.�m��4�eJt٢#�v�/�
����̴�)ݕe~̏���_ì	���Vh7����y���Ҍ�M��o�s� �߳`�l�Ƣ�M�9B�Ĵ���\�ŏ�q_�
�$�H���!	f��G�m�_��M���BO>�I��L,��w��V�dm��~�)j�2��N��&%E�з@����`��a�Б�����Y\`J0(3	a),��d�0������~~0�(I�����R}q}G k����Y�g�ٮ�Q�#���i���8h��1�5ca���M2Ӭ]�dЂm�2��4C�����nZ5�P��䚂u3��;���Ls��|Զ��-=���S�P��̀��#^���Ϻz��y���q��C��e��J����-?�}�-7���t�qu�e4�
:��f��4�˳ r�l��v.M-�K����,�^�77 ���E�i � f	 {�(�X*B/}�?9TN�=F;^G9�}�	,>Ad��賈f�����z��ݡ ?[А
D8�ݘ����]����.yBN�-���u[����.D�/�)�%R�
���B%�`	��>b_u��^������:Bfo��.j�T2-�]����y�P������R���ו���?�6��6���ڪJ�[/·,�d��+�D���,��Rm���75u���f+O��v�2�p�s�K�����Eۊ�N�A\�%�ҢLE4T��Н���C*V�i&��7�έ�B��q�눿��l��L�>��Xkcʇ����y>	��3*�.�j�ǌ�K��sN�7/C��=lU�+�f�Op��O��e��d�ֲ�^�P ����Ro�+
�Wɰ��;��T���=�'�ʇ��.������g��ݰX�O����2��& F*>R	��?A{�#�B{��ˢ���P������(6�
}�h} �a���h����^-�f1nEU��^�(�>��1��C��C2�w���?�h����'Qiw���az+��{��ˆ�ol'�Z�N�9B����FƋ_�P�Y��q-]��?B!8]�6"3�#�Wa�\�p>cg�ѣ���h�V�i�� �a��"���(S���V`�Y�5x�f����Cĭݧ����'2��vZ!-j���]��s�]Ij
��������Z�!MFcNL8A��t;�}����j��~�C���O�m���{�<KI)1 F�I�@��b8K�0��J[/�L�=#�v[C9��;@%ci�����P���6~J:��YO���K�1ft!�х9�P����	�3b�r(�߇q+�7[O����3׷���|.N^ePd5��{
@K��
�*:�S	O�38N�4�c�<�E/�<e�p�s,��V�[�W��}� �lԨ���$�h6N �Ɵ�*�0�[�_�B+���GGc�szi��a���
M���4�IQ�+����E����aZ?�^n�  4��ۑx�go�2��}�P���(���9�m>�� -��S��ٔ<�i�Y��B|� ���~:A<�cke�<6[i/�
=�'���o:� �-���u�͡�S���)C�u�|8[j����*W��
C���纪/:D{Ɲ��s�<}�`���:�O|ȮHF�f��B�:c
��+��hgUY�p\t���h*�5�x�X��-����t2		�9����r쪷Aa��R�aIH��`c�c�_`Q&�K�._sN�^�ħ��s�Z`�p��}lm��4Ө�Ơc8��`�{��B���1�h	���l���Q$s����G���,hxO�(2,D,J5YH�^�P�z��x}CG�
�p�UobA�M�l �f���ЌP�QBH�� GJF�64��.σ=z:���c�� �J'R<,��T������(�����)X��s9�$���E���T�Ȕh���Z�'�$aq#t�/+tm+��^���~���Ӫ������P�����J���w�b�5X; 2`9E�(eG5�Y��8���,m�J�͜h�B�xD��*S�';�w:���Il�
�L�Kմ��=`S�m��MA�A����SJ,6'�́F�	��5+��ꍏ���K\�-42Ev|@Gp����ll;�$M�"+-����*iG��޼�o4��:��?B� ���#2ɬƈC��Q�J�y
H'
J	���J�
�r��'�azSB��"�{V�.e�X����;�7���Y�6Y�dbQ��3% 
=��m�$��=�d/��h��I�P fbp�X�\�,������'�:�B�pϷ֑��h"�uV�%�*����T
D�-�r���؀;w-�,��U�m�Btz/;um�&3����
��]�_��N��"�o���
�me�"0ށ��5dv
P� ,�_͈��6�����f�9r��2��\�,HA�W2�S�ˤ�����j�~bͭ"��jS
>�@��7�4H<��c�<�Z"&%<S~�i�Αo���P��L��]�i���x-�n�ïu��B[����54]���(Ä��q�!��������g~�y�n,���d�G���Ԁf��Ɩv˕���"ǐ_�;{�Y+$�>���p���E)�>anCH��~a�q)������<��O�f^�m��A�>�/�U����r���}��t'�Ƅ�Rk�5�����Ӧ��L�U�Tv�-T�7j��7!�^�����TnJ��AL�y:�Rs:%���!�&䕐I�>>�C��n����5<����������G&��G���b�]*b��.b�I�q��m ��3���)G!��؃�.�TX���W�5ݽ�\=�K���Vv^o8����Ce8kR@�PU%P���e4?	��$��V�����(	�L���Q�o�Qa�׍l��1��$��/>v)VE�f+�G��/�� ��X�s� t��jp��[�=315�Ɗ��WN��Dl�'# a�,�h���N�/�ɢ{K�]/l{_�i�[�a�@�ϧQy�]���8]��U<�����d"�����)��ˡ�l��QFm|�b� �Z���� N�?��^�2��+�w3����µ�~Y���o��^kd��"�3M�)k�~g�X�,� #��#t�0Xd3R(�?�S�p֪��L��qnxD�&>�$�U��R�e�%o$�g��u�?�e�N<R\G`��띊E��2���XZ󢗫Q��Q́y�g
�y��&�ӎ:Ӟn���`/�� ����:�eCl�Y�-���#�8�sF�Q�ˢR�j�g��w�q�v��T~i�>e�ʧU��s�V��b�%��)���[v�+��
>,*Q�)�I�*�V��e_.��5�J���*6>Z4a�X�t9]�.� �(��.yѓ�>;~����)B��V
X���vȩ3(W�:l'%,���9(7��u~+��:R�q|lX�*�Q}�\_��H0e}��{��M!B���I)!)
B�u��d`pi��b%�7&U.�Q	b +�%A�FȨ!RE��� V���~ZEf�0��%O?۱*�P��(�{��MI�2|'�8��5-\D����*����bN�F�q����~;���4)Q�I��(�Fڵ�����h�?TEZy��pM�W�d�Y���R�]�c@c ��E�&�k'�:�p$1�I�pd��$�g�Nk�瓥��&c�q#�GB�߆ie�Q�>��N)��5{}|�QX>� ` �FY�ꃄ�Q��ER�1Gn��(�Q�y��Uy��;�e�Jϸ�b%��j?>T�/��m�4�&���=��Rc��5F������i��j�ii.Nȷ�����ҭ�)Zc
��$~�\������rx,v.B�|�{-$��KJ}�6I���V�Zп�|y�=mH�_��v�/z�E����1�%�X��B��L<�?B�D"�5[ ?A���$m�2!�b���>�g$З���7�Ur�Y�+��
3��2�eY0���P_R3#�/<�[h������A4��+e���wX�4#��@ZЦ;š�r�O{\���~br�n�57b;����x���
	"PET*��SWt"�3r���(f��>q��p]5�م_�,�	�՚�&i��J�����2���"A��E��^�7��\�ᔾ���/=�s*�2�^�T�قY���m��=��P+�3����M�On�UL/��6������?cdڴ���)��4#�"�i#�X4!ܥ�g�iRM��͆�{�I��$-�SS#d�u �k�	x�?�&�hP��%�
e��x}�_�*�7 x��� �0m8@�0bp�gR�y���\�Dv�8)��TS9�N��bҞ����4�G���|u�(|�]xc�B��ry��̆����&Ć]3*ԌxK3g&6�#����]MϹ/R��!k��m�^�'���O��O�& p{�:�J���ɮ#�p%�:2N�ir�2�S��U&O���r��F�8�X�~�f�Es xRA,�kJ*Q|'���dJ��.U}8���}&�Z�+�SC�
1�\'��?���:J�Za�}r�8�4��E�Ndߗ%�QV�M���6�>#i���Ȉ�-�?���/����.b��'sA�#��ͭSy.Z�c�eq}GqQc�~���R��I�00b�1���"ɮ�$�W�/��~)m�R�!��,��>ԅża'�3J��V��u��q���b��$%Gx�����B�\�ͨ������v$�C^���
�x�'qwA#�ݯ�#��E%[�w�A<	������}G���k�6�l\�~=<�l�؋w%����zN�&U� T��� N�����g��hp���d�).�K�Jn- �j�E�f�	����b��pp���  �J �{ߞ���3��o��%i��i�s9K�e���Ne��~�n����l^��Qs�IU��5�p	�EY�[i)����M᯽�Y���-RK!�Ǣ��E]+�Æ�\)�ߖ��0� �1 �(��
б����cp�4|P�N������}	7�Vqї��5HJO�v<�@�H�@����h����#�,���*��P3 �j �@z-���^KE�cad׉�>=;�w[ �Wag��G��E���횷���M���#�8e0������#t*���\� ��k�;�Gx��ޯ�3q?�-���|����Z��� p�4�}�(���b�H�
N���*	��u�W
 Ԍ�H$�}���(6}f��f�P�@��y�H�PY%���C�LLA�g^��*1ڨF�(~"�R�2Y
Za���7oڴ�"]��������b���#X���9,!t��8��;�7�@�w�4�/����Bp$�7̏I�h����Ӕ��k�!�ig���׽��g��ߛ��d��^��r0q���0i.x�eM�<�-�Cq�SC��׵D�h�	|�fj.��JF��)�u�>�7#��}�R�:��Цd���X�ޜ�'�j4X	-+�\�,
Ŵp����'oc,����v��) �����V"�H�YU?�#��Oyd���{�9|c���e%�@&c�H)<�"��NQ�c�&֏?i���S_"m�UJ2`��i&�>�5�|'�"�)���Y�R�+��H�r}֎�l
�)�z�s;ir��g/S�׫W�>:�C��0��A���/��wY���r$n�Ìb�l������J�p�K9�޻��yܖy�}�{�A~7��^�-����V�e���,����;���4�0�O��)`p�D�{3�X5�LRE������q�ѷ���8
e�\u�t`ϖ�(�ʝ�n��1_Y�Ye��1i������F�ڭ��?8n�u�d���® U��ڄc��u�7�}��Z�0X9��Wh]��^Z�E�+?��c���
5Q�8�}�kڕ W�0�~�� ���P��R�.'�r�m"���E�����.������J����a���e�%�C�|mk5[��UMzu�z�R;O���v��T�'o��|���mQ}or S����������NȒ9�%:䫒.�F��ba��X)�Ai���%�y�6~o�p2��y��B��Z��`9ҙ��ʨN;;'R߅�i�쇺��n%�((�SO8rBK{$�R*/P`6W��}(�2Ey��CC�(��2��lT�����`����N�����:֌~�r(����MW��^���iՠJ|���tZ�3S��
T$��1|o%~�Cќ?)!ab�<��DK��G�ip��,����ބ�Ä��j:޿}�O�R��aW�m�M&u��ޘq�'(�����4>+|S,�N]+�x�f�t_�{��tY�xp�>��$�4��68;�u�s�ɰ���`cw�Iv�~��s����^/��.Fr�$�K�>5u�\/������k��k���er�E݃t����#Z�\bk��6�@H;�K�^�1���R`�U���W#�����[��Y�/<(��!+zDɯ�������|��� .��}�7�0��7��!>O|���sǮ<Q	�}yuqn��6���RV�/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {WorkboxEventTarget} from './WorkboxEventTarget.js';
import '../_version.js';

/**
 * A minimal `Event` subclass shim.
 * This doesn't *actually* subclass `Event` because not all browsers support
 * constructable `EventTarget`, and using a real `Event` will error.
 * @private
 */
export class WorkboxEvent<K extends keyof WorkboxEventMap> {
  target?: WorkboxEventTarget;
  sw?: ServiceWorker;
  originalEvent?: Event;
  isExternal?: boolean;

  constructor(
    public type: K,
    props: Omit<WorkboxEventMap[K], 'target' | 'type'>,
  ) {
    Object.assign(this, props);
  }
}

export interface WorkboxMessageEvent extends WorkboxEvent<'message'> {
  data: any;
  originalEvent: Event;
  ports: readonly MessagePort[];
}

export interface WorkboxLifecycleEvent
  extends WorkboxEvent<keyof WorkboxLifecycleEventMap> {
  isUpdate?: boolean;
}

export interface WorkboxLifecycleWaitingEvent extends WorkboxLifecycleEvent {
  wasWaitingBeforeRegister?: boolean;
}

export interface WorkboxLifecycleEventMap {
  installing: WorkboxLifecycleEvent;
  installed: WorkboxLifecycleEvent;
  waiting: WorkboxLifecycleWaitingEvent;
  activating: WorkboxLifecycleEvent;
  activated: WorkboxLifecycleEvent;
  controlling: WorkboxLifecycleEvent;
  redundant: WorkboxLifecycleEvent;
}

export interface WorkboxEventMap extends WorkboxLifecycleEventMap {
  message: WorkboxMessageEvent;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   �;@
 '.v�)r�
�>�/��ƹ!���Q�8��|�����|*�,%�9��.��ӊ�iZ0�f�A�-
%��&�y�k4�&h�_B�fV 2�����9��`D1_jn���M]�w��o��:D���)��hMg�嫹�s�w;��ۈbl`�f�ݒ���0�!w�i�(�1Vp�Px!~�n��y.��� �5�P ��Eƒ�i\�p�_����t�f����/黙��	��!���5l�'^-�[
�?Y��R��/�W�f~.�`����I�2�����
aa���T�P���uT����b��%��x0�N"�e¤P��&�q�x@D8�
	<jv�g��Bas|~f;�s��ܐۄ=��y4�Ѿ��YB|!m���tX䵇�  ��+G\��]�h5��D�ɫ�t�y�<
�� �7?o.Vм�@�������Gk��:]Z��C��l (��D:J@��d�Ъ�T
�sCRmeV�����I\ˏ�XZ�}��M�Վ�;���W%)�$��>�6@�\�a�@0�`F��`��m�cW���mн:� ��Uv�.pp��
 ���p6��Ќ��f������,}�qCqo�&�.�s*M�p��B@�����<�����d[Q]���˸ �f,���,��y
+}HlC�%L�E�vfǷ{ɞ%lf2T\������Ha��|�[ռ8Nͳ� ��& �k�2�Q"
�
C��(3a�!?��T��76JZ���⻴"d��'�a�n�M<d�K��� �B/JؙӢ(p4����p[8r�?ޏ��~{g?��>�b]�,��)
O� ���#rln�awlW�-�@�fm6r�}����t${���҅@�v�f���җ>���*�?����v�F��p
�[y�-:�M7�X
��Z���:;'/`������̖��	(>N
���+e}LZ��mx_Bh��=Lb��^�]����Z�9b>��Tè87�YT���]���' K�(�:R.?f��[��k��ٯM���_
슦����3wѩ�<�V���I���%M`틎p�K������u����YRwZ�t�:܉9�������1�[盼!YK����X�v:�+|�S{��X�Я�������������K��RA�����3K��ݣ2�m
+�XͲ2p����Aҋ�D��\�̤�~��J�R?�.>>C�Z�P��Z���Y�#Ռ���%���_ �jTM�b:Iɉ����*��!���غ���u�����9���ȇ�(���4��V�*>����NCGSU�^d�EXX2FU[ޱ��gv=���9��Js*�0�� #��|�	�b���ܙ���X�9���|L��eQ�1�g��(������  �i��r�TaW+;u0n��?�Ո�=��?@<�D������V�Ci"
����A����zU�@Za�NP�^�0	 �L��� ��P����φ͹ݖY�UF���Kf-�ԫ�������E�r�ѶjԦ��w�;����L~�n-�)����b�<j��*٪�t�)%�)yJ�7�����R�X(]BR�wV�#^�|%���8��Yڄ?���D�v&��G&��8q��$��L>`�i��;���{��W�(�U��A���KJG���6Vp7@�������Ό���Ƴ�$���`enTY@��9�>��޲�f�ttE)Gwx�ҕ�D�n��I�!���'6R'n[P��R���
?���c
��_����mhD:"!x \�%.o]�����]������N�9��	�d��`�ʤ��%�(�f�kN�Ymi�(o����>L#�>��3���D_w�u�&QMj4$�O-�]Xӯb�|�K��O��!��74�,O���t(^�(��M�/!��~��v�<�ak�{��R�ǻ���53�+���8�z����2HQJ**
]��o.�!���T�F��-s[/v\ZX�ݟ�������������ݫ��Ƿ���]3K �e@�w7=]PR��N�N�K.5H!�D�7ťŬ��)��q��Dl�\����iY�&V�oG(��F]�Һ����Q��SN��r��77����PK������Z�0�h䄘�,5',��#9�6�x�q����������襖��؟2��
���\�Ĕ�ꪲ>e�@�u�����v(I`X���J�X�M�C��5�VR����� "��K��f�p��ھϺͣq�O�K�
B
u�R�L�a#�[ɫ��7c�2�T'�j�{��d�Q&�#a�
�~4�j�^3Ce�B�x,�fDω $H��04a��zUr�����xq������Prڌ)DlX��MY�Ѷ��QYǔB�GT�W�7Y�]]Q�׸f��E�xU;~.m_e)ϯ](�ϩ�w�p��H��Y�~��B�F���[0�L��:���=�ݮ�A���
�-G>��σ�#W6�@�8��Jd���QTf�jq*�H�@�ߑ4π����]��~�+�od|}:K�1�2�u/˶!�^2����5M	g���8�"	_'�mf�����؟P�'���n#�5Gd�yy�q1;�,��y�u쳹`bhz��n!AP2k4���7h �( K��Y�`��1����j�?�v��eǘ�ぞR�$��u��Z�D���:V�l��N{�1��v��s��sW�RK�FZ���%� ��K>�G�̀�&8����0d�-:- �7�N�y*U�~M��[�g�լ:1g&��A��	�r���ܢ�sC�PB���(�>c�.�n�щV+���bOIĵ2z~H����mq��y�P�k�^� l�bܶ�Mrm�)d%�����X�ʳ��CH�0�S��Q���g�KD�z+�����1�>W�>�1"# K	л��Z l6;���)G�d4챵�gL�1Oh��a=��N,r2ҍM�8�|_
h��*I�@����^�p9:ߟUy���P0u���#g��p��u}T���5��>7��q8'U�a@qvK�=���
F�7���媿˖�N8)��1ȃva�Ez2��8
�	fx3� �R0��ԋص�����(�A7|�,�OVă�Y�+w���1�>GW�KtZ0�@b�� 2�O -!!E�}c1�A��[]Z��
}�R凁��2��
H;:��A�� Ud ���؂�~8@�|��&SӪj����s�at��=�fq���A�͢`���iRxN8��2��; V��
 ��I����?�/�E������~W/W"�oǭl;,� "O=a��";�|,�����Y
*��h��F�q2��(+U���R�:I�p��{/��6�W��J�jGG�|Z=�2#j�]��gj\>/V[\�2�NPR7m�*d�g��
I@(Z����jR����eQ*��5�n�H�܏H�¦���d$v�t�l�TaId&$��t_��0>���DrjG}�-&G�/��:��G�ۉ���K�� X_�6�0c�:b8�|�O�����eQ��c���c��rFq��`�Y�lߩ���#~� > k������u�>�"d��S�^@F�by+?0~�2<;#�9Vo=��¼T���>0��z~ȣ��t�f���6^,yz�TҒ�����_�6�J�^x|m�2�6M���w��lmfC�l��|�0Z�{�d�~Մ��@��\�@:�l+f��!f����\ĉpt�!�t�<D��EʉY_ծO�<г7�K&�6`�Փ$y-I��e]ߐ�6�E,~��g+�}��*�p Q�@��i�E< ��&(kݔ�62n���%,觖����ۇ�s�P^�hUc��پ����#�Y"�Tb�ϸE�Y��RM'����I_�K՟9�kFu3���( � �$��d���`�~�#�@(��SU����]��3�2��z����Hgߋ��K���I��W[n�C)�SF
sS!��m�����R��j'�����A�ax;Xb�u��ԗi��:kbt��?�����Z�)���FU�za��J8���[%�\�f���>D)/��N
�t�) 7Ԥw�2�W�E�h�	�8Y��Vp（pa��!�����k��su3'f�sr��K�3 �@���=���b��%�9��:c�>k��q��5���7৔
�ئ�1.�yԦ�L�IW>o�4j���r@�������m ]I��[��/���H I8z��&��Ȑ��$8K�T;��"8Oa�����
�n4��=�E��$�6��2�Zu瞀By
}h�%��4BE&�/�.!���ٳ���#(
x	�׹��at1��=�&���74�`����h!��"��<eo�ԍ:����}�J��괈��E��3�v��Ы�ؤ�f�B�{�����3��t������7�XЃ�����0'!�������,�x��Y���E�!���h��|4z�$�\׼M-�1�2G�j���t�ҍ��g�1-Y�{T�@�00�柡�/D^�n:��=!�k�'����S<��NB:�>9��|^ꏲ���6�E;!�NE���Uv]��K
\�}���J@��N+MBN&t<�1��t8�n_�R�]��e���R��
�(R�*'4>��B9�>~�k�L����m�B�>L��w.��X��J����M#=)bI���6���!m��#}1�{�ߦb��j;h0��R!CXt�C�%�4��Ō�$�S>��nԊA�&�J`�/���������
H�Iw����zI8�a�A�嘄�a�1�;�M�U�yS��ߌ����BE��J�)����	��kaU&��5b��D�T|��9y�sC��$T�Nb�Wg�G�������,�ݥ":�B�e����E��@�t����K�6[.:�$�2�� ��i���n�Kl�|�x�W�F@�5�y�c^n��ۖ,K��*�B����ي2����geg�}�h$��ԢX�+��Z�1z)���[9��'๢  �u�hd��Te�{�f�o����և�,�wVw��4�R�j�?�HQ�Ӳ����F:s&�ۏW�Ӣ\13��KM N"
ӳ��O��R$�p�yz{�rd�H]�A4���������$n�@_jE�u�N|L�j��Nk�qO��y��T��丞�[����)��X�Ӽ���p�Y��q�@h+1X4����o	���;�XUW5�$�\u\�쨈��)�����zQ�^��M�bB-svq�t)&I�M��P�����Ȧp�L���-	�F�ʖ��r&�����{I��=�c�L�.���{:�:��F����Te=��;uҚw�����y�-O�avޯ�b����hy�y�l��S����}{K�ښ�SAD�n=L(>PL�{�n��Qg���q�m��\�UzhL�sL3�&vsN�4Y2�-_�n);��U��w�
�S`q��K �(�b��p��lL�W�<.N[�	*S�kڍ��2E���s�$��{Vy�
�mj���wh�V؛�_�j�����:�sw��a�J��w{�-�&�:)ԟ�ϕMVy������y��2f��~�/}�iKM���ɲ����~Y����=���K�#{Q�^n��0��UcH�k�i-w���+��Q
��D�iQ �-$3좕�]��`a�ï� ���q
����^V^�X�H�<��xh��,X
ru�́/���xy
˻t�l�
�oߪ�9+i�����d�c�P��2���Gg��ʩ���1|Z@���&�e�d�����W��nig��%+�ѯ���?}�>�"����?�`�Xq�l�|�R���$��ǁ�B�98Q'p��x{�Dk!0nV�2K�������x�3a���Y�Y"��9���	1��$�\*/�Ċ��y���An.S�������!Ys-+z�L
[0"'
�xtDn�ZIEq�&�[�u�/����7]���4���(�ј��y,4 �":��`�����E�X���k�S/e=x�.&
��Ң�B��rĿyJ����&�c��G1��Ŏ���.V8e�5K4.l�0Ca*+�l�8v�~�s�������o�D�}Ք��i�	6��KΊ�>vS��׵�kk�\�Ց��G�Dz��[�;�3 Hk��N�pū<��
��B@Y��,�_��o��)��(�����XȖ���>���~9B����]2�K��>�k痌�ڮ�;i��K���>�B�x`�]�rz� ;1�	d��?��{'�1X��-V��M2��5���r��|����������ǭ�8X/���� p�:'G8Uj�

Ex
���us�C�t"�(�Ă�wp�ٰJ+[*|}]sە��Y_�[B�B�ޥ�
TWO�f��=N����VFq`�7|�$���X�lefp`H*�5��+GZe
��Q�2�ܼ���C�`%��V5�Y��ڴ0�X�����!j�	��@�	�A�b@$�����Wޘo,�Ҝ6�=,%��K��:
�ۮ@�k- NH�`�0��8�v�r)#:���x�	9R��>\Tc"\�`aH��4:h����L��V�n��՟& �,y��|��(R�*8�o��F{��|��`�H�bp��j����]�CnV�}����8�C2��q�Y"�1G�p~ٞ��iH���,4�����&����T  �� ��c(Z��r�Kca�ڳ��x��3���8ݵfY����(S4�f,K�w��%�����L�	���W&�^p�;Y�ƸIH�鎓ŸF�u���! �NIW��Z{x}��X͙�<��F��I;,�hb�X�gf%i�|����[jo	lUw�\ay� �p.�lh��� =&���H��J�ֿ��t���`&�0@Qz�ip�㠛F4Q��~�au"���4���,�X��Gs��N$!(TD)� I��@sd�8��"[�#�������e���ڍ��t����n�{�&�ӓ�($K231i�w��ܑl%�<OD�z��A�Z
㧧�@N��0j�d�h�����ZH)�
�����A�Di�,%���4��%�d�,��|����,Q΢�� 8����b�(L:Ѱ{�
��5C)�X7ۑ��G����R�`��	X���l�*��f5�Jy�bt��A��c<�-�]gL��L?��)���t�7l�(�0U�����������%^���s�u�'4�N��Х2Ό��O�'o�h��*���%&�ݽ�o�?��2*����o4�;i�	�����'@4���-�����.�	�{�y�w������Z�j�Y����<��SjQ61��i���$z8��i�̘���z����3ݜ��w�#�;�'�U����$�,��H�
�s���8~u�3)�-��'~X*����Y.�s� 6Н���#��C���������yA)[m����j�.�C�V��2=�xX|s OL��B��ο=wO��
��;^Q����Z����m0�-
�?��E�̛$���4Y�`7N��q��-��)��q8�}y��/�c ��Vg�t*��LtD��VePxE�j!�:8��7� ?+�"S)p9�	L+1@>E�Gn�­�e]i<�%;qe�/7��h�P���I!� D8i�o*�j��I!궶��Z��r�����(�J����
�5i+pDL,�d!_����"a��Y���<�����P��w�1����\Sb�E�G������r�����B��r���QW����k�1[���	~ݍ�"�������B��`P�i�� OX}���q.K����F��u�����x�͔��ml�2^��ʦF���A^��*��g.����{���~�b`�N�@%c�]���n�7�e2O����}l�4s��<����z�{���?� Jns˥8~�NᏲ�d[�Ą
�C�֪<դ[�%��'q����:8X��!�ŚR6`���ަ�,(�vId_�P��Q
��Pͥn�v��G�x���@B8��qJw�>Z��ul����v��8G�Ҷ�v3﷭5)L��q$	�O�������S��9U~i���5�
6&x���_��P���OЈ��Z��3 K>'k3b��j��[Á	~W��F'��������n�,�;�c�ܖm�oGp�r@�������3�����$�9>Y�S{���s'v�`��(���E���d�� yʘkI�A�D]��mѵ;�64�M�yL�Ic!�o�z���c�(���W�	�h�t����0l��2���H�0�%�_D��5�:�!�5xl/��3�$Y��P��)��������0���nw(�|v���+��*x��R��x��w�a/������X^0[�qL����'4��f��`6�ByR*x��������γ�hږF�~��u<q���P���HT"8��5T���%��Y���8��c|�N��c���
��^h�4�`�Ia�M��d���J	����	�RM_��IR� ��&��V¦�X�����"��
tf$���C��s�5U���t^{�!$v?�3��Cs_� 0r0:�Sq%�4VŬ8A,<���Ŏ�K6\QM�~J����s�!���i�}ep���@3ti�+*��ֿb��׼ ������J�Ka����e��\�ރ�s�c�[��l`"P�;�O%ԤJ4FV#��}�n0�������uBu`�P��-��9IbD��jB4��e �Q� ~� �3Mc�p�'�����՟#�5s����3JvȀ�r"Wt����m2���/��1�C�>G�<8��� �Vāg s�.=2$4�eX��%�N&B�'use strict';

const BREAK = Symbol('break visit');
const SKIP = Symbol('skip children');
const REMOVE = Symbol('remove item');
/**
 * Apply a visitor to a CST document or item.
 *
 * Walks through the tree (depth-first) starting from the root, calling a
 * `visitor` function with two arguments when entering each item:
 *   - `item`: The current item, which included the following members:
 *     - `start: SourceToken[]` – Source tokens before the key or value,
 *       possibly including its anchor or tag.
 *     - `key?: Token | null` – Set for pair values. May then be `null`, if
 *       the key before the `:` separator is empty.
 *     - `sep?: SourceToken[]` – Source tokens between the key and the value,
 *       which should include the `:` map value indicator if `value` is set.
 *     - `value?: Token` – The value of a sequence item, or of a map pair.
 *   - `path`: The steps from the root to the current node, as an array of
 *     `['key' | 'value', number]` tuples.
 *
 * The return value of the visitor may be used to control the traversal:
 *   - `undefined` (default): Do nothing and continue
 *   - `visit.SKIP`: Do not visit the children of this token, continue with
 *      next sibling
 *   - `visit.BREAK`: Terminate traversal completely
 *   - `visit.REMOVE`: Remove the current item, then continue with the next one
 *   - `number`: Set the index of the next step. This is useful especially if
 *     the index of the current token has changed.
 *   - `function`: Define the next visitor for this item. After the original
 *     visitor is called on item entry, next visitors are called after handling
 *     a non-empty `key` and when exiting the item.
 */
function visit(cst, visitor) {
    if ('type' in cst && cst.type === 'document')
        cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
}
// Without the `as symbol` casts, TS declares these in the `visit`
// namespace using `var`, but then complains about that because
// `unique symbol` must be `const`.
/** Terminate visit traversal completely */
visit.BREAK = BREAK;
/** Do not visit the children of the current item */
visit.SKIP = SKIP;
/** Remove the current item */
visit.REMOVE = REMOVE;
/** Find the item at `path` from `cst` as the root */
visit.itemAtPath = (cst, path) => {
    let item = cst;
    for (const [field, index] of path) {
        const tok = item?.[field];
        if (tok && 'items' in tok) {
            item = tok.items[index];
        }
        else
            return undefined;
    }
    return item;
};
/**
 * Get the immediate parent collection of the item at `path` from `cst` as the root.
 *
 * Throws an error if the collection is not found, which should never happen if the item itself exists.
 */
visit.parentCollection = (cst, path) => {
    const parent = visit.itemAtPath(cst, path.slice(0, -1));
    const field = path[path.length - 1][0];
    const coll = parent?.[field];
    if (coll && 'items' in coll)
        return coll;
    throw new Error('Parent collection not found');
};
function _visit(path, item, visitor) {
    let ctrl = visitor(item, path);
    if (typeof ctrl === 'symbol')
        return ctrl;
    for (const field of ['key', 'value']) {
        const token = item[field];
        if (token && 'items' in token) {
            for (let i = 0; i < token.items.length; ++i) {
                const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
                if (typeof ci === 'number')
                    i = ci - 1;
                else if (ci === BREAK)
                    return BREAK;
                else if (ci === REMOVE) {
                    token.items.splice(i, 1);
                    i -= 1;
                }
            }
            if (typeof ctrl === 'function' && field === 'key')
                ctrl = ctrl(item, path);
        }
    }
    return typeof ctrl === 'function' ? ctrl(item, path) : ctrl;
}

exports.visit = visit;
                                                                                                              >ԅ���`��Clp�8=��T����ǪdM����۪��I�gS�!��O�a�_<�eJ���GH����g��#�R�)F)��D���&o���s
�׬���ha���s�rWW�&Ie�]TK���6Ѧ�&m�ٽ�/X�^4@-tq��Lrg�:�#5��4��g6�}Z�����0�m�j���M�o��[)3�Z��wK���� ��;{��]\����`��S��Ȫ)bU|s`k��pm���7vC�l�Ġ��~��D�
�����g���:��L�MQ,lǫ��b�ĽަJ�@�/M�T`�Wf�W��P#��p/H��W�tiR�\v�2��C}8��ݚiS�biP�M��J�����_��`��W��"�Q�?�&#�T�I7j�*i*��R��H�'ci������j�UQ'����ŝ��Q�*��Z)�hI�(�*-�J�E��3z��_��5��\mn���J����B��FS��n{��5Bd�N�g P�U��RWfr{yP(񄋦�T��3y�\Z���7}��]��,�2�h?1r�m*�0�
r�"~*ݲ%dzZ�?�U��oP�+nM��e���!�(h���Nv-��f���d�]��%&`։�;���!0�$k\���܊W�b$�(Z�cJ�d�[�Fg�s�G?�lM$��0P̂�
M�t��9��R/����`ST�63-C#?���_���pH%����q*��U �=�L�d�U����P��Hݕ2��&�q4L�|�����LΖ�����v���_�8=T��W��]~*�~S�Ѩ���a��a���z�m��n}0�>����1���T		u��X3t ���d.��ӟ7�.	V��:T�����JS�	��ra���M	pGo����&�e�rX�"�g�TE�l��)V�Jۓ�Ή'��Ő��KEl���ۉc�G��څ�����tQ$��͛,
�[�e$y��9s`���#��~���jg��R�E���\�wu,5�s=�5q���?d�|�j�m�v�� �]�Z qx(��
��3J'�a��˒.�^�r�����#y9Ke_��9}=왹 ��:\./��I3Z�An�(��ݱh��*�j�qH22䱨����S2
�iK�:��f�fk���6�j���k��>y}8�׻j�e�	�^3���yΥ��~�_�6&'���D�G���4A���bov�ij6��������5Љ�&�	(����)&R*�̾4���G�4�������/0n��W � �e}~,5�l~G�T�\a�S�~-�����R�=X���p��I_��ЪK���?����s��;Y����a�� =��\��n���Av-��1i��������LpY��1�T���h8S�Z��0�SMٽv���
�
\����#�86L�J���2��i�<hU���͍~�p� qdR�7Ci/���!^*�)��N�����-�ò���/��c|�R�xy�f�*
����i�2�uI(E���Gٌ5f#hw�Cp�*��x�����`|3���Y�����lK�6x��ca�?[��g�o(SI��~�
l�I�v]G�Z_� �v i��2<��MÔ���ֈ�O���� ]F��p�BF��.{�0S�G鑾cO��6jM�*MΨc�=�����^����G�)�ѱh�@�
�`J� �F��+i~��Y��f����0
��ߛ�O=�0��q��rv�c��1V A	��cU8Y2�ajQ�8ˑha�k_N�qXc���?��M���4b�=�8z1x6�:������*�-3����b1�D�C�C��Ux7�
	�_دv�Wl��9ci  �g1���/�]��hv`6��������KHI����Hh��*-Zdz:���	W{OP�:s$u ����@#�A�y�ӽ�6��'�~���Y��htO[���爦2�8Ke�:L f�C��]�9s9RQOK�@Uj�Q�	;T��!:-��Pl���75���߀+�S��e!����Ə�����P�*&�������!2�B׊��V����ς�@z�{���y�)��%�B(?v
�P��d������,��˧���:g)�Zs��gM��*1U�><�Kh�X���UND&VM��M���3�g�YK�u����A���a����� K�l���i6�
���J�о�o�6�q>������)�����Tkᒆ�� P�!�
��x�bic���xCaQN�vi��?���:.7t{���rJ5��O�;��^5�	����U�ܧϤ?�j���X�U\��,i=���aZj���X�  	�`^.��e��'�*yb�B\~��
�V�J��(o�'����oZ���l�2��3�a��(�=2���"3f(ɷ��א����5���*�;�a��F��Z�.�Ø���EMV�װ�'�RI}���\�@"-��T�m��h������G�)
0@U�CI>Ǚ/LR^{O�fEDr����2�X҄�ƺemN�6�j=��4H�&��T����)P�%�>\�t��C}�r���g�Z��M�����!�=U��xu�����~�r�&���$("�L��a+������x�����?ń�D�b>MRz�{��#�bF��u��r3�����,5���q�z��P�sE��jI?6�֚n���� �M	h��k�
o�/���1^^[�Q̼;>�u�JK�A��+.�ӕǨ�?`�J�,���!x ¶���َȀ�H�����U�g��N1Gx;Ns�Щ���u��X�a�����R쨦���~��3�zO�ra�Dj �ƙ���^|�`��9ɚ�h�.��+�\���{�0�Ȉ5�9�E:����w!�1�m�9�;����lum䱲a �"������.;r<�L�����g��=��_4��q'���^#���oʣ��T�S;�L}��P'�W^�5�Ӈ�߲n�d|�9X0ϗ��)PD�E��v���^���G���}
�˻^mm
_��Mi#xJ��U�l|� ����:��p�+���D?����M7Tez@RB��k��G�?f��7�/�@O�+R
�����"Ԋo��X�=G汜�n���Y�XH ;�a�p��7Q��韩����Z�]߾��$�O�A���CI���|�s���{\��g�w�<hR'�Zm�s�m�1�i�Fg�&��2��L���!M��;����;�}�j+��@翙;��Q����-�|_��̉�ٕ�F��d
�$��Ԭ�\���K/��y��d�mhy(14;�῍iI ;g5^P�s��t��(����=Pk�5R5s�	��� �)��E�P�2����f<h�c��TR����巼Tq3'�d�`:h�sؾ����Bk��i��c=�B�w T8�=bͽp��[â=N�U
*r����ᅅ��#V��T1 �>��|X��O|�q�`c�bz��\$
�F��ihx0Qz�Ha�(�1Q<"��I�gH�mG���~[��*k/�ݔ+�J�A38W�7s	̠R,���m�h���>H��wJ�<��U�M���2-��Aڒ}��U���d���.����t܇���/%��D�& =}����Q�t��Q�����d��y� "�E����|����q�5��J��*x^�TI��#��٦Q%�^�
�5��ʹ#�)�a9??
��<b�<M$��V  2��}�V�
�8�0�!�8�PZ㞙�&��C��e�ݔ�%z7�a�$Z�,��QZ�~���F�U��I�QI���D��x���1���ׇ�{��w��z�nr���9�S�n����!�s�15ɐ_ ��u6�~O*:T�}�/y�?���d$��%+T��_$�a�=�����傾�6f�]q����\�&NȻW���;�B����q�Dג��Ԭ2����/�e_S�mf��˲D���1������D�p���lCF�ƌ�QL������kAN8��6��bϼ�-��ITj�.�B��[tge_I\ww�i�������Xo��R��K�NYU���t�|�v����?I��c�p���16֭+`9°1����Ӏ�ʨ^-2��9�t��/���y�0����NB�v��l�{)x
�W�K�>����U�뉵󂜣>���_�7��#�� }+k/ʵ������b*L������}T��j-w��Y������DgU��#˜��Uԃ gޠ��v���j��^��E�9%Z9��]�'�7�רkk��������@�����XȮŬ�-"x1W],�5��2Yh�ṛ�ÿ!o*5D]	ނr��.��i[V7���>{�,�������^����K#�R�ΝU����C��ײH|���j�tżr�:����m1;��,+6&`G}p%�6j�E�����)�m>��YI����kkk�̚�����:��Ϩ�ه�j��� �ڢ����xl�7���i��t�V0��Z�7n&�C*M? Q���ж��Š��Ѡ�k�z�5��|�Kvq*22f�6����7��  	���N��Y�Ɋ��� �$�I��x����)<)��ߌ����Պ	��_���ODҝ5  N猷<4?0�B(�'��9�Q= i�X71?���W#��(�|��?����C����^a��z$��5w6�U|W����	�Da�%)nK)k'4�!߄;�	����g��q[�)�.d�2ME�G$y4�C�8\V��\z�(�3]TH3�H�+�6d��\�
əm
ӻ��J[��>T���oҕi6�O��իfߒ�j����~���	F���V��\7�
��v%^K���Z�"�\Vě9B�AE���mSk(�[yέ���vb���<��t��v�\ݩɕ��\������u �v�M#\G�SQ�����?��
��}�D�B�ޓa�gK�!S��8.���[���ގ�t���
ix�\�f�����tV�љ����qXW-�8�Ց�-�S�m��E8F�����c�U�$P�!��(�DNq�y���,^��x����d���k����g�[0�1C|�B&ϯ���"r�(.��� A��3y����	i���>��J�Rs*���x��:�P�%�^�Â`� UZL"�v����s��1�ߔ�s%-�eD�jh��� uѾ�"���5.~/	��n�X����D�{C77g���s�x��=Z�>��0-g>�|W2dQ i�6�o��A/�`��mj9�4����SѤ3W���9 P���C
<*��JG�2�K)�q��LK��1�v�ť�*]#���O�g�a����+�#z���p����C�*+�M�QK��O�<�b��`��q�;���$�M[��|V.g����'t嵍�l[��tL��h�va�_!J�X�,ޞ' �#�� ;�ټ��� �R�glD9Z[0M)q��V�����۟��9���\�=��.�8H���n�1�V��t$�{����p u��w�
5��&ȏ͖�z(%,/�w"K�`�/b�9��^��:�"�DJQ���J�q��@���񵝜!�pQ�*q��m�;��oO���Eםؕ�%R�+��Bq$Bp4Ysp�K߽۞G���>
�b75�.�����$�Q���v�����O=�LT�fB��#8�CgoT�������5ڂ�o����C�ݖ�Q���	���O���^��m(H������B�Ծ�`�>��6�a��x�&�pY����!�@�6�_G%SG�%���H����c��$�
_&�gV8�X��KxȲ��5���H�g�萴�;�3��mV�
e�ߜ����8a@܀�lɭ�G�{ ��CW��Dɧ�c|�^�6Bl8����(��5��F<�[U�W�r���7�t��c��$��˼�L,Ԍ��>U��m'��j���{�;U��ŰΓ����j��:�/S�u!D�f�Ȉ4��~C��	��y��ʹ�K��=����Z={�}�Ťx�n�&WY�<����������4���d��r���(��E�ǰ��!�����I��R�L�e�E�q1E�U�N�a�u
�,�}�--*{sb���t���� q��{�W�v�_]��ǝH�n/�wB�a-�[�d�\ؠ�2��Hĝ�rosokO������R�m�!��>z7�T1�r�(�ƍ�5xB\R%�DWG�y�%v�鋘tl��>��~�:�㺵p�U�&y�@ ��`��8.��`)Nd����[�
������rpYtR���|X�s�u~Ets����펹E�	/j����d+�"��h$������ҫ�W�.�+)'�"v��P۾�2b�Ӏnd�pg���8��\gJ0-�ͫ4T��&�����u�ҥ;�f&�
u(˽J�}ap� 8  ����hN�w8��4�?f�x�!*�:/y�|�љ���Zz���;�VK%,�6@��F�g�8�Ǜ��8,�e?gw>���':[
�kkG5�F!< ��v-Т=+,�߅�|���@�j�~�LA���Y��)���(��f��z�2������� �F� �S�Yr\��{������.É��Y�G��Vq�UZ����a��Y�2@�m56x
,�ȫ�.)~)d����� �?��;eg�����0�}�����7=��S�L��;;90��H��4���MoS�7zC���eSEZkHbm=L�\	L�+�6�j�|o�f����.Q����� ޥidΘ{�����'>���
ޤ��HA���F6!
  deepNormalizeScriptCov,
  normalizeFunctionCov,
  normalizeProcessCov,
  normalizeRangeTree,
  normalizeScriptCov,
} from "./normalize";
import { RangeTree } from "./range-tree";
import { FunctionCov, ProcessCov, Range, RangeCov, ScriptCov } from "./types";

/**
 * Merges a list of process coverages.
 *
 * The result is normalized.
 * The input values may be mutated, it is not safe to use them after passing
 * them to this function.
 * The computation is synchronous.
 *
 * @param processCovs Process coverages to merge.
 * @return Merged process coverage.
 */
export function mergeProcessCovs(processCovs: ReadonlyArray<ProcessCov>): ProcessCov {
  if (processCovs.length === 0) {
    return {result: []};
  }

  const urlToScripts: Map<string, ScriptCov[]> = new Map();
  for (const processCov of processCovs) {
    for (const scriptCov of processCov.result) {
      let scriptCovs: ScriptCov[] | undefined = urlToScripts.get(scriptCov.url);
      if (scriptCovs === undefined) {
        scriptCovs = [];
        urlToScripts.set(scriptCov.url, scriptCovs);
      }
      scriptCovs.push(scriptCov);
    }
  }

  const result: ScriptCov[] = [];
  for (const scripts of urlToScripts.values()) {
    // assert: `scripts.length > 0`
    result.push(mergeScriptCovs(scripts)!);
  }
  const merged: ProcessCov = {result};

  normalizeProcessCov(merged);
  return merged;
}

/**
 * Merges a list of matching script coverages.
 *
 * Scripts are matching if they have the same `url`.
 * The result is normalized.
 * The input values may be mutated, it is not safe to use them after passing
 * them to this function.
 * The computation is synchronous.
 *
 * @param scriptCovs Process coverages to merge.
 * @return Merged script coverage, or `undefined` if the input list was empty.
 */
export function mergeScriptCovs(scriptCovs: ReadonlyArray<ScriptCov>): ScriptCov | undefined {
  if (scriptCovs.length === 0) {
    return undefined;
  } else if (scriptCovs.length === 1) {
    const merged: ScriptCov = scriptCovs[0];
    deepNormalizeScriptCov(merged);
    return merged;
  }

  const first: ScriptCov = scriptCovs[0];
  const scriptId: string = first.scriptId;
  const url: string = first.url;

  const rangeToFuncs: Map<string, FunctionCov[]> = new Map();
  for (const scriptCov of scriptCovs) {
    for (const funcCov of scriptCov.functions) {
      const rootRange: string = stringifyFunctionRootRange(funcCov);
      let funcCovs: FunctionCov[] | undefined = rangeToFuncs.get(rootRange);

      if (funcCovs === undefined ||
        // if the entry in rangeToFuncs is function-level granularity and
        // the new coverage is block-level, prefer block-level.
        (!funcCovs[0].isBlockCoverage && funcCov.isBlockCoverage)) {
        funcCovs = [];
        rangeToFuncs.set(rootRange, funcCovs);
      } else if (funcCovs[0].isBlockCoverage && !funcCov.isBlockCoverage) {
        // if the entry in rangeToFuncs is block-level granularity, we should
        // not append function level granularity.
        continue;
      }
      funcCovs.push(funcCov);
    }
  }

  const functions: FunctionCov[] = [];
  for (const funcCovs of rangeToFuncs.values()) {
    // assert: `funcCovs.length > 0`
    functions.push(mergeFunctionCovs(funcCovs)!);
  }

  const merged: ScriptCov = {scriptId, url, functions};
  normalizeScriptCov(merged);
  return merged;
}

/**
 * Returns a string representation of the root range of the function.
 *
 * This string can be used to match function with same root range.
 * The string is derived from the start and end offsets of the root range of
 * the function.
 * This assumes that `ranges` is non-empty (true for valid function coverages).
 *
 * @param funcCov Function coverage with the range to stringify
 * @internal
 */
function stringifyFunctionRootRange(funcCov: Readonly<FunctionCov>): string {
  const rootRange: RangeCov = funcCov.ranges[0];
  return `${rootRange.startOffset.toString(10)};${rootRange.endOffset.toString(10)}`;
}

/**
 * Merges a list of matching function coverages.
 *
 * Functions are matching if their root ranges have the same span.
 * The result is normalized.
 * The input values may be mutated, it is not safe to use them after passing
 * them to this function.
 * The computation is synchronous.
 *
 * @param funcCovs Function coverages to merge.
 * @return Merged function coverage, or `undefined` if the input list was empty.
 */
export function mergeFunctionCovs(funcCovs: ReadonlyArray<FunctionCov>): FunctionCov | undefined {
  if (funcCovs.length === 0) {
    return undefined;
  } else if (funcCovs.length === 1) {
    const merged: FunctionCov = funcCovs[0];
    normalizeFunctionCov(merged);
    return merged;
  }

  const functionName: string = funcCovs[0].functionName;

  const trees: RangeTree[] = [];
  for (const funcCov of funcCovs) {
    // assert: `fn.ranges.length > 0`
    // assert: `fn.ranges` is sorted
    trees.push(RangeTree.fromSortedRanges(funcCov.ranges)!);
  }

  // assert: `trees.length > 0`
  const mergedTree: RangeTree = mergeRangeTrees(trees)!;
  normalizeRangeTree(mergedTree);
  const ranges: RangeCov[] = mergedTree.toRanges();
  const isBlockCoverage: boolean = !(ranges.length === 1 && ranges[0].count === 0);

  const merged: FunctionCov = {functionName, ranges, isBlockCoverage};
  // assert: `merged` is normalized
  return merged;
}

/**
 * @precondition Same `start` and `end` for all the trees
 */
function mergeRangeTrees(trees: ReadonlyArray<RangeTree>): RangeTree | undefined {
  if (trees.length <= 1) {
    return trees[0];
  }
  const first: RangeTree = trees[0];
  let delta: number = 0;
  for (const tree of trees) {
    delta += tree.delta;
  }
  const children: RangeTree[] = mergeRangeTreeChildren(trees);
  return new RangeTree(first.start, first.end, delta, children);
}

class RangeTreeWithParent {
  readonly parentIndex: number;
  readonly tree: RangeTree;

  constructor(parentIndex: number, tree: RangeTree) {
    this.parentIndex = parentIndex;
    this.tree = tree;
  }
}

class StartEvent {
  readonly offset: number;
  readonly trees: RangeTreeWithParent[];

  constructor(offset: number, trees: RangeTreeWithParent[]) {
    this.offset = offset;
    this.trees = trees;
  }

  static compare(a: StartEvent, b: StartEvent): number {
    return a.offset - b.offset;
  }
}

class StartEventQueue {
  private readonly queue: StartEvent[];
  private nextIndex: number;
  private pendingOffset: number;
  private pendingTrees: RangeTreeWithParent[] | undefined;

  private constructor(queue: StartEvent[]) {
    this.queue = queue;
    this.nextIndex = 0;
    this.pendingOffset = 0;
    this.pendingTrees = undefined;
  }

  static fromParentTrees(parentTrees: ReadonlyArray<RangeTree>): StartEventQueue {
    const startToTrees: Map<number, RangeTreeWithParent[]> = new Map();
    for (const [parentIndex, parentTree] of parentTrees.entries()) {
      for (const child of parentTree.children) {
        let trees: RangeTreeWithParent[] | undefined = startToTrees.get(child.start);
        if (trees === undefined) {
          trees = [];
          startToTrees.set(child.start, trees);
        }
        trees.push(new RangeTreeWithParent(parentIndex, child));
      }
    }
    const queue: StartEvent[] = [];
    for (const [startOffset, trees] of startToTrees) {
      queue.push(new StartEvent(startOffset, trees));
    }
    queue.sort(StartEvent.compare);
    return new StartEventQueue(queue);
  }

  setPendingOffset(offset: number): void {
    this.pendingOffset = offset;
  }

  pushPendingTree(tree: RangeTreeWithParent): void {
    if (this.pendingTrees === undefined) {
      this.pendingTrees = [];
    }
    this.pendingTrees.push(tree);
  }

  next(): StartEvent | undefined {
    const pendingTrees: RangeTreeWithParent[] | undefined = this.pendingTrees;
    const nextEvent: StartEvent | undefined = this.queue[this.nextIndex];
    if (pendingTrees === undefined) {
      this.nextIndex++;
      return nextEvent;
    } else if (nextEvent === undefined) {
      this.pendingTrees = undefined;
      return new StartEvent(this.pendingOffset, pendingTrees);
    } else {
      if (this.pendingOffset < nextEvent.offset) {
        this.pendingTrees = undefined;
        return new StartEvent(this.pendingOffset, pendingTrees);
      } else {
        if (this.pendingOffset === nextEvent.offset) {
          this.pendingTrees = undefined;
          for (const tree of pendingTrees) {
            nextEvent.trees.push(tree);
          }
        }
        this.nextIndex++;
        return nextEvent;
      }
    }
  }
}

function mergeRangeTreeChildren(parentTrees: ReadonlyArray<RangeTree>): RangeTree[] {
  const result: RangeTree[] = [];
  const startEventQueue: StartEventQueue = StartEventQueue.fromParentTrees(parentTrees);
  const parentToNested: Map<number, RangeTree[]> = new Map();
  let openRange: Range | undefined;

  while (true) {
    const event: StartEvent | undefined = startEventQueue.next();
    if (event === undefined) {
      break;
    }

    if (openRange !== undefined && openRange.end <= event.offset) {
      result.push(nextChild(openRange, parentToNested));
      openRange = undefined;
    }

    if (openRange === undefined) {
      let openRangeEnd: number = event.offset + 1;
      for (const {parentIndex, tree} of event.trees) {
        openRangeEnd = Math.max(openRangeEnd, tree.end);
        insertChild(parentToNested, parentIndex, tree);
      }
      startEventQueue.setPendingOffset(openRangeEnd);
      openRange = {start: event.offset, end: openRangeEnd};
    } else {
      for (const {parentIndex, tree} of event.trees) {
        if (tree.end > openRange.end) {
          const right: RangeTree = tree.split(openRange.end);
          startEventQueue.pushPendingTree(new RangeTreeWithParent(parentIndex, right));
        }
        insertChild(parentToNested, parentIndex, tree);
      }
    }
  }
  if (openRange !== undefined) {
    result.push(nextChild(openRange, parentToNested));
  }

  return result;
}

function insertChild(parentToNested: Map<number, RangeTree[]>, parentIndex: number, tree: RangeTree): void {
  let nested: RangeTree[] | undefined = parentToNested.get(parentIndex);
  if (nested === undefined) {
    nested = [];
    parentToNested.set(parentIndex, nested);
  }
  nested.push(tree);
}

function nextChild(openRange: Range, parentToNested: Map<number, RangeTree[]>): RangeTree {
  const matchingTrees: RangeTree[] = [];

  for (const nested of parentToNested.values()) {
    if (nested.length === 1 && nested[0].start === openRange.start && nested[0].end === openRange.end) {
      matchingTrees.push(nested[0]);
    } else {
      matchingTrees.push(new RangeTree(
        openRange.start,
        openRange.end,
        0,
        nested,
      ));
    }
  }
  parentToNested.clear();
  return mergeRangeTrees(matchingTrees)!;
}
                                                                                                                                                                                                                                                                                                                                                                                                          {;j�6R�آ�����NiY^UkYӉ�;_�i�s/=����N�P���!�ZL`\MVt?k�0q�D���d5TH;��fk6�o��c{�D[��q�����N#1���(��.�F�NR��i
1G �����J4�7��]&��89��f?���P���_14r��a�}��:$����M� ����'x@���Ѡ@U_*�B���KpaOt
��C�� ��r����� ��X)�]
����[z�ɷ1Hπ���
2Qdf�}kb�-�&'"�����{�����v�ۈ)c�����{�����1�8d_tL� �G��n�Z�X3�zU�~j��w���4V�����{~=��GM�G���
�d��T�*ϭ��g�d�}T�"-�':m��Y	U��<Z��G!�����Zdz���� �٬Zl��Ub� ֝�y
t����3��2��IP�t�@�|�:����7IV���IW�w����_��k �I���s��5�0?�i�_hi&͟lg�Ko��Uy9���D�v0�`�r�0��k'���Z�
�����97b7>�.,$��������eč�\��R����Ļh�d���D�8p$�����j��������7��f��&���{f%GZ?���Y]���̴Nj-;��M7b�[���c�_k��0d[�b��i��[1ұ\c��Gxɧ�D�{��
����*��^$	%=�
�-

qu���m�K(��pe���RhX	S��_�9����>.��/2�����Ǻ΋L+�����8 �����yp0MEUeqt���loǢ���ݳ��
[���`���W�?�H�V���$�ྮi��f�&P�4�o�ղ�i#�Ű�7+2���B(�>IR~���x�L�Y�-f���|E��Y��E�O��^'���A�����n���Z���^�/���E��{�I��VA�g��B ��  ���L��!�#��[�����پU��e:V1����n�a�h�=\����V�P�`N��qt�p�;$?�$X�7w�u�H%:�j&1Xx.�'|<ޜˏOk5��zZt��m+�z�f�N7�|;�����|w5�Ƴ9?1tٚ@��je�P�~�iF��������:�H�~��5�����P������oFT�f���&>݄��Y�����.:��D]n{�t����]y3�p&
�@@P��B���
��O�G��:���ކ�.��$`	�1>��J�g0D�$��͝*@�D]�}C�Os�(5�$<(V�Nc�����D�"�j0�j֛cEW}Fǭ��f�i�T��R%M��&��.��h|�E��ݜ��	c��8�;&��J�(�5C�;C_fb��B^\L� �~O�YL�_B_���wՄ��B�0D�d�U�t�E���P����^?�qL��l�� �1 �3�۽��|GQb�"J4�g��F��}���QE����MI#�ě4* �B�����N��<��#�@l��ﻓƛ���
 ������sZ'���7�o�\�~�"T��J���5��C]����'�G�T�۲�KA���Yc�c2�d��n��Ƌ��Su$G�F��UG�kJ�)���.�{M��H����c~�Qr�n����o���$׿������Hڳ�Ri�Q9��Kh;ӑ�	�����Z�Q	�M]�ϯ�G<9:"%��������� Q����r>����$G`���	 p�Gbe҇j��	��u3��]���ۜ��9��#���c��<��X
�۶����&Ϊ���K��|JLd�3�C�8�=��WT @ �����qF�N�Um��)ơ�V|��n
E�b�D�K���?K�
��v�Sy�\Ջ(C��գ���;�t���dn5�8ƫ1�����gv�c쇖4�U��O:���24Ï�Tw*�
4���Jr�S�Y�|��|X�	� �r;��C�p� {�����j��ir;Z͟�Å#�	2.%׽��_���ٟ���ꦎ�Z޿��M�|?[��M�-k�Բ��\�m�j��X��}�-�d����V��Pa)�r�h��� B
xp7 |b!� �#0���
0�g;���@d/Om��O�X�
�ӭ�Y�am��V�@�z��� �6�B7��A�{�&xZ;<����sl3G?҂@�z����u���_֝�Zxf�����3Ϊ�py&[���X.v����Hk`����o-+h��tty6�E�`��QIJM, B$�=�9�Bq}Rݣ��xl9��
��?����u��/"�&�;�:-�r��*`�
�b��Q� k�_^f)�^�����ػ�$f��#����~����q�{%;>皻�T��Ӡ�("�z�BT���rHd}~h������i`m
@�X_V �l���}+	��5�ޥ0i�_,Hݗ ��h��C&�x�S�~��r`�$�#c�
��B��^���`��X��������9�fe6d�^/����(��D|g���#�����2ÿ���ϵA�����q��#��8�~��t��%�W�G3�*>��������WJ���.�:v�+����T�8�IE����~A�6R��56+c�� ����l�oP�(P���0e-�;B������c��B���5!B��D�>7	��G�5	^����Zm� |Hh��~L�V���\D��j��E��>q��"_�7�5a�g���$��'�j�j҆�E�7$���	9�!���R��N*Ջ{W��(��ҡ�ggNQ��5@��^�#Q�/���Eg�m�S"�yukdF�e/�����D��_'�c8S���NA�e��+6to��(=�`�{����r-3��c�i�b�	���M���j�U�|8J�Gcu`�����S�j=B�t����yͦ
C�k���6.\�/��	R4�|���qK��u��NGǬ����zGݛ�"( ��-�"
�L@��13�Ar��j���9O�(7�5S�E1}��oZ��L������Y���C�R�� k�HÈ�n�V:4�bw>
�&�C���D	"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var docEpigraphRole = {
  abstract: false,
  accessibleNameRequired: false,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author'],
  prohibitedProps: [],
  props: {
    'aria-disabled': null,
    'aria-errormessage': null,
    'aria-expanded': null,
    'aria-haspopup': null,
    'aria-invalid': null
  },
  relatedConcepts: [{
    concept: {
      name: 'epigraph [EPUB-SSV]'
    },
    module: 'EPUB'
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [],
  requiredProps: {},
  superClass: [['roletype', 'structure', 'section']]
};
var _default = docEpigraphRole;
exports.default = _default;                                                                                                                                                                                                                                                                            ����N�^����g]�#E�L>�J4*lE-D*
 "٢���.���X�!���=�۷F���{��7C~��j<a�S[3���x��x!��94�B8PHS��3t���M�wv��26*�[�g̝�#Ͱ"����PP%8h]�es��W`B��e�<���77	͒l�c��N��_�]�l�e�T�FT���"a��T���i�0<���7 ���Ĺ��߅59t�j3	�����Z
��QoX9�ѧj]��NI2n���n��Q��Ax���C�W(��!��OH�b݂	�>�ix�#��j�gI���O/  �* �M���x\ thClMՇt%�~Բt��/L�qj��r&��:Ud�za+��[���෢)5bp��.'�0���+
S$Z�x�1�i:�������ϚDY�z�����;��v*��24m"~�V���}��Gipm�.�~�fMg��J�ϕ����r��A�����
eU��rl��}
��Ge7�~b	cd�O�@O�������x�����5Dhz����y�n��.�pO��fGw/��L�殳{ʿ(�)��$����������:�vEc�i� �%���J䞜�k'�|k�Nz�R\鰼P8L��򷷟/l8Yl����Ct�$�����D�G�������c߻m}pgI22Ď�I馈�eCE��bcp��uZ!I��䦔�T�
�A%}!���Ut��H�i:U�ⁱ[��3\����_��AnWޡ�=��cv�1E��!Ƕ���J�s0���:�_W��/z�'�	e1�=IN;>��,���vI��m�4g�5�-J���iG�������Iy_�6�h�Dm�;<))@�I�� v|����e�p�3�l�ʒ�P�Pv�n�\�)�v����p�N��҆�����ia����r��A�����Uõv�-]2�O������{��W�3/�p��4x7�,#��M"�xz]>Y*�ژ��ͣG�:�b��]��R:�u��._lD��{$��t�Έ~+��Z��!Ry]
ZB�T���nHi�GAǿY�Y"?�1/bb�C
��R�����o��9c�
E��tNN��o�s����!�6^�/�\=zg��wn�
~44����]s�����@����;���=�}�g� d�_v�]yL����Y�OՈ�oסkr+z;7B孑���xi�m����O>䯻8;�Z���"�R��V=�+;���,ܗ�]�"�7�O��q��3�e�6Q���� ���sM�塹!�TC����L��˟A�h�Q!�?"�a��G��7��<V|��]������u`k�塢��t�mS7wǞ�-�H?�M�9�v��ߡ@�&}*��aPH�M|�:�;ݸ�h^�_�V��j�\�|���D�;SF�T7���o���rX��d�D�h6Z,�Q��K\��Ѯ8�~�������ݯ�Goj�WپڞYp���Bs�(f/�:}'$�H!���	��"Cb�*-BH��`E�"KNq�O����"4X���X:�������"3N���5!dl��<V�]I;HRH���k�����L���r�>;V�w� �\�ƶ����L3񥿃\���$w�1,��"W7f����149��,7�9`w4�,�~�c��hl���E���j���1#��%!��ω���Ȋ�������m�(����q~����Ew;�Ƚ,���$����{������Qd7E@��T�t�l�vƙ��h��uڤ������Q:�����,��1�ڬ�.F��0���C�����ƑPW�j���
}����_Ba��¡@��.���Ɔi�N\���h�Z�m�G<�l���z"+�c��/]6'4���˪����g7�bxt����rZLku�׿���Ї�;��ԷU �dd���vgf��k�SA�ifx(8��u�_�95ʮCe"l-����R5���ku�������͎��l�M #K��e�n3'�c�4*�
��Z�
k�P�I�Aid�˒���� �ra	��1<�]J�F6=~D�[�-l��E<�tR�H�6*r���q!�(���_S�3z���G�1me����������
lx3�n��6vU��W��q��>H8��P��V{����b�.`�P�����?�M����0RW�N/9�-���t��=�%rڻoZ4�@2B5i�h��vQ���G�B�6E(�W��]��X4j�I?M�1�$#L_1AV�j��>7��,��I�@�^{��7���^�C;2 �0����.|ԥ ��Gx�����)<8��m��g�?H��h��Mu���|�=����U�/���;��S.Z|�Ye@�����A��ĬZH�9^�Y���-g�����ﲴ0�ޞ
�{?:Z� ��7���k"R�]����曽��և� N����
�(��B�i&�\6,µ'\&�F��hz��i��-��Y��3��l���De�%�{,�k�4?1<�����"Z!N�� �K��n�?ry�ƎI���W�N~�T��~�t�-�L_�����Μ.'�%�q�+/�9��U���S�Z�2����18�0�X�I �"�v��L2M��0B�Q��|��=���g~0*ߞ8�7���⿲��4R/'�t�.�2?�܏P������c����wH�2\��V���o��^F��^���j��g��F�����,L$���7iՇ�񡤘���C9�c�	,n�x��n{��Oە�kb��I����}�r������6��# �f���&#�e:u�fp�,bV&��)X���ϳ>��"�K���U�T0��?$�%4`#Y�b2r�q��3��b%�rY#�d�Ũ&��m��c�B\"�d;�/��?���Us���t/ f_܈{Y�U�e�xv㞻��Pg�/��|PD��_\V'��U�峄�!*�t�}L`HD7��EN��qEY[�u;�s���<��J*��]�`���j5��,� �1���5i�bC#p�i-tI�W=�ga��Y.㣿���7h�C�G�x��$]���D.Q%K��- 6���\�f�V�����c߲���1&'Y�`'���^�w����Ŧ栀~�ȉ��/���m&Fj�ΜC�螌�w�5��nk�_��@%a}U�!ɠ���!�"ғ\���R�
���7�}� �\� @��00�2aʥZ���^�s�hS^e��Usv��kjN�0:�%��vxȀ!1Y ���������"���C�LB������5��c�)�_������KViKO!����R�@��7,������%�D���_�����Wm��i�:���|Zc�0x�0���_-k�mKl��ͤ/sLM�"9YV�Y��ij��Q
��S;�u���$��zTa�]W*�L�3]I�~��~i��/"klx����3 �?bd!L$4�b�~>�p��0d�NN��J@����B�a\�m�c�
�& 1 +�y�8�66��+�N[�Hwb�%����D�����uMq�m4��/�ىo����ϼj��.j��-+��g����6æ�F��\�4l�$ݳ� �+<��߇SJ|�Y9��#��:�1e8\ʵ�_.�?���c�i"� ._�{��i3�L�Q���^mT�q姷(�ڲ�Rq?��?>}_���b|^���rjA��A R��?��I��O��KA�|�3����c� /$�xkm�H�-`
���\7S���@�ڵ`��z��dJ��f��'[Cq��nԶ��u��T6Z>Cz�a�Jv<�eG�!ŷi.^
j$��owQ �2��_����i�����x�~����l�����_/�t3  ��:m�z��PT��M%�
rOQ�Q�������Б��<��0�S�!�,����h��1��:�����m^[��,��(i2KQ��g?��N6�Mq�Ǒ�hUI��[BC�ԩv�v��`.�N�Ub�v��+����g�ݛk�e���� tf!s��u�y[H?��M�G;A\Vy.Ӛ�Of"�Q�T��5a�G�w��a4a�m��X8�v��~�:I#ӲQ�7�C��s�1Y>GR����b�
�U{�q��[�|x�Kh4�EFW�s�7\_^�Fp�M�2�ѽ�WB��]�;��}��$��ƣ�~��;2�'��������X4��dE�;r�����Gzyyũ�����iF� L.&�D}��}V���Ug~�/
�-��u��m���0h� �,�n ̓VR`	l��%�ꤸE��l�2U�.�h.[g�H��|�|�.-QD�u�>k� 9 �Wk��E�*9�Q��l���� <����&�aq��u����c���v�M3��d[��'�>.�������S�z���4I���|�<�=��Ͷ��ȿ'�Cx����`卛���?-�����3��@�������URCCQ�.~S�A���kZ�^@�,�f}�|4����%�2�F�?
��I#lh�f�o��g�.ޠB��p�Ov0�n
3 A��Ex�9>KB"!�/*����mGO����S���*_����|@C
�X�z���ꋗT]�^����;b8��y�	Ww"Нh{X�ѕ:>m�>b���T�_���Q�gq}�v��Zhi�B��Q ���B8�	
X�J}�֬�iȿ,10��s�>�-�����5���։�ήb�hF�؎�E1GVs*���R#������X4�yg;
��]��׋If	)!�D�֥{���ɓ��1�!�Π	]+O!+��s��b��4=�W`��|�b}�l�EU����uf�
�\i�zf:���+؏��:I��4���TPݳG!�,q�=���ҁlΕ�Q�����FNt�B�ҷf�}�<K¡���/�I KXFG�����H(��M�Bc�I5
 �N��[�"z*U܉A��>+�`��O^��~�x��V�n=�^���H�d8*��cZ�
/�=��ʞ�1�KIV$/�Aj��3�Jnk䤹B��~�r��v_��ԯKfp"`��+﶑`�y+He�P ���|
�����|��C1@)�g���ti@G(��� ��~����S~��鈮1�y�A��5�/������}p��+f�p�z6�u8-(��A��J��%4 �˷v �9'"��`&��Kl^C�Y�>���!r�Q i���7K��%l�m��g֐��r�U:e%�&5���1��M�}��Vk�~$�R��p�h9��#b)�,�,gހ�OM�"t��?��9}���-vD!9@0�¯Hy~"�]ED>���`���S�a�'U����x3�fh��3,y=]9Ma$����.� -�R �ꎳ	�j	$���Պ��h7�Q4#�s�g0sI�7G�U&��y�����{����/���ѕݵ��^>{x�� ���½P.�s�Ѡ��\�Y��F�D���8ƸWsr�*V�7���Q�nVoX;�͊��.��~z)���e�m�(��qKi��4����̉i���uw���w  �<L�J.p�)aȩ�h�"��� r�'��)�\�
�y&������R���&�~KF����
��;���:y�U��2��]�iΟ��Ee�r�[8:�"�$Hz�	�7�l����!�AYFV�I�uj,)��t�� ��;wl��ۊ:ޔͷ�|8.k�9��)g�HKRI�����W�~|���
�;5eA �`K�I�EɄ�S2:�Ћ@J�����7�O�sϞ�����`fz��T�?W�n�pˊ�FJ��7>�74����>��m����C.��o����F�I%hn���tVuB���t�G��!�X�):n�&xe|��wwC����b��*B��㺠����Ì�f�
�<E5�1�r�p&�>?���j������BBMK�I��7Pv	
~A��4�w��/�+�'xV�(��Kh/�AyR���~�w�i�ǅ��G^t[�%}�Ů����\��W���0�̈́1 OT��c	�N!h���ق�1�����ٜ*e\�O�|%�:F
¨�{C����J6�a$5���c�MWljY�*۽ͼ������$���@��_�Ap��S�ۘ��6���d�����9�Ѭ�����~�J�{8�a~�љ,t���8���XI�w<'�<,��g���d�V��Հ6ֱݽ��Z��	���r�9��g��s��8;��;�_Gg�L��L�jd�unR�������L�A��:k��mޒD��(1K�F�qd���SQ�D,,�
Q)d�=l/�З�P�&򁏆���p���,�:˳��&�`��)}U��� �R�Gx�����@]{*8V�qP�W�%�$.��#Kf���~�ʥR� ��>���u4���s�j�й� �t�Z9-�D��,}6��pbȆ��;h���q�������7���I4��G���������.��B�a������5�o��A�������魲��܈�x�{����7`R48� .7۹�ı�3�"��0�Sg��ܨb�%͐����Xa��W�n��LZ᫿��%������bP0��9�!�VZHc����q����:�X+�|�R󖵧�X��
N�����ؘ��.��8��VZ��Ri��no��L��uƢ �����ɇ��0�tC���Td�'�d�/9�q��(a����J���J�cW������X�PܰX6���aH� ���/�D�+Ŵ!�x���a�NZh�<�^�O�"\g���mZr8nԔ����y�hxE�����J��,����d8V��Ci1$�TٽC���/��i�y�4�=�
^O�g�.��<D�n˪2`��������񓒹�nД��v��hMQ �0��L2��e.B~�C2�3�⇂=��A�#>iˢ�m.���hE�h������}���z�����-�!���'; cH�`=C�g���o���$W�O�f�\��;�?�TV�^{�A��8���j5Nr��e�R*IڲYg��X,������_a�@a�{v�5'J�nz&��lވ�/�S��^�_����0��8ß����Fi�Ns�&~�o8L��~u��.N�S��k�&���P΅�?��$�y���	�LLg$3�_���¬�yƼ�9gv�Ҟy⮽���h�۵��jv�.�c~t�LL!��N�g��!8q��Pa:��b��s�yJc�h	h��}j�Ҹ8�z�y���d�z�(<.��usa4�����ud@p��a&~�ּ�}�Q�t���ӺJJ��C)�IB�ړ��*SL�J��P�0�'URk��T��5��?����
!y+D���阋,V��K��� ފ~�N}�|j�y��O�-���o8�pZp� ��Iό�l��X.�ҷ��	Ah1�1�(���>(Ԣ�mn`��D3W�439C��u )$L�����2:�0R��V�C�a�ЄhL�(d��8ibx��D�)��P&,�����/W\�xN+}5��EKi��t�r{*�o���E�m�=��J ��o�b�D
[�����_�(*�#�5�ڲLŔE֌
q�@���^k��
���� Oc��!]���M_���)k�š�֞3�߽|���ᤘ����f�+�7�1��ނ�\Aԋ��9Z�_�����,���ϒ��z��H��
2!��B�P�e�r!B���L� �����=� `�ɇ��(��w��Vg�1��e���šAL�y�+W�V�i˨�z#��c�Q�7K�V =dx��N�K :�$�i��"�'ib�Ԭ���<AԨk����fwF|ժ	r1Ch��i�kM"����J���+�����$	�|R�<(��"F2���*�b�L��]2����ns<+�fl�}�3D�A��YeQ2�g9����~Cc��`�� ���w���ϻD���:��k��'!��y��������/������T�|��]b���� � E��p�����!_��0[A�/+[
��#Iݒ�Be���p��rT����:T$��P�odձ֭�!�'���R�j2G�F��e_Q��rފ��Yjt��M�� @W�4[D�i��à0T7G���rld�b����i�zT}"Mj���V��2*f�(�Ͱ
��4�=��i���h�uՔ�W_��R��(K*�����GZ}�Չ��u�{��,�߂�� �$K�O�<%������.���2�b�L,\O�"wa3Tx�,բ$'�����������z�K�}��\�"f��3��$�L����=�l=	����x�=ІX���s�k8
���4���}����ج(8bR�����Rm5���`��tF�u���n��^����Dt��o�
[%	.��G�z!W{o��h��Yf�%�$W�YĐ&�վO�^���|�eO�K@�%�m�m�(�tX�.�J�L�r�)*!CD�n-�>�my:JBʟ�����4��$A�q�ll�6�{V�G�Q�g���~NZ�!�ޫS J�J�5mu�E$eM��͐G���*nU�ߕ����3^KO�o�6%�-���X���.*��٦S`��/�0�}96��nF*�'/Ѩo�=����> �j�;�$�'��єJP���>�����"6�L�a���źS��nVJ���xlI�.�,���I��v�jџ� �46���pQ(  l ���E��j�`��S�u+�FU�(���Wl�!�G=�`�%��q���}�{�
l��1}�Io�"��&G�i⍌Q�����X����u\-�oVQd��f�ӽ����
��n�+$�,13�7��[V2j�p(vl�qJp�H��
c�q��!��O+<�G-֬6\��n�7�v�J�TR�;9a<���B��ϱ2R�����Z �e�R��l��;m����7�.!E!�5�ظlk��^�`��L��g�z
$���F~�ќ��Gm5���� c�N��,W����F���nn��'1��m:���G4U�Z_s�`�.F�8�t��<��R��G@���-8���9������X���s��*�-��s'A���d�*��Q@�C�s̗ ��Т�ѵ��et����跢�M�F�([��~�~���{�{'x]Bжʹv���- ֘[�iWN���ӿ�H�i��>���2�x�����ϫ�5�,�­,c#�彄�_Τ���͇ċx$\a,c7�� %z���9��1�)FUp�<���։�����*z�R�^0�)/�45fC�Q��\�2����p�
?�4#7P~CY���+���Gel륵*����>�z�B��:ѵ����^��GZ��~���
N׃��+\%�8�� E/�G0���)i)�vZ����d��,�I3��nW���5�[�x�_��`�U{�S�YN��\��|��v����Hܗ4;��®�����_��)i>�AE�sp�}�،���.^05{��R�H�uެA�p0��f
B��\ߣ��A����w'��5<�_���٤��o�)�"T��F'4HM�x=��]F�h8��]E7���"�p<�Z����R+c� ���h"���>ؠBI R�w4�ݑJ�p����鶂�ݼ�pԳ�A�Hr�n"W,��FĴ�ˊ��m���=��5�¢-����>������3r�YaP$�-!��n!�zD��Ȫ1��T/����"*_+Y�m��k#ڟLtП?���:��u��q�f����p�㜥�w�PC��.����q�8�;H����1&��2$���ش��+�r�0\i{	q0`�Э�5!T�E�6^=jQ�Q�ݚd;�ajb�	9�x���~�,q7oc�������ئ�/�KmÁU�!���eT�;�_T�2JT�C��,������_�w~O��Ub�~^V��VU�����Im4����d��]5������������*U�pz�ɪۏ�u�z�M�d��A
�aK��ʴ�>y�(ίM~���a��</�w���ʿ7��s� �-�8i 
���E)��3!?�r� �a��AM}A�Xg�"�N�.����_��f*�v\6��G�÷�^��Ȗ���0e�V�n@7*M��&��LJ��84d���r�S������S�kg����~����2)�]�F���8�!���\j�|ةy6�]�1��C��e�;�_���׃�'��50��0��Y��۳��=�b��_m�E݄�26|V+X^�
Nor�ШC��
�3�L,=S�mR��e;l��|��1!
�R���*+MM�_�\�8�#-��O`�!�7>S���z����Ӟ���� �~��my�}N��$���@�D�� b�/0]���,X�B G7�MM q���n@��##2:4F�x�ݦ�v(�׽�XJ2r�d�#ؼ�jvar IMPORT_PREFIX_PATTERN = /^@import/i;

function isImport(value) {
  return IMPORT_PREFIX_PATTERN.test(value);
}

module.exports = isImport;
                                                                                                                                                                                                                                                                                                                                                                                 �%�������V*�	Y��i�����;�'��t0 F+��Ld,�P|� �m9��ʛK��ҟ4����&������t�0S�D���i���F�=�H�l&i�r�܂�D%��z^1s�8�3:S���ڏ��n�E��7�a�`����s
U�7/�G�5���[f/_�A$�G�b`�T0Gj��>&��Iz��k��-+;%��J��e9�g[��B`�Bl���N���P�A�{-H@E#��}$�l;=I/WǊ/�:�ˑC��Bk��/��Y%C�-�������Ka�E�5eq��`L��i~p���,I��w\��J"F�$N���HI��f��!ġ�| z9�(�Vjc���9���=��O朙T&�.��d���c�F}�Y���0�(��9��u��ԣ��#��'L�Z�xdB�U���� h���e����t�����L��/l��)"=Α�"k�w���J�0�.r*����8.,��N�[�9�3�WWg����[�W2�#��%q �@Ct�
]��;������}�nJm��Q�R����B���y�����N�9ΓLތq����9`�M&\�w�!���dѻ����f����o��X��H/�lC�n��^�Y�Q?U
K�:�uJj'+� [v������x����+W"� 0X�E��p�Iʩ��bʍ�ǠpnI�J��aM�,G�d�7.5 �����AUj�~�B��2��I�f!#V5Sz�n�b#���>�(y�9�Ͽ<	ի�Y�-�R�Q(�Э}i��V'L��BL\*,�Ρ�����à/q0�X��lZWaA�ҟ�%�7|���u���=g�W�?Я�.F(��&��
6�nb�<�g��!C��II����Xb訛�̪ �-���'Ɉ�f��]���`���LJ:���
�3w�,J
��ڒ��Ws�Xp֘�h���,�1�h�����OU���=Z*�zm�k;��L��/�Ϟ~޷�� �0q8��y����}Äv�D��&���"�&#�˱���1kh�ϛW�Ge�rJW�3l����=:�a\��>܉hE �<�$&"S�嘑^J�R�$������d[zj7
[�gUwo�|����1{�uF\,�a�6��O��C�� c)����D���,��T�\�C4 d����L�_

�+Nw���V�����^�E}���X1�=v}&��8#mJ���Ϯ�0������T�"P�{>��/��RD�0�(o�]����!%o%GL�q�9uO,�uI
��ιR�o	�%ʢH�Z$�?[�!�(hKސ�+��r��ݳ�gh#����tz��������}���������ۿP�'�7<Cv;M�'2�r��S�M*F�n�s<�����F�^ç>}�T�cvY�����%N�v!�[ݩG{���4x/�* h��^����!��]�B�������E&�4�Ll�d:���X��+�Qr�)g�|��i;966%�k3����˹��X"�]&�u缇t�>���R���d��Z#±�O��ʠ�T<�}( ��[.	�^��.�?A��?'�Ov
��E��l�j�p;=&���	q]�T��N3�����������Qx���/�V�FE̀�t�1��Вܠ��'!:�ce���9I�
>�V���@ OT(�*�6�\MKE����#��S�:-n+�����ɺ{�P�y�̡�<o�����@Hs�_��ED.p���C�l$%����7}�S�/4�BI�j��R�;AE�8BH�ʹt�z����m�z�Ű5,�l�o;!b
(�-�}�I˪
G�-�Dۗ(H�p��Y�3���M2��eд�DfI�;)�s��L�c�G��,�����]|���j~F�Ŗ��q�h�*�ܞR�D
Eh`�x�i&�M�KJ���^%�i�(�}�$$��������Ÿ�L�='�m909&y�  ؕ� lT6y�8Jr���0�H[��Qz� v)�b�٬��w�Y6bF��_���V�/�w`k0q�ӛ��!w��۫���K������ܬީ|q�&���{h��3:�=�>�1Y@��?�ϒ7jt�K�(/�b�*!�r��9��ɝ�̠��1�cDA���]��!���@jQ'��J�҄��:�IuN�x����f��^cBMP�揑>� )��ʥ�wu�	� P���0�E�Ä�A$���f�N�.O"�"=g�K���=tL�6`hȊ~�8(W�9�Z��a�8�{��޲������Vf��EH/&�q+�&�,Đ�RЧv��O�d�~���z��p��v���ffo��⾻A0�WBhF�����' ��ȓ`]�슴:��rd)[h�n�m$S��N��/
��c���Q������.��v����
Ƅҵy�Z�X��H�w����~�#�iKn.ܒ�<��񥙣��լ?�ҧ�+>L��'-�]m%;,�+AR� �c1� �o�:3�bA!�eS���e�N/�|�Ζ)ʟO]9i+� J�W�ʝV�7 
W����t�I��i�J�������ɰ� 	�x��o+QX�?�GTe�s!$�v!�'�
)��y[�P��$^���;�R"��~�Z��n�.�T
V�q�VTS�1(���$Q��47�i{;�JAs��[��-�
�m��m\PPx_�)���)�OV�α����*� ���E���-w8E�6ss�0�w��CQ+-�> M>�8�% �Ȝ
���`�@UipY�.��%d���n��9��"Ri&[vGD `D��`��w��Ω��Nڸ���6j���,�3Kߴ�E}���0�q�~(��r�� �B�
��JMRq�������,��y�~��؁��՚��Ou�hG��^��/�]?U�$//dC`{��#�4"��n���z�e"�%�3������z���h� ۽:�^�Y08(���D@�):�������_��X��"�d���p�l���k�^~9�P���b+S�`�S���
s��FHk��Թo�hO'����p<��TB�ߊ��M�Tg�Gy�������?��=(� 2D|�*���>��E:�*m����*��sSX�A����&cmvs��࠹Q<Jk-��F�pS���]��⼠��*�������ڄ����������ql�~��kk��o �0)��I��,���)�h��l�x!�r
~�0W���U�"`����E�?��J�/d� �ƾ22�+E1F����$�yo����O�
�d*���w
��ݰ/��6�v�J�)�؛��dl�ِۄV����.�?|���B�W`J<�g�����?��>,r��1�|�5Jj��S~V9G	���@bM��}���Ѹk%��o-�?q���ۅ!�*��"�`��$��w�]�����k�P��5#w��4�J'������X�8$�k�,s�l��4�	��gi}�=���AIw����CxŧY���
��#j���p�,ɼC^&j����+�ދ�yL��Ĥ��"�)@�]���	ה��y������Vٿ����� _����rҘ�.
�Q�����Pv�[gL�b!��A��T������N���$��}kYX�p�ӑRb:-(���D�R
&\����z��#|U�tL�%��I�j8�4�Ξ��G���Mn{߽���"��t�_f�
Yꪘ�;O�o_�DsӐ�`{C��|�ˀ�"��  ��W�"�U>_i��RO1 ������/6�[��y�R�����4ϑ
��'��6�6�ي��]u�sH������ _�4.���[1�a�:?5<5Ϝ�ݵ������-J�9m�UlC*2�)�С195��b�
�Ni'�������Q�~�m�e|O��8��!��f� @f�*G��JI�L۠s�1�t�&m��_1f����1��JX��)�M\��ky�s @XG��H��L�6(_��~_<��fX�?OZ?s,�Z�-d&Wp�s�CVO���ys�稧��֗*�9����_,�$N$���_�
-�J�qZ0��mF��@~i�{��v
�L΃;g��F�$]�C_! ����H̚ 8Y8 �,�EN
L� ,
�����eyN���
J�Ǯ�z]2*�a"8y�G�s��h�n�v��Џ1�>���%�	��7o��wU�`:�N�SD��n0���#-9���}��+Q@�[*eTh�'�r~e 'f�1�~��2.IJ�1m�n̩�}�
&"����-0�� �~�����~$��bր��0��a�ȜVV�>cHe��j3:���}nT!{�׾ݴ����:B��	�
��Q��5�-�-l��S*p�
�e!x�1���K�p;Y��6�	�(�N�-���:�1:��7~Y�k����u�Y�R\�\�Oz,��j܋x���8��p�PD�Ё��Ǿ�ih
IK�U2r�FQ��o;�4���X�`0���̟K� ytU .浚7��	W նvf��rn+���k��L��([,-�%��vSA�g���Ͽ�f�0'�7�Q�ԅ��M�e�՜cH5ƶ3M�X��Q�g��p��b�kc
i�O�!���GA;&�0g}9��B��Wg�y�k�l�5<��Y��[Kק�>כּߤ�X�C#C�<���2d��=�Wxh�{�[�E�kD����[��hܩ�K�@��ՠ�����s>F#��J�p�YiQӶ���KkkB~Y��Ms��.*1�������a���hj9*Λ�Ɉ�R�q1��A=��e�T�!?���� ��p��NYa����N&D��'���&�=M$#Ɲ�I�U)��`8A�Tt!{"�R6�1;�Iq K�!��C�@�>�uo�_4wvi���l5�(y�S_�������f~Z?u����L�L,y��Kh�(���Q��F��A��a]�N�T}B��,��n����Z7�g|i�z��ѬS9��y�_����Tǆ�8ݫ��^�P�Cd��y�:�<��y{)b ���t�2�*��Z�Rw�⭇pMs���?�`W����6�`�S�zOkU]d&�@���ʄG1�����c��|Q��>%M�'>����g����?���<G���Ԯw>.n{A�8�m����!�֘r��X��0ǑُSe_�����4>�\�ͳk��"L�3܍1�Aj��-u�\ �I鲅�qn�:Ƙq9z4|+����5������
���K?9����l��U8l4�]H#�A��1�2�q�_ŠP��w�֯��4��L������=dȉ�X��z��#O�����<�_�!�N;����a���?��n �Ry]�3t�(D��hjC��w��"x� ���@X�� {dF_8�������.�\��f�φN���km���nW��Yz&��IJ��v���Ү� ,�D��"�z�5,4^4�Gԙ��N�M])Q^��8m��c�bز���/�ǵ����?]Zbr���"Q����(�"�����!E�$��f��Y�b?Ik-_�9	�U|um�j
�j�"}}���0 �qҥ�j�NP��k!�l�F��}�Fk�Opt!s�l$;�5�]Q ���p��j����6���. ��FN�X�]5yY+[�V�[�N�t'7!�mn�o��.�kZ8'J�̙�W��?�)�DOGI�N���4�՛��A�H��
I�p��WI�����1�X�i��jr&���6��ѓ��E7'2@�rؠ����� ���RLf���2B:�7�h$K�������b�
��r"FW��zv�XF�8�&~8���-�WR�
E�,��EL����'�ه̻�������k��Plw8��}�<C.��(�Aϥ'�v�6��|�r�/�SC�8��gog�f����u�����/�� @��-�P�`h�7®;4�ϊ��쏦��XR�1�<��!��%Z&�Z['_�}kq5菬�u�	��G�����˓��I�@V�`�o�t��P��:E&��Tp�d���M�T�^�n��Q_�=����l?���܊@��g���i�- *�g�����5)�A�6�����O�b4���h��=�GE�aK�*��(�)��K�:5�t(����u�L��R%�`��g+^�&�����:�������P�X�^Eg@B!w\�[�(�K
壏1�L�7��b�T�A�IӚ�;mǮyjdD�f/��(�N�����*E�\^̪��hH������ތ@��o�3
��	o�-�?N���K?߳���
w
�T���{;XX���Xg�s?�dq�@V�|�忑�s� rU ��<��uX(&�=-�i��cͷ�@�8���R�[�����ֶ�+�Q���0��G.F��U�*YQ�`X[�̒�;ZI�a.S~Pxa��� *����ӬAܙ1�ROs瘖:d���Vm:p�Gc3��\ǡ�@B���G�<��.��B����PZ�$A�P�o�r��>�B�|�
A �?�R��Ťx?�>��\��T�����~A��`k���G��u�Wm;�6��u��buJ!t��/�y>N|I������ �M}]������P��
��u��S�=�|q�g'tZ��3���';��ars�˹
0��f�y����-�&D��ſ��S��zKN�c�����av\����?bn/E�j�XFM�U�ہH�x�� L�. �ZT�Z�K2Q\V�b��pj�g�2�>8����0�B����E�*���K�>���i���\��
 0u�0ݙ�<��{���&�|?RrK����Q�0��{�����e�wx���	N/��Sme��e�t�%iZ�w����3�!�C�PF�i)���q�$���YI��G�W0����n��������n���Jqw�Kqw/���^ܡ8E��m����L��ɬd�;Ć���d�d�[t��+��w�Yщ��W��z�E�r��!�"i�R�Bj���\&�w/���)�hBѺ�j��y���$a�`�㳲
�깠�&���:8�YL�,�ב�o��^��-Q������у���?�a=�FhZ�v]����ʒ�K2�b��Ȏ�������k⚄DP��6}��+�oC�ω�u?����Q�	���V������~��$���ې�Bܒ���<�ҏ���1p�c�[F�b)#��~�[xjE�dک�w�(�˓������B��B|�kҫ���2Nm0�1����@UW��~GT�4^�+���;|Z��l���?�|���[6�L�m+P��`�_N�Sy� ��UDJ�p(z���Z��~��K�0�DRw��׆�D:[�z��dw����d��'�OWך[zv�����6�=��A$W~����I��F������L��`(��?�+퍵�-�T���Y�LxO���0�6�<̰�?��#A Zx�u�
�>ڧC�{O�qFYݨ�]�t�,$,�RS(w҃�65:�1��r��mKF�qK_�����m�#�`��Ux�(�⇉#x��t>淬�����D���
}�8�n��uIJn]Y�}ȳ��MS��|D#S������m jIm��KChP�0�5ʥ�U<���i���#<��:U�������N� θ|�Kk��JHL�ꏕ�Uמ<\���J��a?�D���#e,�o���?9���)
����[�
�'�U�J��h�*��^g�B�v.w+�)H��C�0%Ӧ�݉���$�"4 H�ݦ"��0sD4a��q��wʡy�3bN_���JMd@���E�[Z|;�3,k�W&�">J*#u95F^~=G���
W�j4�K/z6?)Z-�r���'�6
hTv��w��PUG�_�Ð��b�S�rƀ� \:j�4�2uQ�-�^�~���p��&Ȯ����}�,fa�U��1�N��XO�
�(�I�|S�\du+�p{]<�q�����V1ax��2�ԥ��'
/eA>|<���7����.]]��Sf�%E˛��)s�P��Z���������I��~��å�(4�$w��:DLw9d)!,��a��w������$�-�Q��U�pv�+E�b? ݛ��M�j��à�i!єi����	�~V.}�Ė����z[^�^g�"���Պ���@��R`x��PJ�\�P�H
U[���P*%=CV�[DG�aoU}3�&��#��ƛ��:O��Ui��������
<7hB�@!��F��������H����g�����_�^W(���c{��VvI*���"-���k�&w�-�����P�y����)f_�G��7�N�םf*�3۝,�����c���+!D�b�K[#��Ml�Q�}�o��F��تy�퇚(;+)�4�*[#q%/U���
�
      <td align="center" valign="top" width="14.28%"><a href="http://pustovalov.dev"><img src="https://avatars2.githubusercontent.com/u/1568885?v=4?s=100" width="100px;" alt="Pavel Pustovalov"/><br /><sub><b>Pavel Pustovalov</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Apustovalov" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jrparish"><img src="https://avatars3.githubusercontent.com/u/5173987?v=4?s=100" width="100px;" alt="Jacob Parish"/><br /><sub><b>Jacob Parish</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Ajrparish" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=jrparish" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=jrparish" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://nickmccurdy.com/"><img src="https://avatars0.githubusercontent.com/u/927220?v=4?s=100" width="100px;" alt="Nick McCurdy"/><br /><sub><b>Nick McCurdy</b></sub></a><br /><a href="#ideas-nickmccurdy" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=nickmccurdy" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/pulls?q=is%3Apr+reviewed-by%3Anickmccurdy" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://stefancameron.com/"><img src="https://avatars3.githubusercontent.com/u/2855350?v=4?s=100" width="100px;" alt="Stefan Cameron"/><br /><sub><b>Stefan Cameron</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Astefcameron" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/mateusfelix/"><img src="https://avatars2.githubusercontent.com/u/4968788?v=4?s=100" width="100px;" alt="Mateus Felix"/><br /><sub><b>Mateus Felix</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=thebinaryfelix" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=thebinaryfelix" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=thebinaryfelix" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/renatoagds"><img src="https://avatars2.githubusercontent.com/u/1663717?v=4?s=100" width="100px;" alt="Renato Augusto Gama dos Santos"/><br /><sub><b>Renato Augusto Gama dos Santos</b></sub></a><br /><a href="#ideas-renatoagds" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=renatoagds" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=renatoagds" title="Documentation">📖</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=renatoagds" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/codecog"><img src="https://avatars0.githubusercontent.com/u/5106076?v=4?s=100" width="100px;" alt="Josh Kelly"/><br /><sub><b>Josh Kelly</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=codecog" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://aless.co"><img src="https://avatars0.githubusercontent.com/u/5139846?v=4?s=100" width="100px;" alt="Alessia Bellisario"/><br /><sub><b>Alessia Bellisario</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=alessbell" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=alessbell" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=alessbell" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://skovy.dev"><img src="https://avatars1.githubusercontent.com/u/5247455?v=4?s=100" width="100px;" alt="Spencer Miskoviak"/><br /><sub><b>Spencer Miskoviak</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=skovy" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=skovy" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=skovy" title="Documentation">📖</a> <a href="#ideas-skovy" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/Gpx"><img src="https://avatars0.githubusercontent.com/u/767959?v=4?s=100" width="100px;" alt="Giorgio Polvara"/><br /><sub><b>Giorgio Polvara</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Gpx" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Gpx" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Gpx" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jdanil"><img src="https://avatars0.githubusercontent.com/u/8342105?v=4?s=100" width="100px;" alt="Josh David"/><br /><sub><b>Josh David</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=jdanil" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4?s=100" width="100px;" alt="Michaël De Boey"/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=MichaelDeBoey" title="Code">💻</a> <a href="#platform-MichaelDeBoey" title="Packaging/porting to new platform">📦</a> <a href="#maintenance-MichaelDeBoey" title="Maintenance">🚧</a> <a href="#infra-MichaelDeBoey" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/pulls?q=is%3Apr+reviewed-by%3AMichaelDeBoey" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/J-Huang"><img src="https://avatars0.githubusercontent.com/u/4263459?v=4?s=100" width="100px;" alt="Jian Huang"/><br /><sub><b>Jian Huang</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=J-Huang" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=J-Huang" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=J-Huang" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ph-fritsche"><img src="https://avatars.githubusercontent.com/u/39068198?v=4?s=100" width="100px;" alt="Philipp Fritsche"/><br /><sub><b>Philipp Fritsche</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=ph-fritsche" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://zaicevas.me"><img src="https://avatars.githubusercontent.com/u/34719980?v=4?s=100" width="100px;" alt="Tomas Zaicevas"/><br /><sub><b>Tomas Zaicevas</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Azaicevas" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=zaicevas" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=zaicevas" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=zaicevas" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/G-Rath"><img src="https://avatars.githubusercontent.com/u/3151613?v=4?s=100" width="100px;" alt="Gareth Jones"/><br /><sub><b>Gareth Jones</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=G-Rath" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=G-Rath" title="Documentation">📖</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=G-Rath" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/HonkingGoose"><img src="https://avatars.githubusercontent.com/u/34918129?v=4?s=100" width="100px;" alt="HonkingGoose"/><br /><sub><b>HonkingGoose</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=HonkingGoose" title="Documentation">📖</a> <a href="#maintenance-HonkingGoose" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://everlong.org/"><img src="https://avatars.githubusercontent.com/u/454175?v=4?s=100" width="100px;" alt="Julien Wajsberg"/><br /><sub><b>Julien Wajsberg</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Ajulienw" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=julienw" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=julienw" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/maratdyatko/"><img src="https://avatars.githubusercontent.com/u/31615495?v=4?s=100" width="100px;" alt="Marat Dyatko"/><br /><sub><b>Marat Dyatko</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3Adyatko" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=dyatko" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DaJoTo"><img src="https://avatars.githubusercontent.com/u/28302401?v=4?s=100" width="100px;" alt="David Tolman"/><br /><sub><b>David Tolman</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/issues?q=author%3ADaJoTo" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://codepen.io/ariperkkio/"><img src="https://avatars.githubusercontent.com/u/14806298?v=4?s=100" width="100px;" alt="Ari Perkkiö"/><br /><sub><b>Ari Perkkiö</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=AriPerkkio" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://diegocasmo.github.io/"><img src="https://avatars.githubusercontent.com/u/4553097?v=4?s=100" width="100px;" alt="Diego Castillo"/><br /><sub><b>Diego Castillo</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=diegocasmo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://bpinto.github.com"><img src="https://avatars.githubusercontent.com/u/526122?v=4?s=100" width="100px;" alt="Bruno Pinto"/><br /><sub><b>Bruno Pinto</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=bpinto" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=bpinto" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/themagickoala"><img src="https://avatars.githubusercontent.com/u/48416253?v=4?s=100" width="100px;" alt="themagickoala"/><br /><sub><b>themagickoala</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=themagickoala" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=themagickoala" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/PrashantAshok"><img src="https://avatars.githubusercontent.com/u/5200733?v=4?s=100" width="100px;" alt="Prashant Ashok"/><br /><sub><b>Prashant Ashok</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=PrashantAshok" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=PrashantAshok" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/IvanAprea"><img src="https://avatars.githubusercontent.com/u/54630721?v=4?s=100" width="100px;" alt="Ivan Aprea"/><br /><sub><b>Ivan Aprea</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=IvanAprea" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=IvanAprea" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://semigradsky.dev/"><img src="https://avatars.githubusercontent.com/u/1198848?v=4?s=100" width="100px;" alt="Dmitry Semigradsky"/><br /><sub><b>Dmitry Semigradsky</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Semigradsky" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Semigradsky" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=Semigradsky" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sjarva"><img src="https://avatars.githubusercontent.com/u/1133238?v=4?s=100" width="100px;" alt="Senja"/><br /><sub><b>Senja</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=sjarva" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=sjarva" title="Tests">⚠️</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=sjarva" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://dbrno.vercel.app"><img src="https://avatars.githubusercontent.com/u/106157862?v=4?s=100" width="100px;" alt="Breno Cota"/><br /><sub><b>Breno Cota</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=brenocota-hotmart" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=brenocota-hotmart" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://nickbolles.com"><img src="https://avatars.githubusercontent.com/u/7891759?v=4?s=100" width="100px;" alt="Nick Bolles"/><br /><sub><b>Nick Bolles</b></sub></a><br /><a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=NickBolles" title="Code">💻</a> <a href="https://github.com/testing-library/eslint-plugin-testing-library/commits?author=NickBolles" title="Tests">⚠️</a> <a href="https://github.{"version":3,"file":"createDefaultProgram.d.ts","sourceRoot":"","sources":["../../src/create-program/createDefaultProgram.ts"],"names":[],"mappings":"AAIA,OAAO,KAAK,EAAE,aAAa,EAAE,MAAM,kBAAkB,CAAC;AACtD,OAAO,KAAK,EAAE,aAAa,EAAE,MAAM,UAAU,CAAC;AAQ9C;;;GAGG;AACH,iBAAS,oBAAoB,CAC3B,aAAa,EAAE,aAAa,GAC3B,aAAa,GAAG,SAAS,CAgD3B;AAED,OAAO,EAAE,oBAAoB,EAAE,CAAC"}                                                                                                                                                            �X����O�8~������,�	��˴�n�LE���g�0f�����Z���U4�\fL��yD������/^��ܿY_�3�6��蘰��8P�I5$}r8����
��!����ADc��,��de��#y���Z6v�_�X×"�Xx�	�8)�1;]��?+h�0ᨖZ�f���(a�=
�� �h�'�p� ��	5��"Ͻ"�g&a|J��L��R$�d��h$C�Q��-ܙ��Ф���
u�B�M7�" �-�a(n���TZHԄ�w�� �pA�'��˪~lPy>�Z�3��F�g��95,z��cٛ�����~I�G�@�����FM��
�x�X즆�����
lG��f�T��?�=�b��?=}�V�����쎃�1mN%u�����j�Qų6��xL�sS�-��m������W�b�L�tQ�]�8��ظ�����#O  �.��/��H�L!S4�j[_����/=x���L�7�]�n��H�$ M�w�����a�`���S�*)�E�
�(9���M��
G,s�{�0j..�Y��J.s�i���?!C�����&j���7��,��Y5uV
���)Ȣ��  K]���v���5���EhClC&Ccn�c��qj��B�!P����D�J���%���.?Ӗb��X?�B����_hwƓ�E�}Y��LZ����`BO�&����Ed��
���H�T :w.��#�@��(f\l27��q�����Q�ue��Q���ƭ(���Y�Ne�٬7_ڄ����Y����B���̥0Ҫiŧ��T��9���'�
���=7��^	���*WG�W����7�~��Cf�3�gg7<:��N$Of�D뷲�7df�����Wro�ɖpÌ�~X�}��r��.e��_D� W��6�ʕ~T�o6;� ��,��:�
��S5���<�!�`L���D�B�_�H�
GA`T>FUE�7������i�DH�;�O�I�k��C�,������O�TЉz�oj��)�T8�dVk���#�
��h���ur)-�����F������.7�X�l}� ���c/��*��6��$�4;�w���\�AO��� B�����˾6M�]���m���bD��B�Y�dd#xQQ/y���ܹ���t����������0�
D?��w�?b��zk{�!U���룏M�0��~��_�qΟz �u�ui��N�)�d�`��@'��Аk��m#v!C��./�B8"��޴A2����~2��j�K��}8�$�L1�(�ޅibH����̡�㙒$��w�D�yP�&
i���L]���fݷ���m���(�	4�	H����9=v�]o�7j�\��T�2U�[]�T5PcU���uY��/�
Yr���y?���?X�`16J��2~DA:��J|��FR��)�_K
<�ꗪGKgF	����c�Eݶ/��N=(
�G^(���2b2�f�՞�j�S�T���%Ԡ�0U�?��fU#�T�3����- ���a!ɤ�_v.b���l��Q��w���I�x԰o�u�B�l�M�䢠3R���<a�e�+ß����;NџK_r9���#�t�����Hy����ݕ�ĕm��^bN<�:T�մ,�z&3�f�ZbӋpʏE�d��!)�yR�TFEO�����G�d��c���FߩX�rEB�f<ni���k/�n,�s���!�f��>�R�ٛ����j��S7�^y�m��o;��X|@zO!�/��x0�o�ȜR@�9	)	��1�B7��?���G�u�ʱ.c$�Zi��������ep�<#mI!��s���W�9"��@.u
Av`A���P]�1�m`Sd�?����F�|��
j�Mp��?�g	F�'|�����H�n
�2l�vŎ�o���
sX����� �ٰ�0ZOK� ��`����o���U`U��6D���-0,���w��?�cN��R;�P��.p�#
�ԁ����l��h����I��a�I����g`(i�7�0`���
~QDy��`)�F&��y�oPw��T���23��V߽�+�Z9e��p��p�]��7b�����#�Z:��@J�C�N)Ե�I)!�&�@-J}T���LG���i&�%c������d�,^v��D:�@���2��Am��$xv"�A�T��,���m��t{9�3�)ґ�\��NM�y��������������`��;�_��ۤ{��(��`�$�64���h�UCR-J5J`�NJ��6ONnڴؖ�'�|>
��P<���X�<=�f=��FO�Re3� wG�N�̲*Hu.;:������>�ɵ�Ii��WZ�p��s"l�]`e�w=�(<�y]I�	8hgf�P�;�̧Vo�> �b5"�'���py=]zV7�9��d��'>�qd���ƛbxE�PǾ������Ӝ���|XDHC�o mJ���ӧF�S��p^���1}�r�!1�e�*�L[����X=*%��\�f�6���� 2����z��!�� t0D0�@@�\(
�Q�GoW�a'�����Z�8p�^C���_�7��88��Y#|�����2e�G*C�����!^�G�f(7>R�q�����.
��c���ZG�닾«��[J��]�Q&q�4 ;�Ӗ���{|���]����S�`��M71�/l	1ƫ�����f�0���m���"2Q�;�|�36��<�y.α��YK��
'oA��T��Z�Y��m'�ɜ� �77�.��J_5:���l$�a{ZNqR��%ί�l䅅��Z�+;��NA�'fP�5��$ui(�7�ɉ�:��o�>
��!�Y�bۘg���d��q_`��>ʈ���	��Ȉ(ٍ��j�C�ϖR:��k3HB�F%ɔ$�e���X˓�p��Bh�Io�]�b� �UJ�C K/�ك�f�q�dV9��KǻGL���"�S,}�^D�/�Ў����D����A�7Q����{��,�\Y��$p����O)*���!�V�S����E[BK,�vr�Y�%q}��I�'�K�%�7�F��)����^���dȇ�Q��>����t���/@�ܲ�q�A���+�>���"(�AP;<�}/��U����q�x%�%����� ��ϫ��{�f�u��8"��k�G�4�&;k�y���`����mG^5on�^����PV{���JZ7!�R����xS��W��a�p�+$����4����u�����-�1<1Z<d����7��N��am+�o[p�pxV��W���@
Lh#S9�������eFW�ʘJ/y�~dM��?U�����K4�����w֤XU`r~h�&��J�W�H��,~�1о/y�+d?LKe@�" t��\.�Q�
�����_�]�=�ӏ��R�_+ԕ>��
�>��x'E�kТ4+D�M�V�+� �:;��Ck'�x����4���w��iͫ+���uy�{/���(�/��NDc=�k�%V �/����+���2��Mł~N�=����.Z�t�r�g�J���_�h
�PXv2Co�����m"Svr�J���=�%�Fr�_:,XɥN$~/�^	�&ZccMKr�}kdpZ��bT��5�0���d�
���ǐ}�iӇ>}�&|�DiŰ#�o�sn�1WB��6���vh�ñ�w���<�3�}!�!��������S�+�čضR�.��¾Tv�-j+U�Y��7C����8LҤ�G����:�ei0a�O�p��7#��d�A�ҭ�����?7�YMF� W����"hrv�6�|����+DC��P(1�����@���-��*�{����G��.�7k
��:\�w�����FK��P�/�~X<2����&�
��l�J���y��v!k%��-]S"��`}�l��x�;j�C�
i��� 7AIB��0_��`	Y���ne��$�,E ��ad�H�l�z�xq�8*+�~nY��d3Ȍ�<Zڗ^�������P���gnv���&Kk��]>�b'�`*�@0�`e�0
�t��;m�3��`,=��[�Y���
��5��Z�,�4SU�M�^�ד�������]{+2sȹ��E� �¡�. $���J������|PS�MaP	9��s_��)���/�޺K�S�%xx�Fzi �*���3��ʁk�c���� ���{Ϥ�����ܩ;�ZP�锥q�]7��oI~/U:��wl^��@f�>��0�Ysf���U˗����<D���ӹ�/�`W������O�"yK�Ĝ�-�#W��xU_�ʴ����Z�M�
��x�r[+ە�x>�e� <? �j :F֚����ڨ%r�PSߣ	��@ɽ+ZL�"�|�W�Wz��b���"�*�j[l�t�i�x`��_����?<����R0f���������0�yb�����"�%� �����t���XN����aW�A�+>x?����L���=&��.@��/pP1�  �Ok��rfN�S�0ۛ�$ �Lu��ѐ���܁�v�x�:7�f��,�/�	xŲ��f�b���|�"j�Cr�����Y/]*V_�I�?�& �%J�����?���NYהW��dY��S&�%���Lx$���p��������A�dS�8�7�G��aګqK5Qx�~�[����1���A��Ő �&%����UT$����o/�6#i��5�p�������c0?�,Q�!n���P���˟H� � <��J
�mO�=����	J�(K�*k�¬2ʚT�:�\u���WGri�����^�xlQ�Mx1]щ���:ǻ)�)����A=)�"�/HZ�
n��-+�D���b��mDLl^+�oE�8͗_5�t8
�ƛq#[<q)�R��.A�U��2S|�#�qM5]���b W�J3�\F&B_
�)4�X��m�G��[FMZU�8N�X��y}�ߍ0��Mq=��K�}����p1�MfǽT�'=d���
� �x��`�A����UC��l&�ȇ��T�'�u?��<CB������s�%����L$���I�\�@����iт��=>���}�Z�G���)�h�����s�s6�Q����]z��0�y�,+�a+��!3%�bV29'P�������(N1���s�ݩ�[���7��0TbP���������E�2@ފL���%��
A���_��[+�%�K� �8�Kv�,rHI���y���#�'mX�d��\����Ώ�����W�E�8__��p�����C�����FA��[i�}?��=���s瞝���d�_��޻�Ѱp�����D�8}���K�;��y����K*��F
`�Ӛ�w��g9.'�͕�w�I�}��z����)�Rkr��f��l{m骸��{_�2��I�t]��dVM�'�3i� �ʳ1�HS��]��F��BO�*�ɳ%�Ϯ�"���o������J,�[b)Fb�M_���:���?b�(��[Sei�i�a�v~�G��E�ê������XJ���������(����m=^s\��a̗D�y��]5�4k�H�xБ�HDxF�����G���An�_��,��^\��*��o�׳�������> ��%'[�M8l�N�$��z}h-3�9�P�q���h�����x�[|����c"(l��<�Ӱ�����.F�U#�ͫ�"M�;�Hk����%4a��C�1�{`f�T��)fj�E�f�c���ŋ�
���r�2�-���
�F"�6��I�� �z�Ơ ��I�g���r��ZGJ�v�[G0�p�L��.
T�#u�����%�5I}w)ĝ�u����_pMb��l����qe��aD���T�[�;��Yc��
)�����z*'t%������w�o�����q}m����gJƺ�N��kl/Cy��S�~��
��`C�S�	�_R&<'Hc�y�ݺ��)�uK6(h��Qa 2ؼ���k:�;��-�td�
2���S��
����k)�A���֔dY����D������i	$h2�2�N-p4�l���q�5� 0��g5u�^�O
Z�;U'�+��MS����Ĕ�-)1�~�]���s��!���	 J@����y'!x��oFO&�ԧ©����u���[~�P�S�x:y�*n�o�Qz�#�@ ص�{���]�"�qS�jc����DEs��c�ms1�PZp�-N�!U��HŨ�u�o9߱�ۥ޷:b>C��D�.�ӕ�?�����)��7|���e��YYڍu�0e�:�j�K��w$�x��d7��>��c�K���<|~����#A-��Ҡ�Y��>y9���")e�5l�%'�JBU;� ,@[�����_X:�Y���|l��G����Q_:M~��U�(�9�^�l{+�|n��b ��54 ]4�aZ��:,�P`���KŰihPf�������P�qSg�>�@��x,v�)ȏT�iH� B�P�^�$l�oS��eMMf�Ύ�����nf<���� ����\�3�E�aE�Z�娔����Ѱݑ�y��_�<>��A¼t��Cp u���/Y���q)b�)��묤�׶���NVL�}�Z��`C�Z�fq��������rx'@/S!��LMͤ�A�����h�S��'��3�;&ĵ�ؿE�? ��&�Vj2�j6B96���!�F�M>��8N��1���N�aT^y�A߿���@Pŀ�h��Tw��M
KpIkAg���A�[�w%u�r��{�
_ϯ�~���&�*�S��e�����О
"�dc`E��̪�~�0��juu;,Z��H�!)�卺���<���0=��k�Q�������R(���Z�g]*L���Z��F�E#�Q ?�7;�|�ޓ�^�lE%�3΁O����.](�*�~�z�}�����kP#J�OIQk%���Їj�2Q��Gmg _���U��{4Յ�ע#�l\�0�M�7L�p�`p�j�}�ng�8���k$��Ij��
ˆGSH���N�L8w��.����0v�������p�[�ۡ������^���jD��`��V8(c�<���VI���m�TCD�<X_v�,7m�-q�� �J�p �0��ge���
�k.�I(���)4�_���55Ea��@��_�p:���q��8 �����wxP
k�������H�����gĉ��%��ԋK���������_|��m�����=o�z���)87#I����P�D)eA�
��	���JO<�	)��G�bf3�p:�\A7�n	)�����9f�8��7�uM���|F�mZ��G.TL��D�}�` ���9*L=��ӊ���~�9*��:&���Yq3=p���������I��ٽ�$�}�Xm_Et �>s�EJ8�&m�k�8�1<Z
aB]����w��5�᳀��x����	r�	����&���f�o_2����r���/][FbHKC
�h˖�=c<���5����fn�Fz��~m��B��ߙt��T~=|]Y����8�x�����	��Ğ�>,�Lu�a��I��S�M.+�\A�s��G�ʆ��?Ka�b�:���8�k ~T���S�$�ϑŰ�aٸ/َt��bB�V=MY�$��"��  �Q�F:/�$�����&%�y�A�K~&6��#�j1����Q�����?��v4�&��K�X��yE8����r�V�bf�RB������i���$�������wR���#�3K ���>���ꔶ��-H��h�q��G��^�G���݂��m<�a��a	��m��D�W���+�Q2%�������!Z�8�Ƥ��j.2�M8}�央D�C�6�����1}Fd1�sb(vX�u!�V�=Lf�:�o���[�l.<��ܗ�P��p��❯�~ټ⼚��2Q���d������ag����*��G �5���b�+��z�ZAƋ<��be?m_
{��D C�"9���s:FH���� �����U�=��0H3����Ӊof���)^q�kV}��a�o�Y����e#&�t`/m�u%Q���q�I�d;M�'��r?�o܌V�d	@FL�N(b�U�V��^(��guħ�|��ΗJR2U����>V ���K�c�R��
ϡ�GF���%5Y��i���̨D	�?/�ԥ�&��_@&���G��W�vĳ��AH4� ����s.�6�Q�!� ���Ә�k?\+��Ԅ�z�RA�?û:�g�p���B�u��� ,��o�������@�� �G8Aj]5G Y5Z	��[I��Q�9Z�O��aZ��奺����'
��3
~!�� '0���;X=/�������#47_uR4�#Q��PXTQ,��ZC�%���c��;��]��>-ĎCM�`��W0���F��� �P��C����=���ō��ʑ��԰?�d�����#�X�ډ�"����A/6U��'rdf���dtxy�UN���=�'�>Jb�+s�~�=�$���P����S�o4)nn��}���D���	��ߒ����W�o
��5hCp�|T
��� ��-
���f�CHMG�==��5��We��@���#�E�|���W�g ��<2܎F��/�Y�S>���" ���M��}�>�[ei�'���HU0ڹ�	�9��@qbk�%���"e�Ýe��c���o�U��:��;Us���h'��U�8�|�y�4Յ��[�\V��@`9ϷX����,�Y�������/K��(��~�!�/[�2t�D�'8������C[��$s���*��c�0xc�&�\����\%�~�b����;X���g�r��c��D��i���W^Yi�Z���Z9��>�*��V�w ���j�ᴱ!��F��,d*�0 ʛo{��we�
�@H+�b�j�x��CJMD�1SE�k�����q��q�B/��]��QQ�8=&��αr���`�t�,k��Ls�����6�����3d9ɾ2'g	lբ�3Y�W ��:��� d&0�(_3���(�?�#�*)��ũ ��a+�CB�xΪ���[��D�^Z�?q��ͱ5����5�!�����C��-�5�w/B��ibD�d�~���d�<^�4Z
�yn�/��&�TA^������6#�����o�49��~޲Ȥ��)���B�Sѭ�1�m;[x�iɮ���b�M����hp6�8�-$[..~F}Jb�J
դК\~��2�ϞW������m=`�9,�V�"Ni��'y�*��i��£l�c[��6��z
�NE_�n���������4i�~N
���&��h��7��+�,�`]C�Cd��/)�i��%�ӿQ��6g���}�����S�JJB��	g����6�Q��L�aMɬ�����R���������"�5�1@��E��O�����S�޺8/�,�9<�)���iܞ7��Q������m�|ɟ;?<6:5EZ�j��7�c�8"���>��s.\�~|�x�;�
C�:��f��hõq*�� �d���W��!Z���"�P�*S��x��o���'�D�Z>�s�|��pȳN�+�5�r�p,���~���e{����"_�]#��p�*��/}�:�@L��b�?�`"'>�m��e���`賮�/#K����1��9a�����EK�,U���t	���4���t�4�2���
��?"� ����lS+t��Q�
�A:z��zok���b�@�X��~@�����P�-�*9���%W��b�A��)�)R�����&�=��;�K*���d˩�_{_�;Ϥ�zK�$h>G����*��~H�|���L�P�G���_���v���7	 �Çh���5:�� B��uF�����8A��
�~h���I������#������Ϝa�9t�m�!U��$<)P�'ZNH�L�>�]�n��Lq�:�w�+�b�"g����Ť����ذ!�so#��K����NT�}i6[(���6'% �Ia�b��*a�˱?n��Ƨ4�ؒy`�A�t�a��$��b�c��Qa�h�
}1G@� "ٙ}���o��M����0��\w�M!����@�L�`5IS�osn�v�8�M����0�K/����"��˷�ӳǝw6V�zOX9g{��"V]��!nNZ��>k�}I��88��� @���҂�m<��*��[3��D'����(�n����1<v��b[��>�!��WCܰ��k+�r�c����)	���L�
�Ce_ 8nol�T��8�W7m�~���{7��~����4ˈvi[�uP�zg�Û�'�M�)E�tr^5l�8�֬�_y	����'ɴ�S/�pbaC�I�[3�V��bi�K�%��
���S&V.���*`�K�b���g����a��}f�\kW�=���Sc���tӹ*�-�S��z�zܾ cu�lT�q�1
���}=7��
�F��{��-�}�
��i&KSB�i�����}���p�KoGp$2�`�{i
N�/^%t�˃P����8.�MsP��@��Ai��G��X����A��F���\hs�3Iα�!Y��;��K� G;��fF�jբFQ�\*�5��&�	5h,ǀ5���@�W��O���a��]<��jj4�k����j��U-3���L>��e���w �H*Z��a�u�ȩ�ҿ��N�Q"��kdq�/���$�a�� ��$%���=��*8n�
KLm֞���U\\d�̞ �KP��
㖗�*nO�=$��%����wtgE��4��|}���W�W(�$m�6׾0�������r�펐
��׭	�m������tD���v��]��& ��6�s�3`��p���I�S+gb"�&��ٖ�e	i���uE�A���$����_o����W��$Q�ϥZ������s�{.�Q.��RBO��Y�����	�3��h�X+��A�;�^;E�p5�gkf�{)��D��Ыu�q�%nP��]ua�.�ݓ�< �O��rJ,'�&��v�R�U�״���υ�ړb��8�;,}�x|�T��d��_;86�Q0Ӊ��;�`�9�T@�����w9p�0&P�u������i�,mV2��%���v\^f�%TM�4&5�u����R�]쫺��|v��D�+���8 �����>]��-zsU���G�ao�WV�K q\a�K�Ĳcz� 'd*w��	�2��	X���F��H7��D���^��$}�Ǐ|�,��`.ؤ`		ë `%@@��J�&?!�=F�d��"&�����/)3o�:��'�i�n�]�:�$bY \̇T\;�7���w��H�A���ɹ�zJ�n�s�.���:��a+J��
��֨���)9u0h|�_ck��8�����m��?�~����p��{0|��ZQ~86R����H+Ӝeഢ� �@��RS�1��V:�4,e>
,h�`��#���^���
u[�b����̚�����`?�>x�����&�.���n�{qqͬZ�q�J�Jl��^��(���:	��.H�4�ZԷ8��1�/�U���4^�O�#ALG� -$�<����5ה��p{e��,mU���'������!lJII[0*Ed�C<�J��n-D�� ^�M[K���������a�jZ�=ۢ�;���:h��"�`Ċ����������"�b��@f=�K�gR&�RB}>)���1�xڧ����2��O��o���9zPh��T��F�G��`��e���= SV��g�#�����bb&�q#� <�y��*��>3�3�����}�A�*�ȟ�y�� 2D��SZ���
�J��"1�l��qg"�Ȏ�	��_
BŴp���h9!IkDT�-��o]��d2":S�5c�<(���+���(�H�巖�no�Ӑ��3���c�rF�pp��d|%�ld���C�+���Γ���_G�(��1���8�A��B: <2N<2�-_�����b�qq��V����}]��5|�n_�/�s>J
�L�>�����';D���n*��.�"$Eɦ���ޟ;�! %
���	9��e��ՙ��1_u�)��?���w
�qx�a=��X�_u����5����o~1.��9�p���K�Eh?nM[wR��P�J(�"4%I�]/�|ScUv6)�gj�%?g��t\��٣�24J0�.;�51RJ��̴cE��em��v�S����j"�s�UA�� �`�9��*�d��4x�rZJ������>Y�j֣J�y���%��t�5�&�A���t�� � d.d
D+��p��T��r�Qf]rU%+ܖ,�iՏc�#�3�(V^e�#���1�t���m�*U|Tr.rfK��K���b3���rL�m������z���)��
�lLY�*��3�W@`賘kZ �K!Y\��E�c���ׁ�;�p�舀ۚ����j�%Yqi�J�%s;nT�UwIj�[~�P0�P�a}~Lu�ce������vQ�#�.'�D���o��%��q;�[��7��pQ�5}{�9f}�;�fmf��̛�����Tʖ�m`�'w�o�kf�w�L���|��S0b�>2X@ U�&5�� \��D�V�\M�Ʋ�T?�U6���E���Wl���G�3�D�s�;�I�-�:/��n��5A-+����g7s�Q(TaW��Ig4���+���C��4�L�U�S�_�}�����a����`�o�GI����vegSxv��X3��X�h���J��}e}�t��,�}R?��Y�	���))������b�#��=�Ū�_[}�<��Xd��!H��Av ��T�5-`��Y�(�DLߛ ���D��s*�g���V/�K�U�U���F��(&���.Ӎ/k���W��j��8�z=*w��c᝖ȵW��La0-���[JH`�uhbk'ٳ����_�rڑ'dE��n8=�Bτ�~,�ֺe�I�-߁� @<�?�}7!ͧ�hO�\��T���8y0��J��#]����	�U#ζ����e�X7Ư�5_��y�ʴl�����(5޶�Wr�N�@�[�7��%�����S�M����B$a���Т�r�Z�ds6�����E�o�g�~ͬy��C��F���`&*�:���}��o��a`ɐ�Ւ8<�q�C����,͐�����房���_ai*�:��!�;~�C#�?'�͘ǚN���F��w ����i���a�
��?�6���!(��I:f�zMخETZ_�qG�,drɡ�tޫ�j�x��A�Žd�l��x�4����L��y!�$d%��iQ�c��jj7��^x�<���~��w_m�d>a��B�O�e��\���T:�!8 	�f�����C�_h�(�/�e;P�
�����3FZ.���K����-��k�]�֗���ߨv8Rm�5Pi��3JTs�������?5�jJRG�cr����Y��CΩ��|M���V3��g��^gRc���0�!�t��j�hƘ`�����9�`�0hv������Q���0D�i�#�,/e���ƃE�$�kcR�[��(y�a�lX:+o�˪�,C�8:���`�:`�:��O�sr�T}�P��{��pxd�K�|��=��]�Z�c�cř!qΣG^�ޚ~n=Se���<MM؁���Ca[t/.�f���R��u��6A��*��3�	�*CY.���>������@}QM.U�>�:%o?1bc��Z��fx�Y�o�蹷�'GNV��8�+�)�Dd�y��]]�q~����a?m�v�$�>�郫��E�/��Vl��eve�O��1քh�|�e<r�8����GV--�2	�,G�O��dG6l��S�
�AT��b��.��Uc�'�N���-l5�1N�4�,�n�k�#{�
�zMk,"���0�f�� L��]���d��3tsN��d˲��>:d � L��rp20��`��`o���	F��h��y�qq�*=��+�P�xƏ����|"�|
�ڮ���:e��%��=�p�:�M�$v}R�~��}�0�@�)[��l���B�K&X1kc��P�v�1�%uT�`آ�/�6V�=Ҋ�
��� ��rn"0 Ɓiv��AM�QL5EQ�7�����y�>1jf�\{l�%_�,W��_,GDsΣ޶���g�=�T<U���Ъ���n9N��E�s�Pv��=�~��m�|"d� bhU������EϤԸ੧���-v�$�VMc��r��:�K�j�n%_+���T::�XE���	N��/ϵ����ڿ�)f�;]>��Fy�����UP��"�����Q����T(�]g�b���=!����I&a|>���?�,��pK'���3�wi��w\�yҒ���_Oe��X���v���XH7:hr� ��ٔ���� �z�[�]��؇�ڤ�$���j��1�hg����ܸ���2dޚ���W��Ss�/l�U�����Ńo;0
��p��Ig0����`��K����f���}@F$�-�n�"���D�cd�� ��Ty|X�#����/))҉�K�Q�x���i4�K�20u8��� ��Sv���n�k1��ӺC67���*�H�����U=۵����]�$26�ħ���$1A(U��,
���n�I�o!
��d�|�q�J��|���wꆎ�Ee."TM}�!=�\b�Y3+�7��)Q�i���w_���(HT07M������^j�H�:L��1�wb�����֚S��]s���rh�&���aU�&������Ϡ������X<��I�%uòy
 * @fileoverview Comma spacing - validates spacing before and after comma
 * @author Vignesh Anand aka vegetableman.
 * @deprecated in ESLint v8.53.0
 */
"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        deprecated: true,
        replacedBy: [],
        type: "layout",

        docs: {
            description: "Enforce consistent spacing before and after commas",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/comma-spacing"
        },

        fixable: "whitespace",

        schema: [
            {
                type: "object",
                properties: {
                    before: {
                        type: "boolean",
                        default: false
                    },
                    after: {
                        type: "boolean",
                        default: true
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            missing: "A space is required {{loc}} ','.",
            unexpected: "There should be no space {{loc}} ','."
        }
    },

    create(context) {

        const sourceCode = context.sourceCode;
        const tokensAndComments = sourceCode.tokensAndComments;

        const options = {
            before: context.options[0] ? context.options[0].before : false,
            after: context.options[0] ? context.options[0].after : true
        };

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        // list of comma tokens to ignore for the check of leading whitespace
        const commaTokensToIgnore = [];

        /**
         * Reports a spacing error with an appropriate message.
         * @param {ASTNode} node The binary expression node to report.
         * @param {string} loc Is the error "before" or "after" the comma?
         * @param {ASTNode} otherNode The node at the left or right of `node`
         * @returns {void}
         * @private
         */
        function report(node, loc, otherNode) {
            context.report({
                node,
                fix(fixer) {
                    if (options[loc]) {
                        if (loc === "before") {
                            return fixer.insertTextBefore(node, " ");
                        }
                        return fixer.insertTextAfter(node, " ");

                    }
                    let start, end;
                    const newText = "";

                    if (loc === "before") {
                        start = otherNode.range[1];
                        end = node.range[0];
                    } else {
                        start = node.range[1];
                        end = otherNode.range[0];
                    }

                    return fixer.replaceTextRange([start, end], newText);

                },
                messageId: options[loc] ? "missing" : "unexpected",
                data: {
                    loc
                }
            });
        }

        /**
         * Adds null elements of the given ArrayExpression or ArrayPattern node to the ignore list.
         * @param {ASTNode} node An ArrayExpression or ArrayPattern node.
         * @returns {void}
         */
        function addNullElementsToIgnoreList(node) {
            let previousToken = sourceCode.getFirstToken(node);

            node.elements.forEach(element => {
                let token;

                if (element === null) {
                    token = sourceCode.getTokenAfter(previousToken);

                    if (astUtils.isCommaToken(token)) {
                        commaTokensToIgnore.push(token);
                    }
                } else {
                    token = sourceCode.getTokenAfter(element);
                }

                previousToken = token;
            });
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            "Program:exit"() {
                tokensAndComments.forEach((token, i) => {

                    if (!astUtils.isCommaToken(token)) {
                        return;
                    }

                    const previousToken = tokensAndComments[i - 1];
                    const nextToken = tokensAndComments[i + 1];

                    if (
                        previousToken &&
                        !astUtils.isCommaToken(previousToken) && // ignore spacing between two commas

                        /*
                         * `commaTokensToIgnore` are ending commas of `null` elements (array holes/elisions).
                         * In addition to spacing between two commas, this can also ignore:
                         *
                         *   - Spacing after `[` (controlled by array-bracket-spacing)
                         *       Example: [ , ]
                         *                 ^
                         *   - Spacing after a comment (for backwards compatibility, this was possibly unintentional)
                         *       Example: [a, /* * / ,]
                         *                          ^
                         */
                        !commaTokensToIgnore.includes(token) &&

                        astUtils.isTokenOnSameLine(previousToken, token) &&
                        options.before !== sourceCode.isSpaceBetweenTokens(previousToken, token)
                    ) {
                        report(token, "before", previousToken);
                    }

                    if (
                        nextToken &&
                        !astUtils.isCommaToken(nextToken) && // ignore spacing between two commas
                        !astUtils.isClosingParenToken(nextToken) && // controlled by space-in-parens
                        !astUtils.isClosingBracketToken(nextToken) && // controlled by array-bracket-spacing
                        !astUtils.isClosingBraceToken(nextToken) && // controlled by object-curly-spacing
                        !(!options.after && nextToken.type === "Line") && // special case, allow space before line comment
                        astUtils.isTokenOnSameLine(token, nextToken) &&
                        options.after !== sourceCode.isSpaceBetweenTokens(token, nextToken)
                    ) {
                        report(token, "after", nextToken);
                    }
                });
            },
            ArrayExpression: addNullElementsToIgnoreList,
            ArrayPattern: addNullElementsToIgnoreList

        };

    }
};
                                                                                                                                    �_�hL��r����N�`탠��Fq�I$�yF�yB��b���3t?ih�?�x��ւ�r��Bz�l�F�$':|�V��,�&�h��
Fhi+��4�> M$�����ޣ�U�"Z}�G�m�!%���)������D��-�Ԯ<H�6Gغ�s���2ԗ-Y!�M�mָ) P��#����f�]�j��!����N�}�^��)���Z#b�F �VD�"�$�R3�lF1��:Α�(�\Z�<!�ms���s��P�?-L�8�l+o:q�
�)�@�[����g���m�	6���u��%�m�]�P��X��˸���C9ً�)��wЖ,O��;�-~Y$`�"������m:��u�y���R%I�{�Dbɴ�aj�V���T�C[��L��R����Ԍ5�����	Sc�UQ�Iz;"�MbE��n����n����:Z�E����Lh~�"�Bx4f)  �kP�x� �RD��!�G�^rWP����o%)�#�qr�q�ǹMƬK��:�-��3��%L��}����ԑ�C>R$�!w���_��"���lS>��c�:�kY�e_Lu
���#���|�j�w�n	O�<n�
�$o��c����%�d&� �p����%D ah�;I���)n���; ��%l���DQ�2pW��־u�"�J��'�ugH�1��	���j}�<����p�-��GX�W���Rwz�;�A*�!F��@#�%7^*K�#kW��o��Y���0��ZՑ/=g�߫�*��O_U�2��dEѥ��'  ИW��	�M�`��U�y�BR��S ��X�&�Z�`�� ]���7���w\C��
�p���;����L0XȜ%�N�LqЩ�2��k�yZ|
J����ow���^.�[&�u�:�	�pD̖��}��+a�����,���e�As��8jːR�4�P`{��6/fK�v��i���.,��1��W[��(6éQh�04��Q���&���C��Z�uXd����O,� ��e�S @IQE�)6
{*o�˺�������Nr�����u%�_{2|��y3�I�3�թh���*%��<�{"���>�zԦ/Η��'�|�)M
�C{P�KE��R-�eM�����#�
^ �4#�H
ei��z�~6��!h]�eTI#]��L�f���n�(��c,&�8�i��P��5O�,��B��{9�<5�q{ׇ�I �q�bOQp2��\C%��b��#cp�T��+�=Z�1���Ψ�9w?D��/��v�����}*91p�C�`Me2��#�UC�}lRA���gYK��=wQe](��8�Ę�����|��}/Kh"�2QĦ�"�ׅ'�BK�"�z�[�ˌZ׆����2���s~6�.)�0u��kĻ�T��,:��g���:V�=��bZY�O�y��$�7�� �;�Nm�2隣�o0 ʸ��Pc��n0��>^��7�ߠh�/`im�X�`Ja�k��9�f��Krޕ�|�M�e�O�7���� `�ъf+� !�i|x�Ǻ�t��Y$�E�v�֩ņ�	�?�!�}��A�u���4�}e
�z��MA��E�픶Y�.�:~�]�?6�L!a��?�{�Lw��>�z�~*�=Kw�.��f
�XI�k�So�G.s��ҏ�s�F�-�>��udsm�o��L�]��O�-q�u�z���&�|	�/�0����ph8�
�M2�_���a��
C��|G�U�� *T4�����@���9�&9O� X>�d~5>HM�l�Q��{���Q��P��ZT�@�ޱ�Md2�Ǉ���C&(ȇ"��g��㸗�š�V8s�u���?�?W\�W�ݧ��n]�ڋ�Y^��Dx|uРq�
p�&gc%&y��b>JD�H�QP��G(�j�:��b&hQ%��N�r�h^�޻�dS�7��p1�XW'�*9��t�����] ��)�%3	tc�$
��%Q�N�6%���Υ��+�F#=���A��~�X뜘k���r���@M�_�~�'��X��I5�ì��� ��k�� �%�{ I,zhO�����|*��� ��z_��B�5�"�qm.�\�ha��%�%����kz��LW�e:�����U�E�S�c��
�21D�{�����ΤB��E+	��V�&A�/��������I�g���)�,����?�1zYI|�O�^~�/lkר�V�D�D�����]��.k�u���w t�+���T�n�<�W�p�C'����Φ����F
el�"�����fB���MǙ�� ;���`Ҭ�; ��O6B&ڐ�@��kH�FR�	���M�
5Go�aaʴ었�G8�S���hᛵ��OΙ*�A~(#��뛔��|�Ao�c�����-&ҿ,0 ��ó�"6/�mu�ŕ�Xv�4ᶚ*4�՚�@9�"�, A�a�1��6Q֘��KQ�L3_t�Z3$4��ʧj�J�����h7k�$��'=����\�5,�PSF9&��¥�"���4={>Q��:��b���Y�V���Aś*	�ZlS��/�4����U%��PЙ���F��J��޵�jƐ����5"Zl�+r�$X�9�G�l�^Ɵ^� ���󭕹�il1����ob���q�um��D����f���ASJ'Â��FZ�L9���7���71jF�:ދ!��G9�@�ZD��m�SL��n P�H�ZɺM1��{QeS)���@G�	p8�g�w�����6����883�Q����[���Kдw]hg�$��I�RN*1����0��\��<��@�M��o>�	t��O����j"4�x��%��V�	���`���8�@SP:ppD�a���ݎ��Y��Y���"s$K�p���AE� Y<2����́pXr���(J��a'��G�aqu�^�`
�	4TD���H너��>��rDw�ԂEn���ȥ1��=և�6ћ`����:`a�x�?%��;μyO3��/%�"����:�&��p�.�S���γ�/�5��\���l��ُ�_M!p��k������,rAKֺ��z0FƁ�@o�,H�����3)� �ػ�I��e��e�i�Z�~�Q�u/����g�HbBP�?+�!�G�.e�cC��Aסy���
=�h�{��"O���G 1Pf�B�<�&0Ӈ�mO� ��j8Rt�':�W�������E������g��4��N*����a+RbF��7Z�.�c�4$���,Җ����� w����7�
�E�k>K_[)@�
������QѶ�&�d�1���ڷLb��E4d�y��r�#K*�R�(��5 ����o��
2�N��K�����⍙Gw @m������O?��������^]s{�;�G�=ŉS�n��N]�QrΩ��k��s�_�<T҇�-6�RՊ�	⠖^������҃2��;����:7�FR"�d��>ý޵���*À ���%�T:
��B�(��FbM�C`B>�֜|���V�Q���K%�W+��]8��X
E1��b&}�����:ܯ �B��X���*�K�E#5�$��?B�H0��K�
lT���i�0��Y9���KICZ����f�W��Yo4ET6��{�jr�%��L���}��l� ���1h��\�p}�&��8��?�<�!ȓ��0�y����*�U�aH�`Kt(j��	٥j�E'>Zs�Rp��}���+e�A���>?DE�9�H~G5d���>A����
�8f��DM��SК��bt�iH���ɑ|;�D���8:Q��!+����U�[_�Eb� �l"$%���;�u��L�Y	YO�$�0&q_0wN�vX3��>����7_��t�Lk,*��Y~��>�w���zN�x�R�~�O5� �*��!
KUZ�#� E��� ��m4o+��3��r�i�)ҶHC��
���΄2�����H�To#���@�jҔ�ߥfS,�����om�~�ul�P��K�y���#��d��t	?�L��+�Y���a�s.-�ï�`�
�q,I�ADe��{.�K���H�Huv��XCIN�l��v

�EwI�C�`Q��a�AR5$��/
�ѡ�s٩��9B�Vl&�>�t�����{gC�їc��f�Ü�����;�DEFQ?s�s᱓V�%�T�v��
�8E�SIb�y��Q@�����E]E�h"�*�c_���.��X������t�Xvar _setup = require('./_setup.js');

// Common internal logic for `isArrayLike` and `isBufferLike`.
function createSizePropertyCheck(getSizeProperty) {
  return function(collection) {
    var sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= _setup.MAX_ARRAY_INDEX;
  }
}

module.exports = createSizePropertyCheck;
                                                                                                                       ý�iN/�"�BA�
�?�&ј;1�^���4�O;�(W�ԫ���m�Pq��  �0,���T K{k�R����耹��h:�ӋB��E�� �?��w��`n
`5�%�I.JZ���\1t4�᢬)l���Zc���o���v@�\��Z$�����g=���h�ةX�*$��(J�͟�4Y�8����U]�ZmZ��̾y~�_���}�rP����u�u������Y��g�F˅�G��a�q���(�<��ف��k-��IO��me(��dr
D�����Cx��Fbq �0��� U
�bƧ��am������2)Kmg���.�e;���삊L�)�yT�r�v�z&g	�>�����W��G
`�y��#>�lS3�/	jv1,�0Y?��3|�[��;���ϲ&CCb%�*IC�C�1��!��'�[�8 @g���p�+9������/�r'c���g��<�h1����i�E��_�1�A�Y��J�q�-)���
A��=��+���|��̶����1=�R�!7t��W���8�n�D�\q���	Ԋ
�h$�QJP���t�R۩��:K�T
�\�m�l�����b��bOt�����i\���RthKw�˧�����
`���`L�w�k}���{�^B�����)�^�K��t���'��	
��JU������>?������0
�kԈ<;b�	� ��Ts['_�)���6�	��&� \#��3�:����+�C?灥�%�"1�}�/���I���O_�}_�F��v Đ�f��%/��Y[4@|o�*/p��}Y �u����m�0�l�:}m>�"��#�\[5�����o�/5f�8E��r���xR�����뾟�0`"�y]���sl�۲�f2��u���;�b|[�Sr]j��gTCs���������x��^�}r���
���6�D��B�(��ɉ28г��_��X��T�:SRQ-� _�J��W�9�x�dy��%Ę!��
�W�J~�U��`��K��?���"Q���P^0%濷�����R���2COg懲qym�h��S鎵a�D.�5�\��<��U2c50����`znҹQ��w|�r��
�_���J���_"gqP�1ǘ/��V"
[-U����Rv�.��_pG�;�����h�����K�u������� ���i�}�jC�>�o���I�I���5L�4���.�����A�|/�Q[����/n������-kZB*�^�K�%��z�F�z&cwg��gD�{.a?vs.�E9|ΈJख़�g���ps���Rꠗu�\`,�r�J=<L�R�t�b(%���|+�>aw���Ԟ
V��V�j�u+��J�\��!��]rI*�8�l��Ih7(Dc:N���!���'!�
�}��B���p!`���a{Lx1W��)��~�j�#�����gɽ�~���+!��`E�� ��Z��ʇ�m���j�%��=����E�֠ݑ�o�=Ł��l���)��g�M Y|�n���r�^��nX�O�}�M��rB��(1g��G���Ԁ��+5y�ia��LY/uW�O]��d�_�������k̏�Z�s4���8���Q�bEO�3�/�`3�'"+	�]O����S����7��>I��?P���}T��HA*�t�P6�X1;��iTee�w�kQ@�x�5��X���{�0�D���'�����F�����
�o��W�ո�����0�D
�E���J���&�,rJ���=�Jz��:�.�;q
��E��i,3�)�J�0틔��a��+��K�e���EVh�r!OFY�T���1T�i}����C�!�ě7��4�ޯ�x���N��zJ��c:٣��0D��R�}�SM�{Ifw�o/6�1	���U�ĩJ1� ��9��B�h"}�߶��d%q�"͔>�<��x0�'H�]؊�@����G������*b,���v �46�uM�&�yB���tu��A�����Cf~�zD-�"���P�h�J�i���#{�����_��r2)sk���7aꊅ>�	�2�r$gǚ7�)Pe-(���|9�A�o؊�R��>9�F��O���^�|Д��cmB/ˤn�¡� �%��>��y�]�1'�k�z�g�JUE�i�+���tL����H!Tx)�( �#L���\�8
��h^�.�?B`VM�`e�S{�as�h����}~�N��ivw12��D�.��Փ6�t�Wwb�7�ݰ��i`���o�-��z�-�ʫ��PV���tQM��pcP��P�P
lQ���n���

#e�����K2�+���
�Y��f�Ϩ������D�����Y�A�B�Q} ��X>�HͼL)�$_W]`��V����C�d�
ɩv|��1���M��[��DfVQ*���� ^�I.y�H��/M	�ּ/���+����f�|��\7S������U������(�E�r�HyZ'��k�>�(�y�2��NTlȯg�6D�@-2�r>1!9�Tk���`}'(s{���VZ�u",��:�<�1��	�X��D���0�UR���3��Oi"���J ��4#Wub���[1ƫ5�91[x�6&j����T�v��p0;�;/�r:鰃H����:KIF.�P� o�[k�#����0̵4o�5`ZS�G#�D ���N��)(��B�2�˙2!��^�DԪ
�d=�W��j=:��{ߪC�V��OZd!Xv�w��&���-��/+
�����k���ɬs�AaD*ǯq�ȃl�A�~� x��6����s�y��S-��Oؐ���$4[�crh�0�Y��8AV	��۪�:��e�#$��5��jhI��Kg|�>98+6��βB[CA_������߭⟉7�t|� �-�lh�,����IkP�>/�3EE5�SreW|�/��)��(�5xO����܂�A ҩ~�@L��1���
�(���1Ru��-�R5�e����;Zm�	1�2L�� �~���PM��랙ۂ�$S��[[���/�5O�����%7u����/)�j�^W�y��^�I�q�
]�
����Hǡ�?B� ��23�4�ؐ�(��iM#%��5$��:� nn��C�}>�髀�hͯ>G#���:EN��.t{%�&��T���B4N	�{�Xa�|��m9_o7�p킳*��w��i���5��6d��,�P�h|��Wt���+��[�b:���J��W����zHjBs@O}_qᙹ��Vg���_:�
*Ą�J�I �Bv�;���<=LF庅���R��}W#sq�	(j�w�e_�9w��鴯�C�|'�l1�x�Vv�ڄ5�M�oBjp|ޛh��0��� �_�@UOPѤ�.4,TD �����/���,�1�w��fߋ6�HGVC�j
9wN���z gVZ����Q"�����W�����_1�Ls�5���3aC-W�.�b��ԵЗi�]|�a1ٙϡG�l�3ߙ�ǤE	�.����Tk��jz����*���g��x����*�䃏eo�, ��z�	�wgG5Z��HJY�^��ɡS���4�[D�G���!$Gw�����
���?��I�����B^�3K6�+Ҏt����V"��;�8>~�����X
9�Qc���@i���P��0�=�SB��$�����~.�Ѱ@�ߡ=Aɶ�@)���`*s�,�.$��Խ��$�a0���N[�:�����%Mg!�e�<L���q�����Q�J$U���]K��3��9�XYk��bkpjx0hQ#">S9*��uD��"  ,4��r(SDYG�G��Ú�~JL��i)����2=�uQ�@����π"�FIG��)�� (�~�E���R`ѦC�4Y 4��"&�SQ+mV(�a��|EaPZ
�B.
���x�43��|[��^v�?��󦒆�Od{�!�yI��Տe��@L'~��<�2}��) ��7c�yJE_	�E\�iŜ�'Wؔ�"8��a@���3��U�,�T��ϒbr�W��3���a��W�%�ٝV��*2N�H��,��$���10-3(��!��x�`�a�R�I��c�����ş��V���*�1�S M#ə
��w�t�Iͣ��2^�	Ib։���{5���JOKV`N���ں�x��\FSt���Ò��/=�O�a9����.t�O�)P  ���Q������J0V�e[:�aiht�OOߧV#&�[w8�Ŀ��55q����@���>�x���i����x�k��9c�<����d�
� H�q�]u�/9
/����'9o�o�&�.WS�js����Lpt���9ogk�^~D#�$�sX�
O��u�E�g�ơ�n´��
�z�k�b�ii��(�,=>�3-���\}8d��( `���"ަC���y�I��ŷL��ڃz}
Ǹ�&��(�1�y`�sS��pZ�^����>=�e� ( ��8��J�&���\E�|\5��
B��:����>�蒿[���,>���X���\����]�J����]s������Z�N$���i]\W��X4������X��H�E"�	-P�qGD�_�U� ��2���y�5���
+� ��)���ˣ@��',^YP���+c��b�wXZ8q^�y)�}`=Ϗ��1��H����И���#��o�� * /�,���ʄ;M9�Ӓ���g�(������|��/1�1n����}�����������g���G���e2�ɁZ����%�!��t�5�0��Yx>+>sU�����N��beRt��c���mz	@ ���ɓ�G����9�F�`:+d����	��ʿ�
8� %NɊ���ĸ�K�Q�t��7-��EA���\�C����~%]x0��@�0P�;����Kq�Z�^_�#�߹�
-�����S�MZ���
BE;Ԍ7��� �/�X�y���b�vH�+���Ov՟"o�냊y�(���ޒU�c�ڮM������d�9�ŕ�ޚ���8ൃP�=�*��%oE��T���J�Po$t�~�\����`�{� ��60v��Vפ��1������Ѷ��?��;<2�T藆_f��C�Ճ�vJ��K�}Sj?-����$Y�$�m��Oc��|{��Su�*hV{�*���/
lJی�r������J��
9x9ǽ3�i�|����
!��!
yaN�^�+V"�)/���EG
�\[��t�Ϫ&	�y�p�B//��E���_5w�x  �L&��+h�t
���"�[����C�qp�c@ڙ�P!���V�K�'��Gh���_;%q��`��C���pd^r� �b�aO�*?���V�i-���&�"�S�&d�*���^9�Ǿ��ck���Me��u/O<m\N^��E�I�`1�QP��H��:��2c��Xb��C���9����^�:�ô��Zy��P}!����u�k%��Q/��q�A%�ȅg��Nb�}LT>FD!�s�h�t	>�����vI��Q���M��ٌk����N��#�rm��u8��=3��,
���;��/�J�V�Lɹp��<c[|W�)��ɉG�&��O��t�0-W;ҷ���뷈����v�ˠ���/ߵ(F߁~�@�8H�ْ-߭�v
��Qk��N�����%����	W:Բ����2Dj�4G���v��xqM�
�������)?ϞX�80Z%闵��O�֑=�5��bk9s��sg4h�jc�W�#�\H�k{����,�rg0;̣?XV��f���dęV�m�T���
.��r�w�6�Q+��㯊�ձK�okA?���ނ>P����
Y�S��V�'#�y���/Y��:([��,?|�򞫩h��F�YF�X[Y�%|RX�OvӶn_��Sp���;�1n#��Vr;���R�������Xʣ4��UF!m�0��wq*�D�V^���[T/�!>��D.i���\T�m����wΧ��*����f��f������Q!sVž�]ÜprY��aJ�1�Cq�5Ǖ}g�?B�A���zȤ�Nga�/	L�mc�u�/	lWW(Lj����-���_6=o+�D6;�jmF&�n����O�`!���I�9P
+����Ce@D_�~8�H�Y�l'�*�jg�?G ��}gKyu�P�@���
9����d���ޣi�6��`�.���GZ�+��V�r��VW���Vߛ�
Ap^���3�����ܠTUS4Z�1ll��{`�d�n	q|�3s�mj�q7�Lx��̓�H_��[�cP��"���4
m���d����uq��5Sr;q�DM�~��tfT����K:�Z3�4��a�ʁ����_��K�9B�Z*^MlK���;��+�����h~GL��
l"�pm������5�C�T?�?�I�%D���l��
o�POF��Z�_|�Q����G�?%t��Gwi�O�À�`���	l D�O�4,j}W�r����+��Ww6s���Lbp;���!G�;��M��{�XEݣ5@VR��e%�5e���F�>��c0�~����}+[v�e��=a�r
�z����?ݶ���6�>i�G�ݛ���+re�65D��W�P�@M̡��6�5s�2�g�;��j!q:������l���܎eͿ��|���r��@#��l� �A>d�᪝"�i��J��jƆ.           Dm�mXmX  n�mXҮ    ..          Dm�mXmX  n�mX�b    INDEX   JS  Wn�mXmX  o�mX      Ap a c k a  �g e . j s o   n   PACKAG~1JSO  �˨mXmX  ͨmX��                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ring;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "https-crl": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "https-crl-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "https-key": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "https-key-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        /** @type {string} */ simpleType: string;
      };
      "https-passphrase": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "https-pfx": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "https-pfx-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "https-request-cert": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      ipc: {
        configs: (
          | {
              type: string;
              multiple: boolean;
              description: string;
              path: string;
            }
          | {
              type: string;
              values: boolean[];
              multiple: boolean;
              description: string;
              path: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "live-reload": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        /**
         * prependEntry Method for webpack 4
         * @param {any} originalEntry
         * @param {any} newAdditionalEntries
         * @returns {any}
         */
        multiple: boolean;
      };
      "magic-html": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      open: {
        configs: (
          | {
              type: string;
              multiple: boolean;
              description: string;
              path: string;
            }
          | {
              /** @type {any} */
              type: string;
              multiple: boolean;
              /** @type {any} */ description: string;
              negatedDescription: string;
              path: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "open-app": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "open-app-name": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "open-app-name-reset": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "open-reset": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "open-target": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "open-target-reset": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      port: {
        configs: (
          | {
              type: string;
              multiple: boolean;
              description: string;
              path: string;
            }
          | {
              type: string;
              values: string[];
              multiple: boolean;
              description: string;
              path: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "server-options-ca": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-ca-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-cacert": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-cacert-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-cert": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-cert-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-crl": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-crl-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-key": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-key-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-passphrase": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-pfx": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-pfx-reset": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-options-request-cert": {
        configs: {
          description: string;
          negatedDescription: string;
          multiple: boolean;
          path: string;
          type: string;
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      "server-type": {
        configs: {
          description: string;
          multiple: boolean;
          path: string;
          type: string;
          values: string[];
        }[];
        description: string;
        multiple: boolean;
        simpleType: string;
      };
      static: {
        configs: (
          | {
              type: string;
              multiple: boolean;
              description: string;
              path: string;
            }
          | {
              type: string;
              multiple: boolean;
              description: string;
              negatedDescription: string;
              path: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "static-directory": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "static-public-path": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "static-public-path-reset": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "static-reset": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean /** @type {any} */;
      };
      /** @type {any} */
      "static-serve-index": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "static-watch": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          negatedDescription: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "watch-files": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "watch-files-reset": {
        configs: {
          type: string;
          multiple: boolean;
          description: string;
          path: string;
        }[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "web-socket-server": {
        configs: (
          | {
              description: string;
              negatedDescription: string;
              multiple: boolean;
              path: string;
              type: string;
              values: boolean[];
            }
          | {
              description: string;
              multiple: boolean;
              path: string;
              type: string;
              values: string[];
            }
          | {
              description: string;
              multiple: boolean;
              path: string;
              type: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
      "web-socket-server-type": {
        configs: (
          | {
              description: string;
              multiple: boolean;
              path: string;
              type: string;
              values: string[];
            }
          | {
              description: string;
              multiple: boolean;
              path: string;
              type: string;
            }
        )[];
        description: string;
        simpleType: string;
        multiple: boolean;
      };
    };
    readonly processArguments: (
      args: Record<string, import("../bin/process-arguments").Argument>,
      config: any,
      values: Record<
        string,
        | string
        | number
        | boolean
        | RegExp
        | (string | number | boolean | RegExp)[]
      >
    ) => import("../bin/process-arguments").Problem[] | null;
  };
  static get schema(): {
    title: string;
    type: string;
    definitions: {
      AllowedHosts: {
        anyOf: (
          | {
              type: string;
              minItems: number;
              items: {
                $ref: string;
              };
              enum?: undefined;
              $ref?: undefined;
            }
          | {
              enum: string[];
              type?: undefined;
              minItems?: undefined;
              items?: undefined;
              $ref?: undefined;
            }
          | {
              $ref: string;
              type?: undefined;
              minItems?: undefined;
              items?: undefined;
              enum?: undefined;
            }
        )[];
        description: string;
        link: string;
      };
      AllowedHostsItem: {
        type: string;
        minLength: number;
      };
      Bonjour: {
        anyOf: (
          | {
              type: string;
              cli: {
                negatedDescription: string;
              };
              description?: undefined;
              link?: undefined;
            }
          | {
              type: string;
              description: string;
              link: string;
              cli?: undefined;
            }
        )[];
        description: string;
        link: string /** @typedef {import("connect-history-api-fallback").Options} ConnectHistoryApiFallbackOptions */;
      };
      Client: {
        description: string;
        link: string;
        anyOf: (
          | {
              enum: boolean[];
              cli: {
                negatedDescription: string;
              };
              type?: undefined;
              additionalProperties?: undefined;
              properties?: undefined;
            }
          | {
              type: string;
              additionalProperties: boolean;
              properties: {
                logging: {
                  $ref: string;
                };
                overlay: {
        export * from './matchPrecache.js';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             &�h Q���ø^g-�8d��s�a�T��<+��C�ށ[�-J��v~|��>��rS�Q�=�;���s�@h�+�nd�ny�������w*�L�t<sI�T�xnE��g�[sP��]b�W��hw+�M~�uȽ�c�4
���W�� �%�`�f�̀��d�juáz�(���I�
 ��<�|��3�W�7
��h���61]�94�,�uUd�L9Ja��,�:1��r��@�utn<W�M�D��&�pR��1f�������3�Nz�WcA�tlin���m�0��,D$�R�[�V�x�1/��1-�dYH�߈k���&�G0�lZ3M��3ēr"W"&Ԋ�|<�C�o`bG��o�8�܄��稯"/f%�TM�L?��Z�~���g��i¹DY�"���P\<�:A.Z����"�i���Q�6m6�H\�B
�+���޵D��w���i�yĥ��ϩ�������	m��>!~�@�#�.)}�^t��kHu>�n�IbK��V{
HbϜT
�Gm<(��G��Gg�����R�ڝ��=�l�l��)������C1.��b���o���G�����N�p&MU0�E,��O��-��x-���մ@�:'�h��(vS<
�X��ho[TJR�,���	]OUb��J�����
����b��ɑ҇�f=��C�o�e����ȯ��K�v<T�g�aX7�|\�2V�!�����ZX��W������LĔ��������������A�gĒ�Q
�"|�j7�$[��D
���a
�*��0�����Oϵխ��|�f�ҭI��vW�˟"�F��sQ�>|XT�u{�t֊�����`8f:Z�/r?�k	�4�����J�#�7�8n����#���q�A@0A�\6(�[%B��+��Qv�a*�s����VCR������94�=x�0h�5���\H���������ܦ���Hw`'Ǭ��o�֢T�BN\#|�t����q��6A����o�I$�B�#ր�� @񡢙�H(���Sd�:��|=�KY���񡪑�uk[��=v�~f6_�㺜nDFB�Fd
��x���P���T\u�04�$�l��I�!%Y�kj��ӵ,�U7
:�}Z1�J���^��:
��㠺qiQ��|�6����'.�4N�h
��\^�?_�Za S�JW,�!�['������Y-�P�o�ON�k�7�0)\�E�/����F�?
 �OW���F�A����~��ACe��?�g���L��<a号Y����H���UPδ4�eExXx�sIs��x*!͘

���z8��1��$��Q���Ή�٬��n"<H�]����U5��n�@�d�~�#Ƨ	��2������{�����w��:�KKg�T�3�Q/��MW�,aP㱆V[�9�\��*�?>�%4�,��L��G����#�5{q+��/�vt���/MdjPԿ��ʲ�E��o)�*ۦ�P�|� |g�(\��#�"�+�z�J�m��(3��G�B�M��a��zSePrʅ��	/�Җ��[���[�wD;��Sh<.Su��϶td�O�qr�ʊ��2XAA�LJ�D�0/m�qc�~v�kΩ1
;�G54�E��g3j�،����N����aX3ɣݒ�o"�_��`��P0���(�JdK�QhVlZk�Ζ�p�c+�
G
��or�P�-��H���V�f�L�48�9d�}RgI��`������byP���HHI��?G�+K4�2�����bRb׷�#���)�h9�+���p����%�G3{��ф=|*���ς_Na��L�
C�sd�����_�o�z���`j��#��g�,��u0.��?�K-� .�::���;ʖ��L��^�Y_ך��_����y��E�Kux K���3���$
4�Kt1	IT����O�LG��3���&ke�"]&��}��`�k���F�u����/�ȥFI��>���^kW����U��➭F�����I����cW���H|^>�ͤb,�7UְX�Ra1���J�L��$>�/� �&L�,�Ѡ�q� ��T'B���]a�5��I{͜�䄇�{���Q����6 ������M��D���3 4�d��Ex�G�6`i@U�m�4X�$��s�x�,�K!�о�^��	/
)��Aj���mp�C[<��)��;勌��I�� |QFZ�+�Q��|��ϖ~���|n%�)��������R�O6��⊿B��iTٰ�bCP�
G,N6�j�;0��.z��*�ߙ��D�7�]s��n����|�7eff�_��>y���J�#��3��/�dhh�ګ���|S�Ef�Χf��� Zŏ<��Ԣ����O�0�y�Bk��AT����E��c�n������zN;M2���Q/ߤ��
�Z�4_e*�M�eh��ZD��;���̰���AK"Ȥ���8� ���N�<�I�ya�AI������[��rl!fI���t��Շ���-�U��
�w���K���'�fmD�t9�?�x��C�1�FO.Aݟ@+/��<{?�>{���}(�Љ�
�)��4v�S��4i	�;1]?�/+��97;QQ��#�z����2�F�<+�x+������¨� �v���|���|�xR����g�~���j��32�)�.��|�h3E�P 0
ɪp�j�^-~(�jq�"L�	$��b���j�0+�O����5Y�Lw�|gNw��o��'b�Ǻ�3@�W�K�#���I�;�9�r�+:g�
�_���#�1LV��\�ч�]Q֋ETʤ ���)7���\́u�f�#��ָ�#�de�4����M&�y!�����LN̼��&T�=�}Eǅ�6�o���	׊�8*��M3u��T ib~Y��1n)�$_���6��y;�B�|+��I���X6+p�B�HJ�_����y�T�7��Vt��g��^��@�8Z�p�A���/�QU�`x��N�F�O�!; �*�DB&�1 0���1o7j-��4dR#����Fj8�[�Nz �dF�=8&��#�>�(n���S�0�������74%�&9e���!q��/K��_���g��Dʔ���cuHC$"�����a��4=���\#/��E4�w�5�қ���=勢M����Cj8���k
n߽u��b�r��m-��� �� ����Bf�#�^��^H�qX���ͪ
?L���n5��dw�'���"fI��6�ϵ��w�;���@������q�)�?���ZE��`�aCF��������,���)[VcVy]��,ÿ��*f�+b��bJ�+?}���b9����&P��ȯי�s)zY��j�2ܠk�Q�|b+��2�͜WWuѣ��`}fB�������f$�G�)G�ՙ�$.9��re��_��M���cq�[����������$���E\�V̯y��]���cj��ګ�}�o�Х�KIG0ڎ(u'H6֖'�j<ٰ����ɣm�Y�7�	��\��l��M�ԦR��U} b�J�|4RL�r�������5tn��X5M}DCU�̕zI�%/�"i[#��a�s���/!��V1!��a�����ynYԗ���P*-�~���zUze�Y'K�Z�p��y�a��
;�PQ�h�n!�RO��P��Kn�e�ƒ[�o3�g�U�L�Ј���k��z1�f�}.[�M�R.�)7ܬN�Vuq¦B���C\�X�"l�h��ޱ��������\J��h�������ɚ}S�sgܡ��jN�&����7�/�>^�n���^Ǌ=/�1�;T	�G�t���iJ�]#֖�M�Qwʲ��2�=���G���gM��jV��a:��t}^��1�E�e���ȐTXU�����o:Bڈ�lW�ڢ�X��yE�dq��6����*��g_�/�_��'=
�nx,�����0(m�*�1	���0{i=Cش��H���ܴ垞�f;j��=�Ճ �
+�CR��3�!qHh� p*ПD�ۧL�嶂�:�����	$gc��3�t��Ɯ����<��X��6Q�[��!VM�9ֆw*ޏ0�_���Y����gs��*+Ś#;�lI�#R���Ͼ�g�H
8��+��rJ��!Q*���-W�`�JD�z������y�l�~Pia|�r�q�>��s� u�$f����8�g!�hB�g���OI��&�Z
c5�%�䯺Y]��A�H���1b�9<�0'��k
ĵ��`�����^c��%{nl�jv'��2'ީ�㟛f�Zc����=��ލ��e�hMd:Q�E��?����@�`
/N�����W�Ė��o_y~M�:i�~-���t�%��s:�딑Ŏ��,�{f` t��|Щ~Y�?X2:2�T���� ]�Z)?j�OU�>����%��<l� �i��BR�M�v��;�h��!5[sPD�r��Y���9�N�!��`@0ߒR����@�f�O�Cp�lb�䣷��.eI(*�CM�����.�0i���q򼻾!:�Cĳ����I��ss���K>����0�ߨ����2t��l�]*G���Խ/ǿ\H\<�~�$�	�ң�*���|@i�i������� �Z�̑�rk���:�̜�r񋍢�\�a���˳l�"���.5�&�b�5D_XsVp (��l��к��]��6��O��K�� f�X��ZN�I�˱KnM�_~W�{j\�4�~�>f^Ϡ�bs��xu��}c��������;��5���S��SC��.-sʧ��EXi=5W����i�plԑu4	����<pt�
���ϛ�k�්����/�Z$�cC�*�x���Mb\����{d�&��;�k�OAŶ
$�Ί�ȵ����?�T���E�Vg����)GG��
;r���i�L���(`r��w��ѱ9�vcbH]�u7�ry�c(?�F/
���9��U����2#=���8B3�9[�ŭ�{Cd�f���h^{��[�g[��T�x�g$q�?����p�����.�ĭ}��Q�}^��-SS^|�x�@h0���n�]�� �
=hhR��pU���s��=�4���E�<�v�]gi��R����:2J2w�_�O�Y��#�mY��߆��@$%���3���e��x� �h��0>�q�U$�t�㿃)��
L(���ҫ�l�2ͧ����)y�K���'�����a���sL��CxN���C��^V��(Z��
%&�~0�B����3m�%�UB�1\a6�K%T(vTD���������#eN^DP�������l@��p �8�했�ت��B�7u�WPw�����7��@�������`�G��4T��%r��s��Φ-bM�"�K�d0�� O�c���K��Ҙ!���=](����g�K�������˫��MDEfFqȍe��B�n�}�kT!���5uo��Z�M��b�1,�]t�����ж��t<
N���03�6�kB�H=*z3�|\�4��,�qČ��]#H�_�����;� @����t%7i�L��{���=��`v&B���z� ��VN�*V.�����3�yi�s����,���k��sV�3�NƳ���çԖ���oLӋD�ps�����������	q��W�bbM��^�VSN�@���}Xր���������α��M$0��W�@ S���sV-��;0>��9Y�Q���O��熕_m��s�j`�}��m+Q9��(!�HI|�>Z�/�����s��1��k/��,
�����5|�:𷖯2���R-�0���Mߨ��M̂tB�*���h"&�����*������ ���u(2��\��m\0� �<R�=�� �+z4m� �+ޮ��T �{�v�AH��%������&w�'�
UoK�YZs	��G��>�����+�s���g�.�H'J1©	���� �W6{��K�u��Õ��<E���%TB6O��Ѵ�9���@I���3f1��?�Ίؘ��%3Gڒ��)�����a% �>F��)�+����6�u_4�3`Ŵ�^Z`j5��5\=��r��)�f�KK��R7�k��r����}���P�3~�,J�p�؂;e�O�a���蝦\�ž!:�f�y����n2v�:F���T��w��CU�\L��>O��W�m��G!Eʙg�naP��{��Q`[��B��t�<U�%$6@Җ>�ǜ]�Z�͵<��ӲE��G�Q�.�'^pU��B6��ːJ#�'ѻK��e�Rp�ws7٤k��b���|2��/N��FF�iڎZ�Je�$�n�Y#�WR�Fo�፫�&.G?_��[$]HѦo=ף[�����{&�jC=�a�z��'�ڨQ��b$�1�t[b�jb�8�n��T���<���:����"�_��W���ث�9��<��
�WǛ|�����i�����PrU��x莿��7�L�a-���L��W,��MXt�Ep$'���-A	غ.2�Mu"��I�t�ƕ���.�2��{�D�;�9�9\�  r4tnɜ���19�"���c���_y7�H	�6h�W�<�̎(U=T������\M�-���"�f��m?>��Nk�7�*���&�Hj��/i�<m���,x��wuͣ;�es�O�ĕ�E�����`��4_�F�v����G�F���9�s¶y��(����-٥��KY7.�Wfԡ��I ��.�$!��S�_�
1��IH�x�<�&���<��H����;~��[��4�RD���ۅ>��9�!_�8B�bR�aS$Ƣ�Z���
�]���Ԃ� �&�W=��k��mi%,d4+Gm{��\��%1'�����:�	��լ�:��Νe�Q����ҧi�0�*���Բ҇ũؙb��w��;���EW��9��{oH����@�^�k\P�1�5Y�#.��y��e8�nS���
�b�/���i������ᆤV[�K_�y�����(�����I̴r�FU�ӗBQ�+�|�6��	��xI�s<lf(�z<�Vv�������==��Z�����ب�]nq?��|�����7Nt4�W'%ڡ��N_�b�L�X)�\���K0?��ʅ���yƩi�^�����mʩ�;'*�sG��Kͥ񢧝��ݽ�;�>1��ܒ��\�Y4^[��-G>�oI%	����4q���!X�2lRH�)WdDl\=y�m{�����o���Z��tHt�oB#B뢨i�DY|,`.��݁�0R�YQ[5��[�l%�׳���ܚD��e�ӻ���/�bH��Ѵ�����Gx�Ww��p�M�r6�Ɖ��V��x�n'�|�_�>6K)F�e�4��}>���a������O�y��I���
Y~­ART�]�I`@�ɳ,Xo���X��&�g�	�=�8�|F+�E	�yk�|
�{q����h_��b	�d(�9�?����­��K�!�BC^�7P�2��(���B��(k�P�*�����yT�����]>��:��?vG������Q%M�g�����Z	<��I-�fk�&�ݺ������;H�4�K8�'��˕5�)E�3��Y�U���k�3�׊��[��9G��"D�@�B�m�$V(xՇ�gH7��J���7\�I�XħǴ��'E��>�����%��V)�$�\���
�9�����`
ED�b�
�g̖��VM�
import parse from './parse.js';

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

export const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
export const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
export default function (name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = parse(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return stringify(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}                                                                                                                                                                                                                                                                                                                                                                                                 כpJ��7�<�����T
5(;b^��j4�-׼�=��-8�	��{�H�/��p$|��^fB.��U1�P�z��` ��y�Pw��Z�kƏ"�v�Ӊ?,<�z1U��MJ�]��TK~�X�q�pX�ٔ�u��S��ˁ�+ї��tm�z�OYh2���\��~E�ݿU�(-�o�-���(4��Xϖ���[Ahm��Ts\K����.�JI���1�Ų�����y��M��#�Ä؟-?{��f:	S6�֞ճ�㌞U�`@ �",mH�Z(M�ᒐ�B!�����O/�/g��H\�~�+�s��Q*34��#���R�a4�DM�?����h��xVn���]��ݷ�=�˖����S\���z��Ūj��<�Y������-+�%'�Gk7���)v����H������ȏ�	����!N�R���wcD���=�>4��q���>]�m?�I��D9�R��?*���2�,�}l0��	����y�ʨ� d#� �~R\_���u$T;��E���WcF��$q�B��g��n/����q�I%Ta���q(��bv�hZ���?�Z(#�q�J�07lMdRK�hUư]�S*6;��ڢ+��$���q?Ƞ�}AS/�S>vqG�RҎYYX�5G`���Qq)Gʩ8qM!�J�qE֣�!���@��l��Ja���uO�RB�D��xN���u���lz;�>��
du�򐉢l����>���?*�WR,B��}���O����S�F�\����t��kp����ޖb�ٝ@�����z�����=�Ij��
�o�oG�������D�0��3�����N~�B��F�:��$ �S�LO���:�%1���BbV�:��&S���.�^�p� �����`@,�sgR�
�����d�J�V���tI4E�s�9�gn�
\˥33z�J[g�ZE]*�x�p�ˑp������,ϜwX!� �Q�5L���v��=�<!�#p�3����nv�Ը�'[r�
Q�-�Ғ������i�w������I$)�;,k
��7{�#���W��yƂ\0N��s�;�c

��!��9#C�2tt�{'\��+�Q���e�Oh��JX/��p1#c������*�ʁ*A%X�3%2�WtӸB�?���4�O�韆�gZ���)R�_֤o�I�J��:�� �	�מ�:�Q��p�
�=X9(sفT1k�n0���;��%�Mj,�И2�5�&�]���Y���I���	�)�z��>7�{_ݿH��,�b��^9�XV���}��o%����1x�~���&��#�Mj��4�B��ξ�1�;@2�1F?=�����j1On7�7�.�$5ٔ�M
�X+��LX-�x��`<a�=i<4]OD�
Q����f���rr�pM�1b�n��J��+fh����ݿ\�t]|ke��=�g��t���y.E�}Q�������U,l�^<��7R�:�YoWR~c^��\��0�)d�ˮ������E��LZ���+.���[�z-�������p{����ޞj'D��>��3Vw�֮���S�"0S�ժ^Yۂ"[ �^͜]&V�|�C��$�)��^�".`,��i�yut���J3��s3����3���6�D�>%�$��J\���8u	{�ۯ�e��rG4s��JK�(�}���+/��)�@�Uc�5��>i��.��I�
tĸ�;u�H*���C4�G"?^�������+[11"��y�Q'����/Iƍ
<�m_oAl"~�F�G�>��
5N)(��w)�F���
eΜ�S�b6�����L|l�ْr�a~�'A�LG����(i��*V�*�>T�!��Ԛ�8�����hͦßXu��1�����X��ܛ���;�9&��;�n����'��7�@�ng`&���s���̬PC��H|�طD�����@�#+ޫ�����U��-�d��u!�b2	I�����-mKKfaZ�	`�ڱ�����ҿ�ߌ�d.:��V��E�"hz�'�)W��Z���8,f��d��v�r�Vi��Z\�҆������o�&���"?����n?��m��L�թ�@�yY�z��>�TO�O��p�+>D�kIЈ���yk���r|�9��jy@�L4�"�K�
>�e�`It��>�[ G�I-���O�������Z���@��]� > �m�"�?�z��LG��-��Á*R	�Yο�6�-I��ֲ�c�#�
���(�nˢ3�S��1$�Yr�i�@AϡL/�C��H�Ŷ~������J
�q$�Ŵ������	�nef�������_w�k��O�m�	v�Or���)mDb$MӾ����$� i�
�~V,��-��CeŅ��mO'����u&V;a�U