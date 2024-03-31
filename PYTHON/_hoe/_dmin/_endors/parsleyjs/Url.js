/* eslint-disable global-require, import/no-dynamic-require */

// import generate from 'babel-generator';
// console.log(generate(node).code);
import isAnnotatedForRemoval from './isAnnotatedForRemoval'
import isStatelessComponent from './isStatelessComponent'
import remove from './remove'

function isPathReactClass(path, globalOptions) {
  const node = path.node
  const matchers = globalOptions.classNameMatchers

  if (path.matchesPattern('React.Component') || path.matchesPattern('React.PureComponent')) {
    return true
  }

  if (node && (node.name === 'Component' || node.name === 'PureComponent')) {
    return true
  }

  if (node && matchers && matchers.test(node.name)) {
    return true
  }

  return false
}

function isReactClass(superClass, scope, globalOptions) {
  if (!superClass.node) {
    return false
  }

  let answer = false

  if (isPathReactClass(superClass, globalOptions)) {
    answer = true
  } else if (superClass.node.name) {
    // Check for inheritance
    const className = superClass.node.name
    const binding = scope.getBinding(className)
    if (!binding) {
      answer = false
    } else {
      const bindingSuperClass = binding.path.get('superClass')

      if (isPathReactClass(bindingSuperClass, globalOptions)) {
        answer = true
      }
    }
  }

  return answer
}

function areSetsEqual(set1, set2) {
  if (set1 === set2) {
    return true
  }

  if (set1.size !== set2.size) {
    return false
  }

  return !Array.from(set1).some(item => !set2.has(item))
}

function memberExpressionRootIdentifier(path) {
  // Traverse up to the parent before the topmost member expression, and then
  // traverse back down to find the topmost identifier. It seems like there
  // might be a better way to do this.
  const parent = path.findParent(p => !p.isMemberExpression())
  const { type } = parent.node

  let memberExpression
  if (type === 'ObjectProperty') {
    // The topmost MemberExpression's parent is an object property, so the
    // topmost MemberExpression should be the value.
    