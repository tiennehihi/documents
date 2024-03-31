import Document from './document.js'
import { SourceMap } from './postcss.js'
import Processor from './processor.js'
import Result, { Message, ResultOptions } from './result.js'
import Root from './root.js'
import Warning from './warning.js'

declare namespace LazyResult {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  export { LazyResult_ as default }
}

/**
 * A Promise proxy for the result of PostCSS transformations.
 *
 * A `LazyResult` instance is returned by `Processor#process`.
 *
 * ```js
 * const lazy = postcss([autoprefixer]).process(css)
 * ```
 *