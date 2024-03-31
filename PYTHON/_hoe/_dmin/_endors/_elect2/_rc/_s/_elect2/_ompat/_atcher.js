          text = texts2[i + 1];
        } else {
          return false;
        }
      }
      return true;
    }
  }
  function getTemplateStringForType(type) {
    return type.flags & 128 /* StringLiteral */ ? type.value : type.flags & 256 /* NumberLiteral */ ? "" + type.value : type.flags & 2048 /* BigIntLiteral */ ? pseudoBigIntToString(type.value) : type.flags & (512 /* BooleanLiteral */ | 98304 /* Nullable */) ? type.intrinsicName : void 0;
  }
  function createTemplateLiteralType(texts, types) {
    const type = createType(134217728 /* TemplateLiteral */);
    type.texts = texts;
    type.types = types;
    return type;
  }
  function getStringMappingType(symbol, type) {
    return type.flags & (1048576 /* Union */ | 131072 /* Never */) ? mapType(type, (t) => getStringMappingType(symbol, t)) : type.flags & 128 /* StringLiteral */ ? getStringLiteralType(applyStringMapping(symbol, type.value)) : type.flags & 134217728 /* TemplateLiter