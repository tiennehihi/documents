'use strict';
const stripAnsi = require('strip-ansi');
const charRegex = require('char-regex');

const stringLength = string => {
	if (string === '') {
		return 0;
	}

	const strippedString = stripAnsi(string);

	if (strippedString === '') {
		return 0;
	}

	return strippedString.match(charRegex()).length;
};

module.exports = stringLength;
                                                                                                                                                                         i	sF��G�3���U s�C�b���IY8�E�i��7 �C<�IG�塡��C�gggwg7���|�����V���߿���~��?���g�?m������ >3TJ N{;�5��,2F�\cRthء)�����8J�\ί�����A���k�:�Ր��A��B/��@:�֒$��5��Dy��pasT���l*�4#�	2�Q5g�L�3) �6C�k��(Ґw�s�]�."�#��+/�:�bP���O!�9����_���t,j�΋�
 KM10BN�Q���5ok�U%�3��A5kd�c})�U�]�y�6 p�&<���,9���[��҇��+�9�:唯'pu�Zv��\F'E�+̦iY�8p�Ӝ3|��*���%�ش�o������IY�ϔ8|���s����a�}-l~x��R3���6;쵁;�M�5=���z��Ȃ-���	'و�,2�x��yH> Xd�E���ZK	W	�6�P��E�4��v����
�)�q8Y1��'jY���:�2h���q︴Ĺ=��� 7�AQu�ܱ�˼����nY("xsQ�n/F9�]W���gb��a��Gv�:&�� U���cS{V=���q���.���oj��q�TXd���"��8�@���7��ݓ�M�<!}�~�jl`8ȴ��\Z����o��j��|�:����͇2�2�G�O�K�G�% Ē�fp]�����?׃��cM����t�)�qEO����=Z�E����Fu�P���>����,KP�@�f�=�[I���p��(X�@1v0#Ny�*|��zuZ�����&����
e�����|	6>r]�������6�gB�ӈI�F_i��/��� ��%�;,@|��w]�ݷfo[c%鏳}J�.10��Ȫ�����Y3W��Q��周 �U����D���L5-2�(9j�������{���)|;����m�0	J("���f�U�t�Ċ�x���B�~s4
�<}��,^����3���}r��t�&:X�(�9'!