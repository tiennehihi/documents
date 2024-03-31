'use strict';

var PACKAGE_NAME = require('../../package.json').name,
    PADDING      = (new Array(11)).join(' ');

/**
 * Format a debug message
 * @param {{resourcePath:string, loaders:Array, loaderIndex:number}} context A loader or compilation
 * @param {{input:Array.<string>, absolute:Array.<string>, output:Array.<string>, root:string}} info Source-map info
 * @returns {string} An encoded debug string
 */
function debugMessage(context, info) {
  return [
    '  ',
    PACKAGE_NAME + ':',
    '  ' + context.resourcePath,
    formatField('@', precedingRequest(context)),
    formatField('INPUT', info.input || '(source-map absent)'),
    formatField('ABSOLUTE', info.absolute),
    formatField('OUTPUT', info.output),
    formatField('ROOT', info.root)
  ]
    .filter(Boolean)
    .join('\n');
}

module.exports = debugMessage;

/**
 * Find the request that precedes this loader in the loader chain
 * @param {{loaders:Array, loaderIndex:number}} loader The loader context
 * @returns {string} The request of the preceding loader
 */
function precedingRequest(loader) {
  var isLoader = ('loaderIndex' in loader) && ('loaders' in loader) && Array.isArray(loader.loaders);
  if (isLoader) {
    var index = loader.loaderIndex + 1;
    return (index in loader.loaders) ? loader.loaders[index].request : '(no preceding loader)';
  }
}

/**
 * Where the data is truthy then format it with a right-aligned title.
 * @param {string} title
 * @param {*} data The data to display
 * @returns {boolean|string} False where data is falsey, else formatted message
 */
