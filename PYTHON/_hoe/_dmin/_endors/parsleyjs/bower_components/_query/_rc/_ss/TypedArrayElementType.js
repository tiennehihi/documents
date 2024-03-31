);
	        colors = 4;
	        alpha = true;
	      }
	      data = (imageData != null ? imageData.data : void 0) || imageData;
	      length = data.length;
	      input = palette || pixels;
	      i = j = 0;
	      if (colors === 1) {
	        while (i < length) {
	          k = palette ? pixels[i / 4] * 4 : j;
	          v = input[k++];
	          data[i++] = v;
	          data[i++] = v;
	          data[i++] = v;
	          data[i++] = alpha ? input[k++] : 255;
	          j = k;
	        }
	      } else {
	        while (i < length) {
	          k = palette ? pixels[i / 4] * 4 : j;
	          data[i++] = input[k++];
	          data[i++] = input[k++];
	          data[i++] = input[k++];
	          data[i++] = alpha ? input[k++] : 255;
	          j = k;
	        }
	      }
	    };

	    PNG.prototype.decode = function(fn) {
	      var ret,
	        _this = this;
	      ret = new Buffer(this.width * this.height * 4);
	      return this.decodePixels(f