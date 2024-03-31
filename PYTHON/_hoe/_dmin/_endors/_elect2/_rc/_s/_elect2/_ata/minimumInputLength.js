eType === targetType) {
          message = Diagnostics.Type_0_is_not_assignable_to_type_1_Two_different_types_with_this_name_exist_but_they_are_unrelated;
        } else if (exactOptionalPropertyTypes && getExactOptionalUnassignableProperties(source2, target2).length) {
          message = Diagnostics.Type_0_is_not_assignable_to_type_1_with_exactOptionalPropertyTypes_Colon_true_Consider_adding_undefined_to_the_types_of_the_target_s_properties;
        } else {
          if (source2.flags & 128 /* StringLiteral */ && target2.flags & 1048576 /* Union */) {
            const suggestedType = getSuggestedTypeForNonexistentStringLiteralType(source2, target2);
            if (sug