'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin',
    abstract: true,
    title: 'Admin',
    template: '<ui-view></ui-view>'
  });
});