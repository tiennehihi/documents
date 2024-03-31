import { WorkboxPlugin } from 'workbox-core/types.js';
import './_version.js';
/**
 * The range request plugin makes it easy for a request with a 'Range' header to
 * be fulfilled by a cached response.
 *
 * It does this by intercepting the `cachedResponseWillBeUsed` plugin callback
 * and returning the appropriate subset of the cached response body.
 *
 * @memberof workbox-range-requests
 */
declare class RangeRequestsPlugin implements WorkboxPlugin {
    /**
     * @param {Object} options
     * @param {Request} options.request The original request, which may or may not
     * contain a Range: header.
     * @param {Response} options.cachedResponse The complete cached response.
     * @return {Promise<Response>} If request contains a 'Range' header, then a
     * new response with status 206 whose body is a subset of `cachedResponse` is
     * returned. Otherwise, `cachedResponse` is returned as-is.
     *
     * @private
     */
    cachedResponseWillBeUsed: WorkboxPlugin['cachedResponseWillBeUsed'];
}
export { RangeRequestsPlugin };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   �j%y������G�"i��V,�R�:������.��!x h��Z�"��'*/]�&�*�&�U�����?��E�t#����-�tRy���	���p��l�YY��s���ssr��.w��|���+Z�+�J�����@�f���%�'�R��G��46:���n%�:�!=��J-�=�%]�ꄈ0

