': true
            }), ['bash', 'bsh', 'csh', 'sh']);
      registerLangHandler(sourceDecorator({
              'keywords': PYTHON_KEYWORDS,
              'hashComments': true,
              'multiLineStrings': true,
              'tripleQuotedStrings': true
            }), ['cv', 'py', 'python']);
      registerLangHandler(sourceDecorator({
              'keywords': PERL_KEYWORDS,
              'hashComments': true,
              'multiLineStrings': true,
              'regexLiterals': 2  // multiline regex literals
            }), ['perl', 'pl', 'pm']);
      registerLangHandler(sourceDecorator({
              'keywords': RUBY_KEYWORDS,
              'hashComments': true,
              'multiLineStrings': true,
              'regexLiterals': true
            }), ['rb', 'ruby']);
      registerLangHandler(sourceDecorator({
              'keywords': JSCRIPT_KEYWORDS,
              'cStyleComments': true,
              'regexLiterals': true
            }), ['javascript', 'js']);
      registerLangHandler(sourceDecorator({
              'keywords': COFFEE_KEYWORDS,
              'hashComments': 3,  // ### style block comments
              'cStyleComments': true,
              'multilineStrings': true,
              'tripleQuotedStrings': true,
              'regexLiterals': true
            }), ['coffee']);
      registerLangHandler(sourceDecorator({
              'keywords': RUST_KEYW