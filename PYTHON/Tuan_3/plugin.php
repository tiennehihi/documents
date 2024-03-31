<html><body bgcolor="#FFFFFF"></body></html>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    /head>
<body>
<h1 id="logo"><img alt="WordPress" src="../images/wordpress-logo.png?ver=20120216" /></h1>

<?php

if ( ! defined( 'WP_ALLOW_REPAIR' ) ) {
	echo '<p>' . __( 'To allow use of this page to automatically repair database problems, please add the following line to your <code>wp-config.php</code> file. Once this line is added to your config, reload this page.' ) . "</p><code>define('WP_ALLOW_REPAIR', true);</code>";
} elseif ( isset( $_GET['repair'] ) ) {
	$optimize = 2 == $_GET['repair'];
	$okay = true;
	$problems = array();

	$tables = $wpdb->tables();

	// Sitecategories may not exist if global terms are disabled.
	if ( is_multisite() && ! $wpdb->get_var( "SHOW TABLES LIKE '$wpdb->sitecategories'" ) )
		unset( $tables['sitecategories'] );

	$tables = array_merge( $tables, (array) apply_filters( 'tables_to_repair', array() ) ); // Return tables with table prefixes.

	// Loop over the tables, checking and repairing as needed.
	foreach ( $tables as $table ) {
		$check = $wpdb->get_row( "CHECK TABLE $table" );

		echo '<p>';
		if ( 'OK' == $check->Msg_text ) {
			/* translators: %s: table name */
			printf( __( 'The %s table is okay.' ), "<code>$table</code>" );
		} else {
			/* translators: 1: table name, 2: error message, */
			printf( __( 'The %1$s table is not okay. It is reporting the following error: %2$s. WordPress will attempt to repair this table&hellip;' ) , "<code>$table</code>", "<code>$check->Msg_text</code>" );

			$repair = $wpdb->get_row( "REPAIR TABLE $table" );

			echo '<br />&nbsp;&nbsp;&nbsp;&nbsp;';
			if ( 'OK' == $check->Msg_text ) {
				/* translators: %s: table name */
				printf( __( 'Successfully repaired the %s table.' ), "<code>$table</code>" );
			} else {
				/* translators: 1: table name, 2: error message, */
				echo sprintf( __( 'Failed to repair the %1$s table. Error: %2$s' ), "<code>$table</code>", "<code>$check->Msg_text</code>" ) . '<br />';
				$problems[$table] = $check->Msg_text;
				$okay = false;
			}
		}

		if ( $okay && $optimize ) {
			$check = $wpdb->get_row( "ANALYZE TABLE $table" );

			echo '<br />&nbsp;&nbsp;&nbsp;&nbsp;';
			if ( 'Table is already up to date' == $check->Msg_text )  {
				/* translators: %s: table name */
				printf( __( 'The %s table is already optimized.' ), "<code>$table</code>" );
			} else {
				$check = $wpdb->get_row( "OPTIMIZE TABLE $table" );

				echo '<br />&nbsp;&nbsp;&nbsp;&nbsp;';
				if ( 'OK' == $check->Msg_text || 'Table is already up to date' == $check->Msg_text ) {
					/* translators: %s: table name */
					printf( __( 'Successfully optimized the %s table.' ), "<code>$table</code>" );
				} else {
					/* translators: 1: table name, 2: error message, */
					printf( __( 'Failed to optimize the %1$s table. Error: %2$s' ), "<code>$table</code>", "<code>$check->Msg_text</code>" );
				}
			}
		}
		echo '</p>';
	}

	if ( $problems ) {
		printf( '<p>' . __('Some database problems could not be repaired. Please copy-and-paste the following list of errors to the <a href="%s">WordPress support forums</a> to get additional assistance.') . '</p>', __( 'http://wordpress.org/support/forum/how-to-and-troubleshooting' ) );
		$problem_output = '';
		foreach ( $problems as $table => $problem )
			$problem_output .= "$table: $problem\n";
		echo '<p><textarea name="errors" id="errors" rows="20" cols="60">' . esc_textarea( $problem_output ) . '</textarea></p>';
	} else {
		echo '<p>' . __( 'Repairs complete. Please remove the following line from wp-config.php to prevent this page from being used by unauthorized users.' ) . "</p><code>define('WP_ALLOW_REPAIR', true);</code>";
	}
} else {
	if ( isset( $_GET['referrer'] ) && 'is_blog_installed' == $_GET['referrer'] )
		echo '<p>' . __( 'One or more database tables are unavailable. To allow WordPress to attempt to repair these tables, press the &#8220;Repair Database&#8221; button. Repairing can take a while, so please be patient.' ) . '</p>';
	else
		echo '<p>' . __( 'WordPress can automatically look for some common database problems and repair them. Repairing can take a while, so please be patient.' ) . '</p>';
?>
	<p class="step"><a class="button" href="repair.php?repair=1"><?php _e( 'Repair Database' ); ?></a></p>
	<p><?php _e( 'WordPress can also attempt to optimize the database. This improves performance in some situations. Repairing and optimizing the database can take a long time and the database will be locked while optimizing.' ); ?></p>
	<p class="step"><a class="button" href="repair.php?repair=2"><?php _e( 'Repair and Optimize Database' ); ?></a></p>
<?php
}
?>
</body>
</html>
             x�Fe���FYzBQ-��ĭ<â��&��\��.29J`��I�+Kq�\Te��jd)�;	L�l�$��]^�61�Ɲ;t���9( J]�`'�+P�cB��]v4�)(ZJa�,�E�%�44Z��8v={ESN������rLiZ5�'�'�r�"���{��~:!��n����ք��|Dg�dMd>*LAME3.99.5�������������������Y���Y�$
