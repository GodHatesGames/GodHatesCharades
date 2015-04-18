'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('fixme', {
		url: '/fixme',
		title: 'Fix yoself',
		description: 'If you\'re having account problems, you\'re in the right place',
		templateUrl: 'views/fixme/fixme.html',
		controller: 'fixmeView'
	});
});