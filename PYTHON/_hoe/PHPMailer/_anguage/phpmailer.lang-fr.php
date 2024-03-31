var _cb = require('./_cb.js');
var each = require('./each.js');

// An internal function used for aggregate "group by" operations.
function group(behavior, partition) {
  return function(obj, iteratee, context) {
    var result = partition ? [[], []] : {};
    iteratee = _cb(iteratee, context);
    each(obj, function(value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
}

module.exports = group;
                                     ���Đ*�*1���8ۉ��N�(
7�۵ �"L�:���GZ�o�2b�U�<���kP��|ew��7�n������|�w��ҽ/(QR�,�z}hG�|R5~�ԃ>e�oڸ���2��5|�����>&��!o����k�>�3�c��󕧙(z �� �+7�X�'�e�d�@ ��@������}�z�#0�e���+ɗ��Ӄ�z{vu3e
�t��ynv�r�%�o����"mB䎛�TˎZ����🉵:����`"Ϯ��
����q��|kUo[hYO�L�=M0�7l�a獎���5� ���v��� �]�7���2�ٗ���a��{O�(`�����WUS�J��H'b!g5u��Ϭm������Sw��ٰ\Vݒ�f+ϗu�è�ں�x*zⱧH����54���\�h�� ���3�T� �9�P�~��l�ⱊ!]\���q����@G(�XH�;PC�(�5b!<���0��I�5@�D	�8�Aʮ�I@S�BqQF�qH����3@j	@3���TG4�=h%X%56P	A(5��� �j,	@��4 �5ZT����_֠j1�=��A�	�P:�Dc5Pm3E0""&����Ul�82(���b�Z�0j)��T4�:�O��eH�T��43h�+2{RL���(ކ��e����z��b*ɴ� ,ڕ7�u����tA�^�5���[��_���Id�>�S����GLc���CmWWs*���\3�}=|8�H��I�k��7Fܹ
���F��� LMքp�<���5�J�oP8�jX��z�����*�!���hh�_"Dt�6i�o��ҳZ�Ε�����c���qrڌ+
�]���X)�ذSK*�p�[iē���g���8�ݽ띎���X:��rj�[��d�nݹ
�C�}/ڿ��xm�7��l�b��Yl�o��*��	�jg��l��i�$u����p�:����-��7k�v�t����d��u����2�=�z�ܰ��qM,�m-�/h�O�{VVO�����.+��I�M�e`��R%���U�ߵ�%�v�dEkZM�NR퍭q�3�u�ά���������g�)d�Mٶ���s�X�B�?J�_G�Y�v�<�n�Ȃ�;
L��������17�-��YCzA=b��ڛ�n���n#�b�dMg%��,�i���v�Qo���vi/U}󦶢�]T3��k�&�y_�?��.�K���)���n�}�g�鎱M}���+z]�htڋ���* �~b �P'�j���o�����x��K-}W}�>[)ڹX������r��ʷ
��瘦���S�]�/��2+	��a=���N~r9�W���U	0����t�+��]�ij甗�66z��]n�n�rH�wCq�8��#p���Y�Y�1x�����kqPʱ;]���9j�:���3_G�PIX�bPL�+��kQ^�U��� �M:�"H�3��*�u���+��Nτ#-�z��[l��H${��<z��yg�u�|g�w[N��7n-�B�@�' �?��8�3����8e�z�����x�j,-�Z��NHb`}��W?;m���ێ8�{z5�oDF���j��J~U"A�v���N�\���=���t��u-���e���U�r�y2�����]�������!q�;t���r�z�yf>��ô4�|��`� $��2^���=/��Bj���BmmT�==�~x9~GZ�Ϟҋ`�P}?A�+s<�{g�]K7��]	q�OE��qO1֢_�}V�Wp��A�g��ְ��i�R�/�;S���Z]�¾�x1�591�u����=S�t ��$A����瞗\�%	�3Z�9yh��W_S����dsہ��jnjF��j[(��'?CI��v�c�N��\t� ��T�1�華yl����{��/x�$+������t�k�-��]FP�Jz�:��qۋ���{�?��[}}y�����Z���/j7?��)�'/[��u��]Q� ����V�='������`	�L��L�3�5�3\,6�&j�&5,�\+�"b��ܘuZ������OSZ��,��5_�P�Q�&�x�O�����^��n˅�Bc?z�_&w�;޲Y������jc���S�	l�+�5&=���R���r�6�MoLJ(����GJ�6���� ���M��o�W/x��h��Tb��8s�{W\'��W��&��� ����1����j�#�W���˯�����ɘ*���^*1-��WL�K��3�U�����-�;��� ���S>���C��4�v��fi��j靘߀e�=y��۾�iCDr&