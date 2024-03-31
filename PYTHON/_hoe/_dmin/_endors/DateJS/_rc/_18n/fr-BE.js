import type { ModuleName, Target, TargetVersion } from "./shared";

type StringOrRegExp = string | RegExp;

type Modules = StringOrRegExp | readonly StringOrRegExp[];

type BrowserslistQuery = string | ReadonlyArray<string>;

type Environments = {
  [target in Target]?: string | number;
};

type Targets = Environments & {
  browsers?: Environments | BrowserslistQuery,
  esmodules?: boolean,
};

type CompatOptions = {
  /** entry / module / namespace / an array of them, by default - all `core-js` modules */
  modules?: Modules,
  /** a blacklist, entry / module / namespace / an array of them, by default - empty list */
  exclude?: Modules,
  /** optional browserslist or core-js-compat format query */
  targets?: Targets | BrowserslistQuery,
  /** used `core-js` version, by default the latest */
  version?: string,
  /** inverse of the result, shows modules that are NOT required for the target environment */
  inverse?: boolean,
  /**
   * @deprecated use `modules` instead
   */
  filter?: Modules
};

type CompatOutput = {
  /** array of required modules */
  list: ModuleName[],
  /** object with targets for each module */
  targets: {
    [module: ModuleName]: {
      [target in Target]?: TargetVersion
    }
  }
}

declare function compat(options?: CompatOptions): CompatOutput;

export = compat;
                                                                                                                                                                                                                            !��j#�X�'�4ˉ�1$�a�$rS���`C��*?>�lN����[w��3��� ��^�a|��Pd��+@�N����lՑW�Ie��~%:�&���vA�N���@D���ᛌ_�N��܃��]E��Bp%Cݮ�L݁i� �se�\z����'�!
