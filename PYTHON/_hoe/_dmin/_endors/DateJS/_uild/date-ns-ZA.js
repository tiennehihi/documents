.           �d�mXmX  e�mX�    ..          �d�mXmX  e�mXv    BUILD      �f�mXmX  g�mX��    A       JS  �s�mXmX  u�mX1��  ENTRY   JS  ��mXmX  ��mX㽊                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  alidation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            // eslint-disable-next-line react-internal/prod-error-codes
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

          setCurrentlyValidatingElement(null);
        }

        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error('Failed %s type: %s', location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

var warnedAboutMissingGetChildContext;

{
  warnedAboutMissingGetChildContext = {};
}

var emptyContextObject = {};

{
  Object.freeze(emptyContextObject);
}

function getMaskedContext(type, unmaskedContext) {
  {
    var contextTypes = type.contextTypes;

    if (!contextTypes) {
      return emptyContextObject;
    }

    var context = {};

    for (var key in contextTypes) {
      context[key] = unmaskedContext[key];
    }

    {
      var name = getComponentNameFromType(type) || 'Unknown';
      checkPropTypes(contextTypes, context, 'context', name);
    }

    return context;
  }
}
function processChildContext(instance, type, parentContext, childContextTypes) {
  {
    // TODO (bvaughn) Replace this behavior with an invariant() in the future.
    // It has only been added in Fiber to match the (unintentional) behavior in Stack.
    if (typeof instance.getChildContext !== 'function') {
      {
        var componentName = getComponentNameFromType(type) || 'Unknown';

        if (!warnedAboutMissingGetChildContext[componentName]) {
          warnedAboutMissingGetChildContext[componentName] = true;

          error('%s.childContextTypes is specified but there is no getChildContext() method ' + 'on the instance. You can either define getChildContext() on %s or remove ' + 'childContextTypes from it.', componentName, componentName);
        }
      }

      return parentContext;
    }

    var childContext = instance.getChildContext();

    for (var contextKey in childContext) {
      if (!(contextKey in childContextTypes)) {
        throw new Error((getComponentNameFromType(type) || 'Unknown') + ".getChildContext(): key \"" + contextKey + "\" is not defined in childContextTypes.");
      }
    }

    {
      var name = getComponentNameFromType(type) || 'Unknown';
      checkPropTypes(childContextTypes, childContext, 'child context', name);
    }

    return assign({}, parentContext, childContext);
  }
}

var rendererSigil;

{
  // Use this to detect multiple renderers using the same context
  rendererSigil = {};
} // Used to store the parent path of all context overrides in a shared linked list.
// Forming a reverse tree.


var rootContextSnapshot = null; // We assume that this runtime owns the "current" field on all ReactContext instances.
// This global (actually thread local) state represents what state all those "current",
// fields are currently in.

var currentActiveSnapshot = null;

function popNode(prev) {
  {
    prev.context._currentValue2 = prev.parentValue;
  }
}

function pushNode(next) {
  {
    next.context._currentValue2 = next.value;
  }
}

function popToNearestCommonAncestor(prev, next) {
  if (prev === next) ; else {
    popNode(prev);
    var parentPrev = prev.parent;
    var parentNext = next.parent;

    if (parentPrev === null) {
      if (parentNext !== null) {
        throw new Error('The stacks must reach the root at the same time. This is a bug in React.');
      }
    } else {
      if (parentNext === null) {
        throw new Error('The stacks must reach the root at the same time. This is a bug in React.');
      }

      popToNearestCommonAncestor(parentPrev, parentNext);
    } // On the way back, we push the new ones that weren't common.


    pushNode(next);
  }
}

function popAllPrevious(prev) {
  popNode(prev);
  var parentPrev = prev.parent;

  if (parentPrev !== null) {
    popAllPrevious(parentPrev);
  }
}

function pushAllNext(next) {
  var parentNext = next.parent;

  if (parentNext !== null) {
    pushAllNext(parentNext);
  }

  pushNode(next);
}

function popPreviousToCommonLevel(prev, next) {
  popNode(prev);
  var parentPrev = prev.parent;

  if (parentPrev === null) {
    throw new Error('The depth must equal at least at zero before reaching the root. This is a bug in React.');
  }

  if (parentPrev.depth === next.depth) {
    // We found the same level. Now we just need to find a shared ancestor.
    popToNearestCommonAncestor(parentPrev, next);
  } else {
    // We must still be deeper.
    popPreviousToCommonLevel(parentPrev, next);
  }
}

function popNextToCommonLevel(prev, next) {
  var parentNext = next.parent;

  if (parentNext === null) {
    throw new Error('The depth must equal at least at zero before reaching the root. This is a bug in React.');
  }

  if (prev.depth === parentNext.depth) {
    // We found the same level. Now we just need to find a shared ancestor.
    popToNearestCommonAncestor(prev, parentNext);
  } else {
    // We must still be deeper.
    popNextToCommonLevel(prev, parentNext);
  }

  pushNode(next);
} // Perform context switching to the new snapshot.
// To make it cheap to read many contexts, while not suspending, we make the switch eagerly by
// updating all the context's current values. That way reads, always just read the current value.
// At the cost of updating contexts even if they're never read by this subtree.


function switchContext(newSnapshot) {
  // The basic algorithm we need to do is to pop back any contexts that are no longer on the stack.
  // We also need to update any new contexts that are now on the stack with the deepest value.
  // The easiest way to update new contexts is to just reapply them in reverse order from the
  // perspective of the backpointers. To avoid allocating a lot when switching, we use the stack
  // for that. Therefore this algorithm is recursive.
  // 1) First we pop which ever snapshot tree was deepest. Popping old contexts as we go.
  // 2) Then we find the nearest common ancestor from there. Popping old contexts as we go.
  // 3) Then we reapply new contexts on the way back up the stack.
  var prev = currentActiveSnapshot;
  var next = newSnapshot;

  if (prev !== next) {
    if (prev === null) {
      // $FlowFixMe: This has to be non-null since it's not equal to prev.
      pushAllNext(next);
    } else if (next === null) {
      popAllPrevious(prev);
    } else if (prev.depth === next.depth) {
      popToNearestCommonAncestor(prev, next);
    } else if (prev.depth > next.depth) {
      popPreviousToCommonLevel(prev, next);
    } else {
      popNextToCommonLevel(prev, next);
    }

    currentActiveSnapshot = next;
  }
}
function pushProvider(context, nextValue) {
  var prevValue;

  {
    prevValue = context._currentValue2;
    context._currentValue2 = nextValue;

    {
      if (context._currentRenderer2 !== undefined && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
        error('Detected multiple renderers concurrently rendering the ' + 'same context provider. This is currently unsupported.');
      }

      context._currentRenderer2 = rendererSigil;
    }
  }

  var prevNode = currentActiveSnapshot;
  var newNode = {
    parent: prevNode,
    depth: prevNode === null ? 0 : prevNode.depth + 1,
    context: context,
    parentValue: prevValue,
    value: nextValue
  };
  currentActiveSnapshot = newNode;
  return newNode;
}
function popProvider(context) {
  var prevSnapshot = currentActiveSnapshot;

  if (prevSnapshot === null) {
    throw new Error('Tried to pop a Context at the root of the app. This is a bug in React.');
  }

  {
    if (prevSnapshot.context !== context) {
      error('The parent context is not the expected context. This is probably a bug in React.');
    }
  }

  {
    var _value = prevSnapshot.parentValue;

    if (_value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
      prevSnapshot.context._currentValue2 = prevSnapshot.context._defaultValue;
    } else {
      prevSnapshot.context._currentValue2 = _value;
    }

    {
      if (context._currentRenderer2 !== undefined && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
        error('Detected multiple renderers concurrently rendering the ' + 'same context provider. This is currently unsupported.');
      }

      context._currentRenderer2 = rendererSigil;
    }
  }

  return currentActiveSnapshot = prevSnapshot.parent;
}
function getActiveContext() {
  return currentActiveSnapshot;
}
function readContext(context) {
  var value =  context._currentValue2;
  return value;
}

/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 *
 * Note that this module is currently shared and assumed to be stateless.
 * If this becomes an actual Map, that will break.
 */
function get(key) {
  return key._reactInternals;
}
function set(key, value) {
  key._reactInternals = value;
}

var didWarnAboutNoopUpdateForComponent = {};
var didWarnAboutDeprecatedWillMount = {};
var didWarnAboutUninitializedState;
var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
var didWarnAboutLegacyLifecyclesAndDerivedState;
var didWarnAboutUndefinedDerivedState;
var warnOnUndefinedDerivedState;
var warnOnInvalidCallback;
var didWarnAboutDirectlyAssigningPropsToState;
var didWarnAboutContextTypeAndContextTypes;
var didWarnAboutInvalidateContextType;

{
  didWarnAboutUninitializedState = new Set();
  didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = new Set();
  didWarnAboutLegacyLifecyclesAndDerivedState = new Set();
  didWarnAboutDirectlyAssigningPropsToState = new Set();
  didWarnAboutUndefinedDerivedState = new Set();
  didWarnAboutContextTypeAndContextTypes = new Set();
  didWarnAboutInvalidateContextType = new Set();
  var didWarnOnInvalidCallback = new Set();

  warnOnInvalidCallback = function (callback, callerName) {
    if (callback === null || typeof callback === 'function') {
      return;
    }

    var key = callerName + '_' + callback;

    if (!didWarnOnInvalidCallback.has(key)) {
      didWarnOnInvalidCallback.add(key);

      error('%s(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callerName, callback);
    }
  };

  warnOnUndefinedDerivedState = function (type, partialState) {
    if (partialState === undefined) {
      var componentName = getComponentNameFromType(type) || 'Component';

      if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
        didWarnAboutUndefinedDerivedState.add(componentName);

        error('%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. ' + 'You have returned undefined.', componentName);
      }
    }
  };
}

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && getComponentNameFromType(_constructor) || 'ReactClass';
    var warningKey = componentName + '.' + callerName;

    if (didWarnAboutNoopUpdateForComponent[warningKey]) {
      return;
    }

    error('%s(...): Can only update a mounting component. ' + 'This usually means you called %s() outside componentWillMount() on the server. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, componentName);

    didWarnAboutNoopUpdateForComponent[warningKey] = true;
  }
}

var classComponentUpdater = {
  isMounted: function (inst) {
    return false;
  },
  enqueueSetState: function (inst, payload, callback) {
    var internals = get(inst);

    if (internals.queue === null) {
      warnNoop(inst, 'setState');
    } else {
      internals.queue.push(payload);

      {
        if (callback !== undefined && callback !== null) {
          warnOnInvalidCallback(callback, 'setState');
        }
      }
    }
  },
  enqueueReplaceState: function (inst, payload, callback) {
    var internals = get(inst);
    internals.replace = true;
    internals.queue = [payload];

    {
      if (callback !== undefined && callback !== null) {
        warnOnInvalidCallback(callback, 'setState');
      }
    }
  },
  enqueueForceUpdate: function (inst, callback) {
    var internals = get(inst);

    if (internals.queue === null) {
      warnNoop(inst, 'forceUpdate');
    } else {
      {
        if (callback !== undefined && callback !== null) {
          warnOnInvalidCallback(callback, 'setState');
        }
      }
    }
  }
};

function applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, prevState, nextProps) {
  var partialState = getDerivedStateFromProps(nextProps, prevState);

  {
    warnOnUndefinedDerivedState(ctor, partialState);
  } // Merge the partial state and the previous state.


  var newState = partialState === null || partialState === undefined ? prevState : assign({}, prevState, partialState);
  return newState;
}

