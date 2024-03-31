art;
        while (true) {
            annotatedNodes.push(node);
            switch (node.type) {
                case ExpressionStatement$1:
                case ChainExpression$1:
                    node = node.expression;
                    continue;
                case SequenceExpression$1:
                    // if there are parentheses, the annotation would apply to the entire expression
                    if (doesNotMatchOutsideComment(code.slice(parentStart, node.start), noWhitespace)) {
                        node = node.expressions[0];
                        continue;
                    }
                    invalidAnnotation = true;
                    break;
                case ConditionalExpression$1:
                    // if there are parentheses, the annotation would apply to the entire expression
                    if (doesNotMatchOutsideComment(code.slice(parentStart, node.start), noWhitespace)) {
                        node = node.test;
                        continue;
                    }
                    invalidAnnotation = true;
                    break;
                case LogicalExpression$1:
                case BinaryExpression$1:
                    // if there are parentheses, the annotation would apply to the entire expression
                    if (doesNotMatchOutsideComment(code.slice(parentStart, node.start), noWhitespace)) {
                        node = node.left;
                        continue;
                    }
                    invalidAnnotation = true;
                    break;
                case CallExpression$1:
                case NewExpression$1:
                    break;
                default:
                    invalidAnnotation = true;
            }
            break;
        }
    }
    else {
        invalidAnnotation = true;
    }
    if (invalidAnnotation) {
        annotateNode(node, comment, false);
    }
    else {
        for (const node of annotatedNodes) {
            annotateNode(node, comment, true);
        }
    }
}
function doesNotMatchOutsideComment(code, forbiddenChars) {
    let nextMatch;
    while ((nextMatch = forbiddenChars.exec(code)) !== null) {
        if (nextMatch[0] === '/') {
            const charCodeAfterSlash = code.charCodeAt(forbiddenChars.lastIndex);
            if (charCodeAfterSlash === 42 /*"*"*/) {
                forbiddenChars.lastIndex = code.indexOf('*/', forbiddenChars.lastIndex + 1) + 2;
                continue;
            }
            else if (charCodeAfterSlash === 47 /*"/"*/) {
                forbiddenChars.lastIndex = code.indexOf('\n', forbiddenChars.lastIndex + 1) + 1;
                continue;
            }
        }
        forbiddenChars.lastIndex = 0;
        return false;
    }
    return true;
}
const pureCommentRegex = /[@#]__PURE__/;
function addAnnotations(comments, esTreeAst, code) {
    const annotations = [];
    const sourceMappingComments = [];
    for (const comment of comments) {
        if (pureCommentRegex.test(comment.value)) {
            annotations.push(comment);
        }
        else if (SOURCEMAPPING_URL_RE.test(comment.value)) {
            sourceMappingComments.push(comment);
        }
    }
    for (const comment of sourceMappingComments) {
        annotateNode(esTreeAst, comment, false);
    }
    handlePureAnnotationsOfNode(esTreeAst, {
        annotationIndex: 0,
        annotations,
        code
    });
}
function annotateNode(node, comment, valid) {
    const key = valid ? ANNOTATION_KEY : INVALID_COMMENT_KEY;
    const property = node[key];
    if (property) {
        property.push(comment);
    }
    else {
        node[key] = [comment];
    }
}

const keys = {
    Literal: [],
    Program: ['body']
};
function getAndCreateKeys(esTreeNode) {
    keys[esTreeNode.type] = Object.keys(esTreeNode).filter(key => typeof esTreeNode[key] === 'object' && key.charCodeAt(0) !== 95 /* _ */);
    return keys[esTreeNode.type];
}

const INCLUDE_PARAMETERS = 'variables';
class NodeBase extends ExpressionEntity {
    constructor(esTreeNode, parent, parentScope) {
        super();
        /**
         * Nodes can apply custom deoptimizations once they become part of the
         * executed code. To do this, they must initialize this as false, implement
         * applyDeoptimizations and call this from include and hasEffects if they have
         * custom handlers
         */
        this.deoptimized = false;
        this.esTreeNode = esTreeNode;
        this.keys = keys[esTreeNode.type] || getAndCreateKeys(esTreeNode);
        this.parent = parent;
        this.context = parent.context;
        this.createScope(parentScope);
        this.parseNode(esTreeNode);
        this.initialise();
        this.context.magicString.addSourcemapLocation(this.start);
        this.context.magicString.addSourcemapLocation(this.end);
    }
    addExportedVariables(_variables, _exportNamesByVariable) { }
    /**
     * Override this to bind assignments to variables and do any initialisations that
     * require the scopes to be populated with variables.
     */
    bind() {
        for (const key of this.keys) {
            const value = this[key];
            if (value === null)
                continue;
            if (Array.isArray(value)) {
                for (const child of value) {
                    child === null || child === void 0 ? void 0 : child.bind();
                }
            }
            else {
                value.bind();
            }
        }
    }
    /**
     * Override if this node should receive a different scope than the parent scope.
     */
    createScope(parentScope) {
        this.scope = parentScope;
    }
    hasEffects(context) {
        if (!this.deoptimized)
            this.applyDeoptimizations();
        for (const key of this.keys) {
            const value = this[key];
            if (value === null)
                continue;
            if (Array.isArray(value)) {
                for (const child of value) {
                    if (child === null || child === void 0 ? void 0 : child.hasEffects(context))
                        return true;
                }
            }
            else if (value.hasEffects(context))
                return true;
        }
        return false;
    }
    hasEffectsAsAssignmentTarget(context, _checkAccess) {
        return (this.hasEffects(context) ||
            this.hasEffectsOnInteractionAtPath(EMPTY_PATH, this.assignmentInteraction, context));
    }
    include(context, includeChildrenRecursively, _options) {
        if (!this.deoptimized)
            this.applyDeoptimizations();
        this.included = true;
        for (const key of this.keys) {
            const value = this[key];
            if (value === null)
                continue;
            if (Array.isArray(value)) {
                for (const child of value) {
                    child === null || child === void 0 ? void 0 : child.include(context, includeChildrenRecursively);
                }
            }
            else {
                value.include(context, includeChildrenRecursively);
            }
        }
    }
    includeAsAssignmentTarget(context, includeChildrenRecursively, _deoptimizeAccess) {
        this.include(context, includeChildrenRecursively);
    }
    /**
     * Override to perform special initialisation steps after the scope is initialised
     */
    initialise() { }
    insertSemicolon(code) {
        if (code.original[this.end - 1] !== ';') {
            code.appendLeft(this.end, ';');
        }
    }
    parseNode(esTreeNode) {
        for (const [key, value] of Object.entries(esTreeNode)) {
            // That way, we can override this function to add custom initialisation and then call super.parseNode
            if (this.hasOwnProperty(key))
                continue;
            if (key.charCodeAt(0) === 95 /* _ */) {
                if (key === ANNOTATION_KEY) {
                    this.annotations = value;
                }
                else if (key === INVALID_COMMENT_KEY) {
                    for (const { start, end } of value)
                        this.context.magicString.remove(start, end);
                }
            }
            else if (typeof value !== 'object' || value === null) {
                this[key] = value;
            }
            else if (Array.isArray(value)) {
                this[key] = [];
                for (const child of value) {
                    this[key].push(child === null
                        ? null
                        : new (this.context.getNodeConstructor(child.type))(child, this, this.scope));
                }
            }
            else {
                this[key] = new (this.context.getNodeConstructor(value.type))(value, this, this.scope);
            }
        }
    }
    render(code, options) {
        for (const key of this.keys) {
            const value = this[key];
            if (value === null)
                continue;
            if (Array.isArray(value)) {
                for (const child of value) {
                    child === null || child === void 0 ? void 0 : child.render(code, options);
                }
            }
            else {
                value.render(code, options);
            }
        }
    }
    setAssignedValue(value) {
        this.assignmentInteraction = { args: [value], thisArg: null, type: INTERACTION_ASSIGNED };
    }
    shouldBeIncluded(context) {
        return this.included || (!context.brokenFlow && this.hasEffects(createHasEffectsContext()));
    }
    /**
     * Just deoptimize everything by default so that when e.g. we do not track
     * something properly, it is deoptimized.
     * @protected
     */
    applyDeoptimizations() {
        this.deoptimized = true;
        for (const key of this.keys) {
            const value = this[key];
            if (value === null)
                continue;
            if (Array.isArray(value)) {
                for (const child of value) {
                    child === null || child === void 0 ? void 0 : child.deoptimizePath(UNKNOWN_PATH);
                }
            }
            else {
                value.deoptimizePath(UNKNOWN_PATH);
            }
        }
        this.context.requestTreeshakingPass();
    }
}

class SpreadElement extends NodeBase {
    deoptimizeThisOnInteractionAtPath(interaction, path, recursionTracker) {
        if (path.length > 0) {
            this.argument.deoptimizeThisOnInteractionAtPath(interaction, [UnknownKey, ...path], recursionTracker);
        }
    }
    hasEffects(context) {
        if (!this.deoptimized)
            this.applyDeoptimizations();
        const { propertyReadSideEffects } = this.context.options
            .treeshake;
        return (this.argument.hasEffects(context) ||
            (propertyReadSideEffects &&
                (propertyReadSideEffects === 'always' ||
                    this.argument.hasEffectsOnInteractionAtPath(UNKNOWN_PATH, NODE_INTERACTION_UNKNOWN_ACCESS, context))));
    }
    applyDeoptimizations() {
        this.deoptimized = true;
        // Only properties of properties of the argument could become subject to reassignment
        // This will also reassign the return values of iterators
        this.argument.deoptimizePath([UnknownKey, UnknownKey]);
        this.context.requestTreeshakingPass();
    }
}

class Method extends ExpressionEntity {
    constructor(description) {
        super();
        this.description = description;
    }
    deoptimizeThisOnInteractionAtPath({ type, thisArg }, path) {
        if (type === INTERACTION_CALLED && path.length === 0 && this.description.mutatesSelfAsArray) {
            thisArg.deoptimizePath(UNKNOWN_INTEGER_PATH);
        }
    }
    getReturnExpressionWhenCalledAtPath(path, { thisArg }) {
        if (path.length > 0) {
            return UNKNOWN_EXPRESSION;
        }
        return (this.description.returnsPrimitive ||
            (this.description.returns === 'self'
                ? thisArg || UNKNOWN_EXPRESSION
                : this.description.returns()));
    }
    hasEffectsOnInteractionAtPath(path, interaction, context) {
        var _a, _b;
        const { type } = interaction;
        if (path.length > (type === INTERACTION_ACCESSED ? 1 : 0)) {
            return true;
        }
        if (type === INTERACTION_CALLED) {
            if (this.description.mutatesSelfAsArray === true &&
                ((_a = interaction.thisArg) === null || _a === void 0 ? void 0 : _a.hasEffectsOnInteractionAtPath(UNKNOWN_INTEGER_PATH, NODE_INTERACTION_UNKNOWN_ASSIGNMENT, context))) {
                return true;
            }
            if (this.description.callsArgs) {
                for (const argIndex of this.description.callsArgs) {
                    if ((_b = interaction.args[argIndex]) === null || _b === void 0 ? void 0 : _b.hasEffectsOnInteractionAtPath(EMPTY_PATH, NODE_INTERACTION_UNKNOWN_CALL, context)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
const METHOD_RETURNS_BOOLEAN = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: false,
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_BOOLEAN
    })
];
const METHOD_RETURNS_STRING = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: false,
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_STRING
    })
];
const METHOD_RETURNS_NUMBER = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: false,
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_NUMBER
    })
];
const METHOD_RETURNS_UNKNOWN = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: false,
        returns: null,
        returnsPrimitive: UNKNOWN_EXPRESSION
    })
];

