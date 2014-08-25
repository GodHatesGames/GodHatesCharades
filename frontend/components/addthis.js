app.directive('addthis', function($location, $state) {
	return {
		templateUrl: 'components/addthis.html',
		replace: true,
		scope: {
			config: '=',
			sharing: '=sharing'
		},
		controller: function($scope, $element) {
			var defaultConfig = {
				twitter: true,
				facebook: true
			};
			var defaultSharing = {};

			$scope.$watchGroup(['config', 'sharing'], onUpdated);

			function onUpdated(newValues) {
				if($scope.config) {
					_.defaults($scope.config, defaultConfig);
				}
				console.log('$scope.config:',$scope.config);
				if($scope.sharing) {
					_.defaults($scope.sharing, defaultSharing);
					if(!$scope.sharing.title)
						$scope.sharing.title = $state.current.description;
					if(!$scope.sharing.url)
						$scope.sharing.url = $location.absUrl();
				}
				addthis.toolbox($element[0], $scope.config, $scope.sharing);
			}
		}
	}
});