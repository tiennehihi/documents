/** numeric strings */
type NumberType = "float32" | "float64" | "int8" | "uint8" | "int16" | "uint16" | "int32" | "uint32";
/** string strings */
type StringType = "string" | "timestamp";
/** Generic JTD Schema without inference of the represented type */
export type SomeJTDSchemaType = (// ref
{
    ref: string;
} | {
    type: NumberType | StringType | "boolean";
} | {
    enum: string[];
} | {
    elements: SomeJTDSchemaType;
} | {
    values: SomeJTDSchemaType;
} | {
    properties: Record<string, SomeJTDSchemaType>;
    optionalProperties?: Record<string, SomeJTDSchemaType>;
    additionalProperties?: boolean;
} | {
    properties?: Record<string, SomeJTDSchemaType>;
    optionalProperties: Record<string, SomeJTDSchemaType>;
    additionalProperties?: boolean;
} | {
    discriminator: string;
    mapping: Record<string, SomeJTDSchemaType>;
} | {}) & {
    nullable?: boolean;
    metadata?: Record<string, unknown>;
    definitions?: Record<string, SomeJTDSchemaType>;
};
/** required keys of an object, not undefined */
type RequiredKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];
/** optional or undifined-able keys of an object */
type OptionalKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];
/** type is true if T is a union type */
type IsUnion_<T, U extends T = T> = false extends (T extends unknown ? ([U] extends [T] ? false : true) : never) ? false : true;
type IsUnion<T> = IsUnion_<T>;
/** type is true if T is identically E */
type TypeEquality<T, E> = [T] extends [E] ? ([E] extends [T] ? true : false) : false;
/** type is true if T or null is identically E or null*/
type NullTypeEquality<T, E> = TypeEquality<T | null, E | null>;
/** gets only the string literals of a type or null if a type