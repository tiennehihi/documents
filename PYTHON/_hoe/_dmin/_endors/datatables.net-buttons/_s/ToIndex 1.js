// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('no', {
  defaultMessage: "Verdien er ugyldig.",
  type: {
    email:        "Verdien må være en gyldig e-postadresse.",
    url:          "Verdien må være en gyldig url.",
    number:       "Verdien må være et gyldig tall.",
    integer:      "Verdien må være et gyldig heltall.",
    digits:       "Verdien må være et siffer.",
    alphanum:     "Verdien må være alfanumerisk"
  },
  notblank:       "Verdien kan ikke være blank.",
  required:       "Verdien er obligatorisk.",
  pattern:        "Verdien er ugyldig.",
  min:            "Verdien må være større eller lik %s.",
 