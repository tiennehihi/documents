ctual root directory on the filesystem, and any non-absolute
  patterns will be matched in the `cwd`. For example, the
  pattern `/../*` with `{root:'/some/path'}` will return all
  files in `/some`, not all files in `/some/path`. The pattern
  `*` with `{root:'/some/path'}` will return all the entries in
  the cwd, not the entries in `/some/path`.

  To start absolute and non-absolute patterns in the same
  path, you can use `{root:''}`. However, be aware that on
  Windows systems, a pattern like `x:/*` or `//host/share/*` will
  _always_ start in the `x:/` or `//host/share` directory,
  regardless of the `root` setting.

- `windowsPathsNoEscape` Use `\\` as a path separator _only_, and
  _never_ as an escape character. If set, all `\\` characters are
  replaced with `/` in the pattern.

  Note that this makes it **impossible** to match against paths
  containing literal glob pattern characters, but allows matching
  with patterns constructed using `path.join()` and
  `path.resolve()` on Windows platforms, mimicking the (buggy!)
  behavior of Glob v7 and before on Windows. Please use with
  caution, and be mindful of [the caveat below about Windows
  paths](#windows). (For legacy reasons, this is also set if
  `allowWindowsEscape` is set to the exact value `false`.)

- `dot` Include `.dot` files in normal matches and `globstar`
  matches. Note that an explicit dot in a portion of the pattern
  will always match dot files.

- `magicalBraces` Treat brace expansion like `{a,b}` as a "magic"
  pattern. Has no effect if {@link nobrace} is set.

  Only has effect on the {@link hasMagic} function, no effect on
  glob pattern matching itself.

