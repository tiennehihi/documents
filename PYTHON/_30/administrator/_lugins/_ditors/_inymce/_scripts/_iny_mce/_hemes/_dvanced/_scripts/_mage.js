                 options: options,
                    global: globalMode,
                  });
                }
              });
            } else if (atRule.nodes) {
              atRule.nodes.forEach((declaration) => {
                if (declaration.type === "decl") {
                  localizeDeclaration(declaration, {
                    localAliasMap,
                    options: options,
                    global: globalMode,
                  });
                }
              });
            }
          });

          root.walkRules((rule) => {
            if (
              rule.parent &&
              rule.parent.type === "atrule" &&
              /keyframes$/i.test(rule.parent.name)
            ) {
              // ignore keyframe rules
              return;
            }

            const context = localizeNode(rule, options.mode, localAliasMap);

            context.options = options;
            context.localAliasMap = localAliasMap;

            if (pureMode && context.hasPureGlobals) {
              throw rule.error(
                'Selector "' +
                  rule.selector +
                  '" is not pure ' +
                  "(pure selectors must contain at least one local class or id)"
              );
            }

            rule.selector = context.selector;

            // Less-syntax mixins parse as rules with no nodes
            if (rule.nodes) {
              rule.nodes.forEach((declaration) =>
                localizeDeclaration(declaration, context)
              );
            }
          });
        },
      };
    },
  };
};
module.exports.postcss = true;
                                                                                                                                                                                                                                                                                                                                                                                                                                �ŭP-�h�\�	e+��u�t�q>OfF^*w�T�c��_��Չp���^�i��}3b�̹�杪V���W;r�^�4x��sz���-���v��tR
=sʓD\��;������-l1 ��4�9~-�M��?6?r�K+[H1��ڍ�(�q���&�f���Zq�_�Iu�7s�-%B�,޼�! ��
�M�$l���j�-[X%��FXK�J�]L`vTiUw���0��_�"�a�l`���������#Z����EM����F�V��7)�,�ߥ�����>�%�Ô�^���GwExi+���<x�z[Z�F�:=�����;Ό�|h6�*�ٌ����,M���Ң�EVk#tg�=�!���u���z������j�}>�A������_�_��ː��6N�o���[�t�m�ԚWJ`���=]b'UX$���B2Y��gJ���W�CAـ��[6��o�7���e;&(e��o>`�t^z+��O���ZBce��i�l��7�5G�T��#oM����|$n��!ȹ(��j1���j���Ǉ3�X���cH��v;`5=�%����+��,r�㵙�N�S�y)F��V���$i���֪βs>d���;X�DRe]�����6������#9�Z<J�����#Ժw�)�1�_#,�Tĸ)��M�K�� ���|�:V�B@���Wȷ�֩�觺0`7ꗝæ���D��1�3Ӆ�o)J����+aj#I�E����=`c`�޾����q	��gHB � 	���o�u�%���NĎ#ܴ������:����	�U��=Vӎi~,}�<�w�R�J���;<���i�r$���</�n`j<����n�j� / z