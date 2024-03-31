chunks (including itself)
	 */
	getAllReferencedChunks() {
		const queue = new Set(this.groupsIterable);
		const chunks = new Set();

		for (const chunkGroup of queue) {
			for (const chunk of chunkGroup.chunks) {
				chunks.add(chunk);
			}
			for (const child of chunkGroup.childrenIterable) {
				queue.add(child);
			}
		}

		return chunks;
	}

	/**
	 * @returns {Set<Entrypoint>} a set of all the referenced entrypoints
	 */
	getAllReferencedAsyncEntrypoints() {
		const queue = new Set(this.groupsIterable);
		const entrypoints = new Set();

		for (const chunkGroup of queue) {
			for (const entrypoint of chunkGroup.asyncEntrypointsIterable) {
				entrypoints.add(entrypoint);
			}
			for (const child of chunkGroup.childrenIterable) {
				queue.add(child);
			}
		}

		return entrypoints;
	}

	/**
	 * @returns {boolean} true, if the chunk references async chunks
	 */
	hasAsyncChunks() {
		const queue = new Set();

		const initialChunks = intersect(
			Array.from(this.groupsIterable, g => new Set(g.chunks))
		);

		for (const chunkGroup of this.groupsIterable) {
			for (const child of chunkGroup.childrenIterable) {
				queue.add(child);
			}
		}

		for (const chunkGroup of queue) {
			for (const chunk of chunkGroup.chunks) {
				if (!initialChunks.has(chunk)) {
					return true;
				}
			}
			for (const child of chunkGroup.childrenIterable) {
				queue.add(child);
			}
		}

		return false;
	}

	/**
	 * @param {ChunkGraph} chunkGraph the chunk graph
	 * @param {ChunkFilterPredicate=} filterFn function used to filter chunks
	 * @returns {Record<string, (string | number)[]>} a record object of names to lists of child ids(?)
	 */
	getChildIdsByOrders(chunkGraph, filterFn) {
		/** @type {Map<string, {order: number, group: ChunkGroup}[]>} */
		const l