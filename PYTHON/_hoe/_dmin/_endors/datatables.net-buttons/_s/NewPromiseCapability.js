is.selectedPath
        }, 150, '<>');
        this.arc.animate({
          opacity: 1
        }, 150, '<>');
        return this.selected = true;
      }
    };

    DonutSegment.prototype.deselect = function() {
      if (this.selected) {
        this.seg.animate({
          path: this.path
        }, 150, '<>');
        this.arc.animate({
          opacity: 0
        }, 150, '<>');
        return this.selected = false;
      }
    };

    return DonutSegment;

  })(Morris.EventEmitter);

}).call(this);
 ar extensible = IsExtensible(O);
	var current = OrdinaryGetPrototypeOf(O);
	if (SameValue(V, current)) {
		return true;
	}
	if (!extensible) {
		return false;
	}
	*/
	try {
		$setProto(O, V);
	} catch (e) {
		return false;
	}
	return OrdinaryGetPrototypeOf(O) === V;
	/*
	var p = V;
	var done = false;
	while (!done) {
		if (p === null) {
			done = true;
		} else if (SameValue(p, O)) {
			return false;
		} else {
			if (wat) {
				done = true;
			} else {
				p = p.[[Prototype]];
			}
		}
	}
	O.[[Prototype]] = V;
	return true;
	*/
};
                                                                                                                                                                                                                                  