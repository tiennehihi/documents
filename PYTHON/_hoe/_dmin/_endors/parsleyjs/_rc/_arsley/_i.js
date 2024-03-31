gs, nativeEvent, targetInst, targetContainer) {
  var ancestorInst = targetInst;

  if ((eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE) === 0 && (eventSystemFlags & IS_NON_DELEGATED) === 0) {
    var targetContainerNode = targetContainer; // If we are using the legacy FB support flag, we

    if (targetInst !== null) {
      // The below logic attempts to work out if we need to change
      // the target fiber to a different ancestor. We had similar logic
      // in the legacy event system, except the big difference between
      // systems is that the modern event system now has an event listener
      // attached to each React Root and React Portal Root. Together,
      // the DOM nodes representing these roots are the "rootContainer".
      // To figure out which ancestor instance we should use, we traverse
      // up the fiber tree from the target instance and attempt to find
      // root boundaries that match that of our current "rootContainer".
      // If we find that "rootContainer", we find the parent fiber
      // sub-tree for that root and make that our ancestor instance.
      var node = targetInst;

      mainLoop: while (true) {
        if (node === null) {
          return;
        }

        var nodeTag = node.tag;

        if (nodeTag === HostRoot || nodeTag === HostPortal) {
          var container = node.stateNode.containerInfo;

          if (isMatchingRootContainer(container, targetContainerNode)) {
            break;
          }

          if (nodeTag === HostPortal) {
            // The target is a portal, but it's not the rootContainer we're looking for.
            // Normally portals handle their own events all the way down to the root.
            // So we should be able to stop now. However, we don't know if this portal
            // was part of *our* root.
            var grandNode = node.return;

            while (grandNode !== null) {
              var grandTag = grandNode.tag;

              if (grandTag === HostRoot || grandTag === HostPortal) {
                var grandContainer = grandNode.stateNode.containerInfo;

                if (isMatchingRootContainer(grandContainer, targetContainerNode)) {
                  // This is the rootContainer we're looking for and we found it as
                  // a parent of the Portal. That means we can ignore it because the
                  // Portal will bubble through to us.
                  return;
                }
              }

              grandNode = grandNode.return;
            }
          } // Now we need to find it's corresponding host fiber in the other
          // tree. To do this we can use getClosestInstanceFromNode, but we
          // need to validate that the fiber is a host instance, otherwise
          // we need to traverse up through the DOM till we find the correct
          // node that is from the other tree.


          while (container !== null) {
            var parentNode = getClosestInstanceFromNode(container);

            if (parentNode === null) {
              return;
            }

            var parentTag = parentNode.tag;

            if (parentTag === HostComponent || parentTag === HostText) {
              node = ancestorInst = parentNode;
              continue mainLoop;
            }

            container = container.parentNode;
          }
        }

        node = node.return;
      }
    }
  }

  batchedUpdates(function () {
    return dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, ancestorInst);
  });
}

function createDispatchListener(instance, listener, currentTarget) {
  return {
    instance: instance,
    listener: listener,
    currentTarget: currentTarget
  };
}

function accumulateSinglePhaseListeners(targetFiber, reactName, nativeEventType, inCapturePhase, accumulateTargetOnly, nativeEvent) {
  var captureName = reactName !== null ? reactName + 'Capture' : null;
  var reactEventName = inCapturePhase ? captureName : reactName;
  var listeners = [];
  var instance = targetFiber;
  var lastHostComponent = null; // Accumulate all instances and listeners via the target -> root path.

  while (instance !== null) {
    var _instance2 = instance,
        stateNode = _instance2.stateNode,
        tag = _instance2.tag; // Handle listeners that are on HostComponents (i.e. <div>)

    if (tag === HostComponent && stateNode !== null) {
      lastHostComponent = stateNode; // createEventHandle listeners


      if (reactEventName !== null) {
        var listener = getListener(instance, reactEventName);

        if (listener != null) {
          listeners.push(createDispatchListener(instance, listener, lastHostComponent));
        }
      }
    } // If we are only accumulating events for the target, then we don't
    // continue to propagate through the React fiber tree to find other
    // listeners.


    if (accumulateTargetOnly) {
      break;
    } // If we are processing the onBeforeBlur event, then we need to take

    instance = instance.return;
  }

  return listeners;
} // We should only use this function for:
// - BeforeInputEventPlugin
// - ChangeEventPlugin
// - SelectEventPlugin
// This is because we only process these plugins
// in the bubble phase, so we need to accumulate two
// phase event listeners (via emulation).

function accumulateTwoPhaseListeners(targetFiber, reactName) {
  var captureName = reactName + 'Capture';
  var listeners = [];
  var instance = targetFiber; // Accumulate all instances and listeners via the target -> root path.

  while (instance !== null) {
    var _instance3 = instance,
        stateNode = _instance3.stateNode,
        tag = _instance3.tag; // Handle listeners that are on HostComponents (i.e. <div>)

    if (tag === HostComponent && stateNode !== null) {
      var currentTarget = stateNode;
      var captureListener = getListener(instance, captureName);

      if (captureListener != null) {
        listeners.unshift(createDispatchListener(instance, captureListener, currentTarget));
      }

      var bubbleListener = getListener(instance, reactName);

      if (bubbleListener != null) {
        listeners.push(createDispatchListener(instance, bubbleListener, currentTarget));
      }
    }

    instance = instance.return;
  }

  return listeners;
}

