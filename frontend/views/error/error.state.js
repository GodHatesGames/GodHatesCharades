'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('error', {
    url: '/error?message',
    title: 'Error accessing page',
    templateUrl: 'views/error/error.html',
    controller: 'errorView'
  });
});