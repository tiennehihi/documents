/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type { ForkOptions } from 'child_process';
import type { EventEmitter } from 'events';
export interface ResourceLimits {
    maxYoungGenerationSizeMb?: number;
    maxOldGenerationSizeMb?: number;
    codeRangeSizeMb?: number;
    stackSizeMb?: number;
}
export declare const CHILD_MESSAGE_INITIALIZE: 0;
export declare const CHILD_MESSAGE_CALL: 1;
export declare const CHILD_MESSAGE_END: 2;
export declare const PARENT_MESSAGE_OK: 0;
export declare const PARENT_MESSAGE_CLIENT_ERROR: 1;
export declare const PARENT_MESSAGE_SETUP_ERROR: 2;
expor