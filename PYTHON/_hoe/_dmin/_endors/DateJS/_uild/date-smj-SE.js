h} should be one of these:\n${this.getSchemaPartText(parentSchema)}`;
        }

      case "const":
        {
          const {
            parentSchema
          } = error;
          return `${dataPath} should be equal to constant ${this.getSchemaPartText(parentSchema, false, true)}`;
        }

      case "not":
        {
          const postfix = likeObject(
          /** @type {Schema} */
          error.parentSchema) ? `\n${this.getSchemaPartText(error.parentSchema)}` : "";
          const schemaOutput = this.getSchemaPartText(error.schema, false, false, false);

          if (canApplyNot(error.schema)) {
            return `${dataPath} should be any ${schemaOutput}${postfix}.`;
          }

          const {
            schema,
            parentSchema
          } = error;
          return `${dataPath} should not be ${this.getSchemaPartText(schema, false, true)}${parentSchema && likeObject(parentSchema) ? `\n${this.getSchemaPartText(parentSchema)}` : ""}`;
        }

      case "oneOf":
      case "anyOf":
        {
          const {
            parentSchema,
            children
          } = error;

          if (children && children.length > 0) {
            if (error.schema.length === 1) {
              const lastChild = children[children.length - 1];
              const remainingChildren = children.slice(0, children.length - 1);
              return this.formatValidationError(Object.assign({}, lastChild, {
                children: remainingChildren,
                parentSchema: Object.assign({}, parentSchema, lastChild.parentSchema)
              }));
            }

            let filteredChildren = filterChildren(children);

            if (filteredChildren.length === 1) {
              return this.formatValidationError(filteredChildren[0]);
            }

            filteredChildren = groupChildrenByFirstChild(filteredChildren);
            return `${dataPath} should be one of these:\n${this.getSchemaPartText(parentSchema)}\nDetails:\n${filteredChildren.map(
            /**
             * @param {SchemaUtilErrorObject} nestedError
             * @returns {string}
             */
            nestedError => ` * ${indent(this.formatValidationError(nestedError), "   ")}`).join("\n")}`;
          }

          return `${dataPath} should be one of these:\n${this.getSchemaPartText(parentSchema)}`;
        }

      case "if":
        {
          const {
            params,
            parentSchema
          } = error;
          const {
            failingKeyword
          } =
          /** @type {import("ajv").IfParams} */
          params;
          return `${dataPath} should match "${failingKeyword}" schema:\n${this.getSchemaPartText(parentSchema, [failingKeyword])}`;
        }

      case "absolutePath":
        {
          const {
            message,
            parentSchema
          } = error;
          return `${dataPath}: ${message}${this.getSchemaPartDescription(parentSchema)}`;
        }

      /* istanbul ignore next */

      default:
        {
          const {
            message,
            parentSchema
          } = error;
          const ErrorInJSON = JSON.stringify(error, null, 2); // For `custom`, `false schema`, `$ref` keywords
          // Fallback for unknown keywords

          return `${dataPath} ${message} (${ErrorInJSON}).\n${this.getSchemaPartText(parentSchema, false)}`;
        }
    }
  }
  /**
   * @param {Array<SchemaUtilErrorObject>} errors
   * @returns {string}
   */


  formatValidationErrors(errors) {
    return errors.map(error => {
      let formattedError = this.formatValidationError(error);

      if (this.postFormatter) {
        formattedError = this.postFormatter(formattedError, error);
      }

      return ` - ${indent(formattedError, "   ")}`;
    }).join("\n");
  }

}

var _default = ValidationError;
exports.default = _default;                                                                                                                                                                                                                                                 a�zޗ���iL?[�g)�jL\���܏MN���
 #��C�����(����ܼ!2p?"��^��l� �� U�����z��_3�\���[�b�3u�d�0��������P�!~�#J+"Y`y�{]
