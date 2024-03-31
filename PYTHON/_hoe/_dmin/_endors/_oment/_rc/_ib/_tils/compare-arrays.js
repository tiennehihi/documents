/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Reporter, RunDetails } from '../types';
import type { SpecResult } from './Spec';
import type { SuiteResult } from './Suite';
import type Timer from './Timer';
export default class JsApiReporter implements Reporter {
    started: boolean;
    finished: boolean;
    runDetails: RunDetails;
    jasmineSta