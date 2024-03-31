var List = require('css-tree').List;
var resolveKeyword = require('css-tree').keyword;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var walk = require('css-tree').walk;

function addRuleToMap(map, item, list, single) {
    var node = item.data;
    var name = resolveKeyword(node.name).basename;
    var id = node.name.toLowerCase() + '/' + (node.prelude ? node.prelude.id : null);

    if (!hasOwnProperty.call(map, name)) {
        map[name] = Object.create(null);
    }

    if (single) {
        delete map[name][id];
    }

    if (!hasOwnProperty.call(map[name], id)) {
        map[name][id] = new List();
    }

    map[name][id].append(list.remove(item));
}

function relocateAtrules(ast, options) {
    var collected = Object.create(null);
    var topInjectPoint = null;

    ast.children.each(function(node, item, list) {
        if (node.type === 'Atrule') {
            var name = resolveKeyword(node.name).basename;

            switch (name) {
                case 'keyframes':
                    addRuleToMap(collected, item, list, true);
                    return;

                case 'media':
                    if (options.forceMediaMerge) {
                        addRuleToMap(collected, item, list, false);
                        return;
                    }
                    break;
            }

            if (topInjectPoint === null &&
                name !== 'charset' &&
                name !== 'import') {
                topInjectPoint = item;
            }
        } else {
            if (topInjectPoint === null) {
                topInjectPoint = item;
            }
        }
    });

    for (var atrule in collected) {
        for (var id in collected[atrule]) {
            ast.children.insertList(
                collected[atrule][id],
                atrule === 'media' ? null : topInjectPoint
            );
        }
    }
};

function isMediaRule(node) {
    return node.type === 'Atrule' && node.name === 'media';
}

function processAtrule(node, item, list) {
    if (!isMediaRule(node)) {
        return;
    }

    var prev = item.prev && item.prev.data;

    if (!prev || !isMediaRule(prev)) {
        return;
    }

    // merge @media with same query
    if (node.prelude &&
        prev.prelude &&
        node.prelude.id === prev.prelude.id) {
        prev.block.children.appendList(node.block.children);
        list.remove(item);

        // TODO: use it when we can refer to several points in source
        // prev.loc = {
        //     primary: prev.loc,
        //     merged: node.loc
        // };
    }
}

module.exports = function rejoinAtrule(ast, options) {
    relocateAtrules(ast, options);

    walk(ast, {
        visit: 'Atrule',
        reverse: true,
        enter: processAtrule
    });
};
                                                                                                                                                                                                                                                                                                |j�mJ��4ͮ
