'use strict';
app.directive('card', function() {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/card.html',
		replace: true,
		scope: {
			suggestion: '=',
			domain: '='
		}
	};
});