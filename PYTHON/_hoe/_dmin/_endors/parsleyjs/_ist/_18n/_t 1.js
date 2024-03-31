ue }, [{ extension: "node", isMixedContent: false }, { extension: "json", isMixedContent: false, scriptKind: 6 /* JSON */ }]));
  for (const e of extensions) {
    const fullPath = path + e;
    if (host.fileExists(fullPath)) {
      return fullPath;
    }
  }
}
function getPathsRelativeToRootDirs(path, rootDirs, getCanonicalFileName) {
  return mapDefined(rootDirs, (rootDir) => {
    const relativePath = getRelativePathIfInSameVolume(path, rootDir, getCanonicalFileName);
    return relativePath !== void 0 && isPathRelativeToParent(relativePath) ? void 0 : relativePath;
  });
}
function processEnding(fileName, allowedEndings, options, host) {
  if (fileExtensionIsOneOf(fileName, [".json" /* Json */, ".mjs" /* Mjs */, ".cjs" /* Cjs */])) {
    return fileName;
  }
  const noExtension = removeFileExtension(fileName);
  if (fileName === noExtension) {
    return fileName;
  }
  const jsPriority = allowedEndings.indexOf(2 /* JsExtension */);
  const tsPriority = allowedEndings.indexOf(3 /* TsExtension */);
  if (fileExtensionIsOneOf(fileName, [".mts" /* Mts */, ".cts" /* Cts */]) && tsPriority !== -1 && tsPriority < jsPriority) {
    return fileName;
  } else if (fileExtensionIsOneOf(fileName, [".d.mts" /* Dmts */, ".mts" /* Mts */, ".d.cts" /* Dcts */, ".cts" /* Cts */])) {
    return noExtension + getJSExtensionForFile(fileName, options);
  } else if (!fileExtensionIsOneOf(fileName, [".d.ts" /* Dts */]) && fileExtensionIsOneOf(f