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
				twitter: true,
				facebook: true
			};
			var defaultSharing = {};
			$scope.config = {};
			$scope.sharing = {};


			$scope.$watchGroup(['userSharing', 'userSharing'], onUserSettingsUpdated);

			function onUserSettingsUpdated(newValues) {
				// defaults
				if($scope.userConfig) {
					_.defaults($scope.config, $scope.userConfig, defaultConfig);
				} else {
					$scope.config = _.clone(defaultConfig);
				}

				if($scope.userSharing) {
					_.defaults($scope.sharing, $scope.userSharing, defaultSharing);
				} else {
					$scope.sharing = _.clone(defaultSharing);
				}

				if(!$scope.sharing.title)
					$scope.sharing.title = $state.current.description;
				if(!$scope.sharing.url)
					$scope.sharing.url = $location.absUrl();
				
				// must delay to allow time settings to update
				$timeout(function() {
					addthis.toolbox($element[0], $scope.config, $scope.sharing);
				}, 100);
			}
		}
	}
});