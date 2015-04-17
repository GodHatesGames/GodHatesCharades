'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('top', {
    url: '/top',
    title: 'Top Pairs',
    description: 'Want to see everyone\'s favorite cards? See the most popular and the most controversial.',
    templateUrl: 'views/top/top.html',
    controller: 'topView',
    abstract: true
  });
});