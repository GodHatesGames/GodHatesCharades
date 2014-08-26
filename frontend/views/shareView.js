'use strict';
app.controller('shareView', function($scope, prismic, $window) {
	$scope.fbLikeConfig = {
		facebookShare: false,
		twitter: false
	};
	$scope.addthisConfig = {
	};
	$scope.fanSharing = {
		url: 'https://facebook.com/ghcharades'
	};
	$scope.boardWithLifeSharing = {
		title: 'Watch Bored With Life play God Hates Charades',
		url: 'https://www.youtube.com/watch?v=gjgEoqLm9yk'
	};
	$scope.bowerSharing = {
		title: 'God Hates Charades: This game makes your friends funny!',
		url: 'https://www.youtube.com/watch?v=a7nIBkO8u0I'
	};
	$scope.ksSharing = {
		title: 'God Hates Charades: This game makes your friends funny!',
		url: 'https://www.kickstarter.com/projects/astrism/god-hates-charades-this-game-makes-your-friends-fu'
	};
	$scope.ksConfig = {
	}
});