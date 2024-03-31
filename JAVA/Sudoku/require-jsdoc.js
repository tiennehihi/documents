 any string starting with `?` or `#` that suffixes the `uri`
  * `isAbsolute: boolean` flag indicates whether the URI is considered an absolute file or root relative path by webpack's definition. Absolute URIs are only processed if the `root` option is specified.
  * `bases: {}` are a hash where the keys are the sourcemap evaluation locations in the [algorithm](./how-it-works.md#algorithm) and the values are absolute paths that the sourcemap reports. These directories might not actually exist.
* `options` consist of -
  * All documented options for the loader.
  * Any other values you include in the loader configuration for your own purposes.
* `loader` consists of the webpack loader API, useful items include -
  * `fs: {}` the virtual file-system from Webpack.
  * `resourcePath: string` the source file currently being processed.
* returns an array of attempts that were made in resolving the URI -
  * `base` the base path
  * `uri` the uri path
  * `joined` the absolute path created from the joining the `base` and `uri` paths.
  * `isSuccess` indicates the asset was found and that `joined` should be the final result
  * `isFallback` indicates the asset was not found but that `joined` kis suitable as a fallback value
</details>                                                                                                                                                                                                                                                                                                  ��s����q�@U$�$�T��>+9�+U&�ٲ[\.��b���8���%'��՞/|vֺ/x�m|go��BTQFb�yH��������{,��&�o{2�'TQf^Jj�H��}6%Z52���F�2j���:��UU�W�R�P�R�'�՞_~@�tZ��܉�0%�� %k��'<Y��m�$� �?�o�J���K�32K�����w�FV�L�o����˥�/M@��d&��$����k=Uu_�9\�G���]�6LMIQ)��i�y�) kYf3??��ނ=��-w;��`JK
����)vO�n�)��n]��7��ī.o�������̼t�a�&]RR����Ǐ�}{�h��w ����PK    3l�Td�&��  �  B   PYTHON/shoe/.git/objects/8d/5844d6b4448c5e174f780a18a3069d55ec0749��xMQMO�0|W�W�r*R�C_E!�;�+7�!�Ɛ��vh#࿳v
��]��xf����e��C�.���B�Z�E9ׯ#�?*�mH	�p�'���ښz��zVA�iСCӡi'�T�M��x��Op�m�#���n7�@3�ݠM��8(�����=8�[)���ct�R��o{����M��:����Uu�Z���lH�zC��h�VR�{�zG��BVk�L��tڥ���v�2"_��Q���XB��8,�������!v�2�	>>��2W�e��Y����W�3�q�&�T��Xd��F�c	��/a���j�e��ώ2ڝ� �-`�d+'�6�d�u��1��v���($n���O��L%���{���,� ���KPK    bl�T.Ǧ�  �  B   PYTHON/shoe/.git/objects/8d/626260232aeb7bc4287e03fcd5055234a03298�g�x+)JMU017b040031Q�K�/O-��*��cЌ��n�������O��.�U��������ﮗ�� �'�������Y)S��s�ع���/$��)4�?(�T4����9��/�LP���
U�������0��H��m?E�Um̴�ΨTqM�*	rut�u�s-c�l��%|�Y����\�6-�*J��/).)J,�-(�O/J-.NJy��[*$�ڣ_K����n��ߵ��Փ���w|ٱ�g���{3<xr��R�O_`B
�������ܭy��i�Ӫ�]�L�@!���aޮ��u�S~_̱^/��աo~m��� �����s��X�ݓ�Lo�,���uZAbrvbz*$F�,�7y��C����!v�� 1�dK��s�ڎĕ���Z?��� �	�)PK    S��T��cW�   �   B   PYTHON/shoe/.git/objects/8d/649999cdb0728cb0f1991029d134ff20f76e41� e�x��K
�0 ]��%y�K^@ī��j�5��ەp7Lj۶	�O��"!T��)�Iyr��i�Z!W�Uފ���F�P3F���%c 0&�b�V누*�v��qo]������"/?��/��v�ڡA��yV^)q�cp�?R�9���{_Q�E�PK    l�Tu��b  ]  B   PYTHON/shoe/.git/objects/8d/7bf199a30c04f9058e932bad1ecdf926b5520a]��xmR�r�0L�W8��36C�P�"E�����a+#K�L�����0��۽ەj��lU-~gY�K6`��r&��Bcm��=˕��0с��7���N�)�3Y����wQM�7"8��i�.
bz_C���e[�Ņ3!Y�A̻^��=]�!����p�Ԭ���2�uZ �c$��6N~���uH�S1_V�w
yLaw�P�!oG�3��l�*��lD�^�Y(BJ}N��~�%%l.5y���^O/D>}���6��?:#��H�d3����喴V2������#kO�%��L��j��i�%TP]�����9�e�|���)`���%,��[��ۄ�f��8��PK    Xl�T��N�&  !  B   PYTHON/shoe/.git/objects/8d/7dbf94eedbd76fc386f14a2b29e85f737763d6!��x�W�n�8��~����d�Q`��</����-;Bɰ�3�����Y��df�E(�"�C��D���݅�+ٶ�����tr`�IQ��r��+�j�Jvڟ�w��fC�ɷ1�����z�Go�V�3�{��=�Xr!}����}P���o�|+Й�5���Ι�T/m