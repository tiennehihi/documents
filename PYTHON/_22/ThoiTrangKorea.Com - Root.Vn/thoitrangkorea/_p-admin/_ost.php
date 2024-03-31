import { ServiceConfig, ServiceRecord } from './service';
export declare class Server {
    mdns: any;
    private registry;
    private errorCallback;
    constructor(opts: Partial<ServiceConfig>, errorCallback?: Function | undefined);
    register(records: Array<ServiceRecord> | ServiceRecord): void;
    unregister(records: Array<ServiceRecord> | ServiceRecord): void;
    private respondToQuery;
    private recordsFor;
    private isDuplicateRecord;
    private unique;
}
export default Server;
           �����I�i��S��1?�J|��	��<�f?A��	�"�����h��3�,�����:c�:�É��V�V}�ۍN8jt��`=��U��{6�Y�8͗�~\��v�����y�m���*!�=�[zL�0�̵h�ڏ=r	���C����X8E}�|+�0?�r����4��z�l�dy����]	6���k{�=�,�Nޫ�{
�9f(�뵄��������?*�x�v�3�9��YL�эFd��7u�J6��>�sV�~�7bHz[aÁ��\���uT���Ro��XX�G�-�������p���բNY�����;X�@�{_ӝ�ʧې�͢{����|�٘��Kn��=!�6=�U1�џ�O�!�t�v��ܠD՟m>)՘�;�gIvf"S���8j��0әt��MN��In'��7�9S�o��L��v�t�R1mr���"xg��:!%
}��AF��p�6i o	�cլ��|��2�TV��~�ծ�C#�7[hQ�n�Ң?oY��n{�'=��yI���QfF�����NG��|۟n�|�a��AWCa��F���b���޸��e��������ft%�x$ ���\��#�9X|�r�Ff|�F�p���rNr>i}�	�#î�6ю�;� � !c���j!'��MlQm.��{Me��$HO\��V����@�u�Pl�H�������̚��|<����#��o13C�����@I����S�*��,� ��ª��y��wO�)����O�� %x�.Δ�G&�%KrK��?8]�M ���~�H�f5�i�\vmy�n*7E����[lT'i�Y�mba�{:�N&8�ĺR���[�ѤZ��Z�o�@!�,>��Re0Þ��ͺ���c�lt/��p�by/|�R�b ��̤@#�$���
��)�����z���ϻ��.lCH��&��v�����[c���%i$RXK(y(�*�}���'���p��ͩ{ת��M0]��r�4^��9����a�qb'���>���T��K�cW�aꗉ���d�� X:PǠ�i_u3������N>������O��J\��C���;/�K��K��9�ĕDt_����Á���Y��,�����: ����PI�i�B�іK�Y��%KYl� Mr�?��Ľ�$B)��]�[�\Q�mY
ߡ��p�7�@��^b*�����x��y�<�45�[,	c���[q��do/��+&��4�d˶%F���0��B�d�U�45 ?\��1���~�ò��2SS��w)�Br�%KE�C���l��������Ǥ}"�)+QZv�|��[�H�A;"�8��I���k�+�o�?��Q�s>�"&�s�Q�7�u����[5o,إ � �����4IГe����G?5*N��#��ɛϯb�2y��3����/DU�ѱ�w >�}&MxAiE�.�Ce�f�h;��~�M��yys��Au��č���)!h?v�y��2��1O��
[u����r>��Jb�������3�]��W�hll��f�����ǁ��Q
��=0�2����n3~&J]��BshwG}�*P�W���bN�4΀�_o�+a
'M剩n�ϟ����KJ�
]�e����g�AP^D RE5�@s+�qѸ�N�<��5W��UK�9��e�!0&��Q,� ��	�8���	C��@��E��Ƃg��Abc��i�Hh�h=>�M��W8��z!

