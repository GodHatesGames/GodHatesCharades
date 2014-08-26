'use strict';
app.directive('vine', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<iframe-fluid></iframe-fluid>',
		link: function($scope, $element, $attr){
			$attr.$observe('id', function(newValue) {
				var videoUrl = '//vine.co/v/' + $scope.$eval(newValue) + '/embed/simple';
				$attr.set('url', videoUrl);
			})
		}
	}
});