import $ from 'jquery';
import ParsleyUtils from './utils';
import ParsleyDefaults from './defaults';
import ParsleyValidator from './validator';

var ParsleyValidatorRegistry = function (validators, catalog) {
  this.__class__ = 'ParsleyValidatorRegistry';

  // Default Parsley locale is en
  this.locale = 'en';

  this.init(validators || {}, catalog || {});
};

var typeRegexes =  {
  email: /^((