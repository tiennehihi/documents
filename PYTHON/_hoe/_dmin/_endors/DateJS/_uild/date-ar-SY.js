export interface Node {
  start: number
  end: number
  type: string
  range?: [number, number]
  loc?: SourceLocation | null
}

export interface SourceLocation {
  source?: string | null
  start: Position
  end: Position
}

export interface Position {
  /** 1-based */
  line: number
  /** 0-based */
  column: number
}

export interface Identifier extends Node {
  type: "Identifier"
  name: string
}

export interface Literal extends Node {
  type: "Literal"
  value?: string | boolean | null | number | RegExp | bigint
  raw?: string
  regex?: {
    pattern: string
    flags: string
  }
  bigint?: string
}

export interface Program extends Node {
  type: "Program"
  body: Array<Statement | ModuleDeclaration>
  sourceType: "script" | "module"
}

export interface Function extends Node {
  id?: Identifier | null
  params: Array<Pattern>
  body: BlockStatement | Expression
  generator: boolean
  expression: boolean
  async: boolean
}

export interface ExpressionStatement extends Node {
  type: "ExpressionStatement"
  expression: Expression | Literal
  directive?: string
}

export interface BlockStatement extends Node {
  type: "BlockStatement"
  body: Array<Statement>
}

export interface EmptyStatement extends Node {
  type: "EmptyStatement"
}

export interface DebuggerStatement extends Node {
  type: "DebuggerStatement"
}

export interface WithStatement extends Node {
  type: "WithStatement"
  object: Expression
  body: Statement
}

export interface ReturnStatement extends Node {
  type: "ReturnStatement"
  argument?: Expression | null
}

export interface LabeledStatement extends Node {
  type: "LabeledStatement"
  label: Identifier
  body: Statement
}

export interface BreakStatement extends Node {
  type: "BreakStatement"
  label?: Identifier | null
}

export interface ContinueStatement extends Node {
  type: "ContinueStatement"
  label?: Identifier | null
}

export interface IfStatement extends Node {
  type: "IfStatement"
  test: Expression
  consequent: Statement
  alternate?: Statement | null
}

export interface SwitchStatement extends Node {
  type: "SwitchStatement"
  discriminant: Expression
  cases: Array<SwitchCase>
}

export interface SwitchCase extends Node {
  type: "SwitchCase"
  test?: Expression | null
  consequent: Array<Statement>
}

export interface ThrowStatement extends Node {
  type: "ThrowStatement"
  argument: Expression
}

export interface TryStatement extends Node {
  type: "TryStatement"
  block: BlockStatement
  handler?: CatchClause | null
  finalizer?: BlockStatement | null
}

export interface CatchClause extends Node {
  type: "CatchClause"
  param?: Pattern | null
  body: BlockStatement
}

export interface WhileStatement extends Node {
  type: "WhileStatement"
  test: Expression
  body: Statement
}

export interface DoWhileStatement extends Node {
  type: "DoWhileStatement"
  body: Statement
  test: Expression
}

export interface ForStatement extends Node {
  type: "ForStatement"
  init?: VariableDeclaration | Expression | null
  test?: Expression | null
  update?: Expression | null
  body: Statement
}

export interface ForInStatement extends Node {
  type: "ForInStatement"
  left: VariableDeclaration | Pattern
  right: Expression
  body: Statement
}

export interface FunctionDeclaration extends Function {
  type: "FunctionDeclaration"
  id: Identifier
  body: BlockStatement
}

export interface VariableDeclaration extends Node {
  type: "VariableDeclaration"
  declarations: Array<VariableDeclarator>
  kind: "var" | "let" | "const"
}

export interface VariableDeclarator extends Node {
  type: "VariableDeclarator"
  id: Pattern
  init?: Expression | null
}

export interface ThisExpression extends Node {
  type: "ThisExpression"
}

export interface ArrayExpression extends Node {
  type: "ArrayExpression"
  elements: Array<Expression | SpreadElement | null>
}

export interface ObjectExpression extends Node {
  type: "ObjectExpression"
  properties: Array<Property | SpreadElement>
}

export interface Property extends Node {
  type: "Property"
  key: Expression
  value: Expression
  kind: "init" | "get" | "set"
  method: boolean
  shorthand: boolean
  computed: boolean
}

export interface FunctionExpression extends Function {
  type: "FunctionExpression"
  body: BlockStatement
}

export interface UnaryExpression extends Node {
  type: "UnaryExpression"
  operator: UnaryOperator
  prefix: boolean
  argument: Expression
}

export type UnaryOperator = "-" | "+" | "!" | "~" | "typeof" | "void" | "delete"

export interface UpdateExpression extends Node {
  type: "UpdateExpression"
  operator: UpdateOperator
  argument: Expression
  prefix: boolean
}

export type UpdateOperator = "++" | "--"

export interface BinaryExpression extends Node {
  type: "BinaryExpression"
  operator: BinaryOperator
  left: Expression | PrivateIdentifier
  right: Expression
}

export type BinaryOperator = "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">=" | "<<" | ">>" | ">>>" | "+" | "-" | "*" | "/" | "%" | "|" | "^" | "&" | "in" | "instanceof" | "**"

export interface AssignmentExpression extends Node {
  type: "AssignmentExpression"
  operator: AssignmentOperator
  left: Pattern
  right: Expression
}

export type AssignmentOperator = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "<<=" | ">>=" | ">>>=" | "|=" | "^=" | "&=" | "**=" | "||=" | "&&=" | "??="

export interface LogicalExpression extends Node {
  type: "LogicalExpression"
  operator: LogicalOperator
  left: Expression
  right: Expression
}

export type LogicalOperator = "||" | "&&" | "??"

export interface MemberExpression extends Node {
  type: "MemberExpression"
  object: Expression | Super
  property: Expression | PrivateIdentifier
  computed: boolean
  optional: boolean
}

export interface ConditionalExpression extends Node {
  type: "ConditionalExpression"
  test: Expression
  alternate: Expression
  consequent: Expression
}

export interface CallExpression extends Node {
  type: "CallExpression"
  callee: Expression | Super
  arguments: Array<Expression | SpreadElement>
  optional: boolean
}

export interface NewExpression extends Node {
  type: "NewExpression"
  callee: Expression
  arguments: Array<Expression | SpreadElement>
}

export interface SequenceExpression extends Node {
  type: "SequenceExpression"
  expressions: Array<Expression>
}

export interface ForOfStatement extends Node {
  type: "ForOfStatement"
  left: VariableDeclaration | Pattern
  right: Expression
  body: Statement
  await: boolean
}

export interface Super extends Node {
  type: "Super"
}

export interface SpreadElement extends Node {
  type: "SpreadElement"
  argument: Expression
}

export interface ArrowFunctionExpression extends Function {
  type: "ArrowFunctionExpression"
}

export interface YieldExpression extends Node {
  type: "YieldExpression"
  argument?: Expression | null
  delegate: boolean
}

export interface TemplateLiteral extends Node {
  type: "TemplateLiteral"
  quasis: Array<TemplateElement>
  expressions: Array<Expression>
}

export interface TaggedTemplateExpression extends Node {
  type: "TaggedTemplateExpression"
  tag: Expression
  quasi: TemplateLiteral
}

export interface TemplateElement extends Node {
  type: "TemplateElement"
  tail: boolean
  value: {
    cooked?: string | null
    raw: string
  }
}

export interface AssignmentProperty extends Node {
  type: "Property"
  key: Expression
  value: Pattern
  kind: "init"
  method: false
  shorthand: boolean
  computed: boolean
}

export interface ObjectPattern extends Node {
  type: "ObjectPattern"
  properties: Array<AssignmentProperty | RestElement>
}

export interface ArrayPattern extends Node {
  type: "ArrayPattern"
  elements: Array<Pattern | null>
}

export interface RestElement extends Node {
  type: "RestElement"
  argument: Pattern
}

export interface AssignmentPattern extends Node {
  type: "AssignmentPattern"
  left: Pattern
  right: Expression
}

export interface Class extends Node {
  id?: Identifier | null
  superClass?: Expression | null
  body: ClassBody
}

export interface ClassBody extends Node {
  type: "ClassBody"
  body: Array<MethodDefinition | PropertyDefinition | StaticBlock>
}

export interface MethodDefinition extends Node {
  type: "MethodDefinition"
  key: Expression | PrivateIdentifier
  value: FunctionExpression
  kind: "constructor" | "method" | "get" | "set"
  computed: boolean
  static: boolean
}

export interface ClassDeclaration extends Class {
  type: "ClassDeclaration"
  id: Identifier
}

export interface ClassExpression extends Class {
  type: "ClassExpression"
}

export interface MetaProperty extends Node {
  type: "MetaProperty"
  meta: Identifier
  property: Identifier
}

export interface ImportDeclaration extends Node {
  type: "ImportDeclaration"
  specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>
  source: Literal
}

export interface ImportSpecifier extends Node {
  type: "ImportSpecifier"
  imported: Identifier | Literal
  local: Identifier
}

export interface ImportDefaultSpecifier extends Node {
  type: "ImportDefaultSpecifier"
  local: Identifier
}

export interface ImportNamespaceSpecifier extends Node {
  type: "ImportNamespaceSpecifier"
  local: Identifier
}

export interface ExportNamedDeclaration extends Node {
  type: "ExportNamedDeclaration"
  declaration?: Declaration | null
  specifiers: Array<ExportSpecifier>
  source?: Literal | null
}

export interface ExportSpecifier extends Node {
  type: "ExportSpecifier"
  exported: Identifier | Literal
  local: Identifier | Literal
}

export interface AnonymousFunctionDeclaration extends Function {
  type: "FunctionDeclaration"
  id: null
  body: BlockStatement
}

export interface AnonymousClassDeclaration extends Class {
  type: "ClassDeclaration"
  id: null
}

export interface ExportDefaultDeclaration extends Node {
  type: "ExportDefaultDeclaration"
  declaration: AnonymousFunctionDeclaration | FunctionDeclaration | AnonymousClassDeclaration | ClassDeclaration | Expression
}

export interface ExportAllDeclaration extends Node {
  type: "ExportAllDeclaration"
  source: Literal
  exported?: Identifier | Literal | null
}

export interface AwaitExpression extends Node {
  type: "AwaitExpression"
  argument: Expression
}

export interface ChainExpression extends Node {
  type: "ChainExpression"
  expression: MemberExpression | CallExpression
}

export interface ImportExpression extends Node {
  type: "ImportExpression"
  source: Expression
}

export interface ParenthesizedExpression extends Node {
  type: "ParenthesizedExpression"
  expression: Expression
}

export interface PropertyDefinition extends Node {
  type: "PropertyDefinition"
  key: Expression | PrivateIdentifier
  value?: Expression | null
  computed: boolean
  static: boolean
}

export interface PrivateIdentifier extends Node {
  type: "PrivateIdentifier"
  name: string
}

export interface StaticBlock extends Node {
  type: "StaticBlock"
  body: Array<Statement>
}

export type Statement = 
| ExpressionStatement
| BlockStatement
| EmptyStatement
| DebuggerStatement
| WithStatement
| ReturnStatement
| LabeledStatement
| BreakStatement
| ContinueStatement
| IfStatement
| SwitchStatement
| ThrowStatement
| TryStatement
| WhileStatement
| DoWhileStatement
| ForStatement
| ForInStatement
| ForOfStatement
| Declaration

export type Declaration = 
| FunctionDeclaration
| VariableDeclaration
| ClassDeclaration

export type Expression = 
| Identifier
| Literal
| ThisExpression
| ArrayExpression
| ObjectExpression
| FunctionExpression
| UnaryExpression
| UpdateExpression
| BinaryExpression
| AssignmentExpression
| LogicalExpression
| MemberExpression
| ConditionalExpression
| CallExpression
| NewExpression
| SequenceExpression
| ArrowFunctionExpression
| YieldExpression
| TemplateLiteral
| TaggedTemplateExpression
| ClassExpression
| MetaProperty
| AwaitExpression
| ChainExpression
| ImportExpression
| ParenthesizedExpression

