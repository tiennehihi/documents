/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";
/* global global, self */

import {
    defaults,
    push_uniq,
    has_annotation,
    clear_annotation,
} from "./utils/index.js";
import { base54 } from "./scope.js";
import {
    AST_Binary,
    AST_Call,
    AST_ClassPrivateProperty,
    AST_Conditional,
    AST_Dot,
    AST_DotHash,
    AST_ObjectKeyVal,
    AST_ObjectProperty,
    AST_PrivateMethod,
    AST_PrivateGetter,
    AST_PrivateSetter,
    AST_PrivateIn,
    AST_Sequence,
    AST_String,
    AST_Sub,
    TreeTransformer,
    TreeWalker,
    _KEY,
    _MANGLEPROP,

    walk,
} from "./ast.js";
import { domprops } from "../tools/domprops.js";

function find_builtins(reserved) {
    domprops.forEach(add);

    // Compatibility fix for some standard defined globals not defined on every js environment
    var new_globals = ["Symbol", "Map", "Promise", "Proxy", "Reflect", "Set", "WeakMap", "WeakSet"];
    var objects = {};
    var global_ref = typeof global === "object" ? global : self;

    new_globals.forEach(function (new_global) {
        objects[new_global] = global_ref[new_global] || function() {};
    });

    [
        "null",
        "true",
        "false",
        "NaN",
        "Infinity",
        "-Infinity",
        "undefined",
    ].forEach(add);
    [ Object, Array, Function, Number,
      String, Boolean, Error, Math,
      Date, RegExp, objec