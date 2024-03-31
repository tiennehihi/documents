appings.advance(this.separator);
			}

			const sourceIndex = source.filename ? this.uniqueSourceIndexByFilename[source.filename] : -1;
			const magicString = source.content;
			const locate = getLocator$1(magicString.original);

			if (magicString.intro) {
				mappings.advance(magicString.intro);
			}

			magicString.firstChunk.eachNext((chunk) => {
				const loc = locate(chunk.start);

				if (chunk.intro.length) mappings.advance(chunk.intro);

				if (source.filename) {
					if (chunk.edited) {
						mappings.addEdit(
							sourceIndex,
							chunk.content,
							loc,
							chunk.storeName ? names.indexOf(chunk.original) : -1
						);
					} else {
						mappings.addUneditedChunk(
							sourceIndex,
							chunk,
							magicString.original,
							loc,
							magicString.sourcemapLocations
						);
					}
				} else {
					mappings.advance(chunk.content);
				}

				if (chunk.outro.length) mappings.advance(chunk.outro);
			});

			if (magicString.outro) {
				mappings.advance(magicString.outro);
			}
		});

		return {
			file: options.file ? options.file.split(/[/\\]/).pop() : null,
			sources: this.uniqueSources.map((source) => {
				return options.file ? getRelativePath(options.file, source.filename) : source.filename;
			}),
			sourcesContent: this.uniqueSources.map((source) => {
				return options.includeContent ? source.content : null;
			}),
			names,
			mappings: mappings.raw,
		};
	}

	generateMap(options) {
		return new SourceMap(this.generateDecodedMap(options));
	}

	getIndentString() {
		const indentStringCounts = {};

		this.sources.forEach((source) => {
			const indentStr = source.content.indentStr;

			if (indentStr === null) return;

			if (!indentStringCounts[indentStr]) indentStringCounts[indentStr] = 0;
			indentStringCounts[indentStr] += 1;
		});

		return (
			Object.keys(indentStringCounts).sort((a, b) => {
				return indentStringCounts[a] - indentStringCounts[b];
			})[0] || '\t'
		);
	}

	indent(indentStr) {
		if (!arguments.length) {
			indentStr = this.getIndentString();
		}

		if (indentStr === '') return this; // noop

		let trailingNewline = !this.intro || this.intro.slice(-1) === '\n';

		this.sources.forEach((source, i) => {
			const separator = source.separator !== undefined ? source.separator : this.separator;
			const indentStart = trailingNewline || (i > 0 && /\r?\n$/.test(separator));

			source.content.indent(indentStr, {
				exclude: source.indentExclusionRanges,
				indentStart, //: trailingNewline || /\r?\n$/.test( separator )  //true///\r?\n/.test( separator )
			});

			trailingNewline = source.content.lastChar() === '\n';
		});

		if (this.intro) {
			this.intro =
				indentStr +
				this.intro.replace(/^[^\n]/gm, (match, index) => {
					return index > 0 ? indentStr + match : match;
				});
		}

		return this;
	}

	prepend(str) {
		this.intro = str + this.intro;
		return this;
	}

	toString() {
		const body = this.sources
			.map((source, i) => {
				const separator = source.separator !== undefined ? source.separator : this.separator;
				const str = (i > 0 ? separator : '') + source.content.toString();

				return str;
			})
			.join('');

		return this.intro + body;
	}

	isEmpty() {
		if (this.intro.length && this.intro.trim()) return false;
		if (this.sources.some((source) => !source.content.isEmpty())) return false;
		return true;
	}

	length() {
		return this.sources.reduce(
			(length, source) => length + source.content.length(),
			this.intro.length
		);
	}

	trimLines() {
		return this.trim('[\\r\\n]');
	}

	trim(charType) {
		return this.trimStart(charType).trimEnd(charType);
	}

	trimStart(charType) {
		const rx = new RegExp('^' + (charType || '\\s') + '+');
		this.intro = this.intro.replace(rx, '');

		if (!this.intro) {
			let source;
			let i = 0;

			do {
				source = this.sources[i++];
				if (!source) {
					break;
				}
			} while (!source.content.trimStartAborted(charType));
		}

		return this;
	}

	trimEnd(charType) {
		const rx = new RegExp((charType || '\\s') + '+$');

		let source;
		let i = this.sources.length - 1;

		do {
			source = this.sources[i--];
			if (!source) {
				this.intro = this.intro.replace(rx, '');
				break;
			}
		} while (!source.content.trimEndAborted(charType));

		return this;
	}
}

const ANY_SLASH_REGEX = /[/\\]/;
function relative(from, to) {
    const fromParts = from.split(ANY_SLASH_REGEX).filter(Boolean);
    const toParts = to.split(ANY_SLASH_REGEX).filter(Boolean);
    if (fromParts[0] === '.')
        fromParts.shift();
    if (toParts[0] === '.')
        toParts.shift();
    while (fromParts[0] && toParts[0] && fromParts[0] === toParts[0]) {
        fromParts.shift();
        toParts.shift();
    }
    while (toParts[0] === '..' && fromParts.length > 0) {
        toParts.shift();
        fromParts.pop();
    }
    while (fromParts.pop()) {
        toParts.unshift('..');
    }
    return toParts.join('/');
}

function getOrCreate(map, key, init) {
    const existing = map.get(key);
    if (existing) {
        return existing;
    }
    const value = init();
    map.set(key, value);
    return value;
}

const UnknownKey = Symbol('Unknown Key');
const UnknownNonAccessorKey = Symbol('Unknown Non-Accessor Key');
const UnknownInteger = Symbol('Unknown Integer');
const EMPTY_PATH = [];
const UNKNOWN_PATH = [UnknownKey];
// For deoptimizations, this means we are modifying an unknown property but did
// not lose track of the object or are creating a setter/getter;
// For assignment effects it means we do not check for setter/getter effects
// but only if something is mutated that is included, which is relevant for
// Object.defineProperty
const UNKNOWN_NON_ACCESSOR_PATH = [UnknownNonAccessorKey];
const UNKNOWN_INTEGER_PATH = [UnknownInteger];
const EntitiesKey = Symbol('Entities');
class PathTracker {
    constructor() {
        this.entityPaths = Object.create(null, {
            [EntitiesKey]: { value: new Set() }
        });
    }
    trackEntityAtPathAndGetIfTracked(path, entity) {
        const trackedEntities = this.getEntities(path);
        if (trackedEntities.has(entity))
            return true;
        trackedEntities.add(entity);
        return false;
    }
    withTrackedEntityAtPath(path, entity, onUntracked, returnIfTracked) {
        const trackedEntities = this.getEntities(path);
        if (trackedEntities.has(entity))
            return returnIfTracked;
        trackedEntities.add(entity);
        const result = onUntracked();
        trackedEntities.delete(entity);
        return result;
    }
    getEntities(path) {
        let currentP