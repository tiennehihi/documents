  s1 = peg$parseattrName();
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseattrOps();
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsestring();
                  if (s5 === peg$FAILED) {
                    s5 = peg$parsenumber();
                    if (s5 === peg$FAILED) {
                      s5 = peg$parsepath();
                    }
                  }
                  if (s5 !== peg$FAILED) {
                    s1 = peg$c45(s1, s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseattrName();
            if (s1 !== peg$FAILED) {
              s1 = peg$c46(s1);
            }
            s0 = s1;
          }
        }
        peg$resultsCache[key] = {
          nextPos: peg$currPos,
          result: s0
        };
        return s0;
      }
      function peg$parsestring() {
        var s0, s1, s2, s3, s4, s5;
        var key = peg$currPos * 30 + 15,
          cached = peg$resultsCache[key];
        if (cached) {
          peg$currPos = cached.nextPos;
          return cached.result;
        }
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
          s1 = peg$c47;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          {
            peg$fail(peg$c48);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c49.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            {
              peg$fail(peg$c50);
            }
          }
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s4 = peg$c51;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              {
                peg$fail(peg$c52);
              }
            }
            if (s4 !== peg$FAILED) {
              if (input.length > peg$currPos) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                {
                  peg$fail(peg$c53);
                }
              }
              if (s5 !== peg$FAILED) {
                s4 = peg$c54(s4, s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c49.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              {
                peg$fail(peg$c50);
              }
            }
            if (s3 === peg$FAILED) {
              s3 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 92) {
                s4 = peg$c51;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                {
                  peg$fail(peg$c52);
                }
              }
              if (s4 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  {
                    peg$fail(peg$c53);
                  }
                }
                if (s5 !== peg$FAILED) {
                  s4 = peg$c54(s4, s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s3 = peg$c47;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              {
                peg$fail(peg$c48);
              }
            }
            if (s3 !== peg$FAILED) {
              s1 = peg$c55(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 39) {
            s1 = peg$c56;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            {
              peg$fail(peg$c57);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c58.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              {
                peg$fail(peg$c59);
              }
            }
            if (s3 === peg$FAILED) {
              s3 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 92) {
                s4 = peg$c51;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                {
                  peg$fail(peg$c52);
                }
              }
              if (s4 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  {
  