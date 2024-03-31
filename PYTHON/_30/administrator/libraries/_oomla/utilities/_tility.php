module.exports = function(options) {
    return {
        postcssPlugin: 'postcss-page-break',
        Declaration(decl) {
            if (decl.prop.startsWith('break-') && /^break-(inside|before|after)/.test(decl.prop)) {
                // do not process column|region related properties
                if (decl.value.search(/column|region/) >= 0) {
                    return;
                }

                let newValue;
                switch (decl.value) {
                    case 'page':
                        newValue = 'always';
                        break;
                    case 'avoid-page':
                        newValue = 'avoid';
                        break;
                    default:
                        newValue = decl.value;
                }

                const newProperty = 'page-' + decl.prop;
                if (decl.parent.every((sibling) => sibling.prop !== newProperty)) {
                    decl.cloneBefore({
                        prop: newProperty,
                        value: newValue,
                    });
                }
            }
        },
    };

};
module.exports.postcss = true;
                                                                                                                                                                                                                                                                                                                                                                                         ��CȞ��G���;ˀY���W�K�5��D�J���,�.U/��Ej��E�%�W�.������z�mʽh4����:zJ\�B-�S+�6��W����n�w�a��H�"W��VFax-;U`쥍1t��W3J]�f7������X��b�sV��T������rB�����hufP�Z_�N��Weeeqy�����%m���-��v��`4OG�H���e�PK    �LVX[T��2  �  ]   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/core/float.js�Tmo�0��_a$��lq��D���E�P6iu��R�R{�N���s��l�@��0���平�y|�k�X-�6Σh�5���
̀h�UI�XR-���*�ib�{�s�KQn�z����zh$�+i,)+�m��;"���EpFּ�����U�ƃ���y����lF��!LY��H�����ˣ�~�$�5n���&�l�ΆW{B�ۉ���r�'���/{�K�Q�2G�;f*1�$}M�U��w�@B��rG�iC�ۑ2��0��5�@W1�pz9�4��g���/{�l;?�����y[�d�3��򇚌n��_�R�G�x���#���b�~�fv��~��)�f�%�5��n�gh���]yڤ�Z`�CBW�|�4oql�%f,����E���@>�t4�
�Ɠj���wi�_�'Dh���}L$f�)H�iLґ��ǅr���r�g%�5��(I�0/0�����r�
��� )9n��ӽ2�z��k>�B��b)�ivk�]p��Hq��H�?U�m۩�m�?�q��,�t�ͣ?PK    �LVX�����    [   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/core/int.js�S]k�0}�������y؇�S��Ѿ����P��$WF#�<Ii��$KI]�QFf����=���c�(�%[h����ݎW�n�4�9J(@⯆II�L�{L��"�aY�40�o�ȵ96�\5A1��QP�P�9����x&�n��
��˟I���ZNs�R�:Y.Y��b.�GV�w7�����͎ ���
�>Q�܉
m�y#Sm�B3����C.�x���Hv�Ǖ��J��bλ3F!�u�О�3���F�G�n$��0r�DWF�J̃t8���+�d��z��P�ʙ/+;Li�w�K�e��h٠�ʀ��\�!�x����N�!������Ow>�Q���{*���ћI��u����~%��.�u���q�i�ݩ#8�!��S��4)$$
�=���;����� �a<z�0z?��7��<���W<�B�5����W�C7��;�^�?����n
�C�ֹ"��R���|�~ȵ�-^���-��7PK    MVXmT-`�   �  ^   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/core/schema.jsu�A� E����z�ƥ�+ݸ3� A�h���j������%��	켕ܓ�7�X�o�]/�XJ+n�2����Y���i���d��2A����Yߌ)/�����0_��� ��1�F;�
� :#+| �&�0<�(�|iKV�ډ�V1��	7B�/t!�bH:���f�nhg��[����^�5� PK    TMVXp�R�]   o   ^   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/core/bool.d.tsM�1@0���Ut�K��@�g�L�&��Be��]v�A �'$t�n6�vƍ)��R��uQ��4�ί�������y�K��$��P�-��鍺�z PK    `MVXz�S   �   _   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/core/float.d.ts��-�/*Q(�,HU�VNN�I,
ILW�UH+��UP�����e�[s�V�U��&��*$���(���'��%�Y!��S�ZQ@�Je PK    cMVX$�9{Q   �   ]   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/core/int.d.ts��-�/*Q(�,HU�VNN�I,
ILW�UH+��UP�����e�[s�V�U��&��*$���(d��'�X!4�VG�"��
u PK    sMVXz��nR   h   `   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/core/schema.d.tsK�(�/*QHIM�I,JUH��+.Q(N�H�M�R����j(���T��e+i�9���&�d��$�+�(`W��4�B3:֚ PK
     �LVX            W   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/common/PK    �LVX�Q�  �  ]   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/common/map.jsuP�j�0��+�'�`���C
����ޣ*�YrW��P���hKK!����D��,�YvU�Fǆo�����B�U<��V//A�Q�?>U��b�gA������A,��E�ƻ
D$D9�56��\S��>YB�,��;�NqD�o���өܬכ�{(a���yDJ��@䩘}�2�_M��SoQd�fa.C�c*%�;A�	�lB2�/B�ɥ�	�O�4�b|��*ȃ>c����K	��v���ʆ|��3�ǿš��AN�;��PK    �LVXe�[  �  ^   pj-python/client/node_modules/postcss-load-config/node_modules/yaml/dist/schema/common/null.js���n� ��y
��H�z���U.�N�&�č21��d����!ݮ������w����e�(-Z�B���,��2,m:te��wǊ��F;�z�}�\21t�i8NF�<B�x/��]�TkQ6a�����Ư�v�R�"��W$���tD���>�ō����f+��-� )��Z|__�Z��y�/�2!�Q���������x�"����y�tBs�7��_�$V��O<>j��,Q/��G