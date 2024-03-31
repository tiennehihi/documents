lTypeNode(node, type) {
    return node.type !== type ? update(createOptionalTypeNode(type), node) : node;
  }
  function createRestTypeNode(type) {
    const node = createBaseNode(191 /* RestType */);
    node.type = type;
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function updateRestTypeNode(node, type) {
    return node.type !== type ? update(createRestTypeNode(type), node) : node;
  }
  function createUnionOrIntersectionTypeNode(kind, types, parenthesize) {
    const node = createBaseNode(kind);
    node.types = factory2.createNodeArray(parenthesize(types));
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function updateUnionOrIntersectionTypeNode(node, types, parenthesize) {
    return node.types !== types ? update(createUnionOrIntersectionTypeNode(node.kind, types, parenthesize), node) : node;
  }
  function createUnionTypeNode(types) {
    return createUnionOrIntersectionTypeNode(192 /* UnionType */, types, parenthesizerRules().parenthesizeConstituentTypesOfUnionType);
  }
  function updateUnionTypeNode(node, types) {
    return updateUnionOrIntersectionTypeNode(node, types, parenthesizerRules().parenthesizeConstituentTypesOfUnionType);
  }
  function createIntersectionTypeNode(types) {
    return createUnionOrIntersectionTypeNode(193 /* IntersectionType */, types, parenthesizerRules().parenthesizeConstituentTypesOfIntersectionType);
  }
  function updateIntersectionTypeNode(node, types) {
    return updateUnionOrIntersectionTypeNode(node, types, parenthesizerRules().parenthesizeConstituentTypesOfIntersectionType);
  }
  function createConditionalTypeNode(checkType, extendsType, trueType, falseType) {
    const node = createBaseNode(194 /* ConditionalType */);
    node.checkType = parenthesizerRules().parenthesizeCheckTypeOfConditionalType(checkType);
    node.extendsType = parenthesizerRules().parenthesizeExtendsTypeOfConditionalType(extendsType);
    node.trueType = trueType;
    node.falseType = falseType;
    node.transformFlags = 1 /* ContainsTypeScript */;
    node.locals = void 0;
    node.nextContainer = void 0;
    return node;
  }
  function updateConditionalTypeNode(node, checkType, extendsType, trueType, falseType) {
    return node.checkType !== checkType || node.extendsType !== extendsType || node.trueType !== trueType || node.falseType !== falseType ? update(createConditionalTypeNode(checkType, extendsType, trueType, falseType), node) : node;
  }
  function createInferTypeNode(typeParameter) {
    const node = createBaseNode(195 /* InferType */);
    node.typeParameter = typeParameter;
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function updateInferTypeNode(node, typeParameter) {
    return node.typeParameter !== typeParameter ? update(createInferTypeNode(typeParameter), node) : node;
  }
  function createTemplateLiteralType(head, templateSpans) {
    const node = createBaseNode(203 /* TemplateLiteralType */);
    node.head = head;
    node.templateSpans = createNodeArray(templateSpans);
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function updateTemplateLiteralType(node, head, templateSpans) {
    return node.head !== head || node.templateSpans !== templateSpans ? update(createTemplateLiteralType(head, templateSpans), node) : node;
  }
  function createImportTypeNode(argument, attributes, qualifier, typeArguments, isTypeOf = false) {
    const node = createBaseNode(205 /* ImportType */);
    node.argument = argument;
    node.attributes = attributes;
    if (node.assertions && node.assertions.assertClause && node.attributes) {
      node.assertions.assertClause = node.attributes;
    }
    node.qualifier = qualifier;
    node.typeArguments = typeArguments && parenthesizerRules().parenthesizeTypeArguments(typeArguments);
    node.isTypeOf = isTypeOf;
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function updateImportTypeNode(node, argument, attributes, qualifier, typeArguments, isTypeOf = node.isTypeOf) {
    return node.argument !== argument || node.attributes !== attributes || node.qualifier !== qualifier || node.typeArguments !== typeArguments || node.isTypeOf !== isTypeOf ? update(createImportTypeNode(argument, attributes, qualifier, typeArguments, isTypeOf), node) : node;
  }
  function createParenthesizedType(type) {
    const node = createBaseNode(196 /* ParenthesizedType */);
    node.type = type;
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function updateParenthesizedType(node, type) {
    return node.type !== type ? update(createParenthesizedType(type), node) : node;
  }
  function createThisTypeNode() {
    const node = createBaseNode(197 /* ThisType */);
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function createTypeOperatorNode(operator, type) {
    const node = createBaseNode(198 /* TypeOperator */);
    node.operator = operator;
    node.type = operator === 148 /* ReadonlyKeyword */ ? parenthesizerRules().parenthesizeOperandOfReadonlyTypeOperator(type) : parenthesizerRules().parenthesizeOperandOfTypeOperator(type);
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function updateTypeOperatorNode(node, type) {
    return node.type !== type ? update(createTypeOperatorNode(node.operator, type), node) : node;
  }
  function createIndexedAccessTypeNode(objectType, indexType) {
    const node = createBaseNode(199 /* IndexedAccessType */);
    node.objectType = parenthesizerRules().parenthesizeNonArrayTypeOfPostfixType(objectType);
    node.indexType = indexType;
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function updateIndexedAccessTypeNode(node, objectType, indexType) {
    return node.objectType !== objectType || node.indexType !== indexType ? update(createIndexedAccessTypeNode(objectType, indexType), node) : node;
  }
  function createMappedTypeNode(readonlyToken, typeParameter, nameType, questionToken, type, members) {
    const node = createBaseDeclaration(200 /* MappedType */);
    node.readonlyToken = readonlyToken;
    node.typeParameter = typeParameter;
    node.nameType = nameType;
    node.questionToken = questionToken;
    node.type = type;
    node.members = members && createNodeArray(members);
    node.transformFlags = 1 /* ContainsTypeScript */;
    node.locals = void 0;
    node.nextContainer = void 0;
    return node;
  }
  function updateMappedTypeNode(node, readonlyToken, typeParameter, nameType, questionToken, type, members) {
    return node.readonlyToken !== readonlyToken || node.typeParameter !== typeParameter || node.nameType !== nameType || node.questionToken !== questionToken || node.type !== type || node.members !== members ? update(createMappedTypeNode(readonlyToken, typeParameter, nameType, questionToken, type, members), node) : node;
  }
  function createLiteralTypeNode(literal) {
    const node = createBaseNode(201 /* LiteralType */);
    node.literal = literal;
    node.transformFlags = 1 /* ContainsTypeScript */;
    return node;
  }
  function updateLiteralTypeNode(node, literal) {
    return node.literal !== literal ? update(createLiteralTypeNode(literal), node) : node;
  }
  function createObjectBindingPattern(elements) {
    const node = createBaseNode(206 /* ObjectBindingPattern */);
    node.elements = createNodeArray(elements);
    node.transformFlags |= propagateChildrenFlags(node.elements) | 1024 /* ContainsES2015 */ | 524288 /* ContainsBindingPattern */;
    if (node.transformFlags & 32768 /* ContainsRestOrSpread */) {
      node.transformFlags |= 128 /* ContainsES2018 */ | 65536 /* ContainsObjectRestOrSpread */;
    }
    return node;
  }
  function updateObjectBindingPattern(node, elements) {
    return node.elements !== elements ? update(createObjectBindingPattern(elements), node) : node;
  }
  function createArrayBindingPattern(elements) {
    const node = createBaseNode(207 /* ArrayBindingPattern */);
    node.elements = cr