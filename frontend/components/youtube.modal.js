app.directive('youtubeModal', function($modal) {
	return {
		restrict: 'A', /* E: Element, C: Class, A: Attribute M: Comment */
		link: function($scope, $element, $attr) {
			$element.bind('click', _show);

			function _show() {
				var video = $scope.$eval($attr.youtubeModal);
				var playerVars = $scope.$eval($attr.playerVars);
				if(video) {
					var modalScope = $scope.$new(true);
					modalScope.video = video;
					if(playerVars) {
						modalScope.playerVars = playerVars;
					}

					var modalInstance = $modal.open({
						templateUrl: 'components/youtube.modal.html',
						scope: modalScope,
						size: 'md'
					});
				} else {
					console.error('youtubeModal: must provide video to load');
				}

			}
		}
	};
})