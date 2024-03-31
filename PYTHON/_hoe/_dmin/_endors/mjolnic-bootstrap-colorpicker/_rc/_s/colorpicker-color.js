lution: true,
    category: Diagnostics.Interop_Constraints,
    description: Diagnostics.Ensure_that_casing_is_correct_in_imports,
    defaultValueDescription: true
  },
  {
    name: "maxNodeModuleJsDepth",
    type: "number",
    affectsModuleResolution: true,
    category: Diagnostics.JavaScript_Support,
    description: Diagnostics.Specify_the_maximum_folder_depth_used_for_checking_JavaScript_files_from_node_modules_Only_applicable_with_allowJs,
    defaultValueDescription: 0
  },
  {
    name: "noStrictGenericChecks",
    type: "boolean",
    affectsSemanticDiagnostics: true,
    affectsBuildInfo: true,
    category: Diagnostics.Backwards_Compatibility,
    description: Diagnostics.Disable_strict_checking_of_generic_signatures_in_function_types,
    defaultValueDescription: false
  },
  {
    name: "useDefineForClassFields",
    type: "boolean",
    affectsSemanticDiagnostics: true,
    affectsEmit: true,
    affectsBuildInfo: true,
    category: Diagnostics.Language_and_Environment,
    description: Diagnostics.Emit_ECMAScript_standard_compliant_class_fields,
    defaultValueDescription: Diagnostics.true_for_ES2022_and_above_including_ESNext
  },
  {
    name: "preserveValueImports",
    type: "boolean",
    affectsEmit: true,
    affectsBuildInfo: true,
    category: Diagnostics.Emit,
    description: Diagnostics.Preserve_unused_imported_values_in_the_JavaScript_output_that_would_otherwise_be_removed,
    defaultValueDescription: false
  },
  {
    name: "keyofStringsOnly",
    type: "boolean",
    category: Diagnostics.Backwards_Compatibility,
    description: Diagnostics.Make_keyof_only_return_strings_instead_of_string_numbers_or_symbols_Legacy_option,
    defaultValueDescription: false
  },
  {
    // A list of plugins to load in the language service
    name: "plugins",
    type: "list",
    isTSConfigOnly: true,
    element: {
      name: "plugin",
      type: "object"
    },
    description: Diagnostics.Specify_a_list_of_language_service_plugins_to_include,
    category: Diagnostics.Editor_Support
  },
  {
    name: "moduleDetection",
    type: new Map(Object.entries({
      auto: 2 /* Auto */,
      legacy: 1 /* Legacy */,
      force: 3 /* Force */
    })),
    affectsSourceFile: true,
    affectsModuleResolution: true,
    description: Diagnostics.Control_what_method_is_used_to_detect_module_format_JS_files,
    category: Diagnostics.Language_and_Environment,
    defaultValueDescription: Diagnostics.auto_Colon_Treat_files_with_imports_exports_import_meta_jsx_with_jsx_Colon_react_jsx_or_esm_format_with_module_Colon_node16_as_modules
  },
  {
    name: "ignoreDeprecations",
    type: "string",
    defaultValueDescription: void 0
  }
];
var optionDeclarations = [
  ...commonOptionsWithBuild,
  ...commandOptionsWithoutBuild
];
var semanticDiagnosticsOptionDeclarations = optionDeclarations.filter((option) => !!option.affectsSemanticDiagnostics);
var affectsEmitOptionDeclarations = optionDeclarations.filter((option) => !!option.affectsEmit);
var affectsDeclarationPathOptionDeclarations = optionDeclarations.filter((option) => !!option.affectsDeclarationPath);
var moduleResolutionOptionDeclarations = optionDeclarations.filter((option) => !!option.affectsModuleResolution);
var sourceFileAffectingCompilerOptions = optionDeclarations.filter((option) => !!option.affectsSourceFile || !!option.affectsBindDiagnostics);
var optionsAffectingProgramStructure = optionDeclarations.filter((option) => !!option.affectsProgramStructure);
var transpileOptionValueCompilerOptions = optionDeclarations.filter((option) => hasProperty(option, "transpileOptionValue"));
var optionsForBuild = [
  {
    name: "verbose",
    shortName: "v",
    category: Diagnostics.Command_line_Options,
    description: Diagnostics.Enable_verbose_logging,
    type: "boolean",
    defaultValueDescription: false
  },
  {
    name: "dry",
    shortName: "d",
    category: Diagnostics.Command_line_Options,
    description: Diagnostics.Show_what_would_be_built_or_deleted_if_specified_with_clean,
    type: "boolean",
    defaultValueDescription: false
  },
  {
    name: "force",
    shortName: "f",
    category: Diagnostics.Command_line_Options,
    description: Diagnostics.Build_all_projects_including_those_that_appear_to_be_up_to_date,
    type: "boolean",
    defaultValueDescription: false
  },
  {
    name: "clean",
    category: Diagnostics.Command_line_Options,
    description: Diagnostics.Delete_the_outputs_of_all_projects,
    type: "boolean",
    defaultValueDescription: false
  }
];
var buildOpts = [
  ...commonOptionsWithBuild,
  ...optionsForBuild
];
var typeAcquisitionDeclarations = [
  {
    name: "enable",
    type: "boolean",
    defaultValueDescription: false
  },
  {
    name: "include",
    type: "list",
    element: {
      name: "include",
      type: "string"
    }
  },
  {
    name: "exclude",
    type: "list",
    element: {
      name: "exclude",
      type: "string"
    }
  },
  {
    name: "disableFilenameBasedTypeAcquisition",
    type: "boolean",
    defaultValueDescription: false
  }
];
function createOptionNameMap(optionDeclarations2) {
  const optionsNameMap = /* @__PURE__ */ new Map();
  const shortOptionNames = /* @__PURE__ */ new Map();
  forEach(optionDeclarations2, (option) => {
    optionsNameMap.set(option.name.toLowerCase(), option);
    if (option.shortName) {
      shortOptionNames.set(option.shortName, option.name);
    }
  });
  return { optionsNameMap, shortOptionNames };
}
var optionsNameMapCache;
function getOptionsNameMap() {
  return optionsNameMapCache || (optionsNameMapCache = createOptionNameMap(optionDeclarations));
}
var compilerOptionsAlternateMode = {
  diagnostic: Diagnostics.Compiler_option_0_may_only_be_used_with_build,
  getOptionsNameMap: getBuildOptionsNameMap
};
var defaultInitCompilerOptions = {
  module: 1 /* CommonJS */,
  target: 3 /* ES2016 */,
  strict: true,
  esModuleInterop: true,
  forceConsistentCasingInFileNames: true,
  skipLibCheck: true
};
function createDiagnosticForInvalidCustomType(opt, createDiagnostic) {
  const namesOfType = arrayFrom(opt.type.keys());
  const stringNames = (opt.deprecatedKeys ? namesOfType.filter((k) => !opt.deprecatedKeys.has(k)) : namesOfType).map((key) => `'${key}'`).join(", ");
  return createDiagnostic(Diagnostics.Argument_for_0_option_must_be_Colon_1, `--${opt.name}`, stringNames);
}
function parseCustomTypeOption(opt, value, errors) {
  return convertJsonOptionOfCustomType(opt, (value ?? "").trim(), errors);
}
function parseListTypeOption(opt, value = "", errors) {
  value = value.trim();
  if (startsWith(value, "-")) {
    return void 0;
  }
  if (opt.type === "listOrElement" && !value.includes(",")) {
    return validateJsonOptionValue(opt, value, errors);
  }
  if (value === "") {
    return [];
  }
  const values = value.split(",");
  switch (opt.element.type) {
    case "number":
      return mapDefined(values, (v) => validateJsonOptionValue(opt.element, parseInt(v), errors));
    case "string":
      return mapDefined(values, (v) => validateJsonOptionValue(opt.element, v || "", errors));
    case "boolean":
    case "object":
      return Debug.fail(`List of ${opt.element.type} is not yet supported.`);
    default:
      return mapDefined(values, (v) => parseCustomTypeOption(opt.element, v, errors));
  }
}
function getOptionName(option) {
  return option.name;
}
function createUnknownOptionError(unknownOption, diagnostics, unknownOptionErrorText, node, sourceFile) {
  var _a;
  if ((_a = diagnostics.alternateMode) == null ? void 0 : _a.getOptionsNameMap().optionsNameMap.has(unknownOption.toLowerCase())) {
    return createDiagnosticForNodeInSourceFileOrCompilerDiagnostic(sourceFile, node, diagnostics.alternateMode.diagnostic, unknownOption);
  }
  const possibleOption = getSpellingSuggestion(unknownOption, diagnostics.optionDeclarations, getOptionName);
  return possibleOption ? createDiagnosticForNodeInSourceFileOrCompilerDiagnostic(sourceFile, node, diagnostics.unknownDidYouMeanDiagnostic, unknownOptionErrorText || unknownOption, possibleOption.name) : createDiagnosticForNodeInSourceFileOrCompilerDiagnostic(sourceFile, node, diagnostics.unknownOptionDiagnostic, unknownOptionErrorText || unknownOption);
}
function parseCommandLineWorker(diagnostics, commandLine, readFile) {
  const options = {};
  let watchOptions;
  const fileNames = [];
  const errors = [];
  parseStrings(commandLine);
  return {
    options,
    watchOptions,
    fileNames,
    errors
  };
  function parseStrings(args) {
    let i = 0;
    while (i < args.length) {
      const s = args[i];
      i++;
      if (s.charCodeAt(0) === 64 /* at */) {
        parseResponseFile(s.slice(1));
      } else if (s.charCodeAt(0) === 45 /* minus */) {
        const inputOptionName = s.slice(s.charCodeAt(1) === 45 /* minus */ ? 2 : 1);
        const opt = getOptionDeclarationFromName(
          diagnostics.getOptionsNameMap,
          inputOptionName,
          /*allowShort*/
          true
        );
        if (opt) {
          i = parseOptionValue(args, i, diagnostics, opt, options, errors);
        } else {
          const watchOpt = getOptionDeclarationFromName(
            watchOptionsDidYouMeanDiagnostics.getOptionsNameMap,
            inputOptionName,
            /*allowShort*/
            true
          );
          if (watchOpt) {
            i = parseOptionValue(args, i, watchOptionsDidYouMeanDiagnostics, watchOpt, watchOptions || (watchOptions = {}), errors);
          } else {
            errors.push(createUnknownOptionError(inputOptionName, diagnostics, s));
          }
        }
      } else {
        fileNames.push(s);
      }
    }
  }
  function parseResponseFile(fileName) {
    const text = tryReadFile(fileName, readFile || ((fileName2) => sys.readFile(fileName2)));
    if (!isString(text)) {
      errors.push(text);
      return;
    }
    const args = [];
    let pos = 0;
    while (true) {
      while (pos < text.length && text.charCodeAt(pos) <= 32 /* space */)
        pos++;
      if (pos >= text.length)
        break;
      const start = pos;
      if (text.charCodeAt(start) === 34 /* doubleQuote */) {
        pos++;
        while (pos < text.length && text.charCodeAt(pos) !== 34 /* doubleQuote */)
          pos++;
        if (pos < text.length) {
          args.push(text.substring(start + 1, pos));
          pos++;
        } else {
          errors.push(createCompilerDiagnostic(Diagnostics.Unterminated_quoted_string_in_response_file_0, fileName));
        }
      } else {
        while (text.charCodeAt(pos) > 32 /* space */)
          pos++;
        args.push(text.substring(start, pos));
      }
    }
    parseStrings(args);
  }
}
function parseOptionValue(args, i, diagnostics, opt, options, errors) {
  if (opt.isTSConfigOnly) {
    const optValue = args[i];
    if (optValue === "null") {
      options[opt.name] = void 0;
      i++;
    } else if (opt.type === "boolean") {
      if (optValue === "false") {
        options[opt.name] = validateJsonOptionValue(
          opt,
          /*value*/
          false,
          errors
        );
        i++;
      } else {
        if (optValue === "true")
          i++;
        errors.push(createCompilerDiagnostic(Diagnostics.Option_0_can_only_be_specified_in_tsconfig_json_file_or_set_to_false_or_null_on_command_line, opt.name));
      }
    } else {
      errors.push(createCompilerDiagnostic(Diagnostics.Option_0_can_only_be_specified_in_tsconfig_json_file_or_set_to_null_on_command_line, opt.name));
      if (optValue && !startsWith(optValue, "-"))
        i++;
    }
  } else {
    if (!args[i] && opt.type !== "boolean") {
      errors.push(createCompilerDiagnostic(diagnostics.optionTypeMismatchDiagnostic, opt.name, getCompilerOptionValueTypeString(opt)));
    }
    if (args[i] !== "null") {
      switch (opt.type) {
        case "number":
          options[opt.name] = validateJsonOptionValue(opt, parseInt(args[i]), errors);
          i++;
          break;
        case "boolean":
          const optValue = args[i];
          options[opt.name] = validateJsonOptionValue(opt, optValue !== "false", errors);
          if (optValue === "false" || optValue === "true") {
            i++;
          }
          break;
        case "string":
          options[opt.name] = validateJsonOptionValue(opt, args[i] || "", errors);
          i++;
          break;
        case "list":
          const result = parseListTypeOption(opt, args[i], errors);
          options[opt.name] = result || [];
          if (result) {
            i++;
          }
          break;
        case "listOrElement":
          Debug.fail("listOrElement not supported here");
          break;
        default:
          options[opt.name] = parseCustomTypeOption(opt, args[i], errors);
          i++;
          break;
      }
    } else {
      options[opt.name] = void 0;
      i++;
    }
  }
  return i;
}
var compilerOptionsDidYouMeanDiagnostics = {
  alternateMode: compilerOptionsAlternateMode,
  getOptionsNameMap,
  optionDeclarations,
  unknownOptionDiagnostic: Diagnostics.Unknown_compiler_option_0,
  unknownDidYouMeanDiagnostic: Diagnostics.Unknown_compiler_option_0_Did_you_mean_1,
  optionTypeMismatchDiagnostic: Diagnostics.Compiler_option_0_expects_an_argument
};
function parseCommandLine(commandLine, readFile) {
  return parseCommandLineWorker(compilerOptionsDidYouMeanDiagnostics, commandLine, readFile);
}
functio