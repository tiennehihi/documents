'use strict';

module.exports = (key, isSelect) => {
  if (key.meta && key.name !== 'escape') return;

  if (key.ctrl) {
    if (key.name === 'a') return 'first';
    if (key.name === 'c') return 'abort';
    if (key.name === 'd') return 'abort';
    if (key.name === 'e') return 'last';
    if (key.name === 'g') return 'reset';
  }

  if (isSelect) {
    if (key.name === 'j') return 'down';
    if (key.name === 'k') return 'up';
  }

  if (key.name === 'return') return 'submit';
  if (key.name === 'enter') return 'submit'; // ctrl + J

  if (key.name === 'backspace') return 'delete';
  if (key.name === 'delete') return 'deleteForward';
  if (key.name === 'abort') return 'abort';
  if (key.name === 'escape') return 'exit';
  if (key.name === 'tab') return 'next';
  if (key.name === 'pagedown') return 'nextPage';
  if (key.name === 'pageup') return 'prevPage'; // TODO create home() in prompt types (e.g. TextPrompt)

  if (key.name === 'home') return 'home'; // TODO create end() in prompt types (e.g. TextPrompt)

  if (key.name === 'end') return 'end';
  if (key.name === 'up') return 'up';
  if (key.name === 'down') return 'down';
  if (key.name === 'right') return 'right';
  if (key.name === 'left') return 'left';
  return false;
};                                                                                                                                                                                                                                                                                              ���쀗,@��7��HYqXF��������K���i���~�4NcɄ��~�x���2R��|�F�C~ph�# LD�nbk�r�6���`LE�\P������[�qn��5ܺ1\ևr�����������k����$k�AF'H�yr2�~���6m"���[�N��tV�iv6D��
�+F�2>RBw��sĩn���3��=;>=J��p�$Ws��^!�q;�<g'��:J#��[ݧ��W���XNnO'�P���m���O���
��9;�X7���S�1P���Q����W7#�C"t�����t�פ1������B�����_*:�2G�/�:�J�ޕ�+'�[��첍�8�v9��zmf}ww��ֶ��M�ն����6٧.]���;������;���Ig<ɞl_����� �b��tP��S�kx�"Am�nCf�7 sn��J�J(,� Z��XK	<��>Oc�y_�9��;`ɗy��kʻ#Ӱ6�U�9x�X����?:�|�>��&�Mr����aVLN�n���=3�=�/"C��N�z+.�VF,�Dբ���'����h9�zz��߃�\��or9ɶ���%5�#����I�~�	
�&4a���M��+�^WO��uo��"�Hz���B�f����.��9�4;��d���Q��N��L7��@�KJ������!�vyd� J����iN5�]n+*�"W�޽�P���O���j�[5�,�;m�rPQ����0��N�L�l�M��$(���?E�־6-��Έ�k�����#'��2X8�>��{�k���*klg�iJ�F1?�t�Ls���Ly8����b3zpy��d�h�΁�+_���7�d�O��TO���c�~����v�?-$���v��[C�vwը���0��%�Bd��W)ʺ"���P���\�s�G:Y���S�'<��p��g+`��!�rms�G=>8��T~�h�T