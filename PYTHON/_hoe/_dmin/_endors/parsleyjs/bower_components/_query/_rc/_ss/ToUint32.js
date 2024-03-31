	  applyMargins(function() {
	    var absPosition = node.absolutePosition;
	    if(absPosition){
	      self.writer.context().beginDetachedBlock();
	      self.writer.context().moveTo(absPosition.x || 0, absPosition.y || 0);
	    }

	    if (node.stack) {
	      self.processVerticalContainer(node);
	    } else if (node.columns) {
	      self.processColumns(node);
	    } else if (node.ul) {
	      self.processList(false, node);
	    } else if (node.ol) {
	      self.processList(true, node);
	    } else if (node.table) {
	      self.processTable(node);
	    } else if (node.text !== 