.           x.�mXmX  /�mX��    ..          x.�mXmX  /�mX}l    FLOW    JS  1�mXmX  6�mXi�i  JSX        c��mXmX  ��mX+�    TYPES   JS  ���mXmX  ��mX��m  At y p e s  c r i p t .   j s TYPESC~1JS   c��mXmX  �mX��x�                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  edDiskPath(include) ? include : normalizePath(combinePaths(path, include));
      includeBasePaths.push(getIncludeBasePath(absolute));
    }
    includeBasePaths.sort(getStringComparer(!useCaseSensitiveFileNames2));
    for (const includeBasePath of includeBasePaths) {
      if (every(basePaths, (basePath) => !containsPath(basePath, includeBasePath, path, !useCaseSensitiveFileNames2))) {
        basePaths.push(includeBasePath);
      }
    }
  }
  return basePaths;
}
function getIncludeBasePath(absolute) {
  const wildcardOffset = indexOfAnyCharCode(absolute, wildcardCharCodes);
  if (wildcardOffset < 0) {
    return !hasExtension(absolute) ? absolute : removeTrailingDirectorySeparator(getDirectoryPath(absolute));
  }
  return absolute.substring(0, absolute.lastIndexOf(directorySeparator, wildcardOffset));
}
function ensureScriptKind(fileName, scriptKind) {
  return scriptKind || getScriptKindFromFileName(fileName) || 3 /* TS */;
}
function getScriptKindFromFileName(fileName) {
  const ext = fileName.substr(fileName.lastIndexOf("."));
  switch (ext.toLowerCase()) {
    case ".js" /* Js */:
    case ".cjs" /* Cjs */:
    case ".mjs" /* Mjs */:
      return 1 /* JS */;
    case ".jsx" /* Jsx */:
      return 2 /* JSX */;
    case ".ts" /* Ts */:
    case ".cts" /* Cts */:
    case ".mts" /* Mts */:
      return 3 /* TS */;
    case ".tsx" /* Tsx */:
      return 4 /* TSX */;
    case ".json" /* Json */:
      return 6 /* JSON */;
    default:
      return 0 /* Unknown */;
  }
}
var supportedTSExtensions = [[".ts" /* Ts */, ".tsx" /* Tsx */, ".d.ts" /* Dts */], [".cts" /* Cts */, ".d.cts" /* Dcts */], [".mts" /* Mts */, ".d.mts" /* Dmts */]];
var supportedTSExtensionsFlat = flatten(supportedTSExtensions);
var supportedTSExtensionsWithJson = [...supportedTSExtensions, [".json" /* Json */]];
var supportedTSExtensionsForExtractExtension = [".d.ts" /* Dts */, ".d.cts" /* Dcts */, ".d.mts" /* Dmts */, ".cts" /* Cts */, ".mts" /* Mts */, ".ts" /* Ts */, ".tsx" /* Tsx */];
var supportedJSExtensions = [[".js" /* Js */, ".jsx" /* Jsx */], [".mjs" /* Mjs */], [".cjs" /* Cjs */]];
var supportedJSExtensionsFlat = flatten(supportedJSExtensions);
var allSupportedExtensions = [[".ts" /* Ts */, ".tsx" /* Tsx */, ".d.ts" /* Dts */, ".js" /* Js */, ".jsx" /* Jsx */], [".cts" /* Cts */, ".d.cts" /* Dcts */, ".cjs" /* Cjs */], [".mts" /* Mts */, ".d.mts" /* Dmts */, ".mjs" /* Mjs */]];
var allSupportedExtensionsWithJson = [...allSupportedExtensions, [".json" /* Json */]];
var supportedDeclarationExtensions = [".d.ts" /* Dts */, ".d.cts" /* Dcts */, ".d.mts" /* Dmts */];
var supportedTSImplementationExtensions = [".ts" /* Ts */, ".cts" /* Cts */, ".mts" /* Mts */, ".tsx" /* Tsx */];
var extensionsNotSupportingExtensionlessResolution = [".mts" /* Mts */, ".d.mts" /* Dmts */, ".mjs" /* Mjs */, ".cts" /* Cts */, ".d.cts" /* Dcts */, ".cjs" /* Cjs */];
function getSupportedExtensions(options, extraFileExtensions) {
  const needJsExtensions = options && getAllowJSCompilerOption(options);
  if (!extraFileExtensions || extraFileExtensions.length === 0) {
    return needJsExtensions ? allSupportedExtensions : supportedTSExtensions;
  }
  const builtins = needJsExtensions ? allSupportedExtensions : supportedTSExtensions;
  const flatBuiltins = flatten(builtins);
  const extensions = [
    ...builtins,
    ...mapDefined(extraFileExtensions, (x) => x.scriptKind === 7 /* Deferred */ || needJsExtensions && isJSLike(x.scriptKind) && !flatBuiltins.includes(x.extension) ? [x.extension] : void 0)
  ];
  return extensions;
}
function getSupportedExtensionsWithJsonIfResolveJsonModule(options, supportedExtensions) {
  if (!options || !getResolveJsonModule(options))
    return supportedExtensions;
  if (supportedExtensions === allSupportedExtensions)
    return allSupportedExtensionsWithJson;
  if (supportedExtensions === supportedTSExtensions)
    return supportedTSExtensionsWithJson;
  return [...supportedExtensions, [".json" /* Json */]];
}
function isJSLike(scriptKind) {
  return scriptKind === 1 /* JS */ || scriptKind === 2 /* JSX */;
}
function hasJSFileExtension(fileName) {
  return some(supportedJSExtensionsFlat, (extension) => fileExtensionIs(fileName, extension));
}
function hasTSFileExtension(fileName) {
  return some(supportedTSExtensionsFlat, (extension) => fileExtensionIs(fileName, extension));
}
function usesExtensionsOnImports({ imports }, hasExtension2 = or(hasJSFileExtension, hasTSFileExtension)) {
  return firstDefined(imports, ({ text }) => pathIsRelative(text) && !fileExtensionIsOneOf(text, extensionsNotSupportingExtensionlessResolution) ? hasExtension2(text) : void 0) || false;
}
function getModuleSpecifierEndingPreference(preference, resolutionMode, compilerOptions, sourceFile) {
  const moduleResolution = getEmitModuleResolutionKind(compilerOptions);
  const moduleResolutionIsNodeNext = 3 /* Node16 */ <= moduleResolution && moduleResolution <= 99 /* NodeNext */;
  if (preference === "js" || resolutionMode === 99 /* ESNext */ && moduleResolutionIsNodeNext) {
    if (!shouldAllowImportingTsExtension(compilerOptions)) {
      return 2 /* JsExtension */;
    }
    return inferPreference() !== 2 /* JsExtension */ ? 3 /* TsExtension */ : 2 /* JsExtension */;
  }
  if (preference === "minimal") {
    return 0 /* Minimal */;
  }
  if (preference === "index") {
    return 1 /* Index */;
  }
  if (!shouldAllowImportingTsExtension(compilerOptions)) {
    return usesExtensionsOnImports(sourceFile) ? 2 /* JsExtension */ : 0 /* Minimal */;
  }
  return inferPreference();
  function inferPreference() {
    let usesJsExtensions = false;
    const specifiers = sourceFile.imports.length ? sourceFile.imports : isSourceFileJS(sourceFile) ? getRequiresAtTopOfFile(sourceFile).map((r) => r.arguments[0]) : emptyArray;
    for (const specifier of specifiers) {
      if (pathIsRelative(specifier.text)) {
        if (moduleResolutionIsNodeNext && resolutionMode === 1 /* CommonJS */ && getModeForUsageLocation(sourceFile, specifier, compilerOptions) === 99 /* ESNext */) {
          continue;
        }
        if (fileExtensionIsOneOf(specifier.text, extensionsNotSupportingExtensionlessResolution)) {
          continue;
        }
        if (hasTSFileExtension(specifier.text)) {
          return 3 /* TsExtension */;
        }
        if (hasJSFileExtension(specifier.text)) {
          usesJsExtensions = true;
        }
      }
    }
    return usesJsExtensions ? 2 /* JsExtension */ : 0 /* Minimal */;
  }
}
function getRequiresAtTopOfFile(sourceFile) {
  let nonRequireStatementCount = 0;
  let requires;
  for (const statement of sourceFile.statements) {
    if (nonRequireStatementCount > 3) {
      break;
    }
    if (isRequireVariableStatement(statement)) {
      requires = concatenate(requires, statement.declarationList.declarations.map((d) => d.initializer));
    } else if (isExpressionStatement(statement) && isRequireCall(
      statement.expression,
      /*requireStringLiteralLikeArgument*/
      true
    )) {
      requires = append(requires, statement.expression);
    } else {
      nonRequireStatementCount++;
    }
  }
  return requires || emptyArray;
}
function isSupportedSourceFileName(fileName, compilerOptions, extraFileExtensions) {
  if (!fileName)
    return false;
  const supportedExtensions = getSupportedExtensions(compilerOptions, extraFileExtensions);
  for (const extension of flatten(getSupportedExtensionsWithJsonIfResolveJsonModule(compilerOptions, supportedExtensions))) {
    if (fileExtensionIs(fileName, extension)) {
      return true;
    }
  }
  return false;
}
function numberOfDirectorySeparators(str) {
  const match = str.match(/\//g);
  return match ? match.length : 0;
}
function compareNumberOfDirectorySeparators(path1, path2) {
  return compareValues(
    numberOfDirectorySeparators(path1),
    numberOfDirectorySeparators(path2)
  );
}
var extensionsToRemove = [".d.ts" /* Dts */, ".d.mts" /* Dmts */, ".d.cts" /* Dcts */, ".mjs" /* Mjs */, ".mts" /* Mts */, ".cjs" /* Cjs */, ".cts" /* Cts */, ".ts" /* Ts */, ".js" /* Js */, ".tsx" /* Tsx */, ".jsx" /* Jsx */, ".json" /* Json */];
function removeFileExtension(path) {
  for (const ext of extensionsToRemove) {
    const extensionless = tryRemoveExtension(path, ext);
    if (extensionless !== void 0) {
      return extensionless;
    }
  }
  return path;
}
function tryRemoveExtension(path, extension) {
  return fileExtensionIs(path, extension) ? removeExtension(path, extension) : void 0;
}
function removeExtension(path, extension) {
  return path.substring(0, path.length - extension.length);
}
function changeExtension(path, newExtension) {
  return changeAnyExtension(
    path,
    newExtension,
    extensionsToRemove,
    /*ignoreCase*/
    false
  );
}
function tryParsePattern(pattern) {
  const indexOfStar = pattern.indexOf("*");
  if (indexOfStar === -1) {
    return pattern;
  }
  return pattern.indexOf("*", indexOfStar + 1) !== -1 ? void 0 : {
    prefix: pattern.substr(0, indexOfStar),
    suffix: pattern.substr(indexOfStar + 1)
  };
}
function tryParsePatterns(paths) {
  return mapDefined(getOwnKeys(paths), (path) => tryParsePattern(path));
}
function positionIsSynthesized(pos) {
  return !(pos >= 0);
}
function extensionIsTS(ext) {
  return ext === ".ts" /* Ts */ || ext === ".tsx" /* Tsx */ || ext === ".d.ts" /* Dts */ || ext === ".cts" /* Cts */ || ext === ".mts" /* Mts */ || ext === ".d.mts" /* Dmts */ || ext === ".d.cts" /* Dcts */ || startsWith(ext, ".d.") && endsWith(ext, ".ts");
}
function resolutionExtensionIsTSOrJson(ext) {
  return extensionIsTS(ext) || ext === ".json" /* Json */;
}
function extensionFromPath(path) {
  const ext = tryGetExtensionFromPath2(path);
  return ext !== void 0 ? ext : Debug.fail(`File ${path} has unknown extension.`);
}
function tryGetExtensionFromPath2(path) {
  return find(extensionsToRemove, (e) => fileExtensionIs(path, e));
}
function isCheckJsEnabledForFile(sourceFile, compilerOptions) {
  return sourceFile.checkJsDirective ? sourceFile.checkJsDirective.enabled : compilerOptions.checkJs;
}
var emptyFileSystemEntries = {
  files: emptyArray,
  directories: emptyArray
};
function matchPatternOrExact(patternOrStrings, candidate) {
  const patterns = [];
  for (const patternOrString of patternOrStrings) {
    if (patternOrString === candidate) {
      return candidate;
    }
    if (!isString(patternOrString)) {
      patterns.push(patternOrString);
    }
  }
  return findBestPatternMatch(patterns, (_) => _, candidate);
}
function sliceAfter(arr, value) {
  const index = arr.indexOf(value);
  Debug.assert(index !== -1);
  return arr.slice(index);
}
function addRelatedInfo(diagnostic, ...relatedInformation) {
  if (!relatedInformation.length) {
    return diagnostic;
  }
  if (!diagnostic.relatedInformation) {
    diagnostic.relatedInformation = [];
  }
  Debug.assert(diagnostic.relatedInformation !== emptyArray, "Diagnostic had empty array singleton for related info, but is still being constructed!");
  diagnostic.relatedInformation.push(...relatedInformation);
  return diagnostic;
}
function minAndMax(arr, getValue) {
  Debug.assert(arr.length !== 0);
  let min2 = getValue(arr[0]);
  let max = min2;
  for (let i = 1; i < arr.length; i++) {
    const value = getValue(arr[i]);
    if (value < min2) {
      min2 = value;
    } else if (value > max) {
      max = value;
    }
  }
  return { min: min2, max };
}
function rangeOfNode(node) {
  return { pos: getTokenPosOfNode(node), end: node.end };
}
function rangeOfTypeParameters(sourceFile, typeParameters) {
  const pos = typeParameters.pos - 1;
  const end = Math.min(sourceFile.text.length, skipTrivia(sourceFile.text, typeParameters.end) + 1);
  return { p