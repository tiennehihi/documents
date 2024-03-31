DecoratorContextType;
  var deferredGlobalClassAccessorDecoratorTargetType;
  var deferredGlobalClassAccessorDecoratorResultType;
  var deferredGlobalClassFieldDecoratorContextType;
  var allPotentiallyUnusedIdentifiers = /* @__PURE__ */ new Map();
  var flowLoopStart = 0;
  var flowLoopCount = 0;
  var sharedFlowCount = 0;
  var flowAnalysisDisabled = false;
  var flowInvocationCount = 0;
  var lastFlowNode;
  var lastFlowNodeReachable;
  var flowTypeCache;
  var contextualTypeNodes = [];
  var contextualTypes = [];
  var contextualIsCache = [];
  var contextualTypeCount = 0;
  var inferenceContextNodes = [];
  var inferenceContexts =