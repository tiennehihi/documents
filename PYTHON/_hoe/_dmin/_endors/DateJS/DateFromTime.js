define( [
	"../core"
], function( jQuery ) {

// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};

return jQuery.parseXML;

} );
                                 */
function isSingleSuperCall(body) {
    return (
        body.length === 1 &&
        body[0].type === "ExpressionStatement" &&
        body[0].expression.type === "CallExpression" &&
        body[0].expression.callee.type === "Super"
    );
}

/**
 * Checks whether a given node is a pattern which doesn't have any side effects.
 * Default parameters and Destructuring parameters can have side effects.
 * @param {ASTNode} node A pattern node.
 * @returns {boolean} `true` if the node doesn't have any side effects.
 */
