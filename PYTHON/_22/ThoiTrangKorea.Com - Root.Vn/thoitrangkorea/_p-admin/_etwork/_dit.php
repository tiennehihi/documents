"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
const core_1 = require("./core");
const jtd_1 = require("./vocabularies/jtd");
const jtd_schema_1 = require("./refs/jtd-schema");
const serialize_1 = require("./compile/jtd/serialize");
const parse_1 = require("./compile/jtd/parse");
const META_SCHEMA_ID = "JTD-meta-schema";
class Ajv extends core_1.defau