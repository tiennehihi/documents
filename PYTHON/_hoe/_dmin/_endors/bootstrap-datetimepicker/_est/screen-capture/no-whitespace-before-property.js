jQuery Sparklines
=================

This jQuery plugin makes it easy to generate a number of different types
of sparklines directly in the browser, using online a line of two of HTML 
and Javascript.

The plugin has no dependencies other than jQuery and works with all modern 
browsers and also Internet Explorer 6 and later (excanvas is not required
for IE support).

See the [jQuery Sparkline project page](http://omnipotent.net/jquery.sparkline/)
for live examples and documentation.

## License

Released under the New BSD License

(c) Splunk, Inc 2012
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  (calleeNode) {
    return (
        astUtils.isSpecificId(calleeNode, "parseInt") ||
        astUtils.isSpecificMemberAccess(calleeNode, "Number", "parseInt")
    );
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow `parseInt()` and `Number.parseInt()` in favor of binary, octal, and hexadecimal literals",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/prefer-numeric-literals"
        },

        schema: [],

        messages: {
            useLiteral: "Use {{system}} literals instead of {{functionName}}()."
        },

        fixable: "code"
    },

    create(context) {
        const sourceCode = context.sourceCode;

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            "CallExpression[arguments.length=2]"(node) {
                const [strNode, radixNode] = node.arguments,
                    str = astUtils.getStaticStringValue(strNode),
                    radix = radixNode.value;

                if (
                    str !== null &&
                    astUtils.isStringLiteral(strNode) &&
                    radixNode.type === "Literal" &&
                    typeof radix === "number" &&
                    radixMap.has(radix) &&
                    isParseInt(node.callee)
                ) {

                    const { system, literalPrefix } = radixMap.get(radix);

                    context.report({
                        node,
                        messageId: "useLiteral",
                        data: {
                            system,
                            functionName: sourceCode.getText(node.callee)
                        },
                        fix(fixer) {
                            if (sourceCode.getCommentsInside(node).length) {
                                return null;
                            }

                            const replacement = `${literalPrefix}${str}`;

                            if (+replacement !== parseInt(str, radix)) {

                                /*
                                 * If the newly-produced literal would be invalid, (e.g. 0b1234),
                                 * or it would yield an incorrect parseInt result for some other reason, don't make a fix.
                                 *
                                 * If `str` had numeric separators, `+replacement` will evaluate to `NaN` because unary `+`
                                 * per the specification doesn't support numeric separators. Thus, the above condition will be `true`
                           