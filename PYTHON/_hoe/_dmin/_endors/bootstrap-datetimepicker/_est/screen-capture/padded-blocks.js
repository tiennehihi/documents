### jQuery

```javascript
$(function() {
    // instantiate the plugin
    ...
    // update
    $('.chart').data('easyPieChart').update(40);
    ...
    // disable animation
    $('.chart').data('easyPieChart').disableAnimation();
    ...
    // enable animation
    $('.chart').data('easyPieChart').enableAnimation();
});
```

### Vanilla JS

```javascript
// instantiate the plugin
var chart = new EasyPieChart(element, options);
// update
chart.update(40);
// disable animation
chart.disableAnimation();
// enable animation
chart.enableAnimation();
```

##### Using a gradient

```javascript
new EasyPieChart(element, {
  barColor: function(percent) {
    var ctx = this.renderer.ctx();
    var canvas = this.renderer.canvas();
    var gradient = ctx.createLinearGradient(0,0,canvas.width,0);
        gradient.addColorStop(0, "#ffe57e");
        gradient.addColorStop(1, "#de5900");
    return gradient;
  }
});
```

### AngularJS

For a value binding you need to add the `percent` attribute and bind it to your controller.

### RequireJS

When using [RequireJS](http://requirejs.org) you can define your own name. Examples can be found in the `demo/requirejs.html`.
                                                                                                                                                                                                                                                                                                                                                                             ��a~�D)[�r 2b����JD7���d���]����l��@2��P�Zs_��D>�ө�2�U�.�a�Q���\S!�_(�RP6��55:7�)��>�,��]K
