

        /**
         * The final segments of the code path which are either `return` or `throw`.
         * This is a union of the segments in `returnedForkContext` and `thrownForkContext`.
         * @type {Array<CodePathSegment>}
         */
        this.finalSegments = [];

        /**
         * The final segments of the code path which are `return`. These
         * segments are also contained in `finalSegments`.
         * @type {Array<CodePathSegment>}
         */
        this.returnedForkContext = [];

        /**
         * The final segments of the code path which are `throw`. These
         * segments are also contained in `finalSegments`.
         * @type {Array<CodePathSegment>}
         */
        this.thrownForkContext = [];

        /*
         * We add an `add` method so that these look more like fork contexts and
         * can be used interchangeably when a fork context is needed to add more
         * segments to a path.
         *
         * Ultimately, we want anything added to `returned` or `thrown` to also
         * be added to `final`. We only add reachable and used segments to these
         * arrays.
         */
        const final = this.finalSegments;
        const returned = this.returnedForkContext;
        const thrown = this.thrownForkContext;

        returned.add = addToReturnedOrThrown.bind(null, returned, thrown, final);
        thrown.add = addToReturnedOrThrown.bind(null, thrown, returned, final);
    }

    /**
     * A passthrough property exposing the current pointer as part of the API.
     * @type {CodePathSegment[]}
     */
    get headSegments() {
        return this.forkContext.head;
    }

    /**
     * The parent forking context.
     * This is used for the root of new forks.
     * @type {ForkContext}
     */
    get parentForkContext() {
        const current = this.forkContext;

        return current && current.upper;
    }

    /**
     * Creates and stacks new forking context.
     * @param {boolean} forkLeavingPath A flag which shows being in a
     *   "finally" block.
     * @returns {ForkContext} The created context.
     */
    pushForkContext(forkLeavingPath) {
        this.forkContext = ForkContext.newEmpty(
            this.forkContext,
            forkLeavingPath
        );

        return this.forkContext;
    }

    /**
     * Pops and merges the last forking context.
     * @returns {ForkContext} The last context.
     */
    popForkContext() {
        const lastContext = this.forkContext;

        this.forkContext = lastContext.upper;
        this.forkContext.replaceHead(lastContext.makeNext(0, -1));

        return lastContext;
    }

    /**
     * Creates a new path.
     * @returns {void}
     */
    forkPath() {
        this.forkContext.add(this.parentForkContext.makeNext(-1, -1));
    }

    /**
     * Creates a bypass path.
     * This is used for such as IfStatement which does not have "else" chunk.
     * @returns {void}
     */
    forkBypassPath() {
        this.forkContext.add(this.parentForkContext.head);
    }

    //--------------------------------------------------------------------------
    // ConditionalExpression, LogicalExpression, IfStatement
    //--------------------------------------------------------------------------

    /**
     * Creates a context for ConditionalExpression, LogicalExpression, AssignmentExpression (logical assignments only),
     * IfStatement, WhileStatement, DoWhileStatement, or ForStatement.
     *
     * LogicalExpressions have cases that it goes different paths between the
     * `true` case and the `false` case.
     *
     * For Example:
     *
     *     if (a || b) {
     *         foo();
     *     } else {
     *         bar();
     *     }
     *
     * In this case, `b` is evaluated always in the code path of the `else`
     * block, but it's not so in the code path of the `if` block.
     * So there are 3 paths.
     *
     *     a -> foo();
     *     a -> b -> foo();
     *     a -> b -> bar();
     * @param {string} kind A kind string.
     *   If the new context is LogicalExpression's or AssignmentExpression's, this is `"&&"` or `"||"` or `"??"`.
     *   If it's IfStatement's or ConditionalExpression's, this is `"test"`.
     *   Otherwise, this is `"loop"`.
     * @param {boolean} isForkingAsResult Indicates if the result of the choice
     *      creates a fork.
     * @returns {void}
     */
    pushChoiceContext(kind, isForkingAsResult) {
        this.choiceContext = new ChoiceContext(this.choiceContext, kind, isForkingAsResult, this.forkContext);
    }

    /**
     * Pops the last choice context and finalizes it.
     * This is called upon leaving a node that represents a choice.
     * @throws {Error} (Unreachable.)
     * @returns {ChoiceContext} The popped context.
     */
    popChoiceContext() {
        const poppedChoiceContext = this.choiceContext;
        const forkContext = this.forkContext;
        const head = forkContext.head;

        this.choiceContext = poppedChoiceContext.upper;

        switch (poppedChoiceContext.kind) {
            case "&&":
            case "||":
            case "??":

                /*
                 * The `head` are the path of the right-hand operand.
                 * If we haven't previously added segments from child contexts,
                 * then we add these segments to all possible forks.
                 */
                if (!poppedChoiceContext.processed) {
                    poppedChoiceContext.trueForkContext.add(head);
                    poppedChoiceContext.falseForkContext.add(head);
                    poppedChoiceContext.nullishForkContext.add(head);
                }

                /*
                 * If this context is the left (test) expression for another choice
                 * context, such as `a || b` in the expression `a || b || c`,
                 * then we take the segments for this context and move them up
                 * to the parent context.
                 */
                if (poppedChoiceContext.isForkingAsResult) {
                    const parentContext = this.choiceContext;

                    parentContext.trueForkContext.addAll(poppedChoiceContext.trueForkContext);
                    parentContext.falseForkContext.addAll(poppedChoiceContext.falseForkContext);
                    parentContext.nullishForkContext.addAll(poppedChoiceContext.nullishForkContext);
                    parentContext.processed = true;

                    // Exit early so we don't collapse all paths into one.
                    return poppedChoiceContext;
                }

                break;

            case "test":
                if (!poppedChoiceContext.processed) {

                    /*
                     * The head segments are the path of the `if` block here.
                     * Updates the `true` path with the end of the `if` block.
                     */
                    poppedChoiceContext.trueForkContext.clear();
                    poppedChoiceContext.trueForkContext.add(head);
                } else {

                    /*
                     * The head segments are the path of the `else` block here.
                     * Updates the `false` path with the end of the `else`
                     * block.
                     */
                    poppedChoiceContext.falseForkContext.clear();
                    poppedChoiceContext.falseForkContext.add(head);
                }

                break;

            case "loop":

                /*
                 * Loops are addressed in `popLoopContext()` so just return
                 * the context without modification.
                 */
                return poppedChoiceContext;

            /* c8 ignore next */
            default:
                throw new Error("unreachable");
        }

        /*
         * Merge the true path with the false path to create a single path.
         */
        const combinedForkContext = poppedChoiceContext.trueForkContext;

        combinedForkContext.addAll(poppedChoiceContext.falseForkContex