function constructClassInstance(ctor, props, maskedLegacyContext) {
  var context = emptyContextObject;
  var contextType = ctor.contextType;

  {
    if ('contextType' in ctor) {
      var isValid = // Allow null for conditional declaration
      contextType === null || contextType !== undefined && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === undefined; // Not a <Context.Consumer>

      if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
        didWarnAboutInvalidateContextType.add(ctor);
        var addendum = '';

        if (contextType === undefined) {
          addendum = ' However, it is set to undefined. ' + 'This can be caused by a typo or by mixing up named and default imports. ' + 'This can also happen due to a circular dependency, so ' + 'try moving the createContext() call to a separate file.';
        } else if (typeof contextType !== 'object') {
          addendum = ' However, it is set to a ' + typeof contextType + '.';
        } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
          addendum = ' Did you accidentally pass the Context.Provider instead?';
        } else if (contextType._context !== undefined) {
          // <Context.Consumer>
          addendum = ' Did you accidentally pass the Context.Consumer instead?';
        } else {
          addendum = ' However, it is set to an object with keys {' + Object.keys(contextType).join(', ') + '}.';
        }

        error('%s defines an invalid contextType. ' + 'contextType should point to the Context object returned by React.createContext().%s', getComponentNameFromType(ctor) || 'Component', addendum);
      }
    }
  }

  if (typeof contextType === 'object'                     // TODO(philipwalton): TypeScript errors without this typecast for\n                    // some reason (probably a bug). The real type here should work but\n                    // doesn't: `Array<Promise<Response> | undefined>`.\n                })); // TypeScript\n                event.waitUntil(requestPromises);\n                // If a MessageChannel was used, reply to the message on success.\n                if (event.ports && event.ports[0]) {\n                    void requestPromises.then(() => event.ports[0].postMessage(true));\n                }\n            }\n        }));\n    }\n    /**\n     * Apply the routing rules to a FetchEvent object to get a Response from an\n     * appropriate Route's handler.\n     *\n     * @param {Object} options\n     * @param {Request} options.request The request to handle.\n     * @param {ExtendableEvent} options.event The event that triggered the\n     *     request.\n     * @return {Promise<Response>|undefined} A promise is returned if a\n     *     registered route can handle the request. If there is no matching\n     *     route and there's no `defaultHandler`, `undefined` is returned.\n     */\n    handleRequest({ request, event, }) {\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isInstance(request, Request, {\n                moduleName: 'workbox-routing',\n                className: 'Router',\n                funcName: 'handleRequest',\n                paramName: 'options.request',\n            });\n        }\n        const url = new URL(request.url, location.href);\n        if (!url.protocol.startsWith('http')) {\n            if (process.env.NODE_ENV !== 'production') {\n                logger.debug(`Workbox Router only supports URLs that start with 'http'.`);\n            }\n            return;\n        }\n        const sameOrigin = url.origin === location.origin;\n        const { params, route } = this.findMatchingRoute({\n            event,\n            request,\n            sameOrigin,\n            url,\n        });\n        let handler = route && route.handler;\n        const debugMessages = [];\n        if (process.env.NODE_ENV !== 'production') {\n            if (handler) {\n                debugMessages.push([`Found a route to handle this request:`, route]);\n                if (params) {\n                    debugMessages.push([\n                        `Passing the following params to the route's handler:`,\n                        params,\n                    ]);\n                }\n            }\n        }\n        // If we don't have a handler because there was no matching route, then\n        // fall back to defaultHandler if that's defined.\n        const method = request.method;\n        if (!handler && this._defaultHandlerMap.has(method)) {\n            if (process.env.NODE_ENV !== 'production') {\n                debugMessages.push(`Failed to find a matching route. Falling ` +\n                    `back to the default handler for ${method}.`);\n            }\n            handler = this._defaultHandlerMap.get(method);\n        }\n        if (!handler) {\n            if (process.env.NODE_ENV !== 'production') {\n                // No handler so Workbox will do nothing. If logs is set of debug\n                // i.e. verbose, we should print out this information.\n                logger.debug(`No route found for: ${getFriendlyURL(url)}`);\n            }\n            return;\n        }\n        if (process.env.NODE_ENV !== 'production') {\n            // We have a handler, meaning Workbox is going to handle the route.\n            // print the routing details to the console.\n            logger.groupCollapsed(`Router is responding to: ${getFriendlyURL(url)}`);\n            debugMessages.forEach((msg) => {\n                if (Array.isArray(msg)) {\n                    logger.log(...msg);\n                }\n                else {\n                    logger.log(msg);\n                }\n            });\n            logger.groupEnd();\n        }\n        // Wrap in try and catch in case the handle method throws a synchronous\n        // error. It should still callback to the catch handler.\n        let responsePromise;\n        try {\n            responsePromise = handler.handle({ url, request, event, params });\n        }\n        catch (err) {\n            responsePromise = Promise.reject(err);\n        }\n        // Get route's catch handler, if it exists\n        const catchHandler = route && route.catchHandler;\n        if (responsePromise instanceof Promise &&\n            (this._catchHandler || catchHandler)) {\n            responsePromise = responsePromise.catch(async (err) => {\n                // If there's a route catch handler, process that first\n                if (catchHandler) {\n                    if (process.env.NODE_ENV !== 'production') {\n                        // Still include URL here as it will be async from the console group\n                        // and may not make sense without the URL\n                        logger.groupCollapsed(`Error thrown when responding to: ` +\n                            ` ${getFriendlyURL(url)}. Falling back to route's Catch Handler.`);\n                        logger.error(`Error thrown by:`, route);\n                        logger.error(err);\n                        logger.groupEnd();\n                    }\n                    try {\n                        return await catchHandler.handle({ url, request, event, params });\n                    }\n                    catch (catchErr) {\n                        if (catchErr instanceof Error) {\n                            err = catchErr;\n                        }\n                    }\n                }\n                if (this._catchHandler) {\n                    if (process.env.NODE_ENV !== 'production') {\n                        // Still include URL here as it will be async from the console group\n                        // and may not make sense without the URL\n                        logger.groupCollapsed(`Error thrown when responding to: ` +\n                            ` ${getFriendlyURL(url)}. Falling back to global Catch Handler.`);\n                        logger.error(`Error thrown by:`, route);\n                        logger.error(err);\n                        logger.groupEnd();\n                    }\n                    return this._catchHandler.handle({ url, request, event });\n                }\n                throw err;\n            });\n        }\n        return responsePromise;\n    }\n    /**\n     * Checks a request and URL (and optionally an event) against the list of\n     * registered routes, and if there's a match, returns the corresponding\n     * route along with any params generated by the match.\n     *\n     * @param {Object} options\n     * @param {URL} options.url\n     * @param {boolean} options.sameOrigin The result of comparing `url.origin`\n     *     against the current origin.\n     * @param {Request} options.request The request to match.\n     * @param {Event} options.event The corresponding event.\n     * @return {Object} An object with `route` and `params` properties.\n     *     They are populated if a matching route was found or `undefined`\n     *     otherwise.\n     */\n    findMatchingRoute({ url, sameOrigin, request, event, }) {\n        const routes = this._routes.get(request.method) || [];\n        for (const route of routes) {\n            let params;\n            // route.match returns type any, not possible to change right now.\n            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment\n            const matchResult = route.match({ url, sameOrigin, request, event });\n            if (matchResult) {\n                if (process.env.NODE_ENV !== 'production') {\n                    // Warn developers that using an async matchCallback is almost always\n                    // not the right thing to do.\n                    if (matchResult instanceof Promise) {\n                        logger.warn(`While routing ${getFriendlyURL(url)}, an async ` +\n                            `matchCallback function was used. Please convert the ` +\n                            `following route to use a synchronous matchCallback function:`, route);\n                    }\n                }\n                // See https://github.com/GoogleChrome/workbox/issues/2079\n                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment\n                params = matchResult;\n                if (Array.isArray(params) && params.length === 0) {\n                    // Instead of passing an empty array in as params, use undefined.\n                    params = undefined;\n                }\n                else if (matchResult.constructor === Object && // eslint-disable-line\n                    Object.keys(matchResult).length === 0) {\n                    // Instead of passing an empty object in as params, use undefined.\n                    params = undefined;\n                }\n                else if (typeof matchResult === 'boolean') {\n                    // For the boolean value true (rather than just something truth-y),\n                    // don't set params.\n                    // See https://github.com/GoogleChrome/workbox/pull/2134#issuecomment-513924353\n                    params = undefined;\n                }\n                // Return early if have a match.\n                return { route, params };\n            }\n        }\n        // If no match was found above, return and empty object.\n        return {};\n    }\n    /**\n     * Define a default `handler` that's called when no routes explicitly\n     * match the incoming request.\n     *\n     * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.\n     *\n     * Without a default handler, unmatched requests will go against the\n     * network as if there were no service worker present.\n     *\n     * @param {workbox-routing~handlerCallback} handler A callback\n     * function that returns a Promise resulting in a Response.\n     * @param {string} [method='GET'] The HTTP method to associate with this\n     * default handler. Each method has its own default.\n     */\n    setDefaultHandler(handler, method = defaultMethod) {\n        this._defaultHandlerMap.set(method, normalizeHandler(handler));\n    }\n    /**\n     * If a Route throws an error while handling a request, this `handler`\n     * will be called and given a chance to provide a response.\n     *\n     * @param {workbox-routing~handlerCallback} handler A callback\n     * function that returns a Promise resulting in a Response.\n     */\n    setCatchHandler(handler) {\n        this._catchHandler = normalizeHandler(handler);\n    }\n    /**\n     * Registers a route with the router.\n     *\n     * @param {workbox-routing.Route} route The route to register.\n     */\n    registerRoute(route) {\n        if (process.env.NODE_ENV !== 'production') {\n            assert.isType(route, 'object', {\n                moduleName: 'workbox-routing',\n                className: 'Router',\n                funcName: 'registerRoute',\n                paramName: 'route',\n            });\n            assert.hasMethod(route, 'match', {\n                moduleName: 'workbox-routing',\n                className: 'Router',\n                funcName: 'registerRoute',\n                paramName: 'route',\n            });\n            assert.isType(route.handler, 'object', {\n                moduleName: 'workbox-routing',\n                className: 'Router',\n                funcName: 'registerRoute',\n                paramName: 'route',\n            });\n            assert.hasMethod(route.handler, 'handle', {\n                moduleName: 'workbox-routing',\n                className: 'Router',\n                funcName: 'registerRoute',\n                paramName: 'route.handler',\n            });\n            assert.isType(route.method, 'string', {\n                moduleName: 'workbox-routing',\n                className: 'Router',\n                funcName: 'registerRoute',\n                paramName: 'route.method',\n            });\n        }\n        if (!this._routes.has(route.method)) {\n            this._routes.set(route.method, []);\n        }\n        // Give precedence to all of the earlier routes by adding this additional\n        // route to the end of the array.\n        this._routes.get(route.method).push(route);\n    }\n    /**\n     * Unregisters a route with the router.\n     *\n     * @param {workbox-routing.Route} route The route to unregister.\n     */\n    unregisterRoute(route) {\n        if (!this._routes.has(route.method)) {\n            throw new WorkboxError('unregister-route-but-not-found-with-method', {\n                method: route.method,\n            });\n        }\n        const routeIndex = this._routes.get(route.method).indexOf(route);\n        if (routeIndex > -1) {\n            this._routes.get(route.method).splice(routeIndex, 1);\n        }\n        else {\n            throw new WorkboxError('unregister-route-route-not-registered');\n        }\n    }\n}\nexport { Router };\n","/*\n  Copyright 2019 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { Router } from '../Router.js';\nimport '../_version.js';\nlet defaultRouter;\n/**\n * Creates a new, singleton Router instance if one does not exist. If one\n * does already exist, that instance is returned.\n *\n * @private\n * @return {Router}\n */\nexport const getOrCreateDefaultRouter = () => {\n    if (!defaultRouter) {\n        defaultRouter = new Router();\n        // The helpers that use the default Router assume these listeners exist.\n        defaultRouter.addFetchListener();\n        defaultRouter.addCacheListener();\n    }\n    return defaultRouter;\n};\n","/*\n  Copyright 2019 Google LLC\n\n  Use of this source code is governed by an MIT-style\n  license that can be found in the LICENSE file or at\n  https://opensource.org/licenses/MIT.\n*/\nimport { logger } from 'workbox-core/_private/logger.js';\nimport { WorkboxError } from 'workbox-core/_private/WorkboxError.js';\nimport { Route } from './Route.js';\nimport { RegExpRoute } from './RegExpRoute.js';\nimport { getOrCreateDefaultRouter } from './utils/getOrCreateDefaultRouter.js';\nimport './_version.js';\n/**\n * Easily register a RegExp, string, or function with a caching\n * strategy to a singleton Router instance.\n *\n * This method will generate a Route for you if needed and\n * call {@link workbox-routing.Router#registerRoute}.\n *\n * @param {RegExp|string|workbox-routing.Route~matchCallback|workbox-routing.Route} capture\n * If the capture param is a `Route`, all other arguments will be ignored.\n * @param {workbox-routing~handlerCallback} [handler] A callback\n * function that returns a Promise resulting in a Response. This parameter\n * is required if `capture` is not a `Route` object.\n * @param {string} [method='GET'] The HTTP method to match the Route\n * against.\n * @return {workbox-routing.Route} The generated `Route`.\n *\n * @memberof workbox-routing\n */\nfunction registerRoute(capture, handler, method) {\n    let route;\n    if (typeof capture === 'string') {\n        const captureUrl = new URL(capture, location.href);\n        if (process.env.NODE_ENV !== 'production') {\n            if (!(capture.startsWith('/') || capture.startsWith('http'))) {\n                throw new WorkboxError('invalid-string', {\n                    moduleName: 'workbox-routing',\n                    funcName: 'registerRoute',\n                    paramName: 'capture',\n                });\n            }\n            // We want to check if Express-style wildcards are in the pathname only.\n            // TODO: Remove this log message in v4.\n            const valueToCheck = capture.startsWith('http')\n                ? captureUrl.pathname\n                : capture;\n            // See https://github.com/pillarjs/path-to-regexp#parameters\n            const wildcards = '[*:?+]';\n            if (new RegExp(`${wildcards}`).exec(valueToCheck)) {\n                logger.debug(`The '$capture' parameter contains an Express-style wildcard ` +\n                    `character (${wildcards}).{"version":3,"file":"parse-args.js","sourceRoot":"","sources":["../../src/parse-args.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;AAAA,2CAA4B;AAE5B,MAAM,EAAE,GACN,OAAO,OAAO,KAAK,QAAQ;IAC3B,CAAC,CAAC,OAAO;IACT,OAAO,OAAO,CAAC,OAAO,KAAK,QAAQ;IACjC,CAAC,CAAC,OAAO,CAAC,OAAO;IACjB,CAAC,CAAC,QAAQ,CAAA;AACd,MAAM,GAAG,GAAG,EAAE;KACX,OAAO,CAAC,IAAI,EAAE,EAAE,CAAC;KACjB,KAAK,CAAC,GAAG,CAAC;KACV,GAAG,CAAC,CAAC,CAAC,EAAE,CAAC,QAAQ,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAA;AAE5B,qBAAqB;AACrB,MAAM,CAAC,KAAK,GAAG,CAAC,EAAE,KAAK,GAAG,CAAC,CAAC,GAAG,GAAG,CAAA;AAClC,oBAAoB;AAEpB,IAAI,EACF,SAAS,EAAE,EAAE,GACd,GAA8D,IAAI,CAAA;AAEnE,qBAAqB;AACrB,IACE,CAAC,EAAE;IACH,KAAK,GAAG,EAAE;IACV,CAAC,KAAK,KAAK,EAAE,IAAI,KAAK,GAAG,EAAE,CAAC;IAC5B,CAAC,KAAK,KAAK,EAAE,IAAI,KAAK,GAAG,EAAE,CAAC,EAC5B;IACA,oBAAoB;IACpB,iDAAiD;IACjD,YAAY;IACZ,EAAE,GAAG,CAAC,MAAM,MAAM,CAAC,kBAAkB,CAAC,CAAC,CAAC,SAAS,CAAA;CAClD;AAEY,QAAA,SAAS,GAAG,EAAwC,CAAA","sourcesContent":["import * as util from 'util'\n\nconst pv =\n  typeof process === 'object' &&\n  !!process &&\n  typeof process.version === 'string'\n    ? process.version\n    : 'v0.0.0'\nconst pvs = pv\n  .replace(/^v/, '')\n  .split('.')\n  .map(s => parseInt(s, 10))\n\n/* c8 ignore start */\nconst [major = 0, minor = 0] = pvs\n/* c8 ignore stop */\n\nlet {\n  parseArgs: pa,\n}: typeof import('util') | typeof import('@pkgjs/parseargs') = util\n\n/* c8 ignore start */\nif (\n  !pa ||\n  major < 16 ||\n  (major === 18 && minor < 11) ||\n  (major === 16 && minor < 19)\n) {\n  /* c8 ignore stop */\n  // Ignore because we will clobber it for commonjs\n  //@ts-ignore\n  pa = (await import('@pkgjs/parseargs')).parseArgs\n}\n\nexport const parseArgs = pa as typeof import('util')['parseArgs']\n"]}                                                                                                                                                                                                                                                                                                                                       �J�O��/�4"W�Df�S��j���K�~�r�a�?[��s�w]�[R[�`63$.�9��R�
�K����(2o�n�X�RD��\��ai{))�WN�(�hȦڭ�g����ZW��}�&��*+��@����܃?z~�7K6"�|Lu�^�����Z(��������-- ���k���;oS�=~ �5bO�����˫U�$8�
3;`q�A�6��"�����}�<W�Ơ��H�I�:�G��Y�{�)i��.;�!�
�Q��kx�E��f���n?&Wi�@�q� W|�.}$MoS�v~���|�`�t�1愢s�ө�Saθ*��<����|u@@Rq���2�{?��!����ű	���X�a�~�$dHȫ�H3�6i�v�.�Ns.���YH�k��;LH�ӓ���CiO ��r��/�8��s
�(��?��1��ry�ӝI����� qTK�� �5 �a�4�=Z��H�$����+��|,�B��"x&�O+4agi_�*hR���Z�&�-�L���[���c���-ߔ(�I��6���1r;*�ZKo��(���':�v*35;{�l��yEq�q+ᰮ�Ton�{�J���
&>PL�+�6�j�ף��FB��r�)G��s{��˧_����!y�y?�I��|���J�m^�Uz�d�
��ȝ�)�϶�gSu	�-���pd9#�p�0��O4��t j����u�O��m����6�~Ni
���m`�k��2[V�p��� ����QD���X3�c��Ԭ<�S��O�O~��1���u71s�ն2WW;��>��Z�@E���Iw�6l�<Mn�n�v�Eg0"�P��C= 3��;8����+���a���o�ano���!�}��ܬ
M��O���-?�F�m+
!7�����6g.��l�գ��E�^�wX!=��<|�MK~%��g�Y�����Q��N��af���j*��O�����L���x�a��B�=3Т�wy��2�k�'��yV9&=���!)?qkH�5���=�
�V�6�ͷ��7���_�=قkT���g��h�q+�2P_�$���3�#ک�J���+������sjY����phS�s��]Řsռ��-J5{������ �f��}�̡��WF��PN�|H&�쨐��n�V|�2	��t�B�.�-��g��7�\����z4�[�:�G�eF�Rǩ7S���"gN��!¸г5ׂ�� !��K���D�O�W5��IL4	�IFc��Ja�Mbz9��_ZzC��c�X.oe������:� ��`)bslW�%�����m�j�M<qT��E(
�H�sUQ�,�����ٟ5}���ʁm}A#�����fSi��Q>^��%j��vݮ�$�t��ܚ;���[�-񃅬/��e�n��9C�-�z���{�.彃��A�Roچqk]W����*���y\U���b�s�~�el�0��RK���!�e��{/��k؂��������t�mm�[l�����׫B�1����H��P�5p܏��Q,���1��D��gnR������B;��4&,��:�Kv�T,W�@��u;������('}Q ��D�1ܫ�8���$Yl�{�ؼT����~(^��]��l��6�eP��es�~G��ǳ�l�.?ڦ-o���_U΄�o�{��ޥ�:�#���g�+?@{]L�ڦuL�W�B�),0
�a�Y>{eN6đ��/-���E����ĺ���m�Q�����=W�н��݋a� 5MtK�وG�om����)�n����?�����"^��\Ʋt�K������-`��/��*�����~*��n�:�y����JԌ�P�ȱ�t��E�_�Sn�Z,g��/�/}�*F�fki���G-؂m��� oXƜ�/��%ߢ��y�T�U�z;&���Q��v�j��qIrQ��ǧ�$�jg$�u�UD� �'���4��6�0zX�          !��Ł2�FW9�ky}|�g�K�U��*)�P.YJ�~��	��
�=;������89J3�=�f�Rr�E��D�<S:6��pE�� G�x�+	�ꅙ��(�VLL!�5$+���|PBܤcF��Y�c���o$6���b��5�
���X`O�מH�mNB�1^�a��_>��[�%=+��}���蒎�)(��&�ph/���ʧvEc�=�T��y��j�"�a"v�i�^�����Y1+8��Cܖo���� n� R� N�Xʑ:��1�[�<.m\a���Q������M��X�?��2���#Tj *Lk��S 	���x�R�-���Gm��ڄ���⒉Й%}��\��s��v�C  |A�K���аڞb���u��}���A��Gu1ޘ�ŗ���⿡��O��L��F�W��u�H�w��\��y�����ڇW�1{�d`���������{D�W6>�k�)�M��*7a@O��8��˨1�B�(_����/B����uA#kУUpV�����KD����p8�ШPlK�>kO]��c�;w=�A1a��]+]} CN����}|x��^�v&n܋�M�\M�����/�ز9z��;\��mJ�P�c���>C=x��݋+�"y�Gd��}s�����f�SX�Q�{�z�,�tx"��g�Ma?a:H~�P��h`�!U�V��zB^�{�FB~A�F�-�4\R�Q�4 >'W��b�!�[ea�]��Щ��.w^��b��V(��N{�����;��8vJ���\��)gGuAϦ���K+2����h�/K�}�2�H՛-V�3���;���3l��Z�,��y�w�C�R�M�e�fh����AE	d��m�僔�	�ݚ�M��,O��mr�߫q�%S���.���:8/�~+�C�"�����ቷ^n��2UǠ�'Sx�bd*A Xf���ky���L��kHϣ���� ���_ISɶ�?�G�(Ŧ1����"���"�i�W<'���|Q��B�4��#\eVs����v������5-���k��ޞhY!��>ѡN@�_Y;�`,9�P�����/F6��HEP�IL��Ń�
;����Nv݂������ꔧ��ԁ\֏��-1����J�	��>���ĭ�=[	n��9Ύ����؉��`�6
fS�@�����\3S��|�~����ͦ�� ��
:ۺ����p����{�v��T�|��5
��OM��_]���5eL�v�NsR����ڲ��wC4
o�e��ݧq9)�
�IF"ǝ"��W
���s��z������h����v�^Q��L�Xg�w\߈D7�=�W�Z��l�q�T��d��Q�H&���~c���t��8��
IT"4�\�!�6��������ghq�y�����V�
��7�
H�xz�\Y�m$�͇�6�S�P��դ�>����j;&t��1v���o/J�h>�`��x8�Ǎ�U�CBɌn�k�����,�����
v�y)��$���S�1�5��g�	b)�&�3�:	�L �f��i1B�y�:�~�)��	+��9��l5x�ʁ8"�5��#P3L�<_�0���e���;<c�r[[�o�e�VJ�� �@�?��3�t&��X���^g�t�E�cp�1���)�y�@M�{ʅ�K�,�e*�Iۄ�,���!���RN3�����9�<���8�ڽ��J�����h�������s�n��m ��JX6�z�#��&�8�*�m#��Ϝ�8!��!�1>�:'�Bt��/�%9Qlx/�s�H�y�_��J����C�Q982��ҵ�;au,Qgqz&��L����K�Y ː�Y%�ϨiÀ�5�����u����ª��Ɋ��e�4�z�E{�����6G ͂3O�n��(N�����ξ�cm�д%Q7��
2��X�C�Ğ�#��)�.g�J��M?�f�Ǽ�����v�B��rOW�����%V%��Ԝl,�N�P=46�))l?A:�s�5&T].}y��t�c�8C�(�62����Ϛ��!C����i,`na�mjX����a D�/�BQ���4P��G�[�_)���H�QR�U���V�R�a�GE}?�32è�$B����0?U�Qp	�LIe�����̻Co}��m���2�3ռ[}*������y���
+ %.�xm�w��H���B�&��qÒ��o �*^PɤnH)��v���6��.�Ebd�%H)TE��`_�g�z�v�7&�T*
�}`U�OG�F���n܎��&��2ӢXЀ���y
��qٽ��ƴFn�D��6W�b:wJźg���4���T�M�����,0����c�m$��k;�aP��eΰ�-����K=��«q���1󲜚��$��\��7����v�+C^�C���ခ:��J�x0J�Q��G���;���U�d�)�Of繣�y*�'OFq�]GT�D�m��s�ȺdQ���v�#��lk���x���<��Br�c���#�]؟8��4dz���g2^可�/�=2�e��=���0���W	DT�p�i��{��n����K��]����J�3���B8�Q�U��L�+e0��46��pPJu��Qh��_�t,�x��$�(�����%�YW��0O��	�>Xӡ�6��� ��ǉ�B��kw-E�R��Y��ƉF��?A����Bh�bo��X& gD��DW���E&���wٽ ���U�v���6�Z���4��ps�t9�����$��#b%ӈ`����Hv��P��?Q%�aq���<QY�)��/��B��H�����:5z���R��pG%�AE;%T:lD�w��Ӎ����p��'��Wᬄ�Ș��=Yd�F�aXLR���3x��F����#���	�׬M}4�����ʘ����|^\��������|l�.g�C1�(s۠���,F���dڙQ.-����K�6���.%?�}�����@�Y�T��4O��ᨯf?�wO�0�W�C�H\G��b����Ll�#��3���I2?9�g�1�4\D��҂H�~l���x\ N��g�z��p�1�w�2-QɊ�{vֱ�uU#�k�AMD�8�D���&�1��A0x�8t�Vn
�;Q\��
�7%-�)�~�|2�]�є����䗿�`��B�j�:Ǧ�բss�� ��A��pѹ�4_���R�&�z:��l�#p���T��筿��j�7����Y��Z8b\�07��%��	�T�"���$�,fgo4Ȣz����-��6��������}	Roq�ő�k��Ѩ�E=�-	��l~�Ï�1tU��S��lܮ�)��b�⣎�ċ��S�V糘�u����4H��5�Ff�{uh�@��G#4��E
8]4����;G5���i!PD+k�>�ȍ��a��e�va��o�f\��Aҽ��U�6�͒�g�d?[���U08����VT��C��E(�J�m`#Ȯ�ҩ ߽G�@�/͚<V,cp�Q)�>*���jz�G�\��E�7а{:�K��1�Ga ���N;e5�����_��A���4�.@Du�%t��8�ۢV�h}. ��̪Z����罢R��뫘�U��-��9�ޥo�h!vE��rIs�ƄB��a9�Q̒?���KYT&�`c@-��Z. oGR'���̞I��U�3m5��5֌f�a7��〸�ͮ������f�m� �|�P�;�H7���bY�u�'���F+&z]���|�� �	`�:����n]Rue��:��a0iq&� �<\��:�D'�'Rp��!�G��߷(`��g�>%�]߽mu�
����'p��oЛ���v-#U47uyzWT�`V�"\m�X�zW�V�\��pzѨy�a�65E;�P�¸2~���h�Y��]�*�Dd��\�bű"��;���;��=JUPrzj�y��>#VƝ�yA������h��l,��<yt��T��2�\n�v޿~�֧>�^���M���<�fe0�s�� �\J�D�9f4��1*��߮�����+$Nk���	�&:?)^��ஈW̕{�S�(S�_	yZ)T铰h�@?CUHH�6�?�@8J��4��G`��1~���CK]�C��ξ+��|����T㘄���'AK���,7��3벓Yy��!�DlI��x�\(e��f�_�Y�	f'�d��K�|�zT⟣W��j��ug�v��d�s<Hq:�����4��V|�d�#�]`�m����[MtxQ �rg5��O�I�}��`�:�j���cͧ'��Wף�����>�r���1Ä�����Y0�
{�~Zϵ`�d~@	
VC�f� �T�gε�t�*Y����56�6���V��Hb=jb���P��G� Y(U�A�c��MZJ9�ԑ�x�t��G��0V��ЧR�U��j_�|�yE�M�����B�+c�6m:&��(�O]똖x�-ؿl�yKq�-��-am	����I�4��(�H�]����F"#��n �g֦nm�k�Q-rN!����n���Į/�����BψB��ЙR�s��^�dAp�%r������(95V�D�6yJ��QR��	\.>���>ۣ���a��ve�cʭ;;��dޙ0��R�ܔ���6� �w��ɍ��.a�ܪ��'I��+՚���z���!m	�>.x��aGp���u�_C�;3�>,r	��S����$"j���O�g�eﭦ&�F^�r]>Bv,vBR4��e��� �氕�u<���,�ɿ���:���C����*&�:76�>e�
�K�n��A$�M^����A��k�+Sќ��P7)����ġn2A��Pu���3�nD&Z�]{�@5�S\�}�o�8Y<ƻ���Z �Eu�c��̀��UR~��M�M-�O�Rh��1a�ֽ�~���1�j���ث�T�ޱ]��6(i?��D�p��!E�r��\F�P��(Hyj, ��~i��pu<����O���/��qI��ܘbW��3cg���[�2�E�����V���JF�A;!<�����$����`��H���IA��FZ��<�nF}�e9UC[!X�'UqC�3~\BV-��%�?cF����(��
p�X;�#���B�~��K[�*��V�h�D��p��V�y��9e2po|xޣu.��j>���z�@��%h���X���U'���7�ae��Si�o� m��(2����6w���9�Lh��,����ٖ𡜳}#�2�k+4u!���.VK_xo�K$`�5�Ǻ��S�[�� ��w��+-��m��K�B5�W��4Q|�:��3a	՝/�AӶ�F�ir(�f`��x̶*��V���C^��Pp�dnJ��B9�j�/��(������S���U%���K��� ���DTZ0����u�SX<��=^ ���2��Ȯ�;��L2���6&���s;��狛�G����^�u٫�� ����&�G�^�<l��7�>f���_���?���|��v&u_߷Y�1XǿϤ/OpmF�1�SQ��v��v�W���@��ނ��_���G������`��{�
EVa�^f�V��q;���om�,�X��3��懿,O� fW.0_t����f����~�7��z!Q�o�-��<xS$�:����//�S��@�F���L\��/DCsI�V`�)��
C
�B�6ħ��l�v�`JH'I��N�2�����˺!��B�w��FwPL�{e4�����4�y�欬c�"�@o먙1�t`F{����#�ә4�S싋)��)�0�4I��a���5u�V�8CtW'� ������k
��ܕ��e��3�a���3�s��~p'��4K�/�µ`Z�D>�dr@��t�! ��PL�4�ѻQU�*3���Ҋ�ϨA�\֫Ǵ.�r��'��" ω=Q�<�5�~���E%�,��I@�Ϛ�,�j��E����v�'0��9j��!R�,3��{���A"r�Wx9C���\EQ��e�`������f eG��u����I�z��#J}2��/8��J;CjH|�Y��Ȭ �3���ls"IN��+T~ϠGlL*��0aOv<H!�4QP�(�EX� ���gJ��|i�&�.�5��!�>\�z��DA�X��;��`j`O� .���K��?g;嫵-�ȶ���m���B��&(�tBz�X�D��'+3%��	�;F�P�[~��o�}#�d�ɀ�3v�n�]���ڴF�]0���g�r��D$9�VA��Pf�{��0�@w7�Ƽ��k��j`��4ĀHa�N�n$��}�,�tE�ǌ�o`�|<U��6���Gc��h���,��M~�!��C�	6�n �I�l�t�
���Tb�`���T*�EcZ<P��E47�f��Ɲ��������p�L�h��h��⼪��6E�>Q�OIlsəE�D��\/���e�:�������u%j�t�ʤ	3��D]�cX܂�TV��˷�sBt4�΢��������)�D�eXV�,2��.�����O?�3(i+��bX�е���4Cp{cr+b(�Գ��{'��㉿�4~�w�mM��&G�ie��%����}q[\.Gn�`PML��1�Kuo��2�U��Yz*\@�Dksq�*ܘ-PE�C<h��S�`���b���>J�g��=�!{*�Pn@�q���p���w�G��^�R;/�M���^����?{��ԡFH�̶,a
�8�S!�_���ٖ��_�#r|C��J����r�Kz�P���ܺW3�֜
��gHن�v��;y����� ��͜���k��s\��6$(-���$��xܿNg��zo.��&���� i"я���T���[Uꐢ#�x���p����y��pT����t���`0�Od铙3k�@}��l����;�G�F��<�8Mj�LlP_��+�����|�q�Yw����i�}6��v."f�Z�I,�Y��[غ,��?o�q�����`����'�ϳ:E��I&��>�+�@�d1 n�[����$O��nΪE��=�|��I���h�r�~0�^k5'!�u}���if�	�jc�3F��;�N����4�އ���㎢ve� K�:)m�苢J����l'd�_t)Wߣ�:�	ML�}?�44��[]������b6a!ty �X�δ{������8{�� �+����g"&�~��cl?�y��R�1^ѩ�%�ڴ���w�;2��Y�i�����ƫ�u}^���}�������_��f�6/�2�ɖ��m��c�7Sx��a[���H��弴��88k���F�����=�N9�hH{B����z1zJƶ�h�L�
���0u��+��[.��<,�R!C���@�v�K�x����,����f�R�
��V�`*�M�OAn���0��i���O����#	���*�4w�y=H|��j@�$T�r���)�s�k�'~W��}ӫ������oη�Bz�*��UM\L�&t�3����F�脃Z��J<�s�%�\�m8�0��m.�V�{Kh��"��?6���[Y@   !�弃Da��LX#H��ƹ����u��%�d�*M�n0�R?w
\%�sϹ�%�<&Qf���.%˄Q� q]��`V,�!��Nn�E��b,�U11J2��B�hw����uZ԰�������>'8�:$r�F�ߏV��56������d3=������,`���1J�=�S����th��4΃SM>�0�Q}��|�:�'9h���CFm����jdV%��Q!{i�D�i:8&xj���d� <���}������+a��N=����ןG(�.�f�#�72!�=�,�N��Q��P3��2 Эl���Zm^�^��ƺ b��Î$B ����N�Z#R`[
�L�d�����E���L%��2��n!���Aq��hH
� �7��ϵ�}��U.*D�*�Ms6rԃ	���;ōy�:�	b#��)�<qN�T�8yqR|惆0�'��ܽM�W����uJYo��&(�z�����O[Y����]�A����zp6���Au�/'��_C���eݎ�Х�yz�ޘc)�h��ˆ9��5�ԛ��=q�K0.Ԯ�Y�)$U��kT�"7��q��I2R���Ȓ|��D�@����!C;�3j����ʋ��UzY��w:��Ì��S�3+B������|�j��ⓜ �ĽoI� ��@{xd�A�x@�,(���o�J�t�ͺPO�ӁzF\�w4��Q �(���t)Uh�9���Z �M�P ��8J'  [�e�
_<dk��I��}�@x�t��ڸ\�c��f2�#�dCim��Hΰ�j��,�����bi�\_!	�\l	�I���u-��� >����	Ek2wH��7�*�6d�RI��
��$�i�q�#�"So�Rx"�'lq�_}w��Fd\�/!i<��^/�Fc�F�c/V;��,2HL�E�?�|�\t���Yq��,����A{��AJ�ګ�F�t1�c1ݴ�s�)�#�y�Ttk��9Tj*�R��m�d�֕�����j��}��3�S��6���nU5�6�@^�E�@��iB��E�o�&x�
ʋ,��M��i��@�RH�,�֖[g#s��9�)����O��#�z���-Б@�༡k��
�9A�I03<�_3��%���n��`�(�|S@1n WYCi��� I���ǂ� �O��h:�:*>v!8�k�>9��&��:�##��튉 +��ϳ�$烥��[��2&�0��t?�!�1���=J�'996�Q�@�PZȘ��pbz�x�8o�3(q�%8�@�:��p������Wς���K��%��ǉ�.�;32�m��Z�#�"k�$�I���ľAOO��BV���r���0o�7'xd'���cH�s�R�'��o��?�`�`�@FB=s��ͬ}v���DgT ٠6��n��V�_���$���nd�|�gB�&'A��,����H��� �D���ZWD��i@Z}cJ��<[Zv:Y+��?�;�O6?$�2���_)'�t�O��{�����g�Gڍ��[� �
�Rzh8A �SWhh3fM���8Y�D$v2hX��9'�"�S�	���[(GN�e��T��-�d�5>���dqE �B���/����O!���,���:�eX��9�~�#��]����_*��!�@9	�@����u�ߜ�y�#\a4x2��0���6�9��Wά�籤� Vo�X�ׅ8���WE�!^.���i���Ml�
�Z��,,��{�>�!����멺�+�؂3$}jd��"�{�����!f�n <�!w�q�k�g=C7S���7�@ʅ=��k�KiB�Z��v{��oY>�͇���]n����u҂�aE?����:b��{��b�W߂�=d`�����Ѻ�mKWoe��T��dZ�5�(��K_E�P%�q�F�gD�g�26*|��Q?��p�p-��y߿��Ĕ5�f\@EU6�{����s=�2G����t�N���FD?o�ә^0����Ƥ9L��]�^�ZR ���^!��.P��9�Gμ}NЀs[i����cG���4Y�ȡ`P� ̻p�a
���)��G����.�֊Su�}=��ö0���or��z{z�R�Sf?s����F'�U��~��l=��O���W�!(���}vꢥ�����I>���@*��m�=k4��Rʜ;J� ��3��,
J�@6o�1��Q�l���/ˌ �m_z��'���c9�����1YJaQ�2(��g�/�T�(�j�UV-2Jc<��Dm�G�T"��N�%1?���MdR��I��?cR�|<���
�b� �%��x�?���H�o)[������ڏl_v�g$�J�T�����[Az�����o�@(��Ǘ��q*gO���E��X�Ө� y����9�V!z]���]��x=L�$���� �8@eҌV����;>��7O0I�Eb:T��K7��	h�m��Bѣ�&F���Pɯ��l���<���y>͏Q����Y���T:u��P�7��/�r���(y���έ�Ӽ���0�(?xo_�A��3�2��տ�5E���:�!��v�["̋a����+s���:)���=�~�%�H~]+���&�
�Z��C��H�3��h��:�P�J4�C�k�%�P����z�m�����?(�S���l�t�WL�1aX�Y�i�j~��b(+���N<�ڸ4����0~����&1;�� �u�ޯ>ϟ�r߅_��C�c��Q�ej�N't�Ҥ��07«���4�[���+t�uQ��B����@Ǩ{I'��`ۧ�ɦ��v{[��Xm��{.p��wqGT���F,M�k�2a^w��>�u�<�tRA�d⢀:j	��u'�:_��'����`���d�o�`��Y8#:��:�aY5g�kc�+�_��!1��C`��1��<�B��l��z-��^o��,�h�:�oA���ʨ�c�"�� Y��l���A�PGP�Jg�c�_(8�����H��o�È]���GڤA���Լ��.}�uT���z��ۻQ~E�I~Z	��`���0�E�g���&ve봌u�U�l�`M�g�	��{{� ��,p�{,��\���F�ھ{���!��r,���3�P��2�|&�����zL
�V�_?G'X 1���H_):p6����.�)��r�N-�}y����t���Hߝ.;�0�$�a��%����<����ѳ{���W�y�����qA�X�k��X]�����"��%����Po�}Z�k����C������b��� U6e��V7Ð�9��ഈ3�?F_(#t�m�����j�!�H+��H���k�<;�g������=�����f8Y�\S�;�<�@�qFH][��~H��ۈ 6aא�5gxO�Kۥ۳	�>%���g)LC���T�ǌF�E��E�d�E�B��
���a�ȃ�-a+����`ҥ��M�q�K����N�2M��*BI��Q�F���:{u�m �;��Z�]�vY7�+r�3�����@)��n��ɵA��?���,ii󶒀]D�,� ���"����(�u�=���H��cI�ᩬh�%�����a�S5T#��\�����ǵ��?�:f�}��NḊ9�A��}k*Y�<���Thu��!�o��^�N��қ��CM��&��z�
������pClՃ�頛OM.谣����;��ފ�B���3�c�梏�(�4%���׃}�M�]�ăJesu���L>4�ݡj2��eCF�v1ъ����P�w�(u܁�n�H����"8�}�g�	�C�Xγ�h{9	4�R(x_�C��1��I��3� kz� P4���}��ϭ[L7�\.hJ�	89�dP�u�U8aT�K$C64(������#���\ȶ��aͻ��h%��.�\�i��3����,ձ�j<��`%�rn��"6]q��Bc��E�eaQ���ؖ�~[H���\gKݕ.�E�8E�Hdw��n?�G:����f����&�`
ҭrD��p�+:�_�`��SXf0��cᓍER�̣AmHE?6�E�Q����#ێa��zf4�j��;���(Q�Ɨ��%�n���n�x�"v��S�L�@�N���7P�8�_rpc6) �1؇I�~>p8$�-_��5�[:5?)n�����ܺA'S-�dI�S��!1K'����,|-$B�q ]gu�jò?��Ta�d�~1�P�_����+z@TfO��e	�o���<L���1���"���I-=���s�S��k^��g��0֔z��R� czڠ��/�m��sr?��T��=T
�K0��^�c`ٞO��徰]3��4��R)�@W�zᯋ��D>)9u �66r�iy����iҎP7��xH��*�s/5��06�=��� ��&����j�-�We{C���8��m�Xr����o
X+
��z���Y��@0
ƞwmA��`z�n��7�Y=�|�gg��	��;�-��&��s�����U�&;��� ����	����dsb�lEvent;\n            // Wait until there's an \"own\" service worker. This is used to buffer\n            // `message` events that may be received prior to calling `register()`.\n            await this.getSW();\n            // If the service worker that sent the message is in the list of own\n            // service workers for this instance, dispatch a `message` event.\n            // NOTE: we check for all previously owned service workers rather than\n            // just the current one because some messages (e.g. cache updates) use\n            // a timeout when sent and may be delayed long enough for a service worker\n            // update to be found.\n            if (this._ownSWs.has(source)) {\n                this.dispatchEvent(new WorkboxEvent('message', {\n                    // Can't change type 'any' of data.\n                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment\n                    data,\n                    originalEvent,\n                    ports,\n                    sw: source,\n                }));\n            }\n        };\n        this._scriptURL = scriptURL;\n        this._registerOptions = registerOptions;\n        // Add a message listener immediately since messages received during\n        // page load are buffered only until the DOMContentLoaded event:\n        // https://github.com/GoogleChrome/workbox/issues/2202\n        navigator.serviceWorker.addEventListener('message', this._onMessage);\n    }\n    /**\n     * Registers a service worker for this instances script URL and service\n     * worker options. By default this method delays registration until after\n     * the window has loaded.\n     *\n     * @param {Object} [options]\n     * @param {Function} [options.immediate=false] Setting this to true will\n     *     register the service worker immediately, even if the window has\n     *     not loaded (not recommended).\n     */\n    async register({ immediate = false } = {}) {\n        if (process.env.NODE_ENV !== 'production') {\n            if (this._registrationTime) {\n                logger.error('Cannot re-register a Workbox instance after it has ' +\n                    'been registered. Create a new instance instead.');\n                return;\n            }\n        }\n        if (!immediate && document.readyState !== 'complete') {\n            await new Promise((res) => window.addEventListener('load', res));\n        }\n        // Set this flag to true if any service worker was controlling the page\n        // at registration time.\n        this._isUpdate = Boolean(navigator.serviceWorker.controller);\n        // Before registering, attempt to determine if a SW is already controlling\n        // the page, and if that SW script (and version, if specified) matches this\n        // instance's script.\n        this._compatibleControllingSW = this._getControllingSWIfCompatible();\n        this._registration = await this._registerScript();\n        // If we have a compatible controller, store the controller as the \"own\"\n        // SW, resolve active/controlling deferreds and add necessary listeners.\n        if (this._compatibleControllingSW) {\n            this._sw = this._compatibleControllingSW;\n            this._activeDeferred.resolve(this._compatibleControllingSW);\n            this._controllingDeferred.resolve(this._compatibleControllingSW);\n            this._compatibleControllingSW.addEventListener('statechange', this._onStateChange, { once: true });\n        }\n        // If there's a waiting service worker with a matching URL before the\n        // `updatefound` event fires, it likely means that this site is open\n        // in another tab, or the user refreshed the page (and thus the previous\n        // page wasn't fully unloaded before this page started loading).\n        // https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#waiting\n        const waitingSW = this._registration.waiting;\n        if (waitingSW &&\n            urlsMatch(waitingSW.scriptURL, this._scriptURL.toString())) {\n            // Store the waiting SW as the \"own\" Sw, even if it means overwriting\n            // a compatible controller.\n            this._sw = waitingSW;\n            // Run this in the next microtask, so any code that adds an event\n            // listener after awaiting `register()` will get this event.\n            dontWaitFor(Promise.resolve().then(() => {\n                this.dispatchEvent(new WorkboxEvent('waiting', {\n                    sw: waitingSW,\n                    wasWaitingBeforeRegister: true,\n                }));\n                if (process.env.NODE_ENV !== 'production') {\n                    logger.warn('A service worker was already waiting to activate ' +\n                        'before this script was registered...');\n                }\n            }));\n        }\n        // If an \"own\" SW is already set, resolve the deferred.\n        if (this._sw) {\n            this._swDeferred.resolve(this._sw);\n            this._ownSWs.add(this._sw);\n        }\n        if (process.env.NODE_ENV !== 'production') {\n            logger.log('Successfully registered service worker.', this._scriptURL.toString());\n            if (navigator.serviceWorker.controller) {\n                if (this._compatibleControllingSW) {\n                    logger.debug('A service worker with the same script URL ' +\n                        'is already controlling this page.');\n                }\n                else {\n                    logger.debug('A service worker with a different script URL is ' +\n                        'currently controlling the page. The browser is now fetching ' +\n                        'the new script now...');\n                }\n            }\n            const currentPageIsOutOfScope = () => {\n                const scopeURL = new URL(this._registerOptions.scope || this._scriptURL.toString(), document.baseURI);\n                const scopeURLBasePath = new URL('./', scopeURL.href).pathname;\n                return !location.pathname.startsWith(scopeURLBasePath);\n            };\n            if (currentPageIsOutOfScope()) {\n                logger.warn('The current page is not in scope for the registered ' +\n                    'service worker. Was this a mistake?');\n            }\n        }\n        this._registration.addEventListener('updatefound', this._onUpdateFound);\n        navigator.serviceWorker.addEventListener('controllerchange', this._onControllerChange);\n        return this._registration;\n    }\n    /**\n     * Checks for updates of the registered service worker.\n     */\n    async update() {\n        if (!this._registration) {\n            if (process.env.NODE_ENV !== 'production') {\n                logger.error('Cannot update a Workbox instance without ' +\n                    'being registered. Register the Workbox instance first.');\n            }\n            return;\n        }\n        // Try to update registration\n        await this._registration.update();\n    }\n    /**\n     * Resolves to the service worker registered by this instance as soon as it\n     * is active. If a service worker was already controlling at registration\n     * time then it will resolve to that if the script URLs (and optionally\n     * script versions) match, otherwise it will wait until an update is found\n     * and activates.\n     *\n     * @return {Promise<ServiceWorker>}\n     */\n    get active() {\n        return this._activeDeferred.promise;\n    }\n    /**\n     * Resolves to the service worker registered by this instance as soon as it\n     * is controlling the page. If a service worker was already controlling at\n     * registration time then it will resolve to that if the script URLs (and\n     * optionally script versions) match, otherwise it will wait until an update\n     * is found and starts controlling the page.\n     * Note: the first time a service worker is installed it will active but\n     * not start controlling the page unless `clients.claim()` is called in the\n     * service worker.\n     *\n     * @return {Promise<ServiceWorker>}\n     */\n    get controlling() {\n        return this._controllingDeferred.promise;\n    }\n    /**\n     * Resolves with a reference to a service worker that matches the script URL\n     * of this instance, as soon as it's available.\n     *\n     * If, at registration time, there's already an active or waiting service\n     * worker with a matching script URL, it will be used (with the waiting\n     * service worker taking precedence over the active service worker if both\n     * match, since the waiting service worker would have been registered more\n     * recently).\n     * If there's no matching active or waiting service worker at registration\n     * time then the promise will not resolve until an update is found and starts\n     * installing, at which point the installing service worker is used.\n     *\n     * @return {Promise<ServiceWorker>}\n     */\n    getSW() {\n        // If `this._sw` is set, resolve with that as we want `getSW()` to\n        // return the correct (new) service worker if an update is found.\n        return this._sw !== undefined\n            ? Promise.resolve(this._sw)\n            : this._swDeferred.promise;\n    }\n    /**\n     * Sends the passed data object to the service worker registered by this\n     * instance (via {@link workbox-window.Workbox#getSW}) and resolves\n     * with a response (if any).\n     *\n     * A response can be set in a message handler in the service worker by\n     * calling `event.ports[0].postMessage(...)`, which will resolve the promise\n     * returned by `messageSW()`. If no response is set, the promise will never\n     * resolve.\n     *\n     * @param {Object} data An object to send to the service worker\n     * @return {Promise<Object>}\n     */\n    // We might be able to change the 'data' type to Record<string, unknown> in the future.\n    // eslint-disable-next-line @typescript-eslint/ban-types\n    async messageSW(data) {\n        const sw = await this.getSW();\n        return messageSW(sw, data);\n    }\n    /**\n     * Sends a `{type: 'SKIP_WAITING'}` message to the service worker that's\n     * currently in the `waiting` state associated with the current registration.\n     *\n     * If there is no current registration or no service worker is `waiting`,\n     * calling this will have no effect.\n     */\n    messageSkipWaiting() {\n        if (this._registration && this._registration.waiting) {\n            void messageSW(this._registration.waiting, SKIP_WAITING_MESSAGE);\n        }\n    }\n    /**\n     * Checks for a service worker already controlling the page and returns\n     * it if its script URL matches.\n     *\n     * @private\n     * @return {ServiceWorker|undefined}\n     */\n    _getControllingSWIfCompatible() {\n        const controller = navigator.serviceWorker.controller;\n        if (controller &&\n            urlsMatch(controller.scriptURL, this._scriptURL.toString())) {\n            return controller;\n        }\n        else {\n            return undefined;\n        }\n    }\n    /**\n     * Registers a service worker for this instances script URL and register\n     * options and tracks the time registration was complete.\n     *\n     * @private\n     */\n    async _registerScript() {\n        try {\n            // this._scriptURL may be a TrustedScriptURL, but there's no support for\n            // passing that to register() in lib.dom right now.\n            // https://github.com/GoogleChrome/workbox/issues/2855\n            const reg = await navigator.serviceWorker.register(this._scriptURL, this._registerOptions);\n            // Keep track of when registration happened, so it can be used in the\n            // `this._onUpdateFound` heuristic. Also use the presence of this\n            // property as a way to see if `.register()` has been called.\n            this._registrationTime = performance.now();\n            return reg;\n        }\n        catch (error) {\n            if (process.env.NODE_ENV !== 'production') {\n                logger.error(error);\n            }\n            // Re-throw the error.\n            throw error;\n        }\n    }\n}\nexport { Workbox };\n// The jsdoc comments below outline the events this instance may dispatch:\n// -----------------------------------------------------------------------\n/**\n * The `message` event is dispatched any time a `postMessage` is received.\n *\n * @event workbox-window.Workbox#message\n * @type {WorkboxEvent}\n * @property {*} data The `data` property from the original `message` event.\n * @property {Event} originalEvent The original [`message`]{@link https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent}\n *     event.\n * @property {string} type `message`.\n * @property {MessagePort[]} ports The `ports` value from `originalEvent`.\n * @property {Workbox} target The `Workbox` instance.\n */\n/**\n * The `installed` event is dispatched if the state of a\n * {@link workbox-window.Workbox} instance's\n * {@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw|registered service worker}\n * changes to `installed`.\n *\n * Then can happen either the very first time a service worker is installed,\n * or after an update to the current service worker is found. In the case\n * of an update being found, the event's `isUpdate` property will be `true`.\n *\n * @event workbox-window.Workbox#installed\n * @type {WorkboxEvent}\n * @property {ServiceWorker} sw The service worker instance.\n * @property {Event} originalEvent The original [`statechange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/onstatechange}\n *     event.\n * @property {boolean|undefined} isUpdate True if a service worker was already\n *     controlling when this `Workbox` instance called `register()`.\n * @property {boolean|undefined} isExternal True if this event is associated\n *     with an [external service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-window#when_an_unexpected_version_of_the_service_worker_is_found}.\n * @property {string} type `installed`.\n * @property {Workbox} target The `Workbox` instance.\n */\n/**\n * The `waiting` event is dispatched if the state of a\n * {@link workbox-window.Workbox} instance's\n * [registered service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-precaching#def-registered-sw}\n * changes to `installed` and then doesn't immediately change to `activating`.\n * It may also be dispatched if a service worker with the same\n * [`scriptURL`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/scriptURL}\n * was already waiting when the {@link workbox-window.Workbox#register}\n * method was called.\n *\n * @event workbox-window.Workbox#waiting\n * @type {WorkboxEvent}\n * @property {ServiceWorker} sw The service worker instance.\n * @property {Event|undefined} originalEvent The original\n *    [`statechange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/onstatechange}\n *     event, or `undefined` in the case where the service worker was waiting\n *     to before `.register()` was called.\n * @property {boolean|undefined} isUpdate True if a service worker was already\n *     controlling when this `Workbox` instance called `register()`.\n * @property {boolean|undefined} isExternal True if this event is associated\n *     with an [external service worker]{@link https://developers.google.com/web/tools/workbox/modules/workbox-window#when_an_unexpected_version_of_the_service_worker_is_found}.\n * @property {boolean|undefined} wasWaitingBeforeRegister True if a service worker with\n *     a matching `scriptURL` was already waiting when this `Workbox`\n *     instance called `register()`.\n * @property {string} type `waiting`.\n * @property {Workbox} target The `Workbox` instance.\n */\n/**\n * The `controlling` event is dispatched if a\n * [`controllerchange`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange}\n * fires on the service worker [container]{@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer}\n * and the [`scriptURL`]{@link https://developer.mozilla.org/en-USCopyright 2010-2020 James Coglan

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ��4}K�~��T�,��{�5,@�I�����.t.����/g����Q����#Ul9>�5�j�l���O��-h��q���(�%,;���-n���q9�s�y��4��Pf��7>ΚU�鈇��g�)��!`�i�W��+��X�eG�}���/i�z�;�Fܡ�n�!O�Uw������x�4�8W��}*o�"	���z>E$��3���?��;�IX:"u�|?�Ϳ׏4$��'�Z�f0��ڭ��y/�ܟf�ݞ�㖵�M2�=/�Hּx��5���;p��9)���o��Ç��
�υ��&H,����@�.?��!���K�Lq�a
�$��ӿ�YwWS��ԶxX8xU9���yF Pj�ߟYԯ1�s��z�V���K��_Θ7n0sB�B��C�l�5JW�r糟k��	�_{�QF�B����.⒑�]��7����i{Xk�9�&��dJ%J�����o� ���IŇ���&�
}*t]�����B#g��7Fɠꂮ��w�VX!�d����S֓=�E��4���#�Zڰ ����Q�<dS��gw����]�s��+�����Һ~E�$)�^fb����n��2�B���d�g^���x���9�?�2��O\��� oT�ȼbЗ�4F�J�=�Y� ��V�Q*)�[B팇��t��>G�>�c��쭢�({��۷�A=4�%��}6y�("z.�}b$)���R�[�"�����uq�4��;L�d���e_�! <��B5e�6m� qmߘKk��~)?��1y��(*�P�,�0d��u���Ծ �~퉑΀\��+hx�F����<R�$��	���~�X?��d��&������9�2��kg�Ph$8U<�����)��٭���������|R����)z'![>'OGm]�v���� 4���`c��ʠ����)�(:�O��@��*�i6f�9��yX�Z�hw����yjMY��V<��n��i�e6���gE��%��0��46�8ŧ_�;��s�gK��]�$O�ˤ���̠<���QB,�l]KK��k]����gR��,�c�CT����i=l��b�w+��J��akit'�юA���,���=��˫??EP��U[�G�F\>�8|�=�z�i�� H�t��`��C��ufcbHDr�\�W�]�B�dCi�N�HE׻����e���ȝ��V�)Z?�{�R�꙱��n�� _؊���:B��ʬ���m��g�Y!�S�{��=���Etc��6����I�f�vrkwk-T "Q7Q-�sw�xd����e�@�Ҽ&������!�َI i�Gl�6��id�-�E�g ��+by�Oֲ8
YE��IW����ˋ0~2٠��rO�l��j$}�J l3���5!,�"�!/�5ڸ	b�	�W�٢�J�v��yr��t:?�X����$�%�B�.����M�V��n��d+[l���tk|!��&��#��ג	�m�G7_�a� �@ߏ��=Y�j"�%e�_�U�R~#�rL��V�c�~m�!^�lz3B(��<��s2��� �V8�A�b7)������.H�ڕY��RB$�jn�L�ȇ5"e�aa�3 �
�'�iNn�V
U�j��ك��ԁ�V�o������{��VNfm�t�'B����v��]Y��ҽeSJT��N2
�e(Eݏ$u��	�zR�֪��o������������D�Yg���j��D�*Կ��������?]���@	�r��'QG�XH���"���讐ou$G�@�-�y�S&qF.���i�F���<�c�GWsoZ!� ���h�<Lm�zv0B�^�[Ʉ�3��	�!�y�g ��K%n�w>�����B���6�!�Od��
1~���>�p����3��G�[���B(�n�vg�.uv@���(k�F/���2ڞ��q�-�387�u���9���1v��O��9sNZ@ܞb��F?�z�E����[�eA�����97����86CI�;�O ��&Z�l�����pKD�|�,�1��hg)Q��o��X��ڔQvW���`b�iykvF�Pfע_jNGGD�2�3!Я�V![聽�{ș��"s� ��tU�0΂y����1��D>����V��� "�54�^�yԅ�����
�sD�BR6$����E�t|        lA�K=�t�nG[��˶	ԲH��c��uei+t�[HU�莻G=�ؕ��\��w�+������2�)v�X���f��9D
P�KE5Ʊr�妃����)r�3%�Ie!��kl�&��y *��Q��k�s8�G�����Ϊ�N�u�BmW�WI�-<�~/���Cfo 4��/^�%�oI]*R��ʄ��3 bl�ԥk!՘yǐ�/5��,��-�%���k2A�e��2ù���]�C��l��a���A�4㔾K#�<^D>@@MfF{R��I�?r��@Xt<	��9fJu�c�u7�+����v͡��f����Ũ��ǺM����
�Fm��/�)��29���Χ�t��!��a-P�+{��fV����~��;�D�p���f��@,��G��!1�v�*�PUp�q��_\{��[^��_X�k�7F.	T�L��J�*���y��bPkW��Ї?j��ݲOb5��=�T�<���(�W�6�@{_�/��"��� ��y�����f���l�5�uS�/3@�+'�*��b��G������Lb��Y�����_EUp)�������N|$��p�����=��;�K^�^����d+S���ؾM�	ޚ4�;�G3e�z~$��"|��V��EXʊ:�T�$���h>V�*��\�5���|O��@�L>wcqg����S�����Xx�LN��G�w�@��O(������z�X��FA��$�����h�c�}��9}n޺��x G��C�I.l��Ԟ]y��%��1�!_ݞrU؍-��2���p��Z�;�%ۻ�|G�*H�z�]c����Z���op�����Da�w�S)��c�$���r����Q��O�����eJc���{��7��j���:��a�|&5X?���d�~��}ơ���1"�.v���&�)��yΡs���8;�֐r�\#�ڠ�E��p�%�mL�uy�G�1��Qn~u���y.�A$,sWDZz'�2�j�ؚ��H5�r]�� x~�����j��b�W��d����9cT2�Hd�CX��|-��{��g�{��7;��P,���F�d�����K�ŋ>���?K��+z���[����z����i�f�%V�������gS�bYŜ�q�n# ��O�&M7W�A�Ǒqt�|�Yd����q�x+�����fp#�)9��ۚ.}Le7�2��V車���i� �
6ub5g�-�լK�E.�@��ʥ�7�..�8^=*ҕ��PkԴkN6���:f��L�r�I >��}h�}Ue��/|7�Yz���	�^���Q���v� {$�<t,sp{��!�w����kSM�$fK�D3¢}���6c���J�_ �1�0îr�Q����̄��~Ǳ]��3�M�̃t�
W c��5�;�L�\�k���U���W�D�!���n��Q� 	��(�6�pr��Pi��UU��/�M��2����]4�e�T��l.�����y���S1]в���~��%`/Wz��>��秝����M���,^�@2�'�����������#f3?A��-���}@���J��2'��g��k��}'t�b;�P5�!�1x���j�p�g��QNkG�O�\���r	�B�:���8f�����Y��7��iyO�_5�Z�z�����v{�2>��c���
�ʔ�� \�`�J�wg@&Uj^͎*����ױ
e3�H����Ɉ-¬���<������n/Ѳįq�ISa�L�;zx�������n�O�(R3K�3�^���Xc+s�^�ٟ~bۮ��TL[PT����|A%�ך<$�2Z�ص|����{�o>ξ����
$�����s�÷"�3<U�QS��>!i���5Q5�5�W)�d�H�SNK�lp�F��F<P7U6vx�t�+�8�[xǋn`G����a�R9f��;�D�c���'ƃ�%.���;��/=|:���B���W�h����"4"�J�
\�0{�C�cAa@�j�f�iK6r�ŋ{\93g �����f4^����P/��$J�mTk��{�-�`<~���w5�C������IASD|!��ի�hq��Ҧ���G�=��wmɑ���\n>"��՞(����Er���s�Kݝ�7�O�Q��"�qM�����;��g1���_t]�Gz���!��^&�Sx��-��g��.�m�x�sD��'B?I{���a�����w�$��|k��+�[�d���N�2��4��2��2o8��?�p�~��Γ��檎�=іa�m�bj�M�t�9��S;\�p���f��NV�ړ�(���fW���Ƌ�A�Vw�ԟ��eV��;=g����?�f�ej�_s�L�i�����k_++k���r��z�μ��(���wG Ŀ��Z൤��}:�{_4.�Ln�(�]���yj0]����u����s;�����i��>h�S�IM$�y,]��#��1���欶C��H=6�N��a!��l��H����!�Wl\	�Y�fc�ʏ ����}�c�|E���'�&^��?u�Ϭ�L*���9<��Rz�N#�|#G-p�Ss�r�����[^�OK�7~�⾄�ͻː8n08�*9U�#7�?��٦o�`	/ĦH���+K֟1��W��uʯ;/����*P�|�꓉�#�����_������t}�kPSԺPY��C���+�P�t�.�v��e`����� ��WU��w��q+l�+|��N+�&\,Oɱ�D��6c���=�E�K�M݉�bQV���!�P]�S�*m���!������U�s�YV�{�c�^�ɘF��t��_p�ȕpe�Elkh�b؉��旣�^�&�:U�M�����]�	b��+*?1�qa�j�!f��fe���������c�&IT����I{��4�֘� �c�����F^��SB��&�{Lvu� B�����!�-�EK�+evT{���^.. ���8y��P���B�P�c-����9�o�������>s�B���Y����Jb��y���'����Pf6K�O�,`U����aW�*�ԞEe�V������a�|(�IH�C�_�:,�li�i�r{pI}�yh�@�l���<'\�l���=MHҀ�V\֡#����F������ѱ:@�nY�V_O�{+���R����Cz�3� (���%�?�^.��䮎����O��N�AM1���O�k@��<���	��A]�!�N^�:_�t�9�X��ΐ��hmV��oB�󸦩�h4Ѹ�Z��D��P��9��t�C}��\��-�q2x���4�CE� �^������޽;?��&�m��V�V���b��).�������2����/�U�ı�����R���.�+���f��C�<��0�臥~rwጱ;; m�U�҆!���+��!��M�#��`;�{��J�NԄ��L��ŗ$�YL�n'�J��]*9f�{u`�|��b�{s�Q���Ok�Q����f:�E�8��"p̀n��$i?�g}t�P�����Td����}����WS��H�=-N���w'M��^}�Z�m�N}��2FGr5�A)C�ʑt��\� ����F�$0}�~cJ���� [Fk��6��|a�n�@�i�{��B�!A��gq��O�]�=��F���b�g� ��=YY��/H��|��fȝ�����>�#sH��R�c����=`��G����FvE{�=P������nz�0�s��sm��X��Ӡj�������ք�1IO\e�� ^|X��2�Ԣg4U�K� �q�N��ǽ��0���W��/�p�$'8�ѫ��N '9�|�)A��A�ޯ�WTw����fqA�3�+^�<�Q����J ��2�b(��?9d~CJOBZ�=z)<�B}!��}��l�,�]�U�k�dQ"0u�R��lC�٧T��BO���[��j�#,d(Ԁ0m�O�����tȮ�>�M4&]��//z�d0l���V̀h�)�]4�/�hK6,m�bӮ
����O7��[�{)t�Vl��H�|�zqg�`9�T7���[Ld�'.��S�6G���K�#���Ȼ���6���	���y6jO�P�Tn���c�1�{�S"lQ.�s-5�x�)t�K�ך���]v+��������Va�1�4�(5sn�th}\�	Rm�%⎅K�����CFV!q���i	/S��.H(�+��#���C`5}�w���ªf��)}�,�*�t]�� ;�1 a���!�f���j�I������YKL=2Mp�wxg�ܹ�Ka@~.��)�wcB5�v�rl���&<�eR�`�&�ZJ��h�6�?r�?�_9~�-�fK�ގ�E���Vi��.K{{�M�o�����Y�%��rB�r���<��m��G��Af���>���L=[���Z��`DA1߫��%���V[e�rQI�]�ʐF2�͕&�Mp�UP�ϵx�^��ނ2�|9m�Ă�|�'k!��40Xy��0&��"B���2�h��ςp���h�
||_��Uc����1��*H���3?���7cFw�ihBo����uK�aC��2]+�~Q��
����M��N.3�R�8�K{d�n6,�q���Xj�9���#�Q�i�i�Y��IB��:�}��y��D�1��f�FUeE���Ē��.�ʀ&S\D���.����P�`d��1l`v���wH������<`��w�5$������3��]�5a.�X�c�0C�y@�5�bK�3
�]_?N�.�L�	'һ�/�ތ��܎j@ܠs<j��g��F0s,��d����5�W*x�S�N'|s {���P�$_�H�Ғ��o��e�te	��&���8�Β,2��p��Gt��<��+�xq"�/�������y��3ݏ���ɡ��0��8�2�֌/�S�hkw�-����!�QW��NPo3�� �:���� +����-�s����&329@� W&���>&�J�
�
�쀷c)���;���Ж��-_rkڃ��m+@��+�<����Tb�,2�e��s�+����/u�����F�r�������#1f`��ss,ب���\�&�w!�;�yi��:?�vP�����ߘ���"^(P�[�j�u�w�M�O���|�fbX��'�&1��yފLj_�<
�j{� ��Yc��"N:]��'�]5&�h�WW�)��Fi@��u�R�U�ਫ��o�`��Pɸ5���$�(��$=7k*}�P���i$�$��	$��z�lb��y�qÈ|���_��ߥo!���L�񞝯wr����8��1�_�%cn�3�Gv��R��R��g�n��؛����r�ې�[�q��B��bM���*8�� .���}�#ǳ�PnA(���� [ {���^��a6%@?�W���7�J�,�G�yS�ɞ="��������|0B�V4Fp��H���"���{ѤI����W3L}syL۩��,�M6������FK�⻄+��y#p��n*:�����k O�������,�D 4���j�P�q��J�t��%.�=�ߴaM�~Ԣ.�z����Y�@����V�7��*|q���DG���E�KD/�<x�[�Wk!�h^
+GH)��V�"�z�.��tѯ)U��gk�+�p
<FX;d�HoU��{��G>��2n�<WD"C��<��,B�����Iڔ����/$�dxYv&�#��������/n�z�����|zڍ#����Z^���G�Z�����˲��s�@�e��㮝���(�m5$1@�b1z((�ͻ�*JQ���hr���:����	��V�X�b+�g���������&ՖG�0<S�r��m�*�k�w��Z={���X����ˎ�'5��8gªXqv�^w�Ad��F�2����5;�q��k��P:rU�Lڗ~�� �xi�9�3�*����v�;X��{��� �To��ѻ��z�]�����1e��i���<p��q�j� �p�Q���L�9�7���gB��^'�S���xJ- z����̑��q��w���G#G)�V�!2������P.�1�#�n֩�ԦKo�_�VТ赌�Ov�V����^jh��\g1:���>PW
s�ܧ;i����l���eØ�3�����N��Aә���B�������5XZj� ?"��5��-<�{�t�X~2���jkߘ)K��$�)��O�moZ�����Ǻ�Q���<���A�!��HM���@��
�p%��R�ͧ7�9�
�R��y�����P�-u�/���2Hr��4�t�7��������p%[��fM	��p����ALy-��������P�8�&8�����.N�"Co:��F��")��Xw�n �)�I��m�ݴ.�@�*}(n���b��U���&bgV;��qLє�����pN�Aw���     !�ݽ�e@�&C��{���z�IU�	*��ŧ�k��,_y��⒧�jj7��*��IF0�^��)L���i�U)�}�K/��E�Q�U�J�����]�_}��~�)��n�0�h|��`���ń�ew%@V۹]�@�:�h�_��x��Ŗ���	��сch��(�j?�����
2��0ϞT��w����%f�e~o�|����0��J1��%�a�M�����8�,nC�c�KV~�Q�!��4��
9���=f��PB Bq�.�&�s�Ѫj�.�� �c�j[�v��k�3�6�e������H�N�xV��4��
.[�m|�?�/jҮ���v���Y[�t�:�PP�/�K���<OG���n1����	n8!���ʀ���S�޻�jk���ZJ�r�J�*�*(�=.�i�4"?�@�)t�b�9\�R�<���Yyg�;`�8�Ⱥ9\���j]�a����z�\ќ��B  ��J�	�����ڏ�Xa��+�q$�a5�L�`�h�T��%�)�L#�ѰN�o�ځET�s�a�Q��8[�������E(���{���ڭ��M���|��r�5�р��&��/O3`�AU�K����D$�&\��Zp8�Z�@�.�*�\ 	aqb�@�T-�H)C(Amz�׻��^܋��V���e�P�.��~���u�h�f���Uee�������=��^���c���Awww�K#�բ�I�����m�i�w��N7��J�!����b@�b5���\��{�ZZU�H
V =da�����}�ny7��쥡�8(�_T5I&n|Hu�h�1�,)���/���3�w摧���H���&�C��v�C;��O�	p�-��*D(q+亼&nCv�
V�r+@�;�U�5k\�͐O�t�&�DueN�a]��o�B�O��
8Ґ���.8c��4ᙽ�b
Dж"� �0ؾ[օ��dX���1̧&�7����8�n����%�WX�q  �� �f%�T� �@�������g>{uUy�*U^�>�ۇ�>�&�0Î� �}
����Պ�A6�1W�Y�� ̸�%�v��=3T���B����EQ��ˬ�>�{�mI�T���j��Ra���\\  ,A�K���l�a�^6�3A7��X6GP��'�K�T�K��k���E��$�$O��V`Ŀ�s=z�	���Fm��T趉�D>����V�O��,f����"��S؆���J�M���:Opr�Z�de�`Q;���%��/�H��8��|��ә[<�>��TS/ы7l�%��-B�T8��vӄX+��I��f�n+ڭ>�U�63���y+�;R�du8�j�/�m��і��ͪ�,�"cܛ������9~&�⍏֢� ����H��PV��~݋�#ڐ	]�{C�����OBG�3M��d�� ��p�};�˩�>�N2�L��ف�_i��?_B�<���%#�J3���3�mIda
D�@慐$M�.~���ϐ�a��y�Q����8U�:�Rx�j�=pa ���4������!O����5$��V���'U��i�[9����܁�J#X�ߌ-�@��˧�8�.V��цvn�`H���fυ��W?�����U��W�3PPʧ�m)��<+tj������b�;�_�a�#�]q�6��3�r{ï�bX�@km\���Ҽ�-�h�sz���Y*F"<���{�ƕ"#�:+�ٝ�~V��-�$>$�����D�[��)ݵ���-����¿֑(%���'��A��v��c5�qj����gGt�\��>/pi�q���^�PXZ�y�K�k?u������X�pE��n����m���/<'��5��B���>�O: /��f1�A��ӌ�X[}��=S㤊�7��{�ADG���Ѱ�m��������#߭2�`<wQ�I�s��|�$�G��Qヌ5 ؁�*���¬]���9��J/eQ�q��uR;d�֠�3�@Ae��`�2+q�)�b�3u<���o���1x>j�OW����8��̠�$S,�?I`�C���7a7�ݎ��&Q����%boS �ȏr�{QX���"���Ux��gu� ����ǹT��9�M��.���V �u�Tj�ouE��6���U�o�r�_8��E(wS�[o��JD��(����@ e�T=��,�rh����0�V8�2��꿇���7�.�,�UZh��e�rf:`M����A�IϚ��]�+�>���G�=�E��>�#��L5����������V�-W�xf؝`Z���V��a:W5�_��$Q����3��~:�༟j�p�h�臔��4OX)/��U�0TZ����A���������Q��U�r�p��%���X�R8ޛ5$F]�.a��[��!��Mf����Ż㿟tYu!M��N�r���y*���H��G�M�!�pC��@Z�0��3~׷��������Ķ���͍ByT����Q5`H]�w���ٙ��n b䢭uiX�+�n�	/X��$<F��+�=�h;6`��̖��-���bK�#���!7`� 2b���۶H�1k`t����1μf���C�6l6�\�T�܇�@�BEc�P���ǈ�o�)��h�z�ۻ�:#3�>�]��@����P:G82z�#G��Oz�?��{�79P�ϴ;둣Q�9{	p�8%�{O�׈l�鑞�3'@9β��l}���Uh<�V�u!m�1_���፨��}\�����������L����=>2�J!�9�ue��z�JW0tL�����LD)���%�l8�,���I�Yo�|��������9f������!Ub`뼍�*5_~�����{�v��$7���ÑS��h��|�fq�
���~�`@������%g{��\�IY���Ζҁ	��D�V�h���;�����B�QK���r=`�;�ƴ�꒔�xj C=1S��0���7�4r��� �.�B�f��,�zB�3$�\5����[�l�tO	r��zb����q�<�ث������XA&*; ���z����p���č��>�X�p/'��y;�R:/%�l��J�7�Y��	���z}�`qќOk��\"���!���w?�_�g�����S�k����"�'�Q���c1aJ�c���r'�x�l��sJ�.��w?�3A�{��`� r��(�k�'�:�_�8�-9�>�`�0�zc[��Y���A���^A��h6��o�z-�=�K��=�4�7<Bh��	_�!�ˢ�[M`�m`��a�L��y���Bg���o,��z�r3N�� ��+nGG�'��o�����S��a��z�L^�O'��Q3�b�x�\�1G�5*�}��7����W )E�*@W{�Z]5���)E�)oA�Y����P���j�F-��-Z���gl l��-��DV�f�'g�^[О!�aQ�����j:xMƼV���\~w�6��M��AnȞ1~r�$������C�� �B�w��!�v}�%Ɨ�N.qbTx3��Qv8zL� Vh"By^�Kv,�.�kA�~�k�D��rA�9I��x��*4uŻ��M6Wt�6���-�_zC=^~Z�����'��Gm<�t��b�>��F�׊2/&b ��U�4��Z��Va�������L-�4N�}i��C[4�Ժb��f���6��T36{6�H�sj<����3Õv�^㜫��~z��[�<٨4���qK�9%����\��qާt�\�Zy�W����P�>�zU1�m��S�Zc�I���k���
��lK2��%����q�F�30�V�Y�|���>�>ӽOo���;�5ޭ��T���zG�t�q���CG]�%2<vͩd��-hԉ��	��ġ���<J6]�"Y�5=�{\����LV	�p������K�wV6\�[���
�N")T,P���ߕ��Ys� �Y�	�Sê���[.�l,�S
�)�p3f#Q@X�x:9F[���R_O�-�JQ��SO�����Ol�{Vk�I�����4�� �������m�t=}d�~��-��u��� �F�`5�
�l �ы��y]�3yw�.���1X���S��}���r{�D݅7���2)pֽ{����Ĝ� ��*�?��z�R�ׇV=։|�o֚JG��z-�M@���3cP̱R�$�~�۠�s�M�A��oD��n܄@`>z��%L�n�+��S���!��
�s=�����v��t" 1c�������#2C���D�B+��;�'��S���6�S`��H|f4�=`�p�zL���Ö�
�t{H7��켸~�D�:�b]���*�w�Ĝ{�ҏa���p!�f�&g�/�(Gk��(:!�%sY�=S�ePϨ�}�����@���:)/�#�$�؏�~@u�ۜ\�^9*�i�=#��UE�۱���."���J�4�3�L�M-D�GXI��
�:[��9����N��z��,�Z7��@Fc�q��{9}�!�Kxl�����wK���hv�������sM=FAT1-�,�߿.�O�&y�ҫm�*��%���XT�,w	FEs$Z����=����i�v�J����w��j�a�JcB4��գN�E֦�)4kY�b��
�tB���c��ì�KQ�|��'������^���jn&�%O��_SN�������!�� R�YD��C .�U-M$&?<V��T��ًP]��LW�E_|z��zz�����k��Z�6e���� �V#�z}Í`��_�(�+v.�� v9�$E��<�N*e9dt7K��l٩y���:����~oO����'���Bx��B_e���^�D�S�}��_�`�C�Bܓ=*ߪ C՟���i�a~�\Fu\�7ܺ��Sr�>{8Y��	N���
�:����$���4��;^!���<����_k���;B3���ZLuH&�e��dexNri�ȁP��o�d4���k_L�������ǩԓB�%m�_۝�>w�2�]@�ty?>�*r�^��ɛ�#%����)�y|�w�����[2yo�FX�J�{�X�	>��V����:�j.�h�TA�M�Q�SI�(����ȆC�y:M9BRm�4r�N/h�^��?�=[���� ����ks��|��((z�-����!:�A��qv]��n)x-;���o����u>I�}<p���٢�tc�W�(-���Q����.0�����Wk�0��0��Z <S'�M��,NUN	R�U���L��$�/�I�:��/��'�:�����n�F��N�u��R�GS*
�C�v���n���.��\&ʟA:=�M��ū��-,��w��>?������r�����}��WF�O��Z���Ê��n{8G�����7JQC�g��o�)�$�g����Ϟ�Fr�c�l%>[j3oGqj��`)�N:_~X���s��\C �vs�4?�(	`��T�o��?��eb̡ql]�2�> �5�B[�n�����Ӷ�:>��ciuT܇�jA��N-�M�>8)z�s4���HG����"L`VۨP������/�i}���j� !���'mr��6�
����k:���Qk�������
мÇ�WU�}fb�+u(.���<�\��)%_�/�_VNh���`�x���.���4P������
1K��∀f�r��o���w��ar��_ƚ1NZw!u�񳘎��d�(bTC��JF��,p�,����dŽ&>IVҠ�ƾ�u�s���6_c����&)F�<��6���ަ�VihE��z�Q;�9��V���\Ꙩs�g0�C�$B9r
1�3(�H�H�J&;h��Ə�遵"���$@/^j� S��y贈~�}մ� 6w؏ղp}�N�d�I�{AA�{�Z��ǐ� ��������8���-,�5Kp��6)
��!2���8�4�і]_;��םO]&5�Ȟ��b�~�*�젱83I����eR�J�*W�Yy��G`pKR��dw���&��öxMWҢ� Z9D�׺�Ґ����������9���(;�������Ls�<�M�P�$�3F5�� ʛ����ė���>GT�=gRtL�3�/���+_�o��ҾMS�H�-?�mB��X�n��ѿv�Ma��/$-���������p3��ǜ�+b,��:	���=��j �+4.�d��I��D)h9����p�>�\�B\w�0���V�Ԯ��F`��"ξO����3�TEz�Y�ažq��t�"�B��ij��x��X�{Ӽhn������ӳ�K:�ݾ��"ȧZ��Nك����?����<�|�'��
���LҐk�d����$w���m���J�:�]܈��&�y�*�2:*�~��]��<��>��@ސ�������V�W�&��v�pN���x:�316�-6�CJB��T���4"d��J�x�H��^U�/k�:�[^40߻t0��N�`�Ε���?�c�� ��y?H�b��È`xPā�X
��,�T�U#F7G�;��M�ު_�iĖ������0�%�_�M�R�tC�`oy��qP d�}�\��U�1^;7�u�s�G��l���Q��'����d�
     * @internal
     */
    newChild(name: string, type?: number, opts?: PathOpts): PathWin32;
    /**
     * @internal
     */
    getRootString(path: string): string;
    /**
     * @internal
     */
    getRoot(rootPath: string): PathBase;
    /**
     * @internal
     */
    sameRoot(rootPath: string, compare?: string): boolean;
}
/**
 * Path class used on all posix systems.
 *
 * Uses `'/'` as the path separator.
 */
