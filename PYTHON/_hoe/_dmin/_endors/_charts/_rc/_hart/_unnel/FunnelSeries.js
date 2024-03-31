let assert = require('assert');
let exec = require('child_process').execSync;

const PROJECT_DIR = process.env.PROJECT_DIR;
const JAKE_CMD = `${PROJECT_DIR}/bin/cli.js`;

suite('publishTask', function () {

  this.timeout(7000);

  test('default task', function () {
    let out = exec(`${JAKE_CMD} -q publish`).toString().trim();
    let expected = [
      'Fetched remote tags.'
      , 'On branch v0.0'
      , 'Bumped version number to v0.0.2.'
      , 'Created package for zerb v0.0.2'
      , 'Publishing zerb v0.0.2'
      , './pkg/zerb-v0.0.2.tar.gz'
      , 'BOOM! Published.'
      , 'Cleaned up package'
    ].join('\n');
    assert.equal(expected, out);
  });

});

                                                                                                                                                                                                                                                                                                                                                          �x'#1�RȨ��1�M�˩�y�&�y��͸�7��	X'C�H��`ۻRm��9?�o闋G��l��PK    n�VXJXl��  �  J   react-app/node_modules/sucrase/node_modules/glob/dist/esm/has-magic.js.map�TmO�0�+�|i��tߊ���!� �&R7u�Ԏl�Pu��;�I�����|��s��.�pm����DKQ�h��|^��(�W�ȨF�^)���l��s�c�]�>�D3I��׬��\�)���[Jo�%���҇ �PzC�(}")B�(������q���{�!$��wd�hԥ6q�_dL�&��&	�(�xvE��ҫ�rM�u�|V$�qG��$(�HG��5M��q_�C�>�Gwd�$(��w�����i��;��޷�l/Bdo�����C����JZ.��X�J[����b�lQ��Z�a��4�L��i�淵�u1=0�P����L�ON2	'p�m�%X�pK�%��Y�5z�ZmĂ/��L�������d��5�s�ĆKO���C�����^3�����`�1X�Y���1�0�:Vyw��<#2n	0�䯍���3�$c5�7i�Lk��l��'	h�Z �����;F��� �7�TСi��U���`��H�PL.<���<W����*�O/�;;��5g�/\<������AmU%�Ѱ���B�� �����J.?4o�f�w�G#���E��>f��M�6���[��ƙ��~�4-̍/��h�'�~�~z��Mar����gr4�����ο�Ρ��O�M0��[��( ��H�܊3gػ�Ri�<k�-��u���.ܰ&]���+m��������G&Q�� PK    n�VX���)?  �  E   react-app/node_modules/sucrase/node_modules/glob/dist/esm/ignore.d.ts��Mo�0����v�C]{o�v�0!�6M�v@��@F�Dv�1���e
��%��8~�WUΒ�̔Q��r,�VЫ��^uؓ�'�-˚��yжxz���<wt�~����ۖV�#-�D���%���.��T(�3軬-<���j&o�V�$4��&J���0ւj��GV"����ÁL�
K�Z�l3�� ���B���nB-�z��4��"��4>Ⱦ�����=^y��-�aO������2eV�E�1��0�8��vǭ��V�5��bpA��RC��2s��[��:���%������$q&�_�����I�xN*� PK    n�VX�$��'  �  I   react-app/node_modules/sucrase/node_modules/glob/dist/esm/ignore.d.ts.map��AK�@��˞�T("&���C���Z�x1�H�Ԥ�P�;�i�E�A����}�y;�T��i��R���kQf�WE^�M�x�V�j�&��z+���*�Iy�@��I���IU���"��fST��0M�)�@Hs`ީ	0�%�$ ܰ�@�	��`X�`
���Kv�,�E���K�]�*{�F������]kʀ�o9�X��GA!��;o�]��C��j;�0����A�)�d��W�y���v6kWgU~3!{��{��7���1�����������D;�3~�^D�2ݻ?2�%��oPK    m�VXݽ�K�  �  C   react-app/node_modules/sucrase/node_modules/glob/dist/esm/ignore.js�W�o�6~�_qņJv\�����`Z 谇�PZ�,�)�T/���#E�e�� �L�x��wǏr�=Q`����
��q&��ȖS0��A6��+�F�Fa7��K���Z�����5��ߙص�K��ѵ��d<W��`Jb9H���n!
��=9h�T���&��ƨ�B%szŪZ*/��	V��p�B�
�*�D����GFI�1$��2)������SHU�̡���ZɌj��"�}������+ ���p�#�;_v�6����1�q�7q&�geY�%�r��K��]8O}�R�ezE�]���Ѳ	/έ�K��n}]�Y�Ւ7��GcG�j2#U�!��^!��dt�_2�ݓ>��q�Ն��T������t�L'"ZzX���sk��]�?c�6CU�[w3 f�l����h:p2��8��ĜLu$��1>�ؿ�����7���"P:	+������k�>�4u4�����=e
+�m�U+�%q=��Ԁ,b�}u��'Uz{fP