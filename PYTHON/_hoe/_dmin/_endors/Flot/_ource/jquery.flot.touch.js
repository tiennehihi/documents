ent), node) : node;
  }
  function createJSDocCallbackTag(tagName, typeExpression, fullName, comment) {
    const node = createBaseJSDocTagDeclaration(345 /* JSDocCallbackTag */, tagName ?? createIdentifier("callback"), comment);
    node.typeExpression = typeExpression;
    node.fullName = fullName;
    node.name = getJSDocTypeAliasName(fullName);
    node.locals = void 0;
    node.nextContainer = void 0;
    return node;
  }
  function updateJSDocCallbackTag(node, tagName = getDefaultTagName(node), typeExpression, fullName, comment) {
    return node.tagName !== tagName || node.typeExpression !== typeExpression || node.fullName !== fullName || node.comment !== comment ? update(createJSDocCallbackTag(tagName, typeExpression, fullName, comment), node) : node;
  }
  function createJSDocOverloadTag(tagName, typeExpression, comment) {
    const node = createBaseJSDocTag(346 /* JSDocOverloadTag */, tagName ?? createIdentifier("overload"), comment);
    node.typeExpression = typeExpression;
    return node;
  }
  function updateJSDocOverloadTag(node, tagName = getDefaultTagName(node), typeExpression, comment) {
    return node.tagName !== tagName || node.typeExpression !== typeExpression || node.comment !== comment ? update(createJSDocOverloadTag(tagName, typeExpression, comment), node) : node;
  }
  function createJSDocAugmentsTag(tagName, className, comment) {
    const node = createBaseJSDocTag(335 /* JSDocAugmentsTag */, tagName ?? createIdentifier("augments"), comment);
    node.class = className;
    return node;
  }
  function updateJSDocAugmentsTag(node, tagName = getDefaultTagName(node), className, comment) {
    return node.tagName !== tagName || node.class !== className || node.comment !== comment ? update(createJSDocAugmentsTag(tagName, className, comment), node) : node;
  }
  function createJSDocImplementsTag(tagName, className, comment) {
    const node = createBaseJSDocTag(336 /* JSDocImplementsTag */, tagName ?? createIdentifier("implements"), comment);
    node.class = className;
    return node;
  }
  function createJSDocSeeTag(tagName, name, comment) {
    const node = createBaseJSDocTag(354 /* JSDocSeeTag */, tagName ?? createIdentifier("see"), comment);
    node.name = name;
    return node;
  }
  function updateJSDocSeeTag(node, tagName, name, comment) {
    return node.tagName !== tagName || node.name !== name || node.comment !== comment ? update(createJSDocSeeTag(tagName, name, comment), node) : node;
  }
  function createJSDocNameReference(name) {
    const node = createBaseNode(317 /* JSDocNameReference */);
    node.name = name;
    return node;
  }
  function updateJSDocNameReference(node, name) {
    return node.name !== name ? update(createJSDocNameReference(name), node) : node;
  }
  function createJSDocMemberName(left, right) {
    const node = createBaseNode(318 /* JSDocMemberName */);
    node.left = left;
    node.right = right;
    node.transformFlags |= propagateChildFlags(node.left) | propagateChildFlags(node.right);
    return node;
  }
  function updateJSDocMemberName(node, left, right) {
    return node.left !== left || node.right !== right ? update(createJSDocMemberName(left, right), node) : node;
  }
  function createJSDocLink(name, text) {
    const node = createBaseNode(331 /* JSDocLink */);
    node.name = name;
    node.text = text;
    return node;
  }
  function updateJSDocLink(node, name, text) {
    return node.name !== name ? update(createJSDocLink(name, text), node) : node;
  }
  function createJSDocLinkCode(name, text) {
    const node = createBaseNode(332 /* JSDocLinkCode */);
    node.name = name;
    node.text = text;
    return node;
  }
  function updateJSDocLinkCode(node, name, text) {
    return node.name !== name ? update(createJSDocLinkCode(name, text), node) : node;
  }
  function createJSDocLinkPlain(name, text) {
    const node = createBaseNode(333 /* JSDocLinkPlain */);
    node.name = name;
    node.text = text;
    return node;
  }
  function updateJSDocLinkPlain(node, name, text) {
    return node.name !== name ? update(createJSDocLinkPlain(name, text), node) : node;
  }
  function updateJSDocImplementsTag(node, tagName = getDefaultTagName(node), className, comment) {
    return node.tagName !== tagName || node.class !== className || node.comment !== comment ? update(createJSDocImplementsTag(tagName, className, comment), node) : node;
  }
  function createJSDocSimpleTagWorker(kind, tagName, comment) {
    const node = createBaseJSDocTag(kind, tagName ?? createIdentifier(getDefaultTagNameForKind(kind)), comment);
    return node;
  }
  function updateJSDocSimpleTagWorker(kind, node, tagName = getDefaultTagName(node), comment) {
    return node.tagName !== tagName || node.comment !== comment ? update(createJSDocSimpleTagWorker(kind, tagName, comment), node) : node;
  }
  function createJSDocTypeLikeTagWorker(kind, tagName, typeExpression, comment) {
    const node = createBaseJSDocTag(kind, tagName ?? createIdentifier(getDefaultTagNameForKind(kind)), comment);
    node.typeExpression = typeExpression;
    return node;
  }
  function updateJSDocTypeLikeTagWorker(kind, node, tagName = getDefaultTagName(node), typeExpression, comment) {
    return node.tagName !== tagName || node.typeExpression !== typeExpression || node.comment !== comment ? update(createJSDocTypeLikeTagWorker(kind, tagName, typeExpression, comment), node) : node;
  }
  function createJSDocUnknownTag(tagName, comment) {
    const node = createBaseJSDocTag(334 /* JSDocTag */, tagName, comment);
    return node;
  }
  function updateJSDocUnknownTag(node, tagName, comment) {
    return node.tagName !== tagName || node.comment !== comment ? update(createJSDocUnknownTag(tagName, comment), node) : node;
  }
  function createJSDocEnumTag(tagName, typeExpression, comment) {
    const node = createBaseJSDocTagDeclaration(347 /* JSDocEnumTag */, tagName ?? createIdentifier(getDefaultTagNameForKind(347 /* JSDocEnumTag */)), comment);
    node.typeExpression = typeExpression;
    node.locals = void 0;
    node.nextContainer = void 0;
    return node;
  }
  function updateJSDocEnumTag(node, tagName = getDefaultTagName(node), typeExpression, comment) {
    return node.tagName !== tagName || node.typeExpression !== typeExpression || node.comment !== comment ? update(createJSDocEnumTag(tagName, typeExpression, comment), node) : node;
  }
  function createJSDocText(text) {
    const node = createBaseNode(328 /* JSDocText */);
    node.text = text;
    return node;
  }
  function updateJSDocText(node, text) {
    return node.text !== text ? update(createJSDocText(text), node) : node;
  }
  function createJSDocComment(comment, tags) {
    const node = createBaseNode(327 /* JSDoc */);
    node.comment = comment;
    node.tags = asNodeArray(tags);
    return node;
  }
  function updateJSDocComment(node, comment, tags) {
    return node.comment !== comment || node.tags !== tags ? update(createJSDocComment(comment, tags), node) : node;
  }
  function createJsxElement(openingElement, children, closingElement) {
    const node = createBaseNode(284 /* JsxElement */);
    node.openingElement = openingElement;
    node.children = createNodeArray(children);
    node.closingElement = closingElement;
    node.transformFlags |= propagateChildFlags(node.openingElement) | propagateChildrenFlags(node.children) | propagateChildFlags(node.closingElement) | 2 /* ContainsJsx */;
    return node;
  }
  function updateJsxElement(node, openingElement, children, closingElement) {
    return node.openingElement !== openingElement || node.children !== children || node.closingElement !== closingElement ? update(createJsxElement(openingElement, children, closingElement), node) : node;
  }
  function createJsxSelfClosingElement(tagName, typeArguments, attributes) {
    const node = createBaseNode(285 /* JsxSelfClosingElement */);
    node.tagName = tagName;
    node.typeArguments = asNodeArray(typeArguments);
    node.attributes = attributes;
    node.transformFlags |= propagateChildFlags(node.tagName) | propagateChildrenFlags(node.typeArguments) | propagateChildFlags(node.attributes) | 2 /* ContainsJsx */;
    if (node.typeArguments) {
      node.transformFlags |= 1 /* ContainsTypeScript */;
    }
    return node;
  }
  function updateJsxSelfClosingElement(node, tagName, typeArguments, attributes) {
    return node.tagName !== tagName || node.typeArguments !== typeArguments || node.attributes !== attributes ? update(createJsxSelfClosingElement(tagName, typeArguments, attributes), node) : node;
  }
  function createJsxOpeningElement(tagName, typeArguments, attributes) {
    const node = createBaseNode(286 /* JsxOpeningElement */);
    node.tagName = tagName;
    node.typeArguments = asNodeArray(typeArguments);
    node.attributes = attributes;
    node.transformFlags |= propagateChildFlags(node.tagName) | propagateChildrenFlags(node.typeArguments) | propagateChildFlags(node.attributes) | 2 /* ContainsJsx */;
    if (typeArguments) {
      node.transformFlags |= 1 /* ContainsTypeScript */;
    }
    return node;
  }
  function updateJsxOpeningElement(node, tagName, typeArguments, attributes) {
    return node.tagName !== tagName || node.typeArguments !== typeArguments || node.attributes !== attributes ? update(createJsxOpeningElement(tagName, typeArguments, attributes), node) : node;
  }
  function createJsxClosingElement(tagName) {
    const node = createBaseNode(287 /* JsxClosingElement */);
    node.tagName = tagName;
    node.transformFlags |= propagateChildFlags(node.tagName) | 2 /* ContainsJsx */;
    return node;
  }
  function updateJsxClosingElement(node, tagName) {
    return node.tagName !== tagName ? update(createJsxClosingElement(tagName), node) : node;
  }
  function createJsxFragment(openingFragment, children, closingFragment) {
    const node = createBaseNode(288 /* JsxFragment */);
    node.openingFragment = openingFragment;
    node.children = createNodeArray(children);
    node.closingFragment = closingFragment;
    node.transformFlags |= propagateChildFlags(node.openingFragment) | propagateChildrenFlags(node.children) | propagateChildFlags(node.closingFragment) | 2 /* ContainsJsx */;
    return node;
  }
  function updateJsxFragment(node, openingFragment, children, closingFragment) {
    return node.openingFragment !== openingFragment || node.children !== children || node.closingFragment !== closingFragment ? update(createJsxFragment(openingFragment, children, closingFragment), node) : node;
  }
  function createJsxText(text, containsOnlyTriviaWhiteSpaces) {
    const node = createBaseNode(12 /* JsxText */);
    node.text = text;
    node.containsOnlyTriviaWhiteSpaces = !!containsOnlyTriviaWhiteSpaces;
    node.transformFlags |= 2 /* ContainsJsx */;
    return node;
  }
  function updateJsxText(node, text, containsOnlyTriviaWhiteSpaces) {
    return node.text !== text || node.containsOnlyTriviaWhiteSpaces !== con