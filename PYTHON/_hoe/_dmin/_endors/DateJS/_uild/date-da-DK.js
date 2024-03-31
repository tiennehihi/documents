.           �R�mXmX  S�mX��    ..          �R�mXmX  S�mX�    Be - q u e  �u e . j s     ����a s y n c  �- r e s o u   r c ASYNC-~1JS   uV�mXmX  Y�mXΔ�  Be - l o a  d e r . j s     ��n o - o p  - r e s o u   r c NO-OP-~1JS   i��mXmX ��mXph�   Ce r . j s  �  ����������  ����r e s o u  �r c e - l o   a d p e r - d  �o c u m e n   t - PER-DO~1JS   �mXmX ��mX�j|
  Be r . j s  �  ����������  ����r e q u e  �s t - m a n   a g REQUES~1JS   ��mXmX ��mX�lB  Be r . j s  c  ����������  ����r e s o u  cr c e - l o   a d RESOUR~1JS   M��mXmX ��mX�l7  Be . j s    �������������  ����r e s o u  �r c e - q u   e u RESOUR~2JS   ���mXmX ��mX�lM                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ined_after
 * }
 *
 * This function is called on the parent to handle this issue.
 */
function handle_defined_after_hoist(parent) {
    const defuns = [];
    walk(parent, node => {
        if (node === parent) return;
        if (node instanceof AST_Defun) defuns.push(node);
        if (
            node instanceof AST_Scope
            || node instanceof AST_SimpleStatement
        ) return true;
    });

    const symbols_of_interest = new Set();
    const defuns_of_interest = new Set();
    const potential_conflicts = [];

    for (const defun of defuns) {
        const fname_def = defun.name.definition();
        const found_self_ref_in_other_defuns = defuns.some(
            d => d !== defun && d.enclosed.indexOf(fname_def) !== -1
        );

        for (const def of defun.enclosed) {
            if (
                def.fixed === false
                || def === fname_def
                || def.scope.get_defun_scope() !== parent
            ) {
                continue;
            }

            // defun is hoisted, so always safe
            if (
                def.assignments === 0
                && def.orig.length === 1
                && def.orig[0] instanceof AST_SymbolDefun
            ) {
                continue;
            }

            if (found_self_ref_in_other_defuns) {
                def.fixed = false;
                continue;
            }

            // for the slower checks below this loop
            potential_conflicts.push({ defun, def, fname_def });
            symbols_of_interest.add(def.id);
            symbols_of_interest.add(fname_def.id);
            defuns_of_interest.add(defun);
        }
    }

    // linearize all symbols, and locate defs that are read after the defun
    if (potential_conflicts.length) {
        // All "symbols of interest", that is, defuns or defs, that we found.
        // These are placed in order so we can check which is after which.
        const found_symbols = [];
        // Indices of `found_symbols` which are writes
        const found_symbol_writes = new Set();
        // Defun ranges are recorded because we don't care if a function uses the def internally
        const defun_ranges = new Map();

        let tw;
        parent.walk((tw = new TreeWalker((node, descend) => {
            if (node instanceof AST_Defun && defuns_of_interest.has(node)) {
                const start = found_symbols.length;
                descend();
                const end = found_symbols.length;

                defun_ranges.set(node, { start, end });
                return true;
            }
            // if we found a defun on the list, mark IN_DEFUN=id and descend

            if (node instanceof AST_Symbol && node.thedef) {
                const id = node.definition().id;
                if (symbols_of_interest.has(id)) {
                    if (node instanceof AST_SymbolDeclaration || is_lhs(node, tw)) {
                        found_symbol_writes.add(found_symbols.length);
                    }
                    found_symbols.push(id);
                }
            }
        })));

        for (const { def, defun, fname_def } of potential_conflicts) {
            const defun_range = defun_ranges.get(defun);

            // find the index in `found_symbols`, with some special rules:
            const find = (sym_id, starting_at = 0, must_be_write = false) => {
                let index = starting_at;

                for (;;) {
                    index = found_symbols.indexOf(sym_id, index);

                    if (index === -1) {
                        break;
                    } else if (index >= defun_range.start && index < defun_range.end) {
                        index = defun_range.end;
                        continue;
                    } else if (must_be_write && !found_symbol_writes.has(index)) {
                        index++;
                        continue;
                    } else {
                        break;
                    }
                }

                return index;
            };

            const read_defun_at = find(fname_def.id);
            const wrote_def_at = find(def.id, read_defun_at + 1, true);

            const wrote_def_after_reading_defun = read_defun_at != -1 && wrote_def_at != -1 && wrote_def_at > read_defun_at;

            if (wrote_def_after_reading_defun) {
                def.fixed = false;
            }
        }
    }
}

def_reduce_vars(AST_Lambda, mark_lambda);

def_reduce_vars(AST_Do, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    const saved_loop = tw.in_loop;
    tw.in_loop = this;
    push(tw);
    this.body.walk(tw);
    if (has_break_or_continue(this)) {
        pop(tw);
        push(tw);
    }
    this.condition.walk(tw);
    pop(tw);
    tw.in_loop = saved_loop;
    return true;
});

def_reduce_vars(AST_For, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    if (this.init) this.init.walk(tw);
    const saved_loop = tw.in_loop;
    tw.in_loop = this;
    push(tw);
    if (this.condition) this.condition.walk(tw);
    this.body.walk(tw);
    if (this.step) {
        if (has_break_or_continue(this)) {
            pop(tw);
            push(tw);
        }
        this.step.walk(tw);
    }
    pop(tw);
    tw.in_loop = saved_loop;
    return true;
});

def_reduce_vars(AST_ForIn, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    suppress(this.init);
    this.object.walk(tw);
    const saved_loop = tw.in_loop;
    tw.in_loop = this;
    push(tw);
    this.body.walk(tw);
    pop(tw);
    tw.in_loop = saved_loop;
    return true;
});

def_reduce_vars(AST_If, function(tw) {
    this.condition.walk(tw);
    push(tw);
    this.body.walk(tw);
    pop(tw);
    if (this.alternative) {
        push(tw);
        this.alternative.walk(tw);
        pop(tw);
    }
    return true;
});

def_reduce_vars(AST_LabeledStatement, function(tw) {
    push(tw);
    this.body.walk(tw);
    pop(tw);
    return true;
});

def_reduce_vars(AST_SymbolCatch, function() {
    this.definition().fixed = false;
});

def_reduce_vars(AST_SymbolRef, function(tw, descend, compressor) {
    var d = this.definition();
    d.references.push(this);
    if (d.references.length == 1
        && !d.fixed
        && d.orig[0] instanceof AST_SymbolDefun) {
        tw.loop_ids.set(d.id, tw.in_loop);
    }
    var fixed_value;
    if (d.fixed === undefined || !safe_to_read(tw, d)) {
        d.fixed = false;
    } else if (d.fixed) {
        fixed_value = this.fixed_value();
        if (
            fixed_value instanceof AST_Lambda
            && is_recursive_ref(tw, d)
        ) {
            d.recursive_refs++;
        } else if (fixed_value
            && !compressor.exposed(d)
            && ref_once(tw, compressor, d)
        ) {
            d.single_use =
                fixed_value instanceof AST_Lambda && !fixed_value.pinned()
                || fixed_value instanceof AST_Class
                || d.scope === this.scope && fixed_value.is_constant_expression();
        } else {
            d.single_use = false;
        }
        if (is_modified(compressor, tw, this, fixed_value, 0, is_immutable(fixed_value))) {
            if (d.single_use) {
                d.single_use = "m";
            } else {
                d.fixed = false;
            }
        }
    }
    mark_escaped(tw, d, this.scope, this, fixed_value, 0, 1);
});

def_reduce_vars(AST_Toplevel, function(tw, descend, compressor) {
    this.globals.forEach(function(def) {
        reset_def(compressor, def);
    });
    reset_variables(tw, compressor, this);
    descend();
    handle_defined_after_hoist(this);
    return true;
});

def_reduce_vars(AST_Try, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    push(tw);
    this.body.walk(tw);
    pop(tw);
    if (this.bcatch) {
        push(tw);
        this.bcatch.walk(tw);
        pop(tw);
    }
    if (this.bfinally) this.bfinally.walk(tw);
    return true;
});

def_reduce_vars(AST_Unary, function(tw) {
    var node = this;
    if (node.operator !== "++" && node.operator !== "--") return;
    var exp = node.expression;
    if (!(exp instanceof AST_SymbolRef)) return;
    var def = exp.definition();
    var safe = safe_to_assign(tw, def, exp.scope, true);
    def.assignments++;
    if (!safe) return;
    var fixed = def.fixed;
    if (!fixed) return;
    def.references.push(exp);
    def.chained = true;
    def.fixed = function() {
        return make_node(AST_Binary, node, {
            operator: node.operator.slice(0, -1),
            left: make_node(AST_UnaryPrefix, node, {
                operator: "+",
                expression: fixed instanceof AST_Node ? fixed : fixed()
            }),
            right: make_node(AST_Number, node, {
                value: 1
            })
        });
    };
    mark(tw, def, true);
    return true;
});

def_reduce_vars(AST_VarDef, function(tw, descend) {
    var node = this;
    if (node.name instanceof AST_Destructuring) {
        suppress(node.name);
        return;
    }
    var d = node.name.definition();
    if (node.value) {
        if (safe_to_assign(tw, d, node.name.scope, node.value)) {
            d.fixed = function() {
                return node.value;
            };
            tw.loop_ids.set(d.id, tw.in_loop);
            mark(tw, d, false);
            descend();
            mark(tw, d, true);
            return true;
        } else {
            d.fixed = false;
        }
    }
});

def_reduce_vars(AST_While, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    const saved_loop = tw.in_loop;
    tw.in_loop = this;
    push(tw);
    descend();
    pop(tw);
    tw.in_loop = saved_loop;
    return true;
});

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

function loop_body(x) {
    if (x instanceof AST_IterationStatement) {
        return x.body instanceof AST_BlockStatement ? x.body : x;
    }
    return x;
}

function is_lhs_read_only(lhs) {
    if (lhs instanceof AST_This) return true;
    if (lhs instanceof AST_SymbolRef) return lhs.definition().orig[0] instanceof AST_SymbolLambda;
    if (lhs instanceof AST_PropAccess) {
        lhs = lhs.expression;
        if (lhs instanceof AST_SymbolRef) {
            if (lhs.is_immutable()) return false;
            lhs = lhs.fixed_value();
        }
        if (!lhs) return true;
        if (lhs instanceof AST_RegExp) return false;
        if (lhs instanceof AST_Constant) return true;
        return is_lhs_read_only(lhs);
    }
    return false;
}

/** var a = 1 --> var a*/
function remove_initializers(var_statement) {
    var decls = [];
    var_statement.definitions.forEach(function(def) {
        if (def.name instanceof AST_SymbolDeclaration) {
            def.value = null;
            decls.push(def);
        } else {
            def.declarations_as_names().forEach(name => {
                decls.push(make_node(AST_VarDef, def, {
                    name,
                    value: null
                }));
            });
        }
    });
    return decls.length ? make_node(AST_Var, var_statement, { definitions: decls }) : null;
}

