'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = treeProcessor;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function treeProcessor(options) {
  const {nodeComplete, nodeStart, queueRunnerFactory, runnableIds, tree} =
    options;

  function isEnabled(node, parentEnabled) {
    return parentEnabled || runnableIds.indexOf(node.id) !== -1;
  }

  function getNodeHandler(node, parentEnabled) {
    const enabled = isEnabled(node, parentEnabled);
    return node.children
      ? getNodeWithChildrenHandler(node, enabled)
      : getNodeWithoutChildrenHandler(node, enabled);
  }

  function getNodeWithoutChildrenHandler(node, enabled) {
    return function fn(done = () => {}) {
      node.execute(done, enabled);
    };
  }

  function getNodeWithChildrenHandler(node, enabled) {
    return async function fn(done = () => {}) {
      nodeStart(node);
      await queueRunnerFactory({
        onException: error => node.onException(error),
        queueableFns: wrapChildren(node, enabled),
        userContext: node.sharedUserContext()
      });
      nodeComplete(node);
      done();
    };
  }

  function hasNoEnabledTest(node) {
    var _node$children$every, _node$children;

    return (
      node.disabled ||
      node.markedPending ||
      ((_node$children$every =
        (_node$children = node.children) === null || _node$children === void 0
          ? void 0
          : _node$children.every(hasNoEnabledTest)) !== null &&
      _node$children$every !== void 0
        ? _node$children$every
        : false)
    );
  }

  function wrapChildren(node, enabled) {
    if (!node.children) {
      throw new Error('`node.children` is not defined.');
    }

    const children = node.children.map(child => ({
      fn: getNodeHandler(child, enabled)
    }));

    if (hasNoEnabledTest(node)) {
      return children;
    }

    return node.beforeAllFns.concat(children).concat(node.afterAllFns);
  }

  const treeHandler = getNodeHandler(tree, false);
  return treeHandler();
}
                                                                                                                                                                                                                                                                                                                                                                  ��_I?�r�Մ�KI�+Z��3�tM��g޹����_���Ի��c����;O��,�L~%7�e�g��'���:���z~���P
