//
// Scaffolding
// --------------------------------------------------


// Reset the box-sizing

*,
*:before,
*:after {
  .box-sizing(border-box);
}


// Body reset

html {
  font-size: 62.5%;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

body {
  font-family: @font-family-base;
  font-size: @font-size-base;
  line-height: @line-height-base;
  color: @text-color;
  background-color: @body-bg;
}

// Reset fonts for relevant elements
input,
button,
select,
textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}


// Links

a {
  color: @link-color;
  text-decoration: none;

  &:hover,
  &:focus {
 