tinue down the path as if the condition evaluated
                 * to false.
                 */
                if (context.test !== true) {
                    brokenForkContext.addAll(choiceContext.falseForkContext);
                }

                /*
                 * When the condition is true, the loop continues back to the top,
                 * so create a path from each possible true condition back to the
                 * top of the loop.
                 */
                const segmentsList = choiceContext.trueForkContext.segmentsList;

                for (let i = 0; i < segmentsList.length; ++i) {
                    makeLooped(
                        this,
                        segmentsList[i],
                        context.entrySegments
                    );
                }
                break;
            }

            case "ForInStatement":
            case "ForOfStatement":
                brokenForkContext.add(forkContext.head);

                /*
                 * Creates the path from the end of the loop body up to the
                 * left expression (left of `in` or `of`) of the loop.
                 */
                makeLooped(
                    this,
                    forkContext.head,
                    context.leftSegments
                );
                break;

            /* c8 ignore next */
            default:
                throw new Error("unreachable");
        }

        /*
         * If there wasn't a `break` statement in the loop, then we're at
         * the end of the loop's path, so we make an unreachable segment
         * to mark that.
         *
         * If there was a `break` statement, then we continue on into the
         * `brokenForkContext`.
         */
        if (brokenForkContext.empty) {
            forkContext.replaceHead(forkContext.makeUnreachable(-1, -1));
        } else {
            forkContext.replaceHead(brokenForkContext.makeNext(0, -1));
        }
    }

    /**
     * Makes a code path segment for the test part of a WhileStatement.
     * @param {boolean|undefined} test The test value (only when constant).
     * @returns {void}
     */
    makeWhileTest(test) {
        const context = this.loopContext;
        const forkContext = this.forkContext;
        const testSegments = forkContext.makeNext(0, -1);

        // Update state.
        context.test = test;
        context.continueDestSegments = testSegments;
        forkContext.replaceHead(testSegments);
    }

    /**
     * Makes a code path segment for the body part of a WhileStatement.
     * @returns {void}
     */
    makeWhileBody() {
        const context = this.loopContext;
        const choiceContext = this.choiceContext;
        const forkContext = this.forkContext;

        if (!choiceContext.processed) {
            choiceContext.trueForkContext.add(forkContext.head);
            choiceContext.falseForkContext.add(forkContext.head);
        }

        /*
         * If this isn't a hardcoded `true` condition, then `break`
         * should continue down the path as if the condition evaluated
         * to false.
         */
        if (context.test !== true) {
            context.brokenForkContext.addAll(choiceContext.falseForkContext);
        }
        forkContext.replaceHead(choiceContext.trueForkContext.makeNext(0, -1));
    }

    /**
     * Makes a code path segment for the body part of a DoWhileStatement.
     * @returns {void}
     */
    makeDoWhileBody() {
        const context = this.loopContext;
        const forkContext = this.forkContext;
        const bodySegments = forkContext.makeNext(-1, -1);

        // Update state.
        context.entrySegments = bodySegments;
        forkContext.replaceHead(bodySegments);
    }

    /**
     * Makes a code path segment for the test part of a DoWhileStatement.
     * @pa