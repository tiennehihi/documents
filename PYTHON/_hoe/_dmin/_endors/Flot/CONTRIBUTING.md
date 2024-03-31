eturn pushStartOption(target, props, responseState, formatContext);

      case 'textarea':
        return pushStartTextArea(target, props, responseState);

      case 'input':
        return pushInput(target, props, responseState);

      case 'menuitem':
        return pushStartMenuItem(target, props, responseState);

      case 'title':
        return pushStartTitle(target, props, responseState);
      // Newline eating tags

      case 'listing':
      case 'pre':
        {
          return pushStartPreformattedElement(target, props, type, responseState);
        }
      // Omitted close tags

      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'img':
      case 'keygen':
      case 'link':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
        {
          return pushSelfClosing(target, props, type, responseState);
        }
      // These are reserved SVG and MathML elements, that are never custom elements.
      // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts

      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        {
          return pushStartGenericElement(target, props, type, responseState);
        }

      case 'html':
        {
          if (formatContext.insertionMode === ROOT_HTML_MODE) {
            // If we're rendering the html tag and we're at the root (i.e. not in foreignObject)
            // then we also emit the DOCTYPE as part of the root content as a convenience for
            // rendering the whole document.
            target.push(DOCTYPE);
          }

          return pushStartGenericElement(target, props, type, responseState);
        }

      default:
        {
          if (type.indexOf('-') === -1 && typeof props.is !== 'string') {
            // Generic element
            return pushStartGenericElement(target, props, type, responseState);
          } else {
            // Custom element
            return pushStartCustomElement(target, props, type, responseState);
          }
        }
    }
  }
  var endTag1 = stringToPrecomputedChunk('</');
  var endTag2 = stringToPrecomputedChunk('>');
  function pushEndInstance(target, type, props) {
    switch (type) {
      // Omitted close tags
      // TODO: Instead of repeating this switch we could try to pass a flag from above.
      // That would require returning a tuple. Which might be ok if it gets inlined.
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'img':
      case 'input':
      case 'keygen':
      case 'link':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
        {
          // No close tag needed.
          break;
        }

      default:
        {
          target.push(endTag1, stringToChunk(type), endTag2);
        }
    }
  }
  function writeCompletedRoot(destination, responseState) {
    var bootstrapChunks = responseState.bootstrapChunks;
