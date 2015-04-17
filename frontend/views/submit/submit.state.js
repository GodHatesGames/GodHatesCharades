'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('submit', {
    url: '/submit',
    title: 'Create',
    description: 'We need your help coming up with funny new cards. Submit your favorite ideas here.',
    templateUrl: 'views/submitView.html',
    controller: 'submitView'
  });
});