{"version":3,"names":["_debug","data","require","_path","_async","_moduleTypes","_url","_importMetaResolve","_fs","debug","buildDebug","EXACT_RE","BABEL_PLUGIN_PREFIX_RE","BABEL_PRESET_PREFIX_RE","BABEL_PLUGIN_ORG_RE","BABEL_PRESET_ORG_RE","OTHER_PLUGIN_ORG_RE","OTHER_PRESET_ORG_RE","OTHER_ORG_DEFAULT_RE","resolvePlugin","exports","resolveStandardizedName","bind","resolvePreset","loadPlugin","name","dirname","filepath","isAsync","value","requireModule","loadPreset","standardizeName","type","path","isAbsolute","isPreset","replace","resolveAlternativesHelper","standardizedName","error","code","message","oppositeType","transformName","tryRequireResolve","id","v","w","split","process","versions","node","resolve","r","paths","b","M","f","_findPath","_nodeModulePaths","concat","Error","tryImportMetaResolve","options","importMetaResolve","resolveStandardizedNameForRequire","it","res","next","done","resolveStandardizedNameForImport","parentUrl","pathToFileURL","join","href","fileURLToPath","resolveESM","supportsESM","resolved","existsSync","Object","assign","e","e2","LOADING_MODULES","Set","has","add","loadCodeDefault","err","delete"],"sources":["../../../src/config/files/plugins.ts"],"sourcesContent":["/**\n * This file handles all logic for converting string-based configuration references into loaded objects.\n */\n\nimport buildDebug from \"debug\";\nimport path from \"path\";\nimport type { Handler } from \"gensync\";\nimport { isAsync } from \"../../gensync-utils/async.ts\";\nimport loadCodeDefault, { supportsESM } from \"./module-types.ts\";\nimport { fileURLToPath, pathToFileURL } from \"url\";\n\nimport { resolve as importMetaResolve } from \"../../vendor/import-meta-resolve.js\";\n\nimport { createRequire } from \"module\";\nimport { existsSync } from \"fs\";\nconst require = createRequire(import.meta.url);\n\nconst debug = buildDebug(\"babel:config:loading:files:plugins\");\n\nconst EXACT_RE = /^module:/;\nconst BABEL_PLUGIN_PREFIX_RE = /^(?!@|module:|[^/]+\\/|babel-plugin-)/;\nconst BABEL_PRESET_PREFIX_RE = /^(?!@|module:|[^/]+\\/|babel-preset-)/;\nconst BABEL_PLUGIN_ORG_RE = /^(@babel\\/)(?!plugin-|[^/]+\\/)/;\nconst BABEL_PRESET_ORG_RE = /^(@babel\\/)(?!preset-|[^/]+\\/)/;\nconst OTHER_PLUGIN_ORG_RE =\n  /^(@(?!babel\\/)[^/]+\\/)(?![^/]*babel-plugin(?:-|\\/|$)|[^/]+\\/)/;\nconst OTHER_PRESET_ORG_RE =\n  /^(@(?!babel\\/)[^/]+\\/)(?![^/]*babel-preset(?:-|\\/|$)|[^/]+\\/)/;\nconst OTHER_ORG_DEFAULT_RE = /^(@(?!babel$)[^/]+)$/;\n\nexport const resolvePlugin = resolveStandardizedName.bind(null, \"plugin\");\nexport const resolvePreset = resolveStandardizedName.bind(null, \"preset\");\n\nexport function* loadPlugin(\n  name: string,\n  dirname: string,\n): Handler<{ filepath: string; value: unknown }> {\n  const filepath = resolvePlugin(name, dirname, yield* isAsync());\n\n  const value = yield* requireModule(\"plugin\", filepath);\n  debug(\"Loaded plugin %o from %o.\", name, dirname);\n\n  return { filepath, value };\n}\n\nexport function* loadPreset(\n  name: string,\n  dirname: string,\n): Handler<{ filepath: string; value: unknown }> {\n  const filepath = resolvePreset(name, dirname, yield* isAsync());\n\n  const value = yield* requireModule(\"preset\", filepath);\n\n  debug(\"Loaded preset %o from %o.\", name, dirname);\n\n  return { filepath, value };\n}\n\nfunction standardizeName(type: \"plugin\" | \"preset\", name: string) {\n  // Let absolute and relative paths through.\n  if (path.isAbsolute(name)) return name;\n\n  const isPreset = type === \"preset\";\n\n  return (\n    name\n      // foo -> babel-preset-foo\n      .replace(\n        isPreset ? BABEL_PRESET_PREFIX_RE : BABEL_PLUGIN_PREFIX_RE,\n        `babel-${type}-`,\n      )\n      // @babel/es2015 -> @babel/preset-es2015\n      .replace(\n        isPreset ? BABEL_PRESET_ORG_RE : BABEL_PLUGIN_ORG_RE,\n        `$1${type}-`,\n      )\n      // @foo/mypreset -> @foo/babel-preset-mypreset\n      .replace(\n        isPreset ? OTHER_PRESET_ORG_RE : OTHER_PLUGIN_ORG_RE,\n        `$1babel-${type}-`,\n      )\n      // @foo -> @foo/babel-preset\n      .replace(OTHER_ORG_DEFAULT_RE, `$1/babel-${type}`)\n      // module:mypreset -> mypreset\n      .replace(EXACT_RE, \"\")\n  );\n}\n\ntype Result<T> = { error: Error; value: null } | { error: null; value: T };\n\nfunction* resolveAlternativesHelper(\n  type: \"plugin\" | \"preset\",\n  name: string,\n): Iterator<string, string, Result<string>> {\n  const standardizedName = standardizeName(type, name);\n  const { error, value } = yield standardizedName;\n  if (!error) return value;\n\n  // @ts-expect-error code may not index error\n  if (error.code !== \"MODULE_NOT_FOUND\") throw error;\n\n  if (standardizedName !== name && !(yield name).error) {\n    error.message += `\\n- If you want to resolve \"${name}\", use \"module:${name}\"`;\n  }\n\n  if (!(yield standardizeName(type, \"@babel/\" + name)).error) {\n    error.message += `\\n- Did you mean \"@babel/${name}\"?`;\n  }\n\n  const oppositeType = type === \"preset\" ? \"plugin\" : \"preset\";\n  if (!(yield standardizeName(oppositeType, name)).error) {\n    error.message += `\\n- Did you accidentally pass a ${oppositeType} as a ${type}?`;\n  }\n\n  if (type === \"plugin\") {\n    const transformName = standardizedName.replace(\"-proposal-\", \"-transform-\");\n    if (transformName !== standardizedName && !(yield transformName).error) {\n      error.message += `\\n- Did you mean \"${transformName}\"?`;\n    }\n  }\n\n  error.message += `\\n\nMake sure that all the Babel plugins and presets you are using\nare defined as dependencies or devDependencies in your package.json\nfile. It's possible that the missing plugin is loaded by a preset\nyou are using that forgot to add the plugin to its dependencies: you\ncan workaround this problem by explicitly adding the missing package\nto your top-level package.json.\n`;\n\n  throw error;\n}\n\nfunction tryRequireResolve(\n  id: string,\n  dirname: string | undefined,\n): Result<string> {\n  try {\n    if (dirname) {\n      return { error: null, value: require.resolve(id, { paths: [dirname] }) };\n    } else {\n      return { error: null, value: require.resolve(id) };\n    }\n  } catch (error) {\n    return { error, value: null };\n  }\n}\n\nfunction tryImportMetaResolve(\n  id: Parameters<typeof importMetaResolve>[0],\n  options: Parameters<typeof importMetaResolve>[1],\n): Result<string> {\n  try {\n    return { error: null, value: importMetaResolve(id, options) };\n  } catch (error) {\n    return { error, value: null };\n  }\n}\n\nfunction resolveStandardizedNameForRequire(\n  type: \"plugin\" | \"preset\",\n  name: string,\n  dirname: string,\n) {\n  const it = resolveAlternativesHelper(type, name);\n  let res = it.next();\n  while (!res.done) {\n    res = it.next(tryRequireResolve(res.value, dirname));\n  }\n  return res.value;\n}\nfunction resolveStandardizedNameForImport(\n  type: \"plugin\" | \"pre