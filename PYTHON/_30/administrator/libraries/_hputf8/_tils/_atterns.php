eg$fail(peg$c18);
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseselector();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s5 = peg$c17;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                {
                  peg$fail(peg$c18);
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseselector();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
          if (s2 !== peg$FAILED) {
            s1 = peg$c19(s1, s2);
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
      function peg$parseselector() {
        var s0, s1, s2, s3, s4, s5;
        var key = peg$currPos * 30 + 5,
          cached = peg$resultsCache[key];
        if (cached) {
          peg$currPos = cached.nextPos;
          return cached.result;
        }
        s0 = peg$currPos;
        s1 = peg$parsesequence();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$parsebinaryOp();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsesequence();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
 