export declare class PathPosix extends PathBase {
    /**
     * separator for parsing path strings
     */
    splitSep: '/';
    /**
     * separator for generating path strings
     */
    sep: '/';
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */
    constructor(name: string, type: number | undefined, root: PathBase | undefined, roots: {
        [k: string]: PathBase;
    }, nocase: boolean, children: ChildrenCache, opts: PathOpts);
    /**
     * @internal
     */
    getRootString(path: string): string;
    /**
     * @internal
     */
    getRoot(_rootPath: string): PathBase;
    /**
     * @internal
     */
    newChild(name: string, type?: number, opts?: PathOpts): PathPosix;
}
/**
 * Options that may be provided to the PathScurry constructor
 */
export interface PathScurryOpts {
    /**
     * perform case-insensitive path matching. Default based on platform
     * subclass.
     */
    nocase?: boolean;
    /**
     * Number of Path entries to keep in the cache of Path child references.
     *
     * Setting this higher than 65536 will dramatically increase the data
     * consumption and construction time overhead of each PathScurry.
     *
     * Setting this value to 256 or lower will significantly reduce the data
     * consumption and construction time overhead, but may also reduce resolve()
     * and readdir() performance on large filesystems.
     *
     * Default `16384`.
     */
    childrenCacheSize?: number;
    /**
     * An object that overrides the built-in functions from the fs and
     * fs/promises modules.
     *
     * See {@link FSOption}
     */
    fs?: FSOption;
}
/**
 * The base class for all PathScurry classes, providing the interface for path
 * resolution and filesystem operations.
 *
 * Typically, you should *not* instantiate this class directly, but rather one
 * of the platform-specific classes, or the exported {@link PathScurry} which
 * defaults to the current platform.
 */
