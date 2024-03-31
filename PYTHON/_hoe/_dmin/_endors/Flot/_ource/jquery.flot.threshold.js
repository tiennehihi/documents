ext'.");
    }
    return text;
  }
  function getTransformFlagsOfTemplateLiteralLike(templateFlags) {
    let transformFlags = 1024 /* ContainsES2015 */;
    if (templateFlags) {
      transformFlags |= 128 /* ContainsES2018 */;
    }
    return transformFlags;
  }
  function createTemplateLiteralLikeToken(kind, text, rawText, templateFlags) {
    const node = createBaseToken(kind);
    node.text = text;
    node.rawText = rawText;
    node.templateFlags = templateFlags & 7176 /* TemplateLiteralLikeFlags */;
    node.transformFlags = getTransformFlagsOfTemplateLiteralLike(node.templateFlags);
    return node;
  }
  function createTemplateLiteralLikeDeclaration(kind, text, rawText, templateFlags) {
    const node = createBaseDeclaration(kind);
    node.text = text;
    node.rawText = rawText;
    node.templateFlags = templateFlags & 7176 /* TemplateLiteralLikeFlags */;
    node.transformFlags = getTransformFlagsOfTemplateLiteralLike(node.templateFlags);
    return node;
  }
  function createTemplateLiteralLikeNode(kind, text, rawText, templateFlags) {
    if (kind === 15 /* NoSubstitutionTemplateLiteral */) {
      return createTemplateLiteralLikeDeclaration(kind, text, rawText, templateFlags);
    }
    return createTemplateLiteralLikeToken(kind, text, rawText, templateFlags);
  }
  function createTemplateHead(text, rawText, templateFlags) {
    text = checkTemplateLiteralLikeNode(16 /* TemplateHead */, text, rawText, templateFlags);
    return createTemplateLiteralLikeNode(16 /* TemplateHead */, text, rawText, templateFlags);
  }
  function createTemplateMiddle(text, rawText, templateFlags) {
    text = checkTemplateLiteralLikeNode(16 /* TemplateHead */, text, rawText, templateFlags);
    return createTemplateLiteralLikeNode(17 /* TemplateMiddle */, text, rawText, templateFlags);
  }
  function createTemplateTail(text, rawText, templateFlags) {
    text = checkTemplateLiteralLikeNode(16 /* TemplateHead */, text, rawText, templateFlags);
    return createTemplateLiteralLikeNode(18 /* TemplateTail */, text, rawText, templateFlags);
  }
  function createNoSubstitutionTemplateLiteral(text, rawText, templateFlags) {
    text = checkTemplateLiteralLikeNode(16 /* TemplateHead */, text, rawText, templateFlags);
    return createTemplateLiteralLikeDeclaration(15 /* NoSubstitutionTemplateLiteral */, text, rawText, templateFlags);
  }
  function createYieldExpression(asteriskToken, expression) {
    Debug.assert(!asteriskToken || !!expression, "A `YieldExpression` with an asteriskToken must have an expression.");
    const node = createBaseNode(229 /* YieldExpression */);
    node.expression = expression && parenthesizerRules().parenthesizeExpressionForDisallowedComma(expression);
    node.asteriskToken = asteriskToken;
    node.transformFlags |= propagateChildFlags(node.expression) | propagateChildFlags(node.asteriskToken) | 1024 /* ContainsES2015 */ | 128 /* ContainsES2018 */ | 1048576 /* ContainsYield */;
    return node;
  }
  function updateYieldExpression(node, asteriskToken, expression) {
    return node.expression !== expression || node.asteriskToken !== asteriskToken ? update(createYieldExpression(asteriskToken, expression), node) : node;
  }
  function createSpreadElement(expression) {
    const node = createBaseNode(230 /* SpreadElement */);
    node.expression = parenthesizerRules().parenthesizeExpressionForDisallowedComma(expression);
    node.transformFlags |= propagateChildFlags(node.expression) | 1024 /* ContainsES2015 */ | 32768 /* ContainsRestOrSpread */;
    return node;
  }
  function updateSpreadElement(node, expression) {
    return node.expression !== expression ? update(createSpreadElement(expression), node) : node;
  }
  function createClassExpression(modifiers, name, typeParameters, heritageClauses, members) {
    const node = createBaseDeclaration(231 /* ClassExpression */);
    node.modifiers = asNodeArray(modifiers);
    node.name = asName(name);
    node.typeParameters = asNodeArray(typeParameters);
    node.heritageClauses = asNodeArray(heritageClauses);
    node.members = createNodeArray(members);
    node.transformFlags |= propagateChildrenFlags(node.modifiers) | propagateNameFlags(node.name) | propagateChildrenFlags(node.typeParameters) | propagateChildrenFlags(node.heritageClauses) | propagateChildrenFlags(node.members) | (node.typeParameters ? 1 /* ContainsTypeScript */ : 0 /* None */) | 1024 /* ContainsES2015 */;
    node.jsDoc = void 0;
    return node;
  }
  function updateClassExpression(node, modi