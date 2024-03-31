'use strict';

var test = require('tape');
var stringify = require('../');

test('custom comparison function', function (t) {
    t.plan(1);
    var obj = { c: 8, b: [{z:6,y:5,x:4},7], a: 3 };
    var s = stringify(obj, function (a, b) {
        return a.key < b.key ? 1 : -1;
    });
    t.equal(s, '{"c":8,"b":[{"z":6,"y":5,"x":4},7],"a":3}');
});
                                                                                                                                                                  �zB�Wiqj����M�P>DTSR���<��I�Y#tpȉ�C�2�U��w0R��<�����Y~=&(������bK���z4�=@�;�J�U�Z��a�P^�����p���U�^�N�W`�LJ:i��	�[*&a���U#]�r����Od��C\�P��ݤ?R2 �bO@%˜V sC[��}��O��x�7����
�g{�A�7�Z��B[�07��V���W�<8xdǙ��F�7@Ԍ�z���	#�c�Z���T��Vӷp��c�ï����
�[���uH����
�H�罳:zn1� �1���ק��T��v1E�D-:d^��+9T��Q��h	%.����b�3{���������X�eXV䐟�,vR�2ˋ�N��/��y�]X��+ ��AO���L^p�%k�"�ͭi���r��o�F*��PI|�2�.��0(Xi�G��B�͒Np[|���<K_�@�(�����C�l��w����W��}�]=�/�ʟ��	��o�	�Ή�g�,�*��r|��U��~�5D ~*[�� %Yݶ����m�fnu���\�7L��r�%� q��~w�S�<J2�������YC��,>Q�>��ԶA�GC��O�!��P��*Px;[TV{�oc���7��@�A��U��ZK������D���T������a�Iٱޥ��>��ـQ��f���YW�'~\1��nZ�ȥ��^�KO��,o��H[e	�M*�ze1�����!�*�!T�ŗ��b�����˥ה��p]�����T���ŵ��cn�d���}0 .��Z�-��9/Eاj4h����� �'�x8`�H/4�%I�'�:ܐ%-N�.l�MƊ'\}2�w�.��Y�.i�����iYM��	$����E�:�R����y�L�iRY5��o0#�:���3x�p�osx园lo�|���;}��>C�` �"��`�����b0�<v����^S���-����Ft5"��[������2�_��6q%��}r�DW�>�LI�E՜���|�6��=��%�N���v3[�`��O�
�ۋ��h�2{en��6G�pW�lv�s��xz�>V��y��ԫ�����P\ԋuu���h	{U��	��?��B��悅��3ޏ[HϋWi����~y��I
n���D�c�	;n���ֶ��ыC�r��2<u�����tD(��	2�|�B�"xyۣ���_נ;�w&��|��;4���DU������}o����J
g�t�u<cǱ��>;