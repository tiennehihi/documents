jQuery Knob
=============

- canvas based ; no png or jpg sprites.
- touch, mouse and mousewheel, keyboard events implemented.
- downward compatible ; overloads an input element.

Example
-------

```html
<input type="text" value="75" class="dial">

<script>
    $(function() {
        $(".dial").knob();
    });
</script>
```

Options
-------

Options are provided as attributes 'data-option':

```html
<input type="text" class="dial" data-min="-50" data-max="50">
```

... or in the "knob()" call :

```javascript
$(".dial").knob({
    'min':-50,
    'max':50
});
```

The following options are supported :

Behaviors :
* min : min value | default=0.
* max : max value | default=100.
* step : step size | default=1.
* angleOffset : starting angle in degrees | default=0.
* angleArc : arc size in degrees | default=360.
* stopper : stop at min & max on keydown/mousewheel | default=true.
* readOnly : disable input and events | default=false.
* rotation : direction of progression | default=clockwise.

UI :
* cursor : display mode "cursor", cursor size could be changed passing a numeric value to the option, default width is used when passing boolean value "true" | default=gauge.
* thickness : gauge thickness.
* lineCap : gauge stroke endings. | default=butt, round=rounded line endings
* width : dial width.
* height : dial height.
* displayInput : default=true | false=hide input.
* displayPrevious : default=false | true=displays the previous value with transparency.
* fgColor : foreground color.
* inputColor : input value (number) color.
* font : font family.
* fontWeight : font weight.
* bgColor : background color.

Hooks
-------

``