eٺVŬF�m��2U�NS�p
�0hc��W��Λ� ���
5�'����PK    m�VX�)��y3  �w  *   react-app/node_modules/type-fest/readme.md�:�r۸���W�����m����em�%ٖ]]W	Q�H�!HQrW�����|��͇�/�O����I'==}�H Ί�C�us��e���:>��|H���y�_�6���76�M����2|e�0�⍿qizN��-�i,`��˽@2����,�j����r�Lb��j���H`�ﳳp�g��)�"��~x��`��.����0���ɲ3�48��<'M\�c+�����YIp~����d4fç9Ϛ�p�#�ǴGLg���S�7��F}=\�oüy�z�C:�*̶��t� ���� �����"�l����wǵ�N]�� �cv$�Nơ~�d�#ٝ�̇a��c�\
�mI���+:"���!ڒg�c1����G���i��.�+n�.�ãB���YQ4��A������dЄH#��\4���@c�3�F�l�3��!a5pÏ`X�k��L2�55�q6��1@vf�Y�&�=[��F׭�x��52�~�I�j N=DtH�EB"��ݛ�y`��&�
L�+�R��J��1�y�4>�������?����J]]��Z��k�$%S�8��̱6�P���pcG�-�Y��DW�И�{�,��2S���P�܌�E6y@����}��[�r���JM��Կ!a�ZB�{�{��� <�.��ҏӘ��$���W����Z���	�=f�����S)��C��^�i�� ��sj/��whƘE��s�S�D��V� ������~����T6{����O�M�5�j�R�Ԗ;{E�Aʹ�b۵�O�H��Ee�M-�J���gڦp����F�3���3��ҨK|m!�p���i�"V@c���Z̥^�fO�H�yF�:��0+g�x���aF2P��Kj� ���g�w�����%Y�ȃ����z�<�3�,t�yd�M�����^@G3b��?�gcf��e.)��M�?S�	���!�'%��D���Q~_���~1y8VȾV�����́���B!I���8�Vdf�H��x(�<�ɕ� ?�h^��V<�Br'V��F�1�J�r�13T~�qS�(�"��d� N�S�*7G�|�i���}#�M!�pgB9ZQ�G���d�<m�X*m�"�!�J���+�e֣d8M;̧<O�Ǚ�o[o!>�`N�4E��8�~7��bAm�K���O�'$CSP�.B�TJ�RAttT�KaK�(s��:�z?�n�zF���_�����I��84������)	�{dσ|��2qBfy An�'s�9i���­K\.�V%�BRU4�܃�\��wd���&~Zܠ�f�Wiy�4�% ��l�u^ҭ����6�ҥj��F��B&���/ɫ�o��Y,�0/���D�\�ԍyq�bZ�՗L�U �ܨ�H�
q��w��9�)��β�p~��iŹ��$�ϟ�%z\�ig��tNNO��s�-�b�{Z�2gYʏ%�o;�R.�O�9G�w��� Kd)�����+b�O_ׄio=�*�T9�4;�����b�3m���:�rߨ��	��XcD�ud�U��0祎䲔V�� ��tDe�/q]��V����wnj�>KGe��1�U���JX|f�u��eޒx,pt	��b��O��r�L���*
�W�{L�<�������^-jrDU� �Wٕ%����T�ȩL�o�|L�&�� Z�Hb�5�S�\K����8�W�G(�T.�F��ߏ�AL�S�����ɒ�ϣ�p�?
��s��^�{�� %~Y*��1n��4�ɚ��W���\�?���@��.����S[(�/�Ǘ�e��4*y��xhZ߱uM��sx�jl��8����h#��|�h
ZrL����'w��h��T�Rۊ��th8j����U�Z�ͩ(b�Z��
���}қҚ*��'���C�H{t�SGO�IL*
��ӿ��u�.���wd�/#Ul"h�9�'.�P����5�������+�$����x�5j�G��Pn��<��?b-1��js)�#�Ll�,Z�9A��J�O��b�3Ǐ���"qHA�e�J�kP�b ��TaKJX7�T�P����_s����VZ�[��ABy�^D�P���_�#j������h#M�Ύt#�$�z��ae������3OԎ"�%�@�:p�z�R���������HP�91�����>'���A�NK擗�Oe���oG9s;+#�C��<00fj�neDlY������/��gH�R�gaV^I�r+Yx~��Gn\�>��R�{Ш��Q�n���h)��m}>�:��{[ɢ!nx��q���[:^M����[?b&1���_�CЗU�&���R>����+�����LD�ʱ`� �`:g�L�iT���̒ȗb�{�� 
yzc��
�<�ݕ+_��_%� 
��}e�T5I�\,|�1����	���9������P������	\�hW#��\��Eʂh�s��b�����b��'Ҋ0QU�;�e�4:���hn&gObH�xsЄ	�$�$� ڎ!987���\��_b%������,}�8�9=1?:D	�,fN��U�&���α[sR���m��>��д,Y'#x2%�@%��x]�ōqf2���!󣺦�9�Oe��]�-�޿�]����PY7����й���ԧ���/cV�|u6��B�Y:
�2\�����T�T3+�Ȗ��E�lr:��f��EԠ[�C�	1��(#VMW���.q�F�XO��6'+�\h(
Q�q� ��	��>Lъ�i��<���#��;T��C���5Gxu�P8s�b��(�rL5bBs��M1Q괠�wX}8�8;������u��M�B����T=��a�h{�=�QjfB�?r-������2Hu�^f��,�}n&����8�����%j^�vx�(�z��������䓣��DU���+v&��1j���J�p�^zG�"�rŏǸ���8�E�Z��=m!�1aF�ˣ����ukF�� ��>K�q��ˣ͸�d�n����Ȍ~FE���P�h���J6Nb�2�&�{�u����g<�m0P���WS5�fw˩��+�l9u�ݰ��&�V�_���~�1\cd�c�h��۵j�d�����.6W���dP�6�ɮ�k��za�^�� �&�����<o[���/sǌ�p����_�����_�)�=���ʼ5lY�te��9�|��m�:�Uk����jź����Y�~¸ܐvŚ�+�_:�I�3\q�\>�.	�M��u��O>�s��wzN��N��f?�� ��<�0l���M�:�h�9�����K�f���Y/$�m��[���y6�0vÉ��φ��M�^����8b�:h��_����|�ȏ���bS6�=�+��ƠV����c�A�e�U��?��^o9^g4�5��-˸�ZÏ ���ܲ]�7������� l��B��N�V8������X�q��z�y�om�����q�(�'�W�v�6�y����F��O8��"�n0>+R/�{�U�h/z`$�6/�{{�u{P�&޼��ĳ��(G��'�#�n%0v]�����+IT����KҹP��#D�GjC,�r9�]<�'�N���6�DC���	B`�xH:R