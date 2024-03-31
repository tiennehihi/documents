// luhn extra validators
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.validators = window.ParsleyConfig.validators || {};

window.ParsleyConfig.validators.luhn = {
  fn: function (value) {
    value = value.replace(