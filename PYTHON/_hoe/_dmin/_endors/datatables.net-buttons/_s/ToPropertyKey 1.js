import $ from 'jquery';
import ParsleyUtils from '../utils';
import ParsleyValidator from '../validator';


var ConstraintFactory = function (parsleyField, name, requirements, priority, isDomConstraint) {
  if (!/ParsleyField/.test(parsleyField.__class__))
    throw new Error('ParsleyField or ParsleyFieldMultiple instance expected');

  var validatorSpec = window.Parsley._validatorRegistry.validat