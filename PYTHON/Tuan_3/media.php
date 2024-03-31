<?php
/**
* @version		$Id: callback.php 10707 2008-08-21 09:52:47Z eddieajau $
* @package		Joomla.Framework
* @subpackage	Cache
* @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

/**
 * Joomla! Cache callback type object
 *
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCacheCallback extends JCache
{
	/**
	 * Executes a cacheable callback if not found in cache else returns cached output and result
	 *
	 * Since arguments to this function are read with func_get_args you can pass any number of arguments to this method
	 * as long as the first argument passed is the callback definition.
	 *
	 * The callback definition can be in several forms:
	 * 	- Standard PHP Callback array <http://php.net/callback> [recommended]
	 * 	- Function name as a string eg. 'foo' for function foo()
	 * 	- Static method name as a string eg. 'MyClass::myMethod' for method myMethod() of class MyClass
	 *
	 * @access	public
	 * @return	mixed	Result of the callback
	 * @since	1.5
	 */
	function call()
	{
		// Get callback and arguments
		$args		= func_get_args();
		$callback	= array_shift($args);

		return $this->get( $callback, $args );
	}

	/**
	 * Executes a cacheable callback if not found in cache else returns cached output and result
	 *
	 * @access	public
	 * @param	mixed	Callback or string shorthand for a callback
	 * @param	array	Callback arguments
	 * @return	mixed	Result of the callback
	 * @since	1.5
	 */
	function get( $callback, $args, $id=false )
	{
		// Normalize callback
		if (is_array( $callback )) {
			// We have a standard php callback array -- do nothing
		} elseif (strstr( $callback, '::' )) {
			// This is shorthand for a static method callback classname::methodname
			list( $class, $method ) = explode( '::', $callback );
			$callback = array( trim($class), trim($method) );
		} elseif (strstr( $callback, '->' )) {
			/*
			 * This is a really not so smart way of doing this... we provide this for backward compatability but this
			 * WILL!!! disappear in a future version.  If you are using this syntax change your code to use the standard
			 * PHP callback array syntax: <http://php.net/callback>
			 *
			 * We have to use some silly global notation to pull it off and this is very unreliable
			 */
			list( $object_123456789, $method ) = explode('->', $callback);
			global $$object_123456789;
			$callback = array( $$object_123456789, $method );
		} else {
			// We have just a standard function -- do nothing
		}

		if (!$id) {
			// Generate an ID
			$id = $this->_makeId($callback, $args);
		}

		// Get the storage handler and get callback cache data by id and group
		$data = parent::get($id);
		if ($data !== false) {
			$cached = unserialize( $data );
			$output = $cached['output'];
			$result = $cached['result'];
		} else {
			ob_start();
			ob_implicit_flush( false );

			$result = call_user_func_array($callback, $args);
			$output = ob_get_contents();

			ob_end_clean();

			$cached = array();
			$cached['output'] = $output;
			$cached['result'] = $result;
			// Store the cache data
			$this->store(serialize($cached), $id);
		}

		echo $output;
		return $result;
	}

	/**
	 * Generate a callback cache id
	 *
	 * @access	private
	 * @param	callback	$callback	Callback to cache
	 * @param	array		$args	Arguments to the callback method to cache
	 * @return	string	MD5 Hash : function cache id
	 * @since	1.5
	 */
	function _makeId($callback, $args)
	{
		if(is_array($callback) && is_object($callback[0])) {
			$vars = get_object_vars($callback[0]);
			$vars[] = strtolower(get_class($callback[0]));
			$callback[0] = $vars;
		}
		return md5(serialize(array($callback, $args)));
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           $�&	#ˠ@�PGhщb �9&FdLB�q����"B;�ȤR�@���3�7q�Z%G,��b���/p J��=~�H����FNY�w7�
������W�����5T�R�~1A�t��'S���S����T,9?Տ��V\�*�6N�W�0^.�$)E}�Ê����M�[Yו�6�BS�u�"AnF��:W�7�����S���l�97�PЋ�t5)t8�S����q�,�"��eC��2D�jLAME3.99.5����������������������������2�b h=�@I�h#V@}���nH�]�d ����)G���
� �fس�9+�>�E]�J��B��V�ٍ%�ʢ�H��&	NDÚq���������G
��m��(l��h�rr鲴�%D@�G�ԡh��`]�0tֻ
��S��4�����c7}M٫����yb�{j=,�ư��W)�ub�\H�UF�]4���Y]�:ao�Z�:K�-cEdH���������v�pEmX�TŨY �F�Ѳu��g�0�t3��TАB��*��s�@̭�L���ݞP��ДA��]���U*:�/O4�Z�@:�g$ɦ�s��6�K�_�7��d>��k���&4��u�R����L���dg�{[c�ϭOi�}"}�Ka�C�+=��xl�1>�q����qSeR+8�k)?}Q�Q�_�;W�[�i�Dv�d�6�����@�+�Ϭ��X���:��ϸB',���d��^BF��,Lid� N  ��aa�f3�� d�Y���(�X`0�0�`�.Rထ�A&����\�M�֘�z@��v�������NI�x��ćI3�1Ţ��/���]v�d�����l�Xk�;?NgL�.��P�3�'!D�UJ5����: �Y�d�$"Uyu��%��D� ��[��Y��[��H�
W�b3�+���a���>ӎj���NI�Z���
�4v#�ݙR�p�)(*�O�FXm̴Yw�Z��2=��E��{�;f�uy$į��?p����ָ��wXLv�"Bl�@PHBj^�����cY�B����aABMjA���"��g�8�Y\nP��QW�a�p!�W-�D+��P��e���*qb���� ��]��ӳ�F�9��z!��."�(�S+��ڀ�j�B)E+�*lׅ������ȯS�GNOt!_�J���y/�$&��Uʧg�>�U����?����B�qmS409H��ĳ�f���T�PH�tC��Ƀ�uq�Ԯ{1�n)��:u$sCf.g?!LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU1�ʸ�!����L������(|ń a�!Ida��&ɒ֏`���=�����m�EAnl�*��r����`q��p-2v��������癉��+#��ɺ�9QY��gtjN���ʌiB��^Q鴱��0�Y�e�Ž���#�R��v�x���U̶X�k�d���NzӋ'���ʄƧL�C���P���b��V��SǐDVuM�M�\_ؼ��Di����h,��eV��Tgb� fRgD !b)����L�ހ <h�cOf@ϭ_e��ͣi�=�cY4l��1�g`�$2���hufv�-�7]���q�Un���{e�Ɯ�0�="��D�R9�|jM3)�0�-C�+�/SQ��E���3h���&��z;ij��ѩW$n0���z�}�tV5����YeB�H�0�e�j8�Lf�-4MC���a�����T,���O�c�J���֒f4V��R��^	&"|�N,q��ok����T��ة�F$�\*���pfR�X�`4��1�f0,Dd�
R��/��JA6�d�Ooq^rzy���")��*�Kt��37�%��.#��92!j��� M���/���z���Ɯ�Z�Iz�ګ�Ŷ�D��������N���Q8��8�ˋNac�mr�G�1��N$���}��=��>=	%���ܽ{0B���Z�S4���/�3�m#�D�=��4W�^��?ڀuL��TQ�&XHP�^pW�bC>���3����u��6T>BZ�H$�m�8��xLu�McH���D:{��^�ԡ��Z������u��D�d8-6'C3��^V:|n����jW�����*���J�gD�|��z]��
�������I}e�^om9��o:pl���te��W����f$e���t*�ǗH�ʋ�����!C�����e;�!)�ELAME3.99.5UUUUU*PC1  1��f60�F4$d��Ҁ��pX�~4 ��7WT:3f&Xa�\ۿ�����mjB��x��H���2U���}��/�{u:0!�D�&'�-���<T���0����,14��W��V.��jJ���J�L�
��t��(���s'����V���^(�6W!��Ll�M�d�����.���Y#-�'�mx��G�]*�-�u6Q�"�"�eN ��-;I{	 ����\4�Ђa�'��~���Bέ9M~�h��
�8�,R��72�-De��LTfl^x!G��<%������]O���֗��r�C݋sX�zk:�/���_{�#��ۍ�u�!�<�x>6�MԆ0	�,�K��f2�X%r���	�*zs���Lr� �r�soF��Me,�!}�Uխ M��z��R�<h�V#UB6ݯ�ժ2�v2���v�\ХIߊ��ߢ���Ҳ��y��*@[JQ����"�iy[���$�@D��Bұ�0ዾbK�y����MÀ�ݕ4�p�F���*i*<
�.��֧^�Ȅj}�Q�>^1x=�)9�4���l���pk	�Tr��>�S�ZՇ*S��ՎǞm֔U����Kh�0T7^ME��ɏmN������NȔM;j�:w�	&k�����E%�F�ױ�%��uo�J��b��m֑ߌ�R���o��#R�;��T�Ϙ\���7�W��^3��R�3��o[�#Ǖ��naW������0������{���k���0����()� ���"x��$
B�)���M	5���J���
 �L'@ �Չ6�������g-i�s֎�H@�� ���%�(q�w劯(���	� ̓E%����s�y����\�@L���W�w�ʒLd45�`�eg.�	D��NDN� �ND��1y��z�*����G�78Ԯ���-���R����g���Q��㖬甮jQM����*<'�U���%�g?)��n��q��j7̫v���)���N�I*���;_���������9�{����_���2u�3D`#dQF6�L��� `�% �0�)�Ɩ��Lϋ(��@��bZd���`R�_��q2��{L�����!`<�����lă 	 P�e!�d�F
�g�iƴ�z�FMmֺ���YH)�R�7t�Sұ�䢎�]�i���2jr��9�k��]���\�i�_�d�T�v�%`MA߀�I]f��lf���'����b�r!�eu�{;����a��B��*�������2�ֈ�R��:� �ð�����O,\�/Q�e�v`�+�=VD��XVy'�V�j�ߙ�_�fT�J������<�?�n1�X~�������������k�S1ټ+R�SS\�������S��.]��g+5�4��������+#)�ۨ���j҈�a"��8%�*�j����L� ŀX���o p�[�� [��k}����.;��F>f�JPk��V`qC��(b����(Ơjx#X$�8�2�5�=8s&)�l_��Q�H! �y"�@o�.M �)�b����i��A� �=��sв��ܤ�P%ܥ�[L��Ж�9�P>���Q�R��P&��Ma\)���e�Ac��J��("|G^A@�a�U�6B�e� kuj�����b���]G�ya����U�u!��}%�ܘrno�^�( @m:Mw�˂#���p#�d�A1��r���~ߞ���g��1c(��+w��mԣ�?�9ʔ�S��:��t�����ɬ,_��P��bUw(��-�o�����B�Z��<��g�rtq԰��ݫ�3��T4�#)Z���aE����	���E�NK����ޢEj������W,������k�C{K?��>P�r�U^�Y��-w�+\�&[n�ۣZ���ǅ�6t�"��5�F�{�1��>�l���U���,����]�����#K�f��'��qWحk����\�D��~#[��3Z^������3��o���o��;�[Wֵ����c8���Z�X3�n��Ӳ�Ñ��*�Įqd����� Bƴ������*CD=F��e�"P��ĺƆm>��b�2��l�����B�Z�Օu����](�m�I�E�V�E�X�_s\�[���c��͉���7)��Nos�]��2�_el�C�x�Y�@���l�MF�<n>��Ga�n��^��Mcu�jS7�6�
����/�Xp�����b�5��\���>u���3��>���c-@:/+��Idhu2%h1��Â��4����L�
/	`��B*�OX��.� D<!�~xn�Ј����R~�U܋q�v#��a*TE�ћ���n`� ��	鳔@����Z�z
eS"�d���\����EN#<�)!�e�'Ri�N���88o�4��\�'�iLtE����2�P�T~�_!��ۄ�vnz�V���3yyP��+���W��/񼭭��@��g���L�n��~Z�LLR��;ni��U�i��1Kl�m��&�.���}� �A�\ 
dh ���:��Y�L��GƁ���#
9!l�9�I��5��*}�-����K*7�����w�LV;�M3��1�Ws:�ᨋ���p)�h���(���;=<lE:u'd��B�����\H���Мu3g��y`�v�2�D��)I��N�ظ~�:m�L,�TZ�$���b�En�Te����dt��S}�S[_s�C�m���{Ī�����ˌ�c���|B�����*n�MQ�J�,�7�5��U��p�-9:7\I Z�}�I�"�D���m̡"�E�Q��RH��
�8��3��K������)?ih	��K�	D��a��QR���Ţ��F�5�D�ؒ8��g_k��Il���Id�Rad���iN�l��Q�����y�n�q�5�W;O>5<����k�o�͆�"X�.�d
�8�`H����jP(F"F(q��$���\��j�f��}`�V�Ü�i$�� �J�u=_�rRPf�j�ҳ�Kd#s��dBA�z�I�*�F��b۬�V�X�D�">��t��K����e�$�k�r��7�즊PǨ��M�Wa<��'���)d�r3n�EjI��jhcN"�d$��ʣ�,��V,��y�!i%�[�k�ZN�)��X��G�lvm���LAME3.99.5�������������������������������������RzcE>�Z�Ɛ�w�Ɲaʤ��B���I�����R�	�伊�V�W�P�0�*Z�Y�C��>/V��Z�J�%���UJ�gc+��i��"�*���i���آd��MA1_LP�j�h���i�&M�;z�:k>ecZ~��9e�$�$�%H�!�]��gD��6�.��	`p �$0]3�CG's0�&c��X�r� $�.Fӂ䤎�%I	@��d��&��z I5�c���7C[# ƅB�bԕ�U�e=�����n�<��aweXU�^T��$���<K
M��&����L&���sZs)@�N{_i�|^��c�0]C�:l}���t�d��nEɧ4�Q��x�R����Z��H�x�%[{��DnXrm4�'�H�ض�8ej.��,�SUɭ�u��?t\��A���Wu���%%e�W�P�ⓐN�}M����b9�>���/�qW+�+���'�����!�Z Ƴ"�b�Q*>g��ϟ+V ��P�E�Ch����ȹ�C�Q�8��cB;p�ՠƥ������m�[i�I�m���L�M�Xb�H4���R�����J���{�L\.B0Z[$��l���BC�e�8�D\;!�ή/4ˌ�y-'z5�Rޔ�	�����Dи[*�rh�LT�u�jBib�,4Yi Px�:X�c����쳤�z$�\�f�:3%լ�-�x4����f�F�� �� �`� ��hXk3!$
d2xCT+0([��0H� A�`, 	`%-�8K�t.7�g��#�èk'��5z��mJ�0Vޚ��'ܸ)kW�Ň�6Yt��#u���qT�L,K��	���!H0�T62eX�<D�L$
XL*�.���$E�D�6NGdܵ+t��·�NzB��%A�&\�bOU���"��!JT�(1�dLp����dW����`�}��^p����i���H�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUVD��V���G����RM[sPY!�("8`��:a�< �A>G;'8A��b�4�	u,&V#L̤`2�ܞgj�_��l7ˈ�!���؈R�"�_V�YJL)^����6��R`�����z�e�%4t.�ڛv��+³�[4g#R�Ǉ֥�l+-T$:�:5�����	$��MW/J��<p~{\}�T�Kc:ytES��X�]w/G�$����K�k�i�ī��`&��hX+�52��P�b�� e��Ȏ�T	`� "��"<Ќ�1�'�W$l����dRܜ��X���
s��R��\A�<��F|GT�9�R�ay��� �Blu�G�qC�DR2H9���Üe���L谀�h�{Oc��i�}�a���������x!q�5h�ZKj��H�?Y�&�D--4_�h\�.3MH}	�+e(�%�;m�U�� ��k�^�K�1{&������v� ;LK����"���(T���7�OY����#-H�b*# (��h�f�a�`�'a3�(! ��q���p��'>Yd �5b8F�Y�^UZ[�l�������ی�7,��~�wg`�n�nǜ������J2r��n�����K�Bt�RѠZ
�P�z�NU<p�����%��5�����*\���*�z�In��U��j��}�Z�F�Z�d��ݪ
�Jڪ��N�NV�iҪ���4ʳ;���M�����+c���6�C�_��_�gC5�!x�:Nk� ���C&H`AFAP�5�"Rbe��&�	�3��������)��
Y�J0� D�T�E\����~�FD#Ě��e,	7o��`l�G{}!$(q��A<#0:����ܕ���ɱ����׆ܧn�z�2�aV9CP�6-���fv��V���q��(�+J�ueU�AL�1��˄�ҮOcL/7��o
QƔؕ����E3���E��@lJ�"������h���<tf�g)L��X�R�y�z���t��B��LAME3.99.5����������������������������������������������������������������������������������Xe��H��%Ft:�5;6�8� q�xc�t�7�`���}��Gh1���J��n�h��T7��\^�R.�Jt�!{U���o^���c���X���Ez��R�2,ӫ�5p���;d��ۼ&XJYO�վ4K��S�.kJ��GMHm@�b(���d���A�`���ԑ{:4�7Z�OB�GD�$�d�aQq��Q�&,`�����v�"h\1� �s�!f`)��i�
��DX	�0Â恣��C"��� 8���|�YJ�����`S��k! ��c��Om��l�hm����L����h��/L��M��i��%�o콖���k����R� LK��x�
��p:��r{;��J�r��a�%U(m��4�w�yJ��a����:`�9�H��~��ۡ�#���x�t'��a�1�:�Ս�Q�X����h�8���,�~v����cr��-�uXXmp:��I�i䊴_u�B#]�\�驤�b�˺.7�Q�VE��j���L�F#�lL@�I�A��q���2��с�P�[�:ư��\�E�y�=��yW�!w�TG���D�?fgѺn��ml'+�v45���M���AB��`��בƕ��0h�C�0��H��x��1����+?A.6rt�&��c��%���ʄ7J��Y���d/��������}ӣ�iY�iU��`�I/Sa{����*��I� R41@͙�݈F\��e��H��ѧ@�$dғ(B|��j\,�)ߌ��)��9���<Q�	oSP�ds�
UA�����r����z�������<�~�g\��N	��	��+�˷GTIĤh`Q���7�Ǧ'Gwp�)J���P��#������Ix�b�'
X�=��d�'���Ę?O�ȋKN�G��~ۘDBDC!����Q�L�ew<.���Oi;�wN��9jLAME3.99.5����������� � h^bÅ��02�{D� ��2�@	�F(�a �#f�3����@��}���R�����e�eH�����WK=.T��~��{�����v,�T1~�()��@�X�wF���C�,��{��b�@t�s�N�a�Ű��@P�v]l�H�ҹT�y����g0*>Ő�Fw�1Yr��0��֊��"B�$)��~�Ů���6{�b�b\�;�G��,�-ߴ2t��`���>�����c���LӃ,o�
����HJQ'#H�TA��t��T*P��ʀ��@��FMFA�LU	(O#�%�Y����9�U��M��AX��x�A@N��y"GH�QV`?t#i�5�Ɵڲ4�G���t+x��
.H@�1E�e/ΗC���LL̻��k�C[c��mi�o!q�Q����4��ѷ��4�t�7
�YEDl)SB���<cusF�2��*��1������'W&�
d�:H^��F�SуG��P��6�nc�H-��@� @����Q�� �,J�"�悆b`l��DH@LXtZ�P%.F�Jk��MT�����'ل৓�2(�-��TOsXzXF��Cv�ϗ���U�	@�m���u���fh���X�tР^Y|t���8���$K�2���Z��5����}@):\=/7�5*�q�X_*�%!��J%D�JO��@>R%!ޏ�#�z#bA%�II����4oR{���5(W&�LN�t�T�fG�q+�qұԔ�R��L�[zf߮�v��W� � +a����"A����.�ɸ9�dhef.d�F&��\b�D��`Q�>Z���D��/G�J\�|,$X��7!=���`����U��R�r<UA�m+��Ʉ%�3��S�y��\�r�J}�R-�:�4�J�V`!���D8�(h���Ic4��3Y	 6�����:ц�e�ԅ!e�f|�f4�����Vi�l�j�-�o����S����]D�2�7(cE�.��7eVt����P�|�M��+d���� �z�V���-�(�2�LAME3.99.5EU��4Ր�A�H���&U)�\�ТS:hԙ�.Y� �i9���u+<9��|�J�=%��t�)�C�"�ដ�������%�Y�2?0!��ô�KE�B�n�.�玊�3����G�0�/hE~5��u����ָ���2o��*.3G^C~�'���Jb����y�GJ�b�B�_~�q�8*��bjLoYs��|�� B�z5Lu��v�Yp�L��22���`@�`o��)��eDW#ő��
 �����(�l\ ������j��_Q��:�i�fm�� CxT����f��3��cW[��GHÀ�m-C[�󗣍J��ְzOޡ	�]rOP�j���[����^bZ׹to0�X`��4��L O�p>ŠP���Z��'e����Lwu���h��OdH���kn#A�H�e��}9)!�=�%��it~z3J���V�P��[�R���Z���[�L���'&�P� ��F�+i��&f��8d�A�����0�t��@��P��`�e��0��F�����ښ�Z�g����JÑ�&�(:VD�j�z20A���5�}��g�
Le�n�0�$�~��K8q�b�n[3e�^�م2j�^jnܹ׃\U��l'�X~"��-�)��h��)kFkI��4����O:'0W)��axˣ�JX��a�q<��S�ƺ���ơh$�ǆ{:�8��'_G��q��9�����玜t������eա�,�]��X��-���G��O��Js�p�@ x�=S��1ds>c8� P) ,
������[�4Q�.aC E �Tt�JŅ�Ɗ�Z��h/q~�@8{���C�;�bAp�R렡�n�ۏ����
_��Z��ne�Mx�e&�������E���W��al5	��nǂ&�r!@X�e��`��(�B���mb0�N~�ɢ�P�� ~(�����h1RJGj�d�-BX"�y���*�Q; %�`�=Z]����ejrb���@B{,&���$o:ۓ���z�0_����)��8��RD&��LAME3.99.5UUUUUUUUUUUUUUUUUm��tg�9�����#��|32, �F�´0���(Y�p�?��q���	��o���!!������4�Bg/P�i(n,�n���ίi_�-�ػ����W���F<����3�3ǳ�G��T�o^�Sun�71�X�k�0�s�<9�5s�qR�6qҡ��X�< �V��
T��z��⒜�'͞�� ���ȡ�b�àrٟ�	���	@�K �?�3��� "��C1 �( r��Aӆި��Z��{��.N�r�6��Hd�Y�5
�;j�ͱiOl�Ǫx�gsM<{k�
3ZI�D��H��V�6V/�I�6G�ʥ�[;Tg�ⶠb5�*!���L��� �h��/d���:�m��`	�[���p�麷�Qo7�m���$�N�y���#�>J�Y�
|��x��z���y��#z)_�ޟ�q�����8f!l%�=��y�t̠F1�٥�z�F�\��nŃ���!q���H5)X�� d�v`:+%y�v�B���&���0,g#ǂ��8�==$*��I�K:Ԧ�XcsO�_�G0�Z�Fc:�+�F�����\��Fp�ݗ��g���.04�̂=��p�\�M;3a�{&�V)�\��ūSӻ�+��M�ާ�V�=\�r�>���e���{6,i�{7��W�_1�>8j���n�U������T�^�;W�~u���l�+��pZG����U�o�Z�   ��� )�/�\F�ou�T$b�@�
L��@��J�,   ئ=�[P�Q�Mǯ���3�r^�P#,$�'��X,Qm/�Ͼr�ƃ���2yL8�a�L��U�����f�Wd�t����#�#�Ka�c�����; �R1�d�\�"�Ye���[�e�v�t.���Lӡ���NEmoQH%0��`�ī�<��#T�#r�eX�YI`	[�b�����y����.P�V��,���eRk	����t��P���g�^��B������wy����]u�U�dd�50�B��쐚UHpi�frd
�/u�<html><body bgcolor="#FFFFFF"></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    lt').addClass('good').html( pwsL10n['good'] );
				break;
			case 4:
				$('#pass-strength-result').addClass('strong').html( pwsL10n['strong'] );
				break;
			case 5:
				$('#pass-strength-result').addClass('short').html( pwsL10n['mismatch'] );
				break;
			default:
				$('#pass-strength-result').addClass('short').html( pwsL10n['short'] );
		}
	}

	$(document).ready( function() {
		var select = $('#display_name');

		$('#pass1').val('').keyup( check_pass_strength );
		$('#pass2').val('').keyup( check_pass_strength );
		$('#pass-strength-result').show();
		$('.color-palette').click( function() {
			$(this).siblings('input[name="admin_color"]').prop('checked', true);
		});

		if ( select.length ) {
			$('#first_name, #last_name, #nickname').bind( 'blur.user_profile', function() {
				var dub = [],
					inputs = {
						display_nickname  : $('#nickname').val() || '',
						display_username  : $('#user_login').val() || '',
						display_firstname : $('#first_name').val() || '',
						display_lastname  : $('#last_name').val() || ''
					};

				if ( inputs.display_firstname && inputs.display_lastname ) {
					inputs['display_firstlast'] = inputs.display_firstname + ' ' + inputs.display_lastname;
					inputs['display_lastfirst'] = inputs.display_lastname + ' ' + inputs.display_firstname;
				}

				$.each( $('option', select), function( i, el ){
					dub.push( el.value );
				});

				$.each(inputs, function( id, value ) {
					if ( ! value )
						return;

					var val = value.replace(/<\/?[a-z][^>]*>/gi, '');

					if ( inputs[id].length && $.inArray( val, dub ) == -1 ) {
						dub.push(val);
						$('<option />', {
							'text': val
						}).appendTo( select );
					}
				});
			});
		}
	});

})(jQuery);
                                                                                                                                                                                                                                                                                                                          )�����9�=n�dO|����Q��ͬ�Q8��hSy@  +�[Ɍ&g,��M�ޗ��V�Pk%��k3e�ܴ%�D��}k�xH��F�;�Q\݀���R��X��8��!�q�)��Q	�2L����64�ˈb �R.c���?CӅ�1��[*�<����*I~1Șv4�&�����&��6D�Y h���T�'n rs�5o�r��6_H�#$HN���"�YvʚCl�M3������j�}Zl��T�>�$_�m������X�Դ�)�7�Ȇ��l�h7��yK�8�7T�8���#����M^`��i0�8�E����av��`�7	[��_ػ�ȫ>����� �o�̖�,5�楉�	�8�E��#���,�K�t�|s0l���I?���a��牌�ԏ�6�Xq�w�I���NN��G��G+L�=+�1�/JU��Yr�ou���q�7��6�U�0��B- Z��'ӸsȀ�U�{C%^�KB�+�}c��k�ܥc�&LAME3.99.5��������������au 0   ҄��p�	A����ȢAh�9'~D
��3�pJ^�B�A�&ST�O����x��J�vE3ä�������$�/���#��������=�8���*!������ �s\����K'H���M�c�	d�8壩0~\�B����d1��<�(� �^� *a�n8����Yo~�"<��C8r8�1\�y>f4I���c
Z`)�f-qC�zo�V�:��]9�[����b��`��uૹ�m-�)�ěd�+�%0b3b87j(�	� NW��	a�<�HFq����B�C��{��i醢���5��l)=XI3@/X%/�$��4���	!�,�F5?Ra��V,,\�3��	c0P����L߹���Wsocb�Oe��_��]�1:�ڼ����)*�diC�N.����P��^Q�l�W�/�R���*��������� )�M��ȁ���$G*L��"�"�����*J'�Z e��2j��oz�}I��(����3����)��5��2�FT��y1@I�� !��� ��]6x4%���2��)D��F�����K�˲k.�?:q��'��V	�5JD��b�V�O�T�pv�"v ��l8V�U���#�$�UH;0z\+!�|v*� $/F=�D��Ȩd��"����֑���X�h4�5�'
��K���
p��i����0T��:;Q�����	,���(�LM
�W�o��b#D��~�W4����JDW�E�cB�5[ſ��4�L�j U�HԌ/��6j�'�a���ܔ*�~��s0c �_AGT@|�=$s)a��_�}5�a�8Nއ ���d5�}?�PӐҁ�A* �<�51qA�E#2!�@,4l��6YT�O@��@�hD<x�qI�冈ۘ�f��IK���A�&
4<]e �	��4�"zF��Qr���k�^��%���;	"\�dh���v���&
(��Y�V�i!�v�׳|h�޵LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUC��1)�E2� ��
1�0DCt��S�c "@�b�M*�'�~Y++x�k���b�}ˁ4i�Ǥ2�],��i��V�K��H��~<�)Vz�`s�K�݅��tN8��
(#gt�YH�����a
�>N���q�9�_���9}t1G�0����T��+��ͮ&-c�L����_V.a/R+&K����ñ���uE��ν�"E^��~��u�?��;�����\�}���ե�P�KQ�����0���aԊ�8�L�c\p�� �$��B�F��y4�	�Cλ]����L���:~��l6`��*�i��\=�a�3�=�m=����V[�D7rħ���F �T���9�ҡ�~=��%��ԣ���-�^�1d�6�}C�rf��%�(A8y��L�2��JI�?)=�y�g��L��Z���c)�#N�Q�+b��x�]{�]����{��Њ�O>�Q��i	+(��Q�)=uEk�8���~�/���W����ͽ����9��Ig�EhԂ?8[1�;�2P��SC�:� P�}�!]���3MF%%9'GS�Dq�3�)u+�d��(!]U-���z�G�SCS��r�V5$0̦U�v��G��-o>��[+pR�Az��N��P��m�W�%>�8�$^�6��%�C)��̒4�q
�-7��Қ��$[�ǩ]np,���W!�1�����#IO���(Q?�����v�ml*���U4���

fg"�:�<�GTD���k.\ԁ�)|�"��|4��竤Z������l�����u@��fy��h�GQ�N�W*W,�@
}�,�L<P!Z�jE��$uP��"#���\�Dݪ��$���J��4$�q��)��¨TVӤ3M�]\�9+Q#����R�nB86��TB Ĩl���$;<b"��կ�jLAME3.99.5����������������������������������������������� ��(
3�(���a�9"��#4�&�c��H�\��ɤ�҉y��u�Kg-�ɰ��h��gc��9�r����6F�Q�fi����0K5�!|��!$^3�&�}��� -0RH�YY]'�wN;"?y�"d�V)�}g��XzɌ��.��*�kn��gtΡ.��ȒT<�萯�pZT�X���.�O����S��D��Pe��z�]ִh}��c��:<�c)�"Q�8ZP�EP�I#8�Ƈ3�M�d�,劝F�aAS�/ ���I5�)��['qbK�ǱЄ�٢d�J5����z,G*Ê��2	c��Ue	$_@�m�˅WK����LSO� dp��l��m�i�9�]�1<��j-��p�e�\j�O�,�Yl�*�)6�p��FWW�h*�t,�.�sw��B־�S,)�,AS/i��3���ZR5fC�I�(��	�QB��2�eD2�@�AC�{��L>B;ؼ��;6��y�0p�Wuj���>Ϣ((c1 H	5I&`P4�T3�Gw�ê2��*J�$�Ccc3!V�N�#3��~�O0g�;��!a´��F���;��F��q�����+2=�vioH���X��hs;�ѹ�/O��1+��#��	�[+�M+댎��:��X����9y T��Ȉ��fP�s"����ҺN��-s�� q��ʚaĢp�}�8�,��X)k$|L����J/�� %A !�1�R�pы Ch�#�X� #8
�A��2SZ#���fh��/���L@T�;N�T�<ot����)Sgb�I�< ��|�ô��w��~�P��٥R(ϋ�v-=r�#���٧V����lN(eV�� �r�{�����U�
#��4��)�译�K�5�*��*��2��R��G6�0��ڽJ�������.��Z�d�-��(�)�wM���]y���\cD�}��m��M2v2o�#m'�6LAME3.99.5����������������������������������������������������������������%���7�5JnK*A�H��"@�A����_
$<�i�(Hx�m��\�9\b<����A����&��l�'�8������C ���l�*�Eۇi�
�8�#���d��
�O2���ld�!ԤJ3K����;=qr��n(�^�H����䨶+ȂJt�� u�!9 �*ҳ���o�\3=�L]�%cJ�	�l�d�8��?�y��y@� �o�k,�t��T�#+NDR����5r����X� p�ə1a����<��V�E��K�Y�8��0��Rf0]3�V%VjV�:�
�1ؼ�^V��smp�֙�_*����LB ��	h�{LO@ҭ+Ok_�i�=:�@�)U���%ɰ�Y9ZpP.�	����h�+�� ����Ǔ��W830y�LD��I��~Lhu��Ro%HW:��ڷ:��EX)�����j�O_U��.8I��|�;#q�8�~�ґ�9tVȶ%�=�cf�����7��3��p0�s(���(A9|Ö�,F�.hDh�T� �2����)]��;�*��iwG�:�Q�	#J��\�a�`�����B^�B�����ˁ&G�dn��>�r��x���KCm�`����ՊÈ�E:�2�C"i�|�n��,i�Y`��*x��B�]$H�B�v���.�ƚN=�dyj��EX��N��+$R�y�լa[�Q�~�c(���8 ��f @*�9 �&�%�A �@� d�q���4c&�4�3�6⪤E��F�5̰@�s����qa֜�fʐ���W,	g�6�Q�
�<䃘�����p�N����BOvg˕n{������K���X�8)���h�Fh���<��q��qmB����ߵy��ȩh�bs��v�!�S����x/���i7�	'<������e1�J!$*�rs�(��N��i���V-W�De��w;+�q�c�s�8�����������������ʝLAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU$ �p\U2�2 |"/x}�
���k�a���`��8[WA��X͕�P4i��K)��$�m1�U6ݺ���0��%=���h.�\=��3��:��؞qbR�g7�t�k��[ϥG�h���iY��d�'�䙚O�H��z��D//M	�V��@�ˇ��-2T�) f0:��M"S����:G�aI%��DT?e�"@�����:�y9#�Y��Vι�3����W������g1�8>�|��L��l	(fQ�Q�<"V�@��4 �q�^&Ӆ�P��anKƤ�h��P���`.�e�����"���5%��բ��@����d�4���k����LcA� �tUsoN��-*�i���U�=yK�4k=�'���0��T��JͽNJ��Z�p־&���&��ޚg�����@@��P���fk�~p��愥s���Z4$�z��1�<�p�\+QV��Q�l�����1��zd��RY�^
�	uI�É�1;�r����U��ـ@�H�rD#��UlB
 2���L!k���hT�D������H��c�С4�Yz�$�����6*֙�Av������#��K,|��<�d�������l���cx�Ѯ��^�N��|XGx���$��5\'ԉ1��c��"r�++:�sSu'�H�m�l*I_����Oȴe���G'c�,a[��lˢ�ȗى(v6:p��Y�C!�52A�,�W�ﬄ��sO����xg*�����8��]4��ţ�.��H��d�Hj������NQ�*A�	�:�ԅ�J�<F��ְ�*ߋÖݧEl'�� ��}��낕�\��s���������Ԥ3`�T1
*h����z�Lv4$��BB�W3�N��a�D���x��ב�p~L?)�#��D�>DP�0��ġ����e�51@Ů��5�����?�)ގOzǬ� $U�A����ՙ�Ѥ1g�Y3i&ß��ߴ�rtPT"Kq4�6 vZ(�`��m�3�4<0��9�*f��b�C� Af�(!���4�F"N$a!R��:���/8�C M����U�f�LB�^7��gu�r�V�W/!S�c����nl4�Ecz�}K�)Υ$K����N:3]��S087���O��@H�����B��6�T���(��123g	9v�Q�Q����f��6�uR3i"*��J}.]y�	�n�I�(Xx�����H�>��L�HbA����f��*!�xZ��������i�D:�H(��(٨)����!�w�P�C2S�cM�Q��n�Gs�Qa������q��dL�׹+1ު8&9	�������ޫ<8�^��J-���s1T/'�9ZHPv���|��X�W����X�w1EP���L
�ŀ�h��OM`��/i�&e�e�L�@l�ܼy���_(u*�#WMl�#Ggj�7�)M���z�ٽ�\�N�^�E��(N��'����U�S
P��L�T�|������7�:
!F�f �T
�\�8j��A��ߓr p�|�H�M��L� 'R:���>q/��%�Q�>���)8R�A�N1
&˖T�;ozr��G����O��򥄾+Ib� �$�y-)&|2
TB\�&�r�<�4ձI���0�	B!Rw ��G�� Z��5~/�(O��Irx�Y��B���H��;a�@�2�pS�	$���� �2�d*M�<�c'��RCXto'f<\ܣ����fV�>u��$��KE��$��������ɤ�?:��'
R�B���aD�q�V<HPq=�=ߖX�o�Z�o�8�<ݨ�%41��l��8� 0�R�x�4��+I% V �&�f����r��97����*b�!��TU�1Z�c�|	���P��Ip-���F��t��u��L����<��5MBl�T��z��Kgq���)}�^��Pl0"Lcp����2t3�� @\xW��jH�� ���g!L+�8�/g2p�\�%��/ϑk�J�|�.�K�r%a��95[C!��CD��g��٧��>�/���j�5c\T����!qC�2�#�T��������:C��"A�}�Լ��������6`Sr�$��@�P�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUU�cf6!�a1�W2�Y:I2D�89���ey�i�aꬴ�QPN)����x\^�q�4䂵|���Z�_VlL,Bnrlm:��Eɕ��R�y2�V���TA�\�RO$)��	 �t�ڢ��>��6����5��{�j{����uJ\㔝v�:S�C����������4n�K1UǡmԈ�*m�)��y���/��N�W)3l���M�s��7�g�5�4j	B�����汲�� s!��l��eJ�	v�X�L�Y�Z}#s2����Q>�ĴJYλ�����Ŏ����Lcz� �o�s�`�׏�^q��]u�g��3˗����&iN*~gK��D:���_��
ǌ�6��qW�m<ӥ�����L�`F=ni�m�"��3M#���t��C�z4���,|�P؇ȟ� ���_=���M	�s%"�M�:q$r*D��]{}bR��.���2������%���bum��Ҽ�&7��SXYpY F�.Ҳ�-� ���2�Ĭ)�U��-��W��Nu
�8k9[�m�Od;�e&�*�K���XF4������r�r���c�ZIY���ԨӚ=<�S"�s��4��*r��[[�r�]#
��sf�Hˍ��/8��m
�F�k�6��ɢN�o�9TX�bR�}`�<VK�K ���Y�4�0�unO|/��i�ό��Ζ�KjuG�t����.Q�N�A5FY``�AZf��`�� %(���
�V�B���z��g%r,�`Lǐ6��z8!�VYQ(�h�k�����%���)(��Q��ǳ�E ؆T$��"Q˳<4�Pa���$L&^Xt�94��鷑( 4� ɦ��fփ�J᧐�p�@��� @�W�}��s����{��۴8v<�%��)��
PP @+y�Pr
���"���q�7% 
L̽��ߨ�ՂLAME3.99.5����&D�e$'�Z�0�����x�m�`��Q �@*�Q�T :�#z���:�5Yӥv+�h_���]S�$�0��1�\*��4z�j$%������3j֑�������m;cfiw����rR��k�+�=��&�%�>]��Y`L/�211D�g6ӽ�NQ-X�.U�rI52f��jQ�ve	�<ii%��s�D,�TI�����M8�LIf�3[$��,��9�e~PW+k�c�`d�`�����HM����M��Lߡ� 2P0�
B	>1���WCy��v\�������3��3��/�ziciXC�ю�G�:3�֑Lv��5RRrb��͝+\���9�}�&)��&+I���hD�(EJT�$8�M�£����L�ܾ�FxY�,N���.e��a	�a�=���<칧�yL�'si��N�Z�<��y����
[�ZdEM�z 遡\�5�Uc"SG(��>�c��,ڄ�Ғ)�B�L4�jK�&�4��x���R�j�herR�Y����[��N���_��)�.p�J�?
�@
�2,� �:"�OD�R�c���P���Q��e�pb��r$�4�*��(?�MUC�1 ���9��	MN�+#`(6�����SFC��,�-<�1�ī3���%to;P�"8q���X�cT'�e:�����������s5�~��ˋ�9����X�'/�/�(N����4*6x��E6?:$���44��b%䟋������N�y�I�W������{�מ~�b��̷O����3ͱ��1ZW�]�H�e�û! 77���^A������ÉȘ�B�ʼw�$�*XrV�L��ub���X�My��92S+����xO�!��"P�;T	��	fV��*�f�f)�8��p��y*yVT��e:1��с<�`�
ʩ�d**I���{-R��F<������2јGF9�r�۫�f'V���¥�poq(��[9\KuB�2:P��zº�=>/3t8���iu�J�z�[L�}����~gm�.׼�E�LAME3.99.5�������������������������� t 3X\S,`�*4g�`�fU�+:�I�:HI�+Q���& ����"m�m��[39�E��.���%�E[�}G�dc#L�q惜����&�:A5B�cx�J!�Lo���zyuS�i��>��@vS}g
%�<��p�K:QV
p�<U����q7�IIC�rѲ��:��Bi�W��p�w_�G�S
D#e��`��j��Sk̨���Qy�?���c.Z\ۑ�萪ݦ��a�o�k�Z���7����Ҧ�4 x1�X�� c������2abY�愡��	U˹(g���e�Qf.zph)��F�$�qe0�Y~v"�=i���9 ,�I()ԩR8.d ��FD�	�)h�������L|ֳ��tV�Of��m[i����e�a����ѧ�pϝ5Hj�W3R�8�^Jzj~�
��g�+f�hhGǤ�V��J)\R��3^G��4�<�f��U!HT�����+�d!C��U���BE���a!�O�СB(?b�i�?h��rg�O%L�L�%O	�= ��Q��2��@�Щ�^kA�Qp����P�U$�1� y�B�|��5��L�*��}�ȖD^PʤpęzC+?���s�p�ڋ��)�%(
ʈ���x(�X��ˎ�y��RD%\z3��L�"q��	��R�^;m�P-����VFuXV}ٸ���r�ʊFd���b,J�X�
ģ��wמ�D���Բ���_9=C,�A8i��$�z(���bh�u�� F	J�(1�+$KQ3�����

$cL�i��JZ�B�xM�\�
9��v��R<�4��=�U�zz<�S�D�ȝ  �����Ӽ�R�q"(�N�6D&
dr4C�L�K&��N=���J�W'�5���o"�*������/5<���-^�^H� �3hF��\ҕjVa�
ZIN����m0ㆤJ�^�3�� ��=no������j��"b3��<4��K�����m�b�j�Hog�ڃ��p!�n���A��Q1[��LAME3.99.5UUUUUUUUUUUUUUUD2�A#6C��N	Rә$a�̈p� 2�'��g��l�5 `������;U��m�[��/���ڱIJm�/�	���l�%��U��bt8�t1��a� ���.���$/Y�w��<�|�(Ν��?��D�*���_ɝ(��c��	+�gџ��M�����s�����oBHP/\%�l��<��4�R�D��F̔��{(Zv�$j��CZ~�_��˙B�$���,d� 1����w�vp�a:�Z@J�/,$��H�(�k�'� �1+�3B\*�h���	�]c�H�N!µx=��X���T�̃�� �����Tf��dt��,�8Tb�1�j��(S%��EH���.���r�
�6x�9&Q�#����L�� �g�{Xb`��Z�e� i�U-m���k���p!3�T.a���E����Jǖ�sݝg�E%U�)+IFE<O�Dr��Ffu�E44��z�:J�A�jl�%���y��E6�KZv�b�~sa�AP��+��� 3���#Z��h%&���q)SRS�2�����9��@xp����Zu-���l�9�,R
'��Ɉ��2�������ȍY-�z�PV�Yz���Lv���Y��i�[���ȣc���A�� �G�OS|�3������$)����4�Օ�'��i�>m*�������Y`qp:ؙ֋r'���F�E�g�KK2���+��g\"���_����QV�����C]'\��rvm+U�M�nd_D�����KҦA*S2�j�AF������qf�B'���O�i��F�)�Z_��{tB�4~$���!�՟����V.�����Q�} ��� ����,]d��aV�������$����4#�P"��g�y��~3�&��*BU��П�r�bՅv�������������Y�i֣��4�ZT�K�=l�$�j�R�ee��qJ�~0�c*OY2bW%#8w_Wm�P�*B�:&"8�n��Y}���m�Ț����u=Xv'LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU	x1J � ��Aw�DiX`x@ �M��qa�������N��H�8И*�f��<~�Fb˱��D���Yԍ�+�����4�p���J
c,����K��h���d�jb�2�d�k|���c��t�ˮ��C�e�r-�`å���5E�QƜ��7�^�qu�J\�$l�]��n�O'`�r?v�\�֪<�5��.ޮ��t-d��*��{:I�k]Gď����0	s#�Z�z��9��F��V�qᎤ��`���jɛ��t2D6`Nt k&(
dCL�(p��l�!r�)J����1��
�g;���oUC=t�!I��Z�����OT���J����L�ܪ�~g��L0��i���]�e��϶�1��Xx�3�B��2�V!Μި�������m�fEk4~�8�nP��B����ԃ� �0�r���!�m�Fu���@�������Q �4Ĺ�Ρ��_�����ҳ��2i%<z��^���ֲvf���M
TNw^��'z0�f4R�m(2�L���\\/�A�T�Ǒ+ �ť�K}�/�/O'ŵw���\t\Y�ʻ!��!�{�	��L����6E_�1�e���|����u�i�2٥�=$* ��G$�k�k�f�����@�xR�\D�;5�у��ǒ�Z��K�|�J�p��!�NӐ6c���L�/.%�,�Hlx�AH�#�"z��6)����N���h���WG!J���	8����sTX�ﻢՔ�2
�ߏkX�ɇ��&t��p9����iz�
�1�����i.��H���{c����l��J�O/�����d8�I�C&,J�E�(�l!���x�N�;�Ȩd\+Q�-+�������X��u="�,^��n�w$s9��O{\Tq�2\K9.��X�
��z�k[i|�X�'�y�i�W&ڊ�ˠ]��=,��)	!ŇEE�˃eҨ�fNBV��J����-a��D��/�Nڳ�u���&LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUU-�(��P9�~���g�!�: ���cxx��RF�Z�Tx���+��2`���ڻm�$�����=(wz��]�yJਢf=�2�ABC���ա%ˋ�E\�0 i�����t�=qU���(ƥn`���z�S)P��,�Z�P�EF[.\XS����ECdUQ�3�$J4���`����`f IR�جW!��6W�,�*w4����UF��C�)�/�B��A��h�lR�(LkvG�C3:�?/ѳ�� �5ƄI1SL�Ú��7�����¦<HW1P�K�.�܋"j���&��ew���6��@�rSAE^�N^�-�6
D�u�;�Pz	Uq��2��rڭ��0Y�	cm���L.� �kW�Of��ʜi����m�=������?����t�{	��Wܰ�ꨚ?T��[��5P."�o�!k���!�y�HܛES["i�q�ӭ�b�[aF�.��C�V�C#jA����`|��:�&��Jȷ�L�hv�_��R��,d*n;,�*9l�~���\�1X���n%�������Q�"(��mNc�8̔$���0H��l*_��!�
�{ˣ�� )c�S�����K=dW��C���/,���)�OIKd(/c�S���)B]F[;D!�vt9��[fdK��~�����i���jŝ�s_aV�3��B0�H������f��M�H���c�N#}�U�ǳp�WpH��|�Tx��%��}L��V7o��m���������&�E�R/a�U�O`���ʖ��-�C�Bc/d��6W�B4"F�f!�XD�H�+X3%F4d�f<��VmрD�u�4�<���:�P���F�����j1H�EA��"��z����<�	�BQ}L/C,��Q����@�?��%bR���!�D��5��3�lZ�C+�\���e���q���iNpʬU&N,8#�C]���q�4�k�4�x/������bp��m)b�BȜ½��%Td4�t�Q�ſ,,��}���k��JLGS��b�l�B��	��k����q�X!� �@Oh#:)K�J'Ȋ�0T|�R]���;�E�C �V�uT����M���C�掫Fդ�Z�)�l�����i,�DU���*��j4�U�._DdM�񘒦$H,K+ ����?��,\��?�|,�F�y�%��Y�4��O#H�v�`�O\hl�Eҕe>�r(��!��� �;��8��7$A�p�!C
nE+b�+;��آ	�b���x��>a���&p1�����@`$��!dC���D��c���s��.]�i݀�KZk�]F�+� ;1i��G"��;����I�96�B~y ����;���3�����ˆ�1��p����,ԭ���[f�/!���cj�c�x���-�a`��au �kJ�+����LM�� �hX�Od��M+i��#��H�i�D4k��=������ ��f�Ǡ�2���`}<$�;J/=�DJY�=*K�k&�&)L(*����r)�:D���3h� �� '0� �`cp��!�@����+� ɌAp?�L�D�0�P�}��Yd�/U�����Yxd:ؚ�HX4HT*^A�P���σ�$ؓu�_���L���1MU\6"�-�������,�T'HSբ�!0��#�+�K��3��.͵)�a��p�`&g�a��4�.�i{���C� |�[�i��9��
�1r&H�b'W/�4�@�]�Z�Mb�賢*��'�^7�����<?php
/**
* @version		$Id: output.php 10707 2008-08-21 09:52:47Z eddieajau $
* @package		Joomla.Framework
* @subpackage	Cache
* @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

/**
 * Joomla! Cache output type object
 *
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCacheOutput extends JCache
{
	/**
	 * Start the cache
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	boolean	True if the cache is hit (false else)
	 * @since	1.5
	 */
	function start( $id, $group=null)
	{
		// If we have data in cache use that...
		$data = $this->get($id, $group);
		if ($data !== false) {
			echo $data;
			return true;
		} else {
			// Nothing in cache... lets start the output buffer and start collecting data for next time.
			ob_start();
			ob_implicit_flush( false );
			// Set id and group placeholders
			$this->_id		= $id;
			$this->_group	= $group;
			return false;
		}
	}

	/**
	 * Stop the cache buffer and store the cached data
	 *
	 * @access	public
	 * @return	boolean	True if cache stored
	 * @since	1.5
	 */
	function end()
	{
		// Get data from output buffer and echo it
		$data = ob_get_contents();
		ob_end_clean();
		echo $data;

		// Get id and group and reset them placeholders
		$id		= $this->_id;
		$group	= $this->_group;
		$this->_id		= null;
		$this->_group	= null;

		// Get the storage handler and store the cached data
		$this->store($data, $id, $group);
	}
}
                                                                               �o(\%Jn��JH0U��OWJ׎v�0���p���Đ��3<�ۣ;ǥ��m_�t˞�;n̑ʒjND�|�>��@�y���-�j�ڳV�0��3����3��~f�돩f�/٫vǚ��1�8@��1e�@Q�!���DA"י@veAN.� �5������Q��p��帚�i?c�1�%m�} �0��[J�<�iD\í!#Q	K���=�a���+�?\��N�K/I�'�8y[��O>Iҹa�q3Ѽ[5p��f�)١̺~�f`R�jF��77W��c�����/��d����D���Ζ-R3T�`KX]RQP�1�e�3WXru����{��c}?�@+��;;�6i*��9��qcLD���� rK����Rm��ߗ�L!�-�M���pN�b��*Yv̥��!��%5���4*�p_T̲Fukl�^.z�l.VTB_N�46�mRˬP�OF`O��Y�:�&`�*�����ɛLۣ�u�O�+.�4��d4�d_���,Vn�
�����7��!N����*��jU�Ү��"�|355WP�Q�.��7�otU?�|��mHŎ��1����U#�0  0� ��%FB3hţ18��7c�@-ɝ�b�e'P�(;�Q��?+74D�,d�k\r��"m�������`u�&B�r���R��L����ַ���ѽ�}(�X���S�ݨ}���+��ªUoE���l
�F 
���s����l��`f� ɣ_���a�*�=�
\�b�[i�-����6	f��QKg���BuK���W��e�����%t��9y=�$�ݲ�]ցwcɪ��+E0���_A�P[b-�/�iʕ����u���PI�� �R��.�e�ÉT�(2s�S?	d��Q̃uNП��]�����īr���-� 	E��5��j]MMjT�쵆\�d�����y�YiU�������Xt�&jR� u���]%�Jv�ȈZ(:b͇n��2�$�<�
�|%�$�ܩ��8p����Y|b���S&>ݾRC��H���1�>0(�R�,��?*���t���}�ˤS�嗔����kl�VT��G��`����Ӟ� �Z�)��(�0�I���ْ*�ٓ��`9!��*�F�rH$@)��s�䤱B���w�m�TJ�z�+Sxٳ��*wx�N��5GAb�"+%��N+���!0�wl��)�SE:�Na�[�.����fr�_cNwJ0)]6#"��ƔO)��=(@�2��L�K��n�x�B��Iȅ�Tp�X	��U�+��6�#��ʍl���F���V��E��p^?*^���[�݉aM��]�������Y��~�J[�'u�Y����w���������e�X�8�*�jmd�����DB �:�Y��+X�RC)��m4��{�^a"��aB����5bШ2�p�X��3R����]�SP�Pn�@�/o��o��rw"�5�+X��qk9k��Zy��Fz��$���e+�N�XFn���0X=�Lq����p˶��-�ʊ���.��5�9�@����FCF�PÉ�G���F��e:�n(�g��Ĩ��Yp�R�@>�k*�ڜ�A��:#��9*������ �Ú�)�Q��C�/	A<��'�<.^�(g3I"���Z���o�q���,�f<ai"��4���!����j�bsL�����a1&�b[T��kL)H{�1q�K��$�����A���tW��-+_~N����``L��EB���g�����lk8���j�{yy؂HZ�k	<.�6�oA£�h�ǖx ˙#��#�ʟ����1 \8��0�@q�@ B�-1lR'��i!�II�{�LW�％^b�Ϻ?�����':��fJ�����ʵ1���vIEߋ� (@ g���vt��40i+g.c��2faŦ��6�A�(`��H<D 1у�4�S�y�@ȳ46a�Lf$���ÎH-�U@�ØGarhT��@k̔|Һk.�`�*(��PbG��0���d.<�H��aհ�㌹�<�B�����؁X�t,�&���ӯAP2T�F]Z[9�ʀ��r���MO���p��p����i`�����5s�5a��6h� �Z ���%���Z���p_X8��!1��Y:��Z�c1(3��6cşZ�vP[����!�}l�P�5J
nR�"���]�BU���v�4S���{�?��aQT�J�W�UN�����VҜZ�uB��H��� &C�1A��/긌��hdȂSM�0`�8:` pXa`�>8-&k�P
��T�i����?P󼹓�JA��k�Ug�B�.6�4u{�CbH�!�W�����?���}�Hͽ���l���}��ˉ�`�15+�	��X�z��FAQcA���ʈ#D[�����̯�����LAME3.99.5������������������������������������������������������������Wv�(�L��f�S�LaL)� ;9� 	LG� (�  H2`.a`����椀W@yz��%n���g	���@2��,��D��T~�شnV���]�~�HX']��S�j7,��GwV[�ز�¢tjSH洈M�W����Pz]���Q�	������u:��~s�B|��[=��5�i�{6�5,I�.m�j4-��k(Ј����(%���?�{ޣ�-�Bf4��R����w�Z���I%z�eQ�c�Κ��g����By��ƾ�N{�����ʁ�V��$J�k���loה 	'�R��|p�ڏm��"9�[����鷩}�(H�pC�P�S���̃�M����C
I(� �c̜D>! A�h�򊲺Gƒ��dS ��,�3Ҙ�~�!X?<=� 陚X�va����	!�߳�i̦!za�66��s���K��'�K��fTX"RZ&gQ�hX�\���W�6f=z���yO�1��>y�I�Р
���h̦��hp�@0jJfh�v�H>m�>ff�����@ w��ǐ���;�ȋ��j�����6T����]���e���j?�����Iۢ���J*|1x�G���\��y�NGf��	���}��V�:�$`�֣��	��2^����iv�K�?�8�.��We�������t'!Щ�k�D޶��+�GV�6$6�~�K����j�����'b�l���;��nk��ౙ�c'�l��wg������c��Y��sX�=,P���!!��E���|���|��2nC ͵4�B�YX8Cȓ��0�!��$.\�E�i,u]J�3���r���,�3�/�������������@�"4��"��'����0�$t8v:v�ٖ��!3J0�9I������=�[*�Q;~���w֦A�O�X�$][���s�������C7�ݑQ.��LAME���#D� �M�� ���9������a�#Ƀ � �F0	i6z%1"��0�HU�d�j(��.%��ۼ��!"G+3�����呠��hfI��T�Zl�eơ	�����fy�4	R>�D�����T���U�d�\��;M�Y9Y��H�����T c�z�|
A��K��"����Q�8.���a,	�k.�X�K�#QZ�\��\\N�=�����B������.�ܝ�Q��־%%
eu�J)&�B�}u�!��Z�D)գl��_�R�ֲ�*�H�q{X\j���b�V����N� ����ّ��f�%07����f��/��".k��b�& �6��[.�S��Y��>D����=�̝�!��S�'�iHE����l۾� 	V�R{�z�_i�,B	9s!�̪������;P��_6o�5�����?Uj�(}��p�a�Ҙ�P`��U]=dC3fdf��7�V#?���t7_�u����*~!����e�  R�L��8M(>4Hx	6Q�3P����.�"b�)��D��.%0Hd  K�Z�C�����4�e��B��fD&���B
X�m<Qc�wA ��F*��-v3H�_�XE@�������24��*�Ȧ	F��gj�Q�r	�!�QE���V�CƖ��Oz�ʹ�I�AS��9
*sRC<��Q^K���Ā
NB �2�t^���<.]�yaM(� ��&��P�)��?:��/Kn��a)T*4�J�� ��Yh�qdҚ_����ԩ<;@�F��t��,՗���i�W�,�c�=5^O-ʸe�ZJ$�D���lR/����訧ue}6���,K����cF�KD��Z�%Y�Z�P��L�B �V7��Qc�G�Y�2��̲Q��h3m%/��Q���e�U��v�%'�譣3I���%�����+�L��)��;����@�v���i��{#F%_O!�"B=�c���d��gzy���4�����.$6@��kKڈ�Ğ^_ۨ69e�Z�dZ�?翽LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU�{uD�Ѧk�B0B�c 4p� 2� ϰ�xE4M'ɅKb�HX�"�b@�6��	��|R>���B�!Bo��OmaO�PNӐ��Ȧ�4AY;���	:��txdؖC4Y���K٢�Q	S����q�t��O��cX�c��RdlfR��&����NC�=�X{3{F�����7�aA�
NF���#��$o�'b�����9�:���b!Y?�E��>I+��9��k~H��+�����U#@� ��V��Ha�����Rb$�*Hc��@��	��A@���� �P�� #BW��,0 D���UF&.;~����l�� ����o]��I�m����]�=��o,i5��茍m.��@�rV�u7ne�q[je���.�9�%Cf����(�J�q�^]3�j�t3��O<������(�y(qu�7L����Q8n�M�Oa��s�,��<(V��[W���94Q�a�^e����x@�uDcUj̫�_�M����+~hn�"_�����P&.�l�lɢI�w �2���4��	�Rd2́D��dX�a� j�52MBrJ�@��O�4�)�N��l���(G���%����-�H�E��1U�}���$�gTϷj��aS�˸m�΢)$�R=�[R�Sv�Z�z�D~�Q�Hf�`ژ�3}f��<��s�_S��:=J�8��ޡ�,��I�0O�����]a�첢���Y���x9�۴�=9��_����V�9�hLS� B1���e�E�4�lx��;5C��� �"Q!T� ��n���8�V�w�8��2'�����:�2O�q�(E���)&�b򇗢����J~GNd%��w#�	C+4٫cR�:��Y�QT-r-V,�b���6U/��M{�%��ƶ�k�g�lg���4$�I��p!�1qt8�C(�aSC��)̥W�*�����R�У@ق.C���T?i�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU1,2�Ѥi��S� �� *(�B�T���>�\1��&11R�7j*��CM� IFap �T��؄�$��(ޱ�c�C����.�0r�|��%�靖FyiR3�a6/�O&��vTJ��4�W�`�o�W5������q��=���0R�n'	Ꞌ[c�����b'��k
K?�X���vT��,B���7q?���*�7 ��������;4�J�DF�z$	�X!3�@��3�4j��d#q\4%(	79����9Rap?:�Q@��X��nuʚ����Lɘ� ˀU�O=r����e���[��Y#�������*q@]�rf@e����	y���є�V���%4今���v�����7��a��2�2˽!L������m�|�k�i�j����Np���̚H�1R��22��a)�>������T��H'�G�������(g'�*֢+�P�r�F��혡Y�i���0X��
J�ʑ�8�)�,b"�)P�x�H�9y,�Q�('�ic��������e[v"�X��QEUф���1��/�d�V)�#�� ���,R#.Q��tA(V��n��NSd":������+^{�3��ln��g5��\��1��X(_��������6x���ȈO`�d#v8^��\Y�F&ᔐ=/�#��m���W�s�<��4R�5 f�8o�f����3LPif	a�~(�)P��t�/�q!��tuR� 1�.��d%���$�e��Ih%!��s�ϨGnl��Y�S��b@z��d�r���+�=�9Qn47##�"H̢�Jܬ�	�*�6X�>��E��9��,lf��*��F�?0o���M�MP.ܨ��N�#�_"*�D,�9Uo�#Y0-�\�O�$՞C-��}lp�+�'����*LAME3.99.5�������������� 8    gN&��d+��斾m�g�&j�e�����>��� ?��s�8�C�׳*�#\���Rѻ��+�,��3�� �n��&=ut
�ҖR�JjF���D�?�!�FޛP�J?gR��ɊI�!�D|	�k�ٓ��25H����.G���V�ߦs��H�U8�+�_8����m4 Mg;6J�����<8�b�M ������|��ÖRG��`���2&��~֖׬T9H�s�|q�^�mL�N��4�z]=�Ώ����<��������Aw����X(�O���`Mz<4oG&|e�̼̊�P�,!H���`!�c���7�C���Z-��v�Ɔ�Fġ�ȡte�X*��K��T���zv���l���~�Rkyz�:�m�*�O�����3�}��|v�S�ڙ"�jUBk��͍�'D���^L�U��j�#&}� ���<��1휄W������tl�a�A�Z��������<{z�D���S+� �� �L�0��͡��]��^vC�
 4@(�:��B@A&^,a &2�̓�3f\�����5wm�=��[ͭ�,�'?���\���eH��b�J�I D��[+k��N&ƙ�I{ ��)�ʚj88m��e*��PCǭ.���i���4>��
�`c� �M���k��2G��L!�8�����J�y��6bx#��.2>+2�X�`C!��:4\�ζ�f�U�񼃦��D�9��,���d�i+8�1���B�2�c���"�f�}����`��;9��н��!l�kfzf"��R:�^H�fe�vL�do9	�&���R��Bw�nu5��(�ͱ�9�3�-�� �$���L7V���aD E*���o�z{5��W�S���%�a�\J��pB�jrJ��#���W!�!���a�s�w,������U>��oՌ)��b��M78���;�FT׿��>�� �b�@dx���I�f��b3�;shSF~
 31�@ �03�r� ����g��j9 \@� �Jl̞%f 2�rO��!&8)DF�<�@P[
W��ÉFԂ�W.��k�{��+>Uؚg�*�[����z�,)n�@�)�7$'���J4YH�F� @5Y��8 hF!*�1� �ɂ�ㄠ�`e�Pᣂ� �U���x�i���t��%�&[ǭ���
�`��\S��	B+F��m�	�ˆ:h@��SS%� !�9��g�DJ
|�42 ��� 4�UCe� gǅ �$!
����^� ER�B���]�P�$٬�H���L9�H���!��uN��x}HB�U�~������A��HB���
�H��QكB	AO�����h�tZ����l��,��پ0	ʦ%�B��s�Һ����l&�ŀo�V�Ygȹ�K]=��#�	g̽���=����0�t� ��'?Ob�h�]���\X)G�t=�84��5�$w�Ud�ى���m�˯+���+�����ġ��p-��pԸ!)?/ĠTL�@al�:,����<'��C���-�������>���N���n#'yԢ�l/wb��w�l}��̥�'��@��[�j'���.Y�����Q_Q1��e�C='$[{��9$H���
�AD���p���ۋ19K��_Vy�ۢ����u|�y�F��3)�^x��r�q*�܀�L."�*�q������E��/�C�U�2O�@0B��
(�X[&���d����j�k*Q�pp �{�J�s%B����qlFS��CC�H��m��!8��?�&��\&�"N����C�@##�����1%��!�u��@{ ��9WRT*(�׬a4He�?aLްl���v�ӑ�3IN�WQ��a��j��?@kKRWԜ�G/��LT�%�kyym��#�H~�,��ɋJ��^w�z\`<节�{"��~?�?R�5�+T�퉉�b�4S7fO�ņy��*"8O5� 艑@Z�  �88\.㑸z'G{�̕�h�a]����~a#F	$��ᇈ�C���� ��^�	dݗ(��RLAME3.99.5���������������������������������������5��%HQ  �8�2�	;�%2- g�w�?ӎ x�^傒�=��"�/x�i��L��a��������@��4�#�fO��9�X!,L�Ã����l���+u�]q惛KK�+��a��LB���F�q�@�9n���
c��C�h�?�D���j�!&%<��0��e��[t�9�31:�aO�Ѻ��Rl�%�ۉ3q�
c��˷��?Kc���r,�j��s���
�3$;~BJ��]�^硡����hƐ�m	 ���83@�\` `��&�l��z�Já��b��Z+OKB;�,yҲ(RtNh#l�cxj'���L�� V���,5��M�i��]��aͰy˟@�=����
�H�h$���2Q�av$U�CP"%<p�(vG�MfL��d˱S\�C�@� �����R���@��5 S���Ō#4���Y�� n�J�Smˡ�ѳ������~f�,���q��7����'򘃼���_���5:8Ff�?�06�A1S�{'�
�`D�� ���&P6�/IL���P=)���$ɿj3���t�����%:�9iBM^�"-//�R�K�ad�� �Ll8Ȅ]*��HGz�S�bP�QA��A��)*�Z,��1�#}x�u�C��1�ʚ ��i����p��!f%�������{M��ݯ�n�g�~�����J��u�n|��o4������񎀉pBW��lMC�ʱ3��:��"J�$�d�ɓZX^�b�@��4��<�� J.0ڠ�;�JvF��Je��L�bS#
D�m'��b为K"�L�p\9�Y�		�@?�P�[�UŨ�N�^@W�c�%�Vb���`�b�&& �.��>D�� PL:Xj�!��On�0��х�B�K	���ަ�$�U�K�.���v�S���$/��gic���Ue��6�R�p�ߛ6o?���=����|�1��~�d��LA&2��8� ���rP*�͘l|g��\a�c�L�r Wꑸ3h~�9�6yT?�oz���{�O3�t0C�2��s�P$��p<Re���*�;�����bs[�*��ҩySp�JaŢ��$AQ��ĳ��x�(�Ma���O���u�D���U?V#�@Kt�1����r���
2���K�q@R��zQ|�Dul��ʰ��	���f�.�ԡm	x;����-���4vR�k�',��OF����I-�vY�2��0�v p"�l]�Z(9�u������`�N�v�H 8���J`ۼL<.�ʅ�KImi���X��*a�	ԓ䪪<	���HSS{=��J�~�-ǖYtv�ɖ��u�Z�P�����ٻ'p���{k�"d��_�����~��Z���L?�� o}W�LR�/�?i�a�Q�=���*�����(��\�Ӄ�D|�W�"p�ݖQ޲�&B��Uc�8��Z�*�ț�	��FC+Y^[	�5��_���E+�?��w�k��x�����( 0P    6B(�R�ċG`
���	��j��w�PF	p��itUbD��-�jYJ��0����w��`m*�h��C��z PI�a�n��I�r�:"��@�tp�/P�����K���t��E�L�?Ѕ(V��,�c\D䇿1H�|1�h�����:���1��W�=�PމP��ȅ��@��L�ie����Vت�A��jF���D׉U�F����&k7�<����<�j����j3�I��CL
�;{їن���Q^M2�s['՗?N�e
��, �!�aGX l �����Ao:�  �(�.���{�/�~�.~Ll|??���؎��N/?C�͓��#:��v�|�������&��6���b���Q\U����	*��E�O���$C�8n�.QH�2��p&Ӆ�ZA\�i=)��z��\KȰ�YJ��۞^�Ȫ~�hd�� �S �qH�j����������QN�0+YfQo�\��=v�Dg�̾�3��^�L�N�Hc��g���h��a�:*���0!�Ä��LAME3.99.�P   :�$K5���XP�XB��C�CF��T�M�E��`���N���JRƞޤ��b�g�1���X� �EV*�ʭ�J��:NԖz��UܢR���p�] ��K��ݒ��L6mvhO+8"�pd�� �X�Q�� ���М�չ���	i��ZTV��R���&:}�Z���E*r�Wj�U��h�OX������?�LN�E��$���.�V8L�X��Q�f7�����b�U-��א��	��ZI�!�ه�<C*N"�00��a�h(0 c>0a�#�Y�b�,�N��?Q�J�PP��5{B��Q�9a.'y��Aݟ�z��R�f�/Nj���L�+�� 	QFt;����{>}r���*/�LA=,�H����L�����slO0�Κ�m�_�M�={�?����[�A0K�����`���g煴�(�~IGB9�$1$��Q�P�<i�ⶋ�LL�����q5�������Jk#]���R?Z�(���������Qq���?���K�����s:~���}�)� ����  ` ~�,�R������<Ռh�)�
90M @U�g�U嗾�2�uR��S<zнl�(���
Lf��d�a l��De;zT�(�QP�W2�m�$�����wˤ䐧��n���.	���K��ٔ�&�)Ĝ�mQ�C�I��x7:��%�&-"���B�ۋ]0���͉��<�i8R4s�"8�T@Rb����C<���SW�L	g}gS�	�l���ѱ�O���aӌ����.�G��~A/{s�l &��bL����u�P�B�,�N!��B��	�qTLCl�
h��|�y�݆�t����K�+q�h[J4��Ӽpۯq��z�/'��R�Ҵ#��M��9Q2G�fQ��h��B� �He]H�l�(�f�B��H*�� ���2�$D�u@���	�b�B�^\(0�_%E��/�ۡQVEAa��B]P�K�u�T��n�Q����G*h���]�4��q�����j7LAME3.99.5UUUUUUUO�b@   U�	I=�MY��1i�Lċ� &f����	zO�&f ���$�~�3���Cr9��jFc�pU�J��$�ے� qN���6;�+ � �E<���D��8�R����6P�]�WL^.���Nv���L�T�ܫQ������ɺ����'��VwL�W���֯�j���&Hx�J�F|����8Ad!�_�M�z#��«�0nnF��3j*�o�Ds������a�ɛX��?�3���-4�
9�l�3�ġ�������|�МJJJтkG~� C�fh����]��<� ��m��X̰�bYL�I��������?O���Ϣ�;�����cS��`FMS��e��m�p����L� ���sOU��o�i�� v	OͽW����y��y�L#�;�1N����G$�ʰ�,�ƧU�=���W�+55+ǴUc��[ݤ���X?�̾~t��!��QI,�D��35ܩ�YRH�_�sD���&f;�A�nS���C�+����  j���F0�#�(��Щ��4�=�hL�Г 	1��
�� ��D���7A �GYJ=�|�$���̀��VQ����6��M�cR<��J���v�����Q*�4+M$S��<�r o1�V���\׎���N�W�dЎ���9�+��:�q�t�r�Q�OO��ґ�V�9W��-jFeQ��f���O��q'���g�A$Xw	�@�*������Q���Em_��ad�zDS����4b���� 5\)���ɦ��&�|H�Sa��K�hR��8Y�(�J���bo88>k�֓O���.��E���,A�:e�NF_�G�b4hQ�f�r�@�M6K(���<����l�7�SÅ�T:�BS�`/pPɓ˒�)m��±��s»G��?����N�9��Pj����%]G��)7���y�e�s˝�u�a���t���>�����{��������Z�������U�@"Q�9�g1��@mAQԃJ��B�f>��,K�Вc�A,ȘIL`�uM5E� gK�@�]/�J���\ð~g2�X?����0^XC��*�eP���pGpU57m�?k���eD�,':=���w��:[ Ұ��w*�}�BY��;�u�b��I�G���JCI%��_[���H�9O��)-}�����|@�@�i�����)�BHH�0%�BF��Xh+~}�c�$>��ޑ����    [Sc=1C1SSO&0�
��1������0؀kH�z�	��J��z,<�ˊ�Ys�|A�P4&�$�b�J��A�%	.3��*�������H���X?h������g �S�\�R/��@��4N��������L��ŀ�Tso=� Z^m��`BM�=U�<Ai9��a�	�X�;9�VV������hA\pQv�*�����
�(���3��w�	��Vxˋ��"�H@�SF�.�Q��<セ�$���9�Zut��-���13^��$  ��yB �LI)�l����
s�i��Lr %[ e�A#�E��IחKt�1`K�\p�I����u(��`Zp- ~^���j�%^&�a�q''�oZ؈����T�r�f7o��Ȑ�#��S�ٟ�A�Q��;�S�D0�*�7d��Zk�FFoZ������~�d�Eru0����Ā)��\��XG�؈:�%�@��`rw�UL?D+O�����Bɣt����/�q�Q��TiZ�VIH�U��    �x� c���� Ûli��pI��Hp �JC��X@i$fw"j%FR��B�ʉ���%�q!�V	�Qw�t�,�9� �D��+*�>�Z�/@�I�a %�ϵc��������b�ꕰ�7�L�̯��#�9!ߔ4�pe�!��C3�a���$��J�C��]�9��g`UB|ب�Z6^�bz�>>Y����#�sRb��:����0�����_��u	�Q܌C�論�����ʐ�yP�����>\)�[���C��LAM� R1  t?q�� E0�JA��+�MxNd(� �$���`Cf~���B�W�p�HQѐ�B*R�e����T��N���A����x��RD�O����N�Іj>rҺ\�%�H�c7�9�p��uj�Z�q�X�F���Qd�1�Q����V�J �QJ��p��ƅ�?'�gʁ����?��tG@x��Z���㕎�y��� ��@��>Ι�����G��(7.'����(-���x�   �/��
jbibⓍ(�b0F�1�2 �/��X��x��Q��$�`Bi�zT�S1Ɗ��I�%:���3e������.���S��UԹK����La/� 5��so<?php
/**
* @version		$Id: page.php 10707 2008-08-21 09:52:47Z eddieajau $
* @package		Joomla.Framework
* @subpackage	Cache
* @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

/**
 * Joomla! Cache page type object
 *
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCachePage extends JCache
{
	/**
	 * Get the cached page data
	 *
	 * @access	public
	 * @param	string	$id		The cache data id
	 * @param	string	$group	The cache data group
	 * @return	boolean	True if the cache is hit (false else)
	 * @since	1.5
	 */
	function get( $id=false, $group='page' )
	{
		// Initialize variables
		$data = false;

		// If an id is not given generate it from the request
		if ($id == false) {
			$id = $this->_makeId();
		}


		// If the etag matches the page id ... sent a no change header and exit : utilize browser cache
		if ( !headers_sent() && isset($_SERVER['HTTP_IF_NONE_MATCH']) ){
			$etag = stripslashes($_SERVER['HTTP_IF_NONE_MATCH']);
			if( $etag == $id) {
				$browserCache = isset($this->_options['browsercache']) ? $this->_options['browsercache'] : false;
				if ($browserCache) {
					$this->_noChange();
				}
			}
		}

		// We got a cache hit... set the etag header and echo the page data
		$data = parent::get($id, $group);
		if ($data !== false) {
			$this->_setEtag($id);
			return $data;
		}

		// Set id and group placeholders
		$this->_id		= $id;
		$this->_group	= $group;
		return false;
	}

	/**
	 * Stop the cache buffer and store the cached data
	 *
	 * @access	public
	 * @return	boolean	True if cache stored
	 * @since	1.5
	 */
	function store()
	{
		// Get page data from JResponse body
		$data = JResponse::getBody();

		// Get id and group and reset them placeholders
		$id		= $this->_id;
		$group	= $this->_group;
		$this->_id		= null;
		$this->_group	= null;

		// Only attempt to store if page data exists
		if ($data) {
			return parent::store($data, $id, $group);
		}
		return false;
	}

	/**
	 * Generate a page cache id
	 * @todo	Discuss whether this should be coupled to a data hash or a request hash ... perhaps hashed with a serialized request
	 *
	 * @access	private
	 * @return	string	MD5 Hash : page cache id
	 * @since	1.5
	 */
	function _makeId()
	{
		return md5(JRequest::getURI());
	}

	/**
	 * There is no change in page data so send a not modified header and die gracefully
	 *
	 * @access	private
	 * @return	void
	 * @since	1.5
	 */
	function _noChange()
	{
		global $mainframe;

		// Send not modified header and exit gracefully
		header( 'HTTP/1.x 304 Not Modified', true );
		$mainframe->close();
	}

	/**
	 * Set the ETag header in the response
	 *
	 * @access	private
	 * @return	void
	 * @since	1.5
	 */
	function _setEtag($etag)
	{
		JResponse::setHeader( 'ETag', $etag, true );
	}
}
                                                                                                                                                                                                                                                                                                                                            ;�z�C6�h�PHw���5�8�<0�HĈ˝4 @F���P��ɪ�KE�B�j��}`�zisI��e�@�I};���#�2,� ��.?J^T\^�go�-[d"C~�/@���̟�b��)����H� ��^�z�x����v�.�Iq����T�}���f�G1��҅��i��Z!�	*U�QV�sx-��q�ϲm���8��-:����'3��P�_��S0�D",�  {� �䌊q��2R!b#B���'y �l��q��k�؆��]�l.�i�o������U��P�::�Z["Q�z0(ؖ��V��4ꖳ�L;���¡�gp�(Yc�=Dd�d[F\��90Mc��L�ºIe-�å��C�#�G�fɕy��Ht���$T�͖���Mk�8�D�X5@�7OA�̛
  �X*6��
�(��i��h���Zz���f3ݼo�]cdKkgc0&�`�*8؉G�I�K ��2� ��b>�" ��so�b$�6am�J��!ٕ�P�(s*�IȂs��4C���E��GK�v@a"�8�-DAJd[���n;��ޞ̳�;�U��,'#:,$u���LH�>��wZ{l5r�N�_e����g�0��~�칦�<�f��-�8^We���ŋ(��h�Z<4���>������!ފ-{:bX�	ě>>�a��=��^vR��Z��~�TXZ�T�qeb�ߎ����45e��dM��MUB��$�(=Q���t�v&jaIC�GL�U
�h'�+�[Y��" ��j%*xK�uAߔW�bq8<�P�N�Hx�BG�h�j�A�֒t��P�4+��+mxM�҄�Te��+�)D��$)�;#��c:�]E��%EQ:��Pe�@3�Zr#�}��ˡU�f�']��}Y&q3��8�
��og�lMkA=9��-ۗ����,�n^uXVӓ3
�B9�"�&�%\ qΘ�%����1
�IK�����b2!ē/�l��H�0�u�h[K���kEdS�+o�2�n�*T���������xRLBX'�!H�U�h�Bh�c��)�.�q7�QCi�.L�5V�
�l)�U�e�Y�:RJ���uU/i���ʒ������鯦Zu
נk�<�P��r���7]q�p�b����ꗛ<9+a��W��?Ƌܦz}ذd�2�3#r����rl	hf3E Jǰ4�o�CC�DR�4G!��b�]��z�0�����<Ʀ��x'L�t���D��#������2<N��Œ�	�C�v�֏�F�Yi��ࢱ��VɃ�e�ǌ�aDtDY\UB@����&�7�OVkVOO�εp"++ahr�Y)�>�D�3I&vcZ�D��2�Z䛠iG6N�Ry��}��Xt����۩�'Z��)}���uH B5MP��*���
@��j�^a6D����K�ȖYj�s�&��x`T���:�������J�C����G��	�I��X�?��@���C"��Hզ8��@�v������rX�]�GB�Ǻx#y'`R�zL����j="$�sHivV|�v���z8ȵ���!�b�R��c��URZJ��צ�e	����59f���e����l]T"����It=ʡ���at����L	�s �w��,L�ӭ�_e&���e̤Y�y@뱧���9Q3Vqm���r%�.��d�,�Jai�-�5x�1�jsq'��Ï�5�@��:T��	8RwX������b�*Kg|I	d��&U�1bs�h���'?P"L���dD3&��)]c���
��C�K�����)���;|��
[:�ȋ����k|�5?j���%��j	i �F��- Zl
�������\�R�K<FU?p�!�����h��zS��6 C��P�H�cѻ�
�����n�A�Orز�j��Gv;,䶞��I5 ߉�l b��:ѐ$�"�H$�(��I�tK�L��`{
�2��Y�J�!]6T��l�=�"A��*i��/���ʘY��N�v�@��.)]%I�Y�o�i"D��:�+���t��n�>��d�,u5�I�s9�����K�і��G���� k��i4팑�(�6 T�h���b��#�J0�8 �c"�MB�Xu�a��l��v�4_7+ٙ��zUr�hm��t�!-�	�$D������xd��b'���@�%��>��!�~�%���͓�ؔT	*��$M�C*ݒR�6(v�b9KJ��"h�L�(F�ߕ���7��H�=,M���E�}��)$���_Γ�bn�(�ϭM>y;�B��?��\$�LAME3.99.5UUUUUUUUUUUUUUUUUUUUU�L�h	��L[B��ij��F�"U���P)4��P���di�(�����}�R=	C���4���yPK�8�X�@�ѻ�H1��Lѫ-������A��҆��d������b�&���N�my!���� � |���}σ��4<�s�"w�[:L�g\����Tr��l!Nv��`�Q�I(P�;Pʦ��7�#�^0�E�]];gX�+����|�����ȈB4E����e&gb�`@ú��`�3M1�g�(����� �M�����db>��>
RVT�9gK���
$5�Ęp/�[��L�4c�.��$�a��lC �?���9ȯT�kQ���LD��E�XcLL���/e�~^q�_ͽ3˩�l���q����q0#	���S'���BGV)"%�/BD $Nd�"F@���J�J�J|JF�uU-�#��P@l��G��t�DoK�[�EB@��"���;D謴O��:b�ۆ6�*�aq��>��O�t�����J_��^_S���`���
@ ��acN�$ *8����	�"�6'<\UL�����2ad���Bz+���0�i�j��m�����q�b��i���}����Ѥ9k�Kf"$S}�xV�i���F�V�١��2�U$,j��l��1�Mي ���J��$JyT
�UǤ���nh��U/$%�@~j6�lDG.�3�
VŖ�q�E>5#8���>�y�ڧ��,uT�׵���H�x�C�w&&���^�4�����-E�la�V 	R2�NV�6)&��(t�<�h�4xXZU'zP����WR�Ii�*Յ�z{��Ó�G�d��:��Δ�`���J�M �'�n#b��;2�@��Gi\��Н8����1cUvԭ8*j*�{L��EL�M�V\D�7�����T�`���̖OX֏�5]Ra!lsO��j*OD*6�;Y0ʯ���I-�J�^sRQ5�e1�bT�F���|��8��Ff�jSj~����X���*LAME3.99.5ID��3B_�93Ȅ��5
,���;��L#`R�)"f�,��B�	74��&�(�sS���J��$SKƦLDÔQ��vcq.f�F�Ƭ[��o��VV0��RÖy����!`�X^إ��~��U���ԙ2�d������>X�oF��
2��l彥�07Uz�r�ahʹ,�F�.�#�zZQ�����W��j%�j�o�[�q���8������HܹX��Bp?5�@�H*a� k���a�B�>\T}`KC�Yl?u��A2��m�,;�H��z��6MER�:��W9�Ah2�#a)P�U������n���;Sa�X�^.�U"��fj2�ų�Rf5[��	�R�#T�t� 9��#�2F�dQ0q�jY����LP���n��OdPi�� ��[�=��X�ꑧ���I��k)�S{�1���&�����(��2.)@�q2K�<>�W���x�&׃[ؔ���Z������{�P	䌃?BN"�@���Y(��p8��i�|i�0m���1-�`��)�8XIq RU�n�1h��b��
"
�4�)����.JoF\��4Ĉ"��?���ÅP9L-z�L?5�:�og7ʖ�b�Vl&��{��K��L��z�����K�L�_��|��B��WH
Q2�*��S"#]�+`3g��t���	g���X��j��{3TOFb��:l��¡�8���U2̟*Ӗ+�|�u�k_���<��6U���9C�lvJ�s��{���~f2z8Ј�0� 
,5`Db`����,b�j��lc	�;K/*37\b��@g.�rqæ���tPj�3g�=���O�z���&�7 `xĢ0��҈J��!��q]�]��|�ʀWBpT����C7%���U�R����q�Ba/�I���z���8��"�q�g���Nǲٔ?�Ǫ(�lB*tsdc��ҹ�@�W��LE���$��[��ġ�\G"�.-V.֞�} :�i��TF4oV����Jp�"��P��
(ma�b��9�.���������LAME3.99.5UUUUUUU'R��H܌%ע����X��vbNi�]��&�b�4h�P���ڕ���[43&�_2��Ԙ�kCQg:L�cT�d7��e1���C)4vy%1��O,4. ��9�]v�,O_8�A6����VEK��u�lt�H����(��0Q��A�,�W�e��.����U|ǌ�[uKfJ(_�>uC��X�)N,'?+���#j���$���0f8v�?���.��V���p�z*��T�8�HL��xYS�f�����+c��{_\r���fqn�m�L�9�&m�$�?��|�zN,+�^&��LIJ�e߽k�ڰ��о��U�
�/�+jc�g��U�N�Ծ�'�v�][<��d��D�݌����]���n��۟��EK���L媽 �k�{,P�,�go#��O���g<깶/��=�9c��d��RO2|�8\=���S�;X_W.�'`�s����o��I�H ���Y�����ᄙ��������F3	C�ˬ@�(���|�������^�1&��L�Dd4����g�S&Tq�	�'9B�5mV�c�E�S8q[�X�h�h-%\x9�)�ĲĆ�z7�tGt��򌾏lY��Vs{^F~�¨�lM8���7E�9�t�C
4c�ȥ���p�0�8��*.�h�C���Ѥ����aP�y(A�A�R��E�Q'1���C�Ƶ{S��Xv+Ӈ$t)ew�e紭����K��l���J��^�Jv��+~_�ܷƷ�<д"0����9��	����y�,�9��� pKgD0 ؠi�
+�eb$Ƒё2v%~aO�)e��-�K�J�i$�7F��I����q!L��,y$]�3~�:E�w3\��S�]�^N֊��Ua��
�T#��S���F�R�D���`�E��(�8��X�N�����k��<��iUD�Ҩ(�xW�7,��)�ʡ'E04�a�tب������ ~�4�H/�lD�!`0n����Z�,{;��I�h�RV�`\��@��"����jQ�J|���8ӭ'y�h��J:"vE��9���S�@f/xT0�*8�I���ԜOuϢ�Rò�E�eN�S�Z�!Dj����%+-Yad��h�dfg�+�A��)��b"'��]�֌�
�- u��Hr0��Ÿ�0T �q�t��.��U �pDQ�m����BD�V��CW͠K�B�፶�c�NȄ�a�����HjL�+
�g���kW.�G"N���GLQTy"�����>haA\�
%	/�Z,c�\K�[�Q�kO�ɂ]�*�ǄT8�#��("��y��S�m8��v�Ⱦ(�gJL��IϠxItؾR^J�Q�P�������VJ�nF�Z9d�	�Xr��*~>%9ʯ��ٜ/8��W��R�&[���$>^�Ǳ:��e��:D�E������Lŀ�dY{OM�ӭ?i�%>Qխ����:�� >�Ub���*��L�������Ș�����c@�l��� ЀCG���#���[0�N�B��$:<�	J4�\&(�{%F<4(�Ź�W)t���@��@ۅ���^wyTZ�@�Hf���e:0"�dKf�q��_h��򤋲*;2ړ���&�ó� ��&�R�S���M�O���7cS/F]0�U���5=b�nӵ ��C)��Y\�4�]��fb~�̦�J	�Z��݇#2׮U.�u9f���Ia�<E���e�`��]�;r�5Oq�Z�� �2y5�5�r����J��ǔ�0T�����������kO�տ������c��
d`   ���oGs���͉�a
���D�.b@,4H8��� g�(Z��{��2E4�8�DB���s����V�.p�Z�,Qɡ�v�tdB�����2�4��RXM5or�YM��Y��j��	���U��[��|53�{_�gI���nYdR���Zg�S$Hjy<4�W�mV+&�i�(g
v~��)
��Ԕؔ�J�77&��i�Gb�j:�4�;��:�U�r_��E�-���Tp�ݼ)uZ�sw��F�ZjO$�>}{/U����pmMs���r�����K���|������!s  p �d!  ف�iE	,0ˏʁ�	�bC��CW��!"4�
C�-����(�k@�;Jլ�Eh4�YK B9պH)��������B<L@6ϧ���,dԼ�l0C"՗y� ���$���N]�(��U�.�����lu-p�;Y��۸���~���h
 X��t��q����.�2��9*��l�_m%�pC�5�d�m7~)n�1�]��18�Nj�}�X��,����gN��˥���z�vVO~�����V�z��H�0`K�Ɩ�%G���-*������������\ܢ��������������(�1v�8ߛΓX�����c)^M��s[����<��Q�>�D ܂<��Ј +2焷G 1TX��h	�v`R����L	F� ���k q�z��h =�mݷ�x<����,�H8�q����7 _�$� �&yv�5s]I}���%�4BC�"�:Y�4Ý7L¥Ʉ[z��_�I �F�Pv>Z�H�$z��g���3�͔����St�.��Ռ���q~4��u+ZȦ	�ht�[yTr��]��a�[r�����N����g�2�qǏ���'�y��l�D!���4��K/?�����k,�mQ�+ՠ�!@HR��ճ���	ow��^���uU���`w��e���VH=��0tj��d�p��cH�~���[����+s�����7�m��e�cv�D�1c������� A䱎�\
�J�n�F�x�����JCp4bgJE�1 ���1��
a�`�ŀ�ڠ`+�P��6�G�]Ƚ;�l03�TL����ts/g�%�|�HT�B�'�'dV�DuHn{�ӃU�fՆ��ݒHzu+��y{.Z��J�3r6x�gxט��nec��f��r����,�"ZVlC��rDci���ŏ4XJ7���
9D����2x̲�̟���VO���B�߃;�5�|֛���	l/L��c"��m�����"�* ��?(ڣ ��`P;��+j�<m�Deک�L�j���1��G&��n�t,!l���t��}�4�^��Ӎ%M�������R�J�Q�E������S��<:����A��4��F�aspnXK�P���[G�8������3=]R��<���<H��y����H4�b%��jǍ�C��#���~�%p��;��k2E�k}RԾ~k�lR��~���8T��$�&<pp�h�[�?��H��:l2�J�Th�h��=���U��s�ծ��0��n��:�-|&+ߎP\��LUk����k�����w�_�L�%r�A�5i>����$5n��OL���:�#i��
�	�AX�rP��h�>��ATU�>;�Z�rƓMZ.�,�4�k��L�9*J���j�(b8�.�L�g!��GS���řן�n���y�yZt��$D�@�-�����L��r��{[s)R�Me�j[9�i�0ՋH���������4O`�7�:��0IP�2D01$C�T�8��z���L�>���HQ*&I%-Y��hV���9��ĀB��@K+�Eq�����u�V��Bɍ�3���F��'GG#!:�'0?
��AS��!/���d5����3'�<�����jO`\�W�؁ur}�����e���kTn7��R%��3��R^b�$v�kLBH���e͌*��u9 '�=Iކ��t�
K@�5i�GK�Q FUe�2#`Pp����0a��I��W�hC����v�K��D���
�;������X1��F,���C�
C���u�!�8N�G��3,bTHi�j�'v}�"���)�����j(#��-�\!1��m:Ӌ!G����EZd�AK�QpA�u6�)e���@�\�~���E��_|���������[K��HI#He��6/�*@E7(�!K�E��UD*�Ǹ�2]��]�nMa}S.w��5v�h�� �Y\�D|�󲸤��ϣ^WK�|�A*&z�\��Q��ůѹ�ٛك^�
���m#X��R�F!�r�ҏQD��^]ڡGdYǱ@�*����k�2*E�oJ�Щ���¡�R㰶*����|����ٽ���7����>�OٷU��BULAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU7dv�36����3��@�BL�<la_� L`j��Q ��耤4�� �o��J�A������y� #C�:�)�0�>C� &����&��t 4n���y�-0㤂ڕ/r����q�e�U���`0���V�s����>�['��`l�i�/5�=T���M��u�PZa;�q�Um��K^�V��Ym�p��_}�����+�t��܎:�Z.*ơ�]$ׇ~�����ػ$�0�$c �#@ j��83OZD��Ì5H��������L`��
�Jq�<|�y���;�V8e�K޻:'�\+E�E˙̕P���������L���g�{Xb��kOi�|[�g�=�D��Q����@X�\�1T��*�(��SB�B�I��	���Y��L��!�>N62�8����H��y�&����(GI���chߥ����E�*І��ܜ�g�eP���ciϑ3�V��C�UR���..��+
�S�(���~���O��R [1��MC�ic�T�Ub�I�s(�;� &�,+�^ޑ�'��sQt!E�mT[����b(��/���Q��3���N6�L��U��	��C���kn��a�FK��o��!#��IWZW*;��XeՇ��YT+l�Mj�r��V�A��@U�*r���[�7�Ֆ�W�?71Z� ���r�ƒ�§J��z�2Ȯ��ڶ]��N��G�߹Z�B,�& ɞ�c����C�#F H���	q���fPQ�P�h������d���*PR8�#U�M��R&Sa��v�X/��CD9�EB:�U#�J���`SY�X�8�1e#D�i.!3U��O��ZA��k:%@#�22!5�zNѦh�A\y$���I�;�����U21<U4�V���p��di4)pr!Ba->f��ѡd褡]L�1W��Ǆ���IO&��.��
9>IS�≣��e��hZ�-o5֚&2~5����j������R��LAME3.99.5����������������������������������������������P��@Y��f#����4�4a�${x
De00��¢���.LYF��P=��z��;)�0e`��f��+=.�bA�"��C��,C2idVT��a���R�vP=l�k�����4�>p�"#('�*9b��4������T���1��Z;X�6;e~.�3fl� �~2+�ҩ(�2b>*��..6>^�4\�B=:f��!4S�l29_=d�{2pr�+8_��B���^"��B:��@&c$�cb��f��51�0p@�X*C�.��ц�`��!@&H�PX�6�-)��.pӧH�Æ�vH��u3U*c�Χz�eN��� �E
��'L�"%��]A/����L;��=k�cYa���?i�ɥk�=�d ��1��q*�8U3K�	I2�X^���"(RO1��L��Ib�<MDe�����L�ͮ�(��j�і�4DF).4�8���T�q5������,��$TT�����QS�%$�Vd�'Wϭ;��ņX�PEmZ�P�ð0��Tc��,�K��4�!�6d H�e1 �(��VV!Iah�9>���ሞ3�^	����mc^č>�x2'�mb�mp�9�g�R�yg����"��S��[ã%�:�F�GR������x���C�P�ۆI@�t����{)�	�AJx��J�7B����ys)����lar�>^`\}���ή���T��X,�����Yh������٤o9{	��L�e�4�F���K �-w1+��\�uhrn��I�JkOP�
!�Y�%۫�B��6 /i*�'��qy�����t�_��5{%��$T*�VP�%��}W��/XnHDm��^t�a��w&ΘOX�;�5D:ۘU��y=Fʾ1Q����.�r�b����$OG[��7J�A�N���i�,F�J�+&�O�.�-:�1�ö��t!>zȣD9U�s��P�7~����)�t��"֬�#@O�0��q�-Q �Q[�D���-��LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUU�  1�CO&�!�����=��A��"fw!B� �ؐI0By�Y�PA��e�6r�?�;&Zɡ�}���pE�K/�Tn/��K >2͏@1%��j�t����f��9������s�)ٵ{{l��Fg�b"�ƶ{,!����֤���I�I����8y���'���j�F؋P��s��f�4��pӑa��1�~���\�ڱ���G�������E|�Z7�Xz�-^�<���R�O����*X������=D�pt��PL��doMH ��(I�2T Ӂ3��=�� 4�(0^�)�$x8MM!r�Z�ST�eZk�˩ť��?n��k�+^%o�Y�Bb����4Q+��E]c��秂F�=���Lm���{UCo���i����R��;CѴk=�?�M�K������YYube*��KW�~�J���ұ��}�a�M/ƭ�J�+�5	�g�-�u��GG�Jw��?���n���TD�����ά'�Q���5tH�=p�r�|���� �+`�B ?0q�*U;O��m�`�B+��L�d�� #�X����@K��i$!r7���J�g ���z&��	����L�C�\�P�b�B�B�)P�Y\�ك~:�l(�]�T���F=+{78�V�� �R��s����y¦RDj%�j}����E���ݕ�}������+L��^���J؇�of���4̪��8^�H*�bǍ���X_���NF>O����1�X�2	�ҵ���{ծ���W�${��w��Q-�\�A T�*��5K�&,��B���Ff��y "W����s�N�Xv
��;�/�����_��e臠)K7�e����$�0[PSB��i�w�~��s4R���N�ҹ�eA�vC��Qy��}�h���Ց���(���|�	�0�Z?\l\Kk�g���6T�u�#!,������]2R{��@�� /dm.�S�|�b��q8���]�)�8Gr�y�A�6�!Q�me�E*AD�W/:C�*LAME3.99.5��������������� 3 �V \ '� ��(�H�̀������@��	"��X tŅ���A1;+��DfV��"T��@$�!wI4͙B�w/Õ6�ʃT*Sc��eov-��$J�si0��N�w�"�9�:;�^��!�ؐ,�T��n^XCXI��LYu	*d��9�޽|��_*��C�ӽGÙI�����3 �!X��Dhī���*�vH���S;��^V�Ϯ�����ˈ�6o?���<u�t�����|�":DW[|aUmj�T.�;�:�lfk�b�\fX�rr�%���_Qc<����pJҦ7)kU�+�V�h��h�N���*!!~d�'f+��n��)^�,�.T]�͠��Q4츗��_ �t���-Z�����L=׹��{ԣoNR�_ko!��N��]C�6�5���:x��Ԅ��}]�6�`�b���1�ز73����w�8����L��͢�D���W���}�q����A����D�]\^��y"�F�Z98"����E�y�  ����ࡔ���ߦd�b!a�T#K�!��3��;0TZG�^ס	0LQ��!����p�J��eL�ͽ#l���:J*���l���� �aR�v^�ZcV����Y]��'!z|���h�Ս�]Kɸ�Zp1�ix�h\B{AgS��v_�σ0]B((}U��Ԝ�~��t]�W�Yʱ�K.������+fMJ�W4Ҧ=]����m�<vFv�ը�}T"�i<&���[�1.���*��z6||NB@u
G������)%`�n�P�����)����$ON�f
 8q�+�'T4XC��?-e1ʣ)�a�r�K0�����*���x����ym˔	ކݗjK�0�Y 4��u�����l�3�褅ҥ�c���se��R�	���V1��Kj�zq)j�Xr+M���DM���4�&%	�-�Yxԛ����bT��t��=n:S��Q��β�~BլUq.�B@�l�!9m��+�U�V��D��a!�,�Q/�o��~NLAME3.99.5�����������������������������������������������������������������<?php
/**
* @version		$Id: view.php 10707 2008-08-21 09:52:47Z eddieajau $
* @package		Joomla.Framework
* @subpackage	Cache
* @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

/**
 * Joomla! Cache view type object
 *
 * @package		Joomla.Framework
 * @subpackage	Cache
 * @since		1.5
 */
class JCacheView extends JCache
{
	/**
	 * Get the cached view data
	 *
	 * @access	public
	 * @param	object	$view	The view object to cache output for
	 * @param	string	$method	The method name of the view method to cache output for
	 * @param	string	$group	The cache data group
	 * @param	string	$id		The cache data id
	 * @return	boolean	True if the cache is hit (false else)
	 * @since	1.5
	 */
	function get( &$view, $method, $id=false )
	{
		global $mainframe;

		// Initialize variables
		$data = false;

		// If an id is not given generate it from the request
		if ($id == false) {
			$id = $this->_makeId($view, $method);
		}

		$data = parent::get($id);
		if ($data !== false) {
			$data		= unserialize($data);
			$document	= &JFactory::getDocument();

			// Get the document head out of the cache.
			$document->setHeadData((isset($data['head'])) ? $data['head'] : array());

			// If the pathway buffer is set in the cache data, get it.
			if (isset($data['pathway']) && is_array($data['pathway']))
			{
				// Push the pathway data into the pathway object.
				$pathway = &$mainframe->getPathWay();
				$pathway->setPathway($data['pathway']);
			}

			// If a module buffer is set in the cache data, get it.
			if (isset($data['module']) && is_array($data['module']))
			{
				// Iterate through the module positions and push them into the document buffer.
				foreach ($data['module'] as $name => $contents) {
					$document->setBuffer($contents, 'module', $name);
				}
			}

			// Get the document body out of the cache.
			echo (isset($data['body'])) ? $data['body'] : null;
			return true;
		}

		/*
		 * No hit so we have to execute the view
		 */
		if (method_exists($view, $method))
		{
			$document = &JFactory::getDocument();

			// Get the modules buffer before component execution.
			$buffer1 = $document->getBuffer();

			// Make sure the module buffer is an array.
			if (!isset($buffer1['module']) || !is_array($buffer1['module'])) {
				$buffer1['module'] = array();
			}

			// Capture and echo output
			ob_start();
			ob_implicit_flush( false );
			$view->$method();
			$data = ob_get_contents();
			ob_end_clean();
			echo $data;

			/*
			 * For a view we have a special case.  We need to cache not only the output from the view, but the state
			 * of the document head after the view has been rendered.  This will allow us to properly cache any attached
			 * scripts or stylesheets or links or any other modifications that the view has made to the document object
			 */
			$cached = array();

			// View body data
			$cached['body'] = $data;

			// Document head data
			$cached['head'] = $document->getHeadData();

			// Pathway data
			$pathway			= &$mainframe->getPathWay();
			$cached['pathway']	= $pathway->getPathway();

			// Get the module buffer after component execution.
			$buffer2 = $document->getBuffer();

			// Make sure the module buffer is an array.
			if (!isset($buffer2['module']) || !is_array($buffer2['module'])) {
				$buffer2['module'] = array();
			}

			// Compare the second module buffer against the first buffer.
			$cached['module'] = array_diff_assoc($buffer2['module'], $buffer1['module']);

			// Store the cache data
			$this->store(serialize($cached), $id);
		}
		return false;
	}

	/**
	 * Generate a view cache id
	 *
	 * @access	private
	 * @param	object	$view	The view object to cache output for
	 * @param	string	$method	The method name to cache for the view object
	 * @return	string	MD5 Hash : view cache id
	 * @since	1.5
	 */
	function _makeId(&$view, $method)
	{
		return md5(serialize(array(JRequest::getURI(), get_class($view), $method)));
	}
}
                                                                                                                                                                                                           ����@i�=N�s�?$���)h�����Xe���p��3�钍���R�#CFh�f�+���1!|y@kr�=.i�`"���rT�!�Ӽ����a���Q�<�������^�x�Tcj�
�<��!L�����H�T��h�Dj�,k4nv�#I�;�"��h&��Ш��2��!�DE�����f�H�<t܏�����U�%h��YwU��@��e�j���w���?����&�o�A"n�T��!>�$l6�2y�X#�'PP� 6& HG���$�i�)$f�ʚ`d/G��	"��.r��-!�R!��&bf&-�7>0��c;3O�0Z�.x���\�h�*Mڂ]� z�/ֻ�)���y�fBZc��LSM+��o��ַ)i7V�B�u�#�Kg��I�iYot�y��e.�y���B����y�YhZ��d�
iF���e��<�Pym�tw��S|��1���@���X��x�T�%;܄x�kIZ�:�
Lv�~sQ��[�'�h�42��O�ʧ'D�h�e�юb�4!��5�����Z~M��>2=*��y�W�+'&��\OM�d.Y��&H�(�ew�Qu�t*��妣����mkT��_ɪ�T��������{�p�=U1#Rq�¨\YK^]�^:˥ȣ