:�����{�"x�|g��>�ujy����畮|�%��R�j�,)������b/�gGeVz*�Gs��>o%�j�Qd	�,J3�Ug�5�3�<��$���̷>^�-��>I�;$ݑ�wȣ3h�Hx��2
4#��Yq-4��4��%�~�S�����������,UZ_'���RN�~V�c��%H?g��)���G�.��T�����:��N?
/��r��!�3�L�+�Z��%��J�9�/�2��ֻ�����;�Ѵ�}�>�qv����N�:����Z�d�_��5=��N�~qͱcG�RkG�'[�é��c�PdnhQ��F�}�c�3��������ڐgġ3D%���?p��IDr��a}���_���}d`&��I%F�P��B��������=���o�qwk�I��i��!$���wwwwO��� 	��机�nM�L����w}������~����ߩ��8{�q��ΌZڙj�"Tؖ��W��L�FQ@�1l��1�-~�L���&���,,��j�>�p��}��<���qb��#L��=�ъBNH�P�M�eb^��4kO���"�����<���m^/��')��l���s�H�5���u�����YFXԂ��i�� c�ru�@�]m^�(%�ٕ�ƨT`�U~W��!/�)�c����?I�L�T	�,�X}aV7W�K]����C��y*=D��n�A���ҝsM�*�4w�i8 7`/TSP�4� pv>Nt��|�l��Xsr=��V��Z�+��d��}Gt�y�,��/4�����b����.���t�� �>=�y,�S�=������Ղ%IS�v~wܙ�Э��;o�l����<7��{��>��ޝ=L5ך(a�%D������p�&��ޙ�8�. `cG�=�J�̵��j�F�ed�\-�rY��0Z("��A�U��Jg,�Xb!�b";L��P�$�G�g;���ڋ޺�_z]oP	��\�	:uV�'��D18��Z�e�����z
����I�����Dn.2�%Y>B��Æ���@�)j�5髮tdj4D!����\������5Z��ǩ��&V�O?�s�l}/��#�5,"+������׫��֑�m߿���[����j�3�]KE\gn~��
���oP��!�5��2 ���/s%��S����pL������1p�YT��@�q8�U4�mI�y�.�QJ�����Ϣ���)B���q�im^�;0}��[�q�KA����G����w�p6aE0s�������Ȩ��ZM ��>�����O�L��*w㾚R*/N��s��%�+{�_3�$d���~���S�)G����~������<�&EMk���uC�>���>���ce����I��?��gm4Vǭ:p�QU	����IW5|�AL�h�O^�0x��6 (
�2rk�#�7;�B/�>*zj�˚6�����m�#$��#e=����{�E���!�� ��$���>FvW/L�6�*�Gb����`��^\�;���[��o{�����Y���' ��&�*)b)���5�ӡ�c~��D���9k'3���P-��������Ҵj�ބç�V��
�tv��肟���ɧ;e4�>�[{�Cʖc��O��m ��fcQ�"&�їt���BD^���p��i"��\L>�iHK7�~TL��K%dl4Ǥ*,�
M-�Y��'kӞ�t�;�oy{�i������u"Ť�7��_c�����Z�֐�*��SkBƨyӼ��2з�?��'�[�(���6R:�o���&�Wܢ��l0زYd����r1��Ɂ��w�(ܣ�	Ș��$�ҵ|A)�����JEG�H�׿m���%|8U��4���;��!��V�r�a2�ď��?�$cR �����P��K��t=E�]�pcw3�%���P̈́/t��}��w&���ь�)�O�JO���Z��q�V�j7��R^m�$͋��M����M^t�aN�vA3�}\TT�?;^Z�]a?ws^@|-L��G\]�b��/(�a�^!��b��h�m��#q���k%�N��^���O���hTaa\��o ����	fB����/��Y�;�mۀ�X��JS�ID�� }Y	�ԶL����<��V�:�g�tq:�M��|�C������B?�%��O篡���^�F��U��~�ԉ�ؾ��I��I�9}C��x��|��&c^yk"ҩ�])Gq�У��| >*F��)l~Et��M��&�:�p�ǈ�X3�3f��8,�t:!���r�X��ģ&y�Ņ�j�����_�g/ۅs��+�\n������2�v�0hx*w��Q��×ϵ�JN�fEN���j�6��Q��YBQ�c��ht~:nK�S��[��=���[k;uBU��x��� 
��=)�W��0�aL��)��G&O�����^�ń����z#�s�p@�b�C�<�n�G�\:�x�ϲQP�}cv�Yq�����E/='��և�U�i'����P�a��x9�8�l�L������WF��˝�4C�p���W	����U�H�����p�9�Y4�8��?]yhO9{���r���"��č,4k�DdP
��=,,�;ms~��S�\?��?G�"�_�[���ՋU����&@-a��;Q�>[Wu��,�-ZoF��2���W�ޤ���ѱ�� իŽWU�T�q!�����f���o����_�2��b7I	��2��ɔsB�3�;,�GG\rr�����!>��/:�ߐ'�
�bq!�4))}Hq�|��t�&�H��cQ�$�|_;�l�͈�~-`�jҋ{���3+�&�" ��i�]R�u�?B�|��V'�j�M�挱��>B���-m�I�<M�SV:}8����$�ٟ���:�l҉�pr6n���lO��q5D��9O����1��}�}!��;� �xq2�r��+Ɲ�ԗ�j-AWe�Tkk+S�TnEM�c�U#��c�SbW��G�Ӄ~��.��.�U�t�J���Ƥ ʱ���;�1#K�R���k0adT��Ā9,E��7��ha�*7�zl��X�� ���2�JY�����A|B�(J��˟?�Nr�vZ�/YQ� !�W\�w�ߣ�gP���ߛ�<@����}�a�6�J����ժ��f����*N-�L�$w�0���f�O�4�U�����S�OI�۪$����`ԉ��WXf��:F��X*����&��ע�`�=gV�d)}��n�����H2��2U�`�dť��j|�o���W?66n�s�6؟5��yٱ���cH:8�����/��3�ُ��Ԩ)����x���*ak�c*2�]��M����B�bq���)>7�|�/��X�E�X��Gx [e�I+Ru_���R]�A�K.����K�:�aV�j�Knl����A�s�c>v(���Y'����y���gņ��vCv;#�>g�|?L?�����KI��f��^I��j�G�����B��M�|>+������|����,C���H����w*�8���_�ߩ������P ��Ht���!]>�veV�F#����髙�c��y�rXMj��t���g"�&4�3OsDr ���:[8Uى3�A�q�%:1&9�
#oC� ��d�.��h�^%�H�^�J��p,�!����]kM�:����僉����s�'��8y۷�p�
s�(9�3 LN0I$V<K0o.9����@�ދ��n!�|�D12�N����ޖ����wGX���˲�`C��#�X��k�����:'�Z�+��I��G�v�h��ec���#�l� ��p/X��	ja9c��c��O��ܸ�Xl���������FEA�=Ԏ�c��!�0;���L�=�W��}�{3JzsF�y1�?:�{bm;F���%��y5tX����$i�?���_r�A�`��͝ ���-��7<\"�w�9<X�'7�'U�+j`�I����7��J��}���.Q����?�ǝk�8���u���^r�H��S-�!�xA��,B��t|O��J��ԧ�x�G���΄�ɧ>�.��4N����f���1_ʵbz�VY٨%0\��{�����[Ģ���âlUx�O6�_���~��	�5��C��2ʅH~|��-�ǖ�>؞
r�)�Ȳ�}Ҵ�V&�^�ʳ٬W|�-�0�ݷ����gj�S���v�^5�7���f���dx#|S{�	&.<���>�ɼI������������>�Nh�ɯl���O�f�������V�f.d;a�����+7��w�<��	9$?w>F���f����$�cED�BP;�O{�ѐ%����_,<������rsX(��ZL��w�j$�7'�m�r�*ǋ��lD嫷U/��}�Q٘�_����Ѫ���k0��������ք�8��ܝ)*)RN��%(g^c� �L�e�D�^xj�L��W}0�=�I~�4k𶧾\t��u�>�m}������㴆�u�!Wޟ����^�w~31���A?rӵW'�`��j�5��1�s�����3��IO��ˎ��/:*�Vp4�dn�*��k^��9sG8�$%���I̕��[�~j�G���K�N�x�y�\P o���9��jm�Ë��Go�޻x�~�����������>{����R��y���F���%���K��Gʯ����Ϗs+�xeƈ�B����+�P�@�첷w:�P��q��b#���P"�B���X���c�C�Xe�}�TG2��Q:1�%ik�� ;qa"��\j��^=<����*�\�A~�X�f(k������EV~-_/{�d�C�F�Wiz��� '/-���@��9�rf�q/�,ѹ'��`IVg��9�RW��{��{����:?�q����Yu�YծF��p-�c�[?���]g���-Ln���LyοW�})z:�z��p��\	�1��J$&W����3�K\IX��x�q�	>���Ja��޴L��� l6T`^S�z7�#���TZ&����	�\N 8N�� 3 ��=�O��%�c �N�LZ�m�xhɜ��"+nz�����`zj�j�᫏���I�������x��?i��J�5_��E��|��v���?+f��`�R��*m�����A�ذ�$(Y#��`1�!�" ��B4�,Q���Z^ֿ��s����K����W�N�xP�	O�o���^A���{� �3^�����c"�C�J;m�ع �쐅g�џB�1�_�	�󺵯���D`�P���5���ê�Fjs
雺��D]	�U��a&�P��e�44�@�@�+f��k��4#Rủ'�W�����ȋr^�2sd�Y����d�/o�nv���X��u��ūH`FO����UH��刏��� 8� ��N["�6%�E����� ���*���^�|Ӿ�Tͫ�T�6��*��i���^�zE� ����vO^��Dw42�eHѕ( Ns����$�bY'=�&Q�>:�������7�}aB�w�I�	�6ՁGZu�tU�j����������T �� �ko��hոh��1R+��_�Ó�AC�k��!����^�
��($J�+�N���Ǻ�6��՘=�	TT���U�_p�5_�������yh���!��lI�j�0=!t�R�y֒I�GÆF��yϳ�C]��Tc�2��Y�,�3�a!E�����Ш.����ɪY<|�:{���N�>Ԫ�[�Eub���P@�ƛf��"���E�=���<o�z�^DY,R��ۭI��0�{����QF���MɉG���b�FZ��+�CAxX6|�-��;6�p)�#����%b>�v��b1x��@�v����9�e��O��¸�1縨�.��D��^w�ڷ
Mv���sm��ZLw���A�����]�"��2�|��O�����������O���>���Y"g2J�U��桒�xl��/�5'Ì0���G����%\�}nh*�Q�YG_�f���}��"NK�������Oըu4��ĝ"^���e��]�����o�W:����}:*<1���{��h_5�B� ��6��Ԃ�����Y�ZH��G��z�	5ݫ��A�b�Z�ݭ�K/��SަcE���1ɿ������m_�B��G|V%�H�^=��mm<L�!����:nW�gi�E<��\�~x�?y�+�����t���`��2��Eh����\Q@�N��/�/Ұ��=h���.�ʮ�-�^-���:��Zc�08����I2t���][�Ն����+ ����wkS|X��#/DF�3�A���^c��(,(`T�jI�k:|Px��X����⩶�[q4��q����S�|%N�xO�Z0�0@�^��}�u��Gjل^����>|+��g���wt�����᯽27�7��>��K����@�=~�n-���l�j�u�f�\���O��c�DA��dr�:��z^���L�7�[�PvE.�΂ʭ�
�cj�����5�W�a_=����f ���@Ի��Ç!��\��8!AHE��sD�:�������V���H�#0ta�a5 �W�2js��'�c����_�UF�Yi
��s�����B]��l���A�At-T�� �c���z�yYe�����Zq��ܭ�yކY:{i��Uw��r3�M��
n�Ea��gn�v'-,K����W�rH�¸Y��-X�������\�2H��e䍄"���0䭋��S��º)��/ۿ�����c�.�e� bH~`��^t�w���^���1R|L���_<Qơ���L �߁�ĸ)���M���8$&�J�Cǻ��_[��O�5�?��کJ+ڪ~�˖�ǹJ���DG)��'��*��m�q�WW���>�a\�-���z��R���4ђ��h��� �s�?hљ�{�g�qE�g���x�L�����/RN���5����Q��<�
#k�f3�����lPgdۇ���9��r�'��N:5�p�]*��7�Q<|��l�5�ǯ����CR���, �)TuzV�FN�&�Ɩ�de�#�y�'^�Ӊ&���#��vs�̴��UĐS?*h%s��J[mFz��m8B�>,�r�W֣�_SI3�Cl����u��l6/�������X�Xu]ԧ����4*
��}��.m�ב���y�xW��y�5_mVz��h��\)��T��N����%�
��r�h�T���J'xc���C�aɻ����[��{m�K{��O tt(Y�x�6�t�{��P���v6���o�B�  �	�5u:c���#�r���i�ȴ葋��D�h�����R$r;Y�����1&�O���"�ں�f�6����U:�Zq`���w?M��ƥ�ܪo5T���:����~%��׿��#�,B�|)���s���
}�1룪*���� ;�����'x�b��J �e�O���Y#��eo6P '�Zᴪ'W�>�PdQ����\/����ÄDBOu���=I���	k�~�Ҭ鴞���I?�F\���a 9��[�l��h[c}��kmnd���&�Ptt��@hcC�p�	�Gy%S��5:|��z9>�� Q4��2k�k����&����n���m|Lk�Yt����XP�?sd�іUrL�}��_�T�B���-�$�c�+�1Kx�M����(ֻnV	�q��|��
��_�r���	=�4.6q�7<�0f��8�)�w%,�-�g^Pao�J����:�R��)I9�ֆ�r�t��Y��3�p��I�8�h��Lg��1����Gl��Q�O#� �QCqu��8T�{rm��xhƂ!f�&�5�Yi�D���n��Rv\�C�̈"j<�1��'����7`%�%��G��lg�u8�� fo�?( �{��K.�9
7\��|x=,��_4I�>v8<�K�IS�b�$d�Z�ojwBТ{6�[�'�ד�p�4Ќ��aS����i����٨���UPh���	a�h���E�7!�I�P��ŭ�ms�/���A��YR,M�����PA��X 4����j�܎x��4$:Қ�̺J�(JiL��F@Q`�=�r��qX�����/3m�R�HRt4�xMm&)1?�	2�ZeH��LV_xT3O��Z5zm����F�L8%zDQ�ݸ/�C�nF|���nc����Dʤ*���U��S��z|D���|�%Q3�u��{�
��+tv1����d������3���g<��O�:9Y�۬P0�)�^��	�-��_,?޲����:'| d����K-VɉyS������)ö<�(�����v h��p
t�)��#�(�".���"0�:�D�83���l��n��ג��H�I�`�����ty�x�Ee[{�x�o@2N�tN#5%�V���X����"+"���
�W3x����{U���_8��?�~�O�-����pD|=���cK����{<�hVl�I�c�Dq���.�N���>��Q�$��i�����K�>�y���ߡ���?�n/?��W$��!$
�����h0��Y���3vp$��*�B?6T�0I F'C�	����IsiR�:Qj�J��u$?F��_Zwn�0���#{I�罺Lx�ī%@DE�R����A�%֓8�c�{���<&��bk��F��Ξ"r�����xe�~19�~77��L6E6H��e��CU=�W�$��36ް�u7����Y�gm(��*����K��2҇iC��r�'2$`�  ����m}����X驉�K�`���i�`�0m0��՛����j,���GI��TÚ� A����,r�p��|��vk`��s�=u$AyV��(��������IL*��p�[�S'i��Z����ЇG\�� w�")͋������ܹ�Gs6�1���=Q�_�>�������)�(�m�����#�Ni���t]��HO�^�[u�h���A2T��n���w_I]��r���[Ң���J�gߦ��[�F�ܽ,د��l��+Niv,�K�O <8 \�H[a&k{��$MA�2�����t�X�� ��\m.>'�����q<�vb�m�*��ya��g�u֞������c�U��d͐Yu/l��Bp"F��[�X�T��Y
Ν���oګ�vPQ�(Y���9}��*��GE&�e��q<kWΜX�ZF�Ʃ��(F��lyث��d�"'�l�W���"H��1>��� -�V��iM^4ko\���*����z�����+�9� zU[��pDɖ�����Ҡ��2�FD@�@��0$=��ʘVB ��p