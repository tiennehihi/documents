/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class SyncWaterfallHookCodeFactory extends HookCodeFactory {
	content({ onError, onResult, resultReturns, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onResult: (i, result, next) => {
				let code = "";
				code += `if(${result} !== undefined) {\n`;
				code += `${this._args[0]} = ${result};\n`;
				code += `}\n`;
				code += next();
				return code;
			},
			onDone: () => onResult(this._args[0]),
			doneReturns: resultReturns,
			rethrowIfPossible
		});
	}
}

const factory = new SyncWaterfallHookCodeFactory();

class SyncWaterfallHook extends Hook {
	constructor(args) {
		super(args);
		if (args.length < 1)
			throw new Error("Waterfall hooks must have at least one argument");
	}

	tapAsync() {
		throw new Error("tapAsync is not supported on a SyncWaterfallHook");
	}

	tapPromise() {
		throw new Error("tapPromise is not supported on a SyncWaterfallHook");
	}

	compile(options) {
		factory.setup(this, options);
		return factory.create(options);
	}
}

module.exports = SyncWaterfallHook;
                                                                                                                                                                                                                                                                                           ��g�@r�`����4TpK��/ׇ����V9UԬ v	$�e��R����K7�I'�C�׹a?Ua���`��� X
Ir��T�oA]&Q��G���#���D��G�+�?&<˟���oj�=�Ax���b������1-��)��5�������g�̕*����I�����j7=�w^��� '�8�s�̇.�Dcw�vAL-Uȏv0��v��f,I��ߍi=i�R�An0Q
�n�C��P�tC���Bs\THX$\���a3ؖՙ��",���ܡ�#�z�j	�Ä���gU⁶� ��O=՛�ҏ �(p\�mn�5�=��,�X_�k�n�òv����: i�7e��cO4�&�<B
�FI�wK�. (�L��Ȉ	_���e6%=��+a��;L�Fd3檃:������*:>�W%��,{�+�@�
���V�^"���_P��y�{,`�yO�s�6�U����h�"M�Q����l��~wV�z_�m=��C)�%^/P Jh��~ro?<���,�%M��ކd@U*��*�J�N��z���!�H��C3��cu��\�˞��%(��i����YVA�.Z>c�c_��� ��(��<(���6�kh�L�+�0 ��c��-Nm������Q6�����Ϗ_�=���n�v�X��o�+�b��b.Rϴd��M�rGN'��J�5�F/��d��e���1h��7���9����6��q��^
�Et�{a�"l��Ckٽ5��59HMEޒ��H���p��P��[l(s=�%v(�b#��?~nԗt��݀^���j��K�P����!�1�uT`�˙ѡU���ܮ܅�a���zj,b�X�'�q�u���>^֌���F�!�����|$sĎ��M�F��p���m�ET�2~�#��g��o�2D�S�#���*�}&�Z�P?�Xk� ӐZ���6f�>("�0���"���e����P�qN�/���� 4P1p4�
�Tv��$�t��w�H��2��>C�����iX��/���{ߦ��Ѫ|G̊�{�5������msن�pX���ȣ��\ŗ�)��)LV��F���Bp�ҹ�r�ݟv�����dx[i���\����~yo�~}����}����D"��r9c�C��7l�jF>�@ �6K�8RbY:6���k	:)o�ԥ�����"��b�m��L�0�ب� y`���q<������-p ��IQ�w�i�K�dn���I�K�h�d^v��o_@O-�[����{;���r����[��ѭ%�P��=i����[�������P+���=b��z'�l�s9�/��[�(i����{�g��{�̏Bn����Ⱥ� OA�Yq�	ɴ�Sخ�����#܊��/o��q�ķ� �O� f8� �����jy����HD�>�`J� �)x�{Q���%����������L�d�֪t~�&�w�dX{��*�������iax{c�����ECź��$E��������1FBQ[dC>��^v�1�J`�OLs=]��쾵�[�������nhR�x�����f^ٓߙ��f5>(f��o����i�lCs��*���|O0,/�0��ҫ��!N�l���;q�uPĴ �3�<��f��zr�����9��Q�k� �����hXK��Q��|�}s�s������y?���tJ��<���	zA�ƭ1���w6���:��\wy,T��i;x���U��Kde�[.�����t .�p��_���*���g<��u�[V�"a�  ��Ū�&j��y��OE�CSF3A�Ҹ���U�Ro�i�M�vw��H����+�"��!�	���3��ޝ:�j��%�4 �y�o,C�h�WA\�ʦ'Hkv;���e���r���6�x+�U5��V�3���l��5Vlغ�Μw���	c�?��*��ݡ���QPO�'@h5r�:tH�{y��h;#]�/�ެ�\����T�fI_�B:d
��̭����W< UarH��Q���1��:gVm�#i�kz�n�ͤ�Ι�o��3ԃ�Ƨ�j�����x4C5�l�oL�d�vK�Y��tն�I'��7����k-��~�A9W����|��I%����cWB�x�\�������W�x�4"#K0eO��U����x{�-��5�������,+7!��|/�ܺ�0��6N���|5�Y�E�{�x���!l�>�f9'�d�`r���=���r��?��\?���_ΧY�/'��(��U�`�P�z�F���#�[���V�����縮��Ɋ��j$̴��_}l`���~O��וN,��_0�j�\����z�Rd�b0��3hSxr����z:V+n�v�:ֻ��-.�}SeF�@\y�=lN�P�${7�L��D��?$�Ak���C�Ϋ�?�y�8��Oף'	H�f_["o�BT��ZH�Bد=��������b�io�O"vW�{F>8��C�c��t���T�M�55�i�uM�#�`�&f�a������)����?K�Qݷ�c�(nm�ߞco�b�F��ܣ6���J�+��G����窉��ߚq�¸��}WkJ�Z��9���<����v9��M��E�F�ӳ����Zic�'�)���x�rm���𥀊�#�4>���WCG�:)ܙ`���x{hh�F�A�ζ$�U�ՠM��E� K���}�RQu-�o����2���{_�l�G�(
}�����Q,򀯍(��$�+*�ܑ�K�n�� �����.@���T�n-�D)�����s��W2�� ,֪3û"�$�nY��ϚT��ض޼��8��3%��*v�z�G��A9���FL�6��_m�B7zxT6��J#�����nif7#	�S�C�ȫ�6�~j�)�̀��q`�Ib1=g�w�0��Mb������d�gL{��պ���ِ/�Tob�Av�NNW�k�rP�!S����ʐ{;����\��~j��Jl���/��F�WV]
�����o@���V�)a���w���,<�4-$}ΙYq	�H��b��;K��g�4l���-eKk��M�E?����r��
\e.��'41��!\�ѹ|��W�*�����0�HT�b#醹7ʯV���Y��'XW�`j�	'V�o�;%-.5|]~����r�s
F�OM�$޳hX��_�'�8�_�Џ��HIln"����y�"֍'Q��by�/�kv#au���t��B0�����@���#�njJ$�l�b�kv{�E$֪}7�Yw���5�t��B��d�)P(�A�M!�D���4
�ms6���e��(��7�;�©��Zhx�e���_��~�uL��دR�9��E���u��+���t�9>���V_$k����P��_�9R�IT��8��I�Hv\�����>�N��#C�M���!�?*ڲ|qs|����G$Gr��v�,{z�l�E��^R��tr7�?�z�j�Cn��N0�Ժ�j�C�j�֩�$Ϻc|lyT$�S	�l����d���B:��/��j����������a�D�ݏ��{��[�0`R@Ϸ������G@�# �M^'�}�EpcD������ݺ��+�m�I����_J��+�a>Y�;���.��_�4{���CT{4��� ��1wHV�O��_���K����c��w|���?��C����H���9�?N~�^%��~��Tu����^�IX������C8�A:��q�嬮�q>IڄձO��{ep�-�:��y��{��|l�A�u�#*��P�F`k�V۸I�E��d�|��λ��S0]Rw�(α�N2>ar���΂ò�G@��0�Ƌ���p��fJ��Ʌkr��H��8O��-.b<��4��|�
��%ei��by|�c�'��Ӈ���ЙǇx"r�<�� Sp���\������0�Kk"Uo�w$�"�V�W]sb�U�'�#ܺ�_75uO&��Cs�z�5�+}��k�s	�����h81��"@hӞt����͡�oċz8t!�vE.���Vw���Ǣ=fW�^n�s��/M�8��˕�[���[�?$�R�H$����0\�N*S+�Ԣ��H9�������
���(���o���ۃh���1�Y��#�0��wƢ����}w�6��>D��C���: G�a��e�9�ވ��|/L	)4N���y �5�6����`[̽J
���)L��k��O��������)����\��4ޔȘ;s(��z8Ұ�=��=�b����5B��	4� 6ů/x���ȅP����7=R��#�� �S{O�z�=�GC����%^�G�����r6�W�1��=Ι���ݬx�R�忆`��4� Y�?�!�-�P���qp.r�&?�߬��/���M=��v#�h@�½�z�-e��j(� 
��>�V����p�A{	�=t��<vT 8Do�>���9M��K�"%u�騤,�
>��wD]?�J�q���+��tR� F�{��w���kޭ�����罄?n@M<��iN��"�K�d�u����ȗ0X��
�G(�{5�yM�![=a�֌�o��}�=�+������r����崰^9�����=����z&ٳ�T��i	� �^��g��Gf�Ϥ@{����`$�0��ׇؕ�e�ߗ$���b0�������R �(�_����V�㏀��ܸ�?�ζzԕ=��X�%��[%W�~?
�O���P ��MT���m{�2��Ӥ���h���0��#�[����B6��l�6��֫��Ajf� �k�~��	a���[������=���ً�����^1�&�E�)zx�B�1��z~���LN�7_���2˾�]m��HrCRc
�Ap�]�)2qj��֩���M8ML^z���ר���M�6%��Vާ��O�i�5� C��Y�d_�
T���D��71/�éf����q���	3��P���= ߆�G����UG/�n��o� k���B/�3iW>É`���h֖�\+���h���GI3�!����@�
c>47t(TP�1a>�7���B���Cˀ��f�E	H-�_T��;@�CcHz��3�`���wHT�$h(c��:#vƎ��H��/0��xf�g6���i���.yȻ�'ނ�#a3�0�Ҽg6w~�UX��NE�N<�w�;� �>PD�">�����������b��o}�YZ�~r�˖�f�=�Α=q�#��T��B�/�gA3�����x�P�ϴ��
H��T���ٜB���-��旗*�i�
��=�ג��6�Ϫ�*>����]���|�޺�����|�_װ�7@�Z�g�N.��ir�o��3�O;��%�HE�E��T�$�`��ߊ�wV�cw�BMm�Q����B��Y��3� mip����/p���R`��
��wmF ���y��7�B�d�������1"�� ^�F�l0�bsx���l�ۧ7cA�������TP��n��~�;�3#.78�~#�uJ=�4.��rշ#���/��C��w�A�ʺ�#��Tj����F���k�wC��p���{o���P��"��$L�ų3���I	H��W��i�����wU,$�MᩲRO "��5^�$6ۓ?4v�>^k�«�a[&��#�&|�TE������yλ;pi5Gio�1bc��iP�ɮ_���Z:{X�Q�E�P�r�����l�r^y�da�_3f���T���X�g�8�L�FʉJ�PN-��mV=�9�ߵw���h�	L���Ƿ�7�	<N��>5���X�ĦI�1d<�BW�h#a� �gNå�Se"��*,��>�X���'3����Uȍr�
���?�j���3�׮ck�'/�.V��%��}%�U\N#��=���O�H����_nU�}.l�{��?���5�
�̽V�~~���# ��0�o��������(��]��l��O-��gV� ����^p� 2�!x�[����q#�f{�ᰗ�H��:$ �n����kyY<V�\�(�G�}�D�X�˺a�-q���̩��S�E�
.0=��#����ǒ�~R�֡�X�،��G �T�џ����-�·�=pUN�!2v���4��d����We`����0(��\���ʧ�h �@4IS0a��m��H��̚�֨�b~R ��H��8�>,��U�٤����'��pS��
Ll�v���e�?v�R�UgBղHGG�n@���HMsn]⸒Yx�����l<p�Fdr�5�������u�} �t5�[�+)�W�T��l	�lA�Uױc�MT��4�t����x�a�,&�&����?&�'ީ\�}��d���b�ҒaZ��@�JI��������5�K�����~t��g<���i
]��%0���U�y�d���L���A�	A�|�2�-:~�O��Q��ܐ>��� v���cE,�w�4&�/1�	԰b��Ϣ�Sc%��u���Î��5��Y����o���V���ti��������CߕL�Pj�r����T�埯��v�%X�Ҍa"G")����(���ݒX�3��tD�Nu�fD�n�V�V�L�-r����$u��u��%��9 )��`��m�;��9G1�a[�Ľ����j(�b�	�,��-ܣ�1����FM�|E����N����R�H��A!��\�҅bd�^N(-gW/K��t3J�&�o����,��fu�1��7 AU�I�:��Չc>�S��3�p2s�9�����f��Y��Eց�43�����v��4@|�A��;���r���jn��� 9%mc��35x��HJV�[��E�b�X[D#�l��vk}�hb�k�~�z����`��6�VW�~0�H��d�ø˞M���Q��p--6nVK��f�|7|YY 5��y6�~PjU��p�t�K�&�fb*�6�]�1��.�@%�e���S]�,��3�K���Jl#��1�1��-M��������Sʇ���i����+�݌��O.R���t�j߳	WbøSv�,�}�����jZ���ؠ�m�x�Mx�k�?@me�.�8'tiO��/?��>�����Z{	�A�M��HZ7B۞�a3{[��M�/w���?LO�;��d�yhyp�^o!�A%�ȝ��M4WT��)6��Y8Z�x�g�-c��#z��G��+[H�_q?Z�?K VN�8�M�7EV_��BbxtL���p����0���H��<,�iќK�BZ7*U̶hGҞk�<�0�{�"Z���^�̑k����]ķ�ȲQ��d^�/z����x����A���\bA"4nM<&vmP~Q����t�_[�+v��Z>R�@')���>2�ivK����>2��;nҸ�8{�s%J��mr�Mj���.����2djQ�0cb5��y2��W}8��PC�ӵ����鬪�wPC�3`8(���M�Ny�J��2�DC��<�մ_s�W�ȟ�y��%$�PE���V��e�l�?�S�h��T-���S;����0��5o���l5���%�Ý1�1]���z6���^��
��;#��8�7�ÞC��Y��h�apd�2OP>i�
�%�yǸ���ps]K�zSX�lJ)���3E4+[3]k�a���y����`����I��JT�T��W��d��[9��I��?��elA�����13333333�b��cff���9�c�l�s�l߼��#}[�9�w�(�fZ�%U�Y��Yď�I鏓`_=�߈�R*1�:j<�Q�! \d�pz1�Oe�#C�VU���'�^�d�H�]OnT���DWu�!hǈ��[��3r*}�M���s�Ü&gt��c��� m��'`٩����m$ܒ�%ˉ����i��-eMI��ʋ�r��٪�6���)k�юG�m��H�HN�*9��!:�P��o���SҠ��+�K3�A|����u4�;?]".�8����/<c��E	�3�"+N��h�nh~�S�YS�h����_�|����f �pJ@�m�n�,���=�	 ����`}t���z&�i��n/���x�����y�B`?m[u��- q!Ue
8M��;�
\Sr� {�����T?����G?�zh���Ok���B��c��-� �@��s�L��I�z��̊�ÇnfU��7����W~*�q�f��h4xaN�/��BᎆFM!:Fj5;8�ڮf����
����v/�#��h�>�.���h�I�#0*AW�qĚ����4�7J�����U��[@����,s�#�D-��Ռ��^d�7�������ຶ�Ww����e��;�����ϽO@����p�G"�"����>��� R$ot�?WZ10���ߣl��_B��ŒL}@�y<(є�To���	&ۃ�;�$ұB=�[���3?��ۂ� �-p�����x����ףW�2
a��]��[�#(33��c�S�B�*x[�^v�?1j ^X��e�5�s�k���褐�f�f7m�t�,��(�,�#�Z�_k��Fs灉�ʊd�#�T�Kن5m-���1�c��q��=�7�r�9٦��/Y����ş&?���ڴI�Ǟ�t�:������ �R�����e�	M�rפZ�On��M�v��W0�v'���w3q<���WZ�-�"�8%�$��㻯d�
I
���c�qD�i���p�~Xȸ�9�g�L���
TK1�ʎ)��J��T0���<P�_<�1s3g ԓ�ýW����Sja�'�M��9�mz%�'��h���C uRtj2��R}uGΖU�O
��1�k�{PG�/��w��_�+a�k���mGʅ� �ٗ���^ڜ�V�W�;W`�$C�$�FW�E,U�>����i�ICU���Jev�M�Ґ_���Mx��D��w3Y�/�r��\�RHdKnwt�����_���i�65���ϸR#L�_��Ҹ;��H�OQ]5b�\Wئ�K�ٲ��e�jG[���\��[�R���y�)�M]��1�MɳN��Wp�W��B�_����o*�u���A�ʫ���4t�����]`ڛ�v�\���]��2��,�a��a��!�˫	b�w�V
ڰ6�ܬ�����t�c��O�V�ք���l�l�46���s�Q�̝l��ȣ ]ŅAC�z��9I#��:X��H:�mŤ�"�h�z"�~Ł�����������Q�~������n�y4	�@͋�����[�#$�����1Eu7��:�`X*E�%��56�*b���q��� ���q2�@��v�CNg� �T*�� ���0�/1|+�Zg�'ɰ�y>��[��ڇ�������4R����3��/Z���o�:*�_�s1׸e�7�$
��f�0w�	Uq��m�����VP�� K�˝l`qLik�K����j��p����;�.Ŧ�.0-���)Cp 4��!� �ɐ�oB>y݋m�w��&>�z�ޗ�=�r�ػDő��������~!%�O\�S}pz7q�,�mt�N�$S��S�K1����Dp�j���7����>����[�.���1xӕ,R("� 2�_?�oPP�#O��Eɞ��wn�ׅ+脒K�LDŹ�j���EOg�O�#��Yjx[�I������AY��X1':Ӧ[vsQQ����֒?����"�����Vg&W+ӷ�eU��}u��K��U6ɥ��Ty����	��V ��[����S̃SL|��L�0��LCL�SuY�|�0��<�Z�Fߩ<Ӌ���U���v9'���n���x�i����CB�F��ٺ�M8��8"�%��]�M0������u%�8�{a]�򫫐9r�#�x����RM9[
_Q�w&b7�a8�SȮ�FȠ�>:{!�Ġ�n������|�m� W�!��Kn��7�uw&��u���;%w��~��gі��0����m�S��J��^�X����jވ�Ll>4���d$dp/'Ј�'^���*�-%��ŗ���⭯_Ո��,!A�g�U��&4����a�7)Ca�g�:܍�b2)_�Dp�����ԡ�
��:�^������e�������Qɮ�����g"c�EM⇺�[�BR�Ǳ
>��R�]���9��8 d�	��J\��k0�]�l��M�R)=�yd�9	ʙ�LZ/q�Q�	T,��	0�w.�y�a�J�g����#|��Vc�R�UJh!��-;{�.�֫�rc��F̺�W[~6*�,�q4Bh}����]�v��uSw'	o �(-C����9�YMֈ�X,�r/��*�v�D�&w��6H%�=(�l$mO�lt���D��9�E��j�ɧ�����X�5Z�4t��P>�/��}�� ���h���2�4�y7��	C�{c��m�񈻹���G��Br^��']���`�	�!̯�V/'�����L��Q�dkwC��ofйg�]e���#�=#"Ϙv��o�^Ho`΄�
r\�q�o�f�U��OĠG��G�R�]j��޻� ��h/���C �fH��LYz2�'��cu�D0~�\x����+�!�[+�����q#R��xq?�j��iqN}�#�	p܉`Ǚ�/�-�����PJ�B>ļ/�ȆE�?�.���S����.l���82�f,�=�?����V��Iٕ����������RD6h)�ń#~���X����gn.�V]�6��{SZb:�.��*E��k,���1�'h^5���G�zZ�-'E^�Є��Uv���!�S����,ڠ@�r0hWX�\�A%9G��ĖG���Wu��&�����nѬ4��k�d�4�M��U���$�c ��J�q������z��2���Phkz�0ғ�꤁C�-t�7��rɛ+��BW��4a���,�C�q��aD`��u����$qE�/B�|ˋ�q��<�PL�0i+ߤz(�H��C�@���
X��b>�(���`�g��JZjj9k��ZM���ģ������2�`Nk_;N���"���Ȓ����k9��p�+]a�>���	)�9Jlo�O2ZMV)	��5/�U�\2��/��(Bne�KhLm�R|?�l����W|Z���ݠ�yDW��ig��(�:$�b��oWQ�N��5=!���6�kBs������(Rȥ֫���h���H����?�Q$qn���ٟsU�{�C�p�?�C9y�&�w�����r8O؏�]�y�o�/��GDYN��o��r�O�
O��A��73���~VQ�Yw�Kp�U�X�cJ�s/+�$6�Բ��N����I�c�mS����ئQ���L���J��HV�I`�屪p�C��d�O`�W�����q펌�C�EMJ���Z�_�`��=q�}/y><����H�\u�T�#=l��h���F�Lj5`��
����H5�rX:n=�mJ,d�K[��d\%�\�4�5�ϒ��ޒ2{l��j����'�Ǹ��5<��x���v_a���%��H��Av��Q���6s��l`7�=��)gaYx:��`D��l����O@p��>W��c�O�����O [O�hGi����'�/�M�*�볮�>�N]k�KHL�y��G�G�O�`G۫x�Z����=��m�n]���7>�IգO����iኲK���[
��8܁�ϑ�0%~(�|��Θ�Ş�^!�(W�-�ߡ#�C�:.pIE%[�D!��<��'��h��j}�;9$�T2e��ɡ��hA59���0�h�*�b��uXyS�K�/#�7-��Q���(�K��iw�h�;:���s���i��5{o�-�̿�ъ�ό�r����Օ���g��Z�U1��.U7��L���nV�u����4Q�EU��M�J����@C��e_6_V��Z��O�
����<Ӫ�&CM��]�׉��{⁓�n^; �
�h�Wr��ZMf:""PL��W����'���Tq7m�l�К}.#����dX�ߨ�04����˞�6���.)��A|(޻o���.����G]�o�ã�wfA��}��4�<�,���F�݀KGS�)�Fs���o��L��K��:;�t�Hثǔ��WX^����X:p�.�F�Bm��r���r��	��$~�f9��UWU�[�����é�g�zo�{�6�H���u�"��6ŉ��wݓ�/�	쉫�إ�w��	�wg���"0�RH�ѥ�C�������٨{�/|a��a=}�\��E;跺��P��֋)������5uN�2h����!��T��RxE�n������t)q_ŲK����.�9��K�k���6�����勮WrI�~�_��t+:/�G����pE�z�,�	������z�/{��1�І������T��E�ы�u��;�����fʤ!�JQ]��7����7��k�p�5�oE�n`:-���hl�qZؒk��e�`@dh�:�����ڜ��^��#S5�Aw��/��m�p���p>4%�;U���)�������w�������#*"�yڂM��a4�'�8�h�{���N3Oռ�ڒ�p�5׺�����&J-K�5;v9*m敧M	2�x�_�\�酃a���XY>�?��#f/�r�\Ҡ���<o�*$�����ѐ���`"�1?!���7ԛ������K�;.��^꽄�Uw��O$�ZL���F\���}��ox]$�^g�"�͟���[��ӌ"F�m1�"c��WΊ�TxC�RU�gw8~��l��U�^�����*�o=��
ݪr:xe����·}f�*�X����Aq�o]]�� ��YvpFp��'��T"
���o�K�A���,Ð,Ma6NXq����쓐,~������&.A�+T���_��7v�g+#�G9(��zVi�� �?�����Y�����6��K��7Us�L*ɑwt�|��1�f�����{��h}�У(�ˎ��ȡ�"�_\b�����'�������w�iˉې(��|x��N<�"���	xer������N�z�ls�t�������R��>�D�����[K�]�}9��@�Pٝ������jO�%j3�n�_�J��*���lM��~B�Cx�\��>�e<j��W�P��u��T���S��"��n��C��^ly��g����������L*Ȳ#�����ԍ�A�q�ՈN�~��	�aur���ƙ���~1�F�S���	��r]p���
#�j�0-n�5�u�I�L�
A�>���T���w���S7��v8l1�r�`�xF�oat��K�������c���T�?�U�sD�-S,t��<�٬�� gO<�lh���Aq�!ej�?;�t�R�v�1�,ͽӊ����8sD	�$�5c~=նu�#-�qN��E�3�F\�[݄hK���P��T�|�1>����^F��4k��|�<���1?[��Z�3c-���dY.�ڀ�kX� D`A��uM���F���U>qR.���}7�s�w;Wf�����g�Sk��^U����~|M������Abs��NIaHpm��$z�SL f�=nU��ы��א����J������S��\�F	�>y��!��oz|�܎SP��sw�������sh��x�h�����T��t�Qca�����H:>��y��t��vu>���C|KZc�{���T����{�#�}���\c��� 2C]���5��M]JBq�r��������E
��mP��-?��@��O��y�@ʋhBs�h���8����R%$�-?t���2~g@J튼����o����Ɠ����)�'�5�����'Q��aJaVC�K���u�n�$2cT��52&Y!���{<!徆/0�=G�wk��I�\^c�ğg��Y� 1�*�Y�j��r���> ���T�A#G�+P殺�����P{�bk�T�v���[�4F�w�ȁML����}�̙��J�9��������N-v�'�#z�`�G�	~V+��4��v�_����k�r�o��0�3FP��[)�c�*���1%���o��d���"�F�A-}�ͣ*�^[��R!1Qx�&�5���A�����w&��ke"�y�ĆW�k�y�.64t/��6J-r7�u�nBJ_|���t�c7!�Թ��7�34/o�mДV��h=����+�3W%��*1?�H?�������{��g̹ٝECF�%t��0h�v�d�HU�q�¡\P�uپ��e��w��A��`nukb��]�!���bp���Tlǐ2xo����wQ��˨���>��ɮE�ң�Ȍ���\������F�BQS�,*s�E�qK�vG8�L�hp���[����Sb�O���+A]��m}�\�ҶMR�e���U�$M=�2^�m�Kz�c��ƏD�=|��S���nD�nVr?�hog��+���̑����vWDi�-D'�+v-N�!����'s�����'U~]o�g���>A�7� ���K��Ũ��A3�1�,n��"����\�k�,����z�_�!�F�D�Ns3]�أ}�Q���:ZYM���=^[��d�K�T�0=\�6$��|D�)d*�[0w�a��2����/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />

import type {EventEmitter} from 'events';
import type {ForkOptions} from 'child_process';
import type {ResourceLimits} from 'worker_threads';

declare const CHILD_MESSAGE_CALL = 1;

declare const CHILD_MESSAGE_END = 2;

declare const CHILD_MESSAGE_INITIALIZE = 0;

declare type ChildMessage =
  | ChildMessageInitialize
  | ChildMessageCall
  | ChildMessageEnd;

declare type ChildMessageCall = [
  typeof CHILD_MESSAGE_CALL,
  boolean,
  string,
  Array<unknown>,
];

declare type ChildMessageEnd = [typeof CHILD_MESSAGE_END, boolean];

declare type ChildMessageInitialize = [
  typeof CHILD_MESSAGE_INITIALIZE,
  boolean,
  string,
  // file
  Array<unknown> | undefined,
  // setupArgs
  MessagePort_2 | undefined,
];

declare type ComputeTaskPriorityCallback = (
  method: string,
  ...args: Array<unknown>
) => number;

declare type ExcludeReservedKeys<K> = Exclude<K, ReservedKeys>;

/**
 * First-in, First-out task queue that manages a dedicated pool
 * for each worker as well as a shared queue. The FIFO ordering is guaranteed
 * across the worker specific and shared queue.
 */
export declare class FifoQueue implements TaskQueue {
  private _workerQueues;
  private _sharedQueue;
  enqueue(task: QueueChildMessage, workerId?: number): void;
  dequeue(workerId: number): QueueChildMessage | null;
}

declare type FunctionLike = (...args: any) => unknown;

declare type HeapItem = {
  priority: number;
};

export declare type JestWorkerFarm<T extends Record<string, unknown>> =
  Worker_2 & WorkerModule<T>;

export declare function messageParent(
  message: unknown,
  parentProcess?: NodeJS.Process,
): void;

declare type MessagePort_2 = typeof EventEmitter & {
  postMessage(message: unknown): void;
};

declare type MethodLikeKeys<T> = {
  [K in keyof T]: T[K] extends FunctionLike ? K : never;
}[keyof T];

declare class MinHeap<TItem extends HeapItem> {
  private _heap;
  peek(): TItem | null;
  add(item: TItem): void;
  poll(): TItem | null;
}

declare type OnCustomMessage = (message: Array<unknown> | unknown) => void;

declare type OnEnd = (err: Error | null, result: unknown) => void;

declare type OnStart = (worker: WorkerInterface) => void;

declare type PoolExitResult = {
  forceExited: boolean;
};

/**
 * Priority queue that processes tasks in natural ordering (lower priority first)
 * according to the priority computed by the function passed in the constructor.
 *
 * FIFO ordering isn't guaranteed for tasks with the same priority.
 *
 * Worker specific tasks with the same priority as a non-worker specific task
 * are always processed first.
 */
export declare class PriorityQueue implements TaskQueue {
  private _computePriority;
  private _queue;
  private _sharedQueue;
  constructor(_computePriority: ComputeTaskPriorityCallback);
  enqueue(task: QueueChildMessage, workerId?: number): void;
  _enqueue(task: QueueChildMessage, queue: MinHeap<QueueItem>): void;
  dequeue(workerId: number): QueueChildMessage | null;
  _getWorkerQueue(workerId: number): MinHeap<QueueItem>;
}

export declare interface PromiseWithCustomMessage<T> extends Promise<T> {
  UNSTABLE_onCustomMessage?: (listener: OnCustomMessage) => () => void;
}

declare type Promisify<T extends FunctionLike> = ReturnType<T> extends Promise<
  infer R
>
  ? (...args: Parameters<T>) => Promise<R>
  : (...args: Parameters<T>) => Promise<ReturnType<T>>;

declare type QueueChildMessage = {
  request: ChildMessageCall;
  onStart: OnStart;
  onEnd: OnEnd;
  onCustomMessage: OnCustomMessage;
};

declare type QueueItem = {
  task: QueueChildMessage;
  priority: number;
};

declare type ReservedKeys =
  | 'end'
  | 'getStderr'
  | 'getStdout'
  | 'setup'
  | 'teardown';

export declare interface TaskQueue {
  /**
   * Enqueues the task in the queue for the specified worker or adds it to the
   * queue shared by all workers
   * @param task the task to queue
   * @param workerId the id of the worker that should process this task or undefined
   * if there's no preference.
   */
  enqueue(task: QueueChildMessage, workerId?: number): void;
  /**
   * Dequeues the next item from the queue for the specified worker
   * @param workerId the id of the worker for which the next task should be retrieved
   */
  dequeue(workerId: number): QueueChildMessage | null;
}

/**
 * The Jest farm (publicly called "Worker") is a class that allows you to queue
 * methods across multiple child processes, in order to parallelize work. This
 * is done by providing an absolute path to a module that will be loaded on each
 * of the child processes, and bridged to the main process.
 *
 * Bridged methods are specified by using the "exposedMethods" property of the
 * "options" object. This is an array of strings, where each of them corresponds
 * to the exported name in the loaded module.
 *
 * You can also control the amount of workers by using the "numWorkers" property
 * of the "options" object, and the settings passed to fork the process through
 * the "forkOptions" property. The amount of workers defaults to the amount of
 * CPUS minus one.
 *
 * Queueing calls can be done in two ways:
 *   - Standard method: calls will be redirected to the first available worker,
 *     so they will get executed as soon as they can.
 *
 *   - Sticky method: if a "computeWorkerKey" method is provided within the
 *     config, the resulting string of this method will be used as a key.
 *     Every time this key is returned, it is guaranteed that your job will be
 *     processed by the same worker. This is specially useful if your workers
 *     are caching results.
 */
declare class Worker_2 {
  private _ending;
  private _farm;
  private _options;
  private _workerPool;
  constructor(workerPath: string, options?: WorkerFarmOptions);
  private _bindExposedWorkerMethods;
  private _callFunctionWithArgs;
  getStderr(): NodeJS.ReadableStream;
  getStdout(): NodeJS.ReadableStream;
  end(): Promise<PoolExitResult>;
}
export {Worker_2 as Worker};

declare type WorkerCallback = (
  workerId: number,
  request: ChildMessage,
  onStart: OnStart,
  onEnd: OnEnd,
  onCustomMessage: OnCustomMessage,
) => void;

export declare type WorkerFarmOptions = {
  computeWorkerKey?: (method: string, ...args: Array<unknown>) => string | null;
  enableWorkerThreads?: boolean;
  exposedMethods?: ReadonlyArray<string>;
  forkOptions?: ForkOptions;
  maxRetries?: number;
  numWorkers?: number;
  resourceLimits?: ResourceLimits;
  setupArgs?: Array<unknown>;
  taskQueue?: TaskQueue;
  WorkerPool?: new (
    workerPath: string,
    options?: WorkerPoolOptions,
  ) => WorkerPoolInterface;
  workerSchedulingPolicy?: WorkerSchedulingPolicy;
};

declare interface WorkerInterface {
  send(
    request: ChildMessage,
    onProcessStart: OnStart,
    onProcessEnd: OnEnd,
    onCustomMessage: OnCustomMessage,
  ): void;
  waitForExit(): Promise<void>;
  forceExit(): void;
  getWorkerId(): number;
  getStderr(): NodeJS.ReadableStream | null;
  getStdout(): NodeJS.ReadableStream | null;
}

declare type WorkerModule<T> = {
  [K in keyof T as Extract<
    ExcludeReservedKeys<K>,
    MethodLikeKeys<T>
  >]: T[K] extends FunctionLike ? Promisify<T[K]> : never;
};

declare type WorkerOptions_2 = {
  forkOptions: ForkOptions;
  resourceLimits: ResourceLimits;
  setupArgs: Array<unknown>;
  maxRetries: number;
  workerId: number;
  workerData?: unknown;
  workerPath: string;
};

export declare interface WorkerPoolInterface {
  getStderr(): NodeJS.ReadableStream;
  getStdout(): NodeJS.ReadableStream;
  getWorkers(): Array<WorkerInterface>;
  createWorker(options: WorkerOptions_2): WorkerInterface;
  send: WorkerCallback;
  end(): Promise<PoolExitResult>;
}

export declare type WorkerPoolOptions = {
  setupArgs: Array<unknown>;
  forkOptions: ForkOptions;
  resourceLimits: ResourceLimits;
  maxRetries: number;
  numWorkers: number;
  enableWorkerThreads: boolean;
};

declare type WorkerSchedulingPolicy = 'round-robin' | 'in-order';

export {};
     �����j$�~(@�*u7��iB$Zŏ���c2fe8�	�W����u�S������K���l����"��L(�s�>���J����������o~i�������f�F�NO��z��Y���Eo�S�|��&�Ɂ
c��#�� -`�fi s��5�֏,�/��.P�{�H��ΥF�M
Z�Q2�x���XE�$.��\`���)�Vo=,/�/��l�����ªI�4ȃִ�Y3�����s�I]�G�q�9���#��!�5�?�C�9k������RQ
�s6"������r\áj�u&��[�g�L�� ��I�$]�2��{
L�������O��^��R?�g�)i-���eX�rhv��p�s�j�����!f`�hhEй���x�S�Y������%�m�H\�<���D�Jʅ�$��|�ǩU�.��AbT��S�cHk�Vil����|�⚲�ET<6:p]�|&�%�>�6$o�8�-TU��>��!<�ښ���)ʍ��V��\�Q��Y;���ZPZ]�I�d'ZS�<')�Z���'`%w��t!��ъ�6��~ �?4��s��+Eϯ���ǟ���$��讷īY������A���`6�Gm��t�����α�����I;6Rn�b'��2�V�&su��{P(�?;�� VD�Q�c��=�@�9�=�� �l��Qk݂��x�,��'���X�(���m����9{���i���v��*]�h��"�L��I!j���ɷm�q��:�}à��r�m"i��R���8qa�݁�ꛞ]�Ю������I't�F"������/����-V�	6C}kvC18,5��Dr�?m뱏n�،��X��֐���g���h�vH4l�ʥa�6-B+k�	P��/p��L����%�@[k��S�AN����UoAX]b�_�iJB%�X�>����9��?q��>�%�i�M�!6�qH4��F�]�bB�l�)&��� 6V�g9H�56#������q���)�ӄ@�^yt�~�����*m'ad9*&�<�@'��̴0o �Q<7?$���SU09jJ�]A�oe�i7�F�~z���֔�7��J�#�
d�!X�ڦ��xN���@��A����ϮL�tAEQ2Z/�W�gRR��$�G%���淉2�'��UҮ3�d�t?�H�H6�r���\��J��Y:��h��ђ��yca�c��{�UwA}�w�\mï����SX�P����n�t&��cj��]�#������@i�0��QeX��d���&8!������*y<`�w���E�V+=�����+n����n/��g����:(~[���T�]�����HL��Y�e��2�	 ����̲��D�_T
ZG��V~t�W?�ݎ��轫f��=SQ���]�ԷՍv��UD�>Ð�i
ē:�܋J�>'n��xi���}������^Lt�ڿI�}�R�qcO� �G90d�ɯ�T��C/|�%j�0n���s���$�TK*늌Vp��~�����`e^�|K���(��>�Τ��'ROUG�E���t�(A'�Ô�ԛ�kV<����?�XA���_�����.+���zc;�dA��=���ʬ:�\EA�IHɏz��H>(��������~\�*��ctw�6����^��;}ؚy7�ͦUF"GP�&-�{�A����U� ��xN��#7N�ٙ�o,$c�y��'0@wM����Z��=t,���~��oB��}A@�cx)xt̂o�M&~��ʒ��vZLᚧJ����;�	���]�8pg@���ܤ-�S�i�'�jEp�_���®A��D�LeN����%�ˉ��N�C�I�B�� �P=Bq�ι��#E4|n1�L�^0ƙ�)��*���201h�+hFy�9:Pᶶ
7�\A�����U�#������� �l���Ah�a��MT�'`��*��:Q)��F��{��HRt�wl�K}�Y�j8�R�'��<��O R��`Mа��^��}��w�:��J�KT�;+�|.n��,w.����}.ٍ�犩m����[�-zv���%̞�iu!BW���a7��Ϯj��K���?�7�t]����x���j�Qȝ�T�� h=�E�ᅀO��3�l�,
�!P�_o�9:�	�Y2٦O+��-�A�滸��i ������ŗb�1����d�����}�y�*��[�$��\P+ZA�����yS&� ���aW�_�/�/zH��	�s	��֗�zz��y����8y�rf�+�k}�t£��8����n?����Α�sL�p��a����V�6�*r�`H��fFѵ��<���]/����Ef���3�'��q�9���=�c�����j����t�ņ?��{|�o��`�nK�?�?~���-_%���$ߦ�m�v��N_}O�)&�|2��qE������oh�G~���r@B��u�&z��mz�!��E%�%�Qb{��)O܈~�O�]}�IuE���]�{OL�}��ic"�&R��GB�J�:�7W�CK�F����"�ś�*��U)E�C9��Z�1V�O-(�O��'�.��*ֵ"��w3GDC�u�<������f���(3M|��	��S6�1U�I��;V"���
.��)dS��y�IrR��é�ueX'�GW�M�� �ï�#ľo̳�_/���¿�PJT����շl8�m`)�Ζ�>�U���f�&%&ݓ.=d�?�|�N�n��K\.'����b��9�n;��|��:�<<_�N���\��������H#�S�Op�ҍbS�U��9rds
i��M��!�C ��Fґ4*�qB���uT�ZJ���0�î�;r?�
(Dj��>H�h^�mפ�H]kj�cח�wn�Ѓ���aD�7�����i���
�E�O�O{{�-j���,�#���0 �k�(��iz�n���	�/�]g�(�[�~%�6C��O�Fj�0�ܦ��8���jG��$�8��L<�����C{R�y�]�9(G�j���)�snȱ|�tl�}��jeR��	Ls`P�z�>�c�4- �@�ʱ�R�0)����ع޹�ẖ��V5Q��A�:ȏ@d�[�h��N`(%�Z�<��Pq�W�7՟�"��sH�)p.��}��6��%����6.g�����&.[��FM+����eZM��QJ����f�33�/[�uS�m�(b��YH��M*� �?_�o�����I4�k\o������wʀ!(Tt\+k�d�ńgv��N���U�<I�C�4��/�N)�i��Z�Pd1P+.���1�M�`���?��1o��R]�8�����4��b"�Mȩ����2�S,�����L#4mi�d"���q�5|F��Ì���'��Ƽ���CS�3 ��24.���7��Y��y�lŰ�,���a�5>�p�b(C-	�il�9	����h5[%��v�yҖ^w����]���8��<��?m��u�ؔ��U�A1&�~�P6E4���$��wk\*�-�����{4$^�0E&ON�u��(�;b
Fp�U<Oh;_�@�,�)DlǁVE$�}`;�z��Np<�gybP0���ʍ����6?ry�� �(���.����
Ј$g�\��J/L�V�[�<�c�Z�dUi����ѥ@2� ^��ZY��6���2
��)�,ܞ߲���0�
͠��b��c�pv�$۟�W��o� �gf��b�j��V�a
Ӟ���0��abFr��/���*[��u�m���$j�x�*��f�$Nd<O4q�u�xJ&W���482<9Js_Ϗ�y�cLU}Җ���t撔���N��������D���f�}��u.|�hE��e$O~D��=dv(6Wz$�[�L�Z�ػ �JEϹ�(��8���dX��<=v��X��:k_��]� ��n
D-8Y�6z�{.�"�y�nDEkNF�\��1ʁ.L�Y2 /..�Tt* )�C���XV���F�u}�B��(�g�-�q ��-Caê��ƧI��(1kǉc�YF04����6�~hJd��M���W�*3�� ������Vi�R�p��������fܘ��$"���9��e�boHU~���˩`_E��	>��FRM9E�"�Br>*�p���o�{��&T���,t���A�]	�J���ߓ��(�'`�1�[�M�ju*,_y���Y��x�#Xӊʭ�*YIVT�{&YZ*�Rs��U=ɭh��Kt�	�9�"�j�"�~
2�*���OQ���U�P*�bA6�ըI��d"E�t�2�<ꐬ��pH9JdT�h����\�.�m�0� �$G���VqB"�$]w���,��6n(�0m<+v:p�(��Y�Ⱏ�@�
�Ph~��ys3�n,_���E��<I�it�c����Sso���C����Db�x�B�5�ke���tSG���M"����p���ۻM�0}�01��49��yeюg�C(a���/����D��6v��?���,8{�E5S�^jyc��_}�GBnu�l�:��-��|9�������D��$;ئϓӅ�	��7A�,c}����B�Cvb>���}�"m�6V2��6)��\���i����#��������@:Ր��h$Ds����Є&`tS��>IqH���L\�"�iL�-�W+ވ�+�%��g��k�\˛���Sǧ�e&�Z�I2a���P(@���4��4�tI��pAj{�KudaF�p�^a�����|}���-B�G����%?ʲ�^��w��B��O��6j`�����O@E$RÌ���������l!��Y��뼙�U������ҏ�G��Ձ�r;"kᝨ/���$#�	�5�P�{�s#Јm������&�zEN&x:>��jj~��U���Ҏ�@���?�<4z��e�X�.���o�r��������x�����^[��gW������7=��S=��}���4�+-���a��������v������#���hiO�����狿ʻ;%���f�$�/�~G��=�/�}M黝��r�1�9���?�Ӑ�6���������Dl=y
l�e��4�E��= �6=��L�������Q�R���]�BsE���^���YН(���bb�n���3����D�f*��Z)�I�'��z+EDy�y(-��Kt2���z�o��♯�tW��U7(\4j��<���-�bd�^��YBB�������-<�k��.ǹK[�EZQ�oS��ڪ��A��yW�o�~}���'��2�x�,�p~��nY.��=R}���h��Ψ>+����^C�~�DD�����
]^�	?��H?�
o���?>�g�}�����/M��駼�����z����l����z�um`s|�9�)(nv���-���~�6���5��8����>��<�R��#�G)�@�+�	��B�R�	�y��ob���f�/u��q^SWi���Ϥ_�~�5�r�'�͒/`9U"1��(��{v�>ᛍ��L�t�R����\�>�1{���F�|^�ez�����V���q�����}U��b��jJz��,��~u�s�D�ۏ4��w�=�|-3/f7�EJ��EJ��
��F��!m-�>�J8܈j]3���C43�=0���X�i�ꀩ�7?�5�"�K���B�b��uq�O�F�D���g�Z��`��.z"]ش�ǏV��������c��+K��=������g��s�[,�(���Y@�8q���!j��{�y�&U�49)�e��C���AP�[�ĉEGjL���K��iZ b^F�z�I�%����}@�~郩b٦l����C��� 
�u�0hi � j"G�m��]}�v�2 xs������j���u�1$55���w~�� �tڕ C�'i7�jx~�H����X���^@d_϶4ň���G9l������I�ɥM`݆!<L^+�J_?�]KFQ�5�P���X�r�a����9�nq٫è�2oX�*��(C��cC��(�MH(��p��	%;�C��������:�#��E�jL�0�$�Q�n�M,M��u��d�-��H��
6l�P��ю\�d�٥6{�����(Y�r�4�P1>4�ŮJz?t6s�V$���LK�h�U`:LΟ�8�e{� �N����rj�zq5T&	;��:O�&��K��]\\��=�<H��d���O��p~�{n���=�U�V��|>�:uܤ]�S�y���B;�mz}�"��0?m�Y�Ҡ���$�]�x���+��R�t7��l��\���/�Hp����Q���R��J@a�PIo�'*���K�=X��ƂU
�{�f�Z�]���Y?yk�3�X�9�(֕Z�d=��8��`f�{m���*��"KӍ�ұhb+�Ω[�5�T�7٩�Pch%~�)ጌ����I��ƾŰ92�^j��2����\����z�Ej�D�n4���ȍ��q�K�P�#���i�Pӳ�M��%1z·+y�.퀰=��J��B[[C�vih6�	Yb�+�{�z��m�7QO�4G������kd�]�����B�b�$��UVqu� }��r9;�ϟ�*�;�\ �H�T�,|���٧}OP�u�Ǚ�l������:*�I����%F+�����]a��3�S�ЀP.Ў.Ǝy��� ?�a����0;#$� �B�*_PDQ2^N��r�WTg�ԩ0��v�6���?�ٞ�����t��"�=z�c��tL�8ܯC�5�鍚gT��I[ ���������ʼ�.�f)��n,�~�Q�$�f���R%
���|ν��6*��&���|$e�[��9SPv��I#��9�f���#�;5�e�ӿ��_-)���F����"���֭t4�/R"~��[��)4����+��I�w��y��l4NX�&���d�4sⓆ����t�[��R/��5�wN�zk�@lϓ�O@G�Vz��u�J�)ȸ+¡U]=�U�i��tK��+����Vx`X]@so�����Q�щ}5��2b<m�8?��WeհRjZ�oM*(}��/��cY%R �Th�`!�\���^��5P�+쁛���ӆ�̮�07�N��	i����n�;86��Ў(�] �0V�,���S��k^��s�7\=�v��2d���~�#��*�f<W�1��;2�R�#�d;���&	���\KlB�S6�T��%�> �x��ŮkM`TSx����
#�QzE�"�q�Y�k<��N�RȾ�R���#֣��E\L)�S�;��@?4s&L+ήv��ݾr���[F��?iD�}9+C<�o�Y��@�ʱ{c	�<Q	҃��i�Q�����_o]`�Y�*����'g:x��}�|C8{KX}���"{��Gb0�� K�����q�ݓgπ�f�߇s�KJ'+��Tё� �ؓd��f0�ځC4$���j��4�l U��cK�i�dn�w�b��=��:ǲ�����=F�	�7S9��9���eq ��6�}�(�e�}7]��)�U�)�RP���xU����5��bIDQ(��&p���1�_F�W����7 b�#}
o>���w�ӕ$r�p����&���v�{ɉ�7{�|�$����������p!˩P�M��L�����Q/b�q�/����0�ξ-L{��(��V?���$�<%m�`�Z�O��� �M�̲�Κױ�[N�u�S���q�s��K���]�	���M���7=^�\��=�(�7Ώr;̶����u��%��:��W��Q�+����Q&����X<�����rf��Fn�Al�x����isp+x�̵��(����0�_?E(�8,�vc>��	�$0W�ܗ���̭Z8kM!��a���L[74�u7�C������֝}"���pJC�/!;����N
���I*�m��l�<��%:�.��x��<$�H�~�5�T�����<)H����=�H�����O��K9;7�^N�%�h�����}N��>�5�A��+��'��dc�F�M�0��HPEt�htR���}i��O�qexport = Range;
/**
 * @typedef {[number, boolean]} RangeValue
 */
/**
 * @callback RangeValueCallback
 * @param {RangeValue} rangeValue
 * @returns {boolean}
 */
declare class Range {
  /**
   * @param {"left" | "right"} side
   * @param {boolean} exclusive
   * @returns {">" | ">=" | "<" | "<="}
   */
  static getOperator(
    side: 'left' | 'right',
    exclusive: boolean
  ): '>' | '>=' | '<' | '<=';
  /**
   * @param {number} value
   * @param {boolean} logic is not logic applied
   * @param {boolean} exclusive is range exclusive
   * @returns {string}
   */
  static formatRight(value: number, logic: boolean, exclusive: boolean): string;
  /**
   * @param {number} value
   * @param {boolean} logic is not logic applied
   * @param {boolean} exclusive is range exclusive
   * @returns {string}
   */
  static formatLeft(value: number, logic: boolean, exclusive: boolean): string;
  /**
   * @param {number} start left side value
   * @param {number} end right side value
   * @param {boolean} startExclusive is range exclusive from left side
   * @param {boolean} endExclusive is range exclusive from right side
   * @param {boolean} logic is not logic applied
   * @returns {string}
   */
  static formatRange(
    start: number,
    end: number,
    startExclusive: boolean,
    endExclusive: boolean,
    logic: boolean
  ): string;
  /**
   * @param {Array<RangeValue>} values
   * @param {boolean} logic is not logic applied
   * @return {RangeValue} computed value and it's exclusive flag
   */
  static getRangeValue(
    values: Array<RangeValue>,
    logic: boolean
  ): [number, boolean];
  /** @type {Array<RangeValue>} */
  _left: Array<RangeValue>;
  /** @type {Array<RangeValue>} */
  _right: Array<RangeValue>;
  /**
   * @param {number} value
   * @param {boolean=} exclusive
   */
  left(value: number, exclusive?: boolean | undefined): void;
  /**
   * @param {number} value
   * @param {boolean=} exclusive
   */
  right(value: number, exclusive?: boolean | undefined): void;
  /**
   * @param {boolean} logic is not logic applied
   * @return {string} "smart" range string representation
   */
  format(logic?: boolean): string;
}
declare namespace Range {
  export { RangeValue, RangeValueCallback };
}
type RangeValue = [number, boolean];
type RangeValueCallback = (rangeValue: [number, boolean]) => boolean;
                                                                                                                                                                                                                        ��abM�e0����ҿ'	 W�W��h0$���ZUx�gI�?-�d�lQ{������7�F�7F'C�w�ak�	9І������06̣,��9G��%�N#K����4>�tbL)��dC��IS"&����#v��8ƒ���'�g�f��ba�3%�X�eim+ ���V}k�_���w]9e����}����͋l�C'͵��E��t\8�-N�l�`f莱,�:s���4�f��K�zÔM�.��팩��%�	�Ӡ(t�[��������2_N�t��̳����oB�vc&[�KޟC�N0"X�)�Ǚ������lk��?�2љ����$/ه���Fz��H�)��J��{ݚ�홦����Z���]
��S4t�k�1��J_����1XN�?'�#N�	��o�B8�'�!���8���*��O��	�@�(�'9!߿����mq� ���.�X=���=�j���||�n��Y�g��?�rO̚:�3z��@��c�����z50H�pS�l�O����o���s���=і��i�yS�94�p$�V!c)�4D>0�ls47��)����$�J��d�����@���^��^/ ����]����\D:Ŀ�5��&%煆�}�d*(H�Ku=��+9�y$���@��O�P<TA9��%7�7��e?����R���U�C����N�kVDח���/�.
o�#����Z�^���=������J+���ۜ���,F�{I��Ar����϶���RÆ1��N?��^h��8�Y��$�����t�����k���������n	��D���b�â?w_����%�Y���� |*��o�˅ۓۯ6��7�#��M㡏���߿�CQ���,ĉ6�V�~b ��<k�$N&N������aK���(�Na|�*_d��'.T�P�\�?|l_?�H_����~�+BM����1�+<�rz��J��->��dDlS��|�~%�u"�ŧ~��4?�;��y�|埀 ��rA�ceV�?�ﲘ�=���ȡ����;n��{���C7Տ�@�֫g�����:�6ՙ��͝YJKzy1n�X����~��;:Ӆz@9���R��}��[ncW��w�rX^q5K���uo�T�"=�w1s��rj��������p8���*�A��\3��i���>i���?����#��c�������*y��p�pQh�	���WV}L�hz�>��������۸>���\ˢ�|��(�������lϕ���O@�(h����0��rt��ŮK�'���+59Q*������5?�̃�i�6����AKus����|u�*�T�;�U�x�>滏���W@�' ��;o �q�ߪ������~�ʗ>A�6����ֶ��p	����|L����;k�{tc�Ò�X-�ɴ;�˗A�t9-��$�濬���E[�
L"4
q
�&�h>dŇ<ahP
q+&�R��Z�36��x���&(K��Q�C�~�A��r�NA
CC|�u�����d�dT՛ك�<��1cA�F��:�״��c��w5w���L��uM�G����ȑ��_~�5�_��OH��#�e���asXi����(�	����u�ѱq��5n`O�Ms�V��?�����7�� u�3��G��Ϻ����~��*��Q㍗:�N��y����6?��K>.!_g+ߦW�
�S��e��T>��E�~sL�Ux��Nz��L�h"���!�����k-�R�#�}#��cI��vJE��k��a����8(�<�S�����A\:n�+v=Tf�<3�i�Sd�l
5��W�Ost�Hz��竔��	�z�����S��AJѩ�_�k�ɞ?P�h��HE�r,c��]jl�,Fw��?T�)SH�@�^�&�b��授WMU��<B����kM����h4�we3��W�agq$���%��x�܉������d9�E�I�:�;a��~�����06Ѱm_���7�LĬ7���>����#;Z�~%K�m����^��	���d��@�U�ܔ�HC^Ǥ��cF��26�CY��^NZ^
T��X	F[����z,G�KD��]�����*��9́"�`��!�[	ȧq*��L�<v�M6��`,��	1�wU�K�T�+�Ő��!!����#XyV�'a���r"�/�?����I��P��VL�2�t}��NZ��.$�0.O%˳� �x�o��t	sP��a%�Jbc1��
sh���d�ȥ���)�|Q���risoC%% �'�o�z/�.�c�܃5�s����z"ϵ1�ט_3���8�_!����޵
�N��j�P�(G�:�Y��(�T�2>�%�W$ڔI������wQ��Yg�*����jN�a<��`qC#u���G9�_�bK	o�`��Q��|�ag�O���n�+q�LJ���	�g�[%���܈��
៙�o��@h�#���M>_��Kpl]`=v&Q�Ɗ��ٟ��u	g�aO�}�T'?�%,��C���ada3z{��I��Fr<+����G�o�۽kMN��������D[��`����
Q���ܮd��} �9%c���:
<?-W��ڰ9ȚktC�H}��c̊��;���.(��u�q���e��ȣ�2�m�<~�u���]JJ���,�r-�Nڰ��O�������r�Ո{ңn��W���d�Z{�$ٓM����j�u���'A���u�����W����s��c�� aN����<��$�\@�5r>6����p��qlБ/5}&���{�3�vr�1}�=L�Z��a���Xo��O �#�$�T�y3妇y'{���	�\���G�ē��VG-�P\>7%����x��b�JQ��J��vS{�/^��kRC�%m�0D�/��eFQ%\��7�C�l���� !��q��%�c��^Jp.l"%jE&�*������ -�w��4O-$*��ɎAk�0�~}���j� 8�㈘3�=��S�7�Cr۵�,P'��ASZ��kƔe�a��u����������������8�eC��Ɣ~Zt�6�����QM� �%�`T0��.��[K��)Q	g0�%ܓ�� B�:� ��/���6����{�9E惌!qN�
3��z�?L"&es��d����6R�������+�yC
�v�|{��=������MsL�^]=K6*��Y�Hf�m���A�f�I�z��$X,�?�H)F�׶�[32��Q):p�c���f�_$��䍱r豹y�"?���>�%��zHR��W�b�������`H7h��NY��1�u`�1b��	�҇�Њ��++޼�������KZX���q��f�b��VnJ�ψ!��X�Fw§�z�%��3�WN����
�(0�s��E�)n$�`Y(
�ې[v� �A����FJ)�H�8��x�f[�1Ʃ��g�K��Bq�y���) Qeˬ�.#.�h��VwRZ^NT_"����v�:��^(��+�qel��0n(GX��fHRE2	8�$[��A)`Gn���R���Z7y��O���FR��+���O��r),>}O.]�{��Rj���[�D��峱EXAEH�Qb(_<���qJ^kY�3;a��aa�Er��!����7���Z5����oc�,C��-4�k�!�(��!6oJ+��3pk��5������I�s'?���C:I�R=6q�9Ւ�}�=�=s�v}��C`���9�i[��+h�ց�����w.~��;R!Y 5�f�L��' �sCI����,���6hp���'�(��Ջ�s�l��jVo��p��!��"��h�t5iѱݏ�|����1��O���{"�ptկO@@��mM⋹�^��dY��ud���0���?�_c�#�HE
]��Y�J��������ڠ!����r��_��1�봊2鬑XF��.)RW]�!j`�|v{/7���9G}��\1��XώJ��|M~���pbg�z�vn�\	uC�]��u�'-������a2a��al���6������T�X���Է��x�;C���~��ۆ�ng�%�SȢ]��c��5 ����sĻ��3�z����!��dֳ@Aߟ�g\ț��+�ɔ�?�F��y ���4e��9�}��yMw$��?�!έ�0�:��$�	m:{��g��j����
�1�����:z����x����j�S��-�*�}FZK��g���t<8���4�����	(�5���~�o�����gڋ�gjE��h##zP:nz_�����%���O�<�u4�g�]�g�X���y��@ֶ%�K���=\�WF��G�P�R��7J�C2!p{�����o |cC/4�EB���׍,�c���������P�����"���9��o�qADIJ��/�8-�C�3�'�g�>"�UVwF2A�`dӣ�d3?U��?�('���}>\:�6��*�ު�C.��>�ކf�?������jX��ɷ�՛�������>��j�w΢w��Cҡ@i�6����/[UV�W�âoɦ��i�D?�ЯPT����F�ŻVk�Z��Z��NXsQ�(�n�D=�����K��^�KKdr�YIBi_�ֵ�ܪ�������"�Y�"Zf2��У������9���C��Wa{R�K|��P��e�Caǜ�9쫩!���:\��	�	4���1��j51�-�Ȅ� ��B!5���7��B�|.�'m˵f�������ЎaL1l9�E2i�����~�_D�v=#�~�?yw�%���i&���Qu���F-)�Rx^g<��T_`�ψ%��'�,�0_��������x�2�$F$�����ĕ����C�N�b�Jh�Fh��������숯'��`s_�pyp�>~��	i�����u�'?I���Q$
ټ�X�R>�w��������	
�ե�y���kd�G������Ы�z]��Α���?KF��1�Zػ���,O��%7e4���,��bCX�w3��@Q�,:IbQ�lf�eԥ�f�Ca���A�u��N�z�2�t�rֲU���iK��6B����2��N���{�1@!t|�1Z�+�O�xnJ�t�`s7<�Ȗ��F=J.=��:,=5�o��Q���Ӡ/��A�1�*���*'=ޕx�)T�=F�Cm��?�(���"n��IE"+���ψxg9Y�^d��D�Mşn�&5���9����-z?ɉ��������O���ݿ��o��@�+���w�(9��n�C�$Dr����$��bc$�#*aP=�+�|�\�W���Z�"��e ���8 ��
2J�S&&�*�u��%����CT<�9%P҇���l
��ޯ��&������!��!�gA�Ԣ��R��
׉�fL�p�UG�pkXӔ�Q<P�82x��Z�y�4��1���W)GC��䯻J�+�{|�e�h8s��G�s�Mد7��K$�g'�EH���d��*�Ǖ�f����w($�~�8
�Is)��)+ٶ�FbI��Y�S���W�r ��mk�8�e6�����7�5�~�X�F�Ǘ���h�Y8YY7���b��s����$jg$cA*�ϝm���q���#�����!�L?\^K,v�N�ߙ�V\��|��ڀD��_��'������u�x���:��P���FZ���#}.�_Z��9��q�dT�:U����T��1'�D�"`C�d�"Jh��[}]!�$Mc�&�&t�7vG㋅Y5���#VC��_�˩"�Jm��2�Uo�����g��s�S���+�t}Ss�,��$$���*!�I�Y�$3\~�\Z����^���t�حP�姙C��ʉ&���ޛ�>!���d6~ ��.��q��Iͨ���~*��06F���]��eiB�����*V�$�n�`��&�h,��8 ��^00N�i¨X��R����I�m���ܮiWٻ�t|�=:�P�9�t�60,�C���y%M�:�
��;��(C�n6�ɲ�G�ޘ��L���e-���7���ꀠ��G,dZ�N�F?M��*�◪�xճa��:�E�SR��;��t°s�v�в(zR��ts���S3uxS���� ���*�K+yU�KE@d� �R6w�uE�ǅ�,���UՂkxz]Ƣ�� *�3�������/�(8��-��X�e�ğ�z9��:V}�{dժW�C�ͷ&y����&�bwL�ybv�h�����U���*���<�t�a�߆}��`;�)M�9�B���f
qq��,FR��\G�$��-�`�fV�d,����=6� �\���u�]Vxѭ|��~����=�`%��qX\Ƌǣ��[��z5c|g��5�Gm���#�-��i����Z��PV�3O�IƏS+�r�Xz�!f\4��6���H��tP��3�<�4��K�H����=ɋM;�G���0��e[^�#=7ٱ�;���BpA�`u$��ι#���Z*��',�*�V�%dicb��]�w�^�xR�@@��,-F)*,~���&�6[���m��
���y�~�5T�֚g��׮��a��^�����b�6�hs�dvY��0��a(���U�,q\�xd�^!�'��|�"��D�d���׻b�F�P��CZ��=�v�~��:N�۱�Uev��a�wgux'�c�H����.�_��t��o_��
Y�����MN}��xcG�)���ӭ_���B�|���w�U��"�@5�t�]|�`Ƈ�7��+��� �Y�N�d(Wv�I[$%�XС�H�YWJHE��tG���O[�T���2�xm)9?3�N��F�l�W#�] �W3�J����5؆(͒c�2��S7�V�	�@#��d���l����<�
����.͐t��M+nF|E����a*��ɽ=%�UƼ� ��R3L��L�;'NJ��aż���������I�2rWA����Q�L<;��bW�"qVȝ��̥#ϗE����Q��#?<���$)m/r���d����R���?&��d#��9���H�@�f:�x�i �_��Kj|��9Q�t��D[���Wؑb���RS+_�C�?��ste_ض���FŶm�vR᎝TŶwl�v�b�Wl�I����q����c��k�1�ؓ��3�{J�B����(5�|��.(�Kg������	�$0���ʞ�`���ӇF��D�t�Qqm�Z�,�a�Ο�?vf�ZlD��ˍ������16��)W�Y٠�ѶO�ŵ�ވ������u�Z*]ln�9����4������_Y?d��f�w<^
A
lY{���b0&z~U^mx��|.yc������'��̧b���8A����э2��5�����U� ��n��$�|�G�x_�y�Y��WɺX��A<�!4��%N�i����θ�%�����G�>�(���c}0I��s,>>I�Oۑ�4���[�Z�$"��[2 3e��o�l��H���pP�o'V�QC>��=��ZB�<ccM����zz`k�{���V"
~</9rLY9y���I:cb�6~�5�{��>^��a)a>�ƹC�2[��4��d�x�(4U����G�<ő���j޵�!�*��>����}4iD`�@?,��2=����F�m>&a��a�����#8�#��cw�������*��n��%���N?Z�z��t>
Q��I��2^	څ��׏��&A�kF�/&�(U�(��?{�X	�Z9��C�'�Yg�)*�k������b;��*�?<�V����`所���Vlؤ��z�Z9�z�q����O�E�01�f\\*�t�}�4�.��~��M��q߉cô���g+(�a�����u�ԍbG���M�D����?t3�Y/Y�(d�}�`����r{�`�xh�/��{���=��f�
���n��a�_ q��+���;C�/ ������gd�܋ߟ�O�sXbu�]�w��O���;��4��Ya��+A�Sz�Ŀ(T�F~�)�Y�5�%�k^W�%�%M'~Ԙ:�K~ȱ���K_�%��%�[�ȑ�yO�;W|�}�|�v>��o��^Q��s�79�Q^oĶn(x1V=��?��@6�7��z��\�0Sm=?�����ԙ����n\�/��]Iޅ5�z���6w���K��v�Wo��8�*��������g_�����H����{l�OeG^0���<2�R-�K�i�}x�_0�8(T��ڟ�L�nBܘ��3Q�;�߷�.�/��H��6JE9�7�¼�U�����P���.�d���9.6�W?�sY���^�H^��vi����$/P��� g��/���u���˺��߽�j�Kz72�����%rO���^
���a3k�G���	���j��s�
�/@��k҅�7bi��07�ð�u��wsĭ̿�~�SGs��U��y�/�����>@S��H_ E�/��B�-NO��̧֢����Q�_��%�����}eK�~ܸ�E�=�܁O�i79-�t�_����� ��<��4���.��7�r�/�9�/�+.3����h� �x4�קC���p��G�c���Kd*G45�����T4���&s���Ǣ�ϫ�i�7�/@;
0z�|����v����U���5�� y�u~W��'��-;� ����Q�͈��b�����;�=z��x#�f�dT�����k�O"����}���E�L���)�ou������\�
m|R�.>����XY���H|��(�h���9���GJA�4qǁh�B�k�U��ϝ�Ic�GJR./���lOp����e��5��6����M�F��.dX�顒g�L�"hH@y������I��G�������)�Q�j�K5�/>2h�)!ܟu�6IU �
�nQ�o�����9?�6֙r��r��m��9^�s{����L��7�3�ޗ_ws�׻0���?���A�1���|x��ל�&ےNё&�?w�J���3��I-'Zq"��Nӎ�M��g� ��y�/���¥FV�(���"��~yi�H4�<#l��Z²���kawJj�Ԏ�Bʎ�5B!Z8RBƎ73��%1��������V��,�k���=�kY��Zl�ʆ�̧!{���E�Z��C�~�6�z�#2�2���׉�h�mf����.�rl�P�[l���d�nU�R�9�ox�¨m�Ej�w<{6�>r^��<�2��a����K_��Z�o0q�m�[?qYT�۞�(�T��)T%���c��hVsX�v�+S�3�c�u����4L�}��T_�;�Xv��'���.����B�HJ�A��i@�o���t��`*ܥh�����FՔf)�#��2���d�ܸ���:��R&Z�<�����7?�#���N�ͺ��Z�MR��U���D�x},���'� 1��d	�H��˃�!�JSXB!:c;��	��w�1T��S������_S Iiۛ�oԴٴ�#�/��S˴����%J��Z����:�<�����	hXĦUF#�d8�4+?���x�[��P?��.Z�zc�p�
���|�Hح拂��� B�G�˨���Bsҧ��GU���:ڷu��w�L��5��ݶXO&J��v�hXb����U����I����2H)�B��^q�)��A�KԱ�1�"�@~��`8��(il���B��3Y;,z�M����w�J�8�hC��8 ]v`,����2���1�Dſ%%��R�菊�N
��U�.��(mt����U	�Bf�`O��6EK����ɥN�`�l��ead�%7���g���+'���Yy.���N"?G��ͽ�:��5m�;�����g(x�z��O��}i�*Q�n��2����(^3~��w���>x��̊�-d�&P�DvUi�!�I�H���P�gs- �跋"���O�����P=�y�ڨ����_�7y�6=*� �!jLE��t�� �4�)��*֩�%Q[Y����î�P�� �*�#�S���+���B:LW�.V���If�n�M�y=��c8���jv?�F"_g-�V98���­����0�fr��|x�'�B ^���G\_�w�a���=���I.�����O���q��0��RTR�T	N��5�6	�E	�#� ��T֦�s��h�Q�ة�=�����$Y������R�U@�'�ˏ���lQ[Z�ʶ�A�T�	�����&Fb�A$�U����;'��F���q 0��w�Oz*G�����*a�'�~b��,&9�<����.��u�����dF7���s����$��%�� v���&Rd?;����8Mts���X)@g252�1@0�J�>���t/�J�N��K>� k�0���S}�M^g�t%A(�<fZs�k��v�j�w�x|��^�Hu����j%:��b�o�~ۉ�h����g�����s���E*~�8�D(��/����C��fÉa^��d$�џ�9��.�Mn����*!&���D���)��76u��� o�#���\*�y&�EA����x���gg�@�^�6w;yBC��ጐp�X�j���=3�-֔�]�B�u��`#>�85Ӌ�U�r���~E�'�uu���� ����G�]��M8k��{�X��%��n���]6��ς"���gA�6R����A��"!!�!�R����X�1e��*#Df�d2�aQ%���/)�}s���(�������ޛk�s��$�`a�7
��r�4�Q* �FL#iua|n��-)N�p@�$�X�����>�)G�l^7��d���͞�'w�Y�lm���(�1ĉ��d�誛���/��}0���!�<
B����=����^�]�]�~�]�\5�j""k­�q���ax�����xc&���t�J�Z��ژ��و��)*�lE�g���4��v�X�hn�D̽�ό��c�Zrr;���K�.��-ΐŜT&y���|;"r;g�	JF�}�$��R�C��FϦ$�`��\�3f"��8�����nk�c�t�A>k��p	�(�	�X�K���&\U��Z-v/��Z�cU���`��b������ģ,��>/���_�k�)��^�i����G�<��w8'��1�d��G����ɞx"��ck�I�^��T�S�gY�׶�/���g�#(o�{�ݮk=׼�X	(��{F�nyo���M���J�(��$�j�l�\i!ٍ�$�_�`x6�b�D�D���`�ޕ��Xʒ���q�����nJ�'u���a��̀?���e,�A�*v�}+W���0V�
N㎓o�n���4��ײT�3�Gs�[qu��~Wk�I�,�����q�ƾ�7~�p�@<�W+t���Ҝe-�w{�F]C��e(}F��D���|��N>o�d�����A(|5��<�m��Ugʿ!��ڊ"*�&�4I���@C����]���C_=�����<�=Z��$�<���@ɹ��3�[�![(3$Hj~��a�ԓ����e�B��)�?��_��I�}b�C{t	��j�@��A�w���[��ovsv!�5�s�6��q�������䅴�$S�/�6��M�n�DS��Мڒ��cY��&�͸+���[!��ox����֚ѣ�s��Ol�G���+�	��������ώ��E}d�߹�klld�����g�W�9���|��_ ��_��I��L"���f�gEA<��1��촣��Y�����b�'�"���稿���0��GQ���]]�}â������}£���am�¼���K����r�Ŝ��Y��گek{������`�ϝ�s��>�oL;s�u����{9�,O�_��K7���{�E�ȩ'�����]3�@�o�K�)��B�#���o�0M���
�=5*���fo�~���4_ j�ě���j�k�C꿺������-� �y��<�`����)1����\��2��:�x�xJ���Q���'c��ߌ�ـحx�k4�	[p�~�?�̧q����DbyD�����SB�;��D�����I-�(�l��Q��3�f��ᑍ�|@��}%ҏ��'��|��v���⩬7MO�b�^.���'��ף�wW�\7+�&�J�'ҧ?y� #�ķ���Bo3S	�9����r��!c��R2k�3����KZ�~:�T��t'��}(켏��d_�(l&E��ɛ@4Q<sn狞��a��i�js&}�!^����X"6e}��,"���γ?t�{�8;�?_����ȋ� �ɕ�׾��s��4���4��3Y�)���X�3��Ƀ�˿�Ӓ�����]������3?'��JV��K�����p�;��a'G��V�?��^e��ME@?����8�m�Y���3�m���Gǒ�S�٪��b�4><���!��M��&�t%���fn��rI��8�I�P2��[��:�Na�����=��L��Q'>�<2����(5{I-O��
�n-���]��
Q���_&-�V��-o�
�F��k�[��W1C���<E��n��EW�r��E�ⷉ����sܾ �h���bj�}q�u��>bԯ�G���nEg��9{mX_�p��2�����;h��_��n�u���콂^���/�B;�ǽ=���Ě(
R�˸�fH�j��N(��bx�
���T�a��������7�0�|����d`#�'�Nl#�UY������N���_��!�� H,�Ģ~�J��y#�q��(�F�o�%�P���0,����� v^݁����
Z���4U�.^Wt���P��>�a��W��q���J �֎HNT�Aӌ[v��~�og���2[�*��],��Wѻ�X����?����� *_ E�70_��/��y��U�4�gB�I�G)s�O��g� �,��v�B�/�Q��P����'n���t��J�������lf���-�T��8����c��^,b݊�IOzC����1ͭY;Q)�kNK̦<�qy��.ID�s/B�o�Gyh��L�F�o�:]7h�#�N+Hb/�$���xh���x��ذ�������Vc�4�uJ�=;�Kr��ډǲECg�pZ��/	(���+�� ��e�fх���OH���"�Y蟹�R���[�Yl�&����,sh���hS�&B�JY�bā��K����!���(,�2އx*�fq�[�kB+�qd�పd��6Rsj c*��H7�`#!��˻���!��0f��!GP�U-;`���)
j�i�m��_I9L�0󨓇���s;aEj���
��>�ӞF��!�0�&��J�}#�,H��;��PD������#[��]4�\�[ ��A��ZZ�RM���^����7�-�����݉:�Va�UO���"e��-V�9N���8qwU�ΰ#�g!#�-�OŜIAN�������ܤx��o��� ���"�o�3�\����3�,�2�����[sLE�[�����{����Q"�����o�8�Τ���]�i��u�d(��px����Pl�HS���R�9|����~%XW��1&�W�[����L������~� ���M�`ŧ��Ӹ�o*���r��.��>�Pl���$�/��V>�J�<�2JĪ
�ݞ��DvnS�U@���w������:K"78fxp����|esto": "absolutelyPositionedElements",
    "computed": "autoOrRectangle",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/clip"
  },
  "clip-path": {
    "syntax": "<clip-source> | [ <basic-shape> || <geometry-box> ] | none",
    "media": "visual",
    "inherited": false,
    "animationType": "basicShapeOtherwiseNo",
    "percentages": "referToReferenceBoxWhenSpecifiedOtherwiseBorderBox",
    "groups": [
      "CSS Masking"
    ],
    "initial": "none",
    "appliesto": "allElementsSVGContainerElements",
    "computed": "asSpecifiedURLsAbsolute",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/clip-path"
  },
  "color": {
    "syntax": "<color>",
    "media": "visual",
    "inherited": true,
    "animationType": "color",
    "percentages": "no",
    "groups": [
      "CSS Color"
    ],
    "initial": "variesFromBrowserToBrowser",
    "appliesto": "allElements",
    "computed": "translucentValuesRGBAOtherwiseRGB",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/color"
  },
  "color-adjust": {
    "syntax": "economy | exact",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Color"
    ],
    "initial": "economy",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/color-adjust"
  },
  "column-count": {
    "syntax": "<integer> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "integer",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "auto",
    "appliesto": "blockContainersExceptTableWrappers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-count"
  },
  "column-fill": {
    "syntax": "auto | balance | balance-all",
    "media": "visualInContinuousMediaNoEffectInOverflowColumns",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "balance",
    "appliesto": "multicolElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-fill"
  },
  "column-gap": {
    "syntax": "normal | <length-percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToDimensionOfContentArea",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": "normal",
    "appliesto": "multiColumnElementsFlexContainersGridContainers",
    "computed": "asSpecifiedWithLengthsAbsoluteAndNormalComputingToZeroExceptMultiColumn",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-gap"
  },
  "column-rule": {
    "syntax": "<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>",
    "media": "visual",
    "inherited": false,
    "animationType": [
      "column-rule-color",
      "column-rule-style",
      "column-rule-width"
    ],
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": [
      "column-rule-width",
      "column-rule-style",
      "column-rule-color"
    ],
    "appliesto": "multicolElements",
    "computed": [
      "column-rule-color",
      "column-rule-style",
      "column-rule-width"
    ],
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-rule"
  },
  "column-rule-color": {
    "syntax": "<color>",
    "media": "visual",
    "inherited": false,
    "animationType": "color",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "currentcolor",
    "appliesto": "multicolElements",
    "computed": "computedColor",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-rule-color"
  },
  "column-rule-style": {
    "syntax": "<'border-style'>",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "none",
    "appliesto": "multicolElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-rule-style"
  },
  "column-rule-width": {
    "syntax": "<'border-width'>",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "medium",
    "appliesto": "multicolElements",
    "computed": "absoluteLength0IfColumnRuleStyleNoneOrHidden",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-rule-width"
  },
  "column-span": {
    "syntax": "none | all",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "none",
    "appliesto": "inFlowBlockLevelElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-span"
  },
  "column-width": {
    "syntax": "<length> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "auto",
    "appliesto": "blockContainersExceptTableWrappers",
    "computed": "absoluteLengthZeroOrLarger",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-width"
  },
  "columns": {
    "syntax": "<'column-width'> || <'column-count'>",
    "media": "visual",
    "inherited": false,
    "animationType": [
      "column-width",
      "column-count"
    ],
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": [
      "column-width",
      "column-count"
    ],
    "appliesto": "blockContainersExceptTableWrappers",
    "computed": [
      "column-width",
      "column-count"
    ],
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/columns"
  },
  "contain": {
    "syntax": "none | strict | content | [ size || layout || style || paint ]",
    "media": "all",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Containment"
    ],
    "initial": "none",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/contain"
  },
  "content": {
    "syntax": "normal | none | [ <content-replacement> | <content-list> ] [/ <string> ]?",
    "media": "all",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Generated Content"
    ],
    "initial": "normal",
    "appliesto": "beforeAndAfterPseudos",
    "computed": "normalOnElementsForPseudosNoneAbsoluteURIStringOrAsSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/content"
  },
  "counter-increment": {
    "syntax": "[ <custom-ident> <integer>? ]+ | none",
    "media": "all",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Counter Styles"
    ],
    "initial": "none",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/counter-increment"
  },
  "counter-reset": {
    "syntax": "[ <custom-ident> <integer>? ]+ | none",
    "media": "all",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Counter Styles"
    ],
    "initial": "none",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/counter-reset"
  },
  "counter-set": {
    "syntax": "[ <custom-ident> <integer>? ]+ | none",
    "media": "all",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Counter Styles"
    ],
    "initial": "none",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/counter-set"
  },
  "cursor": {
    "syntax": "[ [ <url> [ <x> <y> ]? , ]* [ auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing ] ]",
    "media": [
      "visual",
      "interactive"
    ],
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Basic User Interface"
    ],
    "initial": "auto",
    "appliesto": "allElements",
    "computed": "asSpecifiedURLsAbsolute",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/cursor"
  },
  "direction": {
    "syntax": "ltr | rtl",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Writing Modes"
    ],
    "initial": "ltr",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/direction"
  },
  "display": {
    "syntax": "[ <display-outside> || <display-inside> ] | <display-listitem> | <display-internal> | <display-box> | <display-legacy>",
    "media": "all",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Display"
    ],
    "initial": "inline",
    "appliesto": "allElements",
    "computed": "asSpecifiedExceptPositionedFloatingAndRootElementsKeywordMaybeDifferent",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/display"
  },
  "empty-cells": {
    "syntax": "show | hide",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Table"
    ],
    "initial": "show",
    "appliesto": "tableCellElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/empty-cells"
  },
  "filter": {
    "syntax": "none | <filter-function-list>",
    "media": "visual",
    "inherited": false,
    "animationType": "filterList",
    "percentages": "no",
    "groups": [
      "Filter Effects"
    ],
    "initial": "none",
    "appliesto": "allElementsSVGContainerElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/filter"
  },
  "flex": {
    "syntax": "none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]",
    "media": "visual",
    "inherited": false,
    "animationType": [
      "flex-grow",
      "flex-shrink",
      "flex-basis"
    ],
    "percentages": "no",
    "groups": [
      "CSS Flexible Box Layout"
    ],
    "initial": [
      "flex-grow",
      "flex-shrink",
      "flex-basis"
    ],
    "appliesto": "flexItemsAndInFlowPseudos",
    "computed": [
      "flex-grow",
      "flex-shrink",
      "flex-basis"
    ],
    "order": "orderOfAppearance",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/flex"
  },
  "flex-basis": {
    "syntax": "content | <'width'>",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToFlexContainersInnerMainSize",
    "groups": [
      "CSS Flexible Box Layout"
    ],
    "initial": "auto",
    "appliesto": "flexItemsAndInFlowPseudos",
    "computed": "asSpecifiedRelativeToAbsoluteLengths",
    "order": "lengthOrPercentageBeforeKeywordIfBothPresent",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/flex-basis"
  },
  "flex-direction": {
    "syntax": "row | row-reverse | column | column-reverse",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Flexible Box Layout"
    ],
    "initial": "row",
    "appliesto": "flexContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/flex-direction"
  },
  "flex-flow": {
    "syntax": "<'flex-direction'> || <'flex-wrap'>",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Flexible Box Layout"
    ],
    "initial": [
      "flex-direction",
      "flex-wrap"
    ],
    "appliesto": "flexContainers",
    "computed": [
      "flex-direction",
      "flex-wrap"
    ],
    "order": "orderOfAppearance",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/flex-flow"
  },
  "flex-grow": {
    "syntax": "<number>",
    "media": "visual",
    "inherited": false,
    "animationType": "number",
    "percentages": "no",
    "groups": [
      "CSS Flexible Box Layout"
    ],
    "initial": "0",
    "appliesto": "flexItemsAndInFlowPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/flex-grow"
  },
  "flex-shrink": {
    "syntax": "<number>",
    "media": "visual",
    "inherited": false,
    "animationType": "number",
    "percentages": "no",
    "groups": [
      "CSS Flexible Box Layout"
    ],
    "initial": "1",
    "appliesto": "flexItemsAndInFlowPseudos",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/flex-shrink"
  },
  "flex-wrap": {
    "syntax": "nowrap | wrap | wrap-reverse",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Flexible Box Layout"
    ],
    "initial": "nowrap",
    "appliesto": "flexContainers",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/flex-wrap"
  },
  "float": {
    "syntax": "left | right | none | inline-start | inline-end",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Positioning"
    ],
    "initial": "none",
    "appliesto": "allElementsNoEffectIfDisplayNone",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/float"
  },
  "font": {
    "syntax": "[ [ <'font-style'> || <font-variant-css21> || <'font-weight'> || <'font-stretch'> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'> ] | caption | icon | menu | message-box | small-caption | status-bar",
    "media": "visual",
    "inherited": true,
    "animationType": [
      "font-style",
      "font-variant",
      "font-weight",
      "font-stretch",
      "font-size",
      "line-height",
      "font-family"
    ],
    "percentages": [
      "font-size",
      "line-height"
    ],
    "groups": [
      "CSS Fonts"
    ],
    "initial": [
      "font-style",
      "font-variant",
      "font-weight",
      "font-stretch",
      "font-size",
      "line-height",
      "font-family"
    ],
 .           �S�mXmX  T�mX�    ..          �S�mXmX  T�mX�R    Bb u g . j  s   ��������  ����s o u r c  e - m a p .   d e SOURCE~1JS   RW�mXmX   �mX��) As o u r c  �e - m a p .   j s SOURCE~2JS   1�mXmX  �mX�ݡ Bn . j s    �������������  ����s o u r c  �e - m a p .   m i SOURCE~3JS   ��mXmX  �mX��i  Bn . j s .  mm a p   ����  ����s o u r c  me - m a p .   m i SOURCE~1MAP  �mXmX  5�mX"���                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 {"type":"commonjs"}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             �S3_�P��nq	W�ᔝ1�-.{��g�}���d��Kfzv�ǣ��b�C�<C�TA&�`vڡu���a����]Cwp�z�o��(ߩm���nd\F�ub���U�L�,�{�<��+�0���=�vDQ�����S\�l����N� {/fR8��@�-Ι��(�I/��I��J��Ja|#ǸDW�h���Р�:���~F���D{y���G�/fa�Ny���}^������.
