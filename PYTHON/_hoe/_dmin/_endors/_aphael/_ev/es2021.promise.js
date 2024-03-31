import { ITypeSuite, TType } from "./types";
import { IErrorDetail } from "./util";
/**
 * Export functions used to define interfaces.
 */
export { TArray, TEnumType, TEnumLiteral, TFunc, TIface, TLiteral, TName, TOptional, TParam, TParamList, TProp, TTuple, TType, TUnion, TIntersection, array, enumlit, enumtype, func, iface, lit, name, opt, param, tuple, union, intersection, BasicType, ITypeSuite, } from "./types";
export { VError, IErrorDetail } from './util';
export interface ICheckerSuite {
    [name: string]: Checker;
}
/**
 * Takes one of more type suites (