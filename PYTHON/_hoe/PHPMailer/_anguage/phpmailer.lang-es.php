"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const schema = [{
  enum: ['always', 'never'],
  type: 'string'
}];

const create = context => {
  return {
    ObjectTypeAnnotation(node) {
      const {
        properties
      } = node;

      for (const property of properties) {
        const {
          type
        } = property;

        if (type === 'ObjectTypeSpreadProperty') {
          const {
            argument: {
              type: argumentType,
              id: argumentId
            }
          } = property;

          if (argumentType !== 'GenericTypeAnnotation' || argumentId.name !== '$Exact') {
            context.report({
              message: 'Use $Exact to make type spreading safe.',
              node
            });
          }
        }
      }
    }

  };
};

var _default = {
  create,
  schema
};
exports.default = _default;
module.exports = exports.default;                                                                     ��߁�X9���^w���
1�+�I��a7._O�	k�5�$��h��f:�^7�P*Ґmdc;?��d���qpQ��h���x���ț������U����Ǔ/eԾ�G��u�惤�0`��Ƞ�Œ�<X��7�I���W�CH5�eQ]��4;�Mf��h���j�Ő�c��V#�51���A�a����y���۔�6ԣ��� ���^
1�rt�f����{ ���փ�CB������}z�����ֽ�b}�}{=����Ա�FnZ�n�l��o��d�����>5�����v�h{N �v`Z�M.�oR��!v�O~*w�m���g��D�#¤@�P��{}z6Q,�\�U�^w�V�o�X��sg����ڛ�t&8Y?���h�����I� �%�vZ);�"�Gs���7����{�a�\H��u�g�^Y#H���:�n���R���d��z�O�L�D�8ϡ�#4P��t�(�n ����F�荻�[��B���hrtƯ�_U�.D>6r�E��=_���a��vs\�dT¢/��q��N�4ҍ��xR��p�a�	tCX8��:`���!����09�ux�@3��ぷ�ɗ�*$p�ʶHc�AM�� ��u�;��L�}�ƙ�i,)�yP<A2Y��Tdƽ�}�[o�� 4X�F�[�PvS!�u0�{��cg