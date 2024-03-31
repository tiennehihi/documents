t we
        // can allocate enough id slots to acommodate them. So we must exhaust
        // the iterator before we start recursively rendering the children.
        // TODO: This is not great but I think it's inherent to the id
        // generation algorithm.
        var step = iterator.next(); // If there are not entries, we need to push an empty so we start by checking that.

        if (!step.done) {
          var children = [];

          do {
            children.push(step.value);
            step = iterator.next();
          } while (!step.done);

          renderChildrenArray(request, task, children);
          return;
        }

        return;
      }
    }

    var childString = Object.prototype.toString.call(node);
    throw new Error("Objects are not valid as a React child (found: " + (childString === '[object Object]' ? 'object with keys {' + Object.keys(node).join(', ') + '}' : childString) + "). " + 'If you meant to render a collection of children, use an array ' + 'instead.');
  }

  if (typeof node === 'string') {
    var segment = task.blockedSegment;
    segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, node, request.responseState, segment.lastPushedText);
    return;
  }

  if (typeof node === 'number') {
    var _segment = task.blockedSegment;
    _segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, '' + node, request.responseState, _segment.lastPushedText);
    return;
  }

  {
    if (typeof node === 'function') {
      error('Functions are not valid as a React child. This may happen if ' + 'you return a Component instead of <Component /> from render. ' + 'Or maybe you meant to call this function rather than return it.');
    }
  }
}

function renderChildrenArray(request, task, children) {
  var totalChildren = children.length;

  for (var i = 0; i < totalChildren; i++) {
    var prevTreeContext = task.treeContext;
    task.treeContext = pushTreeContext(prevTreeContext, totalChildren, i);

    try {
      // We need to use the non-destructive form so that we can safely pop back
      // up and render the sibling if something suspends.
      renderNode(request, task, children[i]);
    } finally {
      task.treeContext = prevTreeContext;
    }
  }
}

function spawnNewSuspendedTask(request, task, x) {
  // Something suspended, we'll need to create a new segment and resolve it later.
  var segment = task.blockedSegment;
  var insertionIndex = segment.chunks.length;
  var newSegment = createPendingSegment(request, insertionIndex, null, segment.formatContext, // Adopt the parent segment's leading text embed
  segment.lastPushedText, // Assume we are text embedded at the trailing edge
  true);
  segment.children.push(newSegment); // Reset lastPushedText for current Segment since the new Segment "consumed" it

  segment.lastPushedText = false;
  var newTask = createTask(request, task.node, task.blockedBoundary, newSegment, task.abortSet, task.legacyContext, task.context, task.treeContext);

  {
    if (task.componentStack !== null) {
      // We pop one task off the stack because the node that suspended will be tried again,
      // which will add it back onto the stack.
      newTask.componentStack = task.componentStack.parent;
    }
  }

  var ping = newTask.ping;
  x.then(ping, ping);
} // This is a non-destructive form of rendering a node. If it suspends it spawns
// a new task and restores the context of this task to what it was before.


function renderNode(request, task, node) {
  // TODO: Store segment.children.length here and reset it in case something
  // suspended partially through writing something.
  // Snapshot the current context in case something throws to interrupt the
  // process.
  var previousFormatContext = task.blockedSegment.formatContext;
  var previousLegacyContext = task.legacyContext;
  var previousContext = task.context;
  var previousComponentStack = null;

  {
    previousComponentStack = task.componentStack;
  }

  try {
    return renderNodeDestructive(request, task, node);
  } catch (x) {
    resetHooksState();

    if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
      spawnNewSuspendedTask(request, task, x); // Restore the context. We assume that this will be restored by the inner
      // functions in case nothing throws so we don't use "finally" here.

      task.blockedSegment.formatContext = previousFormatContext;
      task.legacyContext = previousLegacyContext;
      task.context = previousContext; // Restore all active ReactContexts to what they were before.

      switchContext(previousContext);

      {
        task.componentStack = previousComponentStack;
      }

      return;
    } else {
      // Restore the context. We assume that this will be restored by the inner
      // functions in case nothing throws so we don't use "finally" here.
      task.blockedSegment.formatContext = previousFormatContext;
      task.legacyContext = previousLegacyContext;
      task.context = previousContext; // Restore all active ReactContexts to what they were before.

      switchContext(previousContext);

      {
        task.componentStack = previousComponentStack;
      } // We assume that we don't need the correct context.
      // Let's terminate the rest of the tree and don't render any siblings.


      throw x;
    }
  }
}

function erroredTask(request, boundary, segment, error) {
  // Report the error to a global handler.
  var errorDigest = logRecoverableError(request, error);

  if (boundary === null) {
    fatalError(request, error);
  } else {
    boundary.pendingTas