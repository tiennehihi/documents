'use strict';

var identity = require('../nodes/identity.js');
var Scalar = require('../nodes/Scalar.js');
var resolveBlockScalar = require('./resolve-block-scalar.js');
var resolveFlowScalar = require('./resolve-flow-scalar.js');

function composeScalar(ctx, token, tagToken, onError) {
    const { value, type, comment, range } = token.type === 'block-scalar'
        ? resolveBlockScalar.resolveBlockScalar(token, ctx.options.strict, onError)
        : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
    const tagName = tagToken
        ? ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg))
        : null;
    const tag = tagToken && tagName
        ? findScalarTagByName(ctx.schema, value, tagName, tagToken, onError)
        : token.type === 'scalar'
            ? findScalarTagByTest(ctx, value, token, onError)
            : ctx.schema[identity.SCALAR];
    let scalar;
    try {
        const res = tag.resolve(value, msg => onError(tagToken ?? token, 'TAG_RESOLVE_FAILED', msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, 'TAG_RESOLVE_FAILED', msg);
        scalar = new Scalar.Scalar(value);
    }
    scalar.range = range;
    scalar.source = value;
    if (type)
        scalar.type = type;
    if (tagName)
        scalar.tag = tagName;
    if (tag.format)
        scalar.format = tag.format;
    if (comment)
        scalar.comment = comment;
    return scalar;
}
function findScalarTagByName(schema, value, tagName, tagToken, onError) {
    if (tagName === '!')
        return schema[identity.SCALAR]; // non-specific tag
    const matchWithTest = [];
    for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
            if (tag.default && tag.test)
                matchWithTest.push(tag);
            else
                return tag;
        }
    }
    for (const tag of matchWithTest)
        if (tag.test?.test(value))
            return tag;
    const kt = schema.knownTags[tagName];
    if (kt && !kt.collection) {
        // Ensure that the known tag is available for stringifying,
        // but does not get used by default.
        schema.tags.push(Object.assign({}, kt, { default: false, test: undefined }));
        return kt;
    }
    onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, tagName !== 'tag:yaml.org,2002:str');
    return schema[identity.SCALAR];
}
function findScalarTagByTest({ directives, schema }, value, token, onError) {
    const tag = schema.tags.find(tag => tag.default && tag.test?.test(value)) || schema[identity.SCALAR];
    if (schema.compat) {
        const compat = schema.compat.find(tag => tag.default && tag.test?.test(value)) ??
            schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
            const ts = directives.tagString(tag.tag);
            const cs = directives.tagString(compat.tag);
            const msg = `Value may be parsed as either ${ts} or ${cs}`;
            onError(token, 'TAG_RESOLVE_FAILED', msg, true);
        }
    }
    return tag;
}

exports.composeScalar = composeScalar;
                                                                                                                                                                                                                                                                                                           �wp�˲FV����1��<����猸7'_n�=�yPڮٟ˟�MKH	nB�`��d�ﯩ��i�;��X)Jk�N`�6��ݞ�2U(b��k/�2��|�с̯�ܢ.�=�6Nd�GiD�D�<��q,G��C$���>w��dN3Mܽ�eI�w��6�[B� ��:Fv�8�B�gWfA�(�|~Gy*�����bx=A+K?˲�2�	�N����jRج���2���|�M^.dԇ8��Kee��)b����z�g��%�Y��&
