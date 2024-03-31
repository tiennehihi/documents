type StrictNullChecksWrapper<Name extends string, Type> = undefined extends null ? `strictNullChecks must be true in tsconfig to use ${Name}` : Type;
type UnionToIntersection<U> = (U extends any ? (_: U) => void : never) extends (_: infer I) => void ? I : never;
export type SomeJSONSchema = UncheckedJSONSchemaType<Known, true>;
type UncheckedPartialSchema<T> = Partial<UncheckedJSONSchemaType<T, true>>;
export type PartialSchema<T> = StrictNullChecksWrapper<"PartialSchema", UncheckedPartialSchema<T>>;
type JSONType<T extends string, IsPartial extends boolean> = IsPartial extends true ? T | undefined : T;
interface NumberKeywords {
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
    format?: string;
}
interface StringKeywords {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
}
type UncheckedJSONSchemaType<T, IsPartial extends boolean> = (// these two unions allow arbitrary unions o