     if (s1 !== peg$FAILED) {
          s2 = peg$parseidentifierName();
          if (s2 !== peg$FAILED) {
            s1 = peg$c102(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$resultsCache[key] = {
          nextPos: peg$currPos,
          result: s0
        };
        return s0;
      }
      function nth(n) {
        return {
          type: 'nth-child',
          index: {
            type: 'literal',
            value: n
          }
        };
      }
      function nthLast(n) {
        return {
          type: 'nth-last-child',
          index: {
            type: 'literal',
            value: n
          }
        };
      }
      function strUnescape(s) {
        return s.replace(/\\(.)/g, function (match, ch) {
          switch (ch) {
            case 'b':
              return '\b';
            case 'f':
              return '\f';
            case 'n':
              return '\n';
            case 'r':
              return '\r';
            case 't':
              return '\t';
            case 'v':
              return '\v';
            default:
              return ch;
          }
        });
      }
      peg$result = peg$startRuleFunction();
      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      } else {
        if (peg$result !==