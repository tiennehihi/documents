import { Slice } from './Slice';
import { IWriterGrowable, IWriter } from './types';
declare global {
    interface Uint8Array {
        utf8Write(str: string, pos: number, maxLength: number): number;
        write(str: string, pos: number, maxLength: number, encoding: string): number;
    }
}
/**
 * Encoder class provides an efficient way to encode binary data. It grows the
 * internal memory buffer automatically as more space is required. It is useful
 * in cases when it is not known in advance the size of memory needed.
 */
export declare class Writer implements IWriter, IWriterGrowable {
    allocSize: number;
    /** @ignore */
    uint8: Uint8Array;
    /** @ignore */
    view: DataView;
    /** @ignore */
    x0: number;
    /** @ignore */
    x: number;
    protected size: number;
    /**
     * @param allocSize Number of bytes to allocate at a time when buffer ends.
     */
    constructor(allocSize?: number);
    /** @ignore */
    protected grow(size: number): void;
    /**
     * Make sure the internal buffer has enough space to write the specified number
     * of bytes, otherwise resize the internal buffer to accommodate for more size.
     *
     * @param capacity Number of bytes.
     */
    ensureCapacity(capacity: number): void;
    /** @todo Consider renaming to "skip"? */
    move(capacity: number): void;
    reset(): void;
    /**
     * Allocates a new {@link ArrayBuffer}, useful when the underlying
     * {@link ArrayBuffer} cannot be shared between threads.
     *
     * @param size Size of memory to allocate.
     */
    newBuffer(size: number): void;
    /**
     * @returns Encoded memory buffer conte