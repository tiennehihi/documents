// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('lt', {
  defaultMessage: "Šis įrašas neteisingas.",
  type: {
    email:        "Šis įrašas nėra teisingas el. paštas.",
    url:          "Šis įrašas nėra teisingas url.",
    number:       "Šis įrašas nėra skaičius.",
    integer:      "Šis įrašas nėra sveikasis skaičius.",
    digits:       "Šis įrašas turi būti skaičius.",
    alphanum:     "Šis įrašas turi būti iš skaičių ir raidžių."
  },
  notblank:       "Š