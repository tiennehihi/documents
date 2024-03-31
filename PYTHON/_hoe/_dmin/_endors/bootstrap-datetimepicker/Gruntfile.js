ups": [
      "CSS Grid Layout"
    ],
    "initial": "auto",
    "appliesto": "gridItemsAndBoxesWithinGridContainer",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-row-end"
  },
  "grid-row-gap": {
    "syntax": "<length-percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "referToDimensionOfContentArea",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": "0",
    "appliesto": "gridContainers",
    "computed": "percentageAsSpecifiedOrAbsoluteLength",
    "order": "uniqueOrder",
    "status": "obsolete",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/row-gap"
  },
  "grid-row-start": {
    "syntax": "<grid-line>",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": "auto",
    "appliesto": "gridItemsAndBoxesWithinGridContainer",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-row-start"
  },
  "grid-template": {
    "syntax": "none | [ <'grid-template-rows'> / <'grid-template-columns'> ] | [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": [
      "grid-template-columns",
      "grid-template-rows"
    ],
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": [
      "grid-template-columns",
      "grid-template-rows",
      "grid-template-areas"
    ],
    "appliesto": "gridContainers",
    "computed": [
      "grid-template-columns",
      "grid-template-rows",
      "grid-template-areas"
    ],
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-template"
  },
  "grid-template-areas": {
    "syntax": "none | <string>+",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": "none",
    "appliesto": "gridContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-template-areas"
  },
  "grid-template-columns": {
    "syntax": "none | <track-list> | <auto-track-list>",
    "media": "visual",
    "inherited": false,
    "animationType": "simpleListOfLpcDifferenceLpc",
    "percentages": "referToDimensionOfContentArea",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": "none",
    "appliesto": "gridContainers",
    "computed": "asSpecifiedRelativeToAbsoluteLengths",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-template-columns"
  },
  "grid-template-rows": {
    "syntax": "none | <track-list> | <auto-track-list>",
    "media": "visual",
    "inherited": false,
    "animationType": "simpleListOfLpcDifferenceLpc",
    "percentages": "referToDimensionOfContentArea",
    "groups": [
      "CSS Grid Layout"
    ],
    "initial": "none",
    "appliesto": "gridContainers",
    "computed": "asSpecifiedRelativeToAbsoluteLengths",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/grid-template-rows"
  },
  "hanging-punctuation": {
    "syntax": "none | [ first || [ force-end | allow-end ] || last ]",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "none",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/hanging-punctuation"
  },
  "height": {
    "syntax": "[ <length> | <percentage> ] && [ border-box | content-box ]? | available | min-content | max-content | fit-content | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "regardingHeightOfGeneratedBoxContainingBlockPercentagesRelativeToContainingBlock",
    "groups": [
      "CSS Box Model"
    ],
    "initial": "auto",
    "appliesto": "allElementsButNonReplacedAndTableColumns",
    "computed": "percentageAutoOrAbsoluteLength",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/height"
  },
  "hyphens": {
    "syntax": "none | manual | auto",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "manual",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/hyphens"
  },
  "image-orientation": {
    "syntax": "from-image | <angle> | [ <angle>? flip ]",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Images"
    ],
    "initial": "0deg",
    "appliesto": "allElements",
    "computed": "angleRoundedToNextQuarter",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/image-orientation"
  },
  "image-rendering": {
    "syntax": "auto | crisp-edges | pixelated",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Images"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/image-rendering"
  },
  "image-resolution": {
    "syntax": "[ from-image || <resolution> ] && snap?",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Images"
    ],
    "initial": "1dppx",
    "