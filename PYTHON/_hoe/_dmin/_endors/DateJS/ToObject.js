// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('pl', {
  defaultMessage: "Wartość wygląda na nieprawidłową",
  type: {
    email:        "Wpisz poprawny adres e-mail.",
    url:          "Wpisz poprawny adres URL.",
    number:       "Wpisz poprawną liczbę.",
    integer: