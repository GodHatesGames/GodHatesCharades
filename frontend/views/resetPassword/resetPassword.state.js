'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('reset', {
		url: '/reset',
		title: 'Lose something?',
		description: 'This is for people who lost their way...',
		templateUrl: 'views/resetPassword/resetPassword.html',
		controller: 'resetPasswordView'
	});
});