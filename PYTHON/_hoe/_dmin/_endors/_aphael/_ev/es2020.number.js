// The following TSLint rules have been disabled:
// unified-signatures: Because there is useful information in the argument names of the overloaded signatures

// Convention:
// Use 'union types' when:
//  - parameter types have similar signature type (i.e. 'string | ReadonlyArray<string>')
//  - parameter names have the same semantic meaning (i.e. ['command', 'commands'] , ['key', 'keys'])
//    An example for not using 'union types' is the declaration of 'env' where `prefix` and `enable` parameters
//    have different semantics. On the other hand, in 