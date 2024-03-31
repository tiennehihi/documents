"use strict";
/* eslint-env browser, es6, node */

import {
    defaults,
    map_from_object,
    map_to_object,
    HOP,
} from "./utils/index.js";
import { AST_Toplevel, AST_Node, walk, AST_Scope } from "./ast.js";
import { parse } from "./parse.js";
import { OutputStream } from "./output.js";
import { Compressor } from "./compress/index.js";
import { base54 } from "./scope.js";
import { SourceMap } from "./sourcemap.js";
import {
    mangle_properties,
    mangle_private_properties,
    reserve_quoted_keys,
    find_annotated_props,
} from "./propmangle.js";

// to/from base64 functions
// Prefer built-in Buffer, if available, then use hack
// https://developer.mozilla.org/en-US/docs/Glossary/Base64#The_Unicode_Problem
var to_ascii = typeof Buffer !== "undefined"
    ? (b64) => Buffer.from(b64, "base64").toString()
    : (b64) => decodeURIComponent(escape(atob(b64)));
var to_base64 = typeof Buffer !== "undefined"
    ? (str) => Buffer.from(str).toString("base64")
    : (str) => btoa(unescape(encodeURIComponent(str)));

function read_source_map(code) {
    var match = /(?:^|[^.])\/\/# sourceMappingURL=data:application\/json(;[\w=-]*)?;base64,([+/0-9A-Za-z]*=*)\s*$/.exec(code);
    if (!match) {
        console.warn("inline source map not found");
        return null;
    }
    return to_ascii(match[2]);
}

function set_shorthand(name, options, keys) {
    if (options[name]) {
        keys.forEach(function(key