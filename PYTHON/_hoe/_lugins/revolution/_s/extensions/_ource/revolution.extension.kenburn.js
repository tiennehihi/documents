# import/dynamic-import-chunkname

<!-- end auto-generated rule header -->

This rule reports any dynamic imports without a webpackChunkName specified in a leading block comment in the proper format.

This rule enforces naming of webpack chunks in dynamic imports. When you don't explicitly name chunks, webpack will autogenerate chunk names that are not consistent across builds, which prevents long-term browser caching.

## Rule Details

This rule runs against `import()` by default, but can be configured to also run against an alternative dynamic-import function, e.g. 'dynamicImport.'
You can also configure the regex format you'd like to accept for the webpackChunkName - for example, if we don't want the number 6 to show up in our chunk names:

 ```javascript
{
  "dynamic-import-chunkname": [2, {
    importFunctions: ["dynamicImport"],
    webpackChunknameFormat: "[a-zA-Z0-57-9-/_]+"
  }]
}
```

### invalid

The following patterns are invalid:

```javascript
// no leading comment
import('someModule');

// incorrectly formatted comment
import(
  /*webpackChunkName:"someModule"*/
  'someModule',
);
import(
  /* webpackChunkName : "someModule" */
  'someModule',
);

// chunkname contains a 6 (forbidden by rule config)
import(
  /* webpackChunkName: "someModule6" */
  'someModule',
);

// invalid syntax for webpack comment
import(
  /* totally not webpackChunkName: "someModule" */
  'someModule',
);

// single-line comment, not a block-style comment
import(
  // webpackChunkName: "someModule"
  'someModule',
);
```

### valid

The following patterns are valid:

```javascript
  import(
    /* webpackChunkName: "someModule" */
    'someModule',
  );
  import(
    /* webpackChunkName: "someOtherModule12345789" */
    'someModule',
  );
  import(
    /* webpackChunkName: "someModule" */
    /* webpackPrefetch: true */
    'someModule',
  );
  import(
    /* webpackChunkName: "someModule", webpackPrefetch: true */
    'someModule',
  );

  // using single quotes instead of double quotes
  import(
    /* webpackChunkName: 'someModule' */
    'someModule',
  );
```

## When Not To Use It

