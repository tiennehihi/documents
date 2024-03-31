describe 'Morris.Line', ->

  it 'should raise an error when the placeholder element is not found', ->
    my_data = [{x: 1, y: 1}, {x: 2, y: 2}]
    fn = ->
      Morris.Line(
        element: "thisplacedoesnotexist"
        data: my_data
        xkey: 'x'
        ykeys: ['y']
        labels: ['dontcare']
      )
    fn.should.throw(/Graph container element not found/)

  it 'should make point styles customizable', ->
    my_data = [{x: 1, y: 1}, {x: 2, y: 2}]
    red = '#ff0000'
    blue = '#0000ff'
    chart = Morris.Line
      element: 'graph'
      data: my_data
      xkey: 'x'
      ykeys: ['y']
      labels: ['dontcare']
      pointStrokeColors: [red, blue]
      pointStrokeWidths: [1, 2]
      pointFillColors: [null, red]
    chart.pointStrokeWidthForSeries(0).should.equal 1
    chart.pointStrokeColorForSeries(0).should.equal red
    chart.pointStrokeWidthForSeries(1).should.equal 2
    chart.pointStrokeColorForSeries(1).should.equal blue
    chart.colorFor(chart.data[0], 0, 'point').should.equal chart.colorFor(chart.data[0], 0, 'line')
    chart.colorFor(chart.data[1], 1, 'point').should.equal red

  describe 'generating column labels', ->

    it 'should use user-supplied x value strings by default', 