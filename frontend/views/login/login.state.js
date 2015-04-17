'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    title: 'Login',
    description: 'Join our community site and help us improve the game.',
    templateUrl: 'views/login/login.html',
    controller: 'loginView'
  });
});