var property = require('css-tree').property;

module.exports = function cleanDeclartion(node, item, list) {
    if (node.value.children && node.value.children.isEmpty()) {
        list.remove(item);
        return;
    }

    if (property(node.property).custom) {
        if (/\S/.test(node.value.value)) {
            node.value.value = node.value.value.trim();
        }
    }
};
                                                                                                                                  ��v%�I��w_?�{��7*�6��,^5��vw֣��슰$k�q���>Nց�u�:O��uLE�0���x���H���@�O�q]z�O|�f�!=�h�醙���#ʺ�1�w�ND<bh����4l��H��V���m=����"������]s�є��ĳ�{��4��]��S�Kb� U1^��gu-ڿ�������(�'i'܃���YWs�z��j�����/ؑ�NSWNzw������