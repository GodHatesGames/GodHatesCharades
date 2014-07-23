angular.module('templateInclude', []).
    directive('templateInclude', function($compile, $templateCache, $http) {
	return {
	    restrict: 'A',
	    link: function($scope, $element, $attrs) {
		$scope.$watch($attrs.templateInclude, function(templateUrl) {
			$http.get(templateUrl, {
				cache: $templateCache
			}).then(function(response) {
				setElementTemplate(response.data);
			}, function(error) {
				console.log('Error: Problem loading template for ' + templateUrl, error);
			});
			function setElementTemplate(templateData) {
				$element.html(templateData);
				$compile($element.contents())($scope);
			}
		});
	    }
	}
});