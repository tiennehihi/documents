import * as Types from '../typebox';
export declare class ValueCreateUnknownTypeError extends Error {
    readonly schema: Types.TSchema;
    constructor(schema: Types.TSchema);
}
export declare class ValueCreateNeverTypeError extends Error {
    readonly schema: Types.TSchema;
    constructor(schema: Types.TSchema);
}
export declare namespace ValueCr