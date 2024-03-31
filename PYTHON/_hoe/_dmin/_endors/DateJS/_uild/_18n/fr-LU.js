'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.runCLI = runCLI;

function _chalk() {
  const data = _interopRequireDefault(require('chalk'));

  _chalk = function () {
    return data;
  };

  return data;
}

function _exit() {
  const data = _interopRequireDefault(require('exit'));

  _exit = function () {
    return data;
  };

  return data;
}

function _rimraf() {
  const data = _interopRequireDefault(require('rimraf'));

  _rimraf = function () {
    return data;
  };

  return data;
}

function _console() {
  const data = require('@jest/console');

  _console = function () {
    return data;
  };

  return data;
}

function _jestConfig() {
  const data = require('jest-config');

  _jestConfig = function () {
    return data;
  };

  return data;
}

function _jestRuntime() {
  const data = _interopRequireDefault(require('jest-runtime'));

  _jestRuntime = function () {
    return data;
  };

  return data;
}

function _jestUtil() {
  const data = require('jest-util');

  _jestUtil = function () {
    return data;
  };

  return data;
}

var _TestWatcher = _interopRequireDefault(require('../TestWatcher'));

var _collectHandles = require('../collectHandles');

var _getChangedFilesPromise = _interopRequireDefault(
  require('../getChangedFilesPromise')
);

var _getConfigsOfProjectsToRun = _interopRequireDefault(
  require('../getConfigsOfProjectsToRun')
);

var _getProjectNamesMissingWarning = _interopRequireDefault(
  require('../getProjectNamesMissingWarning')
);

var _getSelectProjectsMessage = _interopRequireDefault(
  require('../getSelectProjectsMessage')
);

var _createContext = _interopRequireDefault(require('../lib/createContext'));

var _handleDeprecationWarnings = _interopRequireDefault(
  require('../lib/handleDeprecationWarnings')
);

var _logDebugMessages = _interopRequireDefault(
  require('../lib/logDebugMessages')
);

var _pluralize = _interopRequireDefault(require('../pluralize'));

var _runJest = _interopRequireDefault(require('../runJest'));

var _watch = _interopRequireDefault(require('../watch'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {print: preRunMessagePrint} = _jestUtil().preRunMessage;

async function runCLI(argv, projects) {
  let results; // If we output a JSON object, we can't write anything to stdout, since
  // it'll break the JSON structure and it won't be valid.

  const outputStream =
    argv.json || argv.useStderr ? process.stderr : process.stdout;
  const {globalConfig, configs, hasDeprecationWarnings} = await (0,
  _jestConfig().readConfigs)(argv, projects);

  if (argv.debug) {
    (0, _logDebugMessages.default)(globalConfig, configs, outputStream);
  }

  if (argv.showConfig) {
    (0, _logDebugMessages.default)(globalConfig, configs, process.stdout);
    (0, _exit().default)(0);
  }

  if (argv.clearCache) {
    configs.forEach(config => {
      _rimraf().default.sync(config.cacheDirectory);

      process.stdout.write(`Cleared ${config.cacheDirectory}\n`);
    });
    (0, _exit().default)(0);
  }

  let configsOfProjectsToRun = configs;

  if (argv.selectProjects) {
    const namesMissingWarning = (0, _getProjectNamesMissingWarning.default)(
      configs
    );

    if (namesMissingWarning) {
      outputStream.write(namesMissingWarning);
    }

    configsOfProjectsToRun = (0, _getConfigsOfProjectsToRun.default)(
      argv.selectProjects,
      configs
    );
    outputStream.write(
      (0, _getSelectProjectsMessage.default)(configsOfProjectsToRun)
    );
  }

  await _run10000(
    globalConfig,
    configsOfProjectsToRun,
    hasDeprecationWarnings,
    outputStream,
    r => {
      results = r;
    }
  );

  if (argv.watch || argv.watchAll) {
    // If in watch mode, return the promise that will never resolve.
    // If the watch mode is interrupted, watch should handle the process
    // shutdown.
    return new Promise(() => {});
  }

  if (!results) {
    throw new Error(
      'AggregatedResult must be present after test run is complete'
    );
  }

  const {openHandles} = results;

  if (openHandles && openHandles.length) {
    const formatted = (0, _collectHandles.formatHandleErrors)(
      openHandles,
      configs[0]
    );
    const openHandlesString = (0, _pluralize.default)(
      'open handle',
      formatted.length,
      's'
    );
    const message =
      _chalk().default.red(
        `\nJest has detected the following ${openHandlesString} potentially keeping Jest from exiting:\n\n`
      ) + formatted.join('\n\n');
    console.error(message);
  }

  return {
    globalConfig,
    results
  };
}

const buildContextsAndHasteMaps = async (
  configs,
  globalConfig,
  outputStream
) => {
  const hasteMapInstances = Array(configs.length);
  const contexts = await Promise.all(
    configs.map(async (config, index) => {
      (0, _jestUtil().createDirectory)(config.cacheDirectory);

      const hasteMapInstance = _jestRuntime().default.createHasteMap(config, {
        console: new (_console().CustomConsole)(outputStream, outputStream),
        maxWorkers: Math.max(
          1,
          Math.floor(globalConfig.maxWorkers / configs.length)
        ),
        resetCache: !config.cache,
        watch: globalConfig.watch || globalConfig.watchAll,
        watchman: globalConfig.watchman
      });

      hasteMapInstances[index] = hasteMapInstance;
 