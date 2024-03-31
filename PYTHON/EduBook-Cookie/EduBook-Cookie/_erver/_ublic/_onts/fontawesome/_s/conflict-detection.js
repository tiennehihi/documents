ErrorOnNode(mod, Diagnostics._0_modifier_cannot_be_used_here, getTextOfNode(mod));
          }
        }
      }
      let currentKind;
      switch (prop.kind) {
        case 304 /* ShorthandPropertyAssignment */:
        case 303 /* PropertyAssignment */:
          checkGrammarForInvalidExclamationToken(prop.exclamationToken, Diagnostics.A_definite_assignment_assertion_is_not_permitted_in_this_context);
          checkGrammarForInvalidQuestionMark(prop.questionToken, Diagnostics.An_object_member_cannot_be_declared_optional);
          if (name.kind === 9 /* NumericLiteral */) {
            checkGrammarNumericLiteral(name);
          }
          currentKind = 4 /* PropertyAssignment */;
          break;
        case 174 /* MethodDeclaration */:
          currentKind = 8 /* Method */;
          break;
        case 177 /* GetAccessor */:
          currentKind = 1 /* GetAccessor */;
          break;
        case 178 /* SetAccessor */:
          currentKind = 2 /* SetAccessor */;
          break;
        default:
          Debug.assertNever(prop, "Unexpected syntax kind:" + prop.kind);
      }
      if (!inDestructuring) {
        const effectiveName = getEffectivePropertyNameForPropertyNameNode(name);
        if (effectiveName === void 0) {
          continue;
        }
        const existingKind = seen.get(effectiveName);
        if (!existingKind) {
          seen.set(effectiveName, currentKind);
        } else {
          if (currentKind & 8 /* Method */ && existingKind & 8 /* Method */) {
            grammarErrorOnNode(name, Diagnostics.Duplicate_identifier_0, getTextOfNode(name));
          } else if (currentKind & 4 /* PropertyAssignment */ && existingKind & 4 /* PropertyAssignment */) {
            grammarErrorOnNode(name, Diagnostics.An_object_literal_cannot_have_multiple_properties_with_the_same_name, getTextOfNode(name));
          } else if (currentKind & 3 /* GetOrSetAccessor */ && existingKind & 3 /* GetOrSetAccessor */) {
            if (existingKind !== 3 /* GetOrSetAccessor */ && currentKind !== existingKind) {
              seen.set(effectiveName, currentKind | existingKind);
            } else {
              return grammarErrorOnNode(name, Diagnostics.An_object_literal_cannot_have_multiple_get_Slashset_accessors_with_the_same_name);
            }
          } else {
            return grammarErrorOnNode(name, Diagnostics.An_object_literal_cannot_have_property_and_accessor_with_the_same_name);
          }
        }
      }
    }
  }
  function checkGrammarJsxElement(node) {
    checkGrammarJsxName(node.tagName);
    checkGrammarTypeArguments(node, node.typeArguments);
    const seen = /* @__PURE__ */ new Map();
    for (const attr of node.attributes.properties) {
      if (attr.kind === 293 /* JsxSpreadAttribute */) {
        continue;
      }
      const { name, initializer } = attr;
      const escapedText = getEscapedTextOfJsxAttributeName(name);
      if (!seen.get(escapedText)) {
        seen.set(escapedText, true);
      } else {
        return grammarErrorOnNode(name, Diagnostics.JSX_elements_cannot_have_multiple_attributes_with_the_same_name);
      }
      if (initializer && initializer.kind === 294 /* JsxExpression */ && !initializer.expression) {
        return grammarErrorOnNode(initializer, Diagnostics.JSX_attributes_must_only_be_assigned_a_non_empty_expression);
      }
    }
  }
  function checkGrammarJsxName(node) {
    if (isPropertyAccessExpression(node) && isJsxNamespacedName(node.expression)) {
      return grammarErrorOnNode(node.expression, Diagnostics.JSX_property_access_expressions_cannot_include_JSX_namespace_names);
    }
    if (isJsxNamespacedName(node) && getJSXTransformEnabled(compilerOptions) && !isIntrinsicJsxName(node.namespace.escapedText)) {
      return grammarErrorOnNode(node, Diagnostics.React_components_cannot_include_JSX_namespace_names);
    }
  }
  function checkGrammarJsxExpression(node) {
    if (node.expression && isCommaSequence(node.expression)) {
      return grammarErrorOnNode(node.expression, Diagnostics.JSX_expressions_may_not_use_the_comma_operator_Did_you_mean_to_write_an_array);
    }
  }
  function checkGrammarForInOrForOfStatement(forInOrOfStatement) {
    if (checkGrammarStatementInAmbientContext(forInOrOfStatement)) {
      return true;
    }
    if (forInOrOfStatement.kind === 250 /* ForOfStatement */ && forInOrOfStatement.awaitModifier) {
      if (!(forInOrOfStatement.flags & 65536 /* AwaitContext */)) {
        const sourceFile = getSourceFileOfNode(forInOrOfStatement);
        if (isInTopLevelContext(forInOrOfStatement)) {
          if (!hasParseDiagnostics(sourceFile)) {
            if (!isEffectiveExternalModule(sourceFile, compilerOptions)) {
              diagnostics.add(createDiagnosticForNode(forInOrOfStatement.awaitModifier, Diagnostics.for_await_loops_are_only_allowed_at_the_top_level_of_a_file_when_that_file_is_a_module_but_this_file_has_no_imports_or_exports_Consider_adding_an_empty_export_to_make_this_file_a_module));
            }
            switch (moduleKind) {
              case 100 /* Node16 */:
              case 199 /* NodeNext */:
                if (sourceFile.impliedNodeFormat === 1 /* CommonJS */) {
                  diagnostics.add(
                    createDiagnosticForNode(forInOrOfStatement.awaitModifier, Diagnostics.The_current_file_is_a_CommonJS_module_and_cannot_use_await_at_the_top_level)
                  );
                  break;
                }
              case 7 /* ES2022 */:
              case 99 /* ESNext */:
              case 4 /* System */:
                if (languageVersion >= 4 /* ES2017 */) {
                  break;
                }
              default:
                diagnostics.add(
                  createDiagnosticForNode(forInOrOfStatement.awaitModifier, Diagnostics.Top_level_for_await_loops_are_only_allowed_when_the_module_option_is_set_to_es2022_esnext_system_node16_nodenext_or_preserve_and_the_target_option_is_set_to_es2017_or_higher)
                );
                break;
            }
          }
        } else {
          if (!hasParseDiagnostics(sourceFile)) {
            const diagnostic = createDiagnosticForNode(forInOrOfStatement.awaitModifier, Diagnostics.for_await_loops_are_only_allowed_within_async_functions_and_at_the_top_levels_of_modules);
            const func = getContainingFunction(forInOrOfStatement);
            if (func && func.kind !== 176 /* Constructor */) {
              Debug.assert((getFunctionFlags(func) & 2 /* Async */) === 0, "Enclosing function should never be an async function.");
              const relatedInfo = createDiagnosticForNode(func, Diagnostics.Did_you_mean_to_mark_this_function_as_async);
              addRelatedInfo(diagnostic, relatedInfo);
            }
            diagnostics.add(diagnostic);
            return true;
          }
        }
        return false;
      }
    }
    if (isForOfStatement(forInOrOfStatement) && !(forInOrOfStatement.flags & 65536 /* AwaitContext */) && isIdentifier(forInOrOfStatement.initializer) && forInOrOfStatement.initializer.escapedText === "async") {
      grammarErrorOnNode(forInOrOfStatement.initializer, Diagnostics.The_left_hand_side_of_a_for_of_statement_may_not_be_async);
      return false;
    }
    if (forInOrOfStatement.initializer.kind === 261 /* VariableDeclarationList */) {
      const variableList = forInOrOfStatement.initializer;
      if (!checkGrammarVariableDeclarationList(variableList)) {
        const declarations = variableList.declarations;
        if (!declarations.length) {
          return false;
        }
        if (declarations.length > 1) {
          const diagnostic = forInOrOfStatement.kind === 249 /* ForInStatement */ ? Diagnostics.Only_a_single_variable_declaration_is_allowed_in_a_for_in_statement : Diagnostics.Only_a_single_variable_declaration_is_allowed_in_a_for_of_statement;
          return grammarErrorOnFirstToken(variableList.declarations[1], diagnostic);
        }
        const firstDeclaration = declarations[0];
        if (firstDeclaration.initializer) {
          const diagnostic = forInOrOfStatement.kind === 249 /* ForInStatement */ ? Diagnostics.The_variable_declaration_of_a_for_in_statement_cannot_have_an_initializer : Diagnostics.The_variable_declaration_of_a_for_of_statement_cannot_have_an_initializer;
          return grammarErrorOnNode(firstDeclaration.name, diagnostic);
        }
        if (firstDeclaration.type) {
          const diagnostic = forInOrOfStatement.kind === 249 /* ForInStatement */ ? Diagnostics.The_left_hand_side_of_a_for_in_statement_cannot_use_a_type_annotation : Diagnostics.The_left_hand_side_of_a_for_of_statement_cannot_use_a_type_annotation;
          return grammarErrorOnNode(firstDeclaration, diagnostic);
        }
      }
    }
    return false;
  }
  function checkGrammarAccessor(accessor) {
    if (!(accessor.flags & 33554432 /* Ambient */) && accessor.parent.kind !== 187 /* TypeLiteral */ && accessor.parent.kind !== 264 /* InterfaceDeclaration */) {
      if (languageVersion < 1 /* ES5 */) {
        return grammarErrorOnNode(accessor.name, Diagnostics.Accessors_are_only_available_when_targeting_ECMAScript_5_and_higher);
      }
      if (languageVersion < 2 /* ES2015 */ && isPrivateIdentifier(accessor.name)) {
        return grammarErrorOnNode(accessor.name, Diagnostics.Private_identifiers_are_only_available_when_targeting_ECMAScript_2015_and_higher);
      }
      if (accessor.body === void 0 && !hasSyntacticModifier(accessor, 64 /* Abstract */)) {
        return grammarErrorAtPos(accessor, accessor.end - 1, ";".length, Diagnostics._0_expected, "{");
      }
    }
    if (accessor.body) {
      if (hasSyntacticModifier(accessor, 64 /* Abstract */)) {
        return grammarErrorOnNode(accessor, Diagnostics.An_abstract_accessor_cannot_have_an_implementation);
      }
      if (accessor.parent.kind === 187 /* TypeLiteral */ || accessor.parent.kind === 264 /* InterfaceDeclaration */) {
        return grammarErrorOnNode(accessor.body, Diagnostics.An_implementation_cannot_be_declared_in_ambient_contexts);
      }
    }
    if (accessor.typeParameters) {
      return grammarErrorOnNode(accessor.name, Diagnostics.An_accessor_cannot_have_type_parameters);
    }
    if (!doesAccessorHaveCorrectParameterCount(accessor)) {
      return grammarErrorOnNode(
        accessor.name,
        accessor.kind === 177 /* GetAccessor */ ? Diagnostics.A_get_accessor_cannot_have_parameters : Diagnostics.A_set_accessor_must_have_exactly_one_parameter
      );
    }
    if (accessor.kind === 178 /* SetAccessor */) {
      if (accessor.type) {
        return grammarErrorOnNode(accessor.name, Diagnostics.A_set_accessor_cannot_have_a_return_type_annotation);
      }
      const parameter = Debug.checkDefined(getSetAccessorValueParameter(accessor), "Return value does not match parameter count assertion.");
      if (parameter.dotDotDotToken) {
        return grammarErrorOnNode(parameter.dotDotDotToken, Diagnostics.A_set_accessor_cannot_have_rest_parameter);
      }
      if (parameter.questionToken) {
        return grammarErrorOnNode(parameter.questionToken, Diagnostics.A_set_accessor_cannot_have_an_optional_parameter);
      }
      if (parameter.initializer) {
        return grammarErrorOnNode(accessor.name, Diagnostics.A_set_accessor_parameter_cannot_have_an_initializer);
      }
    }
    return false;
  }
  function doesAccessorHaveCorrectParameterCount(accessor) {
    return getAccessorThisParameter(accessor) || accessor.parameters.length === (accessor.kind === 177 /* GetAccessor */ ? 0 : 1);
  }
  function getAccessorThisParameter(accessor) {
    if (accessor.parameters.length === (accessor.kind === 177 /* GetAccessor */ ? 1 : 2)) {
      return getThisParameter(accessor);
    }
  }
  function checkGrammarTypeOperatorNode(node) {
    if (node.operator === 158 /* UniqueKeyword */) {
      if (node.type.kind !== 155 /* SymbolKeyword */) {
        return grammarErrorOnNode(node.type, Diagnostics._0_expected, tokenToString(155 /* SymbolKeyword */));
      }
      let parent2 = walkUpParenthesizedTypes(node.parent);
      if (isInJSFile(parent2) && isJSDocTypeExpression(parent2)) {
        const host2 = getJSDocHost(parent2);
        if (host2) {
          parent2 = getSingleVariableOfVariableStatement(host2) || host2;
        }
      }
      switch (parent2.kind) {
        case 260 /* VariableDeclaration */:
          const decl = parent2;
          if (decl.name.kind !== 80 /* Identifier */) {
            return grammarErrorOnNode(node, Diagnostics.unique_symbol_types_may_not_be_used_on_a_variable_declaration_with_a_binding_name);
          }
          if (!isVariableDeclarationInVariableStatement(decl)) {
            return grammarErrorOnNode(node, Diagnostics.unique_symbol_types_are_only_allowed_on_variables_in_a_variable_statement);
          }
          if (!(decl.parent.flags & 2 /* Const */)) {
            return grammarErrorOnNode(parent2.name, Diagnostics.A_variable_whose_type_is_a_unique_symbol_type_must_be_const);
          }
          break;
        case 172 /* PropertyDeclaration */:
          if (!isStatic(parent2) || !hasEffectiveReadonlyModifier(parent2)) {
            return grammarErrorOnNode(parent2.name, Diagnostics.A_property_of_a_class_whose_type_is_a_unique_symbol_type_must_be_both_static_and_readonly);
          }
          break;
        case 171 /* PropertySignature */:
          if (!hasSyntacticModifier(parent2, 8 /* Readonly */)) {
            return grammarErrorOnNode(parent2.name, Diagnostics.A_property_of_an_interface_or_type_literal_whose_type_is_a_unique_symbol_type_must_be_readonly);
          }
          break;
        default:
          return grammarErrorOnNode(node, Diagnostics.unique_symbol_types_are_not_allowed_here);
      }
    } else if (node.operator === 148 /* ReadonlyKeyword */) {
      if (node.type.kind !== 188 /* ArrayType */ && node.type.kind !== 189 /* TupleType */) {
        return grammarErrorOnFirstToken(node, Diagnostics.readonly_type_modifier_is_only_permitted_on_array_and_tuple_literal_types, tokenToString(155 /* SymbolKeyword */));
      }
    }
  }
  function checkGrammarForInvalidDynamicName(node, message) {
    if (isNonBindableDynamicName(node)) {
      return grammarErrorOnNode(node, message);
    }
  }
  function checkGrammarMethod(node) {
    if (checkGrammarFunctionLikeDeclaration(node)) {
      return true;
    }
    if (node.kind === 174 /* MethodDeclaration */) {
      if (node.parent.kind === 210 /* ObjectLiteralExpression */) {
        if (node.modifiers && !(node.modifiers.length === 1 && first(node.modifiers).kind === 134 /* AsyncKeyword */)) {
          return grammarErrorOnFirstToken(node, Diagnostics.Modifiers_cannot_appear_here);
        } else if (checkGrammarForInvalidQuestionMark(node.questionToken, Diagnostics.An_object_member_cannot_be_declared_optional)) {
          return true;
        } else if (checkGrammarForInvalidExclamationToken(node.exclamationToken, Diagnostics.A_definite_assignment_assertion_is_not_permitted_in_this_context)) {
          return true;
        } else if (node.body === void 0) {
          return grammarErrorAtPos(node, node.end - 1, ";".length, Diagnostics._0_expected, "{");
        }
      }
      if (checkGrammarForGenerator(node)) {
        return true;
      }
    }
    if (isClassLike(node.parent)) {
      if (languageVersion < 2 /* ES2015 */ && isPrivateIdentifier(node.name)) {
        return grammarErrorOnNode(node.name, Diagnostics.Private_identifiers_are_only_available_when_targeting_ECMAScript_2015_and_higher);
      }
      if (node.flags & 33554432 /* Ambient */) {
        return checkGrammarForInvalidDynamicName(node.name, Diagnostics.A_computed_property_name_in_an_ambient_context_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type);
      } else if (node.kind === 174 /* MethodDeclaration */ && !node.body) {
        return checkGrammarForInvalidDynamicName(node.name, Diagnostics.A_computed_property_name_in_a_method_overload_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type);
      }
    } else if (node.parent.kind === 264 /* InterfaceDeclaration */) {
      return checkGrammarForInvalidDynamicName(node.name, Diagnostics.A_computed_property_name_in_an_interface_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type);
    } else if (node.parent.kind === 187 /* TypeLiteral */) {
      return checkGrammarForInvalidDynamicName(node.name, Diagnostics.A_computed_property_name_in_a_type_literal_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type);
    }
  }
  function checkGrammarBreakOrContinueStatement(node) {
    let current = node;
    while (current) {
      if (isFunctionLikeOrClassStaticBlockDeclaration(current)) {
        return grammarErrorOnNode(node, Diagnostics.Jump_target_cannot_cross_function_boundary);
      }
      switch (current.kind) {
        case 256 /* LabeledStatement */:
          if (node.label && current.label.escapedText === node.label.escapedText) {
            const isMisplacedContinueLabel = node.kind === 251 /* ContinueStatement */ && !isIterationStatement(
              current.statement,
              /*lookInLabeledStatements*/
              true
            );
            if (isMisplacedContinueLabel) {
              return grammarErrorOnNode(node, Diagnostics.A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement);
            }
            return false;
          }
          break;
        case 255 /* SwitchStatement */:
          if (node.kind === 252 /* BreakStatement */ && !node.label) {
            return false;
          }
          break;
        default:
          if (isIterationStatement(
            current,
            /*lookInLabeledStatements*/
            false
          ) && !node.label) {
            return false;
          }
          break;
      }
      current = current.parent;
    }
    if (node.label) {
      const message = node.kind === 252 /* BreakStatement */ ? Diagnostics.A_break_statement_can_only_jump_to_a_label_of_an_enclosing_statement : Diagnostics.A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement;
      return grammarErrorOnNode(node, message);
    } else {
      const message = node.kind === 252 /* BreakStatement */ ? Diagnostics.A_break_statement_can_only_be_used_within_an_enclosing_iteration_or_switch_statement : Diagnostics.A_continue_statement_can_only_be_used_within_an_enclosing_iteration_statement;
      return grammarErrorOnNode(node, message);
    }
  }
  function checkGrammarBindingElement(node) {
    if (node.dotDotDotToken) {
      const elements = node.parent.elements;
      if (node !== last(elements)) {
        return grammarErrorOnNode(node, Diagnostics.A_rest_element_must_be_last_in_a_destructuring_pattern);
      }
      checkGrammarForDisallowedTrailingComma(elements, Diagnostics.A_rest_parameter_or_binding_pattern_may_not_have_a_trailing_comma);
      if (node.propertyName) {
        return grammarErrorOnNode(node.name, Diagnostics.A_rest_element_cannot_have_a_property_name);
      }
    }
    if (node.dotDotDotToken && node.initializer) {
      return grammarErrorAtPos(node, node.initializer.pos - 1, 1, Diagnostics.A_rest_element_cannot_have_an_initializer);
    }
  }
  function isStringOrNumberLiteralExpression(expr) {
    return isStringOrNumericLiteralLike(expr) || expr.kind === 224 /* PrefixUnaryExpression */ && expr.operator === 41 /* MinusToken */ && expr.operand.kind === 9 /* NumericLiteral */;
  }
  function isBigIntLiteralExpression(expr) {
    return expr.kind === 10 /* BigIntLiteral */ || expr.kind === 224 /* PrefixUnaryExpression */ && expr.operator === 41 /* MinusToken */ && expr.operand.kind === 10 /* BigIntLiteral */;
  }
  function isSimpleLiteralEnumReference(expr) {
    if ((isPropertyAccessExpression(expr) || isElementAccessExpression(expr) && isStringOrNumberLiteralExpression(expr.argumentExpression)) && isEntityNameExpression(expr.expression)) {
      return !!(checkExpressionCached(expr).flags & 1056 /* EnumLike */);
    }
  }
  function checkAmbientInitializer(node) {
    const initializer = node.initializer;
    if (initializer) {
      const isInvalidInitializer = !(isStringOrNumberLiteralExpression(initializer) || isSimpleLiteralEnumReference(initializer) || initializer.kind === 112 /* TrueKeyword */ || initializer.kind === 97 /* FalseKeyword */ || isBigIntLiteralExpression(initializer));
      const isConstOrReadonly = isDeclarationReadonly(node) || isVariableDeclaration(node) && isVarConstLike(node);
      if (isConstOrReadonly && !node.type) {
        if (isInvalidInitializer) {
          return grammarErrorOnNode(initializer, Diagnostics.A_const_initializer_in_an_ambient_context_must_be_a_string_or_numeric_literal_or_literal_enum_reference);
        }
      } else {
        return grammarErrorOnNode(initializer, Diagnostics.Initializers_are_not_allowed_in_ambient_contexts);
      }
    }
  }
  function checkGrammarVariableDeclaration(node) {
    const nodeFlags = getCombinedNodeFlagsCached(node);
    const blockScopeKind = nodeFlags & 7 /* BlockScoped */;
    if (isBindingPattern(node.name)) {
      switch (blockScopeKind) {
        case 6 /* AwaitUsing */:
          return grammarErrorOnNode(node, Diagnostics._0_declarations_may_not_have_binding_patterns, "await using");
        case 4 /* Using */:
          return grammarErrorOnNode(node, Diagnostics._0_declarations_may_not_have_binding_patterns, "using");
      }
    }
    if (node.parent.parent.kind !== 249 /* ForInStatement */ && node.parent.parent.kind !== 250 /* ForOfStatement */) {
      if (nodeFlags & 33554432 /* Ambient */) {
        checkAmbientInitializer(node);
      } else if (!node.initializer) {
        if (isBindingPattern(node.name) && !isBindingPattern(node.parent)) {
          return grammarErrorOnNode(node, Diagnostics.A_destructuring_declaration_must_have_an_initializer);
        }
        switch (blockScopeKind) {
          case 6 /* AwaitUsing */:
            return grammarErrorOnNode(node, Diagnostics._0_declarations_must_be_initialized, "await using");
          case 4 /* Using */:
            return grammarErrorOnNode(node, Diagnostics._0_declarations_must_be_initialized, "using");
          case 2 /* Const */:
            return grammarErrorOnNode(node, Diagnostics._0_declarations_must_be_initialized, "const");
        }
      }
    }
    if (node.exclamationToken && (node.parent.parent.kind !== 243 /* VariableStatement */ || !node.type || node.initializer || nodeFlags & 33554432 /* Ambient */)) {
      const message = node.initializer ? Diagnostics.Declarations_with_initializers_cannot_also_have_definite_assignment_assertions : !node.type ? Diagnostics.Declarations_with_definite_assignment_assertions_must_also_have_type_annotations : Diagnostics.A_definite_assignment_assertion_is_not_permitted_in_this_context;
      return grammarErrorOnNode(node.exclamationToken, message);
    }
    if ((moduleKind < 5 /* ES2015 */ || getSourceFileOfNode(node).impliedNodeFormat === 1 /* CommonJS */) && moduleKind !== 4 /* System */ && !(node.parent.parent.flags & 33554432 /* Ambient */) && hasSyntacticModifier(node.parent.parent, 32 /* Export */)) {
      checkESModuleMarker(node.name);
    }
    return !!blockScopeKind && checkGrammarNameInLetOrConstDeclarations(node.name);
  }
  function checkESModuleMarker(name) {
    if (name.kind === 80 /* Identifier */) {
      if (idText(name) === "__esModule") {
        return grammarErrorOnNodeSkippedOn("noEmit", name, Diagnostics.Identifier_expected_esModule_is_reserved_as_an_exported_marker_when_transforming_ECMAScript_modules);
      }
    } else {
      const elements = name.elements;
      for (const element of elements) {
        if (!isOmittedExpression(element)) {
          return checkESModuleMarker(element.name);
        }
      }
    }
    return false;
  }
  function checkGrammarNameInLetOrConstDeclarations(name) {
    if (name.kind === 80 /* Identifier */) {
      if (name.escapedText === "let") {
        return grammarErrorOnNode(name, Diagnostics.let_is_not_allowed_to_be_used_as_a_name_in_let_or_const_declarations);
      }
    } else {
      const elements = name.elements;
      for (const element of elements) {
        if (!isOmittedExpression(element)) {
          checkGrammarNameInLetOrConstDeclarations(element.name);
        }
      }
    }
    return false;
  }
  function checkGrammarVariableDeclarationList(declarationList) {
    const declarations = declarationList.declarations;
    if (checkGrammarForDisallowedTrailingComma(declarationList.declarations)) {
      return true;
    }
    if (!declarationList.declarations.length) {
      return grammarErrorAtPos(declarationList, declarations.pos, declarations.end - declarations.pos, Diagnostics.Variable_declaration_list_cannot_be_empty);
    }
    const blockScopeFlags = declarationList.flags & 7 /* BlockScoped */;
    if ((blockScopeFlags === 4 /* Using */ || blockScopeFlags === 6 /* AwaitUsing */) && isForInStatement(declarationList.parent)) {
      return grammarErrorOnNode(
        declarationList,
        blockScopeFlags === 4 /* Using */ ? Diagnostics.The_left_hand_side_of_a_for_in_statement_cannot_be_a_using_declaration : Diagnostics.The_left_hand_side_of_a_for_in_statement_cannot_be_an_await_using_declaration
      );
    }
    if (blockScopeFlags === 6 /* AwaitUsing */) {
      return checkAwaitGrammar(declarationList);
    }
    return false;
  }
  function allowLetAndConstDeclarations(parent2) {
    switch (parent2.kind) {
      case 245 /* IfStatement */:
      case 246 /* DoStatement */:
      case 247 /* WhileStatement */:
      case 254 /* WithStatement */:
      case 248 /* ForStatement */:
      case 249 /* ForInStatement */:
      case 250 /* ForOfStatement */:
        return false;
      case 256 /* LabeledStatement */:
        return allowLetAndConstDeclarations(parent2.parent);
    }
    return true;
  }
  function checkGrammarForDisallowedBlockScopedVariableStatement(node) {
    if (!allowLetAndConstDeclarations(node.parent)) {
      const blockScopeKind = getCombinedNodeFlagsCached(node.declarationList) & 7 /* BlockScoped */;
      if (blockScopeKind) {
        const keyword = blockScopeKind === 1 /* Let */ ? "let" : blockScopeKind === 2 /* Const */ ? "const" : blockScopeKind === 4 /* Using */ ? "using" : blockScopeKind === 6 /* AwaitUsing */ ? "await using" : Debug.fail("Unknown BlockScope flag");
        return grammarErrorOnNode(node, Diagnostics._0_declarations_can_only_be_declared_inside_a_block, keyword);
      }
    }
  }
  function checkGrammarMetaProperty(node) {
    const escapedText = node.name.escapedText;
    switch (node.keywordToken) {
      case 105 /* NewKeyword */:
        if (escapedText !== "target") {
          return grammarErrorOnNode(node.name, Diagnostics._0_is_not_a_valid_meta_property_for_keyword_1_Did_you_mean_2, unescapeLeadingUnderscores(node.name.escapedText), tokenToString(node.keywordToken), "target");
        }
        break;
      case 102 /* ImportKeyword */:
        if (escapedText !== "meta") {
          return grammarErrorOnNode(node.name, Diagnostics._0_is_not_a_valid_meta_property_for_keyword_1_Did_you_mean_2, unescapeLeadingUnderscores(node.name.escapedText), tokenToString(node.keywordToken), "meta");
        }
        break;
    }
  }
  function hasParseDiagnostics(sourceFile) {
    return sourceFile.parseDiagnostics.length > 0;
  }
  function grammarErrorOnFirstToken(node, message, ...args) {
    const sourceFile = getSourceFileOfNode(node);
    if (!hasParseDiagnostics(sourceFile)) {
      const span = getSpanOfTokenAtPosition(sourceFile, node.pos);
      diagnostics.add(createFileDiagnostic(sourceFile, span.start, span.length, message, ...args));
      return true;
    }
    return false;
  }
  function grammarErrorAtPos(nodeForSourceFile, start2, length2, message, ...args) {
    const sourceFile = getSourceFileOfNode(nodeForSourceFile);
    if (!hasParseDiagnostics(sourceFile)) {
      diagnostics.add(createFileDiagnostic(sourceFile, start2, length2, message, ...args));
      return true;
    }
    return false;
  }
  function grammarErrorOnNodeSkippedOn(key, node, message, ...args) {
    const sourceFile = getSourceFileOfNode(node);
    if (!hasParseDiagnostics(sourceFile)) {
      errorSkippedOn(key, node, message, ...args);
      return true;
    }
    return false;
  }
  function grammarErrorOnNode(node, message, ...args) {
    const sourceFile = getSourceFileOfNode(node);
    if (!hasParseDiagnostics(sourceFile)) {
      diagnostics.add(createDiagnosticForNode(node, message, ...args));
      return true;
    }
    return false;
  }
  function checkGrammarConstructorTypeParameters(node) {
    const jsdocTypeParameters = isInJSFile(node) ? getJSDocTypeParameterDeclarations(node) : void 0;
    const range = node.typeParameters || jsdocTypeParameters && firstOrUndefined(jsdocTypeParameters);
    if (range) {
      const pos = range.pos === range.end ? range.pos : skipTrivia(getSourceFileOfNode(node).text, range.pos);
      return grammarErrorAtPos(node, pos, range.end - pos, Diagnostics.Type_parameters_cannot_appear_on_a_constructor_declaration);
    }
  }
  function checkGrammarConstructorTypeAnnotation(node) {
    const type = node.type || getEffectiveReturnTypeNode(node);
    if (type) {
      return grammarErrorOnNode(type, Diagnostics.Type_annotation_cannot_appear_on_a_constructor_declaration);
    }
  }
  function checkGrammarProperty(node) {
    if (isComputedPropertyName(node.name) && isBinaryExpression(node.name.expression) && node.name.expression.operatorToken.kind === 103 /* InKeyword */) {
      return grammarErrorOnNode(node.parent.members[0], Diagnostics.A_mapped_type_may_not_declare_properties_or_methods);
    }
    if (isClassLike(node.parent)) {
      if (isStringLiteral(node.name) && node.name.text === "constructor") {
        return grammarErrorOnNode(node.name, Diagnostics.Classes_may_not_have_a_field_named_constructor);
      }
      if (checkGrammarForInvalidDynamicName(node.name, Diagnostics.A_computed_property_name_in_a_class_property_declaration_must_have_a_simple_literal_type_or_a_unique_symbol_type)) {
        return true;
      }
      if (languageVersion < 2 /* ES2015 */ && isPrivateIdentifier(node.name)) {
        return grammarErrorOnNode(node.name, Diagnostics.Private_identifiers_are_only_available_when_targeting_ECMAScript_2015_and_higher);
      }
      if (languageVersion < 2 /* ES2015 */ && isAutoAccessorPropertyDeclaration(node)) {
        return grammarErrorOnNode(node.name, Diagnostics.Properties_with_the_accessor_modifier_are_only_available_when_targeting_ECMAScript_2015_and_higher);
      }
      if (isAutoAccessorPropertyDeclaration(node) && checkGrammarForInvalidQuestionMark(node.questionToken, Diagnostics.An_accessor_property_cannot_be_declared_optional)) {
        return true;
      }
    } else if (node.parent.kind === 264 /* InterfaceDeclaration */) {
      if (checkGrammarForInvalidDynamicName(node.name, Diagnostics.A_computed_property_name_in_an_interface_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type)) {
        return true;
      }
      Debug.assertNode(node, isPropertySignature);
      if (node.initializer) {
        return grammarErrorOnNode(node.initializer, Diagnostics.An_interface_property_cannot_have_an_initializer);
      }
    } else if (isTypeLiteralNode(node.parent)) {
      if (checkGrammarForInvalidDynamicName(node.name, Diagnostics.A_computed_property_name_in_a_type_literal_must_refer_to_an_expression_whose_type_is_a_literal_type_or_a_unique_symbol_type)) {
        return true;
      }
      Debug.assertNode(node, isPropertySignature);
      if (node.initializer) {
        return grammarErrorOnNode(node.initializer, Diagnostics.A_type_literal_property_cannot_have_an_initializer);
      }
    }
    if (node.flags & 33554432 /* Ambient */) {
      checkAmbientInitializer(node);
    }
    if (isPropertyDeclaration(node) && node.exclamationToken && (!isClassLike(node.parent) || !node.type || node.initializer || node.flags & 33554432 /* Ambient */ || isStatic(node) || hasAbstractModifier(node))) {
      const message = node.initializer ? Diagnostics.Declarations_with_initializers_cannot_also_have_definite_assignment_assertions : !node.type ? Diagnostics.Declarations_with_definite_assignment_assertions_must_also_have_type_annotations : Diagnostics.A_definite_assignment_assertion_is_not_permitted_in_this_context;
      return grammarErrorOnNode(node.exclamationToken, message);
    }
  }
  function checkGrammarTopLevelElementForRequiredDeclareModifier(node) {
    if (node.kind === 264 /* InterfaceDeclaration */ || node.kind === 265 /* TypeAliasDeclaration */ || node.kind === 272 /* ImportDeclaration */ || node.kind === 271 /* ImportEqualsDeclaration */ || node.kind === 278 /* ExportDeclaration */ || node.kind === 277 /* ExportAssignment */ || node.kind === 270 /* NamespaceExportDeclaration */ || hasSyntacticModifier(node, 128 /* Ambient */ | 32 /* Export */ | 2048 /* Default */)) {
      return false;
    }
    return grammarErrorOnFirstToken(node, Diagnostics.Top_level_declarations_in_d_ts_files_must_start_with_either_a_declare_or_export_modifier);
  }
  function checkGrammarTopLevelElementsForRequiredDeclareModifier(file) {
    for (const decl of file.statements) {
      if (isDeclaration(decl) || decl.kind === 243 /* VariableStatement */) {
        if (checkGrammarTopLevelElementForRequiredDeclareModifier(decl)) {
          return true;
        }
      }
    }
    return false;
  }
  function checkGrammarSourceFile(node) {
    return !!(node.flags & 33554432 /* Ambient */) && checkGrammarTopLevelElementsForRequiredDeclareModifier(node);
  }
  function checkGrammar