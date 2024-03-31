        return labels.some(function(label3) {
          if (!_isVisibleOnScreen(label3)) {
            return true;
          } else {
            var explicitLabel = sanitize_default(accessible_text_default(label3, {
              inControlContext: true,
              startNode: virtualNode
            }));
            _this4.data({
              explicitLabel: explicitLabel
            });
            return !!explicitLabel;
          }
        });
      } catch (e) {
        return void 0;
      }
    }
    var explicit_evaluate_default = explicitEvaluate;
    function helpSameAsLabelEvaluate(node, options, virtualNode) {
      var labelText2 = label_virtual_default2(virtualNode), check = node.getAttribute('title');
      if (!labelText2) {
        return false;
      }
      if (!check) {
        check = '';
        if (node.getAttribute('aria-describedby')) {
          var ref = idrefs_default(node, 'aria-describedby');
          check = ref.map(function(thing) {
            return thing ? accessible_text_default(thing) : '';
          }).join('');
        }
      }
      return sanitize_default(check) === sanitize_default(labelText2);
    }
    var help_same_as_label_evaluate_default = helpSameAsLabelEvaluate;
    function hiddenExplicitLabelEvaluate(node, options, virtualNode) {
      if (virtualNode.hasAttr('id')) {
        if (!virtualNode.actualNode) {
          return void 0;
        }
        var root = get_root_node_default2(node);
        var id = escape_selector_default(node.getAttribute('id'));
        var label3 = root.querySelector('label[for="'.concat(id, '"]'));
        if (label3 && !_isVisibleToScreenReaders(label3)) {
          var name;
          try {
            name = accessible_text_virtual_default(virtualNode).trim();
          } catch (e) {
            return void 0;
          }
          var isNameEmpty = name === '';
          return isNameEmpty;
        }
      }
      return false;
    }
    var hidden_explicit_label_evaluate_default = hiddenExplicitLabelEvaluate;
    function implicitEvaluate(node, options, virtualNode) {
      try {
        var label3 = closest_default(virtualNode, 'label');
        if (label3) {
          var implicitLabel = sanitize_default(accessible_text_virtual_default(label3, {
            inControlContext: true,
            startNode: virtualNode
          }));
          if (label3.actualNode) {
            this.relatedNodes([ label3.actualNode ]);
          }
          this.data({
            implicitLabel: implicitLabel
          });
          return !!implicitLabel;
        }
        return false;
      } catch (e) {
        return void 0;
      }
    }
    var implicit_evaluate_default = implicitEvaluate;
    function isStringContained(compare, compareWith) {
      var curatedCompareWith = curateString(compareWith);
      var curatedCompare = curateString(compare);
      if (!curatedCompareWith || !curatedCompare) {
        return false;
      }
      return curatedCompareWith.includes(curatedCompare);
    }
    function curateString(str) {
      var noUnicodeStr = remove_unicode_default(str, {
        emoji: true,
        nonBmp: true,
        punctuations: true
      });
      return sanitize_default(noUnicodeStr);
    }
    function labelContentNameMismatchEvaluate(node, options, virtualNode) {
      var _options$occurrenceTh;
      var pixelThreshold = options === null || options === void 0 ? void 0 : options.pixelThreshold;
      var occurrenceThreshold = (_options$occurrenceTh = options === null || options === void 0 ? void 0 : options.occurrenceThreshold) !== null && _options$occurrenceTh !== void 0 ? _options$occurrenceTh : options === null || options === void 0 ? void 0 : options.occuranceThreshold;
      var accText = accessible_text_default(node).toLowerCase();
      if (is_human_interpretable_default(accText) < 1) {
        return void 0;
      }
      var visibleText = sanitize_default(subtree_text_default(virtualNode, {
        subtreeDescendant: true,
        ignoreIconLigature: true,
        pixelThreshold: pixelThreshold,
        occurrenceThreshold: occurrenceThreshold
      })).toLowerCase();
      if (!visibleText) {
        return true;
      }
      if (is_human_interpretable_default(visibleText) < 1) {
        if (isStringContained(visibleText, accText)) {
          return true;
        }
        return void 0;
      }
      return isStringContained(visibleText, accText);
    }
    var label_content_name_mismatch_evaluate_default = labelContentNameMismatchEvaluate;
    function multipleLabelEvaluate(node) {
      var id = escape_selector_default(node.getAttribute('id'));
      var parent = node.parentNode;
      var root = get_root_node_default2(node);
      root = root.documentElement || root;
      var labels = Array.from(root.querySelectorAll('label[for="'.concat(id, '"]')));
      if (labels.length) {
        labels = labels.filter(function(label3) {
          return !_isHiddenForEveryone(label3);
        });
      }
      while (parent) {
        if (parent.nodeName.toUpperCase() === 'LABEL' && labels.indexOf(parent) === -1) {
          labels.push(parent);
        }
        parent = parent.parentNode;
      }
      this.relatedNodes(labels);
      if (labels.length > 1) {
        var ATVisibleLabels = labels.filter(function(label3) {
          return _isVisibleToScreenReaders(label3);
        });
        if (ATVisibleLabels.length > 1) {
          return void 0;
        }
        var labelledby = idrefs_default(node, 'aria-labelledby');
        return !labelledby.includes(ATVisibleLabels[0]) ? void 0 : false;
      }
      return false;
    }
    var multiple_label_evaluate_default = multipleLabelEvaluate;
    function titleOnlyEvaluate(node, options, virtualNode) {
      var labelText2 = label_virtual_default2(virtualNode);
      var title = title_text_default(virtualNode);
      var ariaDescribedBy = virtualNode.attr('aria-describedby');
      return !labelText2 && !!(title || ariaDescribedBy);
    }
    var title_only_evaluate_default = titleOnlyEvaluate;
    function landmarkIsUniqueAfter(results) {
      var uniqueLandmarks = [];
      return results.filter(function(currentResult) {
        var findMatch = function findMatch(someResult) {
          return currentResult.data.role === someResult.data.role && currentResult.data.accessibleText === someResult.data.accessibleText;
        };
        var matchedResult = uniqueLandmarks.find(findMatch);
        if (matchedResult) {
          matchedResult.result = false;
          matchedResult.relatedNodes.push(currentResult.relatedNodes[0]);
          return false;
        }
        uniqueLandmarks.push(currentResult);
        currentResult.relatedNodes = [];
        return true;
      });
    }
    var landmark_is_unique_after_default = landmarkIsUniqueAfter;
    function landmarkIsUniqueEvaluate(node, options, virtualNode) {
      var role = get_role_default(node);
      var accessibleText2 = accessible_text_virtual_default(virtualNode);
      accessibleText2 = accessibleText2 ? accessibleText2.toLowerCase() : null;
      this.data({
        role: role,
        accessibleText: accessibleText2
      });
      this.relatedNodes([ node ]);
      return true;
    }
    var landmark_is_unique_evaluate_default = landmarkIsUniqueEvaluate;
    function hasValue(value) {
      return (value || '').trim() !== '';
    }
    function hasLangEvaluate(node, options, virtualNode) {
      var xhtml2 = typeof document !== 'undefined' ? is_xhtml_default(document) : false;
      if (options.attributes.includes('xml:lang') && options.attributes.includes('lang') && hasValue(virtualNode.attr('xml:lang')) && !hasValue(virtualNode.attr('lang')) && !xhtml2) {
        this.data({
          messageKey: 'noXHTML'
        });
        return false;
      }
      var hasLang = options.attributes.some(function(name) {
        return hasValue(virtualNode.attr(name));
      });
      if (!hasLang) {
        this.data({
          messageKey: 'noLang'
        });
        return false;
      }
      return true;
    }
    var has_lang_evaluate_default = hasLangEvaluate;
    function validLangEvaluate(node, options, virtualNode) {
      var invalid = [];
      options.attributes.forEach(function(langAttr) {
        var langVal = virtualNode.attr(langAttr);
        if (typeof langVal !== 'string') {
          return;
        }
        var baselangVal = get_base_lang_default(langVal);
        var invalidLang = options.value ? !options.value.map(get_base_lang_default).includes(baselangVal) : !valid_langs_default(baselangVal);
        if (baselangVal !== '' && invalidLang || langVal !== '' && !sanitize_default(langVal)) {
          invalid.push(langAttr + '="' + virtualNode.attr(langAttr) + '"');
        }
      });
      if (!invalid.length) {
        return false;
      }
      if (virtualNode.props.nodeName !== 'html' && !_hasLangText(virtualNode)) {
        return false;
      }
      this.data(invalid);
      return true;
    }
    var valid_lang_evaluate_default = validLangEvaluate;
    function xmlLangMismatchEvaluate(node, options, vNode) {
      var primaryLangValue = get_base_lang_default(vNode.attr('lang'));
      var primaryXmlLangValue = get_base_lang_default(vNode.attr('xml:lang'));
      return primaryLangValue === primaryXmlLangValue;
    }
    var xml_lang_mismatch_evaluate_default = xmlLangMismatchEvaluate;
    function dlitemEvaluate(node) {
      var parent = get_composed_parent_default(node);
      var parentTagName = parent.nodeName.toUpperCase();
      var parentRole = get_explicit_role_default(parent);
      if (parentTagName === 'DIV' && [ 'presentation', 'none', null ].includes(parentRole)) {
        parent = get_composed_parent_default(parent);
        parentTagName = parent.nodeName.toUpperCase();
        parentRole = get_explicit_role_default(parent);
      }
      if (parentTagName !== 'DL') {
        return false;
      }
      if (!parentRole || [ 'presentation', 'none', 'list' ].includes(parentRole)) {
        return true;
      }
      return false;
    }
    var dlitem_evaluate_default = dlitemEvaluate;
    function invalidChildrenEvaluate(node) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var virtualNode = arguments.length > 2 ? arguments[2] : undefined;
      var relatedNodes = [];
      var issues = [];
      if (!virtualNode.children) {
        return void 0;
      }
      var vChildren = mapWithNested(virtualNode.children);
      while (vChildren.length) {
        var _vChild$actualNode;
        var _vChildren$shift = vChildren.shift(), vChild = _vChildren$shift.vChild, nested = _vChildren$shift.nested;
        if (options.divGroups && !nested && isDivGroup(vChild)) {
          if (!vChild.children) {
            return void 0;
          }
          var vGrandChildren = mapWithNested(vChild.children, true);
          vChildren.push.apply(vChildren, _toConsumableArray(vGrandChildren));
          continue;
        }
        var issue = getInvalidSelector(vChild, nested, options);
        if (!issue) {
          continue;
        }
        if (!issues.includes(issue)) {
          issues.push(issue);
        }
        if ((vChild === null || vChild === void 0 ? void 0 : (_vChild$actualNode = vChild.actualNode) === null || _vChild$actualNode === void 0 ? void 0 : _vChild$actualNode.nodeType) === 1) {
          relatedNodes.push(vChild.actualNode);
        }
      }
      if (issues.length === 0) {
        return false;
      }
      this.data({
        values: issues.join(', ')
      });
      this.relatedNodes(relatedNodes);
      return true;
    }
    function getInvalidSelector(vChild, nested, _ref90) {
      var _ref90$validRoles = _ref90.validRoles, validRoles = _ref90$validRoles === void 0 ? [] : _ref90$validRoles, _ref90$validNodeNames = _ref90.validNodeNames, validNodeNames = _ref90$validNodeNames === void 0 ? [] : _ref90$validNodeNames;
      var _vChild$props = vChild.props, nodeName2 = _vChild$props.nodeName, nodeType = _vChild$props.nodeType, nodeValue = _vChild$props.nodeValue;
      var selector = nested ? 'div > ' : '';
      if (nodeType === 3 && nodeValue.trim() !== '') {
        return selector + '#text';
      }
      if (nodeType !== 1 || !_isVisibleToScreenReaders(vChild)) {
        return false;
      }
      var role = get_explicit_role_default(vChild);
      if (role) {
        return validRoles.includes(role) ? false : selector + '[role='.concat(role, ']');
      } else {
        return validNodeNames.includes(nodeName2) ? false : selector + nodeName2;
      }
    }
    function isDivGroup(vNode) {
      return vNode.props.nodeName === 'div' && get_explicit_role_default(vNode) === null;
    }
    function mapWithNested(vNodes) {
      var nested = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return vNodes.map(function(vChild) {
        return {
          vChild: vChild,
          nested: nested
        };
      });
    }
    function listitemEvaluate(node, options, virtualNode) {
      var parent = virtualNode.parent;
      if (!parent) {
        return void 0;
      }
      var parentNodeName = parent.props.nodeName;
      var parentRole = get_explicit_role_default(parent);
      if ([ 'presentation', 'none', 'list' ].includes(parentRole)) {
        return true;
      }
      if (parentRole && is_valid_role_default(parentRole)) {
        this.data({
          messageKey: 'roleNotValid'
        });
        return false;
      }
      return [ 'ul', 'ol', 'menu' ].includes(parentNodeName);
    }
    function onlyDlitemsEvaluate(node, options, virtualNode) {
      var ALLOWED_ROLES = [ 'definition', 'term', 'list' ];
      var base = {
        badNodes: [],
        hasNonEmptyTextNode: false
      };
      var content = virtualNode.children.reduce(function(content2, child) {
        var actualNode = child.actualNode;
        if (actualNode.nodeName.toUpperCase() === 'DIV' && get_role_default(actualNode) === null) {
          return content2.concat(child.children);
        }
        return content2.concat(child);
      }, []);
      var result = content.reduce(function(out, childNode) {
        var actualNode = childNode.actualNode;
        var tagName = actualNode.nodeName.toUpperCase();
        if (actualNode.nodeType === 1 && _isVisibleToScreenReaders(actualNode)) {
          var explicitRole2 = get_explicit_role_default(actualNode);
          if (tagName !== 'DT' && tagName !== 'DD' || explicitRole2) {
            if (!ALLOWED_ROLES.includes(explicitRole2)) {
              out.badNodes.push(actualNode);
            }
          }
        } else if (actualNode.nodeType === 3 && actualNode.nodeValue.trim() !== '') {
          out.hasNonEmptyTextNode = true;
        }
        return out;
      }, base);
      if (result.badNodes.length) {
        this.relatedNodes(result.badNodes);
      }
      return !!result.badNodes.length || result.hasNonEmptyTextNode;
    }
    var only_dlitems_evaluate_default = onlyDlitemsEvaluate;
    function onlyListitemsEvaluate(node, options, virtualNode) {
      var hasNonEmptyTextNode = false;
      var atLeastOneListitem = false;
      var isEmpty = true;
      var badNodes = [];
      var badRoleNodes = [];
      var badRoles = [];
      virtualNode.children.forEach(function(vNode) {
        var actualNode = vNode.actualNode;
        if (actualNode.nodeType === 3 && actualNode.nodeValue.trim() !== '') {
          hasNonEmptyTextNode = true;
          return;
        }
        if (actualNode.nodeType !== 1 || !_isVisibleToScreenReaders(actualNode)) {
          return;
        }
        isEmpty = false;
        var isLi = actualNode.nodeName.toUpperCase() === 'LI';
        var role = get_role_default(vNode);
        var isListItemRole = role === 'listitem';
        if (!isLi && !isListItemRole) {
          badNodes.push(actualNode);
        }
        if (isLi && !isListItemRole) {
          badRoleNodes.push(actualNode);
          if (!badRoles.includes(role)) {
            badRoles.push(role);
          }
        }
        if (isListItemRole) {
          atLeastOneListitem = true;
        }
      });
      if (hasNonEmptyTextNode || badNodes.length) {
        this.relatedNodes(badNodes);
        return true;
      }
      if (isEmpty || atLeastOneListitem) {
        return false;
      }
      this.relatedNodes(badRoleNodes);
      this.data({
        messageKey: 'roleNotValid',
        roles: badRoles.join(', ')
      });
      return true;
    }
    var only_listitems_evaluate_default = onlyListitemsEvaluate;
    function structuredDlitemsEvaluate(node, options, virtualNode) {
      var children = virtualNode.children;
      if (!children || !children.length) {
        return false;
      }
      var hasDt = false, hasDd = false, nodeName2;
      for (var i = 0; i < children.length; i++) {
        nodeName2 = children[i].props.nodeName.toUpperCase();
        if (nodeName2 === 'DT') {
          hasDt = true;
        }
        if (hasDt && nodeName2 === 'DD') {
          return false;
        }
        if (nodeName2 === 'DD') {
          hasDd = true;
        }
      }
      return hasDt || hasDd;
    }
    var structured_dlitems_evaluate_default = structuredDlitemsEvaluate;
    function captionEvaluate(node, options, virtualNode) {
      var tracks = query_selector_all_default(virtualNode, 'track');
      var hasCaptions = tracks.some(function(vNode) {
        return (vNode.attr('kind') || '').toLowerCase() === 'captions';
      });
      return hasCaptions ? false : void 0;
    }
    var caption_evaluate_default = captionEvaluate;
    var joinStr = ' > ';
    function frameTestedAfter(results) {
      var iframes = {};
      return results.filter(function(result) {
        var frameResult = result.node.ancestry[result.node.ancestry.length - 1] !== 'html';
        if (frameResult) {
          var ancestry2 = result.node.ancestry.flat(Infinity).join(joinStr);
          iframes[ancestry2] = result;
          return true;
        }
        var ancestry = result.node.ancestry.slice(0, result.node.ancestry.length - 1).flat(Infinity).join(joinStr);
        if (iframes[ancestry]) {
          iframes[ancestry].result = true;
        }
        return false;
      });
    }
    var frame_tested_after_default = frameTestedAfter;
    function frameTestedEvaluate(node, options) {
      return options.isViolation ? false : void 0;
    }
    var frame_tested_evaluate_default = frameTestedEvaluate;
    function noAutoplayAudioEvaluate(node, options) {
      if (!node.duration) {
        console.warn('axe.utils.preloadMedia did not load metadata');
        return void 0;
      }
      var _options$allowedDurat = options.allowedDuration, allowedDuration = _options$allowedDurat === void 0 ? 3 : _options$allowedDurat;
      var playableDuration = getPlayableDuration(node);
      if (playableDuration <= allowedDuration && !node.hasAttribute('loop')) {
        return true;
      }
      if (!node.hasAttribute('controls')) {
        return false;
      }
      return true;
      function getPlayableDuration(elm) {
        if (!elm.currentSrc) {
          return 0;
        }
        var playbackRange = getPlaybackRange(elm.currentSrc);
        if (!playbackRange) {
          return Math.abs(elm.duration - (elm.currentTime || 0));
        }
        if (playbackRange.length === 1) {
          return Math.abs(elm.duration - playbackRange[0]);
        }
        return Math.abs(playbackRange[1] - playbackRange[0]);
      }
      function getPlaybackRange(src) {
        var match = src.match(/#t=(.*)/);
        if (!match) {
          return;
        }
        var _match = _slicedToArray(match, 2), value = _match[1];
        var ranges = value.split(',');
        return ranges.map(function(range) {
          if (/:/.test(range)) {
            return convertHourMinSecToSeconds(range);
          }
          return parseFloat(range);
        });
      }
      function convertHourMinSecToSeconds(hhMmSs) {
        var parts = hhMmSs.split(':');
        var secs = 0;
        var mins = 1;
        while (parts.length > 0) {
          secs += mins * parseInt(parts.pop(), 10);
          mins *= 60;
        }
        return parseFloat(secs);
      }
    }
    var no_autoplay_audio_evaluate_default = noAutoplayAudioEvaluate;
    function cssOrientationLockEvaluate(node, options, virtualNode, context) {
      var _ref91 = context || {}, _ref91$cssom = _ref91.cssom, cssom = _ref91$cssom === void 0 ? void 0 : _ref91$cssom;
      var _ref92 = options || {}, _ref92$degreeThreshol = _ref92.degreeThreshold, degreeThreshold = _ref92$degreeThreshol === void 0 ? 0 : _ref92$degreeThreshol;
      if (!cssom || !cssom.length) {
        return void 0;
      }
      var isLocked = false;
      var relatedElements = [];
      var rulesGroupByDocumentFragment = groupCssomByDocument(cssom);
      var _loop7 = function _loop7() {
        var key = _Object$keys2[_i27];
        var _rulesGroupByDocument = rulesGroupByDocumentFragment[key], root = _rulesGroupByDocument.root, rules = _rulesGroupByDocument.rules;
        var orientationRules = rules.filter(isMediaRuleWithOrientation);
        if (!orientationRules.length) {
          return 'continue';
        }
        orientationRules.forEach(function(_ref93) {
          var cssRules = _ref93.cssRules;
          Array.from(cssRules).forEach(function(cssRule) {
            var locked = getIsOrientationLocked(cssRule);
            if (locked && cssRule.selectorText.toUpperCase() !== 'HTML') {
              var elms = Array.from(root.querySelectorAll(cssRule.selectorText)) || [];
              relatedElements = relatedElements.concat(elms);
            }
            isLocked = isLocked || locked;
          });
        });
      };
      for (var _i27 = 0, _Object$keys2 = Object.keys(rulesGroupByDocumentFragment); _i27 < _Object$keys2.length; _i27++) {
        var _ret4 = _loop7();
        if (_ret4 === 'continue') {
          continue;
        }
      }
      if (!isLocked) {
        return true;
      }
      if (relatedElements.length) {
        this.relatedNodes(relatedElements);
      }
      return false;
      function groupCssomByDocument(cssObjectModel) {
        return cssObjectModel.reduce(function(out, _ref94) {
          var sheet = _ref94.sheet, root = _ref94.root, sha