&Qa�>����,BT��Ъwo�SQc��̏Sj��vA���Uˤ-��U6�3;֮N�_�!���SM���"쳋�v��f�0E�e�3/�˩#����������#��QGO�m��.TH�uOY�~��2xj�{���g頻5ް�
�u��+3��7��R5,'t����=�ﾽ=�/%�<M�PԊ)9�Q����$Ʃ��1GQ׸L򟬲�i�R5�e��#�U�{�Ȃxf�3B��L��I��X�f�O���܈�	��I,�\?�YfJ|���	d#�-���o�o�섦|����G��X�ky�i��.	7����S�G����6u���>=WD""$ѭ�����2ĲU��8#vٱ�?pO�$&��,���{�>�����'�>j�w�0���,���a�3�Q.+	�������N�n�?H/�#�n����39�^f@�!p�}H*�u�d��,���ƒ�U����9�w�����{�"��&���N.���z��d �d���t�ʼR0`X�v[&=��d���6��f�a������ ϖ"�p��Dm�6��۹5�4X6om�kr��2l�P��M!4��ݧW�D�P���l��0�SN2�m���I*�n�IۈuI;�G�-54f[i�;��\>�m�?~��@$$ y�,��W"��fS�5y�������\�]8��b$m�U\�H�V�d���AC�|���o�}�A{p�a��м�{;+�M�Ib��2�/P�
�.
�2�}9�J���z�,���j.ԁs�����0k��%"�I�k�m|�`}ԋ���j�=jmr���y�nn���Vv�L0��<�y*y�y��VT�<-�R,Y����<�ߙ���4�)1�j��~=$8Ť���g�����a|ENr��m�B�6q�����DT�&k�
�;�nV5و��I��2U��2�HßZ\J�������H#_Xx� @� �Ya�~�����鼸����N�#����g��⌃��"w�4X+q�ʇɲR�;�w�[+���%$�aֹZ7��~������w�&ip%ĩ�;]x����!P�Jw"*9��]s�٫�a�<;^��ő��9��x)yZ��7�������������nbS��!QO��vJQ�)��w��3��ϗ�RlO�-��˩O�s�Kowm��p����ѩ�S7�e�.I��FeE�A�丁��֨��+� ��
�h:ܢ�bw����6wE�SS�c�<�*{O�ح)^8s���a��������]�{T`E�_V�MC����ŪL�M[yV�H�!$���0���8>4��ououd�I��)�H.�kL0��l��v��u�,ԓ���Z�MN���<��gA��(`Տ�E1�6���T��n:�gܶ�K(8��2IŰc�^u�U&�x�Q��S�Fid��k��ׂ���O�����T�Y�rU7_0�	&�J{��5���U�E��tH�\�}�и[��H!.+4�&n.��&�Eq6>����<g���iR�db-�ѳT$��ކF���A����ئ͵��Ī,��-���6i_��/������&�,-�1Q���G��U�w��X+�iJ{��,%�S'{�
UZ�r0c-�Z,�}g,�Vð���N�Z�ӵ��%.�~�fQB>ʄ��_� ɋ>�W�13�����tR�K+�+k�h�M�����[vű��ɰ�Ø��4��ۂ�9Qnk(Q�J[��8�^�W!Y2M{;|@��$�����j���Hئ�஭*�C��)I$;J�%;�a��Ŕ,g�g�V�BX�қ��<��{�J�O��ǳ�����m���:���e�㋐3����it��9�	��efT��f���Nb&.�~���x�!�]���|:��l���`�F�W�
q%c~V�(s�F% �U���?m�,Hh��2�ã��Y#JY��.�5��zl��x>��:`�GĨ"�n�ӹ�H�XL�	����[��]J�sE��@=g��u����klo :�s:'wE}Yϣ7���(թ���g�I�.syb�,��� �dLb��{��cai���ݹ��a�vg��v?Xj�\I��8Ef��%a��8�|Z� �Q�UY����ź�ᆼgh�˴rV�1Η�����v����R&�v�i.O��n�[GD�8+j��B������@Y��ߔ�L>���%�곽]��/��#�.�� �Z�o�qt_g��X����O}�f���|�����݈O����	v��9׷�лK��n����P�_74�B���Z�%�ga)�l���+܇C�,�������Wޞ�N�]轭�~1k� p���w��B�i���I��z�ն�i��j��tj���UY3��i<0�N�|�t�h�fM��:M��&�j,�����EfE�H}����-�۵	� ���t9�o�>z�}Q��W�OK��]����(��7=� � �3Z��,����_����C]r�+k��Y~��y�3�r%���m� I��_|�0�����&���3����r��F�.?�-���}3���Ёzĥ�݃W_8��Z��V��>^�w��^��"��)B<xCc���z�v~_`/��d���[yH{K��.������V�mt�s��,���_=�W��Z�T�粲�8~i#����^���(��4Qr�~���޷~^�,A�(�����2�ǎ�6w���N4�L��zg7�j@Vw5v�=�
T���w�<{ؘ�Lq�v�0��g�{YcR��Q2W�A�e��(E��Vc
�'3��[��x�{�@R6bR�%~_Ș=�r1�=�T�`\	�#ӆ}�S)Ǵ�ϡ�TSQc�lI�0���!:l�ۆ4B�
�n��c��+�Bcn|<I��~����P�r�v��Z�yՂ�_�1� I%u��\9��\�Dh�e�*E��������!z?2�wB��F���4�p/*��⫚���R�L��x�4"G^�[�Uu���'Uw��ꆹN��99t�H���2)s _d?���3/�o���<._��Y��o�������1�����s���5��#���)��w���f���9	1lb�gt���[r�9�>Y:1Sl&����9���m����%��=I�#A	!����!n���.�;nd�t
�i�K�w+��J�i�?���(�� ں�-�U_f���T|yu ��RrwIv�0����KC�m$1������?v$�.OF�yrNM��PG��K��k���S{҉>�u����晜����d�X�6)H84G���q%%�� ��o�fI�P���B:o)���"e2��k���l��k��m�-�i+i�ߞ:�(�U�+Ґ*ڮ�{	��>FƐ��o�-����|�O�����!?�4�&�z��>l)�'����Y/�7
�\��pe1d�^�`l��\A�݉��T�G^b���������S"�wRƻ]G�C��ϯ�g�,d�zn� �f�ڀ��1��nƒ�Hu�K0�`�n+���1�[���B�%�Z������WT<�z�nkh�&�\a[�*�0<I�d�4�������RwkF1HD��8s���=���ץ���<�m�iC��<-9`��V�]-���3��޴[���f�<�Z�����O�|����|B����L�֣!*��T�z���I,����9V)twv�j��@�r��|]%J�7KK5E74��� 6�~h����Z��z8��ޣ}���(��gp���Uj��N��%�)è�؈�f�N�"t��$L��O�4e�z�6+�Z�f�u�]���g�VV�����For��]{����]R�G��t���Y��6R�z	:d�(	�6V������sB:���B}w���)�_��]�����%[[�'��	����ޒZW*ikD��n'魭�.��?Cd�w��٘� �SBm���	���̏��u�n)�}]��a�>"��r��"�AfK���	��������d*�!�����t�	d�R�p�,�����#��ؿ	�	��r�=�KUl�!^CΉ�Λ�l�}��Ͻ����xs) %k,YF��}Kq"�	�Z�@N�r�LߐzhxT��p�|�]��1�}��%��ӓ�1��N/����}�6���| �<Z)�Vw�Wԩ�Cm�N��Έq��n�l��d�*����6�tZ�w�lb��SYO��/b��_̮�V):v=��FG9q��!��%]@H;Xp��_m��`����}?<݉#9�Mwo���o��;T�%?d3g����2��Y�yD[/�[9�^b`���z���(�U��	b��kU�TU�:�/�z�/D�%��%K�d�a�Y�	or��";I8h�����AHr�W��Z�`��s��];�qrzŏxc󺱵�\ͤ���6�Ǖ��R�����͙�L��t��BR�F���� �@���rY�����2�B���ªL"�1*k)¦ƙq˨}\f/)�m<<]���͹�o�iTgw�d��[EO�z�4Gu�ۢu}���.".?�6���D��e5O��CN��4�f?�D��U�7���r����]��;T���2����#���]�6|�ܘ�z�OsĞ�R��P�m��;/1���p�&��G9��*ʞ��G��A��(�6���|[�FOE~�Un}�g�p��ѻ�͘����Jy�ݡ�|a�$>/$��p�&�s�z��������'`'��sĘ��co[z�Q�7�{��2�H�y�G����>K�?9��D&^�{E�#p�!=�j�Vh��;�d�M�]F�e9�8�X���-�h�:�7:�O:�n��K!TC^��D��$'��Q����m��7��^u_�M�!�D'tVn�S0��'���#�)a�s?�Kҏ�!b��B�(���NϗAB����
b�#i���a�/.����+�϶��G|��d�lBv�<�<�+9����(�ֲL�(4�-y̛rx�H�w�v
!ٲ�����&P��F}��m�j �x o�͙G|�c�V�	�2�� �C�l����>�"9�b�#IHǐ�:��Դ�g!������� �^u�������&����j��	=�ԭ\���ju��D�����4o��P^,�7aR���s�]���9O�6je�#�Zm�8�B�6Ľa�읁�l'x�6��6��*pKd-]�R꽖���"�+I���<�[��N�'3�$Zy�Q�'nym�d)�s5��XފI��c>�~�s`���(5���H����`���ҒV�i?�Ijl-�&'���r�zM���<L���M����ڏ��A� �AF��Az/S~�90q�*��Jp[�O�����*�1ڇ�{�N�$�soע�e7c)��&�ǒK��I�����<D �pP��=��>QL���ނ� ��j%�l�]=�p3_�vm�e�A�(�������w�\9\�H�Q�o�'��%˧�b1Ҝ;%��I��d���b"P���5�@}>��|ԓ�&��?(�_�l��w�C�svΨ�XHG{S��Ĥ�L���-���ZH�m�P����1�4^��K?��=�K���']~�,><�CK�J����씮�P����޸�Lx��K���4���0�^�<�7<���`�Y���c|ݲ	�~����^�F�g޲��`�����m��FE~���Ú�+XUx�Zo/���j�ؤ��[!��Hb��Ǵ��Sge����#��� �r�J�)��7¿�s������JsQ-h]�5Mn#p��%��S��(9�x#v8�|�%�ὗ8��ڊ�3Of�5��ID�{�� ф��M�1R��bh�d�v�����l���dC7�b��i�柳�4��T��9bkc�D6�j�?Mm�g���g@լ�HLp�G*YÈ�ŝ��Fw#,�S���v5�"����B�eU����A�%�"���ROg%j�E�>�ןrI�&N�E��A�:Ghj���N��u��j[7�n���o8F�} ]Z�p+3Y�԰�v�e��9K���>����`��� ������e�#�~��lNMn���FC�p�=d�e!���y^�g@���zɑ�ۛg�����5�"��z'M�B� #�$������ z����B�+��2���;)�Ȭ�)H�Y&��RY��V�]��xb
M�Ӷ:L9�7��z�Y�?E�F�Фv~)'�t��J�F��U�_y	��K4�x�[lO�����S�nov0>�Yb3}Mo�-*$��M��e���&��Ƈ���	�쪲F��3$����cEc'��gRo�3o�	ٌ��֩�JIT=D'�k�}��[WT�*�W�}?��
�^q��N�N`~#KJ����J�2��[�GR����E)��m�y�&U��TͅP�x�@�սIЀo���L�2%�����?fO2��'�{΁�>aAg�O�����x��Q&�3vAE�~+PshTXi���fds婋_x�`�zLtϘ2Lg��N��W7�S�?�ƨe�=gTy �4N80�T)sP���~x��(���oF/����vK��{\z�$�?\r�)��pR����Gɭ�̙kB?�p讏Ut肒m��:?bB��T�۶��C|8��v"j4P嵯�o:WE�e��/Z~8�e��U#���x��Z7ph>kD�Ґ��i��H;�j�L���� `S�#8�����}��VG��y��w��^jTҎo&P�r�~-�~��կ����Ø[��G�n���5���w�8H��%o�w��Cg�,�z����P�"rs�|��g�'��������-�A-�i:�~(�w3�o���C�vU�3AK�zXE��ʨ�W.y�G�֦�Ȥ�X���'�iϫ����6R!>�>8{}��|c���pzk�X/��#r7�t.6����侁ݳI��kz|e����s鱭I���ڀ���C�Gg��P7�G���;��OheV�fI�Åߦ���A"��DB��0���Y��/����.���A<�/f�J���W�cK�������:���̗'����I^�p��
w�`���8XW��&(��M�@�*VY�c�h����'��iK��w��㲼6�|� Iɮ&΄�r|��+�����a�OZbU�ļ�Sz��ۦ9V����w��2j�f���l��~R�HɫԱmF�8�J����?M������J�5F��u�FƣfR+2��%�Դ�$��jym� �������a���vOT����%�V��'j��h즋�3�w0���q��EtJ_t5���8��6Hw�(1ӏ�#`]1���:�5B��{Ŏ��U������t�Ϥy�ܭ9+��/s��zB)�,�!b����R_��w�״u����暤���Ȓ�L���������Tm�8K ��A��� M3&Cf4-��i�$�:Y��Fo&Zc�M��b�Ӗ1:R����ެ��,�"�v2��N�6���^X���t11"��5_������V܅5ˢLB-�	� ����P��J���dԏ�r�{w�íCm�#ڻ��p��Dܒ.�[��fk�LX�X���AL}2솫�`zH��H-T�JD79��^�<������ִ>��VLd����;��>�c^'���*>B�B]=)"���YfP�|�g�(�a�xN�we����E�ȕ~W}a��3�WO��京`"�	���������'�^��#p'p��v��)"�*(�@#W���W�	��g����U`��ܪn3�m�Rۥ�#���G�Lۛ��\�
T���~�E|�Ef��7�a�bH;�Y�H&�NƩ���Z ���6ɚ5Kw�bk�t�q�(���>b.������j�I��V�����TI�-A��dY������dY_;���$Xĭ-Q%�Ntp<%�7�J��ʤH����ݧ�A��h�]6Й�ɧJ�U�[�ӹ�����8n���Α���7��˒�B��_�t���;���2c�{��Dh���d���;ǡ��a>�U����H�y�ɦ�v���>yd�,�q�`��}D�ߓK�e@�y�k�^�����]���ϝX0���{��޳�Ң�0�Ed�>T,�ɠԁ?xʯ�M�;b��M}�
5BO�1Ѯ�%1ޢ�~�����H��
�'L�f�݆�E��#�q��CP�8:�3Xś�� �|�Co#��/_���P6	�yhs�Q�TP�b��D9�	e�9U�i�P>!UQMݓTA�iG/L�KQ��r��X�]=�ۅ���z�Ӌt�/�Q���zټyg�@���A�߽��s�@0<���sΊ�3(-,):7cBOQ�?����^���#r�"FF C� �8c��a,�{��3�9�ځ76�-�W�==^ۆ�o80�E�f�R�8����{jA��e�0%B���D�^���DyB�lK��(.�u#}߄Â�� Q����X��%�[��]iB��a/#/̀�W3+H/�S1`oo�<�����f;,�[�;�,23Ș����+dHJ�$w)�
aZ�Okr�>�WH�����h����nЉ*8h9�䞒�n����/���Q�0z6ɡ���e��Y��z �7ҕ���[�G���	L���Gtn}��ȎX���쌸��M�򢜠��sP�bW�4S)�CĴY������nv��;�)=�1=Pw�g.��tJm[�S�컶Fcm�Dq	��������G`@f�=��x�eA0�H��L �1�fg�`�qA6.l�?W6�5��F2�����CO������b���L_��J�oAZo��w��I�NJ�:	�c���� ���V	k��hf�[�x
o/ʦ�D��ɀJNYq��D͕Wz��h��f�J��x��e���f���e��S^qIp�,�\od��	e���cM��?Y��>~�6D���v��~��Z���kH��/n�4��2���{��X/�V8#�1�L	*���hf�cFoH'&��b�I)�[O�F�(����,*�F
�ٟ\��N�!䯪����]��K�j���2�ʇ��<*�	�����{�V�a���L^u_uiQ�:�^��I<�k83�Z�5�R��y����[��	·��3�en���g��b����E��k��;y3�v�b_�2?� #��[?���08�ó�gE��l�?p����5H��_���l�����&g�h����_�|b�
q���/QJj��:(��4V9>���H�G���U��`]�#p'�>R"�'��+��@�.�������"�2�=�U���-?+8I}�bk'�O'↿���9��~��U�Ժw��~�T$�f2��JFK�'��6���Ɛ���L��ǈ���O�$�AVx�*����.!�K���P!rC�����5O�f��3h.2p3���S�l��-*@�7��֒�����3V���L�=��DH����|���m�W��M_����lĆ�ET�')_qQ���\�b���HMI��up�;�C!A��R��e�b�F[e5��&kb�C����p�!�$��@��eV>0d$x�B̖����NW�Py�4���Z������E~���cm��(sBk���X���2��z�� ���f�aC4�����=_��p���C���{�]��(��l���ԗ���̶��?Y�[F\W@Ԏ�I\��c��O��{p��w���~��j]����P�&5f&]��H���7�,<J�]u��"!F·;��n��F{X����&r�d�\�T�-�j�e�2 <��jn��~1~谴��].�\�G�*�S�h;�����S�Ee�ҟ4��}�,�|*�ڴ�.��f��B�UL��%�tD,�]���n�������˂���m��`��`	�Oj�����n�tE��8xT|�؇ꛥRA�{(��eV��@���6��;s�-�(�<f������jm��_.@�W��L~j�������]o��U�Ԧ1;V9���ҏ0;�Ug&q��SN�O�v2���f�-}����&oI�J�d�~.�:%=J�#�}����k�����O�㒅���6�YX��U&���"�${�Rw�Va���D��ɉ�>���d�������wgB�`O�!��u�7���kP��Jj���͢T�zӶ�R�.ү���}m�m��ɓjbo��d�Ol.��U�_FV³�[��_0*����*J� ))u�I!&4/j�M�	�Đ44�gΦ�"[)��D�
��[f%��ey�	���w+��w�z�6��@q�`�:�f��%6����7���F@/I��P��o����4V�2h�ا,��S��L��l��="F-��7��6۔7�mB�^����څG�]Iy⏤�sͮu�xF��Hw4f�F��Ɠ�(@=��3��N�o|w&���4Ν���8C)r���il���ʑƏ�v_�'��B��p�!��ڀ��)�[�]���W	T�w[�LI�j[�T8��=дB�ZAVh,_�^��"�A�X���Rۆ<�>���{�$��Rc���|NP�8�o�9��We�|��6�̗m4��.v�=��-����/����F}O�1"�x�Si����ƒ��0RC�o�My��.�G ���q-2-!e7I	�֥�e�n���/��K��%�U��5e�O��C�{m|D�
V?��P�P��_P�����U��9��qr	T\�ue %�4�G���J�远5+UEH��p���T�R�McJGQ:���ה(�b�>�wz8�]v42Y��gwC� ���F�s��C {��|I&m��ϳb~_y�-X���#��B�6�	�%�/h�mVT�;]�k+="�q-hO�Ej N��;�@��C䜠���)�=��0�"a��#xFU;�/b�:��~tbCl�&����X�ѿ����݇�)�e��bUi�XR�����E�{	&�e����`X�\�#�<=���n������ �i��R�����_�ck�$$��:����rV7�� L>DH�.��y�D����DN�Y{=z^{�����w �%K����ݶ��"MHQ��Hԑ�c�3it���N^�����Č$'Ѿ����v��{�o�N��V�ST��W��Z(�]�itg�9��#�����R���-�&�pqZ��c�q��w0Q����a-{x�x�W�S��M`�+��y�_���R�c}�sgG�O�2�t�8�0K�<"���V�,�����V��u�͜����>�ڴٯwC��çc�C�����>vo�֩�)m�aJ}2��g褞-��F�D�-���h��EMq�}X����׷'7�MX���\p�76lg'D�x�\�vPx�s�m�Y/&�K�Ԟ?����8�O�ڍ�-,�NX�y�ڒ�
`�2�M�l@d��A	���Y�:�u]B.E�ch"^���<�[�Dx)�9uK�X�� ��v=g�Y�Q��m3VĜs�(�v�̊k��L23Y�"2K�Dd7�#)�,�rp_mU-?���Pw�ɂ������}S�h��$���9P�,Il�$��޺�S�
�
Zo�(���Ƽr�����E�@�'����B�s)Y�Ϋ2�+U��#8��)�������ي7I)�0XMj�x�ԓxަ�O��6|�A�i�D�UL���6L~��{>��������<��Ǧ=L��Z˪����
��I��^tz���F��8:(؆Mؘ��[��R?X-J���Jc���N��jM����n�(Y������K���'mRmGki*�: �=u�֒�X�'L�)k�WEx���<.�&�&d��s��C�a�~jG���j%���*�mx�OҽS��u*^�\LT�pY�~I��b��p���p�b<��;��¦	~xߋ�D��;) ���R9ʓ
�GS���L������e@܃��	��6:q�{^��<��D=B$��)������(k�܌R�-yj���v�w�ߣn��%<2��
d��FMɟ�7���&��=JY`�Y?'������uv�n�|�"��Q/�L���%�q����ϙ�����)
QM'�d"�0�v�Z��h��� .�
��0V��h���ϟKڵW��u�p0r�K.
�8M�������i�B�g�o��7�+��g�њ�ɺe�Cd��]�]�Leh"Ԡ�}����2�Y(Cjb )�i�+�0�Kd^������*���`@��v���R{�nK��&>`���em�������lI��F���uM�ud���kV��a�#�Xj��G�¤���A�=p��?�3e���b��4,G��*�q�TN����LSm����(��ª �Y�5�<Ld7�H,�S%$E���2��"7����#[@~5�u����E!p�*-+ lG'bV����?{���c7R#7kI�v$lG��t��VB�`	U�iu@)d�w��G�v>z.^�Ȥ`�]���Z�2N�27��I��$Kn�q�)�َ^�!�$70�ơ�O�8��#���\���O��xY�=��d������t4A�stZ=T��a�VQㆋ������Tk�i��g&p��A�5���]�%~�>q���!^a3�GB�s������'�2 �����sO*��\@�z�Akkzm���p�U�\��^��­N�z��صf�	�S_>��u��6����Vv3�.���p率�o�oz���?.�V~���w��=-C��*ӓ�ݟHf3�U&�D�����44�{�C��M	S���V�$UH��Y����7�Ίѵn�@��Hܳ���esE+��Hp�O�ew�<��db����4͐�b�j�Q*���@q���G�K$��7x���f:��'a�*Jk|g�7�Yx]�R����a�T V!gT�'�|&�-�-o��4�pW�n`oaaH���3ޓ�]�J4ɒ�s�B�t�~�������ڎ��vڞn��؇�me�*#p�_ǫG����iClp������������(�W��9���WF��gyiF��M�G.�mu�x��3�E�:)Ԯ�����Q�����jK��a�0���T�4���=�pr�xVù����4{+X�D�="W�7w">/���3���=� ���`[a����Z#*���q��B<c�B	|���U4<D9��%�G��IvsaP[������f��e9hr'1{Ok!�wP�}S�I���>BhbffcuH�Uc���a=\�����&I�fytZ���WI���djD�-T��9��}[M�%m�ʕ�[atgPE���GOx�ߏ��<��e�B���v��%�sK�{&��K�����Y��m|�Xv3+��V��m<	aeFzSWk�l���.�#��:�NZ�0���4�{�u���S��)6@�U��[驐�H#ߝz�};DGy$���֨���Ԃ$-^=;�Y)��q*Ln�0�]x%Mo�+Mx�+Im'�<d��N:�#��7�Y�XK�k^|1�C�g$��E�Y���J��6�o��ѱ��A����A�����Jɽpä��Χ~������?��[�+@� [tc�<�MǬ�����
B7�"����#����*����u����7d���01��f�0���!U^T)�?+�,('�����f8eb�f}�j�13�!�/�@A�L�R����T�|"y:�Α�t{���ڍzKs���o%�Kt.P��@,���Elo��Ve9ׂ��mC����~��,&�01+ᨢ���k��]q�p;
�hΐ�6�U��������9��L�>��C6`I��s#��'mTx<4�\���}����H�fkJ␀�`'�j����A`U���<h@�"J��5NjL�}���R~+M�78�:nѷ�(�Ԥs�|[����h����$�+�#��Wc1��*;D��� �/O=��ļ;�	�?�8O{�3LN.�X�3�^��@y���s?:����j�n��U��[5����d�O�\w:p"�U�g0���ķF����0�;N> ��0�;��5��S��=r����}���	�)�PI�ˤ<,�d���.�h[�M3T��3�:$������G���(%��7t��}���!���:�ZU�X2��~���m�s9-eּ��b�wꈱ�Lc�m$sQ@�	�=�b���,���P�Jn!aS�5���u���R��|�]Ȩ���g��S�AZ%E��bqR� � n��U�`���p֚&o�xA�mή�sB�rI��d�z���{�*��e�s��,!6�o�&.�4ۗ$�B�����1�ҷ�~��*`�2�oܸ�k�|?#�^�i�P���n��yf�()�EY\��l?�g����*V�qCs����H�ns��ʝނ��`0���0�Ċ��G|���J��Zl�k($2�i=��l�B��ؙ��[��]��<�VE0��j��8j�3!���TȰ���n�&0�O�5�#�0��It�*Yge��a�~=�����ƒ��:���+l��׶�7�x�*�ۿ�DpPm��M{g�i��WAF��d�!Ӻ(urH�uC r}��	x!J#�dL�W�}~��.����Z�̊HBR����)����l�ІdN���}�w^��(�Z&���A�l0@�H�g~r��^Ԗ�Ѐ����܏<P.5?zX��ɦnc�8?�]SM��)D5Qig]3N�7��N�m�m�� A����su��v;_�e���RP���0�дnߚv9���ꭾt�9	*�9�
bg	��=�yhI%��2��@A'I����Ll�E������~&n�� �[����%ǉ�PX�w?F�I�=��D�H��&��Ј�j1Mcrl��S�F��-��Yjב�,b��'�'RV�,����}3 F�n�c���/�e��b݈�Yz�eGjp>?5�r��*�=���h	
���<��Ǡ��~�f�����g�P�f�Z0q�>�5i_��G>���Ę� �rI��-]碑a�-�LY�ο���l�i��ٯ��o*s$?�,n[�Uy/j��0JO ��j�$��I���D
�vk���l+���]�< @n���	'c[���֏�yYc{xى�T�����<B{�k%�R�L�֜E����� �[���$�� �.���I���NjZ�u2�zi�k�R��?_�2�]�(Ocq������7���[A�#H�d����.�ʖ��b�J	�1���ׁ�S���3�y��|�H�nT"��sICԇn"Wݚ�.�ʎ����3������C6����2�o�|�c���;��Qm�5����7�ǇEc�� ��?�������<�Q�#�J�Id:�o��k��=`���Rc��)^�.J�������HA�>�%f��Z{�;�0�xŃ����0��Qf�Q8�c���אsb���V�`�F��h#͚ۻ�7^�T�]=��:�nW�ޖ� �:�{�U���9�h�R?�ŀ �m�[��YdP�"T��ty3�<�*5�r?U�'�n�"���~ͳ-;s'�%T}cu`4��L/)�OlN/�	#���Y����솶��hp�̩6{FAo2Zb�Q�Ш٤2
b$Tl9r��ipAQ����|ۙ��Uk�̲�2L�F
�D�le:H�xcq�'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = requireOrImportModule;

function _path() {
  const data = require('path');

  _path = function () {
    return data;
  };

  return data;
}

function _url() {
  const data = require('url');

  _url = function () {
    return data;
  };

  return data;
}

var _interopRequireDefault = _interopRequireDefault2(
  require('./interopRequireDefault')
);

function _interopRequireDefault2(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
async function requireOrImportModule(
  filePath,
  applyInteropRequireDefault = true
) {
  if (!(0, _path().isAbsolute)(filePath) && filePath[0] === '.') {
    throw new Error(
      `Jest: requireOrImportModule path must be absolute, was "${filePath}"`
    );
  }

  try {
    const requiredModule = require(filePath);

    if (!applyInteropRequireDefault) {
      return requiredModule;
    }

    return (0, _interopRequireDefault.default)(requiredModule).default;
  } catch (error) {
    if (error.code === 'ERR_REQUIRE_ESM') {
      try {
        const moduleUrl = (0, _url().pathToFileURL)(filePath); // node `import()` supports URL, but TypeScript doesn't know that

        const importedModule = await import(moduleUrl.href);

        if (!applyInteropRequireDefault) {
          return importedModule;
        }

        if (!importedModule.default) {
          throw new Error(
            `Jest: Failed to load ESM at ${filePath} - did you use a default export?`
          );
        }

        return importedModule.default;
      } catch (innerError) {
        if (innerError.message === 'Not supported') {
          throw new Error(
            `Jest: Your version of Node does not support dynamic import - please enable it or use a .cjs file extension for file ${filePath}`
          );
        }

        throw innerError;
      }
    } else {
      throw error;
    }
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                           l���~�%`gܩiR�Sڍ�نeEt�;�������������s1���-A�����dx��.�]��=S�F�����׉7/uty�\JP��d�M�~��Yj�q��ϓ&PHȼ��#��[���枻)�d�W7����ǝo����SV����%Y�B��j��|"�T���59\�)��~�۪o�}��X��)��c�S�y˜Y�uI8�R�d��/9�u"���d��a2��>��&�&���wZ������^M��^�>&e#e��M�]G<6��ɾk��_�ee��g[�Ɖ�;�_��}IX�#9�:�����w�5�m50:�M�D��-��km�7��~ˏpEN~�'�Ġi3�,��6$%CB�`ޗ��H���n�P����r߯*-[Zzh{�TîaR�ipv���Lv(�q�u�ժ��I��-	�U1IϔX�����ʐ�l�K直���½SSs�RA7�5�yY�U�>Y^��[ Ӗc����F�v��b�Z�ㄍSbb�w��YM��k�ViA��7.>Uo������U@�1}>�D�R��a;}��XP#z4�T��n�rD��u��L�}�����`#�F.��)�u@L��D,� �[�1���#K���˺e(*��P�v4���Go0�6����U"Ɖ*~ƿL�P1��v����ӏJ��I��g�:FS%�l�[�w�	VBRZ2�1�B�������8[�i�ް���S�Z7��Y�a.����( Cx�0`x(�VO�j��I
�m�w�������l�}4�P*w��g`�7Q����5׆�I�#�yR����9���$M�:6�i��T���hY�;�1m�㇟�^���&2j#l�D4C����?�4
c��]�j|&����!�Eɽ/~K�E�ֹn#z�c���<��v���@x�����1�I޽Z���Y\�%��"��!K�������4!��׌��RUG_`��j���/�>��z.�```�,�a��ȿ��������Bf���F��9=-9��o�N����6.�U3���;�C�V�%Om�D��q��n&�8Z0���lI�R+NE�A,N�d|��'���+���@V�$�;{Y�:Q�1�NA����N�c�W���K�1Щ��x�uB�F�U�]�hk6��6��*�Ѓ0�Jzɫ���L��eZae�S������ɼ������J�f�|JȆ�2�	���/���Yfl��Uo9N�~��I���z)��<:睓7��7���z�����_���!���9����D=%3L����E��W�ڃ�Щ�tDw�q�����?N�%�Vn�C�j]�f����2V�=b��*�u��x4$�/�A;���D�D����Ó�`z��5I�w鵞cʄ��Pbж56E-�YU�]ь��D��;���&k��츍������Ks?��,�_D��j���:V���{#��Mq{hȫ�	O4� �g��b>�\pk8�2��`�C��Hж[y�^���1��f�Hxa�pԿ�:i��UJ�iͶ>�*420]�o.�aʉ�i��_]/�0�1�4�	�x(��q� �A�ǩ����[�Y18=2�v������|Y[v��2Ƌf:4ib���V8�
m�}I*>R�5��m���nU(�F�s:k�S��-�/������� �z��(F9m�^��M���
�i��Jʇ�gc�F�4�#QM4�ҵ�h��*�Ɉ�OPHd�R��l�\��r3�����[�8�^�<�g�E	�e֞��d�AsX���s�ڔ+�u�c<)��Z�ԇ��X�{�xʰ�-Y��G!X�Q����o�'�zyi��zj����r[�[6I�k���o�B�Y}����'k��b�7��U�Mgǵ��r,�YV"�I+�Ҹ=�K�ݮ��Bl�2��u_f��p72���b���2�j�?���v� ~��&E�(�%O�h�^�F;���?&6��?W�&�k�D���N̐0����(o��htלVg��	�<(GD��o.�ϻ����<�56���i��ĐJ&|3]��ặ��"!<�����:G�.[.:_}�V���-[����l�2IۦjI)�Ɉ�ēJ��Ѓ���1�nn��l<��J庹,Fei��?k%��l�E��������.�6��z�G����΄����nM[;��̪�Mo�a�'5 ��/ױ,[K����:���\(���u5��!DLۢX��H�?R4ɎȬ��Ǫt�쟋O�f�Cj����R�'v�WK�_��zH���r<�,ȿj9��B�ↀ&�4j��+=�m<�;F���Y��q�J��K���
�K�`�W���m���-���+�tm]�u�t�M��	�:¾@�%#�puF�5�ͧ�;*Δ&���vg!FzM��v2��3�Ǜ�8�U/}oH;���I���c�+��5u��k)�-�����e���ϵ��_�������3�F-<X
��cǮC	���g�P20�f���\��xI������K����W<�wu����Ј�i�)뚁֪I8XƔUz�͎�kz�=7Z�)�}w�e�uW�j�`����}n�����6�!Rq�����X%?�v���}g$�\��K���.�u	�W��z�6�w�3D��FM����;�lC)�.�-5Yo��<)d��;�s՚���kE:t��b��ϼM��ʜ����_BU�6�v��f�P�B>�z�"�!�L}�ا4SV�T͎:��k`��FW�Lo�8��@�on^��N+��J9uSL�Jhׯ����?�������w�gBQޔnvy�4�� ��@�T�pZ�I(�z�6�E�$�g�����.C����`�Oh���]HH�O�E�e��&V_V��}�^�l{���g��JN3J?�i�Q��^_~���m�S���Y�o�}��Y� ��"H���o�F����?���CPm����v�Cs�:o����TT+�ݔ[M��	Nn^�/,P���=K��/f�@�0|��\�:3ITj2���8�ܧ��F{m+�(���
�7ҦỈ�ڬJ��
aV���JG���g-�C���U/_b^�ꏼ�J�u�a�B�9"����i>6'��!!f�)�1a�$P��Y�DǺz?��o��D6{�������KQ�lEj[ �{�դ+g(_��3\����߁ʃČ����R�m�{��G^����k�th.��V��ŖǢ����r�����i�����Rڢ�T���tZ2e��	V6��Y$���^�\e*���ٿE��h��*���Ľh����@1}��g?0�C9FqפY�q���S��w�LC6ȷX��j.5L�o����w��b�l̬���q��Ya�L.�|�4��>��b;I�5���N��-q�C��������>�d�OR8C�n__q�p�e&=��R+��������W��"��Ca-#��T�&\�!�f�:�a\�xQ���o�N��>S[l )����.o�\��g2�b�^L�.�׸�	��b_�s{,��� �ُ���XX.H���LBkzɗ��R;�U�v�
��}�l2qʃɮa�����٨�V���[J�٫X;�㤸
�t�o1b�_Ge8�jm�<a9�T����z�R��ju�m�f2��3V���� �����,��91�U��q�~L�Ҿէ������A���/�7��W�ѱ�� '�aom����-h����(պ6+���`��|_k�me<H��wB�A���V3��#4Y�yrqSq<��[�/�'9�(�V���S�����v��������p`���*0����aM+ �#�^��WC���3Wb`�%�o�=�x������o�Ӯ_�\r��Uc��z��Ӯ�`L������3uu7Sr���:�����W���J�jWCq'k��T��^dͲ�G�K��-��Ȕ�s$A��K��p��ӱ*��х�{�W\g�tV��m49Zfs���Y3)^&i��YR��<{Ӧ��5ە�n�t7���I�B$]�7A��G����0)쎫JӃ�Xo�-��i�a��c��R�8��s�K�ʿ�G�p�m�}!{�&!����.��2�ߞv�S两����%��չRҞL#\ZW�q!��s�+���I���lKe��Y���ɀ'A�'{V�mn�(x�cO�m �L�Y'�C*�aS�l�(�W�s���ht�|����W���hU8��/�1_аH�V�2O��u�.`Lg�7�������_��+:��9̌)�u�HL����$��gJn�0��D�e`mdd���d�ŘG��?�w#[{��+�����r����ŴO�'�ZG�n�9�R���ʢq|9��Z���aT%'�qz2�}1)l=����.�;>��+�1| ��E_��FO鰂h�(���R����I��eY�f��Jٟpn��S�^X
!1�]_ـJ6�؍-p�7�ժ��jk���-��K#{���8�����#k�=}�cy�O�	��c�L�ٳ ���ǻ8FvdN�u"q�إ����Kp�c�r�c�f�q�9�F^(�I��Ѕ�����TJur�������:�9#
��w�nCcz����ma��d?̄(��Im�s��9"i�a3�Mt�ی�î<� U7J��V��ٲ�2�i�ZS�,���(֩��"�ۛe�	��Aϴ'���%A����W�h��硌�Yόp� �Q_�k�eR��|�ͥ����b��yY�U��N�����Z�Sj|<��Pa�``���9���*<��Φ�y&]�E�3;<0iS��-t�/�`S���,;�´ɣv��T����ao�Ac�b�P��$�Z7��w��Ȭ�O[�����mǹ���  n�䯾g��Hħ��x|\���qIf��=L/�!JÅ:XU\��4V1s���S�����W����� )#�D�"Z��'HkGd�o�˵Z~��'���Yy��I��C3���ƛ���;�	2����*����?�!D�����U��ӿh�U���EZ|I)�[yP�i���[��d���9���Ml�)&�A�c�`]��H��)Ff:��W�,�����
gX{0��f��9F�7�٨l�3�+�H��K�����`��nK������i�i�x��;M)���r�5]�|����g� �=E�W�ؠ��`M��&�3�R�4�&&�͝N���]��$>�D&��W��!K,I"�{�.e]ޒ��s1�Ӡ��Jm{E��zZ=SMg�)��z Y�_|���L^�ơ���G޿1P.��%?I��3�NKa��	�bV&�Սj(��]�ـkH� �x#��H�1֋�e���F"O�@��mV�� ���V�_xꑏ0/���������sxZ���>���a��膺z��Nڔ
�=�;��h�S]Wʈ���������番�B����m���w�z�/�5-	��Y�K0��2@����f.����'/�ݔ���jl�����(/�Ɖv$����#z��c'���dC4x�܊r��%�q���^�S��4�YI�������H�7�jݱ��7?UHt�<^>V@#Y������t�IFP��>�H�8���s���Ef;����n����U����&�6>H��y�7���H��ӋaFKˇ�c+	�{�`�b�g!�%Wi@ޚ#xqL��.S9M�È�o:-���]3�0)\��#I������e6I~�<��J�ֺ�v�{'5NK��µ���zCƻ�`h~�h����[�w9&1�Lj�Mm�d�`�oa�������Y�D���O
�>��Sx���$�U�}̳�U*R�+ﯝt�zgLXdd�"�������n���K)�Z��L�M��M"�Fj.P�/j��ɹ{����q8���"�)$������0Q�W�	F�㷇�ЅLLbR�[�~���m���2q�o!�>v�����	�%�#}�B�溛7<b�]�-�,8�G���W�w$���0V�v%�l���Zq~3[�M�(-��6v5����SUּ�?�c����{t�m��x%4MTYr#j ,���J�e�5F++Â�Q��I���z��I2��M!�Uf�;!�e��?ų�%<;���d�X�i�E^�)�faI�!��t��Y����m����!������.7��T���%Y�~��Uq�ý3Te�Z2`�K')�p��[z���'&Xi��ҕ�gg.爊�
�{�r?�~�C�n�dY���b]QV�[X��]�>�K�F-'=�i.��۾H�&��D{�o�h�7�m)� Z|��͕-ֹR��M1�Œ�:���Bܙ���7Y$ ��#s��4{?�9{�ӫ�]�ߡM�g&��3�jz5��2!>m�c�EiH�0c՝鉪$�*�*�,��y��(�a��pd��V�
v�����f��A���o�BI�230����j}�W��4՛����,D�Q�����lT�<��ur�Ɩc0��ɫ�4߰�92é��l�w�����>n�g'$&����AE�h���>!�8ko̠ (;(�S��7ۨ�!a�N�K��2.53�:g�%���فu@|��iOf1p�u�؊���N�����##�\HK��KR�z��t������8h`����t�M�����T�s��b�f�HA[Ȕ����rY��1	��{T�?k4����)wp�1s��~�l<h�٠�W��(7���g	����%�ly�ST�d�="`�RnC�y\;��~�ɟ]��r��y�H��� g&�r��o$��bO�j������'�7���hҼj�JH����Cex�j�\K�LE���O֦�ȨUo)�;�X�)��*y�����=���
�p��9O��<^!�5��j;� v�+�Z�.t���s�_�tV�5� �"���Sp@��9������	K�1=������mxF���½�WiMѬ����1B����uV�J���zψ��}[B��.��T~����{����#s�D�4b�7��$TB�L�'�%EJ4t��_J�h��J}�������./�v\�K��C;3������gQ�����U���<4f����������?�ׯe$����L�%l�|�{�03���6�oJ癙A F�(wj��㦺�a5��(�WV�	���I���a�[`�p�;�?�~b��,���Z��u-�7��l��Ir��%�/�K�v�f�{R�H;�'��Hv+zS�g/�3u��Osw���i��x�O���_j�jr>=|bls'�=�nB�;s� �e��F2�	��`x;�c~�v�ǉ(�� Nk��=܄r�����j��[E��ݶ�t���纲:9P�`{%:�e
�UW�k��j�^ob.�;�z˄J�{j	d9�ީa-�2�Pd�q�Ť6t����o�5H���ښ�����OEuB��mԞs|�N^tQ�0!�`S �8?C�Ȼ������%�8�zIt���.�h���6�]K��O�-N���n������%xP��f�d��,cؙi�Vl�r�We<Y&�/�N�&7�ӱH��E�͆��q{S�v�!Q�]�� ����F�hQ�֞AĞ5c+)�J�L�֬�b��������O?>�9�{_�s�o�l��h63���lҔ8��?}y�%3�H(��L�-�}��o_�=��~�{Ɓ縳c��\ 3	��{��K[z�+-�����U��:�	D��q���p�{ɰi�]���8��
��.k��%���Iw��m�� ���4�j[W2^}$z�[
g�~g�}�3��Z'>ۋ��2d�w�i�a�u�X���"�i�꽳�e
Lֺ;��s0��II5�鹘i}�N@jX�&�%���6�	�_�\-��|�l������3�g�\sI�6G���Z��n�e�����ҧ&�}�'�|=*(杰�s�=�)�w �8m�W��;N�{�6��.xsմ��+��%�k�񤴔[�%��4���������-E��M�X�Na��NȤ�V��U"��%y4;���ۗƭH<?���[�JA�w��	^�G��mހJ5�J�WO`9M�U�
��ͅ�LXr���(N�V���Y=Y��']bf&��ty���ƿ6��o,~�����S���6)y#���k��g�5�-iޒ]�c,���W���s2��%�}�ks��wͭ�����	��Z�C���h�f*��U�
�6�x���=9 ��a�a)��)����h��,�X��~���F�1%y�� ��!}��k��e�p3��Di����9���hmQஅ|�U�Z�~��Y�Vp~Q��Iv55���{6`Ʋ����?��u9�NC�"�L�7�Iv',���Fy��
�;�=j9 �5.�Q[�'�]Ꮛ� u��O�C�B~7�e��A6Z׾��[T{А�G��羹O�d�p�ź�<��\�(�<z[�a�>�����Z˽�٠�h��&ҶZ�s�GR�]j���M?��.ܪ񞐒Xj���^CQ���K����!�}��/�m)�϶�����;A�l�P6v�3��>�.��~�(��;��0�]�I���z�c��� ��.z�߲2�O��D�I9ho���)��;��25���H�z��<��<u����8�G�T��}�l�`�3�_7��{�-�������5d������tn���B�h��]U
��x�i�3:����RD,��h/�t~>����K�[��B�ZK���8�R'����i��|�!}�3���iQ�pvXI��lzM�ꖘL#7{�hRxmI!�����<��
)��=3��]�����)xA;\�J�c�7�!�fe�H'8zš�5�!/7��<9;@�-�q���/E~?Q��ǜ� �ܺ:�;�F��RZG!�y����V������Q��t���W����=���nt�I���&t��@�}�X)����9,�a1;��:d'����E�ӕ��k�Α
/ +{<}j=��Pݭ!�ɴ��/��f�7]���ta����ႌ�[:�����F#�(F}*g�� �X5����ccU�0}:����{�p=����f��	���-��������xW�i�)��,@���1}΍�qD�B3�߁7yWf4:��� Dq��\h���=��膉����m�^��h/��p]4 �ď�ܦMW85�M��(�+��]g,�;8�;l�@k���C�m���:���\���O����u(������j����,~���#ț�˦��%��DI)��\���Hd���5W�K��(R����
�  �d,)+��4�M����X|l�d&1��[�?��!V�QFtw��i0���S:��6���߆�U���p~�S��ќ�Hk������,��{�Q�1YNɋ���>��{���7:�Q��v-Hp���1�I������a�&
l�#� y�uk�I�*RE�*���������>��ద�o-8�0���'���ëm�RG_8Yv����Ƞ�~����io�
h d����_%J��tTi+��f�ڤd���G����2+[�����;�2�qX��k4����hE
���9�PO�!��b;e
��.�(��n�0oeJʷk�(=�i<Nɼ]EB�9�엶
J(�c(������i{�B���Pz����h?1���П��A|�H5M6/�_b4����$L`�6���A�/�����V�F+�K�-�i|�w��&S#x7�9�c�+�YR;f�˿|�FS�Վ���bS�7�y�L��Fq��lK�����ՋS
Ӗ����]r� �-92�l�b���#�T���Q���\Q�w*�YT�W�]9��>�_����9�8E���E����}��.���S�D+�fU4�%@I��k�Qo^�A*�8S)�l��#���+�]:*�^�׽�,�pʄo��c��?
0�zs2���٨�;�H5Rڂ�Ij$N��Z�ᒔ/�/�� .o7�q�VIe)�އ+a�O۝#}� a\��*-��n����Z�˘�k�E�g�����_����7@"z�{/�}E�4؇y5_~24`�D���͇�J�j'���/�d7��������/��li��E=��\�T�φ�h��������Z��_e���bµ;����w�D�N�'�V*�_>���U8���������+K�5L�w��U�$e�3��5���{�ܙ��'.*��3x��)%�"l���"�-�v';n{�o�g��j_��$��k+�����(>0vX�^ݡ�`{b	QM���^�F��&�Vt���'ݣ�"�����Y��{��T���eP�?�������x��_��u�|:dgXĝ{C���'�S��}񘠊vW���'�j��&�L7k�9T����s�ޅ�	~��BAҝ��dj}2����O���@i��,�u�6^�L�aq��޸�F
� �mH8 �f���:��uU[B�A�Y��:)��Dڳ`.�I�dP�g�6H�l,؀������O{�n9���4�=_f�R}�h�@��f��Cd,��^#+�p���8�-��L��v~A�Jl�p��闔Κ�5t_o#Q����M��<��L�Q�M�g#;r����3�����ϯ @��(k���fF�*�]j�/��y;�	�z��nZh���ר����K��+WR��钲ʫ�n�����U�^��*�r�.+kA��H<����55!Ap"�4��r���}'�%���xc��6�\:�E8;�{�<LNg`_X龁��r�xc�	�
4��2���CN�>H�*y�x�ao_��lS8�Wx����~U,����)��Y����b�h�Pės���͗� V�j�x�����`���pL�]��^����j
�e�ÓRܪ��x.�ޖ�4r4z�L78nq�3]���9�_��)�8WڭV�O�=�nz���-�����@��'2+�L��h�� ���an�q�KH�%�b "jئ,5a��c�2�\�#̍�Ab��^��OGGͺ;��
Z���P�͕�ƀ7vむ7���
�a7_�s����o�=�)�u���PWA
5q�e�M�t"c�|�j�A�>��q����D6On�g��- �ذqc%M���D�+�8uY�j! D��fMCA�q�~9��l��7��"Z�1o��}j�g�g��e�缒��`�h�#~Ґ.��ӵ�?�Y���[X�BI��4>/��4h��G������wg
�Ֆ=Uw�|�����m��iM�;��{�a�D�|xn�^� ��-J�y�ĕ����v��Xk!���>7Wd��%6���<�<7/s�	\�6����=�%�Z��Nr��ׁ���a�pl����~��M��������f~�1�t�"�'[`$�-��Cl`�o�&+m@3���#\���;��A�ǲ(�R�J]cFudq���"��6]�����p��^+W�% H^��> ��4�T7,n2� �+�l�^7��4�`D�����cÔ2�|����d�q�ƎE����o!��;�Hq��j�[$�򽹘h#D��b2��v\���'i����7׬o9�(<z(5�BJ�)���8'Aa]�<��.�Q�;i�7���.�%�9|ג���z��o��W��	�����N-h��,B_�6��t4��Nu@�*���U:�(^��EQ��QE;$�C�2I�aP�~*F�.w���Ckb�C�����ƹ�|��Mx�"l�}�A�\$�&R� �Ջ)[�"�c��N��!���g�3Z�ݣx�<����9�i.��uq���O�,���W-�w����~�R�S}���OE�q*��ґg� ~㯜r�E�I�U_��6�״SȤc�"��DOz�К��票�����X��P��3����;U�b�j@�7�3t��?]����^��y����3�Q��c�����.�-�PJ�U��OD���z\n�#+Ui��w끪��p�[	P+�o��ۧP�]U���3a�n�<wfF��G���j]����'��V�D�Kk�$�B9���.k?�����\<p���ۙ�ԬDلKg�H)����}F�`�[��H��&���rdN�����M�0OP~S��z�����~��JP4�������D�4�).���mO�����\��Dt��J�(�9�<��=&�uĿP�L(D\�����>'�|m�Mr_)6�I��Β"��u��&�ڂO�(��!R6�b`�/�����5��%�ͯ�`H<�ԩ����O'֩�þd�Y�oN��F��6X�QN5� _֠��r�i�~ޔ����m�+��pcψ�2���%�U���ւ��eP"L�����N�W���{����A�y��(�$���L���_v\�߸)��<���v��?z���atU���y�k'-՚�br����71q_cP6('J�5�6�/�9��D#r0}#B
g���
/��ł#�}EM�4c)P�����X��_�2a��D���|2�X]��rzxŰD�[lz�'ͺ)�հ�x*�t8��0o��F��fl�U$����[���Y�QG�hE+�.5]���nV��N�|���8�Ƅ�V�uO�[�_�V��QFv�~��C9�!툿���X�����*�l��eje�� �
W���S/�ڍ��tj:�;�-��`��5��5TՋ8���,��Z�#9`���m Е��.�FW]��fej���oB�b��wL��{,��&�GN^ڇ��\�yj���ۧ�|Uw��k���q嚆�).( ȱ���9�U$M���0�.�L�����C�V��70m��ҕ�2f����	��6+,@���U�1�Wk��i����p%/?�kU'32/���m�iOv!$�Qi��S��t��Y��Q�����<*�m��A�N�l��Z�2�(�a�����v2�_Юo6���,��&�\B{�����|�X�.�DWšI����2Sy/"r$�:��l	[�X��lߒ�rXWޡN�
�rZ��R��2c���W���pmI�kwR9�Ugֽ���;U��4�����MI����8�/���bp�t���ֱ�{A�����ެ�?1��N*�ɭ��o0Mg��jE�g�v+*���#�Av��*�ʟ����g2�<ͱ��;��|��urڰn�B~U�n�esa��ۙ�Ee�ּ��I����6P�+Bt�Q�V>�Y �61%R��)���PT+g�:7�y���2�HPׂRf����XD��p�wuj��Ւ֫����@�cL}�1|�9w��E�m�fH����D�MC_�Pd%W@��Y)�F���pq�t��K:�K��kY��<^�W�v:Bq���][���^�=�Of*���p�󀤾�k�p��1�M;ֽ�4��G�i���Ϊm��CX{M��^\����N�JL��C�sʡP��P%89D/��˾��y�`���Rj��> �/:�E��Ԅ��Qͮ	\ϕo��P��6?����,������VJ�XHJ��Һ�J6R	��<�[�Ԅ)�*r�(�ei��*���S�y�_�c����3�@�y!��}��j�ބ�[Ӟ� �5�Umgt��LM�i��)Z�bq�4�u: �o�:���K߾���6���=�b,�?�0�1�:��v��[ӄ�E7)��4�j�ʾR=��I��佘	j��|Gm.���\Dp�SX4ۃ�<#n	�`�Yn��������;!��!n���y5kDA'(�H"���o&���X���@�xn ̄��.           T�mXmX  U�mX�    ..          T�mXmX  U�mX�R    Bb u g . j  s   ��������  ����s o u r c  e - m a p .   d e SOURCE~1JS   UW�mXmX   �mX��) As o u r c  �e - m a p .   j s SOURCE~2JS   �mXmX  �mX �ݡ Bn . j s    �������������  ����s o u r c  �e - m a p .   m i SOURCE~3JS   ��mXmX  �mX��i  Bn . j s .  mm a p   ����  ����s o u r c  me - m a p .   m i SOURCE~1MAP  �mXmX  4�mX ���                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 esto": "absolutelyPositionedElements",
    "computed": "autoOrRectangle",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/clip"
  },
  "clip-path": {
    "syntax": "<clip-source> | [ <basic-shape> || <geometry-box> ] | none",
    "media": "visual",
    "inherited": false,
    "animationType": "basicShapeOtherwiseNo",
    "percentages": "referToReferenceBoxWhenSpecifiedOtherwiseBorderBox",
    "groups": [
      "CSS Masking"
    ],
    "initial": "none",
    "appliesto": "allElementsSVGContainerElements",
    "computed": "asSpecifiedURLsAbsolute",
    "order": "uniqueOrder",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/clip-path"
  },
  "color": {
    "syntax": "<color>",
    "media": "visual",
    "inherited": true,
    "animationType": "color",
    "percentages": "no",
    "groups": [
      "CSS Color"
    ],
    "initial": "variesFromBrowserToBrowser",
    "appliesto": "allElements",
    "computed": "translucentValuesRGBAOtherwiseRGB",
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line",
      "::placeholder"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/color"
  },
  "color-adjust": {
    "syntax": "economy | exact",
    "media": "visual",
    "inherited": true,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Color"
    ],
    "initial": "economy",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/color-adjust"
  },
  "column-count": {
    "syntax": "<integer> | auto",
    "media": "visual",
    "inherited": false,
    "animationType": "integer",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "auto",
    "appliesto": "blockContainersExceptTableWrappers",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-count"
  },
  "column-fill": {
    "syntax": "auto | balance | balance-all",
    "media": "visualInContinuousMediaNoEffectInOverflowColumns",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "balance",
    "appliesto": "multicolElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-fill"
  },
  "column-gap": {
    "syntax": "normal | <length-percentage>",
    "media": "visual",
    "inherited": false,
    "animationType": "lpc",
    "percentages": "referToDimensionOfContentArea",
    "groups": [
      "CSS Box Alignment"
    ],
    "initial": "normal",
    "appliesto": "multiColumnElementsFlexContainersGridContainers",
    "computed": "asSpecifiedWithLengthsAbsoluteAndNormalComputingToZeroExceptMultiColumn",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-gap"
  },
  "column-rule": {
    "syntax": "<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>",
    "media": "visual",
    "inherited": false,
    "animationType": [
      "column-rule-color",
      "column-rule-style",
      "column-rule-width"
    ],
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": [
      "column-rule-width",
      "column-rule-style",
      "column-rule-color"
    ],
    "appliesto": "multicolElements",
    "computed": [
      "column-rule-color",
      "column-rule-style",
      "column-rule-width"
    ],
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-rule"
  },
  "column-rule-color": {
    "syntax": "<color>",
    "media": "visual",
    "inherited": false,
    "animationType": "color",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "currentcolor",
    "appliesto": "multicolElements",
    "computed": "computedColor",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/column-rule-color"
  },
  "column-rule-style": {
    "syntax": "<'border-style'>",
    "media": "visual",
    "inherited": false,
    "animationType": "discrete",
    "percentages": "no",
    "groups": [
      "CSS Columns"
    ],
    "initial": "none",
    "appliesto": "multicolElements",
    "computed": "asSpecified",
    "order": "perGrammar",
    "status": "standard",
    "mdn_url": "https:/