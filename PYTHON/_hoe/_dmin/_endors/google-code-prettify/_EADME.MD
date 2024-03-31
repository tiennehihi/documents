# Changelog

## 6.0.0

- **Breaking change:** The package now has named exports. See examples below.
- **Breaking change:** Separate async and sync APIs, accessible from different named exports. If you used `explorer.searchSync()` or `explorer.loadSync()`, you'll now create a sync explorer with `cosmiconfigSync()`, then use `explorerSync.search()` and `explorerSync.load()`.

  ```js
  // OLD: cosmiconfig v5
  import cosmiconfig from 'cosmiconfig';

  const explorer = cosmiconfig('example');
  const searchAsyncResult = await explorer.search();
  const loadAsyncResult = await explorer.load('./file/to/load');
  const searchSyncResult = explorer.searchSync();
  const loadSyncResult = explorer.loadSync('./file/to/load');

  // NEW: cosmiconfig v6
  import { cosmiconfig, cosmiconfigSync } from 'cosmiconfig';

  const explorer = cosmiconfig('example');
  const searchAsyncResult = await explorer.search();
  const loadAsyncResult = await explorer.load('./file/to/load');

  const explorerSync = cosmiconfigSync('example');
  const searchSyncResult = explorerSync.search();
  const loadSyncResult = explorerSync.load('./file/to/load');
  ```
- **Breaking change:** Remove support for Node 4 and 6. Requires Node 8+.
- **Breaking change:** Use npm package [yaml](https://www.npmjs.com/package/yaml) to parse YAML instead of npm pack