const INTEGER_REG_EXP = /^\d+$/;
class ObjectEntity extends ExpressionEntity {
    // If a PropertyMap is used, this will be taken as propertiesAndGettersByKey
    // and we assume there are no setters or getters
    constructor(properties, prototypeExpression, immutable = false) {
        super();
        this.prototypeExpression = prototypeExpression;
        this.immutable = immutable;
        this.allProperties = [];
        this.deoptimizedPaths = Object.create(null);
        this.expressionsToBeDeoptimizedByKey = Object.create(null);
        this.gettersByKey = Object.create(null);
        this.hasLostTrack = false;
        this.hasUnknownDeoptimizedInteger = false;
        this.hasUnknownDeoptimizedProperty = false;
        this.propertiesAndGettersByKey = Object.create(null);
        this.propertiesAndSettersByKey = Object.create(null);
        this.settersByKey = Object.create(null);
        this.thisParametersToBeDeoptimized = new Set();
        this.unknownIntegerProps = [];
        this.unmatchableGetters = [];
        this.unmatchablePropertiesAndGetters = [];
        this.unmatchableSetters = [];
        if (Array.isArray(properties)) {
            this.buildPropertyMaps(properties);
        }
        else {
            this.propertiesAndGettersByKey = this.propertiesAndSettersByKey = properties;
            for (const propertiesForKey of Object.values(properties)) {
                this.allProperties.push(...propertiesForKey);
            }
        }
    }
    deoptimizeAllProperties(noAccessors) {
        var _a;
        const isDeoptimized = this.hasLostTrack || this.hasUnknownDeoptimizedProperty;
        if (noAccessors) {
            this.hasUnknownDeoptimizedProperty = true;
        }
        else {
            this.hasLostTrack = true;
        }
        if (isDeoptimized) {
            return;
        }
        for (const properties of Object.values(this.propertiesAndGettersByKey).concat(Object.values(this.settersByKey))) {
            for (const property of properties) {
                property.deoptimizePath(UNKNOWN_PATH);
            }
        }
        // While the prototype itself cannot be mutated, each property can
        (_a = this.prototypeExpression) === null || _a === void 0 ? void 0 : _a.deoptimizePath([UnknownKey, UnknownKey]);
        this.deoptimizeCachedEntities();
    }
    deoptimizeIntegerProperties() {
        if (this.hasLostTrack ||
            this.hasUnknownDeoptimizedProperty ||
            this.hasUnknownDeoptimizedInteger) {
            return;
        }
        this.hasUnknownDeoptimizedInteger = true;
        for (const [key, propertiesAndGetters] of Object.entries(this.propertiesAndGettersByKey)) {
            if (INTEGER_REG_EXP.test(key)) {
                for (const property of propertiesAndGetters) {
                    property.deoptimizePath(UNKNOWN_PATH);
                }
            }
        }
        this.deoptimizeCachedIntegerEntities();
    }
    // Assumption: If only a specific path is deoptimized, no accessors are created
    deoptimizePath(path) {
        var _a;
        if (this.hasLostTrack || this.immutable) {
            return;
        }
        const key = path[0];
        if (path.length === 1) {
            if (typeof key !== 'string') {
                if (key === UnknownInteger) {
                    return this.deoptimizeIntegerProperties();
                }
                return this.deoptimizeAllProperties(key === UnknownNonAccessorKey);
            }
            if (!this.deoptimizedPaths[key]) {
                this.deoptimizedPaths[key] = true;
                // we only deoptimizeCache exact matches as in all other cases,
                // we do not return a literal value or return expression
                const expressionsToBeDeoptimized = this.expressionsToBeDeoptimizedByKey[key];
                if (expressionsToBeDeoptimized) {
                    for (const expression of expressionsToBeDeoptimized) {
                        expression.deoptimizeCache();
                    }
                }
            }
        }
        const subPath = path.length === 1 ? UNKNOWN_PATH : path.slice(1);
        for (const property of typeof key === 'string'
            ? (this.propertiesAndGettersByKey[key] || this.unmatchablePropertiesAndGetters).concat(this.settersByKey[key] || this.unmatchableSetters)
            : this.allProperties) {
            property.deoptimizePath(subPath);
        }
        (_a = this.prototypeExpression) === null || _a === void 0 ? void 0 : _a.deoptimizePath(path.length === 1 ? [...path, UnknownKey] : path);
    }
    deoptimizeThisOnInteractionAtPath(interaction, path, recursionTracker) {
        var _a;
        const [key, ...subPath] = path;
        if (this.hasLostTrack ||
            // single paths that are deoptimized will not become getters or setters
            ((interaction.type === INTERACTION_CALLED || path.length > 1) &&
                (this.hasUnknownDeoptimizedProperty ||
                    (typeof key === 'string' && this.deoptimizedPaths[key])))) {
            interaction.thisArg.deoptimizePath(UNKNOWN_PATH);
            return;
        }
        const [propertiesForExactMatchByKey, relevantPropertiesByKey, relevantUnmatchableProperties] = interaction.type === INTERACTION_CALLED || path.length > 1
            ? [
                this.propertiesAndGettersByKey,
                this.propertiesAndGettersByKey,
                this.unmatchablePropertiesAndGetters
            ]
            : interaction.type === INTERACTION_ACCESSED
                ? [this.propertiesAndGettersByKey, this.gettersByKey, this.unmatchableGetters]
                : [this.propertiesAndSettersByKey, this.settersByKey, this.unmatchableSetters];
        if (typeof key === 'string') {
            if (propertiesForExactMatchByKey[key]) {
                const properties = relevantPropertiesByKey[key];
                if (properties) {
                    for (const property of properties) {
                        property.deoptimizeThisOnInteractionAtPath(interaction, subPath, recursionTracker);
                    }
                }
                if (!this.immutable) {
                    this.thisParametersToBeDeoptimized.add(interaction.thisArg);
                }
                return;
            }
            for (const property of relevantUnmatchableProperties) {
                property.deoptimizeThisOnInteractionAtPath(interaction, subPath, recursionTracker);
            }
            if (INTEGER_REG_EXP.test(key)) {
                for (const property of this.unknownIntegerProps) {
                    property.deoptimizeThisOnInteractionAtPath(interaction, subPath, recursionTracker);
                }
            }
        }
        else {
            for (const properties of Object.values(relevantPropertiesByKey).concat([
                relevantUnmatchableProperties
            ])) {
                for (const property of properties) {
                    property.deoptimizeThisOnInteractionAtPath(interaction, subPath, recursionTracker);
                }
            }
            for (const property of this.unknownIntegerProps) {
                property.deoptimizeThisOnInteractionAtPath(interaction, subPath, recursionTracker);
            }
        }
        if (!this.immutable) {
            this.thisParametersToBeDeoptimized.add(interaction.thisArg);
        }
        (_a = this.prototypeExpression) === null || _a === void 0 ? void 0 : _a.deoptimizeThisOnInteractionAtPath(interaction, path, recursionTracker);
    }
    getLiteralValueAtPath(path, recursionTracker, origin) {
        if (path.length === 0) {
            return UnknownTruthyValue;
        }
        const key = path[0];
        const expressionAtPath = this.getMemberExpressionAndTrackDeopt(key, origin);
        if (expressionAtPath) {
            return expressionAtPath.getLiteralValueAtPath(path.slice(1), recursionTracker, origin);
        }
        if (this.prototypeExpression) {
            return this.prototypeExpression.getLiteralValueAtPath(path, recursionTracker, origin);
        }
        if (path.length === 1) {
            return undefined;
        }
        return UnknownValue;
    }
    getReturnExpressionWhenCalledAtPath(path, interaction, recursionTracker, origin) {
        if (path.length === 0) {
            return UNKNOWN_EXPRESSION;
        }
        const [key, ...subPath] = path;
        const expressionAtPath = this.getMemberExpressionAndTrackDeopt(key, origin);
        if (expressionAtPath) {
            return expressionAtPath.getReturnExpressionWhenCalledAtPath(subPath, interaction, recursionTracker, origin);
        }
        if (this.prototypeExpression) {
            return this.prototypeExpression.getReturnExpressionWhenCalledAtPath(path, interaction, recursionTracker, origin);
        }
        return UNKNOWN_EXPRESSION;
    }
    hasEffectsOnInteractionAtPath(path, interaction, context) {
        const [key, ...subPath] = path;
        if (subPath.length || interaction.type === INTERACTION_CALLED) {
            const expressionAtPath = this.getMemberExpression(key);
            if (expressionAtPath) {
                return expressionAtPath.hasEffectsOnInteractionAtPath(subPath, interaction, context);
            }
            if (this.prototypeExpression) {
                return this.prototypeExpression.hasEffectsOnInteractionAtPath(path, interaction, context);
            }
            return true;
        }
        if (key === UnknownNonAccessorKey)
            return false;
        if (this.hasLostTrack)
            return true;
        const [propertiesAndAccessorsByKey, accessorsByKey, unmatchableAccessors] = interaction.type === INTERACTION_ACCESSED
            ? [this.propertiesAndGettersByKey, this.gettersByKey, this.unmatchableGetters]
            : [this.propertiesAndSettersByKey, this.settersByKey, this.unmatchableSetters];
        if (typeof key === 'string') {
            if (propertiesAndAccessorsByKey[key]) {
                const accessors = accessorsByKey[key];
                if (accessors) {
                    for (const accessor of accessors) {
                        if (accessor.hasEffectsOnInteractionAtPath(subPath, interaction, context))
                            return true;
                    }
                }
                return false;
            }
            for (const accessor of unmatchableAccessors) {
                if (accessor.hasEffectsOnInteractionAtPath(subPath, interaction, context)) {
                    return true;
                }
            }
        }
        else {
            for (const accessors of Object.values(accessorsByKey).concat([unmatchableAccessors])) {
                for (const accessor of accessors) {
                    if (accessor.hasEffectsOnInteractionAtPath(subPath, interaction, context))
                        return true;
                }
            }
        }
        if (this.prototypeExpression) {
            return this.prototypeExpression.hasEffectsOnInteractionAtPath(path, interaction, context);
        }
        return false;
    }
    buildPropertyMaps(properties) {
        const { allProperties, propertiesAndGettersByKey, propertiesAndSettersByKey, settersByKey, gettersByKey, unknownIntegerProps, unmatchablePropertiesAndGetters, unmatchableGetters, unmatchableSetters } = this;
        const unmatchablePropertiesAndSetters = [];
        for (let index = properties.length - 1; index >= 0; index--) {
            const { key, kind, property } = properties[index];
            allProperties.push(property);
            if (typeof key !== 'string') {
                if (key === UnknownInteger) {
                    unknownIntegerProps.push(property);
                    continue;
                }
                if (kind === 'set')
                    unmatchableSetters.push(property);
                if (kind === 'get')
                    unmatchableGetters.push(property);
                if (kind !== 'get')
                    unmatchablePropertiesAndSetters.push(property);
                if (kind !== 'set')
                    unmatchablePropertiesAndGetters.push(property);
            }
            else {
                if (kind === 'set') {
                    if (!propertiesAndSettersByKey[key]) {
                        propertiesAndSettersByKey[key] = [property, ...unmatchablePropertiesAndSetters];
                        settersByKey[key] = [property, ...unmatchableSetters];
                    }
                }
                else if (kind === 'get') {
                    if (!propertiesAndGettersByKey[key]) {
                        propertiesAndGettersByKey[key] = [property, ...unmatchablePropertiesAndGetters];
                        gettersByKey[key] = [property, ...unmatchableGetters];
                    }
                }
                else {
                    if (!propertiesAndSettersByKey[key]) {
                        propertiesAndSettersByKey[key] = [property, ...unmatchablePropertiesAndSetters];
                    }
                    if (!propertiesAndGettersByKey[key]) {
                        propertiesAndGettersByKey[key] = [property, ...unmatchablePropertiesAndGetters];
                    }
                }
            }
        }
    }
    deoptimizeCachedEntities() {
        for (const expressionsToBeDeoptimized of Object.values(this.expressionsToBeDeoptimizedByKey)) {
            for (const expression of expressionsToBeDeoptimized) {
                expression.deoptimizeCache();
            }
        }
        for (const expression of this.thisParametersToBeDeoptimized) {
            expression.deoptimizePath(UNKNOWN_PATH);
        }
    }
    deoptimizeCachedIntegerEntities() {
        for (const [key, expressionsToBeDeoptimized] of Object.entries(this.expressionsToBeDeoptimizedByKey)) {
            if (INTEGER_REG_EXP.test(key)) {
                for (const expression of expressionsToBeDeoptimized) {
                    expression.deoptimizeCache();
                }
            }
        }
        for (const expression of this.thisParametersToBeDeoptimized) {
            expression.deoptimizePath(UNKNOWN_INTEGER_PATH);
        }
    }
    getMemberExpression(key) {
        if (this.hasLostTrack ||
            this.hasUnknownDeoptimizedProperty ||
            typeof key !== 'string' ||
            (this.hasUnknownDeoptimizedInteger && INTEGER_REG_EXP.test(key)) ||
            this.deoptimizedPaths[key]) {
            return UNKNOWN_EXPRESSION;
        }
        const properties = this.propertiesAndGettersByKey[key];
        if ((properties === null || properties === void 0 ? void 0 : properties.length) === 1) {
            return properties[0];
        }
        if (properties ||
            this.unmatchablePropertiesAndGetters.length > 0 ||
            (this.unknownIntegerProps.length && INTEGER_REG_EXP.test(key))) {
            return UNKNOWN_EXPRESSION;
        }
        return null;
    }
    getMemberExpressionAndTrackDeopt(key, origin) {
        if (typeof key !== 'string') {
            return UNKNOWN_EXPRESSION;
        }
        const expression = this.getMemberExpression(key);
        if (!(expression === UNKNOWN_EXPRESSION || this.immutable)) {
            const expressionsToBeDeoptimized = (this.expressionsToBeDeoptimizedByKey[key] =
                this.expressionsToBeDeoptimizedByKey[key] || []);
            expressionsToBeDeoptimized.push(origin);
        }
        return expression;
    }
}

