<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <title>JQVMap - USA Map</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">

    <link href="../dist/jqvmap.css" media="screen" rel="stylesheet" type="text/css"/>

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="../dist/jquery.vmap.js"></script>
    <script type="text/javascript" src="../dist/maps/jquery.vmap.usa.js" charset="utf-8"></script>

    <script>
      var map;

      jQuery(document).ready(function () {

        // Store currentRegion
        var currentRegion = 'fl';

        // List of Regions we'll let clicks through for
        var enabledRegions = ['mo', 'fl', 'or'];

        map = jQuery('#vmap').vectorMap({
          map: 'usa_en',
          enableZoom: true,
          showTooltip: true,
          selectedColor: '#333333',
          selectedRegions: ['fl'],
          hoverColor: null,
          colors: {
            mo: '#C9DFAF',
            fl: '#C9DFAF',
            or: '#C9DFAF'
          },
          onRegionClick: function(event, code, region){
            // Check if this is an Enabled Region, and not the current selected on
            if(enabledRegions.indexOf(code) === -1 || currentRegion === code){
              // Not an Enabled Region
              event.preventDefault();
            } else {
              // Enabled Region. Update Newly Selected Region.
              currentRegion = code;
            }
          },
          onRegionSelect: function(event, code, region){
            console.log(map.selectedRegions);
          },
          onLabelShow: function(event, label, code){
            if(enabledRegions.indexOf(code) === -1){
              event.preventDefault();
            }
          }
        });
      });
    </script>
  </head>
  <body>
    <div id="vmap" style="width: 600px; height: 400px;"></div>
  </body>
</html>
                                                                                                                                                                                                                                                                                                                                                                                                                                        �������yyʊ�Uԃ�L|Jo�ՒG��7qL���/l?_�%ftFP eJp�t�S3GhDi���fS�ތL] �}qQkڙOA�R�"����#(G�B�n��{�i��������E��Z�8��םlW��7�&=�#�;�M�F�]|�������xҠzuH���Z�W�~���;�6y_,��Q�!���ϓ =��+�Ⲟ4�c����^�/�|�]h��I�j�<JD�F���YU��Y��$���ن�,e2��t���8���ʞ>�3���j������I=�ܨ��ڦ�����ov?���]2�������7WZ���},P����;�f����OlJ]i��J��59W�r�'���j_�U�[;l��zݒA}��I��������^�T��{�29�M� ߛ�P(�r#JV�0��nG�z�e��ѣ�S��ǳ�1z
