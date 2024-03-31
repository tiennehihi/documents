
            return;
        }

        var name = exp.expression;
        while (name.expression) {
            name = name.expression;
        }
        if (is_undeclared_ref(name) && name.name == "console") {
            return make_node(AST_Undefined, self);
        }
    }));
});

AST_Node.DEFMETHOD("equivalent_to", function(node) {
    return equivalent_to(this, node);
});

AST_Scope.DEFMETHOD("process_expression", function(insert, compressor) {
    var self = this;
    var tt = new TreeTransformer(function(node) {
        if (insert && node instanceof AST_SimpleStatement) {
            return make_node(AST_Return, node, {
                value: node.body
            });
        }
        if (!insert && node instanceof AST_Return) {
            if (compressor) {
                var value = node.value && node.value.drop_side_effect_free(compressor, true);
                return value
                    ? make_node(AST_SimpleStatement, node, { body: value })
                    : make_node(AST_EmptyStatement, node);
            }
            return make_node(AST_SimpleStatement, node, {
                body: node.value || make_node(AST_UnaryPrefix, node, {
                    operator: "void",
                    expression: make_node(AST_Number, node, {
                        value: 0
                    })
                })
            });
        }
        if (node instanceof AST_Class || node instanceof AST_Lambda && node !== self) {
            return node;
        }
        if (node instanceof AST_Block) {
            var index = node.body.length - 1;
            if (index >= 0) {
                node.body[index] = node.body[index].transform(tt);
            }
        } else if (node instanceof AST_If) {
            node.body = node.body.transform(tt);
            if (node.alternative) {
                node.alternative = node.alternative.transform(tt);
            }
        } else if (node instanceof AST_With) {
            node.body = node.body.transform(tt);
        }
        return node;
    });
    self.transform(tt);
});

AST_Toplevel.DEFMETHOD("reset_opt_flags", function(compressor) {
    const self = this;
    const reduce_vars = compressor.option("reduce_vars");

    const preparation = new TreeWalker(function(node, descend) {
        clear_flag(node, CLEAR_BETWEEN_PASSES);
        if (reduce_vars) {
            if (compressor.top_retain
                && node instanceof AST_Defun  // Only functions are retained
                && preparation.parent() === self
            ) {
                set_flag(node, TOP);
            }
            return node.reduce_vars(preparation, descend, compressor);
        }
    });
    // Stack of look-up tables to keep track of whether a `SymbolDef` has been
    // properly assigned before use:
    // - `push()` & `pop()` when visiting conditional branches
    preparation.safe_ids = Object.create(null);
    preparation.in_loop = null;
    preparation.loop_ids = new Map();
    preparation.defs_to_safe_ids = new Map();
    self.walk(preparation);
});

AST_Symbol.DEFMETHOD("fixed_value", function() {
    var fixed = this.thedef.fixed;
    if (!fixed || fixed instanceof AST_Node) return fixed;
    return fixed();
});

AST_SymbolRef.DEFMETHOD("is_immutable", function() {
    var orig = this.definition().orig;
    return orig.length == 1 && orig[0] instanceof AST_SymbolLambda;
});

function find_variable(compressor, name) {
    var scope, i = 0;
    while (scope = compressor.parent(i++)) {
        if (scope instanceof AST_Scope) break;
        if (scope instanceof AST_Catch && scope.argname) {
            scope = scope.argname.definition().scope;
            break;
        }
    }
    return scope.find_variable(name);
}

var global_names = makePredicate("Array Boolean clearInterval clearTimeout console Date decodeURI decodeURIComponent encodeURI encodeURIComponent Error escape eval EvalError Function isFinite isNaN JSON Math Number parseFloat parseInt RangeError ReferenceError RegExp Object setInterval setTimeout String SyntaxError TypeError unescape URIError");
AST_SymbolRef.DEFMETHOD("is_declared", function(compressor) {
    return !this.definition().undeclared
        || compressor.option("unsafe") && global_names.has(this.name);
});

/* -----[ optimizers ]----- */

var directives = new Set(["use asm", "use strict"]);
def_optimize(AST_Directive, function(self, compressor) {
    if (compressor.option("directives")
        && (!directives.has(self.value) || compressor.has_directive(self.value) !== self)) {
        return make_node(AST_EmptySta