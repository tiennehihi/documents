},
    "implicit-label": {
      "pass": "フォームの要素に暗黙の（包含された）<label>が存在しています",
      "fail": "フォームの要素に暗黙の（包含された）<label>が存在していません",
      "incomplete": "フォームの要素に暗黙の（包含された）<label>が存在するか判定できません"
    },
    "label-content-name-mismatch": {
      "pass": "視認可能なテキストが要素のアクセシブルな名前の一部に含まれています",
      "fail": "要素内のテキストがアクセシブルな名前の一部に含まれていません"
    },
    "multiple-label": {
      "pass": "フォームフィールドにlabel要素は複数ありません",
      "incomplete": "複数のlabel要素は支援技術に広くサポートされていません。最初のラベルがすべての必要な情報を含んでいることを確認します。"
    },
    "title-only": {
      "pass": "フォーム要素はラベルにtitle属性だけを用いていません",
      "fail": "フォーム要素のラベルにtitle属性だけを用いています"
    },
    "landmark-is-unique": {
      "pass": "ランドマークは一意のロール又はロール／ラベル／タイトル (例: アクセシブルな名前) の組み合わせがなければなりません",
      "fail": "ランドマークを識別可能にするため、ランドマークには一意の aria-label、aria-labelledby、または title がなければなりません。"
    },
    "has-lang": {
      "pass": "<html>要素にlang属性が存在しています",
      "fail": {
        "noXHTML": "HTMLページで xml:lang 属性は有効ではありません、 lang 属性を使用してください。",
        "noLang": "<html> 要素に lang 属性が指定されていません"
      }
    },
    "valid-lang": {
      "pass": "lang属性の値が有効な言語の一覧に含まれています",
      "fail": "lang属性の値が有効な言語の一覧に含まれていません"
    },
    "xml-lang-mismatch": {
      "pass": "langおよびxml:lang属性に同じ基本言語を指定しています",
      "fail": "langおよびxml:lang属性に同じ基本言語を指定していません"
    },
    "dlitem": {
      "pass": "説明リスト項目に<dl>親要素が存在しています",
      "fail": "説明リスト項目に<dl>親要