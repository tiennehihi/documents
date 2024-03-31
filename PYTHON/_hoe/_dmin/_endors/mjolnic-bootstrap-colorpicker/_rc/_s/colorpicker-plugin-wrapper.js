wnConfig.extendedConfigPath)) {
      applyExtendedConfig(result, ownConfig.extendedConfigPath);
    } else {
      ownConfig.extendedConfigPath.forEach((extendedConfigPath) => applyExtendedConfig(result, extendedConfigPath));
    }
    if (!ownConfig.raw.include && result.include)
      ownConfig.raw.include = result.include;
    if (!ownConfig.raw.exclude && result.exclude)
      ownConfig.raw.exclude = result.exclude;
    if (!ownConfig.raw.files && result.files)
      ownConfig.raw.files = result.files;
    if (ownConfig.raw.compileOnSave === void 0 && result.compileOnSave)
      ownConfig.raw.compileOnSave = result.compileOnSave;
    if (sourceFile 