const isInteger = (prop) => typeof prop === 'string' && /^\d+$/.test(prop);
// This makes sure unknown properties are not handled as "undefined" but as
// "unknown" but without access side effects. An exception is done for numeric
// properties as we do not expect new builtin properties to be numbers, this
// will improve tree-shaking for out-of-bounds array properties
const OBJECT_PROTOTYPE_FALLBACK = new (class ObjectPrototypeFallbackExpression extends ExpressionEntity {
    deoptimizeThisOnInteractionAtPath({ type, thisArg }, path) {
        if (type === INTERACTION_CALLED && path.length === 1 && !isInteger(path[0])) {
            thisArg.deoptimizePath(UNKNOWN_PATH);
        }
    }
    getLiteralValueAtPath(path) {
        // We ignore number properties as we do not expect new properties to be
        // numbers and also want to keep handling out-of-bound array elements as
        // "undefined"
        return path.length === 1 && isInteger(path[0]) ? undefined : UnknownValue;
    }
    hasEffectsOnInteractionAtPath(path, { type }) {
        return path.length > 1 || type === INTERACTION_CALLED;
    }
})();
const OBJECT_PROTOTYPE = new ObjectEntity({
    __proto__: null,
    hasOwnProperty: METHOD_RETURNS_BOOLEAN,
    isPrototypeOf: METHOD_RETURNS_BOOLEAN,
    propertyIsEnumerable: METHOD_RETURNS_BOOLEAN,
    toLocaleString: METHOD_RETURNS_STRING,
    toString: METHOD_RETURNS_STRING,
    valueOf: METHOD_RETURNS_UNKNOWN
}, OBJECT_PROTOTYPE_FALLBACK, true);