export type Pattern = 
| Identifier
| MemberExpression
| ObjectPattern
| ArrayPattern
| RestElement
| AssignmentPattern

export type ModuleDeclaration = 
| ImportDeclaration
| ExportNamedDeclaration
| ExportDefaultDeclaration
| ExportAllDeclaration

export type AnyNode = Statement | Expression | Declaration | ModuleDeclaration | Literal | Program | SwitchCase | CatchClause | Property | Super | SpreadElement | TemplateElement | AssignmentProperty | ObjectPattern | ArrayPattern | RestElement | AssignmentPattern | ClassBody | MethodDefinition | MetaProperty | ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier | ExportSpecifier | AnonymousFunctionDeclaration | AnonymousClassDeclaration | PropertyDefinition | PrivateIdentifier | StaticBlock

export function parse(input: string, options: Options): Program

export function parseExpressionAt(input: string, pos: number, options: Options): Expression

export function tokenizer(input: string, options: Options): {
  getToken(): Token
  [Symbol.iterator](): Iterator<Token>
}

export type ecmaVersion = 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | "latest"

export interface Options {
  /**
   * `ecmaVersion` indicates the ECMAScript version to parse. Must be
   * either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
   * (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
   * (the latest version the library supports). This influences
   * support for strict mode, the set of reserved words, and support
   * for new syntax features.
   */
  ecmaVersion: ecmaVersion

  /**
   * `sourceType` indicates the mode the code should be parsed in.
   * Can be either `"script"` or `"module"`. This influences global
   * strict mode and parsing of `import` and `export` declarations.
   */
  sourceType?: "script" | "module"

  /**
   * a callback that will be called when a semicolon is automatically inserted.
   * @param lastTokEnd the position of the comma as an offset
   * @param lastTokEndLoc location if {@link locations} is enabled
   */
  onInsertedSemicolon?: (lastTokEnd: number, lastTokEndLoc?: Position) => void

  /**
   * similar to `onInsertedSemicolon`, but for trailing commas
   * @param lastTokEnd the position of the comma as an offset
   * @param lastTokEndLoc location if `locations` is enabled
   */
  onTrailingComma?: (lastTokEnd: number, lastTokEndLoc?: Position) => void

  /**
   * By default, reserved words are only enforced if ecmaVersion >= 5.
   * Set `allowReserved` to a boolean value to explicitly turn this on
   * an off. When this option has the value "never", reserved words
   * and keywords can also not be used as property names.
   */
  allowReserved?: boolean | "never"

  /** 
   * When enabled, a return at the top level is not considered an error.
   */
  allowReturnOutsideFunction?: boolean

  /**
   * When enabled, import/export statements are not constrained to
   * appearing at the top of the program, and an import.meta expression
   * in a script isn't considered an error.
   */
  allowImportExportEverywhere?: boolean

  /**
   * By default, `await` identifiers are allowed to appear at the top-level scope only if {@link ecmaVersion} >= 2022.
   * When enabled, await identifiers are allowed to appear at the top-level scope,
   * but they are still not allowed in non-async functions.
   */
  allowAwaitOutsideFunction?: boolean

  /**
   * When enabled, super identifiers are not constrained to
   * appearing in methods and do not raise an error when they appear elsewhere.
   */
  allowSuperOutsideMethod?: boolean

  /**
   * When enabled, hashbang directive in the beginning of file is
   * allowed and treated as a line comment. Enabled by default when
   * {@link ecmaVersion} >= 2023.
   */
  allowHashBang?: boolean

  /**
   * By default, the parser will verify that private properties are
   * only used in places where they are valid and have been declared.
   * Set this to false to turn such checks off.
   */
  checkPrivateFields?: boolean

  /**
   * When `locations` is on, `loc` properties holding objects with
   * `start` and `end` properties as {@link Position} objects will be attached to the
   * nodes.
   */
  locations?: boolean