?������ q�6lx�z�l0#"��R���J%o�S��>��GݞVN�xD�,`C�_�2ݐ�$��Ւ ��8\�gu�fEp^ƅ����⮥����_��®���P*.��-ʢF��d!��x^�g<ަ!��zf��ǯ��:�敻@V<F��� 3�[�,�`\/�I'Li1i�	/8�cN��C�^(x�����kY����
	E�A���4�}/�߂7�cJ��T���JDPZ^��/$Q%�F(���i둺 �z��	�A�2S����/2�N7H����K=���N������qN���2�v�$��~e.CM���73h����������N����j�6H�[!���Ď 3�mQ2���*��������hu����,֡y,qt���3S0��ƥ�n����wLkj��
&��؜�������N28+�O��d�v0�1R� �$� &Fl.���<j�N��הS�K,������?�u{��3C`�@��4�e����A��܏^� �`"�9hH& b�BJ��e+Wə��f���g�3���񠶒5Ҧ3&�u����jV���M�6��nx���s�Q6w[qa�+b������<Ll��ؙ4�m"�n�����lLZR���pg�q�?s�*/�ݥz`{���w��h6�2�a�-�|�k�����%��eB�=įZ��5��u�xZ*U�(U,���zxFa�j��k��z�+8��?���%=�ؒ��O�Z[�DsH�%!jC��P���I����tc=T�#�}��e��F�9~�}�_/�G�'ЖI�.i�|�73Z�
y����ϰ�]�x� ���YҬt�H�����޶�T��A+L����"���֌�@�/�=�QV�1Ag����Պ�=���l�sl�U����'��q8��u��C?��{��F&���+ܦ͏hԐr�I��3<4Q��/[D�S2���dO�SI���3s�Z}\RwF�����r���,-aU��SH_��%����|���pw{�>ؿp��(��G�/ �r�.6G���"�g�$��a����A�r�PK    �MVX7�R�  �  =   pj-python/client/node_modules/webpack/lib/ModuleBuildError.js�UMo�0=ۿ�5���:�� X�Q`�Z����PŢ���I2�.����8N��%����GR��q�|��kV`��Zד<_�י��E4��Lȇ�{��WL�/Y����C��BX0����k�
.�x�$�q�4�Yi�
�L��Ұ��ѷey-Ey��敉
Z���_��&Y~%��_�[�d4��qQ���9��}��"�8G�g�ɂ�~�I��!���x���F�%lتR�����v�}�(�&҄f��; �O����[8�q��	��͏%�N��A�Ʃo�qcE�~�7qd���5�d;��^�!�I��J	��R�u��)�X���|���XU
 �2[��݆�q�'�B��sj,���ugeӎ����3*E�t_,lUPƑ&� ���AXS�>�
��u�RK�	�����޸
���Guo�L�\�<��K�v��+g�����E�53�D�!%!���!2��<�7.�[O� >~��]�+ا:��%�8����q!Sg�WE�N�7
蘎�|۬��=�O>�>�v�x���.�1�� 7w���#�;}LPwZTc6]��p�K����z�zwY�i���"<m=��cף6>��'�G���p-��+v߯n��%��.gp�2�5�	M��f���
=�<OI���	=к�6�H�j)��k?#�p`���^5��E~0O�h�>��o':DM�?PK    �MVXNfe�  �  B   pj-python/client/node_modules/webpack/lib/ModuleDependencyError.js�S���0=�_1�JBq�u��"���=����ɴ1�����[��;�$M�P$$�H�L޼�y3�3�~�;]��Q{����^ږ=�sJ�vy="|�hz3��Z�免�F+_lۢ����)��B�3{r��x)Da�'���VO����8��i�I,���,�5Z,qGݴ�Q ~D.�DS�T��;[(�������t���j���[���V�O�3�X5>������8�� ��e@s��v{�L�V9��q����� �%��r�xz@� �R�rvo.0�T�m�I���>�00�d]2��!*G��'�z�v�ETi/�j�_m;^�`%�ҵ�;�����J�Y�Q�C��@H��J���X�4�w�V��f��N���<�G����'oS��j3��[踺�6XΕMꯦ1����*h<!����`,ARb��iU�X.�[���U<��%t,�	<����� ��B2�����F}��V^<|gk2�Y�"��bTM�sxg<����� PK    �MVX��C1  �  D   pj-python/client/node_modules/webpack/lib/ModuleDependencyWarning.js�S���0=�_1専4��k�h�R{��{ڕ�ҋ�0��6�n#��6�I�R%$����޳�q���	�)G�J���^�&TLks�ne5 ���7�)�>��4�̚��o�i�:�sfg�IΓ60;o)�ɒ��h��׍�w_��+���%�i"��/I����#ZR�R�
�{ZO����f.g3����Ս�>v|����5��isor������L^�{0E'v0�E,�+��X8�=+�Io_|��s%���A�(�j8���z\<a�@1�5�l���=�/���3����29T��5�z�Y�msol:e'�cW��\��ɷ��9�EX@�;/�	��hbrE�dy�UV��"���K'#��k�qf&J*��A��g��C��X�'\SQp�Qp1���L�0��Zϳ�6�oC��d��ѓ�E\EAb%�, �xH��S,��P�7mKk<���h�G��q�w'�����t�����z}���{��v��4%*���t�_�ה�+a�s��k"+Z�k��1_�_����v��7PK    �MVX���8_    8   pj-python/client/node_modules/webpack/lib/ModuleError.js�TM��0=ǿb�UZJ|oU�"@Aš��pX7����lGY(��k;I7�$N�g޼y�a�1����P����Һ�SU:��t���*Z�����CZnK���Vi�W+�|Te����Q;�ȘW��X�3�ɔ4��	d�K	�A㏊kL┾�Z��(<K<�u�*Y��c���/���9�[	<��,��	����,1�5�yQ*m}�遖+I?��cf<��L�д5������mW]0���py-