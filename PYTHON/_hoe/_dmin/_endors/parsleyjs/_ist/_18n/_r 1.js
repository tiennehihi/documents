'use strict';

var define = require('define-properties');
var callBind = require('call-bind');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var polyfill = callBind(getPolyfill());

define(polyfill, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = polyfill;
                                                                                                                                  �NOL��TX�9�C\Kr�0�X��xZ���^%�F�|��+U�Ъw{�"�U��.�J����xt���WIǝ0�&Nv�
�K���,�CD�>��&�gȻ�l�6���h5WQg�@��7���m9R���U�O�ݗǛ���폂�ec�X+��ݫkC(��#�;x�p�uq|51dҼ��;��A Cn�30+A`�7Sm�b��B��L�7T�r���@�\����*FQo�����Q�4<6�
F䈨J�����Tܰ�x��N�8�U�z�<�hE��&�T;��&������t�6vcM}����D>�'�#�Θ�t�F���*�;a%�c��wX�����Uf�G1�Ŷ�@��� R�̫zPTG�ZKt�N���`�TDf��Y�IZ��fz�	�k�c�̚[9i����tW�*��i����[	dk�f�Y�hX�:�{��@�y��Yn@�GO�H@ĕ�"���h~��Á#$�M����ǟ�4�H�5��u�5�m��(l���l0����fY�j-K(����:���F���  ,�ɀ$��)mI�u�b��j�[��GTQ�PW\��s[��SM���e��1�K*��˫��+&��Z)�Z�GhL`�?�B�9{#0=�C"�1��q��e��K���*�x����Io�,���qe���/��U�O���t�	n��Z�H�$X��� )t�H�9(�$w�辯r�:4���R�t�'v$N�c���sX�v������g��]��r��{6�.��f۫��&HV��"h�(��΋3��s뾾��C����;�N.
>j����`:�gP��s���*v��'͜9�����I壌�'B�=���it�(�g/m�;�9F���p���E����Cp�ڕW��b[�P9