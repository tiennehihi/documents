// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('ro', {
  defaultMessage: "Acest câmp nu este completat corect.",
  type: {
    email:        "Trebuie să scrii un email valid.",
    url:          "Trebuie să scrii un link valid",
    number:       "Trebuie să scrii un număr 