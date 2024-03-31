# [postcss][postcss]-reduce-initial

> Reduce `initial` definitions to the _actual_ initial value, where possible.

## Install

With [npm](https://npmjs.org/package/postcss-reduce-initial) do:

```
npm install postcss-reduce-initial --save
```

## Examples

See the [data](data) for more conversions. This data is courtesy
of Mozilla.

### Convert `initial` values

When the `initial` keyword is longer than the property value, it will
be converted:

#### Input

```css
h1 {
  min-width: initial;
}
```

#### Output

```css
h1 {
  min-width: auto;
}
```

### Convert values back to `initial`

When the `initial` value is smaller than the property value, it will
be converted:

#### Input

```css
h1 {
  transform-box: border-box;
}
```

#### Output

```css
h1 {
  transform-box: initial;
}
```

This conversion is only applied when you supply a browsers list that all support
the `initial` keyword; it's worth noting that Internet Explorer has no support.

## API

### reduceInitial([options])

#### options

##### ignore

Type: `Array<String>`
Default: `undefined`

It contains the Array of properties that will be ignored while reducing its value to initial.
Example : `{ ignore : ["min-height"] }`

## Usage

See the [PostCSS documentation](https://github.com/postcss/postcss#usage) for
examples for your environment.

## Contributors

See [CONTRIBUTORS.md](https://github.com/cssnano/cssnano/blob/master/CONTRIBUTORS.md).

## License

This program uses a list of CSS properties derived from data maintained my the MDN team at Mozilla and licensed under the [CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).

MIT © [Ben Briggs](http://beneb.info)

[postcss]: https://github.com/postcss/postcss
                                                                                                                                                                                                                                                                                                              �k���+�w�q�q�5��|�"�C�� ��sW�1\3�MG�˓DXK�m����e��y B<�$�#��g$2�n�QҠ�}=�6<��V�E�/�#��A�rY �Hzԫ���Tv���l�]@�����
/�>����i��,a�jP�M�����th�O\"&>� ��>�h��V��u����6��Hϰ��gv���z�mx�x�!h ����*I!ɹ��ӱ:�T��jSؽ��c���N3�kz�`y��[��[�K�ܘN����w3�;��g(p��y��L��u�>�Q��yʫ�}yj6@ ��YjZ\���%��t���z>+�[�#mo<F`�d*��b��}���̫�^c��&]������1m'Khe0P���!��oG��ٝ�r��g��¿�m
:�140^;�qi�zbugnl=:l.�~�� ��;Yoy�;�Qc���Rׁ���NЋ�O�к]��C^�����΢ە�l�R��1�o��B�36�?�5.Ғ��h٘Fb�-@����A�0�V��g�JS�gb�@����g|���x��6m����:I�!���ّ��g��H3���l������a��ƥ�����E�tvVZ�����,�U��/kO�7{9w�1��6��pƈ�Sv���hC��r�h�t��e��Jty�: ���Y��s�ԤR�bK����>���t���k\����n���@�c�|
z��hS`)����7�2��ѯpA�eh�$����KUqPU}����)�H�႒Gv��IA�;>�lp�~i�z��A�E2����%<��8���Q�%�F��?&,�+�o��믿X���a) ���p8�������Jt@�W+��rFj�}NǸ\!�&+^q�CV`�tX����w�|�y�,�l�3W�#!�X:Q*��F�4�q����e�����8�d "���@���Z[b�W����u��`>JA`V�B��?��T
,2�?���\�����,����q4�U��R�Z�+��J:�ve��Y��EA�����=�M�+.7�_�G��.Zv݈�٤ASz$ă�Q	o��l%87��	y7!�%䍄���7�E�8y,p������cD��e�b\������0�f�;@��HQ���j#�z/�.qŘ�q:>R$!D��g� F�.*�8��{[��� �A�hlI#57�ʱBY�����G��̭���g!䓚n��̌��i* �#��3 �+p�
ʁ4�C,,R~ɩ2��p��S(����TX��'��� ���	�KN� j����"a��\dD�I�"Y�=���!E*a�a��U����lI��͗�!dτ]�T8τׅ�v<�8P�@�'X��U+<]��e�Z��� o͔����b<U��R�=y�� �F�.��j7KDm�A)����[�_����4*��[!,'A�=4�9��UV�����������J��j%n�#��.��pل��SN���?��g��_�����zQ���g5�Tۉ��un�Ib�(��n�2�E38�@7����GqdsS�(����Ȯ������ .��M(�[DFZ=8�⪊/Zgg�����][[�U�{Qd!��v��|m� ��H	��˒iei�b����a�}p0@"̷�k��j�B��o�xbR�7�����#R��V�R�'cϦg�hI��=�,�{���q�뵔�y��ۉ��f޹d]-2^���%�����l���������d6q�r��	|:������c���e�Tz���TmCUN��rU7P�*��T���t����||rx7����R��}	�D����\�����-��T���I's
�.Z�����~pךm��Oq���d�~w����<��w�DZG�^���h�8Nif��5��Rs׀_K\hX������6�@��I�8h�%���v��q�x���T���[Q�g����\�=@�}<X�����↊���M��W�v{��lZ���6Ux�*��s�Z&��d"J"<����&���~����-	�k˞�麍ypK�^U������-7��P3�f��Μ;��X'젇#v�EY��!^�7v�z�ػ�-�x-a��zC:����%;�E��-������kVs��C_K�N�M(�񮏙Q�^�Ew��.4-��^Z�{I�۸8BBO�GbR�A�����ۏ5����0J��"p����.L��F� 	H
cz
� ^2"|���7J~�Sp��)�!E×0
wTHhԊ��~�o~hE/�d�0>^�_�m<.$�I+�SB�8@C�V����'QL�h!3VP,LL�sZ�#��6�����/�D�'������;�jsg�>9�1^vA��V�W��ot��3��gI��ᅒd�U+���O�݆s?߶�����o#,R�+9E;Y]��`��^��
j���U����
HU��{������m��u�=��&��,�X�x7��x�䗗�n��A�:��7�<�l@��.��>,JyʽX	�W�Ė�)�9�[�����U`?x?�-ÂA���F�G�.&G�;]!o�RͫM�k�|�ش޿�c:J���4ݿ�c=
�딠����=4��; f7����7�p�-`Ɩ'Y��M�0R�=`�Nۈۣ ��u�%:��� ô7;wyV�wA5��5�'0��C���e�t0q�X�{�&�#�bX��� �s�B��>�q $�<�{�X��Tm�*�VT	S�4S�{��딄kZV��:�Z��=�������節^/�����y�w��9r���V��������oy��v��:�è� ̰�O�D��4-�$3�C����8�]���K�X��?8�t��i���v���Bnn�е^L�?��� +���\b�y��6��o<��z"rx.{�r1��#���"�]�x�x�#q5/i��^f�b��@$A����k���=��R��O+a�Ʒ�|����}8w�_��(�2?t(1C���	�{ E2Y�vs"n�<�hD�Y�&C���A��8��s `:6���HT6�~*v���]�#d���x8�ٞ��Zh�$�7;��v��M�'�䚕��w��ƅS��V��af��#�K(-�$�B� &B2P�A
x� �(���~B��W��F274�����>~sa�"n�W|�H��hg��M}���ֱo�8����`���g3`�Ў;v�dN���2��A9�i�����LN�p����׿%��B����!��'R@�{ރ/�?�W�;�a���p�J�9���ak):}oA��t���s�$o�ږ����m�w:.��6r���l�{G�U:��!q&�T�8��`�`w\���4���.�)D4F��3���R`=��c�IN�M���p���R,��߮.���<�a�S�Cw%�qz�u��c� ���#��j�S�QJb�}�+�[u�A�iިn�����@��DA��!�dq!��[@ږH��F4��P
��o/�zc�;�km�I!����E�_�ΊRm�,��0!а,3~�Zi��0���0N����	�y`����s���&���}�\Q��^�8C��7翫��t�飻��Q�Q�8ؘ�殺����Z8[���;N����5�aWC�G�`��J�\�9��O:��.�)�pb�n�ltA�v�;WO<�8�J��v��,��,��s�YO7|P��	��z�����f:���