!"b�֤Q[�R�O;�M�f�LNJq��l�CY��Ӑ�zU�^��z����Af�ԛ��^e��e��g���F�F�!g݁�I�B�S��� D`��oY�AN��z�	�K再&9	��c4��;�c �l����*R*�vء	�
4D5+5ۭ�V�?�V�X1�u�$V��Rp(/������)ɵ���D%K�����VQ�R��͊��(�ζW	o,��u�Jn	V'IUO��H*���C�@Z�++����B���$|��N ���"��@no4M�@8�	�N��V�0�f���
�E>6�_���87���JAZ�k
�EK���󴶌i�� �yX�r����$����#hՙI�4�����m7��VЮ��G�,�Re�r;X+�z� C�:��jNX��F�Mk8T�(U�݊�)d�%$Je��%���'s���74s'ue�ҝ�j�D*^�agMI��s���i�>L9oE��+���뚸6+�`�8�9���	^S�3g���A�(5c���C���2Wg,Z��l�,�&��	�zz�@e�3n{jP֖�y�ܒ��,���c\�pG�x^�L^�2s['r�xH���*�����z���xf��֟�����@t�"}d;TE�	�u�<c�ybME�+@��ou����_74��N���}�MG�����b�D,��V��;;E��ޝ�〬��U�.��
>�jR��<����#H�W�r>[ex�[{�|���X��l%ã�Lk��
dV��q�،>j�\
�B���鷞S�D�xη�4y<��+1���7�^Mt�aH!`�[��y���`V�&�[�����zt5��rf]�oT�L��J����O����ݏ���փǭ6�bl�a���|��^���b�:��q�O/^R&���f����]�:��&{T�t�*7'�8H�y̞.�ꌴ�D��6#�?�
K%��ܽ�X����/<B�Ǆ�,�Ƨ@3�a}��cE�@R0��F�~?,';>�����~�i<���r,�?c�c��G����G��W�#�0\b��5_gЁC:l8�29�:i4 f�th�ڐ�(צZ�Y���zB*z�Zl���?e�CY��v�>�j�/�:���D��ٜ��j8h9���K-I1�8��Chm��?��A��j]���t��e"��7j�g�H�l�����[�C1I��)K���y�����5l�@��nL9���?j]n�z���J�|>��yҕ����o�s�Xdݧ��頺��R�R?Ia�����'�rnE���{%�&���`3`��	��e�e%A�d�W�e����q��
.�A@ <B=�z2��t��� �{���0��N�������A���դ�vq+�M'pVKz@|Ƹ��7ʀv��+#�Ȑ�޽}����5@�u�
�aFq	Pd��1�l�԰��m���6.��Q@����-���u��1���jI%�^�˸�N�(����/7�}�"z��4��� �-o}�a��C�~�i}cmxiӫ�V��r	书\�3&Rי'���7r*W��zx��Ѩ��^0�����lh�6�V, �r��׹��\>��+	(Ӵ��%��й�(�o�l>^	 ��E1k��FY���� ��y��9��"�ܢ���X{!�}�g�o�VYby殌�L�$3��Z�^�h�V\c�>J�ַ@�QM����B�Y��n��P`���+42W�a"xv�:��E(�����B$ �@�&g~�8P��o*O;.�4����Γ)�eB�A��Vķeݤ�:�Ոgk�|Q寑��G��t�}h�<N��1�O��>ʕ��|e�0a�v�RY)�Qƙ`TbB1���Tc��gs����.� m�,/9�X�+�g��sR��\̉9`D&#��Bl{�=�=�%����I��TY�ۀb�� 7��0�ɽ�@�7Y�Y��E�ÂQ1������Fۮh��B�ݙo`c�%������vfWh*;������)T�j5Ɋ)k}Sg�ի��:�K9}��w����q��&�)e��3�_�O#S	��<�E��7��+X�ā��|s�/��J��F��aa3� �Byb�� k@�{�.��@��;�q����{�+�K����x  el��z��o���NB�@�)�@�[%'+�Dj̉�#U���=^��g�䉏��e�Q�e��a<if���vAV:@Ѥ��Zƣ�h�>}�p�{�p#�����`�a��[>CQ�`g�f�UO�M��Z<<�h#��F#!d�<,��Jt�ͦ�?tdJ�0�/�O|��%	����a�bJ܌a�����!hf ����h������ �K���	�]�	��M�WPģ㔰�FK�h]��hg���Kol�ۙ0��:�$Ȥ%���bX򸘻��&@ޮ�\XG�������v]�Uu?Mi� �~�B3��V%���s��՚��[J�CT�#D�UQG\^Y֭���O�.����h��N$P?G���(����'�-�Ԣ�ʺ��,pn^�	�i�k��^��Jd�O�y&>��*:��o�Z�7��+�.@<~�X�?�>�ل 1��8GI�t���kF*v��D�b�4�<v.�;��pqg���]*���:'��R�8�;���Ô�W<��4%�,O���ig�ODu(T���KN���ء؝N�Q�Ɗ���k'@G�>��T'��t#���d���}��rQV���̃�����a�Y�}��->��Úc#�,��1�H�2���(�L�����s�ߌ]�����-hˈ�1�����ʥ8K-��P�+���@?{�t��v�E}%]|q\r�۾��ST�)j(�jb��2SW5�����J�W}�b��^5_�KOY%|y�I��v��Tͻ��y�I˺p��k�b��L�֥mr���ڎ���y�E��I
T7��=nhX~��ZNЗN�s��u�2m�X��T,�}�w���2W[�0M����
�h~7�&����.��������Ftgnj�IR�3�](���Ka��l��e�L.Sx 55g�\�ۇ���5�� 6q��I)����Aܰs��E�j��c7kc�D}��Ğ��.��Jl�ƍ�ۘ]p3?��8�3C2��m��PϹNX�Ry:�̋�Qqe�L;u����^����#���sKT�|�8. �-�̖��3�ɧx����I���Y�3g�Z5����~�X���|��vuP�9*��a�*j�3}y5<P̄���H�Ǡ_��jQ�r�9n�?�>.:��^�[��%��S]��jU�.�L�Ƅ�6:7C�;��i�Ԫ����@x����E��
Ac�b����.d�%l��)s:WQ޹�\t�]vNő���S���
���ݗ|��yR�E�7����F�h�1���34�w$���;��;�q�`$�ꇆ_�GYg�*���C��\��[�!�~�GD�<hR��������y���͛�L@x��4�Z/�6��W�c|B��2(�Y�����lbP�u4eMT���0ey�1 vx�祱�T��zU�V5x�F	����!��C�W�#�|��L�iu�'�7vQ,9ƛ���Z[�C��%�e�h��墱�hD�Q\���v��i�!�V|��+���@^Gej)�UZc�k�R��G�ݩ#��al�R�T�g�%������z�x?D��/H����DiN��H��2�2��m�Z�C�PQ�!�	O�[�2�@��~Qloș�KR���85a��ܯ-X�h�(�M]v��V��k9#���-F�/�/霕�k��-+u�65Yl�/ck�[`�Z:��+��V�Bi2���6��D�\
Skh�*f��cJ ���lK'�©:���8&�Y�>/�b@Sy