n top. Keep
      // restarting until no more updates are scheduled.
      didScheduleRenderPhaseUpdate = false;
      localIdCounter = 0;
      numberOfReRenders += 1; // Start over from the beginning of the list

      workInProgressHook = null;
      children = Component(props, refOrContext);
    }

    resetHooksState();
    return children;
  }
  function checkDidRenderIdHook() {
    // This should be called immediately after every finishHooks call.
    // Conceptually, it's part of the return value of finishHooks; it's only a
    // separate function to avoid using an array tuple.
    var didRenderIdHook = localIdCounter !== 0;
    return didRenderIdHook;
  } // Reset the internal hooks state if an error occurs while rendering a component

  function resetHooksState() {
    {
      isInHookUserCodeInDev = false;
    }

    currentlyRenderingComponent = null;
    currentlyRenderingTask = null;
    didScheduleRenderPhaseUpdate = false;
    firstWorkInProgressHook = null;
    numberOfReRenders = 0;
    renderPhaseUpdates = null;
    workInProgressHook = null;
  }

  function readContext$1(context) {
    {
      if (isInHookUserCodeInDev) {
        error('Context can only be read while React is rendering. ' + 'In classes, you can read it in the render method or getDerivedStateFromProps. ' + 'In function components, you can read it directly in the function body, but not ' + 'inside Hooks like useReducer() or useMemo().');
      }
    }

    return readContext(context);
  }

  function useContext(context) {
    {
      currentHookNameInDev = 'useContext';
    }

    resolveCurrentlyRenderingCom