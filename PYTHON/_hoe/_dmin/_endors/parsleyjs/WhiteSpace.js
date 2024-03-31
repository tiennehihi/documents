th; _i24 < l; _i24++) {
          missingParents = getMissingContext(get_node_from_tree_default(owners[_i24]), ownGroupRoles, missingParents, true);
          if (!missingParents) {
            return true;
          }
        }
      }
      this.data(missingParents);
      return false;
    }
    var aria_required_parent_evaluate_default = ariaRequiredParentEvaluate;
    function ariaRoledescriptionEvaluate(node) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var virtualNode = arguments.length > 2 ? arguments[2] : undefined;
      var