const NEW_ARRAY_PROPERTIES = [
    { key: UnknownInteger, kind: 'init', property: UNKNOWN_EXPRESSION },
    { key: 'length', kind: 'init', property: UNKNOWN_LITERAL_NUMBER }
];
const METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_BOOLEAN = [
    new Method({
        callsArgs: [0],
        mutatesSelfAsArray: 'deopt-only',
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_BOOLEAN
    })
];
const METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NUMBER = [
    new Method({
        callsArgs: [0],
        mutatesSelfAsArray: 'deopt-only',
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_NUMBER
    })
];
const METHOD_MUTATES_SELF_RETURNS_NEW_ARRAY = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: true,
        returns: () => new ObjectEntity(NEW_ARRAY_PROPERTIES, ARRAY_PROTOTYPE),
        returnsPrimitive: null
    })
];
const METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: 'deopt-only',
        returns: () => new ObjectEntity(NEW_ARRAY_PROPERTIES, ARRAY_PROTOTYPE),
        returnsPrimitive: null
    })
];
const METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NEW_ARRAY = [
    new Method({
        callsArgs: [0],
        mutatesSelfAsArray: 'deopt-only',
        returns: () => new ObjectEntity(NEW_ARRAY_PROPERTIES, ARRAY_PROTOTYPE),
        returnsPrimitive: null
    })
];
const METHOD_MUTATES_SELF_RETURNS_NUMBER = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: true,
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_NUMBER
    })
];
const METHOD_MUTATES_SELF_RETURNS_UNKNOWN = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: true,
        returns: null,
        returnsPrimitive: UNKNOWN_EXPRESSION
    })
];
const METHOD_DEOPTS_SELF_RETURNS_UNKNOWN = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: 'deopt-only',
        returns: null,
        returnsPrimitive: UNKNOWN_EXPRESSION
    })
];
const METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN = [
    new Method({
        callsArgs: [0],
        mutatesSelfAsArray: 'deopt-only',
        returns: null,
        returnsPrimitive: UNKNOWN_EXPRESSION
    })
];
const METHOD_MUTATES_SELF_RETURNS_SELF = [
    new Method({
        callsArgs: null,
        mutatesSelfAsArray: true,
        returns: 'self',
        returnsPrimitive: null
    })
];
const METHOD_CALLS_ARG_MUTATES_SELF_RETURNS_SELF = [
    new Method({
        callsArgs: [0],
        mutatesSelfAsArray: true,
        returns: 'self',
        returnsPrimitive: null
    })
];
const ARRAY_PROTOTYPE = new ObjectEntity({
    __proto__: null,
    // We assume that accessors have effects as we do not track the accessed value afterwards
    at: METHOD_DEOPTS_SELF_RETURNS_UNKNOWN,
    concat: METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY,
    copyWithin: METHOD_MUTATES_SELF_RETURNS_SELF,
    entries: METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY,
    every: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_BOOLEAN,
    fill: METHOD_MUTATES_SELF_RETURNS_SELF,
    filter: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NEW_ARRAY,
    find: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
    findIndex: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NUMBER,
    findLast: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
    findLastIndex: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NUMBER,
    flat: METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY,
    flatMap: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NEW_ARRAY,
    forEach: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
    group: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
    groupToMap: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
    includes: METHOD_RETURNS_BOOLEAN,
    indexOf: METHOD_RETURNS_NUMBER,
    join: METHOD_RETURNS_STRING,
    keys: METHOD_RETURNS_UNKNOWN,
    lastIndexOf: METHOD_RETURNS_NUMBER,
    map: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NEW_ARRAY,
    pop: METHOD_MUTATES_SELF_RETURNS_UNKNOWN,
    push: METHOD_MUTATES_SELF_RETURNS_NUMBER,
    reduce: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
    reduceRight: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
    reverse: METHOD_MUTATES_SELF_RETURNS_SELF,
    shift: METHOD_MUTATES_SELF_RETURNS_UNKNOWN,
    slice: METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY,
    some: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_BOOLEAN,
    sort: METHOD_CALLS_ARG_MUTATES_SELF_RETURNS_SELF,
    splice: METHOD_MUTATES_SELF_RETURNS_NEW_ARRAY,
    toLocaleString: METHOD_RETURNS_STRING,
    toString: METHOD_RETURNS_STRING,
    unshift: METHOD_MUTATES_SELF_RETURNS_NUMBER,
    values: METHOD_DEOPTS_SELF_RETURNS_UNKNOWN
}, OBJECT_PROTOTYPE, true);

