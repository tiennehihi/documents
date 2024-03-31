define( function() {
	return function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};
} );
                                                                                                                                    ocal version first
  try {
    return (lightningCss = require('lightningcss'))
  } catch {}

  return (lightningCss = lazyLightningCss())
}

export async function lightningcss(shouldMinify: boolean, result: Result) {
  let css = loadLightningCss()

  try {
    let transformed = css.transform({
      filename: result.opts.from || 'input.css',
      code: Buffer.from(result.css, 'utf-8'),
      minify: shouldMinify,
      sourceMap: !!result.map,
      inputSourceMap: result.map ? result.map.toString() : undefined,
      targets: css.browserslistToTargets(browserslist(packageJson.browserslist)),
      drafts: {
        nesting: true,
      },
    })

    return Object.assign(result, {
      css: transformed.code.toString('utf8'),
      map: result.map
        ? Object.assign(result.map, {
            toString() {
              return transformed.map.toString()
            },
          })
        : result.map,
    })
  } catch (err) {
    console.error('Unable to use Lightning CSS. Using raw version instead.')
    console.error(err)

    return result
  }
}

/**
 * @returns {import('postcss')}
 */
export function loadPostcss() {
  // Try to