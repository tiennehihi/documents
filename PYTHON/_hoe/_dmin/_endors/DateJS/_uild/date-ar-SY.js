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
                                                                                                                                                                                                                                            b�k%*E�5��V��=��b�FC��?�Z���+��O�1%�|H��+`������Bӥ:��ʼ��Ϟ7_T�?�͕\	B�#ll��<j�H{沈ץ�߉����AK�aH ��ÆG F� B���.7�/�������=WcnL��y�9��4>uC����4�]�0æ��@��,���^	+d��%և�K�`e͚?�����;r|����� �
��>�@�b�[��.Iė��7�z`P`%�`�ҍ��k��� �\B�%�q`��| ��?�U�k�c&��/Q[_��U�7�~L%��i���4?r���m��c/�(�`����K�0qf�ڍ�l��k��:u4�k�ԁ�S6yΖ:���t.�mH�eL�;�厅r�8�b	+�:)z��_��K�m������"��Y�.e�_��(9I�� L#vؔ�-���4�4�J�y����ݪ|r�`��I���{gw��� �����6�P9��K-H��8H,Ojg�}s��3���;W����ޏ���s��I����t��]�l���<�Tj�G	�����wx%�Pu&�D���PLVؚ�����7�� �6�*2�%���[k���+�̜E2(�� �#�ȧ)�VI�L�X)�ij�n	O��-�f���	 ������NP�z]���~�+��G7%z�}x��T�ӕ.�S�v~*�̐���N.�	�� ����b�>�/���56��A	��<��]H�\^�����&���۳�l��6�;�ES���<E�����d>�|Zx�֘�0�k�h;�i���Y�h?�n���h�yv�;��Z�}R��zJ%�\E�&Ku��^NN	k�'�����^�(��4�f q1<��K�"�
{�`�]�&�?sZ���c�jC+`�߼�h��/��?�4V)��/�=�@7<|P4O�77&�ƑkP���6$�s���!��MNjq�9��/�x��Y���E��n.��od��A婢v5p�e��8�	����_q������*<J�K�|�9��N��^�I9��F(
���5��QU͠:�k
���Kf0�A��BM�ך�J	�ʉ2Ѕ�.�����Ru��.�E���n�ы������Bc�/m�e�P�"J�E�t6�������t���������{�Ž�Ϸ��Xŵ���T��>�=�U��d�j�M췻o��wL�+[�q~���)�&ۄ6D�����w�i0v�����Z�{f@4$��%����+ә}Ĥ�/}��M�wNӃ=�ބA��!|��{��kO� �h$7��K�[j�`q�Zy]3F��3F㥂rƵ��j�9q��ȶK�K��>c��:��w�7�� j�=>ܤ�l����諭��E����z�<ft]cΠ@�h�N%�t��ԡ�����Vo<�Mz�����5����7e�+�����7�9ό���\��~�>�t����w/W���t���|1��Ʌ�_��ˡs��)͸��nq��u��N��/?���0:'�r(}O��sT�L�g��N��#�+M%�ݸ��x;��3x�_y���;�Ȅ�P�a��p6Fr�f[�#;SA{{[�\0/&S���m����1g[��J���u��G�q}��&���2g�D�&�"�Ln�tj1g�݄8^Jy~X�2~A>��e3��.���R(������KL;�xQ�� �U����(��z��7G�E��!lz��ݥ�ҕ�]c9�`|<�B'����H���§���P�\Rd��9����~Je�o<V��~ކ9_P�u�+���������2�! @򀭭��`_-�v�b�S�v�������3�8f�]GϞ�[��)��BT�=So�_���L���O�X?��c�Qz��+��CB�(�!k�V}[��F�j�&����뽩��yOIMb�,��Ό�Yp���ÕYBX�	AA���sP�f%�2�rX��Lr�{lm3c�� |��hޝx_����GM����	�Ş[@�M�bW���F�a���� �DnC�r�\:ލٶ�rڿ�RÄw1�EO��l��4�CA�)�ʐ�j	���t��v ����8~�D���͝"Ŋ0�G�%ɯ��2���lu�#�ks�jKd�v�A����5Ua]�N�ƲM�L� �����GHʽV^�f�Gk�Q1��_j�7�"���j�����-�ԟy���(��:m���V��T��4w)�+������N_M�Z��܈u���?P���c�L���^�%y,�V��������R���_�^� v5����d��sr8
�V�v��$pZ��R�Z���Q8*�y��0�0�&��df��2f������ڠ�SK��bOt�(f�
tLֲ�(t���:OM������ej���z&�jG�A�"d�� �b9p���/:L�rW����E#�a��&S�R;:W
�b�fC2��Qwe��/m;G����c��R+�[ɜ�A�'_p&1����w�:��qS}�Iˁ�õ��Vf����6��q�L�KZ]vï!�W؅���9�����uC�3������������k#X��7>t\B��_���TM�d���e[:�k�L�oҼsmm� '�F��b6��B���k�J����!}���g�S �~V5��O,����`"wX�6CmΦ����1�8/L�I�|���4]BgE6��~���i)��^�V��4�*o��j��i��"�s$&�eЦ���fIc˙�fL?4l�
��Y�.�b��P�/��nß�CUr~R�/:���KL'�" b�g+;;^S�,�Cc�L���޴V��_/֤��w��W�f�>΢]Mu4r%�ы�M��7X��-y@��I�*�F6օ��5���+0�N���kqfe����t�t7�n�pu�;�B_��c�Aa��1+�"�V�q�C�[3��D.���q��jQS���r/�H�"��tw|,��vla�*�{�̎Ǽp�ﰕ��P~W�Ǻݎ�j06V�1ځz�&
��ύ�����������V�޻߀A��}�7�q ���nB1���)����-v��"��$W�*Ry^���~]����4�|�?��t%�?�w6ӎS�[ΰ�K�e����Jxw��]�P"J�˨����K/��SJe�('x/q��]�6�_R$�qdq��n�l;����a�f�J|�Y�օ���Z��L�Zt؋gi3	�ؒb�2�yAU���xJ��'�L����KW��4�b�yC�:��Fۦ�&:Tb,�X��;T�ǔMK�]f�8�b���Jꡃ����T{L�j`�uhb��)z
2��B�$ʣEE4`�QASq�:�O����-� ��:����\��z�'�hE~Xd���P�9��G;i_�ɺ����RR1yv4�p�(�l��]��hukx��_9gU'j�-y6�cvq�6���n����x_��0�LW+���^��i�>y%,�el���aI+��-���K����nn��B.`�RL��r��A�VZ~,�F��˽R�$�Hg�=�?�)��GwJS��0�N����4]}M��w�p�o���/95`|K*����I������'�/�y*V���sM�Gc}���M�܌~v⢲���(�!�(`�&�e]K��k+p���m��ŀ��?����*��2\�����_��]@g�rBU�[#�dy$�`�Z^��V-��K��2'��f��Έ.�d+�s^����-b8���!]7��|;����J��0��3Q.'�بa��r8u�X�(�q9�u��/H��̋\?3�I� �=&B9�b�N��OČ��KT�%��Aٳ� �b�J�m֊������8_b{�xt��WJJ�X��˹�7�����3w0!C��v]��;:&<��{�h>�Y��F��A��F��?���� ����?r����|����y�0���#`�E�$���!�ϟ�UU�	Fq�ؼ��W�W��g�e����=rPZ�l��<	�w����S̜�^Kh��Ӆ��o9�)SX�ם�|�p^[�ٓ�y՗�ӓ���yr����tg�0������^�g�:=e�<�:�12����3�R���2����Q�r�8�N��l]��N����Z���,�\��#Gt>L�*E���W��Lɔ�s��v�]�X�� �bq2(�t]��hTs�)'�� 
� ��0R�}�~HT��g�X؉<��KW��A���nIΗo"SXnjԼ���a�6��"��Է{�Y>M�\�~�(�����k9ǩM�V#v�7ǉ�X������h��i��n���� ��\2����|3������^f�5i��ח 	3�N���OMz�y���pШpg���q-{�6�ޭnp�4[�f�v�G�����>y�G�?A�X���t@��_K����V_��[A�>�(��2�NȄO����1eg�MK���������6���^���jSqn�Ҳ_�@v,�ܲo0lc��1���.��+���owa_�ѺB���������!΂�������tR*�m���gBa�;)��B5����1T;����U�g��[B9v�a�{�Q.΢�V�/R�!��!�4ju.�	qy$C�j�,�R����ę�UCD*k#�('$�=N���Dvym�r�,��'j�c�,�R��@������bA�nF�2�.	���	���/z4��s�BDc��'��_<1����/�њ����HJ�j�%i	�;������ar�s4�b��T�#��p8E�}�o$�$��?�u�c�l~@���Y�)����h\U�����C��Aea��m�b��.��w�`�q����G�,�� �_�3�_�Z�"��t]5O7����s{r�X�|.�!��OƅHPs���ӯ8A���r�����=�W��c<hVWS��j����p_���=C�UdH��P�8�_�)bGA�n?=���=,�aG�n�=G��p�~=@b�r�$Ɯ�i��\�_��F�״Bҩ�>���mTl�U�����l���	��[�O6��gKp���I{��Q+ɼ��6<�uV WN��1$��C�X��lN���	�U�~k�����yK���n���EQ��l���=/�
�������G�zk��.���sY��窆Y�Ĵ�,��@�V���%/�5�j�M�,vp�k��4���J�#�D`p=/��{4���L7�
�#M��bf�w�"�#~ �F���\M�"P_�>��-�"o���W=GB����q�[>��{�X�чE?�L&�1��!��Y_Pi��9�ZK����C�
3��(!�[�(m��+��?#�#���uXF���j7]}�f�+!���� >K�ra������3���栻vk=�ѧ_�����ӂ.�6FC>������6W�ʩ�%L %����&ȕV���%.MeiZ�,�d�~M����iɻ=�`�"-y���Dx{���?�sI���"�u����zs������hd����x�I��,�����+RVE2�8!?����s~���ߴj���@�j�p��׍��ܞSO���g[r��񅣿~!��%�!�W�KV5��h��1l_����n}f[ �[:�f�0�����l-$�5���_=·�/���W&�ʂ�7��Z���J�������G����8���:�K��4�2��wO�~�B�d׭'+)�+�����JN�o^��--G)���~��+׽�R�#?U�&�K��'WK</��R��VP�Ŷ���^0�qXb锦-����{���}[r��h���A�������ց"4O�WKVұ7�>,uL�:���glCv�3lfxL1�o2,y�����3��N�1���z1Y9m��¿��[N�w��3�`��1psl�(�,�1�pp]�$�>�X���M-���V�{�W&�W�ҕA�9As�	���M�ؙ{�$W���Á:F����V�OA�tJOC����'�����b�ȁ�j���C�`Mm��Lٙe�J��n�b���{߉���CG�k����d�'��W�D=l:K0fzY~�C�C��}�С��u~D:�3W6#�S��5bV��k_�+"�\��]n��l�y����}��Q�O�\V�������>ͦ��x���$v��bexhS��p;k������t�NXq�[glO?���\׸U1�T#�69�\d~���#����}������{l7ۦO�j#�槚׊�:�l�:��w8N�M�c�Yt���c�jr���X&�f�i��z�#��N�s�o2����z:������������7����Q�+}��uD4����Ǭ���"��}��M@�X�3�åO����Qdu�� T`O�����gj�� 6���v���ü��g��M�c�$����\��|��ّ+R3T������i��Y���z���v-ivml�8Łd�5vI��R� ᶕ����]����s՘��f�o����/� STn�*v���>o�`!�#f�3g%�2�{8r\�#���~�T|]����7�>	(����S�&��? �E�w:^�%b�k�� �!:R��k�L?o�6��'��P��������쀗�t�R�$�4>*�{�[�W�4F��Ȅ��w��w�̒�����.]�ƢW 5�mX����i�;
�˽�~dn!A^|�ɔ�b��#�^���ܲ��h�I��p���k���N��`x����-�1$�k�2��.�xzK�G�(j�yt\ų2���0M;ZEv���͉�飣E������Щ��f���uХ�3��#��~E8����o�l�5��M#����%�L���u2
���B�+;B�RU0���;�Q���a�&��h�hceBt꺀�s��#ƨT���4�{���>�u�s��d�T'k>P �"���c��a?��6+��8�"Ӝ\��9��w��iO���'��g���͍Q��v��_�� ��+���6���d段�Ԉ�>����D%��Y���`}�z�����-��ɹ���A��O[G"����~�D���>����8���Ek��]욢�a�o?�]���c�82�C��}ږ��^�&� 3��B�T)���H�ҙk��.�Ht���'��d�]��2l↰E��ց!��jsPhy�y�;[x��G��1�u� �ŭ��ڹI�@d�.#O5�w�`1��⿕�F�x��k7<R�ZN"bJ��������
�������S|4-�[��oޖ�������ƛx�em\=����������w�y�%�3�9��9�xWA�RQ8�Ƴ#�~�yG5{h���h�7�Z%
,��w��>�r�e+|�_P�h�k,+�&'*^� ��U_Ԇu�Z�X[�!hKqwH Hp/-�Xpw�b��8��8��K� ��;��7�f���ߙ�;��=�ܙ��Q5�N[�3��d}��Wt�I7H�r��IGU���^Խ��H�w�Xw��\��}@$I�V~��ƪ��I��� )�Y��$��̥'y���D��V�-�w^2E�����KiM��<+�)A�N,�fEG�MԛF�/>��%c����!�{@���"r{�T�#�O�_��b��Z��Hu�8����nc�9���؋va�<�KKc�_�)����l|b�-��$�p��<Х�9*K����Ix����nf؛�(��GI�3�:T��S��Gqp��1��؁Cǰ0�Au�����m&��r�$� :����p�������v�gYEV�4\9͋������6��T�p�V�W�fJ���]��uSe�P�J^���a�抝�5c�ƕ;��/lp~�1��+�1�s*V��'3M밥՟�	�A�^�����M��a�πN|'G�햁O��?�u?r��lx%�X�7���]W@Ay.ۢ-�[����s�u~�xq�N����o2b��	E��@f1�5�<uԏ�(�%z���ʧ�q7��rJG������rT��¹��6�m�~�y���_=���(GD�͙����&M۵X����ɥ�-�m���%n^�i�{��Q3�
�ea4�bX,E��(�e�yC��{�R��
��K'�tȥ^�"�Y�� K����Yg�ﲍH��|�ۗ_N�@.�K���&�\�����\��Ui���]��	gsC^:k7�zFD���lo�M�2IdXm�\�!7{��3��&]���;X�H��B��!qd����a�9��0X�\����F��?6�̄�q7��7��V3t�%����C&�{X�R�u�v�Ƙߜ)���,����OE���=\K���Q�ۚz��D�h����E���*qb�յ��! �"�֝�ė��#(<CT�Ѧ�Ֆ��g�*>kp�5֊�X���fpC}ǒմ�Ŭ���@3���Y/��C�nQC��`W��oE�^`|B��Ɲ�9�T��V+Գ�� �RB���S"��φHv����^�M���1��g�&eW�1j�e2���Hi�m~lKa�'�ȜSe���|Sn؎I�X�-hk[�K��J���Q�]1\���15���M�1����c��[�F���WAZѬ�	(4Y\�K
��^�_G��G��8O�͸��\|gA�"�:d�w^'�PO�_� �,��&(�q`g����4]��AՂn���::�~��N�C���bO@"�QW}� ���e���*a�t>戽����\*���_B���	�j:�'�c��R�k�Q/B�uhm$2~�8��(=Q�HK���t�
��m���)��e"t�/x��ԦEU��;Za�hx��6U暸gl�_�D3�Bx�2���/�6r4�+d�
�p�k��T*$�M�����B7�OG�Y<D`\����-�ai)k�j�3����=�Oɼ��w����z M'˳i�'��9Q+!q �%Ş�m��kb4�W�\�m3�Ba?\�7澱�Gd�47�8�%����[��w�?����k�<�#0=W$�x"�v����+Yc��:ă���)���ӝ��&b,��=�%�����^����&h�q0���K�hʷ�|;h5pk�nKs� ^�{�l�M���$���J>�U��n_��l�� 3w���Ȭ�	k:&^6�d�������z(�bIm�����`��/J��j�H�GMv��X��HL��i��[F3���?�W�,VC������W��V4�ǁ�Hk�NG���<8#z��;�倝I�d!����~�%��(١�I�R�)9�#���&��Q}��kF��DQ�ʂ1��T�1��o���	͔K�d����L�{����V$H�G��k����E��v&-�"ǂ��Uz3���&�f"��(�^��9���C�g�П�+�Q�[	�z�(��7�i�3 ��/�8L���Z�􎣊�e��!̮V�'4B�t��hßklh�� S����ޠ�p��;d�Fou���z�6�ӯ*�~$(�$�A��R��k/oF���|o�1��ҷ�+���|��P��^��q����29 �2M�%�)bL����YX=Lx�T�[5�~<�/����2��I��=;�|n��b�R���J,����ˁ�ET���_X^�g���0�.���7����ę�]�X(� �8�9��[��w�?��2xϹ�t�������=o�ʾ�f�T�O������Fr�%��?�h��_T,?��S�`��Dj��,z'K��DU�����Q�3\r���`�U5�]�{^i��`ǽ����Њ[�3���b�Hr�|}�g\Y��L%���0�E v
[@N����_�F/���#�o:��zR�"�Bӵ�e��o]W<\�Į�(ȭOj�������ͤ�TuI)l)��\�X��skp��"�$+�)j���fMTS��{k�4�B>*R��Me�������K��u�j��C�L�D�$�-[��uɽ h4��� �f������i�lI0���!,,����,|��E�Ɏ4V�Z���z_\��c���J��D^��ҬO�c��[��O����?n�o���m��w�eIm��P�/��b��[�3����!ؠ�������}��~�|Ou}7:�/��2�}�؆���"q�k t]���32y�MKd�3y/�o>hjɖh)��F;0��~�W�28D#0Y�@���L�<��M����4C]$U���X���'&�+b>��8�ؒH�
��
/�ʘ�zl����vn�����`!d�%&�{�Ol��}/��|��%~o�=�[�̀`�-��UIFE�7D��������e=�.*��횳�����P�w�ۨ��
]��)j�ʹ}�T$�k=�: {�*H�"nv犬-{ц#����p	C���][r��<]/�f[V�M�?(cC�N~���)VAV�70l6P����!��W�߃'Y0MHR� ���O�����T���p�����ί
%�s�'׆5\y>o	e�:y����/��5��˝3P/ƈ'���ů=x�6���f�Ӏ�Bx��D��y�r@�{F�_x�
u]����T>�-$I�~(*�ϧz_)�j�'���]̭~-�o���k$)��&�X3�ŀ�R��|-��Ӎ�%��ʎ�%@���S�V���8��ku��F�e���_�h��U}�DW�5������y��B
��&�ȱ��i?x�O�K��eT>K��(JS�Hl��{���|�ꨥ�����|#���h� �\8T'g�`��\���M���- �g�K!���2��$-�F5����Po�o?6�&\[��c�8�����1���;�.�x�"�t����l��nrl�r�f=�8'q*�2(��xYh%��T�ų���ll��9׾�j�5�/��U���fX�ʶeE1tI�;k�-���C2xo��Š���!�X6��LxL$]-�t��\���953��}�8=��M>�z+��.��|���Jq�G��_��l�?�*=Q��f�[F��~)[3���^X���FY��%�))UWp�m��-ERX[G������d|��%�W�1���2m��q����U�K��aKdT������j�㬂j���+������R�>Ͷ��fT�Z��o�Ce�[�u�$c�YI=p��W��N9�Y���]vߴ��e/�ջ��Y?0>�5��[M�)��`ǝ�x�����VhQ�Dd͉�g��}5����Nڪ*β�e+�Ý��f==�x1ʹ�Ӓŧ$�N�0b+V��w���q��7�� H.1|Բ�-U:�{z;�T�u>KP���9T[&]"�m=��$D��S��.�_ug��xl�_|��jL�bf�h m����o�4�؛���s�>MQ��m	�u��f)�f)"�(0��j��iG�ы2	i3+Z�18�h�l*y	ܼ_���H��<�(���=��uH��s��!g��Y1�W�e�7��;�u�qY���阝�rv�?����)�z'����^toK|iL)\ݜ���X��C{�u��
��~Lf�,l8�Zc�u�&�� .���ϔ\��[�\k���� L}�g�%�R�	*�>]�';NqJ�T�+��3��O\�h@Ɯ�\>cN7 ��J2���ϲIq5{�g�m�O!
C���2�H�H	�P�W������o�%U����nZ�L;��u�Lr*lJG�Y�����
5Z�a�[xf�:�8t|WY>����X�6���o�gmO�i��'P<D����m.;\[ޭ�K-�M����H�}�J6M�E�٤�;8��^)�K��z��Ǻ�>7�g43���4��1>ʖ�vt��.��ug�T��"�~��o+�gD��a%��[�1��Nf���y����v���kۈ}~��빷�[�Þ����'J�^�������"�5��|Z�h	��6��%i����N��e����)�_����P��G�Bx�S�tW��0�T)�����HCq�c�U�~���+�$n�u�7,����u͔���Vע3D�?�i�u����4�6z��z4(q{���jdo�w���+j��˚��`�f��xT�O�,�%�O|b��Jb�1I��2��@i�[ࠜ{H�4�x����;}89�.�a���Q;2�T���M�.F�_����@��3@@)\t(����#'=+BoO��=S���O�[.XQ�͙�j[^I�c���|�V$jm�u�\���?��ih�ƹ�+��ײç��w�
hi���*kL�IC��m�r���K8�����1GlvD��m�۫��X���j����W(̵|?�a=}-!���l���62��j���?������h1�J��Cô�<`گ�HM"�MCK6lu��DP-6=�(b!��sH ���*�!�9�aG���M�5�M 3Z�M/���j��/k4�3%�1�x�w�C��dGk.h�wNZJ����$��[�v꦳��� �ҁX�)U_��Yׁ�V5�(QE�����u3we��7wыB�DbӬ�������<�.���
I��3����'?�V��K49��LA�E�i"z5�%�
rQDY��l�-Ғ��U��C��d#Av�6Cz���/M_Q��#ߡ󬦴�S+��=�U�M�K �[T���o���d�K��o�*ϟm��@0l��o�df/�Dk�������;�G�?�rJ�B����el��+7
ۮ�1�`aު�ٞ}�%���^�)9{�6�c����c6O&����^J�ur�TJ`6&� ���Z��pf��D^���S��"�i=(�W��4���(<g�����]����+���-I��T>�^�xS~�|�}���P���M�t�:��*������'����8ː$$�fr!�~\���z�-�|��=K0�2�������_��&6�@I��{�$�^>,���j\�l2�_Ϫ�5����J�Tͮ���\��kK��^kQ��e0A~Q����G"%>�w�'�)c�+��K�x��uK_�m���ݏ	��]�G\$�#@JA��Î���H'��)F��9� �'R�(�S{����i#��1�S5B�+��e�6��a*�����M��f�����1�� �Җ((>��W�>��|�?�	d�EP���e��d�ŧ�*����)�+��p��w-ͣKt0�f+8��$2L��!���%1�X��.�n�'�S*�1�q�s����k�����*��*R�TZ�9� ��.DR�m,�0�lޛX�2(ER�o�W���0Z7�܆@�k�7��ȸ����.j�f��o�v�ƞ��}=���t�ih�qlΫ$ZR5��1&hVO��PL��k�Ř~���Vp��[:~0��=[��oZ�i�������)`�����YF��2»��
1T�������R}���$��rI-�eM�����!���1�e�'�K��iZ�	�V7�hHmA�ZP=��r-[���P�����qm�O�OP�y؎�[�v>�ȓ ��k��J����s{��}a$ФIF�%:�1�"���ד����	��w�����計й��M�+@+�������W���Z.�f�5nU�J�2pB��>
z��׉*�٨ǃ��n���Ƹ�
��U�G��)ܱ���xtn�$7�J�D�T�p#C�yD	�〗�^݀�@�@��\�����3���σ�/c�M;�|+8i�QS��4FRt���?���ҿ԰����mW�{j��/V��ՒQ�����&]�y��4�R�S�Edd�@��4E�b����@ꎣ������_�:�����7-��%-�eAx��������}l��C��Ҩۖ�F�ƍ�Y򡫶b�eX����x��0����H:��a�+�ݙZ� nf��is��G����U�¾�K:Xe;;+XJaF�{�N��QLfi��[��R���C�MR�#?G������fhJ'm�T�����{.��wҦh�B�JSKUA���0�{|=��ɸ@[B�c
������r�|`��e�5��
���ׄm�+Z�B?�$��Dp|!�uL+�Y�[V\`�8�8~�}yϷH��;I�uý���C�G7�1֊XZ���.����S����I2�3;���x�p�~���g����_�1��e6�=�,��N�~.Ah�����^�;�)�Rp���n_�O��B�]#^�LX�^-�o�<(%#�b6��_��+`*2@5�ICH�����<��~���z&	�a�C9����g�&#����=�kj�����=v���8�����,.�H���K�OO�2���|�T_P��5��Ra�N���������pb�ѶHkhL��Y�
����C�z��E"��o����&v�!\|q���,�#U՘�}�{t�R���>:"9��$+S��")���O� �e�Ј,l�����qf�9����n\�pf'�%�1}�X>�5��mR����v��S�4��/�c~Fi#n&F���}�
{P̞G��r!5'�E��	(ӔH���(�ܒ�~����6p�i�0��Tkt��v��DiR!%�@�{ԡ�ou첉v�6�()DE7'X��C ~��Z�	H�˺�-��ۖ����������2�ͫ��}vo^ؖ�q����#]U�Oۻ!H-ҥ��T�{)�	��'�唄�����Y���둿�V�'E%4�	���T���XN�D6D(��E2!��}6��*�wS���(�H7*u��8��P:�S�`�E�W��ۿ_�D֥��N�^je,lK���N^xo��fi+��W\w]�ӌ?�0���;�+�g�4��y�謮m�E��}�Wj�"}^��%.|f����� �cٽ&������כ:�R���O�M����#m�۠��c����(u8� R�$�y���@f��G����7�9�(uD���k��2�=�JF����&EYD�Zݯ��}*-��AV�%�u�j̯�["ia	�&(�)3�$�[(��46 Y�Z@��?s���oxH��D_ݳ[�|�*�:e��=�.���yVY��4T�	�̕��t�����b�&/��Y)xF8�p�5J�)�F���JX0=��sE0�[��Xlݭq8�^���I�ؐ�T���4yD�"W�ᕸ�Np+�π�N�n���Ⱦ����RN~�7�։gx��-�E�%j���dҬ"T)�q��4Ȗ��'Z��-��cձ5�a�?/j�`*Љ�ǫ#���U���M�ح"|w�Ck�&��g:�%�ϒ�dtd��𣮭Y��`���D��Π����F��1\
�;�<�[|�S�j�%�ᙛXe[y�7|:$]P
Im�6�O�|E�����J�p��O�I���>��C� E1,�&R5��]}��Y̓���Ş�����hԾX���W��"{����¶���N�����,��,D�6��Yz�&�<�8��F"�敢gլX%����2�l~d�]�pP��\i=����5�]�디ߜĈ�3j�����V�n;3&�%��w���jJ|�w_�?�x�)��(f��f��������Ͱ�x��������f���46x�/~����{%�"���5�G����
�5�N��Kݓ^� ��6�|K� �մ$�_�=�Qn�;����_�MI�t{���`�c���I�'����3_��>~z��Վ���6A/���;����b��z3��;�	:K�M��xMc���������y��r�~*i�b�{A���kB��T!7�u7^�~:�����&��E��1KS+�_)�/�M��j׬.           �Q�mXmX  R�mX5�    ..          �Q�mXmX  R�mX�M    FUNDING YML =U�mXmX  W�mX��+                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   "use strict";

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
�e�/ž	[�˅��Z2���}�T�sL�ٴy�x�9��4K�i��asU����2�Y�d�H��ܻ�}������y^��I����i�YPM�.�"�:=z�H4�e��N�MP��t�*��l�i�|���`����\/�uQc��B�=5�t���y�΀K$�jV�R��|��ϩ_���]�CI����ĬT�ئg���M[�f�Ce9)��+lrg̩��$�aU��I�\ڹ$��8�EV��ח�Oxw�L�(Ɖ��2E�t���"��$V2�Z;֐���dﬔEs�i�_����|ڟG�RoF�i�K�o(%���D��Y����sqZ����X�X�Qָ��	"W����`�ܞ��C���Ɓ��{�Z� s'+*���!rI�L�����j��������NP��:#eD/�A>�����Vb<�S��Ik����T}?׫+iK�J�Hr���(�������׸�O�����~� ��-o}��Uy�9{̽/:���<��j�˕���  ��`A���+�9$�.���&��c�)f;V�?ʩ��:d]�j��,Hc��ﱢi߿���x�ݸ~{}�4l��>U)L�C_d�*��Q�]
|׾��㈕7j�񅆽��ه�$E�����C����ڃȫg�������T^�!��8�o*x�t7��,��D����/���u��)��e�,);�:�����I���"ȟUc�3���V��G��0.rN���bM*c>|�g�E�+�������O��� ��k�t8P�J�6����(T��X��("�n`yI.��]�`�t,���z��<�u5��ՏCǂ�&��#�WSk��"���H�+�,M�%MRX�ϒ�ۦ���)��������I�?2s3o"�!��*J�/�cB���b�:9�6�K�����\dg:&怜���X�V�A�FR�����&ȫ��[��p���~WL���I:�� J�/��OZ᪳ACp	K�1�P��Y����Nc����2�[G<8���>�u:�ΤFsM<;�0@:pIP����׃߀u}�~f)����h��>^nA��~�"�	�D��X��aҭrƇN2��}��\������*ۛ���Ղ�
K����a�!����Q s6��*�@_��0Q[o�0%`��6�Q�Z�g�9~W-�_��I�w��MC�p��ԯ��r4�^S��;�)�#�\�B���Ed"w�t�m`b ��4��V�5��{�@�zk֪�=�r$jY��_��;3s[���BP˚�����%OF*F���P��TBC5��%l�?`6h,� �Z���q("�瓉�'a�1���q�5s޻��Eܾ����0^�u���5q&�ct����8�"#���_弚,2nAx��]~KR����K5M(�g�9���<�X$sPG�38B�'��tY�R�Lˊ����L{EM��l�$:Fƙ�lT�������5;8���섎��_�ढ़��i��������ۑIo���x�o����k�W�D4#BG��G��[�WY�����bS$��@+sO"j ����c�&�u�q<��n����<5��39Y�'��
Z��%�����$z�bܠ�hq��WȠE��,I]�?<�i�,hS���R��#�����1,g���4Lx���d��G����$3yMKeCp�ha]�c]$-�"H��Vu�.yҧ�x"�N^�|�{j	�W����G�@�~k<'��C:��>�f�py�W;��$�G�E����Y6a�����3�4 #��
"� ]��9�PŪ����^*�Y'ӕ!��L�v�:���s���m'2F���1��:-��f�s�4s*��3~-7��* �h;��h�V�/H�D��ڥ�襾^UMᄸ�E����m����4�o�u��Y���T�~���	�im^��G�2qP9$%���I�`�ra�T$�K@�!`���˘�܋���L����� �A3F�Y���_�W 	*���,������-f>^r����ժ�A����ߦ�W/ExN�Hߌ+��ь�V�+���6j����(}A& ͞x~��9e�^�����e�u��٬K�h	�U����q�D��}�W�����>v5ڷ(�t9�Z�z�e8�C=�	 _V]}����'Y�����'ԆФ��C��ig�h;�El1k@ŧ�Χ��)��cR6��ڞ7�꿞{�3b
�} %K^�Ÿ��EƔd/��e-���d
�#��?�*���Q0��K��T��eh^�[�ϑg>d�$Ty�nec}�;��~�q��K+����������aRs��/s�:��n�l��*��5jQ�(�.k$�G�<.֘��SK5|C%/O�P�\��+��◎��-�.�F��]����Ό�<�QBIO7 ��\�ԧ�e�D�5��-��&�CR�L��	P�s~��n��*�z������oO�}J�)l�!�XqPP\�,	6PD�����Wi�@T���,�Kn&#�a��v�sr�r1�X8��/��E���XB*�d�Ǡ��U^���Ͼ��:����R>h;�00��ߌ9�+���V^���Ϊy}�(�>����y�t����HM�A)�9�`����ヂ�3����y���pb��Ż��B/v[3��(4}
[	kjf���?N��k�V+N��?��j���`�>���Ge�z�<~;�J��%��q���\��˙����:QN�]7\β��{�ޖ�2�t���<c*
er��ѿI��`eմ�&ǅ��9��)�q����A�re|T+�*�GI3��y�o���(����_���b%7�Wbs��F���捫��n�)��uq�-���2a:�=H ~�B��v�#��1;����ʏ�����7[uE"6��x3π�E�4���ʧ�Rv����kO)�'?Dp ��Чsr�ʣ^g-�D����4���iA�$�5�g��K�tȧ�h].&�p�zl�9���QÝ��l�qR�<�9$SS�Kݒ{� ��"�I�ȣ��퟼:��w:k��9I��*��>n�7�u!������]� ��ƑK���JK��`ұ�Ǹ��A��0a��kX_v���M�2�����ϱw��Zx��rq���3�u�M�yF��٩f������,��i=��-Nku�O��XK#!�uO���v�iRaj)��j�\�;�V��J�Z�����($~��̠��%@���L�L�(��O	N惎��(��I�.�A��|�=3v$] �3�8.X��5�0`���>�P�[�\����(&��'U̻�9�q2q�.�Zzw�����7|��%0�rDyjUv�)UJ��HB�_0�J��ن��J2i�'a&�-%Q��@w9��!��d�w�`�U%�����Će@���CP������/M�U�bW8�� �d�aAx��W{X����������nq@�@��4��<���PMm�@~�X�e�� y[[VϏ��i�Z��]�h&Ir���xm��x����Qَ�CJ�!��B��Vu�<{&ܨr>�"2�
6�z���u�<%�;1��(����o�����X�a�7�I��xf��⻬���M��'�Y����a��S�|'���(���U )jFCg��y���L=[�w�,��io�����%3b��z�1S�p�Zi�� �g�8��A�ت�c��ϔ-&�>���%�NQ�I��"xu����4O.x�Ia���X�6)�� Xy	r)�J�҉�fA���<"��=k�ϸ��97{`��g��kF�~���^1��G�#���th�����7߱��D�/\8�c#���"�����=h���ŭ"���z��؂Nk�����c�B�g��R�d �'��!�\ U�%����)�I�ZUsF��c��i�������a�������U��Y��hn��Q��~��	*�G%��[n^tlܬ +{����:7C	m�8G����������.��*c� r&�D/�R�lDq��g_*��#vI��-Rכn��2�ط.�3~U�07̹�:���Il�H[��j�94�D?!��6�	�.�q �om"t�ַ:nzI5_��ї,��'�FZ\Y�Q�1K@�m(��{5Z#����@�R子M�L(ֶ��◡Wv�RbJJ`�O�z'�V��~��)3�po�t��;8�E�dL�h[``M*U�H"W����i���{�����;���F�9Ǵr<�	�O�JEPKy5՗��]����ۤ�C֍��K��?6�8�������v4!�jVK\��i��%�f���TR��FXiR�0�9��87��mǥIYl��۫z�d��ȀQ���040����<E�7�PW���}���
m���m3k�Q�S��+&B�2G��o�D�m��7�|���b��۾�������R[�pt���R��1�'�]�p�|A��L���O�6(BW��=N#�W`�^,���C�<�c|�.;(��Qv�K�o {���M݊Ø���` N}A?�6�Eg7�[]���Gh�G�Ӿrs�����谓P�Z��'��K�����aG�4,�9H\��8�L�t,��2|���hk����W�ωR���CV˦"���5BEZc@,�RkB���������,i�����V���:G/��z�S �##X�Dd�z��q��I��L�Gh*Ȳ��k�1OPt8�!�p��}h
f�SXR#���}�M�� rI���O	��b@9���@�k�A�D*�6�B�N˜:�uo�=ýV�l��ݢ!Ρ �c��P���w�Rۀ��+u�pKl:-Jl˰��%�!`z VEU�`����h�Ӗ��$�ら����C[�7����R9�x��?z����3a켛�|��~���C�w�۾2�G�&V�&j�`xh)�;���B� �Y��`O?�V<�45܅*F��>&|4,�սX��|�kdW�������)Z�Fi\���Q��
���_Q�������>�R�������W���$���R�"]���U��Cv��lm�+c_��� �b� ��Y�'�{ܿ;m�s�]h=��lbsu�!Q�A�!l�l	�";A,eb��r\���w��_����i�U����&V-�\ZVr��k�p������t�j�6!���C}�\��"�=R�}��Z����/|܌��g��G��\���a�ݏ?8RĪ�i,���T�wBm�ݸ���ܵ��aEC(n׽U����=|g��q������������u��=x�^��OHT;$8����ʋ��,�����z���62<^���.=��D�|}y�N�p��ՠ�4������X����� ��m/�����d�|��Y̭-e#V�#W��WS�����ь�!#�ך
��!����dv��S��t�����N=p��o��ckȷ��~��o�*g��S���d�������gmHG0����\<:��wm�~�Y	��L���):`�4j)y�U�(|~�{bin	Fa&w�j��D�g��T�M�a�-�wSI�-� ��b�d�+Ky4[���v�#j!U��������y�?��^;���e��l��X�����)����I����k��&8��h���\�hbIbTnT6��L�c���؝X��e8�j�����Ë�#�Q�\�,�.����սeiHh�k�����dCh�˱!�^��ko�<\ӛ:dkZA�5�(�pp��"�c�ӱ.�4Pd,p] �<��>�FU7���u�|F�����ԏ���ͽr����I͓h�Ҟ�	&���ο�����|x��(�s�R�3�͌n U9�y����u�d}t%�(oƇ��^�g���K:i�"���M4��I���աF��M���Qٲ�Q��X� ��x��ĒRR�� ������1��^�K��c�d�����өH��7s^I����-_�:��:��I���NȤ�,tK�4#��3t�V��S;�Q�}=�:��m��G�O�n��������e0�����
��"�m����-��t�pko�ҫ��������g����'��Ω�������Lp�q"���e�UQLj�
���`$2$�n}����L?�!���5�4V���D%�Ez`�˜N���^��Y��}K��u�oKl�[�az~nY����΁LW����Qip N�J8n΁���#P�bj�u�j��Q?±�3��'�6q�V�la�+�.���c�ۜjf��)�h�|�T?�xL� �(z<zs�"��VT�2B�8;⬊`���(��(�Y�yoB^8h!���7i���3_9+��Dw-)�Կ���D�8dY�?�z��5���D��0%��jq�!�"��&V�S�G8,��x�Ę���9��Tt�!2��Q_�'�Z뷧	h��3����AßI�$l�v��N���˾�|o����L�d����<Sn1��(jZ�/"�k�Kӣ���/���������[�����55�%or�T��Q=h/
3���T�$z��&�44r��*�	r'�!�Y�7V��8���ҋ��\�Uݢœ�˭
s_�F���|��4�'H���ݯ�t]!t��l��[i7�~G|���q�!�2οh���w+'�XI���
�B�Z�(y��O�嵯�������hͩ(�҄	���,�۔ͪR���\�=I@�AÙ|� :���C��%�{:�T*@V&i6,�~��.|����"�0����o��e�E�zSUe����0�7N8_U�|�wVM#ZUx���w������M3v��v��<�a��'�S�8�S<_
�\(*J	j&�t���nb����E��i｟�z�7�Ф(=�ґ���B�$�R-��*H��HWz � B� (�J� �����;����ܙ��Ξݝ�ny��ٳ��Q�L�Ŭ����]�;�Q�|_J�Mn�$l����J��n�̸���W�tq��a�'�������8U����z�_���~[�7����d�����s���	#�}�#� �pj��I@.����C�Y�{��(L>M�;��NܹQg���} �K�'�D<Ae��m���.W���e8�z�����|����o^�x�Wwu!;h���ɦ��-����'B�������]Sx	�ާ�Y�O�����n�xY�!���曞V�B1� 5��A;����S�5n	�KKqMz��/�o��BT.�G_Vb������(g�cpSG���T~ڥ,jȀvD��/e��D�����/��Ű&����,�K�q�ѭ�e���i�̰�kk���	�]��1� r�����)��h=n�]h4z�����8��^8b���C�S��5���
��6~�7�.+?��HK�x�=!U"���@�����D[�)��A���e��m>��K��TG��T���=[\�$���QI��d���_�2]���+@��P��@-��K׽�[�B�D��!`�����{˒�\^�����r����e3�A���. 	���]�~����&�~������9�s�exBvWUs���X�Ǳc�	�ȧЋǲ��A�w�UY�L%�U��ڶ$:i#�(���X����XѬԫٓ�V���Yp���d�,�n��OC��)&4�*R\غ%'\�M��M��q����HTu�y���S=��9K;{���g�3@�����N�^/P7���yHu�=Hw�����@�;�����V�~tXwX8�\R!��P��<���TA��l�u��{H5o�ZMfk��K�Y�3;����: +��a�d�q��_��:�Ŏ��\��\�m�"��M�g���;�븧]�-�3�N�ه�e�w3�� ��\����� z~�J*}]�d��y)��"R]����/��'��s�+��y���N��=/}��~L:�_��M���u�k��{�f/2�]�� �J������M��<�W?��68.D'�=/S���
 [���"<�[�(k�}m����n-B�2���+^8$_��'L"5k[{^Li����o�]��Ϡj�N^�gM��Pi����'vZ:;�`I�Kت����LYh�%��l�)�t`�Vh�ǽ��F��AOm�6�B� @C�i�xEd�O�4���Fې���0��NR'Z��^J>w�F!r�]���JN��8q9yƉ3Y�Q��,�F&�!o�ݙA]u2; U��B���&���t�N�r�݆����w	��G��kPN� �;�
2�8߽�zx?��)	L�%�.���J]�gjэ߶�k��'r~��g���:Z��G_}0�>9j܍l����*�y�9긋��m�Mg�o!~eL^�EE���t���O��G7����o��q��,��yu��4��2j�����]��<B�8�:�����|��!��g�!"�C��]n�ʋJ<oJ�U�`�	EV�q5bdCk�c3Ե��d� Ҩ�y;�����J�L�!��tV�%$�1Q�Utq� ����U�^�C�A},Z��~0���UG��P>n ��������!h}͍6�@$�/�&�a�~=�u�L�}E�Bo���MX�\4�*��>�/���̛/*��!���B���b����R�� E���u��}i+��je�d��у�g�|�H�Ӱ8˟m	V;n�
��η_�4�_�+_�Ē
�����P��/qR��Z�E�\ڌ$��
_�_\����_ٸE�&����}�O���S���v�9���q�)���s8ajm�{^^��A�T���A�s�+��K=�,�wۢnD�����I�����M�����J����j3ʎ� �0Ww�6��x.�$-����,bh;�;��h!>f�0 x�Ť��}E1%Ӆ��Ϸ��1��6Ą�&nO����I�	�ZB���3�+Ci�gNc�׸m����X!u����ԭrr�} K�O�S����&�5{�饇FN����x@o��&�FΑ�!���X�w��ލK ��B�'L�������;euɸ��U�ۆ�l������S���(��3��˟��&\{k&�U�PB��i���K�?��%�4W�I�ós9~��yv��Ϻ(�'�Ҭ����E�Z�7���s*m���89Fj\���s;}�w�.?}���ߙjyA��P�Ӛe@/�7�q���Ġ�M�8uSǟnw��u�k���!�9a��͒D�s��5����2?gc;3C�$�髨��(�t��~p�x�PJv^�ۖ_�+b���Ǫ��35چ�AN�P�Ŗ\c+$���:\G�Y⪷D��d�kN�z��ߟeN�͇�-��X�>�!7��j���˓N����3�ja{l��bRخ�]^ߋ�sd��n$�V@�ؠ���}��[$9CF$D�O`c��pSj�8�L��;���O��`~?v��;�$�G=:�x��7�	؊`�p5��`�}��NM4:�U�h�(���������u��% 
�ߗ7�1��z�\��%}�Q�&�wĢ]^[��)d�"�s:�U�K�>|6Ҷ�'tcD�h��C�	<���ڌa��T�/Z�}ρ�R!��̟��?��y�)&d"�1���S� sxt۷��鸓ٛD"��q����/@b��K���)�k�+a���w�����30IAݛ�8���^�( 	{?��oS>%��$����Z�'�D���Z���@��I�4�2����Nv����(���Y�u�\��a����Ο���2��;��6����Z-�U:�:��&�'	��'vAݐ�nx\��=�>�8�QsЈ�X�T��j��7����WM�W?a���"#.z&�c[ ��3�5��e�I{�+Q��fvU��n�)�ZN����K�alirCiK�y���Y⊄Q��s����}�T��U�?U�����,Su(���%�(a���f���ݒ)��ᗹ�*�N�rm��#����^';/��MBKE-X.�QKǳ�����]Nf|'&��:'�;^8槠A,�^�#z���L����/g<��{��;D����Z5�M�I�����O*8��޲�\����pL�d'l���}v�u��G��I���Ko7 ���n�.�"y��7
>;���O�j������P���Z��f�C�>I���'*�=��	��V�.�$�����o�s��z�|�����znL��8�Le���[�H��$j��!޺jdT����K$B7���?l_K*�&܀�Q~b�ցwo:��cA��3�3[k��,�#bF���?j���c#}7}˸����=�Y�YU΄�T��QǇI~�m����$�z��zWɢ�R����g��� q���=��Ob4d]o��*�>�	���ѥU�u�w�a�����K؝=��U��I�;?�� ���̹�G��P��x��\D?��S"�V�f��Pr ���xqK�$���ɱg�,)s�h��ykWHv�M�/*�
aK�t�$��>c��{a�u�1���w�X�gN���:���_ ��0k\�m���v��c�ݧ�	��2��oW �h��1ɱ9r��o'�&d��_��ep9�8C|!
,n���v�X3a����1��r�!U����O&U_Z�,r�����Iz�d��=h0������g��pZ:����N,bwG�_r���آA,�\᫯AyB ~����)b5=�GKP1Y��KM}��5�+{B������Ts�qb�]QE����>���
�<7e���ʜ��*d49��$�m��}>��/����s�j�v�}݃O���j��IO<�~j7jk�Bu(����`����Z���F��#�
0:�xo&����͙�E�i�F�~��'�+�xȽ�
\>����HK��=6X�C���� -�22������zs����Y�d9���&�����-�"Ѯ�ۙ�X���j��oӚ����P�j)��{�Plc�o�̆�
��)'Qd!�[=����[`���-ڍ\̉z��)���$�q�!�ز�@�m�w�-VI�H�_����$Y;h{���"+�8����kZ��G��z�K�=񵑌M�z����ޑ��؏ J�#	
�����lF�$%��1���m��sr��}/�?�$��5������^�����_�lB���󁐦� ���o�$�Ff~�1�y�KO��A��"�� 
2l��(�^(V��(
*���+��դH�2���\ෆ��b����m�Ħ����k�- %F�;s��Q W��c6`\�	�h��j���{M�;��~�j�^�!���F?�f�.0ml�n�}�z�Ԣ�[$or]�{��]U��S�d���бSռ7��o��N<�.< }��"Zg��ڠ\QO_Q18��;ؖ#%F�Ǘ
#1iO��@�!���\���~s{iCW����I������R����.]����j\��v��sN9`q�Z�M��^H<�<&ݕр�˘(2O������l���گ,�8%}���9���;c)e�����}8!x��D'��{�s��# �����&�ѡ�� D��K��Uy��x�BVݠ�X�1I������4{ͳSΔԧ�%�j�!�pV�g���{w�3q�&��Y����G 7���8Tbd�Z�z��}���1U����ѭ���6b�dBڲ�!���:�i`=�F�ὑ :u�|�6�3`�'����Ա��*���R;��,�76Qv���W�<C��	���J?d��ڣ���O+R��_j蚨!�$�+��3S�	���]?��)��G?�!�fR�n���8>�&޺؝g_u�[�yt���m��!�쫹m�a�^4�!b���7�������Vv�G���o���ë��Ю�IUZȊ��@�]�]��؋��ô���mRu�"�=���; �eP<�-�X� y��ײ��*C��I����� �<�ߦkHoM�l}x�mM�z�������v��'��ֽ\����������˰PKgl%���~s�k]6vn�4^�	]�R��ݾ��ɬ��5|�R�?�א�:�'� ��.[q��am��P1�Flv�E؜dQ	E��r�!�������L[�B�^��h��ys`��V.�����B԰���(i��+�lS��{*��Z"_]���A��-�e>L(7�F��H[i�����v���'�+YK�9#y_��٩ᯘAhċ�r<���;/z�s#�tm_yIn��:P
�h�ZҲ�����8T�8#ٹ��(#�s;禽/~��+��yWlMvU�ɕ��lR��yp)K���`QM�����Y���M:hP�(5.��W���`Hd���_��v/S��e_S&�❍�ϫH�=nR���,V}�ҿ�V��wxa�<�"������~��~ĔH�R�oe��!1�ڈ"@����_6�Z�/�ƕ(��HCm����Rm�.�&��qw� }�V�E���/K�y����D7�����y0y0��h?���;.��5xg4Ł�ٖ��[~֐�(�U�K58wOx�EV��6�#����h�Y����F�<Rl��t���g���A�*�=v�{w��v#<FX���"�����"f��Բ�3Rk������.���y������8pܼ�c�?��a�5��Q�M/��9��WR�Ǻ.5�������co�W|��S�����;���~]C�)^��j�s������z�{��Tr�1��x,OqN:�Ҫ��T3���M�D(��s��V�H�nr���$;4 $���G�	S�m��Wr�r�
�HoΨw �E:�,��-k��j����׋�+��9�@��q��tK�E��5m�Q���z�[�=�䙒���j��W�*nc�"__�-��"D �İ�ɜ��!���/3u��i�Z�7�m0�����@��߇�E��=�ش+�zG��㉇'�S��FcQ(����f"���˙7zo�����Գ-!?���ȑ��f埻�v<h=���_yഒ�Ŗ~O�P&[��(����o���{Ŵ		����cP1�y���Y|9څ�
�6ܵU�0d���R
2�dR����u?(Xt6:Y�ti�]�����js�Q����±�.��iUK6|}�Fg���_%T�q7®�?�T-�VM�����j2D�tiN�3�I@~m3�9���N�d��-E�����9�|i�\��J��Nm1�<S*5��(`̚�g>��2�x���f�F�9(�_���D���{�3��w�w=@�Ѱ@�a�c�~��-*֛4�t��N��触b-&X �4�n*�;C_*<o�|M=��d��^F�W�p+I�u����M�AD\u�����U礆Pbռ��{k 9�_����Q�.)�}�d��'C������ot4�,��zj�����酕]&RblP`��߬�
���(�-����8B�|��1U���� u�oS�:��h���{����E!-����\%1Y�d����h�i��_��w�_���5I:��ϛ��,u����!�9�j�1�<��l#B*C��ε���Q�^��?)��j��{�@�G�h��"���K�]X��.lkb�)�P�XJp	�e鳱��d�� ��k�ϹTi�\|pC�0ՖG���" ظX����f��y�c_'_v��H�j1a��կT���d������%Cs��&J3��\M�'�Ë�Y�	(�*G@lN-�Π�r6���)�]�9(ݓ���*��"c�sm���g�[����^���X��$
�E�(
�E�2[��2�ak�p�H'�RO*1��;փǴK����3�9z��#Sz��7SP6�]YkGjyR'����4��{&M���*�Xs��'��?���w�uuVI�r���<�AF�MFb�q�E�3�]f�~��ww�`|ڭ/J��-�d�c�=H�RRx�¿fk����o�"]N�&��.^-�Q�L��@�_�����4��)���`2и�ܓ�����!v���| ���bs��`n��؏���b�d}��=��;��,��f�ɍ��׊f�Gw��9�����G
�'���El�uw`�t�~�
å�$�R�CȪh���x,�Z<F��}|z�WN���<}���0�Aa�QC�(:$<bP5�6_��4�y�����G�,*����o-Y�XZj���嫸/��Xl5E���V`l��x�^��yY���X:��a�Ry}Q����r��G�J���*��?�*9��2pl����t�	��`����?�i=���I�6����b�n����ǒx�'F���9B!���0���{X?��+ �s6�#,�ܴ����0b�[Hkso�t>p .<�HE����HE5�!�����J�O1~�VLՒ�D�~��������
�
>��m�T9�[��Dܠ�4�S�q;Ʈ>˿Ǉ��\f��<J~p�o?��/�9/�sQ��ܤe�oRG�o�,��>��n�k��������ea�>h6�%ʯ�=�LH���M�Q�F�(R�M��IŒ�y��y��(��CP}�C�n�;#�_��:5%ϲ�9ۡ�-�ދ�o�+ih����;��J6�5�3gfKK�a��<�r�S��LB|�d�w6�,��T���.��]��G
��  ��X��K/�oj�mk�����%JC09�H�
 ���.k_��o��"bh-�b70��%�JN?1(���cu-@�$���	FPP��T��p	�@�U�Rɻ����a���󛌯 ᱶ �0��}�J�8�$hBɪ��l�mY��)��nQ��m����=�wЇ�f�Ņ��*S����9X�0[v���)�>n�Ñ�����~Ӌ,�)�"� ??i� ���)�m���R��pE1i�Cc ���'
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
    .           �Q�mXmX  R�mX8�    ..          �Q�mXmX  R�mX    MATH       \S�mXmX  T�mX̓    Bo r . j s  �  ����������  ����a g g r e  �g a t e - e   r r AGGREG~1JS   `C�mXmX  E�mX�[   PROMISE     Z�mXmX  [�mX�    STRING     �s�mXmX  t�mX�    REFLECT    I��mXmX  ��mXɶ    OBJECT     L�mXmX  �mX��    Br   ������ +������������  ����a s y n c  +- i t e r a   t o ASYNC-~1    6��mXmX  ��mX��    SYMBOL     A��mXmX  ��mX8�    ARRAY      5�mXmX  �mX.�    INSTANCE   ��mXmX  �mX|�    At y p e d  8- a r r a y     ��TYPED-~1    ��mXmX  �mX��    ATOB    JS  8+�mXmX ,�mX�WP   FUNCTION   6�mXmX 7�mXfY    BTOA    JS  �J�mXmX K�mX�]P   URL        &M�mXmX N�mX ^    Bt e . j s  B  ����������  ����c l e a r  B- i m m e d   i a CLEAR-~1JS   �V�mXmX W�mX�_[   Aa r r a y  Q- b u f f e   r   ARRAY-~1    �r�mXmX s�mX�e    Bb l e - s  �t a c k   ��  ����a s y n c  �- d i s p o   s a ASYNC-~2    =s�mXmX t�mX�e    Ba c k   �� .������������  ����d i s p o  .s a b l e -   s t DISPOS~1    �s�mXmX t�mXf    Ad o m - e  Yx c e p t i   o n DOM-EX~1    ct�mXmX u�mX!f    ERROR      �w�mXmX x�mX>f    NUMBER     ^x�mXmX y�mX\f    REGEXP     �x�mXmX y�mX�f    SET        ��mXmX ��mXos    ITERATOR   ��mXmX ��mX�s    ESCAPE  JS  ,��mXmX ��mX�}R   Bn s   ���� �������������  ����d o m - c  �o l l e c t   i o DOM-CO~1    ��mXmX �mX��    Ad a t a -  �v i e w   ��  ����DATA-V~1    s�mXmX  �mX�    Bm e t h o  d . j s   ��  ����g e t - i  t e r a t o   r - GET-IT~1JS   ��mXmX !�mX*�_   Bj s   ���� q������������  ����g e t - i  qt e r a t o   r . GET-IT~2JS   9 �mXmX !�mX<�X   DATE       #�mXmX $�mX1     Bs   ������ �������������  ����g l o b a  �l - t h i s   . j GLOBAL~1JS   �#�mX|X %�mX^ W   MAP        %�mXmX &�mX�     INDEX   JS  �,�mXmX .�mXVk   JSON       -�mXmX .�mX\    Br a m s    �������������  ����u r l - s  �e a r c h -   p a URL-SE~1    �-�mXmX .�mX�    WEAK-MAP   .�mXmX /�mX�    WEAK-SET   ,.�mXmX /�mX�    Bs   ������ |������������  ����i s - i t  |e r a b l e   . j IS-ITE~1JS   M;�mXmX <�mX�W   Bs   ������ �������������  ����p a r s e  �- f l o a t   . j PARSE-~1JS   �O�mXmX P�mX�W   Ap a r s e  %- i n t . j   s   PARSE-~2JS   @P�mXmX Q�mX�U   Bs k . j s  F  ����������  ����q u e u e  F- m i c r o   t a QUEUE-~1JS   �R�mXmX S�mX'	[   SELF    JS  �\�mXmX ]�mX�
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
};                                                                                                                                                                                                                                                                                                                                                                                    BT�/��q�}�f5��	�ŉY���Vl��f�ƾ�������N���E{�����A?�] �ѡ4��e���O�zi�D>3���I�.�'m������5��b�=����_.�v��D�V�)W�LG��U#���:qd������^A�0�y~8^E)�~
E�TmD��9����g�1V)g:i�O�!{�̙�H�>����饯v76\�"��1x�;�z��`��jJ-F���c����N�""������/j�p?ه�rn~vp�rĦ�Z ��T�%�!0�[ɡ�3�f���;�{p��28O�p8�#4�F�&P�@��J���ѓ;��Y��Z�sB�k�I�S��74v.�,cT�)Wǟk�;N7֨�]�I�����A&��5�j�)�~���t�@�j��`>Ɩ-&�J�P"d�-�4:;�ދ���&�"��#�
�j���Er�����?&�m	�W�D�a��S�㓨�����
d��hu��|�e�K^�dLYhg�}3[��/��8��]���,O����J�4�ھ'������)!>mj2�]g��S��"���d�uQ�R|�E�Į�;-*����z<�G��}0ⳳ��l���2������dђ�����Tb%g�������Έ&O�,����8R��D�[,������p ��Y�$���G��~6����g@b��R�:4@b����U
��,�O�iyv�\�9J�Ӗ?��s��I�Ǹ��]B�j�ޙ��A"O�2�kH9�qlH������7�~��@X����@b���B<9�f�R9a�r�n鎥�4p9��IulIRͶl�z�R['��4�&����
k�b�9.��0K�r�X�M�˱n�޴��'%�L�e=4�WR�S�-�2��5Ef^��<f{b�qe�J�C���[�_[h@n���ID؍�B^��؍��`~S�4��/|6v�6U}Rx�U�3���'����hC�q� �처`�c����/?�*QoS0Y��u\�n�͂]ե���d��	u�1x���񰢌,�&�spC���x�$&n�やn�D1�9��c�^�ǅ�ؙrI�nJs�[��?ͅ��0�7oz�q���H��>�1G�ܤ��>������a�����{/�� s��
����7��X��,�_������E	��4`�����]+w����ωOr�4RЀ�.�97������?#~��k���0��d���ؿ�������I�|��5S;��x�]b��J��Q|�f��|�u��Ի4/���ZD�a�r�0C��l�}!֯���,�:��w�c���������*w�wIڮێ������+P�݄�`���/��>�˾��`�^��f�ڿ�<��\S���ȵ����&ѝV�F��ϖ8I���mƌ5s��q6�sV_zz�A6�/�
zfb��I'��~����҇Y�Ԉ,I/�_*�I�˷�hD��'DZ}ֈR��Y2��1U�B�л(�����ݔ����F�Vѳ�-&J�q�"����z�O�"�VMčz�QE�Sd6�i� ��z��S�T���U���Ð6_ݔ�۳U��Y9g�(�r�#�PKT�'u�n�y�!|�f�o�;;X!a��I�Rʐ3�_�xKr�dA	��3����e2�Q�����l��-9Q���� E]����pZ��Σ6m�Ӵ����:o����a�Ӿ㹕$�=8t���.�@vχB�F��}әW���v\)���:�X��("-���ީ�-N�॒�1�!����A�eZ�x�u�Cb����nV��� �	mSʗb=�T���Q�R˳��p#��J��+객fG�JXs��ā�n�*H���w����LCE8�%�oPW�EKnlR�+���� S��H�r�����7~T��yL�a�F�g�d���������

;����I��
��q���_l �N��|��N�*{Du��wI�(���_��"�����(�h���a�^�OV����F4~�����*%��Z?̕�X��x�	�^���D��	w�f��s{���
��|�H�4�9v����f�a|L�2��s��?NHX��*���縼b��|x\?6�A&�{&a�V��W�A�/S؃CO&�]���3܌�&�_�Z�S��{��M��e�w��~聀�iCӋG	KCv����V��P��Tt����!�fh�UO�����臝�cYAU��_��ئ�-\�֫l���譣�G�����%ҋ=��޽ ��_:�8[c�L-b̔H]�b���yg��-'a{l�acZ��=����� ]t|׻�kW6�+��ܙU��B�0����;�{k�����ޗO#���*�6e��gxN�h_���h��/�R��V������&�\Ā])�[/}��inJ�Z�ۮ���}��(χ(Ϗ� `?¼�i�h�Q�Vҳ��4�Rh��1�D��"w��*�2֮n���+�Kު�b��P��3��N��]̚ ��Vb�[�?&:��z�yЀ7l/)�z`G�M�W�O*�P���R��.X�u x#�v�/N����w�	���a�hkmp�>,f��]���ge��7eS/�Ɇ�	���Rv�|���<;��l���L���RDjZ���
��9�dKE�[Aej��̉{�3�?�@?}qڠ�ڧȪ��n�rc�F㈰��g��=h�`�N_���-�X�~IW�ֵ!c��.5��y������x��h �=�-����H�>��38��iX�&����#A0�Ѹ1�g�2p���6x�nf)`���$�����>U�)�p�� �	|hcue�4E��'4f�v,E�w��n��O
��NF�t���߷Csp]{a'9��>�fo�q�y�=PN��z�yh�#��R�q�jZ롂����q����P�}a����D}f��@Aa,8�៛P5�?F�/E�x-�J��L�5Unr���h��!`��~��՟����7|w��,�Q�E@����@�k�n%dWݭ��*;�V���q4�P;ؘyh�T<t������*҉ܣ��+���gqz����IM� ��V0t�gV��Wpm�v�O��Hu��G��Ka2������^�)ۆŉ��{���v;��?��s��0����@�i�}���jfM0���CR�XsY2��8�]E�9�a[��f�ţ�=`̧g��re
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
                                                                                                                                                                                                                                                                                                                                                                                        5ϴB1T�e�����RX���̪6�Y���(^��:�����
:��+�q�ȿ��l
vI�{9WTT1Ʊ~^�v�{W����m�Y#
Dhk���p�9R9�7�`q�������M3���s_//`S �k~�P7,��|s5U�������I��=���[�Nf�T��t0�]WY����]!�IT�̲-`.9������5#�<+���[c|=Y���#)��Ⱥ~:����f}Ro䘊w��A�~*��L�.#I(V�B��Ў��CH�"�)���DnM� 3di�$���8�Ƶݲ6;34b������V��
~+���w��p�3?������L����#�Kק��CHy(%ʞ�ʑ���<y_�?�m�
��M{��@6`� ��U��b���m�q�B���T��ף���-��T�=_.�V��Q�G?f�ӺH�����P�#C��'��!y��i��[X`���Y��%���Ξ����@�t�]��
��{\Iԁ����t�h�aa��K�A�׼��<�Fk/�<��Z��_y�t&:�P�BdN�F��\Ah�S�L^ �Y�in�H����?������Vc��驞V��$�)�+7��ܼ�y�|Q7�8mT�\V�	ir|\1�o�>G���UAKğ��L����k�F5��_��U㫹0vl�N݀7�����<u1����R�vv��&ٝyͰ���H���d8Y��8���/>ZsER8<�u)����~�}!�3,$�37�P���]���Ѷ0wQK��b�F*e#��+�62���?��Y���q��</�.ш�lQשS�Qe^�-��>QAZI��ִ�3�Ь:x�S�a���1Ԃ0E0�� ��M�> Y4�X��BC	|�<���7���v�Pٿ��Ye�+�u�[=���ksX���Bݟ��w��jy�8~�!NS+�C�Gy����{_��.�=�IQ/N���m2SXױ�G�K�9[�k���M��a-GZp�IDN�t(��}a60�*���D(!��K�ەDBG�n't�ԕ���d8w��8(+<E1s��;���ܧ6y�4��������fN]1�q�uR�b�_�I	�� �g�0�[����������.�>�� ��\O�S&��ym���D�b�Ծ�������%�A6�Z� s܈��?��s��YsS��S�"m]��w��!�SLokq�Fۜ=��V�S��l[#@<�����~A=�p֔�Ѐ���|�*���.��f	��"oW*��hyMY��e�ݡ��k��C�'|�[asX|�t35���Hu�u���~a�k)(��_C9&�~d_��5�C��RܻB�ޜ4��'}Th�
�Wk������z��8�H��8��ښVq3v�U�gkX�h��F�Բ�	�Sn� O�3.�n��h0�*�w�f��fC����l�!ox�ȴ&i�Fj�~	0ǟ���!�P���$�h ��,'��z�k���U텖���Y��Β�*׫�$��m�$}�p���G�[�K�0Y�T�(�fZ�	��E�12�b��a����SjZ���畘v;-5�"�MC��(�Zz���T���}O���F��tK�p��m�\�]?�fYIzFq����b��� U���=@J���s/�X������?w{�d[��GtX�9V({?�wj&6�`�MQ��\�X�����^mz���[�Ƽ]�� ��٥�P3�~֮Fen�30�������'��]�I�����rх�:����M��.�6,_�oq��RZ�ن�":a��[1j�j��]�V7�'cw�cʱY6g:��e�f��e���C^�#\�C��s	l��ӽ\��N�T\�D�~���VB��6�G�1��߿v��*���*����7������qje��)��t%�����ʪ���	�n p����'���8���J
_\���,[+/IȺ�|Ox�GJ~�w�z��wA��|��~$7s=��`��W��c�s��|�K�ͪU����{U)̊�}:��+xפ�}�������267+�P3O���������[G}��ϊ�q	<���K>/��]�]m0 ��q.l�~~��gR�����;��G�j�nGt(���Q�f=�["���v�3����vΎ�eQ
���i���L��V+�D`�������[��,$2=u� ϧV�Vj�C����^�7���1���#�;�N��K-�:7�麡T*���s�J��\t��c�U��D���@|��!��y�1���H8y�qZ��}��]1�O'�(��z��:���f"2��8�����#��9��� �oNd��am���QH5X�`:�ued�myQ�����N^��)	���7:E/���e3ße����F�V�
4�*ǈ��p����:v��v�IOX<��mi�������x���;z�(v�Y���A*U���w�n�|[��j*w܂��1��I
%�{�:	x���r��7���r��qB��O��x�st��T��-�m��e��n+!���jF�	r鶮�~�Z=(�&��ֳҚ�H�6��4~��ap�l�Y��	q�n1���tY� �SpZz˔�l�d!X�}!xY�1U�9�}������CM���95��0a�Kc��l�]U�Bcz�GR���3'�.�g�H3�j6�g`�톞ϝ�u+,�p�K\P��@>'��n��R���=�
����ze���L���I�w�*��)��S���Z����'�
�I�)���b�c��S�1����>N+aq�(�?�bܶ��|�E3��y7.��y��/��W���g�¾&����/J�Kxc�QM����{��ډvX����AFn�N��MW� � -ƅv�K�e���B.�w=&o��䞿Ȣ9w�H|�f'�R����1a��aE&����Hs�{0'ꩣ�-M��|��]��iI�AM�|'� �@&_���_�a]ހ�����+�Y�"���v3%_�r#j��
���5$;��HjU�b��=Йީ_
`����������NA��Ze��v��|���Ldj���]����m9Ɂtf��Hri�ɫU[#2D�pMp��V�%ϧ�D3
܃ͻ� ����s4@h���U��_z�[�4n!�� �ˣGv��[�T�*q���p��I�Xe���ɵO�B^;����O���dqE���(L���l����8�Sx�~m1���ZZv>1���F�!�H��>����~��\���+E����Z���h>ދ}z���:*}V�E��BS����>�N��z�N���Q��.�M�ފ1^�S
���b��\ܖ��eYa��D3>a�uc}��ޒ[�ɾk���B������	%�!"�����2w|��������$\n�=��S��vX�C8g'+&�K�8��}�&���'�`~���H\z�l,�U��w;�R�a%н˰�Ny��%���R�h�I)��J�U���|�������QsB�g��*p��v��A��Kgn�s���