/** Called on code which we know is unreachable, to keep elements that affect outside of it. */
function trim_unreachable_code(compressor, stat, target) {
    walk(stat, node => {
        if (node instanceof AST_Var) {
            const no_initializers = remove_initializers(node);
            if (no_initializers) target.push(no_initializers);
            return true;
        }
        if (
            node instanceof AST_Defun
            && (node === stat || !compressor.has_directive("use strict"))
        ) {
            target.push(node === stat ? node : make_node(AST_Var, node, {
                definitions: [
                    make_node(AST_VarDef, node, {
                        name: make_node(AST_SymbolVar, node.name, node.name),
                        value: null
                    })
                ]
            }));
            return true;
        }
        if (node instanceof AST_Export || node instanceof AST_Import) {
            target.push(node);
            return true;
        }
        if (node instanceof AST_Scope) {
            return true;
        }
    });
}

/** Tighten a bunch of statements together, and perform statement-level optimization. */
function tighten_body(statements, compressor) {
    const nearest_scope = compressor.find_scope();
    const defun_scope = nearest_scope.get_defun_scope();
    const { in_loop, in_try } = find_loop_scope_try();

    var CHANGED, max_iter = 10;
    do {
        CHANGED = false;
        eliminate_spurious_blocks(statements);
        if (compressor.option("dead_code")) {
            eliminate_dead_code(statements, compressor);
        }
        if (compressor.option("if_return")) {
            handle_if_return(statements, compressor);
        }
        if (compressor.sequences_limit > 0) {
            sequencesize(statements, compressor);
            sequencesize_2(statements, compressor);
        }
        if (compressor.option("join_vars")) {
            join_consecutive_vars(statements);
        }
        if (compressor.option("collapse_vars")) {
            collapse(statements, compressor);
        }
    } while (CHANGED && max_iter-- > 0);

    function find_loop_scope_try() {
        var node = compressor.self(), level = 0, in_loop = false, in_try = false;
        do {
            if (node instanceof AST_IterationStatement) {
                in_loop = true;
            } else if (node instanceof AST_Scope) {
                break;
            } else if (node instanceof AST_TryBlock) {
                in_try = true;
            }
        } while (node = compressor.parent(level++));

        return { in_loop, in_try };
    }

    // Search from right to left for assignment-like expressions:
    // - `var a = x;`
    // - `a = x;`
    // - `++a`
    // For each candidate, scan from left to right for first usage, then try
    // to fold assignment into the site for compression.
    // Will not attempt to collapse assignments into or past code blocks
    // which are not sequentially executed, e.g. loops and conditionals.
    function collapse(statements, compressor) {
        if (nearest_scope.pinned() || defun_scope.pinned())
            return statements;
        var args;
        var candidates = [];
        var stat_index = statements.length;
        var scanner = new TreeTransformer(function (node) {
            if (abort)
                return node;
            // Skip nodes before `candidate` as quickly as possible
            if (!hit) {
                if (node !== hit_stack[hit_index])
                    return node;
                hit_index++;
                if (hit_index < hit_stack.length)
                    return handle_custom_scan_order(node);
                hit = true;
                stop_after = find_stop(node, 0);
                if (stop_after === node)
                    abort = true;
                return node;
            }
            // Stop immediately if these node types are encountered
            var parent = scanner.parent();
            if (node instanceof AST_Assign
                    && (node.logical || node.operator != "=" && lhs.equivalent_to(node.left))
                || node instanceof AST_Await
                || node instanceof AST_Call && lhs instanceof AST_PropAccess && lhs.equivalent_to(node.expression)
                ||
                    (node instanceof AST_Call || node instanceof AST_PropAccess)
                    && node.optional
                || node instanceof AST_Debugger
                || node instanceof AST_Destructuring
                || node instanceof AST_Expansion
                    && node.expression instanceof AST_Symbol
                    && (
                        node.expression instanceof AST_This
                        || node.expression.definition().references.length > 1
                    )
                || node instanceof AST_IterationStatement && !(node instanceof AST_For)
                || node instanceof AST_LoopControl
                || node instanceof AST_Try
                || node instanceof AST_With
                || node instanceof AST_Yield
                || node instanceof AST_Export
                || node instanceof AST_Class
                || parent instanceof AST_For && node !== parent.init
                || !replace_all
                    && (
                        node instanceof AST_SymbolRef
                        && !node.is_declared(compressor)
                        && !pure_prop_access_globals.has(node)
                    )
                || node instanceof AST_SymbolRef
                    && parent instanceof AST_Call
                    && has_annotation(parent, _NOINLINE)
            ) {
                abort = true;
                return node;
            }
            // Stop only if candidate is found within conditional branches
            if (!stop_if_hit && (!lhs_local || !replace_all)
                && (parent instanceof AST_Binary && lazy_op.has(parent.operator) && parent.left !== node
                    || parent instanceof AST_Conditional && parent.condition !== node
                    || parent instanceof AST_If && parent.condition !== node)) {
                stop_if_hit = parent;
            }
            // Replace variable with assignment when found
            if (
                can_replace
                && !(node instanceof AST_SymbolDeclaration)
                && lhs.equivalent_to(node)
                && !shadows(scanner.find_scope() || nearest_scope, lvalues)
            ) {
                if (stop_if_hit) {
                    abort = true;
                    return node;
                }
                if (is_lhs(node, parent)) {
                    if (value_def)
                        replaced++;
                    return node;
                } else {
                    replaced++;
                    if (value_def && candidate instanceof AST_VarDef)
                        return node;
                }
                CHANGED = abort = true;
                if (candidate instanceof AST_UnaryPostfix) {
                    return make_node(AST_UnaryPrefix, candidate, candidate);
                }
                if (candidate instanceof AST_VarDef) {
                    var def = candidate.name.definition();
                    var value = candidate.value;
                    if (def.references.length - def.replaced == 1 && !compressor.exposed(def)) {
                        def.replaced++;
                        if (funarg && is_identifier_atom(value)) {
                            return value.transform(compressor);
                        } else {
                            return maintain_this_binding(parent, node, value);
                        }
                    }
                    return make_node(AST_Assign, candidate, {
                        operator: "=",
                        logical: false,
                        left: make_node(AST_SymbolRef, candidate.name, candidate.name),
                        right: value
                    });
                }
                clear_flag(candidate, WRITE_ONLY);
                return candidate;
            }
            // These node types have child nodes that execute sequentially,
            // but are otherwise not safe to scan into or beyond them.
            var sym;
            if (node instanceof AST_Call
                || node instanceof AST_Exit
                && (side_effects || lhs instanceof AST_PropAccess || may_modify(lhs))
                || node instanceof AST_PropAccess
                && (side_effects || node.expression.may_throw_on_access(compressor))
                || node instanceof AST_SymbolRef
                && ((lvalues.has(node.name) && lvalues.get(node.name).modified) || side_effects && may_modify(node))
                || node instanceof AST_VarDef && node.value
                && (lvalues.has(node.name.name) || side_effects && may_modify(node.name))
                || (sym = is_lhs(node.left, node))
                && (sym instanceof AST_PropAccess || lvalues.has(sym.name))
                || may_throw
                && (in_try ? node.has_side_effects(compressor) : side_effects_external(node))) {
                stop_after = node;
                if (node instanceof AST_Scope)
                    abort = true;
            }
            return handle_custom_scan_order(node);
        }, function (node) {
            if (abort)
                return;
            if (stop_after === node)
                abort = true;
            if (stop_if_hit === node)
                stop_if_hit = null;
        });

        var multi_replacer = new TreeTransformer(function (node) {
            if (abort)
                return node;
            // Skip nodes before `candidate` as quickly as possible
            if (!hit) {
                if (node !== hit_stack[hit_index])
                    return node;
                hit_index++;
                if (hit_index < hit_stack.length)
                    return;
                hit = true;
                return node;
            }
            // Replace variable when found
            if (node instanceof AST_SymbolRef
                && node.name == def.name) {
                if (!--replaced)
                    abort = true;
                if (is_lhs(node, multi_replacer.parent()))
                    return node;
                def.replaced++;
                value_def.replaced--;
                return candidate.value;
            }
            // Skip (non-executed) functions and (leading) default case in switch statements
            if (node instanceof AST_Default || node instanceof AST_Scope)
                return node;
        });

        while (--stat_index >= 0) {
            // Treat parameters as collapsible in IIFE, i.e.
            //   function(a, b){ ... }(x());
            // would be translated into equivalent assignments:
            //   var a = x(), b = undefined;
            if (stat_index == 0 && compressor.option("unused"))
                extract_args();
            // Find collapsible assignments
            var hit_stack = [];
            extract_candidates(statements[stat_index]);
            while (candidates.length > 0) {
                hit_stack = candidates.pop();
                var hit_index = 0;
                var candidate = hit_stack[hit_stack.length - 1];
                var value_def = null;
                var stop_after = null;
                var stop_if_hit = null;
                var lhs = get_lhs(candidate);
                if (!lhs || is_lhs_read_only(lhs) || lhs.has_side_effects(compressor))
                    continue;
                // Locate symbols which may execute code outside of scanning range
                var lvalues = get_lvalues(candidate);
                var lhs_local = is_lhs_local(lhs);
                if (lhs instanceof AST_SymbolRef) {
                    lvalues.set(lhs.name, { def: lhs.definition(), modified: false });
                }
                var side_effects = value_has_side_effects(candidate);
                var replace_all = replace_all_symbols();
                var may_throw = candidate.may_throw(compressor);
                var funarg = candidate.name instanceof AST_SymbolFunarg;
                var hit = funarg;
                var abort = false, replaced = 0, can_replace = !args || !hit;
                if (!can_replace) {
                    for (
                        let j = compressor.self().argnames.lastIndexOf(candidate.name) + 1;
                        !abort && j < args.length;
                        j++
                    ) {
                        args[j].transform(scanner);
                    }
                    can_replace = true;
                }
                for (var i = stat_index; !abort && i < statements.length; i++) {
                    statements[i].transform(scanner);
                }
                if (value_def) {
                    var def = candidate.name.definition();
                    if (abort && def.references.length - def.replaced > replaced)
                        replaced = false;
                    else {
                        abort = false;
                        hit_index = 0;
                        hit = funarg;
                        for (var i = stat_index; !abort && i < statements.length; i++) {
                            statements[i].transform(multi_replacer);
                        }
                        value_def.single_use = false;
                    }
                }
                if (replaced && !remove_candidate(candidate))
                    statements.splice(stat_index, 1);
            }
        }

        function handle_custom_scan_order(node) {
            // Skip (non-executed) functions
            if (node instanceof AST_Scope)
                return node;

            // Scan case expressions first in a switch statement
            if (node instanceof AST_Switch) {
                node.expression = node.expression.transform(scanner);
                for (var i = 0, len = node.body.length; !abort && i < len; i++) {
                    var branch = node.body[i];
                    if (branch instanceof AST_Case) {
                        if (!hit) {
                            if (branch !== hit_stack[hit_index])
                                continue;
                            hit_index++;
                        }
                        branch.expression = branch.expression.transform(scanner);
                        if (!replace_all)
                            break;
                    }
                }
                abort = true;
                return node;
            }
        }

        function redefined_within_scope(def, scope) {
            if (def.global)
                return false;
            let cur_scope = def.scope;
            while (cur_scope && cur_scope !== scope) {
                if (cur_scope.variables.has(def.name)) {
                    return true;
                }
                cur_scope = cur_scope.parent_scope;
            }
            return false;
        }

        function has_overlapping_symbol(fn, arg, fn_strict) {
            var found = false, scan_this = !(fn instanceof AST_Arrow);
            arg.walk(new TreeWalker(function (node, descend) {
                if (found)
                    return true;
                if (node instanceof AST_SymbolRef && (fn.variables.has(node.name) || redefined_within_scope(node.definition(), fn))) {
                    var s = node.definition().scope;
                    if (s !== defun_scope)
                        while (s = s.parent_scope) {
                            if (s === defun_scope)
                                return true;
                        }
                    return found = true;
                }
                if ((fn_strict || scan_this) && node instanceof AST_This) {
                    return found = true;
                }
                if (node instanceof AST_Scope && !(node instanceof AST_Arrow)) {
                    var prev = scan_this;
                    scan_this = false;
                    descend();
                    scan_this = prev;
                    return true;
                }
            }));
            return found;
        }

        function arg_is_injectable(arg) {
            if (arg instanceof AST_Expansion) return false;
            const contains_await = walk(arg, (node) => {
                if (node instanceof AST_Await) return walk_abort;
            });
            if (contains_await) return false;
            return true;
        }
        function extract_args() {
            var iife, fn = compressor.self();
            if (is_func_expr(fn)
                && !fn.name
                && !fn.uses_arguments
                && !fn.pinned()
                && (iife = compressor.parent()) instanceof AST_Call
                && iife.expression === fn
                && iife.args.every(arg_is_injectable)
            ) {
                var fn_strict = compressor.has_directive("use strict");
                if (fn_strict && !member(fn_strict, fn.body))
                    fn_strict = false;
                var len = fn.argnames.length;
                args = iife.args.slice(len);
                var names = new Set();
                for (var i = len; --i >= 0;) {
                    var sym = fn.argnames[i];
                    var arg = iife.args[i];
                    // The following two line fix is a duplicate of the fix at
                    // https://github.com/terser/terser/commit/011d3eb08cefe6922c7d1bdfa113fc4aeaca1b75
                    // This might mean that these two pieces of code (one here in collapse_vars and another in reduce_vars
                    // Might be doing the exact same thing.
                    const def = sym.definition && sym.definition();
                    const is_reassigned = def && def.orig.length > 1;
                    if (is_reassigned)
                        continue;
                    args.unshift(make_node(AST_VarDef, sym, {
                        name: sym,
                        value: arg
                    }));
                    if (names.has(sym.name))
                        continue;
                    names.add(sym.name);
                    if (sym instanceof AST_Expansion) {
                        var elements = iife.args.slice(i);
                        if (elements.every((arg) => !has_overlapping_symbol(fn, arg, fn_strict)
                        )) {
                            candidates.unshift([make_node(AST_VarDef, sym, {
                                name: sym.expression,
                                value: make_node(AST_Array, iife, {
                                    elements: elements
                                })
                            })]);
                        }
                    } else {
                        if (!arg) {
                            arg = make_node(AST_Undefined, sym).transform(compressor);
                        } else if (arg instanceof AST_Lambda && arg.pinned()
                            || has_overlapping_symbol(fn, arg, fn_strict)) {
                            arg = null;
                        }
                        if (arg)
                            candidates.unshift([make_node(AST_VarDef, sym, {
                                name: sym,
                                value: arg
                            })]);
                    }
                }
            }
        }

        function extract_candidates(expr) {
            hit_stack.push(expr);
            if (expr instanceof AST_Assign) {
                if (!expr.left.has_side_effects(compressor)
                    && !(expr.right instanceof AST_Chain)) {
                    candidates.push(hit_stack.slice());
                }
                extract_candidates(expr.right);
            } else if (expr instanceof AST_Binary) {
                extract_candidates(expr.left);
                extract_candidates(expr.right);
            } else if (expr instanceof AST_Call && !has_annotation(expr, _NOINLINE)) {
                extract_candidates(expr.expression);
                expr.args.forEach(extract_candidates);
            } else if (expr instanceof AST_Case) {
                extract_candidates(expr.expression);
            } else if (expr instanceof AST_Conditional) {
                extract_candidates(expr.condition);
                extract_candidates(expr.consequent);
                extract_candidates(expr.alternative);
            } else if (expr instanceof AST_Definitions) {
                var len = expr.definitions.length;
                // limit number of trailing variable definitions for consideration
                var i = len - 200;
                if (i < 0)
                    i = 0;
                for (; i < len; i++) {
                    extract_candidates(expr.definitions[i]);
                }
            } else if (expr instanceof AST_DWLoop) {
                extract_candidates(expr.condition);
                if (!(expr.body instanceof AST_Block)) {
                    extract_candidates(expr.body);
                }
            } else if (expr instanceof AST_Exit) {
                if (expr.value)
                    extract_candidates(expr.value);
            } else if (expr instanceof AST_For) {
                if (expr.init)
                    extract_candidates(expr.init);
                if (expr.condition)
                    extract_candidates(expr.condition);
                if (expr.step)
                    extract_candidates(expr.step);
                if (!(expr.body instanceof AST_Block)) {
                    extract_candidates(expr.body);
                }
            } else if (expr instanceof AST_ForIn) {
                extract_candidates(expr.object);
                if (!(expr.body instanceof AST_Block)) {
                    extract_candidates(expr.body);
                }
            } else if (expr instanceof AST_If) {
                extract_candidates(expr.condition);
                if (!(expr.body instanceof AST_Block)) {
                    extract_candidates(expr.body);
                }
                if (expr.alternative && !(expr.alternative instanceof AST_Block)) {
                    extract_candidates(expr.alternative);
                }
            } else if (expr instanceof AST_Sequence) {
                expr.expressions.forEach(extract_candidates);
            } else if (expr instanceof AST_SimpleStatement) {
                extract_candidates(expr.body);
            } else if (expr instanceof AST_Switch) {
                extract_candidates(expr.expression);
                expr.body.forEach(extract_candidates);
            } else if (expr instanceof AST_Unary) {
                if (expr.operator == "++" || expr.operator == "--") {
                    candidates.push(hit_stack.slice());
                }
            } else if (expr instanceof AST_VarDef) {
                if (expr.value && !(expr.value instanceof AST_Chain)) {
                    candidates.push(hit_stack.slice());
                    extract_candidates(expr.value);
                }
            }
            hit_stack.pop();
        }

        function find_stop(node, level, write_only) {
            var parent = scanner.parent(level);
            if (parent instanceof AST_Assign) {
                if (write_only
                    && !parent.logical
                    && !(parent.left instanceof AST_PropAccess
                        || lvalues.has(parent.left.name))) {
                    return find_stop(parent, level + 1, write_only);
                }
                return node;
            }
            if (parent instanceof AST_Binary) {
                if (write_only && (!lazy_op.has(parent.operator) || parent.left === node)) {
                    return find_stop(parent, level + 1, write_only);
                }
                return node;
            }
            if (parent instanceof AST_Call)
                return node;
            if (parent instanceof AST_Case)
                return node;
            if (parent instanceof AST_Conditional) {
                if (write_only && parent.condition === node) {
                    return find_stop(parent, level + 1, write_only);
                }
                return node;
            }
            if (parent instanceof AST_Definitions) {
                return find_stop(parent, level + 1, true);
            }
            if (parent instanceof AST_Exit) {
                return write_only ? find_stop(parent, level + 1, write_only) : node;
            }
            if (parent instanceof AST_If) {
                if (write_only && parent.condition === node) {
                    return find_stop(parent, level + 1, write_only);
                }
                return node;
            }
            if (parent instanceof AST_IterationStatement)
                return node;
            if (parent instanceof AST_Sequence) {
                return find_stop(parent, level + 1, parent.tail_node() !== node);
            }
            if (parent instanceof AST_SimpleStatement) {
                return find_stop(parent, level + 1, true);
            }
            if (parent instanceof AST_Switch)
                return node;
            if (parent instanceof AST_VarDef)
                return node;
            return null;
        }

        function mangleable_var(var_def) {
            var value = var_def.value;
            if (!(value instanceof AST_SymbolRef))
                return;
            if (value.name == "arguments")
                return;
            var def = value.definition();
            if (def.undeclared)
                return;
            return value_def = def;
        }

        function get_lhs(expr) {
            if (expr instanceof AST_Assign && expr.logical) {
                return false;
            } else if (expr instanceof AST_VarDef && expr.name instanceof AST_SymbolDeclaration) {
                var def = expr.name.definition();
                if (!member(expr.name, def.orig))
                    return;
                var referenced = def.references.length - def.replaced;
                if (!referenced)
                    return;
                var declared = def.orig.length - def.eliminated;
                if (declared > 1 && !(expr.name instanceof AST_SymbolFunarg)
                    || (referenced > 1 ? mangleable_var(expr) : !compressor.exposed(def))) {
                    return make_node(AST_SymbolRef, expr.name, expr.name);
                }
            } else {
                const lhs = expr instanceof AST_Assign
                    ? expr.left
                    : expr.expression;
                return !is_ref_of(lhs, AST_SymbolConst)
                    && !is_ref_of(lhs, AST_SymbolLet) && lhs;
            }
        }

        function get_rvalue(expr) {
            if (expr instanceof AST_Assign) {
                return expr.right;
            } else {
                return expr.value;
            }
        }

        function get_lvalues(expr) {
            var lvalues = new Map();
            if (expr instanceof AST_Unary)
                return lvalues;
            var tw = new TreeWalker(function (node) {
                var sym = node;
                while (sym instanceof AST_PropAccess)
                    sym = sym.expression;
                if (sym instanceof AST_SymbolRef) {
                    const prev = lvalues.get(sym.name);
                    if (!prev || !prev.modified) {
                        lvalues.set(sym.name, {
                            def: sym.definition(),
                            modified: is_modified(compressor, tw, node, node, 0)
                        });
                    }
                }
            });
            get_rvalue(expr).walk(tw);
            return lvalues;
        }

        function remove_candidate(expr) {
            if (expr.name instanceof AST_SymbolFunarg) {
                var iife = compressor.parent(), argnames = compressor.self().argnames;
                var index = argnames.indexOf(expr.name);
                if (index < 0) {
                    iife.args.length = Math.min(iife.args.length, argnames.length - 1);
                } else {
                    var args = iife.args;
                    if (args[index])
                        args[index] = make_node(AST_Number, args[index], {
                            value: 0
                        });
                }
                return true;
            }
            var found = false;
            return statements[stat_index].transform(new TreeTransformer(function (node, descend, in_list) {
                if (found)
                    return node;
                if (node === expr || node.body === expr) {
                    found = true;
                    if (node instanceof AST_VarDef) {
                        node.value = node.name instanceof AST_SymbolConst
                            ? make_node(AST_Undefined, node.value) // `const` always needs value.
                            : null;
                        return node;
                    }
                    return in_list ? MAP.skip : null;
                }
            }, function (node) {
                if (node instanceof AST_Sequence)
                    switch (node.expressions.length) {
                        case 0: return null;
                        case 1: return node.expressions[0];
                    }
            }));
        }

        function is_lhs_local(lhs) {
            while (lhs instanceof AST_PropAccess)
                lhs = lhs.expression;
            return lhs instanceof AST_SymbolRef
                && lhs.definition().scope.get_defun_scope() === defun_scope
                && !(in_loop
                    && (lvalues.has(lhs.name)
                        || candidate instanceof AST_Unary
                        || (candidate instanceof AST_Assign
                            && !candidate.logical
                            && candidate.operator != "=")));
        }

        function value_has_side_effects(expr) {
            if (expr instanceof AST_Unary)
                return unary_side_effects.has(expr.operator);
            return get_rvalue(expr).has_side_effects(compressor);
        }

        function replace_all_symbols() {
            if (side_effects)
                return false;
            if (value_def)
                return true;
            if (lhs instanceof AST_SymbolRef) {
                var def = lhs.definition();
                if (def.references.length - def.replaced == (candidate instanceof AST_VarDef ? 1 : 2)) {
                    return true;
                }
            }
            return false;
        }

        function may_modify(sym) {
            if (!sym.definition)
                return true; // AST_Destructuring
            var def = sym.definition();
            if (def.orig.length == 1 && def.orig[0] instanceof AST_SymbolDefun)
                return false;
            if (def.scope.get_defun_scope() !== defun_scope)
                return true;
            return def.references.some((ref) =>
                ref.scope.get_defun_scope() !== defun_scope
            );
        }

        function side_effects_external(node, lhs) {
            if (node instanceof AST_Assign)
                return side_effects_external(node.left, true);
            if (node instanceof AST_Unary)
                return side_effects_external(node.expression, true);
            if (node instanceof AST_VarDef)
                return node.value && side_effects_external(node.value);
            if (lhs) {
                if (node instanceof AST_Dot)
                    return side_effects_external(node.expression, true);
                if (node instanceof AST_Sub)
                    return side_effects_external(node.expression, true);
                if (node instanceof AST_SymbolRef)
                    return node.definition().scope.get_defun_scope() !== defun_scope;
            }
            return false;
        }

        /**
         * Will any of the pulled-in lvalues shadow a variable in newScope or parents?
         * similar to scope_encloses_variables_in_this_scope */
        function shadows(my_scope, lvalues) {
            for (const { def } of lvalues.values()) {
                const looked_up = my_scope.find_variable(def.name);
                if (looked_up) {
                    if (looked_up === def) continue;
                    return true;
                }
            }
            return false;
        }
    }

    function eliminate_spurious_blocks(statements) {
        var seen_dirs = [];
        for (var i = 0; i < statements.length;) {
            var stat = statements[i];
            if (stat instanceof AST_BlockStatement && stat.body.every(can_be_evicted_from_block)) {
                CHANGED = true;
                eliminate_spurious_blocks(stat.body);
                statements.splice(i, 1, ...stat.body);
                i += stat.body.length;
            } else if (stat instanceof AST_EmptyStatement) {
                CHANGED = true;
                statements.splice(i, 1);
            } else if (stat instanceof AST_Directive) {
                if (seen_dirs.indexOf(stat.value) < 0) {
                    i++;
                    seen_dirs.push(stat.value);
                } else {
                    CHANGED = true;
                    statements.splice(i, 1);
                }
            } else
                i++;
        }
    }

    function handle_if_return(statements, compressor) {
        var self = compressor.self();
        var multiple_if_returns = has_multiple_if_returns(statements);
        var in_lambda = self instanceof AST_Lambda;
        // Prevent extremely deep nesting
        // https://github.com/terser/terser/issues/1432
        // https://github.com/webpack/webpack/issues/17548
        const iteration_start = Math.min(statements.length, 500);
        for (var i = iteration_start; --i >= 0;) {
            var stat = statements[i];
            var j = next_index(i);
            var next = statements[j];

            if (in_lambda && !next && stat instanceof AST_Return) {
                if (!stat.value) {
                    CHANGED = true;
                    statements.splice(i, 1);
                    continue;
                }
                if (stat.value instanceof AST_UnaryPrefix && stat.value.operator == "void") {
                    CHANGED = true;
                    statements[i] = make_node(AST_SimpleStatement, stat, {
                        body: stat.value.expression
                    });
                    continue;
                }
            }

            if (stat instanceof AST_If) {
                let ab, new_else;

                ab = aborts(stat.body);
                if (
                    can_merge_flow(ab)
                    && (new_else = as_statement_array_with_return(stat.body, ab))
                ) {
                    if (ab.label) {
                        remove(ab.label.thedef.references, ab);
                    }
                    CHANGED = true;
                    stat = stat.clone();
                    stat.condition = stat.condition.negate(compressor);
                    stat.body = make_node(AST_BlockStatement, stat, {
                        body: as_statement_array(stat.alternative).concat(extract_functions())
                    });
                    stat.alternative = make_node(AST_BlockStatement, stat, {
                        body: new_else
                    });
                    statements[i] = stat.transform(compressor);
                    continue;
                }

                ab = aborts(stat.alternative);
                if (
                    can_merge_flow(ab)
                    && (new_else = as_statement_array_with_return(stat.alternative, ab))
                ) {
                    if (ab.label) {
                        remove(ab.label.thedef.references, ab);
                    }
                    CHANGED = true;
                    stat = stat.clone();
                    stat.body = make_node(AST_BlockStatement, stat.body, {
                        body: as_statement_array(stat.body).concat(extract_functions())
                    });
                    stat.alternative = make_node(AST_BlockStatement, stat.alternative, {
                        body: new_else
                    });
                    statements[i] = stat.transform(compressor);
                    continue;
                }
            }

            if (stat instanceof AST_If && stat.body instanceof AST_Return) {
                var value = stat.body.value;
                //---
                // pretty silly case, but:
                // if (foo()) return; return; ==> foo(); return;
                if (!value && !stat.alternative
                    && (in_lambda && !next || next instanceof AST_Return && !next.value)) {
                    CHANGED = true;
                    statements[i] = make_node(AST_SimpleStatement, stat.condition, {
                        body: stat.condition
                    });
                    continue;
                }
                //---
                // if (foo()) return x; return y; ==> return foo() ? x : y;
                if (value && !stat.alternative && next instanceof AST_Return && next.value) {
                    CHANGED = true;
                    stat = stat.clone();
                    stat.alternative = next;
                    statements[i] = stat.transform(compressor);
                    statements.splice(j, 1);
                    continue;
                }
                //---
                // if (foo()) return x; [ return ; ] ==> return foo() ? x : undefined;
                if (value && !stat.alternative
                    && (!next && in_lambda && multiple_if_returns
                        || next instanceof AST_Return)) {
                    CHANGED = true;
                    stat = stat.clone();
                    stat.alternative = next || make_node(AST_Return, stat, {
                        value: null
                    });
                    statements[i] = stat.transform(compressor);
                    if (next)
                        statements.splice(j, 1);
                    continue;
                }
                //---
                // if (a) return b; if (c) return d; e; ==> return a ? b : c ? d : void e;
                //
                // if sequences is not enabled, this can lead to an endless loop (issue #866).
                // however, with sequences on this helps producing slightly better output for
                // the example code.
                var prev = statements[prev_index(i)];
                if (compressor.option("sequences") && in_lambda && !stat.alternative
                    && prev instanceof AST_If && prev.body instanceof AST_Return
                    && next_index(j) == statements.length && next instanceof AST_SimpleStatement) {
                    CHANGED = true;
                    stat = stat.clone();
                    stat.alternative = make_node(AST_BlockStatement, next, {
                        body: [
                            next,
                            make_node(AST_Return, next, {
                                value: null
                            })
                        ]
                    });
                    statements[i] = stat.transform(compressor);
                    statements.splice(j, 1);
                    continue;
                }
            }
        }

        function has_multiple_if_returns(statements) {
            var n = 0;
            for (var i = statements.length; --i >= 0;) {
                var stat = statements[i];
                if (stat instanceof AST_If && stat.body instanceof AST_Return) {
                    if (++n > 1)
                        return true;
                }
            }
            return false;
        }

        function is_return_void(value) {
            return !value || value instanceof AST_UnaryPrefix && value.operator == "void";
        }

        function can_merge_flow(ab) {
            if (!ab)
                return false;
            for (var j = i + 1, len = statements.length; j < len; j++) {
                var stat = statements[j];
                if (stat instanceof AST_Const || stat instanceof AST_Let)
                    return false;
            }
            var lct = ab instanceof AST_LoopControl ? compressor.loopcontrol_target(ab) : null;
            return ab instanceof AST_Return && in_lambda && is_return_void(ab.value)
                || ab instanceof AST_Continue && self === loop_body(lct)
                || ab instanceof AST_Break && lct instanceof AST_BlockStatement && self === lct;
        }

        function extract_functions() {
            var tail = statements.slice(i + 1);
            statements.length = i + 1;
            return tail.filter(function (stat) {
                if (stat instanceof AST_Defun) {
                    statements.push(stat);
                    return false;
                }
                return true;
            });
        }

        function as_statement_array_with_return(node, ab) {
            var body = as_statement_array(node);
            if (ab !== body[body.length - 1]) {
                return undefined;
            }
            body = body.slice(0, -1);
            if (ab.value) {
                body.push(make_node(AST_SimpleStatement, ab.value, {
                    body: ab.value.expression
                }));
            }
            return body;
        }

        function next_index(i) {
            for (var j = i + 1, len = statements.length; j < len; j++) {
                var stat = statements[j];
                if (!(stat instanceof AST_Var && declarations_only(stat))) {
                    break;
                }
            }
            return j;
        }

        function prev_index(i) {
            for (var j = i; --j >= 0;) {
                var stat = statements[j];
                if (!(stat instanceof AST_Var && declarations_only(stat))) {
                    break;
                }
            }
            return j;
        }
    }

    function eliminate_dead_code(statements, compressor) {
        var has_quit;
        var self = compressor.self();
        for (var i = 0, n = 0, len = statements.length; i < len; i++) {
            var stat = statements[i];
            if (stat instanceof AST_LoopControl) {
                var lct = compressor.loopcontrol_target(stat);
                if (stat instanceof AST_Break
                    && !(lct instanceof AST_IterationStatement)
                    && loop_body(lct) === self
                    || stat instanceof AST_Continue
                    && loop_body(lct) === self) {
                    if (stat.label) {
                        remove(stat.label.thedef.references, stat);
                    }
                } else {
                    statements[n++] = stat;
                }
            } else {
                statements[n++] = stat;
            }
            if (aborts(stat)) {
                has_quit = statements.slice(i + 1);
                break;
            }
        }
        statements.length = n;
        CHANGED = n != len;
        if (has_quit)
            has_quit.forEach(function (stat) {
                trim_unreachable_code(compressor, stat, statements);
            });
    }

    function declarations_only(node) {
        return node.definitions.every((var_def) => !var_def.value);
    }

    function sequencesize(statements, compressor) {
        if (statements.length < 2)
            return;
        var seq = [], n = 0;
        function push_seq() {
            if (!seq.length)
                return;
            var body = make_sequence(seq[0], seq);
            statements[n++] = make_node(AST_SimpleStatement, body, { body: body });
            seq = [];
        }
        for (var i = 0, len = statements.length; i < len; i++) {
            var stat = statements[i];
            if (stat instanceof AST_SimpleStatement) {
                if (seq.length >= compressor.sequences_limit)
                    push_seq();
                var body = stat.body;
                if (seq.length > 0)
                    body = body.drop_side_effect_free(compressor);
                if (body)
                    merge_sequence(seq, body);
            } else if (stat instanceof AST_Definitions && declarations_only(stat)
                || stat instanceof AST_Defun) {
                statements[n++] = stat;
            } else {
                push_seq();
                statements[n++] = stat;
            }
        }
        push_seq();
        statements.length = n;
        if (n != len)
            CHANGED = true;
    }

    function to_simple_statement(block, decls) {
        if (!(block instanceof AST_BlockStatement))
            return block;
        var stat = null;
        for (var i = 0, len = block.body.length; i < len; i++) {
            var line = block.body[i];
            if (line instanceof AST_Var && declarations_only(line)) {
                decls.push(line);
            } else if (stat || line instanceof AST_Const || line instanceof AST_Let) {
                return false;
            } else {
                stat = line;
            }
        }
        return stat;
    }

    function sequencesize_2(statements, compressor) {
        function cons_seq(right) {
            n--;
            CHANGED = true;
            var left = prev.body;
            return make_sequence(left, [left, right]).transform(compressor);
        }
        var n = 0, prev;
        for (var i = 0; i < statements.length; i++) {
            var stat = statements[i];
            if (prev) {
                if (stat instanceof AST_Exit) {
                    stat.value = cons_seq(stat.value || make_node(AST_Undefined, stat).transform(compressor));
                } else if (stat instanceof AST_For) {
                    if (!(stat.init instanceof AST_Definitions)) {
                        const abort = walk(prev.body, node => {
                            if (node instanceof AST_Scope)
                                return true;
                            if (node instanceof AST_Binary
                                && node.operator === "in") {
                                return walk_abort;
                            }
                        });
                        if (!abort) {
                            if (stat.init)
                                stat.init = cons_seq(stat.init);
                            else {
                                stat.init = prev.body;
                                n--;
                                CHANGED = true;
                            }
                        }
                    }
                } else if (stat instanceof AST_ForIn) {
                    if (!(stat.init instanceof AST_Const) && !(stat.init instanceof AST_Let)) {
                        stat.object = cons_seq(stat.object);
                    }
                } else if (stat instanceof AST_If) {
                    stat.condition = cons_seq(stat.condition);
                } else if (stat instanceof AST_Switch) {
                    stat.expression = cons_seq(stat.expression);
                } else if (stat instanceof AST_With) {
                    stat.expression = cons_seq(stat.expression);
                }
            }
            if (compressor.option("conditionals") && stat instanceof AST_If) {
                var decls = [];
                var body = to_simple_statement(stat.body, decls);
                var alt = to_simple_statement(stat.alternative, decls);
                if (body !== false && alt !== false && decls.length > 0) {
                    var len = decls.length;
                    decls.push(make_node(AST_If, stat, {
                        condition: stat.condition,
                        body: body || make_node(AST_EmptyStatement, stat.body),
                        alternative: alt
                    }));
                    decls.unshift(n, 1);
                    [].splice.apply(statements, decls);
                    i += len;
                    n += len + 1;
                    prev = null;
                    CHANGED = true;
                    continue;
                }
            }
            statements[n++] = stat;
            prev = stat instanceof AST_SimpleStatement ? stat : null;
        }
        statements.length = n;
    }

    function join_object_assignments(defn, body) {
        if (!(defn instanceof AST_Definitions))
            return;
        var def = defn.definitions[defn.definitions.length - 1];
        if (!(def.value instanceof AST_Object))
            return;
        var exprs;
        if (body instanceof AST_Assign && !body.logical) {
            exprs = [body];
        } else if (body instanceof AST_Sequence) {
            exprs = body.expressions.slice();
        }
        if (!exprs)
            return;
        var trimmed = false;
        do {
            var node = exprs[0];
            if (!(node instanceof AST_Assign))
                break;
            if (node.operator != "=")
                break;
            if (!(node.left instanceof AST_PropAccess))
                break;
            var sym = node.left.expression;
            if (!(sym instanceof AST_SymbolRef))
                break;
            if (def.name.name != sym.name)
                break;
            if (!node.right.is_constant_expression(nearest_scope))
                break;
            var prop = node.left.property;
            if (prop instanceof AST_Node) {
                prop = prop.evaluate(compressor);
            }
            if (prop instanceof AST_Node)
                break;
            prop = "" + prop;
            var diff = compressor.option("ecma") < 2015
                && compressor.has_directive("use strict") ? function (node) {
                    return node.key != prop && (node.key && node.key.name != prop);
                } : function (node) {
                    return node.key && node.key.name != prop;
                };
            if (!def.value.properties.every(diff))
                break;
            var p = def.value.properties.filter(function (p) { return p.key === prop; })[0];
            if (!p) {
                def.value.properties.push(make_node(AST_ObjectKeyVal, node, {
                    key: prop,
                    value: node.right
                }));
            } else {
                p.value = new AST_Sequence({
                    start: p.start,
                    expressions: [p.value.clone(), node.right.clone()],
                    end: p.end
                });
            }
            exprs.shift();
            trimmed = true;
        } while (exprs.length);
        return trimmed && exprs;
    }

    function join_consecutive_vars(statements) {
        var defs;
        for (var i = 0, j = -1, len = statements.length; i < len; i++) {
            var stat = statements[i];
            var prev = statements[j];
            if (stat instanceof AST_Definitions) {
                if (prev && prev.TYPE == stat.TYPE) {
                    prev.definitions = prev.definitions.concat(stat.definitions);
                    CHANGED = true;
                } else if (defs && defs.TYPE == stat.TYPE && declarations_only(stat)) {
                    defs.definitions = defs.definitions.concat(stat.definitions);
                    CHANGED = true;
                } else {
                    statements[++j] = stat;
                    defs = stat;
                }
            } else if (stat instanceof AST_Exit) {
                stat.value = extract_object_assignments(stat.value);
            } else if (stat instanceof AST_For) {
                var exprs = join_object_assignments(prev, stat.init);
                if (exprs) {
                    CHANGED = true;
                    stat.init = exprs.length ? make_sequence(stat.init, exprs) : null;
                    statements[++j] = stat;
                } else if (
                    prev instanceof AST_Var
                    && (!stat.init || stat.init.TYPE == prev.TYPE)
                ) {
                    if (stat.init) {
                        prev.definitions = prev.definitions.concat(stat.init.definitions);
                    }
                    stat.init = prev;
                    statements[j] = stat;
                    CHANGED = true;
                } else if (
                    defs instanceof AST_Var
                    && stat.init instanceof AST_Var
                    && declarations_only(stat.init)
                ) {
                    defs.definitions = defs.definitions.concat(stat.init.definitions);
                    stat.init = null;
                    statements[++j] = stat;
                    CHANGED = true;
                } else {
                    statements[++j] = stat;
                }
            } else if (stat instanceof AST_ForIn) {
                stat.object = extract_object_assignments(stat.object);
            } else if (stat instanceof AST_If) {
                stat.condition = extract_object_assignments(stat.condition);
            } else if (stat instanceof AST_SimpleStatement) {
                var exprs = join_object_assignments(prev, stat.body);
                if (exprs) {
                    CHANGED = true;
                    if (!exprs.length)
                        continue;
                    stat.body = make_sequence(stat.body, exprs);
                }
                statements[++j] = stat;
            } else if (stat instanceof AST_Switch) {
                stat.expression = extract_object_assignments(stat.expression);
            } else if (stat instanceof AST_With) {
                stat.expression = extract_object_assignments(stat.expression);
            } else {
                statements[++j] = stat;
            }
        }
        statements.length = j + 1;

        function extract_object_assignments(value) {
            statements[++j] = stat;
            var exprs = join_object_assignments(prev, value);
            if (exprs) {
                CHANGED = true;
                if (exprs.length) {
                    return make_sequence(value, exprs);
                } else if (value instanceof AST_Sequence) {
                    return value.tail_node().left;
                } else {
                    return value.left;
                }
            }
            return value;
        }
    }
}

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

