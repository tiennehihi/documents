Comment();
        } else if (chompKeep && !keyComment && onChompKeep) onChompKeep();

        return ctx.inFlow && !explicitKey ? str : "? ".concat(str);
      }

      str = explicitKey ? "? ".concat(str, "\n").concat(indent, ":") : "".concat(str, ":");

      if (this.comment) {
        // expected (but not strictly required) to be a single-line comment
        str = addComment(str, ctx.indent, this.comment);
        if (onComment) onComment();
      }

      var vcb = '';
      var valueComment = null;

      if (value instanceof Node) {
        if (value.spaceBefore) vcb = '\n';

        if (value.commentBefore) {
          var cs = value.commentBefore.replace(/^/gm, "".concat(ctx.indent, "#"));
          vcb += "\n".concat(cs);
        }

        valueComment = value.comment;
      } else if (value && _typeof(value) === 'object') {
        value = doc.schema.createNode(value, true);
      }

      ctx.implicitKey = false;
      if (!explicitKey && !this.comment && value instanceof Scalar) ctx.indentAtStart = str.length + 1;
      chompKeep = false;

      if (!indentSeq && indentSize >= 2 && !ctx.inFlow && !explicitKey && value instanceof YAMLSeq && value.type !== Type.FLOW_SEQ && !va