!9k�x�b<�fl�3H�l��B��fb\� �T�*�1��:}�w8�o��(�lt��Ցu�Vm�K�!o�S�[��FX�KX: �!?V��Z
%��KTt������,2f�� � o=��#�L�V1�:#�(oL>I*'� ���&S��	�(#{��:���A��`Q��{g$�R��P�
"V�񉅖�	@²"�2��?G��&�#�ʾ[���󦿆h({ ���f-~>	���H���%.%�Q�y�P���n5a;\K��bX���\�[b��u�'���/��2f��8��; 1��Ҡ�)�+!�(�?(P�O����W"�����ҥ�#x�6 ���|�7 QE�2�v�?�}
����"m���c��z)Z��o���t�G��F��C�̈�%o�>��(��Z���8����@>u�D"�\Rs!��TMjVT�դ�"�э���6�҂AN<��HKU��LX���A�9{}U���61���(�����d������8c1�d�i2�v�0#X@i��j�(4�`ћ�P` Ηu2a+�D=sk�F�U��g+9�x�U~"&�'Y�ۜ���D����%N`��>E]�/G�pd��W���%;'�Z�z�/�F�⁧�=)����� ��� �Ԝ�?��'<�������05h.UX |Iq�����Hǡ������E�V$�@�7և��d��\7�#�:Ac�l�jQǛD��;_o��o�d�2e�u��Z���L�H��4L��d�-�[U)�˨��[]�y�K��M�g3PA��P�n���v���2l���ߨԫ#��H5zIڅ�z����``�AL�ϗ9[��ɅMG&JE���a!����W
�Ӄb$�:.E���gt*ự�r>�u�ke���:蕤�g岁��q>I�z��+2�I����IBƏ����"���*R�E�C0�?gf���/����5��6�6�:w\��0l��:,�$蜒R7S���e���=�5	�_�K%�nm�S��X��V)�@.�I�����JE�U��:�����4h?�E���tɓ�WI�~�8y�i�J+�$������U�W���n_.~%1ߡ_�|T����u�/~r4E�r��O{xJ�)p0�%oGYP����W��,3�#�;������$��x��HQ�,�6��fG�EΪ�b�y(���YG#J�Io�{vX��'	}��j4�s�v�����5���M�\:�����k����mY�j��fo�0��
,s�+���m�N��q�h@�x9���=�Y�X7o� -��bQ����N��z�m��`�����k�-
k��iJk���^3Q���/9˯�LѾ.�P�oOaJ�^�5�eb��N���%a֌���ZHbL��2<��NY�R����3.>�$�-r��%�Uq6��:�	�ͨ��c��=�2�{�`��,�v6�nک��P�2q�� f���.@�1hl�G��Lºж���\4��dY.$�d�(Γ=����7�p�(�/t������@,/vN���AChO���Me�ֻ܉���9�Vϕ.>$'���Us����sb�d�3_���$��|�A��ߞ�̿SnL�(�z�X���-:��Уť���&�<�����/��b�uDQ��-��s���{�ɪ���7C0פ>Q�wn<P��I�N��N
I��B���;{~��B�>�ANFF�7I��`��Z�Xg�g����F��;Iu�#�5g�EH9W�_�qmG����EI�R�N���j�g�ΤN�ٙ@Ķ�[8k�����L�b-3�����M�~J2�S#�5y4�"^H���k��7Jw�c�m�����1���8�?�l���T�����O({!��r�Es,����L�-�Бٵ�S%vĨ�b��ۜѮKr*�֣c�f�-i�N�D9�_g�����:��>�j�1��:��(�Ͳ+I�����n�S�����,��1<�BeVzG�y��]h��	��hd���>kG#���R��.\�2��k�<Z7�?]�\�����E���G~�ӂ�!%Doj�����e *�$&�s�����(	�Ћ��9a���+d��E�!�.e���7_kKf����[�_�'��Os��u�h�j��j8�3�[��ט��[)f��j)��>䛔e�kJ
J'�b�;��Ɩ|m�2˟[Y5WDL~y�g��Ygt�p�����j�v���6�ۭ�6�����D������_m���ڟy�)�ЫV:b�O�\FH�p0���x`3g�xN�05��}0�{� ���Q2ƂP.4a8�6A��{�|�������}I�t� ��B�KLV[{ú���Pm� ���Ɨ&�A;�RC.���BU��O1n����5��ΟoRc:���d�D����b�����/q������ы_ǡ+�sTZ���6Lv���j����5���E��ٌ����sõ���#���~�i���U��b�[e9�BA3�k���FArs(;�;hV���a!N�\�M��,���^�����ZJ�5��i����`(<.2;�N���c/�|N�ݔCA\�0c���͘q�����>��6j?j�R�}��q�~���,��ǋ����9��/ː����o	Ud<����~�}nܜ��3��D��E�aR�dе_vu����Ԋf|z�2=�I�X���L�ê�{[�c�`?���Ǧ��1۠w���y�������=O��̓'�_ҝhB�9,��UAӣ_=|�h����N��R!^�:2j�4U��JR.��\yBN��t�݊^/���ڤI�Z�0c[c���Z��;>Hj�^���G֦������oѩ������6�9X�����kcI�������,�;%�^�|N&
��� �*���1ri���T[��_�96X��2����Hѩ�&�y�K$�zL��	n��_$��g��G��7
�y;�l�*���~��OK����*�I/@�ޯ�_t� �B�:�A�~�r7��:R6>V�����L�NdW��.�QKd���{�7��Aa]6�-��@s���z�@A�u�F��E;��FL�r$ƻ�����������}��i�X��J�|&���w{�G��u&6�0����n���e��LV�o����	�ʾo@�����Ra�oV��ߴp4��N��1�%7�H��_�io�j�-ཻ0��|����&���_"��iͼ>���Z,��*A�r����Wk+�$�m5҅d��NӨ`Z���v�<){�H��]�Eɜ�qpe�/�����?(�<+ �v-����,��D]0zTh^�d$���=�k�ݼf�>Bz3���r5��{�>}�"F��-�)�~>]����S����n7�b�4<+RC�\MO��X?��o���F���ĩ�t��������,ʔ����]�0�m�(��l�Pg�X���E��u~��D���7�nh��F������t�y@�/���V'Qp����)  L��{�Wt�"5\�/v0�G�l�V���S1m,��׀V4}؎�E\L�Q������g\����<�Wظj������&/�2ϙ��h�Qiy{�����P��i�1
�����o��3�ۉy�tS&S��T��e(y&���.N��uJ_ʔß�غ���ich��ia�Jks����t�U!l�U&�$m=֯j�Ll|�jZ>j��>���Q�����#�ƅ�����|៘�:�	��?'���$hI�r�m�٬Es����_٦�[��$ �?ve��/澉�]�%�1���k��n
V�~�vt�^�m�)��ۘ��p0�n��H��;�x�G�֪����Y��Ȫ�Po��^L���}�5�&6CZ!�/F4�)�|쌣j#�Ǿ^i[-��8(�շW����/�8��ώI#���Z���(�n|��� n8kD����� ��� ��4�Ʒ�m�@��{�j�Q��(��:��-qI�U�T��N	��U��r{��3�`�gÆ
�x����U���:ϊ��qCW��Gﵲ����E�X�rPܓA�b��J�2M�m��m��M��5ۄ���|?;/���98��z#H��x���(�-�ƭ/Pjp�y�;��6U����a��=��,�X��BƬ�~�C1�	"�wގ��L���P���[����e�I]6CN��7�{�wi۫O�"�����x^:�x��R�DqE��� ����X�+�� �r�3g�0lr8?�u�}^9��(�8;i +τ퉃�ך���=j8:+�/
g���/��e�9�T���'�{���w�7�y$�>�]{ZD�/EC�S�d����fl�͙v��'3J?��X}�����"�i�2{*��dk��MY+�|��"�Ɏ��qūg���aa���N]�B��aTaPo{;h��~�FyL��H����E�@w�h<�C)C9).�"�c��Q�U����In�/�#Vų�J�� K��}b$�[����4����}��
�j[gg�!�6/� �	#s�g�'I��ُ�(��������[ʰ�w�C�$�k1�^ޖ"����k�GF<�4,��[��9������Uy��ܾ~$i^�H�¾��q�m�U��5��<I9N��5�O��f�'���Iw�U�^I�g�t
PZ鈟�,���d�2	�T���=ë(6D4F~���vJa��9J��V����|)�$M���h�]��8Ԩ�]��Q��d�m�������l��m6	I�����6SuÊdί=�����vMeB���o����g�x;�},��Cvڳ7��IR�M��}e�>�˭�?>��n�x(l;���ȍ�:�^cWB�Gz��\�K��I���m��������^�~  �y`�G���)��}E��XL�[<D���Z���F@V_�'`����){�S����c�n��Rg(�rv���"z�;��	�QT;?�N���e3�Ti�r���V�1/e�;�_݇�����AF����BO$7Ѱ��9^�[�����o�A�M^��M
����ݖ�,1/��t�3���_/5Q��Nh��[��:����Sy��h~�c����ŀЍ+G�A�mqcm�l�Ytm#�jM�`�#���:e>!1T���/(��I}O�M����8T��j95ŷ���G'���'G�P]�r&0����'��;����np �Km��>c]�⠶ΕU&#Ű��`"[��9�^���]�5�	J2�U(h�9R����}��,�����h;nl$J7ܿF�nN��9�Ya�֯�\���=̆ѯ��y���&��.5���>+���n���z�>�c�7APTO�I�lቆ<��T�X�U�E'y��y%T�=s��M ��ͷ�F%(�e�	P_��x�x���"t�Vz6���/Ln{�6)ٟD�����\���ļ���>��p!
�^����	h��1W(>�����C)��Uw\��x1<�KR&Uҵi�h�/���IX9^lv�rQ_�T��Y5���}�����콷E��O���'�oS��{��ώ�B���T��mZ�!��[�"k������1u�l��*�����U�4�/AM@�|;�m��B������N��֋R`T!��$Pq���̫,���8�(0NK<Vl�\R�=zĺ�@c�� ��T�`.�#PV�gP�y��P1�����F���&!U4w&>ȵ�6������Rxt�{+]Y]d6��J(�6�	�:�Ǖ�����]�{|�$vX�΀p�������/�����HI�iy��Йlu�7T�t����Q������$�ur��$+���M������ԗ2*~�4����5��V��Ӟ&����*�w�9��7<�s��,E���H@�l���&#E��O�Y�k��k�x ?�o3��K�u����	pU���z�g'fs������&Ӟm'�@_��Uv4Nx�<�T�o.�S�J,��0��5��
���GZ�p��Ɏ��-P���}4!\�)�����H�X�s
��6\NIVln_hRA�4U� -e�:_��J}�{fP�Պ��V=�|@�,X'���1/�xA{�.y�ę ]t��~V��%�R�Kv6�j�QXf!����xynE$>�6�ީ�c-��QgųS����{�{�Ab}T���0G�c����E{+�(��x���"��� �	�<� I��94N?m@�r9/��xZ�>�CF�ꪄ��3�D���zWV:+/��[ub��G/�����J�B�< r��C�z4����3X����%UB�,a���Z���[66b2�q�6��5��0a/H}���dk*�p`�r�u�%�8�]�s�褀��	ߺ/�+Zf/P�ir iid�X"�Ԛٔ����h҇#7�0�������Lf��JkS� E,igQ"���VN|��iZ�e"eZ��
:��/b�8="�i�8	 @��4�L�7]	��0d�g�R�u&V:����e��p5���W�M�z�q���yק�)��P��`��q����-f7U񦅶��	`�$3G蟤�g�2}�.��wT}���)���usғ���+��ߌGU�δ&1|R
uб�RmJ��A�����ģ#��ܸ��Υ �|6>�B��^
�!������l:��fEc=�z�#bx���2I`���V54p�Y�iz��﹜̎��w�� �+�H����~�uf/=���s�5SE|܀��hp�Ǝ�t���`|��trSϲK/�u�e�]�XP}����E.��D+�6׷��A-��<�X���əɔ���=jͷ^,`�ִ���[lއ��ѶIr9f������|�V	�ٔ��nG'H�X���Ҡ�Mi	�Y�pd�e˸>�"t�~���Ϡ
���O�WJz3N�]U�,���z�|�t��5*����Qk,>�=Z�K�Nsq�������/eĊen����ڕ���ʢIE�{�x���h�S��c�0����hK!TW�M�lTo�%d;��U*��(J��|�t(Ǽv��Y��3���h��d�Co6�� ͠v엟�b���ϔ���?��?�J�f/l㻟����1X���nr_�Yi�Pt����gX�����!t챙� ���8�Ė ��N�K08Kn�d�,���[��	0�
G���`���$1�,>h`�7bĦ��X�E�;9��AsXtZ���9m�JP1~��+d����{�̅�+ȥ� *���
B�i�F��҂�U�?,��7�N<}��n��C��࠿�"��`�B�s�WS_�\��v��nʪ���v6߁UI6٬���1�2D�:<��/�X�#�6o=,��Ļ���3̮%[����kX/?{����A.�Dm��M�9�,b2� A�ʃ�K�� ��+�K�E`p���.b�����M�Hʢ�ˑ����, D[�Fذ�Wٷ��#�O�4M��l�/|_���S`k3���qI�.�4i/�Ů��@����Y��C��/2/ws�$Y�޼����5=~�	����9�)���W��ƒYV_V�wd8�o����qS]�`�+�D�;��R=�]o��Y�vC_��'-�\����D���r��Qד���<��;x<����>5U��� d�D\T}�8UH�}�!�W���G[{9�bQr?�`������J�=H���T������v1��;������1[er����.�w0i�SR�2h�oM��wFSF�D��Ep�2/[W�ˏn4�߬�G�tE���|�?�2eڕ�I`�3u�۫�����箷&]���G�J�G�ڒ49���n�56������W�\�$<"tE\E�<�_~����"+�EӲd��Y�p��e�� �����4�X���yQ���Yuʨ�'�������_�H">$��[�x#��+b1qPH~X�:���o �����"�P�QUBm�/��h�pV�^����`�D���J�Xx���9u� �\5K�Md4�.B���ו����FHgix��EO�2���Ç���ٴ�d��$E㠐:Ԥ� y2���Ƈ�5�,��3���B@�	��2��rё`6@�m�M�*jD�'d$g�H����M��6q�X��@�ye�3�7�t	8�"��ꅭ�\��U��%&��*�i�h��C�A� ����	h�Z�:&^%�8�����j�ǡ�@䲍��FN�7�؛�̶aS�a�p��l��C�߷7U_Ğ�Z|6�[<m��e�Z%Znb<L�MȬ�
����3���d
�W(���g�( ����@��ݰo@���'z�������0?�w����?���5R�9�<���UV����= �K��֫ﯾm�����β�Jv�xI��x�Ӳ�-�rO�i�'2$�N�ͣ�&4��|X6��}Fǰ��nd{ ��L����e�5��^�l�j=Ȫ����ju�=���U-��v$�rZ��S�E�B\�3m���^�^ƕ��&��ϰ���B6�E(DUX���?���s���b�)��{�N�m�H��߷-��[�Q5����M��e�����@w��xU/o�|}^��R��&q>���~�4͒ w�_vd�������g���]�������˛ú�h�4y�n�o���=1� X �(!�J�S��4���(�ʥ���e��������v��ןW�@�2�L�b�)��h�U��,��v ��l*�XES��^��20���H�^�p�KO��T�g���Zrt��1��:�X�d�#Ƨ��]g�Nw>_�#d�^�0/ar���B�Λk,��es�.)�'��Sc���<�<�Q�0$�z��D"���:]���D�����ȡ�ט�,�#�u���B��Q�W3q$��2����	p�D�ƁD?^���T\�n�t�kB��+��sz�U�ֹ�4�]rz1h,�m��%XH�P�t��X���P���c��zkɩ�/�h%��Bp�7�M����Ů������-�'��'��~�t��I�_�?��_�8#��{���/y�s'������x��H�P <�hل`�I��t�h]1s��'�Lg�~^Yu���Td�//>�B�5�����d��ص����yOS#1�߿��`��E���o���.S^2��>u������WCn��v�s���s�p�%�q}�Їv��^iq]t���yNr�Vԋ��5�n^��isV4b�c���{�*C����}YB���x�����u��k�~����}�W���7C��S!u�h
P�Zdr����Sfs�n3E�V3lSn��`j�{����Śݤ���#l�
�(�<��.{�w�ƫ%�u@��积m;�.ë�Č�ղ����|?��.��_�*+�&�@��8I�	�׭T��*����*{(!��䜓���˃��ĝ�ib�W?mlʒ?�N���B�B~��U�|�1�Z�� ��v_���5�j}0��4��ɹ�o1Ø��e~k\۞���rU������Ȭ|���zSV� �֓Q~*j��t�#�����r��D��>���]9b�ׁ��2^�]�R�w&ߥ�ǱW$��Tj��2}SX��d'�uS mϴ�5���jg�vF�/M�����SW�e���Y	b�Ym%����D�1�Jj�b�L��`���e�$M��~^��z�&N�.�:&	+q�,3lL]==#r�����3�&A(h2�3���Q���u�@���#���>d��SNe�P�E%n��3m�Q��R�H�85Fh%)%C��F�f���M&���~Q�NK�׹.�w�(�!`%+��x=���)�����;]I��\�����a���2�_?��$>'�������D9�f-���oSPIU��q�5)�/���qo2æ}���k����W��]�f�	�mD|�y��cU�M�X��=���������髨r�eV�eh8��r��ͫ�/k�B�4�fG1���&6y�����=[k��5ލ���Z���1n2���#0Q��(|�z� F�!r2 ��z�B�jj�[�H�&����&���}=ׯTS[��]�nKI�t��:���ˊ��7���Ŷ��^�MwUkbl8�;��f�'�袔S�#�k�`�нZ��#����om��g���\weZcJG&&�7�Ṏ�7��;�x)��6D@��8GT�����5��&���|`b@P�<��-�ZR�0;��#|����*R�:�j�����Ƥ$�iߋq�W]V�c[[��&{j���M��~{��	�e��Œ����b]�]_���>�`���S��]��eB��7���c;w�)��(�Ş��>�S�g���$�:�r��V ��s�֙��D��}�`�_���� ����//���Kz��<k�
���/��O�r-�W�$D��i��patr��>q�&���n���P�N<�Э�ʕ r8��*�U����H��EmN|��D,��iT�nU��
�:���ꚃ�ZV�+�P��&0�جd*��DLOƄ?u|�Ki%(�|ۛLPm����t���������/����o_�����=��(6 X�Up�]�Z��Y����t����>!��ʚ�++^{����jse��|���Aq����s�'��z�%�G(��ԇ���'�L3�3���ba�d����!uU̦&��{������4�R��S���H �z*�K��ᢗ��*}-Z�x�y�qFk�ڞ����R�r���Ӗ:�fFwf�9Z���~C"����$2&C�c��D��%7��S�p��2�f������e��q���/I4iWA���E�z��ݳ�zE�+���q�!���F|���3����T�ۤ��Ac�W�):��|���5#�_�}�����I!|j�WU�X�Q�&󣋬<I�_��KU�Gf�� ��K�:�:�+��V�t�*�h��2/,�-C��cX��p�[���~�����H�[^�y������}Σ��VZ���P�]�lĔ0�P��$��W��g`�p���Lidإ�*t	��M(�"RZ9?���R�)��UsqK�@��9��l4y�ћD �z��y�2�cɞ�Ǧ8
h�V+�e��T��ONȺ(�Ə�ʈu� Pc;V��x�� �'�&B"���pUY���"5�W�v!�ڱ9g\-��5G��  /s��.�"	���cx�WU��X�����������Gd�Z(�^�'*��:1 ,����Wux0�G z�Z�tS�ZT�}�׊2vА�D��s��Ӥ�,������'W�;��R��X��q�5��u_mb!���
���M��m�`F'��ȶ��T��ˮ,�^4
'������y��}�V�!ίC�v��6}!��y���	m��f�Qx�����D�w."�$�/5G���>�*XC����.4���D~���Ά�SЂ��W�0UP��ek��b�`�-�)�r��O�ʞ�=���"{�w2N�p9��Z�y��#�D(�5�ٰ1"�H�M��ö��"��� �"9��uq���O�)r�\�C@ze#e��>���"�i�Jg]�e��&[~�ȍ*3��+a�&ee��J�F�p�{"q@�������L�K.�Pb����H0I��[�i(��Lj��S
�W��ù��7���0On�Df;�p�ɒ���7�b� !�EX�%hSO���MF�X��Mʆ)��N��m��c�7��ȸI���nS�( ?}����U��ƚ�p��� [ꅲ־ĸ�u�/�(���Ļ�����j���p���ƙ�A�������c��I����}�j��kd��jWi�u�7�+H�?զk��z�,���Ӝf�`b@��z��h�^`?)櫘�	i\�u۶�w�o�	��8*E'k�����2jMB܋�L{�1��Y%OHYOT#�8���@O��wW��s�Ӌ�$0Zn��*Oqd�����H"?2��$���3N����gDJ�T���-�F��%�Mm���f0���~���ｏ�Ղ*����p�\��Qm�#���BF )eD�S����$�,>rA�J�Uv�������w`IN�&�汆	e�#�&��0�HJ 9��U7/?!�D�6}<�d2��73ڬ"�1=�p�gղv�׹Xl�����������Б
���s�L�Q6: �	��^���>�L딟g��>�9�6G�ڦJ�� ��)��:���T��;�'ɀ[�s��`.��uK��)��t�.�O�0�4m�R^G������O�)R��'����Q?:?�v�q�͏(SWK���Ʊ����Y�A����F��BZ}ϛ���F<9+�k_�sñ��ZV5����N�Y���%N�F�~�I|X�_�e��� ��QZv������^�$�ȯ���f>���׼���
��Tw=����q�06���O���R�%섞Bt�&� ���w�QQDK���6�ح>_���f�P�_[(���!�^��?p"����5uCh����e/ɾ il��~�P�t.<QI�)���J�A<>I��_2�Ƅ�@�ӡ�p��C逵m�����oM]y"�O5�[S��=ʿ0t~q��@��Gb�F�&�@3�W����q�pldz��aT�H��{�nRJb���aaA��uI�mMt�;+}���Y&@�t���l���w���ab�Y�۬҂�O����)�7)'Ex��o\<�Bi��'e�i�
ބ��<�4�:����w_~f�0l�6k���ݩ(�m�!K�4&�vK��q+?a����"�3��x�CG�~0�ϛ����y�F���ܯD�轨��ޓ�)Z�%��e5�Z��;	����Z���v�J��U���-������$�;�_ғ��0#�m�l���3�/����c)��&�(�zs1e(aG�����'Y�B��UΟS��jA�vv��u�u�p�5��鈣���K[R��&�d���5���(�y~�+��c��ڔ��i.�"�Ŋ��o�.�K@}X�s��J��ߗo�����<���KDrRd�-�~�)�gv��ZB���@��(�N[O-s�:7<�e$�����A�Z���-_���$¸���J𓇜T����PH�a�p�<���`���72�ƹ*㺾i���QutB3|�7='0�/Ę�ۀn%��7�f��W�76]�;Nwd�a2NWzÜft�v��lE�L�G����:�S�la�K����� ��Ԭ�ȗ��8�&_�0���Ӯ�����Ox[?%������Ƚ��c��-��@���z��n��E��]�c��6��8��b]��ڀ��V�:�!��_z�s!�ֳ�w�Ґ�	�́����x���( ��z�E3�p��[�ףK��%kGYO��F�<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <title>JQVMap - Iran Map</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">

    <link href="../dist/jqvmap.css" media="screen" rel="stylesheet" type="text/css"/>

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="../dist/jquery.vmap.js"></script>
    <script type="text/javascript" src="../dist/maps/jquery.vmap.iran.js" charset="utf-8"></script>

    <script>
      jQuery(document).ready(function () {
        jQuery('#vmap').vectorMap({
          map: 'iran_ir',
          backgroundColor: '#fff',
          borderColor: '#818181',
          borderOpacity: 0.25,
          borderWidth: 2,
          color: '#eee',
          enableZoom: false,
          hoverColor: '#DA251D',
          hoverOpacity: null,
          normalizeFunction: 'linear',
          selectedColor: '#fff',
          showTooltip: true,
          onRegionClick: function (element, code, region) {
            var message = 'You clicked "'
              + region
              + '" which has the code: '
              + code.toUpperCase();

            alert(message);
          }
        });
      });
    </script>
  </head>
  <body>
    <div id="vmap" style="width: 600px; height: 600px;"></div>
  </body>
</html>
  :{"1":"r s t u ED FD GD HD ID DC JD KD LD MD ND 4B 5B OD PD","132":"I"},Q:{"1":"EC"},R:{"1":"QD"},S:{"1":"SD","4":"RD"}},B:6,C:"localeCompare()",D:true};
                                                                                                                                                                                                                                                                                                                                                                      Ź�s���Of���b�n�OM��)��0`S�_��e熑�K��H�{�ox�BTk��������p&{�ŀ��RP�t� �W���P���z�
�Z:�)���d?ǂ��ʲr��<c=N�+`�hs�H�-�4ml.M=`K.���zc1���	��SPF���:�	חI�vs�´�R�(8R��3�-�_u��p��k&�-��p4iC�\����X�͇�	m��g��
[�����ѺT#���\�<Lo=u��E�g���f��\_խ�r�dc,�!�B�3�I� s7�`���X���o`�R -�|����,��hE��`��Z)��:�*�~��ސ_�&'�T��#�q!*0�i�
h�~p��*^���C1B���Jcd���y�R?����X_��>uߙ1��_���~[xWΧR�K�~�A�碡')��fǝ�"+������{*��D���P��<�j%>��I��l*���~�|��[Fe��)G%	��&Z�$�W�UC//�iI�S�uF����ֳ������\���R�V��aF6�C��h�h�(��@f	t�5�e�Y�v��ƿ	�'֛�ٌ�RX,K����685)rp]]��(�ݑ��=�U	��Pf�ӆnq��]o�/o�|��17	�+����$"��?���>���	�%���I�EԼ���s�m��T\�ŉ��T��YCW���}���N��UCiB�=u8h-vX�&��ٌ���n|*�2�㓬PX�x6�z-�$��6}~��!� IȨ>*Q�w OAN=�5f�a�_4�JƐ�*��F�0�$�(EP���;KQAcH~�=�/i����:���G<=�J _<j�7;�S���,gnE�&]w�_/�I���C��]^����m�Q�|�А��<u����*��S��G����.օ'O�_5�j�p�;^��u8l`h���4��i�-��_��`���U�"�u�"���u;�ߘ��$�?vŦ��nu{sb�	�K�������3Q3�1����Q��\�|yf$r�Z���p<��^	�u �eB��t�� �b�(��q pQ.|�g�xyM�˝.�o�8{r�*W��	"h>T���ğ��`�a���o����!k�l��Q#B��鐯_L��~��a��0�"jkF�¥�
�}�N��ek\�&aA��O�;���
��������@v�
�L�8ǖPb'���5 �S�X�L����V��Jy��h" �Jd(�)���<����C4��d������X�]z�@��n=��\��)�����%�����k��J0���/m�"7򛜟A���?���[\���	:�Kʵ�?"��j�\�ͺg���=q8�V�rJUW���s|��+�X�Y|�}�vd�'��%�&�Xo�F��e��!��6���ٯ�@�Ҡ6���0B�K�>s�8el�wĊB��d��7�N��vo��޴�0��̄��_vw�|��_QQQ�TG��I4�C���j�
�PlF+��[Nj]Z%����2 ?U�h����T�AF@��s�����ٺ��m}�0�fO62E)+J�M`�)�)ˋ���=�l��K��|β�A/�c_���b�2"i��D��/����	%V�v��3��F��E�R-��=T+�b������Ά��d]�:�I��S����+ν�L�r?�}÷ ���ؓU�@�q�֪i :sX���_[��y</g�7��6�&��Ym�Lis����]e�� ��#�6K��ቍih^�a{�b�.O�)�N�3�yE(����m�K����(��ziL�Z���'}<"-�S�El�D��)1���r��}�K�����]��f���T��Ԝ����]S��s��Ѭ!���d�Y�B�ًS}�㬫�f�YB7��m>S6��:�Y��S�dA�|��{����y��p�|���S�ӗ3�n�u���T30�O���čv����3��ב@�N�q�
�H��bJ�����
���|�{�|Zbv�IZн;�!��9y�'F�� �ח�N$�U�A'W���S<\wj��ќP!��$
VkGIB' lz���x���|+��Ԉ�ɧ�jE�k*�*g�AؓsC0�h��<4�\=~��U�yW
�l`g�4�9�'qi��nq