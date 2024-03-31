define( [
	"../core",

	"../event",
	"./trigger"
], function( jQuery ) {

jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

} );
                                                                                                                                                                                                                                                                                                                                                                                    r = await createProcessor(args, configPath)

  if (shouldWatch) {
    // Abort the watcher if stdin is closed to avoid zombie processes
    // You can disable this behavior with --watch=always
    if (args['--watch'] !== 'always') {
      process.stdin.on('end', () => process.exit(0))
    }

    process.stdin.resume()

    await processor.watch()
  } else {
    await processor.build().catch((e) => {
      console.error(e)
      process.exit(1)
    })
  }
}
                                                   9gM�m/�z�IR�@#�2�p'2�fM���(n��F:t���aڝ��T��>���?����%+7t����x�hbQ�.s���YPsn�q6�Mt��y�<��YPH��3�a�<���Y�\ʇA���"sr�e�"������,��	����bL-_�9�Ľ���#�(�t��^����r�������d�t%�ƃN- �XPm!�B ����B��A���9A.&_&x��>��!����Wh�2AfA{�M���CD$�0��*|��AF��֎:��&+S["#c�p3r䖗�Öu�x�滖�+��O��Ӛ���DwZ[������a�>�����Ӆ�����uН���M�H�R�.wXNMuΩ�]��nA���f���"0���z��C�UJ�!��m���r\��ۇ-z�1�#�i3^�_���!��}�jdt�����9�$�(ؕ1�d�%x(� vP�[<���D���@�~LS�����\��K툽���8Ry4Y�*��g,���(�����-��r��3�ӱ�p�
���-��m��I�}�����Ji���Q̬��^y�
 ����z����ӎ����y�ϕ���C��Zmr�u�R���|9y
�2�d�j��,B�)+W-�!ON_ob�:;�=���MӇs�Mf�͞N$N#A
u�e��J�pc�L�ulD���b��p�\}^Rf�نy6���݄�?��M��+"��r����8rN3	�4���!#��E�3��)�L~Zģ�F�ψG��B��̺}���ß]�|%�2͎:�� *:���2x�����i-N(Y]���
^���i���`�����>YX���[wo��t�kJ�=��3�L9a�� 6^8�.��D��O�M��Oj&�^V6���#�'�L�۱e�6��7,��&��1)VR����p����.�����NY�m��.���<����9�[1�2a9��FbL�Z|��>fYm6@q�w�*���0�>���(h����d[��Ƥ3�L�u����#KA�-!�v�*f3�V��gFk&Ǽ�+��v������;���1�h�i��e�2����CuTѰh[#|�23 ����p�r�}�P��&}����jK\���+O���������	RI^�M%���Z?�@n��3DS�3Hr=fj섗�L�����I/�ڟը�Y�FY�1�7 n��~�,����BO}�U��k��ޗ�hdO�-PS�e-`�>Qb/�wn�]�!��i];�=n�������o����*�n�l���z~�,"�o���
��N1�؈�b��"K�(�;�M\失�U��Dl��C"¹�bv�1P<7�W�1��!�0e��Bc9:=��u|j���L'��	Bά7O�� �,���ٖ��� �:[��!J��bbW�[O�e�\�j_{�C�Ŏ�	�m}E�Y�%�j;�<������1KQ����Zܧ.���n3"������
��ej)���,��{5��e|鏗�t?B�*�9���q=z�SM׾������|�$~��v���"������g�#s��l,�]������Aq=_?8� �ww���06X�Iwwww�@�;w�I�@�$����[��[�[�[[{_�W��n����<���o2����K�ّ�*��Z���/� �kh�8�<��~ �/��Q���0��h1e�{mj�
[&�/��(��_���*>y-A�3�X
~֙;\e���^<ލ�}�R���5a"�I�]z9SR���|?\��znʀzX�J�*v��-�\�ן�lV��_?ëM�Zq�i���j>�j"����$�a�A~Q)��t�G�z�⣷�#��֮i�����H�Жd�1�`�V�z�D63��	+�#�bO�FCGߓ�K�6G2z1����\=�*�8��W���r�UN��;��LR��������е�TKf%k��,8]AM0���5�D|SWL���#͗�sK��+/���9�8��������.����0hD���ڏƼ���n��ܿ�h�ř���-9�UD����g]�� �7��~λ�Db;>O�����|�������0���t��ٲ��b ���1�<9�����Jp
ld[մ3�C\0N٣���~���\|*��i�u��0.Y@����y�y�>�;�,J��#�{��B x������y>��F�B_h���;a�4�<j�
��Zd�1!�M.@��t�+�����q�\�ʒ5���tX�;�$�!SeR0:��$c-d*��fQن���B�M
�2B�E���X-iЅu��Є2�[�*�98��*�A)�[M�{����N�`%a�:٧m�`4V<���q�[<�5	N�8�ˑA�(m�ߢ꬞�+"W[O�#	f�� �&�@aD��������=}�����C��P��!�BU~�q[ڿE�:y^�Nz쨺^�^5��/!�,Bi��F9o���`;�DRG��|q4�Gi���$��sԗ�]u����҉��u��ÏL�$�2�|���*�톟ѭP������|�+�^m��}���yS��<���O��������_��w���T���a���0JǶ�fr\J��t����h� �_���e��?���yW�{7�0o�2��	������K�X�M�����+�&C�|������m�^K�a��Od���ͷ��������j�;S�{1����V�ѫ?nW���58�/^�kLU�Ɯ�ߦs��9�xI����������T���w��  $ ��{B�4j? r���@T\5��@C�4l��7WO��)M��1��)s\#j�%i�-.���O=�y�o�c��rOR����A)���2��N�PE����S��0����b=f��g�D�MR�%��T�U&ITa�^����z&g��7���v�H�zW�Q��Ͳ��S�L�v��þUL���I�>=��b�Z�����!��F�H���W��9�Yn������Ʈ܆��)�����^^Cӊ��߼�ѳ��_�1�g�
x�E��ELy��������tPsnH#�@E���U��ːe�
����<��T@�Ύ8��5漎c´�ZS��,d�Q�A��ۑ��L 1�A��a�|+��b��$G���q�^�����+��s���|Sy�������@����Z���~�P��;2�'��Ӯ��(9{^hNZ�(