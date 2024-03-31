import $ from 'jquery';

var ParsleyMultiple = function () {
  this.__class__ = 'ParsleyFieldMultiple';
};

ParsleyMultiple.prototype = {
  // Add new `$element` sibling for multiple field
  addElement: function ($element) {
    this.$elements.push($element);

    return this;
  },

  // See `ParsleyField.refreshConstraints()`
  refreshConstraints: function () {
    var fieldConstraints;

    this.constraints = [];

    // Select multiple special treatment
    if (this.$element.is('select')) {
      this.actualizeOptions()._bindConstraints();

      return this;
    }

    // Gather all constraints for each input in the multiple group
    for (var i = 0; i < this.$elements.length; i++) {

      // Check if element have not been dynamically removed since last binding
      if (!$('html').has(this.$elements[i]).length) {
        this.$elements.splice(i, 1);
        continue;
      }

      fieldConstraints = this.$elements[i].data('ParsleyFieldMultiple').refreshConstraints().constraints;

      for (var j = 0; j < fieldConstraints.length; j++)
        this.addConstraint(fieldConstraints[j].name, fieldConstraints[j].requirements, fieldConstraints[j].priority, fieldConstraints[j].isDomConstraint);
    }

    return this;
  },

  // See `ParsleyField.getValue()`
  getValue: function () {
    // Value could be overriden in DOM
    if ('function' === typeof this.options.value)
      return this.options.value(this);
    else if ('undefined' !== typeof this.options.value)