class ArrayExpression extends NodeBase {
    constructor() {
        super(...arguments);
        this.objectEntity = null;
    }
    deoptimizePath(path) {
        this.getObjectEntity().deoptimizePath(path);
    }
    deoptimizeThisOnInteractionAtPath(interaction, path, recursionTracker) {
        this.getObjectEntity().deoptimizeThisOnInteractionAtPath(interaction, path, recursionTracker);
    }
    getLiteralValueAtPath(path, recursionTracker, origin) {
        return this.getObjectEntity().getLiteralValueAtPath(path, recursionTracker, origin);
    }
    getReturnExpressionWhenCalledAtPath(path, interaction, recursionTracker, origin) {
        return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(path, interaction, recursionTracker, origin);
    }
    hasEffectsOnInteractionAtPath(path, interaction, context) {
        return this.getObjectEntity().hasEffectsOnInteractionAtPath(path, interaction, context);
    }
    applyDeoptimizations() {
        this.deoptimized = true;
        let hasSpread = false;
        for (let index = 0; index < this.elements.length; index++) {
            const element = this.elements[index];
            if (element) {
                if (hasSpread || element instanceof SpreadElement) {
                    hasSpread = true;
                    element.deoptimizePath(UNKNOWN_PATH);
                }
            }
        }
        this.context.requestTreeshakingPass();
    }
    getObjectEntity() {
        if (this.objectEntity !== null) {
            return this.objectEntity;
        }
        const properties = [
            { key: 'length', kind: 'init', property: UNKNOWN_LITERAL_NUMBER }
        ];
        let hasSpread = false;
        for (let index = 0; index < this.elements.length; index++) {
            const element = this.elements[index];
            if (hasSpread || element instanceof SpreadElement) {
                if (element) {
                    hasSpread = true;
                    properties.unshift({ key: UnknownInteger, kind: 'init', property: element });
                }
            }
            else if (!element) {
                properties.push({ key: String(index), kind: 'init', property: UNDEFINED_EXPRESSION });
            }
            else {
                properties.push({ key: String(index), kind: 'init', property: element });
            }
        }
        return (this.objectEntity = new ObjectEntity(properties, ARRAY_PROTOTYPE));
    }
}

