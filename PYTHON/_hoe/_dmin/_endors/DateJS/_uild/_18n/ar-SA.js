  TSImportType(node) {
                    context.report({
                        node,
                        messageId: 'noImportTypeAnnotations',
                    });
                },
            }
            : {}));
        function classifySpecifier(node) {
            var _a;
            const defaultSpecifier = node.specifiers[0].type === utils_1.AST_NODE_TYPES.ImportDefaultSpecifier
                ? node.specifiers[0]
                : null;
            const namespaceSpecifier = (_a = node.specifiers.find((specifier) => specifier.type === utils_1.AST_NODE_TYPES.ImportNamespaceSpecifier)) !== null && _a !== void 0 ? _a : null;
            const namedSpecifiers = node.specifiers.filter((specifier) => specifier.type === utils_1.AST_NODE_TYPES.ImportSpecifier);
            return {
                defaultSpecifier,
                namespaceSpecifier,
                namedSpecifiers,
            };
        }
        /**
         * Returns information for fixing named specifiers, type or value
         */
        function getFixesNamedSpecifiers(fixer, node, subsetNamedSpecifiers, allNamedSpecifiers) {
            if (allNamedSpecifiers.length === 0) {
                return {
                    typeNamedSpecifiersText: '',
                    removeTypeNamedSpecifiers: [],
                };
            }
            const typeNamedSpecifiersTexts = [];
            const removeTypeNamedSpecifiers = [];
            if (subsetNamedSpecifiers.length === allNamedSpecifiers.length) {
                // import Foo, {Type1, Type2} from 'foo'
                // import DefType, {Type1, Type2} from 'foo'
                const openingBraceToken = util.nullThrows(sourceCode.getTokenBefore(subsetNamedSpecifiers[0], util.isOpeningBraceToken), util.NullThrowsReasons.MissingToken('{', node.type));
                const commaToken = util.nullThrows(sourceCode.getTokenBefore(openingBraceToken, util.isCommaToken), util.NullThrowsReasons.MissingToken(',', node.type));
                const closingBraceToken = util.nullThrows(sourceCode.getFirstTokenBetween(openingBraceToken, node.source, util.isClosingBraceToken), util.NullThrowsReasons.MissingToken('}', node.type));
                // import DefType, {...} from 'foo'
                //               ^^^^^^^ remove
                removeTypeNamedSpecifiers.push(fixer.removeRange([commaToken.range[0], closingBraceToken.range[1]]));
                typeNamedSpecifiersTexts.push(sourceCode.text.slice(openingBraceToken.range[1], closingBraceToken.range[0]));
            }
            else {
                const namedSpecifierGroups = [];
                let group = [];
                for (const namedSpecifier of allNamedSpecifiers) {
                    if (subsetNamedSpecifiers.includes(namedSpecifier)) {
                        group.push(namedSpecifier);
                    }
                    else if (group.length) {
                        namedSpecifierGroups.push(group);
                        group = [];
                    }
                }
                if (group.length) {
                    namedSpecifierGroups.push(group);
                }
                for (const namedSpecifiers of namedSpecifierGroups) {
                    const { removeRange, textRange } = getNamedSpecifierRanges(namedSpecifiers, allNamedSpecifiers);
                    removeTypeNamedSpecifiers.push(fixer.removeRange(removeRange));
                    typeNamedSpecifiersTexts.push(sourceCode.text.slice(...textRange));
                }
            }
            return {
                typeNamedSpecifiersText: typeNamedSpecifiersTexts.join(','),
                removeTypeNamedSpecifiers,
            };
        }
        /**
         * Returns ranges for fixing named specifier.
         */
        function getNamedSpecifierRanges(namedSpecifierGroup, allNamedSpecifiers) {
            const first = namedSpecifierGroup[0];
            const last = namedSpecifierGroup[namedSpecifierGroup.length - 1];
            const removeRange = [first.range[0], last.range[1]];
            const textRange = [...removeRange];
            const before = sourceCode.getTokenBefore(first);
            textRange[0] = before.range[1];
            if (util.isCommaToken(before)) {
                removeRange[0] = before.range[0];
            }
            else {
                removeRange[0] = before.range[1];
            }
            const isFirst = allNamedSpecifiers[0] === first;
            const isLast = allNamedSpecifiers[allNamedSpecifiers.length - 1] === last;
            const after = sourceCode.getTokenAfter(last);
            textRange[1] = after.range[0];
            if (isFirst || isLast) {
                if (util.isCommaToken(after)) {
                    removeRange[1] = after.range[1];
                }
            }
            return {
                textRange,
                removeRange,
            };
        }
        /**
         * insert specifiers to named import node.
         * e.g.
         * import type { Already, Type1, Type2 } from 'foo'
         *                        ^^^^^^^^^^^^^ insert
         */
        function fixInsertNamedSpecifiersInNamedSpecifierList(fixer, target, insertText) {
            const closingBraceToken = util.nullThrows(sourceCode.getFirstTokenBetween(sourceCode.getFirstToken(target), target.source, util.isClosingBraceToken), util.NullThrowsReasons.MissingToken('}', target.type));
            const before = sourceCode.getTokenBefore(closingBraceToken);
            if (!util.isCommaToken(before) && !util.isOpeningBraceToken(before)) {
                insertText = `,${insertText}`;
            }
            return fixer.insertTextBefore(closingBraceToken, insertText);
        }
        /**
         * insert type keyword to named import node.
         * e.g.
         * import ADefault, { Already, type Type1, type Type2 } from 'foo'
         *                             ^^^^ insert
         */
        function* fixInsertTypeKeywordInNamedSpecifi