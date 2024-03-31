{
  "absolute-size": {
    "syntax": "xx-small | x-small | small | medium | large | x-large | xx-large | xxx-large"
  },
  "alpha-value": {
    "syntax": "<number> | <percentage>"
  },
  "angle-percentage": {
    "syntax": "<angle> | <percentage>"
  },
  "angular-color-hint": {
    "syntax": "<angle-percentage>"
  },
  "angular-color-stop": {
    "syntax": "<color> && <color-stop-angle>?"
  },
  "angular-color-stop-list": {
    "syntax": "[ <angular-color-stop> [, <angular-color-hint>]? ]# , <angular-color-stop>"
  },
  "animateable-feature": {
    "syntax": "scroll-position | contents | <custom-ident>"
  },
  "attachment": {
    "syntax": "scroll | fixed | local"
  },
  "attr()": {
    "syntax": "attr( <attr-name> <type-or-unit>? [, <attr-fallback> ]? )"
  },
  "attr-matcher": {
    "syntax": "[ '~' | '|' | '^' | '$' | '*' ]? '='"
  },
  "attr-modifier": {
    "syntax": "i | s"
  },
  "attribute-selector": {
    "syntax": "'[' <wq-name> ']' | '[' <wq-name> <attr-matcher> [ <string-token> | <ident-token> ] <attr-modifier>? ']'"
  },
  "auto-repeat": {
    "syntax": "repeat( [ auto-fill | auto-fit ] , [ <line-names>? <fixed-size> ]+ <line-names>? )"
  },
  "auto-track-list": {
    "syntax": "[ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>? <auto-repeat>\n[ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>?"
  },
  "baseline-position": {
    "syntax": "[ first | last ]? baseline"
  },
  "basic-shape": {
    "syntax": "<inset()> | <circle()> | <ellipse()> | <polygon()> | <path()>"
  },
  "bg-image": {
    "syntax": "none | <image>"
  },
  "bg-layer": {
    "syntax": "<bg-image> || <bg-position> [ / <bg-size> ]? || <repeat-style> || <attachment> || <box> || <box>"
  },
  "bg-position": {
    "syntax": "[ [ left | center | right | top | bottom | <length-percentage> ] | [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ] | [ center | [ left | right ] <length-percentage>? ] && [ center | [ top | bottom ] <length-percentage>? ] ]"
  },
  "bg-size": {
    "syntax": "[ <length-percentage> | auto ]{1,2} | cover | contain"
  },
  "blur()": {
    "syntax": "blur( <length> )"
  },
  "blend-mode": {
    "syntax": "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity"
  },
  "box": {
    "syntax": "border-box | padding-box | content-box"
  },
  "brightness()": {
    "syntax": "brightness( <number-percentage> )"
  },
  "calc()": {
    "syntax": "calc( <calc-sum> )"
  },
  "calc-sum": {
    "syntax": "<calc-product> [ [ '+' | '-' ] <calc-product> ]*"
  },
  "calc-product": {
    "syntax": "<calc-value> [ '*' <calc-value> | '/' <number> ]*"
  },
  "calc-value": {
    "syntax": "<number> | <dimension> | <percentage> | ( <calc-sum> )"
  },
  "cf-final-image": {
    "syntax": "<image> | <color>"
  },
  "cf-mixing-image": {
    "syntax": "<percentage>? && <image>"
  },
  "circle()": {
    "syntax": "circle( [ <shape-radius> ]? [ at <position> ]? )"
  },
  "clamp()": {
    "syntax": "clamp( <calc-sum>#{3} )"
  },
  "class-selector": {
    "syntax": "'.' <ident-token>"
  },
  "clip-source": {
    "syntax": "<url>"
  },
  "color": {
    "syntax": "<rgb()> | <rgba()> | <hsl()> | <hsla()> | <hex-color> | <named-color> | currentcolor | <deprecated-system-color>"
  },
  "color-stop": {
    "syntax": "<color-stop-length> | <color-stop-angle>"
  },
  "color-stop-angle": {
    "syntax": "<angle-percentage>{1,2}"
  },
  "color-stop-length": {
    "syntax": "<length-percentage>{1,2}"
  },
  "color-stop-list": {
    "syntax": "[ <linear-color-stop> [, <linear-color-hint>]? ]# , <linear-color-stop>"
  },
  "combinator": {
    "syntax": "'>' | '+' | '~' | [ '||' ]"
  },
  "common-lig-values": {
    "syntax": "[ common-ligatures | no-common-ligatures ]"
  },
  "compat-auto": {
    "syntax": "searchfield | textarea | push-button | slider-horizontal | checkbox | radio | square-button | menulist | listbox | meter | progress-bar | button"
  },
  "composite-style": {
    "syntax": "clear | copy | source-over | source-in | source-out | source-atop | destination-over | destination-in | destination-out | destination-atop | xor"
  },
  "compositing-operator": {
    "syntax": "add | subtract | intersect | exclude"
  },
  "compound-selector": {
    "syntax": "[ <type-selector>? <subclass-selector>* [ <pseudo-element-selector> <pseudo-class-selector>* ]* ]!"
  },
  "compound-selector-list": {
    "syntax": "<compound-selector>#"
  },
  "complex-selector": {
    "syntax": "<compound-selector> [ <combinator>? <compound-selector> ]*"
  },
  "complex-selector-list": {
    "syntax": "<complex-selector>#"
  },
  "conic-gradient()": {
    "syntax": "conic-gradient( [ from <angle> ]? [ at <position> ]?, <angular-color-stop-list> )"
  },
  "contextual-alt-values": {
    "syntax": "[ contextual | no-contextual ]"
  },
  "content-distribution": {
    "syntax": "space-between | space-around | space-evenly | stretch"
  },
  "content-list": {
    "syntax": "[ <string> | contents | <image> | <quote> | <target> | <leader()> ]+"
  },
  "content-position": {
    "syntax": "center | start | end | flex-start | flex-end"
  },
  "content-replacement": {
    "syntax": "<image>"
  },
  "contrast()": {
    "syntax": "contrast( [ <number-percentage> ] )"
  },
  "counter()": {
    "syntax": "counter( <custom-ident>, <counter-style>? )"
  },
  "counter-style": {
    "syntax": "<counter-style-name> | symbols()"
  },
  "counter-style-name": {
    "syntax": "<custom-ident>"
  },
  "counters()": {
    "syntax": "counters( <custom-ident>, <string>, <counter-style>? )"
  },
  "cross-fade()": {
    "syntax": "cross-fade( <cf-mixing-image> , <cf-final-image>? )"
  },
  "cubic-bezier-timing-function": {
    "syntax": "ease | ease-in | ease-out | ease-in-out | cubic-bezier(<number [0,1]>, <number>, <number [0,1]>, <number>)"
  },
  "deprecated-system-color": {
    "syntax": "ActiveBorder | ActiveCaption | AppWorkspace | Background | ButtonFace | ButtonHighlight | ButtonShadow | ButtonText | CaptionText | GrayText | Highlight | HighlightText | InactiveB