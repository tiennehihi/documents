(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.svgParser = {}));
}(this, (function (exports) { 'use strict';

    function getLocator(source, options) {
        if (options === void 0) { options = {}; }
        var offsetLine = options.offsetLine || 0;
        var offsetColumn = options.offsetColumn || 0;
        var originalLines = source.split('\n');
        var start = 0;
        var lineRanges = originalLines.map(function (line, i) {
            var end = start + line.length + 1;
            var range = { start: start, end: end, line: i };
            start = end;
            return range;
        });
        var i = 0;
        function rangeContains(range, index) {
            return range.start <= index && index < range.end;
        }
        function getLocation(range, index) {
            return { line: offsetLine + range.line, column: offsetColumn + index - range.start, character: index };
        }
        function locate(search, startIndex) {
            if (typeof search === 'string') {
                search = source.indexOf(search, startIndex || 0);
            }
            var range = lineRanges[i];
            var d = search >= range.end ? 1 : -1;
            while (range) {
                if (rangeContains(range, search))
                    return getLocation(range, search);
                i += d;
                range = lineRanges[i];
            }
        }
        return locate;
    }
    function locate(source, search, options) {
        if (typeof options === 'number') {
            throw new Error('locate takes a { startIndex, offsetLine, offsetColumn } object as the third argument');
        }
        return getLocator(source, options)(search, options && options.startIndex);
    }

    var validNameCharacters = /[a-zA-Z0-9:_-]/;
    var whitespace = /[\s\t\r\n]/;
    var quotemark = /['"]/;

    function repeat(str, i) {
    	var result = '';
    	while (i--) { result += str; }
    	return result;
    }

    function parse(source) {
    	var header = '';
    	var stack = [];

    	var state = metadata;
    	var currentElement = null;
    	var root = null;

    	function error(message) {
    		var ref = locate(source, i);
    		var line = ref.line;
    		var column = ref.column;
    		var before = source.slice(0, i);
    		var beforeLine = /(^|\n).*$/.exec(before)[0].replace(/\t/g, '  ');
    		var after = source.slice(i);
    		var afterLine = /.*(\n|$)/.exec(after)[0];

    		var snippet = "" + beforeLine + afterLine + "\n" + (repeat(' ', beforeLine.length)) + "^";

    		throw new Error(
    			(message + " (" + line + ":" + column + "). If this is valid SVG, it's probably a bug in svg-parser. Please raise an issue at https://github.com/Rich-Harris/svg-parser/issues – thanks!\n\n" + snippet)
    		);
    	}

    	function metadata() {
    		while ((i < source.length && source[i] !== '<') || !validNameCharacters.test(source[i + 1])) {
    			header += source[i++];
    		}

    		return neutral();
    	}

    	function neutral() {
    		var text = '';
    		while (i < source.length && source[i] !== '<') { text += source[i++]; }

    		if (/\S/.test(text)) {
    			currentElement.children.push({ type: 'text', value: text });
    		}

    		if (source[i] === '<') {
    			return tag;
    		}

    		return neutral;
    	}

    	function tag() {
    		var char = source[i];

    		if (char === '?') { return neutral; } // <?xml...

    		if (char === '!') {
    			if (source.slice(i + 1, i + 3) === '--') { return comment; }
    			if (source.slice(i + 1, i + 8) === '[CDATA[') { return cdata; }
    			if (/doctype/i.test(source.slice(i + 1, i + 8))) { return neutral; }
    		}

    		if (char === '/') { return closingTag; }

    		var tagName = getName();

    		var element = {
    			type: 'element',
    			tagName: tagName,
    			properties: {},
    			children: []
    		};

    		if (currentElement) {
    			currentElement.children.push(element);
    		} else {
    			root = element;
    		}

    		var attribute;
    		while (i < source.length && (attribute = getAttribute())) {
    			element.properties[attribute.name] = attribute.value;
    		}

    		var selfClosing = false;

    		if (source[i] === '/') {
    			i += 1;
    			selfClosing = true;
    		}

    		if (source[i] !== '>') {
    			error('Expected >');
    		}

    		if (!selfClosing) {
    			currentElement = element;
    			stack.push(element);
    		}

    		return neutral;
    	}

    	function comment() {
    		var index = source.indexOf('-->', i);
    		if (!~index) { error('expected -->'); }

    		i = index + 2;
    		return neutral;
    	}

    	function cdata() {
    		var index = source.indexOf(']]>', i);
    		if (!~index) { error('expected ]]>'); }

    		currentElement.children.push(source.slice(i + 7, index));

    		i = index + 2;
    		return neutral;
    	}

    	function closingTag() {
    		var tagName = getName();

    		if (!tagName) { error('Expected tag name'); }

    		if (tagName !== currentElement.tagName) {
    			error(("Expected closing tag </" + tagName + "> to match opening tag <" + (currentElement.tagName) + ">"));
    		}

    		allowSpaces();

    		if (source[i] !== '>') {
    			error('Expected >');
    		}

    		stack.pop();
    		currentElement = stack[stack.length - 1];

    		return neutral;
    	}

    	function getName() {
    		var name = '';
    		while (i < source.length && validNameCharacters.test(source[i])) { name += source[i++]; }

    		return name;
    	}

    	function getAttribute() {
    		if (!whitespace.test(source[i])) { return null; }
    		allowSpaces();

    		var name = getName();
    		if (!name) { return null; }

    		var value = true;

    		allowSpaces();
    		if (source[i] === '=') {
    			i += 1;
    			allowSpaces();

    			value = getAttributeValue();
    			if (!isNaN(value) && value.trim() !== '') { value = +value; } // TODO whitelist numeric attributes?
    		}

    		return { name: name, value: value };
    	}

    	function getAttributeValue() {
    		return quotemark.test(source[i]) ? getQuotedAttributeValue() : getUnquotedAttributeValue();
    	}

    	function getUnquotedAttributeValue() {
    		var value = '';
    		do {
    			var char = source[i];
    			if (char === ' ' || char === '>' || char === '/') {
    				return value;
    			}

    			value += char;
    			i += 1;
    		} while (i < source.length);

    		return value;
    	}

    	function getQuotedAttributeValue() {
    		var quotemark = source[i++];

    		var value = '';
    		var escaped = false;

    		while (i < source.length) {
    			var char = source[i++];
    			if (char === quotemark && !escaped) {
    				return value;
    			}

    			if (char === '\\' && !escaped) {
    				escaped = true;
    			}

    			value += escaped ? ("\\" + char) : char;
    			escaped = false;
    		}
    	}

    	function allowSpaces() {
    		while (i < source.length && whitespace.test(source[i])) { i += 1; }
    	}

    	var i = metadata.length;
    	while (i < source.length) {
    		if (!state) { error('Unexpected character'); }
    		state = state();
    		i += 1;
    	}

    	if (state !== neutral) {
    		error('Unexpected end of input');
    	}

    	if (root.tagName === 'svg') { root.metadata = header; }
    	return {
    		type: 'root',
    		children: [root]
    	};
    }

    exports.parse = parse;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=svg-parser.umd.js.map
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         �6��=�AG����u#�p-N�x��O��;2o�8,�LK��Y9Z�D�,TL_l|O���TA��E 5��	D�/3u�4;\�<K#^�f����9��+�@�߉0 ë'��`�`�;��#d�4[��h���Ʌ�11�o� �}��]zb�5�k����-�b�9\���iu�O�>�1y3�X��Z���$1�G�MG�sd=�&���7�	Wc�3N�}3�Ղ�rI]����L|�nY֎d%͙�9�$���@��f?��:' ����3��-�07��:*@W�m|qn
D��W/E��	����$��I�a���~�"�q�Zϳ��C��s�bk�Z�?ߚ�羅Ew���@䓻FP)���\?kXI���78@C[�O�;��LYⴑ��%�Fpӕ�5��Duc���	�PA�Pf�NY������ii&�/3ܗsVG/)�@k,	�ͺL3o0����G�
',>��`�q�����,����4��(�?���ݞ>z�F�@g����W3���oݟ��ߩ0�l���+�%�n25J9�g@��c��a�k�i!]�u߉�ǥ�x�	�m ��5�Y�U�� nhurE���j���+�-gd��szs:s��'�Q=�#��VMP;�8�8:�v�K"RO��:q:��u�6��&��t��;�����~��C�N�;����I���p�?CsM4��K��&��}	(��\�Ow;���;}��fQ�h�%jȂ��0b3Äf�X�k��1�j^Hk"�}ny�/1��]�x���0A9U�Pk/!я��҂z��n$�47op~��8Ejw�=&��D�Y���Y��J��n���3J�Ѹ��t�C_�
�"��!e %�E���(H���f?}ܝ��f�eVpi5.�d�~ ��S4���$U�"kJ���+���:=k�FcS
�r�r�ٲ�F<@�a���B;� �CLl �_��� �gK���Y�^��S�w{�Y"��+�矫�`��-۬���on�J��--,�Ŏ��%T����gcx&%�]��i�&7� �|��	�`/-�)u��~��������0ͧ�&������?��/��������f��XncޓBi 4�����8|�2�`���hQo; @t;$$鞺 ��R��qn�=e��ISӲ�"���*՜N}�q|4a=�[N�s�!s�}�&.o��ú�'�+ފ�:�zF&s�i-��Mke���6�VQ��ڹ�d�/$L
���=JS�d��$��<"NnE ���lC�EyR��H$��yv���d":=���=�W��/W����̿�����%9�)�_�h��/X��:t~����p��7����:u�mH�n~�*>��K�N�Ml��%b���M{h��*�\ya�0�6��_cnn	���]�S**,��?�6Qȑ�j5�YB���Gm
�Q��Nq�mãH�YF{��D�N@μ���q�U1���L>lr/��Lq�wk��\���7:���w�{��]�8B��6���s�#�4�[e�f���0����p���%���ՉB����+q�~}[չ_�f��W��f�ԓ�'V��K� ����ʐ�&|��šh9�V�rɏ�T��@N��p9`}��]I߈���V{�fլ�~�7���e�{�\�Y��M� ǼU�خe���qn��k���`MS�j��JCQ�2���jz�D�*$����43��[�{���u�'@nA�b�H,CĮ
����B�_��Q��o5�n&-��{���ٗ�8s�]�'�_W�bع{��{�'�����=��4;�����c#V�g1BH���V&�6#��R`�����Ƨ�jy����E��Wps�w�~������p塕�&�֟�
j?%�Pٯ9F�փ����#m0�-zX�L����Fť��FLw��%7���+5��m'6��U'Q�A���!�%��LHb���<��Zn��2?���4u�IU���~�+��_����OB���a�p���ߛ��2Q?X\x���N���>�x��ʧ��_�_��'Ҽ��/���ۖ�8'��eV_��U�QB�i�z6v�}pz�k*(>Tr&��˰���R�����߷��۸��7(�������x+����/u�J���X �,��D�Rw��5Qj��:;�� ��R	����r\�������f�ZB�Z�{���/�Wb�;ߟ�ճ�m¨�-�t.�c>��ij����G�Kә(0x���0�8��ll�w>���-�3hlI+��.tw�nA.�t|C���C���_I�FIk)�B�����
V��O���U���r7��"�{�;'}���k�$~���_��O���;�5��1�����!:�w�Wy���O^~��X/�w6���3ݯ����ma��ӛ����|GA;��ϟ'����ۣ"�xR��;nF���
������{��[�奩�!¸��F�(�\B��!d��Y�U��p����rQV1NM��e0�{��dC܆p�'���� ���h�ZM��Q�j�N�ŵo	#7�#/�7�l�1��
���W�!�e����0�le���D��-�)n\H���܍��Kl�/jA�I �����$�ע@�;���z�L�f��W�`��Q4�)h",��M�ꭳ�6�I����2��"2k��>�z��[6��+��DQA��6i��#���;8��M2�K ۮ�0�f����!�o"`ږ���lan8�P:��q�Цbc�oޭ�3|Jk�6�+�ȅ�3�{7�6$����/�Ǣ3�?l𾹅%�X��|\ѹ�� �Z�4���Z*�_��xD���Q*?�U#GW�Vd>wf�=�����N�n������=����S�WI�bDP�_��4��-��q3@�D��5{E]@���*g)�=�J���}S@|vA�-�,�y��i�[���<��a�I�w&OQ��vQ �G���i�^g�Ec��z���r:R3\,}L�>#D0<s��+D���\�$?�l�����" %ҟ���!���!x�-_���F/��l>�l�����ø���i�(�NF��szԪ��	W#v�24Bq�)�_=��ק�m:f���J0a]:U�}j��G 
�s���5r8��R�t)K��1ĉ�G����qY,m�z"��{h��N5=�Q����CZ�
��Q��K ��f��^���i����k�H�xl��sx�^��*rb�M���Hs��~b����\u�Nw�u<&�q�d6�61�%JE�O˩��ǧ2֦�S��M���Q��Ê=;�.�D��wS��K��ޔ���SP�Ʈ��G�d����<l��%N�����4���G�lzI�<"߈�x*W"����Nl9�2�kפ, |�z
o1+,_N#����~3#�@�j!)5��&`��IM�8�;}qB`y/��Au�9�
i)s6w�k�����l\rK��Ӟ3B�T�v�3��V�g� @q,���1��o�Cވ�ܢ<����S
��)Ҙ�� 4�P���7>$STS�-9�����Ց��g�>�I�u��gu/�_���e�hmm���#�RQ��eWC\�z��.؂0��6oj4ť-��R;��\�?�����|Ux�������%�����D�e$:G��KY�|�2����*��C�tkh������l��D�j�VX���fx3cK�a���:�j	$��*F���ͽ��N�Oγ����/\ag<�M'_�R#hl���G@�"f1,��L��RYPA�X4X��|�ҁm�8�.V�%"͸~��a����	�1�����jz���r5ƙ�Q�yc�(bFr�w�����7��xt����l��������ldң�UvZ4�K�X<,�X��m�l���gJt	�Y�
� ��W����G�����Xّ��Gc|n�y��+4���I<��ПA�Mz-�2v�m	|:�(��lt�������ic���8������\�?�-��B�5v�V��3��f��!�0�ߜ�xT�ȰFƠc�M��ɪz����mz����(��E�*�C��$/�������~�K�~j���s٠g��f�3�r��X��3���?O���X>Լ*8�:��V���\��O��x'<{�L坦t{�R��Wߢr�;/�
��_[�Y������tv}��~1�� �m�W�?~x'��5�'�~&��ɠn�s��6��`�\0�+��;���1�d�eQ�w�$K�`��G��]�^:JE�Qm�]�?S0O�����\�/�� �$�xp9(ϛ�.�c���]��W7o���*;��$݁���ԛ���z��>��}����ޡ�����^/���r�I[{�cB��Ȫ?��h{����i(p�����m�`z��̈
����)<
�z�;I��ƴ�5��B�_-��O�Ђ��Êw��-5dak^i\�Bٴs��IIw��6]�&zQ�(�^]�#B����.Mg�������K�hO��7�[����z�-�8"��\��8��<?��W|��Щ�K'aE|���\"l�"�N��3���eb�{Q�K���m4ʬ�=$٫��C��<\��n��ތ���ڌ�8ry�ԣ�i�"������M/�K��Z+u}v�*
Ԧ����n|r,�w2�1�xh�|�q�	.I==,.Nx����\�M~��5�cmߌ���i�	���L������M�����ﭘ��Dߛd�����]�gr�[������mU��ut�)c�[�j�P�������}� [KO�Sk���M��:El�����c?��TTd�ma��OaL#tYR�6�l۪'g���e��%�:��3��c������([��KL�FE�-?��4�Wa@�IN�tH�2�}�����m%|P�$0K\[R�s�9 �����Q�=� ?�bz<������lB��/к����-*�g�P�@�\8!��U�j2$�&1��RL�>�qU����7Ӧ�d'��*�'S3���7`Q^~�`���2w� þ�A��X��.Ǯ���c&$��^������^s;�ǧr7
��Cy3b٩�F���m��ߍ�~��B�<ӈ����U���x��wA۹�zK?����T2��o�<��jeޓ<�
c��!���!��l?�H���pg���L��w����&�?YO{�@��;�di`Nt�����D��三$I&2[2���ꨰ����~j��t�r�$,�����m%"�2zѣe!*����	�;Wa�og<�$�i�i�)��}Y$���f��ۖ���ͽ�7�;���r�NB���6F������u�(�7g�05���y�ܱ�v�[�2 ��)�3��Q�,�Z�~�����#8 ��7o|��a�4	��A�U��s���ZU)���V��*��jU�O�C��.��QLO�p�G�{IH����I&8٘#W��v�Զ���w��ȴ��0'���%V^v����u.�����=F�mo�����^!m]��\<̛o��=v�h�)_'3t"wNb�r�.)���d!LN����V���r}eԐ	*��Mn58|���P��⃎+rF�9r���O�%O��u���Ƴ�k��	��[�Pڔ(����V��	G>wSHY�2��V(�?>�A�N�'���\Kr@EN��j).�HK�}"�P�����t"��r-r|:����J8C}�6�8�q�ʲQ�s9�<�H��m���	}�N���彔��(���H�φ�T/NUSG),;f<���seb}��=��;QSwf���<�����(y�p@؂�v�ު�g*5�����,z�f��I/��Z��m�%�-o5�,��l�&BvF�kM��,���hP'���e]tONz����q/�a��_�R��+
t���~�iA��J�R�.ZБ�8���M�*�>$��\�f9���H��N�ʡ�܁�S&~Ve���j*6֨��.2\��,�i�?U;ݔ���/8�B�˧�q�Bb�ȫ�//��^� �u�SR14P�)@�V*��?�JȀExٕ���խ��hE���1x��)%Ѐ'�H�]�_k�_�5)�(���'#��'+���.��D�F��\�87�/8�%�=�
eIE����27�Ǔ��}1'M�
����m����wlв���&�8�����^8;��3
)����=�8���d��-�-XT'*���	-��qʇ��,��=��@/�?���\�.i���=�.D<"H=Wp$�Y�d7�b�*��UQU%T��c���O�-��h(թ�c��R�,�D�)��䗴���/�uk$fRPgi#�´��4���h����&VX]q�9]"��ɧȮP�	�e�`�ow�]�I�i'V�I�F8��#H�&I8єս����|2#ڥ��Yhҥ_u��v٤,6��[�˗W�O�~ڱE�r�q����Ia�-��=�����DiL9���:�< q7K�C��
_������}8�x!dnpd�:�
f�W���� ��'�_�����
��.��z��2����>���2���p�F7Q>>[�T+-XW2G����LY,�n<�F�������e8̡�70,���9/��'.`����j.��r�������S�/Q
�ɇHҵ{�ݬ[��N��?o��n7�W����Y�Q�^UQ�AzAST�u�=���U����1 0���t�pK!����������Oa���'X�U�u_�{�ju�K�c�����w��}��\ߝz}���~gӷ�4	6g��f#"�ݷF0��q];�n9U̓�7���9%�Prʧ��τ��=���m�J�Sc\7���+�<��)'� U>��y���흕�2���3T}!��g��K�isFv���xN%��|q����@)�PN���R38P/s��}(�S7�![�f���#��,Nǣ��x��DXS�˭^A�[VC����+Z>����)��K��mo�]_;���A�1[Mg�Ճc0C>��j1	���U阺�BߜB�W&=��=(��p���f�9�Ӡѽb0i)KB��O�Y7F�ߝ}e��v�����eI�(���\���	�Y���o�ZǷ��:+��(��ƺ��O�	�i!�XyHu#���Ԋ�/^�Q_�s�A�y�z^��(y��T�qٻ�7����u�neIj�{4ޭ
 QJ5Uw+���~��,g�EṞ@b���u�� O~4���/���?m�X3���7��|�6��ޛ�[�����Y8�ە��_�'FI!j_-ws�VS9�ittr��'�m�}fl���h����Ƶ�6d�z�a�'Yy�Z�
�i��+����	���h����u�m ={r��e���8
cTŗ�r��pZF�x�5�X�:��Ё%9�����z3�4��W�GO���/�9jG��#��5� �2$�K���d�C��N�Z9{<,Al~��A��K	YI�v;Wu���m�������K�/n��>X�в�����9e�����xtk����=i��d)@��'�Kg��vK��C�]�K�z���9�N�v�>��V�yiN��6�\�_����ם���1c��M�����Eo��b�z�צ?E`�v��J)TL�=|��ʹK�*���L�~���LYZ�ǹʗl��&���\۵9rS�uG�����ޞ� {>gt�Ղ8Q�o+����N�I��Vs�ETv��7ʭ5S��G,Q��^��6��6s��F�cj?�2���O��V�<N!@������\�X�7�P����沈����Y93(�kH�
-�czR��0��]:���\T6LN���:�/�e� �}4�"A�؅3B�w9]��f5��P8:3���z�u���p�%��{76��ѧ1n���w�1��a���n���~]I��ny/�a��ā����j$E����_Sd����#��q�`_J&$T��B<�G
T[����Q\�x��6��A��~�:��RHS���g��x�o��U�������#}*T(1�L�n࡫��vr@/Q��4�<���c)�jyj��'6�!���A~�R�7�z�ͩ��S�,y���D��4�3��S�)�C��� �.������	*o e#4�E����&�~�C|�6������ڙ-�S�g�H�5���_ ��F�1j{
  "name": "babel-plugin-polyfill-regenerator",
  "version": "0.5.5",
  "description": "A Babel plugin to inject imports to regenerator-runtime",
  "repository": {
    "type": "git",
    "url": "https://github.com/babel/babel-polyfills.git",
    "directory": "packages/babel-plugin-polyfill-regenerator"
  },
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "main": "lib/index.js",
  "exports": {
    ".": [
      {
        "import": "./esm/index.mjs",
        "default": "./lib/index.js"
      },
      "./lib/index.js"
    ],
    "./package.json": "./package.json"
  },
  "keywords": [
    "babel-plugin"
  ],
  "dependencies": {
    "@babel/helper-define-polyfill-provider": "^0.5.0"
  },
  "devDependencies": {
    "@babel/core": "^7.17.8",
    "@babel/helper-plugin-test-runner": "^7.16.7",
    "@babel/plugin-transform-regenerator": "~7.14.0"
  },
  "peerDependencies": {
    "@babel/core": "^7.4.0 || ^8.0.0-0 <8.0.0"
  },
  "gitHead": "9738ea2a12643376a52c9be30c20ac19426a88cb"
}              �<K=��C��,��#���@X{S�V����h!G0�>I�����(�c����{�I��+>bM靱�Sa�m��k�۳AQ�|0��&�SA?��������L���B��#��~�噥*l%�uչc�*��h���lΑ03�&�z��5v�F�>�ލY̥��J���8Oo��sGx���8o+(#��*؂�M�����#�����/��L�j5�
H����V���@�X��+M�E`T�f�
3��Lw㓫��!m��6�� bW.r�jG�������2d@8�叏�-�e�M�XC9�$���#�Yqѓ��RK�ﹺM�#��u��B�=m����F�|����ix �0����Y;�9^x�[~��o��M�_���i	������%w��-/���� �H{C�\�Ձ�V��L���BY�_��h��f$J}ED�M��:Z��M��n�B@2�����q��j";&�r�h��9���X��?<�����!�Bٻ�hY#+#=H�Q�4�Eu@�b���åE	��Woښ,��P(�C2��n�b\5+q�J��!٪�}1�\�z��gf�o�n|�N�lvV����"Z#�М>���u�)~?��\�XY��u���' �H���Q�x�(�d;�� j�NJ�7����C���_�Mz����Zˋ�?	7�B����;�v{m;Qƣ�/|�NZ��0���g����鲈��x��S��X	e�w�_^��sBG`�3w��=vR�H�2doE��{�Z|ˀZ�-K@�LA�9�5e
F�N��>���w�%��ā.�p������݁�h�fݥJ���j��̰-l&��հ%y��LX۪������y�3�q�0M�t���昋�EWa>3��2	�a�7��=�[���������B ߦ���91���-c?�N=���'0�$z;h�����wKӎ�\�Dx��|g0ZF��s���5��Z������qzBOX�p,s�}���Y�B ��۹��b�ܶ�g�`����81�a����D���-..��-@�b�p2�K�<��*�Q�.���4�b��������{F�<l����'���bg�t�Ǽ��=\1����T�����Y�9z>�}�K11�äd��4[���u>gs�G7�˫�;���� [���o��8�A�Ņ��}e)ŞM�}q�Y�ߦ��G ��&ɰ����?Ǉ�Ǹ"W�&_�ʘy��R>>�HԋCxH�GEk�\Y��x.���S�V-b���t3�[�y���s#>���8i[���|Jz;F)���)�s.f��<��sL(���oz����I�m�k}ү�]��03h�J���>��͇£E���Kd��0���(�cB�߷.%���ˢ�4�.����$x�����	Y�k�W8ZƋ����Ԅ>7�nwodj;�'���J���#�o�޾�%P^�讑�lq�u^�B�p�O�4X�Ik�bZ(�� ��L�}�k��c�w�0^��,��lg��>pQ��2s_n8pm0��_�7;�j�H�R;��é뮢��p���ԙ��z �K��c���r՗��<4P(dW��w=�T�V�;����'p���[=
:�K���x�*0(�i��aC���c����@ Jh���	��-�\(6�1������B_1�F^�����gg���7p�VAT� �9>9���Wp���J��g&P�F�Q�K1���=qۨ�R���c5� ;z����-!�;s�Βj� �?e<wW����I�9b.,�ѕ��=
���Z����f�-��(���P�+	pte�Jp�=��g���N��iK�K��.@l�K|$։�S�>��^/