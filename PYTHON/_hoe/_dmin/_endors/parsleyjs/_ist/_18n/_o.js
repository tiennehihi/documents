: void 0, value: relativeToBaseUrl });
      }
      if (indexOfStar !== -1) {
        const prefix = pattern.substring(0, indexOfStar);
        const suffix = pattern.substring(indexOfStar + 1);
        for (const { ending, value } of candidates) {
          if (value.length >= prefix.length + suffix.length && startsWith(value, prefix) && endsWith(value, suffix) && validateEnding({ ending, value })) {
            const matchedStar = value.substring(prefix.length, value.length - suffix.length);
            if (!pathIsRelative(matchedStar)) {
              return replaceFirstStar(key, matchedStar);
            }
          }
        }
      } else if (some(candidates, (c) => c.ending !== 0 /* Minimal */ && pattern === c.value) || some(candidates, (c) => c.ending === 0 /* Minimal */ && pattern === c.value && validateEnding(c))) {
        return key;
      }
    }
  }
  function validateEnding({ ending, value }) {
    return ending !== 0 /* Minimal */ || value === processEnding(relativeToBaseUrl, [ending], compilerOptions, host);
  }
}
function tryGetModuleNameFromExportsOrImports(options, host, targetFilePath, packageDirectory, packageName, exports2, conditions, mode, isImports) {
  if (typeof exports2 === "string") {
    const ignoreCase = !hostUsesCaseSensitiveFileNames(host);
    const getCommonSourceDirectory2 = () => host.getCommonSourceDirectory();
    const outputFile = isImports && getOutputJSFileNameWorker(targetFilePath, options, ignoreCase, getCommonSourceDirectory2);
    const declarationFile = isImports && getOutputDeclarationFileNameWorker(targetFilePath, options, ignoreCase, getCommonSourceDirectory