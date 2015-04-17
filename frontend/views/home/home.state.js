'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/?vine&youtube',
		description: 'A game where you act out the vile and despicable inside all of us. Talk, shout, and say awful things in the form of 30 second act outs.',
		templateUrl: 'views/home/home.html',
		controller: 'homeView'
	});
});