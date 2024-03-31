rPreferences, options = {}) {
  return getModuleSpecifiersWithCacheInfo(
    moduleSymbol,
    checker,
    compilerOptions,
    importingSourceFile,
    host,
    userPreferences,
    options,
    /*forAutoImport*/
    false
  ).moduleSpecifiers;
}
function getModuleSpecifiersWithCacheInfo(moduleSymbol, checker, compilerOptions, importingSourceFile, host, userPreferences, options = {}, forAutoImport) {
  let computedWithoutCache = false;
  const ambient = tryGetModuleNameFromAmbientModule(moduleSymbol, checker);
  if (ambient)
    return { moduleSpecifiers: [ambient], computedWithoutCache };
  let [specifiers, moduleSourceFile, modulePaths, cache] = tryGetModuleSpecifiersFromCacheWorker(
    moduleSymbol,
    importingSourceFile,
    host,
    userPreferences,
    options
  );
  if (specifiers)
    return { moduleSpecifiers: specifiers, computedWithoutCache };
  if (!moduleSourceFile)
    return { moduleSpecifiers: emptyArray, computedWithoutCache };
  computedWithoutCache = true;
  modulePaths || (modulePaths = getAllModulePathsWorker(getInfo(importingSourceFile.fileName, host), moduleSourceFile.originalFileName, host));
  const result = computeModuleSpecifiers(
    modulePaths,
    compilerOptions,
    importingSourceFile,
    host,
    userPreferences,
    options,
    forAutoImport
  );
  cache == null ? void 0 : cache.set(importingSourceFile.path, moduleSou