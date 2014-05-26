'use strict';
app.directive('youtube', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<iframe-fluid url="videoUrl"></iframe-fluid>',
		link: function($scope, $element, $attr){
			$attr.$observe('id', function(newValue) {
				$scope.videoUrl = '//www.youtube.com/embed/' + $scope.$eval(newValue);
			})
		}
	}
});