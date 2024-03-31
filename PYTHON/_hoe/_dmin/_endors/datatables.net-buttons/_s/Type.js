   }
	      if (x != null) {
	        this.x = x;
	      }
	      if (y != null) {
	        this.y = y;
	      }
	      if (options.lineBreak !== false) {
	        margins = this.page.margins;
	        if (options.width == null) {
	          options.width = this.page.width - this.x - margins.righ