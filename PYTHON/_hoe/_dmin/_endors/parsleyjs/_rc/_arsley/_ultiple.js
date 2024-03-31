pported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */

function isEventSupported(eventNameSuffix) {
  if (!canUseDOM) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = (eventName in document);

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  return isSupported;
}

function registerEvents$1() {
  registerTwoPhaseEvent('onChange', ['change', 'click', 'focusin', 'focusout', 'input', 'keydown', 'keyup', 'selectionchange']);
}

function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
  // Flag this event loop as needing state restore.
  enqueueStateRestore(target);
  var listeners = accumulateTwoPhaseListeners(inst, 'onChange');

  if (listeners.length > 0) {
    var event = new SyntheticEvent('onChange', 'change', null, nativeEvent, target);
    dispatchQueue.push({
      event: event,
      listeners: listeners
    });
  }
}
/**
 * For IE shims
 */


var activeElement = null;
var activeElementInst = null;
/**
 * SECTION: handle `change` event
 */

function shouldUseChangeEvent(elem) {
  var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
}

function manualDispatchChangeEvent(nativeEvent) {
  var dispatchQueue = [];
  createAndAccumulateChangeEvent(dispatchQueue, activeElementInst, nativeEvent, getEventTarget(nativeEvent)); // If change and propertychange bubbled, we'd just bind to it like all the
  // other events and have it go through ReactBrowserEventEmitter. Since it
  // doesn't, we manually listen for the events and so we have to enqueue and
  // process the abstract event manually.
  //
  // Batching is necessary here in order to ensure that all event handlers ru