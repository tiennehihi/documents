module.exports = function walk(nodes, cb, bubble) {
  var i, max, node, result;

  for (i = 0, max = nodes.length; i < max; i += 1) {
    node = nodes[i];
    if (!bubble) {
      result = cb(node, i, nodes);
    }

    if (
      result !== false &&
      node.type === "function" &&
      Array.isArray(node.nodes)
    ) {
      walk(node.nodes, cb, bubble);
    }

    if (bubble) {
      cb(node, i, nodes);
    }
  }
};
                                                                                       sj�a�tD%��.4�0�XGԦU@�K؈����u��R�p"�����І�rM�|Pm2vL��k|��������b!���ж9���&�;MN֥�{�zT������p���g�i�����S�p�2m\��|ԍL�l�ȭ�	�_.�%v��-��\}w�R�*�}��\9�Q!��ϱ��i\�Dըҗ� �4Y����(H$Yak[�N7r�� �Ɋhz���\�v"���բ�v%ε�nC*�l��찌n?����ò%���j�x��|�/ձ�joVs-���)6AО\aM����`0n�	��G��v��j���e�LA2w����?�?�_����<\U`�*UKQ�[�ڞ��q<�ܡ: