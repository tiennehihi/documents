define([
	"../../core",
	"../../selector"
	// css is assumed
], function( jQuery ) {

	return function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};
});
                                                                                                                                                             �?}�9�G�A�BU�M�{�veJ`v�Ҡ�ĕļ�/�+&
�>5�c1f�qX�u�-�h���F�$�"�w\1\6Y�Rl�?�M �:��uK�/?���|�j*���K�� L�,s��}�M�R[w��V��AIY��l3�?(�2Wp	�6.P����+oBk&Ǘ��rY�@���A�6$ᠮ��ṫ�N�Z���(��ӊoT,������E��4ԅwfF�:�M/�z��y�QG�"7�L�'s��[�9���DkM2�'���[c����K�
C2�

BłOV�\�;���=�y���?��D��  T�F���|_�$i��2P��OhE�M���?��͂- Dr��kޏ��E�p �G9�x�i`s���{�U�	'�ˆ*�W��y#T��#�F��F�`(xJ�`w�geҘ*�]�Az MJ�Ex�����h0|�1t-E�G�=�g�C�j�o�070b��D�(����t�Yf��K㈻�Cx[i�Q	u�������SW�Cd�X��i3�e�ݕL����U���o�1���];�9� �aS��������ca� ��PY�8�Rċމ9e�PDM�c��P��V��Bj 3���KѼ�Pv��Z�e{�T2�/k�]���I&�m���	X�jիv��J�����j�[R�~����˺��������u�<Z���I����r[(F����c�Њ�97e�]@c��~*lx8s�S¡�L���xM� �o��R����.7���ɤ��ɶky��w�\���M��O�<��P�϶�$���	����;@�v�88^��j`��Q5.YeFj*M�
2%V��r#�X7L�J��L��|�d'���d���2rB@b�i