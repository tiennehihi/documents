TODO Decide on how to implement this hook for server rendering.
// If a mutation occurs during render, consider triggering a Suspense boundary
// and falling back to client rendering.

function useMutableSource(source, getSnapshot, subscribe) {
  resolveCurrentlyRenderingComponent();
  return getSnapshot(source._source);
}

function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  if (getServerSnapshot === undefined) {
    throw new Error('Missing getServerSnapshot, which is required for ' + 'server-rendered content. Will revert to client rendering.');
  }

  return getServerSnapshot();
}

function useDeferredValue(value) {
  resolveCurrentlyRenderingComponent();
  return value;
}

function unsupportedStartTransition() {
  throw new Error('startTransition cannot be called during server rendering.');
}

function useTransition() {
  resolveCurrentlyRenderingComponent();
  return [false, unsupportedStartTransition];
}

function useId() {
  var task = currentlyRenderingTask;
  var treeId = getTreeId(task.treeContext);
  var responseState = currentResponseState;

  if (responseState === null) {
    throw new Error('Invalid hook call. Hooks can only be called inside of the body of a function component.');
  }

  var localId = localIdCounter++;
  return makeId(responseState, treeId, localId);
}

function noop() {}

var Dispatcher = {
  readContext: readContext$1,
  useContext: useContext,
  useMemo: useMemo,
  useReducer: useReducer,
  useRef: useRef,
  useState: useState,
  useInsertionEffect: noop,
  useLayoutEffect: useLayoutEffect,
  useCallback: useCallback,
  // useImperativeHandle is not run in the server environment
  useImperativeHandle: noop,
  // Effects are not run in the server environment.
  useEffect: noop,
  // Debugging effect
  useDebugValue: noop,
  useDeferredValue: useDeferredValue,
  useTransition: useTransition,
  useId: useId,
  // Subscriptio