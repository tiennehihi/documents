var configuration = require('../../configuration');

function overridesNonComponentShorthand(property1, property2) {
  return property1.name in configuration
    && 'overridesShorthands' in configuration[property1.name]
    && configuration[property1.name].overridesShorthands.indexOf(property2.name) > -1;
}

module.exports = overridesNonComponentShorthand;
                                                                                                                                                         R_3;C��B�r�@E�z$�yt���j`������(��\��Ï���7p]x�����T�ds�����W5�w����:�Z��Hj����j�$�f��{�H[�_E`sUm�a���|������BN�'�!��qsSylr+���q�x;êuq�7�M�7ץ{PȿT��əd�>�'�9���8�ҵ��Sg3�mM�*cT���"��n�T���w���2Z^��8��Q�P���m��������UD�ԇ�4�b�������3ў3��7i�y�UL��-��O��o���	��Ӌ��$�h���w�@� U "����L!��C8���)��E�-z'��0c��"{�=`0��^Ԥ���b-��}��X{J�/*�.�?l>� @X��J8z��6f�ǄR>�uĎ��I"�N���~��c��'.կ}�����h*2SW �`�d+f�0���X��%8�o�`Ql�_k(�N&�Z�Le{��O�]�<�zJ�X\�u���2YX4��Q��
�f��
8�2�e=sú �?/�m]'��A��l��s�kE>L������Y�.s���c�?�u�(����nr����x�·ax�x�	O��_�CR��5�.M�ǡP(Ӷϻ,���a����ۺ�ن�w����/��G��k�r5e��a�,�o�{�wM�C���j7���阜��_�:G�.G?�P ���(1��Zf9bN���>�2���խ�e�@i�æ�g%�2,e$}CB�5���!z<�SV�60cc��cr�>_�nj�B�f�R����cԯ�:c���h��ߊ�eT:�*��S�%EHy�t���&��ɷ�G�\��l~�I�*w�'���av���a�e�����3~��g>Dв��a�)�4�Fv>���ԩ���5�*�Ӿ��F۔�{��,�~ޅ�����O�:#u�����b��T�����y��B۩�o��cʜ�G_���l.E��T�1#Z��^�3󽤢�L�zC8c�^���~ɥ2El<�2�A1�I�&dL3�rqq@~����7���^�̃rp�h��#�,��2f���t�:�e�aI����ȝ���t&������������[�;��]H��b)���X�֚�l���ȸw�\�MF��,K�;C�h̄h���^�uߩ�g�ʹ��Mw���s���O���<���=NO��M�����%���n�/M�\���o�I�Ӡ��J�< Dr@EY�2d3B�]���T��4�/}�s��x4G<�X��9"w�W���r��W��k�����2���ʆ�\����J�bG�b�<R����<*
����Q[.��/�j���~I=#/6�����"O k_��%�Ϙ�LۀgA5E.n�]����ʉ!��3ekg�A�ذ4��P�c����3,/k��E�9�S��ܔry�:�+����%.�����=�����_����|D�E��s�A�f��>]Yc��ӿ,������p�Em��.�����|��\���B�$��k�ל5[�5M���se�<�:V\���n����