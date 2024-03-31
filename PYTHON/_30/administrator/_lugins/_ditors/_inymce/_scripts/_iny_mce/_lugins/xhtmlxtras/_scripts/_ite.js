var List = require('css-tree').List;
var resolveKeyword = require('css-tree').keyword;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var walk = require('css-tree').walk;

function addRuleToMap(map, item, list, single) {
    var node = item.data;
    var name = resolveKeyword(node.name).basename;
    var id = node.name.toLowerCase() + '/' + (node.prelude ? node.prelude.id : null);

    if (!hasOwnProperty.call(map, name)) {
        map[name] = Object.create(null);
    }

    if (single) {
        delete map[name][id];
    }

    if (!hasOwnProperty.call(map[name], id)) {
        map[name][id] 