/**
 * Module that contains the inlining logic.
 *
 * @module
 *
 * The stars of the show are `inline_into_symbolref` and `inline_into_call`.
 */

function within_array_or_object_literal(compressor) {
    var node, level = 0;
    while (node = compressor.parent(level++)) {
        if (node instanceof AST_Statement) return false;
        if (node instanceof AST_Array
            || node instanceof AST_ObjectKeyVal
            || node instanceof AST_Object) {
            return true;
        }
    }
    return false;
}

function scope_encloses_variables_in_this_scope(scope, pulled_scope) {
    for (const enclosed of pulled_scope.enclosed) {
        if (pulled_scope.variables.has(enclosed.name)) {
            continue;
        }
        const looked_up = scope.find_variable(enclosed.name);
        if (looked_up) {
            if (looked_up === enclosed) continue;
            return true;
        }
    }
    return false;
}

/**
 * An extra check function for `top_retain` option, compare the length of const identifier
 * and init value length and return true if init value is longer than identifier. for example:
 * ```
 * // top_retain: ["example"]
 * const example = 100
 * ```
 * it will return false because length of "100" is short than identifier "example".
 */
function is_const_symbol_short_than_init_value(def, fixed_value) {
    if (def.orig.length === 1 && fixed_value) {
        const init_value_length = fixed_value.size();
        const identifer_length = def.name.length;
        return init_value_length > identifer_length;
    }
    return true;
}

