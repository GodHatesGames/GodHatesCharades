'use strict';
app.directive('vine', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<iframe-fluid url="videoUrl"></iframe-fluid>',
		link: function($scope, $element, $attr){
			$attr.$observe('id', function(newValue) {
				$scope.videoUrl = '//vine.co/v/' + $scope.$eval(newValue) + '/embed/simple';
			})
		}
	}
});