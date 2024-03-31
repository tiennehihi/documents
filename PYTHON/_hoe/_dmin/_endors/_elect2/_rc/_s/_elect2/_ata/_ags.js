 if (recursionFlags & 2 /* Target */) {
        targetDepth--;
      }
      expandingFlags = saveExpandingFlags;
      if (result2) {
        if (result2 === -1 /* True */ || sourceDepth === 0 && targetDepth === 0) {
          if (result2 === -1 /* True */ || result2 === 3 /* Maybe */) {
            resetMaybeStack(
              /*markAllAsSucceeded*/
              true
            );
          } else {
            resetMaybeStack(
              /*markAllAsSucceeded*/
              false
            );
          }
        }
      } else {
        relation.set(id, (reportErrors2 ? 4 /* Reported */ : 0) | 2 /* Failed */ | propagatingVarianceFlags);
        relationCount--;
        resetMaybeStack(
          /*markAllAsSucceeded*/
          false
        );
      }
      return result2;
      function resetMaybeStack(markAllAsSucceeded) {
        for (let i = maybeStart; i < maybeCount; i++) {
          maybeKeysSet.delete(maybeKeys[i]);
          if (markAllAsSucceeded) {
            relation.set(maybeKeys[i], 1 /* Succeeded */ | propagatingVarianceFlags);
            relationCount--;
          }
        }
        maybeCount = maybeStart;
      }
    }
    function structuredTypeRelatedTo(source2, target2, reportErrors2, intersectionState) {
      const saveErrorInfo = captureErrorCalculationState();
      let result2 = structuredTypeRelatedToWorker(source2, target2, reportErrors2, intersectionState, saveErrorInfo);
      if (relation !== identityRelation) {
        if (!result2 && (source2.flags & 2097152 /* Intersection */ || source2.flags & 262144 /* TypeParameter */ && target2.flags & 1048576 /* Union */)) {
          const constraint = getEffectiveConstraintOfIntersection(source2.flags & 2097152 /* Intersection */ ? source2.types : [source2], !!(target2.flags & 1048576 /* Union */));
          if (constraint && everyType(constraint, (c) => c !== source2)) {
            result2 = isRelatedTo(
              constraint,
              target2,
              1 /* Source */,
              /*reportErrors*/
              false,
              /*headMessage*/
              void 0,
              intersectionState
            );
          }
        }
        if (result2 && !(intersectionState & 2 /* Target */) && target2.flags & 2097152 /* Intersection */ && !isGenericObjectType(target2) && source2.flags & (524288 /* Object */ | 2097152 /* Intersection */)) {
          result2 &=