/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import '../_version.js';
/**
 * A plugin, designed to be used with PrecacheController, to determine the
 * of assets that were updated (or not updated) during the install event.
 *
 * @private
 */
class PrecacheInstallReportPlugin {
    constructor() {
        this.updatedURLs = [];
        this.notUpdatedURLs = [];
        this.handlerWillStart = async ({ request, state, }) => {
            // TODO: `state` should never be undefined...
            if (state) {
                state.originalRequest = request;
            }
        };
        this.cachedResponseWillBeUsed = async ({ event, state, cachedResponse, }) => {
            if (event.type === 'install') {
                if (state &&
                    state.originalRequest &&
                    state.originalRequest instanceof Request) {
                    // TODO: `state` should never be undefined...
                    const url = state.originalRequest.url;
                    if (cachedResponse) {
                        this.notUpdatedURLs.push(url);
                    }
                    else {
                        this.updatedURLs.push(url);
                    }
                }
            }
            return cachedResponse;
        };
    }
}
export { PrecacheInstallReportPlugin };
                                                                          �aC��g��P�K_Ǜ�A�j�-��s�a��J�N��>�֒���ȴ��X����Y�Tc�.��d	��)O��8k��!�^;�����i�@-� ӗ�c��
����O)4�A<�Y|-7��=5 �s�]u��G �&��ɫ��+�W�*5bn�m� ��ͿΞ��\eaD:�`���@CEY�=��,��h�T��{�o��L4��W�������y��O���h�}����(n���:�XH��!�t(�>�67��7��{�V(ad[s�1��'"l$��b������d�+��`�ͭ4r�4�+�K�=g5�u�wR��
Y^��ϭԱ6��?JJԅ�<���(�E��F)�{��Dia_���Q��!�K�(�-�W,�<�[@�j܌��oM��R�����|+�������FD���֯k3�Gb���'����_��j������I���}:V+��{t`��yTL�cƨ
��1'�w�G���-_P�)9�.*!��u����>�h�2���󍸉Zo���vi�=br�(vJ�d�"�l��!¯���̦3OC�u�%7���� iԜ�]��$�aEq��������<��S}�dL�TW���ۂ�M`��|"�Ow��ݫa���x�0���<��� �]�w]U[���&��[9��Bth Z���})�Ē���.7r�\�ja��[�NY�?��e2���I���CN�^���; wT�.�+ E>¬0���W�Iz,�cC��/���Q�o��*�>���m��8A���gd��\���!6��:��sG�:!�� &��ŌWT���6f�,�7�.�5}:�;�a|�S�׏�6u:Ǥr�<��I�N��A�&zsT�ǌtUK��3�Jzӿ�����x�����j��)�!���k���lxu@�شno��;�<����C�
-|.�#2/��HLA)��wu���(���˗=�6�j��x�#݈6��-���[�y�Sg�U��I���
'r@J� ��}�_�;l�zH�/�w=H2�d�1�Ϋ2Y�o�J|7
u�Ѱ;%v�Ё��٬����������wmm��ܳ\���/�S)!��\3ζNT� �4�����L���Q���#:g޷�6rS�B��z$��-MвK��~�_�uG���9|%��f�6�R9 y�~�}��Y�A��ϝ�:0X����͒� �H��yP������7שα-L+n��a�ί5�f����5\����^�U	:O�[��T}6��խ�6�^�GK��]���ķ��h���I��լ�zC/��ns~E��A�_ {w&�8#NZe��)��@GW��ho��ҿU;�@�=���nikQ�d%�]�6u挞(H�l��5�ȏ�7��Z� Q���������QR�m�����G8������1>��vŞ��Mgz|�y����3�5@�����1^kA\$I�$���mF:��13�	�c�H�0H��l6&ȨI>>,���z�.��D�b�T�����u�5k^�ܓ�nnj!ƚ SE�*}�qx1����vD/g؜��jq6Cd��aG�(a�����s5�)<�U������O�B\Z�9�b�A�+���M'/'H7UN�}�)in� !7,E��U�C�F����xz�g ����N�D���.�r7H�����P�����휲�1�$�?�O"`�J��"-�#m� [��3��ڧe�+vF��>%�B��D>��d5^w���Msi�ʔ��U¢G}G ��*a�E%3��8don4��:4���g��V�=(�5�a�Ob������g`�
��9)���Tr52L��&B!5T�ۣ��B0��\ �(u�>�h��H�ɖ+��lf��N=�_��?LajL�b� ����^�ό������q
� ���4#`:M>̭g��2Y{�N��F���ڞAB��RJۘ�&���F�V^���|A�{2����w^�Q�W(��O��$�y4�k��mi[JOx�~�(�2-�1���+�B4��Gk�P[�g�d���<����2<�S�
;C���ߛ�� ���+h���x_��3��b����Qp�!ӫ��Β!�~]u�o�ـ��	�d*���;��d�_i23fr}���cEA.F�ށ�c�ԇ�k��o��P��^�\O,u�
̠����l5��Ǚ��2HƑ�5�Z~�~X>f2�d�m#;b-��^�����J������(�t��Ä촏ͪ�ޫ���XU/�4&�ˎ��{q���얳���R�?����m��#&.1�)�!r��b�^eFj�د�6Ro5��Y��!P�@�J�p�4�X�%�K��w��5�G�\OB�,��rI����ˁ�:~�zb���^��qg{�^�?7~X��с����>��0|�A���}���T|�V��s��L>���$tR�x+%!t��%w�]n5Q��_$�w�����T�=�]X�x�ϲ�}�70�>K�fg=r(S;���y3��U�P���b�T�|KH�*�5�U�$�?n�ՙׯ��=�A�H�,��o�h	86�](���N�9�>s��}�l>�P`H�m�w2��rb~��4r ��@EO��N��@���wBJ�P�!�Ŵ�/�2;	�Jg�v�.!���h�mV��6*�\D����PB�&�duu�=��t0����AXN�x��A�LW @;��r;�}F*�j/�D��F��_�L/	�S�v)��+0�we�bYU�Z�&�����4N�?�kAH�Ej�%&Ü����&��T!�&l	�ӡ-VM/�6ƨ�{�ll�g֪�E�t7k�0gVya=�/�n�
Md#>7#v�	�3�R^�T�<ܽ��1L��
�8�Ah�l�;a�U��zBw<]tpYk�'2��x,γ�b����r&2y�Z,d�B{
��ABN��}ޟ��h�М���>cקC����k�?�'�\�o�	�d�l�\Zb̒���s��"譈�t�֋�%'V��B�?��2|����.8�`�M#FͶɏ呾��[�?�+T]dF��]r\������Q�KkD2��9�X�x�u�1/�#�yY�����쀆�3���j`WzD?ߘH�Ѳb�P���:�s��Tn�x=U�:��5\Q��y�B�ʂSk7�1;���7��/��4QCƁ56�=���q���!+Vy�yY����_͜M4�����߱h�SEr�JLf��K_Dz�\�v'��hXG�=�Ӓ��o�Փ59�Xc�F�aUO7�XS8Iup��sR��]�D+8(�!���S���n8G��w�vؔq���iuU�/p0+���aREŨ���9j$�t�`n�؆	z��c|��=ҧ7��EC�g%������Av9Y�8Us4��{���ʆʢ�Y�%&�{ݚ:��W`p�>Y�3ˬ��\O4?�g��IF �QLn9�N�"�Ժߒ�BuZ6Ӳ)f5ҳ�wϛ�G �Ox�x���P�a��K�K!jƘ#���a$bH�� "���.G��Y� .�z� ҀJ�qN�G�&�j8�p�Ǒ�mY��̤k詣����Ah9|%����Y2yߤ����&���pڳ��˲�������..�´"��QSH4*�d!������E�NNy�r�����?d���ƀml�c1�H�u�t�����K���;و�6?�Q"W��hޛ�����PG�_I��'^�Y��E��o�FB�`�hkixӶ>�Pe��Oc�e�%m.�r�h@�>U���Q �V�O�aa8v�t�@�����O������z8�>���,�,�
�`m����\�~A^��g��6h?��QG�t&���b�	�
���;��`�S/�U�V�MD�@��:#�\�"s���sϳ�ʳ͑$����M�cQr��j[3(�3[�9���x�Ȅ��#[�#'��x��z�l�W�����je9.�	�8�]�5�����9(�j��j