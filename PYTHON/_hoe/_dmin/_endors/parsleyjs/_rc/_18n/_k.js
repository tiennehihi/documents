nto the same form (same as #1939).
      // That's probably okay; we don't support it just as we don't support
      // mixing React radio buttons with non-React ones.


      var otherProps = getFiberCurrentPropsFromNode(otherNode);

      if (!otherProps) {
        throw new Error('ReactDOMInput: Mixing React and non-React radio inputs with the ' + 'same `name` is not supported.');
      } // We need update the tracked value on the named cousin since the value
      // was changed but the input saw no event or value set


      updateValueIfChanged(otherNode); // If this is a controlled radio button group, forcing the input that
      // was previously checked to update will cause it to be come re-checked
      // as appropriate.

      updateWrapper(otherNode, otherProps);
    }
  }
} // In Chrome, assigning defaultValue to certain input types triggers input validation.
// For number inputs, the display value loses trailing decimal points. For email inputs,
// Chrome raises "The specified value <x> is not a valid email address".
//
// Here we check to see if the defaultValue has actually changed, avoiding these problems
// when the user is inputting text
//
// https://github.com/facebook/react/issues/7253


function setDefaultValue(node, type, value) {
  if ( // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
  type !== 'number' || getActiveElement(node.ownerDocument) !== node) {
    if (value == null) {
      node.defaultValue = toString(node._wrapperState.initialValue);
    } else if (node.defaultValue !== toString(value)) {
      node.defaultValue = toString(value);
    }
  }
}

var didWarnSelectedSetOnOption = false;
var didWarnInvalidChild = false;
var di