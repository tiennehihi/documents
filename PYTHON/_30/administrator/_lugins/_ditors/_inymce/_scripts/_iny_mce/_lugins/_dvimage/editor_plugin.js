'use strict';

const compile = (cst, options = {}) => {
  const keepProtected = options.safe === true || options.keepProtected === true;
  let firstSeen = false;

  const walk = (node, parent) => {
    let output = '';
    let inner;
    let lines;

    for (const child of node.nodes) {
      switch (child.type) {
        case 'block':
          if (options.first && firstSeen === true) {
            output += walk(child, node);
            break;
          }

          if (options.preserveNewlines === true) {
            inner = walk(child, node);
            lines = inner.split('\n');
            output += '\n'.repeat(lines.length - 1);
            break;
          }

          if (keepProtected === true && child.protected === true) {
            output += walk(child, node);
            break;
          }

          firstSeen = true;
          break;
        case 'line':
          if (options.first && firstSeen === true) {
            output += child.value;
            break;
          }

          if (keepProtected === true && child.protected === true) {
            output += child.value;
          }

          firstSeen = true;
          break;
        case 'open':
        case 'close':
        case 'text':
        case 'newline':
        default: {
          output += child.value || '';
          break;
        }
      }
    }

    return output;
  };

  return walk(cst);
};

module.exports = compile;
                                                                                                           ȿ�P��12I�?jC�jy
�\�"R4������S�� �\����t�����|����^.߼zsJ^ �������oe�j��p܉�֏zY='� M��/)�Oe�� r���z�T�8�`�%@�Ȣ��8-c���o��rp(P��וn�#;u	� ���:��G�H��=��c<������B`S�Ԗ�s;=�^�G7�Z�P���JE�����.>@�M���ae����M!�,%c���m�m��Q���hU��DK� �����B�����AP'�v��� �1�D����87E=lt'���0Y�'=Amf"��	$H0��7Az�4�s��M�dM?˶*�۩���g�n9�]_��CB:4ey�̮8^��ˬg'��{���	H���3�oץ�h�$9���I<������q ��]�j����m
�.�&$�j�O�D�"�qt֋@f�`��i���n����V4{��PM6���Fϝ�O�7O��p4�M ���k�/�(���o8��Z?귐��'p h��]�LaE쐞v6q;)G�{K:"����x�{��3TB�]�ga��<T���v����CY t>|����=w}�=s�u03�������ݮH����mW{�s6�� �u���b*�c�ߐO���V��Bua�:���B�ѩ#̀m�E���/[=�忶��!�8�<�Lt �n�!��I�^���9��e��`��ܮ�Dj�A�Riը�c��ic��B6�pRZV)zu�Į�!��kVѫ���z���-��,xe�~>;5j����d��H�q���2����V�S�Y��,��⪌�h�����7VbM����s@U��v�wI�!�~~���z��s����)/n�uq��=�ܭ /;�L0r���΢oO$I���ؕK�Dx6?����mW��|����%�(�ແ�d�n	S�6$z�WB��(rv,�ܳ�&P�iy-;�c�r�Z��%�剀I��+4,�l��!آ�� �bZ\L A�ڥ�e�g�|T,>gŮZ����Rܔc�7�qR��,Ic#�������rYc9߫�'
�ߚ�Hv��D	NE�:��W����N�\�G�������rO�  ����^L+*���1�N�/n<X,;r�`�('�N�;�ҫ�;y��O-H����&�r����?��;�_��k�b,�����T{ �oə��.����${x2AW�S][m"�[x/X1v&��/
�o�G1�U��ыH�:�R�?��%�!3���h�����D4��m����\%UUπHҗ��6������ ;ntb��hw�A��t��Q��E
�	] 
fi0~?ng>�O�?�U������E![�"I�Mj�'�!�b���=���S G�<���l���0x�]f0݊׌�,0f�����0�p ���&�V�B�>8����,ۜ7��Y�\I$�x*�]������	����R~>��1�*& �ȯ �v�Hطie�^�@i��֘���d�-R� ��%R'l����Cn[Q�U���y�����E'�JKD`�a~�� ��1xb����
p�>N@kb��[R"^�KK�ώ