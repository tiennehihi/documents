'use strict';

const { visit } = require('../xast.js');

/**
 * Plugins engine.
 *
 * @module plugins
 *
 * @param {Object} ast input ast
 * @param {Object} info extra information
 * @param {Array} plugins plugins object from config
 * @return {Object} output ast
 */
const invokePlugins = (ast, info, plugins, overrides, globalOverrides) => {
  for (const plugin of plugins) {
    const override = overrides == null ? null : overrides[plugin.name];
    if (override === false) {
      continue;
    }
    const params = { ...plugin.params, ...globalOverrides, ...override };

    if (plugin.type === 'perItem') {
      ast = perItem(ast, info, plugin, params);
    }
    if (plugin.type === 'perItemReverse') {
      ast = perItem(ast, info, plugin, params, true);
    }
    if (plugin.type === 'full') {
      if (plugin.active) {
        ast = plugin.fn(ast, params, info);
      }
    }
    if (plugin.type === 'visitor') {
      if (plugin.active) {
        const visitor = plugin.fn(ast, params, info);
        if (visitor != null) {
          visit(ast, visitor);
        }
      }
    }
  }
  return ast;
};
exports.invokePlugins = invokePlugins;

/**
 * Direct or reverse per-item loop.
 *
 * @param {Object} data input data
 * @param {Object} info extra information
 * @param {Array} plugins plugins list to process
 * @param {boolean} [reverse] reverse pass?
 * @return {Object} output data
 */
function perItem(data, info, plugin, params, reverse) {
  function monkeys(items) {
    items.children = items.children.filter(function (item) {
      // reverse pass
      if (reverse && item.children) {
        monkeys(item);
      }
      // main filter
      let kept = true;
      if (plugin.active) {
        kept = plugin.fn(item, params, info) !== false;
      }
      // direct pass
      if (!reverse && item.children) {
        monkeys(item);
      }
      return kept;
    });
    return items;
  }
  return monkeys(data);
}

const createPreset = ({ name, plugins }) => {
  return {
    name,
    type: 'full',
    fn: (ast, params, info) => {
      const { floatPrecision, overrides } = params;
      const globalOverrides = {};
      if (floatPrecision != null) {
        globalOverrides.floatPrecision = floatPrecision;
      }
      if (overrides) {
        for (const [pluginName, override] of Object.entries(overrides)) {
          if (override === true) {
            console.warn(
              `You are trying to enable ${pluginName} which is not part of preset.\n` +
                `Try to put it before or after preset, for example\n\n` +
                `plugins: [\n` +
                `  {\n` +
                `    name: 'preset-default',\n` +
                `  },\n` +
                `  'cleanupListOfValues'\n` +
                `]\n`
            );
          }
        }
      }
      return invokePlugins(ast, info, plugins, overrides, globalOverrides);
    },
  };
};
exports.createPreset = createPreset;
                                                                                                                              rD'(�l��I�*��*�m����}O�� P���u`ӟ�in������{s�8���dh�K��da�{���G��Do�Ǟ��>�u 2��+ �dt^!�R(Ɏ��+�6�}!}���L1m��]^����ӹ��^�?��<�W��a�E˲�Db�" ��F.�/��Q1�0Ĥ+"�QL+��b~���.��%U��@�T�t�9�ڰA�C{b;h�x=���i���\9S��!7�7K��r�{��d@ڻ�����d���&[
