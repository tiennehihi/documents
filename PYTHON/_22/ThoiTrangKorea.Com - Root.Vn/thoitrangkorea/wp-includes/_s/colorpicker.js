import type * as crud from '../crud/types';
import type * as fsa from '../fsa/types';
export declare class FsaCrud implements crud.CrudApi {
    protected readonly root: fsa.IFileSystemDirectoryHandle | Promise<fsa.IFileSystemDirectoryHandle>;
    constructor(root: fsa.IFileSystemDirectoryHandle | Promise<fsa.IFileSystemDirectoryHandle>);
    protected getDir(collection: crud.CrudCollection, create: boolean): Promise<[dir: fsa.IFileSystemDirectoryHandle, parent: fsa.IFileSystemDirectoryHandle | undefined]>;
    protected getFile(collection: crud.CrudCollection, id: string): Promise<[dir: fsa.IFileSystemDirectoryHandle, file: fsa.IFileSystemFileHandle]>;
    readonly put: (collection: crud.CrudCollection, id: string, data: Uint8Array, options?: crud.CrudPutOptions) => Promise<void>;
    readonly get: (collection: crud.CrudCollection, id: string) => Promise<Uint8Array>;
    readonly del: (collection: crud.CrudCollection, id: string, silent?: boolean) => Promise<void>;
    readonly info: (collection: crud.CrudCollection, id?: string) => Promise<crud.CrudResourceInfo>;
    readonly drop: (collection: crud.CrudCollection, silent?: boolean) => Promise<void>;
    readonly list: (collection: crud.CrudCollection) => Promise<crud.CrudCollectionEntry[]>;
    readonly from: (collection: crud.CrudCollection) => Promise<crud.CrudApi>;
}
                                                                                                                                                                                               �vZx�ǣ<;'� W.�ѯ?��t��mA�%�w����9��V7�Z�~�+y�B�]��O?D�}g�؈�7n]����oM78�6B��E�g�b�SU\�h�k�$���i��eZ*�vbO�_��|4���j��	��]�b�Cs�E��P�|^a�fRl	c�!ʧ1�P�)y=POU#��}yO��f[���d8�KL���#�Ws탃�V0�1��yt�I앶�䐩�Η���ǤE��GD��7+k@�Yo\�yD���7��<7�#}�2�Z"�E;���ٜ����w#�λI�w!T��]P�ᵧ�v��ձ�Z�$�'�=�(�F��I�x�{*�r��_���W��V
w�M��d�m��L�l%��C�js���/;@G��Q$,�u��q��D�TÝ�z����Z�^E�,��φq߭T����������C�\�cg�s��l���N	]�j��kz?��*�B�c8t�M��.�ۨ�!Uve��{ف�^�M����f��[�����e�T7y���R��qu����t,�aZ�T��=���-�޳0VC�y߱w�,�̷uZޑ�g���*�Q��ЃQ����3��}��f��j���A��ϲx���9�"���v�Q����tw�	�$��+�T�M:���/ʮQ����P"j=����f����s�`���t^Em]��,�׋�z˵z������6���p��F��N����w��.Q�� ^?�PK    壱V�|�NN  �  S   FrontEnt_with_F8/JavaScript/json_server/node_modules/standard-engine/index.d.ts.map�P]O�@�/��4"�i�z������)�T�����ݻ+��h�=������'ۧ�:+6���9{Kِe�*�论��qV���$�/�UN�f��V�R�'Ί8�$}󸪲bM����<�!���4��+@ق��P=�g��)H�M���l�7]�g���c�w�{�]%y�:�����>���J��,3(-D�J��|C6&BNѨp#U��֤���E�6dA���X�����Gon�J٘����t7�m�Z���c &}�7�|����SL���KOݹ=�X8�B��1���97����ng��_��<{�𝁝5���%�t���PK    飱V���3E  �4  N   FrontEnt_with_F8/JavaScript/json_server/node_modules/standard-engine/README.md�Zmo�8���_�8X���fg�[�@.�K���`�`a[bwӖHI���_U��K��������abIdU�X���b?g�qUrS΅ZI%�ų�sa�e�O//
9�5_�K��5�%~WM}������c�oT�yi/�?����8��o�-�lX��[����Yqj�g&Io�1[;���,[I�ni��,��v���hs�����2[�r%R�Y�\�����['L��u�y�V�寭0�Q�����O���d�^��W�]KQ�6�:�!�fW<��t���+�j��^\��݉���OP\��5�B�Z����Y�K��a�M\�Z��BykF����,nU�<��o��Hq�$o�V���R���T����I�8�n�N�[+̮A�0+����L��պ�i)�?U����$�s�N�L�W�م#h�ǵfҲ�J�b�Ψ�e��(���[�����;)eo��(��[��-�V�%n�%ɜu����w���w��g>��G�c�E	��w��͋�H�{�moq�n`�A�� _�m�Tו(�V��&|���8��x�Ek�����ڢ�5op��{u��G�VY7nGɏ�}�2,
���=BE�n�x�{�J�l<��"~m%����C�q��̄*18���B��w����?��Jڹ�� o���@���1aW��5��h��Y{�i@@^g�q#-�VK�j_�psv��hD���F���Yb���_�^��Fp' ٚ�ր�ahop����%����b���z�דg�����ID�ץD@Y�~��DR����(��uC%#��9��s�KU�[|A�re�,c��+���,XK*�a`��n�'��a/��139��ã0���4��A��m�T�fG�E���ꢒC��?�Zk��T�P� ғ�)O�>%w��;�^O���&���B��z����׫���A�Vhf6���86�Y��}���ޛ��M��]'N��^�Z4�h� �-�� Z�+K�	 �4 bCs���ix�%���?�'���[�+�2�o��fhH�-��6�&��>�����w�w0���cv���Z8�.͵k�V%�+֔	�Zl�L�Y��+�/��ֱŶϗ�V��/�m*�%�ҭkZ��󵨚n�	M�ɧ�iX��Z�߾��<��O��T�O�Ji���!BLw��/�l��R��A]߂[��;^�����8h��l�*⃬���9���(Sv&D�ĀR8.+�d�� �C.A�H�מ�����9){�VZ���hA���89�	��l͍@�e�\���^<��R���l��1�l�8�xm�(:ŭ�J$!p`��xV���)�cb�o���n�X���yA��*P ��c^�=8f���˸O�������*y1��p	F[�g���c:�)�n*�WK*'7\Qm�eu���=�A�w,���	��s�<�<��KN�P!_�d�D�T- ��yiD�WJ���;\��q��4av��+<F�l(�l#
����f!��f{W: l�'1�pq���f����ga�+� -Q+ħA0Šӊ��`G��0|b�hC����󜇳�!�e���x:@�*�������»d~e�;�./8��{]��@Ѥ�5�m_P������50�FC���Α_b8�B�/��q�}�{G�X:X$ �\���nmt��_��A�B
۹�h�$�����)�ƿ�6�[2�
���fǮNUG�--[$A�e�6IF��{�_�рo�:̯�{������[������	���!+�g�#7��?��oMϘ�yZ����Yb�+Œ����$T��F���R岑�v��JQ
8��n��Yr7}���]%?j+:=���kk��0�����~]�׷��xx��H���Y>�WLz!y���I~q��0z��}u�r��T�iJ�C7Nɷ�Z�:M�΀e�[=��JAfXt��u�+�Ə8�ݵ��;ӊH�OQN$����;�#���i���˙��T!
�%�.�OkYB��dK]����d!V�g%G��G>p���R�!-3jo�Bt��y�`�%�u��b��Vr`�d-,%��ą��ẇð�y����h)E�M�֬�:3�� ~F3��F�E��D�� <�-�A���
^�>u�\ԞvG�b�y��` � m���?B�/2+*����` ����ݱt�_1%��5����a����W�����?��儽 �c8���. ��(|�� ,�u�\��:�Oi�����,q�Gn0!�Ϥ*��ւ���\�}d�P�����QglL���3vP�x@mj����@�@M�q��jK�z���ӂ��t��$�G).�P>�`���Z�A�;e���31��
��W]�u��N���ө�끢��|!�֋9lR���'U�}����t��Nk�|�x����˦c�{�28���z��"�J�H��۾D�B=���Jo�����^݁�1�$�=ufjRxp>!.dR�T	ʊ����Z�M�n1>�x~;HY^3�~PP��,R`�ɷ�[����0���77<����?���!�;�ȶD�r�2�^IzW�����
��:t�`$�( �O�Ӟ�ӧ�a��Y�ޝVr��p{��mn�K l=�h�d�����>��8b!�8g�1ˇw!��y�1ǵ����O���|w��A��4Z!���M������>X8�
s0�t�Ś�70Ǒ�n@���Ì������*bq �z�{=��r�=I���Q��Y��}��N�Ww�J߈�k����v�q�o-]�g�jIw"&�	W��@ᵿ�yw<�P'�
��(W��?�i'g��ڗ���;��2����<~�f]PK�����=���Q���/���r�7�ơ��&	��F�l'M5��������I��r6Ar��E<���3�J�t_,�� ���G��ez	�y1ca�=��R���@w@���V?�]��������G��	��>�&C�3����彧<d���(ؓe]������,2µ��P~l7N�>�]�V�Ć���,�Nl�X))�(�PM��u (�;c���b����E��}K��;<�^�9o��9R<�?b�;���G�Ns\6&����m�Q�:�ƈ�����|�5�C�3���#�ǉ���^!�
���%���}�2-n�ϣJ��7T��p�e������2n\>ܹ�@�6z�h��"�h]x�{��>���f�*�v�
&���9xm��3v��^A��vF��0���AG�tq����J<�e�8){����h,T�dp��{��*�k�?�aѢ���0 ���Hn�(����F��G�M��i�VC��*�>�nʱ��/&�8�2��\Y!,���般�=&$fci�vù@aj��kr&_\��Y���k\��!�,W]Ǣr_RG2�R�r�9���R��X<2�;;\�V����}t�!��x?�ʆ! ��*q\#�����,V<�BQ]@���4��Z<Hݗ^�24���`J ��nX�4%q}��ew�[U�J�����. �be�DH��!1�cc-�l�l$�����B �t�a���{cx�fy��I�o�!��ߕ�@��"��;x�ї{�¤�5�Y~���A�v>���b"���7�(>��إeAF L�)�m?�c4z��EYxWC����XO��Ӑ�a��l��W�5��wPJ���(�~����pdx����=QA�>�o{l�����x�mi�Ё�	K0>��H���Kl��Gw���_�P_��@Aj=a��A�=�#�Jʤ]�G��
���� ?Zʿ�����,�/����W}RvK��*H)+�č��X�o��lb��Q�g�.�������O���W�@���/����e.�^K�ө����kK+��}F������"�h�=9�!������/��]�.!$����X�ș�~B��v�^t��(����}��n�C��b��n��]��v���F'>�|�IdBw�1�CܷAۓ!��P�5�����z���o �q�R��M�~Ҳ���`=$�G�xw3�.P�����ⲄW��d�;(�Zeè+C��ndl#2x�>M�PK    룱VVQ�J    O   FrontEnt_with_F8/JavaScript/json_server/node_modules/standard-engine/index.d.ts�UQo�0~ϯ8e�Y
�M�u���S�v{�����Z�l�i���{6Nt�֍B�����}w���wD@��Ԧ�|,�f��s��q���q��j�ʔ��P��N�j�?�^��C`=�����������=F�l
*yzG�*ģ���D��ncG0�����u2��]+�'D$�|�r��n��00�˗cc�R5H�̚�NN�a�v�'t���!ę)����Ҍ�����<�L��VR��0�r%�y�(������^8�GMa�����������U�-�љ��$km��(/�P�V�.��7�IK����k漫q�.���9�/㤻��"�YW����}���8%R:��	1��eЈ l[�-�JZװ4+���~���գZ�j��Cz����0|� ?�s��;����O�S�#���*��>zc�ozX@�{�q������wrG�c�
�]٤4��n�����K�#�N�z�!w�-s.�`7��� �T}�,x[���>����%3�9����
�n�/�J�ZEX�ԭ-lN�_]M�T�D.a{)x�$=�Zf�vE%x3��55kǟ���i�������%8� t�P�F൓үH���-}CK�դ����?������i�+%cD�I�9�J���4l���ҎÐQF�K�)�:v�+x�D�$�Ȓ�[�k�����\�֘	T/�x�-\�1�2��￹��j><�J5�Ff�jɴpa�`V��S���䫶��|�|������^��W���(����	È� 	�2R< PK
     ʣ�V            9   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/PK
     Σ�V            A   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/scripts/PK    ϣ�VIs�T�   !  E   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/scripts/info]�1k�0�w���&A�t)�:�C��"��Gr�,C ?��M���}���c������)�bCE�Id`o��h�@L�3����|�N��-�(��xܞ��T�(�����]�\��X|Y�ʹoUO��U�Ӫ�=6�#��,�W�!+?�߽��N�i�}G�G�K�P���LKj��0�����AbG��m9��k�)�PK    գ�V�Z���     N   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/scripts/prepare-tests5�AN�0E�s�O@
 9�� �z 6q2N]���8%U��q�v3���ޛ��dg�B�O��r�a���&�q2�*���6�N��8�~Df��A�C��{�|N��~oִ�k�?|��ɨ0��\��/Y�K�$�o�˵jqS���!	�\���q�f��ܚ�ȉ/���3��ޗ�L��9ū<�r�Ԯ��G5[��5�PK    أ�V����  J  V   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/scripts/publish-built-versionm�]o�0���+^�IH��Q��h�u7Ӕ9��x$v�G��cw4M�W��9��s|޳g�M
!	�=��Qd���G�����&�u�yq�o�+�N����<_e�y��7��W��_���� xY+@I����sE#L}�������0c�"����Rɭ���1o�h M��<�M�y�L��D��-��ez@6Jr����!���}6�77�կ���v.UKB?=m�Vi2tq��b���]
��>�(;������O�P����y4J�O0���!(��. y:�vrD�av�;@�����n�\�R��q�t�*��x��M������-/-g�ο����X���T��n�Aؔ1��!�/��O�rA�g+��մ
'g{�̳���_�����Nx�*-*!��π0��^Φ/�f+���������͇c[FG7���=P/��P���PK    ܣ�V�ZB�  j  P   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/scripts/travis-gh-pages}�Ys�0���+.��eY�ɐEӺd�,���#G�-�$W����v�i2lO�|��\�����D(��jsϳ��=O��\�̧���,�M�����6��ڊ�Ύ���pOɧ���TJ�wЁ�����b�#Sh�?|��j���+ 0������#������d4��3qA`��%��_Bɂ��0����Ѝ�(�QI3n�����k`$ �B⃺�n�]Zq@	g�
�%��uyU�����E4�\����߿w�y��k-1��AZF+m�Uش��8��	�<plum�|�Kx����0�������0��i��=��?�G+�x,5��-lBq@Q�7�T��.��C�3����;��j9$ �-~'d���^�ۈ|��`�P��ps�@�TdP[nB.�(\��]ǋ��dԍ��_�&,��;"G�27�I���.�C9��-�CI-
���/���!�ǆems���Z�E�	uLM0��ꢀW������K��PK    �VF�xj�    J   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/scripts/bundle.js�T�r� ��+�
�$i���]���t��t��dd	9�T@yL���%{����}�5C�j^Y�/�F�Ak�ٟ�k���`�@(E}i�����Z=�y�<'Lh�;qF�O-�����V3��z���\�hcKY�BIvN�2*�����E�]V�rǾq�(�>m���]͵,;�"L��7(q�\����	�H�jvשz����Gj����߉�ؘ�ؚ�A���X���P���}�U�J�=D�����Wo�n/�1ɤ5�����gN<�,�GuҮ䒤�=�ʰl�P���,iYY�%LC�vhz���G��w�F	FRzn;�r�ܓ�3@"��x���l?��\���V��#�C���(�/�Xj���d�ꁥ���@�Ke!Ƶ��n+@|u�0ZN��7������lBkf*�{n����n�<H����"F�Gjz����Q���:E\̸��ɝ��_q��咓�h��q}��E���U�LP���.
�(\�Zh�n�뫇67��զ��|=L>�5�5�cԠ+���O�����3ЎKXP��n�x�����8��E�P߱�����j0NB�Yw^���G�-s���;3꼫���G�����L�S2����G���r�{�O\�� G���`���'̣��U�=�9�8f�{�~��M�pz�j�a���PK    �V 4S�  	  P   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/scripts/compile-dots.js�U[s�8~�Wh:��\bo�O���Kv2m�å;]L<�-;&F�����s�K!��I߹}�ӑ�b�NRFB1%���)�L-�R�(�NW+S�(-�@[�FcC%�S�@�D��Y"�m��j5�H�"Ul��~��8�赓P�����L'Ѯ~�TW��r��/WEf!��X�%���"`J9Tƛ��9L&�R$���0���X�X��	�Ps��c�\�Q���:j��r\��m�ݶ �K�$؆ק9�ei�DBh�h��;j�=�A0���{���ڎ07�n��<�� #�HFC�<�|��' i����,�D^c����P��U:�J?�q�J�KU&QE<cT��0��;�ǪWO��)����#	�n0zl4��H���ض<��F�	���.�Ά�w��?��<�4ܲ/��P.�n%2婶g'z~�Z����nN�h6���L�����n�:�F|��-���8G�M�7���O���Di��t~o-:-@��x<�����D��dR
����B�a�h�	x�P|�O 4Y�S����i�_�&5�!մ��	7K�ʳ9R������x̎
يb/
���X ����)��
���@��2f��v*5t+_cZ�,��/���������&�S�N���5�� ~9ZL`r��ƑV���`0�\EP���D� �h�g��-ҩ����3�Kf)���xE^R
��m�|K�nΟd+�a7���-M��m�P^Uss܌ó~��Nɛ����+BF��R�8yC:[�)��k*	׾J~�k�
V�qm��[�hVu�Y*]�Ȧ6�F���Z�WR=��{�K�m*���1��y�fNX��b���mɘŃk{�)��o���W?���o.��u�@d\���LJ��ٹ��D�.@}�L�\h�G�Sԇ	�v~�[tz��^�Ʃ��Bs�F�9����K�^H��O���g�L�s6F�Wh�������uy�Tӹ���Ӻ.���I2�IN�H��y�J ���E�I��c��PK    ���V��c9   >   N   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/scripts/.eslintrc.yml+*�I-��RP���M��+��I�R0��SsJ*���tsr��]A|�Ē�+�����X. PK    ң�V\ӟ�  B  @   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/LICENSE]RK��0��W�8�J��!U�z3�Y��8r�R�y8�m�Ql����3Y�v+!Ќ�{�P�6���6f�g,v���� w�=|����;������ϐ��L��O;2���h��n��~����i#�&c�u���t0�����P�ю��AI���G�p�&��-T޻�V��k�G3�*�^g��.`�EqE,�g��T�#���	.6��`2>L�!����<ܞ{�W��{�I��D�������9��\������s����ֈr�wx3,�v�w�Y?�B�uE�:���&��u�iDI3cZ�+��&P��;7�B�7������ͫ��2м�yt��X���^����j�6ׅ�.���'�D�>��m5��M���1P-�P�rǵ Y@�ՓLD^`��`'˵ږ��g��
x��o2K"�s-��fr��R`Ofq�Md�K�e
����HZ* �+��m���X�Le���J�q��9ץ��)אou�
��	�f2[iT����=OX@��iJR�oѽ&�|��㺄�J�ͥ@g|��)�\n"H��?���E�T���n-�Ez?q)UF1b���S�������kY�BVZm"F�D��I��Z5����s�-�+!$���U�"ކ� PK
     ݣ�V            =   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/lib/PK
     ࣱV            A   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/lib/dot/PK    ᣱVl�Yt*  �  K   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/lib/dot/coerce.def�U�n�0��+"��@Q{%�����Z����C�uc�8H(M�}m'vLpJ���x��<���|{r�3FxF^.'�	 �Z~�1�p�V�2�V�3�(�5����u��HP�-[]���i$Z�v��M�8ȎI�B���O-�	r��(�%��>�_P[ ?�rXU���/���~*|���w�+��b?�))��M�~�����:���k2@|oّ*}U"�q�F��_�Υ�-�����uۗ��<�ğ�cGx)�� ���6FS`K;f��y�F�F�0��&Tb6an�V}�s:d%�8�V Z���Z;��O���(���Rnh�SR�PT�F���p�8��ɼ�H�D{ƀ��H��@|&̫C9Iܪ:��}q�+����y����ƣ^�xo\��x2�ut�r���HP�4ս�#�+o��qb�e�XP:��T���U��q��[,��ܤ�j�����7���nۃ_�Ŧ�����V\wK�;�p��	�BҠiw�5KI�3��mi<׺%��`���Tn25O�馬1�>C��z♳��"��o��d�PK    㣱VovD�    M   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/lib/dot/defaults.def�T�N�0}�+�,I!>`	�}P�%�h|�e`�,%mqC��RZ�qW����2�gΜt�b�Q*-�S�Ӧ�K��V@e�fۚ	*�)�^E�� h��Z�HHN��0�,�5��gc�J� 1+�TZ�1���%8�VbNS����<�$��d	�jR �v)�'e8Sa)䆳T��3��K��ы���J�.�4��V�T��V�i���t��m-[22����ᬚ��BȜ�����g����&UW�IӗG�磁/֛�8~sֱ�@<����k}�UA��7�}{ր�z=ojjCp�Y�\Rcc{SS�,�MA6Σz��'v��rn��q-��
L$�m����o�Z����)5$��"���	8r[͢fN{�q6����$-��m�&c�fϿ��bk<h��ĭ��ݱ������O��6�t�>���PK    壱V�^�  �  P   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/lib/dot/definitions.def�W[o�6~ϯ`��`���hW3�&��u�l}	C�i[�,
$ו��wxu�`ID���/)ˋ���1üȿ�Þ������_=G���(��?�tZ?�"ݘGyh�x�w�zW��'%�Cv�K*�Cq.x��7��R�c��	L�}�y5Dޯ�6����i�]QJ(��/�9Gi*�XS�_D��뉿B�o�s<"�sU}��d%h� >n�`�]�],\��:����37r_�.',���Hq;z���w��%WR۷@8����ZPܯ�[�jN��,�o��9�62�(�����'��x�p��L�K�z�q`�z8t�3�#��
&kɢ4��r������/�P%@UH�P�m� ������aV���B�U�O0N�~���`#$�P����dW��TO�'���N�is]�Lbΐ�9&k�0����8�z����Z �5I Q�6� ~G��D�� !ZG��|��,S�FLd����n��E��Nsz#��c�,��
��j?���T��S1��s���ޯ)�ګM��$M�9Ov�OY��H�yg( 4�:�� }B�P�aq|_,��_��]��$!F�<��[����d���H����x��2��G`W�I��BzD,���w�����SH掋�3���jc�A�Зe7(U���Rt�B����pS�2P(/�bU5��R�U.��e%
m�J*QVz�;��M���܂�v�H��1B�
�a�+�=@0�9#����b��Ai�j�Z�ޮ�v�v\�e���k��F��Ј&юt���`�,U�Ρ�����u�D5]���� ��'��5D�əϺB�&g��>-��%�8Q�m���/��(;��-1m��3t�k'	۴�	SL^���d�2�Gr���P�{hW0���Sq[�M�]����������(~B�{ �[ߎ�m}R�._v��Yk8�X]��$ZvV8{�B���
�F,���_�)��o��N��\i�5�����h6�J�M��{�m$z�eO�������3gI�[�/��#�֫ټ��ԗ�߀&f����c��6�a���mM��*�F���]�}���)��FE�Y}�^ċz���{}<6vg7P���M�7##Y����ô>|���C6�U��? �E�,���j�(�$s���Ԫh\|��q����s']n;71O�ܒN4����Shb�m䒌cX����3�0���U.6�\�@���S��PK    棱V%��p�  Z   K   FrontEnt_with_F8/JavaScript/json_server/node_modules/ajv/lib/dot/errors.def�YYo�8~ϯ��F��Ѿ*0�6E�=�c�1[�RE*T��r��m�[`��ɹ8�7d��)��f�?B
-R���NNp�6�y��y|�	�O �"�4�7E�V�9�(�>��=_�i~ax<Y,`Ð�H�����?ާ�:��,0������V)�D���L��Loc8�?�(��s02P��bw��aT�-�9V�C�B�d��OE����΅�=5|i(g���l�o�-�ꥵ�U�|�fZ�w\)v��@�����hyP���;�ߤ������鄾hwN.��w��~�sD�k]��4񰾝�O��쨿��;~}j2��rl���g����˦:RI2�f.�`W�'`S�^�g�ڞ����ص��������Xn�a�縸N�sk�����ǫ Z��B����]2��ã4���׆�+e�Sv�.K����a}��7X��>Hka������b�Q�����<����J����K��������{��6�x�ǹ�ʹ.rI5������Z¹�9�@��������T���c�����Gy������@>1�m�U�����_^�zRs��&��)���*�c�П4�N��^Kݔ�<��Vo=Q�f $�|ȴU*W�nz蒩P�m�U���0$��E��v�|�#��+Y��z��}�n9��v���������Պe܂�:u���� P��2�0"$#�(�D7i�p&�E�Mΐ~��M��h��r��4f�J�;��7�g�ḝ$�Ԏ,,y��A�I��i������a�P��ԝ�2��K�0l��>export declare abstract class _CodeOrName {
    abstract readonly str: string;
    abstract readonly names: UsedNames;
    abstract toString(): string;
    abstract emptyStr(): boolean;
}
export declare const IDENTIFIER: RegExp;
export declare class Name extends _CodeOrName {
    readonly str: string;
    constructor(s: string);
    toString(): string;
    emptyStr(): boolean;
    get names(): UsedNames;
}
export declare class _Code extends _CodeOrName {
    readonly _items: readonly CodeItem[];
    private _str?;
    private _names?;
    constructor(code: string | readonly CodeItem[]);
    toString(): string;
    emptyStr(): boolean;
    get str(): string;
    get names(): UsedNames;
}
export type CodeItem = Name | string | 