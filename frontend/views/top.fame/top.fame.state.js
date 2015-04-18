'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('top.fame', {
    url: '/fame',
    title: 'Hall of Fame',
    description: 'Want to see everyone\'s favorite pairs?',
    templateUrl: 'views/top.detail/top.detail.html',
    controller: 'topView.fame',
    resolve: {
      pairs: ['leaderboard', function(leaderboard) {
        return leaderboard.getTop();
      }]
    }
  });
});