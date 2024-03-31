{
  "additionalProperties": false,
  "type": "object",
  "properties": {
    "additionalManifestEntries": {
      "description": "A list of entries to be precached, in addition to any entries that are\ngenerated as part of the build configuration.",
      "type": "array",
      "items": {
        "anyOf": [
          {
            "$ref": "#/definitions/ManifestEntry"
          },
          {
            "type": "string"
          }
        ]
      }
    },
    "dontCacheBustURLsMatching": {
      "description": "Assets that match this will be assumed to be uniquely versioned via their\nURL, and exempted from the normal HTTP cache-busting that's done when\npopulating the precache. While not required, it's recommended that if your\nexisting build process already inserts a `[hash]` value into each filename,\nyou provide a RegExp that will detect that, as it will reduce the bandwidth\nconsumed when precaching.",
      "$ref": "#/definitions/RegExp"
    },
    "manifestTransforms": {
      "description": "One or more functions which will be applied sequentially against the\ngenerated manifest. If `modifyURLPrefix` or `dontCacheBustURLsMatching` are\nalso specified, their corresponding transformations will be applied first.",
      "type": "array",
      "items": {}
    },
    "maximumFileSizeToCacheInBytes": {
      "description": "This value can be used to determine the maximum size of files that will be\nprecached. This prevents you from inadvertently precaching very large files\nthat might have accidentally matched one of your patterns.",
      "default": 2097152,
      "type": "number"
    },
    "modifyURLPrefix": {
      "description": "An object mapping string prefixes to replacement string values. This can be\nused to, e.g., remove or add a path prefix from a manifest entry if your\nweb hosting setup doesn't match your local filesystem setup. As an\nalternative with more flexibility, you can use the `manifestTransforms`\noption and provide a function that modifies the entries in the manifest\nusing whatever logic you provide.\n\nExample usage:\n\n```\n// Replace a '/dist/' prefix with '/', and also prepend\n// '/static' to every URL.\nmodifyURLPrefix: {\n  '/dist/': '/',\n  '': '/static',\n}\n```",
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "chunks": {
      "description": "One or more chunk names whose corresponding output files should be included\nin the precache manifest.",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "exclude": {
      "description": "One or more specifiers used to exclude assets from the precache manifest.\nThis is interpreted following\n[the same rules](https://webpack.js.org/configuration/module/#condition)\nas `webpack`'s standard `exclude` option.\nIf not provided, the default value is `[/\\.map$/, /^manifest.*\\.js$]`.",
      "type": "array",
      "items": {}
    },
    "excludeChunks": {
      "description": "One or more chunk names whose corresponding output files should be excluded\nfrom the precache manifest.",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "include": {
      "description": "One or more specifiers used to include assets in the precache manifest.\nThis is interpreted following\n[the same rules](https://webpack.js.org/configuration/module/#condition)\nas `webpack`'s standard `include` option.",
      "type": "array",
      "items": {}
    },
    "mode": {
      "description": "If set to 'production', then an optimized service worker bundle that\nexcludes debugging info will be produced. If not explicitly configured\nhere, the `process.env.NODE_ENV` value will be used, and failing that, it\nwill fall back to `'production'`.",
      "default": "production",
      "type": [
        "null",
        "string"
      ]
    },
    "babelPresetEnvTargets": {
      "description": "The [targets](https://babeljs.io/docs/en/babel-preset-env#targets) to pass\nto `babel-preset-env` when transpiling the service worker bundle.",
      "default": [
        "chrome >= 56"
      ],
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "cacheId": {
      "description": "An optional ID to be prepended to cache names. This is primarily useful for\nlocal development where multiple sites may be served from the same\n`http://localhost:port` origin.",
      "type": [
        "null",
        "string"
      ]
    },
    "cleanupOutdatedCaches": {
      "description": "Whether or not Workbox should attempt to identify and delete any precaches\ncreated by older, incompatible versions.",
      "default": false,
      "type": "boolean"
    },
    "clientsClaim": {
      "description": "Whether or not the service worker should [start controlling](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#clientsclaim)\nany existing clients as soon as it activates.",
      "default": false,
      "type": "boolean"
    },
    "directoryIndex": {
      "description": "If a navigation request for a URL ending in `/` fails to match a precached\nURL, this value will be appended to the URL and that will be checked for a\nprecache match. This should be set to what your web server is using for its\ndirectory index.",
      "type": [
        "null",
        "string"
      ]
    },
    "disableDevLogs": {
      "default": false,
      "type": "boolean"
    },
    "ignoreURLParametersMatching": {
      "description": "Any search parameter names that match against one of the RegExp in this\narray will be removed before looking for a precache match. This is useful\nif your users might request URLs that contain, for example, URL parameters\nused to track the source of the traffic. If not provided, the default value\nis `[/^utm_/, /^fbclid$/]`.",
      "type": "array",
      "items": {
        "$ref": "#/definitions/RegExp"
      }
    },
    "importScripts": {
      "description": "A list of JavaScript files that should be passed to\n[`importScripts()`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts)\ninside the generated service worker file. This is  useful when you want to\nlet Workbox create your top-level service worker file, but want to include\nsome additional code, such as a push event listener.",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "inlineWorkboxRuntime": {
      "description": "Whether the runtime code for the Workbox library should be included in the\ntop-level service worker, or split into a separate file that needs to be\ndeployed alongside the service worker. Keeping the runtime separate means\nthat users will not have to re-download the Workbox code each time your\ntop-level service worker changes.",
      "default": false,
      "type": "boolean"
    },
    "navigateFallback": {
      "description": "If specified, all\n[navigation requests](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests)\nfor URLs that aren't precached will be fulfilled with the HTML at the URL\nprovided. You must pass in the URL of an HTML document that is listed in\nyour precache manifest. This is meant to be used in a Single Page App\nscenario, in which you want all navigations to use common\n[App Shell HTML](https://developers.google.com/web/fundamentals/architecture/app-shell).",
      "default": null,
      "type": [
        "null",
        "string"
      ]
    },
    "navigateFallbackAllowlist": {
      "description": "An optional array of regular expressions that restricts which URLs the\nconfigured `navigateFallback` behavior applies to. This is useful if only a\nsubset of your site's URLs should be treated as being part of a\n[Single Page App](https://en.wikipedia.org/wiki/Single-page_application).\nIf both `navigateFallbackDenylist` and `navigateFallbackAllowlist` are\nconfigured, the denylist takes precedent.\n\n*Note*: These RegExps may be evaluated against every destination URL during\na navigation. Avoid using\n[complex RegExps](https://github.com/GoogleChrome/workbox/issues/3077),\nor else your users may see delays when navigating your site.",
      "type": "array",
      "items": {
        "$ref": "#/definitions/RegExp"
      }
    },
    "navigateFallbackDenylist": {
      "des