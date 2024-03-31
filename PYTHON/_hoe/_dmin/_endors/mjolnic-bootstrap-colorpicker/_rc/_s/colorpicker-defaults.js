[name];
      const optionDefinition = optionsNameMap.get(name.toLowerCase());
      if (optionDefinition) {
        Debug.assert(optionDefinition.type !== "listOrElement");
        const customTypeMap = getCustomTypeMapOfCommandLineOption(optionDefinition);
        if (!customTypeMap) {
          if (pathOptions && optionDefinition.isFilePath) {
            result.set(name, getRelativePathFromFile(pathOptions.configFilePath, getNormalizedAbsolutePath(value, getDirectoryPath(pathOptions.configFilePath)), getCanonicalFileName));
          } else {
            result.set(name, value);
          }
        } else {
          if (optionDefinition.type === "list") {
            result.set(name, value.map((element) => getNameOfCompilerOptionValue(element, customTypeMap)));
          } else {
            result.set(name, getNameOfCompilerOptionValue(value, customTypeMap));
          }
        }
      }
    }
  }
  return result;
}
function getCompilerOptionsDiffValue(options, newLine) {
  const compilerOptionsMap = getSerializedCompilerOption(options);
  return getOverwrittenDefaultOptions();
  function makePadding(paddingLength) {
    return Array(paddingLength + 1).join(" ");
  }
  function getOverwrittenDefaultOptions() {
    const result = [];
    const tab = makePadding(2);
    commandOptionsWithoutBuild.forEach((cmd) => {
      if (!compilerOptionsMap.has(cmd.name)) {
        return;
      }
      const newValue = compilerOptionsMap.get(cmd.name);
      const defaultValue = getDefaultValueForOp