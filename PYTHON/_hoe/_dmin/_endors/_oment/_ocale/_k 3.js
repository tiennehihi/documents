import { Strategy } from './Strategy.js';
import { StrategyHandler } from './StrategyHandler.js';
import './_version.js';
/**
 * An implementation of a [cache-only](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-only)
 * request strategy.
 *
 * This class is useful if you want to take advantage of any
 * [Workbox plugins](https://developer.chrome.com/docs/workbox/using-plugins/).
 *
 * If there is no cache match, this will throw a `WorkboxError` exception.
 *
 * @extends workbox-strategies.Strategy
 * @memberof workbox-strategies
 */
declare class CacheOnly extends Strategy {
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */
    _handle(request: Request, handler: StrategyHandler): Promise<Response>;
}
export { CacheOnly };
                                                             ���~�]����8�����eN z��T&�����[��� �ᐛ�?~��d�n�p�k��5������90�:mݙ�~ͧ��W�4���A+�P!��%ʮd�K��	cx�r#Xf</�Ͽ����.`:i#_��gmc	 �r��1�|��o��P��I�{Tf)5)38���&����>�5ARa�[˺�^����̓l�ڎ �����X����"�n�}�2$�
�Μ��͋f�Y����=n��:������X�ڏ�Xe\%�nJ��t{2�������཯�m�@N��0��m����PP�YJ��U���E�ዜwE�x�Y��*x�?�,����dEgͤ��T֐��?�6h�ieAz��jA�� @^{�j�\Ʈ�[�ˋ�5a� ��N$�d9����	Pת�u��S�w_����G?eNL�É��������<pب2���X��r����(*bI�z�`:���@�M������h�G����J�Ћ���Х��&�T쑔_஫S`CƩh|�Mœ}C�/A�� �(#���P �Enhs��Sm���@.�ί�\�E�Ğ��T���Q�X>.,C�_i>��S�- G�%�����b����cJb��H��e!'��&���Lc���G��g?(CŃ҂Ρ��A_$�%[,�$[YTv�{$Q�R6��8}��t��P|;P�Z"�W�4j�%&��jN��;��3گ�Ǯ�(��E[�0r���$�C���#���|dg��XJ��_����d~-���X���%����4L��Q�y�/K!A�E:j�Y[��\w�2@�t����L6;��2ʝ��e%%a�|[�+O]�ga2�9l�l�3͋ƯM?Q���84T7��B��W]��/ �ݖ2�<9������@���!#�|�#	B�M���N�R^x�݆��>�N��[�75+,�(�V\�x?B2߾�����e9�|~u2>'���b3�F'u���g������gs_����xݵ�X��k����T�6��V�L���I�J�8�M�f�>&o�:�Nw�TzQ��ъa�5wpL�^���O�#�G~����@���Lp�߿�a�H�0P Q �};T׊¼�@M8��y�/�t"Aں�+Qj(w��
mC��Y�`a���4׊#Y:i{�J�K)o��ܩ<���F"Kz1��m�0`L/�j;gRב=ہP�PMNP"�+�#������K:L:�*���4#:t�fB�rF몁����o3�/����(�j�m�b�D����������A�u��9F��_�zQ�cL�Vy�V[���m���閧��L�W,?��2
����G��V*Voח4:���9X��$ƫ�v���uzO5��OC3X��wm@P��ݬ��f��t�!�3�y�%��8��L_h瘟LwX�����>�����D����������rl���a�!�U��yndr��s�B�jP��q�qjL� `�L,�r��T��&3�a�|yk����kѢ���D��dt����c���=��q�I���j� ��v ��v�4����1W�p��ڎ��`�A��M2f�_�̧k]�fa�+u<�������rL�tw}T�׹|<�=M)�:=��9ћ;�3V^7�R)k��D  6�;�D+�6,)�S�V��3��<a��D{2��ln#��g��v�k:��CƗ�NI�����Ū�g�iԫ��3�M$ήPx��垎�LR׆w���j۽c��h�)\X�~`g��rH<�_M��՛o�k���5|q�GH ,�ӻ5	����6b��#���=B	���tg����'��&A?v�B&w�j{�h��)j��3�{�#q�1��-v�`�y��	�I&���_��]u��F,Q���X�HtM"*g�Ӹ&��'�m�� �Ea'�p�� -߫���̰z�rq�m���A��)�b��o�����TH��|,���eU\s�-;�[�}"����p��z� 8m ��]�p���E�3�u�q.�N��T����V���B�mI���w
�O�/.��"�_�hϾ��Te%]�����ԇ`��K ( �9V��Y��; fǿK�@�[6��x+Z�����q�r�b�'}M�Դ-5ߺף�R� _-P H�>�����usZifa����*��[0��7O�4cč @O.};(~d5��D�L��7�F�E%"��X�n�s�]�
���Z1�Ҷ`-6A��R嚆9���^� ���.ڿ��O,'[Z��! t2*T���e�!��:!��Ĕ:� �E��(��K9AK),�4�+�?�ŵ������j��~�~=�
(�����7�xf�M����h�d)�Ƀ��6�qpL��^��jG��nN�[��8�үt���ږo�$�#��U����QqSw��S��N�獷p;��	3�x��/@��b^>���ꚯ��(�D�5KK�^�G[����:��G���l�$ЏjO�9#�)�V�P!��,���Hm�  L��4I�.�0������9�,i0Z�?&/�Y0�2��ܝ߫�F�EI��@<�!^)_�..^o!EM��Q��_y���8�.й���M"u����Ir�[c�=*������Ն��N�L��0b� `! �Gf�j`��6�U�f:ܴ�(��������g'��MӖ�����)�*3t3���ٙ�o�Z���u��`������=���|b� �5}��xHo�<���Ɇ
��:�Y�in6�U������в�'f�9���)�� L׺#'E ��LH'��ʊe)e���8oWKc>M������d���a�S���p��+.����T�H`�E"�G������x������D���o��nʆ���(#4u�	sm���ij5���Erl�$��ˈ�_�[<
�`1(����6��t_�~������:3�t�H-tR/�=���`Y�5�y�_�������C� `��}���^��%a��%����?����"fKA����v�S� ͘H��ђi\4�N����I����3sU�0Bo"�T���,پ�P�ʐi�Ԭu��c8gQ��I�S��K�H���6�Y��Ҍ
�x$X*<��"�(�@���r��-���+#՝ �+�P�cS���Z�d?+�j\�9�·<�$H��h���Hҽ$�����"Q�˚H��ҫT�}ՙU��4L��={�*�s�K�$Uu"�XӾ5���	.db�Ʒ�@�7�2aR�Ï	w��VO*�V�;�&ك�G!C�	`qf��a�x� �8%o]+�W�@�
w�4�%(�9�D�U��l5���:��&�w�nJK<!<o���M�k�&�е��pw�>ϣ�������K1=�5$�id�Ǽݿ���6�� ����ؙu�������䙸U6ʹ�'޸?�F�haJu����+`�m���A�Ǒpoy�
k��"�d%m6����Ӥ��l�y��N�;�d�N��~����Y|���|��caK��/]Ә�<v*S��-~fju�6�G%�r�{+(B�x��QQ�J ajf��\�S.�7��q
`����8Ѳh��<�O}Q۳˴�zYع�
D]Ő__����s�:��P�ܝ�� P@d�S����i�>H4n�Y�!��-�2�)�sѸB/�h@��Lqꌣ��ֻq	gO��2�X�+a�����J��Q�ݺ|� �3@�ԓ�S��������,btY����j��1p4P�/���%���ʖ"���壷���m)%�o�k�3�x<���1(�3��J���o��[��Pզ���C��������g
.� ��n�}�uצ���?��i��'nL�Dfl}���#щ�p�� ���?���}���y�W���m�����Aj(�u��d���<�(����AN^�
>ޯ�m`r�SL%*+�Cj�ӑ�K�a�;�0���TȀ�<{��B���f8���qJ�E��r�D��p�^{�V^�c�!�#�Y�z�*�9����"��ȫ|�wa���v�D�̺;\�s(��K@ۏ��0��-]��ч��ޞD`�{T�)�_�kqr ���t+��FS��'���+}ǌ#a��XQ�xJ_�N��L���P~%�ʄ�?�Հg��$^�@��q֮��D�����_R;?c���8:��(ZU��xW��U�R�%3Z+)%il�/Hչ��Y�t�1�UB�B�E˅�d0�D_D�n�9������m�P�4 eK쀊pa�NRE�.�鵈Q�Q��_�_g�on`�o�����T���#�-G#mA��ײJa�i� ��>��{�ťuoq]K�K;�z�:��',uc�k��w�`R��?$+'����)/Mv�bn2Z%��CPi	g�Ru�~�̊���2s��=KOl��4/�S����UU�J��O��H��3���ab�zHF�4(���N�:ؤ5�7�� ��1pA��͖*u�C�Y�{��I߿��M_��'���z��G�]9�W^a��~�ht�yğ9��t������p�����R�X��xrkU��-�N0��m�CA�x�_�X�ф�,a�)�>��Ĩwщ�I��C ����Q���R
�"c����Y} ���y�J���YT2N�i�[46�\Yvs�o��C��鬚A���V����v��CF��������yG��@E���4�G&EP(� ;�L���RP��46��G�OR(Q�MZ��7=��>��"�v�F;����z��-�����5<�ck�*��s65�e�$�qfv�jY2��ͣ�&s��k�}r�x�)|��YN!���%���0K+����8�2Oc���+� �QO]_� 9�j���Z���Z�~�)����S)���K�C�粅.�!B*%��R���:���{߾��i�;\�΅���9$e<��=�ä����d�bC�g��8<��%F�tf�9	�D��n>�f�j�g��7�����	6