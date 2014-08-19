'use strict';
app.directive('nav', function(parseUser, $uiViewScroll, $state, $timeout) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/nav.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			$scope.parseUser = parseUser;
			$scope.$state = $state;

			$scope.launchAd = function() {
				$scope.jumpToElementInView('email_signup', 'home');
				ga('send', 'event', 'signup', 'click', 'nav_ad');

				// $scope.jumpToElementInView('ipad_ad', 'home');
				// ga('send', 'event', 'ipad', 'click', 'ipad_ad');
			};

			$scope.jumpToElementInView = function(id, location) {
				// var selector = '#' + id;

				// attempt to switch pages if needed, then jump
				if(!$state.includes(location)) {
					$state.go(location)
					.then(function jumpLater() {
						//wait for page to render
						$timeout(function() {
							jumpIfFound(id);
						}, 300);
					});
				} else {
					jumpIfFound(id);
				}

				function jumpIfFound(id) {
					var element = angular.element(document.getElementById(id));
					if (element.length > 0) {
						$uiViewScroll(element);
						element.addClass('animated pulse infinite');
						// $timeout(function() {
						// 	element.removeClass('animated pulse');
						// }, 1000);
					} else {
						return false;
					}
				}
			};
		}
	};
});