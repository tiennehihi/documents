.responsive-invisibility() {
    &,
  tr&,
  th&,
  td& { display: none !important; }
}


// Grid System
// -----------

// Centered container element
.container-fixed() {
  margin-right: auto;
  margin-left: auto;
  padding-left:  (@grid-gutter-width / 2);
  padding-right: (@grid-gutter-width / 2);
  .cle