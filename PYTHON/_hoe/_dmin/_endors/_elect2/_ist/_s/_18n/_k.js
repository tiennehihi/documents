  var p = output.parent();
        return p instanceof AST_Call                          // (foo, bar)() or foo(1, (2, 3), 4)
            || p instanceof AST_Unary                         // !(foo, bar, baz)
            || p instanceof AST_Binary                        // 1 + (2, 3) + 4 ==> 8
            || p instanceof AST_VarDef                        // var a = (1, 2), b = a + a; ==> b == 4
            || p instanceof AST_PropAccess                    // (1, {foo:2}).foo or (1, {foo:2})["foo"] ==> 2
            || p instanceof AST_Array                         // [ 1, (2, 3), 4 ] ==> [ 1, 3, 4 ]
            || p instanceof AST_ObjectProperty                // { foo: (1, 2) }.foo ==> 2
            || p instanceof AST_Conditional                   /* (false, true) ? (a = 10, b = 20) : (c = 30)
                                                               * ==> 20 (side effect, set a := 10 and b := 20) */
            || p instanceof AST_Arrow                      