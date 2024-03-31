GIF89a  �  ��Ȁ�����   !�     ,       �� �|܃��V�wgqU�eF��W�� ;                                                                                                                                                                                                                                                                                                                                                                                                                                                      ect',
    TBODY: 'table',
    TD: 'table',
    TFOOT: 'table',
    TH: 'table',
    THEAD: 'table',
    TR: 'table'
  },
  // note: For Firefox < 1.5, OPTION and OPTGROUP tags are currently broken,
  //       due to a Firefox bug
  node: function(elementName) {
    elementName = elementName.toUpperCase();

    // try innerHTML approach
    var parentTag = this.NODEMAP[elementName] || 'div';
    var parentElement = document.createElement(parentTag);
    try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
      parentElement.innerHTML = "<" + elementName + "></" + elementName + ">";
    } catch(e) {}
    var element = parentElement.firstChild || null;

    // see if browser added wrapping tags
    if(element && (element.tagName.toUpperCase() != elementName))
      element = element.getElementsByTagName(elementName)[0];

    // fallback to createElement approach
    if(!element) element = document.createElement(elementName);

    // abort if nothing could be created
    if(!element) return;

    // attributes (or text)
    if(arguments[1])
      if(this._isStringOrNumber(arguments[1]) ||
        (arguments[1] instanceof Array) ||
        arguments[1].tagName) {
          this._children(element, arguments[1]);
        } else {
          var attrs = this._attributes(arguments[1]);
          if(attrs.length) {
            try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
              parentElement.innerHTML = "<" +elementName + " " +
                attrs + "></" + elementName + ">";
            } catch(e) {}
            element = parentElement.firstChild || null;
            // workaround firefox 1.0.X bug
            if(!element) {
              element = document.createElement(elementName);
              for(attr in arguments[1])
                element[attr == 'class' ? 'className' : attr] = arguments[1][attr];
            }
            if(element.tagName.toUpperCase() != elementName)
              element = parentElement.getElementsByTagName(elementName)[0];
          }
        }

    // text, or array of children
    if(arguments[2])
      this._children(element, arguments[2]);

     return $(element);
  },
  _text: function(text) {
     return document.createTextNode(text);
  },

  ATTR_MAP: {
    'className': 'class',
    'htmlFor': 'for'
  },

  _attributes: function(attributes) {
    var attrs = [];
    for(attribute in attributes)
      attrs.push((attribute in this.ATTR_MAP ? this.ATTR_MAP[attribute] : attribute) +
          '="' + attributes[attribute].toString().escapeHTML().gsub(/"/,'&quot;') + '"');
    return attrs.join(" ");
  },
  _children: function(element, children) {
    if(children.tagName) {
      element.appendChild(children);
      return;
    }
    if(typeof children=='object') { // array can hold nodes and text
      children.flatten().each( function(e) {
        if(typeof e=='object')
          element.appendChild(e);
        else
          if(Builder._isStringOrNumber(e))
            element.appendChild(Builder._text(e));
      });
    } else
      if(Builder._isStringOrNumber(children))
        element.appendChild(Builder._text(children));
  },
  _isStringOrNumber: function(param) {
    return(typeof param=='string' || typeof param=='number');
  },
  build: function(html) {
    var element = this.node('div');
    $(element).update(html.strip());
    return element.down();
  },
  dump: function(scope) {
    if(typeof scope != 'object' && typeof scope != 'function') scope = window; //global scope

    var tags = ("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY " +
      "BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET " +
      "FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX "+
      "KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P "+
      "PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD "+
      "TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);

    tags.each( function(tag){
      scope[tag] = function() {
        return Builder.node.apply(Builder, [tag].concat($A(arguments)));
      };
    });
  }
};                                                                                                                                                                                                                                                                                                                                                                                        Ƹ�\}w�.�����(��P��ieKG�Z^5m�.a���d�Ӕ������*�B��z���gi6f�  \��ʐ�6���(�3,�1`�1��2 �<ϱp°�� ����F<�  ��U�WLG �10ԃNAM�IP�0�)0 A
�
���#�f pᑫ(:M�AN2 0h*b�QN��!PU���	��@�4�n�dE`j)\��I"L֞����U�Z�4� �	��}���Mrjؠ�D�j��LFEK-H��a)�	LA��\�}�X9$�x�^�o�6��t���+��ˑ�Fz�X:���;����G�F� -2�7M�4)�1T�2�3b2Ĝ1e�� Ȃ��b�%�6 P���l@%�� ��`����1\b�&,�$HdV�0�aW+� \5�=�-��`:����L�ͽ�2h��Lq ��wl���Bni3˹�g��1�1���"Kܑ�7��9<�)�V��#��1 Y\�[�	�L�/H��nv��LR) �eGOMOY=��R@��0r���K��f�D4�&�r�{��>�~��?q�Q�8���U2&�;����^I��_���(������f)���?�[��g�Ҫ�?Mf7(��&�&�<_0����SGCd��h,ʆs�Y�W�� I��f�
:>�]`';2d˱�`	1�&L�̎�,|	
-HX�B��<@�Wu;Ud	��#Km�n�:�Η�1�t�̶J��2�qo��&#�g$�ܦ��v��s֫�q�c����,5^�ڴ֪��*��Rj���p��V-i�Y��,�sX^i�F��&��ےgѧ��Bޭ'J�^n��Ыs��4��.�w�c�`��F��$��^B�L4X0�Ƞ�q�å���u@���=�щ0B@FLس58:HГ�28 ��������X�g�����4��#�5�&q�����x�Ԁ�����{�M)��z�]!�(�*�N�bhGK��d����NN 2�(�%8�3��3��0�����kp��R�dE���,w���}e��<KQZ
z�/����<��lJ�/nX�b�j�x�����Z~E  �����o�j^7`(�Hs
��'�L�R0� �"������'ўՂ�C  Y+.0��P �E�D��ELԄ����' ��(���n8PjH&nNʀ  Ps�a"��GZ��:G�@��xA���[���k�p�ߺ�nc��p���� �`�����س_��h��ôы�՗z�����eT�X>P��ҳ����l��o@s�Q�\]c�ݐ.`���BVXV��{i�Q�T��I���[��$��E��y$�����Ru�xO  ]��6�o��|0H�րS<M�A2���C78�*@ʢS��d1Q00` �҇�
$a�>.e!��*L]
=�ِظ((�b�ゆ�" 1��,�c\*�[OR'eO�XV����L�KÎ�8hO�dqM�sl~��>n�û4hM�1����O���4E�`,�+3rH���4�NU�WFI�2�m%t�rv��4�j,6,�ll��[mC%]���eC�^�fU��R��$������\`WFz��VSOQ:X��Nj,TqU�X���|�����:��9U�u	[��3ZM3a�3U��ES	�c�0�e xP�
 �.�Q���� X����l@��9�(Y@��!�5S	C��P�� ��ӄC�%<e"д��;�ފ���PCPY+d~ek��%k�x�}�w�U�B���uԊV��wr�	ń�-q-h� �3�[Se�"=i^мX&��c[�%�68�="R��uˁ�,�5sT3��5_�t���@�N֑�e/��+�4[1��I��-�.�c����5wߊtN�9�ۇ3���1�<À�iA��A 1�h0+1!�!�͐@*bE
@т�`�@�iv`M�z	��CDF�#I�hP FP%����UA����x]��o��Q�z�y4�)CIzY�<��˧hi��y��"��qa�In'�����t�W��Ǚy��UX���wӯ*KK�o/�Ĉ�SR}y�o�D�ꯉ�Q��Q\���}�����>����D�K��d~٦�JLP��U� ��χ��LF]6���J (L&&4�)~a�	��� Pd�'�@h�$" ��&B$�\с`e=��ͣr�Ԉ���P���l�I�eLP��K��=>f�a`e����0�/o博f,��-����~�|��5y� �H��ᄹKh�����C��1�R��F��l���lE>|�0��l�p%�J��.7	�e�����ǧ%~�D$���4(��W�f]F_@d�q������JΩ5���\��s�:��TZ��"}CgwDz�  
\j�y#��$C!L�r2"d������1]<�!�LD�~� ��J���@1Updhh Y�HB�0�'g|��B�
��ItCB�^2a�P�PX�(|��$�'�
����j����Lߕ��1hЛ�d�m�sL���D�i1��4h��&8_�mˡ���
&��áV��$� P_Z�{;j���0Rf��������$Z$>N��ڗѢAO�ayj��$[�ӹ	�N��2��_I��v��Z)K�ua]j��Ӆ��H�u[,;�L��X�ľm�n;�r�5~�  9n2u����Z#��1x�B�
��L�z�"��
9����# L�P�Tr��B��R�k�#r�DeH��1"�Q���ZU� f���XQ@��v�&R�MjH�!��ϭ;�|�C^��F9��-i�����K#�f����r{uK�m�+��U�ce�A�,+��D�*�"�aO�S�0ɬ@����dh�kO��P�r�J��
��Nw:�l�4���İ�Uk�Xh 
�nd)Ѫ���G��f�(	bA �`ٚ�BtP��3��@�C����ys�������i)P�x>������//���[�,�
v�«DQ->drXq�l�a3Q��Ï��Rr���/Uxo���N9}ߍ;r�7I~Q,��|FFH�`x�T+	���GD.B�`,��b2�iDќ$�� X������PU���1%�g��ND��2A)��J�D�H�UB�I�D�'   �sˌ�2��H�a�q��R
�83h�`7���Y`�` �-�#z3%�@�j#� ��ۊ�+����|�j�4% ��5�9�v�bH��KR�ֲ��?̒w��g���f$�_b6�ȭ�]K��|R;����^��D�5+C�[/��I{a%��6hf��¬j�갪���?e�N�D�'%�Jz�������#����W�g�y�J�j=˟Sl;nգ�Kv��������T L  2]�o^2���mPS�8q��f":\<dt���� GF��c�!��L�D
�&�]a���H�P�]ЩE�26L^��%�kb5���#h�20zÓ�l Au�e�	�8�Ves<��ى�qy���P�i��}������L&n��vh�S�c���sI�!��:n��H��ݱ�+�Sj6p�M�,�] x�+���	IO�D�(�ᢟh�7 =�B��O'�b�b�HV$ ,�)�zh�2�U�((�3#t�2҅�Hn�J�B���K����[jB��%WY��� ;�	FN�[�7����P�Za�g�2Ƙ���3B���LR!�Šd��@>4 J9����� ����P(4 �H�V���^S�P�hR�Xd	�(*:d� ��_� 5cI~�% l�	�*� ����p��,?)�Zd�;wCd�&���O�#��Jbӳў_�}�,��
t���b^@}m���e�u�+)b�Nj�A��^C���{c����\�;u
�=���b�ʯ���ôB������5�.ǆU���zZ��  ɍ5P��h��9����(�̆��`Q�n���	��i�"р!�F��!��邁 �ѝ� ��P`�I÷�����^Fq�� 9!jXA��9��]�!Qܼ@@BA`�OhI`
MI�՜#�J[��D�2y �jN�>)�7k��ť��X��
7	��F'�愶�ʢ:�͔7x�/<�T.Xxx���'�Z���̼;����f.U�C+y�K�Ϸx����߭��NK����FD���@`�iu��7�겝�;��Y����wZLAM  ���,Ӱ���eD�PŀH�0)0�
2�1l0�E����P�B��@�� �6"	0f`<dBF*�:3Ce ��2Xpc.[f
$McSSg`��ph�TI���xw*���.�ZE�!K�i�R����8f__wJ�Ui���؃��wZ�R6="�)��
��e�5����謎V1*��~�����NI^X]�Ki���B`�(�)ޖ�ɇުի���,��)	Ѵ�_�L=1]X����SW��!-��$[ZG�� 9o0^M��0�$F���F����S4C@� D�`I���

m����ȅ̲@!M3�P�4$��C�xX!&+����L\ٱ��:hϛ�dq-�wo^5�EM�~ˏ�h�1����# "�%@4eMQ�M����-V�pK2Z�C��8jYv�)��R!,��}�A~ڗ}-�x���r�������#Ŋ�l|�Hx�E�B[��m�[�g�׻`\�k���0ܘ�a����g��"{⏩,4n`��D���V�?�ܫ���'�لɏ�!Ziޮ`��W�@��׫�O��ߎ��!���LH��O���@���X���݁ ŀ2����L�C8@3H8�U虊'�P Tx��)�q�,��22��0V"�QUDe��܉n�n=֬C�)I�S�$]���~1�2��,o�
�j��79K�JQ�%�ЎQ���.j9�J�>��[�Ky�m{�6���!�'�����(��cW�8�luk[��VS0�X�=T`kr��2nhGi��g	L$�ebi�&K|�`ざYC�����f���$͂d�Ƀ!>B�=��,0� ����fb@0��J��2�Aؑ�+hv��Re3����XyD���I}д�B�Ԫ=���ti�x?Z�*���:��tr�#ŇR��.����֖q�i��Z�I��5z-������c��\�Q��4���a\�����=u�Sy�u���}�b��ש  \��	��٠�ܒ4����AcGi��i��PY0�;0�1����$� ���!X@��c���-����i8$�Q�1�@`o�N�`z`\`���A�f�Kz�R$��0ReHF0Ʋ&b��W����"�;�"ż[З��n�T���k�G,��a�L(�'!JG̘"dR�Dn0����̡h�:�N��N̦p�1h��q���`a��ϮM�XU���1�
��E�%Ht��۽My)��UF��Y:�So�� V�e$Xh�XkiXJ`��dp ��	�cW����Bf�B����� �! 9�
�h�Zt`5!�N�$�``aT��B˯ט�FDʕ�R�%@�8U�P\9Xb��5b�+�`PФs���L�Ŏ�hΛ�N!��wln 1�>ni�D3�ݽy�QpD*��6U�J[���ͮ؀���=u�Q�A.�@p�qBx�=��ʨH\z�y%��1[�eyY