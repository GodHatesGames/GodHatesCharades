'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin',
    title: 'Admin',
    templateUrl: 'views/admin/admin.html',
    controller: function($scope, User) {
      $scope.User = User;
    }
  });
});