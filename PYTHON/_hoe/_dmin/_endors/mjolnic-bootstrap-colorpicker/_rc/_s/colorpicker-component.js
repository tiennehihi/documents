wd),
    optionsToExtend,
    getNormalizedAbsolutePath(configFileName, cwd),
    /*resolutionStack*/
    void 0,
    extraFileExtensions,
    extendedConfigCache,
    watchOptionsToExtend
  );
}
function parseConfigFileTextToJson(fileName, jsonText) {
  const jsonSourceFile = parseJsonText(fileName, jsonText);
  return {
    config: convertConfigFileToObject(
      jsonSourceFile,
      jsonSourceFile.parseDiagnostics,
      /*jsonConversionNotifier*/
      void 0
    ),
    error: jsonSourceFile.parseDiagnostics.length ? jsonSourceFile.parseDiagnostics[0] : void 0
  };
}
function readJsonConfigFile(fileName, readFile) {
  const textOrDiagnostic = tryReadFile(fileName, readFile);
  return isString(textOrDiagnostic) ? parseJsonText(fileName, textOrDiagnostic) : { fileName, parseDiagnostics: [textOrDiagnostic] };
}
function tryReadFile(fileName, readFile) {
  let text;
  try {
    text = readFile(fileName);
  } catch (e) {
    return createCompilerDiagnostic(Diagnostics.Cannot_read_file_0_Colon_1, fileName, e.message);
  }
  return text === void 0 ? createCompilerDiagnostic(Diagnostics.Cannot_read_file_0, fileName) : text;
}
function commandLineOptionsToMap(options) {
  return arrayToMap(options, getOptionName);
}
var typeAcquisitionDidYouMeanDiagnostics = {
  optionDeclarations: typeAcquisitionDeclarations,
  unknownOptionDiagnostic: Diagnostics.Unknown_type_acquisition_option_0,
  unknownDidYouMeanDiagnostic: Diagnostics.Unknown_type_acquisition_option_0_Did_you_mean_1
};
var watchOptionsNameMapCache;
function getWatchOptionsNameMap() {
  return watchOptionsNameMapCache || (watchOptionsNameMapCache = createOptionNameMap(optionsForWatch));
}
var watchOptionsDidYouMeanDiagnostics = {
  getOptionsNameMap: getWatchOptionsNameMap,
  optionDeclarations: optionsForWatch,
  unknownOptionDiagnostic: Diagnostics.Unknown_watch_option_0,
  unknownDidYouMeanDiagnostic: Diagnostics.Unknown_watch_option_0_Did_you_mean_1,
  optionTypeMismatchDiagnostic: Diagnostics.Watch_option_0_requires_a_value_of_type_1
};
var commandLineCompilerOptionsMapCache;
function getCommandLineCompilerOptionsMap() {
  return commandLineCompilerOptionsMapCache || (commandLineCompilerOptionsMapCache = commandLineOptionsToMap(optionDeclarations));
}
var commandLineWatchOptionsMapCache;
function getCommandLineWatchOptionsMap() {
  return commandLineWatchOptionsMapCache || (commandLineWatchOptionsMapCache = commandLineOptionsToMap(optionsForWatch));
}
var commandLineTypeAcquisitionMapCache;
function getCommandLineTypeAcquisitionMap() {
  return commandLineTypeAcquisitionMapCache || (commandLineTypeAcquisitionMapCache = commandLineOptionsToMap(typeAcquisitionDeclarations));
}
var extendsOptionDeclaration = {
  name: "extends",
  type: "listOrElement",
  element: {
    name: "extends",
    type: "string"
  },
  category: Diagnostics.File_Management,
  disallowNullOrUndefined: true
};
var compilerOptionsDeclaration = {
  name: "compilerOptions",
  type: "object",
  elementOptions: getCommandLineCompilerOptionsMap(),
  extraKeyDiagnostics: compilerOptionsDidYouMeanDiagnostics
};
var watchOptionsDeclaration = {
  name: "watchOptions",
  type: "object",
  elementOptions: getCommandLineWatchOptionsMap(),
  extraKeyDiagnostics: watchOptionsDidYouMeanDiagnostics
};
var typeAcquisitionDeclaration = {
  name: "typeAcquisition",
  type: "object",
  elementOptions: getCommandLineTypeAcquisitionMap(),
  extraKeyDiagnostics: typeAcquisitionDidYouMeanDiagnostics
};
var _tsconfigRootOptions;
function getTsconfigRootOptionsMap() {
  if (_tsconfigRootOptions === void 0) {
    _tsconfigRootOptions = {
      name: void 0,
      // should never be needed since this is root
      type: "object",
      elementOptions: commandLineOptionsToMap([
        compilerOptionsDeclaration,
        watchOptionsDeclaration,
        typeAcquisitionDeclaration,
        extendsOptionDeclaration,
        {
          name: "references",
          type: "list",
          element: {
            name: "references",
            type: "object"
          },
          category: Diagnostics.Projects
        },
        {
          name: "files",
          type: "list",
          element: {
            name: "files",
            type: "string"
          },
          category: Diagnostics.File_Management
        },
        {
          name: "include",
          type: "list",
          element: {
            name: "include",
            type: "string"
          },
          category: Diagnostics.File_Management,
          defaultValueDescription: Diagnostics.if_files_is_specified_otherwise_Asterisk_Asterisk_Slash_Asterisk
        },
        {
          name: "exclude",
          type: "list",
          element: {
            name: "exclude",
            type: "string"
          },
          category: Diagnostics.File_Management,
          defaultValueDescription: Diagnostics.node_modules_bower_components_jspm_packages_plus_the_value_of_outDir_if_one_is_specified
        },
        compileOnSaveCommandLineOption
      ])
    };
  }
  return _tsconfigRootOptions;
}
function convertConfigFileToObject(sourceFile, errors, jsonConversionNotifier) {
  var _a;
  const rootExpression = (_a = sourceFile.statements[0]) == null ? void 0 : _a.expression;
  if (rootExpression && rootExpression.kind !== 210 /* ObjectLiteralExpression */) {
    errors.push(createDiagnosticForNodeInSourceFile(
      sourceFile,
      rootExpression,
      Diagnostics.The_root_value_of_a_0_file_must_be_an_object,
      getBaseFileName(sourceFile.fileName) === "jsconfig.json" ? "jsconfig.json" : "tsconfig.json"
    ));
    if (isArrayLiteralExpression(rootExpression)) {
      const firstObject = find(rootExpression.elements, isObjectLiteralExpression);
      if (firstObject) {
        return convertToJson(
          sourceFile,
          firstObject,
          errors,
          /*returnValue*/
          true,
          jsonConversionNotifier
        );
      }
    }
    return {};
  }
  return convertToJson(
    sourceFile,
    rootExpression,
    errors,
    /*returnValue*/
    true,
    jsonConversionNotifier
  );
}
function convertToObject(sourceFile, errors) {
  var _a;
  return convertToJson(
    sourceFile,
    (_a = sourceFile.statements[0]) == null ? void 0 : _a.expression,
    errors,
    /*returnValue*/
    true,
    /*jsonConversionNotifier*/
    void 0
  );
}
function convertToJson(sourceFile, rootExpression, errors, returnValue, jsonConversionNotifier) {
  if (!rootExpression) {
    return returnValue ? {} : void 0;
  }
  return convertPropertyValueToJson(rootExpression, jsonConversionNotifier == null ? void 0 : jsonConversionNotifier.rootOptions);
  function convertObjectLiteralExpressionToJson(node, objectOption) {
    var _a;
    const result = returnValue ? {} : void 0;
    for (const element of node.properties) {
      if (element.kind !== 303 /* PropertyAssignment */) {
        errors.push(createDiagnosticForNodeInSourceFile(sourceFile, element, Diagnostics.Property_assignment_expected));
        continue;
      }
      if (element.questionToken) {
        errors.push(createDiagnosticForNodeInSourceFile(sourceFile, element.questionToken, Diagnostics.The_0_modifier_can_only_be_used_in_TypeScript_files, "?"));
      }
      if (!isDoubleQuotedString(element.name)) {
        errors.push(createDiagnosticForNodeInSourceFile(sourceFile, element.name, Diagnostics.String_literal_with_double_quotes_expected));
      }
      const textOfKey = isComputedNonLiteralName(element.name) ? void 0 : getTextOfPropertyName(element.name);
      const keyText = textOfKey && unescapeLeadingUnderscores(textOfKey);
      const option = keyText ? (_a = objectOption == null ? void 0 : objectOption.elementOptions) == null ? void 0 : _a.get(keyText) : void 0;
      const value = convertPropertyValueToJson(element.initializer, option);
      if (typeof keyText !== "undefined") {
        if (returnValue) {
          result[keyText] = value;
        }
        jsonConversionNotifier == null ? void 0 : jsonConversionNotifier.onPropertySet(keyText, value, element, objectOption, option);
      }
    }
    return result;
  }
  function convertArrayLiteralExpressionToJson(elements, elementOption) {
    if (!returnValue) {
      elements.forEach((element) => convertPropertyValueToJson(element, elementOption));
      return void 0;
    }
    return filter(elements.map((element) => convertPropertyValueToJson(element, elementOption)), (v) => v !== void 0);
  }
  function convertPropertyValueToJson(valueExpression, option) {
    switch (valueExpression.kind) {
      case 112 /* TrueKeyword */:
        return true;
      case 97 /* FalseKeyword */:
        return false;
      case 106 /* NullKeyword */:
        return null;
      case 11 /* StringLiteral */:
        if (!isDoubleQuotedString(valueExpression)) {
          errors.push(createDiagnosticForNodeInSourceFile(sourceFile, valueExpression, Diagnostics.String_literal_with_double_quotes_expected));
        }
        return valueExpression.text;
      case 9 /* NumericLiteral */:
        return Number(valueExpression.text);
      case 224 /* PrefixUnaryExpression */:
        if (valueExpression.operator !== 41 /* MinusToken */ || valueExpression.operand.kind !== 9 /* NumericLiteral */) {
          break;
        }
        return -Number(valueExpression.operand.text);
      case 210 /* ObjectLiteralExpression */:
        const objectLiteralExpression = valueExpression;
        return convertObjectLiteralExpressionToJson(objectLiteralExpression, option);
      case 209 /* ArrayLiteralExpression */:
        return convertArrayLiteralExpressionToJson(
          valueExpression.elements,
          option && option.element
        );
    }
    if (option) {
      errors.push(createDiagnosticForNodeInSourceFile(sourceFile, valueExpression, Diagnostics.Compiler_option_0_requires_a_value_of_type_1, option.name, getCompilerOptionValueTypeString(option)));
    } else {
      errors.push(createDiagnosticForNodeInSourceFile(sourceFile, valueExpression, Diagnostics.Property_value_can_only_be_string_literal_numeric_literal_true_false_null_object_literal_or_array_literal));
    }
    return void 0;
  }
  function isDoubleQuotedString(node) {
    return isStringLiteral(node) && isStringDoubleQuoted(node, sourceFile);
  }
}
function getCompilerOptionValueTypeString(option) {
  return option.type === "listOrElement" ? `${getCompilerOptionValueTypeString(option.element)} or Array` : option.type === "list" ? "Array" : isString(option.type) ? option.type : "string";
}
function isCompilerOptionsValue(option, value) {
  if (option) {
    if (isNullOrUndefined(value))
      return !option.disallowNullOrUndefined;
    if (option.type === "list") {
      return isArray(value);
    }
    if (option.type === "listOrElement") {
      return isArray(value) || isCompilerOptionsValue(option.element, value);
    }
    const expectedType = isString(option.type) ? option.type : "string";
    return typeof value === expectedType;
  }
  return false;
}
function convertToTSConfig(configParseResult, configFileName, host) {
  var _a, _b, _c;
  const getCanonicalFileName = createGetCanonicalFileName(host.useCaseSensitiveFileNames);
  const files = map(
    filter(
      configParseResult.fileNames,
      !((_b = (_a = configParseResult.options.configFile) == null ? void 0 : _a.configFileSpecs) == null ? void 0 : _b.validatedIncludeSpecs) ? returnTrue : matchesSpecs(
        configFileName,
        configParseResult.options.configFile.configFileSpecs.validatedIncludeSpecs,
        configParseResult.options.configFile.configFileSpecs.validatedExcludeSpecs,
        host
      )
    ),
    (f) => getRelativePathFromFile(getNormalizedAbsolutePath(configFileName, host.getCurrentDirectory()), getNormalizedAbsolutePath(f, host.getCurrentDirectory()), getCanonicalFileName)
  );
  const pathOptions = { configFilePath: getNormalizedAbsolutePath(configFileName, host.getCurrentDirectory()), useCaseSensitiveFileNames: host.useCaseSensitiveFileNames };
  const optionMap = serializeCompilerOptions(configParseResult.options, pathOptions);
  const watchOptionMap = configParseResult.watchOptions && serializeWatchOptions(configParseResult.watchOptions);
  const config = {
    compilerOptions: {
      ...optionMapToObject(optionMap),
      showConfig: void 0,
      configFile: void 0,
      configFilePath: void 0,
      help: void 0,
      init: void 0,
      listFiles: void 0,
      listEmittedFiles: void 0,
      project: void 0,
      build: void 0,
      version: void 0
    },
    watchOptions: watchOptionMap && optionMapToObject(watchOptionMap),
    references: map(configParseResult.projectReferences, (r) => ({ ...r, path: r.originalPath ? r.originalPath : "", originalPath: void 0 })),
    files: length(files) ? files : void 0,
    ...((_c = configParseResult.options.configFile) == null ? void 0 : _c.configFileSpecs) ? {
      include: filterSameAsDefaultInclude(configParseResult.options.configFile.configFileSpecs.validatedIncludeSpecs),
      exclude: configParseResult.options.configFile.configFileSpecs.validatedExcludeSpecs
    } : {},
    compileOnSave: !!configParseResult.compileOnSave ? true : void 0
  };
  const providedKeys = new Set(optionMap.keys());
  const impliedCompilerOptions = {};
  for (const option in computedOptions) {
    if (!providedKeys.has(option) && some(computedOptions[option].dependencies, (dep) => providedKeys.has(dep))) {
      const implied = computedOptions[option].computeValue(configParseResult.options);
      const defaultValue = computedOptions[option].computeValue({});
      if (implied !== defaultValue) {
        impliedCompilerOptions[option] = computedOptions[option].computeValue(configParseResult.options);
      }
    }
  }
  assign(config.compilerOptions, optionMapToObject(serializeCompilerOptions(impliedCompilerOptions, pathOptions)));
  return config;
}
function optionMapToObject(optionMap) {
  return {
    ...arrayFrom(optionMap.entries()).reduce((prev, cur) => ({ ...prev, [cur[0]]: cur[1] }), {})
  };
}
function filterSameAsDefaultInclude(specs) {
  if (!length(specs))
    return void 0;
  if (length(specs) !== 1)
    return specs;
  if (specs[0] === defaultIncludeSpec)
    return void 0;
  return specs;
}
function matchesSpecs(path, includeSpecs, excludeSpecs, host) {
  if (!includeSpecs)
    return returnTrue;
  const patterns = getFileMatcherPatterns(path, excludeSpecs, includeSpecs, host.useCaseSensitiveFileNames, host.getCurrentDirectory());
  const excludeRe = patterns.excludePattern && getRegexFromPattern(patterns.excludePattern, host.useCaseSensitiveFileNames);
  const includeRe = patterns.includeFilePattern && getRegexFromPattern(patterns.includeFilePattern, host.useCaseSensitiveFileNames);
  if (includeRe) {
    if (excludeRe) {
      return (path2) => !(includeRe.test(path2) && !excludeRe.test(path2));
    }
    return (path2) => !includeRe.test(path2);
  }
  if (excludeRe) {
    return (path2) => excludeRe.test(path2);
  }
  return returnTrue;
}
function getCustomTypeMapOfCommandLineOption(optionDefinition) {
  switch (optionDefinition.type) {
    case "string":
    case "number":
    case "boole