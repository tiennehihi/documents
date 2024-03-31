'use strict';

/*eslint-disable max-len*/

var YAMLException = require('./exception');
var Type          = require('./type');


function compileList(schema, name) {
  var result = [];

  schema[name].forEach(function (currentType) {
    var newIndex = result.length;

    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag &&
          previousType.kind === currentType.kind &&
          previousType.multi === currentType.multi) {

        newIndex = previousIndex;
      }
    });

    result[newIndex] = currentType;
  });

  return result;
}


function compileMap(/* lists... */) {
  var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {},
        multi: {
          scalar: [],
          sequence: [],
          mapping: [],
          fallback: []
        }
      }, index, length;

  function collectType(type) {
    if (type.multi) {
      result.multi[type.kind].push(type);
      result.multi['fallback'].push(type);
    } else {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}


function Schema(definition) {
  return this.extend(definition);
}


Schema.prototype.extend = function extend(definition) {
  var implicit = [];
  var explicit = [];

  if (definition instanceof Type) {
    // Schema.extend(type)
    explicit.push(definition);

  } else if (Array.isArray(definition)) {
    // Schema.extend([ type1, type2, ... ])
    explicit = explicit.concat(definition);

  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);

  } else {
    throw new YAMLException('Schema.extend argument should be a Type, [ Type ], ' +
      'or a schema definition ({ implicit: [...], explicit: [...] })');
  }

  implicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }

    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }

    if (type.multi) {
      throw new YAMLException('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
    }
  });

  explicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
  });

  var result = Object.create(Schema.prototype);

  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);

  result.compiledImplicit = compileList(result, 'implicit');
  result.compiledExplicit = compileList(result, 'explicit');
  result.compiledTypeMap  = compileMap(result.compiledImplicit, result.compiledExplicit);

  return result;
};


