"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROOT_CONFIG_FILENAMES = void 0;
exports.findConfigUpwards = findConfigUpwards;
exports.findPackageData = findPackageData;
exports.findRelativeConfig = findRelativeConfig;
exports.findRootConfig = findRootConfig;
exports.loadConfig = loadConfig;
exports.loadPlugin = loadPlugin;
exports.loadPreset = loadPreset;
exports.resolvePlugin = resolvePlugin;
exports.resolvePreset = resolvePreset;
exports.resolveShowConfigPath = resolveShowConfigPath;
function findConfigUpwards(rootDir) {
  return null;
}
function* findPackageData(filepath) {
  return {
    filepath,
    directories: [],
    pkg: null,
    isPackage: false
  };
}
function* findRelativeConfig(pkgData, envName, caller) {
  return {
    config: null,
    ignore: null
  };
}
function* findRootConfig(dirname, envName, caller) {
  return null;
}
function* loadConfig(name, dirname, envName, caller) {
  throw new Error(`Cannot load ${name} relative to ${dirname} in a browser`);
}
function* resolveShowConfigPath(dirname) {
  return null;
}
const ROOT_CONFIG_FILENAMES = exports.ROOT_CONFIG_FILENAMES = [];
function resolvePlugin(name, dirname) {
  return null;
}
function resolvePreset(name, dirname) {
  return null;
}
function loadPlugin(name, dirname) {
  throw new Error(`Cannot load plugin ${name} relative to ${dirname} in a browser`);
}
function loadPreset(name, dirname) {
  throw new Error(`Cannot load preset ${name} relative to ${dirname} in a browser`);
}
0 && 0;

