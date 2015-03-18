app.directive('preorderSection', function(analytics) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/preorderSection.html',
		replace: true,
		scope: {
			location: '@location'
		},
		controller: function($scope, $element) {
			$scope.preorderLink = 'http://godhatesgames.myshopify.com/cart/1051755037:1?source_app=shopify-widget?referer=https%3A%2F%2Fgodhatescharades.com';
			$scope.onPreorderClicked = function _onPreorderClicked(button) {
				analytics.mpEvent('Click', {
					'Location': $scope.location,
					'Button': button
				});
			}
		}
	}
});