function inline_into_symbolref(self, compressor) {
    const parent = compressor.parent();
    const def = self.definition();
    const nearest_scope = compressor.find_scope();
    let fixed = self.fixed_value();
    if (
        compressor.top_retain &&
        def.global && 
        compressor.top_retain(def) && 
        // when identifier is in top_retain option dose not mean we can always inline it.
        // if identifier name is longer then init value, we can replace it.
        is_const_symbol_short_than_init_value(def, fixed)
    ) {
        // keep it
        def.fixed = false;
        def.single_use = false;
        return self;
    }

    let single_use = def.single_use
        && !(parent instanceof AST_Call
            && (parent.is_callee_pure(compressor))
                || has_annotation(parent, _NOINLINE))
        && !(parent instanceof AST_Export
            && fixed instanceof AST_Lambda
            && fixed.name);

    if (single_use && fixed instanceof AST_Node) {
        single_use =
            !fixed.has_side_effects(compressor)
            && !fixed.may_throw(compressor);
    }

    if (fixed instanceof AST_Class && def.scope !== self.scope) {
        return self;
    }

    if (single_use && (fixed instanceof AST_Lambda || fixed instanceof AST_Class)) {
        if (retain_top_func(fixed, compressor)) {
            single_use = false;
        } else if (def.scope !== self.scope
            && (def.escaped == 1
                || has_flag(fixed, INLINED)
                || within_array_or_object_literal(compressor)
                || !compressor.option("reduce_funcs"))) {
            single_use = false;
        } else if (is_recursive_ref(compressor, def)) {
            single_use = false;
        } else if (def.scope !== self.scope || def.orig[0] instanceof AST_SymbolFunarg) {
            single_use = fixed.is_constant_expression(self.scope);
            if (single_use == "f") {
                var scope = self.scope;
                do {
                    if (scope instanceof AST_Defun || is_func_expr(scope)) {
                        set_flag(scope, INLINED);
                    }
                } while (scope = scope.parent_scope);
            }
        }
    }

    if (single_use && (fixed instanceof AST_Lambda || fixed instanceof AST_Class)) {
        single_use =
            def.scope === self.scope
                && !scope_encloses_variables_in_this_scope(nearest_scope, fixed)
            || parent instanceof AST_Call
                && parent.expression === self
                && !scope_encloses_variables_in_this_scope(nearest_scope, fixed)
                && !(fixed.name && fixed.name.definition().recursive_refs > 0);
    }

    if (single_use && fixed) {
        if (fixed instanceof AST_DefClass) {
            set_flag(fixed, SQUEEZED);
            fixed = make_node(AST_ClassExpression, fixed, fixed);
        }
        if (fixed instanceof AST_Defun) {
            set_flag(fixed, SQUEEZED);
            fixed = make_node(AST_Function, fixed, fixed);
        }
        if (def.recursive_refs > 0 && fixed.name instanceof AST_SymbolDefun) {
            const defun_def = fixed.name.definition();
            let lambda_def = fixed.variables.get(fixed.name.name);
            let name = lambda_def && lambda_def.orig[0];
            if (!(name instanceof AST_SymbolLambda)) {
                name = make_node(AST_SymbolLambda, fixed.name, fixed.name);
                name.scope = fixed;
                fixed.name = name;
                lambda_def = fixed.def_function(name);
            }
            walk(fixed, node => {
                if (node instanceof AST_SymbolRef && node.definition() === defun_def) {
                    node.thedef = lambda_def;
                    lambda_def.references.push(node);
                }
            });
        }
        if (
            (fixed instanceof AST_Lambda || fixed instanceof AST_Class)
            && fixed.parent_scope !== nearest_scope
        ) {
            fixed = fixed.clone(true, compressor.get_toplevel());

            nearest_scope.add_child_scope(fixed);
        }
        return fixed.optimize(compressor);
    }

    // multiple uses
    if (fixed) {
        let replace;

        if (fixed instanceof AST_This) {
            if (!(def.orig[0] instanceof AST_SymbolFunarg)
                && def.references.every((ref) =>
                    def.scope === ref.scope
                )) {
                replace = fixed;
            }
        } else {
            var ev = fixed.evaluate(compressor);
            if (
                ev !== fixed
                && (compressor.option("unsafe_regexp") || !(ev instanceof RegExp))
            ) {
                replace = make_node_from_constant(ev, fixed);
            }
        }

        if (replace) {
            const name_length = self.size(compressor);
            const replace_size = replace.size(compressor);

            let overhead = 0;
            if (compressor.option("unused") && !compressor.exposed(def)) {
                overhead =
                    (name_length + 2 + replace_size) /
                    (def.references.length - def.assignments);
            }

            if (replace_size <= name_length + overhead) {
                return replace;
            }
        }
    }

    return self;
}

