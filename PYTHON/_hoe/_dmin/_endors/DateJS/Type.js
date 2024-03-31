butes['Ascender'] || 0);
	      this.decender = +(this.attributes['Descender'] || 0);
	      this.lineGap = (this.bbox[3] - this.bbox[1]) - (this.ascender - this.decender);
	    }

	    AFMFont.prototype.parse = function() {
	      var a, key, 