M��$��qu[�p����)p����p���ن���	�Tjv2.��6�=�����MP �����mh; �2ʿ�6ٶ�-� &����ŗ�sy���:�����{Ŵ��1ĮS� ��L"\�당u�i&�#����RJ=�G���3�4)��!�����6[�OO�,.@�B��	F�=�Μe�ƙw@}�?��]�D��1����(�0��Z	���[��F䎦�O �ʃ�)�L%R�(W����%m�J�?3�`V�7�,r�{s������O��#l��nX/��Y�\�o�t|�����'ʡ�ʎ��6�@ ����<����B�1-��K���u,oo�l�O_�d��F��}��V�p�l�h�NC��1:wSNr��r�8a��zIүZ�۞ÎӜy!.Si��0��S���Ij�,��!M�O��DoAX��9zsI�L���8I[�y�豌���a-e)� :��=��"-�,/���3E|��$ͦ���$��4Kǆ�%��}�<Å��Τ�-�=��Pܐ11�ơ�U
�`@��B��t����B>'�S̏�Ǖ*�ᰗ�q9�5�Vd3�7�ь|R�V/��AMJ�I��) ��R�i#N��1A'��͆���[C\D��G<-�+�W�;�ɚ��y5�џ9���&]�<�T��ò0*�  ��޼R�lr>4k�zO�T
fyUm��G>a\�R�_��G( �g�v�d.��.u����	��욆R��O �/�[�w2��#d��xΏ�a�����f�8 ��k��U��V�����E����#^�N�V�{_�<
w6�D!Џ%BY멕嗞��_{8M�9�����c~�_*ҳ8�݁I��wK�Du&q���eޅ�ɷ�T��˗S�[�2�}�{���Y��]}q��@P �R����q"�O�+�dQS�p�!&���&-����FN�G���6O�yIuqk����1�]�fMb�+��.�(�g��Rm��K��6��!;���c�o��o����^�2f�*�>��GJ������â�.�u��N�Ш�Ï���)�J;ߖ l+�E
 :�S�-�����T����hA����d�+7�]�ύ��kt���n���Q*�\-�PF^w�����B*S@	H+�x��O;�����POy�\ƀ�BPś�Jn7*k�3�c��[-�7E���*��+���o�k1����y�M�ˆ�N%�,Ld��/�͘�� ���� T�'��uk"�4k�Z�D�>�!VJA�+��qك��m���Pq�I��Ϧj3Tw��l�5-�H�$�r�����P���ӾzG���\��0�rG��0����#�����脾�\wUe.�������<�#����>A�9�a�#\ ������+c�V"L�K�`�?��׋�O:��9wHv`�p���T�AK��7�n�Mh�v�<N(���[v��\�*f�ʒT��rJ{A�m�/�匄��L&�
Sm�.X��PpSh@�5i�Z�B���Q��6J�G��*���h*=^w�������1*��>3�����+:i�FTެ�dsḾu�dS��QN�ӹ�P�X�����O{�L�<*��Q?2�Ȫ�\�}!8��E'���w�� 7^���e�_��2����ɏq��(Z�!Y�㞏�do�y��h� ��z��� �-�[��2���H�;���� ڟC���%Z����ے��./�����Wb�~G���gpŅ�I��O o!����>�Q;Z�a(�Oɜ(���*4�GC�7�95��dO/��v;�o:H��UnH������<����w��5]��G� nG��G	05�}j��s��d�)�k�,c�p��e��;n{3�wΗ���rr�Q̥�rW����}����i�5���Ӷ�/�����T�"��z��� �6��M�)֫�(��ǽ�c��ck��3<�{J�0-r��P�����A�@xQ�铪�E�5d��H����K�JN���Pb���%���m�f��s�\q_���lUQ�J���W��r��Al���0m�����a��0����Wa�/|k��O��1��#֕𓈓���V��8�����t_���F~XO�����;zy����"�:'R�Hqǻq�]9ҧ:��\A�r8q>\��`O(�qx�c ���	�j���a����F�Jp����ٕYukF\��^�J���F��2��ۤ:����}����m�
�J�ͮ�;X��ػ��B)Ȅ��/�1��Ƒ����y�F�)��H�E���4yn�e����E�W��w������|�m�������Y�p���&�����Z��q�kZ�!��Z}sB�t�Ba�����s>H_h��)*v�g7�l)�n��#�s�}�&"��<�U: O�1c&C[4~&Ů�8�Ǫ1WmYP\���"��k�2�Q������3�z6�Q�o�Y��m���[�6*4����܇xeJL��
֔�v���}8���E�J����{��6P����^��'uV���CQ����Q���4+��r��=H���G �(�#�B`�����=����vC}�D���	P�T�x����Sj���N�Z9���|�/|j�u�5Y��!.R������ڢ�(���E​+`�d�X�����|!(A>�^�#:���� Z�7ZB9U��\D�F�� �"-��"��`�|!m-f�! =�Y�a���;d�U��]eQw	&Q�� ����#�"�k�`�7���c�u��#SUL:�TPvo@5�_�s�<2�"U���	8���7�zèߵx0�AC:H��Q?k�{�a�F{:����hE��a�-}�E\�;H�]���N����+���#IY�P�V}ؤթ7`��*��;��B�6�����Yӟ�{�c���A�(��6��Z��t�|���ɖ��s0�����mR��J�|�p��3Z��EԴ̯K�{xmi�[3���Z�#C�^E0'��c/�]�4��� P�~�+{�W��FKo�>�X��H�(4^K�.�~�2)|�1��9�� H�Cgқ?��M�]7|N/.f^	�ÃM�)u��������c�)����Jps��3_�IBUJ#���Wt�M�N���M\�ر�����L�ϳ����oݶ����!����	�>���Y�5�[�MLL����h0Htp�7w���D ��V��S0�ҁ~�P�i(���kf��U\��"~�)�* ��u�i�,�*ƕ=��ci�F�,W
�E_/|K_Kq�����w���c���c��n�G[R��QV��y��V_��oE�S�Yח�+L��cͯMv�j䙖L�T��yITH�LsP�@��$��T@BS��Me�o	��9�$�j��]H��3 PV����_u�A*+]�nJH�(V;��P�Or'���^T��р�[lǩ5�沍w���D��;�o��;�gA�6����?dRH����B�~����ߨ�ڠ�r�N���u	��Z��i��vw3�x����-[��O�U	����si#*��5d�q��a{s'ti���N�`�[J!�sߌ�������<<��i��i�Ƽ�9��ld��I�P�'y�iw �A&�j�s�uVu��ϩ�XP��´�K�X:��"�%3�%fH,��V�|ñ�_5y+.f쬫8�Һ�,�㯉ᄄ(%UEƏ�Ӿ���w`/�D����\3�^�Qq�$��ֲ��6Z8�����Uh�Q{!6���Dm�l*x�B���I��L�:Io��F�(k{l}�*�(���0�V]�r5Өr=��W�?�ߝ����H�S˪/�e�R��Ϟ����Ss�-���n�0,dJ���k�8^,�I�q8*��E��������nؖ�MD�h�ɷ��,���֎`Y����b�_� i_���1P<���D�2�������E��,�D�\T�3y9MI��T\��j�]j�0rǚ�C%��u-t��4.�,�6X��Pp�����T;$�a�_�hE�
��v�T
t��$	����Iޥ!����*<nϗ��L� Pm���P����
�HQ)�� Z	�j�S����U�����.���8�k�	gm7�����^Ox+n>$�72���~v&��<�*��Zm��fJ����ju��H׆{:���<�I��Y/uY��K�g۵��Ķm;i�Ll[�m�i&�mۍ�4����ц�{z��l���s���y�u,����� � ��d�>4�oF��p{�+:Pף+q"m���'�)��S]p"�Έ�#oIP�u��fy��3b��׾ ���TL�IG�ϤG#��>� :\1���Pz�bX���ak0��y��h�D�/hC��
�đ�?��0R�|=���^�Ytt�c���F�%�vQ|~o���� �D\��B�r�̏^�L�\?��y�2�odv�p)33pn�=L]V�!�q�xӗ��4������6�#��:�����ʱ"�`fZ3�EvpսlB�$�����U}q�8ؗ��AX���ی9OhYjz�E�Գ\|�Hmc�����{�-9�)�'�n�&b%�ʲIgEL�}�{;���ϧ�� }F��w�� os�Q����W����� ��1I��ѽ�z�h��ꮢM�Z ���#0*��0���ZȉK�}�43X�85��*~��!A���F����>c�63>��|禭�97��.N0ݦ�W@�t��������M,���[{�c��ƶ&Q[8�7	}\Ў�������5Ip^����f�(���W|�)@\�i@��2��]2f�@K��ÊQ�Өg�h�o�h�B�ꨥLT�X��#���z���n�Ԅ?$�ǖE[�5�J&�Q�'�-�B���`�`��Z�{}�N�Ь��Ŕ����T��e�0�</��`�.���̉�F�f���'��CB��v��Ϊ�f�v�s��
��$��^��鷃�[)`�	�U�dy��Y�9m�8e1NEy<(sr���El�Ǆ�y�Y޶���~�fD��Q�n
Z�ݣFkƌ��Uz���X���ϡ;c���͗ތ�����7���x�������ek'p���i�,y5&  4@�'*�H��#Ua86!�R��'�L%v.
d@7tt\���x��.&qe�$��M	r�lR�zZ#�!	CH��5Y�Hf�m(�)�d��{٫�� ����<���O���-���a�ݤ/��*�V��6�}����(D�y���}T6p��[	�����+g�k�ܼj���Q�v���z��.H��|���!�%0t �ʊ% �41�Y�Eԙ����kf��tUD���)T��s���e�C1*BF�� ����9�@�ecː��f�k���Ж�(;��cu:F��A�I�s^�4���Ӣ�itP>wx7E媍:�=r��N$����z��կ��~�bT}��㖞����碦�4A�β�إ����wǣ��Q�� ��U�6ig�u�yf���_����2G�L8|�5s�ܮ�E_Z=RZm�s�^�dܤ���x���?4F�x��叀�:i��@���$�/��E|�d�q��1�=�pXMp�S$�z�����y�� 0�Й���t�U��w���iؒ�D<�ų%��%��4������C_��+$㢖3G ��^ż'�ZGs}����h۵��m*N��������"�B�ɀ�\͍��@ۊ��ө tV1��R �Y��S�	`�3��S'cr�s�+sc��@������焋�P�PS14�]=w���玣�'��k�Tׯ�����~�B  ��/ �)���[�:���&7x�ש��s�ށz��`�n����o����T]�I�JgB.hh䈜��1�O��Ż��t�,����,ѴaXDL��*� 
Xh" �R�R�����W�BUb5�7a���ʠ���p���L�ܔì��F�s�+�DY��D��ʮ{�Y�l�����Πϑ�̖H�'j���]�^<�1yu[�=^�6���{�X$��
FV�S)��|�8E$B�Q��� ������$��I*��>����t��zoO��@=��M�%��#C�R$EQ� ��>U��J�e�����6Z��%�-D]���F���tD%��ʃ��З�֕����V�"f�n�0�7�c��E&$C�FK�2;C��o�u=+��V�-@$��'�[j_�}��HgS��rչ�x�w/ �3�H̭$�F�� @�o8Z�@?��ǐ�a������f����Bm �:m���]��cn6�Bŏ�(�W�u�O"c���p���L����s���iF����pc�'9��lI4AI��K�!��Ǥ~�ؽ���ݐA������y�%z&���D���䩠�2N��A@ ���*fg����β�͐�-p>:����j��F��7G�qk�� .�\��a�EGN�"Q�I�1���Y�Y�$�ѓ4�10���QA,B�#�C�=�� �PG�h ��A	��J�����q2Q\��?B�7��)ٲ��J�6L���am�Xi��x�.�w���Bg�:��Ke������Rb_�'z�+��U��r�����8�B�h"6FW�O�jc�#�)*��4(U�|{H@4����(�|2��ͥ�4&j��rN�NG�"��� C�]�����E�+<��gៈ˰>�a!��_�^3]��O�϶!�5�!@ �,r�<p0���@~�{=����l��4e�Rs����>M��ʥt
�tdތ�Ʋc���ӂ1�sGk��>E������˱�!����;�r������\����U�>��ӻ��i�g_)�D�t�ZI���Y�"k)Da���&+�,.�f���l��yY3���l䉒�zܿaRd��`��
w�Y