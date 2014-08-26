'use strict';
app.controller('shareView', function($scope, prismic, $window) {
	$scope.fbLikeConfig = {
		facebookShare: false,
		twitter: false
	};
	// $scope.addthisConfig = {
	// };
	// $scope.ksConfig = {
	// }
	$scope.ksSharing = {
		title: 'I love God Hates Charades. It’s the best game ever. This message didn’t get pre populated by a bot.',
		url: 'https://www.kickstarter.com/projects/astrism/god-hates-charades-this-game-makes-your-friends-fu'
	};
	$scope.fanSharing = {
		url: 'https://facebook.com/ghcharades'
	};
	$scope.boardWithLifeSharing = {
		title: 'Watch Bored With Life play God Hates Charades',
		url: 'https://www.youtube.com/watch?v=gjgEoqLm9yk'
	};
	$scope.learnSharing = {
		title: 'God Hates Charades is so simple you can learn it in 46 seconds',
		url: 'https://www.youtube.com/watch?v=mLwIEl59DKg'
	};
	$scope.bowerSharing = {
		title: 'Bower\'s Game Corner: God Hates Charades',
		url: 'https://www.youtube.com/watch?v=a7nIBkO8u0I'
	};
});