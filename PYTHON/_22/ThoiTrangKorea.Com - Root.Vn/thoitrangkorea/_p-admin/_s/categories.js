"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const limitNumber_1 = require("./limitNumber");
const multipleOf_1 = require("./multipleOf");
const limitLength_1 = require("./limitLength");
const pattern_1 = require("./pattern");
const limitProperties_1 = require("./limitProperties");
const required_1 = require("./required");
const limitItems_1 = require("./limitItems");
const uniqueItems_1 = require("./uniqueItems");
const const_1 = require("./const");
const enum_1 = require("./enum");
const validation = [
    // number
    limitNumber_1.default,
    multipleOf_1.default,
    // string
    limitLeng