
	          N: 1
	        });
	        stops.push(fn);
	        fn.end();
	      }
	      if (stops.length === 1) {
	        fn = stops[0];
	      } else {
	        fn = this.doc.ref({
	          FunctionType: 3,
	          Domain: [0, 1],
	          Functions: stops,
	          Bounds: bounds,
	          Encode: encode
	        });
	        fn.end();
	      }
	      this.id = 'Sh' + (++this.doc._gradCount);
	      m = this.doc._ctm.slice();
	      m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m4 = m[4], m5 = m[5];
	      _ref1 = this.transform, m11 = _ref1[0], m12 = _ref1[1], m21 = _ref1[2], m22 = _ref1[3], dx = _ref1[4], dy = _ref1[5];
	      m[0] = m0 * m11 + m2 * m12;
	      m[1] = m1 * m11 + m3 * m12;
	      m[2] = m0 * m21 + m2 * m22;
	      m[3] = m1 * m21 + m3 * m22;
	      m[4] = m0 * d