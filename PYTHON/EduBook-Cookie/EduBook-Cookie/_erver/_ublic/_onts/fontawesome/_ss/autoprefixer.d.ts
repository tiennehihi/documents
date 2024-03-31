'use strict';

// This example shows how to understand if a default value is used or not.

// 1. const { parseArgs } = require('node:util'); // from node
// 2. const { parseArgs } = require('@pkgjs/parseargs'); // from package
const { parseArgs } = require('..'); // in repo

const options = {
  file: { short: 'f', type: 'string', default: 'FOO' },
};

const { values, tokens } = parseArgs({ options, tokens: true });

const isFileDefault = !tokens.some((token) => token.kind === 'option' &&
 token.name === 'file'
);

console.log(values);
console.log(`Is the file option [${values.file}] the default value? ${isFileDefault}`);

// Try the following:
//    node is-default-value.js
//    node is-default-value.js -f FILE
//    node is-default-value.js --file FILE
                                                                                                                                                                                                                                                                   �I���ْg-A���bkz�CB�+PJF�A�4����}�&��� ;�\	ԅN~��8��4"m�`h�͈Ӳ�H�$���tAPC�� �!,Ͱ�P�7Hapb��Wq&�i��e����Cf������G�u����-V�����W_��F��ݒ�QX��i1��Z~nW�Y�M��N��]�d��D�A��V`8y�§��#O	���)U�QpM��&�ஈVǂK(��m	;Ķv�	ז�-�%�7XZ�{�ģ�O?~�����Tp�>.��ꏳ������తJ���h������~�Q*&qV�>�`�Y��-/Uj���eR�M%�2n�f�5�;�-c�MF7NI�&~2�W�B�\�)�վ�l2�i�L��~\�YX��D	/+`9Z��=�߉�S�64��;.#[%ޡ�3x���X�Riƨ'�nri�N}���!#��{լ��&j�f���0�	�qõ�J&l�F�T���L�<{r䬭4�,��Q�b��?�t>�uf�z"����>��K���
���鰲B:�Eԟ��p�ѣf?g��	�Azp��b��$��<�X�|�E��Cj2#�GQ���Ga.h
8Q 2)��=U�k;%��04��ԳJ���3�G0s��|���e�<�[�u�(9���Ysg�h_ʻPA�1%�"ӏ��Z��%l	K�=�Tҹ����z���`�q����˻�I���IZH�6�������M��vS�,��΋�7�5�-���v����I�ŧ�(�F�z�����8��L�tbӥ��%�}�P�T�r&!AՊ����T�'A�X�c57�џ�i��m� �Ǽ���jZ�1����V�#����3�p�%��Q�a��S�Ј��e����v�t��.���M���P�ߴ�j�_��-�E�ji䴧�ch@9Gճ��L������#�{=�(�ΠkIx�	�[��uɿ��L�(�7�5�Xc<�TE�Fj��X������@�sb�n`��g�':� L���++ [��4lE�B/Z����H�*r~wj���mi���'tH��.��~a�-Ǎ�sM��[S%���G��X��%�p�p^�Pa�L�ʸb�l�`6��{YD�2��*8��b�}hVwnen��|� vz�(����X��2�Af}iԮ��^�RT�q-��Ɖ@-�|2,��!������~C�����,���P�B�?����tަ�I���J^�X9q�X弐$�?�����_3sc�1�.��8�]c�م^����g���#���e�%�g//�c��젽��=x 5��>|s�E�����jZ�\j�=������������!�!�:'�@@]��.��lI�s9a�ï5�?�Vc=�%�x��T�9h���k!�k<5���g