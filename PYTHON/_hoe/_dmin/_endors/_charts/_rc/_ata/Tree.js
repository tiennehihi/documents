import { isNode } from '../nodes/identity.js';
import { Scalar } from '../nodes/Scalar.js';
import { YAMLMap } from '../nodes/YAMLMap.js';
import { YAMLSeq } from '../nodes/YAMLSeq.js';
import { resolveBlockMap } from './resolve-block-map.js';
import { resolveBlockSeq } from './resolve-block-seq.js';
import { resolveFlowCollection } from './resolve-flow-collection.js';

function resolveCollection(CN, ctx, token, onError, tagName, tag) {
    const coll = token.type === 'block-map'
        ? resolveBlockMap(CN, ctx, token, onError, tag)
        : token.type === 'block-seq'
            ? resolveBlockSeq(CN, ctx, token, onError, tag)
            : resolveFlowCollection(CN, ctx, token, onError, tag);
    const Coll = coll.constructor;
    // If we got a tagName matching the class, or the tag name is '!',
    // then use the tagName from the node class used to create it.
    if (tagName === '!' || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
    }
    if (tagName)
        coll.tag = tagName;
    return coll;
}
function composeCollection(CN, ctx, token, tagToken, onError) {
    const tagName = !tagToken
        ? null
        : ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg));
    const expType = token.type === 'block-map'
        ? 'map'
        : token.type === 'block-seq'
            ? 'seq'
            : token.start.source === '{'
                ? 'map'
                : 'seq';
    // shortcut: check if it's a generic YAMLMap or YAMLSeq
    // before jumping into the custom tag logic.
    if (!tagToken ||
        !tagName ||
        tagName === '!' ||
        (tagName === YAMLMap.tagName && expType === 'map') ||
        (tagName === YAMLSeq.tagName && expType === 'seq') ||
        !expType) {
        return resolveCollection(CN, ctx, token, onError, tagName);
    }
    let tag = ctx.schema.tags.find(t => t.tag === tagName && t.collection === expType);
    if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt && kt.collection === expType) {
            ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
            tag = kt;
        }
        else {
            if (kt?.collection) {
                onError(tagToken, 'BAD_COLLECTION_TYPE', `${kt.tag} used for ${expType} collection, but expects ${kt.collection}`, true);
            }
            else {
                onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, true);
            }
            return resolveCollection(CN, ctx, token, onError, tagName);
        }
    }
    const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
    const res = tag.resolve?.(coll, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg), ctx.options) ?? coll;
    const node = isNode(res)
        ? res
        : new Scalar(res);
    node.range = coll.range;
    node.tag = tagName;
    if (tag?.format)
        node.format = tag.format;
    return node;
}

