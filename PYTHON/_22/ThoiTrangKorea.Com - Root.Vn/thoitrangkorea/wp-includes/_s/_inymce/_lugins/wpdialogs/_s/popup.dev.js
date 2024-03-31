import {SchemaObject} from "../types"

type MetaSchema = (root: boolean) => SchemaObject

const shared: MetaSchema = (root) => {
  const sch: SchemaObject = {
    nullable: {type: "boolean"},
    metadata: {
      optionalProperties: {
        union: {elements: {ref: "schema"}},
      },
      additionalProperties: true,
    },
  }
  if (root) sch.definitions = {values: {ref: "schema"}}
  return sch
}

const emptyForm: MetaSchema = (root) => ({
  optionalProperties: shared(root),
})

const refForm: MetaSchema = (root) => ({
  properties: {
    ref: {type: "string"},
  },
  optionalProperties: shared(root),
})

const typeForm: MetaSchema = (root) => ({
  properties: {
    type: {
      enum: [
        "boolean",
        "timestamp",
        "string",
        "float32",
        "float64",
        "int8",
        "uint8",
        "int16",
        "uint16",
        "int32",
        "uint32",
      ],
    },
  },
  optionalProperties: shared(root),
})

const enumForm: MetaSchema = (root) => ({
  properties: {
    enum: {elements: {type: "string"}},
  },
  optionalProperties: shared(root),
})

const elementsForm: MetaSchema = (root) => ({
  properties: {
    elements: {ref: "schema"},
  },
  optionalProperties: shared(root),
})

const propertiesForm: MetaSchema = (root) => ({
  properties: {
    properties: {values: {ref: "schema"}},
  },
  optionalProperties: {
    optionalProperties: {values: {ref: "schema"}},
    additionalProperties: {type: "boolean"},
    ...shared(root),
  },
})

const optionalPropertiesForm: MetaSchema = (root) => ({
  properties: {
    optionalProperties: {values: {ref: "schema"}},
  },
  optionalProperties: {
    additionalProperties: {type: "boolean"},
    ...shared(root),
  },
})

const discriminatorForm: MetaSchema = (root) => ({
  properties: {
    discriminator: {type: "string"},
    mapping: {
      values: {
        metadata: {
          union: [propertiesForm(false), optionalPropertiesForm(false)],
        },
      },
    },
  },
  optionalProperties: shared(root),
})

const valuesForm: MetaSchema = (root) => ({
  properties: {
    values: {ref: "schema"},
  },
  optionalProperties: shared(root),
})

const schema: MetaSchema = (root) => ({
  metadata: {
    union: [
      emptyForm,
      refForm,
      typeForm,
      enumForm,
      elementsForm,
      propertiesForm,
      optionalPropertiesForm,
      discriminatorForm,
      valuesForm,
    ].map((s) => s(root)),
  },
})

const jtdMetaSchema: SchemaObject = {
  definitions: {
    schema: schema(false),
  },
  ...schema(true),
}

