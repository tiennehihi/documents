export default ValidationError;
export type JSONSchema6 = import('json-schema').JSONSchema6;
export type JSONSchema7 = import('json-schema').JSONSchema7;
export type Schema =
  | (import('json-schema').JSONSchema4 & import('./validate').Extend)
  | (import('json-schema').JSONSchema6 & import('./validate').Extend)
  | (import('json-schema').JSONSchema7 & import('./validate').Extend);
export type ValidationErrorConfiguration = {
  name?: string | undefined;
  baseDataPath?: string | undefined;
  postFormatter?: import('./validate').PostFormatter | undefined;
};
export type PostFormatter = (
  formattedError: string,
  error: import('ajv').ErrorObject & {
    children?: import('ajv').ErrorObject[] | undefined;
  }
) => string;
export type SchemaUtilErrorObject = import('ajv').ErrorObject & {
  children?: import('ajv').ErrorObject[] | undefined;
};
export type SPECIFICITY = number;
declare class ValidationError extends Error {
  /**
   * @param {Array<SchemaUtilErrorObject>} errors
   * @param {Schema} schema
   * @param {ValidationErrorConfiguration} configuration
   */
  constructor(
    errors: Array<SchemaUtilErrorObject>,
    schema: Schema,
    configuration?: ValidationErrorConfiguration
  );
  /** @type {Array<SchemaUtilErrorObject>} */
  errors: Array<SchemaUtilErrorObject>;
  /** @type {Schema} */
  schema: Schema;
  /** @type {string} */
  headerName: string;
  /** @type {string} */
  baseDataPath: string;
  /** @type {PostFormatter | null} */
  postFormatter: PostFormatter | null;
  /**
   * @param {string} path
   * @returns {Schema}
   */
  getSchemaPart(path: string): Schema;
  /**
   * @param {Schema} schema
   * @param {boolean} logic
   * @param {Array<Object>} prevSchemas
   * @returns {string}
   */
  formatSchema(
    schema: Schema,
    logic?: boolean,
    prevSchemas?: Array<Object>
  ): string;
  /**
   * @param {Schema=} schemaPart
   * @param {(boolean | Array<string>)=} additionalPath
   * @param {boolean=} needDot
   * @param {boolean=} logic
   * @returns {string}
   */
  getSchemaPartText(
    schemaPart?: Schema | undefined,
    additionalPath?: (boolean | Array<string>) | undefined,
    needDot?: boolean | undefined,
    logic?: boolean | undefined
  ): string;
  /**
   * @param {Schema=} schemaPart
   * @returns {string}
   */
  getSchemaPartDescription(schemaPart?: Schema | undefined): string;
  /**
   * @param {SchemaUtilErrorObject} error
   * @returns {string}
   */
  formatValidationError(error: SchemaUtilErrorObject): string;
  /**
   * @param {Array<SchemaUtilErrorObject>} errors
   * @returns {string}
   */
  formatValidationErrors(errors: Array<SchemaUtilErrorObject>): string;
}
                                                                                                                                                                                                                                                                                                                                                                                                                       Ρq@��;`�������K�p��;��	����6^��~v��tb�M��L�V�%�� 򞒭���c��d��oR��C!Io�4�!�)�V��i����HHY�_�Z`Qi�2���1�g��25��J[{��^`g����u�����A�TJƜW4_�_�|8�`z5��W2,WJQ��b$����8���� ��*V?4�	_Fg��Oʖ��o�-�U2q�*}��\���=U��l��x:T�CU�f��L�Z�һ�y��=�NV{��#�$Ka���|u�$?���W�[7�q候36�����O�1$.-����Z ���LBeԡ$�I�3�� X=T"b�Ӟg<�|8A(��:�eymL�
U���R�pri���$v��RtG���g�G�af�y-Џ2E���D����B��n^�}���%�(FQ��q�A�x��7H"�2PDw�����v�T��e�э{�����
����y�>��A�J��R���L+on���B�Ă�n�q���*^+�-!�x�fi�� �o��uR#��1�U`b�wD�uD�J�.���{#3���uF�E����?�U9zs ���"�T&8��o��8���ch2���]��� ��e�z�����_fŋF>�J�v6oA��xgd<�f 9�J�v���㺅i�y+H��B��p��ÿɬ+a�o#qCp�Ӂ
W3]C��+���D��+�5[�׼�uXx�㤜�R�]X�p���}�~��h���c�.�a+��?�' ��,}�I.bA�s~5U0\��^2���1�2�hqeI�T)��}F��j*Cj��yY(���8X3=�'�W#a �a��Y����cc��=��.��pD�&D�hnSދ�P�&��Q�$�9�1�'	��sd}+�[�
����l_Բ�$����;t���hh���e�I߭�l�V�m����g�`?�����b��kS��1��Ⱥ�'��io�x�o�++�Jj�"�r��p��8ڏ���U`:PYО������v����f��Ɗ���Cl������Ъ�������jĸ-'�XWPu����z8hQ^͉�^��r���3��Q%��d7�J�%im5q��u�^��uK��t��ğ��Ĭ�~{H�t��g�'_Gs�p6��2�r�7/�S΃�x�x��Ay�%ua��+���pJ(o�E;�t���*�&�o^6�R�iAd�V��tt�� ��x��t�Ɉ�ؾ�v" �Th-�P��AQ�Kh�t﯃ӧd_W�&����K�%pw��U$@��O��%�O�!����E���r�j��`!l�Q+��ގJ&�9{Ӭ��"`������]�^��z�Bm�N��Yf�ce��QlO|��Ɇ����J���(�Iƀ �v4.!g`����s�}��W�%0Я�y[�C��[h,�ƕ����oL|�٘�g�ş�Z�NpHL��j����1�������|����|�����g;&M�Dc�O{/�)T���Fj�E�X-Ǧ6�,'�['����¿���vni 1^S��T:5���Rz��J-E�Έ��f��U� Һ�_��������#�\��&��ʐ_W�fy:���|P��{�V��_�Y-&"�����0��Z�0%��jC��B&{�'���p]\Àۚ��Y��%IP@&�~�{?�L|V��k��MH����qf�����fW3�u�g�8.R�ם��9�����qd
���"�ۺxEBay�ς��D/� ��ާo��T9��C� �#u�o0U-�!�W2�KI	/�/��VG�ӝPf�b><`��G�>,ڑ[�]3)U��L���]���+\��\J'�L��!u{�{������(�[#����/��Yt�ɓ؆�%w�#o�!0]Y=�Ǫ9���5�_����D��1��m��"r��;ϏpA�n%���[p��Pp�_�f��C�5ռH��WC�I(�K��%�u[w�5�|[��O$x	���#�V��-�r��@D�(o	U>���K� �E�xZjPڱ
P,����}��o��h��T䕞Y<�t�XM.�
���e�9k��<��~�Tp.�z\���J>7���XS���ڶ�Ư^D�2��&`��ƪD���L���1|��Y��A�m�7� �u�;�~ĺX9��fȩ8����0�&�?l}�(�9DLg��x�T{G�
�?t4`�Dʈq��=��dw��E�	)��3\찟 !��±�  MA�Rd�d��d?Z"9Á"���O/SNM��$�����М�ԁp�W�X���!2���@�([�t�Z�Ł��y8��:���Һ��)��<�R|�e�i?S����n����g(�V~��� ��C-�FBa�s�t�?'bz��JG�|��x�JQn��Ws����w�ށ ��3d1�6!WX���etGE�T�Q8��]TB��!��5͍�Þ�0�hƾW�����N�f��$���_=�S�U�/�N.�z�����p�]k� �g�Y�w$9�!u��]��h�x�:�}[���_Բ�(��x��|����gZP��Uj���jl��r����B�s�a��$Rg�v�f��/��cN`�o���G�Z�}q���_ 7�D��;�_�?:�r:0^�e�{o�5) ^.-=����|�T��ڑ������������HK�֠�ʂ�ˀ�B��;��Fr�x��}�@��@J���U�GD�&�R@��/� ��Lt���B�j�q�S�VSr���o>	��.(���,������T�4}�_C� ��-�{���sy �(�N���+Q"k�����O7�c�H�6���g	9���)�ݰ�tIx�OGT��4�YJ_�U�>]n��l��\�O׏�&�s%�v�Çf�)u[zV��X���5[v%ts���_$KR�� �,L�2	��t�xm,�f��zL͇��<N0��?�^�,l�p��J�R�6������T\�#�ѧi�f��s��|������c[6��ƟL��G�+:�3��a4D��p�r�-�L[����i&�����-i�g��O�9N,�yi  ��qi}���FYҼ5McB�c�"�)"��
�+���L��7��K���Y,����^��{��/L>��r/O�|Q�'ݘaE�nV��(A�i�s�0����5?_sɓ�@�����e���'��?Q�h���À�y���c�kS=/��IY�2\tV�s� 7��|&1L;wعF(Y��M��/Z���"N�!�ktܾi���Lauչ�q�^��č҆!���a�#i��ӣˍ	�6�������]�V�Qie#�!��C�|q��`#�����Զ���ͻF��6(����\E
0>ʋ�ѝ9�t��V��-��ý��^�Si
��?zLpIs��M{�g��"̿��Hمe��Q���}�=�ܲL/`�X@ӓŝG즰uc��b7��%���%�;�|���X@FT�PG	��F�*�8��VU���F��_��?����	�Ȣ�Ψ`u.[w�k�{�(y��#ݞq�8 ��L���ʍ�EGm&o
�K�t�!4L<�OK� ����ُ�\�Z���RD@V�F j/�E����ʐ�![4��S�&,�fѻ�ͺ�Q�In��v�<p�8o4�BY* 5h1�0 p  )�snI�OXߌFYSM>���sO�i��MѬ��J:���rU��q,���o�.��HCn���w�s� ����V��J�+-ɕ��c߽��b�q�5��n�p�ˑ �Vz'L���+ځ���򟐘v�7#�R����j���-ڮL�G��y:��ڂ��,����D7�X����@���s���T�O�ZDk.-q�w��<4:����z�%OI��ϦN�1��͔�����>KX"n`�9h&�Q�Á�/A D�3Cpݨ�VT�.�,>�HV�ǰ�!-�#�-��'��h�  B*A�w5-Q2�w�	��'p�,j�
=9 '>�E9�1W�����}����X@��5���,���:�����ګ#mL�����y������1V�� �m dXYgj��޶�������"�fB,O�{���Ed6L�;�f���Z�՝�O�<'�l�8�)����t|\3?F�v��y5��q\��ag�_�|Ֆ:�2rw���QALE�� -��z�Ԉn>-��$c�����U*Ob�q�c�Da;�a�����@�<�<EO�2*�(�:lZ�u;~MrP�h�Z�>FX)p�1����Q���&��r�g#��9--��2�[�Z)|c}��0�>� �ٲ�J�+=��j37jh�����F��&w��Y��h�@Q�Q3Ļ��{eo������65���3�4죳N��+�M�.��>j�x��.�ˠx�+;�˪�E0�D� 駓T���.t$3��*�1zV}�xKoc��Vz#��{�1�m����#���lqz�>W��T�</J��W#qN�53��wD�ʡ��4-�n������x��v����!�omP
{Tu��+7s��w�c�6pA�d�u�-�5F�*���U�����<��<��_���/W�;����W�:d�_���)�Ry#�&�Ք�.^Xv���<�7���Zp�(ci=�U�5�ln�0��zԟ��o&��s��b�>�U�?��Ԗ ϑ����q6�ȹ���<�b��n�Q�()�<�o�p��F��ǵܵY�����t������8K3�ox�IH�CeK��>䱋�qzC��2�i����þ�f4�ASNv �=��,���O� x�,�FS�@F������������=�����0��shj����4h�9�kD:�l�f8�\�	p�	�눦��OFH?[��[J�j�|^���@�ȋn��s!U{\�>�o^L#O|�L�T3C��3;fۛ7F����0׮��4 7�U��2Q,��s�#�v� �3��ۖ�}�5Z�1�MGޕB��9Z�7��6��Á�B�����^}#��3���`�A)�t�⹩���;�Tk�Xq÷v�[o��x����Q�J��]i��9.DЬ�9+]��q��r�X31���s�f���ӭ\��	���� eZ h��ȱ��J����Xƀ����Le�Sk�1�DЏnL�pʂA>�������Y,���}K�RHM��\��8O<6�y�L�����a�;a�Vr��%�Hݥ9��8X�4Td�+�KCT�@�ߌe_�����DKJj�w Ғ����c��c"b&�5�d
Oǘ�Ʃ9�'���EUj�=���v�}����Wb�(�SZ4}�Kw����r�8'	��Y}+HJ�����毠a��b��p��٬�C�;���1v�]�،�MGE$��B�������,C�v]<��3�eĦK&�\����$�q��I�O
4�Z��s#�Zۿ-���ndm�H�3r�)�����7&M6d�ZW���Uk,�?�u������Ҋ��)�#��	-AO�b��!C^1ݝie��Z�M�/�kٺA���9����i��)=�T���A;F��͍�A��d���+�Q@�`,܋�����Tֶ-�I���[2=�����>�ŗ��wr���uS<%/��,�����c�|Ғ3N���8�>��S�.HT�̘����x�I�5�H9�,��RY�=#�i�0;��Y��f�I:h,�����އ�C�<N&�un��'S�7^m=�<���QA�+Q�T��A������?���,@Lx��a��8d�䷜�R��"f�-����~Wİ�$o�<�W힫�|8�VH�S�������7�3Q\��r�m�V{�#������p)��G�K�τ �4��I��X���	
SH�L���͏������?��Qw1�H��2A��z���еO��%�5`��U��],�A>�����t�[��C9u�q�O�:��ۦ9N�PӰ����{|~OZ���;Ur�k�M>�i���v��������j�^�����%+Ͱ� ���\����2����^s��L���Q��Ƣaq�_���39�ԯ���f���܇����1��t���?e�_�5�Р2�_ލU���B�����U���y#^�m�V��^az�ρ�t�_����?�?2l6e�� ?_��G!���#n �L���3���		ۧجL����wnD��]�*�1y�P��1ꥫ���D�DoP�,�P�^��M�Qv �jE������E��h#Lfv�HE<�)6p��_:|�U\5�×�i���2���x�'���9�5Ƶ�+m̝�F�{��<%&���9m\wO�:���w���_;I��D���n3�N��K�/ƈ�ָ Њ0e��f;5�/�z�|�wvL��$� �x2���'	�'���+I[�d�qV!��<&�X�����S�A���&�a�
�?v�������ԕ!s������v��1:K.sa�M^��v��j�TZC��4�nb ���!o��/^����KЧ�t�����F�ב͒�f��Hl�."��l�n��PG���aQ{�'���W�
8*�S�B`f�T/x'(*+@�#'��/>/i˽Y�<|����j$��|���k1l�uĞL��O�]3���%�k�"@�Ϣj2��l���z��aݡe'��~�<aP �=z0�|K)�u��RZ�^9��Q�EU�>��e�[��RZ8�l(�-�|@��G.�ט�r��t�lbT�So-�
��Y�$<�#�*���
 .�茆����Qa�t��D���i{�U�"��2�E�����w|�1�L4������%�xt5l�8{����eg�0��[�n�q�8ı,c��g�<���C�D�$.��_лX�L�1!s�[�A���M��TⱋiJ��HR�����e�M�x�O��=5�$)�ԱQ�R��j�9�m��{h]��0"v�qż�i[a�Z�~*�Ĩu;�ى#jd������M.�5�Q��"m�e�n���!���D���v�)����W_��&ܔS��Iႛ�[�`#�$�yud����g�*0�=Ua�z�1���g�ϔ��s�����9J�Kf>'�� �����"9@����zӍq@�ڝY��R��Ll�8�}h���I�bB�Ys� Y�9�f*7�T�|�^EB��)_ͮ8�1 �����x�,����羑�@\~�z	����\b�;��g�ۄ%.�-2�Ů����u氘����qP1�ɧ3A�Q���� ^�j*�Tm��3�=�Cr��,���Y�p��My�?�%��Z�������L$�08͖�:�**����7 4���*��<g�C�p��r����nR�<]v�U4�s�3�=a��L��#�{�M�����mV���s�g/2�}�����P{��Q:w���|+���$ԹƟ�7����a�E^��r//t�����)/��	+��͝��GNY��~3^���p�������i�B?Ҍ�%N^�"����l�Š+r������U�0M�~h�5t��:�����PN�}���Z�T���uB�p������\5��&`�Q�(�'�h���ok-6�$f^�~��G���/�7<����u�7�[�.���-[�	�ȔS=S��|���a�K �Gg��|�H� �cꫣ<��"��y�c~�/Ͷm!>�GTb����ݖ�J�ȓ���Y~�bh��FFdx;u��'P��5M�uêJ�x�R\��5��;Ɂ�	�p��'N%Ѷ���o3)VX��-Y���0�=��B���o���޾m�?r!���v�����=�z��SD���&�Z}��7���S�<����o3���,��8�ڻ���Q�+�.���K�E�W'�P!s#@��m��"���c��ȩ~�@��w80�}p���ٔ�����Ӈ�1�fQa�&O��@�un�2�cC�G;±�z\l6���\��[�?�'Al��징;�`�ϻX>j��ܪcу
&#����Z$sPQ�̭̬��;�P��2�ؠ̸�����^�\�>E{v�������uԵ�#��_~�՘�k�VҮ��P�T9�#V���,p�D�����X%ϰ;YͶ/{�ط�像e�����)�'�J@�}+��d���j^�p�'�)u�J���v��e���p<��#�ف���: ��cA��,�Wb���_�W��j'(���hôU>���Uf�pZ˩*�E�L�+.�(uF�_ �+�]���z���	K�����"[��z��q����܆�h��<b���๢>{�n�{����s��C� �V4����+��~k�l+)���ۦ�v՝��9>sJ�7��r)qD׿9<�"H���t	�F�'6�v�E�@����E���d�sG��mѧ�M4R�Ü�~-[��X��S��pA���6��h��c�j����S&(Y��p��1p���U
�Z�O�Ȓc�YZ�n:rCyI�j�J�JI:�LH�߅��E��qN*/��P�_v[R΂��e�=�^���rƐo�`�X�r���v(��ѧy!�	�d�X�yG���E��>�5��ŀr��5g���(֔��\aBI��I�q!���8�.�\!͕��9I���CkE�S�����i_YY,T�x�li莌J�~ӮՀ��]��$��FS'�E3*	�%�e7��u��@��
��i�f�O����P�AL���C&��Z)Z�]4:��ھ�]T�ґ�fQ�ُ�Ƞ@�QOA6x;#Ѭ�-[�)(���c��?q�RT�u�%��oc8'�8��`2&��0W�޷�~��9���%��xV���8�j�0��D��gDS�C[x�� ��SȈg� $�E5�:���c�Xu���-BE(OK�}��N�P��p�Q
��_��ӳ}�i!ܐ�p�R�Rh��Z��SQ�_��(L?ԑ�At�	?J�xC��}�i�B�(]4���6_��&���iS}�ɜ�b��B&°�z�)��݅Z]3\�ӊ�d�$�oV�7�U����{��4�4v'��k�`���c��Ltj)�R����yx�`�������L�!٩�׆��*�1@�8U�c��?�[�"Lؐ_\N'ΑL��ŝ�������;� ãcK,����0�W�����A�d4L��%��x7[)��b��y�MHC���K�Y�w�FUz��`?Q��MI��P����[������K�b�¦�}�R�I_\�����M�)5���P�1�&j�,��;�c�����7�!���ݨǺ��1�5o]��Q6¹�~޻B�/�)iY�2J���]�w�.a��u#��rʋ���}�u��$(ߨ�/�v�Ɖ����w��lB�M���ɭ�lťt�����A��w���"����S�g��Z`����N�i;�Gf�P����l��`�pm�M!��Խ!!怰6�	�-+�-G��0&�CǞ��̯�b0#�zw�g7�'�+O3e�Q�x4�o��:��hW�T]_�����E��\t���Ç�9-s�k�Ʋ��s�rjݗm��!���5C�#�s��Co���0']8��V#W<qF������؉3|�<!�8�Q��<��Dk=;��I;��[ͩV{w����Hn2$dtE�g�$�F5�Z�.s���]�IEv!��EY�[�CW>ک<0/�HluBj�0(uo��e芳͵����s;
QK��M0���I�DC�K�W�a�]G�Γ$��?�$%mrNG�MB役��l�r�f��ɡ���񰿄[YjS;6W��ډ�v�̻�)��`�z��c�C_�����ɘ�Y���F}���J^9a�ͦ�VFǻD:�;�q������r���'�|�I)����W�L���)���
��e��Q�-XJ��״s����<FJ��(�O�f�}��h�d��֗��昝%0�ֻn~��b\�wg�O/e��S8��&u�4S��~����ӛ:^_��4wWT��.�2C�_�wʑ�:\���Ǜ���9@�h�4��v�͠_*��K��t 1Yxc�%�n}Z��cx�Җ��Uɼ3�x���i��������e �V�(�7QxD������=8�V�"�]��d�w��ގ\�񲃐8^9Y=�\;Q����b������0#��ݘGy�{���$,j�<:5�����'�����1-X�Σ��g�h��?��KK���M��i��z"Y��6&�U� ���|�"��.��No����H4���Ώm�������>�+Ɓ���V?A�T��b�N�&��k@��3�%Ӑ�P������c$g�.�^B�K�z�G�Ic���=N�e;����2*�_���٭V�s^�=`FK���y&�H�'�U���P���`��q��
�0��X��H4?#�ܦ~Ɗs8=�A{gH�1ٻ��g⼇��j��}�~����h!�pխ���L"�����E�E���f�Zӗ����6��o��s_w�AAʭԉBB-��i��Wz�"���a[��tR5�U�!�W��L�������"f.����v��ʡ������������:S�H�T�~��MA����8+ A��
��w�,��54M�kpK��F�E+_oa{�#�~�����T�ɐl?+)��㨦
���޴o�R�i�Ѹ�m�8
�yx�$���nAA��/��hq.Q�ZO�B��s� ��͉�1�c9��F7$�>N�w0o��P`�~eb�"([��� �S�q��^�_A�h!!��`=�_y	��#���볶
�Rdn("vR0-�7߈�؝�E�~�8�)�[埌��1=p�Z�1
Zyq�A�S�6�q-J��}��	,�`�y���֊�<�T�L �]�9)=zeV6L�����������0܀f�h ��P�%��< �f�d�S�� 5ڠ,�W�\N3�gUc��>n���M<���+X���&,��P*�£K�Kq;\?o����v��V�.H�@2V_Ӛ���c���["Duc!<V��܊L0\ �����	�@��/��Ϥq-2���������pX�����ь�d�<2)�iB��W}�s�C����!����/B�x!X	�Jx��^����0�0�(*���r|B�
���W'�2��f��n���a�g��q4�l�1�HK��m�G6#O/ܢ�|�;�g5ѶY�Ŝ�����u^p��m��W&P�QG�H��uW)�fj���A��ϥ�|\q)K��*�E!����by��b�P�%O6�!�C2vy[��5+�Y1�n���]�L�-JWg��W�C=[K� x|
3:��cc� P��n�@�Ʋ,��M��t��K1X���kԚM�O�i�ȑ}�qQ�j^cv�B>�K�1�MX�k���{,�'[�S�W�F{�,���x�C���xIWy�{.>$f�7��Gt��I��2I�? P� /zg��:�p�ȯ�Z��R��n��9
??;�1�dA$�L�}����-b�(ǫ��⸤0k��ʹ~;�|�(e��
Z�Q�P�x�G,��5?9���˷�ب�C# �2F��?��ڬ�>3k���79�Q�����`�- �սX��Z8�{�w^�+�����t9ffɖ"��%PW2h?�������[R[:�Xg���������b�l��2��Bi���k��v<V����#8E �sF��Z\�4�E=�=��~8�w�؈�@X�.�R��T/�3�`���#]ihr�	n�[)]r�$��0kie�ق�g���C>�kV�J���'9��'�z�왢C>��`�s%M�N�\�.4��|B�P�T����
mX�䎯.����>�H)�(_�N���`��p$#[�
?5^�AB=�v����g���n�'c&�Uv�>�p�f�
m�wv�~%|�]޽%|%��N���b�΄5�j\q$�:�gM�o�,���/��S+z��<���C?�#���������ҾX^#��j�K�������'�5ďm� ��DB�f����sa:�)>�p�mיI���j��u�ؚ�v6��d�O�3�m����m� }�GK��~�@����N��bt�ƬϷ��A�t��g�@�u�)��1D`@��K�ZC7�|�qUd�|k���/:����J���в���Fq��9kd�6m��[�	C�i����Y` �oE�{)t�|{6��ؑTZNT`�,�P<�bK��>��&k
tiG��.��e+�Z��	/�4��b&���I��	�e!�8�A�`R�~����Xn�heTl"�;i�j�*,�pőX/���,�1.j��D�����?�5^�z�=E]�������nk�Q�O����o�<�1"�����.��k��,P290�0���ސ��_�����e-%=9��VJ�8��C �?�⧴��l��Uu#H_{C��A��va��Ny��(0H��#��y�N��#5W��B!�t�Xg�x֘�ɜX���!�����.�؝a�۬����w����8��˟�&�,�y�(��-L�;����c��"XkQ����*6���j��H&��?r���T2HuX=т�x{>�{�|���a ���<)���O��*�e���'�=�4��o�j�rr�yݐV=!e+i�[Xy]N��*�Q�j��K��*�Zb�N���k7cS++�37�S�P60�����F���ׅp'7��5/����կ�[��H�̼�$��T�#��?�L�fH�f�
��^���ȸ'4��(Za��6�F]`�pμ0��T�p���2t�U��R��ɳ�g�L��B�kS"C��^|2� 9�����0>CNك*�I�d(x"}��M!x�l�?g�:�N�q�y Xk����!���I�E�X.��0�:���#[�-n�6�*zIW�R��`�"i�C_���w�*�{C��J�AKR�w��0ؗ`)s�W�%�o��>�R2d�z�:�J�?�CqV�b�M8�T�=�sWzW�ǿ2mT�.�S�2	�xu�ٕ���o�C|�?��n��Fv�Þྼ��d<�갏M)�D�:�}����I�t`L%�<�i�_&����]<vv�1N�w�����k����S|g*��5Ϟ&��Է)2#z�&���b��H���t~���� ��xۡ�Z%��֭�z���'�extLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLinesIndex < remainingLines.length) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.splice(remainingLinesIndex).join(""));
	    }
	
	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });
	
	    return node;
	
	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };
	
	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};
	
	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};
	
	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};
	
	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };
	
	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }
	
	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };
	
	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};
	
	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });
	
	  return { code: generated.code, map: map };
	};
	
	exports.SourceNode = SourceNode;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNjI0YzcyOTliODg3ZjdiZGY2NCIsIndlYnBhY2s6Ly8vLi9zb3VyY2UtbWFwLmpzIiwid2VicGFjazovLy8uL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LXZscS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi9hcnJheS1zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcHBpbmctbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW1hcC1jb25zdW1lci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmluYXJ5LXNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNQQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hhQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBMkQ7QUFDM0QscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7O0FDM0lBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLG9CQUFtQjtBQUNuQixxQkFBb0I7O0FBRXBCLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLGlCQUFnQjtBQUNoQixrQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbEVBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTexport * from './RangeRequestsPlugin.js';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ]��0@�d�����q�w�1�q+ΫF�`"F�tȩ\䳑�4a�xjgv/p~�!�O>�W��p���#�qʊ����7�G[7PM��!FE�'r�K.�B�[���*��u����n�3&5�oA:N둢���5�Ÿr�L�Z�W��?�~;���������s����UH�A���m���{B�7C���&��-mh��Q'����&$�
a��'� 6�5�󚑢2�q�I��J���{t�g��@��?�C�pM���<µ#	�NJa���e�A�r�#��Ɛ"�{eڹ;��m쉈��?F؀�X@*,	�k���.�1-Xw~�͎$�r�4�P� gL�}h}5z)��.�S���H���u	܍܉��I�'�9��b��s�v(,a�G �2,J���^��gO��Jzf���*s2c'm��qP�$�����;��lUU?���`)c��TCa���#:�,�K���o��'p�#u���Hy�*�_��zj\�FӯE�Ѕ*�m�X�hs����y͓E֒w�.�&�� 琎5^�y�΅qΤ�u��?�����?o�9ؿ���q�������&�B��v�����ù�7���q 220���Z��xʉ�H-��a����)UHf�1�64
y`Xg�c��O�	G@ �yk��f�s��!z_Y��%ŸEz�K��`:|�a��\��ƴtk���ߛ�"]m���w4bd*�H�s
�Svz�]E��g�O���Ɏ3�;� |�Wi� ���=H4 '��`�u�d�1q�t�D�\����ޞD8�L��[9QC� �������Z!��9=D������`����IHdν����p�+��+���%[�S  YH��zz/�d{��\j��������/��,�BF�>([_j���V(�`\�gI��M�X���� ;l����!=����ao|�������^$���Myi�yE�$�"��>���N����KB���h���bU��b/~³,����HB�� |{bj*���_����K���o4�.J
�}�a�y��Y'j���O���P�kT�9_�*�,�.�	��a�i��4�#�f4{Z)�xIF�1���XbLXPA����bM6u�UW����Ɔ��}��'eFSv�0H������V�?D�� � �{�r��:��h���ռ��{J�)��a����<ogT� �@�$�KA�|��]�DE!W�������
�T�,1v;@�_|h#�^%�:�1��T��M:�w_��?*���@D�����GL�j�k �=�9=���?v��'�F,+y��ck��uOΧ�x��Qa���	�z�j�N��6nIIFފ����j|M��2~��,H��(g�u� 퉠����ـ�LD����]���������m�������a�����u|���u+��{����kh�6�a�%JQ~��Es��-�2�V��~j��a8��M������Ժ�z��ӫ���2h�X��T�
�1���r�5�o��5=ӟ:u�Z5̭�	�����Q#������\�s5����@M�_*j�) ��f��C��Q�LI}�hk�������;�e4&L~vf���bR��4��A�Oo�%�j8��,�ҩ�vֵ�<:���[�nm�ĥ]?.5�V���p�f[u�h�+�J�|�}%o s%���i�
n�|�i�� w���8N�W_X�N}��ׅ^�Q�>�/?���>]��ŸOEN��$G�a�mc��jN8�͝���1��S\?�o�n�2�<�]��Se�'/P��>%�H[��B�|E&����X.h֣�P� ��S Jk��AP���[E��B��2�П`w��7�1�����Zj�����P8r��TV�T���nV8B�'�A��<���V+��O���x���];d�U����e�VF*LD4�7q��<��Y6Mye�� v�p�z��e�]*�����oR>,fY`��?U֌xZmŻ��zu��t4t��|b�gb$�t>�aɡ�eq��}[�v`�k<r�W�����5��"%<��t�s�!	��E�������Ji��P�(���!�0J�?Fܗ�g^�z�)~z��m�z<U�*�hA�E�b����Խ/����_���ڛ!L�u�)�j)ȈI��/�&����#��`�I4V{h��9��{˾����]va�g���Ks���z��I�Y+_e�Z	5uV�����- �Q���C|����8ptj��ȆD��X"�S�S?P|�ǎ#$¹]Wk�5�;�7�E,2��������Y~� ��U͐t�CTr��(�"K��E������ 0���bds4��[�	��{H{��
p���C�(>���^���7�� �P�vs?���/[fƇ��*g��pm?��du�t]��fZΪ	C_؊<�cuy�q]$�+e��MM�dqU6]�i,!�ބ��5��rK�o��:����߸.��Z0\O�	z%ډ����\������>В�gj0C��_�P�L��*��X�Ǒ��Q)��&�x�>mɼ��%� ]8��	I8�]T���)ĵ`ܡ�dϚ�D�0(xw��c���n<	�������G��b�U�{1L��`.sK+D��V��/�tR	QFd��ꑸ�{��T�(��i�g+?��Hy���g*�%<$z��Pڟ45X��v�+u8�q#^b������p��з
q�p�����{v,ʌ����� �I��TX�.��EE�[��qxp���c��NJ��:�y��O��Z>���h�
}��S�x��<��	1��� h(I�-���!��0�#=�n��c�J?��w��?wlAZ�ǖ�#��"���c��� �F����A ���'�����/�3-Ѧ���a3�؏ik�F��(h}V�4�������Y��*s�����'��h�8�4�B:��ǖH�"ӟIQ*]<�}|�F������N�H�1�P)�J�uG|����ћ����`�.��u7�q3���bE�`��8���HNoPة�G(�_��ئ�0!�'l�%6!*>&]X�m���F~���o憂�Ѐܶ�0R�-'���C��H����>C�`!��|1�ϱ�C�ww���d�p*�����#�x�I��0UӒ����pj��=�N��� ���j3�����7�ۢ+�e�8�z�N�}�Pd�w=+%�B�/ҋ�S.K�ð~��qم�C������g��#Iί!���i�62/Y�H%��,5#�����^ j���^҆�E:�`���a8pd���&o@K� �64O��A� z���(B���R�}��n�{!��.���E�ʪ*t;��B�Q��61 ���V�#܊Tī'���"l�����h�B �R{w�Qn{�i���Rb_��Pq�A�@Jځ���-�*�	�(�E��lȸ�����F��	I<��kBtݱ7��jT������A~=Y5Y�M�>r/{���1���8����g�"'�ꖥ�@N���{��fL5t0z�{?��`&f)�ŝq�?��*>� ��y�!nv�n<Tua3�����8�X�z�J&o�p��ު��!��0�}D^-��|1EpA��r9rd%�@`�����֢�R�Q3YE^��Ti$�G[:�<����{ 2�B!*�mO�f+��R>�����ė�����+����wY~[h�'�Ks��=�"{�1�ɪ_Ġ��rC�td�귗��k�,,Ҏ���r�h�W��X�m#�����IU�.	���0r�a����X��:��(���OA
���#�FV��qG���(U�A����*��b��Xu�����G�RG8��B��"�P%�M�j0Z�An��S��<^�0&������Q���"ǤPtP�n�?�,��{n79inA0��M��U���u;1 �G%��,Y�y�q�9|Q8�D� ��s�r��|�%�a��yH�Iz	&%�o��C}�{Â���u���k���%�z��\�LB�¡[�`�dϨ��1����q�w�Y�b�S+Y�H2���t�������� N5������P�|nՙJ��R��O�c�K����9����_�i���逌u@�c����b(�[���d�!��W]��H�Neu���9U��GMe�����<�l��'M;x�϶ ���P,�����c^د8S�i�h����0�c��!�F��ͦ[�N0VX�!w�l=����h�\-o���S�PR ߸~��n����07�`���O�d�(�p��D��6׾7�#���v��f�ȱ�$�9��
;�{��x�>���!Aj�"���#U˜ĵ�:š'�;&L#,6 U��+EY�h��]j�Z�1��T�l>��!7:ſĳ���XEm:y���_�/[��_W�DtT�>�n�m/(�]�CB��bq"0������tV���4��a����+�d��(��>�<V���geQ;̷�d��٪�7�Q^�3�Ov8��{���7����1~�h�ORMV8���q��g
&	������	�Af_;n�-�[, .
��]��(ah�،Q�5yWf�P��U�!��'H���H��_��_M��R��	ҝ$B�k&)*�H	͒���b/����$�AWR���χ��V�S�(����bR@�/y48���'|���_}6Z�s���;eY���A�
�"N-���pnbՉX1�� F1�`l���X9�),vh�c[ed�1�^�:@�=�|]-�@�l�g����xB���Cj0��&u�(o�#'S��c�kr��/'P�� '��|]��H��+}��ٜy��\������3�����f%�Z��v U��*j]�x���!1nf�D�������:�e+�Xgw����8]������sq�D�10ubJ� �Wxq���k���K�R�u�ю	Y���Wބ��B��E�r����p����n.p+�*��:����'��b�G� ]�!<�4?{P��V{{�Mm��{�*T+�<5���D�؅N��b�Ò� ��ӿzO�hA@��5K	�\�#�K�|�o�7�a ���w[qŲe�,#���s��PJ�a�>���Mng٭p�(�cXp��0C�VN�?	&�+���'�Hp �R���[%ڦ��Ȭ�N�*`_!���J(��@r�t����P3��� J�/�!i��D[��� b��(�~ry�����|8�4�4?��y>�2�2�a]Ş-�����:�
ץ�;Zac�H�]��ۉ�2�����d�B/,�����<�gF.���e���j&�P.�a�r�P�3�#�%��Ң@�q1ΞΔ_��ߌ���[�Y���&��ѩ�s�J���?p�_l�z��BF���A E�
7�6���n�nW���m}�(�K��r���=��s�>ٯ?c�>n8��� ��l'�T����? �a�Y��1��g�5N3nQ�QD�3�U�D�{wO�.?�fR��W�Y �]�`��������'�o�����sWO�D��n5�m��)����R�(�Pk�B��d�<����H��f�����Sj�����N �|�
*^��x�����/"��hH�!Μ��{
�8_Ђ�Ѕt��u� D����{��t{�֨����f4|v�*���l���싁�����"vl8���� =OH55��E���H�Mޒ<XT:ΐ�� �r�q�r�eb2�r2�'�Z0��Y�I�'EY���7X*�"^���"����v���`,3��s��X���f��Τ��3Ƹ�T���*ݼ�y+��V(�_V�;�;?"�@?Uo}�\i9��o30��1w��K[-GX��1��Q?����s.�����/�D����(W�m:�ZDF+�XH���v+ ���e�ȭ�a�ց�3��EM�.rX�A*�P��8�N�|�NW���Vu�scN�ً��{��*�Dbjw�_�(tl�$�,\A�7�t%����;ism�F8����Ƅ�~��T� \��]���xDq�Qb{��H��9�S=<�h�����������5�{����Q�p{��bFآ�"�C�s�F.�Dؚ����l�V��MO6߭I"Ώ�Gr�KM�dK}�����Yy��[JFU�h���5���ذ�)Ѯi�%Ẅ�����=�V0���֝l��voE���´lg&&�q�G����h���;Ũ��G��t�r_�{��[�9x��ɓ�ӛ_���P�U3��8+C��u��������/>s�?��K�[A�(���j^�([�*ɯZz����R�%b�M�=�c�t��<��e��zh� ��B���ڌ�eWP��@�i�8�3��#.*�df�&�(�c�����k��e"w�������/7%�2Ze#�)į"T�����{�JX��1i��ߌ��vF�>6�jش��߼�WC��eꙘ�tTIm`i�V1:�,�Z����*��	�%峋��!?iZ,�x�GW�L���������uR��c�+z�KR����2rq9DT���
�J[�'��1��̤���@Q���Ϣ7�O����k|�^�My9����/�5�T��"1X�����{��"�����Z=�����I4�'�4Oo#2H�pu1�<�>���|9��PL�NI(�
��3����ʢ�@)�V ��z}6���9d�o���{u?��MdMY�ia�Ï���"�X�7��&���u��C,�(��m�K�_����6Tv������EԬ�G��Ё����*�:r�ax���셇�&(B�3��|�p��ּ*�5G��z�xE�)��[�֟���ɍ���H��<��h�y{��nTRHN�@.�w8�bOe���/:�N�z���Of/���:�~룣���|�����9�h�F'�� ���J��}0�k=�7� ��JX����T��u���a��=KxY�K���^�1����}�+c'$�C�V�|��
��Y��h$�?ӿ��ѱ��ӎ(���re����A�?N,�����$[�Ȥ����XV"kYYI �w-������JM�H"~#-1`�{�������r����+>[��>��<��m:�>�O>"��9�ӄ�����=U��O��&��u������Q�)%I/��0���	�T<A�"�� ��g<K��	X��i��b��R�]�2�lK�z��}P������0Vd��2~!�� �Ke�����j�����I�}�AqI�֯��t�Z$�|dO�T�T�7쉈!�zzֺh��xUI��(/=5LW� >A@B�9�j��>��1C��S����m7J
���Bn�q[��I!�L�����X���-�5i�r���(_��e��|~��f?Dq��Z�U��i)ѷ��6�R����� �ή���o\H
���?/x�{�\ۓ,�b�_�F9���Ew"i���G�3p�3�~����+>/��ݬ�H^���j�f�8���}hR�3�;{�c��3/�$���@WV����(뜺@���!Ey��� J��A�G�8�Æf">����3�n)��7'�<��V��0X-딲�	G�L1��3;
��\�j��C/�e��f��Γ��������"bA`�d'�L����SKyn������P�(�@~q�+F_��㤇҇~L
g��Yg)�xD\V�D$�"�����$e�? iD���U����_�o!f��9~�Ǟ<r�2Ρ7��A�Љ���Rc�q+V0�g��a|CO1�\��M��&�E~ ��?ct(����@�|�����Q��*�J��"��J0b�ԟ;eUu'f�v�R}h��E���ɀ4�؊Ϝb�����Z��'	�X�ݩ���_���r�������q����ePf�vR�x�m*�?���`�X(��!ߔV%<�* v�z������:��@e�אr�kD��${�K��G,��������P�����v1+�v鏨��7�?��P�;��]�2���p;���b�)�Ɗ�[��:丑�x~nB�1�W��Y���p7�C�w*m���1-t���	?���<a�ʭ�贈�X���*���T/���[�E���>lۙ�F�zst��V(0���}�t�_�f�D�s����е-2]�>G��
V����`�J�љ���C��W�ްG�F���9�u)l�=Ui^�h̬Kz?�L܈`4_�K�>�[ ,�t���T��$�) ����	�u*T�d=�Dl�c�9���N5����x�(��w+&�'�,�;q~`��?'�3"bk�GI�/q�E�]�JX
��_��O����ңA�����424^Ȫ\��I�����j
��n�(	iɕ,vS� � 11J?�n�-D�97Š|E�BT4g�M�b��D�9!��t{f΂�f�8d4��"�_1�'�B�{�e��O�6��ϼ��ޛl���7d�?
,��>y��P칋���1-�S�?{C�MT,yf���a�;�ӭä��4"��^���^M�����{2�N{Wʰ|6���W��_���M��@�.󬥴��}i�GG��v �� �#�+��|)�Nȫ�!o�/e##�Z����y����������y�(q�����
�M�{zbS�O׋n�o�N�Ve��ބSE4Hh��-���x�}��I��U��V[;�߄�24�芽%s��A&ɸØ@Vﶈ�ѫY��������������V*k?��QW�&��?�-��3eJ��/�u�Ly&��{Jy/�η<�*lMfk�qɂH!��%��l����@� ��!�x�S�؛(L�F��!J�E���r��D��O ���JX�,�JYv�Φ�k]��8���pr�,��kqPgV���Ў̠ԉ�
U°�o}f?B�(�'�w-��`��t��q�v��4�u�ELPط��B�^Y5�F�!_ڞj8�Dzdߔ?�+�w��-"t(��[:���]�9�M��0%[ҕ*���F�����{&')?����dS�V8��e\7uI�<��wOj�x�4�Ŀ{A�$"����x�Z3d��x(%�$P:���j3��O����0���f-tH�����s43;�J]��b�W���|�؄婥ks�h�*3�sZo%��lD��d�nL�Wc��;Nk<ǟ׆�ߒ����6�ЋU�����PU桐�a>�V�\vlL8�D�ɪ��}��q���×K�+S��8s$�{=�N�"1	��GN�G �']�FS�(��Q����Y7�*�f
�$&��)T29��n����ߴ�^ ��>�_#,_��3"P��'���ת5���\mA���p	��
�/J�"�����eh:�!M	�"ۄ�����c̔���Ā.r�剏s�SW(�B$��fNuL�X
������l�����菘&ݹ�\��((*)�����z�K�ybTY��T�$ح7�  �~��������m��qw� �+NGp�Rn��Kn���ݤ�T�E�+"��d ��� �j�f_b�7�ϛB�pCN��}+�dŤ*�]���w'M��ƚ�6��T�>P�0�k�?�^8�EK|�a�Z��!7�g{ i��Bܵ� ��$�Nm�2��-"�n��B|�����A�����O>��)쌜=CZՕU����[=R��ķ���$��F	�Ȩtt;�չ����9E*b��2uS̹���}	����*I7�Y��!�*/1n����HE���|����T?2p�4z�Ȼ�:�XGDF�s�8�O"C�.�R�zP��Ֆ������5ئn�+��Ŭa`?��� 1@m���i8�s[��S�t��sO��۾���gٶsi��
_q"jG�d��4|�/uS�Eݷ�CK�/��B���["?E�D��]���u�0#�SO��l��v�{�USs+8n�����9����ւ�*�8��\V���Ke%07�ZCۃ�[�|���L<�;�TL�y���8���,zC����sT�ڴH踞���⛠qOt�^�{Ҡ.�_��]�|B�[����
�=]����]y}���Y,I��N����?�E��uP�a�v��I�������D�����@�q�n����Z�F8��h�;�Ap�QF�K�U�Q�3'�mGf�~��(�K]>���bQ��&�=b%���Fqҳ����b�GPLG�>�B���_������1��U��]¼9d�c���3��5�sW�	<Wn�-Bzg�KI�l���u�b��e�x�nz+�4�|t�I�V)�j��n�e��QKKh3 ��l�k0��-�k%]D�����|F��C�������b�������U;�W�js�+ɷ��)�/p�	l���P��K*#2�3������<�JJ��"�ۃ�KA[$���$އZ�'mV^Hh1dHݻ�,���Ҳ�>c3�^���j����]ww:��hDz��� �y��r��P�e���#"J0��>��g{%�e�]е��n��:H�>�j��Zu"�N;֧��;K�9��n��(�7�,��u�X�K�˚��Թ$07=k��RK^�Jihר��$�8��Q���6�;�KOVRN0�<-����	�_�"q���kOޡ�{g��FQk&V`T^s��$��{T#3XoҮ�f��j� }�N��O��M,�A�����s�`p��>tC���K���pA�;קw�k�)�ۣ�z-���������NQa�}���G�P!��Im�����0Y�Oܧ��HS�R{ns�f��3�hi(� \���
�\	����h����>�[��;TyҾ�c���1�9����N K;�C+�
;&'1��4Y�b9���;=�����t�>'�i�[�#���+XK��>�ƙ����K�9p4�iC�d�����*�g���:�y����\�"�|W*+���a�X�S7H�/�U��_AR��t����Eښ\
6�U�==|�Ӿ�aT)���kG��ʸpC��1g��V�^�{� ������!�6J�Wo�W�'}%�Ah��� D[ސjA��ƺc����N�A.(�n4� 3r�h0Z���x��}kx4/gŨ�)R���$�1H.�?�s�t�:gD�/Z��j����*'1D}Gkݣ���͂Ū����bNN��{z6�ǽ<ԕW��Z��'�
s��+�9�8�aQW�X�y�$)���t4½�[(��%te��v"��D�i62Jm��❅@�����	��`g3D�q �t[�[��m�Y�È��I^Gc��<��jc�V�8��M���BD�|��u�d1���I��A������'B��T� PU�)2�bu�{D�|U���.g��r5c qc�#�l����+�cȵ��m1�j�:��ԡz4z�%�~PM�Ț�5��|��;�(+��R�bW�#�yz�(-����
�Q'����j���7���\�J���9�$.�ߔQ���3q�O"�.�V���<�X���w,{&%<_���t?ѮFq5�GE���cB�ʿL@��#��2��H�B��=�*MfV�J�8s�"��3�����-*�lb�qT4�8)A�`s���OXv�gi}���SkX����f�Ye��{y\��C��Ȉ���̵��??�����|c��Р x�IV�-����������@��Y=�#C���o7�E@����!�������)�Z�"� 4z;�B�����}��ns"���/��wP�x�<�_Uz�/��a��Ry��[��7����Fh��-S�ҝpNtZ�{ ��Q� Ѻ~�)3�R�S���
9^x�F�0w��,�����lR�L��,�-m�YPXe�S�J��g�����zn9��Sc�;S�9��&ޑJ��
�&���G-�K�n ��թy�� �F@@��i�i�u%�pی��WR|�9����],��BW�O5�k���0b��D	^��%�.��,2�!�Ӣ͙\0��ƕ@�}6�c*�J�6=%�W'�%O
xQg�&�a�Ɵ~������R��˴��Dx��<)&�W�4Rhv�JL\z��DO
ݬ�{d�Mdce�1�`��m��K�e%O��M��c�)�K������`���W�_�rWr��k�f#�1.�Ø2�7��9�0�ς�L�Ql�Ʊ�oT�Y?ޔ|�&e��ńE|������!?q�hK�z��ʦ���3�P]kIToqsI-pW3��h��GI9���ue��"�9�|qiࠎ��~=�:Z�B��H\f�d:+5�1Z8qF�`���s�����)2�4*E�ߊ�� �RĆ#����e㺾j�p�z�C���R���C�ʬh�E�'J{�Cq�zjq��n1.}�=�$_��:`@�Sʭ�Mh�k${{� �aR\��&r�
Y3�>5��p��C5�=;�6+Q�Dd��L36W�t��
j���H'0{����71�/U�3b*�h��٠WH�N/<���ö�A�w��	��wє�x�E��9@�ƶ(w�4���A��g��m���P��\L��`b+���_b{���QDO��`B���G`w?�$?� r��"�AD,��I��~��,�7�@z��]e&.(���ɀ��f�}�^'@?R�������z��ʾ��{�tWjn9!��q�:&�]�l�璙'�V�8����	�{c���8Z{�%�<�:�����Vb���MZC���r�Vl: �t���jQ�-���V��፤:�R����[)�,���_�<����XC�e�b�W4={�xx�Py�k��?"�M֛Cc0�Q�x�̇<w���[�hч0�S�7��]�;wYڞ��?���Kr��s���Y��_D��^c"Uf�����p����8q)�#*^�7,D��!c`	�1�mC�?�M�.��R���~�W��և�p�C"o�)�q,r���ǔ�e)�\��Y�ۧ"�<	��\!,�v$˖	Ŵ�i��0�3$^���ːԺWA�-?��̴��*��i1k��G�	~+�wXy�X�&M�{�X6���P7UĐ�c%p�x/!�#��|b\��/I΢��r���\��
K��ԻGلq(��J�Uė��zv��4�=G�/���~ۧ��/�T��%�f)㐒6cXw�*'��A��Z��;t�^��cOok��o�om��b��L�JQj�5�L�Tʡe��k�d6bI;����4����f�����eвm8�k�
�S���>2��*ҥ��-�,�] F�%�c)�+���:��P��cD��o�����s�Û:&�q�+�!�+�2W��/r�ȻMV���]�0E��8���a5���c����tz̃�ZR��
<\h�c����č<�l$����!5�Fش�e74|�˜e���.��`o��u��M%�t��]�)���Tݛ%BJ�q|-����&�Z���(懈�Jbx&���
�c�=���פL��40e��/�/q̻V�yf9H%9Ő�^[�}&�ã�N-����ZV�^�N`��c�Ob<U��gu�lk0���mtM�n�r7�\C�f�S��/zn|4���у���W���v�::��FQRF��ae�KXy�0��Um~XΆ�*�3J;�91����z��C�6�D�|3�q�����C��u?&G���v �l	����UDT�@��N?#[M4���xWݘmC��Wf�CD=���xr�q�k�!t嘀�fn/Oǻ�A����$
`���IT���Ps5M��7�HDN�ֆ�����B�V4k��Mc�7ܦnm����Q�"�ih "��lr��m�1h���Vv��H4��EID@��$6�{Tkw(<�g}�'�=[�����60Z�5C�oZ�/[�J�O�t.O�0����t�0����jAm�O-j��_��g��*���T]p>��ԍ6�Ͽ��e˖�߽=���J� ���N뱕�%�ٝRH�'O��]�*���{ �=�@ v��~?�����  �A�?d�dO�䎄�7�Ty���	���h��K;������]��;Sa!۬ZOW"��2��x܆Rd��74=txͱ-�5�3�߻�n"�aC*ׁw�a�KA�m�ɕ�֘ Lv�?�w�oCx��ô�!W�"zJ�}�2�F>�K��z?K#h�d
U��S���F��i�{�����A�$sƪ��	J̟���.�']yBi�;�
�!2܆�E�2!�)��s}�Sy�a�Y2<�_o�]WX�\�z�����W��L	�LH�
��ˠ|k����|�%P���,`L��J�{o���e�?3�^��W��]𒸾%ZY5%,UH����]%�*���\ٓ7��s�	�C�|>x�!U�d�;�GJ�  �{��p��A�%T� ڬ��kJ�2a1c����nkW�~�IT��p���
=8"���no����6?9Բh�M���s�9:�R���V�4n-���ʾ�m��G��E�'mD��>�83�,i�0hk<��4��༜&�.Ǵ��k���Y
�+b~�z�=��Y1�o�Z&�d|��?�'\��ɬI�w� ݥ�iAwؾ����4�W��V�@q\���ņ�`�l��l��������T�j��n�eR����Q�"�� O3��8�Q�h9}2���ی�_B&�A�vn�����A.D �P5�7�[/�h�7H��T� ���>�y�&�~�x���i]��0��a+�T��q&9���~y^���yf�m����H��D������֙ �U�m�����( �
�(�[��x���C,�AC��� ��D�������W�M��A�w�����o���u勞�G�%!L�F�ePU�������<���ܭT���U��!�e2_;j*v�47���nǖ `X��1�Tw�ĉH��J�^8/`�h�@+   ��^i��z�v01�=u�G�8���������j��ϻ���3�F�~��z�;6��E�h�	Ç�3�(�ڦ�Jd���N1%���~����o�7�)�r�P���zt8�R��"*���:e��mV�E7u\-C�;�E��'��8� ��  Q�@nI���+�J`�P��:��w9b)3�fz��߹�/��xd�\^���|�=����3�)������m�C������x�fO�*���i/.UʷIL�$�w9(u�u�e�0���6Ɓ<od����C@{�T,I��{�.���#�L�3W1fON�V^��g<��x� �
�R��D��؎	�oV��`Ф_�wJW�h�Pep���ng��H��X+�uf��!L��?dT�c��rӬ|�ޕ��ig�K��!v�)-o���a�"�LAY#j~����Ҡ��ep�s�.o�8�TG&��$<��GɊ�E�K�h�;�o�2��t�@4�Pd�! ,�XY������E^w ����X�Z:��k�����=��@�z��N��h��Bi��{�.[�-Y����>�b��z�p��	��!��;Z��"�p�bXH(�ræ�����E��Z�@7	��|���|T���jH�J�H`�fY�f�0v#��#N���$LN}���@�� �  A�E5-�2��j:�I��}sל7�x����P�W]D�-}Z�[��y��ٺ1E��R1
X�9�L[x{"version":3,"file":"watchdog.d.ts","sourceRoot":"","sources":["../../src/watchdog.ts"],"names":[],"mappings":";AAIA,OAAO,EAAE,YAAY,EAAS,MAAM,eAAe,CAAA;AAyBnD,eAAO,MAAM,QAAQ,UAAW,YAAY,iBAc3C,CAAA"}                                                                                                                                                                                                                                                                                                                           �7_�{β(N�����]��۲�͎4��gE�?�B1#���$!�Bv�H8:8���⽪ҵ2Q��S�h����S��������jX+����,�}�1�����>�p6�Ӆ��(��scD7��qdjDf��}�g���9�x�鐻�P��Җ3Y\ǲY\ԛ���\xo�����[�R��Wu�����;	��65�Ү������ߨ!8�O"�\�"UA/�N��חAg����Y�U�ԐՅ�N|����;��Ӛ��8ޗ����(��kO�������(�am�����E5\�`��e		����qóĞka*��J4�58����O���=�[���d���4Q�_jo�����De�-���FQ��*�eY���?�r��,ڠ`Cr��f�Qw|K�G-a��̑ӟ��P�n�.�Y[*�4�1�+�Y>�����[)��悶F�`�H���C<9w�?�(Y�y��JM�%�;1����dkЄ�es`u�
�����jJ>���7)�R���������/�˯*����+z��'~q��5��[�s�*��0�z����wM�MC���ݛ7��'(4*����(���ղȗ�4r��n����g�w�Ί��aPk���%1��#���R�$�8�H�Q۫��X�ǜ�U�ͼ�i9���ۉ4��B�Ǖ)�����mM��.o&z`P}������=@����I`�N���8�BN�+�s�ߔ�^�-�I���]�f������_6zY�&53ЈFB���3�NT��	�k=w�;�rQb+1t�@aB���~�w��P�S�&%��y��M�aR�)b5"V�Ca���w�:�l�e��$ EBL��>����m>��s��ƺX���,N�~�O�w!��\P�@��*�4�j$W���zSзZ%���S��x�c;xI?��=a����0؇O%Q0d�/��Ⱥ@�t����O����_.���
�9�x�9?KO1§0@���Y�nPS���7weC�I�T����y=x{7�W�$�"��b%$�衔_�U��OD~7�`a�R��ib�)��-b��Iv�+�Z�ԙQ�Ӈ撢���!�-��E�7?�w�Od�"�ڠ�{�	`�I�mC��Lrf�����Y%Ń[!����]E%Q��_�`��F�)��^�d��]Tj���C����12�����W���LUrn{T�Ų�皳N��;�Okp8�A���S�  A�cd�D\߸�_��Q
���\/��r��\F<��N�N�T'n���;���+��*��t'b�ȳͦ!��,��������g�+�Cc�A�B�*�i4=�͘���s��������>ev�b������M��y�D�4��T��RZ�"��)\��%�l/V-*@a�5-?� ��F�V��'��R�.Ђ3��ؑB@�Q��X�6���֎��ˮm���MɎ}#�`S�>ı���f��U'5꭪����Kq;�~�N�d�AZ�v����Ŷ���1�$�*�RB��6�x#
K!��=���	�K0a��pV�����6��BAp��l�@q�9�R�g��'�Ґ�<�!k�nw�X�B����<��^��+
]ռ�Á;4��Z^7��j�i�B�*����6Y��сH��&�ߣ�7���b�Z��8�[k��Q�.MN˭	L�z�40�b�&�dAQ�f_�(�? I� :���/+�[�@  ���i������8$r��k7DN4��V=�\�5�J���Q�@4��^���Br��(�8y�G��0T���N�*���~��a�%��'��Y���+����$���=w�D�G�L��3��B�O�駾�7-�����}JWlC�'a����&��&u��/s�*4�D��ѿv�Wm�L�}R��� �"���8:�ɓ�ռ�_�����M?7`L�$kx!c�I�W5|0m ��2�E@��������%�'��������������q���p9��?�h�w��IA5���#E��{\�����/�#��M��uZ�}��+s��1`ܰ|J87��W~8)��gLЫ4���.�t4�\��?w8RNق�h� +x��e\�#>��}��� ��;_'��u�5_�YJz ����Am�>��տ�t�x(�b�6Z��"��(�@��,�!H4�rT��fB-��� ��Yx��a�}ʂ��ya��3�7��Li�}��pU�u_Iȃ����e^Gމ��K%GX�D�+�1bp&:J(�0�Ѥ�W|<D3D�v�#5$l�WDU5�r����:3�?��C+�ԥ��ȄY�Ҝ
�N�;��vx�7Xg���K���CA $`   ���nM�RP�=�J�5A{=M��:	�ٛe����~ĩ�P�y �����۬0�4*��Ğ���m�m��[/�zo;q�nڣ�J��$A��X8�l��1�r���T�a��
�G����O\��5�5z����5H����I����Ȣ�dܚ�5ԭ[�C�Mjb����2\�����kLgM�ϻ��4Z#��L�n�L�������؁>.q�Y�&+b@���  C�A��5-�2��x���(���-�Q��Z+�����06��S8��x�)�-d�O@	Ji킐�ܥK[�*���[Lf�Ɛ�2F��1�C��LG�aue]���en�?Z�д��,ڊ"b&-ڂ����y� |ɫ�;uXK�R�w��|��'�G��p��}�T��ڰ?d�O����\d�zgl�c�<��CV�zjx�m}��x$�� g"e\~�gm�	��d*���q�\=�L���� �C��A		�L{9(�3L�gA-9�sd>V�p)[f�$���?��^;��D�I��ۍ�<��Ƹ����6�B	��y��Ml�ē&�L�u�qr�ʚj1��Jx��m����;ңDxO���m�`�EK��1�zo����>��_ ��͹��k櫊7 :�C�� u�ci��j��Y ��������֪��4a拆�1Tƭ�#���[���#k��o�XHn�J�.u�{���՘�Ɩ7�
�1�!z��8�z���6�&�X�w�{;�c����?��OB�9Js��Z�V1�(|n%��Ad�z�1��N[�e*��k��Y���;�~3=}[ê:Ύ_�a�uɭZ,py ���mYo�Y���?VX�-���	��ڌ;:!fR $a��[\�۬]�P� ��neMfy'�3��;�y�j���&8��S�.	�}p��O�}l����D�Q�y�s�īe��;�'2�k��/�ndq����ǳz~�F��@����s�;�}�{fiG^�D��?�	�{}W�v�'���EE�T�ˏD�Mv"�1��q/٣����ǟ�&7^�X:(�_��S���}���;E���A�]S'H0I�O����b>��U�;k�b�+�<i&��	楙Az��	�tu�^�j�*�2�����9�)�yY|=g%0����;5��Pj��Mu*3F5]�/� X1�����,cS�d#{�Kv!������h�j�3��`�	C;�ࠖ���)�>O���'(�$��ZX��Y��ce��q[J�kA@$d�=p�PT����ʧ�Đ�rə��҂r�!ϕc���
RȄ�oc��U�6��VA��_><��Iex��|yFR���f��Vν9_���l.CFt-D%�W
K�
`��F`,sF1���7���9+�|������8��L{��|���'�YB�zpno_Ԁl
(��������) 𝧑	C\'e-����.��1��wB�+`j�{[Fs@=�)r�Diw�O�gq�a�X3\���������|��5�y���	zK2����h���H�Xs��)��߳�VU&+��}���(/��DS?�c��з� %���e��0��;'�Q��M��G�I��2�0�VnN��4�<��E��L�ר�������R�.b����)�z��(I1R:�Y]����B���X��8�P�`%�p.�ƥ��r���+Le����H��cL�孒�Ĉ��L��7�J�ج�ڣ7Շ����1dx]4��p[�a��h7)2ޮ@�gWU��!iY��s%k@O�he���CZ��ji�:S�j�m���M�%�y��eQ��A���2K��d$�t&?6��J�K1���L^C����HQ��;�|ޕ��1�B���}	���=ޮ��<)�d�[47�b�-��麝��=����R%����ȃ�~��dd��w3 ��О���`pR�،7vio=����sժzA�Hu��E�Tr|;,�e�x*���0U�ia2c�a]����Խ���q��t�䊨���RdS���� M0�lt���5�g(F�]O�Ia���P%��y=^~����a����oMA�)�?��Zfx�V�/w�|�k���9����e�+ȥ��5���1v���Y��*��&�TYD1�Y��F�F��v�Z\I/��;3>�>���A�ѷ���ȟJ���Y��;����G�T�&a�e..5::�؞8Nִ#PR͚��T&���O�z�hd�+E)jh�;�����9"�U����Y��X���gtL�ӵ����Ƭl"h!Mђm��/�OQ����{$Dp�?G���B0TC\���,��>�턋�K�8j��mhl��m\�&���#:ln_x�;����Zw,j�̎��|�$0�54-=�OZ6{8��H=��ߘ��v^�+Z��D�����L��vfֈ/���0�?�/�Դ����/MF<���ۊ7҃$:=�'��FX�O�fF�X��/빰*�̈́�;�{GZ�$�s.�'X{	��ץs�#=�Ŏ�e���n;[����z�#MB�n��]���E�P���Vj5W���);��,��՝�n}���HF�u���O���Ç3���i�BM��7���"�,�Gf/p}�W�C@��fQ���Ny?'#
�o#���գq#xT�\�D������ο4r�4L}���v��x�3Ǩ��9��>	\�-��]Y����z�bh�t����M�.���׍��yyI	��Mk��@_����R�!���H�ޤ^a�H	�A~���&-�\:$ś@�rV��ȵ1�o!����d(��̳���m*d
r#'3��k|ZɊ+��p�D�<��\��_�ڟ�a�'�{$���oc��z�^���&���۞��";q�����T�E�E`?�kCc�/`��&�_�U\�����Eu"��6��\4�)C����sC�:2ߛ����N�"�i^(gB�y�4�ٞ.���R ���U�>�o���l�E���4�]�x����8O�%��{���y��k�~mX#M���s�A.��r����r&�l��<(�)��g����ە���-\�@����L���'��JAx���4V�����5���z�ƒ���.���415F�3&ã���Ɵc���єFy�`-��|�XU#�h�r �!�,M���יH����Ǔ�0�ɓ��vٱ&���J�L���gj�()C̆`碨�;_b�[�{d�H��P�6�o��S�8q�c�v&�a_)�m`��َ�+�s�Ru�k�R�^9����F����B���"vg�A��F9`3�7�YZ�X�x�-7Ȗ�.Q^<��S?�#�׮�&G[�ug.^�j�n:в}
z�O�a.����bgb$is�d։�y��Y�T���h,j�.B΂�˷L;����kT-0�t��֦�|eq������ �D�~�Ü�e��=�cQ��czZ�������8���d캩��a�;�������G�"�Ǫ�/s�J�~J(�Q=s&b"}�>�	��O��*vS�oي@_�z�c��|Y�- �U�!s[Ўf���6�-aY�����5d�6ך誏W̙�)rS�5M�	8.#�t�l	q�(�$r�į��״��^�6�0R�c���Be�� I�)�|4ћJҪ$�&�/dw�X\TK�0]�P��
D��%�a]3�^n��i�����D{~s&Q�Ȏ9�W���,pM�V�37M�[m�tEp�4�Z��Z��p5��l�q�l�q)��V�/�EVC%,��� ����.U(9���U�[�@�y̌�,+�'\ k'��`�9}�Y	�է�a~����/��2�/[m#��3gB�;l��U�'(&*�̏�Oh�n2� ��|C��U�N����2�Fa$oAV�0@��E4����p��V� �X�`�Ck�P�����6��e�6H��g�� � Y\�9}���^�QO�
�oI�����E�:R3�\���Hg�"��v<Tk+�k�(��;)Ϳ�Yl���-�a����P���'�ݒ�΀�:v���B�c���4�6�q�c�u���__��y܄����rta^DWc�O�J�9P=Y'H�M�X
Xϓ9�~$���m��e��L���o.z'����[g����y[@�m�I��B�u>H�����X_̗_�^���{S�#���e��f �)%Mv�s������9�
Qk-���eB��2�3G���M;z�R($n����L�
�I
��=Vt������!n&<��zH_/#!�c�\��싊�6]p��y�M�ȑ�$#�A9�m�ǚ!:����O����L͌��=��H�-(�&�h8� 8PW4H	�
��vO�UA�?j}v�H��Y�?rwu�!���g3(�Jd�Q���|���W�����]�r��+3�r��@�}�����.�,UnY�I���l(f;h�4����&x--��	�>3..�7[J����,�
3�)e��G�d���wc���g����PeC|ezϖ��/>y �P7Bg~eh�{ܜ�� ���W��;����oJ���>k������ݤl�`R˛�Y�]�{�z�]i �4�8,r܄{3��*��)��1�M[���L+JMX�������s�{���6(�@5���G�2��N�B���l��J "���"����eMGJ�j$��H��w�}j��3�K�<�?z�����1O�m�J'�L��?g�f*�75�#񑍛�����;�D[�W�Z{�huo �(���E�?E@h_��9�w,_~���O��nR�x�4���W��
�j-;�+��N� ���]������j���|Ps几6x΍d�o�mn{��-�7&8F��ۺb8��[��c�%����]�1�9�<�Ɓ!����k>q��cDm��a�)�琎���F �i� ���W[���p�W�ƛʫ���=�H�7�ݺ����#K�K�".!�'�8�g���E�,@OW�����<���/䏔�z]�D����*YCK�3��w�s_��͜���ut�+1}�dC��Y8���Pq@�+j�[�k�m#7�w�>A��U_��q}���q��	f��� nӽ�,sZA< ��Q紼=�B5
���0o�ų!�_� Fj�(UV����})F�7q�x �L����$D�	���յ�q���i����rLg��R���Џo!� ���`t+�a�_��U3�N��W��� kDk�~�hl�u^,M\�)���N�u��bh�Yk�Q���:q�sA2tb9!^�Ⱋ�"iC�M����[("�Gm�1/^F���^�9]`%+B�>�e�[�X����ir�ݽW*tv�_��7��� ��W�M"��|4e;�`�`*�T�q�\��>Mt}{dp�Sp&�6�z�ҋ�
�L�43�8X�+&�;�E\��G\K}aw��'���oY���q�z�E��Ò��zgNֳ<3L����[ýwv;�"&:�`+G��;x)�&�I�ܭR���&(�&k��ׅ:��-��!�r]z�>�
l}�X2�|�����)?�xR& ��Z�_��:�<�T<����ۏ/�����,��.K6*��nϓN���D��{�L%�0~���Qk�&������ @*OU4��h���S���_B���P��]s��	4T��o&�bU�*���9�.K�菟ۏ��{͎ݵ�5�5F8������s��ʹ��Z��������ʗ�����@n�%�����Y��`ܧB8|p9�[)>^�oJ� �5�հ�g���m�1���h��*�Z�b�Ō�
9���HN
�˘��*���E�ӃN�A ���wq��F��&۬H��n�-6�n����B��� Gu�e��!-���~�f� �]��Nd�H� ���u|����l�o�I]U�Y��FL<:���.o�s��"��_��[�Ͳc}k*�����$��Sǖ��9/�sܒ�׾ɁsE�C��5��W,j&bE"�A�Y�Egd)?��)��]�FmT�*;'�y�o�q�l��]lԴ�s[�v������XX�\�Y��m���0q(�ȂL��"�΅���w� )�l�ϾL�!.��G�� Qo���Cq�8w�Χ,0ҹ�b�����>-Oo�!�p<'hWl�/�g�~�5�]G����3�$p0�{Ƥ��G��T�4{)�+�k�{x�~t�����Ϳw/�0꒞֘4I-�*5��?��A_�`��s8���n#���b)eW%5� �V%��Z�૽9�x>^�^0Ɗ�2��J�w���#��ә�%����������-���i��7q�����%���C���.ޣ�*����l	L��y�ď�N�i�;��c�e=?�1}��?��N�S��Ϟ�8e�H*z(G^���y����	"�;�X��%8�89�Sɩ%���hZn���M��웛�g��f^����%�9��F�"��5 �^qD@�y����`�6���p�����������)3�����C�����\:,^ew��]�{G��橋���;��a�m]��� �+vbd8_R�R����p����vk>���ӁX
�d��q���R55�GX���AW [o�X�4��e0�i�lOb-=���T�:�t�*�0o~ؼ�W��d;SU]�n��%��@�0��Y�b�煉�zV��rXs�뱶�7lPTy�#I����4���C'`~P���7s���"�p4�o��7$�(.T�.!���r]|Q o���Fts�8��C���&�#�GF�"^͉pT�1`�5�E}�]�PvEϑ��`T������ּz�;'3h���:!��#�����Q�Mf߁��}p�O��zv%A��BN(݀����{z�"���^}�ﲅzy-��XބGj? �9��r_�d]
�#ڣ )�|k���.�U��^�
�q�{%�� -��*��~.�--����p����ZP1��f!6�T����^nK�Zފ�x7/�E�kXWU����䘞��c�%�(�����c�]7mܪ�K�ȓ��������&@�αZn�Ko-�>T���K��5_P
��+5����6*�=ɨ��� ��"���)�L��j_��uiF�A����D��2W�,��Fa��� �X�}�l�ۤm����g�]��ߗ��_��*c*��w��I^9��"kZQ����_X�)�i����⮢P-9�P�.�%��X�2���M�^�Uԙ�����z���$/�*��)���<���NZGVG�59�`1���*��w}��Q�}'�J�-�˺=Fz1�??>M��z�(3�i ��@�/W�����0�2���ؾ���GHvF����/&��e���U�����2<���r0l��m��W"!��D�L�1��4	��L�ZÃWz� ��1u���͛��Z���X�)�A��I�~���od��3W�#�r9��⻲�r�Զ���ۮI��V�1b4Ft~?�?If�`��e�)���ʌ��S�V	���a)G��&��K<����p�Y7������mb�7�Y��7��UW[szl��G���M'��ɉ��O#�#��# '���Q���`��p�)���g}N�J�>�+YS�����V"��3�c%g���z����>��tnQ�l�w�*ׂqj&���'+���p��ы!'�eu�*p!Ǜ/��|G�~�$�XJU�JϢD�2���cR2F[&���p��/��'��L�A�H�s�����
��X���D�'"~�{����ƛ���V��jo,�
��
򾕞�~�/GI-9����O�+ؿ,�{�pF�<����(f�;X��A3}�?ϴ	��s4��#߂m�CJEf�Y���	_}_�}	�$�ay�!��"V\�Ύ��"3L���ls�bl(���rO��!�5ۙ%��-ߒ�7UQ�:��VB5]���ڌv��}qI�ǌ���Q^���;U���wW����5�_��.�����x	dB�����	�3m���:*�G׆>�6���lH�X����/������yu��爥s~����A��~CX�&��4hiĦ{�+�=�� ��<ʡP�[q��	^��pc��c]39�{��<@�Hr�|���jl����T�I������@�ڍ�i{�w։\e�t,Tj^ȣ�ғ��I���	�T��Y=;�Sp��r�� �d/AC���X�����C��ߘ1^/ӵ฾�7�S�����o�sk 4p9��X��dݜ�\����N��k?����(׉��p�t�+j%w��Q��0G�Y��)����x��:�ϫ�h]��/���%��LR���^+Ԯ~^�����n%�S���KC�<��Orl�W�>���d��9/
�p�i/��ExǔYݡ��W�0��`�q��C{�? �E���TF@�����H���-U�QD�i�˚Ar�\Vo��*���(�Mҷ*��ǠС1��#�y�ܜL�����(BNi�oA��_Y��
O���Q�D�l|Vf�E� ��S�5q;�Ȉ����V� &=��
]��nV��jn�I��1&�(�tR�˳��P�%ȯi5�z���'_��*��=������2��|5Çe����� ����:ȅg��h�¡ix��(K5��z�\�d�ML��@����m�������a���L��B�%�[���e)�I����<��#�7)�����x.�y�PٽVS*��$���l�}�S���]5U�EB������0��( �[�W&Rb�>��l�+IK�
��v)q��g(��ē���,1���++�$x��c���d'��d�x��	,�蘐-X�7�W5�dN� �lM�
7 6��f�/����z�j�t>`k� �EA[oZ��L>W�j+?�jeo��r=����ʎY���Ⱦj%�X�8Ŷ�k�cJ��ZK�	4|�^Y�-����
I�!]�x���%`�>ʜj�����ă۪�#�(��'Qe%,����ϪŤ����ҭ�g�816%�U.����t� �m"Q ��I62���q�D���"���3Y�W�<��ډs-Mo�
���A��9�><�ØUD�X�'��-�0).��-h�.��Z��/�.Y������S�����k���Y��PV��G2���>����3��L��"���՟�<i�U�&X��R�P�4D�PT?f$�%�A�sTG=Y�H�������F���<�P�eS�5l<V��ox�������ucslf&�:0|h�yB:w�x��ͽ/}����2*�~�U�>��Z�od�W@���z�(D�1y�Y1����K�c?�c{SǑ�|o\��'��/�P�[?f!SDo�Bz��,"c�#[�T_t�}~Z�o��"@�J�-�ώQ�IW%�������\�1��Y��旳j�o};hz6�9>z����9�(g+�CYؙ�T<t����z���
L3딐������y�*|;TS��
��s��>�s�t��r�	?=�}0$!���@�!`�k�|������
2#��&��|a/p��ѥ�9�����l��9��T�@=��V��itA��OE@ �͓�I�T�u[�@�l��xi,���ѱ9�I�A��iO>����5|h�d�P{6�����I��fF ��T����&_c|T�%_��Ex���ծ�!f�n"�)F�?�$��К�^e<P������)��+��qi�rTYX�`�.�3��`��A�?��#
��В�m߫���PF�����Ⱦ��f��X�q��*��2+�)�4y�_.��P�&�[�]�����]����W�f���S��!� .#Xz Z�����	]01p��e^rd͗�hqv� sp�	W�����#��2D�>q�h���?�6�2Co8G�YE-���cs���f����.o��w}�.`�Sl-��+�쐖���t�����d�Qe�����$���*�t��Go/�����:̉����޽��Z�({�&< ��W���o�:��t���.����^���pRf۟ը� �ٳS���F$)�5�ib���Nw�%z�D��X4:����B���? Ylhu��������f�w��S�'��C����	��i,4�@���^��|�� R�
*NN,	��|H<�$���|哽�¤jH��L�����*��HB����G0^gH)\�|�����y��\A���sSy�l��ǩ�s�ҫ2s8�{������A3���J�R}/��큖�F3Ժڝ���e�{��&\�!G����}���:�plS�� ȅ��h9�������j���|�jESd��w<�~dVT�����������lK�dC�(��s.�v�%�F�yQ��r�n9��b;2��DPYY���Kc.���@�����`������p�mȢ�L�.��+o��`�� @�ϙ=>z��hlڲ��/l.�av�ga}aK���(yO�S.�=��햝�^Ӓ�]	�Y6�v��*����[Ǜ$0�[��p��Ԑ�U%�r�~*%*qB�)�q�?}�תx�]��5�ly��w�)���N��ҚŌ�D��X\�lh���������݃�8B��2ъF����Kxҹ�(���?��Ӎ&S�O�y��pQ<#�Q�"#%��K��}�~H�{���F2��sr��Al*\jh�,����s�|�&�� �n��M~�1x����ʎjcP��&��?���P�t�A��C7�y1������u��A��٢O/�kn+�n�;naG(zP��i�u�w��O�D�Y�f/�ꒊN��©�
��(,fv�NuBJ��1� ���y������븯W����,�"k8�ù�l�s�J��
�3vp�G'��A��A�;�-�j�`ˊ�0=�m��82���X�N�b���D�d3�����鴠�ta>�������x"#���^��7aO㩸�K��
�i
,!���H�ԃx�hJP ��&�w}9^DVg�WCJ���h��� hk��1����yC�h0㿼v��B�� ��n�4���f�ɗju���¬@��8i�ڋ���VʢZ�H}��*�O�# �MKK�@����ǆlȸ��+�zگ
r�;06�8��ᡄr69Z�Z�֥����-�f�$݂s�v�$�Irư2���ڹ�)~L�����.��4��6�����U�䓻�.f��_^p#�P��VsY�R��T�z�i ����^6���W�O�N=��ZT)�7UF!e{�ˣ�M�b����zhb�-�(8�&�iZ��!��&[�?y�Q9��#��m��`��,�L�@42>�}T>��y~������W'���@��m��l��2�te���kÇb�!Aq���W��(�ז9h��W/D�qA<������<$���'��-i�����W������|��.0�o�}��`�եtT�b�Y�T�_%��]��δY�=�i�L'�xL�u��R�V.+�b"���a|�?^Xb+�&�h��ɶJ�fg�/�������/ZB閽Г��"��6^�55�3ʓ�)�����&�񵳤U�n�Gk�3�8ȸ0"��8��%_����1����B3�/�Z�T��\yz�ͭ�'K؅Ly�	LWw_�]�V���ABv�˓�6ؽ�����R>v�ȬU�:�X��ܧ���0��q�	��Ժ�����PBVQ�@ѹu&��K��l��*����|���TM�+��j�r1�p�L���=Y�����;&��/\P櫹��Q>�v�$�t-��
^�[�jB�z56��Euzdby��g�L��Ţ1�v����x�}J����X(���^�Hѳy+�l����$�����B���Zi�}�kz�&���~��t�Id��5N��^�8�Kr 7J*�8���MscI98`��e�����sY����̞��b�?K��8��h����P���c~͢N〈��$<�F.`3x��G�Oo�b5�rM'JC�[���R��8�����ߊ�:sEQ�ض5�K��Lgp:�Ift�7d�������	ZL��������`N~β`D��=��`,GG�<.Z�O�t���BR�HW��@��JF�������Q�����iC���o�R'!�3q�k�t*F�oUը	���Pe����`���:H�I}3F�y_��}A+��a��;�H���)�5Zh�Li�8.�����<�Ӣ�Mǹ�|_���b�@�U8e4Z��\^��̱6��9�	������4��I%�ߐj�C(�x�o��'��K���,5Y ?�}DZ�E��Q�_�0�fϓm�����d�9q�VI6����C�(���(&5���0<�Ԣ�����I���m�qg���@��6��t'� ��@�*\rIx�����3�\Y�~��1Sӓ���7���e+!�5��#/�օ�� � 9�V��F�0��IizU�� ��&��li.tto��O��R����?���E�`��o:�v������ޫ
�݄��3v��S�I&Wܺ.3��d`����E�w�TBO�z�|��Yg����{?��z�8%*T���u���/���6���1G���g�8sV���)���b�5�X�d V�a���<��'��l��ħ��+cDHCy�B�-�C����0Y��5borG#�PAU���N�H5�q/V'�j'�1�&?�AB�Cx ���5�t���fg�h;9RQ25�Lڴ��j�x������[��"KX7Ԝ=_�{�K|��I�yx]�ζ�*M(��*��T;���j2\����vl��Mlx6%g����Ȭc�<��$�*+Z���������&'��,�Ҿ���4���D3a���w��wϝ0���n�M��l%d�<�sⴕ��-H�4W<��oގ��yzO�Mi�K����+�s�U�a�K�'����%�� Ȩ��O� 1h�~���E�J��d��P���S���|[l1GMn�KZ*�6,x�з���7ݦ�G�^m��Ѓ/n�#51_�+�J3n�	�?�,����6�A2��]�����[Y�U���l,g��˪2�. 5}�/�Uh�1�%B��BG�ܱ��o�\�=��儃����t���k7�Tؘc��Xj�LO�(���`�@m��?�}��%�zD�K�����d#*l0*_�(R.ιฝ�?��*rϓOy���r��r��S�%Gϲѯ�ͻ7%��ry6x֖�����oB-c�DMRys0ʓ(%♩m�{Ez��g�lG��"��
�VkP��,�9�r�!R_�5��=<�8m��7��<��"0��3�䰜��Tˏ���S�$�����J�ęI�i�3�Ǜ�!u��i��@l���drG,�V��aS�extLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLinesIndex < remainingLines.length) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.splice(remainingLinesIndex).join(""));
	    }
	
	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });
	
	    return node;
	
	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };
	
	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};
	
	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};
	
	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};
	
	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };
	
	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }
	
	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };
	
	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};
	
	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });
	
	  return { code: generated.code, map: map };
	};
	
	exports.SourceNode = SourceNode;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNjI0YzcyOTliODg3ZjdiZGY2NCIsIndlYnBhY2s6Ly8vLi9zb3VyY2UtbWFwLmpzIiwid2VicGFjazovLy8uL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LXZscS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi9hcnJheS1zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcHBpbmctbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW1hcC1jb25zdW1lci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmluYXJ5LXNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNQQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hhQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBMkQ7QUFDM0QscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7O0FDM0lBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLG9CQUFtQjtBQUNuQixxQkFBb0I7O0FBRXBCLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLGlCQUFnQjtBQUNoQixrQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbEVBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTextLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLinesIndex < remainingLines.length) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.splice(remainingLinesIndex).join(""));
	    }
	
	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });
	
	    return node;
	
	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };
	
	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};
	
	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};
	
	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};
	
	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };
	
	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }
	
	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };
	
	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};
	
	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });
	
	  return { code: generated.code, map: map };
	};
	
	exports.SourceNode = SourceNode;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNjI0YzcyOTliODg3ZjdiZGY2NCIsIndlYnBhY2s6Ly8vLi9zb3VyY2UtbWFwLmpzIiwid2VicGFjazovLy8uL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LXZscS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmFzZTY0LmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi9hcnJheS1zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcHBpbmctbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW1hcC1jb25zdW1lci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYmluYXJ5LXNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNQQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxTQUFTO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hhQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBMkQ7QUFDM0QscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7O0FDM0lBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLG9CQUFtQjtBQUNuQixxQkFBb0I7O0FBRXBCLGlCQUFnQjtBQUNoQixpQkFBZ0I7O0FBRWhCLGlCQUFnQjtBQUNoQixrQkFBaUI7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDbEVBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQT"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