  /**
   * a callback that will cause Acorn to call that export function with object in the same
   * format as tokens returned from `tokenizer().get= /t|\s/i;
function date_time(str) {
  // http://tools.ietf.org/html/rfc3339#section-5.6
  var dateTime = str.split(DATE_TIME_SEPARATOR);
  return dateTime.length == 2 && date(dateTime[0]) && time(dateTime[1], true);
}


var NOT_URI_FRAGMENT = /\/|:/;
function uri(str) {
  // http://jmrware.com/articles/2009/uri_regexp/URI_regex.html + optional protocol + required "."
  return NOT_URI_FRAGMENT.test(str) && URI.test(str);
}


var Z_ANCHOR = /[^\\]\\Z/;
function regex(str) {
  if (Z_ANCHOR.test(str)) return false;
  try {
    new RegExp(str);
    return true;
  } catch(e) {
    return false;
  }
}

},{"./util":10}],5:[function(require,module,exports){
'use strict';

var resolve = require('./resolve')
  , util = require('./util')
  , errorClasses = require('./error_classes')
  , stableStringify = require('fast-json-stable-stringify');

var validateGenerator = require('../dotjs/validate');

/**
 * Functions below are used inside compiled validations function
 */

var ucs2length = util.ucs2length;
var equal = require('fast-deep-equal');

// this error is thrown by async schemas to return validation errors via exception
var ValidationError = errorClasses.Validation;

module.exports = compile;


/**
 * Compiles schema to validation function
 * @this   Ajv
 * @param  {Object} schema schema object
 * @param  {Object} root object with information about the root schema for this schema
 * @param  {Object} localRefs the hash of local references inside the schema (created by resolve.id), used for inline resolution
 * @param  {String} baseId base ID for IDs in the schema
 * @return {Function} validation function
 */
function compile(schema, root, localRefs, baseId) {
  /* jshint validthis: true, evil: true */
  /* eslint no-shadow: 0 */
  var self = this
    , opts = this._opts
    , refVal = [ undefined ]
    , refs = {}
    , patterns = []
    , patternsHash = {}
    , defaults = []
    , defaultsHash = {}
    , customRules = [];

  root = root || { schema: schema, refVal: refVal, refs: refs };

  var c = checkCompiling.call(this, schema, root, baseId);
  var compilation = this._compilations[c.index];
  if (c.compiling) return (compilation.callValidate = callValidate);

  var formats = this._formats;
  var RULES = this.RULES;

  try {
    var v = localCompile(schema, root, localRefs, baseId);
    compilation.validate = v;
    var cv = compilation.callValidate;
    if (cv) {
      cv.schema = v.schema;
      cv.errors = null;
      cv.refs = v.refs;
      cv.refVal = v.refVal;
      cv.root = v.root;
      cv.$async = v.$async;
      if (opts.sourceCode) cv.source = v.source;
    }
    return v;
  } finally {
    endCompiling.call(this, schema, root, baseId);
  }

  /* @this   {*} - custom context, see passContext option */
  function callValidate() {
    /* jshint validthis: true */
    var validate = compilation.validate;
    var result = validate.apply(this, arguments);
    callValidate.errors = validate.errors;
    return result;
  }

  function localCompile(_schema, _root, localRefs, baseId) {
    var isRoot = !_root || (_root && _root.schema == _schema);
    if (_root.schema != root.schema)
      return compile.call(self, _schema, _root, localRefs, baseId);

    var $async = _schema.$async === true;

    var sourceCode = validateGenerator({
      isTop: true,
      schema: _schema,
      isRoot: isRoot,
      baseId: baseId,
      root: _root,
      schemaPath: '',
      errSchemaPath: '#',
      errorPath: '""',
      MissingRefError: errorClasses.MissingRef,
      RULES: RULES,
      validate: validateGenerator,
      util: util,
      resolve: resolve,
      resolveRef: resolveRef,
      usePattern: usePattern,
      useDefault: useDefault,
      useCustomRule: useCustomRule,
      opts: opts,
      formats: formats,
      logger: self.logger,
      self: self
    });

    sourceCode = vars(refVal, refValCode) + vars(patterns, patternCode)
                   + vars(defaults, defaultCode) + vars(customRules, customRuleCode)
                   + sourceCode;

    if (opts.processCode) sourceCode = opts.processCode(sourceCode, _schema);
    // console.log('\n\n\n *** \n', JSON.stringify(sourceCode));
    var validate;
    try {
      var makeValidate = new Function(
        'self',
        'RULES',
        'formats',
        'root',
        'refVal',
        'defaults',
        'customRules',
        'equal',
        'ucs2length',
        'ValidationError',
        sourceCode
      );

      validate = makeValidate(
        self,
        RULES,
        formats,
        root,
        refVal,
        defaults,
        customRules,
        equal,
        ucs2length,
        ValidationError
      );

      refVal[0] = validate;
    } catch(e) {
      self.logger.error('Error compiling schema, function code:', sourceCode);
      throw e;
    }

    validate.schema = _schema;
    validate.errors = null;
    validate.refs = refs;
    validate.refVal = refVal;
    validate.root = isRoot ? validate : _root;
    if ($async) validate.$async = true;
    if (opts.sourceCode === true) {
      validate.source = {
        code: sourceCode,
        patterns: patterns,
        defaults: defaults
      };
    }

    return validate;
  }

  function resolveRef(baseId, ref, isRoot) {
    ref = resolve.url(baseId, ref);
    var refIndex = refs[ref];
    var _refVal, refCode;
    if (refIndex !== undefined) {
      _refVal = refVal[refIndex];
      refCode = 'refVal[' + refIndex + ']';
      return resolvedRef(_refVal, refCode);
    }
    if (!isRoot && root.refs) {
      var rootRefId = root.refs[ref];
      if (rootRefId !== undefined) {
        _refVal = root.refVal[rootRefId];
        refCode = addLocalRef(ref, _refVal);
        return resolvedRef(_refVal, refCode);
      }
    }

    refCode = addLocalRef(ref);
    var v = resolve.call(self, localCompile, root, ref);
    if (v === undefined) {
      var localSchema = localRefs && localRefs[ref];
      if (localSchema) {
        v = resolve.inlineRef(localSchema, opts.inlineRefs)
            ? localSchema
            : compile.call(self, localSchema, root, localRefs, baseId);
      }
    }

    if (v === undefined) {
      removeLocalRef(ref);
    } else {
      replaceLocalRef(ref, v);
      return resolvedRef(v, refCode);
    }
  }

  function addLocalRef(ref, v) {
    var refId = refVal.length;
    refVal[refId] = v;
    refs[ref] = refId;
    return 'refVal' + refId;
  }

  function removeLocalRef(ref) {
    delete refs[ref];
  }

  function replaceLocalRef(ref, v) {
    var refId = refs[ref];
    refVal[refId] = v;
  }

  function resolvedRef(refVal, code) {
    return typeof refVal == 'object' || typeof refVal == 'boolean'
            ? { code: code, schema: refVal, inline: true }
            : { code: code, $async: refVal && !!refVal.$async };
  }

  function usePattern(regexStr) {
    var index = patternsHash[regexStr];
    if (index === undefined) {
      index = patternsHash[regexStr] = patterns.length;
      patterns[index] = regexStr;
    }
    return 'pattern' + index;
  }

  function useDefault(value) {
    switch (typeof value) {
      case 'boolean':
      case 'number':
        return '' + value;
      case 'string':
        return util.toQuotedString(value);
      case 'object':
        if (value === null) return 'null';
        var valueStr = stableStringify(value);
        var index = defaultsHash[valueStr];
        if (index === undefined) {
          index = defaultsHash[valueStr] = defaults.length;
          defaults[index] = value;
        }
        return 'default' + index;
    }
  }

  function useCustomRule(rule, schema, parentSchema, it) {
    if (self._opts.validateSchema !== false) {
      var deps = rule.definition.dependencies;
      if (deps && !deps.every(function(keyword) {
        return Object.prototype.hasOwnProperty.call(parentSchema, keyword);
      }))
        throw new Error('parent schema must have all required keywords: ' + deps.join(','));

      var validateSchema = rule.definition.validateSchema;
      if (validateSchema) {
        var valid = validateSchema(schema);
        if (!valid) {
          var message = 'keyword schema is invalid: ' + self.errorsText(validateSchema.errors);
          if (self._opts.validateSchema == 'log') self.logger.error(message);
          else throw new Error(message);
        }
      }
    }

    var compile = rule.definition.compile
      , inline = rule.definition.inline
      , macro = rule.definition.macro;

    var validate;
    if (compile) {
      validate = compile.call(self, schema, parentSchema, it);
    } else if (macro) {
      validate = macro.call(self, schema, parentSchema, it);
      if (opts.validateSchema !== false) self.validateSchema(validate, true);
    } else if (inline) {
      validate = inline.call(self, it, rule.keyword, schema, parentSchema);
    } else {
      validate = rule.definition.validate;
      if (!validate) return;
    }

    if (validate === undefined)
      throw new Error('custom keyword "' + rule.keyword + '"failed to compile');

    var index = customRules.length;
    customRules[index] = validate;

    return {
      code: 'customRule' + index,
      validate: validate
    };
  }
}


/**
 * Checks if the schema is currently compiled
 * @this   Ajv
 * @param  {Object} schema schema to compile
 * @param  {Object} root root object
 * @param  {String} baseId base schema ID
 * @return {Object} object with properties "index" (compilation index) and "compiling" (boolean)
 */
function checkCompiling(schema, root, baseId) {
  /* jshint validthis: true */
  var index = compIndex.call(this, schema, root, baseId);
  if (index >= 0) return { index: index, compiling: true };
  index = this._compilations.length;
  this._compilations[index] = {
    schema: schema,
    root: root,
    baseId: baseId
  };
  return { index: index, compiling: false };
}


/**
 * Removes the schema from the currently compiled list
 * @this   Ajv
 * @param  {Object} schema schema to compile
 * @param  {Object} root root object
 * @param  {String} baseId base schema ID
 */
function endCompiling(schema, root, baseId) {
  /* jshint validthis: true */
  var i = compIndex.call(this, schema, root, baseId);
  if (i >= 0) this._compilations.splice(i, 1);
}


/**
 * Index of schema compilation in the currently compiled list
 * @this   Ajv
 * @param  {Object} schema schema to compile
 * @param  {Object} root root object
 * @param  {String} baseId base schema ID
 * @return {Integer} compilation index
 */
function compIndex(schema, root, baseId) {
  /* jshint validthis: true */
  for (var i=0; i<this._compilations.length; i++) {
    var c = this._compilations[i];
    if (c.schema == schema && c.root == root && c.baseId == baseId) return i;
  }
  return -1;
}


function patternCode(i, patterns) {
  return 'var pattern' + i + ' = new RegExp(' + util.toQuotedString(patterns[i]) + ');';
}


function defaultCode(i) {
  return 'var default' + i + ' = defaults[' + i + '];';
}


function refValCode(i, refVal) {
  return refVal[i] === undefined ? '' : 'var refVal' + i + ' = refVal[' + i + '];';
}


function customRuleCode(i) {
  return 'var customRule' + i + ' = customRules[' + i + '];';
}


function vars(arr, statement) {
  if (!arr.length) return '';
  var code = '';
  for (var i=0; i<arr.length; i++)
    code += statement(i, arr);
  return code;
}

},{"../dotjs/validate":38,"./error_classes":3,"./resolve":6,"./util":10,"fast-deep-equal":42,"fast-json-stable-stringify":43}],6:[function(require,module,exports){
'use strict';

var URI = require('uri-js')
  , equal = require('fast-deep-equal')
  , util = require('./util')
  , SchemaObject = require('./schema_obj')
  , traverse = require('json-schema-traverse');

module.exports = resolve;

resolve.normalizeId = normalizeId;
resolve.fullPath = getFullPath;
resolve.url = resolveUrl;
resolve.ids = resolveIds;
resolve.inlineRef = inlineRef;
resolve.schema = resolveSchema;

/**
 * [resolve and compile the references ($ref)]
 * @this   Ajv
 * @param  {Function} compile reference to schema compilation funciton (localCompile)
 * @param  {Object} root object with information about the root schema for the current schema
 * @param  {String} ref reference to resolve
 * @return {Object|Function} schema object (if the schema can be inlined) or validation function
 */
function resolve(compile, root, ref) {
  /* jshint validthis: true */
  var refVal = this._refs[ref];
  if (typeof refVal == 'string') {
    if (this._refs[refVal]) refVal = this._refs[refVal];
    else return resolve.call(this, compile, root, refVal);
  }

  refVal = refVal || this._schemas[ref];
  if (refVal instanceof SchemaObject) {
    return inlineRef(refVal.schema, this._opts.inlineRefs)
            ? refVal.schema
            : refVal.validate || this._compile(refVal);
  }

  var res = resolveSchema.call(this, root, ref);
  var schema, v, baseId;
  if (res) {
    schema = res.schema;
    root = res.root;
    baseId = res.baseId;
  }

  if (schema instanceof SchemaObject) {
    v = schema.validate || compile.call(this, schema.schema, root, undefined, baseId);
  } else if (schema !== undefined) {
    v = inlineRef(schema, this._opts.inlineRefs)
        ? schema
        : compile.call(this, schema, root, undefined, baseId);
  }

  return v;
}


/**
 * Resolve schema, its root and baseId
 * @this Ajv
 * @param  {Object} root root object with properties schema, refVal, refs
 * @param  {String} ref  reference to resolve
 * @return {Object} object with properties schema, root, baseId
 */
function resolveSchema(root, ref) {
  /* jshint validthis: true */
  var p = URI.parse(ref)
    , refPath = _getFullPath(p)
    , baseId = getFullPath(this._getId(root.schema));
  if (Object.keys(root.schema).length === 0 || refPath !== baseId) {
    var id = normalizeId(refPath);
    var refVal = this._refs[id];
    if (typeof refVal == 'string') {
      return resolveRecursive.call(this, root, refVal, p);
    } else if (refVal instanceof SchemaObject) {
      if (!refVal.validate) this._compile(refVal);
      root = refVal;
    } else {
      refVal = this._schemas[id];
      if (refVal instanceof SchemaObject) {
        if (!refVal.validate) this._compile(refVal);
        if (id == normalizeId(ref))
          return { schema: refVal, root: root, baseId: baseId };
        root = refVal;
      } else {
        return;
      }
    }
    if (!root.schema) return;
    baseId = getFullPath(this._getId(root.schema));
  }
  return getJsonPointer.call(this, p, baseId, root.schema, root);
}


/* @this Ajv */
function resolveRecursive(root, ref, parsedRef) {
  /* jshint validthis: true */
  var res = resolveSchema.call(this, root, ref);
  if (res) {
    var schema = res.schema;
    var baseId = res.baseId;
    root = res.root;
    var id = this._getId(schema);
    if (id) baseId = resolveUrl(baseId, id);
    return getJsonPointer.call(this, parsedRef, baseId, schema, root);
  }
}


var PREVENT_SCOPE_CHANGE = util.toHash(['properties', 'patternProperties', 'enum', 'dependencies', 'definitions']);
/* @this Ajv */
function getJsonPointer(parsedRef, baseId, schema, root) {
  /* jshint validthis: true */
  parsedRef.fragment = parsedRef.fragment || '';
  if (parsedRef.fragment.slice(0,1) != '/') return;
  var parts = parsedRef.fragment.split('/');

  for (var i = 1; i < parts.length; i++) {
    var part = parts[i];
    if (part) {
      part = util.unescapeFragment(part);
      schema = schema[part];
      if (schema === undefined) break;
      var id;
      if (!PREVENT_SCOPE_CHANGE[part]) {
        id = this._getId(schema);
        if (id) baseId = resolveUrl(baseId, id);
        if (schema.$ref) {
          var $ref = resolveUrl(baseId, schema.$ref);
          var res = resolveSchema.call(this, root, $ref);
          if (res) {
            schema = res.schema;
            root = res.root;
            baseId = res.baseId;
          }
        }
      }
    }
  }
  if (schema !== undefined && schema !== root.schema)
    return { schema: schema, root: root, baseId: baseId };
}


var SIMPLE_INLINED = util.toHash([
  'type', 'format', 'pattern',
  'maxLength', 'minLength',
  'maxProperties', 'minProperties',
  'maxItems', 'minItems',
  'maximum', 'minimum',
  'uniqueItems', 'multipleOf',
  'required', 'enum'
]);
function inlineRef(schema, limit) {
  if (limit === false) return false;
  if (limit === undefined || limitimport Dispatcher from "./dispatcher";

export {
  getGlobalDispatcher,
  setGlobalDispatcher
}

declare function setGlobalDispatcher<DispatcherImplementation extends Dispatcher>(dispatcher: DispatcherImplementation): void;
declare function getGlobalDispatcher(): Dispatcher;
                                                                                                                                                                                                                                            b�k%*E�5��V��=��b�FC��?�Z���+��O�1%�|H��+`������Bӥ:��ʼ��Ϟ7_T�?�͕\	B�#ll��<
��>�@�b�[��.Iė��7�z`P`%�`�ҍ��k��� �\B�%�q`��| ��?�U�k�c&��/Q[_��U�7�~L%��i���4?r���m��c/�(�`����K�0qf�ڍ�l��k��:u4�k�ԁ�S6yΖ:��
{�`�]�&�?sZ���c�jC+`�߼�h��/��?�4V)��/�=�@7<|P4O�77
���5��QU͠:�k
���Kf0�A��BM�ך�J	�ʉ2Ѕ�.�����Ru��.�E���n�ы������Bc�/m�e�P�"J�E�t6�������t���������{�Ž�Ϸ��Xŵ���T��>�=�U��d�j�M췻o��wL�+[�q~���)�&ۄ6D�����w�i0v�����Z�{f@4$��%����+ә}Ĥ�/}��M�wNӃ=�ބA��!|��{��kO� �h$7��K�[j�`q�Zy]3F��3F㥂rƵ��j�9q��ȶK�K��>c��:��w�7�� j�=>ܤ�l����諭��E����z�<ft]cΠ@�h�N%�t��ԡ�����Vo<�Mz�����5������7e�+�����7�9ό���\��~�>�t
�V�v��$pZ��R�Z���Q8*�y��0�0�&��df��2f������ڠ�SK��bOt�(f�
tLֲ�(t���:OM������ej���z&�jG�A�"d�� ��b9p���/:L�rW����E#�a��&S�R;:W
�b�fC2��Qwe��/m;G����c��R+�[ɜ�A�'_p&1����w�:��qS}�Iˁ�õ��Vf����6��q�L�KZ]vï!�W؅���9�����uC�3������������k#X��7>t\B��_���TM�d���e[:�k�L�oҼsmm� '�F��b6��B���k�J����!}���g�S �~V5��O,����`"wX�6CmΦ����1�8/L�I�|���4]BgE6��~���i)��^�V��4�*o��j��i��"�s$&�eЦ���fIc˙�fL?4l�
��Y�.�b��P�/��nß�CUr~R�/:���KL'�" b�g+;;^S�,�Cc�L���޴V��_/֤��w��W�f�>΢]Mu4r%�ы�M��7X��-y@��I�*�F6օ��5���+0�N���kqfe����t�t7�n�pu�;�B_��c�Aa��1+�"�V�q�C�[3��D.���q��jQS���r/�H�"��tw|,��vla�*�{�̎Ǽp�ﰕ��P~W�Ǻݎ�j06V�1ځz�&
��ύ�����������V�޻߀A��}�7�q ���nB1���)����-v��"��$W�*Ry^���
2��B�$ʣEE4`�QASq�:�O����-� ��:����\��z�'�hE~Xd���P�9��G;i_�ɺ����RR1yv4�p�(�l��]��hukx��_9gU'j�-y6�cvq�6���n����x_��0�LW+���^��i�>y%,�el���aI+��-���K����nn��B.`�RL��r��A�VZ~,�F��˽R�$�Hg�=�?�)��GwJS��0�N����4]}M��w�p�o���/95`|K*����I������'�/�y*V���sM�Gc}���M�܌~v⢲���(�!�
� ��0R�}�~HT��g�X؉<��KW��A���nIΗo"SXnjԼ���a�6��"��Է{�Y>M�\�~�(�����k9ǩM�V#v�7ǉ�X������h��i��n���� ��\2����|3������^f�5i��ח 	3�N���OMz�y���pШpg���q-{�6�ޭnp�4[�f�v�G�����>y�G�?A�X���t@��_K����V_��[A�>�(��2�NȄO����1eg�MK���������6���^���jSqn�Ҳ_�@v,�ܲo0lc��1���.��+���owa_�ѺB���������!΂�������tR*�m���gBa�;)��B5����1T;����U�g��[B9v�a�{�Q.΢�V�/R�!��!�4ju.�	qy$C�j�,�R����ę�UCD*k#�('$�=N���Dvym�r�,��'j�c�,�R��@������bA�nF�2�.	���
�������G�zk��.���sY��窆Y�Ĵ�,��@�V���%/�5�j�M�,vp�k��4�����J�#�D`p=/��{4���L7�
�#M��bf�w�"�#~ �F���\M�"P_�>��-�"o���W=GB����q�[>��{�X�чE?�L&�1��!��Y_Pi��9�ZK����C�
3��(!�[�(m��+��?#�#���uXF���j7]}�f�+!���� >K�ra������3���栻vk=�ѧ_�����ӂ.�6FC>������6W�ʩ�%L %����&ȕV���%.MeiZ�,�d�~M����iɻ=�`�"-y���Dx{���?�sI���"�u����zs������hd����x�I��,�����+RVE2�8!?����s~���ߴj���@�j�p��׍��ܞSO���g[r��񅣿~!��%�!�W�KV5��h��1l_����n}f[ �[:�f�0�����l-$�5���_=·�/���W&�ʂ�7��Z���J���
�˽�~dn!A^|�ɔ�b��#�^���ܲ��h�I��p���k���N��`x����-�1$�k�2��.�xzK�G�(j�yt\ų2���0M;ZEv���͉�飣E������Щ��f���uХ�3��#��~E8����o�l�5��M#����%�L���u2
���B�+;B�RU0���;�Q���a�&��h�hceBt꺀�s��#ƨT���4�{���>�u�s��d�T'k>P �"���c��a?��6+��8�"Ӝ\��9��w��iO��
�������S|4-�[��oޖ�������ƛx�em\=����������w�y�%�3�9��9�xWA�RQ8�Ƴ#�~�yG5{h���h�7�Z%
,��w��>�r�e+|�_P�h�k,+�&'*^� ��U_Ԇu�Z�X[�!hKqwH Hp/-�Xpw�b��8��8��K� ��;��7�f���ߙ�;��=�ܙ��Q5�N[�3��d}��Wt�I7H�r��IGU���^Խ��H�w�Xw��\��}@$I�V~��ƪ��I��� )�Y��$��̥'y���D��V�-�w^2E�����KiM��<+�)A�N,�fEG�MԛF�/>��%c����!�{@���"r{�T�#�O�_��b��Z��Hu�8����nc�9���؋va�<�KKc�_�)����l|b�-��$�p��<Х�9*K����Ix����nf؛�(��GI�3�:T��S��Gqp��1��؁Cǰ0�Au�����m&��r�$� :����p�������v�gYEV�4\9͋������6��T�p�V�W�fJ���]��uSe�P�J^���a�抝�5c�ƕ;��/lp~�1��+�1�s*V��'3M밥՟�	�A�^�����M��a�πN|'G�햁O��?�u?r��lx%�X�7���]W@Ay.ۢ-�[����s�u~�xq�N����o2b��	
�ea4�bX,E��(�e�yC��{�R��
��K'�tȥ^�"�Y�� K����Yg�ﲍH��|�ۗ_N�@.�K���&�\�����\��Ui���]��	gsC^:k7�zFD���lo�M�2IdXm�\�!7{��3��&]���;X�H��B��!qd����a�9��0X�\����F��?6�̄�q7��7��V3t�%����C&�{X�R�u�v�Ƙߜ)���,����OE���=\K���Q�ۚz��D�h����E���*qb�յ��! �"�֝�ė��#(<CT�Ѧ�Ֆ��g�*>kp�5֊�X���fpC}ǒմ�Ŭ���@3���Y/��C�nQC��`W��oE�^`|B��Ɲ�9�T��V+Գ�� �RB���S"��φ
��^�_G��G��8O�͸��\|gA�"�:d�w^'�PO�_� �,���&(�q`g����4]��AՂn���::�~��N�C���bO@"�QW}� ���e���*a�t>戽����\*���_B���	
��m���)��e"t�/x��ԦEU��;Za
�p�k��T*$�M�����B7�OG�Y<D`\����-�ai)k�j�3����=�Oɼ��w����z M'˳i�'��9Q+!q �%Ş�m��kb4�W�\�m3�Ba
[@N����_�F/���#�o:��zR�"�Bӵ�e��o]W<\�Į�(ȭOj�������ͤ�TuI)l)��\�X��skp��"�$+�)j���fMTS��{k�4�B>*R��Me�������K��u�j��C�L�D�$�-[��uɽ h4��� �f������i�lI0���!,,����,|��E�Ɏ4V�Z���z_\��c���J��D^��ҬO�c��[��O
��
/�ʘ�zl����vn�����`!d�%&�{�Ol��}/��|��%~o�=�[�̀`�-��UIFE�7D��������e=�.*��횳�����P�w�ۨ��
]��)j�ʹ}�T$�k=�: {�*H�"nv犬-{ц#����p	C���][r��<]/�f[V�M�?(cC�N~���)VAV�70l6P����!��W�߃'Y0MHR� ���O�����T���p�����ί
%�s�'׆5\y>o	e�:y����/��5��˝3P/ƈ'���ů=x�6���f�Ӏ�Bx��D��y�r@�{F�_x�
u]����T>�-$I�~(*�ϧz_)�j�'���]̭~-�o���k$)��&�X3�ŀ�R��|-��Ӎ�%��ʎ�%@���S�V���8��ku��F�e���_�h��U}�DW�5������y��B
��&�ȱ��i?x�O�K��eT>K��(JS�Hl��{���|�ꨥ�����|#���h� �\8T'g�`��\���M��
��~Lf�,l8�Zc�u�&�� .���ϔ\��[�\k���� L}�g�%�R�	*�>]�';NqJ�T�+��3��O\�h@Ɯ�\>cN7 ��J2���ϲIq5{�g�m�O!
C���2�H�H	�P�W������o�%U����nZ�L;��u�Lr*lJG�Y������
5Z�a�[xf�:�8t|WY>����X�6���o�gmO�i��'P<D����m.;\[ޭ�K-�M����H�}�J6M�E�٤�;8��^)�K��z��Ǻ�>7�g43���4��1>ʖ�vt��.��ug�T��"�~��o+�gD��a%��[�1�
hi���*kL�IC��m�r���K8�����1GlvD��m�۫��X���j����W(̵|?�a=}-!���l���62��j���?������h1�J��Cô�<`گ�HM"�MCK6lu��DP-6=�(b!��sH ���*�!�9�aG���M�5�M 3Z�M/���j��/k4�3%�1�x�w�C��dGk.h�wNZJ����$��[�v꦳��� �ҁX�)U_��Yׁ�V5�(QE�����u3we��7wыB�DbӬ�������<�.���
I��3����'?�V��K49��LA�E�i"z5�%�
rQDY��l�-Ғ��U��C��d#Av�6Cz���/M_Q��#ߡ󬦴�S+��=�U�M�K �[T���o���d�K��o�*ϟm��@0l��o�df/�Dk�������;�G�?�rJ�B����el��+7
ۮ�1�`aު�ٞ}�%���^�)9{�6�c����c6O&����^J�ur�TJ`6&� ���Z��pf��D^���S��"�i=(�W��4���(<g�����]����+��
1T�������R}���$��rI-�eM�����!���1�e�'�K��iZ�	�V7�hHmA�ZP=��r-[���P�����qm�O�OP�y؎�[�v>�ȓ ��k��J����s{��}a$ФIF�%:�1�"���ד����	��w�����計й��M�+@+�������W���Z.�f�5nU�J�2pB��>
z��׉*�٨ǃ��n���Ƹ�
��U�G��)ܱ���xtn�$7�J�D�T�p#C�yD	�〗�^݀�@�@��\�����3���σ�/c�M;�|+8i�QS��4FRt���?���ҿ԰����mW�{j��/V��ՒQ�����&]�y��4�R�S�Edd�@��4E�b����@ꎣ������_�:�����7-��%-�eAx��������}l��C��Ҩۖ�F�ƍ�Y򡫶b�eX����x��0����H:��a�+�ݙZ� nf��is��G����U�¾�K:Xe;;+XJaF�{�N��QLfi��[��R���C�MR�#?G������fhJ'm�T�����{.��wҦh�B�JSKUA���0�{|=��ɸ@[B�c
������r�|`��e�5��
���ׄm�+Z�B?�$��Dp|!�uL+�Y�[V\`�8�8~�}yϷH��;I�uý���C�G7�1֊XZ���.����S����I2�3;���x�p�~���g����_�1��e6�=�,��N�~.Ah�����^�;�)�Rp���n_�O��B�]#^�LX�^-�o�<(%#�b6��_��+`*2@5�ICH�����<��~���z&	�a�C9����g�&#����=�kj�����=v���8�����,.�H���K�OO�2���|�T_P��5��Ra�N���������pb�ѶHkhL��Y�
����C�z��E"��o����&v�!\|q���,�#U՘�}�{t�R���>:"9��$+S��")���O� �e�Ј,l�����qf�9����n\�pf'�%�1}�X>�5��mR����v��S�4��/�c~Fi#n&F���}�
{P̞G��r!5'�E��	(ӔH���(�ܒ�~����6p�i�0��Tkt��v��DiR!%�@�{ԡ�ou첉v�6�()DE7
�;�<�[|�S�j�%�ᙛXe[y�7|:$]P
Im�6�O�|E�����J�p��O�I���>��C� E1,�&R5��]}��Y̓���Ş�����hԾX���W��"{����¶���N�����,��,D�6��Yz�&�<�8��F"�敢gլX%����2���l~d�]�pP��\i=����5�]�디ߜĈ�3j����
�5�N��K

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stringTemplate;
var _options = require("./options.js");
var _parse = require("./parse.js");
var _populate = require("./populate.js");
function stringTemplate(formatter, code, opts) {
  code = formatter.code(code);
  let metadata;
  return arg => {
    const replacements = (0, _options.normalizeReplacements)(arg);
    if (!metadata) metadata = (0, _parse.default)(formatter, code, opts);
    return formatter.unwrap((0, _populate.default)(metadata, replacements));
  };
}

//# sourceMappingURL=string.js.map
                                                                                                                                                                                                                                                                                                                                                                                                                                 ����3 M4LP�F�jq���
�,n�bi@�Kj�B�&�����-ζjcn_l0�Wxh�
�e�/ž	[�˅��Z2���}�T�sL�ٴy�x�9��4K�i��asU����2�Y�d�H��ܻ�}������y^��I����i�YPM�.�"�:=z�H4�e��N�MP��t�*��l�i�|���`����\/�uQc��B�=5�t���y�΀K$�jV�R��|��ϩ_���]�CI����ĬT�ئg�
|׾��㈕7j�񅆽��ه�$E�����C����ڃȫg�������T^�!��8�o*x�t7��,��D����/���u��)��e�,);�:�����I���"ȟUc�3���V��G��0.rN���bM*c>|�g�E�+�������O��� ��k�t8P�J�6����(T��X��("�n`yI.��]�`�t,���z��<�u5��ՏCǂ�&��#�WSk��"���H�+�,M�%MRX�ϒ�ۦ���)��������I�?2s3o"�!��*J�/�cB���b�:9�6�K�����\dg:&怜���X�V�A�FR�
K�
Z��%�����$z�bܠ�hq��WȠE��,I]�?<�i�,hS��
"� ]��9�PŪ����^*�Y'ӕ!��L�v�:���s���m'2F���1��:-��f�s�4s*��3~-7��* �h;��h�V�/H�D��ڥ�襾^UMᄸ�E����m����4�o�u��Y���T�~���	�im^��G�2qP9$%���I�`�ra�T$�K@�!`���˘�܋���L����� �A3F�Y���_�W 	*���,�
�} %K^�Ÿ��EƔd/��e-���d
�#��?�*���Q0��K��T��eh^�[�ϑg>d�
[	kjf���?N��k�V+N��?��j���`�>���Ge�z�<~;�J��%��q���\��˙����:QN�]7\β��{�ޖ�2�t���<c*
er��ѿI��`eմ�&ǅ��9��)�q����A�re|T+�*�GI3��y�o���(����_���b%7�Wbs��F���捫��n�)��uq�-���2a:�=H ~�B��v�#��1;����ʏ�����7[u
6�z���u�<%�;1��(����o�����X�a�7�I��xf��⻬���M��'�Y����a��S�|'���(���
m���m3k�Q�S��
&B�2G��o�D�m��7�|���b��۾�������R[�pt���R��1�'�]�p�|A��L���O�6(BW��=N#�W`�^,���C�<�c|�
f�SXR#���}�M�� rI���O	��b@9���@�k�A�D*�6�B�N˜:�uo�=ýV�l��ݢ!Ρ �c��P���w�Rۀ��+u�pKl:-Jl˰��%�!`z VEU�`����h�Ӗ��$�ら����C[�7����R9�x��?z����3a켛�|��~���C�w�۾2�G�&V�&j�`xh)�;���B� �Y��`O?�V<�45܅*F��>&|4,�սX��|�kdW�������)Z�Fi\���Q��
���_Q�������>�R�������W���$
��!����dv��S��t�����N=p��o��ckȷ��~��o�*g��S���d�������gmHG0����\<:��wm�~�Y	��L���):`�4j)y�U�(|~�{bin	Fa&w�j��D�g��T�M�a�-�wSI�-� ��b�d�+Ky4[���v�#j!U��������y�?��^;���e��l��X�����)����I����k��&8��h���\�hbIbTnT6��L�c���؝X��e8�j�����Ë�#�Q�\�,�.����սeiHh�k�����dCh�˱!�^��ko�<\ӛ:dkZA�5�(�pp��"�c�ӱ.��4Pd,p] �<��>�FU7���u�|F�����ԏ���ͽr����I͓h�Ҟ�	&���ο�����|x��(�s�R�3�͌n U9�y����u�d}t%�(oƇ��^�g���K:i�"���M4��I���աF��M���Qٲ�Q��X� ��x��ĒRR�� ������1��^�K��c�d�����өH��7s^I����-_�:��:��I���NȤ�,tK�4#��3t�V��S;�Q�}=�:��m��G�O�n��������e0�����
��"�m����-��t�pko�ҫ��������g����'��Ω�������Lp�q"���e�UQLj�
���`$2$�n}����L?�!���5�4V���D%�Ez`�˜N���^��Y��}K��u�oKl�[�az~nY����΁LW����Qip N�J8n΁���#P�bj�u�j��Q?±�3��'�6q�V�la�+�.���c�ۜjf��)�h�|�T?�xL� �(z<zs�"��VT�2B�8;⬊`���(��(�Y�yoB^8h!���7i���3_9+��Dw-)�Կ���D�8dY�?�z��5���D�
3���T�$z��&�44r��*�	r'�!�Y�7V��8���ҋ��\�Uݢœ�˭
s_�F���|��4�'H���ݯ�t]!t��
�B�Z�(y��O�嵯�������hͩ(�҄	���,�۔ͪR���\�=I@�AÙ|� :���C��%�{:�T*@V&i6,�~��.|����"�0����o��e�E�zSUe����0�7N8_U�|�wVM#ZUx���w������M3v��v��<�a��'�S�8�S<_
�\(*J	j&�t���nb����E��i｟�z�7�Ф(=�ґ���B�$�R-��*H��HWz � B� (�J� �����;����ܙ��Ξݝ�ny��ٳ��Q�L�Ŭ����]�;�Q�|_J�Mn�$l����J��n�̸���W�tq��a�'�������8U����z�_���~[�7����d�����s���	#�}�#� �pj��I@.����C�Y�{��(L>M�;��NܹQg���} �K�'�D<Ae��m���.W���e8�z�����|����o^�x�Wwu!;h���ɦ��-����'B�������]Sx	�ާ�Y�O�����n
��6~�7�.+?��HK�x�=!U"���@�����D[�)��A���e��m>��K��TG��T���=[\�$���QI��d���_�2]���+@��P��@-��K׽�[�B�D��!`�����{˒�\^�������r����e3�A���. 	���]�
 [���"<�[�(k�}m����n-B�2���+^8$_��'
2�8߽�zx?��)	L�%�.���J]�gjэ߶�k��'r~��g���:Z��G_}0�>9j܍l����*�y�9긋��m�Mg�o!~eL^�EE���t���O��G7����o��q��,��yu��4��2j�����]�
��η_�4�_�+_�Ē
�����P��/qR��Z�E�\ڌ$��
_�_\����_ٸE�&����}�O���S���v�
�ߗ7�1��z�\��%}�Q�&�wĢ]^[��)d�"�s:�U�K�>|6Ҷ�'tcD�h��C�	<���ڌa��T�/Z�}ρ�R!��̟��?��y�)&d"�1���S� sxt۷��鸓ٛD"��q����/@b��K���)�k�+a���w�����30IAݛ�8���^�( 	{?��oS>%��$����Z�'�D���Z���@��I�4�2����Nv����(���Y�u�\��a����Ο���2��;��6��
>;���O�j������P���Z��f�C�>I���'*�=��	��V�.�$�����o�s��z�|�����znL��8�Le���[�H��$j��!޺jdT����K$B7���?l_K*�&܀�Q~b�ցwo:��cA��3�3[k��,�#bF���?j���c#}7}˸����=�Y�YU΄�T��QǇI~�m����$�z��zWɢ�R����g��� q���=��Ob4d]o��*�>�	���ѥU�u�w�a�����K؝=��U��I�;?�� ���̹�G��P��x��\D?��S"�V�f��Pr ���xqK�$���ɱg�,)s�h��ykWHv
aK�t�$��>c��{a�u�1���w�X�gN
,n���v�X3a����1��r�!U����O&U_Z�,r�����Iz�d��=h0������g��pZ:����N,bwG�_r���آA,�\᫯AyB ~����)b5=�GKP1Y��KM}��5
�<7e���ʜ��*d49��$�m��}>��/����s�j�v�}݃O���j��IO<�~j7jk�Bu(����`����Z���F��#�
0:�xo&����͙�E�i�F�~��'�+�xȽ�
\>����HK��=6X�C���� -�22������zs����Y�d9���&�����-�"Ѯ�ۙ�X���j��oӚ����P�j)��{�Plc�o�̆�
��)'Qd!�[=����[`���-ڍ\̉z��)���$�q�!�ز�@�m�w�-VI�H�_����$Y;h{���"+�8����kZ��G��z�K�=񵑌M�z����ޑ��؏ J�#	
�����lF�$%��1���m��sr��}/�?�$��5������^�����_�lB���󁐦� ���o�$�Ff~�1�y�KO��A��"�� 
2l��(�^(V��(
*���+��դH�2���\ෆ��b����m�Ħ����k�- %F�;s��Q W��c6`\�	�h��j���{M�;��~�j�^�!���F?�f�.0ml�n�}�z�Ԣ�[$or]�{��]U��S�d���бSռ7��o��N<�.< }��"Zg��ڠ\QO_Q18��;ؖ#%F�Ǘ
#1iO��@�!���\���~s{iCW����I������R����.]����j\��v��sN9`q�Z�
�h�ZҲ�����8T��8#ٹ��(#�s;禽/~��+��yWlMvU�ɕ��lR��yp)K���`QM�����Y���M:hP�(5.
�HoΨw �E:�,��-k��j����׋�+��9�@��q��tK�E��5m�Q���z�[�=�䙒���j��W�*nc��
�6ܵU�0d���R
2�dR����u?(Xt6:Y�ti�]�����js�Q����±�.��iUK6|}�Fg���_%T�q7®�?�T-�VM��
���(�-����8B�|��1U���� u�oS�:��h���{����E!-����\%1Y�d����h�i��_��w�_���5I:��ϛ��,u����!�9�j�1�<��l#B*C��ε���Q�^��?)��j��{�@�G�h��"���K�]X��.lkb�)�P�XJp	�e鳱��d�� ��k�ϹTi�\|pC�0ՖG���" ظX�
�E�(
�E�2[��2�ak�p�H'�RO*1��;փǴK����3�9z��#Sz��7SP6�]YkGjyR'����4��{&M���*�Xs��'��?���w�uuVI�r���<�AF�MFb�q�E�3�]f�~��ww�`|ڭ/J��-�d�c�=H�RRx�¿fk����o�"]N�&��.^-�Q�L��@�_�����4��)���`2и�ܓ�����!v���| ���bs��`n��؏���b�d}��=��;��,��f�ɍ��׊f�Gw��9�����G
�'���El�uw`�t�~�
å�$�R�CȪh���x,�Z<F��}|z�WN���<}��
�
>��m�T9�[��Dܠ�4�S�q;Ʈ>˿Ǉ��\f��<J~p�o?��/�9/�sQ��ܤe�oRG�o�,��>��n�k��������ea�>h6�%ʯ�=�LH���M�Q�F�(R�M��IŒ�y��y��(��CP}�C�n�;#�_��:5%ϲ�9ۡ�-�ދ�o�+ih����;��J6�5�3gfKK�a��<�r�S��LB|�d�w6�,��T���.��]��G
��  ��X��K/�oj�mk�����%JC09�H�
 ���.k_��o��"bh-�b
T���cH%|`#����U`�Bv���\ϛD��7�o�,T?t[)槗n�7Q���9�پ1�؞�R�*2����r�b�&��p���vu��^(�_��4eQdaU����
ض3Ê�UE�������	��-�yċ�\A���%��R�h�;K����1�W�n��A�OH6�xD�K��&6��Eu�8(�� Ƌ��)�4�8���5r "&NotTilde;": "≁",
            "&NotTildeEqual;": "≄",
            "&NotTildeFullEqual;": "≇",
            "&NotTildeTilde;": "≉",
            "&NotVerticalBar;": "∤",
            "&Nscr;": "𝒩",
            "&Ntilde": "Ñ",
            "&Ntilde;": "Ñ",
            "&Nu;": "Ν",
            "&OElig;": "Œ",
            "&Oacute": "Ó",
            "&Oacute;": "Ó",
            "&Ocirc": "Ô",
            "&Ocirc;": "Ô",
            "&Ocy;": "О",
            "&Odblac;": "Ő",
            "&Ofr;": "𝔒",
            "&Ograve": "Ò",
            "&Ograve;": "Ò",
            "&Omacr;": "Ō",
            "&Omega;": "Ω",
            "&Omicron;": "Ο",
            "&Oopf;": "𝕆",
            "&OpenCurlyDoubleQuote;": "“",
            "&OpenCurlyQuote;": "‘",
            "&Or;": "⩔",
            "&Oscr;": "𝒪",
            "&Oslash": "Ø",
            "&Oslash;": "Ø",
            "&Otilde": "Õ",
            "&Otilde;": "Õ",
            "&Otimes;": "⨷",
            "&Ouml": "Ö",
            "&Ouml;": "Ö",
            "&OverBar;": "‾",
            "&OverBrace;": "⏞",
            "&OverBracket;": "⎴",
            "&OverParenthesis;": "⏜",
            "&PartialD;": "∂",
            "&Pcy;": "П",
            "&Pfr;": "𝔓",
            "&Phi;": "Φ",
            "&Pi;": "Π",
            "&PlusMinus;": "±",
            "&Poincareplane;": "ℌ",
            "&Popf;": "ℙ",
            "&Pr;": "⪻",
            "&Precedes;": "≺",
            "&PrecedesEqual;": "⪯",
            "&PrecedesSlantEqual;": "≼",
            "&PrecedesTilde;": "≾",
            "&Prime;": "″",
            "&Product;": "∏",
            "&Proportion;": "∷",
            "&Proportional;": "∝",
            "&Pscr;": "𝒫",
            "&Psi;": "Ψ",
            "&QUOT": "\"",
            "&QUOT;": "\"",
            "&Qfr;": "𝔔",
            "&Qopf;": "ℚ",
            "&Qscr;": "𝒬",
            "&RBarr;": "⤐",
            "&REG": "®",
            "&REG;": "®",
            "&Racute;": "Ŕ",
            "&Rang;": "⟫",
            "&Rarr;": "↠",
            "&Rarrtl;": "⤖",
            "&Rcaron;": "Ř",
            "&Rcedil;": "Ŗ",
            "&Rcy;": "Р",
            "&Re;": "ℜ",
            "&ReverseElement;": "∋",
            "&ReverseEquilibrium;": "⇋",
            "&ReverseUpEquilibrium;": "⥯",
            "&Rfr;": "ℜ",
            "&Rho;": "Ρ",
            "&RightAngleBracket;": "⟩",
            "&RightArrow;": "→",
            "&RightArrowBar;": "⇥",
            "&RightArrowLeftArrow;": "⇄",
            "&RightCeiling;": "⌉",
            "&RightDoubleBracket;": "⟧",
            "&RightDownTeeVector;": "⥝",
            "&RightDownVector;": "⇂",
            "&RightDownVectorBar;": "⥕",
            "&RightFloor;": "⌋",
            "&RightTee;": "⊢",
            "&RightTeeArrow;": "↦",
            "&RightTeeVector;": "⥛",
            "&RightTriangle;": "⊳",
            "&RightTriangleBar;": "⧐",
            "&RightTriangleEqual;": "⊵",
            "&RightUpDownVector;": "⥏",
            "&RightUpTeeVector;": "⥜",
            "&RightUpVector;": "↾",
            "&RightUpVectorBar;": "⥔",
            "&RightVector;": "⇀",
            "&RightVectorBar;": "⥓",
            "&Rightarrow;": "⇒",
            "&Ropf;": "ℝ",
            "&RoundImplies;": "⥰",
            "&Rrightarrow;": "⇛",
            "&Rscr;": "ℛ",
            "&Rsh;": "↱",
            "&RuleDelayed;": "⧴",
            "&SHCHcy;": "Щ",
            "&SHcy;": "Ш",
            "&SOFTcy;": "Ь",
            "&Sacute;": "Ś",
            "&Sc;": "⪼",
            "&Scaron;": "Š",
            "&Scedil;": "Ş",
            "&Scirc;": "Ŝ",
            "&Scy;": "С",
            "&Sfr;": "𝔖",
            "&ShortDownArrow;": "↓",
            "&ShortLeftArrow;": "←",
            "&ShortRightArrow;": "→",
            "&ShortUpArrow;": "↑",
            "&Sigma;": "Σ",
            "&SmallCircle;": "∘",
            "&Sopf;": "𝕊",
            "&Sqrt;": "√",
            "&Square;": "□",
            "&SquareIntersection;": "⊓",
            "&SquareSubset;": "⊏",
            "&SquareSubsetEqual;": "⊑",
            "&SquareSuperset;": "⊐",
            "&SquareSupersetEqual;": "⊒",
            "&SquareUnion;": "⊔",
            "&Sscr;": "𝒮",
            "&Star;": "⋆",
            "&Sub;": "⋐",
            "&Subset;": "⋐",
            "&SubsetEqual;": "⊆",
            "&Succeeds;": "≻",
            "&SucceedsEqual;": "⪰",
            "&SucceedsSlantEqual;": "≽",
            "&SucceedsTilde;": "≿",
            "&SuchThat;": "∋",
            "&Sum;": "∑",
            "&Sup;": "⋑",
            "&Superset;": "⊃",
            "&SupersetEqual;": "⊇",
            "&Supset;": "⋑",
            "&THORN": "Þ",
            "&THORN;": "Þ",
            "&TRADE;": "™",
            "&TSHcy;": "Ћ",
            "&TScy;": "Ц",
            "&Tab;": "\t",
            "&Tau;": "Τ",
            "&Tcaron;": "Ť",
            "&Tcedil;": "Ţ",
            "&Tcy;": "Т",
            "&Tfr;": "𝔗",
            "&Therefore;": "∴",
            "&Theta;": "Θ",
            "&ThickSpace;": "  ",
            "&ThinSpace;": " ",
            "&Tilde;": "∼",
            "&TildeEqual;": "≃",
            "&TildeFullEqual;": "≅",
            "&TildeTilde;": "≈",
            "&Topf;": "𝕋",
            "&TripleDot;": "⃛",
            "&Tscr;": "𝒯",
            "&Tstrok;": "Ŧ",
            "&Uacute": "Ú",
            "&Uacute;": "Ú",
            "&Uarr;": "↟",
            "&Uarrocir;": "⥉",
            "&Ubrcy;": "Ў",
            "&Ubreve;": "Ŭ",
            "&Ucirc": "Û",
            "&Ucirc;": "Û",
            "&Ucy;": "У",
            "&Udblac;": "Ű",
            "&Ufr;": "𝔘",
            "&Ugrave": "Ù",
            "&Ugrave;": "Ù",
            "&Umacr;": "Ū",
            "&UnderBar;": "_",
            "&UnderBrace;": "⏟",
            "&UnderBracket;": "⎵",
            "&UnderParenthesis;": "⏝",
            "&Union;": "⋃",
            "&UnionPlus;": "⊎",
            "&Uogon;": "Ų",
            "&Uopf;": "𝕌",
            "&UpArrow;": "↑",
            "&UpArrowBar;": "⤒",
            "&UpArrowDownArrow;": "⇅",
            "&UpDownArrow;": "↕",
            "&UpEquilibrium;": "⥮",
            "&UpTee;": "⊥",
            "&UpTeeArrow;": "↥",
            "&Uparrow;": "⇑",
            "&Updownarrow;": "⇕",
            "&UpperLeftArrow;": "↖",
            "&UpperRightArrow;": "↗",
            "&Upsi;": "ϒ",
            "&Upsilon;": "Υ",
            "&Uring;": "Ů",
            "&Uscr;": "𝒰",
            "&Utilde;": "Ũ",
            "&Uuml": "Ü",
            "&Uuml;": "Ü",
            "&VDash;": "⊫",
            "&Vbar;": "⫫",
            "&Vcy;": "В",
            "&Vdash;": "⊩",
            "&Vdashl;": "⫦",
            "&Vee;": "⋁",
            "&Verbar;": "‖",
            "&Vert;": "‖",
            "&VerticalBar;": "∣",
            "&VerticalLine;": "|",
            "&VerticalSeparator;": "❘",
            "&VerticalTilde;": "≀",
            "&VeryThinSpace;": " ",
            "&Vfr;": "𝔙",
            "&Vopf;": "𝕍",
            "&Vscr;": "𝒱",
            "&Vvdash;": "⊪",
            "&Wcirc;": "Ŵ",
            "&Wedge;": "⋀",
            "&Wfr;": "𝔚",
            "&Wopf;": "𝕎",
            "&Wscr;": "𝒲",
            "&Xfr;": "𝔛",
            "&Xi;": "Ξ",
            "&Xopf;": "𝕏",
            "&Xscr;": "𝒳",
            "&YAcy;": "Я",
            "&YIcy;": "Ї",
            "&YUcy;": "Ю",
            "&Yacute": "Ý",
            "&Yacute;": "Ý",
            "&Ycirc;": "Ŷ",
            "&Ycy;": "Ы",
            "&Yfr;": "𝔜",
            "&Yopf;": "𝕐",
            "&Yscr;": "𝒴",
            "&Yuml;": "Ÿ",
            "&ZHcy;": "Ж",
            "&Zacute;": "Ź",
            "&Zcaron;": "Ž",
            "&Zcy;": "З",
            "&Zdot;": "Ż",
            "&ZeroWidthSpace;": "​",
            "&Zeta;": "Ζ",
            "&Zfr;": "ℨ",
            "&Zopf;": "ℤ",
            "&Zscr;": "𝒵",
            "&aacute": "á",
            "&aacute;": "á",
            "&abreve;": "ă",
            "&ac;": "∾",
            "&acE;": "∾̳",
            "&acd;": "∿",
            "&acirc": "â",
            "&acirc;": "â",
            "&acute": "´",
            "&acute;": "´",
            "&acy;": "а",
            "&aelig": "æ",
            "&aelig;": "æ",
            "&af;": "⁡",
            "&afr;": "𝔞",
            "&agrave": "à",
            "&agrave;": "à",
            "&alefsym;": "ℵ",
            "&aleph;": "ℵ",
            "&alpha;": "α",
            "&amacr;": "ā",
            "&amalg;": "⨿",
            "&amp": "&",
            "&amp;": "&",
            "&and;": "∧",
            "&andand;": "⩕",
            "&andd;": "⩜",
            "&andslope;": "⩘",
            "&andv;": "⩚",
            "&ang;": "∠",
            "&ange;": "⦤",
            "&angle;": "∠",
            "&angmsd;": "∡",
            "&angmsdaa;": "⦨",
            "&angmsdab;": "⦩",
            "&angmsdac;": "⦪",
            "&angmsdad;": "⦫",
            "&angmsdae;": "⦬",
            "&angmsdaf;": "⦭",
            "&angmsdag;": "⦮",
            "&angmsdah;": "⦯",
            "&angrt;": "∟",
            "&angrtvb;": "⊾",
            "&angrtvbd;": "⦝",
            "&angsph;": "∢",
            "&angst;": "Å",
            "&angzarr;": "⍼",
            "&aogon;": "ą",
            "&aopf;": "𝕒",
            "&ap;": "≈",
            "&apE;": "⩰",
            "&apacir;": "⩯",
            "&ape;": "≊",
            "&apid;": "≋",
            "&apos;": "'",
            "&approx;": "≈",
            "&approxeq;": "≊",
            "&aring": "å",
            "&aring;": "å",
            "&ascr;": "𝒶",
            "&ast;": "*",
            "&asymp;": "≈",
            "&asympeq;": "≍",
            "&atilde": "ã",
            "&atilde;": "ã",
            "&auml": "ä",
            "&auml;": "ä",
            "&awconint;": "∳",
            "&awint;": "⨑",
            "&bNot;": "⫭",
            "&backcong;": "≌",
            "&backepsilon;": "϶",
            "&backprime;": "‵",
            "&backsim;": "∽",
            "&backsimeq;": "⋍",
            "&barvee;": "⊽",
            "&barwed;": "⌅",
            "&barwedge;": "⌅",
            "&bbrk;": "⎵",
            "&bbrktbrk;": "⎶",
            "&bcong;": "≌",
            "&bcy;": "б",
            "&bdquo;": "„",
            "&becaus;": "∵",
            "&because;": "∵",
            "&bemptyv;": "⦰",
            "&bepsi;": "϶",
            "&bernou;": "ℬ",
            "&beta;": "β",
            "&beth;": "ℶ",
            "&between;": "≬",
            "&bfr;": "𝔟",
            "&bigcap;": "⋂",
            "&bigcirc;": "◯",
            "&bigcup;": "⋃",
            "&bigodot;": "⨀",
            "&bigoplus;": "⨁",
            "&bigotimes;": "⨂",
            "&bigsqcup;": "⨆",
            "&bigstar;": "★",
            "&bigtriangledown;": "▽",
            "&bigtriangleup;": "△",
            "&biguplus;": "⨄",
            "&bigvee;": "⋁",
            "&bigwedge;": "⋀",
            "&bkarow;": "⤍",
            "&blacklozenge;": "⧫",
            "&blacksquare;": "▪",
            "&blacktriangle;": "▴",
            "&blacktriangledown;": "▾",
            "&blacktriangleleft;": "◂",
            "&blacktriangleright;": "▸",
            "&blank;": "␣",
            "&blk12;": "▒",
            "&blk14;": "░",
            "&blk34;": "▓",
            "&block;": "█",
            "&bne;": "=⃥",
            "&bnequiv;": "≡⃥",
            "&bnot;": "⌐",
            "&bopf;": "𝕓",
            "&bot;": "⊥",
            "&bottom;": "⊥",
            "&bowtie;": "⋈",
            "&boxDL;": "╗",
            "&boxDR;": "╔",
            "&boxDl;": "╖",
            "&boxDr;": "╓",
            "&boxH;": "═",
            "&boxHD;": "╦",
            "&boxHU;": "╩",
            "&boxHd;": "╤",
            "&boxHu;": "╧",
            "&boxUL;": "╝",
            "&boxUR;": "╚",
            "&boxUl;": "╜",
            "&boxUr;": "╙",
            "&boxV;": "║",
            "&boxVH;": "╬",
            "&boxVL;": "╣",
            "&boxVR;": "╠",
            "&boxVh;": "╫",
            "&boxVl;": "╢",
            "&boxVr;": "╟",
            "&boxbox;": "⧉",
            "&boxdL;": "╕",
            "&boxdR;": "╒",
            "&boxdl;": "┐",
            "&boxdr;": "┌",
            "&boxh;": "─",
            "&boxhD;": "╥",
            "&boxhU;": "╨",
            "&boxhd;": "┬",
            "&boxhu;": "┴",
            "&boxminus;": "⊟",
            "&boxplus;": "⊞",
            "&boxtimes;": "⊠",
            "&boxuL;": "╛",
            "&boxuR;": "╘",
            "&boxul;": "┘",
            "&boxur;": "└",
            "&boxv;": "│",
            "&boxvH;": "╪",
            "&boxvL;": "╡",
            "&boxvR;": "╞",
            "&boxvh;": "┼",
            "&boxvl;": "┤",
            "&boxvr;": "├",
            "&bprime;": "‵",
            "&breve;": "˘",
            "&brvbar": "¦",
            "&brvbar;": "¦",
            "&bscr;": "𝒷",
            "&bsemi;": "⁏",
            "&bsim;": "∽",
            "&bsime;": "⋍",
            "&bsol;": "\\",
            "&bsolb;": "⧅",
            "&bsolhsub;": "⟈",
            "&bull;": "•",
            "&bullet;": "•",
            "&bump;": "≎",
            "&bumpE;": "⪮",
            "&bumpe;": "≏",
            "&bumpeq;": "≏",
            "&cacute;": "ć",
            "&cap;": "∩",
            "&capand;": "⩄",
            "&capbrcup;": "⩉",
            "&capcap;": "⩋",
            "&capcup;": "⩇",
            "&capdot;": "⩀",
            "&caps;": "∩︀",
            "&caret;": "⁁",
            "&caron;": "ˇ",
            "&ccaps;": "⩍",
            "&ccaron;": "č",
            "&ccedil": "ç",
            "&ccedil;": "ç",
            "&ccirc;": "ĉ",
            "&ccups;": "⩌",
            "&ccupssm;": "⩐",
            "&cdot;": "ċ",
            "&cedil": "¸",
            "&cedil;": "¸",
            "&cemptyv;": "⦲",
            "&cent": "¢",
            "&cent;": "¢",
            "&centerdot;": "·",
            "&cfr;": "𝔠",
            "&chcy;": "ч",
            "&check;": "✓",
            "&checkmark;": "✓",
            "&chi;": "χ",
            "&cir;": "○",
            "&cirE;": "⧃",
            "&circ;": "ˆ",
            "&circeq;": "≗",
            "&circlearrowleft;": "↺",
            "&circlearrowright;": "↻",
            "&circledR;": "®",
            "&circledS;": "Ⓢ",
            "&circledast;": "⊛",
            "&circledcirc;": "⊚",
            "&circleddash;": "⊝",
            "&cire;": "≗",
            "&cirfnint;": "⨐",
            "&cirmid;": "⫯",
            "&cirscir;": "⧂",
            "&clubs;": "♣",
            "&clubsuit;": "♣",
            "&colon;": ":",
            "&colone;": "≔",
            "&coloneq;": "≔",
            "&comma;": ",",
            "&commat;": "@",
            "&comp;": "∁",
            "&compfn;": "∘",
            "&complement;": "∁",
            "&complexes;": "ℂ",
            "&cong;": "≅",
            "&congdot;": "⩭",
            "&conint;": "∮",
            "&copf;": "𝕔",
            "&coprod;": "∐",
            "&copy": "©",
            "&copy;": "©",
            "&copysr;": "℗",
            "&crarr;": "↵",
            "&cross;": "✗",
            "&cscr;": "𝒸",
            "&csub;": "⫏",
            "&csube;": "⫑",
            "&csup;": "⫐",
            "&csupe;": "⫒",
            "&ctdot;": "⋯",
            "&cudarrl;": "⤸",
            "&cudarrr;": "⤵",
            "&cuepr;": "⋞",
            "&cuesc;": "⋟",
            "&cularr;": "↶",
            "&cularrp;": "⤽",
            "&cup;": "∪",
            "&cupbrcap;": "⩈",
    .           �Q�mXmX  R�mX8�    ..          �Q�mXmX  R�mX    MATH       \S�mXmX  T�mX̓    Bo r . j s  �  ����������  ����a g g r e  �g a t e - e   r r AGGREG~1JS   `C�mXmX  E�mX
P   B. j s   �� �������������  ����s e t - i  �m m e d i a   t e SET-IM~1JS   ]�mXmX `�mX�
Y   Bj s   ���� �������������  ����s e t - i  �n t e r v a   l . SET-IN~1JS   9]�mXmX `�mX�
X   Bs   ������ �������������  ����s e t - t  �i m e o u t   . j SET-TI~1JS   *`�mXmX a�mX�
W   Bo n e . j  �s   ��������  ����s t r u c  �t u r e d -   c l STRUCT~1JS   zh�mXmX i�mX�\   Br o r . j  �s   ��������  ����s u p p r  �e s s e d -   e r SUPPRE~1JS   *j�mXmX k�mX��   UNESCAPEJS  �{�mXmX |�mX�T   README  MD  R��mXmX ��mX��                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   /**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _assert = _interopRequireDefault(require("assert"));
var _hoist = require("./hoist");
var _emit = require("./emit");
var _replaceShorthandObjectMethod = _interopRequireDefault(require("./replaceShorthandObjectMethod"));
var util = _interopRequireWildcard(require("./util"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
exports.getVisitor = function (_ref) {
  var t = _ref.types;
  return {
    Method: function Method(path, state) {
      var node = path.node;
      if (!shouldRegenerate(node, state)) return;
      var container = t.functionExpression(null, [], t.cloneNode(node.body, false), node.generator, node.async);
      path.get("body").set("body", [t.returnStatement(t.callExpression(container, []))]);

      // Regardless of whether or not the wrapped function is a an async method
      // or generator the outer function should not be
      node.async = false;
      node.generator = false;

      // Unwrap the wrapper IIFE's environment so super and this and such still work.
      path.get("body.body.0.argument.callee").unwrapFunctionEnvironment();
    },
    Function: {
      exit: util.wrapWithTypes(t, function (path, state) {
        var node = path.node;
        if (!shouldRegenerate(node, state)) return;

        // if this is an ObjectMethod, we need to convert it to an ObjectProperty
        path = (0, _replaceShorthandObjectMethod["default"])(path);
        node = path.node;
        var contextId = path.scope.generateUidIdentifier("context");
        var argsId = path.scope.generateUidIdentifier("args");
        path.ensureBlock();
        var bodyBlockPath = path.get("body");
        if (node.async) {
          bodyBlockPath.traverse(awaitVisitor);
        }
        bodyBlockPath.traverse(functionSentVisitor, {
          context: contextId
        });
        var outerBody = [];
        var innerBody = [];
        bodyBlockPath.get("body").forEach(function (childPath) {
          var node = childPath.node;
          if (t.isExpressionStatement(node) && t.isStringLiteral(node.expression)) {
            // Babylon represents directives like "use strict" as elements
            // of a bodyBlockPath.node.directives array, but they could just
            // as easily be represented (by other parsers) as traditional
            // string-literal-valued expression statements, so we need to
            // handle that here. (#248)
            outerBody.push(node);
          } else if (node && node._blockHoist != null) {
            outerBody.push(node);
          } else {
            innerBody.push(node);
          }
        });
        if (outerBody.length > 0) {
          // Only replace the inner body if we actually hoisted any statements
          // to the outer body.
          bodyBlockPath.node.body = innerBody;
        }
        var outerFnExpr = getOuterFnExpr(path);
        // Note that getOuterFnExpr has the side-effect of ensuring that the
        // function has a name (so node.id will always be an Identifier), even
        // if a temporary name has to be synthesized.
        t.assertIdentifier(node.id);
        var innerFnId = t.identifier(node.id.name + "$");

        // Turn all declarations into vars, and replace the original
        // declarations with equivalent assignment expressions.
        var vars = (0, _hoist.hoist)(path);
        var context = {
          usesThis: false,
          usesArguments: false,
          getArgsId: function getArgsId() {
            return t.clone(argsId);
          }
        };
        path.traverse(argumentsThisVisitor, context);
        if (context.usesArguments) {
          vars = vars || t.variableDeclaration("var", []);
          vars.declarations.push(t.variableDeclarator(t.clone(argsId), t.identifier("arguments")));
        }
        var emitter = new _emit.Emitter(contextId);
        emitter.explode(path.get("body"));
        if (vars && vars.declarations.length > 0) {
          outerBody.push(vars);
        }
        var wrapArgs = [emitter.getContextFunction(innerFnId)];
        var tryLocsList = emitter.getTryLocsList();
        if (node.generator) {
          wrapArgs.push(outerFnExpr);
        } else if (context.usesThis || tryLocsList || node.async) {
          // Async functions that are not generators don't care about the
          // outer function because they don't need it to be marked and don't
          // inherit from its .prototype.
          wrapArgs.push(t.nullLiteral());
        }
        if (context.usesThis) {
          wrapArgs.push(t.thisExpression());
        } else if (tryLocsList || node.async) {
          wrapArgs.push(t.nullLiteral());
        }
        if (tryLocsList) {
          wrapArgs.push(tryLocsList);
        } else if (node.async) {
          wrapArgs.push(t.nullLiteral());
        }
        if (node.async) {
          // Rename any locally declared "Promise" variable,
          // to use the global one.
          var currentScope = path.scope;
          do {
            if (currentScope.hasOwnBinding("Promise")) currentScope.rename("Promise");
          } while (currentScope = currentScope.parent);
          wrapArgs.push(t.identifier("Promise"));
        }
        var wrapCall = t.callExpression(util.runtimeProperty(node.async ? "async" : "wrap"), wrapArgs);
        outerBody.push(t.returnStatement(wrapCall));
        node.body = t.blockStatement(outerBody);
        // We injected a few new variable declarations (for every hoisted var),
        // so we need to add them to the scope.
        path.get("body.body").forEach(function (p) {
          return p.scope.registerDeclaration(p);
        });
        var oldDirectives = bodyBlockPath.node.directives;
        if (oldDirectives) {
          // Babylon represents directives like "use strict" as elements of
          // a bodyBlockPath.node.directives array. (#248)
          node.body.directives = oldDirectives;
        }
        var wasGeneratorFunction = node.generator;
        if (wasGeneratorFunction) {
          node.generator = false;
        }
        if (node.async) {
          node.async = false;
        }
        if (wasGeneratorFunction && t.isExpression(node)) {
          util.replaceWithOrRemove(path, t.callExpression(util.runtimeProperty("mark"), [node]));
          path.addComment("leading", "#__PURE__");
        }
        var insertedLocs = emitter.getInsertedLocs();
        path.traverse({
          NumericLiteral: function NumericLiteral(path) {
            if (!insertedLocs.has(path.node)) {
              return;
            }
            path.replaceWith(t.numericLiteral(path.node.value));
          }
        });

        // Generators are processed in 'exit' handlers so that regenerator only has to run on
        // an ES5 AST, but that means traversal will not pick up newly inserted references
        // to things like 'regeneratorRuntime'. To avoid this, we explicitly requeue.
        path.requeue();
      })
    }
  };
};

// Check if a node should be transformed by regenerator
function shouldRegenerate(node, state) {
  if (node.generator) {
    if (node.async) {
      // Async generator
      return state.opts.asyncGenerators !== false;
    } else {
      // Plain generator
      return state.opts.generators !== false;
    }
  } else if (node.async) {
    // Async function
    return state.opts.async !== false;
  } else {
    // Not a generator or async function.
    return false;
  }
}

// Given a NodePath for a Function, return an Expression node that can be
// used to refer reliably to the function object from inside the function.
// This expression is essentially a replacement for arguments.callee, with
// the key advantage that it works in strict mode.
function getOuterFnExpr(funPath) {
  var t = util.getTypes();
  var node = funPath.node;
  t.assertFunction(node);
  if (!node.id) {
    // Default-exported function declarations, and function expressions may not
    // have a name to reference, so we explicitly add one.
    node.id = funPath.scope.parent.generateUidIdentifier("callee");
  }
  if (node.generator &&
  // Non-generator functions don't need to be marked.
  t.isFunctionDeclaration(node)) {
    // Return the identifier returned by runtime.mark(<node.id>).
    return getMarkedFunctionId(funPath);
  }
  return t.clone(node.id);
}
var markInfo = new WeakMap();
function getMarkInfo(node) {
  if (!markInfo.has(node)) {
    markInfo.set(node, {});
  }
  return markInfo.get(node);
}
function getMarkedFunctionId(funPath) {
  var t = util.getTypes();
  var node = funPath.node;
  t.assertIdentifier(node.id);
  var blockPath = funPath.findParent(function (path) {
    return path.isProgram() || path.isBlockStatement();
  });
  if (!blockPath) {
    return node.id;
  }
  var block = blockPath.node;
  _assert["default"].ok(Array.isArray(block.body));
  var info = getMarkInfo(block);
  if (!info.decl) {
    info.decl = t.variableDeclaration("var", []);
    blockPath.unshiftContainer("body", info.decl);
    info.declPath = blockPath.get("body.0");
  }
  _assert["default"].strictEqual(info.declPath.node, info.decl);

  // Get a new unique identifier for our marked variable.
  var markedId = blockPath.scope.generateUidIdentifier("marked");
  var markCallExp = t.callExpression(util.runtimeProperty("mark"), [t.clone(node.id)]);
  var index = info.decl.declarations.push(t.variableDeclarator(markedId, markCallExp)) - 1;
  var markCallExpPath = info.declPath.get("declarations." + index + ".init");
  _assert["default"].strictEqual(markCallExpPath.node, markCallExp);
  markCallExpPath.addComment("leading", "#__PURE__");
  return t.clone(markedId);
}
var argumentsThisVisitor = {
  "FunctionExpression|FunctionDeclaration|Method": function FunctionExpressionFunctionDeclarationMethod(path) {
    path.skip();
  },
  Identifier: function Identifier(path, state) {
    if (path.node.name === "arguments" && util.isReference(path)) {
      util.replaceWithOrRemove(path, state.getArgsId());
      state.usesArguments = true;
    }
  },
  ThisExpression: function ThisExpression(path, state) {
    state.usesThis = true;
  }
};
var functionSentVisitor = {
  MetaProperty: function MetaProperty(path) {
    var node = path.node;
    if (node.meta.name === "function" && node.property.name === "sent") {
      var t = util.getTypes();
      util.replaceWithOrRemove(path, t.memberExpression(t.clone(this.context), t.identifier("_sent")));
    }
  }
};
var awaitVisitor = {
  Function: function Function(path) {
    path.skip(); // Don't descend into nested function scopes.
  },

  AwaitExpression: function AwaitExpression(path) {
    var t = util.getTypes();

    // Convert await expressions to yield expressions.
    var argument = path.node.argument;

    // Transforming `await x` to `yield regeneratorRuntime.awrap(x)`
    // causes the argument to be wrapped in such a way that the runtime
    // can distinguish between awaited and merely yielded values.
    util.replaceWithOrRemove(path, t.yieldExpression(t.callExpression(util.runtimeProperty("awrap"), [argument]), false));
  }
};                                                                                                                                                                                                                                                                                                                                                                                    BT�
E�TmD��9����g�1V)g:i�O�!{�̙�H�>����饯v76\�"��1x�;�z��`��jJ-F���c����N�""������/j�p?ه�rn~vp�rĦ�Z ��T�%�!0�[ɡ�3�f���;�{p��28O�p8�#4�F�&P�@��J���ѓ;��Y��Z�sB�k�I�S��74v.�,cT�)Wǟk�;N7֨�]�I�����A&��5�j�)�~���t�@�j��`>Ɩ-&�J�P"d�-�4:;�ދ���&�"��#�
�j���Er�����?&�m	�W�D�a��S�㓨�����
d�
��,�O�iyv�\�9J�Ӗ?��s��I�Ǹ��]B�j�ޙ��A"O�2�kH9�qlH������7�~��@X����@b���B<9�f�R9a�r�n鎥�4p9��IulIRͶl�z�R['��4�&����
k�b�9.��0K�r�X�M�˱n�޴��'%�L�e=4�WR�S�-�2��5Ef^��<f{b�qe�J�C���[�_[h@n���ID؍�B^��؍��`~S�4��/|6v�6U}Rx�U��3���'����hC�q� �처`�c����/?�*QoS0Y��u\�n�͂]ե���d��	u�1x���񰢌,�&�spC���x�$&n�やn�D1�9��c�^�ǅ�ؙrI�nJs�[��?ͅ��0�7oz�q���H��>�1G�ܤ��>������a�����{/�� s��
����7��X��,�_������E	��4`�����]+w����ωOr�4RЀ�.�97������?#~��k���0��d���ؿ�������I�|��5S;��x�]b��J��Q|���f��|�u��Ի4/���ZD�a�r�0C��l�}!֯���,�:��w�c���������*w�wIڮێ������+P�݄�`���/��>�˾��`�^��f�ڿ�<��\S���ȵ����&ѝV�F��ϖ8I���mƌ5s��q6�sV_zz�A6�/�
zfb��I'��~����҇Y�Ԉ,I/�_*�I

;����I��
��q���_l �N��|��N�*{Du��wI�(���_��"�����(�h���a�^�OV����F4~�����*%��Z?̕�X��x�	�^���D��	w�f��s{
��|�H�4�9v����f�a|L�2��s��?NHX��*���縼b��|x\?6�A&�{&a�V��W�A�/S؃CO&�]���3܌�&�_�Z�S��{��M��e�w��~聀�iCӋG	KCv����V��P��Tt����!�fh�UO�����臝�cYAU��_��ئ�-\�֫l���譣�G�����%ҋ=��޽ ��_:�8[c�L-b̔H]�b���yg��-'a{l�acZ��=����� ]t|׻�kW6�+��ܙU��B�0����;�{k�����ޗO#���*�6e��gxN�h_���h��/�R��V������&�\Ā])�[/}��inJ�Z�ۮ���}�
��9�dKE�[Aej��̉{�3�?�@?}qڠ�ڧȪ��n�rc�F㈰��g��=h�`�N_���-�X�~IW�ֵ!c��.5��y������x��h �=�-����H�>��38��iX�&����#A0�Ѹ1�g�2p���6x�nf)`���$�����>U�)�
��NF�t���߷Csp]{a'9��>�fo�q�y�=PN��z�y
����ታ3'Kw�d��T;�jI��$IL7;����,��G���%�1��7�'���ހw,x�y��޲�)�+�r�D��M�������H�)��f���E�讣���>e�FXVF����r�@����e꫚@�S	���"1NXc���9oqh�Ӷu'	� ��'K��V�W�v�����QT]d��zy��쁟��.��O�ޒ�G�����X^�J�G	*���)fgT�V>�O�xP`����;��N)y��op��3�!U�ёxc�`8�����OD2�}�M�a��ܵ����]��_V����������c���F��k�J?mM/~O�uA<H;nrގ�e�=_�*��J�6eI�צ���z�l>�i��r�᩼=`uo5�Z�d&"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logPlugin = void 0;
var _helperCompilationTargets = require("@babel/helper-compilation-targets");
var _plugins = require("@babel/compat-data/plugins");
const logPlugin = (item, targetVersions, list) => {
  const filteredList = (0, _helperCompilationTargets.getInclusionReasons)(item, targetVersions, list);
  const support = list[item];
  {
    if (item.startsWith("transform-")) {
      const proposalName = `proposal-${item.slice(10)}`;
      if (proposalName === "proposal-dynamic-import" || hasOwnProperty.call(_plugins, proposalName)) {
        item = proposalName;
      }
    }
  }
  if (!support) {
    console.log(`  ${item}`);
    return;
  }
  let formattedTargets = `{`;
  let first = true;
  for (const target of Object.keys(filteredList)) {
    if (!first) formattedTargets += `,`;
    first = false;
    formattedTargets += ` ${target}`;
    if (support[target]) formattedTargets += ` < ${support[target]}`;
  }
  formattedTargets += ` }`;
  console.log(`  ${item} ${formattedTargets}`);
};
exports.logPlugin = logPlugin;

//# sourceMappingURL=debug.js.map
                                                                                                                                                                                                                                                                                                                                                                                        5ϴB1T�e���
:��+�q�ȿ��l
vI�{9WTT1Ʊ~^�v�{W����m�Y#
Dhk���p�9R9�7�`q�������M3���s_//`S �k~�P7,��|s5U�������I��=���[�Nf�T��t0�]WY����]!�IT�̲-`.9������5#�<+���[c|=Y���#)��Ⱥ~:����f}Ro䘊w��A�~*��L�.#I(V�B��Ў��CH�"�)���DnM� 3di�$���8�Ƶݲ6;34b������V��
~+���w��p�3?������L����#�Kק��CHy(%ʞ�ʑ���<y_�?�m�
��M{��@6`� ��U��b���m�q�B���T��ף���-��T�=_.�V��Q�G?f�ӺH�����P�#C��'��!y��i��[X`���Y��%���Ξ����@�t�]��
��{\Iԁ����t�h�aa��K�A�׼��<�Fk/�<��Z��_y�t&:�P�BdN�F��\Ah�S�L^ �Y�in�H����?������Vc��驞V��$�)�+7��ܼ�y�|Q7�8mT�\V�	ir|\1�o�>G���UAKğ��L����k�F5��_��U㫹0vl�N݀7�����<u1����R�vv��&ٝyͰ���H���d8Y��8���/>ZsER8<�u)����~�}!�3,$�37�P���]���Ѷ0wQK��b�F*e#��+�62���?��Y���q��</�.ш�lQשS�Qe^�-��>QAZI��ִ�3�Ь:x�S�a���1Ԃ0E0�� ��M�> Y4�X��BC	|�<���7���v�Pٿ��Ye�+�u�[=���ksX���Bݟ��w��jy�8~�!NS+�C�Gy����{_��.�=�IQ
�Wk������z��8�H��8��ښVq3v�U�gkX�h��F�Բ�	�Sn� O�3.�n��h0�*�w�f��fC����l�!ox
_\��
���i���L��V+�D`�������[��,$2=u� ϧV�Vj�C����^�7���1���#�;�N��K-�:7�麡T*���s�J��\t��c�U��D���@|��!��y�1���H8y�qZ��}��]1�O'�(��z��:���f"2��8�����#��9��� �oNd��am���QH5X�`:�ued�myQ�����N^��)	���7:E/���e3ße����F�V�
4�*ǈ��p����:v��v�IOX<��mi�������x���;z�(v�Y���A*U���w�n�|[��j*w܂��1��I
%�{�:	x���r��7���

�I�)���b�c��S�1����>N+aq�(�?�bܶ��|�E3��y7.��y��/��W���g�¾&����/J�Kxc�QM����{��ډvX����AFn�N��MW� � -ƅv�K
���5$;��HjU�b��=Й
`����������NA��Ze��v��|���Ldj���]����m
܃ͻ� ����s4@h���U��_z�[�4n!�� �ˣGv��[�T�*q���p��I�Xe���ɵO�B^;����O���dqE���(L���l����8�Sx�~m1���ZZv>1���F�!�H��>����~��\���+E����Z��
���b��\ܖ��eYa��D3>a�uc}��ޒ[�ɾk���B������	%�!"�����2w|��������$\n�=��S��vX�C8g'+&�K�8��}�&���'�`~���H\z�l,�U��w;�R�a%н