export declare abstract class PathScurryBase {
    #private;
    /**
     * The root Path entry for the current working directory of this Scurry
     */
    root: PathBase;
    /**
     * The string path for the root of this Scurry's current working directory
     */
    rootPath: string;
    /**
     * A collection of all roots encountered, referenced by rootPath
     */
    roots: {
        [k: string]: PathBase;
    };
    /**
     * The Path entry corresponding to this PathScurry's current working directory.
     */
    cwd: PathBase;
    /**
     * Perform path comparisons case-insensitively.
     *
     * Defaults true on Darwin and Windows systems, false elsewhere.
     */
    nocase: boolean;
    /**
     * The path separator used for parsing paths
     *
     * `'/'` on Posix systems, either `'/'` or `'\\'` on Windows
     */
    abstract sep: string | RegExp;
    /**
     * This class should not be instantiated directly.
     *
     * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
     *
     * @internal
     */
    constructor(cwd: string | URL | undefined, pathImpl: typeof win32 | typeof posix, sep: string | RegExp, { nocase, childrenCacheSize, fs, }?: PathScurryOpts);
    /**
     * Get the depth of a provided path, string, or the cwd
     */
    depth(path?: Path | string): number;
    /**
     * Parse the root portion of a path string
     *
     * @internal
     */
    abstract parseRootPath(dir: string): string;
    /**
     * create a new Path to use as root during construction.
     *
     * @internal
     */
    abstract newRoot(fs: FSValue): PathBase;
    /**
     * Determine whether a given path string is absolute
     */
    abstract isAbsolute(p: string): boolean;
    /**
     * Return the cache of child entries.  Exposed so subclasses can create
     * child Path objects in a platform-specific way.
     *
     * @internal
     */
    childrenCache(): ChildrenCache;
    /**
     * Resolve one or more path strings to a resolved string
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */
    resolve(...paths: string[]): string;
    /**
     * Resolve one or more path strings to a resolved string, returning
     * the posix path.  Identical to .resolve() on posix systems, but on
     * windows will return a forward-slash separated UNC path.
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */
    resolvePosix(...paths: string[]): string;
    /**
     * find the relative path from the cwd to the supplied path string or entry
     */
    relative(entry?: PathBase | string): string;
    /**
     * find the relative path from the cwd to the supplied path string or
     * entry, using / as the path delimiter, even on Windows.
     */
    relativePosix(entry?: PathBase | string): string;
    /**
     * Return the basename for the provided string or Path object
     */
    basename(entry?: PathBase | string): string;
    /**
     * Return the dirname for the provided string or Path object
     */
    dirname(entry?: PathBase | string): string;
    /**
     * Return an array of known child entries.
     *
     * First argument may be either a string, or a Path object.
     *
     * If the Path cannot or does not contain any children, then an empty array
     * is returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     *
     * Unlike `fs.readdir()`, the `withFileTypes` option defaults to `true`. Set
     * `{ withFileTypes: false }` to return strings.
     */
    readdir(): Promise<PathBase[]>;
    readdir(opts: {
        withFileTypes: true;
    }): Promise<PathBase[]>;
    readdir(opts: {
        withFileTypes: false;
    }): Promise<string[]>;
    readdir(opts: {
        withFileTypes: boolean;
    }): Promise<PathBase[] | string[]>;
    readdir(entry: PathBase | string): Promise<PathBase[]>;
    readdir(entry: PathBase | string, opts: {
        withFileTypes: true;
    }): Promise<PathBase[]>;
    readdir(entry: PathBase | string, opts: {
        withFileTypes: false;
    }): Promise<string[]>;
    readdir(entry: PathBase | string, opts: {
        withFileTypes: boolean;
    }): Promise<PathBase[] | string[]>;
    /**
     * synchronous {@link PathScurryBase.readdir}
     */
    readdirSync(): PathBase[];
    readdirSync(opts: {
        withFileTypes: true;
    }): PathBase[];
    readdirSync(opts: {
        withFileTypes: false;
    }): string[];
    readdirSync(opts: {
        withFileTypes: boolean;
    }): PathBase[] | string[];
    readdirSync(entry: PathBase | string): PathBase[];
    readdirSync(entry: PathBase | string, opts: {
        withFileTypes: true;
    }): PathBase[];
    readdirSync(entry: PathBase | string, opts: {
        withFileTypes: false;
    }): string[];
    readdirSync(entry: PathBase | string, opts: {
        withFileTypes: boolean;
    }): PathBase[] | string[];
    /**
     * Call lstat() on the string or Path object, and update all known
     * information that can be determined.
     *
     * Note that unlike `fs.lstat()`, the returned value does not contain some
     * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
     * information is required, you will need to call `fs.lstat` yourself.
     *
     * If the Path refers to a nonexistent file, or if the lstat call fails for
     * any reason, `undefined` is returned.  Otherwise the updated Path object is
     * returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */
    lstat(entry?: string | PathBase): Promise<PathBase | undefined>;
    /**
     * synchronous {@link PathScurryBase.lstat}
     */
    lstatSync(entry?: string | PathBase): PathBase | undefined;
    /**
     * Return the Path object or string path corresponding to the target of a
     * symbolic link.
     *
     * If the path is not a symbolic link, or if the readlink call fails for any
     * reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     *
     * `{withFileTypes}` option defaults to `false`.
     *
     * On success, returns a Path object if `withFileTypes` option is true,
     * otherwise a string.
     */
    readlink(): Promise<string | undefined>;
    readlink(opt: {
        withFileTypes: false;
    }): Promise<string | undefined>;
    readlink(opt: {
        withFileTypes: true;
    }): Promise<PathBase | undefined>;
    readlink(opt: {
        withFileTypes: boolean;
    }): Promise<PathBase | string | undefined>;
    readlink(entry: string | PathBase, opt?: {
        withFileTypes: false;
    }): Promise<string | undefined>;
    readlink(entry: string | PathBase, opt: {
        withFileTypes: true;
    }): Promise<PathBase | undefined>;
    readlink(entry: string | PathBase, opt: {
        withFileTypes: boolean;
    }): Promise<string | PathBase | undefined>;
    /**
     * synchronous {@link PathScurryBase.readlink}
     */
    readlinkSync(): string | undefined;
    readlinkSync(opt: {
        withFileTypes: false;
    }): string | undefined;
    readlinkSync(opt: {
        withFileTypes: true;
    }): PathBase | undefined;
    readlinkSync(opt: {
        withFileTypes: boolean;
    }): PathBase | string | undefined;
    readlinkSync(entry: string | PathBase, opt?: {
        withFileTypes: false;
    }): string | undefined;
    readlinkSync(entry: string | PathBase, opt: {
        withFileTypes: true;
    }): PathBase | undefined;
    readlinkSync(entry: string | PathBase, opt: {
        withFileTypes: boolean;
    }): string | PathBase | undefined;
    /**
     * Return the Path object or string path corresponding to path as resolved
     * by realpath(3).
     *
     * If the realpath call fails for any reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     *
     * `{withFileTypes}` option defaults to `false`.
     *
     * On success, returns a Path object if `withFileTypes` option is true,
     * otherwise a string.
     */
    realpath(): Promise<string | undefined>;
    realpath(opt: {
        withFileTypes: false;
    }): Promise<string | undefined>;
    realpath(opt: {
        withFileTypes: true;
    }): Promise<PathBase | undefined>;
    realpath(opt: {
        withFileTypes: boolean;
    }): Promise<PathBase | string | undefined>;
    realpath(entry: string | PathBase, opt?: {
        withFileTypes: false;
    }): Promise<string | undefined>;
    realpath(entry: string | PathBase, opt: {
        withFileTypes: true;
    }): Promise<PathBase | undefined>;
    realpath(entry: string | PathBase, opt: {
        withFileTypes: boolean;
    }): Promise<string | PathBase | undefined>;
    realpathSync(): string | undefined;
    realpathSync(opt: {
        withFileTypes: false;
    }): string | undefined;
    realpathSync(opt: {
        withFileTypes: true;
    }): PathBase | undefined;
    realpathSync(opt: {
        withFileTypes: boolean;
    }): PathBase | string | undefined;
    realpathSync(entry: string | PathBase, opt?: {
        withFileTypes: false;
    }): string | undefined;
    realpathSync(entry: string | PathBase, opt: {
        withFileTypes: true;
    }): PathBase | undefined;
    realpathSync(entry: string | PathBase, opt: {
        withFileTypes: boolean;
    }): string | PathBase | undefined;
    /**
     * Asynchronously walk the directory tree, returning an array of
     * all path strings or Path objects found.
     *
     * Note that this will be extremely memory-hungry on large filesystems.
     * In such cases, it may be better to use the stream or async iterator
     * walk implementation.
     */
    walk(): Promise<PathBase[]>;
    walk(opts: WalkOptionsWithFileTypesTrue | WalkOptionsWithFileTypesUnset): Promise<PathBase[]>;
    walk(opts: WalkOptionsWithFileTypesFalse): Promise<string[]>;
    walk(opts: WalkOptions): Promise<string[] | PathBase[]>;
    walk(entry: string | PathBase): Promise<PathBase[]>;
    walk(entry: string | PathBase, opts: WalkOptionsWithFileTypesTrue | WalkOptionsWithFileTypesUnset): Promise<PathBase[]>;
    walk(entry: string | PathBase, opts: WalkOptionsWithFileTypesFalse): Promise<string[]>;
    walk(entry: string | PathBase, opts: WalkOptions): Promise<PathBase[] | string[]>;
    /**
     * Synchronously walk the directory tree, returning an array of
     * all path strings or Path objects found.
     *
     * Note that this will be extremely memory-hungry on large filesystems.
     * In such cases, it may be better to use the stream or async iterator
     * walk implementation.
     */
    walkSync(): PathBase[];
    walkSync(opts: WalkOptionsWithFileTypesTrue | WalkOptionsWithFileTypesUnset): PathBase[];
    walkSync(opts: WalkOptionsWithFileTypesFalse): string[];
    walkSync(opts: WalkOptions): string[] | PathBase[];
    walkSync(entry: string | PathBase): PathBase[];
    walkSync(entry: string | PathBase, opts: WalkOptionsWithFileTypesUnset | WalkOptionsWithFileTypesTrue): PathBase[];
    walkSync(entry: string | PathBase, opts: WalkOptionsWithFileTypesFalse): string[];
    walkSync(entry: string | PathBase, opts: WalkOptions): PathBase[] | string[];
    /**
     * Support for `for await`
     *
     * Alias for {@link PathScurryBase.iterate}
     *
     * Note: As of Node 19, this is very slow, compared to other methods of
     * walking.  Consider using {@link PathScurryBase.stream} if memory overhead
     * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
     */
    [Symbol.asyncIterator](): AsyncGenerator<PathBase, void, void>;
    /**
     * Async generator form of {@link PathScurryBase.walk}
     *
     * Note: As of Node 19, this is very slow, compared to other methods of
     * walking, especially if most/all of the directory tree has been previously
     * walked.  Consider using {@link PathScurryBase.stream} if memory overhead
     * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
     */
    iterate(): AsyncGenerator<PathBase, void, void>;
    iterate(opts: WalkOptionsWithFileTypesTrue | WalkOptionsWithFileTypesUnset): AsyncGenerator<PathBase, void, void>;
    iterate(opts: WalkOptionsWithFileTypesFalse): AsyncGenerator<string, void, void>;
    iterate(opts: WalkOptions): AsyncGenerator<string | PathBase, void, void>;
    iterate(entry: string | PathBase): AsyncGenerator<PathBase, void, void>;
    iterate(entry: string | PathBase, opts: WalkOptionsWithFileTypesTrue | WalkOptionsWithFileTypesUnset): AsyncGenerator<PathBase, void, void>;
    iterate(entry: string | PathBase, opts: WalkOptionsWithFileTypesFalse): AsyncGenerator<string, void, void>;
    iterate(entry: string | PathBase, opts: WalkOptions): AsyncGenerator<PathBase | string, void, void>;
    /**
     * Iterating over a PathScurry performs a synchronous walk.
     *
     * Alias for {@link PathScurryBase.iterateSync}
     */
    [Symbol.iterator](): Generator<PathBase, void, void>;
    iterateSync(): Generator<PathBase, void, void>;
    iterateSync(opts: WalkOptionsWithFileTypesTrue | WalkOptionsWithFileTypesUnset): Generator<PathBase, void, void>;
    iterateSync(opts: WalkOptionsWithFileTypesFalse): Generator<string, void, void>;
    iterateSync(opts: WalkOptions): Generator<string | PathBase, void, void>;
    iterateSync(entry: string | PathBase): Generator<PathBase, void, void>;
    iterateSync(entry: string | PathBase, opts: WalkOptionsWithFileTypesTrue | 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 Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('./common');
var assert = require('assert');
var events = require('../');
var test = require('tape');

function expect(expected) {
  var actual = [];
  test.onFinish(function() {
    var sortedActual = actual.sort();
    var sortedExpected = expected.sort();
    assert.strictEqual(sortedActual.length, sortedExpected.length);
    for (var index = 0; index < sortedActual.length; index++) {
      var value = sortedActual[index];
      assert.strictEqual(value, sortedExpected[index]);
    }
  });
  function listener(name) {
    actual.push(name);
  }
  return common.mustCall(listener, expected.length);
}

{
  var ee = new events.EventEmitter();
  var noop = common.mustNotCall();
  ee.on('foo', noop);
  ee.on('bar', noop);
  ee.on('baz', noop);
  ee.on('baz', noop);
  var fooListeners = ee.listeners('foo');
  var barListeners = ee.listeners('bar');
  var bazListeners = ee.listeners('baz');
  ee.on('removeListener', expect(['bar', 'baz', 'baz']));
  ee.removeAllListeners('bar');
  ee.removeAllListeners('baz');

  var listeners = ee.listeners('foo');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 1);
  assert.strictEqual(listeners[0], noop);

  listeners = ee.listeners('bar');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 0);
  listeners = ee.listeners('baz');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 0);
  // After calling removeAllListeners(),
  // the old listeners array should stay unchanged.
  assert.strictEqual(fooListeners.length, 1);
  assert.strictEqual(fooListeners[0], noop);
  assert.strictEqual(barListeners.length, 1);
  assert.strictEqual(barListeners[0], noop);
  assert.strictEqual(bazListeners.length, 2);
  assert.strictEqual(bazListeners[0], noop);
  assert.strictEqual(bazListeners[1], noop);
  // After calling removeAllListeners(),
  // new listeners arrays is different from the old.
  assert.notStrictEqual(ee.listeners('bar'), barListeners);
  assert.notStrictEqual(ee.listeners('baz'), bazListeners);
}

