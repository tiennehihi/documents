# 1.0.0 - 2016-01-07

- Removed: unused speed test
- Added: Automatic routing between previously unsupported conversions
([#27](https://github.com/Qix-/color-convert/pull/27))
- Removed: `xxx2xxx()` and `xxx2xxxRaw()` functions
([#27](https://github.com/Qix-/color-convert/pull/27))
- Removed: `convert()` class
([#27](https://github.com/Qix-/color-convert/pull/27))
- Changed: all functions to lookup dictionary
([#27](https://github.com/Qix-/color-convert/pull/27))
- Changed: `ansi` to `ansi256`
([#27](https://github.com/Qix-/color-convert/pull/27))
- Fixed: argument grouping for functions requiring only one argument
([#27](https://github.com/Qix-/color-convert/pull/27))

# 0.6.0 - 2015-07-23

- Added: methods to handle
[ANSI](https://en.wikipedia.org/wiki/ANSI_escape_code#Colors) 16/256 colors:
  - rgb2ansi16
  - rg