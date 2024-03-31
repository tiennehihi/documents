// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
export default function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ;yFQ-8=� ��*v�{�L�{�,%���:6���M>�`'�D�䐵(ZUQ��٪�!YS�G2f�u^���#�����E}�������wLd�>���\@���qpwb�P1�[S 2��5s�G��#��h��fG��]��k���R `�x%{1m�6�O$D�d����E�8�o�P$��b�]��4�߱@Q,�����#r�9��'��4>r�Cg�+q����%yt@�3Pˣ�;�#�QMHq������h����#�C�]W�K<Z�8[��\�A(~i;j�B��V��2���v
��-Zl~1�/�v��GEV_q㲕-ҕ��ڞ�2�4�į\:��D��ik��4�b���3�u������cٌ��[��M"��gŏQ�3���FT��f�ܰ]�aQ�����"D��_xg��"ݱ�t򆟭4Xt�y�:�n	V�]��jg;�\�R���6��p�����ץӱ�*��;_W��!�Xr�����pg\����x�=(1�q.�8�,I���&�j#�jR��lM�����eRo���پ>~�����`PXJX.�e��Z�,{j;�iTw��7�h��?^+PT" ʿ�_�NyDP�a{�j�Y�Z����;.��,��l�ؕ/ɜ&DނJ���		
��;2�NOA<�s$7c�6y����`�K��qeԇ�Q$W�HGz���&z���	+s�̎��B�F��ΰ6��2�%ߛ� =�'ܪ�H82+Bz���U��_j���̅o=���y��r�%��A��x4�nk�t+L9��y<��ɸ��WЭIk�*��� �9�9�AiT�O�C�^�A��S~'!��]���S�"��CL����`�˄S��� ��2[A������O�_�������/':�U"��X���x	��S�l��~]�E� ��ˁ�=�2�P��_�q�C���
����S>���H ,�и�z��J��|6:��!�9��B�	%���΍�S�ژV��ݰa�]�����(����s�ͼl��סC�sS�y+�B���2��E�\��JG�q|�'��\Ņ��ja\��D�3�d�4�q����E�d��\!�q��B�΍v�k���ۣ Վ"��	p��0p��q;o�K�9����`��18���9�S*u��sQ�3'5�����8�"�}J8vK��8�A�	Xj}z�����������
�r���䍎N�rmd�� �/o��ZY�d�ꛨ3�k�G1M���'z���NT\�oVS9��U�����gsL��~q/8Rj���<�
�'� '~es����7���)V)��g5L�%�i����;MO)�QU���3��n�L����%%q)�?��L��D��X��Uv�z��֪|H�؞Gƣ�i����Dy��?���'�#͛A��d�g��� x��[�?ql:� �1�s�*�(����_����NT#e�'$���!C�o\۵�k�o���j��1�w�/��\�@}�;�*Ƽ��_+-��:�I�����xD��ƈE�����g�ɗsA�ʡ�����g�._�P2��X|�`E��L�%���e��N�b�*>ӫ��F�VAd�x��L6�d(k�s���e��g�Ӊę��+�[�U7v�d%��H���pT����5� ��t�b�Y�~b�������Y���<�Bܗ��{������JB�����R�9�c8�4�l��4GУr�����Z.@��cW���p'�5t]�|h]�i�(�k+��:�M`|�7i$�n*��i��@�����BsN�Jx[ſ�����u���+Q��-�w�m\m��JN�k�Z�%q���58���o�Q����=��F�S~��w���64(,*��9!�T��j$RE�x����o���ߔ��=:�����S }3������iC�����[_7@FC����3�0YJk��J�V3qKJ 5Y�b��f��^N�=h	�r<�5*Y���^��6�M���M%!�Ec9��(6��gJ��-��#�ZD��Fߎ8�	D�Z��i��N+V���8.��V��O���RJ��~�6,��it
�r@���9���?	���zLX���g��X�\L(�^�ctȓ�;X��'Ȕ$~�/(�f8���qL�q�=����Q�\ܲ 2�Q��1�v�a�s�m�5B�*]�a���-��z4�L��~�sjtA���_���-'� ��P3�8�j'Qŏ$5&%�?Fɛ��}�9m{��%ԕ-�ݘ�gÌ8��wu��;�}%���	F@v,p�sT2eTT	� \MhS����A�_���Op?���
W�O�����H��f#Aj��w�:L��
X\���|Z9	L��m ��F�Ʌ0��t���a����;��2'UB�v�Q0 5Uet�xwEF��pF�t��R�L�S~ X
����fh�J(������,���,��/��YPݸ�i�>
�`�4(��P@W�:L)��ZDB�NL��k����!n��C]�x룙U�)��C�e��+9^'v�����0.9�N8k�*O��{���$�(���NfT�O�Fg|�_l����*,.���D���z\3�,�ˎ6�O�4z�/8��$=J�iY�[ ��:��ouZ�̿2v-�k� ���0���,����rB��3�;=��J2gi�N����8�<�� ���q9_��m��q�^��� �{��e��6
U���\,�?�w1�֎�z]3�n���r���u�X��,�-�T���SwQ�{�0	$eKV?ʮ��2�/���Af౹ˮ���t�u?�4z�n$0�c{��g�Ov��Ui~�X,hi��K6�r��t�$��O<��J����7��1���K�8C��^�J���5�g!s��/덑��&�r�����F��V���T����}'<g�J2¹<y������:�IP	�+�0����~>4\}�V#0Bg_�e�e�m�N�C��]E� ����'���'�3���d�kB؞�`
gc��J�`��əʷakP��u���/(�b�����/S� F	�G�~����wp#m�^�TF�G�v���d��L�y&��I���o�V)����J����K�>??��6�jm�dӗ/�?�sX(y��J�Y���=��l���l�zy$�͜�/fa�UM���C��6Fz���	S������wh�:�U�g(��,��s:u�������`˯nB󱏐`yꯑ[�!�QH�a]w���WP���mpr���s:����3nE����_w	��4<s1��}x�<*��B��h�J��1�ԉ�Y�x�g����G�%0���o3~\'P�]��7�8�S����ۡ���ɏ�@"ؘ�:��9�pz����墁`(�����5��Qs4)!���c���r6��k��>S-���)�?&��t-�\���%�&m��	��kRc�Y��CM�Ӗ���[��g?S3布d"��0łG-N��ZV����SyN�@+rk �N3O|�����nIgAw ȕtk��%_���L*�zS������}��Κ6�����u�*m��.*�k}޽��:���C�x$�+9� &C��w�n�͢#��9�9���NǓ6�;�Ds�h�R�s��rjo�H&����O��Xx�GG�$1�>=���
K�}g�!��r2i���QwSG�j�g6Z���L� +qYQ27�)��6A	9��%&[�*�ȏW*��'��ȫt���R"�ɩ��+�*�$�e�-����I��n�<I��g	�IK9ME)ļ��nrv/<��<��[�Kq���Y���H48*��%#i�]Ȼ2l`.,�*��H���Bj��Z�F����P)h(�=W���$�t�F��o?�mТ�h{o�L���H��ҨW���Y_cE
��LGG�����ƕ|���6j�j�G)�i�|� U���z֮&��snhMԯ7g���C����j����c5�D�{5#�PlW