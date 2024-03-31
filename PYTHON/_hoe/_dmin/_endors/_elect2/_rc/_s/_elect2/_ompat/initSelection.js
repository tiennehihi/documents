iterals(types) {
    const templates = filter(types, isPatternLiteralType);
    if (templates.length) {
      let i = types.length;
      while (i > 0) {
        i--;
        const t = types[i];
        if (t.flags & 128 /* StringLiteral */ && some(templates, (template) => isTypeMatchedByTemplateLiteralOrStringMapping(t, template))) {
          orderedRemoveItemAt(types, i);
        }
      }
    }
  }
  function isTypeMatchedByTemplateLiteralOrStringMapping(type, template) {
    return template.flags & 134217728 /* TemplateLiteral */ ? isTypeMatchedByTemplateLiteralType(type, template) : isMemberOfStringMapping(type, template);
  }
  function removeConstrainedTypeVariables(types) {
    const typeVariables = [];
    for (const type of types) {
      if (type.flags & 2097152 /* Intersection */ && getObjectFlags(type) & 67108864 /* IsConstrainedTypeVariable */) {
        const index = type.types[0].flags & 8650752 /* TypeVariable */ ? 0 : 1;
        pushIfUnique(typeVariables, type.types[index]);
      }
    }
    for (const typeVariable of typeVariables) {
      const primitives = [];
      for (const typ