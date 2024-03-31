import Range = require("../classes/range");
import SemVer = require("../classes/semver");
import semver = require("../index");

/**
 * Return true if the version is outside the bounds of the range in either the high or low direction.
 * The hilo argument must be either the string '>' or '<'. (This is the function called by gtr and ltr.)
 */
declare function outside(
    version: string | SemVer,
    range: string | Range,
    hilo: ">" | "<",
    optionsOrLoose?: boolean | semver.RangeOptions,
): boolean;
export = outside;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Q�$g+	����#I�D�Ot���:l�/��V��Y��۰>r>�t�k�����>FsKA{����A����F��>!r* 5��Tf�G��=�V����5IaY%�(��i�Ԅ�X����������hM�g	Vg8����ɶ����G�2 ��9�P��0�w���[iS# �DO[qY_����~Ƣ�{+�		-�p��R.�V��^��>�-�ܫ)H=�&Ɏ��yO@�P[�j�JNm+V�A��+���u�+˶�X�����H ��yC�AR�0ȉ����X�Ws��#�2��y����7�	v�F-��������+���;w���͈>�n+5Z,�s4���9,�	w5�y̔#"��AC-�gn�[^u+!�C��v������[V��+<�-��������ӷ����2���p̩	�G�s+�^=p�)�Q�ᙀ���p>���8��8�j��}�%&�d�߰�!S�|�R:y��]�A�c'�
�b����{ �? Xz`z��ٲ�Ŏpr��!#,�]!{zr�9���z�Q<y1i&�+����B ؇E�� gK��0��K��~t� ����>���k�kU��媚�`��˲F�Ev��r�g����a^Q!T�J��Dy��e�xXD!S�<��U�"?���#F4�5e6�n��à���v��ȏ�F~+"����?#�2�x���t&μ�A����,�U̇����&s��ED;��"��+Xk�Ǚ�/S�ysݱi�ex]�o3��s��q���������Y�c�ٵ.zZ����_�A�Q�����#{0Q��a��QP8�S�edd:�`� .�aT$/A���NkM}ݧ�d��X�ٱ��� N�i���Da�.���?L����&�xw��:���[��H.":Rk+�c>/�g���r���1�l�߈�t)�����/S	�M�!Mj.�k
��IT:4���D���"��-j VN��*9B��XCK�H.B)��\D��d�����6]ƜN6E�&��J�Fq�����s���az�O'�/Ό�X])�|��2��DY���Hp���M;޻��%�J������N��M�wω&ߔ�6U��4��� ��1k8�(>rn��M�A�� �(�R/ō��e������A����)�6E���@\� LI��b�P^�h����{�@[�5��>�{�Wo���8m��p��p5۩���y�C���J&�8���>Y�۹�Z1�b0�>�P3� ����c3<�wj�^�:q�<88�Ä� إh����ߧ)>��N�JR�1�!?M��#L��!Cv�5:6���7��)S@��2�z�j�I`L���Y���R'Q��Z؁i�g1Me1T�<��;��r���.��*�"���"'~4�)�nP�P�|E������fc}MY���X��N��M��O�$I+׮ll6�!�7�����t����uR_����,�&���{�[�"��X8�b��&[]�*�����p�Fߗ��b�2�A����v�oS��q>(:�'n0b���w:E�ĵ���^��
^�߳�hG�~G�4�O!�Wmu����k��+���/��|5r5;�����F$�C
�3F���o�eF�L�a6�ӷ�q��W�0�����F�T1��#��-?���dȋ:eQ��|�e���"�X7�sy)S�tD��.8�~��Ĉ����#�yY�V������@�)���MM�T;���uh�K��)Y�t0��O�S��C�~��8�]E�*�ײ�U������p��<���h�YrȦI-�l�8f]w������ں�u��݁A_�vi�M��8n�LAT�@��F�Q�����>������eqb���>0��:a['�v�"B+)��b�^�U�x�Z+Î��J������O�\l�����y�6޺�򚪁�ga�	�才�[��$E	�ţ�s�ݯ������S�{��n$���;T�ۜZ*@��A/��w@Y���i�oq�\�����p�x�٦�����@�-�DӧQ�}ބI�8�d��M�W�����$}%������yT�ڥ&�N> �IIDo���Q.nj�/发(7��?H�۰�D�įd@4nYԏM]���:p%�d^|��<�nZ�����䞐�Lƞn�{Dw@Ћ�S���'�ot�<@�}��j���B �Mp݆��_Eb��t��2ߨ�P�E��5��t̜�g�
}��͒�Jb������JØ��h��<4�?�Q�C���|_v^lk�N��%��-�r�#:�}v�]S:��|y=���ξ
���:�&�ᆨ,�b�}����8w�E�����躋Ɛn�{�0~)ʐ�#'3IK����c����q=]����{�26r�آog 8L�R0�����p&uv���?�j=�R�9r<��IA:�=��_m��iVz-�6�3������(	��{���1f/�X�=	�T��D�T�a�ǜ]�@�7�0�,�����H��-{7:�c���(Ž)��b̉�d�Ⲽ�����m�9(�|ý�{<4�pI�_0DBx$����Ż��H8�E���Z�1��:`1xX��1q�������mh��N�O�(����>+�&'��*#�J��l�[�7�}fG-���N���]Mm�Fڝ:�$�u<7�j��K���7��� ���Sq9C?������Vn���{sd�%䈑J#42i�X�qj���a�KHf���^��~�=�t��;�GB��DW�*����F�:��Xs9��
MO�		�bu}��6V���*��_2I#(�U��)���������aA��������翂��n�U��~��(��{w`GC����N� �]�ç�j���i�1Q��Nj,�Y{C��S�On>|r��:5a�:�|u�˭?ϸ�s�}�՚y�d��0�, $���� ��[#���N>��&���&�W$�
��A`d!H�;�d8�����E��P�+��j��� �Ȫ�Z�-��>h��l�$x��4��
����P��{*0��!.��F$�H�S��0�������|���mUn9tzq�Ϯ�E�>��%�y<|ӏ�.�=G�盙/;�\��a��c���G���ta$]��������;.6׾�����s�|}��΢J����e�� @a'{����ז�Q#Y��@��P�zZ1V��S���n�a?:�f�`}�L�,��.�� ��8��9�VN���%@@\�χ7�̚��S���1��r��5���]+��}��j�������W���_��<�G���WW*�i���Y}����i-��!�~��ziZY[I3�|y�]��f�L_ݺ�(�a0z~����y�}�V���	��o���c��:��� ��}3m|���?B� ��܄�? >����U���S�`Vs���J	DHy�,6�:7�W��r7�<��[\���[�hJXE�.o�7��e%�(��)m��8\t���B������>=h+9�6憰�I�[��I�S4u�&�����J,)Z�t�=H��q��|�`���N}+s<~�^�����z��p(F:_���,�����D�/�#�/�VQ��^��~�ꢠ\���A�s�݅����M�M�m����&)�����&,��ns-�@^j��=�3j�+��F}��]y�\�p�Ub����