'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('mail', {
    url: '/mail',
    abstract: true,
    template: '<ui-view></ui-view>'
  });
});