function inline_into_call(self, compressor) {
    var exp = self.expression;
    var fn = exp;
    var simple_args = self.args.every((arg) => !(arg instanceof AST_Expansion));

    if (compressor.option("reduce_vars")
        && fn instanceof AST_SymbolRef
        && !has_annotation(self, _NOINLINE)
    ) {
        const fixed = fn.fixed_value();

        if (
            retain_top_func(fixed, compressor)
            || !compressor.toplevel.funcs && exp.definition().global
        ) {
            return self;
        }

        fn = fixed;
    }

    var is_func = fn instanceof AST_Lambda;

    var stat = is_func && fn.body[0];
    var is_regular_func = is_func && !fn.is_generator && !fn.async;
    var can_inline = is_regular_func && compressor.option("inline") && !self.is_callee_pure(compressor);
    if (can_inline && stat instanceof AST_Return) {
        let returned = stat.value;
        if (!returned || returned.is_constant_expression()) {
            if (returned) {
                returned = returned.clone(true);
            } else {
                returned = make_node(AST_Undefined, self);
            }
            const args = self.args.concat(returned);
            return make_sequence(self, args).optimize(compressor);
        }

        // optimize identity function
        if (
            fn.argnames.length === 1
            && (fn.argnames[0] instanceof AST_SymbolFunarg)
            && self.args.length < 2
            && !(self.args[0] instanceof AST_Expansion)
            && returned instanceof AST_SymbolRef
            && returned.name === fn.argnames[0].name
        ) {
            const replacement =
                (self.args[0] || make_node(AST_Undefined)).optimize(compressor);

            let parent;
            if (
                replacement instanceof AST_PropAccess
                && (parent = compressor.parent()) instanceof AST_Call
                && parent.expression === self
            ) {
                // identity function was being used to remove `this`, like in
                //
                // id(bag.no_this)(...)
                //
                // Replace with a larger but more effish (0, bag.no_this) wrapper.

                return make_sequence(self, [
                    make_node(AST_Number, self, { value: 0 }),
                    replacement
                ]);
            }
            // replace call with first argument or undefined if none passed
            return replacement;
        }
    }

    if (can_inline) {
        var scope, in_loop, level = -1;
        let def;
        let returned_value;
        let nearest_scope;
        if (simple_args
            && !fn.uses_arguments
            && !(compressor.parent() instanceof AST_Class)
            && !(fn.name && fn instanceof AST_Function)
            && (returned_value = can_flatten_body(stat))
            && (exp === fn
                || has_annotation(self, _INLINE)
                || compressor.option("unused")
                    && (def = exp.definition()).references.length == 1
                    && !is_recursive_ref(compressor, def)
                    && fn.is_constant_expression(exp.scope))
            && !has_annotation(self, _PURE | _NOINLINE)
            && !fn.contains_this()
            && can_inject_symbols()
            && (nearest_scope = compressor.find_scope())
            && !scope_encloses_variables_in_this_scope(nearest_scope, fn)
            && !(function in_default_assign() {
                    // Due to the fact function parameters have their own scope
                    // which can't use `var something` in the function body within,
                    // we simply don't inline into DefaultAssign.
                    let i = 0;
                    let p;
                    while ((p = compressor.parent(i++))) {
                        if (p instanceof AST_DefaultAssign) return true;
                        if (p instanceof AST_Block) break;
                    }
                    return false;
                })()
            && !(scope instanceof AST_Class)
        ) {
            set_flag(fn, SQUEEZED);
            nearest_scope.add_child_scope(fn);
            return make_sequence(self, flatten_fn(returned_value)).optimize(compressor);
        }
    }

    if (can_inline && has_annotation(self, _INLINE)) {
        set_flag(fn, SQUEEZED);
        fn = make_node(fn.CTOR === AST_Defun ? AST_Function : fn.CTOR, fn, fn);
        fn = fn.clone(true);
        fn.figure_out_scope({}, {
            parent_scope: compressor.find_scope(),
            toplevel: compressor.get_toplevel()
        });

        return make_node(AST_Call, self, {
            expression: fn,
            args: self.args,
        }).optimize(compressor);
    }

    const can_drop_this_call = is_regular_func && compressor.option("side_effects") && fn.body.every(is_empty);
    if (can_drop_this_call) {
        var args = self.args.concat(make_node(AST_Undefined, self));
        return make_sequence(self, args).optimize(compressor);
    }

    if (compressor.option("negate_iife")
        && compressor.parent() instanceof AST_SimpleStatement
        && is_iife_call(self)) {
        return self.negate(compressor, true);
    }

    var ev = self.evaluate(compressor);
    if (ev !== self) {
        ev = make_node_from_constant(ev, self).optimize(compressor);
        return best_of(compressor, ev, self);
    }

    return self;

    function return_value(stat) {
        if (!stat) return make_node(AST_Undefined, self);
        if (stat instanceof AST_Return) {
            if (!stat.value) return make_node(AST_Undefined, self);
            return stat.value.clone(true);
        }
        if (stat instanceof AST_SimpleStatement) {
            return make_node(AST_UnaryPrefix, stat, {
                operator: "void",
                expression: stat.body.clone(true)
            });
        }
    }

    function can_flatten_body(stat) {
        var body = fn.body;
        var len = body.length;
        if (compressor.option("inline") < 3) {
            return len == 1 && return_value(stat);
        }
        stat = null;
        for (var i = 0; i < len; i++) {
            var line = body[i];
            if (line instanceof AST_Var) {
                if (stat && !line.definitions.every((var_def) =>
                    !var_def.value
                )) {
                    return false;
                }
            } else if (stat) {
                return false;
            } else if (!(line instanceof AST_EmptyStatement)) {
                stat = line;
            }
        }
        return return_value(stat);
    }

    function can_inject_args(block_scoped, safe_to_inject) {
        for (var i = 0, len = fn.argnames.length; i < len; i++) {
            var arg = fn.argnames[i];
            if (arg instanceof AST_DefaultAssign) {
                if (has_flag(arg.left, UNUSED)) continue;
                return false;
            }
            if (arg instanceof AST_Destructuring) return false;
            if (arg instanceof AST_Expansion) {
                if (has_flag(arg.expression, UNUSED)) continue;
                return false;
            }
            if (has_flag(arg, UNUSED)) continue;
            if (!safe_to_inject
                || block_scoped.has(arg.name)
                || identifier_atom.has(arg.name)
                || scope.conflicting_def(arg.name)) {
                return false;
            }
            if (in_loop) in_loop.push(arg.definition());
        }
        return true;
    }

    function can_inject_vars(block_scoped, safe_to_inject) {
        var len = fn.body.length;
        for (var i = 0; i < len; i++) {
            var stat = fn.body[i];
            if (!(stat instanceof AST_Var)) continue;
            if (!safe_to_inject) return false;
            for (var j = stat.definitions.length; --j >= 0;) {
                var name = stat.definitions[j].name;
                if (name instanceof AST_Destructuring
                    || block_scoped.has(name.name)
                    || identifier_atom.has(name.name)
                    || scope.conflicting_def(name.name)) {
                    return false;
                }
                if (in_loop) in_loop.push(name.definition());
            }
        }
        return true;
    }

    function can_inject_symbols() {
        var block_scoped = new Set();
        do {
            scope = compressor.parent(++level);
            if (scope.is_block_scope() && scope.block_scope) {
                // TODO this is sometimes undefined during compression.
                // But it should always have a value!
                scope.block_scope.variables.forEach(function (variable) {
                    block_scoped.add(variable.name);
                });
            }
            if (scope instanceof AST_Catch) {
                // TODO can we delete? AST_Catch is a block scope.
                if (scope.argname) {
                    block_scoped.add(scope.argname.name);
                }
            } else if (scope instanceof AST_IterationStatement) {
                in_loop = [];
            } else if (scope instanceof AST_SymbolRef) {
                if (scope.fixed_value() instanceof AST_Scope) return false;
            }
        } while (!(scope instanceof AST_Scope));

        var safe_to_inject = !(scope instanceof AST_Toplevel) || compressor.toplevel.vars;
        var inline = compressor.option("inline");
        if (!can_inject_vars(block_scoped, inline >= 3 && safe_to_inject)) return false;
        if (!can_inject_args(block_scoped, inline >= 2 && safe_to_inject)) return false;
        return !in_loop || in_loop.length == 0 || !is_reachable(fn, in_loop);
    }

    function append_var(decls, expressions, name, value) {
        var def = name.definition();

        // Name already exists, only when a function argument had the same name
        const already_appended = scope.variables.has(name.name);
        if (!already_appended) {
            scope.variables.set(name.name, def);
            scope.enclosed.push(def);
            decls.push(make_node(AST_VarDef, name, {
                name: name,
                value: null
            }));
        }

        var sym = make_node(AST_SymbolRef, name, name);
        def.references.push(sym);
        if (value) expressions.push(make_node(AST_Assign, self, {
            operator: "=",
            logical: false,
            left: sym,
            right: value.clone()
        }));
    }

    function flatten_args(decls, expressions) {
        var len = fn.argnames.length;
        for (var i = self.args.length; --i >= len;) {
            expressions.push(self.args[i]);
        }
        for (i = len; --i >= 0;) {
            var name = fn.argnames[i];
            var value = self.args[i];
            if (has_flag(name, UNUSED) || !name.name || scope.conflicting_def(name.name)) {
                if (value) expressions.push(value);
            } else {
                var symbol = make_node(AST_SymbolVar, name, name);
                name.definition().orig.push(symbol);
                if (!value && in_loop) value = make_node(AST_Undefined, self);
                append_var(decls, expressions, symbol, value);
            }
        }
        decls.reverse();
        expressions.reverse();
    }

    function flatten_vars(decls, expressions) {
        var pos = expressions.length;
        for (var i = 0, lines = fn.body.length; i < lines; i++) {
            var stat = fn.body[i];
            if (!(stat instanceof AST_Var)) continue;
            for (var j = 0, defs = stat.definitions.length; j < defs; j++) {
                var var_def = stat.definitions[j];
                var name = var_def.name;
                append_var(decls, expressions, name, var_def.value);
                if (in_loop && fn.argnames.every((argname) =>
                    argname.name != name.name
                )) {
                    var def = fn.variables.get(name.name);
                    var sym = make_node(AST_SymbolRef, name, name);
                    def.references.push(sym);
                    expressions.splice(pos++, 0, make_node(AST_Assign, var_def, {
                        operator: "=",
                        logical: false,
                        left: sym,
                        right: make_node(AST_Undefined, name)
                    }));
                }
            }
        }
    }

    function flatten_fn(returned_value) {
        var decls = [];
        var expressions = [];
        flatten_args(decls, expressions);
        flatten_vars(decls, expressions);
        expressions.push(returned_value);

        if (decls.length) {
            const i = scope.body.indexOf(compressor.parent(level - 1)) + 1;
            scope.body.splice(i, 0, make_node(AST_Var, fn, {
                definitions: decls
            }));
        }

        return expressions.map(exp => exp.clone(true));
    }
}

