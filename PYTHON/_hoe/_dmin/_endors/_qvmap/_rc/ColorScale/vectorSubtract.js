ion = function() {
        return this.createSingleNodeList(
            this.Raw(this.scanner.tokenIndex, null, false)
        );
    };

    var TYPE$F = tokenizer.TYPE;
    var rawMode$5 = Raw.m