{
  var ee = new events.EventEmitter();
  ee.on('foo', common.mustNotCall());
  ee.on('bar', common.mustNotCall());
  // Expect LIFO order
  ee.on('removeListener', expect(['foo', 'bar', 'removeListener']));
  ee.on('removeListener', expect(['foo', 'bar']));
  ee.removeAllListeners();

  var listeners = ee.listeners('foo');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 0);
  listeners = ee.listeners('bar');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 0);
}

{
  var ee = new events.EventEmitter();
  ee.on('removeListener', common.mustNotCall());
  // Check for regression where removeAllListeners() throws when
  // there exists a 'removeListener' listener, but there exists
  // no listeners for the provided event type.
  assert.doesNotThrow(function () { ee.removeAllListeners(ee, 'foo') });
}

{
  var ee = new events.EventEmitter();
  var expectLength = 2;
  ee.on('removeListener', function() {
    assert.strictEqual(expectLength--, this.listeners('baz').length);
  });
  ee.on('baz', common.mustNotCall());
  ee.on('baz', common.mustNotCall());
  ee.on('baz', common.mustNotCall());
  assert.strictEqual(ee.listeners('baz').length, expectLength + 1);
  ee.removeAllListeners('baz');
  assert.strictEqual(ee.listeners('baz').length, 0);
}

{
  var ee = new events.EventEmitter();
  assert.strictEqual(ee, ee.removeAllListeners());
}

{
  var ee = new events.EventEmitter();
  ee._events = undefined;
  assert.strictEqual(