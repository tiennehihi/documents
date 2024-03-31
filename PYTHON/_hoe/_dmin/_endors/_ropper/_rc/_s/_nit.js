 [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "asSpecifiedRelativeToAbsoluteLengths",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transform"
  },
  "transform-box": {
    "syntax": "border-box | fill-box | view-box",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "border-box ",
    "appliesto": "transformableElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transform-box"
  },
  "transform-origin": {
    "syntax": "[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?",
    "media": "visual",
    "inherited": false,
    "animationType": "simpleListOfLpc",
    "percentages": "referToSizeOfBoundingBox",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "50% 50% 0",
    "appliesto": "transformableElements",
    "computed": "forLengthAbsoluteValueOtherwisePercentage",
    "order": "oneOrTwoValuesLengthAbsoluteKeywordsPercentages",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transform-origin"
  },
  "transform-style": {
    "syntax": "flat | preserve-3d",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "flat",
    "appliesto": "transformableElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transform-style"
  },
  "transition": {
    "syntax": "<single-transition>#",
    "media": "interactive",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": [
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function"
    ],
    "appliesto": "allElementsAndPseudos",
    "computed": [
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function"
    ],
    "order": "orderOfAppearance",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition"
  },
  "transition-delay": {
    "syntax": "<time>#",
    "media": "interactive",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": "0s",
    "appliesto": "allElementsAndPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition-delay"
  },
  "transition-duration": {
    "syntax": "<time>#",
    "media": "interactive",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": "0s",
    "appliesto": "allElementsAndPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition-duration"
  },
  "transition-property": {
    "syntax": "none | <single-transition-property>#",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": "all",
    "appliesto": "allElementsAndPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition-property"
  },
  "transition-timing-function": {
    "syntax": "<timing-function>#",
    "media": "interactive",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Transitions"
    ],
    "initial": "ease",
    "appliesto": "allElementsAndPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/transition-timing-function"
  },
  "translate": {
    "syntax": "none | <length-percentage> [ <length-percentage> <length>? ]?",
    "media": "visual",
    "inherited": false,
    "animationType": "transform",
    "percentages": "referToSizeOfBoundingBox",
    "groups": [
      "CSS Transforms"
    ],
    "initial": "none",
    "appliesto": "transformableElements",
    "computed": "asSpecifiedRelativeToAbsoluteLengths",
    "order": "perGrammar",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/translate"
  },
  "unicode-bidi": {
    "syntax": "normal | embed | isolate | bidi-override | 