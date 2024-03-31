{
  "type": "object",
  "additionalProperties": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "groups": {
        "type": "array",
        "minitems": 1,
        "uniqueItems": true,
        "items": {
          "$ref": "definitions.json#/groupList"
        }
      },
      "status": {
        "enum": [
          "standard",
          "nonstandard",
          "experimental"
        ]
      }
    },
    "required": [
      "groups",
      "status"
    ]
  }
}
          ��~-�T�=�U8M�r����d�l�`+��\Iy�����]M�O5���L��[��P��iV�1&�H�Բ%=B��}U!��|��͐�C�<_����˟~pv�*�� �Bם��4�}ێ3df�ah�nn��g