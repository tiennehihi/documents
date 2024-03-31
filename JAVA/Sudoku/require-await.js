import type * as PostCSS from 'postcss'

export type PluginOptions = {
	/** Determines whether multiple, duplicate insertions are allowed */
	allowDuplicates?: boolean
	/** Defines an override of the project’s browserslist for this plugin. */
	browsers?: string
	/** Defines whether imports from this plugin will always be inserted at the beginning of a CSS file. */
	forceImport?: boolean
}

export type Plugin = {
	(pluginOptions?: PluginOptions): {
		postcssPlugin: 'postcss-normalize'
		Once(root: PostCSS.Root): void
		postcssImport: {
			load(filename: string, importOptions: any): {}
			resolve(id: string, basedir: string, importOptions: any): {}
		}
	}
	postcss: true
}

declare const plugin: Plugin

export default plugin
                                                                                                                                                                                                                                                                                                  d��+���Ծ�3�͘T�����pQ�4�V�Qʎ�z��t�;�y�AY_4f�d�w�A���8�T��Y��Ѽ�M��F���Ts���ɟ?T���H�bgT�i(�xB�fj��5Y��zHt�6�L-t3�h���Q��=�>��M�ۂ$�pga�P�~@�B��f�\N��X&xo�/ŧ��@�̦yj\[�8�Gcx�ڐ�Y^A�ʇe�d[wsn4x_���_�-9<�Xɢ�����}�L�c�5Waf�z�"V\�)��Nz�*P�4fV�K�Z���6��H����)��<�.҂j.)ub��-!f����Ժ�6�>5
��u����U-�s��h��Dv��󁡉᮰�᷹(����ܙ1Do΀'M$z�zl#=�57%����@9\� ~~�����5��1��m��bH����r<��F����s͍�*ټ�^x��wVɾV%��OK@�!���j�Op��6����?PJ;Y!f�[���
c���O°w��ҫp��"Q�V�̹+�s� �ږ����vU���p���������w�	6nbŏ/\L5�#$Z�X$�1c
'#�9��o4�C<� �(5u3���e6b�ݷ.����{s12�mi�}�����'����l���!���FI�p"��Ǡ�B�,�|�Ӝ�O�on3��
&Z}a 3���
& �<��s»���DO�J�lfɹ=�qU92����-X��\�ŋl�Ỹ �]�這���wcT'�0��<��x9ލf߾x�=g�?�J�1�p�Az��1��`�QH���������M�0��:v�=�S��/��Nj#�d��`<�ͨ���� G�Z�K�x �	Gx�!�c�>��cY3�s����|�{bQ�}��lEKL��nȁ�?@\�t��y5��i�f�E��?����;?>Z�.~��]����XEg�)�:&,l�0��kdc����E�e�aC3�ͨ���l�)J���s%��|�/'p.3��楲���Ң���� �Pw��v�4��{����q)�3��G�5��U���/�6c 9	;KQr�W��hk�XQ�(��F	���DK�hzf��ߋ��P߁A���ġT��k�z����oS��ʒ"�{)�$lz�F��%u� ˴l�hZ�]ؔ���QB0�j���JV��o\4��ݳ��L{IM=lR@���CXf�g4��ы=F��,��������FI Ʋ��I�Aȣ���;5��s/)��!k{������{�YC��&'{!'��D�-;��* x�0HZ}|�D� UI�y~Oȇ�Qo��H��D*�ԗڣ�±�LH�D��D��3j�ѷ�J�F�����H���%�.��_e7����`Ѝ��~�"���4Q��t������דx�$�:�W���$^M�_���}|~��˖~.0H�cwwU�~?�U�u7~�A�k����'�˕�>��\s�D]�w���P˿T�._:x9Jڪ���/���\^¤��Z��tޏ�|��MV/wd��Gkd*K��1�*�҆y�o��E�����1S�銋��=�{��-,ُ=�b)]\�9�TDj�����D�Fc��iD�`R�a����I�<Ef��������C��	`�JTE�*�D�f�~�N���D���lh 袪o���/��������`<d\aBn��!۶z�#-)Pi�aB���/�y�������F�FI���bP_��w�i�(�4,D�FaJ�=���p���M�e\���~�3W�{���U����q_�C�6+�\�́�.���Zy�s�1���::!�3ֵ�gmk�d�]\��*DX�IBw3�H��ūwů���(�����}vP��
����n�;_�uU���(���ꩪA���[�L��J6�('�6B??������o��߹�dz�1w���1`P�~��^�X����
�yFCmnn���揬��\���Ẕݭ���wJ�����p7����0���J������P��
!˟B�<���70�t�p3OrV�VKl,�q6�(�N�{}��G/�jG+>��~��9���$#�ܻl��a��Z�厅��F*��C�J�%�s�jF�]�\0������ b��\i�'ºm���3�;����~=�^T�[��ʊg�Dp��q�L�+Ku_M���.�&��t�����uZ�e��&*���+���i�Np�@���,�(����>#�,@G��P&�����$���> 9�x�d��r�o�dFυ�a~T<*[���Md��Byo|aGs�q��