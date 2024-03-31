ifierState,
  // Legacy Interface
  charCode: function (event) {
    // `charCode` is the result of a KeyPress event and represents the value of
    // the actual printable character.
    // KeyPress is deprecated, but its replacement is not yet final and not
    // implemented in any major browser. Only KeyPress has charCode.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }

    return 0;
  },
  keyCode: function (event) {
    // `keyCode` is the result of a KeyDown/Up event and represents the value of
    // physical keyboard key.
    // The actual meaning of the value depends on the users' keyboard layout
    // which cannot be detected. Assuming that it is a US keyboard layout
    // provides a surprisingly accurate mapping for US and European users.
    // Due to this, it is left to the user to implement at this time.
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }

    return 0;
  },
  which: function (event) {
    // `which` is an alias for either `keyCode` or `charCode` depending on the
    // type of the event.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }

    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }

    return 0;
  }
});

var SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface);
/**
 * @interface PointerEvent
 * @see http://www.w3.org/TR/pointerevents/
 */

var PointerEventInterface = assign({}, MouseEventInterface, {
  pointerId: 0,
  width: 0,
  height: 0,
  pressure: 0,
  tangentialPressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  pointerType: 0,
  isPrimary: 0
});

var SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface);
/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */

var TouchEventInterface = assign({}, UIEventInterface, {
  touches: 0,
  targetTouches: 0,
  changedTouches: 0,
  altKey: 0,
  metaKey: 0,
  ctrlKey: 0,
  shiftKey: 0,
  getModifierState: getEventModifierState
});

var SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface);
/**
 * @interface Event
 * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
 */

var TransitionEventInterface = assign({}, EventInterface, {
  propertyName: 0,
  elapsedTime: 0,
  pseudoElement: 0
});

var SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface);
/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */

var WheelEventInterface = assign({}, MouseEventInterface, {
  deltaX: function (event) {
    return 'deltaX' in event ? event.deltaX : // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
    'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
  },
  deltaY: function (event) {
    return 'deltaY' in event ? event.deltaY : // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
    'wheelDeltaY' in event ? -event.wheelDeltaY : // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
    'wheelDelta' in event ? -event.wheelDelta : 0;
  },
  deltaZ: 0,
  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: 0
});

var SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface);

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space

var START_KEYCODE = 229;
var canUseCompositionEvent = canUseDOM && 'CompositionEvent' in window;
var documentMode = null;

if (canUseDOM && 'documentMode' in document) {
  documentMode = document.documentMode;
} // Webkit offers a very useful `textInput` event that can be used to
// directly represent `beforeInput`. The IE `textinput` event is not as
// useful, so we don't use it.


var canUseTextInputEvent = canUseDOM && 'TextEvent' in window && !documentMode; // In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. Japanese ideographic
// spaces, for instance (\u3000) are not recorded correctly.

var useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);
var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

function registerEvents() {
  register