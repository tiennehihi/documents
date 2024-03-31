maybeWarn: try {
  var stackTraceLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  var stack = new Error().stack;
  Error.stackTraceLimit = stackTraceLimit;
  if (!stack.includes("babel-preset-react-app")) break maybeWarn;

  // Try this as a fallback, in case it's available in node_modules
  module.exports = require("@babel/plugin-transform-private-property-in-object");

  setTimeout(console.warn, 2500, `\
\x1B[0;33mOne of your dependencies, babel-preset-react-app, is importing the
"@babel/plugin-proposal-private-property-in-object" package without
declaring it in its dependencies. This is currently working because
"@babel/plugin-proposal-private-property-in-object" is already in your
node_modules folder for unrelated reasons, but it \x1B[1mmay break at any time\x1B[0;33m.

babel-preset-react-app is part of the create-react-app project, \x1B[1mwhich
is not maintianed any