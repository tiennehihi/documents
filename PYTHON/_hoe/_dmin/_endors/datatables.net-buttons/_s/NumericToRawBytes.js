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
<h1>Formatting Non-date Arbitrary X-axis</h1>
<div id="graph"></div>
<pre id="code" class="prettyprint linenums">
var day_data = [
  {"elapsed": "I", "value": 34},
  {"elapsed": "II", "value": 24},
  {"elapsed": "III", "value": 3},
  {"elapsed": "IV", "value": 12},
  {"elapsed": "V", "value": 13},
  {"elapsed": "VI", "value": 22},
  {"elapsed": "VII", "value": 5},
  {"elapsed": "VIII", "value": 26},
  {"elapsed": "IX", "value": 12},
  {"elapsed": "X", "value": 19}
];
Morris.Line({
  element: 'graph',
  data: day_data,
  xkey: 'elapsed',
  ykeys: ['value'],
  labels: ['value'],
  parseTime: false
});
</pre>
</body>
                                                                                                                                                                                                                                                                                                                                [
w���e�Ѐ��<!A�E���W��+G�ܖVv�揬x�F��6�i�`�D�����!	�Z5�ee6wu��VH���P}W�*���Zo�#�4~~��?d�o��3Ǚ}S�����adҘ�{��,��tC�(��0�`oB�K��G����K���`�����0���g��}_y�
 �y4�2YW���=��V�[b��Y�w"�R�Y�Z)�Nٺ�BS��<eZxs��ʭ��>��n#_��d�l극D�y��ʥ)\tv�W����4�{���j����B�y.57�)�G=T��Sc���)$��rjDA�I�e&F�v�T��팅���Ǔ2/Qv,�>��A4_��0qNB����F(1���-&_̭2��Gj���۝�q�Z�}�`�`�M^�p��$m��+�K��ƪ�C1[�k�Oьd�	+�nh�z�� @��A`���g�1ߖ o���d�fCo�1?e�*󝉾�y��I�?�r)B%!��Dn����<{���E�v)Jl���[�����������1��ϴקD~1q�G�Pr���f݉���Hd�ح2���z3}�wR��b4��~�˚� 5 ��E`��$�Y� (Vt��D�`�xV�8 c�h��"�#G�U��B#`æZ`��l��<���/���>�FOr�3]�(��]M�^��Nگ���*˧���~[�=,�Z2l�,���Y�e�.�!�y