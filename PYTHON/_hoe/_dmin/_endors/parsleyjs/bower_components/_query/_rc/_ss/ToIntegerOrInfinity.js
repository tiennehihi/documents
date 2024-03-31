// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('el', {
  dateiso:  "Η τιμή πρέπει να είναι μια έγκυρη ημερομηνία (YYYY-MM-DD).",
  minwords: "Το κείμενο είναι πολύ μικρό. Πρέπει να έχει %s ή και περισσότερες λέξεις.",
  maxwords: "Το κείμενο είναι πολύ μεγάλο. Πρέπει να έχει %s ή 