(function(def_find_defs) {
    function to_node(value, orig) {
        if (value instanceof AST_Node) {
            if (!(value instanceof AST_Constant)) {
                // Value may be a function, an array including functions and even a complex assign / block expression,
                // so it should never be shared in different places.
                // Otherwise wrong information may be used in the compression phase
                value = value.clone(true);
            }
            return make_node(value.CTOR, orig, value);
        }
        if (Array.isArray(value)) return make_node(AST_Array, orig, {
            elements: value.map(function(value) {
                return to_node(value, orig);
            })
        });
        if (value && typeof value == "object") {
            var props = [];
            for (var key in value) if (HOP(value, key)) {
                props.push(make_node(AST_ObjectKeyVal, orig, {
                    key: key,
                    value: to_node(value[key], orig)
                }));
            }
            return make_node(AST_Object, orig, {
                properties: props
            });
        }
        return make_node_from_constant(value, orig);
    }

    AST_Toplevel.DEFMETHOD("resolve_defines", function(compressor) {
        if (!compressor.option("global_defs")) return this;
        this.figure_out_scope({ ie8: compressor.option("ie8") });
        return this.transform(new TreeTransformer(function(node) {
            var def = node._find_defs(compressor, "");
            if (!def) return;
            var level = 0, child = node, parent;
            while (parent = this.parent(level++)) {
                if (!(parent instanceof AST_PropAccess)) break;
                if (parent.expression !== child) break;
                child = parent;
            }
            if (is_lhs(child, parent)) {
                return;
            }
            return def;
        }));
    });
    def_find_defs(AST_Node, noop);
    def_find_defs(AST_Chain, function(compressor, suffix) {
        return this.expression._find_defs(compressor, suffix);
    });
    def_find_defs(AST_Dot, function(compressor, suffix) {
        return this.expression._find_defs(compressor, "." + this.property + suffix);
    });
    def_find_defs(AST_SymbolDeclaration, function() {
        if (!this.global()) return;
    });
    def_find_defs(AST_SymbolRef, function(compressor, suffix) {
        if (!this.global()) return;
        var defines = compressor.option("global_defs");
        var name = this.name + suffix;
        if (HOP(defines, name)) return to_node(defines[name], this);
    });
    def_find_defs(AST_ImportMeta, function(compressor, suffix) {
        var defines = compressor.option("global_defs");
        var name = "import.meta" + suffix;
        if (HOP(defines, name)) return to_node(defines[name], this);
    });
})(function(node, func) {
    node.DEFMETHOD("_find_defs", func);
});

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

class Compressor extends TreeWalker {
    constructor(options, { false_by_default = false, mangle_options = false }) {
        super();
        if (options.defaults !== undefined && !options.defaults) false_by_default = true;
        this.options = defaults(options, {
            arguments     : false,
            arrows        : !false_by_default,
            booleans      : !false_by_default,
            booleans_as_integers : false,
            collapse_vars : !false_by_default,
            comparisons   : !false_by_default,
            computed_props: !false_by_default,
            conditionals  : !false_by_default,
            dead_code     : !false_by_default,
            defaults      : true,
            directives    : !false_by_default,
            drop_console  : false,
            drop_debugger : !false_by_default,
            ecma          : 5,
            evaluate      : !false_by_default,
            expression    : false,
            global_defs   : false,
            hoist_funs    : false,
            hoist_props   : !false_by_default,
            hoist_vars    : false,
            ie8           : false,
            if_return     : !false_by_default,
            inline        : !false_by_default,
            join_vars     : !false_by_default,
            keep_classnames: false,
            keep_fargs    : true,
            keep_fnames   : false,
            keep_infinity : false,
            lhs_constants : !false_by_default,
            loops         : !false_by_default,
            module        : false,
            negate_iife   : !false_by_default,
            passes        : 1,
            properties    : !false_by_default,
            pure_getters  : !false_by_default && "strict",
            pure_funcs    : null,
            pure_new      : false,
            reduce_funcs  : !false_by_default,
            reduce_vars   : !false_by_default,
            sequences     : !false_by_default,
            side_effects  : !false_by_default,
            switches      : !false_by_default,
            top_retain    : null,
            toplevel      : !!(options && options["top_retain"]),
            typeofs       : !false_by_default,
            unsafe        : false,
            unsafe_arrows : false,
            unsafe_comps  : false,
            unsafe_Function: false,
            unsafe_math   : false,
            unsafe_symbols: false,
            unsafe_methods: false,
            unsafe_proto  : false,
            unsafe_regexp : false,
            unsafe_undefined: false,
            unused        : !false_by_default,
            warnings      : false  // legacy
        }, true);
        var global_defs = this.options["global_defs"];
        if (typeof global_defs == "object") for (var key in global_defs) {
            if (key[0] === "@" && HOP(global_defs, key)) {
                global_defs[key.slice(1)] = parse(global_defs[key], {
                    expression: true
                });
            }
        }
        if (this.options["inline"] === true) this.options["inline"] = 3;
        var pure_funcs = this.options["pure_funcs"];
        if (typeof pure_funcs == "function") {
            this.pure_funcs = pure_funcs;
        } else {
            this.pure_funcs = pure_funcs ? function(node) {
                return !pure_funcs.includes(node.expression.print_to_string());
            } : return_true;
        }
        var top_retain = this.options["top_retain"];
        if (top_retain instanceof RegExp) {
            this.top_retain = function(def) {
                return top_retain.test(def.name);
            };
        } else if (typeof top_retain == "function") {
            this.top_retain = top_retain;
        } else if (top_retain) {
            if (typeof top_retain == "string") {
                top_retain = top_retain.split(/,/);
            }
            this.top_retain = function(def) {
                return top_retain.includes(def.name);
            };
        }
        if (this.options["module"]) {
            this.directives["use strict"] = true;
            this.options["toplevel"] = true;
        }
        var toplevel = this.options["toplevel"];
        this.toplevel = typeof toplevel == "string" ? {
            funcs: /funcs/.test(toplevel),
            vars: /vars/.test(toplevel)
        } : {
            funcs: toplevel,
            vars: toplevel
        };
        var sequences = this.options["sequences"];
        this.sequences_limit = sequences == 1 ? 800 : sequences | 0;
        this.evaluated_regexps = new Map();
        this._toplevel = undefined;
        this._mangle_options = mangle_options
            ? format_mangler_options(mangle_options)
            : mangle_options;
    }

    mangle_options() {
        var nth_identifier = this._mangle_options && this._mangle_options.nth_identifier || base54;
        var module = this._mangle_options && this._mangle_options.module || this.option("module");
        return { ie8: this.option("ie8"), nth_identifier, module };
    }

    option(key) {
        return this.options[key];
    }

    exposed(def) {
        if (def.export) return true;
        if (def.global) for (var i = 0, len = def.orig.length; i < len; i++)
            if (!this.toplevel[def.orig[i] instanceof AST_SymbolDefun ? "funcs" : "vars"])
                return true;
        return false;
    }

    in_boolean_context() {
        if (!this.option("booleans")) return false;
        var self = this.self();
        for (var i = 0, p; p = this.parent(i); i++) {
            if (p instanceof AST_SimpleStatement
                || p instanceof AST_Conditional && p.condition === self
                || p instanceof AST_DWLoop && p.condition === self
                || p instanceof AST_For && p.condition === self
                || p instanceof AST_If && p.condition === self
                || p instanceof AST_UnaryPrefix && p.operator == "!" && p.expression === self) {
                return true;
            }
            if (
                p instanceof AST_Binary
                    && (
                        p.operator == "&&"
                        || p.operator == "||"
                        || p.operator == "??"
                    )
                || p instanceof AST_Conditional
                || p.tail_node() === self
            ) {
                self = p;
            } else {
                return false;
            }
        }
    }

