"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPackExtension = void 0;
/**
 * A wrapping for MessagePack extension or CBOR tag value. When encoder
 * encounters {@link JsonPackExtension} it will encode it as a MessagePack
 * extension or CBOR tag. Likewise, the decoder will
 * decode extensions into {@link JsonPackExtension}.
 *
 * @category Value
 */
class JsonPackExtension {
    constructor(tag, val) {
        this.tag = tag;
        this.val = val;
    }
}
exports.JsonPackExtension = JsonPackExtension;
//# sourceMappingURL=JsonPackExtension.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                          ��JBf�""�i�ߐ��2��C�/��դ����A���R����>���/�?В>Ǆ��1Z��A��q)CW��Z�F���?L�YFP�QF�Ä�Y�����`7JU%K���*�����z�U��ɑћ,��ѕ�<�5(2/���; �P�W�N� 	`�^�"+����.,�.���B�(X��R<�0=0�҇���"^���ǜ�2�g��m�dUa X�V�lz� h��WQ��'U�_�� ד��7�O&�HUC�HU)��
*6D�>����ӶZb���� ?�8�Ya�a���`��r�v&yPB���f/�e���R�|���G���޿�i�t�@�����-�P�Z��b�� Np)Ѐ����`�m�.@ʷ�S���Eԉh�8fWy6�+����;�J�!������G���=�e��?�7��C�so��3�~Et���2��w�k�O�B;]�Q���Pvj�����4�r�۱��R�] ��.RW�v��"�%�Q��f�a��ĝ�|�4��+ªjm��;���� ��`î���v�8@�����H�S(~�yZ��������j�;XBP]	J'�5��f$�+@�	��^K��c�
��L�o� d�Z�9�}uۢ�M�3B���+[�bmq�3d��k������9h+?%]B�xLD,O��1���� Od�_ُK�^ç��g
jtu��Rµ�D �dÈ�44���K2'[3��"��pQ�2~�)r��y~��Ch�
��"a>(����h|�{|���Yw��Q�2ALN�Ѷ�A��Br��7H�]#B�!��}�ɇ(q;j�NY�3:Z����+?�i+�V�7�R��k�C���a�t�y�c]+k_�On۲��D�����j�l��UV9�5w���ɪ�ߜ�p��jwQ��ն#YL~�ҩ7�_��{9�OiT�� 6�Y�$r��/8��S���{I��h�2�
���Ƹ��%�����e��?"I�z@����5sc r�k��÷B�O�n�?M��j%/D��S�^�ϝ��6����}.>r~���n]�My��ٟ���i����w��g�
?�'2G/u���=r6w��j�ۺ��ג�AΧ?��_R�QXb�3<����QHPC@���Dq 2 4^�[E�]�yE�}�9�����.mw�4/�)M�� L���%��-(�y$ң����3����'��6/�Wd���L��T 
�%_j {�ݮ䨜;k+G��GW%�f0!�;�x�ԩp����;=��b;Ӝ�-|� �K�Rj��қ�.�>=?�G�H3;F����d���(֍��+\c����Bp��ⱸk�L�ԍF��$�BRͱ�ۻ��B��ONxqC� �B*W��2n.u������,�Q0ֵ��W�k:��;�c�� Z���Q�K#�>wy<�I�@%.��+ K˶G��i�]�9������`��.?�D�N��	G�&A��~����嵠2���ϰ�3��چ?�N�DN/0�)���J�ĺ̵R�EeX{�Ϋ9b�D2m,�(���!�����$�(�8Z(�]��tXw�[q!<��v�u@c'�Q�I�����-�R<#�@����_A֚s��b�m&��lc�����Y� ��OԨT�婧+�xg���&W=k���C۞���J�jp,/@���_jUV7��ǫ�b�9�E�/Q �]�h:����x��YbJO������݂�Q]%	�i��x-,����!���ه�&ݝĜ��`W[�,�c� .j�H"w� ����\��:����}f������e4��e��64�n(3S���B`[��'�l�@�Ӻ�Ь1ھ����t^ �*� [��5����J�"m�{yb�����������8�o���{9�f��6Y��Ct�a���^4~�l\�s\+[��&���Q��D#k�jS����>f_)ǢlOiA�"T���kǻ�"]���\��U�ScLר`U1�Kb\�U1��ͧyp�+��ѕ5�,k" � QՆ+	dԌ_�j�#J����f�8����R��pY�ݬl��~�J��� �i� ��n���Yi��HVW�����J�+jWSVn��kFE�-o�c�zN=G<4��爢4�$|��$w���S��)wJ�M�q�ޔ�9�B�\Q��R}�kE�R��cW,�,��U���>�Y��۔�U b���&y>Q�}3v��@rG�q�kɻϫ1��jk�=73��]Q���X��Ʈ��
���?;�E�,�����C���r>�~r_Z��Z��Uڰ�;x,CCAj��Bm*'�1�޺�M�zk����x�A�4��
�Ԙ������X|~�}4�Y����2���fC�pq�l�`f�+�y�4r��t@w�G��;�l�Ey��*���X%Y$�ԉ�4��h��=��������q�uy
�@ԩ��מ���O�0`2���+R�^���j_���ס*Ը�W���1۸��g��xd]��\HϜ#�b M�?|kx/�Z��:b9&L,�G�rbv�C�\��W�9��$�8��?#�+<����S���*�nB\_W_�n:��]ď$Z��~?g�	���-�T8}z���}���(�'5���_@�W����/h���P�P��T�)Հ ��ܱ4Ǆ(����mO���W�+A����ݥ��*ț8PG����.9 ��L~���o~���^��0sZ�5�����+՚��_�g�b�w;�G},�7n�e�`z�>��Y��F�ш�����v��o����^ύ?�C��܊�yb��m���4 �h���=$ �0)-��ih��|��`�x�q�����[��c�B�e����MF dSWz�C�����HB����(.�Wx-g�aI�,�0�)�pO��"¹����ޚ2 �iP���~�W
�L�"%�$s�a�}ׄs1d��[�X���`��Q�XE�x�Rn����n� $����_��t����-���de9�+������<Ų�O!W�j>"�"H�k��f��l@L]��6�>�K��Q`��c � �;�8��&t0}����#��×�����t�ACLM ��`C4�mI���a�l
��:��a��cVpY a�Ab;&����~��xC�%�j�FwbC��i'�ۥ�g�n6�.u��Ӳ����8�<���me��*�lJ۫��I� ��R�0Z:k����"G�o��q�y�'�U�|	a�{|o��{0 ��v�5�l�:&���������6\pU6�;��"��yC�����c���'��!�x[���Ο��7�ï���8���� 8@R��$2���|f�X���N�ES80��n��^��HK����Ȅ��Bmr���.]ʽ{M��������؀�������'ml�B *�3J�S򏩊(=!v�+��*Y��m�Og�#ñW�i�<:ba�l�?}\4ȫ�j��x;y~e`����c~z�~���^�2�9;�D"$�e��"�f�
[��'�:\��5�rQ��,��$%���LYQ��a���x� ��H���PM`�$�Y�~��,.�O�:��*Wm�$��GeM�W��x�)^9�M��F2��"^��n�,i�׶�
�\`��97E>?	E��fRX?X�Us��n&�ם�m8ؚQ �2���k���E���]V�:l��7��X���꫗�>C_)�/�[��2h��P��!��鯂u*�2�Y��Z�破#��ǯZ_Ƞ�����*��6��Fh$9e�qֱb
B�ɠ?�]y=�����S��Y3���_�L���剌����tl���jV��D|hzl���$⬪�^$!P�4��%�E�������
���.1�3�3{��<�K��+�̊��53�y���IHvz�ޗ�IW�,�KP�@N��.���Aۋ@Tr  V�(9��ܖs�꣥ !��*�bQ�#���X�O��}5�F�y�J*NME���Fi�ۑ�`\��4��[h�(�a��Oʃѝ)�_%������/�\�ÉD�m�RFc��E����o��R��*���U%���zO.�IɊ�4<W��_��.�6�I:sc��'�,�W|}r�Mw�386�_B���'����^U��� &�u��U���.�����$�y/������-L���sIġ×����/�M�I��a� ��I����8呇��OWS�@�K{��׏1E�!��4~��({�E� `�yk���%� MO��ao\s���� �U�
5<)���K���M��ŲӋ�:�y��Y�$�����O0{X��&h�kmIj��D�в�'^k�:C&�&���˾�E�� ��-�鯍|��@��6�GlfZ��'&dh@�v�V�!:� .�
�QT��X#sQ`����bu����T��Ԉ���Ǿ;������5��C����AgǀM��,܈Z5�ނƌ��3Fu���T+�,hJ�a֌�<siXR�x����i�N��y�r���E���m|Q���D_މ��-O#��C�'B)4�H�g�2��:Rȱy91��A� ���$��><��-�N;�z� �!�׋�[�9m����$�M�t����W8��z�x!\��ϋ�$�����"ك�����+����˜�gA=����g�87d�W_:.��p��7�� �HG��"��~�_A�͎�=�G�&�T����O9=����k�?�b���y�%L�G��,�5+�B^[��$L~�γҗ��o�s�]�Fq�����G�ۿ�\��=k�ͭ,���/)�"eY ���V<Qr�5UCޙ���3y��v�_��{b����~�P���G(ݩd`���^0���lT;a�։�=�%���c\�H�!����t(z�o����+��t@�.�95/���	r4�R Š�J�°�H��6��k����R�y<քU��*�7�'%�=5�X"r�'�LmD(q �놁�^>�u�k휁��wܸ�3��U�˫_g��`,�wMY��ɝSdK0xw����N1.�lY��xsw#�p�b�5�t�M���'�rV�&�M�}gQ�,��P���C�f򖹠�%+���wF����{x���^Ɓ�#�s�.����[N���N��B3�ο�*U 6�`�+���fq�$4��>�gY�S48�wя*|!��6TYߍ5u�g��z's��d|P��������M��J8��e=�(?��WE���@��!��$��}@�}�?@f!�B���B�B��c֌:�f� w��y��qcD�!E��6���������R����n5�a�D��@G�LE��忺�OѪ��fG��kCRD=�T�9�"����`��OR�PD��ӻ���A��1a.����4F8���7W�B�w�m��s�m7����U�Kmָ��{��2g����I��GT9�Lk��c��h�5��Bwww���ww�aqwww	�Np܃w�mO����){��{ PH��#h�iM�Y&�bfk�/?#���|�[��!p\��s� ��6A�%|� 
 `}A����4�Q>�H��A�o�*8�ߊʈ����褹U�1�m����̟���Of�r�qͰ�^L�as�5����Z����XY�M���eR���蘃�R|���h�{Ϊ�cw��>���[�,  ���,�e�'��/�B��!ޑj��f^��`�L6l����)���,�~���R�%��t|��&�Ai��R�+��,�� ���뻷hxKh20 �[����I���I�%�r��/�=ip:r��ʁ��JU<��AmΤ��F�����吏o�*��7dQ{n�9�z]�oʇ^kN�}{ǩUT��H����:�-��V����f�����^\�fq'�,�C Dp �9&k�n${܉�ɻ6�Z�Qq�P>����1�_B�>8� �ł&���eTa�3�156�t~���u��M�m|N��W���Q�yBi�Ѵ(huG���j���pT�ݞ�@�;���5(�-��|�"yiwgj��8���^�E����)K�v�S��#��eU/���E�u5�KG�f�(����<��۴b��7� �->�a<��n��5ްU�ǴE�?BMИg��C�%1��Ci�e|�LB�?PΙ#
�E#��@P *4 ��ڲ)�����/� �<�g�q���x3�(��b��R��%��2ջ(۩Dd��������p�a=n��7��r[c��X�ʈ��dmO�W;Ϣ��.h�;�5�%���!��A� �#1r����%�l�z��h�}�ዉ7q/6�y.[+��뻕���l�q`*�2g!���xY�l=?����t���3�5�Oq���`1�b;��r�垦�ev���AV�6E�se��y��QA�k0�D�^!f7��NDߘ�G��#{�2�a��A�<-�^����{����&��V�$<���gE�\t�>�>.t�-���	������?uˬ(~hQ`ߊ�'g\�>(Y72S�8Aλ<�c *�������9��� �ϳ��N|��>�x1�l�6˕�8���C�X>�®z���o������*/2���F��{�{O}wU��Z;K	��/�X�o�,`Q4 ��ݏ,p
���d���J�m�,���G{9����v8-l��W��c(�i4�p����_ЍF�.���3��%��©� ����.��l0�2�DC�v	��O��"s��]�����A!8�99�?��t���'�YA1! �B._�~L�Kˁ�D1ȬC��Z�>��)E�U�d5�Y�6�
��Ҡ�i8_{�~�� ���Γ�A��(w���T�{uK��m�R�ڣ"���6~]���u&�^�@��Q��V���x�-�\,��)�	�#��2o���H(5�v������l\��#4	�^$^;9g3Q���;��ba&��rJX5��ؼ�j# [��+턧MIQ 8:�ԏU��)���8�!�j��S|�*E:��)x�H����ό�����ilc�:�5�G1J�|�͆IpB)�z���'fȤ�
>X��:�kfD�Q�=�������� O%��-4��"5���ҧ�N�	����H/$�7�����4V5k��	)�j����]��rV��Q���"�˥�3����� ��TNNi>����� �|8�/q�ߓ2��l;��lJ;3������/skk;S�}!�{1�H�d��W�Y���emC����X��������(��-24H.�C�-���]H�+��Ng�$�<Q�2\bo��Q���N�L�F6�)�K�_N˒�æ�5�����Ы���*�uMC��A��� �4	&*�0��Fd�5����9��(b�����bKa%���4ʪ���w5�8i���v1�5Ū�w������t��m�� qP����0T
�j��	Η�k+/�[�w��$�}id�<���Ҹ�"�1G�5�R������T�?'2ƈ�ru�Q^iYJL��:��#����İ�r�I���r��F������[��cI��a�Fs�/qU 3��K�����(�6����ε�ڊ�w}��^�a���He�d�ė���=9�+6*h��k]�Қܒ��"> �R9��F�[[)Le��v����J�������hn{���tz��.?���I�W�n;�41P��J`�	��q�S-��i�2b�`%Y��������e�<��J���o\@qī{r��ez�_cz��D�o��o�N]�=@PCr�'�
� ��yR���iT���LN��z�̊?	M�����ηy9�	O�+�c{�������AHo��k��2:S����aa{�ep��I۸��@^����ܷ^b?H��x��Ԃ����~t�@�;�C���t��A2�sM�QA�D��#��*�rr�߳�]1$�V8q|��(�A�	 �K+}'�Eb�a�Y�B�X�O$Im�1�����p���|m̭����h�Ǒ��E�Ҹ1z6$�h>��'��|%�¬d�W�u��ǧ�����Ac�>��UtIzQ�1��	n��c�EM%�m�ֺ�!v�䩽4Z�dL?�ǂ��)��w�+�dӤ ����{(��M�JX��;r@�o\�I�5q�0k,��f��VU`L�����6���:�Q��}���k��	���O ���J�Ȇv�&����lr�oT��b8KֺWZ3�����k���qHIet���g�Fy&| \$Vd�|zP>�o���<ܦn�kn�'��	��|��O/䳨*��ၹ@��\8|�	#��[����$�j��2.*u��{h�%w\��\E�jXqG���$|�v~
����3��a���1�9���94_ųb�����t�~�V(��tK�|�KRч�ô�@���w�h�<N��5�M�d$EIXw8V�]��J?�������7�OP�o��_�βs'Ѥ����zƙ<�!�0�|2w��f��Ͽff��0� g�od!7�肠� �D,� ��
��P�_>���F�͝����D@�N�d���o��E90L����獼E���q��w!�AT&�Ь���#��Ra:���]�.a��tx�l�,�r�DD��x%� ��1t*st������%�(���F��:�MXۑ	��H ��k*�;R���ͷ���T^���mj~��aH�V�=�?�>v��YC�$��%���!��G�a�P7A��?��,D�X,T��r[$��,��E�Ӓ[ot����Fˏ�;m��8M+F���W�*d��D�^�������su#S�Ru�dmjJ:�
W�<�+��WJ5ŢC�=����#�vq6���ɺ�Bce)J�=����j���j0 V�P!h�	�������)L��?ދ��t:�,��C K��)��4%K-�� ���F֒�8bz�A 6�H

�*��'�>09��I���S`���%����Mw����bѡH��9oS�,����%��)�<��ڊ��
{ܑAߟ��)�xA�����S�R�Փ�
�Z�E)I��d�8��$�ӧ����#��7S�K�t�r�:~���:k�f����� �L2UI!4��w1?A�b٪Ehw��=�穋X�8���_�X��!w�����\�;����T*&��$�(�/�ky*�D#���fT�n��.-!=�H+�As��c���\�����ۡ���t���I���g�(>*~E�W�#}Vp�WsWwx�[���"��X�=�����!�3b�RU���x� �N�m�}���3	��&����]��R�=J��m������@xk�9��%�BvZr@r  �^ުe���`�/6��8�1*���,�va��)o�ܿ��) ̴����F`�{S�?��u���V�C�p@�KIy�8��ڣ0����/�/�������p�e�換���]��A-���y���y������fXa�t�k3�V����N�,;�b�l�@ҧ�����A݈E��6�}�ྨ�+䝂C�N�4��^II�� Д+�A��SC������`�������g��u���ݲ�xF����(P/\+��w]qTk�Mc4nN�^�Y��!�t�V$�抆�c����9y7'�D���fms��U�t2�Isd�##�%z�U@O\��'TU[�rp�Ӊ�7�1ˠŎEc����l2���\M� !��]Aޯ ��������*���jYgYE4 ���ѡ�D�F�K���g�����*V|V��E~�n�ޅ)����9��?��f�f�B�|Iw���d>�?�_oA���w��9"�g<E�&�-O��~�^�<0b�4�	�d1���zD��CD9�F�4*���J�˨)��L�	zI���zm,�j�n5�WDW�/;'#G$��ԡ��p�ģ1����;�G�5���S��!�	�Oo��}���!F�)j'�� �N%5{}Z�p�'��i��c�BL��͠N|�~I�#���s�������<J��(�sİ��՟-�-�;��b<��W4E��>�u-8K%����~%�;4�NM��e��)":_;��%Y����������ˣ6m@�-,���\{��4tTXP'J�w�Q�j�^т7ҿ�T�V�.P�����\���>�D�}	����e~6̪�UR>�Y���
�?B+P@m��=TɆ���+�1z���g!t�'�k�?���Ѧ��i~}�nǘګ5W_�c��إm6t4�p���Mҩ|�̓�'C��2Ă�g�&F��'`j�Q~��ViU�f�i��o4g�6��6U�nX
�k�4��X3�Y���L�q���h�^}۪-�.�	 ,l���J#4�ц ��T��۟��4��
g6ŰC�Z�@�^!�����`�� 0�$\=֯����F��T��(i~US����g	�p��\�^�2'�v�ňh>K
��Tϓ���u6Q�\zH~�ODkr���E%|��#O�I��{ɍ}�t�B���Ly�
M����&:^';��t�VZ�sv�T�2�8�?]~=��g\�`,�B�B�j��*~g=Q���)���=-v�xu�v�L� �i�f�%���߃��ZZLJ�C�"BԺIȆ��{�g��y��:b縡t"#̚�IJ������b�,p9%��?�Na��_�8���>/ �s��N�v@Z� D���a�&"t}A�:�a��G��5[�1�DrLI���EyiJ!�]��1$�?	����r$��Ge�.�.-�V�W�.�rF���zk-�Ro��	�E��F�6E�WCYz��+��{[�Ӟ%��[�<�8�ѣ��&K�ش����B��c�ʪ0��w���w���1�=N�G�y�����Q�u8en5�B�w@�t�^I��A�
������V�Jͭ]&�D��?�u�FiB���[�Q�]3����(��v�����s��j�60 A݈6�iVi�a�7l�29:�fN"e+�"�i0 �]�	�$���l��F`��Jڔ���|�ݎB�$��z�B���W��"�gEA;�SdZ��i�&MU���FK=��)CiK�!����C�������8RU3��5b�1��ߕ�/�7T���>��z'�K���u^�D�;��\�z��*ѭl�P
/�
�3��:������ۺU�4~��V�
[M3ŃA(ȼdr�4�Q(����y@�#G��v�c�ᱝW�8_H�Uuv���L��xD|�B9�3h��[l�'s/Ԍ������A�g�L�IP��v��\�}t*��h|�D�@��M"�aV>D��ͷ���bְr�O6M��	�P�CM�����TL�,2�zw� r��p��{�gi7|�%*��.I#J_��$��\�毰<B�!�m�l�V�jEz<{ymOS.{��d�o<�C��<��Z5[T�����7>��od�N�$����*{�|�z��,G�+�iP�����Q��.�-z��8��#0nO=���ԒPC͑�Γ_�&�}����58���>�Mh�T����0�ص�Y.�-ٷ�9�����T>�XsOw2؎Y@��D���=Rc���>`�%w�>J����ɴ �������Mk��q/�Y�#��&�X����&s��b������{a��d�%TnX=�,���%;i����y�>�p,���>cc۩nτ��Bza��H�ڗ�y!W8w�_������2�D�+�*�νچI�M���~tB�LsK,����Z������I�vmVd�b�Q,���ܡ��ӥ\솖�����C �i�_'��:��:�_�T���aC<.Y����0Tɴ� %g�M���  f�hu�I�Ϭ�I��>����F��_���:<L�j\/y%��i63�ƽhůL		&%���1���R��z�P�)s�-�~�X���ӊS�$I���p����EQL����f�p%���M^��o��ġ�����_�-
��4�ғޖ�2���!!d	r��"Y����?�D�Lp�u~�/��	Sqt�6� Q#�ꇓI��'�7i=>�o��y��Y�յͼQ���EtH���މfoC5{F��sM��P�̰g���x��T��l�a��s�{;�m߸�dp��y��5s�r���Dʢ��r+�=\�xҶ��2�xO��ȋ\��߶�].c������ w�v�R��Kq�*��@`�E�tk�Q$��'ݯii*�|�kN#	�UK�xY���2��(��-?.�!�0Vz��`�����!��A�0�>fc�^T���:ִ�H%�2[Pd�D��a�}l%�c�Bݡ-N�Ar�����]e�����W`6�����&Zz�3:_&w�$�T Gu��;���^(�� 
�B�b9!�c���*�m�Ѽ�i�C �@μXo�w�T���	á�ؕ_^g-e,���b�c ���7A*�@/i$�;Ӄt��m�<�;��1w����V!�8�7���e>���{�g�����Cua�z�� �Ĝ�
��>��뛟B�e�6O�>�*��0V�F������#㫀���}�Ͱ6�o@_;C�>p�\���8��P�hԖ�M���/�k{W�_�OT�e�5Ueǆ��
�.�HȪ�����J~E�X}�J�V�"Tq�[\��ؚɶ���8`
��x
�Gh�9f���Hx#@Q#�FM��f+�0~��<H �����"_�`�dJ����Ƒ��1Sol���(˒��M�F@918vIg`-�� �͌M����Bh6`f5��Q�9F����b�m�5L�NO ���ޛq��ll��f��%����ģ��MCZ�m$� ��a�
t�d��#�0�����*��?�^�L����#�>+2V� �>y���uM1o���=A�ػ:�(.ʖ�g�C ��[����/�@��֕b�+7�S��7���T(Ta4����J��%{�|R&,Z��:�Q_.x�#D��_�������
�,-�{��;z'~�䢠��D���dUL�AÊ�̞�Q��AɒC�2��Č2�]�p�%6�1�h��J�3x�SJ��;J �	1�x��sS����P�^�zx�r�G� �m���L4$0T� Ƅdh+�4A���z�ّ�x[�2� �s1��\�(����;y!�̊��U=��\4Ǌp�$G��#�&f2�V�Eɣ�:vj��M�M7���_}^�3#�H��|" ��[{�
�:�.��Q, ӢB4���/�8NT�����x���P�s*��i���T�������icr���/�"W���	ߴ�%�oC|�b��^��A��9��u+���=$���U�6kΙ����L�m����[۬�z/�����W��! 6�E��z�q�D����P���H��:u* �+��1�?�g�^�fs3ii��G�b���l)?'/�[r�X�;�нg����~x�ڌ����ώ�v�Fbf*�f�?R=�]G~k��eR��<�9�;���:a�7�F99q�-�ᠤOy���S��L;��G�Nr�����l9����-뛫g��x�����R*읥`�»�C �Y��@7�LԽP�"��y���o��(/�r+�5��Wi�*/��A<���d��~#c�P0��Q?[�%��X3�}��
��=�2���2�f5׿��:4U���[�H޼Z�Em�Vjf�臨)��~2�>����^�S���	�]����	ʾ��l:S���5O|�a%��hl�t1h<1 �1]�QV∙�ڄےdf|CH��"�jKCn�'�ʷ�n�Kw����� R��DEp�n��U�������Ͽ��V Q0����Ͱ*#c@��@�g���$Hsa܍<8�I��Ocl�`M�o�/{%������>g�غQ�ǁ���h[��m`t�ua��8Q⠎�BCA���6N�б�=~��b����ߩ�Y/�}I����/�L��o�u�V�����6H�W���� s�9�3������f������෵��������0q4~;]SY$\e����3����$��+��Q���nx���
l(���$W7՜�@[v�ѳ�9D���2 ��ih���)[�L;��&T��k+��
�9�~�����O�G�S�	<�T����77D�3����_�v'�u�nb2SDb��2#�J�r���� r\|�E
���D8=	��JјF�������Ɏ����S������g�����Jt� ���H�t~j+?�+\��s-�UWoSc��f	T��No���I[A��3�t��]&��,;��� ���/��,Y�ȶǈ�h\+x6���3#��k���Ro���N�D�N���9�������~������y�{�`�TtQ�����>B��j�B���%��ÂV0�\Rvi�3���`�?<��.=�@<!��_�D�ɠ�@��EKf��H1��0�k�x
؊k� :���h��d_�׾w^��������Jnk�m��Q�������7�~�z��S�&QJsL��ؙʥ��[�y2��X}=
�&���Ô P�8���2�˂���H6�up�E >#�S�3��>)���]nzUۈݨ��['����e���H�r�ː�������~�u���6}`CiW�	R��^s%Բ�M�I�h����ћ��n_9W��G4*SҪO�������:Ø���'��`f��Z6����> ��@���F�"�Y(J:��I�sm7B��=��e�$߬XF�q��#��ӓ:^�˥DD.��j!�݌��6UXtO�T�%��XWGC ���CM��3�_[~6�8Q�^+������w'纑Xa�3���G��s��,R"Hz"�հ�Z:��duK*��7Ŵ���EL�xs����-��X�S���1��=T/��Vn����IH*gԁ�,���������!z��{U�=��mB�]���2�H������W����C;q�e^(�dM�f���OӸ�RË@�v<�P0�M�xC��x��%�ʷ�a���V�1	��d�;���~S�	�"
��5���e~p(��ɧP��g ��J�[Oh�S���z�-�Z^�nN��v���WForge ChangeLog
===============

## 1.3.1 - 2022-03-29

### Fixes
- RFC 3447 and RFC 8017 allow for optional `DigestAlgorithm` `NULL` parameters
  for `sha*` algorithms and require `NULL` paramters for `md2` and `md5`
  algorithms.

## 1.3.0 - 2022-03-17

### Security
- Three RSA PKCS#1 v1.5 signature verification issues were reported by Moosa
  Yahyazadeh (moosa-yahyazadeh@uiowa.edu).
- **HIGH**: Leniency in checking `digestAlgorithm` structure can lead to
  signature forgery.
  - The code is lenient in checking the digest algorithm structure. This can
    allow a crafted structure that steals padding bytes and uses unchecked
    portion of the PKCS#1 encoded message to forge a signature when a low
    public exponent is being used. For more information, please see
    ["Bleichenbacher's RSA signature forgery based on implementation
    error"](https://mailarchive.ietf.org/arch/msg/openpgp/5rnE9ZRN1AokBVj3VqblGlP63QE/)
    by Hal Finney.
  - CVE ID: [CVE-2022-24771](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-24771)
  - GHSA ID: [GHSA-cfm4-qjh2-4765](https://github.com/digitalbazaar/forge/security/advisories/GHSA-cfm4-qjh2-4765)
- **HIGH**: Failing to check tailing garbage bytes can lead to signature
  forgery.
  - The code does not check for tailing garbage bytes after decoding a
    `DigestInfo` ASN.1 structure. This can allow padding bytes to be removed
    and garbage data added to forge a signature when a low public exponent is
    being used.  For more information, please see ["Bleichenbacher's RSA
    signature forgery based on implementation
    error"](https://mailarchive.ietf.org/arch/msg/openpgp/5rnE9ZRN1AokBVj3VqblGlP63QE/)
    by Hal Finney.
  - CVE ID: [CVE-2022-24772](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-24772)
  - GHSA ID: [GHSA-x4jg-mjrx-434g](https://github.com/digitalbazaar/forge/security/advisories/GHSA-x4jg-mjrx-434g)
- **MEDIUM**: Leniency in checking type octet.
  - `DigestInfo` is not properly checked for proper ASN.1 structure. This can
    lead to successful verification with signatures that contain invalid
    structures but a valid digest.
  - CVE ID: [CVE-2022-24773](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-24773)
  - GHSA ID: [GHSA-2r2c-g63r-vccr](https://github.com/digitalbazaar/forge/security/advisories/GHSA-2r2c-g63r-vccr)

### Fixed
- [asn1] Add fallback to pretty print invalid UTF8 data.
- [asn1] `fromDer` is now more strict and will default to ensuring all input
  bytes are parsed or throw an error. A new option `parseAllBytes` can disable
  this behavior.
  - **NOTE**: The previous behavior is being changed since it can lead to
    security issues with crafted inputs. It is possible that code doing custom
    DER parsing may need to adapt to this new behavior and optional flag.
- [rsa] Add and use a validator to check for proper structure of parsed ASN.1
  `RSASSA-PKCS-v1_5` `DigestInfo` data. Additionally check that the hash
  algorithm identifier is a known value from RFC 8017
  `PKCS1-v1-5DigestAlgorithms`. An invalid `DigestInfo` or algorithm identifier
  will now throw an error.
  - **NOTE**: The previous lenient behavior is being changed to be more strict
    since it could lead to security issues with crafted inputs. It is possible
    that code may have to handle the errors from these stricter checks.

### Added
- [oid] Added missing RFC 8017 PKCS1-v1-5DigestAlgorithms algorithm
  identifiers:
  - `1.2.840.113549.2.2` / `md2`
  - `2.16.840.1.101.3.4.2.4` / `sha224`
  - `2.16.840.1.101.3.4.2.5` / `sha512-224`
  - `2.16.840.1.101.3.4.2.6` / `sha512-256`

## 1.2.1 - 2022-01-11

### Fixed
- [tests]: Load entire module to improve top-level testing and coverage
  reporting.
- [log]: Refactor logging setup to avoid use of `URLSearchParams`.

## 1.2.0 - 2022-01-07

### Fixed
- [x509] 'Expected' and 'Actual' issuers were backwards in verification failure
  message.

### Added
- [oid,x509]: Added OID `1.3.14.3.2.29 / sha1WithRSASignature` for sha1 with
  RSA. Considered a deprecated equivalent to `1.2.840.113549.1.1.5 /
  sha1WithRSAEncryption`. See [discussion and
  links](https://github.com/digitalbazaar/forge/issues/825).

### Changed
- [x509]: Reduce duplicate code. Add helper function to create a signature
  digest given an signature algorithm OID. Add helper function to verify
  signatures.

## 1.1.0 - 2022-01-06

### Fixed
- [x509]: Correctly compute certificate issuer and subject hashes to match
  behavior of openssl.
- [pem]: Accept certificate requests with "NEW" in the label. "BEGIN NEW
  CERTIFICATE REQUEST" handled as "BEGIN CERTIFICATE REQUEST".

## 1.0.0 - 2022-01-04

### Notes
- **1.0.0**!
- This project is over a decade old! Time for a 1.0.0 release.
- The URL related changes may expose bugs in some of the networking related
  code (unrelated to the much wider used cryptography code). The automated and
  manual test coverage for this code is weak at best. Issues or patches to
  update the code or tests would be appreciated.

### Removed
- **SECURITY**, **BREAKING**: Remove `forge.debug` API. The API has the
  potential for prototype pollution. This API was only briefly used by the
  maintainers for internal project debug purposes and was never intended to be
  used with untrusted user inputs. This API was not documented or advertised
  and is being removed rather than fixed.
- **SECURITY**, **BREAKING**: Remove `forge.util.parseUrl()` (and
  `forge.http.parseUrl` alias) and use the [WHATWG URL
  Standard](https://url.spec.whatwg.org/). `URL` is supported by modern browers
  and modern Node.js. This change is needed to address URL parsing security
  issues. If `forge.util.parseUrl()` is used directly or through `forge.xhr` or
  `forge.http` APIs, and support is needed for environments without `URL`
  support, then a polyfill must be used.
- **BREAKING**: Remove `forge.task` API. This API was never used, documented,
  or advertised by the maintainers. If anyone was using this API and wishes to
  continue development it in other project, please let the maintainers know.
  Due to use in the test suite, a modified version is located in
  `tests/support/`.
- **BREAKING**: Remove `forge.util.makeLink`, `forge.util.makeRequest`,
  `forge.util.parseFragment`, `forge.util.getQueryVariables`. Replace with
  `URL`, `URLSearchParams`, and custom code as needed.

### Changed
- **BREAKING**: Increase supported Node.js version to 6.13.0 for URL support.
- **BREAKING**: Renamed `mast