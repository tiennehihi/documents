t = findAncestor(location, (l) => isImportTypeNode(l) || isExportDeclaration(l) || isImportDeclaration(l));
          if (isSyncImport && sourceFile.impliedNodeFormat === 99 /* ESNext */ && !hasResolutionModeOverride(overrideHost)) {
            if (findAncestor(location, isImportEqualsDeclaration)) {
              error(errorNode, Diagnostics.Module_0_cannot_be_imported_using_this_construct_The_specifier_only_resolves_to_an_ES_module_which_cannot_be_imported_with_require_Use_an_ECMAScript_import_instead, moduleReference);
            } else {
              let diagnosticDetails;
              const ext = tryGetExtensionFromPath2(currentSourceFile.fileName);
              if (ext === ".ts" /* Ts */ || ext === ".js" /* Js */ || ext === ".tsx" /* Tsx */ || ext === ".jsx" /* Jsx */) {
                const scope = currentSourceFile.packageJsonScope;
                const targetExt = ext === ".ts" /* Ts */ ? ".mts" /* Mts */ : ext === ".js" /* Js */ ? ".mjs" /* Mjs */ : void 0;
                if (scope && !scope.contents.packageJsonContent.type) {
                  if (targetExt) {
                    diagnosticDetails = chainDiagnosticMessages(
                      /*details*/
                      void 0,
                      Diagnostics.To_convert_this_file_to_an_ECMAScript_module_change_its_file_extension_to_0_or_add_the_field_type_Colon_module_to_1,
 