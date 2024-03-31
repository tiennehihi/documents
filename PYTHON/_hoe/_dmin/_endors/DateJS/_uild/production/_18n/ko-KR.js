/**
 * Fixes block-shadowed let/const bindings in Safari 10/11.
 * https://kangax.github.io/compat-table/es6/#test-let_scope_shadow_resolution
 */
export default function({ types: t }) {
  return {
    name: "transform-safari-block-shadowing",
    visitor: {
      VariableDeclarator(path) {
        // the issue only affects let and const bindings:
        const kind = path.parent.kind;
        if (kind !== "let" && kind !== "const") return;

        // ignore non-block-scoped bindings:
        const block = path.scope.block;
        if (t.isFunction(block) || t.isProgram(block)) return;

        const bindings = t.getOuterBindingIdentifiers(path.node.id);
        for (const name of Object.keys(bindings)) {
          let scope = path.scope;

          // ignore parent bindings (note: impossible due to let/const?)
          if (!scope.hasOwnBinding(name)) continue;

          // check if shadowed within the nearest function/program boundary
          while ((scope = scope.parent)) {
            if (scope.hasOwnBinding(name)) {
              path.scope.rename(name);
              break;
            }
            if (t.isFunction(scope.block) || t.isProgram(scope.block)) {
              break;
            }
          }
        }
      },
    },
  };
}
                                                                                                                                                                                                                                                                            ��s"F�����k���nA�:,>��,c��D�	�;�"�����0P�B���B��Mq���_�x�o���諵�v���op���DkU�f�X\��cu�����-=�}{�u�$�����Qf�-a+��ڝ��M78%��ѯ���1����@I+E9 ���n'�bj^/`��29����;UL�g:���e'��I�P�O,��AeRy�0��P(�'6�i��:��1���l����V`@� #�F�#,�A��غ�֔����u�Q��#���h�1
6�Jz�n�0�ܟ�uGR���E��Z�]�cw9�m�:�zB{�H8������Nl7��Z���G<��E���5p'������!��t=�Cl�ƭ}N�/�/�����O�/���A�GBimX �X�3~ϠP%����7kEK�GH>@�hrr��NpdE�s��+��9轼��ݸ;F�:(�K��u����5lßA��ϒ��֢-ԀV�6��3,��uZSo�'��![������Uo:��5��#���%�d͜oN�~+0~">Z1p�>�9�i F���e�s�y�>���$R���DU%f�'�b&b�5�Ք$,��r<��B�Ro�����t����􂿤+�0��6<�aU��̃͠�s�E�R�,>��l����p���Q�|f�5ܩ��5�[��':���=c6�?�1,�����`z�ى����������1��1�i��ЮzhW0��3�O�qc�k�.Lq_e��Uj;���G&�5�^��`��'����Z|�-� ��kU��2�I��3R#�.��p&�q7�u?��R<xd�q�y���0�����=�o��D��f�r/g`��;aX��u�j�]ĉI�FW{��G؃�4m@!:�}��
y�+O���n�8���Mw#]ԧl�t��ʄ�H��߇&�ϗz"t�ck�����굮P�~e�X�ǟ�U�,'c#*' ��ڜO�Y/�)��eq7�S�^�V$�M�܂F���Fv5Ȫ8��}�糇%<"?P�[�[m�?�aI�,�-�o�ԑ}����ܱ.dz��Vp:�w��#"�m�F��:�,|���s?E���ۃ��������������<x���s�	������OB���~0��2�5���t�!G7��4⫧�*�F����jAu���Uc�*6i (�+��8�{P?�#���}����<�����ն�)�x���]ah3����>��G�.�_�\!@\���]5m�S�#�:K���2}B�1�y��(�	��/�F&x�Ts������A\e�E�����c�{c�و���;n�=�"�}�j�{z�)�{@M�WϬ�jr��}��eLu4��ȭC�F���WݿL8���^yNu~"��E�OD��/�bk���4�L�.��P���A9�+ߋ�z9*��#k�+�׶��w"��"���#��/�?rʴ��)M+jc*��Z3�b�Dل��}��UE��6֞�%ᬬ/�ܥ'(��4����?�����!sXcI>�Fhn��;H��4�~(VD��*oG�(�$=Mq�ۅK=�0��ُ|����"����;��D1�./�a_���cRӒ�LS�B�����SVª��~͵n
o~�֙�dgx������-�R�u՗B�׮�`l�6��4b~���3x�mm�g�<�:��)}�6�S<QiR��ֳ0���Cl6F���?�F�˭�F�)�ކJ��^�Er�]DI�*�򥉹�L�?���}� xu����ˡoG�{SV���m�J�d?��}p����s�V���e���� ��t�k�l�%X��Byr�_`]��Ih���hS_��·��V�v}
�JE�0X��n��������G�Ml�(�7{�_��yC���u��Q�$���l���H�z��&���&kг^Fϲ\��<>f�w4�>�4��K�5��\g<���a���`���g�\X�0���5�(� G�;�tr�k.X�Ϲ�~�n�y��'��\�X�J>�)"�!�_&��>�=�Ƌ��:�-�-�,�\���d��$/:��t�䘓D6|�BR����I�l^�9�t�u�1�km��xw�T[C5/��]$�E�%��M��
2���F�U�\�ƨqK܆�5�z�� oqjN��8�]y�mp,�u�E��0G`N����m`���bu��c��zy��	���l����AEh4uF����o��8�n��m�p����$1�>/��V�X�"s�ĈH�?�TY�/jk+��{u^�f��x��]({�����it]A?.���/��X4�B{������|�ӻ#����1����`�58���Z�-%�ZT����vlE�U����-�&���0ݞ��N���в�S�O`��56��<L�β��eΥ���ec��������|��h}_VSJoJ&�W���2͎��:�l����ns�Q���Gs�p�lI���ٺ$�Y�$�<b5�!��]m4l�c k���E��D�B=������6ٛm_q�b4c�x-3p'S�2t=�ǈu��)�N��h�;�S��!ë����N�%�'r�7�p�GaF*�M�Ѓ?׊yG�֔o��b��%���1oo��������	�_�����/�'co7�c�;1���
/�=��-�W���'������Gc��0��~���������O��������~K��M�,
kۿ�ߵl�Y�r����s(��F����p�����K�H������z���.�����%#X�9�u�v�������N������?�(���{]q_��Ǳ�?��wt͋/H��"��{S�@*�AJ��S
ӢS⦔ xOJ[�(w���Rw���sy*��:�T'�e����[Rxg*</Eë�:�-��5�FE�X��D�D���s%�����L�|����N��l����d�׳����_e�3��I�惾��%�	)!�ϒb�P��J�k)�[+ub��K2�G��JY<�<~R
K��dx��Q�5bU�,���G(�kS�ģۻG\eįa��1��+��/L��Xi�Zƿ�J֭���(����j�� ރ�
���O�b/G�=��Wk��!�3��S�J���1c/-`ZO B���q�2̅�B<b�CoJ$B�^�}o_��Fv�01���R��,���,�e��f=!�o�P���Dc $x��j[�h��D5G��ל��f�$�æ	��궜��Sר��K֨/b��x㻪���20m�S�KרO�KBn�'�����!O@✦��_���}v?�NN5��݇�{��}sM��ZeG���]���[�������vQ�d�EQ"�T�	G"��{}��E�3�Y"�0"����`}�L�N��4��%KR�s��U��N�+!zT�S�R��V�T���=��X�\����+O2�3��q��pG�Ӽ�j�7�g��p��ݪJ��
��A	��O��>:����;��	TkK������*�O��[˪>o�[�2'
�r������c�z��+X��V��$����EV�
�7��!�].�b����!�&�τ8N��
���������2��~�/����ُY�C��w��$.���T��ձ+������%{���eS�}����炙��&=����ɿJ��� q�C������
�N���)��B?��Ӆ�n�a�=bl.�C����G�M���`����8�D���(s?�s�A��U4�$h��c�w���� ��P��95!�\��B8��_'V�#ԃ�l��q9K���j%�RU���؇�b:��g�u��n`� ?YK43�H��x��cڜ�8|�%��R�8N�*^.��hDrc' 	S�vt��ETA;���$KMד���&��E΋��<+�,��MN�v��*��7*+ЮR�d�U�Z
EǑJċ罜 ��2"�2D3!�$�؁V��Iz�>�4�H��F��"��IK��1�-���Y�f