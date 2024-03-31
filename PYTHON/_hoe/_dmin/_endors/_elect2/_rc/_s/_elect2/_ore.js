const declaration of declarations) {
      typeParameters = appendIfUnique(typeParameters, getDeclaredTypeOfTypeParameter(getSymbolOfDeclaration(declaration)));
    }
    return typeParameters;
  }
  function getOuterTypeParameters(node, includeThisTypes) {
    while (true) {
      node = node.parent;
      if (node && isBinaryExpression(node)) {
        const assignmentKind = getAssignmentDeclarationKind(node);
        if (assignmentKind === 6 /* Prototype */ || assignmentKind === 3 /* PrototypeProperty */) {
          const symbol = getSymbolOfDeclaration(node.left);
          if (symbol && symbol.parent && !findAncestor(symbol.parent.valueDeclaration, (d) => node === d)) {
            node = symbol.parent.valueDeclaration;
          }
        }
      }
      if (!node) {
        return void 0;
      }
      switch (node.kind) {
        case 263 /* ClassDeclaration */:
        case 231 /* ClassExpression */:
        case 264 /* InterfaceDeclaration */:
        case 179 /* CallSignature */:
        case 180 /* ConstructSignature */:
        case 173 /* MethodSignature */:
        case 184 /* FunctionType */:
        case 185 /* ConstructorType */:
        case 324 /* JSDocFunctionType */:
        case 262 /* FunctionDeclaration */:
        case 174 /* MethodDeclaration */:
        case 218 /* FunctionExpression */:
        case 219 /* ArrowFunction */:
        case 265 /* TypeAliasDeclaration */:
        case 352 /* JSDocTemplateTag */:
        case 353 /* JSDocTypedefTag */:
        case 347 /* JSDocEnumTag */:
        case 345 /* JSDocCallbackTag */:
        case 200 /* MappedType */:
        case 194 /* ConditionalType */: {
          const outerTypeParameters = getOuterTypeParameters(node, includeThisTypes);
          if (node.kind === 200 /* MappedType */) {
            return append(outerTypeParameters, getDeclaredTypeOfTypeParameter(getSymbolOfDeclaration(node.typeParameter)));
          } else if (node.kind === 194 /* ConditionalType */) {
            return concatenate(outerTypeParameters, getInferTypeParameters(node));
          }
          const outerAndOwnTypeParameters = appendTypeParameters(outerTypeParameters, getEffectiveTypeParameterDeclarations(node));
          const thisType = includeThisTypes && (node.kind === 263 /* ClassDeclaration */ || node.kind === 231 /* ClassExpression */ || node.kind === 264 /* InterfaceDeclaration */ || isJSConstructor(node)) && getDeclaredTypeOfClassOrInterface(getSymbolOfDeclaration(node)).thisType;
          return thisType ? append(outerAndOwnTypeParameters, thisType) : outerAndOwnTypeParameters;
        }
        case 348 /* JSDocParameterTag */:
          const paramSymbol = getParameterSymbolFromJSDoc(node);
          if (paramSymbol) {
            node = paramSymbol.valueDeclaration;
          }
          break;
        case 327 /* JSDoc */: {
          const outerTypeParameters = getOuterTypeParameters(node, includeThisTypes);
          return node.tags ? appendTypeParameters(outerTypeParameters, flatMap(node.tags, (t) => isJSDocTemplateTag(t) ? t.typeParameters : void 0)) : outerTypeParameters;
        }
      }
    }
  }
  function getOuterTypeParametersOfClassOrInterface(symbol) {
    var _a;
    const declaration = symbol.flags & 32 /* Class */ || symbol.flags & 16 /* Function */ ? symbol.valueDeclaration : (_a = symbol.declarations) == null ? void 0 : _a.find((decl) => {
      if (decl.kind === 264 /* InterfaceDeclaration */) {
        return true;
      }
      if (decl.kind !== 260 /* VariableDeclaration */) {
        return false;
      }
      const initializer = decl.initializer;
      return !!initializer && (initializer.kind === 218 /* FunctionExpression */ || initializer.kind === 219 /* ArrowFunction */);
    });
    Debug.assert(!!declaration, "Class was missing valueDeclaration -OR- non-class had no interface declarations");
    return getOuterTypeParameters(declaration);
  }
  function getLocalTypeParametersOfClassOrInterfaceOrTypeAlias(symbol) {
    if (!symbol.declarations) {
      return;
    }
    let result;
    for (const node of symbol.declarations) {
      if (node.kind === 264 /* InterfaceDeclaration */ || node.kind === 263 /* ClassDeclaration */ || node.kind === 231 /* ClassExpression */ || isJSConstructor(node) || isTypeAlias(node)) {
        const declaration = node;
        result = appendTypeParameters(result, getEffectiveTypeParameterDeclarations(declaration));
      }
    }
    return result;
  }
  function getTypeParametersOfClassOrInterface(symbol) {
    return concatenate(getOuterTypeParametersOfClassOrInterface(symbol), getLocalTypeParametersOfClassOrInterfaceOrTypeAlias(symbol));
  }
  function isMixinConstructorType(type) {
    const signatures = getSignaturesOfType(type, 1 /* Construct */);
    if (signatures.length === 1) {
      const s = signatures[0];
      if (!s.typeParameters && s.parameters.length === 1 && signatureHasRestParameter(s)) {
        const paramType = getTypeOfParameter(s.parameters[0]);
        return isTypeAny(paramType) || getElementTypeOfArrayType(paramType) === anyType;
      }
    }
    return false;
  }
  function isConstructorType(type) {
    if (getSignaturesOfType(type, 1 /* Construct */).length > 0) {
      return true;
    }
    if (type.flags & 8650752 /* TypeVariable */) {
      const constraint = getBaseConstraintOfType(type);
      return !!constraint && isMixinConstructorType(constraint);
    }
    return false;
  }
  function getBaseTypeNodeOfClass(type) {
    const decl = getClassLikeDeclarationOfSymbol(type.symbol);
    return decl && getEffectiveBaseTypeNode(decl);
  }
  function getConstructorsForTypeArguments(type, typeArgumentNodes, location) {
    const typeArgCount = length(typeArgumentNodes);
    const isJavascript = isInJSFile(location);
    return filter(getSignaturesOfType(type, 1 /* Construct */), (sig) => (isJavascript || typeArgCount >= getMinTypeArgumentCount(sig.typeParameters)) && typeArgCount <= length(sig.typeParameters));
  }
  function getInstantiatedConstructorsForTypeArguments(type, typeArgumentNodes, location) {
    const signatures = getConstructorsForTypeArguments(type, typeArgumentNodes, location);
    const typeArguments = map(typeArgumentNodes, getTypeFromTypeNode);
    return sameMap(signatures, (sig) => some(sig.typeParameters) ? getSignatureInstantiation(sig, typeArguments, isInJSFile(location)) : sig);
  }
  function getBaseConstructorTypeOfClass(type) {
    if (!type.resolvedBaseConstructorType) {
      const decl = getClassLikeDeclarationOfSymbol(type.symbol);
      const extended = decl && getEffectiveBaseTypeNode(decl);
      const baseTypeNode = getBaseTypeNodeOfClass(type);
      if (!baseTypeNode) {
        return type.resolvedBaseConstructorType = undefinedType;
      }
      if (!pushTypeResolution(type, 1 /* ResolvedBaseConstructorType */)) {
        return errorType;
      }
      const baseConstructorType = checkExpression(baseTypeNode.expression);
      if (extended && baseTypeNode !== extended) {
        Debug.assert(!extended.typeArguments);
        checkExpression(extended.expression);
      }
      if (baseConstructorType.flags & (524288 /* Object */ | 2097152 /* Intersection */)) {
        resolveStructuredTypeMembers(baseConstructorType);
      }
      if (!popTypeResolution()) {
        error(type.symbol.valueDeclaration, Diagnostics._0_is_referenced_directly_or_indirectly_in_its_own_base_expression, symbolToString(type.symbol));
        return type.resolvedBaseConstructorType = errorType;
      }
      if (!(baseConstructorType.flags & 1 /* Any */) && baseConstructorType !== nullWideningType && !isConstructorType(baseConstructorType)) {
        const err = error(baseTypeNode.expression, Diagnostics.Type_0_is_not_a_constructor_function_type, typeToString(baseConstructorType));
        if (baseConstructorType.flags & 262144 /* TypeParameter */) {
          const constraint = getConstraintFromTypeParameter(baseConstructorType);
          let ctorReturn = unknownType;
          if (constraint) {
            const ctorSig = getSignaturesOfType(constraint, 1 /* Construct */);
            if (ctorSig[0]) {
              ctorReturn = getReturnTypeOfSignature(ctorSig[0]);
            }
          }
          if (baseConstructorType.symbol.declarations) {
            addRelatedInfo(err, createDiagnosticForNode(baseConstructorType.symbol.declarations[0], Diagnostics.Did_you_mean_for_0_to_be_constrained_to_type_new_args_Colon_any_1, symbolToString(baseConstructorType.symbol), typeToString(ctorReturn)));
          }
        }
        return type.resolvedBaseConstructorType = errorType;
      }
      type.resolvedBaseConstructorType = baseConstructorType;
    }
    return type.resolvedBaseConstructorType;
  }
  function getImplementsTypes(type) {
    let resolvedImplementsTypes = emptyArray;
    if (type.symbol.declarations) {
      for (const declaration of type.symbol.declarations) {
        const implementsTypeNodes = getEffectiveImplementsTypeNodes(declaration);
        if (!implementsTypeNodes)
          continue;
        for (const node of implementsTypeNodes) {
          const implementsType = getTypeFromTypeNode(node);
          if (!isErrorType(implementsType)) {
            if (resolvedImplementsTypes === emptyArray) {
              resolvedImplementsTypes = [implementsType];
            } else {
              resolvedImplementsTypes.push(implementsType);
            }
          }
        }
      }
    }
    return resolvedImplementsTypes;
  }
  function reportCircularBaseType(node, type) {
    error(node, Diagnostics.Type_0_recursively_references_itself_as_a_base_type, typeToString(
      type,
      /*enclosingDeclaration*/
      void 0,
      2 /* WriteArrayAsGenericType */
    ));
  }
  function getBaseTypes(type) {
    if (!type.baseTypesResolved) {
      if (pushTypeResolution(type, 7 /* ResolvedBaseTypes */)) {
        if (type.objectFlags & 8 /* Tuple */) {
          type.resolvedBaseTypes = [getTupleBaseType(type)];
        } else if (type.symbol.flags & (32 /* Class */ | 64 /* Interface */)) {
          if (type.symbol.flags & 32 /* Class */) {
            resolveBaseTypesOfClass(type);
          }
          if (type.symbol.flags & 64 /* Interface */) {
            resolveBaseTypesOfInterface(type);
          }
        } else {
          Debug.fail("type must be class or interface");
        }
        if (!popTypeResolution() && type.symbol.declarations) {
          for (const declaration of type.symbol.declarations) {
            if (declaration.kind === 263 /* ClassDeclaration */ || declaration.kind === 264 /* InterfaceDeclaration */) {
              reportCircularBaseType(declaration, type);
            }
          }
        }
      }
      type.baseTypesResolved = true;
    }
    return type.resolvedBaseTypes;
  }
  function getTupleBaseType(type) {
    const elementTypes = sameMap(type.typeParameters, (t, i) => type.elementFlags[i] & 8 /* Variadic */ ? getIndexedAccessType(t, numberType) : t);
    return createArrayType(getUnionType(elementTypes || emptyArray), type.readonly);
  }
  function resolveBaseTypesOfClass(type) {
    type.resolvedBaseTypes = resolvingEmptyArray;
    const baseConstructorType = getApparentType(getBaseConstructorTypeOfClass(type));
    if (!(baseConstructorType.flags & (524288 /* Object */ | 2097152 /* Intersection */ | 1 /* Any */))) {
      return type.resolvedBaseTypes = emptyArray;
    }
    const baseTypeNode = getBaseTypeNodeOfClass(type);
    let baseType;
    const originalBaseType = baseConstructorType.symbol ? getDeclaredTypeOfSymbol(baseConstructorType.symbol) : void 0;
    if (baseConstructorType.symbol && baseConstructorType.symbol.flags & 32 /* Class */ && areAllOuterTypeParametersApplied(originalBaseType)) {
      baseType = getTypeFromClassOrInterfaceReference(baseTypeNode, baseConstructorType.symbol);
    } else if (baseConstructorType.flags & 1 /* Any */) {
      baseType = baseConstructorType;
    } else {
      const constructors = getInstantiatedConstructorsForTypeArguments(baseConstructorType, baseTypeNode.typeArguments, baseTypeNode);
      if (!constructors.length) {
        error(baseTypeNode.expression, Diagnostics.No_base_constructor_has_the_specified_number_of_type_arguments);
        return type.resolvedBaseTypes = emptyArray;
      }
      baseType = getReturnTypeOfSignature(constructors[0]);
    }
    if (isErrorType(baseType)) {
      return type.resolvedBaseTypes = emptyArray;
    }
    const reducedBaseType = getReducedType(baseType);
    if (!isValidBaseType(reducedBaseType)) {
      const elaboration = elaborateNeverIntersection(
        /*errorInfo*/
        void 0,
        baseType
      );
      const diagnostic = chainDiagnosticMessages(elaboration, Diagnostics.Base_constructor_return_type_0_is_not_an_object_type_or_intersection_of_object_types_with_statically_known_members, typeToString(reducedBaseType));
      diagnostics.add(createDiagnosticForNodeFromMessageChain(getSourceFileOfNode(baseTypeNode.expression), baseTypeNode.expression, diagnostic));
      return type.resolvedBaseTypes = emptyArray;
    }
    if (type === reducedBaseType || hasBaseType(reducedBaseType, type)) {
      error(type.symbol.valueDeclaration, Diagnostics.Type_0_recursively_references_itself_as_a_base_type, typeToString(
        type,
        /*enclosingDeclaration*/
        void 0,
        2 /* WriteArrayAsGenericType */
      ));
      return type.resolvedBaseTypes = emptyArray;
    }
    if (type.resolvedBaseTypes === resolvingEmptyArray) {
      type.members = void 0;
    }
    return type.resolvedBaseTypes = [reducedBaseType];
  }
  function areAllOuterTypeParametersApplied(type) {
    const outerTypeParameters = type.outerTypeParameters;
    if (outerTypeParameters) {
      const last2 = outerTypeParameters.length - 1;
      const typeArguments = getTypeArguments(type);
      return outerTypeParameters[last2].symbol !== typeArguments[last2].symbol;
    }
    return true;
  }
  function isValidBaseType(type) {
    if (type.flags & 262144 /* TypeParameter */) {
      const constraint = getBaseConstraintOfType(type);
      if (constraint) {
        return isValidBaseType(constraint);
      }
    }
    return !!(type.flags & (524288 /* Object */ | 67108864 /* NonPrimitive */ | 1 /* Any */) && !isGenericMappedType(type) || type.flags & 2097152 /* Intersection */ && every(type.types, isValidBaseType));
  }
  function resolveBaseTypesOfInterface(type) {
    type.resolvedBaseTypes = type.resolvedBaseTypes || emptyArray;
    if (type.symbol.declarations) {
      for (const declaration of type.symbol.declarations) {
        if (declaration.kind === 264 /* InterfaceDeclaration */ && getInterfaceBaseTypeNodes(declaration)) {
          for (const node of getInterfaceBaseTypeNodes(declaration)) {
            const baseType = getReducedType(getTypeFromTypeNode(node));
            if (!isErrorType(baseType)) {
              if (isValidBaseType(baseType)) {
                if (type !== baseType && !hasBaseType(baseType, type)) {
                  if (type.resolvedBaseTypes === emptyArray) {
                    type.resolvedBaseTypes = [baseType];
                  } else {
                    type.resolvedBaseTypes.push(baseType);
                  }
                } else {
                  reportCircularBaseType(declaration, type);
                }
              } else {
           