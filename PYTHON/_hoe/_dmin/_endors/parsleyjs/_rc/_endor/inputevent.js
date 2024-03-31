Instance);
    var prevHydrationParentFiber = hydrationParentFiber;

    if (!nextInstance || !tryHydrate(fiber, nextInstance)) {
      // Nothing to hydrate. Make it an insertion.
      insertNonHydratedInstance(hydrationParentFiber, fiber);
      isHydrating = false;
      hydrationParentFiber = fiber;
      return;
    } // We matched the next one, we'll now assume that the first one was
    // superfluous and we'll delete it. Since we can't eagerly delete it
    // we'll have to schedule a deletion. To do that, this node needs a dummy
    // fiber associated with it.


    deleteHydratableInstance(prevHydrationParentFiber, firstAttemptedInstance);
  }
}

function prepareToHydrateHostInstance(fiber, rootContainerInstance, hostContext) {

  var instance = fiber.stateNode;
  var shouldWarnIfMismatchDev = !didSuspendOrErrorDEV;
  var updatePayload = hydrateInstance(instance, fiber.type, fiber.memoizedProps, rootContainerInstance, hostContext, fiber, shouldWarnIfMismatchDev); // TODO: Type this specific to this type of component.

  fiber.updateQueue = updatePayload; // If the update payload indicates that there is a change or if there
  // is a new ref we mark this as an update.

  if (updatePayload !== null) {
    return true;
  }

  return false;
}

function prepareToHydrateHostTextInstance(fiber) {

  var textInstance = fiber.stateNode;
  var textContent = fiber.memoizedProps;
  var shouldUpdate = hydrateTextInstance(textInstance, textContent, fiber);

  if (shouldUpdate) {
    // We assume that prepareToHydrateHostTextInstance is called in a context where the
    // hydration parent is the parent host component of this host text.
    var returnFiber = hydrationParentFiber;

    if (returnFiber !== null) {
      switch (returnFiber.tag) {
        case HostRoot:
          {
            var parentContainer = returnFiber.stateNode.containerInfo;
         