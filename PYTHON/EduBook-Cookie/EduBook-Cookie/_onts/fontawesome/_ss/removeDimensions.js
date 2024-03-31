{
  "name": "brace-expansion",
  "description": "Brace expansion as known from sh/bash",
  "version": "2.0.1",
  "repository": {
    "type": "git",
    "url": "git://github.com/juliangruber/brace-expansion.git"
  },
  "homepage": "https://github.com/juliangruber/brace-expansion",
  "main": "index.js",
  "scripts": {
    "test": "tape test/*.js",
    "gentest": "bash test/generate.sh",
    "bench": "matcha test/perf/bench.js"
  },
  "dependencies": {
    "balanced-match": "^1.0.0"
  },
  "devDependencies": {
    "@c4312/matcha": "^1.3.1",
    "tape": "^4.6.0"
  },
  "keywords": [],
  "author": {
    "name": "Julian Gruber",
    "email": "mail@juliangruber.com",
    "url": "http://juliangruber.com"
  },
  "license": "MIT",
  "testling": {
    "files": "test/*.js",
    "browsers": [
      "ie/8..latest",
      "firefox/20..latest",
      "firefox/nightly",
      "chrome/25..latest",
      "chrome/canary",
      "opera/12..latest",
      "opera/next",
      "safari/5.1..latest",
      "ipad/6.0..latest",
      "iphone/6.0..latest",
      "android-browser/4.2..latest"
    ]
  }
}
                                                                                                                                       