'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('top.controversial', {
    url: '/controversial',
    title: 'Controversial',
    description: 'Want to see everyone\'s most loved and hated pairs?',
    templateUrl: 'views/top.detail/top.detail.html',
    controller: 'topView.controversial',
    resolve: {
      pairs: function(leaderboard) {
        return leaderboard.getTop();
      }
    }
  });
});