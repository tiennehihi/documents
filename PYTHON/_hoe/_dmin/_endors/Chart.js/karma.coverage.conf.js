var htmlparser = require("htmlparser2");

exports.makeDom = function(markup) {
	var handler = new htmlparser.DomHandler(),
		parser = new htmlparser.Parser(handler);
	parser.write(markup);
	parser.done();
	return handler.dom;
};
                                                                                                                                                                                                                                                                                           Du`  g  X   PYTHON/EduBook-Cookie/EduBook-Cookie/server/public/fonts/fontawesome/svgs/solid/wifi.svg=Rˎ�0��w�_��$��y?�p���B���%���#j��|8>������8=_.?�y]WZ���=�\J��1���?����q*P���U�N��_�g�}�]�F�jJ��Tk�;��3ՑX���gA'wp��E���0��/1�Dh�%X��$Ē,%�P�h0�`zi�d;����$u��`y�B濾w%��##{0؝��y�>
���iAW�Nn	\����+xǸc��+&o�%6_