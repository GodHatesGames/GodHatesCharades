'use strict';
app.controller('shareView', function($scope, prismic, $window) {
	$scope.addthisConfig = {
		twitter: false
	};
	$scope.fanSharing = {
		url: 'https://facebook.com/ghcharades'
	};
	$scope.boardWithLifeSharing = {
		url: 'https://www.youtube.com/watch?v=gjgEoqLm9yk'
	};
	$scope.bowerSharing = {
		url: 'https://www.youtube.com/watch?v=a7nIBkO8u0I'
	};
});