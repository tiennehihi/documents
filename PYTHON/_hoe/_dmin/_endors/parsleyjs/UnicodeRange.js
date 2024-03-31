# typed-array-buffer <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

Get the ArrayBuffer out of a TypedArray, robustly.

This will work in node <= 0.10 and < 0.11.4, where there's no prototype accessor, only a nonconfigurable own property.
It will also work in modern engines where `TypedArray.prototype.buffer` has been deleted after this module has loaded.

## Example

```js
const typedArrayBuffer = require('typed-array-buffer');
const assert = require('assert');

const arr = new Uint8Array(0);
assert.equal(arr.buffer, typedArrayBuffer(arr));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/typed-array-buffer
[npm-version-svg]: https://versionbadg.es/ljharb/typed-array-buffer.svg
[deps-svg]: https://david-dm.org/ljharb/typed-array-buffer.svg
[deps-url]: https://david-dm.org/ljharb/typed-array-buffer
[dev-deps-svg]: https://david-dm.org/ljharb/typed-array-buffer/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/typed-array-buffer#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/typed-array-buffer.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/typed-array-buffer.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/typed-array-buffer.svg
[downloads-url]: https://npm-stat.com/charts.html?package=typed-array-buffer
[codecov-image]: https://codecov.io/gh/ljharb/typed-array-buffer/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/typed-array-buffer/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/typed-array-buffer
[actions-url]: https://github.com/ljharb/typed-array-buffer/actions
                                                                                      ˂;H�o*�\-1ԝ�k"c�y�}j`�S���N������]���� '�L}W�*�%89��rI�C��nl���.��f���V׈wO]^���K����
����E(��{%\�֣.t�7:q�:q��\K�zm��ŕr]�dօݺq�g׬�(�ֹю��_����ڹWDf����k��G*Fu��5�=�kq+.ąs)>�~=���V����Υ�uY�չ��V��;��ѭkp
�?��_t�X�GB���eX� ���U5����u�9�+9�Ů��;䞞N�<���?�v����݉����SޢX��,�)�C�t)��1��RY��^����\^�ֽw�����r��{�^yʄ9��ĺo)W*�9��9���*��]�2���ǋ8�$5�O"���Y��R��)xzW��I�(��_y����2�������L
@��7��(���ɱ��G,/	.�}Dk��cy�PrM�",5���R_+��Hsry	���ʏ.!N- �z2$S�<\��cy��S9=�3S?~�wH ��\xL,U��j����Ru9�nʛ��D�9QM�&g2=�S���0^�k�L
Vub�ܢ.~�N�
o��L�$ Z�R�������F J?�~�8Vao��]�fh��"�����/NqB)S�B7G�\��P�$J����N�1E�uՌ,�؇r��^$˝A�q5��xp��!��/�1Q�ʇ�o�^{j����	�_34�J����>���=<Hhc���x
��m�m���~%w�� g	��d=�8h��5�$8���zf?�$ٷ2������������#c׫|���I���a�����Y=� }� ��G���.]z���>5ߛ�r7�J�wkE���7�P�������ݴd�k����)��m��y�jPc� �v�P\!��k�K ��AѝRv��A�Ry��np*nm�}�l\�8�8�@���8Y� �gU���h�<��$��)*6^��4"Sh� ����"�b���oU�>x[Ĵ��*�*��a���1�)�.�{��Q�E�y=��X<]ӑ[i�"��t�1�V�R�'^糿�� ��X�v�	@Uv���&,��Sɪ��T-@��ߋ<�X�ih؉k�p1�y8��I`��{G>8hI��Uơ�����3*bFX��2�C�������l=�AE�*����ig�J]EuH ��ݟdG���+K��ir5*������H%[�����/�ح����ь���Ƙ�Z'�Pڒ�8(�S�PG�s*����*�{��	����B�gH�PQX�=3(�P��e�v�{Wpݘ�ӯ���Ԋ��U�uXY}�`�����������mc�u�Ɲ�"���󑧴�R�#/.��BHz�$9O�i�b5��&��p��O�}zjv'��_�����p����W!]��^�B׋Z�zQ[_�f�p"'84�!D>�G|�ƿu�q ���O��2�	�^��;	Ϡ+
�͍��v�ݛ����j��D�3�^!�hr#H�d`k�� ��j�q�p��R�����.�����u /�e�z��\6V�T�Qt����!�ǉ�n�D�vr!��ly
��,L{S�/L'8��[6��R-<r���u�v�3��V��l�$�C 0���[����4��� ��t(�G߬�U]ɒ���V����+�N�Hh�K��pd8� k]��X~
C�5��x�,s�������!��y&<GX`��}뒬b��NXʰ���y���,"̔9,���Q��F�T��v��X�Q�w���a��ζK�\'�l�Q�_ɂ�߮+�]�ډY�jb'k���J*��Q�:� �ƃj\xP5�0Neh�����ؔ!�`;��p��9֢�]���K1�I���@�X��<nkax�`���>ѐ���\�6H
g/	��I�.b�6�(%8�o���j)˻0n��3�a6)��bN$D���.-��%��-障ƅ�/�p������9W��F&DWNT�E kũ�<k�`cfo�y��ߢ�p'MS1w'*洼L�4�.F�َv�:l-b��P����Le~0�����c��\�!7r�ǻvo�ž�n��ӳ��N�i�ڽ#�uG*ġXyǣ��b��vOs�*ueT��@��%a*��@���q�f�r91�ŵ{�<�'{M���̽���6�^��J=�n��"|����N?�Àm.nčX �s��V��$�8t���1�[s*7�*oE�i�`�_�B���A�w���k�F2l��eB�e���v2'�[�c��Ɍv���)�s2���8�O�dYV��n�u��{�x��.h�B���0Xt�j�	�bģh"C�=�*�_�V#�TGD7��)%�H�ǻr�9�̿����V B��{NlS���t+"�;}��.
���y�'�Gq�?���(RC�;��W}ٸ�֊&㪵*#�Ihaڈ%��?+�!�x��C���٤�NaxGh��ak�V/��%��fp� q��.��n��,Nh��>?�ɜ݃�� �-oB�QK�S�8���I�߳�H���Z�	]��h�����o����M2l]�I���&�mbE�ĉ�~9x:a�*�޾feU�U��ӧr���ӭ�j�/okHIO���ĊǳA`�L��	ח>]�ǷEQd'����Pd:@=� ��c*P���7���s��D�#���~nhA��#X1�Ȋ�%/ք�T�Έ���#-�6�W���t�J��gi���g��Y�n|C����g�G
?�=_8�d�Đ���:�=��]O�xR�볔�(8A�s�ӧ��r��ؠ����cΒ���X	?��1[�J�1�s�߅�]`§t��$鍘�|�G?I�_�$y�{��θ�Vy�5p�"�6f�Vf���eИ�rK`���#޶�8���u�S��3� ֈ����}X/�-�M6��/�W��g�����-��3�`fXؙ�0�ᘿ1S