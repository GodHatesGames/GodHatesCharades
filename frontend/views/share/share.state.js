'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('share', {
		url: '/share',
		title: 'Share',
		description: 'Spread the word about God Hates Charades.',
		templateUrl: 'views/share/share.html',
		controller: 'shareView'
	});
});