class ArrayPattern extends NodeBase {
    addExportedVariables(variables, exportNamesByVariable) {
        for (const element of this.elements) {
            element === null || element === void 0 ? void 0 : element.addExportedVariables(variables, exportNamesByVariable);
        }
    }
    declare(kind) {
        const variables = [];
        for (const element of this.elements) {
            if (element !== null) {
                variables.push(...element.declare(kind, UNKNOWN_EXPRESSION));
            }
        }
        return variables;
    }
    // Patterns can only be deoptimized at the empty path at the moment
    deoptimizePath() {
        for (const element of this.elements) {
            element === null || element === void 0 ? void 0 : element.deoptimizePath(EMPTY_PATH);
        }
    }
    // Patterns are only checked at the emtpy path at the moment
    hasEffectsOnInteractionAtPath(_path, interaction, context) {
        for (const element of this.elements) {
            if (element === null || element === void 0 ? void 0 : element.hasEffectsOnInteractionAtPath(EMPTY_PATH, interaction, context))
                return true;
        }
        return false;
    }
    markDeclarationReached() {
        for (const element of this.elements) {
            element === null || element === void 0 ? void 0 : element.markDeclarationReached();
        }
    }
}

class LocalVariable extends Variable {
    constructor(name, declarator, init, context) {
        super(name);
        this.calledFromTryStatement = false;
        this.additionalInitializers = null;
        this.expressionsToBeDeoptimized = [];
        this.declarations = declarator ? [declarator] : [];
        this.init = init;
        this.deoptimizationTracker = context.deoptimizationTracker;
        this.module = context.module;
    }
    addDeclaration(identifier, init) {
        this.declarations.push(identifier);
        const additionalInitializers = this.markInitializersForDeoptimization();
        if (init !== null) {
            additionalInitializers.push(init);
        }
    }
    consolidateInitializers() {
        if (this.additionalInitializers !== null) {
            for (const initializer of this.additionalInitializers) {
                initializer.deoptimizePath(UNKNOWN_PATH);
            }
            this.additionalInitializers = null;
        }
    }
    deoptimizePath(path) {
        var _a, _b;
        if (this.isReassigned ||
            this.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(path, this)) {
            return;
        }
        if (path.length === 0) {
            if (!this.isReassigned) {
                this.isReassigned = true;
                const expressionsToBeDeoptimized = this.expressionsToBeDeoptimized;
                this.expressionsToBeDeoptimized = [];
                for (const expression of expressionsToBeDeoptimized) {
                    expression.deoptimizeCache();
                }
                (_a = this.init) === null || _a === void 0 ? void 0 : _a.deoptimizePath(UNKNOWN_PATH);
            }
        }
        else {
            (_b = this.init) === null || _b === void 0 ? void 0 : _b.deoptimizePath(path);
        }
    }
    deoptimizeThisOnInteractionAtPath(interaction, path, recursionTracker) {
        if (this.isReassigned || !this.init) {
            return interaction.thisArg.deoptimizePath(UNKNOWN_PATH);
        }
        recursionTracker.withTrackedEntityAtPath(path, this.init, () => this.init.deoptimizeThisOnInteractionAtPath(interaction, path, recursionTracker), undefined);
    }
    getLiteralValueAtPath(path, recursionTracker, origin) {
        if (this.isReassigned || !this.init) {
            return UnknownValue;
        }
        return recursionTracker.withTrackedEntityAtPath(path, this.init, () => {
            this.expressionsToBeDeoptimized.push(origin);
            return this.init.getLiteralValueAtPath(path, recursionTracker, origin);
        }, UnknownValue);
    }
    getReturnExpressionWhenCalledAtPath(path, interaction, recursionTracker, origin) {
        if (this.isReassigned || !this.init) {
            return UNKNOWN_EXPRESSION;
        }
        return recursionTracker.withTrackedEntityAtPath(path, this.init, () => {
            this.expressionsToBeDeoptimized.push(origin);
            return this.init.getReturnExpressionWhenCalledAtPath(path, interaction, recursionTracker, origin);
        }, UNKNOWN_EXPRESSION);
    }
    hasEffectsOnInteractionAtPath(path, interaction, context) {
        switch (interaction.type) {
            case INTERACTION_ACCESSED:
                if (this.isReassigned)
                    return true;
                return (this.init &&
                    !context.accessed.trackEntityAtPathAndGetIfTracked(path, this) &&
                    this.init.hasEffectsOnInteractionAtPath(path, interaction, context));
            case INTERACTION_ASSIGNED:
                if (this.included)
                    return true;
                if (path.length === 0)
                    return false;
                if (this.isReassigned)
                    return true;
                return (this.init &&
                    !context.assigned.trackEntityAtPathAndGetIfTracked(path, this) &&
                    this.init.hasEffectsOnInteractionAtPath(path, interaction, context));
            case INTERACTION_CALLED:
                if (this.isReassigned)
                    return true;
                return (this.init &&
                    !(interaction.withNew ? context.instantiated : context.called).trackEntityAtPathAndGetIfTracked(path, interaction.args, this) &&
                    this.init.hasEffectsOnInteractionAtPath(path, interaction, context));
        }
    }
    include() {
        if (!this.included) {
            this.included = true;
            for (const declaration of this.declarations) {
                // If node is a default export, it can save a tree-shaking run to include the full declaration now
                if (!declaration.included)
                    declaration.include(createInclusionContext(), false);
                let node = declaration.parent;
                while (!node.included) {
                    // We do not want to properly include parents in case they are part of a dead branch
                    // in which case .include() might pull in more dead code
                    node.included = true;
                    if (node.type === Program$1)
                        break;
                    node = node.parent;
                }
            }
        }
    }
    includeCallArguments(context, args) {
        if (this.isReassigned || (this.init && context.includedCallArguments.has(this.init))) {
            for (const arg of args) {
                arg.include(context, false);
            }
        }
        else if (this.init) {
            context.includedCallArguments.add(this.init);
            this.init.includeCallArguments(context, args);
            context.includedCallArguments.delete(this.init);
        }
    }
    markCalledFromTryStatement() {
        this.calledFromTryStatement = true;
    }
    markInitializersForDeoptimization() {
        if (this.additionalInitializers === null) {
            this.additionalInitializers = this.init === null ? [] : [this.init];
            this.init = UNKNOWN_EXPRESSION;
            this.isReassigned = true;
        }
        return this.additionalInitializers;
    }
}

const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
const base = 64;
function toBase64(num) {
    let outStr = '';
    do {
        const curDigit = num % base;
        num = Math.floor(num / base);
        outStr = chars[curDigit] + outStr;
    } while (num !== 0);
    return outStr;
}

function getSafeName(baseName, usedNames) {
    let safeName = baseName;
    let count = 1;
    while (usedNames.has(safeName) || RESERVED_NAMES$1.has(safeName)) {
        safeName = `${baseName}$${toBase64(count++)}`;
    }
    usedNames.add(safeName);
    return safeName;
}

class Scope$1 {
    constructor() {
        this.children = [];
        this.variables = new Map();
    }
    addDeclaration(identifier, context, init, _isHoisted) {
        const name = identifier.name;
        let variable = this.variables.get(name);
        if (variable) {
            variable.addDeclaration(identifier, init);
        }
        else {
            variable = new LocalVariable(identifier.name, identifier, init || UNDEFINED_EXPRESSION, context);
            this.variables.set(name, variable);
        }
        return variable;
    }
    contains(name) {
        return this.variables.has(name);
    }
    findVariable(_name) {
        throw new Error('Internal Error: findVariable needs to be implemented by a subclass');
    }
}

