"use strict";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maximumSizeTransform = void 0;
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
function maximumSizeTransform(maximumFileSizeToCacheInBytes) {
    return (originalManifest) => {
        const warnings = [];
        const manifest = originalManifest.filter((entry) => {
            if (entry.size <= maximumFileSizeToCacheInBytes) {
                return true;
            }
            warnings.push(`${entry.url} is ${(0, pretty_bytes_1.default)(entry.size)}, and won't ` +
                `be precached. Configure maximumFileSizeToCacheInBytes to change ` +
                `this limit.`);
            return false;
        });
        return { manifest, warnings };
    };
}
exports.maximumSizeTransform = maximumSizeTransform;
                                                                                                                                                                                                                                                                                                                                                                                              ����Vb��xk"nJ�Q�~8 �ʃS����Tt1/v�h�8e)�ZQ�r�au��2^�8I\���Zu~���n�F�p}Dtdh���r��=��E��zi���'6?k��6���F��@��Ĕ~^gR�� ��k��(1�Y����0]�ѩ�/�(O�p[6�~x�l8��QK��2�{GW�8%(�����9;̰C\W�6�x'�j�%�-��p�"\�/�m�m�ΞO�l�Y��{����:B.,~�@�O�|@&��T=��D�z?�^`&��֦A#$�fk!����6،^��|3[��=҆kL�C~L4���z1�bS�Oz��=�
�`�?>g��̡T�I��3���5��A���U�8��h�4�4d��G��b��L/��)+��J�$GC5���E��F�#M�܁ �¾-�*�=��2�G��+R& 4m/���?Sv�X��7�WQ6�O-��u܌Q��"�dz��惴މ���XE�`1X���������t���<��x����Q�J��8R#�k���H�ZEUI:�@F!R�݆��Ŏ����-��f-����C�`��^?]��\���^B�Θ�Mf�f-�ĸ%o�^(����H�̀�+"����-H]>R/���k��p�|JtQ����^��[�0&w�Le)0m
���2O��'�'�;��s��Y���!���`�?׋C��޴]͕E��5H�2�Vn�}-JN���^��T�Z�!�B�>ߢ�;���c��D�|[ޖNs�+�e���Gu%���s&�迄}`M�ZcC�IP���2�ZaK;	��x�����D߬�� �#B��
I�+%�],̵yd�2���"i����!��xB9O�\�~��i��e-��+[��س��w0ˣҕZ����)��&I�T��[7��%<�X���H��RN��[�iFw���n�@8��1������p�� �':������I���/7}bF��W�9�|V��|o��<���/x�m���:	������=�}z5�#i��jh6E��D��
/��R4�U�FYє���i;Q1���Q�}���1h@�%�_�;�;O�	hp�2���?�ֱ`�@��(�ߎ6��´��
o&OҪ���٪;bNB1��fb��tE�'x۠Q�O�Yrh���ũ1�� �K��ӫ�{j�k�"Z���J���-?�b4!�x@�`�q�l �lc
�k�TM���T/�*����<��n ��4d���ǹ=ݒ�i�A"�i�,^����lD��O۸���X�pY��y�K��@E�����3xV��+ �����SȊ́�Yͱ(���u��M7z�/b��+j�X�&��J˔:�|��4+�E~ͺt�WTb�$�`@-�dq�u��Zn]iEM��	�3L����8�C�E�ކuM9���ѦXЛL=��Ϥv��M3v_+_<?eet}���@�^�=(����Y���7��9�_I��N[�v��P⣲�@&t?��Ac	��
V��Ⱦ��kWk	^+�b�"�@a/滽�BIs���b��3���~�
�IH�iVM�@L�Z�De[�8y����C3㔇%��s��S��/]������5Yy`���ðwئ��HxO!bp8nm9n�������Ț��|?^/yP���������_v��7��>�҈��J�]!� �#��o+�*��d�e�T��$�!�Y��5�#~X,��ׁ����8U
�!�[��2	��$����`Q	ٴ������9O�v�{V��]\ƚі���_�&Ϩ�q�R67Jp��E�T���ط�=2C��S�񒰯��6��y��#���oM.B�M8���3-���bm�}خf�f�N�v1@{��MK��Xv�u_9�3������s�V�Y����%6+�L�8��C�N��eF��xђ�7����ނ���3-M��&�v�b�df�Ṣ�N.N�z�q�p,[������I��LfUGl�����G�˃+��L�3Xi�ްCr����B?w%��=L��c��Qg5D�*��/;I��� �sT���U���c֩F��]>�}��U�=��O�,L�_��`������R�z��{�S�d�MSo�����#�v'Y�	3��l�L�Wo���v���2���i�!��m���2�U�f�r+�pa(��V���L�ݳ�6�O1�$�����a~����:X��z@�|�m��8�(�BC�ʘ
P���X#ெ��(��V��1�g
*Y��㤞���U�CQ�'+q���#$ZU��QP������MZL}��٧� ����Us��tY�/�����L�-���}ﵲ�TZ�Ԁ$���Y�a1xo.�U:���0��@%��Zާ�Z=j��1�da��|�^��+��Xz��1�4U h���صU�ށ�[�چ�^M*%
S衠�5���c��ر(�*�����n�}���A`h�L��ӄۥ2�sp������kV�Ҹ����6_wEX�������t�_�Y�x3"����s�~�AWt.�� p� \��E���|r�U�t��Lk/�G�~�C��p+��\��a/xƶ3��ۮ��%�T
�6��}qM��݄���o1�ρR��:���>��j����Í��F��� � ��s�x���5�k�&���d�s�G��	~ɎMV�͌ƒ�\z�>�<2s�5�x|���ub�>��>'�=�/�.�����$�N�=����͜�W�S>M������wb���{��ő�w����#�֍�zʄ��@�sm��\���T�,q�$l��;5�7J��d���],|��c�qF�����Y��w�j�n��Ŀ�1+��J��6w�)~W�5��+rS#m(_)7�5�9��ǆ�:�ӿPRnnS�0��y28���L�9#;��8���2�C��򏢓��l7e�Q��%t�H�n(���6�<�y����mǔr����1��	P-�MD�ݾR"��O�4�zaX��`�Ja�{S���_��f�&�&�+X��`��D����ܺ"s;,Z���n��=u<
�{~�l�K�K��l�x�u�fڛ��ޤ�Q�Ah��N��n��d��l��u'�K�O�Zi[�˻��H㤴q�cٖ̾R.��]^_�
q�V�/���3pa��57��AGU�	]�r�GjLz�q9�㶘�� 9��ٮ~�0�奢W��J�'��>�}����xI����(�(�$n=�z�l+��PL�@��W�_v�9�q�����<4}->~K%�,��1�8�� ����'��r�p����j���+Ē[[h�#�z�й�',Y��f�Cȭ��{Rv�����R�@_N�$�J�����6ֿ�+��:���@�l[~�I�x�r)1	�L5a�3^y�n夈�.ʄ�]g����ޗ{�o�S�N���]�uB~�CW1#���%1�u�IMݱ����?}�V��s������
R��A��L5����:����Sѧ!����|�a������l��%ޘ��4^
��T
���B�+�Z{b�Htj-�k,�%V�F�sL��=�1b�m?�T��y�"��.���8��J-Hxs��@f�5�ڄf���!$���?�� �A{#���r{.��SLw�_���S��dN�6�OVg���q|��e�ڭ�R� ���?]N}P�/�*�ג*�jm~AAqLʅ����'�ٲD�W���-�mO�W@����k<�;Y����1E�
Z������t�˂�O�+~p�H�t�e|�a��fY����k�dv
na�kx/c���x��a'h�,cw700@���2�����kű������>�����o�N蟘tdȱ�缡;�ӯ��fH�&A��W�"�[H{��A�J�V��(�2�お|��w�}�M���iJ�|�8`#��eL��\��pK*����<�̳6�=x���7L�q ��~�R�l�ŴA�.p�A��Ɲ;�5n#[[���B�S�p�s��.O�H�я?�Zη