�ݡ�W��7h>/ �\���d#�ץ����8ly��H�s�����;-	�4a�m��ڶm۶m۶m۶m۶ݽ�53�
*�"2��ē�G�j5�4�Oм7>(g�ܔ�nra�p���gA����G+����b�L�F��;?lhH��;�������~m)1���:d�֙Բ������#%!I�j�l�3���qh �t�0a=#���¿���8��H�bϕ9͖9F"�I���ŋ��R7�R����xͭ�k˭v>:��W�%�VJ�)��x�@{.�II��T��i>��[�35y�ϲ6�G{��悛�`g���<ш%3�n�,�I�n�c��8���9��	̓Rc�+F^	)6�i?+提�m��'��'��vx�lSl4j	���TN����h�ԗE���w�{4m�Am��l���Y_�2�l�����n_'��L�}�fP]Ψ$��~��Wx�De��B4	eJup�ж�ۻ󹻊Pf�gXf�'K��}y�ڏ [�e�����9-�*����"��:h6��A8��b�oy`9I� p�I�N��.��J�P��v'�a��e,���sa�(26̓n�^�1x���U`���FK�uК��*	E?_/D&gt�n�����M�t��K(�{a 3�,=��]�F�M������^r��$m���W,\5�<����$Jp�pr�E<(
.��'u��K�g��\yr�%��J)��pO#��Iн�'���\|��/&���A��?\W���Ǜ��Nh��q�(ߞFFa������rtv�wW[��d����]r�iݩ�*��)1�o�8c�}"ɇ�)Rv3�'��g5���^ϰ��(�z�#����>j�w� �������6?kn���"�s˻��q0��z�VAJ|�B��|�ze���:D�n���z�?��}��{3�i��}����DƢx�Ou���rW�T
LЍTU�̴��c� RI�g��)1}._Լl��;�ܙW�@�|.��h_K�,���ў�$�����|%)h#@���˂��ѳ�^�?������OV%ӗ_�f�G�E�A�v(�M��f���0�6������
����8~08�	��@��88zHQ��1����j����ͷ��
��&��r�B0���y�<>��~���iɥ,9�ͻg�T�a�ԇ�����W���/�VH�
�����M ��}ϸY�����AI d��ƭ�vu��$�����i�m���b���$�)���Q�E�9)�<A'��{7���d�O�Q�U��F�/X�E�P��d;�ǻ���n��O�/�>�4�ƪ�pk���
x~*#6�EiҐ�K���O&���q��H�*O��Ccd\-��dF�DP�R"��l�ݰ�e����O��
��1��/���Tʘӑ�����> EHO:�9wP:�J�v��P�9m�O �hR��N6�����R�m�,���8�|[�o锈 �_�|�;t�� �p�|ȳ��s� �Ӂ��|V�u��c���m���F�/��׌WV�q�D��Zv�5O|D?�#�J�g�����0��~i?u���6Q�ކ��Fff~����
���	 l?}�N$�͏U,%�Gw+G~Gim�Qԛ@oZ�Gn�?%U��j�W���UW�p)�Q �-2�5T�Ynw%ѐ:T��q��/Vb�0������/H�ɑ���u���T�	F(}��7���W!�8�%>h�Nϴ�i��ia=��]o/Ƿĕ�l����r��_Yp�%U��ne��l�P�h��8y����a�9�'s�������	���a����l���w��sZ$���gk�;(�6���kQ��Om�H�Z�����yz�!�=(wY�P��J7P;�G5|�L����5�nӒt��P�ɦg�����"+�#�9�����a�% M+�+�,�U��̺��ȊKXx��+�8z���`��`����:_�o�����Bǉ�]��֣��q���C茵�zl����!E�l�c
Ւ������f  ͯ�AP'�]���3�\�`�)^W��#%z�2����W�T�,R�Q��=���'{w�KBԃ�EO<�{��R�J�3��(/��mO�ۼvr�؄�+�����Ō	Z�i[���~,��ѾŨYQد#��a�&��zib��d�OCl���X�&�5`��i����p0`>ω����  p&�;�1 ����{h�����X�ݫi����� R�c-f�f~ȓ�<�Wp�1}b�c�,bu#�r&��:T�慵� �;,"';����Ш�8Ba�q��u���	����l�l �7r����0Z�A�(3z)>��@���`�sی�pr��`�aD�c-}#M��K^> �ƻ��}=��lL�aE}7�#��	�RX���ݭ�����
sEž��O�gRFn�����s�
0��� �#Br I'�D�+�D��|����ʹe*�J7��^25<}�{��x	<���p��Z1�jk9��6���
3l�jD�L	���i��;BL�
����^�'e;1 {�/�f{i�M��H��)�/C�')��$�NB03?̷g�[�~�Ac�P�Ȧ��Ҝ�/O���hd�F�]�l���s��^��Y�e�NJ���Ӱ�=~9աo��� �a8F�k�f��A'�Y'���e��v�M�rR���i�qG��DD(i�ɼq��d< ��k�
-A� `�D�����m
�M�>HĄN68�q}��m�H���B�g35�����)���������J��T��e�$��`w�5�5=�͘���CCX�d ;������5 㩈���L��τ�9_JN�;^����WΨ�semf�(�M�.��\^��o��2��#w��EP�A�q  P2�����X�i���6"�����?��y�������q�����\�+�Ĝm��i�@��G����U/:�X����(h�y`��#2�h?�sf�P�������l���)�ZF�%]�63�z�3��O���Uk����Ch]SiP("[���kfJc[����y<4�#B��EXt��+2�J)ң%��lzxi윙���"l��[����NJX8B��`�6yW�N�p�J�M8`��s�į2u��.�wP�Y��Q!��Z�d���䠬��K��Hb�6�I#���'x��Y
B��aPD��ߴ��æ�AZT�mk���vbF�1e}�`�Y�^	�ޙK�BFQS����.�����/���Y��HZ���k]�q�H���ݜ \��Jů��0���
]�sQ���{�����@�o<���R1�E�I�T"�5��N��'��U`�ϐ�O6 }�Ie�*��h ��jM`nҊ�V�]�}��`��p�����b�!P<P�x�ϓ�!���-��m2O1���ۋ��H�?�B���ri��s^#�!��m#���5Lһ��\�hx���OTs�K��{�㔛���Qq��*Ѻ-�1%�W�b��p3M��G�>χ��OߦW��I�@nPD����5M}	�"���Tܽ��3��,�G	D�0��_�ޭ8�\0F�W��|^�9�ն�A�x�V����_�=�(!hU��$z���&oSN/�i}@�5�xCH���� ��1��#�b�9�؋�sbF��%q�`��rb/۰�x�]�^L��)���az#ڧY�h����J̩��H���Ѧ��?;����*`�Ӊa�Q�R��Q8�W������M�ǣ�I��Y�����044�L����"!k^6��4=���{H��������f+��	��RZ�hlMM��HwxL�\�4pNt�53V�*�@�e���_�˖3~8�l��Nj(2�5|��AMr��*SZX��wR�נ1�hD���FǂL@jQO��[��P�K�+-/���Z��1�(�s�e.*��!���+8�t�̂�qX�����2�bprN�O�^��i��������e�K�'H1W�/�p�����ʴ:��;{Bv��3�3/��x����.8��D*7,Ⱥ���>F�E�������}~���D�_����/v��'�ʔ��5�!�����#�R򵢇�04ê5���^��C�m*{2�c@��TZ��9�g�9a�d5���d߬ٽp������*�d�ǹ@d�tWp¸��i4.����	Ė���˂�eh�[�p�`�G��[o��ƒ�mK�\mҤ6�-@r�G��6A��p�\��DS��M����+v*Gо��S@�?iw�VK���.��(��Z_yM�)�C3�8)�������r���8*b�^�Vl��G���R�C����i���@-N�v�1@�
/�W/�h���9���J��,U�44�W
\�qQ��k!�B
�9Gc��:ʤ�-���
1	t^n�����D�,a=|��O��`�3���ȩx:Q�K�*�qԉ�H����� l�H�q��48���6��D䯳���,n�D�f�(@������ �T��UR�qO6 ;��a�q�|�p�~��-��δ�H���5��zo�������n<Ŏħ�;�����2�@)}I]�S�V���$�o��>�&��:��)3�g�9<����@�D��C�+�w��d�d��ZVU�"�Ɖ����L���˴
-G���%������q�O��hZ��Ƕ!mk�u�Y!W��;�)��Ӂ4k<�9�:�A����Z�2�ٰV�U �ir'����O"Jz�P[�����&�8Za�<Ho�Љĉ��Re�T��3w��^��]����O���ɯ�����!�=�����^�㗻�[��:��="��2d��~�5��{�s� o��i��Q��Q��ΏPy��h���b�&W��t�`׏{�H�t��	�����qZ����;���>��M\��ڤ�)~�es N�2�"�I� ��"u�>��rLQ������P�˒MFj�kS��<;����H������l�3��D.����S�޹v���"�g�X&�a UC���"�B&��g;���牰���T\%����{�I��O�)n\���Z2 <*�X�/k��A�9�d�w6�q`�x�wh���ѽ��c,S�
�n`�K���9�l98�L��C(���х�2-C1�mnuz��BԂ�e���,	)�*8�rO�5�֐1S��	�*����Q!F�q��̱�ѥќ�, ��z�*W��S�*�l_P��M-�rƥ0BPn��zt�˒{z�ɳ��5HuE�E���"�jM��uV)��߂����a�hf�!�vD���e�G�J�,�0�<,h�$��v��Ϩ�1Ȝ�+5��'��'p�e�
n���|g��/p�[U>V�W����W xR3ɴ�ɗb��+�'�'�<�GQ�4���7���oMY,�+7+�h�Aܵ9h���b�����M��=T�V�"�[���V�����S�ȏz����o��gӧ�m:[�:x�I{�p��i B�hL9)"�3Ѕ��|�7&�#�BX�][.=�aL���0��Y�|"[�&����(+��\��v�hI�\I�O�]Ů1��l��Z����'��.�ޠ9�"T����E[�>,�&����	zJg��6�v4&4c�\`�:)�b�8X�"=6�&��^3��-T �v�����yle������iҔ�M9`N�5`�����ﴱ����'q�A#"��<�3�?7�èVF�+��JN5L��6�o��O�7�9�����7�U�9�\,�@�C���p����ʝxSC@��8R��X,~�� z=�T�C��u#]�u�40�5�������zt�}PZo���2L_��]��|����9��s��^��[�r��q/��b��G]|��o�ڬ����&���J:�£)e��WAjh}:~[�
�w�l>0}L���mz˖��M@p�sF�/�{�X�t�]�!<:��tߢ�H[dn�ApQv�C6fPs���/2W�n2����أ��`�%���j�z.���~�	���r(�E�Md�GO�G&��H��Nr��ˤ�>����Ik $l=�ܮ:�[��]�ǚʹ�������sߢ�O��Ƚ�J��!H?8�� �ҋ�e�� �q��f��D�
��`n�d��°�����/�[t�Xd�E-� Q����3�7������E���Y�[����	���Z���(�O�@[�Z�s�ަ3�'�nbw�:��pqc]d�
�j�G��+�YA"E�c!r�Z0|���-�mqERg�ʛ6&����^�e�c�U�ķ�Q͍ P�Xa��7��У��\I�7���Зv���lH���o��	0fMa�}�xI�V��݄�2��{i����7���10ћ('XJ�}^�薵�>����8���Ֆ����,����������-9;m @�.Êu	��Z[rg�'2�V���g�����ʉ��Iï��dF��,\DV��3x�����B��0~�m�4�5s7�62P�hc���@G�[۪�x�U�ÜV��Bp������|@��>,�u�ӧh���p�;�+w�5I �_��!o7���Y�8���Vuѡ�^�O�/����=��`�R��%���RW6Q�GlGB��T���~��S��~w�x-��A����B�ԗ{�{p%�"C�<�<����uH.>�@9'@�#O�zz)#���Rf�**���^,u�<9B9�	Ҥ�돀$`�B��ylD�Z�"��@�'%U�a����{��=B��ƯnG�����5-UBա�]��)�-&�^u�Vi��F9D��=�Ǜ]���.�#G�֍�H<}��n���g�S��>���ex3*���f���%����G�P�=I_�A�V Q 0Ol H��$D:e�cK �������- ��R�-qJ5�<&�a�/��"�������/;j�Sd�(\ER\f�bluO�� ����k��ߏ\F���m�OQ:A9VtקL���x�t�tbn9c�Sr�N���ѵi:�#"�:�)<�)f�`�r�>��>�]F�	�(H;6���Q"�_9�pO�ndU��v��:FW�Kt�I12���5�
����*�t#c#��nZ�o>Pgd�Ӏ++rB�SEl�԰@��%�վ&#~p��-�B�\������4:��ec^���2�v�?���u�]	#y�Ꭱ<=di�kZ(_��zoB�o2��ޱ���0j���%w�����M;� �-pVH�!
O:��(ܽ�h�}��x�؊�Lk����zяG��%�8�@�y�;!rem�<���mT���s�b,U�&{Ѱo��m��L}\�<\#�jO#V���WjsV�k�4i��x� Amמ��q2���,�~dy8�זZL�T��6U@ ~�߁��UI&ؕa���-�4�Y��z���c�G���$����4�n	�,�~�+�8پ�s�����M�Gסh�K4�xA�%��ߎ��Z�̔��4D.����b;h�&_U]zcn�ٌj�X~�^&Q��sy�s{FW��J��"8�Q����X��0�$�ȻEP��K�bpk����Г]�G��i	�a���JVŢ��M撦uW���;G�jE�6D��?L�5|Ӗ Gb��� mľ!�ԫ�Ԃ}�P��x��3N�� p���3�imig�5�_�=�*��nDy��X�EqF#�0�I�!���̖#xS��O�&�_� zsWz8k����u�fW���k;^�ь1	��)t^�F��{z�i�z:#\ �,K�A�t��	�oĐf������c�aY.WE�>IO������
�xONMI`�1q��D��5���I%��K�n�J@k���Ӫ��y ;�X#�u,�����B[��D��&Pi\P�����y���-+�:���x�<���d�����$��w�dcOș�7c� ��-�4�#��;��8K8$D�QbF�_�}Ͽ/�]�Xf�P[��˸���ч+ЯA�9���C�FdSK���&8mC�|#0���:��Z��u�:�;n�dV�ni��o�T���^�1���5�=��Cm���iO����i�8�܊r��r�R��Wy"�m��	��;{���z�IuT0p1���q��cZ:�+#�h>CT-�YEz�t蕔�y2�ea�4I�{/�[�F)Ԡձ�Ψu�IM7����ퟁ��`�MK>0��=�!��p��s�x�&�3rۛd\�T�P�n2�dU]���	�&C�  @Jy���93<e�ڊ1&����N�?�����m���i�m8��'9��(�u�-�JlLTП/�>���c��zok-�Ax��t���<�3$#p$n��/���t�A=+SY�fH	@�b��O�;COx�,��{������-�uU\y'�<�۔M��A~8h@^<f�q�k�z&��M���\!��G&��x�b�?��O�(� ﰾS}�#\��Q����|�5Z�ͣR�C!r<�_�]����Z�����9yu��������!�w�}�p�5�sͫ��WT�M =�o���;��w��qM��Yo�+L{���Q�|g�5O��2�n���=P�C�!_j�'o���D��w��+,�k0x ���56B6:4�=��D�M�+�.�]��S�Y�M���5q2&ku;2��sc�[��*��:���������T��o��A����j��s��6Zl�����ʕ������&RD$���F�f+�@:w~2嘈�dW�G#���7�S�W[�y ^m���a2%�ɘ��ܽ��_e2͡����N�Ŀzfww��J��A��4k�����-�`ˢH������"<�c  �0����K�Ѫ���dZ���8����`βp�|G%����.s�O����,*g����QB ���V_j[�wDr�1xK���Ii����
kU�&��0��DbR1��d��Q����uM����f۴��s���C��{�d$�$# �[οM���,Eo��'K+Xtz%~�j�M�~�	���H=�"�8�������@ o��W��}���8�`,�k%���;>��'���(=bi�)�xp��p�_�BE(_���d��_��4�_��Ml�@��6���5@4�R���𗑑�h^Ż��d�({���#@Xzu&�w���ziBȸ��i8?&��=ϻ�oGU� ��� � ��g9l`���c��8�B���+�h�SC-�8,:����k{�
���K-U*���G'2v\�T��!�h��>�]M�9�ą�;���#;�8s�N��W.�Su�=�E}ǰJS�%�>L�yh�}~��'�}��ّ��}���
����D�9���%V��"�+��W  �e�,��[Ɓr���9 ���C>	N|��h>�U;".��V2��ձ�%�v9��3;*{Y�e������I;�V�^+!0�xY�~����vp�n'�`�~5����Ο��Y�c^����a�٧���iyT[�������mDUf��OOs`��!-�1�^?ęr=:�σ��+�?TZ��VEj���8?3��c@��4�e��	[���+�����&��Uߺ�D��&Z��ݸ �J�@���s����>�J<A��:�z�!ĩ:N1�	r�\Ey	��Fxr��1kc4�Gq��J 
`�~�r�\	z��3���c�w�c�d��/F�Ue�h���8N�߉����P8OG��ָ�y�(l�s:��4O�C��s[��{m٠m!6���Q��DG�����R� �v��{i��"������W�O�)��k��.�����-�����('��ɿ�ظ����79vr���T�%��?��G~+�Kj��,�r��~Ү�ն�]A\��K���z@��Ӷ������~�fe��N�ϴ����陙ŉ7JG�F%p��훩n�C�V%���F�Q;�F"���8fN'��l�-�j�@�ԛ�� EK���d�h46�����k�L>�~�z��{��>}H`=:kHR�X��?�i���ږٞj����t��W)[YW_����i܆3/��%�Y�u���t�9���r����GP�Q������w�J�zKΑ�$Ǹc����S�Бt�S7��W��ۨ��ʮ�+{6'T��
�k<����s�L.	ˮ�=.s��8J�rs´N�)O��G,���$����*^��ۭ'$= ���O6P��È�ubCj�#�Xt��W�I��:�#H��R:�vzԇ!&]ͳr����?�p~V��A�ju��:l���_�Y� ��S��'{�B�d������F����@�
��3H�=��6O��Sc���E�e�@�"�S�f��╚�bA���9���Ԕ���-d��V?�f�H�P��i�ϣ' +�Y|.��P�T;�wD�{��A�%p�75�t�	,�;=a뺛��%,E��#J�@���+
�6��X�5=]z����g��q�'`����u-��ٍ��C���5����v ���戋�����Π㤱�bsA2V'�I:
���e�d��eL���ߴn���續�BňK�iYYc���'
��o˫��L��z0pBP��7,�<���uDA��cTZ{тRM���/�s��ԙ4�B���������U��V�u�_q�tO�C2p<�)B�~�XOW�\�b��7����̘���h��z7�=e�`%7F_e�@P�Y�w�$�e	y�+�C5v�xFg�������2tB�}ָ�Y�(�s��[R�)��bO�]q'���ÑOk�A0����K��ŧ0��oZ������Y���?
�!�'&�I�z$|X?�Ƥ�	S��G�g�J�G[Y[�|fA�\<v �e4����^r���{��,	O�wυ���+�ܘ������`�&��IT[ <���(� �&�j�iGbs����#f�;��>a��د�.O;R�Dv@C���uwD»���l����,=獱��fg���<�m�o��S����Ӑ4�����y\�Z�wˡ6j���j�Ě����T�K��� ?�(2�J9 ��1����.�#�u K|����k��;l�w�,�g��#�QN�uv�fk�E��~+�:m;TGxv�w�>}祉 ۠2i	_�ێ%�ޝB�$�77���K#���oy������ii�r&	f�Rroތy�L�3�s��2n��R�����Nz�*T]��c"H��[��/�`M�fyk�I���..��\
9-��*A���h.�:���7�׏a�c9v_����79�6�aV��E�x��7uW��0�^���p�oٗ��G���:䠿0�����[f7aLP�*9�񻥞��]�:Z�{�r?�d�rsT��^��=4z"Fo��xGF�Ԧ��'���I�|ti�m�|�� �Ž�-�Ň"Á\Mz�FL�z������!���OP6�������v�e@���s>��{q�]�+GJcg�A���W��4?lce=6��k���]�2����;B|�t��(z*�r#��2�k�~7�Ð� �5y���?���Q6�v�c�i�~R;+���M��!�E��@w���Wm�#
�4�f��ۭ�l���( �|a�R��m���q	��55퀶6�����7bZ����q~?��7W��%�P�P[���,�䦝/�� 3�d��u�MKH0���j%��V�������R�-],&۫�,����%���p�F$�mM�!���^I��J`K�M�����v�������`���������]<*���}�M���2���g®�N�ϭ�+�m���;n$�F�#ڥ����N��C�d��ʧ&i��n����u�F�=��|��{8����ӝ�W� >x�)g�1��auه{�]�<k*�� Ut!cɔ N�Sɯޚ�O2:��c�Q(�1@�9�A�T��0�  rV K��@�xR��S <WT�_����ASl��G�$rulesGroup.type);
                if ($code) {
                  out += ' ' + ($code) + ' ';
                  if ($breakOnError) {
                    $closingBraces1 += '}';
                  }
                }
              }
            }
          }
          if ($breakOnError) {
            out += ' ' + ($closingBraces1) + ' ';
            $closingBraces1 = '';
          }
          if ($rulesGroup.type) {
            out += ' } ';
            if ($typeSchema && $typeSchema === $rulesGroup.type && !$coerceToTypes) {
              out += ' else { ';
              var $schemaPath = it.schemaPath + '.type',
                $errSchemaPath = it.errSchemaPath + '/type';
              var $$outStack = $$outStack || [];
              $$outStack.push(out);
              out = ''; /* istanbul ignore else */
              if (it.createErrors !== false) {
                out += ' { keyword: \'' + ($errorKeyword || 'type') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { type: \'';
                if ($typeIsArray) {
                  out += '' + ($typeSchema.join(","));
                } else {
                  out += '' + ($typeSchema);
                }
                out += '\' } ';
                if (it.opts.messages !== false) {
                  out += ' , message: \'should be ';
                  if ($typeIsArray) {
                    out += '' + ($typeSchema.join(","));
                  } else {
                    out += '' + ($typeSchema);
                  }
                  out += '\' ';
                }
                if (it.opts.verbose) {
                  out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
                }
                out += ' } ';
              } else {
                out += ' {} ';
              }
              var __err = out;
              out = $$outStack.pop();
              if (!it.compositeRule && $breakOnError) {
                /* istanbul ignore if */
                if (it.async) {
                  out += ' throw new ValidationError([' + (__err) + ']); ';
                } else {
                  out += ' validate.errors = [' + (__err) + ']; return false; ';
                }
              } else {
                out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
              }
              out += ' } ';
            }
          }
          if ($breakOnError) {
            out += ' if (errors === ';
            if ($top) {
              out += '0';
            } else {
              out += 'errs_' + ($lvl);
            }
            out += ') { ';
            $closingBraces2 += '}';
          }
        }
      }
    }
  }
  if ($breakOnError) {
    out += ' ' + ($closingBraces2) + ' ';
  }
  if ($top) {
    if ($async) {
      out += ' if (errors === 0) return data;           ';
      out += ' else throw new ValidationError(vErrors); ';
    } else {
      out += ' validate.errors = vErrors; ';
      out += ' return errors === 0;       ';
    }
    out += ' }; return validate;';
  } else {
    out += ' var ' + ($valid) + ' = errors === errs_' + ($lvl) + ';';
  }

  function $shouldUseGroup($rulesGroup) {
    var rules = $rulesGroup.rules;
    for (var i = 0; i < rules.length; i++)
      if ($shouldUseRule(rules[i])) return true;
  }

  function $shouldUseRule($rule) {
    return it.schema[$rule.keyword] !== undefined || ($rule.implements && $ruleImplementsSomeKeyword($rule));
  }

  function $ruleImplementsSomeKeyword($rule) {
    var impl = $rule.implements;
    for (var i = 0; i < impl.length; i++)
      if (it.schema[impl[i]] !== undefined) return true;
  }
  return out;
}

},{}],39:[function(require,module,exports){
'use strict';

var IDENTIFIER = /^[a-z_$][a-z0-9_$-]*$/i;
var customRuleCode = require('./dotjs/custom');
var definitionSchema = require('./definition_schema');

module.exports = {
  add: addKeyword,
  get: getKeyword,
  remove: removeKeyword,
  validate: validateKeyword
};


/**
 * Define custom keyword
 * @this  Ajv
 * @param {String} keyword custom keyword, should be unique (including different from all standard, custom and macro keywords).
 * @param {Object} definition keyword definition object with properties `type` (type(s) which the keyword applies to), `validate` or `compile`.
 * @return {Ajv} this for method chaining
 */
function addKeyword(keyword, definition) {
  /* jshint validthis: true */
  /* eslint no-shadow: 0 */
  var RULES = this.RULES;
  if (RULES.keywords[keyword])
    throw new Error('Keyword ' + keyword + ' is already defined');

  if (!IDENTIFIER.test(keyword))
    throw new Error('Keyword ' + keyword + ' is not a valid identifier');

  if (definition) {
    this.validateKeyword(definition, true);

    var dataType = definition.type;
    if (Array.isArray(dataType)) {
      for (var i=0; i<dataType.length; i++)
        _addRule(keyword, dataType[i], definition);
    } else {
      _addRule(keyword, dataType, definition);
    }

    var metaSchema = definition.metaSchema;
    if (metaSchema) {
      if (definition.$data && this._opts.$data) {
        metaSchema = {
          anyOf: [
            metaSchema,
            { '$ref': 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#' }
          ]
        };
      }
      definition.validateSchema = this.compile(metaSchema, true);
    }
  }

  RULES.keywords[keyword] = RULES.all[keyword] = true;


  function _addRule(keyword, dataType, definition) {
    var ruleGroup;
    for (var i=0; i<RULES.length; i++) {
      var rg = RULES[i];
      if (rg.type == dataType) {
        ruleGroup = rg;
        break;
      }
    }

    if (!ruleGroup) {
      ruleGroup = { type: dataType, rules: [] };
      RULES.push(ruleGroup);
    }

    var rule = {
      keyword: keyword,
      definition: definition,
      custom: true,
      code: customRuleCode,
      implements: definition.implements
    };
    ruleGroup.rules.push(rule);
    RULES.custom[keyword] = rule;
  }

  return this;
}


/**
 * Get keyword
 * @this  Ajv
 * @param {String} keyword pre-defined or custom keyword.
 * @return {Object|Boolean} custom keyword definition, `true` if it is a predefined keyword, `false` otherwise.
 */
function getKeyword(keyword) {
  /* jshint validthis: true */
  var rule = this.RULES.custom[keyword];
  return rule ? rule.definition : this.RULES.keywords[keyword] || false;
}


/**
 * Remove keyword
 * @this  Ajv
 * @param {String} keyword pre-defined or custom keyword.
 * @return {Ajv} this for method chaining
 */
function removeKeyword(keyword) {
  /* jshint validthis: true */
  var RULES = this.RULES;
  delete RULES.keywords[keyword];
  delete RULES.all[keyword];
  delete RULES.custom[keyword];
  for (var i=0; i<RULES.length; i++) {
    var rules = RULES[i].rules;
    for (var j=0; j<rules.length; j++) {
      if (rules[j].keyword == keyword) {
        rules.splice(j, 1);
        break;
      }
    }
  }
  return this;
}


/**
 * Validate keyword definition
 * @this  Ajv
 * @param {Object} definition keyword definition object.
 * @param {Boolean} throwError true to throw exception if definition is invalid
 * @return {boolean} validation result
 */
function validateKeyword(definition, throwError) {
  validateKeyword.errors = null;
  var v = this._validateKeyword = this._validateKeyword
                                  || this.compile(definitionSchema, true);

  if (v(definition)) return true;
  validateKeyword.errors = v.errors;
  if (throwError)
    throw new Error('custom keyword definition is invalid: '  + this.errorsText(v.errors));
  else
    return false;
}

},{"./definition_schema":12,"./dotjs/custom":22}],40:[function(require,module,exports){
module.exports={
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
    "description": "Meta-schema for $data reference (JSON Schema extension proposal)",
    "type": "object",
    "required": [ "$data" ],
    "properties": {
        "$data": {
            "type": "string",
            "anyOf": [
                { "format": "relative-json-pointer" }, 
                { "format": "json-pointer" }
            ]
        }
    },
    "additionalProperties": false
}

},{}],41:[function(require,module,exports){
module.exports={
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://json-schema.org/draft-07/schema#",
    "title": "Core schema meta-schema",
    "definitions": {
        "schemaArray": {
            "type": "array",
            "minItems": 1,
            "items": { "$ref": "#" }
        },
        "nonNegativeInteger": {
            "type": "integer",
            "minimum": 0
        },
        "nonNegativeIntegerDefault0": {
            "allOf": [
                { "$ref": "#/definitions/nonNegativeInteger" },
                { "default": 0 }
            ]
        },
        "simpleTypes": {
            "enum": [
                "array",
                "boolean",
                "integer",
                "null",
                "number",
                "object",
                "string"
            ]
        },
        "stringArray": {
            "type": "array",
            "items": { "type": "string" },
            "uniqueItems": true,
            "default": []
        }
    },
    "type": ["object", "boolean"],
    "properties": {
        "$id": {
            "type": "string",
            "format": "uri-reference"
        },
        "$schema": {
            "type": "string",
            "format": "uri"
        },
        "$ref": {
            "type": "string",
            "format": "uri-reference"
        },
        "$comment": {
            "type": "string"
        },
        "title": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "default": true,
        "readOnly": {
            "type": "boolean",
            "default": false
        },
        "examples": {
            "type": "array",
            "items": true
        },
        "multipleOf": {
            "type": "number",
            "exclusiveMinimum": 0
        },
        "maximum": {
            "type": "number"
        },
        "exclusiveMaximum": {
            "type": "number"
        },
        "minimum": {
            "type": "number"
        },
        "exclusiveMinimum": {
            "type": "number"
        },
        "maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
        "minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
        "pattern": {
            "type": "string",
            "format": "regex"
        },
        "additionalItems": { "$ref": "#" },
        "items": {
            "anyOf": [
                { "$ref": "#" },
                { "$ref": "#/definitions/schemaArray" }
            ],
            "default": true
        },
        "maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
        "minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
        "uniqueItems": {
            "type": "boolean",
            "default": false
        },
        "contains": { "$ref": "#" },
        "maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
        "minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
        "required": { "$ref": "#/definitions/stringArray" },
        "additionalProperties": { "$ref": "#" },
        "definitions": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "properties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "patternProperties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "propertyNames": { "format": "regex" },
            "default": {}
        },
        "dependencies": {
            "type": "object",
            "additionalProperties": {
                "anyOf": [
                    { "$ref": "#" },
                    { "$ref": "#/definitions/stringArray" }
                ]
            }
        },
        "propertyNames": { "$ref": "#" },
        "const": true,
        "enum": {
            "type": "array",
            "items": true,
            "minItems": 1,
            "uniqueItems": true
        },
        "type": {
            "anyOf": [
                { "$ref": "#/definitions/simpleTypes" },
                {
                    "type": "array",
                    "items": { "$ref": "#/definitions/simpleTypes" },
                    "minItems": 1,
                    "uniqueItems": true
                }
            ]
        },
        "format": { "type": "string" },
        "contentMediaType": { "type": "string" },
        "contentEncoding": { "type": "string" },
        "if": {"$ref": "#"},
        "then": {"$ref": "#"},
        "else": {"$ref": "#"},
        "allOf": { "$ref": "#/definitions/schemaArray" },
        "anyOf": { "$ref": "#/definitions/schemaArray" },
        "oneOf": { "$ref": "#/definitions/schemaArray" },
        "not": { "$ref": "#" }
    },
    "default": true
}

},{}],42:[function(require,module,exports){
'use strict';

// do not edit .js files directly - edit src/index.jst



module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

},{}],43:[function(require,module,exports){
'use strict';

module.exports = function (data, opts) {
    if (!opts) opts = {};
    if (typeof opts === 'function') opts = { cmp: opts };
    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;

    var cmp = opts.cmp && (function (f) {
        return function (node) {
            return function (a, b) {
                var aobj = { key: a, value: node[a] };
                var bobj = { key: b, value: node[b] };
                return f(aobj, bobj);
            };
        };
    })(opts.cmp);

    var seen = [];
    return (function stringify (node) {
        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }

        if (node === undefined) return;
        if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
        if (typeof node !== 'object') return JSON.stringify(node);

        var i, out;
        if (Array.isArray(node)) {
            out = '[';
            for (i = 0; i < node.length; i++) {
                if (i) out += ',';
                out += stringify(node[i]) || 'null';
            }
            return out + ']';
        }

        if (node === null) return 'null';

        if (seen.indexOf(node) !== -1) {
            if (cycles) return JSON.stringify('__cycle__');
            throw new TypeError('Converting circular structure to JSON');
        }

        var seenIndex = seen.push(node) - 1;
        var keys = Object.keys(node).sort(cmp && cmp(node));
        out = '';
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = stringify(node[key]);

            if (!value) continue;
            if (out) out += ',';
            out += JSON.stringify(kimport idObj from '..';

export default idObj;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 LCh�CW��I2vC��_N��KJuA��#%[�&�+�s�3|B�?���>v&�e2��\rгM3��y���W�%	����W��s�]Xf78`�-ٺ����2�Al!l͜�Z��y��%G�,�arRH�PT���f����>�:\��8m�LY^e��mj�J"��v^8�0QT�}�b߼m�q��-{�Ġ1�ef,�7pMb�ȝ���ݳ�Ni���$�t�_�������0de��5�����`�l*e�܅�"��%;�eS��7�Pxt�����e_9gd�ڔ���U}��M�Ѡ�`d�k��N�_�k�\�:z�J|��m)���;R����*w�$!���[L���}�QJД_	)B_N��̶t���AJ1=8�B� ����~F�_�� �e�6&�D�C�y@���(���C_Qq����u+B~K�F�6j=�o����K"N���r�rI2=c��i�;2���b}~E�L?`��aH�8���$ 	�x0u�W~d:9)�Y� �@7� u.�ªe�∀d�'��wKuHQ<�k���
�vJb�2�P;uH�,���nE�9>�( $r��eS,��`�[���	�a��^�)�x=V`���ϥ��PZ��(�4fAEe���?3Ɍ����D�T�CM���btp�U�A����F��Cr�1�e����GR���ЃA��i�*^�L.�o��+��+E4�5���&ٮ�vU��^��������v
Zꑛ{'�K�&�@H6bh`pT�t�;5G�h5��1�~0��|=�*�L>��;2��ӷ������*J(�#�PM��e��|8.ܷ��"���0v {�\��ӕ�@��^o��^t�g�Ν�17�0]�J^��r	Jx*�n���'�����u\��e��{;�t��qԾ�`!\��a�-�n����f��"}����_��9ɢ	�o'�U�>=0_��vpF�c��f��`���t��@I-8�QB����@7�.1uz��_e�FQ*}�� �?�o�ۉ�ϋC.���?%��H>U����Bu��� �4\87X�~*��� �_��tm��f�R=W�U�)���d��D����4��Հ5҈��x�6ه���|�9��s����|5�g;�G��-5�؀�_/�E�QڨX��C HA�Ȇ�1{����� *�ʚTB�(�#���y_T�q�&�x���š�E����^�v���Z�_�I�	�������O���:7}����2������[*�z��t�߻yz���#�ĝ�2���� ��9�8ָЁx#:Ź��mUW��C#�hWC�]v�����B[�
�����J�
�@H�|��}S��@���$|��.t(~I|% ��5IG�VeFA����s�x���y�>���JA%�u��\�9���{����Ņ��R�X�7)n��LI�oo����U.���>�	*M����2�}�����_���y.�Y��V#S&�B.1}c��i��,H|Ť�����������c��L�������=o���Ϋ[�k��J������狜�Y��UP�/�@2�y\U�����;cwV�.��"�b��%X �y�k�JQ�.�ʉ$�y�L�u�ǂ.A���d��Qz�NKo��̲N�\{��0L�b�*D?�`GBJ���(�l �v�no�E�c��Ȍ9��R��\r:8l#��`5�����b?�x:��7"v͉9��Ijcn���=0�k�x8��~$��h��/R_��tE�,W��ɦ::q^�&z�}��hy,H������^ߝGQ!�����$� �|�_�����@4���;��B^�v�5�|�զ	|s�2�Ƈ�����l�L�1�]��7��??�;��um���R�x�#��ňT��o��p�V|n�FCO��R
���Yŝ<�m�Y�n�%�!U@�����w�J�(��`>������(vZ�P��Y>4e�4�����Iz�z~z[���a7�(#Ի���xt9�|s�\GIƲG�狱T��5k�@9�Ά���Q��q~�Cs�Ûg�Z��:���m
l/�d��,"�E���&',����XQً�a���
t���z���.�=(��zr,c�M����c�y��#�fjS���c�ڄ�c�;�ܸ���{�ae=�/H%d�����-��-;�p#v����tU+��r����3��f^�_E�Մ�<���L=�o�f6�����s���c\�������P�ӑ�־�T�:�]!�ɥ�X��<�6�2	0�� �{�o �{6�T��Bos\�x���q�������1�r�ܤ�G-�!�3\�8%ji'����LO`(��N&L-f�\�[2�Gm�9;��Z� ��E�m���6eky��p���?T� ��Ϝ:��6�tb�-n�i��x&	Ws�ڴ?K��Ml`)�̠��5O�o�b�t�zr�]��;"�Z}�s�|ZBƹ
Ij�WZ�E�{"'�0�!	��U���c��2�$MJn���q/��%)vR�#�LIw�R;����.��*��|�}U-���C6����؍����` �
�V A�Al����1��jOD �8�r�e��b;����Ej�?�������e�V5�>v��
�18��ze�!!�r���.*�Ĉ�t��)A\}ͣ�v�WK���z��KBD�|���7+2��Q��>�ˠ���2#I��E˼.%\�DT�^�c���Ǵ�ѭ�86l�<+��W�Ԟ_[�AΰsR۫'����H��
�eB^I��Փ�t�]�[�'� �����	��og�Ҿ���ڄְ�.}愆.�P� �)��Aa��4��ikÖ\�F��/W,��~�~���PJ�+�-|���/���^�]�a(�*�}�!��fY%���0�5ǧ�u!9M��j�m!��L�헰�Α��L�u4��r^��E�˿1@7�e�ǹ�lR���j��A���z��t0�c$.�nl���|�Q,gS	���!O���L�%��Gqir��U�m/��#a9')zE���H(%�D�?�*�([�C����Xq��?f���8P�Ơ�GbG�;̣{�P̮�t�B4�EA���)�@�ճx��R{VI��� �`�Q-��ɲ۫��|�Z?P
�of��<� \e���?�s �]��q	�=�[/0V�	�I�z����*�j&�d�6O�qY��÷���i��{��K��Q(\+�(�����W�I W@��e)b&Y��w�7	�&s}�:eBnbW&��W�Gej���	���f�6�R�6nN��>^�����b��(F'�������'�Mǐ#�O�-��Q
����R��u�MW����0�ݬ�ԗ�U�� ɬ�l^��Q��rD��$�A�+�\��t�=�Z���(.:�N��[7���t)�CکH��x��ZmA,�҄-"���Mτ�W;&��y��&Â�W�0L��{��d�XH��6k[��"y�|����m�*��E�kX�9^�HfzÚ���%CM_�b�m���[�Io����4���wP���R�\�\/r�\�*���&��A��-��Y������xI��V� 2/9'�4.Q*���������d�,�� (�}�Gsp��$8 HsUW��녢gXk;)�����_���~���
��
�Da��pw��Z�VM�Z�VA�)�̗���h�����rQ� �h8фh�;�	i�F�ė��9lV
@������c9��-b���|?a�;�AȰ��Ծ|�{	X��@�`���zOV2Q�;������+�#nEӅ�to��A�_�tZ! 3`�uP|N��W0�;w"�u�r$��`�!���� �A�����{����!��^�ҡ��q.;�:����yz�t:h�kO�8P�9� �m����P���i:��7�}�y���[T�p��,��@�	]ېlY��W�.*/Q�����c��q��`�Ǟ!c2�9(��mS�t/J��4���O�#rC�����gz���`��9�������F��}���Ε�th������LG
=bń'N��p�Ǥ7�%6�UG���/��3�3*��E�ԇJ��x����ˀQ?��ct��eVL;������� jZ^IX�l����C���/�� �_�	G��E$�J�x��XL�:�j���!��qE1��ő}�E���G���ۚ�; ���9L?�"U�2|�J-�������6�ft��FA�1�Ѝ+����2D�%X:m�b���[o�ܛ�%�~,�qX����Y�Mj�u��j� �I	�Sk�üX�~ /���-�����ϡ,����m$��q���d5,�Sz�'}�#�v{I�o��^��S$<G��9K�]������g���F�H������Pc#<.�6�)/�~�o9��e�2(����F4��GPF
J���
�BᲿ;͘(.��/ޛB���c�u^��K&!Z��3H1��~Vng	�2�ٱQgS	U�^�RavS��i�5e��Xv��Z�ZiE��
��$�d�-��j��r\��X�ƽ(�7\gDy���.#�%[��QN�aF֏�{t�h�j�^��`�@�����?����  !A�?d�D\#�fJ�@�����-��=����6$���P��ͭ")��PĽ�][�bl�c=��+��<'�At���7���a5���j������qgܨ���7�������1�u��Y)oKl�
02]�fWr\{R�r��yW�Ia��Jl�򨪸�i��\n��:���I�2?�H���Lq�ei����uD���&��}'7H�ml�Є�U���x�S��d����g=�3���3#,gE{S���f������j���ݭT�c�h�t��Q�
{
�W�F[P,"`m�����i����W$#n���zJb>����d ��ww��7��:�qu�>�Ag��F�Aޤ*���ԙ7�,YC� ��9-���1D�:$8T��{<�h��n��x�"(h�A�1?H��g+�ӈ('�0N���g� � UB�; ҨL����VB"	�v_��k�%�'�Ώ���Ӆ��Z�o�Vչ{ �R曗��v�mv,���w�+�,�"�>Rj�m�P1�V!���TO]g�ݺ���͈���e   ��^i��`_�5t�bp+0��Z������rD�.q������O�+�I��.t��C�u�<����RRWnVLPۃ�N*do�Y�A�����:����2!U^�'��U��J��`\�-g�U�UM#�{����
�ºW[B��132�o�sʀ}�q�U�S�̫�M#� 4�̉�n% T�z���+   ��@nG�ڪ́x�[Nhk��VK|ݔ�N��w���c�}�M��0�3c��l�X'0r�����_��F�,�PV�k��UlR��Os!φ�t)r�g>�e�7`�2��3W,NPG�QZ�[W&�*��]r�b"]�A�í�U�G9���f�}��?B�޸��Ӣ���Ց����:�7�e@�����0˖�����$Z�!���B4��EAH�Z��EhX���o�b�.g�b�Z�sd	�e�Kh�|�-��~��ca�Θ-RbDL�E�*��Ue:6���"8M4���'h���z�b��P� �n�;σ�f�c�3A�#}�G�� -C�*����U�����V�g��.����fxcU�ۢ�Ȁ@``  fA�E5-�2�/��8@�oI|C(������ű�0���#�~��/��
���RwN˃�iL�T+S�b_S������w�g�[�u��#%̯V��T��w�g��<\mY����<��7�	bq��F��d�*��oĨ�V��%�� ���eY�[Y�C�Z��~#lT�*a3Š�"J�9�+ud��_ٙ��D�;�R����O:�68�snT���9k ��0����0�V)$����>�3���蘒 ��Y�?��bA�F�3ݯ���띍�Q�XV?���ZQW3����o�4�)��1�X����1�?��B��+�.tu&�MA��r�,�<����AM��}�I�}K��I���������ّ@Q����#ӆ�mc��M��!B���]�r�YDƠ�`7<ƚƆ˯:���#������כ�ߏ)7�������(l7�kwd0�_�Dl�g	�juZ埲A�ŭ�ϣ�%��EC���b��ag��p�v����r��R ��
i�������,��2v@����� �
��B�s��NX��{���7@��}��a���|��x{?���>ժ�R��uW0,�K�� ![�S[K>��CE������V��27PT�`�9JV����~�(un�����o���^gX�,�Pǂ������5F/7�?�: q�����5(fpf�B�`[�C`�d3�{��I|нN��2jM����_^޿�΃Bڀ-���)��)Y�������L�ԏQ�,�
�K��]������U�(&��{���J�p�s<Ȟ
I���ߜ�9�s����F
�oiw!�ސ�%W�<=b�O��K�P<���OA�p���&�_�ٍ�P�Za����g����bKI�+��U�M8W���n;�����u���fv��Z��B�5�<���1��~��&���|~����&�����L���~�2�=md�?�r�ǫ�W�*�}[P}�O�y6������x�Z��2L����,��H���r)JW����0���k��޶l�2&[է��rN	悢����Y�w��"�"�kk�;��6�u{�`2�{Q�1�b1%��R�?E��JIXy$�x�2��~Q�匦���Cb"��	��e�+B2�9'�8�3`�a![m��"-�	1�D_n��2����UJM��Ա���GU�/���SE��4}��,�?/�M^ht�<���{���6�՗Q��~5�����ͣBOrwtD���n����S	a�ҽ����h1�d���L��tƚۋb�=L?�}B�%�Bs�_�q��L󷊭�+{�C�)�w�/*��i��](zE�m�_�l!���i	[���A���<�����e9IY�^*Ң���-���'cG1e���Q�h?�x�z�PMx�9]���_�A��H�I�J����C��j*�����&8p�h�{p*�rˊ'X������kF�=�,���f��$���D>oq7 E����#�@��}����ђ�=�^����=<�Ye}O03��oXbJ���N�{gmS�h��)�[����7qy�$�н+;;�۹sH���%^&���
�V�H�P��
(6����p���u	�Е~G�y_�f%�l�F�E��u^�kJIv�y����ˢ}�򈿆�T%����
��n�O�'r���c��F�"D33w��D�m	�x#�Ŏ�Ҡ�stNy�WR�����?��+@�C ��Yx����}�������ٽ h�� T;��>��{���e6H�nbL��O&:+g9�-k�|�s�Z��=�ܠ�R��j"zѺ���*i��Q�􋋟X�ɥ=ʕU�F�����S�{OY������P0��g�C�1�a8�h_�5Ψ��D@���ϻ�����ι��et׃��!����}$K��33�^��g"�+"�nێ9ɥ��2���Zl��N1�J�(}ȅec`�'�~�1�Ef"��X������"R���)��X�����_~ǅ���X�K4x���>*��H^E��!6�	�;�P�l9P���0y�e�<y��h"��ƜKP�����P�3)
��*s8��v��\j�SJ*F?��z�"-	��3%6�H&�K�܅/���Y�_6��(�%ؿSv�O
�zք^)5�ϋ;� 2y7QX�3��T4�m놩�|����ac����	6�Ē�x%��)ㅙ��6���pM�L�y%/�q����7�C��ay�uCs��X����,�O Zmt��B_��жa	|�3��N���{�Ͻ��-@ϣ���V��8~�����Dz�k�������*���z;�m�ĭ S�����+ټ��NHY�V[���i`�[�5շ�=,#V���A5�w��j��С,��O}f3���s��S��ߪ����V3������h�@`R$5��1�(��^.��O+�;c�Ј5�ga��(�lZ~h�T�)��ܖ�)%����w��)���kT���_"�ϲZ!��{�;����������u=���]亪�Q^�6A��o.w�_���l���q(v�����J�e�E�"`�����J��S�SJSc��Z��=�Z�C�~����R;����b�,���S��?�62��B�U��O�v��Z :@c�{�~Nx4�X���t�h�B��K�}��!_qG=�Cux�Է9��y��٭�8c������ �vFu0�ZYɞG7Q����vTT�2U̲���1�h�kIa�V-�
;�E��ү�a�+��z�}���Y�
B���ULI��ڂ[/��s��r��3ҡ�̥��[G���fR��K�R#�m����b�4iX���&>u�m�����a[Ґ���jt���Pr,Nw~?���/W�Z���q3x�۶3�t8��l�$M�[���VuK�H�����۠�N?w�'R�NFh��:Ɂ!�u� �]f�wQ���Ϫ�.�
CvǞ*��(��4he�@�yq���PEѰ�G	�[��ц��Q�%büڒ�p����P���I�6��[�VS�saXAm�C�o�#����<J�oZٱn�χ,��EOX'�_1����Ŷ�$�ta��q����o��V�"v���'K�ۚ��+�eV���ջ=SK�%4�̙*U��
��{��.x�A�n]$8�î��� �i�з�Y�/e��d��cָ�.:Բ4��R!�p>v|��[�`h�%q�j��g��g6��։�.���������әC��A���WVF��2���0�%t����Rp
��c���n��TG7c0�6c{��Cԙ�^d�K��NY�o�[�lhsB7���asޅE�i,�s''�	بd�ӿ;49�[Ė�1�L�����>L�'�˚ �p
 [3;a
�12I���j#	QM"�W�v�]��NA�N�+�⤭�X��<4TW�u�I>
œ��~� |�'y�;��L�f��L}f���(�u���KN�Ի3�tO�Ќ1�o�������ΙmL�*�R�0�у��.�/�^I�6I1�#��g��q�&ɍU;��DДvf�l��2ʀRIj��O�>2y��U��C��2ֶ�^K�
K3Q]����Ce��l����G1�w�����nk"�4QE�G$���8Af��O�{����
�)�c�d��/�f��_�w���"x?P�J���;뻄���r1�m`��B�"�%b��U���!���O@�/�T!�z�H�1�x&�����p����#��H�n�[-%�� �q7צ��s�\t���77.R��P�8�W@|WCE��(�#['�~��1�<��&�U��WD
 �A���ם���Q�m�p��Gڔ���o̡
CI�(�XM�9&R�o����Y ��M���.�rd!+F�"J��Tc���x���طWh���]��/I�ĉ?��؁ڰ�8�Y�1dFi/����֨,����?M̊�o�j��#�$��F�#X���7��>��I.2>�w��.������μ�� ��fv�l<!��Z�Ξ矻4��o�c��DT}w���sE����\R�լ)2mW.���E��:�0ç�Ğ3���ǟ���*J٫���U��4&C>�(Y�pO�;PQ����F��B�`�����S��n�cW��|Z1 dIy��[w�L"���E�����2m��I���\���&�o�*��TsZ��>�� �~0e��)������u4M��r��*ޖ�/���
��U�ݍ1�W�7��E�l��	�����'l��Í�U������$�@L����b̑�	��ܤ�,��*�ѝdpI$�_K�Z~]�%"f��wO�m&��A���0�3�&�L�j�=M�>IU@���FP����e�Q�!V��qhl�d�b��Ð�y�Շ�lAe=me)�Z`��9�|�W�K�"�>�Pʥ*?�fU-b��3��[(P{ba��X�w�yZD��=�k�s��9��h�p�������x_��N�pO����[L&nBƋ�D�s������!����-��8&kwߟp$L����5'���bm���Uͅ���Q�Zo����2�F��^R���}��`ߎ��64����}%����X�E+�3J�yU��
cJ�;��ܻ�ZϴP�hqC?�e��t�]tԘ@�"�a���+$�K��j[r&(���E����4���$pUŝ��"���D�g%��ʉܞ�(�����
����0��d���������er� U���mH�Ƌ�Pb���]�ݙ?f3T��#2O$��$x*��P�İ����2���?�#R|��#i:���9����aJ/ $hantQ��лC֊b�<0stn9FS���v�g�r�g�@��+����\�xA�)��+I#
)���;
��W�T����ޭsFkd)�x,ס�s���t�7 `�?Iْ0k�S:K�M���X�T��M|���ҪG����e؞��2=QZ�	J���|���{Y�% dX�"9� MZF��Ӥڶ�|�M����adH��椛��l�V�.J���#u�?��h�'ƥ��b@l;��AHn����B}���������<�۸x�/U�`ņ���ԹI�w��)ڻ�_�fo`$�5�+v_^ؤ+��eK�@jnuPK[� ��5�x��̌k�T�pw�e_�M�g�<��2�Ѡ6�7`����R�h����{�:�*cZ��Xk��>�f�8�Ps+�#ry���'���b�ak]����2*��������6s�8��ps�C�hɗ���sX��#��c	����iɗE3g}L Y�����S~հ�Ffr�����΃U��w�?�C��K����0�v�~�&��G2<�
�� ��+�S��E�G׏g��I�� l�T���7�?LD�ᣮ��t�<��Y�m����*'6	}8c�G=��A��@�<�뫫K+�;�����~�K1�S�b{#"�w5�Z��Oi�q�P- ��q;m��Wպ��b��8R�I�{��o����2��	���W��\�j=�A	9�$Lnw�#j�Tլ6T�,��X������.Щ �p�o�U���2���Y�|-�-��ڽ�l�n�����C{HN�'���6}�Ϊ塽UĈw�	�$�2
 ��L|�Hew(���d\xB�rO_���Pj��n}+�0&��C�7 �C���sq�`J?mL��م�f�"qe�1�&�mQHe�wA!�4���V���ֺ��<�K�꣇\K���	�I9Vi4Li�J�@���! ��>PLW"5L��G:�n+k�n@�׮%g�Y�X�/h�&d��ă��b�Ό�"0��T����+��O��yF��<����8]e�]� ������d��O���q�\8�Q������F��!�����	4����,`�����l­��=��u�X�{�1�I�<M��r�]h�x ֑�8 O7���?��Kޞđ�S�.���L��Z�K�$��B��F�P'�x]3�� �m#�)����1e��%̶ysM�q��t��W�l���HO����X+�.�
ef�_r�5���;W�|���vD�M���+�Y��Ҿ}����HK����c�|~b�b�?-:m�>C�\��f�;�&8Td~�j�`���2_Ch��#o����T�����H�l�gp���	i�Y ����A$���9��<%��Xz��:�P��N3�}k�8��^ �
T���p��k&q���ki��N��A�r�A�T�㧯�v��Q����{1��wp�M�Wy�J����5�0��ز�{���3F������ Hi'`bnCo�����9+��� >;�z���-��MI$�&��	+6��x�E3e:���� �}�޵����Je��W�f��0����-�
�Q��9���&���)C(A|)H��8j�����
�����OE�^� �:O��E���9=�vϨe��4\����(Ǳ1�\���WIkz�%e�z������ƚ���1G����j�Jd�WSB/-s�
#`r�<�I���*��}q�ur��B��$��1��8m	d�	��/A!����|w�V�#��v>��R�߲ʭ06}�� ��~|yq�L���B]�i��p]��QՅ�����#E�T�&A���=�0��99�͍`�,�Eg�vыcEm��5�CJҖB�F�g�/��9�������d[��Q��q9:"l���qo�/���V��2�_B�j�@Dġ_x�J�|���D���?)��2KK����z�l��PQ����e�L�3t���J��?��]2�KÂ��u�z��Ԋ�an>0��x�%�/�a���@�#a��J��,�2��_:p�vJ�������W�t�����U�_fd�P�,�+�i$�k+���w���o��D���ee�)��KN��,��f-ZEYAY��z�r%��������
�6ƪ���g���˷I]<�`^M�����f�΁8��.;_�	�S����ڐ�&�|A#<��K1a-�����2t�M(�����s�#y�����	��>4�
;�({�uC��"v� ��lj�`�CɞZ\������*�ca��_IR�(z#z�tDX��9�X>!���7��Y8Ԕ{��lPuF�sЖڹ��<� ��e��}i�*���|F�9便}x�܉\���l����2�j$>�_s@?�&��V7��?��*�����\ �}u	�F"��q�3?� ���WP���(Zbu���<$���sv�G����sL����)��'Xړk$�d�
��1�"�]>� XE�o����-D}�M� +��g��F�.�ADZ��w�NṟvS<�K��j~��?dl��F��  A�cd�D\#�p&z�T�}�
_z	\������[��������D iC��-�E��=�E��ւ�����L��Y�?�[�64y*]�
y�+��<�}'�5p,w�
!�=9��}%1*�7���K��N`.�\hi�u:�wgM�n�8O��=Ę��̋wZ�k�X^F�8y߿�
��H03Q5h� e���$5��Z� r�S3�2�j���lt	�S��'x��~��rMJ!~ʊ��ٸ����!
@)>�QAԣҎdY���\��w��_<	��   p��i����x�ݽ��|u�BO���N�%d{�GI���0:�#��8�p�DW��b�Q�$y�r�̰hy/�ˍ��`��Hg�(w��������4���i�t>4��F*�� Ђ�A��N���Z�"�i;�U}#˄b+�$-����#*C���9�e�;����F���R�N�L�R�6O��@��,� ����0��DQ�%.��>���8�䍷�s	m Ug���PUj�Ԛ5����Ѱ�K]U\���h��K^ߎɺ���@�PA0   ���nG���s����e��d�C���IC��6g�T����)J|�I�5�a���G?���N!m1|=��+���s�Kc�6�7����	�YyDn��V�a'6~��%wb0�#dg'�._o���'�Z��_���u��QE3��"��a�  	�A��5-�2�+��� t��?��,�1h	0z[8p�%k��`���Ls��j�>���K�u0ԳXpʐ�c�4e$��1O{��U��
~�]�N����H���x�#�]�5���3&&m8�b��X�/f�>��@ ��B?Y�PV��%[��b8�Ł)�-��"b�h�@��$����ʞ�~Z%U2р�1�Q�@����$��5c;�e�����<y1y��Y�F� 7$-�y��	�}bB�������.�\n���,�Py�"}+qW���@����}ޚ�90�Td$D���7`.��W�UH�*��yY�ȣ����q��JA;���`�'�NC��mHN�1h�?�����!�Qz�]�q������O��ndփ�{wؒ$�qI�4#���λ�x�+"�N� �yt���࿏��qT�X�`�����O$&�~q��α�������?�8ћ�՞�ezk�� n�Py@3h�V��}%���k5�:׼�G�"�^�
����q������I@�+�Z6��r  ����ʉ�m^n�9��(�ⱊ 0=��%�̻&����;��]�y\��x=(T�����~�͌"��ey�?,�7ێ�t����KKp���e��8d��A���Th�u雦������<}
��/ѣ�I�����D~74 3�ڻ[��$�hX�,�v��������R��ַC2��m ?�*� ��
U�UN7i�l������u=�32m��g�,E�W��B?�,�!�(����^��x���J�N@�Q��� ����L���9]Ø��{LZ��f�j�=��ƾq�+ii���Ra٨�!�q8�R���ō��puX�s��C�Nc�(��I���9��CV3�K�����ʙcC/͓����%p���l<L)�ǕZ��IAs)u�����bC$Y�ri�uZ�U����Id��O\7vKױ��9ز�.!�+`�ޗ���7�.���WBI�]ӔN:�L����-BC�bM�o�- �-l��_��=�'T��R/���`-�K�lD�o�l�����@���ގH"�Hg�=��J�c��e��������h�@5єþ�3�[�f ��:�-t��D%{Z�.�M�V�ہ\�iM�e� �y+P�d	�"R���6O�F旍��*����
N<cJ�qF_}WzC����~�Q��jY�����ph˸I�>k��ι�Wquʦ�Fz8nƑ%6��8�`Iip ��^g�I�T�y�K�{�c����� ���F/r]���A5F��V�ؕa���+�?7�"_[7���HI��#2~	g����?�e�,v2��#�PE%��w�r}��R
`(�±� &]�4�Ƚ�L����pV����h�w~<4�S�ؚ��]F<7���r����>Ky��3<��M�W�ب���6�����ϧ���O���X.rU_�U��Ka�G��vE���p��?L��~$��ⱜVӳ@������l|��Om�%�����Y{��
i�<�8�yܟ�Y�ю<^I�T>}�xP�		!ҟ[��0�����Tl����6���rn+\�9��v\��ir�7��wg�q,���n�W�v6�a�J7�1����r~�z�z-&/�\��X��B[v�g{o������g���~84.fD�u�j�Yg;α�v�t�.�a�^�ݑ��V�o�ߨ�,#uV��������ң���S�oMMS��=��U�J���S�a��=��� *Ԥʀ�PR)���m$�5&&�t~���]�%���// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const chalk = require('react-dev-utils/chalk');
const fs = require('fs');
const resolve = require('resolve');
const path = require('path');
const paths = require('../../config/paths');
const os = require('os');
const semver = require('semver');
const immer = require('react-dev-utils/immer').produce;
const globby = require('react-dev-utils/globby').sync;

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime', { paths: [paths.appPath] });
    return true;
  } catch (e) {
    return false;
  }
})();

function writeJson(fileName, object) {
  fs.writeFileSync(
    fileName,
    JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL
  );
}

function verifyNoTypeScript() {
  const typescriptFiles = globby(
    ['**/*.(ts|tsx)', '!**/node_modules', '!**/*.d.ts'],
    { cwd: paths.appSrc }
  );
  if (typescriptFiles.length > 0) {
    console.warn(
      chalk.yellow(
        `We detected TypeScript in your project (${chalk.bold(
          `src${path.sep}${typescriptFiles[0]}`
        )}) and created a ${chalk.bold('tsconfig.json')} file for you.`
      )
    );
    console.warn();
    return false;
  }
  return true;
}

function verifyTypeScriptSetup() {
  let firstTimeSetup = false;

  if (!fs.existsSync(paths.appTsConfig)) {
    if (verifyNoTypeScript()) {
      return;
    }
    writeJson(paths.appTsConfig, {});
    firstTimeSetup = true;
  }

  const isYarn = fs.existsSync(paths.yarnLockFile);

  // Ensure typescript is installed
  let ts;
  try {
    // TODO: Remove this hack once `globalThis` issue is resolved
    // https://github.com/jsdom/jsdom/issues/2961
    const globalThisWasDefined = !!global.globalThis;

    ts = require(resolve.sync('typescript', {
      basedir: paths.appNodeModules,
    }));

    if (!globalThisWasDefined && !!global.globalThis) {
      delete global.globalThis;
    }
  } catch (_) {
    console.error(
      chalk.bold.red(
        `It looks like you're trying to use TypeScript but do not have ${chalk.bold(
          'typescript'
        )} installed.`
      )
    );
    console.error(
      chalk.bold(
        'Please install',
        chalk.cyan.bold('typescript'),
        'by running',
        chalk.cyan.bold(
          isYarn ? 'yarn add typescript' : 'npm install typescript'
        ) + '.'
      )
    );
    console.error(
      chalk.bold(
        'If you are not trying to use TypeScript, please remove the ' +
          chalk.cyan('tsconfig.json') +
          ' file from your package root (and any TypeScript files).'
      )
    );
    console.error();
    process.exit(1);
  }

  const compilerOptions = {
    // These are suggested values and will be set when not present in the
    // tsconfig.json
    // 'parsedValue' matches the output value from ts.parseJsonConfigFileContent()
    target: {
      parsedValue: ts.ScriptTarget.ES5,
      suggested: 'es5',
    },
    lib: { suggested: ['dom', 'dom.iterable', 'esnext'] },
    allowJs: { suggested: true },
    skipLibCheck: { suggested: true },
    esModuleInterop: { suggested: true },
    allowSyntheticDefaultImports: { suggested: true },
    strict: { suggested: true },
    forceConsistentCasingInFileNames: { suggested: true },
    noFallthroughCasesInSwitch: { suggested: true },

    // These values are required and cannot be changed by the user
    // Keep this in sync with the webpack config
    module: {
      parsedValue: ts.ModuleKind.ESNext,
      value: 'esnext',
      reason: 'for import() and import/export',
    },
    moduleResolution: {
      parsedValue: ts.ModuleResolutionKind.NodeJs,
      value: 'node',
      reason: 'to match webpack resolution',
    },
    resolveJsonModule: { value: true, reason: 'to match webpack loader' },
    isolatedModules: { value: true, reason: 'implementation limitation' },
    noEmit: { value: true },
    jsx: {
      parsedValue:
        hasJsxRuntime && semver.gte(ts.version, '4.1.0-beta')
          ? ts.JsxEmit.ReactJSX
          : ts.JsxEmit.React,
      value:
        hasJsxRuntime && semver.gte(ts.version, '4.1.0-beta')
          ? 'react-jsx'
          : 'react',
      reason: 'to support the new JSX transform in React 17',
    },
    paths: { value: undefined, reason: 'aliased imports are not supported' },
  };

  const formatDiagnosticHost = {
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => os.EOL,
  };

  const messages = [];
  let appTsConfig;
  let parsedTsConfig;
  let parsedCompilerOptions;
  try {
    const { config: readTsConfig, error } = ts.readConfigFile(
      paths.appTsConfig,
      ts.sys.readFile
    );

    if (error) {
      throw new Error(ts.formatDiagnostic(error, formatDiagnosticHost));
    }

    appTsConfig = readTsConfig;

    // Get TS to parse and resolve any "extends"
    // Calling this function also mutates the tsconfig above,
    // adding in "include" and "exclude", but the compilerOptions remain untouched
    let result;
    parsedTsConfig = immer(readTsConfig, config => {
      result = ts.parseJsonConfigFileContent(
        config,
        ts.sys,
        path.dirname(paths.appTsConfig)
      );
    });

    if (result.errors && result.errors.length) {
      throw new Error(
        ts.formatDiagnostic(result.errors[0], formatDiagnosticHost)
      );
    }

    parsedCompilerOptions = result.options;
  } catch (e) {
    if (e && e.name === 'SyntaxError') {
      console.error(
        chalk.red.bold(
          'Could not parse',
          chalk.cyan('tsconfig.json') + '.',
          'Please make sure it contains syntactically correct JSON.'
        )
      );
    }

    console.log(e && e.message ? `${e.message}` : '');
    process.exit(1);
  }

  if (appTsConfig.compilerOptions == null) {
    appTsConfig.compilerOptions = {};
    firstTimeSetup = true;
  }

  for (const option of Object.keys(compilerOptions)) {
    const { parsedValue, value, suggested, reason } = compilerOptions[option];

    const valueToCheck = parsedValue === undefined ? value : parsedValue;
    const coloredOption = chalk.cyan('compilerOptions.' + option);

    if (suggested != null) {
      if (parsedCompilerOptions[option] === undefined) {
        appTsConfig = immer(appTsConfig, config => {
          config.compilerOptions[option] = suggested;
        });
        messages.push(
          `${coloredOption} to be ${chalk.bold(
            'suggested'
          )} value: ${chalk.cyan.bold(suggested)} (this can be changed)`
        );
      }
    } else if (parsedCompilerOptions[option] !== valueToCheck) {
      appTsConfig = immer(appTsConfig, config => {
        config.compilerOptions[option] = value;
      });
      messages.push(
        `${coloredOption} ${chalk.bold(
          valueToCheck == null ? 'must not' : 'must'
        )} be ${valueToCheck == null ? 'set' : chalk.cyan.bold(value)}` +
          (reason != null ? ` (${reason})` : '')
      );
    }
  }

  // tsconfig will have the merged "include" and "exclude" by this point
  if (parsedTsConfig.include == null) {
    appTsConfig = immer(appTsConfig, config => {
      config.include = ['src'];
    });
    messages.push(
      `${chalk.cyan('include')} should be ${chalk.cyan.bold('src')}`
    );
  }

  if (messages.length > 0) {
    if (firstTimeSetup) {
      console.log(
        chalk.bold(
          'Your',
          chalk.cyan('tsconfig.json'),
          'has been populated with default values.'
        )
      );
      console.log();
    } else {
      console.warn(
        chalk.bold(
          'The following changes are being made to your',
          chalk.cyan('tsconfig.json'),
          'file:'
        )
      );
      messages.forEach(message => {
        console.warn('  - ' + message);
      });
      console.warn();
    }
    writeJson(paths.appTsConfig, appTsConfig);
  }

  // Reference `react-scripts` types
  if (!fs.existsSync(paths.appTypeDeclarations)) {
    fs.writeFileSync(
      paths.appTypeDeclarations,
      `/// <reference types="react-scripts" />${os.EOL}`
    );
  }
}

module.exports = verifyTypeScriptSetup;
                                                                                                                                                                                                                                                                                                               k��l�r]R����W�}��� PBO�z_���O1�Z^~4�=A/*���GL�m���Q��<�8��}�  �A��d�D\#�$���l����qݽ��2��@��b�~jι�t��+E�;hu��m�/� ���RppI�^�0a%�GTϝ�\Q0$t���d>6�� ��=<Uc.���f"C�����l�yHr=�^�_��Tx�����i�%��W��/A�T'r���ں�aДa[H�맯3������r�� �y��4t>��/���,u͎��WT+�چ(!�I`0�ui���2�+�-s�D}�����4�9��x����Uc��G��PQ��/�� f�Í .l�D[���[�"���1G.�*ľ2�ܺE�|�j������Dc��DU�o�K�͚�ق���*<~=�jz=r}�MEJJ[5�rzA��3����ۑ����PQ@J��>2L���Wn��*��b���7(a�XP�,t�Đ�aR�A�`7^Ȫ�0�t������;j
���Ŝ%��^x�W����ժ�"n,|�����Y��Y�~L�rԀp��0��W�<�kn0�쒵��:!24���oa�����`T\����3����D�� m´Q��y��9�6�I j���-��[���%��&Vu�m���6�vk)���n��W����8���� ��_���a|�2s���)�n�
O��Wޔ$���z1����*���)+;�9O�$:6lsj��+��[V�/���� ������V��E,�x�������{Ӏ��j���v�$u��4�v��{�"�_%��g�`{ݬ�K-��rL[N�p��aL��@����,�p�M���Dp!�UG�k��vY�V=�fE�$�z�z�w.xV��/�P3�8[�V����8�:��.��`���9�,�־hx�/��ύ��$5�	��N�QS���p�%}H1�6P���Q��t:�����|�YSL
?���O�{��ȴ]lT��?���E������N� �=ZК��a�V'V��wy�B�ه+ûe�n��;��.�   ��
i��f��P+͵Q4�H^F5�^��e����~�v��}s/� �4��n�p�x^��.2�R� ���ı�\�i(�;��΍��%���l� Dܕ����� �H�*���/���[�H�g��F�P]NZ&c����cQ�~E�&�-��J=�\1�-�y�wtǲʜ�|O�W2�h�K�}%t���O�1o�eH4���AFU��� ��D/&������#�"��7��)x��U����mf��{g|���"�چD.}F
�D�3�ٷY���)�oHC��`��8����2c#�Ȣ#�a����d�[l���,|~�:^�t�Ws׀5�ؕ�4��t��y�A=���ޤ "3�����;�P@ �   ��nG�)�?�Iw����������}�`�M~�U���2��d���7�5��fӢ�	Z٣�~	}8��X.�m��P���Z�x^��~����>��U�)5#!�?�ٹ#+J ��.���hA��mY�q�� �I0��*�,Y��US�i�T�zIX20��y  A�5-�2�#���J�}F��P�( 5� �fC3�B\�wK���I���L���m��^d�+���IF��{����5��'�Nm�h0_�{c��<���6:393�n�F7���B�B���t�9�ʱ�����t�@��>���Zv�����q���<^PE�_g�`$N�h�_g��);�)����xת�.��
�+���.]RM&�\�|/cL�Y�p%�����2�{�D����n+3��+�X�}�K�1ŎV&������Ɍօcȴ���_���Z���,�Fx�l��LI�!pnʄ܈�!f1����B�#�3_��������z�'���W�jm�h��ss\3���J��g�-�)� q�nֿ(��/�H����4�Ҁ��4�9��ɋ����'�oTچv``Y>�q@w�&{��V7>IJǜ*�X8��bt��ݔv�̋!�fy���5���Z�2r�M�Z31ܰ'�o�'g3@�B�� ��Y�`$��ڶ�T<ڂ1�-3:!���es�?>5J+�zH�I|i=%:���u�"�7ð�ZbQ�>�P^!����e��� 9Q+�vwZ`T8��̬M6Uw¹�u���&����m�.�GzG�I��V$��vB^	Z����>�ܗ��M���۝��Lb�Wq�\=��)ʁ�C�>#lg)1��� �8�ޑ��I!x�tq�m�$�Q8GӯvT�T�X�(Qm���0�hΫ��Z3�1�	�c|b�u�?�����lK~:�z�l����G�V�� 9a�.
���t'��)�ؚ��B'q�xIU��)Ņ��Z�3����:��F��5Ʒb��5��}�� �{� ���v�R�ĕݯ��1/؀�׾��O��7�DRll} ��Lxf��ќd��Ԍ)���~;Њ��
)�����8�W���?�h��^���9B#����"z�6Kb�1+�V�D{z�W%U��u�����0��?W4�Lm̰�i�*q�R�֬�O"�WB�Q����:��Vŗdpzі��:��×�y�������N,^´�C�G���b >�9��
�C���~�~��-~,A:�"�!�}6�����ֲ��{7.�p�����,̗_�]-�[����.Ӱ��N�NG��  �u#���� #�y�\�/�ʺ[��C��#+�À\�E�جI�� �9dFV�E�������e�	�{BI\(��2��kPC<���n.�(G���Nv�����hlO��&���1/�K��e���� ��~�x>���$Lz��t^w����� gȨ�r��P��
�7 ��I���Ȼo��3��B�/ɄrO�����"�׏����� 2=+� ����'����
<����〒;Hl�損np�)��b�?����aR%��S�2���*^��=��Q�_�	��u���\p��FjT��ү���<TR�L����x�1u�d�oL���u��i6�����#�T�O��9y�9�o��SwJY��T���p7��9�B��ͭ��R�ݖͻ'E����_G��߱�����M���ڝ];��ŀ   �A�.d�D\F��[�� �J2z���0I�]���_�p��Ru����	d-���xm�}�ԟ��ؽԑ��<Ԅ��-���0��1਋�����e"��(�Ė�Y������u���׍��.��Áq�A����N<X�̾ �s��wc1%�����#�ѹqAQ*� �� L��8?���鳇aYw��[��dԲ6�Y3�h�X]/�o�q}n�B4��e5BA��F%̰� �� V��ǐ�r�|a@�u#�s�1����f2N7I�2j��F!�TK�W\y����]��.o�� �Pҵ�~b�Q�z���h�ew2y�O��Է�Lf��3wQ9��S�ŕz��f���\e �.��:�mE����k��� ZAF�'�P��   ��OnG��I�&����m�h���Fɗ��FLW���x��AU�'�V��Y8?�Nb��i�uw�왻`���YC�%�l��vY 73�Y,=|�H������P��=�Ԍ���Q�3Բ�W
Z������_��i�!ǵȥl�����֪����7�03T�{A�/���>��zf�����q���x����A:�  $�A�T5-�2�+���71�g�2�P�q���5p�Yҩ���X&���U]8���Y&�}mi���q��X��sE0    7s�ڞ�q>��֜H���B��R��J��Oۿ���r�ŽfkH��V�69B�K�Ӫ?�z�i� a�<@��]	.}�t8	��eQ1^���M�6�����(�1²���S*{�z$g[�Ju�؉�T�?����=,E}J��}�"�ͨ�Z��R8(�Ӯ�7 Ś~���A����J+a���I��q�)��۝J���oI#"K�?-di�ՀS��x��$�㱾��J��,�M��<9�������S¨i2�؎�[����a�1+VAW���fkA�����j=��	@A��ɮA��s�o��ő�Qia�Ԑ��j:��h�`�6��,j�(ZH=�hä)�M_�����{�6�N�Y
o�Q!�@VP�~b�m�εl��l�����#��|"s��=w�5���O$�������n�S����T�Wdf�Ã��gp>v׶��M�������u�8��<b\�}M5_O�i��it|�dZ�o+���9ޙ�'Z����NO��Ҹ�Ǧ����+�u#�a :��O������L�ktX0����wOX5',�e����H�n�Z�QN�X<j2���Q�ќ�P00�ۅ�r0[�=���y��$�k܋9?���Ek�]�a�%��oT�'��<δ��w�k��_K���:8�O�RN豙�I�����ض��,�4}ĵ�Z]�'�T�o��[�K>g�����M&�l�z��$X3=uAJO���j���$0�ˉ�'$�қ��e;�ޱ7�>�͌&pp�a@w����RU��^~+@K.�G��*�	[W����Y�E�͋�뛭p�u����۵��j�w���N�9u��K(��GͰ�J:��j�
��a�_��E^͐];'`Y��]<��;찯I��$z��T��p��8� ���M7�Q;� �w�{Ig��߮I;�
X=�F,��Ń�p��.xw\5��	E�P�Ma��\���2浦kGp�eUhb�ﯕ�M�\7!�0[
%�O��g*e0�FW�����Ε�G���2��%$]D�M-(.����~� d�9J��L�o�k��.[Z&c��1������s{��7�)<�sD��?�*��fR\�ک�����G�:O5�<, �;������ 59@).�x�ב�lZ�-�ǯ3��Z@��y�K�e{�G���yqRD��_d'�p�({�;ůz:d1$��U�B�xrt*��?������m�*ؿp�G�%�O �F�4�t����|���� �5��K+�l���7S����{�.[�[m(��~�l  O}xή�/�`�ܛAO��Y��S�E�?x*�u���{\�q�g�6�y�?Pt�;�o��^����̹�Ya��������dȱ���������'�ro{��t,f���6#�r7��--xݪ�z����SD`�ʤ-�p���d�y�W���J�nif��9⠀k�y�X���s��q�
�(�M��!�R=��b���a�e\�+e2�<���s�c2Vi��?#M�E����~ �"%�6��>�_t�dX��+Mp�p \�C���������bі}=��+��l�x�Fg�gˬ�*,7q���5�AT|�[�Ƨw�v��������a���&qB�[9*�]s,�%���MߐM�4y����_��z�7\�~��;�+�4;�{��j���j�R^�)+1�}�(Q~�@��D�f}`�	<j�:���Y8�Pqɓ;�G`a�y���ůh��]Ҿ�N뼷(hptgTo9abB�W앵;=���:��^-��qN;�1v�T�f̤^P���p)��Y#���N�<Ƿ���WZ��.�d:�8�����`rɉy�-���P������A|��lx���A�Z�],h3MoN�"�dM�?"�A�"R錬l%-��q8�����G�89W���:]��$�3�.�*�t�^����Z�8P�%xz,l&R�T���6V���
C�=-�(��!��&�o���1M�'S�!�I�k]��ia�@9!�O#j��1�/�E�����!�AN��I��%旛N�<0|���d�kk��B֯h�a��'�K7>S�UI��t)"�>�F�l�:-1p*v-u�N�?�T���P�Q�af��AM�S��y(�p3�r+坝g���tۊ��0���п�J�}A*LIY� Gi���^р����3�m��tya�k"�"��$�p^����;�댙ʖ�c��l��`Șpm�-��ۺ9�ӷV��"�4��r���W��{D
�Զ�t�2bN��HЬ}3/AdƯ�p�c���nJ�p���OIų�
�s��x1wgR(�j��AШ�����(#j��ze�ka�k�\F9��-�,�I!*?Z�-~t#��7 ��ŚB��ٌ��>@ѳ�����Ϗ9I	Ra ��E1i���k�1k�z � �k���>8�Ň~H��ԭ�I��!�M�W�,!8a�(�����
� Ӌ���'5%�er�0�W<%A� ���o�7=O�9�P�����7��7+{�0Z�C�����R�ĸI��2�%���nr�����`{��J޻�R�fe3J_�D���zV�aX�����;��N6'rB�UN�J���z2�e9��Q��~���2����Ձ"��L���7h�Y��ގ_hLD�P���J�ي�(��雳%�Ϟ���b��U���1a#:8ȝ�-���B��J�I��"
�M}����?�+��q���p}��b4��I�O4؋�g�9���BbS����"�yo�+)�ţ��7C�����ŵZJY�+}�]������NIW��&��?SUI�3��E���HDvRdw�8ɭ�RSb�G`�M��  f�z��bf��29��mz�)�zsFC�r���E��q	�6d�a��C�C~&���$�ܫ���tx����I�?����S42���"x���X|5�ޔ+a����Kα��3b���!��,]0�j%�m�2��Y��X�5H��!��i��9������"/��	��Ơ�)rg(ңG��\�OZ-��k�m5�DOc_��
1b�\?�]�T�W#`��a�DS�m2"w�x��kќ���^�p�w�ó����,���eO_�J�>e�!Z���ʞnm���6���H2�������+�H�dۭ%z��+�HN�!J�a��x+n]U_���r�P�-]hǏ�ar�j�RG���u� pi९��h����q$�h�2_va�J��^�P�0ϱC �C����8���H�r�$�{�*(vN�� j�����y~��mct��,f��&K�A��Y�u	�	;��R���5�����lI.�|]�P��!i!BK�٘ͱNb��[�o%��sSu��$F��T��/�2.���Q
�м�y�<碰�X�'�~/Q�2"�?�Đ����,X��]�c���,fr�Ǒ��nR���F�BA���-	e&�}wi9s�8�4gz>H�f	3�c~_(�EO�AH�Mc�$0�I ��~A�[C�E|9�ʼ=v�XJ]1�h+=�jR����`�����Y$?Z)�^"6y�qr�g�0�U����.^��.��|��7`�� ��J����{#Cj�B�^Hr)�`�Gf�bJsH�D\^��;ۯC��ȓ'O�8��X ��J�0[�*���SK2Kb]�G;���JȀ̫[���6�����A�H�H��>�Ο�1�rod�����@{�f�]r�ɳ�a>�����	8u���tT/u���x~4�9@g�
�T��"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keywords_1 = __importDefault(require("./keywords"));
const ajvKeywords = (ajv, keyword) => {
    if (Array.isArray(keyword)) {
        for (const k of keyword)
            get(k)(ajv);
        return ajv;
    }
    if (keyword) {
        get(keyword)(ajv);
        return ajv;
    }
    for (keyword in keywords_1.default)
        get(keyword)(ajv);
    return ajv;
};
ajvKeywords.get = get;
function get(keyword) {
    const defFunc = keywords_1.default[keyword];
    if (!defFunc)
        throw new Error("Unknown keyword " + keyword);
    return defFunc;
}
exports.default = ajvKeywords;
module.exports = ajvKeywords;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.default = ajvKeywords;
//# sourceMappingURL=index.js.map                                       �g�G�1�+[Do��S�n@���p_�$B�&^�A�	
k~��j<�[ρ�,=����ء>�Y�tZ�����(C�emU4�4�ؼ���	����%�I�V3����a�z��O�����8�,��,��F�_�����ճ�l����n\}�=�_<Y}EZ#s�@�/%� ��F�������I��VGlP�p��ruo��o"�Β�kY(|���K ��O��9]�}��BB��'	�Rc鷄���<=�AMj8Mg�P��N��i�F0^*�zu���_x�t'�\D���/�F��3�{��>Q���D��]��фS�;��:�Hg��H[����.��KR��ƫ 0����c GS�n%��)qϞ�z�ڝu�<_��]�z#�ن���.n��.����u؍��g~�q���h/��l�AFץ9 �h�N� \j%�܀4H�<�Q��/V��B�Ai��t�@踋���Ɇ��!?�~
;��;��L!i6������BqE����m@I����b��2��SQXA�W~�2�8Ͼ&u0c��AZ��>��b�"d��l��,T�lp׸��!|���6�ߺN�\F���%t��BF������h�����}��Ȅb�$	v�P���Q�f�}2{s[5�5�h��޵�M��֧���M����dF�R�Jk��gz�u�}7�_�>�#xs�w�oV	v�Ǜ�9���'G!�=��mj�T����:%�
���~m^lD�e�hw[������߹幛.?�T�:�F~�I2lÚ(�))Ү�h��v�����[�M�S-������d�Q� ����������CH����gxag9��wU�s��5p,�[B���F
n���АW�Gן��CK#�A2�5ME �����N�z}����$�S��6���� �ϥŎ���S�x2p"~�IX~} t�.,�@IkY@dx�g�2W��`��z��8�^�3�l�m���t��@~T����B�+����o~6��Cf��]q���P�D�X�Ԧ��T?��dur����z����J���u���de�^ņ�?�ڵ�9�J0ft,ttFY�S#�,���S������	G���"�D�#؈f�iͯ�!t���P���Y�M��H�'`��GvCZ�k��~����J�<����S4u(X��K9�V���)��\���K1���OO���ZFq���z��K�)l�%����E\t�CW��"��m����4��NtC�P��6o����N�"b'��z]����*���9�IӐ��9�4��,o?9�_����,���"p0(9l���W����O� W�<�ͯ{�����2�"���Pڋ�s?Jn� ���2j�����c+^��Sy�զ1���O�X�cS&z�cg,�ex��zW��	t��:���M\��w��=	���qN*)� �!Y�w�K����_���@h�oi28��i�����i��LgG	K��T$dC�A��y��Y?s��tG)&�'�[�歹��<��wީ���>=�Gf\�ZjKh�O��*�^�\h���2�������hȹ�aL(`�)L�JO�����G��j�8�r�GI޳;�)�L�)�!8u9ӗΏ�[&�N�W����{��Z½��bi*u�􅋝@[��6�ǰ��7#�T�_d�	������6n9�*�H�j�$����.T�����W�皴�r�MD�7��:�Zm�W�M0�&�/a�H(2���H��ߌ�E� ��D/�U�� ���h���Xw��P�Ǎ�G�38��2,F9��k
rQ�(�ĳ9a�aQ�Z���J~@&�EoGUQ��/�Ԯ���*,����)���q��ag���"��h�~�A�C�*6Q��?�R�c���u�=-N����0@�o^\L?�O��օӉ�\��ȯcD��J�� �o����4H�5���ʌ 1<��i�mz�ҳ6֯�:�3�S��NF!'�����]�y��'������w�*�g�}m�#�`�|S��7[�U��;([0ǡ��_|4; �������l[pvs��Z��;�p2	V���exרn�AQ���X;�bE�2��O������r� ��]�(�b�}3P�W�<0����0Z��<��p��fz�2��Mr�6^��s���dB9#{DĢ
!}���XoU�h�%��G���ë�v �z�Zg�}|�a0�y�@pn����"�� ��erש���N���?B���]�.��{�W!rK�84�b��0AG|�T`��/��/W�@���r��c�?B�<�^vm3���]���^\�xNj�VǮ+iE9"�<\�b���0�/�r3*[�y}����\��q;�WA6��ƈ������K%�� �������p����W4��<�6��`l���_�����|��t
� z7+Ӱ�fv�w{7�K����	��75�n������#�xR.�0F#��N�ͪ�A�T=ճ�E�"�w͔�.���QZN7Dl��0o���C�yGid���x�T{�O'��y�_է�������#���IP����<m����s��-Ǻ)1~H#E�x�b�e�/�M���0�s�م��
�2/F��!���}ʽ���{��&ڂ�$���Fg�����<���.��O0\�H�KU�s`Â�uic>��m�Q��9]�S'��U�K����+�JT �XK$���FWA��D����.�E+ ;��Gg`ס����i���lf���{�,!�-N�q,R�U=y<�+��;՝�(�*������\ק�4����}��柝�.�K ���Z�t�`=�fA��$@d�Y9<��0�?���y�7������{B���N4X���QҚ�qP�/��O�0Md�Y\#�C��+Ig�1�J'8����>�a���z����Xn�hz�8J�=g�! �s85���03��L�!x�!�
׼Z�`���59u���ɕ0c5 ���!�7���e���P�C5�JfE�>��Z�ҿ�D���ɧ3"Q�e:rQ�ʗ�(Ρ�#_Itad�{���;�*?�:t�5"���	����[��1���P_v~h��&�lA�?��"�nQ�ph���ͱ��_� �<`NK"�6N�آ<:7-��v��bE�G�v�Uy 'Cǯe=.ڋ0�Mb{{��� �����3��fl�QlLp�B}8���?�����Ck
`�������(0����cyCx뗔T���VΑ!rd/�ꕡY�S ��{�Wv�7ix?�!��%P[��W �^�x�����ea��+z�}�ZE�2U����a��?����48��x�`�$#����O�\,�w�
��H(,>n�0O|� 
0��G�k�I��xB��� e���a�S5��t�o��i��p��6��ZN� ����.E�֥N�;T�J�l����-�$Y w���% ����nD�!I?��6�3�RH-����w�:�fn�d���I2�ǭ�A��D��0Ў,�m۶�o۶m۶m۶m۶m�3s_�?X�ZI:��N�Bj?����o�bKd�W{��y��?nH��mPK|^�m!���i�u�����ODvI�#0�Q*\H9����h�J%c;G�{�.]Q�٬	�T�2*`kQ��z�j$�2���!���8��ձ!f�S�FX=KGx.5&Y�O|@>V�|2���|Sπ�>�+�_糗rX <�/5r�mC��_.���7��ϓ�����x�k�'  ���ߟ�l�n\�u���� �`�#��z��j�^���E�0�g��,���&"Q�÷���W\rm�<���>�ܦl�l|t9e��F�^����|!U���B#������gpO>Ǎ:�-�\�n����dh�ii�657��C'x�r��jz'�@��*�Z�����W��R����Iﱰm"p�s���u�	�p%��]k5d���șQE�j���� X�	p��i䕩�7j�*�׼v��;:5!"M����94��r_I*�=}��H?�lUy u�9���D�w��Jb�Q��*_v/NV�@!��/���_A�Zݝo�0���
5ќ�D�AC�RB\v��^k'��f+��]��q��'�������N�Ʈ�?���t�#X���p�#�u�/�K�{�:�1x�ZT��L�x���줔���l	g=�nw�\uy$i�l��"����>�c���;�Y	!�!��AP��у�4.e�߀!�3�10��6wR�Qg�e�6��?bڬ>C�sޥ!���sS��Jt%��D7-S^�����H�D�z���U[ �@�*�#Œ��z����g�����i���i~�^m0x�ЕM�(~��w�óuj瘒�a�M����ȧf���F{�v�B����RΊ�?s��ݮ[-�JM .
-�^�,�nC.��:)�&x�������"䐊�k����]#�X��r�������D�]�H?��Wt�91��P
�'B�'�^.   @�y���n�M9[M:����su��xϖ��#}g����0MvkR��$�2"<�<杯#��Io5c��ݫ�7�Dѓ�@�#bC{��S��֤����7]��4`�GC^�k}KQ�������/!f�bМ	�b����;(ڍmֆh%�>��.g���H�s$�u���f1'�=N��Z�Ly-t��brْ�U�n���S	��3�����ٔK�� ��5��DA&�\��'<G��vإ�<�%~�f/�6##���OTe���v�H0S?ݘ�GU-a������:�6��!�����E��z	���^i�}�lO����� �|u�V��r����<v�}�=$��F=~��h� ؂(��lj�נ���z��E!�{����1������G�R�M���*>�F
�Q�w����T59VF��PQe�{���LЀ�'���ߕ\Q������_��6�P�IFq�
{�?��_⏠36��qA0��}4T�]���k���<��F��ٶgj�ȧ�٨��6�ַs�GĴ#��T�^-RL�C���["��hh�\�u��������
��.�V��r�_��2L~f��,5��H�����!�&q���OPm�'kv���ט�p�}M���]rPވ˩I_"��q��M����(�E��Έw��������H�WR!��3D��������gP�dշAA�-�8�*G���w�2(&%�S����+O�*�Cڲ��_*�pQ��`5��$���p  �4�y	�p-@XBDi�#�`;p?q�J��^��#f&��Y��/-�I��P�DC����<�8�)QK��9vҐ�qĘ�M�8�6��Mf�b�r(�M��s�X��Ŋ<:�NQ�ȏaVEQ����|��բ������Ж��b��| �z^D!�������f��~�i�֧�In�t��^�N�t���I�H�3�;�yqA��;a��Л�^�:���1hb	��r`'�)�f4�d�Rۂ����)�G�?&��PW�xYR���~�X��5�&a|�
�c,�*��=ap������n`^��(C��:�d8K?h֓��Y�Ɲ�g6۲3�|�Y�i�;Ǌ^7�g�����W�9�?�C �O�ޅÿ�Z��B=y����۔� �-p��6k|J��a��ԟ�О���$1��尸��Jz��޾6n��Z��
�S� �  @����O�4Z���5�T��Y�#�|��_��NC�	��k�,i�u�_��2OA�W� -��p��V&�pW�+/\�%�����5��w:k ���BA����Co��s��4#�����0þ��zh��u�lEQ�!���;�9*��������Hlb�j�M��Q��|�_�9܄�t{^��ҚN�6� ���H�Cϣ~�O�As�Z�I"8�^1��� �T~�p	.��>�C����9�x�:�Z�!��R�X��Q�q���S��	�,��0�1��%p4�����0	ȹ�BiӋ���R�CC�Eh��95֑�&� u�Ɉ��P�~ʫ���y�xN�� ;�X��B��-2ӄg��d�=2��`9�q��
��g�Šw\1��诿�Azp,1����_L��\�OgݳЗD�����#2\��?�
�0�q�p�)�	�0�ka�o8wԆ��[Аx��A��kY�ΘE�����8���('�l�>��g[>���3Z�Nq���Sn)��q(���b\EG��v���X(�����0�r� ^���*s�WG
X��4_�;z
�_S�uj eu
�\��0H�>�����ڐ���]+�{y�4�򈣈#R�� � �3HaC�d2���Z�P�>�Cu}�S�4�/e��M�HSvf�8�j�~O�߈E�w�<�i廢Ǚ����{�|=�ۡf�e1�`x�-�2�1��X6p@�d�&7<�az����nhb�v��FQ��{?*�)���x�F_6��XY�ւ��&�kS
(���,���xvg��}������޿�`�E�ȉ�.i�@��g~���\�6U��&!e͇�4B�G��A,�=��] Q"񴇉�i��]��-������_���>�YV u���f	]wi��jboS�0	{)3�|kg�W�_��
ݼ9�Siz�c{��s��g���;S�Y���˸���L�����X��8�fn�"�8�8q)cΗ �s���o�>�	�h�Ń��<��J���Q�
cc®?�q��$�{{a
D��FS�}�~�>f��+�9@���x;��,�i�r4���/2������郒�	�X�IT�a.�YcƸ��_��W����I�1��2���k�/�@GY�xh'�E*���-Q(祴[*P2m)��KD�ǯ��74��o��
��vPx:��ԡW��!�S���Ga���VS��}�7���P��UK�AP+���x�S[_�!WB�P? EYj�Ř(��8�IRh�A�����2SZ����.uJ� V�zqc`��a�Å>�Ӄ�v趣I�ٍ��:<��'���nj\0+��M/mv��юb��v�عũ�r���|n'�U���*��иn����J��i�_��Z4{1�9��W�^e��X1�3[���0L����Q��k`�׀�[ ���)�}����)dX�l�����q#|G��(@JP���U�Q[ӺRvJ�b{'>н~�R��ż�r�#���A� ��L���d����ep7%&�;].)EN��Y�v��Pdk�$�|Y����i���>c�Q��%�J���a�=B��� ��(��;�7Z0"�.uUk<�����x�������'���0���'����u���#�t%:D��Rr���R��^�i_;����B����P��)N�y+���ZE8Y��^��T��]�/=��+����݆�o��y�]�D���������
򃢘g��|���ЩWx��w��q:O�c�7��M9XJTn_t-&a�F�._C{��w ��2�FJ!f�"��;�z'7��Yݻ�$�7C����A��.xھd+���|�zs�)/�{��eVi�߼�Ւ�"�}��~�v�l��G�Ǐ�x~4��q���wO�h㈕<��Y�q�T��;������Z♽(�O�5j����?�ť�y���ʷo���{�{�D��[���M��*И�:8��[yq*�h8��~�F��b�)�8;��BH�;��G�Nl�((:nF]�y}^���I"�41r;��B�`լ�ҹVd]!F�$:Y�u|l��S�|�+0���1��m�k/
�w���$%��zT�Q��/,X(�*s���!i���h���	ێ�}���n�%��5�~�<�V�����*S�	�����i� �W&���
��t�j�~��Q����c[W� �<,84���y�˳�0j��ӓ[��ox�F�9���	�����wq��a�xwj'x܇�).BB5��[B���:#ZB�e�R�S�ÍIZ�AH��2.���d�~��ؽzݶ�퇸�i/K��1��g9m1#Fۑ7��)1�'d�OG�w�9��3�{����zҏn��F�پ.�]a)a�`�����偄�C=��J��$������\w`A��*0���[��g֘%�k~T@\Z��L�)����5{�Jr�IM���b*�EϷAcd�5?��ԭ$�����co�pq��o9Y2t�&O}�&y�U?�����#�4k��]���]�{Z�}�9�K
��4 �_y���|qD���.�(��5�6N��������)փ�!c�I����)�1�.��E��cB��AL�r�����)wx��n��$	@�;� �鷎z/��_��7޶]yΟ��$ri�*k7�7r��v� c~�A06e��w�����:ш��֘
���� {�Bɽ�0����
�D�dh��~,(�%��@5qQ�uP_Xd������+��8���	��$������F%��1�� f<�؝��������,�<�t��/d�^е!�k>�Y7�#3d>�S�k7��'w��ڻn1��a2��D�&\>�=��CKMגr�j(���:[�!͡*U��D�+���L��l�b�V�㡓���K��G,�HWFU�����OtX�fo/j�k�&��6��V��|���m����o���Y��V�����|�-E�����+r ��5[��y���@�ԓ�R,�;	�h�n�oR���FO�5)4
�J�ngKWSФj(UJ5�f�.���1�d+?�@�Τ��6�m(dz���� Ј�(��S�f]�b�\���ܢ�����e��z�Ǐԝ!s�p��j�DJ�	�!��<�2ʱb�����0���&�熣6da��EM��w@1T��_G���j����&8��&z�:��8�k�4ā���tx�B�T�q g �kZtA�d���q��֨ҀK�
hkʦl�#�E�)g��T�O��SM��7�,*��B-ۏ� � �DI�X3�,��Q&�&{Q��<}!@	>d��e�e�&fܐ�ñB��e��g�u���j��D_�����z��#I�Ġ�G8͇7^�՗��*s��g=8R7�"(��F����j��Q�b�A�b\��U1U�"�nM��Y� �7<P���pt�AEU��'���^��:]R+:�HWx��M�<0f����#)P�����A�U#�D4J|�Ϊ�2�O�<9Oׅ'�Jc���?�'�N4�b3��A�Mۅ^T�׵�TV�1_�釄L��܂Q9-��t�n	�e8e)�
�bJ�[FS�{TJN�����Ps�w��n_�^�}K�3���W�ق��M/��bO�o�_0RAc�UC�X��f�QTվu	�ח��389���ŗ�|l�?F͈E8�	��fO���R��k\j��42�L Y������uڏ�S�5%�|�K� ���uk��a�ʍ3��X�!���3@I�ݠ��X���L5B$��G�m���*k�Ï��=jt {lU��^��YPP�/�%�M$��h�B�0K��֗��P�M�ۘ%ׂe���X;(#����,2��k��y��QDHW�[m/�ZCQ��p�G�3�g�\$�["�\Y�)�U�Y׎��������?��<W����k���%��O>zهؙ|g<�X���Á}�����b<B�ӆk
����9Xn��k����6��%��-5/�
k7���=R�E���k0���5���v�@�����U	��1D���i�!���C��p�@���)����b�t`N ���+CKsP��'���i��>�E0~HsD��j��KjiN���Rx��s�^nK[��5���2o&�|��qlSK�ĝiW?�=	�:pJ��6&�>���6�I�%Nd�b�xw Yʆ�v���v�u�y��S��	M/��7�e<e:D���A'#s��^�v1�\1LT�{�ư"g��,HyBǶ���F 奂q�6K�(�R�?��e�O�$r��Q7[������fɑfpz֏+���c+8������C
hn뎒�	�l�g�O��|�$���eZ��B|��jPd�OfL����<�
#g��ٷ��S�m�m�4�CѸ?ǺP�.�6��_:����&�0܂m�?!i�����ɧy�8�I�Y)��6fp�a��ʰ�lDO�楃�\�2���+�䮅����E�aNܤ�I���xO0���ҕP�H�`�OX�n��`�F]��I	NcN2��<�{�*z�ʕ��"��4ˏ��&l	�	�L1 Yz��i���i�����j�ᾍd��F.�e ��TiW���u��	
���k���V*'O�q��;��q (��yv���9���I��6���o�C@�I��Z�K��� �<�r���ߞK��W�.���k-�-��D�	Ȋ��N�7h��v1bg��a�[,���^�RCe=�ϒO����&{��??Gm^�)@t�rV��x�~i
6dv����X�cxv�J��5���$F���@��Z o��5�z�>X4v��;� �QPSuO����M��n[*٠jJ�l�� �Kk =���#�l�|VR1���F��z6CYx�?m��������"����0��	���,8�#uQ��$g5��DؖS�lj�lD|Ƣ
�-b����?�O���u �مƝ#��ϹO^;2n�j�����ʀE���b��+6�R���=�eld�Ã�ުΕ3,��(��� �/��q'P���W	������z�|��\�<G|[\V`�_-����iD���Zb�ά�]码W�lZ+�tyȝĉ��&����M�s1��<hт+��A%y��m۬V:��F�%���"���j�r=�;��!����2��ͬh�|g������B�-�P�~i!���R�4����'*��mr�[��#�T�PW,�JUQ �H���1~z~3p�4�v�pT��k��~�+:d��^��ƹ�7�J���DN�[
��{t�v�ؗ��$z!����^��sTdWGݐ*�ʚ�i�vNӥe@������>p�5.$Wyi����y�P�²NM��Xjh܎ �ȯr���f��[Yu�/҇�b��R{�r�}�z��s���:����\{V���8ڒL�9W�،�r��5�ǥs{�{;<.BRȺ��V�L�"!��w=�"�� c�K��<�Y	��4�V�Pp��v�D�6�a;R�IV�H|�(��ǪN؃֌:0��q��?�p�̫]P%���_�Y��{W�	c���E�s��*3����M6�d�X9
���L�a߄pc|2�@J{s	iw
�j.���7ؗ#��]�
Gq�>5T�p{�k���p1�t^�%|_N�,�8�@I��h#㘮C�e��F"�꓄����y�0iÊYw���X�r!�=1������m �X*[�	c���ߜ�ς�:9�{�ׇ�T*�-*�^ߨ$�9b+�@�Á�Id�J��%>O,Х:D�/$������b��.a��YRK��ɔ���&������"����O�-1I�0��@R��G���5|�'�΄}4n	�R�����������2��\pl��g7X7r7�|�Y���$�L�0��U�I$���A�g2eF7�쑸S$4l��L���C4{`��#�˭.��z"�D���α4%V�.nw[�����`��Ԝp+�g��+�o�t��/!ݟB�7���T�/z���-Rm�M�ȹR{+U�Ӗ+m>��4]� ���y;y��Ic��
�M�%�������l��ᗓ�ǝ�rkϘ�s��ij\4v`Ȥ~��~���/��1���S191���]K@��:}�xL1���~�!8�JE.��ag�H�'i���\M�%�q�(�x��f�0'�M��}��~����ȟ���b�^3�eŮ�N�W�d��\��H����ڝ�?�-�6���rC>2j�JC$�r�
�W�ͅ��t
E�����:��hI'��$�tL�yY��^��х]?e��>)Q��toou�?�8o�}�N�S�K$4�M_��h���$SE/�����N�w���|���u�GR�>}Ȼޯ�f{]���R�*!�&2��MG#	�~Ob\��f��LCp�{ҋ��**��b�3�Ľ��̆�K������er��S�<8��G7���o�~l�rO����?��|��'���p���.����̰��*���h'�e3���N�HDk�K��X���PA���$�-��J�,˵���Cc	X'�AYT"��qk���8	��t(��Ց�����[(�O�N%�g�hf{U��f�ㄯ!p����e^(A���O��_^$a&S��ES Y�1G�B3�+��2���V7�h�f"�kG��[��Q�\p�_w?�4b@�f�nsʪ���,�dh���L��.���RQ*���r�VB�5��rC�Iu����1
RF�kL�f�N�
NT���as�j��&X7����Cw�&��K!R�ݕPz�ΰa\
N�|XU�v�>x���
Z�@,=�p� jiT2�6�AQ��������܃�zL�tu��Lm��w���	�;��ĩm�H�>!rM�8�C�j8/�ɟi�V!ҍ�B�h�Ӧ�_%5�0Y���0�;8�>�B���;�tR��Dݫ�_���:0��m�<
 ���,�η��K�e�֝�$�`��Eu���(�3/�t\] T�]�\�7X�����x�`���ˏ�0���.���0��ή+�%��bR�驈�	V���G�ۺ �G�y奏�S}F�n�X��fav�yy�zϏk�TK���u��=
ճ��˛�J.Zݢå��B4�5,6�;�#���*c!�d���'� v��ͷ�������>D�����_D�Qk��oF�H�Լ���s�ڢ������U.A���b�̤M��k�t�v|?�.@+�g�t����}>ɛ6x������ x�_��\P��-��q�ik�q�|��&Y��K9�{K�.�h���Sѹsrv+a�� p�z�c1M�)��p"�$	_e���ݩ��j�=����sa-gd���2 K�{��A��>�B����(+*���)�XO?qEu�ݸ�RO��q��}��n��i�e���8 #���1�{�y9C��6���_���ɉ������R@<G}č}.�h�AU�����=x������e���:2�OG���_r'ƌ�-Q��J[���0�$�HrJ�1E�d&4P���=�P�l��'��?��*����-�Yԛ-V_�ͽE���a:Yy�=_篺�9�^iř�k*p����/h�7�Y;ѫ>t�Y��89��;���F2"�{L�$�[������n_�P��X�����%9� �K�b����q���5�ԀCo'#r{J �Z=���Q:5�^�B8bLǡl��(Cjh*�o�S�<^�D"��H_�2}�=G������0���	x�η��o��'���#.ⳊxD�4���p������g�=V�
�C�RV=��\M��<��c�K(��K8�t�W��D�
X�����e��`�@����tE�^�߳�M����4@�0�_�t�Mn3 ��b���k֛/� )�&��mF��T��[zm��Ҏ�7�2g�=�ǯ%ʓ��G�P��eo5�"*B=�\�%1���3�ݷ���S�~z��{��P�k���ӎ�ۇ���sDp��(?Jy� D�+φ�{Z�\��C�+��/b ࢤ���s�!nYr5�F�fȌ�����7:�3Cr���¿�񁥄�p8!#�)A*���ﱲ���O����0��뺺A�k�U��&!ԁ�&q	�7˕�ق�o�����v7�tT����LȁkQL�Z��N��*���#�G`)'Z��z�����C�(F%��Aq��;UBP��<�<�b�P�9��~��ˌ�\9��9S� Ӳ��㔇�R��=�#��3��6Ss դ��.�����C�|Eۤ�>E$����Z��o+���jw��7���n�hJ��8#�_o��0�A �:)�,���S�U��	���8B=IU�7{�<l�{��v�K�w_�.���� �i��,�����
1|�#%35@nB���/i��9`�َ*�B��j�(��I��jB��T��u� l�N�O��=�R��joJ�+c�H�@�� `RN3�;�7?^j�
B����ϫ�8IWV�ӊ��v��	�~zV �V�.p���h%�k�{ָ[�SSX��4��FB��kxԦ��a����	�>"�l�e���E���l}��V�0R_
5���y8�*�XT[8��޽t2��S�>U�S��я����(�5���v7�����5��Fq���pU$,K�`����}@f������͟���E-"��-4�����H�3�t�UH�W����_��c�X8Tl℃��]��[oO�#�v�I[?�����VGKJw���@EA�e>ac�l�T�qR����H~1�b}�4e�5����jw�A�:Y6���4H��3au��盻�s&n~��Q��x��S��v9�:W �ٰ��d�bp�t �)sLt��5�������˽��ϭ0��F���%/k<$�[2��D�&��b���Zi��܂"sȀ)��N$K��jrAI��/��W�`��Bw�CF�˝����^�`X�5Е�оi���5]<	�{� 0b���X�S�޴5�+��\�1�Ȯ�FM	��e�dڝ��g#�Z|��>��EQ�ٳ<�}@:���Q	Z��dBҗ��Փ�T2c�3�1rl�!�=�!P�`v��%�>����fg����++�$M_C�q��R!ϞA�Zb�l�_�x�)|�f�d]�����T)X��g�p�9t���j�� {���c���4�Y����}V	�?�_@;�����˶��Wv�ƀ�5>�_��I�&4i{��k�#�ț��I��i7R1��f,v�he�-: ���U��}��Dc(N>��"�5�9+��ƹqчj(�k$d��G��1��]~5��4��%����V.;�%�Z�dsE��L��l!l��>�!���𾳀�6���t�nC���u?ß�Y�&H&O��х
;�`�D�0[�o�e�~W�%d��~�Ϥ̟Yt-�P{"version":3,"file":"esquery.lite.min.js","sources":["../parser.js","../esquery.js"],"sourcesContent":["/*\n * Generated by PEG.js 0.10.0.\n *\n * http://pegjs.org/\n */\n(function(root, factory) {\n  if (typeof define === \"function\" && define.amd) {\n    define([], factory);\n  } else if (typeof module === \"object\" && module.exports) {\n    module.exports = factory();\n  }\n})(this, function() {\n  \"use strict\";\n\n  function peg$subclass(child, parent) {\n    function ctor() { this.constructor = child; }\n    ctor.prototype = parent.prototype;\n    child.prototype = new ctor();\n  }\n\n  function peg$SyntaxError(message, expected, found, location) {\n    this.message  = message;\n    this.expected = expected;\n    this.found    = found;\n    this.location = location;\n    this.name     = \"SyntaxError\";\n\n    if (typeof Error.captureStackTrace === \"function\") {\n      Error.captureStackTrace(this, peg$SyntaxError);\n    }\n  }\n\n  peg$subclass(peg$SyntaxError, Error);\n\n  peg$SyntaxError.buildMessage = function(expected, found) {\n    var DESCRIBE_EXPECTATION_FNS = {\n          literal: function(expectation) {\n            return \"\\\"\" + literalEscape(expectation.text) + \"\\\"\";\n          },\n\n          \"class\": function(expectation) {\n            var escapedParts = \"\",\n                i;\n\n            for (i = 0; i < expectation.parts.length; i++) {\n              escapedParts += expectation.parts[i] instanceof Array\n                ? classEscape(expectation.parts[i][0]) + \"-\" + classEscape(expectation.parts[i][1])\n                : classEscape(expectation.parts[i]);\n            }\n\n            return \"[\" + (expectation.inverted ? \"^\" : \"\") + escapedParts + \"]\";\n          },\n\n          any: function(expectation) {\n            return \"any character\";\n          },\n\n          end: function(expectation) {\n            return \"end of input\";\n          },\n\n          other: function(expectation) {\n            return expectation.description;\n          }\n        };\n\n    function hex(ch) {\n      return ch.charCodeAt(0).toString(16).toUpperCase();\n    }\n\n    function literalEscape(s) {\n      return s\n        .replace(/\\\\/g, '\\\\\\\\')\n        .replace(/\"/g,  '\\\\\"')\n        .replace(/\\0/g, '\\\\0')\n        .replace(/\\t/g, '\\\\t')\n        .replace(/\\n/g, '\\\\n')\n        .replace(/\\r/g, '\\\\r')\n        .replace(/[\\x00-\\x0F]/g,          function(ch) { return '\\\\x0' + hex(ch); })\n        .replace(/[\\x10-\\x1F\\x7F-\\x9F]/g, function(ch) { return '\\\\x'  + hex(ch); });\n    }\n\n    function classEscape(s) {\n      return s\n        .replace(/\\\\/g, '\\\\\\\\')\n        .replace(/\\]/g, '\\\\]')\n        .replace(/\\^/g, '\\\\^')\n        .replace(/-/g,  '\\\\-')\n        .replace(/\\0/g, '\\\\0')\n        .replace(/\\t/g, '\\\\t')\n        .replace(/\\n/g, '\\\\n')\n        .replace(/\\r/g, '\\\\r')\n        .replace(/[\\x00-\\x0F]/g,          function(ch) { return '\\\\x0' + hex(ch); })\n        .replace(/[\\x10-\\x1F\\x7F-\\x9F]/g, function(ch) { return '\\\\x'  + hex(ch); });\n    }\n\n    function describeExpectation(expectation) {\n      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);\n    }\n\n    function describeExpected(expected) {\n      var descriptions = new Array(expected.length),\n          i, j;\n\n      for (i = 0; i < expected.length; i++) {\n        descriptions[i] = describeExpectation(expected[i]);\n      }\n\n      descriptions.sort();\n\n      if (descriptions.length > 0) {\n        for (i = 1, j = 1; i < descriptions.length; i++) {\n          if (descriptions[i - 1] !== descriptions[i]) {\n            descriptions[j] = descriptions[i];\n            j++;\n          }\n        }\n        descriptions.length = j;\n      }\n\n      switch (descriptions.length) {\n        case 1:\n          return descriptions[0];\n\n        case 2:\n          return descriptions[0] + \" or \" + descriptions[1];\n\n        default:\n          return descriptions.slice(0, -1).join(\", \")\n            + \", or \"\n            + descriptions[descriptions.length - 1];\n      }\n    }\n\n    function describeFound(found) {\n      return found ? \"\\\"\" + literalEscape(found) + \"\\\"\" : \"end of input\";\n    }\n\n    return \"Expected \" + describeExpected(expected) + \" but \" + describeFound(found) + \" found.\";\n  };\n\n  function peg$parse(input, options) {\n    options = options !== void 0 ? options : {};\n\n    var peg$FAILED = {},\n\n        peg$startRuleFunctions = { start: peg$parsestart },\n        peg$startRuleFunction  = peg$parsestart,\n\n        peg$c0 = function(ss) {\n            return ss.length === 1 ? ss[0] : { type: 'matches', selectors: ss };\n          },\n        peg$c1 = function() { return void 0; },\n        peg$c2 = \" \",\n        peg$c3 = peg$literalExpectation(\" \", false),\n        peg$c4 = /^[^ [\\],():#!=><~+.]/,\n        peg$c5 = peg$classExpectation([\" \", \"[\", \"]\", \",\", \"(\", \")\", \":\", \"#\", \"!\", \"=\", \">\", \"<\", \"~\", \"+\", \".\"], true, false),\n        peg$c6 = function(i) { return i.join(''); },\n        peg$c7 = \">\",\n        peg$c8 = peg$literalExpectation(\">\", false),\n        peg$c9 = function() { return 'child'; },\n        peg$c10 = \"~\",\n        peg$c11 = peg$literalExpectation(\"~\", false),\n        peg$c12 = function() { return 'sibling'; },\n        peg$c13 = \"+\",\n        peg$c14 = peg$literalExpectation(\"+\", false),\n        peg$c15 = function() { return 'adjacent'; },\n        peg$c16 = function() { return 'descendant'; },\n        peg$c17 = \",\",\n        peg$c18 = peg$literalExpectation(\",\", false),\n        peg$c19 = function(s, ss) {\n          return [s].concat(ss.map(function (s) { return s[3]; }));\n        },\n        peg$c20 = function(a, ops) {\n            return ops.reduce(function (memo, rhs) {\n              return { type: rhs[0], left: memo, right: rhs[1] };\n            }, a);\n          },\n        peg$c21 = \"!\",\n        peg$c22 = peg$literalExpectation(\"!\", false),\n        peg$c23 = function(subject, as) {\n            const b = as.length === 1 ? as[0] : { type: 'compound', selectors: as };\n            if(subject) b.subject = true;\n            return b;\n          },\n        peg$c24 = \"*\",\n        peg$c25 = peg$literalExpectation(\"*\", false),\n        peg$c26 = function(a) { return { type: 'wildcard', value: a }; },\n        peg$c27 = \"#\",\n        peg$c28 = peg$literalExpectation(\"#\", false),\n        peg$c29 = function(i) { return { type: 'identifier', value: i }; },\n        peg$c30 = \"[\",\n        peg$c31 = peg$literalExpectation(\"[\", false),\n        peg$c32 = \"]\",\n        peg$c33 = peg$literalExpectation(\"]\", false),\n        peg$c34 = function(v) { return v; },\n        peg$c35 = /^[><!]/,\n        peg$c36 = peg$classExpectation([\">\", \"<\", \"!\"], false, false),\n        peg$c37 = \"=\",\n        peg$c38 = peg$literalExpectation(\"=\", false),\n        peg$c39 = function(a) { return (a || '') + '='; },\n        peg$c40 = /^[><]/,\n        peg$c41 = peg$classExpectation([\">\", \"<\"], false, false),\n        peg$c42 = \".\",\n        peg$c43 = peg$literalExpectation(\".\", false),\n        peg$c44 = function(a, as) {\n            return [].concat.apply([a], as).join('');\n          },\n        peg$c45 = function(name, op, value) {\n              return { type: 'attribute', name: name, operator: op, value: value };\n            },\n        peg$c46 = function(name) { return { type: 'attribute', name: name }; },\n        peg$c47 = \"\\\"\",\n        peg$c48 = peg$literalExpectation(\"\\\"\", false),\n        peg$c49 = /^[^\\\\\"]/,\n        peg$c50 = peg$classExpectation([\"\\\\\", \"\\\"\"], true, false),\n        peg$c51 = \"\\\\\",\n        peg$c52 = peg$literalExpectation(\"\\\\\", false),\n        peg$c53 = peg$anyExpectation(),\n        peg$c54 = function(a, b) { return a + b; },\n        peg$c55 = function(d) {\n                return { type: 'literal', value: strUnescape(d.join('')) };\n              },\n        peg$c56 = \"'\",\n        peg$c57 = peg$literalExpectation(\"'\", false),\n        peg$c58 = /^[^\\\\']/,\n        peg$c59 = peg$classExpectation([\"\\\\\", \"'\"], true, false),\n        peg$c60 = /^[0-9]/,\n        peg$c61 = peg$classExpectation([[\"0\", \"9\"]], false, false),\n        peg$c62 = function(a, b) {\n                // Can use `a.flat().join('')` once supported\n                const leadingDecimals = a ? [].concat.apply([], a).join('') : '';\n                return { type: 'literal', value: parseFloat(leadingDecimals + b.join('')) };\n              },\n        peg$c63 = function(i) { return { type: 'literal', value: i }; },\n        peg$c64 = \"type(\",\n        peg$c65 = peg$literalExpectation(\"type(\", false),\n        peg$c66 = /^[^ )]/,\n        peg$c67 = peg$classExpectation([\" \", \")\"], true, false),\n        peg$c68 = \")\",\n        peg$c69 = peg$literalExpectation(\")\", false),\n        peg$c70 = function(t) { return { type: 'type', value: t.join('') }; },\n        peg$c71 = /^[imsu]/,\n        peg$c72 = peg$classExpectation([\"i\", \"m\", \"s\", \"u\"], false, false),\n        peg$c73 = \"/\",\n        peg$c74 = peg$literalExpectation(\"/\", false),\n        peg$c75 = /^[^\\/]/,\n        peg$c76 = peg$classExpectation([\"/\"], true, false),\n        peg$c77 = function(d, flgs) { return {\n              type: 'regexp', value: new RegExp(d.join(''), flgs ? flgs.join('') : '') };\n            },\n        peg$c78 = function(i, is) {\n          return { type: 'field', name: is.reduce(function(memo, p){ return memo + p[0] + p[1]; }, i)};\n        },\n        peg$c79 = \":not(\",\n        peg$c80 = peg$literalExpectation(\":not(\", false),\n        peg$c81 = function(ss) { return { type: 'not', selectors: ss }; },\n        peg$c82 = \":matches(\",\n        peg$c83 = peg$literalExpectation(\":matches(\", false),\n        peg$c84 = function(ss) { return { type: 'matches', selectors: ss }; },\n        peg$c85 = \":has(\",\n        peg$c86 = peg$literalExpectation(\":has(\", false),\n        peg$c87 = function(ss) { return { type: 'has', selectors: ss }; },\n        peg$c88 = \":first-child\",\n        peg$c89 = peg$literalExpectation(\":first-child\", false),\n        peg$c90 = function() { return nth(1); },\n        peg$c91 = \":last-child\",\n        peg$c92 = peg$literalExpectation(\":last-child\", false),\n        peg$c93 = function() { return nthLast(1); },\n        peg$c94 = \":nth-child(\",\n        peg$c95 = peg$literalExpectation(\":nth-child(\", false),\n        peg$c96 = function(n) { return nth(parseInt(n.join(''), 10)); },\n        peg$c97 = \":nth-last-child(\",\n        peg$c98 = peg$literalExpectation(\":nth-last-child(\", false),\n        peg$c99 = function(n) { return nthLast(parseInt(n.join(''), 10)); },\n        peg$c100 = \":\",\n        peg$c101 = peg$literalExpectation(\":\", false),\n        peg$c102 = function(c) {\n          return { type: 'class', name: c };\n        },\n\n        peg$currPos          = 0,\n        peg$savedPos         = 0,\n        peg$posDetailsCache  = [{ line: 1, column: 1 }],\n        peg$maxFailPos       = 0,\n        peg$maxFailExpected  = [],\n        peg$silentFails      = 0,\n\n        peg$resultsCache = {},\n\n        peg$result;\n\n    if (\"startRule\" in options) {\n      if (!(options.startRule in peg$startRuleFunctions)) {\n        throw new Error(\"Can't start parsing from rule \\\"\" + options.startRule + \"\\\".\");\n      }\n\n      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];\n    }\n\n    function text() {\n      return input.substring(peg$savedPos, peg$currPos);\n    }\n\n    function location() {\n      return peg$computeLocation(peg$savedPos, peg$currPos);\n    }\n\n    function expected(description, location) {\n      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)\n\n      throw peg$buildStructuredError(\n        [peg$otherExpectation(description)],\n        input.substring(peg$savedPos, peg$currPos),\n        location\n      );\n    }\n\n    function error(message, location) {\n      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)\n\n      throw peg$buildSimpleError(message, location);\n    }\n\n    function peg$literalExpectation(text, ignoreCase) {\n      return { type: \"literal\", text: text, ignoreCase: ignoreCase };\n    }\n\n    function peg$classExpectation(parts, inverted, ignoreCase) {\n      return { type: \"class\", parts: parts, inverted: inverted, ignoreCase: ignoreCase };\n    }\n\n    function peg$anyExpectation() {\n      return { type: \"any\" };\n    }\n\n    function peg$endExpectation() {\n      return { type: \"end\" };\n    }\n\n    function peg$otherExpectation(description) {\n      return { type: \"other\", description: description };\n    }\n\n    function peg$computePosDetails(pos) {\n      var details = peg$posDetailsCache[pos], p;\n\n      if (details) {\n        return details;\n      } else {\n        p = pos - 1;\n        while (!peg$posDetailsCache[p]) {\n          p--;\n        }\n\n        details = peg$posDetailsCache[p];\n        details = {\n          line:   details.line,\n          column: details.column\n        };\n\n        while (p < pos) {\n          if (input.charCodeAt(p) === 10) {\n            details.line++;\n            details.column = 1;\n          } else {\n            details.column++;\n          }\n\n          p++;\n        }\n\n        peg$posDetailsCache[pos] = details;\n        return details;\n      }\n    }\n\n    function peg$computeLocation(startPos, endPos) {\n      var startPosDetails = peg$computePosDetails(startPos),\n          endPosDetails   = peg$computePosDetails(endPos);\n\n      return {\n        start: {\n          offset: startPos,\n          line:   startPosDetails.line,\n          column: startPosDetails.column\n        },\n        end: {\n          offset: endPos,\n          line:   endPosDetails.line,\n          column: endPosDetails.column\n        }\n      };\n    }\n\n    function peg$fail(expected) {\n      if (peg$currPos < peg$maxFailPos) { return; }\n\n      if (peg$currPos > peg$maxFailPos) {\n        peg$maxFailPos = peg$currPos;\n        peg$maxFailExpected = [];\n      }\n\n      peg$maxFailExpected.push(expected);\n    }\n\n    function peg$buildSimpleError(message, location) {\n      return new peg$SyntaxError(message, null, null, location);\n    }\n\n    function peg$buildStructuredError(expected, found, location) {\n      return new peg$SyntaxError(\n        peg$SyntaxError.buildMessage(expected, found),\n        expected,\n        found,\n        location\n      );\n    }\n\n    function peg$parsestart() {\n      var s0, s1, s2, s3;\n\n      var key    = peg$currPos * 30 + 0,\n          cached = peg$resultsCache[key];\n\n      if (cached) {\n        peg$currPos = cached.nextPos;\n\n        return cached.result;\n      }\n\n      s0 = peg$currPos;\n      s1 = peg$parse_();\n      if (s1 !== peg$FAILED) {\n        s2 = peg$parseselectors();\n        if (s2 !== peg$FAILED) {\n          s3 = peg$parse_();\n          if (s3 !== peg$FAILED) {\n            peg$savedPos = s0;\n            s1 = peg$c0(s2);\n            s0 = s1;\n          } else {\n            peg$currPos = s0;\n            s0 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n      if (s0 === peg$FAILED) {\n        s0 = peg$currPos;\n        s1 = peg$parse_();\n        if (s1 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c1();\n        }\n        s0 = s1;\n      }\n\n      peg$resultsCache[key] = { nextPos: peg$currPos, result: s0 };\n\n      return s0;\n    }\n\n    function peg$parse_() {\n      var s0, s1;\n\n      var key    = peg$currPos * 30 + 1,\n          cached = peg$resultsCache[key];\n\n      if (cached) {\n        peg$currPos = cached.nextPos;\n\n        return cached.result;\n      }\n\n      s0 = [];\n      if (input.charCodeAt(peg$currPos) === 32) {\n        s1 = peg$c2;\n        peg$currPos++;\n      } else {\n        s1 = peg$FAILED;\n        if (peg$silentFails === 0) { peg$fail(peg$c3); }\n"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
const rules_1 = require("../rules");
const applicability_1 = require("./applicability");
const errors_1 = require("../errors");
const codegen_1 = require("../codegen");
const util_1 = require("../util");
var DataType;
(function (DataType) {
    DataType[DataType["Correct"] = 0] = "Correct";
    DataType[DataType["Wrong"] = 1] = "Wrong";
})(DataType = exports.DataType || (exports.DataType = {}));
function getSchemaTypes(schema) {
    const types = getJSONTypes(schema.type);
    const hasNull = types.includes("null");
    if (hasNull) {
        if (schema.nullable === false)
            throw new Error("type: null contradicts nullable: false");
    }
    else {
        if (!types.length && schema.nullable !== undefined) {
            throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
            types.push("null");
    }
    return types;
}
exports.getSchemaTypes = getSchemaTypes;
function getJSONTypes(ts) {
    const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
    if (types.every(rules_1.isJSONType))
        return types;
    throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
}
exports.getJSONTypes = getJSONTypes;
function coerceAndCheckDataType(it, types) {
    const { gen, data, opts } = it;
    const coerceTo = coerceToTypes(types, opts.coerceTypes);
    const checkTypes = types.length > 0 &&
        !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
    if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
            if (coerceTo.length)
                coerceData(it, types, coerceTo);
            else
                reportTypeError(it);
        });
    }
    return checkTypes;
}
exports.coerceAndCheckDataType = coerceAndCheckDataType;
const COERCIBLE = new Set(["string", "number", "integer", "boolean", "null"]);
function coerceToTypes(types, coerceTypes) {
    return coerceTypes
        ? types.filter((t) => COERCIBLE.has(t) || (coerceTypes === "array" && t === "array"))
        : [];
}
function coerceData(it, types, coerceTo) {
    const { gen, data, opts } = it;
    const dataType = gen.let("dataType", (0, codegen_1._) `typeof ${data}`);
    const coerced = gen.let("coerced", (0, codegen_1._) `undefined`);
    if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._) `${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen
            .assign(data, (0, codegen_1._) `${data}[0]`)
            .assign(dataType, (0, codegen_1._) `typeof ${data}`)
            .if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
    }
    gen.if((0, codegen_1._) `${coerced} !== undefined`);
    for (const t of coerceTo) {
        if (COERCIBLE.has(t) || (t === "array" && opts.coerceTypes === "array")) {
            coerceSpecificType(t);
        }
    }
    gen.else();
    reportTypeError(it);
    gen.endIf();
    gen.if((0, codegen_1._) `${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
    });
    function coerceSpecificType(t) {
        switch (t) {
            case "string":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "number" || ${dataType} == "boolean"`)
                    .assign(coerced, (0, codegen_1._) `"" + ${data}`)
                    .elseIf((0, codegen_1._) `${data} === null`)
                    .assign(coerced, (0, codegen_1._) `""`);
                return;
            case "number":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "integer":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "boolean":
                gen
                    .elseIf((0, codegen_1._) `${data} === "false" || ${data} === 0 || ${data} === null`)
                    .assign(coerced, false)
                    .elseIf((0, codegen_1._) `${data} === "true" || ${data} === 1`)
                    .assign(coerced, true);
                return;
            case "null":
                gen.elseIf((0, codegen_1._) `${data} === "" || ${data} === 0 || ${data} === false`);
                gen.assign(coerced, null);
                return;
            case "array":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`)
                    .assign(coerced, (0, codegen_1._) `[${data}]`);
        }
    }
}
function assignParentData({ gen, parentData, parentDataProperty }, expr) {
    // TODO use gen.property
    gen.if((0, codegen_1._) `${parentData} !== undefined`, () => gen.assign((0, codegen_1._) `${parentData}[${parentDataProperty}]`, expr));
}
function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
    const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
    let cond;
    switch (dataType) {
        case "null":
            return (0, codegen_1._) `${data} ${EQ} null`;
        case "array":
            cond = (0, codegen_1._) `Array.isArray(${data})`;
            break;
        case "object":
            cond = (0, codegen_1._) `${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
            break;
        case "integer":
            cond = numCond((0, codegen_1._) `!(${data} % 1) && !isNaN(${data})`);
            break;
        case "number":
            cond = numCond();
            break;
        default:
            return (0, codegen_1._) `typeof ${data} ${EQ} ${dataType}`;
    }
    return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
    function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._) `typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._) `isFinite(${data})` : codegen_1.nil);
    }
}
exports.checkDataType = checkDataType;
function checkDataTypes(dataTypes, data, strictNums, correct) {
    if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
    }
    let cond;
    const types = (0, util_1.toHash)(dataTypes);
    if (types.array && types.object) {
        const notObj = (0, codegen_1._) `typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._) `!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
    }
    else {
        cond = codegen_1.nil;
    }
    if (types.number)
        delete types.integer;
    for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
    return cond;
}
exports.checkDataTypes = checkDataTypes;
const typeError = {
    message: ({ schema }) => `must be ${schema}`,
    params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._) `{type: ${schema}}` : (0, codegen_1._) `{type: ${schemaValue}}`,
};
function reportTypeError(it) {
    const cxt = getTypeErrorContext(it);
    (0, errors_1.reportError)(cxt, typeError);
}
exports.reportTypeError = reportTypeError;
function getTypeErrorContext(it) {
    const { gen, data, schema } = it;
    const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
    return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it,
    };
}
//# sourceMappingURL=dataType.js.map                                                                                                                                                                                                                                                                                                                                                                             ����x�����kYF+ak{R�&{y���N�gU�yx�^Б�O��q(��Ƅ��l�{=r9�[p�a�ӏ�K�?�� � ��
�i�ː}p�`o���o��ґܰ-b��;������;�;�&Kl�Ǥ���2G�#�5է������x�.��|�PM��������$0 '��{�b�*�����ğ��̈M��M��uN��6ac�M�sϷ�Pw>
}���y�p-�~�T#������iH"(H)�xķ�X١�V9�4"�Gvof�&g�.tv`(>��k�ͬ����[�n��N������� ���1!���� �7�9�6�(�ݜ�bʝ8Xr��ږ�Ɏ�_-�P}��[�
J0tRVNi�%�p L4�.fn����j�0�z,
�=p������Ԃ�F�
��]�{Ll���^[-	��^���C빐ux#��~АA�< +ʴ0qC߭븩�����Q���$�W�t]�y�q&�C%|?����n�:�QsN~�	C��׍e�1ڀZ��	[h�]ʎq����TF���Ç����c�\��稛L��8�{��:x��Լz�\�\]�U^b|%�V6��@I� 7�tM�ϓLڃ����li�P/�=��=n�tr�M��&2^>���a���1w6��;��=Q5�:T��gzlV�<�Ca�#�i��>;��uB"Ɇy�,����2��X���r���o`�"��\�yMC�O\A���#�wS���^��.��,��wJy7�Y����d�v�*�S�e����
�N5�G���G�VXs������yJ�2{=C�n*�?]��"
�>��2�2�ya>��zurH&+��v�n*/��68��c��{!�J7��m0H���^�&n3<H��3����2W��P*-8e~�8ı�Kp��%L�;t���b��}O�%� ��W�sehuƖ���t� LW�Ŗ�1�¤^s��&H��S��s#�8���]vKפgd�L��1W���Y�ڰB̒ǨT��!�gO4���.xcXa�l�h��Χ�s��x��`�񟾺����[]�/�$���̖�
i�Ys�����C�N�&��D�z��:��S��A�ķq|�����j�Q���}X���aM����>k�ܢ9�7E��"'$�s9�Jy��\�Xg~	<wξ�^8�}w7�>������&g����W���{:
r6Ӌ�7m�I\�(@�d�-S9'o�ӣŜ<qr��T7�c�P�%k�N�1��`����;���L�h?;�>8�])#F:�'n �L;�
�`
@m�   iT��?C!�CaN6T??c��S�v�][��o����} �X0��$KM����O�a߹d����X�����z	{�F1�9�eMLG�4��@Z����
V6з"��7ȩ�9h��[}�������9�Ybh�ż��x���;�/�O�ȴv�;}q��H_	�jq��ۀ����4���eV���Me1�sKZ�(�i�h}�J'�<���1E�]
p
e��*bv���	�
���g�oԵp��\�O��~� !S!��u���d ���ʇ���G���Nc�`����h�/C���"   �Y��f�~'��J�:�]��Hf��7�]z�b���m��i�0�$�gw*6��2�Q��m"�o~���ըYӜ�/�d"g�60�OT;ס��ۙ�\f0�D�[� x�o̲���V
>p�e �q�hi�����u�Yn��I�A�g�F��ߜj�G�B? d��w�Ƒ�D2�����F��$��(�}��p�U�,E��OW��38�bT�o}<�G�R�И�L��'�D�Y7Sm0���Ʋ:�B#��0�k�܁�C��|>�t�����b��j\N��[lP�D�w�a�}�t�3�<�2���4�]�cws�<���O�����Nr2�c  ��Wۋ1@r��uX��+"@a��Ǥ������۽C]����)-�٧S���P�>:{�"R�! ÿ������Ĕ��s��2=��HTj@��gJXP����*�1����m��[{_$w�) eԪ�U����g��j���`���b�X��	�&�c	@�8��R%� ݐ��dt�a�bm%���p[ūf���lWN(Ͳ3Q$��B�K�6U� ����g'�nr����!B�~&��)�j�\uB����!��ز�}<S-n�gC:�d�x���KL10�r���@�M�w�����G�uy��W�qݫ}�})�ro�Y??�S����y��8˼����&̯�p�mJ㘠�.8ψ'l��o�\�p��<h��9:w�h7x�F� ?80� .��������/{�zG�E��0��q8|=%3O�P � "�C��
�w�
��|;�Q�x���2^��aMe{}��dGŴ/p�n��D����93ԁ�E6:��K�D/iↇ��:]]jw�	oL���%����Jj
���_�u��&��G���|SL{�,U�sW���p����Y��i��6�Ac?=@;	�{A'�GO��9�-�I�[��BE�P	ٌ<:@Ô���3��q��d+�a酅bZ���A.Wx���=-�pp)�g|Z罺�X���匉�Kc]����aM���������C���(�c�oC��J���m�+N�,� ����(���5N�95����	��-%�o�q�̠�J=�l#���UPϘ%I#�g�M�\,��W�q�N q��0���9�X�BH���4�~�i�������4$�Ve��4IA�� �ђ����B/iQ	T���`�>x���?S��*,*,�߅i��d!q|VR���<��~��I~4�O����鬜��	-q���wP�l�=#o���K��n�b�c��Mp ���	�KW+���]z�3�����qĮP��Vw3�Z�n���ưm��#�B���;^_�y��ʌf���&V�܉������LUb'�mFghh�~�L�?��
�q��ka����п�sH'�9s�}�zu��W���I]3�$���9x�A�`���t>�����~��&��/�A�u���\��?;�(�c��5<Lk[wu7P��K�q�ձ8�u-�N����U�H��@���L�� ��6|�N����	 A��"��Wf���P:Q�r������x'�9�۳��̔8����͚�ǥ$�}�O�U�����,�GFo[�kV�L7���u1��Զ1�s��pU���KeXQ�O����e�"LgN�XC�&�O�-�6vI�u�1�"K �Z���F���|�7�?l|�n%��[�ҲTm0d)�pˈ&����d3�L���k&_QK�:�5��VP�^N{�?�oks;�B�xy1:�<��M�T��QI����Xq �G�A�-#��9Ҏ�̠��3�3�
>lQ��#h,��-����G5�Sz]
˄�˜V�h��e�If�.��`��W`d�L�Ձ�}~4V�u�:����+Ɂ�V����fV�_��\��T1� �ǃ��� ��(S��3�v�Ħ=�����y�1�iC�%爚rOZ�aᣙi ���L��3�X;f'�@i��Ko�#�jC�@×z;T~4*���`�P�L˿�E�� j�7J�N^�8��4����z����/#i���ݤ��b��}ċX�Y�gv&�����تF	�a���S^*�,�N�y|̄�%�vX~�.�q������2b�_�X�z��-u�jʐ��q����Q��
��C8���I�掔6�	 ւ�2B���,զ��H���`RO�@�ų��m��he����w��L ��<:��5��	��㜢��ReCn��Al.;�����:�8��虧������`o���>����0x�,��k�x�s�OɄ��	k����E�O+?�%f�h,��������s�;Y�w1e^F��ޤi��G���s�*0���I���G���yl�WD���)e���t������|?g���w�Ow��Fª/S]R~�r!�h��Wd^t�cŬ9���kj��an���'���z? u���av5K��[������AR�9��a{,�-�.
�(�!�{�h�Qqu���f����V�Yȸ�m�`U'"�g�ʍSym @T��jJ��fؗ�����=a� ��,h$CB�c`"m����!;��WB��q�qΆ��h��v�T����l}��B��!��q�|;�4TNl��3$�b�e�Ƒ
q4��#6��)�՞Yxz���И8�|ꮽS�dN�h8�O(�:ÏI��Zڱ%H	�S��]�Xy�-
��-�4�r�B��z�=ft9l��T�B�@�ҽ����Y}~��jw�T� ��~�NЬԡQ���a���~����|Y��Z~�ԪjU��a�������	MP��c?0ʉX(�Tl��gṛ)��*vaFŜ��\TEъp��=;��^L����<����?���Yy��0t[:��O��t�v��-SG
	�MW���&k����G��"�CE�!�:����|{�"\�8c_��lf����PMWXM�k��8�7n˓5�~,0G-�6pzR��
�S̢G�1I�u�-�����|B������=U�U���
�ϊ���ver�>��"��6<:YW���g������.Zp�n�o���H��E�����_�@Ѵ]��>%sL�O�.�Э*�Y5�� ��A&zꁕ�������B��V����W�t�VՓ����u��$yOd1R~���w��� ct��=���KK�(��~�Z��z�{���W�`hc{�{�<g]>��_uA�Up�gqܯ��[� ë=@VL1�\����]U�!�*�}a$ŕ@e���u�fqE�ªU�v��8�d,����^ͩ�';�6�o^^�|Kn�v�9��]Y��9"ϡ�lY����2�X+��^��É�[�:=�m����k7��W�n/�-�#����7w��^�s�ָ�Dg�wd������uK��F���)i�N�X;{M�7�l�i�1�R���~9�� ��K� }A�]=���gXw�=*���G��EK3��7�v���F��I~M�_(#����[/U9�d����eQ�@��CSN�?��G�.�� �1���!���m��wK�4;�w��`qN�l��N�'�-�X�K%M��r�B�5t��i����z!0A����4�d��^�� }�k�����僧Զ���2q{���: �O�5�һ�9�ė���f��If��O�.Ukz���,�{b�jtgF��^�Tu��I�)p1��8��_����k�_��o(��&��DV�D�1ג��j�kEF�T�_�yj�C&��/�dfh�Z�	og����Y3Z}��@4`���ch�\� �'��~�� �;���j6�>�����*$�֫)����?��<�{@F�)��B��\�y`��"����*�|��q�n;�jʀ��C��(u�޷OR�*�����2,�=�ucuuW�I1�ءI�����~���B�1����G��hR�.��0��5��PH�[�Nϋ%|Ԥ�j�S�/����0�1Z�C�s�!�#����ڨ��?��\hrh��:�n+U#Pтs��ƽ����� 0�r��\��S��[W*.9ҝZ��=�V�ub,���C��L���2��a�����o��Jz! �*-����>dmP���PM �'IۓL(�X������'艭 L�V�|IV��B���{CT�u �X�s�*D#�V��g�ղ:%G�VY�;��
�5�}��8����l~�NO�q��}�R���<摿X�O�M���|T�j7M���ҋ����ܑ"  4z&!� >ݮ-eE�<�?x��������aVIL�����3F�'�� �u]��e�@*�p�n<hv����|�����ha�E����6�7�Q�n+5֧@��,�s��y�&OS�xؐ}��W��g����84�[6V�R��P5ݾ���?X,7{z_��~�A�#Q@|��[+
M.w�Jw���?V���bM�J>G����-�b^�����q/��PT�?��&�[1��ݹ��A :���h�7�����{�m9`gfx9}�4:$�"`�O@�4���>Hq៟?����������s�!XZ�I�o�*�4c�4���rBA�)��f]C7��zkF
���껠���� U�PR�J�|���H8�wϣG���#�3�z'C��'�J�ޡCNx�9D��:���qB`�m/7%H���y��2iv �l�:�YF/���)*�r���,�9�2��r��2�1�2���+�����/{�
��04}p���Br�i��/��o��(�������ne�d���B�3����w�{:�V��4�9�CS"����vwL� (��?/�t����{;���� ��9nL����t�)>�QM�����p�>V��".bt�r\�ĥ�����F��Ý.�g/�[K�7��ۍ�Q�0��Ȗɚ �����w�ly�_o(�?����H2�/���h
BYWA<Y A�h���hr}��3�O*{ ��c�v��`�v����|j��Pc���%��r�Y��|wo�zG��iG�.�G�<���Q�=�(mn%���'��Q<�s�ghEz��B�Z&7�	߀���|Wm���2wA�╗s$�"VƼ�w �K���l�\�j���?$^Hq e^߁���<����2���gYT���t!IVu�0��Ue7���M�ƿɮHߩhX��1��<4�S�����=�����B�y��M�X�:�v-��xd������#y���������h]/
�8ZU�؉�%��N�T���%@x���^ת�[/ 1�[}��+^Fw��ƵA%�eI~�٧^ثa� eT��d���Ln�W��o'����K�uN@j����;'���q[�&]jb�T'�w|�3Յ��c�L�N�PP�����Ns;&�Ӝ@�5
��e>lr�`zv����X��	�~!OK�!�/�;k��AYƾ@c=�+0��N�c�0)"Vv+���+�N���$��'z�>l0M��=��i�z	��l6�p>P{цZ�l��у����>a:��P�@ak���7�.�p	V�У��׋~Td{>��l�t�x�G�`�DߏW�LȕI�&7|�����r��z��[�(���1�V�ҝ*��a���-,ף���}R�J��B����Hd���&�N3Ŝ.w"�}�[���Y��X�}]oF��k�|Eii���gR�
l]�~�\?#�2��j�?mՒX�@���IU�m9�GP�܃ޅ�CV�M+	6��ڶZE�>�xɓ3Hr2 ���3ө�R-њ��!�Y#���}��{.��TvÞ>�年��A8��{,MB��Rui�qǤ�Y�¦���y�D~��\�Nn�Q�̽��+u�/U�-I�oK�R���/q��Oh�T�A�Ew�Zv��L�9�'�%oܔV~�sMF���p��Q�=�m��K���ވ����Kz��gt�l��X*s4�K�өe6Y(���i�β�t*x�"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
const rules_1 = require("../rules");
const applicability_1 = require("./applicability");
const errors_1 = require("../errors");
const codegen_1 = require("../codegen");
const util_1 = require("../util");
var DataType;
(function (DataType) {
    DataType[DataType["Correct"] = 0] = "Correct";
    DataType[DataType["Wrong"] = 1] = "Wrong";
})(DataType = exports.DataType || (exports.DataType = {}));
function getSchemaTypes(schema) {
    const types = getJSONTypes(schema.type);
    const hasNull = types.includes("null");
    if (hasNull) {
        if (schema.nullable === false)
            throw new Error("type: null contradicts nullable: false");
    }
    else {
        if (!types.length && schema.nullable !== undefined) {
            throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
            types.push("null");
    }
    return types;
}
exports.getSchemaTypes = getSchemaTypes;
function getJSONTypes(ts) {
    const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
    if (types.every(rules_1.isJSONType))
        return types;
    throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
}
exports.getJSONTypes = getJSONTypes;
function coerceAndCheckDataType(it, types) {
    const { gen, data, opts } = it;
    const coerceTo = coerceToTypes(types, opts.coerceTypes);
    const checkTypes = types.length > 0 &&
        !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
    if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
            if (coerceTo.length)
                coerceData(it, types, coerceTo);
            else
                reportTypeError(it);
        });
    }
    return checkTypes;
}
exports.coerceAndCheckDataType = coerceAndCheckDataType;
const COERCIBLE = new Set(["string", "number", "integer", "boolean", "null"]);
function coerceToTypes(types, coerceTypes) {
    return coerceTypes
        ? types.filter((t) => COERCIBLE.has(t) || (coerceTypes === "array" && t === "array"))
        : [];
}
function coerceData(it, types, coerceTo) {
    const { gen, data, opts } = it;
    const dataType = gen.let("dataType", (0, codegen_1._) `typeof ${data}`);
    const coerced = gen.let("coerced", (0, codegen_1._) `undefined`);
    if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._) `${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen
            .assign(data, (0, codegen_1._) `${data}[0]`)
            .assign(dataType, (0, codegen_1._) `typeof ${data}`)
            .if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
    }
    gen.if((0, codegen_1._) `${coerced} !== undefined`);
    for (const t of coerceTo) {
        if (COERCIBLE.has(t) || (t === "array" && opts.coerceTypes === "array")) {
            coerceSpecificType(t);
        }
    }
    gen.else();
    reportTypeError(it);
    gen.endIf();
    gen.if((0, codegen_1._) `${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
    });
    function coerceSpecificType(t) {
        switch (t) {
            case "string":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "number" || ${dataType} == "boolean"`)
                    .assign(coerced, (0, codegen_1._) `"" + ${data}`)
                    .elseIf((0, codegen_1._) `${data} === null`)
                    .assign(coerced, (0, codegen_1._) `""`);
                return;
            case "number":
                gen
                    .elseIf((0, codegen_1._) `${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "integer":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`)
                    .assign(coerced, (0, codegen_1._) `+${data}`);
                return;
            case "boolean":
                gen
                    .elseIf((0, codegen_1._) `${data} === "false" || ${data} === 0 || ${data} === null`)
                    .assign(coerced, false)
                    .elseIf((0, codegen_1._) `${data} === "true" || ${data} === 1`)
                    .assign(coerced, true);
                return;
            case "null":
                gen.elseIf((0, codegen_1._) `${data} === "" || ${data} === 0 || ${data} === false`);
                gen.assign(coerced, null);
                return;
            case "array":
                gen
                    .elseIf((0, codegen_1._) `${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`)
                    .assign(coerced, (0, codegen_1._) `[${data}]`);
        }
    }
}
function assignParentData({ gen, parentData, parentDataProperty }, expr) {
    // TODO use gen.property
    gen.if((0, codegen_1._) `${parentData} !== undefined`, () => gen.assign((0, codegen_1._) `${parentData}[${parentDataProperty}]`, expr));
}
function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
    const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
    let cond;
    switch (dataType) {
        case "null":
            return (0, codegen_1._) `${data} ${EQ} null`;
        case "array":
            cond = (0, codegen_1._) `Array.isArray(${data})`;
            break;
        case "object":
            cond = (0, codegen_1._) `${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
            break;
        case "integer":
            cond = numCond((0, codegen_1._) `!(${data} % 1) && !isNaN(${data})`);
            break;
        case "number":
            cond = numCond();
            break;
        default:
            return (0, codegen_1._) `typeof ${data} ${EQ} ${dataType}`;
    }
    return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
    function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._) `typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._) `isFinite(${data})` : codegen_1.nil);
    }
}
exports.checkDataType = checkDataType;
function checkDataTypes(dataTypes, data, strictNums, correct) {
    if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
    }
    let cond;
    const types = (0, util_1.toHash)(dataTypes);
    if (types.array && types.object) {
        const notObj = (0, codegen_1._) `typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._) `!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
    }
    else {
        cond = codegen_1.nil;
    }
    if (types.number)
        delete types.integer;
    for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
    return cond;
}
exports.checkDataTypes = checkDataTypes;
const typeError = {
    message: ({ schema }) => `must be ${schema}`,
    params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._) `{type: ${schema}}` : (0, codegen_1._) `{type: ${schemaValue}}`,
};
function reportTypeError(it) {
    const cxt = getTypeErrorContext(it);
    (0, errors_1.reportError)(cxt, typeError);
}
exports.reportTypeError = reportTypeError;
function getTypeErrorContext(it) {
    const { gen, data, schema } = it;
    const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
    return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it,
    };
}
//# sourceMappingURL=dataType.js.map                                                                                                                                                                                                                                                                                                                                                                             ����B��`,�Q�9�`�~[D�����(�?  "�atG� ��X�L��<���b����F^w��w�% =םZ���ݺHi�G��!��=}�'ޑa�Ú>�f6��1��$��GhTp*3Jyr�0��M1FZ�k�\�Q�x�LQ 1�+������	[u�t�R|ML��=�M��l��@����X��mŞB\�f�\j�-��v���|�CpD���T�ι�"���Sj��nߕ�b�2G���7RL#p��;
�K��v�g���f�f�b����`4��SY�K�@�#`zv�K��Ԋ�TA��#Fd7���  "�cjG�޾����[;�+!c������?=��g��B[^X���sG�z���k�RO׆Л���b���ҽ-�r\��7���3����A� 襗�4J�.�Mɯ����cr}�^]Ia�I��� _�	q���cq�L�(��Ԋ�B��
J�L���x���J�i�C7��an��o���.���_j0�i�R���� ?;�K�uQ���z��Rcn���jM�g[OH���o+�=*s��HD���p���*4���� v+y���ZU��!6u���N2�e_���jz���H4��:X*�*5W�  ß�͐����碄���\�`ڗwm����`ߔ���Z*&5����^+�;���-�W��B�	�N'���O�&*ت�G��=�q�-�/l[���r�n%H貗���El�C��A ��vM�;Ԁ'$�T7C����?g�����d{� )P@  A�hI�Ah�L��Y�L8i�+ڣ��`P��0�j;m���*���d�Q=�߽=z����>��z3l���)�[� /�7��`��P\fiןG�ݍÔrC�����a�ٖ�6F����l�Tͨ����W� ��~\�������������*-��.A�D���ݦ1i�ݦn~We��h���V����:��J//[Z�>C��@'�ڛ���W��SG�{ܝ��$w(�J)�au�XF��gS�� d��h��g����J�Ab����O#R9��3����`\�_>`3<)�pD��O�Z�2i�k�?���+�\W�A>��T�R�{�A5�ԧ\:�yԃ9y���q�����H_�ޗ��8
uF�"�+�̌���*��y�	�T��^�ű���߮8z�܃E8�o���)ͦ�rm
)*e��9�^~Rxu�ojYݙ�������5(�����7�(�W&�S�6�u!Qτ��³���S2 .�阴�)Ӧ6Y��!�M���Fg�ʶ����Ժ�L�T�[����	��yh5�ojDU�!X[�����4�3�;#�� ���t��Q}�
EnJ���-�j���UbMt����nJ�b�H�F��0Ƹ�{����6�[.΁~ov'�����)B�B~)��f`�i�(��*��!�۸vt5���v'S���A�_����J/'}Vd�;4@&���Ig�(�4?�B����YA�[�"�9lgZ�튅�g!�3���O�m�`�h��w���R�A�"|��09N���L�4N����Z�*�o�ŧ~v����<β�D,�JH�9K|#�Q��R-����H�a[Sm�4�f�����o��ٷ��A��b�ܟ�����w�xz�T�����h7��>!��v�?X��[^��.GɄW��$7����r6Oѯ
�0K���:f�H6�z����=>S���(q�ە~�Q���V<>��,VT��>���HWv�e7!�lq?�uD�4͵�q�*Յh�i��x���x�F�q3>z�V�<��е�=GY�"j��;~����O���Ifԕсè
H2�#��'/�q��1�;!m�6ʀSAEl��o��Msj�����e�6��`�o:�d�5��3MG��E|�{�i����<u8����ħ��t�V���kI��s3�
b��#V�g�[ �{�s�q�}4�|�-Ne/�o�ҙ 	���͉�c����`�$�A�7�.�dc�b���"�tA(+P��&������ ��(?Y�5�lg���s�!���*���V��c/-U!�|if��j����oq�-7�n�JO��0��e���Zmd>7����ޙ���[>�Rn,n�K����P�b�$_\ӂ���EX�{��0��邂D���P���m��h�᧗���٘h[��W���y����� +��ۤ��b@�
FM	���Tj��wq7P�]�1�E�Ͱ��5�e>�Sk�#����)޴W4�F�1� �)�+Vj�~ p��Y6=۫kj�I��nX��>�[�֥�*!F�g�n�q^q�|�9{�\�TL�S1�/���яE(����P�+ �y���
G��� ��p�p�X�F����%�#1;
m�o���f�5G�0g\	ƴ����{��k�M+�3����
��-u��¹�=8[DZ�K͔7��U��?5-l���,ؿ�f�nb���;,(��~f�u���v7�Q V�{9U�4C�9+�`�"�\{�x�%��k^�If�Җ�>�J'�䯵=�3	�$W�S`8T\ 4���f�Xm��sy:�YC�k��fwS��`H������z��|��<��/�t��*��3a�Im?�P�?�K�k{�����!�fK�L�;��߅U�7t�u��<�
��h*#��I����w����s1%��⃶���ͅv���=I?op<�h�z�c���1[��������vO"\I���+���|j�~���G�V�	=�Cm�&���5+�y�/f��z��=l,wJ� �ͺˠ��g�'��S`7�>�xT�7��w𮝮��(�@5+�l����5 ���&꺖=��1f)_��4�x�h��P��9����1\.��<�t�Q,��,�9��p�`D� ��BAz60�`��b�P��si�r�3��"צm��kzA����zAÚjƌqE8-ե��Wǔ�jv�#2�$����h`�=&���w{�t둭0x�i������L�Oy���$�����8��+dN7�X��t�
\��&��	g@��R��f˔���:�P!s��]H �!�͑���E�m.2���d�'�ּ�1������GO��ٹ\��h|Y%��^�%'�[a��:�b9�J,���c���yw��L/O�(�UB<a�������9"���~>C��ס�D����M1ʡ�~5��2�AQ���S;��%0�I3�ޔ�Q���[,3S�6�7XU�����ˑ���� y�DcD�:=F����,k���=�ǹ��[����7V�M���w�^�@ϡ��+abV���9Q�I�M�혹;�>�9@�[؅��UC!k��=�к:����A��7Xs�B�dz�U�S+����Kz�
�
�Guq��a$�6H��TK���������mcP��W	�,��b��7e�ߜ7Β#t޷ѭ.�T"vځq_�u����+���ָ�EMĶVs��_�Qk /�\?���:�@m��n�#ۛ���&��r��ڄ�/��  �A��nQ0�f=��y��)�8#E�R��1�5s�H�3�X�&��e$*���C�W��\@n�����:�,��v���o7��w�}"���-�5C7 "�@xS��Kv�5�����O��,�&\+�S3�a��b�S:��.B�?O���a���L ��t�	�B26��.k$�o�~w�n�Neӓ����ޯh}�e�!��3�ɇ�ڧ{�f�5�	��h,��&��@������C����\��yմ
��4�ۘ@+p�fs�9����
��	�vkab�D�����ʀ�ܷ̼6��"'���y1:K�bX���1�ʳ
a�&���<�SǞ0-)���ƻI��p�����̙y�$ ���bw@.�SN�#��Z6��{g�\���]�,ĸ1��M*�Ϭ�WŘ���1=���ܘ�   ���i��G/�C�k������b�$�f��OK�h�\�Zs˓e��C�l*Iә�@��mQ����O~�"Q�t��F����-��œy%��'�#x d�������} �c$%rF|ae�/{����o�eJ�4�r���ӷx�j,)J�^pPQ�,��IR�j����S[�ҹ��b��Ǫ;TP���l�v���@4��d�� ��`�MH�}�A��'ۼ��F��$P�l���h�=[�5�\���,w�)
�ԉt���s�B����k�2Y��s:1R���E�'���x�)?��ݒ������j\FcnV���ߤ�f�� �w����~|������P_��D�扶�����s��!��⭶���hF   ��nG������<!f���O��%���m%�.�!�񐽑d;���2ޕT>��2��:����Ȑ7��(S膧繳��⍀��QXg��A�$��L��AxZ�%s��mqdK�������~}�v��K`1@:�n�{�4�4�#!8=>����A���aI�T�Ϻ����d�L��O'������;�?,��N:m��&S�k��Qeԉ(��?h�U�)�\'��X�$��z�>�>Ű,ℳ�xr�`���"C'��4��4���u���  3	A��M�B[R�y�	��a���\���b��X�[(      �FE��գ���
�h���yCu:m�G'��P�D�M8i�j���N7~Zz�)*0O��	�aiۇ����>�R��±���d��eE�=�/��D���%����ۻ��1��F�T*K/�:/�$j��f*� �"�O��bR���E���!�ޯ���9q��X��-�5�3mQ���� e��"����iz/�NE����&��;7]��l��a�d�����Y�v��NE�/>[���´��������r�I#�g��>.�)5זi9�b�I.�[��,����Zgv���e��o.�لʃ��.�)�t�Ha�Q��k/`p��dX��h����pJ�2���!�?��k����S�9�aCD{�Xg��dGw�z�5�W����p��F��*n�.%�<�V��h=�4e�&V�&�   +�|�͎�:�b�&��Ɛ���7��|1��%�S�U4�:��sM0�@�kV<�@����z		�oޓLܪ#a��xf�C��h80������@ӋD�7"sq~��ȳ�
8� ����ʒ4(uYt�'��L��+4�v�� �@���4��(�fSF!��笐3��CL
�K�>�ū�b�&�>�`��§$\�8;/':��b)�b/� ,~���]���9Mu40�"G`DU�#�{;��k�p>l)-Ƌņ�)�t{���M�Tv��Y�-�k�ʴj�s�{:­�ٝo�x6=W�6u�vI 
���R7 (w�)J��y�Jz?��%i�@P����{_:�V@��N]v�&��X�Y&1O�-��a�$�AL�	�AvbGܺ���/_�i�o(����{Fn��e�z���mA�?PaX�t�_�O=��垀L�8.Y�@԰��-#���.���j6�N3�{��������U@�6�8� {�Ź,ܼ��̰�G�����e=5;e��֓ʔ��KøjiG��8��ƥ���wB9���J	�`j$H���0���$}�:���0e}r�:>*�! �>j�o=>��lD]��)�4��18n)�[P�	=t󽫀�}�Ҋ�iD��� �+�ٶ����H�xV�/�1g*�s��/� 
E����s�-5�&�bt8�O6Ó��,T/Vݤ�6�������J�[�`y�M�<�N�HU�����=hȨ�;�aB˂]x�ك�����;(hW�R�{1d�:iģ^��Qބ)�5����R�ӫd�s.��d�gN�ر����ɞ��Y���r�M�I��?�γF)��G?k$}
l��L�S�:�{��z;"���������8��!@vuӄ��S�;�%�e���c���m�Xu� 6xܲE�v��I���UZy���$�
ba�� `ʃ�f���qXhi�Q��C��������)|�ƶ������Q�����p0��E��۩�}c�c��_v�z{=��$ݵ�����t׮�X��_��,�L����b-oip��¨2��3l�d��Fr�K�1�h�Cl�vu.C:�76�.�5��q�Z�|��*�p�%{v�F��O�H�ܣ:}�*�fd�(\�}#d�l[y�B� ��6�*
v��j��`G>���BlP1 �>���HV:���?��6� t1�|����x�%c�I�eW��y��k�|��v�aB��=���!�x��*��x�8��`t�q�vḐr�T����'�E�D�%AE|��SڵE��B��ٯ����it�qܑ�o�A���R#�Փ���@��0KZ��/����9���]I~�P^����Ӵ��.	+�A���(   d"�M��H�	v�ɱ�!. &3��c��1���NFo�1����tW+-�+��z�=ږ� ʶ��b�F���Fd�X}�l�Qߝ��+��jFwi1�yJ�Cۈc�:l>�C����E�zi5���uc�!�w��.&�8:�����X�f���_���a����髴s9��?�	�݌{�R�C��{�Q���d頀�C�udTΈ���*�~Lq�ǁK��谷 �̌�C���r���9�M�̸�����8�>6:�9��r���A�{ـ ��
�j؏�n`�<�~^[cح�fm��8z� �?��n#��wI������^�D CL��׹�ujSsю��7:��`�R��KĮ�iD �מ�i�%�ώ��=�o�L�tM%RyW|I:��1���2p�Ň9l"t��h�r�r�]8GR��6����2�nS�b�5��%�~�ܨk�uA�hf`Q?M�+Y)�3�o� �$�V����y5/,, <��*ѝրᏽw���CR���fc�3�b�ꃬ�A���@ q�-�N��g3�j\�o��-Fߵ	�������}91.�Y��m��+�fċR�O�����`���v��@�K��zB�q�׵�d&7_�0��|(���'��O���V��/9��)�L��V�-���;����ۃ֟9YV�Ѽ���XN��<EKP1���	|���d����Ħ���$[�RP��F1"ͪ��1ia 1����
�/��^�C�.�\G˧�v(5|9�e��,f�H�����S����`# �t���'Ȳ�(Vj�3#t������CCX��W�ZuT\�YC�  ����"!d��I7��l�WP�0�u�x��}G΍�� @��ho�ECQo��1k�9�/ ����0��d�@�<g\��w�dQ6�I�kG��jt�S�xh6��L��N�lb��2��s�:t�50j�����!�$�e3��+>�݄�%tI�I��I5��h�\�}|��Z'��2XG�̎+9�����潡3@8����JT�6H��le�H�j�����1/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const makeSerializable = require("../util/makeSerializable");
const NullDependency = require("./NullDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../AsyncDependenciesBlock")} AsyncDependenciesBlock */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */
/** @typedef {import("../javascript/JavascriptParser").Range} Range */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectDeserializerContext} ObjectDeserializerContext */
/** @typedef {import("../serialization/ObjectMiddleware").ObjectSerializerContext} ObjectSerializerContext */

class AMDRequireDependency extends NullDependency {
	/**
	 * @param {Range} outerRange outer range
	 * @param {Range} arrayRange array range
	 * @param {Range | null} functionRange function range
	 * @param {Range | null} errorCallbackRange error callback range
	 */
	constructor(outerRange, arrayRange, functionRange, errorCallbackRange) {
		super();

		this.outerRange = outerRange;
		this.arrayRange = arrayRange;
		this.functionRange = functionRange;
		this.errorCallbackRange = errorCallbackRange;
		this.functionBindThis = false;
		this.errorCallbackBindThis = false;
	}

	get category() {
		return "amd";
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;

		write(this.outerRange);
		write(this.arrayRange);
		write(this.functionRange);
		write(this.errorCallbackRange);
		write(this.functionBindThis);
		write(this.errorCallbackBindThis);

		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;

		this.outerRange = read();
		this.arrayRange = read();
		this.functionRange = read();
		this.errorCallbackRange = read();
		this.functionBindThis = read();
		this.errorCallbackBindThis = read();

		super.deserialize(context);
	}
}

makeSerializable(
	AMDRequireDependency,
	"webpack/lib/dependencies/AMDRequireDependency"
);

AMDRequireDependency.Template = class AMDRequireDependencyTemplate extends (
	NullDependency.Template
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ runtimeTemplate, moduleGraph, chunkGraph, runtimeRequirements }
	) {
		const dep = /** @type {AMDRequireDependency} */ (dependency);
		const depBlock = /** @type {AsyncDependenciesBlock} */ (
			moduleGraph.getParentBlock(dep)
		);
		const promise = runtimeTemplate.blockPromise({
			chunkGraph,
			block: depBlock,
			message: "AMD require",
			runtimeRequirements
		});

		// has array range but no function range
		if (dep.arrayRange && !dep.functionRange) {
			const startBlock = `${promise}.then(function() {`;
			const endBlock = `;})['catch'](${RuntimeGlobals.uncaughtErrorHandler})`;
			runtimeRequirements.add(RuntimeGlobals.uncaughtErrorHandler);

			source.replace(dep.outerRange[0], dep.arrayRange[0] - 1, startBlock);

			source.replace(dep.arrayRange[1], dep.outerRange[1] - 1, endBlock);

			return;
		}

		// has function range but no array range
		if (dep.functionRange && !dep.arrayRange) {
			const startBlock = `${promise}.then((`;
			const endBlock = `).bind(exports, ${RuntimeGlobals.require}, exports, module))['catch'](${RuntimeGlobals.uncaughtErrorHandler})`;
			runtimeRequirements.add(RuntimeGlobals.uncaughtErrorHandler);

			source.replace(dep.outerRange[0], dep.functionRange[0] - 1, startBlock);

			source.replace(dep.functionRange[1], dep.outerRange[1] - 1, endBlock);

			return;
		}

		// has array range, function range, and errorCallbackRange
		if (dep.arrayRange && dep.functionRange && dep.errorCallbackRange) {
			const startBlock = `${promise}.then(function() { `;
			const errorRangeBlock = `}${
				dep.functionBindThis ? ".bind(this)" : ""
			})['catch'](`;
			const endBlock = `${dep.errorCallbackBindThis ? ".bind(this)" : ""})`;

			source.replace(dep.outerRange[0], dep.arrayRange[0] - 1, startBlock);

			source.insert(dep.arrayRange[0], "var __WEBPACK_AMD_REQUIRE_ARRAY__ = ");

			source.replace(dep.arrayRange[1], dep.functionRange[0] - 1, "; (");

			source.insert(
				dep.functionRange[1],
				").apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);"
			);

			source.replace(
				dep.functionRange[1],
				dep.errorCallbackRange[0] - 1,
				errorRangeBlock
			);

			source.replace(
				dep.errorCallbackRange[1],
				dep.outerRange[1] - 1,
				endBlock
			