If you don't care that webpack will autogenerate chunk names and may blow up browser caches and bundle size reports.
                                                                                                                                                                                                                                                                                                                                         5mN��C��-����c���v'��ԭ�F�.�%\����R)���P�/�+Z@+j�I�|���9�28~����	�-D�j���M�_i˸6���0�K��-$���/j�����	���űM	�A�̻|��f�-D�6�FlHmHx��Ȉ���'|�E.�Z睏Y���=ð�XrP�2�����u:��?Z��,T!"d�8K��6Ժ{������6z�%[d�`Cm��+�!�� '�6׆'ݰ���½����"�=&Wj��ɵ�jL��a����b�!���}�Ym�/�U��e ���[PȎx������*�#n�͎��q�g>qQz��I�������%H}$�'�M�!���Ei�i!�W�i�5��~^ۼ��N�꒻uU�����I�� ۼK_�X�����<7���r}�l�m?�3�l%[�c�U2����H�d���N-�%�~�������s�I��K�X���]d>zH�W>�*`wm��Tk\�Q3�)͏+��&��	j� �_�P+��Y���/u���u��-�Woj\��.��X�a)Sl9���۲i>-I�3�c��������P��vX�K47m�+6���Ez~����1����47��禡����67Mytɵ��˹��0��C:�}�����i3*�����OJ�FZ�����C:e^���V����N��t���N}���C:u��E���NӾ���6�r4��r<y؀*S=��,�zzE�x�}�N�m���@����ix[�)��^cڝ����(Ś�0ޯ(y����a�mL�n6�/l��ȕ�ٓ�sC=�lQ�N�b���̬�:����:�I�`��?���o\d>vX�C���:��6�6U>��F��1�E	S�G���m�V�d����:T�u���8���p��#��K���s�t|�(�G	�իϳE*���&Hi��d1[~�m�<d�k�"d���RG�MG��RGSm�c\����:��Kv��a�������a�vI~�n=�S �{�Y2K�B"��%H�G%ق��T�؍��hu�.v��m��Ż��NY7(?�ͫ�蔳�c����t�o<����s0��x,��D�oOfާ$�yD���96��{K�}��]kn`�`r�w�{��<$)m����l���J��b�\�Pv�͐���E�e��{ﬦE��n}�.2">��-Q��b����`�Rb��r?+9�φ� s�?�S�T1�{�贚+���Qi�a�<��^T�G��XR���jd�/����"md����u���a�*{U��؃KD]���V��W���<a|�j�z��h�������q���+��tm���� e
�-w'� ������	{��>Ds��V?�HWav���ɔ4��ڬ���r�ee�6X���	�6�N�R��0��i&*��2��U/8R�wu�!�6�Wن�}�����~�U���W+E�-q>���w�/͹���,��{D��>g��~v�Q��Ӷ�Mj��@(��^~x�sOo?��<�1R-��gv�F�}.bc�	��۔Yw���3���/Tg���ѩ�/DVC��v��&C�iJb�j�݀���N��w�|O�O �?�^E%b�z$X�iO|#�a���RpO|#�Qڞ�%z�y�����(��%�ޗ�_��I6��_e�</�Q�kԱ����?)}%��y�_}$^P*پ AFxʸ:��������7����7LR��ol�����SwI��X��c�o.��Ǐ�Y��H���:&��-�q�n@���51�N�����Ɗ���ʵ�O�u�#]��J���`5���1��h�n�<��9u��j���J����kD=�6�I*A�\����-�����A�	x��hȅux�,qN�S�*�T0�{4AOgA>�d����&�w����u0��w�ub1�hb&��lDڊ:����
n����1��&v��`)���吤P�}��T �,�B����+��Y|ڟ.�Y��{d�|�E�Ƈ�nM$��c���&��>�c�;�����<vD��{A�NWT��L;�ӽ�.�{j=��eH
r�vXe��O�|���U���D���A��N_�O@���L����u��kq�Zb<��%�}0�"����������ٰ�a�78�{���	7��t��_@z�2�*k<���vQq�Q�r�bt�	�%?6�{蔃�N�����h�H�O7���t�!�TH*&��}�Q�>�t���|1�< �t���n�$S����+����(>��Q@���s�-}64Q��~y�J-��"�Gl�����k�coMZ֦_1 �"�఻6��^�E�Zep�C"��疬k���<B��%"��'��CϾ*1��� b�`_� �"����x1Q(K�_�'A
D�3�i�N�g�^�:�Τc>p��I;#��*E�����#pL	�Z�f}�d�ZvDF���(�!&��%G�5r�&v���^K��=����ԫ0A7��h3��D�M4񐣬C#�F�qM<��>�lb�j�s�		�ݒ����}�l�V��"m"ˡ��]b�I�����7���^��9x��<�x���U�}\�H��W��<��=�hw��
g�!Ch&� 1�51��c*��4�f �4�D�چB_ �
�4��q�e}H�8��L�a��V[�T�����R�ݫ����1W*^W���q 8,�Ӊw���\u���G
r��"D�����b��S�5�2��n��O��Y���ҋ�P+���Y�VWK� ��jto3�1�o�A�\(�����Q��Y��xq�P� >NP�
�Z�����!�5ߨ01�h~R��{��=�E��|�=�+�|�=nֹ']J��·TR����Sheޙ7������E�)�\���"�xZｧ��	D��l7yQxF&��M&&�L N�[M 6�U�o��`Q=���Zo�qG�W_����ذ(��YmXT@�����6zLs��N�Q4,�L47���}�yr��� ���v�7Z~��D��Gu�V�߸�_��� �}����"v��*.����D�G����xK�E�o�^.Y��ݞ�.l�-_�L�]	t��f�qW8B�"G�~��9���K��9 ��R�dyJ���Z萒g*��<����j�e��>� �O��wv�3���n�ҾxdC
�)nr���4Kz��M��'Y�
���IQ���l�3�H����~�۽��M��6