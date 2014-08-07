'use strict';
app.directive('socialUnlock', function($window) {
	return {
		restrict: 'E',
		templateUrl: 'components/socialUnlock.html',
		scope: {
			title: '@title',
			message: '@message',
			downloadUrl: '@download',
			campaignName: '@campaign',
			imgUrl: '@image'
		},
		controller: function($scope, $element) {
			$scope.sharingConfig = {
				title: $scope.message
			};
			$scope.shared = hasShared($scope.campaignName);

			addthis.addEventListener('addthis.menu.share', onShare);
			$element.on('$destroy', function() {
				addthis.removeEventListener('addthis.menu.share', onShare);
			});

			function onShare(response) {
				console.log('shared', response);
				var service = response.data.service;
				ga('send', 'event', 'social_share', $scope.campaignName, service);
				$scope.shared = true;
				saveShared($scope.campaignName);
				$scope.$digest();
			}

			function hasShared(campaignName) {
				return Boolean($window.localStorage.getItem('ghc.share.' + campaignName));
			}

			function saveShared(campaignName) {
				$window.localStorage.setItem('ghc.share.' + campaignName, true);
			}
		}
	};
});