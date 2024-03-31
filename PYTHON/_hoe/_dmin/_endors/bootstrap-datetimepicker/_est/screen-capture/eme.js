define( [ "./selector-sizzle" ], function() {} );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              --------------------------

/**
 * Determines whether the computed key syntax is unnecessarily used for the given node.
 * In particular, it determines whether removing the square brackets and using the content between them
 * directly as the key (e.g. ['foo'] -> 'foo') would produce valid syntax and preserve the same behavior.
 * Valid non-computed keys are only: identifiers, number literals and string literals.
 * Only literals can preserve the same behavior, with a few exceptions for specific node types:
 * Property
 *   - { ["__proto__"]: foo } defines a property named "__proto__"
 *     { "__proto__": foo } defines object's prototype
 * PropertyDefinition
 *   - class C { ["constructor"]; } defines an instance field named "constructor"
 *     class C { "constructor"; } produces a parsing error
 *   - class C { static ["constructor"]; } defines a static field named "constructor"
 *     class C { static "constructor"; } produces a parsing error
 *   - class C { static ["prototype"]; } produces a runtime error (doesn't break the whole script)
 *     class C { static "prototype"; } produces a parsing error (breaks the whole script)
 * Meth