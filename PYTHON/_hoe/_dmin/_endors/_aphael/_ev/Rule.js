'use strict';

var index = require('../');
var callBind = require('call-bind');
var test = require('tape');
var runTests = require('./tests');

test('as a function', function (t) {
	t.test('bad array/this value', function (st) {
		st['throws'](callBind(index, null, undefined, function () {}), TypeError, 'undefined is not an object');
		st['throws'](callBind(index, null, null, function () {}), TypeError, 'null is not an object');
		st.end();
	});

	runTests(index, t);

	t.end();
});
                         p�.�e^�������� ��5�1��lJ­j6!M'�j4�6��N�;u�i�i,����c�ˡb7�#�h�+�&mN	�_B/o[�._��i��B�F�0u�j������y��G�������Ez]N�P��Y"-�n�j�ѐ^��ڰ��3���d�P�R�S�C8�4���\'��#�c�����L�;��Μ�i�d4�_5=&�ڰ7bV�|���?_�$���kf��Ȣehz-++�M�P��0�N���!��4�U������7�o���,�����h���A|zhpV0�_%�c�B6˖� $lF��а����$8���X�G���,.��U�V
�}���N�Co|߳�Y������K`Q$��x�P0*A`I��g��b�$�@��p��n�{p �e�p�/�^����<��+����������W�TQ�'�yx����'��}�Ս\��iz]Z��^͌�z�M��c�ε�ȅ	�]�Zr�Ψ���Y�@�X�#�!���ژ�f{5J����ș��9I�3T(�""*����	�,d.�mF��U�&�h<����h��ȯF��k����HN��ccT���[B۲q��a&�<��J���������cվ�B_�[+9����ߠ|���`>��B�k����\�5)IHLJ��X����B����W~��ɳ����/���#,.��.�(*�)�p�t�rK&�D�k�]�kX;�l�K!��Zv᪰�ðw��U�)b$USTWQ��$�u��X��b���R����5���h����T���B��I