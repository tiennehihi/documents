       if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s2 = peg$c37;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              {
                peg$fail(peg$c38);
              }
            }
            if (s2 !== peg$FAILED) {
              s1 = peg$c39(s1);
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
        function peg$parseattrName() {
          var s0, s1, s2, s3, s4, s5;
          var key = peg$currPos * 30 + 13,
            cached = peg$resultsCache[key];
          if (cached) {
            peg$currPos = cached.nextPos;
            return cached.result;
          }
          s0 = peg$currPos;
          s1 = peg$parseidentifierName();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
              s4 = peg$c42;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              {
                peg$fail(peg$c43);
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseidentifierName();
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
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 46) {
                s4 = peg$c42;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                {
                  peg$fail(peg$c43);
                }
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parseidentifierName();
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
            }
            if (s2 !== peg$FAILED) {
              s1 = peg$c44(s1, s2);
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
        function peg$parseattrValue() {
          var s0, s1, s2, s3, s4, s5;
          var key = peg$currPos * 30 + 14,
            cached = peg$resultsCache[key];
          if (cached) {
            peg$currPos = cached.nextPos;
            return cached.result;
          }
          s0 = peg$currPos;
          s1 = peg$parseattrName();
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseattrEqOps();
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsetype();
                  if (s5 === peg$FAILED) {
                    s5 = peg$parseregex();
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
   