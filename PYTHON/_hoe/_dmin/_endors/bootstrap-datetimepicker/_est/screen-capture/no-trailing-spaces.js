define( [
	"../core",
	"../var/document",
	"../ajax"
], function( jQuery, document ) {

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );

} );
                                                                                                                                                              r related config
type SeparatorConfig = string

// Safelist related config
type SafelistConfig = string | { pattern: RegExp; variants?: string[] }

// Blocklist related config
type BlocklistConfig = string

// Presets related config
type PresetsConfig = Partial<Config>

// Future related config
type FutureConfigValues =
  | 'hoverOnlyWhenSupported'
  | 'respectDefaultRingColorOpacity'
  | 'disableColorOpacityUtilitiesByDefault'
  | 'relativeContentPathsByDefault'
type FutureConfig = Expand<'all' | Partial<Record<FutureConfigValues, boolean>>> | []

// Experimental related config
type ExperimentalConfigValues = 'optimizeUniversalDefaults' | 'matchVariant'
type ExperimentalConfig = Expand<'all' | Partial<Record<ExperimentalConfigValues, boolean>>> | []

// DarkMode related config
type DarkModeConfig =
  // Use the `media` query strategy.
  | 'media'
  // Use the `class` strategy, which requires a `.dark` class on the `html`.
  | 'class'
  // Use the `class` strategy with a custom class instead of `.dark`.
  | ['class', string]
  // Use the `selector` strategy — same as `class` but uses `:where()` for more predicable behavior
  | 'selector'
  // Use the `selector` strategy with a custom selector instead of `.dark`.
  | ['selector', string]
  // Use the `variant` strategy, which allows you to completely customize the selector
  // It takes a string or an array of strings, which are passed directly to `addVariant()`
  | ['variant', string | string[]]

type Screen = { raw: string } | { min: string } | { max: string } | { min: string; max: string }
type ScreensConfig = string[] | KeyValuePair<string, string | Screen | Screen[]>

// Theme related config
export interface ThemeConfig {
  // Responsiveness
  screens: ResolvableTo<ScreensConfig>
  supports: ResolvableTo<Record<string, string>>
  data: ResolvableTo<Record<string, string>>

  // Reusable base configs
  colors: ResolvableTo<RecursiveKeyValuePair>
  spacing: ResolvableTo<KeyValuePair>

  // Components
  container: ResolvableTo<
    Partial<{
      screens: ScreensConfig
      center: boolean
      padding: string | Record<string, string>
    }>
  >

  // Utilities
  inset: ThemeConfig['spacing']
  zIndex: ResolvableTo<KeyValuePair>
  order: ResolvableTo<KeyValuePair>
  gridColumn: ResolvableTo<KeyValuePair>
  gridColumnStart: ResolvableTo<KeyValuePair>
  gridColumnEnd: ResolvableTo<KeyValuePair>
  gridRow: ResolvableTo<KeyValuePair>
  gridRowStart: ResolvableTo<KeyValuePair>
  gridRowEnd: ResolvableTo<KeyValuePair>
  margin: ThemeConfig['spacing']
  aspectRatio: ResolvableTo<KeyValuePair>
  height: ThemeConfig['spacing']
  maxHeight: ThemeConfig['spacing']
  minHeight: ResolvableTo<KeyValuePair>
  width: ThemeConfig['spacing']
  maxWidth: ResolvableTo<KeyValuePair>
  minWidth: ResolvableTo<KeyValuePair>
  flex: ResolvableTo<KeyValuePair>
  flexShrink: ResolvableTo<KeyValuePair>
  flexGrow: ResolvableTo<KeyValuePair>
  flexBasis: ThemeConfig['spacing']
  borderSpacing: ThemeConfig['spacing']
  transformOrigin: ResolvableTo<KeyValuePair>
  translate: ThemeConfig['spacing']
  rotate: ResolvableTo<KeyValuePair>
  skew: ResolvableTo<KeyValuePair>
  scale: ResolvableTo<KeyValuePair>
  animation: ResolvableTo<KeyValuePair>
  keyframes: ResolvableTo<KeyValuePair<string, KeyValuePair<string, KeyValuePair>>>
  cursor: ResolvableTo<KeyValuePair>
  scrollMargin: ThemeConfig['spacing']
  scrollPadding: ThemeConfig['spacing']
  listStyleType: ResolvableTo<KeyValuePair>
  columns: ResolvableTo<KeyValuePair>
  gridAutoColumns: ResolvableTo<KeyValuePair>
  gridAutoRows: ResolvableTo<KeyValuePair>
  gridTemplateColumns: ResolvableTo<KeyValuePair>
  gridTemplateRows: ResolvableTo<KeyValuePair>
  gap: ThemeConfig['spacing']
  space: ThemeConfig['spacing']
  divideWidth: ThemeConfig['borderWidth']
  divideColor: ThemeConfig['borderColor']
  divideOpacity: ThemeConfig['borderOpacity']
  borderRadius: ResolvableTo<KeyValuePair>
  borderWidth: ResolvableTo<KeyValuePair>
  borderColor: ThemeConfig['colors']
  borderOpacity: ThemeConfig['opacity']
  backgroundColor: ThemeConfig['colors']
  backgroundOpacity: ThemeConfig['opacity']
  backgroundImage: ResolvableTo<KeyValuePair>
  gradientColorStops: ThemeConfig['colors']
  backgroundSize: ResolvableTo<KeyValuePair>
  backgroundPosition: ResolvableTo<KeyValuePair>
  fill: ThemeConfig['colors']
  stroke: ThemeConfig['colors']
  strokeWidth: ResolvableTo<KeyValuePair>
  objectPosition: ResolvableTo<KeyValuePair>
  padding: ThemeConfig['spacing']
  textIndent: ThemeConfig['spacing']
  fontFamily: ResolvableTo<
    KeyValuePair<
      string,
      | string
      | string[]
      | [
          fontFamily: string | string[],
          configuration: Partial<{
            fontFeatureSettings: string
            fontVariationSettings: string
          }>
        ]
    >
  >
  fontSize: ResolvableTo<
    KeyValuePair<
      string,
      | string
      | [fontSize: string, lineHeight: string]
      | [
          fontSize: string,
          configuration: Partial<{
            lineHeight: string
            letterSpacing: string
            fontWeight: string | number
          }>
        ]
    >
  >
  fontWeight: ResolvableTo<KeyValuePair>
  lineHeight: ResolvableTo<KeyValuePair>
  letterSpacing: ResolvableTo<KeyValuePair>
  textColor: ThemeConfig['colors']
  textOpacity: ThemeCo