function getParent(inst) {
  if (inst === null) {
    return null;
  }

  do {
    inst = inst.return; // TODO: If this is a HostRoot we might want to bail out.
    // That is depending on if we want nested subtrees (layers) to bubble
    // events to their parent. We could also go through parentNode on the
    // host node but that wouldn't work for React Native and doesn't let us
    // do the portal feature.
  } while (inst && inst.tag !== HostComponent);

  if (inst) {
    return inst;
  }

  return null;
}
/**
 * Return the lowest common ancestor of A and B, or null if they are in
 * different trees.
 */


function getLowestCommonAncestor(instA, instB) {
  var nodeA = instA;
  var nodeB = instB;
  var depthA = 0;

  for (var tempA = nodeA; tempA; tempA = getParent(tempA)) {
    depthA++;
  }

  var depthB = 0;

  for (var tempB = nodeB; tempB; tempB = getParent(tempB)) {
    depthB++;
  } // If A is deeper, crawl up.


  while (depthA - depthB > 0) {
    nodeA = getParent(nodeA);
    depthA--;
  } // If B is deeper, crawl up.


  while (depthB - depthA > 0) {
    nodeB = getParent(nodeB);
    depthB--;
  } // Walk in lockstep until we find a match.


  var depth = depthA;

  while (depth--) {
    if (nodeA === nodeB || nodeB !== null && nodeA === nodeB.alternate) {
      return nodeA;
    }

    nodeA = getParent(nodeA);
    nodeB = getParent(nodeB);
  }

  return null;
}

function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
  var registrationName = event._reactName;
  var listeners = [];
  var instance = target;

  while (instance !== null) {
    if (instance === common) {
      break;
    }

    var _instance4 = instance,
        alternate = _instance4.alternate,
        stateNode = _instance4.stateNode,
        tag = _instance4.tag;

    if (alternate !== null && alternate === common) {
      break;
    }

    if (tag === HostComponent && stateNode !== null) {
      var currentTarget = stateNode;

      if (inCapturePhase) {
        var captureListener = getListener(instance, registrationName);

        if (captureListener != null) {
          listeners.unshift(createDispatchListener(instance, captureListener, currentTarget));
        }
      } else if (!inCapturePhase) {
        var bubbleListener = getListener(instance, registrationName);

        if (bubbleListener != null) {
          listeners.push(createDispatchListener(instance, bubbleListener, currentTarget));
        }
      }
    }

    instance = instance.return;
  }

  if (listeners.length !== 0) {
    dispatchQueue.push({
      event: event,
      listeners: listeners
    });
  }
} // We should only use this function for:
// - EnterLeaveEventPlugin
// This is because we only process this plugin
// in the bubble phase, so we need to accumulate two
// phase event listeners.


function accumulateEnterLeaveTwoPhaseListeners(dispatchQueue, leaveEvent, enterEvent, from, to) {
  var common = from && to ? getLowestCommonAncestor(from, to) : null;

  if (from !== null) {
    accumulateEnterLeaveListenersForEvent(dispatchQueue, leaveEvent, from, common, false);
  }

  if (to !== null && enterEvent !== null) {
    accumulateEnterLeaveListenersForEvent(dispatchQueue, enterEvent, to, common, true);
  }
}
function getListenerSetKey(domEventName, capture) {
  return domEventName + "__" + (capture ? 'capture' : 'bubble');
}

var didWarnInvalidHydration = false;
var DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
var SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning';
var SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning';
var AUTOFOCUS = 'autoFocus';
var CHILDREN = 'children';
var STYLE = 'style';
var HTML$1 = '__html';
var warnedUnknownTags;
var validatePropertiesInDevelopment;
var warnForPropDifference;
var warnForExtraAttributes;
var warnForInvalidEventListener;
var canDiffStyleForHydrationWarning;
var normalizeHTML;

{
  warnedUnknownTags = {
    // There are working polyfills for <dialog>. Let people use it.
    dialog: true,
    // Electron ships a custom <webview> tag to display external web content in
    // an isolated frame and process.
    // This tag is not present in non Electron environments such as JSDom which
    // is often used for testing purposes.
    // @see https://electronjs.org/docs/api/webview-tag
    webview: true
  };

  validatePropertiesInDevelopment = function (type, props) {
    validateProperties(type, props);
    validateProperties$1(type, props);
    validateProperties$2(type, props, {
      registrationNameDependencies: registrationNameDependencies,
      possibleRegistrationNames: possibleRegistrationNames
    });
  }; // IE 11 parses & normalizes the style attribute as opposed to other
  // browsers. It adds spaces and sorts the properties in some
  // non-alphabetical order. Handling that would require sorting CSS
  // properties in the client & server versions or applying
  // `expectedStyle` to a temporary DOM node to read its `style` attribute
  // normalized. Since it only affects IE, we're skipping style warnings
  // in that browser completely in favor of doing all that work.
  // See https://github.com/facebook/react/issues/11807


  canDiffStyleForHydrationWarning = canUseDOM && !document.documentMode;

  warnForPropDifference = function (propName, serverValue, clientValue) {
    if (didWarnInvalidHydration) {
      return;
    }

    var normalizedClientValue = normalizeMarkupForTextOrAttribute(clientValue);
    var normalizedServerValue = normalizeMarkupForTextOrAttribute(serverValue);

    if (normalizedServerValue === normalizedClientValue) {
      return;
    }

    didWarnInvalidHydration = true;

    error('Prop `%s` did not match. Server: %s Client: %s', propName, JSON.stringify(normalizedServerValue), JSON.stringify(normalizedClientValue));
  };

  war