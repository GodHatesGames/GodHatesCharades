'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('store.thanks', {
    url: '/thanks',
    description: 'Thanks for buying our shit.',
    templateUrl: 'views/store.thanks/store.thanks.html'
  });
});