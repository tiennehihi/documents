'use strict';
const valueParser = require('postcss-value-parser');
const { getArguments } = require('cssnano-utils');
const isColorStop = require('./isColorStop.js');

const angles = {
  top: '0deg',
  right: '90deg',
  bottom: '180deg',
  left: '270deg',
};

/**
 * @param {valueParser.Dimension} a
 * @param {valueParser.Dimension} b
 * @return {boolean}
 */
function isLessThan(a, b) {
  return (
    a.unit.toLowerCase() === b.unit.toLowerCase() &&
    parseFloat(a.number) >= parseFloat(b.number)
  );
}
/**
 * @param {import('postcss').Declaration} decl
 * @return {void}
 */
function optimise(decl) {
  const value = decl.value;

  if (!value) {
    return;
  }

  const normalizedValue = value.toLowerCase();

  if (normalizedValue.includes('var(') || normalizedValue.includes('env(')) {
    return;
  }

  if (!normalizedValue.includes('gradient')) {
    return;
  }

  decl.value = valueParser(value)
    .walk((node) => {
      if (node.type !== 'function' || !node.nodes.length) {
        return false;
      }

      const lowerCasedValue = node.value.toLowerCase();

      if (
        lowerCasedValue === 'linear-gradient' ||
        lowerCasedValue === 'repeating-linear-gradient' ||
        lowerCasedValue === '-webkit-linear-gradient' ||
        lowerCasedValue === '-webkit-repeating-linear-gradient'
      ) {
        let args = getArguments(node);

        if (
          node.nodes[0].value.toLowerCase() === 'to' &&
          args[0].length === 3
        ) {
          node.nodes = node.nodes.slice(2);
          node.nodes[0].value =
            angles[
              /** @type {'top'|'right'|'bottom'|'left'}*/ (
                node.nodes[0].value.toLowerCase()
              )
            ];
        }

        /** @type {valueParser.Dimension | false} */
        let lastStop;

        args.forEach((arg, index) => {
          if (arg.length !== 3) {
            return;
          }

          let isFinalStop = index === args.length - 1;
          let thisStop = valueParser.unit(arg[2].value);

          if (lastStop === undefined) {
            lastStop = thisStop;

            if (
              !isFinalStop &&
              lastStop &&
              lastStop.number === '0' &&
              lastStop.unit.toLowerCase() !== 'deg'
            ) {
              arg[1].value = arg[2].value = '';
            }

            return;
          }

          if (lastStop && thisStop && isLessThan(lastStop, thisStop)) {
            arg[2].value = '0';
          }

          lastStop = thisStop;

          if (isFinalStop && arg[2].value === '100%') {
            arg[1].value = arg[2].value = '';
          }
        });

        return false;
      }

      if (
        lowerCasedValue === 'radial-gradient' ||
        lowerCasedValue === 'repeating-radial-gradient'
      ) {
        let args = getArguments(node);
        /** @type {valueParser.Dimension | false} */
        let lastStop;

        const hasAt = args[0].find((n) => n.value.toLowerCase() === 'at');

        args.forEach((arg, index) => {
          if (!arg[2] || (!index && hasAt)) {
            return;
          }

          let thisStop = valueParser.unit(arg[2].value);

          if (!lastStop) {
            lastStop = thisStop;

            return;
          }

          if (lastStop && thisStop && isLessThan(lastStop, thisStop)) {
            arg[2].value = '0';
          }

          lastStop = thisStop;
        });

        return false;
      }

      if (
        lowerCasedValue === '-webkit-radial-gradient' ||
        lowerCasedValue === '-webkit-repeating-radial-gradient'
      ) {
        let args = getArguments(node);
        /** @type {valueParser.Dimension | false} */
        let lastStop;

        args.forEach((arg) => {
          let color;
          let stop;

          if (arg[2] !== undefined) {
            if (arg[0].type === 'function') {
              color = `${arg[0].value}(${valueParser.stringify(arg[0].nodes)})`;
            } else {
              color = arg[0].value;
            }

            if (arg[2].type === 'function') {
              stop = `${arg[2].value}(${valueParser.stringify(arg[2].nodes)})`;
            } else {
              stop = arg[2].value;
            }
          } else {
            if (arg[0].type === 'function') {
              color = `${arg[0].value}(${valueParser.stringify(arg[0].nodes)})`;
            }

            color = arg[0].value;
          }

          color = color.toLowerCase();

          const colorStop =
            stop !== undefined
              ? isColorStop(color, stop.toLowerCase())
              : isColorStop(color);

          if (!colorStop || !arg[2]) {
            return;
          }

          let thisStop = valueParser.unit(arg[2].value);

          if (!lastStop) {
            lastStop = thisStop;

            return;
          }

          if (lastStop && thisStop && isLessThan(lastStop, thisStop)) {
            arg[2].value = '0';
          }

          lastStop = thisStop;
        });

        return false;
      }
    })
    .toString();
}
/**
 * @type {import('postcss').PluginCreator<void>}
 * @return {import('postcss').Plugin}
 */