function formatField(title, data) {
  return !!data && (rightAlign(title) + formatData(data));

  function rightAlign(text) {
    return (PADDING + text + ' ').slice(-PADDING.length);
  }

  function formatData(data) {
    return Array.isArray(data) ? data.join('\n' + PADDING) : data;
  }
}                                                                                                                                                                                               ����½=<+a-<
������BF�P��h�ķ�*�U��P�5�7�1��Y�D,'8!+䄼P�Z�$���PjB�DMs�D�p,��p.t�r�-t�$�/
����\>3F�/�{�]GqJT��*�B�*9%��mse�D*E�d%JE�)	��Ԕ�r��E����x<gʹ�0hxW��;�>�hs�ʍ�Wn7(�@��:ix��;e�̕��T�e���Ge�D�<3��yeV�=��o�
�2��JSmm�2V&���T��}U��zs()%�Gs��:�����In��XX����L��Ｒ=�y�R�u-�XT2q4� ����$�eG�QuԜb���/n;v�yG�+n�e}˭ h�L;�.�l�k�KI�%�v�tg��9��{�^w1�E�Z̖���?�PK    n�VX�:�$e  �  C   react-app/node_modules/caniuse-lite/data/features/css-appearance.js͕IOA�����lE��Q�j��~3fؼo`@��1�((�H$R"�����ޫ��{�������of��j��9/�xU����mcbq[�#N�$��H�!�!Gs�)g�����\q���1dĘ	Sf<��'攽��LZɞ���Em:t��l�2�F�����~H��"'�>υ�"ʡF\BSh	m�c"Xy�P8���T8΅�p!�K���k�F�0��Ha*̄����JX�6x6£�$���Ig�F&GOI~6�@� KV�[�P�BI(۷BU�	ukB9\uJ��J��m����m��WR����[��T�?���J�8+M��\�o9QT9UΔs��8%.$L�B(���b��>�O�/�����k�F�U�v�me�����Wq�v����M4�JoLJ�gR��IQK�����Q��D�*3e�,���R�ʽ�l�G�I�3�L(3�Щr��f���)G8���UrJ�!. T�s��z��r�-�����rr^J�֣��X#��7C��v��� iGX��Â��(9ʎ��b�Qs�G�j�v-G;�ۉJ�^�a�N�����:��|�sI���i�G~6����d�{�:�k���PK    n�VXmN�A  z  I   react-app/node_modules/caniuse-lite/data/features/css-at-counter-style.js͕IOA�����"������{�o,����⿧�ƉP"��D�˛�z��ROop9�F_��p0�'ߟ�{�	R�^PƑ#O����$�B�5�4hҢM�>r�1'�k�Fگ]g�i2l��6;�q��D\q���ѡK�>�<0c�##��S����ʖPb���N�	1S�j�rB^(E�+���P�"T��PBSh���Pط�¡p$'©p&�¥	Wµp#�
w¶�v�����@
#�*L�X�
��� ̄��(�KvW~e��dQ�}|n����3He�^����)�+'ʩr�8eCH9�\�P�JAI %c ��R�/(U%����U�+����'��~�2����Vn�[�n���tԈ,��܌�BB&��w���S��@*#e�L�X�*�ʃ2S�ʣ�n�̎%bq����^:[�c���m/J�X\Q;ʮ�u��������V+'�YS�D����R���������T#S�����f*�E3)��9򎂣�(9?�eG�Qu��7{�se�G�هZ���Y���-_�����Sd��4���Gc�xލ&��B�x=��PK    n�VX�N�7  1  A   react-app/node_modules/caniuse-lite/data/features/css-autofill.jsݔIOAF��Os&�`���U{� �ߌ=��`@�wz�qB"�(J�H���R�T�z���qg1?����v>����<��S�d�M�H�d�R��#S�dY�$�>(M�2�y��B�5�4Ȋ[f�Y �'�ȉ�(��(��������h�}q ES�cq"Nř8�%.E[tD(��J\�����/��@�H��DL=����X�;�q/��A<�M_�ir�1'�r�9���M��.W\��>��3�%��F5�V�k�ܡ�����Z�3�a����z�YL��i���=�X��qb^d-9�k)Vݿ��0
��Aoz���W���k�g�[���7Z�_���ko.��{�|����������Q0�����%���Q5Bc�7mԍ��<v��f��ƅ�2�
$���1��+��� R������#clL��qǩ��0�{ci<�Ʀ��*|��`?&X�}���BΑwEG�E�eG�Qu�uAz��c��<�/�g9�{�g���C�3��������3�Lk1w{��l2�����}{К͂�Y�:a�7
;�߽ PK    n�VXw� �l  �  H   react-app/node_modules/caniuse-lite/data/features/css-backdrop-filter.js��YO"QF��W��l&"�d���;��!�" ����>�xa�hƙ�I������;ݷG��r���[MƳ���c:\�H(*�Ȑ%����ӎX"l�]�D��G�}�$�ӠI�9�N9��9�����+�\3`Ȉ�L�c�=Lɇv�#�erT�8�_��l�~8��^�Q�7M�R��/mGa#H3�,X"����BN�[�PJBY�U�&ԅ�Y#���P8���T8�¹��BO�.�+�/\qa $��0n��0���0���Q "O����n��NX	��+���|��>4�M�O�������f��{6�K0�5��ˤߨ:VT9QN��@t4j��ZۊS�B��)�JG�*9%j�){&V)(E+Q�JO��d��Ԕ��5�zv����OO/�V�״.�+��\�eו����_���g��<�L@d�4��r�����T�)se�,�[�NY)�ʃ�k۪ƨ��{��+H�A�o��ǵ9��'QBI*i��`?u8g�-�BGڢ�������ҳ��@iy��i���v_M=n
,��L4�>� ,9ʎ���e���;?��E�qd9G�Qp�s\nl��6}�F�i�L�Ѳ8�z��i���;��l<!�.z��G�ٲ����/PK    n�VX���BM  v  K   react-app/node_modules/caniuse-lite/data/features/css-background-offsets.jsՕIo�@F��:�E���A�x߭�7/��x�mɉ�"��3�$H���EHgH��M��j���d��߾���	��� O�����r�5x��������p�R�J�u4i�&�S�8�K��ХG��C�qØ	Sf$̹c�=,(�\�n�יBaIJ�
T0BN��(���P�BM��)���	'©p&�¥p%t����B,��p-���@��D�
3!����"�B&��[�p'��{�A��H>P�D�>GDʾm��J=ig9UΜh�]��	��z�+�w'�b�yl��_)�([¶�t���W
ʎŠ�Z�JI)�]JU��=U�+e�sE���I���]�9��:�#��	jS�E�	�*׎K�sɑ(se�,�Tɔ�r��)k�^yP6�a�+���<{�g��<>��d����2s}�)y����{���C�H	bh�ز�}���*�T��}�4ڀ�sk׼��v��0ܠ6��㜦wJ/Ò3�C�P2nlˆ��j��Ʊ��7MWT����흖[���6D�w�]{KEt;��p��f���$e�dF��$�Agi`o�l���~�PK    n�VX�,@�^  �  L   react-app/node_modules/caniuse-lite/data/features/css-backgroundblendmode.js��IO#AF��+�rfFY ,�9Į�{�%p��ȾA �ߩ
6BFH�V[n���U����r�
W��l1�s�:pO$9�0�ɐBhh�aK�#fQb�I��Iv٣F��q�	MN9�E�]B��q�%W�0dĘ	7���)���zI�H�,e*T���9!/��P�BE�
5�n��P8���)�
gBKh�+�¹�.�K�J��0��Ha*̄���µ}�V­p'D�3ؗ�` ��r���>�����Z�7�H��