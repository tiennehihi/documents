class Morris.Area extends Morris.Line
  # Initialise
  #
  areaDefaults = 
    fillOpacity: 'auto'
    behaveLikeLine: false

  constructor: (options) ->
    return new Morris.Area(options) unless (@ instanceof Morris.Area)
    areaOptions = $.extend {}, areaDefaults, options

    @cumulative = not areaOptions.behaveLikeLine

    if areaOptions.fillOpacity is 'auto'
      areaOptions.fillOpacity = if areaOptions.behaveLikeLine then .8 else 1

    super(areaOptions)

  # calculate series data point coordinates
  #
  # @private
  calcPoints: ->
    for row in @data
      row._x = @transX(row.x)
      total = 0
      row._y = for y in row.y
        if @options.behaveLikeLine
          @transY(y)
        else
          total += (y || 0)
          @transY(total)
      row._ymax = Math.max row._y...

  # draw the data series
  #
  # @private
  drawSeries: ->
    @seriesPoints = []
    if @options.behaveLikeLine
      range = [0..@options.ykeys.length-1]
    else
      range = [@options.ykeys.length-1..0]

    for i in range
      @_drawFillFor i
      @_drawLineFor i
      @_drawPointFor i

  _drawFillFor: (index) ->
    path = @paths[index]
    if path isnt null
      path = path + "L#{@transX(@xmax)},#{@bottom}L#{@transX(@xmin)},#{@bottom}Z"
      @drawFilledPath path, @fillForSeries(index)

  fill