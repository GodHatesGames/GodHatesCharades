'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('top.shame', {
    url: '/shame',
    title: 'Hall of Shame',
    description: 'Want to see everyone\'s most despised pairs?',
    templateUrl: 'views/top.detail/top.detail.html',
    controller: 'topView.shame',
    resolve: {
      pairs: ['leaderboard', function(leaderboard) {
        return leaderboard.getTop();
      }]
    }
  });
});