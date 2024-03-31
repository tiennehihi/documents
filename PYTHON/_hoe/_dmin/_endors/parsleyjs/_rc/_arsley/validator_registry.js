for 'li', 'dd', 'dt' start tags in
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody


    if (specialTags.indexOf(tag) !== -1 && tag !== 'address' && tag !== 'div' && tag !== 'p') {
      ancestorInfo.listItemTagAutoclosing = null;
      ancestorInfo.dlItemTagAutoclosing = null;
    }

    ancestorInfo.current = info;

    if (tag === 'form') {
      ancestorInfo.formTag = info;
    }

    if (tag === 'a') {
      ancestorInfo.aTagInScope = info;
    }

    if (tag === 'button') {
      ancestorInfo.buttonTagInScope = info;
    }

    if (tag === 'nobr') {
      ancestorInfo.nobrTagInScope = info;
    }

    if (tag === 'p') {
      ancestorInfo.pTagInButtonScope = info;
    }

    if (tag === 'li') {
      ancestorInfo.listItemTagAutoclosing = info;
    }

    if (tag === 'dd' || tag === 'dt') {
      ancestorInfo.dlItemTagAutoclosing = info;
    }

    return ancestorInfo;
  };
  /**
   * Returns whether
   */


  var isTagValidWithParent = function (tag, parentTag) {
    // First, let's check if we're in an unusual parsing mode...
    switch (parentTag) {
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
      case 'select':
        return tag === 'option' || tag === 'optgroup' || tag === '#text';

      case 'optgroup':
        return tag === 'option' || tag === '#text';
      // Strictly speaking, seeing an <option> doesn't mean we're in a <select>
      // but

      case 'option':
        return tag === '#text';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
      // No special behavior since these rules fall back to "in body" mode for
      // all except special table nodes which cause bad parsing behavior anyway.
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr

      case 'tr':
        return tag === 'th' || tag === 'td' || tag === 'style' || tag === 'script' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody

      case 'tbody':
      case 'thead':
      case 'tfoot':
        return tag === 'tr' || tag === 'style' || tag === 'script' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup

      case 'colgroup':
        return tag === 'col' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable

      case 'table':
        return tag === 'caption' || tag === 'colgroup' || tag === 'tbody' || tag === 'tfoot' || tag === 'thead' || tag === 'style' || tag === 'script' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead

      case 'head':
        return tag === 'base' || tag === 'basefont' || tag === 'bgsound' || tag === 'link' || tag === 'meta' || tag === 'title' || tag === 'noscript' || tag === 'noframes' || tag === 'style' || tag === 'script' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element

      case 'html':
        return tag === 'head' || tag === 'body' || tag === 'frameset';

      case 'frameset':
        return tag === 'frame';

      case '#document':
        return tag === 'html';
    } // Probably in the "in body" parsing mode, so we outlaw only tag combos
    // where the parsing rules cause implicit opens or closes to be added.
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody


    switch (tag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return parentTag !== 'h1' && parentTag !== 'h2' && parentTag !== 'h3' && parentTag !== 'h4' && parentTag !== 'h5' && parentTag !== 'h6';

      case 'rp':
      case 'rt':
        return impliedEndTags.indexOf(parentTag) === -1;

      case 'body':
      case 'caption':
      case 'col':
      case 'colgroup':
      case 'frameset':
      case 'frame':
      case 'head':
      case 'html':
      case 'tbody':
      case 'td':
      case 'tfoot':
      case 'th':
      case 'thead':
      case 'tr':
        // These tags are only valid with a few parents that have special child
        // parsing rules -- if we're down here, then none of those matched and
        // so we allow it only if we don't know what the parent is, as all other
        // cases are invalid.
        return parentTag == null;
    }

    return true;
  };
  /**
   * Returns whether
   */


  var findInvalidAncestorForTag = function (tag, ancestorInfo) {
    switch (tag) {
      case 'address':
      case 'article':
      case 'aside':
      case 'blockquote':
      case 'center':
      case 'details':
      case 'dialog':
      case 'dir':
      case 'div':
      case 'dl':
      case 'fieldset':
      case 'figcaption':
      case 'figure':
      case 'footer':
      case 'header':
      case 'hgroup':
      case 'main':
      case 'menu':
      case 'nav':
      case 'ol':
      case 'p':
      case 'section':
      case 'summary':
      case 'ul':
      case 'pre':
      case 'listing':
      case 'table':
      case 'hr':
      case 'xmp':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return ancestorInfo.pTagInButtonScope;

      case 'form':
        return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;

      case 'li':
        return ancestorInfo.listItemTagAutoclosing;

      case 'dd':
      case 'dt':
        return ancestorInfo.dlItemTagAutoclosing;

      case 'button':
        return ancestorInfo.buttonTagInScope;

      case 'a':
        // Spec says something about storing a list of markers, but it sounds
        // equivalent to this check.
        return ancestorInfo.aTagInScope;

      case 'nobr':
        return ancestorInfo.nobrTagInScope;
    }

    return null;
  };

  var didWarn$1 = {};

  validateDOMNesting = function (childTag, childText, ancestorInfo) {
    ancestorInfo = ancestorInfo || emptyAncestorInfo;
    var parentInfo = ancestorInfo.current;
    var parentTag = parentInfo && parentInfo.tag;

    if (childText != null) {
      if (childTag != null) {
        error('validateDOMNesting: when childText is passed, childTag should be null');
      }

      childTag = '#text';
    }

    var invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo;
    var invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo);
    var invalidParentOrAncestor = invalidParent || invalidAncestor;

    if (!invalidParentOrAncestor) {
      return;
    }

    var ancestorTag = invalidParentOrAncestor.tag;
    var warnKey = !!invalidParent + '|' + childTag + '|' + ancestorTag;

    if (didWarn$1[warnKey]) {
      return;
    }

    didWarn$1[warnKey] = true;
    var tagDisplayName = childTag;
    var whitespaceInfo = '';

    if (childTag === '#text') {
      if (/\S/.test(childText)) {
        tagDisplayName = 'Text nodes';
      } else {
        tagDisplayName = 'Whitespace text nodes';
        whitespaceInfo = " Make sure you don't have any extra whitespace between tags on " + 'each line of your source code.';
      }
    } else {
      tagDisplayName = '<' + childTag + '>';
    }

    if (invalidParent) {
      var info = '';

      if (ancestorTag === 'table' && childTag === 'tr') {
        info += ' Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by ' + 'the browser.';
      }

      error('validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s', tagDisplayName, ancestorTag, whitespaceInfo, info);
    } else {
      error('validateDOMNesting(...): %s cannot appear as a descendant of ' + '<%s>.', tagDisplayName, ancestorTag);
    }
  };
}

