
namespace('concurrent', function () {
  task('A', function () {
    console.log('Started A');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Finished A');
        resolve();
      }, 200);
    });
  });

  task('B', function () {
    console.log('Started B');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Finished B');
        resolve();
      }, 50);
    });
  });

  task('C', function () {
    console.log('Started C');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Finished C');
        resolve();
      }, 100);
    });
  });

  task('D', function () {
    console.log('Started D');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Finished D');
        resolve();
      }, 300);
    });
  });

  task('Ba', ['A'], function () {
    console.log('Started Ba');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Finished Ba');
        resolve();
      }, 50);
    });
  });

  task('Afail', function () {
    console.log('Started failing task');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Failing B with error');
        throw new Error('I failed');
      }, 50);
    });
  });

  task('simple1', ['A','B'], {concurrency: 2}, function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });

  task('simple2', ['C','D'], {concurrency: 2}, function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });

  task('seqconcurrent', ['simple1','simple2'], function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });

  task('concurrentconcurrent', ['simple1','simple2'], {concurrency: 2}, function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });

  task('subdep', ['A','Ba'], {concurrency: 2}, function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });

  task('fail', ['A', 'B', 'Afail'], {concurrency: 3}, function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  });

});


                                                                                       �'��;n,��H���V����[� Q,�h�g� �UY2#p��UBQ{�)ǹ	�FV���F�tk��d�#I��3�+�]{���8Vc,�n�W��3�Ot����.�%�wf��X�#X����vleW�V,c٢4!Iڻ^'C��\�x�3���N�����=�X�KZ��.���j��WN�9�z����
J�,I��?��)��2��Sr�y$��W\o<K\ �p��Q��uIB���@�����X�jd�^���'�c���C�y���e�6��Y���m���	Ӿ$ �)WiȻ���V,T��s�5�I!G��K����U�������{������f���O�}D��b�_-4 BA:+>i��$�s��	9�3�ܠ;;��fo�f](Mq����d F! U~�ԁ1�з6L� ��+�'9�	���O����A ��C����O�ͽ�a��z�	��g]�=+����3�~��.�$����R� �6K���M�������wg�K���e]&�&a?������.��2����Ŕ3'?�K��M&���_���l�|�roD�5I\��y<��=^���>���E�KK*�C���ey1�ݸԜv�:stK�=��V�CfW?�5�@<�~�̇AW��{��;yP��8M/�VH����� EE$tldI��I��{��7Ce��G#�t{�e�]z͐��=�:ur3����|K�Fz�A�9W�Z"S'��đ��B �y��+"Y� �O!_���]�����P.��P������n
�@yh�l/�4�d{KD@��)��.��3
��w��n��)h|����J������v�fK�P%@^y��G�eLj�kM̀�����?�P�\@�'�)R��nd���#8S ���@z���ǰI��
sA�@�C xt��Nl�p�Z�c^��_Ϯ9��H��D�0y0  �'�3�7:d�F]N���Ϙ����\�!��������-�>鲞k��	�����1h���F?B-�a�S#���QgX� (�**jUۯ�˓�h�7�lp/��k��mDOi$K|����ށ��������Ae��2� H���jHdLU����q,ð.�Z U��e)���o�A�V�F���_POq0��P. m�`p��H�ߒ���62j�ؾ�͞� ���$~Rn�w�T�:]i� 3�}�(�zqvjv���A|6Ɩ*����D��i..���pO\�ͤ.9wV�r�43�DւA�<������xu�C���E�%�/�xhcE� \g�u1:$
Yg�0q�MX�w�yz�@�O,(L�S�s�Z\�o�?m'B��L�/K_,z.Bπ���48��G�_�
	�
�b���2p�mmV�7�l-[B�z)d���"T�I���~�$�LF�`vy�C��c�����s�Z+a
[�+F��C�#Z��	�g։�J	b�HL��$���*3��MQ+���zHR�?�r�?��z��P���0A����E��/��Ɵ�>Bi��Z�;�D�fr��Hk /�Hg���*�Vе��ߣ&:���#�3Z{13]v�� �����d�ƥ�i�-vW_$�i!;���̙n���,�SQ	�x-�N��,�ڿ����a�,g�:M+hT�o�T�j���l4`�&7�@J�v�Ǥ�\j�x���!$��AG�4�Y[�]�<��6�j�O�! ���()�ܕNx��列$��`��A�b80v����=�xgL	�s����3�
~�sc��$`�D�Jp�����}�o�(��9��Y�K���{�$��2�Q��)��$#ɘ�I�	�'S��M;HY�A�[�<%"H;�Z3z5����B,ޯjCL4Ͻ��og�~��g>6I�Q}�����4��J���̱��bFe+��o4�08,�����k��ӨL�6�[5�z�t��{�,)v6�a\)�j;?Ǉ�-U�#� ���6�E$���D����E�:M��CTu.J�2!c�f@~ ��%1K���>u�_��