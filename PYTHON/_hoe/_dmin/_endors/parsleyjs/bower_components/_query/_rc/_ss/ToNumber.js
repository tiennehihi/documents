// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('ja', {
  defaultMessage: "無効な値です。",
  type: {
    email:        "正しいメールアドレスを入力してください。",
    url:          "正しいURLを入力してください。",
    number:       "正しい数字を入力してください。",
    integer:      "正しい数値を入力してください。",
    digits:       "正しい桁数で入力してください。",
    alphanum:     "正しい英数字を入力してください。"
  },
  notblank:       "この値を入力してください",
  required:       "この値は必須です。",
  pattern:        "この値は無効です。",
  min:            "%s 以上の値にしてください。",
  max:  