export { composeCollection };
                                                          rL������P�}h2�vɲꞧ��v�E��B�&:�n��\P�����OYٚ�~~�c��Y�[�p����8F�?Q+#�=�5��:�Nmړ=5QWa��@t�\P�d���C9L>��$�o����9ؿl�^���|�����y)��4o|b�41W%Vo+/jxj�����P�w#�"Z�!�_��6���w���xf�RH}
(�:�;�3���e��S���*��K_�Ƭv��/��ލK���l�MQ����%���u%l��l�h�s���G/+��ui?�pҡ-[kjj�r>v�Hʶ538�zktoΠ�ᶗ��e�묀�70�ًL��9�S�"6~w�	�/�M O	Ί����DU�0�3�4�4�o�X�9���Q�i��i����Y��O�Bm���򵜍󻜖���_I�l�N�㻼�g�;QBX���~��}]�kI�]}�=>�q�8�$����u�S�d���N�/����̑Z4�LL'dZVÚ����>��k,�do�O��*"~�#��lDzw�������I�&Fpҁ��w7�7���,���E'�M��a��4n˄��Z�Y±��1�~go�]!��s���'�+����bƮ~��ˆ�����vΉ���n���
`�˲���f=h�L��/�cM�&���s�_�����׫}�טga�%�y��p�����6��5 �K�˝�GI��A�W�uGL6��9s�^�����"Y��(���䂵,�<���߯6�nw*h�	��M���<I�AfKF�(��[1������bɶ[[x_�o�-�n�*���1�έ[۵n﹝��H�r�I��!m�]=�}�P�>8/�/]K�3�(h�j��c�t�)Q4	�H[�*�p�^�����n�-bqPV����_���}� m^<�(S���jo�8��K����ަU�߾0�a�-a��ē=z�c�������K��Z�|��k��ܤ�]/�U��o:=O�4~՛��*�Im���&)Q���Kh���4��<�c=�U	);f|(��n%Gɼ�o������Ѯ�:t���h,�Ύ�/P���N>���Ekik��9�->]w�P�b�$	E�?�8�x�!�a�G�z��<�s1����Z{|Ǐ5��1��U:v?1p�&�ɚ�RU�f��ѱ�'���\�vOPYp��:޾>x��8�����U����������V�;�tx`�� Nz�J���(
@�:)�seկ(�Iv%ʊmBPִ��ҘqG(�Ĥ�0:�����}�й���s���)�D
Ē�~�u/s�DJz	Qp�����!5�����^�撣XzU�,$A�x����Cx�a�㶖����8
�Bk�wY-���Q4��������I�E:�mM��p�\�d�T�G���ͤ�Z�
�G5���<��5�6xC}���هG��oYߺ碶��ݛ �U��@�+�I�שGk��R8�z�8�x�"!�*�#&V-�E�*��h��@�=��3�4���;/W���r��y��{6%�v�gJ�u�$�$�3�	y :6�6oĔ�9e1��n� !�a4;XVU/E���: ���<��sz�]��kK}(�6�gY��>D~��F�ا��^=8`��¼�"�6`����w����m	i�է儥]Wv�k���xO��ж.��=�P��z���v�qʕ�<؈Gʴ%�ؐ_ZjR�3�b�{ٹ�pUu�<*�`HѢX �h҅�g�{�)K�U8�Տ�w�?��;���#r���y,"��L h�O2�y#]T��\$Q/�����Rj_�O)����*�yV�xKd�����F(K��h�6�th�8W���p�CX�;��Y����X�Z-�� Qd�&Ny4�Pe��CH{���38��j��Y��r�4*Sͻ3��e(<ɴz�T
`�%���s�04"Z�B�YJLD^�`�H��{ѹ��6�M�<����Kir�m����R`�L�]î���>�t���J���	j=�p������3ư~�jz��L�K�����F[y��:a��JJ��ҟ�S��}��l�2��O�iu0x���z�N���a/��gf��!���UU�*����늻'������ #�6�����owݘ9G��&v�ǉ�C�l�j"�� cT����7Z3�C�?����������a��'���21��SU�b�X=�|,��1Ā�Hk^�
Շ)�zʻ��|��V���x���ɹ�r���}Q�DK/�e��z�Pk���,-o ��J��S���y��`������$:�e�N�D<r��޶&�ބ�y��,���bF�W�����U��F�&E�D���]���T��8��pU]�<�,�7�)>���F�.r�x9�B����<�c1�F��Qq_��:�һ�İH�ai�b͊��2N��wS��W�\��0�R�������o���"���x�4�^�vV���b�>QY���.=���M%��B'L1���PSm�j�I*ob}�0nA`;�n������^T�.����X�Y����^��]TQ��ގ����ܘy�! ��f�'x�Bg�^�m��d�z;��g^B׿��ħ^E�1�4:j̙z~�]��A"�[S�Ӯ��đ�\L���`i��h󨈈ŒҸ,��I���ao��7Hl�0p,0���\a���c�j+��,��k�'	����l�ֶ=�9ۏ��9�����6H�|`���$Q�ᮞ�� �t+C�k$���Z�~V�py��C_�e�v뷈8����!M�o3?c")����3"�ַ�7[Gg+6�o����&�0��\�~,��-i7зgա�����|����wh	6��F�d��ŽIx1�eT�!z���K�S����ժ�@��)#�=�:`��^v�RE� ̀'����<o�*D_��I���i���Ч�m���Z���w�m�N�'�	D��fǮ�h�|�U>U�{�[���gd�Ҥ�')��-��瞐�����׈6���1fk�U-LK���|߸��ž�o$0������Ԇ��!�U���*��hw��f�KϤ�6�i,�g��SE�oV� 
;kE5�F���k3i����ж�c�}����-�}\2LR'���%%բ�.�uR�/,@����Zv"��}����B*w��qEn��)p���������)3�S�������_7T�j(?�@��P��hdսL�W�&\P �=�[��B��7fZћEj��i,Y| s�������&$����5lSNǪ��U���3�ýQ2�0�����%�lx�N�P%�7|2N(CC~��*��DY������n��ߡ�_±P$���z�*���}d��;Z4�f�c�Z��sT�&�1X&���I00oF	KXKī�o�$H\5�n6��z�4
3��P�}ھ�a��c��9�YK�h呛@�����#I�����K�a�,.�����⌲4J�q���gP�z��P{��M���|��ga:�e�>�/#D/!$D���p��T�M����X4H_`��HD�F�ΎW�o��g��'�������d�B/���M�}m�;�%�z��Xg��7Xo��h�Ǳ�lI]<��F�(DC����}
e�;��؏��)�����AP�h�`x�N�-�Z�+�LA�d�ү\���L�%E�E���a/j	ֈ=�-�o(���[m1���Y r��7���m�{���AYEЌQ�t9W���B�t�Q�)Cě��s.�TX����SO��ߚ��>�K��4e��Z�z��\�!T�9�R�"~dQ4��^
� �+�qv�:XF3ϼ��(y�LT%D�*/�֎�-�Z�.9��iN��־��u�iT/!?���^`�# �]��Ǐh#�ͼ��Bo#�XƲ��B���B<�w�R'4�bA�����b�V�|p���$a��F���v�}{4j�ZBlD	�}�Q����I��69�>�#|/��Եa��VM�-�,�E��9bӂ�fi"SR`��,z@�1G�y�8ޤ�챉g��U��6ƳJ�91i���m�7{���w�Q��p�q��ٳ�/���u��-��8��n+�����B�T��_�!@�F�B����7q��U��k�qk3i�Tx܄��� �$�w�{��1``&����Np��{#�AuB�Y7�A2o���,b��<��e/�n��-X��\���V�1~uWjM�kiF�jQ��;@/)]�i~���s�(�.$�������f�؃��ᾣs.$X�hA(�q&����s�"� `H�ܳ����{[-�k��Jk�;W2ҍ�W�_L�y��Z>f[�7��z�f�j��"zߗ5�P �{klr�_������FQ�[/M��@h����o7I�����ahc��q�z1�ێ�-�M����~�ّ�.2�ԌZa���[�)�i��j���I ����gO2�ƥ��2�e����� �M ?#C� �3�4�p�OF�]k�Xô|8���6 ����̷uq�� :���7�E�baIY�p�i��2��P���z1aƯ���Q;�ݽL�5��Y�[R�XLO�ͽz������/�1jL�xW�����-B: g��!w�)�L@���A��X�: J�\1�Ҹm�?�^�'�9@A���Y� �f�4���	��x�?��շl@9��Hz<5��ï��e۹�w�����r�2���3�C���>��"sɿ:���,�w Z�����5@����*m}|�������:%S���e��Z��g��g۔�=�:�H��%֍��D�@9�Z�Qwx���~d_s�;���h�`�;�pB���T�uK�dݍl,=PJ�mHj��}��G�9�<�֙��I���_<�Я� �7Xh��# KHu�5˛�^֝��l�m=v)�r���k��~�Q�ilW�3���n�����1}&q����R��t���F�[+�O��8LC��(g~	*�����~t�X��ϻ��kH���V���cm-w!-�h�q�B{�ӟ��y0��>#�������W���a: ��_��"3l�5 <��k�	�Nz���[6`�K���p���@�f��oyp�+�L04�ѣ�(��w,��+V�0�\ �91	�1�"�eL���l(�hAi]�C��"�h*^0��w����i�ul��1׍L���M5ʷ��ﮘ�tŚ�AC���~or6H�7� HK,%6��/Aa��c��09 d�w���	�����i�C���Vsw$����Q���`�Ms����������o��4��� �k)ᎆ4�p� �D,zǿF��&�rE�ϻw���L�"�~Db,EΔm�9#��e�hh	������8�#*�q[s���k!���[w�]�J�5m���ڋv�oP��1����%O^�[�5=rw�-�\`J����%�U{�]Q�Z^{��I2w�O�'�8;ge�3ix�iç?����>��E���t[��yG)f9���tn�"n8��[���:��*��kn*��W�p4�آ��8�{�� R�c�[�L�^�N�A�eSdz���[�Zיִ�+��V�jU�p���+�O��e�X��q	�g�d�P���c���L��|�w7�4���4��@?�a�K��N��l�yډ򨪆�A79����>V�l<�O8U��U
���I�V���^dw�����h�ž�~�ǜǬ�����~z����f���*&��Zn�3`�Z}����R�$M(��	�kv��:�G��o��-�w��_=������ݯ8ε��!�)�o����;�a{�����s�� ��tw���#�U�6��"�/��~��%����Y:����!;�����.z[;m�Q�1{p��@��l/���s�/��~{r��u?��Ф;g��5�c+)Pʏ\|)��RⲴ�a��cJ �/2��.��� �Mszi79���F� _���i���Q��1��d^J%��	"�5H��$vX(�E]W��Y{p:f���[ܸM4��$�gA�ڋ(,���s!|�s+a��-w�Fi�����*8��8�\aO݂��u#�7���6-��R�Ø�k�Hu�e9����m�w��_��1�	,)�Ŋ��w��1�A,�Csɠf�3v؜���+ٳ�"��/��ä�S4qx��p������w�X�� �7 �����IEn�[�z����yɫ\�L'8z�����c�pEڥ��i��d�#��"�瞺4	m��Q�5���ġ��i��6:o�����K�O�@��j!Y" J�p��U�� �G���)EX�
DV|zdK̕mc����e�^�93t������~'VpP���t�`��9���y��WV�!�L)�"��f��M�S�͹�~c��b�������?�flm�9����������v����yʪQ�蒂��S65��h��O�kp�bϤ�׎��~��Nݎ/�3{hA(*#j����L�H���=:d|ܱ���:�3�����C�u�q�#��̣��	�|x{�)�=9��Lsy�P��eV[c S_���ӽI�Ϝ���Tv����J/��ӓ;��6s��ɳ�mW~�WȮ�Qyk�����b#�}�����Mm�d�e��}/�E�!�{E$�lX�&t����;vz�J�.q#Bݏ8ӨRU%*�B.wOU�`ߺ���[Vk�c��YVؓȘ���fg����k�3���i�'�
kL&����zw
!�X�p���$o��d�Vy{�3cq����Od�}$�dYmk����/�j�ҩ������'g�Xi|=��?zrį^0:�x��>c���5�����n�����dӌa��R��o�M{��z�r|��Qʑ@*� �3U��3�e^$���XΘ<�i �2t��Ko*�<���x��ta�N���Z�w%�'[�?W�ޠu:Y��;m}��ݰ���~�����_��K))M�R��_>GP&��\�A�3�k�WL"[��hr�ڄwpݔ�����w�چ% ��2AMF3���x�%�u=����\��/����Di�I�G,�%�EO`��u7�m|m�������1���:�5�g��s����;�[U7�ļT�Ρ�'���Y,�e�y�3�� �g��E3 �+�۳�ϕ��X<��{�M�*�e�;�IR ]J�BItD�D�E*�ļ��cJ��6Z�;�����9l`Q7h����o�{#�O��FH(|K��Y/o7�/��yP,u]��ڦ$�Jp��s�����ok��h�����*ĉ�ʝ�Ԟ%�Gb�{ �e���7|���U�r�eE,T���7�&opT��msxa����F���lQ
	@SΉ�X�.mH^V�b�0�-�=#\җ�KYB���yL���ic0�<���m4���9��l��8�2{�A�%�o!�F����@���Ѻ[��;��R��ؘ�TX���)��x�QZ��p���;,��yc���˵���@#�Ⴛ�
