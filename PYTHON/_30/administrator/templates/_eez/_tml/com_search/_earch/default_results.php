/*eslint no-var:0, prefer-arrow-callback: 0, object-shorthand: 0 */
'use strict';


var Punycode = require('punycode');


var internals = {};


//
// Read rules from file.
//
internals.rules = require('./data/rules.json').map(function (rule) {

  return {
    rule: rule,
    suffix: rule.replace(/^(\*\.|\!)/, ''),
    punySuffix: -1,
    wildcard: rule.charAt(0) === '*',
    exception: rule.charAt(0) === '!'
  };
});


//
// Check is given string ends with `suffix`.
//
internals.endsWith = function (str, suffix) {

  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};


//
// Find rule for a given domain.
//
internals.findRule = function (domain) {

  var punyDomain = Punycode.toASCII(domain);
  return internals.rules.reduce(function (memo, rule) {

    if (rule.punySuffix === -1){
      rule.punySuffix = Punycode.toASCII(rule.suffix);
    }
    if (!internals.endsWith(punyDomain, '.' + rule.punySuffix) && punyDomain !== rule.punySuffix) {
      return memo;
    }
    // This has been commented out as it never seems to run. This is because
    // sub tlds always appear after their parents and we never find a shorter
    // match.
    //if (memo) {
    //  var memoSuffix = Punycode.toASCII(memo.suffix);
    //  if (memoSuffix.length >= punySuffix.length) {
    //    return memo;
    //  }
    //}
    return rule;
  }, null);
};


//
// Error codes and messages.
//
exports.errorCodes = {
  DOMAIN_TOO_SHORT: 'Domain name too short.',
  DOMAIN_TOO_LONG: 'Domain name too long. It should be no more than 255 chars.',
  LABEL_STARTS_WITH_DASH: 'Domain name label can not start with a dash.',
  LABEL_ENDS_WITH_DASH: 'Domain name label can not end with a dash.',
  LABEL_TOO_LONG: 'Domain name 