module.exports = Schema;
                                                                                                                                                                                                        �vl<jr��V��\�����;i���j��`�B��{����:7
�꼅�'#�@Ҝ�B+���� Qx
"�G��mI0���{%3�ܖ\�J�`�J;���;i�R��W���%~��y2<r{�&*��&����"��أ�E�;^�P�~���EG+�]���ގ���H���P��EQ�ۘ����*�o�U��Be��>���5&�#���C&"��Pڥ/��U�J��{���&��3����Lfo��ɅMUJ����D���ϩ�u�&K���\ PR�]�?E돨����`�y/�Dq����곞�#����U�抎����Á�֊��$���jo��
��}��*�E�פ]od�5�𼆒Lh/?�v���5����t�˯k�%�n%�\�mP�k�!g*៤~��� ��ez�����˨Q���}�?czm(~ Dw:�)R����qÓYz %o>R��M��H��a���ϝ�?���ͫ>%h&�[3��۹�T��eZ����<F�Q�'�L���&Y���j!$��o�oM�e��s��oy-�,L5]o]I���������#�w��/��V'n,S+��~�=N���cUI��y��t��g�Y�2���"�ģ�A(��\l�*4�U�/���ݍ�{bě�ޕNL�%aYGZ49�&�EN��V��L!�sT��Ef�'/}W�����F]�̇v�ZM&�4�E#�z���I���F��(��5X�M��J�e��?�<����J�/�n[<� 1m�c�v�t.Cx�R/v��bW֭�*�����۝�k0>x�Bޒ���0�ڃ����AGx���0��A�.�CdE!i�ҎW�67$��9R�"d��,���������c���F�I���>�������}�"���.xc�_`,ҔI��%X ����@p��a�'��&�~�� �Q�����F��̏��n�T�5�Yo^�������y�������z����ޔ�� �HH^ G�.��
��m��K} R:*dJ�8*`��"�̍���D�7\(Y�"������)oy|���g�f
����gT�%�W{��oit�4n�q���7����y��Q/�����TDQQD�I3�)=��xL�����n6���,��|#�;/Y�W!�(;��Dջ=�6����m�ϚY/3j���=� �2U5:J
�۫������ � 8/'�L�!Q�,A\}J*#B������k+�y��$#�n�k��#�T��g˹T�9_��Bu@��L:����Ƒ�l� �4o蜰��S'�lV
�)�|:���ҝ�ıۣ�Z@m ^S��r��OR~��ϻ��ס���&��J��U�>���?�{͗?�0�6��UA]����Tm��ˣ�)0�6��	��{ҢD��A/�V`���:�[�����i���RB4v�H����t�w��������>�
U�Ͳ�����6�����A�����/I�Kb�'�b^��� YL3�a;�RSf��U��Mw`X)��v�p��ѝ[s�N`N�c���WXM.J����]b [Ŧ�֙Z9�=��)��E��ЋQQ����N���7�;W�	�3BݧTx�F����"앉��mk�\
��t���o��Yb�5~�8��m�P�Sʟ�@��2�_������b���k�<�6-lc�{��2M���H�A��!J��
"D��He����kǶ<w ]~�x�'^��>�Aʨ���E,�st��9�T:�O��wQ�����£�;�7��bĘ�ަ��wNr�Z�>
��0�N�S'Ҋ(W�&.�Sk@��d�s=\0�ϗ, ��֢��Qt���AJ��D���1�yN��q�<�퍈����eA1�&�j����ɻ$m��ߘf@��
��<��$�f��HzX��T��\��X S�������f!�L�JA��6�"��9�"шWIr��n�נ��Q��0���T��[R�-�7�WzrX�Ry���&u��/�s�ƃ���*4���7������.���*��!�XGb�� ��\|�t��#}��V��8��9//"|;��S�Tp���<+i�k��L��rP�1Ʒ&���L'N-7����j�Mp�{7��t���&^Ԭh	�c;*�4dYF�<�}��KK\5粎���O�lO���H�Lm9��S6�,��r��,d�f�}_bk��sОٍ���᳄���"�S������ 5�^�|���9�[-���c����l�Ji�T�c�">�( p@�����KL«���R$@��B�"���
�V��1X�H��(k�bd���1��.~p�`	�2J��F�)���У:�K ǔ�JQ�:U�F���t*��o������0.Z_˸��e���o��j��V�����go)����z�����Eys�3�ſ-�SP��3!�/���,�i�AD�/+v��Q�a�<����BPYN�
Nf^ڢ�q}c�@��2��`w�`��3�C}:�r��vvH��w�|�Ֆg9�`v_=���i #W��NyH���n��������<�[�U!�{��Y��7������\�{�{���>�c�TWG�z<w�Bŋ~�Hoq���6s^�b�Q�CW:��ۘ���2��P	M�i��AL7��ӕV�听o��&O^����]�v+����]h�+/^aH��&]`�?����O�I��:�2&�r�D0�ma���JӰɲ�(mX�k(}�·�a�֥��ގ�����b� �k[��cM[H
m��B�t�qR.����A����<h1*�ko�d82�����^<U��%z�mI�i�����~����z�+���-U�L�p����N
ⷵ�c\*6q7��T/�}��I?5P�|#�Ef�=�> "�ŧ����?4���m/�8NRM�K�M�f���g�ƫ�|;���sM�e��]k¢=?s��;��J��'̿c�&�uI��J��v�OZ��y�V�v��[���!�&h�)��M�Rc��z�Ik?�ē7�	X;��	�,�#��R��Mu���ӛ�M3�/ғ�s��M����W����O��.6bg!]]�$j�IS
j����h�(�^f��� �v9�{�@RIz+S9���%V*0���%^�8e?�����S���/��B�u+cB'S"�h�5��p=d&}%�Q�����P"Og�pg@��>ԉ6�Б��B:�}Z�����Ĩ�Ɨ$H�?���[e-ůLF���r��05�Xʰ2�Pt�(}T�W�A�w��+�.�o}U��C�&D����H�H�_"���¯lΎ��TO��Wy�{��<�1N�4{������DLsέ B��m�L����{�b�dM3����G�fX�+�4>��\5y�|?PM�wa��?Y&f[�r����ݪ/���[G9�ɔK�z3Vr�����9�Xo���A'5X���K�y%L�so�����^uu�Ƨ�k��q�7ΎNaa����m�:��Z�6�,���'� ��c�ϕwyd�	t�&դ�y�o�)m	��M�Kш�E�#
�66�O4�ܫv�-�[���[jvO$Y�:`���/�?2,������7#�7��ä~�Cq��b_U���]�K��,�?n���e"G�F&o����T��f��8���4��v1��:A�Fz�T�<*O��c��?7�`\��t��� ���[�?N��lPb�O�#�z��4P�Jj� fb�쩟C/DD���5~ c�T����/��i>�;��b��I1̈́�F��!oD�{�V|�DU�(��!��,�/%��p�ы=��@�l8.f��h�[?X�fŵ���p���:�[m�k�؟�+��ןU�a^)`%;�`o���A�Pgxz$DW�(����tG"9�BEV`n�b�{��z!cW��i�1�+/5x���A��䗬��H��N�*<�ƐH����"�����3���AT��bxq�\ŗN6�N6�Jx+g{���@Y2D�Ab���+j)H��t�9�)�h���
� Yegڂa��Yh�: �F�_I���W?D�O�R�ml�<z8��֞��jpe��}�� �Q�/�U.�_,�x5E9)r[A��`	`[u��PO�ơ��Qp���1 �?���O�=�yF���Ś�$UO�{/改��rOՊR��(<z�ƞ����B�S��m�LK�a������[�i>A���s��ح�ji��'���\:�3�ℹDh��]Y`C��ith"��̊�f��F�:�;L�g`��,�(Shl4;��gC��.����*�8;hk�k3L��y;a�[�����*t @�L���"^B�o]�dz1ux����@��=��� ���;'@��88.VM����[�e$�T/ZS>�vֿ�cW:A�%��ч <�N�<\A��n:>���zH����v��W��V����������
�95�.0��`������� �x��$>;�Dr�FҪU�m>_&f����_�%ђ*��*���n��b�LA�(�$���}B�����g�o'"]�3�#!m�MES�"��t W��Vz˵���5{�n�g;�� $h�%(�j<B�_�����W2|xHd��)�d����޽ꋷ�Iz��['P�"�_�Kh�w���2./tߑ��u'�O���eq�U���A�E�z������?L/亣��P-@��:��~I�S�?�Đ�_{����j�4��a�����m�������b�?�0$�� �QIw��R����K�I=����&/�еEԮ���P�r���\�݀� ^�����QDm�e�G�
r�'��2���/J��^9�.i��ux��A�
�����F¨E��7U$_�|�6�t/� S U��%;����[��!R�F�"���US�轾@}n��<�ح`hVk�ԕO��6��O���/�qS��L�ý�2��1Z**�������x��Iw9���B_�$K5�FNrh5����mOJ�\ ] F��l7hn/ ��F���w��@H��弯�_��i��^�t&OW�5�p�?��-� �1%�A�_͠(�2Sf�,=��˜�k�m��n���2���W���ܿ7J{ a�I�5�ɏ�{����@>����T�Fe�)�#n�-d��p3ⱟ´0�w���c�����Еw�Ung��?���aq�ݷO1P+O��RM����5�ē&�ы��)Ü�t�.�	�sWP�7zW2	��P�!V ��iR���8�t�y�;������S	����c����^��`�#��ѩ�>^��T04=��������B�Ec������[��9W	�<
����y�j%.ib��عY���0��2 W>�L�Bow�f:�h��o�H�yQ*-�%掛�]b�aL�*�T�ơ[E��GM�Mw�AP�`Q\zѴ{��l͠nQ�`÷~-t�@x���1'�m/z��t��z|Yiiɇ��~������b
�A�H���8?c�^M�P3�z�3�B�7t~!����k�$�rX�ɞǡ��ۊ�O��d5~�u�N��]+�(�Lz׽T��w~W�|Cn�i�l��J=*�bW4x�ڥا���ve.Q�<�`j4�i���|K2H�z�
��qp�%�B)��ٹ��ykv�����P�{2�呼��H�\���8H$ QfÏo��$�I�z��#�E�XV�h\�iw���	Ђ'��8vAw} ��)� 8&�l�3���8"K��4;��F;�դ<�=�X�q��h⮐~��ʹ�(u��!v/�I$DD�����BS�\S�/n�mDa�^��K�9��&���+�����(R���B4�Kc�d�I��f�c���=�7��f �.�]�.X��z�{����4����z��KCV�o���P :�W��]�:����qf+9 G�7�M�؇ھ���6X���OhT{�	�{5������T��D����j�{߫#&��(k<�@��&O`+7΢�� =;|8�WI��ۅ�a�hI�}��G��k�O�*�6�=����O*�
	(���T6�@��T��n�wv����s:��g�=��wQ}�/�]�?a�������^�O-4�K�δ:���귣�M��t��j"ľVEp�2�t,=ީD��孒Ջ��7�v�o�,w�%t2B#���^�l<�:nta�W�T��Fco��gYh¼����V���/OWɵ���GC۸�����oE�f>d//4���OB^�\�q	�{~�zgG��w=�|�2����%��"��˵���0��K'@��3G-`VZ�ʠ�;Ȱz��d
�)=
qے�B����<��XZ��k�'�u�G�u��QO�W�vQ�91�ʪS*)���LG'/t���������`̔�lA���$�Ƣ��a���Ņ���m�
$"\���w�{i>"�7�u>�\Z��ٸk�߈���ǘ��{�d�2F����KڱK��G�ι��D]��:Ț�s@,K��Y�4�}Yo�o��K�ץB��;8�֜EY$l�咈.�KYd,-�,YĢ�3x�ҫ�59}JOD�Q)����>��oڰUH
D@P�T�y�=[h�բU�eo�����޿�T�,�"���{�U@�ݒˌ��[@�M���m{����^��R��9�[W�y���j΅��b����AG�%W/k�����3��ڄM�T�#�Շ�7O8n����;��ꝿ�Rg
3��!�B}x��M �h��7J�dY�qK4�i)7J����ԹO��p�E+�gZQ
`��##�G�xTW��#�YC#Hj�KhYO��~�'�:�ƿu*�HƧѷ����=���Y��B�a��U��,�U�r��̗?���(n_=ýubc\���Xv���=��*�A\ͥ��:2-'Knd��GS�|l����i�L��퓱P͉��r@�OHMO+P��'~v ��)q
d������NK���5����%�%Z�"��%�b�_�ay���:
D��>���t�J�/mTw���������I3iȊ�*ф1и�����w��27j��V|֛��|,���W���e����.�-A�Z	����S��~��$��/�����'e��l��]׸�8�#������:�N������}�>��r�X'�[��a�A�o���^�Tb��l`��^�8�5�c~���3����a�g�f�ɠ��}�D�		�m�|���&8���r��t3�65�j����Fj@Ys����K>4PW�?�Ѳ&ů��|�k	��J�� ʖcK��jQ�jޠ����{���߿d�@4ko�ħb�Z=�ґg=a}w�����+�]�ۉ���i�#�b����l/@4����v�/s�x�nQVV�lC��;.5we�5���
՗�u�@�GD�Xo�QD�@�r��\��(��Ћ���W��@J�=�,�� o�p5�*^k��%�cȠ��r�)�N�O��zy�v�C��"D%Þ�V��|N��.ת�L�<���eu6�l�X��T_E���[H�+�} �/�t�^�zB�{�R��s�C�����ސ���W��L�e3bn�_��V��i�9�V�XM1Q���)�>�Z�e%���|뾒��2��aH`�x��_t1�E}���Kg#���>�O<�D6F��h{Ȍ �!�-i���b�����6b?8�ܹAD�m�[�5�`Bǌ����6 �v���B|oōU�8s�X�U�3��.�UbKon�0��Jk*)ލ�mp��L���%�n&R���d���d��h�]T���m���.��6+��
�z+����$��R�b���Zt�'���)�0���	.���H̷iF;tK1���]ƫ�S+s�� @v�I:�-6�"���(��������� ��E�O���|�>�!Y�R���aAC�m�7����Q^l�r�~�g��
ڽ�.5����TR����y3�K*0���>/X0�rl�:g%FMl���$+*o_tZ��lx�iT��cO�.�

�m{��3烋�in���/{D���yп5� �����j�F�.|�w�o���JhX�� ����� =��Ý8Y��4B�YWH͂��|�H�tFɀQeeO���;HEBB�+Y��L��X;��)�+�^e��v�xN�$�������c��e�ƨ �x����s