# minimatch

A minimal matching utility.

This is the matching library used internally by npm.

It works by converting glob expressions into JavaScript `RegExp`
objects.

## Usage

```js
// hybrid module, load with require() or import
import { minimatch } from 'minimatch'
// or:
const { minimatch } = require('minimatch')

minimatch('bar.foo', '*.foo') // true!
minimatch('bar.foo', '*.bar') // false!
minimatch('bar.foo', '*.+(bar|foo)', { debug: true }) // true, and noisy!
```

## Features

Supports these glob features:

- Brace Expansion
- Extended glob matching
- "Globstar" `**` matching
- [Posix character
  classes](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html),
  like `[[:alpha:]]`, supporting the full range of Unicode
  characters. For example, `[[:alpha:]]` will match against
  `'é'`, though `[a-zA-Z]` will not. Collating symbol and set
  matching is not supported, so `[[=e=]]` will _not_ match `'é'`
  and `[[.ch.]]` will not match `'ch'` in locales where `ch` is
  considered a single character.

See:

- `man sh`
- `man bash` [Pattern
  Matching](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html)
- `man 3 fnmatch`
- `man 5 gitignore`

## Windows

**Please only use forward-slashes in glob expressions.**

Though windows uses either `/` or `\` as its path separator, only `/`
characters are used by this glob implementation. You must use
forward-slashes **only** in glob expressions. Back-slashes in patterns
will always be interpreted as escape characters, not path separators.

Note that `\` or `/` _will_ be interpreted as path separators in paths on
Windows, and will match against `/` in glob expressions.

So just always use `/` in patterns.

### UNC Paths

On Windows, UNC paths like `//?/c:/..