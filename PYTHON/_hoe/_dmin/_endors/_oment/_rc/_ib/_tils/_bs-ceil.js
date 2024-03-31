

var AnimationEventInterface = assign({}, EventInterface, {
  animationName: 0,
  elapsedTime: 0,
  pseudoElement: 0
});

var SyntheticAnimationEvent = cr