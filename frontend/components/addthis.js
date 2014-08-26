app.directive('addthis', function($location, $state, $timeout) {
	return {
		templateUrl: 'components/addthis.html',
		replace: true,
		scope: {
			userConfig: '=config',
			userSharing: '=sharing'
		},
		controller: function($scope, $element) {
			var defaultConfig = {
				type: 'buttons',
				twitter: true,
				facebookShare: true,
				facebookLike: true,
			};
			var defaultSharing = {};
			$scope.config = {};
			$scope.sharing = {};

			$timeout(function() {
				$scope.$watchGroup(['userSharing', 'userSharing'], onUserSettingsUpdated);
			}, 1000);

			function onUserSettingsUpdated(newValues) {
				// defaults
				if($scope.userConfig) {
					_.extend($scope.config, $scope.userConfig);
					_.defaults($scope.config, defaultConfig);
				} else {
					$scope.config = _.clone(defaultConfig);
				}

				if($scope.userSharing) {
					_.extend($scope.sharing, $scope.userSharing);
					_.defaults($scope.sharing, defaultSharing);
				} else {
					$scope.sharing = _.clone(defaultSharing);
				}

				if(!$scope.sharing.title)
					$scope.sharing.title = $state.current.description;
				if(!$scope.sharing.url)
					$scope.sharing.url = $location.absUrl();
				
				// must delay to allow time settings to update
				$timeout(function() {
					var child = $element.children('at_ch');
					addthis.toolbox($element[0], $scope.config, $scope.sharing);
				}, 100);
			}
		}
	}
});