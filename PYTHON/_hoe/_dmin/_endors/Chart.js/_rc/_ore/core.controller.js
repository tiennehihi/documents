'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.wrapAnsiString =
  exports.trimAndFormatPath =
  exports.relativePath =
  exports.printDisplayName =
  exports.getSummary =
  exports.formatTestPath =
    void 0;

function path() {
  const data = _interopRequireWildcard(require('path'));

  path = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require('chalk'));

  _chalk = function () {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require('slash'));

  _slash = function () {
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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const PROGRESS_BAR_WIDTH = 40;

const printDisplayName = config => {
  const {displayName} = config;

  const white = _chalk().default.reset.inverse.white;

  if (!displayName) {
    return '';
  }

  const {name, color} = displayName;
  const chosenColor = _chalk().default.reset.inverse[color]
    ? _chalk().default.reset.inverse[color]
    : white;
  return _chalk().default.supportsColor ? chosenColor(` ${name} `) : name;
};

exports.printDisplayName = printDisplayName;

const trimAndFormatPath = (pad, config, testPath, columns) => {
  const maxLength = columns - pad;
  const relative = relativePath(config, testPath);
  const {basename} = relative;
  let {dirname} = relative; // length is ok

  if ((dirname + path().sep + basename).length <= maxLength) {
    return (0, _slash().default)(
      _chalk().default.dim(dirname + path().sep) +
        _chalk().default.bold(basename)
    );
  } // we can fit trimmed dirname and full basename

  const basenameLength = basename.length;

  if (basenameLength + 4 < maxLength) {
    const dirnameLength = maxLength - 4 - basenameLength;
    dirname =
      '...' + dirname.slice(dirname.length - dirnameLength, dirname.length);
    return (0, _slash().default)(
      _chalk().default.dim(dirname + path().sep) +
        _chalk().default.bold(basename)
    );
  }

  if (basenameLength + 4 === maxLength) {
    return (0, _slash().default)(
      _chalk().default.dim('...' + path().sep) + _chalk().default.bold(basename)
    );
  } // can't fit dirname, but can fit trimmed basename

  return (0, _slash().default)(
    _chalk().default.bold(
      '...' + basename.slice(basename.length - maxLength - 4, basename.length)
    )
  );
};

exports.trimAndFormatPath = trimAndFormatPath;

const formatTestPath = (config, testPath) => {
  const {dirname, basename} = relativePath(config, testPath);
  return (0, _slash().default)(
    _chalk().default.dim(dirname + path().sep) + _chalk().default.bold(basename)
  );
};

exports.formatTestPath = formatTestPath;

const relativePath = (config, testPath) => {
  // this function can be called with ProjectConfigs or GlobalConfigs. GlobalConfigs
  // do not have config.cwd, only config.rootDir. Try using config.cwd, fallback
  // to config.rootDir. (Also, some unit just use config.rootDir, which is ok)
  testPath = path().relative(config.cwd || config.rootDir, testPath);
  const dirname = path().dirname(testPath);
  const basename = path().basename(testPath);
  return {
    basename,
    dirname
  };
};

exports.relativePath = relativePath;

const getValuesCurrentTestCases = (currentTestCases = []) => {
  let numFailingTests = 0;
  let numPassingTests = 0;
  let numPendingTests = 0;
  let numTodoTests = 0;
  let numTotalTests = 0;
  currentTestCases.forEach(testCase => {
    switch (testCase.testCaseResult.status) {
      case 'failed': {
        numFailingTests++;
        break;
      }

      case 'passed': {
        numPassingTests++;
        break;
      }

      case 'skipped': {
        numPendingTests++;
        break;
      }

      case 'todo': {
        numTodoTests++;
        break;
      }
    }

    numTotalTests++;
  });
  return {
    numFailingTests,
    numPassingTests,
    numPendingTests,
    numTodoTests,
    numTotalTests
  };
};

const getSummary = (aggregatedResults, options) => {
  let runTime = (Date.now() - aggregatedResults.startTime) / 1000;

  if (options && options.roundTime) {
    runTime = Math.floor(runTime);
  }

  const valuesForCurrentTestCases = getValuesCurrentTestCases(
    options === null || options === void 0 ? void 0 : options.currentTestCases
  );
  const estimatedTime = (options && options.estimatedTime) || 0;
  const snapshotResults = aggregatedResults.snapshot;
  const snapshotsAdded = snapshotResults.added;
  const snapshotsFailed = snapshotResults.unmatched;
  const snapshotsOutdated = snapshotResults.unchecked;
  const snapshotsFilesRemoved = snapshotResults.filesRemoved;
  const snapshotsDidUpdate = snapshotResults.didUpdate;
  const snapshotsPassed = snapshotResults.matched;
  const snapshotsTotal = snapshotResults.total;
  const snapshotsUpdated = snapshotResults.updated;
  const suitesFailed = aggregatedResults.numFailedTestSuites;
  const suitesPassed = aggregatedResults.numPassedTestSuites;
  const suitesPending = aggregatedResults.numPendingTestSuites;
  const suitesRun = suitesFailed + suitesPassed;
  const suitesTotal = aggregatedResults.numTotalTestSuites;
  const testsFailed = aggregatedResults.numFailedTests;
  const testsPassed = aggregatedResults.numPassedTests;
  const testsPending = aggregatedResults.numPendingTests;
  const testsTodo = aggregatedResults.numTodoTests;
  const testsTotal = aggregatedResults.numTotalTests;
  const width = (options && options.width) || 0;
  const suites =
    _chalk().default.bold('Test Suites: ') +
    (suitesFailed
      ? _chalk().default.bold.red(`${suitesFailed} failed`) + ', '
      : '') +
    (suitesPending
      ? _chalk().default.bold.yellow(`${suitesPending} skipped`) + ', '
      : '') +
    (suitesPassed
      ? _chalk().default.bold.green(`${suitesPassed} passed`) + ', '
      : '') +
    (suitesRun !== suitesTotal
      ? suitesRun + ' of ' + suitesTotal
      : suitesTotal) +
    ' total';
  const updatedTestsFailed =
    testsFailed + valuesForCurrentTestCases.numFailingTests;
  const updatedTestsPending =
    testsPending + valuesForCurrentTestCases.numPendingTests;
  const updatedTestsTodo = testsTodo + valuesForCurrentTestCases.numTodoTests;
  const updatedTestsPassed =
    testsPassed + valuesForCurrentTestCases.numPassingTests;
  const updatedTestsTotal =
    testsTotal + valuesForCurrentTestCases.numTotalTests;
  const tests =
    _chalk().default.bold('Tests:       ') +
    (updatedTestsFailed > 0
      ? _chalk().default.bold.red(`${updatedTestsFailed} failed`) + ', '
      : '') +
    (updatedTestsPending > 0
      ? _chalk().default.bold.yellow(`${updatedTestsPending} skipped`) + ', '
      : '') +
    (updatedTestsTodo > 0
      ? _chalk().default.bold.magenta(`${updatedTestsTodo} todo`) + ', '
      : '') +
    (updatedTestsPassed > 0
      ? _chalk().default.bold.green(`${updatedTestsPassed} passed`) + ', '
      : '') +
    `${updatedTestsTotal} total`;
  const snapshots =
    _chalk().default.bold('Snapshots:   ') +
    (snapshotsFailed
      ? _chalk().default.bold.red(`${snapshotsFailed} failed`) + ', '
      : '') +
    (snapshotsOutdated && !snapshotsDidUpdate
      ? _chalk().default.bold.yellow(`${snapshotsOutdated} obsolete`) + ', '
      : '') +
    (snapshotsOutdated && snapshotsDidUpdate
      ? _chalk().default.bold.green(`${snapshotsOutdated} removed`) + ', '
      : '') +
    (snapshotsFilesRemoved && !snapshotsDidUpdate
      ? _chalk().default.bold.yellow(
          (0, _jestUtil().pluralize)('file', snapshotsFilesRemoved) +
            ' obsolete'
        ) + ', '
      : '') +
    (snapshotsFilesRemoved && snapshotsDidUpdate
      ? _chalk().default.bold.green(
          (0, _jestUtil().pluralize)('file', snapshotsFilesRemoved) + ' removed'
        ) + ', '
      : '') +
    (snapshotsUpdated
      ? _chalk().default.bold.green(`${snapshotsUpdated} updated`) + ', '
      : '') +
    (snapshotsAdded
      ? _chalk().default.bold.green(`${snapshotsAdded} written`) + ', '
      : '') +
    (snapshotsPassed
      ? _chalk().default.bold.green(`${snapshotsPassed} passed`) + ', '
      : '') +
    `${snapshotsTotal} total`;
  const time = renderTime(runTime, estimatedTime, width);
  return [suites, tests, snapshots, time].join('\n');
};

exports.getSummary = getSummary;

const renderTime = (runTime, estimatedTime, width) => {
  // If we are more than one second over the estimated time, highlight it.
  const renderedTime =
    estimatedTime && runTime >= estimatedTime + 1
      ? _chalk().default.bold.yellow((0, _jestUtil().formatTime)(runTime, 0))
      : (0, _jestUtil().formatTime)(runTime, 0);
  let time = _chalk().default.bold('Time:') + `        ${renderedTime}`;

  if (runTime < estimatedTime) {
    time += `, estimated ${(0, _jestUtil().formatTime)(estimatedTime, 0)}`;
  } // Only show a progress bar if the test run is actually going to take
  // some time.

  if (estimatedTime > 2 && runTime < estimatedTime && width) {
    const availableWidth = Math.min(PROGRESS_BAR_WIDTH, width);
    const length = Math.min(
      Math.floor((runTime / estimatedTime) * availableWidth),
      availableWidth
    );

    if (availableWidth >= 2) {
      time +=
        '\n' +
        _chalk().default.green('█').repeat(length) +
        _chalk()
          .default.white('█')
          .repeat(availableWidth - length);
    }
  }

  return time;
}; // word-wrap a string that contains ANSI escape sequences.
// ANSI escape sequences do not add to the string length.

const wrapAnsiString = (string, terminalWidth) => {
  if (terminalWidth === 0) {
    // if the terminal width is zero, don't bother word-wrapping
    return string;
  }

  const ANSI_REGEXP = /[\u001b\u009b]\[\d{1,2}m/gu;
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = ANSI_REGEXP.exec(string))) {
    const ansi = match[0];
    const index = match['index'];

    if (index != lastIndex) {
      tokens.push(['string', string.slice(lastIndex, index)]);
    }

    tokens.push(['ansi', ansi]);
    lastIndex = index + ansi.length;
  }

  if (lastIndex != string.length - 1) {
    tokens.push(['string', string.slice(lastIndex, string.length)]);
  }

  let lastLineLength = 0;
  return tokens
    .reduce(
      (lines, [kind, token]) => {
        if (kind === 'string') {
          if (lastLineLength + token.length > terminalWidth) {
            while (token.length) {
              const chunk = token.slice(0, terminalWidth - lastLineLength);
              const remaining = token.slice(
                terminalWidth - lastLineLength,
                token.length
              );
              lines[lines.length - 1] += chunk;
              lastLineLength += chunk.length;
              token = remaining;

              if (token.length) {
                lines.push('');
                lastLineLength = 0;
              }
            }
          } else {
            lines[lines.length - 1] += token;
            lastLineLength += token.length;
          }
        } else {
          lines[lines.length - 1] += token;
        }

        return lines;
      },
      ['']
    )
    .join('\n');
};

