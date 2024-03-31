var fs = require('fs');
var path = require('path');

var isAllowedResource = require('./is-allowed-resource');

var hasProtocol = require('../utils/has-protocol');
var isRemoteResource = require('../utils/is-remote-resource');

function loadOriginalSources(context, callback) {
  var loadContext = {
    callback: callback,
    fetch: context.options.fetch,
    index: 0,
    inline: context.options.inline,
    inlineRequest: context.options.inlineRequest,
    inlineTimeout: context.options.inlineTimeout,
    localOnly: context.localOnly,
    rebaseTo: context.options.rebaseTo,
    sourcesContent: context.sourcesContent,
    uriToSource: uriToSourceMapping(context.inputSourceMapTracker.all()),
    warnings: context.warnings
  };

  return context.options.sourceMap && context.options.sourceMapInlineSources
    ? doLoadOriginalSources(loadContext)
    : callback();
}

function ur