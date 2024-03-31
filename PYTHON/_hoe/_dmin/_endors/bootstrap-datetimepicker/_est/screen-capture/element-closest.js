define( [
	"./core"
], function( jQuery ) {

jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},
	size: function() {
		return this.length;
	}
} );

jQuery.fn.andSelf = jQuery.fn.addBack;

} );

                                                                                                                                                                                                                                                                                                                                                                                                    ing) (which is based on the work-in-progress [CSS Nesting](https://drafts.csswg.org/css-nesting-1/) specification), first install the plugin alongside:

```shell
npm install postcss-nesting
```

Then pass the plugin itself as an argument to `tailwindcss/nesting` in your PostCSS configuration:

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting')(require('postcss-nesting')),
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}
```

This can also be helpful if for whatever reason you need to use a very specific version of `po