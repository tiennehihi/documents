let Declaration = require('../declaration')

class MaskComposite extends Declaration {
  /**
   * Prefix mask-composite for webkit
   */
  insert(decl, prefix, prefixes) {
    let isCompositeProp = decl.prop === 'mask-composite'

    let compositeValues

    if (isCompositeProp) {
      compositeValues = decl.value.split(',')
    } else {
      compositeValues = decl.value.match(MaskComposite.regexp) || []
    }

    compositeValues = compositeValues.map(el => el.trim()).filter(el => el)
    let hasCompositeValues = compositeValues.length

    let compositeDecl

    if (hasCompositeValues) {
      compositeDecl = this.clone(decl)
      compositeDecl.value = compositeValues
        .map(value => MaskComposite.oldValues[value] || value)
        .join(', ')

      if (compositeValues.includes('intersect')) {
        compositeDecl.value += ', xor'
      }

      compositeDecl.prop = prefix + 'mask-composite'
    }

    if (isCompositeProp) {
      if (!hasCompositeValues) {
        return undefined
      }

      if (this.needCascade(decl)) {
        compositeDecl.raws.before = this.calcBefore(prefixes, decl, prefix)
      }

      return decl.parent.insertBefore(decl, compositeDecl)
    }

    let cloned = this.clone(decl)
    cloned.prop = prefix + cloned.prop

    if (hasCompositeValues) {
      cloned.value = cloned.value.replace(MaskComposite.regexp, '')
    }

    if (this.needCascade(de