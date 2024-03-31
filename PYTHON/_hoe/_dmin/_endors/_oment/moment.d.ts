# URI.js

URI.js is an [RFC 3986](http://www.ietf.org/rfc/rfc3986.txt) compliant, scheme extendable URI parsing/validating/resolving library for all JavaScript environments (browsers, Node.js, etc).
It is also compliant with the IRI ([RFC 3987](http://www.ietf.org/rfc/rfc3987.txt)), IDNA ([RFC 5890](http://www.ietf.org/rfc/rfc5890.txt)), IPv6 Address ([RFC 5952](http://www.ietf.org/rfc/rfc5952.txt)), IPv6 Zone Identifier ([RFC 6874](http://www.ietf.org/rfc/rfc6874.txt)) specifications.

URI.js has an extensive test suite, and works in all (Node.js, web) environments. It weighs in at 6.4kb (gzipped, 17kb deflated).

## API

### Parsing

	URI.parse("uri://user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body");
	//returns:
	//{
	//  scheme : "uri",
	//  userinfo : "user:pass",
	//  host : "example.com",
	//  port : 123,
	//  path : "/one/two.three",
	//  query : "q1=a1&q2=a2",
	//  fragment : "body"
	//}

### Serializing

	URI.serialize({scheme : "http", host : "example.com", fragment : "footer"}) === "http://example.com/#footer"

### Resolving

	URI.resolve("uri://a/b/c/d?q", "../../g") === "uri://a/g"

### Normalizing

	URI.normalize("HTTP://ABC.com:80/%7Esmith/home.html") === "http://abc.com/~smith/home.html"

### Comparison

	URI.equal("example://a/b/c/%7Bfoo%7D", "eXAMPLE://a/./b/../b/%63/%7bfoo%7d") === true

### IP Support

	//IPv4 normalization
	URI.normalize("//192.068.001.000") === "//192.68.1.0"

	//IPv6 normalization
	URI.normalize("//[2001:0:0DB8::0:0001]") === "//[2001:0:db8::1]"

	//IPv6 zone identifier support
	URI.parse("//[2001:db8::7%25en1]");
	//returns:
	//{
	//  host : "2001:db8::7%en1"
	//}

### IRI Support

	//convert IRI to URI
	URI.serialize(URI.parse("http://examplé.org/rosé")) === "http://xn--exampl-gva.org/ros%C3%A9"
	//convert URI to IRI
	URI.serialize(URI.parse("http://xn--exampl-gva.org/ros%C3%A9"), {iri:true}) === "http://examplé.org/rosé"

### Options

All of the above functions can accept an additional options argument that is an object that can contain one or more of the following properties:

*	`scheme` (string)

	Indicates the scheme that the URI should be treated as, overriding the URI's normal scheme parsing behavior.

*	`reference` (string)

	If set to `"suffix"`, it indicates that the URI is in the suffix format, and the validator will use the option's `scheme` property to determine the URI's scheme.

*	`tolerant` (boolean, false)

	If set to `true`, the parser will relax URI resolving rules.

*	`absolutePath` (boolean, false)

	If set to `true`, the serializer will not resolve a relative `path` component.

*	`iri` (boolean, false)

	If set to `true`, the serializer will unescape non-ASCII characters as per [RFC 3987](http://www.ietf.org/rfc/rfc3987.txt).

*	`unicodeSupport` (boolean, false)

	If set to `true`, the parser will unescape non-ASCII characters in the parsed output as per [RFC 3987](http://www.ietf.org/rfc/rfc3987.txt).

*	`domainHost` (boolean, false)

	If set to `true`, the library will treat the `host` component as a domain name, and convert IDNs (International Domain Names) as per [RFC 5891](http://www.ietf.org/rfc/rfc5891.txt).

## Scheme Extendable

URI.js supports inserting custom [scheme](http://en.wikipedia.org/wiki/URI_scheme) dependent processing rules. Currently, URI.js has built in support for the following schemes:

*	http \[[RFC 2616](http://www.ietf.org/rfc/rfc2616.txt)\]
*	https \[[RFC 2818](http://www.ietf.org/rfc/rfc2818.txt)\]
*	ws \[[RFC 6455](http://www.ietf.org/rfc/rfc6455.txt)\]
*	wss \[[RFC 6455](http://www.ietf.org/rfc/rfc6455.txt)\]
*	mailto \[[RFC 6068](http://www.ietf.org/rfc/rfc6068.txt)\]
*	urn \[[RFC 2141](http://www.ietf.org/rfc/rfc2141.txt)\]
*	urn:uuid \[[RFC 4122](http://www.ietf.org/rfc/rfc4122.txt)\]

### HTTP/HTTPS Support

	URI.equal("HTTP://ABC.COM:80", "http://abc.com/") === true
	URI.equal("https://abc.com", "HTTPS://ABC.COM:443/") === true

### WS/WSS Support

	URI.parse("wss://example.com/foo?bar=baz");
	//returns:
	//{
	//	scheme : "wss",
	//	host: "example.com",
	//	resourceName: "/foo?bar=baz",
	//	secure: true,
	//}

	URI.equal("WS://ABC.COM:80/chat#one", "ws://abc.com/chat") === true

### Mailto Support

	URI.parse("mailto:alpha@example.com,bravo@example.com?subject=SUBSCRIBE&body=Sign%20me%20up!");
	//returns:
	//{
	//	scheme : "mailto",
	//	to : ["alpha@example.com", "bravo@example.com"],
	//	subject : "SUBSCRIBE",
	//	body : "Sign me up!"
	//}

	URI.serialize({
		scheme : "mailto",
		to : ["alpha@example.com"],
		subject : "REMOVE",
		body : "Please remove me",
		headers : {
			cc : "charlie@example.com"
		}
	}) === "mailto:alpha@example.com?cc=charlie@example.com&subject=REMOVE&body=Please%20remove%20me"

### URN Support

	URI.parse("urn:example:foo");
	//returns:
	//{
	//	scheme : "urn",
	//	nid : "example",
	//	nss : "foo",
	//}

#### URN UUID Support

	URI.parse("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
	//returns:
	//{
	//	scheme : "urn",
	//	nid : "uuid",
	//	uuid : "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
	//}

## Usage

To load in a browser, use the following tag:

	<script type="text/javascript" src="uri-js/dist/es5/uri.all.min.js"></script>

To load in a CommonJS/Module environment, first install with npm/yarn by running on the command line:

	npm install uri-js
	# OR
	yarn add uri-js

Then, in your code, load it using:

	const URI = require("uri-js");

If you are writing your code in ES6+ (ESNEXT) or TypeScript, you would load it using:

	import * as URI from "uri-js";

Or you can load just what you need using named exports:

	import { parse, serialize, resolve, resolveComponents, normalize, equal, removeDotSegments, pctEncChar, pctDecChars, escapeComponent, unescapeComponent } from "uri-js";

## Breaking changes

### Breaking changes from 3.x

URN parsing has been completely changed to better align with the specification. Scheme is now always `urn`, but has two new properties: `nid` which contains the Namspace Identifier, and `nss` which contains the Namespace Specific String. The `nss` property will be removed by higher order scheme handlers, such as the UUID URN scheme handler.

The UUID of a URN can now be found in the `uuid` property.

### Breaking changes from 2.x

URI validation has been removed as it was slow, exposed a vulnerabilty, and was generally not useful.

### Breaking changes from 1.x

The `errors` array on parsed components is now an `error` string.
                                                                                                                                                                                                                                                >씤F���T�!�2יtǜץ�*�'��m����xj���Z>�YRsa�6=���q)��B9ظO����Y��� y��P�Z�{�����W7�,��r.�v�dǋ�e%_;ݣ��UxD�D�nm�`P��.�.�X�KV��DG��s,rE�hf�P~F��[���٫��%k��ɴ�����ƕ$�m��и	"���kN�T4d�R	J�jU�����3oN��܊�E{�ɺ�m�Z��I�':��T��t@��Q|��e�'	1p΅�S�`�O��\PN�y���Kqc8�%�k��3�3�W���@`�B���
X1~�MB����Q	�N���t]����B��~$�������`N�kuEӆZ���-y��,c{��J	H�!��y���V&�rr�D�)���&y��x���=���Ӽa9�n�,�1K�$A����d㞵Y;��ك)᤟�[��6oK��땡7�(%���f�Z]��4@�D��3�h�z|ƞ���%}�IR�aH���aT�[r��s�r�o|l�}�áUY�-o�
�rkU��D��
eǻoy7j~�@@(�U��n��!tEA,:���H�!��"�%�V`7\ݠ�Iyce1�����*ce�`�u�/	��Ħ��&-ᕉ��5��ױ=��%,
���~~\L�5��A�z~�9~_��jZ��B
��Cw*�P@~���L3~�I)���-��;Ĉ��f�<���E�� ��@�p>}���X{�Q��"ͼ����l%�z�r��9��\�.�9k�U�.pS �G��$��Sc��f	�x���T�A@��`:1b�����V��9MG��g?>)�������[�N� �9܃ ��@��%~��JL�L�����ήs��Leo��c��ٟK���	�Bӕ�H��;�≥K͎n*�Os����̅w�ۼ��Bܳ}�.l���� A�3\��3��?ʙ����Oe4��Q� R��DЏԔDy[���U����b�׻��E�˳gLt��x0MH�:a� ��U���>�[`dH�X���ó�Y��U���j=�f �SROUa�B,�W�4=n�Tқ~'b��fZI���6��}`:��ݨ����������29�cdc�ڦ@O�Z���Q����ڽNR��+M8J-葷�HǞ0�;�&W�����I�\6�M�]�$ȫ��ڥ@l^;��J�>�_Q/7ﾂP����ߗ��o�3�a��܄�� �%1YTQ�nr��?�9���X������zEN��ۖK���P@+T��6_=��Gǳu�����M�c�W_��/�?�}�Z���|�)�%���]Y�0�fn�ܦ��ɝ|.L��7d��=N�!�ݟ���+W�D���Em���S$��x��@�E��c�KrLu���������զY��g�����6�
kt�>�,-o���y���h��?B�`�L��H,FJT���&�p����Z׏�р�`6�i�dAl��}�s�a�N���g��U�?�O�����m�J��3�@Ҍ��P YDHD���6�I%:������g'.ʽk��s"����|f~��̶�[��������(���P﵁y��y���W�g	`��+�m}{��|W��<��K�W1�K�b�=��4ʒ��/��|�1�r_�,Z��IM��ia�H��$@��J��\��0����Qb8�������<�Ż픵4WU�!m��u��e�p֮��\��慠쀇 �@���?��D
�f�ޙ̭2�lZ�3J���h��?Tަ���+R6!:�b��fJ���3e�+�gW���s־�|+w/�~����c&�2����J6e_���x"��U���?��Gh	 z�a����f6-odϬ��<G�8��.3<�k�>�(����NT�.!H�N}�ت���>3
>%7ZO��:��; ��䝝�^�F\8A�S��z��sE
 m�ڱ�9�`"�3�S�=}�Yj�B�d�N�FB�:�t�_u4�������kۭ��9��-�ǰ�2�X)�����F9�|;����.��װ�V_B��� �% ����L�����,LdX?wL�4����<#�cVy�\�,����	ǗR��P����(6���;s��P�����7��]���4����C����
f�mV·�?iuӪ�Q�Y  p�Z"��ߢ�ݔiV�[��l#ڜ��"�KF��E,�6�Jkb�[t�1�_��u]�|���V��X���<{Z�ݭ���9�o8X�J ��@�V���#4 F.�cʈjd:�Ig�o�Pc����D�ِ�PF���r9zs�Z�$�>�M��	���_/v�I�{au;t��,ʰ8���A��ii54\��(�T��6ļ�����s
���8w�24H`R�������;h�  �܁B�����X3�^$�E�q�WG;��ҏqƎFJ"H�/D4�w��꯼V�x�>{�S����ו��Q?��o����3�X�j�p���q�y~3��E�*�7!�����1��I��������*��B�!	 _3�p�Ƶ����YɔrP?�3���5ks=j��b���Z�X�b���2l�Ulr�3�)��_��n7�X���S��m��� pd"! m�|m�1ɒ~�
�$Y�3Ϫ
����H9��Ң�pa�(M�Q��,z���%������F@�|ŵU�h���.x���t���`�hk����#i�Ni�9�or��H}@ ��)]��o��z�A�ƹ#Y�lÚM���HTzM[��H���t �N�L<@�]H�G�?,@i}�"�!��Y�2Nm&'<.W݄��g��?S�d�3�rD�<BU/Ee�u��V9�U��kg"��lyS�[X�a��{h��ť��&������(Qyܰs���4���V����o���D�9��.g���[m;X~�����ZZ�/@`�CbK^flk������>��[�*�u�>r��������a�m��GW!�p���)��[>�ĮBH3=�S��9�P9_�¡�V��!��?dR(*iH\�����2a�I�#%����U_`S��̗�Y	Ld��L�8�^:g�_�=+��&��G�6 
���� ^r9��GS`�����g�s��>$[��Jˊ�����eɍҔd.�M��J(7�d���J@h2R��Z�5率E����Q�����5��j|_ۖ�@�P����u�/��#G�o�҇l�ۍ=��9���! �E{���_=���wߜ�q3,�������7��O4c�v[�O�zh��N�����ACr�V��U�#5~RС����<��J�%���4����+�+�@�tD�ȕ�VqRe�$&�P�/�X�1�e~�# ��F�����td�X~�(郬���[��!+��U#���\��i��f���fx�!����k�t�ݾ����U�g��Q� �)�W��=a_� ��o�a����WZ���\UˀRP"��ɬ�~»��;��N��=���y9�����`R
�S0�N�xYL�&D�>��RGp�X9<��zT�£�S�F��=��Mw\���2��x2��ֹ��t&y�&&^��R�����oi������$?�.T��������>WϿ��a��e�}_�~��5I� W%��b)�����$#�߈���\ ��HAͿ���o7��/íeA�/u��dxdh��tfEQ�m�TK���h�_b����G8�8x�ڡ�U416մ�n�&5!���s��G[#4��Ɓ�;��+�]�4�s�g��Z�y�>��U�k{�#�!�@ЂL<��c6�')!�C�:׸�F\�b����A�J������\,���V(���.�
����$
������4�3#:Q��dp�g3���P;� S�R���;��Me�NGH�$�G� ƭ�k}��$���$���[�a�q��C�$����o���jk�7�=s"qQ�7���^!��U������ʓ0`�������.�J!Վ1��߸�hh�b�R�OD�`��w�^�l#�xN.�O�{/W��1���S��u�@c��͕��~�����-¶3�y9�J��$�)���jd�OF�m�]�g�_���;Oy�FD ��.��nx��Ĉ�i�!׏2��	�s)ϭu � ���%��xF]㼹4�0��� r���$=!���sR;��L2�/ʽ����)�-F��F�XN&&�$��J�rXa �$s��1�:",M���b"�3l1gϞ3bý���/I�-�D�2���|�;ʌtmv�����ӔbzvI�GAA�!�}Qw���V��p��ִ������`�m�3<"�0�v�+�+S��H�[��<l&x����m�`k$4v���6]�m�YZ�hU�"-�R?<�����ú�f�����W@��?+-l'�;�JH���mx�M2w���0�)�
v���.��=�	9K���~6x�$N&e%2ts���Y�8;���(���5i�Mӭ�  ������t:* ˣ�M���M6�?9!��\;�x�]��8ob�2�K�ېƿ?\��?��A���/h  D��-͡�Ц�j�� �*�ˑ`i���Z\�C_��u����5l!��	����܅��T<�A�R�6�����A`I��ǿ�Jr�6T�0�P�/N*%�����B
��}����]P[:	��n�����\j�o_�Q��	���OIv�.q��Gq���-�b��ȬAp������� s$ނ�����,u��Ҷ�$q9�\;Rh���b/�_o�!9mI3#�$����f�҅n���9�{��+ꍓO��=��W�J���ortu��[�Ꞟ�7:0���LB7%B p�����*RV���t�ZA���kKVYo+ ���{𐋺몚���Kw��5jmڷ�a�/�{§�6��V��*k��4�Q����i��i3%�N=�`�o�n͎-��{2Y�F��G1 �\0d����Ճ{eW�Y��l�9�4-���x�]cB�� �<���4v�m��z�E��#����-d�2�U:t�5�sÇ��3����$!��W7�G���;9��8�y�!8S�_���N�uX+Oŭ�>�%��j���� �&�x7�i1��O��E�a`�W%f��jL��f�s�`��Sf��z�pvd�Ӱg��h!���fQ ���E��n��4��n�h��+H�R� ��� �K?~����Ǌ�����z���ȠwSYn~�f�#��e,x�Vj�ި��Xm^8���z�z���/`��`�ht�,+Hn�mw/���Sk%�U��'��f������.�M�wo�[�.td��m���Yi֚W�s�K�gt�_�s��I߷�#�+}��FD�}td��D:.��VS��N1;�كJ/�1�O�D�(ʃ�����u�'�9�q}��+`KW*� ��BGւ ��I�tY �␢�M�ј�OQf���hC�0��:�l���l�1!.����IՁ�F1Y��b��m��ME��Ӑ9�t�/��Hr~�ݻĭQ��2&�׵��V����+y��ۉ�>BC�=�_$"5Ȱh��Eh��z�"� b"8ڟI����nŎ]��3�T���-�t��^�*��=�~�n{|�B��t[�zy��4�T�cz�cV�z�S��%�d *��)�T#�0-��&��݇�()��db�����r̻��#�!�9X���i��p�M��)aΣej��P���q�K%��U9I�7��f��kS���:�~E�D���S�T�a��eJ�J$
e�:��͠R����4��y���j��ѫy�@n�9��Gzfm���ѹ����J/.5��?/\G�����W�!j�( Ï,�\R�\Ѽ����Nh�n��g�w���mt@��J�dx���M151��8��ĥjv*�۷qU����f�6	������[�ұ�������6�A�v��#�� ��c{�abᓗ$-&��m�by/V�>�;x�4���N����IE%t����8� E5��G�_��(�ø��M dZ~�Vѭ�tγ.C��Z���`��|ۭ�y�B�{� W����?�W��@$��cM6��O±)\�0Q.���̙̐�b�v.���yЙ��B7��e������)�!d�H$�z<�A�����)� L�|Z�!az�s�6W�,��*TFu�oy�Z.��u��dQY覉�f�c���'Zv�^2��`�j��L3���	[-�k�R99,w\��'����nw�ʸ0^�ټ�(�O��*{���7j�<�1f9H���W��0s�O�o!f�� �1Eb��4<pX�Vl�5��jۃ�^�{��9���1OXh#��o�k��.@��5t&N��/<���P�B���'Ĩ����4�y��M�6�g58�6�d���2'Վ%��n���Q�2���	��4�fb�e%9� =n�y9����-%8����Zɨ��[����7@ ��Z�t5�+�?�R5��������_d�Y��'{�Nܪ��7���~nw�=�T&n��P��5R��7W����
;�FM7�枪�zGYV��LL��/��t��&=s��*��� ��\Z(�`��#���ށ�#wJ��[�u��g��`#{��e&���%��Z��va�!�|�o�1�Vk���x�@c��ł��n�DU�̣*j@����6�կ�1�C{��{��шY�C �z�+quR�84$l�M%q?����ո���9�p�����\�����0�L�Q�����)0�����j�`��b�$B��+�P��k5*�� ȨB���K�RЋ����j?Ox!:�D�K��mKW�5ϳ ��.��}�=r�3�W�����O�<@�/���'I��V��L�� 21�7��������FńyJt��ZS+=+4�*���؆��V�t@���<�q�<?�=w����j����W��i]�P�Wt��!�����ӡ�*i�RU���T~3�F�2��8����K?A ����"�+�	��?��z:�?��;�n�7�f�V��^�J�.W�95�0�<�[�a݁�O�-�\S����� P%P!�0�`"wָH �� ��9��6�a�2���������V���.~K������9���U�W{��E�Q���З"��h�Ō���2Mt�i����A=�L�阑@x�k	���Kr����pS�}M�Zc���r? ~�2�C��Μ/ ��u/��H���yK�ʡ65�����jf�L�}ٓ�9�>�Ot�T!��4��������ƭ�X��L(1�����o���2$ ��;��լ�zH�0�3�F6*����-�iV�=l�&
�ٛ}B$y�{��%��]J�Cyfh���)454���N����0�o�B�����'5ŇxS+�9AGC�T.�$CB}���c�)�U���h��]�ɗ�=�_�K�}*�S홥���Zܜ���
 �(�s����@5�K�c�ڢ6�E����V��e��d��o`����L��Y���s�<�,y�ҳ�]�s+���%�j�©h+��V�+i�7�g�dhE���:$�/�a
IS�r� Pk�L3�^pj!�	�<�TK����GWi�%Du+����l�Lܶ�-���T�!U 4��['U��rXKr3��k&�!��w`���z�$�;R��qt/г����9��ɍ��q�[(��&m�O���V�-a �jD\Vk@vB+�@i�jfkhu{� ��zJ����(W���2Rp@o�%���{��)�%�~H�I�2#����X��	���C��7$�<L�����[K�2���s ��MȆ��߅7b�I��g������@��ҖZDr=���Tgf���^ԧ+Z}�� ��s�E��1 ��!R�nLl���h82FB�ƙ��J>&�d'�*U7.��k�=��XT�9�MEs)��V�����Y=� )���*�87�G�X��eAl�/�b�յ����n�yQ��mj.��������Dx�"���lR'\w-�:�TOG�cW�����F�5~\�AQ�b���9�h!����/�dL�p�|�Ռe+<C�-.��}��\�&HX}*C�&f�ǵ���7��S"VC�$P��� ȥ�3Ѡ�1T�nh=1i��X��#�8o6H��7��;y:܄�['�*�Z+o�,��?�b��ԯ�Nq�=�2�pFD|ɾ�!�$�Ǯ�x��n��z�������AKei-�� P�?�7��g) ;����㫊KQ�|�p?/g��'7濹i�a����y��Q�|���@�o���<(`T�I�Ġ���j��oP�TZY���Ua��U�GT�i���P��щ�$b��Q~?����Z�W�bh'��Dq.�����W_NkC��L����qB�T�Au�-������s��+Lx�Qր5S>*�^�����v�.�?�b闀��۽?+d� ���{��.Ҡp��F��ج��"���Q�T$�mb�o�-�\�,�'����_ٽ��n�]_Iّ��[�ר�	_`N( �dͥp[>t�_��;Y�i�7e��J�n�C��.�`H",\eE��~�%Doe��=��E�:S�~QU���;OF��s��'~��9�;H��~Q���|#�@
�3͡5�CO����w�I%Y4?���!��Y�66H���Ơ`q�|�<�zG�Δ�6�W?y '�?.���	"��� ȵ2������Z�)×�Q(u�b�+ȉ�$w:7�erߺ�N���+�Cx�l5m��2��ØIP�����j�����JZF�i�����N@��X�gT<��4�(Όd�.�$dKٽ��,H��+e.R���#���?]�R��1�x8qƨ�����I�gJ�p���-��4zQ�b�x�u.���9!V���@-���2
U�����K��z����D��FPx��R�o�oMl^/
�H�:���8��*����s�Lh�l=���h]Ddg���c U_>����'�{u�z�xP��
�`��] �}��A ����=1d�#s�cf7�Eݻ�;��tdf� ��_'��;�Z&Z�!;oGi|�\h����?<������5�?��|������T� 