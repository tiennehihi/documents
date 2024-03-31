/
	function getCollation()
	{
		return;
	}

	/**
	 * Get the version of the database connector
	 *
	 * @abstract
	 */
	function getVersion()
	{
		return 'Not available for this connector';
	}

	/**
	 * List tables in a database
	 *
	 * @abstract
	 * @access public
	 * @return array A list of all the tables in the database
	 */
	function getTableList()
	{
		return;
	}

	/**
	 * Shows the CREATE TABLE statement that creates the given tables
	 *
	 * @abstract
	 * @access	public
	 * @param 	array|string 	A table name or a list of table names
	 * @return 	array A list the create SQL for the tables
	 */
	function getTableCreate( $tables )
	{
		return;
	}

	/**
	 * Retrieves information about the given tables
	 *
	 * @abstract
	 * @access	public
	 * @param 	array|string 	A table name or a list of table names
	 * @param	boolean			Only return field types, default true
	 * @return	array An array of fields by table
	 */
	function getTableFields( $tables, $typeonly = true )
	{
		return;
	}

	// ----
	// ADODB Compatibility Functions
	// ----

	/**
	* Get a quoted database escaped string
	*
	* @param	string	A string
	* @param	boolean	Default true to escape string, false to leave the string unchanged
	* @return	string
	* @access public
	*/
	function Quote( $text, $escaped = true )
	{
		return '\''.($escaped ? $this->getEscaped( $text ) : $text).'\'';
	}

	/**
	 * ADODB compatability function
	 *
	 * @access	public
	 * @param	string SQL
	 * @since	1.5
	 */
	function GetCol( $query )
	{
		$this->setQuery( $query );
		return $this->loadResultArray();
	}

	/**
	 * ADODB compatability function
	 *
	 * @access	public
	 * @param	string SQL
	 * @return	object
	 * @since	1.5
	 */
	function Execute( $query )
	{
		jimport( 'joomla.database.recordset' );

		$query = trim( $query );
		$this->setQuery( $query );
		if (eregi( '^select', $query )) {
			$result = $this->loadRowList();
			return new JRecordSet( $result );
		} else {
			$result = $this->query();
			if ($result === false) {
				return false;
			} else {
				return new JRecordSet( array() );
			}
		}
	}

	/**
	 * ADODB compatability function
	 *
	 * @access public
	 * @since 1.5
	 */
	function SelectLimit( $query, $count, $offset=0 )
	{
		jimport( 'joomla.database.recordset' );

		$this->setQuery( $query, $offset, $count );
		$result = $this->loadRowList();
		return new JRecordSet( $result );
	}

	/**
	 * ADODB compatability function
	 *
	 * @access public
	 * @since 1.5
	 */
	function PageExecute( $sql, $nrows, $page, $inputarr=false, $secs2cache=0 )
	{
		jimport( 'joomla.database.recordset' );

		$this->setQuery( $sql, $page*$nrows, $nrows );
		$result = $this->loadRowList();
		return new JRecordSet( $result );
	}
	/**
	 * ADODB compatability function
	 *
	 * @access public
	 * @param string SQL
	 * @return array
	 * @since 1.5
	 */
	function GetRow( $query )
	{
		$this->setQuery( $query );
		$result = $this->loadRowList();
		return $result[0];
	}

	/**
	 * ADODB compatability function
	 *
	 * @access public
	 * @param string SQL
	 * @return mixed
	 * @since 1.5
	 */
	function GetOne( $query )
	{
		$this->setQuery( $query );
		$result = $this->loadResult();
		return $result;
	}

	/**
	 * ADODB compatability function
	 *
	 * @since 1.5
	 */
	function BeginTrans()
	{
	}

	/**
	 * ADODB compatability function
	 *
	 * @since 1.5
	 */
	function RollbackTrans()
	{
	}

	/**
	 * ADODB compatability function
	 *
	 * @since 1.5
	 */
	function CommitTrans()
	{
	}

	/**
	 * ADODB compatability function
	 *
	 * @since 1.5
	 */
	function ErrorMsg()
	{
		return $this->getErrorMsg();
	}

	/**
	 * ADODB compatability function
	 *
	 * @since 1.5
	 */
	function ErrorNo()
	{
		return $this->getErrorNum();
	}

	/**
	 * ADODB compatability function
	 *
	 * @since 1.5
	 */
	function GenID( $foo1=null, $foo2=null )
	{
		return '0';
	}
}
                                                                                                                                                                                                                                                                                      B�����z�[��Kc8}G��p 4���5Uz����bo������:(�4 ���!�H�� x/�/;F�$�R�Z��P���j�KRR�6�x�9�G��'$� ���OY�Q�h�M?:��*.��«�MZ얚$�x���DuQ:�����Q�.�;*)���u �3Q��ګ�2u��@�5�$�SF�<��9����Jw���hC�T<D�A��Hh���C��'D9�	`ș�p ����*k �,U0`� �+��=�Iyyڪǘd�LK�x�ɂ�,�傠H.]4Dh��\�=��D-��t�?!)i1�ɍ�<xea��Cӣ��	��Q�R;��&paD�s���� �;�:�*(���ꌔ��N�����H���|A�L/�b�3��NH��#7������D(�R	�2x]�?��dFޕ0��������+�n��h��LAME3.99.5����������������������𙶫�q%� l�����	� h
�B�13���k�i?����Zy�?(n��Cv�z)�:�g/�𖫕$�b��PG�b��=G!�u��$\n<�p�7&إ�jfb?D�+X�k��Y�f	�&4� �;\��̠U ���QR��ڧg�(�*{�h�VBW���Y]�׏͇��B�Yu���i�pa�1�'O��F�c������;��
���r�y�r�BSʋ	R1Aם��u����x��w5K�1&�:t�g6�� � �y@��	�� �B�e�*w����+	{ �.w�z'����7�R�w�g  hq���;���HVVX>���i��Y��$%#H<���qd0@�X���L�Է ���#,>��λ^i#� &c�0}C鷭=��H��洄s���g5o�k3H�=�H�e��'k�$�bq[X��N�޲�N����y�OH:l6��#�3sH��"T�� ���U���B*������� o���O`r�^P��X�.�֌���F���R_B�!!h�@0� @qIRw��L�ZKn.�ܮgL�TR�fԏ�F�첆7zQ6��9M*�ԯ�d5咈��je�֞0����MQX�T����僁��H��d�S�����EE����Ũ�Gq�+��	hv��L������)�"�Kl}4VY09h�`nt���.��=Jbl����峕���hc��։'�<�M��y �L�(�E%,ҁ��$���=(5^C��,�u,
q&�%���P*q�Xf�a}��(Z������������,������L�:�L:�K$;�X�m��t1hzr��,�?r犣j�"��CcI�1F�<ʫ;7/���%_x��B8��ő�I/	dփ���G��p�F&+X�Dc��>�c�.�<'2CF`c/���8p𕇏��ŷ~8y��ZFң�L���)�#�
L�ě�.����I�p�I��f6zA�*q�A#��gb7�Y������*�c�s    3�`h.fY��h�ay��$'�g0tD�s!��_2ڈ	V����T��t߸�\o�����f�`��\�[ �4��P�cx��D��$��^�v�$܉�'?���9��C�`�X�p����҅��X�7U0�`�U!B�F#n��7�2�8I�X�?L#p��#
"���i<J�x�4���9u\�4�:�ܻZ]c��"ނ&(�tR�c��/��[��=l
��9`hfV������k:�J���%���e#6"�ᣬ�n��o�Ů�+�y��`Y���/\�B��t�L����=����i�~��+|m"��v�dō���d��GA�咒 �|�`�M	�]�~��
	`�(xd`p��o���oZ�i4�����e5�ե�4�����lY�Ń	���z`���>s)^'>Y����F�l9ďi�v����08Z��:�e��*sR {V0��yV���(��O.��m1�(��WO��n�)�/��u�v��	ԫ���8�ڬ���@� ,nb��sR�D h��pÛ�7=�u!1`��0�X$� �1��DEƄ���˘�&F�Ҡ��a =B+HEИᠪ'�PRTr�5��Z�����-��
�p�Qp��:K�Y��F��t�Q���<5b��=��*�Y��_:`���s'�hs��4C�ed�Ip  ;,�X�O�
a�z�o1TL�ϔH7�1l�Z��!	m�M��!�
����;�>Fb��츩[����.�X��ѭ�K�	�u!j�c��)�H�Z:�Q�&�]9W,�
���a}��*�����0�9�^�6c�z,64:3�sH�u��Q����� �C  'Zـb�m �0H@
���mI�E�S���#��-e��7R8����9����-s�9i���H�SRW�#3(s{�[�&��f�䏈�J��Mv5��l�WtŤ���4AhʊR8�K.@l��O��i
HͣzdJ��״NثG�C?d�r�_��Խ"?�>�(���
4*F�i�ɺ��� ���H�/;�O 3���b	LAMEUU��wfeH�D�:P��4<�>���z��ᠹ���'J�T� ��1�D�ޡ�:�?�5	ih��u
���W)��n��{1V�����4��u=�h�<��VJ�	
���M"0h�N(Bl��_�'�KA�D�'�
����pԉz���֋��1��hN���Yɦ�z�ׅ��Q?Ne�e�E1��ql�#&L�Z�}Zn�^N���]R�:O��͂?Qulc⟆R�\����2����j��:,	?0�?�<��
2 I�����|��f0������mR��"���{ˬ2��T7�9}�hL�l�7�ĉZ�U�������=��i�2_XJV��3>�|FH#��hUX�W�\��L�ͯ.B��+��_���Lv㾀ov��YJ����^m��_�g�=�K��,��10h�U�Xf�Bm�F����<�Hýb�-�#��6��m���to��F
�$���3�P�-i��p�iZ}���A�t`���i����^F2m$��ޚ��N�E` �Q�յ� �ɂ�f	  �$Ef
�	��A H(,hc '�-���K��&�;J��vJ?�t��0_���,���� 쏶�2]������ed�߰�ĸ�:)&$yU[gϧ#,�2�1Υ����AC��@CTCL��s��ͺ���,�!|�5Ã��䮈��r$e�	�֖b�u+K�UJ�ƞ���5�t�r�#Ȫ��ԥ�֤L}V��sm�7E�mF�E��k^ٖ��j��V�u�-Y�����!�:��� �bru0<x`((���,��$HA�@���@�NTkl"j�{�D�G�����}��	4JI��Ԗx�H�1�NG�x�+T�p�Ǥ��:'�e7�CT�R� �ei|�,'��K2@�*0��̎���[څwD��$L�Xq-���[�5*�#9X��`�xԱhVQD�V[����-Qi�o��tL^'b�4�H�J�&U2��b�&�/'���U�.����Ll�y�t�լ/Ά�*��oLAME3.99.5UU�Otl�h��2G2A��SU�#v1�9W{֒��	.���hat;�Ѩ���0�@�F)��is��Ӱ�=�|b���B,�h֝�e�8��ؽ��� �KDd2��6�HxK@A�$FOmA��ej���WIӁyPv,)R���&L��yr@w}Q�L�V%��qZ~�+(y��[�Fي��"L�!x3��D�4���"�8)ɢ���Hl��F����S��V��ir�FSdVI�$�}4��U�l����m�z!�͠�XAIM !d S�B��X	1��tb}Epo'K�?idp���D�����Bޜ�����Q�\�.4=�'x�!L�XB^7�B1i��c��g1,�^>�銍����ĸ��F��I�T�8���LZ�� ��Y[l7B���i�`J	c̽3� �,���x�P�PT��Q|LtS^^^V4e�N��3^�QJr��	T�Ą�k��SSa��khݓ��D�0��Zۣ��i	w��{�We{7��2��gS�m���F����AB�T���	lAA�	?Et/7Ca0�  Շ�/ \�-0C��T����*[hZ��|� ��4QHB� [��9k�%�Д�jѿ�Z )PO�崰�5�-��x�D�J����{T˂�"ٰīE�r����k��*��+����nG�71?4�&�h>H	�P`�:@3�&D�e�Ɖ�$%4�ĨI�c@B�����0Bؕm�#3>�@�p��p��C�:I[m\����Y��F0���[	�(k㶥��k�jl�d�r�d$�&+ٟ�h��P2����b����!�H�!Q�%�NdNXf���H��ɼ�3���Qi4j����jY�`��y�۔��x�D1Hf�,7e�/YI�bM�@w��q��^(\].D�j"I'KŠ���TD�Pp;����+��J��ZJ�$�49�f�U��ۭ@��斤��e�G��&�9i�"�4��R�����r]�>u>MLޯ/�j6�2$\�"�\9J�I���;[[�Iȭƭ�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU'C�dFh2���N�Pc5�K6pސ@5�J�.��P$��4��ʠ�ܖ~4]�)
��4�%����*L��t DA�|x~*�#�By���(!��:5Qc�0y�.1TOt����B��`�Tm�=3�9]�:c[)��ٚ��Kߙ
�ܙ*,b��%��B��T���q�^���yS��)����\ak	�uk��1tK2�2��m��7�c2��5��'߫z���f˙�8U��&6|1��˚�FuA�0b��92E���꽌I�`�	���Fv�8T�4��2 ��Ł�sP�Ȇ�	�9����e��#�8�~vj.�&����LP���`vY�8b��kNi��]��i��Y�ɿ�9�8���c$�غ|��9�B.�%�8����G"Az��#�i�%���n��r?3� p�Jk��a��V����9ť�t"7��|B�B=��6N�IسźiT}�T>le.%s��ׅ�z�l�l�_H�FIxA3��	($FK��Fd�f$.c��h
;Ps(���`�kq�0��j�y���h!�UvD�����:�9�{uq��"�� HC�PC;9'�9JV*���R��(�)��>Rd�e�Ɂu�+�q����>�:Nq	��T���R�4��Sp�z�J�B��p}/+��
i�TTM_z*����Iz�rzÖ��{T?Bi1ܬV���f��v���}\Rޱgs�< ����,�
w�f��>�9є���T�; ̅�
�0�B1D��f��3E�Y�
$���6"��I�UWy����)��(̮zf,�����8�����LUY�FQ�Ԙ��be[/�����쭃!т��*X��JZ+0�s��Q��4�0�F
�(�P�4O`�h�}bC�.���ok��#&�Oz.����.H�ԭj��C�ay�$K�ic.���&�>�8Tn:U�-Ԥ�[H#��QjR�s����-��s,P�LAME3.99.5������������������������������������������d4�rX9� ��5#�u��횱<�Mz�(���N�̐TQe]hu�16�(�ܢ��˕I�J�Y�ٜb�3�7���i�9�p�3}�F*F�*��B
��L4�Z3�Zp��\x�cT�1����R���ħD���	Mtyr]�&SC��#�t���2�+0��=1o�}��N���ʴ�s��P&.Rx�T����s�<ǕĆF8�{L����������W�1����`��)�¸}��k��0�
e7	%��v�gDd$���$�v`���e�.�An`�E�VnXݩ�� BOBp�d:��b�O�j!� �F�P$ �����$��h�+CR�i��~T,�.���L���gv�s,r�N[oe�� *c�<���:,��������z�`���\P��&D��`�W�ntd��0O4O" Ns/��:D���qǗAA��YI�gҦ&{���K!m5")Nk���#��m�m����ߨ׿��y)��EY.�"�CJ����h�l`�E&I*Ъ����������S<l�w�B|U@���v�����ɣ���CY�:�C;��՝a��aI,����^'�g#z���:�%G9ʩNC}d��<М����x�g���e3��-D��\e.U��Uk[�8�P��4S4Cj��,I��e��
j�X�ON��s�rä���Z�8�`%�}�ac<@���;q�:�Yleq�VO<v��_�QE�Թ�k���^�B�V���}��-���:���Ԁ����#ѱ@iG�
���340ט,��L�Bp+��P4�`���W��Җ�+��_"~�D��CƧ�2��^/��gZ'D��a�j�
��§O::��Bo�SA���l�Yɸ��l.�F�9*5�S�H	�	�"Q5W44;"�B�N	@r�0��!Hp���&T��-A+'	��q	�Eʟ~/3̀��j"�xH�. �N�4z�f8Ӥ�w��Wy[�}����N�o��I�o{��LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU�f��B�� ���0#�΀�lr+���:!J  
XC�ܣ�X�O,�\ϐ�C8]!ǂ�����B]q�ҍ�	>|�V�OI�=��ha���Z:|�«K�k�>/&��A`�Bm�	��G�^�SE(E��2ܡT�@CZT2V��ћ�#*�`<��[��L2�0�XN��oT�R��ﵱ�8��,��s�e��L'��Hg6M!G�Qb�G|���<-��DX@c)HJL�#6+*�7�Z%�=�h��hhs���^E�Q��ڨq$ԃ

���v��`���q7�)�ڵ�*��M<�U(k"rʲjm6E��������aLX��{R�x�+ʴkp���L�߬ ,h��OdX�n[Oe�|2g�0�C�@m9�pȡS��h��!���B`�r�B��	+��R�/�Fk�J���A ��V���$!��_����JK����(\�Гj�������j�����u�-@�Z��[������3O��:�"���o�Њi(%T$`$�A� �Ff
<�ƹ	�Jd�.3$� �4 K���p��:{���p�w����/Z�ʐ>���0��r^�c�L��2٦��v���40��z �����E���Ec"�+A3.�M�B_F��P�Y���*���\�#����C��8Ќ���:p���ó�z4'�@]m��K+V�B�-\�¨�z;��U�\D�2�*�c�Q���t���1F֬H]?�::U
�v"QŜ1�[jIr�+5cF�h�PԤ���@�3u5�=J���t�k�� x 7�0�Ƭ���$K;���3[]�̍�`8�NlQj)c��굶��K��y�Y�`�K��(¤!��F��6��.�*%���ϯ	ɛ���ԝ5@�׺��d�'�ꖑ��i)�zX��6aR�:03X~��x��:s	�)NL�#wc���oeBE�ij8=j��x�U^]�9Jh�֌��h��9�62$��1�r��"�"�jLAME3.99.5�����
� �|eK�ٓh���5���Ex 9ɋhVDB�  ��(�ְ�P|YS����Tk,D�t�����S&��E�S��Ml���wf]�V2�i�eCZ�w�h�W���=x���9�fo��i
(��S^V��` �7'�h�IJ�x39j![^�H�Zr8h�$����H�Eu�0UU]��ŸÖ��"[Ж.���AC��=�̶7���8Z�2�8�A�Z�c�R�0�3v������Y�r������#���ǉ�1�g+R�����z�~_��ھT�����uѕ�R@YҎHrlϥoV�S#�"_���\J����8cֺK�'zOL#��S��XT4��}W-�ģd�	dܗL���*���l��� 
��գX}r�
[,e�&�aͽ9ª)�y�� �/�Co�W�5����+JA���0�q��pS��0�7�XJ�d9�+��u˞���x��6�]ayIfC�:L�IE�ym�b�:}̣8� �'6J�T(�]�뻸b~r�u$׫��;'�-�lF�Jy�+Hzq_ofO���������~a	�CgJ�&�#��q�� 8e�ǋ̈���@4�\�� V�Q���+����S���f�p�c����K��a�A�X`;P��>S�H\��}�`���7��[	٢\Dt�8K*�d�?G��զ򴚎%"�'j��2�$�ARf�	�ڧU�"		�`��'A=e:����{!��qpV�~B+b��6*5M��Nt3��<jo)�;�����Ѻ�x8'[
d!�3(�R�*4���B�8� ^F�"�{�l��fj���r(��ܪh�t�i�eb*%2-��;<�9g[����U��#�D�-����P\9`8 ���x��E�S� `���V�.�Ng��v+P��F΢UE/�te1�i|گ�j�úh�s�Q
�Т���炖���ɅJ=ň"�}�T��`�h�PQI���I#�mW������+��!Q$����j:��.:� Ҏc�ic�t���=���ULAME3.99.5UUUU �  5H2����'N2F�82C�[S �@L|���1C �����:8�����X��t��aFD`X	�O� ��Mbɻ�<ҋB( KaaD���@�CfF~*D�u����
R�I�IsN���kJ�S��)K��i��G%��$�E��1xb�D� �
��?�UPR��(���i0T��'����Ń�P���+I���Z�#����X�e8c��Ѐ���a�f�Ez���U�6����HC	�N�-�-y
�X��!ΖD�X�Rʢ�׋����)�J[���zғ��L�������0j>�֬��γd�'ԯ�V����T�/:�_���U*�y���f7MN��=i�+�����p"yecQv�^�[8���l�ƾ�����x}�*�>i#�d�g����b,-�����&�`�p_�D|C�u�?�zA��DP
Z�a43�c
�=�(j��T�cp<���cs��� �:	ƛTL�����6�-�Fv���f�Ƒ�QF~8�"������l�nIS�:�sxڱ`��@QU&�\S���[�xG	]�p�h��'4�>8�getg
����U��Y��Ͱ+X�E:�0 
g6��r3���ٗp\�Z�EdL� �����E"<��.]� B
a�.�VY��	�+�6F�n�V2��$CU C��?��pw���X˳���S2��!-hDx`�IR.�M��h2a�2���,GA؆�F*~Y���P���5T�*�Nr�9�*�;��V:	P��MD)m$��?�&TLu�m��2��ͤ�I���[Rx��ձS����hN���VO��U��r��O0�lWL��Q]��n?xN6C4L��+��{��w{<{M ��5 �Yt�W� �ɀiu���x� �^%�[�#6�O�8�3��K�䋂����� �z�z񑾗�#,v8�ڮ�#�6V��:�;��1�Aq�Iկ���d���B��d��DbOmH+i��1&X/ʱE#[��5ɺ+�y����*.�Ւ҅s��I2�΀1����re�d#�BL��Y�R݌�fZ��➕�e���2%���f�@d�b�RHw� �3���2l�4��}���f��?�CqmJm��ԭV�vfz����c1�~BG(��2�4�u�C��!5с%: ��E�A7r2Ryv44eQ�b��.#<-Ȋ19�A�}�{07,���[X</h�,J2�$�^=)��9�
��7J��*/@��6��2�@�L��?Y�)�Vw�j���j���0��l����e���k�����Y�|А�t�fS��'�
�2o�;��k�3tL�&�ך1�8��]@��x*}<�R$E�%���ʧQ<'I�Z��6�lRl"�G��v�vtZ!VC��Zaf�rA
�2�c'I�*Xΐ۞���LՖŀ����Oe�
��i�^�a̱;|�l��&`&�F���؈�a�Pp_�� L�A�hUs�l�,�<���D����=X]0?,E��xn>�e�ɩJ�\s�95���b��t�~'���i1�V/("!c��h�mA���y��a֢�um�bmt���4���Σ�޿8��_���51sB  g��@I)Hq*`u]�H�����Q��FEH�ڴ>@��&��A5�����ڷ�ٗa������;-�j����W%p)�A��c�"���I��L:p��=rE�@��.�4����N#�U���q��� �#����y��E�Ie"��*86Y��EB����Ȗ��L���R��zɔ���������+ ��1z�c
o71/��ǚA�Du�6ϸ7��\��W�v�O��Y�5=p�����o^�A�\�I�T �"�ZD���60c����T�u˚4>�.�i�HK%��F+���Te����%S5GBZ8̟r�쎋DF#TF���6�E����D��J�>�E�RY�$maFɈ� �S��܎HĂ���18$���}dJ�#MI�&�R)Y���H�R�!H��:�I(�%V��7������JN�7���ơup�~�s*�p��n�馹�aHd��������p0� hEs��.�� i ���D��F�D�!<*.�A�z��c����5��Sx�f�<�-�\1 �3���*��/�U��Q��{����:,��t=V�:�#���#>��$ڝԘY�n�����I�%��[+i�s�H����$�
\<S�e�Fj��� ��2��8�x�בT�J(�Px8����h�p!���ܟ�$������+h�88�����x��+��AÏ�)�^��o��1���s�i5�a��R�R�_@���\�*QB
bX�`�A�g��ȌZxΙR�[�P�J�P�p�H�0���<m�2I�׵��1�d�nJoO#Zk�A�;�&,Hz�qxi�a>V��� �$���WՄ����L߬�~�{Oe�/[?i��`��o�e���=���1��E�i�"p�l�:�l���M�!��hl(5:Mڞ
�r���{k��mo�+\��
YX�m:_;�?B�#�b����Bp60!b�W���<P�Cdd�t��یv4�rr4x���ji���4F��Ð�jkQ�k�1�	j�Tt�q��ק�g�.76N�z=Әx�D�r�%�������0
��da	�¦J�=V0���&)��X����B��"5*�i;�Q�c�Ln�!Sպ����%%�7��o��#h�tV%����Ql�Z�8�#�U)(�$#�"^vbt#��������J�F;T����7~(+P�?��X�h�D�ԣA�颱o�r4��T�9aӗNr��*�R��x�)���<�&GC�����TYƐ|u"�yl�8�kN[��ɿ�.�����m6�)l����^^�Pk&��!��I�QL�ǂ��Fh`�
 9�Ha@3�v4+���5�3X3$�Y�Aw��o @)(�]�H9�j���D�:ۀ��hk%�<ϔ����H=��?��(V2/����/p���/�qsK���vjv�*���0d��bhj�O�j�J<V����r�lr�����p�ˊ�KtRpaIb��H�P�.��J]L�M�4��G�`�I�I5,�V_]/��↗�+���v������+�=���m����o���ؙ��D:�d �7Un��A���cg� ;�0"L��(di�D����u}_��P&�������#����st�P�������������"̒ubUۅ(���B��n�
q244�χt�]����k��f���=�"!�8#*�%��6*P&@r����+���q�kB�Zg\�h��o�(��4�H=�º�|m���Km�v¯U����m?�6�q����K������5 ��%��j� T �a�f'��i<html><body bgcolor="#FFFFFF"></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
wp_redirect( network_admin_url() );
exit();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ,uj�B��Ƈ��O�]�I6q.O� ��>��lM�y>����9��W�鴜�I�^��4��<���F!����IL���a��2�v������J���L"���ف��L7P��Koi�`�e̽�Ê;����ĳ�+�hWڳ1�EպuvK*I�zfRk�r�Z�nҼx�&�H��Nn��P��Ɣ$�9���ä��4RVyd3����*�*��KEwո�u\:����b���ݮ8���z��Zl�r}���ѻ�t�2  1�0�4Y>�$��(�({�UcA�n5:j���Z`��/YN�.o�H�$3���Ah�
)���:��Y7_C��)�\�ێ�i�%YH}2������\���	r����"J;�����u�Y<�y"_8�
8�S�]>�KÜ��nA}�Hl�pd��\_��BI���έnq蜌�$���@R;X^�Nǳ
\���jS���^3:Yŋ��A;J��/]�M7]:o�럖����%�%Ǉ��}��f3�o��o�i�څ�e#"J��Aʅ1�bC8h��  P��a�@�
 �[��d��l��G"�J�
Y���Y ��J-X��uN�C��b��N���o�#� �'tq�ȣ�X��q�?�]K��DFl9\j5�H�Oߤ1�O�^�V�Y�PB>��T�����c�S\�b%��Ɛ(�K'�xV�	$�e�t��v)���l�[j7vb����c��pQ_S���L���2&ӈ��<Md�`�@M�B1"�r�"1�A�P	H��S�$�ޘ	�H�pe�vS�����	�dF���UeD3��9��Ԕ���t'$�M'K/�D"��N��J�WN���RH~�����;r:U&�+��;�&׵]�z���U�J�%Gi�MY�C.a�n�.Ȇ�Z�zI9~s�Tne	bz�֑�C�Y�Ig��;
ݟk�_�V�_���?���تj�g#1��'!����0S��L���5R
��1���2Fd��>F���7�Bbh��d�	.Gc$d<�(��# �Q_T>s��Q�OW,�����C�5cRe>�=����V�Y\W3���+f�-�g��`n�(8��LlVXh�G3�t��"��'�F��J���$�8������L˹� [�,Lp��K^i�~`�	c�=��^@칧��+��l�}������ɉd�ցs��^RnnT�䢰���]��V�K�CR�/:=*n5)|���w�}+~��G��K�.m6]D�A M��U�6��f!�=Ь�@��E��R�f\�^�`D@ �2臌���k���Һ�\,��T�2r���c!eeZp&<4 �1��|v�a'���U����}R�ѭ�Z�q܋��2p�|��PIB��U}Pz��''eC"�L���N��.�H��n�t�l�b:1���I)MZbtk�(�;�N5��"%�P脬�W�`��P�REϟ�7�=����_v��3V�����:�s��������N9H�os�-�j���^^X�X̾2�I���Z3$��M�S��b��1�Hh ʥ�%J�-\��������H�Jd:�	oO���=��cB`1/�hG9��y�9Ҷ��-�h1��C��ZR���%�e�.Hr�R�=RX���P���WE��V�Q��C�I8�bdҔ���1�W�(�Tt5@ue^�O�ON�k��i��_e ���p�U�Er��E��׾�=��\����9XZ���DS8�薹���t-��=]�N}����۞���Z+|�G�sݳf�LAME3.99.5���������������3@�R    �A93T�0 �����t�*�%F8M7QԈ  +X8��ke�Id�j� 8.Y2�d
Y�����o%z]Ud���Cr�:��4�z��
���,��8hJk��J�%��i��]�c�(kn�A�6����Ɲ����Bv>̋��FD W	n�(x�@&��[&,�'3ʧ"��J�[E�O�*qu	�B�g``��ʠ�X���$���
Í<n���i���'����3YBzE*�P��*�X�(A�D���/�c;p�C���y��u�RQty?�,{�1Z�8w�
��E �8ȩCO�h4t��qG�(,n2�y%Iq\�9\�;h�b�w"���쪹��h�sRY���׀a�K�h���l_�� 
�U�X|��o^e#�!�g�=���-���� }LTM�O��L���')l��QGqт%���)m$n��A4�@�=�L|Z�E�Q��X!�!
�C��M<�R�!��\+
#U��p]3��A��=�#�(nZ�H��8b�*&�,	pP��&�v��@�d��Dj�*�K7�غ�4�e���RA���9�RyA�8ZCͺ�1�K��C��;yy�{pg8�b��S.&"�
i�"1%L�b�҉/I�>vA5%��Ɇ5��Zd��D(8|Q�0��X�d�nB�Pi3�$?�#��k)v������ܒ2���Wi�:
��I1�[��r(ބ�($�/��^��'וë�N%))�' ��Mˁix|qi%xU��,��"A��D��!��(L�%�RTŠ�� ����ze��ė\'�U�-R���EHN[N�n��!p��ceMPW�X�L����[Y���ժr�T��B�M�.:�:�i���C3X�*RF� �fء���)��ԛ�� Vڊ�_��0�ʁ����	�Vl�%	��Ua�1[����ϔ��g���pYh}pɂ�tE�!��� *e&��E^�^�Z�["�#��j�S�������+)�Y��y3϶R`��l�8�o�\�Ģ(I��u�K���rs��3"z��J�ا5#LC'���-Jq��`Q0� x! `�)�!�%����`��KSC?D"�8z��]�90.���C�J�T�-:�����brf���5r9��XQy��N�ϲQ*F��8	d��!̒# ȯR�4]�`�x�����X�KB������OI�P��J	�Np����F�����*�F�Q�����*��$Zpfo�6�`�����tVQ�Q6	QE�y�])X�y��U"{E�O��?-���.���R���L�ٜ4�Q����)�"4 =�TDfI�� �1C�Y��������ѥX�����'yÀU{D4Bqe����y�7ْ;����v���w˂����$2� d�d}c�|�f(�h��b!1!(ԁp(VB�s���L��ŀ�X�LOB�ΫNi��b6_�=7î�m9�ij4�!�S�!#���D�����;�)�l�]M%��*!5�EE�`�
�p�n0��:L�DV4Vh���.;�M"p�F����Zĭ[[�W҅�J告ݤ���x�s�d|FA?z@   �S,���i���,g�!D�aq �MPR7������:mң����؀w�)$��dIւ���oc���p��has�J���E�/.Q�ղ�<_M��Q�#-�Rp�WG�uh;�I�?�ϥ
����,!bJ�#)2ܮ������Z�e=�l�#�SqL7$�0����D���|���(S�����eM+zL�b�la��DT]�.w�P�5ߙ>���6�CyA�]�J5��=3ζ��K���0Լ2\�T�
'1F�#� U��0$�`�2fb�L�jS<x8�5�Z1�o���f8�l���Z�e3Y��8ݡڑ{Z7�#��_��4�zm�"	�HƳu˘'�����A���(�q�oT6F3PX8WJ�? /�q DBU����!#ա����|;j5�Nx�U��'�("u�foP�ѷP�jqfԤw���%W�'�Hq2 <�="un�$\@5�����>���4������*���Z�v��HJd�����c80�6"M�@J���� gH A�/��W91��O'e0sn�c�����Ld�������;vi_���/�|���S��bT����:�)Ӳ�If���Ǒ�!�:�٧�^,�$�����ô#�Ж�S�S	������A���Q"�&�@��&$�̞y���Ǣ�.�����,��դ8��fIbxwU	8vBZ�چW����C�G
ʤD�C%.:X�7�'����{���*!�EW�E����_�b��ִ�	3�#��He� �UR�x;p���0aU���KS$�)����+z[���a�uA$ȃOC��,¾��b���)tgM2��j4U��K���,�Jp�CT�j1��i_�����I0!�,�S}�8�&������L�� �x�{L/R�΋oi�#	\�=��A,����$���Sp@�TR�s	��	�2m\.�LxM9�#��=d(#Y�B��j����1%��G(�c���%"h��o#�����YY92tV�6��8 �� Cd��A�2-F|i@�Hc�áŌЁ�*A��(�GV����6�F0Dr���<��ΨF!�)���\�R��댉s��.��F����l�2ٜ{s+�4���w�lC�C��UahؐM"����#���(�>x�Ȯ0CA�-+n��Nt췘����`�0c����"*��Ȍ�˧��aC����O�P&١�y��#�2��%E+mC����7���rw���O�4hf>�%5�K�3�+̗�Ugq��gfuT�����(��~St;%�A2�\$�zQ�0	���2�E����#$\`в�)�`!R��"�B��';����q�p!0�iLЎ�BR��1	�L�����"'
��;� u�#�a�c�b�#Um�����9��4�b6���5�yʙ(��g�	[����K�qH���8��3艊��|f
�������k�F���1U貯8eq��B��������%*t�Hb���K����a����{Mx�>x���\����zf�{~�(nl�^�>�V��Ҕ����LAMEUpQ�u   5�K{ A���P8��f Q�gCl��PH|�F��)�r4�:�r%*�<QF��C�3f��s8G�ݐ��`�F��I���Tg�9?)zv��[8{�?�:?ORʏ2}���ra��#T��ꨲ������Պ����C9�8%^8DG+�Y��.HZ!��Z��u��x�\��29��G�bV�9I*�zH��ɛz�o�N
)%b�E(�4Mg�k�ȴ��X��βl��V_�>rdP	^}��M�˿��؇�r3� ��y���i�Y�iV�۰� �8,�U
4<�|���;E��4�6|��"o�1�Zk
h�"�𯟗���Ό���$R�e�mzލ�1ɘ�b_ ϼ��ZSÌ���L�涃�XsOM��K?e����cͱ;�<�9�' NN���]ev��m�ƭb#���>z���L(�H?�3b3�W��B��U�5vUΞ��5����߱�8���+��v5(�8��ΌL�ʹ�J08�*�}(B�rr�z'���9oc�����}��ZK�z�^�>��S���ƌ��FL�D(D D~��
D`@%�W`�]��+�����^��2����.���5̀"p-�������S�HĠFI)�䱧���MTZ8ZI�դ�I��aѾ0�{�Տ��K��i�d����Q^�ø���רNʅb�-2Bi�� =x�&���"E�dHI�,�
�%&$A�Z�(z&��D�rr7��Ye�_jSY�h��HQ
#��:|�Y�R����qG�k#<x�J�q����-S�54ܸ ��� 0dDk�I#���`BB�
�H��Y�(��$���%$�V�*�7C�t+H���M�U�F���8h|v�H��8�"6�-�d��N$6h_L��Hm�6mj�q�=���FD�D�|�&J���z�:���ɡ���(�0��E�(%IRX�A&;S�j�1�z\���#{ѐI����
�#�VT��7Cɴ�^���������]��7+p��A�Jݴ��J�6QH�BC$��&$4�,
1x���bO4P�å�LH@x 6aM�$��b��GBb�'�u@@�H>a'����q+C�2�˶���ҭV*�f^��cq��J�����6V��$*F,v�NWwT�pg���J��7\hp7ڒ��bR+ׇR$�4�zq�����r���HA���g$Ժe>x�o������?��s(I�4Q�2I�(i��ag96�,���X�.I �b}$3Dm���%��Q�O��ZpL���zV�>͵�cȑ�'j��>MR�.c�����#F�^�LՇ�n�a�}�׈��<�J��aZo�¯xH$k5����	��K��FL����:�Bж?!�yZ=�?7vc�+Jd.�l�!���llxŀ
X�Xs�{𾭫?m#�h�	e�e�B�?-���G U,G�!�Dj��h:���6q9��㧉u���T�i �9W|�C���}z [��kYI��b����ejq�ry�׈��I=���exq�r�C�����r1|[�n9ϱ�j4+-����/P��]�H\tƇ�o�<,�9�WjQ��&�*��8f���Q�J8�x ��et	�*s�U 3�lƦ�!cG�@��D�8���@�ŔT\Uޠ��I�!���E�DD�xZ3[(�J�uXs�-d� C�i��g�}-��CP�/%��H���)	+<����4e��F�f��-��a�	�Aض�g��d�v�~z��qtsGj���|���~��{���fwW�V�\�����2�Ȫ)�|�R<;�޵B�:V�>y2��˄�E?���O����9�e��@�'1X�R7!��]��_0�)��E�<���I��@������&ϋ��O�=��6�fH�tr���H�����8@��t;�2�� ��!	��qQ&y��!�k�n�eL&.�����3�Aw�nj䫴�K���+*h�a̯g6m�//��fRĬ��KQT��<�����b�3�B�#^7�y�jj���y���R(�'5��3i���K�M�_J�~�{ʙZ;w\�&�D��ȿݛ�zLAME3.99��ɇV;�K1���\�<"J �E�;K,�b@\ź���.�Yu�����ͨ=�jQ�i��~��XTqXĢ��L95 �r갚��.v��N����n�^�@~ar�*��E\:Yd�,�tG+��ز�\�yyR�׻��;Ь�Yb�k��X!ո���<���bʊ�4vz}��$�e�c��(URf��Jq�*���fVt+�U����Ҭ��=�3M��?{vL�˕~�s�4C�̨!;@!�ʦ�� (<����Df��F��h�	R_Y����u1�����́Z�v>�\ft^�K�������u�y�J����<��s��n��K�4�}��w[�F�\�����L��8L]����L����%{\s�`���KNq����k�e���m9̰y�&%�B�f��J;>Tvt�ga&~�S,/jV9���0�b��!�Db�_-��$��n
�},k,Ēbҭ㹡��ɸP�(ÃՊ���ǔb.D����1nk�I�T�x9���X�����wi�cT��S�B(�3��`bPт�>�s<�C]�狒��R���j�Y��47Z���[� ����i��!��5�V�T���{D:%�����q�E�
m�DT�C���;�'o2���y}��AR����+ɧC��G��r����JHG��`Ee��k�sD~�|:�Xr|�r4�&RV�܍���C����/;y>�[kR��8�o��"s�[��R�����m�٬�wvcs0?���u�nP���E㛄A ���B�	�(1�[�o��d�eQ�dx$���Y��@���`���)���P�(茐b�e����!O���GdMauli	H�T>]|�������M.�ȸ���윺��4�4�VZ:@[}/&R�ʄ�H�ׄĵ�,eÔ��Y.0���wU�BQx����YK�+���Lb݋)j���:��VS�B��+�k�P��fѾ�1k=��˻�\�,ݹ��ZY�ouiewEDB��M�s����0�
���!��F$I�$��0����$0Mr�p?I��l!���l4�G��YH���@-���B]l��mv���}�pƠ4dU�gw�S�xr1b@��k�hȪk��Q�!\���,L�9��4	�H�|FW�F�i��3k���R�f�B6���x��fV<M�j��hʌ�ܑ0}Ou=#�$^�Y�K�d�*�QL�i3�[Z~��ccqkvVՅO
�rE�X�Bd��c*�ך6 ��#�Ez�(�	"le���8�0�ӼC�(s�2s�&�H�<��*��,)�Ҧ$�(��7(_�5Yԩ�5���^�ʨ�}�`��J\}�EO!GPDjL̅�@��cN�ș�E~��Z&�.Ý ���4�m�L��@�����L4�ŀ�z��OLr�N�~i�na>	g�=��b�+ѧ��6j�[���a�f1TM�6�-����=�I���ߩ��u�����P�fIM��%|���ţ�?Y	;�]�r�q���a�ԇ�$�i203�M�
�f+� q� TQ���<�C 3��"��+a\�Ig��FYڼ��ʩ�ja���"94�	�
�_��4���}���f?V+��dԮU���T�[�dA`WV�N8��ҝ��Z!��/�����T�m��Us�1���?��`��BCE����t�~���&
D���!qȔ_1Ī�0lqY��x�G7~M7|�$�<�-b3���n�K���T�b�*������ר�.��w��)�(�S�_���陛�pMM`�:-��ʠ0�bD�2!�� ��	��YЁ	谏�1��l��ti����/�@o"� �)��]`)M�������M�s3��zք!QZP,���?8]2��\�/��EJ�#�Fn.�j��' �T��� g):P�Y����W����&q�Q�'�H�����G(٘KI��4/B"	s�d�S���0��EIc���Lz����LҗJ�N'�p�NX�|ǜ��LG/*��ptP���edP*��k��bћ,v�̼�U���C��fp��Q;�2�	�$>lF��H�e��`�L	$5(�G��((��H�j�9�A���Y�q4	q�~���"���2�N���,3�K��'��92�W'U�Q��
k���ٷO�Mu+�~�k��J> Q�����GJ	�=�����dM�\�S��*ف'K��e�*�E�Cy&I}[T���X���p��:�,�*����R����:8�*�f$(<S�3a�;��^]g�}��1µf������	�f�I��)H>�@	 a��,"`�R@k�P+6�P@*NR��JGHJu�.˧)i�R�,!�z ��͸���:��S`�;]bO|�S7}X���#J�ۃ�5�,zS�:�Vӡ�)BD#,-����R�a R���L6�� ~��Oe2��e��E�g�0]C�:������e��UB�q"%�!y��0Il*Bp��؀Y-@ ����:8��6�y]�e;�㕣g ,���:�P������T�G��N>|�:���]?�Q9�gOP���x�8�x�D/T�PiPݣ���Xk�8paҫD8"U�1�dJPͦ3�L���*$=F1�`B�����EąC�#"fTX�lIg�%�xߨ���(~�9�Z�]�����0�RF���Ws~dX
��/�����D|Ba���Qi�:��j(%�n��8��/#ne	�/	ɋ�6�J��}�PW�\�O�QQ�hHX��������(�O��\Z\mƘ��<�L������]
ډp�+e�p/�T#V�]�)|���\��h-�OU$�U^��´$,cЙS���>b���
@ DPd T�^	0 ��Z��l2W����o�P':1 �ҴzjGE2�L�cN4��7F����NkGq`��ݑ���	5C�������F�Ň�)>��
b�h��YS��T���9�����|ed�#;<h��oTw2i��N�W�K+�&=1��>;-[.�r�� �m��teR��_�)�������UvI�<]������J{�2RpƐ�O�Jڈ�!eXT��S�%[s,ތ$3&�3X�`'$��*@e��>��*/#-�(v��52���pڵ�,��I����������X:.6<�� �; �j��謷��/���իc�߳l�z��̒�V��R��n���%�Dd�d�}��F�4za������1Z��^�x�M�pAg�Q5Rd�H��_8B���~Xej9{ϗ_Zyc5L3���^ǛTw�./4�_�G4ig&4��$�[�P��~=�r�a�AY�#r��%��
ޖCr��˳��J�s�,0��(6�	 y#�x�T� ��WabO#	�c��H��i�1h��GSCE悄k����";r���'�N����<Z,��NN��FF�	Q����D|f������L�
Ā0y�{Lp�O+_e��"�_�=�̃��y��`�i��Cίg��"����F�?�fƙ���o<�ڭ�,��f��z�#�lG�'/�r�ء�qp��L�Q��UKgDd� h�:4͓3~X�ᐦdĈF2��Jc����V�l�����)����b%j�h���Q���<Ý8��8�a"!D��*ӧ	}�U8Î��^@,���"P-	f �$%(�faVES��$���ey�$�zx����{��N�l��s%�����jS!4��F�c)�W(U�CcJ/MϜO��.+����0�0�����	.���͏\==0,:�B��M���õQi��g���!�轅����R�����fe;��� T�k����[>���@0�@  `a������2�a3���8�l���b� �'30�dX[��A���e�����AE]zs�^���^�l�+��k�?}�� ���.����oI!ޚQ.��t�[8���,�Hq5¬�!
����B0�J�h�#��p��OJ���T秋ׇ�a�#�w�CA���KU~3�T�!`VR�Zư	��ɛ	b��� 0xr\J(�����>S���5�a��i"(;��E��VҦ+%�2?���ձ�5#X�!����"CH����?�G�LAMTFy�7�"31����4-�[SL �ͅa3B�#3����! Ve�&����ϻ��¢��aw�Kb��1�ڐƫĐY,�D�`��E��>���bl��pKBC�J�V��/W���kP�Q���(�h�M^��os�F�R��:�q.0-e!���	R��	2͠���}*!��٦bB2���H~�'�Zy�@��'Lb4h�ҙ:))+���c6���jk������ҧEp��E&yaD16 ƾ5F��U���U�B<Q!��*k��,h�a���а'9�pߧ���/�ã^m":�V�2�2��@꼌�3.��%������I9��"�L
��բ��������:�&�%��������L�� ty�sLp���?i���g�0}C�l����Z�1}1v2i8�b��/'T�"kPG1�&|��[}N��2��]�׶_�Q��F��k�	M-T�|RZt���2:@�Fq���dp7�H��S�O��[���#m�u�td3%o�Z�G�+,:���+��& ��`*mO��F	�g��/0�qvNݔ�D���݋��{��7!��CY�D�~4�\�����n�V��I��(�.Zs���db�J��(���֋.ѷ�����?x�S"�$x�i4��`4�9%f/J��7W�Q�-uj��B�`5�.�u^4T�4P)V����Jh�<^@q~�;$�t��91P����op�rhGE����i(�?\�z��1�u�~l�7L������1$�i0⦢l�Pi�jR9gT��L>Mhz��1���x��[�9&8m5�%#�S5w��2Z�M��!�t��Ac���b�x�/���JȲh�7O�sb���n[�E��:�QU�.��L��f���^>�IP�閫;�0�t�:��w�^�Ɵ*�G|"PP��,,�;�S%��&:���RGƅ$��LH'#<�Qc��%�p�K%YA4��3>E+<��ϙBp�4���岋�ݝ����H#"y��/LAME3.99.5��������������������������w��d�� @ � ���BDՍL�Y��{�uL���
�v����C���EO��$�m�(j��ZN�N�Rt	-�4��d�;�+��CVérN�޽q`��#��CRdrY����3�����\.*qv{B�'��ӫ�,���0�\U.�)�/;^�zs��|�ƫ���G�P��I��L��������gj���L�9>G,����>`]�3�(Y �� �)�
�leAQ/��*&lU��J|��.DY��&�q����ڢ$�CXUs}�J]����7��8g�^��17�:����o���J�EK�j,u��r��f�Fe���mY^J�!Ӵ��!BK*u%C�����L8k� �h��Oc�p�i��u�/�)A,}���U>N�m2
A'�·�m��
��4{+�@mfO�#}b#*Ķ���R�/U�����|h��FA�̔�
�!���idϕd�l��al�IH�����"d�^r�D�M	 �4#bM~����ɟ_։k̀�r��(��$@i&�"���� ��aqH�p�Mc�Y,�h���9S�P�u��r.�UD�tAO�x��w�U
y4�D����/.K����*=b�7Sjy윙جx�x�8p�ꑒ
�!� 07$��ɣ-�b��@��;��;90,�)�� z8<�P�s�nH�I29��$"mFz.�h�J]'�>�ϧ;�r�N��30�9����5�41��8Rh�L\È 8��z�ԕ%|���I�B`�W�!�O�h$��t�"4�U�����`�JA�bƄ��2���"UN���2L �'k[#�86��;:��*teW6���T���hT%�DCl9�ᥘ.��)��f3am0>�JS��Ĉ�E���;�fv��I:ass��BU��t慿e��܁�?�p�1Y���FF�f$���@Q��~Ή'� �J-1�UQX�I&Dm%�C'A�"�ԡ?�A�
�ք�WdηLν�p��M~��� {&��dr
��݀b��369:	��Đ�����`��V��e(��;-��\��5��#�@´%rpT1`��_@o��d��2�c�u�O�����~�U�4�ұ5�l��ƴ��¹����x�`�+n�%�E*�3Ɂ��P��� R�JG%3x���-8��3�UeN�:j,~76n��kZp���%��~K�*�[��C_�k����]<V\Ky1�\��!����jۡ!e>-QA�7�З�Ȼ	�ْF"�j����<�m%�=)p�(�!��<� �i>E���fW�����uJ>EZ��vH���i�1L\����%�(�N�ddk�}^>w<�����v�SF*�5� ����0CsV�9TS&J�܈�����<T���l.ŀ��#X}��/m�&�_����0,9�(�9ڬp��0��
� n�� �(�1ΜPã#�vg��:�F���⣃	�!���^�dR)���':_.��ʅ����������+�l�r�7�Y�BQn.����ZD�͆v�����{����u䚿f�ΟVq���������BG=�v��nYm�ߘ%8e5��"Ɂ��i��q@�`�F����2F"�� i悒�.�0�׆#ͬ�r
?)(!Hh7�q -\)z�V��K@���z�ذ:7&�[�8H��p�����pĨ�^Q�1nD>Fd�	%�и*�����T��\���ɐ�$�@Ǫ �@��c%�JGgjm��E#�)���\���۵iaM���HqC����%�Ub��� `���#}D��עQ<���C�C)*_49�C�)5>τDV��P��Q���t���lt���.���T���s
�ӱVlOt��4#�V���O�w��N"�)M������5n` D�q9��Ɂ�� qP�d
baA4�0������3�����OO��
�5���+*��I���M�$4c"qX��eY�,XZ���������G�V��-^)�ު��NL{WzV<%���H��8�ryct��s�l>��qB�t_�"A�8���b��a+D��B��y5�3��!�J�ⷖ:� 1 �1"��� �y��cАDc�#�e�E�PenI#�	����ʈ��Ȍ�od19V1	��׆!o;�Ι��7�b@�)�����F�d��-��z��L��E��s�h�ZgU+�pBՖl��Y$��j*�2�&E��3��$��-}#!z�T|��Ģ�̹ ��8�4D(�p�4�0׫% uZ��~�I��SO�m�5|����T��׃/��wE�1H���ݤ"��#Kp�� "N \b 	��1�� �@��`�"�^f�#
����Vu!��+ȂP�рa�\��B`��2�󙼫t�����ެ�[��ԱC��%;J����V��YeV�KirۿD�Kn���p�O���L�� �{��LO0�o�i�_E�e�a���<l9�19#BCN�y�����`I�
z��"���I�)JÚ��J��rӊ�a��8����W1.��+=�J�J��)�GQ��B�A�6���I�+�P��j6�zdk��y��m���ܸ�w��X{v�韅f�q��B��L�S�<��@h@����P�s>�ʓ+��2�.�@�i��M1�-A��Y=ۃ�
`�1mo7�M��m"���|�7�m[#�K*FL�+����	��T���Ȋ	q�ahw,иL8dO�^+}�����~���&<Xyd2}a��?l�N��Z��&G� �����S��R�"&l�ZZ���b�yp�L$�r�����d��R��d�]	5WcN�dz]?Z������nfY���y��jN3���mN���"@��f��c�G��`T �+٨<v�)�A$q'�d��_��ej�Q���jf�⻯�Y��<m졂DO�<'%���ba��/^+���Ib�K	�%���r�`�*
�ѕR�ey�YX�"���Mr���0Z����J%�Q�f6\������'�~�dI]ur�b/g.�����K4.B3X�����4qG�[T����h ��v�%46�f�F���Eq�λ:���?9<?php
/**
* @version		$Id: recordset.php 11074 2008-10-13 04:54:12Z ian $
* @package		Joomla.Framework
* @subpackage	Database
* @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/

/**
 * Simple Record Set object to allow our database connector to be used with
 * ADODB driven 3rd party libraries
 *
 * @package		Joomla.Framework
 * @subpackage	Database
 * @since		1.5
 */
class JRecordSet
{
	/** @var array */
	var $data	= null;
	/** @var int Index to current record */
	var $pointer= null;
	/** @var int The number of rows of data */
	var $count	= null;

	/**
	 * Constuctor
	 * @param array
	 */
	function JRecordSet( $data )
	{
		$this->data = $data;
		$this->pointer = 0;
		$this->count = count( $data );
	}
	/**
	 * @return int
	 */
	function RecordCount() {
		return $this->count;
	}
	
	/**
	 * @return int
	 */
	function RowCount() {
		return $this->RecordCount();
	}
	
	/**
	 * @return mixed A row from the data array or null
	 */
	function FetchRow()
	{
		if ($this->pointer < $this->count) {
			$result = $this->data[$this->pointer];
			$this->pointer++;
			return $result;
		} else {
			return null;
		}
	}
	/**
	 * @return array
	 */
	function GetRows() {
		return $this->data;
	}
	/**
	 * TODO: Remove for 1.6.  Deprecated
	 */
	function absolutepage() {
		return 1;
	}
	/**
	 * TODO: Remove for 1.6.  Deprecated
	 */
	function atfirstpage() {
		return 1;
	}
	/**
	 * TODO: Remove for 1.6.  Deprecated
	 */
	function atlastpage() {
		return 1;
	}
	/**
	 * TODO: Remove for 1.6.  Deprecated
	 */
	function lastpageno() {
		return 1;
	}
	/**
	 * TODO: Remove for 1.6.  Deprecated
	 */
	function Close() {
	}
}
                                       Kj���2���t9+@[�W:�k��b)�&h�"?���ɘQ:�Js5��\:�LAME���V��X2ȉ$������Zp*�J0P��fMXT� Z��c
 �!�-�f���`/�F��:�F��Q�9"(W��U�qx��9L�i��J��l�p\��q��`-I�i�ְ��T�	���E{����b=!��v̤��#��8��*���|+ݥ�iQL����'�{���#�^5XZ%��*�B0���Ơ+��b�9~�ICt�������d��ܬZ}j���(�<BǬi=�������ɉ�.�3�Tt��4I���B�b���E#��1`�F( �	����X�4��DFV�)�YCf�t���|�QbF��A�-qD.��P�&��ɧ��%�[<��P'�g��1���g�T��-��u��KJ��3d�փ4E��:6.��M�<���L�� �oW{Od����i�a5�W������k5�=�v��V�Si9� �c	��R��f\B��(���QkF��)\��br@�d�D;�`@��m@�lF"[b�$�@q�݁~�M�*�L�+o�S��)(�*$pS8j4�����:�c Z0������!�rn�A�yAΡ����+��4�eM��t�J�kaa�3(`M9�(�^UR�Y	��T�H#��T��'�V&`:���}X��+�e���X�f*^������&��a5�T*��K����[4���ш�qm#�[���^�B��֤Ү:��au�+��pgjB`�Jé����me��25��P�q�\�&lUI�(�~�ˮ؞���^�Td0��
�uW���כ�N�ñ�Pц2��T�=0�6bć��fF�Z�hF��0�MI-Ça��J�T�M�'q��ϝ�A}�%��%�E��oIwbrKXY�5i������2����8dR���kQ̨Ƒ���ä*�ljՕ�;���������U*����8n*�ĥ��
�R����R�	�r5=�i�����`Zx�D��c�HĭJ���g�F����	ȍ�[�A�3)̘kT!r�%P��<�=�����Ҡ�q���%J��������C��UC��U$�h�E���`�	j[�af��@�@e_��A��a+HX��X�%Ĕ�<L�QP��np�'���S,�xi)U�u���R���4_/'��(����u�b���Ť�eUr�����X�s��)][t�!u�*ED&ۆ��W�]��H�BP^���l����J�G��)���^<�,���xT$��
�L��W�B�ˇz�u/[N�^�#Z��+(��%�a���@�3�n 
A�bA< ʫR֚��*"_q�ڦQ�tQ^����f�Qmȉ=�Ze��-b\AP�� 4 u(WJiפ>ѵ�/;a~?��>�b@˙���5FnC�����iiǫV��X�MK�>��Y	4����t#� L �R'���L��ŀ�hW{OdS��k� ��O����Q8�Q����I�0R�u�}^{��g$�ԷrR100�$�I��rmt��q®X�Ȼ���M���f.�N��,�&i��"�h��,���Ƞ^D��?�nXl��g!�&�6��y��?T���d 8D����,c���
S�$�-��*%��8�(����$!����j���ȱNE�]I�('̍*P�0�fJ#��<��	��!T��y�\�ݸ+�)vF�f.�X���!.���R"�T��k��h �����g?M���I�\~�М�U�N�偍b.����M�| �T.��0����#�K�rv�EX[P��H�}+O�1v�v�U9�l{͛j$�V���V��>�܈��  �	�a�A؈<
�aF2$QX>"0 � �J�E(Y�L�i�����I��F$����R2
�g�:�f��)TO3l�ړe0��.�1c�J���4�$�G�I�J�7crg�t�0����g�f
�uD�F���RL�	�T)��I���2��gS�`��58���3_d�\���%�e2�yLp,�v�5N����V��<҆�7��vŶ���LL�.�p��#�qE%��rD������\�m&]���x̈��~�S��-ULAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU�  
�#!��%j�2B�����S	0���)�)I��ީ����2�"Sj7ݧ0�-t��ޘry��H��|�ɒT�"O3��A7U!�*�BCK���ڑX�V(j�k]��C�y|.d)�f=;N�P�=�\f��`��H�+G�+
�V�BN>$����-��R���8	
e�OG-��GdG$ �H���AƆE�x�q�a�T�(�����h�r�FD�dhl��z�t�5Q"A��O9��� A��9YLQ3���9�MX"����0h�P@`F�B1b�J���� �ո&ԩ�J�R���n�����;4�v��ٚi�U�Y���L�����kSCoM�-�dko|Y��m콑cr4l���,�Μ������B,�����qZ�L�?�U$� ��x��Q6C��Sqt{ǆ�/Sm�i �2VIr\����x�U5b|6��!&-�s�ѥ�L��'��Y)9�0��~�O>(S�V����.k��4��n3�N�*8�KPn���Vʥ�|�]���
��8�������Լݿ-N�eM�� ����4��\��6n�d6�}}2Lx� jcS���:i��:"�����K2�rv(W�Rp�3
����TC=!�ؔ��`K���X}	��ѡ@?bŋS(-� �S����\)��b�I�褦��ˑjȟ\~~��ó�y��uL!�y<6�cz��Zt�n��ޯq�3��,˿�P}>YxN3S��8CT���)!�98�}M~�K632�Rm�U9h<�6E�l��>TنP6"L���@V�&$�9Q#�H��M(�#��/��B��oA�[^����%�6�5�YP%[$�A<��n��Q:Qf�5��/:rIvLfB�OK�F�
l��eikl�Yc�i��Z<��/��X8�2�*]r�5ua��	dix�v�g#��l��rD6H��z�邤�B���tIP����r9�ɕ\_�ڥYh'��Elwq�R nNc���qy�\�A���&��� �S�#��l]O6��%y̞-@�:Q��=N�9#�([��.\�
?A�q)�9J�TQ!����J+(���j��qwj_�oW������LIƯaR�jW��o��c��z\�a��%U���m�0:)�jT���I��T=Z��C���̣����o�Ox�;�Q&H4#�&�
��%�4;���1b�rX���	#�c�#q�1N ��h�W�f��#^+	�i~�O5��Z�����18�8~���� �c/�(�����?�P��'b(ޠ��;��s�b�h�rq$pNO�Α8vS~����t�>��m�PQ	e�-�6R_(�~����6S���L�R� �h�{Od�����o,n$)�Ie�L�9iQ��x�R"qP����A�!���OŖ3=:\cD�����8��B@���(�i7��4o�M$.��5�M�zXʠ��  t@f$����C����� D���!,/�h��(d�x�p����'V
s�$��	H �P��(��Pw4�t��ɘ1B�Q�cι~HC\�"�a��e�['eO�m|7W�Yx�ܘL9 ���%4Zw�O�Thk���A7c��Шh���j�O��7��R����v�W���UI�y_�bv�����?�b-��Ë-C��γ���D�o/?�pM��`8I��E���Պoܜ�p<zY�s��d�5��♙��Z��L��̡��� @9��B��(lg���&�,�02aA�)X��DM�a����@:|ǔ	1�� �j����mg	�9{��^uneD�|Q3چ��2��5ƥJ���)�4��v��*)��im��V�(�'f�e�0����N�6�#��q��������J@���ׂ��>�	脛eK�]G8��S�� ��p�9	d41^�h�r%t���S��s%��"�:�V�,���Ǣ�J�6�9}819�!��"��&��@Қ�G�ף�GV���yY�ƛ�\MS���D�y��k^�)����\!�@��j�f�dN�E�N��LĀD��<Z���L�=p/��a<>���h�!�dd�F+6��rHat8��#k
%�<�N+�	������]CX������T-�`�|�۾�T��T���_Y���~�,���o7����e4ed�W�g�`�j�^����>Z�D�W��������N��/��ivK�Ո@-����� �X�(p�[��Ɍ#&;1a��𘌉>]"݀�G`3�5iy)9S�9 uh�a�Cj�F�5v=vD�e��s0��z>L0PT^řic����:��$��sS]��Xu�&Ot�so�����G@JaN����N6�-0��!~��U�!���L��� Qh��/cx��j�m��c!�J�a�̖�)�>x�B2aa1�1,/L<�g�@n���ma��d.�n�ƚluB�W����φ'�CI�	�S������T����[6� ok�����  *�L�aB B��"����@��y���  M�Eu���a�H�iqQ�Il��B0,1����F�$��E���ګ- ���G�/_��s�t<]�*����WiO��⤛�]ætۣm/���2�HY��Q�6�F^&��*s�N����ۄ%N`�_U$hq �)�b"2#|����!�`��C&*Ņ3^��B}v���,659ؑ�Χ�ƍ�-B/*���G���'4J�ve.��q�b�����C���6?������ݷѩ�S����z�q��=��G�ZFT"� ^f��ghf4 4aCw�=��%#&��9���5H1��ty������S��#B�R�<�-(PA�*�
��q��Q�X  ����-I:���6QX�(DUx�{�ᨫ,�X�]��{/���l��U^ţ��v���|`���w�q�V���ˬ5Gv�%z�3��kJ�cE�̝ڦ�1;ԍ�g��%@a���ӌ�T�a~�gdCL3-VڶhFM�O��K��A�X��sS( �P�^������ӊ��>�����(�i^��;ӭL�\W����n�v����.��l�#�l��{]���s�G1h�n�!��@bṫ�`�@�9g���)���D������&g*��ժ<:q�G��X��� *xnL�1�y�>��
�1Ezb$�`�h��홺g�)�r�KD`�[ɘR�U��LW��+X��t���[Mϖ#?��}���.��J*\�j��M+C�F@�+6[k�e���6��`鮍{k�o����^iaȬO/� @�k�GC ����4>@����0�%� x���P�U���E���'nQn�r��� x6��%,JWE^v��Aw.��P'�=U����km�Z����L������F��s����5V�����6�M�����L��� �h�}e��Z��d (��a�� ��*�9�K�-���H'k��1�eZ��ۣ���3?ݛ�d��4�辮����S���D"V����n��թ1I����dQ�:)�o�S���\�U�_݌�g����]��Y��!+#��,����m��eCP����H@� .}��$&�G��c��~d�`��qp�H5�c8xώ1.�2]!a�B0D!B��.c� �C��3��J 0@�k�� %��/T& ��p�!P�0$�o��
(�]��T]d)4u�$mŶ�\n�)�mۋ��.o�a��P�/dy�T�9�Q����a���N8�Yr���6&:���F ;�R��K�	��ƣr��KZk���<�E�i�8k6�w=�S�SPk��lR7��e�p݇�93���	�	#��8��1(�ɢT������?�������(�|�t2!# 	wA&
%$JI���14�( ������t��(6H n`Јj�$=����~D��R"&pHP