cial props
  // changed.

  switch (tag) {
    case 'input':
      // Update the wrapper around inputs *after* updating props. This has to
      // happen after `updateDOMProperties`. Otherwise HTML5 input validations
      // raise warnings and prevent the new value from being assigned.
      updateWrapper(domElement, nextRawProps);
      break;

    case 'textarea':
      updateWrapper$1(domElement, nextRawProps);
      break;

    case 'select':
      // <select> value update needs to occur after <option> children
      // reconciliation
      postUpdateWrapper(domElement, nextRawProps);
      break;
  }
}

function getPossibleStandardName(propName) {
  {
    var lowerCasedName = propName.toLowerCase();

    if (!possibleStandardNames.hasOwnProperty(lowerCasedName)) {
      return null;
    }

    return possibleStandardNames[lowerCasedName] || null;
  }
}

function diffHydratedProperties(domElement, tag, rawProps, parentNamespace, rootContainerElement, isConcurrentMode, shouldWarnDev) {
  var isCustomComponentTag;
  var extraAttributeNames;

  {
    isCustomComponentTag = isCustomComponent(tag, rawProps);
    validatePropertiesInDevelopment(tag, rawProps);
  } // TODO: Make sure that we check isMounted before firing any of these events.


  switch (tag) {
    case 'dialog':
      listenToNonDelegatedEvent('cancel', domElement);
      listenToNonDelegatedEvent('close', domElement);
      break;

    case 'iframe':
    case 'object':
    case 'embed':
      // We listen to this event in case to ensure emulated bubble
      // listeners still fire for the load event.
      listenToNonDelegatedEvent('load', domElement);
      break;

    case 'video':
    case 'audio':
      // We listen to these events in case to ensure emulated bubble
      // listeners still fire for all the media events.
      for (var i = 0; i < mediaEventTypes.length; i++) {
        listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
      }

      break;

    case 'source':
      // We listen to this event in case to ensure emulated bubble
      // listeners still fire for the error event.
      listenToNonDelegatedEvent('error', domElement);
      break;

    case 'img':
    case 'image':
    case 'link':
      // We listen to these events in case to ensure emulated bubble
      // listeners still fire for error and load events.
      listenToNonDelegatedEvent('error', domElement);
      listenToNonDelegatedEvent('load', domElement);
      break;

    case 'details':
      // We listen to this event in case to ensure emulated bubble
      // listeners still fire for the toggle event.
      listenToNonDelegatedEvent('toggle', domElement);
      break;

    case 'input':
      initWrapperState(domElement, rawProps); // We listen to this event in case to ensure emulated bubble
      // listeners still fire for the invalid event.

      listenToNonDelegatedEvent('invalid', domElement);
      break;

    case 'option':
      validateProps(domElement, rawProps);
      break;

    case 'select':
      initWrapperState$1(domElement, rawProps); // We listen to this event in case to ensure emulated bubble
      // listeners still fire for the invalid event.

      listenToNonDelegatedEvent('invalid', domElement);
      break;

    case 'textarea':
      initWrapperState$2(domElement, rawProps); // We listen to this event in case to ensure emulated bubble
      // listeners still fire for the invalid event.

      listenToNonDelegatedEvent('invalid', domElement);
      break;
  }

  assertValidProps(tag, rawProps);

  {
    extraAttributeNames = new Set();
    var attributes = domElement.attributes;

    for (var _i = 0; _i < attributes.length; _i++) {
      var name = attributes[_i].name.toLowerCase();

      switch (name) {
        // Controlled attributes are not validated
        // TODO: Only ignore them on controlled tags.
        case 'value':
          break;

        case 'checked':
          break;

        case 'selected':
          break;

        default:
          // Intentionally use the original name.
          // See discussion in https://github.com/facebook/react/pull/10676.
          extraAttributeNames.add(attributes[_i].name);
      }
    }
  }

  var updatePayload = null;

  for (var propKey in rawProps) {
    if (!rawProps.hasOwnProperty(propKey)) {
      continue;
    }

    var nextProp = rawProps[propKey];

    if (propKey === CHILDREN) {
      // For text content children we compare against textContent. This
      // might match additional HTML that is hidden when we read it using
      // textContent. E.g. "foo" will match "f<span>oo</span>" but that still
      // satisfies our requirement. Our requirement is not to produce perfect
      // HTML and attributes. Ideally we should preserve 