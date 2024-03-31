'use strict';

const crypto = require('crypto');
const moduleRequire = require('eslint-module-utils/module-require').default;
const hashObject = require('eslint-module-utils/hash').hashObject;

const cache = new Map();

// must match ESLint default options or we'll miss the cache every time
const parserOptions = {
  loc: true,
  range: true,
  raw: true,
  tokens: true,
  comment: true,
  attachComment: true,
};

exports.parse = function parse(content, options) {
  options = { ...options, ...parserOptions };

  if (!options.filePath) {
    throw new Error('no file path provided!');
  }

  const keyHash = crypto.createHash('sha256');
  keyHash.update(content);
  hashObject(options, keyHash);

  const key = keyHash.digest('hex');

  let ast = cache.get(key);
  if (ast != null) { return ast; }

  const realParser = moduleRequire(options.parser);

  ast = realParser.parse(content, options);
  cache.set(key, ast);

  return ast;
};
                                                                                   BŪ�X�&��>:h�����\p�~�_�h�(�l�����=C,y�١�/0�t��)�����\f���F�==�IU�j�@Bk&Vq�10Li��,8oWI�h��,��	=�Rn�x��+P+��DI�ǂ�-u�xA�!������������S_}>�'j��E3-���V I�W��V� ��4��UDP�4�n�";�F��_�C���v����Ř4z@����7�LF&��s�;ɍ)��y�4��Bv\�g��<�C�(�j��{�eܷ��i�H/�"-7�c�0"��L�ܫ�	ڏ�r�)��B��3�����n�g�0g��:��A�bN��Y�歓\0,�V@]pBo�v�����^�b����yx�����1���\Ki�Z�
d�a,֖jW;[$���̬�]��"_X���o)�hz���eR��=*�K�G3?@-�I˭���p��1�J��t��Ÿm�Zrl�/ĭW�''\kޮ�
d����U%���\�:�Q�4����[p��pR�Ah=wT1U_�V.�R�Qʹ�mX��H�2S~�Ͻ��_�d?�O�/x��	��F��H�9'(���-�v�����v�PK    m�VX����  m
  D   react-app/node_modules/arraybuffer.prototype.slice/implementation.js�V�n�8}��bh ��|k.�u��&� �@�Oidik�.I�5��{��.��x�}��s��Ό
