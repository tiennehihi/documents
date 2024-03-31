describe 'Morris.Grid#yLabelFormat', ->

  it 'should use custom formatter for y labels', ->
    formatter = (label) ->
      flabel = parseFloat(label) / 1000
      "#{flabel.toFixed(1)}k"
    line = Morris.Line
      element: 'graph'
      data: [{x: 1, y: 1500}, {x: 2, y: 2500}]
      xkey: 'x'
      ykeys: ['y']
      labels: ['dontcare']
      preUnits: "$"
      yLabelFormat: formatter
    line.yLabelFormat(1500).should.equal "1.5k"
                                                                     �����pK
>��q��$[�������VV]p9)� j'co�f�M*��A�\��������v	W<,]H�|N#���>����j{�A�x���5�Wk�����+a/B����O���%�N��w�ew�t�Y�����z�����0N��D��>A��l��s(��b�a���[�7´�ؿ�CT���":�_k�l�y�2}qP����W���	�̕������nmHF�i������=�C�g/ծLޣ��)0��εZ�u���W��,�� (�HA���[yU���BR���w�z���܌�d)$*ƭ.��?p5D{j��`煳~���?�	�{@'D��(�`�!#�r�����S���{#�P\\���X���� ��L�#��[%A)*�!f���li�u
 ��X;��� P��>��uT1�Nz6#�<��?���Ri��=4/�4D�Q'�"�v  ���c�{/|�|�9��c�^!�,��P���ʼ�ޗՓ8��D��`+�?��9�����Җ��49�k�ݬc���lj�eA9T��~�x�\o���$&.�6���,��Ǘ.�_��s��-FO�j��7�υ�|�{�o� �~~qO~1<�Sv��T�
��1~��Ф.�!t�({��v+�}(	��4��-7�TQ?^  E鋜�h��Xc�,Ow�v�Qp�,%�7U��x���/N����t-N�����~�֏���"k�ba~���y