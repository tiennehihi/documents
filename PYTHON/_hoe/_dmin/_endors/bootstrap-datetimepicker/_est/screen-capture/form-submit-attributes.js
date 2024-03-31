# easyPieChart

> Lightweight plugin to render simple, animated and retina optimized pie charts

![Version](http://img.shields.io/version/2.1.6.png?color=green)
[![Build Status](https://travis-ci.org/rendro/easy-pie-chart.png)](https://travis-ci.org/rendro/easy-pie-chart)
[![Dependencies Status](https://david-dm.org/rendro/easy-pie-chart/dev-status.png)](https://david-dm.org/rendro/easy-pie-chart)
[![Analytics](https://ga-beacon.appspot.com/UA-46840672-1/easy-pie-chart/readme)](https://github.com/igrigorik/ga-beacon)



## Features
[![](https://github.com/rendro/easy-pie-chart/raw/master/demo/img/easy-pie-chart.png)](http://drbl.in/ezuc)

* highly customizable
* very easy to implement
* resolution independent (retina optimized)
* uses `requestAnimationFrame` for smooth animations on modern devices and
* works in all modern browsers, even in IE7+ with [excanvas](https://code.google.com/p/explorercanvas/wiki/Instructions)

#### framework support

* Vanilla JS *(no dependencies)* (~872 bytes)
* jQuery plugin (~921 bytes)
* Angular Module (~983 bytes)



## Get started
#### Installation

You can also use [bower](http://bower.io) to install the component:

```
$ bower install jquery.easy-pie-chart
```

#### jQuery

To use the easy pie chart plugin you need to load the current version of jQuery (> 1.6.4) and the source of the plugin.

```html
<div class="chart" data-percent="73" data-scale-color="#ffb400">73%</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="/path/to/jquery.easy-pie-chart.js"></script>
<script>
    $(function() {
        $('.chart').easyPieChart({
            //your o