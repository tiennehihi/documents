e !== 'undefined' ? attrInfo.minValue : -Infinity;
        return /^[-+]?[0-9]+$/.test(value) && parseInt(value) >= minValue;
      }
    }
    var validate_attr_value_default = validateAttrValue;
    function validateAttr(att) {
      var attrDefinition = standards_default.ariaAttrs[att];
      return !!attrDefinition;
    }
    var validate_attr_default = validateAttr;
    function abstractroleEvaluate(node, options, virtualNode) {
      var abstractRoles = token_list_default(virtualNode.attr('role')).filter(function(role) {
        return get_role_type_default(role) === 'abstract';
   