exports.wrapAnsiString = wrapAnsiString;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    #�n�l�c��:
����x��Ұ� 4�b�#=!�-��;�itRR�U�1�،o��2����q������QUrB�]h�J]E�lp�Q����AO	��m�t+�oLSa#��D`K�襻��5�4 i~��,�i��@��jK���-�+WGh�u麍��v J�����~�0)��&�~O�vp�hTB,+T�Z�;SG����"�$�G�����,��b��L���Y�������t����wGL
W.�@�u��hQ�H�km�,����?��i���7��Yi�?����&0~���9�n"��0�&��_�l_���o��%W�6�u#�~�;��*�k���%j�g闩�����U�d�y��c�K�r��p秼{����v#�ϙx���r��*l���Zl�o���s0CC��z����?���Mf��y G8P�'����+>���������\���6�����#4c��.��t~�w_K_IR	��z9�`��)4���2������)��K�\&�1���ő�Q�%�,dij��u�:\�*�{b��)�:�2�_��-A�%��dԪ�a4�4:֩5��j�4��M�h�K-.t�:ΐ����Mg�ű��J���5�1 ��O�%�\~u8:O�����eG�<t-��3E�n��"�5�s!�)/���q'7#:@\W�\0��K@��O
��������?l�,����2o�G����3���s��m�S+��ф�Vq#\�n���68�?��'hh���)q�x) �%�����+M���8Q�<�[77g'���e�X��7�"�s'|{)[�m�'��\��N����
�`�D��ׄP�zceĈ��3{i��6�+�h��C��(�7�ڍ1̠1��ø��>x�
5��L��O��N8�����k���HR�qE8-\������W%>2��`�)������v[�Η�Хg#����L�U�t]Y�w9�r\�5K$�80���&T�<3�9!^j�;j���y�Z�oYߵF�$ņbY)���:�k �^�ebK��D�h$F�1I]�x�dh*��[Fb�p4�]5-�uk%���_q��]�����(W+۲k0m#�G��s����iP�"��]�8��Ym)�k��O��4l%�s�S@WR�=�{�g g�;��3Xa�g?�:ǧj#*rՊ��\��|"f`������[� �% Ap�Cn9_AH\��]Ojo�J�X��⹰�q���ON2���6_f�7u;ġ���=�-F�����d�b̩��p,��s�ia��J���s�W��_g���H����yx 9�m��I�Ӑ�\���F��"�(!�~1�t��.���D*BD�AY+^��f�9��s����A�]Ĥi4�wf��A��p���a�A��Yj&�^�
WV:�<�vC�3P�E���^�ϑx�����1`vJ��n��<J���sc�\��%C�����(K�LW~C��.�nY��LƊ!�5�#P�L�?�D��\P�<��'��nŉ.��@b��;��D��/]o-4�{X0��hjօ������ugD�^3�B6	,z���B/��Ԥ��^���n��#y��ZW`%�Y������Zk��"V��{
-Fd$�F'���)����)'j�k�`c�����åD��*��'!ט��	�7d�U6R{OSwWŉ�[���˘a�t��%�d'jly?��2T=($�8Ͻk�2�L��ȧ��
�uToqDFo��>"�E������O��� m�YC�/�e�~��;ґ"�赺ڰ)fW��wH7'����� �auK�v�Q���]�Į���;cj������0�QAǢ� ��T�K��bݗ|l.��r*�=���'�,�Ag-��6ji�*���M�	dw4�Ӏ����v�l3�4�n2{9n�<9iF�����jZ���_����ܯ~�����f�H�͢I�[jN�Ł�����c���~�ps�����ܙ���
K��Dz*�R�Qð��){C��̢�Z�-��o��\�V�$�����:҉*�8הJ�[T(���0צ졄q���]�����Ӛ[�l:�d�LL�M��V�G^^�\�1
���0�#V!n�;�l�7'�]NO��.�f�U\V'<h�g��?]4S�"�����X_{��n�%Sܜ�������B�kkk��Ҩ�Q��?)ԋo�4X�:��h�k%`�L��N�W�3naa@P�s�P�_�u��R�۠�n��%uu�1�^_��]��g'L��y�=(n�tl����Y_>��6��z`j$g.�����c�����_�u�����ݽ�����Tp�=}��L@BMxb��:/?�@!� �*rb%�v�	M,Q�Haϋ8o��e<2ԿG���5�k2�)����7T&�X}A�,h�!���ʿ����/U���:é��u���ma���ئ {����U�Fk��*�|*R���\�8���s��tß%�W��y0�O��v������Y*�R]�0� ��U�rD��E2���05	IW�Ůq,O�^����H"��r�2~��۳��4>>���PwO.���i������<�W���8��GZfr
�d�
�6|�%u�1o�o~����,wJ���4X!Ĩ/�Dղ��BӪ�鷇��$V,�T.^S���B�TLP�롨�[PO�����Y�-�hj�ܥu�U�!Z���\� <0B���LSm��U�������5���Y�(*GT(U��,-l�����?�z� R���Oe�\�H�@D��j�>���rdO����ZGʓx����!���6B��J#����w[��r͋����3���eb2�R�"ܭho�|o_�����Z'$��.���{�]8ny���f�n�����N%k���o ���R�H8C����T�BK�u>{�:�!^��T ���^��7BȞ��=��T��r,Z��=`���t��抶ZtV���Xȑgʇ����h]�T�l
���a�CVܯ��S!��EƵ?�q5&���i���b1Lʐ0export function getCompilationHooks(
  compilation: Compilation
): MiniCssExtractPluginCompilationHooks;
export type Compilation = import("webpack").Compilation;
export type VarNames = {
  tag: string;
  chunkId: string;
  href: string;
  resolve: string;
  reject: string;
};
export type MiniCssExtractPluginCompilationHooks = {
  beforeTagInsert: import("tapable").SyncWaterfallHook<
    [string, VarNames],
    string
  >;
};
                                                                                   �V.|�->Ǌ%?� 9υ#A_傤��z�F�N3��^���}��p�0�N(��GZ(��˗/ay�ͯ�(C2l8�1M��#]�O��]�l��`#��=Q[���nTs���T�]u�1ӭ�4WRV	<�8>@������)*l������`/ͨ7�0�����Gjs�t<��ϝ�: 5¤�_���d�Ij!�[Pu(�uԦ�$�+sO�Y>��Df󛫫���@��#��?��|�ox�H�Wq��v��E#Yr���s+-�`�v�.'�C
E���t{�:�ډ�Ԅ5�Z�p��@�|��|�w<9d:Y(���;K|�Z�}E֬�`��'������yk��>��v��6?3M��*�)��n4�r��g s!���T�s.�t��L�7�Y�:��mJ#��t�r�L�̎$������4[Ν<����{b0��c�x|
7҃j��C:TLCd[]1AQm�?��@�o��X7����,��Q��n��K�)�zҚ���Ѩ������i]o�
�t(�1W���e4x(�5�H4���*�Ȓ�Cg��?�Ofrd4�)#1鰾��Ni��#�kNL�������I�p���=���6������]��B��