- `dotRelative` Prepend all relative path strings with `./` (or
  `.\` on Windows).

  Without this option, returned relative paths are "bare", so
  instead of returning `'./foo/bar'`, they are returned as
  `'foo/bar'`.

  Relative patterns starting with `'../'` are not prepended with
  `./`, even if this option is set.

- `mark` Add a `/` character to directory matches. Note that this
  requires additional stat calls.

- `nobrace` Do not expand `{a,b}` and `{1..3}` brace sets.

- `noglobstar` Do not match `**` against multiple filenames. (Ie,
  treat it as a normal `*` instead.)

- `noext` Do not match "extglob" patterns such as `+(a|b)`.

- `nocase` Perform a case-insensitive match. This defaults to
  `true` on macOS and Windows systems, and `false` on all others.

  **Note** `nocase` should only be explicitly set when it is
  known that the filesystem's case sensitivity differs from the
  platform default. If set `true` on case-sensitive file
  systems, or `false` on case-insensitive file systems, then the
  walk may return more or less results than expected.

- `maxDepth` Specify a number to limit the depth of the directory
  traversal to this many levels below the `cwd`.

- `matchBase` Perform a basename-only match if the pattern does
  not contain any slash characters. That is, `*.js` would be
  treated as equivalent to `**/*.js`, matching all js files in
  all directories.

- `nodir` Do not match directories, only files. (Note: to match
  _only_ directories, put a `/` at the end of the pattern.)

- `stat` Call `lstat()` on all entries, whether required or not
  to determine whether it's a valid match. When used with
  `withFileTypes`, this means that matches will include data such
  as modified time, permissions, and so on. Note that this will
  incur a performance cost due to the added system calls.

- `ignore` string or string[], or an object with `ignore` and
  `ignoreChildren` methods.

  If a string or string[] is provided, then this is treated as a
  glob pattern or array of glob patterns to exclude from matches.
  To ignore all children within a directory, as well as the entry
  itself, append `'/**'` to the ignore pattern.

  **Note** `ignore` patterns are _always_ in `dot:true` mode,
  regardless of any other settings.

  If an object is provided that has `ignored(path)` and/or
  `childrenIgnored(path)` methods, then these methods will be
  called to determine whether any Path is a match or if its
  children should be traversed, respectively.

- `follow` Follow symlinked directories when expanding `**`
  patterns. This can result in a lot of duplicate references in
  the presence of cyclic links, and make performance quite bad.

  By default, a `**` in a pattern will follow 1 symbolic link if
  it is not the first item in the pattern, or none if it is the
  first item in the pattern, following the same behavior as Bash.

- `realpath` Set to true to call `fs.realpath` on all of the
  results. In the case of an entry that cannot be resolved, the
  entry is omitted. This incurs a slight performance penalty, of
  course, because of the added system calls.

- `absolute` Set to true to always receive absolute paths for
  matched files. Set to `false` to always receive relative paths
  for matched files.

  By default, when this option is not set, absolute paths are
  returned for patterns that are absolute, and otherwise paths
  are returned that are relative to the `cwd` setting.

  This does _not_ make an extra system call to get the realpath,
  it only does string path resolution.

  `absolute` may not be used along with `withFileTypes`.

- `posix` Set to true to use `/` as the path separator in
  returned results. On posix systems, this has no effect. On
  Windows systems, this will return `/` delimited path results,
  and absolute paths will be returned in their full resolved UNC
  path form, eg insted of `'C:\\foo\\bar'`, it will return
  `//?/C:/foo/bar`.

- `platform` Defaults to value of `process.platform` if
  available, or `'linux'` if not. Setting `platform:'win32'` on
  non-Windows systems may cause strange behavior.

- `withFileTypes` Return [PathScurry](http://npm.im/path-scurry)
  `Path` objects instead of strings. These are similar to a
  NodeJS `Dirent` object, but with additional methods and
  properties.

  `withFileTypes` may not be used along with `absolute`.

- `signal` An AbortSignal which will cancel the Glob walk when
  triggered.

- `fs` An override object to pass in custom filesystem methods.
  See [PathScurry docs](http://npm.im/path-scurry) for what can
  be overridden.

- `scurry` A [PathScurry](http://npm.im/path-scurry) object used
  to traverse the file system. If the `nocase` option is set
  explicitly, then any provided `scurry` object must match this
  setting.

## Glob Primer

Much more information about glob pattern expansion can be found
by running `man bash` and searching for `Pattern Matching`.

"Globs" are the patterns you type when you do stuff like `ls
*.js` on the command line, or put `build/*` in a `.gitignore`
file.

Before parsing the path part patterns, braced sections are
expanded into a set. Braced sections start with `{` and end with
`}`, with 2 or more comma-delimited sections within. Braced
sections may contain slash characters, so `a{/b/c,bcd}` would
expand into `a/b/c` and `abcd`.

The following characters have special magic meaning when used in
a path portion. With the exception of `**`, none of these match
path separators (ie, `/` on all platforms, and `\` on Windows).

- `*` Matches 0 or more characters in a single path portion.
  When alone in a path portion, it must match at least 1
  character. If `dot:true` is not specified, then `*` will not
  match against a `.` character at the start of a path portion.
- `?` Matches 1 character. If `dot:true` is not specified, then
  `?` will not match against a `.` character at the start of a
  path portion.
- `[...]` Matches a range of characters, similar to a RegExp
  range. If the first character of the range is `!` or `^` then
  it matches any character not in the range. If the first
  character is `]`, then it will be considered the same as `\]`,
  rather than the end of the character class.
- `!(pattern|pattern|pattern)` Matches anything that does not
  match any of the patterns provided. May _not_ contain `/`
  characters. Similar to `*`, if alone in a path portion, then
  the path portion must have at least one character.
- `?(pattern|pattern|pattern)` Matches zero or one occurrence of
  the patterns provided. May _not_ contain `/` characters.
- `+(pattern|pattern|pattern)` Matches one or more occurrences of
  the patterns provided. May _not_ contain `/` characters.
- `*(a|b|c)` Matches zero or more occurrences of the patterns
  provided. May _not_ contain `/` characters.
- `@(pattern|pat*|pat?erN)` Matches exactly one of the patterns
  provided. May _not_ contain `/` characters.
- `**` If a "globstar" is alone in a path portion, then it
  matches zero or more directories and subdirectories searching
  for matches. It does not crawl symlinked directories, unless
  `{follow:true}` is passed in the options object. A pattern
  like `a/b/**` will only match `a/b` if it is a directory.
  Follows 1 symbolic link if not the first item in the pattern,
  or 0 if it is the first item, unless `follow:true` is set, in
  which case it follows all symbolic links.

`[:class:]` patterns are supported by this implementation, but
`[=c=]` and `[.symbol.]` style class patterns are not.

### Dots

If a file or directory path portion has a `.` as the first
character, then it will not match any glob pattern unless that
pattern's corresponding path part also has a `.` as its first
character.

For example, the pattern `a/.*/c` would match the file at
`a/.b/c`. However the pattern `a/*/c` would not, because `*` does
not start with a dot character.

You can make glob treat dots as normal characters by setting
`dot:true` in the options.

### Basename Matching

If you set `matchBase:true` in the options, and the pattern has
no slashes in it, then it will seek for any file anywhere in the
tree with a matching basename. For example, `*.js` would match
`test/simple/basic.js`.

### Empty Sets

If no matching files are found, then an empty array is returned.
This differs from the shell, where the pattern itself is
returned. For example:

```sh
$ echo a*s*d*f
a*s*d*f
```

## Comparisons to other fnmatch/glob implementations

While strict compliance with the existing standards is a
worthwhile goal, some discrepancies exist between node-glob and
other implementations, and are intentional.

The double-star character `**` is supported by default, unless
the `noglobstar` flag is set. This is supported in the manner of
bsdglob and bash 5, where `**` only has special significance if
it is the only thing in a path part. That is, `a/**/b` will match
`a/x/y/b`, but `a/**b` will not.

Note that symlinked directories are not traversed as part of a
`**`, though their contents may match against subsequent portions
of the pattern. This prevents infinite loops and duplicates and
the like. You can force glob to traverse symlinks with `**` by
setting `{follow:true}` in the options.

There is no equivalent of the `nonull` option. A pattern that
does not find any matches simply resolves to nothing. (An empty
array, immediately ended stream, etc.)

If brace expansion is not disabled, then it is performed before
any other interpretation of the glob pattern. Thus, a pattern
like `+(a|{b),c)}`, which would not be valid in bash or zsh, is
expanded **first** into the set of `+(a|b)` and `+(a|c)`, and
those patterns are checked for validity. Since those two are
valid, matching proceeds.

The character class patterns `[:class:]` (posix standard named
classes) style class patterns are supported and unicode-aware,
but `[=c=]` (locale-specific character collation weight), and
`[.symbol.]` (collating symbol), are not.

### Repeated Slashes

Unlike Bash and zsh, repeated `/` are always coalesced into a
single path separator.

### Comments and Negation

Previously, this module let you mark a pattern as a "comment" if
it started with a `#` character, or a "negated" pattern if it
started with a `!` character.

These options were deprecated in version 5, and removed in
version 6.

To specify things that should not match, use the `ignore` option.

## Windows

**Please only use forward-slashes in glob expressions.**

Though windows uses either `/` or `\` as its path separator, only
`/` characters are used by this glob implementation. You must use
forward-slashes **only** in glob expressions. Back-slashes will
always be interpreted as escape characters, not path separators.

Results from absolute patterns such as `/foo/*` are mounted onto
the root setting using `path.join`. On windows, this will by
default result in `/foo/*` matching `C:\foo\bar.txt`.

To automatically coerce all `\` characters to `/` in pattern
strings, **thus making it impossible to escape literal glob
characters**, you may set the `windowsPathsNoEscape` option to
`true`.

### Windows, CWDs, Drive Letters, and UNC Paths

On posix systems, when a pattern starts with `/`, any `cwd`
option is ignored, and the traversal starts at `/`, plus any
non-magic path portions specified in the pattern.

On Windows systems, the behavior is similar, but the concept of
an "absolute path" is somewhat more involved.

#### UNC Paths

A UNC path may be used as the start of a pattern on Windows
platforms. For example, a pattern like: `//?/x:/*` will return
all file entries in the root of the `x:` drive. A pattern like
`//ComputerName/Share/*` will return all files in the associated
share.

UNC path roots are always compared case insensitively.

#### Drive Letters

A pattern starting with a drive letter, like `c:/*`, will search
in that drive, regardless of any `cwd` option provided.

If the pattern starts with `/`, and is not a UNC path, and there
is an explicit `cwd` option set with a drive letter, then the
drive letter in the `cwd` is used as the root of the directory
traversal.

For example, `glob('/tmp', { cwd: 'c:/any/thing' })` will return
`['c:/tmp']` as the result.

If an explicit `cwd` option is not provided, and the pattern
starts with `/`, then the traversal will run on the root of the
drive provided as the `cwd` option. (That is, it is the result of
`path.resolve('/')`.)

## Race Conditions

Glob searching, by its very nature, is susceptible to race
conditions, since it relies on directory walking.

As a result, it is possible that a file that exists when glob
looks for it may have been deleted or modified by the time it
returns the result.

By design, this implementation caches all readdir calls that it
makes, in order to cut down on system overhead. However, this
also makes it even more susceptible to races, especially if the
cache object is reused between glob calls.

Users are thus advised not to use a glob result as a guarantee of
filesystem state in the face of rapid changes. For the vast
majority of operations, this is never a problem.

### See Also:

- `man sh`
- `man bash` [Pattern
  Matching](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html)
- `man 3 fnmatch`
- `man 5 gitignore`
- [minimatch documentation](https://github.com/isaacs/minimatch)

## Glob Logo

Glob's logo was created by [Tanya
Brassie](http://tanyabrassie.com/). Logo files can be found
[here](https://github.com/isaacs/node-glob/tree/master/logo).

The logo is licensed under a [Creative Commons
Attribution-ShareAlike 4.0 International
License](https://creativecommons.org/licenses/by-sa/4.0/).

## Contributing

Any change to behavior (including bugfixes) must come with a
test.

Patches that fail tests or reduce performance will be rejected.

```sh
# to run tests
npm test

# to re-generate test fixtures
npm run test-regen

# run the benchmarks
npm run bench

# to profile javascript
npm run prof
```

## Comparison to Other JavaScript Glob Implementations

**tl;dr**

- If you want glob matching that is as faithful as possible to
  Bash pattern expansion semantics, and as fast as possible
  within that constraint, _use this module_.
- If you are reasonably sure that the patterns you will encounter
  are relatively simple, and want the absolutely fastest glob
  matcher out there, _use [fast-glob](http://npm.im/fas