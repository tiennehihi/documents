{
  "name": "jqvmap",
  "homepage": "http://jqvmap.com",
  "authors": [
    "JQVMap"
  ],
  "license": "(MIT OR GPL-3.0)",
  "description": "jQuery Vector Map Library",
  "main": "dist/jquery.vmap.min.js",
  "keywords": [
    "jquery",
    "map",
    "svg",
    "vml",
    "vector"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/manifestinteractive/jqvmap.git"
  },
  "dependencies": {
    "jquery": ">=1.11.3"
  },
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "_release": "3a45b04e09",
  "_resolution": {
    "type": "branch",
    "branch": "master",
    "commit": "3a45b04e099bdaee5152b39eef21d6568d35c86d"
  },
  "_source": "https://github.com/christianesperar/jqvmap.git",
  "_target": "master",
  "_originalSource": "https://github.com/christianesperar/jqvmap.git",
  "_direct": true
}                                                                                                                                                       TypeError('Assertion failed: thisArg is required when mapperFunction is provided');
				}
				element = Call(mapperFunction, arguments[6], [element, sourceIndex, source]);
			}
			var shouldFlatten = false;
			if (depth > 0) {
				shouldFlatten = IsArray(element);
			}
			if (shouldFlatten) {
				var elementLen = LengthOfArrayLike(element);
				targetIndex = FlattenIntoArray(target, element, elementLen, targetIndex, depth - 1);
			} else {
				if (targetIndex >= MAX_SAFE_INTEGER) {
					throw new $TypeError('index too large');
				}
				CreateDataPropertyOrThrow(target, ToString(targetIndex), element);
				targetIndex += 1;
			}
		}
		sourceIndex += 1;
	}

	return targetIndex;
};
                                                                                                                                                                                                                                                                                                                                               �Q��o[QL�Q��M���yYP�4�t˂�L\�1F�s�Us+���}��퇷��Ҩ�h�
�I��¾ߘ�3=���%9<8�JUٖ)zl�۱�Jߴ	�V��i��G.���M�=rʑC�d[���K��}ЬnS��� G���'9���:���Z w(`z�M�)z�����I�V��^E��!��&�_��(Rە{�
ٞHU�=��HB����K3�� 풗�I��w5���|<�O��a�^��\[,�l��叢�=���a��	��TU|v&�?�}^\������4���in�7h�ѝ2��G:i���)��B�o��ׁ�h��<����^�<�����}+�����t.i3�^�h�9_lV��d{���OR���e�z�h~�Γ�Ǜ��J�Ʌ� �ٷ�����NC�y��c���{;��e���r�$�"h���؅������P	�'c�S3����xD����@� �J�[iD�Β��^�����#1�kz�� �g�C.z�GÅIW�n� J?�o�#́�{�y�̄�Od��D�7�ϏFJ�w2\ض���D�H�c5Z=h�N��W,,����,=��Q�.�r���[�T�J�����:3�:5�3�h�d�_�,�᣿aN|�2��y�j� Py��Ǿ�/��Ş��Bu�4����4(�=�'ܚ5�i�ߖ����UUF�q�v\���I��F[f%�3� �f�c�]�$��L�s�?�B!(	mCz�~vg���[^'y��W~Ks�G��X��U?}��Y��ôR5�j\�x}�T��l�W��$�?n��5}W�ϡ��b(�u�Ưa(,���Q�Լt�6���l�)�r�u�:̌�UfLg�I��"���p>���L �����׿aL���-ў�Wi`
��3�Ź��┚LVj��Kf����	EY�u�ʦ����O�rM�6=ȯ^�Ȓ�`��Q��Qvyq�H�Sn7,���=:T�}Ș��K�Ҡ��C��p��g#�C7N��k7���^;�oLNr�CN�_
p�8�MW8�4x���85�
�[�e�ĪM*�����-��rH��A����2���.+�HF�u:�:��@���T��#���4&ݍw�_���\��|r�r��I��_�3߲5!F���21y7u4Z�k^����#,�����玥�@m�����S�Z�y1Q� NQ�vKdñZ��M�s��d�#�O�R�J�ã?8��q�:���{�7�y6��0D�IS��>��h1�*�#k" �:��ͅ�S<@����i�-���*��ׯ)�5����d����?��]�� ��^�oR�"e����N�
�?R-�]�)C���T���aݘd��u��*4H�@�"�f��yH��(��@�9R�y��r�6eY���p;8[���
(�D=^�T�|���+㈢iʿ��XJ�٤3�Mlz�<�Ζt�be�o���r�8_щ�a07 ��§��Y
X�����y�:zx�O����E��6����wY��po>Ɲ�d��͝&�W��� �M�Gׯ�F��LC��Z��ZV2��[� �5z_���>�U֋   �DWVA$�	Wd! j�hZ8uQ��y�yV�[W����t�󺐮r���ًh��ajI����27�p�(�5��8i7?5s�Q@9�q�(�SY�6I���T���6�~�z�
6[ik���}R.��Q���O�B����V��Ȃ���������v�!����u�|3З���DW�G(�$]9<���������7���d9q6+�$g�d��KX��[��	�'�Cn�h��0�
aIT��EEř��I�
G�*�x��V��n��i�͟L)ݍ��2T�рe�
�>-��˂�Ͼ��Ʀ��:���h��-FȠ�]/i��� R�G�hi���^{ݡ�P�6� b�T���z��w	�����=9�2j�`�n����w��(��+��&�g���շ���Dx��V,r�Li���/̄[�M���Q�VD^�Y"gӥ�����${V���j^��馈�&