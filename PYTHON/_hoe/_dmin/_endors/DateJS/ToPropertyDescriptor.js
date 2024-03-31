import $ from 'jquery';
import ParsleyUtils from './utils';
import ParsleyAbstract from './abstract';
import ParsleyForm from './form';
import ParsleyField from './field';
import ParsleyMultiple from './multiple';

var ParsleyFactory = function (element, options, parsleyFormInstance) {
  this.$element = $(element);

  // If the element has already been bound, returns its saved Parsley instance
  var savedparsleyFormInstance = this.$element.data('Parsley');
  if (savedparsleyFormInstance) {

    // If the saved instance has been bound without a ParsleyForm parent and there is one given in this call, add it
    if ('undefined' !== typeof parsleyFormInstance && savedparsleyFormInstance.parent === window.Parsley) {
      savedparsleyFormInstance.parent = parsleyFormInstance;
      savedparsleyFormInstance._resetOptions(savedparsleyFormInstance.options);
    }

    return savedparsleyFormInstance;
  }

  // Parsley must be instantiated with a DOM element or jQuery $element
  if (!this.$element.length)
    throw new Error('You must bind Parsley on an existing element.');

  if ('undefined' !== typeof parsleyFormInstance && 'ParsleyForm' !== parsleyFormInstance.__class__)
    throw new Error('Parent instance must be a ParsleyForm instance');

  this.parent = parsleyFormInstance || window.Parsley;
  return this.init(options);
};

ParsleyFactory.prototype = {
  init: function (options) {
    this.__class__ = 'Parsley';
    this.__version__ = '@@version';
    this.__id__ = 