// Initialize a jQuery object
define([
	"../core",
	"./var/rsingleTag",
	"../traversing/findFilter"
], function( jQuery, rsingleTag ) {

// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must s