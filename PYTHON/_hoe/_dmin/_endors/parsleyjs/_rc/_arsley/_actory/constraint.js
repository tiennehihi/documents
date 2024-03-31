ild !== null || alternate !== null && alternate.child !== null) {
        // Next we need to figure out if the node that skipped past is
        // nested within a dehydrated boundary and if so, which one.
        var suspenseInstance = getParentSuspenseInstance(targetNode);

        while (suspenseInstance !== null) {
          // We found a suspense instance. That means that we haven't
          // hydrated it yet. Even though we leave the comments in the
          // DOM after hydrating, and there are boundaries in the DOM
          // that could already be hydrated, we wouldn't have found them
          // through this pass since if the target is hydrated it would
          // have had an internalInstanceKey on it.
          // Let's get the fiber associated with the SuspenseComponent
          // as the deepest instance.
          var targetSuspenseInst = suspenseInstance[internalInstanceKey];

          if (targetSuspenseInst) {
            return targetSuspenseInst;
          } // If we don't find a Fiber on the comment, it might be because
          // we haven't gotten to hydrate it yet. There might still be a
          // parent boundary that hasn't above this one so we need to find
          // the outer most th