function parsePackageName(moduleName) {
  let idx = moduleName.indexOf(directorySeparator);
  if (moduleName[0] === "@") {
    idx = moduleName.indexOf(directorySeparator, idx + 1);
  }
  return idx === -1 ? { packageName: moduleName, rest: "" } : { packageName: moduleName.slice(0, idx), rest: moduleName.slice(idx + 1) };
}
function allKeysStartWithDot(obj) {
  return every(getOwnKeys(obj), (k) => startsWith(k, "."));
}
function noKeyStartsWithDot(obj) {
  return !some(getOwnKeys(obj), (k) => startsWith(k, "."));
}
function loadModuleFromSelfNameReference(extensions, moduleName, directory, state, cache, redirectedReference) {
  var _a, _b;
  const directoryPath = getNormalizedAbsolutePath(combinePaths(directory, "dummy"), (_b = (_a = state.host).getCurrentDirectory) == null ? void 0 : _b.call(_a));
  const scope = getPackageScopeForPath(directoryPath, state);
  if (!scope || !scope.contents.packageJsonContent.exports) {
    return void 0;
  }
  if (typeof scope.contents.packageJsonContent.name !== "string") {
    return void 0;
  }
  const parts = getPathComponents(moduleName);
  const nameParts = getPathComponents(scope.contents.packageJsonContent.name);
  if (!every(nameParts, (p, i) => parts[i] === p)) {
    return void 0;
  }
  const trailingParts = parts.slice(nameParts.length);
  const subpath = !length(trailingParts) ? "." : `.${directorySeparator}${trailingParts.join(directorySeparator)}`;
  if (getAllowJSCompilerOption(state.compilerOptions) && !pathContainsNodeModules(directory)) {
    return loadModuleFromExports(scope, extensions, subpath, state, cache, redirectedReference);
  }
  const priorityExtensions = extensions & (1 /* TypeScript */ | 4 /* Declaration */);
  const secondaryExtensions = extensions & ~(1 /* TypeScript */ | 4 /* Declaration */);
  return loadModuleFromExports(scope, priorityExtensions, subpath, state, cache, redirectedReference) || loadModuleFromExports(scope, secondaryExtensions, subpath, state, cache, redirectedReference);
}
function loadModuleFromExports(scope, extensions, subpath, state, cache, redirectedReference) {
  if (!scope.contents.packageJsonContent.exports) {
    return void 0;
  }
  if (subpath === ".") {
    let mainExport;
    if (typeof scope.contents.packageJsonContent.exports === "string" || Array.isArray(scope.contents.packageJsonContent.exports) || typeof scope.contents.packageJsonContent.exports === "object" && noKeyStartsWithDot(scope.contents.packageJsonContent.exports)) {
      mainExport = scope.contents.packageJsonContent.exports;
    } else if (hasProperty(scope.contents.packageJsonContent.exports, ".")) {
      mainExport = scope.contents.packageJsonContent.exports["."];
    }
    if (mainExport) {
      const loadModuleFromTargetImportOrExport = getLoadModuleFromTargetImportOrExport(
        extensions,
        state,
        cache,
        redirectedReference,
        subpath,
        scope,
        /*isImports*/
        false
      );
      return loadModuleFromTargetImportOrExport(
        mainExport,
        "",
        /*pattern*/
        false,
        "."
      );
    }
  } else if (allKeysStartWithDot(scope.contents.packageJsonContent.exports)) {
    if (typeof scope.contents.packageJsonContent.exports !== "object") {
      if (state.traceEnabled) {
        trace(state.host, Diagnostics.Export_specifier_0_does_not_exist_in_package_json_scope_at_path_1, subpath, scope.packageDirectory);
      }
      return toSearchResult(
        /*value*/
        void 0
      );
    }
    const result = loadModuleFromImportsOrExports(
      extensions,
      state,
      cache,
      redirectedReference,
      subpath,
      scope.contents.packageJsonContent.exports,
      scope,
      /*isImports*/
      false
    );
    if (result) {
      return result;
    }
  }
  if (state.traceEnabled) {
    trace(state.host, Diagnostics.Export_specifier_0_does_not_exist_in_package_json_scope_at_path_1, subpath, scope.packageDirectory);
  }
  return toSearchResult(
    /*value*/
    void 0
  );
}
function loadModuleFromImports(extensions, moduleName, directory, state, cache, redirectedReference) {
  var _a, _b;
  if (moduleName === "#" || startsWith(moduleName, "#/")) {
    if (state.traceEnabled) {
      trace(state.host, Diagnostics.Invalid_import_specifier_0_has_no_possible_resolutions, moduleName);
    }
    return toSearchResult(
      /*value*/
      void 0
    );
  }
  const directoryPath = getNormalizedAbsolutePath(combinePaths(directory, "dummy"), (_b = (_a = state.host).getCurrentDirectory) == null ? void 0 : _b.call(_a));
  const scope = getPackageScopeForPath(directoryPath, state);
  if (!scope) {
    if (state.traceEnabled) {
      trace(state.host, Diagnostics.Directory_0_has_no_containing_package_json_scope_Imports_will_not_resolve, directoryPath);
    }
    return toSearchResult(
      /*value*/
      void 0
    );
  }
  if (!scope.contents.packageJsonContent.imports) {
    if (state.traceEnabled) {
      trace(state.host, Diagnostics.package_json_scope_0_has_no_imports_defined, scope.packageDirectory);
    }
    return toSearchResult(
      /*value*/
      void 0
    );
  }
  const result = loadModuleFromImportsOrExports(
    extensions,
    state,
    cache,
    redirectedReference,
    moduleName,
    scope.contents.packageJsonContent.imports,
    scope,
    /*isImports*/
    true
  );
  if (result) {
    return result;
  }
  if (state.traceEnabled) {
    trace(state.host, Diagnostics.Import_specifier_0_does_not_exist_in_package_json_scope_at_path_1, moduleName, scope.packageDirectory);
  }
  return toSearchResult(
    /*value*/
    void 0
  );
}
function comparePatternKeys(a, b) {
  const aPatternIndex = a.indexOf("*");
  const bPatternIndex = b.indexOf("*");
  const baseLenA = aPatternIndex === -1 ? a.length : aPatternIndex + 1;
  const baseLenB = bPatternIndex === -1 ? b.length : bPatternIndex + 1;
  if (baseLenA > baseLenB)
    return -1;
  if (baseLenB > baseLenA)
    return 1;
  if (aPatternIndex === -1)
    return 1;
  if (bPatternIndex === -1)
    return -1;
  if (a.length > b.length)
    return -1;
  if (b.length > a.length)
    return 1;
  return 0;
}
function loadModuleFromImportsOrExports(extensions, state, cache, redirectedReference, moduleName, lookupTable, scope, isImports) {
  const loadModuleFromTargetImportOrExport = getLoadModuleFromTargetImportOrExport(extensions, state, cache, redirectedReference, moduleName, scope, isImports);
  if (!endsWith(moduleName, directorySeparator) && !moduleName.includes("*") && hasProperty(lookupTable, moduleName)) {
    const target = lookupTable[moduleName];
    return loadModuleFromTargetImportOrExport(
      target,
      /*subpath*/
      "",
      /*pattern*/
      false,
      moduleName
    );
  }
  const expandingKeys = sort(filter(getOwnKeys(lookupTable), (k) => k.includes("*") || endsWith(k, "/")), comparePatternKeys);
  for (const potentialTarget of expandingKeys) {
    if (state.features & 16 /* ExportsPatternTrailers */ && matchesPatternWithTrailer(potentialTarget, moduleName)) {
      const target = lookupTable[potentialTarget];
      const starPos = potentialTarget.indexOf("*");
      const subpath = moduleName.substring(potentialTarget.substring(0, starPos).length, moduleName.length - (potentialTarget.length - 1 - starPos));
      return loadModuleFromTargetImportOrExport(
        target,
        subpath,
        /*pattern*/
        true,
        potentialTarget
      );
    } else if (endsWith(potentialTarget, "*") && startsWith(moduleName, potentialTarget.substring(0, potentialTarget.length - 1))) {
      const target = lookupTable[potentialTarget];
      const subpath = moduleName.substring(potentialTarget.length - 1);
      return loadModuleFromTargetImportOrExport(
        target,
        subpath,
        /*pattern*/
        true,
        potentialTarget
      );
    } else if (startsWith(moduleName, potentialTarget)) {
      const target = lookupTable[potentialTarget];
      const subpath = moduleName.substring(potentialTarget.length);
      return loadModuleFromTargetImportOrExport(
        target,
        subpath,
        /*pattern*/
        false,
        potentialTarget
      );
    }
  }
  function matchesPatternWithTrailer(target, name) {
    if (endsWith(target, "*"))
      return false;
    const starPos = target.indexOf("*");
    if (starPos === -1)
      return false;
    return startsWith(name, target.substring(0, starPos)) && endsWith(name, target.substring(starPos + 1));
  }
}
function getLoadModuleFromTargetImportOrExport(extensions, state, cache, redirectedReference, moduleName, scope, isImports) {
  return loadModuleFromTargetImportOrExport;
  function loadModuleFromTargetImportOrExport(target, subpath, pattern, key) {
    if (typeof target === "string") {
      if (!pattern && subpath.length > 0 && !endsWith(target, "/")) {
        if (state.traceEnabled) {
          trace(state.host, Diagnostics.package_json_scope_0_has_invalid_type_for_target_of_specifier_1, scope.packageDirectory, moduleName);
        }
        return toSearchResult(
          /*value*/
          void 0
        );
      }
      if (!startsWith(target, "./")) {
        if (isImports && !startsWith(target, "../") && !startsWith(target, "/") && !isRootedDiskPath(target)) {
          const combinedLookup = pattern ? target.replace(/\*/g, subpath) : target + subpath;
          traceIfEnabled(state, Diagnostics.Using_0_subpath_1_with_target_2, "imports", key, combinedLookup);
          traceIfEnabled(state, Diagnostics.Resolving_module_0_from_1, combinedLookup, scope.packageDirectory + "/");
          const result = nodeModuleNameResolverWorker(
            state.features,
            combinedLookup,
            scope.packageDirectory + "/",
            state.compilerOptions,
            state.host,
            cache,
            extensions,
            /*isConfigLookup*/
            false,
            redirectedReference,
            state.conditions
          );
          return toSearchResult(
            result.resolvedModule ? {
              path: result.resolvedModule.resolvedFileName,
              extension: result.resolvedModule.extension,
              packageId: result.resolvedModule.packageId,
              originalPath: result.resolvedModule.originalPath,
              resolvedUsingTsExtension: result.resolvedModule.resolvedUsingTsExtension
            } : void 0
          );
        }
        if (state.traceEnabled) {
          trace(state.host, Diagnostics.package_json_scope_0_has_invalid_type_for_target_of_specifier_1, scope.packageDirectory, moduleName);
        }
        return toSearchResult(
          /*value*/
          void 0
        );
      }
      const parts = pathIsRelative(target) ? getPathComponents(target).slice(1) : getPathComponents(target);
      const partsAfterFirst = parts.slice(1);
      if (partsAfterFirst.includes("..") || partsAfterFirst.includes(".") || partsAfterFirst.includes("node_modules")) {
        if (state.traceEnabled) {
          trace(state.host, Diagnostics.package_json_scope_0_has_invalid_type_for_target_of_specifier_1, scope.packageDirectory, moduleName);
        }
        return toSearchResult(
          /*value*/
          void 0
        );
      }
      const resolvedTarget = combinePaths(scope.packageDirectory, target);
      const subpathParts = getPathComponents(subpath);
      if (subpathParts.includes("..") || subpathParts.includes(".") || subpathParts.includes("node_modules")) {
        if (state.traceEnabled) {
          trace(state.host, Diagnostics.package_json_scope_0_has_invalid_type_for_target_of_specifier_1, scope.packageDirectory, moduleName);
        }
        return toSearchResult(
          /*value*/
          void 0
        );
      }
      if (state.traceEnabled) {
        trace(state.host, Diagnostics.Using_0_subpath_1_with_target_2, isImports ? "imports" : "exports", key, pattern ? target.replace(/\*/g, subpath) : target + subpath);
      }
      const finalPath = toAbsolutePath(pattern ? resolvedTarget.replace(/\*/g, subpath) : resolvedTarget + subpath);
      const inputLink = tryLoadInputFileForPath(finalPath, subpath, combinePaths(scope.packageDirectory, "package.json"), isImports);
      if (inputLink)
        return inputLink;
      return toSearchResult(withPackageId(scope, loadFileNameFromPackageJsonField(
        extensions,
        finalPath,
        /*onlyRecordFailures*/
        false,
        state
      )));
    } else if (typeof target === "object" && target !== null) {
      if (!Array.isArray(target)) {
        traceIfEnabled(state, Diagnostics.Entering_conditional_exports);
        for (const condition of getOwnKeys(target)) {
          if (condition === "default" || state.conditions.includes(condition) || isApplicableVersionedTypesKey(state.conditions, condition)) {
            traceIfEnabled(state, Diagnostics.Matched_0_condition_1, isImports ? "imports" : "exports", condition);
            const subTarget = target[condition];
            const result = loadModuleFromTargetImportOrExport(subTarget, subpath, pattern, key);
            if (result) {
              traceIfEnabled(state, Diagnostics.Resolved_under_condition_0, condition);
              traceIfEnabled(state, Diagnostics.Exiting_conditional_exports);
              return result;
            } else {
              traceIfEnabled(state, Diagnostics.Failed_to_resolve_under_condition_0, condition);
            }
          } else {
            traceIfEnabled(state, Diagnostics.Saw_non_matching_condition_0, condition);
          }
        }
        traceIfEnabled(state, Diagnostics.Exiting_conditional_exports);
        return void 0;
      } else {
        if (!length(target)) {
          if (state.traceEnabled) {
            trace(state.host, Diagnostics.package_json_scope_0_has_invalid_type_for_target_of_specifier_1, scope.packageDirectory, moduleName);
          }
          return toSearchResult(
            /*value*/
            void 0
          );
        }
        for (const elem of target) {
          const result = loadModuleFromTargetImportOrExport(elem, subpath, pattern, key);
          if (result) {
            return result;
          }
        }
      }
    } else if (target === null) {
      if (state.traceEnabled) {
        trace(state.host, Diagnostics.package_json_scope_0_explicitly_maps_specifier_1_to_null, scope.packageDirectory, moduleName);
      }
      return toSearchResult(
        /*value*/
        void 0
      );
    }
    if (state.traceEnabled) {
      trace(state.host, Diagnostics.package_json_scope_0_has_invalid_type_for_target_of_specifier_1, scope.packageDirectory, moduleName);
    }
    return toSearchResult(
      /*value*/
      void 0
    );
    function toAbsolutePath(path) {
      var _a, _b;
      if (path === void 0)
        return path;
      return getNormalizedAbsolutePath(path, (_b = (_a = state.host).getCurrentDirectory) == null ? void 0 : _b.call(_a));
    }
    function combineDirectoryPath(root, dir) {
      return ensureTrailingDirectorySeparator(combinePaths(root, dir));
    }
    function tryLoadInputFileForPath(finalPath, entry, packagePath, isImports2) {
      var _a, _b, _c, _d;
      if (!state.isConfigLookup && (state.compilerOptions.declarationDir || state.compilerOptions.outDir) && !finalPath.includes("/node_modules/") && (state.compilerOptions.configFile ? containsPath(scope.packageDirectory, toAbsolutePath(state.compilerOptions.configFile.fileName), !useCaseSensitiveFileNames(state)) : true)) {
        const getCanonicalFileName = hostGetCanonicalFileName({ useCaseSensitiveFileNames: () => useCaseSensitiveFileNames(state) });
        const commonSourceDirGuesses = [];
        if (state.compilerOptions.rootDir || state.compilerOptions.composite && state.compilerOptions.configFilePath) {
          const commonDir = toAbsolutePath(getCommonSourceDirectory(state.compilerOptions, () => [], ((_b = (_a = state.host).getCurrentDirectory) == null ? void 0 : _b.call(_a)) || "", getCanonicalFileName));
          commonSourceDirGuesses.push(commonDir);
        } else if (state.requestContainingDirectory) {
          const requestingFile = toAbsolutePath(combinePaths(state.requestContainingDirectory, "index.ts"));
          const commonDir = toAbsolutePath(getCommonSourceDirectory(state.compilerOptions, () => [requestingFile, toAbsolutePath(packagePath)], ((_d = (_c = state.host).getCurrentDirectory) == null ? void 0 : _d.call(_c)) || "", getCanonicalFileName));
          commonSourceDirGuesses.push(commonDir);
          let fragment = ensureTrailingDirectorySeparator(commonDir);
          while (fragment && fragment.length > 1) {
            const parts = getPathComponents(fragment);
            parts.pop();
            const commonDir2 = getPathFromPathComponents(parts);
            commonSourceDirGuesses.unshift(commonDir2);
            fragment = ensureTrailingDirectorySeparator(commonDir2);
          }
        }
        if (commonSourceDirGuesses.length > 1) {
          state.reportDiagnostic(createCompilerDiagnostic(
            isImports2 ? Diagnostics.The_project_root_is_ambiguous_but_is_required_to_resolve_import_map_entry_0_in_file_1_Supply_the_rootDir_compiler_option_to_disambiguate : Diagnostics.The_project_root_is_ambiguous_but_is_required_to_resolve_export_map_entry_0_in_file_1_Supply_the_rootDir_compiler_option_to_disambiguate,
            entry === "" ? "." : entry,
            // replace empty string with `.` - the reverse of the operation done when entries are built - so main entrypoint errors don't look weird
            packagePath
          ));
        }
        for (const commonSourceDirGuess of commonSourceDirGuesses) {
          const candidateDirectories = getOutputDirectoriesForBaseDirectory(commonSourceDirGuess);
          for (const candidateDir of candidateDirectories) {
            if (containsPath(candidateDir, finalPath, !useCaseSensitiveFileNames(state))) {
              const pathFragment = finalPath.slice(candidateDir.length + 1);
              const possibleInputBase = combinePaths(commonSourceDirGuess, pathFragment);
              const jsAndDtsExtensions = [".mjs" /* Mjs */, ".cjs" /* Cjs */, ".js" /* Js */, ".json" /* Json */, ".d.mts" /* Dmts */, ".d.cts" /* Dcts */, ".d.ts" /* Dts */];
              for (const ext of jsAndDtsExtensions) {
                if (fileExtensionIs(possibleInputBase, ext)) {
                  const inputExts = getPossibleOriginalInputExtensionForExtension(possibleInputBase);
                  for (const possibleExt of inputExts) {
                    if (!extensionIsOk(extensions, possibleExt))
                      continue;
                    const possibleInputWithInputExtension = changeAnyExtension(possibleInputBase, possibleExt, ext, !useCaseSensitiveFileNames(state));
                    if (state.host.fileExists(possibleInputWithInputExtension)) {
                      return toSearchResult(withPackageId(scope, loadFileNameFromPackageJsonField(
                        extensions,
                        possibleInputWithInputExtension,
                        /*onlyRecordFailures*/
                        false,
                        state
                      )));
                    }
                  }
                }
              }
            }
          }
        }
      }
      return void 0;
      function getOutputDirectoriesForBaseDirectory(commonSourceDirGuess) {
        var _a2, _b2;
        const currentDir = state.compilerOptions.configFile ? ((_b2 = (_a2 = state.host).getCurrentDirectory) == null ? void 0 : _b2.call(_a2)) || "" : commonSourceDirGuess;
        const candidateDirectories = [];
        if (state.compilerOptions.declarationDir) {
          candidateDirectories.push(toAbsolutePath(combineDirectoryPath(currentDir, state.compilerOptions.declarationDir)));
        }
        if (state.compilerOptions.outDir && state.compilerOptions.outDir !== state.compilerOptions.declarationDir) {
          candidateDirectories.push(toAbsolutePath(combineDirectoryPath(currentDir, state.compilerOptions.outDir)));
        }
        return candidateDirectories;
      }
    }
  }
}
function isApplicableVersionedTypesKey(conditions, key) {
  if (!conditions.includes("types"))
    return false;
  if (!startsWith(key, "types@"))
    return false;
  const range = VersionRange.tryParse(key.substring("types@".length));
  if (!rang