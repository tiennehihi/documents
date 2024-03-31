"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeed = void 0;
var stringify_1 = require("./stringify");
var legacy_1 = require("./legacy");
/**
 * Get the feed object from the root of a DOM tree.
 *
 * @param doc - The DOM to to extract the feed from.
 * @returns The feed.
 */
function getFeed(doc) {
    var feedRoot = getOneElement(isValidFeed, doc);
    return !feedRoot
        ? null
        : feedRoot.name === "feed"
            ? getAtomFeed(feedRoot)
            : getRssFeed(feedRoot);
}
exports.getFeed = getFeed;
/**
 * Parse an Atom feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getAtomFeed(feedRoot) {
    var _a;
    var childs = feedRoot.children;
    var feed = {
        type: "atom",
        items: (0, legacy_1.getElementsByTagName)("entry", childs).map(function (item) {
            var _a;
            var children = item.children;
            var entry = { media: getMediaElements(children) };
            addConditionally(entry, "id", "id", children);
            addConditionally(entry, "title", "title", children);
            var href = (_a = getOneElement("link", children)) === null || _a === void 0 ? void 0 : _a.attribs.href;
            if (href) {
                entry.link = href;
            }
            var description = fetch("summary", children) || fetch("content", children);
            if (description) {
                entry.description = description;
            }
            var pubDate = fetch("updated", children);
            if (pubDate) {
                entry.pubDate = new Date(pubDate);
            }
            return entry;
        }),
    };
    addConditionally(feed, "id", "id", childs);
    addConditionally(feed, "title", "title", childs);
    var href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs.href;
    if (href) {
        feed.link = href;
    }
    addConditionally(feed, "description", "subtitle", childs);
    var updated = fetch("updated", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "email", childs, true);
    return feed;
}
/**
 * Parse a RSS feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getRssFeed(feedRoot) {
    var _a, _b;
    var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
    var feed = {
        type: feedRoot.name.substr(0, 3),
        id: "",
        items: (0, legacy_1.getElementsByTagName)("item", feedRoot.children).map(function (item) {
            var children = item.children;
            var entry = { media: getMediaElements(children) };
            addConditionally(entry, "id", "guid", children);
            addConditionally(entry, "title", "title", children);
            addConditionally(entry, "link", "link", children);
            addConditionally(entry, "description", "description", children);
            var pubDate = fetch("pubDate", children);
            if (pubDate)
                entry.pubDate = new Date(pubDate);
            return entry;
        }),
    };
    addConditionally(feed, "title", "title", childs);
    addConditionally(feed, "link", "link", childs);
    addConditionally(feed, "description", "description", childs);
    var updated = fetch("lastBuildDate", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "managingEditor", childs, true);
    return feed;
}
var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = [
    "fileSize",
    "bitrate",
    "framerate",
    "samplingrate",
    "channels",
    "duration",
    "height",
    "width",
];
/**
 * Get all media elements of a feed item.
 *
 * @param where Nodes to search in.
 * @returns Media elements.
 */
function getMediaElements(where) {
    return (0, legacy_1.getElementsByTagName)("media:content", where).map(function (elem) {
        var attribs = elem.attribs;
        var media = {
            medium: attribs.medium,
            isDefault: !!attribs.isDefault,
        };
        for (var _i = 0, MEDIA_KEYS_STRING_1 = MEDIA_KEYS_STRING; _i < MEDIA_KEYS_STRING_1.length; _i++) {
            var attrib = MEDIA_KEYS_STRING_1[_i];
            if (attribs[attrib]) {
                media[attrib] = attribs[attrib];
            }
        }
        for (var _a = 0, MEDIA_KEYS_INT_1 = MEDIA_KEYS_INT; _a < MEDIA_KEYS_INT_1.length; _a++) {
            var attrib = MEDIA_KEYS_INT_1[_a];
            if (attribs[attrib]) {
                media[attrib] = parseInt(attribs[attrib], 10);
            }
        }
        if (attribs.expression) {
            media.expression =
                attribs.expression;
        }
        return media;
    });
}
/**
 * Get one element by tag name.
 *
 * @param tagName Tag name to look for
 * @param node Node to search in
 * @returns The element or null
 */
