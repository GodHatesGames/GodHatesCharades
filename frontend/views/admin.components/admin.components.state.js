'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('admin.components', {
		url: '/components',
		title: 'Components',
		templateUrl: 'views/admin.components/admin.components.html'
	});
});