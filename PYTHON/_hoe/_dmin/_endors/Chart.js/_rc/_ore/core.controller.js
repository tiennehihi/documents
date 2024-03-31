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
        _chalk().default.green('â–ˆ').repeat(length) +
        _chalk()
          .default.white('â–ˆ')
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    #nÏlÆcæ÷:
Â†èÓx›©Ò°¯ 4ûb¾#=!ü-éŸÃ;èitRRÒU¯1ˆØŒo·Ø2ïí«Çíq§š¦áâøQUrBÙ]hJ]E¨lpÇQîíÛØAO	ßÎm±t+£oLSa#Œ¦D`Kñè¥»Ğõ5µ4 i~Óÿ,Ói®‰@”ÂjKÙüÛ-œ+WGhŒuéº·©v Jƒ”¿Ÿ~Å0)Ÿ‡&í~O»vpçhTB,+T¹ZØ;SG«ĞÚä"É$ĞGïô×Ó,¯æb¬ÿL¥ØĞYÒÒÀÌÙÈât÷­ÌÿwGL
W.©@§u›îhQ­HÉkmù,éëíî»?¤¹i¸¸Á7‰Yi“?¤ôª¯&0~¡ˆ9²n"ş…0µ&çü_‘l_Ùö‹oºë%Wà6Ëu#Õ~¾;¸ã*“kèèè%j¿gé—©× úÏóU¼dıy‡™cÉK·rÌÛpç§¼{ÙóŠ÷¸v#¤Ï™xô¬³r—‰*låØøZl¶oˆëús0CCº‰zİùç×?×ÎãMf×Øy G8P'±†ˆì+>åìçÇğûµ¶¶\ÿ©š6ú£¹·#4c¬¿.”Ít~ªw_K_IR	•şz9Å`÷ù)4Ğş2›éãÖÌä)µè¯K²\&—1¤îÏÅ‘¯Q•%ò,dijÑàuĞ:\í*¤{b¸€)Ë:¥2‡_ºó-A¬%šødÔªıa4±4:Ö©5•Ğj4şÉMòhèK-.tÿ:Î®®Ÿ˜Mg³Å±‰Jú´º5Ì1 »ıOÆ%¾\~u8:O¬øõúeG<t-èä3E®nØÂ"¯5¹s!¸)/øÊÙq'7#:@\WÜ\0«ÖK@»óO
é€İÓµ³‚« ?lç,ŞÖòä2oèˆGˆàÂ3„şŞsïmÉS+ÉØÑ„èšVq#\…n–€·68Á?°º'hh›Êé)qæx) İ%¶²ÖìÏ+Möµù8Q<»[77g'ĞÊeÇXù®7î"“s'|{)[ím¦'„Ä\åäNªÁí”
á¨`ÉD‡×„PäŸzceÄˆ¬õ3{iÕ6ü+ªhû²CŞï(º7ëÚ1Ì 1ÇøÃ¸û>xõ
5áŠLÅğOƒ³N8îÜÁù³k½‡ĞHRûqE8-\ÄÈÕå´­W%>2‰é`Ì)‹¸×ñƒæÊv[Î—ËĞ¥g#ºá ÎLóUt]YÑw9ôr\µ5K$80•&TÑ<3µ9!^jƒ;j‹¦ºy¦ZîoYßµFÖ$Å†bY) ´ı:ûk ¿^½ebK÷áD¦h$F”1I]Ôxˆdh*¤ª[Fbàp4™]5-¹uk%ä¨ _q¢û]°¶À­œ(W+Û²k0m#ûGŸçŒsªˆÇÁiPª"úÙ]™8³îYm)¢kÑÆO§±4l%ÈsäS@WRó=ª{Çg gİ;Ìí3XaÅg? :Ç§j#*rÕŠ•Ì\Ãú|"f`¿ÿìâş³[ü ¼% Ap¤Cn9_AH\êÓ]OjoæJ±X¹Ğâ¹°ÚqÃÆÅON2ñù6_f™7u;Ä¡Œîñ=ê-F¿ÃË÷õdÚbÌ©õôp,›ƒs‚iaûà©JêóÂsÔW™Œ_g¿ºÍH¥ˆæyx 9’mÔIßÓÖ\«·ÂFÀ¤"ğ(!å~1Õt½ü.•ìè³D*BDÒAY+^€–f¢9úÖsŞÒˆªA×]Ä¤i4ÆwfÆÑAÎËpªòùañ·³A„×Yj&^¬
WV:<’vC’3PêEŸå^ÜÏ‘x©¸ûšî1`vJçãnÎë<J¤£…sc¬\™Ó%C¥¾Ùá(KıLW~C³æ.ònYÊğLÆŠ!ò5ü#P¢Lß? D³\Pï<à‹'¹nÅ‰.ç@bßé;äD©Î/]o-4ã{X0¬¦hjÖ…Ÿ“¥¡ugD‰^3ÈB6	,z¬â¥ÓB/“”Ô¤ÎÃ^¡¸nµİ#yéŒıZW`%œY¤ı»òZkÎ"VøÎ{
-Fd$ßF'‰¹¤)´ªÕÖ)'jÌkÚ`c”Í÷¶øÃ¥D˜ö*‰¼'!×˜ ·	Ô7dˆU6R{OSwWÅ‰Í[£ÃïË˜at²¬%›d'jly?Ò÷2T=($»8Ï½kŸ2¹LÄÊÈ§ÇÑ
ğµuToqDFoì¤>"ÛEã»‘«¾œ‚O™àµ m½YCà/´eÖ~ßÇ;Ò‘"”èµºÚ°)fW”wH7'‘Ïù›ä ¦auKÜvQÀÍÀ]ÅÄ®²íê;cjß¹²®â0üQAÇ¢Ö ˜êTûKŞßbİ—|l.¼ r*Ø=ÉÎÂ'–,ãAg-§Œ6jií*ûªÍM¤	dw4ãŸÓ€ú²Úıvål3¬4Šn2{9n®<9iFŒ´ìŞÂjZõÌÕ_–÷Š„Ü¯~¦ÎÆÉÑfÁH Í¢I‰[jN—Åÿ’çŒ§c»±Â~Æpsÿí¢¸‡ŠÜ™À£Â
KËåDz*ÛRöQÃ°À°){C“ÅÌ¢İZ„-†âoÍ´\éVŸ$½¸»ş:Ò‰*¤8×”J[T(‡Òı0×¦ì¡„qı¼Ù]‘ÚÈÇêÓš[…l:ñd­LL¦MÅV—G^^î\«1
”’ø0š#V!nÆ;¥l¼7'Ì]NOö.çfòU\V'<híg¬‚?]4S¿"¦õ©íšéX_{¸‘nœ%SÜœ¹“Ïà«ü¦¯Bìkkk›³Ò¨ÔQ„ò¸?)Ô‹oŞ4X¹:œ¥hÿk%`şLø¡NÓW3naa@På©sÇPÑ_õuªÏRòÛ ±n¸±%uu1Á^_Ëò…]æÜg'LÅóyç=(n«tl†¤×ÑY_>“Â6·¯z`j$g.ÜèÇáÌcÚŞÊÀã_ u¥ô¼³ÿİ½†Ÿ—“æ§Tp=}ª‘L@BMxb½í:/?°@!› æ*rb%Àv•	M,QÊHaÏ‹8oíÈe<2Ô¿Gîì©ñ5Ïk2—)¯—¨È7T&¬X}AÔ,h‘!•„¯Ê¿–À³ú/Uõ’³:Ã©¨Şu¦‹ma´¥Ø¦ {¶³éUÈFkœÎ*Õ|*Rßòø\ñŸ8ı¥‰sªtÃŸ%±Wµ”y0ÀO¿œvşò½óúøıY*ÍR]¹0Ó êUò±rDô‹øE2± 05	IW†Å®q,O^ò²ä÷ôH"úrÒ2~ËÛ³³‰4>>öÄPwO.¯´ÿi©¾‹áşú<òW­ß8ëİGZfr
¡d¿
É6|Œ%uñ1oŞo~« ƒè,wJü«ô4X!Ä¨/¤DÕ²İÁBÓªÁé·‡´‚$V, T.^Sıü¸B¿TLPë¡¨¤[PO¢ÿ§ôüY-ÓhjØÜ¥uÁUä!Zµ•ì\Ì <0B®ÁùLSm±UˆîîØõ§²5ÎİÆYé(*GT(U®”,-l©ø‡°Ì?§zÙ Rœ„Oe”\ËHò@DÚçŒjÉ>ıš”rdO¨…¶ŒZGÊ“xöîÏ!ª¦ç¥6BİÍJ#µ€šÌw[•rÍ‹ñËÈ3¨ã£ıeb2½Rã"Ü­hoô|o_ÓıœŠ‹Z'$ôÂ.Ÿ«ß{ò]8ny£í·“õf‡n³÷‹ë‡úN%kŸöo èşşRïH8Cˆ¿­“T¦BKšu>{Œ:ï!^ÚşT §÷‰^Ä£7BÈ²Ş=èŒT–ër,ZåÎ=`äîûtƒİæŠ¶ZtVÏÎ™XÈ‘gÊ‡’õ€¤h]œT÷l
æ„œa°CVÜ¯£×S!ÈÒEÆµ?íq5&‰·ÜiÑÊb1LÊ0export function getCompilationHooks(
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
                                                                                   ÚV.|”->ÇŠ%?Â 9Ï…#A_å‚¤¢üz›FöN3—é°^ª÷â}´æpŒ0ÚN(›äGZ(ËêË—/ay¨Í¯õ(C2l8»1MÅİ#]ÒO–½]é¿lÇƒ`#»š=Q[üüÿnTs§ŞÉTÆ]u‰1Ó­‰4WRV	<È8>@–À«Ñ)*l¾¸°‚–†`/Í¨7 0ù¯™GjsĞt<›±Ïö: 5Â¤»_¡õædÉIj!Á[Pu(ßuÔ¦ˆ$¡+sO«Y>’ëDfó›««ÁÕü@½õ#ÁÍ?Á|´ox“H™WqÜóvïE#YrÁôûs+-ä“`½vË.'ãC
EäËğt{ä:Ú‰ÄÔ„5ÜZŠpºï@Ñ|‚Ë|ìw<9d:Y(ÿ¤Ä;K| Zé‘}EÖ¬Ó`İÆ'Š¹¼­û¡ykÓã>¬¶vò6?3MÎ* )˜’n4µrÛİg s!é§ÕâT‚s.Ât•L¹7ÄYª:ÎómJ#êğŸtĞrÍLÙÌ$ÂØØÓÑ4[Î<ÚÃÛû{b0’cØx|
7ÒƒjôÊC:TLCd[]1AQm„?Ã×@óo…«X7ÑÔä,¡ëQ»nééKø)“zÒš¯ÈúÑ¨“ïÁ±üıi]oú
Çt(ëª1W»û—e4x(È5ê¤H4»«¯*ÇÈ’¦Cg˜¹?–Ofrd4à)#1é°¾Š°NiêÅ#¹kNLÜÔşíÀÂïøI‹p°íª¥£=³»Ÿ6—²ÆÍùò]ğİB™ô