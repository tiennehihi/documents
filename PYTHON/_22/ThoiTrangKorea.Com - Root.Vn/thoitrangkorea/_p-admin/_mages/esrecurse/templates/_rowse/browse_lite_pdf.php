// Copyright 2012 The Obvious Corporation.

/*
 * bits: Bitwise buffer utilities. The utilities here treat a buffer
 * as a little-endian bigint, so the lowest-order bit is bit #0 of
 * `buffer[0]`, and the highest-order bit is bit #7 of
 * `buffer[buffer.length - 1]`.
 */

/*
 * Modules used
 */
"use strict";
/*
 * Exported bindings
 */

/**
 * Extracts the given number of bits from the buffer at the indicated
 * index, returning a simple number as the result. If bits are requested
 * that aren't covered by the buffer, the `defaultBit` is used as their
 * value.
 *
 * The `bitLength` must be no more than 32. The `defaultBit` if not
 * spec