const Ajv = require("ajv")
const ajv = new Ajv({allErrors: true})

const schema = {
  type: "object",
  properties: {
    foo: {type: "string"},
    bar: {type: "number", maximum: 3},
  },
  required: ["foo", "bar"],
  additionalProperties: false,
}

const validate = ajv.compile(schema)

test({foo: "abc", bar: 2})
test({foo: 2, bar: 4})

function test(data) {
  const valid = validate(data)
  if (valid) console.log("Valid!")
  else console.log("Invalid: " + ajv.errorsText(validate.errors))
}
                (4�^cP����4a���H�;�����&�|J�����Q�ͺ�$�nǶ
zp�a)�&`���*��`�q�U��u�A`����(7
.�%��Ő@����x�j̼J\�j��UXh�5ϊIz�DNPͫ![��ڲ�L�k�S��G�9vX��ױ��o��OYE�j��+�WB��o��H.�8�s��~_-��Ҁ�~��%��_�aq��A�Y*�Uè,/C\8T֢�.@QDV �"�?"�-rY�Gz�ɽ�6���{j�>Y�����4��}��F~�i`ħ�Mݘ��7���-R�쁭�ؔ���%�ѺG��� P�@�=Q��Y����=�b��M�]ad2�|�v���V�g��.ܭM�q$