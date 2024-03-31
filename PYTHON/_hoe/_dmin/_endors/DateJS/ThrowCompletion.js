!(function ($) {

  var UWidget = function (element, options) {
    this.init($(element), options);
  };

  UWidget.prototype = {
    options: {
      url: null,
      handler: null,
      template: null,
      sort: {
        enabled: fals