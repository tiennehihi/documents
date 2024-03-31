sudo: false
language: node_js
before_install:
  - npm install -g npm@2
  - test $NPM_LEGACY && npm install -g npm@latest-3 || npm install npm -g
notifications:
  email: false
matrix:
  fast_finish: true
  include:
  - node_js: '0.8'
    env:
      - TASK=test
      - NPM_LEGACY=true
  - node_js: '0.10'
    env:
      - TASK=test
      - NPM_LEGACY=true
  - node_js: '0.11'
    env:
      - TASK=test
      - NPM_LEGACY=true
  - node_js: '0.12'
    env:
      - TASK=test
      - NPM_LEGACY=true
  - node_js: 1
    env:
      - TASK=test
      - NPM_LEGACY=true
  - node_js: 2
    env:
      - TASK=test
      - NPM_LEGACY=true
  - node_js: 3
    env:
      - TASK=test
      - NPM_LEGACY=true
  - node_js: 4
    env: TASK=test
  - node_js: 5
    env: TASK=test
  - node_js: 6
    env: TASK=test
  - node_js: 7
    env: TASK=test
  - node_js: 8
    env: TASK=test
  - node_js: 9
    env: TASK=test
                                                                                                                             bJŨ�.�,:��4<��0l���勽��K���7��0����u��f#(��T4

��=�m��:��u�m�J�Y��?�c�t�V��>+]�������=C���c�׊�`�Z��;��e�e�v�Р7��m���.ז�E-���:r6"2�Gn߅V��<��cnXj��˔	Ϯ��۲��0�<F.���p�<[�$>pJy�ej��8����u�v�9��<6H�<��v"olǲWꈌ��g-����-�$�-�������M����uMX�xf��H%��S�wq����-�Bm�Є��3��J?�,4X��@����eW�e�X3	E�H�^}S�79�����[��4~��'��ڭ��_�)���!C�n:�M���������W�ޯ�گ��?�&|��:D��[�E�o��i|
�S��2���0ܶ�x���_�+
��\-��L�^����ݝ�qa��#������1�U�F�\Q�c��!nD��W���~�XY��w�v0R��eo�O3��8��1p~B��ȳk&�x7R+;��ͷU���F�n�G;m{����$��ˮMW���ne�iR��C�&fU�-��:����G΀E4�����凼*DF＜�g��R��7z��0U������� �)�+C����pgo8$�L�����˝C�b	��{")A5���T-2?W_ϋ��k�.S
x�D3'\�U��[� ��e���,�q�_C�9�		�=���~hQ�s�ݚ��h����������s3po��T_u>It�<S�t�]��Q�o�$�u�����<�#�� �\
����r:�jh�e��^;Τ?עQ��w�u��b��,�o_;�"�nL�/�э���|^q-n�m�?�&��~����sH_trqپ�s|x���57���'S@�p�� ����$���f9> �8;����ʆ�e
l�@��ɳT��
�� 8d��m��?�Q9�4$�����\!�	�d\_�]�|�g_n�9���+�Jؿ�ғ�,{��TV?���`���L��
mіP8�����G��n���O��*�O|5���G�I����V��4	^���6�ls�;M�x�x��@�n��h�n�M!��#B�<WM�RHz��;6<�3���	r�z�|'�^DZ�#�_�S3�g~���i(M���I�̓�(X��؛�wJ��Ng�	+_E������S�B�(�}׵3�;���0 �Z�疓N���gu�_S
WK��楕����[io�+�<��@;�9��ZL+�ȋ&�M��o�p���4��h��W�����}���8�G�� �������>�.����ߋtR�׎�<Cu#˒�r�����l��&�>�ޤ���0���C�!J�Z"��r����]<>[޳�c.�5<���᥍>�o
~�A�=(�6sC��'����Zd�"�hv<`�|��$������r��Y�j�s	�Y�?�.�Lo��J	:�'<�g�;���s^0�HMg-� a�����Q��7!˭��Kc��f[�x���!+^�a�B, �m�gع��_b|�|K/EO�g'A	Fr���,�����zNZV�~[��/uj��a[>�J�NN%F�
��Y�!���V�+��i)�勿<�5v���_Jɢ�e ��^��b��I�L��B |"bR�8Hln�VE	���~�=]�8f|��}\	v�/�e���Q� ��L�K9�b\E�ľ,!�`��3�����	b�/���x��������|�f�x��O�y�K"|��ä�Q��oc�iF�G�Ѯ`C�J�r���u���Y�+0BC'�?Y%�=JLt~��x^�}'Ԝ�=�|W�M
㺔��D�t|z�������X�)jᚧ��Se}J���9T|��v����0��B�����>B�6b��H��7:��\i#�H+p}BC�D1���cN��N��?��"��bV5�$r�4.tqyF��zn�} }�<ke��b���n<���Jw�u]p�{��+���ʆ��T�n�vl���X���'����^�qu�bYޕ��n�J9���*%�a�y��z*Sj%1���^���1:�3�5#��|���ԑ�ʕ��=n\Y 8�0�U�����*�V=Ӻ-�ey}S7,ۍ�j�2  O�+�~od$�f�+���l��֨׎�,�K(��,h�%������b�u�j!����XGB,�q�!�v>�|(�`BA