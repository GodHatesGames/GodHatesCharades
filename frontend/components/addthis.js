app.directive('addthis', function($location, $state) {
	return {
		templateUrl: 'components/addthis.html',
		replace: true,
		scope: {
			config: '=',
			sharing: '=sharing'
		},
		controller: function($scope, $element) {
			var defaultConfig = {};
			var defaultSharing = {};
			$scope.$watchGroup(['config', 'sharing'], onUpdated);

			function onUpdated(newValues) {
				var config = {};
				var sharing = {};
				_.extend(config, defaultConfig, newValues[0]);
				_.extend(sharing, defaultSharing, newValues[1]);
				if(!sharing.title)
					sharing.title = $state.current.description;
				if(!sharing.url)
					sharing.url = $location.absUrl();
				addthis.toolbox($element[0], config, sharing);
			}
		}
	}
});