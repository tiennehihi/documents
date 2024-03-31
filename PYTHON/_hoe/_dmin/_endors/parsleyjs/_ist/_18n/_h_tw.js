       ((_c = p.declarations) == null ? void 0 : _c.find(isGetAccessor)) || firstPropertyLikeDecl
              ));
            }
            return result;
          } else if (p.flags & (4 /* Property */ | 3 /* Variable */ | 98304 /* Accessor */)) {
            return setTextRange(
              createProperty2(
                factory.createModifiersFromModifierFlags((isReadonlySymbol(p) ? 8 /* Readonly */ : 0) | flag),
                name,
                p.flags & 16777216 /* Optional */ ? factory.createToken(58 /* QuestionToken */) : void 0,
                isPrivate ? void 0 : serializeTypeForDeclaration(context, getWriteTypeOfSymbol(p), p, enclosingDeclaration, includePrivateSymbol, bundled),
                // TODO: https://github.com/microsoft/TypeScript/pull/32372#discussion_r328386357
                // interface members can't have initializers, however class members _can_
                /*initializer*/
                void 0
              ),
              ((_d = p.declarations) == null ? void 0 : _d.find(or(isPropertyDeclaration, isVariableDeclaration))) || firstPropertyLikeDecl
            );
          }
          if (p.flags & (8192 /* Method */ | 16 /* Function */)) {
            const type = getTypeOfSymbol(p);
            const s