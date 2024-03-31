eralType(index);
        const accessFlags = 32 /* ExpressionPosition */ | (noTupleBoundsCheck || hasDefaultValue(declaration) ? 16 /* NoTupleBoundsCheck */ : 0);
        const declaredType = getIndexedAccessTypeOrUndefined(parentType, indexType, accessFlags, declaration.name) || errorType;
        type = getFlowTypeOfDestr