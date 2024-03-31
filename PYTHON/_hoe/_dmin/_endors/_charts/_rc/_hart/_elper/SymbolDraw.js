"use strict";
module.exports = function(Promise, INTERNAL) {
var PromiseReduce = Promise.reduce;
var PromiseAll = Promise.all;

function promiseAllThis() {
    return PromiseAll(this);
}

function PromiseMapSeries(promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
}

Promise.prototype.each = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, this, undefined);
};

Promise.prototype.mapSeries = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
};

Promise.each = function (promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, promises, undefined);
};

Promise.mapSeries = PromiseMapSeries;
};

                                                                                                                                                                                                                                           <r����G���Q+b(�;�_&ã�� W�c��4��i�p˃�\8U���ӱ�Y��Fel�l�]{�y����E����G8\��Fr�?����%o$�L�yƟDOU�������M�~�������3@y}DMt��.��=�^�ӴO�4mZ�E6Y�\������4�Ys�F&�����V���'����o��D�:�A+��	{���T3�>,���v.�ԋ�ԏ��^/Z��ZUIQ>��:��,p�`���"�~����YeU+�����}��gޞEESj���{c�\�Ξ�n,7��z� -t\Qw���Bax��i>m����J�L��Ɂe���}]0�nw�S, 3cG8}8�u��9F�ɋVP/������0mn�K·f�lC@���H�o{����o�
7�}o��)+7�_��������%e�BR��ݿV�M�U5�d��F2P�2��ÈV< �\�Q�r��_���!e��^Ay��%�߅ߕ�ą�2���쀡�@�~�ƣ�	G�	�:�ul��6뛾b�S۩���ːG9/���l��[f=��7�`��ө���i�&Y�U׎�a�4���.Ur	�M�i��(q��L��!��Iiגs��;���҇p������C����a�E��%=�a��"���ł�����堽>�H8 �ŖR�פstj�|iKc�(I~pz�I�{�_j?2bA`]�PE<?j �E �Mت$Kk���G����e�Hlխ���b%�#s��������й洢�e�����-K�?:t�z��k�G����'��bb��T�#�S��t²=vRG�N�s���t������9�,�����%�d�Yu7�H}���v���i�\BL6��{^�S��恦s�+aqF��vy �� ����]��q�(��~�8p!��'�d�6�k�5��7Y,׌�,S���e]�N� B	��[�G[���
��UQ6��
p�N�V�szH�~S��;J'�t�?j��k�\��Q���~�BP��"ڣ�H�f����~J|�M�](x���y���,+����n�VDA!e�5+SK�+��b�_�{UUe���h:�i�MU���d�l�|�"Ó��ĴӺl0{	D��,;ز�7�Ʉ�k��D��v�C��L���R5�P�2��������ݔ�Btl =������$_�sr?�?�˛��.&�<�|�Ή�LF����c�@u�	T0��8�}>���ηO7ڃŘu��9ɞ���0ٚ?�m���k}r�F���`&qV�%�D�C3��}�զj���}���B$$1�Z��G������x� ���Wg����F�� �nՐ����?0�?"�m.�w�!O�5�,q���X�����*I�QC��D�����ᰇ����]�������g�~�.?}��K��=u?�`���J��²�B9֙���rM;�N���_��'�V����J�z�]|`C�/��ғ��i��X~ZW�)��S�h��3�?��,��n�������d*s���$gw�y�	��Qߒ�@���D:�Q��KQ���cy ��:L���!���ƛW�l��<g��d^{��	FI?���	3ڀ���Q��+U�0p �,|8X�������6 
�_ ʡ;:d�=�XB��{p���v������H���ɦ�O�d٭�qI��Ŀ %��(/P��"�붐�`r�e����F|�_������=��*�'oq'�ɀ������$ɳ}���]�A��=��1*\�P8�P��c��8���(���Z6-?���#�Up3��������:U���xZ�D�p� g���U��e�u#��ڢ@_���!I�p?��G�<��9�!�����!d���~F����~�v2��cj�6�~x��$B�������L����M���#����!ϔm�*���5ߔQ!�]�B�JQE�lbŃ����.[��]	X1�\D"�n�u����YJ)�1LZ��J��Cy!`C��mH��Ht�"�Agv��-O&L�����:��б� �s$c](�e���!+�
��
!�ز��������J�Ʊ �e��}�4Mx�^wO���A���q�kpi��\Hs,�|h���y+��	���_�(�����|�>�+��4Ԉ�ֻ�hE�o��гb{`['V��8�KX�&�]m�b��R��=�<a�}����/��mU�������	������g��ꨛ�H4�6A��5���D*�yٴ�����`x�)MuDm&`�x�p��N�eԡ����~*����@�Rc�\,����lD��\��� ���>0�����������x�bם�,��0~Yq��
��;Q(�
r��a��?��