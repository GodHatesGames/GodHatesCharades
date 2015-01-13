'use strict';
app.directive('debug', function() {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/debug.html',
		replace: true,
		scope: {
			suggestion: '=',
			domain: '='
		}
	};
});