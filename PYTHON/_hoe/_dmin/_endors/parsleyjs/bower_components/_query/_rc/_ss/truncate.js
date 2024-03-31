ction(doc, a) {
	        if (px === null) {
	          px = cx;
	          py = cy;
	        }
	        doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), a[0], a[1], a[2], a[3]);
	        px = a[0];
	        py = a[1];
	        cx = a[2];
	        return cy = a[3];
	      },
	      s: function(doc, a) {
	        if (px === null) {
	          px = cx;
	          py = cy;
	        }
	        doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), cx + a[0], cy + a[1], cx + a[2], cy + a[3]);
	        px = cx + a[