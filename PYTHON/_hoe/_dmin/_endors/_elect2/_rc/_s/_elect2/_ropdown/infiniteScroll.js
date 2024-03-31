       croak("Private field must be used in an enclosing class");
            const AST_DotVariant = is("privatename") ? AST_DotHash : AST_Dot;
            return annotate(subscripts(new AST_DotVariant({
                start      : start,
                expression : expr,
                optional   : false,
                property   : as_name(),
                end        : prev()
            }), allow_calls, is_chain));
        }
        if (is("punc", "[")) {
            next();
            var prop = expression(true);
            expect("]");
            return annotate(subscripts(new AST_Sub({
                start      : start,
                expression : expr,
                optional   : false,
                property   : prop,
                end        : prev()
            }), allow_calls, is_chain));
        }
        if (allow_calls && is("punc", "(")) {
            next();
            var call = new AST_Call({
                start      : start,
                expression : expr,
                optional   : false,
                args       : call_args(),
                end        : prev()
            });
            annotate(call);
            return subscripts(call, true, is_chain);
        }

        if (is("punc", "?.")) {
            next();

            let chain_contents;

            if (allow_calls && is("punc", "(")) {
                next();

                const call = new AST_Call({
                    start,
                    optional: true,
                    expression: expr,
                    args: call_args(),
                    end: prev()
                });
                annotate(call);

                chain_contents = subscripts(call, true, true);
            } else if (is("name") || is("privatename")) {
                if(is("privatename") && !S.in_class) 
                    croak("Private field must be used in an enclosing class");
                const AST_DotVariant = is("privatename") ? AST_DotHash : AST_Dot;
                chain_contents = annotate(subscripts(new AST_DotVariant({
                    start,
                    expression: expr,
                    optional: true,
                  