const rules_1 = require("../rules");
const applicability_1 = require("./applicability");
const errors_1 = require("../errors");
const codegen_1 = require("../codegen");
const util_1 = require("../util");
var DataType;
(function (DataType) {
    DataType[DataType["Correct"] = 0] = "Correct";
    DataType[DataType["Wrong"] = 1] = "Wrong";
})(DataType = exports.DataType || (exports.DataType = {}));
function getSchemaTypes(schema) {
    const types = getJSONTypes(schema.type);
    const hasNull = types.includes("null");
    if (hasNull) {
        if (schema.nullable === false)
            throw new Error("type: null contradicts nullable: false");
    }
    else {
        if (!types.length && schema.nullable !== undefined) {
            throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
            types.push("null");
    }
    return types;
}
exports.getSchemaTypes = getSchemaTypes;
function getJSONTypes(ts) {
    const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
    if (types.every(rules_1.isJSONType))
        return types;
    throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
}
exports.getJSONTypes = getJSONTypes;
function coerceAndCheckDataType(it, types) {
    const { gen, data, opts } = it;
    const coerceTo = coerceToTypes(types, opts.coerceTypes);
    const checkTypes = types.length > 0 &&
        !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
    if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
            if (coerceTo.length)
                coerceData(it, types, coerceTo);
            else
                reportTypeError(it);
        });
    }
    return checkTypes;
}
exports.coerceAndCheckDataType = coerceAndCheckDataType;
const COERCIBLE = new Set(["string", "number", "integer", "boolean", "null"]);
function coerceToTypes(types, coerceTypes) {
    return coerceTypes
        ? types.filter((t) => COERCIBLE.has(t) || (coerceTypes === "array" && t === "array"))
        : [];
}
function coerceData(it, types, coerceTo) {
    const { gen, data, opts } = it;
    const dataType = gen.let("dataType", (0, codegen_1._) `typeof ${data}`);
    const coerced = gen.let("coerced", (0, codegen_1._) `undefined`);
    if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._) `${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen
            .assign(data, (0, codegen_1._) `${data}[0]`)
            .assign(dataType, (0, codegen_1._) `typeof ${data}`)
            .if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
    }
    gen.if((0, codegen_1._) `${coerced} !== undefined`);
    for (const t of coerceTo) {
        if (COERCIBLE.has(t) || (t === "array" && opts.coerceTypes === "array")) {
            coerceSpecificType(t);
        }
    }
    gen.else();
    reportTypeError(it);
    gen.endIf();
    gen.if((0, codegen_1._) `${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
    });
    function coerceSpecificType(t) {
        switch (t) {
            case "string":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "number" || ${dataType} == "boolean"`)
                    .assign(coerced, (0, codegen_1._) `"" + ${data}`)
                    .elseIf((0, codegen_1._) `${data} === null`)
                    .assign(coerced, (0, codegen_1._) `""`);
                return;
            case "number":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "integer":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "boolean":
                gen
                    .elseIf((0, codegen_1._) `${data} === "false" || ${data} === 0 || ${data} === null`)
                    .assign(coerced, false)
                    .elseIf((0, codegen_1._) `${data} === "true" || ${data} === 1`)
                    .assign(coerced, true);
                return;
            case "null":
                gen.elseIf((0, codegen_1._) `${data} === "" || ${data} === 0 || ${data} === false`);
                gen.assign(coerced, null);
                return;
            case "array":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`)
                    .assign(coerced, (0, codegen_1._) `[${data}]`);
        }
    }
}
function assignParentData({ gen, parentData, parentDataProperty }, expr) {
    // TODO use gen.property
    gen.if((0, codegen_1._) `${parentData} !== undefined`, () => gen.assign((0, codegen_1._) `${parentData}[${parentDataProperty}]`, expr));
}
function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
    const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
    let cond;
    switch (dataType) {
        case "null":
            return (0, codegen_1._) `${data} ${EQ} null`;
        case "array":
            cond = (0, codegen_1._) `Array.isArray(${data})`;
            break;
        case "object":
            cond = (0, codegen_1._) `${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
            break;
        case "integer":
            cond = numCond((0, codegen_1._) `!(${data} % 1) && !isNaN(${data})`);
            break;
        case "number":
            cond = numCond();
            break;
        default:
            return (0, codegen_1._) `typeof ${data} ${EQ} ${dataType}`;
    }
    return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
    function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._) `typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._) `isFinite(${data})` : codegen_1.nil);
    }
}
exports.checkDataType = checkDataType;
function checkDataTypes(dataTypes, data, strictNums, correct) {
    if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
    }
    let cond;
    const types = (0, util_1.toHash)(dataTypes);
    if (types.array && types.object) {
        const notObj = (0, codegen_1._) `typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._) `!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
    }
    else {
        cond = codegen_1.nil;
    }
    if (types.number)
        delete types.integer;
    for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
    return cond;
}
exports.checkDataTypes = checkDataTypes;
const typeError = {
    message: ({ schema }) => `must be ${schema}`,
    params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._) `{type: ${schema}}` : (0, codegen_1._) `{type: ${schemaValue}}`,
};
function reportTypeError(it) {
    const cxt = getTypeErrorContext(it);
    (0, errors_1.reportError)(cxt, typeError);
}
exports.reportTypeError = reportTypeError;
function getTypeErrorContext(it) {
    const { gen, data, schema } = it;
    const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
    return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it,
    };
}
//# sourceMappingURL=dataType.js.map                                                                                                                                                                                                                                                                                                                                                                             �{�
�Ji�`�_xEs�cAjW��h�b���5P��?�,���_yC����"t����$���yx=�ē�c|Q��+u�ڔ$q/��rA����:��1���-[N�=`�;L���W��oT�^k�2-�P��O�ƕ%�)+�Q�V�����YJt�.IN���Y�鿬<r9?�z���3*�_�/(�ֱ�dv����0>7~�z,$�8�pԖ/K�7$�(7���L�ʤ7�Qi�������3���_vٰ-�Q��1��{�I'Yn�$�h����{R���NK�<�T�����_G���?J����o%�۱��)����ahE���}���4�)�܍eA�zg�۞�G	ϣ���_��@�Q��k��^]��>1$v����O��%����A��e�����X�]�����!.����SYD:Q���?ұ��.��Yr+�S��A���+S�Rp%S{V.u��3O��8�ۖ�� �=#���6�}1'���;mkc�˶�N�dP�,!qE�z�9�*j�" C2C�%C��Aùn� -�;Lc ��0���	��r���s�6#����R�Տ�P��O��<N%�K��"�����V�vߴ��N�X�he����筗����~n��أ Q_�����k�[p�V��x�+0~lh��,�C*�x���v�k��5�O���sI9 ��
����9Z�V�}�0K�粑)��2 .s`�(��1���;��Q�k�����_����uv��T�O,���CB�h�z��7u4�~�Ik�K#�a�[�yuzԮ�rMt��ӅsY7�KXT�*Jf��y��^"��ҫ -�h����b�e��잤��I<�h�G���{�Ѿ�2>��p`�aa{�Iry�A���5��v��.m3�HT���q�I�����5����jf��[2��e��*(�.�?���]z|���H�ͱf�qn�Y6b����z��x�N�(c�3m���8��3!?�K�<�ͻ)��>ԅ`���t!�܄�)Lid����AcC� ��x�A��7�� ���a���?ZJqM���ÓX��%�,c��)7�UT{u��bBf��a�/��rv� �o�I�O�S�*��t�z*�{�f��$W��"��ޜ�½������$ǅ������	
!�p���U�UG޴��d���c�V!I�-�z}2����2]7��&�_,���C��{�~�)b7lҎoۅF�dE�Si�����\H	Fڐ�J�f	�ȓb�dE����D	�p��ض���h�A�ҹrq��:����J�ˠx�X�/���cKmK�[�W+	%��<��J;��hk�T8�@5R\lPB�,a�2"�G�.	�26��@�¶z�7K.%Fnc���B���En�J/Pf=��+ݔ�KLh��ݺV���z����!�2L="�[3�����d)v��i������Q���֊v�Qݕ�H�Ssh>���9��Ż������7�IU�Q^�X=�Md�Uo�RӐ�ď��S"��2��^�[�c�v�!���ά����������"�c!���=E=����Jth��a����]6V�1rĵ��篗�o���A��|%{���蘯���њ��MT�+S�t�����&@$����Ջ����O�y\q���T~��`���^��H�ü����6�ڽ�����{��#}����0�qb��*�+F)Ff,��+��"�ޝ�C�)�T�1j��>�;Q>]���Б�4�X#B_�J)�G\�P ��5u�X9L)e� 4u����j�	���#�&3'�<<��ii (0�2����޲8�j��\!��P?e$�WS�^o�Ե�0-ȹ�z4^���ѩ�����s)�<2b�7h�j���-����!M{燵��#�Y���n�k̝��o��H]��z���\�4�����L�U�A铖`���#��|53�U!k�4�c�{�j���µ��`p�-W>�Ky�h�t���n�[��.b�F������"_C�9W���6�k��*��,�(Q3~O��3���i�@����������Ж#Af�����+�YbY���л&���@�ȼ�X�L_���|��=��bb��ɡW��iRJ�F�?s��/��Lrg)s�i�?�l+� K_V+Tר�h�7�l?5��  �A�$a�G���V�� �/��yS-��ݞ�T�
��q�{�	�.u%��s۹[N�erF��^U~��d�B��#��.����Xv��z���C����j��N��%�,�]�d�b��B�r�k�E�\��*QĊ���x�8��V�l��ف^�t X0�Z��f�����9�uû�.rHF/�p^��bA9d}u�/tj۩��T.�8���gzd��`��A̒��
�bj���:�uǌ���욚C��"&�Nn.��
��Jua��c�y��މ]�(�����L���~��=ޟr�$o�i 8��R���,�d�;߼-�D��ĿNc�a�I=2bo⏣���AeR�&�}n5<�VJט��4�wD��?iG+��r�,�;�dn�kŘN
��q��N+iL ����G| 73�Lm5s���]���Xx�g���t��G�E+��2n��sr�<-W_h�3l|�v6�^Xh�SA�~~���V�H�������M��2?��q��Q���* �͊��}����V��4�d��eb���������x-�S�nT@�\+�q�i��j� ��e@�g�4Ŝ����}	�6r*x�!��sۡ?�p
���!�j�o4kN�fz�gd�k�'����!���B
>�FqPos�YL��ܼ{�� ݲ�6=rE��W��en|���|��k�*�Q�S�&���|�tv��`/�/\S��bĹ>���|45z���D�[%�P}�?���n���Tӊ�I�TP+���QEl�c�'$K3�qg��?����Z���cֿUr�n��[���.jظ_k~���;��鯾d��j�pᘑ�E޿��"q��������E(7ı�[+a���H�=�@c��ϙdae��R�N�P�G�'(�e=���=��r�$Tƒ�����A����<�K�����=8�D�����;����gA��;�r�9E�à�k����h�Yp,�����%�����y��jT�����P�#'�ZC҇�;f/�A1sk���53-`��3$.�) kݰ?,�{��
̬c��I�9Th�N�B��Cn�6�+GMg�@gt��~��CJ���ё�7�<�x^�9$ʥH�R�u�i����0�?H��i��O��^"�t�M~���7@�U�����w}Hq�v;m��"\R�"�X01u�}�0`T�~:�+���I�dR�*�.�+��Ql��ZF�%46�z*��lvVͨP��]D��ۧ%�qj�=�@の�����["3��J�]�aI�ױ'R�l��>�@�m���?̶�>����ԚVw�
"_ks% �8Gɻ�۾���]����+�tG��EiP0���^�I1b�Mk�A�O�{�2�Eb�c��SA�?���z�Ba;���m�����CG�loL	��6oL9�
r6��]��T��^ ���d��H��n�����
Z!J�=���Sc���e߫�͚�Ss�U�>�>�LM�55S�����^b'��uj@[5��!��_����Vo��4�H�C+�z���p�}Yrǯ����;����L��R�|�e���R'�2�����x��RY[p��4OI�w�;5�RN]0ǳ�汓���{�,�$�Cg$�ץ[��S�ȧ2��z�P�zLV9D������ܘ���X��FFz������ƌ�S�Ecfz�PH�7�ʡ�l"��\�����-�$(=���8�Q�B�Hbd�	%q��А&E��$wēC�v�=g��_X:��K�Z�)h�ξ��z�=/@H��l��K���.:�u�q��"1�d|U�C@x���5�(V��Jܭ�ː_�ժDg��=�\�_k�];k���6Ȏ�$.��w��;eTt���D�)����2:~ ��<��!�W��g�6��Z�gw�;�G�'�� �����e��Q�L��dP�FK-դw�C2ZJ�(�\g��y�eL�khf#^�~�Y�y�;DEvf.�	��dh^w�/�|į
d�	� �vպ� ( |�˟��-d�������$��Nќ)�{-A���p��ڥ\��ˡ�����a�8\T�*c,=!���Rv�Mz��j�iPى�SBp�@n#�<ٖJ���@o�T%7��]ŁDi,OUz�JGa�	J����u_-ޙ��Wv��J� >ȃ��ǠMZ��֠D�`���h�h����*��ڇe�T�%k�\�2�!����i�^k����3H�h=��DmR�|�.�V�n0�ײ҂\��&���E��[�`ϴ��W�m��D�X�y�������C�:��Y�Z��&�v�?�$��������Z����P�+�Q@hD�PO�{b���Ԑ̏�]�,�\��#!�U�������nժ�&vk�}f����]/]�k�����`%�]?�DY8�5n���Լ��.O�g6�ץ��r&��0�F%QI_�az/"�i������!����p�����pE�tW��fd�*���ٯ�[l 5p�EL�x.#����
����N�Y$��4
u��Nv��ؖ{�������b�!S��]>��?�^�OGT�Ew@4?(i�];�Y������T���etS6�����h�#3�	*���w�4��z;�E�x�t�v�A#2.�oU��A�:/`�h�U������{^�~}72%�&1�=�d��G@�b��K�$c��-|�?D���I�^��\�fBћ˅�ekJ%ۭc��x>�C�8�&xv���ȫ�Y7�AWez�q�Ÿ�0�B���y����ڝG�/��̩�>&i�>n��0���nX�gvA]�(4ĸ&.C���PYG�\+��%�H�8u�y�,+�@��^Q^��)��T1��9��Bc9f6�yK���Mٲ���
�bI.�͗���Ab��%s��`(x in�w��x�H������̈́f=��RfMv?E-�0%�Eb��H+���o����_���}������d�C���i �ۍ��j߈�c��g��]M���B%���eAWP���[O������\��E�+0���E��J�]'�nE�Dw�'NR����+��¬-�*��~M]_Eٙ��#R� ����>�7yd��@�=���D��T��j��r���0\����R�o�fO�?��4��3h��ػkz��F_�/�����gk�ԊT��s�Ec"�ʧ���������dԊ�);��mH'qv�)}2'���I�{�(�H��FUV�r%F׸�8�J9����9<]�SD3}��:�<�<~"��G+��:������G��3��qE�^GYb���x��W�|�Ř�c����'��җ>�%/���J���o�{�1��]���獮�e\�������6W��h'�� @����?-�4��0�#��b\�?�#\��O}�����P@5��L�~u%�M�ѭw��.��d�c���0��켖�S[_���
I�}�P�0����lD��+ܑ�#�⮎79������}����R��[q0��̵~���C[�Rp���V�僓��'�����^7����n4n���R�J�9)�0sY�Oa�N�������q ��,�X� ���(<Et�hoA/��މ�k0��3m;�a��/g�z��)���BƓ �_����T��KŶ	!#����]�O��9.���"��cƬM0/�/��>R)��YЙN;��;�K��¹��R�*PSю�bgf5��+�͡�z�V��"�A@4�n�1,  f�eX�D��CE/�,�	�O1"J�����
f#;�Z�LDʚ�۲j���z��&���ԅ��e�i:gv�HT.��Lj������
����R����3��p݈������fp>�L��̇0D�D�d5��-4��u.i%Zy��/��آ�)K�9�KS�/f���o�C��  �A�Bx���*̚��k�ɞ]�F+v��ߢB� ���vF]�q�q ��;�f]��jg[���hֽ/��	�ί�����?�3G���IR���eA��. �ߛ�p٩�H�b��[�`��hD��[�c�x"�����L����~����$}����
��s����B8|�t��e�<H0
��z.�:�݋�B��J�3�g�`�(�1b���gCi�R���-tD��1���D}s�4��<|�;�>Ƕ�	0�ҩ�<*h�*j�7�Wry_�6L-��6�/1��x"���㪜x��R��&C��+s���������G��<��@�azF��#�?ҙ`�A�D ��Oٔ��~�Е���1J)."�]�yB���7��3]�r_3�6j�1Vx��M�"4�����!Z@1! #���go�s�E��������D`Ofϫ(=s��9K�|���q��(g����rT���E}�
��G���P���6�̢�{A���۫�/�m��F&я�Ʈ�Y��7��\##,���cB���e�{�/"6	�D�-�$�%�h(y�H划�g���-ަ���!|fSS�IX����0�1X:��$Oq���S{�ߴ#+~�V|�b�I�ZN������e  �atB.���f:6���+�V���q�d7*�L��� ���h�}�S���·5���Bu#�B�`�U���Í���`�W=���귬2�~Pji_k�`�)'z,��F#�!1��$9l��t�O��#��Z�n�6���Ƶ�`�s��� �_�a�ﵸE�ʳf�����k�>|a}~;] <�X^e8�n�1wG�q��^��P�G�;D�MW��޿���<48M�˂�G�w6"��=�0Nu'�|^7��B4�pU�C�� R�h����(da����'g1���f\�O�n��t,�x�#M��sBe^zM��I�{+�V��$^���;����5�j#��E�r-e<b�KE��"y\sC5OuL��k=g�bg0q¼�i	_�(�������,ܠSF��c�`���Yٗ�y� 7���L��_�g�F p  D�cjBp�A!ga��X�.}�Q���w�)��}�4&��G�z2��-y˹��ם�k-���h��EՉ�|�%�1�;ϫ��c{�������4�xU�u��>Ue���U��#�pV/Ĕk绷��3a��ŵ�d?�0SVt������3����)�p� �E;PX��)��|�S*0xn?}V���~�t����+�Ț 7��t�n�CZ
�-�5�$Nͦ���À�21�	�*����ݶ��RqC/��ؤ�O�k��.5b�d[p�� �U�s+�d��=�¯Ek�h� K�o�gy��M�V��D����Q�;�@  A�h5BD�� =� È�W$T�l��РS$|?�B����Θ�껄���n��Iܺ:� A:�t����p���"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
const rules_1 = require("../rules");
const applicability_1 = require("./applicability");
const errors_1 = require("../errors");
const codegen_1 = require("../codegen");
const util_1 = require("../util");
var DataType;
(function (DataType) {
    DataType[DataType["Correct"] = 0] = "Correct";
    DataType[DataType["Wrong"] = 1] = "Wrong";
})(DataType = exports.DataType || (exports.DataType = {}));
function getSchemaTypes(schema) {
    const types = getJSONTypes(schema.type);
    const hasNull = types.includes("null");
    if (hasNull) {
        if (schema.nullable === false)
            throw new Error("type: null contradicts nullable: false");
    }
    else {
        if (!types.length && schema.nullable !== undefined) {
            throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
            types.push("null");
    }
    return types;
}
exports.getSchemaTypes = getSchemaTypes;
function getJSONTypes(ts) {
    const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
    if (types.every(rules_1.isJSONType))
        return types;
    throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
}
exports.getJSONTypes = getJSONTypes;
function coerceAndCheckDataType(it, types) {
    const { gen, data, opts } = it;
    const coerceTo = coerceToTypes(types, opts.coerceTypes);
    const checkTypes = types.length > 0 &&
        !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
    if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
            if (coerceTo.length)
                coerceData(it, types, coerceTo);
            else
                reportTypeError(it);
        });
    }
    return checkTypes;
}
exports.coerceAndCheckDataType = coerceAndCheckDataType;
const COERCIBLE = new Set(["string", "number", "integer", "boolean", "null"]);
function coerceToTypes(types, coerceTypes) {
    return coerceTypes
        ? types.filter((t) => COERCIBLE.has(t) || (coerceTypes === "array" && t === "array"))
        : [];
}
function coerceData(it, types, coerceTo) {
    const { gen, data, opts } = it;
    const dataType = gen.let("dataType", (0, codegen_1._) `typeof ${data}`);
    const coerced = gen.let("coerced", (0, codegen_1._) `undefined`);
    if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._) `${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen
            .assign(data, (0, codegen_1._) `${data}[0]`)
            .assign(dataType, (0, codegen_1._) `typeof ${data}`)
            .if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
    }
    gen.if((0, codegen_1._) `${coerced} !== undefined`);
    for (const t of coerceTo) {
        if (COERCIBLE.has(t) || (t === "array" && opts.coerceTypes === "array")) {
            coerceSpecificType(t);
        }
    }
    gen.else();
    reportTypeError(it);
    gen.endIf();
    gen.if((0, codegen_1._) `${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
    });
    function coerceSpecificType(t) {
        switch (t) {
            case "string":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "number" || ${dataType} == "boolean"`)
                    .assign(coerced, (0, codegen_1._) `"" + ${data}`)
                    .elseIf((0, codegen_1._) `${data} === null`)
                    .assign(coerced, (0, codegen_1._) `""`);
                return;
            case "number":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "integer":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "boolean":
                gen
                    .elseIf((0, codegen_1._) `${data} === "false" || ${data} === 0 || ${data} === null`)
                    .assign(coerced, false)
                    .elseIf((0, codegen_1._) `${data} === "true" || ${data} === 1`)
                    .assign(coerced, true);
                return;
            case "null":
                gen.elseIf((0, codegen_1._) `${data} === "" || ${data} === 0 || ${data} === false`);
                gen.assign(coerced, null);
                return;
            case "array":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`)
                    .assign(coerced, (0, codegen_1._) `[${data}]`);
        }
    }
}
function assignParentData({ gen, parentData, parentDataProperty }, expr) {
    // TODO use gen.property
    gen.if((0, codegen_1._) `${parentData} !== undefined`, () => gen.assign((0, codegen_1._) `${parentData}[${parentDataProperty}]`, expr));
}
function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
    const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
    let cond;
    switch (dataType) {
        case "null":
            return (0, codegen_1._) `${data} ${EQ} null`;
        case "array":
            cond = (0, codegen_1._) `Array.isArray(${data})`;
            break;
        case "object":
            cond = (0, codegen_1._) `${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
            break;
        case "integer":
            cond = numCond((0, codegen_1._) `!(${data} % 1) && !isNaN(${data})`);
            break;
        case "number":
            cond = numCond();
            break;
        default:
            return (0, codegen_1._) `typeof ${data} ${EQ} ${dataType}`;
    }
    return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
    function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._) `typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._) `isFinite(${data})` : codegen_1.nil);
    }
}
exports.checkDataType = checkDataType;
function checkDataTypes(dataTypes, data, strictNums, correct) {
    if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
    }
    let cond;
    const types = (0, util_1.toHash)(dataTypes);
    if (types.array && types.object) {
        const notObj = (0, codegen_1._) `typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._) `!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
    }
    else {
        cond = codegen_1.nil;
    }
    if (types.number)
        delete types.integer;
    for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
    return cond;
}
exports.checkDataTypes = checkDataTypes;
const typeError = {
    message: ({ schema }) => `must be ${schema}`,
    params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._) `{type: ${schema}}` : (0, codegen_1._) `{type: ${schemaValue}}`,
};
function reportTypeError(it) {
    const cxt = getTypeErrorContext(it);
    (0, errors_1.reportError)(cxt, typeError);
}
exports.reportTypeError = reportTypeError;
function getTypeErrorContext(it) {
    const { gen, data, schema } = it;
    const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
    return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it,
    };
}
//# sourceMappingURL=dataType.js.map                                                                                                                                                                                                                                                                                                                                                                             �����9�6����+�Uh-�z.��x=D�e��؇���Jt�"���Zq|�b&#fd@j�X���g�y?xDD�F�Ѻ1Ots`�$z7(�N)ǑU�7�����H+"��/l��W���H�}g؅ #�i;����B�rf�g�Tj��e�F0{p���b��DW^K��T�ifHPO�7�#��6�h&��8 $���h��K'�������my21K�3��řz3e�	���j 4�%)n�%�5��-۰���4�_�\݀^����}Fe8���¾��7���L(|����+��<٪�Ozjt��lhF��_�6���ܕ�7;*N��%�fV�>.�E?�C׀�pe;�l��Z��ّ�2�Ŕ�^H<��ֿ>�?�&/+�-p��o���
59��s�cX���e�$���˪���K�K���:�UB�&�S��r�ԡ�K�#�D	��t�7�iL�Ԉ]�F!�����j�k���S��H3`p,��|��ds����;o4kEAX�NI1���/ArN$�36��E���G���D�N��I	�y�{]��Xu�:������A�+"��X�lPX��:��[|��G�M8������A��+���.�x緌*B�E��P�#��sN�a��u���p��Jj�������w�dd�
���9s�n�;��U��~n��&��Q��9[�a�u�U�Evn�T�����ٕ���-� v\�4�t�#�����f�	��S�<�?Reǰ�p~慩�H�ga��a?�P�2��fs��[���ީo�<V�8W����t�?W��_����A�k�6t�J|���1����_�'#����Ucgj*��H��7�c�`I����in_��(~�;Ī�X����-7��6�a�k4��#
�nH9+E�'=y�P��B.O��P�ϲ�a�c>�����a����G�F���<�-O�6���r�@c_4-x��
��9��e�Rpp+? �Q;
�yք ����*s1��#�̋d�z�d�ߜ��5��jf�:Ҙ�Oi0����]�H~9����|I��!�6���O�����q/^�����5�qN�T���oyĝ!~�;��6�
�jF����I�X3�7N~��@��w�t�m�aE?�F4�PGi'2kR��TZ�X GsLݼ_���<�����O*S�*���Ҋ�� �(����M�\M�3���`�j�'_:]U�H��) _L߅A����$��K� #Ȋ2#���]���iN�Y*�u�k�O�o�Hm�_]�m#�W]�\�O�w�� o�aO����7�:��Ј�  �   ���nB����qT5g"B��Ӈ[5�g`ʼ�'.���4�n�OO����7�=ã�X/0z�Ì�Dy�O��V��r�%�E:�/I�b����̝�$#��F=qa���?y�O\�����3sBg��.S��P]�_뜡�!ZG��q���#�
Z2��O�3����f�<�z��'ʠ*��-PVU�/fg5�Ŧ��Kc�83��l�{�$�G��d>�0��$�j�G+q��9��װ�wĭ�2_kPn�y�D��  �A��<!Kd�`(��g ���*���\��PA��%j���V�� ��Q7=�u�\JI9�LH�
����/�'��}����kU��U1����Q�;sX m܄�jK�d�.�1 ��I,R�y�!�3ä?c�6W&0S�k~}�M����Qη���)��r��⚀w�g!��QG�{��o�	:�'�����\�������8\�k�^�����Ο�v6�Q�f�S���r���>32Jz�ԃ���מ������Z �ZH�>|/j��T��L�l@�|�6�MF��� �Ɩ~��?�c0B%)�1?���ɦ��}����|�g,w��%~���?��p[h
tۖ���"�u��9� �~�
������g�6�x�h�����KS}#����u�a�g�"%Ѐ�9�}���&���y���vG��̷4��m< {�����j��}����y�a���d�+����k��?�s �F�#����AB�(�v��������`ܒYA�샅�>�:OG'c ���A�|OO0,�"���3H�����wZc���wj�m���liϢ)VY�8�������i"`�����iAʝ��tF�֦`��ĩ�=�@�;��k6��5Ѻ<	n�u��VWAA��x9��]��j�B)r�f���4���D�%]�RW�Y�y��`��d�k�D�G���>��9��힅��m�`�GpG��hn}�-�O��sjX�y�kb���6����%p7�m�3��i���nۤ������[.�]���>��'E�
.��r��2͐L�ݬ3��u#�U	m�(�����yͣ9{�}G�B	@�?����(�\.0N\ز7�����`io]�9̙-�C0�NVY��s�n�y����5r߼�bm�_N�ؒ��խ���X��}U�L��p�kB/�Had{;�g�[R/{�D���m8WT()��b�It
���x�!����TVwK�G���L���!,��j�vS��4D��ݥ}3㾘��Pj0�9�f����W�������xx ��&�$3�a��b`X_�p�P�����m��'��1�y��U�jPD��&Ffa�ܖE
��
�~�|�C�b��Ȍ�+��gW��o�x�R䟠)}��N�gC�h� �E嘥r6u+�� ;���_<ı�$,%ھ�v�z0e�c`�#��x����B�~k��p�P�2�9V��ܿ�f�Mͱ_0N�9w���^�U4����D��3�o���g����K!D$'�@�f9� �s[)U����춥�5�� ������{���k�������dț�X�"�*\�8���h�fZ��ob�ꊒjR4"��{4�G����d�����]��i�.��EV��Ֆq�n�h�*L�r@�1�v��%�y�0C8���>����>�T�{~Ǡ�64�FŤ:�o��qq�Z����Boo�^6 ��fE9��]B3Y"�
B?5�����*�yH�y�޸bK�2_ۤh%a}�´�d���:C�cnbH��(���p��rB�z&AH	�pq�I��H��Tʂ#0��!�SdYu���$:�\p�kA0�]$0�a4TU���v�#hr�������͇r�(�B'��r�o	R�](��~{l�x�y�S=K��B��F�Yzr8�� jCD݄V��
&����k�䲅@{���un�畀gD�h����j�}Nהb��ѽ,��GC5B�g"��{ϱ�P.����g���a   ���nBj����u{���"Orn*\p!y��/�m"��b�-C�kn?H�j�K�X�������dϘ@���U߼�)�t�;����I�G� S��h��$���9#�"�N��#G�,���i��E��_U��S�{[�$I��p��;���h�)	�MHU����N���2 ����b���W�L@29HxN� �=�_81����W2�A@4�L;���!���  ���&IMa��8{�����"g�n�~`��HHv�t��]�l�L�&��SYW(nv%D��񹋋�$n��1��˸`ʈ�z�W
ȌQQ�J���p�4�BIA�m`~H��
/���:=��q\ٓ �0���=���p�X~̬�&�juQ����y�-��x�^�44hF   �A��M�C�!�?� 
��إ��P�����1<��V8&�S�{�������O}\�J���߷w��W��ײ(@.�"1��uc�b��� 3��NC�4�ʡ�VH�z�����b�y5-�����y�p)�r�]�N/�T�T{��f;�W�↚=k+{���F�tY�b`��Ʈ��˝sd^�v	���l(��jU$�)�$\��CF�j��׿̟��"|ǡ�����G7�g�}�F�Oj%1�R�~2�k8�/uSA)�S��Νm{g��:1֯2����A�R���m��;�,�� ��1�R&LD^7�Ҋ\LR��D�S�F�hs�ڕ�x��K�aK���dTOO���F��-6�ɯ�|�.�.sQ��5�@j� 	{�4���\ܔ�A�nKjTgm$�2 �v4���APV�|*؁Dz������4�(ɛ{z�O�v�2�����d���ϵ8�����h$Q����Lyaj4�D�9�B���&����hG�C,q���jkHtg'����и��R�V8�ؠx����r�9R
�	�ք���Am��k�����,�w�۟8A�W���<����&H�F�_���8�#D�QαKy�z���J�R�f���[���R��k$8Q���ھT�A^�yV'\�Y"7�3��w����5�"���,*
�ɫ���R�B})7%l�b�N��?�;�%%削L�ǵ	�4lz	����ڗ{��*��6Ev^�~�"�'dO 6L^�LS|�W�v��'?q��:�V�Q��Q�����X��W�@��&���� �Ϟ�ށ��x8�MD�|��]������H�Q�ql�BU���C���M�,3����-6F��������vr:�-
���<bA{�����-��{�Vh\��i����;�4u-JP_���g��y4������cn�����*��K�5��-�=�κ���ʬ0�A�ݑmِ���V�B����5YO��<��r�������-iw���1�����ғwK(b�3���E��+��+���G[:Ys.��y(��� p��t�$��<Um��I���۰W���jC�L�g�����/#@�d/�a���Q��IY��n���
�
7��Tڳ��,�9T��t�y{_C�o��K�N��b�
�_v���<���&�n���XU���Uvـ��lOi�}dE�;#[W��2.�2�Dŭ��/F��"=�^;A��\ji�>�F������9���Z���6p|�jԫ���s^��&	K;"�a#K�q�~��S��w���X?*oȒ�g�����ŅK6G�m����_A�i:�B�:2�_A�p�D�mϵ  ��+d����z��R���F=ω�����K��}�#�_c+�D�t����nF�b~>�'�'_³>h|Ĝ#%����-1ͺ_��j�GV��`�@��ݒ��k'�(���oD�[�F!���ʓ��\�<`MaÉ`,`CS��Ta��gZ�k���W;@�D��ש���:2�R&�����t��>�<O]5�O�u�0DQ���9�V�
:���]Q���S!0�= ����vG���A'�a�Xl��ΐ��ci��d�hV;R5X{������o�y��}z����U�,::> �"���0_&��F�B��^�}#������r1V��{p�~�Ż3
�Vڮ��C0m�SJ�Pǅ�$�q�-�C<�ljW�9>�] �ɚ��D�Zk��^Ev������;ʂ�p����U��B7���`z���c5[��X�-T^LS�
K��m�m#?�!I��n��9b�,����wl0�2�ybn�^��� �9�$g��	��RR�+����=hIt��Q���it��!��H��S�՗��y�5<k-��:o��ל{f�(�4�[p��V�L ���qCp�� ��� 	r?Q�}�\��tk����-FӮ��o���א��"� ���6�9e���R��P�F�����L��y|��H�7Ƅ��]�i��Oϵ�b���hf�Ϯ|@����*yC����I�D�D�ʈK�/j��Ӑb�I������^�e?� <ŜBm��˘I,�2=6�N�Nv���w��S�k�;�=r�?V��X(ƫ/!��S��6W=��g��mx��/D�D!�M��[_�$B������$�D�i��I�,��*�D������S��8�E"�bk�E�甴��<u�:��@��B��c_"�6���_���~�:�N��Ml]&����?���0u�<=�;�ֽ�P�%v�����3)��r��P�fk܄H.&�Cj�{��3T���`3���e_}Pj�X
�_��1_X�=���8I�D%؜ P7����7�n��D�S�@��e��r0��{^N�Gx�����s���F�ft�C������8����u�2��5Ab�����a^6� @�-��l���ؓ�,Z_�څ���Q���8��3[�*,r!�ߖ�2�n����� <P�n "r���Sz\�+q(.�:8��lJsU	qf�9ߵeF��:=������Y���M��oTc��D�*��;�;�<_��K!��]�"SV�4�b��gɺiY��7\�_`ll5�E�%w4�v�1|�K�O�,o��Ф-\~;���zԭ��eDͻ��	ގ犴��\��2��r^D�$�-�*��f[����GT��+��ȫ���kiz�\QB
�o VʊC�h��}��q�'~g{2�i�TC�\�&-������sCq��.�An�^I:�/t�fv�sc�A��U�,/?�(Ι6�N��
O\��8��&l�'�6~�ҵ�>�IE��ڋ����+3�WZ���.�+n�GTwU:���s�5lۗ~W��"�&w/@kt1$���?=��-H����$�e,�۽�"j�����N>��g<XL�%X��l�9&=� �\��'^^�Ȅ��14Y�[�+��NBjQd�2�Š��F�8����e�Ua+U��W8k�4��'0?M1h�@BB!⴪�G{��O'G뷦@�[� �ϫnKӜ�1�^kV�!�®��t��:�^�FȺ�kz��=@ĝOQ&er)�rN�^%�в��V� �w��m[wl��?�l��-i �k�HȒG��o��4�$H96���%;��χ���'fuE�O�9���]��Q�~?���$���D�j�4�g�^������G�#T���*[�"���BW�*g���z���N[�xQ1�7x�̲?6s��6���򢨙az!��5S6�1�\"&�AA����Δx:"�X��͖�ؿuҶD�x��6xej��~ϰq�/��|f�n��%`�r�ʠsi���.a&�x�&�pZ��o���{�{c�����j�d_ŭ� ϣ\��_F����Zdz��Y�����&f����ŦX��]��c�i_2��u%���s%ó�P�|��ws��*B������Y7ȮN�Y랭��?pC�������wɘ�+C�X��
��.�g&tRu��at�GAg_���:�/��=�i�d��U�q��CG�I�3��D�qv�F��!|��t>Gv��b3�a�w�e�?���:U��%�9䞘P��9JVd�[6������{5v%wDIZ���*�q�K*�L�~�ǟHw�dbI}�E���	�X�M
�1be� d�(�O}����M�_ZI62���o1�X����nth�)�<o�P5�K0O��7��w��v䘄	�CS�~���'��f�W�fm�o ��;1K���gK���
~gx�jɅ�lQ�r���p�N{p��Z����j��Y�~�u�d<�|uj��ܨ\�FT�������TA���a��C�>H�~%և�W�$�2��s/hi
�!#��[4*�����'����>/jDps": [
      "CSS Box Model"
    ],
    "initial": "auto",
    "appliesto": "allElementsButNonReplacedAndTableRows",
    "computed": "percentageAutoOrAbsoluteLength",
    "order": "lengthOrPercentageBeforeKeywordIfBothPresent",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/width"
  },
  "will-change": {
    "syntax": "auto | <animateable-feature>#",
    "media": "all",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Will Change"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/will-change"
  },
  "word-break": {
    "syntax": "normal | break-all | keep-all | break-word",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/word-break"
  },
  "word-spacing": {
    "syntax": "normal | <length-percentage>",
    "media": "visual",
    "inherited": true,
    "animationType": "length",
    "percentages": "referToWidthOfAffectedGlyph",
    "groups": [
      "CSS Text"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "optimumMinAndMaxValueOfAbsoluteLengthPercentageOrNormal",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/word-spacing"
  },
  "word-wrap": {
    "syntax": "normal | break-word",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Text"
    ],
    "initial": "normal",
    "appliesto": "nonReplacedInlineElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/overflow-wrap"
  },
  "writing-mode": {
    "syntax": "horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Writing Modes"
    ],
    "initial": "horizontal-tb",
    "appliesto": "allElementsExceptTableRowColumnGroupsTableRowsColumns",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/writing-mode"
  },
  "z-index": {
    "syntax": "auto | <integer>",
    "media": "visual",
    "inherited": false,
    "animationType": "integer",
    "percentages": "no",
    "groups": [
      "CSS Positioning"
    ],
    "initial": "auto",
    "appliesto": "positionedElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "stacking": true,
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/z-index"
  },
  "zoom": {
    "syntax": "normal | reset | <number> | <percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "integer",
    "percentages": "no",
    "groups": [
      "Microsoft Extensions"
    ],
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "nonstandard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/zoom"
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ���瑕V׻����f�vvp@��y}J�@\V
DF�}��%�����*�9��
)�[���3��ӯuu����:��śu�:��*
�z䟃o��l��֝��l��wc��N���Cr��ӏyC�����9��ȣ,��Y���e��2�Jq"����a���_D��g�G*h�#�!T��n6�ϛ]f�� X��qսw���ɕs;�J���E�T;8�F�ҥ��L�G��L0.>��ag�r�d�̡��n��z����#g����V�0�:�E"e�>����,�������p��=X�-���;2�Tg�����Æ��PZ֌������		n��-�:�:����|�� �s؍I8) �y�hJ�hRg�0�m���,��伥x���V��ݍ�m{ڍ��7ҋ��O�UvN�����ȴ1�}�z����g�S(���������nR�	B�E��Y�ss�-H_��ۅ6C~Of�m9���
�^4��Hb�^�K��n��Vve"x4C��bz��m�˗i�����7���9y�hq�!�|cQ[��&,�1s�8G4��]v:��L��|/\*��$K������r"O���4I���ظ��-[�G���^kxD����l�]�������ռMB�fۿ�I_Q�ڣ�)�
$��#`�����-�W\|͏f����SH�!F�-T*}@�W���Voڮ�!�3��<�4gmF�|���}���[ia0��I߈���ë��xb�w�zM~����L]K{��e�{YT�.ݰ-fɑ�����N�9��U ���G��G�2Q\�n�nn>nľ|�jDMԬ�ͷF��1�&��l�׫�nw�A�P�%�4H�-�t���ټ�6���Ȳ�Z`���>4�TGK	EA��@1���!