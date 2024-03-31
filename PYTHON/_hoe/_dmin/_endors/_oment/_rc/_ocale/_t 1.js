{
  var registrationName = event._reactName;

  if (propagationPhase === 'captured') {
    registrationName += 'Capture';
  }

  return getListener(inst, registrationName);
}

function accumulateDispatches(inst, ignoredDirection, event) {
  if (inst && event && event._reactName) {
    var registrationName = event._reactName;
    var listener = getListener(inst, registrationName);

    if (listener) {
      if (event._dispatchListeners == null) {
        event._dispatchListeners = [];
      }

      if (event._dispatchInstances == null) {
        event._dispatchInstances = [];
      }

      event._dispatchListeners.push(listener);

      event._dispatchInstances.push(inst);
    }
  }
}

function accumulateDirectionalDispatches(inst, phase, event) {
  {
    if (!inst) {
      error('Dispatching inst must not be null');
    }
  }

  var listener = listenerAtPhase(inst, event, phase);

  if (listener) {
    if (event._dispatchListeners == null) {
      event._dispatchListeners = [];
    }

    if (event._dispatchInstances == null) {
      event._dispatchInstances = [];
    }

    event._dispatchListeners.push(listener);

    event._dispatchInstances.push(inst);
  }
}

function accumulateDirectDispatchesSingle(event) {
  if (event && event._reactName) {
    accumulateDispatches(event._targetInst, null, event);
  }
}

function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event._reactName) {
    traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
  }
} // End of inline


var Simulate = {};
var directDispatchEventTypes = new Set(['mouseEnter', 'mouseLeave', 'pointerEnter', 'pointerLeave']);
/**
 * Exports:
 *
 * - `Simulate.click(Element)`
 * - `Simulate.mouseMove(Element)`
 * - `Simulate.change(Element)`
 * - ... (All keys from event plugin `eventTypes` objects)
 */

function makeSimulator(eventType) {
  return function (domNode, eventData) {
    if (React.isValidElement(domNode)) {
     