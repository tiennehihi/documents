import { parseColor } from './color'
import { parseBoxShadowValue } from './parseBoxShadowValue'
import { splitAtTopLevelOnly } from './splitAtTopLevelOnly'

let cssFunctions = ['min', 'max', 'clamp', 'calc']

// Ref: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Types

function isCSSFunction(value) {
  return cssFunctions.some((fn) => new RegExp(`^${fn}\\(.*\\)`).test(value))
}

// These properties accept a `<dashed-ident>` as one of the values. This means that you can use them
// as: `timeline-scope: --tl;`
//
// Without the `var(--tl)`, in these cases we don't want to normalize the value, and you should add
// the `var()` yourself.
//
// More info:
// - https://drafts.csswg.org/scroll-animations/#propdef-timeline-scope
// - https://developer.mozilla.org/en-US/docs/Web/CSS/timeline-scope#dashed-ident
//
const AUTO_VAR_INJECTION_EXCEPTIONS = new Set([
  // Concrete properties
  'scroll-timeline-name',
  'timeline-scope',
  'view-timeline-name',
  'font-palette',

  // Shorthand properties
  'scroll-timeline',
  'animation-timeline',
  'view-timeline',
])

// This is not a data type, but rather a function that can normalize the
// correct values.
export function normalize(value, context = null, isRoot = true) {
  let isVarException = context && AUTO_VAR_INJECTION_EXCEPTIONS.has(context.property)
  if (value.startsWith('--') && !isVarException) {
    return `var(${value})`
  }

  // Keep raw strings if it starts with `url(`
  if (value.includes('url(')) {
    return value
      .split(/(url\(.*?\))/g)
      .filter(Boolean)