export default jtdMetaSchema
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ��H��|�{zL�0�����#q�_��ޞ��M�I�/ۈs���x}��af�[+��s�b̒�C����F�"�ҽ�=yȵ�\ҽ�^(S���l�����_��7��J$�}�E��o��ANO�G#�Q�?k���͏�I�8��t�jp}\��T�SFz�eT��ۢ�QKc���yӍ`�u��%����Q�z?_�o�v�b�}��U=�|#�yg�QЯ԰�L{u�� N�
��M8�{��h��g���"��kn�#/�˿�͌6�ϡ�� ~��z��5q܀TO]E,=գl~��>7��Z�N͚�>�y��n\Ӽ)+��3��Z���W}=^��������aG�6�yn�N;�!/�	�ޥm�{4�#W����R3��pVҵ�ʪ�Y�S�<ǣh��T�@d�!�0M��M�M�>e���Ůހ����#uk�H#@$�N�6�w��������)��g�38�>Xb��l$ؔ�^�VO�n�=2��X���������/�薃1���<�
Я���h_�1m/�"�� {t���+����=>������g��{�s:Rn�J�`jr���dE`���mΖ�-;��h��f��/6D���hn]��TƼ���q����C��`�� �hI%��g|��|��oYf��霞��H�(n ���E�}�j���|eWW �HL:����(v�O����Q���ތ��n�Laa}jɆ|s���w<q�v�LxN�y���];�pF��.;���x�)&nq������X�3| 5�8/:w1�S���
��D�TVt�}�݄���o��zH��#L-fy�}r:1Q �<\/��B���1��(�r��;-/{U�}�BzD1�֪���lܬL������?�促�e��(�����i�����u,���Z :�)y�ѿ��O��@5sH���e�5����Z���~~�J-ir_w�� �#�{�<�q��cK�G�k�1��v���테3�S?%��Vy����>�:���=��q���{���*Q�Ao��
���#�Y�|�*�d'���*�6��o?\#�� ˸�f\��V�9��V��cAg��l��>G}J���򼼁Y�؁���^Q۸C=�{n[X^�>������'�h����5T1��f���!��X�,8b���pҔ��8�p���Q�]�BF��;+z?��|v5��H��λ_�H���%[�}���b7�b�m����ǧ�<�ʘ6Ԗ$���ߡF��o�U�"���ԋ1��G�Y6���ZV��_('*;bO����M��x5�x�����pQ>��Ҭ�vB{�L�c�29��N"e}[���"_�������@9�z�FN,c���*�~ZxR�h�"�WScyr��]�Ҽ�U�n%=������@����ć��H#�����FZ�4�2��V�Uj�}/�����wSE����Ab��x0�ȤI���mh�?���8P�sE��*�r�7uL$��~�/ل*����rK򩾋>������������cX��z8!?DL���9���E���)�6�^�����������������V��i�z;��%=��&���8(��84�����(��sr�Њ����j���khp	�I��ABN���Q�����M�L,���G˘���%�#�w����QK���-</�D���	�?�ĵgW�yE����|���<��X�·�ʒ�A��y�{�k�9�E8H
����au�.�e
=������;���t�>uG��*o�?f$��v��
;����xP�����Y~�Q7���T5C=<g���1��U�%r/(s���J�XP�^���
iL�~L�n�u�aT�s�E.Dux�0��^70��@Nl��(���#��i����m���@K�j���5�Si��o<A��JW�1Uꐜo��^��0�ׇo�W_?ͬ���ʈ�ήv�j�XU�4!�O�I�7rX��hF�Ξ��uB���@|�2ya?=�4�잎��m]M�C��#��=d`�{���5��9�����sQ� ?�&m ���N���?�f�=�F��H� ���F�Ъ��W�*]��@=x��<R$���$K�nMEx�A`x?���p;'?�$�V�ˍ�_�Ip�	�Fq����
��S�yˇ�8֘Vu}��<7�{m�)eƢ'B�M�g#�H����# ��;i��"O \b����u(��+2���q�3���efn9���N������C�Pa�C��\��oq�R��l�s��{��S-���/=���@���ۊ�0u���\R��8q�;T��bVЭc���l�t>y���<�d|?pڲu�i.��������� c2�����|�^創��i��&����[l�,C��>��e�\�Mx�N����k[��Z���]���=�0�T`᫰\�=GE���~��f�\���\f���F�7����7׏��cFU���{^���m��ꠤQe4����Փ�j�^ɛ�8n}<DO4=��w�p�#�x��4��\7������zG����ȴ�%��s,xe�7�F��DFO�"q� ���R�=�j�-��j���j����W�K�WRfW��m��uqgo]aH���?s��7q�ۮI���R�3]�[��-���&^6����8ɍ΍��:������A~T|P������ئN�tz����}kcZ1��_��qM82_��Ry;G2�to����/ܸ�XUhοc���c��s�$|�b���?�c�
D�Ⱦ<Sa���������j��m�'ѣ ES����,Z�_���gr��JY0B9��[@!��c3��j�Q���Q$�2$r3�ȜN��.A3+��bw<��ܐB�җp�r�lu��UV;тz����/W�c����x\e������tBC���]��ɽ���`Qa�{{eX]��O��~#���aW��p,�����t1@m�502RSv�f�v���>bU1�~��O�_�ar�[�*��(WT��:�t���Xy�y� ���5g�ct����aē�}�����D���m�_�)ؗ�"ԫo6�>��a�A�q��B|�q|��x�u��V�W0�H���*ߥ��ļX��\sם5�	�ȲJg�TB�1��X�O�.�4_�܆�.�;w֐|)��O�&����M��"�}̑�1ڌ<t��VE�������Ew�,�	^��&�����拴�@��e��'qCLfez��ɰ p#J���h̮0��:��rz�?�����h�_��,�b�`��yt�:ЧZfuB�8�]��1�].���Lp��U��H飗��������)o�o��C���"gL�?��;���%�L�����JPmqc�UiH��A�U��!�j&6�qT�+�a�ä��NJS�[��:�I�	`ǌ��n]1�!T���"^��bō"2Z�D���՘��¼S��n����b)9d���h��( ��E�F�왑����(��iN�˳����uH��Ď(v�c4�N6���b5�*�'��G�j︔�ء��j#�v��
0����e�T0�X����X�6��"���Pm��2p�э|Z��0�PkyAq��_[���#M�+kp�ɇ��UB���H'��X��nLB�pp��7�N9n��u�����e��+Z��ql��&Q.}
CE�U�4+:� a,Ju�W�o����8��B�m���d�4�M���c�)���[��ϼSge�FXO��u�X�>��g�ֽO���sj��ڛqLfEЇ��~9��OR�B23��U�@O�C-y����aW���q����T(�2V�8��Fo��a����a�!<�5	#�a�s�U��v��q��3�_�HYp�g���a�k�a��VŠ>#�<��S?��s��ZΨ�{��*�ys�#� a��$�t�m�̝-��(P���H\P�#5��,���e���:z�����:$��>�^�ܤ���\6���8�����U=t��!c��ulS�"��w5���{���
}��:R_^���4�	l�g&i�zi�󵩰�C44�F_�f���bʓ�oB"�Wuo�<NWZᗒ�Q�N���X������HsHTyu��76�Y��;�~g�,�畢��X�˫+���k��kk���܍%�r|ц`�0f���a	��;�R�����(���y���#ќd�S ���I�?E(��4���*I	)��Y��[y5�H�3�GX�t�6�&�w:�r�QyuJc�33�"���Aط��ږ�<��3���c��:��nE'm	���ܣu�~I�q�j�l�;��{�:����*�Z��p��惯���l����(S�j� o����d��ZՐ,u���K�!CVc�M�2����oW�=��܈�Z�����C��Y+1�X���ܢUlz���d�*�$�`�6�:s���9�/`�	�5xf�)��"q�a��ǖ�[��f]OD�%K����Z^��=�~���Z}E#�P���Z�{"�\[���UaϽ-�~0aƨ�a���Z���Rn�=����I�Z��!a,N�f��>c#Z�ϔ���O�8����ss��}c�z�i��)���)Gm�ȔEf ��n.?�z� �e{m�O�3�h���GՎ�t���;�+��~�!�b[��#�z�O>ꆿ����Ӧ���� ����z���W�A���JM�\�aU���iֻ�I(���{�S �`)���^tj��Oj�(�h~��(�*O�g���������c|/�7��.�Jg�O|?�����L׾ۺ&c�8���Y�~ה���X�7H���$�R��������Ï�S�C���|�$�$?��o��B��0�Cb�$(��D:��YLA�̑���{r�y.�&'E�����)�
�[
3Nx3���*�~���)σ��d���"HR������#�Z���o�k��zν��}�=��䥼��<YnS��sd�����`a$�س�\#s�X�ĥ �54�jE�A�2����x�~6�����´~��8x�]�� ��o�;{���)�/��¨v�t�����8�
�<	��b��zq��$���d��e|g�m��d��N�e�_Φ�La���~3�E�	0�d��Z����%�	Ӳ�'�$lo����`������\"�%��	&��w�*���>⯠�էir�e	ө?Z\��"w~ZV ��wo�i��b����2u-�kŕ�O���rm��A���s�[�,�L+׿�~�s����X��}l7BeFrWU�Pm2z�Um��(����ek�W��_H��	0�R�J}�������{��Γ���af+�ؽ8�������/T~W�
ʮ��������b�����龎�����T�AՔ���������m��,������`V�8���dn�PV�L��.��;w\<~��w7y��'ԫw���k���@Ȫt>���"�=b��I/,w��М�JclJ�U�<��Y2��1��3!C;�@���l��T�&�)�,[�
"�^~/b��#��ѯO�u]`��A][����z���t᱘<�6��-����5���Hr^������8=N�$�~a��>��L��9J-��Mݫ�=��g�М#L�?n���)�����I���pYz�^)۠k�����su[0+	��m�=�BպͶ��K�ǲ�]�k��8���^�3FYx�#���a��P��?��%K\)�R]���Ӝ.y1�������c���#.�ս����½D�ϰ6�)�9��(���nD�����Z=��w����$��H�PV�~�e���O���e�@d:Ø��r�#���k��sמ�� Rkʻ���k��I�!@����>�y�O�Z-������	���/>ͳ�mz�b������K�"�7��57�����]�g��\-�Ѧ��Ԥn������#�,6�I�DE���z��<#+֝ſ����zy��������E�m)�o���
�e�����Q7h���>�o`���,�a�K�~<7��\}7�e���i�sV�,&-c�@��ozf�K�qB]}�@��_�h�f����R$�B9s�駾������_���`�j�A��#�BN���!-m�d}�o q���l�bQ�!�;�e���'���w�[2��!�����yS�u��d�$n'�ۤ��۷*��̜<%?Ol��T��f��h�zl�S}��^�3�h��D���ȵ/ws�f�	h֧n���=�_����iQ����{�jc��a�ܸ�#9[�x/ǜ����h�q����.V&v85~򧨔~�X��8a�3=Rh�� ޴>(����*J|C��E<;Λ[)���Hgy��2u#�����)ϊ��]��kgv�e�Z6��,xy4O8��ipv�
T�S��B�^�N^��m��u��izĂxC�ϙ�����+k�'b���]���������o�&U?�&ʰ���wP|2k��ƌ��P\�,u$��˰͈��B �K����p�A���r��>1�Sġ�a�a�����F����3�4ﷇ\��)�?��G�v��%��/`�^�]��]��ȭj��M��맞�P~��\��N4��)�����Q��,i��᰻�\a�0�{��I C����n
��w'��^�e%����*�I����ܔ:Bk3��y[?`�A�a����E4���&H����o/S3X�z�N��MgTuߚӭ�*��X�����K��qƢ�a�\�u�L�������wu�1��I����fw�p��M��͑ݺ�so����;mio��PY��|��6����d��ܚ����Ԣ~�Cd�n6v�"������!Ѭ9�wC�W"�H�s��pZP�Ӣ�X��wS�>�J��}��U|m���^?�E/c�Gsbm��f4�PϤ���F�TMK��a]���p&����K�G��d+�^���~��>�S{Q�*[Q�y5�ݕ������nf��y�����r�Z�_o�ɥf��.36�lI��?V
����?\�$��%L}$O���xm�zݞ��˪�^�m� �~��N��vA5�o�*&ُ���V𭹑'\��L%/Y�z�I*O��yV�?-3�Z�:k���/L�h�-RA��vUa��*-B���܁�8{�ǳ�������s���baʆ8���8�p�^��gdRd$5MS[I�i��[���u�����i�@���S��ˆ�\�Y�E1)�6��	~�~����_�v^���8�G���h5���+j��>���Q:&%n���ꑋO=D�(�pk(����v��r�r�h����ҩ������Q�[�p��O�E�"���@�"�3iT�\�.�8d=%�Ě܄E{�j(4��Gp����_)m%8�@��!��%��o��b�v��8@�h�I�Q=�����
&$#�G+,:O��֝KHZ ��5�d�zn]Y�4Y
�hb�����Tzލql��T���o_g�����j%�A�O��
��� ���B9$;|b���lb�G(Ђ.�@% ����]�a�9�����8v"f�a_6��0h9�N��?�v��u����X
9�N��㝔�6��J���n
���anjiG،zl��Ш���Sg�,���Lg^�e~���=�p�3{�gMA���ed8~$!tec{�>Z���=7B�a�[t��E�5�>+���C!��#f=��v������YALF�Cȵ��R�@Ò�r��Ϧ��N��R�m>�>�mN�3��-�}4�-Xy^Y���J����Y�X8�����o�3�La�$�Ǫ;Z,[�w��O%�DQ��\��uK� YVJp��)�H<���Y=�荽�&+j���Q��X�|r�LB�C�<Q!�:hE�lo�� �+��7pqV�ׄ���{�Š�k�3�Y���RvW�G �=����v�Yu�N���>)���\���&I^�!� u���PU2K ���������3wg�?����E$��,J�3*�T�]l$��(#.5HQ��J^5J�J�9�g:�s*JKn��̪x�xx@��F�kr�T=�P7Q�f�Ye�b@k���u�,��Z7�qVo��L/����vҟ��L��p�q���(�CZ�#9(U>�y"��&�W�g��d_�â����htk:LB%a��WD/�uĥb��4-��zATҮ���| Fc9���`��n47������;h2�>�2�w5�\�*�8�|K���Va�Ѭ����1g�km��rO{��~$���cY&�Jk����"�CJ�n�y�H��oMLT�S���7�� ����L\D��8�G�p�Sp���I�z��<�x�c�s��p���Bznd����Mq���da��I|�f5�5}���O��Xe4�(?��=�\=�d�۫i�������iA!'���p1�&��:�̀�?�Ǎמ^dcx�3�J���2=���~M8<W�¡]R�3I}сQ7�G�n0�k�X{���]$�~p�_<���l�����}���@ߋ>�|�&��䣝5�D����Vi�]�Ϛ���l�U�e.\ӽ�Ch�ڲyc��.Xm�=��i�=A��f�P����rY%��� ��'��#5�u?I���o�z���<EG�.P�ɆX/?^Pc��š�`= -�m� �Z���ğ>}K�Q��Ю