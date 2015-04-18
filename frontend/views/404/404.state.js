'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('404', {
    url: '/404',
    title: 'Page not Found',
    templateUrl: 'views/404/404.html',
    controller: '404View'
  });
});