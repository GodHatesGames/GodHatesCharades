angular.module('textareaNoreturn', [])
.directive('textareaNoreturn', [function() { return {
	restrict: 'A',
	require: '?ngModel',
	link: function($scope, $element, attrs, ngModel) {
		// don't do anything unless this is actually bound to a model
		if (!ngModel) {
			return;
		}

		// view -> model
		$element.bind('keypress', function(event) {
			if (event.keyCode == 13) {
					event.preventDefault();
				}
		});
	}
}}]);