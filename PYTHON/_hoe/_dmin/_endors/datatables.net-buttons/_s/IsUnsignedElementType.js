../moment')) :
   typeof define === 'function' && define.amd ? define(['../../moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';

    function each(array, callback) {
        var i;
        for (i = 0; i < array.length; i++) {
 