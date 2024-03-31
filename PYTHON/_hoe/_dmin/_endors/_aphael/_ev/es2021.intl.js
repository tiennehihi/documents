var postcss = require('postcss');

module.exports = function(decl) {
  var regex = /(\d{1,}) (\d{1,}) (calc\(.*\))/g;
  var matches = regex.exec(decl.value);
  if (decl.prop === 'flex' && matches) {
    var grow = postcss.decl({
      prop: 'flex-grow',
      value: matches[1],
      source: decl.source
    });
    var shrink = postcss.decl({
      prop: 'flex-shrink',
      value: matches[2],
      source: decl.source
    });
    var basis = postcss.