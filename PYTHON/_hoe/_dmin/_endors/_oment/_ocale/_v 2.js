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

import {
    AST_Accessor,
    AST_Array,
    AST_Arrow,
    AST_Assign,
    AST_BigInt,
    AST_Binary,
    AST_Block,
    AST_BlockStatement,
    AST_Boolean,
    AST_Break,
    AST_Call,
    AST_Catch,
    AST_Chain,
    AST_Class,
    AST_ClassProperty,
    AST_ClassStaticBlock,
    AST_ConciseMethod,
    AST_Conditional,
    AST_Const,
    AST_Constant,
    AST_Debugger,
    AST_Default,
    AST_DefaultAssign,
    AST_Definitions,
    AST_Defun,
    AST_Destructuring,
    AST_Directive,
    AST_Do,
    AST_Dot,
    AST_DWLoop,
    AST_EmptyStatement,
    AST_Exit,
    AST_Expansion,
    AST_Export,
    AST_False,
    AST_For,
    AST_ForIn,
    AST_Function,
    AST_Hole,
    AST_If,
    AST_Import,
    AST_Infinity,
    AST_LabeledStatement,
    AST_Lambda,
    AST_Let,
    AST_NaN,
    AST_New,
    AST_Node,
    AST_Null,
    AST_Number,
    AST_Object,
    AST_ObjectKeyVal,
    AST_ObjectProperty,
    AST_PrefixedTemplateString,
    AST_PropAccess,
    AST_RegExp,
    AST_Return,
    AST_Scope,
    AST_Sequence,
    AST_