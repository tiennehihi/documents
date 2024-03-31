               case 'first-of-type':
                  source = 'n=e;o=e.localName;while((n=n.previousElementSibling)&&n.localName!=o);if(!n){' + source + '}';
                  break;
                default:
                  emit('\'' + selector_string + '\'' + qsInvalid);
                  break;
              }
            }

            // *** child-indexed & typed child-indexed pseudo-classes
            // :nth-child, :nth-of-type, :nth-last-child, :nth-last-of-type
            else if ((match = selector.match(Patterns.treestruct))) {
              match[1] = match[1].toLowerCase();
              switch (match[1]) {
                case 'nth-child':
                case 'nth-of-type':
                case 'nth-last-child':
                case 'nth-last-of-type':
                  expr = /-of-type/i.test(match[1]);
                  if (match[1] && match[2]) {
                    type = /last/i.test(match[1]);
                    if (match[2] == 'n') {
                      source = 'if(tru