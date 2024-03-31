(function (angular) {

	'use strict';

	return angular.module('easypiechart', [])

		.directive('easypiechart', [function() {
			return {
				restrict: 'A',
				require: '?ngModel',
				scope: {
					percent: '=',
					options: '='
				},
				link: function (scope, element, attrs) {

					scope.percent = scope.percent || 0;

					/**
					 * default easy pie chart options
					 * @type {Object}
					 */
					var options = {
						barColor: '#ef1e25',
						trackColor: '#f9f9f9',
						scaleColor: '#dfe0e0',
						scaleLength: 5,
						lineCap: 'round',
						lineWidth: 3,
						size: 110,
						rotate: 0,
						animate: {
							duration: 1000,
							enabled: true
						}
					};
					scope.options = angular.extend(options, scope.options);

					var pieChart = new EasyPieChart(element[0], options);

					scope.$watch('percent', function(newVal, oldVal) {
						pieChart.update(newVal);
					});
				}
			};
		}]);

})(angular);                                                                                    0.0058,"96":0.00116,"97":0.01276,"98":0.00232,"99":0.00696,"100":0.00348,"101":0.00116,"102":0.01624,"103":0.06844,"104":0.00232,"105":0.01392,"106":0.00696,"107":0.0348,"108":0.00696,"109":0.39788,"110":0.00696,"111":0.03712,"112":0.00928,"113":0.02436,"114":0.03828,"115":0.03364,"116":0.03248,"117":0.08352,"118":0.04292,"119":0.97788,"120":1.30732,"121":0.0058,_:"4 5 6 7 8 9 10 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 36 37 38 39 40 41 45 46 47 48 50 51 53 54 55 57 59 60 61 62 65 71 89 122 123"},F:{"79":0.00116,"82":0.00464,"95":0.01624,"102":0.00116,"103":0.00116,"1