class ChildScope extends Scope$1 {
    constructor(parent) {
        super();
        this.accessedOutsideVariables = new Map();
        this.parent = parent;
        parent.children.push(this);
    }
    addAccessedDynamicImport(importExpression) {
        (this.accessedDynamicImports || (this.accessedDynamicImports = new Set())).add(importExpression);
        if (this.parent instanceof ChildScope) {
            this.parent.addAccessedDynamicImport(importExpression);
        }
    }
    addAccessedGlobals(globals, accessedGlobalsByScope) {
        const accessedGlobals = accessedGlobalsByScope.get(this) || new Set();
        for (const name of globals) {
            accessedGlobals.add(name);
        }
        accessedGlobalsByScope.set(this, accessedGlobals);
        if (this.parent instanceof ChildScope) {
            this.parent.addAccessedGlobals(globals, accessedGlobalsByScope);
        }
    }
    addNamespaceMemberAccess(name, variable) {
        this.accessedOutsideVariables.set(name, variable);
        this.parent.addNamespaceMemberAccess(name, variable);
    }
    addReturnExpression(expression) {
        this.parent instanceof ChildScope && this.parent.addReturnExpression(expression);
    }
    addUsedOutsideNames(usedNames, format, exportNamesByVariable, accessedGlobalsByScope) {
        for (const variable of this.accessedOutsideVariables.values()) {
            if (variable.included) {
                usedNames.add(variable.getBaseVariableName());
                if (format === 'system' && exportNamesByVariable.has(variable)) {
                    usedNames.add('exports');
                }
            }
        }
        const accessedGlobals = accessedGlobalsByScope.get(this);
        if (accessedGlobals) {
            for (const name of accessedGlobals) {
                usedNames.add(name);
            }
        }
    }
    contains(name) {
        return this.variables.has(name) || this.parent.contains(name);
    }
    deconflict(format, exportNamesByVariable, accessedGlobalsByScope) {
        const usedNames = new Set();
        this.addUsedOutsideNames(usedNames, format, exportNamesByVariable, accessedGlobalsByScope);
        if (this.accessedDynamicImports) {
            for (const importExpression of this.accessedDynamicImports) {
                if (importExpression.inlineNamespace) {
                    usedNames.add(importExpression.inlineNamespace.getBaseVariableName());
                }
            }
        }
        for (const [name, variable] of this.variables) {
            if (variable.included || variable.alwaysRendered) {
                variable.setRenderNames(null, getSafeName(name, usedNames));
            }
        }
        for (const scope of this.children) {
            scope.deconflict(format, exportNamesByVariable, accessedGlobalsByScope);
        }
    }
    findLexicalBoundary() {
        return this.parent.findLexicalBoundary();
    }
    findVariable(name) {
        const knownVariable = this.variables.get(name) || this.accessedOutsideVariables.get(name);
        if (knownVariable) {
            return knownVariable;
        }
        const variable = this.parent.findVariable(name);
        this.accessedOutsideVariables.set(name, variable);
        return variable;
    }
}

class ParameterScope extends ChildScope {
    constructor(parent, context) {
        super(parent);
        this.parameters = [];
        this.hasRest = false;
        this.context = context;
        this.hoistedBodyVarScope = new ChildScope(this);
    }
    /**
     * Adds a parameter to this scope. Parameters must be added in the correct
     * order, e.g. from left to right.
     */
    addParameterDeclaration(identifier) {
        const name = identifier.name;
        let variable = this.hoistedBodyVarScope.variables.get(name);
        if (variable) {
            variable.addDeclaration(identifier, null);
        }
        else {
            variable = new LocalVariable(name, identifier, UNKNOWN_EXPRESSION, this.context);
        }
        this.variables.set(name, variable);
        return variable;
    }
    addParameterVariables(parameters, hasRest) {
        this.parameters = parameters;
        for (const parameterList of parameters) {
            for (const parameter of parameterList) {
                parameter.alwaysRendered = true;
            }
        }
        this.hasRest = hasRest;
    }
    includeCallArguments(context, args) {
        let calledFromTryStatement = false;
        let argIncluded = false;
        const restParam = this.hasRest && this.parameters[this.parameters.length - 1];
        for (const checkedArg of args) {
            if (checkedArg instanceof SpreadElement) {
                for (const arg of args) {
                    arg.include(context, false);
                }
                break;
            }
        }
        for (let index = args.length - 1; index >= 0; index--) {
            const paramVars = this.parameters[index] || restParam;
            const arg = args[index];
            if (paramVars) {
                calledFromTryStatement = false;
                if (paramVars.length === 0) {
                    // handle empty destructuring
                    argIncluded = true;
                }
                else {
                    for (const variable of paramVars) {
                        if (variable.included) {
                            argIncluded = true;
                        }
                        if (variable.calledFromTryStatement) {
                            calledFromTryStatement = true;
                        }
                    }
                }
            }
            if (!argIncluded && arg.shouldBeIncluded(context)) {
                argIncluded = true;
            }
            if (argIncluded) {
                arg.include(context, calledFromTryStatement);
            }
        }
    }
}

class ReturnValueScope extends ParameterScope {
    constructor() {
        super(...arguments);
        this.returnExpression = null;
        this.returnExpressions = [];
    }
    addReturnExpression(expression) {
        this.returnExpressions.push(expression);
    }
    getReturnExpression() {
        if (this.returnExpression === null)
            this.updateReturnExpression();
        return this.returnExpression;
    }
    updateReturnExpression() {
        if (this.returnExpressions.length === 1) {
            this.returnExpression = this.returnExpressions[0];
        }
        else {
            this.returnExpression = UNKNOWN_EXPRESSION;
            for (const expression of this.returnExpressions) {
                expression.deoptimizePath(UNKNOWN_PATH);
            }
        }
    }
}

//@ts-check
/** @typedef { import('estree').Node} Node */
/** @typedef {Node | {
 *   type: 'PropertyDefinition';
 *   computed: boolean;
 *   value: Node
 * }} NodeWithPropertyDefinition */

/**
 *
 * @param {NodeWithPropertyDefinition} node
 * @param {NodeWithPropertyDefinition} parent
 * @returns boolean
 */
function is_reference (node, parent) {
	if (node.type === 'MemberExpression') {
		return !node.computed && is_reference(node.object, node);
	}

	if (node.type === 'Identifier') {
		if (!parent) return true;

		switch (parent.type) {
			// disregard `bar` in `foo.bar`
			case 'MemberExpression': return parent.computed || node === parent.object;

			// disregard the `foo` in `class {foo(){}}` but keep it in `class {[foo](){}}`
			case 'MethodDefinition': return parent.computed;

			// disregard the `foo` in `class {foo=bar}` but keep it in `class {[foo]=bar}` and `class {bar=foo}`
			case 'PropertyDefinition': return parent.computed || node === parent.value;

			// disregard the `bar` in `{ bar: foo }`, but keep it in `{ [bar]: foo }`
			case 'Property': return parent.computed || node === parent.value;

			// disregard the `bar` in `export { foo as bar }` or
			// the foo in `import { foo as bar }`
			case 'ExportSpecifier':
			case 'ImportSpecifier': return node === parent.local;

			// disregard the `foo` in `foo: while (...) { ... break foo; ... continue foo;}`
			case 'LabeledStatement':
			case 'BreakStatement':
			case 'ContinueStatement': return false;
			default: return true;
		}
	}

	return false;
}

