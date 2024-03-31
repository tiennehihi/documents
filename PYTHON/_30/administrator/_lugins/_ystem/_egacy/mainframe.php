a "//# sourceMappingURL=") at the end of the child file.
        if (line >= decoded.length)
            return OMapping(null, null, null, null);
        const segments = decoded[line];
        const index = traceSegmentInternal(segments, cast(map)._decodedMemo, line, column, bias || GREATEST_LOWER_BOUND);
        if (index === -1)
            return OMapping(null, null, null, null);
        const segment = segments[index];
        if (segment.length === 1)
            return OMapping(null, null, null, null);
        const { names, resolvedSources } = map;
        return OMapping(resolvedSources[segment[SOURCES_INDEX]], segment[SOURCE_LINE] + 1, segment[SOURCE_COLUMN], segment.length === 5 ? names[segment[NAMES_INDEX]] : null);
    }
    /**
     * Finds the generated line/column position of the provided source/line/column source position.
     */
    function generatedPositionFor(map, needle) {
        const { source, line, column, bias } = needle;
        return generatedPosition(map, source, line, column, bias || GREATEST_LOWER_BOUND, false);
    }
    /**
     * Finds all generated line/column positions of the provided source/line/column source position.
     */
    function allGeneratedPositionsFor(map, needle) {
        const { source, line, column, bias } = needle;
        // SourceMapConsumer uses LEAST_UPPER_BOUND for some reason, so we follow suit.
        return generatedPosition(map, source, line, column, bias || LEAST_UPPER_BOUND, true);
    }
    /**
     * Iterates each mapping in generated position order.
     */
    function eachMapping(map, cb) {
        const decoded = decodedMappings(map);
        const { names, resolvedSources } = map;
        for (let i = 0; i < decoded.length; i++) {
            const line = decoded[i];
            for (let j = 0; j < line.length; j++) {
                const seg = line[j];
                const generatedLine = i + 1;
                const generatedColumn = seg[0];
                let source = null;
                let originalLine = null;
                let originalColumn = null;
                let name = null;
                if (seg.length !== 1) {
                    source = resolvedSources[seg[1]];
                    originalLine = seg[2] + 1;
                    originalColumn = seg[3];
                }
                if (seg.length === 5)
                    name = names[seg[4]];
                cb({
                    generatedLine,
                    generatedColumn,
                    source,
                    originalLine,
                    originalColumn,
                    name,
                });
            }
        }
    }
    function sourceIndex(map, source) {
        const { sources, resolvedSources } = map;
        let index = sources.indexOf(source);
        if (index === -1)
            index = resolvedSources.indexOf(source);
        return index;
    }
    /**
     * Retrieves the source content for a particular source, if its found. Returns null if not.
     */
    function sourceContentFor(map, source) {
        const { sourcesContent } = map;
        if (sourcesContent == null)
            return null;
        const index = sourceIndex(map, source);
 