ַH �ZW�NXŒ����e��^c�C�FC���E೽g�V�_��GN�;��OA��L)��i̜����a���hX�ϙ��mĲ�
�CzE~,7g�t|������NB�g�W�?��3��!�t���Ye��m�|ٞ~���[E%Ok�R�D���^�������n��J��0�����y,�%v���S��3ZHS}�l��aa<�سY��
�e�rn1���@������bdP54�����k��ʳ��Hv�	O�N��a*ߗ�.������UN(h7A;3X<P���S��]�
�˽��y��%�џ���\Bg`�;S���|�葑�S8�6�,���O�T��qKˊ�'�
�u�1�Eq�����q#,e}Ye����
<�Zr��m���r��8��p֏��? �%�q����s:�پ ��EYxB�-L&A�M��Sd�]K��	�F������k�#|�U�7$�WX��F"����5t��u��~�X�b	�l8�؃��R�m�۬��~��߄g4�#���m>1���~:�|	:Ѥv��
 ��",�a��Vu\�-��}Y��_z�%�����u[��ʉ:P��WO�c�,���;�*6֐C �!���C�g�G���3$����?v�u�����qdZY��D:�Z��?C~˯3��Z"��Z٫.���M���Y'Ex��^(���	�5��v5ڠ<45�f U
���o�C&��jb5����?�Aʚ��$SV�a<ŊB��NCA��; v�
��z���5z�uR8�WP�n�@����)Q�L�W�-�ь"1��>�n���3���
2f��X�0M�1�����ݳ�����Ň>C%�A?,m�	V+�����:�@��\c��C�o�[qE�6׷��朜�L�����dT£#/�Ve�+ə��@��)F&�	�fuT�� ~{��rݒeA+��ɐ���K�|�2������$��=�����;�g;-�z������;����.�oЊ��<<����d~ޮ���Cُ��k�>"�02��Eg��K�&c=��fi�[⿀9��w�[�{Ӓ���.f�D�}�f�Rت��������t��qqq��L��+{���jvb��F�7�6���ϵ���S{�u1���\����PРC���ٟ8��C�h�7�@�/�NA�/C����;8�>3��h 4c�6V����^��/�"LKr;��]3%��"�q[g�	%�?/8q>2jƚ/9-�"���2'/� k[�+����F�`�PuQť(�W����!0I1��^}�S��y�s�3�]��+o߹Z��{Qy/��"��
�'�e��ž|�(����������~��G���������ŉ�y
t.����Vvo�H����4`�~�X���,@ 	^"���X�6��8Y~���$w
r����(�_�dM������<�<)���)05�?����Qgu��أ�Ӻ����tRI��|���w��&�y�$]0����G����m�,U��ޚN)�����+#lA����P�{��G�z?���&�ݮ�0m���d9�^��SLg��O��bcC�o �aQ$W��J?�x�C��$i��cJ���4gG��aI-�v��>�d�#O���T��۵���J�Q|�+,nI[(5�=và�q�ԊRO+�j\�TM�����]OU�.JKܙ�oӒ�[�4c1��䵽AM��3m��x/����=��������Ѐf��k�r&��ɝЌ�h����3���4/�xS�%<$o*�盐Q(��sKscpШW���{Pf���G��0����i�&7�F[�*҃Ԇ���fGUR��w��;`D5u#f�H��7M)aH���3�ۋ������*-7w�g{�c�5�N�B�M �|�������J���n�$�!t@B4e�'Q��f�"o]ߑX�
ψ׋�T��ݾ�/:j��x�@�1Y��(��uL�S
��J��i���ag��=���#�h�dz�n��4�N�5sݫ�q8�?��S��ld�;ZP���B��\���uy{m�]��eGI�ݠmqJUd���D���i��3[�cA�y㧥��v�:��x�k1q�9�0C�=�$� ���l=�s���e�g��E��K�>���F2]^������t�sˁʹ ���tN���u��eT���+�?��b'b7q����MC)	���X����>�BF �Z��%eI�4��rou����K
��WT��'��kܥ�oS�Zõh��>�dD���g���䄠�5.�h��C�+�V�v�ya4��圓�n��^I㷘����qP�SE����kn0���n+-t�S�;���^$���v�0ʠ��E�THz�JH��r�5�B�����(E���O*̒K��(�?v���5`|U�Ã�*�g���j���4�;������bӽ�n��fd/���>0N�8������N�̏�K�������Q w=�I�*cI�r�Do/��o��^-5ո�B�T) {+����t���i��-���(p|���4����Hys���70{"�ķ%t��%���؇�1{v��Q�4}�G�nY�|���;��,eh����W5 cj"�h�4���]u'��?�W���q}
?�� ���Eq�뺣��؉j���r��#��7�������&����E�Z�JD@�h�Q��M�X�P5��r^�̌f��2�]�2�EZ��P���M�؄p^�ҷ��t��.B4x��G���1�'ˌq3�D�=��'+�	�\v���GB��d"?J�!4����!�Z�����s
S��ʰ]�.� ��-:�h���O��i�����ș͟<�@W�77M_7֤��
�*��&�kip'� ��#c��y?ҵ�m�VEo)ǃ(
�a��<�22�+Jt`]�����1��{è���]p"� TK.=/�%�{i����aS��؂�U���4����Z��%� �����``�D��̶�Q	�*�-:��[���n�`��4&�E2�y��Y }B�OaR�Q�h�!�TmY5���Y�v�Ǡ�؜,�`�:�h�V��ѐ 8�gc$ӛظ��N[��fh�KB��%��ٱ�]� �z��/f;3�q�k���;��z�Qb���=F�*qF}�6�@t~,������I�P���ZJf7�{O�f����'w���!uR�8?��K�,��m�v��4��{��t{��0�b���H�;��t_��{>��3�<!A�$�����3ц@���ݐd�[�>��O����G�T3y2MT��]�?bK�x�D��(
E(��g�nӬ��O?��ڊL�(��T�}�y4|6���jv^b#~�����b;�{�@���b%b8���QAn뉗:LddY@><9'��:�5%/[��g��.�m���"�~�I�y��}9�'8���[�5�3�*Y�]���?�̷��9��Љ��wo��#3Y�6�`�s��~����P���ƕ�>�&f�eV˪�wV�9�(rL.��<?4��ʽ{�O>���5A^J}Q�T�|uGȒ��⃺E�f���s?�m��0Ĺ��r%EC�c�'�_
�26ۊ}���mAΧL�}7ׂ/b�.M!�np�3;�Ũ�.��<����"��w�r��G���}�બ�sjG*1���Y��޹[ m�V+�ŐN {yP��̹@�m�$���G�/�AU���Ј�`���
�A3}�H�}��$N���d4����yw��N8dO��,���l����`�t��eF3���4�� �G\Ur����0���f�tGҒ��8�D�ȂT~�s��o��T�y��03�G��!T�Y:^���֎FlV������ߴD��O��qHK��k-�e({	#i�����*X��(�SAttkl���@[�Ga��~�d�Dɣ�d�a��h8�a/����k��_0 n�z���*O_���Ocmgi��Hnf*��Tk�����¼$�B�v�6L��-n����uw�M8�֝�[�^蔡�\A�1Q]>� 12��)��C��{K\����F�/��������J�x��d_�-�"QD9�R]ߨN�<�1����=P��$��6i�<CРa	җB�ֲ8�$h�Ǒw?d>�S�X��X@�]!�&�f����(x�X֟4tHVc�f���-�ף�x�92D$�=NzVl�:Yˀ�1?HO:����i�O�H�fy�NN&�q�/�]7�2%�s���܍E7,O{�+�,G�O�6	!��y��� I����ˆ|���-$�C�U���tr�tJ_o@ڢD� �h&�_v:�zΨ�@��}g���21���B\\���5:3�����-3� Lq0��?���e�{%r�Ho�g�$�1�a�8��=D�a$�v�T%}�X�h���<�vn�:�C�����E5��N