p\�M;#u���R�hr����*]p���6$ԅd��4i��?8���Ҹڴ�o�ŀXM����=
�L
㨤l~�#�U�4�����Pe2CV���m\�]�S��ھ~�*w�ڄr�g�	e��X���	�9�! x"bߌ����i
>�>ZF��o�\-�TM���B��2��$��.�`��=j�}^��	���_`~_��j��%�O�,(R��5�gύWZ����j6~�'ca�E+@�@���;SYqxf�i����ߕx{���yу������g{m����s����z(&��_�'����A�yq�N����G�� %u�r5ד)2�ddj��a;�'�����W?����q����S#�r	$�a�x�Ɯb�	s�ϴ�~�S^��]��^���/��o%;o</A����]F�t��԰Ic��~ݺ��u�ѹ��V�� S/	�jgx6��3���>�r�AY�N�c�΁�Z�ͥz��r�!�B���~�_�c�I?����
��h㸽#N��xX�%/ye�8Y�f��\�����	�ؐ2a�����c�-��Gս�n�g���45�S,Tc�y�7�BW˟�#����{��e�"�WS\�K�;���y��N絺bl&LF���@�lc�:;��P�K�X��z���������E������*�6��a�1:YDʭ�]wn��Q���Q���<CXVh�n�u����F��9E��*�|cqV�_]8 �K�|��x}�b ��`[��gr}��Y�]�vɎ��Ð.�X+E�Y�y�o/Y"@{w%���]�>9p���&5���/�S��]�e#{����_Á� �j%�e*TI90���s�99��ۥ��Z����]dS���L�Q0t���L','3f!�"L��:i���̗9���
�?4v��<�TÞM�I)���%*oe�d((��J�� ����7![|��	&�y���ֱ�75� ��״�.yUU6��!����n]��,�f�]ߖ��k�4Â���9�E���E�Ŧ&�k�����5��d�'f�3��?q�Z�fF�s�tPԛ�j�����P�=5+$�	4��r�!x�T{k����P"]%�R�EW1��l W@�I���X;?�`UC��5�
�2��QȦ R(0�N�O�d$FB(���!]%��`VqQ��tV"ʑ/X2�Ftj�*@�̻C#rC@���G%,�*/�J�tF
|�>�[�Z�$Ԛ���:]C�_
Ԛgn����(FII���Z�pn\U�X�R@��>(9CH�d�tщ�F�W|��g��[XX�D2*�ްP6i:���{6 �G+� �Q�*ӽ�T4��\cy�eI�� �o��V��U�,��J40�D?e��w��J�	�0>$JoVI�sH�����YU*�S��OQ_)�=��~2��rL��&=�\'��������&V�2�7��τ[R_�w+xh�.���zAp��a �U��α&��R�vf�:Ke��� ��.ä�$�H�c)�]I�8�������fW�;�1HM�(�7��cIL�0L'U���CPfI���� �m�����1�P�C<OJU�3�\-�Wt)?��eR�L��	>���BZ]�UˢYh�RF�����5��͐�V݋z.�t�k_w^� �,�lu_�vco��@�h�����TlB��_��	ӻ�!���X�2��W�gTf�7�k[�)���F3@ �kR)�쌳�c�		�Hb��$dS�c���E�:�q��<���#���߶�� ����PxԸ/�+Ve󌚫�z� M��D趝�б��G���%wYQ�`�?�, ��Ra�劵�J�����&�e�n'9[Q7E��� lK)�(����8��X�t��m4?C������A�n3}`��ϑp
�b�e�=��R $`)�C�ϙU�:"�c��Vb�4�+�F��Í5��T�P�~�D���Z��{�cT�?ʱam��i�B|�Q�T.�H32�+U�BQ(���S%�@Q+�+�|��ҶR�݃4�\d�G�l����y1#P TцI��-K����7�k�Hl]%�q�}�pKI��L�������M7.�k� ��r��͟����2�W�:�����E�A4��=�-���D#HV%�$�@��Wt\A���K,�##���\8.BQ�CF���{���U&O�yU}?�q^-@^��5$�)D��{��&]@L���h|;��-�R��?!�����Rj��ZhK`��I���� �(���4���%Pc*H1�Q\�pF����_�q�����P�W�o���c;��Mi���%���=�:O�S�NGd�`�p�
l����de�N���;M��8����?t���E�[ <��,����Z*�"'罚����;I�+��;�{���m��q�G��EȄ2��v�8S'd퍜f)X�1Ue�A�Z@��k�(FKM�&�%V_�zŊ��IT`:<�B!�Q�8���Zʓ+0�)����z��̥l�������G���\^�~ �YG�+0{�eV����_��а���W�xj�9��zVY��M�s��x��c8�ӊ���k�l`w(����J�@��{�A�E��I$�;2�X*|��A�Y瀖@W��r��
~+��}�9��B�����(