angular.module('ngContent', [])
.directive('ngContent', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.$watch(attrs.ngContent, function(newValue) {
				if (newValue) {
					element.attr('content', newValue);
				} else {
					var defaultContent = scope.$eval(attrs.ngContentDefault);
					if (defaultContent) {
						element.attr('content', defaultContent);
					} else {
						element.removeAttr('content');
					}
				}
			});
		}
	}
});