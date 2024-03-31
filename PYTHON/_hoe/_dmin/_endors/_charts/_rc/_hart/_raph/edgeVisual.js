"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var _keywords = require('../parser/tokenizer/keywords');
var _types = require('../parser/tokenizer/types');

var _elideImportEquals = require('../util/elideImportEquals'); var _elideImportEquals2 = _interopRequireDefault(_elideImportEquals);



var _getDeclarationInfo = require('../util/getDeclarationInfo'); var _getDeclarationInfo2 = _interopRequireDefault(_getDeclarationInfo);
var _getImportExportSpecifierInfo = require('../util/getImportExportSpecifierInfo'); var _getImportExportSpecifierInfo2 = _interopRequireDefault(_getImportExportSpecifierInfo);
var _getNonTypeIdentifiers = require('../util/getNonTypeIdentifiers');
var _isExportFrom = require('../util/isExportFrom'); var _isExportFrom2 = _interopRequireDefault(_isExportFrom);
var _removeMaybeImportAttributes = require('../util/removeMaybeImportAttributes');
var _shouldElideDefaultExport = require('../util/shouldElideDefaultExport'); var _shouldElideDefaultExport2 = _interopRequireDefault(_shouldElideDefaultExport);

var _Transformer = require('./Transformer'); var _Transformer2 = _interopRequireDefault(_Transformer);

/**
 * Class for editing import statements when we are keeping the code as ESM. We still need to remove
 * type-only imports in TypeScript and Flow.
 */
 class ESMImportTransformer extends _Transformer2.default {
  
  
  

  constructor(
     tokens,
    