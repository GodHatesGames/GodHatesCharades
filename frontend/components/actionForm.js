'use strict';
app.directive('actionForm', function($timeout) {
	return {
		restrict: 'A',
		replace: false,
		link: function(scope, element, attr) {
			var formElement = angular.element(element);
			formElement.bind('submit', onSubmit);
			formElement.on('$destroy', function() {
				$timeout(function() {
					formElement.unbind('submit', onSubmit);
				}, 0, false);
			});

			function onSubmit() {
				scope.$eval(attr.actionForm);
				scope.$digest();
			}
		}
	};
});