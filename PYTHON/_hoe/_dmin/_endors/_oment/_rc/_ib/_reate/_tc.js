 arrow.async = self.async;
        arrow.is_generator = self.is_generator;
        return make_node(AST_ObjectKeyVal, self, {
            key: self.key instanceof AST_SymbolMethod ? self.