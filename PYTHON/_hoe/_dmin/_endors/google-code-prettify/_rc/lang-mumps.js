r) {
    return isRelative(source)
        ? importer
            ? resolve(importer, '..', source)
            : resolve(source)
        : source;
}
function addChunkNamesToModule(module, { fileName, name }, isUserDefined, priority) {
    var _a;
    if (fileName !== null) {
        module.chunkFileNames.add(fileName);
    }
    else if (name !== null) {
        // Always keep chunkNames sorted by priority
        let namePosition = 0;
        while (((_a = module.chunkNames[namePosition]) === null || _a === void 0 ? void 0 : _a.priority) < priority)
            namePosition++;
        module.chunkNames.splice(namePosition, 0, { isUserDefined, name, priority });
    }
}
function isNotAbsoluteExternal(id, source, makeAbsoluteExternalsRelative) {
    return (makeAbsoluteExternalsRelative === true ||
        (makeAbsoluteExternalsRelative === 'ifRelativeSource' && isRelative(source)) ||
        !isAbsolute(id));
}
async function waitForDependencyResolution(loadPromise) {
    const [resolveStaticDependencyPromises, resolveDynamicImportPromises] = await loadPromise;
    return Promise.all([...resolveStaticDependencyPromises, ...resolveDynamicImportPromises]);
}

class GlobalScope extends Scope$1 {
    constructor() {
        super();
        this.parent = null;
        this.variables.set('undefined', new UndefinedVariable());
    }
    findVariable(name) {
        let variable = this.variables.get(name);
        if (!variable) {
            variable = new GlobalVariable(name);
            this.variables.set(name, variable);
        }
        return variable;
    }
}

function generateAssetFileName(name, source, outputOptions, bundle) {
    const emittedName = outputOptions.sanitizeFileName(name || 'asset');
    return makeUnique(renderNamePattern(typeof outputOptions.assetFileNames === 'function'
        ? outputOptions.assetFileNames({ name, source, type: 'asset' })
        : outputOptions.assetFileNames, 'output.assetFileNames', {
        ext: () => extname(emittedName).substring(1),
        extname: () => extname(emittedName),
        hash() {
            return createHash()
                .update(emittedName)
                .update(':')
                .update(source)
                .digest('hex')
                .substring(0, 8);
        },
        name: () => emittedName.substring(0, emittedName.length - extname(emittedName).length)
    }), bundle);
}
function reserveFileNameInBundle(fileName, bundle, warn) {
    const lowercaseFileName = fileName.toLowerCase();
    if (bundle[lowercaseBundleKeys].has(lowercaseFileName)) {
        warn(errFileNameConflict(fileName));
    }
    else {
        bundle[fileName] = FILE_PLACEHOLDER;
    }
}
function hasValidType(emittedFile) {
    return Boolean(emittedFile &&
        (emittedFile.type === 'asset' ||
            emittedFile.type === 'chunk'));
}
function hasValidName(emittedFile) {
    const validatedName = emittedFile.fileName || emittedFile.name;
    return !validatedName || (typeof validatedName === 'string' && !isPathFragment(validatedName));
}
function getValidSource(source, emittedFile, fileReferenceId) {
    if (!(typeof source === 'string' || source instanceof Uint8Array)) {
        const assetName = emittedFile.fileName || emittedFile.name || fileReferenceId;
        return error(errFailedValidation(`Could not set source for ${typeof assetName === 'string' ? `asset "${assetName}"` : 'unnamed asset'}, asset source needs to be a string, Uint8Array or Buffer.`));
    }
    return source;
}
function getAssetFileName(file, referenceId) {
    if (typeof file.fileName !== 'string') {
        return error(errAssetNotFinalisedForFileName(file.name || referenceId));
    }
    return file.fileName;
}
function getChunkFileName(file, facadeChunkByModule) {
    var _a;
    const fileName = file.fileName || (file.module && ((_a = facadeChunkByModule === null || facadeChunkByModule === void 0 ? void 0 : facadeChunkByModule.get(file.module)) === null || _a === void 0 ? void 0 : _a.id));
    if (!fileName)
        return error(errChunkNotGeneratedForFileName(file.fileName || file.name));
    return fileName;
}
class FileEmitter {
    constructor(graph, options, baseFileEmitter) {
        this.graph = graph;
        this.options = options;
        this.bundle = null;
        this.facadeChunkByModule = null;
        this.outputOptions = null;
        this.assertAssetsFinalized = () => {
            for (const [referenceId, emittedFile] of this.filesByReferenceId) {
                if (emittedFile.type === 'asset' && typeof emittedFile.fileName !== 'string')
                    return error(errNoAssetSourceSet(emittedFile.name || referenceId));
            }
        };
        this.emitFile = (emittedFile) => {
            if (!hasValidType(emittedFile)) {
                return error(errFailedValidation(`Emitted files must be of type "asset" or "chunk", received "${emittedFile && emittedFile.type}".`));
            }
            if (!hasValidName(emittedFile)) {
                return error(errFailedValidation(`The "fileName" or "name" properties of emitted files must be strings that are neither absolute nor relative paths, received "${emittedFile.fileName || emittedFile.name}".`));
            }
            if (emittedFile.type === 'chunk') {
                return this.emitChu