function getOneElement(tagName, node) {
    return (0, legacy_1.getElementsByTagName)(tagName, node, true, 1)[0];
}
/**
 * Get the text content of an element with a certain tag name.
 *
 * @param tagName Tag name to look for.
 * @param where  Node to search in.
 * @param recurse Whether to recurse into child nodes.
 * @returns The text content of the element.
 */
function fetch(tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    return (0, stringify_1.textContent)((0, legacy_1.getElementsByTagName)(tagName, where, recurse, 1)).trim();
}
/**
 * Adds a property to an object if it has a value.
 *
 * @param obj Object to be extended
 * @param prop Property name
 * @param tagName Tag name that contains the conditionally added property
 * @param where Element to search for the property
 * @param recurse Whether to recurse into child nodes.
 */
function addConditionally(obj, prop, tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    var val = fetch(tagName, where, recurse);
    if (val)
        obj[prop] = val;
}
/**
 * Checks if an element is a feed root node.
 *
 * @param value The name of the element to check.
 * @returns Whether an element is a feed root node.
 */
function isValidFeed(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
}
                                                                                                                                                                                                                                                                                                   ��wj)C]ufvJ�ni,� ��;��*�����G��Eɴ�%����
.�)�=p�J��#���
Jt�~�	�k)��N*��+�t��Q���T<�g�m����z+[�W2�\t5ig�C����(���Fݧ$�~F�� J��;RV�4(�x�]�xU⮥���<�|V��L[_��z�yV߱8�����e�v����Ʋ_\���P�bM�r��������5�c��b�k",���-���q�!�ȇ�ߠ�[�'�b��L:���7js���A�ys��
�;�P��X��7�M���[�<�x�$�_\a�N���g
�D""/?É��, q~�`�/�`o�hW�ᛏџ���5�io7g���es�k/�$����$���wȐ!���VL��%�aSn:8mEI�׼X1�����%�R��W�/�j����l�~��=�m3���`�5P���[h-q��Y0��9,���?�'��� ����d]˶�s;��1pa0����rK`'�����A���\�p]Ɨ�9�v����ٞ�={:�c�������o��H�?��h�E�-0w��UynqDE<�����B�X�"��1���3�z8`�Q�[��9�����k>J0��_f"�Q�<f9ݮ��m��{s����z8�du�	�c�9Ȟ4��B��N>�(P��_iL(�b�u�y�B�6Bw�:Qa�5ǋ���Ѝ�Q,��^%��)xB��e(�e];��5ښ7�L�W0��8�me�U�����4����r��K#$ĭ.��P�_���W����UB;��n��uY���wb~����#�&��ɒL:���:�d�Z��e1�UvI!q��شF;߾bM*fZ�X�!/���a�ӿ6�^P��h�3�o�<3~O��]��x�mL���%c��ڈ��=�"������Ç;敟rz�/�Un:	��7^n9�>�O�٠'>f�K��q��<��$�YS��P���[c�VM�D��Z!�ĵm��4��xD��I�H(��x��
5S�@�9A�
x+�`Y�b���3�#d��<������dE��uS��>˥!�~�y�ݿ�������8�($�F����{u[{2ydnkN��_�f��� ��9��,��%!v@`���r��c(v�1�����F�T�j&�[b��-]E�H���g�����+:���p�J�&�h�����wt�f7Rޟ���F#'���,_�*Hp̌���ǆ�����U��-/E[�[:��ՖMǭw��t1�uK\ξq��6;m�s���u��'��Q�d�����QAy�A���I�l�����4�CN����44	,���<!#x���9���x`:���4!��IVN"FmH���*���ߊ׆�w|�m���$A+���hx�dv�rX�>�7q���˖�D}�w4~����x��=��&�Z_
�������Yf7�]C��)v�ӵt�r���Γ���B��z���!�L�#L��Ⱦc��h���s�CvQf�d��c�`kkkͶO̾WR�K���R-J�:�2�xn�x@��@�Ҵ�4��+K���;Kw�w,�=`ur�L��8�l2�!�%�[��Z���غx���c�.�gd����[|BRt7�g�uC3�w��oIx|��B���&�;�``%�;&�g`o�tI�7�<�O�|G�Mvm�H�X��` ����3f1L�V��nM���k���!�]o0�*���/e�A;���SJ/, b��Fm˛��W��+�麁�*=T�1*(��ddm�E@u������+�j��A�Zu��W>�?�z���,@�~UB�Z����	PX�P΋��n*��BB����Ӡ{7)�7�B�P:�{�;i3����Ë�@�R��mw�?uO��ƍ���+���]Y��$M��~m���^��]|�捓IW�u����Ӯ�zZ�����s����e:�DK� � ^沇4�46�ކ=�K�5g��_&�ģ�Z�'悹6��kV�g๨YR��HABa�!��̗�y�o,�ǭUE�W�y�fE��^�1��u��W�x�8_�;�Q���X��r]��H�g���7�|�},�0�>�ڙw��7�a:S�v�Uj�!�J�mç���kLy���Ȯ�g+h	
V="iq/t��{B[��[d��̽���q-�Kz��z�A.{:8+�c��Dlb�4��K�z}�*���s�>j|H}賛yy�B�K�!|�0���k��r� �V����'�H&��U@7���n��)���e�@�Ͷ��D�\��]��ʚgiIE��pb��]�g���J7�������"b�K��p��[������/�{ s�j�PՔy�(r��pj���a�7m��eK(^R+$#-��H\�� 4G�h����t�����ri�Z����4+D����������|;SJo��Ź���DM%�Uy����!.m��� ����& Ns��0�,�K�2<B�x���`��<@v��3G�0�����F�Ɔ��>�1�
k���d{;�q�����䅯y�]���8�`8�9������Q��ݸ����L�/�W���&�<@	���E(���O�����k�#�|����u.Ǉ[���*,���:���%{<��5�6q+NۇB�j�+����r=��'�m�֡�YIM���h�EJ���UGA����e����4�RH�a�ۓ��|��]	�+�7��n6<�T8�i�H��\/%�X�PGN�!8q"E��	����mMaĄ����v�	�0��RyD8 ֧���C�C�~�#�Y�ӂ-�w�`�+jXTm2����GD췟e�>�_	�w8,|$�R\�O18N<��n�2�{�CF5ܸ�u��{���Ǿ1�o��	5
Юl�[,��SH�Q�\l�B��5�K��ݠ�Y*&|���B���K�ad��-E�kP���O�*�t�\&�M�y���e����4;�ڜ��[�j��$��BNq�%�ck�iC�[�5�|����X��켭�c�h��%��>��� ����^JqME��t(�B�N��.�<:��
������o�6 ��Vo_���j�=��*�I���n<�]���V=�;������P6^uU@ؼ�f�!�:�#��C��:+�azJ)%
}Ƿ����
k!c�
�>�g�;�.Y�fZ�H�&�85�d#���l~����˷���	�0����|gV|.f,ZG����`��=F���B�b��qr^[I�]��E�e���[1�^�f���HpA��&9���&��Dn�ٌ\f�q$�&���ׅ�)&��-�8^�Mc�������Q�ЫǾ����dƩ������� ���wVŪ�H��X%%��%Wm@vxg@0Z���颤z�Y�\J�Usr��|�F��Yz���Y��Y?�S�'F\�P�{��nR��m7�J��Ǯ�ż���x���~ȩ���!G7[�!�����j&j��͙�� @�������:�Y0����gn���M�ָ"I��0���|�%&�bm0��h����7�9 �����
�:+�����׏���C�����U�nv��҈X�&��y!�C'����v(FG�����Z�o���ʸ����2��f�H�f�������9�MbD��r@&z0�����1��n�i7Vw��5��o�y>2�
 |v��N�~J�x�ϳv�>"����E�E�|�Ҍ�H��~q�	*]���y1��x�'F[�Sˑ�n�%P��Y{	_����ctu��	.h���@hC���˛��(�0 ���?�k�!��.䨀�q�nR:�H�/ʄ}�奣D="剆�Gy�fĝ�:�R-ΖO��{�������?+��@t<������o=[�~��A�O����+�{{�ȱ����tL
+8Y
?�3f<Y� ����Px,?VS9���~h�A�}�뙲є�5�_�]��� ��	ˤޚ`X��r@VZ(��#V+:���,������Y�/ U
_6m>�b\�DJA^�ߔ@)�
�v�����i��9�I\�f���W;`U��)��5<z_�x�(I�+r(�Ƽ�%˘��P�/ɠ~Ւ>t:߶�L�F��Hd]R��*ϜT���c���5Y���TYհ�j@Pӽl���d<�?c[�	y'
�"T������U��"p�(�+eO���T�%&��hz�\EqH}�6v�l���-z������������#����:���)a�{�����
'F�dխ��"k�3hx5L���{F�qy����ZBp?t����}��e;_��U�v�RǑh�!-�HS��0>��sz��nE�^sZ�+�<|��9��#%�#��/\�Ek ��q�rV�<�11�+9
ЏJ��/�cU���]��D^l�vh�I�Y�XBHhm=)��?��e�X!�]�[��N���f �:�4l��)����L!6"ʦ`M�2����� ~��b��^��<��2J���;
'.��NU�wΕGB{� ���+��Rq!'���͈���〖�H���g�k��"�ۑ�5|�����8(�;��
�h-��
�T1�g� ���m�ږ�lwc���k_��cK�LDo�V�D���=�d/��C���{�W�����a��e�*���U������Ek���a@	�3�-׺D.	�x&�~�u�+!;wt�̸��>�()n��0�L��g+��������C,W�.4m������ӄ,<���}A�β���&�w�s����\����7d��q�ݫ1P�}+�&\w{�"��Ȯ W��£A�в
�YTV���B�Tc��>lm��>�)�jTP�mQQ�0��H[��A`��^�Q�����3�w�F̔��A`yxz�*��-;��} �R'FP���R:!S�<����{;Q��eXN�vQV���QQ�J��@.w[��ևGj�n.�iV}ڼZ�&j`(�nғ�q��m]9��o�J�=\��ԇù��P�m����*��O��#��mn�[��c:|B���ġ���(���jv��(��^V-f��ً�j���h�#~���B�����u�o	���?ƽ����}.r-�f�����d$}�NQ�
�yQ�.��j){�+?�4�n ���׆�	��s��U��=-pr�d 2���3+��"eQ�_D�_���;�H���BZ�cL��
ԡ���X��yʅYq��l��h�=U	o���+5��o,|�ipN���E޶�F��.�����U[3�����_.�����S���FN4��Yִl�af]w7a�|G��̯��xs	�}Ⱥ�H�gZ7 �މ����G��y�)`��\�-�RL��m� v�Z�2ʧ�a��^��*�G�'q�ȂЮ�#v)�Ii��W��#��H��]�;����K����IL�I�3U�4��0ll|t���!�)�1=Q��ZR���
��?��W�j�HL��_��4����������� y
�P���'��?�)��nr/���8���̎�G �U�%۞�{Ց�]@!(�lI{&��������@߹�6���du�
��x��a^-A����[���Ҳ�?�=X1� �Г�v�H*o���fܶ��G��$�t�@����@��);6*�c����M�M`%�Z�Z>"�$�U�m���f�����X��o�e k �h��o���y1�w��<��<�!��C�$�u��zZ�y��H7^��ql���=dhg�pO���`@��]3��շ�a���Q$�N���+kɹ��zf�^�NH����2��O-�J���Cy�y�?�ɀ���:Hi[FieZ�p�Q�V�x�����PfE��#�t���ڡ�p��z��m���4)m*Ó�V8��d�88H+��gO��?�6Y����ey~E��&P]G$��fY����T0������ˊ����C�Ȏ�<��>«�4Į��Td/�j��p�E
���"7��{�����Q��Q����+=Gq#V~eN�%���?��4��E�*�;+���8f���L0sT��T/�~�`���L���(*މdUwRAlc+L&�	�AIC�;GG�^��_RB�yh1)�5!�S�tb�J�^Ȱ ���ǚ�4�B�Pǚl�:��Q��X;�:k�b�~_}�Up�~
�o�H�\�6e]��sh��:�!��s͒�@��* ĠV$TQ�h;CxԖ��`3��o�z���K�+]8RA��0Q�)�O��6"j�"����O��m��ެQά��N�6��S�)7t6=��&�9P��
��WTM�F3�=M�1jn����E�9��5�����5W�
(��͑�5	{�Ю�4����A���h�su����l�8v�T��������w]�����);Ӏ�fas�w�p�M����ţ���>�,g���m�qlH�7� �[H��s��z����~g���ym��ּ̋$��N]x�;��HV��Ĉ˿��#����񹍴t8��ᡃ�ދ�(R��>�n��\�:�P}������;Al��Ŧ��C�o"���71\�����Ϟ'���'�%n�����uRd��r+�y���<�pL[p�󧢅B��潅��A�Zo9�8)U���[��6���E��e2�)U�.K8��T$M��̮u���j}��L���X�,�E�eF#��f��
QrAG��a;�L��dt@cnd�b�`Q�o���߆�/�����#Y���y[)Ǹyƹ��W{-p �{j��_�3_p|�ȹ�^O���=���U�_Q��Z��j&�O��ZG��2���է���gJ�M��DY8���NH�e�q�dW��"���;%�]r�������蠢\��3>����`޼=}}@��^B��4��nI^W� 3*� H[�����/Y�<�]�8�/B�gas���z�)Y2M�Æ	�Sc1���%���T��Wn.i�d����:ô5'H�����*G��{����#�|�d!�Cg0�6���ȸ���@���Y��8e��߽����O�z"��� ��1O�H?W�7�d��{����-�͐'�by��;��	⊦�Sʛ�v��$�ڠ���v�بb�2�x��b��p����Ev~����M����r
�0�@j*��!�'�[^���@��/�ʙhz�9�������'���D�j��U7���r�?�:E��hv�ݲ�A���J�������Z��v��9Z\�I9.B��kK&�\�G{�߷�lN2����R`��r��d�&;�2���/��/�
�n�z� �|Y@ۊ���Z��|⠾Y�&��i�9�N�prg7��w+}�1ly����������>OWu�V�R8%�9���BSG`]��������<6����bMls p�����ߒǱe�2�9EZ�
~E�mm�6� ��?:��M!��=����0/�/�v�1���t��\�ZtF���.��t���'{$���q$D�<��
Z\��QbxHyNȀ��{4�V����]�� ��D �/(\�Q�p gf"\��% �!�F�Ka!�/��Ò��Ǔ6��aܔAE�Wt=~T�%�$��ާ��=�b5�[S� �p�]Z�xp����BM���w!�J�����ʓŬ��V�X{�c7��V5�v�U9w2�I�ҫ�ɦ3v��p�\���y�r��>@�ij��o�n6�o�<����k�1��||�}���>����z�(���p�x�f늖����8��`"Y��
<�j���@z�aM&o���G�l<�[�?{�/���a"{�q$�8|���6�����@B�N�[�6@dw���u}�N;�������nS�a�W��A�� 6���9����,�)���m��������|�/�w��aW����N
�w�F�������S����Ȍ�T��~ջ��/<������ly��cl5:�a|�I����M��O7Mf���Ӛ�8�6�u�ٰ�~�E�4v�ۨ�=�g�W��zp8H忋�*l⨫F� ŋ�8D�U���/So��hq��Q7@�A#�X�6�M�-�㧵����ќgs� (\�X�l��P��\NU9��N���#|��$��5(�ܦ�f