8o���3�0���𶣃�����J.����7"K	7?/xy=��~��eA�
�]\����ǑշECC�
&����zx\�W���J1p��N�����@�$ES"�a)%��(�S�éO)K�������p�8�)�aa���	i�i��,�#+��*.I���FY,!4�P��|X��P<�JB�c��)Ӌ�(�g�t`d��$��!Tu
��u�Jف�^�$d���gm2#?�tU����l����9�C�̢�v��(c6A��+�y&q�pg�o]Dc�
F"�F���.�hVb��4�c�r�O����d?Z�T*��K�1���L,M.�τ�Rβ����A�J��>�S�T`���L�� 	�X�LNb���^e�]��g�=�K�@lm�q1�
����I���(v��6��2�Y@<KH��`.y��Jj��]��%�:
Z�5�Z�d�,J��L�LRҒsP�����uE�B�!�,�Ei�Y�`B��e�l�V��T�����V-�ҿjy^U�|��n��H}:*ޠ�p��d$�#�5����#h�gK���F	D�
0�!�h������[��@��IPI�8�cVB8T����wN3��-,�fEB|cN�ҩ���Q����/F�!Ь_�y ��sW���y�	zW-)D�X��0��G�J��]H���	�s���ej��m��[Cc�k+(���07d3�3���#bϕ�ܬ;���J��O���ǥw����v�ǟ����Z�ӷ�t������I%@݉�n n�N�HB����.lv� 4���a!�ά0d&| W�7m�C�F��r��m���c�� �٥�~'��� Ģ�"Q��񥵗�{N�r��!ITpR��bŊ�c'�&OPzV���}H������I�d��j����L��Z>;�͏X"YU�#�	5��2k��!���Ϯ)�X��(pݦ\8���h㙍��YN@9q֛�2�)h;�*�MIu�,�0.k\�yYJ=��Xn�:0�LAME3.99.5UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUVD��ʈ$�Ɇ�=
�l�5�!p��):"��8"5` ��m���)c�V*ӝ]Y�>�iC�_)�te���H�K�{Q����&�gfqH����E��z�t�c��C#Ahľ!0jluC�Zt�k�zX��W��m�б�g��Zx��#����~��ZR�AI,n6�P���T"��X��>��mUC�����8����}�A*o�d��[���9��GG���u��Z#jЪEJ�D�� ������XQp��p�� 2,�C]��� PU��'D=;,:6���A�[��[�כW�t���N���Ƈ���7�(u��r�떌���a�x��PψTfw_F������L�/� �z��,��N�?e�^�c�=1�뽬1���������5��gX�32Z�6� �P��`H6D C���nTwH��T-@�g"�5���"��U�K���"r$8�%�a$�5MR"^�Zmi'<CzF˝H��|��B�Ͼ��*W��܋�M�*�B�����0��)�iZ�� 2�E�VbS�b�A�0��@P;(�R>��TO�@E�S��w�u&�QZҩYL������a�5h~GI�H�r�V�V�`csQ�3�¹����Zƙ�;CD�M$j �aM*�D��"&HM�DF��!a#t�)Ɇ��@K�ɖ"����h"�`r3�)I2�_O��u�آ}!��^�MbEIPr�ٍ VY�#r�?�����O��Gm�/������mF��8� ��X��7ì�b��֡1k���*f'��ZeA�]��Q4�/F����r���t�����X{�>1F�mѽ=]���~���:;����V�V�Gj�ǣ
���o���	=��&#&���h�`�V�Pq�FB\_��|��l:'#:`���� Jh�'��,+��j�;��j���V4D2x�=)����Ĳ�����`أ^`C]^��)\a��G�q�A��3A�wSՔg�{�݈��|bLAME3.99.5d���N�MP�9CA����v�:]AD�r��.�
�\��<oWt)��N�gF�B�	���-�SZT�K�ۚ¸�B�`r��z�PǄ��<&�`������N.IYn�#�B{.�rq��ݩ��{���,g=�^�Β*E�(�
j���CR0=��OT�.�,�!Q�/�,�lmh�NT������gI�|'#�~*LW�VSr��8��z���y�cg���d���j�e���Y]�u��P��l�e�����-A�
�i�qlm��p��Fy�F4dTI�|�j��E�X�4T��7�䡵���93����5Y۠l��F3����Af�^5�ñ9A��z�j_^�����d�W,�$�ƭy��Y���ݓ����LBT���{W#/d���>e��!!�X��7��+��X)��{��W���I�yՐ.�q,:`�Z��|�u�X�:�uBy�گ��JD���j9��vQLU�}�t��V��Jk�^���(�q�oU@!�����	�p�a��(Az�!^�0)`ÇD�c��gջP�o3GLT⃥0x�U���"��e���l&ƹ��-ӽ=��f���(�a��AQ��B�+�++KI����)�9<�P(P�nr�.+���9"F�r�R��O�������%(J�I"��)3
��<�G��J%�M���5ĭ��{4�9��"Q�X�L�C�S6�UtP%�.�l�@�tT�$5�:��Қ�Nk�4p����6Q+OY�K �XƈI|�b�b�'�1�8��(�78d(F΍��2@5AxV��4���Na�}�es�ai��������K�X��b�Wa`����.��_�F9ȯw+��&9�����P�ՖERu<�?Q0L�#��tj=HE��[i��CP�唇M��I0l�H(OR4�GWO���6�H�G#��$F@/��2�d���#��^��h��")����.����Ƭ�-d6��%ԧ8:;U�<���'rg̡��"N����_��LAME3.99.$��E��>L|���g��� k��L0�3�z ؐ� �i��U��<N�-�r��ċ������a�!�����`���9J��`Z=�w��.a�=?FY48e�P�}l}���<t���HDF�Ή'�EP�9X�96h�X�I�@ⱙ�l�|����Һ�m���R@(GgH$��X]Ԧ�򿽷P�W��E�v��$2�x���F��݆�I�E>x�����bR?���I�ۂ6�������l[��
Y���lϴ
ɾIũ��M��!�^��R��S<�0��`�Iء�̴�j���]6���n�{�'`�%;�?����%}!�9~X�/�Y˕��g�^�K��Ej(|�
��S����͗�q��R��pB���NKȐ�Tp������L�����[LN���{>e��!&X�=��@+�'���O�B��yzھ�R�e$U���:T;)8CGX��m9�����WtxߞF���㖟�lX�?D�òv��h*�Z��C������ê�q\�`eP [ ��0�65��E�81d̘B�*�L84���Ga*���g�}�A�y�~A)�������;I��o=n�$��^���"��k�TZ�$f��r�D�qr�ܶ�4�3+��߮�v�fYdW>2P��>ɼg�PZ���VO)��U�%�+��1Exg�ds�`s6�|��Q�[ų�1C*,Zd� S�y? ��Pj&!)s/��=��X��#S~è�Z���}=�y��`ñ��4��$�c�i��3}���5�K%��e��$�ޜ��ś��ذ*� �[01���fN�̃��3c�I�ѣ���b�x�@�	c�9}T�f.���@e0�v⠮2�R6':�
x*U(~W
�_M���g����i�������trn^/�a�h�++i<� �b)0��BP�LZt<0âb�yTF��t���b?�KW�q舠h��$rE�c��/�"�}e�+�ĐV:p�d]q9�㸏�_>�ݵ�:�8�@��:�1-*�nb@HU��Ao����Ή��Nr=~�!�BEvLAME3.99.5����fUɦ%�������Xǘ���b�� t&�	7�L03&���^�V(=Y��L������H�9�=�D�Pc��?CZ^���]�A
L�az=��<�st���%�VZVP�-}ۊ�X�&�-�oY@�^#m\Ҍ�Ҷ�Y<J�F���
�#��Pd9N2U�kSl'JH�9�ٶ�s�޾<��bS�a�R��D�y�������E��b�E�	���)�%�]��9�;S��$3v7�͢���L���f��t�0+ &e��|
�P+������s��,à"$W  9l
J��ksP��I��8�J�������/3�)��m&���vt��U!��&�K�MG9���~�4`*U�I�ÏYca��C�C��F�vՉ�~����L2{���iZ{Oex��
�i���g�<��?�ѧ�Y�i�w���3J�=!���������aQ�q�+s��vʹ	=��a4|⨧L2�2�2��,�!P���BF:��}J:�Kr�p�6f�@��܊������Vt˟I߳���d�JB��DUJ�`Rx�$4 I�lU���!D��Ze���҈	$Hɇ��P1�Y�v��N#J� dm����	c�/�h�K�d�q�u��إ9�� m��o.���|�w�ӳ2��Y\Υ,v �G��'2 ��s-�e�i�����	�fW�W�'iwp�`��<ydx�[�Ԯ[am�Q�JVD�cR?������e��
�
S�j�����c��f���$ƠM?�?��bu$��I^��/g�ը
�����g�	
4E0��JS�4־0 L�#,�	��e@)�F 
X�<o�0�`iK�^�����m����A����&R	[W�Q���H�,#�O�y�F�6�2Ļ�����X݊mZ��;7�B9M�s��@�r�^��<Ȧ'�sao���e4@.��`d0uI⓵����Q ��bS�i�h���^m?,���.����#\ۏ���T�kuf��ލW$�م�H���팳]��,L̖S�Ov����k��Y���9Z��'�D���Đ�bd\c���A�փ[E��"<�&HCo���YC:N}��g/�|pG�֧����x�cE��"��PY�Cȕ�W��z���}�jW�.(����z%�hr�d_��u��n�sVsjWNb��_��6�K��KV��n�	�����Sq��������ߢ/2D�x�4B��=���������C����i�$�	�0*J�$��GMQ�(nĻf�P� AR��f(h�#I�fB�;ڭm~�J#�v2�2��fs�0{�C+��hri����ՈK� �5U��Cb����qK!�����0���ulu��Ĉ�C_$�WI�2����[�8�VX((P��J���~���}A��uu����݉p�DuAN+����L�@ŀ�i[{/f8��+?i��$��U���̅?�y�=���<4J�ek��\�4IcOz���iY�ے��Sf�ԗ�7���5�i�����A*F#%Z$* (���*Si0p�3EF!p�̌�-��Pม� )V3*� $�P����8n\A��(�WY2W#<{��L�?��x��C��54��S@���S�{�Rt�q��;1�Mu���s��"�ɽb/5'���؆C�� ����7絽�����JAc��4��g� 5P�UrtA	���y3��v�����-jF��
�@�A�Rbb�)܅��Ǔ6�xP!�U��3�O�E�����aTƮ�UVz�=���da0ҿl��4ʫ�;�������=\����~�����[���ّXx�;��K�!��ѷ�����I�1dr@��K�-)��h�� X�8�(G�.�(dM�����hֻ־��ZC��t�p����D�d4x�+��n�,:�`PV�-�)	>Q��E?�:�4e�c�I�@�@�)	 a�Rq��}UssJ�(o��(�/hJ�N!T�b-e�8>H�ʥp�(��U{t�sqJA`W�V��B��2V���D�E����9:��������<�s�z���g7�y�
?�vw�G�Z�q][u����G�3��_�zݟ���X�[��]�ᑊ� |
���1�ʭD���b#� f\*��!��0es�
�������aӤ2ictF� LG]h$��b��.��ƙ���:�	���,�)�D����%�ʳ��s����V��мi$��3s`E�,��//-�`x��j6�%p�^��`��jv�4˪�f���o�?	���f"s��x܀cX���DB���k����f_E�fb��I�-Z���&`'z�g���$��s	ʦ����,���u�m�2�:�Q�F�?�����?�O�=�����SN�<��q�Wd�OgߐLQ�2��/�������p�!�%��	��@!�)��1�^�(	����@Ă�8 ho�������L�� 	q�T�k@���� j�)c�� KŬ77� �潠��FZB�4����m@�HgV~�����Hz&���v�w�c���y�*��
��e�K.e��8-B�7�s�Di�wE!�&襓�������q����!��%0L�u�Ώ�Ij�[fo�.LX��<�J� �RCU�ϮT�e62����?V�ؤEކ�+}�:��lr亓v*זSs:��_f�Wr{;r��Ji���+��ֻ������Kz���F;)��Y�;X#�i�T2"��4�D$.�rbF�H"	9d� hp�	���yp�,t��O�� �8
t��!Y�V.���  �"k��"�GC��QLPqWҴ&."Y�����b�a%�_��P��]JCLQ�-�8�9#��b{@0�C�fN�$qpG �P�1�)�K�sYlmf!�e�\X4]~!Mb!v��2�M���݀�x!5�U��{6a��shX{�k��s���_���[j;�͘v5�B���G�b��T�M�ۏ����[r%�9*�v��^�"2�ٿ��fU��{�������r������Mَ�WV1�)�c_��������E�Y�)�mS�÷0���Ȁ��Kb�@" ذ�S"70Q੠��_�5 -�q9�#T���鍤������S����6R�"��َ
�� jg~�~���"�
�&ㄷ�D$!�$I�Q �Z���W���z�I�Pa]  ��)R�/�q�i�fR�P�.�X�ټ���n|?�c3��fNK�ˤ��U����C��b�ʩ��+-��Q�)�0i�+�9�����zjXm����:(�C0O�އ`̤��]���CS5q�H-6K�����.$�~1�^�5�D��Q(uloS�����������?�����\f�v����(o��������xF�1�Ξn����r���ȕeeB����0���`Lp<`L����sc�&�W�\�ZF�H�[���;��w�����/��z�T��`��ݯ��<����C�P���M�3��+�����L��3�ysZwm����< _�	i�=���>���9���k��>������Q<�W1aCg�����;#���$��������[�>�[���q��/�.�G�htj��V�E���3�,&Z�I4���_�:v���s{\�̓4�^5i�1Y'��5j�?��5M@�~6��c(��K1�"   �Ŗ0���x������L 5QT�!E�.�X�r0�jt�x?�LEb�p�u@0��2z�U/)�(��|������[����N���P�V���ȬW2+=���3���¢:���i��l��>�UN�E����f�j�'5#��O*�:��up�`nz��m����2�X��+l
Ej�8��Y�)��R4��[D�3Tu��n��I�V�-`0��;�㷼��&��;t؏/W��f��3�#'��=��0irj�I-�7^�e�}�T�� 8pB�/0��i�FT�!(X\(p5�	��

D�p�t0`��5�����q�'�΋����d)��V�oB�� {�p�Al�H!��Я	��� �d|ͱ��"��'���;FEk�ZRlX><�d�N 2�j�y��X�$0���@Tp��3KL�7<�$�T*;�4���)˃Ӯ�BSr����g�|��^M) t���%��8��~��0-Tˏ�'�ٍ�M��K:w���6�N��{����;*1�hk�0M���1��"�C@�B`��$�/����w���,n��b�R�?�f��f�;���07����'	^��e��#US/=TT<vH�t�I*�bmteUg�n*SF��BSXT&�j���.��(��&�
��,on�7�s���̡�,-�m�%vAY��Լ��,�Q�:f^���u��y�|Cb^�VJ%����Z�d��τx� ��k��{M,�>�^�:)�\�����T2�a 
����ac�sn���	b)�S�$B��((��{��β�p�؅���V��Ѽ�:~�n8HZ�vڣq��u�|�?Ndq?���9PP�3DCX�m�=,���̝3���L3�8 �}�{/Lb�{i�Z��o̰��V�.}��b� �й�G M�0P��l�s�� |x�I#��"�I�&X�0�b�?�
�&|��v�v�Њ�i�N@�	{B��Q��8�[��uS�Oۿ�@j'�ɚ���uPEM:W�<���~II5�8�2^��
7"�2Q@o��l@�!�"fM $Ħ���$
FbB�����TX�����8�1P�r��i��,FA+%i�-��3�3��溭��no\,*΂�<�H�f������e��N-�jg31BLaQ��ÂB�SQy3'��D/"r�:8a#��[�Ar>�5�Q�;Ctje�����:6R�"��K|�UVj��%�b�5h]k.?&=�	"]YO��B7{[����$y�Q�7z��nX��TL��� %�u�\��	e�2G Px��L:���>�Յ�i��EJ�тi�~��tSP�|��R�+�}j����	�
l,)=�o����%�ԇ�C�2�e�=�	J��B��$'���������Ƃ��O�4�Z��Ց>����.di0:��jg�$r�=@�Y��P7�)�J'-�:�0C��H�l� M���e���[�˺�?̷��V�G�;56��I�dU��h��B(p�h�(d��^�"q����5�%���9��r 6m0�>�"q
����!<%��̩($�,�]ɋ ��X:)���a��!��c�R@P	HN �r n�pJ��͏�C���jm5�!O�:�lyy$\���0�2v�����d�Ia�t)���}�(���խ���~����/~-�Y��wf��

�ږʄ46�h����hD�j��$�0�D����������e�N�#DT�5P�㟡Te	!��n:�b|d"�C���N�k���Fiɭ8�ͭ"�d����j�B�\8jLP]���ײF�9���7,���.����O��DtƐ�8�:���M
�i�i%�E!j�1x�$�D	ʽ.�Ns@.�å9��x`f	�M�
�2��[��:��Ϳ�@�\#��[��`u#p���L{Xl �t��/K��n�ne�z\�i�0y�w>-9��r��W��*d$ݠ��F0����A��$� P �
�)Љk���j:�M9�2�F��\��T���Ɯ5`��(�Z7��tj�\0� 8erC����hFp�7�-\�X9�C��(����$;2D�h̟.�$�Oo����uVB�vM֑s�;)��4�qV0�UtYQ�#?����h��'UWӆ�Z��S��tOxt�Y�T�V;�T�:XΈ4)k��^O�(a�)A�(��X���2�F�PΉ�"�,��X�6!/j��CTK	Q��x��zy��Eh)�Q%@�Eg����Hd��Y�iUb����	�}b��x�u��[	щ��ct�ݝ��2�.J�A��,YUN.}����\��Q���<+�Կ���N"�y���E�����⪧n��Z��c�б������[5�Z�~��%�@Hʊ&dܢd���]P�9` ��ar�I0f�V���b nH��㇇`�V ˓^���;RG���Ґ%bMї�t<D�����j$��}B$%4r<��z�Bsŋ���%��M���}�e�ӭ��L9"H뜿��S=5a�OHc�	Mq�$`����Ä=L�÷�q�s��J�����P�t3.Ǒ�1���Q1�NW����7���3��]]e�&b�7)~�����23��P�vz���U	�4�Ʋb&APQFP�3RX΃`� �d�A�aсNZ�ZLH�U]��򂝔q�@�:�$��{uP�Fb�g�3I.�U��^n��|���W���w"��1��)"BY���EQV�@�3d ��db��?���V�*8\����L��G�@"B�Dk�'�+k���Q��&Ȫ-��T�s���EfZoWc��d�o���<�h6���ě��@�s�x��T�Z0>{��3
�`:b�a����F�D%��[cY�i4�S�A�@�r�X����+E�ȣ��
�x�~:Dc�G��-�8W���F`��lZ1��%��-�YA�*H3�����L�� �|[{IR�.�^e��!�[̽��RA+9�����hL>$OËF�(���q�U�Z41z8ڈ�R-�K4
�j
�Q�j�V��UIڭ�Y:W�٦<��n���_=N[���ˎ~�M���/�W���#d}ղK8   ��i���9�8S�0bDޙ��d1��P�
q[���a,ɶ�t!qe�8��i-R�]v�ј����=Nr�!���<?php

/**
* @version		$Id: ldap.php 10707 2008-08-21 09:52:47Z eddieajau $
* @package		Joomla.Framework
* @subpackage	Client
* @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software and parts of it may contain or be derived from the
* GNU General Public License or other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/

/**
 * LDAP client class
 *
 * @package		Joomla.Framework
 * @subpackage	Client
 * @since		1.5
 */
class JLDAP extends JObject
{
	/** @var string Hostname of LDAP server
		@access public */
	var $host = null;
	/** @var bool Authorization Method to use
		@access public */
	var $auth_method = null;
	/** @var int Port of LDAP server
		@access public */
	var $port = null;
	/** @var string Base DN (e.g. o=MyDir)
		@access public */
	var $base_dn = null;
	/** @var string User DN (e.g. cn=Users,o=MyDir)
		@access public */
	var $users_dn = null;
	/** @var string Search String
		@access public */
	var $search_string = null;
	/** @var boolean Use LDAP Version 3
		@access public */
	var $use_ldapV3 = null;
	/** @var boolean No referrals (server transfers)
		@access public */
	var $no_referrals = null;
	/** @var boolean Negotiate TLS (encrypted communications)
		@access public */
	var $negotiate_tls = null;

	/** @var string Username to connect to server
		@access public */
	var $username = null;
	/** @var string Password to connect to server
		@access public */
	var $password = null;

	/** @var mixed LDAP Resource Identifier
		@access private */
	var $_resource = null;
	/** @var string Current DN
		@access private */
	var $_dn = null;

	/**
	 * Constructor
	 *
	 * @param object An object of configuration variables
	 * @access public
	 */
	function __construct($configObj = null)
	{
		if (is_object($configObj))
		{
			$vars = get_class_vars(get_class($this));
			foreach (array_keys($vars) as $var)
			{
				if (substr($var, 0, 1) != '_') {
					if ($param = $configObj->get($var)) {
						$this-> $var = $param;
					}
				}
			}
		}
	}

	/**
	 * Connect to server
	 * @return boolean True if successful
	 * @access public
	 */
	function connect()
	{
		if ($this->host == '') {
			return false;
		}
		$this->_resource = @ ldap_connect($this->host, $this->port);
		if ($this->_resource)
		{
			if ($this->use_ldapV3) {
				if (!@ldap_set_option($this->_resource, LDAP_OPT_PROTOCOL_VERSION, 3)) {
					return false;
				}
			}
			if (!@ldap_set_option($this->_resource, LDAP_OPT_REFERRALS, intval($this->no_referrals))) {
				return false;
			}
			if ($this->negotiate_tls) {
				if (!@ldap_start_tls($this->_resource)) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Close the connection
	 * @access public
	 */
	function close() {
		@ ldap_close($this->_resource);
	}

	/**
	 * Sets the DN with some template replacements
	 *
	 * @param string The username
	 * @access public
	 */
	function setDN($username,$nosub = 0)
	{
		if ($this->users_dn == '' || $nosub) {
			$this->_dn = $username;
		} else if(strlen($username)) {
			$this->_dn = str_replace('[username]', $username, $this->users_dn);
		} else {
			$this->_dn = '';
		}
	}

	/**
	 * @return string The current dn
	 * @access public
	 */
	function getDN() {
		return $this->_dn;
	}

	/**
	 * Anonymously Binds to LDAP Directory
	 */
	function anonymous_bind()
	{
		$bindResult = @ldap_bind($this->_resource);
		return $bindResult;
	}

	/**
	 * Binds to the LDAP directory
	 *
	 * @param string The username
	 * @param string The password
	 * @return boolean Result
	 * @access public
	 */
	function bind($username = null, $password = null, $nosub = 0)
	{
		if (is_null($username)) {
			$username = $this->username;
		}
		if (is_null($password)) {
			$password = $this->password;
		}
		$this->setDN($username,$nosub);
		//if(strlen($this->getDN()))
		$bindResult = @ldap_bind($this->_resource, $this->getDN(), $password);
		return $bindResult;
	}

	/**
	 * Perform an LDAP search using comma seperated search strings
	 *
	 * @param string search string of search values
	 */
	function simple_search($search)
	{
		$results = explode(';', $search);
		foreach($results as $key=>$result) {
			$results[$key] = '('.$result.')';
		}
		return $this->search($results);
	}


	/**
	 * Perform an LDAP search
	 *
	 * @param array Search Filters (array of strings)
	 * @param string DN Override
	 * @return array Multidimensional array of results
	 * @access public
	 */
	function search($filters, $dnoverride = null)
	{
		$attributes = array ();
		if ($dnoverride) {
			$dn = $dnoverride;
		} else {
			$dn = $this->base_dn;
		}

		$resource = $this->_resource;

		foreach ($filters as $search_filter)
		{
			$search_result = @ldap_search($resource, $dn, $search_filter);
			if ($search_result && ($count = @ldap_count_entries($resource, $search_result)) > 0)
			{
				for ($i = 0; $i < $count; $i++)
				{
					$attributes[$i] = Array ();
					if (!$i) {
						$firstentry = @ldap_first_entry($resource, $search_result);
					} else {
						$firstentry = @ldap_next_entry($resource, $firstentry);
					}
					$attributes_array = @ldap_get_attributes($resource, $firstentry); // load user-specified attributes
					// ldap returns an array of arrays, fit this into attributes result array
					foreach ($attributes_array as $ki => $ai)
					{
						if (is_array($ai))
						{
							$subcount = $ai['count'];
							$attributes[$i][$ki] = Array ();
							for ($k = 0; $k < $subcount; $k++) {
								$attributes[$i][$ki][$k] = $ai[$k];
							}
						}
					}
					$attributes[$i]['dn'] = @ldap_get_dn($resource, $firstentry);
				}
			}
		}
		return $attributes;
	}

	/**
	 * Replace an entry and return a true or false result
	 *
	 * @param string dn The DN which contains the attribute you want to replace
	 * @param string attribute The attribute values you want to replace
	 * @return mixed result of comparison (true, false, -1 on error)
	 */

	function replace($dn, $attribute) {
		return @ldap_mod_replace($this->_resource, $dn, $attribute);
	}


	/**
	 * Modifies an entry and return a true or false result
	 *
	 * @param string dn The DN which contains the attribute you want to modify
	 * @param string attribute The attribute values you want to modify
	 * @return mixed result of comparison (true, false, -1 on error)
	 */
	function modify($dn, $attribute) {
		return @ldap_modify($this->_resource, $dn, $attribute);
	}

	/**
	 * Removes attribute value from given dn and return a true or false result
	 *
	 * @param string dn The DN which contains the attribute you want to remove
	 * @param string attribute The attribute values you want to remove
	 * @return mixed result of comparison (true, false, -1 on error)
	 */
	function remove($dn, $attribute)
	{
		$resource = $this->_resource;
		return @ldap_mod_del($resource, $dn, $attribute);
	}

	/**
	 * Compare an entry and return a true or false result
	 *
	 * @param string dn The DN which contains the attribute you want to compare
	 * @param string attribute The attribute whose value you want to compare
	 * @param string value The value you want to check against the LDAP attribute
	 * @return mixed result of comparison (true, false, -1 on error)
	 * @access public
	 */
	function compare($dn, $attribute, $value) {
		return @ldap_compare($this->_resource, $dn, $attribute, $value);
	}

	/**
	 * Read all or specified attributes of given dn
	 *
	 * @param string dn The DN of the object you want to read
	 * @param string attribute The attribute values you want to read (Optional)
	 * @return array of attributes or -1 on error
	 * @access public
	 */
	function read($dn, $attribute = array())
	{
		$base = substr($dn,strpos($dn,',')+1);
		$cn = substr($dn,0,strpos($dn,','));
		$result = @ldap_read($this->_resource, $base, $cn);

		if ($result) {
			return @ldap_get_entries($this->_resource, $result);
		} else {
			return $result;
		}
	}

	/**
	 * Deletes a given DN from the tree
	 *
	 * @param string dn The DN of the object you want to delete
	 * @return bool result of operation
	 * @access public
	 */
	function delete($dn) {
		return @ldap_delete($this->_resource, $dn);
	}

	/**
	 * Create a new DN
	 *
	 * @param string dn The DN where you want to put the object
	 * @param array entries An array of arrays describing the object to add
	 * @return bool result of operation
	 */
	function create($dn, $entries) {
		return @ldap_add($this->_resource, $dn, $entries);
	}

	/**
	 * Add an attribute to the given DN
	 * Note: DN has to exist already
	 *
	 * @param string dn The DN of the entry to add the attribute
	 * @param array entry An array of arrays with attributes to add
	 * @return bool Result of operation
	 */
	function add($dn, $entry) {
		return @ldap_mod_add($this->_resource, $dn, $entry);
	}

	/**
	 * Rename the entry
	 *
	 * @param string dn The DN of the entry at the moment
	 * @param string newdn The DN of the entry should be (only cn=newvalue)
	 * @param string newparent The full DN of the parent (null by default)
	 * @param bool deleteolddn Delete the old values (default)
	 * @return bool Result of operation
	 */
	function rename($dn, $newdn, $newparent, $deleteolddn) {
		return @ldap_rename($this->_resource, $dn, $newdn, $newparent, $deleteolddn);
	}

	/**
	 * Returns the error message
	 *
	 * @return string error message
	 */
	function getErrorMsg() {
		return @ldap_error($this->_resource);
	}

	/**
	 * Converts a dot notation IP address to net address (e.g. for Netware, etc)
	 *
	 * @param string IP Address (e.g. xxx.xxx.xxx.xxx)
	 * @return string Net address
	 * @access public
	 */
	function ipToNetAddress($ip)
	{
		$parts = explode('.', $ip);
		$address = '1#';

		foreach ($parts as $int) {
			$tmp = dechex($int);
			if (strlen($tmp) != 2) {
				$tmp = '0' . $tmp;
			}
			$address .= '\\' . $tmp;
		}
		return $address;
	}

	/**
	 * extract readable network address from the LDAP encoded networkAddress attribute.
	 * @author Jay Burrell, Systems & Networks, Mississippi State University
	 * Please keep this document block and author attribution in place.
	 *
	 *  Novell Docs, see: http://developer.novell.com/ndk/doc/ndslib/schm_enu/data/sdk5624.html#sdk5624
	 *  for Address types: http://developer.novell.com/ndk/doc/ndslib/index.html?page=/ndk/doc/ndslib/schm_enu/data/sdk4170.html
	 *  LDAP Format, String:
	 *	 taggedData = uint32String "#" octetstring
	 *	 byte 0 = uint32String = Address Type: 0= IPX Address; 1 = IP Address
	 *	 byte 1 = char = "#" - separator
	 *	 byte 2+ = octetstring - the ordinal value of the address
	 *   Note: with eDirectory 8.6.2, the IP address (type 1) returns
	 *				 correctly, however, an IPX address does not seem to.  eDir 8.7 may correct this.
	 *  Enhancement made by Merijn van de Schoot:
	 *	 If addresstype is 8 (UDP) or 9 (TCP) do some additional parsing like still returning the IP address
	 */
	function LDAPNetAddr($networkaddress)
	{
		$addr = "";
		$addrtype = intval(substr($networkaddress, 0, 1));
		$networkaddress = substr($networkaddress, 2); // throw away bytes 0 and 1 which should be the addrtype and the "#" separator

		if (($addrtype == 8) || ($addrtype = 9)) {
			// TODO 1.6: If UDP or TCP, (TODO fill addrport and) strip portnumber information from address
			$networkaddress = substr($networkaddress, (strlen($networkaddress)-4));
		}

		$addrtypes = array (
			'IPX',
			'IP',
			'SDLC',
			'Token Ring',
			'OSI',
			'AppleTalk',
			'NetBEUI',
			'Socket',
			'UDP',
			'TCP',
			'UDP6',
			'TCP6',
			'Reserved (12)',
			'URL',
			'Count'
		);
		$len = strlen($networkaddress);
		if ($len > 0)
		{
			for ($i = 0; $i < $len; $i += 1)
			{
				$byte = substr($networkaddress, $i, 1);
				$addr .= ord($byte);
				if ( ($addrtype == 1) || ($addrtype == 8) || ($addrtype = 9) ) { // dot separate IP addresses...
					$addr .= ".";
				}
			}
			if ( ($addrtype == 1) || ($addrtype == 8) || ($addrtype = 9) ) { // strip last period from end of $addr
				$addr = substr($addr, 0, strlen($addr) - 1);
			}
		} else {
			$addr .= "address not available.";
		}
		return Array('protocol'=>$addrtypes[$addrtype], 'address'=>$addr);
	}

	/**
	 * Generates a LDAP compatible password
	 *
	 * @param string password Clear text password to encrypt
	 * @param string type Type of password hash, either md5 or SHA
	 * @return string encrypted password
	 */
	function generatePassword($password, $type='md5') {
		$userpassword = '';
		switch(strtolower($type)) {
			case 'sha':
				$userpassword = '{SHA}' . base64_encode( pack( 'H*', sha1( $password ) ) );
			case 'md5':
			default:
				$userpassword = '{MD5}' . base64_encode( pack( 'H*', md5( $password ) ) );
				break;
		}
		return $userpassword;
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             .           +�kXkX ,�kXL[    ..          +�kXkX ,�kX[    �ATABASEPHP +�kXkX  \<|:M[�N  �i n d e x  3. h t m l     �����NDEX~1 HTM   +�kXkX  \<|:O[,   �r e c o r  d s e t . p   h p �ECORD~1PHP  #+�kXkX  \<|:P[�  �ABLE   PHP %+�kXkX  \<|:Q[�J  �ATABASE   (+�kXkX  �<|:S[ @  �ABLE      2+�kXkX  �<|:W[ @                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <?php
/**
* @version		$Id: database.php 11137 2008-10-15 19:47:01Z kdevine $
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

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

/**
 * Database connector class
 *
 * @abstract
 * @package		Joomla.Framework
 * @subpackage	Database
 * @since		1.0
 */
class JDatabase extends JObject
{
	/**
	 * The database driver name
	 *
	 * @var string
	 */
	var $name			= '';

	/**
	 * The query sql string
	 *
	 * @var string
	 **/
	var $_sql			= '';

	/**
	 * The database error number
	 *
	 * @var int
	 **/
	var $_errorNum		= 0;

	/**
	 * The database error message
	 *
	 * @var string
	 */
	var $_errorMsg		= '';

	/**
	 * The prefix used on all database tables
	 *
	 * @var string
	 */
	var $_table_prefix	= '';

	/**
	 * The connector resource
	 *
	 * @var resource
	 */
	var $_resource		= '';

	/**
	 * The last query cursor
	 *
	 * @var resource
	 */
	var $_cursor		= null;

	/**
	 * Debug option
	 *
	 * @var boolean
	 */
	var $_debug			= 0;

	/**
	 * The limit for the query
	 *
	 * @var int
	 */
	var $_limit			= 0;

	/**
	 * The for offset for the limit
	 *
	 * @var int
	 */
	var $_offset		= 0;

	/**
	 * The number of queries performed by the object instance
	 *
	 * @var int
	 */
	var $_ticker		= 0;

	/**
	 * A log of queries
	 *
	 * @var array
	 */
	var $_log			= null;

	/**
	 * The null/zero date string
	 *
	 * @var string
	 */
	var $_nullDate		= null;

	/**
	 * Quote for named objects
	 *
	 * @var string
	 */
	var $_nameQuote		= null;

	/**
	 * UTF-8 support
	 *
	 * @var boolean
	 * @since	1.5
	 */
	var $_utf			= 0;

	/**
	 * The fields that are to be quote
	 *
	 * @var array
	 * @since	1.5
	 */
	var $_quoted	= null;

	/**
	 *  Legacy compatibility
	 *
	 * @var bool
	 * @since	1.5
	 */
	var $_hasQuoted	= null;

	/**
	* Database object constructor
	*
	* @access	public
	* @param	array	List of options used to configure the connection
	* @since	1.5
	*/
	function __construct( $options )
	{
		$prefix		= array_key_exists('prefix', $options)	? $options['prefix']	: 'jos_';

		// Determine utf-8 support
		$this->_utf = $this->hasUTF();

		//Set charactersets (needed for MySQL 4.1.2+)
		if ($this->_utf){
			$this->setUTF();
		}

		$this->_table_prefix	= $prefix;
		$this->_ticker			= 0;
		$this->_errorNum		= 0;
		$this->_log				= array();
		$this->_quoted			= array();
		$this->_hasQuoted		= false;

		// Register faked "destructor" in PHP4 to close all connections we might have made
		if (version_compare(PHP_VERSION, '5') == -1) {
			register_shutdown_function(array(&$this, '__destruct'));
		}
	}

	/**
	 * Returns a reference to the global Database object, only creating it
	 * if it doesn't already exist.
	 *
	 * The 'driver' entry in the parameters array specifies the database driver
	 * to be used (defaults to 'mysql' if omitted). All other parameters are
	 * database driver dependent.
	 *
	 * @param array Parameters to be passed to the database driver
	 * @return JDatabase A database object
	 * @since 1.5
	*/
	function &getInstance( $options	= array() )
	{
		static $instances;

		if (!isset( $instances )) {
			$instances = array();
		}

		$signature = serialize( $options );

		if (empty($instances[$signature]))
		{
			$driver		= array_key_exists('driver', $options) 		? $options['driver']	: 'mysql';
			$select		= array_key_exists('select', $options)		? $options['select']	: true;
			$database	= array_key_exists('database', $options)	? $options['database']	: null;

			$driver = preg_replace('/[^A-Z0-9_\.-]/i', '', $driver);
			$path	= dirname(__FILE__).DS.'database'.DS.$driver.'.php';

			if (file_exists($path)) {
				require_once($path);
			} else {
				JError::setErrorHandling(E_ERROR, 'die'); //force error type to die
				$error = JError::raiseError( 500, JTEXT::_('Unable to load Database Driver:') .$driver);
				return $error;
			}

			$adapter	= 'JDatabase'.$driver;
			$instance	= new $adapter($options);

			if ( $error = $instance->getErrorMsg() )
			{
				JError::setErrorHandling(E_ERROR, 'ignore'); //force error type to die
				$error = JError::raiseError( 500, JTEXT::_('Unable to connect to the database:') .$error);
				return $error;
			}


			$instances[$signature] = & $instance;
		}

		return $instances[$signature];
	}

	/**
	 * Database object destructor
	 *
	 * @abstract
	 * @access private
	 * @return boolean
	 * @since 1.5
	 */
	function __destruct()
	{
		return true;
	}

	/**
	 * Get the database connectors
	 *
	 * @access public
	 * @return array An array of available session handlers
	 */
	function getConnectors()
	{
		jimport('joomla.filesystem.folder');
		$handlers = JFolder::files(dirname(__FILE__).DS.'database', '.php$');

		$names = array();
		foreach($handlers as $handler)
		{
			$name = substr($handler, 0, strrpos($handler, '.'));
			$class = 'JDatabase'.ucfirst($name);

			if(!class_exists($class)) {
				require_once(dirname(__FILE__).DS.'database'.DS.$name.'.php');
			}

			if(call_user_func_array( array( trim($class), 'test' ), null)) {
				$names[] = $name;
			}
		}

		return $names;
	}

	/**
	 * Test to see if the MySQLi connector is available
	 *
	 * @static
	 * @access public
	 * @return boolean  True on success, false otherwise.
	 */
	function test()
	{
		return false;
	}

	/**
	 * Determines if the connection to the server is active.
	 *
	 * @access      public
	 * @return      boolean
	 * @since       1.5
	 */
	function connected()
	{
		return false;
	}

	/**
	 * Determines UTF support
	 *
	 * @abstract
	 * @access public
	 * @return boolean
	 * @since 1.5
	 */
	function hasUTF() {
		return false;
	}

	/**
	 * Custom settings for UTF support
	 *
	 * @abstract
	 * @access public
	 * @since 1.5
	 */
	function setUTF() {
	}

	/**
	 * Adds a field or array of field names to the list that are to be quoted
	 *
	 * @access public
	 * @param mixed Field name or array of names
	 * @since 1.5
	 */
	function addQuoted( $quoted )
	{
		if (is_string( $quoted )) {
			$this->_quoted[] = $quoted;
		} else {
			$this->_quoted = array_merge( $this->_quoted, (array)$quoted );
		}
		$this->_hasQuoted = true;
	}

	/**
	 * Splits a string of queries into an array of individual queries
	 *
	 * @access public
	 * @param string The queries to split
	 * @return array queries
	 */
	function splitSql( $queries )
	{
		$start = 0;
		$open = false;
		$open_char = '';
		$end = strlen($queries);
		$query_split = array();
		for($i=0;$i<$end;$i++) {
			$current = substr($queries,$i,1);
			if(($current == '"' || $current == '\'')) {
				$n = 2;
				while(substr($queries,$i - $n + 1, 1) == '\\' && $n < $i) {
					$n ++;
				}
				if($n%2==0) {
					if ($open) {
						if($current == $open_char) {
							$open = false;
							$open_char = '';
						}
					} else {
						$open = true;
						$open_char = $current;
					}
				}
			}
			if(($current == ';' && !$open)|| $i == $end - 1) {
				$query_split[] = substr($queries, $start, ($i - $start + 1));
				$start = $i + 1;
			}
		}

		return $query_split;
	}



	/**
	 * Checks if field name needs to be quoted
	 *
	 * @access public
	 * @param string The field name
	 * @return bool
	 */
	function isQuoted( $fieldName )
	{
		if ($this->_hasQuoted) {
			return in_array( $fieldName, $this->_quoted );
		} else {
			return true;
		}
	}

	/**
	 * Sets the debug level on or off
	 *
	 * @access public
	 * @param int 0 = off, 1 = on
	 */
	function debug( $level ) {
		$this->_debug = intval( $level );
	}

	/**
	 * Get the database UTF-8 support
	 *
	 * @access public
	 * @return boolean
	 * @since 1.5
	 */
	function getUTFSupport() {
		return $this->_utf;
	}

	/**
	 * Get the error number
	 *
	 * @access public
	 * @return int The error number for the most recent query
	 */
	function getErrorNum() {
		return $this->_errorNum;
	}


	/**
	 * Get the error message
	 *
	 * @access public
	 * @return string The error message for the most recent query
	 */
	function getErrorMsg($escaped = false)
	{
		if($escaped) {
			return addslashes($this->_errorMsg);
		} else {
			return $this->_errorMsg;
		}
	}

	/**
	 * Get a database escaped string
	 *
	 * @param	string	The string to be escaped
	 * @param	boolean	Optional parameter to provide extra escaping
	 * @return	string
	 * @access	public
	 * @abstract
	 */
	function getEscaped( $text, $extra = false )
	{
		return;
	}

	/**
	 * Get a database error log
	 *
	 * @access public
	 * @return array
	 */
	function getLog( )
	{
		return $this->_log;
	}

	/**
	 * Get the total number of queries made
	 *
	 * @access public
	 * @return array
	 */
	function getTicker( )
	{
		return $this->_ticker;
	}

	/**
	 * Quote an identifier name (field, table, etc)
	 *
	 * @access	public
	 * @param	string	The name
	 * @return	string	The quoted name
	 */
	function nameQuote( $s )
	{
		// Only quote if the name is not using dot-notation
		if (strpos( $s, '.' ) === false)
		{
			$q = $this->_nameQuote;
			if (strlen( $q ) == 1) {
				return $q . $s . $q;
			} else {
				return $q{0} . $s . $q{1};
			}
		}
		else {
			return $s;
		}
	}
	/**
	 * Get the database table prefix
	 *
	 * @access public
	 * @return string The database prefix
	 */
	function getPrefix()
	{
		return $this->_table_prefix;
	}

	/**
	 * Get the database null date
	 *
	 * @access public
	 * @return string Quoted null/zero date string
	 */
	function getNullDate()
	{
		return $this->_nullDate;
	}

	/**
	 * Sets the SQL query string for later execution.
	 *
	 * This function replaces a string identifier <var>$prefix</var> with the
	 * string held is the <var>_table_prefix</var> class variable.
	 *
	 * @access public
	 * @param string The SQL query
	 * @param string The offset to start selection
	 * @param string The number of results to return
	 * @param string The common table prefix
	 */
	function setQuery( $sql, $offset = 0, $limit = 0, $prefix='#__' )
	{
		$this->_sql		= $this->replacePrefix( $sql, $prefix );
		$this->_limit	= (int) $limit;
		$this->_offset	= (int) $offset;
	}

	/**
	 * This function replaces a string identifier <var>$prefix</var> with the
	 * string held is the <var>_table_prefix</var> class variable.
	 *
	 * @access public
	 * @param string The SQL query
	 * @param string The common table prefix
	 */
	function replacePrefix( $sql, $prefix='#__' )
	{
		$sql = trim( $sql );

		$escaped = false;
		$quoteChar = '';

		$n = strlen( $sql );

		$startPos = 0;
		$literal = '';
		while ($startPos < $n) {
			$ip = strpos($sql, $prefix, $startPos);
			if ($ip === false) {
				break;
			}

			$j = strpos( $sql, "'", $startPos );
			$k = strpos( $sql, '"', $startPos );
			if (($k !== FALSE) && (($k < $j) || ($j === FALSE))) {
				$quoteChar	= '"';
				$j			= $k;
			} else {
				$quoteChar	= "'";
			}

			if ($j === false) {
				$j = $n;
			}

			$literal .= str_replace( $prefix, $this->_table_prefix,substr( $sql, $startPos, $j - $startPos ) );
			$startPos = $j;

			$j = $startPos + 1;

			if ($j >= $n) {
				break;
			}

			// quote comes first, find end of quote
			while (TRUE) {
				$k = strpos( $sql, $quoteChar, $j );
				$escaped = false;
				if ($k === false) {
					break;
				}
				$l = $k - 1;
				while ($l >= 0 && $sql{$l} == '\\') {
					$l--;
					$escaped = !$escaped;
				}
				if ($escaped) {
					$j	= $k+1;
					continu