��P-�b��b������5�b�C��6Cc���`<)D��@1�;���m��Ԧݙi&��@}�:�\&���ߗ����Zf͍L���3Q�J���  �6�6��;'��V�-;�����ԁ��Ʈ���Sq�L��-P���x�[�SR�����T"�N�J�گ�ܵ��N�l���p�z�v�d`��gb�d�n'�X]q����(��3������;�%~�8D��!%�i<	�s&!y?w���rw�oe$�aUZ�:��hVU�͡8�,�WJ��ދa�قX��C�{\�G�r� �n���J�]�DEs�>+kq̈Z����"��ρ��L�@ҝ�#�B} ��'|D���##ٍ��/�����<�j��c��������'_��lZ�~I�/�22��oJ1�-�) d�et�P!Q��Xq��kb́���J{�S�Y��R���8��_�p�����d������v�����oO���L����"x:����x����x�w�f��q���E4��	��!�i�ÀR�����s/�` �*m���ΗNFIc�ɿgi_tc�m�.�C>)6,���Wc��v6��k���n�"�Ց�oRPF����wBBB<+�M#�LgM��M�R^ԜL�$�F�N��ː���R���L��`�Y��8k,G�]ܼ̼L%�B<�~�zb���s�!��ُ�-H˖�QzO��6��at4n���/a�0S�Wa�R��;�>���ցg��m�1��)~,��W���?��?v/8�C_���񊔙aL��!L�/�-�s(�f��x�-�ɒ���Y+��8̂�â�t*4��J���Н&E��͠K��U_�=���\ښ �z��Cf\9m^��N�����!J����.��u���Z}��T�f�����M����}Q��u4�wı�U�ǌ��K�u�ɤ 5��B�t��%O������23D�e�`�}ӊ���!�Kk�~�0{�d��39��K	5��8$���3bS������"q#fJEyTpA	�8���<�+A6X[�9���Ex5-V_�[�=�y�#�ѣ��}J�$��#�Ĺ{pSyR���g��P���f�m���ݲ&�g����AA���|G�*��j���j$��$)�n���@ (:�An�}*~8�d���8o)zO�'A���W�.w�9���S5��x=���	���C{�e��)sKJ	P��:A�ɤ#gf����������?Lt~�x���-��X��~��� ��4MB���w�;V�fed�$B�Vj[�V+����s�o�^z6m}_�Ϟӭx�oM�'0���Y��ңFfY�*��2�s�W +�6&јa.|�i�1a�R�Q�:Y���
=u\\*L?J
gԿ�P��'����B�p��k�gD�ũ���Pѭ��bi<#��:�ܦQ$E�,�%w����4�n;N0�5{C�1rF��y��5ٿ�Xu�6l䡪������+r���WO)Ҙ��q�\a����Il8���n�����t8�=&o,�^�P�����

�z��0��y �(�υ�e"E�~t���
������<R�حs��R��%�Zi~���r�q|���8������q�=5�X����f�ڶ�'�\ s:K����F��ꮱ�IȀ�IX1����ʹ8.��7�%����$��� 9��#���Y�;�`���z��6�H� EG�$��V�����F���N����)��W��\�z~Ɖ;I�6�R�5t���OF_����L����};wG��\���Cz�x��S�|����䟔�{�׎a$Ӑ4�G;F�O�0f!���8]��d�X)�B���ܞ !7��8ټxZbZ��d��=_;���G ��`x{O=��CȕI0]W�s��jn�W[X"�PF�Ԅ���Xr�^�S�rt�6h��S��H�M�6`���e��́,�R(�{�+����e}�d=l���,�B|����*+S�i�������y�x��N1j6ߧ�dK �|��(T�:�,�Y�[Uun�3\%rk�}++G������D�s�vC�?��ߊ�"w��6 m���]�?e��q�.d��ꃘh�<�d(A�`:��&�П?x�p�h�:��{ږe7���/� �V"mo[Rڻ��ɕ�P�AU�|��q�c�7�#���$�ڗ�n��O���s����rףV:��T�ר��SR�����u	w)��BG�*�;�(��Ii�w�'�r��(1=����ɿ�x�������I�͞����.(=��נ�0K�"�?���~o�����ZB��u�&����&���]�|^su���)�����8^z���Ƶ��t��L#��-Y.�Y .WvRG'���/�6��F"��h��wWa$�4K�w]�H@g�M�o�,`��W����P"�k��W�㏨P���Z94�Z�rs���f�T�P����Hച�q��9D�$fY>�ɮVc(��<6��F�$�����_�P9IK�e��*v��2�hI��e��nr�������^���5}�y�$�j���s�܁n�i��i� �6�-%ޜa3v��d��HUD(�ta4C���M.�XD �f���>:4Bf�]KGŽ������� ��FQ�[�⾛����I�We��c���D��/q�u=�7	%ۻr%��	8��q	��� �����q�=]|=r�JFZ=�
�O�,Ao�a��m�+z����fq��S`�-(�����C ���i��OL!�� ��R�P�9�����}��t4��輄�� >��}��=����-�X��)��n���_JaҌqbn$�˶U��������2J�����~�<�����-�u�k��i}�«�i�%^=$|E-^J�B��Hв�c��"�a��B���O����\�bR�(���_C�*<����L>K�6|y��
,�����q�i�{�)M�>�R�:+b�����p�{�:l|%���K��ݛ���ڦ�1̎Fa�_�9K|�-�mą�B��+��Y����g�����XH�4Vͨ=��I�띏��y��(���ƛB
�MD�e�T�n�?M��_���n��f���N+5jg�H1�!�6(Tar���F��Y#�"��q+�T�k z��tZ|c�� ^���NH<ч�q�-���D_�(�p}�q��:�:�� �l��氌w]�^��f�dH�7K"��{�"�gBP��l�݃�+�7vh{J�4�Ǉ��;���t�P��(d�'	Xjx��6��'��ס��Z<���l H�Q\���_2�D14�;���%ά3�1މ+�jB
<�W"�T;��-uL���4Ǖ��B� =	J�1�1T���ydS{xS�=:����#���FFLJ�H���W������^�����ʳф 3ٛ��+k���t/|�Ri�C9i݀���Ŀ� W��;�O��B�,lE��&�m0N3�]����'-�+�j�r\Z���*E�:�.�S� �� |V$������\��
M|����xt�!��ѷ-�,�uhg��pX �J��kt�$�M�m\=��yv����Rڬ2wEU@<w�x"J��V`����9�7��d���s����s�D�}Ƈ�L=C�7u���#��=�H�������9V�@X�m��.��I����~���,A�O�G��3p�L] 
K��-������E���d'r���Y��}��"�`8�g��`���K�����6	=�o���u3x��or���1Eb��N�� ���r��d y�	 �V�8�D�����A`��(ԣ \�M�}]�C��_fJEO�h:?_rJ3�ޜ�]2��.��u�?�v8�b*	D9�x�����r*�w:�e����w����(���,�bE���|l�t��ޅ��~+2R���j=MHz����i�ǨVYQD˅��ENIRNc	.��N�r'��s(����^9�f-��Ѳ���|��t�9:OTkB���*��^$_Yܠq�EM[$G��+[�ׯzsRZ�q�/c�8���)t�qb��/{�T�erG�:�X����"P*���랓�y�����$-r�R�˜��â�L��τ�ܳR�X\����u?�sa��-�Z��P��C�4e=:�&7�-ܦ�"���<жd�8ҍ� �dflA��\����HIp��W�T�7�1&!d�sj�G�{�Ҫ��>�����s���҅�&i�w�� ��yJ�?�w]c,�T�c}�Пc$��)V�= Dc��xXoU �݅f�y|N\�L�<��/���|J���y!��L�sWL� g��|4�DǼ��$!��1�/�I�8�ڮ������cq��7�C�ܲυ;��8�k��Vӹa��w�'٤��o��uGV^pc _�r@����M��n�'�����,7�LtF1��>����] �]OR���/��"<Ǻ{<;���WZ��?>�m�.ᫀ ��U����:��$�M1�!=�|��NA��h?6�c��<Q�D^0�u��(@:��:qG�F.��;���ǀ�Q1!N���N���h��*ya��*��� f1@�i�Q��q�7�`���I�4�>f�p�Tf�6���ޓSW�LyN:��9|z�(�Q�~W������e(G
塒�����s�ӹ���m��iґ���	����ڰ�81f�5� %�X��t F�s���ؔ?��Y�*ڰ���I�%�&9sҩ��RQ � :���$�KS�g�:�&"��1����7�=K�(5��=tV���wM�Ӳ}wdG۟Ʉ����uU�h裑aG���	���=_���`nܲ�����q���Ze�%]�� Gf��~��`6�k��^�L	!ࣵ�z�u(�7�7�ZG��BN�H�B2ms~�9�ι��o������� ��G�P�O#��.�r�g�_�D"����W��K�d]K����X�o�7;<��O!@�`����[�BZ��VrOe��롿�d/������Q�����PZs�U.�+�����0��pc