�=��?=ϓ�Bq�cL��S��M�ʦ:�㩍C������YL�4��↖]^���N��UA���n��z���ŗ�[�>�<���K�Z���x��6ڱve�Yh������<�[7p� `�����E<Ipb��t��� �Ԓ7�{�γ0M��{����:T)Vج��a�?�E�*�Fd�v�֤'�פ���nf�)P"�F��' B�장���E��3Rck���/�:'�Y�>o�9�-'�pZ���8e'�:�(7YՍ3�����7�����͕� L$o��������Y�}����/�tq��� YpȻi�:��/��4NjE��R	�Xz����)��FN!������X����m-���y�9����m�f�K��)��q�6f�mvO+���i�>\P��	%���ݜ������?�,n��9��TW �z�3�wٻ�B�<��\��������0��E ��t�t4��z$j\_b�'��iK8���Т��8����`ǻ�"__��[�-��9$y���*�ǆ�ᑆ}��a�V�)u��\�2zr9��H3��ؾ��g���N�v�����X@�F}uyo��2�C8|N���4eu��u&7�եQU�\�L�}�b&�y*;f����Ӽ�52��5T�7��)Q��@�E{+������~��]>ch9�Q^ ����.A�6����6�̖��	�T����wJJ�o/�!��+,�K�E���u㩡�%#�~#�z���X�Ǚ��/��������Dx`��o���� ?�Ңv
� /�/%֫�W6O��m��I�2�xo� ��K�i[A��~�Y����@�r\�F��J���'�q۶V���3Tn=4��m!��_��Cx�R�[97�$���4m�,h����k/�:�O9ā!5�0
:�I�N�k�<�RdO�z��\Mh�g����_by@�g��V����|Ӡ�p�Teݍ��Ʃg�%��~2léM*�I[��89q����>"�_Hƴ����H�����$�"(�[$�O�D
�\�MQ��T���s�0RZo�_F�PǲT�arK"�����:�k���Н�S�i,0�H?�犮�h��@5�<�aS�Sw�kW��(JQ3>=h"nZ��V�^��=j@��h\�:�"J��z)ӳq'����U��+Є@�S]�=�#����i�)dWPW0�U�	̞�������H���,֍��j=L�;RX�mv����z��5�0�����H�:	�|�&�td7���ϖ�淾�˶�)���q�{>��ڤK++�X���X `e]̖=)�d�;L�'������=+�ޘ��+h&eM�֓ ��h����K"��y��A �Pd��T�Xd/��Z��=�G{17�����ԁw���/�n�N�;�P8H�?�4�9�  �=�zH���[Ԋ|E,�̂-�D�X�G&��^F,�#� sL����(�(:C����Q����N���/�c��/�M���O�H�PV�W�\�^�B|�`Ońdq�=K�Y��o�#F����U�ˬ�Q������d�ۈ�	���J��
��ΰ�(
֖u!Q�#�@Z:���/�/K��M��Gh|:�y�}��!�Ht�<ZEQ�N�R}��eJi,B�3U?���V��:����ѿ�F� �O�4�ī�UlX/���F�+���(���S���۱v��}y	���!����p"���)a+?N$q��<e����lj��ꞝ�i���M�%���qzl�(wU9J����A4��CO(+籢�:?�� ���Hm h�r�#����JF��oA�4���pm�Jоam�+�n��C��+y�G�>W��\VPm��]�_um�k����.Z�d Y�bzK���Ea�b��<G~�T���Xή�n��H�������W�"/��)~~Q��'�|�ck\�����{B>��9q5n�g��-��.�jY�(J�6u��S�/I��j��G���~b�G���no��/�'h�r��(
�T����(�ͿDZ���ǋ'��&�vc�_��=���ٿ��*8�����ΨܴjE �'���y���Ƿ��$�[�}yu�q?Q�l��S(U�)�5ng�j����v�p�O_^VQ
ǫ*<���x#9�[�eI#�EV����wn�(o���t��h2P�Xn��9B!%�Rx�?L����D� �jk�#G(!.����I��lmcz���0[A��2�/M��e��A�*�=:�Ib���ˡ��Ԟ�?g�Ա�5M�:W��iƽ�F�ƻ^rz���ƭ(�g�4]�w���d���b�k=�9m7�|D������*��ͯ����=^�~�7,�$z����^_�^J�Ƅ�+~t}�]@�f-���e@��0/�SFgH�� |P�G��de�"p-��V����C+�a�C���X,���i%�a~]J�zPo�Ԫ� 00�J�+9��y���x��RUojw��V�0ބ�}�f����A
 ��h|�d�������Π��ȿ5�:���oIq��wc1�	.�8|���<W
c�߂�� n���i���&� ;۱�ƣ��R��� �F�h�22��rRݏ��4�^TWt�~m�}�/��U�&�U=5&E-�͍(����t��.���_,
iu����a���bKo�B�'������3��_%c�I�(Q���d��<��"R���di�(O���h�U�xb�e!A�TkXe��(VhlLBz���i!��.2(}�혳AI �Q��_x@�p���G�d7|�m!��Պ����43!
�p�X���a�\�-�w&���:��_i��k��3�Af��0 TX��$���{3O��b����)��5��_^��`jR����g�)���f̓9���^��K�����[T0ez�rK7w�b�
��<˝�p���c�)�Y�S��ܕ=�lv�#�}��1��ֳa�:�{��l�_����G��g��X��@$n@O���B#W}R]]�� ��7�n