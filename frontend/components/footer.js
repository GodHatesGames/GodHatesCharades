app.directive('footer', function() {
	return {
		templateUrl: 'components/footer.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			$scope.thisYear = new Date().getFullYear();
		}
	}
});