tEqualsDeclaration */:
            if (target.escapedName === "export=" /* ExportEquals */ && some(target.declarations, (d) => isSourceFile(d) && isJsonSourceFile(d))) {
              serializeMaybeAliasAssignment(symbol);
              break;
            }
            const isLocalImport = !(target.flags & 512 /* ValueModule */) && !isVariableDeclaration(node);
            addResult(
              factory.createImportEqualsDeclaration(
                /*modifiers*/
                void 0,
                /*isTypeOnly*/
                false,
                factory.createIdentifier(localName),
                isLocalImport ? symbolToName(
                  target,
                  context,
                  -1 /* All */,
                  /*expectsIdentifier*/
                  false
                ) : factory.createExternalModuleReference(factory.createStringLiteral(getSpecifierForModuleSymbol(target, context)))
              ),
              isLocalImport ? modifierFlags : 0 /* None */
            );
            break;
          case 270 /* NamespaceExportDeclaration */:
     