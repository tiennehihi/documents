import $ from 'jquery';
import ParsleyAbstract from './abstract';
import ParsleyUtils from './utils';

var ParsleyForm = function (element, domOptions, options) {
  this.__class__ = 'ParsleyForm';

  this.$element = $(element);
  this.domOptions = domOptions;
  this.options = options;
  this.parent = window.Parsley;

  this.fields = [];
  this.validationResult = null;
};

var statusMapping = {pending: null, resolved: true, rejected: false};

ParsleyForm.prototype = {
  onSubmitValidate: function (event) {
    // This is a Parsley generated submit event, do not validate, do not prevent, simply exit and keep normal behavior
    if (true === event.parsley)
      return;

    // If we didn't come here through a submit button, use the first one in the form
    var $submitSource = this._$submitSource || this.$element.find('input[type="submit"], button[type="submit"]').first();
    this._$submitSource = null;
    this.$element.find('.parsley-synthetic-submit-button').prop('disabled', true);
    if ($submitSource.is('[formnovalidate]'))
      return;

    var promise = this.whenValidate({event});

    if ('resolved' === promise.state() && false !== this._trigger('submit')) {
      // All good, let event go through. We make this distinction because browsers
      // differ in their handling of `submit` being called from inside a submit event [#1047]
    } else {
      // Rejected or pending: cancel this submit
      event.stopImmediatePropagation();
      event.preventDefa