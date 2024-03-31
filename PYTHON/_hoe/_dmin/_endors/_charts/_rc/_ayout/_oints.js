/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { AssertionResult } from '@jest/test-result';
import type { Circus } from '@jest/types';
export declare const makeDescribe: (name: Circus.BlockName, parent?: Circus.DescribeBlock | undefined, mode?: void | "skip" | "only" | "todo" | undefined) => Circus.DescribeBlock;
export declare const makeTest: (fn: Circus.TestFn, mode: Circus.TestMode, name: Circus.TestName, parent: Circus.DescribeBlock, timeout: number | undefined, asyncError: Circus.Exception) => Circus.TestEntry;
declare type DescribeHooks = {
    beforeAll: Array<Circus.Hook>;
    afterAll: Array<Circus.Hook>;
};
export declare const getAllHooksForDescribe: (descr