= brokenFlow;
        }
        else if (this.includedLabelsAfterBlock) {
            for (const label of this.includedLabelsAfterBlock) {
                context.includedLabels.add(label);
            }
        }
        if (this.handler !== null) {
            this.handler.include(context, includeChildrenRecursively);
            context.brokenFlow = brokenFlow;
        }
        (_b = this.finalizer) === null || _b === void 0 ? void 0 : _b.include(context, includeChildrenRecursively);
    }
}

const unaryOperators = {
    '!': value => !value,
    '+': value => +value,
    '-': value => -value,
    delete: () => UnknownValue,
    typeof: value => typeof value,
    void: () => undefined,
    '~': value => ~value
};
class UnaryExpression extends NodeBase {
    getLiteralValueAtPath(path, recursionTracker, origin) {
        if (path.length > 0)
            return UnknownValue;
        const argumentValue = this.argument.getLiteralValueAtPath(EMPTY_PATH, recursionTracker, origin);
        if (typeof argumentValue === 'symbol')
            return UnknownValue;
        return unaryOperators[this.operator](argumentValue);
    }
    hasEffects(context) {
        if (!this.deoptimized)
            this.applyDeoptimizations();
        if (this.operator === 'typeof' && this.argument instanceof Identifier)
            return false;
        return (this.argument.hasEffects(context) ||
            (this.operator === 'delete' &&
                this.argument.hasEffectsOnInteractionAtPath(EMPTY_PATH, NODE_INTERACTION_UNKNOWN_ASSIGNMENT, context)));
    }
    hasEffectsOnInteractionAtPath(path, { type }) {
        return type !== INTERACTION_ACCESSED || path.length > (this.operator === 'void' ? 0 : 1);
    }
    applyDeoptimizations() {
        this.deoptimized = true;
        if (this.operator === 'delete') {
            this.argument.deoptimizePath(EMPTY_PATH);
            this.context.requestTreeshakingPass();
        }
    }
}

class UnknownNode extends NodeBase {
    hasEffects() {
        return true;
    }
    include(context) {
        super.include(context, true);
    }
}

class UpdateExpression extends NodeBase {
    hasEffects(context) {
        if (!this.deoptimized)
            this.applyDeoptimizations();
        return this.argument.hasEffectsAsAssignmentTarget(context, true);
    }
    hasEffectsOnInteractionAtPath(path, { type }) {
        return path.length > 1 || type !== INTERACTION_ACCESSED;
    }
    include(context, includeChildrenRecursively) {
        if (!this.deoptimized)
            this.applyDeoptimizations();
        this.included = true;
        this.argument.includeAsAssignmentTarget(context, includeChildrenRecursively, true);
    }
    initialise() {
        this.argument.setAssignedValue(UNKNOWN_EXPRESSION);
    }
    render(code, options) {
        const { exportNamesByVariable, format, snippets: { _ } } = options;
        this.argument.render(code, options);
        if (format === 'system') {
            const variable = this.argument.variable;
            const exportNames = exportNamesByVariable.get(variable);
            if (exportNames) {
                if (this.prefix) {
                    if (exportNames.length === 1) {
                        renderSystemExportExpression(variable, this.start, this.end, code, options);
                    }
                    else {
                        renderSystemExportSequenceAfterExpression(variable, this.start, this.end, this.parent.type !== ExpressionStatement$1, code, options);
                    }
                }
                else {
                    const operator = this.operator[0];
                    renderSystemExportSequenceBeforeExpression(variable, this.start, this.end, this.parent.type !== ExpressionStatement$1, code, options, `${_}${operator}${_}1`);
                }
            }
        }
    }
    applyDeoptimizations() {
        this.deoptimized = true;
        this.argument.deoptimizePath(EMPTY_PATH);
        if (this.argument instanceof Identifier) {
            const variable = this.scope.findVariable(this.argument.name);
            variable.isReassigned = true;
        }
        this.context.requestTreeshakingPass();
    }
}

function isReassignedExportsMember(variable, exportNamesByVariable) {
    return (variable.renderBaseName !== null && exportNamesByVariable.has(variable) && variable.isReassigned);
}

function areAllDeclarationsIncludedAndNotExported(declarations, exportNamesByVariable) {
    for (const declarator of declarations) {
        if (!declarator.id.included)
            return false;
        if (declarator.id.type === Identifier$1) {
            if (exportNamesByVariable.has(declarator.id.variable))
                return false;
        }
        else {
            const exportedVariables = [];
            declarator.id.addExportedVariables(exportedVariables, exportNamesByVariable);
            if (exportedVariables.length > 0)
                return false;
        }
    }
    return true;
}
class VariableDeclaration extends NodeBase {
    deoptimizePath() {
        for (const declarator of this.declarations) {
            declarator.deoptimizePath(EMPTY_PATH);
        }
    }
    hasEffectsOnInteractionAtPath() {
        return false;
    }
    include(context, includeChildrenRecursively, { asSingleStatement } = BLANK) {
        this.included = true;
        for (const declarator of this.declarations) {
            if (includeChildrenRecursively || declarator.shouldBeIncluded(context))
                declarator.include(context, includeChildrenRecursively);
            if (asSingleStatement) {
                declarator.id.include(context, includeChildrenRecursively);
            }
        }
    }
    initialise() {
        for (const declarator of this.declarations) {
            declarator.declareDeclarator(this.kind);
        }
    }
    render(code, options, nodeRenderOptions = BLANK) {
        if (areAllDeclarationsIncludedAndNotExported(this.declarations, options.exportNamesByVariable)) {
            for (const declarator of this.declarations) {
                declarator.render(code, options);
            }
            if (!nodeRenderOptions.isNoStatement &&
                code.original.charCodeAt(this.end - 1) !== 59 /*";"*/) {
                code.appendLeft(this.end, ';');
            }
        }
        else {
            this.renderReplacedDeclarations(code, options);
        }
    }
    applyDeoptimizations() { }
    renderDeclarationEnd(code, separatorString, lastSeparatorPos, actualContentEnd, renderedContentEnd, systemPatternExports, options) {
        if (code.original.charCodeAt(this.end - 1) === 59 /*";"*/) {
            code.remove(this.end - 1, this.end);
        }
        separatorString += ';';
        if (lastSeparatorPos !== null) {
            if (code.original.charCodeAt(actualContentEnd - 1) === 10 /*"\n"*/ &&
                (code.original.charCodeAt(this.end) === 10 /*"\n"*/ ||
                    code.original.charCodeAt(this.end) === 13) /*"\r"*/) {
                actualContentEnd--;
                if (code.original.charCodeAt(actualContentEnd) === 13 /*"\r"*/) {
                    actualContentEnd--;
                }
            }
            if (actualContentEnd === lastSeparatorPos + 1) {
                code.overwrite(lastSeparatorPos, renderedContentEnd, separatorString);
            }
            else {
                code.overwrite(lastSeparatorPos, lastSeparatorPos + 1, separatorString);
                code.remove(actualContentEnd, renderedContentEnd);
            }
        }
        else {
            code.appendLeft(renderedContentEnd, separatorString);
        }
        if (systemPatternExports.length > 0) {
            code.appendLeft(renderedContentEnd, ` ${getSystemExportStatement(systemPatternExports, options)};`);
        }
    }
    renderReplacedDeclarations(code, options) {
        const separatedNodes = getCommaSeparatedNodesWithBoundaries(this.declarations, code, this.start + this.kind.length, this.end - (code.original.charCodeAt(this.end - 1) === 59 /*";"*/ ? 1 : 0));
        let actualContentEnd, renderedContentEnd;
        renderedContentEnd = findNonWhiteSpace(code.original, this.start + this.kind.length);
        let lastSeparatorPos = renderedContentEnd - 1;
        code.remove(this.start, lastSeparatorPos);
        let isInDeclaration = false;
        let hasRenderedContent = false;
        let separatorString = '', leadingString, nextSeparatorString;
        const aggregatedSystemExports = [];
        const singleSystemExport = gatherSystemExportsAndGetSingleExport(separatedNodes, options, aggregatedSystemExports);
        for (const { node, start, separator, contentEnd, end } of separatedNodes) {
            if (!node.included) {
                code.remove(start, end);
                continue;
            }
            node.render(code, options);
            leadingString = '';
            nextSeparatorString = '';
            if (!node.id.included ||
                (node.id instanceof Identifier &&
                    isReassignedExportsMember(node.id.variable, options.exportNamesByVariable))) {
                if (hasRenderedContent) {
                    separatorString += ';';
                }
                isInDeclaration = false;
            }
            else {
                if (singleSystemExport && singleSystemExport === node.id.variable) {
                    const operatorPos = findFirstOccurrenceOutsideComment(code.original, '=', node.id.end);
                    renderSystemExportExpression(singleSystemExport, findNonWhiteSpace(code.original, operatorPos + 1), separator === null ? contentEnd : separator, code, options);
                }
                if (isInDeclaration) {
                    separatorString += ',';
                }
                else {
                    if (hasRenderedContent) {
                        separatorString += ';';
                    }
                    leadingString += `${this.kind} `;
                    isInDeclaration = true;
                }
            }
            if (renderedContentEnd === lastSeparatorPos + 1) {
                code.overwrite(lastSeparatorPos, renderedContentEnd, separatorString + leadingString);
            }
            else {
                code.overwrite(lastSeparatorPos, lastSeparatorPos + 1, separatorString);
                code.appendLeft(renderedContentEnd, leadingString);
            }
            actualContentEnd = contentEnd;
            renderedContentEnd = end;
            hasRenderedContent = true;
            lastSeparatorPos = separator;
            separatorString = nextSeparatorString;
        }
        this.renderDeclarationEnd(code, separatorString, lastSeparatorPos, actualContentEnd, renderedContentEnd, aggregatedSystemExports, options);
    }
}
function gatherSystemExportsAndGetSingleExport(separatedNodes, options, aggregatedSystemExports) {
    var _a;
    let singleSystemExport = null;
    if (options.format === 'system') {
        for (const { node } of separatedNodes) {
            if (node.id instanceof Identifier &&
                node.init &&
                aggregatedSystemExports.length === 0 &&
                ((_a = options.exportNamesByVariable.get(node.id.variable)) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                singleSystemExport = node.id.variable;
                aggregatedSystemExports.push(singleSystemExport);
            }
            else {
                node.id.addExportedVariables(aggregatedSystemExports, options.exportNamesByVariable);
            }
        }
        if (aggregatedSystemExports.length > 1) {
            singleSystemExport = null;
        }
        else if (singleSystemExport) {
            aggregatedSystemExports.length = 0;
        }
    }
    return singleSystemExport;
}

class VariableDeclarator extends NodeBase {
    declareDeclarator(kind) {
        this.id.declare(kind, this.init || UNDEFINED_EXPRESSION);
    }
    deoptimizePath(path) {
        this.id.deoptimizePath(path);
    }
    hasEffects(context) {
        var _a;
        const initEffect = (_a = this.init) === null || _a === void 0 ? void 0 : _a.hasEffects(context);
        this.id.markDeclarationReached();
        return initEffect || this.id.hasEffects(context);
    }
    include(context, includeChildrenRecursively) {
        var _a;
        this.included = true;
        (_a = this.init) === null || _a === void 0 ? void 0 : _a.include(context, includeChildrenRecursively);
        this.id.markDeclarationReached();
        if (includeChildrenRecursively || this.id.shouldBeIncluded(context)) {
            this.id.include(context, includeChildrenRecursively);
        }
    }
    render(code, options) {
        const { exportNamesByVariable, snippets: { _ } } = options;
        const renderId = this.id.included;
        if (renderId) {
            this.id.render(code, options);
        }
        else {
            const operatorPos = findFirstOccurrenceOutsideComment(code.original, '=', this.id.end);
            code.remove(this.start, findNonWhiteSpace(code.original, operatorPos + 1));
        }
        if (this.init) {
            this.init.render(code, options, renderId ? BLANK : { renderedSurroundingElement: ExpressionStatement$1 });
        }
        else if (this.id instanceof Identifier &&
            isReassignedExportsMember(this.id.variable, exportNamesByVariable)) {
            code.appendLeft(this.end, `${_}=${_}void 0`);
        }
    }
    applyDeoptimizations() { }
}

class WhileStatement extends NodeBase {
    hasEffects(context) {
        if (this.test.hasEffects(context))
            return true;
        const { brokenFlow, ignore: { breaks, continues } } = context;
        context.ignore.breaks = true;
        context.ignore.continues = true;
        if (this.body.hasEffects(context))
            return true;
        context.ignore.breaks = breaks;
        context.ignore.continues = continues;
        context.brokenFlow = brokenFlow;
        return false;
    }
    include(context, includeChildrenRecursively) {
        this.included = true;
        this.test.include(context, includeChildrenRecursively);
        const { brokenFlow } = context;
        this.body.include(context, includeChildrenRecursively, { asSingleStatement: true });
        context.brokenFlow = brokenFlow;
    }
}

class YieldExpression extends NodeBase {
    hasEffects(context) {
        var _a;
        if (!this.deoptimized)
            this.applyDeoptimizations();
        return !(context.ignore.returnYield && !((_a = this.argument) === null || _a === void 0 ? void 0 : _a.hasEffects(context)));
    }
    render(code, options) {
        if (this.argument) {
            this.argument.render(code, options, { preventASI: true });
            if (this.argument.start === this.start + 5 /* 'yield'.length */) {
                code.prependLeft(this.start + 5, ' ');
            }
        }
    }
}

const nodeConstructors = {
    ArrayExpression,
    ArrayPattern,
    ArrowFunctionExpression,
    AssignmentExpression,
    AssignmentPattern,
    AwaitExpression,
    BinaryExpression,
    BlockStatement,
    BreakStatement,
    CallExpression,
    CatchClause,
    ChainExpression,
    ClassBody,
    ClassDeclaration,
    ClassExpression,
    ConditionalExpression,
    ContinueStatement,
    DoWhileStatement,
    EmptyStatement,
    ExportAllDeclaration,
    ExportDefaultDeclaration,
    ExportNamedDeclaration,
    ExportSpecifier,
    ExpressionStatement,
    ForInStatement,
    ForOfStatement,
    ForStatement,
    FunctionDeclaration,
    FunctionExpression,
    Identifier,
    IfStatement,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportExpression,
    ImportNamespaceSpecifier,
    ImportSpecifier,
    LabeledStatement,
    Literal,
    LogicalExpression,
    MemberExpression,
    MetaProperty,
    MethodDefinition,
    NewExpression,
    ObjectExpression,
    ObjectPattern,
    PrivateIdentifier,
    Program,
    Property,
    PropertyDefinition,
    RestElement,
    ReturnStatement,
    SequenceExpression,
    SpreadElement,
    StaticBlock,
    Super,
    SwitchCase,
    SwitchStatement,
    TaggedTemplateExpression,
    TemplateElement,
    TemplateLiteral,
    ThisExpression,
    ThrowStatement,
    TryStatement,
    UnaryExpression,
    UnknownNode,
    UpdateExpression,
    VariableDeclaration,
    VariableDeclarator,
    WhileStatement,
    YieldExpression
};

const MISSING_EXPORT_SHIM_VARIABLE = '_missingExportShim';

class ExportShimVariable extends Variable {
    constructor(module) {
        super(MISSING_EXPORT_SHIM_VARIABLE);
        this.module = module;
    }
    include() {
        super.include();
        this.module.needsExportShim = true;
    }
}

class NamespaceVariable extends Variable {
    constructor(context) {
        super(context.getModuleName());
        this.memberVariables = null;
        this.mergedNamespaces = [];
        this.referencedEarly = false;
        this.references = [];
        this.context = context;
        this.module = context.module;
    }
    addReference(identifier) {
        this.references.push(identifier);
        this.name = identifier.name;
    }
    getMemberVariables() {
        if (this.memberVariables) {
            return this.memberVariables;
        }
        const memberVariables = Object.create(null);
        for (const name of this.context.getExports().concat(this.context.getReexports())) {
            if (name[0] !== '*' && name !== this.module.info.syntheticNamedExports) {
                const exportedVariable = this.context.traceExport(name);
                if (exportedVariable) {
                    memberVariables[name] = exportedVariable;
                }
            }
        }
        return (this.memberVariables = memberVariables);
    }
    include() {
        this.included = true;
        this.context.includeAllExports();
    }
    prepare(accessedGlobalsByScope) {
        if (this.mergedNamespaces.length > 0) {
            this.module.scope.addAccessedGlobals([MERGE_NAMESPACES_VARIABLE], accessedGlobalsByScope);
        }
    }
    renderBlock(options) {
        const { exportNamesByVariable, format, freeze, indent: t, namespaceToStringTag, snippets: { _, cnst, getObject, getPropertyAccess, n, s } } = options;
        const memberVariables = this.getMemberVariables();
        const members = Object.entries(memberVariables).map(([name, original]) => {
            if (this.referencedEarly || original.isReassigned) {
                return [
                    null,
                    `get ${name}${_}()${_}{${_}return ${original.getName(getPropertyAccess)}${s}${_}}`
                ];
            }
            return [name, original.getName(getPropertyAccess)];
        });
        members.unshift([null, `__proto__:${_}null`]);
        let output = getObject(members, { lineBreakIndent: { base: '', t } });
        if (this.mergedNamespaces.length > 0) {
            const assignmentArgs = this.mergedNamespaces.map(variable => variable.getName(getPropertyAccess));
            output = `/*#__PURE__*/${MERGE_NAMESPACES_VARIABLE}(${output},${_}[${assignmentArgs.join(`,${_}`)}])`;
        }
        else {
            // The helper to merge namespaces will also take care of freezing and toStringTag
            if (namespaceToStringTag) {
                output = `/*#__PURE__*/Object.defineProperty(${output},${_}Symbol.toStringTag,${_}${getToStringTagValue(getObject)})`;
            }
            if (freeze) {
                output = `/*#__PURE__*/Object.freeze(${output})`;
            }
        }
        const name = this.getName(getPropertyAccess);
        output = `${cnst} ${name}${_}=${_}${output};`;
        if (format === 'system' && exportNamesByVariable.has(this)) {
            output += `${n}${getSystemExportStatement([this], options)};`;
        }
        return output;
    }
    renderFirst() {
        return this.referencedEarly;
    }
    setMergedNamespaces(mergedNamespaces) {
        this.mergedNamespaces = mergedNamespaces;
        const moduleExecIndex = this.context.getModuleExecIndex();
        for (const identifier of this.references) {
            if (identifier.context.getModuleExecIndex() <= moduleExecIndex) {
                this.referencedEarly = true;
                break;
            }
        }
    }
}
NamespaceVariable.prototype.isNamespace = true;

class SyntheticNamedExportVariable extends Variable {
    constructor(context, name, syntheticNamespace) {
        super(name);
        this.baseVariable = null;
        this.context = context;
        this.module = context.module;
        this.syntheticNamespace = syntheticNamespace;
    }
    getBaseVariable() {
        if (this.baseVariable)
            return this.baseVariable;
        let baseVariable = this.syntheticNamespace;
        while (baseVariable instanceof ExportDefaultVariable ||
            baseVariable instanceof SyntheticNamedExportVariable) {
            if (baseVariable instanceof ExportDefaultVariable) {
                const original = baseVariable.getOriginalVariable();
                if (original === baseVariable)
                    break;
                baseVariable = original;
            }
            if (baseVariable instanceof SyntheticNamedExportVariable) {
                baseVariable = baseVariable.syntheticNamespace;
            }
        }
        return (this.baseVariable = baseVariable);
    }
    getBaseVariableName() {
        return this.syntheticNamespace.getBaseVariableName();
    }
    getName(getPropertyAccess) {
        return `${this.syntheticNamespace.getName(getPropertyAccess)}${getPropertyAccess(this.name)}`;
    }
    include() {
        this.included = true;
        this.context.includeVariableInModule(this.syntheticNamespace);
    }
    setRenderNames(baseName, name) {
        super.setRenderNames(baseName, name);
    }
}

var BuildPhase;
(function (BuildPhase) {
    BuildPhase[BuildPhase["LOAD_AND_PARSE"] = 0] = "LOAD_AND_PARSE";
    BuildPhase[BuildPhase["ANALYSE"] = 1] = "ANALYSE";
    BuildPhase[BuildPhase["GENERATE"] = 2] = "GENERATE";
})(BuildPhase || (BuildPhase = {}));

function getId(m) {
    return m.id;
}

function getOriginalLocation(sourcemapChain, location) {
    const filteredSourcemapChain = sourcemapChain.filter((sourcemap) => !!sourcemap.mappings);
    traceSourcemap: while (filteredSourcemapChain.length > 0) {
        const sourcemap = filteredSourcemapChain.pop();
        const line = sourcemap.mappings[location.line - 1];
        if (line) {
            const filteredLine = line.filter((segment) => segment.length > 1);
            const lastSegment = filteredLine[filteredLine.length - 1];
            for (const segment of filteredLine) {
                if (segment[0] >= location.column || segment === lastSegment) {
                    location = {
                        column: segment[3],
                        line: segment[2] + 1
                    };
                    continue traceSourcemap;
                }
            }
        }
        throw new Error("Can't resolve original location of error.");
    }
    return location;
}

const NOOP = () => { };
let timers = new Map();
function getPersistedLabel(label, level) {
    switch (level) {
        case 1:
            return `# ${label}`;
        case 2:
            return `## ${label}`;
        case 3:
            return label;
        default:
            return `${'  '.repeat(level - 4)}- ${label}`;
    }
}
function timeStartImpl(label, level = 3) {
    label = getPersistedLabel(label, level);
    const startMemory = process$1.memoryUsage().heapUsed;
    const startTime = perf_hooks.performance.now();
    const timer = timers.get(label);
    if (timer === undefined) {
        timers.set(label, {
            memory: 0,
            startMemory,
            startTime,
            time: 0,
            totalMemory: 0
        });
    }
    else {
        timer.startMemory = startMemory;
        timer.startTime = startTime;
    }
}
function timeEndImpl(label, level = 3) {
    label = getPersistedLabel(label, level);
    const timer = timers.get(label);
    if (timer !== undefined) {
        const currentMemory = process$1.memoryUsage().heapUsed;
        timer.memory += currentMemory - timer.startMemory;
        timer.time += perf_hooks.performance.now() - timer.startTime;
        timer.totalMemory = Math.max(timer.totalMemory, currentMemory);
    }
}
function getTimings() {
    const newTimings = {};
    for (const [label, { memory, time, totalMemory }] of timers) {
        newTimings[label] = [time, memory, totalMemory];
    }
    return newTimings;
}
let timeStart = NOOP;
let timeEnd = NOOP;
const TIMED_PLUGIN_HOOKS = ['load', 'resolveDynamicImport', 'resolveId', 'transform'];
function getPluginWithTimers(plugin, index) {
    for (const hook of TIMED_PLUGIN_HOOKS) {
        if (hook in plugin) {
            let timerLabel = `plugin ${index}`;
            if (plugin.name) {
                timerLabel += ` (${plugin.name})`;
            }
            timerLabel += ` - ${hook}`;
            const func = plugin[hook];
            plugin[hook] = function (...args) {
                timeStart(timerLabel, 4);
                const result = func.apply(this, args);
                timeEnd(timerLabel, 4);
                if (result && typeof result.then === 'function') {
                    timeStart(`${timerLabel} (async)`, 4);
                    return result.then((hookResult) => {
                        timeEnd(`${timerLabel} (async)`, 4);
                        return hookResult;
                    });
                }
                return result;
            };
        }
    }
    return plugin;
}
function initialiseTimers(inputOptions) {
    if (inputOptions.perf) {
        timers = new Map();
        timeStart = timeStartImpl;
        timeEnd = timeEndImpl;
        inputOptions.plugins = inputOptions.plugins.map(getPluginWithTimers);
    }
    else {
        timeStart = NOOP;
        timeEnd = NOOP;
    }
}

function markModuleAndImpureDependenciesAsExecuted(baseModule) {
    baseModule.isExecuted = true;
    const modules = [baseModule];
    const visitedModules = new Set();
    for (const module of modules) {
        for (const dependency of [...module.dependencies, ...module.implicitlyLoadedBefore]) {
            if (!(dependency instanceof ExternalModule) &&
                !dependency.isExecuted &&
                (dependency.info.moduleSideEffects || module.implicitlyLoadedBefore.has(dependency)) &&
                !visitedModules.has(dependency.id)) {
                dependency.isExecuted = true;
                visitedModules.add(dependency.id);
                modules.push(dependency);
            }
        }
    }
}

const MISSING_EXPORT_SHIM_DESCRIPTION = {
    identifier: null,
    localName: MISSING_EXPORT_SHIM_VARIABLE
};
function getVariableForExportNameRecursive(target, name, importerForSideEffects, isExportAllSearch, searchedNamesAndModules = new Map()) {
    const searchedModules = searchedNamesAndModules.get(name);
    if (searchedModules) {
        if (searchedModules.has(target)) {
            return isExportAllSearch ? [null] : error(errCircularReexport(name, target.id));
        }
        searchedModules.add(target);
    }
    else {
        searchedNamesAndModules.set(name, new Set([target]));
    }
    return target.getVariableForExportName(name, {
        importerForSideEffects,
        isExportAllSearch,
        searchedNamesAndModules
    });
}
function getAndExtendSideEffectModules(variable, module) {
    const sideEffectModules = getOrCreate(module.sideEffectDependenciesByVariable, variable, () => new Set());
    let currentVariable = variable;
    const referencedVariables = new Set([currentVariable]);
    while (true) {
        const importingModule = currentVariable.module;
        currentVariable =
            currentVariable instanceof ExportDefaultVariable
                ? currentVariable.getDirectOriginalVariable()
                : currentVariable instanceof SyntheticNamedExportVariable
                    ? currentVariable.syntheticNamespace
                    : null;
        if (!currentVariable || referencedVariables.has(currentVariable)) {
            break;
        }
        referencedVariables.add(currentVariable);
        sideEffectModules.add(importingModule);
        const originalSideEffects = importingModule.sideEffectDependenciesByVariable.get(currentVariable);
        if (originalSideEffects) {
            for (const module of originalSideEffects) {
                sideEffectModules.add(module);
            }
        }
    }
    return sideEffectModules;
}
class Module {
    constructor(graph, id, options, isEntry, moduleSideEffects, syntheticNamedExports, meta) {
        this.graph = graph;
        this.id = id;
        this.options = options;
        this.alternativeReexportModules = new Map();
        this.chunkFileNames = new Set();
        this.chunkNames = [];
        this.cycles = new Set();
        this.dependencies = new Set();
        this.dynamicDependencies = new Set();
        this.dynamicImporters = [];
        this.dynamicImports = [];
        this.execIndex = Infinity;
        this.implicitlyLoadedAfter = new Set();
        this.implicitlyLoadedBefore = new Set();
        this.importDescriptions = new Map();
        this.importMetas = [];
        this.importedFromNotTreeshaken = false;
        this.importers = [];
        this.includedDynamicImporters = [];
        this.includedImports = new Set();
        this.isExecuted = false;
        this.isUserDefinedEntryPoint = false;
        this.needsExportShim = false;
        this.sideEffectDependenciesByVariable = new Map();
        this.sources = new Set();
        this.usesTopLevelAwait = false;
        this.allExportNames = null;
        this.ast = null;
        this.exportAllModules = [];
        this.exportAllSources = new Set();
        this.exportNamesByVariable = null;
        this.exportShimVariable = new ExportShimVariable(this);
        this.exports = new Map();
        this.namespaceReexportsByName = new Map();
        this.reexportDescriptions = new Map();
        this.relevantDependencies = null;
        this.syntheticExports = new Map();
        this.syntheticNamespace = null;
        this.transformDependencies = [];
        this.transitiveReexports = null;
        this.excludeFromSourcemap = /\0/.test(id);
        this.context = options.moduleContext(id);
        this.preserveSignature = this.options.preserveEntrySignatures;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const module = this;
        const { dynamicImports, dynamicImporters, implicitlyLoadedAfter, implicitlyLoadedBefore, importers, reexportDescriptions, sources } = this;
        this.info = {
            ast: null,
            code: null,
            get dynamicallyImportedIdResolutions() {
                return dynamicImports
                    .map(({ argument }) => typeof argument === 'string' && module.resolvedIds[argument])
                    .filter(Boolean);
            },
            get dynamicallyImportedIds() {
                // We cannot use this.dynamicDependencies because this is needed before
                // dynamicDependencies are populated
                return dynamicImports.map(({ id }) => id).filter((id) => id != null);
            },
            get dynamicImporters() {
                return dynamicImporters.sort();
            },
            get hasDefaultExport() {
                // This information is only valid after parsing
                if (!module.ast) {
                    return null;
                }
                return module.exports.has('default') || reexportDescriptions.has('default');
            },
            get hasModuleSideEffects() {
                warnDeprecation('Accessing ModuleInfo.hasModuleSideEffects from plugins is deprecated. Please use ModuleInfo.moduleSideEffects instead.', false, options);
                return this.moduleSideEffects;
            },
            id,
            get implicitlyLoadedAfterOneOf() {
                return Array.from(implicitlyLoadedAfter, getId).sort();
            },
            get implicitlyLoadedBefore() {
                return Array.from(implicitlyLoadedBefore, getId).sort();
            },
            get importedIdResolutions() {
                return Array.from(sources, source => module.resolvedIds[source]).filter(Boolean);
            },
            get importedIds() {
                // We cannot use this.dependencies because this is needed before
                // dependencies are populated
                return Array.from(sources, source => { var _a; return (_a = module.resolvedIds[source]) === null || _a === void 0 ? void 0 : _a.id; }).filter(Boolean);
            },
            get importers() {
                return importers.sort();
            },
            isEntry,
            isExternal: false,
            get isIncluded() {
                if (graph.phase !== BuildPhase.GENERATE) {
                    return null;
                }
                return module.isIncluded();
            },
            meta: { ...meta },
            moduleSideEffects,
            syntheticNamedExports
        };
        // Hide the deprecated key so that it only warns when accessed explicitly
        Object.defineProperty(this.info, 'hasModuleSideEffects', {
            enumerable: false
        });
    }
    basename() {
        const base = require$$0.basename(this.id);
        const ext = require$$0.extname(this.id);
        return makeLegal(ext ? base.slice(0, -ext.length) : base);
    }
    bindReferences() {
        this.ast.bind();
    }
    error(props, pos) {
        this.addLocationToLogProps(props, pos);
        return error(props);
    }
    getAllExportNames() {
        if (this.allExportNames) {
            return this.allExportNames;
        }
        this.allExportNames = new Set([...this.exports.keys(), ...this.reexportDescriptions.keys()]);
        for (const module of this.exportAllModules) {
            if (module instanceof ExternalModule) {
                this.allExportNames.add(`*${module.id}`);
                continue;
            }
            for (const name of module.getAllExportNames()) {
                if (name !== 'default')
                    this.allExportNames.add(name);
            }
        }
        // We do not count the synthetic namespace as a regular export to hide it
        // from entry signatures and namespace objects
        if (typeof this.info.syntheticNamedExports === 'string') {
            this.allExportNames.delete(this.info.syntheticNamedExports);
        }
        return this.allExportNames;
    }
    getDependenciesToBeIncluded() {
        if (this.relevantDependencies)
            return this.relevantDependencies;
        this.relevantDependencies = new Set();
        const necessaryDependencies = new Set();
        const alwaysCheckedDependencies = new Set();
        const dependencyVariables = new Set(this.includedImports);
        if (this.info.isEntry ||
            this.includedDynamicImporters.length > 0 ||
            this.namespace.included ||
            this.implicitlyLoadedAfter.size > 0) {
            for (const exportName of [...this.getReexports(), ...this.getExports()]) {
                const [exportedVariable] = this.getVariableForExportName(exportName);
                if (exportedVariable) {
                    dependencyVariables.add(exportedVariable);
                }
            }
        }
        for (let variable of dependencyVariables) {
            const sideEffectDependencies = this.sideEffectDependenciesByVariable.get(variable);
            if (sideEffectDependencies) {
                for (const module of sideEffectDependencies) {
                    alwaysCheckedDependencies.add(module);
                }
            }
            if (variable instanceof SyntheticNamedExportVariable) {
                variable = variable.getBaseVariable();
            }
            else if (variable instanceof ExportDefaultVariable) {
                variable = variable.getOriginalVariable();
            }
            necessaryDependencies.add(variable.module);
        }
        if (!this.options.treeshake || this.info.moduleSideEffects === 'no-treeshake') {
            for (const dependency of this.dependencies) {
                this.relevantDependencies.add(dependency);
            }
        }
        else {
            this.addRelevantSideEffectDependencies(this.relevantDependencies, necessaryDependencies, alwaysCheckedDependencies);
        }
        for (const dependency of necessaryDependencies) {
            this.relevantDependencies.add(dependency);
        }
        return this.relevantDependencies;
    }
    getExportNamesByVariable() {
        if (this.exportNamesByVariable) {
            return this.exportNamesByVariable;
        }
        const exportNamesByVariable = new Map();
        for (const exportName of this.getAllExportNames()) {
            let [tracedVariable] = this.getVariableForExportName(exportName);
            if (tracedVariable instanceof ExportDefaultVariable) {
                tracedVariable = tracedVariable.getOriginalVariable();
            }
            if (!tracedVariable ||
                !(tracedVariable.included || tracedVariable instanceof ExternalVariable)) {
                continue;
            }
            const existingExportNames = exportNamesByVariable.get(tracedVariable);
            if (existingExportNames) {
                existingExportNames.push(exportName);
            }
            else {
                exportNamesByVariable.set(tracedVariable, [exportName]);
            }
        }
        return (this.exportNamesByVariable = exportNamesByVariable);
    }
    getExports() {
        return Array.from(this.exports.keys());
    }
    getReexports() {
        if (this.transitiveReexports) {
            return this.transitiveReexports;
        }
        // to avoid infinite recursion when using circular `export * from X`
        this.transitiveReexports = [];
        const reexports = new Set(this.reexportDescriptions.keys());
        for (const module of this.exportAllModules) {
            if (module instanceof ExternalModule) {
                reexports.add(`*${module.id}`);
            }
            else {
                for (const name of [...module.getReexports(), ...module.getExports()]) {
                    if (name !== 'default')
                        reexports.add(name);
                }
            }
        }
        return (this.transitiveReexports = [...reexports]);
    }
    getRenderedExports() {
        // only direct exports are counted here, not reexports at all
        const renderedExports = [];
        const removedExports = [];
        for (const exportName of this.exports.keys()) {
            const [variable] = this.getVariableForExportName(exportName);
            (variable && variable.included ? renderedExports : removedExports).push(exportName);
        }
        return { removedExports, renderedExports };
    }
    getSyntheticNamespace() {
        if (this.syntheticNamespace === null) {
            this.syntheticNamespace = undefined;
            [this.syntheticNamespace] = this.getVariableForExportName(typeof this.info.syntheticNamedExports === 'string'
                ? this.info.syntheticNamedExports
                : 'default', { onlyExplicit: true });
        }
        if (!this.syntheticNamespace) {
            return error(errSyntheticNamedExportsNeedNamespaceExport(this.id, this.info.syntheticNamedExports));
        }
        return this.syntheticNamespace;
    }
    getVariableForExportName(name, { importerForSideEffects, isExportAllSearch, onlyExplicit, searchedNamesAndModules } = EMPTY_OBJECT) {
        var _a;
        if (name[0] === '*') {
            if (name.length === 1) {
                // export * from './other'
                return [this.namespace];
            }
            // export * from 'external'
            const module = this.graph.modulesById.get(name.slice(1));
            return module.getVariableForExportName('*');
        }
        // export { foo } from './other'
        const reexportDeclaration = this.reexportDescriptions.get(name);
        if (reexportDeclaration) {
            const [variable] = getVariableForExportNameRecursive(reexportDeclaration.module, reexportDeclaration.localName, importerForSideEffects, false, searchedNamesAndModules);
            if (!variable) {
                return this.error(errMissingExport(reexportDeclaration.localName, this.id, reexportDeclaration.module.id), reexportDeclaration.start);
            }
            if (importerForSideEffects) {
                setAlternativeExporterIfCyclic(variable, importerForSideEffects, this);
            }
            return [variable];
        }
        const exportDeclaration = this.exports.get(name);
        if (exportDeclaration) {
            if (exportDeclaration === MISSING_EXPORT_SHIM_DESCRIPTION) {
                return [this.exportShimVariable];
            }
            const name = exportDeclaration.localName;
            const variable = this.traceVariable(name, {
                importerForSideEffects,
                searchedNamesAndModules
            });
            if (importerForSideEffects) {
                getOrCreate(importerForSideEffects.sideEffectDependenciesByVariable, variable, () => new Set()).add(this);
                setAlternativeExporterIfCyclic(variable, importerForSideEffects, this);
            }
            return [variable];
        }
        if (onlyExplicit) {
            return [null];
        }
        if (name !== 'default') {
            const foundNamespaceReexport = (_a = this.namespaceReexportsByName.get(name)) !== null && _a !== void 0 ? _a : this.getVariableFromNamespaceReexports(name, importerForSideEffects, searchedNamesAndModules);
            this.namespaceReexportsByName.set(name, foundNamespaceReexport);
            if (foundNamespaceReexport[0]) {
                return foundNamespaceReexport;
            }
        }
        if (this.info.syntheticNamedExports) {
            return [
                getOrCreate(this.syntheticExports, name, () => new SyntheticNamedExportVariable(this.astContext, name, this.getSyntheticNamespace()))
            ];
        }
        // we don't want to create shims when we are just
        // probing export * modules for exports
        if (!isExportAllSearch) {
            if (this.options.shimMissingExports) {
                this.shimMissingExport(name);
                return [this.exportShimVariable];
            }
        }
        return [null];
    }
    hasEffects() {
        return (this.info.moduleSideEffects === 'no-treeshake' ||
            (this.ast.included && this.ast.hasEffects(createHasEffectsContext())));
    }
    include() {
        const context = createInclusionContext();
        if (this.ast.shouldBeIncluded(context))
            this.ast.include(context, false);
    }
    includeAllExports(includeNamespaceMembers) {
        if (!this.isExecuted) {
            markModuleAndImpureDependenciesAsExecuted(this);
            this.graph.needsTreeshakingPass = true;
        }
        for (const exportName of this.exports.keys()) {
            if (includeNamespaceMembers || exportName !== this.info.syntheticNamedExports) {
                const variable = this.getVariableForExportName(exportName)[0];
                variable.deoptimizePath(UNKNOWN_PATH);
                if (!variable.included) {
                    this.includeVariable(variable);
                }
            }
        }
        for (const name of this.getReexports()) {
            const [variable] = this.getVariableForExportName(name);
            if (variable) {
                variable.deoptimizePath(UNKNOWN_PATH);
                if (!variable.included) {
                    this.includeVariable(variable);
                }
                if (variable instanceof ExternalVariable) {
                    variable.module.reexported = true;
                }
            }
        }
        if (includeNamespaceMembers) {
            this.namespace.setMergedNamespaces(this.includeAndGetAdditionalMergedNamespaces());
        }
    }
    includeAllInBundle() {
        this.ast.include(createInclusionContext(), true);
        this.includeAllExports(false);
    }
    isIncluded() {
        return this.ast.included || this.namespace.included || this.importedFromNotTreeshaken;
    }
    linkImports() {
        this.addModulesToImportDescriptions(this.importDescriptions);
        this.addModulesToImportDescriptions(this.reexportDescriptions);
        const externalExportAllModules = [];
        for (const source of this.exportAllSources) {
            const module = this.graph.modulesById.get(this.resolvedIds[source].id);
            if (module instanceof ExternalModule) {
                externalExportAllModules.push(module);
                continue;
            }
            this.exportAllModules.push(module);
        }
        this.exportAllModules.push(...externalExportAllModules);
    }
    render(options) {
        const magicString = this.magicString.clone();
        this.ast.render(magicString, options);
        this.usesTopLevelAwait = this.astContext.usesTopLevelAwait;
        return magicString;
    }
    setSource({ ast, code, customTransformCache, originalCode, originalSourcemap, resolvedIds, sourcemapChain, transformDependencies, transformFiles, ...moduleOptions }) {
        this.info.code = code;
        this.originalCode = originalCode;
        this.originalSourcemap = originalSourcemap;
        this.sourcemapChain = sourcemapChain;
        if (transformFiles) {
            this.transformFiles = transformFiles;
        }
        this.transformDependencies = transformDependencies;
        this.customTransformCache = customTransformCache;
        this.updateOptions(moduleOptions);
        timeStart('generate ast', 3);
        if (!ast) {
            ast = this.tryParse();
        }
        timeEnd('generate ast', 3);
        this.resolvedIds = resolvedIds || Object.create(null);
        // By default, `id` is the file name. Custom resolvers and loaders
        // can change that, but it makes sense to use it for the source file name
        const fileName = this.id;
        this.magicString = new MagicString(code, {
            filename: (this.excludeFromSourcemap ? null : fileName),
            indentExclusionRanges: []
        });
        timeStart('analyse ast', 3);
        this.astContext = {
            addDynamicImport: this.addDynamicImport.bind(this),
            addExport: this.addExport.bind(this),
            addImport: this.addImport.bind(this),
            addImportMeta: this.addImportMeta.bind(this),
            code,
            deoptimizationTracker: this.graph.deoptimizationTracker,
            error: this.error.bind(this),
            fileName,
            getExports: this.getExports.bind(this),
            getModuleExecIndex: () => this.execIndex,
            getModuleName: this.basename.bind(this),
            getNodeConstructor: (name) => nodeConstructors[name] || nodeConstructors.UnknownNode,
            getReexports: this.getReexports.bind(this),
            importDescriptions: this.importDescriptions,
            includeAllExports: () => this.includeAllExports(true),
            includeDynamicImport: this.includeDynamicImport.bind(this),
            includeVariableInModule: this.includeVariableInModule.bind(this),
            magicString: this.magicString,
            module: this,
            moduleContext: this.context,
            options: this.options,
            requestTreeshakingPass: () => (this.graph.needsTreeshakingPass = true),
            traceExport: (name) => this.getVariableForExportName(name)[0],
            traceVariable: this.traceVariable.bind(this),
            usesTopLevelAwait: false,
            warn: this.warn.bind(this)
        };
        this.scope = new ModuleScope(this.graph.scope, this.astContext);
        this.namespace = new NamespaceVariable(this.astContext);
        this.ast = new Program(ast, { context: this.astContext, type: 'Module' }, this.scope);
        this.info.ast = ast;
        timeEnd('analyse ast', 3);
    }
    toJSON() {
        return {
            ast: this.ast.esTreeNode,
            code: this.info.code,
            customTransformCache: this.customTransformCache,
            dependencies: Array.from(this.dependencies, getId),
            id: this.id,
            meta: this.info.meta,
            moduleSideEffects: this.info.moduleSideEffects,
            originalCode: this.originalCode,
            originalSourcemap: this.originalSourcemap,
            resolvedIds: this.resolvedIds,
            sourcemapChain: this.sourcemapChain,
            syntheticNamedExports: this.info.syntheticNamedExports,
            transformDependencies: this.transformDependencies,
            transformFiles: this.transformFiles
        };
    }
    traceVariable(name, { importerForSideEffects, isExportAllSearch, searchedNamesAndModules } = EMPTY_OBJECT) {
        const localVariable = this.scope.variables.get(name);
        if (localVariable) {
            return localVariable;
        }
        const importDeclaration = this.importDescriptions.get(name);
        if (importDeclaration) {
            const otherModule = importDeclaration.module;
            if (otherModule instanceof Module && importDeclaration.name === '*') {
                return otherModule.namespace;
            }
            const [declaration] = getVariableForExportNameRecursive(otherModule, importDeclaration.name, importerForSideEffects || this, isExportAllSearch, searchedNamesAndModules);
            if (!declaration) {
                return this.error(errMissingExport(importDeclaration.name, this.id, otherModule.id), importDeclaration.start);
            }
            return declaration;
        }
        return null;
    }
    tryParse() {
        try {
            return this.graph.contextParse(this.info.code);
        }
        catch (err) {
            let message = err.message.replace(/ \(\d+:\d+\)$/, '');
            if (this.id.endsWith('.json')) {
                message += ' (Note that you need @rollup/plugin-json to import JSON files)';
            }
            else if (!this.id.endsWith('.js')) {
                message += ' (Note that you need plugins to import files that are not JavaScript)';
            }
            return this.error({
                code: 'PARSE_ERROR',
                message,
                parserError: err
            }, err.pos);
        }
    }
    updateOptions({ meta, moduleSideEffects, syntheticNamedExports }) {
        if (moduleSideEffects != null) {
            this.info.moduleSideEffects = moduleSideEffects;
        }
        if (syntheticNamedExports != null) {
            this.info.syntheticNamedExports = syntheticNamedExports;
        }
        if (meta != null) {
            Object.assign(this.info.meta, meta);
        }
    }
    warn(props, pos) {
        this.addLocationToLogProps(props, pos);
        this.options.onwarn(props);
    }
    addDynamicImport(node) {
        let argument = node.source;
        if (argument instanceof TemplateLiteral) {
            if (argument.quasis.length === 1 && argument.quasis[0].value.cooked) {
                argument = argument.quasis[0].value.cooked;
            }
        }
        else if (argument instanceof Literal && typeof argument.value === 'string') {
            argument = argument.value;
        }
        this.dynamicImports.push({ argument, id: null, node, resolution: null });
    }
    addExport(node) {
        if (node instanceof ExportDefaultDeclaration) {
            // export default foo;
            this.exports.set('default', {
                identifier: node.variable.getAssignedVariableName(),
                localName: 'default'
            });
        }
        else if (node instanceof ExportAllDeclaration) {
            const source = node.source.value;
            this.sources.add(source);
            if (node.exported) {
                // export * as name from './other'
                const name = node.exported.name;
                this.reexportDescriptions.set(name, {
                    localName: '*',
                    module: null,
                    source,
                    start: node.start
                });
            }
            else {
                // export * from './other'
                this.exportAllSources.add(source);
            }
        }
        else if (node.source instanceof Literal) {
            // export { name } from './other'
            const source = node.source.value;
            this.sources.add(source);
            for (const specifier of node.specifiers) {
                const name = specifier.exported.name;
                this.reexportDescriptions.set(name, {
                    localName: specifier.local.name,
                    module: null,
                    source,
                    start: specifier.start
                });
            }
        }
        else if (node.declaration) {
            const declaration = node.declaration;
            if (declaration instanceof VariableDeclaration) {
                // export var { foo, bar } = ...
                // export var foo = 1, bar = 2;
                for (const declarator of declaration.declarations) {
                    for (const localName of extractAssignedNames(declarator.id)) {
                        this.exports.set(localName, { identifier: null, localName });
                    }
                }
            }
            else {
                // export function foo () {}
                const localName = declaration.id.name;
                this.exports.set(localName, { identifier: null, localName });
            }
        }
        else {
            // export { foo, bar, baz }
            for (const specifier of node.specifiers) {
                const localName = specifier.local.name;
                const exportedName = specifier.exported.name;
                this.exports.set(exportedName, { identifier: null, localName });
            }
        }
    }
    addImport(node) {
        const source = node.source.value;
        this.sources.add(source);
        for (const specifier of node.specifiers) {
            const isDefault = specifier.type === ImportDefaultSpecifier$1;
            const isNamespace = specifier.type === ImportNamespaceSpecifier$1;
            const name = isDefault ? 'default' : isNamespace ? '*' : specifier.imported.name;
            this.importDescriptions.set(specifier.local.name, {
                module: null,
                name,
                source,
                start: specifier.start
            });
        }
    }
    addImportMeta(node) {
        this.importMetas.push(node);
    }
    addLocationToLogProps(props, pos) {
        props.id = this.id;
        props.pos = pos;
        let code = this.info.code;
        const location = locate(code, pos, { offsetLine: 1 });
        if (location) {
            let { column, line } = location;
            try {
                ({ column, line } = getOriginalLocation(this.sourcemapChain, { column, line }));
                code = this.originalCode;
            }
            catch (err) {
                this.options.onwarn({
                    code: 'SOURCEMAP_ERROR',
                    id: this.id,
                    loc: {
                        column,
                        file: this.id,
                        line
                    },
                    message: `Error when using sourcemap for reporting an error: ${err.message}`,
                    pos
                });
            }
            augmentCodeLocation(props, { column, line }, code, this.id);
        }
    }
    addModulesToImportDescriptions(importDescription) {
        for (const specifier of importDescription.values()) {
            const { id } = this.resolvedIds[specifier.source];
            specifier.module = this.graph.modulesById.get(id);
        }
    }
    addRelevantSideEffectDependencies(relevantDependencies, necessaryDependencies, alwaysCheckedDependencies) {
        const handledDependencies = new Set();
        const addSideEffectDependencies = (possibleDependencies) => {
            for (const dependency of possibleDependencies) {
                if (handledDependencies.has(dependency)) {
                    continue;
                }
                handledDependencies.add(dependency);
                if (necessaryDependencies.has(dependency)) {
                    relevantDependencies.add(dependency);
                    continue;
                }
                if (!(dependency.info.moduleSideEffects || alwaysCheckedDependencies.has(dependency))) {
                    continue;
                }
                if (dependency instanceof ExternalModule || dependency.hasEffects()) {
                    relevantDependencies.add(dependency);
                    continue;
                }
                addSideEffectDependencies(dependency.dependencies);
            }
        };
        addSideEffectDependencies(this.dependencies);
        addSideEffectDependencies(alwaysCheckedDependencies);
    }
    getVariableFromNamespaceReexports(name, importerForSideEffects, searchedNamesAndModules) {
        let foundSyntheticDeclaration = null;
        const foundInternalDeclarations = new Map();
        const foundExternalDeclarations = new Set();
        for (const module of this.exportAllModules) {
            // Synthetic namespaces should not hide "regular" exports of the same name
            if (module.info.syntheticNamedExports === name) {
                continue;
            }
            const [variable, indirectExternal] = getVariableForExportNameRecursive(module, name, importerForSideEffects, true, 
            // We are creating a copy to handle the case where the same binding is
            // imported through different namespace reexports gracefully
            copyNameToModulesMap(searchedNamesAndModules));
            if (module instanceof ExternalModule || indirectExternal) {
                foundExternalDeclarations.add(variable);
            }
            else if (variable instanceof SyntheticNamedExportVariable) {
                if (!foundSyntheticDeclaration) {
                    foundSyntheticDeclaration = variable;
                }
            }
            else if (variable) {
                foundInternalDeclarations.set(variable, module);
            }
        }
        if (foundInternalDeclarations.size > 0) {
            const foundDeclarationList = [...foundInternalDeclarations];
            const usedDeclaration = foundDeclarationList[0][0];
            if (foundDeclarationList.length === 1) {
                return [usedDeclaration];
            }
            this.options.onwarn(errNamespaceConflict(name, this.id, foundDeclarationList.map(([, module]) => module.id)));
            // TODO we are pretending it was not found while it should behave like "undefined"
            return [null];
        }
        if (foundExternalDeclarations.size > 0) {
            const foundDeclarationList = [...foundExternalDeclarations];
            const usedDeclaration = foundDeclarationList[0];
            if (foundDeclarationList.length > 1) {
                this.options.onwarn(errAmbiguousExternalNamespaces(name, this.id, usedDeclaration.module.id, foundDeclarationList.map(declaration => declaration.module.id)));
            }
            return [usedDeclaration, true];
        }
        if (foundSyntheticDeclaration) {
            return [foundSyntheticDeclaration];
        }
        return [null];
    }
    includeAndGetAdditionalMergedNamespaces() {
        const externalNamespaces = new Set();
        const syntheticNamespaces = new Set();
        for (const module of [this, ...this.exportAllModules]) {
            if (module instanceof ExternalModule) {
                const [externalVariable] = module.getVariableForExportName('*');
                externalVariable.include();
                this.includedImports.add(externalVariable);
                externalNamespaces.add(externalVariable);
            }
            else if (module.info.syntheticNamedExports) {
                const syntheticNamespace = module.getSyntheticNamespace();
                syntheticNamespace.include();
                this.includedImports.add(syntheticNamespace);
                syntheticNamespaces.add(syntheticNamespace);
            }
        }
        return [...syntheticNamespaces, ...externalNamespaces];
    }
    includeDynamicImport(node) {
        const resolution = this.dynamicImports.find(dynamicImport => dynamicImport.node === node).resolution;
        if (resolution instanceof Module) {
            resolution.includedDynamicImporters.push(this);
            resolution.includeAllExports(true);
        }
    }
    includeVariable(variable) {
        if (!variable.included) {
            variable.include();
            this.graph.needsTreeshakingPass = true;
            const variableModule = variable.module;
            if (variableModule instanceof Module) {
                if (!variableModule.isExecuted) {
                    markModuleAndImpureDependenciesAsExecuted(variableModule);
                }
                if (variableModule !== this) {
                    const sideEffectModules = getAndExtendSideEffectModules(variable, this);
                    for (const module of sideEffectModules) {
                        if (!module.isExecuted) {
                            markModuleAndImpureDependenciesAsExecuted(module);
                        }
                    }
                }
            }
        }
    }
    includeVariableInModule(variable) {
        this.includeVariable(variable);
        const variableModule = variable.module;
        if (variableModule && variableModule !== this) {
            this.includedImports.add(variable);
        }
    }
    shimMissingExport(name) {
        this.options.onwarn({
            code: 'SHIMMED_EXPORT',
            exporter: relativeId(this.id),
            exportName: name,
            message: `Missing export "${name}" has been shimmed in module ${relativeId(this.id)}.`
        });
        this.exports.set(name, MISSING_EXPORT_SHIM_DESCRIPTION);
    }
}
// if there is a cyclic import in the reexport chain, we should not
// import from the original module but from the cyclic module to not
// mess up execution order.
function setAlternativeExporterIfCyclic(variable, importer, reexporter) {
    if (variable.module instanceof Module && variable.module !== reexporter) {
        const exporterCycles = variable.module.cycles;
        if (exporterCycles.size > 0) {
            const importerCycles = reexporter.cycles;
            for (const cycleSymbol of importerCycles) {
                if (exporterCycles.has(cycleSymbol)) {
                    importer.alternativeReexportModules.set(variable, reexporter);
                    break;
                }
            }
        }
    }
}
const copyNameToModulesMap = (searchedNamesAndModules) => searchedNamesAndModules &&
    new Map(Array.from(searchedNamesAndModules, ([name, modules]) => [name, new Set(modules)]));

function removeJsExtension(name) {
    return name.endsWith('.js') ? name.slice(0, -3) : name;
}

function getCompleteAmdId(options, chunkId) {
    if (options.autoId) {
        return `${options.basePath ? options.basePath + '/' : ''}${removeJsExtension(chunkId)}`;
    }
    return options.id || '';
}

function getExportBlock$1(exports, dependencies, namedExportsMode, interop, snippets, t, externalLiveBindings, mechanism = 'return ') {
    const { _, cnst, getDirectReturnFunction, getFunctionIntro, getPropertyAccess, n, s } = snippets;
    if (!namedExportsMode) {
        return `${n}${n}${mechanism}${getSingleDefaultExport(exports, dependencies, interop, externalLiveBindings, getPropertyAccess)};`;
    }
    let exportBlock = '';
    for (const { defaultVariableName, id, isChunk, name, namedExportsMode: depNamedExportsMode, namespaceVariableName, reexports } of dependencies) {
        if (reexports && namedExportsMode) {
            for (const specifier of reexports) {
                if (specifier.reexported !== '*') {
                    const importName = getReexportedImportName(name, specifier.imported, depNamedExportsMode, isChunk, defaultVariableName, namespaceVariableName, interop, id, externalLiveBindings, getPropertyAccess);
                    if (exportBlock)
                        exportBlock += n;
                    if (specifier.imported !== '*' && specifier.needsLiveBinding) {
                        const [left, right] = getDirectReturnFunction([], {
                            functionReturn: true,
                            lineBreakIndent: null,
                            name: null
                        });
                        exportBlock +=
                            `Object.defineProperty(exports,${_}'${specifier.reexported}',${_}{${n}` +
                                `${t}enumerable:${_}true,${n}` +
                                `${t}get:${_}${left}${importName}${right}${n}});`;
                    }
                    else {
                        exportBlock += `exports${getPropertyAccess(specifier.reexported)}${_}=${_}${importName};`;
                    }
                }
            }
        }
    }
    for (const { exported, local } of exports) {
        const lhs = `exports${getPropertyAccess(exported)}`;
        const rhs = local;
        if (lhs !== rhs) {
            if (exportBlock)
                exportBlock += n;
            exportBlock += `${lhs}${_}=${_}${rhs};`;
        }
    }
    for (const { name, reexports } of dependencies) {
        if (reexports && namedExportsMode) {
            for (const specifier of reexports) {
                if (specifier.reexported === '*') {
                    if (exportBlock)
                        exportBlock += n;
                    const copyPropertyIfNecessary = `{${n}${t}if${_}(k${_}!==${_}'default'${_}&&${_}!exports.hasOwnProperty(k))${_}${getDefineProperty(name, specifier.needsLiveBinding, t, snippets)}${s}${n}}`;
                    exportBlock +=
                        cnst === 'var' && specifier.needsLiveBinding
                            ? `Object.keys(${name}).forEach(${getFunctionIntro(['k'], {
                                isAsync: false,
                                name: null
                            })}${copyPropertyIfNecessary});`
                            : `for${_}(${cnst} k in ${name})${_}${copyPropertyIfNecessary}`;
                }
            }
        }
    }
    if (exportBlock) {
        return `${n}${n}${exportBlock}`;
    }
    return '';
}
function getSingleDefaultExport(exports, dependencies, interop, externalLiveBindings, getPropertyAccess) {
    if (exports.length > 0) {
        return exports[0].local;
    }
    else {
        for (const { defaultVariableName, id, isChunk, name, namedExportsMode: depNamedExportsMode, namespaceVariableName, reexports } of dependencies) {
            if (reexports) {
                return getReexportedImportName(name, reexports[0].imported, depNamedExportsMode, isChunk, defaultVariableName, namespaceVariableName, interop, id, externalLiveBindings, getPropertyAccess);
            }
        }
    }
}
function getReexportedImportName(moduleVariableName, imported, depNamedExportsMode, isChunk, defaultVariableName, namespaceVariableName, interop, moduleId, externalLiveBindings, getPropertyAccess) {
    if (imported === 'default') {
        if (!isChunk) {
            const moduleInterop = String(interop(moduleId));
            const variableName = defaultInteropHelpersByInteropType[moduleInterop]
                ? defaultVariableName
                : moduleVariableName;
            return isDefaultAProperty(moduleInterop, externalLiveBindings)
                ? `${variableName}${getPropertyAccess('default')}`
                : variableName;
        }
        return depNamedExportsMode
            ? `${moduleVariableName}${getPropertyAccess('default')}`
            : moduleVariableName;
    }
    if (imported === '*') {
        return (isChunk
            ? !depNamedExportsMode
            : namespaceInteropHelpersByInteropType[String(interop(moduleId))])
            ? namespaceVariableName
            : moduleVariableName;
    }
    return `${moduleVariableName}${getPropertyAccess(imported)}`;
}
function getEsModuleValue(getObject) {
    return getObject([['value', 'true']], {
        lineBreakIndent: null
    });
}
function getNamespaceMarkers(hasNamedExports, addEsModule, addNamespaceToStringTag, { _, getObject }) {
    if (hasNamedExports) {
        if (addEsModule) {
            if (addNamespaceToStringTag) {
                return `Object.defineProperties(exports,${_}${getObject([
                    ['__esModule', getEsModuleValue(getObject)],
                    [null, `[Symbol.toStringTag]:${_}${getToStringTagValue(getObject)}`]
                ], {
                    lineBreakIndent: null
                })});`;
            }
            return `Object.defineProperty(exports,${_}'__esModule',${_}${getEsModuleValue(getObject)});`;
        }
        if (addNamespaceToStringTag) {
            return `Object.defineProperty(exports,${_}Symbol.toStringTag,${_}${getToStringTagValue(getObject)});`;
        }
    }
    return '';
}
const getDefineProperty = (name, needsLiveBinding, t, { _, getDirectReturnFunction, n }) => {
    if (needsLiveBinding) {
        const [left, right] = getDirectReturnFunction([], {
            functionReturn: true,
            lineBreakIndent: null,
            name: null
        });
        return (`Object.defineProperty(exports,${_}k,${_}{${n}` +
            `${t}${t}enumerable:${_}true,${n}` +
            `${t}${t}get:${_}${left}${name}[k]${right}${n}${t}})`);
    }
    return `exports[k]${_}=${_}${name}[k]`;
};

function getInteropBlock(dependencies, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, indent, snippets) {
    const { _, cnst, n } = snippets;
    const neededInteropHelpers = new Set();
    const interopStatements = [];
    const addInteropStatement = (helperVariableName, helper, dependencyVariableName) => {
        neededInteropHelpers.add(helper);
        interopStatements.push(`${cnst} ${helperVariableName}${_}=${_}/*#__PURE__*/${helper}(${dependencyVariableName});`);
    };
    for (const { defaultVariableName, imports, id, isChunk, name, namedExportsMode, namespaceVariableName, reexports } of dependencies) {
        if (isChunk) {
            for (const { imported, reexported } of [
                ...(imports || []),
                ...(reexports || [])
            ]) {
                if (imported === '*' && reexported !== '*') {
                    if (!namedExportsMode) {
                        addInteropStatement(namespaceVariableName, INTEROP_NAMESPACE_DEFAULT_ONLY_VARIABLE, name);
                    }
                    break;
                }
            }
        }
        else {
            const moduleInterop = String(interop(id));
            let hasDefault = false;
            let hasNamespace = false;
            for (const { imported, reexported } of [
                ...(imports || []),
                ...(reexports || [])
            ]) {
                let helper;
                let variableName;
                if (imported === 'default') {
                    if (!hasDefault) {
                        hasDefault = true;
                        if (defaultVariableName !== namespaceVariableName) {
                            variableName = defaultVariableName;
                            helper = defaultInteropHelpersByInteropType[moduleInterop];
                        }
                    }
                }
                else if (imported === '*' && reexported !== '*') {
                    if (!hasNamespace) {
                        hasNamespace = true;
                        helper = namespaceInteropHelpersByInteropType[moduleInterop];
                        variableName = namespaceVariableName;
                    }
                }
                if (helper) {
                    addInteropStatement(variableName, helper, name);
                }
            }
        }
    }
    return `${getHelpersBlock(neededInteropHelpers, accessedGlobals, indent, snippets, externalLiveBindings, freeze, namespaceToStringTag)}${interopStatements.length > 0 ? `${interopStatements.join(n)}${n}${n}` : ''}`;
}

function addJsExtension(name) {
    return name.endsWith('.js') ? name : name + '.js';
}

// AMD resolution will only respect the AMD baseUrl if the .js extension is omitted.
// The assumption is that this makes sense for all relative ids:
// https://requirejs.org/docs/api.html#jsfiles
function updateExtensionForRelativeAmdId(id, forceJsExtensionForImports) {
    if (id[0] !== '.') {
        return id;
    }
    return forceJsExtensionForImports ? addJsExtension(id) : removeJsExtension(id);
}

const builtins = {
    assert: true,
    buffer: true,
    console: true,
    constants: true,
    domain: true,
    events: true,
    http: true,
    https: true,
    os: true,
    path: true,
    process: true,
    punycode: true,
    querystring: true,
    stream: true,
    string_decoder: true,
    timers: true,
    tty: true,
    url: true,
    util: true,
    vm: true,
    zlib: true
};
function warnOnBuiltins(warn, dependencies) {
    const externalBuiltins = dependencies.map(({ id }) => id).filter(id => id in builtins);
    if (!externalBuiltins.length)
        return;
    warn({
        code: 'MISSING_NODE_BUILTINS',
        message: `Creating a browser bundle that depends on Node.js built-in modules (${printQuotedStringList(externalBuiltins)}). You might need to include https://github.com/FredKSchott/rollup-plugin-polyfill-node`,
        modules: externalBuiltins
    });
}

function amd(magicString, { accessedGlobals, dependencies, exports, hasExports, id, indent: t, intro, isEntryFacade, isModuleFacade, namedExportsMode, outro, snippets, warn }, { amd, esModule, externalLiveBindings, freeze, interop, namespaceToStringTag, strict }) {
    warnOnBuiltins(warn, dependencies);
    const deps = dependencies.map(m => `'${updateExtensionForRelativeAmdId(m.id, amd.forceJsExtensionForImports)}'`);
    const args = dependencies.map(m => m.name);
    const { n, getNonArrowFunctionIntro, _ } = snippets;
    if (namedExportsMode && hasExports) {
        args.unshift(`exports`);
        deps.unshift(`'exports'`);
    }
    if (accessedGlobals.has('require')) {
        args.unshift('require');
        deps.unshift(`'require'`);
    }
    if (accessedGlobals.has('module')) {
        args.unshift('module');
        deps.unshift(`'module'`);
    }
    const completeAmdId = getCompleteAmdId(amd, id);
    const params = (completeAmdId ? `'${completeAmdId}',${_}` : ``) +
        (deps.length ? `[${deps.join(`,${_}`)}],${_}` : ``);
    const useStrict = strict ? `${_}'use strict';` : '';
    magicString.prepend(`${intro}${getInteropBlock(dependencies, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, t, snippets)}`);
    const exportBlock = getExportBlock$1(exports, dependencies, namedExportsMode, interop, snippets, t, externalLiveBindings);
    let namespaceMarkers = getNamespaceMarkers(namedExportsMode && hasExports, isEntryFacade && esModule, isModuleFacade && namespaceToStringTag, snippets);
    if (namespaceMarkers) {
        namespaceMarkers = n + n + namespaceMarkers;
    }
    magicString.append(`${exportBlock}${namespaceMarkers}${outro}`);
    return (magicString
        .indent(t)
        // factory function should be wrapped by parentheses to avoid lazy parsing,
        // cf. https://v8.dev/blog/preparser#pife
        .prepend(`${amd.define}(${params}(${getNonArrowFunctionIntro(args, {
        isAsync: false,
        name: null
    })}{${useStrict}${n}${n}`)
        .append(`${n}${n}}));`));
}

function cjs(magicString, { accessedGlobals, dependencies, exports, hasExports, indent: t, intro, isEntryFacade, isModuleFacade, namedExportsMode, outro, snippets }, { compact, esModule, externalLiveBindings, freeze, interop, namespaceToStringTag, strict }) {
    const { _, n } = snippets;
    const useStrict = strict ? `'use strict';${n}${n}` : '';
    let namespaceMarkers = getNamespaceMarkers(namedExportsMode && hasExports, isEntryFacade && esModule, isModuleFacade && namespaceToStringTag, snippets);
    if (namespaceMarkers) {
        namespaceMarkers += n + n;
    }
    const importBlock = getImportBlock$1(dependencies, snippets, compact);
    const interopBlock = getInteropBlock(dependencies, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, t, snippets);
    magicString.prepend(`${useStrict}${intro}${namespaceMarkers}${importBlock}${interopBlock}`);
    const exportBlock = getExportBlock$1(exports, dependencies, namedExportsMode, interop, snippets, t, externalLiveBindings, `module.exports${_}=${_}`);
    return magicString.append(`${exportBlock}${outro}`);
}
function getImportBlock$1(dependencies, { _, cnst, n }, compact) {
    let importBlock = '';
    let definingVariable = false;
    for (const { id, name, reexports, imports } of dependencies) {
        if (!reexports && !imports) {
            if (importBlock) {
                importBlock += compact && !definingVariable ? ',' : `;${n}`;
            }
            definingVariable = false;
            importBlock += `require('${id}')`;
        }
        else {
            importBlock += compact && definingVariable ? ',' : `${importBlock ? `;${n}` : ''}${cnst} `;
            definingVariable = true;
            importBlock += `${name}${_}=${_}require('${id}')`;
        }
    }
    if (importBlock) {
        return `${importBlock};${n}${n}`;
    }
    return '';
}

function es(magicString, { accessedGlobals, indent: t, intro, outro, dependencies, exports, snippets }, { externalLiveBindings, freeze, namespaceToStringTag }) {
    const { _, n } = snippets;
    const importBlock = getImportBlock(dependencies, _);
    if (importBlock.length > 0)
        intro += importBlock.join(n) + n + n;
    intro += getHelpersBlock(null, accessedGlobals, t, snippets, externalLiveBindings, freeze, namespaceToStringTag);
    if (intro)
        magicString.prepend(intro);
    const exportBlock = getExportBlock(exports, snippets);
    if (exportBlock.length)
        magicString.append(n + n + exportBlock.join(n).trim());
    if (outro)
        magicString.append(outro);
    return magicString.trim();
}
function getImportBlock(dependencies, _) {
    const importBlock = [];
    for (const { id, reexports, imports, name } of dependencies) {
        if (!reexports && !imports) {
            importBlock.push(`import${_}'${id}';`);
            continue;
        }
        if (imports) {
            let defaultImport = null;
            let starImport = null;
            const importedNames = [];
            for (const specifier of imports) {
                if (specifier.imported === 'default') {
                    defaultImport = specifier;
                }
                else if (specifier.imported === '*') {
                    starImport = specifier;
                }
                else {
                    importedNames.push(specifier);
                }
            }
            if (starImport) {
                importBlock.push(`import${_}*${_}as ${starImport.local} from${_}'${id}';`);
            }
            if (defaultImport && importedNames.length === 0) {
                importBlock.push(`import ${defaultImport.local} from${_}'${id}';`);
            }
            else if (importedNames.length > 0) {
                importBlock.push(`import ${defaultImport ? `${defaultImport.local},${_}` : ''}{${_}${importedNames
                    .map(specifier => {
                    if (specifier.imported === specifier.local) {
                        return specifier.imported;
                    }
                    else {
                        return `${specifier.imported} as ${specifier.local}`;
                    }
                })
                    .join(`,${_}`)}${_}}${_}from${_}'${id}';`);
            }
        }
        if (reexports) {
            let starExport = null;
            const namespaceReexports = [];
            const namedReexports = [];
            for (const specifier of reexports) {
                if (specifier.reexported === '*') {
                    starExport = specifier;
                }
                else if (specifier.imported === '*') {
                    namespaceReexports.push(specifier);
                }
                else {
                    namedReexports.push(specifier);
                }
            }
            if (starExport) {
                importBlock.push(`export${_}*${_}from${_}'${id}';`);
            }
            if (namespaceReexports.length > 0) {
                if (!imports ||
                    !imports.some(specifier => specifier.imported === '*' && specifier.local === name)) {
                    importBlock.push(`import${_}*${_}as ${name} from${_}'${id}';`);
                }
                for (const specifier of namespaceReexports) {
                    importBlock.push(`export${_}{${_}${name === specifier.reexported ? name : `${name} as ${specifier.reexported}`} };`);
                }
            }
            if (namedReexports.length > 0) {
                importBlock.push(`export${_}{${_}${namedReexports
                    .map(specifier => {
                    if (specifier.imported === specifier.reexported) {
                        return specifier.imported;
                    }
                    else {
                        return `${specifier.imported} as ${specifier.reexported}`;
                    }
                })
                    .join(`,${_}`)}${_}}${_}from${_}'${id}';`);
            }
        }
    }
    return importBlock;
}
function getExportBlock(exports, { _, cnst }) {
    const exportBlock = [];
    const exportDeclaration = [];
    for (const specifier of exports) {
        if (specifier.expression) {
            exportBlock.push(`${cnst} ${specifier.local}${_}=${_}${specifier.expression};`);
        }
        exportDeclaration.push(specifier.exported === specifier.local
            ? specifier.local
            : `${specifier.local} as ${specifier.exported}`);
    }
    if (exportDeclaration.length) {
        exportBlock.push(`export${_}{${_}${exportDeclaration.join(`,${_}`)}${_}};`);
    }
    return exportBlock;
}

const keypath = (keypath, getPropertyAccess) => keypath.split('.').map(getPropertyAccess).join('');

function setupNamespace(name, root, globals, { _, getPropertyAccess, s }, compact) {
    const parts = name.split('.');
    parts[0] = (typeof globals === 'function' ? globals(parts[0]) : globals[parts[0]]) || parts[0];
    parts.pop();
    let propertyPath = root;
    return (parts
        .map(part => {
        propertyPath += getPropertyAccess(part);
        return `${propertyPath}${_}=${_}${propertyPath}${_}||${_}{}${s}`;
    })
        .join(compact ? ',' : '\n') + (compact && parts.length ? ';' : '\n'));
}
function assignToDeepVariable(deepName, root, globals, assignment, { _, getPropertyAccess }) {
    const parts = deepName.split('.');
    parts[0] = (typeof globals === 'function' ? globals(parts[0]) : globals[parts[0]]) || parts[0];
    const last = parts.pop();
    let propertyPath = root;
    let deepAssignment = parts
        .map(part => {
        propertyPath += getPropertyAccess(part);
        return `${propertyPath}${_}=${_}${propertyPath}${_}||${_}{}`;
    })
        .concat(`${propertyPath}${getPropertyAccess(last)}`)
        .join(`,${_}`) + `${_}=${_}${assignment}`;
    if (parts.length > 0) {
        deepAssignment = `(${deepAssignment})`;
    }
    return deepAssignment;
}

function trimEmptyImports(dependencies) {
    let i = dependencies.length;
    while (i--) {
        const { imports, reexports } = dependencies[i];
        if (imports || reexports) {
            return dependencies.slice(0, i + 1);
        }
    }
    return [];
}

function iife(magicString, { accessedGlobals, dependencies, exports, hasExports, indent: t, intro, namedExportsMode, outro, snippets, warn }, { compact, esModule, extend, freeze, externalLiveBindings, globals, interop, name, namespaceToStringTag, strict }) {
    const { _, getNonArrowFunctionIntro, getPropertyAccess, n } = snippets;
    const isNamespaced = name && name.includes('.');
    const useVariableAssignment = !extend && !isNamespaced;
    if (name && useVariableAssignment && !isLegal(name)) {
        return error({
            code: 'ILLEGAL_IDENTIFIER_AS_NAME',
            message: `Given name "${name}" is not a legal JS identifier. If you need this, you can try "output.extend: true".`
        });
    }
    warnOnBuiltins(warn, dependencies);
    const external = trimEmptyImports(dependencies);
    const deps = external.map(dep => dep.globalName || 'null');
    const args = external.map(m => m.name);
    if (hasExports && !name) {
        warn({
            code: 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT',
            message: `If you do not supply "output.name", you may not be able to access the exports of an IIFE bundle.`
        });
    }
    if (namedExportsMode && hasExports) {
        if (extend) {
            deps.unshift(`this${keypath(name, getPropertyAccess)}${_}=${_}this${keypath(name, getPropertyAccess)}${_}||${_}{}`);
            args.unshift('exports');
        }
        else {
            deps.unshift('{}');
            args.unshift('exports');
        }
    }
    const useStrict = strict ? `${t}'use strict';${n}` : '';
    const interopBlock = getInteropBlock(dependencies, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, t, snippets);
    magicString.prepend(`${intro}${interopBlock}`);
    let wrapperIntro = `(${getNonArrowFunctionIntro(args, {
        isAsync: false,
        name: null
    })}{${n}${useStrict}${n}`;
    if (hasExports) {
        if (name && !(extend && namedExportsMode)) {
            wrapperIntro =
                (useVariableAssignment ? `var ${name}` : `this${keypath(name, getPropertyAccess)}`) +
                    `${_}=${_}${wrapperIntro}`;
        }
        if (isNamespaced) {
            wrapperIntro = setupNamespace(name, 'this', globals, snippets, compact) + wrapperIntro;
        }
    }
    let wrapperOutro = `${n}${n}})(${deps.join(`,${_}`)});`;
    if (hasExports && !extend && namedExportsMode) {
        wrapperOutro = `${n}${n}${t}return exports;${wrapperOutro}`;
    }
    const exportBlock = getExportBlock$1(exports, dependencies, namedExportsMode, interop, snippets, t, externalLiveBindings);
    let namespaceMarkers = getNamespaceMarkers(namedExportsMode && hasExports, esModule, namespaceToStringTag, snippets);
    if (namespaceMarkers) {
        namespaceMarkers = n + n + namespaceMarkers;
    }
    magicString.append(`${exportBlock}${namespaceMarkers}${outro}`);
    return magicString.indent(t).prepend(wrapperIntro).append(wrapperOutro);
}

function system(magicString, { accessedGlobals, dependencies, exports, hasExports, indent: t, intro, snippets, outro, usesTopLevelAwait }, { externalLiveBindings, freeze, name, namespaceToStringTag, strict, systemNullSetters }) {
    const { _, getFunctionIntro, getNonArrowFunctionIntro, n, s } = snippets;
    const { importBindings, setters, starExcludes } = analyzeDependencies(dependencies, exports, t, snippets);
    const registeredName = name ? `'${name}',${_}` : '';
    const wrapperParams = accessedGlobals.has('module')
        ? ['exports', 'module']
        : hasExports
            ? ['exports']
            : [];
    // factory function should be wrapped by parentheses to avoid lazy parsing,
    // cf. https://v8.dev/blog/preparser#pife
    let wrapperStart = `System.register(${registeredName}[` +
        dependencies.map(({ id }) => `'${id}'`).join(`,${_}`) +
        `],${_}(${getNonArrowFunctionIntro(wrapperParams, { isAsync: false, name: null })}{${n}${t}${strict ? "'use strict';" : ''}` +
        getStarExcludesBlock(starExcludes, t, snippets) +
        getImportBindingsBlock(importBindings, t, snippets) +
        `${n}${t}return${_}{${setters.length
            ? `${n}${t}${t}setters:${_}[${setters
                .map(setter => setter
                ? `${getFunctionIntro(['module'], {
                    isAsync: false,
                    name: null
                })}{${n}${t}${t}${t}${setter}${n}${t}${t}}`
                : systemNullSetters
                    ? `null`
                    : `${getFunctionIntro([], { isAsync: false, name: null })}{}`)
                .join(`,${_}`)}],`
            : ''}${n}`;
    wrapperStart += `${t}${t}execute:${_}(${getNonArrowFunctionIntro([], {
        isAsync: usesTopLevelAwait,
        name: null
    })}{${n}${n}`;
    const wrapperEnd = `${t}${t}})${n}${t}}${s}${n}}));`;
    magicString.prepend(intro +
        getHelpersBlock(null, accessedGlobals, t, snippets, externalLiveBindings, freeze, namespaceToStringTag) +
        getHoistedExportsBlock(exports, t, snippets));
    magicString.append(`${outro}${n}${n}` +
        getSyntheticExportsBlock(exports, t, snippets) +
        getMissingExportsBlock(exports, t, snippets));
    return magicString.indent(`${t}${t}${t}`).append(wrapperEnd).prepend(wrapperStart);
}
function analyzeDependencies(dependencies, exports, t, { _, cnst, getObject, getPropertyAccess, n }) {
    const importBindings = [];
    const setters = [];
    let starExcludes = null;
    for (const { imports, reexports } of dependencies) {
        const setter = [];
        if (imports) {
            for (const specifier of imports) {
                importBindings.push(specifier.local);
                if (specifier.imported === '*') {
                    setter.push(`${specifier.local}${_}=${_}module;`);
                }
                else {
                    setter.push(`${specifier.local}${_}=${_}module${getPropertyAccess(specifier.imported)};`);
                }
            }
        }
        if (reexports) {
            const reexportedNames = [];
            let hasStarReexport = false;
            for (const { imported, reexported } of reexports) {
                if (reexported === '*') {
                    hasStarReexport = true;
                }
                else {
                    reexportedNames.push([
                        reexported,
                        imported === '*' ? 'module' : `module${getPropertyAccess(imported)}`
                    ]);
                }
            }
            if (reexportedNames.length > 1 || hasStarReexport) {
                const exportMapping = getObject(reexportedNames, { lineBreakIndent: null });
                if (hasStarReexport) {
                    if (!starExcludes) {
                        starExcludes = getStarExcludes({ dependencies, exports });
                    }
                    setter.push(`${cnst} setter${_}=${_}${exportMapping};`, `for${_}(${cnst} name in module)${_}{`, `${t}if${_}(!_starExcludes[name])${_}setter[name]${_}=${_}module[name];`, '}', 'exports(setter);');
                }
                else {
                    setter.push(`exports(${exportMapping});`);
                }
            }
            else {
                const [key, value] = reexportedNames[0];
                setter.push(`exports('${key}',${_}${value});`);
            }
        }
        setters.push(setter.join(`${n}${t}${t}${t}`));
    }
    return { importBindings, setters, starExcludes };
}
const getStarExcludes = ({ dependencies, exports }) => {
    const starExcludes = new Set(exports.map(expt => expt.exported));
    starExcludes.add('default');
    for (const { reexports } of dependencies) {
        if (reexports) {
            for (const reexport of reexports) {
                if (reexport.reexported !== '*')
                    starExcludes.add(reexport.reexported);
            }
        }
    }
    return starExcludes;
};
const getStarExcludesBlock = (starExcludes, t, { _, cnst, getObject, n }) => starExcludes
    ? `${n}${t}${cnst} _starExcludes${_}=${_}${getObject([...starExcludes].map(prop => [prop, '1']), { lineBreakIndent: { base: t, t } })};`
    : '';
const getImportBindingsBlock = (importBindings, t, { _, n }) => (importBindings.length ? `${n}${t}var ${importBindings.join(`,${_}`)};` : '');
const getHoistedExportsBlock = (exports, t, snippets) => getExportsBlock(exports.filter(expt => expt.hoisted).map(expt => ({ name: expt.exported, value: expt.local })), t, snippets);
function getExportsBlock(exports, t, { _, n }) {
    if (exports.length === 0) {
        return '';
    }
    if (exports.length === 1) {
        return `exports('${exports[0].name}',${_}${exports[0].value});${n}${n}`;
    }
    return (`exports({${n}` +
        exports.map(({ name, value }) => `${t}${name}:${_}${value}`).join(`,${n}`) +
        `${n}});${n}${n}`);
}
const getSyntheticExportsBlock = (exports, t, snippets) => getExportsBlock(exports
    .filter(expt => expt.expression)
    .map(expt => ({ name: expt.exported, value: expt.local })), t, snippets);
const getMissingExportsBlock = (exports, t, snippets) => getExportsBlock(exports
    .filter(expt => expt.local === MISSING_EXPORT_SHIM_VARIABLE)
    .map(expt => ({ name: expt.exported, value: MISSING_EXPORT_SHIM_VARIABLE })), t, snippets);

function globalProp(name, globalVar, getPropertyAccess) {
    if (!name)
        return 'null';
    return `${globalVar}${keypath(name, getPropertyAccess)}`;
}
function safeAccess(name, globalVar, { _, getPropertyAccess }) {
    let propertyPath = globalVar;
    return name
        .split('.')
        .map(part => (propertyPath += getPropertyAccess(part)))
        .join(`${_}&&${_}`);
}
function umd(magicString, { accessedGlobals, dependencies, exports, hasExports, id, indent: t, intro, namedExportsMode, outro, snippets, warn }, { amd, compact, esModule, extend, externalLiveBindings, freeze, interop, name, namespaceToStringTag, globals, noConflict, strict }) {
    const { _, cnst, getFunctionIntro, getNonArrowFunctionIntro, getPropertyAccess, n, s } = snippets;
    const factoryVar = compact ? 'f' : 'factory';
    const globalVar = compact ? 'g' : 'global';
    if (hasExports && !name) {
        return error({
            code: 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT',
            message: 'You must supply "output.name" for UMD bundles that have exports so that the exports are accessible in environments without a module loader.'
        });
    }
    warnOnBuiltins(warn, dependencies);
    const amdDeps = dependencies.map(m => `'${updateExtensionForRelativeAmdId(m.id, amd.forceJsExtensionForImports)}'`);
    const cjsDeps = dependencies.map(m => `require('${m.id}')`);
    const trimmedImports = trimEmptyImports(dependencies);
    const globalDeps = trimmedImports.map(module => globalProp(module.globalName, globalVar, getPropertyAccess));
    const factoryParams = trimmedImports.map(m => m.name);
    if (namedExportsMode && (hasExports || noConflict)) {
        amdDeps.unshift(`'exports'`);
        cjsDeps.unshift(`exports`);
        globalDeps.unshift(assignToDeepVariable(name, globalVar, globals, `${extend ? `${globalProp(name, globalVar, getPropertyAccess)}${_}||${_}` : ''}{}`, snippets));
        factoryParams.unshift('exports');
    }
    const completeAmdId = getCompleteAmdId(amd, id);
    const amdParams = (completeAmdId ? `'${completeAmdId}',${_}` : ``) +
        (amdDeps.length ? `[${amdDeps.join(`,${_}`)}],${_}` : ``);
    const define = amd.define;
    const cjsExport = !namedExportsMode && hasExports ? `module.exports${_}=${_}` : ``;
    const useStrict = strict ? `${_}'use strict';${n}` : ``;
    let iifeExport;
    if (noConflict) {
        const noConflictExportsVar = compact ? 'e' : 'exports';
        let factory;
        if (!namedExportsMode && hasExports) {
            factory = `${cnst} ${noConflictExportsVar}${_}=${_}${assignToDeepVariable(name, globalVar, globals, `${factoryVar}(${globalDeps.join(`,${_}`)})`, snippets)};`;
        }
        else {
            const module = globalDeps.shift();
            factory =
                `${cnst} ${noConflictExportsVar}${_}=${_}${module};${n}` +
                    `${t}${t}${factoryVar}(${[noConflictExportsVar].concat(globalDeps).join(`,${_}`)});`;
        }
        iifeExport =
            `(${getFunctionIntro([], { isAsync: false, name: null })}{${n}` +
                `${t}${t}${cnst} current${_}=${_}${safeAccess(name, globalVar, snippets)};${n}` +
                `${t}${t}${factory}${n}` +
                `${t}${t}${noConflictExportsVar}.noConflict${_}=${_}${getFunctionIntro([], {
                    isAsync: false,
                    name: null
                })}{${_}` +
                `${globalProp(name, globalVar, getPropertyAccess)}${_}=${_}current;${_}return ${noConflictExportsVar}${s}${_}};${n}` +
                `${t}})()`;
    }
    else {
        iifeExport = `${factoryVar}(${globalDeps.join(`,${_}`)})`;
        if (!namedExportsMode && hasExports) {
            iifeExport = assignToDeepVariable(name, globalVar, globals, iifeExport, snippets);
        }
    }
    const iifeNeedsGlobal = hasExports || (noConflict && namedExportsMode) || globalDeps.length > 0;
    const wrapperParams = [factoryVar];
    if (iifeNeedsGlobal) {
        wrapperParams.unshift(globalVar);
    }
    const globalArg = iifeNeedsGlobal ? `this,${_}` : '';
    const iifeStart = iifeNeedsGlobal
        ? `(${globalVar}${_}=${_}typeof globalThis${_}!==${_}'undefined'${_}?${_}globalThis${_}:${_}${globalVar}${_}||${_}self,${_}`
        : '';
    const iifeEnd = iifeNeedsGlobal ? ')' : '';
    const cjsIntro = iifeNeedsGlobal
        ? `${t}typeof exports${_}===${_}'object'${_}&&${_}typeof module${_}!==${_}'undefined'${_}?` +
            `${_}${cjsExport}${factoryVar}(${cjsDeps.join(`,${_}`)})${_}:${n}`
        : '';
    const wrapperIntro = `(${getNonArrowFunctionIntro(wrapperParams, { isAsync: false, name: null })}{${n}` +
        cjsIntro +
        `${t}typeof ${define}${_}===${_}'function'${_}&&${_}${define}.amd${_}?${_}${define}(${amdParams}${factoryVar})${_}:${n}` +
        `${t}${iifeStart}${iifeExport}${iifeEnd};${n}` +
        // factory function should be wrapped by parentheses to avoid lazy parsing,
        // cf. https://v8.dev/blog/preparser#pife
        `})(${globalArg}(${getNonArrowFunctionIntro(factoryParams, {
            isAsync: false,
            name: null
        })}{${useStrict}${n}`;
    const wrapperOutro = n + n + '}));';
    magicString.prepend(`${intro}${getInteropBlock(dependencies, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, t, snippets)}`);
    const exportBlock = getExportBlock$1(exports, dependencies, namedExportsMode, interop, snippets, t, externalLiveBindings);
    let namespaceMarkers = getNamespaceMarkers(namedExportsMode && hasExports, esModule, namespaceToStringTag, snippets);
    if (namespaceMarkers) {
        namespaceMarkers = n + n + namespaceMarkers;
    }
    magicString.append(`${exportBlock}${namespaceMarkers}${outro}`);
    return magicString.trim().indent(t).append(wrapperOutro).prepend(wrapperIntro);
}

const finalisers = { amd, cjs, es, iife, system, umd };

class Source {
    constructor(filename, content) {
        this.isOriginal = true;
        this.filename = filename;
        this.content = content;
    }
    traceSegment(line, column, name) {
        return { column, line, name, source: this };
    }
}
class Link {
    constructor(map, sources) {
        this.sources = sources;
        this.names = map.names;
        this.mappings = map.mappings;
    }
    traceMappings() {
        const sources = [];
        const sourceIndexMap = new Map();
        const sourcesContent = [];
        const names = [];
        const nameIndexMap = new Map();
        const mappings = [];
        for (const line of this.mappings) {
            const tracedLine = [];
            for (const segment of line) {
                if (segment.length === 1)
                    continue;
                const source = this.sources[segment[1]];
                if (!source)
                    continue;
                const traced = source.traceSegment(segment[2], segment[3], segment.length === 5 ? this.names[segment[4]] : '');
                if (traced) {
                    const { column, line, name, source: { content, filename } } = traced;
                    let sourceIndex = sourceIndexMap.get(filename);
                    if (sourceIndex === undefined) {
                        sourceIndex = sources.length;
                        sources.push(filename);
                        sourceIndexMap.set(filename, sourceIndex);
                        sourcesContent[sourceIndex] = content;
                    }
                    else if (sourcesContent[sourceIndex] == null) {
                        sourcesContent[sourceIndex] = content;
                    }
                    else if (content != null && sourcesContent[sourceIndex] !== content) {
                        return error({
                            message: `Multiple conflicting contents for sourcemap source ${filename}`
                        });
                    }
                    const tracedSegment = [segment[0], sourceIndex, line, column];
                    if (name) {
                        let nameIndex = nameIndexMap.get(name);
                        if (nameIndex === undefined) {
                            nameIndex = names.length;
                            names.push(name);
                            nameIndexMap.set(name, nameIndex);
                        }
                        tracedSegment[4] = nameIndex;
                    }
                    tracedLine.push(tracedSegment);
                }
            }
            mappings.push(tracedLine);
        }
        return { mappings, names, sources, sourcesContent };
    }
    traceSegment(line, column, name) {
        const segments = this.mappings[line];
        if (!segments)
            return null;
        // binary search through segments for the given column
        let searchStart = 0;
        let searchEnd = segments.length - 1;
        while (searchStart <= searchEnd) {
            const m = (searchStart + searchEnd) >> 1;
            const segment = segments[m];
            // If a sourcemap does not have sufficient resolution to contain a
            // necessary mapping, e.g. because it only contains line information, we
            // use the best approximation we could find
            if (segment[0] === column || searchStart === searchEnd) {
                if (segment.length == 1)
                    return null;
                const source = this.sources[segment[1]];
                if (!source)
                    return null;
                return source.traceSegment(segment[2], segment[3], segment.length === 5 ? this.names[segment[4]] : name);
            }
            if (segment[0] > column) {
                searchEnd = m - 1;
            }
            else {
                searchStart = m + 1;
            }
        }
        return null;
    }
}
function getLinkMap(warn) {
    return function linkMap(source, map) {
        if (map.mappings) {
            return new Link(map, [source]);
        }
        warn({
            code: 'SOURCEMAP_BROKEN',
            message: `Sourcemap is likely to be incorrect: a plugin (${map.plugin}) was used to transform ` +
                "files, but didn't generate a sourcemap for the transformation. Consult the plugin " +
                'documentation for help',
            plugin: map.plugin,
            url: `https://rollupjs.org/guide/en/#warning-sourcemap-is-likely-to-be-incorrect`
        });
        return new Link({
            mappings: [],
            names: []
        }, [source]);
    };
}
function getCollapsedSourcemap(id, originalCode, originalSourcemap, sourcemapChain, linkMap) {
    let source;
    if (!originalSourcemap) {
        source = new Source(id, originalCode);
    }
    else {
        const sources = originalSourcemap.sources;
        const sourcesContent = originalSourcemap.sourcesContent || [];
        const directory = require$$0.dirname(id) || '.';
        const sourceRoot = originalSourcemap.sourceRoot || '.';
        const baseSources = sources.map((source, i) => new Source(require$$0.resolve(directory, sourceRoot, source), sourcesContent[i]));
        source = new Link(originalSourcemap, baseSources);
    }
    return sourcemapChain.reduce(linkMap, source);
}
function collapseSourcemaps(file, map, modules, bundleSourcemapChain, excludeContent, warn) {
    const linkMap = getLinkMap(warn);
    const moduleSources = modules
        .filter(module => !module.excludeFromSourcemap)
        .map(module => getCollapsedSourcemap(module.id, module.originalCode, module.originalSourcemap, module.sourcemapChain, linkMap));
    const link = new Link(map, moduleSources);
    const source = bundleSourcemapChain.reduce(linkMap, link);
    let { sources, sourcesContent, names, mappings } = source.traceMappings();
    if (file) {
        const directory = require$$0.dirname(file);
        sources = sources.map((source) => require$$0.relative(directory, source));
        file = require$$0.basename(file);
    }
    sourcesContent = (excludeContent ? null : sourcesContent);
    return new SourceMap({ file, mappings, names, sources, sourcesContent });
}
function collapseSourcemap(id, originalCode, originalSourcemap, sourcemapChain, warn) {
    if (!sourcemapChain.length) {
        return originalSourcemap;
    }
    const source = getCollapsedSourcemap(id, originalCode, originalSourcemap, sourcemapChain, getLinkMap(warn));
    const map = source.traceMappings();
    return { version: 3, ...map };
}

const createHash = () => crypto.createHash('sha256');

const DECONFLICT_IMPORTED_VARIABLES_BY_FORMAT = {
    amd: deconflictImportsOther,
    cjs: deconflictImportsOther,
    es: deconflictImportsEsmOrSystem,
    iife: deconflictImportsOther,
    system: deconflictImportsEsmOrSystem,
    umd: deconflictImportsOther
};
function deconflictChunk(modules, dependenciesToBeDeconflicted, imports, usedNames, format, interop, preserveModules, externalLiveBindings, chunkByModule, syntheticExports, exportNamesByVariable, accessedGlobalsByScope, includedNamespaces) {
    const reversedModules = modules.slice().reverse();
    for (const module of reversedModules) {
        module.scope.addUsedOutsideNames(usedNames, format, exportNamesByVariable, accessedGlobalsByScope);
    }
    deconflictTopLevelVariables(usedNames, reversedModules, includedNamespaces);
    DECONFLICT_IMPORTED_VARIABLES_BY_FORMAT[format](usedNames, imports, dependenciesToBeDeconflicted, interop, preserveModules, externalLiveBindings, chunkByModule, syntheticExports);
    for (const module of reversedModules) {
        module.scope.deconflict(format, exportNamesByVariable, accessedGlobalsByScope);
    }
}
function deconflictImportsEsmOrSystem(usedNames, imports, dependenciesToBeDeconflicted, _interop, preserveModules, _externalLiveBindings, chunkByModule, syntheticExports) {
    // This is needed for namespace reexports
    for (const dependency of dependenciesToBeDeconflicted.dependencies) {
        if (preserveModules || dependency instanceof ExternalModule) {
            dependency.variableName = getSafeName(dependency.suggestedVariableName, usedNames);
        }
    }
    for (const variable of imports) {
        const module = variable.module;
        const name = variable.name;
        if (variable.isNamespace && (preserveModules || module instanceof ExternalModule)) {
            variable.setRenderNames(null, (module instanceof ExternalModule ? module : chunkByModule.get(module)).variableName);
        }
        else if (module instanceof ExternalModule && name === 'default') {
            variable.setRenderNames(null, getSafeName([...module.exportedVariables].some(([exportedVariable, exportedName]) => exportedName === '*' && exportedVariable.included)
                ? module.suggestedVariableName + '__default'
                : module.suggestedVariableName, usedNames));
        }
        else {
            variable.setRenderNames(null, getSafeName(name, usedNames));
        }
    }
    for (const variable of syntheticExports) {
        variable.setRenderNames(null, getSafeName(variable.name, usedNames));
    }
}
function deconflictImportsOther(usedNames, imports, { deconflictedDefault, deconflictedNamespace, dependencies }, interop, preserveModules, externalLiveBindings, chunkByModule) {
    for (const chunkOrExternalModule of dependencies) {
        chunkOrExternalModule.variableName = getSafeName(chunkOrExternalModule.suggestedVariableName, usedNames);
    }
    for (const externalModuleOrChunk of deconflictedNamespace) {
        externalModuleOrChunk.namespaceVariableName = getSafeName(`${externalModuleOrChunk.suggestedVariableName}__namespace`, usedNames);
    }
    for (const externalModule of deconflictedDefault) {
        if (deconflictedNamespace.has(externalModule) &&
            canDefaultBeTakenFromNamespace(String(interop(externalModule.id)), externalLiveBindings)) {
            externalModule.defaultVariableName = externalModule.namespaceVariableName;
        }
        else {
            externalModule.defaultVariableName = getSafeName(`${externalModule.suggestedVariableName}__default`, usedNames);
        }
    }
    for (const variable of imports) {
        const module = variable.module;
        if (module instanceof ExternalModule) {
            const name = variable.name;
            if (name === 'default') {
                const moduleInterop = String(interop(module.id));
                const variableName = defaultInteropHelpersByInteropType[moduleInterop]
                    ? module.defaultVariableName
                    : module.variableName;
                if (isDefaultAProperty(moduleInterop, externalLiveBindings)) {
                    variable.setRenderNames(variableName, 'default');
                }
                else {
                    variable.setRenderNames(null, variableName);
                }
            }
            else if (name === '*') {
                variable.setRenderNames(null, namespaceInteropHelpersByInteropType[String(interop(module.id))]
                    ? module.namespaceVariableName
                    : module.variableName);
            }
            else {
                // if the second parameter is `null`, it uses its "name" for the property name
                variable.setRenderNames(module.variableName, null);
            }
        }
        else {
            const chunk = chunkByModule.get(module);
            if (preserveModules && variable.isNamespace) {
                variable.setRenderNames(null, chunk.exportMode === 'default' ? chunk.namespaceVariableName : chunk.variableName);
            }
            else if (chunk.exportMode === 'default') {
                variable.setRenderNames(null, chunk.variableName);
            }
            else {
                variable.setRenderNames(chunk.variableName, chunk.getVariableExportName(variable));
            }
        }
    }
}
function deconflictTopLevelVariables(usedNames, modules, includedNamespaces) {
    for (const module of modules) {
        for (const variable of module.scope.variables.values()) {
            if (variable.included &&
                // this will only happen for exports in some formats
                !(variable.renderBaseName ||
                    (variable instanceof ExportDefaultVariable && variable.getOriginalVariable() !== variable))) {
                variable.setRenderNames(null, getSafeName(variable.name, usedNames));
            }
        }
        if (includedNamespaces.has(module)) {
            const namespace = module.namespace;
            namespace.setRenderNames(null, getSafeName(namespace.name, usedNames));
        }
    }
}

const needsEscapeRegEx = /[\\'\r\n\u2028\u2029]/;
const quoteNewlineRegEx = /(['\r\n\u2028\u2029])/g;
const backSlashRegEx = /\\/g;
function escapeId(id) {
    if (!id.match(needsEscapeRegEx))
        return id;
    return id.replace(backSlashRegEx, '\\\\').replace(quoteNewlineRegEx, '\\$1');
}

function assignExportsToMangledNames(exports, exportsByName, exportNamesByVariable) {
    let nameIndex = 0;
    for (const variable of exports) {
        let [exportName] = variable.name;
        if (exportsByName.has(exportName)) {
            do {
                exportName = toBase64(++nameIndex);
                // skip past leading number identifiers
                if (exportName.charCodeAt(0) === 49 /* '1' */) {
                    nameIndex += 9 * 64 ** (exportName.length - 1);
                    exportName = toBase64(nameIndex);
                }
            } while (RESERVED_NAMES$1.has(exportName) || exportsByName.has(exportName));
        }
        exportsByName.set(exportName, variable);
        exportNamesByVariable.set(variable, [exportName]);
    }
}
function assignExportsToNames(exports, exportsByName, exportNamesByVariable) {
    for (const variable of exports) {
        let nameIndex = 0;
        let exportName = variable.name;
        while (exportsByName.has(exportName)) {
            exportName = variable.name + '$' + ++nameIndex;
        }
        exportsByName.set(exportName, variable);
        exportNamesByVariable.set(variable, [exportName]);
    }
}

function getExportMode(chunk, { exports: exportMode, name, format }, unsetOptions, facadeModuleId, warn) {
    const exportKeys = chunk.getExportNames();
    if (exportMode === 'default') {
        if (exportKeys.length !== 1 || exportKeys[0] !== 'default') {
            return error(errIncompatibleExportOptionValue('default', exportKeys, facadeModuleId));
        }
    }
    else if (exportMode === 'none' && exportKeys.length) {
        return error(errIncompatibleExportOptionValue('none', exportKeys, facadeModuleId));
    }
    if (exportMode === 'auto') {
        if (exportKeys.length === 0) {
            exportMode = 'none';
        }
        else if (exportKeys.length === 1 && exportKeys[0] === 'default') {
            if (format === 'cjs' && unsetOptions.has('exports')) {
                warn(errPreferNamedExports(facadeModuleId));
            }
            exportMode = 'default';
        }
        else {
            if (format !== 'es' && format !== 'system' && exportKeys.includes('default')) {
                warn(errMixedExport(facadeModuleId, name));
            }
            exportMode = 'named';
        }
    }
    return exportMode;
}

function guessIndentString(code) {
    const lines = code.split('\n');
    const tabbed = lines.filter(line => /^\t+/.test(line));
    const spaced = lines.filter(line => /^ {2,}/.test(line));
    if (tabbed.length === 0 && spaced.length === 0) {
        return null;
    }
    // More lines tabbed than spaced? Assume tabs, and
    // default to tabs in the case of a tie (or nothing
    // to go on)
    if (tabbed.length >= spaced.length) {
        return '\t';
    }
    // Otherwise, we need to guess the multiple
    const min = spaced.reduce((previous, current) => {
        const numSpaces = /^ +/.exec(current)[0].length;
        return Math.min(numSpaces, previous);
    }, Infinity);
    return new Array(min + 1).join(' ');
}
function getIndentString(modules, options) {
    if (options.indent !== true)
        return options.indent;
    for (const module of modules) {
        const indent = guessIndentString(module.originalCode);
        if (indent !== null)
            return indent;
    }
    return '\t';
}

function getStaticDependencies(chunk, orderedModules, chunkByModule) {
    const staticDependencyBlocks = [];
    const handledDependencies = new Set();
    for (let modulePos = orderedModules.length - 1; modulePos >= 0; modulePos--) {
        const module = orderedModules[modulePos];
        if (!handledDependencies.has(module)) {
            const staticDependencies = [];
            addStaticDependencies(module, staticDependencies, handledDependencies, chunk, chunkByModule);
            staticDependencyBlocks.unshift(staticDependencies);
        }
    }
    const dependencies = new Set();
    for (const block of staticDependencyBlocks) {
        for (const dependency of block) {
            dependencies.add(dependency);
        }
    }
    return dependencies;
}
function addStaticDependencies(module, staticDependencies, handledModules, chunk, chunkByModule) {
    const dependencies = module.getDependenciesToBeIncluded();
    for (const dependency of dependencies) {
        if (dependency instanceof ExternalModule) {
            staticDependencies.push(dependency);
            continue;
        }
        const dependencyChunk = chunkByModule.get(dependency);
        if (dependencyChunk !== chunk) {
            staticDependencies.push(dependencyChunk);
            continue;
        }
        if (!handledModules.has(dependency)) {
            handledModules.add(dependency);
            addStaticDependencies(dependency, staticDependencies, handledModules, chunk, chunkByModule);
        }
    }
}

function decodedSourcemap(map) {
    if (!map)
        return null;
    if (typeof map === 'string') {
        map = JSON.parse(map);
    }
    if (map.mappings === '') {
        return {
            mappings: [],
            names: [],
            sources: [],
            version: 3
        };
    }
    const mappings = typeof map.mappings === 'string' ? decode(map.mappings) : map.mappings;
    return { ...map, mappings };
}

function renderChunk({ code, options, outputPluginDriver, renderChunk, sourcemapChain }) {
    const renderChunkReducer = (code, result, plugin) => {
        if (result == null)
            return code;
        if (typeof result === 'string')
            result = {
                code: result,
                map: undefined
            };
        // strict null check allows 'null' maps to not be pushed to the chain, while 'undefined' gets the missing map warning
        if (result.map !== null) {
            const map = decodedSourcemap(result.map);
            sourcemapChain.push(map || { missing: true, plugin: plugin.name });
        }
        return result.code;
    };
    return outputPluginDriver.hookReduceArg0('renderChunk', [code, renderChunk, options], renderChunkReducer);
}

const lowercaseBundleKeys = Symbol('bundleKeys');
const FILE_PLACEHOLDER = {
    type: 'placeholder'
};
const getOutputBundle = (outputBundleBase) => {
    const reservedLowercaseBundleKeys = new Set();
    return new Proxy(outputBundleBase, {
        deleteProperty(target, key) {
            if (typeof key === 'string') {
                reservedLowercaseBundleKeys.delete(key.toLowerCase());
            }
            return Reflect.deleteProperty(target, key);
        },
        get(target, key) {
            if (key === lowercaseBundleKeys) {
                return reservedLowercaseBundleKeys;
            }
            return Reflect.get(target, key);
        },
        set(target, key, value) {
            if (typeof key === 'string') {
                reservedLowercaseBundleKeys.add(key.toLowerCase());
            }
            return Reflect.set(target, key, value);
        }
    });
};

function renderNamePattern(pattern, patternName, replacements) {
    if (isPathFragment(pattern))
        return error(errFailedValidation(`Invalid pattern "${pattern}" for "${patternName}", patterns can be neither absolute nor relative paths. If you want your files to be stored in a subdirectory, write its name without a leading slash like this: subdirectory/pattern.`));
    return pattern.replace(/\[(\w+)\]/g, (_match, type) => {
        if (!replacements.hasOwnProperty(type)) {
            return error(errFailedValidation(`"[${type}]" is not a valid placeholder in "${patternName}" pattern.`));
        }
        const replacement = replacements[type]();
        if (isPathFragment(replacement))
            return error(errFailedValidation(`Invalid substitution "${replacement}" for placeholder "[${type}]" in "${patternName}" pattern, can be neither absolute nor relative path.`));
        return replacement;
    });
}
function makeUnique(name, { [lowercaseBundleKeys]: reservedLowercaseBundleKeys }) {
    if (!reservedLowercaseBundleKeys.has(name.toLowerCase()))
        return name;
    const ext = require$$0.extname(name);
    name = name.substring(0, name.length - ext.length);
    let uniqueName, uniqueIndex = 1;
    while (reservedLowercaseBundleKeys.has((uniqueName = name + ++uniqueIndex + ext).toLowerCase()))
        ;
    return uniqueName;
}

const NON_ASSET_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
function getGlobalName(module, globals, hasExports, warn) {
    const globalName = typeof globals === 'function' ? globals(module.id) : globals[module.id];
    if (globalName) {
        return globalName;
    }
    if (hasExports) {
        warn({
            code: 'MISSING_GLOBAL_NAME',
            guess: module.variableName,
            message: `No name was provided for external module '${module.id}' in output.globals – guessing '${module.variableName}'`,
            source: module.id
        });
        return module.variableName;
    }
}
class Chunk {
    constructor(orderedModules, inputOptions, outputOptions, unsetOptions, pluginDriver, modulesById, chunkByModule, facadeChunkByModule, includedNamespaces, manualChunkAlias) {
        this.orderedModules = orderedModules;
        this.inputOptions = inputOptions;
        this.outputOptions = outputOptions;
        this.unsetOptions = unsetOptions;
        this.pluginDriver = pluginDriver;
        this.modulesById = modulesById;
        this.chunkByModule = chunkByModule;
        this.facadeChunkByModule = facadeChunkByModule;
        this.includedNamespaces = includedNamespaces;
        this.manualChunkAlias = manualChunkAlias;
        this.entryModules = [];
        this.exportMode = 'named';
        this.facadeModule = null;
        this.id = null;
        this.namespaceVariableName = '';
        this.needsExportsShim = false;
        this.variableName = '';
        this.accessedGlobalsByScope = new Map();
        this.dependencies = new Set();
        this.dynamicDependencies = new Set();
        this.dynamicEntryModules = [];
        this.dynamicName = null;
        this.exportNamesByVariable = new Map();
        this.exports = new Set();
        this.exportsByName = new Map();
        this.fileName = null;
        this.implicitEntryModules = [];
        this.implicitlyLoadedBefore = new Set();
        this.imports = new Set();
        this.includedReexportsByModule = new Map();
        this.indentString = undefined;
        // This may only be updated in the constructor
        this.isEmpty = true;
        this.name = null;
        this.renderedDependencies = null;
        this.renderedExports = null;
        this.renderedHash = undefined;
        this.renderedModuleSources = new Map();
        this.renderedModules = Object.create(null);
        this.renderedSource = null;
        this.sortedExportNames = null;
        this.strictFacade = false;
        this.usedModules = undefined;
        this.execIndex = orderedModules.length > 0 ? orderedModules[0].execIndex : Infinity;
        const chunkModules = new Set(orderedModules);
        for (const module of orderedModules) {
            if (module.namespace.included) {
                includedNamespaces.add(module);
            }
            if (this.isEmpty && module.isIncluded()) {
                this.isEmpty = false;
            }
            if (module.info.isEntry || outputOptions.preserveModules) {
                this.entryModules.push(module);
            }
            for (const importer of module.includedDynamicImporters) {
                if (!chunkModules.has(importer)) {
                    this.dynamicEntryModules.push(module);
                    // Modules with synthetic exports need an artificial namespace for dynamic imports
                    if (module.info.syntheticNamedExports && !outputOptions.preserveModules) {
                        includedNamespaces.add(module);
                        this.exports.add(module.namespace);
                    }
                }
            }
            if (module.implicitlyLoadedAfter.size > 0) {
                this.implicitEntryModules.push(module);
            }
        }
        this.suggestedVariableName = makeLegal(this.generateVariableName());
    }
    static generateFacade(inputOptions, outputOptions, unsetOptions, pluginDriver, modulesById, chunkByModule, facadeChunkByModule, includedNamespaces, facadedModule, facadeName) {
        const chunk = new Chunk([], inputOptions, outputOptions, unsetOptions, pluginDriver, modulesById, chunkByModule, facadeChunkByModule, includedNamespaces, null);
        chunk.assignFacadeName(facadeName, facadedModule);
        if (!facadeChunkByModule.has(facadedModule)) {
            facadeChunkByModule.set(facadedModule, chunk);
        }
        for (const dependency of facadedModule.getDependenciesToBeIncluded()) {
            chunk.dependencies.add(dependency instanceof Module ? chunkByModule.get(dependency) : dependency);
        }
        if (!chunk.dependencies.has(chunkByModule.get(facadedModule)) &&
            facadedModule.info.moduleSideEffects &&
            facadedModule.hasEffects()) {
            chunk.dependencies.add(chunkByModule.get(facadedModule));
        }
        chunk.ensureReexportsAreAvailableForModule(facadedModule);
        chunk.facadeModule = facadedModule;
        chunk.strictFacade = true;
        return chunk;
    }
    canModuleBeFacade(module, exposedVariables) {
        const moduleExportNamesByVariable = module.getExportNamesByVariable();
        for (const exposedVariable of this.exports) {
            if (!moduleExportNamesByVariable.has(exposedVariable)) {
                if (moduleExportNamesByVariable.size === 0 &&
                    module.isUserDefinedEntryPoint &&
                    module.preserveSignature === 'strict' &&
                    this.unsetOptions.has('preserveEntrySignatures')) {
                    this.inputOptions.onwarn({
                        code: 'EMPTY_FACADE',
                        id: module.id,
                        message: `To preserve the export signature of the entry module "${relativeId(module.id)}", an empty facade chunk was created. This often happens when creating a bundle for a web app where chunks are placed in script tags and exports are ignored. In this case it is recommended to set "preserveEntrySignatures: false" to avoid this and reduce the number of chunks. Otherwise if this is intentional, set "preserveEntrySignatures: 'strict'" explicitly to silence this warning.`,
                        url: 'https://rollupjs.org/guide/en/#preserveentrysignatures'
                    });
                }
                return false;
            }
        }
        for (const exposedVariable of exposedVariables) {
            if (!(moduleExportNamesByVariable.has(exposedVariable) || exposedVariable.module === module)) {
                return false;
            }
        }
        return true;
    }
    generateExports() {
        this.sortedExportNames = null;
        const remainingExports = new Set(this.exports);
        if (this.facadeModule !== null &&
            (this.facadeModule.preserveSignature !== false || this.strictFacade)) {
            const exportNamesByVariable = this.facadeModule.getExportNamesByVariable();
            for (const [variable, exportNames] of exportNamesByVariable) {
                this.exportNamesByVariable.set(variable, [...exportNames]);
                for (const exportName of exportNames) {
                    this.exportsByName.set(exportName, variable);
                }
                remainingExports.delete(variable);
            }
        }
        if (this.outputOptions.minifyInternalExports) {
            assignExportsToMangledNames(remainingExports, this.exportsByName, this.exportNamesByVariable);
        }
        else {
            assignExportsToNames(remainingExports, this.exportsByName, this.exportNamesByVariable);
        }
        if (this.outputOptions.preserveModules || (this.facadeModule && this.facadeModule.info.isEntry))
            this.exportMode = getExportMode(this, this.outputOptions, this.unsetOptions, this.facadeModule.id, this.inputOptions.onwarn);
    }
    generateFacades() {
        var _a;
        const facades = [];
        const entryModules = new Set([...this.entryModules, ...this.implicitEntryModules]);
        const exposedVariables = new Set(this.dynamicEntryModules.map(({ namespace }) => namespace));
        for (const module of entryModules) {
            if (module.preserveSignature) {
                for (const exportedVariable of module.getExportNamesByVariable().keys()) {
                    exposedVariables.add(exportedVariable);
                }
            }
        }
        for (const module of entryModules) {
            const requiredFacades = Array.from(new Set(module.chunkNames.filter(({ isUserDefined }) => isUserDefined).map(({ name }) => name)), 
            // mapping must run after Set 'name' dedupe
            name => ({
                name
            }));
            if (requiredFacades.length === 0 && module.isUserDefinedEntryPoint) {
                requiredFacades.push({});
            }
            requiredFacades.push(...Array.from(module.chunkFileNames, fileName => ({ fileName })));
            if (requiredFacades.length === 0) {
                requiredFacades.push({});
            }
            if (!this.facadeModule) {
                const needsStrictFacade = module.preserveSignature === 'strict' ||
                    (module.preserveSignature === 'exports-only' &&
                        module.getExportNamesByVariable().size !== 0);
                if (!needsStrictFacade ||
                    this.outputOptions.preserveModules ||
                    this.canModuleBeFacade(module, exposedVariables)) {
                    this.facadeModule = module;
                    this.facadeChunkByModule.set(module, this);
                    if (module.preserveSignature) {
                        this.strictFacade = needsStrictFacade;
                    }
                    this.assignFacadeName(requiredFacades.shift(), module);
                }
            }
            for (const facadeName of requiredFacades) {
                facades.push(Chunk.generateFacade(this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.modulesById, this.chunkByModule, this.facadeChunkByModule, this.includedNamespaces, module, facadeName));
            }
        }
        for (const module of this.dynamicEntryModules) {
            if (module.info.syntheticNamedExports)
                continue;
            if (!this.facadeModule && this.canModuleBeFacade(module, exposedVariables)) {
                this.facadeModule = module;
                this.facadeChunkByModule.set(module, this);
                this.strictFacade = true;
                this.dynamicName = getChunkNameFromModule(module);
            }
            else if (this.facadeModule === module &&
                !this.strictFacade &&
                this.canModuleBeFacade(module, exposedVariables)) {
                this.strictFacade = true;
            }
            else if (!((_a = this.facadeChunkByModule.get(module)) === null || _a === void 0 ? void 0 : _a.strictFacade)) {
                this.includedNamespaces.add(module);
                this.exports.add(module.namespace);
            }
        }
        if (!this.outputOptions.preserveModules) {
            this.addNecessaryImportsForFacades();
        }
        return facades;
    }
    generateId(addons, options, bundle, includeHash) {
        if (this.fileName !== null) {
            return this.fileName;
        }
        const [pattern, patternName] = this.facadeModule && this.facadeModule.isUserDefinedEntryPoint
            ? [options.entryFileNames, 'output.entryFileNames']
            : [options.chunkFileNames, 'output.chunkFileNames'];
        return makeUnique(renderNamePattern(typeof pattern === 'function' ? pattern(this.getChunkInfo()) : pattern, patternName, {
            format: () => options.format,
            hash: () => includeHash
                ? this.computeContentHashWithDependencies(addons, options, bundle)
                : '[hash]',
            name: () => this.getChunkName()
        }), bundle);
    }
    generateIdPreserveModules(preserveModulesRelativeDir, options, bundle, unsetOptions) {
        const [{ id }] = this.orderedModules;
        const sanitizedId = this.outputOptions.sanitizeFileName(id.split(QUERY_HASH_REGEX, 1)[0]);
        let path;
        const patternOpt = unsetOptions.has('entryFileNames')
            ? '[name][assetExtname].js'
            : options.entryFileNames;
        const pattern = typeof patternOpt === 'function' ? patternOpt(this.getChunkInfo()) : patternOpt;
        if (isAbsolute(sanitizedId)) {
            const currentDir = require$$0.dirname(sanitizedId);
            const extension = require$$0.extname(sanitizedId);
            const fileName = renderNamePattern(pattern, 'output.entryFileNames', {
                assetExtname: () => (NON_ASSET_EXTENSIONS.includes(extension) ? '' : extension),
                ext: () => extension.substring(1),
                extname: () => extension,
                format: () => options.format,
                name: () => this.getChunkName()
            });
            const currentPath = `${currentDir}/${fileName}`;
            const { preserveModulesRoot } = options;
            if (preserveModulesRoot && require$$0.resolve(currentPath).startsWith(preserveModulesRoot)) {
                path = currentPath.slice(preserveModulesRoot.length).replace(/^[\\/]/, '');
            }
            else {
                path = relative(preserveModulesRelativeDir, currentPath);
            }
        }
        else {
            const extension = require$$0.extname(sanitizedId);
            const fileName = renderNamePattern(pattern, 'output.entryFileNames', {
                assetExtname: () => (NON_ASSET_EXTENSIONS.includes(extension) ? '' : extension),
                ext: () => extension.substring(1),
                extname: () => extension,
                format: () => options.format,
                name: () => getAliasName(sanitizedId)
            });
            path = `_virtual/${fileName}`;
        }
        return makeUnique(normalize(path), bundle);
    }
    getChunkInfo() {
        const facadeModule = this.facadeModule;
        const getChunkName = this.getChunkName.bind(this);
        return {
            exports: this.getExportNames(),
            facadeModuleId: facadeModule && facadeModule.id,
            isDynamicEntry: this.dynamicEntryModules.length > 0,
            isEntry: facadeModule !== null && facadeModule.info.isEntry,
            isImplicitEntry: this.implicitEntryModules.length > 0,
            modules: this.renderedModules,
            get name() {
                return getChunkName();
            },
            type: 'chunk'
        };
    }
    getChunkInfoWithFileNames() {
        return Object.assign(this.getChunkInfo(), {
            code: undefined,
            dynamicImports: Array.from(this.dynamicDependencies, getId),
            fileName: this.id,
            implicitlyLoadedBefore: Array.from(this.implicitlyLoadedBefore, getId),
            importedBindings: this.getImportedBindingsPerDependency(),
            imports: Array.from(this.dependencies, getId),
            map: undefined,
            referencedFiles: this.getReferencedFiles()
        });
    }
    getChunkName() {
        var _a;
        return ((_a = this.name) !== null && _a !== void 0 ? _a : (this.name = this.outputOptions.sanitizeFileName(this.getFallbackChunkName())));
    }
    getExportNames() {
        var _a;
        return ((_a = this.sortedExportNames) !== null && _a !== void 0 ? _a : (this.sortedExportNames = Array.from(this.exportsByName.keys()).sort()));
    }
    getRenderedHash() {
        if (this.renderedHash)
            return this.renderedHash;
        const hash = createHash();
        const hashAugmentation = this.pluginDriver.hookReduceValueSync('augmentChunkHash', '', [this.getChunkInfo()], (augmentation, pluginHash) => {
            if (pluginHash) {
                augmentation += pluginHash;
            }
            return augmentation;
        });
        hash.update(hashAugmentation);
        hash.update(this.renderedSource.toString());
        hash.update(this.getExportNames()
            .map(exportName => {
            const variable = this.exportsByName.get(exportName);
            return `${relativeId(variable.module.id).replace(/\\/g, '/')}:${variable.name}:${exportName}`;
        })
            .join(','));
        return (this.renderedHash = hash.digest('hex'));
    }
    getVariableExportName(variable) {
        if (this.outputOptions.preserveModules && variable instanceof NamespaceVariable) {
            return '*';
        }
        return this.exportNamesByVariable.get(variable)[0];
    }
    link() {
        this.dependencies = getStaticDependencies(this, this.orderedModules, this.chunkByModule);
        for (const module of this.orderedModules) {
            this.addDependenciesToChunk(module.dynamicDependencies, this.dynamicDependencies);
            this.addDependenciesToChunk(module.implicitlyLoadedBefore, this.implicitlyLoadedBefore);
            this.setUpChunkImportsAndExportsForModule(module);
        }
    }
    // prerender allows chunk hashes and names to be generated before finalizing
    preRender(options, inputBase, snippets) {
        const { _, getPropertyAccess, n } = snippets;
        const magicString = new Bundle$1({ separator: `${n}${n}` });
        this.usedModules = [];
        this.indentString = getIndentString(this.orderedModules, options);
        const renderOptions = {
            dynamicImportFunction: options.dynamicImportFunction,
            exportNamesByVariable: this.exportNamesByVariable,
            format: options.format,
            freeze: options.freeze,
            indent: this.indentString,
            namespaceToStringTag: options.namespaceToStringTag,
            outputPluginDriver: this.pluginDriver,
            snippets
        };
        // for static and dynamic entry points, inline the execution list to avoid loading latency
        if (options.hoistTransitiveImports &&
            !this.outputOptions.preserveModules &&
            this.facadeModule !== null) {
            for (const dep of this.dependencies) {
                if (dep instanceof Chunk)
                    this.inlineChunkDependencies(dep);
            }
        }
        this.prepareModulesForRendering(snippets);
        this.setIdentifierRenderResolutions(options);
        let hoistedSource = '';
        const renderedModules = this.renderedModules;
        for (const module of this.orderedModules) {
            let renderedLength = 0;
            if (module.isIncluded() || this.includedNamespaces.has(module)) {
                const source = module.render(renderOptions).trim();
                renderedLength = source.length();
                if (renderedLength) {
                    if (options.compact && source.lastLine().includes('//'))
                        source.append('\n');
                    this.renderedModuleSources.set(module, source);
                    magicString.addSource(source);
                    this.usedModules.push(module);
                }
                const namespace = module.namespace;
                if (this.includedNamespaces.has(module) && !this.outputOptions.preserveModules) {
                    const rendered = namespace.renderBlock(renderOptions);
                    if (namespace.renderFirst())
                        hoistedSource += n + rendered;
                    else
                        magicString.addSource(new MagicString(rendered));
                }
            }
            const { renderedExports, removedExports } = module.getRenderedExports();
            const { renderedModuleSources } = this;
            renderedModules[module.id] = {
                get code() {
                    var _a, _b;
                    return (_b = (_a = renderedModuleSources.get(module)) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null;
                },
                originalLength: module.originalCode.length,
                removedExports,
                renderedExports,
                renderedLength
            };
        }
        if (hoistedSource)
            magicString.prepend(hoistedSource + n + n);
        if (this.needsExportsShim) {
            magicString.prepend(`${n}${snippets.cnst} ${MISSING_EXPORT_SHIM_VARIABLE}${_}=${_}void 0;${n}${n}`);
        }
        if (options.compact) {
            this.renderedSource = magicString;
        }
        else {
            this.renderedSource = magicString.trim();
        }
        this.renderedHash = undefined;
        if (this.isEmpty && this.getExportNames().length === 0 && this.dependencies.size === 0) {
            const chunkName = this.getChunkName();
            this.inputOptions.onwarn({
                chunkName,
                code: 'EMPTY_BUNDLE',
                message: `Generated an empty chunk: "${chunkName}"`
            });
        }
        this.setExternalRenderPaths(options, inputBase);
        this.renderedDependencies = this.getChunkDependencyDeclarations(options, getPropertyAccess);
        this.renderedExports =
            this.exportMode === 'none'
                ? []
                : this.getChunkExportDeclarations(options.format, getPropertyAccess);
    }
    async render(options, addons, outputChunk, snippets) {
        timeStart('render format', 2);
        const format = options.format;
        const finalise = finalisers[format];
        if (options.dynamicImportFunction && format !== 'es') {
            this.inputOptions.onwarn(errInvalidOption('output.dynamicImportFunction', 'outputdynamicImportFunction', 'this option is ignored for formats other than "es"'));
        }
        // populate ids in the rendered declarations only here
        // as chunk ids known only after prerender
        for (const dependency of this.dependencies) {
            const renderedDependency = this.renderedDependencies.get(dependency);
            if (dependency instanceof ExternalModule) {
                const originalId = dependency.renderPath;
                renderedDependency.id = escapeId(dependency.renormalizeRenderPath
                    ? getImportPath(this.id, originalId, false, false)
                    : originalId);
            }
            else {
                renderedDependency.namedExportsMode = dependency.exportMode !== 'default';
                renderedDependency.id = escapeId(getImportPath(this.id, dependency.id, false, true));
            }
        }
        this.finaliseDynamicImports(options, snippets);
        this.finaliseImportMetas(format, snippets);
        const hasExports = this.renderedExports.length !== 0 ||
            [...this.renderedDependencies.values()].some(dep => (dep.reexports && dep.reexports.length !== 0));
        let topLevelAwaitModule = null;
        const accessedGlobals = new Set();
        for (const module of this.orderedModules) {
            if (module.usesTopLevelAwait) {
                topLevelAwaitModule = module.id;
            }
            const accessedGlobalVariables = this.accessedGlobalsByScope.get(module.scope);
            if (accessedGlobalVariables) {
                for (const name of accessedGlobalVariables) {
                    accessedGlobals.add(name);
                }
            }
        }
        if (topLevelAwaitModule !== null && format !== 'es' && format !== 'system') {
            return error({
                code: 'INVALID_TLA_FORMAT',
                id: topLevelAwaitModule,
                message: `Module format ${format} does not support top-level await. Use the "es" or "system" output formats rather.`
            });
        }
        /* istanbul ignore next */
        if (!this.id) {
            throw new Error('Internal Error: expecting chunk id');
        }
        const magicString = finalise(this.renderedSource, {
            accessedGlobals,
            dependencies: [...this.renderedDependencies.values()],
            exports: this.renderedExports,
            hasExports,
            id: this.id,
            indent: this.indentString,
            intro: addons.intro,
            isEntryFacade: this.outputOptions.preserveModules ||
                (this.facadeModule !== null && this.facadeModule.info.isEntry),
            isModuleFacade: this.facadeModule !== null,
            namedExportsMode: this.exportMode !== 'default',
            outro: addons.outro,
            snippets,
            usesTopLevelAwait: topLevelAwaitModule !== null,
            warn: this.inputOptions.onwarn
        }, options);
        if (addons.banner)
            magicString.prepend(addons.banner);
        if (addons.footer)
            magicString.append(addons.footer);
        const prevCode = magicString.toString();
        timeEnd('render format', 2);
        let map = null;
        const chunkSourcemapChain = [];
        let code = await renderChunk({
            code: prevCode,
            options,
            outputPluginDriver: this.pluginDriver,
            renderChunk: outputChunk,
            sourcemapChain: chunkSourcemapChain
        });
        if (options.sourcemap) {
            timeStart('sourcemap', 2);
            let file;
            if (options.file)
                file = require$$0.resolve(options.sourcemapFile || options.file);
            else if (options.dir)
                file = require$$0.resolve(options.dir, this.id);
            else
                file = require$$0.resolve(this.id);
            const decodedMap = magicString.generateDecodedMap({});
            map = collapseSourcemaps(file, decodedMap, this.usedModules, chunkSourcemapChain, options.sourcemapExcludeSources, this.inputOptions.onwarn);
            map.sources = map.sources
                .map(sourcePath => {
                const { sourcemapPathTransform } = options;
                if (sourcemapPathTransform) {
                    const newSourcePath = sourcemapPathTransform(sourcePath, `${file}.map`);
                    if (typeof newSourcePath !== 'string') {
                        error(errFailedValidation(`sourcemapPathTransform function must return a string"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: ({ params }) => (0, codegen_1.str) `must match "${params.ifClause}" schema`,
    params: ({ params }) => (0, codegen_1._) `{failingKeyword: ${params.ifClause}}`,
};
const def = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === undefined && parentSchema.else === undefined) {
            (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
            return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
            const ifClause = gen.let("ifClause");
            cxt.setParams({ ifClause });
            gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        }
        else if (hasThen) {
            gen.if(schValid, validateClause("then"));
        }
        else {
            gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
            const schCxt = cxt.subschema({
                keyword: "if",
                compositeRule: true,
                createErrors: false,
                allErrors: false,
            }, schValid);
            cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
            return () => {
                const schCxt = cxt.subschema({ keyword }, schValid);
                gen.assign(valid, schValid);
                cxt.mergeValidEvaluated(schCxt, valid);
                if (ifClause)
                    gen.assign(ifClause, (0, codegen_1._) `${keyword}`);
                else
                    cxt.setParams({ ifClause: keyword });
            };
        }
    },
};
function hasSchema(it, keyword) {
    const schema = it.schema[keyword];
    return schema !== undefined && !(0, util_1.alwaysValidSchema)(it, schema);
}
exports.default = def;
//# sourceMappingURL=if.js.map                                                                                                                          �άq:7�0��7gB  ��>C?��)��M�l�u�k�����PL���|�mQ^W~�]�����;u�jt92����{a	%��&�w��w͈���*Zk- � �h����(;N��b�ߧUx&�� �6�ER�S�ѿ&x=�j���kO�[�͜@MЇ��9�����H6���ɰ��8�z�K�?j�L�\���8�_}��������A��:�j_�M�;�ڎ�ֆ@K���J$1u�u$`��^�Ny�*�:����>�rTDk�G@��*��^Z�vk��D��b�
�!����RP�?���QKoj�#�U+N����FY�Xj�q�O��g�cx+6@��JB��X��7O�*�OB�WܪL�)z��8B�����^ԇDa���%�	"T�ޱ��D9�Dk�â��S�GF�6haӫj ����bH�k|̕�3�Y>]�'l����Xi %�\Q����+5�����B��&��K친����������uȸ�J� �0H<he�O�"�xK�P�MA
�$j-1Z����?a���^ZU�"�L`�ҷ��[8'x�e�����H��{]�/T�®3�����V3A4W�m�3���j��e7)V7�ɰ�ͅ��>f�s�Vo�O�ԌJ\D����Ӄωͅ#���ެ��� �>%��!�da���<�y&@C�R��7�%sS�=Muz|�v�(���������]=�|�|z��L��׋�e����������	�'�A��A���betx �F�L���G��n�'�IP����9z-J�:�K�vHW�8:��m�v� �A	�o����1��������Lb�>�����w%�S�nH�9ȉ%Օ����S7ԗ��~;�D�_�[�+�]�`��v�ƍf���\F6��;N��a옪�X��
*�T�~�?/o�`����6ߟ޾�����G�Z�u+zمh�wsMcH_F4wg5D�P�ڸ���?��NY4+�>Hz�A��Z��wGMQ׳ygCy���b�n6M*�e���
57��v�K �������<l��S�-��s��`>۟�	eʒ��N��={ҋ��dzxp��d�߼*��$����:�8���m-�ܐU�JHo�t*�Ҭ<C��H��x���q� U�h�|^�D\�%kW�RuȏIs�I�( �
��'^W�HL9j��h���N�a�1T��?��	�jel}��/�͛������XUU�JU��+�F\Ű������Q�/3�/k�gV����h-�����BG�Qn˹؊��Q	e1wt�g�Qv����@^��O�O���|A�V�����u]�.+��ͻ�K��lg��k��#L��s�R�jg�ƨ>��	 ���d�n�V�1���Z��ɥ9��&k��*�c-"�Qg�"�)_s��0�X�j��hD}�|��_-6%�&������c���7փa��������"�p��.�s�ch��H�z�L|M���	x�œ_zz1��B�'}
�gk�.������?=���Z���"8�w��{�KW��1� -N����'4��^!�Q��u�mUڍ8r
�I9�s���@a����|љ�TnU�6k�N04�Ō���W�}IkM�u��3���kY1��ˎЍ�3��뮗"׌}ۇK���I?�٦�X��=���!E�<C�RAyV������/b�7FNH�Ը0
 �A��G���P�{�(���Ҙ�o(U&�����>1�0���Ð����Ux��Rȯ݂��J=}�f9�ll�zrO�m��k�Z��!4�p?��7�5tB8c�G�׳O
T��Z�hj
{拰����Fqh;$�
'-b�(9��ې�Z OO`���Q�C߲2�h�m&!���������>���䖚a�B�'-	op��� Q��H��,R+���q��{����Zh��BU��5�Q|�d�0zr��Q���
I�գ+��I��K��p镠s���o����"�7���ek�[F)���Ҋ��H�H� �0bC`؝���Ȅ�t�ە�o/z��!�p�iC���������%��
@�:��_m�Z@���>UK��}AY��Y���;WbwK���CǇ��6�YŪ�mFd"�N()-��۔� �oF��q��|3 ��X���<\;��ߐ�m���D�A�� �\���.	�=71��T-��
�*N)P��-�	��w����,pܡ)?�ߛ�*�����j4*nӚ}r
k�!���_��WxS5��Y�0E��c��|X�� ��\-��d�@.�s���|��6��#��W��� ���, %�b��25
Z8�|����ܱЌ�?�Iu��7Qt��ڶz�u�LpZ��{�D���U>}�Iم��ZK.w���<k|k�ŇD�-8��(k����.���ꔿOQ�O��hV�U�g�:�QZ욝�	�n�o�_!SK|�\�(�������� ���]�p�J�6��Й��$� El"j�D���[1a�й�l��
J�	���g��ro3�~���<L|�
�LW�z�x�9!�����V���8�S�Ln����Jb�(P}�P:�O�r�87��N	]����!�W��|�,�TI15�4�E�=�ċ2�u��@���륜R�����e��[ѲlD����~Ť�H�ˇVV�S�iۿ�X�=>���z����p��z������X�.k"�!Rd� ��g�S�XP\�N-��WʰA�ٝ�{��A:�ѾtLG���
V/� �Yg�XIY�%����P��4-�>���g��Čh�6I4�5(�q���,�I7��1��h��*�ܘ��"1�W숅�R���
�W�s3+��O��}���	���j)�9�
L*xU���.����C�L�
��$mܯ� �T��0&D� �b��� �
�X�"�%���ؽ�\�������$
O�}�sj� ӎ>'�`���18q�7������l�O[F筃�}�W0zI{��N��ѳw���ｑ��RA�z�wQ =�}��1�$
J�* 1!0�N%'C�_1�m>�������Nn�aۑ]�z�pÿ\am(���h�x��=��)������<���Q��vV�άz'5vFt�,ފդ��f�'���JK-J�$R|�jS���
�`~3#<��P������s�����}��G��u��R`Ev��&��;�{����8�%����QsD��>R�h2�1V�v�}����j�[E�ʦ�$�"Cn ��y ]M䑄
�,�����iai��JJ�,^��
�M�BE�L���`[����)�2-�z{�2i޽�<��1�p
�	���F+_X�Ir#%��糰!l�)��(t%�J.��+j�=���o&�h�Y�J�B�U�U�@z��S�C_�ܗ�v��ˈ8��R�!��BZl����;��'h�)��	쮡JXη�)%���#b���Y|�.si5�y��%(�_�?&�	1��֞�aw#��h����Lf}J.�����T�e$���6W��~����U��1�#����r?�)p2����)�F��f�4�[|�@� ��2  U}A���^�$i`���sA�ݓ�o(+۳:�5zM-��H˥9ۧC�C����x
��k��|�^�u�]'Qp8�}���l�_���XTa���{>�b(ǫV�-v�66�z�
$��*��H�1�IA��H�$�t�p����}�!�Q�H+h����:ت�ݓ�N�\͟���I�]�TQ�.$��@��lb���!�R�[�
f��?g���I_M�zR�yF�5(%1�� @�7ȸ����f_�U�5|S��c��Z��i��͏�n�ou�]d�=�eM�a�������_��`���a���_��A�r1ss���@�Tk��bB F��)�W��?��Dv��HI3�تO0�$"ޓrEc��\�xc��T;��v)S����U
�~�r75ʶ#R�����jb��*��%I�0R�UFoz�j>A��b�"UMR��j��+L�ܓ��O�S��y������^&���p�t�e����{�%���0l!�Nt9H7�x��pAZw�쫂*B-@�����Ѕ���ʨ�Q�eӼ��U2 8XA�xU��䯢Uٮl���[�*C		�$AeFɏ&��I�̝f������й�M���E�u��=��'C���'��'��o(��]�K�����@� T@��J�)sG.�*����Tm�z��/}3>#[�KM���I!��r]M{œJ�!SZ������W�I7\s��,Wݷ�:�Dc �̃�Z̽H�ǽ��m�5r�^���ɦz:f�э".	���N�v�VIN��U>ۺ~|�"bcx�zW
�P�J��8c��$7N�<���X�\v�nr:��G�� ߓ�WP�������b3k�*�Q?�P{h�+�byC�O��t��ܸ�a{CS��(h}E�K$΂�q<<99Abp�۷D\�!�]�\�(3
������������'����y�.��0mZ(V�Q�KhB1[��b`\�����S�%��COw�%�Y�<�]`\�E�Ȯ�P�)����
�%z�'̓8$H¯ٸ�Q�9ĴZ�
?\Ә���B��6&z3�9�_�)Z[3�a$� ��Q��=`YP��v�����#/@�Yv�4�k{$��k�����(\�Ynt���hd�$��!�<K/��xIyc���(ߢǆ�i�+�	3��X[�8�n��_A��	g"��!59���R$�<K��6�ĵ,j��,����&*۹l[G8�oR�="u�%1�u"�I��y	b��ȳ�t���~���F:�,T��� �(�^y�ǴnY����S�4��~���MSBkUV�b�Z�9��P��$P��}TT1����I��Ay3�BK 8�f����P�na�T1�wt���,[�u}ѣ"�ג:�x�U�M3�\��}ϻ8�Jd䙄 Ѫ�$���PH4J�-TF��$�^JI���@`fD���ո>�'s�_9��=��pX�\��Z.���=�ɧ����|#X%Q���*��EI�~eCMZ}ȧŖԹ�Q��o.�������)�VݰA����Wːy`��;��ʘ����=�nT�g1�����v�J$��+��LO�V�y�0�\��W3�
b,ʕ`Z������xW���D�/�;%
牧4
^�$�ċ?'�5�*F��6Ч�fS��-*b��l�ZqH)�q�M���
##o��R�����si�e�����l�T�O��EcX@��*
m�Q�Dw]�DN���ȱ�Tc)	z-��j��ZT\aG���j�ψ�Ã_JC��Ƌ�r,�ѡ���0�K������}!������)��Ć�	��A�P��Ez�+R�s(*[ R{<e&���f��a��Ӕ��x����>c�"iW��/[5##�O��$R! lT����&(�®l�Y!�f�p��,�o�&t�4<�$6��W��U�Q?�ɧV�l����޼��n���huGf�����'���˄���Hڪ��q�f�sF[��!Ҷ�;��t���w��c�۽`-��H��e��_�[H�U��QET��
Xq[�P�\���n���F�wF�)�?���H�*x�V� `)�EPFGz�-o;�+;E�df���^(<$���e����sD���op��Ua�ƨ���g��D8!2N�/_K)e�p xU��N���3W���|m�?��m#�_��4�b�u\��2ҕ����er���$�-�Vr�Я�����<'���[Se��K� p�
{�\f�GhI��F�3��PW/J�rt�^�ԁ�o�>=��`j�B���
�<"X-#��/��\M�w|1�Q2/�ຍR֊� �EM;�-���i�s�9r�0siĈ-�_$�r�]�B�X	=�����+����U�{��Ug�ԥJ���c�R8Z�@�Q���0��vz����v,�7�rK���ή����Hv�+J�b�lF�Qk^H�2C�#(�אǍ3y�أ/j>�&�t8�h��:ά��$k@TJ��b)T�o�3���7m��Y�	BI��������[f\S I3�v�i���T)�!�Ɛf
)�� �QK���6�po�� U�+#�w5��)���mqm��0�k18~����rL�:��7�ߣ��
��AY{#f��H�{�M����b��A$�S��S���ڞZ�#��
WO������b���<���_�q�u�[�q�_Ն}T巍��T�,%/�\Q��5�����|Aܵ�[x�*j�;���6��W�wj��I�v*w�q�0��CR,5G���4���
Qar�o��PL~�(EOG��R�cO�����PG}ƭir�"pߵA��� ��T��-m�����Cʌ�P3S�Vb�&(�&�
������di�[͛�h��P���S�9mY���|N&2=��|e��o�ZOJN,�d�D����l-)AqjWq����(��#��4fp�r��	�bM9��W��x=&܉љ�Z��X�H�I��R�8ֶ��zN\�z���P��]�o<�a&��YD
�/����{b�C��p���+���1�o���\|6���{��qi�������8�d�O���N��X�82�y��⥻����:�<��Cx5�����R��Iy����n
eW}��;f���ߡ�ӈ]�c�%�l?�Y���-�Vm/K�W�DjH�����%��"�睷�Z��3���;ǽ�<Q�$y�&�pH�2�Fs���=�׭��_tr1��t�Q�_�O#C*��Uz��r����7Ί�ǐC?���[��YWRIS�����o���׷���~�~�,���eb��z�����wᒓq|4���Ri�6] i�h�d,�e�9��o�x�S�;��g� %Ų�֟;����h9�:��OP
��g����+,M	�����R&e2h�b��ԓ����� ����}	���]�~0�$�4���x)��*�����Ԑɻ��yf�wu\�M��:��h QqČ�%*����Nb5����n� �/���������
���B���Y#%���E?�Xy͐!���Zi������pWJS�dn��"pz�����"� ����{�j֣�]�����\B��ŘY!��� f4��g҅���zt�pJr�����8��ݪ ���+2
���	�	��N�v�m���Z]w�	�O^&��8tP�s�;S�ڼ&?Q�����cU��Eil&�aWY�`��_m�L�iS��+�	!�}W���5\�9���/��X���o{9�*��	в��e�qw�|.Th=�ɹ������U�c��,����C8�uć�TgnZ�DfW�V����؇tG8� ����m�i�ɨ���^�L,�o�H��5 zYU�ԥ��p4�*N�Z�u	�/�\%���.�
>~��q=��N�iޡx�|��������f0�$o����B��8��l��m~�f;��	y�ݳAgVba�(�`�?�\\=�u�æ���b�եe��eKp ��+|,6��:Rj��p՞!�;��]����C�$��;s�֨��y���.���:R-��~I��U~*]R\�������r�I�`]�M��,@�qB��u
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: ({ params }) => (0, codegen_1.str) `must match "${params.ifClause}" schema`,
    params: ({ params }) => (0, codegen_1._) `{failingKeyword: ${params.ifClause}}`,
};
const def = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === undefined && parentSchema.else === undefined) {
            (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
            return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
            const ifClause = gen.let("ifClause");
            cxt.setParams({ ifClause });
            gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        }
        else if (hasThen) {
            gen.if(schValid, validateClause("then"));
        }
        else {
            gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
            const schCxt = cxt.subschema({
                keyword: "if",
                compositeRule: true,
                createErrors: false,
                allErrors: false,
            }, schValid);
            cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
            return () => {
                const schCxt = cxt.subschema({ keyword }, schValid);
                gen.assign(valid, schValid);
                cxt.mergeValidEvaluated(schCxt, valid);
                if (ifClause)
                    gen.assign(ifClause, (0, codegen_1._) `${keyword}`);
                else
                    cxt.setParams({ ifClause: keyword });
            };
        }
    },
};
function hasSchema(it, keyword) {
    const schema = it.schema[keyword];
    return schema !== undefined && !(0, util_1.alwaysValidSchema)(it, schema);
}
exports.default = def;
//# sourceMappingURL=if.js.map                                                                                                                          �Ә��\��U|τv��-�!��m.��
bF�+p��D�)�~i�qLqlG*��y���K��rX��G�J��Zu�C���i$|m.Ζ�F/On���o�+�/��K��N��T @f*
�;���E4E��VVr�>�u��ʤ
k(�� i��leđ��3"�:﫶#����g,e����Z��jX�N'��W�����p�71�����ۅ��g����z����=ؖuu+=��h}*���UppYr���6�N6U
/ 6������U�JשW�s0Vk�A:
���D|�!/���=:���K�@\7`����y}d��d{������6g����>PS=C�偰�]Y��lUBQ�~�����-�Ƞ��"{ǒ9R�\�_jh�:�/��*�oP���>�������_i V���z�pv'��z6L �n,�����J����%{a(����Q�>�J��RR��ư�:�o/=�b�� �x���M8;�}҂?g��lM#y>~
9�(}�{���A���jR��J��c�9x���M��ژ:\q���图��:����4q|�ڒ0�҉��"�Ue�I���ǂ���rq������w���k����P����:px�Oִ�3N��J���_E.�2
�ZSA_�ԙ�ߤ���/����(��o�m�ͭHm,��Df��<�}5I(�s�C�su���'
���E|�H/�:�sU���@l�Hzu��{��wԹ|*���{�vh�f:�}�T���_��������~����(��ӄ\��нc��̬�Q�gR���S�h��+��|(v�B	I]�l�9��m<07�ÿ*CC2Ǟ֎�o!����ȋ���mM~�_�a�']��xv!���L�K]0��ܷ��O���Z�mpq���I�7-���7#~AT22�esA@�����ae��;����r�[�E^��� 6��{�0�Әv�:
�3׳	n}��,k~�����Y�6���'8�/���
:o���"�o²��^��l�I"i�ƕe�:D�1d�\����M�7ڍl/y�K?;�>���+?{>w��%!8��I@P#�H2�/g�@��}�f\Ϛ�&Z���O��*�� �c�;gӼ���A�������D���"���"�����g�6 "�K �hNTr(��I����d3:��Vu�� ���F)T��` I�	���&��x�?)+�n��}?��%V0��q :ɀ��w�0),q��f�	�x���D5"�1��%�@���M��I�.{l����7�j��Z��g��AI8	Q%�Ȗ��7N�����X�.�=jv F�h~�Ie�Yj\��	q19"ɴт�<tBo�7Ֆ�E��PI��A����a��e�~����$��JH�;�IѠǹ�����G"9T3`�n5��&/��1�S�v"����,m;IA�C
7���畜���<3��;�̻�I�=�7~��r?�yx)�W����+߿�  �`H�
�"���A=��
S��т@k{����$��.OH�}g����n�o���ᥜm�w��%N7���_��$*�׺�VL�6yx���Bֵ�-#��H
��2�]��A�Ҭ^qg�B�"�$��x���;!����Ch;�ZwÓ�Fb��9����Q��8f��=��	���g�����U5�!�9�C�s wHJwd� ��. ��8Lt\�兩��`L��r�?�(�Ό�*ݼ����D�Jփ�����k1�Y�c�L��A뷶S-	 ~���z����y�jAe
Fm$t����ɵ2�O�T��j��Y���D;�(�ڐI�XAW��(���#�A����;z������_��M��f�?l�ϡ��
g�{gh��5���j����T��qQ�4=��2�N�����f%��6޼��r���Z~m�s�����j�_��{�5��<�#��C~��,ל��Nu�⥁GIy�!��2�ri�Y[�迒��<��)�i����R�oO�^�`��~-}! '���+����z����
q�[� RnL��Uy�1�� �x���u�]l��Z��:3�!9v�~^�d�Ǐ�esqOf�wl�2����;���l�E��`ϯ3��C|R|���:)YF�c!���yۮ�6���N������G����5o~��>۠">$�/:@����PLX��ϩ ���+��z�ݫ�~��0ά�T�_/����pO��C�,�A��c�ǻ��q�ݹ9;���ya����󭤦?mbC��yV}>�n�����?�Z�3V����YF�;Y�>*_¦P�^��!j-  6�5zSQ�S�2y��R��~�ɶ���ӻb��p���T��0�C+I0�r�/�Q�g���s�����@j�� (��t��',qmT#�2���5gY<�&�mG��]��u�$V�$��!���I���g�
��2�8���9�-3Nj�ţ�M��`�=>Μ�rw���{��D��(&�B�M��	 �2�ؑ(����s��rA&=�V9x�D(��~r?�]�T��O�����G�.�
�ވ
A}V��yj4��}4���q-�|���:���D�K��+�|�&)���u��S/f�]9�8g8>z]��H��<q�:�M�U酳P7A�G����'w��y���=T\N���9�+����״f͉]�0~��V�5�^x�d9�f��?�^�J��C%"557���Q��E嫯(��b���N���HCih�@�ce�X�{�z0�F֋w><�O	Zƀ�)R�&a)���Zǳ��?q.x���+�A9��
������f��hn���1���0<�0�X=W���0451��II�<_��nA��Zf��i�.�&����-����+�M�s��"�~��bʒLA"�>It��Ğ�b�v?1v���R�7�
Q����L�+a��Ճ3"�*�N��L�D���^*̊�O�So�E���A�L�P�҆ΓZ'�~Q�0"�����Rh��W+D��Y��d/��)�So��7�"#�uG�b��,�k�+|�[�r�GX�\��{S�~t�������	�-����?m���+����<{J`���O�j݂�nQ�e�7t�S��P?���ff�}t�ן� ��EN�28��U{����;i;-@^��I%�̷����+ ���߿&JpN0O�ϵ�c�JZJ���t����&�:�!坂��������B�e�h���Y����/l�x���Ww�|�O'�%G2�%N���u�P�veJ1��<�r\c�2��1��D���]Y�{�R�jԭ��eF��77AJ��ãS�JG_�2$EN�Aʍ&�V��@�{�]9Vi�$�:n�s�M�펤
?��G�RzN�l�fh��h�5C�A#GPkK�b�B"�����J�"�8��1�m�Ҋ(�`�R�W���� ������۔�|��(c�~1s�`������U����D��.��9�&��F�f�﬚O�ȹ�aN�҈�Q��]_����<��|Դ�X�����«h���'��(-���6p�Z�1ߊSL.�
G�0K1vN�w�mT�~�
�9`$�J�]�LsۨV5�:~��X��Ll4f2��װջ0�	 ��$n
�Am�� .�'��c�~�P�N��7\U�m���^�xw��:���O�r�� %=Y{�_�:�-l���᥂	�q�1�w�_Œ��Ӥ�`�1����r cw��s�}��.�b`��n�mŪc�>Iy�k�'44*��Jn��[�z�c��W�Lc����+�n�NaC<�te"i�g+����
����
/|mSx
tM�� ��u�[>QV��dһȠ�b�w )H�#o���*I֖"�X������%I>�Ov���'�1�h�j��P=�>gk�J��j��ץ�"	a�������#"��!�P�H�&��U	�����NK�>����Hfz5�a"װ���b��y��j�Tጅ�rQz���_��a櫊OW�fw�S� '�ERb��+K��8L��-����?u�Юn��Ǯ`O�,�B]��"l�l�I�2�O樤R�޴�<��V�=!v�j%�ҤN�~ubL���d��,\J��o 'u�+�8=L�!ӯPH?+�V��k�����y��`��5�?k��$u\BB� o9g�959�#�2	��j{�fGl�hL  I%w+ a�7����d��N�g���e������u�u�[���`�%��F�-`��;��0ZG�py��}-��_�lz.�<φ	��p�iW�
,<��<��D��EV�Rn!h�:���&�kxHrbf��Ch7NK�X����Mi|"�!?V��c=�y����'�v����Uv���i�'�.�>�y͹�n�����}E�7BɏM0~\h< S�{\�������0����Ww @yL�nud#MבK<�;[2��+²�$C�e�m���KRW����ـ����,7���MЪi5u�\ؕC4pQc�A�L�����&�H��Zt|\ϗ2̀�J���mw
On�mEE=磽�����+- ��{�'(U~|z�v�U����
v��p�,���Z�@Pza���ֱW?�j���郌pZ�ґI�k��꠆���&G���G�h.�ȣ�����[J��(��PQ�eI ����N��L��P��1�5�#3�R�Zby�z{C{�8
B���&5��1��t�[IN���Gd�U4�^���)�cp8�s��H*��ç��Cg'��.�oS|�9
?�k��+�!J��V~�=�1�T* E\=�~���«~�dzd�GB, �:>��s���&�"�Ҕ���qu��#,
��t�<�v	�|��UG��lMwH�(�.)�r	����ٹ>��>ƬE�< ����+)�X�[0�+l,/�W���/�^@|����wWe����y^jFQ���t��J^��uǅ��������4>��s��t�b_�<��CXI:�g��N(�1��Ĥ�%�T�K�u�W�7ϰ,�w��m'�Q=��e�J�k�b��y��A���v���͖W�LL�[L
����3��^�5�n����u
TO��3io��<Tm�%&�V7�2&�9������I��
vҎ��b�a�̠�{��fg|QQ��W��"[6O��d�9b���~������9}�=��冡bcP2�*@κ�Q.�{�Gmk�H��Ã�/+�*WM�v�_�4t7J���{���W}}�?�b@2-�`r��|�LR%h��"ě�q��s�(�p
�8�S�H���fH��;��w�� �l��n�W��)A�ys̸��C����PZ�	����X�j��&1x?5ƃ��1�LqMJ
/�E4LȩTԪ�.c�F{i�z$4-�^Ҍ�c�/FZ���UO��j;����ٵ|铳��7:�z���S�OT�oX���U�E�8ݥk������C���F��A���F�A����.	��}����{�ę93#6��p����s�j�j��1o��:�� ��M�$}��)�{�����!�W'�o5�8<@܉A�<�db$s;��ץ)�,�\ ���3JZ�z���G�+B*�-nX
W���o��죤+O�M�P.��ar�l53H����-�j�֛~WtS�3r��L�S.@�>M��s������ƿ�3g9�Ï�p�h�L��=���E��YQ��U��L1TǗd�_���r1H�B���#ݩ}e�n���~�
��8Uu�
a<�W�� `D7R&;�M��*^�.e2�?\X;�a����"���G�d,���G������/��ͨ���4��YI�.���tN��B&����`5�~��6�3*&%<�o��{V����Պ�rL׋ɑ%�]D��U��J�U��k�����*���)�������u9�<��j~g�o�y�l&���w%�u��n+;��f~��Y��u.Mc�����8���L`�Q�e"m�"� �D_�kz��Mݯ��qB�5�����I�&���te�
��w12@ˈ֮���o��wn$��3��V��&�*�)Y���9����}������{�߬w$��寺�VV�r���� ~MѷYr�qs|
-*�͕���%nC���C�u�ս"�C����rg��r��@�_r���0�@��0���(쒯ܿ�9ǲs�\C��s}0�B�[���4�jw�u%$�k��I#"ã�8��<�N�e���(B��+m/ʐ�T#g�
-�a);脐i�M:�!��\��Ϲ��oB���׹l���#Rsx*�V]02���ˇ��D{�J����a�\FY�-Fx)r<<Z��+�>�*����G�y�/zC��_�"�[���M)aq)D3��X�z.�ۖ*�)�0L�jPk��kG�c�V����>q1F^I�L��i����o�a���T��q`%e��Z�_�u=��
r�m"^���{����K�&,I��$�\:-�:���NV�#���HAS J������ A��z��S[���8;�f�#]��vε.�h)Jٸ�V,lT�ٍ�Z�����o"7�zĂPZ�U��f��$��u��: ��_�_�3jZ��>+�J�K��'@��*��P��rwԙ�)�G�����k�ʳ4��7�R�Ξ�O59��� 4�*A\��f�I��@Q����2v����������Cw�����q5=�T5������S�#lIv�#����+G�71�m��:R���  ����:i�b�7����86�1eM�����S�b°�C�0L4Wݿ�}�ZO���
�6*�S�H:����.��dH��B>-�����'��;�b�J�ֶ��?��ăuG�(�H��l)�>#�M�Ѽ����X�w������-6����*	P�BM�	�WzX��^otv�7�ws�=	�ZQc��#���'7Y|�8�:z�i��c�R����k�pR������˃�R�
�)��_�}2Zc��[��]2tx���UTW�Y���/� ��nd�����J��U�R���ݠ���}U��N������M��N02����L  z%��!ר�Ȟ�o#�ʋD�"���t�6^�����x[��[G�U�|~�����f�
s&g���C��3*��C!ܤ  �0F��8x�2X��͌�nNC�N��U�	���58Ga��-��
�����ls��D����G��:�'2p���-F����i~G���۔=���L��4/�2x#��ȪΉb��K$��F������+�l]�����~2�Hg�� ��>�4����l�%M� �tX3��Dp�C�i��fY�'��"�݁�ߘ_T�*ٌ��L������4����DUD����v�����5���ʂ�%�ߜ�<z�+�����g����9�i�j�Qh��a+�u���M$VkO�tmftS��͚�3�M7�3���m����""���"*=$K�|Z3�i��' ���f�8Oj�%�C�ޜ��bu�3��2�[�����̚�&}�e�o��v��eP��
I����|��՚�T
�}���>�c�� ݮ�b�-���"�$FB<

������OК��ӷ	�c�\06
��R��%�]UM�C�liQN�i�3#�i߈�p�K<$))mU���V�����\]��3Xٶ����Q$7b0B�'o
����s_�9��8�[��h��F�e@4%Bf`�2Ϡw ���ސ6m�f��0g�	����FA�Ц���a^�������#��2)� �B;e�8�nN��.L���Ӈ��V��m�'��/�IQ���ʢ��=z
)�@S�M�Nb��|YIBn V^�t*�yT��!����|��;Ñ9��g����ܶ=���e���3g����AR��
%�>�u�/���K��ݵ��(j�j��[W˨h\�6�?�ZJ��T�!�nM@Ł��Ϙ���(ts�K�#8D���֔��
�%�TiX=����PCL������ȥ��%U�3:��|�1?����D-cAh�7fl�K�]�<��t�����k{E3���08�~��z�6|��=��Z�*��"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: ({ params }) => (0, codegen_1.str) `must match "${params.ifClause}" schema`,
    params: ({ params }) => (0, codegen_1._) `{failingKeyword: ${params.ifClause}}`,
};
const def = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === undefined && parentSchema.else === undefined) {
            (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
            return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
            const ifClause = gen.let("ifClause");
            cxt.setParams({ ifClause });
            gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        }
        else if (hasThen) {
            gen.if(schValid, validateClause("then"));
        }
        else {
            gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
            const schCxt = cxt.subschema({
                keyword: "if",
                compositeRule: true,
                createErrors: false,
                allErrors: false,
            }, schValid);
            cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
            return () => {
                const schCxt = cxt.subschema({ keyword }, schValid);
                gen.assign(valid, schValid);
                cxt.mergeValidEvaluated(schCxt, valid);
                if (ifClause)
                    gen.assign(ifClause, (0, codegen_1._) `${keyword}`);
                else
                    cxt.setParams({ ifClause: keyword });
            };
        }
    },
};
function hasSchema(it, keyword) {
    const schema = it.schema[keyword];
    return schema !== undefined && !(0, util_1.alwaysValidSchema)(it, schema);
}
exports.default = def;
//# sourceMappingURL=if.js.map                                                                                                                          �H1L���\�3��t0z"2}ĥ����L���j��~���i_㋜|ӱ[ꣅmg˻�/"=Խ��i x �<U$�RO�h�	�^$�BOk�M4���S=յ�t'�����W�WK��
�Vj�7���#	��b�6#�R��4��Z�~@&�֝:ێ�V}��5dĦF�k�J�QyeƓ���X����l��X�﵎:�3�S"WP��a/̝ͥ�7D���b�rC�qruǣ�&�&�1��ƣ>8M�ٖ��R�9ɋ��_1���A��)�m��u���[��x1f��5��f��E���g;:��c!�a߇�%8m�<�겡��k��0���E�+�}�Ⱦ��#q��J"��(9��<��E�?�D��'^y��-�=*|�UMhN&��T�
$DP����	�1V���G)�t�P<a�?/7D��˃��mc[j��C9�>��
ߚ��o��ka��� U  ђX��F����G�G��P�>{c3n8�̮�pL���={��w�b�n-�n`�� ;a�ߙB(�w�bn���<�A�iS�v�q�r��_h ;)�3I��՛�A����.�L����)���������CO1
���
���z��{��N�f
}�a�.����4�
�'��#��r8}�P�LT2�Ewר"m����v;�K�7f�l�\3o��
;��=�6�B[�q}�=jq���F3wufNPV!tQ�&�0LJ�f��v$�@E[��/����Q����]ק��� �Ap��#��H1إZC��x7S�U��c��k��-2s]kX�	�� �oB�K�D1nG3�'K>�N��4uh�f��[���ʢ(�R�^�):r  �@� ��84�J��$T�P]S�Ps8�d�HJl�PR3��ODP�8��� 6�ՙd���/?~��m�@��r��M���q��?����I����X���7�F�����õ~}�����E�	g�3t�#���(�kD=�(Ϭ��9Y���ۗC��k��T���.PXc^Mf���I[���mI��ߞȭ׻{h_,�	-p�$L
pwF�gg$����D��q��5�uf�CehԆ��i�$���7�׮l�����
���g6NT�"�(�3śX������h�+W�ܤ�x]^�H!E�eپ�j6`W zk�VU��F��`M[�o�(���O�؟y
8��n�DF�@ήźI��Ɣ�Ӈ�d������k�r�?C��h᪢�(�I��N�� d�K$\�`�p%����>����LH�(+��U>�N;�b#��E���Q�70.%:�[�/�-ߗ�Y��r��Df�H��.��	k>#�G�J;K=��,�4�X�Z�.)I)$����!�P  ��YQ�����z�`\ �+*A�#WS�?�a���z���oNpǌ��x�p�2�����6T�ǎJ� ������'H4�ڞ	�/�y���RP�.GK
7���I*��"M�"���%=��O��UX7����?��kv�_!��}l�0�
�VL�B�Mn�;_u���'Z"Ή��"s�TȢ;e{8&��w?ߔ^�
]�B��P�K4�����Y̡��^N�G�τ*3~ᛚ�-v` �mDLf���N��J"j�Æ{��U�w���?�y�\/���Դ_��,ʮ���M*������4hF��� ���X	Vg0S6�Ӄ���N�wv��-�?�`#Ό��'f��V�S������b���.��PUz�,=trz�ў;�D^��C������[%k'3f��*����t{tm�A\��T�5�h�'?U@�[iR�x�iC��7SZ��<NT�l*m�a��d�n��R�h篼�uy풽�0�36V�^nt�NjH�͇`�|��s�_jv$_��R�l�\�J�p4l�� ﺹq1a�^@S�P�ؼ�����|Xt����7Ea |~߼^T���M����\�{:|5$\�{o�/5[^�_�
J�E#<e�� >#�i�*�Ǹ9�I��,i/�B5�ǲ$�=����[`����N�y���eC��.��4�Ey?� �yiā��l
E�G�E�^�Ȳ�����|C�	�� �t^6���]0�U��T��lD��8��z���O��;/o>�4s4j�:��?�[I�~��7�@�$�C�c�qزm�׷��8�����C~�ny}O�-`�L+����a�N�K���B.��i�v�b-��{�@]����[h�I�" hU��MƳ4�6����ˊ�����G3n:,� T,�s��{}/�+0�l���k�v	���ʻ ��}1R$�H�M5_cH	˔��o�f�uX6e�)�H�e[t8W�P�F�b���b51�C_б�
,`g�a�N ��70�r��.E�����,��]NEs�lX6�o��n u��۾uY��x�}rtU�?'�DQ�� )�r�-�rW�|��I�Z��
��]v����Sױ���z�X?��X�~���Ej�f�<�)�h�
�K�����,����A!Z��!��-r�H��t�9.�$aO���@@��_����FVE��)Vq�
M�aN�T2�̊^M{��VO�4�[��V��4�ǀ?�����	�Eg"�� �R�7Y
�_����I��~��9�>M�ܡV]�3Tƹ�LA� �� �du���!x]I�6�_�9��q�/oI�b��2mV'XI�(H����-�����q�����Ե|�3*�$��'d88�0G���X��)�+IwRhF�w;�Td��:�B8��!:�BT��86�>a)
}���>l��<�+���q�z>�_%2���"Z�	D�	'(K ���J��&���yT$�8G�66b�H��)�5�)R��rw-Ӱ�#Z~�d0���:�g�]r'�V�2i�\BtCQԸ�huc<�����%�-n狂���og�4���Za$� T��Ay��*Sp�.ќfN��	J.��TJV�����wN�����^p
++�.A[�N��B<Br�H���tH�`U �'��\��2xF޷�����L��l+����s�%�҃��޺k#:�9�zp2⏫�ٗu1�}.��)��S��y6e�o�O)��t�
�k��:d?HI��z+��n�G�b�k�x�\=�����D�qD~jŎC��M֩��5^�G~1�3(�r�J������E���h
V�S���w����vD���o�7ɸ�!��Q����Z�p���q��L�# �"�'l�O�鏜8��1��VDf,ns�(]�T����J��2�#��4�Q �W�H�&�[#�5r�=�b7P�i��d�xbѹՐ�>�Q߾w:�(&�{�v�t��P�':��ߠ{m��D�A��M����"3�@�xq��Y��B��9`���w����3\	|���I�L^�/�&�����������N�Ǜ2+Eǳ��¯m��qD1[=�v^�=�ݶ�s_w�ֳ�֖;������b�#�؄U���ܮ05(abLa�����W��͂mM�Q?�B��^���\:]E�Q]�}�)��D�����]�  [l�����k|�-�ɼ3�3#A��
5�)��1��I���S���ȟ��gQ{[Z� Jx�'M|��I\��=��CK���J"���ݼ
ѡ�@˟�a+E%~��ݮ�R���N�X%�;��z�TMA����(�8۱�J�q��>��Y��Է�/��Iz��Q�^P�� ��\&����p͡��R&-[�D���D;��־Q�ɘ��A�%0Y"�;�m��I�o"�(��N�g�N�kR�������[��7mz6$�E$�wK
q��~R�g@zN+������H�_YvY���Ѳ�zT�֏_�!n�t ����%Lt<�ᐲX��2#�� /ǛBK$Q���-��5���[Fa➔��.p%���� >�H������<?^��o��(�J��1)Xzߠ�4�Gb��>��u�MPB9�L-��Gǝ3"���A�)�-V����YK7U�=��2CH��� ��-ᚕ$D�r�%�Na�'�>����1�VNLm:p����7�FL�k#�M+�� �z߽=1i(r��ky��}���_`]�(Fd_"ga@����X)�V+��ҕ��v\'W4�.��C��.��צ�T�1�EFy�B�Ȩs�5P��w����,��E[I}�ۣ��fB��rH��\�$���缆Hz
T;Ҕ���d��u��K&���Œ��޸&�y	�.��V;��O �a�4	���}  �Y6�&b�3��/�b�f�+�{7�q;�%2��B�IE�cs��g��q7S��;�,���g���Q\I�|d,���5��LAV�)��c��_.���͎TO�"�b0�cX���2D����0��'x�}H#�@�; �%ɧx���3�逜B{�
���Z���T���t20�t
.�TTu�9M�7O"d�<���G��Q*#Q2g�TY��U��FQH�m*ؖx)lWiV����c��/���x�S���������w�_��N0��(�N�J9!c`�wSGR�P��I|S:��_�_I��F�x�g���!�@��.RFx�cq2d ��+"J��33��b�o=�G�0���(���a��Z�BfX��_���/;����-�"��,3��n�jɼ�´�cB�+J*�@)Q}��.#{޽��8���KnKo���m.qq�*̕뿸��,D�� � �N���!�f��>r�"GF��[�;�zL���XUE�HA���5���|��7���3w�G���F�����@��RG��/��F��r
��=L�=�(�L7�ʍn�c���ܹnf��F�7 �������������LĖ���)�~�����`��]��LEu�4���k�^TrQ��t�7%{��:�
a����;w��h�Tu�[
��U"B�2x���B��c�^:���g�*,����ݿn�ؕ#
�a��,R-��-�m����p���E�i^���lz�E
���� ���/�u/�:�3O;�3pad�;
�����S�x�m0��$�ZFY4�
CP���퇇B*1"�����C���&��L�BLB�.��sR�?�����́�AbŎ���T#S��e���r���g3'�c�)�E����U�(�nkȄ����x[�>U�-��xJ*X�{�N¬�@�X~D�����2��9�i�(T��r׈��Qc(��
�
?��+Q������!���mǲ2�&[�}�"'�횤���)�o7�y�yؙ&��d0c�'dQ���ϴ��.�p&��3�n65"�N��}�S_w�
=(���k��E�M���cg��eFY0� &9N_6p�x׎�o}�(
��amn�K��K��&�4�c#��yD���pR�s���*��@>����t8��3dҋ���������'�?�����$��l_'N�mIc��>�/�W����y��T�Q|�0���g^������8�<����g
��4.!�Q���� x�u��h�r���P=\�K����47Myn����n��\
xq�hF�U4����*�T���P=C��@- ���G̙%���-��~pK���:gO�IӢ���[�%�%R)M�V���ҥ�7]�0,.�	��	��SA{�m��H� �_i�un�~u�L�ř�K�;qv��9v;�\)u���.ɅM�ƿ��;~��Tr��ɍ�"����'�b��>�[-�b���G�W���%`�6
~��ܞw�@�u,�Z [*��T��ԋj�J�,K�b�u�f�u�p��
�'1�Ӣ�?���k�5����d��^�����/qX�<��Z���~l������(Mb��?�܉|R����K�iYf�����/mw{��A�#����j @ �'d՛����+���5�쉝��4J�M��]�]��y�U�W���W��4_`U���Ĩ�-���DU+~��z&ٌ�T
����g�]�lj
vR����\���=Ʒl�Ht٬��i+�!�H#n:��	� �����τܦ�?�4���y9t5���$�گ�~Ew�,�G���-��_�O���F�3�8C3��9��q�G������E}�Q>�|�ԢKOW#G��=4�������}����
�4.��,Z5>O�]U�z��B_�ĲT�m*>���L��Y��"�6���d�M�?�����+��G[������'��Z6�id�P��\2�i�m��h��J2zv�S`"iyI�du5�\����/�tթw^l
kQ���'j�m�����{�m� ���L-��s� U�+�/d8e��!�'��;6�^��zz]�������+���+�ѥ�����(� ��۵���
��t�!խ��xz����-�$�0�sÓ��s��~��UuI�GC�DQRT5Q���Z%�'�X�,{D��3�J���8,�p"I(dC�ڭ�t������P�Ͱv�" 6Rc����\�}ɰ67AS���15�k��Sw��ooB0_�O�y��F���&IQ�
6�Ln�p�IQ�MKP�g�u�[&A�����y�NEލ��꛹?�����8ZUh�$�I}��J>VA
s�D���G_Z��B��u���]x�������:l��k��^(����6:���ד��0�ad\EzE�(P1�/R�m������\��~�@�qÆ��O�B�S�
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: ({ params }) => (0, codegen_1.str) `must match "${params.ifClause}" schema`,
    params: ({ params }) => (0, codegen_1._) `{failingKeyword: ${params.ifClause}}`,
};
const def = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === undefined && parentSchema.else === undefined) {
            (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
            return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
            const ifClause = gen.let("ifClause");
            cxt.setParams({ ifClause });
            gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        }
        else if (hasThen) {
            gen.if(schValid, validateClause("then"));
        }
        else {
            gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
            const schCxt = cxt.subschema({
                keyword: "if",
                compositeRule: true,
                createErrors: false,
                allErrors: false,
            }, schValid);
            cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
            return () => {
                const schCxt = cxt.subschema({ keyword }, schValid);
                gen.assign(valid, schValid);
                cxt.mergeValidEvaluated(schCxt, valid);
                if (ifClause)
                    gen.assign(ifClause, (0, codegen_1._) `${keyword}`);
                else
                    cxt.setParams({ ifClause: keyword });
            };
        }
    },
};
function hasSchema(it, keyword) {
    const schema = it.schema[keyword];
    return schema !== undefined && !(0, util_1.alwaysValidSchema)(it, schema);
}
exports.default = def;
//# sourceMappingURL=if.js.map                                                                                                                          HaD�^����HY���G`b�g���q��܋��~a�Yr(����>�]��v�l�% �@ ��bγ`���b��?��t��ʺ�`��mِF����q���j �Mv:�R͝��Q%InQ]�V���&��d8L�I9��0�$�)����Tq�mF w�9A�u�
E㰫_��%T�oVԶۼ�ng�<})�~��%� ��aU�f�S�L��K5�r�v��A���RUPMv*��N�޽�0�9�M��a�V�z�����h p��X��\�H#�r%Jbe8��8'���i?�B[��gAT�As��T���eI�b��5|�ܧ�宓��
y�~�]6r�Dr"�l.{��q{ض����-� .׋��ٓ�g�|��,[�+�P�_�^�0�kL�4�<X�wDa�r�
k?P-��&��87��	u ���Ռ>�;���{�ݒF�j'��S�L\�ɭ�(s��qm0���Wj��v%Ck�ԕ8���l�� �8Ww��ʳWV�� �����F�z3��-RX�Eq��'K�~��^*�g��M�q^$r2E�j8�e��Q��{�'����U�tjZ2���]qv��eθ��Q�U�예L{
�)n�,WQ���v�r�� ��Eέ����4K��u���0+5J,t4�Dl�zPB6�����Bd[�/Ղћ��pb5du��q4��q,����eo��	�+T{` �
���1$���4	�?�X��F�l�P.�,Z��e��rx�C���BQPoN�p��$�Z)���Ö�J�MS�/������C,1s��Іξ���d��ɂ������r�$U�/݁oU��+��&&C�*��o�[~��#C��u���hw���B(n����!�<�: P�9i�m�0AJq�y����:ŉ|F���$jO�h�r�9�T�0�ظ��;k's��,5�{����!��P�?��n���K������Dh���!��J�z�Y�y�9��u����K;M����l���ȶ	��5WJ��D�G�u��x���3,�z�̆�b���i6�w�����x��Fy�(����lb޺e��s��G0*��K!
ǐ�ނ����"�Lp8�hɐ�aŴ"1�������x�R���<�Ѩ�f�F�W^Ges��@'���"���3L�%p�Z�@a��5�nyݜ@`F��(i�!E�����k
 @��:�f�DUZ��EcT��
9ٻ%zm���:��E��x�o�t�HK�V��Y��� ��ݞ�Y�����ICZ�vSW
�wlփN�����{j+�Q�r�������.4J��_��������c^R�\  �0{�����g�E1&�8E�bq��[�T�*�)as�[#��2w1e�8�=y�÷ �f�&��m��.��1�;!�y7�`lvlt�*[��1Fk�?JU�I�3t	X��F:]>i�T����Ȅ��� d.�-�7	`HjͲ�c#�`@0�D0|�!�_�G檙SڰЭs�i���MG����Ca�$��>��Kw�JW�
TN�Ũ^TE[��55���V��Z��u"�p=䛿>�0`,�!�#B�}�8�DN��hޚ���;4�\���[M��=�}^ @?,69������e��G��@z�BH�����W���S��sRC7*�U���Y�D�d�q��,�?��e�(�s�.a��Rs?a 0�Z�/˕�bȻ6d4�:�~�pQ3���0���
X�}��H̱�aS�Sd}�Y�MU�����o37b�K�`6#;�ȹ	��]-!�DV�FG�A�����X*1�y���I�D&W-�I�3�eN�.`o0h�e�(!��f����d����Q�PS��0���ؒ��+��P�ǧ~e�a)�a+����B����5@�M��1�~���<|�D'|1@�6�
�%���Κ7a� ��`�ј��h�u��R�N�z��Fm׬>�7�l`��Q���J��z0aW��"Lp^�p�2
I���D���:~�FB���O���dv��5�P���dP�۲��\HO��f�u<�]���� C p$3����r`�O�:R�/�fG7�����g�h��v���g��q_��yln�(X8$�>H`%K,ا=oU�g0�M�;O#�0@G��{@]�!��"Ġ)jCr�Ԛ�s�扇�n?�\�5,��0�u��P$)�̙ ��ઔ+�Qj�ZMRt�L`�Rr����:s�'�`:�Mp�{��
��_��l��Ԛ��^S�˙o�{)Z������>�#*k�Y��H��]fZ��M��Ш����/���Rq_/2���Q�S��0
�,��{C�����	
\Z��h�����H����⍊7�.�y��{`�٣+H	�|�y����5�����A��ćh89f.uM�贍"@*� yH��^1P�ڲF����7��������b��J����j��Z�>�kb����b}	������Ny8�庒@��Jĉ&���$�g,��2�A�M�
��	�G�"�仔��pݵH�Y�� K�`���Q��쨒Q��}��|f�!��,^�S�s�5&o���T�k���uy|%]���r5�?��f���E����}�/w����t�2K3�'mJ܉&:��*��Q�;��,��y��)��M
#���0��ch)�ڗ��	�"w�G'X�v�Z떒�5'*>�ȿؾ�@���5�j�`  ��`'�Y#N,�{C�O�e�����Z#'.��nwc���}��fB��p7FO֊�/f�j)�ON	����o-V���H����c���T��kY��U�:x�'Ρrt�e�))@���5-�֨�T�"Fg�e���5i��!E�"gInLh�|NWx��q-:��D� ѹ��<���)��H�4X��`0���}Aʻ�f����8�+TK(�E�ݰlB��nb�. n
HV��df�#�Bt	��N�7x��u��3lԁ��t�2x�c���PE=�o;�q�N���@�o��R���@�f+���Ob֏��T�N��}�����RLS��Z۪���LMC���X���QY�;�##(%��a�;4�c��YdT�.�H�zj�5aG��1!�tu7Нk�j]ɾ�w�Iߠt.� �r�7�������C���� �*R��DQ��U�{��6+��_AX�fq�ײao��3�Z -L�Cb X�0n�n��@'O�"�|߶d��h:���E��T��t�B�L6�ŐyV��Y5ːF2�L��g��-�`# @0�:�\o�$C.
;��TZ�yD/iŹ%�j�y7�����1��V�������Z����#\�$�r;A��%,����rb��-7���k�v�I�s�����G�$�'��Om�5`Al9<��q��FM�����H���0���>��ɧ���V2[a������C�Ν:�� �=6�j�잟l���'�ӄS"�N=%�Nt����/dj�]+k��=Sr&��t�R��TL�@.�N��EC&H*'�_v��T�t�R�
������P5߸�9��wϗ_���X}^gց��'].VR6�W8�3�9`r쉘|@8����#f
E����3:HKUr��G	}]6�A's�G-�b��Z�X�K�UJ�ԩ��B�y�'	S4 ���m�M�	ת)U��;�L��jz�f�D��V�u����7-���1uX�&����Z
5m@HxME� �M�����+ؿ�7Ub��l� Fqi8����]Q<�C��A�����������U���7�Tώ$?�|�(�^�a��L`g�h@��B �8_N��E�+�W
QŎ����eA�<vGqd�50/v���Ƣ��!�E~�
jv��y|m�:��)���i#h>��T�
�h��c�� �ȻW�La�X��Eh���٤��R�jzn2$u����R���rn��~�6Ԑ���1��l�-��ɛ���=���g����1#S�IV��̅���̓�������i@_���E
=m.�xfE` DhW���#Ǵ�7�w+³�[��ι+s�m��j��eN����O�s#�#쾔�3��U�k��ܚ���bh0�"O�N�P��MuB���w"b쀨�' !\`v��$p�O���s�"���} :oN�;�Z㤕�U�r�?D��e���iV��x���UF6�0��z���Cٟ`q� ����}Y8x�Y����Y/eR�����\��1�z#��/���h����ϽJRA�C_
@���` �4T�����b�C����A�k:[�?��T�g���{���׿~�+����W��jKa&�Rc�v9� �ԗ��z��f�!a�'��&�r�.}�lx<�&l��R��a
�b�Ͷ]F�  y���I����
[v'd7�VgL"�ޘ��^�Dn�g@Vۻ���]�y-��0K�!�[�Ou�1&�#��U�{z?�
�6�wm\8�O
U���NC���^ZM�<�'�m/`��+b�H>�`��6�p�
���w��K����q����uo*|k��e?��(�5È��4Q+���a��$\��F�|S���� xE���7?��#���
�`�[ Ţ���c���%w�_X��TnFGT��CÛ��P-]��d�f0m��oF��50�V	
��B�@S�>�z*x�s�,]e\��ӾX��a���n�0X��S�A)�IA@T��Ta_}��'�-���{�\3s�D� @q���a�s�o�0%�b�S+�5���*3��R	�Z���h�]�����Ē��
�j�Z�'�Z�����Xe$�?!�!쥴�n�e��D����A��P
�vb��b�a����O��B�FQ������B�����iFz�ߓG�V�V�p
^~�Fa*VJ�[�chyҭ7;����a����G��e����Jh~�mOi�gG���o4��ݚ�x�u2����W�D���e@i��(Z��^\���]c9�`�z	�}�XTF��K������yu�zuGXC[4Zu�H��!"��$_ؚ<�%���3�Xg?��2�������b�3��T�45kC�r�w�	d��$��8��O������'4{��_ѱ��Lc[��h;k���'v^����즢����~!+�k�?E��E�]#NV��	*b�b2!iCUOLi܃�옽�Y��~"e��N�W�����j�ǅ�C25�Y��q��C(`U�i��GIQ�{�o�"��wr��)>e=AϚ�y8g�|e�&O�]� e�(�J�|ɪe.�p
A�h{��uNN��5��	k xUӘI�8�mǍ��r�&��6� F�n8l7h�'�$��T0���\GFU� a(�v�N�l�a��
C��P}F:%�[����l��+څj
Me����4&nIM� f�2Ϲ���AW4��5(������#���A
��H2Ca ���M;E9��$.�������-�8��bc��_#��E�F��������b��bh���m `Q���Ƃ8c����_�X�i�&��1���.:��2���Fk���q7���P������1#/��
�C)|��D�U�^�)E$=V;��KaYqZ>so�a�&Q�?
j�̪Z�=OlLţt�Lb�Vf��Mّ��-���/vr���vq��:/�
��P(:&ϟ�r��Ͽ/$��v�i�)�'t���y�Z�6	�s����z�N�h֭��>���D���ϼ�+��*c{b��A�x��]�h#�  6/��Jh�b���Y�
�,>y��T�lc;6~�)<E�	�m�v��Y�����2$r��ôj\ H<QY<�Q�&�ސ�|�K�����=f|y̩�ɩ�z�ܤA�ױ��i��*_�O��I>$���BU�F�H�kT��_����$T1��_3+��}��C_'�o���3����gn.}��hz�L�g!ч� �f~~�h�H?�(�9�Iq7v�Z44�zZ��]b��W�d������?��!oj��F?244q�A�(�@��~ҡF��"Z�Rbh}{���d������Y��@C�K���z ̫����\Ʀ��0���=Ի�:���OL]G^5�(F 
�Ĥ���m��x"�j���L�z����Cs7ƨj:1����"�z�z5E��[�����-1m�j�DX;�"1�сb�3L8_f<�&[5����׉1���[籾RgN��?���@.s�4��-� F'c�������򀈑v��w��'$U*H�4�2�(���G:7&���i}a�B�,"�'j*��a�#^�Xx$�(�%����dН�[=����M���؟
���
Ԫ��ot�C+��[>CK"�8���v���5��EqMLV4F��f"L�(8	XoJ�-@���*�}�a[P����:�Iu���Tp�џ7�;��;��k�X5 �`��E����3K�^w�8`���1�b7�����7�����N��yrA��{ĭ���"BC@�ۖ%�F��mw�-����U�U�̧�͝@*�;h��ApS���f���T2�zQ����=�T���5x$~~&�}G�>��j���ɟ5S�T�k�p�lɀ/��^�N� �2{�PG_�FsfOK�JR�x[�
import KeyValue from './KeyValue';
import { EventEmitter } from 'events';
export interface ServiceConfig {
    name: string;
    type: string;
    port: number;
    protocol?: 'tcp' | 'udp';
    host?: string;
    fqdn?: string;
    subtypes?: Array<string>;
    txt?: KeyValue;
    probe?: boolean;
    disableIPv6?: boolean;
}
export interface ServiceRecord {
    name: string;
    type: 'PTR' | 'SRV' | 'TXT' | 'A' | 'AAAA';
    ttl: number;
    data: KeyValue | string | any;
}
export interface ServiceReferer {
    address: string;
    family: 'IPv4' | 'IPv6';
    port: number;
    size: number;
}
export declare class Service extends EventEmitter {
    name: string;
    type: string;
    protocol: 'tcp' | 'udp';
    port: number;
    host: string;
    fqdn: string;
    txt?: any;
    subtypes?: Array<string>;
    addresses?: Array<string>;
    referer?: ServiceReferer;
    disableIPv6: boolean;
    probe: boolean;
    published: boolean;
    activated: boolean;
    destroyed: boolean;
    start?: CallableFunction;
    stop?: CallableFunction;
    private txtService;
    constructor(config: ServiceConfig);
    records(): Array<ServiceRecord>;
    private RecordPTR;
    private RecordSubtypePTR;
    private RecordSRV;
    private RecordTXT;
    private RecordA;
    private RecordAAAA;
}
export default Service;
                                                                                                                                                                                ��Vm��2�xl~[NRL�ӭ�c%�+U0��0��_�h1��Eu��f��զ��p���#_����0�-N��!�{K^��o~����T5�ȒTS}�
�$���z�u��B�&�~�j)K�C:_BFO����!E�9��z?�'3x��枮�"�a���>?@Q�<��Q%Ҏ.
�>�;��P���B�=G`�����φ
�V�Ȃ��l�3�Γ�#�c�	J�`h��WL��)j�:��)F��\L8�g>�'E�pӤ�!q=f��j#���nh��*	+�Y�m�A��A"��F���[�Z�����d��������3�xͻ�)3nO�3��{��Q�i%��]�{ɸ��w��u�NqR]� ����8@S K���7�)4{mU�@�Qxog���>��ZS��L4�z�e��5<)�o��P�p!������{�F��c��9���_�y��aa���K�Xs���´5#9�~�x��~X�L���$���t�/�U{)a�.Mi�����d p�� C&+��#(CwaO�]�k2Va?܉�E��i��&hѺ��9�a��?��:/�5����|]�M�h�+-��&��k�S���a��cj��q榋����%�%����6^5�	�Έ�ϡf�����г�8��b:&%���4�%�\����$�	�"!��O�LK����9<,p�aB�kvR�'%[�ީ���F���Z]P׶otV��{$����#�q3�jŹ
�?w/#q�CB�R��§?	C��y���h
����6�xoP��0>fJ7��L*)U7���X|����4Ӈiȃ ,U�~`���G���Γh�Emv�Wbmv)N�gu��cqw����"8����P�K.�谍���<Az9���:=H�ǅ�pY&Hx��4�/��3Y`�gBQ)2%�G�8̖.8����5�����@���i��O�ɯ3�.�]؀���٥y5�{�/��'ud�!!��F>ϑ���J��~'W���	��d��!�Rh�P�8L�|Q��ĩ����L�<Hƞ09($�85�6´��令����o�h�s�Ǣn}LOe`�d5��l�pP`�.#'� f0�la�W6s�˓�خҭ�.�(�
�����zsaF(�>�U�8��aYf�nCc�Ok� Z��9�O�������Jꁼ����$�T�L�5!�o�+��Y/y�s4�4s��b�'|#�}��ቃ�n�T�_��\W�DV1�r�^>�������[�m�C�&&P�r�~�[��a���@+�5A�G3��|;����v	�VTv���>h?�*>�b����&
���q��]ۿZ���  .nNx}�w���Y��/��iq��5$�65v�!6Y�,�ua������kj�<z��9	���&tǢ�#q0�nx�&��H,NG�����Q��(���CZ>�v�������;-�$�N��\C;=�I�h�{bL �R[o�딆Z�!?g�IZ�[F������*F��|/�|����yӪ��
(.]v$ J�n�d�K�˕�[�,��*���N���9����=�ڼ�'���RL���q�U uY��bO�K�t��	+A&�� 7p��%7�sF���7��o&��34ʼ�
�q��.�{��1��K~qV�������Y��W?��֩��_�j�����|+ bd�}k����01C�$�R Q��U���ʄ~	������=�I�il�������胾�/���bp; ���L���(�K�S �/}����"��.{�^�����rm�e�Ou6����4CB0#E�L�\xqp<</v�U�:s�!��#�n����AhL����ہ*�,�W� 6J��5��Po��j�G
A1.��`V>�7��"CO�9?�q.DQgq/	�����X�K}v̺��'���'G��2���?�ђ, 
��(�+���C��m�"�;.:����6��x�+Al͐Ȥh���OT}���Ẍ��D��`��+T�9i&|L
�J��D�<��y��PϘ@v̗��>ž4�8ձl�X��ƯT�XU��ϖ�o\�%Z1[[�+������̯m���<�uS�|@1�5�tN(+%�~^,��8s�L|���dD�u~�3M��<��a�/�����9�&��_(��5�S���N���C��%��T���|���G�Ѩdk�?����XK������;~�/��ϙ�
ŻʵLwN=,+y�������S��ZA�}P��Ϟ�@��{�a�t��e�n?��]�{ZuXa���h��N��k�Ct�5ČX�hH��2,�Sj���i0�e����f�1X��{����T��Z~�KS>G���jߨЉ��9=?Һ">3N6�Ar�d����{�A�@y�����D�`ȿܶƥ�
��K���i\���X�I L(fx�o©<6m�Ȩ�f�Z��R��)�5I�/����R��㡇�O�����o���4�
�, �)V�]�����ƒ�j�۫�>�ag�%�`pO{ZKF�'��TӾav[|.� ��RMƣ�h�U�����m ��eq��i+�ŵ�vH�BH�!�PPT�n��/�IL�ȦB��.���"��5�S/5}�B��	���<?.'6Le $` �U�f�o�jl �)+~���p��o�\��v)�.��
�����O��}G"$��A��g	�f�M�X\V簢�(���X���V�h"�(�+D���%��-�~�vv�T6�=9i$d����3��e$hS$3&n�\������N�6��I��ӥ�_I�``K�^�b/��'S��滗�٬L�+
y�J�͑����i|��}0 =�R/ɪy�b,�+�!�����!�~)�?��8�jb�	,������2X��^.nf+V*�M��fe��&K�Ժ�j�������)��_��ZqjTu���8R��9�����n�
AE[��P!Z-IdƧ�
K��V~�p�R	w��5SIE'���=r��ʖ'
���ek�q�S���dy�r7o=�J�MQ�I�s��-�P��_
,ӢU��n�ݱFf*�6�#6і�Ȓ/b�7�L]`�+˾X�)-\A����Bl��
~��3.A-���!�3®^V�e��b�*Ь��w�MM+���(��^��_��WYFpG  @�����P��0b�8ُ>t����ӈ[�_�9�H�b�{~��t"��(Hq'�� ���h�^�r�٧�:'��p�:�@�ta���W������`�6�6%&6R���ڢ>�M;�?:��M/
�~�d5��`Y���l5�C)�6L���A��>�᛺^�K>Aݡ��<�ܨ�މxF�;��0ߪٗ��>�In���w������rugu����$Id����݅Uв0$iU��33��i���%w(����S�.y�6�����J���
#��!�q2|�@��4�~��v��{eOxJ�umD�
���9���^.b*
���-�{�����=�&�k��±'�ono��W�U�-~�j	��>ͽ����f�hg�l������)��Аm-=���d��/��K��u%��r��s���6�k��}�[�"k�s4�zY������ғ��2�����0�c~4f�-�%�gqMH5���SE,��¢�uj/$����䟐�O��l�%tiek�\@]���e�Q;{䂖���rO?��[.��#��6�
�}�1EO��'8� ���?|r_�ZW70l�	]F�����d�D�,.&'Ԍ�>�3t{�u^��K��������%N���\]����<�6#b�bk\��5�W���05���a/�E{|-��e�&�:��Z
�f�0d�'w���E�O�DRP6�.����t�iO@9n? ��=�%L���Jx�F���1>���e�4N��<�L�;�K����bY���A�ܧo���5�T��@�h�n�^�����?��h����U�#"����F�!"��5�%Ex61%!�W�s�ړ*��Yu�y_�ڴ��8�6�獧�X��E(��P��&��k����N6��������-y2��]!y�z���L@����d��jL5��E ��q�����[Ęޱ�3}����x�t7Vo�:`�.2���G`v�Ͽ}ȊHqGe: %6�8�qQ1U���(`
c����j@�6��ۺp�Mś��R�Q;�)�)�?���WB]Vܸ��TpUd��J����ိF5�����_��p'Hq��Y]o*c����)U-F9W�yQ.T������P�.Vo��b�4�F5t���/Ѓ��/�;���|��C���(أ����9� �&�����uӣ����9��Ҫm��v��3PX�>w�{5�/�A�(���
BD�y��.���h���W}��>�,����_��"�X&`��ڛ�d.�C�ZfB��0(ڒ@�>Cw/�v�2�0$���kU�4�:TIt�Q����ơ����ëZ]�~>�f��u���L7|1I��l��d���O�
A� �/��P^j�s�d�����e7�́]�JJ����+��ȍ�~y
�
�|��Cӥ>����t.#���G3�D��Z̿��b�5��uD�)B��X�
�9�'�\r�a�O�ȋ%���^j��?��慻���K��]�c,2��ҡmOͮ��?o��Xajo��P�F=n�~�zW��X~�~��d���q0P#�|nd�9M0���.#��w�`|��W��
#>�:�]#G���H���[M�*��TK�W��V���\/�3��67��Gm�\���V��6��n��� ��g{/�a��N�����=��U�,��}��W(����De��Bg宨�ϰ/1�T�(�Tʿ�6+2f^|*��$�
���W�r&D��)z6߶l
&��N��<�pl�!�� '�����b��Uw����&���Da�VQT��8`Rl�Z&�0�D��k���FJ7�(b�3��k���������[�2,("@�SIzŨ
)�O���U���_�!�4A��Dz�Xvz~hAe��Vݫ���Q��r�Ƽ_T2*H�;]K}ӥp��v,ԣ���
�H;%�����m�,�c�u+�d��R�r�Յ�ږ[L=x�����V������)��(�C��I -ް���$�[e��r�\�2V�d��[T���a
;�����	�)�_�²�����ڭ�>����7z��	��TZ�a�JH�q,Sb�`Uq����D������ޤ'�%��%���(L�.���}����H��T�D�� ob�d�㟧���;�@���0 e�Iptr�L;�S�7|	�aܾ�C�(*{?$l��O����Ԗ�e�͑�_�s����~@}�jy���]�f�#�!���;e�<%f�8ylY�IO������w���h
k��a�N\���
B8����$e[�=��s��y����ά���J-�M����qC�����1�:�0�Z��k��UqIʄ�'?��O����
~�a��TO�c�Yį�ȓ�g�h�	,7���⾩�(�ű��Yf��Z��\�CŴ�pXԲ�o�<���罔��AD �Ù@(`H�P[�r,w>��e�bN|l#zL�je~#�h/�jO�W��|<�&*����x  ��xIu��LB��C�w��ҥ���W�K�0��
`��Rb�O�p���f�3�8��P�Є��;�q�8�	�2�Q�$�"f��픜���Ħ�~5Z����au7��:\XC�2q�FI4���8^��ܥ-�Xjiʰ�+��'�ӈ#�S?�r��썰���y(s"��	9t�`}����7��2)��U,�9�rΊ�Ʃn�W�5�?[�~P�4@���#Fj+�S�N���l�s,\�+�@eT�����~!+���я��G��0�(�NC�c�Aþ����Ku'�+K�����õ��4�D<B��������+�g6��t 
���7I,�4���љ���Vǔ��ۢf8o����sǣ����;�� ����#���
1�.Ccm���D���R��%#�����M\rHdd'JJ�I�����X�"� {����I˻砷�|cc������S�_j�
����O��e+g�o�����%D��.�^OpU{�[Go
z�:�z�&_%!�P|F��\�fi�����'8�
83�A��aD����-�A�GF2oG:���X`��L#/I��	>�}�j�nJ򸇒�ȋSr 2D-�"64x1!$"���))��p�y�#Qp"���(�6�3#�[���i�e=n1�Io1��i�(t	S��{���e����L5�������N�����JW����Yo)����9�_w�W�Ku�|me��
�'��ע1p�@iq��c{���]�BEnT�F���bmE�]�x�.G�g{*����M����3� �	�t��ԏ�$��x�:;N:!�ь�G*8�?si�KP�#p�o�-e�4x��5mc��)�v�$DYN|��#v�jϵ�����or?-
��Yieu�4�MuU�F1g��	�s�<�غT�����<[~�.��������/y��`�=��� �4+K(\w�����g�6<@�(��(Nu�ɚ���N�J��w�>=��j��&�� ���i�v߅7
0�bk|ic_FǶ��7�Ӷ���V��O�'9�Xϡ�P����D+�ͳI����#��EA��=�ű\���!�2�1���-��	Xx�Ep���T����Zh[���U�c泾҈�����0!f�'	$G~�AO�d̍F�b���P��1�t%���q7B��z��,dAB]��Weo���s�|(m
�X��Ɛ��J�Oje
%d�����o�̌�1~E�^�N='�OBZx��
    "additionalProperties": false,
    "type": "object",
    "properties": {
        "additionalManifestEntries": {
            "description": "A list of entries to be precached, in addition to any entries that are\ngenerated as part of the build configuration.",
            "type": "array",
            "items": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ManifestEntry"
                    },
                    {
                        "type": "string"
                    }
                ]
            }
        },
        "dontCacheBustURLsMatching": {
            "description": "Assets that match this will be assumed to be uniquely versioned via their\nURL, and exempted from the normal HTTP cache-busting that's done when\npopulating the precache. While not required, it's recommended that if your\nexisting build process already inserts a `[hash]` value into each filename,\nyou provide a RegExp that will detect that, as it will reduce the bandwidth\nconsumed when precaching.",
            "$ref": "#/definitions/RegExp"
        },
        "manifestTransforms": {
            "description": "One or more functions which will be applied sequentially against the\ngenerated manifest. If `modifyURLPrefix` or `dontCacheBustURLsMatching` are\nalso specified, their corresponding transformations will be applied first.",
            "type": "array",
            "items": {}
        },
        "maximumFileSizeToCacheInBytes": {
            "description": "This value can be used to determine the maximum size of files that will be\nprecached. This prevents you from inadvertently precaching very large files\nthat might have accidentally matched one of your patterns.",
            "default": 2097152,
            "type": "number"
        },
        "modifyURLPrefix": {
            "description": "An object mapping string prefixes to replacement string values. This can be\nused to, e.g., remove or add a path prefix from a manifest entry if your\nweb hosting setup doesn't match your local filesystem setup. As an\nalternative with more flexibility, you can use the `manifestTransforms`\noption and provide a function that modifies the entries in the manifest\nusing whatever logic you provide.\n\nExample usage:\n\n```\n// Replace a '/dist/' prefix with '/', and also prepend\n// '/static' to every URL.\nmodifyURLPrefix: {\n  '/dist/': '/',\n  '': '/static',\n}\n```",
            "type": "object",
            "additionalProperties": {
                "type": "string"
            }
        },
        "globFollow": {
            "description": "Determines whether or not symlinks are followed when generating the\nprecache manifest. For more information, see the definition of `follow` in\nthe `glob` [documentation](https://github.com/isaacs/node-glob#options).",
            "default": true,
            "type": "boolean"
        },
        "globIgnores": {
            "description": "A set of patterns matching files to always exclude when generating the\nprecache manifest. For more information, see the definition of `ignore` in\nthe `glob` [documentation](https://github.com/isaacs/node-glob#options).",
            "default": [
                "**/node_modules/**/*"
            ],
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "globPatterns": {
            "description": "Files matching any of these patterns will be included in the precache\nmanifest. For more information, see the\n[`glob` primer](https://github.com/isaacs/node-glob#glob-primer).",
            "default": [
                "**/*.{js,css,html}"
            ],
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "globStrict": {
            "description": "If true, an error reading a directory when generating a precache manifest\nwill cause the build to fail. If false, the problematic directory will be\nskipped. For more information, see the definition of `strict` in the `glob`\n[documentation](https://github.com/isaacs/node-glob#options).",
            "default": true,
            "type": "boolean"
        },
        "templatedURLs": {
            "description": "If a URL is rendered based on some server-side logic, its contents may\ndepend on multiple files or on some other unique string value. The keys in\nthis object are server-rendered URLs. If the values are an array of\nstrings, they will be interpreted as `glob` patterns, and the contents of\nany files matching the patterns will be used to uniquely version the URL.\nIf used with a single string, it will be interpreted as unique versioning\ninformation that you've generated for a given URL.",
            "type": "object",
            "additionalProperties": {
                "anyOf": [
                    {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    {
                        "type": "string"
                    }
                ]
            }
        },
        "babelPresetEnvTargets": {
            "description": "The [targets](https://babeljs.io/docs/en/babel-preset-env#targets) to pass\nto `babel-preset-env` when transpiling the service worker bundle.",
            "default": [
                "chrome >= 56"
            ],
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "cacheId": {
            "description": "An optional ID to be prepended to cache names. This is primarily useful for\nlocal development where multiple sites may be served from the same\n`http://localhost:port` origin.",
            "type": [
                "null",
                "string"
            ]
        },
        "cleanupOutdatedCaches": {
            "description": "Whether or not Workbox should attempt to identify and delete any precaches\ncreated by older, incompatible versions.",
            "default": false,
            "type": "boolean"
        },
        "clientsClaim": {
            "description": "Whether or not the service worker should [start controlling](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#clientsclaim)\nany existing clients as soon as it activates.",
            "default": false,
            "type": "boolean"
        },
        "directoryIndex": {
            "description": "If a navigation request for a URL ending in `/` fails to match a precached\nURL, this value will be appended to the URL and that will be checked for a\nprecache match. This should be set to what your web server is using for its\ndirectory index.",
            "type": [
                "null",
                "string"
            ]
        },
        "disableDevLogs": {
            "default": false,
            "type": "boolean"
        },
        "ignoreURLParametersMatching": {
            "description": "Any search parameter names that match against one of the RegExp in this\narray will be removed before looking for a precache match. This is useful\nif your users might request URLs that contain, for example, URL parameters\nused to track the source of the traffic. If not provided, the default value\nis `[/^utm_/, /^fbclid$/]`.",
            "type": "array",
            "items": {
                "$ref": "#/definitions/RegExp"
            }
        },
        "importScripts": {
            "description": "A list of JavaScript files that should be passed to\n[`importScripts()`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts)\ninside the generated service worker file. This is  useful when you want to\nlet Workbox create your top-level service worker file, but want to include\nsome additional code, such as a push event listener.",
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "inlineWorkboxRuntime": {
            "description": "Whether the runtime code for the Workbox library should be included in the\ntop-level service worker, or split into a separate file that needs to be\ndeployed alongside the service worker. Keeping the runtime separate means\nthat users will not have to re-download the Workbox code each time your\ntop-level service worker changes.",
            "default": false,
            "type": "boolean"
        },
        "mode": {
            "description": "If set to 'production', then an optimized service worker bundle that\nexcludes debugging info will be produced. If not explicitly configured\nhere, the `process.env.NODE_ENV` value will be used, and failing that, it\nwill fall back to `'production'`.",
            "default": "production",
            "type": [
                "null",
                "string"
            ]
        },
        "navigateFallback": {
            "description": "If specified, all\n[navigation requests](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests)\nfor URLs that aren't precached will be fulfilled with the HTML at the URL\nprovided. You must pass in the URL of an HTML document that is listed in\nyour precache manifest. This is meant to be used in a Single Page App\nscenario, in which you want all navigations to use common\n[App Shell HTML](https://developers.google.com/web/fundamentals/architecture/app-shell).",
            "default": null,
            "type": [
                "null",
                "string"
            ]
        },
        "navigateFallbackAllowlist": {
            "description": "An optional array of regular expressions that restricts which URLs the\nconfigured `navigateFallback` behavior applies to. This is useful if only a\nsubset of your site's URLs should be treated as being part of a\n[Single Page App](https://en.wikipedia.org/wiki/Single-page_application).\nIf both `navigateFallbackDenylist` and `navigateFallbackAllowlist` are\nconfigured, the denylist takes precedent.\n\n*Note*: These RegExps may be evaluated against every destination URL during\na navigation. Avoid using\n[complex RegExps](https://github.com/GoogleChrome/workbox/issues/3077),\nor else your users may see delays when navigating your site.",
            "type": "array",
            "items": {
                "$ref": "#/definitions/RegExp"
            }
        },
        "navigateFallbackDenylist": {
            "description": "An optional array of regular expressions that restricts which URLs the\nconfigured `navigateFallback` behavior applies to. This is useful if only a\nsubset of your site's URLs should be treated as being part of a\n[Single Page App](https://en.wikipedia.org/wiki/Single-page_application).\nIf both `navigateFallbackDenylist` and `navigateFallbackAllowlist` are\nconfigured, the denylist takes precedence.\n\n*Note*: These RegExps may be evaluated against every destination URL during\na navigation. Avoid using\n[complex RegExps](https://github.com/GoogleChrome/workbox/issues/3077),\nor else your users may see delays when navigating your site.",
            "type": "array",
            "items": {
                "$ref": "#/definitions/RegExp"
            }
        },
        "navigationPreload": {
            "description": "Whether or not to enable\n[navigation preload](https://developers.google.com/web/tools/workbox/modules/workbox-navigation-preload)\nin the generated service worker. When set to true, you must also use\n`runtimeCaching` to set up an appropriate response strategy that will match\nnavigation requests, and make use of the preloaded response.",
            "default": false,
            "type": "boolean"
        },
        "offlineGoogleAnalytics": {
            "description": "Controls whether or not to include support for\n[offline Google Analytics](https://developers.google.com/web/tools/workbox/guides/enable-offline-analytics).\nWhen `true`, the call to `workbox-google-analytics`'s `initialize()` will\nbe added to your generated service worker. When set to an `Object`, that\nobject will be passed in to the `initialize()` call, allowing you to\ncustomize the behavior.",
            "default": false,
            "anyOf": [
                {
                    "$ref": "#/definitions/GoogleAnalyticsInitializeOptions"
                },
                {
                    "type": "boolean"
                }
            ]
        },
        "runtimeCaching": {
            "description": "When using Workbox's build tools to generate your service worker, you can\nspecify one or more runtime caching configurations. These are then\ntranslated to {@link workbox-routing.registerRoute} calls using the match\nand handler configuration you define.\n\nFor all of the options, see the {@link workbox-build.RuntimeCaching}\ndocumentation. The example below shows a typical configuration, with two\nruntime routes defined:",
            "type": "array",
            "items": {
                "$ref": "#/definitions/RuntimeCaching"
            }
        },
        "skipWaiting": {
            "description": "Whether to add an unconditional call to [`skipWaiting()`](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#skip_the_waiting_phase)\nto the generated service worker. If `false`, then a `message` listener will\nbe added instead, allowing client pages to trigger `skipWaiting()` by\ncalling `postMessage({type: 'SKIP_WAITING'})` on a waiting service worker.",
            "default": false,
            "type": "boolean"
        },
        "sourcemap": {
            "description": "Whether to create a sourcemap for the generated service worker files.",
            "default": true,
            "type": "boolean"
        },
        "swDest": {
            "description": "The path and filename of the service worker file that will be created by\nthe build process, relative to the current working directory. It must end\nin '.js'.",
            "type": "string"
        },
        "globDirectory": {
            "description": "The local directory you wish to match `globPatterns` against. The path is\nrelative to the current directory.",
            "type": "string"
        }
    },
    "required": [
        "swDest"
    ],
    "definitions": {
        "ManifestEntry": {
            "type": "object",
            "properties": {
                "integrity": {
                    "type": "string"
                },
                "revision": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "url": {
                    "type": "string"
                }
            },
            "additionalProperties": false,
            "required": [
                "revision",
                "url"
            ]
        },
        "RegExp": {
            "type": "object",
            "properties": {
                "source": {
                    "type": "string"
                },
                "global": {
                    "type": "boolean"
                },
                "ignoreCase": {
                    "type": "boolean"
                },
                "multiline": {
                    "type": "boolean"
                },
                "lastIndex": {
                    "type": "number"
                },
                "flags": {
                    "type": "string"
                },
                "sticky": {
                    "type": "boolean"
                },
                "unicode": {
                    "type": "boolean"
                },
                "dotAll": {
                    "type": "boolean"
                }
            },
            "additionalProperties": false,
            "required": [
                "dotAll",
                "flags",
                "global",
                "ignoreCase",
                "lastIndex",
                "multiline",
                "source",
                "sticky",
                "unicode"
            ]
        },
        "GoogleAnalyticsInitializeOptions": {
            "type": "object",
            "properties": {
                "cacheName": {
                    "type": "string"
                },
                "parameterOverrides": {
  "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_1 = require("../../compile/codegen");
const util_1 = require("../../compile/util");
const error = {
    message: ({ params }) => (0, codegen_1.str) `must match "${params.ifClause}" schema`,
    params: ({ params }) => (0, codegen_1._) `{failingKeyword: ${params.ifClause}}`,
};
const def = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: true,
    error,
    code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === undefined && parentSchema.else === undefined) {
            (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
            return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
            const ifClause = gen.let("ifClause");
            cxt.setParams({ ifClause });
            gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        }
        else if (hasThen) {
            gen.if(schValid, validateClause("then"));
        }
        else {
            gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
            const schCxt = cxt.subschema({
                keyword: "if",
                compositeRule: true,
                createErrors: false,
                allErrors: false,
            }, schValid);
            cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
            return () => {
                const schCxt = cxt.subschema({ keyword }, schValid);
                gen.assign(valid, schValid);
                cxt.mergeValidEvaluated(schCxt, valid);
                if (ifClause)
                    gen.assign(ifClause, (0, codegen_1._) `${keyword}`);
                else
                    cxt.setParams({ ifClause: keyword });
            };
        }
    },
};
function hasSchema(it, keyword) {
    const schema = it.schema[keyword];
    return schema !== undefined && !(0, util_1.alwaysValidSchema)(it, schema);
}
exports.default = def;
//# sourceMappingURL=if.js.map                                                                                                                          ��.b�@e Q�ζ^̤�d�X�~%��)5���ב�!a�P:j���*���TP0�����/R�ɍ��i�h��q��������! �����o���x�C"�^���u�#;��3�֒��R�8�pc�)rev�ź�ͫ��e_��Jj�-
/�q0G  �a��^ٗ�	��NR	��
���%G�}�v�Y�2�ö�%����[��_j>�k"X�n�0Z�B,)�B��Ж9���JL,$ѷ�͂�����i���3��%�A]�G���{����A4jJ�Ĝ_�x�ۄ�" ���e�|�AY5�����c���k���.j>�T���^���Q(�	I�x�nA%��۳�G���>�>L�3x��yk�_���KM.���
@�W�>���}�V�7]���7w�-��A	}�?��> 3Ij�+a����7� �@ɿ~�m�VS^��Q�A�N��D�cnR��_'�K&2O&�ޔu+���T͛'��~Ɲ

��� H��?������IĂ^�JTf���ĘOzA��=à��m���m�/co�0nu�g�߻�6�N�s����>�:1�*Go!�C��!cd�N�G�&�Z��Ȃ��B��R� ���"\A�`XrjUD\Neq'�ɕ�s��y'UV�$H�@f����1�.�f"�^��X�Ce�2$��������b={��(�R d*N�������ב���|��b	9(�"3�3��W��-x:�nZ����	���� ��(3��bv���ɥz�x'��������O��|(���Z0�UgY�0�r���I�D�{��&ϟ��)� ��_o
�UuSw_�T��jZ(�)~U��Z���HG��H�`��L"�� �B>��{Gē�ư�C�h�d2�o	���d8�:�� )�  `�<.�&�Z�9@�b (�zW�a��}�j��c��b:�ט�j����B0�S1��A�m�����d1�"��S��P�R4�Ǯ�k���Yp�`���݅eW��K;r�h�#�/��&�Y�\���7[$��q�-ee���u���,y>�`�S���
��be��F�}?�<��+e	���0 �#ہ�T6M�9��啅�]P�Ľ�c96�8�D�
����G��T�~f?�J�Q1��蘘fG��u�iu���5�WW����	����R���7���ô��?�!}��5�B��XB���瑖�tN,yDq��r��زL�t�����o�7�=�s#߫����Hy�ۆW��
M7�|r��}�i�����T���$������!��eJ�?�4!��']�G�ٛ�`�G	C�jk��8Ьq���4�[��d���S�G1 �nb��4s�/S$��
����ZKN�>43�7�G��fx�͞L�
~���E����yjdx>�N�ە�{�*x�	�'�x� "���[pZBTܨ��7�Q�"�9������*��f骤��B+����#X�� խX�F�����3�[y�
FL�]W�L	��(�ˀH<�9d	�MjS�$n�PṮ��c{J-0x��2s:���;MZ��JG ��YWS�+l'nN��-(�����P�����v�M���=Ss�N�^�Nϵmh�{�~�����D1���K�����P �ږ��;��W5mB�(j�>A:�3��y�=� =����Gz�B�*v��oY�s�L�?���բ�0J-������^��I�&�BL��Fk�;KJ�����QL��q��b�ժ����Z�R��{UY� �܋]q�ȴ���W;5��C��Q�rU�PQ�
��
!�ܽ��à�݀߹�ܖ�bUrV������흌c�x q����Ä�,*�>h5��5��7	-�N1Wp"��0n���
���Ƌ�?�Hu�+��� �g���S�
�=h-��'������ *�_��[����%��`�����P��0d��Q� �k����B/�.�����Y�j���D����g%�d.�5�`P
S��7��a�J59��=�-d��D57�X���j���wkuDY�~7�H|�݁
�� �?������45�c�	�L�WD+���x�L�T#1>�Χ��Ow߶���	���R�\V�z�%
�5�^�Hα��|�pO��CR��%�FY����z �ӚUC ։�j�*�P�A�=���dfIL}�I�x{.
�WP�N��o��D� ���a �
T%�8���� @d�,�4����?�����ⷭfL�[�Ԥ@�����G�~������Q�W��G���/�l�l3VXZQ��	y�T��B �����_���)Al��q���-¥w�q6J��mqx$��:�>�� ��; �
� �6
��و�����̕�9�֏3�r���e��0��?�S��?Y�R�P�ޙ;��i���6Z�7�?�  �g�(,�WU�M)�r���a�z��+JJU����)�
^*�,��5�(���>6Gw	Z8��հTyX������e��q(7�bR9�Tl��#�	u'6�^:��2�,DF�p
��������5䢉�Mk�KΛ������9/k�m�|*�_Zϳ��,�+�
#E=��F���Ŏ"�A��� QARHA��̭ y#���L6�~�@� ���k��r�Y�@�(*�ɉ�L)�˝6�,�v��\kI	��2�H��%���<`$��9���u����\��������y �A�W�&v9Y�L�0{'J-���$x���p�>��:
E��C��s�'��̓����v])����= P����T�����(~W�3�n�!��!���\M�49w�:�
E�<�v/"P- ����,���'
O���3ȕ�֒��g~L���:$��J�r7G1�$�!R)�#�����(�Hתn��u�����=��D�����$"F�0�<ӳ�a8I�����3���B�w�����~B<Y��/O_�9�7'y5�?F�� ��u�8��X��[
ݘ̋0k0Y>́1�)�G���W�Q��%��P�t2��e��y��5$�lo0�jQ�����܊ )��%��(G������a�^d9������o�|E�*`��	���!
�����u
��o��?%#W�/h��F�4{�n��GJ��N��4}fx��2zU�j1l����󃴴#KȨ�[��S?u8���	�������>���X��@���d<L-�e  �Ĥ� S�(�����B�x�������
g���9���.�Es޶;��Y�_W�)� ���
k1}xRL-%�� ћz��$(ȳ�c,v˟�}ҍ��>z:�D��*�o�	�t�c�����Q9��_�������;�%攘��^��6��q7;��4&F/�%T�	�ƞ�"�,�U
�)��ʪ�@���3uX��K��K�@�
 �[H��D��BB� E�B#2��J��>I4�t~i�l��H����9������F�w6"��a�a�8jj6�A��W�T7��M�f[��F5+S�g�U|�IK�!:�M�;�tk����Q���$v�F�U�3g �V��P�>���M
H2���#C:���lB�J�`kƭi��N��y���.��bgI�7~��S�$�����s�Z���*��Q(�K0В�� �+����P��ğ#�
{���?�A����[k3��ٹ�n�i��~Q!%]�����Qɟ�3Ǧ���0T/,-��92'Q�+�6��Q*X@`
��,ڰ�Ĵ!#�OỖ;}5���Kr�^���YD�K�ҕO{�V��e��cqo^`�aR�HEѥ��"�l�18�=H����#�_Ȟ��R��������d P�;F���gFEď|�L?7���
Gc�8�1*-�t��-&��(���F�;H�\�f���kV!�	a+�@&�LW4�����@+�F�_n�]��y�s�[�ҋ��3۳I\�u�d�ƦriY4h�j&�hN�E7����vk��Ҍ�Ѷ瞘2'sn�#@� }��I���#��z�-�J�0�
�?��TH�ćUd)F�u��[�{�w�.v��~���?�P3l.4kC [�H����ЦV����E�`�M����1�"��cLJ��HDf�	�LI��ﱘ},�82�)�悉0�8�{J����5T�P�
2��V�Lވ�-���e%������C^�Ǵ�n)���&��G,ca}88� ��7)ؠU!��&7Q����ou3s̿&��b�J���f|��E�\����v
F
W�bh�_J���d_�X�����4;��г,�Cf7���&J�D���A���c��7h$6M�E�«��J#�f�T��%�Q	����.�갾�4C[�n�?��VFI	y��b^0���c�R=o���]g�
9.D����r���Vz
dV'�#�FF������^�	U`9��l��w�w�A4�L:��˺�V&��Y=��.�ʖ��u�� @@� �x/�Z �N,�2�WɎ&"ƚ��nh�C��_r�}�
�b̜�3��x�"� �<��>ݟq��E��B3���߁&��P}���	2����b	�w:����Z�K19�˗M3)�?�� ��w����l!ϴ
Q���Xx���;�="9�#��tq``Q�'���޹�T���O��_G�����֤Ӗ�h�j��Lgf�2hq��j���(�>̠I� �՚1jZdm@I�&�>~��u�u��b�:>KD @��w�w��!v]&S9�����]� 2,"��THe'Pf��D�`�<���yG�v�o<{	-EYk��9�F�Y8��}�T]��O�?�h,�˺�
⩎����"��$��b���?�u�ZeQ\Y���Oe�n�(�@+��s"RM����t���?�g��n�
��������dIWf�˸^�q����*�HKH�c�������j4 G���ݔ��X7��b���Ki2�>N��k΢*�8מ(�Q%<�q#�n��tK�X2̖~o�˷�ݢ}+Ұ�\��z��X��a��:��r=��=. �a ADU����`�l���'l��j��k7�ԅwB$׏QOڙ��A&"rI��92V�ҷ`:�mm� ����^_i'RKg����&7� �o>�j��_4*���m�񸰬qcqiѸ��v�U�T�3�c^mN��j�­ ro��)  W��E��"�����T�_�Se�㘲a#؋�Pm�i�1{��-/]���Ј��a
�қ؈��?�p@y\)ILƒ�t��N3��x?뒘#7fՉٓ`曔�h0�D������I��	X������Ḙ�l�9��;�º�S���G�b{A�Jc��V
g�R�TP~�v�l�V�&�6�|���k�ɂЗEf�qH�0��&��CX��> )��J�.5���a�ۉ�B�=ZV�}�U�]��O�uP�&Y���1*q��C��f�y�%�?۲hx�Z��0T�޾L�����&;�rzy6BT������n!mWE'ڂq����u��{��4�N��㣩R�,�����0��X���󾛙��'�����&?B-������q����y��."�
�q� ��L�� zh�b��Z��|�r(م۟�C�4B1�B*���bَx�5Y�^Oʢ!���3��5B�!iv����`Y@[e�iy!��^�l������2��+��A��_�.�'� ��T?"v�u}�y�~JY�.���1���a4B����	dU�5�E6��\O)
�<t�$9��$&\v#�pdn��LG(�>�ѳ���6f��~�dB�����	� (�^�@�	3v��R�j?��*q�uvѣB_�X	11�'�'ê�z�	��#���n�&/�-�1���G7�\�v���\�s�_�q�hϱ@��Srh�_�Փ~�`�|\8��(%�L�)�L�l����&I�r���GD�b�Y$0�����1+=OQ�n�1>XR�#EZ�z��X�bo���J�Y�؊�u�MS����9�14�g;��#����6Ͷژ�I$0<�m� � H%�{����1i��V��a�����^��{p��AƦ;s=Wࠎn��P�PX<T����S�)ٳ�oe �,<��Es���q]2��iܟ��_��h`�-6�)�����eB�8��LL?6⪸��������1/>�ܸ8�ԡ�̎G�����t4�����GX�O�k6_$M�6^�g�~Ʌ�6���J$��")�&�p5�x!S��q"���~�#�f����h<K�B��Z�tW�s������mo ,ӹͬ�  Tw:S���G��v&D���i��&��2�N��j���[�����O��	2�_�"��f������BI���S(}�_���,dE�)��	7�eЂ��e����t��:D�n��dE2�8$��;9��W�l��g?\/G����S�|��6�H"�
xyZJOb�����bcZ���Iu	gñ��/�i)N9���D��}Z�#4Bb��p��l�A�� ��G���:8��h�u�ы���R�,��+mYx�d��I�o$�0Q��Z,�
��:����<���p��.NB�	�JD�L�!�u�J�uN��ĝ���0T���[h
��)k���Wl4Y�1mw�^������#$���*����81p"��Yñ'����?ѷs�CDH�uP.Q�Z.�1᝿n�7��;FTeB����ٗ>e��)�J���<�;��l)m�_B>r�[~�ݱ�
4K�0T%�4
���G3`F:&�S	~��^K�*��m�h�A���x��Nf6�� �q�44�s����
'=o��A,�'&�A*;�
���v.miZ�<3���6�&��1?�Ƭ��I� %9��M�CC9��b�@�$����+'R�����.p��������NC�U-���1�� ��L<y�;�`�lw ��Y�Wѐ�3^��qi�AG#�^}���c"TǪ�(v@)�e>���`�R����f&38i��ȩB���;�ٞ%/)�^
Ao6��f\�\x  	�X����w-�$�F�	�q���6���ԙH����c/���Nu��ov{��`-���<R`	��g<eJ����������ylA�R��t�]�2�=px��j�aI������ׁf0�2U��|^�O�޲�����Ȫ�8�;���r���:�thé� ��W��
S�g�'ˏ:�XM.�L�6g��6�����0�8M�>�C��cf�\
T����b��?�)(	a���'�aiۭ<$e$�][$"���u�����i�����,�Y^�5&+F���5B�ҹ�\�w$�<ɑ'ܤ	���.%�q������i-B'(ۦe��HC��hM��s���oX�A��P�8Qc�e<�H
E�-�n��?�҇�po���dbs��.�+l=k4}Կש��,_A��{��_+&�PZ�Ag��~�q�v-%�F�;9�����!"���6x�o(GbݩL�.�O�By���U��w���[B�n�Y��;�-�_�a�K�/N[vMW�)�C�F"�'.�2�i��&84�o����r�JZwĊ[^�V�MEc�������?mW����>	*� d!���P#{�
@ݩ��#����.�p]�<Ae)Z8���� Л�`�x�iP�vxtL�-�x�}���"�f��%QۈV���1��?۵n�$�S�a��Z�*�}=���S����4B�����i4�3�g��ēnO� C�����j���7�{����	��lƵ��O�?���B�B��b`y"���mɤCmx)��ٙVK�n����l�TO�����BO�S��W@\��/	"Y��}�(�5�=��#�(2����ڃ���k*�r�
�6�*�|a����ac�k
l\�`�9�u�Z]*�`	���Q����>ng-Ƌyyr�z��k����"�G���=�Wz�l��` �<��yԦ��Z�#�Z6����h��Ӱ�3����K]A2�������6���E��������mLM�#NVr�it-mask-origin":"[<box>|border|padding|content]#","-webkit-mask-position":"<position>#","-webkit-mask-position-x":"[<length-percentage>|left|center|right]#","-webkit-mask-position-y":"[<length-percentage>|top|center|bottom]#","-webkit-mask-repeat":"<repeat-style>#","-webkit-mask-repeat-x":"repeat|no-repeat|space|round","-webkit-mask-repeat-y":"repeat|no-repeat|space|round","-webkit-mask-size":"<bg-size>#","-webkit-overflow-scrolling":"auto|touch","-webkit-tap-highlight-color":"<color>","-webkit-text-fill-color":"<color>","-webkit-text-stroke":"<length>||<color>","-webkit-text-stroke-color":"<color>","-webkit-text-stroke-width":"<length>","-webkit-touch-callout":"default|none","-webkit-user-modify":"read-only|read-write|read-write-plaintext-only","align-content":"normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>","align-items":"normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]","align-self":"auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>",all:"initial|inherit|unset|revert",animation:"<single-animation>#","animation-delay":"<time>#","animation-direction":"<single-animation-direction>#","animation-duration":"<time>#","animation-fill-mode":"<single-animation-fill-mode>#","animation-iteration-count":"<single-animation-iteration-count>#","animation-name":"[none|<keyframes-name>]#","animation-play-state":"<single-animation-play-state>#","animation-timing-function":"<timing-function>#",appearance:"none|auto|button|textfield|<compat>",azimuth:"<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards","backdrop-filter":"none|<filter-function-list>","backface-visibility":"visible|hidden",background:"[<bg-layer> ,]* <final-bg-layer>","background-attachment":"<attachment>#","background-blend-mode":"<blend-mode>#","background-clip":"<box>#","background-color":"<color>","background-image":"<bg-image>#","background-origin":"<box>#","background-position":"<bg-position>#","background-position-x":"[center|[left|right|x-start|x-end]? <length-percentage>?]#","background-position-y":"[center|[top|bottom|y-start|y-end]? <length-percentage>?]#","background-repeat":"<repeat-style>#","background-size":"<bg-size>#","block-overflow":"clip|ellipsis|<string>","block-size":"<'width'>",border:"<line-width>||<line-style>||<color>","border-block":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-block-color":"<'border-top-color'>{1,2}","border-block-style":"<'border-top-style'>","border-block-width":"<'border-top-width'>","border-block-end":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-block-end-color":"<'border-top-color'>","border-block-end-style":"<'border-top-style'>","border-block-end-width":"<'border-top-width'>","border-block-start":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-block-start-color":"<'border-top-color'>","border-block-start-style":"<'border-top-style'>","border-block-start-width":"<'border-top-width'>","border-bottom":"<line-width>||<line-style>||<color>","border-bottom-color":"<'border-top-color'>","border-bottom-left-radius":"<length-percentage>{1,2}","border-bottom-right-radius":"<length-percentage>{1,2}","border-bottom-style":"<line-style>","border-bottom-width":"<line-width>","border-collapse":"collapse|separate","border-color":"<color>{1,4}","border-end-end-radius":"<length-percentage>{1,2}","border-end-start-radius":"<length-percentage>{1,2}","border-image":"<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>","border-image-outset":"[<length>|<number>]{1,4}","border-image-repeat":"[stretch|repeat|round|space]{1,2}","border-image-slice":"<number-percentage>{1,4}&&fill?","border-image-source":"none|<image>","border-image-width":"[<length-percentage>|<number>|auto]{1,4}","border-inline":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-inline-end":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-inline-color":"<'border-top-color'>{1,2}","border-inline-style":"<'border-top-style'>","border-inline-width":"<'border-top-width'>","border-inline-end-color":"<'border-top-color'>","border-inline-end-style":"<'border-top-style'>","border-inline-end-width":"<'border-top-width'>","border-inline-start":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-inline-start-color":"<'border-top-color'>","border-inline-start-style":"<'border-top-style'>","border-inline-start-width":"<'border-top-width'>","border-left":"<line-width>||<line-style>||<color>","border-left-color":"<color>","border-left-style":"<line-style>","border-left-width":"<line-width>","border-radius":"<length-percentage>{1,4} [/ <length-percentage>{1,4}]?","border-right":"<line-width>||<line-style>||<color>","border-right-color":"<color>","border-right-style":"<line-style>","border-right-width":"<line-width>","border-spacing":"<length> <length>?","border-start-end-radius":"<length-percentage>{1,2}","border-start-start-radius":"<length-percentage>{1,2}","border-style":"<line-style>{1,4}","border-top":"<line-width>||<line-style>||<color>","border-top-color":"<color>","border-top-left-radius":"<length-percentage>{1,2}","border-top-right-radius":"<length-percentage>{1,2}","border-top-style":"<line-style>","border-top-width":"<line-width>","border-width":"<line-width>{1,4}",bottom:"<length>|<percentage>|auto","box-align":"start|center|end|baseline|stretch","box-decoration-break":"slice|clone","box-direction":"normal|reverse|inherit","box-flex":"<number>","box-flex-group":"<integer>","box-lines":"single|multiple","box-ordinal-group":"<integer>","box-orient":"horizontal|vertical|inline-axis|block-axis|inherit","box-pack":"start|center|end|justify","box-shadow":"none|<shadow>#","box-sizing":"content-box|border-box","break-after":"auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region","break-before":"auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region","break-inside":"auto|avoid|avoid-page|avoid-column|avoid-region","caption-side":"top|bottom|block-start|block-end|inline-start|inline-end","caret-color":"auto|<color>",clear:"none|left|right|both|inline-start|inline-end",clip:"<shape>|auto","clip-path":"<clip-source>|[<basic-shape>||<geometry-box>]|none",color:"<color>","color-adjust":"economy|exact","column-count":"<integer>|auto","column-fill":"auto|balance|balance-all","column-gap":"normal|<length-percentage>","column-rule":"<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>","column-rule-color":"<color>","column-rule-style":"<'border-style'>","column-rule-width":"<'border-width'>","column-span":"none|all","column-width":"<length>|auto",columns:"<'column-width'>||<'column-count'>",contain:"none|strict|content|[size||layout||style||paint]",content:"normal|none|[<content-replacement>|<content-list>] [/ <string>]?","counter-increment":"[<custom-ident> <integer>?]+|none","counter-reset":"[<custom-ident> <integer>?]+|none","counter-set":"[<custom-ident> <integer>?]+|none",cursor:"[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",direction:"ltr|rtl",display:"none|inline|block|list-item|inline-list-item|inline-block|inline-table|table|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|flex|inline-flex|grid|inline-grid|run-in|ruby|ruby-base|ruby-text|ruby-base-container|ruby-text-container|contents|-ms-flexbox|-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box","empty-cells":"show|hide",filter:"none|<filter-function-list>|<-ms-filter-function-list>",flex:"none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]","flex-basis":"content|<'width'>","flex-direction":"row|row-reverse|column|column-reverse","flex-flow":"<'flex-direction'>||<'flex-wrap'>","flex-grow":"<number>","flex-shrink":"<number>","flex-wrap":"nowrap|wrap|wrap-reverse",float:"left|right|none|inline-start|inline-end",font:"[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar","font-family":"[<family-name>|<generic-family>]#","font-feature-settings":"normal|<feature-tag-value>#","font-kerning":"auto|normal|none","font-language-override":"normal|<string>","font-optical-sizing":"auto|none","font-variation-settings":"normal|[<string> <number>]#","font-size":"<absolute-size>|<relative-size>|<length-percentage>","font-size-adjust":"none|<number>","font-stretch":"<font-stretch-absolute>","font-style":"normal|italic|oblique <angle>?","font-synthesis":"none|[weight||style]","font-variant":"normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]","font-variant-alternates":"normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]","font-variant-caps":"normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps","font-variant-east-asian":"normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]","font-variant-ligatures":"normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]","font-variant-numeric":"normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]","font-variant-position":"normal|sub|super","font-weight":"<font-weight-absolute>|bolder|lighter",gap:"<'row-gap'> <'column-gap'>?",grid:"<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>","grid-area":"<grid-line> [/ <grid-line>]{0,3}","grid-auto-columns":"<track-size>+","grid-auto-flow":"[row|column]||dense","grid-auto-rows":"<track-size>+","grid-column":"<grid-line> [/ <grid-line>]?","grid-column-end":"<grid-line>","grid-column-gap":"<length-percentage>","grid-column-start":"<grid-line>","grid-gap":"<'grid-row-gap'> <'grid-column-gap'>?","grid-row":"<grid-line> [/ <grid-line>]?","grid-row-end":"<grid-line>","grid-row-gap":"<length-percentage>","grid-row-start":"<grid-line>","grid-template":"none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?","grid-template-areas":"none|<string>+","grid-template-columns":"none|<track-list>|<auto-track-list>","grid-template-rows":"none|<track-list>|<auto-track-list>","hanging-punctuation":"none|[first||[force-end|allow-end]||last]",height:"[<length>|<percentage>]&&[border-box|content-box]?|available|min-content|max-content|fit-content|auto",hyphens:"none|manual|auto","image-orientation":"from-image|<angle>|[<angle>? flip]","image-rendering":"auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>","image-resolution":"[from-image||<resolution>]&&snap?","ime-mode":"auto|normal|active|inactive|disabled","initial-letter":"normal|[<number> <integer>?]","initial-letter-align":"[auto|alphabetic|hanging|ideographic]","inline-size":"<'width'>",inset:"<'top'>{1,4}","inset-block":"<'top'>{1,2}","inset-block-end":"<'top'>","inset-block-start":"<'top'>","inset-inline":"<'top'>{1,2}","inset-inline-end":"<'top'>","inset-inline-start":"<'top'>",isolation:"auto|isolate","justify-content":"normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]","justify-items":"normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]","justify-self":"auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",left:"<length>|<percentage>|auto","letter-spacing":"normal|<length-percentage>","line-break":"auto|loose|normal|strict","line-clamp":"none|<integer>","line-height":"normal|<number>|<length>|<percentage>","line-height-step":"<length>","list-style":"<'list-style-type'>||<'list-style-position'>||<'list-style-image'>","list-style-image":"<url>|none","list-style-position":"inside|outside","list-style-type":"<counter-style>|<string>|none",margin:"[<length>|<percentage>|auto]{1,4}","margin-block":"<'margin-left'>{1,2}","margin-block-end":"<'margin-left'>","margin-block-start":"<'margin-left'>","margin-bottom":"<length>|<percentage>|auto","margin-inline":"<'margin-left'>{1,2}","margin-inline-end":"<'margin-left'>","margin-inline-start":"<'margin-left'>","margin-left":"<length>|<percentage>|auto","margin-right":"<length>|<percentage>|auto","margin-top":"<length>|<percentage>|auto",mask:"<mask-layer>#","mask-border":"<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>","mask-border-mode":"luminance|alpha","mask-border-outset":"[<length>|<number>]{1,4}","mask-border-repeat":"[stretch|repeat|round|space]{1,2}","mask-border-slice":"<number-percentage>{1,4} fill?","mask-border-source":"none|<image>","mask-border-width":"[<length-percentage>|<number>|auto]{1,4}","mask-clip":"[<geometry-box>|no-clip]#","mask-composite":"<compositing-operator>#","mask-image":"<mask-reference>#","mask-mode":"<masking-mode>#","mask-origin":"<geometry-box>#","mask-position":"<position>#","mask-repeat":"<repeat-style>#","mask-size":"<bg-size>#","mask-type":"luminance|alpha","max-block-size":"<'max-width'>","max-height":"<length>|<percentage>|none|max-content|min-content|fit-content|fill-available","max-inline-size":"<'max-width'>","max-lines":"none|<integer>","max-width":"<length>|<percentage>|none|max-content|min-content|fit-content|fill-available|<-non-standard-width>","min-block-size":"<'min-width'>","min-height":"<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available","min-inline-size":"<'min-width'>","min-width":"<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available|<-non-standard-width>","mix-blend-mode":"<blend-mode>","object-fit":"fill|contain|cover|none|scale-down","object-position":"<position>",offset:"[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?","offset-anchor":"auto|<position>","offset-distance":"<length-percentage>","offset-path":"none|ray( [<angle>&&<size>?&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]","offset-position":"auto|<position>","offset-rotate":"[auto|reverse]||<angle>",opacity:"<number-zero-one>",order:"<integer>",orphans:"<integer>",outline:"[<'outline-color'>||<'outline-style'>||<'outline-width'>]","outline-color":"<color>|invert","outline-offset":"<length>","outline-style":"auto|<'border-style'>","outline-width":"<line-width>",overflow:"[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>","overflow-anchor":"auto|none","overflow-block":"visible|hidden|clip|scroll|auto","overflow-clip-box":"padding-box|content-box","overflow-inline":"visible|hidden|clip|scroll|auto","overflow-wrap":"normal|break-word|anywhere","overflow-x":"visible|hidden|clip|scroll|auto","overflow-y":"visible|hidden|clip|scroll|auto","overscroll-behavior":"[contain|none|auto]{1,2}","overscroll-behavior-x":"contain|none|auto","overscro"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// Generated by CoffeeScript 2.5.1
var MarginBottom, _Length;

_Length = require('./_Length');

module.exports = MarginBottom = /*#__PURE__*/function (_Length2) {
  _inherits(MarginBottom, _Length2);

  var _super = _createSuper(MarginBottom);

  function MarginBottom() {
    _classCallCheck(this, MarginBottom);

    return _super.apply(this, arguments);
  }

  return MarginBottom;
}(_Length);                                                                                                                                                                                                                                                               �$l?������������w��K�bU���7�B�O�!�hl&�g���S��Ӽ07�Ø֮e�@�v.��J �������̎��".s����3>e� �dL��0��_i�x#n�R���x���A-�G|/��i��{�@}|�{�gߐҠ��B+�;o���SK�6?k���R2����Y.�`\!��t(9
���*� 
Օf
�Q&	��儦BP��PT���D`/��kK��7Tv�1���1ww��V��f��j@��% �ĕ�{��t`�}�ݬ� ����I�F�:�����w^��BEE1s�+�y���8���~4�f7��oj���W����{n�~�w{��$cN-������z9"V���|�P3�~��kf�Ih����YN.�P��4�R�>\x�\�6�T��zRۖ��^ciƱkH��%P(!�R����­�~fk���kI�4�J_����!�6\���HU�!@H^�Kt��+c��?�W9J��9b�b��ں�A�jaa�$ҬC�V��C�I�P�u�e�4%JG��} �i�~&ϙ���@��ʙ�f� C�x����#�v���͟��r�H'��*�Bu�AI�u�A���?��t�,��Mm���Z+�������)#jᩦ��ƦP"�J+h�"e�Z�UV�V�Qu�о���W��'HU�x3�K���F���+��7�>�Ж}� V�K����(> To9�,Sm�Ojb�>����
~�L��֎M?�|H�P1�����,v�����)�%�B�)��M�UW����t� �!5}�tdu�U�?)�#�@ti�A���Pq)[@���a&�:�ٺՓ/�WC�e��p��-��TR�;�6\NzpVꗭ��4�4b	W�����SH��5�S 	`��d�X�ĉ$�"щ#SEy���vM��e����O�����1�>��Ӌ߰�Ø>}ЪJ���4��c�k���J�*�����ba�ө��5�	��F�B��f�G�d�:I�E��?�V�ږ�v!�VƠʑ�c&>8�����-e;����=�1�@^a�hc�58&xR���?� R�R�B�N�\7@�"9��d�Y�1ձ/3�:+B���>�a��q�Jw����$mm���׬���.�9�P�s)�ڹ]msfj))���q�g�Ja�6T.�uP�0��:��z�qhs&WgٕO�[����}2��A���mCc��� x]"�\8�p4�XE� BS ��ˮ��J��j�O
U%�mi���g�"� �Ck��V_m��1�o�O_Z�њ���Q�:9*Qdܬ&O8�[��3^��e����L��^��W�k���j��
����;�� d(�=��3
�?��և����r`���򤇝�
��*k��P����M��W���rg�RL^�ocW�=<,\�DNî�V�
X�&����2����y8M;n��Ь��cZf�D�}+�����s��X$ң-d��I�r5h�C����y�B��#�U��E�~�vnU��.�
e���Cq�lq���3u�s���W��.n]4�s͡Y�Rխ"V�(?N2g��O����R4��,�@Ҁ n�p�C���5�nh'�������HSڽ/ӎ�gvq�/�Z^��u��H�8���T}�o�t��k󠆙

K+i
� ĻM$S��^�{��
�`���}@l")�'@�ԝ�[��0)�����g�1���Nrz$����;�S��m$52hHn&1+�2�Ҧr�+�P"���ٞ��z�C�'`rP��f_P�m����*��:(SX���9I&NN��jbjXO�����:Os<2m��n��VMg����T|�ޭH��H�O�/IIs���*yv!D< ��2R�����A譖���<K�P�d��q�,&��@�?�b+�� dhl;8~C��z�1�O;N�x�`ت���U��ֱH�5����U��]4A

Y.^��
gΔ
&�F;���݇�I	����{���$�ƒ_��9A GIZtY��g���}�B����Rê#��ix��٩����fV���v�(UGpM��4���T6v7��� �^OD�mg������ʜ�YR�>�i��/2Q�-?|K8�$iY��}5�U<-���y�xW�]Z�
ޒ,yo�@(7R>��5��$M�7�xԓ�kic������py��3���Wl����w۬����X�D+�Rr�
{Qv��piFQ���Z��?BH� �@P�����FLуB�T,�(w���)7\cv�R��o��Y	������u�s��S^ZJ�����qه�@�ד���W�r����n��1�.��㒤7��{���H��_��yf�-� 0`7��|��p\#�b��q4��X�0uҝ�Oϻ�k�]Y��\Wr?;*� q��dҬ�:sʜ���ү�L����n�+��*�*�r�+,J>ð�I
���c��R#�\��1ՠ[D)47��,����I��pG~�+.���M�ev_d�Q�0�Ѱ������ӱg�ߦѝ5���ů s��#���8��^H<,����p�b�p�����͛��H3W����~&|�(���'A��3�gPL�<K&�3�)��M��hZ��ts��a O���1�*_�35�7�/j��l�Sg,U�ը4�זƁh=�¥��~����M�,�y�Vg�$Nc��[����IsPtO�y^�6|v�q��fq��%U�mx����x�j�S	�g������y%��[l�h�03YK$�9ϖ������ڡ&vItt�֢����'zp�s:�o�n������]�m����UxWz�������p��緧����p��k5,g X:�2�w����4=���,��H�&}g�H �o�S���O��~ �X���3P����d�fY��C޳!�G�E�x��t�+x��z�0]4����M2&ʽ���%��#�q������z��7D�t�3���5I C�����S��śΆ�7E8k����.`�؛j�;j�2����}N��O��E�ÿ�*�n���3Q�'�ЎО{����W���6CF�
ȸζd��󱕶�X8��(PG�T��Gq��5�����/��G'�ÑE\j0������&ڣ�t���c�!��tݮ<�h�)Х���K/�G�9��%'��dO?ޟpz�@�<J��pm�YM��/�H�]��e�b qy������a ,�JrT��D�rP�]�;Y�|{�é�����|��S6,*�� �g����f	�F��kē
3t,G{��h�\�� �r�����܍�~�*��T5A�)��7xzϣ��^��-?���"ݮs�l����� �0��.���2m�8��Ē�Vނ���J���)G�2&��s��.]&u �0Q�p���쭫m:_=�{����`�쬖�2����wv����;Q�����ɡ�C��uq��)�4U�O���O�
	IJ`&�������GF�DbP�����9�nh	�?�F$�U�u`�뻳Q[��L5J�ϪB�k5|���04�����=*�c#�*�\�[Ɗ���V��2G����K8�N4R��MU��̆�Ӓ���v�6n�xU��R�@2E��̽��F_ �+�Fʭ�����3�����L���c���Nc�rtS.���)�[�l��������-v  ���9b�3҃��6���h�m�l9TH�؜cu�)k����T���C�^���h&J�4�����XFv��|"���:�.�>d��D|��[�N��i�A{%]��_�"�V램D��z�
���Ⱥ�&��d�d���(�T��̳��Ѳ7b��ǟ}d?�t���.�J9*qb�}AC��!��;W(af���q;�Q�d�h�d)����3˽�jE�h�W�|UxY0�`ŝ��f:^�,g+�X�_���F����G��C�4������?F
�Y~2���#ѿB
5�2Y�F)�ȁ�D�����	
� T�:�'P�D��3�P���m��e��@2���T����$�� V�ʼ?m��َ]&yH����I���Z�s �焇g횚�j�.�\S�Nvْ	�������e��ɝ��
Rj+��p��N��;-W��Y�ܩM��x����TQ�y���4s�Ǌ1-V�iLoxs�^	�.âPa���T�;S�t��b��+آ@�	�(�ZJK��mr�Y9CI�{S�N������^���W@ʐ+���V�'���ʭ~6{M�A�o	B�թ(K^�@=c���c*�7Kzp{��-�-0��N�6�HE��:WUv�y��X|�r ����Q�K<j$���4�p��|��2�0*�X;����X�԰�z�����s�ſ
��N�H�ÆiGP!�9I�u�����l�B���Ӄ#r�q��W)K3c�,C��^z`����9e+�r̚���"\y^�=��p���������,�:,4�L�V�!�<7J�'�,�*rB�k�h="\�Q�X�̷!/zZ'9�Y�Kp��
5�5���ߤ�8�3t���9zJq��0)�����7q:E+L���Ǒ�{�|���$�1D 6� ��txX
����t�|Z�����p�vg�m)��^�L�a.�C�>�ԃ˔�xs`�~P���Zb��>�4"��x<�BG�(u����	��ѳ��
�`��2EdM2�@ 2&wS�65���d�{
���qX�����yS͜�츑�i��"{о��y���-�9I��_(b`3���/�֬�0������i�7����IJ��g�"\)e)��dyn�f��HWqk^q�h��UIv�F���v)f��7��4PwL�J	۷�%&Ȱ�J�B��B��K6G="
�;n����f5@?[��q�Z
)���v ����3�e#����.��u���]֪��:��0����B���ɾ��mB
�_�R�ç�{夕��o�"u��2�J#�����?)}�Y�
�|9��;F<1ߝ�|O���v�Rx(8��i�m`�jmnd�ځ�U9��I�)Xq����̠��6�P�7r�ld�c�7�$��a7
�B���tϘ��Ѭݍ�mE��7ݬW��O>�^�HJ:P����-������U���@��:�#P����3��P�n=��,�������񥇃�]��6[ߓH�\/Z�S�<��V�5�Kq�M��V����>���il2�>m~�M|6���<R\�Dve�}� ����,��� �
n���/�dQ�Wx��?���yjT���3�Ǎ�U���ϳ1I��S������`�*O걱 �-�#aG��PhXm*�1(=
�T�m�6D�G�t�k�3���Χ�[��v-�a�UQv!N�]z���h^�5	8BD^D�醫ˈ�4��F��Js�Uvп���Dvm���l��� A��!�yW}�{���B}T R�f.�͇VH�^6�]��x�f~�ЫU<
�9��P2����C����c��q�{�A݊]��lEMV���$H�xM����t�\�rڇ=��.f�@�fI��0�+.�;�N���`�y�sS������{����pO����� �*��Ԩ#?�=X��(�ZXq�g �{��2�6zM�����,��{�"ݝm"���?7�lͫ�7s�4ܞ�A��?4������c��%"||���*a���L�ʢ��ӆhf��ED�ZhN��f��c��H���*k^�C&b����h!
!���?�;5u�9�XlЍj�=��+���Ch�{�j�ŷ˭�A/�� �a8�jFU��(s^�8̣��$�Bv������Rr���w��weJ|#��"[��}5�	�WSo��3M���HO�I�Ź��]��t�A�xU�"f�*�E�"d ��5�F�ҭ޾�7OA0�u=�[0v�bj{��:�LEU�Uc �.��&�\����T����{:MF������
�,$E���^��ܡ�N�V�Hm�6��{J�x4���쪈j���^��`EuP�i�O�a:���'F�����uu*8�[�����w���Dr..I�RD/3\8*���bM*4������=_�yY4��ք��#q�rX��h�o@V�k�_��-#u>b9������'��g�'c�i�xDi�3S'#I���Q4x�ID���G�^�Ә�%�����c��_}#԰������	�]ݘ��b���)u� 3Z��qF��8b�	G�מr�g�4b+��3+Ul�8��\X�$�1��Z�V�h��E4��RZ��?ԫC<Lх"�&�u���x)��;"��V�t�1��R�se�ʐ<5��\�+3�%����G�m�:7J���dC.���O �EHX ���k�ʫG;���nb��L�e�K��+j���o�]�ƒ�rB�u����D�W����K��9��g 0�b��1Е.�F��d
s9�a,�����y�a�|�22ם�B@��0�v�1ࣂfW�|)@P6^ŷ#��?��2���i�Ipw�wwwww(�J	����n���w��R�������$2�$��wϵ��+�y�I���t7+!YG$�o>K��i!!���Fi�e�($W��!0���D�*�Et�!^^�#�f�n�3T����7"ע��
�k��7_�d&T�7��Yq^UЗ�ץZ*A!���f���N#E6/C���2�Tp�g�pp9c��u�fj�ؾ-�Kڐw�������Z>�&�<��TD8~T3Gm	)F���W�c3�&eI���A4k�s�ݳ��f�/�SJ@݊�o�Q���H���>k��W�:�MFo_��ҊM��j��:9���Z���[�t��HI��L,��}Ң�y��L5�B,�o�j{|Ֆ~th���UP��]=6X�vL+AM$확)�]��k����V���`�϶���pHL������r��H��p�
�v���ml��c#m :���#���2��nn��U�s\*Nm�1B����7!]|� ��D�R*AF�X�Ǎ�J�͗��o�Ci'��Q��ݢf�"�0��.0�_7��7��W��]�O49<���1Ohk���{=�%�Qe��I���>�O����3<��P�P)��:߫�6#���
��,�M��Z���1��� y���D~R��v�_��7޻�vJ�������)c�e�Ae��>gD�Z���y�9���2b:�I�5K̩�"]vӌ)��)-3�4�����$�i�RS�Y��� �� ���������g}�2&L�ݑ�Jʬ�X�ϖ��S��_^~y}��/>���{@>Fp3 ��W�Ѻ�F*���i��Q閱m����$RI�X�B�RT�`�Da�xh��p.Tv�U��+���i�L��N��`�}"L@8Σ���w�/S��ސMl P��Z�!���7�@�dΆ�#-X��U�C������Ɔ^�,�k�%���ǹw�|�q�"��!�����2T���2�!�u�g�3X�k<�2x��p6����A�J���L}�҃+:JEZ����5hq�N��`��Ţ6j���4*l��a�赻[^�7\�A,� ="�>�V�DS�ߝ��u P���I�X�B�� @��iٙ�Jb��a�$��öd�E-"��]YN�ff������3���!M�H���q,�R����(���"��gU	� |�i� �D����G�����Ě|��֜�Y�{�N�S�hp����&�+c^�ɝ㶏_	b
D�*�2�T��!�Vg��P\����?�Ի��.����=J�%{����� ���0�vc��?ʶh�;_��7 �;,^֙�H�������E���_���J�)KR-���#w�T[�����YK�ZP}I���s�n·�]��s���6O�<"l$Wu%}W��*,���t��8Ia[uJV�9�?���႟�ӰA�/Xb���lV�82���ݽ'��YU�K�F5gRv��t�#,�$	WP���+%q��qJQI�(XI�� ��쯊/��~�&���1o]��N�x�e��p`SƠߧT�&�#�h>�����	�<�<��>C�{ā�` �B ��'E�const set = require('regenerate')();
set.addRange(0x1735, 0x1736).addRange(0x1740, 0x1753);
exports.characters = set;
                                                                                                                                                                                                                                                                                                                                                                                                          9�1Z��ؠ�����H�]��g`�>��a�Epf��M��.��@�S	�U�A�.oP��X�5wi!)�<�����8DrDD���9�x|{�.�B#_	iYʴ祖h�Wc㲰S&�vX{r�R!D��$�ᠲY��KC]%>��p���h.SE�Q���0<�
U��C-j盷"
�{����^�,V�lj�D75�G�?z"�S�,K���Nk����gƮ���o���&�$�DE15���D)�m
�Z��'|�˜@�X�)}�Q��9~�'BK�i��?��3��Э�(<)x�"�K�3^	�l2�S��Y�X5�A������������\1� F\� zLDI�,��#���lK�+2;x�u�CY��28l�c �\@�4����� ��o`��o�%�dL��
�}�G��w�y�R3:�\H�f�P��p#[�B�xg$r-��G"�dm�0���S��NY�"��$�p1H�A�!c���
�!��5s��뷌��W�v�S��,՘0�[���8��7��y��[��f��y֨�x4����b_�qQ_q�z�t�̢w�W�Z�u����dw�۞`��>-��m��z�s@S8�0��c�
� ������ݢ"a8tf7T4�n��M*-%����g�:c|K��a�SK�.\��Z�y���JJ�3K9�T0sP?�1M���+�'��ſ4a"��+�����������L)�+L��3�n���[�t��Ug�{��#��a�<���R���-ۣjm��]��L��:1���N��v��E�O&��G#o�N�jS��}=���<��.��@4�t+Vn���6���;����3NP��Lyٜ�Y���o��xǰ�dTEb["�y���Pd)u�h���+�R$~���Hˢ*f5[�S��  P�5�W�&��V�"]Zb
^�@3�8���.�&��v8xXǪ>�Y��T�IgD
b;S"Zî"�d̖�9g��tO�b���Lw+���) @,+���74�T����oF\% �Td�G�* c�� \�*���$b��|��"���:�Ќ��Qj]f��@{KR5i$��b�Qe��~��O�4�� /i
�aJ:,.���Ŏ�Ef�� a�vҢ��}�qȫJ<<fDEa��Ԋ��k���
�97b��홒��?~�$
Y���<��H�z®F����߷�*�U^~�x��"��מ����/D�k0�=�7x�[�Dъ�[7�j���^�`B�Jh����QE��۵tqi���wzR���l��E�
�8�M=G�RX�9f�'���Z�����W:;��1�
y7�##"��m�0P*�wk�b73@��-4���-���`#ar��
Y�%!��˺���t��޺�[҄�'ZT�*�<�G�C�_xT���]���`r�tX)�I��Ǣ�I|�he����"�%���8��x��e�sjm���r/��;�N�3i��ktԝ ���Zg�C���Df��S�T� @�%�3���g(�g#M i�ơ�"�
`�l����}i��\�|�~O����o�w&�NK�8D�� �ch��d�>���Q�5�����`dM�i��W�.l]H�g=䊃���%R����dH)�z�+5~ۙXv�KDNp�J�둵� VI-J&!!W3+	4�������x5��K�]
��>Y��%E� �O6RGR�h�
�^���_��Գ�?��$�%aծ���5��$0%���H1��v����eU��"�ϊŬ�md��Y�M�������l�n4d6�L������m��Y\b��vА1�MW�ڹOD��^�����H2[����V>�G����� �.��}� �j��{\��S�|i��#.#�+�h2�5��_u���)|q�pI��U��4���<�?.-I�zz��z
?��9N#�)��>HlC���U�j��¤�^)�� y޷��/j��1� �"(ZZ�_%�JQ�����^�R�r�Z<{�)�&I&�Sd	�����)7��-�X�4�������E��@��9�
���}��Þ|�q�
~�a��$Z���
��o��|H�j�٭L�����j�3��A̘=�L���l��<	��m]�/n#�1R|�^��nQ+ͽ�
5�/�Z�`�c��Ǉ�^<!��%�ٌH�2�l��P�Z4wUf�rN��<���ӲȩN��F��I�^�m��C揯�iQ܌4�cг+����?&x���nÂ�W	p��/!_�˷�{?H�Y%#��r.r��v=��-��s�U0�'+�{ `�a�q� ��w�- (�\��� 0j���8r��.O0T%��%� �T,��hkʰ�em��ڪ�&�fHp�7�\�J
/'Y�x��c��;�("�X��1��lS7\i��7&'�Y�|�������*��h�B��*�d�p&����g2lѱ� A_ǌy�tŹ���tc=痌��]}%w��?b����Ӱo��x�q��f�v`�	�=#��l���
��͒	YM���&cWwv���xl.שW�8NQ`^쎏Ju���ȨC���S�X��:�[8����\�oce����n��.,#
Չ�ȩN�旅ރ?2U �2��G��
��,�!���%�|&�*�]ٛ9�6_�.�7krᄰU���a��~���Ұ	�r�M��a�S@��
�����vmuQ��t}E^CF	E�:3n�	-,�Ҡ��\��j�-�cy�V?k��q�o�������� 0��;�z��e��:��,�g�.�T�\7�Xw�HJ��x�z���f�,	���Ŏ��n|!�U
ɉq#>ͯ7im�ۏ������K���B�
���l�'��f툴
�e��[Q��{�m?�\xt(�y��J�3жd8Hv6��=���⋯���ƈ�������Wѓ���=�$E
��c�e��*4����G�$����l����v	"���ũ�-�D��n����[B=%biQ�vR����ioK�����S
����0%�f�i"��u�Q�t�.�2e��pmM��9�N�l
���R�o���� �0ė�Ĩp%���(9�Dy�Jb�$v�6\�q��D�_�z��ds$�c{�\֍Ɖ�?m�Vϝ�緺�?Z���[,�~�aBYy:j?QO�y�C�6��Mٔ�*,J�Z.!;P^M	JF�H��5�����i5�� q7�d�����Z�{-�P�'�����Y !��;Oơ�>Y�ɚ�+� y�	��-�"x�zT�b맶Z⡈c�NcL���V��-�#Ǧ���M�HцFn,aSѦh�ՙe���qt�� ����?B� P	���%����d�P0	"�_y�J�*f�m�iy�.�9)C�<r&��r-�2N|Lԏtc��w�#�c���Y�kE~mg��e�і����Fy�kiw�srK�zW�K-;z����
1T�D�`��`%9�T^�9V���Ud�b�����r���x��!ʊ.���j�5n������6��_Ɯ��w.�ܶeX��
^cL\�i���ʫ>v��6|:���ٱ^~���:򂳕��C�|bwd�iA�}j@��r֒�9˞E�S�d�]wl��	�����q"Z0*� [+|�$�q*|���"������(�B�Ϝ����|�:#л@��r��oz�'f�r��%v�n0!9�E�7,VWg_ȫ�,r�R{�#��o淍�7W��k��ov9�r�@��z����A/$&�./��6c���3��>fZA�w�&6�W�c+IF�rz�׎��\B���p靇����wU�������u�Rm���\Ŋo��,�������9G���Ɗj � f � �Z &��D=����r �GU�	2�����Ef1��Mˁ����w�%�b]Э�#�l ��nWؘ����I�Q�s�r:��jC׳�Z�����������U����G�R?��f�������Yk>�ԟ	�%[$�#�O�o����L��
	T¥�ϗ�w
M�i�nz��M��4T�����\�R�5H� @c*T��v��ڄa{�>.�X�:+p@�G�Ӧ���j�8�>	��B
af~�3�C
D;HdL;���|�DS�t�*�jA�"q)P2���M����>9��r����lҨ����H����Q�A�t�/���֓��f���0�'1����Qc��X4�k��+OW&�b�j�k�G8b��Ŕ�[yc�u�k8:w��0��`�C�m&��Ϗ���^�H)p��_&p���_?E�4I!+�]�g%�}I�E�����C�F"�c�¨���{>NRϧ�n�C=b�\�:O<��~0�u)��?�~y��S���ЮM��Z���[�4ԮJ��_ԇ��ѥg(��K��t<p�B�EG�{�&��?��n�L�Ct�6�^,��5�5�64�������~�u,��78���/G�[��'��e.�t���~Y�w�~r�͆UmƧ'FE�ņ
X
-	�e+cS�d3�.�.��B-_S���5��@�uM~CK���<La�TS��K�G�s��+����}�3���F� y�WG���~��گ��6�	�>d�T5���n"���O�X�Z ����F�}3*�˦� �=����d	E�NU܋'Դ+��E�嗴����ˡs�ԭ���@���O���9�&� ��b[�R�A,rv
���2�-  S��[��Q�p؟���v��*KN�p���[�lȔ*�(}�)�UV�R1����_ ��lX.IAY�������j��#�m&R|���_�j��zfCM��\Y�*v1��b�i�9���<�����F
V�Bg������+nC41*��?km�ƾ�Y��FAqI��
o4�Ǎƃ�v��-0T�:n���}��C
����x}(ag���k˽ �*�����~�q#�;�^lFg�rV��.,%�Ns陼U_���N��?�������E��O�����:莘"�|�0h� ��5��L�<M?� V��m��i5��;fm�jgj������0؊+7�;ҁ�P�F�W�!�1v������۩6��թ8���s�!Bbh\��=n9x��������\��]&b��W�c��h����+(�Vir(�K�� ���M?�0/Ia��׷J�Hԡ˨�=�� ;��Kd���"[<�;|m�5A���"���"ב��+b���T��
��
�M�t-�#��	�]q8(�)�-�� �H����bFH!2�B�c�q"C�&%8׊_�ֵ���&1Υ!4��,�� O������T��O���F��*�������^7q.a�h��F@�W���˼��]��-l��{ 	X�{n��)@[��U��"5+�i_a���/��Ӟj�
d)z+���+��_&�����b�_�N
QxьYȱ���6�K���(��@G�Ǟį��b�5�
�LOv�E�"�����o%�Qo�NQ6�  :"4�Q11D
w�\���e\.�թ��Ԋsl��Ü����Yg5��-z��Q�w1��:�p�����h��FKf &��,��r'�����\�)@^���Q��a�$���a��h���n��]i��7�9f�1�����wO�:|��{�y8{�� !�[-��A����`�L|j��b]���&廁[ 欶Ϧe `���q�l��<R�BG��	�.Ԫ]��Ԣ�k	H��X%��Ρ���V�U2%�uն~DüPK�qF+�D5��Yn~�,�)p3,�i�(f�l\��m{\d&�6@���h����qRu�L�\\���R�|��6��'2�کj���#��>-d1�S����`��wz�j���6|EְS�-�l���w��1�!�s�Dc��ݱ��柋���;��'d �	Sc�Ԕ`|xq��؈xWkB�湿t\Q�=��}�{:�M_
zr�7+�h�т��Dl�-i�2M�+�+�u-֙P!�q����=עI���Ѣ���Uv-TT���E�R��=U�̯�t)���A��i��y�njU�F���[�cYt)���]�4��<��#i溚5ż�++�%���~&���l�(%��Z�]5�=qRkX���X-W�gV5�\ljMA2�Vg�x�!�>�O��,����عe!����8��iٹym�\�]�x�3����p_ߍ\����[~��Ο�k���r-B��3�����u����ٞ�����r� }�L�ײxT�#b�Y�M���*����r�B�l9Y@eQo��? *
`ȦFU�Ў��d:��u2�N��Z#��ʨq�� �o]�?��U1	���=0087��z�
y�
�+R�/BWQw�6�\{
�x�{w;!i��Z��D�� �j��J�H`���1Ew,)�%�t���r)��W��϶�3�mm:se��ޙZ-
o6ZRǐ_�;� �-���
�I��� k�c�
��K/��2+��c<yh��7"ڰ?u�R|���W�[ ��x~^�,���AXN�����T���0̷�D��=�{�����]m�$B�ZCo����$�ΖGM�TL8�-6�J_�e����/�{�jC�ު�H>�� �bo!�cH
/:�,��@'F����؞�5�����j��s�jK���NfWXN��HQ�`.0��o��z��_�u>{BW`Ûs�����iI�����|��ղ$�3ȉ�6쨪!�d���Rl ��Ca�EhIm�Z���u;�g�Ϙ⣼�v�lkH����Y���50������a��j���-b��P��/����5���\�����4�8��_�b���:�_Ԃ��<ұ�%10K7]��j�qo[���_��ć�V��>M� �r�t�V 7I�~
1=��<��]�����}}��D�CFW�N�G�`�␜��]�n�F�o��)y:����D5/��b���&��\l��k9pp�q��R�����ڗ�VYn�OA6\�;���^.wz_-��ξ�EJ��wۅ�p���@rncaG�_o<t�Sx���X�\uI�ԟKUi�����,��Px��p�i��0�-��E�����BF�+�qC��C����I2r㱶?�\($�w|��ha�FEQ
����v1��v������Ѥ�lM	W��b՘
FSzap��t&:��k��~m�3�,�v���B��4_+0f���s�`~��|�~�Ό)	Lq�c�H�?����q��b��M4�q��2�߸� (kU�Q�T��
��wO��qd3DA�,{��ԊᄱVw�܅��.~�Wߍw��JD���Y�&���s(�K���"_N`q1���hc
���/��%JD27�a����.ޅ���P�}=O��)�"1Tj�<ѬO�!;O�UTC���P��
�(���wB��L;P鏍���T|4�
!���Ǥ���X�Q[V��r/k�J�ʊ�]�!��ap���͏���ԓ���B"��c����V\��0��"N(��"�����:�w2�b<���J,1��Kĳ�6���t�f���k�:��>������˩*�� ���1��^oY����sM	�>r�`�����ȅ^L
@ �@���Ei��?B� �<|�3�>���^!
nį,�� �:�uWD;a�jM?��3��k�Q��F�b�πM�K�ZKŔH?��Бy��/���ʺ5S�Ů4��z�9oBwgp��jן��r���5����
ٖ��
�n5]c0��#U�lL�KVx�݈�g��w�e�2�yZͬ��W��N��^��R,Sk���w'��Z'�,�46/
~0�\ņ���Y�
���{DU�)��I6�U��	x�S�$avt�\!S��`$�S#ף %˕�z���-�B޾@&X�(��R�Eu�X+	�k|f�D$��E��WP�g)rഌ4��v�9|���D̲&�`� %�*��˹e�^����h�RnvP,�����+`�i�$|�g���:���x��"��y5�,���Ҋ�+>��bܑ�M�F�m�����2
R?��6��B� } 1&��
�i�{�&�b�FK*g�Oll�QBu��p�9��9B��/��tU�e�8��e�FŎ�Y!q6���Y�_/�ξP�ͣ�ԊJV�2���^=[�4�.
qgbJ:s�#�C�T��*L#6[5�Z��A�� @.
�������ш_�k,M%X�2� u�9�"+4͢#��D�Sfb��Xz;]�Ia���N��})Z�0y�6:b�ti�����W'!��Z�xGR�r��gL�0J�9 P��W�!ߙ�\ct8U*B^M\���"�0m�Am%[��Χ�7n��r�07r@��df����A��nL�fjT?h
-9YG�LE^�C8uBU�8�S���@��
�=�:پ̬�\;�����o�ْ ��3��������
�Ù����P��9t=v�)�3Pg5�,c��/[?+���<�N~���il�"S\��\}]�F��3��(o� `�C}�����|��4�]�R�������f_�Z��>M˶HQ)\��e�?B} �2<=
���)yYry��&���Q R#�]����NG����צM��r�)D�b�&��Q!����rp�wMH��>���u�K�w`�����j�D�
5�h���5��d���
��>�Sw�5������顛���G�)4.�R�2���59q��ae'Y�3��g�Y�B�?,��X��Y{
G��쫆���@�r#ssy$��<��0�
��)�DvO�U%�J�0$6-@��v���g�&]�����T�� 7n���a�~ILi���-����[c��>'?�Z��b��l�2��8�Jr^��<�"U8�3P��)�A��C|�Z"�{��s ������DkV�P�{���2՛x��9�o����ݾ����Lx?��e��t�*1�������Z�]c�9�N~Ж�I��}��7�&���
?�>o3A<ȍ�%�"DO?;����P[^7Z�b+�'>=H�)=�`���ѐ�Kw8�`2X3+��Y0��6;o,�=WF|��Z�/4�i#(V��"���P�χ,���{Rm
'y��/�r�x�*�����IŞ�TcN����E�)e#�ZS��9ف@�Օe�ޜ��c ��K��ޖ%�:ÅY]Y����L 1C���` 0�� �`�*���<F(�"�,_�f�Xw\! ��D+jG�R�3!��|���m���ITO���ѓ�Hm�U�T���ln"�	4V����ʑ��Eu5�
�G��.hl��}�)Q]<F��z��QsCc��E�'��i!%7at�=L�p�\D�}����5�<���Y[9��\k� Pw�����l:,&;�}�[skMI<�4�e�P]��S��v?������da�G���b�������O����Ĥv�G��l۶a��ɬb�`Vm�X���:�þ��}�mV�0��󭳤E��A-�`�������U�ݻYr޺�P���A����8��m��7�?�e ' x��[|db��ɱߞd�C�0K��D%̹㱦�PI�T���W-�4��-�l�T��إ�h?ýI����� PJBqcp���k���قt˧N1בN��"�q�(w����^�4���d���Jȼ��d�w���1�X�#)��7�`RuF��;2SB��b���0(����1ᥚĤ�X0?���y
P����/�$�B� ��S��spC��s�,o{ی��gn��԰==BLV����,�(h��uq���.s�gv�Yr��?��6�0bŧ�I`��
�c���A���vEf{��Z�%.,u���uVl^�NM�U^i�@ k,�ɐ7��ӧ��G����D�����b�
GA�\�b�XD"P�rܐ�'wJͷM���wjMN��Kq��6[>T�ЭOZ(*�!�~}R-�$�!!|��_�,P  t��b��/���mr�׍���N�COw�9�k�xKtom[ڑ`��R+a�v-M��˷I�fC���B�6���#3؆�g	����K{�,�9�^|
{c���bi"��N�'���Z2F�tl��MZ��?�7������b�yz}-�_�S0(RE���E����A���uM�|�M=�=B��f咷j���C�b��� �w��НΈ��^�St6�ɠ�"S�d��Z(ఁao�����D*�Q4΁[1Q�_ �_\y��_|�wG�&;�P$�1|��D��i�CI-�a��=���a��D&_}���F?�XS�8�K��M+<X:���oW��}���k�v��eQ��@ލ~R�`�#l�S%�K�7�
U����v0(Lq͞�FS�^��X>FȻFp�V)��ቀޕ�JS��D��_I�#6c�)��،a�����ƛ;X����߇��y�-󅽐0U&X֨
��W���D���v#Iv]IT�!o ��j
Ʉ�P��a��ldX����߫��G/[d��xo��[y�>�`���[ڗJW��ڄ�����<�"�f����B,�
*�T�p���B�n�\�Q�Z�I�;���ΜxT�beKt/~�&߲[P�.�z:7�(���q�#Z�Z{�{z���
����3S
�n2�8T�Z
K�}�Ѱ�\�>�ch�)$��k�dۅ[�<���˂n(9�'<P-f��OC�m͓�84ȥ�S����zC@^�X����Eʔhs1ޣO.G���Ց=DCҭ��,�Q�4U`Ĉttگt���l0r
�jb������b�'�(&ݠôp��QWj�Ո�]��m�OZ�ŕ��H	$Zۢ*P�V*�a�I����e�؝I��f1��s
v�M�nNV���	�aw�J�f�}����D&��1�i���Od39��&᧻��/�˵)u�Y}��3H��9�����#�-�V	����l��_��/���^ޠ����[n��_�{�qu;V�\�Q��D7$WMi���Q���RR\��-���`
J켤�Ńb�َ�k��y���������6;8��J��:�J��r�˫�2�Fd�l����S&W�&�W��)�����Q��h�O�P<��	�)�`�������uǃ�����!@Ć�} E���� ⦑�%�y 7������̲20&e%;�f��T|���oN�6oVZU"�H���ߔM�r�(&K���rں��қ=�:/֕�ܠ�һ��] g�m"f9d��A� �h�7�}�>�v�B�:�� �F��R�vmI�D/6T"�PF���\,\&��tVC�f��R_3%
 ��I~(�J
��fx^}f'Zp�_o��L6��+èE##���24f+����=Wff
��)E
2�i؟m\�3����3==W����0"�D.�<��,�B_UE�5���Tf��[��eJj�ٷ=-���tᖬ���j!��i��q�io�:w�`Ҕ�#hY�D����{k#W8��X}ZO��v\d�'8,�g���<�j
���K��CQj5
��a��l{���N�G�ES�Q6���� �Ʋ�}m����e Ԣ�Ǧ9lˑT����%9�C}(�3G�.}1��5�M�UZN�"�l�dW{9^�8�8a��P/�䙊K�~ةj��t�:�Gj�G�<��\V^�����$W�K綔[e�<*�����{$���np�,˪^vQ�GED//ppUEf��`���*s�D�B��:.E]�=}t�%��=�.�w�v���n
	��v�V4?>�*J�
���Ey�]�0�u��F1>��a!���/���N�/6����uI�lI'�6�u>�'�lZ��x؍�ϔ?`e�>?�����^��sh��2���d�4烪�����R��/�	,ԃ.D�g���H�ZA�Dv��p%�G���s�9�j7b��噂�9l$�x� �0�A�|ԓ�3_�pQp;ᬸ�SY�k�PHR���a�R������a�
2_�qr��<�ܱ�W90a�I0�65�۫�<�w��l���|�����Zm�J�{k_��	���嶵F�����{�z��#f�H�V���E<�x�G8��1�b/D���ԓ�<ms0T��O�)����ul��c�
`? �� �1�r�S�8l�T���P��ԑ+i��yu�
7�wWR]�)(�Ϝ{%i�1,��є����LU+\I���c�f[��q5!\/)�X�F�9��y,��+�)�Ɛ�R!���m�uA���G���=���8����[D5���BIݤ��F�ۃ�C�
��(=0��vh)$%ǂ)
��h㢩Ȯ��A�j����c����������T��r����#�Ea�.��h(Ġ3De���g��j�;�}�]
s��~��ӝG
�SC?�K�
��C�'�SO�9w��g��0�O��������Eu�F`DB���$�oO>�=;�����+�0�h4a���S��xp���`+Ә0���|I���5�zo;�Ն��C�Ϳ�]Bv ���Y0T�|o{�áC�A��[��S��[��)��)ݝ���4�* �����?����=��=��^���WH�7n���i�>�Ҟ��1
{V�+��Nm��@{j��~y��c=���@��L�.(#�X�� ����3<`��\�Mz�I3!Ғf���d���̻^7l�7ϣ��ob"Jg�f�1Ƽ�B�ӆ��&��`
'�ʛ��A�B'�I��b����4`!�(�-��S�=T:��<�.f���5���y�/g ��M���
(�ʬ��3�����\�h���@W�֗���>�z������SS�V����j�ۜ����#�L'��	�ոi�q*�P�ZA�P�g�Q����d��Z���׈�S�P�n��}�Q�_6:>�r$�����D*��<�R���Q
=.=4^�	aCfI��:
L��#� P���h��X.�I�g��b�3��8��!
�9����9C5�M��<�@��=�\�Y����۪��ǖ�т�h��7(X�oo����nr���c���/�����Re�4D�P�cd��g���Vqz)
������]

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _onlyOnce = require('./internal/onlyOnce.js');

var _onlyOnce2 = _interopRequireDefault(_onlyOnce);

var _wrapAsync = require('./internal/wrapAsync.js');

var _wrapAsync2 = _interopRequireDefault(_wrapAsync);

var _awaitify = require('./internal/awaitify.js');

var _awaitify2 = _interopRequireDefault(_awaitify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs.
 *
 * @name whilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {AsyncFunction} test - asynchronous truth test to perform before each
 * execution of `iteratee`. Invoked with (callback).
 * @param {AsyncFunction} iteratee - An async function which is called each time
 * `test` passes. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 * @returns {Promise} a promise, if no callback is passed
 * @example
 *
 * var count = 0;
 * async.whilst(
 *     function test(cb) { cb(null, count < 5); },
 *     function iter(callback) {
 *         count++;
 *         setTimeout(function() {
 *             callback(null, count);
 *         }, 1000);
 *     },
 *     function (err, n) {
 *         // 5 seconds have passed, n = 5
 *     }
 * );
 */
function whilst(test, iteratee, callback) {
    callback = (0, _onlyOnce2.default)(callback);
    var _fn = (0, _wrapAsync2.default)(iteratee);
    var _test = (0, _wrapAsync2.default)(test);
    var results = [];

    function next(err, ...rest) {
        if (err) return callback(err);
        results = rest;
        if (err === false) return;
        _test(check);
    }

    function check(err, truth) {
        if (err) return callback(err);
        if (err === false) return;
        if (!truth) return callback(null, ...results);
        _fn(next);
    }

    return _test(check);
}
exports.default = (0, _awaitify2.default)(whilst, 3);
module.exports = exports.default;                                                                                                                                                                                                                              ������^��Qݦ��b�m�R����"�z
����xQ�����c���r�2����6k���p�H�m3�w����f�����ҥ]�)A��=�R�S��'�8���؇Eg�Lb��z�KuK�����E�KY��Ch`p�ɍ(��4��	)���]U�ĩ�z페s"�@:���n�"��d?!��~Ye�'E[G-/?ь�ݰ��B{��D���O:W�+�7���8��Z���;ml*nS$D��h>�᰿�����-ţ1Z�F4��1w�l�h��NQ$�����ː���h2���L�7[��!O�:c��#��Q�?�fA
4��P|��Ć�{K�>8d��?��6^�OF�Vy���Xx����<��;
�x�O�R����q2[�o�+��z�e
x
�&F�te�Ln��o
	C��X��ʄ�T�j�'�(��������Ŋ�!A$xt��2����DB���}�z��yd&x��xq,�&�,&�o7cS�@7%�'�0�&d�y�5�,��2��|0;`_���8
� �$Da9S��V�ek��-�O
1�`=�?01�婢�@�5��{����q��
�b@�r�m�K_A��Ѳ�����,�B�gY��'�4�D|,����<TNU+��{��i���2�1*dp�P#p�Ȁ& �����8�8��y��)��ZF�f�9�y�mJiQ@���ҍ]h���߉�`�ow���sT9F�o��o���E�>�<t�/����}���`R��=׼�]1g�ߑ�q�\�%#�d��}=�e69d���b����-7�<{W
 �_*U#���/�F�)޻� ��F��� Jw��K(�������TE�v�'��ڭ�A :�K$FK�����.�Z��Q�|c�T.>��(�o�<y�8�Z���%�Ȏ̓�spI4�
v�2�?'�֖aQ��+7���4����� �jh�Fk�Ӫ�	&r͂B�~����ŭ��Ǉ|����a�R2O�{r�h�RNt�ƛ_�k9<�"Z_�?�(�(u�8k>kh?����̇��oޕ��k]|8����䥋��d"��Hǿ0E��P���7�N�⧊�E=>��Πj��#_�+���R�7�>��$�"\s�DRM=.o�_rs١�?�aɭbޒ�d{�?d[�	��_�:��_Q�Sqmx�0�m˰�W�N��'!`%b,l\��7+_	q@a� �
  !�H�����Cs|Oή,)S�����(����K�-7��I<�N��A\H�Q��@�Ü�_(��<��m��]Fѓw��
�T2Y5B�&��C�z��#���!��}����ؕ�SC¯Bdx]l��f\���-j���
Фw�$Fczd��e߸~�`��/��g$�]Ob(F���jp�<8U}�]S�nx����#���\��jl������W@��$��yGX_�i�"�z�W���LD{q5LhZ5�
�@��� ���)��F2W�*'��b`���*��>�YY-w�ۧ�j<^z�I1��M>��'z��6�*�v������rʸ���U�Izx��7T��J����I�+�<��SPt�ji���!]��#����+pL��\(∱P�e�P�� }���Z>,��H6S��(�d����PSٯ-�w�� �'��2ѐ�/	����z:�U3�] ��|,�e��@Y'-���Y1��GS�	34[jq�<��
B)_�	h�ƈcOv#���eV�)W�W���e����V�w����rAx��ހ���dy�+j
zQ�CNpzi�����Q�X�5l�����]��kS�F��ˮ��բB\C
PX�3x`\y���B�2)�ϺyX^Y��Yv~)��TTs}>0S��;�4��@����~y*/>�O��Jmn]�Г�`S22�1ߣ �
��&��D�zR%Z�^���
��RY�.ʝ5ނ-�<��
�Zk�l-
qS6�X�n��7��(�:��
���0*��K�_�R���p&*������GN1>��XC��ϒ���E42
�T(���D+�ZY��aܵ8��6��(���W/�*�r����
^E�ȳ�^��]�݊�ɐ�q�P��S���O�H4I->�ha��ީ�!k(���+.u8T#
&oȜ�ذhʍ$�M\����+�wWF������r<:� �L��,s���)�c]W�6�󇦂�8�f
�8�TܡN��W���X�5��M��R��k�)+��"Jt" �>�K�V(d��5�J�^��0�w�Z�_;'tjov��Gg����z�<`��������	~����}�)����/�Dӽ!�h)�/�D���C��B���]k�ƊO�tL��9�n����5��g�O����<H�Kc����d��{���7����SﶨƓ�~*`z�qZb!
#�~�"&�6�]F��iX�~�� `�t�pNbÉ(�]��8+9䚬����>@QJ�
�����,ш̔�P��XP������A��.|4 �@~+y����Gk����en�&VA�w7I71cI���&m��-�ݞ�;hȂ�ȓ9���bc�m�9,�����F �0h����N�K����s�Z�z����N�	Kk�#Zՠ��x�"SD\˓�����Ě�{�t�|����;���9��6��"`*lɗ�u���ō��9R��2�����M?�F�j����"Uj?���B�OB��R�Dl���|�����{.��"�O� �6�0`F�}`L'F]J��E���S���'�?�|(��wH&Fi ���l���0̨�<v1�ˇ(ZhsS�^0o��f�w�  7Η!�U��z�yq�����Mܞ��SCw5������0"*
��<|G4"u�þ&�('#ת�a�R�b9CQ4��l;
o�sh��A�tӾ9Z�����U��[!�75s�3��������eL�l���'�]�����%��]�$fo4���C����ߨf����Ux��J�r�R���R�
9���|S{���y�(�M=�[�P4�`#�DA�oPJ�4�&����<�����8�=-ù0G�<%� &(%�y~
�>4#�w�ܤV�<e�+�� lSn��KMy��z���i`}�]Up�'ap�"#S��,�[��񁋽1���^+�r ^_@v1�g���_&��51j�h����	�Q����*TW���ȜM̭����ʇ�hyFʆ��T��5���J&*玒H���< ��7�"�Ӓ�w��bD1������b�K��[��眨�>"�P2��+N%+N��cM�|4v��wR�ϙ����E�;�+j��xWQP-��(;�.�D�oʐE����i��Ę�j�pi�Ռ��ȸS�1aT�����
x)��ر�
���*�ht�[������w?���^7����-������M�1��/�V[M���"���kv�z��[�,�I�������$n̷R���0��&����K3����TLN� ��w�I�7�����~6��h�Ar��qD�/n�jwuɄ�U���2>���:�:���Z���^Mm;�s
�J;�8���@׼����t�|Cl;c�
��=��ޟ��τ#�"�
6��'~x�w)KRl&�b��c5�J ���Wd��34c
DŻ�[��b���b ,����}����i��ھo�h��ZA��)S��,��Mp�V����}�@�F�$���,�h�����*o���"�߮����#��Q�/�}�G,Z|��g(7"�^���hv{.ea�AcB�6��@������a����H��@�!��'V��@$@l�KJ�����Z�|x�}-�R��C�*/������p�|���Æ�N3n��E���(m���'�����Y[Y�}y]���P�_L��~��x\}�?b��t��v�Hӌ�w~>)l?����1�2�!���W���ה�
$,t�w� �-�)�Rwbu��m-�~�����jY|�HQ��v^�kuE�{��BF�b������=eH������`�S=
T
+d��"�����ni�y��	ܹ�k���Aa*=f|�������Փ�K��@�����\�F�yct~��9$?��Ђ�BQ��]�4@�~8����A��y��Cq��C7|R��H�u�0E�;٨�@�R;W���Qx;����������m4�K(��:<j�8e c���r���I<Y�r�o���'A�P��An�r�Of�f�N��<}=�V�������=뱄����-Ӎ�Na
=��[�B4���r%��b�nd� �y%�.�r����j���1]��g�O�����+�/�x��?��>���	�2���ai{_{����*��׆𘚴=�RQ��)�z�ԯ�C��+���R���X�Z��*���)9�qo��8{�a`+�ݴy��ejfy3�����?zè��YC���x
$����X�g5������H�3r2�U|�:7�����9(�Gm\
�+���]e�'�1.Y��� �Ku��3
���j�2��iA�����A����{c�w9
�C�s�F�kU�/
Boeb��1����������d@oNr��v�gS^���4�"Ͱau�1�l!E��'��O�����h��ɔ�◗�&,�*z�ƈ@�C������_��t.��G9�V��g�:�E4��֒���<�:�{~X�
L �)�?N���:��
,�j֌x��_-���I�@d���`8�)���Q��/0A�=`��]��������K� �o��Z{�LR���� �HW�%��h���J���ѥ�S�#�����״����Ր���[i��6��9vl�(�֡�����];�J���v8���]д��S�H��+�����/�79�1ҩ�4����(�r6e-DA0I�)(p9�l�`����&�*��3���m�ũq�ݻѨ�W����x�>�}c�/���bo>1P<��W������%�Ŕ��F�A֭�B9HSф�J�Svů�ej�i�5����n��D����I-��5��_p�)������;T>�����]F�?ѐys�d)UD��fп�F�*����!i��e~|��87#��%N��{�� (Mgy������}mG
�h��h���aC�2$�V=����A�d��C��$���G�cډ�0E�Ta��1�4��8�$��x�Jq�u@n��_�<������n/���#W۵�iΛ�-R��5��JY�
y\�ͬ�M��L#̲�h�g������+9L�
Խ��%;.���6�w>*K�r^�՟5C!:Ԭk ����am�<UM�)��a��Q�苵�,�
+1.�Q6���}^q��|���ZR�O��,�2��'Ok�u���
`���bj�-.�~Y<,i:��̰,���ck*WP�=�Ř	|�
�	��!�������,�b����B�,������b1e�!&�Slh���gj�ʵ��ʂ��*���l�Fq�sk�?BJPp��v %����e!�u"�ȋotB[����;�N�$�E�=_����k(߰�-9J�X�,"@��u�7��22�w^7kg�GSnF���Emk�'��"�Ȯ�U�ka����/��}K�)�֟a�Z��r��-�4�����I.� ��4
y�0
f�l'WlO
&��>�d���5}�&s}�E�|�E���$��������Aw�8w;0�]D	���1�}���Km�~S���z�c.����4�5!
nc��N��y���l�y��y���:-��.�V�,��
�.Uq��_�[���Xn6Sy+P����G�����ͦ A!�6�D�<?#ݜ�b�8��R��[�Tt�oYC�ɤ_���v�y����t����A*]�"&4~n��)P-�����AH��E��>1��
�:>pb`���		�S!�m �hPI
�T&�8|x���.�0Ǆ��wK��亩Ika�h�L�	1=*���#�"43��ʣ�Y��&�O��蚳f=u�X*�_�2����Ԕ��MN�t̙��Z�&�9�kD'I&j��]��婒��m��1�TG$�1y�Z�i+�<7�-��e��������Xn�
� ��J�q���D��C��qk���U4�B���ʗ�&*�1v��+�][����Vg���T�"1�AT�>7O�[��{(Š|�"i�Nb���+zS��n@��،��D��G���Ʃ䛅�b.7w�È���oa��E��#��^
W�������&k)�m�uY��k���P0�Dhp�B\�q�o�� �f�@�ȩ���u�Dx�W�=�*��>@�:�� B�]s��{�����Z�E�r��hO�N�'�Ġ�г�ųl4�ͿX��	�Xd��� ��i�
/**
 * Sends a data object to a service worker via `postMessage` and resolves with
 * a response (if any).
 *
 * A response can be set in a message handler in the service worker by
 * calling `event.ports[0].postMessage(...)`, which will resolve the promise
 * returned by `messageSW()`. If no response is set, the promise will not
 * resolve.
 *
 * @param {ServiceWorker} sw The service worker to send the message to.
 * @param {Object} data An object to send to the service worker.
 * @return {Promise<Object|undefined>}
 * @memberof workbox-window
 */
declare function messageSW(sw: ServiceWorker, data: {}): Promise<any>;
export { messageSW };
                                                                                                                                                                                                                                                                                                                                                                ��K����=�F7c8�)-Q�X�&��J��_aK�	�UԿ���
47�E.~�\W}�;o+
 ���\�k껴�f�͸�n�����}����� {c�%�!����*k� `�(.Ơ����(���t��	>b9�^dc
�$	��è��+=�Ҵb��]t�9�%f���38�=��x
(��9@fl�x����@��|������F��G�	��z��KÑ�l^w(tn�L?p��P�> 
�t��\QC����dHP�((��N1���
�k4L��hxiL�|�课'�=�ixXnHb�L���`b!�:q�誟����eW��!��Ĕ���'��SA�HZti��]|�Hi8~.K	i�0�>Ķ)����{�&����|3xlA����Y溰�\�_��J�՛E�tj�1��hV��
��1��v�Ch` ���\,G�
�{���T�s8�U��3Z�s����p	M���r���YHG5&Ha��,�Y�0�nsvBw9*�q:7ҧu4�B�����mWj{�l�F�N)���w�_��q��]}���E};!J���+>,�1��2�l��
W߱�6n����"C�t�94P� M��Wqt
"�la�l���e)n�bČ��s��zs�4|��¦�0���U�ܟ�b���3���~>
�j��C0�"6�w���.&��j{�7<��;�=}}
},��)�����@�kqd��Y��V�ߥc�^$/�����CK�F$xw������$�3]i��?�J�Κ�C�%���6�Jˬ�*r`�8�	��؃AM��K��ɔ2�M/�"kÂ1�yO�ww�9�J�&V}yu:K�Vj�L�6A�>�͊�͜����ߎ��n�k�o��?�N�*Mc���9�shyn)C���Z5���R�=���Q��3���並��OLtCɗȞ��3��͠+p�t�D��4��+�+N�
a&��9��dp��ae]1�.2ZWk��1��R�|�C�ݶ��)�
�]_r��<���`�O/��)*M4������?B{ҽ9p7g�C5'�W
Ͳ�
�\�-��t�&�N�q�d��*3�r��'훮{�s��4 �d��Y݆�P��E��$O
v&���8��k\Mx͈�%bZ��6�9=��5�!/ސ���Thn�N��5�2�baO���N�t-����W��Ğj5'��
ɕ(������ S'�u�r�j�?ب�8�Z��
�J�7&��F5CÂ雉r-/�%ir��m�Ԅ#s���>�9�e{��6���eo�:Xa/�ȶ�����4��DL��
?)R~'c 2�;�t˫a$����I?Ea�"��H�Z�NS�I��F�阎� 4�R��n�"m���'B��i�	)�{��M?s���;��3�	(>a���%�
/�_��h��O�V�ُ���5i��R ����$è�y���~�V�8�X����&�Jp�_���H}L�j�%�x�ſ58z�����o�*|P���V}g˖"'Xt�#d�S�.��28kK�Fg��q��:�1�F�%GFn q&j_s�\i��2 >}s>�^1�[�}�*��)ڤ:�*��iP)�Ɓ�ت@������+O"t'爇;ґ�L��e.��)v'%j��#��I�ψ��{Y�J
��Dz}yv���F��_<E�cģ�]F�0�Fa]$a�������F��XϨK���cs8��N����F����J�ְM�����}�6)���"�v;&@��F[rh]M�Y����cJ1��̢�S�}:j����˲��3h�d�ͮD�3�+^)�����N�W�� ��r˓�\���m�J�1)^��|,K�>b��o8S9��2�3`DP>��:7��sAh�H�"���yR)��Se��w�E�g�=��<�{�k���@@�mJ��Hݐ"GOE�ߒ�~�4\�)H�k}�)1��@�i��N���Oi ���"�*yj�N����/֠���R2.��`xy���κ�(,�T��vI��/N�GY��E"R��S3J�L�9�\��bE���'#TJ�nKK���Ln�H�*M��^��i�����>�V��@��V��Ga<ن��8~���+c6�����Z�n���Y��h$U�}��L�g�<�mt����\-�KD����G�R~\]6�x�{��o�����S�/�xąFBpO������^s(���L��	��Q�t�s\�v��2!� �^)�@�C�cB8(�HH2���(�ӿCs��a������,{���vu���q:��k�u?x�({,��)��X�/ ���6���E�@S1��A�(C�|���d��3�T�Lu����X�v0���R��;��	�5����c_o�XW��� JIb��%^%{ ��2�w*3fG�6. ���3�ک<o��P��|
��DW�
�k�;q�T
L\�ã�[	5�dO���ti�$�d�;�� � �(�D@-r�n�4��O��������~Nf|h| �h�W4a����]�n��o��;�:B�v�>��oux#�N��M/\p�p%��'�����o;=_�(�D-��pߗ����-n�k.[�6�����n]�VZo@���A�M��ͳc��Kϩ`��g�W5��Aaޚ���x��eH���G�;��p�ʅ����f��	Qy�`�{,>�#��[�@1�KO�L��·�p6���s"c-�>E������PŌ�
iE�1B��@k���m2M(Sx[�l�k��n�.ԇ9�\�P�%ۥ�
c�@����1�(NV�N�]pN�s��=�����5]m��R��/k
�"'hBs�s:�P�'���ʫ!\(,�7�]l�	���5�U-f�ۓ���a(��I�a�6'�`��\���@,ņ������|���4�4fr����^hǛ��Lw+ۄ[8�y_��r��u���x��Q�)�	ٜrj�0��D���@Gs)�z�6�\!թ}��Щ�p $(�4���~�)[�kJ�[�Zڄ���Ma�����h"�=Ї�6�+E�*yup j�����_����E�&��L"!T$�q���5Im���r��mw��7�� p	ގ���6�����Ŭ�Y��TM`�Udo���F�$�����p11��QHC�q�,`e��nK�,�ۇ�0�O�b�q9G�,�H{egNA�i�c�`���T����g���`�$���7��$b/.r>���
K-��ݓe�B�t����1M+�;��l�ƋH�!���������T��I���y󖸾�4���$�#�Y��S��P��9��6���-�����ҕ��^���b���E6$4��HptK��[7!C�n;��Z�6G���*?�ژ�DL�M�� [�1ʥ<�9fY�V��;~���@�ڢ���֢��Dq��,߯	Ϟ��Ͼ�̜)^d��ҳ�cn!/��Ӥ���^�>4
{#�C�i��@���p�p@�Pq���]a�d�V�8v�Ã#�<��B$mAM�<�T^Y��9�F�>�<�-��Aې�Lf͐]�������\&)�!c)��2Q@mL`���q%��3�:�:����lU̡��NƓ9�����N��2[���DY���k�:J�շ����}�����PH̄FB�F�-��1K��~?А���x,n*�4�3##��M��#�e��ST�4Cm�b<?Uut�w�D^�|.�/�g��+0�ֽ�Q����%g1h�^�k�¶җw}
#�rIM���G��17�5qnro���
��_��,��p���f3Dp��P$���w��#DWPj�I+	��R{��G�]�[khb��$�$:G�mz�>`���w����]�u;VjCqJ1s���(����~*vhˁ�%�|��rI��y'��6ؾ����i��g�{��R�K�����JB��kD�S���m�0��a8m\�HY?�+�O�{k����ǾX�-�.Iu�"%E]#Y�$�`{�G���KT��!�f���``�T?ʎu��s�I�� �%2<<��R�[�|h�+�8�39.fI������,�R,Dw���"�t��	�b͙�aюD��M������b��1�a�4�sG�|����;���O0�3����rpQ}�Xc��Ua�R67�!�R�Zb��Qrwa��y�~x��%>��_:$��Z�͇�9E���v�Ԇ6k	e���^�C�i���2�J�|ҳ�8�hD��w��!�]-4�+
%ڢ�r����l�������2�8C���>�R�ȡ;�1�V��U�+�YRį 1Pau%9�-�ؠz/;��0`c��(����m���Z#\�{�Fn��)pI�w�e�=u�l�������S6��������W�4H�"/��nKV9b	
�1��n�2�m=��7릋��h��eq�溚��f?+z�x��+�χ�p�(!V+���
�w7Jp��~��%�\!=Z��+�$���� �
��_��I��
�P(��8��7�.ZJ�X��ɒQ4
�Dm'�Cy����H<M[��!](8]`{[Z��QHd�/N�(�b ڢ}�Ȕ�"�cY�Η2� �ʘH�r �IT�b(qb�t������2����l�?$��y�G�\.�-��D�:�1|�B&=aD5
 )�����ԄY�+�5І��fz��Y��xQ��U�h#���?zed����N���׊�r D)K�0SX�HmD1�J����J�5Q�j����Uܨ&�L�%T<�B|)@]�~���Q��;��}47�݇�۸jJ.���ɽطz
�fJp�}�#p2�T���a�޳}g  Oˌ�Mش��ݙ��|�ۏ�n���=-�9T��RY�/��Y�O��MP29V,	X����Fޯ�.�Z.�f�29Y�Zh�S��n�)By)	��3��bӸ��+)��c���c��d�D�&�+l���^O�#���Yvf���,v����C����S�
�M��h>�+oX4S%�y��6ˉ�	��g����X�+O�ϿA��h*�\�s�Uj f�ҕ�;E�(�yt��c�Y��Z���o?�S��L�X�1~
��N���[:�~*���QlmI�7o�1"�3ȓd�j*Xqv��EmX�t�[iY�,ܐS�j��o�#g�׉�
��N�/}��[K���*��3�U��?�b��D\f9R�K^xɁ���c���(V�xOme��I�K!,C|WR!��E�xd��&�̑��M
����G�^��}�E{b/a��s�^�^�¯��;�K��%����=�F�Ί�{L�7���:4�z�q��*�����Y0\$ԙ���/��[�g>��a�~�v��'�������S��i�(��9�����O�����1C7 �DC��J�&�{ �C�>���}����#a����l���`H=���AKg��R�'���W͑��[�髨.�V6.+���~?�1��[V��}�x�=� ���LÚMe�&�ʔ�ۊL-���_W3���s�뉦�]���u@l��{R {N3��V v����t��6H�$y��~��a�l���<��-"�.ϱ}�#Vz��ez�3�a��7~��ڴ�Ӥ�!��sb.���.�|��u�%��sQ0l=N���A� 5�<�%�/�b�2�e�@� �^<zwUP\�nx���3idq��v��pM?,e5.~1���/=��Q#���״��7ҧ&�N$x ��8������ͣ֒f5)g9-�2>�3�f�Zh6:���g�t���e3Ĺ�h��
��F�+	��րG�d@�=���.��G�>��
�������b�$NmQ���w�H1�Zp_��)�A�x(��_�2����QiJ�:���(�)����4�sa�"#���6?\\�<)��煞���Yԍ=e.��	}�h8����C2��9t��(,� <2As�;�҄%��ȩ��_Fu��u��[`�p,\���|>l,��H�|�)���%�H���
�X��u��t�N��wɺ�d
�P���Q�d���6��:SxH�}Ή��a� O� �LH�ʤ����f��>n�r��߂�+�X�!J�,��dt�2#�`�s��ُl+�l�\�3
8.M��Q������+����8��i
;yA�>r��qSi��?� �����<4��k.M���k�ʑ��/�( N06�?�U֮Q���d�+v��(Q��r���8`fc3oy_�g�G�o����E�6�����;읟[-�a�ɿ��Z�4Z��D�^�Peܟ~���*��~ ������(��4X��*� ��E��\�|�]��\贙����~��vy���Y�dG� ���4���,̒
��ʀp�L����^k�Ƶi����j����#�"��o�u�F��)�H����Ҏ W�*+R�J����3����]s(����g�C����LM)���Y*�dp(_;>$���n��hl�Y���$c��b�P���4��]`��laT��	}��ѱR�n`

=�b8]L��lST�(�eFi.~7c��,�u��p��2p1I���<��0���Ȓ�U؆��7�q�\y]h9 @�	������P���X�r�}-��%,�v4���*}�GYj��FKvV��N�S܌���D;|Sٮ�G`�~�NP\9{��[��+��;�0C]ͭ�������v������ч� p	��#���Q��K\���
�K�Jtc;b�^J�z0GDs���Vk��ѵ���V���΃�kaվs��a�*�;u��>�S���!P�-��d}�qNc��s	�V�G�v�!ǘb�*�9� ���38�X�K���Q���S���D�� ���3Z#�ݏ�<�&=��*��%�v�+6:[����I'�+���(�x�h�N�<ڂ�H w���.#
$�r�<� 05v�hg�(����`)e��x��ȟӣ�Ly�-��{��#T��!�ժD�o�{W��zZn�����E���G�W�:��u��!	l
_FfC�G��D:�ۦ�v�{�c����7��j}�@�/�aэ��ߛ���u���(NLy�
g�P3�I�1+��p 'n��u�����%����q��-�E�_h���
|磳%|�?�+��LrA�ێ�)%��.6��*���_ͯ�9�f�g	�0 ��^��x=�{�������S�q6xhO�]�2j����z�&sY�v��s��Ĉn�f� ��
�]gs Mg,��� ��u����$�8���E`ޢq���U��Q��8�a:qQa�EJ�������|�2�s���1AhGy_�Lدm�8��y��i�;1O؆���5QT�uL�N�m��@��Ws����v�؉���e��BG���q+�5�F}�.�}6Si/�������7ق� ��#�
���A��Ǎlc������/��=��s�slwZ=�oo��S>�n��X6~�b�{7.��H:������s���Н�
QrWx��r�m`'�?g��X����x�ZR���	H�S���i�p�´�gg Ή)�v�`�q�˵	����WGD�<m3�B^s��x���o3�;qy>l��j�#$�O��c ����	VJ�jjj�UM�rt���9��B�Z���2�V��<���}������gH�i�s��Kf���K��'����.����/9����Ӥ����jdKW�PR�����K]����L�D��"�Y ٬\a(xB�,���ψ�x���%�� tʖi�#Ox"��p%&�.2$�M���]�~|��N��,��ȡ"�C��gC�r?�F�&ӆ��+Ν��p�w;��Z�<&�4���/HFƢs�[35��/w�hG��K�Cr�Eq�H���GȎ�&���|����3(��3^��zj��\��l��%��>���v�J7ۇqn����b��i��I�����[f,�+ń�3�3;��>L�J�-���?bƌ���Z����0F��5f��k	��9�l����B�1Q1�l8��:2�Ŵض�	�m,sGh�K��<5	�c�����&���Tۢ��{�=s]o�Q�%���f+�Q{h
|S�o(�������U#�X`�h0���#�?Mz�.�!7oT��SEr��驪�Ϊ=O%�	ۍ�� _S֕�nS^�G�ȑ���G,�𤇰�&$�ED�b�}5�U���P9`x��L�(�18	L��k�wj��G�1�������
itc�;�ʜAS�r[M�ŕ��Rlo��Zs	�s,���Myi��*7n1�	$�^��
"'���z��- 42 �^N��������=�+�=��kc0c/�V֘�h�/��
Z/!G{J��J}<_�3����M�i̋�HU��#����ӫ��ɤ�]sj�+I8B�z�]�؛>�a�Q��4������<w���2=� ����7"���L���P�V�r������(q��f���B���
Hđm١�
�KE��{F��\Zd�"�s�}���<i�Z�9t8��1zS�B"j��]��K��cny&�ˡ�ye�uZf\$���l����۠�`7{��Fv���?��5q�>����*b+F����U3�-�/**
 * @license React
 * react-dom-server.node.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var aa=require("util"),ba=require("react"),k=null,l=0,q=!0;
function r(a,b){if("string"===typeof b){if(0!==b.length)if(2048<3*b.length)0<l&&(t(a,k.subarray(0,l)),k=new Uint8Array(2048),l=0),t(a,u.encode(b));else{var c=k;0<l&&(c=k.subarray(l));c=u.encodeInto(b,c);var d=c.read;l+=c.written;d<b.length&&(t(a,k),k=new Uint8Array(2048),l=u.encodeInto(b.slice(d),k).written);2048===l&&(t(a,k),k=new Uint8Array(2048),l=0)}}else 0!==b.byteLength&&(2048<b.byteLength?(0<l&&(t(a,k.subarray(0,l)),k=new Uint8Array(2048),l=0),t(a,b)):(c=k.length-l,c<b.byteLength&&(0===c?t(a,
k):(k.set(b.subarray(0,c),l),l+=c,t(a,k),b=b.subarray(c)),k=new Uint8Array(2048),l=0),k.set(b,l),l+=b.byteLength,2048===l&&(t(a,k),k=new Uint8Array(2048),l=0)))}function t(a,b){a=a.write(b);q=q&&a}function w(a,b){r(a,b);return q}function ca(a){k&&0<l&&a.write(k.subarray(0,l));k=null;l=0;q=!0}var u=new aa.TextEncoder;function x(a){return u.encode(a)}
var y=Object.prototype.hasOwnProperty,da=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ea={},fa={};
function ha(a){if(y.call(fa,a))return!0;if(y.call(ea,a))return!1;if(da.test(a))return fa[a]=!0;ea[a]=!0;return!1}function z(a,b,c,d,f,e,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=f;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=e;this.removeEmptyString=g}var A={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){A[a]=new z(a,0,!1,a,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];A[b]=new z(b,1,!1,a[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){A[a]=new z(a,2,!1,a.toLowerCase(),null,!1,!1)});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){A[a]=new z(a,2,!1,a,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){A[a]=new z(a,3,!1,a.toLowerCase(),null,!1,!1)});
["checked","multiple","muted","selected"].forEach(function(a){A[a]=new z(a,3,!0,a,null,!1,!1)});["capture","download"].forEach(function(a){A[a]=new z(a,4,!1,a,null,!1,!1)});["cols","rows","size","span"].forEach(function(a){A[a]=new z(a,6,!1,a,null,!1,!1)});["rowSpan","start"].forEach(function(a){A[a]=new z(a,5,!1,a.toLowerCase(),null,!1,!1)});var ia=/[\-:]([a-z])/g;function ja(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ia,
ja);A[b]=new z(b,1,!1,a,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ia,ja);A[b]=new z(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ia,ja);A[b]=new z(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(a){A[a]=new z(a,1,!1,a.toLowerCase(),null,!1,!1)});
A.xlinkHref=new z("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){A[a]=new z(a,1,!1,a.toLowerCase(),null,!0,!0)});
var B={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,
fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ka=["Webkit","ms","Moz","O"];Object.keys(B).forEach(function(a){ka.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);B[b]=B[a]})});var la=/["'&<>]/;
function F(a){if("boolean"===typeof a||"number"===typeof a)return""+a;a=""+a;var b=la.exec(a);if(b){var c="",d,f=0;for(d=b.index;d<a.length;d++){switch(a.charCodeAt(d)){case 34:b="&quot;";break;case 38:b="&amp;";break;case 39:b="&#x27;";break;case 60:b="&lt;";break;case 62:b="&gt;";break;default:continue}f!==d&&(c+=a.substring(f,d));f=d+1;c+=b}a=f!==d?c+a.substring(f,d):c}return a}
var ma=/([A-Z])/g,pa=/^ms-/,qa=Array.isArray,ra=x("<script>"),sa=x("\x3c/script>"),ta=x('<script src="'),ua=x('<script type="module" src="'),va=x('" async="">\x3c/script>'),wa=/(<\/|<)(s)(cript)/gi;function xa(a,b,c,d){return""+b+("s"===c?"\\u0073":"\\u0053")+d}function G(a,b){return{insertionMode:a,selectedValue:b}}
function ya(a,b,c){switch(b){case "select":return G(1,null!=c.value?c.value:c.defaultValue);case "svg":return G(2,null);case "math":return G(3,null);case "foreignObject":return G(1,null);case "table":return G(4,null);case "thead":case "tbody":case "tfoot":return G(5,null);case "colgroup":return G(7,null);case "tr":return G(6,null)}return 4<=a.insertionMode||0===a.insertionMode?G(1,null):a}var za=x("\x3c!-- --\x3e");function Aa(a,b,c,d){if(""===b)return d;d&&a.push(za);a.push(F(b));return!0}
var Ba=new Map,Ca=x(' style="'),Da=x(":"),Ea=x(";");
function Fa(a,b,c){if("object"!==typeof c)throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");b=!0;for(var d in c)if(y.call(c,d)){var f=c[d];if(null!=f&&"boolean"!==typeof f&&""!==f){if(0===d.indexOf("--")){var e=F(d);f=F((""+f).trim())}else{e=d;var g=Ba.get(e);void 0!==g?e=g:(g=x(F(e.replace(ma,"-$1").toLowerCase().replace(pa,"-ms-"))),Ba.set(e,g),e=g);f="number"===typeof f?0===f||y.call(B,
d)?""+f:f+"px":F((""+f).trim())}b?(b=!1,a.push(Ca,e,Da,f)):a.push(Ea,e,Da,f)}}b||a.push(H)}var I=x(" "),J=x('="'),H=x('"'),Ga=x('=""');
function K(a,b,c,d){switch(c){case "style":Fa(a,b,d);return;case "defaultValue":case "defaultChecked":case "innerHTML":case "suppressContentEditableWarning":case "suppressHydrationWarning":return}if(!(2<c.length)||"o"!==c[0]&&"O"!==c[0]||"n"!==c[1]&&"N"!==c[1])if(b=A.hasOwnProperty(c)?A[c]:null,null!==b){switch(typeof d){case "function":case "symbol":return;case "boolean":if(!b.acceptsBooleans)return}c=b.attributeName;switch(b.type){case 3:d&&a.push(I,c,Ga);break;case 4:!0===d?a.push(I,c,Ga):!1!==
d&&a.push(I,c,J,F(d),H);break;case 5:isNaN(d)||a.push(I,c,J,F(d),H);break;case 6:!isNaN(d)&&1<=d&&a.push(I,c,J,F(d),H);break;default:b.sanitizeURL&&(d=""+d),a.push(I,c,J,F(d),H)}}else if(ha(c)){switch(typeof d){case "function":case "symbol":return;case "boolean":if(b=c.toLowerCase().slice(0,5),"data-"!==b&&"aria-"!==b)return}a.push(I,c,J,F(d),H)}}var L=x(">"),Ha=x("/>");
function M(a,b,c){if(null!=b){if(null!=c)throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");if("object"!==typeof b||!("__html"in b))throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");b=b.__html;null!==b&&void 0!==b&&a.push(""+b)}}function Ia(a){var b="";ba.Children.forEach(a,function(a){null!=a&&(b+=a)});return b}var Ja=x(' selected=""');
function Ka(a,b,c,d){a.push(N(c));var f=c=null,e;for(e in b)if(y.call(b,e)){var g=b[e];if(null!=g)switch(e){case "children":c=g;break;case "dangerouslySetInnerHTML":f=g;break;default:K(a,d,e,g)}}a.push(L);M(a,f,c);return"string"===typeof c?(a.push(F(c)),null):c}var La=x("\n"),Ma=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,Na=new Map;function N(a){var b=Na.get(a);if(void 0===b){if(!Ma.test(a))throw Error("Invalid tag: "+a);b=x("<"+a);Na.set(a,b)}return b}var Oa=x("<!DOCTYPE html>");
function Pa(a,b,c,d,f){switch(b){case "select":a.push(N("select"));var e=null,g=null;for(p in c)if(y.call(c,p)){var h=c[p];if(null!=h)switch(p){case "children":e=h;break;case "dangerouslySetInnerHTML":g=h;break;case "defaultValue":case "value":break;default:K(a,d,p,h)}}a.push(L);M(a,g,e);return e;case "option":g=f.selectedValue;a.push(N("option"));var m=h=null,n=null;var p=null;for(e in c)if(y.call(c,e)){var v=c[e];if(null!=v)switch(e){case "children":h=v;break;case "selected":n=v;break;case "dangerouslySetInnerHTML":p=
v;break;case "value":m=v;default:K(a,d,e,v)}}if(null!=g)if(c=null!==m?""+m:Ia(h),qa(g))for(d=0;d<g.length;d++){if(""+g[d]===c){a.push(Ja);break}}else""+g===c&&a.push(Ja);else n&&a.push(Ja);a.push(L);M(a,p,h);return h;case "textarea":a.push(N("textarea"));p=g=e=null;for(h in c)if(y.call(c,h)&&(m=c[h],null!=m))switch(h){case "children":p=m;break;case "value":e=m;break;case "defaultValue":g=m;break;case "dangerouslySetInnerHTML":throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
default:K(a,d,h,m)}null===e&&null!==g&&(e=g);a.push(L);if(null!=p){if(null!=e)throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");if(qa(p)&&1<p.length)throw Error("<textarea> can only have at most one child.");e=""+p}"string"===typeof e&&"\n"===e[0]&&a.push(La);null!==e&&a.push(F(""+e));return null;case "input":a.push(N("input"));m=p=h=e=null;for(g in c)if(y.call(c,g)&&(n=c[g],null!=n))switch(g){case "children":case "dangerouslySetInnerHTML":throw Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
case "defaultChecked":m=n;break;case "defaultValue":h=n;break;case "checked":p=n;break;case "value":e=n;break;default:K(a,d,g,n)}null!==p?K(a,d,"checked",p):null!==m&&K(a,d,"checked",m);null!==e?K(a,d,"value",e):null!==h&&K(a,d,"value",h);a.push(Ha);return null;case "menuitem":a.push(N("menuitem"));for(var C in c)if(y.call(c,C)&&(e=c[C],null!=e))switch(C){case "children":case "dangerouslySetInnerHTML":throw Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");default:K(a,d,C,e)}a.push(L);
return null;case "title":a.push(N("title"));e=null;for(v in c)if(y.call(c,v)&&(g=c[v],null!=g))switch(v){case "children":e=g;break;case "dangerouslySetInnerHTML":throw Error("`dangerouslySetInnerHTML` does not make sense on <title>.");default:K(a,d,v,g)}a.push(L);return e;case "listing":case "pre":a.push(N(b));g=e=null;for(m in c)if(y.call(c,m)&&(h=c[m],null!=h))switch(m){case "children":e=h;break;case "dangerouslySetInnerHTML":g=h;break;default:K(a,d,m,h)}a.push(L);if(null!=g){if(null!=e)throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
if("object"!==typeof g||!("__html"in g))throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");c=g.__html;null!==c&&void 0!==c&&("string"===typeof c&&0<c.length&&"\n"===c[0]?a.push(La,c):a.push(""+c))}"string"===typeof e&&"\n"===e[0]&&a.push(La);return e;case "area":case "base":case "br":case "col":case "embed":case "hr":case "img":case "keygen":case "link":case "meta":case "param":case "source":case "track":case "wbr":a.push(N(b));
for(var D in c)if(y.call(c,D)&&(e=c[D],null!=e))switch(D){case "children":case "dangerouslySetInnerHTML":throw Error(b+" is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");default:K(a,d,D,e)}a.push(Ha);return null;case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return Ka(a,c,b,d);case "html":return 0===f.insertionMode&&a.push(Oa),Ka(a,c,
b,d);default:if(-1===b.indexOf("-")&&"string"!==typeof c.is)return Ka(a,c,b,d);a.push(N(b));g=e=null;for(n in c)if(y.call(c,n)&&(h=c[n],null!=h))switch(n){case "children":e=h;break;case "dangerouslySetInnerHTML":g=h;break;case "style":Fa(a,d,h);break;case "suppressContentEditableWarning":case "suppressHydrationWarning":break;default:ha(n)&&"function"!==typeof h&&"symbol"!==typeof h&&a.push(I,n,J,F(h),H)}a.push(L);M(a,g,e);return e}}
var Qa=x("</"),Ra=x(">"),Sa=x('<template id="'),Ta=x('"></template>'),Ua=x("\x3c!--$--\x3e"),Va=x('\x3c!--$?--\x3e<template id="'),Wa=x('"></template>'),Xa=x("\x3c!--$!--\x3e"),Ya=x("\x3c!--/$--\x3e"),Za=x("<template"),$a=x('"'),ab=x(' data-dgst="');x(' data-msg="');x(' data-stck="');var bb=x("></template>");function cb(a,b,c){r(a,Va);if(null===c)throw Error("An ID must have been assigned before we can complete the boundary.");r(a,c);return w(a,Wa)}
var db=x('<div hidden id="'),eb=x('">'),fb=x("</div>"),gb=x('<svg aria-hidden="true" style="display:none" id="'),hb=x('">'),ib=x("</svg>"),jb=x('<math aria-hidden="true" style="display:none" id="'),kb=x('">'),lb=x("</math>"),mb=x('<table hidden id="'),nb=x('">'),ob=x("</table>"),pb=x('<table hidden><tbody id="'),qb=x('">'),rb=x("</tbody></table>"),sb=x('<table hidden><tr id="'),tb=x('">'),ub=x("</tr></table>"),vb=x('<table hidden><colgroup id="'),wb=x('">'),xb=x("</colgroup></table>");
function yb(a,b,c,d){switch(c.insertionMode){case 0:case 1:return r(a,db),r(a,b.segmentPrefix),r(a,d.toString(16)),w(a,eb);case 2:return r(a,gb),r(a,b.segmentPrefix),r(a,d.toString(16)),w(a,hb);case 3:return r(a,jb),r(a,b.segmentPrefix),r(a,d.toString(16)),w(a,kb);case 4:return r(a,mb),r(a,b.segmentPrefix),r(a,d.toString(16)),w(a,nb);case 5:return r(a,pb),r(a,b.segmentPrefix),r(a,d.toString(16)),w(a,qb);case 6:return r(a,sb),r(a,b.segmentPrefix),r(a,d.toString(16)),w(a,tb);case 7:return r(a,vb),r(a,
b.segmentPrefix),r(a,d.toString(16)),w(a,wb);default:throw Error("Unknown insertion mode. This is a bug in React.");}}function zb(a,b){switch(b.insertionMode){case 0:case 1:return w(a,fb);case 2:return w(a,ib);case 3:return w(a,lb);case 4:return w(a,ob);case 5:return w(a,rb);case 6:return w(a,ub);case 7:return w(a,xb);default:throw Error("Unknown insertion mode. This is a bug in React.");}}
var Ab=x('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'),Bb=x('$RS("'),Cb=x('","'),Db=x('")\x3c/script>'),Fb=x('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("'),
Gb=x('$RC("'),Hb=x('","').
         *
         * The socket timeout logic is set up on connection, so changing this
         * value only affects new connections to the server, not any existing connections.
         * @since v0.9.12
         */
        timeout: number;
        /**
         * Limit the amount of time the parser will wait to receive the complete HTTP
         * headers.
         *
         * If the timeout expires, the server responds with status 408 without
         * forwarding the request to the request listener and then closes the connection.
         *
         * It must be set to a non-zero value (e.g. 120 seconds) to protect against
         * potential Denial-of-Service attacks in case the server is deployed without a
         * reverse proxy in front.
         * @since v11.3.0, v10.14.0
         */
        headersTimeout: number;
        /**
         * The number of milliseconds of inactivity a server needs to wait for additional
         * incoming data, after it has finished writing the last response, before a socket
         * will be destroyed. If the server receives new data before the keep-alive
         * timeout has fired, it will reset the regular inactivity timeout, i.e.,`server.timeout`.
         *
         * A value of `0` will disable the keep-alive timeout behavior on incoming
         * connections.
         * A value of `0` makes the http server behave similarly to Node.js versions prior
         * to 8.0.0, which did not have a keep-alive timeout.
         *
         * The socket timeout logic is set up on connection, so changing this value only
         * affects new connections to the server, not any existing connections.
         * @since v8.0.0
         */
        keepAliveTimeout: number;
        /**
         * Sets the timeout value in milliseconds for receiving the entire request from
         * the client.
         *
         * If the timeout expires, the server responds with status 408 without
         * forwarding the request to the request listener and then closes the connection.
         *
         * It must be set to a non-zero value (e.g. 120 seconds) to protect against
         * potential Denial-of-Service attacks in case the server is deployed without a
         * reverse proxy in front.
         * @since v14.11.0
         */
        requestTimeout: number;
        /**
         * Closes all connections connected to this server.
         * @since v18.2.0
         */
        closeAllConnections(): void;
        /**
         * Closes all connections connected to this server which are not sending a request
         * or waiting for a response.
         * @since v18.2.0
         */
        closeIdleConnections(): void;
        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "close", listener: () => void): this;
        addListener(event: "connection", listener: (socket: Socket) => void): this;
        addListener(event: "error", listener: (err: Error) => void): this;
        addListener(event: "listening", listener: () => void): this;
        addListener(event: "checkContinue", listener: RequestListener<Request, Response>): this;
        addListener(event: "checkExpectation", listener: RequestListener<Request, Response>): this;
        addListener(event: "clientError", listener: (err: Error, socket: stream.Duplex) => void): this;
        addListener(
            event: "connect",
            listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void,
        ): this;
        addListener(event: "dropRequest", listener: (req: InstanceType<Request>, socket: stream.Duplex) => void): this;
        addListener(event: "request", listener: RequestListener<Request, Response>): this;
        addListener(
            event: "upgrade",
            listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void,
        ): this;
        emit(event: string, ...args: any[]): boolean;
        emit(event: "close"): boolean;
        emit(event: "connection", socket: Socket): boolean;
        emit(event: "error", err: Error): boolean;
        emit(event: "listening"): boolean;
        emit(
            event: "checkContinue",
            req: InstanceType<Request>,
            res: InstanceType<Response> & { req: InstanceType<Request> },
        ): boolean;
        emit(
            event: "checkExpectation",
            req: InstanceType<Request>,
            res: InstanceType<Response> & { req: InstanceType<Request> },
        ): boolean;
        emit(event: "clientError", err: Error, socket: stream.Duplex): boolean;
        emit(event: "connect", req: InstanceType<Request>, socket: stream.Duplex, head: Buffer): boolean;
        emit(event: "dropRequest", req: InstanceType<Request>, socket: stream.Duplex): boolean;
        emit(
            event: "request",
            req: InstanceType<Request>,
            res: InstanceType<Response> & { req: InstanceType<Request> },
        ): boolean;
        emit(event: "upgrade", req: InstanceType<Request>, socket: stream.Duplex, head: Buffer): boolean;
        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "close", listener: () => void): this;
        on(event: "connection", listener: (socket: Socket) => void): this;
        on(event: "error", listener: (err: Error) => void): this;
        on(event: "listening", listener: () => void): this;
        on(event: "checkContinue", listener: RequestListener<Request, Response>): this;
        on(event: "checkExpectation", listener: RequestListener<Request, Response>): this;
        on(event: "clientError", listener: (err: Error, socket: stream.Duplex) => void): this;
        on(event: "connect", listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void): this;
        on(event: "dropRequest", listener: (req: InstanceType<Request>, socket: stream.Duplex) => void): this;
        on(event: "request", listener: RequestListener<Request, Response>): this;
        on(event: "upgrade", listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void): this;
        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "close", listener: () => void): this;
        once(event: "connection", listener: (socket: Socket) => void): this;
        once(event: "error", listener: (err: Error) => void): this;
        once(event: "listening", listener: () => void): this;
        once(event: "checkContinue", listener: RequestListener<Request, Response>): this;
        once(event: "checkExpectation", listener: RequestListener<Request, Response>): this;
        once(event: "clientError", listener: (err: Error, socket: stream.Duplex) => void): this;
        once(
            event: "connect",
            listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void,
        ): this;
        once(event: "dropRequest", listener: (req: InstanceType<Request>, socket: stream.Duplex) => void): this;
        once(event: "request", listener: RequestListener<Request, Response>): this;
        once(
            event: "upgrade",
            listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void,
        ): this;
        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "close", listener: () => void): this;
        prependListener(event: "connection", listener: (socket: Socket) => void): this;
        prependListener(event: "error", listener: (err: Error) => void): this;
        prependListener(event: "listening", listener: () => void): this;
        prependListener(event: "checkContinue", listener: RequestListener<Request, Response>): this;
        prependListener(event: "checkExpectation", listener: RequestListener<Request, Response>): this;
        prependListener(event: "clientError", listener: (err: Error, socket: stream.Duplex) => void): this;
        prependListener(
            event: "connect",
            listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void,
        ): this;
        prependListener(
            event: "dropRequest",
            listener: (req: InstanceType<Request>, socket: stream.Duplex) => void,
        ): this;
        prependListener(event: "request", listener: RequestListener<Request, Response>): this;
        prependListener(
            event: "upgrade",
            listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void,
        ): this;
        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "close", listener: () => void): this;
        prependOnceListener(event: "connection", listener: (socket: Socket) => void): this;
        prependOnceListener(event: "error", listener: (err: Error) => void): this;
        prependOnceListener(event: "listening", listener: () => void): this;
        prependOnceListener(event: "checkContinue", listener: RequestListener<Request, Response>): this;
        prependOnceListener(event: "checkExpectation", listener: RequestListener<Request, Response>): this;
        prependOnceListener(event: "clientError", listener: (err: Error, socket: stream.Duplex) => void): this;
        prependOnceListener(
            event: "connect",
            listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void,
        ): this;
        prependOnceListener(
            event: "dropRequest",
            listener: (req: InstanceType<Request>, socket: stream.Duplex) => void,
        ): this;
        prependOnceListener(event: "request", listener: RequestListener<Request, Response>): this;
        prependOnceListener(
            event: "upgrade",
            listener: (req: InstanceType<Request>, socket: stream.Duplex, head: Buffer) => void,
        ): this;
    }
    /**
     * This class serves as the parent class of {@link ClientRequest} and {@link ServerResponse}. It is an abstract outgoing message from
     * the perspective of the participants of an HTTP transaction.
     * @since v0.1.17
     */
    class OutgoingMessage<Request extends IncomingMessage = IncomingMessage> extends stream.Writable {
        readonly req: Request;
        chunkedEncoding: boolean;
        shouldKeepAlive: boolean;
        useChunkedEncodingByDefault: boolean;
        sendDate: boolean;
        /**
         * @deprecated Use `writableEnded` instead.
         */
        finished: boolean;
        /**
         * Read-only. `true` if the headers were sent, otherwise `false`.
         * @since v0.9.3
         */
        readonly headersSent: boolean;
        /**
         * Alias of `outgoingMessage.socket`.
         * @since v0.3.0
         * @deprecated Since v15.12.0,v14.17.1 - Use `socket` instead.
         */
        readonly connection: Socket | null;
        /**
         * Reference to the underlying socket. Usually, users will not want to access
         * this property.
         *
         * After calling `outgoingMessage.end()`, this property will be nulled.
         * @since v0.3.0
         */
        readonly socket: Socket | null;
        constructor();
        /**
         * Once a socket is associated with the message and is connected,`socket.setTimeout()` will be called with `msecs` as the first parameter.
         * @since v0.9.12
         * @param callback Optional function to be called when a timeout occurs. Same as binding to the `timeout` event.
         */
        setTimeout(msecs: number, callback?: () => void): this;
        /**
         * Sets a single header value. If the header already exists in the to-be-sent
         * headers, its value will be replaced. Use an array of strings to send multiple
         * headers with the same name.
         * @since v0.4.0
         * @param name Header name
         * @param value Header value
         */
        setHeader(name: string, value: number | string | readonly string[]): this;
        /**
         * Append a single header value for the header object.
         *
         * If the value is an array, this is equivalent of calling this method multiple
         * times.
         *
         * If there were no previous value for the header, this is equivalent of calling `outgoingMessage.setHeader(name, value)`.
         *
         * Depending of the value of `options.uniqueHeaders` when the client request or the
         * server were created, this will end up in the header being sent multiple times or
         * a single time with values joined using `; `.
         * @since v18.3.0, v16.17.0
         * @param name Header name
         * @param value Header value
         */
        appendHeader(name: string, value: string | readonly string[]): this;
        /**
         * Gets the value of the HTTP header with the given name. If that header is not
         * set, the returned value will be `undefined`.
         * @since v0.4.0
         * @param name Name of header
         */
        getHeader(name: string): number | string | string[] | undefined;
        /**
         * Returns a shallow copy of the current outgoing headers. Since a shallow
         * copy is used, array values may be mutated without additional calls to
         * various header-related HTTP module methods. The keys of the returned
         * object are the header names and the values are the respective header
         * values. All header names are lowercase.
         *
         * The object returned by the `outgoingMessage.getHeaders()` method does
         * not prototypically inherit from the JavaScript `Object`. This means that
         * typical `Object` methods such as `obj.toString()`, `obj.hasOwnProperty()`,
         * and others are not defined and will not work.
         *
         * ```js
         * outgoingMessage.setHeader('Foo', 'bar');
         * outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);
         *
         * const headers = outgoingMessage.getHeaders();
         * // headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
         * ```
         * @since v7.7.0
         */
        getHeaders(): OutgoingHttpHeaders;
        /**
         * Returns an array containing the unique names of the current outgoing headers.
         * All names are lowercase.
         * @since v7.7.0
         */
        getHeaderNames(): string[];
        /**
         * Returns `true` if the header identified by `name` is currently set in the
         * outgoing headers. The header name is case-insensitive.
         *
         * ```js
         * const hasContentType = outgoingMessage.hasHeader('content-type');
         * ```
         * @since v7.7.0
         */
        hasHeader(name: string): boolean;
        /**
         * Removes a header that is queued for implicit sending.
         *
         * ```js
         * outgoingMessage.removeHeader('Content-Encoding');
         * ```
         * @since v0.4.0
         * @param name Header name
         */
        removeHeader(name: string): void;
        /**
         * Adds HTTP trailers (headers but at the end of the message) to the message.
         *
         * Trailers will **only** be emitted if the message is chunked encoded. If not,
         * the trailers will be silently discarded.
         *
         * HTTP requires the `Trailer` header to be sent to emit trailers,
         * with a list of header field names in its value, e.g.
         *
         * ```js
         * message.writeHead(200, { 'Content-Type': 'text/plain',
         *                          'Trailer': 'Content-MD5' });
         * message.write(fileData);
         * message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
         * message.end();
         * ```
         *
         * Attempting to set a header field name or value that contains invalid characters
         * will result in a `TypeError` being thrown.
         * @since v0.3.0
         */
        addTrailers(headers: OutgoingHttpHeaders | ReadonlyArray<[string, string]>): void;
        /**
         * Flushes the message headers.
         *
         * For efficiency reason, Node.js normally buffers the message headers
         * until `outgoingMessage.end()` is called or the first chunk of message data
         * is written. It then tries to pack the headers and data into a single TCPdeclare namespace TsConfigJson {
	namespace CompilerOptions {
		export type JSX =
			| 'preserve'
			| 'react'
			| 'react-native';

		export type Module =
			| 'CommonJS'
			| 'AMD'
			| 'System'
			| 'UMD'
			| 'ES6'
			| 'ES2015'
			| 'ESNext'
			| 'None'
			// Lowercase alternatives
			| 'commonjs'
			| 'amd'
			| 'system'
			| 'umd'
			| 'es6'
			| 'es2015'
			| 'esnext'
			| 'none';

		export type NewLine =
			| 'CRLF'
			| 'LF'
			// Lowercase alternatives
			| 'crlf'
			| 'lf';

		export type Target =
			| 'ES3'
			| 'ES5'
			| 'ES6'
			| 'ES2015'
			| 'ES2016'
			| 'ES2017'
			| 'ES2018'
			| 'ES2019'
			| 'ES2020'
			| 'ESNext'
			// Lowercase alternatives
			| 'es3'
			| 'es5'
			| 'es6'
			| 'es2015'
			| 'es2016'
			| 'es2017'
			| 'es2018'
			| 'es2019'
			| 'es2020'
			| 'esnext';

		export type Lib =
			| 'ES5'
			| 'ES6'
			| 'ES7'
			| 'ES2015'
			| 'ES2015.Collection'
			| 'ES2015.Core'
			| 'ES2015.Generator'
			| 'ES2015.Iterable'
			| 'ES2015.Promise'
			| 'ES2015.Proxy'
			| 'ES2015.Reflect'
			| 'ES2015.Symbol.WellKnown'
			| 'ES2015.Symbol'
			| 'ES2016'
			| 'ES2016.Array.Include'
			| 'ES2017'
			| 'ES2017.Intl'
			| 'ES2017.Object'
			| 'ES2017.SharedMemory'
			| 'ES2017.String'
			| 'ES2017.TypedArrays'
			| 'ES2018'
			| 'ES2018.AsyncIterable'
			| 'ES2018.Intl'
			| 'ES2018.Promise'
			| 'ES2018.Regexp'
			| 'ES2019'
			| 'ES2019.Array'
			| 'ES2019.Object'
			| 'ES2019.String'
			| 'ES2019.Symbol'
			| 'ES2020'
			| 'ES2020.String'
			| 'ES2020.Symbol.WellKnown'
			| 'ESNext'
			| 'ESNext.Array'
			| 'ESNext.AsyncIterable'
			| 'ESNext.BigInt'
			| 'ESNext.Intl'
			| 'ESNext.Symbol'
			| 'DOM'
			| 'DOM.Iterable'
			| 'ScriptHost'
			| 'WebWorker'
			| 'WebWorker.ImportScripts'
			// Lowercase alternatives
			| 'es5'
			| 'es6'
			| 'es7'
			| 'es2015'
			| 'es2015.collection'
			| 'es2015.core'
			| 'es2015.generator'
			| 'es2015.iterable'
			| 'es2015.promise'
			| 'es2015.proxy'
			| 'es2015.reflect'
			| 'es2015.symbol.wellknown'
			| 'es2015.symbol'
			| 'es2016'
			| 'es2016.array.include'
			| 'es2017'
			| 'es2017.intl'
			| 'es2017.object'
			| 'es2017.sharedmemory'
			| 'es2017.string'
			| 'es2017.typedarrays'
			| 'es2018'
			| 'es2018.asynciterable'
			| 'es2018.intl'
			| 'es2018.promise'
			| 'es2018.regexp'
			| 'es2019'
			| 'es2019.array'
			| 'es2019.object'
			| 'es2019.string'
			| 'es2019.symbol'
			| 'es2020'
			| 'es2020.string'
			| 'es2020.symbol.wellknown'
			| 'esnext'
			| 'esnext.array'
			| 'esnext.asynciterable'
			| 'esnext.bigint'
			| 'esnext.intl'
			| 'esnext.symbol'
			| 'dom'
			| 'dom.iterable'
			| 'scripthost'
			| 'webworker'
			| 'webworker.importscripts';

		export interface Plugin {
			[key: string]: unknown;
			/**
			Plugin name.
			*/
			name?: string;
		}
	}

	export interface CompilerOptions {
		/**
		The character set of the input files.

		@default 'utf8'
		*/
		charset?: string;

		/**
		Enables building for project references.

		@default true
		*/
		composite?: boolean;

		/**
		Generates corresponding d.ts files.

		@default false
		*/
		declaration?: boolean;

		/**
		Specify output directory for generated declaration files.

		Requires TypeScript version 2.0 or later.
		*/
		declarationDir?: string;

		/**
		Show diagnostic information.

		@default false
		*/
		diagnostics?: boolean;

		/**
		Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.

		@default false
		*/
		emitBOM?: boolean;

		/**
		Only emit `.d.ts` declaration files.

		@default false
		*/
		emitDeclarationOnly?: boolean;

		/**
		Enable incremental compilation.

		@default `composite`
		*/
		incremental?: boolean;

		/**
		Specify file to store incremental compilation information.

		@default '.tsbuildinfo'
		*/
		tsBuildInfoFile?: string;

		/**
		Emit a single file with source maps instead of having a separate file.

		@default false
		*/
		inlineSourceMap?: boolean;

		/**
		Emit the source alongside the sourcemaps within a single file.

		Requires `--inlineSourceMap` to be set.

		@default false
		*/
		inlineSources?: boolean;

		/**
		Specify JSX code generation: `'preserve'`, `'react'`, or `'react-native'`.

		@default 'preserve'
		*/
		jsx?: CompilerOptions.JSX;

		/**
		Specifies the object invoked for `createElement` and `__spread` when targeting `'react'` JSX emit.

		@default 'React'
		*/
		reactNamespace?: string;

		/**
		Print names of files part of the compilation.

		@default false
		*/
		listFiles?: boolean;

		/**
		Specifies the location where debugger should locate map files instead of generated locations.
		*/
		mapRoot?: string;

		/**
		Specify module code generation: 'None', 'CommonJS', 'AMD', 'System', 'UMD', 'ES6', 'ES2015' or 'ESNext'. Only 'AMD' and 'System' can be used in conjunction with `--outFile`. 'ES6' and 'ES2015' values may be used when targeting 'ES5' or lower.

		@default ['ES3', 'ES5'].includes(target) ? 'CommonJS' : 'ES6'
		*/
		module?: CompilerOptions.Module;

		/**
		Specifies the end of line sequence to be used when emitting files: 'crlf' (Windows) or 'lf' (Unix).

		Default: Platform specific
		*/
		newLine?: CompilerOptions.NewLine;

		/**
		Do not emit output.

		@default false
		*/
		noEmit?: boolean;

		/**
		Do not generate custom helper functions like `__extends` in compiled output.

		@default false
		*/
		noEmitHelpers?: boolean;

		/**
		Do not emit outputs if any type checking errors were reported.

		@default false
		*/
		noEmitOnError?: boolean;

		/**
		Warn on expressions and declarations with an implied 'any' type.

		@default false
		*/
		noImplicitAny?: boolean;

		/**
		Raise error on 'this' expressions with an implied any type.

		@default false
		*/
		noImplicitThis?: boolean;

		/**
		Report errors on unused locals.

		Requires TypeScript version 2.0 or later.

		@default false
		*/
		noUnusedLocals?: boolean;

		/**
		Report errors on unused parameters.

		Requires TypeScript version 2.0 or later.

		@default false
		*/
		noUnusedParameters?: boolean;

		/**
		Do not include the default library file (lib.d.ts).

		@default false
		*/
		noLib?: boolean;

		/**
		Do not add triple-slash references or module import targets to the list of compiled files.

		@default false
		*/
		noResolve?: boolean;

		/**
		Disable strict checking of generic signatures in function types.

		@default false
		*/
		noStrictGenericChecks?: boolean;

		/**
		@deprecated use `skipLibCheck` instead.
		*/
		skipDefaultLibCheck?: boolean;

		/**
		Skip type checking of declaration files.

		Requires TypeScript version 2.0 or later.

		@default false
		*/
		skipLibCheck?: boolean;

		/**
		Concatenate and emit output to single file.
		*/
		outFile?: string;

		/**
		Redirect output structure to the directory.
		*/
		outDir?: string;

		/**
		Do not erase const enum declarations in generated code.

		@default false
		*/
		preserveConstEnums?: boolean;

		/**
		Do not resolve symlinks to their real path; treat a symlinked file like a real one.

		@default false
		*/
		preserveSymlinks?: boolean;

		/**
		Keep outdated console output in watch mode instead of clearing the screen.

		@default false
		*/
		preserveWatchOutput?: boolean;

		/**
		Stylize errors and messages using color and context (experimental).

		@default true // Unless piping to another program or redirecting output to a file.
		*/
		pretty?: boolean;

		/**
		Do not emit comments to output.

		@default false
		*/
		removeComments?: boolean;

		/**
		Specifies the root directory of input files.

		Use to control the output directory structure with `--outDir`.
		*/
		rootDir?: string;

		/**
		Unconditionally emit imports for unresolved files.

		@default false
		*/
		isolatedModules?: boolean;

		/**
		Generates corresponding '.map' file.

		@default false
		*/
		sourceMap?: boolean;

		/**
		Specifies the location where debugger should locate TypeScript files instead of source locations.
		*/
		sourceRoot?: string;

		/**
		Suppress excess property checks for object literals.

		@default false
		*/
		suppressExcessPropertyErrors?: boolean;

		/**
		Suppress noImplicitAny errors for indexing objects lacking index signatures.

		@default false
		*/
		suppressImplicitAnyIndexErrors?: boolean;

		/**
		Do not emit declarations for code that has an `@internal` annotation.
		*/
		stripInternal?: boolean;

		/**
		Specify ECMAScript target version.

		@default 'es3'
		*/
		target?: CompilerOptions.Target;

		/**
		Watch input files.

		@default false
		*/
		watch?: boolean;

		/**
		Enables experimental support for ES7 decorators.

		@default false
		*/
		experimentalDecorators?: boolean;

		/**
		Emit design-type metadata for decorated declarations in source.

		@default false
		*/
		emitDecoratorMetadata?: boolean;

		/**
		Specifies module resolution strategy: 'node' (Node) or 'classic' (TypeScript pre 1.6).

		@default ['AMD', 'System', 'ES6'].includes(module) ? 'classic' : 'node'
		*/
		moduleResolution?: 'classic' | 'node';

		/**
		Do not report errors on unused labels.

		@default false
		*/
		allowUnusedLabels?: boolean;

		/**
		Report error when not all code paths in function return a value.

		@default false
		*/
		noImplicitReturns?: boolean;

		/**
		Report errors for fallthrough cases in switch statement.

		@default false
		*/
		noFallthroughCasesInSwitch?: boolean;

		/**
		Do not report errors on unreachable code.

		@default false
		*/
		allowUnreachableCode?: boolean;

		/**
		Disallow inconsistently-cased references to the same file.

		@default false
		*/
		forceConsistentCasingInFileNames?: boolean;

		/**
		Base directory to resolve non-relative module names.
		*/
		baseUrl?: string;

		/**
		Specify path mapping to be computed relative to baseUrl option.
		*/
		paths?: Record<string, string[]>;

		/**
		List of TypeScript language server plugins to load.

		Requires TypeScript version 2.3 or later.
		*/
		plugins?: CompilerOptions.Plugin[];

		/**
		Specify list of root directories to be used when resolving modules.
		*/
		rootDirs?: string[];

		/**
		Specify list of directories for type definition files to be included.

		Requires TypeScript version 2.0 or later.
		*/
		typeRoots?: string[];

		/**
		Type declaration files to be included in compilation.

		Requires TypeScript version 2.0 or later.
		*/
		types?: string[];

		/**
		Enable tracing of the name resolution process.

		@default false
		*/
		traceResolution?: boolean;

		/**
		Allow javascript files to be compiled.

		@default false
		*/
		allowJs?: boolean;

		/**
		Do not truncate error messages.

		@default false
		*/
		noErrorTruncation?: boolean;

		/**
		Allow default imports from modules with no default export. This does not affect code emit, just typechecking.

		@default module === 'system' || esModuleInterop
		*/
		allowSyntheticDefaultImports?: boolean;

		/**
		Do not emit `'use strict'` directives in module output.

		@default false
		*/
		noImplicitUseStrict?: boolean;

		/**
		Enable to list all emitted files.

		Requires TypeScript version 2.0 or later.

		@default false
		*/
		listEmittedFiles?: boolean;

		/**
		Disable size limit for JavaScript project.

		Requires TypeScript version 2.0 or later.

		@default false
		*/
		disableSizeLimit?: boolean;

		/**
		List of library files to be included in the compilation.

		Requires TypeScript version 2.0 or later.
		*/
		lib?: CompilerOptions.Lib[];

		/**
		Enable strict null checks.

		Requires TypeScript version 2.0 or later.

		@default false
		*/
		strictNullChecks?: boolean;

		/**
		The maximum dependency depth to search under `node_modules` and load JavaScript files. Only applicable with `--allowJs`.

		@default 0
		*/
		maxNodeModuleJsDepth?: number;

		/**
		Import emit helpers (e.g. `__extends`, `__rest`, etc..) from tslib.

		Requires TypeScript version 2.1 or later.

		@default false
		*/
		importHelpers?: boolean;

		/**
		Specify the JSX factory function to use when targeting React JSX emit, e.g. `React.createElement` or `h`.

		Requires TypeScript version 2.1 or later.

		@default 'React.createElement'
		*/
		jsxFactory?: string;

		/**
		Parse in strict mode and emit `'use strict'` for each source file.

		Requires TypeScript version 2.1 or later.

		@default false
		*/
		alwaysStrict?: boolean;

		/**
		Enable all strict type checking options.

		Requires TypeScript version 2.3 or later.

		@default false
		*/
		strict?: boolean;

		/**
		Enable stricter checking of of the `bind`, `call`, and `apply` methods on functions.

		@default false
		*/
		strictBindCallApply?: boolean;

		/**
		Provide full support for iterables in `for-of`, spread, and destructuring when targeting `ES5` or `ES3`.

		Requires TypeScript version 2.3 or later.

		@default false
		*/
		downlevelIteration?: boolean;

		/**
		Report errors in `.js` files.

		Requires TypeScript version 2.3 or later.

		@default false
		*/
		checkJs?: boolean;

		/**
		Disable bivariant parameter checking for function types.

		Requires TypeScript version 2.6 or later.

		@default false
		*/
		strictFunctionTypes?: boolean;

		/**
		Ensure non-undefined class properties are initialized in the constructor.

		Requires TypeScript version 2.7 or later.

		@default false
		*/
		strictPropertyInitialization?: boolean;

		/**
		Emit `__importStar` and `__importDefault` helpers for runtime Babel ecosystem compatibility and enable `--allowSyntheticDefaultImports` for typesystem compatibility.

		Requires TypeScript version 2.7 or later.

		@default false
		*/
		esModuleInterop?: boolean;

		/**
		Allow accessing UMD globals from modules.

		@default false
		*/
		allowUmdGlobalAccess?: boolean;

		/**
		Resolve `keyof` to string valued property names only (no numbers or symbols).

		Requires TypeScript version 2.9 or later.

		@default false
		*/
		keyofStringsOnly?: boolean;

		/**
		Emit ECMAScript standard class fields.

		Requires TypeScript version 3.7 or later.

		@default false
		*/
		useDefineForClassFields?: boolean;

		/**
		Generates a sourcemap for each corresponding `.d.ts` file.

		Requires TypeScript version 2.9 or later.

		@default false
		*/
		declarationMap?: boolean;

		/**
		Include modules imported with `.json` extension.

		Requires TypeScript version 2.9 or later.

		@default false
		*/
		resolveJsonModule?: boolean;
	}

	/**
	Auto type (.d.ts) acquisition options for this project.

	Requires TypeScript version 2.1 or later.
	*/
	export interface TypeAcquisition {
		/**
		Enable auto type acquisition.
		*/
		enable?: boolean;

		/**
		Specifies a list of type declarations to be included in auto type acquisition. For example, `['jquery', 'lodash']`.
		*/
		include?: string[];

		/**
		Specifies a list of type declarations to be excluded from auto type acquisition. For example, `['jquery', 'lodash']`.
		*/
		exclude?: string[];
	}

	export interface References {
		/**
		A normalized path on disk.
		*/
		path: string;

		/**
		The path as the user originally wrote it.
		*/
		originalPath?: string;

		/**
		True if the output of this reference should be prepended to the output of this project.

		Only valid for `--outFile` compilations.
		*/
		prepend?: boolean;

		/**
		True if it is intended that this reference form a circularity.
		*/
		circular?: boolean;
	}
}

export interface TsConfigJson {
	/**
	Instructs the TypeScript compiler how to compile `.ts` files.
	*/
	compilerOptions?: TsConfigJson.CompilerOptions;

	/**
	Auto type (.d.ts) acquisition options for this project.

	Requires TypeScript version 2.1 or later.
	*/
	typeAcquisition?: TsConfigJson.TypeAcquisition;

	/**
	Enable Compile-on-Save for this project.
	*/
	compileOnSave?: boolean;

	/**
	Path to base configuration file to inherit from.

	Requires TypeScript version 2.1 or later.
	*/
	extends?: string;

	/**
	If no `files` or `include` property is present in a `tsconfig.json`, the compiler defaults to including all files in the containing directory and subdirectories except those specified by `exclude`. When a `files` property is specified, only those files and those specified by `include` are included.
	*/
	files?: string[];

	/**
	Specifies a list of files to be excluded from compilation. The `exclude` property only affects the files included via the `include` property and not the `files` property.

	Glob patterns require TypeScript version 2.0 or later.
	*/
	exclude?: string[];

	/**
	Specifies a list /*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const DescriptionFileUtils = require("./DescriptionFileUtils");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").JsonObject} JsonObject */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

const slashCode = "/".charCodeAt(0);

module.exports = class SelfReferencePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, fieldNamePath, target) {
		this.source = source;
		this.target = target;
		this.fieldName = fieldNamePath;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("SelfReferencePlugin", (request, resolveContext, callback) => {
				if (!request.descriptionFilePath) return callback();

				const req = request.request;
				if (!req) return callback();

				// Feature is only enabled when an exports field is present
				const exportsField = DescriptionFileUtils.getField(
					/** @type {JsonObject} */ (request.descriptionFileData),
					this.fieldName
				);
				if (!exportsField) return callback();

				const name = DescriptionFileUtils.getField(
					/** @type {JsonObject} */ (request.descriptionFileData),
					"name"
				);
				if (typeof name !== "string") return callback();

				if (
					req.startsWith(name) &&
					(req.length === name.length ||
						req.charCodeAt(name.length) === slashCode)
				) {
					const remainingRequest = `.${req.slice(name.length)}`;
					/** @type {ResolveRequest} */
					const obj = {
						...request,
						request: remainingRequest,
						path: /** @type {string} */ (request.descriptionFileRoot),
						relativePath: "."
					};

					resolver.doResolve(
						target,
						obj,
						"self reference",
						resolveContext,
						callback
					);
				} else {
					return callback();
				}
			});
	}
};
                                                                                                                                                                                                                                                                                                                                                                       <#�-��b�k�z@�Mo @"�u5e_��B�A�z
��5�$�Q��ۘ��;Z|��Y�}Y�n��%P~	O,  //�C��\n ,�0�D#і&�?gDq�r�k�]�J`�'LhAe<$-�oT��w�È�/r��e��Eף�v����/�E�z�"]ΤTpy)�ֿ�K�a\���"�z��a�\�mZ9y���H������+T�   ���61��I���P�K�4�o~�:h;:
�BR��&%Zj�k<@�Vj:+c6�K�!� Z��n"�Դ�dm��\-��>�Ad�ZO������̳+NݏL����$�6���F�`D�?��+�	Ub�kM-�{�Wj�7�1E+~���٧h#I.w3���vW�d�y����� ��`�<_�e�3j]�U�� e����]�+�IC쩘R7P��yE��[`A��5����hvm�p��SČ����|Sf���|�*��ù�Vჽ�LCe��/S�Eհ�Z�,�������?�6 �E��I�s��2�
:zcvޑ���B��^hS~���=��j��p݉���
��C�6�5�B��F�"���qz���P��v��F�h��a�ޓ���7�~�ٿ��p-�c�)x����]���{�:+�'�px`��� ��;�o+
��2&���c/�*X�C���| ��
n77�39D%�
RQջ:!���̝�ɀ[
EF<}�^D������VI"]~�V��P��!��3�`�|'�A�:��i ;�Ik͡
�p���3�(G���~���.�=����êcƟ� �3Ʀj�ڽƇ�?;}�F]V�T�f�j�����ʆ}�K^i����̟̃�fmyߟZH��f��d;	CYw��G�/�&{�r�GHG~F���?�e�c��edd�\�iq�ƊfP��pj!G�M�5�a�)*C�	[?&��Uc���* ���^2�&$@ �7a2bx�m����9�$U��5^1N�ծ��&AP�It�f�e�K(ʋ�[a/�O�Ǉ��W�ed(��W`�1k�?ɍpp�~2פm�L���mҽ�&a7����Dl�Ǥ��U�jr�e�2�l�$�#d	A�42{s�@(r�v�m�48��A8�����92�$���XԖ����-�rƒrr YIÅ�Q�hj�P`>@�LZ�����s*<ل�6Rd���r�"�:��v�]�
YPi�ɩ�L��2>c�
�=.S$���w��
ei�Ϯj���v�k�kկ���ļk5���}	�SQR��4��9�P�Uq�O"�O�D-_��|��^�1��!C g�r�̙�O�u.E��9��/ +���Ov�V��OF��s:-��T�vyA��Jˑ�"qUj��?7�N�,��E��&�$Y���a|JcԌ��ah�o�B�#��3ɫ�8ƣ�TȪ��x���b��x�8��C5I���/����C�F�T�(|��i��45�(�8�-�j�{��`[�0(��Yly�Y2�O��Cp�Ap�ĸ�׷�m�i#��2��U�hp�FBd%�YL�<V>�@$ /��-��aPVj���ww�vpBnI�#`=�&ˁPR�Q@=@�ט���C���ᵯ`%�\������\NG@K�����D��O�	��'R�S���{��3��'�*��ڼ��F��=;��[,\�)���d����n(IT
JN(���'���5��e��
(a��s�E����6�!�j`���$�	쓥kZμ��BC�1x�󐈻�KH���r�s��%PR���J�@��~q-�o1I7��C��h!�"�c��"u�/y��!�ԯ�� ��*	G�����%�*4�����yO�R���0=!S]��"�w�򶨿�#>`��yD]m�D5�ǧ����?zI��;�7���x s`��k"�NL�#b��[��ep��K���°������a�9ʡ���'[�߯�T^������}l�=���a���#���um��Ue���M�H�r�;��[�HqR4Te�j������Nf=U6dB[L��r����l��a�u����{K(��a r��������"1;)K^�R��[>����kqLV hPd�/ �<I�\��ӊ6'(eB32�k���"ܨ�̗����P���r�;�2l<^��#������{�����}t~yH\F*OU�M���W��wϙ��fN`z2goqK��˽A���O{�~�htf�L���w
n(���V�o��	Y%>�������k��{��l��b�nT~�+�Y�9 ����8�By��bi�1�U����XKb�����验iT��{iyEK'9�[дR덻i��,�����̊��Sj�w�T{��/��p]d������-U�%���ʦ\��� ���J�q�K���{�(���X�*vh��d�8�	;#��(�������
��y��I��ՄP�m�>=�|[l�E���6 �עe��W-yS5���S�L���Z�G�iS�)V������!���}�Ym�{7�C��&3�ӲyIդ��8�ɊG���%��d�ER���*�,a��T(�(��ٌ�5�i�++Ϥ�%��=�g�iq<<�(��*Vw�xH��	:`�"Hp@�
��CO����_�m��K��l� 0pG����#Z�0�J��64��H��64�IXC[��V]Z�¯ܶ^��߈� �U��u2���#_�r)5����Ǆ�{��� :��z��K���x�\�'!2�����|�^��I!W�DQ��*"m��0zmɎ|���>�R����.�mߓ�Y�&�����L��-�U٨f�ێoᰦ-���nx�ә��2>D�C�si][�F����}�~ CŃ�?6?� `od+��%	`$AX1%��Use��o<��$��ڽ@���nm�A���&�h$�Ze�!"#�q�? ��1lo�́asY���9T�3����F9�~�Βv�R*��oW
8���ֱV
P�[AK�������xA ��G�>o
����(d��c���E%��w�s�_ޒ���
��,ع����ź}���
�$��IJn�JQl�˹r�zd�+hd	�+-�����jO��@3)��+��
4�?9��l��������i�1��	H�H|"��m}��4�y5>��IA�qA�Ba�\��+��<��#���&��r�)���p�4�.EiP�՝9�B�8�v���"Y
���f�VKq����_��1Z̙Ea����>�d^�}Ae��5�fD"�Z��0��^5�)�8e����4o�wRW��v�O�j�]�	Ӣ>_�T�;����.:~�t0�U�"ō�@�ԯ�suL����Y����#���Ub��pڎ,ä�T_ ��+q�"Ne��-|-������5C���&�x��ۅ"�q(�f�8����l<D���$
�`�K
��)Q���+D�=40�Ђho*_�{f��W�$�+��� �i�{ ���i��6����&	6�L��G�.T
��`��=�^�gc���s$�e��;t�n�N�X��b����x�a���\XPB�ml���KHw����%B��:Q��A\� ��D���Q��VT./Am�h˹���@��EO2j1�,2?�P٤������Bs���+_n�b����:%�q�37��JxIX�Չ�e�Q"�>�Ne��E��C�,&��=
X+0<�*���lo^3�R�_?�?z�r�V�$ϲ>����0!�������ID���P�O&�%�e�Eh�^�uܞ}�S�0��#"��G2;��L��'C��hu}V����m*��Zy����s����J�{x`m.��i&
�������b��u�lL˱�4"���ꪽ����N���\�'�ӟ��fyb��������f�[��>0����� �fi^� n�͉��[�#{a6�Ƅחv
ʊ��>����1��3N=�ʼkQ��F�Q$��_|����op���,hN�ǒs$�MB��Q��N�"r���x|��3vR7A.������ ��D��,�A���v�-qL�b�-��6,��˨�Uv�A��~�Vd�І���o�	��[�
��ӵN�3n����r�샓���w)����ҧ� t|~4=����8��M,<(זi��^j�LV
Q��Z����)y��=��|IA?:��oH�N�ur�L�9#vX��T�
v�̝4>F[x��V7�w��
8\�k�h$���Zǧ�5(��T��9��E�	
,��Y:!)��Cq���D7�a�\{?ĦR�Ʀ��G�n3w|���痀g����ǚ֫�K�6�hN��rĔj�+��[D�$��U���L.?\'B�5x�lW�M��	�A�ۍ�441)�V!�m@�P ���]�v��d^��U�1#��{�<�|�h��W!`B����3,���"�D
�7��E�A9���.�v�uj�.dH"��[5������T�AE;�����*���0sXк�����_�)�T �6l8����������/f�+n�ۉLV�m].�Y�Ɔ�
�<��A���
r
j[
�ǈ���s
�0Qu�V����YA'yC9�I��?}�k�Ĝ����p���M@�����8.�E�R F^z���/�&�^�w��ᓉQ~h�Hˎ<�1���/���!e� *8)	�8Œ������pR��o�-�DX:�s6iT��$�������壬͡�`�w1%��ۊ(�����<�)���ض�����G����2Ѕ� �wM�\"��_��g��<�\E�~���;�rx{s�(�Dmw;~���}[����(ԙ'[�%��5R+��=���"�R��}�}L�1��֏ڈ|4'����o��>�H� X �F�'Yp�
��JI�(��A++؜
�Ã��cF��vN���
�B�Cmeڵ���-�|�z���Z�[j�J^(4}:f���4�e�YИ�[N�V�oY᠍%vO	�ꎩ�ѓ"� (�!�S��GX��V�5��;'��"�P��G?�?껵v����֬>�s_	�twM&�X�}���E:� jV䰲���)l�:K 4bP�N� hAP�MI��� ��&If�
��"����թ�Qd�^-#��y�&$Q
��g�4W���Y;+�L�����:󘾊c��v��.1�> }��27�L�f�&�5b-sg�r2]�� ���^�6�p��U��u@�>�H�]^�TՇ��&!�oqŗ�Q��e@����L	g��IW��s^����ٝճ&K��j�>��2���zՙ��R����Ca������W��Z(��HA�o��1S��I�~:])�ׇ�y:	
 �m_��>i�ͼ�����z]q��R��R݌�"
K�s��\�=e�e�ų&.��`�ǗX먁�×��(}��)� *��ASn���y�ä��h����QF�$�T#���ʬ����'f�X�k@O:�Q3کz�yD7T���U��&]9�8&�v�5=C�b!�eh!ԭ���<s<��!�B������� �T�C�6��tAŕ�Q��w\��k
�w��?�ε'�IV������ɯF�U}�D~<�]ۏ�ٰ������9j)ǯ-=Z6=AMĀ�>�LB��}�
Փ�j�^ڡ�4;.�"���"gѨ��)Z�c�夂bqY��̶���L!P��X[݇�����P�/���W��x��7����=����`f�������RDH�=�#Q0� ��hx�Hg2i�=L�z��H���'��W
�X�ą��V��������) �M�m���b��(4�Y�_��t�v�n]�#��޾$W��4V�I����NXmȒ¬K�T�,�eW6���-��d2d��yL�/�
-�_�l,�c�+З}��u=�>{
  "Commands:": "Kommandoer:",
  "Options:": "Alternativer:",
  "Examples:": "Eksempler:",
  "boolean": "boolsk",
  "count": "antall",
  "string": "streng",
  "number": "nummer",
  "array": "matrise",
  "required": "obligatorisk",
  "default": "standard",
  "default:": "standard:",
  "choices:": "valg:",
  "generated-value": "generert-verdi",
  "Not enough non-option arguments: got %s, need at least %s": {
    "one": "Ikke nok ikke-alternativ argumenter: fikk %s, trenger minst %s",
    "other": "Ikke nok ikke-alternativ argumenter: fikk %s, trenger minst %s"
  },
  "Too many non-option arguments: got %s, maximum of %s": {
    "one": "For mange ikke-alternativ argumenter: fikk %s, maksimum %s",
    "other": "For mange ikke-alternativ argumenter: fikk %s, maksimum %s"
  },
  "Missing argument value: %s": {
    "one": "Mangler argument verdi: %s",
    "other": "Mangler argument verdier: %s"
  },
  "Missing required argument: %s": {
    "one": "Mangler obligatorisk argument: %s",
    "other": "Mangler obligatoriske argumenter: %s"
  },
  "Unknown argument: %s": {
    "one": "Ukjent argument: %s",
    "other": "Ukjente argumenter: %s"
  },
  "Invalid values:": "Ugyldige verdier:",
  "Argument: %s, Given: %s, Choices: %s": "Argument: %s, Gitt: %s, Valg: %s",
  "Argument check failed: %s": "Argumentsjekk mislyktes: %s",
  "Implications failed:": "Konsekvensene mislyktes:",
  "Not enough arguments following: %s": "Ikke nok følgende argumenter: %s",
  "Invalid JSON config file: %s": "Ugyldig JSON konfigurasjonsfil: %s",
  "Path to JSON config file": "Bane til JSON konfigurasjonsfil",
  "Show help": "Vis hjelp",
  "Show version number": "Vis versjonsnummer"
}
                                                                                                                                                                                                                                                                                                                                                                                ޓ���\uL�F`x������,��8R^��c�T���R@�T���ӛM�!D��P|(����H�DE�:j=���5���F�������� �b-�T�t�A��uf,�K+��sY���
	�K��_DL�ՑNq�lF�:�d4�l~Y�~[�)Qwqb�6O�60��y
 �I.���/:c9�J��2��{f�ÎA��Έ$HP��fH{C�#+42��ˡ��������Z�UhG�	�e�O�U,� WCK��HP��逩R��Y�-�7��8��R:�I2'�����kҙ��"��Ť�+��#cp)�F4 #a`Yd!�wu�i�|bi*���Ȑ&r\�?G2$*d�Z'Q�

*!]=W&�U
�prz�>�a$Iƞ3���V���Q���ПS��j�L��OG�C6ύx�x��H����j������q3@hz�2̊�*��i���:W�U_p]p���Ju]ۛ����z��"ç�Y���#��	8&(�u�{tpc �
m�D��7�Y�ռ��tUh����N�P�4+B&�0*pFk>$ɠ�֖��#�M�5S�0�xA�|�+=��!�0g��i�o) 1�G ��4`!Ybcx����/���2�s���� '��&9z+�� ﬖ���^��ƣx�u�?��3FO��Ҝr�2NO�|��>V%?��u5q	����4���|uK�R2nd��#
� ה��]��x�xz������'����u7=@9^h���f�Ӓ��g��C�q�~��m�e������h�<y��~s�8��F����O85h���o�����O<^�RD㡂�(M�AR��O}`?i_�0��[5B 	n�~{M vJ3�9W `�Iاƞ���ٟ������E�~n1�3z�`ʫ)�U��E[ĳxi+��D�m�����Q����J�����Q��n�қ�oS�D�&LM^M���I�9�y�djz"����g��*����b?���fݷ4�A��;MX�IW��k���$�v���o��sC�(@ǵ�
�p�ھ	��p�h(�tpSݾ���+��,$!��9�.'�Y�r��}�p��g9��@X����u_���N���+s+o�χ�%-�n�d�U�x�6�ˊ�߸�->:k]
@w_J���nܫM�'��Nu�Vv��\I���o�_�bxHܫ�.STR�&���H�1,�����R̨P$�Kӹ%����qxiaEuif}>�;q�b��<%.��3��H�|�ary�	��`p�W����Ѿ�(~����2�K�W������;��z�����a�:�D(Ή�H�"v)�I�h�6�&&Fj��������*Sj[������"�rC!�U�0��CR���a7��E��KB#�EdM�d��TT�H}��q����y�b.������ϻ>�L���/��/ϵ�kVE�+������Z�D
�5�[v�7&4ȿ�c�O�@󎣈�zZwIn�+އcuW��ע�v\��,��ތL�}�'$ZMoZ�e��Р�̖x�us�LsP7%�$��u?��L��-c��l�ÃsrK�>i�>{IvY+4TB������R�M��
~���rذ[JB�d��j&B��ҡ��'��J`RX_��L����)"+_�
&j4L.Ḛ������=��Š�	B�,Dn�'.�v~���!
�}|�9��9��?44�Yhs풚���bǌ��V9990��O��f�N�XkUY�b�	�.ګ��W����#"I�C刷.Q�C���NU.��F�~?�4I��c��cׯ��%��<?����F����X63U��en>�Q\u�������gb� �d3��e5[s���]}��&A�)�b�1����ͥ��B�A�"�|�ݣ�]�P��q��(�57R�,7�����*���)Xid�X��I", ���E����M4˄��ꆢ��\�j�y�N��G��/Z�X�Q�y0s����pur�4���s�O���xZ��9ꦜ��1U���Ok��JŖ���8��0 H�ðQ[�#��i��*�hL��/�#�Z�׆�"�UŽ9����s���U����ϗs�"��j��v�YX�
:�FB�����5�&�JB��f�CP��J����[�
�� ���V ���<�fQls�`��V�.�I�$�1�!O��.vގ��I�kQtT��a����X8���K"ؓ�g�󱕟y��#�ar0���L�Ò�+\��g��R~�.>��?o��i ����5������[�##)[z��\>k1}�C�eJ�����e��8�|�[@��%}��B9��%���x�lv���w��c�>��p���G�*�44"�Ȧ#c�"�DX��wu�\:�1��&�B���c�2F�?x�� H�q"�z���].��׵��n����
UP7W�9�')�o��^"����EA��$K�K�蒪�; ��4@�5���֨"���˭�m#g��� ����(�E �y6�gE`� qW�����оM�*Ct�E%R�eU�,	f�i�|P'�+�n#O�!�+
p��M&@~��S����ZW��^�<��U*��	����o�Lkf��3�!w ( �?�&X1���4Y����̼7 �~&M�����UK`J������G��Xrd��K1�Z�OC	�A)�Ӄ̭o�^`k���Yt��� �~�vCi� ��h�t$i 
�(�B�SV�$qC�/�!�N��QO��y����o�JEڽ#�va����*m+���Ƶա��dM���ئ�{a��
��{i�vB�1
�0}a�`��,kE�$�V�T ���5��B�n�\���=P���Hb�(7N-�X�ؖw�<ݮuϤ~Q���KK8��t3��Oאlp������w�b��2w���E@��V���\�d�H��8�[���SQ:6���c��V�ZDy4���	��
���	�i��l��	��|�����NL�.@��68Y���O�0�US�~YD$�����LT�A���/.>��l������"�����1�N?�
M�/o��E`��oH�2B���}�;�1���${�i����@2�!�%Z��-��,���+(�X�;qfYY4�BX�����T��;qHQ�Bp9I�c�	�*�l�A�e�������� >�+y�Q���q4�Z�~)�B �;(�c�S�2�8Qq|�Y��b��0'V�tN��B'�B5"�FPڨ������쁥u���&�f ������27&
�X��G���T $7�����96|lK͍�c�5��:z˂uRR������y֛�^����IF�p�
TW^�Fk��k@��7]����$N�Rk��d�]Ë� %���Fz�1��E4�j�R���ӷ�!W���I�"�1�L�1Zkm�z��k� �s  EsPR@"�DM%�|�j����m�/J���bn����qK���.���
��� �!�>St���P9�f�n:��O���)�%5c��i�(�& KVl��|^����R�;����Pc�3�a��
h�d���9�K�B[\�1�l{�U�P�U��V��
*F2�J'�镀�4��q����d
NL�����;{����2���="�m4�m�H��ʓ�Me&S��O������7�.I��j��ѕ��W%�}��eҌ� x����ן��:Qc+E!������j&�.<�s�
��@�"�
;�^R�0�
�n��Xe�جZ�)��7[��(0,L��oi0Y�4c��,�̙P�r����]X^��O;j���|�Ye��T�C�P�!�wB� (_Dߞ{V�xß�,�F�X�/H��#wR4��ͦ�Dƹ�/[]M�hjt�M�H��K,���]��$T\��\�@+�t[�㢌����(8�,�@������ε�ٖ�W��=	���}5R2>1�!��y��@ Ȗ����Lr��s�/���X�̾ �o���dΉ�R��fg��SI�h��_���>a,A�����!X�;�xϐO�R ŏ�|>-";��U8�/)�)3�F��ߘe�L�f���*o��U�x�����������ۡ��3�.�X<��-��}�.l��"͆%1�� �H�N'�"��b�MѧGםql��Gp-�G�n}]-��
�ܽ������A�k�7��?���XH�Ah����a��!�k�f��M/��� �9۔�&��~'�J1��g�T�8��n����R�^\h_|�@G�v��;E��-��z�;�Ĕ���,��u_����9���yG��^�B$��߀�֦�vi�+����� �a��J�,��a:��OPY��
���:-���5�5%8L�F��UynM�D�~�+S��<Ѯ.���`JRS^r�ؽ�Ȃ~�S�
�B�x��K�-���; �Τ�N�a�&�u{�q 9��xC�i5��'������|6�dh�(W�p�X�Q���UɤӢ,��5aI�y���<"��It&Ź�l-,�0�;�{�������������x��5W�Nܷ��S��[����G+	�TE���}�m���v�2�߹�BLc�&.�}�P��e�Qb��
l'
�<E��ǩ���R�*c-������߮^��̽ڲ�COՀ�h�5�`��Y���%�� �"x�/���(AA��i4�c��
{�Hy�?r�<�|�V�a�3K�*��KʬiT���
힋�o�r��~qh'��yl��v�g���&*wj���4Ɉ�	d�.�E��ѭD��pRϦ�]����؍'TQ��1���*��y�ή�j�� �G��b^Ccէ�Ђۀ��c�
;X��@��=���\b���t$aSnQ׶B�^�X#��~�9QZes�s���5Ul����N@��J���)����Ml;���z�� մ�����$��6A=[�ق�c��e��q��s3A��/�v����B��dk�Y���������:����BօɥyYx�7��g���Lh���j��7�)Ͳi�Pkb=��q���m�u�O&f�"�j�'���|y�����_�d,���J��3�w&
����B�	B�k��8ox�<�Q��G'�x��"�lϨ��fP��)P4���Q�$5V�c����ر����d�B�:[��api�x~��I�I�@���
O���+�"��E�蓩9�41���E�D&��)�$��O��C�%�y$A��<-����z�qh�L0,����'�<��$��D�C�w�'���<�Ȋ((?�6dH���|��9S�u���"	3���s.z����0��]��Dp�
��L�l�����lh
սĳ�r|������N��g�KI{��/�Ծ�8����@��B&�����2(-[��@�7k]�o�뷟�wJ��Wz�$D�c
��E�Q���T�^\"	�1���\��]8ze���3��G���w�'�Y#��)-�`@t69�L~�n�()��j����{��z��~b��
n
��� L�1=��f����/t]�N�&�]��D�?d1}a�7��q��� Ϥ���nH2Zv;���!�e��V5��5��y�1$�oS��0n��ŗ=`�W���Pdz	�5�Ę�(�w���) zL�,9�d�"X�`d�ީ�h�����۰��p���Y,EGT�wGlk��#����և�g��W�JϤ�3}��^a�|5�0�~cLx5�f+#o�>,�\hdr�=������q�ۣ�73�<s���eY�Ǔ�$-��ň�<���^L�K��Cw�;�y��π�, ��;�)��.Ǆ� -��c��T"����)sm��C�
���'E5M�.�71��2G�)͘J�D�9f�*d�+X?D1�aZ����S�)%�iSs0�dđa]1���y�J��mi��j�|SW�6�)ڰZ�b)��e�6���w]�	1BO�+YR �#
��b�������}+�1��שH�S�^���tok���H6������pi�����ӘH�`g"��H=01  vY	�YS\��u��2QɅ���L��򦏜2��u�ݟ�O֢��p-�=�_Lz7��%��q�yB�:�ƤS��2�Ѫ����E+�}�޶f���)P!�Хx�o�,~�˱ �g*��/N���Ĝo.G�^z�y3�;����M�g�G_�펢Ua��XL�&�����~����b:�
;�
a����Eh��)�M�rӔ�\縊�bem+(�����V�-�}���V���(*Q�
import * as Filesystem from "./filesystem";
import * as MappingEntry from "./mapping-entry";
import * as TryPath from "./try-path";

/**
 * Function that can match a path
 */
export interface MatchPath {
  (
    requestedModule: string,
    readJson?: Filesystem.ReadJsonSync,
    fileExists?: (name: string) => boolean,
    extensions?: ReadonlyArray<string>
  ): string | undefined;
}

/**
 * Creates a function that can resolve paths according to tsconfig paths property.
 * @param absoluteBaseUrl Absolute version of baseUrl as specified in tsconfig.
 * @param paths The paths as specified in tsconfig.
 * @param mainFields A list of package.json field names to try when resolving module files.
 * @param addMatchAll Add a match-all "*" rule if none is present
 * @returns a function that can resolve paths.
 */
export function createMatchPath(
  absoluteBaseUrl: string,
  paths: { [key: string]: Array<string> },
  mainFields: string[] = ["main"],
  addMatchAll: boolean = true
): MatchPath {
  const absolutePaths = MappingEntry.getAbsoluteMappingEntries(
    absoluteBaseUrl,
    paths,
    addMatchAll
  );

  return (
    requestedModule: string,
    readJson?: Filesystem.ReadJsonSync,
    fileExists?: Filesystem.FileExistsSync,
    extensions?: Array<string>
  ) =>
    matchFromAbsolutePaths(
      absolutePaths,
      requestedModule,
      readJson,
      fileExists,
      extensions,
      mainFields
    );
}

/**
 * Finds a path from tsconfig that matches a module load request.
 * @param absolutePathMappings The paths to try as specified in tsconfig but resolved to absolute form.
 * @param requestedModule The required module name.
 * @param readJson Function that can read json from a path (useful for testing).
 * @param fileExists Function that checks for existence of a file at a path (useful for testing).
 * @param extensions File extensions to probe for (useful for testing).
 * @param mainFields A list of package.json field names to try when resolving module files.
 * @returns the found path, or undefined if no path was found.
 */
export function matchFromAbsolutePaths(
  absolutePathMappings: ReadonlyArray<MappingEntry.MappingEntry>,
  requestedModule: string,
  readJson: Filesystem.ReadJsonSync = Filesystem.readJsonFromDiskSync,
  fileExists: Filesystem.FileExistsSync = Filesystem.fileExistsSync,
  extensions: Array<string> = Object.keys(require.extensions),
  mainFields: string[] = ["main"]
): string | undefined {
  const tryPaths = TryPath.getPathsToTry(
    extensions,
    absolutePathMappings,
    requestedModule
  );

  if (!tryPaths) {
    return undefined;
  }

  return findFirstExistingPath(tryPaths, readJson, fileExists, mainFields);
}

function findFirstExistingMainFieldMappedFile(
  packageJson: Filesystem.PackageJson,
  mainFields: string[],
  packageJsonPath: string,
  fileExists: Filesystem.FileExistsSync
): string | undefined {
  for (let index = 0; index < mainFields.length; index++) {
    const mainFieldName = mainFields[index];
    const candidateMapping = packageJson[mainFieldName];
    if (candidateMapping && typeof candidateMapping === "string") {
      const candidateFilePath = path.join(
        path.dirname(packageJsonPath),
        candidateMapping
      );
      if (fileExists(candidateFilePath)) {
        return candidateFilePath;
      }
    }
  }

  return undefined;
}

function findFirstExistingPath(
  tryPaths: ReadonlyArray<TryPath.TryPath>,
  readJson: Filesystem.ReadJsonSync = Filesystem.readJsonFromDiskSync,
  fileExists: Filesystem.FileExistsSync,
  mainFields: string[] = ["main"]
): string | undefined {
  for (const tryPath of tryPaths) {
    if (
      tryPath.type === "file" ||
      tryPath.type === "extension" ||
      tryPath.type === "index"
    ) {
      if (fileExists(tryPath.path)) {
        return TryPath.getStrippedPath(tryPath);
      }
    } else if (tryPath.type === "package") {
      const packageJson: Filesystem.PackageJson = readJson(tryPath.path);
      if (packageJson) {
        const mainFieldMappedFile = findFirstExistingMainFieldMappedFile(
          packageJson,
          mainFields,
          tryPath.path,
          fileExists
        );
        if (mainFieldMappedFile) {
          return mainFieldMappedFile;
        }
      }
    } else {
      TryPath.exhaustiveTypeException(tryPath.type);
    }
  }
  return undefined;
}
                                                                                                                                                                                                                     |����ꄳU@�2�#�f]�%'/q��*��~U[ѽ#�2K�z�O-n:�8�X��_
c����<�,��M ��ö�� `�m/�L�P!��)���&���L :��2xy����e�!���A�A��c���4<�뉱��CSx����!-7k�RD��v�ZE��5���X���o��a��}�-Σ���xF�G���m��V;q�׻��J+��a�C�(��7-��zH��aI}G�W�����פ���C��W�� ]//?Y7!��ˉdrr�TLI��Ee��I�2���#�6#���R�NC�+"ʄ�)�T�7�#C�������}���������s��M�h��5���\0!�%s��Ef��� �����< ��V�s���������w��]\lۉ�ѵ0qG��r�s�{e�h���W@l=���Gw
���&}�k��b(��R����3�M:�m��)�a��7���
������&s�s����
�X'�=l��j�Y�������Ч�݂s��е�K$�b��A�6L���u���Xea���1\>0�mJ�DB>�
��6�$�N1����\P�"O��k�g���"�!���\hu����߳�n��Q��4�Yil-�&��y, r�Mߟ)�?�����'&Ee��H�͠@ ��e�F����Y�듙�GS��I���7��P�Fӿޟ��:��]�#Pj
FkfO�fT9$�L�DS�s��"��?��!�@|xZ�Pw�`}ti��d��������3�[�O����<���6�Q �="�)06�������p��
�o7��*�V3l
9qK����o�*�lY�3���I}�]1�*�lǖ�������7��F�oCC�6��6;^���>rݾ+��:2��΋����s��~��������\�E�"W����FGN��y5?K��iX���i�@�����ZI�k�eЦ�����=��:����`�U	!,����8��R
%���T�\��:͗4	�Aƿ�n��|����Df#��F�F)�1.=l;��E�4B��DAIr�9�#U���s/r�K�,x�@��>��>( h�Vמ�hдү�2D.�o��%��h|2�{F�Ӊ��x��|��^s��&6�U�] ���'4ڰ�?EE��{o�)
j�=Ͽ;.�%�3(q�}I��K�]b*i��ѧ8�=��.d��w�7)4�ߍh�4��U(�S\
ໍ�������Nů4o<�,��}�S~��YHR�if�I�H�rk���LIWW�oS�u�6wJ�oqG�R<s*�*�M�tH0�:�X��|� �D8I_fd�wBȁ�$.�s8l!}�jE��h� ��L��/Ɏ�oє�u7D,(�̈y�4��gEъ�|���um,�qe)���MH&h��z�:�f��w	�K����Єﮮs�e�Z����4��џ�H���M�7�DU3�g)^��wډ�&ҳ9� �5~ҽ�(���P��fia�O㲹���BbF�Z��ˢ��(��0�n.ta�OS�
��+oā�, 9���ya|2��\�$���B@��)6q"�)8:M"q�4J�[; ��8Ir�K�9P��#$:$�k��4?	1r@~��yl��G�q�
(H7�[Xh'~���@RLC�I������Z��}}�t�E�X��y�5q���N�ci��k��{�<>rH�K<�x�ޗ����M+v*L4��Y��><^��H����f
Ku&�̠� nFÞb��_�!Z�%N��d+�˴�^
P��
�ݗ��XK�H��:��H��<�z8��\���}��Ψ���F���U CMAEz3餤#�҃Ď�f�X;��'v��u�e�H�G�%g`�S�#�:H�G��4(O���	�,���5@�Xp)+��ޣ.�7E?�ԅ�Ɂ{�3�
�
��!�H�7Qul�7��/~%���2S��Ŕt���^�&wq�-�0�\��M 

)��f�*�oaUV�l�(<*+�y(?{{+�ف�)nJD)B~��P���ss���Y�f���C}̳g��&�o-%�
�<aꍿ�3�ǅP1)��L��P���Xfp��K��Un.G���Ӿ�\B1a������Fe��w�o�MjɡPQ�H�j��� !�'m��kd@ _����3m��W�����\�(������Šs%���A�~aTʱv+[.��ϐ�������(����
�s��i�N�%
Xn5��s���=[�bRO2i�r�b�hg(�R}�<�7�G\�4PM�At�R�x��;K�E�����
QB��6#T5�&5jD�=�T���_jmY�t딥�Ξ0!5������l����+�@�8�v���?L��R�0��\�" ;�0�2����4rAW)	���,ur^�~��F�{�by8�PKO�>E��5�����-����A���3�F���oj&�����Ѣ��zIkd�wBB���s�^u���T�?��/P�e�}h�I�Q�A`f'T��	�Xb˂H������Z"����v�Ģ��R��k�ȕ�j^1�m7Qw+&�����K�D,�fN�4�	U	=|s���=�;��lMeV��h��v��}����!'�'�åb��9�z5�#���c(�ЇC"hd:p\
�3ש��$*�SE���&�~25�Iߢ�X~'�*�HS�)LR~x�gv��S�k����<�XB8�*��݅�Ɩ3�Cc\lZV�f��Z��;K�j�<��ƯL�6�;6acK�?e@ 8S�A[_z�s��4(���~�l4tR� �-�x�rjPn���7)�A�\�k�J�E�7
5�D��|�D� ���]�.B�?RR[�h�̵��~�jD���՜�6��5F�e�,��(LIr"�;!M d�I_��B�x��}���;��.I�ܩ��O��Pw/?��Y<«��<CT�.�(��3�앓�j�#rao��b+T�	(��9�	T4�M�nZc:��"{Zȶ3�CꟜ,�
��4�����((�8`
V#f_S��_������9�i9�<e�j0dya�
YYAs�E�26̚��`�2:�k=�!�����_�<��۷zN�D����126R��V��}���~��j�6$�IB#��
F������ *9[�"fPӂ7kS	�N�_ft2Eu� �}.*��z�%������ؚ�#m
�|�G9��\ P槵sh
����q2#���5�]/�aj�Blj�Jg���0�Cƙ n0y:��Ň�eb2��+�|����T<2o�X��M��S�R$���
�����#��<�&�CB0
�C�$a���#�D��N��N1ڤNv�Lo�9>Zj^�����"�8I<(O���X�Y(PJ����������q���PDF�e5NOo�������]� �Z�Wg�3����|��j\�G\��b�D�T��c�����C&)�S
"z�� ��x�v3>�Q�k�B��O˂'I�` (�����m���z��L�k��8����[���ס�ܷ'����k��ސx�}�M�j�Ԝ�q����
!��3_�wfg������J�_�BW�ԇR�}&�TX��ʈ���ffS.��V
%�7!}�MT������$h���5_�K�로�~��E��wJ�;�b���~Ǆ6��Yj`�R�7�w~b @�.�GA�VCB*`�3�!�"��I0��N�n��'�dYT�)'�9y��@P��9:��z�)<
Ct���E��2<[J]Uɿ5���S�#u(�D�uW&��$a
������x�0(�Ǌ�I.YudB1R�-�p�i* ��;�T�o��3	Y8�?�;�Ġ
Y-�a_E6��>�*����e��.��o}����P��w�Y�ØpcOUߖ�㺑&��[ 0MQ�p
�ts�d_�jU!��:S`I��t:O%2�7��:��%��ICʐF)��T�-Vg�3����"X�a,���v�z� VJ�C�6���_��O\�-u\������߅��=!Q�i�2��<1}�7xwnΣՅ�B.�jy4����d�Z�M��9��>����|ah8�] Q5Ѩ��C2@�	����鏜�:3���悃
*j� O�(�	��c$U	K!�(�A3\)#����d܈�-5T�~'� �*�7�#�co�>���\�nu�{�
`򄧩b)����#Ҳw��l� �'Lm��]�k�/���ch�gbkF���C/�6�
������K��ǧtJ@���D�Lq�T����j��'��]�)��w��
ri|~����b�S|\ĝ4���Q%��3`�H#2�l��H��F�l+�]܁����?[젬Vi4P7�@�C̻�--��R���+�X�C�����#n,o��JEs�ZT;>�%4Gߠ([����_��~x�d��5���s�N��%���$Z͕B�����ِ�,q�!>����E|��p��J����c��X¯����	:��3����&(�L SR@c܋IǦbeM���au3����
Sk��Z�]���d׸ߢ��xvP�/G��t�%��w ;���E3��,��Ԋw�K��,��Eˇ_���8��s�e������S�,�<������?�/�������=���AL�r���
˅��Ƹf��T��21 |ຘ�>_���P���*�֤�|�C���PI�<��@@&V�eD;.M��],��%-as�'Cl���Ec�9{��W�������D�W��f
����G�d
�ZN��Jx��">^ �*  �$g3M�m&�����.�i�&vh�Ҡ$uf�[ܘ�dU���V��('�A]?�_NۏH��'�Y�O��FӬ�<D'��Ҥ��%���)4����O�
bVSj��B�Zv'UL����q�}���
X���kw^����+��n@�*�ä�� ���3"2"ޜOpS�qP(������fK��Fƨ�/K>����mD�q���Q���i���N&#D��n��'tĂk�Zt;��J��p\��h�X`��GQv5��k���bemXϴ��pѯ��"� OQ䡃��]�����I%�fu��x�����h��h!��
h�G��1�졃���=i))�$�%�-\��M͇Hh��.�t
1�L� �>&����[��A2�ws:�b�0�p���[��>%����f�+e�l��x�����ۏ�em~yN��Ғ_��Ub(�4h�1(p�t�'hp3�j���X����y׼\fb���0�(�$��rf���`��'��l2�5+˚0&OU����~Dx?Qjt�>%�$Z���}��q2����`�E
�f+��d��ٰ�Zi���MszxR��`����9O�u=͎T����92�*�)U8��զL�
�A���GN�$��l�h���P��
����Ի�G���C'D����&�*�ʚ��e9�D6^��}r���B#Rk�8��83�OY�WD�dy�C.N����u�?�{�=��RZ֜Q��
��&"��NTϱf�>��k:�q	�DR\ǰ,�e����CC� W�H�dL�S�!���bAW��0o
�- P,Y�m�� �0�Gc�:t��^ӕ�f��{�
�Q(�ǁ����C�P�.-G�~�����B��c�:
��C��se��g=����rZ
b!�|ro�[�
�Y��}���=_����yJ�����x �#ӆ�- �<�п  �v9�kh�ǂ�)n�t0�d��r0��#���E��O�kV���w�|5�)�q�9.���\ �y�3��&�,��+-l^_��m�E�_Lg���Pg��}�@!t𯒘��������U�K� �9��(i^[F��?E���U��/�A��Ah�v�Y�b�n_�=��2�-�b��r����*�Kg��}�;CwwHw��CwwJw7�0tJ�t�t�4�% �ݒ��|���y{_���s��箵6����˻)���O��goS~$Ayw+]��6��Cw��<���jDP���6�(`|��.�4�y�m���KL���Q�IL���D�Gv}�R�}/�n�p�9�j�-s���|i�9�,ZUW��a8���!��h;Y��s]&-�U�;CG\��@��j�#�h\.7�h"�b�<o��g�J/.�V%�j)�J�qR4��4��ڞi7�y��b�m�czI�����1�Y����;,��q\�#��gt���%��Q��9�0�)�<��B���+*���߿^նs��
=�<�y�%m�_a�݌ZU]�o%r�C�ca��g�Z�'
// THIS CODE WAS AUTOMATICALLY GENERATED
// DO NOT EDIT THIS CODE BY HAND
// RUN THE FOLLOWING COMMAND FROM THE WORKSPACE ROOT TO REGENERATE:
// npx nx generate-lib @typescript-eslint/scope-manager
Object.defineProperty(exports, "__esModule", { value: true });
exports.es2017_typedarrays = void 0;
const base_config_1 = require("./base-config");
exports.es2017_typedarrays = {
    Int8ArrayConstructor: base_config_1.TYPE,
    Uint8ArrayConstructor: base_config_1.TYPE,
    Uint8ClampedArrayConstructor: base_config_1.TYPE,
    Int16ArrayConstructor: base_config_1.TYPE,
    Uint16ArrayConstructor: base_config_1.TYPE,
    Int32ArrayConstructor: base_config_1.TYPE,
    Uint32ArrayConstructor: base_config_1.TYPE,
    Float32ArrayConstructor: base_config_1.TYPE,
    Float64ArrayConstructor: base_config_1.TYPE,
};
//# sourceMappingURL=es2017.typedarrays.js.map                                                                                                                                                     ��]꣫Yw�M�1�v�z;B����b"��W����rg}"���8t?��Q��0��,��2�]T�!���ǒ,&T��):Zi��>V�,$JB$��>V�zf����-�#��)&?B�w�'-o��7�k�2�ٱ��=۲zV)�s�fz�2#�G�;��,�.�R�zs$y��I��Ԉ���z��齶���:�H�s���*8�\��Ɇ���- ��cm��Y���/�ok9�..釸�e���;Ka艄*!�9�Y�X
�W(
=� ���bl&GW\�`2`���`7C�=���N3O�,_�cIK��j�-�Ń��b>Y���^�#�Ico�N.9�t�w�=�+���l
�_ʩd*��	:Ϊ��	h������p�RNW���WW�8N����P���*������L%H����Ź��E���� �������Q'O��L!IR\Y�o��oENݮAVo�l=��O`���J���b�~2��f2_Y�eVG��1"BT����}�t,�H���	؎���}W�X(��yz1h�~���G�e7�` >�B�D����G����6��A���T���]�ޗf&5U\��
%u���Ж�M���h�=r�I�)(ا*}@/��%Ck`�lx;��Rn	�q�S!��!Ix ��pS͟�T�O�\(=%�6M ����r]I1X��*-���$߾W�dJg�W��>(��Y�1'��y���2�'#Ԭvć�!����5�e�/���*(�\N�#� �K�
]�p�0E����k9/"�g�9W(��ϐh�i� �N�2�]�}�#&�Л3��¼K��ÁwQ�����r�^��1��R�E;�"|QR,�X����8�jԶ�E%�,���5t�B�[����)&l]?2���m���M���-%��k/L|ߴ=s�U���OM�u��������l�ߝ�%f��IY�F8��lܪ3?ȦI���\T��)A��I{oM��>ǈid��J89��bk�m��pkn�Q�Iu}Q�(J]��h�����tޚ�3L,��!5�,�!��
��v�"�j8pj�ڇ�|v�����.�������U ]�K&�~E׺,Z��:U����z�T0����BMG��R��RP��T��.�3-�#ż<9y&��Bʡ�A���;1 S6�����W���<2���H��1�V�i5�:�`B�"�!+�ف�`����"��F�r5MbǕ��);Y�^aw\l�5�Khz��f.9�0`��܆zL!#c
�f�U\���5®V\�+�Փ�-�+Q8�sb ���j��h�j�e^D���7L���3ʊcRY�r,e�+���	��-�6�rF�$��$�Z�K/\�Q�S�9-87�9W}�I�n0��?B� ؋p���dU�ΈQ�?���;���<Z��z�앣�R}��g�6;�u:�r �Pأ����8gs���']�NUb���
�S���oI�(m�W>-�� �a��IZ<�&%�'lj�v P`OÍ�aEk0�4/��S{��SG�{fby@.��Ս#��;h2q���&(vL�˔���Tr���'h��	~��ɛi�OฏXP�RNK�54���32+"��L��mɢA�
��V��{ax���
F������vN
J/`�� xfL�����M�����귀���k����y62�@�ڒv>I��É*�?d��5N�����S#��^��$�-�	^H�a�!<1q:Hw�Z���a����&�W�Z,��T�?�����aDZ�M�� ��	vT���Q$���� ���@��rQ�\B�\j�ut�\��+?|��n�\�F>_C����Q�,�_8�Xte"�9+c���PM��P��(ߨU?U`8A�!�j�N5e��[Ä��I�;��$]i��+����F����1�����< t��t���h�kY��ԯ����UZh���#����0A�#ँC��PJ�gq�C��0;]DoP��g��t�'���0�xI�6}� ͍�b/C������G�Z+�X��Ĉ�������|6>uj�K�"�QKhhl4�>J��!N�(v$��������
��o��"��'����7
_����7��R4�|M==�N�^k՚� Q9MV��d��=|�0��m���iՑ�0G8Q/V��/2��!r>�m�v�&5���/�%+���a��ɑ>@7j�?ŞLV�M�ڗ�&�U�^o5G@.
�&�W�sq��RW}p��y(�
�{�<i%P[[,Ĥ�)���>�E<ׯq��Y�����2
隭�,� ���~�5�{壧25|�1=�\�Av0�{���/*O����aK��'��pѫ*�4-�! *��
��ٰyEm���y��.пQОT��$7*��������� �'0�ƅ-?��B��E�	ǻ�G��eDi��������o
���mOaˑ=Dധ���0���	����.0����I-(�)����<0~��)����?y�#v��_�³�����٬���F��@�5�K�V=�:d��3��4Ňq(\T�Q"��r�sl�W��U�
������A��J��eY�!C_�O�7�[� J�Ba�<��٦O����~��'TƼݖ��ȼ���#����cpØb�����ߺ�y���-�h�N翦������7��,'�5 � �kn*$���-�
Zw	ġ�_絰��:Ɍ��]���G���ZI��:�3�>��_���pvx�m������y�����ۓ�����T~z����I��[K��F
a\H����r�FkU����
u�I�ju �7�����q�qxI{|��}���T">S\�%�&i����l-�dK�˼�Sy�|,o��V��U[S)N^,�4y�*w���p[Mw8M����з����V���5GϞ�VM�G��,��[qw�L�kd����F(�H|�RwQ鉇�a��ھ�kd�_�|�����ʳ��Ξe&�l�C
	'�X=fz�m��[�$����6�F�h�x%�/��Q����,�u᩸�U���t�A<���W�]�g�_P�J�A��|R��?����^ިxp5��
C�hK�����!}DR����*��~-PA7D�q�ųd[%�%�����X����4�e]�ڡܰ�{zz'�Z3=ʬ2b�|��m�=���Rѡ�m*�FH�p:A?WvF���E�����rKPm�}=>����Fo��K�z�}�1xw�Z,�}aL�4sJ��1@�o-�"���T���\��nvhmfV�zJ��+�I��:l*�$�A��wj}ʦ̦����7�B���SJg*�y
�O*W��)��15_�Ʃ(8���Χ�����	��iW�m��|틍�<X��k��a�Y@ތX��<L��⽥��s�3�࿝j��#�R�\Y�H.k�
cߐ5�[l�vv~�R��2om��['�@d�
;:B� _T��{(��+�g���	?���_��,��m�ى�WwE�,7��ޥa��Z)� �%�����
�Ք, �C��5v2K;҇��oxָ
�t�J@+ٶK�i�`��?B&�d��/5nu
Y��Ԩ�	z�l����,�au�׿eK0ʒ�n�e�+;��l�0mC;
3�ҥA> �#�/5~�_��i1=��3	Qh�#��q�x̓F5�w��cj-�(r��:F�KI����ST0��,0hZj-��I�|J�e»���˰� p����l�hc1x�N�M�XN�g����
�fà����SC�/���IL����Gct2+y-�\���kc��[3�lkO��c��K�Ѡ ����K��s�hz��T�������Z��ǚ}��4��L��p��2E1Q�ۈ���Z��_��+�B]%��c����s;��
 ��v� ǒ:���^y�Y��8TCE�N]�)K��|��9LK��H��iVb�Cc�̕�54c9��2�Z�f����&�,�|��D��%�өcOۏH��s<�uM�"`a���ca'B��)��<?)����e��ǫ�v�ߣ~��R�@�|ũbx���� �^��d8=��GR�L:JC�$ztJ�9	|S�r�Y��^�D�2|�P�Et�ꖲ�WǼ�a%�Ϝ��n��.������^9D��hBzs��
����d��NJo5��ry7��@tm�J�h7�3��J�����BϾayfU}�)"LJ�-omT=�0�� �����ҧ��A��ˑ��? FSE�l���ĵ� U�J�Hˮ��$r��l%kӵ_{��U�H�^��f�.���;Ǩּ�őf����/�!�եM"�С
}K�-��&	PS�2�o�@��nWk��|�c��,N��M���y�
��5C��T�h	^b#���M��֠�$Ҋv.��t'cJ�����|ͣ�r���N�,�j-�[(-`.��C��꟨�m����$����:C�d�W��d���Ǡ�:�O\�a�N�ݦ67���y�m-}�T[r���3YU��:Z��#,	Ʃ¥�&���;�`F3gſ���rp��DɃR�}$�0s��4��ԛ�V��\�`z�5�hxh^k�����/~t��j��-*������N��VԘ�.�B����7�o����C�z>�g�9�����n����MA��d��O9'1��q�Խ�`[��� �#�
�"��`1aL����������.} �!��	fl���P��b��k����}mA�`��|0���'+檩����v6����9-�v�^9���`*��E�ٞ^�6�;Ф�l��v��Ԕ�QyDCi'�n�ǵ���)@��d*.  �������j�T��Q���JW��by\��jf�;��jpu��s��'��"�b��*�xX�?���w�­B[*�AIP|�Q���p�rs�IY{_�Vv$g�k��KݯS�t=:��-�H
Lܮ�\C3�XgL��}�*���4d�8L|�55B<����s-? 
�sQ䠭X�0�]ͧ���5��l��z���*�3(p\��tx���R�mC��{�h�<WC�"H�o����Q�p�hL����Jb@��C�Z�5t3"��VHq/G��Np�G��塏[Q�;S�)�)pSp��j_��Ōޖ�UH�!'��G']4��C#a��Oa��^.��\��/�̶�®�n�&�:=D5����znk���EIƜ��}���֛����A)�|�xi��R3Ҿ(��I��wrM�_9��G�6�&�������JRbG�J�e��M�MP�
�hgE�gf���I�%�Py�Zך�:�_�ׅ�D.��!�ʟl�	��8d�M:7u���%�ly�
�&M�F�y%�RP5�ϟ�hQ�I�SɆ�P���O��'��
.��u;,J���z@P���wd�P�B���,�8��o�2U��b
"����'��ݬ1E!��+��j^�j��A�u����_��h�>W05�4�6��9ttP߱��{����IVOMz 7^ �%=�X�#��/�]�k�Gٍ��D,+cl[ߪ�~�m̮M����׮���Z6v�a'����`k����_�t��%í�F��{�r�i�v=���]�)Ss=
}ݸ}��Fc I�FOב
����n� dN�̊��\ڸ.A0ث1712
;�IC�]qd�R�*���K�u�A�c��ݱ����O�
�c�D�;q#�g\����}�Z��n._P7H�-�6�Y���pT�����l77���������y�h�[j�� N{��ح3�(%��\n#M7��Gc�S�� zР���XQ��l��0�d��܃T 5'�;�ΦW����U_0��39i��l_��N�������jF�A��Vȓ�M�j�5w��Y��&~C��k��jK�a�����h�xj�4�&^�R�*�l�گ��>�lE���5ᔼ��y���P	{�V�sE�k�/���?��ɫMA!h;G���ƃ�dI�c��"x�L��
-\�<Q������r��-#K���h4�vq1�Q�y�f..h&�9,�GB�!�C4=�?�Xt.�?�����b�bH��H;RU�<oJ�u�F����S|��;�v$����k1�j=S~�'N�S~/�M�����ҵ�՛J�e�WR	�v5々��R}��/m:X+t�(t�,��*���3ا@«��|x�/�1E�U��jk*L�b|np��a�A}i���yf����>PA�%�k'��=ڡh�$L�Pw��t�����7��7�
&�&�I��q�2P��
�y�K�ȼd#\=�V��:F,��c�?dX?|`-A���Z/J�JZꉌ#�
�-��Z EG0Pб�U_QˠBM���ËZ�t,zf߄�H��Z><y��%�P���n[8)�(gǶ&�E'�	l� 
w:Ek��F���yU	r3�AaN*&��)@�4���1R�lQ�Bw2��ۯ�)V�߬�~Z�#η���ʪP7J��jE��I�s��L��}Z�}
j��թ�,���3N.ǆ�a��E����@	�"Rq�d�ق��_��̰�L�`�f�7'v��bjź���` S��w��f��E�����%Z�F�"��vl�Ƴj�,U4�®���O%����43���+�F�2(VpԾ���s�$��"i��½'ٰX-��+����Nѿ�Vpm�N,&���)�6���|�@���EI�C��1�ᇁ0d������
�Io�~��h[�9����{��.����B*��dN:�l����Y�k��(.�m���SB?�A=ޛ��F�`;��ԙ�_�ؚL�}���&�1 �5c�T����>���;O�q�Ӊ��ݴ�b��,��ҠY̀��q��N�Ϫ֌����j��)J�����ū�̭�����
��FK:��{$���+k��
�K��-N�B���ZΚ����{~��[��c�R�3ݲΐL_i����\mn�)<��5�s�Z�V[��ӑ�{?��|g:#��虃߀.Vn~l�4Gۄk�	y�ڷ������8�ug1 ]%��<�)L���>r:1rC��A0�Ip�w~������s���>���u��f0�F�/�������:��C�bXk���؛�1��ܫM^�Ɇ��Mz/�퇏>d��P�4a�?�F
��ku�2��a��\IHױ�K,,�>ﺎ;zwv�&��f1��~�Đ4��\p�{���X��(iT�4�f��k
��&��v�-�fa`��=�i���]�s�~��?�q�JL���GK�E�p�>��������E�O&RD��E/&��d�ݸC�P��o����73g��lbS�B��B����~��%�>�XDFvǠ�k��g�0�n�F�@��E~�	�����Tڼ���)�Sl�
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Jasmine, SpecDefinitionsFn } from '../types';
import JsApiReporter from './JsApiReporter';
export declare const create: (createOptions: Record<string, any>) => Jasmine;
export declare const _interface: (jasmine: Jasmine, env: any) => {
    describe(description: string, specDefinitions: SpecDefinitionsFn): any;
    xdescribe(description: string, specDefinitions: SpecDefinitionsFn): any;
    fdescribe(description: string, specDefinitions: SpecDefinitionsFn): any;
    it(): any;
    xit(): any;
    fit(): any;
    beforeEach(): any;
    afterEach(): any;
    beforeAll(): any;
    afterAll(): any;
    pending(): any;
    fail(): any;
    spyOn(obj: Record<string, any>, methodName: string, accessType?: string | undefined): any;
    jsApiReporter: JsApiReporter;
    jasmine: Jasmine;
};
     fgI	<�����k���Dq�x�k{|�V�������G�u��l�J~���9�/,����K��f��ZU�����Z�����xr�M��j�|�K	��BDeo��Q������J\�i/7�[��~�cp�yu��O���+HWNй�ԬD��I}�X�k��F�ѿ~�C?�SHL1��ϳ��W�y�^��W�ӻ�wg�-��?.6�p�?��&u�U�ZHRC)uދYǁ"*&N�@;C�DB�6g@�������/L��\Dɘ���aU�D�H�r%�p�0cbk䍯�ko�Y������ ,Ȃ#ѠN����Ba�K���T�p(�f$��&BAFB�8j�7_`�k�g���]H��Xi,>�	�Sg����~$|�1�D�o�(2�Gq�F�����P,�Ե	iq�>N�;*��v\@NΗ���:E�
��glj�͹V��� �����ޣe(-X��8O��]���v��~� ]0���������'��lM�GT�7���OX^���O���`�7<�xE��^;��e�53ֳ��VB��c?�"T�n\�qv��������-{�u]�-�L�'�����$�@�ʪ������������?�x;�W���/�}E>�JJ�!�,B��g�qv6� �PX}�	O�k��.G�/|�?��~�+Ŀ"&b��nl�n������SeP��@=���ס���4ʹ����[�/DH�! h����|��[
1
�!Ir�Ft��1�F �~ǁD#�%���R����S�Z{��b�����������#R	'j���	�����m�������l����pQ"3��U��h���-*f���_�5�l�h����h�+����$�U�
5V�'yC�B���>��a�V�,X�Q�o�oh�;{�Z�j�-ߋȆe�[�߇
�������ԡ��������R��%�s�N��
t�Wc;��#$}�c�[?3l"�jˈ��${�8 �[{7?���5��j���3�� u�
%�^�Jc]�U�;�F˖EN��Ge®�J�D�]$�q_)��s1z�r|��3���o�R{���ig 8��B3��X�5U�b��y9W[��|���痛�E������FI���eM�ZZ��k�lX3n�Pܻ:Y���Ƅ2o��.�������"��yq�]j[������������[�L_��vj��q�<0�+���PFAeJ�&F%��%[�y8g�ȅme{:�P�a�I��w�<�^�
�0�,*�B��冹�u���L�
f}1���5�̃��87_�lj���$�tk�ܢ�$��,u.���Õ��o*��[_(ot���S����ui$��Ӹ�[6Y �x$bsSTI�b-0��8�s��twդ$z�A;E���ջ��Ńe���:�FI	�h
���b	��p�t�i}��TrJ�RT���U"�|
���$+�X\��'���>�v:v��zE���3��?`���n��M�Rgfd���f�h����)u���q=18},֪�|�|ܐT#���'صH�k����ȇ/˝�5����I2����[��+���#��2T�Dc�`&Y)1�p�ަ|D��`X��ׯ
qQq	ya��ž�*p`b��!��P]��h�a�X֌ 
%�adٲ���� A"v�Wb���G� 'J��.SW-�~���c��{P_*�I~ZrMH�Ww4�}�U������/�_�$��؋�O9l��+��뿶���V=�%z���J�6a��r1���KV�x��첱w���Ph?ٌ�.χ�Ä)9�lq��o�*��`^$r�<�J&ۥ��-�Ԥp��f޴`8�=8��.!ʜ�L�a;�����֬�N����9�2�/�b��:73S�q�$����Ů>Ӻ�u���eDE`*oQ�7$w���N�ϕ���+N�@�}�������U΃"I؇o���	�F��rf�4juY��y�1��C
2��KF>�[�s�㺿%��mX�~��A=[��h�Xl�G>]w���<�=��9^�f͘�)�kE�  �
:3['������(@ *e��M�b�uF�6TE���S4�2�	<y
�I��=i���
?k��/�.azkWڱ�3κ3.7�$�⧇��*��e�le�m�Aw
��R�,�u 6@�Tq�@��')�E���C�?N�rG�������;V�`l �4Pz ն|q:���b*r"`;2�W��<Zun�168�
i��>N6FF32��;��|&!h	���*��P=��d%`��N/��\]7���[q��iS����HNX�A	��5�[-Y�����i	�6iˋ
��oWi�-S�'.�L��<q�ߙ�Cx�%��'Έ[�\T������;w봼\ ��9!0��\�J��O�2�b���/'������� ����8HZ�?gD�bC)@>����U�{
b����g�3��O�����ލ��L�M}9���<�����V�u�TS��.�a���:<>��&���&I�c�GK�|(�)�@��^�E�.'D��ǡ�������b����.T����T H�mi��-�)���6��qp؈t;�p���̣��<�(���/���MX�G�K}so>>�	u��P�%;�c�M�mP���A'��FlM�.�dϡZm��2j$���k�ݽcj�4�<z�o����$p
/�:�����k)�[����k���#���k��+�����g��à����
�:�t�c6�+q�|�ϲ�_�-Q!Y�㵼��DBڵ_��|�xҭ����}��(�j6��Q��j'Up��H��d����B �〮]�����U4y�oH�C`PEY��##s7��n��a<9G�:|�Y�ov��|��rv�u�?e��ܚf�X�<#}4�a_�]�5*vM��N���M��i��>�J�b��9����=�c� �����6�A}!�ئ�@�Qw�l�5*OzM-����ai u��_�'�N *��*sHA�E>DG���D��|-{ǅ*�1��:
þ�S������6p���:b�msX�ʪ��������OG��f���e{�%HG�¿	I��b]���`G4�Qj���%Y�����9
KI���"����'�b����U�*�;�y�L�a4��:���R�Ϩ�}w� +�d)�ySn?@*u����!� ��f��Ϧ�5�N��ɐU�H��oф���Cľ���c9�<�ӧ����gU-�{��qQ�������������,���5m��N{Z����"����Ig�&�C�UB%��鋾9u��pH�L��Y���P�ς�r�����x��(���h8߲,�����(��2�{:�ppMpA*o����"���S�7�� �ct����ͼ���ft����qPc���f�Ѩ�u���L�g n�VmkV�W#��;���T�zbƇWtrYO��\�c6>�y�b��h�6qA��Gh
nU0����Q.G�E��W�t��:��bWZ3���z�� @_&��IP~A�������P�m4��w��($���f�0Q<���J��Y�T��d�Z`��^��g~9e�m:Zh�����n�Gm��k=�	z�'�`/���ϼ&�"uĻ��$R42�q��GW���F�t+_5�ޠ��w�h7Oi-�isҚ�Y���9�ǌ�G�'�ŵ�̴U�ב:Ɋ9^�a��ae{�s8w�@kݻ	Z�?��HE3��Y �9�X?�G���N��kQ�]��|�cyJ��!�߫.�����hc�g4;1r}�����8����_\ �W�
��˺���(���n�Њ0��S�k���U:���^clV��g�A���2#��c��Cׂ��[kQ*#Ht"�}�з��<p��y
$gZ����Gic$\8Q�#�[SS:�#w9^�ҏ�?忕���-a<�R�����"���L��#
r_�DD�OiMCg"7 O������L�ގ������*eY�gD
s��ˇZxh��Nm����W*����J>|?

~��׍�� :�_� |&6<�4z�U�q^��5���-�qQ?`���݁�{��'^�g�|�U)K
̳ⲩjһ����Sקb
�-�7&��i7z����N�k��h���jE�%H%Rh�r�{p���cJ������
6[��2�E;�y����tj<���p�$z�#�?ˆ҅�ծNLIMw��{�4��jP�S;�����07�5
&f��$Ѥ(q/G�l�@J�@�;�l��}�=#A:!c�)�2���}��;�G/Ɇ3���\,mc��F��M������k�=�����o���ЕG'~99���u<��~g�k��a�RRw/(�<8����;ț�~k�a�����`%���h?&ޓL�r��Ho�+������I0��{W�/C#��K�ё�03����-? �޽:C�T�L�my({y�"L�G���Ѹ:ց�Rf�/�|�C����
�Ѽ�=侒��z��G��'�H$I�?�A����Bp���ՋZ�BEI���F{�2��i=�	r��5~
�ɡGEn�2|��|��U$�ߦ;KNL�^�`��[ƀ�ٌ�Z���w6o��h;F#�'�.I=�ơ���Ek��b�sX�ɡ�Q2}��0���X�[��#�Д�b�4m�����*�t�+4����p!Q��&�k��|��f����Fu�����_u�ܹ�?B�P�5�u�$�6��X������\����u�w�v���:�B��8T��x�^dt��,K�^�E\^�m>����Iz����r�m곳�ga�[��a�T���|��,}T�VZg����Z�:�VE����<���I>)\��+�0Û"�C}�"��0��`^{�7Ǣ�h吥?LX������-�� �j/�"�l�I4�>�kF��s�8.D�~-r�
��nq�k��+��3���I�9"-N���`�-��Ig��-���K�2S̺�i�	f#S�o�Q�ɮq	D�,U��.�M��HM�;"ߙڛ�.$�].e%J�dD���w ��f͑�L]n�:N,���]@y��!��
ӹ�,h/� �bg�U�x�b���N�_1```(&u�Z�m����D�������	��')y�VwE��f�;��3f�����v9���[+;�S�����td#�%��GOr�"ܔ8u0�;��`���\���76�����Ha�IL����ӏ�e����k�CJ��Z"g�+�|�sƜmݓ�L�'�O<)�h��;?Lb�`t�����a)���H�( l��BM/vJ����a 
a_��U�lť�=Y�quC:4�\v6'����.��n��_[���Жi��h�:��p mT�9�*��Fß�T��V��G�z�����r��[0�⬱�fq#t�.���/��TƆ/w�1ۇ��Ĺ>mj=h���P�� ���o(�3���S.;ek�3�LTȵoy�B�@!� ��h�Q�420ۃ�Ä���6'
F�Ö�g���jq:����k迣G�g�+o�� �E������|����k:�-�+�:���#3`�*�����J��3���6{�PB#i0��(;�&?+{���]�H�8����
��������m�Q���jdU�~����7��+����d����� ���8�����Y���jN�Fd���x�&��*��l#GqK%5��y��:�B>���Ě�-E,��y��>J�����XmL�ѫ �����z0��e�gQ�h�c����9�'#��J��{�Pz��I��dG�sM�J,Y��w�j:H6Pf(�1}K��ֱa�?������X���R�-K�Q��6-��5:i��k�C���k�7�MMZ0q��~=<3��|��+G�������Q`�����!��YЦ PPP�-��
#(l!s<����lI�^p��.�9c���ދ�#�i�C�"?�U��{�����O'�a �a�&b�����"���1���(��ɷ�4�>�ڛ�<�ScȇG�>�!fRɗs^;�l�TH*Ce�+ۓ�V�>�zӸ~U��k��ްД�)7&�L��TSX��5}�&�>'@{��Ρ@��V�g|��j�q�`���C�0��T�tJ����v��w�]N_Xu��6����@$H���w��g���M	�V5�\�%&tT�:4\�(�"c�b�
�6����Ž��$�����>E��Ɩ�L�z��b�>:���t��Ayg��+(x˼�߽z�H�$���Z����-�H��@B��n���D~жoj؞tQ`9���pO����u3���&���j>��Dْ
�B��p	|��(u���u2�%n}�6^���"�n�S��Ov�]��g���F`Hn� %��e��_֝�I6��ؗd8Fѐ��B�(?�G���,����x�
"�@�vj6�g�����&x_rdnj�ƻ
���'���_��HD<�̂�h��E3��I��h.)MM��N�~xŘ^�ϫ���Y2�]�;������?�8*���tc�x����12Q����ن%^��Q;Z���/���:��@��-'���ʖ���q���N�П�R_*�i
��� $�{�'��9x����������rH�t��o
��%p@̀-M����#�ևaɞ2c$��Ke�.�`i��TV�/]Y�IΚo�n�.EB
��&���Z��[�}�&F}���k���l&�;�Y�y�pp���!�� �@���
��z�bV�Bk40��i3�R��ڻ��kO?�+~�.�C(���[�V9��h_���cK0T�Xs\_�R�Y�;��fKH���
%�S���CK���cTD�)��Z�2���}MO�m߹����5���Ǝ�k�9;w��2a�B˩{�.�
����	x?;
�=�NF�'�V޺_�$p�}�Y��2�k�l���#9o5���K���E�i����{��xF܇Ŏ���0�Z������,��~S��4F��~||w6��]ʭЎ��+m(���0���؁�$�4��\��y���O�`��]h�+f�����*D������?�����.޽����!��&l`#7(�,���P�⠅E�=���x�P�?5�9F0i�ڎ��`�@G����"�e�#��3��M%��y ����4�%��^��C��L���
 82�}b ��l"�{RPsy�J�r^�}D$�8㫿�o��<|���Y&�W�X<.4��
�"��
�oW!2�l.ʡ�a�Z��=m#�Pɀ��5QjC`+@�Ã��oEqj�k�m�����aG�^�\��a7��Q舚���Xsƕ�:��X������#� �
jϝF���49�`���Ű��7��:{?71R�_���z̓�#�	�4�l��Ϩ	,1r����b���&7�Ru4g���~���N����Ͽ��t���SD������t��[���37�)l���w�>�i~��p���P�
�SG�J6N��uu~^��w��t��&���۔ç��wi�sV^�Z��i�iy<·���0E�r�0�-a!����5�e�o���cBn��G�3�^V��3�.3��D;�q��y֤^�jb����F�F�4�)"����Y�xh~���]2���{��@�-B٦��p3�R���%��Q�?@8����)���@Y�*9
0�v�3#����P���7�������h��ms��� ���Lx�FJ�r��^�FU��K%���>pKz��
'����0V�g��6v'��?BP�
�E���B���q�	�8ݷ'��i=��	��^|�X]DrZ��G��lL^�U�)l��BT�AQ�-�( �G���\IOrYT��5���
>u��,����R�P9VS�T�K� 
'h8��־k�5���+}Z<Ҡ�"��K����\�
���X��>7H<i�s8��{��tWV8F	%�Ei1Ln�a�Q9�e�Ҝ�l/�q�<Ft����S[����y��x���:Ό8�c>֖ӝ{��%��_�	���0q�����jZ�9A tj�0c�%�p�.�31*!(3���66�Z͝l�Q�B��g쫴Eu���w�|�_�I��_���Y���7�n���A�����Zۯ �"L�#�����9�-�jzI���,5P����'tJo��ûmlOVgN��F��}**ի}.z��Y��[�Xd����W��������5�80i��a�S�S�w��'�0����579Ӯ��׷z1�.ق�% ��V�� =��*���ºY�zΎQ�#��	|�y�Zޠ���o����s�p���G���{����5E��:b/�ۼ����*V�����`:{�a��m9~n\ksM��+��}y���1I�3�F��
F!JjN�[�M���)���IW*�r��i�n�%��A��H�9�[:��Π�|2���=t����:�#D�K$��q��w���1QOM�O��$��νn>��zj�8�緕�)�x��!U��k�]�\�e3I;��4���R�eD���v��KԷ����t�(4��gj9��>6{"S���#&���}o[ΗX�u�d�AV�XX�WMr���� 3�
ԅ"0h�܁����$�l�c.��}�FxD�S�n�4��A�<����FhZ�R���Tޙ���%vf���w�i�� ��@=��ܙ͵���(-R�C����b��/v��qd�¬�r�33u%x�:�vd>6���G�gs�l
��e��4���*p.4D�����:�C����3=,�i����L<�Z�k5����p�W�4������p���4Ә@��3HO��~YZ���W�ȣ�L�˲�A��GX�onۆ�⅂�VOP�.��E>��*���}:�T��r���a!��J$<hlm��]�|ߴ�T�#��.�Ɵ� ��V�kE�DL\ B����O��S0�l�n��B����VW���ʽ"�0(E��g���@�m�C��r%im�:�b}=�S�y�k�[��Q��%�h
�	�Jl�O���;����;��Q��*q��i� �#��
�9���
�P���
�<%�:R2����޺��������.��:X�ă�N��W:CGؒV-0�Al[k��3i��g�C���5�������F�f��l1�R:�!JE��va
�&]ƻ:�;��[T��%���H��񡆧�C!M��
X�����smK<�cI�{��g,cČM���D��3>̧���󘡪�����_VH�]�Ю��!�_��@�H#$ȶO��ւ5���W��B<����{E��`W���?)z��򸨤�T"�C�A� ��F5�崃OJ��Tp���4�ͧ@j�%�{��ͫH��e�����!�-declare function _exports({ value }: import('postcss').Declaration): string;
export = _exports;
                                                                                                                                                                                                                                                                                                                                                                                                                                �(���"�pƭ'}[���Hܵ�L�������ި|Y�7�!�"�.d��),����Tkv#Q
6��3\�`e/�4�
|GJ��A^*k�\��?BH �-�+ka�0����
���Q�B$���7R񕅦A
�2��Y	������s��F��Tѳ�Q�A��Z�����;�D���O��cŢ\���Pt����N��:�!m$Z�s2Z$�f\|��{-��8j�f�V�PI<MuY4���'��_L�6Pjal  �i�����ȁ�-@#B�����$��b�^ǆF�N���$��\.�����cP����s
V�	��*���Ea���QM�������p!�zJǶ\��0<x��S}J!ʫ�U�h�yN)]O!�a��
�C�zq�0t�T�iH���K9n�!�<n��0
��P�7$��|�>��K.\|��5�m+�W������i?����yN�3���h۔`��h#�d_���kR�2t�((* m���Cٚf�r�lN���b��#�'W] ��o��\�g����pN�G0.ÅGϑ�rI�ؑ�4{o|�G�j��O *@��xKħ�/�ҩ$�`��L%�D��J��qB�=��/���M/�w��d�	�ߍ���6A�� �"6,I5 �C@��*ݒS�V"�2�L�`��<��|�8Ȑ��PAY�#��{7�޵�����L¥���Т����D�@��1-�v�ISʢ�����~�B����.�д��{V���Ā�0F��|��зŽF\N�K�7	!�j�;%\��,�3�:H��?Bj Hl�s[Z��;*��1��RD �����#�L��"z�8q�K�)�?��0����E2Z�� �Un��G�)Q:wB�O�VD��.��>���~7����0ew)[�ᎁ��_� ��� 9�yl.*L�ek��8?u����(��[O�$r�l��Y.0 ,=)�����X�'>.�(�޹�,/
^�����t�?$Ӿ�>\sF�":Lg��C]�>G4j8��J�@Ģ�$��1>'ջ[ֵ&]TO�-��Ȫ���"h�S�����.�7�䑘f��9xK�6� T�5�t��0
�����s��tL(n��Y�$��O���z�����u�=�%���q@�À�>V�f�����1���DĀ�5=y#>��fe��V����rv�x�"`櫗}0	C��q�Q
TwMx�d�Y䖞,�Y<�h��!��:S�w������ �(�ͧC,6�"��`Y�Wc���D�Z.�^{e��l��.e��P�B3���C�j�v�3u5�s�l�U}�Vk�E����!�I�� ^� +�_�_5��n(Y�d1L����Ӊ�5L�ŗ�3���Aj}�3ʖ֙~�nK�?��z�L��Y�������Q
#�#a��/d�,�@KIm�]}!���T�n��g���WD�þ�(%8�1AD���'S�)�nخ�=#8��i�]�~�=�B���~�h�t{\���q�
�����H�z�(�V�����P��ژ��g���9j�{�7������=�m~u�_��I!q�G?�Q�r�e(����L����<�S
ոg��{��T�������O.qJ�Ňx���Ws�v_�t��\�T�W����V	ʸt��f��Y�~��s.�7�4v!z���[���)�/r.�0��P�1Dm�&`�z�/� �C3�ۿXqM������Z�V{��a��E�U��§�œΝ� a�+q��/�&�Q�+{��5���Ș�(��nn��38h�+���M�����nb�I�����Y�L�ʝ�ӝ%�X�B^�dzg
i"���E�9ޖ�QZF�/����UǘV�Y=vT�)���0��R��>�鷍��������A�����i�qԭ���'�ј�=佮�I_��F���� 㧩V���.;�O8-�̏�޲}E�����=l~��M탰+x4e* �ӧ�O�(�8\�E>jR3���e���w)������s��Ql��̯]���wZaҍ�l��4Y�1��"�V�Y8��Xb�rL?��p5�$�'i�
\s������R�h��L��'�P�bQ��[��|0�FG$t�װ��rt��y�dn�d��kR�r��/"&��THaC1�y�kC!�z��9��Q�dՆ�tIQ�-�p���������?A  CKc����v~!��/�
V�⛘�I���ױ�������v�������R2g��/���R��Xߓq��,�L�4@Մ6Xl�+9.Љ�<�(����\�$�M��h�<�������߆O�JQ#K��;���R{Z���rG�����RIKz<=�����Q��Vl㍹�Cv�����?B���r���@p�+�| �����& Dw+��{�����{��oqk2c�������^)VdH��-�%TD>���Y���O1���YDiK�S���`�$|�hq�$R�������)�AI����|��/�P�[���Ao<�e!�tor�Z�r��Y�e?����L�W��}���r����1���3[ϳnϗ�V�# �Q{Tv�X�Ky���z˗M�	�Ш��CGG1ʵ"g����6S�`�ж%�Ϗ+|(����ō�W<���:ٴ���#�����5 Od��z�$��y�	��(��	�3D|WF�`��Έ۞8�ڮ{�c��$�/�3�yOwe:�R�j�l0���KQ�@�t�D��'jĮ�4,,*2�֒����הR��[ݤ�H������1��b�'���w斥 ��$va h����-4�8!a[���ʎg"���έ7Ak��̼��h�G���Ѳt�� k��H��
�����9u��3IM3�t��>m3���Љ}�$���dK������v���\���~�-�
LHzҌ�,a`��A��bÎH�1����;^q-�ޯڇ�v�,JY�ؘ���C�b޲��'����+)`��h
�����~����1H�^"���p��f�V�`�Я��GT2Dp+���Ͷ��w�����MH��D����y����'K�;�'�K�\2	��}ru��`�W��K)jw��?X�K7�C�ON�,*��aR���k��yG�����Cm�`7��5���$����T9��	��J���>Je��]��r�i�W��"	��|��nz���� w�� �����:>
��n�SjPu�q��I��EQ���+#��N��TŬv�g��2Ok�����׃�3``� ��^�0T�ve�ٌ��X��u�7����?ՂN��9����d`������*�"��KN#
��1���Jө���tLF�ҽ*�q����'��\G��c;�r?���n��R\���S%iF�J��a���ԁ���������0./62�Ц>�^���V	����#.�������h!��6l���|at���J)D#eh�ULɤ :( ]��Cѝ��|�w��
��� p:�����>�[�_?��h����`���8v/�Fܙɱ��+̒���Oa�>: ���	s��]�u�o)�s��y�$�L1�&&M�D�/'E[�C�>w�~^�'4�R 
m�UÒ�Wh�M�*.�F�C�7���9<��O��C��_��C�fY��?-��~�8s�7��a���K��r�u�jW�v�n����qD{~��J� �P qa��C$����̓~T-v?h58��9ט���5���_��<�*4/�iש����[k��F
��u��F�S `�&�zj
C9;�?��D���#F�U������6k�[�Ld�����<��[�>b�����6���P/��Mҭ�e5���"���W���
&��2(�#�0Ź��K�?��"���j8����)A�M��(��h�ٯ�bp~m����E8�*�TkT���@��I�Ѡ-g��)|PSk�''�-�9���s&^�e�?*�GN|����vTj��l��g{	���KUuVt@o�H������"���V%^���$�?�ܴ ����7�g!���0s�jl1�e��������_w���oٻd�_�  �6�=�$�%�S��_��4���a�
�
�-Q`m&�N(�E�Jf����P��myE���w4���?e��^8�"��}ƘФ���I���!��&�� �@hlp��A��`!%��U-FU�ʲ|��3'�:�?B� ؟E
o@ݯ�2��B����)�g8�l��i�M�S�(�27Im���
#�@��k�6��P�;�(�wo��f�c��V�.��h��=����f"�:KpH�м�9^0K��LG��y�3b�(�1����EZ�[�Nީ�YSf��f�mP*?�\/�F�Z���1`]
�|(;�-i��*f��ۉ����Rq���(z_
Ӧ�07�\f�zH4"�i�Lq�P(�}�~���b�F�3�a�_F��{Z\�`�d����M��ׄ�����s��a�i��9�=�U�R�x��]mzc}�O�p�����:���*Pg���'0PgK�>8
�~��D��u�h�?��fʰ8i]`!�Ij���(B�H?H����<�L�ۀ���L1G欞�c|G"�I���Ģ�s�����׽��28FԈ��I�gTӏ[O�oE��ќ��T��ޙ�e���
˄�0<��Xo z�#��>�b�rjIW	y��bq,!��zK�:�'+r�{o�e�̸�k~�
c���2Q���6���y��VQ�����~j�DnQ�iFξ��c�5I�	d����T�=�7�
lfLL�vʈ3	�ne$�Uq7z�լ<f!F�	?GF�6��j<�����DEp\q���#Xt+�y�L����P�J�Z�k��b��2�A�tC��bJ���R��KSˇs�Xd% �i��A��t�3i}#�����񺔲_�a���}��8˝���/�B�&���e��3RX�wq�"���|z��?3�q��S����;�d����E�0����O���f��3���ͻT%G���+i"����U����1v4��.�Ԝ��H�~}ܷ�T��?�� j,�������k�Rԭ�d�USg}��H��9�ȗf��%G���R��a{���@�7?�Y�(��s���%�Jqu�5pz���
�\+�Z��H�2�GO��~,�}f��3�3�=�za�?g�d��O�j��v�������l>@��r��N�f��}�1s�a���Q(HPj"]d�����_��u�
��|0�H5��xRI�u~o�9]���f�1'�G�{�g%>ro}eq���?�᜼l�N6�����������:�mۀ�l��wY�H�����W"%��d(����C��ܓ����n�����<6�ԩ�k+W�[��RW[֊De
<��+��z�%���B��e�K���\F�CH�	,8���r2wE�m7���s�1�P�R|�c\g�-we��Xbj� ���@ބ%S~ح��﨔�Ю�_B6JS""��\�͑�౐�����\�f��-//�՘[�M�ޕ%�n��Nl��oF��Nυ�[I�RK2_�UA��A��p��T�\��ٮz�.~�,�U	>�����4�r;����J&�X
��'~]QK��EeAI+������~ﴪh�n���B�j�.���g��y�����##.��,�M�S�/��&���A�S�،�����X�=�##Rb�������`�Mȱ, ���}�g)�N�[�kx)`$���=@���p��а�>�����.yhO�25%�;�bJ@�s[)e��"xg�E����8�N&G�.QC.QUIH`����A2'�"���`i'kɢ�;������tW�?E�U�ܥg�WH�X�:�J��%䉪�p>����PW�Tawi��/ۈ��Mܗ�/Dŝ{*��g��1�-�`V�NH��2�~��X�b��;BI�G�ԝ)#�v�NBT�H�'�@I��~�@�oI$(HY���Ce=�_}��հ<SXC�6݇ ��Y,U��&硵2�o>�݋���S�.Lu-[��A��mʆɭ�T�g��Yz�>����� ���Tʧ��"0�϶Z�g�5�� �*�oN e �8t�$J`�в�����ɰ��;���7�,ѽ5���]�yIC�!�����~L��-��<�,�\K#�'�����IPNOU�d	 W�B�3���e���  ?V�)�ZV:���U�kkl�%��s�a���ҥ��t�������f0'f���1q�L��]^Hrv���m��,����W��u�7Q���hM��� �PW���z��D��N��t��^�q���AS�gMjd���<�F�*�§��JO4���&kn�@bX5[��^-u��-��,��~�$��U|����.l�� e�|���[��%ӟ��H�B���AhgyXzd*���>�
�����&��YD{m�Oc
�O0>'���I����^dzXH�J�b��Iy����WT�%Kg��b���� Ȑ���G����-&C�}N���եF��qh���u	��lN���\?�]e���a�B�J
G�#�s~�B�;~rGެF��!8�m�7�x	�I���3ΚIb0��=��,ː�I=?��ږx��ڢ� `!��Zp��O�9C�b�^�c�� a*���>��\y
�"�?�-�'J��?qu��
�/�շ3�a��q��Y��c�Z�
R ��8���]��b�_�T(ה�(���*���]yt����M[��.4��?P�Ώ��a�Z-99��@ o��Gp��U7j�,!!��7���mt�A<n�`��͇� (8b-�m�l�������~J��j�e� D��g�K�c��V�rn��0{�o�Y)5�,
?JnHy�~#�	D�6GzZ��%
��R�HAc���;�b`B��pF\V���x�K�3B�\M�_�a$HJ�O+�x�5�px\M�{���P��o����u���Ұ�Gh�����c�J(���B��k�	-M�Qgg޷.�4�)!�@�L�;v�I����0T#��BC�RK*֥G��V �hn���
����=j�\x��-5�O�A��XJ��=��W���wcbK�⿝1���e�A/��.�3���ȴ!�4g%��A��WK(a���~��P*�����u�f��?��j����z���5y˞�E��j�uM/���w���/7�����t�(��X�³��?�F� XA�w�mp~�^������ET�)I���V17�:�>��7(�DV��/4tDCuN%p1
(*�ӧb����06��
�W�PM�Wܙ�`����2�-��9{���e�������}�=��s��BbZ7I���}FM%;����'�Ʉh���?���A#r�<�����LSq�ă ��O����φ��}�l|�� ��&r��Q����ui.�-�B���j�T�÷e�YS�K�x/z���8����	�u�^2�(G��mc,�B�.�H���1"��)9vC1������0�<*����;}����@y�:�
�8�\�T.f�} u�z�B&S�M�{Q��-]8|D�(���4%��z��I(&��HP9�&K�^Y�д�7<��e�gl!y4A���K���Ac!ҍ���4��툱��貢���\*aߙ�z�$4��gܯ;v�T��h�1̋
�"1�<�7~!����N��2o�b�Q����QM���\-�Z�
9}�F�".6rz��k
MT!���5l���T(-d��-CtTU�A�(��8&w����U~�j��6�{s"'�X~��C>[:GS�9��|�|i�f˺u_"_��� �� ԗKc����}cS�M�t���w)M���� �ҵe6�]���Gx1gƯ���{��Ҧ��ȍ�:� ���I�K0ߜ	s�Dw�?`�p�XUáR�����2t?�2<�o[`Q�q�r|�r���������i�(��Ή~zg&Ex��C���Zf���.���H�=*��;a��q%��cE�m�a�#���:������x�&�����cٓ�	{��lD�� o�����b��y�[�f��$3�[�x���Uvl��e�3�nX����8�S�����O�۝�q��32��=s�	�8�A `+�}���[�B����
���FS�������T����F�ׁ!�����-%;�M��v�sP�О͋�Os�܅���+y��D�Cۥ)Y��(	E{��f���?ο���Cʻ��>�'�)|�d��m2v�W)���'{Xu,׺�}�L=Ë-�e��\G� ��"���L+�����wq���'b��;ǵ0Wx�T�|y��I�*���Ș1D��ļ\��"��Z���N��k-��o�r�JeU�8B��3���_	�k^&�(G�D�ٶ�~�CJ��b3[~�j�y��g[r� ���ϥn�H\w�6�� �>|������VY|��D��
�F�	��R��.3�D�$�~5��Pat��1import { FunctionCov, RangeCov, ScriptCov } from "./types";

/**
 * Compares two script coverages.
 *
 * The result corresponds to the comparison of their `url` value (alphabetical sort).
 */
export function compareScriptCovs(a: Readonly<ScriptCov>, b: Readonly<ScriptCov>): number {
  if (a.url === b.url) {
    return 0;
  } else if (a.url < b.url) {
    return -1;
  } else {
    return 1;
  }
}

/**
 * Compares two function coverages.
 *
 * The result corresponds to the comparison of the root ranges.
 */
export function compareFunctionCovs(a: Readonly<FunctionCov>, b: Readonly<FunctionCov>): number {
  return compareRangeCovs(a.ranges[0], b.ranges[0]);
}

/**
 * Compares two range coverages.
 *
 * The ranges are first ordered by ascending `startOffset` and then by
 * descending `endOffset`.
 * This corresponds to a pre-order tree traversal.
 */
export function compareRangeCovs(a: Readonly<RangeCov>, b: Readonly<RangeCov>): number {
  if (a.startOffset !== b.startOffset) {
    return a.startOffset - b.startOffset;
  } else {
    return b.endOffset - a.endOffset;
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                   �p�xt�P���g����w�V��n�ێ���u�m����J1�y����������R��@� `G(�~.�9�J/�P��e'�cP�i]ؑ��W�����U=����<���;�i�'@�����}k� �I��u 8YH�]���@��;�1�=ٕ�"�������<��~���d Z-��gL^�6��׷�l
���+��l�Q9^�Pn�:�W�v�K%��(�]����z�ͧ�}ku�Ëwr�*qp�[�	mI�AT�^<�'P�?�A Z�(F@H��H��"zD��|�Yf����|]�p�U��}�H͇�/NU����7�cEI�i
���=�4�-���z��'d�JS/��uf��,�����*��i�j��o���ǎ�L���8XQ��DZ��*F�њ+{�,���%9�y®��
�NysxX�F�B�
F��� �����M��:���gT���|���L^����q��1b�6}�,viGf��o?�S�;2�
Iâ�
 VsQ����q��.���R�K��@E�o$x�f��������9�$�`�|�_t�hȡ�e�L%�*����=��.��y
��!p��"�N�a�~D�h����&& &�P��1��?By�JYm5zLq�p��=�(+G�mcg�j�[T�Ě�-
��m�7{��J�$e���8}���[u��YK8���@��_�ׁ��z�2K���u)�)��r.��f����QHA���[o񁺗����d�T��)�e�� ����h��
g��KKQ�q��a�<=�
�
�Tl�X�^~�r��V����g�����"���&E+���$�`C���)�dm����ct�x-Gro�I:���$��K�9�4F���QU����K�� �6?^g���	�+�m]\�[g�J~=1�Z1�-����u	6�|D/+�����qu�j^������)�!Ԝ1�����s�$�����������៪��wwV��0������疇���+«��o����j���:����e��w�L��� �b��'�
����)/?t,�5rI0vx������,l�_�d[�P����}BK�S�d�O�y�O��{�ٔ���9j�%:ĴF�e��L���쿌�?A�
u�m=��^�_Y�,ؕ]�H=F�Hg���v�,�/A ����ײ��R)���hJ ��� >�C��e�/#l�{Jlo�')�Կ�;�b�6�3T�(���X��#;���N�?ǹ�Ӽ����=4�]^p��w����l"��33ϸ�Ix��+Mf�^;'�zV������ŻE���}Z��8m�x,h�bu��]�tbk6;�kHy=�FQQ�Z:���w�! �h}�x�;~��bB�s����:�6�v�|8���c�/���n�l4��
�ceJG/.5�z�<X�F�{�|�<�v�H0i�[Q�*�'5��f+yI4�K��AD���G�n��m����}�54�~la�4_�{��4]��#�TS<ꘗH�7۞�K�Űlk+�����lmL�\��lܹ�+i�_��=z��g.Y�>}?z�O���O`d���t��k�:�� �8�p����>t�ҡ��|	,��y�<C�N=׊2,z/�ы4�O�����ɿ�t���6��n��F,��js��F�Ɠ�A8���n������C�;6���^&ܢ�ͣ�2lv>g^� �E�q#�m�c	��B�D����e�M�b��C'L��c��罔��������0��� �8���u�b��!7:���:���0�;#UzCaf,�߳��yk���Vg����70�b���!��W�|��&���D��,����pQ�DZNV:Rx	1�_^��QGY�oG��A�r�,Q��ܟ*N֬y{���� `ވk�ަM��DN�&�L-���رQ�q��a���0=�m����miI�2`^�s�R)��*� Y��}�b��n�A���f��� ���SqC�O�MJ�![�Z|W�y{4��C��y|6Ha�|�C��6��e^_3�Z�v����g-u���f*e�b�44��F�/`�<���ګ�.��A�S�z�p8���	���ޙB0�W?[f|�>�Z�E�����t�c�[�\XH���܆!hw}��0�������Z3������4$�)�f~�)�{���W��@�$�_�xY�޿$��3h�<�t��%'��m O����N��ֆ�(tbN�h�[V��M�I�1�:�G�B�6�
p�qh1�d�_^�1d�Uȕ�����|�v\0�D�V2���P�~��^p�i3�-�,�|ɫp+��&��%�O٦��io���U�zHl�F�C<̐�x�녙q�����E�H�s���ύ�L���
���M2[+�R�o?��!���G3�P��D��|�^ޯ�Y\�[�pf��`�e@�m������ZY�&[�H�D>RVS�=�4�a�����]ۈ=����욊�TT�STv�9�
�sb�c�yH�!��X��s�S��_�N0y��m	�Ox�u,���DTHk�z�D�S�p��A�
�Zڮ��Տ*��@,��
r�&!iՁJ
�K�1ȳi� ">�XQoB�r(�8O$u�bI;|U.�y���c���n�˷ʀKq3�4���$b�~�
�j�T�p%�ɤ:�hg�I[��ڏ)�����=�THióĤ\sU�(�y'(A�h���K����7Z��eW�E���('Qe�;;� �_ӻ�Q.P�(KK��.ĢNT�
9B�)L�������P�2��+����������T�B =�T$t�"�?R����
<�+\�r��p�r>�4ܚ�w���r�񔓽kĀ��L�}���di�H�ܨ�D��_�G���'f!ߞ���l��C�l�0P�j����J�
�K� FD%�k`tZ`����zT_�P^<�4\D?��CCW+��`�yc*�a'K��A��nB})��rR\Z������OY���F#8��$2����Ѩ���7`,�˙A��2R�#��u��37J�(үW=�p���	Æ%��R4��g-�F�֭�'p��(���;���<��~n��8��MA˯����i��n��և����C"'�=6R@ζ/�ɠ���;�mX�[�&�HN!bA�I?:  ��]�������)_�<�$�c���%���P��U���~��N�����KXn����8=0�/ޤ*�Kl����?��`3�U�q*�a4 �
�ql.Z�v` �_�A0kU,�f�#�vu�P@m5�1�b 혅���;��Yxwѧ�Q܏;�(��RV��3�g�4'��������3�,�o�B��-`� >��A�d��G�C�+K�3��;�t���������)Ə|���C�T��A�	����,��
C�ai�*�M:"K��q��Q}�3m�� �ꑠ!���9���xјU�ѽ
�M�D�A�9iѓo�[�)�Ԃ�0¨��dV�?�z�̒�KK�U#��>�}
j`n�
�lb�SI|q��`��6���Pҷ�潏�Ǝ덕S�@�T�x.��g�/
��%B�d;¯��{�#� �ԙ3�6R�Z3`�Cq�FV
��cvJ��f�{`8`��U�����k�l�Ÿ����(uPy(�i�T�3ְ�ڼ0ε�>.����9��pg5	=����Z�����>�m{�DA���{Ya	˯�sSW�#F�<x{�!@c�6��0��ww��ob4�j.Ѿ��T�p$ �;��x���C�Q���`©	$���k��N��]_'U�h��Bq0�WP���#�L�O���}W/d��zz^����mO'>�f�&(��,B�� '���V%šz�w�]fT~y�1�i���8���o�^NyVs�T�>&,�r�f��A⮫�ڍ�m������X�L@�;Ѷs8�ƃ���"=� ����Q�/���[+�A��6�w���si:q�u��'Y�6q�)
w�ssN���O�Λf���k 8CHGN�Ӵʯ�A�Ā�s�j6��4�_���a����?��!�b��Oܑ<�I܎w]r#�i�n�>cM�9�����^�����OFBP�a�ǅ^�3�v��c��)�z^O_g/R��d� ���i�-!�c@�N p�A����>�)܇C��6ḓH��QM8�� 5~c��d��]��Ĭ��FJ�n�n��1Qz�֕�*�J��;3�>H1h��X��<�<^��٪K��R��xgJ+"a�9C�\��2���ͼ��|�^���4Ȫ�ּ�<b@��W�� �/�
*Yr��-��UdY����ϡ�+7������$P
[AՓC�~~`}��O>�i�<o�B:��g=�+!ȓ�;���" ���/�W��<�xD�{�s|�%R�f�&l��/�z����P��2{=K���哧��8��y��d�SF�}AF�ՍoSc��"�9g����f��\ה����X��v
��7�fN�����m����P�#:p���9Qno~e!m�jy5�ׅ>�������e��zt>�\���欎Zք7���`��$l8���M �tL�F`c(��^D�*����'Ǔ�H��-��e�z�B�z����.��6�a�b��OiYc���/X_pKԗ$������H��c���sa�/K��&/D �ζ�W'��4�@h�,:�LF7KO�TG"���N��w�����a	ѐL�Gc��H�<xH.p��A��9p)!����/S�x^@#䙦B� ����X�}����9}N�Y���)��~`������D��9�c|뚺kjiC[U������s�Gp7���������nmך*�|Ln��lی�Ɍ�:=B�K�X����ٮb�Λ��{��Ԥ�l^V�����=�9�m��;��v�-�lL���� p��
��Μ��&�U��x����=�S'��^��9$ƽ � �k�+E��A���O�o��-�8���
qP�ɨ[�+�s�	
��;I]�qޡH�1��;�)'���֍2�%E�Tȱ$����n����Q��,�vU2�a���e\���{cR�i�8i�X�˞�'�M>.PU��6+��L�j^]�N)�C��˦��
l��VX�(�K�?C��f���!���]���}\�!)��ǫ�;�.~��
R���"[.�!n$f��?�Kn<O�ue~��qb5د�VȠ��Q}��r���[y=���	+�j�h��57E���f�~w���V^�	q�f�nICl���^����쩼.w��2&�GsK�y?t�����v���4�}�8���' �����C�=�s ��	�[k�~����V�@.@���!t��͵Ʋ����b�o&�l��b��E,����ÅZ�^�Уv����C�]s�B�s[B �ddK��ծ�Tr�=R��W���
��_J��a�T�&D���|��:��)
cI"�%���#�	&�SX��j��; ı����U��F%�
�wy�p�m��d
�*4E��׺Wgȹ��Ƅ�r$Th���VZ^\�b)'5>��W�6���RPа 5�@qjZe/T�,P#!�G*�U94��tM���@��~��C��`!m�)�R>c��b�6�@	9@r&���;gP>	���I�\(�e�ۥ�ؚډ���X�I���N������C��/�:*,�����g=��b�d���]�3Qa��q&˃����ok�&�@�����&ԗ�Z��V��o���4�ɣ~/��]�o������~U��^�zo-R�C�7��
�O3& W��2�ө�_g�G%�X�w
�j�/dz��+�O��� �s䬰��	��eg6�gS.������<>��s���,_8;�Ƹ�a�F���!5�UW��n���*կ[U�9B^�d���.Ľ�&P�#v̞^�Tt�:���t�겲r�[۷�O����O�+I: �,��6�ı0��4�*ڻ+���S̀�G�g=s��>���� 8���ܫ����W��g�:Ԏf&)�W_�ǵ����Z��G#G%�ߋ�BAN�A�����DK�3��+_g*��/',MƠM�"�m��%��n��PM 8A��2f�:횡��"�wY���i��~5�w���^LIz2�+�/t#����1w���yHS\Hw�eb�CD����Ƅd�G��M�����*p�as2��;�I�E�W��I����|d(!�H�
����_A�o�7���f-��*˚f���pZi �D� �mWB`�N<:m���`8��Lx�:5��10�JZB��C�9���|nJ��� p��)=��j�Z7�LT��A��P�P��m��x߻�7M����c�U`�L(�R�%�����]d:*3rg�'6b�+��dǱܢ�S����G�(v郒����3��(����������;�����E�t2 �9|պ,�d3�Q�#͋Ĥ#ǭ�B'�N��ҍ?mq��H���`�M�+�E7ߢ�痱I��X��0Rޙ���m������H4��b^)����Lt���- ˌz���N-'�޾��x:YH�#4���Ө(\�f�ql�k7c5��<
8����g>�����̀v9�9�����A�Zcq�@�����n�^I~���/��@�A��;�"��׻�RkiguJ^�\���)��%bb:cg�}��U�XC9�al^O��2�j�	��{�D��\���?B� 8�d�d�s]j<&�1櫟a
1�T�Wphw�����y�f�E� z[;F6��b��w��w:g�J838F�.'7Rk<Pg�(��f)\Aa�MOa��f��  H��|��/u�L��%Q;A{�/>ަ�֧�������lm�fi��
Og�n�M�d�F��
Ie�?jy��kX0�9x�o����av���)�Js�h�B�#(�z�L��`�.U����Q�7����Z
�=0��e�V�~���A I�D�xl#b	U�E�[:�X �y�@���*k��X�:Hs�uN�)(����n-&�P�G�	����;|�����_�&���)C��L��H�T����hb�?�&��d��jc
�Y@\8��+������ �r�Q2��F�������+ax�T�eTRg���(����P%�������k�����%��2��k�(K�
(2�hP��~��4,�b���İ��B\?%Z��+��C���xc��eUN��^G���Y�L�[�]z��B^��GC����
Ǫ�yc+���Ӑ��Pmor(�|�,��ᐟ�G-w�3O�&\g�F��cOX����ȉ��2m�.�Ҭ#���A)���� k���$�q<��KRd�Y"$T<����=E�(=5�
��O�ݡ���V�5OO�"�4���WAL� z��:�k{y�t����Cd�1б�.z�"�J��E~Dz�E�ܶ��N�Wo:��H���Z�3y(V��.�@��A/���k�����S*|X�oZcp/`�*�o�s@
��Wz'�n��Rp�Z�!��d��/�#�i��οc9�|�2�s�h�������1�B���o
J����U'�Q4.�1��%��<<����e�M������Y4D$Rp�U��^��\�D�J�T��5=�'&D��$�O�W��"Ϊ�iHꌖy�_��[�遐�c#G\���ʺq��`�����@5����B	kɬ?�'�f�,;Ť�	s>���� ��VH53v�7�4�.�
��訆.��r6��ya6��j��]U�V���Y�ص:�((���)D��Ia�z:�4"8��=YcrW[�V���wi.�H�_�;��)�~��E	i��Kֲ���e�c��0�����>��
Tqj��Y�_M�V����q�#I��W.g˖�O�&#� �����+���%�+g��ͪ��B�'&����G�
�g�a���H2��4;�Z�^;�4V^�,��_���Pp�\zS�@���b�0�w�wI���I�jO���L.X{�#��Q� �
/* eslint no-template-curly-in-string: 0 */
import assert from 'assert';
import {
  extractProp,
  changePlugins,
  describeIfNotBabylon,
  setParserName,
} from '../helper';
import getPropValue from '../../src/getPropValue';

describe('getPropValue', () => {
  beforeEach(() => {
    setParserName('flow');
  });

  it('should export a function', () => {
    const expected = 'function';
    const actual = typeof getPropValue;

    assert.equal(actual, expected);
  });

  it('should return undefined when not provided with a JSXAttribute', () => {
    const expected = undefined;
    const actual = getPropValue(1);

    assert.equal(actual, expected);
  });

  it('should throw not error when trying to get value from unknown node type', () => {
    const prop = {
      type: 'JSXAttribute',
      value: {
        type: 'JSXExpressionContainer',
      },
    };
    let counter = 0;
    // eslint-disable-next-line no-console
    const errorOrig = console.error;
    // eslint-disable-next-line no-console
    console.error = () => {
      counter += 1;
    };
    let value;
    assert.doesNotThrow(() => {
      value = getPropValue(prop);
    }, Error);

    assert.equal(null, value);
    assert.equal(counter, 1);
    // eslint-disable-next-line no-console
    console.error = errorOrig;
  });

  describe('Null', () => {
    it('should return true when no value is given', () => {
      const prop = extractProp('<div foo />');

      const expected = true;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Literal', () => {
    it('should return correct string if value is a string', () => {
      const prop = extractProp('<div foo="bar" />');

      const expected = 'bar';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return correct string if value is a string expression', () => {
      const prop = extractProp('<div foo={"bar"} />');

      const expected = 'bar';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return correct integer if value is a integer expression', () => {
      const prop = extractProp('<div foo={1} />');

      const expected = 1;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should convert "true" to boolean type', () => {
      const prop = extractProp('<div foo="true" />');

      const expected = true;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should convert "false" to boolean type', () => {
      const prop = extractProp('<div foo="false" />');

      const expected = false;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('JSXElement', () => {
    it('should return correct representation of JSX element as a string', () => {
      const prop = extractProp('<div foo={<bar />} />');

      const expected = '<bar />';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Identifier', () => {
    it('should return string representation of variable identifier', () => {
      const prop = extractProp('<div foo={bar} />');

      const expected = 'bar';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return undefined when identifier is literally `undefined`', () => {
      const prop = extractProp('<div foo={undefined} />');

      const expected = undefined;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return String object when using a reserved JavaScript object', () => {
      const prop = extractProp('<div foo={String} />');

      const expected = String;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return Array object when using a reserved JavaScript object', () => {
      const prop = extractProp('<div foo={Array} />');

      const expected = Array;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return Date object when using a reserved JavaScript object', () => {
      const prop = extractProp('<div foo={Date} />');

      const expected = Date;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return Infinity object when using a reserved JavaScript object', () => {
      const prop = extractProp('<div foo={Infinity} />');

      const expected = Infinity;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return Math object when using a reserved JavaScript object', () => {
      const prop = extractProp('<div foo={Math} />');

      const expected = Math;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return Number object when using a reserved JavaScript object', () => {
      const prop = extractProp('<div foo={Number} />');

      const expected = Number;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return Object object when using a reserved JavaScript object', () => {
      const prop = extractProp('<div foo={Object} />');

      const expected = Object;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Template literal', () => {
    it('should return template literal with vars wrapped in curly braces', () => {
      const prop = extractProp('<div foo={`bar ${baz}`} />');

      const expected = 'bar {baz}';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return string "undefined" for expressions that evaluate to undefined', () => {
      const prop = extractProp('<div foo={`bar ${undefined}`} />');

      const expected = 'bar undefined';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return template literal with expression type wrapped in curly braces', () => {
      const prop = extractProp('<div foo={`bar ${baz()}`} />');

      const expected = 'bar {CallExpression}';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should ignore non-expressions in the template literal', () => {
      const prop = extractProp('<div foo={`bar ${<baz />}`} />');

      const expected = 'bar ';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Tagged Template literal', () => {
    it('should return template literal with vars wrapped in curly braces', () => {
      const prop = extractProp('<div foo={noop`bar ${baz}`} />');

      const expected = 'bar {baz}';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return string "undefined" for expressions that evaluate to undefined', () => {
      const prop = extractProp('<div foo={noop`bar ${undefined}`} />');

      const expected = 'bar undefined';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return template literal with expression type wrapped in curly braces', () => {
      const prop = extractProp('<div foo={noop`bar ${baz()}`} />');

      const expected = 'bar {CallExpression}';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should ignore non-expressions in the template literal', () => {
      const prop = extractProp('<div foo={noop`bar ${<baz />}`} />');

      const expected = 'bar ';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Arrow function expression', () => {
    it('should return a function', () => {
      const prop = extractProp('<div foo={ () => { return "bar"; }} />');

      const expected = 'function';
      const actual = getPropValue(prop);

      assert.equal(expected, typeof actual);

      // For code coverage ¯\_(ツ)_/¯
      actual();
    });
    it('should handle ArrowFunctionExpression as conditional consequent', () => {
      const prop = extractProp('<div foo={ (true) ? () => null : () => ({})} />');

      const expected = 'function';
      const actual = getPropValue(prop);

      assert.equal(expected, typeof actual);

      // For code coverage ¯\_(ツ)_/¯
      actual();
    });
  });

  describe('Function expression', () => {
    it('should return a function', () => {
      const prop = extractProp('<div foo={ function() { return "bar"; } } />');

      const expected = 'function';
      const actual = getPropValue(prop);

      assert.equal(expected, typeof actual);

      // For code coverage ¯\_(ツ)_/¯
      actual();
    });
  });

  describe('Logical expression', () => {
    it('should correctly infer result of && logical expression based on derived values', () => {
      const prop = extractProp('<div foo={bar && baz} />');

      const expected = 'baz';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return undefined when evaluating `undefined && undefined` ', () => {
      const prop = extractProp('<div foo={undefined && undefined} />');

      const expected = undefined;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should correctly infer result of || logical expression based on derived values', () => {
      const prop = extractProp('<div foo={bar || baz} />');

      const expected = 'bar';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should correctly infer result of || logical expression based on derived values', () => {
      const prop = extractProp('<div foo={undefined || baz} />');

      const expected = 'baz';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return undefined when evaluating `undefined || undefined` ', () => {
      const prop = extractProp('<div foo={undefined || undefined} />');

      const expected = undefined;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Member expression', () => {
    it('should return string representation of form `object.property`', () => {
      const prop = extractProp('<div foo={bar.baz} />');

      const expected = 'bar.baz';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should evaluate to a correct representation of member expression with a nullable member', () => {
      const prop = extractProp('<div foo={bar?.baz} />');

      const expected = 'bar?.baz';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Call expression', () => {
    it('should return string representation of callee', () => {
      const prop = extractProp('<div foo={bar()} />');

      const expected = 'bar()';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return string representation of callee', () => {
      const prop = extractProp('<div foo={bar.call()} />');

      const expected = 'bar.call()';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Unary expression', () => {
    it('should correctly evaluate an expression that prefixes with -', () => {
      const prop = extractProp('<div foo={-bar} />');

      // -"bar" => NaN
      const expected = true;
      const actual = Number.isNaN(getPropValue(prop));

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with -', () => {
      const prop = extractProp('<div foo={-42} />');

      const expected = -42;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with +', () => {
      const prop = extractProp('<div foo={+bar} />');

      // +"bar" => NaN
      const expected = true;
      const actual = Number.isNaN(getPropValue(prop));

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with +', () => {
      const prop = extractProp('<div foo={+42} />');

      const expected = 42;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with !', () => {
      const prop = extractProp('<div foo={!bar} />');

      const expected = false; // !"bar" === false
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with ~', () => {
      const prop = extractProp('<div foo={~bar} />');

      const expected = -1; // ~"bar" === -1
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return true when evaluating `delete foo`', () => {
      const prop = extractProp('<div foo={delete x} />');

      const expected = true;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should return undefined when evaluating `void foo`', () => {
      const prop = extractProp('<div foo={void x} />');

      const expected = undefined;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    // TODO: We should fix this to check to see if we can evaluate it.
    it('should return undefined when evaluating `typeof foo`', () => {
      const prop = extractProp('<div foo={typeof x} />');

      const expected = undefined;
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Update expression', () => {
    it('should correctly evaluate an expression that prefixes with ++', () => {
      const prop = extractProp('<div foo={++bar} />');

      // ++"bar" => NaN
      const expected = true;
      const actual = Number.isNaN(getPropValue(prop));

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that prefixes with --', () => {
      const prop = extractProp('<div foo={--bar} />');

      const expected = true;
      const actual = Number.isNaN(getPropValue(prop));

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that suffixes with ++', () => {
      const prop = extractProp('<div foo={bar++} />');

      // "bar"++ => NaN
      const expected = true;
      const actual = Number.isNaN(getPropValue(prop));

      assert.equal(actual, expected);
    });

    it('should correctly evaluate an expression that suffixes with --', () => {
      const prop = extractProp('<div foo={bar--} />');

      const expected = true;
      const actual = Number.isNaN(getPropValue(prop));

      assert.equal(actual, expected);
    });
  });

  describe('This expression', () => {
    it('should return string value `this`', () => {
      const prop = extractProp('<div foo={this} />');

      const expected = 'this';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Conditional expression', () => {
    it('should evaluate the conditional based on the derived values correctly', () => {
      const prop = extractProp('<div foo={bar ? baz : bam} />');

      const expected = 'baz';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should evaluate the conditional based on the derived values correctly', () => {
      const prop = extractProp('<div foo={undefined ? baz : bam} />');

      const expected = 'bam';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });

    it('should evaluate the conditional based on the derived values correctly', () => {
      const prop = extractProp('<div foo={(1 > 2) ? baz : bam} />');

      const expected = 'bam';
      const actual = getPropValue(prop);

      assert.equal(actual, expected);
    });
  });

  describe('Binary expression', () => {
    it('should evaluate the `==` ribute": {
      "pass": {
        "singular": "엘리먼트가 전역 ARIA 어트리뷰트를 가지고 있습니다: ${data.values}",
        "plural": "엘리먼트가 전역 ARIA 어트리뷰트들을 가지고 있습니다: ${data.values}"
      },
      "fail": "엘리먼트가 전역 ARIA 어트리뷰트를 가지고 있지 않습니다."
    },
    "has-widget-role": {
      "pass": "엘리먼트가 위젯 역할(role)을 가지고 있습니다.",
      "fail": "엘리먼트가 위젯 역할(role)을 가지고 있지 않습니다."
    },
    "invalidrole": {
      "pass": "ARIA 역할(role)이 유효합니다.",
      "fail": {
        "singular": "역할(role)은 반드시 유효한 ARIA 역할(role)들 중 하나여야 합니다: ${data.values}",
        "plural": "역할(role)들은 반드시 유효한 ARIA 역할(role)들 중 하나여야 합니다: ${data.values}"
      }
    },
    "is-element-focusable": {
      "pass": "엘리먼트가 초점을 얻을 수 있습니다(focusable).",
      "fail": "엘리먼트가 초점을 얻을 수 없습니다(not focusable)."
    },
    "no-implicit-explicit-label": {
      "pass": "<label>과 접근 가능한 이름이 일치합니다.",
      "incomplete": "<label>이 ARIA ${data} 필드의 이름의 일부일 필요가 없는지 확인하세요."
    },
    "unsupportedrole": {
      "pass": "ARIA 역할(role)이 지원됩니다.",
      "fail": "사용된 역할(role)이 스크린리더와 보조기술에서 널리 지원되지 않습니다: ${data.values}"
    },
    "valid-scrollable-semantics": {
      "pass": "엘리먼트가 초점 순서(focus order)의 엘리먼트에 유효한 의미론을 가집니다.",
      "fail": "엘리먼트가 초점 순서(focus order)의 엘리먼트에 유효하지 않은 의미론을 가집니다."
    },
    "color-contrast-enhanced": {
      "pass": "엘리먼트가 ${data.contrastRatio}의 충분한 명도 대비를 가집니다.",
      "fail": {
        "default": "엘리먼트가 ${data.contrastRatio} (전경색: ${data.fgColor}, 배경색: ${data.bgColor}, 글꼴 크기: ${data.fontSize}, 글꼴 두께: ${data.fontWeight})의 불충분한 명도 대비를 가집니다. 기대 명암비: ${data.expectedContrastRatio}",
        "fgOnShadowColor": "엘리먼트가 전경색과 그림자 색상 (전경색: ${data.fgColor}, 텍스트 그림자 색상: ${data.shadowColor}, 글꼴 크기: ${data.fontSize}, 글꼴 두께: ${data.fontWeight}) 사이에 ${data.contrastRatio}의 불충분한 명도 대비를 가집니다. 기대 명암비: ${data.expectedContrastRatio}",
        "shadowOnBgColor": "엘리먼트가 그림자 색상과 배경색 (텍스트 그림자 색상: ${data.shadowColor}, 배경색: ${data.bgColor}, 글꼴 크기: ${data.fontSize}, 글꼴 두께: ${data.fontWeight}) 사이에 ${data.contrastRatio}의 불충분한 명도 대비를 가집니다. 기대 명암비: ${data.expectedContrastRatio}"
      },
      "incomplete": {
        "default": "명암비를 확인할 수 없습니다.",
        "bgImage": "배경 이미지로 인해 엘리먼트의 배경색이 확인될 수 없습니다.",
        "bgGradient": "배경 그라데이션으로 인해 엘리먼트의 배경색이 확인될 수 없습니다.",
        "imgNode": "엘리먼트가 이미지 노드를 포함하기 때문에 엘리먼트의 배경색이 확인될 수 없습니다.",
        "bgOverlap": "다른 엘리먼트로 겹쳐 있기 때문에 엘리먼트의 배경색이 확인될 수 없습니다.",
        "fgAlpha": "알파 투명도 때문에 엘리먼트의 전경색이 확인될 수 없습니다.",
        "elmPartiallyObscured": "다른 엘리먼트에 의해 부분적으로 가려 있기 때문에 배경색이 확인될 수 없습니다.",
        "elmPartiallyObscuring": "다른 엘리먼트에 의해 부분적으로 겹쳐 있기 때문에 배경색이 확인될 수 없습니다.",
        "outsideViewport": "엘리먼트가 뷰포트 밖에 있기 때문에 엘리먼트의 배경색이 확인될 수 없습니다.",
        "equalRatio": "엘리먼트가 배경색과 1:1의 명암비를 가집니다.",
        "shortTextContent": "엘리먼트 콘텐츠가 너무 짧아 실제 텍스트 콘텐츠인지 확인될 수 없습니다.",
        "nonBmp": "엘리먼트 콘텐츠가 비텍스트 문자만 포함합니다.",
        "pseudoContent": "가상 엘리먼트로 인해 엘리먼트의 배경색이 확인될 수 없습니다."
      }
    },
    "color-contrast": {
      "pass": "엘리먼트가 ${data.contrastRatio}의 충분한 명도 대비를 가집니다.",
      "fail": {
        "default": "엘리먼트가 ${data.contrastRatio} (전경색: ${data.fgColor}, 배경색: ${data.bgColor}, 글꼴 크기: ${data.fontSize}, 글꼴 두께: ${data.fontWeight})의 불충분한 명도 대비를 가집니다. 기대 명암비: ${data.expectedContrastRatio}",
        "fgOnShadowColor": "엘리먼트가 전경색과 그림자 색상 (전경색: ${data.fgColor}, 텍스트 그림자 색상: ${data.shadowColor}, 글꼴 크기: ${data.fontSize}, 글꼴 두께: ${data.fontWeight}) 사이에 ${data.contrastRatio}의 불충분한 명도 대비를 가집니다. 기대 명암비: ${data.expectedContrastRatio}",
        "shadowOnBgColor": "엘리먼트가 그림자 색상과 배경색 (텍스트 그림자 색상: ${data.shadowColor}, 배경색: ${data.bgColor}, 글꼴 크기: ${data.fontSize}, 글꼴 두께: ${data.fontWeight}) 사이에 ${data.contrastRatio}의 불충분한 명도 대비를 가집니다. 기대 명암비: ${data.expectedContrastRatio}"
      },
      "incomplete": {
        "default": "명암비를 확인할 수 없습니다.",
        "bgImage": "배경 이미지로 인해 엘리먼트의 배경색이 확인될 수 없습니다.",
        "bgGradient": "배경 그라데이션으로 인해 엘리먼트의 배경색이 확인될 수 없습니다.",
        "imgNode": "엘리먼트가 이미지 노드를 포함하기 때문에 엘리먼트의 배경색이 확인될 수 없습니다.",
        "bgOverlap": "다른 엘리먼트로 겹쳐 있기 때문에 엘리먼트의 배경색이 확인될 수 없습니다.",
        "fgAlpha": "알파 투명도 때문에 엘리먼트의 전경색이 확인될 수 없습니다.",
        "elmPartiallyObscured": "다른 엘리먼트에 의해 부분적으로 가려 있기 때문에 배경색이 확인될 수 없습니다.",
        "elmPartiallyObscuring": "다른 엘리먼트에 의해 부분적으로 겹쳐 있기 때문에 배경색이 확인될 수 없습니다.",
        "outsideViewport": "엘리먼트가 뷰포트 밖에 있기 때문에 엘리먼트의 배경색이 확인될 수 없습니다.",
        "equalRatio": "엘리먼트가 배경색과 1:1의 명암비를 가집니다.",
        "shortTextContent": "엘리먼트 콘텐츠가 너무 짧아 실제 텍스트 콘텐츠인지 확인될 수 없습니다.",
        "nonBmp": "엘리먼트 콘텐츠가 비텍스트 문자만 포함합니다.",
        "pseudoContent": "가상 엘리먼트로 인해 엘리먼트의 배경색이 확인될 수 없습니다."
      }
    },
    "link-in-text-block": {
      "pass": "링크가 색상 외 다른 방법으로 주변 텍스트와 구별 될 수 있습니다.",
      "fail": "링크가 색상 외 다른 방법으로 주변 텍스트와 구별 될 필요가 있습니다.",
      "incomplete": {
        "default": "명암비를 확인할 수 없습니다.",
        "bgContrast": "엘리먼트의 명암비가 확인될 수 없습니다. 뚜렷이 구별되는 hover/focus 스타일을 확인하세요.",
        "bgImage": "'배경 이미지로 인해 엘리먼트의 명암비가 확인될 수 없습니다.",
        "bgGradient": "배경 그라데이션으로 인해 엘리먼트의 명암비가 확인될 수 없습니다.",
        "imgNode": "엘리먼트가 이미지 노드를 포함하기 때문에 엘리먼트의 명암비가 확인될 수 없습니다.",
        "bgOverlap": "엘리먼트 겹침으로 인해 엘리먼트의 명암비가 확인될 수 없습니다."
      }
    },
    "autocomplete-appropriate": {
      "pass": "autocomplete 값이 적절한 엘리먼트에 있습니다",
      "fail": "autocomplete 값은 이 유형의 입력에는 적절하지 않습니다."
    },
    "autocomplete-valid": {
      "pass": "autocomplete 어트리뷰트가 올바르게 구성되었습니다.",
      "fail": "autocomplete 어트리뷰트가 올바르지 않게 구성되었습니다."
    },
    "accesskeys": {
      "pass": "accesskey 어트리뷰트 값이 고유합니다.",
      "fail": "문서에 동일한 accesskey를 가진 여러 엘리먼트가 있습니다."
    },
    "focusable-content": {
      "pass": "엘리먼트가 초점을 얻을 수 있는(focusable) 엘리먼트를 포함합니다.",
      "fail": "엘리먼트가 초점을 얻을 수 있는(focusable) 콘텐츠를 가져야 합니다."
    },
    "focusable-disabled": {
      "pass": "엘리먼트 안에 초점을 얻을 수 있는(focusable) 엘리먼트가 없습니다.",
      "fail": "초점을 얻을 수 있는(focusable) 콘텐츠는 비활성 되거나 DOM에서 제거되어야 합니다."
    },
    "focusable-element": {
      "pass": "엘리먼트가 초점을 얻을 수 있습니다(focusable).",
      "fail": "엘리먼트가 초점을 얻을 수 있어야(focusable) 합니다."
    },
    "focusable-modal-open": {
      "pass": "modal이 열려 있는 동안 초점을 얻을 수 있는(focusable) 엘리먼트가 없습니다.",
      "incomplete": "현재 상태에서 초점을 얻을 수 있는(focusable) 엘리먼트가 키보드로 초점을 얻을 수(tabbable) 없는지 확인하세요"
    },
    "focusable-no-name": {
      "pass": "엘리먼트가 탭 순서(tab order)에 없거나 접근 가능한 텍스트를 가지고 있습니다.",
      "fail": "엘리먼트가 탭 순서(tab order)에 있지만 접근 가능한 텍스트를 가지고 있지 않습니다.",
      "incomplete": "엘리먼트가 접근 가능한 이름을 가지고 있는지 확인할 수 없습니다."
    },
    "focusable-not-tabbable": {
      "pass": "엘리먼트 안에 초점을 얻을 수 있는(focusable) 엘리먼트가 없습니다.",
      "fail": "초점을 얻을 수 있는(focusable) 콘텐츠는 tabindex='-1'을 가지거나 DOM에서 제거되어야 합니다."
    },
    "frame-focusable-content": {
      "pass": "엘리먼트에 초점을 얻을 수 있는(focusable) 후손 항목이 없습니다.",
      "fail": "엘리먼트에 초점을 얻을 수 있는(focusable) 후손 항목이 있습니다.",
      "incomplete": "엘리먼트에 후손 항목이 있는지 확인할 수 없습니다."
    },
    "landmark-is-top-level": {
      "pass": "${data.role} 랜드마크가 최상위에 있습니다.",
      "fail": "${data.role} 랜드마크가 다른 랜드마크에 포함되어 있습니다."
    },
    "no-focusable-content": {
      "pass": "엘리먼트에 초점을 얻을 수 있는(focusable) 후손 항목이 없습니다.",
      "fail": {
        "default": "엘리먼트에 초점을 얻을 수 있는(focusable) 후손 항목이 있습니다.",
        "notHidden": "대화형 컨트롤 내부의 엘리먼트에 음수 tabindex를 사용하는 것은 ('aria-hidden=true'인 경우에도) 보조기술에서 엘리먼트가 초점을 얻는 것을 막지 않습니다."
      },
      "incomplete": "엘리먼트에 후손 항목이 있는지 확인할 수 없습니다."
    },
    "page-has-heading-one": {
      "pass": "페이지가 최소 한 개의 1 레벨 제목을 가지고 있습니다.",
      "fail": "페이지가 반드시 1 레벨 제목을 가져야 합니다."
    },
    "page-has-main": {
      "pass": "문서에 최소 하나의 main 랜드마크가 있습니다.",
      "fail": "문서에 main 랜드마크가 없습니다."
    },
    "page-no-duplicate-banner": {
      "pass": "문서가 banner 랜드마크를 하나를 초과하여 가지고 있지 않습니다.",
      "fail": "문서가 banner 랜드마크를 하나를 초과하여 가지고 있습니다."
    },
    "page-no-duplicate-contentinfo": {
      "pass": "문서가 contentinfo 랜드마크를 하나를 초과하여 가지고 있지 않습니다.",
      "fail": "문서가 contentinfo 랜드마크를 하나를 초과하여 가지고 있습니다."
    },
    "page-no-duplicate-main": {
      "pass": "문서가 main 랜드마크를 하나를 초과하여 가지고 있지 않습니다.",
      "fail": "문서가 main 랜드마크를 하나를 초과하여 가지고 있습니다."
    },
    "tabindex": {
      "pass": "엘리먼트가 0보다 큰 tabindex를 가지고 있지 않습니다.",
      "fail": "엘리먼트가 0보다 큰 tabindex를 가지고 있습니다."
    },
    "alt-space-value": {
      "pass": "엘리먼트가 유효한 alt 어트리뷰트 값을 가지고 있습니다.",
      "fail": "엘리먼트가 공백 문자만으로 구성 되는 alt 어트리뷰트를 가지고 있고, 이는 모든 스크린리더가 무시하지 않습니다."
    },
    "duplicate-img-label": {
      "pass": "엘리먼트가 <img> alt 텍스트에 기존 텍스트를 중복하지 않습니다.",
      "fail": "엘리먼트가 기존 텍스트와 중복되는 alt 텍스트를 가진 <img> 엘리먼트를 포함합니다."
    },
    "explicit-label": {
      "pass": "form 엘리먼트가 명시적인 <label>을 가지고 있습니다.",
      "fail": "form 엘리먼트에 명시적인 <label>이 없습니다.",
      "incomplete": "form 엘리먼트가 명시적인 <label>을 가지고 있는지 확인할 수 없습니다."
    },
    "help-same-as-label": {
      "pass": "도움말 텍스트(title이나 aria-describedby)가 레이블 텍스트를 중복하지 않습니다.",
      "fail": "도움말 텍스트(title이나 aria-describedby)가 레이블 텍스트와 동일합니다."
    },
    "hidden-explicit-label": {
      "pass": "form 엘리먼트가 눈에 보이는 명시적인 <label>을 가집니다.",
      "fail": "form 엘리먼트가 숨겨진 명시적인 <label>을 가집니다.",
      "incomplete": "form 엘리먼트가 숨겨진 명시적인 <label>을 가지는지 확인할 수 없습니다."
    },
    "implicit-label": {
      "pass": "form 엘리먼트가 암묵적인(감싸는) <label>을 가집니다.",
      "fail": "form 엘리먼트에 암묵적인(감싸는) <label>이 없습니다.",
      "incomplete": "form 엘리먼트가 암묵적인(감싸는) <label>을 가지는지 확인할 수 없습니다."
    },
    "label-content-name-mismatch": {
      "pass": "엘리먼트가 접근 가능한 이름의 일부로 눈에 보이는 텍스트를 포함하고 있습니다.",
      "fail": "엘리먼트 내부 텍스트가 접근 가능한 이름에 포함되어 있지 않습니다."
    },
    "multiple-label": {
      "pass": "form 필드가 여러 레이블 엘리먼트를 가지고 있지 않습니다.",
      "incomplete": "여러 레이블 엘리먼트는 보조기술에서 널리 지원되지 않습니다. 첫 번째 레이블이 모든 필요한 정보를 포함하는지 확인하세요."
    },
    "title-only": {
      "pass": "form 엘리먼트가 레이블을 위해 title 어트리뷰트만 단독으로 사용하지 않습니다.",
      "fail": "form 엘리먼트의 레이블을 생성하는데 title만 사용되었습니다."
    },
    "landmark-is-unique": {
      "pass": "랜드마크는 반드시 고유한 역할(role)이나 role/label/title 조합(즉, 접근 가능한 이름)을 가져야 합니다.",
      "fail": "랜드마크는 랜드마크를 구별할 수 있게 만들기 위해 반드시 고유한 aria-label, aria-labelledby 또는 title을 가져야 합니다."
    },
    "has-lang": {
      "pass": "<html> 엘리먼트에 lang 어트리뷰트가 있습니다.",
      "fail": {
        "noXHTML": "xml:lang 어트리뷰트는 HTML 페이지에 유효하지 않습니다, lang 어트리뷰트를 사용하세요.",
        "noLang": "<html> 어트리뷰트에 lang 어트리뷰트가 없습니다."
      }
    },
    "valid-lang": {
      "pass": "lang 어트리뷰트의 값이 유효한 언어 목록에 포함되어 있습니다.",
      "fail""use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

function isEmptyFunction(node) {
  if (!(0, _utils.isFunction)(node)) {
    return false;
  }

  return node.body.type === _experimentalUtils.AST_NODE_TYPES.BlockStatement && !node.body.body.length;
}

function createTodoFixer(node, fixer) {
  const testName = (0, _utils.getNodeName)(node).split('.').shift();
  return fixer.replaceText(node.callee, `${testName}.todo`);
}

const isTargetedTestCase = node => (0, _utils.isTestCaseCall)(node) && [_utils.TestCaseName.it, _utils.TestCaseName.test, 'it.skip', 'test.skip'].includes((0, _utils.getNodeName)(node));

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `test.todo`',
      recommended: false
    },
    messages: {
      emptyTest: 'Prefer todo test case over empty test case',
      unimplementedTest: 'Prefer todo test case over unimplemented test case'
    },
    fixable: 'code',
    schema: [],
    type: 'layout'
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        const [title, callback] = node.arguments;

        if (!title || !isTargetedTestCase(node) || !(0, _utils.isStringNode)(title)) {
          return;
        }

        if (callback && isEmptyFunction(callback)) {
          context.report({
            messageId: 'emptyTest',
            node,
            fix: fixer => [fixer.removeRange([title.range[1], callback.range[1]]), createTodoFixer(node, fixer)]
          });
        }

        if ((0, _utils.hasOnlyOneArgument)(node)) {
          context.report({
            messageId: 'unimplementedTest',
            node,
            fix: fixer => [createTodoFixer(node, fixer)]
          });
        }
      }

    };
  }

});

exports.default = _default;                                                ���C�� �� $҂�r��Ɖ�w��Oŋ":��6��_+*_��ވ ��<��SH�+L�Kb>���U�ܹl���Y��%� PS��E�-�ܡK�HZ4kŰ�Z���b���	]U�9�c��u |��ޜŚ�Q���N�C+u���u���pu��Ƈ��Wf�+�S�6��K�E���0:&�`�/X>��]��!���,�gx�ǒp�AA�TF�=Q3�GE1� ��DϲѢX�(��mմ��dKyD'>|K�(��y���?��A�Y�"�~�P����;�� 15@CP� ς�$��[[�!9`/�۠6��<[7ԧ�B49H����)�ة�m�}%�X�:���F�3h�L;���c�������\��1TT�r�ɳp�1F�:�Ċ� ����ĝ������?��E:3�?B� `��
{��5X�����t��2Ϟ�b�{�ob=�j
���������XX�)#�Z�_j���xp�uL�m���%|fQ%�u��Ş������o(��42�v�`5.vh�%�o�&�i�Б4Pի�P���9M�h5��H;Į�q�6����8kYi�1·��_���;^
��Ѐ-2�8��+:�:QQ}�*��
�1/�I+%�Q�x2mt��#��L|*+�-a�4����E�}	}�M�u�����S2AtD,'� O锸r������!�<�ƍ�/���%��/$���S�kP�L��"P��a�
+q4�7���rxu?��ue2;���\�تV�����! ����� �-|����UFR�$(�w�9�;��J�7-��9k����iB�8T���&��������\.�{P38r���1oH)���v�I��ɔV�	q�J{ ,�n`�l�
\ԟD�mܣW������|H�����A���ABIa���Ē�R/�l�񉻶
�D��hD&��o�?�P����9W��-]������+�D������o��k.�}$t8F�z�̴��Ԉݠ1�
h�b4X��e��-Xl1�Wp�4L,\�lQmὃX��Lr'��߫�y��f����)�V������kAl�P��B�Fh"0	q�I.�c8?�``�U��C(+�u�:�
�ڬ��� `%��<���e.+�)��j�5�ͽL­��+�;�� I]�~�𠩀��΢,�����l�����A0V~�����;��%K,��p�Y��Q�G�=�=Gmu���'ш���1��:_�(5ty^}��-�@._2���������k�ȳ�8�x���Xw��Q�co���i�Ε�Q<M�J�z��L�3ߗ?/��_���� "������	Q"t�(���k���?^��3�+w�Ƒ��~�ՠ����/�<��f��fp;�4!���)���*	-����I��J4U4�8�+Z��C�R̬�A�B��
h�P���͞b��C���/E,&��V�/[��wI,x|��Yd�ߵ�p��#����a8,��8����*��		&S�q\%N�"a����\F"�P�"�1���]��{��۞�/� ��e1�<��Ѭ�ϩ�������c���Ua6(���RpSȽkR?w��YHG\Y�`�LV��Z�L�����7!W����΂XΩ��v�� &��c�j^�Z;�a�4���kI��뾶��X������<;�U�G�K��D��㒅l���*4�Um}?cK�H����D�0t�UN�s�$;�_Ac=��v%�Y��h}���[��r�����ԁ<\��b-:i �/�a�+Ǆ��b �F��B�CE���.Y���l8\�o��r7��\A\��K�
¨%&�<�xo����4B�5�L�`�
b��;�c�*en�`�J"�������GW7��&�
��n}>��ċ�%TsJh�X}���}y���Z��58�:c��f�ݰ|���xQ�u�Ghl 4	2C�F�Y������3����3	hh���C��R���!� g�yAY}
��5����q����<n�������)�z�)��=�\�qϿsw�|#-M����`9{z��r�w�u�U�����UfA��r�K�2��Y���~c�Jca��y������	v�B��ΫC߀��ǐ~~�u�s��1�Gv��7�wp���j&�j͌��r!Ѡ�׍�±+E���[RS0��Wc�������1&�C�ӕ���~X,_�|z��d�\e�+G>N�Hy9=��{�������\�}EKu*��!�R��Zm�)���άn�AN1�M����>��$5^24}�l��9S���0��q$K�V�zn��V��y{w�.̟V5r������>�����`,�t�5�?eL��9�Y�H�w~J��93�M�w�5�^���U�T_���o���%�.���g|����/�5h�}��1b�Ģ���8��A+7ռq���_��P��ۨh��g��YyC��L�O΀?j*�����~�
j=��� ���&f8T�}o ^��B�)�I6w���r���b_�vb����d�=�Ӡ߽��q��0`�Ť���XϟG�qn�X@��,�E�Y����,6��,K�Ŧ�7,�$^q��P�p�)aԆR�I��i����"k�
��@BǓ�P�5�"CKT���������^^����J��a\0�5 ����vU���|�[�37�T�{�FJ��]5���u��l���f��1�	f5���a��#t�<vKB�\c��e��.�K��5c������ ���/�h�&��l�шՎ�gY��
vN�>�O��ȱ(�=�a�m�~��@��A'2��W�\�

a�jTس֓=ö^�M8�c$V?�����D�f���`v|�Lp�1��Ȯ2oո��������B 
�IMiv��:��R}�un6���X���r�N���T0�=�=I/���@�v��?=r�!9 0����@���"�UȶA�ݵIU=�ٹﾀM�ަۋ>9��<�uyO��Hq \K�$ ���Ia�L��"-��V�q%��D���6_�����ƀ�7^��I���7i΀ߑ[C��9�������� �N�����Oc�@U��.�:�C��z�8�g5��W��Z���-��\�tI��u��%�8�k�(p��h���h�
�5���s���qe�[8��0]��y pQj@�a�2�,jU3~*���/E��%)ru�o�c���HDC��JdC$���e��<���[�%p/�T�68���TВ�T7'�=Eq~�B�ӀP>�9=�|d��w�\�=�穎�^�@�f�uf��qޠ��^l���X-�ׇk����)Y3���a��v�c*�#� �+@`��\9�
�F!�;�_7Ig0;�ñ��;!8ed!��c�|� @�P�A�IW�B��h]&�>�ǜ�,��D?�isi���x���ݫq�n��Z��8��3�<����P�����`� P���t�_4ohB��P�x��.�`4���vחeVP��5'�<�cp��T��:t��cWT�-�m�Zۥ������Ȓ�I�4"%E�k��y��%�`0\ �� �դE�AAαv�C8�Рe�+��xFTDB/@S�:�´�y��0��htb�_Z��6�!S(��j ���`7}��[��@��4��gl�J�����a{L�םm�9
އ���@#87'�����ܸB�$�������G~;"JˑF�IxS_]���a֮"s�����k�7��p
�X �!JTQ�%>�x��Q`�u}��ٞY�(M�;�2��J���M`vd�/��Y�^�vD�/t�H ?��i�y��үST���#�&�ΩN�Y6�=Oz�`َG��>�C9&�5S�f����n�l�uv;��rŅ�A�#s~R3���X��?�'��r�T��O=����U���D20%�E�JH���l�ͯ<�ԙF*J��ow6&S��AiX�`��X�X�����E��$  +4M)+v��j�����sbb�8��λ'�e�����w��F`���j�_E�g�8����w>�����z�Lo H�ߞx����(��Ö�B��đ��
ᅦ��<�ur_Gb��뤦����|.+xp��=I�#��;B2ii�n
6�o�@�c�?0ރݷk'��#���ۇ8v�#�����4M���%�`{�x'��s^Zm���I|K4�gs�wuQ�\Q��?�R��v�giж�,�*5�B��-�+�:�v����9�QJ%�I�3��qF�O	3Ԝ	us�!��j)�Za|������l� �ؿ%V�54���u�}�͵GA�R�[6n.<k,m�@E�6U�6.B�r��섀��E$\��t��A��K$��H���ԕ�ӊ˳+đZ�a����{�"��]4�<��6�eTQ
\�F%ƌjTjѸfv���8]��+_z
�]~�V>x���B���-�3WhF����دX��`^ێ�_?'��gj��ebpl�I�-1"����� �K�4�D�A��A׋N�/�&U[锷:BǪ��a��T���"���M��yX׫<�`@GK� J�)$�XG�5�RA��k�Ӷ�Y`�m:L━�&��0���8��rg��&o�������&�>�vB�{��@j�H�(���
A�׽��^\�Eh~~c�y��1�~�<8`��x�m?�4��u5,rՄg%�N2R�t?�}��"�٣���VA]'���`5�:u'4�$#�jh�Z��
�yӗQ�ˇRT4$��+�F�
�P�2ۀ&���D�������0��O�tZ���Y{?+6#1u�D���W��:�Ԛ
�Ԕ��x�zn��Z&΃��_��|��"M|��e�����:zn����?���BC�-FZ�L�ֶ��ˉ�.×�g��H,�5ɚ��W���� *܏�c6D>]đ�U��
��a����J  �(7���絬�T�)��6���l�P���ƹ��D�9�q'�����
�uٙG`���HQ���?��m2#�������Ԅ�e�����j�P�yv��!�xjX؇ikr���(2QV�*'X���,Z�Pz3�t��x��~�˄�3�w��$��v@9�Zi�h��D~�N�-�`YGY\8~����P$�k��m�,<�]�Hb��<"���KE�C@I����I�ڐ�vR�S{�2;dd�<
3�t�%�_t�1�S8�O�%��:`$C�S`b��E7���Viue�j�a�ed!G�~Xo_'�ic*³6�spQ�
wґ�V�s	�����iݗ"�(�i�#
$����E�A��f����"��Q1�c�~���0��/j�h������%!��_��9]�+5`���F��&���(��?B� `&��ŵ|�Fi�t(S��|�:*�du�"ܬ`J(/��=B�B�r��&s�?����]�ۈՆ
]�XL�U�_ Ӯ����
5ErJZR��Q��㋹o�h���C8����<����]O�V��f����x����%��QNpt�@ @P��8�	A�iw�ym:\�|f�ZUȜ'�6���q]�3$$j������i�o�M~iv�����@.a�g�~��Ktth���[�@�]��[9�j��eE:Q��������"r4dH���ғ�.��6��;�
]78:�Ԇbt�R�F��eMJ�]-P[u���0-+��lh�^v��Lf��|������M0ie���m,W��� X@ovqM �!q�@���T^G�p��|�����f-�!�@�ԃ���v>u��ͼj� Ƶr!�F����ۊ��DV�Ό4��?c`�Kvq�W��H���d��Xz�_�W�!�p_�e;K�w`U�����@:����<�-�
�:�y&�tt�߁.���  Ȇ#J�y4B:��)���9��3�=$�"~p�g5�r���9��`{�nGT&P;�R�T9�L�9������{j�9Cb� *m+/�2IK�&UO�ޗ���Z�h�����#��E�ڡ���3��4�}lhX���?2~��K?�S����>q�;�6�[�������N���'�U^�)"��G��)M��#
Y��i:3&�8ƺ7
i^�!,�
�-���XK�������*��ٕ1�p�\h��v�U�$���8�$�;k�7Wp`�Ԛj���ƇR��A)W�T�߸oԬ��}C�ځ=���r��w�VU����y�7��c��%��?�M�-�1֙nU�U�eC!7~np]�L7�78X?��v+�zM�3S��E-�9ʛ�ۡ*1�Iq`��@ ���!��9/a��d�2��7�vU�
�zfi.��vu� ��B�u��'R�$y��U1o�r
)�����.�v
ۗs�^k`��q��^L�Q�RP	�	�(�y<L��m�j�,����&�!���N��������~�/�Ĺ��A����q�}�W�]K��Q��-���V]��)���32,촑wcS\�v{?vp� ��γAL��x�9>t0&�c�("����!�BeS`#���CF�\�ݜ	rMa�Z��s)cǄ{�Z�?�3;�� ���~\v�!� hU������E{��oܠR'�=C��;p����(��/wAtzI�׀gҭǅ��H������ٗ(J���}�tTK��2[�w��G��)�CD_7�Hމ@~q�tϐ�*a��qx��BJ�����$�ejQ�%�	��#�����{1�����!Y���Fd�g�a�UF�\��\�)�͆ �8���5��-��W��$؎��ܘ4&!$D'��j��tcG/gɂ�"����E>��S>
l$%�6�RV( �l���ג1R��9�@�o����k�3��B�^�U�F�M��Xu�O��U1�\ti��Q4��\;�G��Hdf���kh��}��=ܢ���)��\�&Ɔ" ?ӫ�2+�l|)O+m�*�|8S��ްʘE��
��X���B�N|�����.����cCV����F��ꂹ�ٔ����`�!�����̪(( %�� ?��ВK���C���x���cp!l��Dh� �1'���A�����YYT"�sS
���k����ә����������ĪaVs�j��X
?X���Ojv�\E���"�tS�D��6~Ώb��5�f�%��ج�w�\�����p�|�?�v��nU�n)�P�|SWb?�L:-�4�}����{+YL�y]T�W�����G�C��Ȩ��  ��b�%�Wi�eT-��|<,´|K��ivpG���
  if (Array.isArray(rules)) {
    return rules;
  }

  if (rules === false) {
    return ['none'];
  }

  return undefined === rules
    ? ['local']
    : rules.split(',');
}

module.exports = inlineOptionsFrom;
                                                                                                                                                                                                                                                                        �lo�l"�D��7� �<_��9C<q��m�����Y
]'gZ'��c�&A�}��q�L�O��!^��X��;I�HU����_Vqwb7o=�VR��v���G݆��#����.:����>�\�c�z��>�V�ʭ����n�Τ;������?W���Hc8�_�c��� ����Z6��xF6.?��%d�,�F@)JX�8���<�h��`��Kb
��e��m�=�H�[�K����Bj~w�T �N�<bRLa�����F�7���L�~��
6d0�O�8�)�Eޗf��o���r�Y��=�1�~�UC]�7�6Y|�U��Z�Iz���@��������ބF�F�o�U�Y�:��1�>�$���8�o�#�_��k^��5_Z��;�1���	�s>M�U���^��s�zv'���3� @;�>+a7:M��/���MH#�{hX��:_4��q
���E���Y{���8|�>�c�a�ː��c�ư�+4����Go����>#��Y8�A'U��⮕}K�m<F'2@{~GsB�Ht��t�
(a}��l�i\�ŝ��c�q����B�KB�"����O�;9�ޖ�_���Pr�"cy���e2����%����#^hc�'b0#r�(k1p�xc/����[	��dM���P��,�5i�m��fF�k�(�[�q_Z?�2u���_st�;���\�]��$��`p6�a��z�������v���t�]j��L�'F�2ػ��[W���ч��׻����M��a&��M�>�T����n@�J{�::�D��Hb��@(�����/�.�X��A�&��֯ǃ>c�q�GFw,i��dhYŐ��!�� ���LWUFd,)5KPȍ�v�)�9�L����v#�A� R���-��X���y7���<̶2�;uV�խ�(Z�ּ�n�ƸZ/UAQ���z�����M����,1�-�G>r^D1sG5���e*�x6"�D8� �!:o�|�sM�K4Ll���$#��G�3K��D�v��y�%A�l�Db,��� �s��9\�=���L@)�,D�*AQ6PG葢qv��	�(,��E|W�F�$�v8����v=
��Q�"I8T��"
�$�=
�IG�S>�l����  ������ ?��GE$n��1̠�zQ.�{�N��-^W�J�/�Ҍ�<tؠ9f����E2�BÏ�,C�|��F Ռg�Ցڕ'M�9 ((C��0��PE�|�NY��@�p���9TOxI�Ep�H����r�Gݕm�����)������*�� jV��B2X[�@ r�j~Z�[��n��,�E�:���l孽���2�n�B�}�Rc�N�H�]�¸`��T��)�����Z����հ��,xY��Ϋ�夨��g�/�)y��G��&�#���"�>�����e����v�� F�ދ���Z�T��Y��f�)*� �������ڶ J�Z]�@p�	�l 4)�եJȤ���俊�|>���g)2�:����s��8���we�z�WL
[������,LN! 9l"--}���YE;7ˣu3��7�>P�����N��x��T�Q�:����,�v�!=� ��TFN0���^q��Qw�Ÿ��k���}��RIx�}r���1"J��m?�|�5� (��"���*�:��\?��>rÄ���?娛L�����Ã8��+�����#�~�&Ka���ח��3�YzW��{������H ���2�N������Ă�G� g
���ztjާA>��-:�Gxc�5����~�_��Q��v�>�d�X�S=T<@ ����x�1���MPigI9�D�-���M�燇�V�=�Xq����РԹD��
*/
A�IZk!yv��LC�M��0�ԋo��r^~��Oc��ϔr���,X��{��輻a�}�U$c马�9���܂�z��*gm��^�ݙz����X�wK�bx���I�U����Q��\yو�ա�l>��\�~y�����J}Gk�������ڞ��dHG��/�f7�#����yJ�%;����7���af�O����"뵤���!�8Zp3�&�sܐ�K������'zw���ʯ=#_��*[�
q�.�{!@ś����V+����@���R�c�����\��"2bM&9��
��FA�ȧĒ�.�.���S8`����!吘�@�CK��aT�����]���M)|:AN1��t�p�B��]r�ɧ�l����F���Gg7�-���.��݅�?BBh�����a�m�LhI#��;��R悹Q��gU~��Qrx�~�D�Ì0�"E��c2�qϫд���/�i�w\� ��0ݎ h�l�SՁ;�1�x�i,����M�uè�U6�r���	C�T"۾/��/7^T����g=2�j!�-�0�44Xj�����!%rHq�&�pe�*`����gYwg:g���$`L)�ծ���?Jt;y\k⮚�F^�Hk���W������;���7������:���r����'�ZH**RP_\�b���|o�`�E��&Tp��%!���R���WOk��$�z��h$��2�
�3|Ʀ7ô�!�hnh>⌃�V�J=Jw����Q�+u�w�L����� Uȿ>BQ�}fG�#${���:�_,q��w���'J�@����u �]:�s]F�Q����F�d����u.�N+�bp�G3�ű[�讥�;�a|��wE��a��ǧڗ����c�Q)P4��@��r��g.(� FP%<C�$��iJ���'b��0�=�=�<"Z[&0�<)��
���OA�#�	����=/5��t!5�)g�I�]<����1gD�N�\O�Z��)�{�?�$�U7�4�!�Km��4:�u�E��o�����ja7���+�����?�T%�ޭ	�g) $�Q*U4s;$��	��Ѭ۱���� 1#	n�4V�8����m\'5 �x�Aof�Q�N�����QTIт��i!A�
s-z����ä����zɊ/Ǚ���Vm�H�>Ys'��*  5:)�����Af[d�܉ѐ�[u��~�
j7�wh�D��v.	��/n���X�7q�:}��9ѩL��$+�0�{r��|��a
�z���T"㣱B,U� 5(�6V�RKJ�%C�؟���x����B�����������M��ya���΋2��JrW2@M�|�4� ��[q]��Sz��`��M���hAz���xU������&]����,e@�]�U�R�=��E�3Si�  �L�nHnlH9�Cl��y�N?o=�1%%u�1$ii��/����0��$��+1D�1����}��g������`j�!C�!ާ��G(A2��	�Sю�45���ʢ�L��(�
��HK����.|%�Ce![��/JaZ�s�^��#1Ȗ�N,$���u������DF�m��/ĎK4���-�M�(�� �į�+H8�F����9iG_���\�:��N�vOYߖǋ���EU����6�V:Ӏq�"��k�M���*uB�_&�_��Tƍ�/m���M������z�^�A���� �SMv��5�[��Fv��>��cB�;���0���w��� �)I�I��8I��a��\���׌�r'ۺ���a�"`ز

�rV\�#��捪6 ��8G�NЎ<���Hz����%�;@��Z����~H=+���6�+ T@�r�H\�F�l��$\jQE�<E��tYO�ɭ9&�h����% �uBr,����ǒ�U��X-䲹s�#'��ސ����Q���l�H�cB5�_Zǫ��� ��8Ի=��O���q-��9�4�?3T��,�ϘvtqP� (�>�"kt���~sF�rk��5�e:��dzƔ��ŴG:��D��l�LiݬIR�D�n���<��_
ci�>�ٔt����;xd���IM�o8�FN��Y�|��:����>��G�<7yuP�`��|�>��7}#��x�{Kz;�������s��>zn�x!&�d�e�}������_���OWzjS����@bY�o+;��=G=�qo
x�EE���r�&���0e]h�{�!�1�$ 0�� !_X���b"*Eէ���P"��+q8A�
�'�~@c��]Ø�&X�؁��5�. ���ɋ+ �uE�QY	0t0`�Lė�aŴ��-��
�X��0F��47�"i���I�>Me��Գ㮹$�p4"HVp�Ӣ�9p�븯'��knf��x��r�Ĺ?���hA��.?����6)�H���*U����Y^�5��a�6��==}��ަ䛦��fA/�B	�ZN9T���Π��r���c��#����ȶ����"�x�G�mi��-.�:F��迹B��MW�&ĮQ
ޯ��n���΀ ɜ��ŉ%��A�m���������z4)�҆�J	��S�DNF@�KyA*T�1����"x��^�]s-7�X��H�ƥ�=��Dh��]˕���2Ģ6# ��]c$�P-Rr^���<�Kˎe�ӻ��d�cF�0�vu��T�aeb�)#k�
Ӎ����[J1B�9PV�m߲�a�Ǻ����6J=Ra�Պ��J��R	�^���98-]�5?{ȩ�>.���?�m�9��=��C40U9d��A�2��u�!�����2�� � Q�<�$6�պ��m
hS�8lB���F2�i/���OtP�R���a$�M�՟
X^��XQ�q��ΡY��d^�MdPt�����o"�Ȟ"X
QQhE'�k0�s���g,��;��8�W~F��?����t�yî���RM��x]X�U�"!04��=�Ma�QN�.�� =��P�³2,t�Z�wi�e�]��bϡ���u9;�|�b~��TX��r�qǷ�r%��=��V���i�<jn2�u��dR]���2'(�� D���T����xG^�,��4��i?���٫���?{*S|��77X]�/>2e��w:����q�T��i�
|�Ҳ�И,FB��ӆ=P�xk�xҧ������b����E!0_������u�$�}��T�U��w��\��Tk�w���\��.H�t^`��QŰ�������4�đ)�%#y(�t �b���W��t���w�̼�V^��SҬ���+�+���`����}i�^}�
��E"��=�u�G�p�S��f�]?.��>\��+
�`�ũc�̕'+�(��wtG̟���n��һM7��̕�gΩXk��O�w��Sg�N�E� ���O �[!FLg:X_<nԎ�s�ʭM��x��ીB��&�G�	Cf��P���ɉ���:�&ʑw;�J?U��3��<��F]���©%Ք7�	
i��M%�A}�f"]���d^=�	P�,c1OβqW��߳(#������� ��~���Y���!��L����bΒ��66Ӻ���D��P�*|c}AI0�}���g@!���-�9�*��m�X豃tT�5��ު	Q��4�
�(�E��:J2;74�&.&��NV�%[��Ǆ���B�y�Iǀ%��P���W�JKI$�A;2�!`��8G��*^�S{�&3�bC�K���F�Pmn

HO�a�8�s��0ul&��oZ����p��}�# ���ҟ�6���X�Z]B �o3��%��S�_�>�C Y�[��
�+g������ē@��ol� Ghf��b��.�|J���q۪ nc� �� ƺ��M3���_�:	&�ZDY6xL�[߿#�������A�EC>�B6��~���}��1B�����y1�rj�񴹏:�^��.v��	��y�fQ:X���DC:�
�Z�%w���qA�9B�>-��8�\VjC)`�p(\^t��%Jw{�_@aIUa�C�����&#�h:E� 압�j.L�a}����
�;�HF6cL�9�9�,qc�H��l�U��g�`���.�z9M~�#���SP���I����؊�?^������aC��d������c���Q�=(�g��r�� @�����(�|ڦo*��R�����ؘ�TRE�<�j	>]p�i�r���̬��o�w�֪W:>��fDrR���=\|%�֡����ʕPE(�b�ԝj�(\��uOXb�4�t���|����0��� д�΂�o��s�Q��7��<�zi��{<�]�4�AIi�����
�Q�f�7��w_�[�N+M�� �AdYy8~�Q'�ASȋ츱��4tD���x�8J��3��8�(�����|������
�"�G�y��'0�}��<1���T��N`x�#��)���ix���,XRYǝ�}��CRJ��N1PV�J��NL�������ˌ�I�6�^�Fڑ� c�݃��Ƥ���PMgbW�f��Db��b�u��x
}]��D,�ُ�o3&�Q�|�k���� �(+I*=������ ��Ԃ!K��K���ь3�)ڢ	[[j0�G�Y��� h�4h�㗟�G� R����t�mF��w��F�Dj#G�i�Q�ڰ�6�e���_�.A¡�9�>���H�I�B�=�I:x��x��i�&�p���F��V�}�.2@)(�����5]���G��*�9���Ì�#m!z��m1�K����>D�ksJĢ1H,��/����E-��}�)B��'f~�d�,�`�yu}UU����r�1V�m[G�	{��ãc�% �/
,9Y�%�Y�g��}�ײ��_t�Ϧ����M79�K�c/���pb�1�Ig�3+*o?��TqQ�Ùy��_�:/`^q��
��A���_�C7�J�٤�IYХ�Bt`U��x���p9�.�g4�< xU8PLz=��O[C��EvE���Jo`T����&�D�[��+���S=rwɛ'!�QFӈ�ŕH������7�s�ƞ$Ym�mj�?Be�t�u;8�&ՠ[���df���$Vw��2�$���U�MB����An^�C�A<���o�'�h(��>F$4�,T��Ҟ����Z0Vߒ�Uy���:�D�7{y"W�y�`&�L�K�>�:ؕ�C[��K��ê�w��$X�༗��]�]kh8�x*<v�����q�
�?P!�N�]L����^K�V�>�NO��k���+K�+J�b�B-�}��^+�'���ǧ[��6
�
�����/<�Ŝ��n3�Z:�Npࡇ\�pi�U�dd~u��A�Ӝ�}���s�uG�$a��ˊ��B ��Cy�^�u���^���Ԋ�P���8���Y|���R�;0d�Z��|��Q?j˅e[��:>t5��sBbFG�,e_84AbD������@yx�ާX�&�ٰGđ,)��b�?s�at�M��G���+Z�Tg��a�;eFt8ˈ�6Q�؆]�ux&�W�ԣ,�9�^�)�Xw�k��߈2+�{�ɦ"�B{E�㢏SW�U� R̡zSj���|�v���Z���!��:鄄���n�V�U5^,_E ���
-�?�ĭ,��~�ܐv�I,7�_��,m(c�I�`2�Y1
�����9��emԐ"���S7)����nCM+��H�>��C�\y�<��4	� ��HR���5ah#�-��Kk2b�̘���-E9�
v�\}'�,H9�<�=("��5\�BH�����ܱBn((?B
��\;�(#�qA�P̺��O)$��ڼ�(F؎r���rFſ�K��y��
r�Օo4i�frω����z��(����_��w���8�
IO�sjc���:Ӑ�Gtwb�SE�1"�y&-=[��~+%C�ģP1��͞�B�|���R=i��]�l:w�<5wc�$K��jf1���Ը�IQF;i�;O�Q�7��q���%��;  �R�D
ë���`����AC�.[���?DCI���b 4:�6D�IF�J�8*����������Sz ۨ�k��>��1m�E��vX��lN����@�o�u{�gH 	�RU���ϑ��G��Of��o/So����p}��|2s�İ��"q�]����$YU���Z,R�كV��.���W.�f�
�)E�� ���7Hމ�G>��t>�����n��C��X�`:B,_Hd[�2􅞪P��V<?�\N����|8Y&�TM��*����"p�AB�U�p����3�`�񚃓.��P��Jbn���0ޓB��㵣G��~�S��@It���H@[�n��P n2Y�#] *F�wFH �s��G�  KG[��k���-�'Ά��k�x�q-Jŷ���#��8罴�0u����������-^q?X�7i��C���3��4����>Q�0'�"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const looksLikeFlowFileAnnotation = comment => {
  return /@(?:no)?flo/ui.test(comment);
};

const schema = [{
  enum: ['always', 'always-windows', 'never'],
  type: 'string'
}];

const create = context => {
  const mode = context.options[0];
  const never = mode === 'never';
  const newline = mode === 'always-windows' ? '\r\n' : '\n';
  return {
    Program(node) {
      const sourceCode = context.getSourceCode();

      const potentialFlowFileAnnotation = _lodash.default.find(context.getSourceCode().getAllComments(), comment => {
        return looksLikeFlowFileAnnotation(comment.value);
      });

      if (potentialFlowFileAnnotation) {
        const {
          line
        } = potentialFlowFileAnnotation.loc.end;
        const nextLineIsEmpty = sourceCode.lines[line] === '';

        if (!never && !nextLineIsEmpty) {
          context.report({
            fix: fixer => {
              return fixer.insertTextAfter(potentialFlowFileAnnotation, newline);
            },
            message: 'Expected newline after flow annotation',
            node
          });
        }

        if (never && nextLineIsEmpty) {
          context.report({
            fix: fixer => {
              const lineBreak = sourceCode.text[potentialFlowFileAnnotation.range[1]];
              return fixer.replaceTextRange([potentialFlowFileAnnotation.range[1], potentialFlowFileAnnotation.range[1] + (lineBreak === '\r' ? 2 : 1)], '');
            },
            message: 'Expected no newline after flow annotation',
            node
          });
        }
      }
    }

  };
};

var _default = {
  create,
  meta: {
    fixable: 'code'
  },
  schema
};
exports.default = _default;
module.exports = exports.default;                                                                         vI�Vm�U �SLs��=��\�H]��Z�3;���'y�x�j�80���/J\ro��e�>�Oi�P��x��E7��a��# X."�Y�UaJ9�j⑁I
OP�p@F���^��
3mZP��}�wg��)pRuЊY((����[mC@���ɺ���J����vȈs=�YA��F���V��@LS�\�AW�]	���q=�YJY��ңO��|�����bfxV͘�Ҷ�P	
�"i����B<��T�
�ެP�]S����E��������l�#4$w�����&jHl�x(_ڑ=Ɨќ�� ��n��'i�Y��;1C�J\[O��&�[�,��s{��i�jT�DzDr�W`���:{�:����*_:�"�;D#�,h��ϔ��]%G�䚡�`����ٴ@�z<
gЌ�c�+�q�7�3<�x4�܍���|�{�׏�9
�8֘�Z�V�$	�(�e���m%��]�MPZ�:�Ȥ����*�� �30� 3�ґ>\�[a:�h�HjK�{���c�$����X]]56�"`�
 +��D��+�2	�6񋤌��|ڪ�	�WH���Qc��`ɝ����� I�{Y(n4*���d` ]���6�y�&�Iqh5�����>�7$L|q!r��ʾ�D�����F�3>S��r�������m��U�FΫ٩;��<��h�由X9�c	ƥ�ʠ$,��vb��D���k��D���y;�ŭP�!�>*s'�%*cDd314DԦ���İH��/��r�m�(Jذ�$;|����P���#��x��LN?q�Z~�Ur����O쯎b����sa����2ڒ+�R�D���
��U��X�.,kT�D>ѵ�1���9�6��9R�ԫ�{�JE��ԟ~��Ih]_��W����xm�_^�a(�,4q�%�KK�6�o���{C���7%ѥ�	��>Ęz��)��n=�c\���N�����R��SN�H�  �L���4�~��{�#�o�YQ痂��Ę�5�=��d�p.rek���*"��b�������e;��N��Z�:���N����?B�PɆ�,ؒ9v�	)��K&�lNӑ�ct �*�=�#��<z����Z��kJy�Ƽ��3�/���ԵfY<s)��1�4��Xz�9Lֳ��C�vJ���=%�LQ��"�| )f�q�*����̄L�_�7����M\�R^x���/�W�/a8�`d\�$,��o�₂2�T��HbCs�|K}t��zg��l��ǘ��!�a�k���D�!���A��L��09�b(�g���<�n[�E��Ay$��XM��ŷ�;{���t{
�j����' �(�(������[%I9���X�����C���	6G��~����hR���9ս�Dј�V�j�!�ĕ�L�o	���  S5@lcI���(��T�N��!" ;��S",0�c	�q�x���RU��r @�D�爄��/�F� ��BfbB	�(��mӭ�e4���?��$��N���N3�5\�8 �MAގJ����3���'�qmn��X��%Z��X �O���V��mm���N���>R�"%�Ze�ӄ}�+szʲ5Gw��Ɓ-��&ô��	�ܥ�zk����c�4(M�cD�@m�E�p?�'7vK�}�,�B�;�)v]���;��ϐ���F*8�>�a�o�@�_#�mM���Fp��:Lග.8T�@�F��npn2"^z@!>�N���E��������2w�"���{>?�别ѹ�b�7���<��Q��q�)_𬸂�F��0j�B����͑�;p�{��Y��"���CU���8��QS�GE��+G�L����7r^
��rD�v,����
w|Փ�A���u�V�CnA��D��_*�
Qu�]��q�oB��>h�e]���/��$��#�ќ
�z��3���(-����A�s�a,e��,��P�C{Ѣ]6'f0d�m�lT��Z0�Ѻ����G��*8,��ο�2*>ؕ���&�Q��� |T����i�?�n����wєS�&��V���7I��������FO�/�}���)@�
4�[���t}j�H��^��AKj��a.#��#-{��
���H�z�Y��;
,�����b� �X,�I����l��UiMBY�o��E
�\a'�F���+��� ��qZ�z&�҉=��z)�EΑKu�o���mt�Feӈ�eếv5Mq���vi��q��l�q5��[.yԌ~����~r���э:t�s��w���Ff�प�w1��Fۊ�����CRtl���?�J>Lx��\^"^���?����`���o�mRYݹ�~鍘��o����LK���w����H���j��W���L�MU%eH�5��R���9O��]�"�{ɯ���Ց�l)u�h}h�j6Y|�/�^D�{��7��C� h�x�ڸ$mՙs�  %G9U�؈�b�q�G8���O{��j��Dt(pn���+�C���ț�f��9���W3
(������|�I�4u�0%�S7_�v�>)���Jx�)��7�I�R$-QȰ�X(tp�u+�,��
~��?ͶM�0 ��M{�O�P�w�=9}Rbێ���vTP�<
{g<B��QS<�21��T�]��*�Q��T������%U��B%t�i5s�C�������RiR�:��R�OƎt7��( `j8�.�!�Ig���`sz�Z���9�s|x�M�{�)UV��X��p�
����Ǹ!:�=hY_���p��(C�K�oɚM|��7ʹ�*DX0lo هr�e�TN��$���=�txޚ8+J�
>	&�!�<YG��	m~q��gp�0 uW�B�]-�
�}���(1��
K�$R:��rݜ��h(�jV~�R���M���t�G=ĥU53\���R��l��Y��y��Y_�P�^��lE�ٲ}��v^��L��8��
 v
V��~�GC��Qu�g���]��F[:�V"�l&:A��K]�޶p�\�~z��F��U<��{6|�/kC��j���!�'��.�6c������$7'f����w���Dԩ�[Y�������R�4�q���9�pđњ^�4��(���%�� V�k��IC�:V&��ZC\CטG�ۖ��2�&���Q�ڒ�����������yd 6Lv�P��n�oS��۔����+q�0.�! ԤK������C�S��M��~��i�Tt$�:�+�KsH���pVpO}�Q.�E�YS��
�,�����z
d��G/��QN���uJ���Z���ߨ��
��E�}a�6렘/t�$���61�����yk~R��ٍ
L,y9z�Z8P-s�$�<�K'=f�=&����$��wz���!�	��II�c������>hA�V�-�4�bhΝ�W��푑�6a�j
[fbY3Mx�.W9[�oH��ޥ��O7ýJ❗��md/���c�D!�����-"q����,8T��͇��VM���b2m�q.��~��:�64���'�~���?&����Yv��	��l{ք�ݜ;QQ0�F �k�ڻ�c�/��(}6�h���6j��Q����$XDeKJlaĨb���}�Z���' {>;��R�I1�K2��c�aj��}q%H����-��KcGC����J��h��2�k����Gō�e�P��Z\�l<��c8.�!$�c�Jd�aC|���"_��By5�}Q�<WY��+�ͪi����/{�f��M�Ԃ�J�G��=�ޖ��b7X��U��4%f�S�O�(�)��	ț�}`�,��Ɨ_ǭ�8���`���x{�=:F�j%���r'h��m)�ᒧ��u�"��oc�ll ���������>�h�bw���
 ���P@!�KV
��G�׺��I�k&��/�<�~�a`��o�m���Б�)b'h;0�%����`XRl�'
��3�Տ)N�\�H�;�ZLMy�V���7f��6n��e1�j�8�G��]����Z�X�S��b��I�z��2[��*4���f���/�b�P��T�r�j��D | _�G&��f8��.��*
�Hdo��%��ሱ�3\[t?=g[��5A�9�Axt�Ah?�fy�xFM"]�� [�e0j4�y���L=�*��?2>n�=�h@̝�@�9�G��D{������Y�@&�Q"Y<e*s�4�cC%Öo��8%���Yo�`�{(��B��u�A��9�="J:�8^F�J[�?}r��G�h��X��X�ћ�7�b�`�=)@q-�d�;Cd0��$үC��5_��h�L`�,�J��\���� �.�3tQ Z�;���X�=����~
"���`��p��y	�9�?��"`�.P�LR��Q�#)�`�����
C��v�/LC>�q�)��H����������ǯ1"��G��O�E2�"�D&�.���E�I�*����ec[�A\�hr'q���ͩؖ�a�2�������-m�*�#��w����S�G��#�}y��Ki���K���/���F5������$��Ğ�����stm�A�?oZ��!��������O��8���lW;��4�(	�Y��Dڔi�-�p�L�/[��Y/�u�	��f�׺�
0���`�_v�
�G��|��0&{��#E�z^����3Ao�Sg�.i�j��P�6��ަ���?�ĵ���saS�g��h��T���m�/g�O@�Z�xJ��Ԩ��f�xԑ"��e�f��Vӳ���j���߱�y@=�n�)���mK)K&��{��&�v
���HWP�	��Ɂ*�F���,%��t�����^F�X�yF�Y%���9*hT`�)��R	_5Jc�F�����֨S��h���%���t�/�c�(#ؐ��D��� �S½`!CU��F��$c�`~-�C#U�P�d������	IT�X���D�*�vP{̑�~^�EV.?��R����LQ�/|N�V�_*���~���ecĶNݔ�ǀ��3�@�KP�FP��g�t����k����f��K;>k[Ӵ$�Υ0��wcb��2d#�}rqg��9�RK�Iq�7.`T�C>�WY	;��3��r*,�@�|�l7-��A"�̇�h�4�;ۯZCK�g�˙�m��<F���$Y"�*Ϗvhe�:�$�0�[1����`�J�i��Y�5F~�A�l3��:Ͷ�ś�l� tk:�kx�_�s�ƝW��[��]�/eb6�/c�%I9�(c;R��P��R��|b�Cr��b��;�.4�Y�$�O�x�j��N�g�Kg��]+,�^:6� yg�-^:��n[��(jkZ�,�~�u�8��__YLuuH�ٝ^ֻl�X[6�2@V���ؓ�������=J�U�1���F�a{l�>(a�e}����b���q���ݮ��꿆�{�w��UP���=���ț�Յ=�1�pnP>m)�-�>Qeٰ��:"X�?y�n޲�
�ƕLBZ.r���QG�o��� �w���O�㭓Ff��;������B�>)�m^!�;��_+58	s�T�v9$Gi&~�'T���<f0�Fyކȵ��c+.�Z�
+������sY���T����̟^X���(��o�ԛ��-��(Eu��#�!��
�4�ҋw�	9^
��[OOXN�P���C6M�ܓ{_�SK��EFxn����܂��{��@��F��h�o'�z�����tp(�;T�:���q��T8� z>>�p�!�S�33�|�&y�;�.+����\x]�'s@��Z�>&P:�&�8$��Z���J6lZ��]��'D�ǳ��_'��H������iB���|�u���Y~eF�.������~�21_�Hjq��6j�G��aqj6��G���h��I�w���Z�vrD�*��.i��l#�F�n/
�g/W"X��Z�����X�vFOZ����?����+��h���>h\�*2swЊ�=�n��@�ޖ	W�h��h��.��d��~��:��_#�]���9�½hHpI�Vo4%]�Z���C+��4S�G	IH��˖uPE�ԩ������ms*K�`u#���=#�yl�B�1��e�L`�^�\����s���t������H�H���O����K�n��c��'+�m
j����5��W��{{�=+)��H�<�<N|�O�N�]�8�E��ӣ�0%L���фcS
���pŷ��n}D?�_���%���/� �^g���A��	�D��b@��I��t^���@�j��%P�4ʦH���~\Rr�+�B��V��E�-� l��z�T���ҏ;+-�ް}�aw綨y  0�������F,�o��k�4[�M��_R΢�l�ȴ���Z��(-,,�ʙ�6��VSUH��o��hP���(�����O�Q5@<���4K�z����<Ë]4�F����\N���"D`0W7�gh��f"آ��D��8���q��^J7������I��4.�nA��N�.��*�L[*4��̓;"i
yt�p0f��$�P�Qme�@S��o��F+ D�1�$s
�5�7)�L����~3�R�ɰ
��V�9�����5�֚;������H8��_~ڕ!� H�](
�Pt-�N��W
��a��0���l����54�S�l����=}<p�5B��?�.�;B�!e ���L��ְoW&��R^�����Yt8}�����"5�V���?�f%%�r�kw�ᗜ�
T[���[�Ÿ2��\iu?m�A8[�c�j|�P�X�U(�U��(�)�=]�,�˜ʙm<��8
}��<�<�Y�'R�o��M�h`q������5���'f��<��"ou���?_�U�b�F�M���!�$���<28)$��W�h�*-�<�;��5Հ��}����4���ۃ����i}��F�Iy�Ħ܄��1n$���x����F�P�T�yc���w�BԸ5��=nt|$qfO'��^����-�6��Gg�F�0��|#�W��(���KN���p ��8��P��9�ͶX-M�.X�m4V�9�k�aD��d}��!�S��(��P/ *������>���:��aWEc�!C�p�D�#9&�V�d���XQ��P�-{)���*(R����%x��H�l�+�t��^��^�,�u�ha��I��7t�� �*	X�+���cϧ4�4�A��c
���P�w����u?� T�t}8���_�ƍ�����|,.�nD7�����?�ڡq��nYTD&'X5�q̼��A��nZ]&����6�����X4.8�Y�oz��K���#���m��x.
R5vBb�O�� +����b�"�V�#;83�b�y����A����j�����x��k��-~��r�����UKү�e���5��?���ꚨ���"�� f旑���0Ɏs7n�#�k�O�p��@?�jg���gE�?~}�<�}z,g��w���%���<�w�����c��Vl�x=�1�&6�ؼ����t���L�����:KG+Q�ы����a�aH���n쿡f5q�,���h���YGD'�1Д�9K��|��lh�
4e��ڦ�_�x�,x�b5��
 ��0�e��q�o)��Ҡ$�ȿH��q-^h�u�3��v�N�m����Ϋ���ϯ���h�'�.�r�@Ы���}�X]�_TT/\�T�����{��J�S�zQ�U.�]Q��6 d����PTt?>Η7��:���p���0lX�V!�y�ڳF� ! �G:0�>�	!�#�
RjZ�8���7�g@��Z#����Q�"Ň�4X�i��A�.�����ߩy%�(g��#�1�P���x�#֏�%ʾ#q�W��G#T�ׯ��u��=k}�����ּ�\��0c����,*�����p���ǚe}�̎�%�v�<��:�/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export declare const ARROW = " \u203A ";
export declare const ICONS: {
    failed: string;
    pending: string;
    success: string;
    todo: string;
};
export declare const CLEAR: string;
                                                                                                                9���|�;vmh��:�7�0�#���
HT���%RB��Q>�俐E��
��!I"A?0�Yc�
����G( e0m��ث�˿�1!EsYT�Y�i`���nb)��{́Cz{Vv��bPȍO�c�ȗu��k��5HhH�`(-(,��(t���g��y��Ht,��*F� �?�oG�������k���v���KѢ����ݝR��������ݵŽ-V4���{�&Ǳ���=�֚Ys]t�Fl�R-̛��j|��0��΢s:�w�8ª�A=�?���_һJ��G=}L~b���r�*��N�T�{<��t�Ό�0Ո�#�$a�*|�}�G��º�zvB���TXs0���n2	T"]�t^9�Hd��Җk[�o������G5�C��Ǖ�i�ԉl^�����U��?��]D�
?�����b��J^��y���i1&���

� {\�C��0�S}mܺ
k��_�r�U�!�ך��S��y��[ǽ=B-�H����6��K��V�?>>y���	�J_Aٷ��/�=pj�V������}��-���0aœ���Tgk�p(� V+4���M�l8�(����$��n���VL�}��F�tx�)�Y�T4�xM(�8jeHd.�|��C��t�%3�N�e	�z��/1a�(�[j������?s�	/|�V�4G�@��
G�7}2LbO?<��tlc�`��C����s]��$&������� 	�.�]�2x#}�������܅�-���}���x�Ad+��ȸ�fY
g��LU?��
�j��.z-_���>�.Ti���~�ե�˕4r��.��c9�^��I}P�ͦ�9����<��T�*����t�}E�`V��ݤ��B�s3����?�0�|�c"j4�_���sg21����S�K�^Y�1���Ñ��%�Y�R������^P_��L�K
Ru�2��/��+�k0�i�9^��b�'�<���?���lgZ�� �\Q�#e��_��+G^8�3�#+�y��5�S��6%��dA&�7�6f�jA��7
-��'U�C�yd0��+�VC%�J{�g
�i|���/1ut���C���
�8!z��EK7�"iS9����1���̅n�WñK�]�[�P��)-�D�g��������#[u�
�[�9L��A<����J�(LDN�r�F���n�LS
�͵t�S]�>"��[���#}�u|��˯J�Ղ��7xF�ﷱ��ѣ��)��a.�.T�}K�� �R�
�©ދXx�yΤFﴔt��|������Z�%�LЫ�n �,hJ����
c����3�_b��*_�,fY�Q�e���I�v��9����êR�#'�����b7�{�3
�Çlt���e��ԧݶ ]�-d'z9��C��3W�S^������������~]���WQ�#6=as�6����c�ս�֟���e5���pBw�'��_?u�t��¾m$�zh/8�rXjb3M S��'����S0����t}"r�g�:��t�Eyg�ˋ:�
!�7�>Ӹ�!�'�Ţ�$��G�ߏ�EȬ1>��$3Y=�N�؄~x���D��(�u��^����  PZ��&���<���t&���m|���I�n
��0�6m�{�-4��&�y=��ϣ��eGyP��d㘫�N,}��oǐ�f�~~	2�,�#��7�x�Gh*�^��-�@��PĈ�����p�B�s��5׋�ӀF֩�Y`QV�/�=���*��my��Mݵ>�����t�e�`��]�6c�<������tI K���|Ļ�e�T�h۱ jN烪��|+�s�\�����?,�% lſ����z�-rPR�ʪ�e���F�Ƶ��)�<zAg'wלQE�9���l%�LK`Ӊ�}�2{���M�WC���@��t� S�z�/
%���ui�mN����U @^n�#�B�B�~���D�J��e�<a��7J|�f��Bs��7�4	���/�9�OS	�"���jsu?��fC2��B��G��/����+js~�/4?��nR����_�0@|s�_\o1tI(P�T�dh�"/Wv]�T����:q6Pgjq�̛��pN��*�-3O�^;��{�V<��s'�G��w_4�vWu~Xe��)|) 8�k�}�S$�dݥπR�x�v*,�RP����F�E�H����B!j�Y��\�����i��n�)�	�a�fR��_�Ó�J���ڗ__���Y�
�\�q�ޚo�
�-���=
��2�
����N�.��.��~D�Ͼ�t���C���A-�o�:�<�[�7$<-͟O'a��Ź��ɼh��)Ek�Q���(�5j�c�ō�t��l>�F��f�T��
�y���U*��4���&����zt�ԨϺc�[v_����ڶ��T�P�'JF]�
��P�W,CO�E4N-�Ƹ�z�	��f�T1'<��l�ս׿��_S)kˌc�a%��I����ۭ�3%�VXs5�s�y7���	-7��A�VV	�g.��B��c��&6w��r�EV2��,T�	���X��~%�>�'�h]�+�����>5���pg���k�6蟋����T%0ǎ?W�
�~�'�>:� (�[o`{��80X��n��18�����sm���ۡa'fN
��[��K�;o���c'���h�L��d��[;��RH�mA��dZ��"[<������Lo�����1�|1x���˳�
����v;����^�Q���	Z�(�4��H#�ҟiP��2�6}�ײ*���"�%k���ywOO�����8d�`7��n�f4�bٔM�.B�^8���;
�{Q@)�� (Ox���R=r��>0�)XnA���!���Wv��/Nj�Z��t5vK�=�V��L�,&� �jj�ł�sYE G�10��Iþ;}���M��O���� �I叻�n���6"E��B�/=�B�
6��f)�߼`9V0z2,V�$c^<�sI1|�^d&��=� �cv~d��D�l=]#/Y��"	h�oz������͑f�T��=�����`��'e
�%JJ�eR7�%'�c�@?Ā�|����׀,�u)�19�@V��
˗��~d��̛��,��r�s:�b������H�)����O��)��EN����~����<��V[\n���;ED�΋P���rǢ�!��d#�X�V�����=;��%�����K���^CX�j,B�8VH�jr�J�Q�us�&���l?lHnʩ��og���Ȃ$Wͼ��R���������w,��H5U�&C�w>O~�bI��'R&��L�ܛ��y�dOh���L�Ȥ�h厂�]U/F�B���hnN���J��NJ�UۊR�iD��ͪ�gǰz`5����.c���<t:&��s��`JĮ�g�9T@9,L1��v�E�4�٫ܭ�a��G��'׽P�dׄ����
��?5:<0kv��~MG���a��Rb�:��S7���^(g�0_5b���E� ��:@��9�+��ˠ��0��5�3[3��v���.�RU"#+<�K2���q����!���s��d�ތ��MQ�i����eV���MW�)�5dDw�O��Zaj�,��_��P!�g[�t��s���Z\&�z=+G�kY;ic�8 ךe2 ��J$�Wl��I���R��L��_p��S#c�9�e*I�u�s e)�ge.�3I*A��$�N��t�E>0-
n�U좷�	p�G3w���s�^Xd<��#t��,�pH��+8	
��I	��gaև�w7�^�PaZzb��7$6
:	|�>7l��_,~ӣK�[�X,���  ��44NKIHYg���[�D!	��wTYeK0H"#�� )8q��S��.)T�~�� �J\�\-��͐vl^h�'��!VR����~G�,����Og4U�RH&��Eg	r.��L�ߦ���@:%���K,w�X��⟎��	lDƒ�L$S��c��B�f�%��2��+�����8�nOrR�C����*P1�h��1nzd+�܌����yq�
� �d�H�a�P)���Z�B��4H	�B���ӓ��ӻ ��h���  ��ĺ2�3�R�8�����'	 �g�:$eC��믂�R�卬�y��:O��1Pa��Ѱ����fQY��H�%����(���c�fϘ`�?R�n'4j
��������e/mnY��Y�g��{�"f/A/�o[�uνvX�J;X���2�O_�&E����5���27�P?L6e�/���i��4�P�����7|�e���������~(mV�X�mVw���ߗ���B�4��*J\�V��	{�K�lA�,�-��?95�
�mq(���(d~�6�$�f����_a�űIʖ���Q���-#�Q�)����+�����d��p(�9+Ŧ9�@������紛�}�T�,2��i�Zzw=��$&�@l�(��e�b^&{����Kک�7\�-u#R$u[��#d�;�1|��O|��������B%���R����Ix6�n�������R��3*����`
�!�wK�J�R��dSY�Hː�/�����HIp?id��j���wnM�{�5��]�� e�	�_]ҺW�y��A�i�o��'�&P�h$��W�ᖤ�I]t���^�6E��F*{}����|}��$��uFS�_�1}h�2j�� R�T�r�4���a|����(V�~�X�t�9�=JE�;{�0���(+(b��Bt�z����
8^�ĳ�g�e�th�����b6ì( h2v_/k��m/�A?��D�����]�ޔ<%����r�*��R�m�����Rd淢
���WT��� ��@ٟ
}���W���6�\�-��4p���;�1������@���>e|'�Y����9�!<��|���wu�K�$)��O����}_9��`'dk%����`xi�z��W���V��Z*?���->.;u%\.��KKϖi��HiZ������&eA������\W��>]S�Z�c�ڷB�
���$����t���a~�x����hq�d,�P����[�s@�@�I�Ҥֈ�-�0=�ǻ�P^<&��{n!a�����"_i��~�����6/���let5dHi��M�����)8��7r�9qkK81�&U$f�68l���o_qG��loU�����a�7��ܾ@�Ŵ�I�S��^u>XtO*�dG�ai�%��a~)C��X
�+%�ϸL�1��V,�5c9���6lPSlh6_a���Pð		�?�^X����w}�D���󤁋=�̚�( 9�d��)���G@;�x`�i{�F���J�&�D�'�2B'y|rpĴ&:Tt���z��	� ڈ���Yzd���͏a��+PLu�,�dWvsb�A =�Q��oy��.�W��~��!쏿��GGI�?�/
�UHR��GH *%��;&�԰���D�c�x�d馔��y9��`��r|-D������Z
��S�k#\H\���#4Z�2��LR׸U��3��J,��r�Eģ��;��Kv�'I��'��Y����
�� %��0�ݰ-�nhҷ�$���b��D@����dZ�c�m��&�Il:�fh\r�� R����F�CI�J�-�,��:#�5��KρB)�-V�)�r�1=5�#�:#/�\7�U��c�Z�e�i�N2u:�Fc��`��mK����%�?ƨ
.'evX�����͒�`D9t����!��i�2���s|:&��Q2dފ�zzsXLJ����~11�y ��H���BS����eU�h'���q�9=,M�O�ؐ�l��ӭւ�|��|-"��AXLKH_����Qj���1$d���Z�#!˴J8�*�	+�rV3�v%�sO���0'# ���t�H_��h/f�P���ד��.U�S�9�uҖ�SD�DL��	�
��:��� iaz+}���r��&*	%K�
��0�T0�n�ľ�Յ����7G�[�La���)����:O�$�Ze���B���ML�?���>OE��5{���<7��{<�;.+�N�N� ���H�#�ɩ��U�-Te�T�����!ѴN���G��꾉���Y��3��Y�� �I�J̿e&��<�Ղ>��*Tg�3bW�E܂��J��0��|��i�ע�LJ���D�fr1p����C�����RQJk�$lE���*"xZ�a~0�N�ϋ'���0�xW ��m�ڋ煣kd�
����9�A��rɉ`�z�Qv&���|���3q�&���Wl�VǷ�(90A�U||���q���p��Wz� ����	�U'4�#�&�E�;/�?J,��dq���H�䤱��^[�wz�~tv:C{�����m|H��aH����׺�}�tb8��Ӓ�
����X�@�*F���$,��
�;��N�\b�#�]�������L�^ш��¥���~ �_�)�o�q���)����u�'�:�p���>[|�*�O�7b���f�.����SZ9<X�u=��}}{e��Pb���_���R���a����A�I�F��{�O�TI�*��o����:�����Q��6]
	P9��跜�B����.����
�?�E���'#螽0��!�~���Q&K�������l�	��\��p�wbf�W;�e|����fF���
_����J?>	�-M�KZ�B|QHi�7R1��wއ0qIS�C5�F�|>�jE �s�CI�`8������nA��o�WEzdv)�%���^˚���"Y2�8�G�!��:�2�C���)o"���q^>{;�2F�%v_�p�+7�Χ���MOm��O�/?�_�հ�g�㪶S�y�u��2&��N4��q.����Mrʚ�]�9#&��}iT���x��O+��k!�ږK1Gp�S��J��kK>-��v�jf5�����LP2���a߷]a�/�9
��}t�ZɇZ#Y\a�* ����|�� �b�$&v��X�)d�[��85m4��Y�;�=9�R%C�%  �U!��4@9��� �ʂ��b�Ƥ��H�}����
!�,=�(�uu�D�m�<:2��ƎͰ�q�A�\����D(2� p�5�u�r���+�B	 @�8:�OM��� ���6k���"�$H������ig&^"�s2
�p��2��hݎ;6�;�)��5G��A@{�(��I"��w�j�,��s�W����8 lX~���u_�x6���h�V��L/�]��P7��t*�#86�d�vi��Z="�����2��oI�(�����Ώ�:
4�Rܔy�Qh4Hƽ-�'l�L`��4v6���ן����Jk���F�ju_-�� W�
{��JF�Lr�+Ě�b6Q)�%U˾`�1B��K��P��jy������@@�������>�����[ԃ�C(X?�E��� ꊂ~�J1p���0E)Sr3���uMуc~>�x0ff��O�	`%��N�y����%���ݶX��b�aoƦ��Aǫ��,�0!��9���ڽHO�?s�"%���fT#E�Q�
�E�]2福��9���3��`!`�Ψ_�F�Pb�`8ݠ>٣�&�?<����V1��7xd93v@#����!�V�����<^�v���sQ�w&��J儝"'�YGU�%q@3��>��A�,
[wj+#ȡ��,��j �ԩ��\ *[_.���9��L�(�0~�5r>�d7��4 ���T��8 ��u��j��-����`k�����f��L��}cO��m��
S^��5T���㌆H�$�P��x�R�6�:�|_�!���3v��LB����� z�/u�U��0ǂFj�,�K78�E,���:�(�%uJv�)�d�C���8rV�y�7E��oo�J��u�j�nϾF<��P
t�]�JKK��-Q��q���8P��k݈9���r9ЪML����[��f���M{	SM��gͯޚ��=h���A���f�5^��7�t�m
-.6����M�/�7����ٜ�C_�:f�s.~�?���8)$%F���74�}=X�EU����°ᰑ_�+������2l����CQ�� (�/Nua*�(
J�+)j-�9;�{�䲛�.L�K�V�2��ڠ:��U�ND��jUn��!����
��:]j�Wd��:R���� � �?Y9�)�hR�r3��4��zy��y7a
��ԣK��V:
q�<���*�Õ�ىeT"az^�1=7��jd�����\v���X
GC�s�,G��'G��/�~�ѓE�o�H_��/�v��G�<��6�E�B�]��G409v�َ٪��GR�4�,>4��{nuxM�4dt=�H��PoC^�?H�W�
H��V��ۑK����H��� ���U�f��DW���g�@A_YvC�Ӣy�=�:���*s���;�0e�%�3�����1�A��o��oе�]�>���J���ٕaa�akk^��hX����V�Z��8��'�O�����L[�k���#��;��۱G,>�l�X���'���_��߿_*����@Y2		Nl%>�;�t}b'�ݼ����cqb�K`K%x4����&HZ(�'%q��w�uX�K0��ƕ���8���DQ��Q*�����X )&�����f|79PDg���P����Ij��I�N�;��!���k*�����Z��m�DF��˗?�w����ӓ�չ+�Z�ՌyW\,�o!?:�~
�|�Yn�+f'�^�=먷z]�O�y�d�>���tl���{�|M���û�;u7���-�b}�=��fkqȰ'���W�e�( K�a\������)�j����eP�%}�
ʂ0�6��s1�Q�q�3//�v��~qQ��ߋq���R4�e��v���D�͝�{���W��k|�jM�`R��q��Â�?J�w,�m�tc�:U�}2N32=�K�F�����$��EU7!�����{��i"���WW&�\\z�ך	�9j�݀�8������*?h��.��%���G�x\�����:�ʶ���2�k�D�i~��4d��HH��%Hea*Ώ���
+�O�jS�L�� ��ľ$��Q�u�s��7������"�$�* �fMN5?
�"?+�[l(�{�~�B��X]�#��N�s��S���3���d$�T�N����n����7:k���z����f�/����E��ivמ+;�v/�TZ��)E������;�ID�/�lΟ��<�ap'C�5�����R&��/"�O�fҾ	�3H%��K¤�!�lS���r�V��:���%�mq���j�RT~\��J�V=c>��-U��5���_���q����;�f3�	o���&k�:���v`��r}����HA�4�C�v`�������JD�q����A����,���{
C1�,�`����x�sG��7V�:C������t������@U��<^�r� 9�HȾ�-���+��5���d�u�X������χ]�)f�і��Ո�B���=�B���x���}�LA�j��J�y��#z��\Xt���Z%K����-d��"����I�%���_K���L��4�#�J�^��)��c�����^3.�h**�nZ�������N��0HRT�t	����z��:�I�]�j�:��Q�F�(����P�I�l�-�_������]�ֆV鲈Q���%����P;�{9"��[�M�a�H�\��0&v,�)Sf�jT/����<:ʮf��y��j>�KA����8���v"aX/��~�^n�����?�LJ#
m���ou��lt EޕI
$�in�~vq�b�ڻ"�lԡE�ϵA�RE�?�` TD��KVK���R��q��2�^\��e���E>NK��YԡO���K��*U򕶑�rm�@W���|�tm�%�-	#
������k����	R�G&R2l��I�1�Cg[��K�HD�c�:H�Ep.`k��;�Б��Sf�' V`X��swv ���D�e(B ��ᕰ��������O��]hOT_��B�P�
�2r�P���ᚡqI��K��o�k!�}��T͒�qZ�@�?	��\1_�:q��ĵ��i9K������*�F�,X*�#��61�9ʜ���K�n}�S��e�S,����ƒ�%hk���NO����w?5ش7hW��CU��`��p�#�q��*�퇱��vڀc���5_�NxP�f0�e�cy���+{ԩ��{�f
��Ø�i�AQMM
�-0�x�Ғ�������Ɍ厇ӿc*����yI��.M��#N��)y|�ʰ��T{�[o67��_��j�����]�]5���!�h���;h{��le��z	�iu
��P?m�Se�E��ƞ��w�O�Aݯ��>m��V;j��I��q#R�_�y�)`�
D���G��S�LLT��څ�}�{�
c�?ߋ���A�(`w�,K�6�U����D��X򄃁Y(@��LL��b���FQ�Fc2�D��GGa�T-���T莯t��k^�S���_z�!��JET�+�����틓(ң��hKNZ!JM��Љ��,XPur8�F�_�u_�� ������	*&ƅ��,�3ż�	��{ְ���"$�[�H�d�%{{j"�f�c��m�A��ƾ�rd�=?a�q_U����eQ���P�����CD
qAD�d)�/ ]��8�uXԵ+h����
�5�w:nU�#t�,��7���܎+���ѦX�W^�	��i�����zi=���}����`QttL�8x��"���>ăv[o"O��i!��+�$�审�"�gK��PEA� ֎QT�SE��oVt��������nweC�n�ZR 텥\���?��'�-�qW\2B��e��tHp}����l��z^�=s-	�C�d�	Ǒ��nݪ�-�5���L-�,���H�0
� .~LH�g�f�D�EX��W�\�ׂ���>��G ������ĞO�Kzx ��3�ST_���h!��iҬK�O�f�rF���ı/֙��1�Nw,$���h,�Q��X?I �w�M�)�M��b` �ýN�|�B�H^�g��N4GPP��
�G����∪*�o��FN�S3�e�~�
/<K��	����뢠�����`=�h~ע���p�"Vl��)���L;���E��}a��(W�����SLUq�JX�l�QM:߰��ZF{�$m�j��bzX@�Ȭ��������-�-�S�Y�}�<�E�
��mN�fMsW#�܉�D啟"��І���y���G`&x��+
"S���v��U��a�?h�g��R�گ���3\�
m*�k�GH��T. u�*Ǩs>��+�x=Ξ�"��\v���$��/L@�s4����L�����h��xU:���k�������Pxn0��#��s�ne���g�(ڤ$-�\�S�s��� s���+�1�E��-��L���[~��mo	��M9b#�	ɛ��ݦ��9��^l�cW{�%�\��E��ewd�ub-t+T/d�� �y���4 )J����ʠ �A�������v�L蟏b��.�<�5я�=�g��e��;!Go�4L6*�*��?l��c�k��^P!i���e��}l"B�zv���T�ѽ��? E-&��a�?̥E5B<l-Sb�T{a9Ȱ��
+*�ÛM(�[�W���	ѝ`�*������z-����մ��?��?7K��DE2�0
 �L������u)YS�"-B=X5zX-���e�eJ��l���a�2�)&nŇW�_x5���'�j���o�V1�b]] ��_�l�GF�D�fu5��r`���c�-i�_����9��tA��Q��
{ʇ�$Y�${#���zw��P�hh$�1�\it�9��Կ��T�Tơ�uE!UO�{�,���{e��B����{{>2E8�P]K45�T��߳�P���YVP�.���K#A�ʕ���9��\m���!��d� ���6k�E�Q�� ���Т�� 1��B�J~Zu�3ޡ�W���	�Z��37����^����8��L�k������x�ft�����a��3OQ�0 R�����4L��lχZ:=b$��h����Y��/�A����T���E�;�c�wk�(��5��"�h؀o�wS| �$9P��B�b����/3k���+Tz{	���G�La��>�B�p�s�6�d��D�̼T������an�����W.��57�O����UQ�͆�lV
����RMŸ�����:��:8�60J��J��00
��y��S����.z;N���J�� H�F�P��h�T��6���(2ت����~7�T�:���>L5ʢ�㖕W����O��ψF>�}�zysٷ��=*Ԃ�c	����<�l���|4$$7���Og?#�4sҔ�m�G
.k$��F�A���L~J�!w�|`�	��,�FP��#E�@s�D�����4?���s04��>"ǔYXm�0�RS�We�{�c ^�l�C�vC&e�,�!�d.9  Ra�/<H�,Fhq���(#�$3<���F4�&�N���/�%57kA`��f��%s��Я}�s��3�Q	���):jl"&$�QwQ��2�_���U8�W�	!��s���a\Cm���MM�NO�(�y�J@�
� &�Od'Rh���ߜV�(�
8��3W�k�+����\-u!��&G-�W�㿇Y[�r�Gw�Ӕ�3�t��������)��A�����L	�)#罝}�����ﻚ��o�*8��Aխ&�F=z�������?BG`���0�ix�QeT�U�� ��qjÛ���W�K�~�E�{K�&A8� �'���Dy���ִ|��U
�,����Gί���1��,z�gs��G݆�Q����}n��[��V�rgB;^��U��ۣ����#�Z�W��S�{K���$�ϰ��@�����0�����o���S��B
`���C2�!�����f��D� Hоn���6�E/
!j�<�g��Ia�J�qw	��=P�E�$�J{���q�q�-~B�GzT�uN)di�`$4�g��U�r���\�v�@qlLX�i�[W�/<�̣��s_26鸜���MU���ɓn{>����f<Ua������q1��tC�Uh���3��� a�+F!C��Q~F�����eDhQ%\n�'he��|�կ6Sq*��$��e�~�����ǰ×
�X�H`���76�s��(ƻw�����gDHB��H ۜ��Oa3G�<F�_ȧ.���g��3_,��}@D9!�{����l>9�ȋi��ea��&c
S����']͍��C�Ԧ����_���D~iH���E3��\��!O�暾Z�����6�/�*,A��2y�a��Gv|���>͹9�U�%`RQ��g�'/�S�җr	�Z��[�G�F�\w�c�4�5����-z��k:�'e񼩩Iڿ#�\�I����g�V!ը�t,������({ܺZ��׸��m�3ěf�<�{5��fVW�1{��l�,-J�XQ��0W�[b�_��Kp>�.v�e��z�����lG�ݼs���q���9A�(J^f3�@��L��}��ܱ�c�
� D<���ӗ�%g�U|@|�(���&.*f����mf��h$<S��f�"W~Ƽ�M�ȩ��Z��h���Z�k������t�ѧ�ǣ�)� �.ߘ���'N�e^hL���P+�j��D�o^?��M�6�����Xf���f��צi�,��W隸9^�=��*'����Tp��:u���uc���gZF�2�2����Q����2��񰨵"쩬�N�]�k��K5Z��ձ<d�O���:�1r@��2�d��M�m[7�gs�&u���(�k�g��J$��Xn����T>(aΒ�	�QVP�	zvG��\B����ѧ�9/Ԧ&?�~RZ7S�GH�R�
��}j��BNY��bͷ�� ҵ~����S!T��<������ُ_7������(��	[*
`P����<ݡ��ҡG���l�����B�(�9��簔�d�<.�tc�~����V�X�G�4���n�����bK����rtzP���.�F'���{�M1鋪�l���זM��kժ�%ju����0*��
<���T���o��o�r09V�&CD,�Лt�T�f�
��(�b�������`��}��L�!���|�>�򝢲��Kp��C0V����v���/|���?}pRpX�,���-b� S�:5q����ra5�����FG�#b �rS�[��`*d(wq�����O�cS�42��_��m�Z��c��zd��jR����tW9ce� �%�� �GyQ��n?�����nD�W+PO�&2��Yc�<Q�'"�O�OQ�#k�,�ev?�},
q�����N��v)2�:�)U�;؄n0��S՛`����Ԩ<�:xgC>��T�Y���F�GTU��d�v9�AW?���/�m*�m�;3���2Eޮ�ij�$�R�&�Cep�	�\����i��
�:YL�׷�KGc��v>�Z���{Ja�b��m���{�˳�����u��eOY�U`�Zf��oT&�-.��bʧ)s�i^Q��3���S��e�Q3�e}]MP�����GE���LZ[L�-;�a�0e�?�qN�,C�VX��{�7L�}3`��A�P�-f6Ƣh����&����:J������2g�q��Um}Z�~�H�TŗZ�TB~J����9Vc�ja
�f�3FU���Vd��L}�CN�γ�M�f���w�Q��&�l�h�X�/�������([[?���	N�V���r h�a�t+@��E*
���+қAA�,�FyW���
4'R�jh��&���2q �/��5Ad��%/?̅/��c��߿���I��O�#�.!/��v>�!b�&�F���CS��dl������xH�Ĕ�U�o?'QXp���
ß���;�}}q�d����$kXE��y�E����^[��E��a
  $QDg[2���]Iw��O� zA�w�&:Z8���&�î&&�:*jQ��W�B�R�����{�[XRԾc���lr&����ϐ7gK���P��;�6W
��z�EF���
DDQ���
x��y�,�F�%�A����5��ߛ6a��U^�>�lnY	�^���-���5�w�|�.�^�*�R�T{��u⢻�q�$�q���S騸9m��y��9$�Mņ>R(U	@ٙrh�eí�#�������4Վ��CcT�����U��<���
���. 6Ǯ�zDH���5�~uJ��'�l�f�����Mp3E ��
7خ*��ŗ��Ec�rA$�w
%�y��y$6�xANd�M�Y���=����Dw�&�9��d��씜��Wl�*�Pg����9;�QRy?a�X��ɗ�dua��	b���1�0�eb�򠚮f#-8�)e�a����/�;�B�Y}�x
\>��G������|��4NU�>*�M����EV_)k�)�����V��K2M+��K�ŵ�HA��$.���
F]�~�n�T�^|]���8��1Бe+��	��O�i>!'use strict';

var StrictEqualityComparison = require('./StrictEqualityComparison');
var StringToBigInt = require('./StringToBigInt');
var ToNumber = require('./ToNumber');
var ToPrimitive = require('./ToPrimitive');
var Type = require('./Type');

var isNaN = require('../helpers/isNaN');

// https://262.ecma-international.org/11.0/#sec-abstract-equality-comparison

module.exports = function AbstractEqualityComparison(x, y) {
	var xType = Type(x);
	var yType = Type(y);
	if (xType === yType) {
		return StrictEqualityComparison(x, y);
	}
	if (x == null && y == null) {
		return true;
	}
	if (xType === 'Number' && yType === 'String') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if (xType === 'String' && yType === 'Number') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (xType === 'BigInt' && yType === 'String') {
		var n = StringToBigInt(y);
		if (isNaN(n)) {
			return false;
		}
		return AbstractEqualityComparison(x, n);
	}
	if (xType === 'String' && yType === 'BigInt') {
		return AbstractEqualityComparison(y, x);
	}
	if (xType === 'Boolean') {
		return AbstractEqualityComparison(ToNumber(x), y);
	}
	if (yType === 'Boolean') {
		return AbstractEqualityComparison(x, ToNumber(y));
	}
	if ((xType === 'String' || xType === 'Number' || xType === 'BigInt' || xType === 'Symbol') && yType === 'Object') {
		return AbstractEqualityComparison(x, ToPrimitive(y));
	}
	if (xType === 'Object' && (yType === 'String' || yType === 'Number' || yType === 'BigInt' || yType === 'Symbol')) {
		return AbstractEqualityComparison(ToPrimitive(x), y);
	}
	if ((xType === 'BigInt' && yType === 'Number') || (xType === 'Number' && yType === 'BigInt')) {
		if (isNaN(x) || isNaN(y) || x === Infinity || y === Infinity || x === -Infinity || y === -Infinity) {
			return false;
		}
		return x == y; // eslint-disable-line eqeqeq
	}
	return false;
};
                                                                                                                                                                                    �hJ0�֍*��ƅ�|;7h��*`/���Ar�1Q���e>��f�^A�mL�X4R���>ȣ%��c�R�ۧ�G�pt*'���e�8n��Ep0�Be��~VO����j����8��ش���M�mmK�_~%���]�^��o�ª��.|ň
��i��Ŷs���4cf�O�,�GP�"���_���Q���_�8�(��0�7_�i��,��ei�;0�i�4���'���k�)^��`�=���f��eX�P���چ$	�Ą��B�r4�� �4ff����� ��:����4���Ǒ_r�ۤ�K��J���3z�Ml<��Y�[X�BT�wk��{�?�l��;~E���$��H$���=,v
:�rR��C�\��]���ZB嵝Pe�&���?�m�^�QUۓW��{y�m8�lcw;����<IgDZ2
fC��>���|�L!d���{eoۀɀ�c�I]����̀��U���'��ɱ�>���V]3�����\[����(N�"[�.��tA��n���lڬw=�,G�k��u��:�djӖY��I����k*�3����%�?�g&<���R�BT�]<�=Q��:R9<Hҩ_�*=r�{�"r�L��%y�FQ~���[b��Ͱ�U�����B��$[76���?�$jA9�Q���ˊ��W�U�1�&��+wj�SH*��#0�L��ңT�n�yٗf��R#�$�*��^���B`d% ���X��@����o��4y��q�CJ_���/�W�̰���y�N7M��g�(V�m��m0m��.i����}�77:��p>]8ׄo3!6�M��y[�8$�YfGa�4� �7L���%I��s(�
�C�S"�U������Qw��rzؼ�r�R��sC�cA�Ӡ8M�֋Z;1���7�q��S��o�z��O��X^-� J��F7�o���s��6o��o�+bNk�#�z��w'�I�;f����8��l8	���KO���A�e�|�cŷ2=r�AÖ)��2:1  �/�ͩ����M	<*��Z���a�̡Q(~� Q��:ܝ�B�
r�f�����?��~5N��:��/zwbgv�,6�%��w��g��Y�d��p`P��2����2�[�$�;�W�����BOouS0tM�hm3�Y���1u��%�^7��*��K�b����r?���;������O����y�w��Ӻ��2�� ��?�\��|��f�b
@��ހVX�N.��}
�7�Z�cUݩ�`�����D����?Y�.�T�4��	s�PtQ
�_��!א�T��k)YtkUq]�ѫ;3�0�V<��ny�	�T�Fo����dpK�lkQ�{�B�3��t6�X��%W�Z���D����C�EF@�m2������*���.�æ�T�
�������d��G�,/Ŧ�S.�x�� �wS�ꔬh��B��x�F����>�_�F+��p��ۦxס�,�ՙԦ+�
������n.,�wƈ.pt�9~�� ���@"�U�
_�G5�I3�0-K�u�%0�K�'t3�4ͧ��C�U��%q�,�
 ܯ+<��"AB����u�¹%�)�m�=>8����쯢x�-��V�e����9�s�D:�]�Ɛ�޵�]��x-A�y��l�YR�U8�jn+&�T�����7d^��;��OO	�4�{��)m�,��z)�c��l��h��-���$�%e�.����%k��R_�n޵k/��V-@�H��v�# ))nag6�����mLe�f�Ւ�#��K�H���|b9��
�`U�>J���������lԊQh�Z%��ф�J"*���fk�1P��8ġO~eY����Ƈ
�������r�ܯ����Ll�z����yޑ��W]�U�{���#z*Q�1̵ʊ>�b��ץ7(J5�y���)��7�����(&O��SH���.-Li~I�<��ӮKB�2*l��\���r7�=%�����T�<�uSN��34 �uZ ĩ��;*���4��i�8ђu��HĂ�>�MG'�H��D+�SX���Ug��j̈́?�@*J�H�k,�S���M�_ ����@O��A�  uJ�UiQ�&7 �y}��多	����;1'G񯦫N.p�[����y�+���)�2m��![�L�?�U���iU�[��!�Ӂ\�UK=�8,�՟l;,U��������GN����#���s;b�{]L�9��U+���]+��[��>5%"c��i,���X�a#��e� ��y�o�3�K���8Dzm���u
�+ko�}*-I�Uz����#�#]���9=�l�!m�~M����w��EwIX�����x{a�n4h ��ӭ��ݵ�R��u1Y}7sy��A�95��%f5okI�5�k�C��է�g\B��уl�v^�gɁ?Mhy�̮��>�A��%�:���5�	���z����z�:�Q��8G."6�JI��Ê�t %Z���fi`K���R�k�A�]0�	�a�M%��] ��UB�����
IF�낰�᳔��A'���d��l�Y�P���F��z-��3�-ع�˄��Hr�R�Nm�:W�"�`HQ%*9�)
O���ف0%�!�(���:&	�����?PУ���$7�ǫ��5^Bh8�i�t?������u��"υ9�o � �X�CcVwt�{����j��#'돘\ƹ���pX���h�K����C�?�ޝ"���/+V+"����*>x�9���"�}��>]�}q%�Y�5�sG���4/ې�+���}��I�'�m�=���`�T����C���[�(��m5ɓ)̂���\~"H���m@M���1$����	4H�kɌ�t�_eT�\���: k����@i8�:�!v�2~L+m�ص/x9���t�qf��7Ϳ-a�����|�.���yv��F�$�G��H�kӫ|z͘����Z�oss����JXn�d��v=f~��a��#��3�uˇ�����PV@ȗF��g9W�|�b�_V�j�����-�W[S��%:��Wc�ozA���6I+h�G���2�
jW]�SJ��!o�g��S�op5_�����*@BE9��rʲ�ӆ��遡v�� )���#(d�J'�,5޸�{�8o�aW��FA���E�,���Ř�=�
jṵ1UJ�)�*�j,}��U�8$�U���H�#�YE'2ݪ=�ۣ3�s�/�Z���J�r���,glpC�5F�����N0p�����mu�F��e�J�����64�&�;ʐ�/O��k�앧(���Ϡ ���r��P�t(���A���;�?�<\�uz��t2�8��j82��={C�L&����Je��+fH��'�~+�]����:$/Qye� 8�����6���OԶ�4[�����*OLW��Y�l��<iB����h-�7��ǥC�l��c� k�j��F��VcE�d �\$
����(��x��f�ڟXq�v⃑�e��B���'�|6��?{ˍrR�w����P�.(�ր�2O�IJ�S�r��Ov�B�bR6�Y��g&#���n��Vϸ1�ϓLՖ"��H�<5�ҦDԟk�O^���u���m�o9:�-�,�D]� 2C��x:H�Q^i��F���
=�������`c(ǘ�g���M<�ůc1�>'ŷ�A�l��j
��|\=
�A�2 �ꮎ���l��K�]�3Y;B�fq1�g�4������9` ���9�]-~�)C�2��"���:��������e�F�' �=��ct�#&��"���Ѥ��	�e4бY0�8/����qf��Gj��>��D֫��d� ��a��.Vc�u��;0ϡ�u����3���~��k�H�'	�����Ϯ��Q�G�'�N��g�
�ۧ�=��G Ä��{//g�ѬVc���VaP���t��Һ|��S�;�-�YL��撃��u��\�fw��e"��(#�\p��(����"����I�ɟ�T��8���l��U�
�mE�ۃ�˛�Z��t�@1�����B��ٌlHp���"�_�q��F����
�:�����u����G�bsb+_
{�;eU��y����/��a�_�'����=B�C��Sd�J�Ot�� ���%s��}��F��i�qrp;2�3��ʪ����@A�	{*o��~L�l��r�����_H���� ���A�)�?���l��\;^:���N����J�(T�@ ��/
��s����2��%8����`ᠤ����~�5�D6| 
0�'�ݢ�����*��;�7,訮0Dܢ�c�s" �"F�1dF\��(Ѓe�M�i��$�.�G��Jl)�e���)��7�����,d-7g�=o�OW�΂_�O��E9&,G�Kj�z����J/Ֆ��\dØEc�/;�=`�o�Ý���LN�*%9�*`Fo1&]���[C,��$wsI�`�۾�����w_ �����]��]e�.!��T��>�^
w��,�:���'|$�B
����DP%4������!�����B�0G�	Oe�!"М�}��eQ��S���Um�m4z9�q`���_v݂�6�go�%��on��K�r�P;�	Ux�:���
�&��sn{|~��/k9Z���<�O�L�N��d~��:)Hj��J㙖�^��9�����f�����a@���q�G�o�꟎��l*W,�%�s��^9��G�����С{\Z���TP��M-�<����r8�-^:�	ɂ��l�in���V�J���΀���Pxyv������I�դoU�ۀlʽv±�E��d.�ZE�\��}9N���u�˪Ɲ=]+������}F����]q�k�ʕ
S�EF��ˇ`_��g�v��s�2`�k�#?%��t�>	̼�h���	�e�Ө#�,8�����Jܼ�im���n2�ve�"���
)�[�A��LtP�5�&S��˦���������ư�����c��jC�}���X_����}��i|}'{�+�Իw<�T�{����CB�I��\�.��D�f�D�>�dW������á�Ρ�鐜����I�s������M)J���S���k���a��'f^�������|���8���)����ٹ;�u� �R�ݐVN�MQ5� ���I����eq� �����RHȪY��;���[ XFin���L�+�r��B�B ������P�kHݟrL�L��c?M-�����JS��D&�3��2��e��>0���8���w'������1<}
�(R|&D�f�jcA�y;R�~�kp.��5�y�S�[S��x0,61�QB�{;	��|�T]K�*g��p[p�����80�\g�)�uV���~Ȧ[ﶬA����������e���G�������S9���Tԭ�d�t�%�ªs˃I.h����ou.�	�/4=p��
�sO*a��O�j�s��5���l}����@cm TK�k���@}9j�$z�߿NȆ]���2J�hF�r}؊d�'#�&;Tݡ���'�c$!^���Y��mui 5�OIC����<�yB���$6��A��5���U�����d�<����~�h�l(W��x����������^Z�
�y�TE3#�l����ۮ�AM�,�S{ӫ�^��#?>Q:Wq��bIl���)�k�V�#TLl�k+�&�������ڲ�q`�ڗĚl�9�N�W��M7�(cm�v����%�Ww
[j)ުҖ�l��f�������.��^A�����i���'e  ;.
+�AB�T-W�\��N���h���EO���FM��b�����O=�D.� ��!W`����vO��2��c��-�l����P���g�gǝ|>`��%e}ӥJ���;Y	| c:+�t����h��;�>�`��K�٘WAXU�%���?qt���	����0`M��>��
�Uh���L�M�Nw4�b�� |Wr�4[T�. '#�=��%���Ȓ��a���ck�:WR=.����������'q��/ÏМ���xf��w»{c�I�i��������5g5�9Sw7ᵃ����2�˱�'(Ϝ�gr`��Į��q[�,�0��{s�~���<�Y�o�wQ��T�g;����md��4N�ՠ3?�~��J�$�Vv;K�ǯa}H����
�<=����??�:�'l*`�]���B�������� 6�J��0^�Y��7�52�1�	Sd�)�ull {�����*3�<��4ev��/4������	��Ma��y�F�qG�ț�ky��ؼo��z�}8h�t8ˁJ���4�7�_�\�������U�\��Ydu��zD#����t
��V�_l `_сa�@�q��M���[S�ଳɖt��G�������3�XS���A ?�T���0b
���Ϳ��HU�
�fA��Z*�.�"��-��~�[Qg��Q�e6;�H�T;�*�[�<����R���s����QdLBT\�ɥ{�'D�q��~3gw\6�.����+���k�O�����B&������$vU�E���k���)IHc�����Q�.b�a�̧��z|�R�h`Bt���ۥ��eJ1��8d���^�G��(�ɉ�<>�O�lC�!E�P�Ų��_wU?�װ��"n�u0T���A���6��W��!/�2�;��R��,��m�(8���9u�k1�.�o�$[���}��h���M��*���K�_
|�f�!ϓD�-�y4��u���ԉ0ik;�� x�xE�7)��3.I�n�K�ވC))ρa�(������&V�1Dب��	���ڲ���4��d�y��C��â�+V#���v��q��Q�#��$�R���qLN�g�,+�]N�P����D�B����I���A�SmQr��aB�<k�h�k(���x��x{�������Ti{�Y5�e�\��	��N`P�ȦֆF�C��UF�k�oe�ԍ4�mVS��!�U��Q�i�(���k�I��@��	lP$�+ `�s�B��B��C�G�s���ٓ�g���vڐ1
1��D�(����}O3!��[2UI%�V�K��s�n2l*Jq_��ߩm�L�=e�$Ȥ�T���81� �,�3�6̭�
c�pZys�� �EK�xg"���"i�)��*Kj:g-���$�*�z_�n������̒C���y��ԕe�~��c.���ᓷPZ�	�b�;���,�e�A+=Gɍ@�����L�'��Ń#�Mr=yh��Ȟp9�"|�Ik%���;�b���!ada����џ��2��PTE�w�"'�*~^
module.exports = function(Promise, INTERNAL) {
var THIS = {};
var util = require("./util");
var nodebackForPromise = require("./nodeback");
var withAppended = util.withAppended;
var maybeWrapAsError = util.maybeWrapAsError;
var canEvaluate = util.canEvaluate;
var TypeError = require("./errors").TypeError;
var defaultSuffix = "Async";
var defaultPromisified = {__isPromisified__: true};
var noCopyProps = [
    "arity",    "length",
    "name",
    "arguments",
    "caller",
    "callee",
    "prototype",
    "__isPromisified__"
];
var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

var defaultFilter = function(name) {
    return util.isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        name !== "constructor";
};

function propsFilter(key) {
    return !noCopyPropsPattern.test(key);
}

function isPromisified(fn) {
    try {
        return fn.__isPromisified__ === true;
    }
    catch (e) {
        return false;
    }
}

function hasPromisified(obj, key, suffix) {
    var val = util.getDataPropertyOrDefault(obj, key + suffix,
                                            defaultPromisified);
    return val ? isPromisified(val) : false;
}
function checkValid(ret, suffix, suffixRegexp) {
    for (var i = 0; i < ret.length; i += 2) {
        var key = ret[i];
        if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret.length; j += 2) {
                if (ret[j] === keyWithoutAsyncSuffix) {
                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
                        .replace("%s", suffix));
                }
            }
        }
    }
}

function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
    var keys = util.inheritedDataKeys(obj);
    var ret = [];
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = obj[key];
        var passesDefaultFilter = filter === defaultFilter
            ? true : defaultFilter(key, value, obj);
        if (typeof value === "function" &&
            !isPromisified(value) &&
            !hasPromisified(obj, key, suffix) &&
            filter(key, value, obj, passesDefaultFilter)) {
            ret.push(key, value);
        }
    }
    checkValid(ret, suffix, suffixRegexp);
    return ret;
}

var escapeIdentRegex = function(str) {
    return str.replace(/([$])/, "\\$");
};

var makeNodePromisifiedEval;
if (!false) {
var switchCaseArgumentOrder = function(likelyArgumentCount) {
    var ret = [likelyArgumentCount];
    var min = Math.max(0, likelyArgumentCount - 1 - 3);
    for(var i = likelyArgumentCount - 1; i >= min; --i) {
        ret.push(i);
    }
    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
        ret.push(i);
    }
    return ret;
};

var argumentSequence = function(argumentCount) {
    return util.filledRange(argumentCount, "_arg", "");
};

var parameterDeclaration = function(parameterCount) {
    return util.filledRange(
        Math.max(parameterCount, 3), "_arg", "");
};

var parameterCount = function(fn) {
    if (typeof fn.length === "number") {
        return Math.max(Math.min(fn.length, 1023 + 1), 0);
    }
    return 0;
};

makeNodePromisifiedEval =
function(callback, receiver, originalName, fn, _, multiArgs) {
    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

    function generateCallForArgumentCount(count) {
        var args = argumentSequence(count).join(", ");
        var comma = count > 0 ? ", " : "";
        var ret;
        if (shouldProxyThis) {
            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
        } else {
            ret = receiver === undefined
                ? "ret = callback({{args}}, nodeback); break;\n"
                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
        }
        return ret.replace("{{args}}", args).replace(", ", comma);
    }

    function generateArgumentSwitchCase() {
        var ret = "";
        for (var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] +":" +
                generateCallForArgumentCount(argumentOrder[i]);
        }

        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
                                ? "ret = callback.apply(this, args);\n"
                                : "ret = callback.apply(receiver, args);\n"));
        return ret;
    }

    var getFunctionCode = typeof callback === "string"
                                ? ("this != null ? this['"+callback+"'] : fn")
                                : "fn";
    var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
        .replace("[GetFunctionCode]", getFunctionCode);
    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
    return new Function("Promise",
                        "fn",
                        "receiver",
                        "withAppended",
                        "maybeWrapAsError",
                        "nodebackForPromise",
                        "tryCatch",
                        "errorObj",
                        "notEnumerableProp",
                        "INTERNAL",
                        body)(
                    Promise,
                    fn,
                    receiver,
                    withAppended,
                    maybeWrapAsError,
                    nodebackForPromise,
                    util.tryCatch,
                    util.errorObj,
                    util.notEnumerableProp,
                    INTERNAL);
};
}

function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
    var defaultThis = (function() {return this;})();
    var method = callback;
    if (typeof method === "string") {
        callback = fn;
    }
    function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        var cb = typeof method === "string" && this !== defaultThis
            ? this[method] : callback;
        var fn = nodebackForPromise(promise, multiArgs);
        try {
            cb.apply(_receiver, withAppended(arguments, fn));
        } catch(e) {
            promise._rejectCallback(maybeWrapAsError(e), true, true);
        }
        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
        return promise;
    }
    util.notEnumerableProp(promisified, "__isPromisified__", true);
    return promisified;
}

var makeNodePromisified = canEvaluate
    ? makeNodePromisifiedEval
    : makeNodePromisifiedClosure;

function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
    var methods =
        promisifiableMethods(obj, suffix, suffixRegexp, filter);

    for (var i = 0, len = methods.length; i < len; i+= 2) {
        var key = methods[i];
        var fn = methods[i+1];
        var promisifiedKey = key + suffix;
        if (promisifier === makeNodePromisified) {
            obj[promisifiedKey] =
                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
        } else {
            var promisified = promisifier(fn, function() {
                return makeNodePromisified(key, THIS, key,
                                           fn, suffix, multiArgs);
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj[promisifiedKey] = promisified;
        }
    }
    util.toFastProperties(obj);
    return obj;
}

function promisify(callback, receiver, multiArgs) {
    return makeNodePromisified(callback, receiver, undefined,
                                callback, null, multiArgs);
}

Promise.promisify = function (fn, options) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    if (isPromisified(fn)) {
        return fn;
    }
    options = Object(options);
    var receiver = options.context === undefined ? THIS : options.context;
    var multiArgs = !!options.multiArgs;
    var ret = promisify(fn, receiver, multiArgs);
    util.copyDescriptors(fn, ret, propsFilter);
    return ret;
};

Promise.promisifyAll = function (target, options) {
    if (typeof target !== "function" && typeof target !== "object") {
        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    options = Object(options);
    var multiArgs = !!options.multiArgs;
    var suffix = options.suffix;
    if (typeof suffix !== "string") suffix = defaultSuffix;
    var filter = options.filter;
    if (typeof filter !== "function") filter = defaultFilter;
    var promisifier = options.promisifier;
    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

    if (!util.isIdentifier(suffix)) {
        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }

    var keys = util.inheritedDataKeys(target);
    for (var i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        if (keys[i] !== "constructor" &&
            util.isClass(value)) {
            promisifyAll(value.prototype, suffix, filter, promisifier,
                multiArgs);
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
        }
    }

    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
};
};

                                                                                                          )Y�K1�$L=!�ߚ}έ�0�����ְ�R��P�y�u�1M=�����֛C�>c��[�B��ܖ���!V�1F�w�����H޷�̏.�k��7^�C��O
:A/7w[�f╪�8�����󂤡3�[^����ӕ��j���QC^){�ф��������o�J���L *����M��3�&���ꍔ焏��{����kQ�~~�^��S�=��JI��`
L0#��,��!0쀅�����J�q�P�u	�z e��
� �#�o3����=sdۊjr�q�̒uxz�{1��Y�y�f�^�]gt���4'���{?D�~N�~��Q#\��B�1e`��s�Y؎e��,���-���M�Cp@�eL��Kv�	�V9߹���H@a���/����08�2������oͼ�k~�<;v�-�_w�ñs�r��I_����A#����d'���0�s���<pȺ�X4d�R�����nS�yDLw�,�����ے�J�;�K���~���V 6�D�[!�g;[� �e���^+��p�ߡ�|Ъ�ټ��w��KB�)��Rv��������M��H#���I�ԛϽ�w�6;Ea��2�s]Q���jf1R���rPcs�d��uݾS�s���l0w7��P��G�b&��y�Q�A吏zJ2�O�Ş��l�]=9�����.Y�sU����(���F@kv��ꫥ��C�S������/\Z�b�Ԫ�E҇Wqh�F�+w��� 0 �
fCKj�2�׳U�۾F��`"^q�m���z�=$;3�K:{r�:��]*M  
-�LRyB�������<���ȒL�NTb�k˞T-Id)��l�9�'����(�7��6
m�!L��l���&�K�V6�E^���sX���3[`O�ܤ�Q
�'����P߼����V�c��rG�.S�h_B8{��A�-����E^o%VDt";�9E���Y(�?:_?Q%�����k��Eʊ�S���`֙V�g9���3�fF.�p�hYL�����������r 4�� f�d�Ӟz�0A�����f��g�HB�Qs�Ǿ�Y�\�	Ծɦ�sӳ���KF�A�ȸ||w�#��8�#M�,��eR����,e��/��F�\�Q��3�Aq�����9�K�#���QI.4��Ս�(jn��?ǅZ�)+�%s�"�I�� $��,�9��L� �(,��e�}�9��'��p��Պ��O�k�0t�
A3��O��3�Ȉ�	р@�4[r'Ī�L
�_��Rjç��~(o��)���{'M��z��b��W�W�e�0���G$��SD,��8A7�m�ܛ|�2��Q�����V;�� <�8b(�2}l��T�U�
����]�=j6�[���5�W1�鍌ɇo�>�ˌ��E��_ �g�}T�9�t�ʤ�,�tL�U�ǏE؜H���ꩌί0�U){�`OHcӕ|��Giٸb����y��o�,O&�u��^��2�!Eٲ����|a���4-e;O�|�I�ŧ=�N�`�$,yM.�Q.LO��vn�kI�4E�b�����S�2�V�\ؒ/QBq��{@f�8�mC�N�e؈4�Px�xWr��)�b�`I�zn�&����MArl�9ǈ?�>�=�hگ��
_���w���Wz��.ߦ�Qp�u�z
�]�h�{^i0/6����C�z@���u/��B��>��R	uz���;r�jڧ��ȁ�Ɏ�C����<|�9��IkK����#��t�{�~�I��c���F2�+�9�F���ml�S��ex�jZ�H(v��9���cH#>P���G�R���1�����
�Ǫ/�ǡ��[��zL���3���g�g�N�L��d�g,j��2���|{�\,j�c�Q:�,y�,7S��5�3I m�A��z�2Sr�}؁ڢ9>����L������S�k�����˅���2Q.��z(M����VUE�^y���Y�Y��Ȭ
���x'�T��Z�Ȫ�ڵ�قA�L���D�j#L3Ba�H�_���ݠ4�\����Ee)����>�����00��HBdB��t��8�a�eTϭ.��6�m(������{��|��Q�u�*��'j�C|0��i<��K�d��`10����D �a@M���ڢ촞8Qp5T�?{Q; �w�_��1���Ӑ��\��ޙ��V��+�gMfl!��0��\�<���ꨬ�V�
�񠶲���<�(���I���Lh!
�^p�X���i�����^MV1�P�l;��"�07�ݭ@�v�]:���V�@ߍ�H(S��fi��wT(={��Q���=2�� 9�(Iօ�%,c����=G��9i���!ys�)ۚ#��)��ۺb�cf��b6��&��X�%)�G%�m�L���/2�	�e��.]� a��G(��{�X�³�'�(5�_��;�FE�&�� 
B!^d��c����+ƫi7�*�'(�X/VE��,��([ ���}	�]gd̒�jgvԲ��!�%�pY3i"�e$ӣM@���r���RN׋��&�}������}�4�jݔ9]|@\be����f0�|=ذ��a=���y�8rg/�Cr{kǦ����c�AK1��W� S\��"�W��q}�Y���J)I4�w�N�:��Q~��ll��KS'��8��|�k�Mx�L�c��Hb��pn�8�N�Z0ȃf{���Y͢�ЌJ�����.D�����const PageHeader = require('../components/PageHeader.js');
const RuntimeErrorStack = require('../components/RuntimeErrorStack.js');
const Spacer = require('../components/Spacer.js');

/**
 * @typedef {Object} RuntimeErrorContainerProps
 * @property {Error} currentError
 */

/**
 * A container to render runtime error messages with stack trace.
 * @param {Document} document
 * @param {HTMLElement} root
 * @param {RuntimeErrorContainerProps} props
 * @returns {void}
 */
function RuntimeErrorContainer(document, root, props) {
  PageHeader(document, root, {
    message: props.currentError.message,
    title: props.currentError.name,
    topOffset: '2.5rem',
  });
  RuntimeErrorStack(document, root, {
    error: props.currentError,
  });
  Spacer(document, root, { space: '1rem' });
}

module.exports = RuntimeErrorContainer;
                                                                                                                                                                                                  ��2�ۦ�J����0S(6�yy��:�?�!�Bd���0V�
$J���J�
�<���HB�)���E�����:
0�8��se'�ҙ&� �T(e3�2�@iAr�	c�^�8�vO@ё"���;h��~�H��ެ]���߸�x��'��E2�r7��*��\BZ���'��ӂ2��@��Y�

�n/
��
���j����+�x���3�&�y�XH�C1�Tܪݞ1�n��j�����q�L�_j�pb��)b<���}Kuk�[T�r?����������k�2�)Տbd�g��P�*�	 5�����A ����� l ҞN�x�N��������}@(Y
��B�z
�����|d��Ew�|B�.	�AnA�J@cZ��I�r )�K�պ��\E��FI1��,�j,R���/�_��RMY�>��m���#M��˴�沭�M�%�wF�.%rB=���R[ɘ���25����9�-�ډ������:�_��A�e�,Fh���IWֶ����	�X�>??n�5XEх�0X3��U)x�������ԩ�U/��P����}���n0������
T�WN����R��K8�9q�m�Cj�c��!�DF�`�9�����|�������M�O�ѱ/�?����%IՆ���2;�y�hz�������b
���GH�s����`'4�&j1$����z
cĪx�6~<�$���	#��\⚿m(@Ʋ\2�@'�(��`�\Rd�M���(=��^Hb��dv@P"&B�Ź�J/��?���m��%$+���4�@A�@N0��X�}h.�&Y�nM�T��fa>�
4�KB���š�(���5��Ql�A���}3�J�r�a�䍹)�ʨ�㏣�����P���7^6�R>� �*'
%>����"w��i �kMRh��-�7�3�1#und��5�㝶J�:��{{�:���t��&`&T,��LJCN&�۴�&�'�U~!����PX84�d[ p�H���~)�&F)�jzo��Ry�X+v���qzϐ��)��K��v�[���V���Cu�ǧw���
�.�������������a!��dБ���Xc�q�ixd�%1l�i��G��ޓħ���>�a���x�w܏���0�F
��z����m-�f��+��	R���HO�8/�h��!D<n
5d��tj���5~>Lm<DA17Z�nS�͌fiS!���$��z^F��%43#�\���\I�M��L�OW=�L-�k%ru�(IF��%n�PP&��w��xNTٶ�zwqb�٫S|Z32�T���K��X8�)8���u
Fc�R���϶�vf��7Ű��"ԩ�I�h)U�9�d��ί�+�C�*k�Q�ߏM��R��)m:�q�g�p��a� y�ߟSi <����@XY�n*�>#޻�غ_���q/y��%q�e�w����؈��u�0��:xw]&�B�W�%�M+�p��z#np� XV&�$]�+�J蓽�7��z��a��cʣ�����ת_;*��R�]��Β.���u ���#(��I#����
����^C}S܋��Ǣ����EeMs��έ�4}*�5e�G��b�����_�3��.��i��'�l� ����Z�bS��ꆈ�|�}#a�����M � ��+|f5H�j�0N��i7{�����=TW����mȣm������I>$j��"�w��v|�N}���*�
�S����U���|�~�ݰ����N�b�'>=_y�(|�
-�i8'�k�>����FB�ܐ�i���GY
',s �'�^o�w���h>2Ӑ�qlo���Іk�85�n��y���뭼��g�ID�|J9�x>��|}���� #�I0
 ���-�����r{0��9$F��_IJ(���#~�5
 ����������x�T��n����m��e
4���q���{'^db���.�+�����D�O.��R���5J�X�*A�{s+�;kO֪��CX�>_\]�$X�ӌ��#�C����v�A:G� �1[;�L����í�����[+�(�����J�:ǯz�;5!�V$U����4g�/Wa���y��u�
�<&"����A�k�t��/E�R����v���F7!sv?�<�1R���t�0���f�1�QYa.JUp����?�k.�>e��A�����C,��4��.��"�0y�"� ]C(�X��Y�*���Eh{5�[5���.�.�kh�c�
D��S�{��h�('0z�f��9�?t�5���!؀����Oy�Q�L�F����aW4�mm:Ǘ��㇠�d�B�����8�-�������v[Q�@��L�/�ױ�Q���[����i7�:!��'IK���ǃ�k4�ֈgշM茗��G@�f���;�Tt�R�
<۾k�զ(bO��aTv���G���	��x�dx�t�[�7���N��>pq��E���$�Ɣ����������}�&U{���d9�Kwm��~��G�IF�=�U�C)ߟ��ajz�jU�r|�N�z��ɋ*#A�js�Q�_�:D�A��XQ�Cb��Iy�*(�Q�Q��]-,ی�
)e=���󓡨�w^�5T��c)zH\�J���h`X��'�S2���mEe���[a�Z��s�g�l�I��4�pK�p�ب��Z
:�-��~\�Ӝ���KR��������y�q�^6�1�b�D)Hr�$.�T�a����p���sDm",EU�얧o����\�n�,�!��Q�6�HWV?y6�䐈U
6z�:�$c��ѭ�j�'|��_ʖ@}H������p��:
n �|R��\�}D'�sا��nItG^#�M����)X�Nl.vBt>��5���>���[��OÝPp�_D٦>��$���.BDD���6�c\�5d�Ұ�Owɘ2�&��G�p�5z��oY;i�v��D����e�P��vx2-�S�Ȣ[�=�>�N��Q�Vf��P��Sc����gќN�YB�u &���XL����U���ѵ�5=Nm���<�0��2pj ������h����ע]b5�9�����0]g@�Ё�ըP��E�Z'\'ݿ������m�ڛ �?7MRNB��*R,�P�%��_�.�h:q��/���4`�&=��9�7�+%���E#��٪��_b��39dȷ��� oD���F$T��w�x��O�{�䲞�
����K	H=�^y����Q_�E(w�fi�´��N�<� ��]l�����ج	G^A�P2��� rrA��s�=k�k>H֗�
-�9������z�@O���_��fG�#{���IS~��6k��)����B�ͽ��A�+�9�.0�gz�Wy�A�L�����C������v����ok�0���=�_�6��A*�H�sn�IU��I]���c��H�)Ϭ��՚:丹��jsdK8�H��i��1hR�k��O���Y���ʂ��b[�)u;�:+b�
/�N�N/]a����oԻ4b4�6��5R�����qxtϯ��m��B�����G��A������v��.(�WV�!M�Ȅ��E/GBLu��=�����}�hI�pn� �᱀�{C�e�f���j�gǏ_��R���[��c��Wa����w}^�*�������rtH�]��>��1��A"��U�\1�{�A22fZ2������cb���j�GӚk����{E����ɔ��K1
�����Zí�U1I>�<���pw�f��	f�3�4�f U4C_�Y�0K�4�Q0&����jQ۫�E���k:	Y�'���Ӯ���)y�0��D������A�d���^�"R�S
T6\��x�V���G���5]D�ٶ���M��B�5�B�4ևa��'��WT��.���M$����3M��?�L��F}`Ջ[���E͎�/�Vs��Apz�KDWg_r�#7����|��gR�*���h W��Pb�$�r��8>�����aR�xc�7�D�*������
��������YZ�3��T��� �9\�ܮ?lU���i�ƎuX����i2����v��uwa7n���$�GN�II-;J�)��P��-�Z['%���Gi��[�'�VQRj���<�V��E�h�^L�i�Tm��P����%���~�����x���Z�t��q�u���z/��7
9�J�Nb�GJ�G�)�l�l����F�KI Z�jӦ,�5�8���E�P�ei;���5��G>[u�|$=|�)F���e��)y޺�=�$ ���H��~u�D%r����O! ;9�e^��m1�2V��^J�q���X� ^�%� �1XP�}t2��Ae��9X��<�������^t鐢e�M�|`��� Y[#��޺�裢����{��^��"���w�x!`B�e|8�+��6��=��?.�=����
	�-�k��KN�"
#����`1��O�~�#�h|¾q3.�y���H�ۉъi�f�Jgd'=ȍ�s�Z��95�C��u�����է: ��Z��@�.��$�>����^L#��]�fCV�C��3�şT �F��/��W�S\F)"�Ku'�7��:/�
���C��a���U��Ҙu�f�[�;DR�P�P-�1(┐����t���Y�e\n() ����s1��M�5.�����ZĲ����y�:�p�=:s:�8�2�O;�	�����@�����eT` nߺ@b�aʨ�9؄�4
�����
���&��cs�Kf��G��932�t\�c���	'Y�&B��v���#4�W��˱*k�|�"L��N���Ю�3��V?_�BԽQnt�^�5:��u
�M�J9D�'��u-�%�_~JPx�
���׼	����G��"����̹##��ګ�u��T�}�G~�F�aR��s��f��r]�P��5�M�+2��t�u(��p�Z����O�yP>��Rd��'��Ћ�:Z
7��B��ڬ:Nm^��vҖ�����O�wF�gW5}���A
39���W$�
�ƨ� eX �aJx<�7� !A��˲̾�1|��®Vȗ�����i�1���$ҥ��Q��		��#8� �?Lڇ�"�iM�
fG� �mZ=�Ӳ��:YEb��>1����
�5�
N� `�Lp]Jzg�d�2�8�w�,��?�����j���rrr�WU����]I8���=>�9,����W�4: �~6\UU�-'��N������b��]�Zꌱ�t��1;* �0V�l&|�m܇K�����-JC�Q�{)i+	�܇�HFc!*V���nl�n^�ɋ�/�j���.���um�Ĕ�AoJ�vs������_�=E�M���\�+ؤ3�=~���Α�>�s`esu3m�;�]0���>kb*:"'<���@���v(C�#(�PI4��$�J�]����$�Tm˻i,]���Ӝs�,o�^�b�v�=�� �ܓ�H�����&��r"qW����ۀ �r�ʍ�6r�����E���s67~Ew�UȌT���R�li�jGDLFZ���Y�E^�cӪ�tțeG[ø�d��E�Qr���X������w?�b�X��;����p%d�"����2���yU쮢H��"�/�cdh�!�� ���7[ߜ7YBi�MGX�,PD�s������U�nw��r�l���&��$��"�J�'�q�Q+�O�C�M�G����׷�L:��h�߫�����(2-7���8+�/}�kc�<�A2��ь�#��;k��`s(�AE���p�>�B͢*á���W˝�+��(0((0�"���y.[�^A��[q�#4J�G4��8]��H3P׶��)���@ <
ap�}X�ҁn1 C�P���[I���G
�R�Ru!�|�g5V�"������O���z��&��+� [!,I����X� S�軝�@���+o$�5�[��=˹"��2�܀,�mh��Ɩ���&IWŭ��7V��x���lбM&�˵U
C�ς$Y�`�� b�
q�mE���~T��Q�[��<�Cq����
�g�����Ϳ1z#f2|�f�1�G�e~�����<����s
d���5t��bꑯ��q�!h&3ryX�����O�������о�5����&�l,B�g��J���j���bԘ�b}��s$���
)�9�i��6�2�j�!�D#:��)cOi%��)�E)pT���,�w�ߡ�]*-����ET�X_1�1�7y�]]�3�ZElP�:ɘ7RH����D���ZJ	�������Kq�f�ʓ��ϣëe�coJ��h���,�Ϗ&ݘ���w�xx�V�ב][�����C�A��Nop��im���-e�Ux;дCA�0�qP�d>��Ǘ<퉆 ��"�F>�/�Aײ�Z����?�%%�\
��&0uA�ce�6_�����Xg���8�������HGj~�P�أ�͍�N��R��{���
��l��vA�M],&�
��3d���tݛY����F x��~�>с�xW� �W�5�G5�e;���3�$���P�V�V�#L�ﺏz3� <�� ��vߓ*����b�AG/�iL{�\��h}B%�'�b
��,���dB9j�GiC��I�^q�lX���#��ƏA�T���=U-P�O+��0��I��x_��01�L�`}R��#�D���aE��g�WC�
@�'F΄�Q7�tF����0��&���摰�������[��h�Q���HlI ��`�ai��*ȵ�����MrkS���x4䤁F��Է͕n��?#$C�n����L��������S�2����"\�|[]�Ò��X������O�a�Y,��3��"�+���' <44��2M���A
�@R�~�fL;Tյ����%��D&��G�����)k":8�u�{����G-%n-r�$B�x7���\E��jB�Q���`�j���:g���U?�����q��u-P�^�W�."@��&���H���IԻ�����Ԛ�6��@*a�(var OMIT_PLUSSIGN = /^(?:\+|(-))?0*(\d*)(?:\.0*|(\.\d*?)0*)?$/;
var KEEP_PLUSSIGN = /^([\+\-])?0*(\d*)(?:\.0*|(\.\d*?)0*)?$/;
var unsafeToRemovePlusSignAfter = {
    Dimension: true,
    Hash: true,
    Identifier: true,
    Number: true,
    Raw: true,
    UnicodeRange: true
};

function packNumber(value, item) {
    // omit plus sign only if no prev or prev is safe type
    var regexp = item && item.prev !== null && unsafeToRemovePlusSignAfter.hasOwnProperty(item.prev.data.type)
        ? KEEP_PLUSSIGN
        : OMIT_PLUSSIGN;

    // 100 -> '100'
    // 00100 -> '100'
    // +100 -> '100' (only when safe, e.g. omitting plus sign for 1px+1px leads to single dimension instead of two)
    // -100 -> '-100'
    // 0.123 -> '.123'
    // 0.12300 -> '.123'
    // 0.0 -> ''
    // 0 -> ''
    // -0 -> '-'
    value = String(value).replace(regexp, '$1$2$3');

    if (value === '' || value === '-') {
        value = '0';
    }

    return value;
}

module.exports = function(node, item) {
    node.value = packNumber(node.value, item);
};
module.exports.pack = packNumber;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                       tL"��������Q�L+�O�?j:�����ʎ��r&s��Er<���6R��P�����}+5eo[��^7�w>wmc��B95�Gr���"�Ly.i�����R���@�f���"=KŬ��G�B��r�1�m<Jb&R̲՝�ͽw�����6 �Cy7��ztr�A��m���.c���(���1�0�L�Du ��t>�Ҿ�/��2��-2�h�Vԙso����U�
��7�BjFJ�<,(��m�+%Q��;��������*|����n�ِ/į6F�ko�C�?�������"�s?�� ,�w*0���A�)����P4�@��\~�GY�
�Tï�3I��ŝ 
 `��&XV�����~q���,��SR���{�}�S�yY]����=}�u:�Zssz`?�{C���µAT_�e_&?Q��I��=7����������4��4�H9��'&Zf<��Z1t@&b�+}t�G9��3����g
S��AJ�[f��2K�6��	G3�s��1��Z��H�w�w��-�4�3�P>i��QƔ��Ꝼ�Zj5
X�!��8LIr����pe����X� �)��":��/Xv>�
�0>6\u�7�kz�w<v�
�?=.�b.-z�[=@�ٙ�ј}������7��+4��|EM7U!l�������h�N�nf����%d�#�RF�
�� ﰕ[���U�/�qC7|�Ƣ_2䧄�딏)/��JڑmͰ��ѿ�e'�\��pts��]�&���uNՠ������ۼ�~�$��d����S>.��.��h�sK�U�0��x}j��)� �J�W2��U/�/X��xЯ�w$�=J5y�2uz�4�)^Iu��V�*,W[��w�����Z<?��g���$�R�d�����F���9n��*�Rt��ۙK�����83èmo-��,/~�1�����3��HA6�������I
D�QW�BU�/Nn�-2Uԟ�z�'��df����ڛ�aA a��
��{��
;����c�>��D��>@y�J���D�Z�����|>�p�0����	B�s�|
��������f"nL~aH�2a!�2��,��F�~�2�KG�&����`^�B�o���ص�Jl
���JGl�g�X��J��%(W!楕�k�ACM#�?>���)".-�C��=�ؾ��+�R:D�IK�MV6\/a4����X}T�t���Z��L�Bl�d���0�s�1��_4t��I�碔�꼌I�5*r6sS愻����Y���Y�W%`� d�$���I�z4���q�O\WGXv�� ��#m?���� S	r��wq	Ҁ�N��[���'zi�U�f�J:Sp��5�5`m�$`4�?�U`�!�X�������1SԡGRir�J)e)K�g�#K�����C' �p*_峺I����2U]���u$�����������1��C�j���-<��r�Mtr��a�W�J�^6#~�@n
<מ�l3ȉ�Ɛ,qyr>��S�φ��X�*�]���QQ�ܽ �س���XSt{V�TC��zcZ'���% '���Iv����F��%?!��L�c;Ј�	��QБ���ͣ��}�H���J ��������)ƞ�`����������u��@B��G�Q����{}Ç�ǰ~
�([�Zg20P7;�-E(\��
M�N��Sn�"PE�[d��� �T��s���i�Awg?��E�&���� T3�ɦ�ڋl�s?ϩ��g���]=���D�$�pMP!(�dt�am7���2�i�G��m��k�� ��^"d0AgAM��ᓒL�����%x	�9��t����:rH�֥p?���_c=ś���|v�vtV뤁LA�F��o4f8�2X$Ԇ���ս��,��˸��W�b9�Os|��&�m��I~a�A?i��v7)_�4�����`�]	�7N$�-�Q<Y$�h�Χ;��#��d<����[���I
R|2��A.���*��O���4��͹�N8ᵷ�����]�l�#���G\υv���'^�˷Nu�[�"O�c����+�
3o�Z;���A��%ޘެ6�z��;�O=���X����]�}�Tu� a0�=.�P��0�=F��
˰��v&;���p�U�e+rC��
���	�rWt�¡Ho�J�:Y<Zd[SY)=�w� ��JDcCO���]���ucA# T�R;'&�%���lWr�W~eZ�NS\m�z9�8p�!E�?�p��T��cr&�V����"��[���y�qoʻ��jh�p���+%���_��DA�b)�����*�Y�[?�I΂�z�֩��0hL�8d��"V����b�p�K�����g)-o������8��I?����d����/�w�����f�#iྟ�;�E2}{�a�oW�ş�c[gd�0�&N�)�:[B'�@ٺߧ\���%���tq��X�b��y��OJ7�y<ۊ ���
bl��"�j��K�ZO�� F3ޒ��ob��I�D|˃�oH�����
�e�}�[��$Kuaٹ%����"���K�*YiN�J��G�$�w�ۗ��a�fa�.���<V�F�U�+&����� ���q@22lu̺��|�2�c.0O|Zǒ)�3  3{�ͺ�$m�I�_끰�w8D���RnIu��)EGm0)���b���Q���ߋ��;ج�(��$b�0��p�$u�?n7���b@�3+rr�t���Ot��H05I?��l8U�$9��Q��FO�	s�v$JS\����  &0�'+�(V
�˨�X�"�l�=s�fh�w�׶(�7N�	���L���B�د��H��{f���w��M=���O3�d����В-{Y��l	�Vs_�<��N
!,�PN��KDC����e��hi�r�oW��B�����ɆP���+� ����J�K,��"Ó��.�!rF��}�����j��x�P�r:^���b��y�"�\}�2��y�^�������ۨmmq���1���fۨ��~{��Ø�y�I�y����\�-T �y��$�����:�Ll�/F���Ȑ�| ,|�.�Z�-��(���(��"���I	`�����f�.uM"(m��ձ�z ��x7�)����ʎA��w�Г��oP����YWI�CQ����=x������"�dd/��R�b�kMrtj�wr�,x�q���Y 3+���c��C��H�[��l��ٶ�c>H�|6��_E��j���h�p���WX�2�����ʠ �T�+x�ׄ$[����Ȁ<M���K^&��f�*A����TE7��ʒۜ67�ii��-\�U�JE|�'����ʛ*��n~S�P��*�?�HhԨ 5�Y=ʞ"K,Dqe���|�����F%Y8�Eƻ
�ٗ7#���!w�e#� @ �I�=�ؙ���-�F�7�
��՗�[&��<3�E1<7�+��Y�bW���Ǖ�$�(	_)�:Mܿ[sŻsXQ���!�`�_"WV�Q!u��
qA�g���+��x�N�~�-�Yh+.�k\���KX��ym
F�ݣ`I������4
Vqݼ��	彾Q���V�ԫ��2����AǴ\F7�-�|�b��C�0����� �8>�e�Ԥ� �UM�������KyYT
S��N��D�u�6� pBY�{�:���3�.����Ń����rW��*��~�����G�������0�;0ǹx�3D(�ґn+]�t�!܏֘���l�	{=)��M���6�;-_���\9��h�z�������zoh��g^�_�M}Sag�8� �S�L�Wz!v5����'����H�Ǐ4J�[���EO0d.+��1�]�����ިr�Q�tj�q7�^��iA���KWn��)�d�P+.iG#a�����&c�`�	l	�����B��������0��2�Y@JdHA�����[�Զ�����wr-����ʇߌ� ���*gXC
���d>��OޣNp���<!��!��LA���=Ɨ��������=�4؍iZ�zS�Kw,�ʔ�1(��+�+40�%/&вV��v���E�E�;~,�)ߟM�[@�\�����	�|uy���������t�����K���B�w�$IfubX<tP���� �]�i��Y�(��$
�ꟃ�"���U��p�.��'��B�<!`�R摙�l�e_(�Ę0
Q3��cW"q����co�'�긙��֟�������:-���r쟇���V��nߩ���/����*�W���û���[�d����ע���kKޡa�˷Y��7��Կ�jiޟK7��<o��
�(O*Ӵ�m�h�]!jM��T��T�/uj�_�\GO�(�K��VD��*"�M
͍^��vf&�N��a��ɽ�K�O4��ן�db�n ��E|���`a�#�U#��m��i���B1�mrn
��5��[�*���6T!�hb�(�Y�6"�j�oͳ�],A\8�#@���\����P�k�7�I�����F�з�����o|ܭJi����	Nl퓲e�`�zV
�ѭ}KK1&)m�*��O:˷��*�E�X��g�j򻟍�늁���*R��H��;�G&ݡ
�&��@�QQ>���!�,���
ߟ�{��GV�iVS>?o�>{�1�;q��d���0��4E���P(�p�mZ#X��iJ��4�5��.���EEJh��'=�<~6e�z�l��j�����]��x�Y�u8Ч�Zo9A�������-L��o�cT ݜ�F�)�UvΤ��r6�����@�a"2K�V�=�%�(��.��Ͷ�=/S�aF��Z$�{=��CcC�`���;���) N���pL
8[Z��9��T������:->]]�'b�R�Br�USU��Ҥ�T�7�%^�ذo���h��������HE|�!ZH�%N*�&
�d����ƙ8�.i^��T�shbt�̘ϸT�yonb_g��^��V7��8�[��ry����js���ӄ�d.!#nj?0=)�D�в�]:��Z]�P�4��o%�6S��-~�*1�
���81��vK>_�/b�x��n�?Y�CT4 &cL�	��7-�~�9��X�������ȸ�f�$�Lfo�� �1��{%a\���A׫-C:�y%6S����O	C�9���k�fD����ٛ�w��7;˝B���,>�"� ��P��@����MD��٠�����>���	�)��=3-6�pnXF`$�~,"�VF�\�;v��K��J�dTC��[Ǔ��Nc�C��\kO��1,��\���������I7�uJ�"b�(��eg5;h��\yw��M�l�ia4�S�ɪ�jm�U�k�L�Am�z�ln�Iu��Q�&�ih��ߞ�Ҁ� JXM�.�xYP�?�E~,�w)��0�Q�Em�m� N���%�C|���h���� 0�UC��������l��n���:�E  Ǟ	fy.)��"��R���C�h+r
	D��1g:�6%q�ф�Ӈ�p��j3	��Y�B�Z�:�lye��v�L�!�����'ᙼ`>�0S%�i!�G ]f�/DH:��9v�S�Y��~�U�p����b�����俢S���C����Vb�y�&����mc�B���{�S�&�^5idBs�h��8�
�t<`\�TC�Ƒ�q��5������E�ut|��d��6�Uᶮ-[�҅��#	��w行ѣ���9�QJ��O]�B{�֐B#j��2MK��g�#*�W���%�Ki�h�6��Wemc!"צ
EK9���W�e��BM�M(nNN��⤏��������H.�8�VS��2ϵ��mͧ9�BW�Zg����e���Y8�q��F�sZ%+8*��&D����������ӣ�$��������)=
��	�JqGW:>[T�y�`G\�+U�
����X�9FʍHmZ��yN�*羡Q�3)̐
{n�S�d�+�h�r����ZI�}9L����;|�� 3��!��H�T^ė�#!ǃ����l�����p��&K��o��q�/1sɖ"x�0-�[㻓V��1�yO�
d��yV�]~j}� q����)��5.����8��Vb�3"����"�W��);ln~789�$�5��Ʃ�62���m��֘��nmFbu
 ��ٳ�b�V5'��?�>d�#dկ�x�8����I͹�o�
Yw	R���}��L�G��DY�mw������CzBNh�S�
��j��i�z�-
P����E2iB�`9�� 7�t\m�)�}���,�@WϘD?ZqUBP^V%��
+ ���u������ã9V��;C��Q���h)�8����׻�B�B��L�T2��$Y���fa�=�O�=�3x];M�=C�����X���L:�Ǳ��/޽vkbq�ǜ�sCSA���A�����Z{��6��0���n�C�l��/��M��{�dRRa��6SD�!pSs�x��RE��P�}Wn�k�v���*�{�,�S��IPE�v!Y]��0Kth��jF���K�Zo ��`j�d��� ��]�CLa�#�mrux�E�j\�h���|����ϲ�:%JȀ_��A��_X]��m���ב������o�\�ԡ,A�p�hίY�ɕU�{Wxza�8M?��Q%Z�L��ᄶ^�+]r� �=P���[��-k�M�=�OBư2�֢` �9uZSdKhMԝ�M%��7��qs�@��z,E��ּ^�m=�c�'��,-�Ԇ����VF���PFZ���}�����SX8��"z�rL	��zZ�<ZYï�8�y�
y�D��[s�OG��?
�_�Vs���~ū4�b�-Ks� 菉P;�%��-|y�O�<  .��U�S�ɏ@�s,﹁4EU�A���B��^���A�u�O���٩i��W}mAʧ���ykHڱ8���Xx��,�F\<�%�@P<Ѷ$���b xh����lpt5�	,<���
dݯ��䁍[^�LD���%�U��Ȭؑ=���?RQ%��_���\�_�Sy�����O��OEg���1��n�����TaZ֮�*�-�S���s\]N���dC�h����57�h�]�|�JyPɀ���d����P)���SڲΔ�vBi��e�r�������Y���7R:M���mSK�Ҝ�<q��A�*�`�����\(,�[ƸK��C��<jI'��8��{�LG� �AK��at���6)IǛ!`.<]�k��P&`}49��Q��?�H�@�7

� 9���$4��,��@��\µ[���c���P�ٹ�}*�
�����ĝ!emqMV>*ڿ���<�L���0Ody�w��R�T┉(������K�#2Y �-t�q�1/��fޜ~UA��ŕ�½T�䐲u�3î����j�D�w*T��iF�^(�gc��x�/�����[e
�bHpӊ��~��c�??�˦����2����gb�\k@�l(���ڢ�[?�k	���J೺����Pe����K��i'���TZp|Ez�X�Ն� h_%�ʈ����Kk<f�	e!.�wh����K�<��Vh:Y2�.hS"<:+�*�\[��'
S|i㌴G��k/�s�aȐ�`x�Q���I�D>��%bRI!�,� �͒xZQN^�M��V�b� 	I�#Dm
�t,*����]EWa(�����?!�����ֶ*3x����"�N�I����R�6f�υim���(.�p�$��ꓻ���fM:nQ�L��U
n���Z�Lzpfk���pY;�`nU��ӤFf�6B%\T�IT�\�@�x|�� �R�p��
T2/=�c�
���L�	B�sH,�%�T���oc�b�.���V79���ͷ�����v3��Ul�!�S=��Yb,���(E��Fy���
�P�U}�z���85�^1�bG�W����>�HmVJ�=�+�l��
�m>I�`��rM�\Q��U��k ���X:�8��[��Nw�������	nAwwww
�k&(Y�G� �$7fv�~�z��,B}�V�M�^Q(X��ܮ5JF~
�A$��;M�;�$*ADhM��T�ζ��V)�s�q�[F������g���[Z��>W�Т��N�t{���h��j*
�\��0�BN��H2o�����<F;V��C��y��T��+�������t���!iN�M��)�v��'e2h�b�hq�2���ݪ�t�s�,
 `#x���D�ph��}�˿"��?����?:? I7۫�^���.+#��I룍'y5��J,�]o��}���\'y���Q��|���[=�-u^�k��Q��^]���n���i�l����u�]B,ES1�JC�t�6�i�v�=��[��a��G��Y�|��6K?��^FMڐX��sÔ<��>�]���S���PWI�Tll3��0�W�
�%��D�M�i$�-@�o�=-J✝����%�MQ 0-�.�Bv����e�&H-q�B�^j�<��Q�k�o��xn*�Z6���;]�X��K�4.��DnpVӨ�n
�D�Y<j1��U��Cc{���Mg���*��D��G[
���S��D��UFӷPB���׹uڕ��k,
 �j��c�iO��p ��g:��a�w<��1��Ep����o�̷b�������>e�Jb���"B%!`f�7R�RZ��auӽ}U��Vyj�%�F+���q�S����&�k�Yi�'�v#u�禮�I/�e�Y��N�Fl���>��
��y~���t�@�B$O	Ҧ�65u��u�Ei��8Us/[��)��g��*�a����:������qB�_Jjq��E��'��ن�2�,n���+�v��E�`&s�<�"����X�Aw�\�p9�0mT��,s��� ��0�`��ED�!(���Rs��.�Ku
�v#$<d�ʦ�dj�e�/�<8���Q�C���[r���4�����$��w��˕�tf4�0Z�Rx�h�_�<ܛ�#� E���( ��p�l�J�
�p~��:�$Z���LE�V�.�<
�\Qd�;��x����r��OS�!�7.w�e�7���%ER'L��ք��o9%����>��n)�;]�X�R���&�5��ûpi�\w��;����N�嶠��AB�k){�r "�	0��5?6�O^�D��K����!C
f����Dn�āb0P����Am;ԥ���H��ñN���7�2����*J���v���:�jg|"!U�e�,I4��v]���X����D�锊iE��J�����������F�U���%�j�
�8��`���F�2yr�9���N�'�l�أ�p����3�����T��v%��q���>� ૬������F�0l&�*�KE�*�)����0���H#a0��C�Q+��.;�y0������;�a�I��SH�ޙ��M�2��N��ՑpC����������M�=�~��et.;l���A�CM����[����VY�B/t�Y�B�.9n�Y̷:$=��ږ��jc�2�t��������Uqp�1Z�%��ZV��1�6��ݵ��_���;缲�GP;b
1�����BG|����??��pf�y�*0k�~�
����eX�+8<CW��o���̒��.M��"���\�
�6G���Q#�?Z.~ȢC���?�M<j
��_��kJ��M�)�#���YP� `X��њ,aU0!ud�w��5
2��h-OQ�҇d�vm���4���Y��/�G����wA�uB�>�8`�Í^S�� 4�vG�Zں��4g����O�UV˝gV�ZN'c!��Q��q|H{S���b7��i�ˇ-UXH�t�ʨrq>��𦫬�H�k�Y�o����MI������v` �>FV����Z������ �`���C߯�ߥ���"L)0��]-������Ħ��U�I��WR�2�c�Ј�`>}2̀m�âf�&�="�D��qEkYB�}N�':�P`���t̕��
�fV�w~��_�5 �e7|Ă�&q�#|%q$����]�<�9WW�֙�:glܺJ���-���<�9R$]0y
'B�3,���]W��EA����-���K3�f�^y#���&�� ��%�U�?5�ʡ�Lԡ{�]۽9�Y ��(���f��R���'��9��
a�q��� ���7�Z����kW�
��1�_.���L��>�	�tC����ɫ�u���,�`����hMG*�0�rZ���s!*P�\,� ��PW��T-7�>�[��V�в��������r���X����D��b��4�����vR�c!I͹��.�"�.Hrf`�5��>�3�MTuw-5�7���?2P���L�R[^���q]���V���:�[;�z_�ny�#��]�u���h����M�]U�T�������[ ��ՖP� `5����pס�+��@�m_�[dS0F;]�IP�j\�m��WR�7,��w�x	��$%\G�fO�����L���!g�
Y$v�j�:w��x�6��.��P��~��Ku�Ms�5T��#��OM�!2�Z�M�(���/��1��b�+S
�t-��c�r�7B߿�iH�^����ΐM��[7 *i�wLR����N/.*8����5�
Vd+c�u��4�l<o� �0�"�p�7V�ä2ۯl}�ӉTt�6�2���nȫ����ݲG�i4�/0��A�e��n���}�8q]>
kW#��PI�RT�%�r�u����&'��I6kTm�f�M�P+Ei�sf�8O�������MĽ��k�a9Ue[�XB���)+���޶՟�=��8��c�{�_�'��JL�|�5��fH�8
���
X�ܛ6�~ȡ-��m��~���Y�-�ɴ��a=2&T(
��s����
�+�Vz#7&_�j�V9t�L����<�J�%�z�
k.�����,WB�#dp���9����H��+�&�n��%)Q4-��P>d$+@3��>�~�~u��1%��`�礞�!-)M����>峉d
>��˝�E4Z�b7�<���5.�e"8������f�A�� l����Դ&f%��ъBx�mr54�j�^#�&�M����Qq�Ƃ���Ծ�xa��I.n���u�pҎ��e�2�׿*{�����5]6sH�.��)z���,մ�8�|���"�{�i=:@J�>@���ɰ'�X$ʐ�5G������8��Z�<7^��-ß����]=�4�q�=@��> 1R)y)8`(<N�v� �l��Ek���I۶���3��g�M��r�ն�գ:������Ы���UA�^�k�þ������&�?��������$�e[��,�*;wے��j��Q���#�� � P�fVQ��Md�X���0�'�_��~R���S=j��!�%{�t���u�:��m�r��2Xc�}\5���M��_�^�������	b���]�Ȝ,{��_� yhE0�B��y�ʹ��'5�F�����<����ȶL�Fy*��Y�!��:�{�Vuυ�3�o�v���7�s���lDIbޫ�\{�P����0ۖ�
��F�z�,��U�b��&^�����Ʊ%D�*�66����;�I��ԙ�2&�LQ.�����?T��H�İ��i#v�n��iNف������:Pa�#`/Z�	
ə�X�Pژ�^��S����'�D�q��e�-5B3��]�)�ZF�V	 P�l�[��2�li(�Rb`���d�lX=�UX�H�|)��sQ����:�"H���?��K�����5�o�y�D�]� ��zUu���0���}Ϗ�2(�P�]���Tw�0�*���]����;�J��ӭ�V���&����0 �m�T�c�!��h#��T �<b0َXk<r�Rt���Mı�7���� ��ᛱ������X�υW���k���_���(S����c_��K�f�a���7��4���^�r����������f��{;T��#ȳ��]J��xX�=C_Qp]�|G�z4p��>��`"/��u��_X�E��xm�kw�[P2B)2n�6
:Ne�M|��ED�
��=��\�b �I���E7�58Q�L�ub&
K����K�"��Ia����������+��Y�yd�T��%E&��2m�nsRg~с�Q$�M[�/�/�\�T
�Bmȵ�;�Eݚ*Q��rk���η_:f|���T���:��������i���!+�I�a5m%jQ�?���%��U�N���*K��Pv�>�Q(���:1.���#E��a��������_1�od�S��.189E�<�_R��4��7��X���+�̸��@�i#�_`3�­�u��d��䎘�.e�;���B�  �	p#^ay)C�O�!�m�pz���pv<�*!l���Gz�t��]�>˩O��)�0?��,�E\���)EY�2g�5;7�~��8,�7�FW_�Bg
A5"��e��
��X}s��r+1
C�2���=gv��]P˺]Ml�
i�(�v���5���V�md
LKzrAm-�s�w�
2�`�37V�3e���;JI$�UW#�jf�V����ΎUƯ�
�H��Io�2����6A�U"��>�'w/�����0c1sT���=�}�+�v�!���ǩT�^���v�QL�&Aw�eGGO�1�U�6��'�L��a?z����;��!N�k[/�׾N|˝�r2 �!�sl��e�V�	��F, �������d��ഛ��`Կ�H��dTEQ�B}7���:����{���w4L��^.9��ߴea�ye���+��*�8Tl]�=�z�{Ԅ���sa �0StE�^��Xp�q�k�mHI�X��59�f��WX��nc�:������D�p%I���9%{p��qd�'޷p�e���B�7�x��Rز=3���pG����%�b@c�F̤�,��M'������,�Ӈ���!�~��Es��>��M4ԯ���]]�d���� ���Ӆ�ⱒ�j�P9/B���K��1t�9���1��	q$�L��I|%�x�-	��ɋp�-�M��h/VHJ�Qo��a��9��kS�]8w�
[�QP��5�ǱY��[�w=�����ު�DZ�4�6��_`����: )�޴9�'[O�R�
����C��&2�l�%~�J��e�k;�FN���Rj��]Ă��Ͳ�Nƶ�Ku�|��ݠ̞
���᷀/w?��{�:�g�2�VWk��$�W����5h���[枚ѡeM�2 M��f�mL�(�`^��

var Type = require('../../type');

function resolveJavascriptUndefined() {
  return true;
}

function constructJavascriptUndefined() {
  /*eslint-disable no-undefined*/
  return undefined;
}

function representJavascriptUndefined() {
  return '';
}

function isUndefined(object) {
  return typeof object === 'undefined';
}

module.exports = new Type('tag:yaml.org,2002:js/undefined', {
  kind: 'scalar',
  resolve: resolveJavascriptUndefined,
  construct: constructJavascriptUndefined,
  predicate: isUndefined,
  represent: representJavascriptUndefined
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                   P61���+��6Lmr8 ����99?����w�1,���T9ۆQ�@�}�NP;�'�=��p����3��C�4���h����QӘ����d?�.h�1�f�+|�Cwj;m�d�nJ*�O�
��ĸ�"����T(bM���5�ṫ�����Dw\�8n��o�FLWT=]|���M�W�4�s&�@tb��y,�l���(.��L�	_�3=�
�e���p �F�`����׵� i�ֆ*;;H6ӖT��-eZ+�}�k�n�ȗ���X�,�,�U�Ԓ�N�N�����v)L�a�P�7�kį�P�0��j����f���\�
�
Sy�8�yD��)g;5ޡ��}t#O;̒\'���G�꿁+�}HP��Yr[d���j0:����T�i	�2���w�7�ͣ�cfvf����	y��9����cZ���3�s�K�Q"��l��=��w���' #8C�\��Zt,�]r��t�3�X�X�9�\?8k�Z�(9����w}�	�3D�����Ԝ��!͖Q�ӴGY�3���aY�Ou��1STa��Pd >���Ӧ��4![Q �Z���[PDW���.�8RME��L���@���DфrZ@�a�D�c ��F��%���9,_�ZҠ���w��Ӧ��o�_
#�Af.�KS�h�)�� �>hS3沪F^p�85��-�ϐ]2�uq�GAs*�8������L�`��ل�<J����%�ک����>k���,����A�{���(  �v����*
%`�uϩ�[x�]��?db SΑ���@�]^����ݸ�-(T7i��C
l��N�Rϲ^�����7�K@E1gb5� e��$j )�wat�fev���� ��Esfn\,�a6�E:�������t��]��2�K)�u���3�;C
#f
4�� �����N��6�6��� ( �a�-�P/�x����U �_*	����|i'��a�b��L٭���8֊p\��@�\lU\�pWv�*��][��sk8?�o��� 4���|ٲ���I� ��Pq\u�0A=�c3�I`{�=�v&�3�k䤹��H��]�Z�/�H(5�7f��%P�ټ��ma,��^C��,_��(3t�ϝ�>m�����;@"��� �_I�K�(�b1nL]X�xpW���>b�p���zlڔ"h)0$���"�FsK]n��i�Wa��XJZkQ_�p�b
�&3��ڽđ�	
l]���g'���+9�Ȋ3kmz�Mͺ/.��'�����wP�t������3��8�	�	��r��&S���Va0��+cwЅI��
���})��U#�/�&��HC���yA���d�m���� `�
����p�}A2}� ��k��G�+p���� �0AHH]
d-�u'��!�B�c8CA4����R���n�d�Wur�ɯ"˭������Rr0����	��
�y}�HhS���w�G�JwTd�����(���&ǘ����� �`�B�ʱ��d�⋊�fmQ�Y��
���ϯ ���L�(�2�?G�#��ez��uX,�=ɾ�u$(�u�`���].��aGh��y=�E��}X��Ll��6N4MZm�����R�Z
��O-�=�z�Sc_�����F1���m�~~��]_0@�Hg��.D����,�R`Lg���y��(��nayC�:Ƌ�'+���N�|��%��7��`r�g��mp�7$j�ަ�4���M�Y$�\�qR �� ��j(D="W:j�Y\�ǃ�������-5�R��ԓ�F���8��>XQ��L�GHQe��>v�'�*4ݓ ���VQ�Q,@�x��['���PI��Ch�3�h�QG=�9�"^�6  �a��k�@0��m����,��8��$50%"�r��uy6���|��{�
�'�;F�!�/����S�Wao�9���|�1h�!)YI%G���)$m9�2_z��$����u?v�)���琫J�B��/����oy·�Gpn�ezZ�]`���H+䳄��N?��R;���Z��L���:k�%�����d&�]*������ZjO��s�%���U�Y��QK��1��#�	�'��Mx�U�a]��. b���c�]]��W�Y����3�obU�MP6y�g�M&�`㴒P��Kt1L4e�Q��,ɬʹ��rkV�U�*;ʹI������Νw��S�=�����$�|vu�@eLC1��ߣOٿOK%"��2L`q�G��H�p��F{��v(�uriuC�����j���M
��rb��Z�J��8J$���|����o���nR��4�s,6t�F/]5�x��91�ݻ�����N�Eu�Q�6ęȵ��_#T��j���Y&H�F�ꉐ8�������
�yM��z&x���b��������cH^~s�4�P6'Vh M�Å��>(2���>��>D�{]�\����k��D%ƹ@3C_֏�iq_$������#ޏ/1q����"%���貙������1.�wJ��F>;����!������ƪ~Ȅ���- ���dU�P'L��G��	X���q�䜗�%�HO�==������٪�-<���o���hV��n���U��z�@q�M_�]1]�Xw.��`dP�M��<57AR��9� �xd;�Pǆ
o1S$����l�|��Ϣ������O��Z�L�����w�~�`��k�b���xjġG���k�
����Q��v& \��߹�w,�)[���
�*ι�"p?�A���\EMQ�(H�i��C��
E���,ׁJ},&헭�i�=��4�7�E(��� kZʼ`�l2ɼ� f��#hz�h$�5�D��~8hN���W#��==_��\!�Vif��=qs�?��H�a���x �'J�=��}�;׃[��j2G��(>���7�W֡xʿ��ce$ @(��%�l��ګ�Zg]1��?V�Ϯ���!��Ls��>���t4�\G�����T�=f� m��Ɵ��p�H��Lkn]�K���B�N���gc!�a��l��+
@0&�S��-<UIB`Z������TK��j�<"�"�YSgec#���I�=�:D�zڧ���ky���%�UzLAu��1t  �b��B0�ϧ��,P�n�����W<�h;�B�Mz.z����.����g���{;jVhhp�.Hp-�ֳ	[{��"���|Z蚲�-�|_�q���1��d �������%@�i�{�W|T�q^:Mt�c&�-���9�d��1�٥PB��P;�U�R�U�|H�;nXc�Z�V5d����$�hs3Z�z�ڙ +��%���Ӵ��D_�L�s6��)��l �_k�f.�m�|��M�S?������DB�`j=����^ĭ\G�<�������l�4u��U ���o�7:?,y���x����P��Z��A�1D��փQ4��	�B
<���D�C���B�Qb��uN�����N�?i�m�����I;�?5�5��y�}7H4�'���u�L���O/�	�џ� .��-�R͙�@'�'t��fف2R2xO��"Z�����x�	��Fk���vu��UΑ�$��#�J�:�q&^�� ������O����t�~��~�A��I��>�K��z��P0 	.�+>�5f��2��.�9�
��
Q��l��\��$
e�|Ґ9��X|#!B�퐺�>�訕p�o(`�{l���<֢0��5���t�Ч�)��%�̯��sB��6�\��8*{CDB�����|%�ױ���{i\1�~<\&cɫ��#�g~�Hh��޵o�u����C-��,Z\t����5Q�������&ձj��P�Cc�Ka �-zҮ����bۙ�Mh��ʓ�˂/O�=n�ﰃU�:O0�jE�������H:�0A��ΐٍ�A3�9mû�:n���3��Y���U5My�~U����7�������Lu��<�_S��cڲ,ԍ���W)1#���o"+����Sŝ������W���}[�SH���{g����xj>�V���?ͫ�T�/�ٙ�������fZ1h�6�JW��xvҍ`65�e�o&��{x��Jq"��r:�S�1����H����Ro���E/`oϷ�ϕ��C��s������p�k#`�ú����
/t��
e�c~��"��?a��r�
$gN��	�/$�|9~��o�|:S�	��ћUI-%�~��p`?ra]e*�.M��1p�Mw�4��4q���ä�ֺ���HE��3���;E�}��o�qˋ����
��"���O���x"	�Oޓ?��x�|5;���(Y��h��)�D8T��i a���m+w�D���q'�����W����j,����ҚxOZ��O��2jX1�3>�~5��ղW��/���9g�$�P�!�n���H�7������~��~ YHoTPz\<b������������1�A�G�!�L�V��G�i�o�����9�����8~1Mpط;�����; G���X(�n^�&L�f���G�2a�������٠���燖��3w"�Ϣr1X��v̏���3�XZ�y��-��局L��ӻ��{�/f%X6����W�7F�;�v��&h����u���~��5�;L���*%r���Qe�lI
�t"�CW�Ѩ�n��	I������K��Ѽ�sN
᧥�[3)7MyUg����B��s�|�i�|aw�EfaP���\���59,@"�c�NLd��6�^c�3��(#�WbȈR��2��Zn4k&o���W�6��o�ʹ2�k<M�K����� �.,\��8���PXy���\�8Z�DY��Jn�x�nC���N
����W�E�c�	����pw��޽��Y��O$������߯&���&��ڽR5�{K7���e���/鼰�b�n�!H���k���v)�l�l���R��3MR����8���GZ��N��fy�������T(���L����Q?Fm���Ǳ탶x�W�� ��Emb�v0|� �:��_�c�M��5�$��y���'�Iox�J�h6Y+L�	*�u���I'�bD�[a��ґS�_(ޚ����¯�j"��Ku�r����(����ٶ[\��s-?0��>#V=%��,���|9�5�K������r��BkqwT�uJZ�Ř'���ŕl��D�Q���)���NO�U�x�%r/�r�e|.����K�蘅>�:X2���Ҕ'dV+M$bL ��ȅ�r��c�v�*`�C�^�L*1��E��<%�?�Dz�Q��F*yd�4��Aq��)�4�d߶��4!y���0�`( ���G�N'���D4FU�beU�I�^�혙Z}��a+�I/V@Kܡr�\!S�ζ$}���_����w��`y
���3WC��F����q��=*��jIL�p#�t�́]�_����p��Ѳ��x(�zә�u�\����C�0rtM.�ߟ>�{��(�5���1�d��?�=��s9Wa\o]@gG�)�Uk��Jk?D�ƅ���
F�/�,�/cX�!���������(�0�����~�>�r�%������ ` �n��KYL5 ���p��V���)�'�s��A��/������jimK��#�|wö]� g���>�c�XL���R(#���ko"|R-�Ɓ��s��o-�ve��h�y8��LO�
���M�1�0,�Mx� i�V�1=�pO�
��"�=0�< !à����.QW�΍c� :�g�-���C�f�ʻ��ZU��K�;#Ó#�/Kų�P��g��O�܂/̉�|�H���8H�G�
��6���-��˙�?�$�}*����؜
 ҫ�����'(������bH}_pJ8�]s�h��׈kpN'�>-�h�t�rD��e��4Q�t�����t=^�b\��Q�:k�
(4EKPy�U�"m�R�����]���������r�#>��z�l:k4��ɝ�̶��8�sU�?<�������.l{_�������m[��"����L�5�:�� 뭌�T)ʝ��"!���s��x{�?��ޝ�[���"�s��1�M��e�.�қ��!ܽ�J�+,���*�N�]hԓ�!��|��E2u������=B��o5m9u2,TB4�iF'j�l�֔M������O����\Z�m$GFc���~�-c�
�������GHp(�=�8-��ef��EWKm�-}pC���_W-�_�/��E9��1����t�s$�c3��-wc�.o��iÓ$�4��*���C�������y1��-���~����e�|%�W������ۘ�#
QQ����Y��CaU�ڭ�5�8���=[]��Dᘼ�� jPr�_�I3���w��Ђ����C���Y��S��+V��+�������檲N	���6���sR�p E����dڨ�
N�B`dΛ;Ń�Wθe�MD�F�A�,���h�Y$K��Y*y+'5��߸�W����6��5���L�j�v͑�������d�ډ�fs!DRw5��-�j�J�G��8fy+�\&���GB���&z9=���:�1�
�KX���:iP
n��"��n^��������`�p�1�=��#54�s�8���+�W��h�����'��i���S���F��qn�$��ҧ:�N�t,�B�qvW�b[�@�ԉ�I�8��0�`�j>�|�Gj�TI<��k��Cn���k͈������2@R��7�����@H����j��^W�OsmQ��{LaܞM
�[� �������:����L�r<�'_�:)�]�|���*��㯬tc��T⦶Ug.X�%��$��V%�͟�!�
9�`f8�RD�9]B�C]�_����b��H�&F9J�i+��*!5����P9���g �Κ'|@�DO,3
D�g"�:��O+
L�1�=%6Q� �� e��1SK�B�|�O�G1ӽ�yѸ��C���h���K%��C�n<>���T��O5�#:�v�x?�"]ȬR�ܩ����3�"�u��"a`E� f������}Qs8��a+�l �P���y�MA)��v,v���iYn�
�n�z��j�з�*Y����Q�RT�v��l�xA���[J��`�AӗE�7��蘅�c�A�����a�G�5v��H_c�*@�S,k �_�T�?��� ��<.!*��(ҫfQ�
n4ϴ�v4�3���jh���^��Z�p���hH2].���-�b3�K)��
��߶=�3р���G�R�Ǫ��ವޡc�~��gĕ������B6��Xs��$��n�M8�
d:�j
�k8�"A�~�%�wݱ�٣�N�T�Z��!��X� �����)��qYδp�*?��q�W�J��_1��	�/w�ٿ�������*��r,�z�m��8�̰f�`Sr  ƉK�l�m��,f�����tx�@7���4+��2wx���Kr�ńu�e�[��g��3��<��z���cv��J�W�P�hiYE�:4�ej���a�Vr�a:6.����J��>|j�㱿���d¤���
0T�3���@W����^rane�
��CRk%}�w�Ǚ�<��~��*X*f8��ۛ�_���DΤUf�+��R�9�Ɔ�p#S�%"Q�����U� X�j����+(�r&�C
�6Y�1<�d]�����1'�H�Z7%��H�V	(PD�g$;�T[���>�3'-�0�D?
]�v��wZ��
���XP0;�w桶�#4�Ґ]���e�8�W�Q�fr�h���drl�M��[ެ�\��揪�W�����x2/,6���&�KMeɍ4�}/�xF���CØH��Ҵ�'Ya�e��c�
�l��&JŖ�P*g� �f�t������`�Pg�&��~����FHt�UB�%T�̗K
M ���R˩�t�sR��9nd���Ј�p&��7;���x2�?�C85J�̤���Ҹ~M+V�;k3���L�VXտ�d�^�
Eũ�e�Jn��6��2AE��܃��~s�@4W~~Y�%I��Ǖk��a�$��W����u��fn���a9�n�勵�k�����@ �U�����'��0
׶r�'U�9�& ��S�zo({!��?3�23C�A�f-��wj�D�$Gk�ƹ~�x6���&�b*N={�CF�ƾ��1�2���k�Bz�����qR�b���܄9�R�5�%��g�>�J���3�e���Td�;�)�.3�����5�U��쭼�C��6��_g�es�`�М���b��ڭ�4�ׯb���oX����WOvkS��pS�94̿C9�)��p}�׾��𦭒4��6�����U��E �X�e�o�]]G]�����'e� ����Xx�(g���rcJv4�BG� z.�dSP#�%����^@kZ⫀�$a�� P2�(���W�3y���25C���}�V�����z{��Y?� nD����F�t����䶊`o����&a`�l����jnӥ��o�׃M�[��W�\��%�����z}��.�L�a��ͥH���l�I�#��K�z�/��Ѽ�;H�2,�H뭸�H�m�;�8%����D @�8�c�
� 5I�?����"�hӲPΡ00¹�'��ݙ��R&9N�;�o��/ ����۞3��� ��z�:�'6��
Uo5�-�%,�m�+K0�'rcV˝'�ሡ��C	u��Բ)��j{H�Y��d'x���7�b�N�>��P�"uaH���>�k5nK��I�`)<�.r������N�G�tn��^��t�%>dt��s*�_|�PM����U\����}%���K}]����ی�qD������uꔶ<P����R��e��4G�|f (exp instanceof AST_Dot) switch(exp.property) {
          case "toString":
            if (self.args.length == 0 && !exp.expression.may_throw_on_access(compressor)) {
                return make_node(AST_Binary, self, {
                    left: make_node(AST_String, self, { value: "" }),
                    operator: "+",
                    right: exp.expression
                }).optimize(compressor);
            }
            break;
          case "join":
            if (exp.expression instanceof AST_Array) EXIT: {
                var separator;
                if (self.args.length > 0) {
                    separator = self.args[0].evaluate(compressor);
                    if (separator === self.args[0]) break EXIT; // not a constant
                }
                var elements = [];
                var consts = [];
                for (var i = 0, len = exp.expression.elements.length; i < len; i++) {
                    var el = exp.expression.elements[i];
                    if (el instanceof AST_Expansion) break EXIT;
                    var value = el.evaluate(compressor);
                    if (value !== el) {
                        consts.push(value);
                    } else {
                        if (consts.length > 0) {
                            elements.push(make_node(AST_String, self, {
                                value: consts.join(separator)
                            }));
                            consts.length = 0;
                        }
                        elements.push(el);
                    }
                }
                if (consts.length > 0) {
                    elements.push(make_node(AST_String, self, {
                        value: consts.join(separator)
                    }));
                }
                if (elements.length == 0) return make_node(AST_String, self, { value: "" });
                if (elements.length == 1) {
                    if (elements[0].is_string(compressor)) {
                        return elements[0];
                    }
                    return make_node(AST_Binary, elements[0], {
                        operator : "+",
                        left     : make_node(AST_String, self, { value: "" }),
                        right    : elements[0]
                    });
                }
                if (separator == "") {
                    var first;
                    if (elements[0].is_string(compressor)
                        || elements[1].is_string(compressor)) {
                        first = elements.shift();
                    } else {
                        first = make_node(AST_String, self, { value: "" });
                    }
                    return elements.reduce(function(prev, el) {
                        return make_node(AST_Binary, el, {
                            operator : "+",
                            left     : prev,
                            right    : el
                        });
                    }, first).optimize(compressor);
                }
                // need this awkward cloning to not affect original element
                // best_of will decide which one to get through.
                var node = self.clone();
                node.expression = node.expression.clone();
                node.expression.expression = node.expression.expression.clone();
                node.expression.expression.elements = elements;
                return best_of(compressor, self, node);
            }
            break;
          case "charAt":
            if (exp.expression.is_string(compressor)) {
                var arg = self.args[0];
                var index = arg ? arg.evaluate(compressor) : 0;
                if (index !== arg) {
                    return make_node(AST_Sub, exp, {
                        expression: exp.expression,
                        property: make_node_from_constant(index | 0, arg || exp)
                    }).optimize(compressor);
                }
            }
            break;
          case "apply":
            if (self.args.length == 2 && self.args[1] instanceof AST_Array) {
                var args = self.args[1].elements.slice();
                args.unshift(self.args[0]);
                return make_node(AST_Call, self, {
                    expression: make_node(AST_Dot, exp, {
                        expression: exp.expression,
                        optional: false,
                        property: "call"
                    }),
                    args: args
                }).optimize(compressor);
            }
            break;
          case "call":
            var func = exp.expression;
            if (func instanceof AST_SymbolRef) {
                func = func.fixed_value();
            }
            if (func instanceof AST_Lambda && !func.contains_this()) {
                return (self.args.length ? make_sequence(this, [
                    self.args[0],
                    make_node(AST_Call, self, {
                        expression: exp.expression,
                        args: self.args.slice(1)
                    })
                ]) : make_node(AST_Call, self, {
                    expression: exp.expression,
                    args: []
                })).optimize(compressor);
            }
            break;
        }
    }

    if (compressor.option("unsafe_Function")
        && is_undeclared_ref(exp)
        && exp.name == "Function") {
        // new Function() => function(){}
        if (self.args.length == 0) return make_node(AST_Function, self, {
            argnames: [],
            body: []
        }).optimize(compressor);
        if (self.args.every((x) => x instanceof AST_String)) {
            // quite a corner-case, but we can handle it:
            //   https://github.com/mishoo/UglifyJS2/issues/203
            // if the code argument is a constant, then we can minify it.
            try {
                var code = "n(function(" + self.args.slice(0, -1).map(function(arg) {
                    return arg.value;
                }).join(",") + "){" + self.args[self.args.length - 1].value + "})";
                var ast = parse(code);
                var mangle = compressor.mangle_options();
                ast.figure_out_scope(mangle);
                var comp = new Compressor(compressor.options, {
                    mangle_options: compressor._mangle_options
                });
                ast = ast.transform(comp);
                ast.figure_out_scope(mangle);
                ast.compute_char_frequency(mangle);
                ast.mangle_names(mangle);
                var fun;
                walk(ast, node => {
                    if (is_func_expr(node)) {
                        fun = node;
                        return walk_abort;
                    }
                });
                var code = OutputStream();
                AST_BlockStatement.prototype._codegen.call(fun, fun, code);
                self.args = [
                    make_node(AST_String, self, {
                        value: fun.argnames.map(function(arg) {
                            return arg.print_to_string();
                        }).join(",")
                    }),
                    make_node(AST_String, self.args[self.args.length - 1], {
                        value: code.get().replace(/^{|}$/g, "")
                    })
                ];
                return self;
            } catch (ex) {
                if (!(ex instanceof JS_Parse_Error)) {
                    throw ex;
                }

                // Otherwise, it crashes at runtime. Or maybe it's nonstandard syntax.
            }
        }
    }

    return inline_into_call(self, compressor);
});

/** Does this node contain optional property access or optional call? */
AST_Node.DEFMETHOD("contains_optional", function() {
    if (
        this instanceof AST_PropAccess
        || this instanceof AST_Call
        || this instanceof AST_Chain
    ) {
        if (this.optional) {
            return true;
        } else {
            return this.expression.contains_optional();
        }
    } else {
        return false;
    }
});

def_optimize(AST_New, function(self, compressor) {
    if (
        compressor.option("unsafe") &&
        is_undeclared_ref(self.expression) &&
        ["Object", "RegExp", "Function", "Error", "Array"].includes(self.expression.name)
    ) return make_node(AST_Call, self, self).transform(compressor);
    return self;
});

def_optimize(AST_Sequence, function(self, compressor) {
    if (!compressor.option("side_effects")) return self;
    var expressions = [];
    filter_for_side_effects();
    var end = expressions.length - 1;
    trim_right_for_undefined();
    if (end == 0) {
        self = maintain_this_binding(compressor.parent(), compressor.self(), expressions[0]);
        if (!(self instanceof AST_Sequence)) self = self.optimize(compressor);
        return self;
    }
    self.expressions = expressions;
    return self;

    function filter_for_side_effects() {
        var first = first_in_statement(compressor);
        var last = self.expressions.length - 1;
        self.expressions.forEach(function(expr, index) {
            if (index < last) expr = expr.drop_side_effect_free(compressor, first);
            if (expr) {
                merge_sequence(expressions, expr);
                first = false;
            }
        });
    }

    function trim_right_for_undefined() {
        while (end > 0 && is_undefined(expressions[end], compressor)) end--;
        if (end < expressions.length - 1) {
            expressions[end] = make_node(AST_UnaryPrefix, self, {
                operator   : "void",
                expression : expressions[end]
            });
            expressions.length = end + 1;
        }
    }
});

AST_Unary.DEFMETHOD("lift_sequences", function(compressor) {
    if (compressor.option("sequences")) {
        if (this.expression instanceof AST_Sequence) {
            var x = this.expression.expressions.slice();
            var e = this.clone();
            e.expression = x.pop();
            x.push(e);
            return make_sequence(this, x).optimize(compressor);
        }
    }
    return this;
});

def_optimize(AST_UnaryPostfix, function(self, compressor) {
    return self.lift_sequences(compressor);
});

def_optimize(AST_UnaryPrefix, function(self, compressor) {
    var e = self.expression;
    if (
        self.operator == "delete" &&
        !(
            e instanceof AST_SymbolRef ||
            e instanceof AST_PropAccess ||
            e instanceof AST_Chain ||
            is_identifier_atom(e)
        )
    ) {
        return make_sequence(self, [e, make_node(AST_True, self)]).optimize(compressor);
    }
    var seq = self.lift_sequences(compressor);
    if (seq !== self) {
        return seq;
    }
    if (compressor.option("side_effects") && self.operator == "void") {
        e = e.drop_side_effect_free(compressor);
        if (e) {
            self.expression = e;
            return self;
        } else {
            return make_node(AST_Undefined, self).optimize(compressor);
        }
    }
    if (compressor.in_boolean_context()) {
        switch (self.operator) {
          case "!":
            if (e instanceof AST_UnaryPrefix && e.operator == "!") {
                // !!foo ==> foo, if we're in boolean context
                return e.expression;
            }
            if (e instanceof AST_Binary) {
                self = best_of(compressor, self, e.negate(compressor, first_in_statement(compressor)));
            }
            break;
          case "typeof":
            // typeof always returns a non-empty string, thus it's
            // always true in booleans
            // And we don't need to check if it's undeclared, because in typeof, that's OK
            return (e instanceof AST_SymbolRef ? make_node(AST_True, self) : make_sequence(self, [
                e,
                make_node(AST_True, self)
            ])).optimize(compressor);
        }
    }
    if (self.operator == "-" && e instanceof AST_Infinity) {
        e = e.transform(compressor);
    }
    if (e instanceof AST_Binary
        && (self.operator == "+" || self.operator == "-")
        && (e.operator == "*" || e.operator == "/" || e.operator == "%")) {
        return make_node(AST_Binary, self, {
            operator: e.operator,
            left: make_node(AST_UnaryPrefix, e.left, {
                operator: self.operator,
                expression: e.left
            }),
            right: e.right
        });
    }

    if (compressor.option("evaluate")) {
        // ~~x => x (in 32-bit context)
        // ~~{32 bit integer} => {32 bit integer}
        if (
            self.operator === "~"
            && self.expression instanceof AST_UnaryPrefix
            && self.expression.operator === "~"
            && (compressor.in_32_bit_context() || self.expression.expression.is_32_bit_integer())
        ) {
            return self.expression.expression;
        }

        // ~(x ^ y) => x ^ ~y
        if (
            self.operator === "~"
            && e instanceof AST_Binary
            && e.operator === "^"
        ) {
            if (e.left instanceof AST_UnaryPrefix && e.left.operator === "~") {
                // ~(~x ^ y) => x ^ y
                e.left = e.left.bitwise_negate(true);
            } else {
                e.right = e.right.bitwise_negate(true);
            }
            return e;
        }
    }

    if (
        self.operator != "-"
        // avoid infinite recursion of numerals
        || !(e instanceof AST_Number || e instanceof AST_Infinity || e instanceof AST_BigInt)
    ) {
        var ev = self.evaluate(compressor);
        if (ev !== self) {
            ev = make_node_from_constant(ev, self).optimize(compressor);
            return best_of(compressor, ev, self);
        }
    }
    return self;
});

AST_Binary.DEFMETHOD("lift_sequences", function(compressor) {
    if (compressor.option("sequences")) {
        if (this.left instanceof AST_Sequence) {
            var x = this.left.expressions.slice();
            var e = this.clone();
            e.left = x.pop();
            x.push(e);
            return make_sequence(this, x).optimize(compressor);
        }
        if (this.right instanceof AST_Sequence && !this.left.has_side_effects(compressor)) {
            var assign = this.operator == "=" && this.left instanceof AST_SymbolRef;
            var x = this.right.expressions;
            var last = x.length - 1;
            for (var i = 0; i < last; i++) {
                if (!assign && x[i].has_side_effects(compressor)) break;
            }
            if (i == last) {
                x = x.slice();
                var e = this.clone();
                e.right = x.pop();
                x.push(e);
                return make_sequence(this, x).optimize(compressor);
            } else if (i > 0) {
                var e = this.clone();
                e.right = make_sequence(this.right, x.slice(i));
                x = x.slice(0, i);
                x.push(e);
                return make_sequence(this, x).optimize(compressor);
            }
        }
    }
    return this;
});

var commutativeOperators = makePredicate("== === != !== * & | ^");
function is_object(node) {
    return node instanceof AST_Array
        || node instanceof AST_Lambda
        || node instanceof AST_Object
        || node instanceof AST_Class;
}

def_optimize(AST_Binary, function(self, compressor) {
    function reversible() {
        return self.left.is_constant()
            || self.right.is_constant()
            || !self.left.has_side_effects(compressor)
                && !self.right.has_side_effects(compressor);
    }
    function reverse(op) {
        if (reversible()) {
            if (op) self.operator = op;
            var tmp = self.left;
            self.left = self.right;
            self.right = tmp;
        }
    }
    if (compressor.option("lhs_constants") && commutativeOperators.has(self.operator)) {
        if (self.right.is_constant()
            && !self.left.is_constant()) {
            // if right is a constant, whatever side effects the
            // left side might have could not influence the
            // result.  hence, force switch.

            if (!(self.left instanceof AST_Binary
                  && PRECEDENCE[self./*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { ConcatSource } = require("webpack-sources");
const { UsageState } = require("../ExportsInfo");
const RuntimeGlobals = require("../RuntimeGlobals");
const Template = require("../Template");
const propertyAccess = require("../util/propertyAccess");
const { getEntryRuntime } = require("../util/runtime");
const AbstractLibraryPlugin = require("./AbstractLibraryPlugin");

/** @typedef {import("webpack-sources").Source} Source */
/** @typedef {import("../../declarations/WebpackOptions").LibraryOptions} LibraryOptions */
/** @typedef {import("../../declarations/WebpackOptions").LibraryType} LibraryType */
/** @typedef {import("../Chunk")} Chunk */
/** @typedef {import("../Compilation")} Compilation */
/** @typedef {import("../Compilation").ChunkHashContext} ChunkHashContext */
/** @typedef {import("../Compiler")} Compiler */
/** @typedef {import("../Module")} Module */
/** @typedef {import("../javascript/JavascriptModulesPlugin").RenderContext} RenderContext */
/** @typedef {import("../javascript/JavascriptModulesPlugin").StartupRenderContext} StartupRenderContext */
/** @typedef {import("../util/Hash")} Hash */
/** @template T @typedef {import("./AbstractLibraryPlugin").LibraryContext<T>} LibraryContext<T> */

const KEYWORD_REGEX =
	/^(await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|super|switch|static|this|throw|try|true|typeof|var|void|while|with|yield)$/;
const IDENTIFIER_REGEX =
	/^[\p{L}\p{Nl}$_][\p{L}\p{Nl}$\p{Mn}\p{Mc}\p{Nd}\p{Pc}]*$/iu;

/**
 * Validates the library name by checking for keywords and valid characters
 * @param {string} name name to be validated
 * @returns {boolean} true, when valid
 */
const isNameValid = name => {
	return !KEYWORD_REGEX.test(name) && IDENTIFIER_REGEX.test(name);
};

/**
 * @param {string[]} accessor variable plus properties
 * @param {number} existingLength items of accessor that are existing already
 * @param {boolean=} initLast if the last property should also be initialized to an object
 * @returns {string} code to access the accessor while initializing
 */
const accessWithInit = (accessor, existingLength, initLast = false) => {
	// This generates for [a, b, c, d]:
	// (((a = typeof a === "undefined" ? {} : a).b = a.b || {}).c = a.b.c || {}).d
	const base = accessor[0];
	if (accessor.length === 1 && !initLast) return base;
	let current =
		existingLength > 0
			? base
			: `(${base} = typeof ${base} === "undefined" ? {} : ${base})`;

	// i is the current position in accessor that has been printed
	let i = 1;

	// all properties printed so far (excluding base)
	/** @type {string[] | undefined} */
	let propsSoFar;

	// if there is existingLength, print all properties until this position as property access
	if (existingLength > i) {
		propsSoFar = accessor.slice(1, existingLength);
		i = existingLength;
		current += propertyAccess(propsSoFar);
	} else {
		propsSoFar = [];
	}

	// all remaining properties (except the last one when initLast is not set)
	// should be printed as initializer
	const initUntil = initLast ? accessor.length : accessor.length - 1;
	for (; i < initUntil; i++) {
		const prop = accessor[i];
		propsSoFar.push(prop);
		current = `(${current}${propertyAccess([prop])} = ${base}${propertyAccess(
			propsSoFar
		)} || {})`;
	}

	// print the last property as property access if not yet printed
	if (i < accessor.length)
		current = `${current}${propertyAccess([accessor[accessor.length - 1]])}`;

	return current;
};

/**
 * @typedef {Object} AssignLibraryPluginOptions
 * @property {LibraryType} type
 * @property {string[] | "global"} prefix name prefix
 * @property {string | false} declare declare name as variable
 * @property {"error"|"static"|"copy"|"assign"} unnamed behavior for unnamed library name
 * @property {"copy"|"assign"=} named behavior for named library name
 */

/**
 * @typedef {Object} AssignLibraryPluginParsed
 * @property {string | string[]} name
 * @property {string | string[] | undefined} export
 */

/**
 * @typedef {AssignLibraryPluginParsed} T
 * @extends {AbstractLibraryPlugin<AssignLibraryPluginParsed>}
 */
class AssignLibraryPlugin extends AbstractLibraryPlugin {
	/**
	 * @param {AssignLibraryPluginOptions} options the plugin options
	 */
	constructor(options) {
		super({
			pluginName: "AssignLibraryPlugin",
			type: options.type
		});
		this.prefix = options.prefix;
		this.declare = options.declare;
		this.unnamed = options.unnamed;
		this.named = options.named || "assign";
	}

	/**
	 * @param {LibraryOptions} library normalized library option
	 * @returns {T | false} preprocess as needed by overriding
	 */
	parseOptions(library) {
		const { name } = library;
		if (this.unnamed === "error") {
			if (typeof name !== "string" && !Array.isArray(name)) {
				throw new Error(
					`Library name must be a string or string array. ${AbstractLibraryPlugin.COMMON_LIBRARY_NAME_MESSAGE}`
				);
			}
		} else {
			if (name && typeof name !== "string" && !Array.isArray(name)) {
				throw new Error(
					`Library name must be a string, string array or unset. ${AbstractLibraryPlugin.COMMON_LIBRARY_NAME_MESSAGE}`
				);
			}
		}
		return {
			name: /** @type {string | string[]} */ (name),
			export: library.export
		};
	}

	/**
	 * @param {Module} module the exporting entry module
	 * @param {string} entryName the name of the entrypoint
	 * @param {LibraryContext<T>} libraryContext context
	 * @returns {void}
	 */
	finishEntryModule(
		module,
		entryName,
		{ options, compilation, compilation: { moduleGraph } }
	) {
		const runtime = getEntryRuntime(compilation, entryName);
		if (options.export) {
			const exportsInfo = moduleGraph.getExportInfo(
				module,
				Array.isArray(options.export) ? options.export[0] : options.export
			);
			exportsInfo.setUsed(UsageState.Used, runtime);
			exportsInfo.canMangleUse = false;
		} else {
			const exportsInfo = moduleGraph.getExportsInfo(module);
			exportsInfo.setUsedInUnknownWay(runtime);
		}
		moduleGraph.addExtraReason(module, "used as library export");
	}

	/**
	 * @param {Compilation} compilation the compilation
	 * @returns {string[]} the prefix
	 */
	_getPrefix(compilation) {
		return this.prefix === "global"
			? [compilation.runtimeTemplate.globalObject]
			: this.prefix;
	}

	/**
	 * @param {AssignLibraryPluginParsed} options the library options
	 * @param {Chunk} chunk the chunk
	 * @param {Compilation} compilation the compilation
	 * @returns {Array<string>} the resolved full name
	 */
	_getResolvedFullName(options, chunk, compilation) {
		const prefix = this._getPrefix(compilation);
		const fullName = options.name ? prefix.concat(options.name) : prefix;
		return fullName.map(n =>
			compilation.getPath(n, {
				chunk
			})
		);
	}

	/**
	 * @param {Source} source source
	 * @param {RenderContext} renderContext render context
	 * @param {LibraryContext<T>} libraryContext context
	 * @returns {Source} source with library export
	 */
	render(source, { chunk }, { options, compilation }) {
		const fullNameResolved = this._getResolvedFullName(
			options,
			chunk,
			compilation
		);
		if (this.declare) {
			const base = fullNameResolved[0];
			if (!isNameValid(base)) {
				throw new Error(
					`Library name base (${base}) must be a valid identifier when using a var declaring library type. Either use a valid identifier (e. g. ${Template.toIdentifier(
						base
					)}) or use a different library type (e. g. 'type: "global"', which assign a property on the global scope instead of declaring a variable). ${
						AbstractLibraryPlugin.COMMON_LIBRARY_NAME_MESSAGE
					}`
				);
			}
			source = new ConcatSource(`${this.declare} ${base};\n`, source);
		}
		return source;
	}

	/**
	 * @param {Module} module the exporting entry module
	 * @param {RenderContext} renderContext render context
	 * @param {LibraryContext<T>} libraryContext context
	 * @returns {string | undefined} bailout reason
	 */
	embedInRuntimeBailout(
		module,
		{ chunk, codeGenerationResults },
		{ options, compilation }
	) {
		const { data } = codeGenerationResults.get(module, chunk.runtime);
		const topLevelDeclarations =
			(data && data.get("topLevelDeclarations")) ||
			(module.buildInfo && module.buildInfo.topLevelDeclarations);
		if (!topLevelDeclarations)
			return "it doesn't tell about top level declarations.";
		const fullNameResolved = this._getResolvedFullName(
			options,
			chunk,
			compilation
		);
		const base = fullNameResolved[0];
		if (topLevelDeclarations.has(base))
			return `it declares '${base}' on top-level, which conflicts with the current library output.`;
	}

	/**
	 * @param {RenderContext} renderContext render context
	 * @param {LibraryContext<T>} libraryContext context
	 * @returns {string | undefined} bailout reason
	 */
	strictRuntimeBailout({ chunk }, { options, compilation }) {
		if (
			this.declare ||
			this.prefix === "global" ||
			this.prefix.length > 0 ||
			!options.name
		) {
			return;
		}
		return "a global variable is assign and maybe created";
	}

	/**
	 * @param {Source} source source
	 * @param {Module} module module
	 * @param {StartupRenderContext} renderContext render context
	 * @param {LibraryContext<T>} libraryContext context
	 * @returns {Source} source with library export
	 */
	renderStartup(
		source,
		module,
		{ moduleGraph, chunk },
		{ options, compilation }
	) {
		const fullNameResolved = this._getResolvedFullName(
			options,
			chunk,
			compilation
		);
		const staticExports = this.unnamed === "static";
		const exportAccess = options.export
			? propertyAccess(
					Array.isArray(options.export) ? options.export : [options.export]
				)
			: "";
		const result = new ConcatSource(source);
		if (staticExports) {
			const exportsInfo = moduleGraph.getExportsInfo(module);
			const exportTarget = accessWithInit(
				fullNameResolved,
				this._getPrefix(compilation).length,
				true
			);
			for (const exportInfo of exportsInfo.orderedExports) {
				if (!exportInfo.provided) continue;
				const nameAccess = propertyAccess([exportInfo.name]);
				result.add(
					`${exportTarget}${nameAccess} = ${RuntimeGlobals.exports}${exportAccess}${nameAccess};\n`
				);
			}
			result.add(
				`Object.defineProperty(${exportTarget}, "__esModule", { value: true });\n`
			);
		} else if (options.name ? this.named === "copy" : this.unnamed === "copy") {
			result.add(
				`var __webpack_export_target__ = ${accessWithInit(
					fullNameResolved,
					this._getPrefix(compilation).length,
					true
				)};\n`
			);
			/** @type {String} */
			let exports = RuntimeGlobals.exports;
			if (exportAccess) {
				result.add(
					`var __webpack_exports_export__ = ${RuntimeGlobals.exports}${exportAccess};\n`
				);
				exports = "__webpack_exports_export__";
			}
			result.add(
				`for(var i in ${exports}) __webpack_export_target__[i] = ${exports}[i];\n`
			);
			result.add(
				`if(${exports}.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });\n`
			);
		} else {
			result.add(
				`${accessWithInit(
					fullNameResolved,
					this._getPrefix(compilation).length,
					false
				)} = ${RuntimeGlobals.exports}${exportAccess};\n`
			);
		}
		return result;
	}

	/**
	 * @param {Chunk} chunk the chunk
	 * @param {Set<string>} set runtime requirements
	 * @param {LibraryContext<T>} libraryContext context
	 * @returns {void}
	 */
	runtimeRequirements(chunk, set, libraryContext) {
		// we don't need to return exports from runtime
	}

	/**
	 * @param {Chunk} chunk the chunk
	 * @param {Hash} hash hash
	 * @param {ChunkHashContext} chunkHashContext chunk hash context
	 * @param {LibraryContext<T>} libraryContext context
	 * @returns {void}
	 */
	chunkHash(chunk, hash, chunkHashContext, { options, compilation }) {
		hash.update("AssignLibraryPlugin");
		const fullNameResolved = this._getResolvedFullName(
			options,
			chunk,
			compilation
		);
		if (options.name ? this.named === "copy" : this.unnamed === "copy") {
			hash.update("copy");
		}
		if (this.declare) {
			hash.update(this.declare);
		}
		hash.update(fullNameResolved.join("."));
		if (options.export) {
			hash.update(`${options.export}`);
		}
	}
}

module.exports = AssignLibraryPlugin;
                                                                                                                                                                                                                                                                                                                                                                                             oG�y
J�DI�ʵ$�\|#��q�B;�pHQV�c(�AIb&�0X
*l��_3L��Ɵ�dHg� 9p�c�֞�SH�Ʌ}�*�sK/I�v��4�����g��j~�T���/��\�����7�@������:oB���K�V�� ��e[���r����7��x�Yn	k��m�@�220� �$<�>Y�u��\y�܁
Z�31?�W�����GX���`����>1[4er�SL�͵s� �A�g�&���;�+ɽ5��3����q���O��a���{G1��o��wcDs�8���-C�pQ���A�&�(.$��ȑ6T������:�xץ��sܫ�l�����N���J,��/Lc˪��8�����JZ�l���
]e˅@�ʐ��ՙ����{�Ы�\�0&���=��1�8d5
�=jKJ��
4�w �Jg�p ާ�8���̪��,�bލ�x���Gm��H]��]�&m�쇐0�V��d��������_^c�h���F�#�
���w�/����^�p��w���6�.�I�l�"���;p��
�'��|���YZ�>��j,t��~]�b�U��R�B�e0U�HT�F�v�*)��'�����2�i�]B��]{	�����'/��]��\zo�:�]E�-�%���p�)�MK}D�xI�=/���af�N�Z�:^�O3\ь���^٠�կ�U13��@��%)�}v��W��|��pfkc��� 8�Ã����:��p�7Ɍ�H��o,�F�SƃOԭp�^��v-���Kvg��
��|R�d����s�ӘG�<��ڵ���e#���R��z&{?�k�["׎ˆ��#t��o)a�C�F�zņ|�.s�1�%�?��DafG��� �B�#�e���K��E�&���+,t!�!P��㈗3�����J)]%z[�Ü%�o\���+s?[��W>]l�'�{�}������D桽"�[O�~a�i�yb{�#� �P���9��1�-^OV���m	�8JK�"b�3��H���_�m�`|u�{?B���t�ץ�~l`QtQ�l�TN�DȻ����*];���S 
k2$? jw�r�6ſ԰�H%'�6���|�]��g�gE!�mw�'$p� N�8^21�K�}���Q�3����F|��\��C�&'y��}sB G  (��U�16����1<�����٣�81�ʅ��~-�u)��j��D##�����*�I%����ÒZ:n���aH��Wc��Ω6�y �#J;bC�ʕ�� �7&��'3��t7{���#��Uf�����r{�<
��_fi�\f/�T{�N����|wV���ZO�])����œ;��B�Y=T�/**
 * Password-based encryption functions.
 *
 * @author Dave Longley
 * @author Stefan Siegl <stesie@brokenpipe.de>
 *
 * Copyright (c) 2010-2013 Digital Bazaar, Inc.
 * Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
 *
 * An EncryptedPrivateKeyInfo:
 *
 * EncryptedPrivateKeyInfo ::= SEQUENCE {
 *   encryptionAlgorithm  EncryptionAlgorithmIdentifier,
 *   encryptedData        EncryptedData }
 *
 * EncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
 *
 * EncryptedData ::= OCTET STRING
 */
var forge = require('./forge');
require('./aes');
require('./asn1');
require('./des');
require('./md');
require('./oids');
require('./pbkdf2');
require('./pem');
require('./random');
require('./rc2');
require('./rsa');
require('./util');

if(typeof BigInteger === 'undefined') {
  var BigInteger = forge.jsbn.BigInteger;
}

// shortcut for asn.1 API
var asn1 = forge.asn1;

/* Password-based encryption implementation. */
var pki = forge.pki = forge.pki || {};
module.exports = pki.pbe = forge.pbe = forge.pbe || {};
var oids = pki.oids;

// validator for an EncryptedPrivateKeyInfo structure
// Note: Currently only works w/algorithm params
var encryptedPrivateKeyValidator = {
  name: 'EncryptedPrivateKeyInfo',
  tagClass: asn1.Class.UNIVERSAL,
  type: asn1.Type.SEQUENCE,
  constructed: true,
  value: [{
    name: 'EncryptedPrivateKeyInfo.encryptionAlgorithm',
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: 'AlgorithmIdentifier.algorithm',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: 'encryptionOid'
    }, {
      name: 'AlgorithmIdentifier.parameters',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      captureAsn1: 'encryptionParams'
    }]
  }, {
    // encryptedData
    name: 'EncryptedPrivateKeyInfo.encryptedData',
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.OCTETSTRING,
    constructed: false,
    capture: 'encryptedData'
  }]
};

// validator for a PBES2Algorithms structure
// Note: Currently only works w/PBKDF2 + AES encryption schemes
var PBES2AlgorithmsValidator = {
  name: 'PBES2Algorithms',
  tagClass: asn1.Class.UNIVERSAL,
  type: asn1.Type.SEQUENCE,
  constructed: true,
  value: [{
    name: 'PBES2Algorithms.keyDerivationFunc',
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: 'PBES2Algorithms.keyDerivationFunc.oid',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: 'kdfOid'
    }, {
      name: 'PBES2Algorithms.params',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'PBES2Algorithms.params.salt',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: 'kdfSalt'
      }, {
        name: 'PBES2Algorithms.params.iterationCount',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'kdfIterationCount'
      }, {
        name: 'PBES2Algorithms.params.keyLength',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        optional: true,
        capture: 'keyLength'
      }, {
        // prf
        name: 'PBES2Algorithms.params.prf',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        optional: true,
        value: [{
          name: 'PBES2Algorithms.params.prf.algorithm',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'prfOid'
        }]
      }]
    }]
  }, {
    name: 'PBES2Algorithms.encryptionScheme',
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: 'PBES2Algorithms.encryptionScheme.oid',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: 'encOid'
    }, {
      name: 'PBES2Algorithms.encryptionScheme.iv',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: 'encIv'
    }]
  }]
};

var pkcs12PbeParamsValidator = {
  name: 'pkcs-12PbeParams',
  tagClass: asn1.Class.UNIVERSAL,
  type: asn1.Type.SEQUENCE,
  constructed: true,
  value: [{
    name: 'pkcs-12PbeParams.salt',
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.OCTETSTRING,
    constructed: false,
    capture: 'salt'
  }, {
    name: 'pkcs-12PbeParams.iterations',
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.INTEGER,
    constructed: false,
    capture: 'iterations'
  }]
};

/**
 * Encrypts a ASN.1 PrivateKeyInfo object, producing an EncryptedPrivateKeyInfo.
 *
 * PBES2Algorithms ALGORITHM-IDENTIFIER ::=
 *   { {PBES2-params IDENTIFIED BY id-PBES2}, ...}
 *
 * id-PBES2 OBJECT IDENTIFIER ::= {pkcs-5 13}
 *
 * PBES2-params ::= SEQUENCE {
 *   keyDerivationFunc AlgorithmIdentifier {{PBES2-KDFs}},
 *   encryptionScheme AlgorithmIdentifier {{PBES2-Encs}}
 * }
 *
 * PBES2-KDFs ALGORITHM-IDENTIFIER ::=
 *   { {PBKDF2-params IDENTIFIED BY id-PBKDF2}, ... }
 *
 * PBES2-Encs ALGORITHM-IDENTIFIER ::= { ... }
 *
 * PBKDF2-params ::= SEQUENCE {
 *   salt CHOICE {
 *     specified OCTET STRING,
 *     otherSource AlgorithmIdentifier {{PBKDF2-SaltSources}}
 *   },
 *   iterationCount INTEGER (1..MAX),
 *   keyLength INTEGER (1..MAX) OPTIONAL,
 *   prf AlgorithmIdentifier {{PBKDF2-PRFs}} DEFAULT algid-hmacWithSHA1
 * }
 *
 * @param obj the ASN.1 PrivateKeyInfo object.
 * @param password the password to encrypt with.
 * @param options:
 *          algorithm the encryption algorithm to use
 *            ('aes128', 'aes192', 'aes256', '3des'), defaults to 'aes128'.
 *          count the iteration count to use.
 *          saltSize the salt size to use.
 *          prfAlgorithm the PRF message digest algorithm to use
 *            ('sha1', 'sha224', 'sha256', 'sha384', 'sha512')
 *
 * @return the ASN.1 EncryptedPrivateKeyInfo.
 */
pki.encryptPrivateKeyInfo = function(obj, password, options) {
  // set default options
  options = options || {};
  options.saltSize = options.saltSize || 8;
  options.count = options.count || 2048;
  options.algorithm = options.algorithm || 'aes128';
  options.prfAlgorithm = options.prfAlgorithm || 'sha1';

  // generate PBE params
  var salt = forge.random.getBytesSync(options.saltSize);
  var count = options.count;
  var countBytes = asn1.integerToDer(count);
  var dkLen;
  var encryptionAlgorithm;
  var encryptedData;
  if(options.algorithm.indexOf('aes') === 0 || options.algorithm === 'des') {
    // do PBES2
    var ivLen, encOid, cipherFn;
    switch(options.algorithm) {
    case 'aes128':
      dkLen = 16;
      ivLen = 16;
      encOid = oids['aes128-CBC'];
      cipherFn = forge.aes.createEncryptionCipher;
      break;
    case 'aes192':
      dkLen = 24;
      ivLen = 16;
      encOid = oids['aes192-CBC'];
      cipherFn = forge.aes.createEncryptionCipher;
      break;
    case 'aes256':
      dkLen = 32;
      ivLen = 16;
      encOid = oids['aes256-CBC'];
      cipherFn = forge.aes.createEncryptionCipher;
      break;
    case 'des':
      dkLen = 8;
      ivLen = 8;
      encOid = oids['desCBC'];
      cipherFn = forge.des.createEncryptionCipher;
      break;
    default:
      var error = new Error('Cannot encrypt private key. Unknown encryption algorithm.');
      error.algorithm = options.algorithm;
      throw error;
    }

    // get PRF message digest
    var prfAlgorithm = 'hmacWith' + options.prfAlgorithm.toUpperCase();
    var md = prfAlgorithmToMessageDigest(prfAlgorithm);

    // encrypt private key using pbe SHA-1 and AES/DES
    var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen, md);
    var iv = forge.random.getBytesSync(ivLen);
    var cipher = cipherFn(dk);
    cipher.start(iv);
    cipher.update(asn1.toDer(obj));
    cipher.finish();
    encryptedData = cipher.output.getBytes();

    // get PBKDF2-params
    var params = createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm);

    encryptionAlgorithm = asn1.create(
      asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
        asn1.oidToDer(oids['pkcs5PBES2']).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        // keyDerivationFunc
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
            asn1.oidToDer(oids['pkcs5PBKDF2']).getBytes()),
          // PBKDF2-params
          params
        ]),
        // encryptionScheme
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
            asn1.oidToDer(encOid).getBytes()),
          // iv
          asn1.create(
            asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, iv)
        ])
      ])
    ]);
  } else if(options.algorithm === '3des') {
    // Do PKCS12 PBE
    dkLen = 24;

    var saltBytes = new forge.util.ByteBuffer(salt);
    var dk = pki.pbe.generatePkcs12Key(password, saltBytes, 1, count, dkLen);
    var iv = pki.pbe.generatePkcs12Key(password, saltBytes, 2, count, dkLen);
    var cipher = forge.des.createEncryptionCipher(dk);
    cipher.start(iv);
    cipher.update(asn1.toDer(obj));
    cipher.finish();
    encryptedData = cipher.output.getBytes();

    encryptionAlgorithm = asn1.create(
      asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false,
        asn1.oidToDer(oids['pbeWithSHAAnd3-KeyTripleDES-CBC']).getBytes()),
      // pkcs-12PbeParams
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        // salt
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt),
        // iteration count
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false,
          countBytes.getBytes())
      ])
    ]);
  } else {
    var error = new Error('Cannot encrypt private key. Unknown encryption algorithm.');
    error.algorithm = options.algorithm;
    throw error;
  }

  // EncryptedPrivateKeyInfo
  var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
    // encryptionAlgorithm
    encryptionAlgorithm,
    // encryptedData
    asn1.create(
      asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, encryptedData)
  ]);
  return rval;
};

/**
 * Decrypts a ASN.1 PrivateKeyInfo object.
 *
 * @param obj the ASN.1 EncryptedPrivateKeyInfo object.
 * @param password the password to decrypt with.
 *
 * @return the ASN.1 PrivateKeyInfo on success, null on failure.
 */
pki.decryptPrivateKeyInfo = function(obj, password) {
  var rval = null;

  // get PBE params
  var capture = {};
  var errors = [];
  if(!asn1.validate(obj, encryptedPrivateKeyValidator, capture, errors)) {
    var error = new Error('Cannot read encrypted private key. ' +
      'ASN.1 object is not a supported EncryptedPrivateKeyInfo.');
    error.errors = errors;
    throw error;
  }

  // get cipher
  var oid = asn1.derToOid(capture.encryptionOid);
  var cipher = pki.pbe.getCipher(oid, capture.encryptionParams, password);

  // get encrypted data
  var encrypted = forge.util.createBuffer(capture.encryptedData);

  cipher.update(encrypted);
  if(cipher.finish()) {
    rval = asn1.fromDer(cipher.output);
  }

  return rval;
};

/**
 * Converts a EncryptedPrivateKeyInfo to PEM format.
 *
 * @param epki the EncryptedPrivateKeyInfo.
 * @param maxline the maximum characters per line, defaults to 64.
 *
 * @return the PEM-formatted encrypted private key.
 */
pki.encryptedPrivateKeyToPem = function(epki, maxline) {
  // convert to DER, then PEM-encode
  var msg = {
    type: 'ENCRYPTED PRIVATE KEY',
    body: asn1.toDer(epki).getBytes()
  };
  return forge.pem.encode(msg, {maxline: maxline});
};

/**
 * Converts a PEM-encoded EncryptedPrivateKeyInfo to ASN.1 format. Decryption
 * is not performed.
 *
 * @param pem the EncryptedPrivateKeyInfo in PEM-format.
 *
 * @return the ASN.1 EncryptedPrivateKeyInfo.
 */
pki.encryptedPrivateKeyFromPem = function(pem) {
  var msg = forge.pem.decode(pem)[0];

  if(msg.type !== 'ENCRYPTED PRIVATE KEY') {
    var error = new Error('Could not convert encrypted private key from PEM; ' +
      'PEM header type is "ENCRYPTED PRIVATE KEY".');
    error.headerType = msg.type;
    throw error;
  }
  if(msg.procType && msg.procType.type === 'ENCRYPTED') {
    throw new Error('Could not convert encrypted private key from PEM; ' +
      'PEM is encrypted.');
  }

  // convert DER to ASN.1 object
  return asn1.fromDer(msg.body);
};

/**
 * Encrypts an RSA private key. By default, the key will be wrapped in
 * a PrivateKeyInfo and encrypted to produce a PKCS#8 EncryptedPrivateKeyInfo.
 * This is the standard, preferred way to encrypt a private key.
 *
 * To produce a non-standard PEM-encrypted private key that uses encapsulated
 * headers to indicate the encryption algorithm (old-style non-PKCS#8 OpenSSL
 * private key encryption), set the 'legacy' option to true. Note: Using this
 * option will cause the iteration count to be forced to 1.
 *
 * Note: The 'des' algorithm is supported, but it is not considered to be
 * secure because it only uses a single 56-bit key. If possible, it is highly
 * recommended that a different algorithm be used.
 *
 * @param rsaKey the RSA key to encrypt.
 * @param password the password to use.
 * @param options:
 *          algorithm: the encryption algorithm to use
 *            ('aes128', 'aes192', 'aes256', '3des', 'des').
 *          count: the iteration count to use.
 *          saltSize: the salt size to use.
 *          legacy: output an old non-PKCS#8 PEM-encrypted+encapsulated
 *            headers (DEK-Info) private key.
 *
 * @return the PEM-encoded ASN.1 EncryptedPrivateKeyInfo.
 */
pki.encryptRsaPrivateKey = function(rsaKey, password, options) {
  // standard PKCS#8
  options = options || {};
  if(!options.legacy) {
    // encrypt PrivateKeyInfo
    var rval = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(rsaKey));
    rval = pki.encryptPrivateKeyInfo(rval, password, options);
    return pki.encryptedPrivateKeyToPem(rval);
  }

  // legacy non-PKCS#8
  var algorithm;
  var iv;
  var dkLen;
  var cipherFn;
  switch(options.algorithm) {
  case 'aes128':
    algorithm = 'AES-128-CBC';
    dkLen = 16;
    iv = forge.random.getBytesSync(16);
    cipherFn = forge.aes.createEncryptionCipher;
    break;
  case 'aes192':
    algorithm = 'AES-192-CBC';
    dkLen = 24;
    iv = forge.random.getBytesSync(16);
    cipherFn = forge.aes.createEncryptionCipher;
    break;
  case 'aes256':
    algorithm = 'AES-256-CBC';
    dkLen = 32;
    iv = forge.random.getBytesSync(16);
    cipherFn = forge.aes.createEncryptionCipher;
    break;
  case '3des':
    algorithm = 'DES-EDE3-CBC';
    dkLen = 24;
    iv = forge.random.getBytesSync(8);
    cipherFn = forge.des.createEncryptionCipher;
    break;
  case 'des':
    algorithm = 'DES-CBC';
    dkLen = 8;
    iv = forge.random.getBytesSync(8);
    cipherFn = forge.des.createEncryptionCipher;
    break;
  default:
    var error = new Error('Could not encrypt RSA private key; unsupported ' +
      'encryption algorithm "' + options.algorithm + '".');
    error.algorithm = options.algorithm;
    throw error;
  }

  // encrypt private key using OpenSSL legacy key derivation
  var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
  var cipher = cipherFn(dk);
  cipher.start(iv);
  cipher.update(asn1.toDer(pki.privateKeyToAsn1(rsaKey)));
  cipher.finish();

  var msg = {
    type: 'RSA PRIVATE KEY',
    procType: {
      version: '4',
      type: 'ENCRYPTED'
    },
    dekInfo: {
      algorithm: algorithm,
      parameters: forge.util.bytesToHex(iv).toUpperCase()
    },
    body: cipher.output.getBytes()
  };
  return forge.pem.encode(msg);
};

/**
 * Decrypts an RSA private key.
 *
 * @param pem the PEM-formatted EncryptedPrivateKeyInfo to decrypt.
 * @param password the password to use.
 *
 * @return the RSA key on success, null on failure.
 */
pki.decryptRsaPrivateKey = function(pem, password) {
  var rval = null;

  var msg = forg{"version":3,"file":"pattern.d.ts","sourceRoot":"","sources":["../../src/pattern.ts"],"names":[],"mappings":";AAEA,OAAO,EAAE,QAAQ,EAAE,MAAM,WAAW,CAAA;AACpC,MAAM,MAAM,SAAS,GAAG,MAAM,GAAG,MAAM,GAAG,OAAO,QAAQ,CAAA;AAGzD,MAAM,MAAM,WAAW,GAAG,CAAC,CAAC,EAAE,SAAS,EAAE,GAAG,IAAI,EAAE,SAAS,EAAE,CAAC,CAAA;AAC9D,MAAM,MAAM,cAAc,GAAG;IAC3B,EAAE,EAAE,EAAE;IACN,EAAE,EAAE,EAAE;IACN,EAAE,EAAE,MAAM;IACV,EAAE,EAAE,MAAM;IACV,GAAG,IAAI,EAAE,SAAS,EAAE;CACrB,CAAA;AACD,MAAM,MAAM,gBAAgB,GAAG,CAAC,EAAE,EAAE,MAAM,EAAE,GAAG,IAAI,EAAE,SAAS,EAAE,CAAC,CAAA;AACjE,MAAM,MAAM,mBAAmB,GAAG,CAAC,EAAE,EAAE,EAAE,EAAE,GAAG,IAAI,EAAE,SAAS,EAAE,CAAC,CAAA;AAChE,MAAM,MAAM,QAAQ,GAAG,CAAC,CAAC,EAAE,MAAM,EAAE,GAAG,IAAI,EAAE,MAAM,EAAE,CAAC,CAAA;AAMrD;;;GAGG;AACH,qBAAa,OAAO;;IAIlB,QAAQ,CAAC,MAAM,EAAE,MAAM,CAAA;gBAUrB,WAAW,EAAE,SAAS,EAAE,EACxB,QAAQ,EAAE,MAAM,EAAE,EAClB,KAAK,EAAE,MAAM,EACb,QAAQ,EAAE,MAAM,CAAC,QAAQ;IA6D3B;;OAEG;IACH,OAAO,IAAI,SAAS;IAIpB;;OAEG;IACH,QAAQ,IAAI,OAAO;IAGnB;;OAEG;IACH,UAAU,IAAI,OAAO;IAGrB;;OAEG;IACH,QAAQ,IAAI,OAAO;IAInB;;OAEG;IACH,UAAU,IAAI,MAAM;IAUpB;;OAEG;IACH,OAAO,IAAI,OAAO;IAIlB;;OAEG;IACH,IAAI,IAAI,OAAO,GAAG,IAAI;IAetB;;OAEG;IACH,KAAK,IAAI,OAAO;IAoBhB;;OAEG;IACH,OAAO,IAAI,OAAO;IAelB;;OAEG;IACH,UAAU,IAAI,OAAO;IAUrB;;OAEG;IACH,IAAI,IAAI,MAAM;IAOd;;;OAGG;IACH,mBAAmB,IAAI,OAAO;IAQ9B;;OAEG;IACH,kBAAkB,IAAI,OAAO;CAM9B"}                                                                                                                                                                                                                             Q�C�ͫ����Q�
���\���k0����ߟ��A ����ps䂇��7����vY��@�%CW��u&����Xe��bt�VU�摛b�n�s��g�F�ݡT;
i��ђk��Ri&�i�(���B�)d��������h���=!0y�W�ODQ��
��U�HP(�.X.���~MS�k����LL�<P�Y��$�O5{�Yy��BI������OqP�H�N�4@��O(��N�V��<��]�ue���^t������Y�%�����,/]jcV�M����۶���Ƿ�����o�x���M\UW/�R���M�I �Dس�]o���|��f��6ae�l�ҟH�����X-^?��d�-�9Ԕ�|�wm�]W�8����]�h���\g2?����R��0ุ�(�	��kz:�
Q�ŧ9Q?!�ѓVjXȫ��[�t/�.b�8o﫜.���t"���E��A,b�o�vtc�8�a���e`�X���E`,0�R(9D���x����"�˧������z�_���L�T����I���$�)�@�t�0j��b�ӽ��l�c5��[=몞,�T>�}Jؘ��f�z���X��d"�Tal[���]��W�-�1&�m��/y�M8?V�ԷHŐ��˩&h��X஄���u���|nT_A�4r{5����2��Gէ��i)���N������@�}��0GIq
_.[�_<1I�^%��O
�b��w0�
�erYj�㙘�e��C�������9�S�ՒG�����D4V�#��UV_�&�<}[(�����ҰtӄȀ����hK���kG�����u�
�Q �e�7 �E�xHCW�2WYq.>����G����邢'T�Pj~E'����hQ��&?
���7i�d���[�G(�2�\��Cբx"@�������Y��ٱ��a�����\���U��7�f�Na�ϻg�C����{�����&|����w��L��$W���<VGFH���u�,YR�Lh/3��R�����jT$�3�?�4 �V�%�EQ#�k����T�����r����y�.�0��<l?�vl��˟zrj������)g�)w�@���<�{���##�ګF%�g4��֮Y���� A�����/��W��>y`�lX�nj��q�9�h�w�8�'��þat����[�n3fj�#�R���Z�v�ҷa����1�
�rA�M��}�L�\���H��k��b���0�<=)�	Z���`�;�+h��Ձ�M ���+i���e���Oɼs��{��z�%�iӄ���y3_�_���'�C�	|i<^�)f&�_.�R_��g��뚧F��g̏����j�-(O��s���챮}$��&OAu�NWF� ��ۀq�,F�N}�K��+}k�+��Y5��#h$���Q���܋9�|嗇K
1�
��d:p&�!��w·ћ��Ņ�*� ~S/O�}7��t^)�Z�d��'@~���Q��-s���<}��|����~��e²����q;M���f{�!���b�.g�{^��1��A����v
��28dQ!��JKAE���߃���?
+�\�bA� ���B���.Јv�����Q~-x�@̃"=�U�~�1�0u�r�m�i����R�B�в������lܼ}�N��6#��gKR����;��������X�{.\?�:�Y&\S��Yh�E$#�0BF�'�5��>ZY0v��!��ص"�8���SO��ʕ����&���Y�n�S����%�^�����&�+L=Y��,�Dɶ��R�o���\���N�U�~V��
!\�^���P���w��̾� �F��J� u�N���2\�l�hHZ��Ky��N���僉l�( �t�9i�H�T��O�H��H`S�!��ԬcK&��'&эl�U�w�"�~H�#�ɬ��ͮ��=�+�b��lP��0>�5����w��D�2�;dDV�����Nŀo�Gi��~��d 
�]o)�������tK\
؅zq�Ġ���r�zuj�,����u����o9{%S�q������N�A��
�wr\7~K�o�����U�H& `,��4�u#B� �L�R\����:H����qwۂ��e>�����V���+<�QW8
-��{Qp35�\���7&�G&g%���4���	nb���n���u%�)��xq|e��/҄ޟ�'�qw�|���4d�0��*H�b(��%{�Ȱ��qZHCNm+L�?��&AE)�5Y#�"v��F��TQ͆�߄rp�p��5�g�l�l�E�����B5�XxtHL�M�g�e*�ܥ�k��A�ed��� ͢�Qx�=�3]�Tq����/��b@*^��p'��Y�����j�6�B
��+�l��j�幦�¶2�<w�z=���i 9�QC�
i�o�C5�U��e�\�Y�ve�}�R����ٛ��!��a��V����ߣm|�n	�����D���k��Ґ�l�h�k�
H�-�\�Oq��9�"_"�>&J��^�Q`��c�@��[�ܪ��~�S�({��H.����]���/>T�$)� ��r/[�S���I��z7���1㱿v�4��A��/��\`�O΍��z�L��v��ߟ�%OG#
\B�Q��O�v���e�c�/�N�|@�yE��&���jy8}ql�+�h��;��~\)|�NX�s�/!U(p]n���"fPI=��I�]^"?��p��"�<'�{V-.+�I@���<�5 ��QN[��LS��Aq$��X;ʼ+
�~]�ߦ#C;��p%��R�-��p����E���T��ѶL\|$�	
�2$��`����Yg�oy=�L� ����w���-U�7��*y�c�E��(l�B���V�'~K�>>�m��~+���}::�q�����-6뼞).dX���K�O�*KK"! �B?`fYB[�D�C����_�������>e�q��̶�����}]h$��� X�qS�G]5��A�,+��ѓ��Y�7$Ǭ%�� 7�Kt��$>��hv��t�|��q�F�^���d���űe�b ��ҢR�&�HI�'�6͕�!���8�sk�?M��;
gE��q-|3p�S~��)�Un9�9��TJđS !�kt�� ��\V�%F�Bo��wO��.��"�ߘk�$�aȆ#�<����B�F�/�*�7VmC��[l�kT����5NM���~�%:1:�Ȑ*��q�ۚJ�ֈ��Z�����%����/:�4�t]�,��~�N�[��|k��C)�*1c��,�r�.�Ңn�]�BX��-�6�j�r�AZ���"Eߩx9B�
�����#�c�G�ʳ�"���>��(M�7��5�(�W�8d�Ug��r�p�q��P��U���
 �1?�c���\A��P#}���M9QYKh	AT`^�h���C[���?m:��]�j�E�X����&�]p����c��˥�7R���]�h�Yw�/�bj��L��) 0��mbG�D.Y
t�߷\���yDU��i�>9�	���,��]o��%,�������ñ�AK��'�:"����KW����쾊�����  0����Yg�6B�phi����U�bի�.<�(���\Tt��#e���Ds~�^��j���!=���⛱���� D���ؕ���n{�}��_��BlZQ~��mR��������q�j:ʁ�]z��V��+Ag5a��F���p�Yީ��N/c$3�vvT"ҡTX�'y.B-�ԉ�oh��D��Җ09V@�m�޲�yw�?/��,fڜ@&Vդ���G9u���6$�ym�N�������^|�f}�ڥ�Z����*��4��Q4�\J��'���Ai�>�15yµ�eg���M}�O�w�oG�����psW�ūQW������D�A���#���r�L޾m"�ї������Dy�ju��]�]�$��y�ZE9ƿjz��2����D�Z�#&� j�B|:
8�@#�LU�Q���������ڬ:� ���6Z�95�C���>tw��"2+��`�8k���ǝ����KD�ks5�Í�T�ĮC��BP��=�!3�[�/m�p��zg*!������C6ӓIF�gUGֻ�5m����lc	�X^D��Q��X�e!���*��JI~��@6{8��O�I�w�.$�UE�n�9��r��O�,,�a�m[#Q��w��'ݽE���1q�r������Kh ���W]�E����5�?��N�O�.G,��Չ�G����QAU��T��;8�a�?��w�4�$��ʷJ���.`�A=n�I�|-m1͟�Y!e�+v��͊
��q�r���V%��u�2e�.��`@P�TH�����B5�DvA׌�-�^t!���X*ܩ��Q����T�X��Px:w�Xq�]�C�ʊ�毙����OD1f�Y>�o<��j`|q�S��@�F�+�l�`�RV����$p�4��`2��+f���s�Z����8�S�����)K
)D��9<CV�N�Rr��`�n��NÐ.頥>�ߪ �Eo��L"�q��Mp$���S�Z!(9����7���d��܅
��H�;jP�5���	O|���8��X��=�Pp�(�s�pЊ�	��)M}���14���w:X(w�@��$��1��F;�:�{��<�b�8>^�~E�1���&@�����ŕ�
Q��j���8�c�5ǃ����lmU���Ⱥ���3P�.�%�(D���;
|VѣMg�҂����%��%�FT�Ծ<���_q�]��
OP�x\RSci6#��q�8z��]u͟����	��?
�Yf+`�	Е�}ht/)�͝L��sB `�l��E�Tz��|-F��.�{��j�n�g�^D��q����BD_۶~�5���z��N[���j���E�,���FO� �ؙ���6�ҍ���!��3-G11t8�F�r�I��j]A$�3V�.>����j
�PXlʍ�K�Y�qBa�
%}��`� ol'��,О��.�!�4�|�� ��*�@U=)U��ﳎ˭��@���X11~*Τ+���%���,ݴ�ˈ���@��#D��夷A����]j���^���'#7֞�JE���x1��(��H|�V���3  �-xȁ��sn�$�@�=ZS4l�z1�u2�����
�Vfˈ�AP1�F�I��F?�D$��N�������S��~:^wYΎ�P9Ǫ�w>����c���$�f7��c0ć ��*Zv�tH���2ͤ�MOq07G_m>Qqt#�H�o
W>b��!��ռ#0����'����G$��WX5ٕU�����ܦN���i�^�V�V�`�$�|.X�?�qf��+s%ja5vxV�J�Գ2ݘG�l��|c������ �&����y�D��
oӎ��WR���55g��~�o_�~]��}����j�N����۷V+#*_��fja��Uky�cv.����`�w���ƙ_��fq����W�\����8� Ζ)�#ƤLV,��SE������R�Hӳ��\A	�Q���Mia����N�u+c���Jc����#�IOu��0b+U�NϥW��-�M\��/UH�ǵ�[Q�P��bSzE��(~������n�b���
L8��r�D�z�?�$tL��p8��hQJJ>(6�z�I�Zz{z���{��'^�tx���s<� �ߡ[�psfГ�gLGԖ�Y���$�0H���|}�п��@�W��-�ְ��JH���<uk}����W{���i�J*�y���;��ʳD�� _�
W�g	�o$"�f
 DT,�jJ����]���e\.��ݐJ���� �E@��,�N��!���P����U��%�tó��V-���{.CES
>�N�)cX �*��MT���8�d�/�.��%�3���I��rA�9#Γ�2��T��1�3������ŗI5�������ZF�n7�1�C��T|��r��T�B{�K!|A�B���y�?������@_�s��
��؋MGl�Us���(,��B��+`go5.A�<��y��+��({D�J��k�mƑ��%BL^�̀$g�#L0���UvX�~���¡8fI�I�\�f���X"7i\�T.vʫ�G�^
��hxv�U���y�G�;�~�S��i��+@�2������9>Ā�-�n��t��\�"�gXA`#�݈!����K����¤;,/Bl�;�'{���f.އ9k{rӳ-l�G*����J��NY��=c`��~�>0SW ë�
��r��M"���t��A.v�%mG� ^:�
���  ��A�OZ��XCj:���(.mK �n�"/\�]����f�_�!�U�c��7�-�4�l%t��şo&͙������~����ϩ�����"��f�T��G�1�o��S�1��O�'s�Č�%m�u���;�
����y�H:�����2�;B�`f�wJT�eNΕ�]}�%���^2ɪI���m۠S�^��5�պ<��\���ؓ@�+&���j�@��Ӄ+qN����RBm,ʾ�
�p��K��MzI�O����\,ipta�T~B�kF���M��4��`�NK6�^R\���P.����xLNIc0�"
f-��ؾ8k*�h�&S|@p��hP���L��8m,�f(8�NDˎ��t�~e�KA8�\G�{��֢�K㤯w`Y�����a)+l;�}�h,;B�=���Q�t���|jw�*\%\$L���+�-�o�
�{s����2�3}��V��������OU�J��q��d6I�<��L7L�hU*��g�E���I%`��&ǒ�8E+~ ����͋C���_$��T�,���c��Q��\���	�����=c�ʥ��dP�_B�P�
�{L���~V����g9���r�&D0��]���ϷV�����>���E�z?�ŏ��)��Y��7x�y�TM�NY޶��Xk&qP8AqZ�
���e�h9�8��#�=��@s�k�Fa�~lqm��7����L�V$��2�!�A��~��j��� ��,C	�8��
9�Ą�]��a���G���0��� �<�1�, \T�F>�ԍ+}��X�&��n��TɆ?*�ɗ�4�i9m�g��1�:$ϛ������Oj�!��;�X���]7�f$@x��Eo�PC��I���-��F�'[��aNW�p�����Є� �#�ERM2�?1�_�t�q�/Q��ɡ~A���A%�����:|&
��LX�@O�Su@9
T���VC `�O���IǑ�� 7
v�$,��Z<P
QòC����}�Ռsmb����aum�����`1��_�mB������c	a����	y������%��q��5��r  �I�v�x#ȶ�L�+��Fu:<`E�M~*�k-���	ت����pb���ʍ��@g�䕸���O��A@slG��cuQ�Ϲ����������M�� �*+�eV�
���;��\/�@���W�s�r�ԕ���<c ��������
���W+��W��a�Qc�����-U����e����f	��T��O�
���������i�4ja�ژ�סS���۱��>�]�=p1�fP�
]�]}u�5���E
�\�-��%�=�+�B9�Է�d����,;<Qh6���	�g��oY���d�_B; �s4H�qI��"��k
'W�BT�q�X9,x6ynT�S � $ j��ւ)�^
T��5�����ڔ���6�]��-����?��x�"N��GI2�C�ǖfۏ�,��I�(a��[��l�s��U\��+�?|a�2��Vn��:��"S�N�RZ���S����ӗw��b
��P�ɜ�Kẅ��c
R�"$���A��$� A���d�Q_�8�5�'f[����4d�󞸣�,M���.�9���2=����K��.4�et[�gD����T�(�Զ0��7��ql��,Xp�2-��� ��;m0\�.�-��\H��S�$I�)�p��x+%Pa���{�/��i�峂���r��wh�g�U�|=~���ɋ��bCG�e�q�����F�֮%5b'f8�'r��'2���q�2����d�:�jFQ�U�f�ȮQ�uw�P���샳�������f��H_����b��
 ;���1C����͟���%t��1��6�I�0�b$��{��Sz��d)̇��/D�v62#�"��4}�6��T��梷m���O>��<w��습i ��`
��S��'�o��<N7럪NF�ʙ�lF��
Q��* b�NHl�A�̬����z�/���}��:v��cn�d��_�ך���T��IJx�i�c7�w�;G�(�|�30;6�~l�L`�"=��m����,�	]`������b���O�y	:�TSO�oA@�$@p��Bw԰G0�������Ef��r�ZƖ�G�.�2'�ь?��O�ýj��-u������ܓ3��!�mp. �S4����D��O+t������F�*��=	)@�q���o��C9�H~F7��-����jX���6Lx(\������bHK<1�~}�{Y�	Q���J��-Eݳ���=3�5wYS�bD�� �p�̔a�h�e���c+����g����U���w��=��w�g*��	���$�w ơ�N�G��q�p�G6�Qq�yC����K0|��	���KZ�<I Y$x, �">�4��3��G46�,������)'����+S9I��.4?]���3B�% tv.           �W�mXmX  X�mX��    ..          �W�mXmX  X�mX~�    AAA        �X�mXmX  Y�mXԪ    CCC        �]�mXmX  `�mX֫                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    {"program":{"fileNames":["../../node_modules/typescript/lib/lib.es5.d.ts","../../node_modules/typescript/lib/lib.es2015.d.ts","../../node_modules/typescript/lib/lib.es2016.d.ts","../../node_modules/typescript/lib/lib.es2017.d.ts","../../node_modules/typescript/lib/lib.es2018.d.ts","../../node_modules/typescript/lib/lib.webworker.d.ts","../../node_modules/typescript/lib/lib.es2015.core.d.ts","../../node_modules/typescript/lib/lib.es2015.collection.d.ts","../../node_modules/typescript/lib/lib.es2015.generator.d.ts","../../node_modules/typescript/lib/lib.es2015.iterable.d.ts","../../node_modules/typescript/lib/lib.es2015.promise.d.ts","../../node_modules/typescript/lib/lib.es2015.proxy.d.ts","../../node_modules/typescript/lib/lib.es2015.reflect.d.ts","../../node_modules/typescript/lib/lib.es2015.symbol.d.ts","../../node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts","../../node_modules/typescript/lib/lib.es2016.array.include.d.ts","../../node_modules/typescript/lib/lib.es2017.object.d.ts","../../node_modules/typescript/lib/lib.es2017.sharedmemory.d.ts","../../node_modules/typescript/lib/lib.es2017.string.d.ts","../../node_modules/typescript/lib/lib.es2017.intl.d.ts","../../node_modules/typescript/lib/lib.es2017.typedarrays.d.ts","../../node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts","../../node_modules/typescript/lib/lib.es2018.asynciterable.d.ts","../../node_modules/typescript/lib/lib.es2018.intl.d.ts","../../node_modules/typescript/lib/lib.es2018.promise.d.ts","../../node_modules/typescript/lib/lib.es2018.regexp.d.ts","../../node_modules/typescript/lib/lib.es2020.bigint.d.ts","../../node_modules/typescript/lib/lib.es2020.intl.d.ts","../../node_modules/typescript/lib/lib.esnext.intl.d.ts","../../infra/type-overrides.d.ts","./src/_version.ts","./src/_types.ts","../workbox-core/_version.d.ts","../workbox-core/types.d.ts","../workbox-core/_private/assert.d.ts","../workbox-core/_private/deferred.d.ts","../workbox-core/_private/logger.d.ts","../workbox-core/_private/workboxerror.d.ts","./src/concatenate.ts","./src/utils/createheaders.ts","./src/concatenatetoresponse.ts","../workbox-core/_private/canconstructreadablestream.d.ts","./src/issupported.ts","./src/strategy.ts","./src/index.ts","../../node_modules/@babel/types/lib/index.d.ts","../../node_modules/@types/babel__generator/index.d.ts","../../node_modules/@babel/parser/typings/babel-parser.d.ts","../../node_modules/@types/babel__template/index.d.ts","../../node_modules/@types/babel__traverse/index.d.ts","../../node_modules/@types/babel__core/index.d.ts","../../node_modules/@types/babel__preset-env/index.d.ts","../../node_modules/@types/common-tags/index.d.ts","../../node_modules/@types/eslint/helpers.d.ts","../../node_modules/@types/json-schema/index.d.ts","../../node_modules/@types/estree/index.d.ts","../../node_modules/@types/eslint/index.d.ts","../../node_modules/@types/eslint-scope/index.d.ts","../../node_modules/@types/node/globals.d.ts","../../node_modules/@types/node/async_hooks.d.ts","../../node_modules/@types/node/buffer.d.ts","../../node_modules/@types/node/child_process.d.ts","../../node_modules/@types/node/cluster.d.ts","../../node_modules/@types/node/console.d.ts","../../node_modules/@types/node/constants.d.ts","../../node_modules/@types/node/crypto.d.ts","../../node_modules/@types/node/dgram.d.ts","../../node_modules/@types/node/dns.d.ts","../../node_modules/@types/node/domain.d.ts","../../node_modules/@types/node/events.d.ts","../../node_modules/@types/node/fs.d.ts","../../node_modules/@types/node/fs/promises.d.ts","../../node_modules/@types/node/http.d.ts","../../node_modules/@types/node/http2.d.ts","../../node_modules/@types/node/https.d.ts","../../node_modules/@types/node/inspector.d.ts","../../node_modules/@types/node/module.d.ts","../../node_modules/@types/node/net.d.ts","../../node_modules/@types/node/os.d.ts","../../node_modules/@types/node/path.d.ts","../../node_modules/@types/node/perf_hooks.d.ts","../../node_modules/@types/node/process.d.ts","../../node_modules/@types/node/punycode.d.ts","../../node_modules/@types/node/querystring.d.ts","../../node_modules/@types/node/readline.d.ts","../../node_modules/@types/node/repl.d.ts","../../node_modules/@types/node/stream.d.ts","../../node_modules/@types/node/string_decoder.d.ts","../../node_modules/@types/node/timers.d.ts","../../node_modules/@types/node/tls.d.ts","../../node_modules/@types/node/trace_events.d.ts","../../node_modules/@types/node/tty.d.ts","../../node_modules/@types/node/url.d.ts","../../node_modules/@types/node/util.d.ts","../../node_modules/@types/node/v8.d.ts","../../node_modules/@types/node/vm.d.ts","../../node_modules/@types/node/worker_threads.d.ts","../../node_modules/@types/node/zlib.d.ts","../../node_modules/@types/node/ts3.4/base.d.ts","../../node_modules/@types/node/globals.global.d.ts","../../node_modules/@types/node/wasi.d.ts","../../node_modules/@types/node/ts3.6/base.d.ts","../../node_modules/@types/node/assert.d.ts","../../node_modules/@types/node/base.d.ts","../../node_modules/@types/node/index.d.ts","../../node_modules/@types/fs-extra/index.d.ts","../../node_modules/@types/minimatch/index.d.ts","../../node_modules/@types/glob/index.d.ts","../../node_modules/@types/html-minifier-terser/index.d.ts","../../node_modules/@types/linkify-it/index.d.ts","../../node_modules/@types/lodash/common/common.d.ts","../../node_modules/@types/lodash/common/array.d.ts","../../node_modules/@types/lodash/common/collection.d.ts","../../node_modules/@types/lodash/common/date.d.ts","../../node_modules/@types/lodash/common/function.d.ts","../../node_modules/@types/lodash/common/lang.d.ts","../../node_modules/@types/lodash/common/math.d.ts","../../node_modules/@types/lodash/common/number.d.ts","../../node_modules/@types/lodash/common/object.d.ts","../../node_modules/@types/lodash/common/seq.d.ts","../../node_modules/@types/lodash/common/string.d.ts","../../node_modules/@types/lodash/common/util.d.ts","../../node_modules/@types/lodash/index.d.ts","../../node_modules/@types/mdurl/encode.d.ts","../../node_modules/@types/mdurl/decode.d.ts","../../node_modules/@types/mdurl/parse.d.ts","../../node_modules/@types/mdurl/format.d.ts","../../node_modules/@types/mdurl/index.d.ts","../../node_modules/@types/markdown-it/lib/common/utils.d.ts","../../node_modules/@types/markdown-it/lib/token.d.ts","../../node_modules/@types/markdown-it/lib/rules_inline/state_inline.d.ts","../../node_modules/@types/markdown-it/lib/helpers/parse_link_label.d.ts","../../node_modules/@types/markdown-it/lib/helpers/parse_link_destination.d.ts","../../node_modules/@types/markdown-it/lib/helpers/parse_link_title.d.ts","../../node_modules/@types/markdown-it/lib/helpers/index.d.ts","../../node_modules/@types/markdown-it/lib/ruler.d.ts","../../node_modules/@types/markdown-it/lib/rules_block/state_block.d.ts","../../node_modules/@types/markdown-it/lib/parser_block.d.ts","../../node_modules/@types/markdown-it/lib/rules_core/state_core.d.ts","../../node_modules/@types/markdown-it/lib/parser_core.d.ts","../../node_modules/@types/markdown-it/lib/parser_inline.d.ts","../../node_modules/@types/markdown-it/lib/renderer.d.ts","../../node_modules/@types/markdown-it/lib/index.d.ts","../../node_modules/@types/markdown-it/index.d.ts","../../node_modules/@types/minimist/index.d.ts","../../node_modules/@types/normalize-package-data/index.d.ts","../../node_modules/@types/parse-json/index.d.ts","../../node_modules/@types/resolve/index.d.ts","../../node_modules/@types/semver/classes/semver.d.ts","../../node_modules/@types/semver/functions/parse.d.ts","../../node_modules/@types/semver/functions/valid.d.ts","../../node_modules/@types/semver/functions/clean.d.ts","../../node_modules/@types/semver/functions/inc.d.ts","../../node_modules/@types/semver/functions/diff.d.ts","../../node_modules/@types/semver/functions/major.d.ts","../../node_modules/@types/semver/functions/minor.d.ts","../../node_modules/@types/semver/functions/patch.d.ts","../../node_modules/@types/semver/functions/prerelease.d.ts","../../node_modules/@types/semver/functions/compare.d.ts","../../node_modules/@types/semver/functions/rcompare.d.ts","../../node_modules/@types/semver/functions/compare-loose.d.ts","../../node_modules/@types/semver/functions/compare-build.d.ts","../../node_modules/@types/semver/functions/sort.d.ts","../../node_modules/@types/semver/functions/rsort.d.ts","../../node_modules/@types/semver/functions/gt.d.ts","../../node_modules/@types/semver/functions/lt.d.ts","../../node_modules/@types/semver/functions/eq.d.ts","../../node_modules/@types/semver/functions/neq.d.ts","../../node_modules/@types/semver/functions/gte.d.ts","../../node_modules/@types/semver/functions/lte.d.ts","../../node_modules/@types/semver/functions/cmp.d.ts","../../node_modules/@types/semver/functions/coerce.d.ts","../../node_modules/@types/semver/classes/comparator.d.ts","../../node_modules/@types/semver/classes/range.d.ts","../../node_modules/@types/semver/functions/satisfies.d.ts","../../node_modules/@types/semver/ranges/max-satisfying.d.ts","../../node_modules/@types/semver/ranges/min-satisfying.d.ts","../../node_modules/@types/semver/ranges/to-comparators.d.ts","../../node_modules/@types/semver/ranges/min-version.d.ts","../../node_modules/@types/semver/ranges/valid.d.ts","../../node_modules/@types/semver/ranges/outside.d.ts","../../node_modules/@types/semver/ranges/gtr.d.ts","../../node_modules/@types/semver/ranges/ltr.d.ts","../../node_modules/@types/semver/ranges/intersects.d.ts","../../node_modules/@types/semver/ranges/simplify.d.ts","../../node_modules/@types/semver/ranges/subset.d.ts","../../node_modules/@types/semver/internals/identifiers.d.ts","../../node_modules/@types/semver/index.d.ts","../../node_modules/@types/source-list-map/index.d.ts","../../node_modules/@types/stringify-object/index.d.ts","../../node_modules/@types/tapable/index.d.ts","../../node_modules/@types/uglify-js/node_modules/source-map/source-map.d.ts","../../node_modules/@types/uglify-js/index.d.ts","../../node_modules/@types/webpack-sources/node_modules/source-map/source-map.d.ts","../../node_modules/@types/webpack-sources/lib/source.d.ts","../../node_modules/@types/webpack-sources/lib/compatsource.d.ts","../../node_modules/@types/webpack-sources/lib/concatsource.d.ts","../../node_modules/@types/webpack-sources/lib/originalsource.d.ts","../../node_modules/@types/webpack-sources/lib/prefixsource.d.ts","../../node_modules/@types/webpack-sources/lib/rawsource.d.ts","../../node_modules/@types/webpack-sources/lib/replacesource.d.ts","../../node_modules/@types/webpack-sources/lib/sizeonlysource.d.ts","../../node_modules/@types/webpack-sources/lib/sourcemapsource.d.ts","../../node_modules/@types/webpack-sources/lib/index.d.ts","../../node_modules/@types/webpack-sources/lib/cachedsource.d.ts","../../node_modules/@types/webpack-sources/index.d.ts"],"fileInfos":[{"version":"8730f4bf322026ff5229336391a18bcaa1f94d4f82416c8b2f3954e2ccaae2ba","affectsGlobalScope":true},"dc47c4fa66b9b9890cf076304de2a9c5201e94b740cffdf09f87296d877d71f6","7a387c58583dfca701b6c85e0adaf43fb17d590fb16d5b2dc0a2fbd89f35c467","8a12173c586e95f4433e0c6dc446bc88346be73ffe9ca6eec7aa63c8f3dca7f9","5f4e733ced4e129482ae2186aae29fde948ab7182844c3a5a51dd346182c7b06",{"version":"d3f4771304b6b07e5a2bb992e75af76ac060de78803b1b21f0475ffc5654d817","affectsGlobalScope":true},{"version":"adb996790133eb33b33aadb9c09f15c2c575e71fb57a62de8bf74dbf59ec7dfb","affectsGlobalScope":true},{"version":"8cc8c5a3bac513368b0157f3d8b31cfdcfe78b56d3724f30f80ed9715e404af8","affectsGlobalScope":true},{"version":"cdccba9a388c2ee3fd6ad4018c640a471a6c060e96f1232062223063b0a5ac6a","affectsGlobalScope":true},{"version":"c5c05907c02476e4bde6b7e76a79ffcd948aedd14b6a8f56e4674221b0417398","affectsGlobalScope":true},{"version":"5f406584aef28a331c36523df688ca3650288d14f39c5d2e555c95f0d2ff8f6f","affectsGlobalScope":true},{"version":"22f230e544b35349cfb3bd9110b6ef37b41c6d6c43c3314a31bd0d9652fcec72","affectsGlobalScope":true},{"version":"7ea0b55f6b315cf9ac2ad622b0a7813315bb6e97bf4bb3fbf8f8affbca7dc695","affectsGlobalScope":true},{"version":"3013574108c36fd3aaca79764002b3717da09725a36a6fc02eac386593110f93","affectsGlobalScope":true},{"version":"eb26de841c52236d8222f87e9e6a235332e0788af8c87a71e9e210314300410a","affectsGlobalScope":true},{"version":"3be5a1453daa63e031d266bf342f3943603873d890ab8b9ada95e22389389006","affectsGlobalScope":true},{"version":"17bb1fc99591b00515502d264fa55dc8370c45c5298f4a5c2083557dccba5a2a","affectsGlobalScope":true},{"version":"7ce9f0bde3307ca1f944119f6365f2d776d281a393b576a18a2f2893a2d75c98","affectsGlobalScope":true},{"version":"6a6b173e739a6a99629a8594bfb294cc7329bfb7b227f12e1f7c11bc163b8577","affectsGlobalScope":true},{"version":"81cac4cbc92c0c839c70f8ffb94eb61e2d32dc1c3cf6d95844ca099463cf37ea","affectsGlobalScope":true},{"version":"b0124885ef82641903d232172577f2ceb5d3e60aed4da1153bab4221e1f6dd4e","affectsGlobalScope":true},{"version":"0eb85d6c590b0d577919a79e0084fa1744c1beba6fd0d4e951432fa1ede5510a","affectsGlobalScope":true},{"version":"da233fc1c8a377ba9e0bed690a73c290d843c2c3d23a7bd7ec5cd3d7d73ba1e0","affectsGlobalScope":true},{"version":"d154ea5bb7f7f9001ed9153e876b2d5b8f5c2bb9ec02b3ae0d239ec769f1f2ae","affectsGlobalScope":true},{"version":"bb2d3fb05a1d2ffbca947cc7cbc95d23e1d053d6595391bd325deb265a18d36c","affectsGlobalScope":true},{"version":"c80df75850fea5caa2afe43b9949338ce4e2de086f91713e9af1a06f973872b8","affectsGlobalScope":true},{"version":"09aa50414b80c023553090e2f53827f007a301bc34b0495bfb2c3c08ab9ad1eb","affectsGlobalScope":true},{"version":"2768ef564cfc0689a1b76106c421a2909bdff0acbe87da010785adab80efdd5c","affectsGlobalScope":true},{"version":"52d1bb7ab7a3306fd0375c8bff560feed26ed676a5b0457fa8027b563aecb9a4","affectsGlobalScope":true},{"version":"0396119f8b76a074eddc16de8dbc4231a448f2534f4c64c5ab7b71908eb6e646","affectsGlobalScope":true},{"version":"25c1ea2bb470f4f438f2c22fac65c62ddded2ac14013cc6ade9803e7eb662a40","signature":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","affectsGlobalScope":true},{"version":"43b283a961efe9fb5f6db7fb5e5da1a1fbe1dc2a40fbbf2bb69f9a684f5123cb","signature":"3330a565c3ba823beaafa8c291aaf4bd32324ad062a9881d9b256fb1a01cae83"},"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","f0ae1ac99c66a4827469b8942101642ae65971e36db438afe67d4985caa31222","7f5bced3f1bd3647585b59564e0b0fda67e1c2930325507ee922698fe8366aca","88fa7615e71089c0cab3b688aae073a6e9dae6f489ec1357da407c155d2e9d84",{"version":"d763b9ef68a16f3896187af5b51b5a959b479218cc65c2930bcb440cbbf10728","affectsGlobalScope":true},"0b066351c69855f76970a460fe20a500d20f369a02d2069aa49e1195cd04c3c5",{"version":"3175aa69fb597c3d5279aa7c033bfbabefd48f2e46c961de29aaf1d568353907","signature":"2939ba53a856cc8a5ec94e48c4df4a271f156547b89ef10e72dc6fb4bfde1d64"},{"version":"a7284af4d336e107a3a5d73ff779e7aafe6e20bd1d31ce8e5cb270eeeb6123b6","signature":"50957b2b2ca06175ba0b8b21fcc449c4d92d15b2c74e7b2af241f0bfe491e143"},{"version":"b953eb8ee25e34b1059c1d1d683dca007f11e05e1bd810df52220d351b666166","signature":"01f26f7267a10e2b1d6dd3f7619a7a80d18a3ca36f50823afe80f2af8c96a453"},"96804c81b1d2ede6f9a247b098b54423eede03752d4cc7b6a1872e0832e7f4e8",{"version":"3469a10bdf3cf1719c608ff69e4e228d9abe6db1e145a158f5c85e28257d8c4e","signature":"6b9f89086659e8a070c9d16552bc0d02c1565c72d55404162bf9f15b65fcc0e1"},{"version":"c159abe7dbffb4156659b3ff4991b17078060f33fed71b9eb72425617dab0512","signature":"e9d5a098eada88588f6a2ab40fc22c556d9f2dcea96cbc49ce8e1fcd305e3c5f"},{"version":"a56fdeb10ea26f54cfe15049b92dd7965fccb3f98394f652ba77eb1028911efa","signature":"543bbad49d20c5afe6e9c9ed54b066c25a0aaf876f49c6c0194cde8ad8a311bc"},"3eb8ad25895d53cc6229dc83decbc338d649ed6f3d5b537c9966293b056b1f57","b25c5f2970d06c729f464c0aeaa64b1a5b5f1355aa93554bb5f9c199b8624b1e","8678956904af215fe917b2df07b6c54f876fa64eb1f8a158e4ff38404cef3ff4","3051751533eee92572241b3cef28333212401408c4e7aa21718714b793c0f4ed","691aea9772797ca98334eb743e7686e29325b02c6931391bcee4cc7bf27a9f3b","6f1d39d26959517da3bd105c552eded4c34702705c64d75b03f54d864b6e41c2","5d1b955e6b1974fe5f47fbde474343113ab701ca30b80e463635a29e58d80944","3b93231babdb3ee9470a7e6103e48bf6585c4185f96941c08a77e097f8f469ae",{"version":"f345b0888d003fd69cb32bad3a0aa04c615ccafc572019e4bd86a52bd5e49e46","affectsGlobalScope":true},"0359682c54e487c4cab2b53b2b4d35cc8dea4d9914bc6abcdb5701f8b8e745a4","6alet Declaration = require('../declaration')

class GridRowAlign extends Declaration {
  /**
   * Do not prefix flexbox values
   */
  check(decl) {
    return !decl.value.includes('flex-') && decl.value !== 'baseline'
  }

  /**
   * Change IE property back
   */
  normalize() {
    return 'align-self'
  }

  /**
   * Change property name for IE
   */
  prefixed(prop, prefix) {
    return prefix + 'grid-row-align'
  }
}

GridRowAlign.names = ['grid-row-align']

module.exports = GridRowAlign
                �""��^��L�f��_i4�X��?��K����I�.U�JzD"�Q���l��q\<���f������l���+3)����]�I@������XQU���T��K@�&�\���o�f��d���T-���� /�B����BnxV�<�wB��$9I ��_��
�Z�
��GQ�*���O��Ȋ�L7�8ۼ�AsPӴ15�J�qB����9�(�DQ��Z}9�T�e�����@X�]wF�M��V1��$F���F� ]B�FV�IHS�l>�>رl�+(�;n�M��-�k���1'f<+|"5�����bJ�+�ҟ,�2C5X�6y?��C��������2ȊW�P�_d,���_M&8T�m��c�~�Sy�YVp��������ϟc��CA.�~��=��U܈�n�7l�Wa�-Мr]|}5 (�ɞ�bWH�I"^��c��񰐘*l�S����ա�i�O�������~��S�O`#=u��������p��B��Kb�p�Hr d0�UO�'���]j�[�
x�	% ��
;�8��2�߄��P���ajC�q�ܑY��,f�)��g�c��^�8��l�)
�̇,����_�န�~�X
r�Aʙ��!�V��!1H�����E;V����)�U�Ye���­�/���Ck\�2��z,�{��.�ȶM��6ᤀ Xp8�n�5�k�b	$�D�Wa�g+�_��z	��}Qda��:%y_#P|���6��s:M�*�|WǮ�b�<�Ha�
B�-V��'��A�؀�C(J��7;�c����c��סW��՟c��K���Q�u?0���g-�[��L�L*��X> ���Qy�@�lp�7~��-9�ZV�	�������h�i�S��ӹ}���yl����1���V��:�z�"%pk�SN�PJj�5x��z�E���ɕ�V�|V�;��D�#Oq�h�kV�CUf�i� Rb�,5?������#.����љ�z%W�$BD��eư��1��P8)o|q����[gA���W���`�z&���׫�A�a��	aEo��S'\H*_������x�ZH2]&�w\�q��V���]�M�f�=1���I1&���(+���������9�w�p���Ӹ�-q%�):rwe�0�k�q類��������������t��� Y����@���@!9�zb�r���AK����en��c���t!�2�%�Q+�*L��S�S`ޮm�n\t��S��ZJ�������N�q��I\�P�����f�32���k�	U����!F���@�o��8�'DJ�e��x"�%�@�
�en�Is�L!�R �F.[��<ɞU�?c+R�W�����t}mV!���O��m��ȏ�Z+"�����{u�gAT'�F�]�����(ս���G }+P��-��}�Ӟ���|A;/w^g^�w��v���ghJi,��- ���m�YS ���_� F'ᶲ���U���7�B'#���w�ە[�bY�X�!��`w�I6ٞ�.�͌���%�P1�<�T��M�YHbLXa�AL���Nq��xlF ~l���^!5�0 ��,4	pWAx�����ɰP���N�Q�V{ ^���NA���׷�MN0fU�Tx���f�Q;���]���i�⋞��r�|\���F
1�oh ��7��-�{�z��7���x"�Z��Ā���� .l��h�e��ђI���A*�%M��-<�y���`\����^�I�)�a&WK��)]�i=�$Z���߮CC�ZE]��4�� ����c|i�[`'��� ��k#ɻ��i���ߙf�h�"�6'G�kCVPXvڝ+f�&	�?��Jtn�`�����gd��Q-9��9�O�L�L_���Ԗtʱn��NY�+���0��U�Uhx�^��0�����ɘ[��  ����^Y����O'nE���;!�qu��<�.�&����f_ZDw,�oJ���`#Ƕ���c���|�������mw�ms�m��mk�͕[�j�mw���~>����w�+���}^
�������S�>���~���F�+_���� b�]z�n��1�N�gI�F���+ӿ�� fx�/,x�p;����\˝$o׾��zEaP~a{�wN�y<TGH�?s�IcA����nWV��ix��*+
b�t�����[��������b��i�P&)E�[g�<�o���Ċۋ�"���Il�����;¿#~ȯDа��{[<��`IA`�b�|�#׮���$��Fz��I�hE��R����G�
C.�qO
�/a�	w�����G�t!��K ��[<�k��hV��ʑ��z[?���^��:"�˻JYP��J�ou�U*�4���]��=P�8K~Fr���.�;��#ŭ��k4<`��K%)e{�cXN�&��	�ɸ/�;kL
�U�I��T1��֍��'���a����eҧohj�
��@c�rt:��I����=i��hc��w=J�F�O���= ������`s?�'���$��H2���`�ݠV�0���~8��j�}�z j���*��e��E�)F����+bs+��0��1˵򌻪ޝO��^U�Z͋J }#�Cm�yn���W���7�Nbd{J��V"�)B-�
>����sJtj} ҽY?z������)���	����t]��!
�09Q
.���^oNC�Q<*����l���XMx���<�dbRA�g�C�CON�� ﮤ������Q��}�>�^0}���HP�/�부�W|%�vv�?BA �.ޖ�G����O�C�G�Zv�~�x��,�4R��C�q�7�2D�x2�ߟ�m���H�d��Hm��v�����P��� 7D!F "��sߊ!��w)���*�`r����y7Ď��	��� }^��&E)QT��3)N
Yz��Z�t*�Z��<s����ƿ�O�"��� �C�T�*��A�|�4F���c��(dk����mQ6��6E{b�AU����l���-TF6�:���E���y���
�q�"�\��h*��ȓ�0�/��ɲ:��T(s�U!�qf���.�7���JǊt-r���E�]�rn�Б��
�FCߖ�i���8O�ҫ`۪�T�)�$�ӛ'�
��*ȶm�M��z�l�=�+J�4����1��N�7X�I�{G�l:�ˡC�h�����6�u���3Ϯ>��)v|��C��������-��O5���Ӕ����?�4K
�s|$
00p/�����ysO��8s������B�h^�lM�{Xk��oD�r?���M,����� O'���Ģkj�h��.������[B��C$�;�^�}Y�ٓ��ը�t[�>���g��ģ�M�������!�)$�K��e%��6�ٹ��ˤ$t��`в�_QF� 5�ة��,�0׺11�����/g&?���f'T�7�k�
r����[����&'z��)˒�B��GȤ=�G{Z������T�,���9F}�9p���Y󘿤�#��?�:��.�4g��"[8FV��%+�^�d����\t�m���2'�����j�ٰ���
wq؛����A�,K�#����N�x��~�
�g;c�\+͌�[���eE��g�t�pg�*8�����pvX��M��0ԛR���+����"���B���a{b[.����
�[��؂�_DM�ê��,���Y�_�+m��f`��(��u*�[C~�i�c�AP�ł �������V]M	;����b�L:�?�>}i�)�AdV�����PX!Q�S�A��@����VL�Mi�%j����z�����R�7_r�\MSp�|��߳����]Y&�3���St�E���I)2�#4}��=�Аc����^Vd)��F��=�6^.�ᗶ����I�����R�UEF�}U��A����aBlY��ef�!�e�Ɲ��&c�y�q(Rec�ϖ���y�s]�� H�OE<e��B�V�2=�gmi_V�`�}U�)*�A.{�q���ʚ�A��RWZ��1��pJK�J�F<|]�c�����~~��z�H���,&���9�6�s�G3�ܣt�d�I���X���g�#���D�p�R̈́��Ұo���!aKn7���VϺ�(���0Eb�C�̬���ę��I9<Ē��~|R5�>�fx@���q$b_ln-�#(
�����!<D�d���2c��P��Ņ����c^�~���Ot�\����A�
�%��������h����{���[f���PО���i��A��@J:�oE�jp`�?�u-?Z;��/R�`�Ë m�&"�6U2�{C'��LSMe5�d$���a*Mu*i�#.S맻��'����-�������FR,�����L�^%x,�4��{8�O���7[��ٳr%O���Xޅ>	�"e�=*�VuH����\h*7��;{�?YY��9Zsq�j��Z �kV}���NB�F1D�r�M7��@�Fh��_L�u��/�(�����=I��<���?�tJ"���f.bm*�ë[�JF]��������ڣ/j�W,��9��-�*`W �����a���R�]WU@^��j��B�Yly�%[t4W �f[��܀��
H����VQ�.��*�4��k��
�з���A�T� V�U�їʾQ���f����^�[^����D��Ty���j�#��G�
 �`��}Ǽ�<Px4U����]!8.���
�1{a)�G1;D+�P
O{|(��v�%��AR�U�R��"����"�Z��10���X
�w����Ӽ�I����8F��P��'���W,� ߪ)(
��Q{i�NVq�F"b~}���n'�b��y�:�1�p����[�CJ�eȚ�o^�h��(�iv@�s>/�}BE�ħ��w7��K���#y��m#����u<A�Q���8��w��\Y�:s�ʅ���
��p"�f@�  �ՅB��L�ܳ�mf:�;�2��\X{�G�����Z��5dd�����3�X�}�"{dUA���1��_�e��.5���,��~�
�mެ{1  ugs��}�A���S���iU��9ۭ�����ᢴ1�4�*7�G�yq=��(�G~�9�Z2{�;/[��v��g���ɭ��~�������޺���  ��9X@�4�g���8�A��bkgJ�*=�/�X����}���_�����m*�F=��G������q��]��ݳ�m��Yf�;u�vP\׻ 1Ѡ
D:EF��<�R*򤹴x@�y�{OD��$\����˴kj�7� �i�����n���T�69j�K-��B�/��T%#d/��x�tȮ���h�:	�E���٦CWI�n	R2g�@��@a�c�������s*�B�t��Oޟ�=Jf��!���ڏm;���>ո�j_>�~Y�.��/'���ʩ��c���2���WC��`���~~5��F�;�!4Ի.m�G���W��`a
d��Y�N�G%� SĂ�amg�C'��PKy���y�� ݖ�[m���&��.�.Q|�AA�N����%U�]Fb�Fn�S�w 0V�ƌ��DF"'���['�Y.PnB�\t,\��M�ӗ��D��VI
�b-�C�`����݉��ʒ֕ݣI�A�#�#E�� A�}�9չ8�R\��ل��\b�/�3
ߎA�I�r���^��ef���D6����*�M���ǃyt���I�;�#��K��6��>��ύ�Wƽ�h�Pp.n�Xo�X���l�+�����b"�Ñ�x%G��J
�Gh
�%^s� ��LVs/3;#� �j6>�kP�~4b�Ѿ"=�^�xR"�V�K&����mEp��䢟9��k��C�4�[��������%>������9\��P���O�;k�����~�<�b`�m�ժ��{�b��r�&җW٤����A(C7Z�r0��m'�%�rV:�z��|:@�s�k2GH�O�\������6v��>�3͕*���44[I]6�
hRg�H��N� ?��F�$��YD�4����KaM�A0� 3Ұs�f����3c�g��rI�%��|�p)���dzX���`Pʮ��C��w��Z�'9XqCGLD)=L2{JƉ[�`���������ϥ�a��ܴL��S>Z���+��Se�[_m�dU���!"��10���j6�`��>�������#
��g�8� $)��gP��=k	����X�o�L�\�&��a�?f�n � �� �A&�J�#vL�R,�]uFRt�
<:X��r S-'��a�q��H�'��A��������_cb��u����,�?�F�Xm��8>�d�����+���������=j�֘\D�OV�B6�'�X��3ڲ��Y�?WZMn`N�\��͈{�J���nuu8�l�݌��z��k�y��u͸�7߆�� � Y6%��x����H�Ѥ��eE�6�]���_��׷�
@��Ĉ �PQ��|�n���x��GAW̨B���o��T�@�\���N���5C� n����DT�@
f���V)hr���R��Xu��!���~��N�OG\�H����`O�ߴ]�Q��]�V��R�M�l��.L�.h�����I$�5���ӆD�[~�̺�]vh�$�ڟ��3;?D"���V����mP�+K ��H��s�i&�1|*q[��3+�iO���G7�L%�a'gL`A�vjF:�w
I��sB-jʛz�iSH�e�t�U=�<D��6��@��'I�Q��� �PDYf�>]�}��xp'>-!����>>ɮK���&mx�s9�R�
947u�Ǿ������ʘ/5�%5}%��$����Ev�C���\�=���U�c>U���L�rS�/�Y��'R�\�������ͩUP�K�ךi��yf�ѯg m���NA��h$
��.�VeJ�euTu�!m��o�%�4�
�3q&�qY�-\�"�n����z<�Ԃ�e�[�}��8˅$?�<pml���DOTs�>,i��t��ྩ=�#�`�p��
f����4]��7�4G9���6f엪�� L�ܼ�̌��5H)}��,]M����@Ac����;�`!#�]����&�Y/L���:cV��-V����D4C(�L%����xLzF΅�Sv�=k�����H� @�����5�A[��T���%S�?w_?}5�BY4� �L!��ߒ��jl�4m4|0���� ��}���E���/zUWg�䌾ږ� 8����E�4
���N��7�}�{�;�����2d���q�9߸:�}E��gQmm"᳨t��#$��oNc�7����
 ��h�A�B�E��\NRñ�5�����f���f7>�t.}HZ�mj,�܊��n05��\��yR(��N9��5k�3�L`��̋D%��t63��
���kp����?�-B$��8��y
:�!��Q�AY�H��S/�Q;�~w���Kf��Pɱ	ΜrF�IA��:5=��F�X��}������%�<n"z�iy�G%!��J>*�$)��7=f�6�O��G�E�2n�Eࢨ������L�'O�`�ج��%'>������d�nW�k�ێjҤ�����T�:�B����g3���@�F�"c�`e�%�Yu"�s0�� ��҂��!k���L]c��[�a�=�v��vu����m���X��-6�"4Y���;T_�\��ZB&���ϡ#7��� E[\Bl����W��P 
���8�+a��³�"�-�.�f��3�cկc]��qL���0C.H�]ݣeW=[��y��C��F�ys�Z��JH��a�&�j��
��i�CP��[Fkq�1��%)���2?QXe�֒��$>P	K�n���`�����%�ʒ~�h(-` �S�D�1�9��B�muVC���sߡ���e������ �*KdvVfv�� �3l�)��V��!��rH��cq�((,O�ɪR
�-{����ع�`�,��<��_��|�G
�R_R�L��V��y9�6#C.T�f�.�Aedh�E�j�k�P|���D��g����g?�V���_m�	�৳1��c9+�p�HOh�
����
ب7�K��Д�M$t��� t��d4%T� >h����\��o�b�W_�W��j����Z�-X�n(����7�
�$quiݜ��4�x*J"�iɿ��	ޏEx�Q��u�mU$�u�A�0R�(�rJ
F�ߝK��Q��4I�)�8Ffϯ|W�ko�&�]-�����,�ƮYABq��fn�V"����~k�/�{}$	��N-x����-� ��$ZRX%է�Q��X����^Gz��م+�� ��f�xF�e��aS��-��!�����g��5�?�vz�E�(��*��Pa�M��c��N��Q������P+ 䎵e{JѲD�	�F����	VBs��E&j
[\k
��jtLMi���w��j}�
0�ѕ�SeX����(�JX�j���<����,^R��f����טk������S�������uq���Գ��V�y}��2�[Z�j�y�b!��m�x����u��}i�����LM���e�]�k��b>d���� �˿izD�gt`_���e�4�YJ�`��\�B��0�ȍ���w]6<��6����P��Qk|E�Pϖ���\��=&�j�u�u��x;�8_f�MfOK�'fث��R�e������C�����
�s4gֳq��=XS�O�V���I��<Fކ	�E�� I�m�H�n������Y�g��>��%7Fۺ���"q�G� M! K�e��'�}Y*��9�<���c|���,����éK.��(E��^/�:yԩ6,F,_��A�o��Σ�d4n尋ҁ�����|��;/8���KB��lJ����T�	U$ =�Ucp��|.��
~��l��Rw���F87����6p�ů�Q��΀�B  `��2��5_�<t�q�f�~�W������O�r_�{W��1Y��??}�i"c��k]���5q'��W%r��L�N��	E�~�]L��1�]��dˢ0*\���[�5�E�a��ܡ[(�����\������Ҋ�P��\��=%����!�0�i��0���}�6H!ea|�?0$���o� ��� ���(695S5zl�P$M��D;:}\8ԤU�O�W�/ߍd��NW۴��n����y�C�|�	�`��P�ݕ���b���>mi���n9��d-�`�$ @)o
 �����n�{"version":3,"file":"scope.d.ts","sourceRoot":"","sources":["../src/core/scope.ts"],"names":[],"mappings":"AAAA,OAAO,EACN,KAAK,EACL,aAAa,EAEb,KAAK,EAKL,MAAM,aAAa,CAAA;AAGpB,8CAA8C;AAE9C,MAAM,WAAW,UAAU;IAC1B,QAAQ,CAAC,EAAE,KAAK,EAAE,CAAA;IAClB,eAAe,CAAC,EAAE,KAAK,EAAE,CAAA;IACzB,cAAc,EAAE,OAAO,CAAA;IACvB,OAAO,EAAE,GAAG,EAAE,CAAA;IACd,OAAO,CAAC,EAAE,UAAU,CAAA;IACpB,cAAc,CAAC,EAAE,aAAa,CAAA;IAC9B,MAAM,EAAE,KAAK,CAAA;IACb,kBAAkB,EAAE,MAAM,CAAA;CAC1B;AAID,wBAAgB,eAAe,eAG9B;AAiBD,wBAAgB,iBAAiB,CAChC,KAAK,EAAE,UAAU,EACjB,aAAa,CAAC,EAAE,aAAa,QAQ7B;AAED,wBAAgB,WAAW,CAAC,KAAK,EAAE,UAAU,QAK5C;AAED,wBAAgB,UAAU,CAAC,KAAK,EAAE,UAAU,QAI3C;AAED,wBAAgB,UAAU,CAAC,KAAK,EAAE,KAAK,cAEtC"}                                                                                                                                                                                                                                                                                                                                                            G=y�It�&F��;C�R�t�4��(��I�96(�2c�c�ica)#3�a�0Xh]��} �gs�wO���P*8��������"�M>�3Ƹ7����0Ψ�=RS.O����'����
@��/�GQC����p�����'v��mN��z�\�����|�m[��K´b=�
OdG��A�-F��WE�@��P  @%����E���3(oQ`��R���c�>��g��7�wF'��$�5�>�K���g�Hi�|
�@��b�G�,���<'�[d]A&�*�H�4���<-FK�w;���a� 1  0�Mh�
4��Cy��9��ٕ7x):ZVo-Hz���ͥ��H�*��q'D#�sa�#�ث��&�������\�D��]zW
�(n8����d��N�@b���m��jM��}�
e���-�{=���n
�ڐ��VF���K�8ϳ��I�>�7"e˷��y���Ow/	9��Ry9��+ײ��fQ5&'�Yz�(���6@1d
X�aeDP�&/�\��RH
�їZK�;*���#��m���?��X�_�^&��tn�~�)�	��&J��
�V�˾1�����kT�g��Μ\�ʠ��.
��ү u�5��
L$�>
j�g�̘�Ҫ<�a�~��!1��M�VQ�eg\����k2�rY<}O�[#4���J���Ѿ5+M�S(����,V'�|W�Jۂ��OM �U��l��W!��b�F���jb�٘p��8��+/)���e1�wV����[�o��Ҿ:��
���2V�'g2t�C�e��3tu�A6Q��pɚ� �$�\D{QG�A�v���y��4��0���X�O�;�esr]��=4��IDn���6/�h�*`B �N��J����08҆�'d��eL߄�ѰX�k�kĤ�8��%�f�]}?5�W7OvN4�S�}H�r5�����S�sf+���L�UBTk��F��xP`D8뗖�M�*Zh��7.i/�H}N>Ӛ#�����2�O
��Pshaػ�p��h쇁
��9�[�%{�/��� ��G�����J�	�D���r �-�gP�1�1T���M`u�hlFA�_�!V��%�?Շ^.jW��z�A�S��>敥�o ������P||n*��?�}E�e�db7�9:�%9���h$����Tgc�(E�����-.{������>s�L�.�fE��ܬ@���K�A������hw!�T
�_���iJM�	<*[�  ��d��&��w�Xӷ:�)��4jc)LA���5U��Qo��O�JW����Z7���g����φvT���b�ƇL""4N�c浍u�iu�d;��^u�[�*��3&o$�W$�UCR�� x�����ީn'K�	����(��q}�b���2���d;	�XaH"��=^�!��
{���8b�/��+�O��F�0�K^�h�Skm0u���,��V����Szx�'�^���+L`�d'�iyiRK ݘT^!WE��1��l]T)��E��=�`n�*{'Z&�YC0*P����}�WՏ�'�=L�0 ~�c�c��M-��%CR8�$o���CK�ҫk�`�v|H��Tq��}�^9��cG�_��o����,� �L����|�dŘ��V�*��}��>��n ń*̀����G�}Uҡ�a��[o���}���v��5�u{YU�X�p�{=��5�p��
�� 0�:s�'��ø��wm�O���̋0�wUu�4.]��QR��bX[o�YUv�~: ���4����SwF��V�(3�����z�R_C@��7�Z�We��:
�eڈZŚ�*ΰ`-�+}3~W��a_�9�������ʖ���n�;�2���9���Gu�ˮ��3�7yȌ?�oF� 2I'��OЁ�ԓ8�'�`�:r�ϘX}��/���0"�5�2���f�aJ�zQ He{u"�vr]X#�q�BN�ņ��J�N|�	}�޽��6'�/���o������9 #φ�n�
蹗�U�#��XdN���6#�q�q"��X�̈́�EIZ.B��p\���U'��פ��X� 6)�NB���lQ)��OCg����e��ᬳa��ʚ��"��zjR����Ld��"����_Q��yt������퍍��.�$j*~L�-n�Bّ#���MV^��f�:���"��P%�,D�DY����D�t��!hR���,yq��q������ӚIB�}2�ul���T��fe��ODJ��K���>�#{�M��q�F/��2K����_�;������1�ݺh��J_A�M�k����u`x�@�ӣ�,yJ;m|��%�0�
'�������!7�i��
��f^D�
��.�o

η�7SO^�*$Z�� ��4�L���!�A�|d4@L�����s('�~U�n�f`��Jx�i��\JF���ݐI*�	�NO(���1�"�b���3}w�y�����chC�꧁ɮ��o�����   �/�-�=�����4w�iwR�[adƐ�Yօ�ᾃ~���'������s'vU-5Wm��Ɯ���!�ߥF�Z����ˉEbg^R����7v${����v�f���{:DIn�Q"���:`�YɝV%�U~"�� ۍ��Yl�w��6���?��ڄ��	��Q	w���"��D�ǁ��L1�[o�	�>M?�x�v>'y���������� �d��0'F~LɭN��c�Y�|C�G�Y�3^[+�Oʌ�ͫ;�B�M���]$����,RY8/.UK�μ �����+��EV�  ��I�vv������E��b;��'�6�k�qv�����>VhZ\�TNB�V��<�l��U � ���J`�dgݻ��jM�Y
iElHp1]hcKk�r�E� ��p ��e��q��@%+s���A�B1�������mIg��/$5'{sB7�K"b�ڠF.��8��c�?HF^X�[�{
�l��l�����QK|5Y��Ų᧟9:'�i/��v����G S�"?���#TTG6�Za�~�䆀��$�O�
�7��x�e�h�X\�:a��$PU*��a�.9Ϧ:���x���"��*��.�C�èoߊY���,*��(�q�_��k�9����5?��@M � `��Fn�9A����U|f_9`P�n��w�7���$K�w��u�?�X��{�ZU�pBwP��AgGWm�����|w�Z��ː��t�{~yy���D~����-(C)�����49;
������q�Kz���K呲)� �vQ��E��g���윑��{�?G�ZY���T3���ez��}j7lB]ٚs�l$
�ƅ��;Fl��hЀ��h'-���dh�	�B+�%��Ͳ�Ă��h�n?�-7آ�/��37����,��OI�g%=&[޼Q�,.��s(��9*	��El"1����d�[�Q�@X|�0��c`yk*գdD> 3D
�.^���JX|�7T�"~/��'M��Ad;9�����dl�A!qȒF�?S�(J��:����+FA���Q%d��M���� 4#j����["H�y-9����gf��˘"���s���-�9`���K2
�o��,w(��D�(P��a���l��'�I�����	�d�b��?�:�e1�B����ؘ�o9�H@�5.c�hX���z2�a����>�1����0$������m�hr7&Z�%W	�&9�Q=h��N��h�T^������Iy�gzJ��!��`�U~����Y��ߘW��\ �8��S��侠(�P�!���Ē/ ��	�Q�9�XL�ܳJ��y�l��tG#�9�
׵q��_�W+O8�j���[��e2$�љ��֍��.�fn���ؖPX7�S-�Wα&Ԩ�0c�oY�
C&gd{�ۧh{)*��Kc�Hqm���.;	�����c��I��d.�y4N���MB��4:9d5�
<��5�%�jɏ�Kl2��E"�ŉ�?���8�2��9�����y��8��n��
 �J�����Sόw���B[��5�W7��HV�r�Ŝ��I����}7G^i6�Ү��^f�f'b�gӵtI�yz��߶�ߟ=�nf
�|�_�ؼƅ�/��n{OB��@�0R{�J�C�0�o�p������u�H��J�����"G��7$�c�G �r���|F{�>y�\{��j\���<Q�qk�[��Zi8y�P��=�K�f���_>gO�v�, 'oN*�S[��(]��
������G���L(J_UX�1���i:7���e��ݛ&'J��8�!_v�R�����dx���wN�(7�1�U�HzE�-�T�k���0[�	?	�py�a�D�O�>shЃR��.u�tIb/;�=t8�`7��!�bK�d6:��aA�I���l�	8u�Ra���u����Yf_﾿��ٹ�fH�{,��'O���}������*��FL��aT���+��h�̽�"������Do�����,�#;bJ�7/>�f��fVw�B6�*k�=O,��s�2��yO�ʑ�[KEz�E�[��/61n�?�����4�"���`�����̓���R��6Wu��+�K��4?j��'���r�+��	��~u�F��㝝Cf�
����h��0=��a�+ਧ�4 �U�؈�o0�\�����o�ѩ��c��y��0�����f;ַ����������|S'�:�I�y M�e�]t��f|R���_�+�>����dD
r�+��������q.��S��E�F��W���J5Lݖ�.G3�&s�PYfםiV��'�a�(  K�*������-��� ҭ�߳,_v0����z����ضZ3�g��Cjf~(l��Z���]�!U]����MV�ԍ�l�~3��l��|�0J�k��qo�S0\4f��^1�J��r�:])a<�F4�9����OT=�$b���hU��ZFN������@E��o����� ���g���c��&&^ֶٟ}3��t��^9�:h��D�K�N��}ˊ&c���8+�r���
��B�H�,h�S�8�[�,�w_,��#��B>g���n<�;|L�aS�n�y�Ed�FD:dk�Z|!��������1�cc������C���m:��=l��r�{���S�7]9K�����;��
�vk��[uJ[aM�IJs|�礪*$ҋ��(k""��!%їd�H�g����2�B�c�%��$����ʗ^� ��Z�'+a@H5O]�ȹ�U)�"|�dQ�d�ӯB�ss�|�0i�v{/je{&�"��(�*[���)�ɚD�8H��͞����r�쇤�W�owK"1��ޤ�
ԡX��ws��~�μ�!�Y ���<�
M����yl0��������l�Z�r���R�f�ii��5�v���n�%[Jy[C���~o�����������ч�o�G�/9.u��M�������]�Y���	���zW�։���"�rZ��,ә��lGf�H����U�/�1��C�( �߃;���������ƌ(Oߧ�5"��M��Υgϊ2�s+�����+{��ؐ"�����3�U;
�>��`kj-Z����͌�'��2!���]�	�= R�~?�:���X�h�\��!k���ۦ?�xQR��h��l�r�W~fM���	�I�7Ŭ��U�u���v�?N�
��X��z�:�z���KB"���N�7�t�XJ�����ֽ"<Q���D�h�dA�v�������S�# �����9���t��H�*ah�q�i鯻��*Eo�Ǹ���~�l���l=,
WOI���"c��Cq��qg�H����CK�#��F!�$ �9�A�T^W�p%�����%
8])+c���,��[�يQP�ґ��aV]W+����۩�Y���)�Q̻ �M���jr�_.F2�5�����@�L� �yW��Y�*�m$�K�<B�rm}�|~)c��ŌҠ���$��Rݛ���
�����#�_�+�`�d�%^�B�������ZJ__	��򇐑i�1�a�s-�����.~O$��q�����M@�Am��mC�_Z�U���H�
 �(�-Y�Zq$;B�*�R��w���3��kn%c>*�y���I���A�TP�.�D�G��ޮ�8:�3�a�b���k+��D`yr�4�G���������'�7�r��X���5�� 3\��7�[Q����C�?���X�?蚙����4>�&ኂ@�c1�܍���OL��g= �Y�U�g,о�oQJ1*�s���{��$	/3Ko�<5"Vxą��=��l�G�\\T�����8��ۦ8*�R^!�q���l��Z��D+g Im��2�&�� c#1"�Pr6�����('yBB`��R�ߐf�r	2Ď5���扱���[��]�U��y��8���%�q���𤪆���"Qʨ�������ruw��"'-B�}q�f�+��+T�t3 �L�Xè�T�H�p��ۋ��B��a�^�+���5���U��������WWf�W
�[���	^3������ci�ؓ	�c����_����z2ǩ��*�#D�;�/�F1�  �Z:*~2y,�ٱ7�+�-�	�74�I$�ͻq�9��w?�= ��@�?��*���9Vx�84��db㑨b\F����
�  
�I,a$t�Cs��|�X��r~�oFB��Uy�-m��;ø���My�n���EF �> �T2�H��f�ʵ��O����M�FIǾ�Hf�Y��U:`���3+E��!.��xF/��t��iH�*N)�?;o$}BO�}���7N��N�q�lb�����㜽���qlC��a�x��#9,��*<�x��9>�,��ְX`��g7S车�'�my'?*wi�N,��&�	k�1� r �� WN�����$>�c)V���i������7������"�"5y{�z�}`��=,Qx��.i�&�H�o���>?���l��В���W�ne�M�|k{�w6���7^�<'S�N��oؔ4�U�R9�*�ud��]�o
 q
 ��`�v=lx�_���Ɂ�(1��8[p���1M���Ś�i5�e7�����l{�	�'�:�<�*D�*�-m�u�y���8�/��o�p���ό&\{\�SJ�A�o���C�D���N&�%��G�}�j���-:y���������%;k���[�E�?�3"I�� L����E� ̠(ƃG+�8�p�O�
�3�����@�?
��;��#����uNI��]��P��J�uБ��H�5;B�0B8��>��x�]r
'.��w��>H��ZȺ�,wf-�;���0����~@)��! ��� �Χh����=#���#i���軟>�%b� �ѽ|�������M�Dy~0P��p� ���^�Q��s�P%p�� �H~��� t�QKKQ�$6��C��r�Z)���
import { slice } from './_setup.js';
import isNaN from './isNaN.js';

// Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
export default function createIndexFinder(dir, predicateFind, sortedIndex) {
  return function(array, item, idx) {
    var i = 0, length = getLength(array);
    if (typeof idx == 'number') {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(slice.call(array, i, length), isNaN);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}
                                               �6�����-�X=���I��7bD�8�����P�l(��j��O�DH�f���	�;����⋄9|�A��V5hJ�/�;�Q� ��i���������(��
�_
�fq�G�ڋ��Х%��>�K9�����y�]<�R�����PPQ�^N/�?�4�՗÷"˭?6��]�⤆�q+Q�%��28�z�n�
c�Q*<D?���V�]�i7�u�q��>����P���ޙ|����R8{�Q�2�e��~oE|Cᒏ�&6
 X�b�U�P����̪Kܚ@��u;�d�0�
���ޏ_
�C��(�P`C���ML�s��Y��ŋp����h"Q4B �UP��F1rM;/,�#�d�a�Tl]��%	~`�˾`���(��sd��7X{�����n��)��iIPzZQՊ��Z��/!["����xa� �  S
/k%H��i�pqI�P�(�G`����~�>'�<���*vm��O�lƄ�C�?���q2]uN��L��O
�~V(B�V�N]��p	ZK�E4�|>����ꁺ�1�F)�36L;�/қ�ޤ
q�OT-��H���FA���(jۿK��I1´�~'3ƶ����G��,�{�ZY���~uA?�K����}����N5@]I���p�>��㻼.eeR��2w���  ��� ���+v��Y��A$���V���UWY�
Xv{$���4X@ �8�Mɘ�j��m�=�:05?y��E�R�:�����?P:��O�Y��x��8�Q$�3r\�k��y�~�S%<!{�v_N��{=s�R�w6��*�i9?H���y�r(�w�Atu��(�P"���2@R�nth���YXpeG+d�yT�/�xH�A�=�"*��iЛ�����Sd����uR���ќn��.P>i���&*��` �gQ5���\�N#�b�o�^"]h��0Dev"ЁYF�+��_�T�H�y�?P�˼���e �1���?�L���r���f^ ����N���T�I��w��#��(*��]��TO�^^���?�0����y�)�d��Ȫ�ܥ�Tʁ���D~��]�~��9~OI�2�J��56�&+H�*7|����-*63 ��%$?C=����A}��Z8m��gʭ�&	2b�J�e��W��:+�g?X��N"G�/S��������b�ǅK*c'M]�K�]u�6�(�xR!su�F�Ǣ�6��j��ɭY��^O�fIlJ��z�H�|����M�q5Sv�),��@F��S���ݲ_�1�L��ޏ\Z��Y)ӿ<Mc�ݟ�oLטr�ݓ���<W�Y�Fdh�S���}�6�\���M��	}����Z�����Q+T2����``SQ��s)�WU���)^ܚ�E-=ī3$�\Rc	�XZ'I�����q�3��@����}r��J&�2h�#C��0�����B��cmR9ŗ�]�ZJ2��A��=K|'�y��+�c
~�V�A

���^�Q�I�&.�n�/�޵A������ն��3�c^�6uL�5�E�}��sg���@}{)�`��V4%d�Iʢ�~�9�F@b�a�8��s�?��2���ن�]K!w�	����R(����ݽww+Z\[\J�����ɿ�}��=����k���D���r�ǧ��/����1Hv"�hʛ����f��Vx�����<����.�6�'Ә�&�fY-8ԷMU#���7t�_���vp�.:vN��v�g�!}�#�{�|/�;����{4�X(����v��n"z3��Ø�s*��҈��x��&/����_d�st6��3
v$qP��Y��w����Yr�������[� {�VvS�j��R����������s5�=�W�|�7���
@��ӑ�OtN��_���}���	��'O�>���sV�sX�� ���M~m�nZ͈�'pU�!�'���Z��K!&5�;:j�1G�_�X�:-�{��˓�S�#��:qB|$B}�)B���[�P�M@�@GR��=.�;�ij� P
@P��D�[Ѐ��e4��CD���#������}��@L�:�@����h�o`o�< �jo�{��>��ѕzح������|3@���ߟy��=�؅	b�!�XlD����  ����E�2#8`��e�wTo)"]��'��\r_'�XM�Q��s��:�� h��Fv��Q�>2��H
�h�=�`�V�`[t��PI��I��=�=�.m�^���[�u����i�P�%f��1V���|�xyP�9� =���hS�z���@��'�ĥU�ii��TW��yF.w4�9X�dT<*BQ�]n�89WX���N�B?�
N�����@ h�W2��(��O��ld��k<i'�_��T��QR�}�_��]�Dc�f�:�̒�����~d�Z:9%��Tx}��kS���x7~tzh =�x��������pp�]�.j���3N]� Z,)�<�����=���v8s�KC�\5ϙ�{'a���:E�s�
�T����#�]7(�P�5 ��X�Pk������[x��x��@r\�
�4�Q��������~�Oa�=ٖ�$��?`rh���!MO��	�
%)5������;M�W�	p��џ@�J��RP�����Yϯ��^1�˅�ϔ6�_1^�i���c_�gz��s�aE���'AQ������Eyosy���%�t���A3]8D/�px�=@ �%]�]_ZI�����4bҝ帨'[ͮ��Ɩ?���ۆ�/��)��
�(��R�+L��ې�E�>��J=� �foka��o-��i�?���a�����FV�Y���?�|B	��?g_9ݠ�I��.7ÄoL�$,5�{�v��{M�8`�"���n;�̱M���:�*���q�lR���gĻ�yGH��b1>1M��LB�1��Ǌ�����:m���Q��gC?����H���$�w���罺���O�5&�HN�ן՚D�LhpQ��T&=�*Q0V���,]�ot} �S���ѝ�V��3���g��I� %��jE7�)~�S2�"�|�-!F��������H�Z�MC\��V��1�Df��2n����#b�8��Fv�2T&�a.z�]CZE$6�7=�.�c���$�pyc�#��99Z�q��6I�M#��������܎���e������Ђ�'C
I����)L�������C�B�Ox��X�VGZ�+E��硉�t>�`5�'���B.s���SM`�E��Y��7�n�pM����A��
��9��xV����ьeŽ	F�3i���j�{�NJ��x�Qk�1B��1�J���X����Ž^;/���;X��J���?����pD_�%~|K0�wF��y�6"O��p�I�r�A7r�	���{=ٚ��1�����H�9�1���u)p�=��,};3Z<��t�-no_毒�C����p���].]t��x��*����֋�J .z��{�x�ɵɊ*����iY���I��H��~��$  ��J��/)������8��h:F�&Zׁ��uPK�ٽʩx��v#���� �v��~�Jk�Z?W	;� ji�,aC#5T�9ƙ�g�J��M�H��ģ���s
� � 9�{5q\��"A
��y݂t��ϷZ>Q�[��a�j����ķ-'B�	�uJ᭲���z�<���CJ%R�4PEZ/
��5A��]�U���9	�Jn-!�rd?(�^�g"yRI����J���(>Q.Y�kD<ra�琞�{��$���/���|H����+:{^��!���2�A|���xQ����h`����"�]�/��5^�+ ��̏lp6���XU�
X��@!Gs�揌R�wtrS>��z��P�\�
}n�K�w���qU��C���`Tm��#ރ*=-�A��� +J�W���F0L	����83��`�4ߠ����j��xt^��U�R�₸�0�0��r���,�g�)xE��8�(��oܙ���w����u���lj�z��%�q�|l8���K��K�%�?��7	w��f� w�wXu�<�����[����b��wј�e�����B�>��o��
'�M�Z��1��~���k����D�� ��3��TJ��	�\�)�H�Yٓ� �0�rB����Z�0�|I��5=f�6b���dO�S����	��w!b�R�2l1-d��r�!�/}N��'�0w����p����|{��_�f��#���e��(����V�R�`��gGN�`�J�X�����ʸ�T�Oi�$�Hf�	i���Ed[��O������&���j����h#��'�|�GM��7����z@2& h&����N jğ��a�������z�fd�����z)�U�Sc�"����Բu�J����K럻M�AD�ChC�W�f�a	�9h�p��\���ļ�5}Dָp[�)��vS�F�l�(E��6�w�����r��ĳ�드�`�P,x�Ă<#��p��t�S�� ���nŁQ<�W5u $ɋ��3rΠhWT��!�����Z��P�BNd����S�U���.��3]�r��+�e�։��k��}񲮙��#n]���C��a��DI�5������^����
f����$q�s�a5�J��&�z�mB�A~!�����d���vU#M�+�+��ZJH�
B�L�IKP/i��5���A�
f���ge
�9�ղ��(x�ě�Q�נ�t�G�P 0�
�28�'9��jNR���"AP�K_��w!��gqj�R�����NDd���%ѻ�9/�� ����|³?&.��T�P  ��%xr��q�wD*(5R$,P�-VcLq�9���7Lr�8�de#;'A3ac�ĩ`���l����ә,��	ɤ1�
�2�y����=hu�1Z�e��mUcJ����%���X�R=fu~])�?"�j2m��5�0��)4{<Q.[][P�h����
 X�}?��	��񉱃�"lxq^[W��&��Y�Y��>�v�F��`Z5�����eǸ-^v蒴v|ЈK�$� ����ʜ�(�V���٦TS���u!(Iƀ��d�Q"{z\��IB�e
��Y���!J���A���HT�����L����eq����8:���6�~��:<p7� ���Uu���T3.40B�T��]H�J�/˹��qDi?�S�K����|#y���W�o�������t�%e	��x������pC���,�r �� ��KG� [<�œ-��k�j��s�;���sED׶W-�D��� u,��m�"�rc���i��#p�5|a��1��ަt��~� �k�����[� ^Ǳ��J0��D����!���	,bcP��х�I
�7�S�t�O4���F�U�]��i�p�:�ݠ3���āɕǷf��(c�u_?m�w�Ӯӥ�>��j�G�
��D7��4���:��&���/�U���r*SnY�O^K^�\�h�����muD%[���(o�L�!�ڜ��s�����\���g,��p0pS�j4��yb>'�|*|��[����cTbہ����A?Z��3h�T�Hx@5�,� ӈ&F`{�O���NMT'���lc�����.��5=L))�>�����æ�7�L���/tȣnJ��)�o:_��)I����30�߸gЂ������I�q�����X�o|�T��*{�F��kcJ���Уt[l���'E���H� 行��\R�5E�������x���A �ˉ�R����Se�&��
B�ė�=o������o��1��>�*��������B�د��6eDE�v��ȋp%8<Ǥ�'5łX�ε	�3j�($�/��
�$㒴n�x�R�@sZ:F����2*�|���J*ֺ�v�E�`͑ɪ2,~�#�HӼ�-���Z<r�*Ņ��sQ��"y+3Q?����Z�0��(�@��u½N�T��8�
������(��l_�t�"�O�^����]q�	<S�17ʟ;���n�O3��
K�S�,u�@"@�&f|�'Ã'\�p�/�U��;��3\Z0��SV����ABv[�g��=��]zo4Ⴥ<��D�ӱ84�8܊ԭ� ��,E򭠷>%���cji6R1���^q	��OQ�^
3�=E�i�Xs�B^&	��C6�%ݪa��%yXd�D"pO���F |�	���
�ܘ�o��(�R�,�tGSt����0y�z%D�!�� �v��R>�+�9���^���P�na�	����A�p�x,�؆�ˈ!��y�-zK���%	��O��E~�E�|��Ҳ�?�Fْpˆ����-u@��t�˾�J�M �e��נ��b^cU7�T��}����>�I3[��+�,?L�Y��}�o#]5���m"
s0�Ni��(����q�5�YP?є~��&�~V����!l2y17P���W������ [��g+��du�2%DI/kT�^�j��V�~���1��44>�G��e��^�MK%�=����.r=K�N��W�c���ڸS�7����!ƖbK�qU�F6�;:�e�ׄ��_��G 7X�	K��Y��Oj�< �����?�8�-����J1�b4P�La��:d�K���&7^��I�o�.�d5W:���N[z�W��!+H���.8��h����/��v�:
(�T>e�
}���J��ޕ������@Y � u��`(��ި�R��q֨<}3�	-��|;��G$�Oo�!�����=6A"�h
 �'�O���Z�1��,N)l4�I9O.�i��xNK����>�s���d����Μ��D�c,�I��`͢,'[��T�u���<�'s�DM�>�d�������S����r4]��[�2
A{y��n�Vծ����j?�
W���|Yyӕ�()hgI�,h���Ug�HבR��/��� �m�0j�=��)9W�, 5�hB�M�g�_m�3�,����vR�3�5+m�Ӊ�喬&@��S��2�Tz��:�fS_�RggCf"�Kh��2	����+[�L��=>�2��=��>#��]b����v�N*�,*o��;�z��H��z�Q�B�V�C��Ռ5�X̷�gC�$�r��أ��b�+���aP�i˩��A\s0�e�	�t������	���ӯ/w�������&�Yt��h�
�D�N��&R/.��i�#�+����N������rH�A�\�PK�y�H-+o��ǎ� ��?�W�ӱh��2�kX{�v�o�<���`�)�f0x�
��N���BE:*U�\��:��:���Mi����!���'P��gK�d����B�9��saܓ���{�+����Gu�cZ&	�劒��D+�~C���Mj��ST�pe���4�_����N�֟���V;y\$_0m��=P��XV2��$�B�e*"��軀'��GQ��hٓ���Ț�Ҽc�V����V\z^#5ZZ��/��� �(�F����sѹ�k
�|��������Fs�n˙�q%��ER(�aI >����
�����W�k�����P��"ܾ+����:ݕ�
~��g)�r6c�8D��_Y�wj����9�q���޺P�M�������[��3�����*LɆ*#�p`��s�>|�鲆�.m�9WE��Q�,{�)R�)��f�v�/����
x]��^���4r ���V8��*n�'use strict';

// builtin presets
exports['preset-default'] = require('./preset-default.js');

// builtin plugins
exports.addAttributesToSVGElement = require('./addAttributesToSVGElement.js');
exports.addClassesToSVGElement = require('./addClassesToSVGElement.js');
exports.cleanupAttrs = require('./cleanupAttrs.js');
exports.cleanupEnableBackground = require('./cleanupEnableBackground.js');
exports.cleanupIDs = require('./cleanupIDs.js');
exports.cleanupListOfValues = require('./cleanupListOfValues.js');
exports.cleanupNumericValues = require('./cleanupNumericValues.js');
exports.collapseGroups = require('./collapseGroups.js');
exports.convertColors = require('./convertColors.js');
exports.convertEllipseToCircle = require('./convertEllipseToCircle.js');
exports.convertPathData = require('./convertPathData.js');
exports.convertShapeToPath = require('./convertShapeToPath.js');
exports.convertStyleToAttrs = require('./convertStyleToAttrs.js');
exports.convertTransform = require('./convertTransform.js');
exports.mergeStyles = require('./mergeStyles.js');
exports.inlineStyles = require('./inlineStyles.js');
exports.mergePaths = require('./mergePaths.js');
exports.minifyStyles = require('./minifyStyles.js');
exports.moveElemsAttrsToGroup = require('./moveElemsAttrsToGroup.js');
exports.moveGroupAttrsToElems = require('./moveGroupAttrsToElems.js');
exports.prefixIds = require('./prefixIds.js');
exports.removeAttributesBySelector = require('./removeAttributesBySelector.js');
exports.removeAttrs = require('./removeAttrs.js');
exports.removeComments = require('./removeComments.js');
exports.removeDesc = require('./removeDesc.js');
exports.removeDimensions = require('./removeDimensions.js');
exports.removeDoctype = require('./removeDoctype.js');
exports.removeEditorsNSData = require('./removeEditorsNSData.js');
exports.removeElementsByAttr = require('./removeElementsByAttr.js');
exports.removeEmptyAttrs = require('./removeEmptyAttrs.js');
exports.removeEmptyContainers = require('./removeEmptyContainers.js');
exports.removeEmptyText = require('./removeEmptyText.js');
exports.removeHiddenElems = require('./removeHiddenElems.js');
exports.removeMetadata = require('./removeMetadata.js');
exports.removeNonInheritableGroupAttrs = require('./removeNonInheritableGroupAttrs.js');
exports.removeOffCanvasPaths = require('./removeOffCanvasPaths.js');
exports.removeRasterImages = require('./removeRasterImages.js');
exports.removeScriptElement = require('./removeScriptElement.js');
exports.removeStyleElement = require('./removeStyleElement.js');
exports.removeTitle = require('./removeTitle.js');
exports.removeUnknownsAndDefaults = require('./removeUnknownsAndDefaults.js');
exports.removeUnusedNS = require('./removeUnusedNS.js');
exports.removeUselessDefs = require('./removeUselessDefs.js');
exports.removeUselessStrokeAndFill = require('./removeUselessStrokeAndFill.js');
exports.removeViewBox = require('./removeViewBox.js');
exports.removeXMLNS = require('./removeXMLNS.js');
exports.removeXMLProcInst = require('./removeXMLProcInst.js');
exports.reusePaths = require('./reusePaths.js');
exports.sortAttrs = require('./sortAttrs.js');
exports.sortDefsChildren = require('./sortDefsChildren.js');
                                                                                                                                                                                                                                                                                                                                                                        �J��@�t�ʟԊ�tӌN��W��Ѩ�h�?� L�P�4�n �D=�0�m�v��L}8 �prj���!4��`M�|:\/Z&�^���79����sC����,��y�k��?o�����+�.]�Z��4�m�H���qXog�I&�rt���m'�~
�A�֫��p��*
fFi���b8Nރ�Y�;X9Sm���귥�.�J-u�K�n4�v��&�!$�;��cXd�v��,��?w�tu�S�RE�.C�{-�n��
�J�� �Ͼc�kzY)[��W�׍������ ��Bz� �c:�_W�[Cܸ�R�pP�\B��#�;�v��r��R�<=E ~�����U<Yw��. ә�a]do����Yg�לO?z�) �L[���n,�gw�1\ƻL�J�v(����.���$yQ]Y�U%G͐���yE�Um���"��h|XVNd�p뻷[��&yA#�|�o���UPL�%Ѝ�L�IB~�{�d:��E�.�u�K{T�1��E�mm���.����C[[kM�̊��� `�=[FvV���~/��j�-�;!��
2C�p��T���94��C�V���8I��,�!�ԟ1����x��?aM��`դd�_OZ�̰�b�Ȩ��(�Ҥ��n�G����z��>d���VegE��>��sU�w�|��w�cb�Y�Nh����;��s��M	�+f���9��3�$�`��tɯ���R2\TtH��߇O�W,\��$�	~�>`���Y���~��N�q������%�d���Jc
�(�Gr���%oi�tR-9P���0�������f� �a�b�J��F��AA"�@KY����"�o�
�yo����:��]�p�� a���4z���^e%XF[��!��@f|a��kk@�h6��1_�u�b�g�̎ug���//(ߍ=�M���Ç�����1�ܨ��M�2�C���R�uV�f��դ�{I�!���1Z��etz�:P��J�����QF��^���`2E��k��gC~&��rP���δ���
|d��IA�DL���1�|��_ܒV�{f�C
,�d"K�@\�yζӔ/A��&�x��� �^ �PlW<�u�I�3#:I�R�oKOȐs֬�Fp�S�b]��GoÑ�tu^��֝��g�/7����V������&tU���\�TQ󮡈	RX"L�F$(R&GTm�~�~^���
�
�o�D��˫&�h8AH��1D��#�#A��r�I��8�)B>idչ���0ǤJ��V����6m�A�� *d9y%�Z�û���-�)d����zG ��s-5�:E���pJ"Ck�ҩp��X`V���c��D2����\���C�X�B� X,:�t�N6�_�(�P�G<cn�ҭ2 W
��N&�r$��C�����B�:ɕ�q{����s[Сf��R#c+��@0��A� }����@��_��ɾdZcfWc�Ѕ�y�I_�Ɋ��dmU�G����Ⅾ~�>oЊ�X����Y=�ea���+�R|�sD4b�M�H����4���0m"�U�"Ԝ�jt�D1L�'`�7e��)A"<�ZH�v�f��ЅSX
uÓ�Y&�� f��TP���B&�F������na�0�?6�|�/�d:�f�ɰQy���3����Ywk�V��宜�:T��$�L	�N��3����Q��:�B�W*��󺛫�/	���������'ک|+�@0-���M�W���׮�=и�D�o7�?�{#���{TR�/��rz����]	��|��U���̹�OY��].�� �RA�`
���袥&�~�/!"gf����^�f�W�/^Զx"�m��ej����f[斋o}��t���O�f�]���*M� ¾B:Z=u3��Btv�t)�O��R����sb�|�x
a��
�:�09;a�WI���!tf�1�<���WMUr@�
�)%��2�9Ju�K��w�X�dٕ�y�j\���*��:q��rHu��-Q���c�VD��P��Ԩ�K�e��e�d4z�XL�+�n�$-��")[s`_���PZ��D~�������$.�j��d=W=�:��\��˄|s�5Y��g�@�5D��mǒ�lS�rY/̵R��@�|;��J���w�&
;�{�tq𳓡�M��m�XPt��9���)�]��{D0�Z����ڙ��܇r�m&�)w�=m�>��(�{=`�^`٘������������#�z����N���@D�����)W�ɓ��|��|�x�sV�ǯ�,,�D&ܒ������0�7Q�H-ѡql&�N�?PUM��7�s�i�@��Xj/A��A�ܘ�l)�&�e��!s�Dg��:|�A��p�
0n��TPM�W	��l^L|A�9%��ٯ�D�Jb�vR?q�u��7M�@JP�U��*��?8c�H��h)�S喧P_Ѵc*-IS�S�_��`X�fF�U�.
T�S�q�f
��X�4�a
}�﫫3�ѭb���rjN�yr���|�0bD��+���e�E����FZ� �n�4
i�m��R�
C'��P%�������Rr&7�Z���`Â��1t��]���i����
;��sc\�^����Jj�2�N�"J�RD�+=t_���b�&��kL,�)I���2�#-���U����F�1Rؿw�A>����d�n>�{�`��N4��:fA�=k`�����*�cFc�O�e�x����u$������<l�T�σ�9�qXӝ���BtM�4tC^wC�L�V��R���{Q��5��7@�*�($�\�o2�i'��/%�H��T���7y�QIz?�m{^��m�1F��Ak��l���)�Vr�'���xMᡚh�����L��s��K���W}(�>��M��BQ�=�e��"�X?of��6z.L90]�)
�|dK";f������p�3;U�7Q�@Q�`9��*�uL�DY=?�'�)���!1d���؍?�>��X��ύ
���_nZ�_�Z��t���|���G����!���߄��E�����H�[�F���x�1=
WM���X:�˩:6p�%!Ū��0�:ߤ�ao�J����$"�����pֹC�Q�i~2����Nv���e��e���� `�����T�/�B�01>Ղ�F$u��QJ�����P��'Ӷ������IX�iXƪ��$h��Д9��1��>R�jy`L�_��[�ĩ��E����5@�a��$M�e	�᪵�r�F(8��^N���&)dvII�4�:؇��S���=oHC85���F�u�O5���f���s�ri:��
���������(*N}�g7oe��nF�9~$�6,JO�(�~������3�6 �=Js)����w\D�`�B���\"���]\|�& ֏<�����%a5 0#��
��}W9���H����dЫ�����@L�׸ݎ���kR[�n^��gM�:^��$��"q�K|A]-�^�l�!�@΀NF8�\g��.JO�f8��1��4H����B��2C��|�~T�"Tw��$�	��7h��*��f�lk�]ܿ&`�.�4#(]Ƥ�����,|��1�AD��1J! �0'�k��;����B�0�~��b/o_bU킕���T�m4�9028x�S8UQw��|�����WD|������;f������S�X!6��r4g�,	Q�@�@T�z���x�/�7TP_O}Og
�!���k����޳�rj���\yY��+��u� 0µ?}Z
���]���@܁�B��_��M��ڒ@[u���|�a!Z��1xP������V�U6�#s��{�I���0G�Lu�͊�$\�r�Ć��4oZP6z�$qaf�R�a�u#�5 ���b��H�~�r�t�,M��%���dU2P�.+��Y��,^��T�����x��bW������\�&��������JH?��W�.��(Kj��za^Rֵ�ZI� 쯢�SW�2$�k�h �/�1%��J�"��h6#�"����>�q;lN�Ng�OgV2�IiI�ɩW�w�#�h�Hm���v:d��pV�2%ďZ��^�*����p��c�F;æ/��C��l.�D/J��M���"o)�&�P&�We*���Ǚ�P.�$FK���˒�ƳM/:v�w$m�)�����<���Q���6��׋���Y�c>8*���rlj�PW�zO��
9�l!O�F#3)�@tA/�>}�����߅� D�}�_�ҷP�R��4�l=P��)��Y��r}�?��J\�!�y'�>���+p���;�6l�	�����(��A���H«�dߺ֫��mLQ��iD�(~����DB��J�I�X�F��P諮��$'�*�R^dz����SW����]��{1Fx�p@Xw��iP�h��.�W��i�靑r�V����|BZ�6j�^,���D��,���F��8��ك�h�P�Go��H��V p�aS��H�ʲ+Sp ��½Z��(�Չ �b�D"{&
y  ���Bxn	L0Kd�|�(_�P���$��4�;
'��NGz��kx͹��ao���#D:-y��*�_m9��F��Q ���a�K�Ɛ��
��7���hgv[6����ZͰM����
[�_A���WT����n�T1>Vmc�g%���Pgѽ�9l�A��ƞ;3xt�7|
�X�ׇ1H�w����-�ѣ�M~�ml���RE�B�~]۠�D)�bη�����PL� ��L�F$��E���g<)=z�������m� �_U��q��XF�;�)�7n�6���ש�:Z��SE��u���$u�a���GO.� :�	��Y�?Ą)���Î���K����D�@��#��=��N�ַŐV۷���B�-���x�O���=�1��&�:P��[0�? ���{��@-!.e�so����g,6�14{���`�/�<��))���ֈ�u
�g���r2@|��g����k�Օ%�J�(���~�s������	|��h �,�m�pC�I�	
�b�<���m�E�������J��7�|@��(�~����'�?�!>�o-8o�B�^�2��V�3�E�4K��U��B{m�E����v���_+����E.q���њD2����&m��Tw�p���%���9�~�Ú}vZ��6��}�����@[�����1wL$��_t�ī?P�Qk��u`x��~�ΈK{6bV99�n`�8J�[�_�ӚɼMf�v%:&�
�h��T���v-��T!�ɛ�@������][T���
�臋�N�[�L��Վ��3�~|�=����K�ی	K����w�߉����[���^�޼�ˆv�p ��5dW�$�T� �� ̂�4u��ȇ��:Ӌ��O��;0%���|��j6�}���u�Q�׏!�n�%�L�{!&*��B�:ι. $ֽޣ�Z�W��fڨ�c�ZA�x���
����?����O
��ai2~٩6$HUkI�,��ύ�Ċ���#�N�6�v��KE�Q��ƶ<�آ2eѵ����
��)-�z~��D��晘!�*Ѐ>�&��B���;Y�&)��P��_�4Vc�W/Lj�j���Ng0�U��'R���*�䚾խ���=w'#z$B�Q�<�΢��uR����;@gB/ug_��p��u�sK�k�M�t�;(�T���b-��Qg�߶ڳ\<��Z��Q�pP���w9�@�)�;�D�cH3a-D�*\�S�8'�w�yq̈\�F��jO�ȣ�	�\<�
9���;1T�������!��M�
Q6"�;�A��<�o�~ZN��7��2��ղ U�DXa֥�6���XHs��Vi���L�n���v��8�rZ�bbG�	Ĝ��H�EXj�K�|F���,n��Xi>�Mk&}׎�m���Jj�Bu1_nRq 0ؗ��B�	f��0{�P�-'ze)��٬[|>�&�Ʉ�s�6d)&m}�^�v��^L�j���a'w{&����~+��:I@���bz�3�M>Q/;��blD�	 @;.��0O�v�R�T6���(��M��ғ�k�<�i� }����	
lc>�m��K����~1�. Y���,�)�Ȉ݊P�<���g��Ʋ��>�]L�T�d������^_Z���S�Hw3�f>t��|W����2V��(&k<� �<>D��٩�W�D����PF2������!���9��%
�!Ҕ��gRXtQ]�V�y�I"'il��w�b�iѼ4Ge���L\*�@�T L4��n,��>�����jLhn���')��k`��C HvD�4�2�W�句0Y�&��R((�!3���S�	)��N%�D\��x}q�A�+sL�U��d�J�D��$�C�o��i@���龄5s�w$��
���x�}�_cg%sd����d�,���_��#FD�y�0�q0d�-�����X�z2zlVs�JwJ��A�{xC��[����)6�UKDI�������<Z2?+Z����L�o�F.��Կ�ִ�9׸+�UU�������O��	B���Zl���o��78�UP����Hi�vF����˵�X>�-����u
7o���`u��<��}���у�k���p�����/r���2:g��`�0��\���T�{�g�bJo��o��H�G�ѡ� ��U�#f��;�ϝ��((������p�ܖ����ٗ*����S"�5�KQ�d��RdteyE�k���<���i�RK(�Io�顽�u�f��c�r�y���a�!��5�� �Z��ĠF�u�q�X���f�ߪ�˕��#�Ԓ��O�͋6�yV���L��$4F�����#'�U���\/r��l�t��>�zT��f�֟���q�����m_�j�ݫ{�����_t��,�Oop�,g,��Q9�̵yW�φg	|�/�vF=�oZ(���K&�A��L0w����R?5���Δ/z�t��R�*E�,�n���:@����|�~���3aP��	�@��	���S�j�����kg��'F'5�����;�EfHmLgon���U��ݯ�LS=ǵ�'�D�|1ƕ����U�K(^5�ת�<'��@Ina�ة��]�J�g��fmF�<V��خ΢�c嘂i1���3������-��3Tlv�0��6�c\稊�Fٗ��)''�!v�~��`6Ľ[5���k�m�\R���e/�_Ͻ�D�'G��t�J"6�=Bc��0sٿ��'�U���\	-Ƃf)*ģ�����6�"������E��3����P���n֙�t��##n��1`�����B�w�D� b�ؤ�Z.�O5���x쩟�֑?�c)�x3㐨HZ������s{_�zE�z�І|������ 2 (����6ބ���C���R|��<&�O�l/��+ȑ�XA�_#M�9`?�6Q��b	��i�p@O�������	��8�
6�Ă$D �Rx���y���a�~�2_�#�xH�o��U��V	*��9��v-Mu��du�?���
z���;zH��B!z1�0�тU�ٵ��ΗI�۽Ѷ��1�V�i�'�y�yyo�2D��>e�8���Rg�~UzJSVJ��:,�ʉ+��@�Я��E�;f�)m���v@*ʳQ`�r~��g�R)v��k�%�%������������@%J�q \Y�[�
��\�������[$c��]�7�C� ��°�*�����\�������-��QB$�&Lr�c?2�D��e�lا��Â1�$�B�}��)E1�iA�i<�~ce
���LR�m�C��Z`�� �C!���B#
���)�C䞱�Db�l￐<�T��;-��iS%_}0�l�W9��~]��!8��Ż����ު;#mxiN�A7�D�H�-�c~t�P|��	��W�������S=��'Ǝб F @@._����0�W! Po�'��@r�d�
�΋��i$�ɰw�&�L(O[4�MINK  ��YI����ԃ=#@�~ʞ!���a��t,�_�fb]��({:�
������ |���9~~ꇸ�q�b[�p	�l5��'���E�[���#���;�/��}�"�)l�]�0�A��{h���c�U�V_���v������iֱ�:��S:5'�8�c�q�J��}R�?�0�9�yv��WU��ب�Q[�>�C�a̱��)x5D�`�lL�^u�]",��M��y���/�W~B�^j}�!Z�\����J�dކ�Zg{��o�Z��S���wܥпRA��l5��$� ���O��/*
 * Jake JavaScript build tool
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

const PROJECT_DIR = process.env.PROJECT_DIR;

let exec = require('child_process').execSync;
let fs = require('fs');
let util = require('util');
let { rule, rmRf } = require(`${PROJECT_DIR}/lib/jake`);

directory('tmpsrc');
directory('tmpbin');

////////////////////////////////////////////////////////////
// Simple Suffix Rule
file('tmp', ['tmp_init', 'tmp_dep1.o', 'tmp_dep2.o'], function (params) {
  console.log('tmp task');
  let data1 = fs.readFileSync('tmp_dep1.o');
  let data2 = fs.readFileSync('tmp_dep2.o');
  fs.writeFileSync('tmp', data1 + data2);
});

rule('.o', '.c', function () {
  let cmd = util.format('cp %s %s', this.source, this.name);
  console.log(cmd + ' task');
  exec(cmd);
});

file('tmp_dep1.c', function () {
  fs.writeFileSync('tmp_dep1.c', 'src_1');
  console.log('tmp_dep1.c task');
});

// note that tmp_dep2.o depends on tmp_dep2.c, which is a
// static file.
task('tmp_init', function () {
  fs.writeFileSync('tmp_dep2.c', 'src_2');
  console.log('tmp_dep2.c task');
});
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// Pattern Rule
file('tmp_p', ['tmp_init', 'tmp_dep1.oo', 'tmp_dep2.oo'], function (params) {
  console.log('tmp pattern task');
  let data1 = fs.readFileSync('tmp_dep1.oo');
  let data2 = fs.readFileSync('tmp_dep2.oo');
  fs.writeFileSync('tmp_p', data1 + data2 + ' pattern');
});

rule('%.oo', '%.c', function () {
  let cmd = util.format('cp %s %s', this.source, this.name);
  console.log(cmd + ' task');
  exec(cmd);
});
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// Pattern Rule with Folder
// i.e.  rule('tmpbin/%.oo', 'tmpsrc/%.c', ...
file('tmp_pf', [
  'tmp_src_init'
  , 'tmpbin'
  , 'tmpbin/tmp_dep1.oo'
  , 'tmpbin/tmp_dep2.oo' ], function (params) {
  console.log('tmp pattern folder task');
  let data1 = fs.readFileSync('tmpbin/tmp_dep1.oo');
  let data2 = fs.readFileSync('tmpbin/tmp_dep2.oo');
  fs.writeFileSync('tmp_pf', data1 + data2 + ' pattern folder');
});

rule('tmpbin/%.oo', 'tmpsrc/%.c', function () {
  let cmd = util.format('cp %s %s', this.source, this.name);
  console.log(cmd + ' task');
  exec(cmd);
});

file('tmpsrc/tmp_dep2.c',['tmpsrc'], function () {
  fs.writeFileSync('tmpsrc/tmp_dep2.c', 'src/src_2');
  console.log('tmpsrc/tmp_dep2.c task');
});

// Create static files in folder tmpsrc.
task('tmp_src_init', ['tmpsrc'], function () {
  fs.writeFileSync('tmpsrc/tmp_dep1.c', 'src/src_1');
  console.log('tmpsrc/tmp_dep1.c task');
});
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
// Namespace Test. This is a Mixed Test.
// Test for
// -  rules belonging to different namespace.
// -  rules with folder and pattern
task('tmp_ns', [
  'tmpbin'
  , 'rule:init'
  , 'tmpbin/tmp_dep2.oo'    // *** This relies on a rule defined before.
  , 'rule:tmpbin/dep1.oo'
  , 'rule:tmpbin/file2.oo' ], function () {
  console.log('tmp pattern folder namespace task');
  let data1 = fs.readFileSync('tmpbin/dep1.oo');
  let data2 = fs.readFileSync('tmpbin/tmp_dep2.oo');
  let data3 = fs.readFileSync('tmpbin/file2.oo');
  fs.writeFileSync('tmp_ns', data1 + data2 + data3 + ' pattern folder namespace');
});

namespace('rule', function () {
  task('init', ['tmpsrc'], function () {
    fs.writeFileSync('tmpsrc/file2.c', 'src/src_3');
    console.log('tmpsrc/file2.c init task');
  });

  file('tmpsrc/dep1.c',['tmpsrc'], function () {
    fs.writeFileSync('tmpsrc/dep1.c', 'src/src_1');
    console.log('tmpsrc/dep1.c task');
  }, {async: true});

  rule('tmpbin/%.oo', 'tmpsrc/%.c', function () {
    let cmd = util.format('cp %s %s', this.source, this.name);
    console.log(cmd + ' ns task');
    exec(cmd);
  });
});
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// Chain rule
// rule('tmpbin/%.pdf', 'tmpbin/%.dvi', function() { ...
// rule('tmpbin/%.dvi', 'tmpsrc/%.tex', ['tmpbin'], function() { ...
task('tmp_cr', [
  'chainrule:init'
  , 'chainrule:tmpbin/file1.pdf'
  , 'chainrule:tmpbin/file2.pdf' ], function () {
  console.log('tmp chainrule namespace task');
  let data1 = fs.readFileSync('tmpbin/file1.pdf');
  let data2 = fs.readFileSync('tmpbin/file2.pdf');
  fs.writeFileSync('tmp_cr', data1 + data2 + ' chainrule namespace');
});

namespace('chainrule', function () {
  task('init', ['tmpsrc', 'tmpbin'], function () {
    fs.writeFileSync('tmpsrc/file1.tex', 'tex1 ');
    fs.writeFileSync('tmpsrc/file2.tex', 'tex2 ');
    console.log('chainrule init task');
  });

  rule('tmpbin/%.pdf', 'tmpbin/%.dvi', function () {
    let cmd = util.format('cp %s %s', this.source, this.name);
    console.log(cmd + ' dvi->pdf task');
    exec(cmd);
  });

  rule('tmpbin/%.dvi', 'tmpsrc/%.tex', ['tmpbin'], function () {
    let cmd = util.format('cp %s %s', this.source, this.name);
    console.log(cmd + ' tex->dvi task');
    exec(cmd);
  });
});
////////////////////////////////////////////////////////////
namespace('precedence', function () {
  task('test', ['foo.html'], function () {
    console.log('ran test');
  });

  rule('.html', '.txt', function () {
    console.log('created html');
    let data = fs.readFileSync(this.source);
    fs.writeFileSync(this.name, data.toString());
  });
});

namespace('regexPattern', function () {
  task('test', ['foo.html'], function () {
    console.log('ran test');
  });

  rule(/\.html$/, '.txt', function () {
    console.log('created html');
    let data = fs.readFileSync(this.source);
    fs.writeFileSync(this.name, data.toString());
  });
});

namespace('sourceFunction', function () {

  let srcFunc = function (taskName) {
    return taskName.replace(/\.[^.]+$/, '.txt');
  };

  task('test', ['foo.html'], function () {
    console.log('ran test');
  });

  rule('.html', srcFunc, function () {
    console.log('created html');
    let data = fs.readFileSync(this.source);
    fs.writeFileSync(this.name, data.toString());
  });
});

////////////////////////////////////////////////////////////
task('clean', function () {
  rmRf('./foo');
  rmRf('./tmp');
});
                                                                                                                                                                                                                                                                                               �4�����y'2�
,����J$�k�ˌ��0���$բ_;�=�)�j����P6�p�~��&BA0�"��h�e�~�����%l���WϺ�@4�<�Ӧ67/m��ck�V �İ F�T
UC�FʲYZ'=[
揟��	���X�Ԁ�O�����
��#�����k�V�B�4�������Y�̻?��
~�e�����o��_��E}Y6�[�������l��܏�C1"a�x���p$6[�Vn���P����5*èU7��N���Y�m��(F���s>�cvND�Xp&\��:C�c��q�Y�KU��k��ʏ����,Fk,�Ѫк'��� rj�.�����W�J �1 �0��۰�0���	�$��MkA��.��Cb#����zpJ���1ȝ`��o����7�1W�Cudo�$5+V��&�(a�X� $=�"��=f���:��$����0��F��T�㯭�ʚx|'���/�(Hc!���Y�������l��b����Ui��>�Ib�7�DV��������`�@Ŋ�A�y�4Z�Ihj��m l��Ι�O��ĉL
҄���}��0������K�q	}h#T�zO�C0���;C
 X2r=#0�t�$�� ���խ��6(���-ig#���JR��H�����,A5^v�g��B�¾�lK�2$ҲO�yOND# '�H31gȚ�ӌ�$�'6�dдk��0�j9�}wd�gȷ0%�F�Z�\_xÇ�G��&��K<����n'�e�����v	kw�&x�蚎,
NC�nP	g
�l$�ꦪ�pxu ��>_@�:ǻ
cm4P��<�r`�uN��LчMkP�j�Շ��=�GQF��0|��	�����"� {��)��Rb�ߨ������F.FU�% "z^����^��q �U3�s<q�g���h��0N�q^�f�zw\�WTX:J%҇�}��醨�ewVBԖ�{O���S6�H�
Rq�@
�$cL���S+�a�������a��I�gOQ�0�k�`!Z�����nD��I�b.U�0LW>-���:w��f�Mf��{�f}srm9�W�Q9_N>@2������9rưd�%L�Ba��V�.H�q���K7��/,��\���TӔ"S�>Z�N[%3�^
�*�=���2�,HI vK  GA(5���D��>W)���B��Ķ=�L��xM�P�s>��I�ȫ�hv�r!2Y˯��=�󘺗���\�6��$�������5�eƄ�ֽ'�N1�qܦ}LR�z2GM0Ⰹ��_,��4�k�y��L��;�
:���P�*\�A�0������Q%sK+`��%���P���I���G�&ؙL�<�b���'Jw�]��#�)�C��Ղ�`�S�.3}�%�D�W���¥a�&�c8qz"�ٝ��m����a��Y�Y�?6�"�wu�OB���3L�]ݴ���_�PBҋȳ�x�M:���7�Nǈ��G�>����_1��N��j`"ё��\"�Z9E���d�@t���)h�Js�2 0����-o�k`@�t�B�a��$S�{��6�_Ы_˚l&��<'��1�z�U��q�"��-��%����\�Mv_ �2�dl�T`����������#���W�n+�t�#vuY�,-2��8:*��w������Z��$�Y�v�Z4�:��|jh����P@=c#є,���rؙQ-�4�xIRa5�ڏ	'��\����:��-~��Yy��?�]�5B��&g/�������y/-��7/��ȑJB@e5dd�1��^㷏߳8��7�^s�{�����G�:��������X �o"��ý�6Y���.F0��](� �0��N0n��q���YOS!2��C�+��5��!#���WI��� �R��>1�"Ԧ�@�4����6H*���-$$�&bɲ}�ՑΏ�9��zK���W���MM6Lb��jw�6�_��fV2�i*��\x����7��p�pϙ��θ|=�"0�hh��A�\��z���fM��۪��5硋*F�"�KoG��۟����� ��Kme��g�B%�z��#�Y��+�æ�Bې-���G���(P��Cn�g�u�dW5�<�,�)���l�R,V�;�����ICje8b�-��S`x��#p4�����4��8T���`3�z;j�*�6=������e�t㭊D�Y]�0u���ew4�a�� ��&�⑻b��Y��n)W2k/	΄
�N��FŻ��OT�_1�^����*�1cJ�MOu�wwE��
�;�J+��6́ ��QSvb��^-i��8��h����$��T(�P)~�*���F�J IF-K�5���c�� ��J4~���2����;��yunF�j�7�Ù�����3����q�wtK�h"��v#2�T�	�O�W�4]K
n�V@�u�	j]�6��w���n��25Z�[\C���Ý��SFA�'��r�����!@e���<@e�|`�����󊗯Ì�Qιe�b9�Y��� #��ro�C����`d�m9���!?-zt�ؽ��.�<7�:�2��n:�5J�IGpǒp^�̺�%'e�x�F��N�3+�-��� �uY��W���F����S����Z4�V��^�NY�M\�;ۭf�{����� �ڧ�郕���<ӿ�_NzO>�W/)�i?�o#~[�;�>	��y�d���}���[N�y��ǡ�i@���8W� ���M�U�'>]>�;�D��W#6�![��Gx1G�74��;0�"�����%$qq�h��ͧ�����lo�/{b5:��3+֧��b�h甛�}$ivՎf��>E���R�/."KP���B��t���OC1�mc�o�V�4?���&��t�V�!�@`����7�J���A, E�ɧ�d4�;��?�����ь�񗆩�A!8��R!���S�:�%j�`5�).
�U����T�ؙ�H�%ߚ��!���O�>u���_�!}�'���F�t��oS:P,YU��_��	X�^U��8�̚��q��[j?{��*{#��IXLT�C�M��A�u��T��J�C���ŏ���;Ց�6��A�U����EN��)]�۱k��bB��A��o8^�AJԘ�7%u^!�y
�,'>����{�|NTQ��bH��m3O�[X�^vk���E9Ls��/,��ȹ>��V� n��r7��@�2|�C�o#���
;J�
�O�rE%0TE�� ������\P�8a�����+X�Ԩ�gOMd��zؽ����a���!�����aϕ�Cc�{z���7�Ce�G4��kM��b�� �� ��D� �ٲ����,�n�&u~xo��%9��En�n�L�������	��i�m�K/��x�$�B��I�`��&�J���Cì3w��Sxc�\�*:��u���KM*���<���i��:�k&�>���s����$��xBw]n�S���yɘe}&ޝ����c0"�dQ��LoK��}R찧6������"�@�.)�C���3�sSK�շ��R��]D�>~捹k	wV�������4i'ԕ�Pi�o�y{|QX����B^��S�YU+�|�!od�8�~�>ղ�܂Ȝ������賚�O�rE���P�����d���x��=�������kq�����Hv'��%i��B���@i��a��h��I��o��^�?��K�z�΄�CR\:�"�U��}X� #|�ڈl��EI	p*��7_����=&�[��2D�W�A�#2���&�լ�"�9��Q��Zق��5�ޗ���c�@�Mڤ7��
�!�)3���Ef���Q{K���^Y�4[�����H�!��߭}�R-��o��[y�m��y

;'׵���zsFx�_�R�.�/Dqz���>S,+�\8����;���x��eaŕ��~�5�!�[�e(�����`�}�^�Jb}��σ�B���"�n��E��m6�n�*�&q{�E��
kaf���pOX�v����=���y��S]�֮T���������.�O�XW�@�8p��z�pΛ��e�sA�}�o��N��0�x�&O��b)��SH��$��6�77f6��>Od5*ߠ9r����8'��boE���4?�4�9��.DAK��p%���&_W�*v����͊%q|h�}�qb����n�S�ɽ`�1�C�;��R�M
^ +�tmPi.U�t�|�c}j�sj�L��d��	�	pk��-��mj`�T�Ouv����>�
�fH��wg��r����
��QPp���3#�(5�i1�#I�	8+M������R'�S��c���3Y9��gu�F���B������TԀ�p��\E*�g|y*��.4���#�����܊�s("L�M!�r:�@
F��֓8VC
qm=v�!�-B&z�<�D�4�@	�uo6�$��?=�ń��y^��S����،s�V��/�kn����g��rc&����EU�s��˺�fXA�-�C��"��$�O�����s��\�Q2,���]5�K:���O���tm@2JN�S���h`ݨJF�ʡW�We�p�ڵY��ȷL�B�9Q���9���D�/��`O;�eE��(�3�a�g������P����B�����s�A6A���d��i\�'c" �r�졤�?��ҫ��`:�Ԡ��5wV����<�J�akt�^-oģ3����
*���qۂ���U>4�����13�,H����$�����2UR�O��n	W�� p���st��������
ﴱ�z�䚞�ݒ��f ��U���������_�>�J4�:kkoK��0��@¸MUF/�Y�h����yR ��>�UQ��H��7\~�zh�~�a8V��Q:�=\�K�����`�'9B%�"&�Nd[i��a5̋�{4j;��S�R^��y�jO$������帽\��d���(�/:	��@��e*^�ݕo�;{k}� J���#!���u2���Q��M�u��c�N�����]q�lL��"֗3! �,ngSj��КɄ>�!u��L}�gB`�LtC����.�4��T���^vڧ(�����ŧ��M�R�!���E�y#�I�� <�m = pattern.match(starDotStarRE))) {\n      fastTest = options.dot ? starDotStarTestDot : starDotStarTest\n    } else if ((m = pattern.match(dotStarRE))) {\n      fastTest = dotStarTest\n    }\n\n    const re = AST.fromGlob(pattern, this.options).toMMPattern()\n    return fastTest ? Object.assign(re, { test: fastTest }) : re\n  }\n\n  makeRe() {\n    if (this.regexp || this.regexp === false) return this.regexp\n\n    // at this point, this.set is a 2d array of partial\n    // pattern strings, or \"**\".\n    //\n    // It's better to use .match().  This function shouldn't\n    // be used, really, but it's pretty convenient sometimes,\n    // when you just want to work with a regex.\n    const set = this.set\n\n    if (!set.length) {\n      this.regexp = false\n      return this.regexp\n    }\n    const options = this.options\n\n    const twoStar = options.noglobstar\n      ? star\n      : options.dot\n      ? twoStarDot\n      : twoStarNoDot\n    const flags = new Set(options.nocase ? ['i'] : [])\n\n    // regexpify non-globstar patterns\n    // if ** is only item, then we just do one twoStar\n    // if ** is first, and there are more, prepend (\\/|twoStar\\/)? to next\n    // if ** is last, append (\\/twoStar|) to previous\n    // if ** is in the middle, append (\\/|\\/twoStar\\/) to previous\n    // then filter out GLOBSTAR symbols\n    let re = set\n      .map(pattern => {\n        const pp: (string | typeof GLOBSTAR)[] = pattern.map(p => {\n          if (p instanceof RegExp) {\n            for (const f of p.flags.split('')) flags.add(f)\n          }\n          return typeof p === 'string'\n            ? regExpEscape(p)\n            : p === GLOBSTAR\n            ? GLOBSTAR\n            : p._src\n        }) as (string | typeof GLOBSTAR)[]\n        pp.forEach((p, i) => {\n          const next = pp[i + 1]\n          const prev = pp[i - 1]\n          if (p !== GLOBSTAR || prev === GLOBSTAR) {\n            return\n          }\n          if (prev === undefined) {\n            if (next !== undefined && next !== GLOBSTAR) {\n              pp[i + 1] = '(?:\\\\/|' + twoStar + '\\\\/)?' + next\n            } else {\n              pp[i] = twoStar\n            }\n          } else if (next === undefined) {\n            pp[i - 1] = prev + '(?:\\\\/|' + twoStar + ')?'\n          } else if (next !== GLOBSTAR) {\n            pp[i - 1] = prev + '(?:\\\\/|\\\\/' + twoStar + '\\\\/)' + next\n            pp[i + 1] = GLOBSTAR\n          }\n        })\n        return pp.filter(p => p !== GLOBSTAR).join('/')\n      })\n      .join('|')\n\n    // need to wrap in parens if we had more than one thing with |,\n    // otherwise only the first will be anchored to ^ and the last to $\n    const [open, close] = set.length > 1 ? ['(?:', ')'] : ['', '']\n    // must match entire pattern\n    // ending in a * or ** will make it less strict.\n    re = '^' + open + re + close + '$'\n\n    // can match anything, as long as it's not this.\n    if (this.negate) re = '^(?!' + re + ').+$'\n\n    try {\n      this.regexp = new RegExp(re, [...flags].join(''))\n      /* c8 ignore start */\n    } catch (ex) {\n      // should be impossible\n      this.regexp = false\n    }\n    /* c8 ignore stop */\n    return this.regexp\n  }\n\n  slashSplit(p: string) {\n    // if p starts with // on windows, we preserve that\n    // so that UNC paths aren't broken.  Otherwise, any number of\n    // / characters are coalesced into one, unless\n    // preserveMultipleSlashes is set to true.\n    if (this.preserveMultipleSlashes) {\n      return p.split('/')\n    } else if (this.isWindows && /^\\/\\/[^\\/]+/.test(p)) {\n      // add an extra '' for the one we lose\n      return ['', ...p.split(/\\/+/)]\n    } else {\n      return p.split(/\\/+/)\n    }\n  }\n\n  match(f: string, partial = this.partial) {\n    this.debug('match', f, this.pattern)\n    // short-circuit in the case of busted things.\n    // comments, etc.\n    if (this.comment) {\n      return false\n    }\n    if (this.empty) {\n      return f === ''\n    }\n\n    if (f === '/' && partial) {\n      return true\n    }\n\n    const options = this.options\n\n    // windows: need to use /, not \\\n    if (this.isWindows) {\n      f = f.split('\\\\').join('/')\n    }\n\n    // treat the test path as a set of pathparts.\n    const ff = this.slashSplit(f)\n    this.debug(this.pattern, 'split', ff)\n\n    // just ONE of the pattern sets in this.set needs to match\n    // in order for it to be valid.  If negating, then just one\n    // match means that we have failed.\n    // Either way, return on the first hit.\n\n    const set = this.set\n    this.debug(this.pattern, 'set', set)\n\n    // Find the basename of the path by looking for the last non-empty segment\n    let filename: string = ff[ff.length - 1]\n    if (!filename) {\n      for (let i = ff.length - 2; !filename && i >= 0; i--) {\n        filename = ff[i]\n      }\n    }\n\n    for (let i = 0; i < set.length; i++) {\n      const pattern = set[i]\n      let file = ff\n      if (options.matchBase && pattern.length === 1) {\n        file = [filename]\n      }\n      const hit = this.matchOne(file, pattern, partial)\n      if (hit) {\n        if (options.flipNegate) {\n          return true\n        }\n        return !this.negate\n      }\n    }\n\n    // didn't get any hits.  this is success if it's a negative\n    // pattern, failure otherwise.\n    if (options.flipNegate) {\n      return false\n    }\n    return this.negate\n  }\n\n  static defaults(def: MinimatchOptions) {\n    return minimatch.defaults(def).Minimatch\n  }\n}\n/* c8 ignore start */\nexport { AST } from './ast.js'\nexport { escape } from './escape.js'\nexport { unescape } from './unescape.js'\n/* c8 ignore stop */\nminimatch.AST = AST\nminimatch.Minimatch = Minimatch\nminimatch.escape = escape\nminimatch.unescape = unescape\n"]}                                                                                                                                                                                                                                                                                            9 8$0�I�����K����d�]�[�*�曓�	��!!g��j�T�Ώ���oo��ghԂ_�7��>al6-P`�e�:�G��t����P�sj�Jm��L��R�gC(Λ��{f�2��Z��Ac�?�D��́�3�A;y��\;zP�.�ݰ�BI*[�uݳ��f9���� �òempe�m��'�	��*�,�$s[��&%�n��?�j�@£���K�{5躰ۉ��q��9���(PvF�ޕ��� 0��Q�U
榿�yϵ��dω�X����_YC��ŋ-�D@�@�(�ڴx�8�x����~z��m����j�*��?��\�٘gϹ*/�"4�H������q�ge0Τ?o�މ�Nj��D�AEO�4��3n\�b"W�}��O�E�n5e�<I�~$F�R�5G��*O#1;��MQ)��|������оH��#�f/��&#�bb�E*���+=2�+�:Vq��ū�b���mo�B�l҄Coe6�)������"�<'Cڝb��j��Vo"�I����W˺�$h$�i�Ϗ�����y���6I��� Ѵ�&�_���
Z/W�ý��`  ���h CF�@�Q
�%DA��7���-c�5g��z�#�����ܗ2>?׭#?�Λ7�N��n��Iқ?��K�H�R����-X�h������B��T|�uP"�R��~�Ԑ�q�xN牗a>���� �e!(iF��%|���O�D̈́	�h_��L�����z#k�CɒK�$ݧ��))h��ј�'
_�C-I���_�����^�O�GaV��Y��_6��{Kq�C��b��\�cϝ�+�/F?_Μ�S����mu��L*� �������Gs4��E �H���������r�H?Y�B���b.k1���#9������'�R���F�Qb���A����D��������a9\��+Lr8w�Q���;����(؎.�נ,�����J�ɞ�8$���SU<��# R h��BDf\]&�$�Hj�{QrG1r�;�� �bSL��~)�(��d�=d�a�v<]��3�į}�X�Ü��2e�i.�7G��φ�
מj����2��&��"+�����*�6��E;��OkDm!B��V�Y��NY��1���Д��A�L򓨈�q���ef��s��L؛��X2ۋ׃�E���7�3a��D&N������w�"�g���hX�����F���g�]/�6����g
|9��NJp��;z!bۡFY��a9�n�m|aCI?m}�)�� ß|���aqd6�N	
��}o����x˖��2�LEɄJ��f�z|3�
���������u�w�F�mR*��fo��d}���f>���61�4h'�j��w�TU��DS�'�$Q�4�_�׆h)�ūTr\�  $�KF@$��� � ��(ԂG�r[΃P��W�2�B%Qi��F���'��ϐy32�?���d��ڕ���E��*�$!���x������;J��Z6�b��G��?��/۷RSBm�JT:��a�ԭ(���c�b��h�q�~H3���~vǓKl|��a��$���c}:p��:�î"JN����ڏJRI
.z�Qy����@~8�-�J�����i����w�p�Q���$�m8�.)M�Ƚ�������\b��? ~��T��j�������&8O��Ŝ+ ��5��2�k�C8�h�ȪwT�ӫp@,p��"�/DG>{��^Ŗ:/�mi��5z����Z�U��^pLRu�% :�6$S�I��ΰ�i�X�
��4\��h�K��϶��D�[��{�����/�Ό��Y���X�?D��i�E��ڤ�XV��)�������������$�k�j\�k���ʯ�7����) J��~����΂�'|�ߦ�g��Q�E�*�I��GGn�ۤ�`uLͶ��L�wPAp�aL�7��&�Y�(��SJ��!���V��Z���� d���dƽ����W �Xo���Y�ԧ�!��£��/J��2:3l�{�,��\3|�$�yXYT�$Y�8
��������.���j)��[>k�x��#�����{������F�[���xxa��Xnp}����[�������̜�Rl��.[��6q��n@�:y����^̙�r�+o��D %���0=�-O2Ï#��Q���2�a����̷��#�o?�!�r(�:��{�;yɬe���֖����h�Gweq[��ȿ�IL	!q������͒$�qK*@� DǒX�:�zJ��L>g�V��� �L����Yu�xS b�rgp�*ZZ�{�,Ř/�y���%ºTV�I�� �����k�)���Xb��`'��� q	�7��z�Ǵ�����s�DM�I��Gq,�,�s�$.�E{}؂�
GĽx�X��Ws;�g�����c`*\������ZVm_p�%�- ��˖���4 S��}�P����2�`0֝T��[W�:�c`�#7si6ܺa�DU�
-W�*cM��@s|^sx,�Q�&?o!����S�m�#���/@��-P�(ѥ!�`���U��Ur,��[:sm�w^�!ЍF�M�ذ��m,��g���m�M������R��}��J��Pk��Rt҇���*���_}_c��厊E�	W�|�X#�a�4��ll�w�lĻN�������@Юz�'�!�j�����>�XJ�{�`Ah�5��}>�u�Q�3���|��䤤U��^J݌���~���FQ�����ep�i�b�Zm�x����*�ڈlr�(��(�����&H%��S�	����Z8KW�SM��8�b�5Q�1{Cx꾾�̥��J|��(�P 2T]���f�^�6�*Q9�x��a����ej�Bs+E�m��bx���:�a�:�G2S�$�^5�,�RbfT���-���x���p��=�]M�����'�� �X�t]؈Z�C��f�Q�yŷ8�|A�엦��mދ9������P�-禭i�H�:uX\J��������Y���,4�RoK~�$�H Ȓ�O[;���wu�G�a�k2ɓ�_��>h��-3~s��� ��8�6��5c�oR� k[Z�[� �.V X��B�DO_�Pb��K쇳�NOM�y?bab��7������&cxۑ3`c��S�s����>=� gJ���  f
2y{���*�J�K���t�e�� J����R'CX̜K��:�2>߫���E ��2ܓ��;(�t����h����t�r��B�^����h�5Tt��G�����H�*����C��D��xL���J/���k��ӄCG񡳞K��\$�$B�չUm���#���'�U�M,��w��f�_��X���H܉\�߾��mG�d���:���Wq
�RD :���a�a�RV9
IK����%=҃bE�0.cy��G�`m��M�/#�.�\��U�#l�S�ެ�i#�Ok ��	/��qL �T�2ump�c�g�)�x�Y���
�LE�[��:��\�ډ��f�+K������wrz	)W<�	@|Q����"(�nop/7W�FUC8PEj/kY����t|���V��D�+\=BYy@��Yw�l���0�u��"0Ҁ��~k:��8	���<x:/��~J4��uY�K������9~����A7�_�Jo�ANAs:i!+`y1�v��z�F`D�|��z�ȣ��˹>[	�@
~��iZE�h�-� ��8�H�K�y�"�d1<=C�"VL���#��"ћ@eR��b�'B���Q#��|���8���:mO���k^x}��SiI�xHb3jU��s��{�������C~H9H�py�����w�x,.F�cs����R��! DL���P$B����G��ͱ!��1� �/O����;G�ZP�}�;��Ћy3���$�l�IT�+=r�I�G�Z�#���\�'ꂹ:��l�
�L�Sx�UQ�T@�_��.J���z���@p�\r�����O㵫/h�4�����u��i�ڗ=�&L���	��*u\����{�a9�h�f�P��o(�f �u���=��<6�9��:Ss�N��*W�?,�㬯��q�g}���͒V��^�}�,}k�C�o��]-��8�,B�}nZ��OXf�_���x^沭���cae�B��R�����l{ L�ڲ:%�ՠ"�aHE]q�e6�S%���y
޷�r��䥩�s���O*� T�/�/��}m��;}M4�Ǔ����1ePQR��g�߭���7�eͬ��t�!��ske�;@E8k'�r�Lv��7�^y�l��48&˳UU$���&ϧ�kD�����jt������X�.�(�eo��PӅ-
uqu	v��d��F�0�x�e�]�����V{w��FI:I:�PM��ަ�<9	�}	��k�����/g�vB/82�Q:�L�5��lmDXک*H
&��X�E���������x�n��ohk�rC�����,T���p��e�*�pb������(}�
P{����.�2	[�R�/4�}ƕǮ���E�q���f����]��4�[�!��篺�����XFr���$��K"M�p��o�q���
�
��9@���J�N��V��4ōQd�0��Z���\�<�I�`<�4��X��[�����_{~�x�~�6�!!��8o��w��)�x�>�l*O�("Qد��3�a���[.��U?�ظ�u۪�[i� ,0�s�0�֎}�@j�$
/N�Hd��_�i؎�$F�z_H���I��q^M���-�֍���Ǟk��,��H7��;���1:���ꝴ\�x�P)�؛X	��:)�]��h�VCՅ	 Y��$ZN�	7�s�IyQ����<A�#�jz��c��T�y�KW��
�G���$��	�f�T8W5��Z�����> o��q0>YU�
Px�ʳy(�ybյ�#5,���E	��V{<d\��"��;E�g�G���Q�G�����t�近f�FkƗ4)�k~�I�#��2%����au>�͝��68i��0/t�� �o?���O���0=��%xsC����R.
�*[�~�C�:f&��4�BC��e��x?��kߡ8�&G�ʾ�/��_3��@�(�E��Q��ү�ѵe4M�Ku�'ӭ�Ho��C�.��#�<H���|ӳ���x��2��Ǫ��.9k�'��V�(� W�=��ܽt?#�@���R#���!�m�ǹ�.��h3����DbWgZ���9�b���M���V[1�:
G����H��M�� 0F�&2�Jf��I>`$��dY��>6AH5k-�4���\�|F��{:a]�z�������e����@5�'��6��i�݀TʡLO�H��R&�
}/% ����ʜ&�,�A�5O��C����h���ߜpiL�i�=���yz.���;a����ĵ�y�ܕr�Ыڇ�֠�D-c�+bXQ�[�˾iT
D��� �@(h�����P-����&U���'��b��î�+?��ӳɣ��Y��b�L��Y�X����+���KhF��� ^p��X��b��mN)Y��ɴ�̩����|��-�Qp�0��X����]��~�i	��,Z|���8r=h����Ԑ9T�+t�a5^�[�!�_�
                    "additionalProperties": {
                        "type": "string"
                    }
                },
                "hitFilter": {
                    "type": "object",
                    "additionalProperties": false
                }
            },
            "additionalProperties": false
        },
        "RuntimeCaching": {
            "type": "object",
            "properties": {
                "handler": {
                    "description": "This determines how the runtime route will generate a response.\nTo use one of the built-in {@link workbox-strategies}, provide its name,\nlike `'NetworkFirst'`.\nAlternatively, this can be a {@link workbox-core.RouteHandler} callback\nfunction with custom response logic.",
                    "anyOf": [
                        {
                            "$ref": "#/definitions/RouteHandlerCallback"
                        },
                        {
                            "$ref": "#/definitions/RouteHandlerObject"
                        },
                        {
                            "enum": [
                                "CacheFirst",
                                "CacheOnly",
                                "NetworkFirst",
                                "NetworkOnly",
                                "StaleWhileRevalidate"
                            ],
                            "type": "string"
                        }
                    ]
                },
                "method": {
                    "description": "The HTTP method to match against. The default value of `'GET'` is normally\nsufficient, unless you explicitly need to match `'POST'`, `'PUT'`, or\nanother type of request.",
                    "default": "GET",
                    "enum": [
                        "DELETE",
                        "GET",
                        "HEAD",
                        "PATCH",
                        "POST",
                        "PUT"
                    ],
                    "type": "string"
                },
                "options": {
                    "type": "object",
                    "properties": {
                        "backgroundSync": {
                            "description": "Configuring this will add a\n{@link workbox-background-sync.BackgroundSyncPlugin} instance to the\n{@link workbox-strategies} configured in `handler`.",
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "options": {
                                    "$ref": "#/definitions/QueueOptions"
                                }
                            },
                            "additionalProperties": false,
                            "required": [
                                "name"
                            ]
                        },
                        "broadcastUpdate": {
                            "description": "Configuring this will add a\n{@link workbox-broadcast-update.BroadcastUpdatePlugin} instance to the\n{@link workbox-strategies} configured in `handler`.",
                            "type": "object",
                            "properties": {
                                "channelName": {
                                    "type": "string"
                                },
                                "options": {
                                    "$ref": "#/definitions/BroadcastCacheUpdateOptions"
                                }
                            },
                            "additionalProperties": false,
                            "required": [
                                "options"
                            ]
                        },
                        "cacheableResponse": {
                            "description": "Configuring this will add a\n{@link workbox-cacheable-response.CacheableResponsePlugin} instance to\nthe {@link workbox-strategies} configured in `handler`.",
                            "$ref": "#/definitions/CacheableResponseOptions"
                        },
                        "cacheName": {
                            "description": "If provided, this will set the `cacheName` property of the\n{@link workbox-strategies} configured in `handler`.",
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "expiration": {
                            "description": "Configuring this will add a\n{@link workbox-expiration.ExpirationPlugin} instance to\nthe {@link workbox-strategies} configured in `handler`.",
                            "$ref": "#/definitions/ExpirationPluginOptions"
                        },
                        "networkTimeoutSeconds": {
                            "description": "If provided, this will set the `networkTimeoutSeconds` property of the\n{@link workbox-strategies} configured in `handler`. Note that only\n`'NetworkFirst'` and `'NetworkOnly'` support `networkTimeoutSeconds`.",
                            "type": "number"
                        },
                        "plugins": {
                            "description": "Configuring this allows the use of one or more Workbox plugins that\ndon't have \"shortcut\" options (like `expiration` for\n{@link workbox-expiration.ExpirationPlugin}). The plugins provided here\nwill be added to the {@link workbox-strategies} configured in `handler`.",
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/WorkboxPlugin"
                            }
                        },
                        "precacheFallback": {
                            "description": "Configuring this will add a\n{@link workbox-precaching.PrecacheFallbackPlugin} instance to\nthe {@link workbox-strategies} configured in `handler`.",
                            "type": "object",
                            "properties": {
                                "fallbackURL": {
                                    "type": "string"
                                }
                            },
                            "additionalProperties": false,
                            "required": [
                                "fallbackURL"
                            ]
                        },
                        "rangeRequests": {
                            "description": "Enabling this will add a\n{@link workbox-range-requests.RangeRequestsPlugin} instance to\nthe {@link workbox-strategies} configured in `handler`.",
                            "type": "boolean"
                        },
                        "fetchOptions": {
                            "description": "Configuring this will pass along the `fetchOptions` value to\nthe {@link workbox-strategies} configured in `handler`.",
                            "$ref": "#/definitions/RequestInit"
                        },
                        "matchOptions": {
                            "description": "Configuring this will pass along the `matchOptions` value to\nthe {@link workbox-strategies} configured in `handler`.",
                            "$ref": "#/definitions/CacheQueryOptions"
                        }
                    },
                    "additionalProperties": false
                },
                "urlPattern": {
                    "description": "This match criteria determines whether the configured handler will\ngenerate a response for any requests that don't match one of the precached\nURLs. If multiple `RuntimeCaching` routes are defined, then the first one\nwhose `urlPattern` matches will be the one that responds.\n\nThis value directly maps to the first parameter passed to\n{@link workbox-routing.registerRoute}. It's recommended to use a\n{@link workbox-core.RouteMatchCallback} function for greatest flexibility.",
                    "anyOf": [
                        {
                            "$ref": "#/definitions/RegExp"
                        },
                        {
                            "$ref": "#/definitions/RouteMatchCallback"
                        },
                        {
                            "type": "string"
                        }
                    ]
                }
            },
            "additionalProperties": false,
            "required": [
                "handler",
                "urlPattern"
            ]
        },
        "RouteHandlerCallback": {},
        "RouteHandlerObject": {
            "description": "An object with a `handle` method of type `RouteHandlerCallback`.\n\nA `Route` object can be created with either an `RouteHandlerCallback`\nfunction or this `RouteHandler` object. The benefit of the `RouteHandler`\nis it can be extended (as is done by the `workbox-strategies` package).",
            "type": "object",
            "properties": {
                "handle": {
                    "$ref": "#/definitions/RouteHandlerCallback"
                }
            },
            "additionalProperties": false,
            "required": [
                "handle"
            ]
        },
        "QueueOptions": {
            "type": "object",
            "properties": {
                "forceSyncFallback": {
                    "type": "boolean"
                },
                "maxRetentionTime": {
                    "type": "number"
                },
                "onSync": {
                    "$ref": "#/definitions/OnSyncCallback"
                }
            },
            "additionalProperties": false
        },
        "OnSyncCallback": {},
        "BroadcastCacheUpdateOptions": {
            "type": "object",
            "properties": {
                "headersToCheck": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "generatePayload": {
                    "type": "object",
                    "additionalProperties": false
                },
                "notifyAllClients": {
                    "type": "boolean"
                }
            },
            "additionalProperties": false
        },
        "CacheableResponseOptions": {
            "type": "object",
            "properties": {
                "statuses": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    }
                },
                "headers": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "string"
                    }
                }
            },
            "additionalProperties": false
        },
        "ExpirationPluginOptions": {
            "type": "object",
            "properties": {
                "maxEntries": {
                    "type": "number"
                },
                "maxAgeSeconds": {
                    "type": "number"
                },
                "matchOptions": {
                    "$ref": "#/definitions/CacheQueryOptions"
                },
                "purgeOnQuotaError": {
                    "type": "boolean"
                }
            },
            "additionalProperties": false
        },
        "CacheQueryOptions": {
            "type": "object",
            "properties": {
                "ignoreMethod": {
                    "type": "boolean"
                },
                "ignoreSearch": {
                    "type": "boolean"
                },
                "ignoreVary": {
                    "type": "boolean"
                }
            },
            "additionalProperties": false
        },
        "WorkboxPlugin": {
            "description": "An object with optional lifecycle callback properties for the fetch and\ncache operations.",
            "type": "object",
            "properties": {
                "cacheDidUpdate": {},
                "cachedResponseWillBeUsed": {},
                "cacheKeyWillBeUsed": {},
                "cacheWillUpdate": {},
                "fetchDidFail": {},
                "fetchDidSucceed": {},
                "handlerDidComplete": {},
                "handlerDidError": {},
                "handlerDidRespond": {},
                "handlerWillRespond": {},
                "handlerWillStart": {},
                "requestWillFetch": {}
            },
            "additionalProperties": false
        },
        "CacheDidUpdateCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "CachedResponseWillBeUsedCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "CacheKeyWillBeUsedCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "CacheWillUpdateCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "FetchDidFailCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "FetchDidSucceedCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "HandlerDidCompleteCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "HandlerDidErrorCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "HandlerDidRespondCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "HandlerWillRespondCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "HandlerWillStartCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "RequestWillFetchCallback": {
            "type": "object",
            "additionalProperties": false
        },
        "RequestInit": {
            "type": "object",
            "properties": {
                "body": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/ArrayBuffer"
                        },
                        {
                            "$ref": "#/definitions/ArrayBufferView"
                        },
                        {
                            "$ref": "#/definitions/ReadableStream<any>"
                        },
                        {
                            "$ref": "#/definitions/Blob"
                        },
                        {
                            "$ref": "#/definitions/FormData"
                        },
                        {
                            "$ref": "#/definitions/URLSearchParams"
                        },
                        {
                            "type": [
                                "null",
                                "string"
                            ]
                        }
                    ]
                },
                "cache": {
                    "enum": [
                        "default",
                        "force-cache",
                        "no-cache",
                        "no-store",
                        "only-if-cached",
                        "reload"
                    ],
                    "type": "string"
                },
                "credentials": {
                    "enum": [
                        "include",
                        "omit",
                        "same-origin"
                    ],
                    "type": "string"
                },
                "headers": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/Record<string,string>"
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "array",
                                "items": [
                                    {
                                       'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function getEmptyBlockRange(tokens, index) {
  var token = tokens[index];
  var nextToken = tokens[index + 1];
  var prevToken = tokens[index - 1];
  var start = token.range[0];
  var end = nextToken.range[1];

  // Remove block tokens and the previous comma
  if (prevToken.value === ',' || prevToken.value === 'type' || prevToken.value === 'typeof') {
    start = prevToken.range[0];
  }

  return [start, end];
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid empty named import blocks.',
      url: (0, _docsUrl2['default'])('no-empty-named-blocks') },

    fixable: 'code',
    schema: [],
    hasSuggestions: true },


  create: function () {function create(context) {
      var importsWithoutNameds = [];

      return {
        ImportDeclaration: function () {function ImportDeclaration(node) {
            if (!node.specifiers.some(function (x) {return x.type === 'ImportSpecifier';})) {
              importsWithoutNameds.push(node);
            }
          }return ImportDeclaration;}(),

        'Program:exit': function () {function ProgramExit(program) {
            var importsTokens = importsWithoutNameds.map(function (node) {return [node, program.tokens.filter(function (x) {return x.range[0] >= node.range[0] && x.range[1] <= node.range[1];})];});

            importsTokens.forEach(function (_ref) {var _ref2 = _slicedToArray(_ref, 2),node = _ref2[0],tokens = _ref2[1];
              tokens.forEach(function (token) {
                var idx = program.tokens.indexOf(token);
                var nextToken = program.tokens[idx + 1];

                if (nextToken && token.value === '{' && nextToken.value === '}') {
                  var hasOtherIdentifiers = tokens.some(function (token) {return token.type === 'Identifier' &&
                    token.value !== 'from' &&
                    token.value !== 'type' &&
                    token.value !== 'typeof';});


                  // If it has no other identifiers it's the only thing in the import, so we can either remove the import
                  // completely or transform it in a side-effects only import
                  if (!hasOtherIdentifiers) {
                    context.report({
                      node: node,
                      message: 'Unexpected empty named import block',
                      suggest: [
                      {
                        desc: 'Remove unused import',
                        fix: function () {function fix(fixer) {
                            // Remove the whole import
                            return fixer.remove(node);
                          }return fix;}() },

                      {
                        desc: 'Remove empty import block',
                        fix: function () {function fix(fixer) {
                            // Remove the empty block and the 'from' token, leaving the import only for its side
                            // effects, e.g. `import 'mod'`
                            var sourceCode = context.getSourceCode();
                            var fromToken = program.tokens.find(function (t) {return t.value === 'from';});
                            var importToken = program.tokens.find(function (t) {return t.value === 'import';});
                            var hasSpaceAfterFrom = sourceCode.isSpaceBetween(fromToken, sourceCode.getTokenAfter(fromToken));
                            var hasSpaceAfterImport = sourceCode.isSpaceBetween(importToken, sourceCode.getTokenAfter(fromToken));var _getEmptyBlockRange =

                            getEmptyBlockRange(program.tokens, idx),_getEmptyBlockRange2 = _slicedToArray(_getEmptyBlockRange, 1),start = _getEmptyBlockRange2[0];var _fromToken$range = _slicedToArray(
                            fromToken.range, 2),end = _fromToken$range[1];
                            var range = [start, hasSpaceAfterFrom ? end + 1 : end];

                            return fixer.replaceTextRange(range, hasSpaceAfterImport ? '' : ' ');
                          }return fix;}() }] });



                  } else {
                    context.report({
                      node: node,
                      message: 'Unexpected empty named import block',
                      fix: function () {function fix(fixer) {
                          return fixer.removeRange(getEmptyBlockRange(program.tokens, idx));
                        }return fix;}() });

                  }
                }
              });
            });
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1lbXB0eS1uYW1lZC1ibG9ja3MuanMiXSwibmFtZXMiOlsiZ2V0RW1wdHlCbG9ja1JhbmdlIiwidG9rZW5zIiwiaW5kZXgiLCJ0b2tlbiIsIm5leHRUb2tlbiIsInByZXZUb2tlbiIsInN0YXJ0IiwicmFuZ2UiLCJlbmQiLCJ2YWx1ZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsImhhc1N1Z2dlc3Rpb25zIiwiY3JlYXRlIiwiY29udGV4dCIsImltcG9ydHNXaXRob3V0TmFtZWRzIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJub2RlIiwic3BlY2lmaWVycyIsInNvbWUiLCJ4IiwicHVzaCIsInByb2dyYW0iLCJpbXBvcnRzVG9rZW5zIiwibWFwIiwiZmlsdGVyIiwiZm9yRWFjaCIsImlkeCIsImluZGV4T2YiLCJoYXNPdGhlcklkZW50aWZpZXJzIiwicmVwb3J0IiwibWVzc2FnZSIsInN1Z2dlc3QiLCJkZXNjIiwiZml4IiwiZml4ZXIiLCJyZW1vdmUiLCJzb3VyY2VDb2RlIiwiZ2V0U291cmNlQ29kZSIsImZyb21Ub2tlbiIsImZpbmQiLCJ0IiwiaW1wb3J0VG9rZW4iLCJoYXNTcGFjZUFmdGVyRnJvbSIsImlzU3BhY2VCZXR3ZWVuIiwiZ2V0VG9rZW5BZnRlciIsImhhc1NwYWNlQWZ0ZXJJbXBvcnQiLCJyZXBsYWNlVGV4dFJhbmdlIiwicmVtb3ZlUmFuZ2UiXSwibWFwcGluZ3MiOiJxb0JBQUEscUM7O0FBRUEsU0FBU0Esa0JBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DQyxLQUFwQyxFQUEyQztBQUN6QyxNQUFNQyxRQUFRRixPQUFPQyxLQUFQLENBQWQ7QUFDQSxNQUFNRSxZQUFZSCxPQUFPQyxRQUFRLENBQWYsQ0FBbEI7QUFDQSxNQUFNRyxZQUFZSixPQUFPQyxRQUFRLENBQWYsQ0FBbEI7QUFDQSxNQUFJSSxRQUFRSCxNQUFNSSxLQUFOLENBQVksQ0FBWixDQUFaO0FBQ0EsTUFBTUMsTUFBTUosVUFBVUcsS0FBVixDQUFnQixDQUFoQixDQUFaOztBQUVBO0FBQ0EsTUFBSUYsVUFBVUksS0FBVixLQUFvQixHQUFwQixJQUEyQkosVUFBVUksS0FBVixLQUFvQixNQUEvQyxJQUF5REosVUFBVUksS0FBVixLQUFvQixRQUFqRixFQUEyRjtBQUN6RkgsWUFBUUQsVUFBVUUsS0FBVixDQUFnQixDQUFoQixDQUFSO0FBQ0Q7O0FBRUQsU0FBTyxDQUFDRCxLQUFELEVBQVFFLEdBQVIsQ0FBUDtBQUNEOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsa0JBRE47QUFFSkMsbUJBQWEsbUNBRlQ7QUFHSkMsV0FBSywwQkFBUSx1QkFBUixDQUhELEVBRkY7O0FBT0pDLGFBQVMsTUFQTDtBQVFKQyxZQUFRLEVBUko7QUFTSkMsb0JBQWdCLElBVFosRUFEUzs7O0FBYWZDLFFBYmUsK0JBYVJDLE9BYlEsRUFhQztBQUNkLFVBQU1DLHVCQUF1QixFQUE3Qjs7QUFFQSxhQUFPO0FBQ0xDLHlCQURLLDBDQUNhQyxJQURiLEVBQ21CO0FBQ3RCLGdCQUFJLENBQUNBLEtBQUtDLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCLFVBQUNDLENBQUQsVUFBT0EsRUFBRWYsSUFBRixLQUFXLGlCQUFsQixFQUFyQixDQUFMLEVBQWdFO0FBQzlEVSxtQ0FBcUJNLElBQXJCLENBQTBCSixJQUExQjtBQUNEO0FBQ0YsV0FMSTs7QUFPTCxzQkFQSyxvQ0FPVUssT0FQVixFQU9tQjtBQUN0QixnQkFBTUMsZ0JBQWdCUixxQkFBcUJTLEdBQXJCLENBQXlCLFVBQUNQLElBQUQsVUFBVSxDQUFDQSxJQUFELEVBQU9LLFFBQVE3QixNQUFSLENBQWVnQyxNQUFmLENBQXNCLFVBQUNMLENBQUQsVUFBT0EsRUFBRXJCLEtBQUYsQ0FBUSxDQUFSLEtBQWNrQixLQUFLbEIsS0FBTCxDQUFXLENBQVgsQ0FBZCxJQUErQnFCLEVBQUVyQixLQUFGLENBQVEsQ0FBUixLQUFja0IsS0FBS2xCLEtBQUwsQ0FBVyxDQUFYLENBQXBELEVBQXRCLENBQVAsQ0FBVixFQUF6QixDQUF0Qjs7QUFFQXdCLDBCQUFjRyxPQUFkLENBQXNCLGdCQUFvQixxQ0FBbEJULElBQWtCLFlBQVp4QixNQUFZO0FBQ3hDQSxxQkFBT2lDLE9BQVAsQ0FBZSxVQUFDL0IsS0FBRCxFQUFXO0FBQ3hCLG9CQUFNZ0MsTUFBTUwsUUFBUTdCLE1BQVIsQ0FBZW1DLE9BQWYsQ0FBdUJqQyxLQUF2QixDQUFaO0FBQ0Esb0JBQU1DLFlBQVkwQixRQUFRN0IsTUFBUixDQUFla0MsTUFBTSxDQUFyQixDQUFsQjs7QUFFQSxvQkFBSS9CLGFBQWFELE1BQU1NLEtBQU4sS0FBZ0IsR0FBN0IsSUFBb0NMLFVBQVVLLEtBQVYsS0FBb0IsR0FBNUQsRUFBaUU7QUFDL0Qsc0JBQU00QixzQkFBc0JwQyxPQUFPMEIsSUFBUCxDQUFZLFVBQUN4QixLQUFELFVBQVdBLE1BQU1VLElBQU4sS0FBZSxZQUFmO0FBQzVDViwwQkFBTU0sS0FBTixLQUFnQixNQUQ0QjtBQUU1Q04sMEJBQU1NLEtBQU4sS0FBZ0IsTUFGNEI7QUFHNUNOLDBCQUFNTSxLQUFOLEtBQWdCLFFBSGlCLEVBQVosQ0FBNUI7OztBQU1BO0FBQ0E7QUFDQSxzQkFBSSxDQUFDNEIsbUJBQUwsRUFBMEI7QUFDeEJmLDRCQUFRZ0IsTUFBUixDQUFlO0FBQ2JiLGdDQURhO0FBRWJjLCtCQUFTLHFDQUZJO0FBR2JDLCtCQUFTO0FBQ1A7QUFDRUMsOEJBQU0sc0JBRFI7QUFFRUMsMkJBRkYsNEJBRU1DLEtBRk4sRUFFYTtBQUNUO0FBQ0EsbUNBQU9BLE1BQU1DLE1BQU4sQ0FBYW5CLElBQWIsQ0FBUDtBQUNELDJCQUxILGdCQURPOztBQVFQO0FBQ0VnQiw4QkFBTSwyQkFEUjtBQUVFQywyQkFGRiw0QkFFTUMsS0FGTixFQUVhO0FBQ1Q7QUFDQTtBQUNBLGdDQUFNRSxhQUFhdkIsUUFBUXdCLGFBQVIsRUFBbkI7QUFDQSxnQ0FBTUMsWUFBWWpCLFFBQVE3QixNQUFSLENBQWUrQyxJQUFmLENBQW9CLFVBQUNDLENBQUQsVUFBT0EsRUFBRXhDLEtBQUYsS0FBWSxNQUFuQixFQUFwQixDQUFsQjtBQUNBLGdDQUFNeUMsY0FBY3BCLFFBQVE3QixNQUFSLENBQWUrQyxJQUFmLENBQW9CLFVBQUNDLENBQUQsVUFBT0EsRUFBRXhDLEtBQUYsS0FBWSxRQUFuQixFQUFwQixDQUFwQjtBQUNBLGdDQUFNMEMsb0JBQW9CTixXQUFXTyxjQUFYLENBQTBCTCxTQUExQixFQUFxQ0YsV0FBV1EsYUFBWCxDQUF5Qk4sU0FBekIsQ0FBckMsQ0FBMUI7QUFDQSxnQ0FBTU8sc0JBQXNCVCxXQUFXTyxjQUFYLENBQTBCRixXQUExQixFQUF1Q0wsV0FBV1EsYUFBWCxDQUF5Qk4sU0FBekIsQ0FBdkMsQ0FBNUIsQ0FQUzs7QUFTTy9DLCtDQUFtQjhCLFFBQVE3QixNQUEzQixFQUFtQ2tDLEdBQW5DLENBVFAsK0RBU0Y3QixLQVRFO0FBVU95QyxzQ0FBVXhDLEtBVmpCLEtBVUFDLEdBVkE7QUFXVCxnQ0FBTUQsUUFBUSxDQUFDRCxLQUFELEVBQVE2QyxvQkFBb0IzQyxNQUFNLENBQTFCLEdBQThCQSxHQUF0QyxDQUFkOztBQUVBLG1DQUFPbUMsTUFBTVksZ0JBQU4sQ0FBdUJoRCxLQUF2QixFQUE4QitDLHNCQUFzQixFQUF0QixHQUEyQixHQUF6RCxDQUFQO0FBQ0QsMkJBaEJILGdCQVJPLENBSEksRUFBZjs7OztBQStCRCxtQkFoQ0QsTUFnQ087QUFDTGhDLDRCQUFRZ0IsTUFBUixDQUFlO0FBQ2JiLGdDQURhO0FBRWJjLCtCQUFTLHFDQUZJO0FBR2JHLHlCQUhhLDRCQUdUQyxLQUhTLEVBR0Y7QUFDVCxpQ0FBT0EsTUFBTWEsV0FBTixDQUFrQnhELG1CQUFtQjhCLFFBQVE3QixNQUEzQixFQUFtQ2tDLEdBQW5DLENBQWxCLENBQVA7QUFDRCx5QkFMWSxnQkFBZjs7QUFPRDtBQUNGO0FBQ0YsZUF2REQ7QUF3REQsYUF6REQ7QUEwREQsV0FwRUksd0JBQVA7O0FBc0VELEtBdEZjLG1CQUFqQiIsImZpbGUiOiJuby1lbXB0eS1uYW1lZC1ibG9ja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gZ2V0RW1wdHlCbG9ja1JhbmdlKHRva2VucywgaW5kZXgpIHtcbiAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaW5kZXhdO1xuICBjb25zdCBuZXh0VG9rZW4gPSB0b2tlbnNbaW5kZXggKyAxXTtcbiAgY29uc3QgcHJldlRva2VuID0gdG9rZW5zW2luZGV4IC0gMV07XG4gIGxldCBzdGFydCA9IHRva2VuLnJhbmdlWzBdO1xuICBjb25zdCBlbmQgPSBuZXh0VG9rZW4ucmFuZ2VbMV07XG5cbiAgLy8gUmVtb3ZlIGJsb2NrIHRva2VucyBhbmQgdGhlIHByZXZpb3VzIGNvbW1hXG4gIGlmIChwcmV2VG9rZW4udmFsdWUgPT09ICcsJyB8fCBwcmV2VG9rZW4udmFsdWUgPT09ICd0eXBlJyB8fCBwcmV2VG9rZW4udmFsdWUgPT09ICd0eXBlb2YnKSB7XG4gICAgc3RhcnQgPSBwcmV2VG9rZW4ucmFuZ2VbMF07XG4gIH1cblxuICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ0hlbHBmdWwgd2FybmluZ3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgZW1wdHkgbmFtZWQgaW1wb3J0IGJsb2Nrcy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1lbXB0eS1uYW1lZC1ibG9ja3MnKSxcbiAgICB9LFxuICAgIGZpeGFibGU6ICdjb2RlJyxcbiAgICBzY2hlbWE6IFtdLFxuICAgIGhhc1N1Z2dlc3Rpb25zOiB0cnVlLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3QgaW1wb3J0c1dpdGhvdXROYW1lZHMgPSBbXTtcblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIGlmICghbm9kZS5zcGVjaWZpZXJzLnNvbWUoKHgpID0+IHgudHlwZSA9PT0gJ0ltcG9ydFNwZWNpZmllcicpKSB7XG4gICAgICAgICAgaW1wb3J0c1dpdGhvdXROYW1lZHMucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ1Byb2dyYW06ZXhpdCcocHJvZ3JhbSkge1xuICAgICAgICBjb25zdCBpbXBvcnRzVG9rZW5zID0gaW1wb3J0c1dpdGhvdXROYW1lZHMubWFwKChub2RlKSA9PiBbbm9kZSwgcHJvZ3JhbS50b2tlbnMuZmlsdGVyKCh4KSA9PiB4LnJhbmdlWzBdID49IG5vZGUucmFuZ2VbMF0gJiYgeC5yYW5nZVsxXSA8PSBub2RlLnJhbmdlWzFdKV0pO1xuXG4gICAgICAgIGltcG9ydHNUb2tlbnMuZm9yRWFjaCgoW25vZGUsIHRva2Vuc10pID0+IHtcbiAgICAgICAgICB0b2tlbnMuZm9yRWFjaCgodG9rZW4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHByb2dyYW0udG9rZW5zLmluZGV4T2YodG9rZW4pO1xuICAgICAgICAgICAgY29uc3QgbmV4dFRva2VuID0gcHJvZ3JhbS50b2tlbnNbaWR4ICsgMV07XG5cbiAgICAgICAgICAgIGlmIChuZXh0VG9rZW4gJiYgdG9rZW4udmFsdWUgPT09ICd7JyAmJiBuZXh0VG9rZW4udmFsdWUgPT09ICd9Jykge1xuICAgICAgICAgICAgICBjb25zdCBoYXNPdGhlcklkZW50aWZpZXJzID0gdG9rZW5zLnNvbWUoKHRva2VuKSA9PiB0b2tlbi50eXBlID09PSAnSWRlbnRpZmllcidcbiAgICAgICAgICAgICAgICAgICYmIHRva2VuLnZhbHVlICE9PSAnZnJvbSdcbiAgICAgICAgICAgICAgICAgICYmIHRva2VuLnZhbHVlICE9PSAndHlwZSdcbiAgICAgICAgICAgICAgICAgICYmIHRva2VuLnZhbHVlICE9PSAndHlwZW9mJyxcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAvLyBJZiBpdCBoYXMgbm8gb3RoZXIgaWRlbnRpZmllcnMgaXQncyB0aGUgb25seSB0aGluZyBpbiB0aGUgaW1wb3J0LCBzbyB3ZSBjYW4gZWl0aGVyIHJlbW92ZSB0aGUgaW1wb3J0XG4gICAgICAgICAgICAgIC8vIGNvbXBsZXRlbHkgb3IgdHJhbnNmb3JtIGl0IGluIGEgc2lkZS1lZmZlY3RzIG9ubHkgaW1wb3J0XG4gICAgICAgICAgICAgIGlmICghaGFzT3RoZXJJZGVudGlmaWVycykge1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5leHBlY3RlZCBlbXB0eSBuYW1lZCBpbXBvcnQgYmxvY2snLFxuICAgICAgICAgICAgICAgICAgc3VnZ2VzdDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgZGVzYzogJ1JlbW92ZSB1bnVzZWQgaW1wb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICBmaXgoZml4ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgd2hvbGUgaW1wb3J0XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZml4ZXIucmVtb3ZlKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBkZXNjOiAnUmVtb3ZlIGVtcHR5IGltcG9ydCBibG9jaycsXG4gICAgICAgICAgICAgICAgICAgICAgZml4KGZpeGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGVtcHR5IGJsb2NrIGFuZCB0aGUgJ2Zyb20nIHRva2VuLCBsZWF2aW5nIHRoZSBpbXBvcnQgb25seSBmb3IgaXRzIHNpZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVmZmVjdHMsIGUuZy4gYGltcG9ydCAnbW9kJ2BcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZUNvZGUgPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb21Ub2tlbiA9IHByb2dyYW0udG9rZW5zLmZpbmQoKHQpID0+IHQudmFsdWUgPT09ICdmcm9tJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnRUb2tlbiA9IHByb2dyYW0udG9rZW5zLmZpbmQoKHQpID0+IHQudmFsdWUgPT09ICdpbXBvcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc1NwYWNlQWZ0ZXJGcm9tID0gc291cmNlQ29kZS5pc1NwYWNlQmV0d2Vlbihmcm9tVG9rZW4sIHNvdXJjZUNvZGUuZ2V0VG9rZW5BZnRlcihmcm9tVG9rZW4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc1NwYWNlQWZ0ZXJJbXBvcnQgPSBzb3VyY2VDb2RlLmlzU3BhY2VCZXR3ZWVuKGltcG9ydFRva2VuLCBzb3VyY2VDb2RlLmdldFRva2VuQWZ0ZXIoZnJvbVRva2VuKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtzdGFydF0gPSBnZXRFbXB0eUJsb2NrUmFuZ2UocHJvZ3JhbS50b2tlbnMsIGlkeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbLCBlbmRdID0gZnJvbVRva2VuLnJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSBbc3RhcnQsIGhhc1NwYWNlQWZ0ZXJGcm9tID8gZW5kICsgMSA6IGVuZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaXhlci5yZXBsYWNlVGV4dFJhbmdlKHJhbmdlLCBoYXNTcGFjZUFmdGVySW1wb3J0ID8gJycgOiAnICcpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5leHBlY3RlZCBlbXB0eSBuYW1lZCBpbXBvcnQgYmxvY2snLFxuICAgICAgICAgICAgICAgICAgZml4KGZpeGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmaXhlci5yZW1vdmVSYW5nZShnZXRFbXB0eUJsb2NrUmFuZ2UocHJvZ3JhbS50b2tlbnMsIGlkeCkpO1xuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=                                                                            ����.=L+��q��l5�F��\\`KT@��N(�r\�k��42{���W�z]���l�I[՚G�D[P&�C������%j��K\���ҙYD8R�x��}(ƍf����t�" �t�6>���fר��5R�5���Ǌd�&<�g�kX����7�/6@+��^�z<�i�72��_X��i�x�Wdn��LJ���[٤�Ϻt����x���u�5  �O�ƛ��)�dz���Xu{Zǲ�ؼ 'E8:�� 9J�6]��s��(0��H�3�2��X�2c�Q�т��{h�%59�y݀�\L]�  ��(@K�@9��V6k����UȌ8�o��a%�Xk��խi�o��~�U�v�e������맯s�dL|�l�ig$�b�;]c�|_6�i%�������v������b8�fB�jQɗ0�

// do NOT remove this file - it would break pre-compiled schemas
// https://github.com/ajv-validator/ajv/issues/889
module.exports = require('fast-deep-equal');
                                                                                                                                                                                                                                                                                                                                                �m%9*ɞ�T�s��f�!,��j��
��\��Ԁx*���S���4l%7�SG�kneRؾY$82y�����!�h|�2�'L��l�2*�[��el��_�6Z��T�� ����L�|�G� "\:-T�����}��tF�Kf S�ǥ�*�y0�w�|p�F���������s�iI��Ddǌ�K���w�{Y-k�m�Ϗtd�������dT=�����j���jST�h���.�g*�ɛ%s��'�Ot��*�
3(b��ЏNu�_By �{�=�+�&�p�9�Po��W��&�`����"�8��/^�_��Q�o�<ߐ7�n�h*������K0,�ˎ�k�HQ-��R�%!Nݍ)!�D��m�U����Ɩ�.�Zk��Q'yW#�ϫz�ȗ<�}d����
6��0l7�q]V�m��1��yd0���p3w��x��
�M?p�
й�ɨ�Uwa��X߼� \Lՙ���G8������J�W�&����WOj?��J�v�%4���{G��V��� ��s�s�,���7���t`����_�3��;���u��0E���
L�yVG�n���R����F��TE�H�>c_���@�� =�W��p��W����%�5h��	K����r.�3F�  nЂ�}RF��	g!�����a��9�)?�lQY����쵞���� J컫ÏJ���W��M��?ɵKҶ�e~�)*�
��U,nQ<��an���Q�i/�B��VT6��X�U�H�K��kV6�Kv\���HD�;�6L��y%4.W�:|��6V;�n��E
<�v�X�q������B
�B'���s�5<2p3.�y�# �6�r�����K$�%�ƫ����CU��{Q��1��~ޝi{�vڦ-E��5h� !n�Fl�c�~QE_�6�Y!��Τ���P��X��ؠY�c_� A�����A�S���Q������栨�蓦��,�v�V���.<tަDP����C���,p��N�����.M]��6z�2�h�<�O�y�2��Ib2η:�de���5��I�ҫf�Br�Se��
Gfv��b�c�&�S�;�
��o
�����I��K��������ed��f���>C����C$$���ҋq�h��t!�=l9�����
:*��+���	�0��Zs� `hNv�T���m���0H˵�	&��AC̒�-R�0s�;Ck�nGh��k%-Ψ-�gF��M����7��7���l6�PSWqzj^�EDڄ��L��� �t�bo��2+���	iٟ��̔��Q5�zU&j���'v�K\茱%Kܦ�j6aVw� ���@�s�����*:6f�o(�%@��p0`&B��\Mrg��NF:9[��0E�O*�i�K��C<���o)��O(�bu.��$���֊�����B��O1�ǭ۔�ū��k����;J���Y����-
�����`t�BmϱY��UU@�E�5q<"�p�x�~`��S�$0�+B�2�<A	�N�-�zt�̙DH1���n��WK�vI	\�`�b��~
�;b����c	�ky%��\���t�&�q�V�E�9��Mg�,/~4���h����5�7ц�AY��MP.N��(�âl�l�g������`х����B��E�*����Xܡ�X�U�R�s��<�B�mH�$ �]�S�a��>uuL�r;��bz���_ӄ��h^��E*!`�I�v��r" T[y�]�����(A�&����F�����2���U����YG�#52D���kґU����0�����4�И<ʾ-�G,��#��$
�:����m��ݬvBl_"@\w~�Y���?$�ӎUt�ܮ7����]�rz�8����Y�L�_��N���d��^ T��'�,ˎԽ���)~�e#N����Y����Bc�
	�/X�\qA�|l��m�p�b�y;�g���hl�om]L�5GDN:L���g���S���*�������?�m�Er�����N��Q��+��`H.��e���!eG��B)����+�L	�	ᚒTBB�̫�wF�ƛÒ�a a2�u�d���D��A30�ಆ���D$���,"��  ,�*S�&������P�鹲3�d3Q�a�T��q�:�P��	�Z�[��:��HUPa�X�����Z���}�*��+�:%L*Iy��x����Ս*�I  )�i�a@�L���э����=�B4,P�#�9A8�߱:��˛/?� �%�$j��6��j�3S�1�PAB����V�s�o��#LaC���/�x�:��0lG���,ع,]L�x�[eZB�$MZl���h X]u�ҧ+Jy�xW&Z���9�1�-��2�b���G��4�HEIz�ɇ���S���$�	�4PZ�T!�9�U�Xm�̹�d��2  ̆�&S����En=Y��R�s��cl ,�O(��-�☦s���s��u���Jj�癁���"eD3r����t������Z���#0�.��J��֭;+2FO��$�&U�UB��J��W�N��Q���p��� ��O�[���X��S�n#+��LI�����k�$��%Qp��Y���nHׯ��������6X�w�(�rTR�f*LR�ߝD#�(�G�%�~�^�e���2yZ8�0�g���u��A�_Ȉ\l̶���;4�`g��+���3���Y��e��՘��²�:����qsz�XM�7& �Vfp�!�2)^bEi���u|��ث�3��
�M��<#�����X�!ʱhA�?]�IɆv��E��d�`;&j���{b��L���{D�ūي��c�9` e�T�9���̵