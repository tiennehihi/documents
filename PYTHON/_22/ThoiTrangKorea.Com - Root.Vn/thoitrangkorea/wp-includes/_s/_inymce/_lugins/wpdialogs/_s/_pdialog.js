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
    elements: SomeJTDSchem