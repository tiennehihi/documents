'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createTestScheduler = createTestScheduler;

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

function _reporters() {
  const data = require('@jest/reporters');

  _reporters = function () {
    return data;
  };

  return data;
}

function _testResult() {
  const data = require('@jest/test-result');

  _testResult = function () {
    return data;
  };

  return data;
}

function _transform() {
  const data = require('@jest/transform');

  _transform = function () {
    return data;
  };

  return data;
}

function _jestMessageUtil() {
  const data = require('jest-message-util');

  _jestMessageUtil = function () {
    return data;
  };

  return data;
}

function _jestSnapshot() {
  const data = _interopRequireDefault(require('jest-snapshot'));

  _jestSnapshot = function () {
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

var _ReporterDispatcher = _interopRequireDefault(
  require('./ReporterDispatcher')
);

var _testSchedulerHelper = require('./testSchedulerHelper');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

async function createTestScheduler(globalConfig, options, context) {
  const scheduler = new TestScheduler(globalConfig, options, context);
  await scheduler._setupReporters();
  return scheduler;
}

class TestScheduler {
  constructor(globalConfig, options, context) {
    _defineProperty(this, '_dispatcher', void 0);

    _defineProperty(this, '_globalConfig', void 0);

    _defineProperty(this, '_options', void 0);

    _defineProperty(this, '_context', void 0);

    this._dispatcher = new _ReporterDispatcher.default();
    this._globalConfig = globalConfig;
    this._options = options;
    this._context = context;
  }

  addReporter(reporter) {
    this._dispatcher.register(reporter);
  }

  removeReporter(ReporterClass) {
    this._dispatcher.unregister(ReporterClass);
  }

  async scheduleTests(tests, watcher) {
    const onTestFileStart = this._dispatcher.onTestFileStart.bind(
      this._dispatcher
    );

    const timings = [];
    const contexts = new Set();
    tests.forEach(test => {
      contexts.add(test.context);

      if (test.duration) {
        timings.push(test.duration);
      }
    });
    const aggregatedResults = createAggregatedResults(tests.length);
    const estimatedTime = Math.ceil(
      getEstimatedTime(timings, this._globalConfig.maxWorkers) / 1000
    );
    const runInBand = (0, _testSchedulerHelper.shouldRunInBand)(
      tests,
      timings,
      this._globalConfig
    );

    const onResult = async (test, testResult) => {
      if (watcher.isInterrupted()) {
        return Promise.resolve();
      }

      if (testResult.testResults.length === 0) {
        const message = 'Your test suite must contain at least one test.';
        return onFailure(test, {
          message,
          stack: new Error(message).stack
        });
      } // Throws when the context is leaked after executing a test.

      if (testResult.leaks) {
        const message =
          _chalk().default.red.bold('EXPERIMENTAL FEATURE!\n') +
          'Your test suite is leaking memory. Please ensure all references are cleaned.\n' +
          '\n' +
          'There is a number of things that can leak memory:\n' +
          '  - Async operations that have not finished (e.g. fs.readFile).\n' +
          '  - Timers not properly mocked (e.g. setInterval, setTimeout).\n' +
          '  - Keeping references to the global scope.';
        return onFailure(test, {
          message,
          stack: new Error(message).stack
        });
      }

      (0, _testResult().addResult)(aggregatedResults, testResult);
      await this._dispatcher.onTestFileResult(
        test,
        testResult,
        aggregatedResults
      );
      return this._bailIfNeeded(contexts, aggregatedResults, watcher);
    };

    const onFailure = async (test, error) => {
      if (watcher.isInterrupted()) {
        return;
      }

      const testResult = (0, _testResult().buildFailureTestResult)(
        test.path,
        error
      );
      testResult.failureMessage = (0, _jestMessageUtil().formatExecError)(
        testResult.testExecError,
        test.context.config,
        this._globalConfig,
        test.path
      );
      (0, _testResult().addResult)(aggregatedResults, testResult);
      await this._dispatcher.onTestFileResult(
        test,
        testResult,
        aggregatedResults
      );
    };

    const updateSnapshotState = async () => {
      const contextsWithSnapshotResolvers = await Promise.all(
        Array.from(contexts).map(async context => [
          context,
          await _jestSnapshot().default.buildSnapshotResolver(context.config)
        ])
      );
      contextsWithSnapshotResolvers.forEach(([context, snapshotResolver]) => {
        const status = _jestSnapshot().default.cleanup(
          context.hasteFS,
          this._globalConfig.updateSnapshot,
          snapshotResolver,
          context.config.testPathIgnorePatterns
        );

        aggregatedResults.snapshot.filesRemoved += status.filesRemoved;
        aggregatedResults.snapshot.filesRemovedList = (
          aggregatedResults.snapshot.filesRemovedList || []
        ).concat(status.filesRemovedList);
      });
      const updateAll = this._globalConfig.updateSnapshot === 'all';
      aggregatedResults.snapshot.didUpdate = updateAll;
      aggregatedResults.snapshot.failure = !!(
        !updateAll &&
        (aggregatedResults.snapshot.unchecked ||
          aggregatedResults.snapshot.unmatched ||
          aggregatedResults.snapshot.filesRemoved)
      );
    };

    await this._dispatcher.onRunStart(aggregatedResults, {
      estimatedTime,
      showStatus: !runInBand
    });
    const testRunners = Object.create(null);
    const contextsByTestRunner = new WeakMap();
    await Promise.all(
      Array.from(contexts).map(async context => {
        const {config} = context;

        if (!testRunners[config.runner]) {
          var _this$_context, _this$_context2;

          const transformer = await (0, _transform().createScriptTransformer)(
            config
          );
          const Runner = await transformer.requireAndTranspileModule(
            config.runner
          );
          const runner = new Runner(this._globalConfig, {
            changedFiles:
              (_this$_context = this._context) === null ||
              _this$_context === void 0
                ? void 0
                : _this$_context.changedFiles,
            sourcesRelatedToTestsInChangedFiles:
              (_this$_context2 = this._context) === null ||
              _this$_context2 === void 0
                ? void 0
                : _this$_context2.sourcesRelatedToTestsInChangedFiles
          });
          testRunners[config.runner] = runner;
          contextsByTestRunner.set(runner, context);
        }
      })
    );

    const testsByRunner = this._partitionTests(testRunners, tests);

    if (testsByRunner) {
      try {
        for (const runner of Object.keys(testRunners)) {
          const testRunner = testRunners[runner];
          const context = contextsByTestRunner.get(testRunner);
          invariant(context);
          const tests = testsByRunner[runner];
          const testRunnerOptions = {
            serial: runInBand || Boolean(testRunner.isSerial)
          };
          /**
           * Test runners with event emitters are still not supported
           * for third party test runners.
           */

          if (testRunner.__PRIVATE_UNSTABLE_API_supportsEventEmitters__) {
            const unsubscribes = [
              testRunner.on('test-file-start', ([test]) =>
                onTestFileStart(test)
              ),
              testRunner.on('test-file-success', ([test, testResult]) =>
                onResult(test, testResult)
              ),
              testRunner.on('test-file-failure', ([test, error]) =>
                onFailure(test, error)
              ),
              testRunner.on(
                'test-case-result',
                ([testPath, testCaseResult]) => {
                  const test = {
                    context,
                    path: testPath
                  };

                  this._dispatcher.onTestCaseResult(test, testCaseResult);
                }
              )
            ];
            await testRunner.runTests(
              tests,
              watcher,
              undefined,
              undefined,
              undefined,
              testRunnerOptions
            );
            unsubscribes.forEach(sub => sub());
          } else {
            await testRunner.runTests(
              tests,
              watcher,
              onTestFileStart,
              onResult,
              onFailure,
              testRunnerOptions
            );
          }
        }
      } catch (error) {
        if (!watcher.isInterrupted()) {
          throw error;
        }
      }
    }

    await updateSnapshotState();
    aggregatedResults.wasInterrupted = watcher.isInterrupted();
    await this._dispatcher.onRunComplete(contexts, aggregatedResults);
    const anyTestFailures = !(
      aggregatedResults.numFailedTests === 0 &&
      aggregatedResults.numRuntimeErrorTestSuites === 0
    );

    const anyReporterErrors = this._dispatcher.hasErrors();

    aggregatedResults.success = !(
      anyTestFailures ||
      aggregatedResults.snapshot.failure ||
      anyReporterErrors
    );
    return aggregatedResults;
  }

  _partitionTests(testRunners, tests) {
    if (Object.keys(testRunners).length > 1) {
      return tests.reduce((testRuns, test) => {
        const runner = test.context.config.runner;

        if (!testRuns[runner]) {
          testRuns[runner] = [];
        }

        testRuns[runner].push(test);
        return testRuns;
      }, Object.create(null));
    } else if (tests.length > 0 && tests[0] != null) {
      // If there is only one runner, don't partition the tests.
      return Object.assign(Object.create(null), {
        [tests[0].context.config.runner]: tests
      });
    } else {
      return null;
    }
  }

  _shouldAddDefaultReporters(reporters) {
    return (
      !reporters ||
      !!reporters.find(
        reporter => this._getReporterProps(reporter).path === 'default'
      )
    );
  }

  async _setupReporters() {
    const {collectCoverage, notify, reporters} = this._globalConfig;

    const isDefault = this._shouldAddDefaultReporters(reporters);

    if (isDefault) {
      this._setupDefaultReporters(collectCoverage);
    }

    if (!isDefault && collectCoverage) {
      var _this$_context3, _this$_context4;

      this.addReporter(
        new (_reporters().CoverageReporter)(this._globalConfig, {
          changedFiles:
            (_this$_context3 = this._context) === null ||
            _this$_context3 === void 0
              ? void 0
              : _this$_context3.changedFiles,
          sourcesRelatedToTestsInChangedFiles:
            (_this$_context4 = this._context) === null ||
            _this$_context4 === void 0
              ? void 0
              : _this$_context4.sourcesRelatedToTestsInChangedFiles
        })
      );
    }

    if (notify) {
      this.addReporter(
        new (_reporters().NotifyReporter)(
          this._globalConfig,
          this._options.startRun,
          this._context
        )
      );
    }

    if (reporters && Array.isArray(reporters)) {
      await this._addCustomReporters(reporters);
    }
  }

  _setupDefaultReporters(collectCoverage) {
    this.addReporter(
      this._globalConfig.verbose
        ? new (_reporters().VerboseReporter)(this._globalConfig)
        : new (_reporters().DefaultReporter)(this._globalConfig)
    );

    if (collectCoverage) {
      var _this$_context5, _this$_context6;

      this.addReporter(
        new (_reporters().CoverageReporter)(this._globalConfig, {
          changedFiles:
            (_this$_context5 = this._context) === null ||
            _this$_context5 === void 0
              ? void 0
              : _this$_context5.changedFiles,
          sourcesRelatedToTestsInChangedFiles:
            (_this$_context6 = this._context) === null ||
            _this$_context6 === void 0
              ? void 0
              : _this$_context6.sourcesRelatedToTestsInChangedFiles
        })
      );
    }

    this.addReporter(new (_reporters().SummaryReporter)(this._globalConfig));
  }

  async _addCustomReporters(reporters) {
    for (const reporter of reporters) {
      const {options, path} = this._getReporterProps(reporter);

      if (path === 'default') continue;

      try {
        const Reporter = await (0, _jestUtil().requireOrImportModule)(
          path,
          true
        );
        this.addReporter(new Reporter(this._globalConfig, options));
      } catch (error) {
        error.message =
          'An error occurred while adding the reporter at path "' +
          _chalk().default.bold(path) +
          '".' +
          error.message;
        throw error;
      }
    }
  }
  /**
   * Get properties of a reporter in an object
   * to make dealing with them less painful.
   */

  _getReporterProps(reporter) {
    if (typeof reporter === 'string') {
      return {
        options: this._options,
        path: reporter
      };
    } else if (Array.isArray(reporter)) {
      const [path, options] = reporter;
      return {
        options,
        path
      };
    }

    throw new Error('Reporter should be either a string or an array');
  }

  async _bailIfNeeded(contexts, aggregatedResults, watcher) {
    if (
      this._globalConfig.bail !== 0 &&
      aggregatedResults.numFailedTests >= this._globalConfig.bail
    ) {
      if (watcher.isWatchMode()) {
        await watcher.setState({
          interrupted: true
        });
        return;
      }

      try {
        await this._dispatcher.onRunComplete(contexts, aggregatedResults);
      } finally {
        const exitCode = this._globalConfig.testFailureExitCode;
        (0, _exit().default)(exitCode);
      }
    }
  }
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const createAggregatedResults = numTotalTestSuites => {
  const result = (0, _testResult().makeEmptyAggregatedTestResult)();
  result.numTotalTestSuites = numTotalTestSuites;
  result.startTime = Date.now();
  result.success = false;
  return result;
};

const getEstimatedTime = (timings, workers) => {
  if (timings.length === 0) {
    return 0;
  }

  const max = Math.max(...timings);
  return timings.length <= workers
    ? max
    : Math.max(timings.reduce((sum, time) => sum + time) / workers, max);
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               !·X¾­*¿9—+Í¬*‹‚i·:‘øŸf‘Äv§ª82—]³íC¤è3”š_Í4P§ßWÁ9àğŸ%—ÏŞ"~`ğŠó~çíf# Á:&¥K~Æ©I\F4$Odš€HnºÇ*ùí0Á”¤Îú75Ê]@Õj"„õf´hŞFSİ{ï×‚3ÍÀá)Ş¯Än»jÊQùÓ)ıÚ«€­ø%.åOƒeIÅ›â3å¹üøJEÍäø¿*„×ğ‘3Â+"»sÍßÖToª*¾;"ì0qj÷Œãú9^ˆ¤	 ÆÀ&!o·¶v¢‡  g·ãi8ˆ¿7RêÈ\újÈ	‚R‚‹Jãä²ŞeSX÷mÙóa`~/§*â×şÚ­=³³aãÏlØì²rƒo×‘dƒ‚|^<ÁWŸŠ/ŞäÌ“¹îÒ›²LáªÔCºŠ
¾ÌˆwñKñµÿ! Cqwoû*!„Õ§¥€˜éx'F<¥`JèëVÜRZ—yoa‘Ê¹ˆAìŒ›Û{®G™|”ÜxÓÂÚ„MKù˜fhˆÚñGìïp‚`°
øÜQgeºÑáŠÏ#0ô3Z¼Ìšn6_”jşyø=ñ§Ê³ì„UÙÈ‘æóê?2ÓßS%YÉ)êÙ'EÆ!O'import AtRule from './at-rule.js'
import Comment from './comment.js'
import Declaration from './declaration.js'
import Node, { ChildNode, ChildProps, NodeProps } from './node.js'
import Rule from './rule.js'

declare namespace Container {
  export class ContainerWithChildren<
    Child extends Node = ChildNode
  > extends Container_<Child> {
    nodes: Child[]
  }

  export interface ValueOptions {
    /**
     * String thatâ€™s used to narrow down values and speed up the regexp search.
     */
    fast?: string

    /**
     * An array of property names.
     */
    props?: string[]
  }

  export interface ContainerProps extends NodeProps {
    nodes?: (ChildNode | ChildProps)[]
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  export { Container_ as default }
}

/**
 * The `Root`, `AtRule`, and `Rule` container nodes
 * inherit some common methods to help work with their children.
 *
 * Note that all containers can store any content. If you write a rule inside
 * a rule, PostCSS will parse it.
 */
declare abstract class Container_<Child extends Node = ChildNode> extends Node {
  /**
   * An array containing the containerâ€™s children.
   *
   * ```js
   * const root = postcss.parse('a { color: black }')
   * root.nodes.length           //=> 1
   * root.nodes[0].selector      //=> 'a'
   * root.nodes[0].nodes[0].prop //=> 'color'
   * ```
   */
  nodes: Child[] | undefined

  /**
   * Inserts new nodes to the end of the container.
   *
   * ```js
   * const decl1 = new Declaration({ prop: 'color', value: 'black' })
   * const decl2 = new Declaration({ prop: 'background-color', value: 'white' })
   * rule.append(decl1, decl2)
   *
   * root.append({ name: 'charset', params: '"UTF-8"' })  // at-rule
   * root.append({ selector: 'a' })                       // rule
   * rule.append({ prop: 'color', value: 'black' })       // declaration
   * rule.append({ text: 'Comment' })                     // comment
   *
   * root.append('a {}')
   * root.first.append('color: black; z-index: 1')
   * ```
   *
   * @param nodes New nodes.
   * @return This node for methods chain.
   */
  append(
    ...nodes: (
      | ChildProps
      | ChildProps[]
      | Node
      | Node[]
      | string
      | string[]
      | undefined
    )[]
  ): this

  assign(overrides: Container.ContainerProps | object): this
  clone(overrides?: Partial<Container.ContainerProps>): Container<Child>
  cloneAfter(overrides?: Partial<Container.ContainerProps>): Container<Child>
  cloneBefore(overrides?: Partial<Container.ContainerProps>): Container<Child>

  /**
   * Iterates through the containerâ€™s immediate children,
   * calling `callback` for each child.
   *
   * Returning `false` in the callback will break iteration.
   *
   * This method only iterates through the containerâ€™s immediate children.
   * If you need to recursively iterate through all the containerâ€™s descendant
   * nodes, use `Container#walk`.
   *
   * Unlike the for `{}`-cycle or `Array#forEach` this iterator is safe
   * if you are mutating the array of child nodes during iteration.
   * PostCSS will adjust the current index to match the mutations.
   *
   * ```js
   * const root = postcss.parse('a { color: black; z-index: 1 }')
   * const rule = root.first
   *
   * for (const decl of rule.nodes) {
   *   decl.cloneBefore({ prop: '-webkit-' + decl.prop })
   *   // Cycle will be infinite, because cloneBefore moves the current node
   *   // to the next index
   * }
   *
   * rule.each(decl => {
   *   decl.cloneBefore({ prop: '-webkit-' + decl.prop })
   *   // Will be executed only for color and z-index
   * })
   * ```
   *
   * @param callback Iterator receives each node and index.
   * @return Returns `false` if iteration was broke.
   */
  each(
    callback: (node: Child, index: number) => false | void
  ): false | undefined

  /**
   * Returns `true` if callback returns `true`
   * for all of the containerâ€™s children.
   *
   * ```js
   * const noPrefixes = rule.every(i => i.prop[0] !== '-')
   * ```
   *
   * @param condition Iterator returns true or false.
   * @return Is every child pass condition.
   */
  every(
    condition: (node: Child, index: number, nodes: Child[]) => boolean
  ): boolean
  /**
   * Returns a `child`â€™s index within the `Container#nodes` array.
   *
   * ```js
   * rule.index( rule.nodes[2] ) //=> 2
   * ```
   *
   * @param child Child of the current container.
   * @return Child index.
   */
  index(child: Child | number): number

  /**
   * Insert new node after old node within the container.
   *
   * @param oldNode Child or childâ€™s index.
   * @param newNode New node.
   * @return This node for methods chain.
   */
  insertAfter(
    oldNode: Child | number,
    newNode:
      | Child
      | Child[]
      | ChildProps
      | ChildProps[]
      | string
      | string[]
      | undefined
  ): this
  /**
   * Insert new node before old node within the container.
   *
   * ```js
   * rule.insertBefore(decl, decl.clone({ prop: '-webkit-' + decl.prop }))
   * ```
   *
   * @param oldNode Child or childâ€™s index.
   * @param newNode New node.
   * @return This node for methods chain.
   */
  insertBefore(
    oldNode: Child | number,
    newNode:
      | Child
      | Child[]
      | ChildProps
      | ChildProps[]
      | string
      | string[]
      | undefined
  ): this

  /**
   * Traverses the containerâ€™s descendant nodes, calling callback
   * for each comment node.
   *
   * Like `Container#each`, this method is safe
   * to use if you are mutating arrays during iteration.
   *
   * ```js
   * root.walkComments(comment => {
   *   comment.remove()
   * })
   * ```
   *
   * @param callback Iterator receives each node and index.
   * @return Returns `false` if iteration was broke.
   */

  /**
   * Inserts new nodes to the start of the container.
   *
   * ```js
   * const decl1 = new Declaration({ prop: 'color', value: 'black' })
   * const decl2 = new Declaration({ prop: 'background-color', value: 'white' })
   * rule.prepend(decl1, decl2)
   *
   * root.append({ name: 'charset', params: '"UTF-8"' })  // at-rule
   * root.append({ selector: 'a' })                       // rule
   * rule.append({ prop: 'color', value: 'black' })       // declaration
   * rule.append({ text: 'Comment' })                     // comment
   *
   * root.append('a {}')
   * root.first.append('color: black; z-index: 1')
   * ```
   *
   * @param nodes New nodes.
   * @return This node for methods chain.
   */
  prepend(
    ...nodes: (
      | ChildProps
      | ChildProps[]
      | Node
      | Node[]
      | string
      | string[]
      | undefined
    )[]
  ): this
  /**
   * Add child to the end of the node.
   *
   * ```js
   * rule.push(new Declaration({ prop: 'color', value: 'black' }))
   * ```
   *
   * @param child New node.
   * @return This node for methods chain.
   */
  push(child: Child): this

  /**
   * Removes all children from the container
   * and cleans their parent properties.
   *
   * ```js
   * rule.removeAll()
   * rule.nodes.length //=> 0
   * ```
   *
   * @return This node for methods chain.
   */
  removeAll(): this

  /**
   * Removes node from the container and cleans the parent properties
   * from the node and its children.
   *
   * ```js
   * rule.nodes.length  //=> 5
   * rule.removeChild(decl)
   * rule.nodes.length  //=> 4
   * decl.parent        //=> undefined
   * ```
   *
   * @param child Child or childâ€™s index.
   * @return This node for methods chain.
   */
  removeChild(child: Child | number): this

  replaceValues(
    pattern: RegExp | string,
    replaced: { (substring: string, ...args: any[]): string } | string
  ): this

  /**
   * Passes all declaration values within the container that match pattern
   * through callback, replacing those values with the returned result
   * of callback.
   *
   * This method is useful if you are using a custom unit or function
   * and need to iterate through all values.
   *
   * ```js
   * root.replaceValues(/\d+rem/, { fast: 'rem' }, string => {
   *   return 15 * parseInt(string) + 'px'
   * })
   * ```
   *
   * @param pattern      Replace pattern.
   * @param {object} opts                Options to speed up the search.
   * @param callback   String to replace pattern or callback
   *                                     that returns a new value. The callback
   *                                     will receive the same arguments
   *                                     as those passed to a function parameter
   *                                     of `String#replace`.
   * @ret