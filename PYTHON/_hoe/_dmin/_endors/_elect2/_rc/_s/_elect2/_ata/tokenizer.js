         if (result2 = isRelatedTo(indexedAccessType, templateType2, 3 /* Both */, reportErrors2)) {
                  return result2;
                }
              }
            }
            originalErrorInfo = errorInfo;
            resetErrorInfo(saveErrorInfo);
          }
        }
      } else if (targetFlags & 16777216 /* Conditional */) {
        if (isDeeplyNestedType(target2, targetStack, targetDepth, 10)) {
          return 3 /* Maybe */;
        }
        const c = target2;
        if (!c.root.inferTypeParameters && !isDistributionDependent(c.root) && !(source2.flags & 16777216 /* Conditional */ && source2.root === c.root)) {
          const skipTrue = !isTypeAssignableTo(getPermissiveInstantiation(c.checkType), getPermissiveInstantiation(c.extendsType));
          const skipFalse = !skipTrue && isTypeAssignableTo(getRestrictiveInstantiation(c.checkType), getRestrictiveInstantiation(c.extendsType));
          if (result2 = skipTrue ? -1 /* True */ : isRelatedTo(
            source2,
            getTrueTypeFromConditionalType(c),
            2 /* Target */,
            /*reportErrors*/
            false,
            /*headMessage*/
            void 0,
            intersectionState
          )) {
            result2 &= skipFalse ? -1 /* True */ : isRelatedTo(
              source2,
              getFalseTypeFromConditionalType(c),
              2 /* Target */,
              /*reportErrors*/
              false,
              /*headMessage*/
              void 0,
              intersectionState
            );
            if (result2) {
              return result2;
            }
          }
        }
      } else if (targetFlags & 134217728 /* TemplateLiteral */) {
        if (sourceFlags & 134217728 /* TemplateLiteral */) {
          if (relation === comparableRelation) {
            return templateLiteralTypesDefinitelyUnrelated(source2, target2) ? 0 /* False */ : -1 /* True */;
          }
          instantiateType(source2, reportUnreliableMapper);
        }
        if (isTypeMatchedByTemplateLiteralType(source2, target2)) {
          return -1 /* True */;
        }
      } else if (target2.flags & 268435456 /* StringMapping */) {
        if (!(source2.flags & 268435456 /* StringMapping */)) {
          if (isMemberOfStringMapping(source2, target2)) {
            return -1 /* True */;
          }
        }
      }
      if (sourceFlags & 8650752 /* TypeVariable */) {
        if (!(sourceFlags & 8388608 /* IndexedAccess */ && targetFlags & 8388608 /* IndexedAccess */)) {
          const constraint = getConstraintOfType(source2) || unknownType;
          if (result2 = isRelatedTo(
            constraint,
            target2,
            1 /* Source */,
            /*reportErrors*/
            false,
            /*hea