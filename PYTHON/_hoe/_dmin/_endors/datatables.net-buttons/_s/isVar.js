// Mixins
// --------------------------

.fa-icon() {
  display: inline-block;
  font: normal normal normal @fa-font-size-base/@fa-line-height-base FontAwesome; // shortening font declaration
  font-size: inherit; // can't have font-size inherit on line above, so need to override
  text-rendering: auto; // optimizelegibility throws things off #1094
  -webkit-font-smoo