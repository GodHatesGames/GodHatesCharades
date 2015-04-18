'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('admin.sets.create', {
		url: '/create',
		title: 'allSets: Create a set',
		templateUrl: 'views/admin.sets.create/admin.sets.create.html',
		controller: 'setsCreateView'
	});
});