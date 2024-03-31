ll) {
      yieldedValues = [value];
    } else {
      yieldedValues.push(value);
    }
  }

  function unstable_advanceTime(ms) {
    // eslint-disable-next-line react-internal/no-production-logging
    if (console.log.name === 'disabledLog' || disableYieldValue) {
      // If console.log has been patched, we assume we're in render
      // replaying and we ignore any time advancing in the second pass.
      return;
    }

    currentMockTime += ms;

    if (scheduledTimeout !== null && timeoutTime <= currentMockTime) {
      scheduledTimeout(currentMockTime);
      timeoutTime = -1;
      scheduledTimeout = null;
    }
  }

  function requestPaint() {
    needsPaint = true;
  }
  var unstable_Profiling =  null;

  exports.reset = reset;
  exports.unstable_IdlePriority = IdlePriority;
  exports.unstable_ImmediatePriority = ImmediatePriority;
  exports.unstable_LowPriority = LowPriority;
  exports.unstable_NormalPriority = NormalPriority;
  exports.unstable_Profiling = unstable_Profiling;
  exports.unstable_UserBlockingPriority = UserBlockingPriority;
  exports.unstable_advanceTime = unstable_advanceT