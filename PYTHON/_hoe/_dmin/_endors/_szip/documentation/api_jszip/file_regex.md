�存在しないか、別のshadow DOMツリーの小要素です: ${data.needsReview}",
        "ariaCurrent": "ARIA属性値が無効であるため、\"aria-current=true\" として扱われます: ${data.needsReview}",
        "idrefs": "ARIA属性で指定されている要素のIDがページ上に存在するかどうか判定できません: ${data.needsReview}",
        "empty": "ARIA属性値が空のときは無視されます: ${data.needsReview}"
      }
    },
    "aria-valid-attr": {
      "pass": "ARIA属性名が有効です",
      "fail": {
        "singular": "無効なARIA属性名です: ${data.values}",
        "plural": "無効なARIA属性名です: ${data.values}"
      }
    },
    "deprecatedrole": {
      "pass": "推奨されていないARIAロールではありません",
      "fail": "非推奨のロールが使用されています: ${data}"
    },
    "fallbackrole": {
      "pass": "1つのロール値のみ使用されています",
      "fail": "古いブラウザーではフォールバックロールがサポートされていないため、ロール値は1つのみ使用します",
      "incomplete": "'presentation' と 'none' のロールは同義なので、どちらか一方のみを使用します。"
    },
    "has-global-aria-attribu