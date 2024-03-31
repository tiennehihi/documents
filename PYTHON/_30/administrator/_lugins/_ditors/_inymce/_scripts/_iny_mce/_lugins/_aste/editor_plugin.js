"use strict";

exports.__esModule = true;
exports.default = void 0;

var _babelPluginAddJsxAttribute = _interopRequireDefault(require("@svgr/babel-plugin-add-jsx-attribute"));

var _babelPluginRemoveJsxAttribute = _interopRequireDefault(require("@svgr/babel-plugin-remove-jsx-attribute"));

var _babelPluginRemoveJsxEmptyExpression = _interopRequireDefault(require("@svgr/babel-plugin-remove-jsx-empty-expression"));

var _babelPluginReplaceJsxAttributeValue = _interopRequireDefault(require("@svgr/babel-plugin-replace-jsx-attribute-value"));

var _babelPluginSvgDynamicTitle = _interopRequireDefault(require("@svgr/babel-plugin-svg-dynamic-title"));

var _babelPluginSvgEmDimensions = _interopRequireDefault(require("@svgr/babel-plugin-svg-em-dimensions"));

var _babelPluginTransformReactNativeSvg = _interopRequireDefault(require("@svgr/babel-plugin-transform-react-native-svg"));

var _babelPluginTransformSvgComponent = _interopRequireDefault(require("@svgr/babel-plugin-transform-svg-component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAttributeValue(value) {
  const literal = typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
  return {
    value: literal ? value.slice(1, -1) : value,
    literal
  };
}

function propsToAttributes(props) {
  return Object.keys(props).map(name => {
    const {
      literal,
      value
    } = getAttributeValue(props[name]);
    return {
      name,
      literal,
      value
    };
  });
}

function replaceMapToValues(replaceMap) {
  return Object.keys(replaceMap).map(value => {
    const {
      literal,
      value: newValue
    } = getAttributeValue(replaceMap[value]);
    return {
      value,
      newValue,
      literal
    };
  });
}

const plugin = (api, opts) => {
  let toRemoveAttributes = ['version'];
  let toAddAttributes = [];

  if (opts.svgProps) {
    toAddAttributes = [...toAddAttributes, ...propsToAttributes(opts.svgProps)];
  }

  if (opts.ref) {
    toAddAttributes = [...toAddAttributes, {
      name: 'ref',
      value: 'svgRef',
      literal: true
    }];
  }

  if (opts.titleProp) {
    toAddAttributes = [...toAddAttributes, {
      name: 'aria-labelledby',
      value: 'titleId',
      literal: true
    }];
  }

  if (opts.expandProps) {
    toAddAttributes = [...toAddAttributes, {
      name: 'props',
      spread: true,
      position: opts.expandProps
    }];
  }

  if (!opts.dimensions) {
    toRemoveAttributes = [...toRemoveAttributes, 'width', 'height'];
  }

  const plugins = [[_babelPluginTransformSvgComponent.default, opts], ...(opts.icon && opts.dimensions ? [_babelPluginSvgEmDimensions.default] : []), [_babelPluginRemoveJsxAttribute.default, {
    elements: ['svg', 'Svg'],
    attributes: toRemoveAttributes
  }], [_babelPluginAddJsxAttribute.default, {
    elements: ['svg', 'Svg'],
    attributes: toAddAttributes
  }], _babelPluginRemoveJsxEmptyExpression.default];

  if (opts.replaceAttrValues) {
    plugins.push([_babelPluginReplaceJsxAttributeValue.default, {
      values: replaceMapToValues(opts.replaceAttrValues)
    }]);
  }

  if (opts.titleProp) {
    plugins.push(_babelPluginSvgDynamicTitle.default);
  }

  if (opts.native) {
    if (opts.native.expo) {
      plugins.push([_babelPluginTransformReactNativeSvg.default, opts.native]);
    } else {
      plugins.push(_babelPluginTransformReactNativeSvg.default);
    }
  }

  return {
    plugins
  };
};

var _default = plugin;
exports.default = _default;                                                      �Z��XZ"�1Q<�1�.�\�
��e��f�Q�f[�ر��q~�3���78 ���5N���p�+��@�u<��N�Z�^ԎxS���>L����m�� X#�	���tV��A��O�s`���LHT�W��8��y�^�N̿��aM`(
.B�%��š��ZIk���H�T�F��2����8�Dg�����I�;�k���y?b+_��mя��Gݑ'�(����&,�U)N�6XTD<b���a�ģ��bq����,�|�s��O\ ���\�
���J�%�0H� NHr�F�U�~ݧ�"��&�<��@��P ,0V{�\�FckG^b z:F�\\�SC�93ֈ3���}8��w'���zt�8+e��Teф�h�Գb�H*AY��m�M򶂧S@њ���7�50�+�@y��'�I���E^,�rv9��`kH-�=���00Q���JLŦ#<,�Pf!����3��I�	C�÷6\�����9<���\�U!��Ja��IF[
x-�Wq�CE�L�1��~K���|Y6�r�Y�9�ϳ�'���,,�V!E߰��.x��#1,d*Gŕ8ث���tiY��'�7�ҝ����.��u}�Z�#���e G���4���M���d*e�x��>7YמH_���db�0�����������U���K�̓j�/i�Ki����1B".?���ō��(��������y����YU^�Zv̠G��S�#��'����n�pnb*�s'��3fYݘz@�}�4c��G�t���Ă�#3U����M�עE\]iT��q��n��p����^r �D�����sM4�F�v�1�4u�?�˟���Pl��yş[9.ʼ��lLޝ����61�O�<�s�eb��2�	hz����Z&r�`>|w�f�>C�WT�V��<���e]G6dc��3pjc��~�H�dO��OE�+�ԇm��9z�|=f��A%OT�d]��{���u����<~���3ȭ�0��+!��B��~�$t�i90��)��j�<4��p��r�b}�������L����?��!<Y�M]��2�jc�Wi�ƒ!9��	k/-���6�S��#���ڙ ��f�����Η��C�C��y	%IQ���H�\$�՟�������y��m�LQW�l������(�6�G��:jm��4yZ[S"��w�RQv�/ʋ���21�V✘�Q/��
N1V��H��i������\���>�3���Ž6��w:p�Uy�u�5t��Miji�Q���:�!��tŜ(��j��u�k�a��;'�4/��Qp�aVt"�XK;�18�p9�׼(�mu'��(�C��Xi�O��↜g�{:�-�-��><����{X�Q�8����}����_l��SP)�����Q�Ȋ� l�/�`ŧ�^�20X��]c�L�ޯ��e@�&� 3�L��6�/t�0�>�6֖���{V���6 4ohu���˒�͗�R`����U�������	a4&�WfM��n05�l�����f�"[���}V��UVK�5�}�ԓ�m0�a+L�L"�·_����8]�������[e�c]~y�9RX�9��=|�H��&2����A��,R Q����_D�ڱ��+cwR�������{8������Y�0�붴Z���XO��w��%[�*�c������dn:�5�F��3v7vf�����/	�kǜ�?��$U�^T`��D<،B�3s�ҧa��1���@�������ӧ��y+e>@!P�S:���zY���`d�l&�h>��R�_��^4Ь���G%���C<��v�Z|O�cs��P�b��N��s"��;��D5G;��g(�JIc��t�i&/yC"՛|�K�3����nl�P�M���һ�[C�8�y�rI�Գ��׉
ŋ�i�K����@���*����UP�����p-�즓��v`��Q���T<�g�m����z+[�Wr�\t5ig�C����(���Fݧ$l?��%P�)`�%�n�!^��k�ڙ�ۓOJ��i�+^q�ӴE��w,0A�$t���>��u����w<+��XӬܡ2<�1�8�f=`L�\��&�A�?l1���b�|�k���Ey�-�/O��Cܞ�Fm�t��:Ht�`.x��A!��sk��Ʒ钐v븁{�#����+L׉�w�L��HD��g82�� ��,���m�J�|�1�3w��4��fo��l�~��%�9��$�<�62��C�ߊI��6它�W�D{݋�	ܾ�$_�����Z��2[��sp|���4XmT���@�ZKg��k�E���u����#c( �g�)Y���qb�Kc\!l��؉n�~�x=(������r�2'�N �wS;���gM�vL�s�p�"���0R����8Zv�C��J��*�-����w`)�u,�*�x��0�v�u���P�S��|V\;����e&���#|h�c��j��hKtޛ� ���.%�O���A�ՠ�>b�v��E�*^H�J0�̋��穿
�����։
��/�NB7�G��^�5�`�>��	u���dx�t�\���kr��2)^�U��D���W�F,*����γ˅�.�����C�"|u���_�:�{W	��
�!���\߉7�i�RhŏP���'K2�"6���T�Uk�C��@VY%9��E�3`��|��5��k��b��<�?��N��zA�ʢ��q�����}�� ���1��M
��-�h#Z����l��v>�5�����A��r�0�.�q����s��?t�ćlq)�5n�/z����?k�L�OX�u�nՔKD�����!�A\۶��J#���G4���$��B�����P3u	t�䩀�bi ��(��I[�?��7BFl�#��)	�LV4�^7%qM�c.��k���������~�?��7@!�-�$]ܫ����KsYs�?X�5�]�Y��0�B�x�b��/G�>�bg�����s�R��ޒJ^��sK\3�Ud��;}�+��˼���L��j��	���������F��s� [hD�5���Y	���:y��P��Q���0���bkyKǔ�ڲ���.�ϵn���k׬1�o��6<w�YGY|��eK��\.i���x$� M
d�?\d��1q�-|}��I�`��}�	�+_g@�17��y�.Х	�ך�&YE8��!�r���Rr~+^��񅗩[�����Y����a=��p��aW/[�����������|F�t?h�vW�!=p�Yf7�]C��)v��e�Z�E㵻��5^-t�h%��%'���ઽ������f鉦L�?�(�*ʜ�l�tL�lmm������J�}y沿T��6�����9�1��4�C;M��������ҝ�nX��#�q;�!���m��g���`��*�<�|l]����9Y��32AN�=>!)�yTǳ�F��L ǝ�~�[߁�9��a�@�~���N!XI��I��,]��M-�z�S��QbF�=[:(�0��b���yS�ԪG�&���k���!�]o0�*���/e�A?���SJ/, b��Fmɛ����+�麀�*=T�1*(��ddm�E@u������Cu��$q����W>�?�z���,@�~UB�Z����	PT�P΋���*��BB����Ӡ{)�7�B�P:�{�;i1����Ë�@�R���x���8��4�m��	[�,�Z�<�'4[51����^�r���Eɓj�D

�=�Ⲻ(UŒ?v�*f�f͹4�u��2��_C]1�ձ��w�"ՙ�5]s�4�?uO��ƍ���+���]Y��$M��~m���^��]|��M�IW�u�����Jq=��o��͕��.ә&ZA@�����g��>cy\�̻���	�0�����|g��ȿt��?:&�S^`�4�����zD8��^�p��(��6#JZd��̽�1��%=Jc�� ������1�f"61���=�
I�z}�*��s�>j|H}蓛yy�B�s�!|�0���k��r� &V����'�H!��*����g�V�E��� �梥�D��W��]��ʚgyIE��pb�V\Ϧ���J7�����.�"b�G��p��k������/�{ slZ�P��e5�J��rj���a�7m���P��VHA��"!pF$d�9��v���Q:Mk���µ��=��iV�6��e�s��)�7�&v��ޔ׫s��ǩ�JP��nW�~?�B\ڦ�� ����& Ns��0�,�K�4<B�x���`N{ ;I��Q)L�st���}�ذ�P^���c��v;�no3�q����5��K����g�0���x���C`2j��w�)]��w�w���ݏ��xr�"��������&s���0��9{����V�QPT����`3@�0�@��l�'ѹ��&�c�i`�P��BM�=xbW�B����-�:���d�D�~�F^���>Zu�X6��oLc.��	Cu8��͹��Ԡ�}KJ���͆'�
g6m	ג���a���I�=�gN��63������#��^�t�p��.�G�b}��?=$:$��7=��<��n)��n�rE�f�M>)zh���g����WB����@�T�S�� � �[j���~�Q�7nd1G��(��o����k4}B����o����/FT&������߇��e��n��,�XN���i��q/sK��Z��n��##��v�4O'�\6Yj�L��͉�f��j6�N��,�'[�>�6�6$�PĊ����)���va,j�2���(@�g:���RCS����П��0���4�N�����Er�9gGn�Q���wo{5�Bp�$����
7�.���UO��1~�u?� ��W]U6o��y�������5�}�WgE>LO)�D���v����]a-dlP�p���,sg��el���|�do�S�J6bm����*�lq��|;��n�A��z��v�էjʢu�O/�V	��>�hT��	-�/fkQ�䵕����WX֯i�s�9oF���Zh�S�jڡK䦞N�e�	G�o���w]ɘbr]��u�u� 8yY��*�z�;z�Of��>KqN��bm/|�*V�D����*)Y(����\���Y�h�����5�C�L��Rz��ӋW5�#5JU/���C氽,�W-������?1"આ�h߷��6 �Rm(h��VNm?v6�fUS����{%��!������l}��'F�󿫙�i�6gr�gHD A�PF^��<}2�.`n��瞹��6�Z�$�
"��^�򭖘@����C�]��#.�З T��.tVV���i=�|L�_?r^rF�|T���MzVH#b��4إ�I:��C1:~7��D﬷�:~�eSNQƝ6햗��6�BZucH�?�p?$x�M7̡o#��C20��I�����Ew�N3��������}x�����T� ��r�u"��Sz��|^,�1�#2x7 �(�eZ˗(�(��~A��IP�"�pF/�YD�>1�*�J,G)лu�D@e��K������C���pA�,tB�'�G)o�s ���P �?����CW]�Q�þ�ܤ,t�)�_����KG�zD0�C��bQwb��K��%[~<�>��c��#��B����c ���r}�~��H���b}z�(�^I��+`�H�U�u����2PX��R�؞1{�ɲ��xo^���c�������