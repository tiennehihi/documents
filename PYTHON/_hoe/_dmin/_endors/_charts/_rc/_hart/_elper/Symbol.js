"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseClassMemberOfClassElement = exports.getIteratorYieldResultFromIteratorResult = exports.getInstanceTypeOfClassLikeDeclaration = exports.getConstructorTypeOfClassLikeDeclaration = exports.getSymbolOfClassLikeDeclaration = exports.getPropertyNameFromType = exports.symbolHasReadonlyDeclaration = exports.isPropertyReadonlyInType = exports.getWellKnownSymbolPropertyOfType = exports.getPropertyOfType = exports.isBooleanLiteralType = exports.isFalsyType = exports.isThenableType = exports.someTypePart = exports.intersectionTypeParts = exports.unionTypeParts = exports.getCallSignaturesOfType = exports.isTypeAssignableToString = exports.isTypeAssignableToNumber = exports.isOptionalChainingUndefinedMarkerType = exports.removeOptionalChainingUndefinedMarkerType = exports.removeOptionalityFromType = exports.isEmptyObjectType = void 0;
const ts = require("typescript");
const type_1 = require("../typeguard/type");
const util_1 = require("./util");
const node_1 = require("../typeguard/node");
function isEmptyObjectType(type) {
    if (type_1.isObjectType(type) &&
        type.objectFlags & ts.ObjectFlags.Anonymous &&
        type.getProperties().length === 0 &&
        type.getCallSignatures().length === 0 &&
        type.getConstructSignatures().length === 0 &&
        type.getStringIndexType() === undefined &&
        type.getNumberIndexType() === undefined) {
        const baseTypes = type.getBaseTypes();
        return baseTypes === undefined || baseTypes.every(isEmptyObjectType);
    }
    return false;
}
exports.isEmptyObjectType = isEmptyObjectType;
function removeOptionalityFromType(checker, type) {
    if (!containsTypeWithFlag(type, ts.TypeFlags.Undefined))
        return type;
    const allowsNull = containsTypeWithFlag(type, ts.TypeFlags.Null);
    type = checker.getNonNullableType(type);
    return allowsNull ? checker.getNullableType(type, ts.TypeFlags.Null) : type;
}
exports.removeOptionalityFromType = removeOptionalityFromType;
function containsTypeWithFlag(type, flag) {
    for (const t of unionTypeParts(type))
        if (util_1.isTypeFlagSet(t, flag))
            return true;
    return false;
}
function removeOptionalChainingUndefinedMarkerType(checker, type) {
    if (!type_1.isUnionType(type))
        return isOptionalChainingUndefinedMarkerType(checker, type) ? type.getNonNullableType() : type;
    let flags = 0;
    let containsUndefinedMarker = false;
    for (const t of type.types) {
        if (isOptionalChainingUndefinedMarkerType(checker, t)) {
            containsUndefinedMarker = true;
        }
        else {
            flags |= t.flags;
        }
    }
    return containsUndefinedMarker
        ? checker.getNullableType(type.getNonNullableType(), flags)
        : type;
}
exports.removeOptionalChainingUndefinedMarkerType = removeOptionalChainingUndefinedMarkerType;
function isOptionalChainingUndefinedMarkerType(checker, t) {
    return util_1.isTypeFlagSet(t, ts.TypeFlags.Undefined) && checker.getNullableType(t.getNonNullableType(), ts.TypeFlags.Undefined) !== t;
}
exports.isOptionalChainingUndefinedMarkerType = isOptionalChainingUndefinedMarkerType;
function isTypeAssignableToNumber(checker, type) {
    return isTypeAssignableTo(checker, type, ts.TypeFlags.NumberLike);
}
exports.isTypeAssignableToNumber = isTypeAssignableToNumber;
function isTypeAssignableToString(checker, type) {
    return isTypeAssignableTo(checker, type, ts.TypeFlags.StringLike);
}
exports.isTypeAssignableToString = isTypeAssignableToString;
function isTypeAssignableTo(checker, type, flags) {
    flags |= ts.TypeFlags.Any;
    let typeParametersSeen;
    return (function check(t) {
        if (type_1.isTypeParameter(t) && t.symbol !== undefined && t.symbol.declarations !== undefined) {
            if (typeParametersSeen === undefined) {
                typeParametersSeen = new Set([t]);
            }
            else if (!typeParametersSeen.has(t)) {
                typeParametersSeen.add(t);
            }
            else {
                return false;
            }
            const declaration = t.symbol.declarations[0];
            if (declaration.constraint === undefined)
                return true; // TODO really?
            return check(checker.getTypeFromTypeNode(declaration.constraint));
        }
        if (type_1.isUnionType(t))
            return t.types.every(check);
        if (type_1.isIntersectionType(t))
            return t.types.some(check);
        return util_1.isTypeFlagSet(t, flags);
    })(type);
}
function getCallSignaturesOfType(type) {
    if (type_1.isUnionType(type)) {
        const signatures = [];
        for (const t of type.types)
            signatures.push(...getCallSignaturesOfType(t));
        return signatures;
    }
    if (type_1.isIntersectionType(type)) {
        let signatures;
        for (const t of type.types) {
            const sig = getCallSignaturesOfType(t);
            if (sig.length !== 0) {
                if (signatures !== undefined)
                    return []; // if more than one type of the intersection has call signatures, none of them is useful for inference
                signatures = sig;
            }
        }
        return signatures === undefined ? [] : signatures;
    }
    return type.getCallSignatures();
}
exports.getCallSignaturesOfType = getCallSignaturesOfType;
/** Returns all types of a union type or an array containing `type` itself if it's no union type. */
function unionTypeParts(type) {
    return type_1.isUnionType(type) ? type.types : [type];
}
exports.unionTypeParts = unionTypeParts;
/** Returns all types of a intersection type or an array containing `type` itself if it's no intersection type. */
function intersectionTypeParts(type) {
    return type_1.isIntersectionType(type) ? type.types : [type];
}
exports.intersectionTypeParts = intersectionTypeParts;
function someTypePart(type, predicate, cb) {
    return predicate(type) ? type.types.some(cb) : cb(type);
}
exports.someTypePart = someTypePart;
function isThenableType(checker, node, type = checker.getTypeAtLocation(node)) {
    for (const ty of unionTypeParts(checker.getApparentType(type))) {
        const then = ty.getProperty('then');
        if (then === undefined)
            continue;
        const thenType = checker.getTypeOfSymbolAtLocation(then, node);
        for (const t of unionTypeParts(thenType))
            for (const signature of t.getCallSignatures())
                if (signature.parameters.length !== 0 && isCallback(checker, signature.parameters[0], node))
                    return true;
    }
    return false;
}
exports.isThenableType = isThenableType;
function isCallback(checker, param, node) {
    let type = checker.getApparentType(checker.getTypeOfSymbolAtLocation(param, node));
    if (param.valueDeclaration.dotDotDotToken) {
        // unwrap array type of rest parameter
        type = type.getNumberIndexType();
        if (type === undefined)
            return false;
    }
    for (const t of unionTypeParts(type))
        if (t.getCallSignatures().length !== 0)
            return true;
    return false;
}
/** Determine if a type is definitely falsy. This function doesn't unwrap union types. */
function isFalsyType(type) {
    if (type.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null | ts.TypeFlags.Void))
        return true;
    if (type_1.isLiteralType(type))
        return !type.value;
    return isBooleanLiteralType(type, false);
}
exports.isFalsyType = isFalsyType;
/** Determines whether the given type is a boolean literal type and matches the given boolean literal (true or false). */
function isBooleanLiteralType(type, literal) {
    return util_1.isTypeFlagSet(type, ts.TypeFlags.BooleanLiteral) &&
        type.intrinsicName === (literal 