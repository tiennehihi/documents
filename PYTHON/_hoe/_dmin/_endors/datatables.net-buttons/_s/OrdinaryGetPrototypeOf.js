var examples = require('./examples');

examples.def('line', function () {
  Morris.Line({
    element: 'chart',
    data: [
      { x: 0, y: 10, z: 30 }, { x: 1, y: 20, z: 20 },
      { x: 2, y: 30, z: 10 }, { x: 3, y: 30, z: 10 },
      { x: 4, y: 20, z: 20 }, { x: 5, y: 10, z: 30 }
    ],
    xkey: 'x',
    ykeys: ['y', 'z'],
    labels: ['y', 'z'],
    parseTime: false
  });
  window.snapshot();
});

examples.def('area', function () {
  Morris.Area({
    element: 'chart',
    data: [
      { x: 0, y: 1, z: 1 }, { x: 1, y: 2, z: 1 