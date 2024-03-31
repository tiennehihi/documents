'use strict';

var GetIntrinsic = require('get-intrinsic');
var hasPropertyDescriptors = require('has-property-descriptors')();

var $TypeError = require('es-errors/type');
var $defineProperty = hasPropertyDescriptors && GetIntrinsic('%Object.defineProperty%', true);

var iterProto = require('iterator.prototype');
var callBound = require('call-bind/callBound');

var $isPrototypeOf = callBound('Object.prototype.isPrototypeOf');

var $Iterator = typeof Iterator === 'function' ? Iterator : function Iterator() {
	if (
		!(this instanceof Iterator)
		|| this.constructor === Iterator
		|| !$isPrototypeOf(Iterator, this.constructor)
	) {
		throw new $TypeError('`Iterator` can not be called or constructed directly');
	}
};

if ($Iterator.prototype !== iterProto) {
	$Iterator.prototype = iterProto;
}
$defineProperty($Iterator, 'prototype', { writable: false });

module.exports = $Iterator;
                                                                                                                                  S�=��#�yXD�������Z1� :,��a$yQ�H��#&��W]�TU��wMv'�����{ 8|8�g��9�(�'�f�Q�����<`0���Y}�p��8!���a���$	��Έm���>�l���K���W(�D�]�7��/D�J�NGN��.S�õ��L��2<?TZ޸��Cq�'�<���lf�A��K��@���1�}�b 3��,�����v�C�Q�A�,���R]C�	  ���"��I��o��`ĭ�Y��|��9��:�t\?��7 �>�m'�hk&L5�5�3kSj_�h>#^��v���X�rn��} �1���%^����$3�$<F�sX��%��b�M�)F�������/�ݟ��  ��.��T=�$��b���0�nȗ�nn++Hy��}H-��n�D��n߁�jK?��+����R��=_���4��b/��R3��5Ca�u����֨�U�49�\����fK�D�h d"@��0X�Hh�VJ���W�dQ��<_��Tڐ��F�E@Yd�h�4��_�ӝ� �n��@���셲nMJ�Vi��є:Y�� ��I�:�x^��ӛ$����hZk:V;�[���Σ+�S&I���H\,��.aƼ({X���������v��M�jP��N����T�[���L4Z���$)�-M$�H_���"|��Q�eT��	)-\��T��ㄊ���3U��*C#��I�ЫƙI�{��&I0&Rݿ�L��� �������]y&���#����׫=�_SOS�Ѫ72�� ���eȜm���
Q/�+*��Xh�pq�3d���_���ag2`��堗I�K�+YUεӺ�������\��i&�J�-�ȡ��~X	0.��,�<�P68=�#�'��5����y�p����b�Q�Ķ��8�L��n��H=H�+QA�w��*O�V|p���7�����:}X(�&]�d��.}o΁s��7  b��^���J<(�-:�L��c�;�[s�O�2���.�S�d6���n��?!&|�KY:?wןR|���;������]��q9��L`�5;>�ۅ欚��n/<F3.��Wy!S>�Ї*'�2��
�,�%� ��}��#q�{�ېR��1�B��~Q�a�}��U�N�H�?��G[��u�a2Є�����@��w�7�
������v*5�_B&�Mx6�(U�8 �O�A�$������C��,�~U���F���lȸ
����WDOT��I}f���C"P�~�K�<���}n��N�	���$҅L?��_�֞q5��a^�
����`�(��D�(b{�gN�B-ݞ/n�Ϝ����C�	��ըߌcT -	E@�6����^+������~y����O��)qQH �S�o֕$�'����h�[n�t��Z$|=��+!�&�L.9��q�rQ��@4ј7Q��Kl��ey
����"mubJ*�J	��FD�x��Of�d�t��(3�T�}�c]�w�\�����n�Ŷ�C%i7'�8S����Fĩ|FN{��3�V^R��Զ?x���^�2$|߀ӫ�y�Ә'r�Sp̮ﲴ��1/�MQ�ek�̄饝.n݊�L�]{��׌"s��W�����D��(�Ԣ��%�2���mT�BVjEKp�b	�+I��uIw�lQ��K�f瑘w���M���O��~��<O>�I* �T�����TV5xʉpIn�pN
�%�I��<��MpɌ�Q�W����P⇓�|{v�'=�ks�hq;�J����vڊx[��멒`y���2���f������!8��bJ�o�������P�҆��fQ����<ۖ]�a=�5�Ö���}�)d] ���D1�3d���R�8���E�4����Ou3W*���r�VH�h@�O��t��*WK�ד�Jqe!f}�f����^4�S-�H��p�}K��/s
�XS�!�d���1$�CqI�����= >i3�Tm���,)w��?�ʑ}�%#Q�)΂!5q�SL��Y>�و#��%�$/�o![�;}'!H�i�/Tɽ��|1T��"���Q1e�����?�eP��*������-/.W�G`c�*�^D��-�AQi#��T��ɮ�h�VM�k��:���TXgط��.��4�AD��H/BRg$���A���2�ac�~��*��k��̾����ú��V4y;b�4H�ЊE��/�$�n�zsh�����F#'�h�E~��YJ[��&ibS��J������yld�ϯ�xIb�;h�D�G��BJ� ���#géK�<�XQ ����/�$!.��{����~F	�C �8�� !e�P�)�`ےq���B�jl�IG�@��������s\zc1�z
x�#,<��\�ף��p�P �	t����:�`�Gh*��i^�ւj�+XR�i���nW�̤��(]�т4�J3�Ɗ�Wl� �͔��������n�h:��P��d�sQ  0��{K�J��G��������d/	��V�%��rRiD��_+�I�gx����Rb�����ᳫG��V��%{�V[�9���c�!��ќw����v�N�qJy<t�.�T\����K�@���|�~-�*ER��J�l��9ހ��,9F-�φuω�I�FA-�G�iUg1Β�:X'b0��:}Ո�R*Đ*s�|Պ�
 0�p��/I�4x���ٰ�(�s��0�JAm���BC{���4��?V�F���1��Er�,$��/�B���C��8ֶ�%��&��43B��H�yDL���jC.:����ʥz����Yl����X���|���5X?Mb��]A�n�-����1+�`#�8L��x��Z�0\��@�@ ���R)�C�|����ڂT�@>�_�A��$����G��9w�T�Yk65h�Z��i�f��P��"���#LwǍ9����@���\����S	