var SUPPRESS_HYDRATION_WARNING$1 = 'suppressHydrationWarning';
var SUSPENSE_START_DATA = '$';
var SUSPENSE_END_DATA = '/$';
var SUSPENSE_PENDING_START_DATA = '$?';
var SUSPENSE_FALLBACK_START_DATA = '$!';
var STYLE$1 = 'style';
var eventsEnabled = null;
var selectionInformation = null;
function getRootHostContext(rootContainerInstance) {
  var type;
  var namespace;
  var nodeType = rootContainerInstance.nodeType;

  switch (nodeType) {
    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      {
        type = nodeType === DOCUMENT_NODE ? '#document' : '#fragment';
        var root = rootContainerInstance.documentElement;
        namespace = root ? root.namespaceURI : getChildNamespace(null, '');
        break;
      }

    default:
      {
        var container = nodeType === COMMENT_NODE ? rootContainerInstance.parentNode : rootContainerInstance;
        var ownNamespace = container.namespaceURI || null;
        type = container.tagName;
        namespace = getChildNamespace(ownNamespace, type);
        break;
      }
  }

  {
    var validatedTag = type.toLowerCase();
    var ancestorInfo = updatedAncestorInfo(null, validatedTag);
    return {
      namespace: namespace,
      ancestorInfo: ancestorInfo
    };
  }
}
function getChildHostContext(parentHostContext, type, rootContainerInstance) {
  {
    var parentHostContextDev = parentHostContext;
    var namespace = getChildNamespace(parentHostContextDev.namespace, type);
    var ancestorInfo = updatedAncestorInfo(parentHostContextDev.ancestorInfo, type);
    return {
      namespace: namespace,
      ancestorInfo: ancestorInfo
    };
  }
}
function getPublicInstance(instance) {
  return instance;
}
function prepareForCommit(containerInfo) {
  eventsEnabled = isEnabled();
  selectionInformation = getSelectionInformation();
  var activeInstance = null;

  setEnabled(false);
  return activeInstance;
}
function resetAfterCommit(containerInfo) {
  restoreSelection(selectionInformation);
  setEnabled(eventsEnabled);
  eventsEnabled = null;
  selectionInformation = null;
}
function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
  var parentNamespace;

  {
    // TODO: take namespace into account when validating.
    var hostContextDev = hostContext;
    validateDOMNesting(type, null, hostContextDev.ancestorInfo);

    if (typeof props.children === 'string' || typeof props.children === 'number') {
      var string = '' + props.children;
      var ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type);
      validateDOMNesting(null, string, ownAncestorInfo);
    }

    parentNamespace = hostContextDev.namespace;
  }

  var domElement = createElement(type, props, rootContainerInstance, parentNamespace);
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
function appendInitialChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
function finalizeInitialChildren(domElement, type, props, rootContainerInstance, hostContext) {
  setInitialProperties(domElement, type, props, rootContainerInstance);

  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus;

    case 'img':
      return true;

    default:
      return false;
  }
}
function prepareUpdate(domElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
  {
    var hostContextDev = hostContext;

    if (typeof newProps.children !== typeof oldProps.child