    in_32_bit_context() {
        if (!this.option("evaluate")) return false;
        var self = this.self();
        for (var i = 0, p; p = this.parent(i); i++) {
            if (p instanceof AST_Binary && bitwise_binop.has(p.operator)) {
                return true;
            }
            if (p instanceof AST_UnaryPrefix) {
                return p.operator === "~";
            }
            if (
                p instanceof AST_Binary
                    && (
                        p.operator == "&&"
                        || p.operator == "||"
                        || p.operator == "??"
                    )
                || p instanceof AST_Conditional && p.condition !== self
                || p.tail_node() === self
            ) {
                self = p;
            } else {
                return false;
            }
        }
    }

    get_toplevel() {
        return this._toplevel;
    }

    compress(toplevel) {
        toplevel = toplevel.resolve_defines(this);
        this._toplevel = toplevel;
        if (this.option("expression")) {
            this._toplevel.process_expression(true);
        }
        var passes = +this.options.passes || 1;
        var min_count = 1 / 0;
        var stopping = false;
        var mangle = this.mangle_options();
        for (var pass = 0; pass < passes; pass++) {
            this._toplevel.figure_out_scope(mangle);
            if (pass === 0 && this.option("drop_console")) {
                // must be run before reduce_vars and compress pass
                this._toplevel = this._toplevel.drop_console(this.option("drop_console"));
            }
            if (pass > 0 || this.option("reduce_vars")) {
                this._toplevel.reset_opt_flags(this);
            }
            this._toplevel = this._toplevel.transform(this);
            if (passes > 1) {
                let count = 0;
                walk(this._toplevel, () => { count++; });
                if (count < min_count) {
                    min_count = count;
                    stopping = false;
                } else if (stopping) {
                    break;
                } else {
                    stopping = true;
                }
            }
        }
        if (this.option("expression")) {
            this._toplevel.process_expression(false);
        }
        toplevel = this._toplevel;
        this._toplevel = undefined;
        return toplevel;
    }

    before(node, descend) {
        if (has_flag(node, SQUEEZED)) return node;
        var was_scope = false;
        if (node instanceof AST_Scope) {
            node = node.hoist_properties(this);
            node = node.hoist_declarations(this);
            was_scope = true;
        }
        // Before https://github.com/mishoo/UglifyJS2/pull/1602 AST_Node.optimize()
        // would call AST_Node.transform() if a different instance of AST_Node is
        // produced after def_optimize().
        // This corrupts TreeWalker.stack, which cause AST look-ups to malfunction.
        // Migrate and defer all children's AST_Node.transform() to below, which
        // will now happen after this parent AST_Node has been properly substituted
        // thus gives a consistent AST snapshot.
        descend(node, this);
        // Existing code relies on how AST_Node.optimize() worked, and omitting the
        // following replacement call would result in degraded efficiency of both
        // output and performance.
        descend(node, this);
        var opt = node.optimize(this);
        if (was_scope && opt instanceof AST_Scope) {
            opt.drop_unused(this);
            descend(opt, this);
        }
        if (opt === node) set_flag(opt, SQUEEZED);
        return opt;
    }

    /** Alternative to plain is_lhs() which doesn't work within .optimize() */
    is_lhs() {
        const self = this.stack[this.stack.length - 1];
        const parent = this.stack[this.stack.length - 2];
        return is_lhs(self, parent);
    }
}

function def_optimize(node, optimizer) {
    node.DEFMETHOD("optimize", function(compressor) {
        var self = this;
        if (has_flag(self, OPTIMIZED)) return self;
        if (compressor.has_directive("use asm")) return self;
        var opt = optimizer(self, compressor);
        set_flag(opt, OPTIMIZED);
        return opt;
    });
}

def_optimize(AST_Node, function(self) {
    return self;
});

AST_Toplevel.DEFMETHOD("drop_console", function(options) {
    var isArray = Array.isArray(options);

    return this.transform(new TreeTransformer(function(self) {
        if (self.TYPE !== "Call") {
            return;
        }

        var exp = self.expression;

        if (!(exp instanceof AST_PropAccess)) {
            return;
        }

        if (isArray && options.indexOf(exp.property) === -1) {
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
        return make_node(AST_EmptyStatement, self);
    }
    return self;
});

def_optimize(AST_Debugger, function(self, compressor) {
    if (compressor.option("drop_debugger"))
        return make_node(AST_EmptyStatement, self);
    return self;
});

def_optimize(AST_LabeledStatement, function(self, compressor) {
    if (self.body instanceof AST_Break
        && compressor.loopcontrol_target(self.body) === self.body) {
        return make_node(AST_EmptyStatement, self);
    }
    return self.label.references.length == 0 ? self.body : self;
});

def_optimize(AST_Block, function(self, compressor) {
    tighten_body(self.body, compressor);
    return self;
});

function can_be_extracted_from_if_block(node) {
    return !(
        node instanceof AST_Const
        || node instanceof AST_Let
        || node instanceof AST_Class
    );
}

def_optimize(AST_BlockStatement, function(self, compressor) {
    tighten_body(self.body, compressor);
    switch (self.body.length) {
      case 1:
        if (!compressor.has_directive("use strict")
            && compressor.parent() instanceof AST_If
            && can_be_extracted_from_if_block(self.body[0])
            || can_be_evicted_from_block(self.body[0])) {
            return self.body[0];
        }
        break;
      case 0: return make_node(AST_EmptyStatement, self);
    }
    return self;
});

function opt_AST_Lambda(self, compressor) {
    tighten_body(self.body, compressor);
    if (compressor.option("side_effects")
        && self.body.length == 1
        && self.body[0] === compressor.has_directive("use strict")) {
        self.body.length = 0;
    }
    return self;
}
def_optimize(AST_Lambda, opt_AST_Lambda);

AST_Scope.DEFMETHOD("hoist_declarations", function(compressor) {
    var self = this;
    if (compressor.has_directive("use asm")) return self;

    var hoist_funs = compressor.option("hoist_funs");
    var hoist_vars = compressor.option("hoist_vars");

    if (hoist_funs || hoist_vars) {
        var dirs = [];
        var hoisted = [];
        var vars = new Map(), vars_found = 0, var_decl = 0;
        // let's count var_decl first, we seem to waste a lot of
        // space if we hoist `var` when there's only one.
        walk(self, node => {
            if (node instanceof AST_Scope && node !== self)
                return true;
            if (node instanceof AST_Var) {
                ++var_decl;
                return true;
            }
        });
        hoist_vars = hoist_vars && var_decl > 1;
        var tt = new TreeTransformer(
            function before(node) {
                if (node !== self) {
                    if (node instanceof AST_Directive) {
                        dirs.push(node);
                        return make_node(AST_EmptyStatement, node);
                    }
                    if (hoist_funs && node instanceof AST_Defun
                        && !(tt.parent() instanceof AST_Export)
                        && tt.parent() === self) {
                        hoisted.push(node);
                        return make_node(AST_EmptyStatement, node);
                    }
                    if (
                        hoist_vars
                        && node instanceof AST_Var
                        && !node.definitions.some(def => def.name instanceof AST_Destructuring)
                    ) {
                        node.definitions.forEach(function(def) {
                            vars.set(def.name.name, def);
                            ++vars_found;
                        });
                        var seq = node.to_assignments(compressor);
                        var p = tt.parent();
                        if (p instanceof AST_ForIn && p.init === node) {
                            if (seq == null) {
                                var def = node.definitions[0].name;
                                return make_node(AST_SymbolRef, def, def);
                            }
                            return seq;
                        }
                        if (p instanceof AST_For && p.init === node) {
                            return seq;
                        }
                        if (!seq) return make_node(AST_EmptyStatement, node);
                        return make_node(AST_SimpleStatement, node, {
                            body: seq
                        });
                    }
                    if (node instanceof AST_Scope)
                        return node; // to avoid descending in nested scopes
                }
            }
        );
        self = self.transform(tt);
        if (vars_found > 0) {
            // collect only vars which don't show up in self's arguments list
            var defs = [];
            const is_lambda = self instanceof AST_Lambda;
            const args_as_names = is_lambda ? self.args_as_names() : null;
            vars.forEach((def, name) => {
                if (is_lambda && args_as_names.some((x) => x.name === def.name.name)) {
                    vars.delete(name);
                } else {
                    def = def.clone();
                    def.value = null;
                    defs.push(def);
                    vars.set(name, def);
                }
            });
            if (defs.length > 0) {
                // try to merge in assignments
                for (var i = 0; i < self.body.length;) {
                    if (self.body[i] instanceof AST_SimpleStatement) {
                        var expr = self.body[i].body, sym, assign;
                        if (expr instanceof AST_Assign
                            && expr.operator == "="
                            && (sym = expr.left) instanceof AST_Symbol
                            && vars.has(sym.name)
                        ) {
                            var def = vars.get(sym.name);
                            if (def.value) break;
                            def.value = expr.right;
                            remove(defs, def);
                            defs.push(def);
                            self.body.splice(i, 1);
                            continue;
                        }
                        if (expr instanceof AST_Sequence
                            && (assign = expr.expressions[0]) instanceof AST_Assign
                            && assign.operator == "="
                            && (sym = assign.left) instanceof AST_Symbol
                            && vars.has(sym.name)
                        ) {
                            var def = vars.get(sym.name);
                            if (def.value) break;
                            def.value = assign.right;
                            remove(defs, def);
                            defs.push(def);
                            self.body[i].body = make_sequence(expr, expr.expressions.slice(1));
                            continue;
                        }
                    }
                    if (self.body[i] instanceof AST_EmptyStatement) {
                        self.body.splice(i, 1);
                        continue;
                    }
                    if (self.body[i] instanceof AST_BlockStatement) {
                        self.body.splice(i, 1, ...self.body[i].body);
                        continue;
                    }
                    break;
                }
                defs = make_node(AST_Var, self, {
                    definitions: defs
                });
                hoisted.push(defs);
            }
        }
        self.body = dirs.concat(hoisted, self.body);
    }
    return self;
});

AST_Scope.DEFMETHOD("hoist_properties", function(compressor) {
    var self = this;
    if (!compressor.option("hoist_props") || compressor.has_directive("use asm")) return self;
    var top_retain = self instanceof AST_Toplevel && compressor.top_retain || return_false;
    var defs_by_id = new Map();
    var hoister = new TreeTransformer(function(node, descend) {
        if (node instanceof AST_VarDef) {
            const sym = node.name;
            let def;
            let value;
            if (sym.scope === self
                && (def = sym.definition()).escaped != 1
                && !def.assignments
                && !def.direct_access
                && !def.single_use
                && !compressor.exposed(def)
                && !top_retain(def)
                && (value = sym.fixed_value()) === node.value
                && value instanceof AST_Object
                && !value.properties.some(prop =>
                    prop instanceof AST_Expansion || prop.computed_key()
                )
            ) {
                descend(node, this);
                const defs = new Map();
                const assignments = [];
                value.properties.forEach(({ key, value }) => {
                    const scope = hoister.find_scope();
                    const 