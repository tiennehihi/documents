/**
 * @typedef ModuleRuntimeOptions {Object}
 * @property {boolean} const Use ES6 `const` and `let` in generated runtime code.
 * @property {'cjs' | 'esm'} moduleSystem The module system to be used.
 */

/**
 * Generates code appended to each JS-like module for react-refresh capabilities.
 *
 * `__react_refresh_utils__` will be replaced with actual utils during source parsing by `webpack.ProvidePlugin`.
 *
 * [Reference for Runtime Injection](https://github.com/webpack/webpack/blob/b07d3b67d2252f08e4bb65d354a11c9b69f8b434/lib/HotModuleReplacementPlugin.js#L419)
 * [Reference for HMR Error Recovery](https://github.com/webpack/webpack/issues/418#issuecomment-490296365)
 *
 * @param {import('webpack').Template} Webpack's templating helpers.
 * @param {ModuleRuntimeOptions} options The refresh module runtime options.
 * @returns {string} The refresh module runtime template.
 */
function getRefreshModuleRuntime(Template, options) {
  const constDeclaration = options.const ? 'const' : 'var';
  const letDeclaration = options.const ? 'let' : 'var';
  const webpackHot = opti