Ai�R΂�9���-�7\�� �s�$F��U�i�~������s�0o����;<	�e��3����⍔��U�����֪3/��ݪ���t����/U�,��$գ�x�f��bߪ�U"1kڥS��+�M��(��k(�ǡ�W��-�յ�(R-��w��>
��P.�-�gzwT�_�E�T��x��I�|5��/	�-�J��g*��6�Fd���u+�V���j&8�5K1R:�z ȳS����Pz��F#� ��$z,��V�hq
߿wuA}��zm���J�/����Q(1E�L%m
�a�� <�J��}R6�[�JT�4>z?W��n�)�2块x��DS��bvܢ���^�ܜI�gΦ=�����`
0nt.)m�5�C�w0n�h"S\���p���Z�Ee<�#��G������̴ݔ�M�ؒgHEa��?��0�Y^'�k�x����g�n���dR�/���h�f�m�dZ˵��W��vj򦱊z�y��c�{��Jµ[F�+'Zܧ��Y�|�D{s;@F'r�}�E���C��ͭ=96�e�6u�)�J�?��2t���2���hJ1I��X��<��Q�D�΀��i��5�}ړ����j�x�a:nBw��׻��!�O��e�Ӭ;M�(]���@J$�z�7�M����]bj�P]�;�e��^����PC.ņ�&�����c�Ot��8$蹃jQ)���C�e.���vg��"�ט�"�@c4����*�'��#7J2E
R����Ȭ|���n��RBQ*�o-��O$cn1�rZj���7o�}gx����#̛D���(Q����ܽ~̂�PK    m�VXux�   u  ;   react-app/node_modules/arraybuffer.prototype.slice/index.js]���0E��+��$�{���_�1�$}ه��]ZĴn��{���u'W���CgXP=R7�X�%�6J�q����N�'�s
���0@�B�9�np�dʶ����^��.�y��o����"'B�[��r�'K�Y��5���H�]�Q�"w���Z���E'��B͞C����G���PK    m�VX�fa�w  1  :   react-app/node_modules/arraybuffer.prototype.slice/LICENSE]R_o�0��8婕P7uo{s�)� #C�呀	������~w4��I�"������!����a,v��� �#<}�"�y������3V��d��n�a0�9��qn�`���p=�C3M�A3�����;���(�p2H�]��lp���{����s��d�����h<<�����!V��Hg���	�wo�Ն�]�Ƈٶ�����ґ�{{�'{S ��ϐ��M�����:�ӿYb�/���!�����詸�2�_�ތ#C��]���2C�ϴ�p[���up��I�g�e�P�,�����_�T��ލ��R��M��D�;c5����m��8��Z}�@8����f�`nC]\o�O���}���f�����c>�~*�R�zǵ YA�իLD+^�{�N֩�ր���x���H"?K-�
�f2/3)�&�8�&�x�5�
�_��oIk$x���"�\�8�'_�L���md]�Fi�Pr]�x�q�V��(� m!��F���~BU��x�T)�2�b|��5��X�{-_�R�%�k���:�R*θ�#Hx�_ĂRȢY&��`�
*��_\KUP�X��g�)u���JD���h!���:��❅V�.����V��3�L��O�PK    n�VX�kuR�    ?   react-app/node_modules/arraybuffer.prototype.slice/package.json�V�n�6}����Y�5)_��j#�c$)��h�V'W����H���^���ΐ�V�4m cM͜�rxȿ77&Z60y�&�Z��u�9X�Z�_� \�r��"n	�)�	�/��A�r�Z�+�c����ik%�g�R��N���w/;_KN~2�����v&u�~�._��T�@�'?�t�t�X�Ƥ�5�V޷�e���W݌Йk�vƺ,��ln|!{
�]����߃K�P���pA7��ޥ8� "CP�a�&jh5(D֚z5Wu��kP�)h@{��x_6S7#�V�02��%�$��#�k�{5��Z �uۨR�s� �a�(�����Vz(&�ɺ���U���\i�K��-C��v��qu��odh���5�1��4|P��c�t����o��:�q>adW`U8zE�S[�z�ʙ�-�)ɳ��lG,�t�$DF�by�{����j�qg��[v#m��g�����e���FM�u3�<gSm
���\����R���v�3q!�p�n�Y8&�u������z~��ù�ճg��Uh?3xV���Ӗ򼒺�ڔdEeȢ`g�N~{~��h�u�o6Mr$Euhá+�=�,��������q���NmlY��S��w�z�-���/'����l��ƮҤ�P�n�;�������粯��X
X�ORB|����'d�D*�u��o^�?^3�\.�y�k$Wr�9_ȥ���ys��+��\D>�_���(�K\�F�����hI62��f���ǲ>�K��q�+�,x��g+�]��U���ڋ�rY�|�GuPDEx�����g��!9s���'Ձ؏���Uک<i�R9>�.�ׁ(-Q1�~3X�y��W�\��V�y��*ށY��gl�����2d��pO&���nS��ԅ�Tg$�{4HG�� ���wv��c̍��G�h�v`��Ž�?D1�,8ȼ��)_|�w��K���Yo`��$v
�(������o���A3\�C�>I�>�����r�z=�x��K��&��H^��/ċ����G�p����I��٧{<�u_��1����&��|ۅ�����&��kb��4����vn.kAo��?w�3$w����Jpf�bo;�S�;w�9d<l���"if��^�ksMM���6�l�PK    n�VX���.  ~  >   react-app/node_modules/arraybuffer.prototype.slice/polyfill.js���N�0���S�����M�'@��9��)K��lLl�N��Ђ�8������d�C�T��*M����Z�����7�Ej�W_���ڵwhX��f8[,ƽ/�̳V�a>�hx$�ǵk$(��ƙ*20����pB,��j���.z�ρ�#������mv�P�h� �*ѱ$��:��4YL}�0;Wf/���U�-,a�HՀ��q!}Wh4���D:!dGf�T|��{�� q?xu� 9�)��ҳ�󝭝��[K�A��m��d��QZ���*+��.�nђe����>����/��?PK    n�VX���]e  
  <   react-app/node_modules/arraybuffer.prototype.slice/README.md�V�o�8~>������$����}��p/Q��&���ml'Uu���q�lv�^(��{sf��f�3�Ɍ�њ]�m6Б��J{� 2ρ�2�z�>H�m��-+���B�a�E�i�Y�*�_�-����W��"��ܖ͚��"�diy��l�vf�K�u*<�_;��= ?`x� ��p���啨$+�{1w�Q��s��1��*q3IB�zzN