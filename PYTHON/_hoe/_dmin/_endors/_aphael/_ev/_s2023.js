# open

> Open stuff like URLs, files, executables. Cross-platform.

This is meant to be used in command-line tools and scripts, not in the browser.

If you need this for Electron, use [`shell.openPath()`](https://www.electronjs.org/docs/api/shell#shellopenpathpath) instead.

This package does not make any security guarantees. If you pass in untrusted input, it's up to you to properly sanitize it.

#### Why?

- Actively maintained.
- Supports app arguments.
- Safer as it uses `spawn` instead of `exec`.
- Fixes mos