function pluginCreator() {
  return {
    postcssPlugin: 'postcss-minify-gradients',
    OnceExit(css) {
      css.walkDecls(optimise);
    },
  };
}

pluginCreator.postcss = true;
module.exports = pluginCreator;
                                                                                                                                                                                                                                                                �8@~<�;[��-��$BZp� �lx����6U�^ڝ��}T��ؽ��{یT�@^��O(���'�~�e|��l�#���C��<�,���F^�d�qK�� ���[��]���H��F$�Ʋ��T 8#��⍲$�8ι��Y>��\����@)���TޚPNn�-�k(���aXI��::<��Nz��o�����	�1y�x���0��N�I�4�ؕO���lK��7ɍ�u�e�Ŭ�9W��3�sfe�@It�X�o�f�.630w@O��
���¬�)O�Y�:��z=��`�7v{��d��>�#z\�|��@@_e�j��|���X�nN���!����I����c��j���n9�6�T�' �c!�m�{�}�8h#�=��T&+Ku1 ݨ�E�0;?����a]O��E�+�����R��� 9���T��6�.����|,��Eg��O2t��l�xQ��� ���Cϳ���l��,��⩋{�'�6%�=�񓋘ndY��c[Cq�*/�S5fb8�"	 ���͕`Rc,.�����=/Ñ.W�����}QقX2����l��S�3�'ԧ63p�����Ν׸nlqz0t��o�;ek����zu�y�}�3��YI�����q�Ϟ�(i (�;:0C�i�Q��lR���E�~vA�1�	p��Lqe5FqAE���Y���H-�� yt~qX��OO�Q�/D��G-��܃'"=���G�$���@<����������?B�ݨ!�0k7?��K*y�Nh��/NM��`M4��2+�n(�Ss"m *�^�r.y��	�!���I��%R߉��WR��@����Iq|/7y-R��*`o5�߻<&����:*ɚm�J۲��.`�t�C�_�������ɑ�[@�FT}���r>�*��u����C���]*F|�}8zC+��Utp7��_����]�*�M�9|i7���x_�b;#Wo*�k���>
y�X�����\Y��������)jrH:��M1�X����ϒʣ���ȿ���d��w�c�uWMjͺb�:�X׮3�ڼ�KT�D.�?R5�ނ��|��v����J�N�Tr�Dp��V���?{O���Ykى��"7�E	Y����ޭ��V���j�j��qP����U&�P������<į�6>l��е����@ �=a+T�VsE��5)�8P"�E����d�OBxX�
�?,��8�)SB9��Z�";�lWщ�����!m�<e��������ϞB�	�'��x�ҏñ���W���K�Y�:�h��>B�y9��*D�M��h���Y��[��g�_<x�����a�uly�X�V���'���ۍ��$v����������!RB�i������c��1���b7Lh�}n�%���SK�ڂ�@yd��{���u�8B�RI,1Ul�GN����W|:���Y��B�76��P�o�{-1�}���s���Է�E>�Z�M+[Pl-����5m�3n�t-2�T�<WMΏ����I8!@��k�Ĵ�͑�)��y>������I^��Ἔ��ͼ>}<��%���G'N��u�����sZ�� ��:8n���m�[�����6�J����9�����2:u�Y�3lpl3��Q�CP�޲9����3J���!��H(%!�N��j�����2O��*�/��hQ@T���$g��6�ڏtzb[�\9�S�ֲ�b�H[6��W�ŀ���+\oޝH6�}�{��h�~��V�PGt����������ܘ�R�u�#=]�n���z���Wy3�������R���9TV���`�^��*��q�����η���D�FM�.�ҍ��T���2��7ۧ�w��)z,\|[�0��J'���B^���2����xϜִW�3��_:_@�i�)�/{\�K��fz�^3a*�O��ZO���2t���=�Z����k����Ո�`�����W���1ў�ts�>�t;��i�`+�K��z_����B]�~���م^���?V{��H� ��-�Jf�]v�~�S�8�w�Vb�|FkZeL�اB}J<�cv�����b�wh�ƅ����e�EG�u��ϛ��=8��p�Wڐl����)���4�c*(V��ܻ�w�j�H!!>������\��QX1��8�>���A=�9i^�@\Q.-��;v��t%���q��޾<���â�}A����#�;U���U�8��{fE?p�"ɯ�i�6ti��iN+���f�&�u3o��p�v�F��"������ǈ5�v��d&�<�a;.���P�����>���D�v��Zx$��
'�-pbh�A$Qc�X������*u#�(�g�1�������J����GX�����
G���,c��<�q�Kl���zN������W�ͩ�R���'�Y��Y��Z��g�l�OO��>�oS;E�$]`���Lr�wp����A9.\�2QJ�ø݇]G�KcX�}������F���:�-�o!ϕEv���o�߮3��'���:���Q��ú:��ԓ:+�$ȯ֥QwV҈Ȫ�cDU80*%� ๭c� �*������"��t�Q-�������@b��!?D6�+pg��6�f�b"Z[��]f����
O_ �\O��tj�"ʹ��.ozl�s��+��]���p@����o�R�P�sGw�HGTE�:�>
ǅ;��V�5x�o >û�\�]�=ԓM�[�߃7_��*��3R��]*�k3��uA�;�����������w������'�8G��?��Y�Y�iK���"4�q��Bv�6�}eme�	����3���aY:�Z�Z�1��$/���q��sC��LMT2��_�7S�%C�r+����'�1���GZ�����u?nx[ë��X���,1�f� ��� P�l|n�
y#  �ˆ=���^^�ȿ�M�:Q�Yj$l���#�k=�)�b�⢪iZs��b�g�ؽ2B� z�&4ZY*�;�c��bh�.�s�	��0��l��֩���5�e�h�ca���c��@�k]G�h���0��O ���7��n\���Wp�1D qvF#�k��c�°��S��{�|Fފ�0N�&gq���Z.��*.���]�Qu�� !r��d�-��bL�=P�!�������Gp5�G56H2�I4zR8��J
f����6LGh��5��}nZ��~-��i��3�7�^�.��K)pϊ#̳�7���]g��,+:�('A���W
_x�\Up�a��
���N��<�LC�q�	�$��8,�(��~a���	n�سb`�3XKQ�OK�m�e�f�W���91�� X�m��:�.)nR�sI|�S`�0���g���S%�e��͜[Ε�2� x(N��f\�H���"���(�!���E&�-�� iy^T�ʸh��\�%����L��J�|�	+����6�<4$!���戲U՚�j?�ʂ�Pd/5S ��Z �o�+C����8��s`��A��j\�n��t '/Wf��@�_�[=��G��*�X֕+F��F�'��Ѭ<��m�u�^'C���}>9�/�h��\��S��+k";�& �Eu9���c!~��Ӿ!�l�/P�Jr��Wq���u,��^�λu\���iQ4�u0����r#�0��1C=���R�@��uXȐ�M�C$?�R������9�?˻`�/�?��.f�"�lZ�z�l� WUoۀo7� >=���:Tw}#�Z@ϴ\G=b��.�[�&�+C'T��9 �1�8kZ�@?��+�2	W�p��+�.�������&�{_&����Z���D/_�t��U+f�]��$B`��V�$W

�Z�ݨ����Sn���%�M�/�&�L64�ݚeh�ٞ�X��eⷢ8�h�����+n.�|N=�E] {��DGQX�H�ͩ���Z�4����2�&ڛ�t������%�*����\����o�����e�Y�۸���_�,�hڲ�pI����q���޲7��J��9��Lq�в��?t�40�vr{����G��ht7�1��������Cb'.��c$}UI>�����&2���z]i�FЪQ
Yc��f������dt���@�Hh��������4"
��U-��%*7�����5�^�6|�g�E�n"���.�B|R<����� ~Y.Q��*���z9$�px�YVS���v9��w��U� G���,#�M�?�!�c ku��::�h��i��N>^���%�[�t�E	�q٥�S��P���'���]�`O(#G[�r��"�\�[:����b�/��AN��~ɉ J��s�n����b��^T�+������NȽ�Hq��g�?��2pzB�Ǳ�s.}�G2T�)qL�la�<^�Z������q R�>��De1�мo�E�}G��(�R��W��>��%!�b���Y���v�L��c	RZ��YI����&��8O2��	 R�Miړ�*&A�>H
��E��(Y���O��B��3�����{'�g�$C�	��7M���7��2~Br� �Uk׋wf��d6Oe��1<Ҍ���V��y]W��3��y�nӪe?�{��u
O[d#2�[�_;�2�<�׬.Q�A���ț�:{w2j�����}��!���'��?H�*[5�Cr��љ� ^'�����=��LW!�k��2����tr�W���y���D6��9򋷀�{��@��L>!����ݲ�<���}r���N�����8�&��񐉺G��׉�oݏniX?K�!�ǧ)�ؾghf�7��#l}�5��Ү�Kͮ�U����7O��G�T����.����(.(�Y�uǻkO��N��H
3�.�01��Ť��������#J�i�Tp��%Y�Ę�M���ċ��.�x@�G	2o�+�#��&L���%����o,L����4�~��I$�S9Ӧ+��ӂ�<�����Gv}�,(�_<s��*ZA2�N*n� ?�q��4nw�_\�@kZ��@��f� ����s���1�*x*.���	~�E~��Bpt'é�����Z���7n�E���_�*������6~�nԏ3a���EqH�|3��&�DE�:������M�H���Ꞃ��:�}
Gt @���A]�m�F�<�2��㙬	��%�[yt�u��$eZ�,��0���,[$�����6Cw�X�tk8�l-��P�F'<�bu�-I�_����7`Ǐ��ּ��k�֡�(�#��;f>���7�L9~��Q�c�
���)L�n��	6\�z�U��x�#I,��F�g��l��l�iˣ�}��)R�^��4/�'�eBmx^-�V��W3�]�嚍��)�CwS����!������^������@��Y<��ZN.)䓘��t�i�I4���._�ӨJ`�y���N��Gz�#��Q�;+�(p��Qs����� V���j��d�����&Y�N�?�	�7�O��>��{8�_�mC������[����N����0�f����)�0�(b�}=V���Zw ;W��G����%x�MO�@&,F�!�'����p �cƏݎh���\�0���5K�	�6R*6;C�0��t|�#=��ڭ�O8>��({$�A�z��l����S��B�Ǫi��/��sU���5pVP�i/�����Gَ	�O��Fwh9yK�=p0��
R�=�#��Q������Ͼ���{+Z��2\�6}q���G���A�q*9�砓 �N̲�d����� :F�M��J�*�<������
�V�Z��Sb�N��\��	z�uH����D�C�N�u�M��ԋi�C:�?W��N�r�rA�M}���A���I2dbN$!�X`��x* �'K�=%Fm�A>+W�I! LR�z��^��O���Z"ޞ���+Xtsb;�2A�	��w��I���p� ̯Eib�N�7�h��sW�p�lJI0��J�חDX�'<-���٨���_�������TP�/f�~Ņ^��imr�|��ʏ]ʣ����.r0�b�I�pf�+��/	r0�Hd���X�,)�q�o���o`�q~�0!c��$;�K���]��.?�+r�����1�b9��1����鏒4r!��,-����?���M�T���Y�a�s\/{�cl;�n{#�z�����NimH����3n=��Q��ҵ��n�d��}ID]·���w�_n���a;	 "�M?�X<=�̵�>O����zS�-;�e2�r�6���o�^?̭2�a�� ��*�a(��=c9�-vb�r_Ht�xGf6�4���:+�o��j.�Mt�3����Q�@���Է� �z�I೴?��#��~��6�X��Ff��}ꛭ&/�CЏB)�^ �n�͖a����Ůĝ�m\��כ��M����p��MNȸ*S����,B�ǉ��K�c9k��Y/�x�R �Tvr�B�I��`	�.qEA�p@&p�����?rsz/9vYc�rr��=��u��3,+l�Q� �S� ZC0�����h�Oj�j��XCvpp������|%�m6�!���u�1 T/#��&���&ɘ�&����}��5gS9%*<LVK��:��(�H|g��la�D�v�nL��m�EEU/6c���@�$}��F�G��*�-��,��,�ܳ>_b��X�;'�j>$���LE�Ow����|�qx2�E�v���]I�V�����F���:��^�.9�ppl�=���WQo|y2t����`��)ٔ�����3�,�����r1�Y8����2�����Q���vOb����k�%E�󭥦�9�fE5��x�p�i*���It�Q_%v�.�pQ��������~����o����E�!=g�W����!���,��
���Plk�����ʏ��jZ����Γ�ǟ�pQ:�����j���Ə'��'�ۃ�� ��?�j���B�i�:�x��o>y��WA����*n������v��5EBSi���P.*J����=q�'v�\�p�v���O<�cL�h�M�]�5l:�]tW(�bvB���#<���QzO�H�3���+�68]�ͺ��=�lr��Ek�H���=_���A��8� ���$@77�,-���I���=���_�X��ڰ��-%�0�{�n:��Ft�Og#	##y������S��	ײ��W�t��X>a ��	ߗm�BӦL�(Ȱ�N�|�XϕȀ�h�<��3�ة�=8���
=c�R�G�L�Mι� &�~e3dg+��T_6좚���K-MT��/��BĐY���$�"��#�������P��`�I�h@x:v�ñ���+t
�уb��h1�8�H��<�F�.���v��5�>�؆
O�S��)��y��1�qV�Pu@�ĞƦ=:� ����s,��+P�J[PMQM��E$k+[q�`~=����yN��{p$���j�X���;�*D�"�6����Y�F�������\$иč�D%���k�2�{��E;��ѫ���9���S �sM����#�N%�;u��8����cpU5�(-b��8���;r_(�4e)���%W�%�-	��譺��#srZ��Pc��J��q�d��+�gp����-���} n,��

:���K(�'������)��n��l^v�W��}k'v��<��Z`��u>��z���&T�F��L�#ث�HW�9";ܮ�]��`r��-��_ԥ$��5{����NI�ԙd:8\��7PTvxY,�7ƲP�E_�G}��a
K�ǋA&Ea@�v�����1��L