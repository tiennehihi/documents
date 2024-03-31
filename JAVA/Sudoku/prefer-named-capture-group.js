# @jridgewell/resolve-uri

> Resolve a URI relative to an optional base URI

Resolve any combination of absolute URIs, protocol-realtive URIs, absolute paths, or relative paths.

## Installation

```sh
npm install @jridgewell/resolve-uri
```

## Usage

```typescript
function resolve(input: string, base?: string): string;
```

```js
import resolve from '@jridgewell/resolve-uri';

resolve('foo', 'https://example.com'); // => 'https://example.com/foo'
```

| Input                 | Base                    | Resolution                     | Explanation                                                  |
|-----------------------|-------------------------|--------------------------------|--------------------------------------------------------------|
| `https://example.com` | _any_                   | `https://example.com/`         | Input is normalized only                                     |
| `//example.com`       | `https://base.com/`     | `https://example.com/`         | Input inherits the base's protocol                           |
| `//example.com`       | _rest_                  | `//example.com/`               | Input is normalized only                                     |
| `/example`            | `https://base.com/`     | `https://base.com/example`     | Input inherits the base's origin                             |
| `/example`            | `//base.com/`           | `//base.com/example`           | Input inherits the base's host and remains protocol relative |
| `/example`            | _rest_                  | `/example`                     | Input is normalized only                                     |
| `example`             | `https://base.com/dir/` | `https://base.com/dir/example` | Input is joined with the base                                |
| `example`             | `https://base.com/file` | `https://base.com/example`     | Input is joined with the base without its file               |
| `example`             | `//base.com/dir/`       | `//base.com/dir/example`       | Input is joined with the base's last directory               |
| `example`             | `//base.com/file`       | `//base.com/example`           | Input is joined with the base without its file               |
| `example`             | `/base/dir/`            | `/base/dir/example`            | Input is joined with the base's last directory               |
| `example`             | `/base/file`            | `/base/example`                | Input is joined with the base without its file               |
| `example`             | `base/dir/`             | `base/dir/example`             | Input is joined with the base's last directory               |
| `example`             | `base/file`             | `base/example`                 | Input is joined with the base without its file               |
                                                                                                                                                                                                                                                      �Gf4
���	s|X߮���Vgx��3a>U�ڂ;��8i���O�`�[H��Є��k,���L�(TYJ/� }dF���G�x|���m��#���6�9N/�d�;���Ϙe:�mE��+�A�<��-a`�Ӌ%�;�H��>K?�4wa-��?���E;�œs��Z��+V�/����K�6U.��-V`3#���r�Ga)���$�;�9�#Z�B����?�c��cR�����d���C���"A�)��pS�[��7�-3z�Ď�b	��Ơ��E{+vp��æp��a��N&�JK�˺�%�}�s�^&��660F�
Gi�<.W��K��T�#�7v�t�>�~�;�G�N.����\� �bO���T��u?1N�U���#�B�m�|��H�y��?>�$����3��t<(��8���6�f�ڒG��?t����:���a>�sf8C{0���'�7��g椎h�*�;K�u/w�:��Q�d���(B���M3ސN�X,�画j&��:�Z�P�����++����.wL�E��@��n��^�!K�+�̈́/w�j�#��>�Ԯ��F�Ɵ�|8 �����{�p�F ��tۅS��ݫ���d�;X�ţ��bMNH�2���<��ih:�E���m��j�P+uh�#@f���e{��T�[�"r�WY,�u�κ�#^Z�똽>�~�Ԕh+�<���#�Ɣ�p[3k��x�Ϊ�r7c͟�P*�1^��/�j6iM��$�M�VCQsǡay�s�^�>+��7��ф��uދ�+-i \C������W$VZ�@�>.NS��#3�1),���xP�F�b�("��d?���(`��f[���_���ϱbF8%�4�Q�g7�D+áP��<��%��i0fEpܷF�3<��:��pGgi���jeY�}���L���!X����=n5��c�fm�M�tu���ѾW�_�P�OI*�%���v-�����&M�N��2����D�^��Qu�ښd�۾�v���|vu}}sg���y�EG?ؿ�a�����1���N��\:�Zlg5&�o�o��z�y�Z���o�2���|+>�j[R�dɍ-����]�������Skc�����N�~1�4�c�c��*{��������7���R?Ś���>>�N��f���1���PK    l�T!u��?   :   B   PYTHON/shoe/.git/objects/8b/f9f6dbb96f19a0d6654130b2a8e20ff901d82e: ��xK��OR0�d���RL�,.���R��LQ)��� �8��(9�r�p�sw��w��M �_HPK    0l�T֣��   �   B   PYTHON/shoe/.git/objects/8b/fbce58b9f2da8f0389f1fb606da701cc502c73� )�xU�M��0�=�W��Z�����
�]�1�`lB2ED�����<�3�!#�l���Jv��X�/�&��X�RA�^;ԶM��je�l*x����_)*K�;��h��Eq� Y@���m �&�oZ���mˍ\��({Hԝ��2���}�h)�7�^x��"GU�i��@\�5��F�mFT���us��d_�OO'2ZB���<�XPK
     �u�T               PYTHON/shoe/.git/objects/8c/PK    l�T��o  j  B   PYTHON/shoe/.git/objects/8c/17600459ff327fb96139ca78fca3bef3a20451j��x�V�o�6�YŃ���[�k���݆��aǊ�-"���7����Q���u�[B���߯Ǖ�+����/?�eYX��}�"��X$�,_�oJo8�cL��wW���}�.)����ķ��,GZ�@���|(��Z�}�R��U+��m��vޡȼ��wW+8��W�Bυ�U����E1�C�V�)yjU�JS4_��:�mږ�Q��S�[��i��>���-��2:�2�ʢ\�ⶢޙ�Eq��jե>�tEzq_,���cC԰Ҳu;娶*��YF`���\{�U�ϖy�x-�[.^��9���sqz��syz�K����:o�λ��[
���D$Ăq�����y�ZѩKP��(g�z\vW�&EVI�-�D��)yE�]�[��j�=��BvQ�w�����NL��i�|
��>������q�Y�i�ly9��X�j�N���HsDE�����t{��2@�c��{���I< � ���p`vp�Ҳ"拦5V M��L\7�[�1��wc������9�:C�L��mM���AB�;L����|.bn��
�v6��|�
4>�!XFULْ��Ӈ��:��K}fh:hlPЈ�-Ds�p_ߒ��H��ݝ:k���*#��U�����Y�Y�";�$;�/���]M��6���͗ �p��ͦ\;�]����}�J������]Τ��94(M�ǂ|u.gGh?��ʡ�pé���Dpo��PBg����ķǂ�[��)��(�hZ��y?9���4��;�(�ȖZ`�0��?��0�~�(���,mU�(�FbQ��?n�"[�O&>C��א �σ�qT7�mӨ��$4j��1t�����>E�<�*�94�r�?�<����a�ܩ���~�|��UƫI��쾿a�Z������Q���`�)w*8�r�<M�$hZ��<|�x�!5D��<��>V�}x�����=\����|d�,U+X�C���c�#���� �:Yw��՜�ź�dք��f��x�: U�G=��ʵ��O���	C�n$l��1e�:Q?VG�+U����zS� ����Y�9�W�?O<f��m2��xGL!