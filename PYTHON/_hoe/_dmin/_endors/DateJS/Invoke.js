//! moment.js locale configuration
//! locale : modern greek (el)
//! author : Aggelos Karalias : https://github.com/mehiel

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }


    var el = moment.defineLocale('el', {
        monthsNominativeEl : 'Ιανουάριος_Φεβρουάριος_Μάρ