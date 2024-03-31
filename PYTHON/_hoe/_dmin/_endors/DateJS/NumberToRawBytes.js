<!doctype html>
<head>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js"></script>
  <script src="../morris.js"></script>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/prettify/r224/prettify.min.js"></script>
  <script src="lib/example.js"></script>
  <link rel="stylesheet" href="lib/example.css">
  <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/prettify/r224/prettify.min.css">
  <link rel="stylesheet" href="../morris.css">
</head>
<body>
<h1>Negative values</h1>
<div id="graph"></div>
<pre id="code" class="prettyprint linenums">
var neg_data = [
  {"period": "2011-08-12", "a": 100},
  {"period": "2011-03-03", "a": 75},
  {"period": "2010-08-08", "a": 50},
  {"period": "2010-05-10", "a": 25},
  {"period": "2010-03-14", "a": 0},
  {"period": "2010-01-10", "a": -25},
  {"period": "2009-12-10", "a": -50},
  {"period": "2009-10-07", "a": -75},
  {"period": "2009-09-25", "a": -100}
];
Morris.Line({
  element: 'graph',
  data: neg_data,
  xkey: 'period',
  ykeys: ['a'],
  labels: ['Series A'],
  units: '%'
});
</pre>
</body>
                                                                                                                                                                                                                                                                                                                                                              �1ұ',��M��:�Ǻm-����������,.g
�r��uڋv�±m�� ����ŗ�vr:�ȿ�����*����5�h�Y0oe�]�9gYU�fY�o��?�
[ZG2w��$H��V��0��p�A*��g��'ܓ�T&�0T:��޼h�,�T��pP���O�rRg�چG�����KX������̨�/j����	�e<R����3g�7��$!�z��ꭨ��}��/+K���bR�K�~%:�K׳�>�WO�7U���ӷ��l�<���H�����x4??�}��Rp�6У�Q�#j�Ni"�T�-�H��! ���m����������-��[�k�_�����ܳ����5�1Cs�w�ðv�P�İ"wh,:*k�q������뢻"ELn�ac&�~��λ��PO6�6x�Ặ���R���Wp%UR?����weqF9/O<J�	fP�·IާFSf&����E,~