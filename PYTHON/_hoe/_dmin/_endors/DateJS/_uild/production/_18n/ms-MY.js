{
  "type": "object",
  "additionalProperties": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "syntax": {
        "type": "string"
      },
      "groups": {
        "type": "array",
        "minitems": 1,
        "uniqueItems": true,
        "items": {
          "$ref": "definitions.json#/groupList"
        }
      },
      "status": {
        "enum": [
          "standard",
          "nonstandard",
          "experimental"
        ]
      },
      "mdn_url": {
        "type": "string",
        "pattern": "^https://developer.mozilla.org/docs/Web/CSS/"
      }
    },
    "required": [
      "syntax",
      "groups",
      "status"
    ]
  }
}
                                                                                                                                                                                                                                                                                                                                              �gl��
�2{-K���qPS�*`,�j�6J���ש{�pb��r�O�|���s=7�Ѷ~��	"-��-����]�V��edsO�v���G���!_u��H���W�F~�'��Q\���E{wHu�;�|�~�K�B�		xB&hB���1}'��8�~�,G3@�І��1d��u�sq�d,��	�`q3�y�zU1d'� DE,v����zw^�����b-�ν��j��"�Ḽ[�i�嘳J#A�gT%{ j+6�Y��H�|�,�$�,�`m�UPڭ"̬�=�r5�Հ.������n�Gc�y�~�6����6q�?�l�#Nw�YN
��C��x8�QZI�#nqxyZ�O��F�%���[���"�z��<m�fh��}=FFH7E<�M�?p �(a��6Q)i��vׄMN�X6�T��P�j���O�d!�i�j�z�۶�=1���@��3p1�9x���8O�r�	p:����k�:�k����&k�'��?!��۠eo|�U Ǌij["V�{Au��k��?�&�8\����<B�h���1����[l�R�*N[Y=��N'�����]���3���q�� ��BE��q�`$����7߲��ޡ�x<�&fҴ˨g'���9�1�S���sϘ/%֛��� _o�etTT���ժ�ժ�1M�E��20n��Խ6�Do�f/�����C���Be*��RfB��hKF�w r8�k���Y��(y=Ѽ��*���L�GZy}�{X���mbZF�w��<dh^�W����e�����ͩ��]'��3�U��>�	iv�1���
s�c	�h�0��N��T�M\�D�U�i�ɵ h&��E�i.�uk��t�r0� "������Z-��ӗ%��%
�� >�p��	@x�(L~���ǡ�-��r=��Cf�@��峒Zt��{����@��pE$&u .A��q/M�~�5������J]M�<�ZZ��7WѦ����J�g%��?2�Y���䩄���`�2'$�yGQ�=M'�[��n��vh���8
���#�#s;ں�D؏f�v" ¤�,e�c+P�#7�Ҝ0:��s��q���K�n'k!P�E*V�~K��(��T٠�T�M��`��ݭ�&��9��Df��0�40�����g�������Ak�Wܸ�lB�E)^�\�6I�@�0*^�� s4D�!����U(o�F��3�lu}'��u�4�0G��*�N�	m7�Z�Ҳ��V:��5����$��
���D���6|���֭/��V�)����:~�yX`���n��Ð��h�fJ��>���0���LرO.�Q'B�r��&�5x�>ϛM��6{��=2Ģ�#��)s({T��8Qj/h	ލ�D��`#��EA��4���D+H]��JOb���uX��A<߰俙��0�5K�?����1�!бyDOjMR��QZS�2���/��y���s�?J�	s��ك�4v�w GcA� ���NR�E���q�Of����O?rL��Qc� �a�E�#��q����V�q$U��j��k�٠w4?��ԂϬK�Q���Ϭe��h����Ol��L4y�Ԥ��q�����'�"Ox��͡�|�#�_�*u�6D��Q%,>�����9+�鸨�B�0�9���9�u�f�!\����R�i�E4[�˙��sP]�r_�D" %�Q�%L����]1qX�o��?'0�'<D�����Xc��$�0�H�/��ٟ�Ï��g����'4l����5�0�B+y����X���@��k:�i?�#��;� �DSTqYP��V݇;���~e��R a�<�<�T�|!n=�}x:b�ǧ%����^H>��c�90u=:�Af��2��n ܯս)B�����s�n�0�O�o�9�����q;��vHM϶��X�9��	Cc�y"��á���'�|�kv��5��F�Q�՗H���b���d��V�Nb�$C�J)&k5txN8 㱖8G3a�a����8b_~��O�m�`Vf.d�RuU2��j��
C��Cid���H��ʑLQ�tW�i��Z�濰}�=��:�T耦I����Et�Ե	���¶�L۽�	���Ӽ	��!�u��D����,a�7������&!W��o���@^
�ˠ��As��׃WODLxX�@ef���i��.HB.�E��Ӏ�z�q��&��:N�j�EB�|�6�F���j5'��e����>�����>�� ��ɗ^�?�ȼ��F?�_���,�KW�Lخ�`l��yEW��Mt�Laֳ6�V���Q:�lbNq�6t�@8^��p�_����O\6�����m�,��Y�es�#��uu؅�5ֲ�5�ɐי��n��"��Ewi���F�oX�7mD�w֝LO�d\|��J����̾�j;����n���<"�/"��,["�����Q���/�}�V��⭄J�:��bw|.�O�EtXݱ���D|�`~
0�wPǢ�	��\"�>����~��@�CG�~�r��_���b��*�>��A1_����T�����-x���c`9��ǂX�'��ꛡ�j��t�l���c��˭E����o@�������5lsj��H�V��.�߯�\���[k�{��$�^"�~'�ڮF�~5�k��:��r���(�,�g����V�%�)�A��Н@?D�x�X��׭��E<q!O�ncS@���Ӫz&#z�LA��=P^hk5�|��`5����h��g��O�3��=.�3֤�D?�׷D��͚���1���@�BθK�"LM��7%��w�yb�,?��ÀVCz�}�I��A�e�iwb	�1��#�D��/���ِ/0��:�"�.n|kn��z�A2ω��"�'���s�	�>��B�',���c�/zbȪ����%i�-8C(�y����zV�����Ga����sm~lW��k�q��D�	v��.fX��8g���.-�VJJ�:���o"c�h�6ūc5a��Bx������~*,�ɋ�&�Hؾ'���C4g1-Bh�n�	�s�p7�.ї%��q?�ҸQv!�!�k� ��T�4���p��\���'V�-0�+Z�pdp)��㣀;a�Y��HH���4�z�Hcj��!:�k��K��q���U1u˵��fM1��(P�C.�2γ��z9�e(<i�	�7`����G �w"d0���e�Lr�)U�!��A��þ��O�D<� {}NO ~���!�]��1ޛ ~��O>F��k�)1�Z��b�V2P�V�G��L�z~��\sե[��[�c����)-��SZ؟ެ����C�Y�þ��.��/�<$^��災 ,������o����gG��G���Tc�+�ؽ��CLrb����s˗'ڣ��v��~�aِ��E���u��U�7Xhm>��>RCj���s[s���#3��ݺ�\�@�E�M��$f�ǔ�l"\��D�� i��`�w�z8[�E�O/D�7k�C̓ct�{�R ˤra
�e�R�k��=�*��2�� /F`�w"��D�\ę��)�<�'g+�0�d����iI��<��dsy�k<��A����Mf;Y��=jk��I���jVc�+�uf�jͶ�S����ĘF��8u����EB�քJ*���v�J�"ն��ʉ�浄͵��x,&����G%3�G�⡖��ɪFw��2��D[���� ���T��n�K�~��T�mM�`vг�"�g_A-7�>R��̹ǎa�8�u��#��w��#:�����j5�r���67N�k��>��MLHi;����0���َl�=��Z��:n{��r�i7TY�p��T�o�U�rS�2����0��]=������ʹ|Q�S�r-^�6�����hyL�'"��r��5�1�#�86Ȣ����<��֛��X���zOP���UH�w=A�m�"'�)�Or3ڼ�b7��7359���
L��z�R�:�u����J���e�{9�&op�5.[�:������%�k��W��U�G5�f������ɔ~����+V��5�x�V�(Ō�,���Fs^���Y�[�4�D;��j���;�~��|�� E˂g�Nx�v����0uxZ��VC��b�E���)C.� �Q7�c��qn�Edj�����(��z-��\_�g
�f��D��2
����7B�P~;��jG�����\�SA<].�r�э�����i��Y����Z**'��a�k 96q%DLe:b*/㜸6
��5��T��~���駱�l�猀�����kl�:�	Q�7s�nI��8�c_ū^cu�V�q�ûA����r�/��@}�RPGz�J��	!