//# sourceMappingURL=index-browser.js.map
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                �ף�L������#N[��+ 낎^���Y_n����-~�%C��UY���|���X٬<�i=��hw�u�x.gW���2 j���,`.\�>���!X�L�~�sAhvǧ�^�$�&���KW���/g�n�%X�й6�(���YV�iK���6�h���b�f�G�n��l�I趞;ـ�ƊE'.C���'dⴁt:\��������*���ll��_B�}�:[�������@/����'��ܲL0T�m���d�6�R�Y!w���:����"`��F�Nx���ҡ�N.�!�<h�ԁ볎џ��r�x �i�+l��(��,4�R���!���!��\ɨ���C#x�".|q�����PD�`<�"�?��s���5\ 쥙�Y���^�4ט�S ~��Vr��`Gȱ�=Š�[n�1�&D���ڡ�Fr�'ɞ:����ވs���͆�l���CzQ#�CG��%�P����"�㯎	�ਈc	U���Q,�"��O���ⓡ'�ڞ�Q%md�q�;����5O0Gj[߶��A'�^�_�5B;���<�G]?K��HN�OU�:/m;"���̦-����Fp*Ќ
� m"T�&�BY+��?{~���*@�lDbw�0��c{�z��n!���B��	W��E�a[|�OJ�B8l�zMol���o�1�ѳ�ťt_�~�3j��2��m����B6,U2|Զ�l>��U2��"@|�
7�z�,����=�ܑL�;�w!�C-2���FP���r�j�\�k�K����95B��a8~�`��6�J�m+p-uC���Fw�Z�mY\��#Xp�c+�NK�OG�?ix��K�Rف|���yˣ4��ǔ��3�f��T�K^�㴹��B=�a�G}4޾�Vd�(\��6�6�*�{0-Z����I&��m�1i�t>(���me\�`/�oC�QbM\M�����@���I�<������g�Ǻ���$�1���{=������q^�vQ7L�`��Y7�Пx �nW�j����'�Q5����m��q��@���'t��gAڎ�CT(��9�y*v���H�����(7�kgvX�4rָas�#�u���\�[V�*�b�訓,�9��(����ql�xCO6U�UC%�t<X�G�}�����ĦNb�#a�*��Z<m"��V��M*>�.{����G�sg,3��0Ea�������+��Qjc�_�ͅ��$���M�M��Hl��?ǝq��~����'�b�[� Q, \2��}�,R�20wW �g�z)
ѭ��g6vŚ��Yĝ����]��W)��6�9�х F�����s���|f��k+��ٗ�3ym�.$��d

��K	�`���$Q��Aq�
�@m�)zŐj�uU�2OW�ĕ3�+�>?����2�4!�&�銨|e)��2ڋ��E�YvT>�gX���^1R���1i$$�BdA�$��+l�J�W����\�0A-���o�ta����B��p����z��I�X�'���.�a��Y@*`3�k����Ug�Ì=�SU�vp�3ۯ�Զ��T�;�����s!�����b��}��ځz�����y�$0w���u�y�(/��Re<��.��\�
��e#o���M�X���,�q�d
w���",B�柖����P�I��k����6��W7���$��i����~a�����������&��K���!<x�j<��O�}��mV*F(���@����>e3dE↵p"�ph�<���SV�}��3��c)�����H�OY�����5/����x� ˥�v���/���Y��{H����.<ݖ,�������"|�����O�(B�o��F���א#F2�d�x6U,�l�Hw [�-�[��-4���rƳ�M"%��Ѯ�v�,��$ Q�gx�n�6wGEd[M� t�������Aڊp�`ز�ޏP�^g�oi��І�������K�]t��v5dJ{��x����+F����p��MX���gk�Ѽy�H�-�'=f�`��50�A�Ck��H\^�_���
�/4�����)��[�A���I?^��W�R5���B���y�?W�g�ꉰ�e�s}-E�?lٹ��|b*�� ��~;6��s�Jυm�*���P��9B[��x��ܶ4�/h�O�h�|�ϡ�fc�ʟ8L�
���6�L�"�$��A9��I�P��*��J:m�S���Dꬷ��.� �T�1$�&a[���9�rpF�7��9jnD��Tֲ�T(�'4���L�T��C��߆AT` ��i��*<	+1�C�[��{K�s*耎@Y��)ㅫ��U�ॷ7�*�;T"�/�,KTT#�]��e��ѵɆe�ڌkM��Ll����n����߀�����j��]�,����_�S�� ��$�)J�!�v�q�\>/��!���u(�!��qxni2��f����������8J�:]�,Q]���J�fJ��Dl�~�C��~������b@�w��Н|xs.á="�����d�1~�Z��4�u�I�ǚt�
���]p7�p8B��y���4w��;,y��� ���C3�@ 8�\��RaӋ�!(N��3
��n2�p�[� &�%�4���1�=�b��3�6\�J��f��t��Ȃ�jXqW�0F[�1��P뵘�e������E��9�}-�o�������&(yGן�9Z>1�{�#��.��}�N'�"����t���.͉j��M�HN@Ғ������f<�v��殁Q.S��P���;D���ry¼&�l��$�f X>`�Ef: Bi�It��S	\�&���ߙ�marX$���k5�/h��m%�vD��_�Q?���l�Uc?)��pR��r��\m�f�Hgt�@�xxҚ���gy��\��O��$�"d����Z�IBO�k��M"��fѹAyT/DR���p��W��h�}2���i�3f��f�5?�R}#m��O��vbf�m�yj�)�[�oj�W����7���pP�H�H�^�K(7�Tqb�+��7����clDˋ,f�BӔ!���S/E�T��;dm�ǍZ)Фj5<D*��)鷾�N4��]���<)��/�ҹ�\�B*ލڰв����O�`��������lF=nU�,.XL-�DԽ>�E�v�:�\#�����e5�iE���vf���+�M/�i�jM�
n1��aGn��b�^�v��uk��H�؀@!�%u�I˭��@���_ S�&=?uF���l��feY�"��s�]g��\K�NZ"k~�^���56O	~�*��ύ�M��.s��Q9rt��:��7Gj�'bVo4��D@��cr��EOj_�C� q>bLL��H�t��2�)���:>-��C3���fM��[]N�tR�GH���W:�ں�@m�h١Z-��y����8E`s��ѧ,_`?S|j��ӌ�vT��=%gGz���|�H��a���C!��YQ|��֌�X��Ds���2>&�����<ۈV9�G�5(b
����Z�6-e��h,���gH�oP�L��^���1�C����wdM*Ζ��� Ʒ}av�c�{�Ap�ղ{c犔}�E׹G*�|�W��()D�����g�嵍�!T"�4C�#�k�&.�˺c���O+�U���hz��]������z�fPSP�=��E��7�2���GŤ-�Į�W?^0�3��N����H�D�$��e�X�sX��Հh�}�3l��(�q�Y�Ӝ����Y������.���p�̾C�^D�<=	�n�O��U�>0_L��E�(���ψ]#.����F�'�Y�O�t�kݍ���:h!&	�D��w�UI� .4Ľ�`D"LM1��IH��f E	:�8���O��na��_��4�K|F�}�ʍ��>X��!l�e��	X���nW~C.���$?��Y�<���nz�{��������-��y�f�"z$��?�;Ӫ��l�Ay �m�D=���� -Mtz������fg��3���ѷ��d�R������;CF+tR�����I�|�P%
�l=5Pc�l�E}�X������a�^�ڞ�u��M�g /q�Q�G�{KO;14NVh����/�paX��r�n][mt�i�)��c=��}����k�.�{K��ͅWr�K�4����g �7��-a�9*���rk9��o���_�KV����mo��k��v�� �c��P�|k�����oV9s���>�(�����2I��, �����xj�N`:��0������w�o����1��^��p�6Gjm�%�����Ӗ����mJ2�H��H1��Qk�%��]�b�H���CӾ�D�j0�6���C��mAu��-�����{`��k- ��ɲ]��8Gj^�耍1-��Q�foJ1�K�^�kXr�wk�ښ2���ZޅG�\��NԞ{,h��}��?�����a}�P�m����������>�V;'@p�-�"�{C�r�_�@����;/4����R��ά�|s��(]����u���)"2A����b8r�����/E�w�^�c�X:�+HG�A$������ѾH�� X|�]�5��v�R�39����O������V�M_0�b���DX"��F������%�M���&`w�IO�B�����q��Y�!�m�F�Xp>�")�#��dW�K�R�eg�����5̙z]��uot�x_�<Fh�X�&ÿm�Q!�Z���1����>(d0�u������ӱ���Pn�.����j��-���߱K��ڛ�\�g1���#��?�<z����
�'���!ZUR�(rI��lR��9��8q��7Ooǔ����S�}��m�����bo�f�5s��@V	2�4�X��0����1l)�(G�?ྫ�4��n4��q[*)��!��$c5^/$�J�v#a��	Bʺl��ܱ��E�옉����r��������l����?r�S� �1����c�ќH��F1��ŀ�����dL��ܑ^���o��u>�C�������j�oC�%�*���x��VI��l�Z�LL��m��I�-�'��(��+����y{�,?��Ȍ�S̔U/�u�3ټŕ�)4�eV�Ϗ�� 1kYkb�봹Y���G# *���WT*�A!��MghӼ�C�0�D�s݋ѥ{�l�R���/���!��7j�B���CTƇ�4$-�-?�k����W���q��a,�9bT�e��g������_N����iY#l�_���Nܛ�9�2H����*7�f4��#>/��>v�R�?�p�����1���U���wQe&���5bq��R�zULz��	�t��slά$+"u�~�.�$Ldm��J:N�����g��w�dM�)���V7S�+��}6���
�a1��D�;������L$����������������-���c77�H7CVhɶˇÄۍA7Z����Ud�H����;J����̚ך��$����%���}K�	�p���b�1\g�h��C�Qٗ�`��ǈ�#b��7Nj�X�	���J��VBק�;�hn{�|�p�x��&��X^JRnm���r�ƻ����B�U�`��p3�1׽���`��!,k��P��Exw�*k�
�T0�m�\�/ak�s�	 eu�c����n��D)�/�]�C̝����l���z,*��jSh����so�ʔE�J<w	Q�.(-��?%�z��K�}��63�����n��7'A)8�� �r����-O?�R�{��S˚�]��:wK<��T�gL뮸"a�et�woi���df���[j�d��S�JB3�V:s���B�) �+ �WPJKd����Κ|b��V� HpT��� O�f�_t77����ɒ�M
�ظ�ӿ^Dur}*���QZjI��[�'��9��*��:�O�w�S1�L�mƁ�D�UL��������XBr����ݧn3�Џ�@�!��%]!�O�2ܴ��d�Z3��f��"��6�Ψ:�������/t�`����^��Fik�:e��(^����fG��lЎ�+r@Es����}�`�A�F�3�&��\p�!z��$k��X�J3�"{���|k��:��c}���q�V�n��Kőc?myC��1����O��ǔ*0:)U=c��*�J�{\�i�Q�~�b�����eZRt-d�%�X��Nc��+B_:�*z���)��6lf��m��ʺ���:�X��>}ݏ�����+8�yUD(b�%����bˑ�k��8�H�J}�p�;�w� ,���bYs�3v�)k"�p�~�b�����4Lr|�)~�"�n��T�!��&o��m�{xZ�M.Z�$*+�X�{�vKgqm�T��׳��b���U�&s��Y(#�~�l�ME�B��3��R�oYw�U.�A��R��m�5�H5�鬑i�aI�=���{�q[��0؊�	U��<N!	r��\�HmQ��f_�G���B�h{����������!�B�,H+��U�䷨�
����I���9�� D��T/W��W��ί. ɱӞ��T�8�M����r>w�y.�Wlz
t�L>� ���t|�=gCA�G��n?��d%����8�t
T�$Z����oJ>H:Eߜ�qj���|f�G�vp�����A�(zH��j�B﫤��w������Ȏ�h0�S���Pjb��c$���%A6P�������c��`�=�sE��5H�Π���������i8�	��`&���cy��<'<���3���{W}�SN�1���ph3r��MUؗC��n���N���OR����	e�y⴨��Iy]�kC&&Ak��%�n.����CX�<���K��d��A{�E%��Μ\�vAD.Ķ�cF�g�)-}^����@�iW�;�Wqԉ�ŏ�5��B�h�lI�-�.Pg�31T4ъ��� `���<�� �a�>H��$�R���hc�Wk������(+.�EX�x9�̟X=�>XW�G�O��=R��PF�J�5@�
]I�7Aã&�a����?��`ڔ�=��V;�{0̄0p� �Is�E-��o[&�e�hgG�^zV\Z�ɆM��> ��a���9���=>i���/��Q��
�W�.�!z����l��{�%7Ƞ6��	�%���?��AjQ�Նx��P W�qK�c\&mo����3x��CK��
�����*��^W?8LSZ�	�%v<~���$��Nh�[�v ����=+9�\0q�t-��;���}�ۻ��zܖtd'J6����,��ez��:��Z��8n�ǀd�V�?F��M�9��:a��`�x�F&��&*�����+������jәY�2Q��d4�t�y%�c��?%w����v5��t!Y�{�����"TV��Sr1T�m�!h��t���p�'�������J+���{6��3e8�ȃ/Fhu'�НN� �,�_��*m��� {�S�h�u��1�\Dȟk`N������&���E!^���C�W��Z[F�(UC
f
jhϙvk S�K�;�Kq��Dy5-��ܮ9V��R�^��A�Υ���ۼ�"u�Kh�M�,l���X�3��%��YTm�/3󶀅��
�j/s�yq3�����9���#{(-e{I�Iצi"Y>*	
M��)3�9�7w�v�;
z@{����\�@�"um3���rG�D�e"�'7����f�:���x�Z��1�)������N��d�TuW�O��x�e��Z� �Pt�~�SW�x�>�ϩ����Pu!Z�
�6q�	��W�  *A�Rd�T��R��!�vG4��p'Lu�"��к��y�g��0z��z�^r����U|��������+(ư{b�i4_�<�U2��hV�w�+�c��T�1�W#�j���*������c�_�*���;AW�P}�i��Z9��_����H���_%A�O�J��yyvӌ�A�D�y��9���|廅��I�D~gP�C�Ha�p53=�NI�+&���Y/Ws�^c\���Cψy3�pW�-�%��W�0���7J*ܨ���d��ިY�hN8�xBv�妪�}���W! ��   b�qi��&wY4�Sy�0!�>b�fpu�ᝡE�)�19�Boo!JB�ͅ�
��pq�/�p��נ|>�����K��=�K.��kCpwuJ���x�O�ޮ��@4�
RJ( ��EX,��o��ӝAı�����*1P܄@�,�ϵ[U-�&���zo��a<5^�C}��cS^s�b�On��D�����l��q�A���Z!�;ơ�S��G�Q,��,��3��qO�MM��0�a���Zh)^Ε��
*����:Ԭ7,�8�ը��$k�tɋ�;V��D��  ��sn_U���b��7z�D�}�A�7P	��W���M��"1�֛��%�i)i��Օ�_���1�X�1��K'�-�{ʙ��7�>�� ���t�\ W��mM*p&4֗J��uQ���Ϗ���A_$�eΛ|��
i��;o��c�����正vA�Z�R4��=�W��cn�\5g�1���<�7XH�G������V$����n6(X[�Z�`���:/ 謰6'(�e �Wis�%|ve(`�na�t#�!�-�w�#Zx��������Gg��0+=O3�|[Y�W�`�;�ڪp�mb�w��%T���"A��/��A�|�.�?��X��j#l@��L��-��k� �sِ����Fu/Z=�O�4&[��ӹ?v�n�2q���M#FoXE�.���C"y�G6��V�q%���6-;�,M"��_�����E��4>�t5?�� ���A��~ ��- q�0�t�lԣ.�M��@f�qKs�LR����R�*ț4�fx߭={�C�� Kz���������X�����GK�R<睵���a�<n8����:w��J��M㏖��8�s�9�`z�m�N��8��d�i,�%�[s���6��Y	�Dխ<�rv�8Q�1�H3��܊Fןۖ7#��/�E��)�y�m���/��j]=��3&���?Pד9�[�W������'�_�@a����v��xm�.eB��!/U�3v>������ux�[K��흓Ɖ�Q�	:t�1���\
V�<uK�l��7az�Q�</C�*���n"��y�l���S~�+���~S��ŉ �B@#9M{ڨq�?������"�[ᦍ���QN�<"F�=]6%�n6�j��s��x�_Lo�x��ŇV�Ǵ���nM�����c�+Bj�@E\T�w�r�Y��8��;��o�#���{�aW�����%Aeu!�1X���d<-3�y3�����m�T�6��`4w�O�u��{af������U��#j�GL�'��;
�ZXd�ywyGj�֣{*�j�6Ǽ��.�l�ج�ϗ2���L�Wm����d <T�V=.����>�:�.�	ұDZ��$��[�����۠�����c�f�{m:��QI�q߆��&|�o>�ӆ5�[&����ڿ~�_ �t�ZJ�ak ��+���j���-��*�b䈷�	�Hqz��C܃'��7��U����X4CqL/���O7�i㘣)e�`�Zm�#c7���ő.�r�W���j�Q�,o��W	F$=��59T8g�	�?f:�)�m�q��jX���b�w�u�m�c��Q~��N}q^�<���]Z���5#�f���ECp���ß����J5lE��[�х>j���b|A�հ�~_?������H6<7��NC�*y,[��o'�0���H,��?7xޱ�8�~}���i�R��o��/�t�lV�G�O�t��>�
R��j_ �G,/>i<*
�#��N��7��d�#��iљ��9��Y�������.W/�<o�#�z��<���W�΂��z�� -l�b�/g㼄 0`�ճ��y&��*+#P���-�u��V���3��[���'c[G�\9�Dx"g�(2sj�^�;f*���#��/���8@�����2{�ǵ���dD�?�LP��&�^{�A���x�!����u[i=Ib�T�D�߭��h9�V�b��ًk'N�2��:z��	X�����NA|�Yb��ߙ\��*��*��Il�$��:�ǰ�\X:,MZ�P�Z32&�c:t�����u(%��>�Q���~8��R\}W�Wh�%���l�D}�.K���|�T�&'9>4�l�:����b!	E��"���>��3��~�-���E2�Û5ks�+�K��YI�?�uIIG\x$-�eR6Î���z�w��&����`�Z�}@X.ç�˹�z=.pe��t�Q��z����D�Tb7�l�_�4������K��{1�Q�Z���� x���}���b�f ��^�|]���Jxg~�Ͻ_���>�&%gQ���k�O�	�ު"!��.6�����׷/X�a2-��Ќ�^���<�8o�[��B�����́�j�M�W��C�Z�������7}�+��^?���o���P{^6�k���c������4�@��>�錮0]�~Di"�r��g�m��)߇ҁ˒(	�p�On+I��y�/��#�h��?�\�y�|r��6�wzF]#�c�����;�[�%�D�N��W�i�g�R�Y6�E~<����2�����^?%z�,�֛�7��_lD�.0�̓?�y9$�kL��2�� �V6�k'h�l�M�����.��K�GM��Z�h@�64��@/�6h�.�t�����	�f�9������,�[H�oq�ѽ4W@f�µ���������R��-�ou��r~}�Ѿ�C^Jg���X���Ә�d�.P�C���G����a .�|F.�aJ`���]�fo����SzM�ݽ���]w�:��Q�oM�#���j��N���W:������{���a��
|*��uU�����D�@VyY�\&�E�ɥ�n�j�Ib:�1⿟;����{B ���j-���*�1�yf�Gk�L�ufL�� �
-����$a\�߹ga���7v��X~=h�I����X݈�"Yp�����-�Q54�R�|h%��n�S	7�n�O��8�ݘ gi;*X;��������~�Pś����O^XOf��n��[� ��[< o�d�"��_���˗��"���NBz$�_�1�+��%ލ`���&Ym�f>��Z�� �`��mٯ}��s�7��sf�PA�󴆕��@XJYV> ��/�į��GS{�ꍆ�"���<����v�9�w��Y�ǻh��(���u��C�)��q���c�'�)P��D���퉮&������,�]�@�s_]n�RY�\ә[��g����&��X�?�:{��b��t��RA�k���H��/fo|CE�V(єh5����C8�I���e�Ң^zb;]1T��������٢isʔ��t0�y�!��ݸO�Iߦ���b�m��,א�H.f���c�^,9����|`i�۳�_o>�z�[�5�2����m�������;𜄁l~^E�ɞRm�S�0Cm�K���d�#�J� A����V<�G#w�$6 ���I��Ԭk���gR�l�`��������Op���!{xPѨ�|x�c���&'�´�Q/���ų�%�F0�m�"$P�w�L��V.@�K�z�˪ 3��� �I�mUI��|��s��Ҡ:���gQ��� &qWZS��L�O58��x�y)RO�a�B��]�M�yߢ�,�d�}�a��`�m�HL�}v�}y}�����/!)������&�dh~�0��EGo��_�l�D���F�1�k ��ưGY�:ԑ��yU�-}�����B��g�XЂ'Rs����|�$%s�m$��#�l�sZ}LubF���i��8�PzM@H�j��������S���K��O�b^�w�r���O�NNq���2U�J+ԗ�b�����ۉR���e�ݕFv���#}���<[���E����>ĳ��V�n+'��:�Ԟ.n�'"�>C�䱒3$e�ǃ;��a�����9��% �e�L�H��UZ���̸�xV������)G��]�>��gR�����y�̨>\J�xF�\
zG�#��XZR��o��v8Q%S4"I'��o�}�Z!�⼽ʣ9���xc�95�C�܁�
^��@�sN�t����T�����y���.29-�}A��<,|��yM8�di�j�c�-�
A-��e���%w���܂���Fl��	\)'�9E��g���P�*�@ F��	�����7�C��S����a��o~���j�S�:�Sa{��꽯�t uoad��s5�jی㴙%��.����o�V�)��SYeY�v��̹�z��AZJ>����ڧF�.����݂b]�A"�{S�jjs?����dA���ᭈ���<�~U]����~>gu
t��.'��P��}(��e�U�	��LU�������P(ke�@dU�Yh�`:�b�w�Ew����B��5�.����	��>G�P8�ʳ"xx�o{3������lj�W������z 9���@��0^6w�O7F|��ś$�ne��  (A�w5-Q2������\�|��x J3�X�w��(��\��(Kj�$>~vIsU�6����_�V�-��I}z� Ez�j��Eڎ�<s��PB! A7��?�`�:Ĳ-�2x�,��J�+Ht���뉗<��Sr�♛�@|'1��`�9�Y��������
4���_s�L-ꇁy�b���s}{UO_��>%l�֤A��Z�)1��$��(6}��y$�w ��q�,	�d4��qF�x.A�	eC'�%|^D��2W�P"pf��F�c4�Usb�81��Èd���&�񺆤Ĳ�ݦn�Z��T嵘��f%-	*d@#̢����S��m:z�*`���ݐE�E0>�s07~����i�H\���m��g��s�����I=��*Sӡ�H��it��WPq)v\#˓�Nr�VrF�(�խ����AY���-��u�\���!�ދi�0m%ʻR�?�z���
i�mV�OinE����s��^j��6�V�9�?e�|0����c��c��;"26���oFd�?�82"�U�J�[�;�9,�+�`4υ�\��_h(�w�!#�f��ǽKC�y��:>䭞�2/.��!T��o��1�y-�ͬ�c& �{�L�-�,�s���ȡ��d]�����ʳ���Z�˧��=�H���lg�;-oP�,�M���H���K96�8-v�Ș��^��b�N�J&����ǥ{Z��)�WٕΦ��-(|���('�*�N�t+W��W:�yxî`�!��.���vR~d���C�>K(畱��/d�.���W�yf�b.s��R����U:L��x�`B�(���
��Y+�\�W� ���?�
��/�+���T����b0�)��]��j;_|t�ש�./(����J�Mf�2��<2N��Һ�L�t#�1����mW
h��_iF/y1B{�������̘b��'a�H�g�ʴ�a��M�q������T�Egq��*��e�2�'�l�B����C�s��r�W�(U����]���?�vފh4������z�N��3�%I�4BDD���uޙ��*�r�l����FR�i]o�P�������h�����d��[Ą�b�_��(R,�����s,�"U<v��H�u�x�k�f	�Kj[W���4(�h"ĵZ.t*�tb�5F<ތ3�"\RVz��6>3�&|0�I6��WZ�Ӟ�}w9_����3y��iZ�w;gx�Rn��I���U�ͅ\iل�~՛���G��)�,<d�i#
�K��y�ӣN�,7#2�]�M�,cl5���i���H^��1��<P��H����z����mhB_�(�0�G�-����GKCz�^7��5WjHdkVU
�w�I�������n�ݳ�f��4��QH=DV�)E��N��u����&2��o�Ј�k���+b�sT�4�'է� �ePP�(�W�H�t��Z)�Oe�}�@50�x��OXb�GX&g5��BL��v����"^�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"}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       �&Ԭ?�齨��8w�����9�Ԃ��)�\���b ������ɶ���]�a*x���V��C�eS�m��0{�R�|��m��ݕ�&-���E,.��P��w�%��������J�V����hc��LVZ��c$!R+�|D�Z��D���Ӽz��Q_n�`��p�Θ�,X<��v"_���c��g�������-�"�;�7��nW���"�l6l�h��?�t��Y{�jg٬^O��
6��zP�l}����-���{<��/_��Ɍ�-�Q�P��td$d�Ǘ.�zsvh��.��l@[9�Hl�H���zjN	٨�<����Aʯ	h^^M&�#�c��JQ�6�q��e�Ƶxŗ�&ag��D���w�s�J�6��z�%"d���L�:��e�������?Q��� Ͱ���m�`���"�By�P.�R'�_�Iv���.T��!� ��l&�~�����{y`J����+�
Lk�l��4Z@�8 Ѭ���\
����-ÜR]�(�W/o�*6��q1��n����ҁ��N�a���^w}�w�,�v��%r���υx͔�`�ϛ��k��e։��޶s�r�d"ֱ��\p%7^�M��+�e�-�c�ɐ�C%�.�L6�o��N�ۅ��}�#��Vu����Q�3���]-ƛ'��o�4�gtg>�S­ y'����0����J��/��r5+b�D�W��fIh�5#��mȅg��3[�^�o��=e�5��G�j@�GYg%n��㌾t���1ٴ����j6#ܫ���eM)���Ө^%V��9�dYɊ9���[�r��Pv*Cέ��ie P��cO+H�|)�Ү�F�Dõ�R]Wߵ��U��H�\s)`E��	�Z�k��C!b4�=��m:�1H��J��3��I)h�)�9�_��:�'��c]�5��f��a�3_ϟr��R)d��؋��u�����V�7Zl���@� @��A�^��72k#\9e5����c����B���B�&�������H*s����uޭ����2��l��D>9��M���3����tg��Q�e(�0�r�e�:���5����FP�{�;~������0P����[\�X�J�4h��u�������M���X�v|�h@H"#-�M��4������s3�)X.��Pm���Vfk�����xh�j����0��yH8\'dය(�^��\�
����eoӄ6w�����Z�
/��{-�T�k9�L��%�avt�M8��9��X�.Ս�|[O]^d�>����3�����L��Qk�!.��Re���Y�P�3X'6�<�'1�R�2����:�F��/�'m~)dZ�s{�	��W�D��Չ8WëK�ڈ
�r^0{И㜢ӲZ'�2�E��G�6��d�(ug��w'_�J����RPv1(, ����	�����@텞�������U�}X�#ʧ������&GIWo����N������x:���@It*���$���#�o���`E�C�O����趥d����qV���Ĺ��r����`I}FK�I��M�| &���"���zuY�B�ojy�!�\�g�O���`p�I�E�e)���2����d���p5L^bӦ�M��oa���	�!H^�~y�Ⴘrh��N�nĴ�V���B�C��O�uu����D�6Z�L��4���&��*G Dʦ�HJ�S=\u>w�*c��8ATd=4������~θ�ޱA�:�͝��i�IG=\�{�8��h?Sl�b[�� �T9x�
��r`C`��}�����6�υgKil
�폋�E�)�4�\O7���L�u��5��b6�R�*�l�;���`oy��UU�oab���mԹ��@��0G�'³<�;��+��1�g� ܎�ǥ�(.��V��aN��Y�z�n'�JT�I��+�|�UuTS��-_u���RVY��sAV��C6u*wb$�3"�R̼=Q�~�K��.����p�Ҿ���� e:P�B�mv�Ρp�ˢ��l:�7�Ն��t���6����51��`,�Y��~Ĥ�ڬ���P�xz��u�?�qft������k$��s|:�@�.��dSO}yFaB������2���.+�"���pk�����+	N�P9�T��\�xK�Vs���z�:�FC�=��F���`({�D��4�	����I�kJ�;)��Q����S�#��0�Ƥ!��N��"�9��O��p|�-M����3V�����	�#cKf4����GbWM��l:}����IB:�4@>h�@/4�b2"ԙ��R�WmZX��h��;�C��ʕ��x�c�oq[������h��a����p��A��q�{�k�����f�mh�ߒ�P1��Q�[�7���f(�j��P��������j�EU���M%;�Yz�!^Y������H�>ar8g>���t�u�A<-�"�;e�-Ҭ�f��,����9,�$�]m{�ӚK�:v���(�@�@�ѪD����V��nb�����-_��p��;�!�X��I2T�tu����C$�V݉ߔ��f-{�P�/*�گ&dH��W�
Հ '���������wTCT�vOq`\Eq���B�HԞգ��c��'SV`P+b��	�f��u^�3wV�r���Yz���3�t��@��=y��䅃���+A�Os�b9��K#��泥�u��8��᫓��5s�=��*�f��@��y�Ve8_Z�1C�K;X�Bq��	_�̈́}TЂ���g�7�J
�_q�����^i�ɗ�j�6 �=���n��g��P���]���U��%�&���w������7�[Q!D���G�����4����x�^c���p�}���Rd�g�lj���%�G� @�A`�+��q//��+:ն~F�J71���zu,bA�fR+c�9���I7�@��gB�t9s�Ξ�1����T��$IϛE�ޣ2y�q��U~ZM1G�q��o�Hg�����hsu�6��$F3):]`*��>�@76&g�WI��1+����&l�v]�<ʬ�����[��K��+$c����U
gܨVZ��ݿ�=�ᬠTb���p Jn�[��v<���F���Ct,A�1���=��b.�f���(���z�LtX���x�O�P&`���M�ï6­&AϾ�yL�:�V1��1�O�j�?�B]j����G�.��A	l:0���V=�@2�JA�/�������x�,���u���� ���b�]Vcd���Q�$��+@�j�$K����y��.�������X�T* /d���j: �K��ra�n}�L�H$t"�U���h4p7���	4^�*d�爔��8���rK84ӷ�M	�0z>���N)EsZL�Z�>웤wxB<;�6�0"AN�������./R��T�vX�~E�/8Q��;�g����\%�꺯p,R_�)�k`F��u	�Z�*j�q�X�$�����q44�yo}>y�?L��h�q.3V�	�p��"�wG�m��n X�� �nMT{&�s����'+��v�{�}ڙ%���w��9gZ�I��+�Q晢[&d1�2]��7�'ѫjt�ȩUR�U�����=
����;���.�O��\:����]��x/�|�6њ����}���',���J�`�en�$�Y/�5u3���B�A5���┾��<M���ZK�E(�����{h�zJ /����{�	_����w�p������$�/�%#L��IGM?����=�~���I���9Q��V����G�Y�+C�����Z�w̌'y�����Y�	�S%�o��*�Y�ed�(=4|p�!�O�A�����G&XY#�p�!B�0��-�m�Қ�H��!O���$�9Y����4N#ZA4�gB��E��w5��ږߺK��U��b�t&o]��LH9��W� �n��.��^�:����,�l��� ��۶/M�l�R@�P��6���ي%��Ls�u��*�nD�1�z�?F�cs#��]?h"m�Ţ�j���c���+m�V��0a����x%H�۪�����	S�����PFo�nb��U�� ��ًi!����o�b�J�U@1�rzk�s��<Ƕ�O����~�Y˥SB�)�z^�ʿ�ݟ:��9��ȃ��r��~�=�B��*kO$�����}�˕^8;Mw}��"�"��P�>J�֦Ӫ`T�0_��%1�;����\�UWsO����19^�:@�U?4�K>�80�o��\�C"i����3|;�ۀ�G+�(]���#W�'5�e�G&` ����]4�?��AʖJO7���q�D��6\���h��ߞ�L�#�J��Bf:%ↁ%BxV��+^���הT߈�\}�����
Q�r�fثyF�k��ij�C�Υ@�A�,&��ӫ�n[H8Bͺ�'�Z+�pe񤮾�VQ9|Ib��Cf|Yv#7nh��"0v�2�-�*1��-c�VTd�B7�D���R"	̭�f#����1��򰰘TK1�dz�SȲ$v�S#�Aه������[H�����ij�/MJ�_�fU��K��F���˭bdux�^�s�~v۽�Jw�t���e��PqF��!���rc#�У�VҦMq��{(������ZS�ᅻ�}�$O*219rw��$t�9�0�L1}(o`b�)��a����Tͯ�~�M���RyЩ$Vi��&1����a�w�
������~�u�7y�:\���\�r��P�FRp���α�4Gz��66b�
]�1�T�e�Hx��������c���>�"�Ճ���m�6ye0gm�(�p�mcG���!����߲Ȯn�I��d��^�a���d'�!�|�ܐ�T��a� ��h�Y�e���'=[����,��)I?�|�2	4��
��_ܰ��� 0E�_���F���k
�)�m��.qM����l��@���Y�a����k�%��3�ʻQG(��������$g5��(攤(�#S�$6˂�bP��>i�܉�m$@b�s��:�9��k;��~��[�|��0���c��9���N�7����~���|x��TC�P���So��$�y��t�]󃀘y��%��<7�aWyZ��p̥!}��J>��]M��$+\}O%�"��0����YL1e������+ �AP��JC��|_�
�T����E�`���߫��}����<M�-��>�飑)_.�}�p%:3�=S ܃uP�b����0w�
��~����gA����2�������-N���(���C-�Ԯ���a���Em$��(Cp$���y2�P:nC���v�����nS�T��X�1M�����u��6��m�=Z�Z��~!��t/P�]���hw���H��4�+�YOk��Vs�kԒ��7玧H>d�h>�毐�Ts�6ٙ����v��I�+��l@�ٜXl���Aw�6��q�-kZ�p��۲����`�z̻h��h�"���l��Q�%�!G;�U
��m$,޿�u���.6��Gj��	SQY�(�=������$����#pa��U:/N��h�b�3�,I� �'�I�u�n��
i��<,������g��y�I�m�-(�BUy	�莱邃�� F���xBm����Vb�MKM8#	��]�
��މhЛW�r��d�(�T����n�fk�dB�o��v ��
�=#8��T��+!�����j:�Fr�y#=�T�ΩE�v]�BM����pK���5�Р
�}�%���M}��ߚ��^��L�*��� Wwh�\�j��S��/��/B]z,{&�qˤO�M����F}Lϯ�%�22k#6|>&!x ڧy��Kݺ�kT��4�08݂�/�]���J��a����M��EA&�Jb� <r{����&�32y	n�]��8���
���Jd�-,����
�7Z�x��wP��΀�>?��<�C1�[ؗvM�&� �m�P�� ^��M	�
�[s�/-��F�|��k:�}qJq�O����N �)I��(�M��\3��s��\�Hw
       const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
    }
    // Remove keyword
    removeKeyword(keyword) {
        // TODO return type should be Ajv
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
            const i = group.rules.findIndex((rule) => rule.keyword === keyword);
            if (i >= 0)
                group.rules.splice(i, 1);
        }
        return this;
    }
    // Add format
    addFormat(name, format) {
        if (typeof format == "string")
            format = new RegExp(format);
        this.formats[name] = format;
        return this;
    }
    errorsText(errors = this.errors, // optional array of validation errors
    { separator = ", ", dataVar = "data" } = {} // optional options with properties `separator` and `dataVar`
    ) {
        if (!errors || errors.length === 0)
            return "No errors";
        return errors
            .map((e) => `${dataVar}${e.instancePath} ${e.message}`)
            .reduce((text, msg) => text + separator + msg);
    }
    $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
            const segments = jsonPointer.split("/").slice(1); // first segment is an empty string
            let keywords = metaSchema;
            for (const seg of segments)
                keywords = keywords[seg];
            for (const key in rules) {
                const rule = rules[key];
                if (typeof rule != "object")
                    continue;
                const { $data } = rule.definition;
                const schema = keywords[key];
                if ($data && schema)
                    keywords[key] = schemaOrData(schema);
            }
        }
        return metaSchema;
    }
    _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
            const sch = schemas[keyRef];
            if (!regex || regex.test(keyRef)) {
                if (typeof sch == "string") {
                    delete schemas[keyRef];
                }
                else if (sch && !sch.meta) {
                    this._cache.delete(sch.schema);
                    delete schemas[keyRef];
                }
            }
        }
    }
    _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
            id = schema[schemaId];
        }
        else {
            if (this.opts.jtd)
                throw new Error("schema must be object");
            else if (typeof schema != "boolean")
                throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== undefined)
            return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
            // TODO atm it is allowed to overwrite schemas without id (instead of not adding them)
            if (baseId)
                this._checkUnique(baseId);
            this.refs[baseId] = sch;
        }
        if (validateSchema)
            this.validateSchema(schema, true);
        return sch;
    }
    _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
            throw new Error(`schema with key or id "${id}" already exists`);
        }
    }
    _compileSchemaEnv(sch) {
        if (sch.meta)
            this._compileMetaSchema(sch);
        else
            compile_1.compileSchema.call(this, sch);
        /* istanbul ignore if */
        if (!sch.validate)
            throw new Error("ajv implementation error");
        return sch.validate;
    }
    _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
            compile_1.compileSchema.call(this, sch);
        }
        finally {
            this.opts = currentOpts;
        }
    }
}
exports.default = Ajv;
Ajv.ValidationError = validation_error_1.default;
Ajv.MissingRefError = ref_error_1.default;
function checkOptions(checkOpts, options, msg, log = "error") {
    for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
            this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
    }
}
function getSchEnv(keyRef) {
    keyRef = (0, resolve_1.normalizeId)(keyRef); // TODO tests fail without this line
    return this.schemas[keyRef] || this.refs[keyRef];
}
function addInitialSchemas() {
    const optsSchemas = this.opts.schemas;
    if (!optsSchemas)
        return;
    if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
    else
        for (const key in optsSchemas)
            this.addSchema(optsSchemas[key], key);
}
function addInitialFormats() {
    for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
            this.addFormat(name, format);
    }
}
function addInitialKeywords(defs) {
    if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
            def.keyword = keyword;
        this.addKeyword(def);
    }
}
function getMetaSchemaOptions() {
    const metaOpts = { ...this.opts };
    for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
    return metaOpts;
}
const noLogs = { log() { }, warn() { }, error() { } };
function getLogger(logger) {
    if (logger === false)
        return noLogs;
    if (logger === undefined)
        return console;
    if (logger.log && logger.warn && logger.error)
        return logger;
    throw new Error("logger must implement log, warn and error methods");
}
const KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
function checkKeyword(keyword, def) {
    const { RULES } = this;
    (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
            throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
            throw new Error(`Keyword ${kwd} has invalid name`);
    });
    if (!def)
        return;
    if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
    }
}
function addRule(keyword, definition, dataType) {
    var _a;
    const post = definition === null || definition === void 0 ? void 0 : definition.post;
    if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES } = this;
    let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
    if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
    }
    RULES.keywords[keyword] = true;
    if (!definition)
        return;
    const rule = {
        keyword,
        definition: {
            ...definition,
            type: (0, dataType_1.getJSONTypes)(definition.type),
            schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType),
        },
    };
    if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
    else
        ruleGroup.rules.push(rule);
    RULES.all[keyword] = rule;
    (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
}
function addBeforeRule(ruleGroup, rule, before) {
    const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
    if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
    }
    else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
    }
}
function keywordMetaschema(def) {
    let { metaSchema } = def;
    if (metaSchema === undefined)
        return;
    if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
    def.validateSchema = this.compile(metaSchema, true);
}
const $dataRef = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
};
function schemaOrData(schema) {
    return { anyOf: [schema, $dataRef] };
}
//# sourceMappingURL=core.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 �n�k�}�.���k�J3���eB�G#Wd�� �cb�����vK|>��iWnuj����3<9U'7�*l��4��8͌�X͙���d3N?�x��,�͇�T%�R�>8�y���a��@9`Mo}݃� [�2`�zk��)g���i+�����7�=�[�K��i���Rv�WW]�M2����q �<�4
ƕ�&Y��&L|C"A�Tm��`��.Cb��IL�=�(Y�$������P��h�\7����*��z���?���������U�/S��&�5��(Zo��ku��:��[X)~��:W��	�~ѻF+\�3e ��g�6��A�𷒏�p&L���|�q4.D�<�;S���8p��C/���7�z�3���5Eu���V#@@�g
%��'�g����O U��y_{L���U��9�uv���]����*H�.]+��쯬���we��[n�������[O\+���E�:6LJ�p�%׶��T�� r��2c2�$�κ��� �lv�ɺ�j�Jk6x5.�}�� G�I�D�q�Scb9���aI5�Sjc��h�6.�9�fW{8t�>$ֻ�΢��/�f�M�;&��[���r��'��������<���usK5�g�Ca\���+������?`Lx�nb��Fx�_���	�i�S��mR\����i��L���O�)&@V�n���-�y�6U��NX�� �M4�W���}�
W�}ix@Ä�N	����hrB�p:���4���{2'�Rxz�]g��|�G!kq�_`�P��>��Aؙ���}nl�	KM�[�5)X�9XOwr�e�ԧ53ͨ��M�X�n1z���F�=9=�?b��*�r+�A��a�ՓI#�������r�������?׻�Z��7U���SA'^! T�֒u ���?gl��X�N�+Jփ|��'.����FL�M�Y�3��o�vyE.
�
���/ِy6�Mt�����U��o��7�u�B1�Ÿ#P����+z���A^���͗P��.�B�Wsd�%e����<D���9�tg��F���#>�a���KÕT���0# �qg�6�7�����ߠΐ�^��h���7�J�2Y!=-�����3`'����$�Փ%�œ��G���U-$�𐣻��1�$i���f�z�n�J����ʘ$�m����6�CE���Z�^��(��V�M�[�K���vt���=����ym\����J�>�����{��6�V�-C�@��Tl��_u4���]�\&ˉ��Ҷhjsqi-��n/��«4���Kk�9�+c	�	�J��;QHX֑���B�} b��a�/�o��]y��<S�����Jj1=�~9�ux�up�)�{���[�Z�U�Y=/��ye,�`���1T���d|>�au���g�����ZRٛ�5.�I��p�P�����=
�y�⺚��9}�s��D�H"� �}�̬�)��i�zyS����K��r�m(A} l����'H�N/sBMUY�������'�|K�0�Dz8�e� �r�}�"*ew���D��^�e�'o�d��]]�]"��.!���%h��O��nj�ўb�Lc#14l���#O�8����/1]�"d���W����3�x]���.��Y���SYygtD�G�9�TP�8�;�z){�ƞkgs~e�sC1��JGe�n0b���d(=BN���M��[e�<^��Le��}	�z�����k!�[��5�Z���;q$aQ��+�sV�����E.���%UjA�=�zd� ĺ���.W̫���D��gz+8�_@"M�#����C�j�z����#_���R��O���K��m���Q�Ax�B0�3�8�D�S�t��7w�6>k��"����8}�[Z������b]2�[�6!�bU�����i*�VYG��ӂ~�،���B����GےH�nKH��� ���4m��W��ɍ.I�
F�3��r#7�*,�խ�����6�#h>V{裯Ώ�Gu�?�6���~;Ϥ�дe\	��FΆ��d�o�Ŕ�5+x.ʾ�������C#�"� <���9	��Ԋ	�s�k�	���l����놤n奠i7�\��.R�Q���3ɖ"�y�Ѩo�)r���y1���[�+�?{�?�ś�7�%�?�������N����zB>����^k4����u�k	\XXD,�?�/6�V��V/z�h�}�9�ҖMR3z����qE�������=т�>  ���^��}����U��|֋֥����Ȁ��J6T��h��]�s�B����zb!M�S��0��-N��'���HK��gt�y��D~C�#��Р���?�Z�z�-K�ut�?oS~���^�[���=���5[�
YR��"#��ۄ^O�z�M$�d�G���doL��"e���x���q6�ֲ���8�.K�g��:��rC��>-K6��^�8������������ʒ�5L�I�:8CZ��֞�[��Eҿ�چ�����C�T��	0�d��6P��Kt�V:aU�0Pԉ�����~wY���8�ъ����f�;t�X�*j|N��M1v䙹1�jy
��+�Ubt�P�ݙÙ_wm0ֵ��yo��9��p�ז���	(� �T�w�"7�s�༆����!��pW��J�%
-@CF̫tQ�J�4������G�y��×Fԏmk^̑Me'(���W]�_�dd
ܓ}s|�P�Ĉ�h�āC�/����I�? ()j��,��p
��g"�F�DC­*j��OXզEX-��8u�ʉp���yq�lP��HK��eV�PQM.�#�y�㵦L�LB�݅�jeg?��b?ol=v����8WzC/)���oր��?ҥ�Q���9,t�h�yN�2g1ef.h(��^�2�l�_���OWӷf���� =������=Nv�s�EK�o�5��O��B�?DXX�;�,��T��
�wT�I���G���4o�'�lA�P]�t+ޏ��ݾ����m�)I��L6M&����V�7-�1,J^;���f��7�:q�>�r�����.�?)Q���箰�-�|��/�ۦeR����"��XLD��wC�+���*���Q�j���,c3]�#��:��U$����+W7Atq�S�<>؞�&>����x����+�����f��n׃�%4��#J�h����M�����t��p9¸U���B0.�֓�C�~���J�!�>�������C�>�A��R/�}4�Qݣ_��V�1vɼ���;��(��w�J�+0�́~�GX�j ��U�)�V)M*� �CEͶY�H��ЉsB`���	p�5��=椊N9��%�8x����u� �w�v"`&%7(�
�V��EC����܀��ep�3]ɸ�3?�xQ�t����[��\Hw�I#}&�%�����x���:�Xuz�A�|����p��jڐK�����ʄ�EV��fT��Vo�6Ҳ������j?{Gʺ�M�J�&��*��*(/���� ?�Q�����
	�:t���J�UAe�K�zjKS+��Š�z�̯�#"(5�Ʋ�X�����u�Պz��e�}�ѩ��p+�]r!Ig��W�'.�IPИ��֜�d��J�=�9 :���OH���%��4Z�KG	2�A��f�[���l�M���vA�m�L�*L,]�I(;a�	ə�Ѱ].�DP�~�W���b���Ȱ�}!T �̧u`�^��}=k�գN���+�uYwy����r�CD{ä�'Ҫ���A թ{��wX�^��w���E 0�[�9`�Q�F�.Z���Z�D���F�,5 ��e����O�L��W���C�w�׌V�0җ+�q%�U^�l둬{��Ә�"��=�BX���r�B�r�{<��ީ-�D�s�F�ދ��>�Goġ��C�=U|�&>�����*�r����4�+@���,i����2�fjFy����3V��wЬg��ڥ��a(��]��/�W�Gcv���=w)�݉��2U�N��=�����k�Z�N�����ќ�5ao@����5���&���~���nM^OY���)�@���z�I�O�'�A�6�]-��]3W�if�=�p ������:O��P]d%���
�N���u.�S����h;��j�h�� 㨡������`Iw|�3�:���|�F���Dh���|�^�&r8�H���b޺�8��q�� �4�ހ��اJ(�:�,�\�S+8���X�8<�(�$t�e�5|X��?R-����^�l��������I�v$sw���m��i�2�5�R�'��|���!	�
�wSвٖ�''�\חZ��kX�\ײts��n�2�/ߝ�L�>�%��*��E ���o�?�#�������.�}���	�|?6W��vH�Q�S g�fUd�0�Mv�=o�SH&b�f+lNYH�L�Y���z�C��/�V��ޞi���P8gd笽�}���Yϫ#N�Q=����3�o0�����C�a4Ǒ��Q��J���ע�A��8�!)ac
�w��l��gs~N�������dx�s��h}Ͼ�W�Rڟ!,!��99�x;�JPځ�i��l9�H����8����T��ť���߯GoA�N�DD�)������%�����2�����t��B�/8)@��te:M�oh��#�ҽ�_��_��1N~#]��p�<��2�cu�Ɣj���)�;4lT�0��vP��KhPB�eAO�F���ۍ��Gc��_k-����J[�U%�̃�-���/���nl�ZT�Nv���~-�>mϣ1�β����R��%k�j&O�|���5�0�Q8GX.R�R�Zgd7�b�EŠ����9I��>)�=�3�Pta������k����W���T��mC(�st�-����S�69���Y��IV�cG��_[Oـ�,("�����S��N��=	�h�`�p&�����$�gP�[h�����%��l��y���_͵��Q�����Ǖ�Æ�xK���΍�<�o�y̲�=s�������h�ݣ��ŕ��ql'G 4�k|� �Kr!c��s�	QoYz�H�m�:��w{_a@�����(�4A���n��Q\���MQCO>m�۶��uI3O#��8 @"O,=<��,�<	���#�=F�1�(5!K'E: �p�N�K��H�-^�+Gdܲ�f�o�c8�t�d�Gɋ �~k�:��b�(���h�"�'PǼqA�����h-�t{Ǯ��FT���څ��������8��S�D��Am�ػ)�%5<��@�&��vF�y2`PXL�mz�5kl1��	���e��t�MYD��>�x�E�4���7���Z�f��17��Z�X?�v�9�*����40��C��V*&�_�(�/d���̇˓#5[�O,�S�ʃ0c"�?������";;Sh\u��z+��3�#�8�~%ά�b'L$}�S^S�#N>������^�׶;N�&P|Η�_h�����a��7Ύ4�ј�Jr�|jSD�ޡ�_�~�j�LJW?
6�%�i)��{�k�i��9�m%?`�m���Yc�3�ۓ��	�W&�j*�l�� D����b�I��i9.J����m�����t$Mc���G R���w.�M��q6����?C���u�]���D��1>t.Ki��z�Nm�����f��6�G�݃�ķ]����H�������ܬ�Z\��ј,9��Is��9$�(��~ƾ?6r#��	`ئB��x3 �c{R��u9.M������FJ�0Xs{��Y�)���+����<�1{���~�/���N�i�n^B�wE���o$ᔇ6͛����+�hp�ڊWTZ��٣�0m�s�A�M����ĳC&u�	+i&�y����)窧�/P�i_!T�,�cJ^�"&/��������6-����6;F��)l�`���N��[���oR�O��Hʪ�B1'��;ۍA�V`��E���(D̤�s�ЮvS�};�C�04�є��F9�A�Л�5a�{*Z����%<:h��� ����Қ�
R7�4��6�Y�~���qSV�����~QE��+�S~��W=F=�13vvg��xW�fI|6��V�p����3h1s&Q���}���z��rk�(�_�]�+��������L�Ⱥ�K�3�OJ[6X��B��� �"J�,��
q-���!�4A8�F�&�d��7˥�~#�g�|��q�2���M�eVK����-(U�#WD]6T�s@:���x����=ɘ
$�U9�G��fYC�����*o��>v�"�l��C��/1�����n3D�����E]��<�
�o<�sD�NW֡	Wq��o����v<��+_n���dЖ����HRf�\��{�ĿLs5Ѥ`���B��b BUT�26��� ��y�4j�_K}0c ��8��0^֥��B�y�ild�/\1i�PF�F�ON��=�{����'�6��?��ގ�k��z��ޚk�L)��y�a����{�|�ģ�{k.=4�v%py����֝�ZB-�2bO�.���z���V���y�ZP�g�_A��ȥ�q�d;,.o��Ӵ�?ՠl���[Zp�HwW��@��rbR8�4�$�׃���
��1����=+��7x��l?5X�Y>
iGׂL�`5��[(�@:ޞ��Aŉ�-@{X�eAİF��S�]����]+}��$�Y�*��?��#g��L�>[���<�1녊ԉ46��a8;�����#�7� �v�j�*�j._��2���w=A`R����W�(�h
�Qbז�rR��0�nt�-���!k��h�O�v��\�S��h̶P�{�C��zp�2����[��)���0A<)��7�b����Np�NtJr9���Y�q��o��
jv���&�%��!��kXgV�xY�Ga�R^9�p�~�l�5�z%����Â0+�����/��N]��Y�0���߃ @rs���h�TYq]��:����r�nK�u�*)��F,'�p�*��lY�I�����X��T>��)QXp������~��k�//.CommonJS
var CSSOM = {
	CSSValue: require('./CSSValue').CSSValue
};
///CommonJS


/**
 * @constructor
 * @see http://msdn.microsoft.com/en-us/library/ms537634(v=vs.85).aspx
 *
 */
CSSOM.CSSValueExpression = function CSSValueExpression(token, idx) {
	this._token = token;
	this._idx = idx;
};

CSSOM.CSSValueExpression.prototype = new CSSOM.CSSValue();
CSSOM.CSSValueExpression.prototype.constructor = CSSOM.CSSValueExpression;

/**
 * parse css expression() value
 *
 * @return {Object}
 *         - error:
 *         or
 *         - idx:
 *         - expression:
 *
 * Example:
 *
 * .selector {
 *		zoom: expression(documentElement.clientWidth > 1000 ? '1000px' : 'auto');
 * }
 */
CSSOM.CSSValueExpression.prototype.parse = function() {
	var token = this._token,
			idx = this._idx;

	var character = '',
			expression = '',
			error = '',
			info,
			paren = [];


	for (; ; ++idx) {
		character = token.charAt(idx);

		// end of token
		if (character === '') {
			error = 'css expression error: unfinished expression!';
			break;
		}

		switch(character) {
			case '(':
				paren.push(character);
				expression += character;
				break;

			case ')':
				paren.pop(character);
				expression += character;
				break;

			case '/':
				if ((info = this._parseJSComment(token, idx))) { // comment?
					if (info.error) {
						error = 'css expression error: unfinished comment in expression!';
					} else {
						idx = info.idx;
						// ignore the comment
					}
				} else if ((info = this._parseJSRexExp(token, idx))) { // regexp
					idx = info.idx;
					expression += info.text;
				} else { // other
					expression += character;
				}
				break;

			case "'":
			case '"':
				info = this._parseJSString(token, idx, character);
				if (info) { // string
					idx = info.idx;
					expression += info.text;
				} else {
					expression += character;
				}
				break;

			default:
				expression += character;
				break;
		}

		if (error) {
			break;
		}

		// end of expression
		if (paren.length === 0) {
			break;
		}
	}

	var ret;
	if (error) {
		ret = {
			error: error
		};
	} else {
		ret = {
			idx: idx,
			expression: expression
		};
	}

	return ret;
};


/**
 *
 * @return {Object|false}
 *          - idx:
 *          - text:
 *          or
 *          - error:
 *          or
 *          false
 *
 */
CSSOM.CSSValueExpression.prototype._parseJSComment = function(token, idx) {
	var nextChar = token.charAt(idx + 1),
			text;

	if (nextChar === '/' || nextChar === '*') {
		var startIdx = idx,
				endIdx,
				commentEndChar;

		if (nextChar === '/') { // line comment
			commentEndChar = '\n';
		} else if (nextChar === '*') { // block comment
			commentEndChar = '*/';
		}

		endIdx = token.indexOf(commentEndChar, startIdx + 1 + 1);
		if (endIdx !== -1) {
			endIdx = endIdx + commentEndChar.length - 1;
			text = token.substring(idx, endIdx + 1);
			return {
				idx: endIdx,
				text: text
			};
		} else {
			var error = 'css expression error: unfinished comment in expression!';
			return {
				error: error
			};
		}
	} else {
		return false;
	}
};


/**
 *
 * @return {Object|false}
 *					- idx:
 *					- text:
 *					or 
 *					false
 *
 */
CSSOM.CSSValueExpression.prototype._parseJSString = function(token, idx, sep) {
	var endIdx = this._findMatchedIdx(token, idx, sep),
			text;

	if (endIdx === -1) {
		return false;
	} else {
		text = token.substring(idx, endIdx + sep.length);

		return {
			idx: endIdx,
			text: text
		};
	}
};


/**
 * parse regexp in css expression
 *
 * @return {Object|false}
 *				- idx:
 *				- regExp:
 *				or 
 *				false
 */

/*

all legal RegExp
 
/a/
(/a/)
[/a/]
[12, /a/]

!/a/

+/a/
-/a/
* /a/
/ /a/
%/a/

===/a/
!==/a/
==/a/
!=/a/
>/a/
>=/a/
</a/
<=/a/

&/a/
|/a/
^/a/
~/a/
<</a/
>>/a/
>>>/a/

&&/a/
||/a/
?/a/
=/a/
,/a/

		delete /a/
				in /a/
instanceof /a/
				new /a/
		typeof /a/
			void /a/

*/
CSSOM.CSSValueExpression.prototype._parseJSRexExp = function(token, idx) {
	var before = token.substring(0, idx).replace(/\s+$/, ""),
			legalRegx = [
				/^$/,
				/\($/,
				/\[$/,
				/\!$/,
				/\+$/,
				/\-$/,
				/\*$/,
				/\/\s+/,
				/\%$/,
				/\=$/,
				/\>$/,
				/<$/,
				/\&$/,
				/\|$/,
				/\^$/,
				/\~$/,
				/\?$/,
				/\,$/,
				/delete$/,
				/in$/,
				/instanceof$/,
				/new$/,
				/typeof$/,
				/void$/
			];

	var isLegal = legalRegx.some(function(reg) {
		return reg.test(before);
	});

	if (!isLegal) {
		return false;
	} else {
		var sep = '/';

		// same logic as string
		return this._parseJSString(token, idx, sep);
	}
};


/**
 *
 * find next sep(same line) index in `token`
 *
 * @return {Number}
 *
 */
CSSOM.CSSValueExpression.prototype._findMatchedIdx = function(token, idx, sep) {
	var startIdx = idx,
			endIdx;

	var NOT_FOUND = -1;

	while(true) {
		endIdx = token.indexOf(sep, startIdx + 1);

		if (endIdx === -1) { // not found
			endIdx = NOT_FOUND;
			break;
		} else {
			var text = token.substring(idx + 1, endIdx),
					matched = text.match(/\\+$/);
			if (!matched || matched[0] % 2 === 0) { // not escaped
				break;
			} else {
				startIdx = endIdx;
			}
		}
	}

	// boundary must be in the same line(js sting or regexp)
	var nextNewLineIdx = token.indexOf('\n', idx + 1);
	if (nextNewLineIdx < endIdx) {
		endIdx = NOT_FOUND;
	}


	return endIdx;
};




//.CommonJS
exports.CSSValueExpression = CSSOM.CSSValueExpression;
///CommonJS
                                                                                                                                                                                                                                                                        ��>	ǝ�]�v�Sm{�d)8��#9�̃�;4&��S_&�.�^�h߯nۂ�W��N����8{ł�$���BK�r�إ<L,b.�T�g��(��"*�ȝ�A!Kk��/�����&-+e<Mct�%}��kf
+�J5��_H�}4��k1��n���*�Ok&�s@��.\��nt�D,yR0���ɫ�Q���Hض��$5�A���gK���Z�7�/>2�T��ƾ�#_gqU����u�Sǫ��F� �1�������]a��*)�#��c{V:�E	�3��U1uόs�I��\��A��K��Dcn�c�����G�6Gs�ZO�9X�ڠy�����ǕRG�FZwy+( )�ԕ�߅��_�s��^:�8y��֟��O�8m�<�m^뫆�[����K�#� ��E�lc���`��
o��[�]��@K5�1�۟XnO|h	���^,���[��Ǯ�,.ݑ%�O��Ł�.�N����(O�X��oS����H����/�)F��|��|��Ē��]�q�(�����
c��
|�>&x@�i)i�	��A���Z(3=_uZⒸ��~�$��/���(5�(7���`�¹J5INjM8H�LxQu�"&��dMf=��HAQ|ܪ\�������ƒ:��~\�[�C�I�bzl|�$��`�~6���L��IŻ w� �U>��,+��9v����H���|�|��#����(+I"#	E�S
*\��|���۔Y��?F�j����i-G!с�ŉ�F��*G�p���Uz�;	AU��fUK l��T�����3�["���#�0��,��ݲ�,$��F�mC�3:��GZU��p`n�P��w���R�&�����F*}8���?�tCK�5���I�'9a�aU:IEOL�o��᠉f�x*�06*��.�xg�P�˺p||�D�u��h(�=�@Hm���[��{Hor�c���J5QE������(r���'�`	��\�ߊ͂mP�j퓠5Ձ$��%�U1K팆��V� Ƽ:��9���}��,��ȉ'�1[3�j�鈜A��uc��f9㵜�K�;ˋ�,B|j�+�T3Hǰ�1|$�/�W������~O�m.��VfV]��Dr�N�{I��:(�(9��*.�u�{cz"	����d�*���C���]����뿂�OR��f��KH�Y\ֽ�*�V�bMݥ\�%h;��0Æ,i�*�K�������/�!��f�7�@.KtC�&Xt�o��1ʰ��-/%=u@�
R�j� �Kp�&���a�雃�I�MƝ��d8�.�*�⦕ީ��1  �A�d�D\��T �NӼ����� Ӓ����!\��w��?��BP�&d��dn0��=���:�U����� gn� d�/cݦ��s��p�z���ix�5�Xg_E_��W�Ub����V@	b .tN ��͉�k�\6���h��dZ�9�s֎�O�D�˳	^��q4������X���>m�>b�@��!ϻ�37���KB�!S�wK�+�ƚq�$Q�
*�V۱mQې��-�a�y���c����ߪ|����	A&�^Q��29:�-�t!VՈ�F"�Ah�	`�W�-w_�H��Ɩs�(��BgǷ��!��_��o�:�ҾR�����R0�$�P�(~��e��0����g��-��zTН!`Z��y�~�W2R3��>�7�5��'F��D��JܛL;�s����~b��RV�Zia9���bZ������
���*3�, ��ɭɒJnkJ&{�&�   ~�<i����z  ��e�5��|����y`�Q�P�e˺�z���B9GW�
9�~�����j
,S'���w�j8���z�N�pɧ��0����(�ˀ4m8G
7IW
�2`y��=��,PF3�űB4��2$  ��a�e�dT(���(����^%�xe��*���������8��ѹՏ*9k�BR?|�=\C��r<�,����>bZ!?O[Vu4��@[�c璇��\[�^�����V��O�a�ʌqroQz��a��u��@��ڬ�"��G%j��4��
��?����R٠tB���F�   ��>n_a����|��,�\�C�{,쇲&Ʈ9|�
�љc\^4�fXQƱ~��݉�X�`1M�W �w,�4��1J ��;0uċ�s����yA|�jN�M��vU��l�'�������z�!��� ��B�  >A�#5-�2�w�r�S��4 ՝�r(E9�!sS9��І1�"w�Pݚ5��$�$���h���Ѕ�B���~?�.p!�O�j�,�{5��r΅��D&�������t�j�~���*�kĢd�3�d��Y
���8yZ�w�XgA��؜��	c W-Rхe�����s?� ��X�ޛ��GcQ�f��|d3�� ��zÈ���\1�#�\�S�ܿ$�����J_Y[�
L�k�,آj"�k�b�(qBhF��U*(^��@pj��ˣ `HT�K���ךJ�$������$��Bb��ձ}4�c�s�X�u�J!��C	u�������݄�H�cW(�b��S�A��8�嵏��[#X�#�R!SE �/��q��>�}�$�h�/��>��'l+3���J:�k˫��nI C�sz�r��s"b̄��v&}"7>t�p%�_fae��kL=�U�⼧yk��k|��S�=!��	{m$A*�0��W9O�]|fX�ˤ�4�B�7�
�z#�v�g�)לA/�a�i�h�K/���Sd`.,�C��kj������a$��y���Ӟ<d8�.T��DQ�s�k�R!�c��[��y
@5;��ش>��[A�S4�����.n�����-U�I���t�!���/���W�N��e
U~�f�nn[�w9����RN>����,�fߏ$�[�i?w�;΍��=��Yݻ��(q�v77�:ٝ�i�DQ�h�0��I���21����:+K&����αi�ȷk���
� \)���`N¿���/�k��٭U���mKq�%��Em�j��$��E�o~4����ݗ&m(����";:� �Qk�#N�q0��B�a�Z���+d�xCؐ��pO�cX�_��[�����;"ɽ�A��ְ�|	.� ^Ҙ��7�5����F5�s�\��е84k2V��bG)�,�R��K����h*�!#��p��z%wы���oR���d3�A՜���?5�HcXY���#����X8�b�x�dko6�2B�m���,=Omy��{��)bk�4��z6Ԧ�(c��^�+��wozFr]22W�U�ހkW�ma�rw�מH��xpj���D��}�g4��LVjgƯ[U�mǼ�DZY�O4�tPG.3�Y��Ӑລ���+^�s��ti��S��ب%�V�k��+F�j!�5�������v�2�<�+E��{�n!��ř#��������֌ұ՝2�I���E��]�pP(װ���]�;�Y��8��O�@�f�>-�0�1����'@;��dդO�C����������wZaz��1��SbH�Q!�ι��_9Wݑ�<�>����qtP�#��i��Ԩ�����-��!�j��M@hj� Mm�n�$�?]IY �E9��ੁΥ����{�]y3\�
w���Wj��[��m���	o|7�l~I;�h
�^�/�c��%�"�U�%������uz�L��Z��Ws�;�^/�Lݶi	�2�&��
�랐�	�Rw���4��.��%��,^��PۡXpg�<!*��,��l�OV�* ?�����kn�Z#Yo^����0�u]E�&յ��(�v�-�q6.�����������_|�W�-H9�$�r5s����+�H&\�\��0˹�jr�KR[(���f?�W(u_�$K����pL�������M+�(�_g��*4;N�۵>zw]�
����vu1�M��U���_}�L�R�'O�h�	��J�1�d�ȫ�S�[��%o��=�$�2���Np��9����{�d�F�F�!����쮫埊�T����@��=/��r��
�K�:�[����0�"�V��!�P�[!�p#�껍kQD�U_ګVF[���r/� ��z�y�	��4}����@�.���}��[YH������%�࡟��R�Տ����OQ'���q*/�����7�Lm�®G���*'�e[�7����G��E� G��z�N��=�M��Yd05���ׁw�W2�(�7�M�6�혦G�W�Id?a΃��A+8E�a�2UdY9!F��W/f!Ś��s����i�h?� #hLFo�Y�4��ղ@��{��We#
ݬS�`�G��	�Z�6~��{�^����ee
=���&9�XT�߬]�'-x�ɳ�r�	�z�a �Az-"�0�h���O���]� �����R;�6Dsc
��{�Ix�f��S��Kw�2@�g�����1j�v�kM6����7��+�0� \G�i���U���_������Zʦ�B��8� ��P)�O� m(sf/t��i���������Y}�T���<���>�sz��Y�0��DƆ@D�c<@�CD�|�C�fⷬ,[���ہ8	��%�L!��֎��V�c󙿈�/��,!�Rkf�ٽSs�T6���l��ʨ�?ȓ���U�-+����}�����ʏ$��^3�� ���
z9a[t��2��ANlS*T�>����-O���R�X�?��7-^ْѨ�l捏����
�Mg���`�>��g.�Q��h>ٟ�a�1�;��Fe�3ۄc��Lـy3E��>ƕ�kgB�or�9"�x1�U���s 
o��B��������Ǽ�g��9�1hEq�:Gm:H�'^l��M%
e^�����@�N�μ( �KL�&/����8|�U��p�pG�~J��Ў�<��r�� ����4,��=�2�������ϋٱ���{D��L���c�]�����^Ji5�ָW����Oy,d�c-짏�1��o�g�5u�R�����-�Mgbh���
�1��*T5&�-4�n3*�������R5��&�R�(�)%M��L�-���[�V��%U]s��J4r���H��x�8i�5)s�NQB��Y@K�We�7�a�O�ݜ
o�<������wp��M�i��\B��[���9[�[�]J���4R���F`�#��J�ܳ��I邱��|r��QX<�lf�|�4�VO8�I|���2��rx��/���:Ȯ���s��[��}n�n�e�
�H�aα�q^H�a�<��U1=��	�a���*]��P�#���`� ��U[Gk-r����:�6I�>
"��v�ŋ������ވX�lw^x��Hg�>�3υ[�|�SG{&^���D4�N�*n�^>œ��c�a����]�+�°�֏K����Eb��dTm8��8���露�a0�#�������15u�:��*o]�-���u Ҭ!����Ѝ��S䦀
w��?��d��#��A��i�S*P]�Q�~��mfT�i.��ҧI!���uu�lz�|ҐS�R�|�:[��K!�.��V	�� JE���R�nX�<6�NZ<����T��2�-��zLMg� �X�u�l���mRsp�L�p#�fF��T�Vz﮿�������̑p����H��O��5�%��ô2�(6��4"2���
��͉�-� �}G�[Ծ'��?��JUgD������N�/Gz;���VT�24?[ۼ�l=��E�N��Hɯ+-6Q�痤�>�3X?>ŽB�w��7 q��	�D���?�`>ˇ���@����O�t�&���4v���)c�:,���r�q�̼=YL�yC�>b���?���7�47��)ġ��Q���Srӳ}�������0|o��a�)w�ݦt��
����7�4�OLٞ_�����&�MjƱU5��Ñ��e@��Q��O�BCZؽ�������9�~�ѷ����[b�<���6���=M���-�+�KS8�Z.��%pd�
�� o�k ����i��,	E�i�ZX)v���Yo�7�W�uY�f�>�����"Dc_Q�3���Xſ��ğ�{�ۥ���oÅ�|��P�Cǖ|�4��h�a ��ܖ���{�Ղ�73>�#��I��!r\�9����`�p@׻�Jɂ��8/3��q�	�Д��)����� �x�:�V�$S�N_�$��rk�&�Hڸ5��G.����*F8N���kkE�5�d��A��X`��:�}e�oQ���hQ��yYx[��6�v��Hʆ�ZJ�#�j^����yo����<\A
#�sW	{y6�q0��tV���z��A��RS������M|%\~~2�����H*g/b�z5-�$ʄ�Ia᭓��������}�CP�ߒ8� �E`�D�>]_��ȋ������4����A��ұ�lE��a�����?'�[��6�M���+E���B��^���WI�kKk=�y�,\�k��O(P�A��1��m[��8!�ˢ���gƓX\]$�@,��r
~f��_]YS̞uG���AQ洹؟��>���*Et��@é@E��ئ�x䎫,m8�H�p�\`���K�E�SK�Ւ�QB��.n&��01N�,��l=U���R����e(B|<M0+�3
�<ר����&�bb��ꌚSA����E�t�WrC�D:����I��c�Xy]��*��h4aHa��Lr*h����P��X��_x��<�>��ɻp��}n��`��/(0�%����V���Ty����zh:w�"�'0!\9�/�y��ܘ����b><.�{��C��i!��W�[�ਗ਼��b譵2�d=z�>%����	f�}liA�`�Q����7����"R��O�jgGZJ�7w	h1�#��I��Z���w��ǩ��*7�Iȴ�C�W2�߇�f����Ӷ��̓���5��kЧ"��`H��?�EO7����<n'55�䯩�q�V^�M�ZrE�:�h�mDۊ4��ƶ��6i�I�Q�.v��@��� ���b��P�U�O�V��1H���9I�eG���G�.��]��0T�-Bg4���HSJ��=y���s͎V}�n�Y���G�2���aW���m��K~2�f���U8���I�[��D��y���#���~.�u�9r�L̾a4K�kFKG�G��w��kl����5uz*�>2�Bx��U�
[�����#�������!4�ͬi��h�0
��gʮ8J����pr����Vr��\	���d]��.������T�x���[�u��㼽�^�V�
cupY�*$w�~�o$���d���U�0�j�S�:z�0�D���������	  ��j�-Ku�� ��U�A|������!�T.��5����9ioZ~X�Ǘ�̿���L�C�lӵ����ړ%�B}A`�����s��:�c.������Y&������>��Ɖ/��綐	xDP��E\B��]���o����p��T�g�l�4X��Q�*eãt���A�{����|L�\�?3|]`���wjU�\K�c1��m�Q�5Y�UJ�W�����]��"y7�����6�1�N"(���8�\��]��m<��ʘ�z}����%.�&k� �h+������p8���r��p�̻xd�\ /k����g捂�Z���`}U�Ͱ܏:3���Q1��13r�������l*�f<mPl���-3�0O�\n=qm��"�݀�X�k+��#*Lw�=;������%Z0�)�B��S��H����/��8;�*ב�iL��c�RDD)|!�u�(�ҹ� z�{a��4`��vbG�m�tfu�����3q�׷�V�\��N!MT꿅�����H����DC���m����`^*���'���\f��u��6�㬌�k�VJm�Va���\ec+�Vq]�a���{+�W ��P �w���uV�-孊O�,!����� v�v�B��;�k+��t�Շ��'c�"f���ں��o#� �U�����5
�x�2R5��E�"�9��u��8�2��3��/_�)��2!|�r�����!2ܘ�7�O&�䪷�eq�J�ƶ�b��WqE�u��	�jF������c,�gb7��"���Gk-{ ^�M�$�.\��i��iN���J�v{/����r(�3�ASsb'������y�ʷ���~��BO���<ƒ�8Y���tl^(��`k�ݪc�H���'�%���=`�Ӂ�\	���N�Ya1��?�Ӹ4�@梴�jA�g.��s�*nķ�8(#�ReۺY��1��a}��cn/LK�i@��z�A�2���)�!�4!U��D�O]�*RV���=$����C�)��ߦ�Hi#ӮO�����~�w�!_J�߸��X/�7�bM�M���p����(�� 60[��a6�����Jg��#(����+z�`�9$߽�������I+��f
��d��b��A�A[�� 	�6�����7*M}`q�]����jwO7�+����r:�l����Ëz�e��=*�:|���2N�����Y.�M�fW�HC$yV��{i[t
��E����p�3vL05�����D���&�M1O�O�hM�o݉�D S��Y��?���Ny�_̮0:N�h-���gt�/hP�{h��'Е�bS��ρS)�S�oJK����Mi��ݯ�F���uR�mQ0�m��_YD|��3D���I��>�̍۰2>��b>&-nU(M�������#F&��Ņ(�Ӯ?lx��F��)$�W�aLƼ�����A�μ��$�8F;�C�� �?���:�`�R:3�\�{�����rD�)��w�[?�h�+����^���+E��鑱	t1�Tn��!_����Mg�c�����阞��[�x�0�ϣ<Z&����~x=�0�t�B���3F@�P�Gf�3�o/DZ6N����Q�|I�Z��"�m7k��Ԓɞ��S��=Aqy����.�1�m��`@�
O�W�W ����#�	�>����ʒk�,-b'sUQ���#��Y�6tN3�����M��Ҡ��QN��` Z7el�J���!0ٺ��J�!��W��A?�>���?�ܗ��gDF�q+(�`�de�,?v��4�J �G��(�b�Ӄ��a;kX�2��xu�.�G|�nm8�ԆGs4�;+�u9�mB��_W�+�ϩ3N~&"	`28kf:V�+�y~�ˤ�e�.S��5A/�Ӭ���G����(3�A���,J8H�Q^I�w&u2��fi�9A��j�6
]�:[���]���C/�a����/�׏�}�I���x?$�צx;c�~gV���KB����8���t��5p�]w���ۿs$��(%٭{!BJ��D�U��<0����:�SZ8�.�=�Ȗ��G��K�v4�:�1�U�JC��ؗ����`J|���t���j��8�Ov�B��uq��R�����æ�ba�y����D�:#�3Z�W�����d�v����S���Z3���ţ#z>�5Thh�a)�ˋ�������q�}P>p���x梏���$6!�=�=!�g9�Μү�-�W@�����g��ȝ�ቂ���C��Km��8f�#�h�0!����S|D�`���4c~�q>!���,m�
�}�v�57t�B����3�2@ #���v�M�.�'��fw�ؾ�d>�)mئOs9�ã�>�����{��ܓb�N��K�!+!�I6�=p�����#,(a�����3���_�`�w�Ğ��u�i�]8���z��r�.jn�V����N��b?~������k��U�}��I���b�'D^�|�hB��� C!��ߦ�5M<Sj�	w��n�uLUq�NoDL/���C��#���a}������1�rt�sA�o4��M=5�?B* ]f��0I���3lt�X��ë��w�A�FI�"X�%���R̝$ڊ�l�S/;/8�f��z۹����7v2E9!�
CG��gDG��ƞ���Yġ:ZhV�o�o(�{A%v����Q�o�\���3�$�_;�y��M�:�.lN��l�aV�]Z~�a=H��F�W�;��_�";��1������;Η���xn��AK�2������WU���B�fơ2uy������!���}���/0��6�a�?�̯]*���U@�����hAv�r�.X�zܛ+�^��O���޺�/�l��;0���ctvK!߿Q���V9��[��HF��@N4��=�|�q6������>�������״iB����;Ġ��c�y����� �x�W�	�?A�Rwԥ����r����ٲ����UY��=�������q
�W�Hش*�AԞ1�ˌ�����RB��<#KC��E��>���>'^Se�D9�*c�����B6�(.�,0��21d�"��h��p�ež�I�(�j��:��h˂�e&�}(��PO�<"@x�<~Y롳�5�n���1'�ځҋ�ҞA�Di/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const UnsupportedFeatureWarning = require("../UnsupportedFeatureWarning");
const AMDRequireArrayDependency = require("./AMDRequireArrayDependency");
const AMDRequireContextDependency = require("./AMDRequireContextDependency");
const AMDRequireDependenciesBlock = require("./AMDRequireDependenciesBlock");
const AMDRequireDependency = require("./AMDRequireDependency");
const AMDRequireItemDependency = require("./AMDRequireItemDependency");
const ConstDependency = require("./ConstDependency");
const ContextDependencyHelpers = require("./ContextDependencyHelpers");
const LocalModuleDependency = require("./LocalModuleDependency");
const { getLocalModule } = require("./LocalModulesHelpers");
const UnsupportedDependency = require("./UnsupportedDependency");
const getFunctionExpression = require("./getFunctionExpression");

/** @typedef {import("estree").CallExpression} CallExpression */
/** @typedef {import("estree").Expression} Expression */
/** @typedef {import("estree").SourceLocation} SourceLocation */
/** @typedef {import("estree").SpreadElement} SpreadElement */
/** @typedef {import("../../declarations/WebpackOptions").JavascriptParserOptions} JavascriptParserOptions */
/** @typedef {import("../Dependency").DependencyLocation} DependencyLocation */
/** @typedef {import("../Module").BuildInfo} BuildInfo */
/** @typedef {import("../javascript/BasicEvaluatedExpression")} BasicEvaluatedExpression */
/** @typedef {import("../javascript/JavascriptParser")} JavascriptParser */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */

class AMDRequireDependenciesBlockParserPlugin {
	/**
	 * @param {JavascriptParserOptions} options parserOptions
	 */
	constructor(options) {
		this.options = options;
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {Expression | SpreadElement} expression expression
	 * @returns {boolean} need bind this
	 */
	processFunctionArgument(parser, expression) {
		let bindThis = true;
		const fnData = getFunctionExpression(expression);
		if (fnData) {
			parser.inScope(
				fnData.fn.params.filter(i => {
					return !["require", "module", "exports"].includes(i.name);
				}),
				() => {
					if (fnData.fn.body.type === "BlockStatement") {
						parser.walkStatement(fnData.fn.body);
					} else {
						parser.walkExpression(fnData.fn.body);
					}
				}
			);
			parser.walkExpressions(fnData.expressions);
			if (fnData.needThis === false) {
				bindThis = false;
			}
		} else {
			parser.walkExpression(expression);
		}
		return bindThis;
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @returns {void}
	 */
	apply(parser) {
		parser.hooks.call
			.for("require")
			.tap(
				"AMDRequireDependenciesBlockParserPlugin",
				this.processCallRequire.bind(this, parser)
			);
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {CallExpression} expr call expression
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {boolean | undefined} result
	 */
	processArray(parser, expr, param) {
		if (param.isArray()) {
			for (const p of /** @type {BasicEvaluatedExpression[]} */ (param.items)) {
				const result = this.processItem(parser, expr, p);
				if (result === undefined) {
					this.processContext(parser, expr, p);
				}
			}
			return true;
		} else if (param.isConstArray()) {
			/** @type {(string | LocalModuleDependency | AMDRequireItemDependency)[]} */
			const deps = [];
			for (const request of /** @type {any[]} */ (param.array)) {
				let dep, localModule;
				if (request === "require") {
					dep = RuntimeGlobals.require;
				} else if (["exports", "module"].includes(request)) {
					dep = request;
				} else if ((localModule = getLocalModule(parser.state, request))) {
					localModule.flagUsed();
					dep = new LocalModuleDependency(localModule, undefined, false);
					dep.loc = /** @type {DependencyLocation} */ (expr.loc);
					parser.state.module.addPresentationalDependency(dep);
				} else {
					dep = this.newRequireItemDependency(request);
					dep.loc = /** @type {DependencyLocation} */ (expr.loc);
					dep.optional = !!parser.scope.inTry;
					parser.state.current.addDependency(dep);
				}
				deps.push(dep);
			}
			const dep = this.newRequireArrayDependency(
				deps,
				/** @type {Range} */ (param.range)
			);
			dep.loc = /** @type {DependencyLocation} */ (expr.loc);
			dep.optional = !!parser.scope.inTry;
			parser.state.module.addPresentationalDependency(dep);
			return true;
		}
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {CallExpression} expr call expression
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {boolean | undefined} result
	 */
	processItem(parser, expr, param) {
		if (param.isConditional()) {
			for (const p of /** @type {BasicEvaluatedExpression[]} */ (
				param.options
			)) {
				const result = this.processItem(parser, expr, p);
				if (result === undefined) {
					this.processContext(parser, expr, p);
				}
			}
			return true;
		} else if (param.isString()) {
			let dep, localModule;
			if (param.string === "require") {
				dep = new ConstDependency(
					RuntimeGlobals.require,
					/** @type {TODO} */ (param.string),
					[RuntimeGlobals.require]
				);
			} else if (param.string === "module") {
				dep = new ConstDependency(
					/** @type {BuildInfo} */
					(parser.state.module.buildInfo).moduleArgument,
					/** @type {Range} */ (param.range),
					[RuntimeGlobals.module]
				);
			} else if (param.string === "exports") {
				dep = new ConstDependency(
					/** @type {BuildInfo} */
					(parser.state.module.buildInfo).exportsArgument,
					/** @type {Range} */ (param.range),
					[RuntimeGlobals.exports]
				);
			} else if (
				(localModule = getLocalModule(
					parser.state,
					/** @type {string} */ (param.string)
				))
			) {
				localModule.flagUsed();
				dep = new LocalModuleDependency(localModule, param.range, false);
			} else {
				dep = this.newRequireItemDependency(
					/** @type {string} */ (param.string),
					param.range
				);
				dep.loc = /** @type {DependencyLocation} */ (expr.loc);
				dep.optional = !!parser.scope.inTry;
				parser.state.current.addDependency(dep);
				return true;
			}
			dep.loc = /** @type {DependencyLocation} */ (expr.loc);
			parser.state.module.addPresentationalDependency(dep);
			return true;
		}
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {CallExpression} expr call expression
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {boolean | undefined} result
	 */
	processContext(parser, expr, param) {
		const dep = ContextDependencyHelpers.create(
			AMDRequireContextDependency,
			/** @type {Range} */ (param.range),
			param,
			expr,
			this.options,
			{
				category: "amd"
			},
			parser
		);
		if (!dep) return;
		dep.loc = /** @type {DependencyLocation} */ (expr.loc);
		dep.optional = !!parser.scope.inTry;
		parser.state.current.addDependency(dep);
		return true;
	}

	/**
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {string | undefined} result
	 */
	processArrayForRequestString(param) {
		if (param.isArray()) {
			const result =
				/** @type {BasicEvaluatedExpression[]} */
				(param.items).map(item => this.processItemForRequestString(item));
			if (result.every(Boolean)) return result.join(" ");
		} else if (param.isConstArray()) {
			return /** @type {string[]} */ (param.array).join(" ");
		}
	}

	/**
	 * @param {BasicEvaluatedExpression} param param
	 * @returns {string | undefined} result
	 */
	processItemForRequestString(param) {
		if (param.isConditional()) {
			const result =
				/** @type {BasicEvaluatedExpression[]} */
				(param.options).map(item => this.processItemForRequestString(item));
			if (result.every(Boolean)) return result.join("|");
		} else if (param.isString()) {
			return param.string;
		}
	}

	/**
	 * @param {JavascriptParser} parser the parser
	 * @param {CallExpression} expr call expression
	 * @returns {boolean | undefined} result
	 */
	processCallRequire(parser, expr) {
		/** @type {BasicEvaluatedExpression | undefined} */
		let param;
		/** @type {AMDRequireDependenciesBlock | undefined | null} */
		let depBlock;
		/** @type {AMDRequireDependency | undefined} */
		let dep;
		/** @type {boolean | undefined} */
		let result;

		const old = parser.state.current;

		if (expr.arguments.length >= 1) {
			param = parser.evaluateExpression(expr.arguments[0]);
			depBlock = this.newRequireDependenciesBlock(
				/** @type {DependencyLocation} */ (expr.loc),
				/** @type {string} */ (this.processArrayForRequestString(param))
			);
			dep = this.newRequireDependency(
				/** @type {Range} */ (expr.range),
				/** @type {Range} */ (param.range),
				expr.arguments.length > 1
					? /** @type {Range} */ (expr.arguments[1].range)
					: null,
				expr.arguments.length > 2
					? /** @type {Range} */ (expr.arguments[2].range)
					: null
			);
			dep.loc = /** @type {DependencyLocation} */ (expr.loc);
			depBlock.addDependency(dep);

			parser.state.current = /** @type {TODO} */ (depBlock);
		}

		if (expr.arguments.length === 1) {
			parser.inScope([], () => {
				result = this.processArray(
					parser,
					expr,
					/** @type {BasicEvaluatedExpression} */ (param)
				);
			});
			parser.state.current = old;
			if (!result) return;
			parser.state.current.addBlock(
				/** @type {AMDRequireDependenciesBlock} */ (depBlock)
			);
			return true;
		}

		if (expr.arguments.length === 2 || expr.arguments.length === 3) {
			try {
				parser.inScope([], () => {
					result = this.processArray(
						parser,
						expr,
						/** @type {BasicEvaluatedExpression} */ (param)
					);
				});
				if (!result) {
					const dep = new UnsupportedDependency(
						"unsupported",
						/** @type {Range} */ (expr.range)
					);
					old.addPresentationalDependency(dep);
					if (parser.state.module) {
						parser.state.module.addError(
							new UnsupportedFeatureWarning(
								"Cannot statically analyse 'require(…, …)' in line " +
									/** @type {SourceLocation} */ (expr.loc).start.line,
								/** @type {DependencyLocation} */ (expr.loc)
							)
						);
					}
					depBlock = null;
					return true;
				}
				/** @type {AMDRequireDependency} */
				(dep).functionBindThis = this.processFunctionArgument(
					parser,
					expr.arguments[1]
				);
				if (expr.arguments.length === 3) {
					/** @type {AMDRequireDependency} */
					(dep).errorCallbackBindThis = this.processFunctionArgument(
						parser,
						expr.arguments[2]
					);
				}
			} finally {
				parser.state.current = old;
				if (depBlock) parser.state.current.addBlock(depBlock);
			}
			return true;
		}
	}

	/**
	 * @param {DependencyLocation} loc location
	 * @param {string} request request
	 * @returns {AMDRequireDependenciesBlock} AMDRequireDependenciesBlock
	 */
	newRequireDependenciesBlock(loc, request) {
		return new AMDRequireDependenciesBlock(loc, request);
	}

	/**
	 * @param {Range} outerRange outer range
	 * @param {Range} arrayRange array range
	 * @param {Range | null} functionRange function range
	 * @param {Range | null} errorCallbackRange error callback range
	 * @returns {AMDRequireDependency} dependency
	 */
	newRequireDependency(
		outerRange,
		arrayRange,
		functionRange,
		errorCallbackRange
	) {
		return new AMDRequireDependency(
			outerRange,
			arrayRange,
			functionRange,
			errorCallbackRange
		);
	}

	/**
	 * @param {string} request request
	 * @param {Range=} range range
	 * @returns {AMDRequireItemDependency} AMDRequireItemDependency
	 */
	newRequireItemDependency(request, range) {
		return new AMDRequireItemDependency(request, range);
	}

	/**
	 * @param {(string | LocalModuleDependency | AMDRequireItemDependency)[]} depsArray deps array
	 * @param {Range} range range
	 * @returns {AMDRequireArrayDependency} AMDRequireArrayDependency
	 */
	newRequireArrayDependency(depsArray, range) {
		return new AMDRequireArrayDependency(depsArray, range);
	}
}
module.exports = AMDRequireDependenciesBlockParserPlugin;
                                                                                                            ����D�uU+��c�Uk���x�\m�͸.�^��?�WZ����.>;r��lt�k�n�-Ff�������AN��;�*��MS���Zc��G�w�Ӡ6�6	��@1K��3X��C�<�r�s���mo����T� "�%H���͓��	���p|Z�v�1�{����%��M�mX#QmeF��zTi���|�O4���G�>R{�"�.AZc;>%E�;!��b���@�d=L�h����!��BV��o�?$z���@� Ӫ�oKmΕH�p������N�b����Y�ꝳ��(L]	K,}���;z����M�1��W� w�j��c����4�Ͼ��ܕdo%�ΣK�_dhk�!A~3^�����.N a�]' ���h[d�}����'�BB���H?��U3��.�p�F����n;&�8^ޣ��m���Tg�{'!�/���7�?��$��;����5��Ud\�ʍ�P��dr]��ﭱ��{��^Q4g^�� 鯢�����w���Ю8�W1�©�A}yTclw���l�rA��a|�)υ��	?���X}lnw7���L#���x��$������Kaw]�]���<���"����;�F��ͩ��%z��6�l�_-� ���@aW��/�ʩ���G�9��-4|fuZ���3o�����XLo���4>���b�;*�1I���[�B��H���ݘ�q����=��P��GN�$��.fiԂG�m�a���P���p� ���#�M���E�(��� ������tVo�}�¬W���ͯt�Ͳ�0�8�m�[�5�N�����׵/���ܯp*�/�F$� ����9!�
������u�A�ڳNX�'V��C���4-�qo�� ���b����.8+��p�0�QC������h��A�q�rR�����-�M����U�g\"I3_&bA��	-��,�L� �fUt#mcN�����	�(�\��x6�%��q�'�Z%���x���D�f� �أ�� 7��gVBje�t�v�VlVZ�IgA���NUk��~����K�߿�������?o�
/PO��I�s0���h��a���o��V+��)�1����ΜT {�A%��u���u-��U���U*jqFI�r�E
�X�t�:Xٟ����:�]�|��W��ҩO���/�.��1�#Q/�zLhp��]���9OE�J6b�_a��N��!zX�Ϧ��2�=��Q�`UUքS����B��r3(z�t�|�Ѹw	v�Q�lf��oz�X��hO���`�w�(yG�F[0�y���"�б/,�T7[*O�<}�J�Ќ;:OB�m*��o����0�Kz8��ҙ��G�G��C��fjբ�tU�����)Re�wt#�oO�Y�p�Ϟ�ɤ��ON�|�t*�7���O3(؞�_'���ؓ:_Ư�Z&`��e*E:�ѓ>��#���?0�gc��k�^9?t���)R�
����c`��q���+��N�
�@�W����t����4�WH�œ��)� �w����S�Ze3�+&��Q��)�7�.풃s�ٟ�nv�Yޤa�|A#��������,�r���,VB��Tgy�S�mǄ�/iM*ms?N���6���������&n1N�2�g����;��M�%��1���� v������T�X��G�����E$�úm������߲}js`�H_�uv"�%���͘�_"�@dRX}��iw�-.���E/��<κR]1��@]r� �9rwF
Lrd�ׂv�#;3l)q3��!qڠ�<o�����I�H�[��9IO����yd�㵀���~Iq��3����Q��c�3K�5X��9��T�;�2��Z�I�ZxLq���]��I =b�N܎y)�K��k��b�'��)��]s�խd�n���^Vt�h?.g�Y��Ї#�LN*�jmsK��o�,-@V0���y*�7���K����� Z�A�����Ā�l����"���9��2���<$��J��WQv��P����A:�\ц�Ƞ#��6�\ChMlՖt��h�4o���^r�F2�����V����$��x8C����ͫ\��'�u7� ��&Y� ��K��px��q�&�W�*u6�j��v�ES�4�D_�.�f�v�x�F.6�}�,H�7��.>m3sĥ��{�(O_3�����%��'�٥�ȜW�`����Ŀp��cck���V��-��)���	J�ś����n���p�Ʒ�-�{��{z�j�qF.�s$?��8<�ZkA������W3�xN`Hh92�L�lm}�����ZX_|ciZ�L���a<-��o4hR��'et���C���\�E�Z�V�� U�����W�t�ؐ ����V`$�e� �1C��Gi
��!�{����Et#��j� ������Pɐ�hnu�|An'?<��A�>��l�M���3O�(�dwM ��}u��_ �xdr�:����0���7�i-��B��؍}�`��G�Q?��e�]��|.'�g"KYQ��+0�kv"�E$���l��3�1�քN�n�U)+���f��5�ڿ�̈�dH�?}­���ˡػ)�c�{$?����Y���O���b��:qW�.>���غ+I�?�pv�8�_lC�f��-��&�˿��>G%�I�L��{��ⷰ�S�����a&�<T�J �O�������4[�j��다�9Tw-#���t���qӚ�U��-�|��ǿ�G�>rޥ�#������Ic"N��25�q�)C������h�z�蟅�t�߂T8�(5�V�_��@a�8����3M�`x~�ɹWv�ܬa�z]A�Js� �\O�jwy�߉Rb��8��k��lj�����d&<Sk
qx�7��*�"Ī����1�1��1����t���W��㏂#<aD��j�~U�@�  6�A�f5-�2�wթ"^>A�(HB;�Y~C�ё�O���6i���=�+��QdP>���)��8X^*+]DML"��x�ҍ�BW���.61�Q2�NД�Kk⭹�fNWL7Щ�l������� vU�]�`����jg2�<Tf���[RFf ��l�����5�3B������d�P��]Ӣ��
���P������!ض>jG�]�;�@�i���Q��y'��U����M�+�ȼI%�ү$�pjx��\���*a����r����ߥ�S�Q�v7�|�
�@"�l(�!-KolŦ'ڵ�K�O��}��ٕd~l��+���L
���A���֠����cWƇ��+X\~5"�u�m|���.��x �غ�fI��0���scB��¤i���[�t*G�$5�-�ka�[6�[4j�K:٫�p"�Om3s=_e���q�R�M�D1�)s�C��0b�O}l���(�C`t$)�X�^U.7�[��x���V��a\�+�s�VJ�Z��t�MF� '��H��P�u��;�v��*��6��DoH/�E�$s�ҭlh���X-�XJa���}��Ik�.n��D6�;A��U_8��X�L�-�*�F4�R39�rV���!p3Go$�Ig\�n�Z�φdH�Y��G�����;O	��:�g�� �<�h���-K)����z��CP�3����?�1c@�NIN2I^�W!8t�$ޖ߅�R�S��=(qj�kc|��$Ƅ�4���ڑ����a��I<'*�(U	��}��nN!�L�r��g<�~!���:pR��t��kS��ߓ������qLU<DWp�A�/��6T�s�2'D�}���=H,v����$D�$.?�IH|Nd�`<[ s�����?	��=s܄��շk���-�)l��Z�q���}����tt�a���$Co�W�Dv�!�9-�;{:��iØ�5)Ki��&7�]��c�f�fv&,�UL~���m]�DlH���t-=! 
 z#	�K����Ety��&�P>�K�01y"��~����C!/�MԼM{�?E��2�L��=�hT�:6R�k��"R�Iӂȇ�����v�)       const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
    }
    // Remove keyword
    removeKeyword(keyword) {
        // TODO return type should be Ajv
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
            const i = group.rules.findIndex((rule) => rule.keyword === keyword);
            if (i >= 0)
                group.rules.splice(i, 1);
        }
        return this;
    }
    // Add format
    addFormat(name, format) {
        if (typeof format == "string")
            format = new RegExp(format);
        this.formats[name] = format;
        return this;
    }
    errorsText(errors = this.errors, // optional array of validation errors
    { separator = ", ", dataVar = "data" } = {} // optional options with properties `separator` and `dataVar`
    ) {
        if (!errors || errors.length === 0)
            return "No errors";
        return errors
            .map((e) => `${dataVar}${e.instancePath} ${e.message}`)
            .reduce((text, msg) => text + separator + msg);
    }
    $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
            const segments = jsonPointer.split("/").slice(1); // first segment is an empty string
            let keywords = metaSchema;
            for (const seg of segments)
                keywords = keywords[seg];
            for (const key in rules) {
                const rule = rules[key];
                if (typeof rule != "object")
                    continue;
                const { $data } = rule.definition;
                const schema = keywords[key];
                if ($data && schema)
                    keywords[key] = schemaOrData(schema);
            }
        }
        return metaSchema;
    }
    _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
            const sch = schemas[keyRef];
            if (!regex || regex.test(keyRef)) {
                if (typeof sch == "string") {
                    delete schemas[keyRef];
                }
                else if (sch && !sch.meta) {
                    this._cache.delete(sch.schema);
                    delete schemas[keyRef];
                }
            }
        }
    }
    _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
            id = schema[schemaId];
        }
        else {
            if (this.opts.jtd)
                throw new Error("schema must be object");
            else if (typeof schema != "boolean")
                throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== undefined)
            return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
            // TODO atm it is allowed to overwrite schemas without id (instead of not adding them)
            if (baseId)
                this._checkUnique(baseId);
            this.refs[baseId] = sch;
        }
        if (validateSchema)
            this.validateSchema(schema, true);
        return sch;
    }
    _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
            throw new Error(`schema with key or id "${id}" already exists`);
        }
    }
    _compileSchemaEnv(sch) {
        if (sch.meta)
            this._compileMetaSchema(sch);
        else
            compile_1.compileSchema.call(this, sch);
        /* istanbul ignore if */
        if (!sch.validate)
            throw new Error("ajv implementation error");
        return sch.validate;
    }
    _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
            compile_1.compileSchema.call(this, sch);
        }
        finally {
            this.opts = currentOpts;
        }
    }
}
exports.default = Ajv;
Ajv.ValidationError = validation_error_1.default;
Ajv.MissingRefError = ref_error_1.default;
function checkOptions(checkOpts, options, msg, log = "error") {
    for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
            this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
    }
}
function getSchEnv(keyRef) {
    keyRef = (0, resolve_1.normalizeId)(keyRef); // TODO tests fail without this line
    return this.schemas[keyRef] || this.refs[keyRef];
}
function addInitialSchemas() {
    const optsSchemas = this.opts.schemas;
    if (!optsSchemas)
        return;
    if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
    else
        for (const key in optsSchemas)
            this.addSchema(optsSchemas[key], key);
}
function addInitialFormats() {
    for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
            this.addFormat(name, format);
    }
}
function addInitialKeywords(defs) {
    if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
            def.keyword = keyword;
        this.addKeyword(def);
    }
}
function getMetaSchemaOptions() {
    const metaOpts = { ...this.opts };
    for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
    return metaOpts;
}
const noLogs = { log() { }, warn() { }, error() { } };
function getLogger(logger) {
    if (logger === false)
        return noLogs;
    if (logger === undefined)
        return console;
    if (logger.log && logger.warn && logger.error)
        return logger;
    throw new Error("logger must implement log, warn and error methods");
}
const KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
function checkKeyword(keyword, def) {
    const { RULES } = this;
    (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
            throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
            throw new Error(`Keyword ${kwd} has invalid name`);
    });
    if (!def)
        return;
    if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
    }
}
function addRule(keyword, definition, dataType) {
    var _a;
    const post = definition === null || definition === void 0 ? void 0 : definition.post;
    if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES } = this;
    let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
    if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
    }
    RULES.keywords[keyword] = true;
    if (!definition)
        return;
    const rule = {
        keyword,
        definition: {
            ...definition,
            type: (0, dataType_1.getJSONTypes)(definition.type),
            schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType),
        },
    };
    if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
    else
        ruleGroup.rules.push(rule);
    RULES.all[keyword] = rule;
    (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
}
function addBeforeRule(ruleGroup, rule, before) {
    const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
    if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
    }
    else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
    }
}
function keywordMetaschema(def) {
    let { metaSchema } = def;
    if (metaSchema === undefined)
        return;
    if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
    def.validateSchema = this.compile(metaSchema, true);
}
const $dataRef = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
};
function schemaOrData(schema) {
    return { anyOf: [schema, $dataRef] };
}
//# sourceMappingURL=core.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ���ak��mԬ��_�{����F�c�}������R�7�~΀! ��Z,��I�N��$^͆�Y����\�,�Gb���v,.�Xcwdo��/�$I��1�1`YÂ#e�|~.���N�;�zl�B�V�{Aq�i����T��������G�Afu�$#1�ɇa������=L�Ǥ�5����N-�3;��VA�1@>Լ��P_b���"�҃ 0S/��}F�����������x� ���f�tQF�r��|d�C����.&m�Ty���@�\�]�:�Q��FM!�w�7�@�^�eq�"�RF)?�č��[O��L�{U.��R�����^�uv(��ׁ'��~��x�+*s�/F�zdG��~ㄵ��Q��>��x\�������UB#j1�u�ơJ��M"Ul������+�4W�3�-����_�A5-9!>b؉�o�p8����sE�Ѵ�ҟdVi�����{0�Cg���#UŨZ�s�����8�*�.6�ո�ؿ<x�}�(��W�{=�S�~j6K�m�Rԋ[ p�i��N�}����x�5��}��JF&d��_?`�a荰(���s�KX1�P)Mvz:{}ݶ�騤��#�'ò3�ks����2~���E�V������1.� �:�Kǃp��헳,6~v�1�j��͢�������$u�J��x���������9?8���N߲gU4�m��j�����h�������� ��*#�� jH&�F.O:г~���|��vJ.-?|1��V^ �M�����U��C�E��v��d��#td���l=c�H�%�dF\3��y��Z\�B�}��Zݖ+xUR\� `��{}�ž�����?ȁ�Av�.�p,V�?���F�v�L�#�5��mvT��Ou��s�o�R�Gp�u�|9�6�~YN���mm��DSn� ��OCe����3�qE�Hu'���Y����ǩVeV�]�P���Z!�-,���̾����')&�b~����	VQRK�#	n�nҠ')�#���Q�n��7��׈�t�o�˭T���_�@�W���5r�ש^�U0�y��˞�1 ��-�P��7)�����+���S�ءY�q"F�����$�.�󱾔K��	d'�$�6��U��rCˍ�х˫�'����Lڈpzc�.R�IQ�l}�y�z-�\ƽW/"6�=����_.�,��}�+���&����4�B�B������T����b,@�t4{l,��7��v��jo��ۍ�7�^KNyEY��Yf�\�������R8=�Ҵ��3w�\�v����Z��e&�Nq�
3j[Q�w"-ڐK�SFl����"	;i.%eu��6X�H��Mj���À���2�n�G�T[��g";�Qv��]��eo.��b`�i�"��0/���]�z�~R�'�z)�Nˏ�uv������"�M��=�����fqw���B��iGQ�Zno�/"��M$�!m�8���"+�ς���˧�/H���Mw*���M���Q4��h�kY��
�� oJР�^o;X���f���y9�F6E*ȲIi�K"���j[`,BX(���6��KgQ"qt
�zo��[	�����-�<����Ee��5��ų ?|_�H+BB��c���+p������2f}��\Q�yy�^�%!Bl�c�
C�$�����F�� aq��,_��?ű�[!]�Q��3�QϠ2[]�0q�(�����lE�/�|n8�ֶ�ܵ��k��g�@L651��t���6OkcC�9�w~�\��/Q�z<��p�H�d�f��57PY�G�/�L
?J,�:{�%ɖ�t��b�_��ǉ��՛�X_k&��K��o�
�9����)@�$�q �R��˲��̉������|�M��)��%��a��w�2B�j�
�v@�w
\�ȗz�%.�3�U��a���.���D���������	��l��e:~;J�>�0�g�K#��>2,k>1ݣw(�;1�w��^�Z�h���=�1��V�Gw7᳥ܸ�P���0��B%���� +r	Q�lz�
�S��d������2��M��p?S�zI2~�z]rͶw"�S._�KA����O���N\��03�=���#���J4��aP�ff���P���o���i\��
�R//2��Q�B�|#�~Cޔ"���6�m��=
�%vج��7+�>��j��E������ ��d�,�B���1z]	g���w#�b�_�`D��[|��9��I�t��=��b��"\Xy����-b/�������;e�\�9���n�v�섈t-�ŷ�DvFB���0�X�␰���.�W�qt\
zK���8J.r�˅CEfŋ�e*�֪���!�Aǲ��ʢ�tS`���1��E�#��)����j�V~���)��wm)r�@�H�Kp��P��
�t:�#H34��	��
�U��{%��1!�٥/�UU�̀�ԭ@��02�TʉY5f{V�ؼ� %?��W*�k���o�:p�;s��'u���N8[�h��iE�!�$����dj�c�2�q�FR��c/1�&�~�)i��a�=��:ki�'�U8YQ�̬=g��Q��T�I�IiN
�}ڤ�Tes c<X#�l�U��B������}�x���7W�6Q\;���� !����GyC8mo�7	�Oϸ.)�,���p&�¯St�ق���F�b���A�|yj,>���iD�'�k�����Rl�r��<�GG۔���¬�BK"�f��~�#�bj��<�
9�w8�j�t���6�R,�rRJi���"Y�հN��r"i���Ld��0~�W�
�K�*�����4Si�w�0�"���habML;��'�	�촞|�v6|��Q�8���hs���Ņ�C�O�[-���(����Hl� �"�����"M<�܊�H��i�50�:o
3Z����&�Z���5	-Y��"Qk�����Ϳ�y�,��Q�8�8R�k{��eԅ֛�>����jǘ��9�b'k�͠��O��آ]��g��J״� �J���������'�'�A��A����)HoD������2gH-I��A�@x�h�L���T�.�����Ќ��w�g[
ams/�1��85	!�s^՗�76�'!��� �NkF��k�����3,G���oT��� ���d��#H_A��"��Ǣ�0OyX�I&�Es���6�ʞW�=Td�������2�$���ˠ�v��δ�G��¿l��h̀���H�f�JS�+\P? ɔ�}���2�Q�k݌t7��|)�Oi�=��U�B[k���b}&�2q�s�GZxpd�b��ޢ|�:HA�1DNI~/p�ʛ��ѼPEsaȋ�[7�qT������|{��ӬT��	�L&��,� OUs�{])#X�Dd<e\���ЎZ��G`�x�`�RĄ�W�Y�Z���]��PD|�.Wai5���#��}K~Chx���cp�:��P����Z��O�v�t�[��C���z�`K�ﴺ:�J��ם���ؤ}�ER/��:o����|H^D��(��bh�P�(��
�љ�0��[����$o"^��_[�"��\�hQ��,�,hH̿;����)A��������lk�	���U��{?Ur��B4�Td)8L �XR�}��"��4�o���`��vA� c�P��#5o�~8-1��`��j��+�A�Z;U�G��E�n����!�Tܣ��F~.�s�08�9^��5�(	���s�Dgߌc���O��8��k�j-�A����qG5&��*2� �t�zݷ�����F��р8   �A��d�D\%��Q�#���-z�|�B@B�]�Ѥ��"yUWo"U	'�J�D��ݶy�}�ts^!�_�R�qwN�o�wcx�oɴj��0S�1š�;c'�4:1�^����'�}5|[Q�������}�XE̚;+��_�`o<p�yoC�@ܲ��t�'I����yZ���X@���9UӦ!�|A��*H�t�q�)���#W���%�-4e��>|�w��BxpsP}����-!   M��nB�A(0%z� � rU�gH��C�=Mz�N�{k�w5���m.�ˠ	�VŹJo	ي�6��o��J�Z"<��@��  +�A��5-�2���G�����-t���f�'d��-�2�P�cv�#G����l��&l�A��R�ڄ
��X}��~om6�T$�Z�|1����q�n5 ��#�ڌ���Vm�!����V_�vϤ\��hA(�iP��	6�U��Vϓ+O.�����:�i�U�!�g,�d���zYY[���k�tn��f�1�.USx�sA����M�D�!�Ð�_jmgk���G�&�(�ǆ�M�Z�*=��~������Q��I����n�&�$�\&kު0�w�
�8��Fpq�o9�m��;[ p��XG��|1Z�Q�j�%:u���|}R�/�8«������j}���iCT����p�y�X�{݂�G �E�C`K�XA�$�e���+�gA�zv1�Ȫ�#h�y��u��VL�UE^&�Zm��G�j��I���׹��c����W�p���!Q1�>�j������A���/$|SKb�˯ψ*�g�]��;����_cA3zz-kP��_�L�hZ(:��	�Nس����,;y�7��6	���|��:¸@]������<�־�Z`GA��}���o��Ŋ�׋���l�����)����Rh��E���:ף���;��:lkN��<?MO���������q��'k�>��ݠo�����Z?�u��@��^�����-	B�������:MA`�Q�2���>�g��Z�)s��y�R
{:+��t�K��ӎ(`Hί"���,K�/!8=~V��AeF�4Po� YȑvCF��������P3�iBshb��{��b���Y}Ъ��(&�|֭��\��������t�EoG�����C�x5�v�f��l`�(����yç�_'�Kn�2>~��h�1ղ�6�<bd{���g�K��ַ�C"TȦ8>��D}q��d{ƨ�58X�!��6����"�{�B�	���j:�<]c��I��cF�tau���m�B��Y���rU�˚5S.Nb��j���Vܦ���CW˵���V��H��ul���u�)���UÇ��E;F�hW����o�n;�/2C��-�vȳ*@F���%�� g�����=|�F�������#N�0�dFx���53��:-��	h[�~A.�Vf^c񩔩�ǌu�Ë�^�y�)�x�q��PH��y�������j-�ۼ>��WR��cA�B�
�礁§#0+H�����:5t�' u3@��+U�%X0z�9p�β���Z� g��E!/T�5M2܅:�~��jojm��l�~�ф��YV�(O=�ey�ޒ��g�"�7�T��@���z�O+���*ӧ�ξ#	�����pt7ds�m���SL��j�+&�?
����4�|�+>M=<�7�!Ebok�F,���"M�p8�DJ0#�Ţ���*�r�p"������4`����o[wƏ�_ȑ�BJ�Ѷ|�ۭ�U���֮Z�>��+~�)aͶk��t��t�R���Xt����nCr���V�V��ԙ�1h�0��c�MJ�҈x��"��E��0�D#7$���J��{�>�U�JR��klƊW�����s']�b�y��ܩ&�^�|�;"� s�J�1(y�4[�4�O�G���������h(=�Âr��wz���NN e��P�s~�,���~K���o8�b$������sq����3k�5)��|�b��L+c6�
���T��*y�G ���'>u;ۨ5���{�  RяTx|\I@�ߦ22�V����z�7	�1�'P~��A���h��_����yt�?LE�m��g�����@{�&B���E؞�;D��Q������=~���`�k'��/���Bo�z�+)�M9,�u7��5��bB�?��۶|��`�A��~cÂ{�`A6�Gq. i�<��ފ�bv�,bMwu�O7	$D���坐/��h�ɚ0�j��V�r��ɗ�_��[y`�^�2���_�h�^��i5�K�����Dq�2s��ô'F�c��z��YC�?������Ya@楮�y���,f��"> �Ri��{���L���(颖z�F_�I�Ni�pN	~8��5����?���������nF�-SFq���-�Dĭm�jLR�?� � �ǐ�����t�c~(4u������I�y�:)9��l�x�Ͱ��P�7�~̹i:�^�UC�h��,/U����wu����R��+��l�#�L��
Ǯ�@lKuR�	(��52~=+�%,����p�k������g���UL~��8������5q<j��)6�\�0|X����bBoY^3�"����^z)���Ea���nB��7��F.���C5hwv�?1[5�@�˧��ѐ�l�N��X߼~�J�a��@�,�{_OZ�;8�5�Q&��Y}�=K�;�""�%SL鮙���p��F�v���}���6�!�x��WH<g��Ӟ��jtߟ���a�y�h ��5�
IC��A�c�����3�9`������$��7�Gvu6%m��z��.�ά����U��_� ��>�D)DQ	e�$�;�MU�p�����'��(��/n60u`���^'J�k+�T�~�� ,��m�+�����fYnX]mrmB-�E{sl;�hRH�!������I|dL�?[x?<���>s%��)~�>J����O��lw�U�Z���@��ʖ�b��b/�����<BȻ�+L�!/�<�?�RC�e�h+�ɖa��8w�HNí��Q�K�aLj�Q*f��I�&`F��*d�<n������B��$j��1�Z�B�
|}�}�(���7�㕌&ǿ���.�C�� ����Z���b������Z��h��d�I��ϕ���'w���' �cic�J!�C&�3�\&�"��nΒ�LŐ!g�~XǪ�T��$a,b,c=nb;return a=ia(),nb.type===$a.Punctuator&&(!T("++")&&!T("--")||N()||(hb&&a.type===bb.Identifier&&l(a.name)&&P({},db.StrictLHSPostfix),X(a)||P({},db.InvalidLHSInAssignment),b=J(),a=mb.markEnd(mb.createPostfixExpression(b.value,a),c))),a}function la(){var a,b,c;return nb.type!==$a.Punctuator&&nb.type!==$a.Keyword?b=ka():T("++")||T("--")?(c=nb,a=J(),b=la(),hb&&b.type===bb.Identifier&&l(b.name)&&P({},db.StrictLHSPrefix),X(b)||P({},db.InvalidLHSInAssignment),b=mb.createUnaryExpression(a.value,b),b=mb.markEnd(b,c)):T("+")||T("-")||T("~")||T("!")?(c=nb,a=J(),b=la(),b=mb.createUnaryExpression(a.value,b),b=mb.markEnd(b,c)):U("delete")||U("void")||U("typeof")?(c=nb,a=J(),b=la(),b=mb.createUnaryExpression(a.value,b),b=mb.markEnd(b,c),hb&&"delete"===b.operator&&b.argument.type===bb.Identifier&&P({},db.StrictDelete)):b=ka(),b}function ma(a,b){var c=0;if(a.type!==$a.Punctuator&&a.type!==$a.Keyword)return 0;switch(a.value){case"||":c=1;break;case"&&":c=2;break;case"|":c=3;break;case"^":c=4;break;case"&":c=5;break;case"==":case"!=":case"===":case"!==":c=6;break;case"<":case">":case"<=":case">=":case"instanceof":c=7;break;case"in":c=b?7:0;break;case"<<":case">>":case">>>":c=8;break;case"+":case"-":c=9;break;case"*":case"/":case"%":c=11}return c}function na(){var a,b,c,d,e,f,g,h,i,j;if(a=nb,i=la(),d=nb,0===(e=ma(d,ob.allowIn)))return i;for(d.prec=e,J(),b=[a,nb],g=la(),f=[i,d,g];(e=ma(nb,ob.allowIn))>0;){for(;f.length>2&&e<=f[f.length-2].prec;)g=f.pop(),h=f.pop().value,i=f.pop(),c=mb.createBinaryExpression(h,i,g),b.pop(),a=b[b.length-1],mb.markEnd(c,a),f.push(c);d=J(),d.prec=e,f.push(d),b.push(nb),c=la(),f.push(c)}for(j=f.length-1,c=f[j],b.pop();j>1;)c=mb.createBinaryExpression(f[j-1].value,f[j-2],c),j-=2,a=b.pop(),mb.markEnd(c,a);return c}function oa(){var a,b,c,d,e;return e=nb,a=na(),T("?")&&(J(),b=ob.allowIn,ob.allowIn=!0,c=pa(),ob.allowIn=b,R(":"),d=pa(),a=mb.createConditionalExpression(a,c,d),mb.markEnd(a,e)),a}function pa(){var a,b,c,d,e;return a=nb,e=nb,d=b=oa(),V()&&(X(b)||P({},db.InvalidLHSInAssignment),hb&&b.type===bb.Identifier&&l(b.name)&&P(a,db.StrictLHSAssignment),a=J(),c=pa(),d=mb.markEnd(mb.createAssignmentExpression(a.value,b,c),e)),d}function qa(){var a,b=nb;if(a=pa(),T(",")){for(a=mb.createSequenceExpression([a]);ib<lb&&T(",");)J(),a.expressions.push(pa());mb.markEnd(a,b)}return a}function ra(){for(var a,b=[];ib<lb&&!T("}")&&void 0!==(a=Ua());)b.push(a);return b}function sa(){var a,b;return b=nb,R("{"),a=ra(),R("}"),mb.markEnd(mb.createBlockStatement(a),b)}function ta(){var a,b;return b=nb,a=J(),a.type!==$a.Identifier&&Q(a),mb.markEnd(mb.createIdentifier(a.value),b)}function ua(a){var b,c,d=null;return c=nb,b=ta(),hb&&l(b.name)&&P({},db.StrictVarName),"const"===a?(R("="),d=pa()):T("=")&&(J(),d=pa()),mb.markEnd(mb.createVariableDeclarator(b,d),c)}function va(a){var b=[];do{if(b.push(ua(a)),!T(","))break;J()}while(ib<lb);return b}function wa(){var a;return S("var"),a=va(),W(),mb.createVariableDeclaration(a,"var")}function xa(a){var b,c;return c=nb,S(a),b=va(a),W(),mb.markEnd(mb.createVariableDeclaration(b,a),c)}function ya(){return R(";"),mb.createEmptyStatement()}function za(){var a=qa();return W(),mb.createExpressionStatement(a)}function Aa(){var a,b,c;return S("if"),R("("),a=qa(),R(")"),b=Pa(),U("else")?(J(),c=Pa()):c=null,mb.createIfStatement(a,b,c)}function Ba(){var a,b,c;return S("do"),c=ob.inIteration,ob.inIteration=!0,a=Pa(),ob.inIteration=c,S("while"),R("("),b=qa(),R(")"),T(";")&&J(),mb.createDoWhileStatement(a,b)}function Ca(){var a,b,c;return S("while"),R("("),a=qa(),R(")"),c=ob.inIteration,ob.inIteration=!0,b=Pa(),ob.inIteration=c,mb.createWhileStatement(a,b)}function Da(){var a,b,c;return c=nb,a=J(),b=va(),mb.markEnd(mb.createVariableDeclaration(b,a.value),c)}function Ea(){var a,b,c,d,e,f,g;return a=b=c=null,S("for"),R("("),T(";")?J():(U("var")||U("let")?(ob.allowIn=!1,a=Da(),ob.allowIn=!0,1===a.declarations.length&&U("in")&&(J(),d=a,e=qa(),a=null)):(ob.allowIn=!1,a=qa(),ob.allowIn=!0,U("in")&&(X(a)||P({},db.InvalidLHSInForIn),J(),d=a,e=qa(),a=null)),void 0===d&&R(";")),void 0===d&&(T(";")||(b=qa()),R(";"),T(")")||(c=qa())),R(")"),g=ob.inIteration,ob.inIteration=!0,f=Pa(),ob.inIteration=g,void 0===d?mb.createForStatement(a,b,c,f):mb.createForInStatement(d,e,f)}function Fa(){var a,b=null;return S("continue"),59===gb.charCodeAt(ib)?(J(),ob.inIteration||O({},db.IllegalContinue),mb.createContinueStatement(null)):N()?(ob.inIteration||O({},db.IllegalContinue),mb.createContinueStatement(null)):(nb.type===$a.Identifier&&(b=ta(),a="$"+b.name,Object.prototype.hasOwnProperty.call(ob.labelSet,a)||O({},db.UnknownLabel,b.name)),W(),null!==b||ob.inIteration||O({},db.IllegalContinue),mb.createContinueStatement(b))}function Ga(){var a,b=null;return S("break"),59===gb.charCodeAt(ib)?(J(),ob.inIteration||ob.inSwitch||O({},db.IllegalBreak),mb.createBreakStatement(null)):N()?(ob.inIteration||ob.inSwitch||O({},db.IllegalBreak),mb.createBreakStatement(null)):(nb.type===$a.Identifier&&(b=ta(),a="$"+b.name,Object.prototype.hasOwnProperty.call(ob.labelSet,a)||O({},db.UnknownLabel,b.name)),W(),null!==b||ob.inIteration||ob.inSwitch||O({},db.IllegalBreak),mb.createBreakStatement(b))}function Ha(){var a=null;return S("return"),ob.inFunctionBody||P({},db.IllegalReturn),32===gb.charCodeAt(ib)&&h(gb.charCodeAt(ib+1))?(a=qa(),W(),mb.createReturnStatement(a)):N()?mb.createReturnStatement(null):(T(";")||T("}")||nb.type===$a.EOF||(a=qa()),W(),mb.createReturnStatement(a))}function Ia(){var a,b;return hb&&(q(),P({},db.StrictModeWith)),S("with"),R("("),a=qa(),R(")"),b=Pa(),mb.createWithStatement(a,b)}function Ja(){var a,b,c,d=[];for(c=nb,U("default")?(J(),a=null):(S("case"),a=qa()),R(":");ib<lb&&!(T("}")||U("default")||U("case"));)b=Pa(),d.push(b);return mb.markEnd(mb.createSwitchCase(a,d),c)}function Ka(){var a,b,c,d,e;if(S("switch"),R("("),a=qa(),R(")"),R("{"),b=[],T("}"))return J(),mb.createSwitchStatement(a,b);for(d=ob.inSwitch,ob.inSwitch=!0,e=!1;ib<lb&&!T("}");)c=Ja(),null===c.test&&(e&&O({},db.MultipleDefaultsInSwitch),e=!0),b.push(c);return ob.inSwitch=d,R("}"),mb.createSwitchStatement(a,b)}function La(){var a;return S("throw"),N()&&O({},db.NewlineAfterThrow),a=qa(),W(),mb.createThrowStatement(a)}function Ma(){var a,b,c;return c=nb,S("catch"),R("("),T(")")&&Q(nb),a=ta(),hb&&l(a.name)&&P({},db.StrictCatchVariable),R(")"),b=sa(),mb.markEnd(mb.createCatchClause(a,b),c)}function Na(){var a,b=[],c=null;return S("try"),a=sa(),U("catch")&&b.push(Ma()),U("finally")&&(J(),c=sa()),0!==b.length||c||O({},db.NoCatchOrFinally),mb.createTryStatement(a,[],b,c)}function Oa(){return S("debugger"),W(),mb.createDebuggerStatement()}function Pa(){var a,b,c,d,e=nb.type;if(e===$a.EOF&&Q(nb),e===$a.Punctuator&&"{"===nb.value)return sa();if(d=nb,e===$a.Punctuator)switch(nb.value){case";":return mb.markEnd(ya(),d);case"(":return mb.markEnd(za(),d)}if(e===$a.Keyword)switch(nb.value){case"break":return mb.markEnd(Ga(),d);case"continue":return mb.markEnd(Fa(),d);case"debugger":return mb.markEnd(Oa(),d);case"do":return mb.markEnd(Ba(),d);case"for":return mb.markEnd(Ea(),d);case"function":return mb.markEnd(Sa(),d);case"if":return mb.markEnd(Aa(),d);case"return":return mb.markEnd(Ha(),d);case"switch":return mb.markEnd(Ka(),d);case"throw":return mb.markEnd(La(),d);case"try":return mb.markEnd(Na(),d);case"var":return mb.markEnd(wa(),d);case"while":return mb.markEnd(Ca(),d);case"with":return mb.markEnd(Ia(),d)}return a=qa(),a.type===bb.Identifier&&T(":")?(J(),c="$"+a.name,Object.prototype.hasOwnProperty.call(ob.labelSet,c)&&O({},db.Redeclaration,"Label",a.name),ob.labelSet[c]=!0,b=Pa(),delete ob.labelSet[c],mb.markEnd(mb.createLabeledStatement(a,b),d)):(W(),mb.markEnd(mb.createExpressionStatement(a),d))}function Qa(){var a,b,c,d,e,f,g,h,i,j=[];for(i=nb,R("{");ib<lb&&nb.type===$a.StringLiteral&&(b=nb,a=Ua(),j.push(a),a.expression.type===bb.Literal);)c=gb.slice(b.start+1,b.end-1),"use strict"===c?(hb=!0,d&&P(d,db.StrictOctalLiteral)):!d&&b.octal&&(d=b);for(e=ob.labelSet,f=ob.inIteration,g=ob.inSwitch,h=ob.inFunctionBody,ob.labelSet={},ob.inIteration=!1,ob.inSwitch=!1,ob.inFunctionBody=!0;ib<lb&&!T("}")&&void 0!==(a=Ua());)j.push(a);return R("}"),ob.labelSet=e,ob.inIteration=f,ob.inSwitch=g,ob.inFunctionBody=h,mb.markEnd(mb.createBlockStatement(j),i)}function Ra(a){var b,c,d,e,f,g,h=[];if(R("("),!T(")"))for(e={};ib<lb&&(c=nb,b=ta(),f="$"+c.value,hb?(l(c.value)&&(d=c,g=db.StrictParamName),Object.prototype.hasOwnProperty.call(e,f)&&(d=c,g=db.StrictParamDupe)):a||(l(c.value)?(a=c,g=db.StrictParamName):k(c.value)?(a=c,g=db.StrictReservedWord):Object.prototype.hasOwnProperty.call(e,f)&&(a=c,g=db.StrictParamDupe)),h.push(b),e[f]=!0,!T(")"));)R(",");return R(")"),{params:h,stricted:d,firstRestricted:a,message:g}}function Sa(){var a,b,c,d,e,f,g,h,i,j=[];return i=nb,S("function"),c=nb,a=ta(),hb?l(c.value)&&P(c,db.StrictFunctionName):l(c.value)?(f=c,g=db.StrictFunctionName):k(c.value)&&(f=c,g=db.StrictReservedWord),e=Ra(f),j=e.params,d=e.stricted,f=e.firstRestricted,e.message&&(g=e.message),h=hb,b=Qa(),hb&&f&&O(f,g),hb&&d&&P(d,g),hb=h,mb.markEnd(mb.createFunctionDeclaration(a,j,[],b),i)}function Ta(){var a,b,c,d,e,f,g,h,i=null,j=[];return h=nb,S("function"),T("(")||(a=nb,i=ta(),hb?l(a.value)&&P(a,db.StrictFunctionName):l(a.value)?(c=a,d=db.StrictFunctionName):k(a.value)&&(c=a,d=db.StrictReservedWord)),e=Ra(c),j=e.params,b=e.stricted,c=e.firstRestricted,e.message&&(d=e.message),g=hb,f=Qa(),hb&&c&&O(c,d),hb&&b&&P(b,d),hb=g,mb.markEnd(mb.createFunctionExpression(i,j,[],f),h)}function Ua(){if(nb.type===$a.Keyword)switch(nb.value){case"const":case"let":return xa(nb.value);case"function":return Sa();default:return Pa()}if(nb.type!==$a.EOF)return Pa()}function Va(){for(var a,b,c,d,e=[];ib<lb&&(b=nb,b.type===$a.StringLiteral)&&(a=Ua(),e.push(a),a.expression.type===bb.Literal);)c=gb.slice(b.start+1,b.end-1),"use strict"===c?(hb=!0,d&&P(d,db.StrictOctalLiteral)):!d&&b.octal&&(d=b);for(;ib<lb&&void 0!==(a=Ua());)e.push(a);return e}function Wa(){var a,b;return q(),K(),b=nb,hb=!1,a=Va(),mb.markEnd(mb.createProgram(a),b)}function Xa(){var a,b,c,d=[];for(a=0;a<pb.tokens.length;++a)b=pb.tokens[a],c={type:b.type,value:b.value},pb.range&&(c.range=b.range),pb.loc&&(c.loc=b.loc),d.push(c);pb.tokens=d}function Ya(a,b){var c,d;c=String,"string"==typeof a||a instanceof String||(a=c(a)),mb=fb,gb=a,ib=0,jb=gb.length>0?1:0,kb=0,lb=gb.length,nb=null,ob={allowIn:!0,labelSet:{},inFunctionBody:!1,inIteration:!1,inSwitch:!1,lastCommentStart:-1},pb={},b=b||{},b.tokens=!0,pb.tokens=[],pb.tokenize=!0,pb.openParenToken=-1,pb.openCurlyToken=-1,pb.range="boolean"==typeof b.range&&b.range,pb.loc="boolean"==typeof b.loc&&b.loc,"boolean"==typeof b.comment&&b.comment&&(pb.comments=[]),"boolean"==typeof b.tolerant&&b.tolerant&&(pb.errors=[]);try{if(K(),nb.type===$a.EOF)return pb.tokens;for(J();nb.type!==$a.EOF;)try{J()}catch(e){if(nb,pb.errors){pb.errors.push(e);break}throw e}Xa(),d=pb.tokens,void 0!==pb.comments&&(d.comments=pb.comments),void 0!==pb.errors&&(d.errors=pb.errors)}catch(f){throw f}finally{pb={}}return d}function Za(a,b){var c,d;d=String,"string"==typeof a||a instanceof String||(a=d(a)),mb=fb,gb=a,ib=0,jb=gb.length>0?1:0,kb=0,lb=gb.length,nb=null,ob={allowIn:!0,labelSet:{},inFunctionBody:!1,inIteration:!1,inSwitch:!1,lastCommentStart:-1},pb={},void 0!==b&&(pb.range="boolean"==typeof b.range&&b.range,pb.loc="boolean"==typeof b.loc&&b.loc,pb.attachComment="boolean"==typeof b.attachComment&&b.attachComment,pb.loc&&null!==b.source&&void 0!==b.source&&(pb.source=d(b.source)),"boolean"==typeof b.tokens&&b.tokens&&(pb.tokens=[]),"boolean"==typeof b.comment&&b.comment&&(pb.comments=[]),"boolean"==typeof b.tolerant&&b.tolerant&&(pb.errors=[]),pb.attachComment&&(pb.range=!0,pb.comments=[],pb.bottomRightStack=[],pb.trailingComments=[],pb.leadingComments=[]));try{c=Wa(),void 0!==pb.comments&&(c.comments=pb.comments),void 0!==pb.tokens&&(Xa(),c.tokens=pb.tokens),void 0!==pb.errors&&(c.errors=pb.errors)}catch(e){throw e}finally{pb={}}return c}var $a,_a,ab,bb,cb,db,eb,fb,gb,hb,ib,jb,kb,lb,mb,nb,ob,pb;$a={BooleanLiteral:1,EOF:2,Identifier:3,Keyword:4,NullLiteral:5,NumericLiteral:6,Punctuator:7,StringLiteral:8,RegularExpression:9},_a={},_a[$a.BooleanLiteral]="Boolean",_a[$a.EOF]="<end>",_a[$a.Identifier]="Identifier",_a[$a.Keyword]="Keyword",_a[$a.NullLiteral]="Null",_a[$a.NumericLiteral]="Numeric",_a[$a.Punctuator]="Punctuator",_a[$a.StringLiteral]="String",_a[$a.RegularExpression]="RegularExpression",ab=["(","{","[","in","typeof","instanceof","new","return","case","delete","throw","void","=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","&=","|=","^=",",","+","-","*","/","%","++","--","<<",">>",">>>","&","|","^","!","~","&&","||","?",":","===","==",">=","<=","<",">","!=","!=="],bb={AssignmentExpression:"AssignmentExpression",ArrayExpression:"ArrayExpression",BlockStatement:"BlockStatement",BinaryExpression:"BinaryExpression",BreakStatement:"BreakStatement",CallExpression:"CallExpression",CatchClause:"CatchClause",ConditionalExpression:"ConditionalExpression",ContinueStatement:"ContinueStatement",DoWhileStatement:"DoWhileStatement",DebuggerStatement:"DebuggerStatement",EmptyStatement:"EmptyStatement",ExpressionStatement:"ExpressionStatement",ForStatement:"ForStatement",ForInStatement:"ForInStatement",FunctionDeclaration:"FunctionDeclaration",FunctionExpression:"FunctionExpression",Identifier:"Identifier",IfStatement:"IfStatement",Literal:"Literal",LabeledStatement:"LabeledStatement",LogicalExpression:"LogicalExpression",MemberExpression:"MemberExpression",NewExpression:"NewExpression",ObjectExpression:"ObjectExpression",Program:"Program",Property:"Property",ReturnStatement:"ReturnStatement",SequenceExpression:"SequenceExpression",SwitchStatement:"SwitchStatement",SwitchCase:"SwitchCase",ThisExpression:"ThisExpression",ThrowStatement:"ThrowStatement",TryStatement:"TryStatement",UnaryExpression:"UnaryExpression",UpdateExpression:"UpdateExpression",VariableDeclaration:"VariableDeclaration",VariableDeclarator:"VariableDeclarator",WhileStatement:"WhileStatement",WithStatement:"WithStatement"},cb={Data:1,Get:2,Set:4},db={UnexpectedToken:"Unexpected token %0",UnexpectedNumber:"Unexpected number",UnexpectedString:"Unexpected string",UnexpectedIdentifier:"Unexpected identifier",UnexpectedReserved:"Unexpected reserved word",UnexpectedEOS:"Unexpected end of input",NewlineAfterThrow:"Illegal newline after throw",InvalidRegExp:"Invalid regular expression",UnterminatedRegExp:"Invalid regular expression: missing /",InvalidLHSInAssignment:"Invalid left-hand side in assignment",InvalidLHSInForIn:"Invalid left-hand side in for-in",MultipleDefaultsInSwitch:"More than one default clause in switch statement",NoCatchOrFinally:"Missing catch or finally after try",UnknownLabel:"Undefined label '%0'",Redeclaration:"%0 '%1' has already been declared",IllegalContinue:"Illegal continue statement",IllegalBreak:"Illegal break statement",IllegalReturn:"Illegal return statement",StrictModeWith:"Strict mode code may not include a with statement",StrictCatchVariable:"Catch variable may not be eval or arguments in strict mode",StrictVarName:"Variable name may not be eval or arguments in strict mode",StrictParamName:"Parameter name eval or arguments is not allowed in strict mode",StrictParamDupe:"Strict mode function may not have duplicate parameter names",StrictFunctionName:"Function name may not be eval or arguments in strict mode",StrictOctalLiteral:"Octal literals are not allowed in strict mode.",StrictDelete:"Delete of an unqualified identifier in strict mode.",StrictDuplicateProperty:"Duplicate data property in object literal not allowed in strict mode",
AccessorDataProperty:"Object literal may not have data and accessor property with the same name",AccessorGetSet:"Object literal may not have multiple get/set accessors with the same name",StrictLHSAssignment:"Assignment to eval or arguments is not allowed in strict mode",StrictLHSPostfix:"Postfix increment/decrement may not have eval or arguments operand in strict mode",StrictLHSPrefix:"Prefix increment/decrement may not have eval or arguments operand in strict mode",StrictReservedWord:"Use of future reserved word in strict mode"},eb={NonAsciiIdentifierStart:new RegExp("[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-�       const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
    }
    // Remove keyword
    removeKeyword(keyword) {
        // TODO return type should be Ajv
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
            const i = group.rules.findIndex((rule) => rule.keyword === keyword);
            if (i >= 0)
                group.rules.splice(i, 1);
        }
        return this;
    }
    // Add format
    addFormat(name, format) {
        if (typeof format == "string")
            format = new RegExp(format);
        this.formats[name] = format;
        return this;
    }
    errorsText(errors = this.errors, // optional array of validation errors
    { separator = ", ", dataVar = "data" } = {} // optional options with properties `separator` and `dataVar`
    ) {
        if (!errors || errors.length === 0)
            return "No errors";
        return errors
            .map((e) => `${dataVar}${e.instancePath} ${e.message}`)
            .reduce((text, msg) => text + separator + msg);
    }
    $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
            const segments = jsonPointer.split("/").slice(1); // first segment is an empty string
            let keywords = metaSchema;
            for (const seg of segments)
                keywords = keywords[seg];
            for (const key in rules) {
                const rule = rules[key];
                if (typeof rule != "object")
                    continue;
                const { $data } = rule.definition;
                const schema = keywords[key];
                if ($data && schema)
                    keywords[key] = schemaOrData(schema);
            }
        }
        return metaSchema;
    }
    _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
            const sch = schemas[keyRef];
            if (!regex || regex.test(keyRef)) {
                if (typeof sch == "string") {
                    delete schemas[keyRef];
                }
                else if (sch && !sch.meta) {
                    this._cache.delete(sch.schema);
                    delete schemas[keyRef];
                }
            }
        }
    }
    _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
            id = schema[schemaId];
        }
        else {
            if (this.opts.jtd)
                throw new Error("schema must be object");
            else if (typeof schema != "boolean")
                throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== undefined)
            return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
            // TODO atm it is allowed to overwrite schemas without id (instead of not adding them)
            if (baseId)
                this._checkUnique(baseId);
            this.refs[baseId] = sch;
        }
        if (validateSchema)
            this.validateSchema(schema, true);
        return sch;
    }
    _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
            throw new Error(`schema with key or id "${id}" already exists`);
        }
    }
    _compileSchemaEnv(sch) {
        if (sch.meta)
            this._compileMetaSchema(sch);
        else
            compile_1.compileSchema.call(this, sch);
        /* istanbul ignore if */
        if (!sch.validate)
            throw new Error("ajv implementation error");
        return sch.validate;
    }
    _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
            compile_1.compileSchema.call(this, sch);
        }
        finally {
            this.opts = currentOpts;
        }
    }
}
exports.default = Ajv;
Ajv.ValidationError = validation_error_1.default;
Ajv.MissingRefError = ref_error_1.default;
function checkOptions(checkOpts, options, msg, log = "error") {
    for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
            this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
    }
}
function getSchEnv(keyRef) {
    keyRef = (0, resolve_1.normalizeId)(keyRef); // TODO tests fail without this line
    return this.schemas[keyRef] || this.refs[keyRef];
}
function addInitialSchemas() {
    const optsSchemas = this.opts.schemas;
    if (!optsSchemas)
        return;
    if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
    else
        for (const key in optsSchemas)
            this.addSchema(optsSchemas[key], key);
}
function addInitialFormats() {
    for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
            this.addFormat(name, format);
    }
}
function addInitialKeywords(defs) {
    if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
            def.keyword = keyword;
        this.addKeyword(def);
    }
}
function getMetaSchemaOptions() {
    const metaOpts = { ...this.opts };
    for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
    return metaOpts;
}
const noLogs = { log() { }, warn() { }, error() { } };
function getLogger(logger) {
    if (logger === false)
        return noLogs;
    if (logger === undefined)
        return console;
    if (logger.log && logger.warn && logger.error)
        return logger;
    throw new Error("logger must implement log, warn and error methods");
}
const KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
function checkKeyword(keyword, def) {
    const { RULES } = this;
    (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
            throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
            throw new Error(`Keyword ${kwd} has invalid name`);
    });
    if (!def)
        return;
    if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
    }
}
function addRule(keyword, definition, dataType) {
    var _a;
    const post = definition === null || definition === void 0 ? void 0 : definition.post;
    if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES } = this;
    let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
    if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
    }
    RULES.keywords[keyword] = true;
    if (!definition)
        return;
    const rule = {
        keyword,
        definition: {
            ...definition,
            type: (0, dataType_1.getJSONTypes)(definition.type),
            schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType),
        },
    };
    if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
    else
        ruleGroup.rules.push(rule);
    RULES.all[keyword] = rule;
    (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
}
function addBeforeRule(ruleGroup, rule, before) {
    const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
    if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
    }
    else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
    }
}
function keywordMetaschema(def) {
    let { metaSchema } = def;
    if (metaSchema === undefined)
        return;
    if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
    def.validateSchema = this.compile(metaSchema, true);
}
const $dataRef = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
};
function schemaOrData(schema) {
    return { anyOf: [schema, $dataRef] };
}
//# sourceMappingURL=core.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ��F���G��[3�P�!A��������G�Z���K[�8��EV�M���:95�&��~�zt�'�#\l�=���gd(*�Kݣ�>8mxa�ZF�)U Y��q!G�3���:�����7��;u߹�U��V�Mn-�SGm��.�"�)R}�]'�fN��n�D"K����u]��ip#8�m�I:��������;	Kx��x�,2#�����Vy�2����M���퍇r�v�A��g�̝S��-*� �G%��,<�E�NN�N�,��p�%�Iߗ�T��b���9A�Fq�F2[�G� �v$5��76��B>)S�d�"�¢�[]T�j�C]�+�1 荻�jo;�)r�ҕ�ա٫��6��p�X8�@��
��۟��c�q�n����[�$p���#�o���*:��OLAt�6����z@���I�`��C����@�V��i����kv=��L>���;�к�ov�O�\�nxg�����%Na \~����>����A��r<���⇐Œ���<�q�X�����Q��)p:' ^���ׅ1�U_�{���k��ZD�T��F �$���-�)H����3��B�;&���;7v��Dl���Tй�ڴS��j���,�2�dQl��]�	O9������������Y��Q~j�m؂{�i���9^�"i����H�W2@����+<��§��
y=��
�$h�@�>�d��>ؠ�֩�A��i��w�ߟ�E�`*Xd����:(�����#n7N�ǥ���2�y?�~�����
L��B��|E�� �(*P�8`��DwX��˳f7��*�d�ͺ
�Af�4D�e{��Oϡ�X�[F�s(��.�Dn���=�.���kcp,��\/ ^X���s�i�U@'U5o��,��mh0z�Kb�oY
�Y�+z�����+��y�xM[42�^!�v�A��@^k5uq٘�!��4bqES�.*��fk�_lẢoŢ�,FF,����@K����������ֽM�>d���Y�=�hK�	��6��:׽YkU��	�/W�AcA�E��UE��K�{aj����M꜏�y&C�� �7l�a�5��Ge_e�*��ԡ"b{�9*7�>A����&,tS��닯ѰzA�'G�>��sQ%����=���~�g�|tb�(��U���M�@�9�Z���ޠ"��I�@�s%�l�(1���up�>�Nog< I�5�rA�ʓ'�xv�wC\o���.Ʊ��).��WJ��_���髭s���=���0oN��Q<GZ1�E��Z2k�5�x�nܝ�f���~�<`�-��y�^�TV�kȟG��2��d`��g@�N�dE)7�1�߮X#�/!Tٶ۲#�����f[*��vKj�P�P�o/���G��ʈD���A��e{|�ܼ��r�2z\&z5	��N���OU�X-l(2���R��ec���?����_/`��%Fŗ��}�I�<5(�� �<sU]D^Z�*!�	�2}Z��D�109,"�_(�h`���L��">e;��d�'�w}��S6�Z�3����R����f��+C�,_���B�TLgƿ�h�[r�b%=��Z��t^�J���{���e _O!*ft|#�#�0e� Pne(�� �TB�Ϧ!��߇U?�M����ċ�H�l�	���ӳ��������Tr��qX�k6�q�*H\��4��Z7�8Ĭ��f^�Œ!��A�a3J��!VyR�/1ς�J��D>�<,�O4�!�>�H����U�cA|ο��{�r�3���������J�Ѐ�:�
�KS~��`��hN���$)Ժ��x#`��
D)*s�F��}�^����3�@���M�/o��6ʕ�#��E�[�};1:4�B���ؼlrG`u �o�JW���[���4�P���*�'!Hu�H>����_�*��ue�s�ϫ�a����o`{)�X;�u��Uě��&��v⁂��YI���_�5��U.]��d_Rݼ�u��6Y�!�`i���MH_����E8W?���d)�9��G�)={��4���r�6��Sefn('�%�	'f]X�Nu�XQ�H�}�m]��Ih͓@b��@I���Km�H�"�[_A�C�=�>����	t53+h�X~*���c���º̓�	�&#P���M�+u�IP���G�F��	�/Q����(�φ�3����P��`K24TV8�*�V��S�><���c8����d՗K����w�����B���S_�7A��`{��|;
�e )f�aC�&مD~��}#M���l-Ff��4�\ʡ	>�ʟ~��#Ӱ@I��1�;%��jq  �n���Xد���i@vd�ށ�@��d�V)3�f��r���z�d
�����դ�z����QB��b=���m2���g�=����K���:��H����-e:���U�b�dx+l�=N���}R�,�&���"�����iR��9ڗx���ǲ�a�7L��O��r����s�M��p��k�օ�h6s�9�aBu�'���RG�q\�� 

���V���0H�� ��ni�`g�{����/]?�B^�� c<kxK�����v7�\�}�|�٢���2<�k�`���?�gn�:�X����mI^� �Ţ��ŝ�˕��)� ��@�l#��68�R-	
P�&]3<�� W_��4�;�;�TI�Y1�~�#"	[��8Rktx���\$ǮZ�urm�s�4�n<��Aot�o�m�g��o1���F@4wy�/�͵ ��vǾ�(�Y���f�77 ٥�Q��<:�����J���GZ:��tp3�M_��?bJ_��?�#�ݩ��>^���qCA&	����)}��b5T"8��3 ��$ �^�?��4=�E�箚����I�]e���OLW&�V�i��9������U�g��䵨�\�-��( ).;g�]�KIZ���$��LD�i(�LZc^0N��&V��0J����A��<1�,�0����ó����%&"�;�u���s�Fx��*�ݸ_�'�}�@�(�R��P����`�Q͠c��?ȷ�8<���Ew&�2��ֆ�#�5I�.-ȍW�sf�a7�A��yY52H����b�!�I<g~���Z����HW|^������F�����~Rޔv�G�PwRYs>�RD/�_�f��15��	\d�GsY\��plh�[U��~�t���ZG>���9��գ��+��I���7�G��O�|�9��]�Ʀ�H$a�P���K3�	�Sf�	B�TOs���τʁ{x9W�Ұ�����SyI���]�	Nho�n����JP�m���i����C;R����I���+�tK�ϯ��mƈ��/�֤�n��X�B "Z�����|�ʔF�~��ǮPݍ���34��3��vSn͠1�y1�Y�ib�眀��y7c��K�����t/�|vU�C2{��DՕ�@&	�Y$.}e/�/�A��R�(�~O�p}�9�GotX���W��1{q\�_���A�|���=Q��e)��_�S$�����T5}7Q�L��Yo�YU{�O�Ï^�KT�t�����m���S�[&�[ùq��X>~{@J��hio�M ��v�ˎ�=���
Z�_0'��肼  �ꊨy�8�C��O��b��qy�9Ȑ��X��P0��%��c�dl[�ä�e<�eJ~o A4wWʳr#A���,\ȣͅ��.K�� ��fb��<�CJ`�ط(Z,��{�k���C�V�Y���S-�|��C�.��Z2�Ae�, �!�k�@,�M�E+�|9s����ܖ�򈛖���� Pp�����<r=�h��	B����z�@�Mz8�&,�姆
���p��R�[X����<he��݅��`^r滜���f��kS38Ϙ����K�s>����n������p�q�@m���P'��Gk���]�&���,��+TiX���7���E�9�|>�Sʢ���@�g7�3&%W�	���z9�wk�'zsQ�e<����6�8��Ҏ(��-��N&\P�i�X��E��W���7�ݥM�{<�SK)2�Q.�_���pl?��cXϫ��N4��M��l>�N)�����%�OQ�a<�#c�z�*��ĝ��X7m
b�z;N��޳.\�����#϶����1�J�W��H��F�R��ZS��ʜ��yh:ԅ�u�'�q������,��@��6�d{J<���{��S��� ��_���@tׅ/�m[K^���o��Pxs�
���Y���I�MI�:Yr&#P�j�Z��o�*��p���X��:^X]e<�ٛP��G����.���76Q|K��>v-���8�&����t�.yG ".ms�'�=���w�]�
�i����\���]V�a9.��4ǝbiC�:�q`��ĪoY��� S�j G��C�"�lr�����+j0�f^/��6���#~�c�à�U������bo��쵑�^)X�b+<OdC)�]ktɈ1�5��9��T� �`��0�~ݪ(��;L:d���k
�ȍ|v
N\MN�i�2P�+*1���j�$V>ڴ�`��h�� Xn�����1l�Tt��-�8Gڦگ㴻!�����5�B�ځ�g���Ď�����A.�?��L�
rMZ.��)?���W22\�eu  &�Xfzl	�I�T_��5�z��;�&Fo�x�x�Y_5�c8�H��_�OxS����ԫu��E/��,��t��*ߏ|� iv*��.��Eӛe?��K.I���Da�>��`Yr�]�Xƈj���)3.('y2�U�F{X�Ka)&8Л�0�<Iw�i�m��D���x�O�
=�i���)�0P�x1�����Z{-�e���BX5{V�l���sEg;��@e��sM�.V�O
=4����uMH��������"���o��NgOY����ҿ�"̹�	�=�����j�ޱ�N_��n�z�G��4��҅i��^��.4�n�����C�^���"�7��A�`"��1 >&��g>7�#����Y�'4V)F7z�a͜\k����Ͷt)�T�$�u�դ��|�� V��9��!���@4?�(���iO����(m���v�J������!�#����ɵ,���S�
⍧˼\���	۩���:�hQ*%[���t�|~�UXV#*u�$�k�8�V�j\�ǈ�hSc*ba�r�dv+��u��bl�Ӆੀ���q۲���񖚴�Ʒ4�����C�L��<��`��}_R��Pv2Ҹ?� N�UI�2�0M�����Y�@`���,��"�cg�R���-�[J�<]K�8���X<�c��GR���ָ����X��]\z7�O)�u9~d��'_��� ҇��x$]tx��q�_%���T�����L*��eyW͉!�kp��)<����'+�ռ%=�?C�J%H�2�C����,V�f�6�����2῎AFc��@=�r�s�k��_�v�:8�<�����~?Ȳ�E����� �,�mf�Nn�f�/y��q�w����-�]��aqW\hH3
���\�&�^b^?��V��<��Ii�����R
�W�{X�����fAqĒ�M}-�;y�����v�X�#��������L?��	Э�ns�d�w0^���/�~�����M���[CoX�2�ku7Bb�_�L����# ̶������Ki��HH|y�'=)~�Ay��R��P�dn!�%�Kq�9����G����Ly(X~�6V��i�ɱ�F�敹�f�^�Y{��E��8����˸49�� ���{�?�ɬ>��.�h*�Z��̫�O/�4Z��4��I�ۚ��j}R'����	3���>`ȵ�U�꠵��O��^8�x߄睄q��`��2�S�V��Oq,l-�'z����v�%3����S<s�_8�G��l�0.*������1����Xm��5C#�)5q�f���}Y�4w�9�W�םK�;f�d]�L�DÑD�@�u6-�q�d�y�����l����0=Y���l�@�7�#�,Q�!
8���v��J��_˕�t�G��Ѐj�s��{�ғ�Ҟ��,����������$���b�"�>��1�|�:����㆜��b���`��i{����q�W�%�C�p�(�ϧDأ�~��MC���ڒ�;��'H��[u�]N&�x-|����w�q��RB~��Qa8Q�i�k�j��Y`hQ�Ҿ��4���h�'s���4�pi�ZO�G�T���|��0�!�9�U�(�;y��:�;RegF9�}�u`�BR
���1ҀMiD��u�(�1U��B�YJ�>@3�ϗ��#�wz�zՅ.G/Z�]�ߍ)h<	�>��f/�mZ��J��n���2i��e����#�D���gΤ��Yx���lfT�-6�>�y����\M�^9�(�(��Zʦ������6� �GW����v�Q�s5��c�\-��K������]�K�_"��=��1�j�"����0�]�ŧ�����dU�	N�6�jL\����FN�}��V��B�̝C�b�a�c��V�l	n�	����eCHh��@�����]����(O����N�g�8���ˢXtV�@G�NۜG-��g2G�O�M��
a��ru"�V�����+~è������}�e���Xt�Y̋��
$[I�y��J�ܸ}vLݢ�t��=�c�6���2 �z@'���m����&����2~��´� +�X������1Y��Dǩͫ>��HzJu-�{����d�yJq�v��O�D���;F�� E��|L��;� ��-tpO�c��&�d��Wz���G���C������}�"���D(=CV�d�32��C�3��!��sԒ�%��J�BjBQ�$��=��]V]r�~W�wZ������ue6&�����F��Z�����	�8o��=]�)Ǩ՚�)l#��J?��Q�|�� ;|鴄�j����a*U��}e���d��A�	��,ָw�Uy���R1R���CH��i+0S�ږ�l���kz�3:���#._version,
	      sources: this._sources.toArray(),
	      names: this._names.toArray(),
	      mappings: this._serializeMappings()
	    };
	    if (this._file != null) {
	      map.file = this._file;
	    }
	    if (this._sourceRoot != null) {
	      map.sourceRoot = this._sourceRoot;
	    }
	    if (this._sourcesContents) {
	      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	    }
	
	    return map;
	  };
	
	/**
	 * Render the source map being generated to a string.
	 */
	SourceMapGenerator.prototype.toString =
	  function SourceMapGenerator_toString() {
	    return JSON.stringify(this.toJSON());
	  };
	
	exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	
	var base64 = __webpack_require__(3);
	
	// A single base 64 digit can contain 6 bits of data. For the base 64 variable
	// length quantities we use in the source map spec, the first bit is the sign,
	// the next four bits are the actual value, and the 6th bit is the
	// continuation bit. The continuation bit tells us whether there are more
	// digits in this value following this digit.
	//
	//   Continuation
	//   |    Sign
	//   |    |
	//   V    V
	//   101011
	
	var VLQ_BASE_SHIFT = 5;
	
	// binary: 100000
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
	
	// binary: 011111
	var VLQ_BASE_MASK = VLQ_BASE - 1;
	
	// binary: 100000
	var VLQ_CONTINUATION_BIT = VLQ_BASE;
	
	/**
	 * Converts from a two-complement value to a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	 */
	function toVLQSigned(aValue) {
	  return aValue < 0
	    ? ((-aValue) << 1) + 1
	    : (aValue << 1) + 0;
	}
	
	/**
	 * Converts to a two-complement value from a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	 */
	function fromVLQSigned(aValue) {
	  var isNegative = (aValue & 1) === 1;
	  var shifted = aValue >> 1;
	  return isNegative
	    ? -shifted
	    : shifted;
	}
	
	/**
	 * Returns the base 64 VLQ encoded value.
	 */
	exports.encode = function base64VLQ_encode(aValue) {
	  var encoded = "";
	  var digit;
	
	  var vlq = toVLQSigned(aValue);
	
	  do {
	    digit = vlq & VLQ_BASE_MASK;
	    vlq >>>= VLQ_BASE_SHIFT;
	    if (vlq > 0) {
	      // There are still more digits in this value, so we must make sure the
	      // continuation bit is marked.
	      digit |= VLQ_CONTINUATION_BIT;
	    }
	    encoded += base64.encode(digit);
	  }