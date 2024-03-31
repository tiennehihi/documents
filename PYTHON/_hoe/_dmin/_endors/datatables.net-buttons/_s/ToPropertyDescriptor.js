import $ from 'jquery';
import ConstraintFactory from './factory/constraint';
import ParsleyUI from './ui';
import ParsleyUtils from './utils';

var ParsleyField = function (field, domOptions, options, parsleyFormInstance) {
  this.__class__ = 'ParsleyField';

  this.$element = $(field);

  // Set parent if we have one
  if ('undefined' !== typeof parsleyFormInstance) {
    this.parent = parsleyFormInstance;
  }

  this.options = options;
  this.domOptions = domOptions;

  // Initialize some properties
  this.constraints = [];
  this.constraintsByName = {};
  this.validationResult = true;

  // Bind constraints
  this._bindConstraints();
};

var statusMapping = {pending: null, resolved: true, rejected: false};

ParsleyField.prototype = {
  // # Public API
  // Validate field and trigger some events for mainly `ParsleyUI`
  // @returns `true`, an array of the validators that failed, or
  // `null` if validation is not finished. Prefer using whenValidate
  validate: function (options) {
    if (arguments.length >= 1 && !$.isPlainObject(options)) {
      ParsleyUtils.warnOnce('Calling validate on a parsley field without passing arguments as an object is deprecated.');
      options = {options};
    }
    var promise = this.whenValidate(options);
    if (!promise)  // If excluded with `group` option
      return true;
    switch (promise.state()) {
      case 'pending': return null;
      case 'resolved': return true;
      case 'rejected': return this.validationResul