/* eslint sort-keys: "off" */
const ValueProperties = Symbol('Value Properties');
const PURE = {
    hasEffectsWhenCalled() {
        return false;
    }
};
const IMPURE = {
    hasEffectsWhenCalled() {
        return true;
    }
};
// We use shortened variables to reduce file size here
/* OBJECT */
const O = {
    __proto__: null,
    [ValueProperties]: IMPURE
};
/* PURE FUNCTION */
const PF = {
    __proto__: null,
    [ValueProperties]: PURE
};
/* FUNCTION THAT MUTATES FIRST ARG WITHOUT TRIGGERING ACCESSORS */
const MUTATES_ARG_WITHOUT_ACCESSOR = {
    __proto__: null,
    [ValueProperties]: {
        hasEffectsWhenCalled({ args }, context) {
            return (!args.length ||
                args[0].hasEffectsOnInteractionAtPath(UNKNOWN_NON_ACCESSOR_PATH, NODE_INTERACTION_UNKNOWN_ASSIGNMENT, context));
        }
    }
};
/* CONSTRUCTOR */
const C = {
    __proto__: null,
    [ValueProperties]: IMPURE,
    prototype: O
};
/* PURE CONSTRUCTOR */
const PC = {
    __proto__: null,
    [ValueProperties]: PURE,
    prototype: O
};
const ARRAY_TYPE = {
    __proto__: null,
    [ValueProperties]: PURE,
    from: PF,
    of: PF,
    prototype: O
};
const INTL_MEMBER = {
    __proto__: null,
    [ValueProperties]: PURE,
    supportedLocalesOf: PC
};
const knownGlobals = {
    // Placeholders for global objects to avoid shape mutations
    global: O,
    globalThis: O,
    self: O,
    window: O,
    // Common globals
    __proto__: null,
    [ValueProperties]: IMPURE,
    Array: {
        __proto__: null,
        [ValueProperties]: IMPURE,
        from: O,
        isArray: PF,
        of: PF,
        prototype: O
    },
    ArrayBuffer: {
        __proto__: null,
        [ValueProperties]: PURE,
        isView: PF,
        prototype: O
    },
    Atomics: O,
    BigInt: C,
    BigInt64Array: C,
    BigUint64Array: C,
    Boolean: PC,
    constructor: C,
    DataView: PC,
    Date: {
        __proto__: null,
        [ValueProperties]: PURE,
        now: PF,
        parse: PF,
        prototype: O,
        UTC: PF
    },
    decodeURI: PF,
    decodeURIComponent: PF,
    encodeURI: PF,
    encodeURIComponent: PF,
    Error: PC,
    escape: PF,
    eval: O,
    EvalError: PC,
    Float32Array: ARRAY_TYPE,
    Float64Array: ARRAY_TYPE,
    Function: C,
    hasOwnProperty: O,
    Infinity: O,
    Int16Array: ARRAY_TYPE,
    Int32Array: ARRAY_TYPE,
    Int8Array: ARRAY_TYPE,
    isFinite: PF,
    isNaN: PF,
    isPrototypeOf: O,
    JSON: O,
    Map: PC,
    Math: {
        __proto__: null,
        [ValueProperties]: IMPURE,
        abs: PF,
        acos: PF,
        acosh: PF,
        asin: PF,
        asinh: PF,
        atan: PF,
        atan2: PF,
        atanh: PF,
        cbrt: PF,
        ceil: PF,
        clz32: PF,
        cos: PF,
        cosh: PF,
        exp: PF,
        expm1: PF,
        floor: PF,
        fround: PF,
        hypot: PF,
        imul: PF,
        log: PF,
        log10: PF,
        log1p: PF,
        log2: PF,
        max: PF,
        min: PF,
        pow: PF,
        random: PF,
        round: PF,
        sign: PF,
        sin: PF,
        sinh: PF,
        sqrt: PF,
        tan: PF,
        tanh: PF,
        trunc: PF
    },
    NaN: O,
    Number: {
        __proto__: null,
        [ValueProperties]: PURE,
        isFinite: PF,
        isInteger: PF,
        isNaN: PF,
        isSafeInteger: PF,
        parseFloat: PF,
        parseInt: PF,
        prototype: O
    },
    Object: {
        __proto__: null,
        [ValueProperties]: PURE,
        create: PF,
        // Technically those can throw in certain situations, but we ignore this as
        // code that relies on this will hopefully wrap this in a try-catch, which
        // deoptimizes everything anyway
        defineProperty: MUTATES_ARG_WITHOUT_ACCESSOR,
        defineProperties: MUTATES_ARG_WITHOUT_ACCESSOR,
        getOwnPropertyDescriptor: PF,
        getOwnPropertyNames: PF,
        getOwnPropertySymbols: PF,
        getPrototypeOf: PF,
        hasOwn: PF,
        is: PF,
        isExtensible: PF,
        isFrozen: PF,
        isSealed: PF,
        keys: PF,
        fromEntries: PF,
        entries: PF,
        prototype: O
    },
    parseFloat: PF,
    parseInt: PF,
    Promise: {
        __proto__: null,
        [ValueProperties]: IMPURE,
        all: O,
        prototype: O,
        race: O,
        reject: O,
        resolve: O
    },
    propertyIsEnumerable: O,
    Proxy: O,
    RangeError: PC,
    ReferenceError: PC,
    Reflect: O,
    RegExp: PC,
    Set: PC,
    SharedArrayBuffer: C,
    String: {
        __proto__: null,
        [ValueProperties]: PURE,
        fromCharCode: PF,
        fromCodePoint: PF,
        prototype: O,
        raw: PF
    },
    Symbol: {
        __proto__: null,
        [ValueProperties]: PURE,
        for: PF,
        keyFor: PF,
        prototype: O
    },
    SyntaxError: PC,
    toLocaleString: O,
    toString: O,
    TypeError: PC,
    Uint16Array: ARRAY_TYPE,
    Uint32Array: ARRAY_TYPE,
    Uint8Array: ARRAY_TYPE,
    Uint8ClampedArray: ARRAY_TYPE,
    // Technically, this is a global, but it needs special handling
    // undefined: ?,
    unescape: PF,
    URIError: PC,
    valueOf: O,
    WeakMap: PC,
    WeakSet: PC,
    // Additional globals shared by Node and Browser that are not strictly part of the language
    clearInterval: C,
    clearTimeout: C,
    console: O,
    Intl: {
        __proto__: null,
        [ValueProperties]: IMPURE,
        Collator: INTL_MEMBER,
        DateTimeFormat: INTL_MEMBER,
        ListFo